// Rebuilds the Reading Detective passages with richer kid-level text + structured
// facts (from Wikidata) so the game can ask varied, specific questions and pick 3
// at random each play. Keeps FIGURES and the 6 authored passages. Kid-safe: text is
// templated from neutral facts only (no scraped adult prose).
'use strict';
const fs=require('fs');
const OUT='/Users/traviswilber/Claude-Projects/math-app/history';
const IMGDIR=OUT+'/img';
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const UA='LearnZoneEducationalApp/1.0 (https://tw-origami.github.io; traviswilber@gmail.com)';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function J(url){ for(let a=0;a<4;a++){ try{ const r=await fetch(url,{headers:{'User-Agent':UA,'accept':'application/json'}}); if(r.status===429){await sleep(1500*(a+1));continue;} if(!r.ok)return null; return await r.json(); }catch(e){ await sleep(600);} } return null; }
async function BIN(url){ for(let a=0;a<4;a++){ try{ const r=await fetch(url,{headers:{'User-Agent':UA}}); if(r.status===429){await sleep(1500*(a+1));continue;} if(!r.ok)return null; return Buffer.from(await r.arrayBuffer()); }catch(e){ await sleep(600);} } return null; }

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

// ordered by "most recognizable identity first" so polymaths get their famous role
const ROLE_KEYWORDS=['pharaoh','emperor','empress','queen','king','sultan','monarch','president',
  'painter','sculptor','composer','pianist','playwright','architect',
  'explorer','navigator','aviator','admiral',
  'physicist','astronomer','mathematician','chemist','inventor','naturalist','biologist','geologist','botanist','physician','nurse','economist','engineer',
  'philosopher','poet','novelist','author','writer','theologian','historian',
  'general','conqueror','activist','revolutionary','reformer','statesman','politician',
  'scientist','artist','musician','singer','saint','footballer','athlete'];
const RE={}; const setE=(ks,e)=>ks.split(' ').forEach(k=>RE[k]=e);
setE('physicist chemist biologist scientist naturalist geologist botanist physician nurse','🔬');
setE('mathematician economist','🔢'); setE('inventor engineer','💡'); setE('astronomer','🔭');
setE('painter sculptor artist','🎨'); setE('architect','🏛️'); setE('composer pianist musician singer','🎼');
setE('playwright novelist poet author writer','✍️'); setE('philosopher theologian','💭'); setE('historian','📚');
setE('explorer navigator','🧭'); setE('aviator','✈️'); setE('admiral','⚓'); setE('conqueror general','⚔️');
setE('emperor empress pharaoh queen king sultan monarch','👑'); setE('president statesman politician','🏛️');
setE('activist revolutionary reformer','✊'); setE('saint','😇'); setE('footballer athlete','⚽');
const findRole=t=>{const l=t.toLowerCase(); for(const k of ROLE_KEYWORDS){ if(new RegExp('\\b'+k+'\\b').test(l)) return k; } return null;};

const parseYear=t=>{ if(!t) return null; const m=t.match(/^([+-])(\d+)/); if(!m) return null; const y=parseInt(m[2],10); return m[1]==='-'?-y:y; };
function eraLabel(y){ if(y==null) return null;
  if(y<0) return 'in ancient times, before the year 1'; if(y<1000) return 'over a thousand years ago';
  if(y<1500) return 'in the Middle Ages'; if(y<1700) return 'in the 1500s and 1600s'; if(y<1800) return 'in the 1700s';
  if(y<1900) return 'in the 1800s'; if(y<2000) return 'in the 1900s'; return 'in the 2000s'; }
const artA=w=>(/^[aeiou]/i.test(w)?'an ':'a ');

// ---- batched fetch helpers ----
async function qidsFor(titles){
  const map={};
  for(let i=0;i<titles.length;i+=40){
    const batch=titles.slice(i,i+40);
    const d=await J('https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&format=json&formatversion=2&titles='+batch.map(encodeURIComponent).join('|'));
    if(d&&d.query){ const norm={}; (d.query.normalized||[]).forEach(n=>norm[n.to]=n.from); (d.query.redirects||[]).forEach(r=>norm[r.to]=r.from);
      d.query.pages.forEach(p=>{ const q=p.pageprops&&p.pageprops.wikibase_item; if(q) map[p.title]=q; }); }
    await sleep(120);
  }
  return map;
}
async function entitiesFor(ids){
  const out={};
  for(let i=0;i<ids.length;i+=30){
    const batch=ids.slice(i,i+30);
    const d=await J('https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json&ids='+batch.join('|'));
    if(d&&d.entities) Object.assign(out,d.entities);
    await sleep(120);
  }
  return out;
}
async function labelsFor(ids){
  const out={};
  ids=[...new Set(ids)];
  for(let i=0;i<ids.length;i+=45){
    const batch=ids.slice(i,i+45);
    const d=await J('https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&languages=en&format=json&ids='+batch.join('|'));
    if(d&&d.entities) for(const q in d.entities){ const l=d.entities[q].labels&&d.entities[q].labels.en; if(l) out[q]=l.value; }
    await sleep(120);
  }
  return out;
}
const claimId=(c,p)=>{ const a=c&&c[p]; if(!a) return null; for(const s of a){ const v=s.mainsnak.datavalue&&s.mainsnak.datavalue.value; if(v&&v.id) return v.id; } return null; };
const claimTime=(c,p)=>{ const a=c&&c[p]; if(!a) return null; for(const s of a){ const v=s.mainsnak.datavalue&&s.mainsnak.datavalue.value; if(v&&v.time) return v.time; } return null; };

