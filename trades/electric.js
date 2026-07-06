// Electrician trade — Circuit Lab. Live circuits: the board lights the moment
// the loop is complete. Each level teaches one idea by making the kid build it.
(function(){
  window.TRADES = window.TRADES || {};

  const WIRE = '#94a3b8', LIVE = '#f59e0b';

  // ---- level definitions ----------------------------------------------------
  // Each level owns its interactive parts and a win() test. type drives layout.
  function levels(){ return [
    { type:'series', title:'Complete the loop',
      goal:'Connect the broken wire so the bulb lights up.',
      teach:'Electricity only flows in a complete loop, called a circuit. If there is any gap, nothing happens. Tap the broken wire to join it.',
      parts:[ {type:'gap', on:false}, {type:'bulb'} ],
      win:s=>lit(s) },

    { type:'series', title:'Add a switch',
      goal:'Flip the switch to turn the light ON.',
      teach:'A switch is just a gap you can open and close on purpose. Closed = the loop is whole and current flows. Open = the loop is broken and the light goes off.',
      parts:[ {type:'switch', closed:false}, {type:'bulb'} ],
      win:s=>lit(s) },

    { type:'series', title:'Conductor or insulator?',
      goal:'Choose the material that lets current pass through.',
      teach:'Some materials (metals like copper) let electricity flow — conductors. Others (rubber, wood) block it — insulators. That is why wires are copper inside and rubber outside. Tap the block to swap the material.',
      parts:[ {type:'material', i:0, opts:[ {n:'Rubber',c:false,e:'🧽'}, {n:'Wood',c:false,e:'🪵'}, {n:'Copper',c:true,e:'🟠'} ] }, {type:'bulb'} ],
      win:s=>lit(s) },

    { type:'series', title:'Two bulbs in a row (series)',
      goal:'Close the loop to light BOTH bulbs — then look how bright they are.',
      teach:'Wiring bulbs one after another is a series circuit. The same current must pass through both, so each bulb gets less — they glow dimmer. Old holiday lights worked this way: one dead bulb broke the whole string.',
      parts:[ {type:'gap', on:false}, {type:'bulb'}, {type:'bulb'} ],
      win:s=>lit(s) },

    { type:'parallel', title:'Two bulbs side by side (parallel)',
      goal:'Turn on both switches. Notice each bulb stays fully bright.',
      teach:'A parallel circuit gives each bulb its own loop back to the battery. Every bulb gets full power, and switching one off leaves the other glowing. This is how the lights in your house are wired.',
      branches:[ {closed:false}, {closed:false} ],
      win:s=>s.branches[0].closed && s.branches[1].closed },

    { type:'overload', title:'Don’t blow the fuse',
      goal:'The fuse is rated for 2 bulbs but 3 are switched on. Turn bulbs off until the fuse stops blowing.',
      teach:'Too much current makes wires overheat, so a fuse (or breaker) cuts the power to keep your house safe. Plug in too many things and it trips. Tap bulbs to switch them off until the load is safe.',
      rating:2, bulbs:[ {on:true}, {on:true}, {on:true} ],
      win:s=>{ const n=s.bulbs.filter(b=>b.on).length; return n>=1 && n<=s.rating; } },
  ]; }

  // ---- circuit logic --------------------------------------------------------
  function conducts(p){
    if(p.type==='gap') return p.on;
    if(p.type==='switch') return p.closed;
    if(p.type==='material') return p.opts[p.i].c;
    return true; // wire, bulb
  }
  function seriesComplete(s){ return s.parts.every(conducts); }
  function seriesLoad(s){ return s.parts.filter(p=>p.type==='bulb').length; }
  function lit(s){ return seriesComplete(s); }

  // ---- svg helpers ----------------------------------------------------------
  const NS='http://www.w3.org/2000/svg';
  function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

  function bulbSVG(cx, cy, glow){
    const g = glow>0
      ? `<circle cx="${cx}" cy="${cy}" r="${26+glow*10}" fill="#fcd34d" opacity="${.35+glow*.5}"/>`
      : '';
    const face = glow>0 ? '#fbbf24' : '#e2e8f0';
    return g +
      `<circle cx="${cx}" cy="${cy}" r="20" fill="${face}" stroke="#64748b" stroke-width="2"/>`+
      `<path d="M${cx-9},${cy-3} l6,7 l4,-11 l6,9" fill="none" stroke="#64748b" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`+
      `<rect x="${cx-9}" y="${cy+18}" width="18" height="9" rx="2" fill="#94a3b8"/>`;
  }

  // component body sitting above the top rail, with a stub down to it
  function moduleSVG(idx, cx, railY, inner, label, tappable){
    const bx=cx-38, by=railY-64, cursor = tappable?'cursor:pointer':'';
    return `<g data-idx="${idx}" style="${cursor}">`+
      `<line x1="${cx}" y1="${railY-24}" x2="${cx}" y2="${railY}" stroke="${WIRE}" stroke-width="6" stroke-linecap="round"/>`+
      `<rect x="${bx}" y="${by}" width="76" height="46" rx="11" fill="#fff" stroke="#cbd5e1" stroke-width="2"/>`+
      inner+
      `<text x="${cx}" y="${by+62}" text-anchor="middle" class="comp-label" fill="#475569">${esc(label)}</text>`+
      `</g>`;
  }

  // ---- renderers ------------------------------------------------------------
  function renderSeries(s){
    const W=600, railY=150, xL=60, xR=540, batW=64;
    const n=s.parts.length;
    const xs=[]; for(let i=0;i<n;i++){ xs.push(xL+90 + i*((xR-90-(xL+90))/Math.max(1,n-1)||0)); }
    if(n===1) xs[0]=(xL+xR)/2;
    const complete=seriesComplete(s), load=seriesLoad(s), on=complete;
    const bright = on ? (load>=2 ? .5 : .9) : 0;

    let rail = `<path d="M${xL},250 V${railY} H${xR} V250 H${xL} Z" fill="none" stroke="${on?LIVE:WIRE}" stroke-width="6" stroke-linecap="round" ${on?'class="live-flow"':''}/>`;
    // battery on the bottom rail
    const bcx=(xL+xR)/2;
    let battery = `<rect x="${bcx-batW/2}" y="237" width="${batW}" height="26" rx="5" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>`+
      `<text x="${bcx}" y="254" text-anchor="middle" font-size="13" font-weight="800" fill="#b45309">🔋 9V</text>`;

    let comps='';
    s.parts.forEach((p,i)=>{
      const cx=xs[i];
      if(p.type==='bulb'){
        comps += `<g>${bulbSVG(cx, railY-40, bright)}`+
          `<line x1="${cx}" y1="${railY-16}" x2="${cx}" y2="${railY}" stroke="${WIRE}" stroke-width="6" stroke-linecap="round"/></g>`;
      } else if(p.type==='gap'){
        const inner = p.on
          ? `<text x="${cx}" y="${railY-35}" text-anchor="middle" font-size="20">🔗</text>`
          : `<text x="${cx}" y="${railY-35}" text-anchor="middle" font-size="20">✂️</text>`;
        comps += moduleSVG(i, cx, railY, inner, p.on?'joined':'tap to join', true);
        if(!p.on) comps += `<circle cx="${cx}" cy="${railY}" r="6" fill="#fff" stroke="${WIRE}" stroke-width="2"/>`;
      } else if(p.type==='switch'){
        const lx2 = p.closed ? cx+16 : cx+10, ly2 = p.closed ? railY-41 : railY-52;
        const inner = `<circle cx="${cx-16}" cy="${railY-41}" r="4" fill="#64748b"/>`+
          `<circle cx="${cx+16}" cy="${railY-41}" r="4" fill="#64748b"/>`+
          `<line x1="${cx-16}" y1="${railY-41}" x2="${lx2}" y2="${ly2}" stroke="#334155" stroke-width="4" stroke-linecap="round"/>`;
        comps += moduleSVG(i, cx, railY, inner, p.closed?'ON':'OFF — tap', true);
        if(!p.closed) comps += `<circle cx="${cx}" cy="${railY}" r="6" fill="#fff" stroke="${WIRE}" stroke-width="2"/>`;
      } else if(p.type==='material'){
        const o=p.opts[p.i];
        const inner = `<text x="${cx}" y="${railY-34}" text-anchor="middle" font-size="20">${o.e}</text>`;
        comps += moduleSVG(i, cx, railY, inner, o.n, true);
        if(!o.c) comps += `<circle cx="${cx}" cy="${railY}" r="6" fill="#fff" stroke="${WIRE}" stroke-width="2"/>`;
      }
    });
    return `<svg class="board" viewBox="0 0 ${W} 300">${rail}${battery}${comps}</svg>`;
  }

  function renderParallel(s){
    const W=600, xBat=70, xJoinL=150, xJoinR=470, topY=90, botY=230;
    const main = s.branches.some(b=>b.closed);
    // rails: battery up the left to a bus, two horizontal branches, back down right bus
    let out = `<svg class="board" viewBox="0 0 ${W} 300">`;
    // left + right vertical buses
    out += `<line x1="${xJoinL}" y1="${topY}" x2="${xJoinL}" y2="${botY}" stroke="${WIRE}" stroke-width="6"/>`;
    out += `<line x1="${xJoinR}" y1="${topY}" x2="${xJoinR}" y2="${botY}" stroke="${WIRE}" stroke-width="6"/>`;
    // battery loop on the left
    out += `<path d="M${xJoinL},${botY} H${xBat} V${(topY+botY)/2}" fill="none" stroke="${main?LIVE:WIRE}" stroke-width="6" ${main?'class="live-flow"':''}/>`;
    out += `<path d="M${xBat},${(topY+botY)/2} V${topY} H${xJoinL}" fill="none" stroke="${main?LIVE:WIRE}" stroke-width="6" ${main?'class="live-flow"':''}/>`;
    out += `<rect x="${xBat-22}" y="${(topY+botY)/2-15}" width="44" height="30" rx="5" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>`+
      `<text x="${xBat}" y="${(topY+botY)/2+5}" text-anchor="middle" font-size="12" font-weight="800" fill="#b45309">🔋</text>`;
    // two branches
    const ys=[topY, botY];
    s.branches.forEach((b,i)=>{
      const y=ys[i], cx=(xJoinL+xJoinR)/2;
      const on=b.closed;
      out += `<line x1="${xJoinL}" y1="${y}" x2="${cx-70}" y2="${y}" stroke="${on?LIVE:WIRE}" stroke-width="6" ${on?'class="live-flow"':''}/>`;
      out += `<line x1="${cx+40}" y1="${y}" x2="${xJoinR}" y2="${y}" stroke="${on?LIVE:WIRE}" stroke-width="6" ${on?'class="live-flow"':''}/>`;
      // switch (tappable)
      const sx=cx-70;
      out += `<g data-idx="${i}" style="cursor:pointer">`+
        `<circle cx="${sx}" cy="${y}" r="5" fill="#64748b"/>`+
        `<circle cx="${sx+34}" cy="${y}" r="5" fill="#64748b"/>`+
        `<line x1="${sx}" y1="${y}" x2="${on?sx+34:sx+26}" y2="${on?y:y-16}" stroke="#334155" stroke-width="5" stroke-linecap="round"/>`+
        `<text x="${sx+17}" y="${y+26}" text-anchor="middle" class="comp-label" fill="#475569">${on?'ON':'tap'}</text>`+
        `<line x1="${sx+34}" y1="${y}" x2="${cx-40}" y2="${y}" stroke="${on?LIVE:WIRE}" stroke-width="6" ${on?'class="live-flow"':''}/>`+
        `</g>`;
      // bulb
      out += bulbSVG(cx, y, on?.9:0);
    });
    out += `</svg>`;
    return out;
  }

  function renderOverload(s){
    const W=600, railY=150, xL=60, xR=540;
    const on=s.bulbs.filter(b=>b.on).length;
    const blown = on>s.rating;
    const live = on>0 && !blown;
    let rail = `<path d="M${xL},250 V${railY} H${xR} V250 H${xL} Z" fill="none" stroke="${live?LIVE:WIRE}" stroke-width="6" stroke-linecap="round" ${live?'class="live-flow"':''}/>`;
    const bcx=140;
    let battery = `<rect x="${bcx-32}" y="237" width="64" height="26" rx="5" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>`+
      `<text x="${bcx}" y="254" text-anchor="middle" font-size="13" font-weight="800" fill="#b45309">🔋 9V</text>`;
    // fuse on the top rail near the battery side
    const fx=170, fcol = blown ? '#dc2626' : (live?LIVE:'#64748b');
    let fuse = `<g><rect x="${fx-30}" y="${railY-64}" width="60" height="46" rx="11" fill="#fff" stroke="${fcol}" stroke-width="2.5"/>`+
      `<text x="${fx}" y="${railY-34}" text-anchor="middle" font-size="19">${blown?'💥':'🧯'}</text>`+
      `<text x="${fx}" y="${railY-2}" text-anchor="middle" class="comp-label" fill="${fcol}">fuse: ${s.rating}A</text>`+
      `<line x1="${fx}" y1="${railY-18}" x2="${fx}" y2="${railY}" stroke="${blown?'#dc2626':WIRE}" stroke-width="6"/>`;
    if(blown) fuse += `<circle cx="${fx}" cy="${railY}" r="6" fill="#fff" stroke="#dc2626" stroke-width="2"/>`;
    fuse += `</g>`;
    // three tappable bulbs across the rail
    let comps='';
    const xs=[300,390,480];
    s.bulbs.forEach((b,i)=>{
      const cx=xs[i], glow = (b.on && live) ? .9 : 0;
      comps += `<g data-idx="${i}" style="cursor:pointer">`+
        bulbSVG(cx, railY-40, glow)+
        `<line x1="${cx}" y1="${railY-16}" x2="${cx}" y2="${railY}" stroke="${WIRE}" stroke-width="6" stroke-linecap="round"/>`+
        `<text x="${cx}" y="${railY+22}" text-anchor="middle" class="comp-label" fill="#475569">${b.on?'ON — tap':'off'}</text>`+
        `</g>`;
    });
    return `<svg class="board" viewBox="0 0 ${W} 300">${rail}${battery}${fuse}${comps}</svg>`;
  }

  function boardHTML(s){
    if(s.type==='parallel') return renderParallel(s);
    if(s.type==='overload') return renderOverload(s);
    return renderSeries(s);
  }

  // handle a tap on a component
  function tap(s, idx){
    if(s.type==='parallel'){ const b=s.branches[idx]; b.closed=!b.closed; return; }
    if(s.type==='overload'){ const b=s.bulbs[idx]; b.on=!b.on; return; }
    const p=s.parts[idx];
    if(p.type==='gap') p.on=!p.on;
    else if(p.type==='switch') p.closed=!p.closed;
    else if(p.type==='material') p.i=(p.i+1)%p.opts.length;
  }

  function statusLine(s){
    if(s.type==='overload'){
      const n=s.bulbs.filter(b=>b.on).length;
      if(n>s.rating) return {t:`⚡ ${n}A load — fuse blown! Power is cut.`, cls:'bad'};
      if(n===0) return {t:'No bulbs on — nothing is drawing power.', cls:''};
      return {t:`✅ ${n}A load — under the ${s.rating}A limit. Safe!`, cls:'good'};
    }
    if(s.type==='parallel'){
      const n=s.branches.filter(b=>b.closed).length;
      return {t: n===2?'Both bulbs lit — and each glows at full brightness.' : `${n} of 2 bulbs on.`, cls: n===2?'good':''};
    }
    if(seriesComplete(s)){
      const load=seriesLoad(s);
      return {t: load>=2 ? 'Lit! But notice both bulbs glow dim in series.' : 'Circuit complete — the bulb lights up!', cls:'good'};
    }
    return {t:'Circuit is open — no current is flowing.', cls:''};
  }

  // ---- game controller ------------------------------------------------------
  TRADES.electric = {
    icon:'⚡', name:'Electrician',
    mount(stage, helpers){
      const L=levels(); let li=0; let won=false;

      function draw(){
        const s=L[li]; won=s.win(s);
        const st=statusLine(s);
        stage.innerHTML =
          `<div class="lvlbar">`+
            `<span class="pill lvl">⚡ Circuit Lab</span>`+
            `<span class="pill">Level ${li+1} / ${L.length}</span>`+
          `</div>`+
          `<div class="card">`+
            `<div class="goal"><span class="g-ic">🎯</span><span>${esc(s.goal)}</span></div>`+
            `<p class="teach">${esc(s.teach)}</p>`+
            boardHTML(s)+
            `<div class="feedback ${st.cls}">${esc(st.t)}</div>`+
            `<div class="controls">`+
              `<button class="btn btn-ghost" id="reset">↺ Reset</button>`+
              (won ? (li<L.length-1
                  ? `<button class="btn btn-primary" id="next">Next level ▶</button>`
                  : `<button class="btn btn-gold" id="menu2">🏆 Finish — back to trades</button>`)
                : '')+
            `</div>`+
          `</div>`;

        stage.querySelectorAll('[data-idx]').forEach(g=>{
          g.addEventListener('click', ()=>{ tap(s, +g.getAttribute('data-idx')); const before=won; draw();
            if(!before && L[li].win(L[li])) helpers.celebrate(); });
        });
        const r=stage.querySelector('#reset'); if(r) r.onclick=()=>{ resetLevel(s); draw(); };
        const nx=stage.querySelector('#next'); if(nx) nx.onclick=()=>{ li++; draw(); };
        const m2=stage.querySelector('#menu2'); if(m2) m2.onclick=()=>helpers.toMenu();
      }
      function resetLevel(s){
        if(s.type==='parallel'){ s.branches.forEach(b=>b.closed=false); return; }
        if(s.type==='overload'){ s.bulbs.forEach(b=>b.on=true); return; }
        s.parts.forEach(p=>{ if(p.type==='gap')p.on=false; else if(p.type==='switch')p.closed=false; else if(p.type==='material')p.i=0; });
      }
      draw();
    }
  };
})();
