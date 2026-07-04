// Shared practice timer. Persists across pages via localStorage so the countdown
// keeps running when you move between Blocks and Chart.
(function(){
  const KEY_END = 'lz_timer_end';   // epoch ms when the timer ends
  const KEY_MIN = 'lz_timer_min';   // chosen duration in minutes (kept for the finished state)

  // ---- styles ----
  const style = document.createElement('style');
  style.textContent = `
    #lzTimer{ position:fixed; left:0; right:0; bottom:0; z-index:80;
      background:#fff; box-shadow:0 -6px 24px rgba(30,41,99,.14);
      border-top:1px solid #eef2ff; padding:10px 16px; }
    #lzTimer .inner{ max-width:1000px; margin:0 auto; display:flex; align-items:center; gap:14px; justify-content:center; flex-wrap:wrap; }
    #lzTimer .tlabel{ font-weight:800; color:#64748b; font-size:14px; display:flex; align-items:center; gap:6px; }
    #lzTimer .tbtns{ display:flex; gap:8px; }
    #lzTimer .tbtn{ font-family:inherit; font-weight:800; font-size:15px; border:none; cursor:pointer;
      background:#eef2ff; color:#4f46e5; padding:9px 16px; border-radius:11px; transition:transform .1s, background .15s; }
    #lzTimer .tbtn:hover{ background:#e0e7ff; } #lzTimer .tbtn:active{ transform:scale(.95); }
    #lzTimer .tbtn.stop{ background:#fee2e2; color:#dc2626; padding:9px 12px; }
    #lzTimer .clock{ font-variant-numeric:tabular-nums; font-weight:900; font-size:26px; letter-spacing:.5px; color:#1e293b; min-width:92px; text-align:center; }
    #lzTimer .clock.low{ color:#dc2626; }
    #lzTimer .track{ flex:1; max-width:320px; height:10px; background:#eef2ff; border-radius:999px; overflow:hidden; }
    #lzTimer .fill{ height:100%; background:linear-gradient(90deg,#4f46e5,#7c74f0); border-radius:999px; transition:width 1s linear; }
    #lzTimer .fill.low{ background:linear-gradient(90deg,#dc2626,#f97316); }
    #lzTimer.done{ background:linear-gradient(135deg,#f59e0b,#ea580c); }
    #lzTimer.done .tlabel, #lzTimer.done .clock{ color:#fff; }
    #lzTimer .doneMsg{ font-weight:900; font-size:18px; color:#fff; }
    #lzTimer .tbtn.again{ background:#fff; color:#ea580c; }
  `;
  document.head.appendChild(style);

  // ---- bar ----
  const bar = document.createElement('div');
  bar.id = 'lzTimer';
  bar.innerHTML = `<div class="inner"></div>`;
  document.body.appendChild(bar);
  document.body.style.paddingBottom = '84px';
  const inner = bar.querySelector('.inner');

  const now = () => Date.now();
  const getEnd = () => parseInt(localStorage.getItem(KEY_END) || '0', 10);
  const getMin = () => parseInt(localStorage.getItem(KEY_MIN) || '0', 10);

  function start(min){
    localStorage.setItem(KEY_MIN, String(min));
    localStorage.setItem(KEY_END, String(now() + min*60*1000));
    render();
  }
  function stop(){ localStorage.removeItem(KEY_END); localStorage.removeItem(KEY_MIN); render(); }

  function fmt(ms){
    const s = Math.max(0, Math.ceil(ms/1000));
    const m = Math.floor(s/60), ss = s%60;
    return m + ':' + String(ss).padStart(2,'0');
  }

  function chooser(){
    bar.classList.remove('done');
    inner.innerHTML = `
      <span class="tlabel">⏱️ Practice timer</span>
      <div class="tbtns">
        <button class="tbtn" data-min="5">5 min</button>
        <button class="tbtn" data-min="10">10 min</button>
        <button class="tbtn" data-min="15">15 min</button>
      </div>`;
    inner.querySelectorAll('.tbtn').forEach(b=> b.onclick = ()=> start(+b.dataset.min));
  }

  function running(remaining){
    bar.classList.remove('done');
    const total = getMin()*60*1000;
    const pct = total ? Math.max(0, Math.min(100, (remaining/total)*100)) : 0;
    const low = remaining <= 60*1000;
    inner.innerHTML = `
      <span class="tlabel">⏱️ Time left</span>
      <span class="clock${low?' low':''}">${fmt(remaining)}</span>
      <div class="track"><div class="fill${low?' low':''}" style="width:${pct}%"></div></div>
      <button class="tbtn stop" title="Stop timer">✕</button>`;
    inner.querySelector('.stop').onclick = stop;
  }

  function done(){
    bar.classList.add('done');
    inner.innerHTML = `
      <span class="doneMsg">⏰ Time's up! Great practicing! 🎉</span>
      <div class="tbtns">
        <button class="tbtn again" data-min="5">5 min</button>
        <button class="tbtn again" data-min="10">10 min</button>
        <button class="tbtn again" data-min="15">15 min</button>
      </div>`;
    inner.querySelectorAll('.tbtn').forEach(b=> b.onclick = ()=> start(+b.dataset.min));
  }

  function render(){
    const end = getEnd();
    if (!end){ chooser(); return; }
    const remaining = end - now();
    if (remaining > 0) running(remaining);
    else done();
  }

  render();
  setInterval(()=>{ if (getEnd()) render(); }, 1000);
})();
