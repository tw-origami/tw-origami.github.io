// Comic art engine — draws simple cartoon characters, props, and backgrounds
// as inline SVG so the "Finish a Comic" panels are real drawings, not emoji.
// Characters are drawn in a 100x120 local box (feet at y=120, head near top).
window.COMICART = (function(){
  const HX = 50, HY = 36, R = 22;   // head center + radius in local coords
  const S = 'stroke="#1b1b28" stroke-width="2.6"';
  const SR = 'stroke="#1b1b28" stroke-width="2.6" stroke-linecap="round"';

  // ---- facial expression (eyes, brows, mouth) drawn on the head ----
  function face(expr){
    const ex = 8, ey = HY - 2, er = 4.6;
    const eyeOpen = (cx) => `<circle cx="${cx}" cy="${ey}" r="${er}" fill="#fff" ${S}/><circle cx="${cx}" cy="${ey+0.5}" r="2.1" fill="#1b1b28"/>`;
    const eyeWide = (cx) => `<circle cx="${cx}" cy="${ey}" r="${er+1.6}" fill="#fff" ${S}/><circle cx="${cx}" cy="${ey+1}" r="2.3" fill="#1b1b28"/>`;
    const eyeHappy = (cx,d) => `<path d="M${cx-5},${ey+1} q5,-6 10,0" fill="none" ${SR}/>`;
    const eyeSad = (cx) => `<circle cx="${cx}" cy="${ey+1.5}" r="${er}" fill="#fff" ${S}/><circle cx="${cx}" cy="${ey+3}" r="2" fill="#1b1b28"/>`;
    let eyes, brows = '', mouth;
    switch(expr){
      case 'happy':
        eyes = eyeOpen(HX-ex) + eyeOpen(HX+ex);
        mouth = `<path d="M${HX-9},${HY+9} Q${HX},${HY+20} ${HX+9},${HY+9}" fill="none" ${SR}/>`; break;
      case 'excited':
        eyes = eyeWide(HX-ex) + eyeWide(HX+ex);
        brows = `<path d="M${HX-13},${HY-11} q5,-4 10,-2 M${HX+3},${HY-13} q5,-2 10,2" fill="none" ${SR}/>`;
        mouth = `<path d="M${HX-10},${HY+7} Q${HX},${HY+24} ${HX+10},${HY+7} Z" fill="#b1324a" ${S}/>`; break;
      case 'surprised':
        eyes = eyeWide(HX-ex) + eyeWide(HX+ex);
        brows = `<path d="M${HX-13},${HY-13} q5,-4 10,-3 M${HX+3},${HY-16} q5,-1 10,3" fill="none" ${SR}/>`;
        mouth = `<ellipse cx="${HX}" cy="${HY+13}" rx="5" ry="6.5" fill="#b1324a" ${S}/>`; break;
      case 'sad':
        eyes = eyeSad(HX-ex) + eyeSad(HX+ex);
        brows = `<path d="M${HX-13},${HY-11} q6,-3 11,1 M${HX+2},${HY-10} q5,-4 11,-1" fill="none" ${SR}/>`;
        mouth = `<path d="M${HX-8},${HY+16} Q${HX},${HY+7} ${HX+8},${HY+16}" fill="none" ${SR}/>`; break;
      case 'worried':
        eyes = eyeOpen(HX-ex) + eyeOpen(HX+ex);
        brows = `<path d="M${HX-13},${HY-11} q6,-2 11,2 M${HX+2},${HY-9} q5,-4 11,-2" fill="none" ${SR}/>`;
        mouth = `<path d="M${HX-8},${HY+13} q4,-4 8,0 q4,4 8,0" fill="none" ${SR}/>`; break;
      case 'mad':
        eyes = eyeOpen(HX-ex) + eyeOpen(HX+ex);
        brows = `<path d="M${HX-13},${HY-12} L${HX-3},${HY-7} M${HX+13},${HY-12} L${HX+3},${HY-7}" fill="none" ${SR}/>`;
        mouth = `<path d="M${HX-8},${HY+14} Q${HX},${HY+9} ${HX+8},${HY+14}" fill="none" ${SR}/>`; break;
      case 'sly':
        eyes = `<path d="M${HX-ex-5},${ey} q5,-4 10,0" fill="none" ${SR}/><circle cx="${HX-ex}" cy="${ey+1}" r="2" fill="#1b1b28"/>` +
               `<path d="M${HX+ex-5},${ey} q5,-4 10,0" fill="none" ${SR}/><circle cx="${HX+ex}" cy="${ey+1}" r="2" fill="#1b1b28"/>`;
        mouth = `<path d="M${HX-8},${HY+11} Q${HX+2},${HY+17} ${HX+9},${HY+9}" fill="none" ${SR}/>`; break;
      default: // neutral
        eyes = eyeOpen(HX-ex) + eyeOpen(HX+ex);
        mouth = `<path d="M${HX-7},${HY+13} L${HX+7},${HY+13}" fill="none" ${SR}/>`;
    }
    return brows + eyes + mouth;
  }

  // ---- head + kind-specific features ----
  const SKIN = { kid:'#f6cfa6', detective:'#f6cfa6', astro:'#f2c39b', hero:'#f6cfa6',
                 dragon:'#8fce8f', cat:'#c9ced6', dog:'#d8b483', alien:'#b9f5cf' };
  function head(kind){
    const c = SKIN[kind] || '#f6cfa6';
    let extra = '', hair = '';
    if (kind==='dragon') extra = `<path d="M${HX-16},${HY-16} L${HX-22},${HY-30} L${HX-8},${HY-19} Z" fill="#5fb56b" ${S}/><path d="M${HX+16},${HY-16} L${HX+22},${HY-30} L${HX+8},${HY-19} Z" fill="#5fb56b" ${S}/>`;
    if (kind==='cat') extra = `<path d="M${HX-19},${HY-13} L${HX-24},${HY-30} L${HX-6},${HY-19} Z" fill="${c}" ${S}/><path d="M${HX+19},${HY-13} L${HX+24},${HY-30} L${HX+6},${HY-19} Z" fill="${c}" ${S}/><path d="M${HX-14},${HY+4} l-9,-2 m9,4 l-9,2 M${HX+14},${HY+4} l9,-2 m-9,4 l9,2" ${SR}/>`;
    if (kind==='dog') extra = `<ellipse cx="${HX-20}" cy="${HY+2}" rx="7" ry="14" fill="#b78a5c" ${S}/><ellipse cx="${HX+20}" cy="${HY+2}" rx="7" ry="14" fill="#b78a5c" ${S}/><circle cx="${HX}" cy="${HY+11}" r="3.4" fill="#1b1b28"/>`;
    if (kind==='alien') extra = `<path d="M${HX-8},${HY-20} L${HX-12},${HY-32}" ${SR}/><circle cx="${HX-13}" cy="${HY-34}" r="3" fill="#f472b6" ${S}/><path d="M${HX+8},${HY-20} L${HX+12},${HY-32}" ${SR}/><circle cx="${HX+13}" cy="${HY-34}" r="3" fill="#f472b6" ${S}/>`;
    if (kind==='kid'||kind==='hero') hair = `<path d="M${HX-22},${HY-6} Q${HX-20},${HY-26} ${HX},${HY-24} Q${HX+20},${HY-26} ${HX+22},${HY-6} Q${HX+12},${HY-18} ${HX},${HY-16} Q${HX-12},${HY-18} ${HX-22},${HY-6} Z" fill="#6b4423" ${S}/>`;
    if (kind==='detective') hair = `<path d="M${HX-22},${HY-10} q22,-14 44,0 q-6,-4 -22,-4 q-16,0 -22,4 Z" fill="#6b4423"/>`;
    const faceParts = face(arguments[1]);
    let over = '';
    if (kind==='astro') over = `<circle cx="${HX}" cy="${HY-2}" r="${R+5}" fill="none" stroke="#cbd5e1" stroke-width="4"/><circle cx="${HX}" cy="${HY-2}" r="${R+8}" fill="none" ${S}/>`;
    if (kind==='hero') over = `<path d="M${HX-16},${HY-3} h32 v6 h-32 Z" fill="#ef4444" ${S}/><path d="M${HX-16},${HY} q-4,3 0,6 M${HX+16},${HY} q4,3 0,6" ${SR}/>`;
    if (kind==='detective') over = `<path d="M${HX-24},${HY-12} q24,-10 48,0 l-3,6 q-21,-7 -42,0 Z" fill="#8a6d3b" ${S}/>`;
    return extra + `<circle cx="${HX}" cy="${HY}" r="${R}" fill="${c}" ${S}/>` + hair + faceParts + over;
  }

  // ---- body (shirt + arms) ----
  function body(kind, shirt){
    shirt = shirt || '#7c3aed';
    const top = HY + R - 2, bot = 116;
    const arms = `<path d="M40,${top+8} q-14,6 -14,22" fill="none" stroke="${shirt}" stroke-width="9" stroke-linecap="round"/>` +
                 `<path d="M60,${top+8} q14,6 14,22" fill="none" stroke="${shirt}" stroke-width="9" stroke-linecap="round"/>`;
    let tail = '';
    if (kind==='dragon') tail = `<path d="M62,${bot-6} q26,4 20,-22" fill="none" stroke="#5fb56b" stroke-width="8" stroke-linecap="round"/>`;
    if (kind==='cat') tail = `<path d="M64,${bot-6} q24,2 18,-24" fill="none" stroke="${SKIN.cat}" stroke-width="7" stroke-linecap="round"/>`;
    if (kind==='dog') tail = `<path d="M64,${bot-8} q18,-2 16,-16" fill="none" stroke="#c8a06a" stroke-width="7" stroke-linecap="round"/>`;
    const bodyShape = `<path d="M36,${bot} Q34,${top} 50,${top-2} Q66,${top} 64,${bot} Z" fill="${shirt}" ${S}/>`;
    return tail + arms + bodyShape;
  }

  function charSVG(kind, expr, shirt){
    return `<g>${body(kind,shirt)}${head(kind,expr)}</g>`;
  }

  // ---- props ----
  function prop(kind){
    switch(kind){
      case 'cake': return `<g><rect x="4" y="22" width="52" height="30" rx="5" fill="#f9a8d4" ${S}/><rect x="4" y="16" width="52" height="10" rx="4" fill="#fff" ${S}/><line x1="30" y1="16" x2="30" y2="4" ${SR}/><path d="M30,4 q-3,-4 0,-7 q3,3 0,7" fill="#f59e0b"/></g>`;
      case 'present': return `<g><rect x="6" y="20" width="44" height="34" rx="3" fill="#60a5fa" ${S}/><rect x="24" y="20" width="8" height="34" fill="#fbbf24" ${S}/><path d="M28,20 q-12,-14 -2,-4 q10,-10 4,4" fill="#fbbf24" ${S}/></g>`;
      case 'cookie': return `<g><circle cx="26" cy="30" r="22" fill="#d9a05b" ${S}/><circle cx="20" cy="24" r="3" fill="#5b3a1a"/><circle cx="33" cy="27" r="3" fill="#5b3a1a"/><circle cx="24" cy="38" r="3" fill="#5b3a1a"/><circle cx="34" cy="38" r="2.5" fill="#5b3a1a"/></g>`;
      case 'rocket': return `<g><path d="M24,4 Q40,20 34,52 H14 Q8,20 24,4 Z" fill="#e5e7eb" ${S}/><circle cx="24" cy="26" r="6" fill="#93c5fd" ${S}/><path d="M14,44 l-8,12 8,-4 Z M34,44 l8,12 -8,-4 Z" fill="#ef4444" ${S}/><path d="M18,54 q6,10 12,0" fill="#f59e0b" ${S}/></g>`;
      case 'magnifier': return `<g><circle cx="24" cy="24" r="16" fill="#bae6fd" opacity=".6" ${S}/><line x1="36" y1="36" x2="52" y2="52" stroke="#1b1b28" stroke-width="6" stroke-linecap="round"/></g>`;
      case 'backpack': return `<g><rect x="6" y="14" width="40" height="44" rx="12" fill="#ef4444" ${S}/><rect x="16" y="30" width="20" height="18" rx="4" fill="#fca5a5" ${S}/></g>`;
      case 'umbrella': return `<g><path d="M4,26 Q26,-2 48,26 Z" fill="#f472b6" ${S}/><line x1="26" y1="26" x2="26" y2="54" ${SR}/><path d="M26,54 q6,0 6,-6" fill="none" ${SR}/></g>`;
      case 'box': return `<g><rect x="6" y="20" width="44" height="34" rx="3" fill="#c8935b" ${S}/><path d="M6,20 h44 M28,20 v34" ${S}/></g>`;
      case 'vine': return `<g><path d="M28,58 Q6,40 26,24 Q46,10 28,2" fill="none" stroke="#22c55e" stroke-width="9" stroke-linecap="round"/><path d="M20,34 q-10,-4 -12,4 q10,2 12,-4 M36,20 q10,-4 12,4 q-10,2 -12,-4" fill="#16a34a" ${S}/></g>`;
      case 'plant': return `<g><rect x="16" y="40" width="24" height="18" rx="2" fill="#d97706" ${S}/><path d="M28,40 Q14,26 26,14 M28,40 Q42,26 30,14 M28,40 V16" fill="none" stroke="#16a34a" stroke-width="6" stroke-linecap="round"/></g>`;
      case 'bird': return `<g><path d="M6,20 q10,-10 20,0 q10,-10 20,0 q-6,12 -20,12 q-14,0 -20,-12 Z" fill="#38bdf8" ${S}/><circle cx="20" cy="18" r="2" fill="#1b1b28"/><path d="M6,20 l-6,-2 6,4 Z" fill="#f59e0b" ${S}/></g>`;
      case 'planet': return `<g><circle cx="28" cy="28" r="18" fill="#c084fc" ${S}/><ellipse cx="28" cy="28" rx="30" ry="9" fill="none" stroke="#f59e0b" stroke-width="3" transform="rotate(-18 28 28)"/></g>`;
      case 'star': return `<g><path d="M28,4 l6,16 17,1 -13,11 5,16 -15,-9 -15,9 5,-16 -13,-11 17,-1 Z" fill="#fde047" ${S}/></g>`;
      default: return '';
    }
  }

  // ---- backgrounds (320 x 190) ----
  function bg(kind){
    const W=320,H=190;
    const sky = (c1,c2)=>`<defs><linearGradient id="bgg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#bgg)"/>`;
    switch(kind){
      case 'space': return `<rect width="${W}" height="${H}" fill="#1e1b4b"/>` + [...Array(26)].map((_,i)=>`<circle cx="${(i*53%W)}" cy="${(i*37%H)}" r="${i%3?1:1.8}" fill="#fff" opacity=".85"/>`).join('') + `<circle cx="270" cy="40" r="16" fill="#c084fc" opacity=".8"/>`;
      case 'room': return sky('#eef2ff','#e0e7ff') + `<rect y="150" width="${W}" height="40" fill="#d6bfa2"/><line x1="0" y1="150" x2="${W}" y2="150" ${S}/>`;
      case 'grass': return sky('#bae6fd','#e0f2fe') + `<rect y="150" width="${W}" height="40" fill="#86efac"/><line x1="0" y1="150" x2="${W}" y2="150" ${S}/><circle cx="40" cy="34" r="16" fill="#fde047"/>`;
      case 'night': return `<rect width="${W}" height="${H}" fill="#312e6b"/>` + [...Array(18)].map((_,i)=>`<circle cx="${(i*61%W)}" cy="${(i*29%150)}" r="1.4" fill="#fff" opacity=".8"/>`).join('') + `<circle cx="260" cy="40" r="18" fill="#fde68a"/><rect y="150" width="${W}" height="40" fill="#3f3f6b"/>`;
      case 'school': return sky('#dbeafe','#eff6ff') + `<rect y="150" width="${W}" height="40" fill="#cbd5e1"/><rect x="120" y="70" width="80" height="80" fill="#fca5a5" ${S}/><path d="M112,70 L160,44 L208,70 Z" fill="#ef4444" ${S}/><rect x="150" y="110" width="20" height="40" fill="#7c3aed" ${S}/>`;
      default: return sky('#cfe8ff','#eaf6ff') + `<rect y="150" width="${W}" height="40" fill="#a7d8a0"/><line x1="0" y1="150" x2="${W}" y2="150" ${S}/><circle cx="46" cy="36" r="16" fill="#fde047"/>`;
    }
  }

  // ---- compose a full scene ----
  // art = { bg, cast:[{kind,expr,shirt,x,scale,flip}], props:[{kind,x,y,scale}] }
  function scene(art){
    const W=320,H=190, ground=176;
    let out = bg(art.bg);
    (art.props||[]).forEach(p => {
      const s = p.scale||1;
      out += `<g transform="translate(${p.x},${p.y}) scale(${s})">${prop(p.kind)}</g>`;
    });
    (art.cast||[]).forEach(c => {
      const s = c.scale||1;
      const tx = c.x - 50*s, ty = ground - 118*s;
      const flip = c.flip ? ` scale(-1,1) translate(${-100*s},0)` : '';
      out += `<g transform="translate(${tx},${ty}) scale(${s})${flip}">${charSVG(c.kind, c.expr, c.shirt)}</g>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block">${out}</svg>`;
  }

  // a single reference figure for the Studio trace tool
  function refFigure(kind, expr){
    return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">${charSVG(kind, expr||'happy', '#94a3b8')}</svg>`;
  }

  return { scene, charSVG, prop, refFigure };
})();
