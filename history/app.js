// History Heroes — 3 games reading from window.HIST (library.js).
(function(){
  const H = window.HIST;
  const $ = id => document.getElementById(id);
  const el = (t,c,h)=>{ const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; };
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const shuffle = a => { const b=a.slice(); for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
  const sample = (a,n) => shuffle(a).slice(0,n);
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const portrait = f => f.img ? '<img src="img/'+f.img+'" alt="'+esc(f.name)+'">' : '<div style="width:84px;height:84px;border-radius:12px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;font-size:34px">'+f.emoji+'</div>';

  const menu=$('menu'), stage=$('stage');
  let correct=0, streak=0;

  function bump(ok){ if(ok){ correct++; streak++; } else streak=0;
    $('correctCount').textContent=correct; $('streak').textContent=streak;
    if(ok && streak>0 && streak%5===0) celebrate();
  }
  function celebrate(){ const colors=['#b45309','#f59e0b','#7c3aed','#16a34a','#0ea5e9','#dc2626'], box=$('confetti');
    for(let i=0;i<80;i++){ const c=el('div','conf'); c.style.left=Math.random()*100+'vw'; c.style.background=colors[i%colors.length];
      c.style.animationDuration=(1.6+Math.random()*1.4)+'s'; c.style.animationDelay=(Math.random()*0.4)+'s'; box.appendChild(c); setTimeout(()=>c.remove(),3400); } }

  function showMenu(){ stage.classList.add('hidden'); stage.innerHTML=''; menu.classList.remove('hidden');
    $('scorebar').style.display='none'; $('navMenu').classList.add('on');
    $('subtitle').textContent='Meet people who changed the world — pick a game!'; $('credit').textContent=''; }
  function openGame(name){ menu.classList.add('hidden'); stage.classList.remove('hidden'); $('scorebar').style.display='flex';
    $('credit').textContent='Portraits from Wikipedia — mostly public-domain historical images.';
    GAMES[name](); }
  function backBtn(){ const b=el('button','btn btn-ghost','← Menu'); b.onclick=showMenu; return b; }
  function mkBtn(label,fn,cls){ const b=el('button','btn '+(cls||'btn-primary'),label); b.onclick=fn; return b; }

  // ============ 1) WHO DID IT? ============
  function gameMatch(){
    $('subtitle').textContent='Who did this? Tap the right person.';
    function round(){
      const answer = pick(H.FIGURES);
      const fact = pick(answer.facts);
      const others = sample(H.FIGURES.filter(f=>f.name!==answer.name), 3);
      const options = shuffle([answer, ...others]);
      stage.innerHTML='';
      const card=el('div','card');
      card.appendChild(el('div','promptsub','Which person did this?'));
      card.appendChild(el('div','factbox', esc(fact)));
      const grid=el('div','people');
      const fb=el('div','feedback',''); const ctr=el('div','center');
      options.forEach(f=>{
        const t=el('div','person', portrait(f)+'<div class="nm">'+esc(f.name)+'</div><div class="meta">'+f.flag+' '+esc(f.role)+'</div>');
        t.onclick=()=>{ if(card.dataset.done) return; card.dataset.done='1';
          const ok=f.name===answer.name;
          [...grid.children].forEach(x=>x.setAttribute('disabled',''));
          t.classList.add(ok?'correct':'wrong');
          if(!ok){ [...grid.children].forEach((x,i)=>{ if(options[i].name===answer.name) x.classList.add('correct'); }); }
          bump(ok);
          fb.textContent = ok?'🎉 Correct!':'That was '+answer.name+'.'; fb.className='feedback '+(ok?'good':'bad');
          // reveal a short bio of the answer
          const bioCard=el('div','revealbio');
          bioCard.innerHTML = portrait(answer).replace('width:84px;height:84px','width:70px;height:70px')+
            '<div class="rb-text"><div class="rb-nm">'+esc(answer.name)+'</div>'+
            '<div class="rb-meta">'+answer.flag+' '+esc(answer.country)+' · '+esc(answer.eraLabel)+' · '+esc(answer.role)+'</div>'+
            '<div class="rb-bio">'+esc(answer.bio)+'</div></div>';
          card.insertBefore(bioCard, fb);
          ctr.innerHTML=''; ctr.appendChild(mkBtn('Next ▶',round)); ctr.appendChild(backBtn());
        };
        grid.appendChild(t);
      });
      card.appendChild(grid);
      ctr.appendChild(backBtn());
      card.appendChild(fb); card.appendChild(ctr);
      stage.appendChild(card);
    }
    round();
  }

  // ============ 2) QUOTE FLIP ============
  function gameQuote(){
    $('subtitle').textContent='Read the quote — can you guess who? Flip to find out.';
    const quoted = H.FIGURES.filter(f=>f.quote);
    let queue = shuffle(quoted.slice());
    function next(){
      if(!queue.length) queue=shuffle(quoted.slice());
      const f=queue.shift();
      stage.innerHTML='';
      const card=el('div','card');
      const flip=el('div','flip');
      flip.innerHTML =
        '<div class="flip-inner">'+
          '<div class="face front"><div class="q">'+esc(f.quote)+'</div><div class="hint">Tap to flip 🔄</div></div>'+
          '<div class="face back">'+portrait(f).replace('width:84px;height:84px','width:96px;height:96px')+
            '<div class="nm">'+esc(f.name)+'</div>'+
            '<div class="meta">'+f.flag+' '+esc(f.country)+' · '+esc(f.eraLabel)+' · '+esc(f.role)+'</div>'+
            '<div class="bio">'+esc(f.bio)+'</div>'+
          '</div>'+
        '</div>';
      flip.onclick=()=> flip.classList.toggle('flipped');
      card.appendChild(flip);
      const ctr=el('div','center');
      ctr.appendChild(mkBtn('Flip 🔄',()=>flip.classList.toggle('flipped'),'btn-ghost'));
      ctr.appendChild(mkBtn('Next quote ▶',next));
      ctr.appendChild(backBtn());
      card.appendChild(ctr);
      stage.appendChild(card);
    }
    next();
  }

  // ============ 3) READING DETECTIVE ============
  function gameRead(){
    $('subtitle').textContent='Read the story, then answer like a test detective.';
    let queue = shuffle(H.PASSAGES.slice());
    function next(){
      if(!queue.length) queue=shuffle(H.PASSAGES.slice());
      const P=queue.shift(); let qi=0;
      const fig = H.FIGURES.find(f=>f.slug===P.slug);
      function render(){
        stage.innerHTML='';
        const card=el('div','card');
        const pass=el('div','passage','<h4>'+(fig?fig.emoji+' ':'')+esc(P.title)+'</h4>'+esc(P.text));
        card.appendChild(pass);
        card.appendChild(el('div','qdots','Question '+(qi+1)+' of '+P.questions.length));
        const Q=P.questions[qi];
        card.appendChild(el('div','qtext', esc(Q.q)));
        const box=el('div','choices');
        const fb=el('div','feedback',''); const why=el('div','why',''); const ctr=el('div','center');
        Q.choices.forEach((c,i)=>{ const b=el('button','choice', esc(c));
          b.onclick=()=>{ if(card.dataset.done) return; card.dataset.done='1';
            [...box.children].forEach((x,j)=>{ x.setAttribute('disabled',''); if(j===Q.answer) x.classList.add('correct'); else if(j===i) x.classList.add('wrong'); });
            const ok=i===Q.answer; bump(ok);
            fb.textContent=ok?'✅ Correct!':'❌ Not quite.'; fb.className='feedback '+(ok?'good':'bad');
            why.textContent=Q.explain;
            const more=qi<P.questions.length-1;
            ctr.appendChild(mkBtn(more?'Next question ▶':'New story ▶', ()=>{ if(more){ qi++; render(); } else next(); }));
            ctr.appendChild(backBtn());
          };
          box.appendChild(b);
        });
        card.appendChild(box); card.appendChild(fb); card.appendChild(why);
        ctr.appendChild(backBtn()); card.appendChild(ctr);
        stage.appendChild(card);
        window.scrollTo(0,0);
      }
      render();
    }
    next();
  }

  const GAMES={ match:gameMatch, quote:gameQuote, read:gameRead };
  document.querySelectorAll('.gamecard').forEach(c=> c.onclick=()=>openGame(c.dataset.game));
  $('navMenu').onclick=showMenu;
})();
