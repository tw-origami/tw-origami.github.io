// Trade Town — Watch: a shelf of trade videos, embedded to play right here with
// the YouTube title/chrome hidden. To add a video, paste its YouTube link (or
// id) into the LIST below.
(function(){
  window.TRADES = window.TRADES || {};

  const LIST = [
    'https://www.youtube.com/shorts/ltUHj3PQf2g',
    'https://www.youtube.com/shorts/qSNGtAtRpTc',
    'https://www.youtube.com/shorts/nZJ9IOklB5M',
    'https://www.youtube.com/shorts/9Zy6YZislOE',
    'https://www.youtube.com/shorts/u_CWAz5ygTs',
    'https://www.youtube.com/shorts/za1xCbZIr2A',
  ];

  function vidId(u){ u=String(u||'').trim();
    const m=u.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    if(m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(u) ? u : '';
  }

  // load the IFrame Player API once, then run queued callbacks
  function ensureAPI(cb){
    if(window.YT && window.YT.Player) return cb();
    (window.__ytq=window.__ytq||[]).push(cb);
    if(!document.getElementById('yt-iframe-api')){
      const t=document.createElement('script'); t.id='yt-iframe-api'; t.src='https://www.youtube.com/iframe_api';
      document.head.appendChild(t);
      const prev=window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady=function(){ if(prev)prev(); (window.__ytq||[]).forEach(f=>f()); window.__ytq=[]; };
    }
  }

  let seq=0;
  TRADES.watch = {
    icon:'📺', name:'Trade Videos',
    mount(stage){
      const ids=LIST.map(vidId).filter(Boolean);
      if(!ids.length){ stage.innerHTML='<div class="card">No videos yet — add YouTube links in trades/videos.js.</div>'; return; }
      const uid='ytp_'+(seq++);
      let cur=Math.floor(Math.random()*ids.length);

      stage.innerHTML=
        `<div class="lvlbar"><span class="pill lvl" style="color:#dc2626">📺 Trade Videos</span></div>`+
        `<div style="max-width:300px;margin:0 auto">`+
          `<div style="position:relative;background:#000;border-radius:16px;overflow:hidden;box-shadow:var(--shadow)">`+
            `<div id="${uid}" style="width:100%;aspect-ratio:9/16"></div>`+
            `<div class="vtap" style="position:absolute;inset:0;cursor:pointer"></div>`+
            `<div style="position:absolute;top:0;left:0;right:0;height:14%;background:#000;pointer-events:none"></div>`+
            `<div class="vbadge" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:rgba(220,38,38,.92);display:flex;align-items:center;justify-content:center;pointer-events:none">`+
              `<div style="border-left:22px solid #fff;border-top:13px solid transparent;border-bottom:13px solid transparent;margin-left:5px"></div>`+
            `</div>`+
          `</div>`+
          `<div style="display:flex;justify-content:center;margin-top:16px">`+
            `<button class="btn btn-primary" id="vnext" style="background:#dc2626">🎲 Next video ▶</button>`+
          `</div>`+
        `</div>`;

      const badge=stage.querySelector('.vbadge');
      let player=null;
      ensureAPI(()=>{
        if(!document.getElementById(uid)) return; // navigated away already
        player=new YT.Player(uid, {
          videoId:ids[cur],
          playerVars:{ controls:0, modestbranding:1, rel:0, playsinline:1, fs:0, disablekb:1, iv_load_policy:3 },
          events:{ onStateChange:e=>{ if(badge) badge.style.display=(e.data===YT.PlayerState.PLAYING)?'none':'flex'; } }
        });
      });

      stage.querySelector('.vtap').addEventListener('click',()=>{
        if(!player||!player.getPlayerState) return;
        if(player.getPlayerState()===1) player.pauseVideo(); else player.playVideo();
      });
      stage.querySelector('#vnext').addEventListener('click',()=>{
        if(!player||!player.loadVideoById) return;
        let n=cur; if(ids.length>1){ while(n===cur) n=Math.floor(Math.random()*ids.length); }
        cur=n; player.loadVideoById(ids[cur]);  // user gesture → plays the next clip
      });
    }
  };
})();
