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
    'https://www.youtube.com/shorts/Q4HOB4E-fJc',
    'https://www.youtube.com/shorts/8Yt-pf8DpBQ',
    'https://www.youtube.com/shorts/VlEalw0ssi0',
    'https://www.youtube.com/shorts/-ElY_DCBm0E',
    'https://www.youtube.com/shorts/v72JJgSM8Cs',
    'https://www.youtube.com/shorts/LvhqA6mu-rw',
    'https://www.youtube.com/shorts/-oGdcKNKVGg',
    'https://www.youtube.com/shorts/BfGNBeKRTZU',
    'https://www.youtube.com/shorts/bYkb65F2238',
    'https://www.youtube.com/shorts/vxgn-_4F-Tw',
    'https://www.youtube.com/shorts/aqzRrBpOeOM',
    'https://www.youtube.com/shorts/10oaHD-CDe8',
    'https://www.youtube.com/shorts/uL5biCoMqLQ',
    'https://www.youtube.com/shorts/gF5pNB3CHkY',
    'https://www.youtube.com/shorts/VG-wa5ZrZ6s',
    'https://www.youtube.com/shorts/MIOve6wLGdo',
    'https://www.youtube.com/shorts/50aAd_wh56M',
    'https://www.youtube.com/shorts/hVN29nsroJc',
    'https://www.youtube.com/shorts/7jMmJ1-TQzU',
    'https://www.youtube.com/shorts/yy4SXYhD4sg',
    'https://www.youtube.com/shorts/yFnJEtz3E3w',
    'https://www.youtube.com/shorts/7fOTRGt2n5I',
    'https://www.youtube.com/shorts/ZqUNDB65zoI',
    'https://www.youtube.com/shorts/sCNU5CZsmck',
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
        `<div style="max-width:440px;margin:0 auto">`+
          `<div style="position:relative;width:100%;aspect-ratio:9/16;background:#000;border-radius:16px;overflow:hidden;box-shadow:var(--shadow)">`+
            `<div style="position:absolute;top:-13%;left:0;width:100%;height:126%">`+
              `<div id="${uid}" style="width:100%;height:100%"></div>`+
            `</div>`+
            `<div class="vtap" style="position:absolute;inset:0;cursor:pointer"></div>`+
            `<div class="vend" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;flex-direction:column;gap:10px;background:#0f172a;color:#fff;font-weight:800;cursor:pointer">`+
              `<div style="width:64px;height:64px;border-radius:50%;background:rgba(220,38,38,.92);display:flex;align-items:center;justify-content:center"><div style="border-left:22px solid #fff;border-top:13px solid transparent;border-bottom:13px solid transparent;margin-left:5px"></div></div>`+
              `<div>Watch again 🔁</div>`+
            `</div>`+
            `<div class="vbadge" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:rgba(220,38,38,.92);display:flex;align-items:center;justify-content:center;pointer-events:none">`+
              `<div style="border-left:22px solid #fff;border-top:13px solid transparent;border-bottom:13px solid transparent;margin-left:5px"></div>`+
            `</div>`+
          `</div>`+
          `<div id="vtitle" style="text-align:center;font-weight:800;font-size:16px;line-height:1.35;margin-top:14px;min-height:22px"></div>`+
          `<div style="display:flex;justify-content:center;margin-top:14px">`+
            `<button class="btn btn-primary" id="vnext" style="background:#dc2626">🎲 Next video ▶</button>`+
          `</div>`+
        `</div>`;

      function esc(t){ return String(t||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
      function updateTitle(){
        const el=stage.querySelector('#vtitle'); if(!el||!player||!player.getVideoData) return;
        const d=player.getVideoData()||{};
        el.innerHTML = d.title ? esc(d.title)+(d.author?`<div style="color:var(--muted);font-weight:600;font-size:13px;margin-top:3px">${esc(d.author)}</div>`:'') : '';
      }

      const badge=stage.querySelector('.vbadge'), endCover=stage.querySelector('.vend');
      let player=null;
      ensureAPI(()=>{
        if(!document.getElementById(uid)) return; // navigated away already
        player=new YT.Player(uid, {
          width:'100%', height:'100%',
          videoId:ids[cur],
          host:'https://www.youtube-nocookie.com',
          playerVars:{ controls:0, rel:0, playsinline:1, fs:0, disablekb:1, iv_load_policy:3 },
          events:{
            onReady:()=>{ const f=player.getIframe(); if(f){ f.style.width='100%'; f.style.height='100%'; f.style.display='block'; } updateTitle(); },
            onStateChange:e=>{
              const ended=e.data===YT.PlayerState.ENDED;
              // ENDED shows YouTube's related-videos wall — cover it with our replay screen
              if(endCover) endCover.style.display=ended?'flex':'none';
              if(badge) badge.style.display=(e.data===YT.PlayerState.PLAYING||ended)?'none':'flex';
              updateTitle();
            }
          }
        });
      });

      stage.querySelector('.vtap').addEventListener('click',()=>{
        if(!player||!player.getPlayerState) return;
        if(player.getPlayerState()===1) player.pauseVideo(); else player.playVideo();
      });
      endCover.addEventListener('click',()=>{
        if(!player||!player.seekTo) return;
        endCover.style.display='none'; player.seekTo(0); player.playVideo();
      });
      stage.querySelector('#vnext').addEventListener('click',()=>{
        if(!player||!player.loadVideoById) return;
        let n=cur; if(ids.length>1){ while(n===cur) n=Math.floor(Math.random()*ids.length); }
        cur=n; if(endCover) endCover.style.display='none';
        player.loadVideoById(ids[cur]);  // user gesture → plays the next clip
        setTimeout(updateTitle, 600);
      });
    }
  };
})();
