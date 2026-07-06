// Trade Town — Watch: a shelf of trade videos, embedded to play right here.
// To add a video, paste its YouTube link (or id) into the LIST below.
(function(){
  window.TRADES = window.TRADES || {};

  const LIST = [
    'https://www.youtube.com/shorts/ltUHj3PQf2g',
    'https://www.youtube.com/shorts/qSNGtAtRpTc',
    'https://www.youtube.com/shorts/nZJ9IOklB5M',
    'https://www.youtube.com/shorts/9Zy6YZislOE',
  ];

  function vidId(u){ u=String(u||'').trim();
    const m=u.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    if(m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(u) ? u : '';
  }

  TRADES.watch = {
    icon:'📺', name:'Trade Videos',
    mount(stage){
      const ids=LIST.map(vidId).filter(Boolean);
      const cards = ids.map(id=>
        `<div style="background:#000;border-radius:16px;overflow:hidden;box-shadow:var(--shadow)">`+
          `<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1" `+
            `style="width:100%;aspect-ratio:9/16;border:0;display:block" `+
            `allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`+
        `</div>`).join('');
      stage.innerHTML=
        `<div class="lvlbar"><span class="pill lvl" style="color:#dc2626">📺 Trade Videos</span></div>`+
        `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;max-width:640px;margin:0 auto">`+
          cards+
        `</div>`;
    }
  };
})();
