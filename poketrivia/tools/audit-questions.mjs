// Question-quality audit: every way a question has actually gone wrong so far,
// as a lint. Run: node tools/audit-questions.mjs [--full]
//
//   --full also prints every question compactly (for a human read-through),
//   grouped by source, to stdout.
//
// Exit code 1 if any hard flag fires, so it can gate the importer.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
globalThis.window = globalThis;
for (const f of ['data/questions.js', 'data/signs.js']) {
  new Function(readFileSync(join(root, f), 'utf8'))();
}

const FULL = process.argv.includes('--full');
// Strip tags the way HTML5 actually parses them: a tag starts only with a
// letter, '/', '!' or '?'. "acute (< 90°)" is literal text, not markup.
const strip = (h) => String(h ?? '').replace(/<[a-zA-Z\/!?][^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
// Preserve unit-ish marks (² ³ ° %) — "54 m²" vs "54 m" is a deliberate
// wrong-units distractor, not a duplicate.
const norm = (s) => strip(s).toLowerCase().replace(/[^a-z0-9²³°% ]/g, '').trim();
const stemMatch = (hay, word) => hay.split(' ').some(w => w.startsWith(word) || word.startsWith(w));
// Reviewed by hand and fine as-is (inherent to the question form).
const ALLOW = new Set([
  'nutrition:7bb01ef3',        // "water bottle" — band-A vocabulary, intended
  'grammar:2ab10031',          // its/it's classified as wrong-word; reveal teaches apostrophes too
  'geography:b514209e',        // South Africa is in Africa — the name IS the lesson
  'capital:4021aca4', 'capital:b80ed634',   // Indianapolis→Indiana etc: inherent
  'sign:hist-2', 'sign:gram-1', 'sign:f-gram-2', 'sign:f-shore-4',   // sign teaches the CONCEPT, question applies it
]);

const flags = [];   // { id, level: 'hard'|'soft', why, q }
const flag = (q, level, why) => flags.push({ id: q.id, level, why, q });

const all = [
  ...window.QBANK.questions,
  ...[...(window.SIGNS ?? []), ...(window.SIGN_FACTS ?? [])].map(s => ({
    id: 'sign:' + s.id, subject: s.subject, band: s.band, diff: s.diff,
    q: s.q, choices: s.choices, reveal: s.reveal, _fact: s.fact,
  })),
];

/* ---------------- per-question lints ---------------- */

for (const q of all) {
  const prompt = strip(q.q);
  const answer = q.choices.find(c => c.ok);
  const texts = q.choices.map(c => strip(c.html));

  /* --- structural --- */
  if (!answer) flag(q, 'hard', 'no correct answer');
  if (texts.some(t => !t)) flag(q, 'hard', 'empty choice');
  if (new Set(texts.map(norm)).size !== texts.length) flag(q, 'hard', 'duplicate choices');
  const junk = /\b(undefined|NaN|\[object Object\])\b|null,/;
  if (junk.test(prompt) || texts.some(t => junk.test(t)) || junk.test(strip(q.reveal)))
    flag(q, 'hard', 'leaked programming junk');
  if (/Ã.|â€™|â€œ|â€|&amp;amp;/.test(q.q + q.reveal)) flag(q, 'hard', 'encoding artifact');

  /* --- the answer gives itself away --- */
  if (answer && !ALLOW.has(q.id)) {
    const a = norm(answer.html);
    const p = norm(prompt);
    // Skip either/or prompts that ENUMERATE the options ("sharks or dinosaurs?")
    const enumerated = q.choices.filter(c => {
      const t = norm(c.html).replace(/^(a|an|the) /, '');
      return t.length > 3 && p.includes(t);
    }).length >= 2;
    // Skip find-the-clue questions where the answer is quoted problem text
    // Clue-hunting questions ("Which words are the best clue…?") quote a problem
    // and ask you to find words IN it — the answer being in the prompt is the point.
    const answerIsClue = /which (words?|phrase)\b|\bclue\b|\bcircle\b/i.test(prompt);
    if (a.length > 3 && p.includes(a) && !q.long && !enumerated && !answerIsClue)
      flag(q, 'soft', `prompt contains the answer ("${strip(answer.html)}")`);
  }

  /* --- context that is not on screen --- */
  const bare = prompt.replace(/["“'‘][^"”'’]*["”'’]/g, ' ');
  if (!/passageBox|factsLabel/.test(q.q)) {
    if (/\b(this|the) (passage|story|article|label|chart|graph|diagram|map|picture|image|table|excerpt)\b/i.test(bare))
      flag(q, 'hard', 'refers to context that is not shown');
    if (/\b(shown|pictured|above|below|here)\b.*\?/i.test(bare) && /\b(shown|pictured)\b/i.test(bare))
      flag(q, 'soft', 'may refer to something not shown');
    if (/^(what|which|why|how|when|where) (is|are|do|does|did|was|were) (he|she|they|it)\b/i.test(bare))
      flag(q, 'soft', 'starts with a pronoun with no referent');
  }

  /* --- truncation and mangling --- */
  if (/[a-z],?$/.test(prompt) && !/[.?!…—-]$/.test(prompt))
    flag(q, 'soft', 'prompt may be cut off (no ending punctuation)');
  if (/\b(\w{4,}) \1\b/i.test(prompt)) flag(q, 'soft', 'repeated word');
  const quotes = (prompt.match(/["“”]/g) ?? []).length;
  if (quotes % 2 === 1) flag(q, 'soft', 'unbalanced quotes');

  /* --- reveal sanity --- */
  const reveal = strip(q.reveal);
  if (reveal && answer && !ALLOW.has(q.id)) {
    const others = q.choices.filter(c => !c.ok).map(c => norm(c.html)).filter(t => t.length > 6);
    const revealNorm = norm(reveal);
    // match on the answer's leading significant words, articles and asides dropped
    const aCore = norm(answer.html).replace(/^(a|an|the) /, '').split(' ').slice(0, 3)
      .filter(w => w.length > 2);
    const namesAnswer = !aCore.length || aCore.some(w => stemMatch(revealNorm, w));
    const mentionsWrong = others.filter(t => revealNorm.includes(t));
    if (mentionsWrong.length && !namesAnswer)
      flag(q, 'soft', 'reveal discusses a wrong choice but never the right one');
  }

  /* --- sign facts must teach their own answer --- */
  if (q._fact && answer && !ALLOW.has(q.id)) {
    const factNorm = norm(q._fact);
    const aWords = norm(answer.html).split(' ').filter(w => w.length > 3);
    if (aWords.length && !aWords.some(w => stemMatch(factNorm, w)))
      flag(q, 'soft', 'sign fact may not teach its own answer');
  }
}

/* ---------------- cross-question lints ---------------- */

const seenPrompts = new Map();
for (const q of all) {
  if (q.long) continue;
  // raw q, not stripped: shape questions share one prompt but different SVGs
  if (String(q.q).includes('<svg')) continue;   // shape questions differ only in their drawing
  const key = norm(q.q);
  if (!key) continue;
  if (seenPrompts.has(key)) flag(q, 'soft', `same prompt as ${seenPrompts.get(key)}`);
  else seenPrompts.set(key, q.id);
}

/* ---------------- report ---------------- */

const hard = flags.filter(f => f.level === 'hard');
const soft = flags.filter(f => f.level === 'soft');

console.log(`audited ${all.length} questions  ·  ${hard.length} hard flags  ·  ${soft.length} soft flags\n`);
for (const f of [...hard, ...soft]) {
  const a = f.q.choices?.find(c => c.ok);
  console.log(`[${f.level}] ${f.id} — ${f.why}`);
  console.log(`     Q: ${strip(f.q.q).slice(0, 140)}`);
  console.log(`     A: ${f.q.choices?.map(c => (c.ok ? '*' : '') + strip(c.html)).join(' | ').slice(0, 150)}`);
}

if (FULL) {
  console.log('\n================ FULL LISTING ================');
  const bySrc = {};
  for (const q of all) (bySrc[q.id.split(':')[0]] ??= []).push(q);
  for (const [src, list] of Object.entries(bySrc)) {
    console.log(`\n### ${src} (${list.length})`);
    for (const q of list) {
      const a = q.choices.find(c => c.ok);
      console.log(`- ${strip(q.q).slice(0, 130)}\n    => ${strip(a?.html)}  [vs ${q.choices.filter(c => !c.ok).map(c => strip(c.html)).join(' / ').slice(0, 100)}]`);
    }
  }
}

process.exit(hard.length ? 1 : 0);
