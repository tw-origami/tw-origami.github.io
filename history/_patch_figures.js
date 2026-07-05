// Adds pronunciation (non-English names) and quote context to FIGURES in the
// existing history/library.js WITHOUT re-fetching Wikipedia. Rewrites library.js.
'use strict';
const fs=require('fs');
const LIB='/Users/traviswilber/Claude-Projects/math-app/history/library.js';
global.window={}; require(LIB);
const H=window.HIST;

const PRON = {
  'Marie Curie':'muh-REE koo-REE','Nikola Tesla':'NEE-koh-lah TESS-lah','Galileo Galilei':'ga-lih-LAY-oh ga-lih-LAY',
  'Leonardo da Vinci':'lee-oh-NAR-doh dah VIN-chee','Al-Khwarizmi':'al-KWAR-iz-mee','Zheng He':'jung HUH',
  'Ibn Battuta':'IB-un ba-TOO-tah','Mansa Musa':'MAHN-sah MOO-sah','Genghis Khan':'GENG-gis KAHN',
  'Qin Shi Huang':'chin shur HWAHNG','Napoleon Bonaparte':'nuh-POH-lee-un BOH-nuh-part','Frida Kahlo':'FREE-dah KAH-loh',
  'Ludwig van Beethoven':'LOOD-vig van BAY-toh-ven','Confucius':'kun-FYOO-shus','Hokusai':'HOH-koo-sye',
  'Wangari Maathai':'wahn-GAH-ree mah-THY','Sacagawea':'sa-ka-ja-WEE-ah','Mahatma Gandhi':'muh-HAHT-muh GAHN-dee',
  'Cleopatra':'klee-oh-PAT-ruh','Julius Caesar':'JOOL-yus SEE-zer',
};

const QCTX = {
  'Marie Curie':"Curie lived by this idea, calmly studying dangerous radioactive materials at a time when their risks were unknown. Her words urge us to face scary things by learning about them.",
  'Albert Einstein':"Einstein prized creative thinking over memorized facts. His biggest ideas — like imagining riding alongside a beam of light — came from picturing things in his mind.",
  'Isaac Newton':"Newton wrote this in a 1675 letter, humbly admitting his discoveries were built on earlier scientists like Galileo and Kepler. Today the phrase means new ideas grow from older ones.",
  'Leonardo da Vinci':"Da Vinci was endlessly curious, filling thousands of notebook pages with questions about art, water, birds, and the body. He felt learning energizes the mind rather than tiring it.",
  'Nikola Tesla':"Tesla said this after rivals grew richer and more famous. He trusted that his inventions, like AC electricity, would matter more in the future — and today they power the world.",
  'Thomas Edison':"Edison failed thousands of times before perfecting the light bulb. He used this line to remind people that great results take far more hard work than lucky flashes of inspiration.",
  'Galileo Galilei':"Legend says Galileo muttered this about the Earth after the Church forced him to deny that it moves around the Sun. It became a symbol of standing by the truth under pressure.",
  'Amelia Earhart':"Earhart lived for the thrill of flying into the unknown. She meant that bold, difficult goals are worth chasing even when risky — a belief that drove her record-setting flights.",
  'Julius Caesar':"Caesar reportedly sent these three Latin words — 'Veni, vidi, vici' — to the Roman Senate after a lightning-fast victory in 47 BCE. The phrase now describes a quick, complete success.",
  'Nelson Mandela':"Mandela spent 27 years in prison fighting apartheid, then helped peacefully transform South Africa. His words capture how huge, 'impossible' changes can happen through patience.",
  'Mahatma Gandhi':"Gandhi taught that to create a kinder, fairer world you must first live that way yourself. This idea guided his peaceful protests for India's independence. (It's a popular paraphrase of his actual words.)",
  'Martin Luther King Jr.':"King said this while leading the civil rights movement, arguing that hatred can't be beaten with more hatred — only with love and justice. It reflected his belief in nonviolent protest.",
  'Abraham Lincoln':"Lincoln rose from a poor log cabin to the presidency and believed any honest job done well had dignity. The line encourages doing your best no matter your role.",
  'Frida Kahlo':"Kahlo turned her physical pain and personal struggles into bold, dreamlike self-portraits. She meant her art showed her true inner world, not just how things looked outside.",
  'William Shakespeare':"This opens a famous speech in the play Hamlet, where the prince wrestles with life and death. It has become one of the most quoted lines in the English language.",
  'Confucius':"Confucius taught that steady effort matters more than speed. This idea of patient, continuous improvement shaped how millions of people think about learning.",
  'Wangari Maathai':"Maathai inspired ordinary Kenyans to plant tens of millions of trees, one at a time. Her words remind us that small actions by many people can heal the planet.",
};

let pc=0, qc=0;
H.FIGURES.forEach(f=>{ if(PRON[f.name]){ f.pron=PRON[f.name]; pc++; } else f.pron=f.pron||null;
  if(QCTX[f.name]){ f.quoteCtx=QCTX[f.name]; qc++; } else f.quoteCtx=f.quoteCtx||null; });

const out = `// MASTER HISTORY LIBRARY — figures, quotes, bios, and reading passages for the 3 games.
// Portraits in img/ are Wikipedia thumbnails (mostly public-domain historical images).
// Most reading passages are auto-built from Wikipedia summaries; questions are drawn
// straight from the passage text so answers are always supported.
window.HIST = {
  FIGURES: ${JSON.stringify(H.FIGURES, null, 0)},
  PASSAGES: ${JSON.stringify(H.PASSAGES, null, 0)}
};
`;
fs.writeFileSync(LIB, out);
console.log('patched — pronunciations added:', pc, '| quote contexts added:', qc, '| passages kept:', H.PASSAGES.length);
