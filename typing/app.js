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
    { name:'The Constitution & You', keys:'A–Z . ,', desc:'The full Constitution, section by section, in order.',
      ordered:true,
      sections:[
        { title:'Preamble', text:'We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America. We the people create this Constitution to make the country work better together. We want justice, peace at home, protection from danger, and the well-being of the people. We also want to protect liberty for ourselves and for future generations. The Constitution is the set of rules we establish for the United States government.' },
        { title:'Article I: Congress', text:'All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives. Congress makes the laws of the United States. Congress has two parts: the House of Representatives and the Senate. Members of the House are elected by the people, and each state\'s number of representatives depends mostly on its population. Each state has two Senators. Congress has the power to collect taxes, borrow money, regulate trade, coin money, establish post offices, declare war, raise armies and navies, and make laws needed to carry out its constitutional powers. Bills generally must pass both the House and Senate before going to the President. The Constitution also places limits on what Congress and the states may do.' },
        { title:'Article II: The President', text:'The executive Power shall be vested in a President of the United States of America. The President leads the executive branch and is responsible for carrying out the laws. A President serves a four-year term and is chosen through the Electoral College system. The President is Commander in Chief of the armed forces and may make treaties and appoint judges and other officials, usually with the Senate\'s approval. The President must "take Care that the Laws be faithfully executed." The President may approve bills passed by Congress or veto them. The President, Vice President, and other federal officials can be removed from office through impeachment for serious abuses such as "Treason, Bribery, or other high Crimes and Misdemeanors."' },
        { title:'Article III: The Courts', text:'The judicial Power of the United States, shall be vested in one supreme Court. The Constitution creates the Supreme Court and allows Congress to create lower federal courts. Federal judges may remain in office while they demonstrate "good Behaviour," which generally means they can serve for life unless they resign, retire, die, or are removed through impeachment. Federal courts decide cases involving the Constitution, federal laws, treaties, disputes between states, and certain other matters. The Constitution also defines treason very narrowly. A person cannot be convicted of treason without strong evidence, including testimony from two witnesses to the same act or a confession in open court.' },
        { title:'Article IV: The States', text:'Full Faith and Credit shall be given in each State to the public Acts, Records, and judicial Proceedings of every other State. States must generally recognize the official records and court decisions of other states. Citizens of one state are entitled to many of the same basic privileges when they travel or live in another state. Congress may admit new states into the Union. The federal government must guarantee every state a "Republican Form of Government." It must also protect states against invasion and, under certain circumstances, serious domestic violence.' },
        { title:'Article V: Changing the Constitution', text:'The Congress, whenever two thirds of both Houses shall deem it necessary, shall propose Amendments to this Constitution. The Constitution can be changed through amendments, but changing it is intentionally difficult. An amendment can be proposed by two-thirds of both houses of Congress, or through a convention requested by two-thirds of the states. An amendment does not become part of the Constitution until three-fourths of the states approve it. This makes it possible for the Constitution to change while requiring broad agreement across the country.' },
        { title:'Article VI: The Constitution Is the Supreme Law', text:'This Constitution, and the Laws of the United States which shall be made in Pursuance thereof, shall be the supreme Law of the Land. The Constitution is the highest law of the United States. Federal laws and treaties made according to the Constitution also have authority over conflicting state laws. Government officials must swear or affirm that they will support the Constitution. The Constitution also says that "no religious Test shall ever be required" to hold a public office under the United States.' },
        { title:'Article VII: Approving the Constitution', text:'The Ratification of the Conventions of nine States, shall be sufficient for the Establishment of this Constitution. The Constitution would take effect after nine of the original thirteen states approved it. New Hampshire became the ninth state to ratify the Constitution in 1788. Eventually, all thirteen original states joined the new constitutional government.' },
        { title:'First Amendment', text:'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof, or abridging the freedom of speech, or of the press. The government may not establish an official religion or prevent people from practicing their religion. People have freedom of speech and freedom of the press. People may peacefully gather together and may petition the government to fix problems or change policies.' },
        { title:'Second Amendment', text:'A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed. The Second Amendment protects the right of the people to keep and bear arms. Its wording also refers to a "well regulated Militia" and the security of a free state. The exact scope of this right has been debated throughout American history and interpreted by courts.' },
        { title:'Third Amendment', text:'No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner. The government cannot force people to house soldiers in their homes during peacetime without permission. During wartime, soldiers may only be housed in private homes according to laws passed for that purpose. This amendment grew out of abuses Americans experienced before the Revolution.' },
        { title:'Fourth Amendment', text:'The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated. People have a right to be protected from unreasonable government searches and seizures. Police generally need a good legal reason to search someone or their property. Search warrants must be based on "probable cause" and must specifically describe what or where authorities are allowed to search.' },
        { title:'Fifth Amendment', text:'No person shall be deprived of life, liberty, or property, without due process of law. People accused of serious federal crimes have important legal protections. A person cannot normally be tried twice for the same crime and cannot be forced to testify against themselves. The government must follow fair legal procedures before taking away a person\'s life, liberty, or property. If the government takes private property for public use, it must provide "just compensation."' },
        { title:'Sixth Amendment', text:'In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial. A person accused of a crime has the right to a speedy and public trial. The trial must be heard by an impartial jury. The accused must be told what they are charged with, may question witnesses against them, may call witnesses for their defense, and has the right to a lawyer.' },
        { title:'Seventh Amendment', text:'In Suits at common law, the right of trial by jury shall be preserved. The right to a jury trial is protected in many federal civil cases, not only criminal cases. Civil cases are disputes between people or organizations, often involving money or property. This amendment helps preserve the traditional role of juries in deciding important factual disputes.' },
        { title:'Eighth Amendment', text:'Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted. The government cannot demand unreasonable bail or impose excessive fines. It also cannot use "cruel and unusual punishments." Courts have spent many years deciding what kinds of punishments violate this rule.' },
        { title:'Ninth Amendment', text:'The enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people. The Constitution lists many rights, but those are not necessarily the only rights people have. The fact that a right is not specifically written down does not automatically mean that people do not have it. The amendment warns against assuming that the government\'s powers are unlimited just because every individual right is not listed.' },
        { title:'Tenth Amendment', text:'The powers not delegated to the United States by the Constitution are reserved to the States respectively, or to the people. The federal government only has the powers given to it by the Constitution. Powers not given to the federal government, and not forbidden to the states, remain with the states or the people. This is an important part of the American system of federalism.' },
        { title:'Eleventh Amendment', text:'The Eleventh Amendment limits certain lawsuits against states in federal court. It was adopted after the Supreme Court allowed a citizen of one state to sue another state. The amendment strengthened the legal protection states have from some lawsuits.' },
        { title:'Twelfth Amendment', text:'The Twelfth Amendment changed the way the Electoral College chooses the President and Vice President. Electors now cast separate votes for President and Vice President. If no presidential candidate receives the required majority, the House of Representatives chooses the President under special rules.' },
        { title:'Thirteenth Amendment', text:'Neither slavery nor involuntary servitude shall exist within the United States. The Thirteenth Amendment abolished slavery throughout the United States, except as punishment for a crime after conviction. It was ratified in 1865 after the Civil War. Congress was also given the power to enforce the amendment through laws.' },
        { title:'Fourteenth Amendment', text:'All persons born or naturalized in the United States are citizens of the United States and of the State wherein they reside. The Fourteenth Amendment establishes national citizenship. States may not "deprive any person of life, liberty, or property, without due process of law." States also may not deny anyone "the equal protection of the laws." This amendment became one of the most important constitutional protections for civil rights.' },
        { title:'Fifteenth Amendment', text:'The right of citizens of the United States to vote shall not be denied on account of race, color, or previous condition of servitude. The federal and state governments may not deny a citizen the right to vote because of race or because that person or their ancestors were previously enslaved. Congress has the power to enforce this protection. In practice, many discriminatory voting restrictions continued after its adoption and were challenged through later laws and court cases.' },
        { title:'Sixteenth Amendment', text:'The Congress shall have power to lay and collect taxes on incomes. The Sixteenth Amendment clearly gives Congress the power to collect a federal income tax. The tax does not have to be divided among the states according to population. It became the constitutional basis for the modern federal income tax system.' },
        { title:'Seventeenth Amendment', text:'The Senate of the United States shall be composed of two Senators from each State, elected by the people thereof. Originally, state legislatures chose U.S. Senators. The Seventeenth Amendment changed this so voters directly elect their Senators. Each state still has two Senators, each serving a six-year term.' },
        { title:'Eighteenth Amendment', text:'The Eighteenth Amendment began national Prohibition. It prohibited the manufacture, sale, and transportation of alcoholic drinks in the United States. It was later repealed by the Twenty-First Amendment.' },
        { title:'Nineteenth Amendment', text:'The right of citizens of the United States to vote shall not be denied on account of sex. The government cannot deny a citizen the right to vote because of sex. Ratified in 1920, this amendment constitutionally protected women\'s voting rights nationwide. Congress was given the power to enforce it.' },
        { title:'Twentieth Amendment', text:'The Twentieth Amendment changed when presidential and congressional terms begin and end. Congressional terms now begin on January 3, and presidential terms begin on January 20. It also created rules for unusual situations in which a President-elect dies or cannot take office.' },
        { title:'Twenty-First Amendment', text:'The Twenty-First Amendment repealed the Eighteenth Amendment and ended national Prohibition. Alcohol could again legally be produced and sold under federal and state laws. States retained substantial power to regulate alcohol within their borders.' },
        { title:'Twenty-Second Amendment', text:'No person shall be elected to the office of the President more than twice. A person may normally be elected President no more than two times. Someone who takes over more than two years of another President\'s term may be elected only once afterward. The amendment established a constitutional limit on presidential terms.' },
        { title:'Twenty-Third Amendment', text:'The Twenty-Third Amendment gives Washington, D.C., a role in presidential elections through the Electoral College. The District receives electoral votes as if it were a state, although it cannot receive more than the least populous state. Washington, D.C., is still not a state.' },
        { title:'Twenty-Fourth Amendment', text:'The right of citizens of the United States to vote shall not be denied by reason of failure to pay any poll tax or other tax. Citizens cannot be required to pay a poll tax in order to vote in federal elections. Poll taxes had often been used to prevent poor citizens, especially Black citizens in the South, from voting. The amendment removed this financial barrier from federal elections.' },
        { title:'Twenty-Fifth Amendment', text:'The Twenty-Fifth Amendment explains what happens if a President dies, resigns, is removed, or becomes unable to perform the job. The Vice President becomes President when the presidency becomes vacant. It also provides ways to fill a vacant vice presidency and temporarily transfer presidential powers when a President is unable to serve.' },
        { title:'Twenty-Sixth Amendment', text:'The right of citizens of the United States, who are eighteen years of age or older, to vote shall not be denied on account of age. Citizens who are at least 18 years old cannot be denied the right to vote because of their age. Before this amendment, the voting age in many places was 21. The amendment was ratified in 1971.' },
        { title:'Twenty-Seventh Amendment', text:'No law, varying the compensation for the services of the Senators and Representatives, shall take effect, until an election of Representatives shall have intervened. Congress may vote to change the pay of its members, but the change cannot take effect immediately. A House election must happen first. This gives voters an opportunity to respond before members of Congress receive the new salary.' }
      ] },
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
    // Ordered lessons (e.g. the Constitution) step through their sections in
    // fixed document order, one per round, looping back to the start —
    // never shuffled.
    if(lesson.ordered){
      lesson._idx = (lesson._idx == null ? -1 : lesson._idx) + 1;
      if(lesson._idx >= lesson.sections.length) lesson._idx = 0;
      const sec = lesson.sections[lesson._idx];
      return { text: sec.text, label: 'Section ' + (lesson._idx+1) + ' of ' + lesson.sections.length + ': ' + sec.title };
    }
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
    return { text: result, label: null };
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
    if(L.ordered) L._idx = -1;   // always start an ordered lesson from its first section
    menu.classList.add('hidden'); stage.classList.remove('hidden');
    $('navMenu').classList.remove('on');
    $('subtitle').textContent=L.name+' — just start typing!';
    renderDrill(L, i);
  }

  function renderDrill(L, idx){
    detach();
    const drill = makeDrill(L);
    const target = drill.text;
    let pos=0, errors=0, startTime=null, done=false;

    stage.innerHTML='';
    const card=el('div','card');

    if(drill.label){
      const secLbl=el('div','section-label'); secLbl.textContent=drill.label;
      card.appendChild(secLbl);
    }

    // stats
    const stats=el('div','stats');
    const sWpm=el('div','stat','<b id="wpm">0</b><small>WPM</small>');
    const sAcc=el('div','stat','<b id="acc">100%</b><small>accuracy</small>');
    const sProg=el('div','stat','<b id="prog">0%</b><small>done</small>');
    stats.appendChild(sWpm); stats.appendChild(sAcc); stats.appendChild(sProg);
    card.appendChild(stats);

    // text with per-char spans
    const textEl=el('div','text');
    const chars=[];
    let wordWrap=null;
    [...target].forEach(ch=>{
      const s=el('span','ch'+(ch===' '?' sp':''));
      s.textContent = ch===' ' ? ' ' : ch;
      chars.push(s);
      if(ch===' '){
        wordWrap=null; textEl.appendChild(s);
        textEl.appendChild(document.createTextNode('\u200b'));   // a real, breakable wrap point after the space
      } else {
        if(!wordWrap){ wordWrap=el('span','word'); textEl.appendChild(wordWrap); }
        wordWrap.appendChild(s);
      }
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
