// Plumber trade — Pipe It. Rotate pipe fittings to run water from the source
// to every fixture with no open ends leaking. Live: water floods the instant a
// sealed path connects.
(function(){
  window.TRADES = window.TRADES || {};
  const WATER='#0ea5e9', PIPE='#cbd5e1', LEAK='#dc2626';

  // dir: 0=N 1=E 2=S 3=W. offsets and opposite.
  const OFF=[[-1,0],[0,1],[1,0],[0,-1]];
  const opp=d=>(d+2)%4;

  // base openings (before rotation) per fitting type
  const BASE={ straight:[0,2], elbow:[0,1], tee:[0,1,2], cross:[0,1,2,3] };

  function openings(c){
    if(!c) return [];
    if(c.t==='src'||c.t==='sink') return [c.dir];
    if(c.t==='valve') return c.open ? rot(BASE.straight, c.rot) : [];
    return rot(BASE[c.t], c.rot||0);
  }
  function rot(base, r){ r=((r||0)%4+4)%4; return base.map(d=>(d+r)%4); }
  const interactive=c=>c && (c.t==='straight'||c.t==='elbow'||c.t==='tee'||c.t==='valve');

  // ---- levels ---------------------------------------------------------------
  function levels(){ return [
    { title:'Run the supply line', rows:1, cols:3,
      goal:'Rotate the pipe so water reaches the faucet.',
      teach:'Fresh water is pushed through pipes under pressure from the main supply. It can only get to your faucet if the pipes line up into one sealed path. Tap a pipe to rotate it.',
      grid:[[ {t:'src',dir:1}, {t:'straight',rot:0}, {t:'sink',dir:3} ]] },

    { title:'Turn the corner', rows:2, cols:2,
      goal:'Aim both elbow joints so the water rounds the corner to the faucet.',
      teach:'Pipes rarely run straight. An elbow (a 90° fitting) lets a line change direction. Rotate each elbow so its two open ends point the right way.',
      grid:[[ {t:'src',dir:1}, {t:'elbow',rot:0} ],
            [ {t:'sink',dir:1}, {t:'elbow',rot:0} ]] },

    { title:'Add a shut-off valve', rows:1, cols:4,
      goal:'Line up the pipe and OPEN the valve to let water through.',
      teach:'A valve is a control you can open or close to stop the flow — handy when fixing a sink so you don’t flood the house. Closed means no water gets past. Rotate the pipe, then tap the valve handle to open it.',
      grid:[[ {t:'src',dir:1}, {t:'straight',rot:0}, {t:'valve',rot:1,open:false}, {t:'sink',dir:3} ]] },

    { title:'Branch with a tee', rows:3, cols:3,
      goal:'Aim the tee so it feeds BOTH fixtures at once.',
      teach:'A tee fitting has three openings, so one supply line can split to serve two fixtures — like a sink and a tub. Rotate the tee until all three ends connect.',
      grid:[[ null, {t:'sink',dir:2}, null ],
            [ {t:'src',dir:1}, {t:'tee',rot:0}, {t:'sink',dir:3} ],
            [ null, null, null ]] },

    { title:'Build a P-trap', rows:2, cols:2,
      goal:'Bend the drain down and back up to form the U-shaped trap.',
      teach:'Under every sink is a U-shaped bend called a P-trap. It stays full of water, and that little pool blocks smelly sewer gas from coming up the drain. Shape the two elbows into a U.',
      grid:[[ {t:'src',dir:2}, {t:'sink',dir:2} ],
            [ {t:'elbow',rot:1}, {t:'elbow',rot:0} ]] },
  ]; }

  // ---- flood + leaks --------------------------------------------------------
  function analyze(s){
    const {rows,cols,grid}=s;
    const at=(r,c)=> (r>=0&&r<rows&&c>=0&&c<cols) ? grid[r][c] : undefined;
    const key=(r,c)=>r+','+c;
    const filled=new Set(), q=[];
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++) if(grid[r][c] && grid[r][c].t==='src'){ filled.add(key(r,c)); q.push([r,c]); }
    while(q.length){
      const [r,c]=q.shift(), op=openings(grid[r][c]);
      op.forEach(d=>{
        const nr=r+OFF[d][0], nc=c+OFF[d][1], nb=at(nr,nc);
        if(nb && openings(nb).includes(opp(d)) && !filled.has(key(nr,nc))){ filled.add(key(nr,nc)); q.push([nr,nc]); }
      });
    }
    // leaks: a filled opening whose neighbor doesn't accept it
    const leaks=[];
    filled.forEach(k=>{ const [r,c]=k.split(',').map(Number);
      openings(grid[r][c]).forEach(d=>{
        const nr=r+OFF[d][0], nc=c+OFF[d][1], nb=at(nr,nc);
        if(!nb || !openings(nb).includes(opp(d))) leaks.push({r,c,d});
      });
    });
    // all sinks filled?
    let sinks=0, sinksFilled=0;
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){ const cell=grid[r][c]; if(cell&&cell.t==='sink'){ sinks++; if(filled.has(key(r,c))) sinksFilled++; } }
    return { filled, leaks, sinks, sinksFilled, win: sinks>0 && sinksFilled===sinks && leaks.length===0 };
  }

  // ---- render ---------------------------------------------------------------
  const CELL=98, HALF=CELL/2, PW=13;
  function edge(cx,cy,d){ return d===0?[cx,cy-HALF]:d===1?[cx+HALF,cy]:d===2?[cx,cy+HALF]:[cx-HALF,cy]; }

  function boardHTML(s, an){
    const {rows,cols,grid}=s, W=cols*CELL, H=rows*CELL;
    let out=`<svg class="board" viewBox="0 0 ${W} ${H}">`;
    // subtle cell backgrounds
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){ if(!grid[r][c]) continue;
      out+=`<rect x="${c*CELL+4}" y="${r*CELL+4}" width="${CELL-8}" height="${CELL-8}" rx="12" fill="#f8fafc" stroke="#eef2f7" stroke-width="2"/>`;
    }
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
      const cell=grid[r][c]; if(!cell) continue;
      const cx=c*CELL+HALF, cy=r*CELL+HALF, wet=an.filled.has(r+','+c);
      const ops=openings(cell), col=wet?WATER:PIPE;
      // pipe arms
      ops.forEach(d=>{ const [ex,ey]=edge(cx,cy,d);
        out+=`<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${col}" stroke-width="${PW}" stroke-linecap="round"/>`;
        if(wet) out+=`<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="#bae6fd" stroke-width="5" stroke-linecap="round" class="live-flow"/>`;
      });
      // hub
      out+=`<circle cx="${cx}" cy="${cy}" r="${PW/2+1}" fill="${col}"/>`;
      // node decorations
      if(cell.t==='src') out+=nodeBadge(cx,cy,'#0284c7','🚰');
      else if(cell.t==='sink') out+=nodeBadge(cx,cy,'#16a34a','🚿');
      else if(cell.t==='valve'){ const g=cell.open?'#16a34a':'#dc2626';
        out+=`<circle cx="${cx}" cy="${cy}" r="15" fill="#fff" stroke="${g}" stroke-width="3"/>`+
             `<text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="15">${cell.open?'✓':'✕'}</text>`; }
      // tap target
      if(interactive(cell)) out+=`<rect data-r="${r}" data-c="${c}" x="${c*CELL}" y="${r*CELL}" width="${CELL}" height="${CELL}" fill="transparent" style="cursor:pointer"/>`;
    }
    // leak drips
    an.leaks.forEach(l=>{ const cx=l.c*CELL+HALF, cy=l.r*CELL+HALF, [ex,ey]=edge(cx,cy,l.d);
      out+=`<circle cx="${ex}" cy="${ey}" r="7" fill="${LEAK}"/><text x="${ex}" y="${ey+4}" text-anchor="middle" font-size="11">💧</text>`; });
    out+=`</svg>`;
    return out;
  }
  function nodeBadge(cx,cy,color,emoji){
    return `<circle cx="${cx}" cy="${cy}" r="16" fill="#fff" stroke="${color}" stroke-width="3"/>`+
           `<text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="17">${emoji}</text>`;
  }

  function statusLine(s, an){
    if(an.win) return {t:'Water’s flowing — every fixture is fed and nothing leaks!', cls:'good'};
    if(an.leaks.length) return {t:`💧 ${an.leaks.length} open end${an.leaks.length>1?'s are':' is'} leaking — seal every pipe.`, cls:'bad'};
    if(an.sinks>1) return {t:`${an.sinksFilled} of ${an.sinks} fixtures have water.`, cls:''};
    return {t:'No water yet — connect the pipes into one path.', cls:''};
  }

  function tap(s,r,c){ const cell=s.grid[r][c];
    if(cell.t==='valve') cell.open=!cell.open;
    else cell.rot=((cell.rot||0)+1)%4;
  }
  function reset(s, orig){ // restore starting rotations
    for(let r=0;r<s.rows;r++)for(let c=0;c<s.cols;c++){ const a=s.grid[r][c], b=orig[r][c];
      if(a&&interactive(a)){ a.rot=b.rot; if(a.t==='valve') a.open=b.open; } }
  }

  TRADES.plumb = {
    icon:'🚿', name:'Plumber',
    mount(stage, helpers){
      const L=levels(); let li=0;
      const originals = L.map(lv=> lv.grid.map(row=>row.map(c=>c?Object.assign({},c):null)) );

      function draw(){
        const s=L[li], an=analyze(s), st=statusLine(s,an);
        stage.innerHTML=
          `<div class="lvlbar">`+
            `<span class="pill lvl" style="color:#0ea5e9">🚿 Pipe It</span>`+
            `<span class="pill">Level ${li+1} / ${L.length}</span>`+
          `</div>`+
          `<div class="card">`+
            `<div class="goal" style="background:#e0f2fe"><span class="g-ic">🎯</span><span>${s.goal}</span></div>`+
            `<p class="teach">${s.teach}</p>`+
            `<div style="max-width:${Math.min(s.cols*CELL,420)}px;margin:0 auto">`+boardHTML(s,an)+`</div>`+
            `<div class="feedback ${st.cls}">${st.t}</div>`+
            `<div class="controls">`+
              `<button class="btn btn-ghost" id="reset">↺ Reset</button>`+
              (an.win ? (li<L.length-1
                 ? `<button class="btn btn-primary" id="next" style="background:#0ea5e9">Next level ▶</button>`
                 : `<button class="btn btn-gold" id="menu2">🏆 Finish — back to trades</button>`) : '')+
            `</div>`+
          `</div>`;

        stage.querySelectorAll('[data-r]').forEach(t=>{
          t.addEventListener('click', ()=>{ const was=analyze(L[li]).win;
            tap(s, +t.getAttribute('data-r'), +t.getAttribute('data-c')); draw();
            if(!was && analyze(L[li]).win) helpers.celebrate(); });
        });
        const rb=stage.querySelector('#reset'); if(rb) rb.onclick=()=>{ reset(s, originals[li]); draw(); };
        const nx=stage.querySelector('#next'); if(nx) nx.onclick=()=>{ li++; draw(); };
        const m2=stage.querySelector('#menu2'); if(m2) m2.onclick=()=>helpers.toMenu();
      }
      draw();
    }
  };
})();
