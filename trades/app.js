// Trade Town shell — swaps between the trade menu and a mounted trade game.
(function(){
  const $=id=>document.getElementById(id);
  const menu=$('menu'), stage=$('stage'), navMenu=$('navMenu'), subtitle=$('subtitle');
  const SUB_MENU='Pick a trade and learn it by building — hands on, no hard hat required.';

  const ORDER=['electric','plumb','arch','build','watch'];
  const tabsEl=$('gametabs');
  ORDER.forEach(key=>{ const t=(window.TRADES||{})[key]; if(!t) return;
    const b=document.createElement('button'); b.dataset.trade=key; b.textContent=t.icon+' '+t.name;
    b.onclick=()=>openTrade(key); tabsEl.appendChild(b);
  });
  function setTab(key){ tabsEl.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.trade===key)); }

  function toMenu(){
    stage.classList.add('hidden'); stage.innerHTML='';
    menu.classList.remove('hidden');
    navMenu.classList.add('on');
    subtitle.textContent=SUB_MENU; setTab(null);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function openTrade(key){
    const trade=(window.TRADES||{})[key]; if(!trade) return;
    menu.classList.add('hidden');
    stage.classList.remove('hidden');
    subtitle.textContent=trade.icon+' '+trade.name; setTab(key);
    trade.mount(stage, { celebrate, toMenu });
    window.scrollTo({top:0,behavior:'smooth'});
  }

  menu.querySelectorAll('.tradecard[data-trade]').forEach(c=>{
    c.addEventListener('click', ()=>openTrade(c.getAttribute('data-trade')));
  });
  navMenu.addEventListener('click', toMenu);

  // ---- confetti ----
  const COLORS=['#0d9488','#f59e0b','#22c55e','#3b82f6','#ec4899','#eab308'];
  function celebrate(){
    const box=$('confetti');
    for(let i=0;i<70;i++){
      const c=document.createElement('div'); c.className='conf';
      c.style.left=Math.random()*100+'vw';
      c.style.background=COLORS[i%COLORS.length];
      c.style.animationDuration=(1.6+Math.random()*1.3)+'s';
      c.style.animationDelay=(Math.random()*.25)+'s';
      c.style.transform='rotate('+(Math.random()*360)+'deg)';
      box.appendChild(c);
      setTimeout(()=>c.remove(),3200);
    }
  }
})();
