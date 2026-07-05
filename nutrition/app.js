// Nutrition Quest — 5 games, all reading from window.LIB (library.js).
(function(){
  const LIB = window.LIB;
  const $ = id => document.getElementById(id);
  const el = (tag, cls, html) => { const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
  const shuffle = a => { const b=a.slice(); for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const sample = (a,n) => shuffle(a).slice(0,n);
  // real food image when available, else the emoji. inline=small (in text), big=for tiles/plate.
  const foodInline = f => f.img ? '<img class="ficon" src="foodimg/'+f.img+'" alt="">' : f.emoji;
  const foodBig = f => f.img ? '<img class="fimg" src="foodimg/'+f.img+'" alt="">' : f.emoji;

  const stage = $('stage'), menu = $('menu');
  let correct = 0, streak = 0;

  function bumpScore(ok){
    if(ok){ correct++; streak++; } else streak = 0;
    $('correctCount').textContent = correct;
    $('streak').textContent = streak;
    if(ok && streak>0 && streak%5===0) celebrate();
  }
  function celebrate(){
    const colors=['#16a34a','#f59e0b','#4f46e5','#dc2626','#0ea5e9','#ec4899'], box=$('confetti');
    for(let i=0;i<80;i++){ const c=el('div','conf'); c.style.left=Math.random()*100+'vw'; c.style.background=colors[i%colors.length];
      c.style.animationDuration=(1.6+Math.random()*1.4)+'s'; c.style.animationDelay=(Math.random()*0.4)+'s'; box.appendChild(c); setTimeout(()=>c.remove(),3400); }
  }

  function showMenu(){
    stage.classList.add('hidden'); stage.innerHTML='';
    menu.classList.remove('hidden');
    $('scorebar').style.display='none';
    $('navMenu').classList.add('on');
    $('subtitle').textContent='Pick a game to start!';
  }
  function openGame(name){
    menu.classList.add('hidden'); stage.classList.remove('hidden'); stage.innerHTML='';
    $('scorebar').style.display='flex';
    GAMES[name]();
  }
  function backBtn(){ const b=el('button','btn btn-ghost','← Menu'); b.onclick=showMenu; return b; }

  // ============ 1) MATCHING PAIRS ============
  function gameMatch(){
    let deck = 'food'; // 'food' = what's in a food; 'function' = what a body-job needs
    const ALL_NUTRIENTS = Object.keys(LIB.NUTRIENTS);
    // How many foods contain each nutrient — rarer nutrients make a food a more standout source.
    const FOOD_COUNT = {};
    LIB.FOODS.forEach(f=> f.nutrients.forEach(n=> FOOD_COUNT[n.nutrient]=(FOOD_COUNT[n.nutrient]||0)+1));
    const TOTALF = LIB.FOODS.length;
    // Ranking score: excellent-tier wins big; then the fewer foods that offer it, the more standout.
    const rankScore = f => (f.tier==='excellent'?1000:0) + (TOTALF - (FOOD_COUNT[f.name]||TOTALF));

    function buildRound(){
      if(deck==='food'){
        const f = pick(LIB.FOODS.filter(x=>x.nutrients.length>=2));
        const chosen = sample(f.nutrients, Math.min(5, f.nutrients.length)); // [{nutrient,tier}]
        const inSet = new Set(chosen.map(c=>c.nutrient));
        const notIn = ALL_NUTRIENTS.filter(n=>!f.nutrients.some(x=>x.nutrient===n));
        const distract = sample(notIn, Math.min(3, notIn.length));
        return {
          isFood:true,
          question:`Which nutrients does ${foodInline(f)} ${f.food} have?`,
          correct:inSet, distract,
          intro:`${foodInline(f)} ${f.food} — ranked by what it's a top source of:`,
          // reveal ALL of the food's nutrients, ranked, so the lesson is complete
          facts: f.nutrients.map(c=>({ name:c.nutrient, tier:c.tier, does:LIB.NUTRIENTS[c.nutrient].does }))
        };
      } else {
        const fn = pick(LIB.FUNCTIONS);
        const chosen = sample(fn.nutrients, Math.min(5, fn.nutrients.length)); // [names]
        const inSet = new Set(chosen);
        const notIn = ALL_NUTRIENTS.filter(n=>!fn.nutrients.includes(n));
        const distract = sample(notIn, Math.min(3, notIn.length));
        return {
          isFood:false,
          question:`Which nutrients help with ${fn.emoji} ${fn.fn}?`,
          correct:inSet, distract,
          intro:`For ${fn.emoji} ${fn.fn}, your body uses:`,
          facts: chosen.map(n=>({ name:n, does:LIB.NUTRIENTS[n].does }))
        };
      }
    }

    function round(){
      $('subtitle').textContent = deck==='food'
        ? 'Tap every nutrient this food has, then Check.'
        : 'Tap every nutrient this body-job needs, then Check.';
      stage.innerHTML='';
      const toggle=el('div','center');
      ['food','function'].forEach(d=>{ const b=el('button','btn '+(deck===d?'btn-primary':'btn-ghost'), d==='food'?'🍎 What\'s in a food?':'💪 What a body-job needs');
        b.onclick=()=>{ deck=d; round(); }; toggle.appendChild(b); });
      stage.appendChild(toggle);

      const R=buildRound();
      const card=el('div','card'); card.style.marginTop='14px';
      card.appendChild(el('div','prompt', R.question));
      card.appendChild(el('div','promptsub','Tap all that apply — watch out for ones it doesn\'t have!'));
      const grid=el('div','tiles');
      const sel=new Set();
      const tiles = shuffle([...[...R.correct].map(n=>({n,ok:true})), ...R.distract.map(n=>({n,ok:false}))]);
      tiles.forEach(o=>{ const t=el('div','tile', o.n); t._n=o.n; t._ok=o.ok;
        t.onclick=()=>{ if(card.dataset.done) return; if(sel.has(o.n)){ sel.delete(o.n); t.classList.remove('sel'); } else { sel.add(o.n); t.classList.add('sel'); } };
        grid.appendChild(t); });
      card.appendChild(grid);
      const fb=el('div','feedback',''); const ctr=el('div','center');
      ctr.appendChild(mkBtn('Check ✓',()=>{
        card.dataset.done='1';
        const okExact = sel.size===R.correct.size && [...sel].every(n=>R.correct.has(n));
        [...grid.children].forEach(t=>{ t.classList.remove('sel'); t.setAttribute('disabled','');
          if(R.correct.has(t._n)) t.classList.add('correct');
          else if(sel.has(t._n)) t.classList.add('wrong');
        });
        fb.textContent = okExact?'🎉 You got them all!':'Close — the green ones are the right answers.'; fb.className='feedback '+(okExact?'good':'bad');
        bumpScore(okExact);
        // reveal: what each nutrient does + how much (%DV per serving, strongest first)
        const facts=el('div','nutfacts');
        facts.appendChild(el('div','intro', R.intro));
        const rows = R.isFood ? R.facts.slice().sort((a,b)=> rankScore(b)-rankScore(a)) : R.facts;
        const MEDALS=['🥇','🥈','🥉'];
        rows.forEach((f,i)=>{
          // "how much is a lot?" context: kid daily target if we have one, else the label DV
          const kd = LIB.KID_DAILY[f.name];
          const dv = LIB.NUTRIENTS[f.name] && LIB.NUTRIENTS[f.name].dv;
          const daily = kd ? ' <span class="daily">('+kd.note+')</span>'
                       : (dv && dv!=='—' ? ' <span class="daily">(Daily goal on labels: '+dv+'.)</span>' : '');
          if(R.isFood){
            const top = (i===0) || f.tier==='excellent';   // #1 (or any 'excellent' source) highlighted
            const badge = MEDALS[i] || ('#'+(i+1));
            facts.appendChild(el('div','nutfact '+(top?'exc':'low'),
              '<span class="pct">'+badge+'</span>'+
              '<span><span class="nn">'+f.name+'</span> — '+f.does+'.'+daily+'</span>'));
          } else {
            facts.appendChild(el('div','nutfact low','<span><span class="nn">'+f.name+'</span> — '+f.does+'.'+daily+'</span>'));
          }
        });
        if(R.isFood) facts.appendChild(el('div','keynote','🥇 = what this food is one of the biggest sources of. Lower down = smaller amounts.'));
        card.appendChild(facts);
        ctr.innerHTML=''; ctr.appendChild(mkBtn('Next ▶',round)); ctr.appendChild(backBtn());
      }));
      ctr.appendChild(backBtn());
      card.appendChild(fb); card.appendChild(ctr);
      stage.appendChild(card);
    }
    round();
  }

  // ============ 2) BEST FUEL ============
  function gameFuel(){
    $('subtitle').textContent='Pick the best choice(s) for the situation.';
    let queue=shuffle(LIB.SCENARIOS.slice());
    function next(){
      if(!queue.length) queue=shuffle(LIB.SCENARIOS.slice());
      const s=queue.shift();
      stage.innerHTML='';
      const card=el('div','card');
      card.appendChild(el('div','prompt', s.prompt));
      card.appendChild(el('div','promptsub','Tap every good choice, then Check.'));
      const grid=el('div','tiles');
      const sel=new Set();
      s.options.forEach((o,i)=>{ const t=el('div','tile','<span class="em">'+o.emoji+'</span>'+o.label);
        t.onclick=()=>{ if(card.dataset.done) return; if(sel.has(i)){ sel.delete(i); t.classList.remove('sel'); } else { sel.add(i); t.classList.add('sel'); } };
        grid.appendChild(t); t._i=i; });
      card.appendChild(grid);
      const fb=el('div','feedback',''); const why=el('div','why','');
      const ctr=el('div','center');
      const check=mkBtn('Check ✓',()=>{
        card.dataset.done='1';
        const correctSet=new Set(s.options.map((o,i)=>o.correct?i:-1).filter(i=>i>=0));
        let ok = sel.size===correctSet.size && [...sel].every(i=>correctSet.has(i));
        [...grid.children].forEach(t=>{ t.classList.remove('sel');
          if(correctSet.has(t._i)) t.classList.add('correct');
          else if(sel.has(t._i)) t.classList.add('wrong');
          t.setAttribute('disabled','');
        });
        fb.textContent = ok?'🎉 Perfect fuel!':'Not quite — see the green ones.'; fb.className='feedback '+(ok?'good':'bad');
        why.textContent=s.why; bumpScore(ok);
        ctr.innerHTML=''; ctr.appendChild(mkBtn('Next ▶',next)); ctr.appendChild(backBtn());
      });
      ctr.appendChild(check); ctr.appendChild(backBtn());
      card.appendChild(fb); card.appendChild(why); card.appendChild(ctr);
      stage.appendChild(card);
    }
    next();
  }

  // ============ 3) LABEL READER ============
  function gameLabel(){
    $('subtitle').textContent='Read the label and answer the questions.';
    let queue=shuffle(LIB.LABELS.slice());
    function next(){
      if(!queue.length) queue=shuffle(LIB.LABELS.slice());
      const L=queue.shift(); let qi=0;
      function render(reveal){
        stage.innerHTML='';
        const card=el('div','card');
        card.appendChild(el('div','prompt', L.emoji+' '+L.name));
        // label
        const lab=el('div','label');
        lab.appendChild(el('div','lt','Nutrition Facts'));
        lab.appendChild(el('div','row','<span>Serving size</span><span>'+L.servingSize+'</span>'));
        lab.appendChild(el('div','row big','<span>Servings per container</span><span>'+L.servingsPerContainer+'</span>'));
        lab.appendChild(el('div','row','<span><b>Calories</b></span><span><b>'+L.calories+'</b></span>'));
        if(L.sodiumMg!=null) lab.appendChild(el('div','row','<span>Sodium</span><span>'+L.sodiumMg+'mg</span>'));
        lab.appendChild(el('div','row','<span>Dietary Fiber</span><span>'+L.fiberG+'g</span>'));
        lab.appendChild(el('div','row sug','<span>Total Sugars</span><span>'+L.sugarG+'g</span>'));
        card.appendChild(lab);
        // ingredients (highlight sugars only on reveal)
        const ing=el('div','ingredients');
        let ingHtml = L.ingredients.map(it=>{
          const isSugar = LIB.SUGAR_ALIASES.some(a=>it.toLowerCase().includes(a));
          return (reveal && isSugar) ? '<span class="sugword">'+it+'</span>' : it;
        }).join(', ');
        ing.innerHTML='<b>Ingredients</b><br>'+ingHtml;
        card.appendChild(ing);
        // "is that a lot?" daily guide for kids
        const KD=LIB.KID_DAILY;
        const guide=el('div','dailybox');
        const rows=[];
        rows.push('🍬 <b>Sugar:</b> this has '+L.sugarG+'g per serving — kids should stay '+KD['Added sugar'].amount+' of <i>added</i> sugar a day.');
        rows.push('🌾 <b>Fiber:</b> this has '+L.fiberG+'g per serving — kids need '+KD['Fiber'].amount+' a day.');
        if(L.sodiumMg!=null) rows.push('🧂 <b>Sodium:</b> this has '+L.sodiumMg+'mg per serving — kids should stay '+KD['Sodium'].amount+' a day.');
        guide.innerHTML='<b class="gt">💡 Is that a lot?</b>'+rows.map(r=>'<div class="gr">'+r+'</div>').join('');
        card.appendChild(guide);
        // question
        const Q=L.questions[qi];
        card.appendChild(el('div','prompt', Q.q));
        const grid=el('div','tiles');
        Q.choices.forEach((c,i)=>{ const t=el('div','tile', c);
          t.onclick=()=>{ if(card.dataset.done) return; card.dataset.done='1';
            [...grid.children].forEach((x,j)=>{ if(j===Q.answer) x.classList.add('correct'); else if(j===i) x.classList.add('wrong'); x.setAttribute('disabled',''); });
            const ok=i===Q.answer; bumpScore(ok);
            fb.textContent=ok?'✅ Correct!':'❌ Not quite.'; fb.className='feedback '+(ok?'good':'bad');
            why.textContent=Q.explain;
            const showSugar = /sugar/i.test(Q.q);
            ctr.innerHTML='';
            const moreQ = qi < L.questions.length-1;
            ctr.appendChild(mkBtn(moreQ?'Next question ▶':'New label ▶', ()=>{ if(moreQ){ qi++; render(showSugar); } else next(); }));
            ctr.appendChild(backBtn());
            if(showSugar){ render.__reveal=true; renderReveal(); }
          };
          grid.appendChild(t); });
        card.appendChild(grid);
        const fb=el('div','feedback',''); const why=el('div','why','');
        const ctr=el('div','center'); ctr.appendChild(backBtn());
        card.appendChild(fb); card.appendChild(why); card.appendChild(ctr);
        stage.appendChild(card);
        function renderReveal(){ // re-highlight sugars in the ingredient list after a sugar question
          ing.innerHTML='<b>Ingredients</b><br>'+L.ingredients.map(it=>{
            const isSugar=LIB.SUGAR_ALIASES.some(a=>it.toLowerCase().includes(a));
            return isSugar?'<span class="sugword">'+it+'</span>':it; }).join(', ');
        }
      }
      render(false);
    }
    next();
  }

  // ============ 4) COMPLETE THE MEAL ============
  // A plate is missing one nutrient — pick the food that adds it.
  function gamePlate(){
    $('subtitle').textContent='This meal is missing something — pick the food that adds it!';
    // target nutrients that have plenty of clear food sources and kid-friendly framing
    const TARGETS = ['Protein','Calcium','Iron','Vitamin C','Fiber','Potassium','Vitamin A','Vitamin D','Vitamin K','Zinc','Omega-3','Folate','Magnesium','Vitamin B12']
      .filter(n=> LIB.NUTRIENTS[n] && LIB.FOODS.filter(f=>hasNut(f,n)).length>=5);
    function hasNut(f,n){ return f.nutrients.some(x=>x.nutrient===n); }

    function round(){
      const target = pick(TARGETS);
      const sources = LIB.FOODS.filter(f=>hasNut(f,target));
      const nonSources = LIB.FOODS.filter(f=>!hasNut(f,target));
      // prefer an "excellent" source as the answer when one exists
      const exc = sources.filter(f=> f.nutrients.some(x=>x.nutrient===target && x.tier==='excellent'));
      const correct = pick(exc.length ? exc : sources);
      const distract = sample(nonSources.filter(f=>f!==correct), 3);
      const choices = shuffle([correct, ...distract]);
      // the meal on the plate: 3 foods that do NOT already have the target nutrient
      const meal = sample(nonSources.filter(f=>!choices.includes(f)), 3);

      stage.innerHTML='';
      const card=el('div','card');
      const does = LIB.NUTRIENTS[target].does;
      card.appendChild(el('div','prompt','Which food adds <span class="nn">'+target+'</span> to this meal?'));
      card.appendChild(el('div','promptsub','This plate has no '+target+' — and you need it for '+does+'.'));

      // the plate: meal foods + one empty "?" slot
      const plate=el('div','plate meal');
      meal.forEach(f=> plate.appendChild(el('span','pf', foodBig(f))));
      const slot=el('span','slot','?');
      plate.appendChild(slot);
      card.appendChild(plate);
      card.appendChild(el('div','promptsub','On the plate: '+meal.map(f=>foodInline(f)+' '+f.food).join(', ')));

      // choices
      const grid=el('div','tiles');
      const fb=el('div','feedback',''); const why=el('div','why','');
      const ctr=el('div','center');
      choices.forEach(f=>{ const t=el('div','tile','<span class="em">'+foodBig(f)+'</span>'+f.food);
        t.onclick=()=>{ if(card.dataset.done) return; card.dataset.done='1';
          const ok = f===correct;
          [...grid.children].forEach(x=>{ x.setAttribute('disabled',''); });
          t.classList.add(ok?'correct':'wrong');
          if(!ok){ [...grid.children].forEach((x,i)=>{ if(choices[i]===correct) x.classList.add('correct'); }); }
          // fill the slot with the right answer
          slot.innerHTML=foodBig(correct); slot.classList.add('filled');
          bumpScore(ok);
          fb.textContent = ok?'🎉 Perfect — that adds '+target+'!':'Not quite — the green one adds '+target+'.'; fb.className='feedback '+(ok?'good':'bad');
          const kd = LIB.KID_DAILY[target];
          why.innerHTML = foodInline(correct)+' <b>'+correct.food+'</b> is a great source of '+target+' — '+does+'.'+(kd?' <span class="daily">('+kd.note+')</span>':'');
          ctr.innerHTML=''; ctr.appendChild(mkBtn('Next meal ▶',round)); ctr.appendChild(backBtn());
        };
        grid.appendChild(t); });
      card.appendChild(grid);
      ctr.appendChild(backBtn());
      card.appendChild(fb); card.appendChild(why); card.appendChild(ctr);
      stage.appendChild(card);
    }
    round();
  }

  // ============ 5) HEALTHIER SWAP (timed) ============
  function gameSwap(){
    $('subtitle').textContent='Tap the healthier choice — fast!';
    let queue=shuffle(LIB.SWAPS.slice());
    function next(){
      if(!queue.length) queue=shuffle(LIB.SWAPS.slice());
      const s=queue.shift(); let answered=false, timeLeft=100, timer;
      stage.innerHTML='';
      const card=el('div','card');
      card.appendChild(el('div','prompt','Which is the better choice?'));
      // timer bar
      const track=el('div','track'); track.style.cssText='height:12px;background:#eef2f7;border-radius:999px;overflow:hidden;margin:0 auto 16px;max-width:320px;';
      const fill=el('div'); fill.style.cssText='height:100%;background:var(--gold);width:100%;border-radius:999px;'; track.appendChild(fill);
      card.appendChild(track);
      const grid=el('div','tiles');
      const opts=shuffle([{...s.better,good:true},{...s.worse,good:false}]);
      const fb=el('div','feedback',''); const why=el('div','why','');
      const ctr=el('div','center');
      function finish(ok,timeout){
        if(answered) return; answered=true; clearInterval(timer);
        [...grid.children].forEach(t=>{ if(t._good) t.classList.add('correct'); else t.classList.add('wrong'); t.setAttribute('disabled',''); });
        fb.textContent = timeout?'⏰ Too slow!' : ok?'✅ Great choice!' : '❌ The other one’s better.'; fb.className='feedback '+(ok?'good':'bad');
        why.textContent=s.why; bumpScore(ok);
        ctr.innerHTML=''; ctr.appendChild(mkBtn('Next ▶',next)); ctr.appendChild(backBtn());
      }
      opts.forEach(o=>{ const t=el('div','tile','<span class="em">'+o.emoji+'</span>'+o.label); t._good=o.good;
        t.onclick=()=> finish(o.good,false); grid.appendChild(t); });
      card.appendChild(grid); card.appendChild(fb); card.appendChild(why);
      ctr.appendChild(backBtn()); card.appendChild(ctr);
      stage.appendChild(card);
      timer=setInterval(()=>{ timeLeft-=2; fill.style.width=Math.max(0,timeLeft)+'%'; if(timeLeft<=0) finish(false,true); }, 120); // ~6s
    }
    next();
  }

  function mkBtn(label,fn){ const b=el('button','btn btn-primary',label); b.onclick=fn; return b; }

  const GAMES={ match:gameMatch, fuel:gameFuel, label:gameLabel, plate:gamePlate, swap:gameSwap };

  document.querySelectorAll('.gamecard').forEach(c=> c.onclick=()=>openGame(c.dataset.game));
  $('navMenu').onclick=showMenu;
})();
