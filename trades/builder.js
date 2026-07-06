// Builder trade — Build-a-House. Assemble the house in the correct order. Each
// right step raises another layer of the house; a wrong step is refused with the
// reason it can't come yet.
(function(){
  window.TRADES = window.TRADES || {};

  // canonical construction order
  const STEPS=[
    { key:'foundation', label:'Pour the foundation', emoji:'🧱',
      why:'Everything sits on the foundation, so it has to go first.' },
    { key:'framing', label:'Frame the walls', emoji:'🪵',
      why:'The frame has to be standing before anything can attach to it.' },
    { key:'roof', label:'Put on the roof', emoji:'🏠',
      why:'Get the roof on to keep rain out before you work inside.' },
    { key:'plumbing', label:'Run the plumbing', emoji:'🚿',
      why:'Rough in the pipes while the walls are still open.' },
    { key:'wiring', label:'Run the wiring', emoji:'⚡',
      why:'Pull the electrical wires while the walls are still open.' },
    { key:'insulation', label:'Add insulation', emoji:'🧶',
      why:'Pack in insulation after the pipes and wires, before the walls close up.' },
    { key:'drywall', label:'Hang the drywall', emoji:'🧱',
      why:'Drywall seals up the walls, so wiring, pipes, and insulation must be in first.' },
    { key:'paint', label:'Paint and finish', emoji:'🎨',
      why:'Paint and trim are the finishing touches — they come last.' },
  ];

  // -------------------------------------------------------------- house render
  function drawHouse(n){
    let s=`<svg class="board" viewBox="0 0 320 300" style="max-width:340px">`;
    s+=`<line x1="18" y1="262" x2="302" y2="262" stroke="#cbd5e1" stroke-width="3"/>`;
    if(n>=1) s+=`<rect x="58" y="248" width="204" height="16" fill="#9ca3af" stroke="#6b7280" stroke-width="2"/>`;
    if(n>=3) s+=`<polygon points="160,70 48,128 272,128" fill="#b45309" stroke="#7c2d12" stroke-width="3"/>`;
    if(n>=2){
      s+=`<rect x="70" y="128" width="180" height="120" fill="none" stroke="#a16207" stroke-width="4"/>`;
      if(n<7) [110,150,190,230].forEach(x=>{ s+=`<line x1="${x}" y1="130" x2="${x}" y2="246" stroke="#c2894a" stroke-width="3"/>`; });
    }
    // rough-in, visible only while walls are open (before drywall)
    if(n>=4 && n<7) s+=`<path d="M96,246 V170 H128 V150" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    if(n>=5 && n<7) s+=`<path d="M214,246 V200 L200,185 L214,170 V150" fill="none" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    if(n>=6 && n<7){ [ [74,84],[124,84],[194,84] ].forEach(b=>{ s+=`<rect x="${b[0]}" y="132" width="42" height="112" fill="#fbcfe8" opacity="0.75"/>`; });
      s+=`<line x1="70" y1="128" x2="250" y2="128" stroke="#a16207" stroke-width="4"/>`; }
    if(n>=7) s+=`<rect x="74" y="132" width="172" height="114" fill="#efe9dd" stroke="#d6cdb6" stroke-width="2"/>`;
    if(n>=8){
      s+=`<rect x="74" y="132" width="172" height="114" fill="#fde68a"/>`;
      s+=`<rect x="145" y="188" width="30" height="58" fill="#92400e" rx="2"/>`;
      s+=`<circle cx="168" cy="217" r="2.5" fill="#fde68a"/>`;
      s+=`<rect x="92" y="150" width="34" height="30" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>`;
      s+=`<rect x="194" y="150" width="34" height="30" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>`;
      s+=`<line x1="109" y1="150" x2="109" y2="180" stroke="#0284c7" stroke-width="1.5"/><line x1="92" y1="165" x2="126" y2="165" stroke="#0284c7" stroke-width="1.5"/>`;
      s+=`<line x1="211" y1="150" x2="211" y2="180" stroke="#0284c7" stroke-width="1.5"/><line x1="194" y1="165" x2="228" y2="165" stroke="#0284c7" stroke-width="1.5"/>`;
      s+=`<text x="288" y="52" text-anchor="middle" font-size="26">☀️</text>`;
    }
    if(n===0) s+=`<text x="160" y="150" text-anchor="middle" font-size="15" fill="#94a3b8">Empty lot — start building!</text>`;
    s+=`</svg>`;
    return s;
  }

  TRADES.build = {
    icon:'🏠', name:'Builder',
    mount(stage, helpers){
      let n=0, msg={t:'Tap the step that comes first.',cls:''};
      // stable shuffled presentation order of the step indices
      const order=STEPS.map((_,i)=>i);
      for(let i=order.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [order[i],order[j]]=[order[j],order[i]]; }

      function draw(){
        const done=n>=STEPS.length;
        let checklist='';
        for(let i=0;i<n;i++) checklist+=`<div style="padding:5px 0;color:#16a34a;font-weight:700;font-size:14px">✅ ${STEPS[i].emoji} ${STEPS[i].label}</div>`;
        let choices='';
        if(!done){
          choices=`<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px">`+
            order.filter(i=>i>=n).map(i=>`<button class="btn" data-step="${i}" style="background:#f8fafc;border:2px solid #e2e8f0;font-size:14px;padding:11px 16px">${STEPS[i].emoji} ${STEPS[i].label}</button>`).join('')+
            `</div>`;
        }
        stage.innerHTML=
          `<div class="lvlbar">`+
            `<span class="pill lvl" style="color:#ea580c">🏠 Build-a-House</span>`+
            `<span class="pill">Step ${Math.min(n+1,STEPS.length)} / ${STEPS.length}</span>`+
          `</div>`+
          `<div class="card">`+
            `<div class="goal" style="background:#ffedd5"><span class="g-ic">🎯</span><span>Build the house in the right order. Pick the step that comes next.</span></div>`+
            `<div style="display:flex;justify-content:center">`+drawHouse(n)+`</div>`+
            `<div class="feedback ${msg.cls}">${msg.t}</div>`+
            checklist+
            choices+
            `<div class="controls">`+
              `<button class="btn btn-ghost" id="reset">↺ Start over</button>`+
              (done?`<button class="btn btn-gold" id="menu2">🏆 Finish — back to trades</button>`:'')+
            `</div>`+
          `</div>`;

        stage.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{
          const i=+b.getAttribute('data-step');
          if(i===n){ n++;
            if(n>=STEPS.length){ msg={t:'🏡 The house is finished — built right, top to bottom!',cls:'good'}; helpers.celebrate(); }
            else msg={t:`✅ ${STEPS[i].label} — done. What’s next?`,cls:'good'};
          } else {
            msg={t:`Not yet — ${STEPS[i].why} First you need to: ${STEPS[n].label.toLowerCase()}.`,cls:'bad'};
          }
          draw();
        }));
        const rb=stage.querySelector('#reset'); if(rb) rb.onclick=()=>{ n=0; msg={t:'Tap the step that comes first.',cls:''}; draw(); };
        const m2=stage.querySelector('#menu2'); if(m2) m2.onclick=()=>helpers.toMenu();
      }
      draw();
    }
  };
})();
