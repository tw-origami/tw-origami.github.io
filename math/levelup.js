// Shared "level up?" prompt. Call window.askLevelUp(nextLevel, onYes) — shows a
// modal offering to move to the next level. Yes runs onYes; No just closes.
(function(){
  const style = document.createElement('style');
  style.textContent = `
    #lzLevelUp{ position:fixed; inset:0; z-index:100; display:none; align-items:center; justify-content:center;
      background:rgba(30,41,99,.45); backdrop-filter:blur(2px); padding:20px; }
    #lzLevelUp.show{ display:flex; }
    #lzLevelUp .box{ background:#fff; border-radius:24px; box-shadow:0 24px 60px rgba(30,41,99,.35);
      padding:30px 30px 26px; max-width:380px; width:100%; text-align:center; animation:lzPop .4s cubic-bezier(.2,.9,.3,1.3); }
    @keyframes lzPop{ 0%{transform:scale(.8) translateY(16px); opacity:0} 100%{transform:scale(1) translateY(0); opacity:1} }
    #lzLevelUp .emoji{ font-size:44px; margin-bottom:6px; }
    #lzLevelUp h3{ margin:0 0 6px; font-size:24px; color:#1e293b; letter-spacing:-.5px; }
    #lzLevelUp p{ margin:0 0 20px; color:#64748b; font-size:16px; line-height:1.4; }
    #lzLevelUp p b{ color:#4f46e5; }
    #lzLevelUp .btns{ display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
    #lzLevelUp button{ font-family:inherit; font-weight:800; font-size:16px; border:none; border-radius:14px; padding:14px 22px; cursor:pointer; transition:transform .1s, background .15s; }
    #lzLevelUp button:active{ transform:scale(.95); }
    #lzLevelUp .yes{ background:#4f46e5; color:#fff; } #lzLevelUp .yes:hover{ background:#4338ca; }
    #lzLevelUp .no{ background:#eef2ff; color:#4f46e5; } #lzLevelUp .no:hover{ background:#e0e7ff; }
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.id = 'lzLevelUp';
  modal.innerHTML = `<div class="box">
      <div class="emoji">🔥🎉</div>
      <h3>20 in a row!</h3>
      <p id="lzLevelUpMsg"></p>
      <div class="btns">
        <button class="yes" id="lzYes">Yes, level up! ➡️</button>
        <button class="no" id="lzNo">Stay here</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  let cb = null;
  function close(){ modal.classList.remove('show'); window.__levelUpOpen = false; cb = null; }

  window.askLevelUp = function(nextLevel, onYes){
    cb = onYes;
    document.getElementById('lzLevelUpMsg').innerHTML =
      `You're crushing it! Ready to try <b>Level ${nextLevel}</b>?`;
    modal.classList.add('show');
    window.__levelUpOpen = true;
    document.getElementById('lzYes').focus();
  };

  document.getElementById('lzYes').onclick = ()=>{ const fn = cb; close(); if (fn) fn(); };
  document.getElementById('lzNo').onclick = close;

  // While open, Enter = Yes, Esc = No; block the page's Enter-advances handler.
  document.addEventListener('keydown', e=>{
    if (!window.__levelUpOpen) return;
    if (e.key === 'Enter'){ e.preventDefault(); e.stopImmediatePropagation(); document.getElementById('lzYes').click(); }
    else if (e.key === 'Escape'){ e.preventDefault(); e.stopImmediatePropagation(); close(); }
  }, true);
})();
