// Builds history/library.js (master data for the 3 games) and downloads portrait
// thumbnails from Wikipedia into history/img/. Run: node gen_history.js
'use strict';
const fs = require('fs');
const OUT = '/Users/traviswilber/Claude-Projects/math-app/history';
const IMGDIR = OUT + '/img';

const slug = s => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');

// era value = sort key (year, negative for BCE). label = display string.
const FIGURES = [
  { name:'Marie Curie', wiki:'Marie_Curie', country:'Poland / France', flag:'🇵🇱', era:1900, eraLabel:'1867–1934', role:'Scientist', emoji:'🔬',
    facts:['Discovered the elements radium and polonium','First person ever to win two Nobel Prizes','Her research led to X-rays and cancer treatment'],
    quote:'Nothing in life is to be feared, it is only to be understood.',
    bio:"A scientist born in Poland who worked in France. She discovered radioactive elements and won two Nobel Prizes — the first person ever to do so. Her work led to X-rays, though the radiation she studied also made her ill." },
  { name:'Albert Einstein', wiki:'Albert_Einstein', country:'Germany', flag:'🇩🇪', era:1920, eraLabel:'1879–1955', role:'Scientist', emoji:'🧠',
    facts:['Created the theory of relativity','Explained that energy equals mass times c squared (E=mc²)','Won the Nobel Prize in Physics'],
    quote:'Imagination is more important than knowledge.',
    bio:"A physicist who changed how we understand space, time, and gravity. His famous equation E=mc² and theory of relativity reshaped science. He fled Germany when the Nazis rose to power." },
  { name:'Isaac Newton', wiki:'Isaac_Newton', country:'England', flag:'🇬🇧', era:1690, eraLabel:'1643–1727', role:'Scientist', emoji:'🍎',
    facts:['Described the law of gravity','Wrote three laws of motion','Built the first reflecting telescope'],
    quote:'If I have seen further, it is by standing on the shoulders of giants.',
    bio:"An English scientist and mathematician who explained gravity and the laws of motion. His ideas became the foundation of modern physics." },
  { name:'Leonardo da Vinci', wiki:'Leonardo_da_Vinci', country:'Italy', flag:'🇮🇹', era:1500, eraLabel:'1452–1519', role:'Artist & Inventor', emoji:'🎨',
    facts:['Painted the Mona Lisa','Sketched flying machines centuries before airplanes','Studied the human body through detailed drawings'],
    quote:'Learning never exhausts the mind.',
    bio:"An Italian genius of the Renaissance who was both a great painter and an inventor. He filled notebooks with ideas for machines the world would not build for hundreds of years." },
  { name:'Nikola Tesla', wiki:'Nikola_Tesla', country:'Serbia', flag:'🇷🇸', era:1900, eraLabel:'1856–1943', role:'Inventor', emoji:'⚡',
    facts:['Developed the AC electricity we use today','Invented the induction motor','Experimented with sending power wirelessly'],
    quote:'The present is theirs; the future, for which I really worked, is mine.',
    bio:"A Serbian-American inventor whose alternating-current (AC) system powers our homes today. He was brilliant but died with little money despite his many inventions." },
  { name:'Thomas Edison', wiki:'Thomas_Edison', country:'United States', flag:'🇺🇸', era:1900, eraLabel:'1847–1931', role:'Inventor', emoji:'💡',
    facts:['Invented a practical electric light bulb','Created the phonograph to record sound','Held over 1,000 patents'],
    quote:'Genius is one percent inspiration and ninety-nine percent perspiration.',
    bio:"An American inventor whose light bulb, phonograph, and movie camera changed daily life. He was famous for never giving up after failed experiments." },
  { name:'Ada Lovelace', wiki:'Ada_Lovelace', country:'England', flag:'🇬🇧', era:1840, eraLabel:'1815–1852', role:'Mathematician', emoji:'💻',
    facts:['Wrote the first computer program','Imagined computers could do more than just math','A computer language is named after her'],
    bio:"An English mathematician who wrote instructions for an early mechanical computer — making her the world's first computer programmer, a century before modern computers." },
  { name:'Galileo Galilei', wiki:'Galileo_Galilei', country:'Italy', flag:'🇮🇹', era:1610, eraLabel:'1564–1642', role:'Astronomer', emoji:'🔭',
    facts:['Improved the telescope to study the night sky','Discovered four moons orbiting Jupiter','Was punished for teaching that Earth orbits the Sun'],
    quote:'And yet it moves.',
    bio:"An Italian astronomer who used a telescope to prove Earth moves around the Sun. Powerful leaders put him on trial and kept him under house arrest for his ideas." },
  { name:'George Washington Carver', wiki:'George_Washington_Carver', country:'United States', flag:'🇺🇸', era:1900, eraLabel:'1864–1943', role:'Scientist', emoji:'🥜',
    facts:['Found hundreds of uses for the peanut','Taught farmers how to enrich tired soil','Was born into slavery and became a famous scientist'],
    bio:"An American scientist born into slavery who became a leading agricultural researcher. He helped farmers by finding new uses for crops like peanuts and sweet potatoes." },
  { name:'Katherine Johnson', wiki:'Katherine_Johnson', country:'United States', flag:'🇺🇸', era:1960, eraLabel:'1918–2020', role:'Mathematician', emoji:'🚀',
    facts:['Calculated flight paths for NASA astronauts','Helped send the first Americans safely to space','Broke barriers as a Black woman in science'],
    bio:"An American mathematician whose calculations sent astronauts to space and back. She succeeded at NASA at a time when Black women faced great unfairness." },
  { name:'Al-Khwarizmi', wiki:'Al-Khwarizmi', country:'Persia', flag:'🇮🇷', era:820, eraLabel:'c. 780–850', role:'Mathematician', emoji:'🔢',
    facts:['Helped create the branch of math called algebra','The word "algorithm" comes from his name','Spread the number system we use today'],
    bio:"A Persian scholar in Baghdad who helped invent algebra. So much of modern math and computing traces back to his work that the word 'algorithm' comes from his name." },
  { name:'Zheng He', wiki:'Zheng_He', country:'China', flag:'🇨🇳', era:1410, eraLabel:'1371–1433', role:'Explorer', emoji:'⛵',
    facts:['Led enormous treasure fleets across the oceans','Sailed as far as Africa and the Middle East','Commanded ships far larger than Europe’s'],
    bio:"A Chinese admiral who led giant fleets across Asia and to Africa — decades before European voyages. His treasure ships were among the largest wooden ships ever built." },
  { name:'Ibn Battuta', wiki:'Ibn_Battuta', country:'Morocco', flag:'🇲🇦', era:1340, eraLabel:'1304–1369', role:'Explorer', emoji:'🧭',
    facts:['Traveled over 75,000 miles in his lifetime','Journeyed across Africa, Asia, and Europe','Wrote a famous book describing the world he saw'],
    bio:"A traveler from Morocco who journeyed farther than almost anyone of his time — across Africa, the Middle East, India, and China — and wrote about all he saw." },
  { name:'Christopher Columbus', wiki:'Christopher_Columbus', country:'Italy / Spain', flag:'🇪🇸', era:1490, eraLabel:'1451–1506', role:'Explorer', emoji:'🚢',
    facts:['Sailed across the Atlantic Ocean in 1492','Opened lasting contact between Europe and the Americas','His voyages brought great harm to Indigenous peoples'],
    bio:"An Italian explorer sailing for Spain who crossed the Atlantic in 1492. His voyages connected two worlds — but also began centuries of harm and disease for the Indigenous peoples already living in the Americas." },
  { name:'Amelia Earhart', wiki:'Amelia_Earhart', country:'United States', flag:'🇺🇸', era:1930, eraLabel:'1897–1937', role:'Aviator', emoji:'✈️',
    facts:['First woman to fly alone across the Atlantic','Set many aviation records','Disappeared during a flight around the world'],
    quote:'Adventure is worthwhile in itself.',
    bio:"An American pilot who set records and became the first woman to fly solo across the Atlantic. She vanished over the Pacific while trying to fly around the world." },
  { name:'Sacagawea', wiki:'Sacagawea', country:'United States (Shoshone)', flag:'🪶', era:1805, eraLabel:'c. 1788–1812', role:'Guide', emoji:'🏔️',
    facts:['Guided the Lewis and Clark expedition','Helped translate with Native American nations','Traveled thousands of miles carrying her baby'],
    bio:"A young Shoshone woman who guided and translated for the Lewis and Clark expedition across western North America, carrying her infant son the whole way." },
  { name:'Cleopatra', wiki:'Cleopatra', country:'Egypt', flag:'🇪🇬', era:-40, eraLabel:'69–30 BCE', role:'Ruler', emoji:'👑',
    facts:['The last pharaoh of ancient Egypt','Was famous for her intelligence and many languages','Formed alliances with powerful Roman leaders'],
    bio:"The last pharaoh of ancient Egypt, known for her sharp mind and skill with languages. She allied with Rome's leaders to protect Egypt's independence." },
  { name:'Mansa Musa', wiki:'Mansa_Musa', country:'Mali', flag:'🇲🇱', era:1320, eraLabel:'c. 1280–1337', role:'Ruler', emoji:'💰',
    facts:['Possibly the richest person in all of history','Ruled the wealthy West African empire of Mali','Built Timbuktu into a great center of learning'],
    bio:"The emperor of Mali in West Africa and possibly the richest person who ever lived. His famous journey to Mecca spread Mali's gold and fame across the world." },
  { name:'Genghis Khan', wiki:'Genghis_Khan', country:'Mongolia', flag:'🇲🇳', era:1210, eraLabel:'c. 1162–1227', role:'Ruler', emoji:'🏹',
    facts:['Built the largest connected land empire in history','United the scattered Mongol tribes','His conquests were extremely violent'],
    bio:"A Mongol leader who united his people and built the largest land empire ever. His empire connected trade across Asia, but his conquests killed huge numbers of people." },
  { name:'Qin Shi Huang', wiki:'Qin_Shi_Huang', country:'China', flag:'🇨🇳', era:-220, eraLabel:'259–210 BCE', role:'Emperor', emoji:'🏯',
    facts:['First emperor to unite all of China','Began building early parts of the Great Wall','Was buried with the Terracotta Army'],
    bio:"The first emperor to unite China under one rule. He standardized writing and money and began the Great Wall — but he ruled harshly and punished those who disagreed." },
  { name:'Julius Caesar', wiki:'Julius_Caesar', country:'Rome', flag:'🇮🇹', era:-50, eraLabel:'100–44 BCE', role:'Ruler', emoji:'⚔️',
    facts:['A Roman general who expanded the empire','Reformed the calendar we still use today','Was assassinated by Roman senators'],
    quote:'I came, I saw, I conquered.',
    bio:"A Roman general and ruler who expanded Rome's power. He gave us the 365-day calendar, but his grab for power led senators to assassinate him." },
  { name:'Napoleon Bonaparte', wiki:'Napoleon', country:'France', flag:'🇫🇷', era:1805, eraLabel:'1769–1821', role:'Ruler', emoji:'🎖️',
    facts:['Rose from soldier to emperor of France','Created a legal code copied around the world','His wars caused millions of deaths'],
    bio:"A French general who crowned himself emperor and conquered much of Europe. His laws still shape many countries, but his endless wars cost millions of lives." },
  { name:'Nelson Mandela', wiki:'Nelson_Mandela', country:'South Africa', flag:'🇿🇦', era:1990, eraLabel:'1918–2013', role:'Leader', emoji:'✊',
    facts:['Fought to end apartheid in South Africa','Spent 27 years in prison for his beliefs','Became South Africa’s first Black president'],
    quote:'It always seems impossible until it’s done.',
    bio:"A South African leader who fought the unjust system of apartheid. He spent 27 years in prison, then forgave his jailers and became the country's first Black president." },
  { name:'Mahatma Gandhi', wiki:'Mahatma_Gandhi', country:'India', flag:'🇮🇳', era:1940, eraLabel:'1869–1948', role:'Leader', emoji:'🕊️',
    facts:['Led India to independence peacefully','Used nonviolent protest to create change','Inspired civil rights movements worldwide'],
    quote:'Be the change you wish to see in the world.',
    bio:"A leader who guided India to independence using peaceful protest instead of violence. His methods inspired freedom movements all over the world." },
  { name:'Martin Luther King Jr.', wiki:'Martin_Luther_King_Jr.', country:'United States', flag:'🇺🇸', era:1960, eraLabel:'1929–1968', role:'Leader', emoji:'✊🏾',
    facts:['Led the American civil rights movement','Gave the famous "I Have a Dream" speech','Won the Nobel Peace Prize'],
    quote:'Darkness cannot drive out darkness; only light can do that.',
    bio:"An American minister who led the civil rights movement for equal rights through peaceful protest. His 'I Have a Dream' speech is one of the most famous ever given." },
  { name:'Abraham Lincoln', wiki:'Abraham_Lincoln', country:'United States', flag:'🇺🇸', era:1863, eraLabel:'1809–1865', role:'Leader', emoji:'🎩',
    facts:['The 16th president of the United States','Led the country through the Civil War','Helped end slavery in the United States'],
    quote:'Whatever you are, be a good one.',
    bio:"The U.S. president who guided the nation through its Civil War and worked to end slavery. He was assassinated soon after the war ended." },
  { name:'Frida Kahlo', wiki:'Frida_Kahlo', country:'Mexico', flag:'🇲🇽', era:1940, eraLabel:'1907–1954', role:'Artist', emoji:'🌺',
    facts:['Painted many powerful self-portraits','Turned her pain and illness into art','Became a symbol of Mexican culture'],
    quote:'I paint my own reality.',
    bio:"A Mexican painter known for bold, colorful self-portraits. A childhood illness and a bus accident caused her lifelong pain, which she poured into her art." },
  { name:'William Shakespeare', wiki:'William_Shakespeare', country:'England', flag:'🇬🇧', era:1600, eraLabel:'1564–1616', role:'Writer', emoji:'🎭',
    facts:['Wrote 37 plays and many poems','Invented hundreds of English words','Wrote "Romeo and Juliet" and "Hamlet"'],
    quote:'To be, or not to be: that is the question.',
    bio:"An English playwright often called the greatest writer in the language. His plays are still performed everywhere, and he coined hundreds of words we still use." },
  { name:'Ludwig van Beethoven', wiki:'Ludwig_van_Beethoven', country:'Germany', flag:'🇩🇪', era:1810, eraLabel:'1770–1827', role:'Composer', emoji:'🎼',
    facts:['Composed nine famous symphonies','Kept writing music after becoming deaf','Changed classical music forever'],
    bio:"A German composer whose symphonies changed music forever. Astonishingly, he wrote some of his greatest works after he had gone completely deaf." },
  { name:'Confucius', wiki:'Confucius', country:'China', flag:'🇨🇳', era:-500, eraLabel:'551–479 BCE', role:'Philosopher', emoji:'☯️',
    facts:['A teacher whose ideas shaped China for ages','Taught about kindness, respect, and learning','His sayings fill a book called the Analects'],
    quote:'It does not matter how slowly you go as long as you do not stop.',
    bio:"A Chinese teacher and thinker whose ideas about respect, family, and learning shaped East Asian culture for over two thousand years." },
  { name:'Hokusai', wiki:'Hokusai', country:'Japan', flag:'🇯🇵', era:1820, eraLabel:'1760–1849', role:'Artist', emoji:'🌊',
    facts:['Created the print "The Great Wave"','Made tens of thousands of artworks','Influenced artists around the world'],
    bio:"A Japanese artist famous for the woodblock print 'The Great Wave off Kanagawa.' He made art tirelessly into his eighties and inspired painters worldwide." },
  { name:'Wangari Maathai', wiki:'Wangari_Maathai', country:'Kenya', flag:'🇰🇪', era:1990, eraLabel:'1940–2011', role:'Leader', emoji:'🌳',
    facts:['Started a movement to plant millions of trees','First African woman to win the Nobel Peace Prize','Fought for the environment and for women'],
    quote:'It’s the little things citizens do. That’s what will make the difference.',
    bio:"A Kenyan scientist and activist who led ordinary people to plant tens of millions of trees. She was the first African woman to win the Nobel Peace Prize." },
];

