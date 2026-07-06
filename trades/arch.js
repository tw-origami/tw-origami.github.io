// Architect trade — Blueprint Studio. Four floor-plan mechanics: size a room to
// scale, give every room a door, keep the load-bearing walls, and add windows
// for light and escape.
(function(){
  window.TRADES = window.TRADES || {};
  const WALL='#334155', GONE='#cbd5e1', ROOM='#f1f5f9', HALL='#e0f2fe',
        DOOR='#b45309', WIN='#38bdf8', BEAM='#f59e0b';

  function levels(){ return [
    { type:'resize', title:'Size a room to scale',
      goal:'Design a bedroom at least 12 ft × 10 ft, but no bigger than 220 sq ft.',
      teach:'Architects draw on a grid where every square stands for a real distance. Here each square is 2 feet. Use the buttons to change the room until it fits the requirements — watch the size and square footage update.',
      st:{ w:4, h:4 } },

    { type:'doors', title:'Give every room a door',
      goal:'Add a door from each room to the hallway — and don’t cut a door into the outside wall.',
      teach:'A floor plan has to let people move through it. Every room needs a doorway connecting it to a hall or shared space. A “door” on an exterior wall would just be a hole in the side of the house. Tap a wall to add or remove a door.',
      st:{ doors:{ Ah:false, Bh:false, Ch:false, Aext:false, AB:false } } },

    { type:'structure', title:'Open it up — but keep it standing',
      goal:'Remove the two plain walls to open the kitchen, dining, and living areas. Leave the load-bearing wall alone.',
      teach:'Some walls just divide space; others are load-bearing, holding up the roof and the floors above. You can knock out a plain wall to open a room, but removing a load-bearing wall makes the house sag or collapse. The amber wall with the beam is load-bearing.',
      st:{ removed:[false,false,false] } },  // [plain0, beam, plain1]

    { type:'windows', title:'Add windows for light and escape',
      goal:'Put at least one window on an outside wall of each bedroom.',
      teach:'Bedrooms need a window — for daylight, fresh air, and a safe way out in a fire (builders call this “egress”). Windows only go on exterior walls, the ones facing outside. Tap an outside wall segment to add a window.',
      st:{ win:{ L1:false, L2:false, R1:false, R2:false } } },
  ]; }

  // ---------------------------------------------------------------- renderers
  function renderResize(s){
    const st=s.st, U=34, GW=11, GH=9, W=GW*U, H=GH*U;
    const ftW=st.w*2, ftH=st.h*2, area=ftW*ftH;
    let g='';
    for(let i=0;i<=GW;i++) g+=`<line x1="${i*U}" y1="0" x2="${i*U}" y2="${H}" stroke="#e2e8f0" stroke-width="1"/>`;
    for(let j=0;j<=GH;j++) g+=`<line x1="0" y1="${j*U}" x2="${W}" y2="${j*U}" stroke="#e2e8f0" stroke-width="1"/>`;
    const rw=st.w*U, rh=st.h*U;
    g+=`<rect x="0" y="0" width="${rw}" height="${rh}" fill="#ccfbf1" stroke="#0d9488" stroke-width="4"/>`;
    g+=`<text x="${rw/2}" y="${rh/2-4}" text-anchor="middle" font-size="16" font-weight="800" fill="#0f766e">Bedroom</text>`;
    g+=`<text x="${rw/2}" y="${rh/2+16}" text-anchor="middle" font-size="13" font-weight="700" fill="#0f766e">${ftW} × ${ftH} ft</text>`;
    g+=`<text x="${W-4}" y="${H-6}" text-anchor="end" font-size="12" fill="#94a3b8">each square = 2 ft</text>`;
    return `<svg class="board" viewBox="0 0 ${W} ${H}" style="max-width:${W}px">${g}</svg>`;
  }
  function winResize(s){ const w=s.st.w*2,h=s.st.h*2; return w>=12&&h>=10&&(w*h)<=220; }
  function fbResize(s){ const w=s.st.w*2,h=s.st.h*2,a=w*h;
    if(w<12||h<10) return {t:`Too small — ${w} × ${h} ft. A bedroom needs at least 12 × 10 ft.`, cls:'bad'};
    if(a>220) return {t:`Too big — ${a} sq ft. Keep it to 220 sq ft or less.`, cls:'bad'};
    return {t:`Nice — ${w} × ${h} ft = ${a} sq ft. That fits the brief!`, cls:'good'};
  }

  // shared plan frame for door/structure/window levels
  function frame(){ return `<rect x="20" y="20" width="320" height="200" fill="#fff" stroke="${WALL}" stroke-width="8"/>`; }

  function renderDoors(s){
    const d=s.st.doors;
    let g=`<svg class="board" viewBox="0 0 360 240" style="max-width:420px">`;
    // room fills
    g+=`<rect x="24" y="24" width="132" height="94" fill="${ROOM}"/>`;   // A top-left
    g+=`<rect x="24" y="122" width="132" height="94" fill="${ROOM}"/>`;  // B bottom-left
    g+=`<rect x="214" y="24" width="122" height="192" fill="${ROOM}"/>`; // C right
    g+=`<rect x="160" y="24" width="50" height="192" fill="${HALL}"/>`;  // hallway
    g+=frame();
    // interior walls
    g+=`<line x1="160" y1="20" x2="160" y2="220" stroke="${WALL}" stroke-width="8"/>`;
    g+=`<line x1="210" y1="20" x2="210" y2="220" stroke="${WALL}" stroke-width="8"/>`;
    g+=`<line x1="20" y1="120" x2="160" y2="120" stroke="${WALL}" stroke-width="8"/>`;
    // labels
    g+=lbl(90,74,'Bedroom'); g+=lbl(90,172,'Office'); g+=lbl(275,120,'Living'); g+=lbl(185,120,'Hall',10);
    // door slots: id, x, y, orientation ('v' vertical wall / 'h')
    g+=doorSlot('Ah',160,72,'v',d.Ah);
    g+=doorSlot('Bh',160,170,'v',d.Bh);
    g+=doorSlot('Ch',210,120,'v',d.Ch);
    g+=doorSlot('Aext',20,72,'v',d.Aext);
    g+=doorSlot('AB',90,120,'h',d.AB);
    g+=`</svg>`;
    return g;
  }
  function doorSlot(id,x,y,o,on){
    const half=18, col=on?DOOR:'#94a3b8';
    let s='';
    if(on){
      if(o==='v'){ s+=`<rect x="${x-4}" y="${y-half}" width="8" height="${half*2}" fill="#fff"/>`+
        `<path d="M${x},${y-half} A${half*2} ${half*2} 0 0 1 ${x+half*1.6},${y+half}" fill="none" stroke="${DOOR}" stroke-width="2.5"/>`+
        `<line x1="${x}" y1="${y-half}" x2="${x}" y2="${y-half+3}" stroke="${DOOR}" stroke-width="3"/>`; }
      else { s+=`<rect x="${x-half}" y="${y-4}" width="${half*2}" height="8" fill="#fff"/>`+
        `<path d="M${x-half},${y} A${half*2} ${half*2} 0 0 1 ${x+half},${y-half*1.6}" fill="none" stroke="${DOOR}" stroke-width="2.5"/>`; }
    }
    // tap target
    const tx = o==='v'? x-16 : x-half, ty = o==='v'? y-half : y-16;
    const tw = o==='v'? 32 : half*2, th = o==='v'? half*2 : 32;
    s+=`<rect data-id="${id}" x="${tx}" y="${ty}" width="${tw}" height="${th}" fill="${on?'transparent':'rgba(148,163,184,.18)'}" stroke="${col}" stroke-width="${on?0:1.5}" stroke-dasharray="4 3" rx="3" style="cursor:pointer"/>`;
    return s;
  }
  function winDoors(s){ const d=s.st.doors; return d.Ah&&d.Bh&&d.Ch&&!d.Aext; }
  function fbDoors(s){ const d=s.st.doors;
    if(d.Aext) return {t:'That door opens to the outside — a hole in the house wall. Remove it.', cls:'bad'};
    const n=[d.Ah,d.Bh,d.Ch].filter(Boolean).length;
    if(n<3) return {t:`${n} of 3 rooms reach the hallway. Every room needs a door to the hall.`, cls:''};
    return {t:'Every room opens to the hallway — the plan flows!', cls:'good'};
  }

  function renderStructure(s){
    const r=s.st.removed;
    let g=`<svg class="board" viewBox="0 0 360 240" style="max-width:420px">`;
    g+=`<rect x="24" y="24" width="312" height="192" fill="${ROOM}"/>`;
    g+=frame();
    g+=iwall(0,120,r[0],'wall'); // plain0
    g+=iwall(1,192,r[1],'beam'); // load-bearing
    g+=iwall(2,264,r[2],'wall'); // plain1
    g+=lbl(72,130,'Kitchen',10); g+=lbl(156,130,'Dining',10); g+=lbl(228,130,'Living',10); g+=lbl(300,130,'Entry',10);
    g+=`</svg>`;
    return g;
  }
  function iwall(id,x,removed,kind){
    const bearing = kind==='beam';
    if(removed) return `<line data-id="${id}" x1="${x}" y1="20" x2="${x}" y2="220" stroke="${GONE}" stroke-width="4" stroke-dasharray="6 6" style="cursor:pointer"/>`;
    const col = bearing?BEAM:WALL;
    let s=`<line x1="${x}" y1="20" x2="${x}" y2="220" stroke="${col}" stroke-width="8" style="cursor:pointer"/>`;
    if(bearing) s+=`<text x="${x}" y="16" text-anchor="middle" font-size="13">🏗️</text>`;
    s+=`<rect data-id="${id}" x="${x-9}" y="20" width="18" height="200" fill="transparent" style="cursor:pointer"/>`;
    return s;
  }
  function winStructure(s){ const r=s.st.removed; return r[0]&&r[2]&&!r[1]; }
  function fbStructure(s){ const r=s.st.removed;
    if(r[1]) return {t:'The roof sags! That amber wall was load-bearing — tap it to put it back.', cls:'bad'};
    if(!(r[0]&&r[2])) return {t:'Take out both plain walls to open up the space.', cls:''};
    return {t:'Open floor plan — and the load-bearing wall still holds the roof up!', cls:'good'};
  }

  function renderWindows(s){
    const w=s.st.win;
    let g=`<svg class="board" viewBox="0 0 360 240" style="max-width:420px">`;
    g+=`<rect x="24" y="24" width="152" height="192" fill="${ROOM}"/>`;
    g+=`<rect x="184" y="24" width="152" height="192" fill="${ROOM}"/>`;
    g+=frame();
    g+=`<line x1="180" y1="20" x2="180" y2="220" stroke="${WALL}" stroke-width="8"/>`; // interior divider
    g+=lbl(100,124,'Bedroom 1'); g+=lbl(260,124,'Bedroom 2');
    // window slots on exterior walls: id,x,y,orientation
    g+=winSlot('L1',70,20,'h',w.L1);   // BR1 top wall
    g+=winSlot('L2',20,150,'v',w.L2);  // BR1 left wall
    g+=winSlot('R1',250,20,'h',w.R1);  // BR2 top wall
    g+=winSlot('R2',340,150,'v',w.R2); // BR2 right wall
    g+=`</svg>`;
    return g;
  }
  function winSlot(id,x,y,o,on){
    const half=20; let s='';
    if(on){
      if(o==='h'){ s+=`<rect x="${x-half}" y="${y-4}" width="${half*2}" height="8" fill="#fff"/>`+
        `<line x1="${x-half}" y1="${y}" x2="${x+half}" y2="${y}" stroke="${WIN}" stroke-width="4"/>`+
        `<line x1="${x-half}" y1="${y-3}" x2="${x+half}" y2="${y-3}" stroke="${WIN}" stroke-width="1.5"/>`+
        `<line x1="${x-half}" y1="${y+3}" x2="${x+half}" y2="${y+3}" stroke="${WIN}" stroke-width="1.5"/>`; }
      else { s+=`<rect x="${x-4}" y="${y-half}" width="8" height="${half*2}" fill="#fff"/>`+
        `<line x1="${x}" y1="${y-half}" x2="${x}" y2="${y+half}" stroke="${WIN}" stroke-width="4"/>`+
        `<line x1="${x-3}" y1="${y-half}" x2="${x-3}" y2="${y+half}" stroke="${WIN}" stroke-width="1.5"/>`+
        `<line x1="${x+3}" y1="${y-half}" x2="${x+3}" y2="${y+half}" stroke="${WIN}" stroke-width="1.5"/>`; }
    }
    const tx=o==='h'?x-half:x-14, ty=o==='h'?y-14:y-half, tw=o==='h'?half*2:28, th=o==='h'?28:half*2;
    s+=`<rect data-id="${id}" x="${tx}" y="${ty}" width="${tw}" height="${th}" fill="${on?'transparent':'rgba(56,189,248,.16)'}" stroke="${WIN}" stroke-width="${on?0:1.5}" stroke-dasharray="4 3" rx="3" style="cursor:pointer"/>`;
    return s;
  }
  function winWindows(s){ const w=s.st.win; return (w.L1||w.L2)&&(w.R1||w.R2); }
  function fbWindows(s){ const w=s.st.win; const l=w.L1||w.L2, r=w.R1||w.R2;
    if(l&&r) return {t:'Both bedrooms have a window — daylight and a safe exit!', cls:'good'};
    const need=[!l?'Bedroom 1':null,!r?'Bedroom 2':null].filter(Boolean).join(' and ');
    return {t:`${need} still needs a window on an outside wall.`, cls:''};
  }

  function lbl(x,y,t,size){ return `<text x="${x}" y="${y}" text-anchor="middle" font-size="${size||12}" font-weight="800" fill="#64748b">${t}</text>`; }

  const R={ resize:{r:renderResize,win:winResize,fb:fbResize},
            doors:{r:renderDoors,win:winDoors,fb:fbDoors},
            structure:{r:renderStructure,win:winStructure,fb:fbStructure},
            windows:{r:renderWindows,win:winWindows,fb:fbWindows} };

  function tap(s,id){
    if(s.type==='doors') s.st.doors[id]=!s.st.doors[id];
    else if(s.type==='structure') s.st.removed[+id]=!s.st.removed[+id];
    else if(s.type==='windows') s.st.win[id]=!s.st.win[id];
  }
  function step(s,act){ const st=s.st;
    if(act==='w-') st.w=Math.max(2,st.w-1); else if(act==='w+') st.w=Math.min(11,st.w+1);
    else if(act==='h-') st.h=Math.max(2,st.h-1); else if(act==='h+') st.h=Math.min(9,st.h+1);
  }
  function resetLevel(s, orig){ s.st = JSON.parse(JSON.stringify(orig)); }

  TRADES.arch = {
    icon:'📐', name:'Architect',
    mount(stage, helpers){
      const L=levels(); let li=0;
      const originals=L.map(l=>JSON.parse(JSON.stringify(l.st)));

      function draw(){
        const s=L[li], mod=R[s.type], won=mod.win(s), fb=mod.fb(s);
        let extra='';
        if(s.type==='resize'){
          extra=`<div class="controls" style="margin-top:12px">`+
            `<div class="pill">Width <button class="btn" data-act="w-" style="padding:4px 12px;margin-left:6px">−</button> <button class="btn" data-act="w+" style="padding:4px 12px">+</button></div>`+
            `<div class="pill">Depth <button class="btn" data-act="h-" style="padding:4px 12px;margin-left:6px">−</button> <button class="btn" data-act="h+" style="padding:4px 12px">+</button></div>`+
          `</div>`;
        }
        stage.innerHTML=
          `<div class="lvlbar">`+
            `<span class="pill lvl" style="color:#7c3aed">📐 Blueprint Studio</span>`+
            `<span class="pill">Level ${li+1} / ${L.length}</span>`+
          `</div>`+
          `<div class="card">`+
            `<div class="goal" style="background:#ede9fe"><span class="g-ic">🎯</span><span>${s.goal}</span></div>`+
            `<p class="teach">${s.teach}</p>`+
            `<div style="display:flex;justify-content:center">`+mod.r(s)+`</div>`+
            extra+
            `<div class="feedback ${fb.cls}">${fb.t}</div>`+
            `<div class="controls">`+
              `<button class="btn btn-ghost" id="reset">↺ Reset</button>`+
              (won ? (li<L.length-1
                 ? `<button class="btn btn-primary" id="next" style="background:#7c3aed">Next level ▶</button>`
                 : `<button class="btn btn-gold" id="menu2">🏆 Finish — back to trades</button>`) : '')+
            `</div>`+
          `</div>`;

        stage.querySelectorAll('[data-id]').forEach(t=>t.addEventListener('click',()=>{
          const was=R[L[li].type].win(L[li]); tap(s,t.getAttribute('data-id')); draw();
          if(!was && R[L[li].type].win(L[li])) helpers.celebrate();
        }));
        stage.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{
          const was=R[L[li].type].win(L[li]); step(s,b.getAttribute('data-act')); draw();
          if(!was && R[L[li].type].win(L[li])) helpers.celebrate();
        }));
        const rb=stage.querySelector('#reset'); if(rb) rb.onclick=()=>{ resetLevel(s,originals[li]); draw(); };
        const nx=stage.querySelector('#next'); if(nx) nx.onclick=()=>{ li++; draw(); };
        const m2=stage.querySelector('#menu2'); if(m2) m2.onclick=()=>helpers.toMenu();
      }
      draw();
    }
  };
})();
