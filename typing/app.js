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

  // key -> which hand + finger (for the live hand-position guide)
  const KEYINFO={};
  const setinfo=(keys,hand,finger)=> keys.split(' ').forEach(k=>KEYINFO[k]={hand,finger});
  setinfo('q a z 1','L','pinky'); setinfo('w s x 2','L','ring'); setinfo('e d c 3','L','middle'); setinfo('r f v t g b 4 5','L','index');
  setinfo('y h n u j m 6 7','R','index'); setinfo('i k , 8','R','middle'); setinfo('o l . 9','R','ring'); setinfo('p ; / 0 - =','R','pinky');
  KEYINFO[' ']={hand:null,finger:'thumb'};

  // ---- lessons (auto-built drills from key sets, plus words & sentences) ----
  // Each pool is limited to letters taught so far (this lesson's + every
  // earlier lesson's), so a drill never asks for a key that hasn't been
  // introduced yet. Lessons 5-7 open up to the full alphabet.
  const LESSONS = [
    { name:'Home Row', keys:'a s d f j k l ;', desc:'Where your fingers rest.',
      pool:['dad','sad','fad','add','ads','ask','asks','all','fall','falls','lad','lads','lass','sass','alas',
        'salad','salads','salsa','alfalfa','flask','flasks','flak',
        'asdf','jkl;','asas','dfdf','jkjk','l;l;','fjfj','dkdk','slsl','a;a;','fdsa',';lkj',
        'as','sa','df','fd','jk','kj','l;','ad','da','al','la','fl','lf','ls','sl'] },
    { name:'Add E & I', keys:'a s d f e i j k l ;', desc:'Reach up for e and i.',
      pool:['said','like','life','desk','idea','side','deal','deals','file','sail','sailed','jail','jails',
        'lake','lie','ski','kid','kids','lid','less','fake','dial','dials','safe','idle','aide','aisle',
        'ideal','leaf','leak','leaks','sales','seals','sled','kale','dead','deed','fees','keel','keels',
        'field','fields','leads','easel','asked','false','alike','flake','flakes','elk','elks','silk',
        'disk','disks','aids','asides','sale',
        'ei','ie','fe','ef','ke','ek','de','ed','ai','ia'] },
    { name:'Top Row', keys:'q w e r t y u i o p', desc:'The number-row reaches.',
      pool:['we','you','try','type','were','your','power','write','quiet','tower','party','rope','wire',
        'tire','pot','top','out','quit','pretty','report','today','water','paper','later','quote','story',
        'sorry','worry','worries','pirate','pirates','wait','waits','trade','trades','tired','wired',
        'diary','study','stay','play','prayer','trout','pout','adopt','adapt','wolf','quilt','quilts',
        'yodel','opera','delay','relay','reply','pause','pastry','poetry','poet','sailor','sailors',
        'tailor','tailors','detour','detail','details','quality','quart','quarts'] },
    { name:'Bottom Row', keys:'z x c v b n m', desc:'Curl down for the bottom keys.',
      pool:['can','man','van','box','fun','sun','run','cat','bat','mat','nap','jump','jumps','zoom','buzz',
        'mix','fix','fixed','number','common','moment','back','cab','cap','car','cars','cast','case','cave',
        'city','cozy','crazy','cup','cute','dance','dirt','exact','exam','fact','facts','fair','fast',
        'fault','feast','film','films','final','flame','flames','float','fluid','forest','found','fox',
        'foxes','frame','frames','fruit','fruits','funny','jazzy','letter','juice','lemon','lemons','limit',
        'mall','market','matter','mile','miles','mind','minute','mirror','mistake','motor','motors','movie',
        'movies','music','object','ocean','orbit','planet','planets','prize','quiz','rabbit','rainy','raisin',
        'sample','secret','silent','simple','sixty','solar','sunny','super','tiny','umbrella','uncle','unit',
        'unite','until','valley','value','velvet','visit','vote','wallet','window','winter','wizard','world',
        'zebra','zero','zesty'] },
    { name:'All Letters', keys:'a – z', desc:'Common little words.',
      pool:['the','and','you','that','have','for','not','with','they','this','from','your','play','jump',
        'quick','brown','fox','over','lazy','dog','when','then','make','time','good','what','will','would',
        'could','should','about','after','again','right','think','where','there','house','horse','happy',
        'hello','garden','green','great','grow','give','girl','gold','goat','night','light','high','huge',
        'eight','thing','water','world','work','word','want','well','went','into','only','know','knew',
        'next','most','more','some','home','hope','help','hold','half','hand','head','heart','heavy',
        'honest','hungry','ghost','laugh','cough','though','thought','bright','flight','fright','sight',
        'tight','might'] },
    { name:'Bigger Words', keys:'a – z', desc:'Longer words to stretch your reach.',
      pool:['because','friend','school','little','always','favorite','pizza','dragon','rainbow','computer',
        'birthday','vacation','elephant','beautiful','adventure','remember','different','together','mountain',
        'dinosaur','chocolate','butterfly','wonderful','fantastic','incredible','treasure','mystery','dolphin',
        'penguin','volcano','dictionary','calendar','umbrella','telephone','kangaroo','universe','satellite',
        'astronaut','gorilla','alligator','crocodile','hurricane','thunderstorm','vegetable','breakfast',
        'spaghetti','hamburger','sandwich','chimpanzee','helicopter','motorcycle','basketball','television',
        'refrigerator','caterpillar','grasshopper','watermelon','strawberry','pineapple'] },
    { name:'Sentences', keys:'A–Z . ,', desc:'Real sentences with capitals & periods.',
      sentences:['The quick brown fox jumps over the lazy dog.','I love to read books on a rainy day.',
        'My favorite food is warm cheese pizza.','We played games at the park all afternoon.',
        'Practice a little every day and you will improve.','A smart fox can solve almost any puzzle.',
        'The sun is bright and the sky is deep blue.','Typing fast takes lots and lots of practice.',
        'Green frogs hop across the cool wet grass.','Be kind and always try your very best.',
        'Our class went on a fun field trip to the science museum.',
        'The little puppy chased its tail around the yard.',
        'She packed her backpack with books and a shiny red apple.',
        'The old wooden bridge creaked as we walked across it.',
        'Bright stars filled the night sky above the quiet lake.',
        'He practiced his piano lesson for thirty minutes every evening.',
        'The soccer team celebrated their victory with a big pizza party.',
        'Fresh snow covered the mountains like a soft white blanket.',
        'My grandmother bakes the best chocolate chip cookies in town.',
        'The astronaut floated gently inside the space station.',
        'A gentle breeze carried the scent of blooming flowers.',
        'The librarian helped us find books about ancient Egypt.',
        'Two curious kittens played with a ball of yarn.',
        'The farmer woke up early to feed all the animals.',
        'We built a tall sandcastle before the tide came in.',
        'The scientist mixed two chemicals and watched them fizz.',
        'Every summer, our family visits a small cabin by the lake.',
        'The clever fox slipped quietly past the sleeping dogs.',
        'Bright rainbow colors appeared after the afternoon rain.',
        'The chef added fresh herbs to the simmering soup.',
        'Our teacher explained how volcanoes form deep underground.',
        'The knight rode his horse across the wide green field.',
        'Colorful kites danced high above the sandy beach.',
        'The robot beeped twice before rolling across the floor.',
        'A friendly dolphin leaped out of the sparkling water.',
        'The bakery smelled like warm bread every single morning.',
        'Our neighbors planted a garden full of ripe tomatoes.',
        'The train rumbled slowly through the quiet mountain town.'] },
    { name:'The Constitution & You', keys:'A–Z . ,', desc:'Type your way through all 27 amendments.',
      sentences:['The First Amendment protects freedom of speech, religion, the press, and peaceful assembly.',
        'The Second Amendment protects the right of citizens to keep and bear arms.',
        'The Third Amendment says soldiers cannot be housed in your home without your consent.',
        'The Fourth Amendment protects you from unreasonable searches and seizures by police.',
        'The Fifth Amendment protects your right to remain silent and to due process of law.',
        'The Sixth Amendment guarantees a speedy and public trial by an impartial jury.',
        'The Seventh Amendment guarantees a jury trial in many civil lawsuits as well.',
        'The Eighth Amendment forbids excessive bail, excessive fines, and cruel punishment.',
        'The Ninth Amendment says people keep rights even if the Constitution does not list them.',
        'The Tenth Amendment reserves powers not given to the federal government for the states.',
        'The Eleventh Amendment limits when a state can be sued in federal court.',
        'The Twelfth Amendment changed how electors vote for President and Vice President.',
        'The Thirteenth Amendment abolished slavery throughout the United States.',
        'The Fourteenth Amendment guarantees citizenship and equal protection under the law.',
        'The Fifteenth Amendment says the right to vote cannot be denied because of race.',
        'The Sixteenth Amendment gave Congress the power to collect a national income tax.',
        'The Seventeenth Amendment lets citizens elect their United States Senators directly.',
        'The Eighteenth Amendment banned the making and selling of alcohol nationwide.',
        'The Nineteenth Amendment gave women across the country the right to vote.',
        'The Twentieth Amendment moved the start of presidential terms to January.',
        'The Twenty First Amendment repealed the nationwide ban on alcohol.',
        'The Twenty Second Amendment limits a President to being elected twice.',
        'The Twenty Third Amendment gave Washington, D.C. votes in presidential elections.',
        'The Twenty Fourth Amendment banned charging a tax before someone can vote.',
        'The Twenty Fifth Amendment explains what happens if a President cannot serve.',
        'The Twenty Sixth Amendment lowered the voting age to eighteen years old.',
        'The Twenty Seventh Amendment delays any pay raise Congress gives itself.'] },
    { name:'Stories from History Heroes', keys:'A–Z . ,', desc:'Type a fact about a famous figure from history.',
      sentences:['Marie Curie became the first person to win Nobel Prizes in two different sciences.',
        'Wilbur and Orville Wright flew the first powered airplane at Kitty Hawk in 1903.',
        'Harriet Tubman helped hundreds of enslaved people escape to freedom on the Underground Railroad.',
        'Albert Einstein developed the theory of relativity and changed how we understand the universe.',
        'Rosa Parks refused to give up her bus seat and helped spark the civil rights movement.',
        'Neil Armstrong became the first person to walk on the surface of the Moon.',
        'Benjamin Franklin experimented with electricity and helped write the Declaration of Independence.',
        'Amelia Earhart became the first woman to fly solo across the Atlantic Ocean.',
        'Martin Luther King Junior dreamed of a nation where people are judged by their character.',
        'Thomas Edison patented over one thousand inventions, including the practical light bulb.',
        'Cleopatra ruled ancient Egypt and was known for her intelligence and political skill.',
        'Leonardo da Vinci painted masterpieces and filled notebooks with brilliant inventions.',
        'Jackie Robinson broke barriers as the first Black player in modern Major League Baseball.',
        'Nelson Mandela spent decades in prison before becoming President of South Africa.',
        'Alexander the Great built one of the largest empires in the ancient world.',
        'Susan B. Anthony fought tirelessly for the right of women to vote in America.',
        'Isaac Newton described gravity after watching an apple fall from a tree.',
        'The crew of Ferdinand Magellan completed the first voyage around the entire world.',
        'Malala Yousafzai spoke out for the education of girls and became a Nobel laureate.',
        'George Washington led the Continental Army and became the first President.',
        'Abraham Lincoln guided the nation through the Civil War and helped end slavery.',
        'Helen Keller learned to communicate despite being both deaf and blind.',
        'Jane Goodall spent decades studying chimpanzees in the forests of Tanzania.',
        'Christopher Columbus sailed across the Atlantic Ocean and reached the Americas in 1492.'] },
  ];

  // Shuffle-and-slice each time (no repeated words within one drill), vary
  // the drill length a bit, and never hand back the exact same drill twice
  // in a row so "New drill" always feels fresh.
  let lastDrill = null;
  function makeDrill(lesson){
    let result, guard = 0;
    do {
      if(lesson.sentences){
        result = pick(lesson.sentences);
      } else {
        const n = Math.min(lesson.pool.length, 9 + Math.floor(Math.random()*6));   // 9-14 words
        result = shuffle(lesson.pool).slice(0, n).join(' ');
      }
      guard++;
    } while(result === lastDrill && guard < 5);
    lastDrill = result;
    return result;
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
    ROWS.forEach((row,ri)=>{
      const r=el('div','kbrow r'+(ri+1));
      row.forEach(k=>{
        const key=el('div','key '+(FINGER[k]||'f-index'));
        key.dataset.k=k; key.textContent = k;
        if(k==='f'||k==='j') key.appendChild(el('span','bump'));
        r.appendChild(key);
      });
      kb.appendChild(r);
    });
    const sr=el('div','kbrow space-row');
    const space=el('div','key space f-thumb'); space.dataset.k=' '; space.textContent='space';
    sr.appendChild(space); kb.appendChild(sr);
    return kb;
  }

  // Hand-position guide: where each finger rests on the home row.
  function buildHandGuide(){
    const wrap=el('div','handguide');
    const L=[['A',110,95,'--f-pinky','L','pinky'],['S',142,72,'--f-ring','L','ring'],['D',174,58,'--f-middle','L','middle'],['F',206,78,'--f-index','L','index']];
    const R=[['J',434,78,'--f-index','R','index'],['K',466,58,'--f-middle','R','middle'],['L',498,72,'--f-ring','R','ring'],[';',530,95,'--f-pinky','R','pinky']];
    const finger=(key,x,top,color,hand,fname)=>`
      <g class="hgf" data-hand="${hand}" data-finger="${fname}">
        <rect x="${x-13}" y="${top}" width="26" height="${178-top}" rx="13" fill="var(${color})"/>
        <circle cx="${x}" cy="${top}" r="15" fill="var(${color})" stroke="#fff" stroke-width="2"/>
        <text class="hgtip" x="${x}" y="${top+5}" text-anchor="middle" font-size="15" font-weight="800" fill="#fff"></text>
      </g>`;
    const svg=`<svg viewBox="0 0 640 252" xmlns="http://www.w3.org/2000/svg">
      <rect x="96" y="158" width="134" height="62" rx="28" fill="#e2e8f0"/>
      <rect x="410" y="158" width="134" height="62" rx="28" fill="#e2e8f0"/>
      <g class="hgf" data-finger="thumb">
        <line x1="228" y1="192" x2="292" y2="214" stroke="var(--f-thumb)" stroke-width="22" stroke-linecap="round"/>
        <line x1="412" y1="192" x2="348" y2="214" stroke="var(--f-thumb)" stroke-width="22" stroke-linecap="round"/>
        <rect x="268" y="205" width="104" height="30" rx="12" fill="var(--f-thumb)"/>
        <text x="320" y="225" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">SPACE</text>
      </g>
      ${L.map(f=>finger(...f)).join('')}
      ${R.map(f=>finger(...f)).join('')}
      <text x="163" y="248" text-anchor="middle" font-size="12" font-weight="800" fill="#94a3b8">LEFT HAND</text>
      <text x="477" y="248" text-anchor="middle" font-size="12" font-weight="800" fill="#94a3b8">RIGHT HAND</text>
    </svg>`;
    wrap.innerHTML='<div class="hgcap">✋ Rest your fingers on the <b>home row</b>: left hand on <b>A&nbsp;S&nbsp;D&nbsp;F</b>, right hand on <b>J&nbsp;K&nbsp;L&nbsp;;</b> — both thumbs on the space bar.</div>'+svg;
    return wrap;
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
    const handGuide=buildHandGuide();
    card.appendChild(handGuide);

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
      // hand guide: light up the finger to use (showing the next letter), fade the rest
      handGuide.querySelectorAll('.hgf.active').forEach(g=>g.classList.remove('active'));
      handGuide.querySelectorAll('.hgtip').forEach(t=>t.textContent='');
      const info = nx ? KEYINFO[nx] : null;
      if(info){
        handGuide.classList.add('armed');
        const sel = info.finger==='thumb' ? '.hgf[data-finger="thumb"]'
                  : '.hgf[data-hand="'+info.hand+'"][data-finger="'+info.finger+'"]';
        const g = handGuide.querySelector(sel);
        if(g){ g.classList.add('active');
          const tip=g.querySelector('.hgtip'); if(tip) tip.textContent = target[pos].toUpperCase(); }
      } else { handGuide.classList.remove('armed'); }
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
        <div class="feedback good">${wpm>=30?'🚀 Speedy!':wpm>=15?'👍 Nice pace!':'🌱 Keep practicing!'}</div>
        <div style="color:var(--muted);font-size:13px;font-weight:700;margin-top:6px">press <b>Enter ⏎</b> for the next drill</div>`;
      card.insertBefore(res, ctr);
      ctr.innerHTML='';
      const nextB = mkBtn('Next drill ▶',()=>renderDrill(L, idx));
      ctr.appendChild(nextB);
      ctr.appendChild(mkBtn('← Lessons', showMenu,'btn-ghost'));
      nextB.focus();
      // Enter starts the next drill — hands never have to leave the keyboard.
      // Reuses keyHandler so detach() cleans it up when the next drill starts.
      keyHandler = function(e){ if(e.key==='Enter'){ e.preventDefault(); renderDrill(L, idx); } };
      document.addEventListener('keydown', keyHandler, true);
    }

    highlight();
  }

  function mkBtn(label,fn,cls){ const b=el('button','btn '+(cls||'btn-primary'),label); b.onclick=fn; return b; }

  $('navMenu').onclick=showMenu;
  buildMenu();
})();