// ---- Reading-comprehension passages (standardized-test ELA skill) ----
const AUTHORED = [
  { slug:'marie_curie', emoji:'🔬', img:'marie_curie.jpg', title:'The Scientist Who Glowed', text:
    "Marie Curie was born in Poland in 1867, at a time when women were not allowed to attend university there. Determined to learn, she moved to France and studied late into the night, sometimes so poor that she nearly fainted from hunger. Her hard work paid off. Curie discovered two new elements and won two Nobel Prizes — the first person ever to do so. But her discoveries had a hidden danger. The radioactive materials she handled every day slowly made her sick, because no one yet understood how harmful they were.",
    questions:[
      { q:'What is the main idea of this passage?', choices:['Curie was too poor to eat','Curie overcame obstacles to make great discoveries','France is better than Poland','Nobel Prizes are hard to win'], answer:1, explain:'The passage is mostly about how Curie pushed past hardships to achieve major scientific discoveries.' },
      { q:'Why did Marie Curie move to France?', choices:['To become rich','Because women could not attend university in Poland','To win a Nobel Prize','To escape a war'], answer:1, explain:'The passage says women were not allowed to attend university in Poland, so she moved to France to study.' },
      { q:'In this passage, the word "determined" means —', choices:['confused','giving up easily','strongly wanting to do something','very tired'], answer:2, explain:'"Determined to learn," she studied late into the night — she strongly wanted to succeed.' },
      { q:'What can you infer about radioactivity in Curie’s time?', choices:['People knew it was dangerous','Its dangers were not yet understood','It was not real','Only women could study it'], answer:1, explain:'The passage says she got sick because no one yet understood how harmful it was.' },
    ] },
  { slug:'mansa_musa', emoji:'💰', img:'mansa_musa.jpg', title:'The Richest Man Who Ever Lived', text:
    "In the 1300s, the West African empire of Mali was rich beyond imagination, and its ruler, Mansa Musa, may have been the wealthiest person in all of history. Mali controlled vast amounts of gold. In 1324, Mansa Musa made a long journey to Mecca, traveling with a caravan of thousands of people. Along the way he gave away so much gold that its value actually dropped in the cities he passed through. But Mansa Musa cared about more than riches. He brought back scholars and architects and turned the city of Timbuktu into a famous center of learning and books.",
    questions:[
      { q:'What is this passage mostly about?', choices:['How to travel to Mecca','A wealthy African ruler who valued learning','Why gold loses value','The city of Timbuktu today'], answer:1, explain:'The passage focuses on Mansa Musa’s wealth and how he used it to support learning.' },
      { q:'What happened to the value of gold as Mansa Musa traveled?', choices:['It went up','It dropped','It stayed the same','It disappeared'], answer:1, explain:'He gave away so much gold that its value dropped in the cities he passed through.' },
      { q:'Which sentence best shows that Mansa Musa cared about more than money?', choices:['Mali controlled vast amounts of gold','He traveled with thousands of people','He turned Timbuktu into a center of learning','He may have been the wealthiest person in history'], answer:2, explain:'Building a center of learning shows he valued knowledge, not just riches.' },
      { q:'The word "vast" in the passage means —', choices:['tiny','extremely large','hidden','fake'], answer:1, explain:'"Vast amounts of gold" means a huge, enormous quantity.' },
    ] },
  { slug:'katherine_johnson', emoji:'🚀', img:'katherine_johnson.jpg', title:'The Human Computer', text:
    "Before electronic computers were trusted, NASA relied on brilliant human mathematicians to check their numbers. One of the best was Katherine Johnson. She calculated the flight paths that would carry astronauts into space and safely back to Earth. When NASA first used an electronic computer for John Glenn’s orbit, Glenn refused to fly until Johnson had checked the machine’s math by hand. Johnson did all of this at a time when Black women in America faced unfair rules and were often kept apart from others at work. Her skill was so important that it could not be ignored.",
    questions:[
      { q:'What is the main idea of the passage?', choices:['Computers are always wrong','A gifted mathematician helped NASA despite facing unfairness','John Glenn was afraid to fly','NASA had no computers'], answer:1, explain:'The passage highlights Johnson’s vital work at NASA while facing discrimination.' },
      { q:'Why did John Glenn want Johnson to check the computer’s math?', choices:['She was his friend','He trusted her calculations','The computer was broken','She asked to'], answer:1, explain:'Glenn refused to fly until Johnson verified the numbers — he trusted her.' },
      { q:'What does the passage suggest about Johnson’s time period?', choices:['Everyone was treated equally','Black women faced unfair treatment','NASA hired only women','Space travel was easy'], answer:1, explain:'It states Black women faced unfair rules and were often kept apart at work.' },
    ] },
  { slug:'zheng_he', emoji:'⛵', img:'zheng_he.jpg', title:'The Admiral of the Treasure Fleet', text:
    "Almost a hundred years before European ships crossed the oceans, a Chinese admiral named Zheng He led some of the largest fleets the world had ever seen. His “treasure ships” were several times bigger than the boats European explorers would later use. Between 1405 and 1433, Zheng He sailed to Southeast Asia, India, the Middle East, and the eastern coast of Africa. He carried silk and porcelain to trade and returned with gifts, including a giraffe that amazed the Chinese court. After his voyages ended, China turned its attention inward, and the great fleets were never rebuilt.",
    questions:[
      { q:'What is the passage mainly about?', choices:['How to build a ship','A Chinese admiral’s great ocean voyages','Giraffes in China','European explorers'], answer:1, explain:'The passage describes Zheng He’s large fleets and his voyages.' },
      { q:'How did Zheng He’s ships compare to later European ships?', choices:['They were smaller','They were about the same','They were several times bigger','They were faster but weaker'], answer:2, explain:'The passage says his treasure ships were several times bigger.' },
      { q:'What happened after Zheng He’s voyages ended?', choices:['China built even bigger fleets','China turned its attention inward','Europe copied his ships','He sailed to the Americas'], answer:1, explain:'China turned inward and the great fleets were never rebuilt.' },
    ] },
  { slug:'wangari_maathai', emoji:'🌳', img:'wangari_maathai.jpg', title:'One Tree at a Time', text:
    "In Kenya, a scientist named Wangari Maathai noticed that the forests were disappearing. Without trees, the soil washed away and streams dried up, making life harder for families. Instead of waiting for others to fix the problem, Maathai encouraged ordinary women to plant trees — first a few, then thousands, then tens of millions. Her Green Belt Movement helped the land and gave women new confidence and income. Some powerful people opposed her, but she refused to back down. In 2004, she became the first African woman to win the Nobel Peace Prize.",
    questions:[
      { q:'What problem did Maathai set out to solve?', choices:['Too many trees','Disappearing forests and damaged land','A lack of schools','Unemployment in cities'], answer:1, explain:'She noticed forests disappearing, which damaged the soil and streams.' },
      { q:'What was the Green Belt Movement?', choices:['A running race','An effort to plant many trees','A new government','A type of forest'], answer:1, explain:'It was Maathai’s effort that led people to plant tens of millions of trees.' },
      { q:'The phrase "refused to back down" shows that Maathai was —', choices:['easily scared','determined and brave','unfriendly','uninterested'], answer:1, explain:'Refusing to back down against powerful opponents shows courage and determination.' },
      { q:'What is the lesson of this passage?', choices:['Only leaders can make change','Small actions by ordinary people can make a big difference','Trees are not important','Kenya has no forests'], answer:1, explain:'Ordinary women planting trees created huge change — small actions add up.' },
    ] },
  { slug:'galileo_galilei', emoji:'🔭', img:'galileo_galilei.jpg', title:'The Man Who Looked Up', text:
    "Long ago, most people believed that the Sun and stars circled the Earth. Then an Italian scientist named Galileo pointed a new invention — the telescope — at the night sky. He saw mountains on the Moon and four tiny moons circling the planet Jupiter. These discoveries convinced him that the Earth was not the center of everything; instead, the Earth traveled around the Sun. Powerful leaders were angry and put Galileo on trial, forcing him to take back his words. He spent his final years under house arrest, yet his careful observations helped launch modern science.",
    questions:[
      { q:'What did Galileo’s telescope help him discover?', choices:['New countries','Moons circling Jupiter','A cure for illness','Buried treasure'], answer:1, explain:'He saw mountains on the Moon and four moons around Jupiter.' },
      { q:'Why were powerful leaders angry with Galileo?', choices:['He built a telescope','He taught that Earth moves around the Sun','He was Italian','He was too quiet'], answer:1, explain:'His idea that Earth orbits the Sun challenged accepted beliefs, angering leaders.' },
      { q:'The word "convinced" in the passage means —', choices:['made unsure','made to believe','made angry','made tired'], answer:1, explain:'The discoveries convinced him — they made him believe Earth orbits the Sun.' },
      { q:'What is the main idea?', choices:['Telescopes are fun','Galileo’s discoveries helped begin modern science despite opposition','Jupiter has moons','House arrest is unfair'], answer:1, explain:'The passage is about Galileo’s discoveries and their importance despite the trouble they caused him.' },
    ] },
];

