// Car art engine — simple, recognizable SVG icons for car parts, dashboard
// warning lights, and a side-view cutaway diagram with clickable hotspots.
window.CARART = (function(){
  const S = 'stroke="#1f2937" stroke-width="3" stroke-linejoin="round"';
  const SR = 'stroke="#1f2937" stroke-width="3" stroke-linecap="round"';
  const wrap = (inner) => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block">${inner}</svg>`;

  // ---------- PART ICONS (64x64) ----------
  const PARTS = {
    engine: `<rect x="8" y="26" width="34" height="26" rx="3" fill="#64748b" ${S}/><rect x="14" y="16" width="8" height="12" fill="#94a3b8" ${S}/><rect x="26" y="16" width="8" height="12" fill="#94a3b8" ${S}/><rect x="42" y="32" width="14" height="14" rx="3" fill="#475569" ${S}/><circle cx="49" cy="39" r="3.5" fill="#cbd5e1" ${S}/><path d="M8,46 h34" ${SR}/><rect x="16" y="52" width="20" height="6" rx="2" fill="#475569" ${S}/>`,
    battery: `<rect x="10" y="20" width="44" height="30" rx="3" fill="#22c55e" ${S}/><rect x="16" y="14" width="8" height="6" fill="#1f2937"/><rect x="40" y="14" width="8" height="6" fill="#1f2937"/><path d="M20,34 h8 M24,30 v8" ${SR} stroke="#fff"/><path d="M40,34 h8" ${SR} stroke="#fff"/><path d="M32,24 l-4,10 h6 l-4,10" fill="none" stroke="#fde047" stroke-width="3" stroke-linejoin="round"/>`,
    tire: `<circle cx="32" cy="32" r="24" fill="#1f2937" ${S}/><circle cx="32" cy="32" r="12" fill="#cbd5e1" ${S}/><circle cx="32" cy="32" r="4" fill="#64748b"/>${[0,60,120,180,240,300].map(a=>`<circle cx="${32+16*Math.cos(a*Math.PI/180)}" cy="${32+16*Math.sin(a*Math.PI/180)}" r="1.6" fill="#94a3b8"/>`).join('')}<circle cx="32" cy="32" r="24" fill="none" stroke="#374151" stroke-width="4" stroke-dasharray="3 4"/>`,
    brakes: `<circle cx="30" cy="32" r="22" fill="#94a3b8" ${S}/><circle cx="30" cy="32" r="8" fill="#e2e8f0" ${S}/>${[...Array(8)].map((_,i)=>`<circle cx="${30+15*Math.cos(i*45*Math.PI/180)}" cy="${32+15*Math.sin(i*45*Math.PI/180)}" r="2" fill="#64748b"/>`).join('')}<path d="M44,22 q10,0 10,10 v6 q0,10 -10,10 Z" fill="#ef4444" ${S}/>`,
    sparkplug: `<rect x="26" y="8" width="12" height="18" rx="2" fill="#f8fafc" ${S}/><rect x="24" y="24" width="16" height="8" fill="#eab308" ${S}/><rect x="27" y="32" width="10" height="14" fill="#94a3b8" ${S}/><path d="M32,46 v8" ${SR}/><path d="M28,54 q4,4 8,0" fill="none" ${SR}/>`,
    radiator: `<rect x="10" y="16" width="44" height="36" rx="3" fill="#38bdf8" ${S}/>${[...Array(6)].map((_,i)=>`<line x1="${16+i*7}" y1="20" x2="${16+i*7}" y2="48" stroke="#0369a1" stroke-width="2.4"/>`).join('')}<rect x="24" y="8" width="14" height="8" rx="2" fill="#64748b" ${S}/>`,
    oil: `<path d="M18,30 h22 l8,6 v8 a4,4 0 0 1 -4,4 h-26 a4,4 0 0 1 -4,-4 v-10 a4,4 0 0 1 4,-4 Z" fill="#a16207" ${S}/><rect x="26" y="22" width="8" height="8" fill="#a16207" ${S}/><path d="M40,18 q6,8 0,12 q-6,-4 0,-12 Z" fill="#facc15" ${S}/><path d="M12,40 h8" ${SR} stroke="#fff"/>`,
    alternator: `<circle cx="30" cy="32" r="20" fill="#64748b" ${S}/><circle cx="30" cy="32" r="9" fill="#334155" ${S}/><circle cx="30" cy="32" r="3" fill="#cbd5e1"/>${[...Array(10)].map((_,i)=>`<line x1="${30+13*Math.cos(i*36*Math.PI/180)}" y1="${32+13*Math.sin(i*36*Math.PI/180)}" x2="${30+19*Math.cos(i*36*Math.PI/180)}" y2="${32+19*Math.sin(i*36*Math.PI/180)}" stroke="#334155" stroke-width="2"/>`).join('')}<rect x="48" y="26" width="10" height="12" rx="2" fill="#475569" ${S}/>`,
    steering: `<circle cx="32" cy="32" r="24" fill="none" stroke="#1f2937" stroke-width="6"/><circle cx="32" cy="32" r="7" fill="#334155" ${S}/><path d="M32,39 v16 M25,34 l-16,-8 M39,34 l16,-8" ${SR}/>`,
    seatbelt: `<rect x="34" y="12" width="16" height="40" rx="3" fill="#dc2626" transform="rotate(18 42 32)" ${S}/><rect x="18" y="34" width="20" height="14" rx="3" fill="#334155" ${S}/><rect x="24" y="38" width="8" height="6" rx="1" fill="#94a3b8"/>`,
    headlight: `<path d="M12,20 h16 a16,12 0 0 1 0,24 h-16 Z" fill="#fef9c3" ${S}/><circle cx="24" cy="32" r="8" fill="#fde047" ${S}/><path d="M38,24 h14 M38,32 h16 M38,40 h14" ${SR} stroke="#fbbf24"/>`,
    transmission: `<circle cx="26" cy="30" r="15" fill="#64748b" ${S}/>${[...Array(8)].map((_,i)=>`<rect x="24" y="12" width="4" height="6" transform="rotate(${i*45} 26 30)" fill="#64748b" ${S}/>`).join('')}<circle cx="26" cy="30" r="6" fill="#334155" ${S}/><circle cx="46" cy="44" r="9" fill="#94a3b8" ${S}/>${[...Array(6)].map((_,i)=>`<rect x="44" y="33" width="4" height="5" transform="rotate(${i*60} 46 44)" fill="#94a3b8" ${S}/>`).join('')}`,
    exhaust: `<rect x="10" y="30" width="28" height="16" rx="8" fill="#94a3b8" ${S}/><path d="M38,34 h8 v8 h-8" fill="#64748b" ${S}/><path d="M46,38 h8" ${SR}/><circle cx="54" cy="38" r="3" fill="none" stroke="#cbd5e1" stroke-width="2"/><path d="M52,20 q4,4 0,8 M56,22 q3,3 0,6" fill="none" stroke="#cbd5e1" stroke-width="2.4"/>`,
    airfilter: `<ellipse cx="32" cy="24" rx="22" ry="7" fill="#e2e8f0" ${S}/><path d="M10,24 v16 a22,7 0 0 0 44,0 v-16" fill="#e2e8f0" ${S}/>${[...Array(9)].map((_,i)=>`<line x1="${12+i*5}" y1="26" x2="${12+i*5}" y2="44" stroke="#94a3b8" stroke-width="2"/>`).join('')}`,
    wiper: `<path d="M8,48 q24,-30 48,-12" fill="none" stroke="#38bdf8" stroke-width="3"/><rect x="30" y="14" width="4" height="30" rx="2" fill="#334155" transform="rotate(28 32 30)" ${S}/><rect x="18" y="10" width="20" height="4" rx="2" fill="#1f2937" transform="rotate(28 28 12)"/>`,
    fuelpump: `<rect x="12" y="12" width="24" height="40" rx="3" fill="#dc2626" ${S}/><rect x="16" y="16" width="16" height="12" rx="2" fill="#fecaca" ${S}/><path d="M36,24 h8 a3,3 0 0 1 3,3 v18 a4,4 0 0 0 8,0 v-16 l-5,-6" fill="none" ${SR}/><circle cx="50" cy="21" r="2" fill="#1f2937"/>`,
    coolant: `<rect x="18" y="18" width="28" height="34" rx="4" fill="#5eead4" ${S}/><rect x="26" y="10" width="12" height="8" rx="2" fill="#0f766e" ${S}/><path d="M22,38 q5,-5 10,0 q5,5 10,0" fill="none" stroke="#0d9488" stroke-width="3"/><path d="M32,22 v6" ${SR} stroke="#0f766e"/>`,
    piston: `<rect x="22" y="10" width="20" height="20" rx="3" fill="#cbd5e1" ${S}/><line x1="22" y1="16" x2="42" y2="16" stroke="#94a3b8" stroke-width="2"/><line x1="22" y1="20" x2="42" y2="20" stroke="#94a3b8" stroke-width="2"/><path d="M28,30 l4,14 l4,-14" fill="#64748b" ${S}/><circle cx="32" cy="50" r="6" fill="#475569" ${S}/><circle cx="32" cy="50" r="2" fill="#cbd5e1"/>`,
    fueltank: `<path d="M12,26 h34 a6,6 0 0 1 6,6 v10 a6,6 0 0 1 -6,6 h-34 a4,4 0 0 1 -4,-4 v-14 a4,4 0 0 1 4,-4 Z" fill="#334155" ${S}/><rect x="20" y="20" width="8" height="6" fill="#64748b" ${S}/><path d="M46,32 h8" ${SR}/>`,
    mirror: `<rect x="16" y="18" width="32" height="20" rx="4" fill="#bae6fd" ${S}/><rect x="28" y="38" width="8" height="8" fill="#334155" ${S}/><path d="M20,24 l24,10" stroke="#fff" stroke-width="2" opacity=".7"/>`
  };

  // ---------- DASHBOARD WARNING LIGHTS (64x64, amber on transparent) ----------
  const A = 'stroke="#f59e0b" stroke-width="3.4" fill="none" stroke-linejoin="round" stroke-linecap="round"';
  const AF = 'fill="#f59e0b"';
  const RED = 'stroke="#ef4444" stroke-width="3.4" fill="none" stroke-linejoin="round" stroke-linecap="round"';
  const LIGHTS = {
    checkengine: `<path d="M12,38 v-8 h6 l3,-6 h10 v6 h6 v-4 h6 v4 h4 v14 h-4 v4 h-10 v-4 h-9 v6 h-12 v-6 h-6 v-6 Z" ${A}/>`,
    oil: `<path d="M8,40 h30 l10,-8 q-6,-2 -12,0 l-4,-6 h-8 M8,40 v6 h30 v-6" ${A}/><path d="M46,20 q5,7 0,12" ${A}/><line x1="12" y1="52" x2="20" y2="52" ${A}/>`,
    battery: `<rect x="12" y="24" width="40" height="22" rx="2" ${A}/><line x1="20" y1="20" x2="20" y2="24" ${A}/><line x1="44" y1="20" x2="44" y2="24" ${A}/><path d="M20,35 h8 M24,31 v8" ${A}/><path d="M40,35 h8" ${A}/>`,
    temp: `<path d="M30,14 a4,4 0 0 1 8,0 v22 a7,7 0 1 1 -8,0 Z" ${RED}/><circle cx="34" cy="46" r="4" fill="#ef4444"/><line x1="34" y1="24" x2="34" y2="42" stroke="#ef4444" stroke-width="3"/><path d="M8,30 q4,-4 8,0 q4,4 8,0 M8,40 q4,-4 8,0 q4,4 8,0" ${RED}/>`,
    tpms: `<path d="M16,44 q0,-20 16,-20 q16,0 16,20 Z" ${A}/><path d="M12,48 h40" ${A}/><line x1="32" y1="30" x2="32" y2="38" stroke="#f59e0b" stroke-width="3.4" stroke-linecap="round"/><circle cx="32" cy="43" r="1.8" ${AF}/>`,
    brake: `<circle cx="32" cy="32" r="14" ${RED}/><path d="M10,22 q-6,10 0,20 M54,22 q6,10 0,20" ${RED}/><line x1="32" y1="24" x2="32" y2="34" stroke="#ef4444" stroke-width="3.4" stroke-linecap="round"/><circle cx="32" cy="39" r="1.8" fill="#ef4444"/>`,
    fuel: `<path d="M14,50 v-32 a4,4 0 0 1 4,-4 h14 a4,4 0 0 1 4,4 v32 Z" ${A}/><path d="M12,50 h30" ${A}/><rect x="19" y="20" width="12" height="9" ${A}/><path d="M40,26 v16 a4,4 0 0 0 8,0 v-18 l-5,-6" ${A}/>`,
    seatbelt: `<circle cx="32" cy="18" r="6" ${A}/><path d="M22,50 q0,-18 10,-22 q10,4 10,22 Z" ${A}/><line x1="24" y1="30" x2="42" y2="46" stroke="#f59e0b" stroke-width="3.4"/>`,
    abs: `<circle cx="32" cy="32" r="15" ${A}/><path d="M8,22 q-6,10 0,20 M56,22 q6,10 0,20" ${A}/><text x="32" y="38" text-anchor="middle" font-size="12" font-weight="800" fill="#f59e0b">ABS</text>`,
    airbag: `<circle cx="24" cy="22" r="7" ${A}/><path d="M14,50 q0,-16 10,-20" ${A}/><circle cx="42" cy="40" r="11" ${A}/><path d="M30,44 q6,-2 12,-2" ${A}/>`
  };

  // ---------- CAR CUTAWAY DIAGRAM (side view, front to the right) ----------
  // Hotspots carry data-part for the "Under the Hood" tap game.
  function carDiagram(){
    const dot = (x,y,part) => `<g class="hot" data-part="${part}"><circle cx="${x}" cy="${y}" r="15" fill="rgba(220,38,38,0)" /><circle class="hotdot" cx="${x}" cy="${y}" r="8" fill="#dc2626" stroke="#fff" stroke-width="2.5"/></g>`;
    return `<svg viewBox="0 0 400 230" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">
      <!-- ground -->
      <line x1="8" y1="196" x2="392" y2="196" stroke="#cbd5e1" stroke-width="3"/>
      <!-- body -->
      <path d="M40,150 L70,150 Q80,110 130,108 L250,108 Q290,110 320,132 L360,140 Q374,144 374,162 L374,178 Q374,184 366,184 L44,184 Q34,184 34,174 L34,158 Q34,150 40,150 Z" fill="#e2e8f0" stroke="#1f2937" stroke-width="3"/>
      <!-- cabin windows -->
      <path d="M132,112 L200,112 L200,138 L96,138 Q100,116 132,112 Z" fill="#bae6fd" stroke="#1f2937" stroke-width="2.5"/>
      <path d="M208,112 L246,112 Q276,114 296,132 L208,132 Z" fill="#bae6fd" stroke="#1f2937" stroke-width="2.5"/>
      <line x1="204" y1="112" x2="204" y2="138" stroke="#1f2937" stroke-width="2.5"/>
      <!-- hood cutaway hint -->
      <path d="M300,138 L360,144" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>
      <!-- wheels -->
      <circle cx="110" cy="184" r="26" fill="#1f2937"/><circle cx="110" cy="184" r="11" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
      <circle cx="312" cy="184" r="26" fill="#1f2937"/><circle cx="312" cy="184" r="11" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
      <!-- exhaust pipe under, to the left/back -->
      <path d="M150,178 H60 q-14,0 -14,6" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>
      <!-- hotspots -->
      ${dot(330,150,'engine')}
      ${dot(300,140,'battery')}
      ${dot(360,158,'radiator')}
      ${dot(372,168,'headlight')}
      ${dot(312,184,'brakes')}
      ${dot(150,168,'fueltank')}
      ${dot(46,184,'exhaust')}
      ${dot(215,124,'steering')}
    </svg>`;
  }

  return {
    part: (k) => wrap(PARTS[k] || ''),
    partInner: (k) => PARTS[k] || '',
    light: (k) => wrap(LIGHTS[k] || ''),
    carDiagram,
    hasPart: (k) => !!PARTS[k]
  };
})();
