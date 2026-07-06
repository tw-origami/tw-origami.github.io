// Science Lab — 📺 Videos: embedded video lessons (chrome-free player) with a
// transcript-based summary, key ideas, and quiz below each video.
// To add a lesson, append an object to LESSONS (id = the YouTube video id).
(function(){
  const LESSONS = [
    {
      id:'pLtHyLlLt4Y',
      title:'Escaping Alcatraz — the engineering behind history’s most famous prison break',
      by:'Mark Rober',
      summary:'In 1962, three prisoners — Frank Morris and brothers John and Clarence Anglin — escaped from Alcatraz, the prison no one had ever escaped from, using a six-part plan they spent nearly a year building. In this video, Mark Rober and his team get access to the real prison and recreate every step: the fake heads left in the beds, the holes dug through concrete, the secret rooftop workshop, and a raft made of raincoats. Then they use modern science — GPS trackers on driftwood and historic tide records — to answer the big question: could the escapees have actually reached land alive?',
      ideas:[
        ['🗿 Decoy heads','Fake heads made of soap, concrete dust, toothpaste, toilet paper, and real human hair (from the prison barbershop) went on their pillows so night head-counts saw “sleeping men.”'],
        ['🥄 Bootleg tools','They dug through the concrete with sharpened cafeteria spoons — then sped up with a homemade drill built from a stolen vacuum cleaner motor, plugged into the cell’s power outlet.'],
        ['🪗 Noise cover','Digging is loud, so they only dug during the nightly “music hour” — one played the accordion, one kept watch with a homemade periscope, one scraped away.'],
        ['🎭 Hiding the work','Fake vent covers made of cardboard and soap (painted prison green) hid the holes, and fake bolts sculpted from soap replaced the real ones they’d sawed off. A “bar spreader” — two opposite-threaded bolts with a turnbuckle — bent the vent’s restriction bar.'],
        ['🛶 The raincoat raft','A raft and life vests were glued together from over 50 prison-issue raincoats using rubber cement, following designs Frank found in Popular Mechanics in the prison library. The accordion doubled as the air pump.'],
        ['🌊 The science test','Mark’s team strapped 20 GPS trackers to driftwood and tossed them in at different tide times. Result: only a ~30-minute high-tide window carries you to land (near the Golden Gate Bridge) — every other time means being swept out or hypothermia. Angel Island, the rumored target, was impossible.'],
        ['🧠 The verdict','Historic tide records show the safe window that night was 11:30–midnight. FBI records say Frank Morris pushed off at 11:40 p.m. — dead center. With no GPS and no data, he read the tides by watching debris. Mark still puts their survival odds under 50% — but if anyone beat them, it was Frank.'],
      ],
      quiz:[
        { q:'What did the prisoners first use to dig through their cell walls?',
          opts:['Sharpened spoons stolen from the cafeteria','A smuggled jackhammer','A metal file hidden in a cake','Their bare hands'],
          a:0, why:'They fashioned cafeteria spoons into picks — and later upgraded to a drill made from a vacuum cleaner motor.' },
        { q:'How did they keep guards from hearing all the digging?',
          opts:['They dug during “music hour” while one of them played the accordion','They only dug during thunderstorms','They bribed the guards','The walls were soundproof'],
          a:0, why:'Every night from 5:30 to 7 was music hour — the accordion covered the scraping while a lookout watched with a homemade periscope.' },
        { q:'What was their escape raft made from?',
          opts:['More than 50 prison-issued raincoats glued with rubber cement','Wooden pallets from the kitchen','Mattresses tied with bed sheets','A stolen guard patrol boat'],
          a:0, why:'They glued raincoat strips into 14-foot tubes — a design Frank found in Popular Mechanics — and inflated it with the accordion as an air pump.' },
        { q:'What did the GPS-driftwood experiment prove about the escape?',
          opts:['Only a ~30-minute high-tide window could carry them safely to land','The water was warm enough to swim any time','Angel Island was the easiest place to reach','The current always pushed straight back to Alcatraz'],
          a:0, why:'None of the 20 tracked logs reached Angel Island — only a few made land near the Golden Gate Bridge, and only inside one ~30-minute tidal window.' },
        { q:'What time did Frank Morris launch — and why does that matter?',
          opts:['11:40 p.m. — right inside the 11:30–midnight safe tide window','9:30 a.m. — right after breakfast','Exactly midnight — when the searchlights turned off','3 a.m. — at low tide'],
          a:0, why:'Historic tide records show the safe window that night was 11:30–midnight, and FBI records show he pushed off at 11:40 — with no modern data, he read the tides by watching debris drift.' },
      ]
    },
  ];

  // ---- chrome-free player (shared API loader) ----
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
  const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  let mounted=false, seq=0;
  window.SCI_VID = {
    mount(stageEl){
      if(mounted){ stageEl.classList.remove('hidden'); return; }
      mounted=true;
      stageEl.innerHTML = LESSONS.map((L,li)=>{
        const uid='sciyt_'+(seq++);
        L._uid=uid;
        const ideas=L.ideas.map(([h,b])=>
          `<div class="vk-item"><b>${esc(h)}</b><span>${esc(b)}</span></div>`).join('');
        const quiz=L.quiz.map((q,qi)=>
          `<div class="vq" data-l="${li}" data-q="${qi}">`+
            `<div class="vq-q">${qi+1}. ${esc(q.q)}</div>`+
            q.opts.map((o,oi)=>`<button class="choice vq-c" data-oi="${oi}">${esc(o)}</button>`).join('')+
            `<div class="vq-why"></div>`+
          `</div>`).join('');
        return `<div class="card" style="align-items:stretch">`+
          `<div class="vl-title">📺 ${esc(L.title)}</div>`+
          `<div class="vl-by">${esc(L.by)}</div>`+
          `<div style="max-width:640px;margin:0 auto 6px;width:100%">`+
            `<div style="position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:16px;overflow:hidden">`+
              `<div style="position:absolute;top:-17%;left:0;width:100%;height:134%"><div id="${uid}" style="width:100%;height:100%"></div></div>`+
              `<div class="vtap" data-uid="${uid}" style="position:absolute;inset:0;cursor:pointer"></div>`+
              `<div class="vbadge" data-uid="${uid}" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;background:rgba(220,38,38,.92);display:flex;align-items:center;justify-content:center;pointer-events:none">`+
                `<div style="border-left:22px solid #fff;border-top:13px solid transparent;border-bottom:13px solid transparent;margin-left:5px"></div>`+
              `</div>`+
            `</div>`+
          `</div>`+
          `<div class="vl-sec">📝 What happens in this video</div>`+
          `<p class="vl-sum">${esc(L.summary)}</p>`+
          `<div class="vl-sec">💡 Key ideas</div>`+
          `<div class="vk">${ideas}</div>`+
          `<div class="vl-sec">🧠 Prove you watched it</div>`+
          quiz+
        `</div>`;
      }).join('');

      // players
      const players={};
      ensureAPI(()=>{
        LESSONS.forEach(L=>{
          if(!document.getElementById(L._uid)) return;
          players[L._uid]=new YT.Player(L._uid,{
            width:'100%', height:'100%', videoId:L.id,
            playerVars:{ controls:0, modestbranding:1, rel:0, playsinline:1, fs:0, disablekb:1, iv_load_policy:3 },
            events:{
              onReady:e=>{ const f=e.target.getIframe(); f.style.width='100%'; f.style.height='100%'; },
              onStateChange:e=>{ const b=stageEl.querySelector('.vbadge[data-uid="'+L._uid+'"]');
                if(b) b.style.display=(e.data===YT.PlayerState.PLAYING)?'none':'flex'; }
            }
          });
        });
      });
      stageEl.querySelectorAll('.vtap').forEach(el=>{
        el.addEventListener('click',()=>{
          const p=players[el.getAttribute('data-uid')]; if(!p||!p.getPlayerState) return;
          if(p.getPlayerState()===1) p.pauseVideo(); else p.playVideo();
        });
      });

      // quiz wiring
      stageEl.querySelectorAll('.vq').forEach(block=>{
        const L=LESSONS[+block.dataset.l], q=L.quiz[+block.dataset.q];
        const btns=[...block.querySelectorAll('.vq-c')];
        btns.forEach(btn=>btn.addEventListener('click',()=>{
          if(block.dataset.done) return; block.dataset.done='1';
          const oi=+btn.dataset.oi, ok=oi===q.a;
          btn.classList.add(ok?'correct':'wrong');
          if(!ok) btns[q.a].classList.add('correct');
          btns.forEach(b=>b.disabled=true);
          const why=block.querySelector('.vq-why');
          why.textContent=(ok?'✅ ':'❌ ')+q.why;
          why.className='vq-why '+(ok?'good':'bad');
        }));
      });
      stageEl.classList.remove('hidden');
    },
    hide(stageEl){ stageEl.classList.add('hidden');
      // pause any playing video when leaving the tab
      document.querySelectorAll('iframe[src*="youtube"]').forEach(f=>{
        try{ f.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*'); }catch(e){}
      });
    }
  };
})();
