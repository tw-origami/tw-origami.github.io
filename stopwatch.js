/* Shared per-app stopwatch. Drop <script src="/stopwatch.js"></script> before
 * </body> on any app page. Shows a small pill in the bottom-left with how long
 * the child has spent in THIS app today. Counts only while the tab is visible,
 * resets automatically each new day, and is stored per-app in localStorage. */
(function(){
  if (window.__lzStopwatch) return; window.__lzStopwatch = true;

  // app key from the first path segment (e.g. /spellit/index.html -> "spellit")
  var seg = (location.pathname.replace(/^\/+/, '').split('/')[0] || 'home').replace(/\.html?$/i, '');
  var KEY = 'lz_sw_' + (seg || 'home');

  function today(){ var d = new Date(); return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); }
  function load(){ try { var o = JSON.parse(localStorage.getItem(KEY) || 'null'); if (o && o.d === today()) return o.s | 0; } catch(e){} return 0; }
  function save(s){ try { localStorage.setItem(KEY, JSON.stringify({ d: today(), s: s })); } catch(e){} }
  var secs = load();

  var style = document.createElement('style');
  style.textContent =
    '#lzStopwatch{position:fixed;left:12px;bottom:12px;z-index:60;display:flex;align-items:center;gap:6px;' +
    'background:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);' +
    'border:1px solid rgba(15,23,42,.1);box-shadow:0 6px 20px rgba(15,23,42,.14);border-radius:999px;' +
    'padding:7px 13px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif;' +
    'font-weight:800;font-size:13.5px;color:#334155;font-variant-numeric:tabular-nums;user-select:none;pointer-events:none;}' +
    '#lzStopwatch .sw-ic{font-size:15px;line-height:1;}' +
    '#lzStopwatch .sw-lbl{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px;margin-left:2px;}' +
    '@media (max-width:480px){#lzStopwatch{font-size:12.5px;padding:6px 11px;} #lzStopwatch .sw-lbl{display:none;}}';
  document.head.appendChild(style);

  var el = document.createElement('div');
  el.id = 'lzStopwatch';
  el.title = 'Time spent in this app today';
  el.innerHTML = '<span class="sw-ic">⏱️</span><span id="lzSwTime"></span><span class="sw-lbl">today</span>';

  function fmt(s){
    var h = Math.floor(s/3600), m = Math.floor((s%3600)/60), ss = s%60;
    var p = function(n){ return String(n).padStart(2,'0'); };
    return h ? (h + ':' + p(m) + ':' + p(ss)) : (m + ':' + p(ss));
  }
  function render(){ var t = document.getElementById('lzSwTime'); if (t) t.textContent = fmt(secs); }

  function mount(){
    document.body.appendChild(el);
    // don't sit on top of the math app's full-width practice-timer bar
    if (document.getElementById('lzTimer')) el.style.bottom = '96px';
    render();
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  setInterval(function(){
    if (document.visibilityState === 'visible'){ secs++; save(secs); render(); }
  }, 1000);
})();
