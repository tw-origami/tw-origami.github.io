// Typing Quest — a touch-typing tutor (inspired by Open-Typer, built fresh for the web).
(function(){
  const $ = id => document.getElementById(id);
  const el = (t,c,h)=>{ const e=document.createElement(t); if(c)e.className=c; if(h!=null)e.innerHTML=h; return e; };
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const shuffle = a => { const b=a.slice(); for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };

  // ---- keyboard layout + finger map (touch-typing colors) ----
  const ROWS = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l',';'],
    ['z','x','c','v','b','n','m',',','.','/'],
  ];
  const FINGER = {}; // key -> finger class
  const set=(keys,cls)=> keys.split(' ').forEach(k=>FINGER[k]=cls);
  set('q a z 1','f-pinky'); set('w s x 2','f-ring'); set('e d c 3','f-middle');
  set('r f v t g b 4 5','f-index'); set('y h n u j m 6 7','f-index');
  set('i k , 8','f-middle'); set('o l . 9','f-ring'); set('p ; / 0 - =','f-pinky');
  FINGER[' ']='f-thumb';

  // ---- lessons (auto-built drills from key sets, plus words & sentences) ----
  const LESSONS = [
    { name:'Home Row', keys:'a s d f j k l ;', desc:'Where your fingers rest.',
      pool:['asdf','jkl;','asas','dfdf','jkjk','l;l;','fjfj','dkdk','slsl','a;a;','fdsa',';lkj','dad','sad','fad','ask','all','fall','lass','flask','jak','ada'] },
    { name:'Add E & I', keys:'a s d f e i j k l ;', desc:'Reach up for e and i.',
      pool:['said','like','life','desk','idea','side','deal','file','sail','jail','lake','lie','ski','kid','lid','ties','less','fake','dial','safe'] },
    { name:'Top Row', keys:'q w e r t y u i o p', desc:'The number-row reaches.',
      pool:['we','you','try','type','were','your','power','write','quiet','tower','party','rope','wire','tire','pot','top','out','quit','pretty','report'] },
    { name:'Bottom Row', keys:'z x c v b n m', desc:'Curl down for the bottom keys.',
      pool:['can','man','van','box','fun','sun','run','cat','bat','mat','nap','jump','zoom','buzz','mix','fix','number','common','moment','back'] },
    { name:'All Letters', keys:'a – z', desc:'Common little words.',
      pool:['the','and','you','that','have','for','not','with','they','this','from','your','play','jump','quick','brown','fox','over','lazy','dog','when','then','make','time','good'] },
    { name:'Bigger Words', keys:'a – z', desc:'Longer words to stretch your reach.',
      pool:['because','friend','school','little','always','favorite','pizza','dragon','rainbow','computer','birthday','vacation','elephant','beautiful','adventure','remember','different','together'] },
    { name:'Sentences', keys:'A–Z . ,', desc:'Real sentences with capitals & periods.',
      sentences:['The quick brown fox jumps over the lazy dog.','I love to read books on a rainy day.','My favorite food is warm cheese pizza.','We played games at the park all afternoon.','Practice a little every day and you will improve.','A smart fox can solve almost any puzzle.','The sun is bright and the sky is deep blue.','Typing fast takes lots and lots of practice.','Green frogs hop across the cool wet grass.','Be kind and always try your very best.'] },
  ];

  function makeDrill(lesson){
    if(lesson.sentences) return pick(lesson.sentences);
    const n = 8;
    const words=[]; for(let i=0;i<n;i++) words.push(pick(lesson.pool));
    return words.join(' ');
  }

  // ---- state ----
  const menu=$('menu'), stage=$('stage');
  let keyHandler=null;

  function detach(){ if(keyHandler){ document.removeEventListener('keydown', keyHandler, true); keyHandler=null; } }

  function showMenu(){
    detach();
    stage.classList.add('hidden'); stage.innerHTML='';
    menu.classList.remove('hidden');
    $('navMenu').classList.add('on');
    $('subtitle').textContent='Learn to touch type — pick a lesson!';
  }

  function buildMenu(){
    LESSONS.forEach((L,i)=>{
      const c=el('button','lvlcard');
      c.innerHTML=`<div class="n">Lesson ${i+1}</div><h3>${L.name}</h3><p>${L.desc}</p><span class="keys">${L.keys}</span>`;
      c.onclick=()=>startLesson(i);
      menu.appendChild(c);
    });
  }

  function buildKeyboard(){
    const kb=el('div','kb');
    ROWS.forEach(row=>{
      const r=el('div','kbrow');
      row.forEach(k=>{
        const key=el('div','key '+(FINGER[k]||'f-index'));
        key.dataset.k=k; key.textContent = k;
        if(k==='f'||k==='j') key.appendChild(el('span','bump'));
        r.appendChild(key);
      });
      kb.appendChild(r);
    });
    const sr=el('div','kbrow');
    const space=el('div','key space f-thumb'); space.dataset.k=' '; space.textContent='space';
    sr.appendChild(space); kb.appendChild(sr);
    return kb;
  }

  function startLesson(i){
    const L=LESSONS[i];
    menu.classList.add('hidden'); stage.classList.remove('hidden');
    $('navMenu').classList.remove('on');
    $('subtitle').textContent=L.name+' — just start typing!';
    renderDrill(L, i);
  }

  function renderDrill(L, idx){
    detach();
    const target = makeDrill(L);
    let pos=0, errors=0, startTime=null, done=false;

    stage.innerHTML='';
    const card=el('div','card');

    // stats
    const stats=el('div','stats');
    const sWpm=el('div','stat','<b id="wpm">0</b><small>WPM</small>');
    const sAcc=el('div','stat','<b id="acc">100%</b><small>accuracy</small>');
    const sProg=el('div','stat','<b id="prog">0%</b><small>done</small>');
    stats.appendChild(sWpm); stats.appendChild(sAcc); stats.appendChild(sProg);
    card.appendChild(stats);

    // text with per-char spans
    const textEl=el('div','text');
    const chars=[...target].map((ch,k)=>{
      const s=el('span','ch'+(ch===' '?' sp':''));
      s.textContent = ch===' ' ? ' ' : ch;
      textEl.appendChild(s); return s;
    });
    card.appendChild(textEl);

    // keyboard
    const kb=buildKeyboard();
    card.appendChild(kb);
    const legend=el('div','fingerkey',
      '<span><i style="background:var(--f-pinky)"></i>pinky</span>'+
      '<span><i style="background:var(--f-ring)"></i>ring</span>'+
      '<span><i style="background:var(--f-middle)"></i>middle</span>'+
      '<span><i style="background:var(--f-index)"></i>index</span>'+
      '<span><i style="background:var(--f-thumb)"></i>thumbs</span>');
    card.appendChild(legend);

    const fb=el('div','feedback','Type the highlighted letter to begin ✨');
    card.appendChild(fb);
    const ctr=el('div','center');
    ctr.appendChild(mkBtn('↻ New drill',()=>renderDrill(L, idx),'btn-ghost'));
    ctr.appendChild(mkBtn('← Lessons', showMenu,'btn-ghost'));
    card.appendChild(ctr);
    stage.appendChild(card);

    function highlight(){
      chars.forEach((c,k)=> c.classList.toggle('cur', k===pos));
      // keyboard next-key
      kb.querySelectorAll('.key.next').forEach(x=>x.classList.remove('next'));
      const nx = target[pos] ? target[pos].toLowerCase() : null;
      if(nx){ const key=kb.querySelector('.key[data-k="'+(nx===' '?' ':cssKey(nx))+'"]'); if(key) key.classList.add('next'); }
      $('prog').textContent = Math.round(pos/target.length*100)+'%';
    }
    function cssKey(k){ return k.replace('"','\\"'); }
    function updateWpm(){
      if(!startTime) return;
      const mins=(Date.now()-startTime)/60000;
      const wpm = mins>0 ? Math.round((pos/5)/mins) : 0;
      $('wpm').textContent = wpm;
      const total=pos+errors;
      $('acc').textContent = (total? Math.round(pos/total*100):100)+'%';
    }

    keyHandler = function(e){
      if(done) return;
      if(e.metaKey||e.ctrlKey||e.altKey) return;
      if(e.key==='Tab') return;
      if(e.key.length!==1 && e.key!==' ') return; // ignore non-character keys
      e.preventDefault();
      if(!startTime) startTime=Date.now();
      const expected = target[pos];
      if(e.key===expected){
        chars[pos].classList.remove('cur','err');
        chars[pos].classList.add('done');
        pos++;
        if(pos>=target.length){ finish(); return; }
        highlight(); updateWpm();
      } else {
        errors++;
        chars[pos].classList.add('err');
        setTimeout(()=>{ if(!done) chars[pos] && chars[pos].classList.remove('err'); }, 250);
        updateWpm();
      }
    };
    document.addEventListener('keydown', keyHandler, true);

    function finish(){
      done=true; detach();
      const mins=(Date.now()-startTime)/60000;
      const wpm = mins>0 ? Math.round((target.length/5)/mins) : 0;
      const total=target.length+errors;
      const acc = Math.round(target.length/total*100);
      const stars = acc>=98?3 : acc>=90?2 : 1;
      textEl.classList.add('hidden'); kb.classList.add('hidden'); legend.classList.add('hidden'); stats.classList.add('hidden'); fb.classList.add('hidden');
      const res=el('div','results');
      res.innerHTML = `<div class="starrow">${'⭐'.repeat(stars)}${'▫️'.repeat(3-stars)}</div>
        <div class="big">${wpm} <span style="font-size:20px;color:var(--muted)">WPM</span></div>
        <div style="color:var(--muted);font-weight:700;margin-bottom:4px">Accuracy: ${acc}%  ·  Mistakes: ${errors}</div>
        <div class="feedback good">${wpm>=30?'🚀 Speedy!':wpm>=15?'👍 Nice pace!':'🌱 Keep practicing!'}</div>`;
      card.insertBefore(res, ctr);
      ctr.innerHTML='';
      ctr.appendChild(mkBtn('Next drill ▶',()=>renderDrill(L, idx)));
      ctr.appendChild(mkBtn('← Lessons', showMenu,'btn-ghost'));
    }

    highlight();
  }

  function mkBtn(label,fn,cls){ const b=el('button','btn '+(cls||'btn-primary'),label); b.onclick=fn; return b; }

  $('navMenu').onclick=showMenu;
  buildMenu();
})();
