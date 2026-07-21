(function(){
  const $ = id => document.getElementById(id);
  const el = (t,c,h)=>{ const e=document.createElement(t); if(c) e.className=c; if(h!=null) e.innerHTML=h; return e; };
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const shuffle = a => { const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; };
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const DICT = Array.isArray(window.SPELLING_WORDS) ? window.SPELLING_WORDS : [];
  const COMMON_WORD_BANK = {
    reinstate: ['an','ant','art','ate','ear','eat','era','near','neat','pain','paint','parent','pair','pane','pear','rain','rate','tap','tape','taper','train','retain','repaint','painter'],
    retinal: ['an','ant','art','ate','ear','eat','era','alert','alter','alien','lane','lean','late','near','neat','rail','real','rain','retain','retail','train','trail','retina','retinal','entail'],
    traction: ['an','ant','art','arc','are','can','car','cat','cart','coat','oar','oat','rain','rant','rate','ratio','actor','carat','train','trait','traction','carton'],
    reanimate: ['an','ant','art','aim','air','ate','ear','eat','man','mat','mean','meat','mate','name','arena','irate','rain','rate','train','retain','remain','animate','reanimate','mart'],
    tangier: ['an','ant','art','ate','ear','eat','gate','gait','giant','grain','grant','great','rain','rate','tear','train','trait','attain','integrate','ingrate','tangier','tangerine','granite'],
    painter: ['an','ant','art','apt','are','air','at','ate','ear','eat','era','nap','pan','pat','pain','paint','painter','parent','pair','pear','pea','prate','pane','rain','rate','tan','tap','tea','train','retain','repaint','tape','taper','neat','tenant','area','earn','reap','peat','trait'],
    salient: ['an','ant','art','ate','ear','eat','alien','lane','lean','late','saint','saline','satin','stale','stain','slate','steal','tail','tale','aslant','estate','initial','install','nasal','salient'],
    protein: ['ten','net','one','ore','pen','pet','per','pie','tie','toe','note','tone','open','pine','peer','poet','poem','pore','prone','enter','entire','reopen','repine','repot','reprint','trine','protein','pointer']
  };
  const PUZZLE_SEEDS = [
    { letters:['a','e','i','n','r','s','t'], center:'a', pangram:'reinstate', words:['asterin','eranist','restain','stainer','starnie','stearin','arsenite','artesian','artiness','asterina','asternia','erastian','resinate','restrain','seatrain','strainer','straiten','teresian','teresina','transire','arseniate','atrienses','atriensis','instanter','reinstate','resistant','restraint','retransit','saernaite','sterninae','tarriness','tearstain','trainster','transient','transiter','intarsiate','interstate','intrastate','nestiatria','reastiness','renaissant','restrainer','starriness','steinerian','straitness','tristearin','attriteness','initiatress','intransient','stainierite','tesserarian','sententiarian','sententiarist','transientness','assassinatress','insanitariness','transessentiate'] },
    { letters:['a','e','i','l','n','r','t'], center:'a', pangram:'retinal', words:['entrail','latiner','latrine','ratline','reliant','retinal','trenail','elaterin','entailer','inertial','internal','linarite','ratliner','retainal','telarian','tetralin','treenail','triental','antlerite','initialer','interalar','leitneria','lienteria','tertrinal','triennial','trilinear','alternaria','antenarial','interrenal','intrarenal','literarian','realienate','retinalite','trilineate','antirattler','interatrial','interlineal','interlinear','internarial','interrelate','nitraniline','interlineate','intraretinal','interantennal','territelarian'] },
    { letters:['a','c','i','n','o','r','t'], center:'a', pangram:'traction', words:['anticor','carotin','cortina','ontaric','anticorn','craniota','croatian','narcotia','narcotic','raincoat','traction','aaronitic','anacrotic','anarcotin','arctation','cantorian','carnation','coaration','narcotina','otocranic','tartronic','attraction','carination','citraconic','coronation','incantator','narcotinic','octonarian','tortricina','circination','citrination','coarctation','concionator','contraction','contrariant','cortication','incarnation','intrication','nonnarcotic','nontraction','ratiocinant','acronarcotic','antinarcotic','incoronation','ratiocinator','tractoration','contractation','incontraction','introtraction','ratiocination','contrarotation','noncontraction'] },
    { letters:['a','e','i','m','n','r','t'], center:'a', pangram:'reanimate', words:['minaret','raiment','tireman','animater','antimere','intermat','marinate','martinet','tetramin','triamine','antimeter','attermine','imeritian','interteam','intimater','mamertine','martineta','nemertina','nitramine','reanimate','terminant','terminate','tetramine','traintime','amarantite','antimerina','attirement','intemerate','irritament','maintainer','metranemia','minnetaree','nemertinea','reintimate','remaintain','tetrammine','tintamarre','antaimerina','entrainment','interamnian','intermarine','interminant','interminate','nemertinean','interanimate','reattainment','atterminement','entertainment','metanemertini'] },
    { letters:['a','e','g','i','n','r','t'], center:'a', pangram:'tangier', words:['angrite','granite','ingrate','tangier','tearing','tigrean','antiager','enargite','trainage','treating','argentina','argentine','argentite','gartering','granitite','gratinate','integrant','integrate','negritian','regrating','retaining','tanagrine','tangerine','entreating','garnierite','generating','grangerite','ingenerate','ingratiate','interagent','interagree','interregna','retreating','tritangent','argentinean','argentinian','gaertnerian','reintegrate','entertaining','intertragian','irregenerate','reingratiate','intergenerant','argentinitrate','intergenerating'] },
    { letters:['a','e','i','n','p','r','t'], center:'a', pangram:'painter', words:['painter','pertain','pterian','repaint','aperient','patarine','pretrain','tapirine','tarpeian','terrapin','triptane','appertain','pernettia','inapparent','pernitrate','tripennate','tripinnate','appertinent','interprater','irrepentant','paripinnate','preinitiate','tripartient','antepreterit','pentanitrate','tappertitian','inappertinent','intertrappean','interpenetrant','interpenetrate','pennatipartite','pinnatipartite','ternatipinnate'] },
    { letters:['a','e','i','l','n','s','t'], center:'a', pangram:'salient', words:['elastin','salient','saltine','slainte','alienist','antilens','ensilate','essential','latinless','nasillate','saintless','salientia','saltiness','seleniate','silential','slatiness','stainless','stalinite','taintless','antiselene','intestinal','salientian','sentential','inessential','saintliness','satellitian','stateliness','essentialist','taillessness','essentialness','stainlessness','taintlessness'] },
    { letters:['e','i','n','o','p','r','t'], center:'e', pangram:'protein', words:['pointer','protein','pterion','repoint','tropine','ereption','tropeine','entropion','interpone','peritenon','pinnotere','pontonier','portioner','preintone','prenotion','preoption','protopine','pteropine','reportion','tritopine','interpoint','nonprotein','petitioner','piperitone','porpentine','portention','prepontine','prereption','proreption','repetition','perienteron','prepetition','preterition','nonpertinent','preintention','proportioner','reproportion','nonproprietor','nonrepetition'] },
  ];

  function buildPuzzle(seed){
    const letterSet = new Set(seed.letters);
    const sourceWords = COMMON_WORD_BANK[seed.pangram] || [];
    const words = sourceWords.filter(w => {
      if(w.length < 2) return false;
      if(!w.includes(seed.center)) return false;
      for(const ch of w){
        if(!letterSet.has(ch)) return false;
      }
      return true;
    });
    words.sort((a,b) => a.length - b.length || a.localeCompare(b));
    const wordSet = new Set(words);
    let pangram = words.find(w => new Set(w).size === 7) || seed.pangram;
    if(!wordSet.has(pangram)) {
      words.unshift(pangram);
      wordSet.add(pangram);
    }
    return Object.assign({}, seed, { words, wordSet, pangram });
  }

  const PUZZLES = PUZZLE_SEEDS.map(buildPuzzle);

  const COLORS = ['#f97316','#f59e0b','#eab308','#16a34a','#38bdf8','#fb7185'];
  const RANKS = [
    [0, 'Seedling', 'start making words'],
    [12, 'Busy Bee', 'keep going'],
    [30, 'Hive Helper', 'nice groove'],
    [55, 'Pollen Pro', 'strong run'],
    [80, 'Queen Bee', 'almost there'],
    [100, 'Word Monarch', 'full hive mastery'],
  ];

  const meta = $('meta');
  const hive = $('hive');
  const entry = $('entry');
  const feedback = $('feedback');
  const clueText = $('clueText');
  const foundWords = $('foundWords');
  const foundMeta = $('foundMeta');
  const maxScore = $('maxScore');
  const progressBar = $('progressBar');
  const scoreEl = $('score');
  const foundCountEl = $('foundCount');
  const pangramCountEl = $('pangramCount');
  const rankName = $('rankName');
  const rankNote = $('rankNote');
  const titleEl = $('puzzleTitle');
  const puzzleMeta = $('puzzleMeta');
  const definitionWord = $('definitionWord');
  const definitionPos = $('definitionPos');
  const definitionText = $('definitionText');
  const definitionExample = $('definitionExample');
  const definitionMeta = $('definitionMeta');

  const LOCAL_DEFINITIONS = {
    an: { word:'an', pos:'article', text:'Used before a vowel sound.', example:'She ate an apple.', meta:'Built-in local glossary' },
    air: { word:'air', pos:'noun', text:'The invisible mixture of gases we breathe.', example:'The air felt cool this morning.', meta:'Built-in local glossary' },
    ape: { word:'ape', pos:'noun', text:'A tailless primate, such as a chimpanzee or gorilla.', example:'The ape climbed the branch.', meta:'Built-in local glossary' },
    are: { word:'are', pos:'verb', text:'Present tense of be, used with you, we, and they.', example:'They are ready to go.', meta:'Built-in local glossary' },
    ant: { word:'ant', pos:'noun', text:'A small insect that lives in a colony.', example:'An ant crossed the sidewalk.', meta:'Built-in local glossary' },
    apt: { word:'apt', pos:'adjective', text:'Likely or especially suitable.', example:'That was an apt comment.', meta:'Built-in local glossary' },
    art: { word:'art', pos:'noun', text:'Creative work such as drawing, painting, or sculpture.', example:'The museum shows modern art.', meta:'Built-in local glossary' },
    ate: { word:'ate', pos:'verb', text:'Past tense of eat.', example:'We ate lunch early.', meta:'Built-in local glossary' },
    at: { word:'at', pos:'preposition', text:'Used to show a place or time.', example:'Meet me at noon.', meta:'Built-in local glossary' },
    ear: { word:'ear', pos:'noun', text:'The body part used for hearing.', example:'She tucked her hair behind one ear.', meta:'Built-in local glossary' },
    eat: { word:'eat', pos:'verb', text:'To put food into your mouth and swallow it.', example:'They eat breakfast together.', meta:'Built-in local glossary' },
    era: { word:'era', pos:'noun', text:'A period of time marked by a shared style or event.', example:'The internet changed the modern era.', meta:'Built-in local glossary' },
    nap: { word:'nap', pos:'noun / verb', text:'A short sleep, or to sleep for a short time.', example:'She took a quick nap before dinner.', meta:'Built-in local glossary' },
    pan: { word:'pan', pos:'noun', text:'A shallow metal or oven-safe container used for cooking or baking.', example:'Heat the oil in a pan over medium heat.', meta:'Built-in local glossary' },
    pat: { word:'pat', pos:'verb', text:'To touch lightly with the hand.', example:'She gave the dog a pat on the head.', meta:'Built-in local glossary' },
    pain: { word:'pain', pos:'noun', text:'Physical hurt or discomfort.', example:'The ankle pain faded after a rest.', meta:'Built-in local glossary' },
    paint: { word:'paint', pos:'noun / verb', text:'Colored liquid applied to a surface, or to cover something with it.', example:'They paint the house every spring.', meta:'Built-in local glossary' },
    painter: { word:'painter', pos:'noun', text:'A person whose job or hobby is painting surfaces or making art with paint.', example:'The painter finished the mural in two days.', meta:'Built-in local glossary' },
    parent: { word:'parent', pos:'noun', text:'A mother or father.', example:'Her parent picked her up from school.', meta:'Built-in local glossary' },
    pair: { word:'pair', pos:'noun', text:'Two things that belong or go together.', example:'I bought a pair of shoes.', meta:'Built-in local glossary' },
    pear: { word:'pear', pos:'noun', text:'A sweet fruit with a rounded bottom and narrow top.', example:'He sliced a ripe pear for lunch.', meta:'Built-in local glossary' },
    pea: { word:'pea', pos:'noun', text:'A small round green vegetable or seed.', example:'She added peas to the soup.', meta:'Built-in local glossary' },
    prate: { word:'prate', pos:'verb', text:'To talk foolishly or at length.', example:'The old essay prates about the same point.', meta:'Built-in local glossary' },
    pane: { word:'pane', pos:'noun', text:'A single sheet of glass in a window or door.', example:'One pane in the window was cracked.', meta:'Built-in local glossary' },
    rain: { word:'rain', pos:'noun / verb', text:'Water falling from clouds, or to fall that way.', example:'Rain kept us inside all afternoon.', meta:'Built-in local glossary' },
    rate: { word:'rate', pos:'noun / verb', text:'A speed, amount, or price, or to judge something.', example:'The rate of change went up.', meta:'Built-in local glossary' },
    train: { word:'train', pos:'noun / verb', text:'A vehicle that runs on tracks, or to teach a skill.', example:'We took the train downtown.', meta:'Built-in local glossary' },
    retain: { word:'retain', pos:'verb', text:'To keep something or continue to hold it.', example:'Try to retain the main idea of the passage.', meta:'Built-in local glossary' },
    repaint: { word:'repaint', pos:'verb', text:'To paint something again.', example:'They repaint the door every summer.', meta:'Built-in local glossary' },
    tan: { word:'tan', pos:'noun / verb / adjective', text:'A light brown color, or to make skin darker in the sun.', example:'The table was a warm tan color.', meta:'Built-in local glossary' },
    tape: { word:'tape', pos:'noun / verb', text:'A sticky strip of material, or to fasten with it.', example:'Use tape to seal the box.', meta:'Built-in local glossary' },
    taper: { word:'taper', pos:'verb', text:'To gradually become thinner or narrower.', example:'The candle tapers to a point.', meta:'Built-in local glossary' },
    tap: { word:'tap', pos:'noun / verb', text:'To strike lightly, or a small valve that controls the flow of liquid.', example:'Tap the screen to continue.', meta:'Built-in local glossary' },
    tea: { word:'tea', pos:'noun', text:'A hot drink made by steeping leaves in water.', example:'She drank tea after dinner.', meta:'Built-in local glossary' },
    neat: { word:'neat', pos:'adjective', text:'Clean, tidy, or carefully arranged.', example:'Her desk is always neat.', meta:'Built-in local glossary' },
    tenant: { word:'tenant', pos:'noun', text:'Someone who rents and lives in a place.', example:'The tenant paid the rent on time.', meta:'Built-in local glossary' },
    area: { word:'area', pos:'noun', text:'A part of a place or a region.', example:'This area is quiet at night.', meta:'Built-in local glossary' },
    earn: { word:'earn', pos:'verb', text:'To get something through work or effort.', example:'She can earn a prize with that score.', meta:'Built-in local glossary' },
    reap: { word:'reap', pos:'verb', text:'To gather in what has grown, or to get the result of something.', example:'You reap what you sow.', meta:'Built-in local glossary' },
    peat: { word:'peat', pos:'noun', text:'Partly decayed plant material used as fuel or in soil.', example:'The gardener mixed peat into the soil.', meta:'Built-in local glossary' },
    trait: { word:'trait', pos:'noun', text:'A characteristic or feature of a person or thing.', example:'Kindness is one of her best traits.', meta:'Built-in local glossary' }
  };

  let puzzleIndex = chooseIndex();
  let puzzle = null;
  let current = '';
  let found = new Set();
  let score = 0;
  let pangrams = 0;
  let keyHandler = null;
  let selectedDefinition = '';
  const definitionCache = new Map();

  function chooseIndex(){
    const d = new Date();
    const seed = d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate();
    return seed % PUZZLES.length;
  }

  function normalize(word){
    return String(word || '').toLowerCase().replace(/[^a-z]/g, '');
  }

  function scoreOf(word, isPangram){
    const base = Math.max(1, word.length - 3);
    return isPangram ? base + 7 : base;
  }

  function rankFor(points){
    let chosen = RANKS[0];
    for(const r of RANKS){
      if(points >= r[0]) chosen = r;
    }
    return chosen;
  }

  function celebrate(){
    const box = $('confetti');
    for(let i=0;i<60;i++){
      const c = document.createElement('div');
      c.className = 'conf';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = COLORS[i % COLORS.length];
      c.style.animationDuration = (1.5 + Math.random() * 1.1) + 's';
      c.style.animationDelay = (Math.random() * .2) + 's';
      c.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
      box.appendChild(c);
      setTimeout(()=>c.remove(), 3000);
    }
  }

  function puzzleSummary(){
    const letters = puzzle.letters.map(ch => ch.toUpperCase()).join(' ');
    return `Hive letters: ${letters}. Center letter: ${puzzle.center.toUpperCase()}. Pangram: ${puzzle.pangram.toUpperCase()}.`;
  }

  function buildHive(){
    hive.innerHTML = '';
    const outer = puzzle.letters.filter(ch => ch !== puzzle.center);
    const positions = [
      {x:50, y:18},
      {x:72, y:34},
      {x:72, y:66},
      {x:50, y:82},
      {x:28, y:66},
      {x:28, y:34},
    ];
    outer.forEach((ch, i) => {
      const b = el('button', 'hex outer', ch.toUpperCase());
      b.style.left = positions[i].x + '%';
      b.style.top = positions[i].y + '%';
      b.onclick = () => addLetter(ch);
      hive.appendChild(b);
    });
    const center = el('button', 'hex center', puzzle.center.toUpperCase());
    center.style.left = '50%';
    center.style.top = '50%';
    center.onclick = () => addLetter(puzzle.center);
    hive.appendChild(center);
  }

  function renderEntry(){
    entry.innerHTML = '';
    if(!current){
      entry.appendChild(Object.assign(document.createElement('span'), { className:'ghost', textContent:'Tap letters or type' }));
      return;
    }
    for(const ch of current){
      const s = document.createElement('span');
      s.textContent = ch.toUpperCase();
      entry.appendChild(s);
    }
  }

  function renderFound(){
    const words = Array.from(found).sort((a,b) => a.length - b.length || a.localeCompare(b));
    foundWords.innerHTML = '';
    words.forEach(w => {
      const pill = el('button', 'word wordbutton' + (w === puzzle.pangram ? ' pangram' : ' found') + (w === selectedDefinition ? ' active' : ''));
      pill.type = 'button';
      pill.innerHTML = esc(w) + `<span class="pts">${scoreOf(w, w === puzzle.pangram)} pts</span>`;
      pill.onclick = () => showDefinition(w);
      foundWords.appendChild(pill);
    });
    foundMeta.textContent = `${words.length} of ${puzzle.words.length} words`;
  }

  function renderDefinitionPlaceholder(){
    definitionWord.textContent = 'Definition';
    definitionPos.textContent = 'Select a found word';
    definitionText.textContent = 'When you solve a word, its definition will appear here. This uses a built-in glossary inside the app.';
    definitionExample.textContent = '';
    definitionMeta.textContent = '';
  }

  async function lookupDefinition(word){
    if(definitionCache.has(word)) return definitionCache.get(word);
    const fallback = {
      word,
      pos: 'word',
      text: 'This word is valid in the hive, but the built-in glossary does not have a local definition for it yet.',
      example: '',
      meta: 'Built-in local glossary'
    };
    const payload = LOCAL_DEFINITIONS[word] || fallback;
    definitionCache.set(word, payload);
    return payload;
  }

  async function showDefinition(word){
    const normalized = normalize(word);
    if(!normalized) return;
    selectedDefinition = normalized;
    renderFound();
    definitionWord.textContent = normalized.toUpperCase();
    definitionPos.textContent = 'Loading local definition...';
    definitionText.textContent = 'Reading from the built-in glossary...';
    definitionExample.textContent = '';
    definitionMeta.textContent = '';
    const entry = await lookupDefinition(normalized);
    if(selectedDefinition !== normalized) return;
    definitionWord.textContent = (entry.word || normalized).toUpperCase();
    definitionPos.textContent = entry.pos ? entry.pos : 'word';
    definitionText.textContent = entry.text;
    definitionExample.textContent = entry.example ? `“${entry.example}”` : '';
    definitionMeta.textContent = entry.meta || '';
  }

  function updateStats(){
    const total = puzzle.words.reduce((sum, w) => sum + scoreOf(w, w === puzzle.pangram), 0);
    const pct = total ? Math.min(100, Math.round(score / total * 100)) : 0;
    const rank = rankFor(pct);
    scoreEl.textContent = score;
    foundCountEl.textContent = found.size;
    pangramCountEl.textContent = pangrams;
    rankName.textContent = rank[1];
    rankNote.textContent = rank[2];
    progressBar.style.width = pct + '%';
    maxScore.textContent = `${total} pts possible`;
    meta.innerHTML = [
      `<span class="chip">🗓️ <small>${new Intl.DateTimeFormat(undefined, { weekday:'short', month:'short', day:'numeric' }).format(new Date())}</small></span>`,
      `<span class="chip">🔤 <small>${puzzle.letters.length} letters</small></span>`,
      `<span class="chip">🎯 <small>${puzzle.words.length} solution words</small></span>`,
      `<span class="chip">✨ <small>${puzzle.pangram.toUpperCase()}</small></span>`,
    ].join('');
  }

  function setFeedback(msg, kind){
    feedback.textContent = msg;
    feedback.className = 'feedback' + (kind ? ' ' + kind : '');
  }

  function clue(){
    const missing = puzzle.words.filter(w => !found.has(w));
    if(!missing.length){
      clueText.textContent = 'You found everything. Time to be smug about it.';
      return;
    }
    const word = pick(missing);
    clueText.textContent = `Hint: ${word[0].toUpperCase()}${'•'.repeat(Math.max(1, word.length - 2))}${word[word.length - 1].toUpperCase()} (${word.length} letters).`;
  }

  function addLetter(ch){
    current += ch;
    renderEntry();
    setFeedback('', '');
  }

  function clearWord(){
    current = '';
    renderEntry();
    setFeedback('Word cleared.', '');
  }

  function backspace(){
    current = current.slice(0, -1);
    renderEntry();
  }

  function shuffleHive(){
    const outer = shuffle(puzzle.letters.filter(ch => ch !== puzzle.center));
    const buttons = [...hive.querySelectorAll('.hex.outer')];
    buttons.forEach((btn, i) => {
      btn.textContent = outer[i].toUpperCase();
      btn.onclick = () => addLetter(outer[i]);
    });
    setFeedback('Hive shuffled.', '');
  }

  function validate(word){
    if(word.length < 2) return 'Need at least 2 letters.';
    if(!word.includes(puzzle.center)) return `Must include the center letter ${puzzle.center.toUpperCase()}.`;
    if([...word].some(ch => !puzzle.letters.includes(ch))) return 'Use only the letters in the hive.';
    return null;
  }

  async function submit(){
    const word = normalize(current);
    const problem = validate(word);
    if(problem){
      setFeedback(problem, 'bad');
      return;
    }
    if(found.has(word)){
      setFeedback('Already found that one.', 'bad');
      return;
    }
    if(!puzzle.wordSet.has(word)){
      setFeedback("Not in today's hive.", 'bad');
      return;
    }
    found.add(word);
    const isPangram = word === puzzle.pangram;
    const pts = scoreOf(word, isPangram);
    score += pts;
    if(isPangram){
      pangrams += 1;
      setFeedback(`Pangram! +${pts} points for ${word.toUpperCase()}.`, 'good');
      celebrate();
    } else {
      setFeedback(`Nice. +${pts} points for ${word.toUpperCase()}.`, 'good');
    }
    current = '';
    renderEntry();
    renderFound();
    updateStats();
    clue();
    await showDefinition(word);
    if(found.size === puzzle.words.length){
      setFeedback('Hive complete. You found every solution.', 'good');
      celebrate();
    }
  }

  function bindKeys(){
    if(keyHandler) document.removeEventListener('keydown', keyHandler, true);
    keyHandler = function(e){
      if(e.metaKey || e.ctrlKey || e.altKey) return;
      if(e.key === 'Enter'){ e.preventDefault(); submit(); return; }
      if(e.key === 'Backspace'){ e.preventDefault(); backspace(); return; }
      if(e.key === 'Escape'){ e.preventDefault(); clearWord(); return; }
      if(/^[a-zA-Z]$/.test(e.key)){
        e.preventDefault();
        addLetter(e.key.toLowerCase());
      }
    };
    document.addEventListener('keydown', keyHandler, true);
  }

  function nextPuzzle(delta){
    puzzleIndex = (puzzleIndex + delta + PUZZLES.length) % PUZZLES.length;
    loadPuzzle();
  }

  function loadPuzzle(){
    puzzle = PUZZLES[puzzleIndex];
    current = '';
    found = new Set();
    score = 0;
    pangrams = 0;
    selectedDefinition = '';
    titleEl.textContent = `Today's hive: ${puzzle.pangram.toUpperCase()}`;
    puzzleMeta.textContent = puzzleSummary();
    buildHive();
    renderEntry();
    renderFound();
    updateStats();
    clueText.textContent = 'A pangram uses every letter at least once.';
    setFeedback('Words must use only the hive letters and include the center letter. 2-letter words count too.', '');
    renderDefinitionPlaceholder();
    bindKeys();

    const centerBtn = hive.querySelector('.hex.center');
    if(centerBtn) centerBtn.classList.add('pangram');
  }

  $('submitBtn').onclick = () => submit();
  $('clearBtn').onclick = clearWord;
  $('shuffleBtn').onclick = shuffleHive;
  $('hintBtn').onclick = clue;
  $('nextBtn').onclick = () => nextPuzzle(1);

  loadPuzzle();
})();