async function fetchSummary(wiki, name){
  const j=await J('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(wiki));
  if(!j||!j.extract||j.type==='disambiguation') return null;
  let img=null; const src=j.thumbnail&&j.thumbnail.source;
  if(src){ const ext=(src.match(/\.(jpg|jpeg|png)/i)||['','jpg'])[1].toLowerCase(); const file=slug(name)+'.'+ext;
    if(fs.existsSync(IMGDIR+'/'+file)) img=file; else { const b=await BIN(src); if(b){ fs.writeFileSync(IMGDIR+'/'+file,b); img=file; } } }
  return { role:findRole(j.extract), img };
}

(async ()=>{
  const list=WEST.map(e=>[e,'W']).concat(OTHER.map(e=>[e,'O']));
  // pass 1: summaries (role + image) + resolve wiki title
  const people=[];
  process.stdout.write('summaries: ');
  for(const [entry,region] of list){
    const [name,ov]=entry.split('|'); const wiki=ov||name.replace(/ /g,'_');
    const s=await fetchSummary(wiki,name);
    if(s){ people.push({name,wiki,region,role:s.role,img:s.img}); process.stdout.write('.'); } else process.stdout.write('x');
    await sleep(70);
  }
  console.log('\n'+people.length+' summaries');

  // pass 2: qids
  const qmap=await qidsFor(people.map(p=>p.wiki.replace(/_/g,' ')));
  // also try exact title variants
  people.forEach(p=>{ p.qid=qmap[p.wiki.replace(/_/g,' ')]||qmap[p.name]||null; });
  const qids=people.filter(p=>p.qid).map(p=>p.qid);
  console.log('qids resolved:', qids.length,'/',people.length);

  // pass 3: entities (claims)
  const ents=await entitiesFor(qids);
  const refIds=[];
  people.forEach(p=>{ const e=p.qid&&ents[p.qid]; if(!e){ p.facts={}; return; } const c=e.claims;
    p.raw={ country:claimId(c,'P27'), birthplace:claimId(c,'P19'), spouse:claimId(c,'P26'),
      work:claimId(c,'P800'), gender:claimId(c,'P21'), birth:parseYear(claimTime(c,'P569')), death:parseYear(claimTime(c,'P570')) };
    ['country','birthplace','spouse','work'].forEach(k=>{ if(p.raw[k]) refIds.push(p.raw[k]); });
  });

  // pass 4: labels
  const labels=await labelsFor(refIds);
  const lab=id=>id&&labels[id]||null;

  // build facts + templated passage
  const genderP=g=> g==='Q6581072'?{s:'She',o:'her',p:'she'} : g==='Q6581097'?{s:'He',o:'his',p:'he'} : {s:'They',o:'their',p:'they'};
  const auto=[];
  people.forEach(p=>{
    const r=p.raw||{};
    const field=p.role; const country=lab(r.country); const birthplace=lab(r.birthplace);
    const spouse=lab(r.spouse); let work=lab(r.work); let bp=birthplace; const g=genderP(r.gender); const birth=r.birth, death=r.death;
    if(work && (work.length>34 || /[:(]/.test(work))) work=null; // drop long/technical titles — keep kid-friendly
    if(bp && (!/^[A-Z]/.test(bp) || bp.length>24 || / of /.test(bp))) bp=null; // only clean place names
    const era=eraLabel(birth);
    const facts={ field:field||null, country, birthplace:bp, spouse, work, birthYear:birth, era };
    // ELI10 passage — only sentences for facts we have; each fact is stated so questions are answerable
    const S=[];
    S.push(p.name+' was '+(field?artA(field)+field:'an important person from history')+'.');
    if(country) S.push(g.s+' was from '+country+'.');
    if(bp) S.push(g.s+' was born in '+bp+'.');
    if(era) S.push(g.s+' lived '+era+'.');
    if(work) S.push('One thing '+g.p+' is famous for is '+work+'.');
    if(spouse) S.push(g.s+' was married to '+spouse+'.');
    S.push('Today, people all over the world still learn about '+p.name+'.');
    auto.push({ slug:slug(p.name), region:p.region, emoji:RE[field]||'📜', img:p.img, title:p.name,
      text:S.join(' '), facts, gender:(r.gender==='Q6581072'?'f':r.gender==='Q6581097'?'m':'n') });
  });

  // keep FIGURES + the 6 authored passages from the existing library
  global.window={}; require(OUT+'/library.js');
  const H=window.HIST;
  const AUTH_SLUGS=new Set(['marie_curie','mansa_musa','katherine_johnson','zheng_he','wangari_maathai','galileo_galilei']);
  const authored=H.PASSAGES.filter(p=>AUTH_SLUGS.has(p.slug)&&p.questions);
  const PASSAGES=authored.concat(auto);

  const out=`// MASTER HISTORY LIBRARY — figures, quotes, bios, and reading passages for the 3 games.
// Portraits in img/ are Wikipedia thumbnails (mostly public-domain historical images).
// Auto reading passages are templated from neutral Wikidata facts (kid-safe); the game
// picks 3 questions at random from each passage's facts, so repeats differ.
window.HIST = {
  FIGURES: ${JSON.stringify(H.FIGURES,null,0)},
  PASSAGES: ${JSON.stringify(PASSAGES,null,0)}
};
`;
  fs.writeFileSync(OUT+'/library.js',out);
  const wc=auto.filter(p=>p.region==='W').length;
  const factCov=k=>auto.filter(p=>p.facts[k]).length;
  console.log('wrote library.js — passages:', PASSAGES.length, '(authored '+authored.length+' + auto '+auto.length+'),',
    Math.round(wc/auto.length*100)+'% West');
  console.log('fact coverage — country:'+factCov('country'),'birthplace:'+factCov('birthplace'),'work:'+factCov('work'),'spouse:'+factCov('spouse'),'era:'+factCov('era'),'field:'+factCov('field'));
})();
