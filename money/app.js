// Money Smarts — four money games sharing one shell + scorebar.
(function(){
  const $=id=>document.getElementById(id);
  const menu=$('menu'), stage=$('stage'), navMenu=$('navMenu'), subtitle=$('subtitle'), scorebar=$('scorebar');
  const SUB='Count it, make change, add it up, and beat the sale — pick a game!';

  // ---- helpers --------------------------------------------------------------
  const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
  const money=c=>'$'+(c/100).toFixed(2);
  const esc=t=>String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;');

  // denominations in cents
  const COINS=[{k:'penny',v:1,lbl:'1¢'},{k:'nickel',v:5,lbl:'5¢'},{k:'dime',v:10,lbl:'10¢'},{k:'quarter',v:25,lbl:'25¢'}];
  const BILLS=[{v:100,lbl:'$1'},{v:500,lbl:'$5'},{v:1000,lbl:'$10'},{v:2000,lbl:'$20'}];
  const coinHTML=c=>`<div class="coin ${c.k}">${c.lbl}</div>`;
  const billHTML=b=>`<div class="bill">${b.lbl}</div>`;

  // ---- score ----------------------------------------------------------------
  let correct=0, streak=0;
  function score(ok){ if(ok){ correct++; streak++; } else streak=0; $('correctCount').textContent=correct; $('streak').textContent=streak; }

  // ---- confetti -------------------------------------------------------------
  const COLORS=['#16a34a','#f59e0b','#22c55e','#3b82f6','#ec4899','#eab308'];
  function celebrate(){ const box=$('confetti');
    for(let i=0;i<60;i++){ const c=document.createElement('div'); c.className='conf';
      c.style.left=Math.random()*100+'vw'; c.style.background=COLORS[i%COLORS.length];
      c.style.animationDuration=(1.5+Math.random()*1.3)+'s'; c.style.animationDelay=(Math.random()*.2)+'s';
      c.style.transform='rotate('+(Math.random()*360)+'deg)'; box.appendChild(c); setTimeout(()=>c.remove(),3000);
    }
  }

  // multiple-choice block builder
  function mcq(prompt, opts, correctIdx, onDone){
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div class="prompt">${prompt}</div>`;
    const grid=document.createElement('div'); grid.className='choices';
    opts.forEach((o,i)=>{ const b=document.createElement('button'); b.className='choice'; b.textContent=o;
      b.onclick=()=>{
        if(grid.dataset.done) return; grid.dataset.done='1';
        const ok=i===correctIdx;
        b.classList.add(ok?'correct':'wrong');
        if(!ok) grid.children[correctIdx].classList.add('correct');
        [...grid.children].forEach(c=>c.disabled=true);
        onDone(ok);
      };
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    return wrap;
  }
  // distractors near a cents value
  function nearChoices(correctCents, spreads){
    const set=new Set([correctCents]); const out=[correctCents];
    const opts=shuffle(spreads);
    for(const d of opts){ const v=correctCents+d; if(v>0 && !set.has(v)){ set.add(v); out.push(v); } if(out.length>=4) break; }
    while(out.length<4){ const v=correctCents+rnd(1,9)*5*(Math.random()<.5?1:-1); if(v>0&&!set.has(v)){set.add(v);out.push(v);} }
    return shuffle(out);
  }

  // =========================================================================
  //  GAME 1 — COUNT IT
  // =========================================================================
  const countGame={ icon:'🪙', name:'Count It',
    mount(){
      function round(){
        // build a random pile
        const pile=[]; let cents=0;
        const nb=rnd(0,2); for(let i=0;i<nb;i++){ const b=pick(streak>2?BILLS:BILLS.slice(0,2)); pile.push({bill:b}); cents+=b.v; }
        const nq=rnd(0,3), nd=rnd(0,3), nn=rnd(0,3), np=rnd(0,4);
        [['quarter',nq],['dime',nd],['nickel',nn],['penny',np]].forEach(([k,n])=>{
          const c=COINS.find(x=>x.k===k); for(let i=0;i<n;i++){ pile.push({coin:c}); cents+=c.v; }
        });
        if(pile.length<2){ return round(); }
        const tokens=shuffle(pile).map(p=>p.bill?billHTML(p.bill):coinHTML(p.coin)).join('');
        const opts=nearChoices(cents,[5,10,-5,-10,25,-25,1,-1,50]).map(money);
        const ci=opts.indexOf(money(cents));

        stage.innerHTML=`<div class="card">
          <div class="gtitle"><span class="pill">🪙 Count It</span></div>
          <p class="teach">Penny = 1¢ · Nickel = 5¢ · Dime = 10¢ · Quarter = 25¢. Add the coins and bills together.</p>
          <div class="tokens">${tokens}</div></div>`;
        const card=stage.querySelector('.card');
        const q=mcq('How much money is this?', opts, ci, ok=>{
          score(ok); if(ok) celebrate();
          const fb=document.createElement('div'); fb.className='feedback '+(ok?'good':'bad');
          fb.textContent = ok ? 'Correct — '+money(cents)+'!' : 'It was '+money(cents)+'.';
          card.appendChild(fb); addNext(card, round);
        });
        card.appendChild(q);
      }
      round();
    }
  };

  // =========================================================================
  //  GAME 2 — MAKE CHANGE (cash register)
  // =========================================================================
  const changeGame={ icon:'🧾', name:'Make Change',
    mount(){
      function round(){
        const price=rnd(15,1885); // 0.15 .. 18.85
        // pay with a tidy amount above the price
        const payOpts=[Math.ceil(price/100)*100, Math.ceil(price/500)*500, Math.ceil(price/1000)*1000];
        const paid=pick(payOpts.filter(p=>p>price)) || Math.ceil(price/100)*100+100;
        const due=paid-price;

        const denoms=[...COINS, ...BILLS.filter(b=>b.v<=paid)];
        let tray=[];
        stage.innerHTML=`<div class="card">
          <div class="gtitle"><span class="pill">🧾 Make Change</span></div>
          <p class="teach">Tip: start at the price and count <b>up</b> to what they paid. Add coins first, then bills.</p>
          <div class="receipt">
            <div class="ln"><span>Item price</span><span>${money(price)}</span></div>
            <div class="ln"><span>Customer paid</span><span>${money(paid)}</span></div>
            <div class="ln tot"><span>Change due</span><span>${money(due)}</span></div>
          </div>
          <div class="changeread"><span id="cgiven">$0.00</span> <span class="due">given of ${money(due)}</span></div>
          <div class="tray" id="tray"></div>
          <div class="drawer" id="drawer"></div>
          <div class="controls">
            <button class="btn btn-ghost" id="undo">↶ Undo</button>
            <button class="btn btn-ghost" id="clear">Clear</button>
            <button class="btn btn-primary" id="give">Give change ▶</button>
          </div>
          <div class="feedback" id="fb"></div>
        </div>`;
        const drawer=stage.querySelector('#drawer');
        denoms.forEach(d=>{ const b=document.createElement('button'); b.className='denom';
          b.innerHTML = d.k ? coinHTML(d) : billHTML(d);
          b.onclick=()=>{ tray.push(d); redraw(); };
          drawer.appendChild(b);
        });
        function total(){ return tray.reduce((s,d)=>s+d.v,0); }
        function redraw(){
          const t=stage.querySelector('#tray');
          t.innerHTML=tray.map(d=>d.k?coinHTML(d):billHTML(d)).join('');
          const g=total(); const gr=stage.querySelector('#cgiven');
          gr.textContent=money(g); gr.style.color = g>due ? 'var(--wrong)' : g===due ? 'var(--correct)' : 'inherit';
        }
        stage.querySelector('#undo').onclick=()=>{ tray.pop(); redraw(); };
        stage.querySelector('#clear').onclick=()=>{ tray=[]; redraw(); };
        stage.querySelector('#give').onclick=()=>{
          const g=total(), fb=stage.querySelector('#fb');
          if(g===due){ score(true); celebrate(); fb.className='feedback good'; fb.textContent='Perfect change — '+money(due)+'!';
            stage.querySelector('#give').disabled=true; addNext(stage.querySelector('.card'), round);
          } else if(g>due){ score(false); fb.className='feedback bad'; fb.textContent='That’s '+money(g-due)+' too much — take some back.'; }
          else { score(false); fb.className='feedback bad'; fb.textContent='Still '+money(due-g)+' short.'; }
        };
      }
      round();
    }
  };

  // =========================================================================
  //  GAME 3 — ADD IT UP
  // =========================================================================
  const GROCERIES=['🍎 Apples','🥛 Milk','🍞 Bread','🧀 Cheese','🥚 Eggs','🍌 Bananas','🧴 Shampoo','🍝 Pasta','🍪 Cookies','🥤 Juice'];
  const BILLKINDS=['⚡ Electric','💧 Water','📱 Phone','📺 Internet','🚗 Car','🏠 Rent'];
  const addupGame={ icon:'➕', name:'Add It Up',
    mount(){
      function round(){
        const shopping=Math.random()<.6;
        const names=shuffle(shopping?GROCERIES:BILLKINDS).slice(0, rnd(3,4));
        // whole-dollar amounts only — no pennies
        const items=names.map(n=>({n, c: (shopping ? rnd(1,15) : rnd(15,99)) * 100}));
        const total=items.reduce((s,i)=>s+i.c,0);
        const leftover = !shopping && Math.random()<.5;
        const budget = leftover ? total + rnd(5,60)*100 : 0;

        const rows=items.map(i=>`<div class="ln"><span>${i.n}</span><span>${money(i.c)}</span></div>`).join('');
        let promptTxt, answer, spreads;
        if(leftover){ promptTxt=`You have ${money(budget)}. After paying these, how much is left?`; answer=budget-total; spreads=[100,-100,500,-500,1000,total>500?-total:100]; }
        else { promptTxt='What is the total?'; answer=total; spreads=[100,-100,200,-200,500,-500,1000]; }

        stage.innerHTML=`<div class="card">
          <div class="gtitle"><span class="pill">➕ Add It Up</span></div>
          <p class="teach">Line up the amounts and add them up, one dollar amount at a time.</p>
          <div class="receipt">${rows}${leftover?`<div class="ln tot"><span>You have</span><span>${money(budget)}</span></div>`:`<div class="ln tot"><span>Total</span><span>?</span></div>`}</div>
        </div>`;
        const card=stage.querySelector('.card');
        const opts=nearChoices(answer,spreads).map(money); const ci=opts.indexOf(money(answer));
        const q=mcq(promptTxt, opts, ci, ok=>{ score(ok); if(ok) celebrate();
          const fb=document.createElement('div'); fb.className='feedback '+(ok?'good':'bad');
          fb.textContent= ok? 'Correct — '+money(answer)+'!' : 'It was '+money(answer)+'.';
          card.appendChild(fb); addNext(card, round);
        });
        card.appendChild(q);
      }
      round();
    }
  };

  // =========================================================================
  //  GAME 4 — PERCENT OFF  (guided 3-step teaching)
  // =========================================================================
  const ITEMS=['🎧 Headphones','👟 Sneakers','🎮 Video game','🚲 Bike','⌚ Watch','🎒 Backpack','📚 Book set','🛹 Skateboard'];
  const percentGame={ icon:'🏷️', name:'Percent Off',
    mount(){
      function round(){
        const price=pick([2000,4000,6000,8000,10000,3000,5000]); // multiples that keep 10% clean
        const pct=pick([10,20,30,40,50]);
        const item=pick(ITEMS);
        const tenth=price/10;                 // 10% of price
        const save=tenth*(pct/10);            // pct of price
        const sale=price-save;
        const k=pct/10;

        stage.innerHTML=`<div class="card">
          <div class="gtitle"><span class="pill">🏷️ Percent Off</span></div>
          <p class="prompt" style="margin-bottom:4px">${item} — ${money(price)}, now <b>${pct}% off</b></p>
          <p class="teach">The quick trick: find <b>10%</b> first (just move the decimal one spot left), then build up to the percent you need.</p>
          <div class="steps" id="steps">
            <div class="step on" id="s1"><b>Step 1.</b> 10% of ${money(price)} — move the decimal one place left.</div>
            <div class="step" id="s2"><b>Step 2.</b> ${pct}% is <b>${k}×</b> that 10% amount.</div>
            <div class="step" id="s3"><b>Step 3.</b> Sale price = ${money(price)} − the discount.</div>
          </div>
          <div id="qslot"></div>
          <div class="feedback" id="fb"></div>
          <div class="controls" id="ctrl"></div>
        </div>`;
        const qslot=stage.querySelector('#qslot'), fb=stage.querySelector('#fb');

        // Step 1 question: 10% of price
        step1();
        function step1(){
          qslot.innerHTML='';
          const opts=shuffle([tenth, tenth*2, tenth/2>=1?tenth/2:tenth+100, tenth+500]).map(money);
          const q=mcq('What is 10% of '+money(price)+'?', opts, opts.indexOf(money(tenth)), ok=>{
            score(ok); if(!ok) fb.className='feedback bad', fb.textContent='10% of '+money(price)+' is '+money(tenth)+' — decimal moves one left.';
            else { fb.className='feedback good'; fb.textContent='Yes! 10% = '+money(tenth)+'.'; }
            stage.querySelector('#s2').classList.add('on');
            setTimeout(step2, 650);
          });
          qslot.appendChild(q);
        }
        function step2(){
          fb.textContent=''; qslot.innerHTML='';
          if(pct===10){ stage.querySelector('#s3').classList.add('on'); return step3(); }
          const opts=shuffle([save, tenth, save+tenth, save-tenth>0?save-tenth:save+500]).map(money);
          const q=mcq(pct+'% is '+k+' × '+money(tenth)+'. So the discount is…', opts, opts.indexOf(money(save)), ok=>{
            score(ok); fb.className='feedback '+(ok?'good':'bad');
            fb.textContent= ok? 'Right — you save '+money(save)+'.' : k+' × '+money(tenth)+' = '+money(save)+'.';
            stage.querySelector('#s3').classList.add('on'); setTimeout(step3, 650);
          });
          qslot.appendChild(q);
        }
        function step3(){
          fb.textContent=''; qslot.innerHTML='';
          const opts=shuffle([sale, price, save, sale-tenth>0?sale-tenth:sale+tenth]).map(money);
          const q=mcq('So what’s the sale price? '+money(price)+' − '+money(save)+' =', opts, opts.indexOf(money(sale)), ok=>{
            score(ok); if(ok) celebrate();
            fb.className='feedback '+(ok?'good':'bad');
            fb.textContent= ok? '🎉 '+money(sale)+' — you saved '+money(save)+'!' : 'Sale price is '+money(sale)+'.';
            addNext(stage.querySelector('.card'), round);
          });
          qslot.appendChild(q);
        }
      }
      round();
    }
  };

  // ---- shell ----------------------------------------------------------------
  const GAMES={ count:countGame, change:changeGame, addup:addupGame, percent:percentGame };
  const ORDER=['count','change','addup','percent'];
  const tabsEl=$('gametabs');
  ORDER.forEach(key=>{ const g=GAMES[key]; const b=document.createElement('button');
    b.dataset.game=key; b.textContent=g.icon+' '+g.name; b.onclick=()=>openGame(key); tabsEl.appendChild(b);
  });
  function setTab(key){ tabsEl.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.game===key)); }

  function addNext(card, fn){
    const ctrl=card.querySelector('#ctrl') || (()=>{ const d=document.createElement('div'); d.className='controls'; card.appendChild(d); return d; })();
    ctrl.innerHTML=''; const b=document.createElement('button'); b.className='btn btn-primary'; b.textContent='Next ▶'; b.onclick=fn; ctrl.appendChild(b);
  }

  function openGame(key){
    const g=GAMES[key]; if(!g) return;
    menu.classList.add('hidden'); stage.classList.remove('hidden');
    scorebar.style.display='flex'; navMenu.classList.remove('on');
    subtitle.textContent=g.icon+' '+g.name; setTab(key);
    g.mount();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function toMenu(){
    stage.classList.add('hidden'); stage.innerHTML=''; menu.classList.remove('hidden');
    scorebar.style.display='none'; navMenu.classList.add('on'); subtitle.textContent=SUB; setTab(null);
    window.scrollTo({top:0,behavior:'smooth'});
  }
  menu.querySelectorAll('.gcard').forEach(c=>c.addEventListener('click',()=>openGame(c.getAttribute('data-game'))));
  navMenu.addEventListener('click', toMenu);
})();