// ============ emit + fetch images ============
const UA = 'LearnZoneEducationalApp/1.0 (https://tw-origami.github.io; traviswilber@gmail.com)';
const sleep = ms => new Promise(r=>setTimeout(r,ms));
async function get(url, json){
  for(let attempt=0; attempt<4; attempt++){
    try{
      const r = await fetch(url, {headers:{'User-Agent':UA, 'accept': json?'application/json':'*/*'}});
      if(r.status===429){ await sleep(1500*(attempt+1)); continue; }
      if(!r.ok) return null;
      return json ? await r.json() : Buffer.from(await r.arrayBuffer());
    }catch(e){ await sleep(600); }
  }
  return null;
}
async function fetchImage(fig){
  const j = await get('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(fig.wiki), true);
  if(!j) return null;
  const src = j.thumbnail && j.thumbnail.source;
  if(!src) return null;
  const ext = (src.match(/\.(jpg|jpeg|png)/i)||['','jpg'])[1].toLowerCase();
  const buf = await get(src, false);
  if(!buf) return null;
  const file = slug(fig.name)+'.'+ext;
  fs.writeFileSync(IMGDIR+'/'+file, buf);
  return file;
}

// ============ big reading list (auto-generated passages from Wikipedia) ============
// Entry = 'Name' (wiki title auto) or 'Name|Wiki_Title'. ~70% Western.
const WEST = [
  'Isaac Newton','Charles Darwin','Michael Faraday','James Clerk Maxwell','Louis Pasteur','Alexander Fleming',
  'Gregor Mendel','Niels Bohr','Werner Heisenberg','Erwin Schrödinger','Max Planck','Enrico Fermi','Richard Feynman',
  'Alan Turing','Charles Babbage','Tim Berners-Lee','Robert Boyle','Antoine Lavoisier','Dmitri Mendeleev','Blaise Pascal',
  'Gottfried Wilhelm Leibniz','Leonhard Euler','Carl Friedrich Gauss','Johannes Kepler','Nicolaus Copernicus','Tycho Brahe',
  'Edwin Hubble','Stephen Hawking','Rosalind Franklin','James Watson','Francis Crick','Jonas Salk','Alexander Graham Bell',
  'Wright brothers','Henry Ford','Guglielmo Marconi','Alfred Nobel','Rudolf Diesel','Grace Hopper','John von Neumann',
  'J. Robert Oppenheimer','Carl Sagan','Jane Goodall','Rachel Carson','Barbara McClintock','Lise Meitner','Emmy Noether',
  'Benjamin Franklin','Archimedes','Euclid','Pythagoras','Hippocrates','Florence Nightingale','Nikolaus Otto',
  'Leonardo da Vinci','Michelangelo','Raphael|Raphael','Vincent van Gogh','Pablo Picasso','Claude Monet','Rembrandt',
  'Johannes Vermeer','Salvador Dalí','Henri Matisse','Sandro Botticelli','Titian','Caravaggio','Jackson Pollock',
  'Georgia O’Keeffe|Georgia_O%27Keeffe','Edvard Munch','Gustav Klimt','Auguste Rodin','Andy Warhol',
  'Ludwig van Beethoven','Wolfgang Amadeus Mozart','Johann Sebastian Bach','Franz Schubert','Frédéric Chopin',
  'Pyotr Ilyich Tchaikovsky','Antonio Vivaldi','Richard Wagner','Johannes Brahms','George Frideric Handel','Igor Stravinsky',
  'Louis Armstrong','Ella Fitzgerald','Elvis Presley',
  'William Shakespeare','Charles Dickens','Jane Austen','Mark Twain','Ernest Hemingway','Leo Tolstoy','Fyodor Dostoevsky',
  'Victor Hugo','Homer','Virgil','Dante Alighieri','Geoffrey Chaucer','Emily Dickinson','Edgar Allan Poe','J. R. R. Tolkien',
  'Agatha Christie','George Orwell','Maya Angelou','Walt Whitman','Oscar Wilde','Miguel de Cervantes',
  'Johann Wolfgang von Goethe','Hans Christian Andersen','Lewis Carroll','Mary Shelley',
  'Abraham Lincoln','George Washington','Thomas Jefferson','Winston Churchill','Napoleon','Julius Caesar','Augustus',
  'Alexander the Great','Elizabeth I','Queen Victoria','Catherine the Great','Peter the Great','Charlemagne',
  'Theodore Roosevelt','Franklin D. Roosevelt','John F. Kennedy','Martin Luther King Jr.','Susan B. Anthony',
  'Joan of Arc','Pericles','Constantine the Great','Louis XIV','Otto von Bismarck','Simón Bolívar',
  'Christopher Columbus','Ferdinand Magellan','Vasco da Gama','James Cook','Roald Amundsen','Ernest Shackleton',
  'Marco Polo','Charles Lindbergh','Neil Armstrong','Yuri Gagarin','Amerigo Vespucci','Francis Drake','Meriwether Lewis',
  'Socrates','Plato','Aristotle','René Descartes','Immanuel Kant','Friedrich Nietzsche','John Locke','Voltaire',
  'Jean-Jacques Rousseau','Karl Marx','Adam Smith','Thomas Aquinas',
];
const OTHER = [
  'Confucius','Laozi','Sun Tzu','Qin Shi Huang','Kublai Khan','Genghis Khan','Cai Lun','Zhang Heng',
  'Cixi|Empress_Dowager_Cixi','Murasaki Shikibu','Tokugawa Ieyasu','Oda Nobunaga','Hokusai','Hiroshige',
  'Emperor Meiji','Hirohito','Mao Zedong','Sun Yat-sen','Chiang Kai-shek','Ho Chi Minh',
  'Gautama Buddha','Ashoka','Akbar','Chandragupta Maurya','Rani Lakshmibai|Lakshmibai',
  'Ibn Sina|Avicenna','Averroes','Omar Khayyam','Rumi','Saladin','Suleiman the Magnificent','Cyrus the Great',
  'Darius the Great','Xerxes I','Hammurabi','Nefertiti','Ramesses II','Tutankhamun','Cleopatra','Hannibal',
  'Shaka|Shaka','Sundiata Keita','Haile Selassie','Kwame Nkrumah','Nelson Mandela','Mahatma Gandhi',
  'Frida Kahlo','Diego Rivera','José de San Martín','Pelé','Atahualpa','Pachacuti','Moctezuma II',
  'Sitting Bull','Geronimo','Sequoyah','Tecumseh','Sacagawea',
];

const ROLE_KEYWORDS = ['physicist','chemist','biologist','astronomer','mathematician','inventor','engineer','physician',
  'naturalist','geologist','botanist','scientist','painter','sculptor','architect','artist','composer','pianist','musician',
  'singer','playwright','novelist','poet','author','writer','philosopher','theologian','historian','explorer','navigator',
  'aviator','admiral','conqueror','general','emperor','empress','pharaoh','queen','king','sultan','monarch','president',
  'statesman','politician','activist','revolutionary','reformer','economist','nurse','saint','footballer','athlete'];
const RE = {}; // role -> emoji
const setE=(ks,e)=>ks.split(' ').forEach(k=>RE[k]=e);
setE('physicist chemist biologist scientist naturalist geologist botanist physician nurse','🔬');
setE('mathematician economist','🔢'); setE('inventor engineer','💡'); setE('astronomer','🔭');
setE('painter sculptor artist','🎨'); setE('architect','🏛️'); setE('composer pianist musician singer','🎼');
setE('playwright novelist poet author writer','✍️'); setE('philosopher theologian','💭'); setE('historian','📚');
setE('explorer navigator','🧭'); setE('aviator','✈️'); setE('admiral','⚓'); setE('conqueror general','⚔️');
setE('emperor empress pharaoh queen king sultan monarch','👑'); setE('president statesman politician','🏛️');
setE('activist revolutionary reformer','✊'); setE('saint','😇'); setE('footballer athlete','⚽');
const findRole = txt => { const l=txt.toLowerCase(); for(const k of ROLE_KEYWORDS){ if(new RegExp('\\b'+k+'\\b').test(l)) return k; } return null; };

async function fetchPerson(entry, region){
  const [name, wikiOverride] = entry.split('|');
  const wiki = wikiOverride || name.replace(/ /g,'_');
  const j = await get('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(wiki), true);
  if(!j || !j.extract || j.extract.length < 80 || j.type==='disambiguation') return null;
  let img=null;
  const src = j.thumbnail && j.thumbnail.source;
  if(src){
    const ext=(src.match(/\.(jpg|jpeg|png)/i)||['','jpg'])[1].toLowerCase();
    const file=slug(name)+'.'+ext;
    if(fs.existsSync(IMGDIR+'/'+file)) img=file;
    else { const buf=await get(src,false); if(buf){ fs.writeFileSync(IMGDIR+'/'+file, buf); img=file; } }
  }
  const text = j.extract.replace(/\s+/g,' ').trim();
  return { name, slug:slug(name), region, text, img, role:findRole(text) };
}

(async ()=>{
  fs.mkdirSync(IMGDIR, {recursive:true});
  let got=0;
  for(const fig of FIGURES){
    fig.slug = slug(fig.name);
    fig.img = await fetchImage(fig);
    if(fig.img) got++;
    process.stdout.write(fig.img?'✓':'✗');
    await new Promise(r=>setTimeout(r,120));
  }
  console.log('\nportraits downloaded:', got, '/', FIGURES.length);

  // ---- build the big auto reading set from Wikipedia ----
  const rand=a=>a[Math.floor(Math.random()*a.length)];
  const shuf=a=>{const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
  const samp=(a,n)=>shuf(a).slice(0,n);
  const list = WEST.map(e=>[e,'W']).concat(OTHER.map(e=>[e,'O']));
  const items=[]; let ok=0, fail=0;
  process.stdout.write('reading: ');
  for(const [entry,region] of list){
    const it = await fetchPerson(entry, region);
    if(it){ items.push(it); ok++; process.stdout.write('.'); }
    else { fail++; process.stdout.write('x'); }
    await sleep(90);
  }
  console.log('\nreading passages fetched:', ok, ' (failed:', fail, ')');

  const pool = items.map(i=>({name:i.name, role:i.role}));
  const artA = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ');
  const desc = p => 'The life and work of '+p.name+(p.role?', '+artA(p.role)+p.role:'')+'.';
  const autoPassages = items.map(it=>{
    const qs=[];
    // Q1 — main idea
    const others = samp(pool.filter(p=>p.name!==it.name), 3);
    const choiceObjs = shuf([{d:desc({name:it.name,role:it.role}),ok:true}, ...others.map(o=>({d:desc(o),ok:false}))]);
    qs.push({ q:'What is this passage mostly about?', choices:choiceObjs.map(c=>c.d),
      answer:choiceObjs.findIndex(c=>c.ok), explain:'The whole passage is about '+it.name+'.' });
    // Q2 — role detail straight from the text
    if(it.role){
      const wrong = shuf(ROLE_KEYWORDS.filter(r=> r!==it.role && !new RegExp('\\b'+r+'\\b').test(it.text.toLowerCase()))).slice(0,3);
      const rObjs = shuf([{r:it.role,ok:true}, ...wrong.map(r=>({r,ok:false}))]);
      qs.push({ q:'According to the passage, '+it.name+' is best described as a(n) —', choices:rObjs.map(o=>o.r),
        answer:rObjs.findIndex(o=>o.ok), explain:'The passage calls '+it.name+' a '+it.role+'.' });
    }
    return { slug:it.slug, emoji:RE[it.role]||'📜', img:it.img, region:it.region, title:it.name, text:it.text, questions:qs };
  });

  const PASSAGES = AUTHORED.concat(autoPassages);
  const wCount = autoPassages.filter(p=>p.region==='W').length;

  const clean = FIGURES.map(f=>({ name:f.name, slug:f.slug, country:f.country, flag:f.flag, era:f.era, eraLabel:f.eraLabel,
    role:f.role, emoji:f.emoji, img:f.img, facts:f.facts, quote:f.quote||null, bio:f.bio }));
  const out = `// MASTER HISTORY LIBRARY — figures, quotes, bios, and reading passages for the 3 games.
// Portraits in img/ are Wikipedia thumbnails (mostly public-domain historical images).
// Most reading passages are auto-built from Wikipedia summaries; questions are drawn
// straight from the passage text so answers are always supported.
window.HIST = {
  FIGURES: ${JSON.stringify(clean, null, 0)},
  PASSAGES: ${JSON.stringify(PASSAGES, null, 0)}
};
`;
  fs.writeFileSync(OUT+'/library.js', out);
  console.log('wrote library.js —', clean.length, 'figures,', PASSAGES.length, 'passages ('+
    Math.round(wCount/autoPassages.length*100)+'% Western in auto set),', clean.filter(f=>f.quote).length, 'quotes');
})();
