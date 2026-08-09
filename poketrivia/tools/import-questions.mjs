// Harvest the Learn Zone's question banks into data/questions.js.
// Run: node tools/import-questions.mjs [--dry] [--report]
//
// The banks are plain <script> files that set one global each. We load them the
// way .distractor-check.js does — a Proxy that absorbs every DOM call — then walk
// the resulting globals for anything MCQ-shaped and normalise it.
//
// Emitted contract (identical to what js/quiz.js consumes):
//   { id, subject, band, diff, q, choices: [{html, ok}], reveal }
//
// Ids are content hashes, so re-running produces the SAME ids and a profile's
// missed-question list and question bag survive a re-import.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEARN_ZONE = resolve(ROOT, '..', 'math-app');
const DRY = process.argv.includes('--dry');
const REPORT = process.argv.includes('--report');

/* ============================ source table ============================ */
// subject: which island zone asks it. band: 'A' ≈ grades 3-4, 'B' ≈ grades 5-6+.
// diff: the default difficulty; per-question heuristics can nudge it.

const SOURCES = [
  { dir: 'civics',          subject: 'history', band: 'B', diff: 'medium' },
  { dir: 'history',         subject: 'history', band: 'B', diff: 'medium' },
  { dir: 'science',         subject: 'science', band: 'B', diff: 'medium' },
  { dir: 'bio',             subject: 'science', band: 'B', diff: 'hard' },
  { dir: 'chem',            subject: 'science', band: 'B', diff: 'hard' },
  { dir: 'physics',         subject: 'science', band: 'B', diff: 'hard' },
  { dir: 'nutrition',       subject: 'science', band: 'A', diff: 'easy' },
  { dir: 'grammar',         subject: 'grammar', band: 'B', diff: 'medium' },
  { dir: 'english',         subject: 'grammar', band: 'B', diff: 'hard' },
  { dir: 'vocab',           subject: 'grammar', band: 'B', diff: 'medium' },
  { dir: 'readingrescue',   subject: 'grammar', band: 'A', diff: 'easy' },
  { dir: 'geography',       subject: 'general', band: 'A', diff: 'medium' },
  { dir: 'testtactics',     subject: 'general', band: 'A', diff: 'easy' },
  { dir: 'factcheck',       subject: 'general', band: 'B', diff: 'medium' },
  { dir: 'debate',          subject: 'general', band: 'B', diff: 'hard' },
  { dir: 'cars',            subject: 'general', band: 'B', diff: 'medium' },
  { dir: 'geometry',        subject: 'math',    band: 'B', diff: 'hard' },
  { dir: 'fractionkitchen', subject: 'math',    band: 'A', diff: 'medium' },
];

/* ============================ sandbox ============================ */

function sandbox(dir) {
  const win = {};
  const sink = new Proxy(function () {}, {
    get: () => sink, apply: () => sink, set: () => true, has: () => true,
  });
  const doc = new Proxy({}, { get: () => () => sink });
  const files = readdirSync(dir).filter(f => f.endsWith('.js') && !f.startsWith('_'));
  for (const f of files) {
    try {
      new Function('window', 'document', 'self', 'globalThis', 'navigator', 'location', 'console',
        readFileSync(join(dir, f), 'utf8'))(win, doc, win, win, sink, sink,
        { log() {}, warn() {}, error() {} });
    } catch { /* a bank that needs the real DOM just contributes nothing */ }
  }
  return win;
}

/* ============================ extraction ============================ */

const PROMPT_KEYS = ['q', 'question', 'prompt', 'ask', 'text', 'stem', 'clue', 'headline'];
const CHOICE_KEYS = ['choices', 'options', 'answers', 'opts', 'alternatives'];
const ANSWER_KEYS = ['answer', 'correct', 'correctIndex', 'correctAnswer', 'ans',
  'solutionIndex', 'right', 'best', 'a'];
const WRONG_KEYS = ['distractors', 'wrong', 'decoys', 'others'];
const WHY_KEYS = ['explain', 'why', 'reveal', 'coach', 'note', 'teach', 'because', 'reason', 'explanation'];
const KID_KEYS = ['eli5', 'simple', 'kid'];

const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isStrArr = (v) => Array.isArray(v) && v.length >= 2 && v.every(isStr);

const clean = (s) => String(s)
  .replace(/\s+/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .trim();

function firstOf(obj, keys) {
  for (const k of keys) if (isStr(obj[k])) return clean(obj[k]);
  return null;
}

/**
 * A "context container" is an object that owns a `questions` array AND carries
 * content of its own — a reading passage, a nutrition label. Its questions are
 * meaningless without the parent ("How many servings are in the whole box?"),
 * so the generic harvester must not touch them; the builders below re-emit them
 * WITH their context attached.
 *
 * This is a structural test rather than a text-pattern one on purpose. Guessing
 * from wording both missed real cases and flagged innocent ones — "Why does
 * serving on a jury matter?" is a perfectly good question.
 */
function isContextContainer(node) {
  if (!Array.isArray(node.questions) || node.questions.length === 0) return false;
  return Object.keys(node).filter(k => k !== 'questions').length >= 2;
}

/** Pull an MCQ out of one object, or return null if it isn't one. */
function asQuestion(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return null;

  let prompt = firstOf(o, PROMPT_KEYS);
  // testtactics splits scenario + question; a scenario alone isn't a prompt
  if (o.scenario && o.question) prompt = clean(o.scenario) + ' ' + clean(o.question);
  if (!prompt || prompt.length < 12) return null;

  let choices = null;

  // shape C: options are objects carrying their own correct flag
  //   [{t: '…', best: true}, {t: '…', best: false}]
  const ok = CHOICE_KEYS.find(k => Array.isArray(o[k]) && o[k].length >= 2 &&
    o[k].every(x => x && typeof x === 'object' &&
      isStr(x.t ?? x.text ?? x.label ?? x.html)));
  if (ok) {
    const list = o[ok];
    if (list.some(x => x.best ?? x.ok ?? x.correct ?? x.good)) {
      choices = list.map(x => {
        const html = clean(x.t ?? x.text ?? x.label ?? x.html);
        return (x.best ?? x.ok ?? x.correct ?? x.good) ? { html, ok: true } : { html };
      });
    }
  }

  // shape A: choices[] + an answer index (or the answer's own text)
  const ck = !choices && CHOICE_KEYS.find(k => isStrArr(o[k]));
  if (ck) {
    const list = o[ck].map(clean);
    let idx = null;
    for (const k of ANSWER_KEYS) {
      if (typeof o[k] === 'number' && o[k] >= 0 && o[k] < list.length) { idx = o[k]; break; }
      if (isStr(o[k])) {
        const at = list.indexOf(clean(o[k]));
        if (at >= 0) { idx = at; break; }
      }
    }
    if (idx === null) return null;
    choices = list.map((html, i) => (i === idx ? { html, ok: true } : { html }));
  }

  // shape B: a correct answer plus a distractor list
  if (!choices) {
    const wk = WRONG_KEYS.find(k => Array.isArray(o[k]) && o[k].length >= 2 && o[k].every(isStr));
    const correct = ANSWER_KEYS.map(k => o[k]).find(isStr);
    if (wk && correct) {
      choices = [{ html: clean(correct), ok: true }, ...o[wk].map(d => ({ html: clean(d) }))];
    }
  }

  // Two options is fine for a "which one is correct?" pick — that's a real
  // question type, not a broken one.
  if (!choices || choices.length < 2) return null;
  choices = choices.filter(c => c && isStr(c.html));
  // Some banks store multi-select ("tick every healthy option"). Those cannot be
  // rendered as single-choice without silently marking correct answers wrong.
  if (choices.filter(c => c.ok).length !== 1) return null;
  if (choices.length > 5) choices = [choices.find(c => c.ok), ...choices.filter(c => !c.ok).slice(0, 3)];
  if (new Set(choices.map(c => c.html.toLowerCase())).size !== choices.length) return null;
  if (choices.some(c => c.html.length > 150)) return null;

  const why = firstOf(o, WHY_KEYS);
  const kid = firstOf(o, KID_KEYS);
  const reveal = [why, kid && `<b>Put simply:</b> ${kid}`].filter(Boolean).join(' ');

  return { q: prompt, choices, reveal };
}

/** Walk anything and collect every MCQ inside it. */
function harvest(node, seen, out, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 8 || seen.has(node)) return;
  seen.add(node);
  if (Array.isArray(node)) {
    for (const x of node) harvest(x, seen, out, depth + 1);
    return;
  }
  const q = asQuestion(node);
  if (q) out.push(q);

  // Skip the questions of a context container — a builder re-emits them with
  // the passage or label they depend on.
  const container = isContextContainer(node);
  for (const k of Object.keys(node)) {
    if (container && k === 'questions') continue;
    try { harvest(node[k], seen, out, depth + 1); } catch { /* getters that throw */ }
  }
}

/* ============================ builders ============================
 * Most Learn Zone banks aren't stored as multiple choice — they're stored as
 * facts to classify ("this sentence, that part of speech"). Those make excellent
 * questions once you draw distractors from the same label set, which is also
 * what keeps the wrong answers plausible instead of obviously silly.            */

/* ---------------- questions that carry their own context ----------------
 * These re-emit a context container's questions with the passage or label
 * rendered inside the prompt, so they can actually be answered. They're tagged
 * `long` so the game can keep them out of the middle of a battle.            */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** One question from a container, handling both {prompt,choices,answer} shapes. */
function fromContainer(qq, contextHtml, extra = {}) {
  const prompt = firstOf(qq, ['prompt', 'q', 'question']);
  const raw = qq.choices ?? qq.options;
  if (!prompt || !Array.isArray(raw) || raw.length < 2) return null;
  const ans = typeof qq.answer === 'number' ? qq.answer
    : typeof qq.correctIndex === 'number' ? qq.correctIndex : 0;
  const choices = raw.map((c, i) => ({ html: clean(isStr(c) ? c : c?.label ?? c?.text ?? ''), ok: i === ans }))
    .filter(c => c.html);
  if (choices.length < 2 || !choices.some(c => c.ok)) return null;
  const why = firstOf(qq, ['explain', 'why', 'reveal', 'note']) || '';
  return { q: contextHtml + `<p class="ctxAsk">${clean(prompt)}</p>`, choices, reveal: why, long: true, ...extra };
}

/** Reading passages — readingrescue stores paragraphs, history a single text. */
function passageQuestions(win) {
  const out = [];

  for (const p of win.READING_RESCUE?.passages ?? []) {
    const paras = (p.paragraphs ?? [])
      .map(par => (Array.isArray(par) ? par.map(s => s.text ?? '').join(' ') : String(par)))
      .filter(Boolean);
    if (!paras.length) continue;
    const html = `<div class="passageBox"><h5>${esc(p.title ?? 'Read this')}</h5>`
      + paras.map(t => `<p>${esc(t)}</p>`).join('') + '</div>';
    for (const qq of p.questions ?? []) {
      const built = fromContainer(qq, html);
      if (built) out.push(built);
    }
  }

  for (const p of win.HIST?.PASSAGES ?? []) {
    if (!isStr(p.text)) continue;
    const html = `<div class="passageBox"><h5>${esc(p.emoji ?? '')} ${esc(p.title ?? 'Read this')}</h5>`
      + String(p.text).split(/\n\n+/).map(t => `<p>${esc(t.trim())}</p>`).join('') + '</div>';
    for (const qq of p.questions ?? []) {
      const built = fromContainer(qq, html);
      if (built) out.push(built);
    }
  }
  return out;
}

/** Nutrition labels — render the facts panel the question is asking about. */
function labelQuestions(win) {
  const out = [];
  for (const L of win.LIB?.LABELS ?? []) {
    if (!isStr(L.name)) continue;
    const rows = [
      ['Serving size', L.servingSize],
      ['Servings per container', L.servingsPerContainer],
      ['Calories', L.calories],
      ['Sugars', L.sugarG != null ? L.sugarG + 'g' : null],
      ['Fibre', L.fiberG != null ? L.fiberG + 'g' : null],
    ].filter(([, v]) => v != null && v !== '');
    const html = `<div class="factsLabel"><h5>${esc(L.emoji ?? '')} ${esc(L.name)}</h5>`
      + rows.map(([k, v]) => `<div class="fRow"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')
      + (Array.isArray(L.ingredients) && L.ingredients.length
        ? `<div class="fIng"><b>Ingredients:</b> ${esc(L.ingredients.join(', '))}</div>` : '')
      + '</div>';
    for (const qq of L.questions ?? []) {
      const built = fromContainer(qq, html);
      if (built) out.push(built);
    }
  }
  return out;
}

/* ---------------- who was that person? ----------------
 * A question can name someone the reader has never heard of. Getting it wrong
 * then teaches nothing at all. The history bank already carries real, kid-level
 * biographies for 77 figures, so any question that names one gets a short
 * "who they were" card appended to its EXPLANATION — the moment it's useful. */

const PEOPLE = new Map();

/** Surnames that are ordinary English words; matching those alone misfires. */
const RISKY_SURNAME = new Set(['king', 'bell', 'ford', 'young', 'green', 'brown', 'black',
  'white', 'small', 'short', 'long', 'best', 'rose', 'stone', 'field', 'moore', 'price']);

function indexPeople(win) {
  const add = (p) => {
    if (!isStr(p?.name) || !isStr(p?.bio) || p.bio.length < 40) return;
    const rec = {
      name: clean(p.name),
      bio: clean(p.bio),
      role: isStr(p.role) ? clean(p.role) : null,
      era: isStr(p.eraLabel) ? clean(p.eraLabel) : null,
      country: isStr(p.country) ? clean(p.country) : null,
      flag: isStr(p.flag) ? p.flag : '',
    };
    if (!PEOPLE.has(rec.name)) PEOPLE.set(rec.name, rec);
  };
  for (const p of win.HIST?.FIGURES ?? []) add(p);
  for (const p of win.HIST?.QUOTES ?? []) add(p);
}

/** The bio card appended to a reveal. */
function bioCard(rec) {
  const line = [rec.role, rec.era, rec.country].filter(Boolean).join(' · ');
  return `<div class="whoBox"><h5>${rec.flag} Who was ${esc(rec.name)}?</h5>`
    + (line ? `<div class="whoMeta">${esc(line)}</div>` : '')
    + `<p>${esc(rec.bio)}</p></div>`;
}

/** Find any indexed person named in a question, and teach them in the reveal. */
function attachPersonBios(q) {
  if (!PEOPLE.size) return q;
  const haystack = q.q + ' ' + q.choices.map(c => c.html).join(' ') + ' ' + (q.reveal ?? '');
  const plain = haystack.replace(/<[^>]+>/g, ' ');
  const found = [];
  for (const [name, rec] of PEOPLE) {
    if (found.length >= 2) break;
    const full = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    let hit = full.test(plain);
    if (!hit) {
      const surname = name.split(/\s+/).pop();
      if (surname.length >= 5 && !RISKY_SURNAME.has(surname.toLowerCase())) {
        hit = new RegExp(`\\b${surname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(plain);
      }
    }
    // don't repeat a bio the reveal already tells
    if (hit && !(q.reveal ?? '').includes('Who was')) found.push(rec);
  }
  if (!found.length) return q;
  return { ...q, reveal: (q.reveal ?? '') + found.map(bioCard).join('') };
}

/** Deterministic shuffle so a re-import produces identical output. */
function seededPick(pool, n, seedStr) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) h = (Math.imul(h, 31) + seedStr.charCodeAt(i)) >>> 0;
  const out = [], used = new Set();
  for (let i = 0; i < n * 6 && out.length < n; i++) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    const idx = h % pool.length;
    if (used.has(idx)) continue;
    used.add(idx);
    out.push(pool[idx]);
  }
  return out;
}

/**
 * "Which X is this?" — text plus a label, distractors from the other labels.
 *
 * `glossary` maps a label to a short definition. When supplied, the reveal
 * defines EVERY option that was on screen, not just the right one. Without it a
 * question like "which kind of persuasion is this?" teaches you that Pathos was
 * correct while leaving Ethos and Logos as meaningless words — which is exactly
 * the failure this game is supposed to avoid.
 */
function classify(items, { text, label, why }, labels, ask, glossary = null, labelChoices = false) {
  const out = [];
  // A technical label a reader has never met is unanswerable on its own, so it
  // can carry its plain-English meaning: "Pathos — feelings". The skill being
  // tested is spotting the appeal, not recalling a Greek word.
  const show = (k) => (labelChoices && glossary?.[k])
    ? `${clean(k)} — ${clean(glossary[k])}` : clean(k);

  for (const it of items) {
    const t = it[text], l = it[label];
    if (!isStr(t) || !isStr(l)) continue;
    const others = labels.filter(x => x !== l);
    if (others.length < 2) continue;
    const wrong = seededPick(others, 3, t + l);
    const shown = [l, ...wrong];

    let reveal = isStr(it[why]) ? clean(it[why]) : `The answer is ${clean(l)}.`;
    if (glossary && !labelChoices) {
      const defs = shown.map(k => glossary[k] ? `<b>${clean(k)}</b> — ${clean(glossary[k])}` : null)
        .filter(Boolean);
      if (defs.length >= 2) reveal += ` <span class="glossary">${defs.join(' · ')}</span>`;
    }
    out.push({
      q: ask(clean(t)),
      choices: [{ html: show(l), ok: true }, ...wrong.map(w => ({ html: show(w) }))],
      reveal,
    });
  }
  return out;
}

/** Build a label → short-definition map from a bank's own term list. */
function glossaryFrom(list, keyField, defFields) {
  const g = {};
  for (const it of list ?? []) {
    const k = it[keyField];
    if (!isStr(k)) continue;
    for (const f of defFields) {
      if (isStr(it[f])) { g[k] = clean(it[f]).slice(0, 120); break; }
    }
  }
  return g;
}

/** "What does X mean?" — a term plus its definition, distractors from other defs. */
function defineTerms(items, { term, def, simple }, subjectPhrase) {
  const defs = items.map(i => i[def]).filter(isStr);
  const out = [];
  for (const it of items) {
    const t = it[term], d = it[def];
    if (!isStr(t) || !isStr(d) || d.length > 130) continue;
    const others = defs.filter(x => x !== d && x.length <= 130);
    if (others.length < 3) continue;
    // "What does X mean?" rather than "what is a X?" — the terms are a mix of
    // singular, plural and phrases, and no single article fits them all.
    out.push({
      q: `${subjectPhrase}, what does <b>${clean(t)}</b> mean?`,
      choices: [{ html: clean(d), ok: true },
        ...seededPick(others, 3, t + d).map(w => ({ html: clean(w) }))],
      reveal: isStr(it[simple]) ? clean(it[simple]) : clean(d),
    });
  }
  return out;
}

/** Per-app builders, keyed by the global path they read. */
const BUILDERS = {
  grammar: (w) => {
    const G = w.GRAMMAR ?? {};
    const posLabels = Object.values(G.POS_LABEL ?? {}).filter(isStr);
    const out = [];
    out.push(...classify(G.POS_ITEMS ?? [], { text: 's', label: 'pos', why: 'why' },
      (G.POS_ITEMS ?? []).map(i => i.pos).filter((v, i, a) => a.indexOf(v) === i),
      (s) => `What part of speech is the starred word? "${s.replace(/\*/g, '')}" ` +
             `(the word is <b>${(s.match(/\*(.+?)\*/) ?? [, '?'])[1]}</b>)`,
      ''));
    out.push(...classify(G.FIX_ITEMS ?? [], { text: 'wrong', label: 'type', why: 'why' },
      (G.FIX_ITEMS ?? []).map(i => i.type).filter((v, i, a) => a.indexOf(v) === i),
      (s) => `What needs fixing in this sentence? "${s}"`));
    out.push(...classify(G.SENT_ITEMS ?? [], { text: 's', label: 'kind', why: 'why' },
      ['sentence', 'fragment', 'run-on'],
      (s) => `Is this a complete sentence, a fragment, or a run-on? "${s}"`));
    for (const it of G.PICK_ITEMS ?? []) {
      if (!isStr(it.s) || !Array.isArray(it.opts) || !isStr(it.a)) continue;
      out.push({
        q: `Which word finishes this sentence correctly? "${clean(it.s)}"`,
        choices: it.opts.map(o => (clean(o) === clean(it.a) ? { html: clean(o), ok: true } : { html: clean(o) })),
        reveal: isStr(it.why) ? clean(it.why) : `"${clean(it.a)}" is the right form here.`,
      });
    }
    return out;
  },

  geography: (w) => {
    const G = w.GEO ?? {};
    const out = [];
    const globe = (G.GLOBE ?? []).filter(c => isStr(c.name));
    const capitals = globe.map(c => c.capital).filter(isStr);
    const continents = [...new Set(globe.map(c => c.continent).filter(isStr))];
    for (const c of globe) {
      if (isStr(c.capital) && capitals.length > 4) {
        out.push({
          q: `What is the capital city of ${clean(c.name)}?`,
          choices: [{ html: clean(c.capital), ok: true },
            ...seededPick(capitals.filter(x => x !== c.capital), 3, c.name).map(x => ({ html: clean(x) }))],
          reveal: `${clean(c.capital)} is the capital of ${clean(c.name)}.` +
            (isStr(c.hint) ? ' ' + clean(c.hint) : ''),
        });
      }
      if (isStr(c.continent) && continents.length > 3) {
        out.push({
          q: `Which continent is ${clean(c.name)} in?`,
          choices: [{ html: clean(c.continent), ok: true },
            ...seededPick(continents.filter(x => x !== c.continent), 3, c.name + 'c').map(x => ({ html: clean(x) }))],
          reveal: `${clean(c.name)} is in ${clean(c.continent)}.` + (isStr(c.hint) ? ' ' + clean(c.hint) : ''),
        });
      }
    }
    const countries = [...new Set((G.ITEMS ?? []).map(i => i.c).filter(isStr))];
    for (const it of G.ITEMS ?? []) {
      if (!isStr(it.name) || !isStr(it.c) || countries.length < 5) continue;
      out.push({
        q: `In which country would you find ${clean(it.name)}?`,
        choices: [{ html: clean(it.c), ok: true },
          ...seededPick(countries.filter(x => x !== it.c), 3, it.name).map(x => ({ html: clean(x) }))],
        reveal: isStr(it.fact) ? clean(it.fact) : `${clean(it.name)} is in ${clean(it.c)}.`,
      });
    }
    return out;
  },

  vocab: (w) => {
    const roots = (w.ROOTS ?? []).filter(r => isStr(r.part) && isStr(r.meaning));
    const meanings = roots.map(r => r.meaning);
    return roots.map((r) => ({
      q: `What does the ${clean(r.type ?? 'word part')} "${clean(r.part)}" mean?`,
      choices: [{ html: clean(r.meaning), ok: true },
        ...seededPick(meanings.filter(m => m !== r.meaning), 3, r.part).map(m => ({ html: clean(m) }))],
      reveal: isStr(r.definition) ? clean(r.definition).slice(0, 260) : clean(r.meaning),
    }));
  },

  geometry: (w) => {
    const G = w.GEO ?? {};
    const out = defineTerms(G.TERMS ?? [], { term: 'term', def: 'def', simple: 'simple' },
      'In geometry');
    for (const s of G.SHAPES ?? []) {
      if (typeof s.ans !== 'number' || !isStr(s.shape)) continue;
      const a = s.ans;
      out.push({
        q: `A ${clean(s.shape)} with ${Object.entries(s.dims ?? {}).map(([k, v]) => `${k} = ${v}`).join(', ')}. ` +
           `What is its ${clean(s.ask ?? 'area')}?`,
        choices: [{ html: `${a} ${clean(s.unit ?? '')}`.trim(), ok: true },
          ...[a * 2, a + 4, Math.round(a / 2)].filter((v, i, arr) => v !== a && v > 0 && arr.indexOf(v) === i)
            .slice(0, 3).map(v => ({ html: `${v} ${clean(s.unit ?? '')}`.trim() }))],
        reveal: isStr(s.formula) ? `Use the formula: ${clean(s.formula)} = ${a}.` : `The answer is ${a}.`,
      });
    }
    for (const p of G.PYTH ?? []) {
      if (!p || typeof p.c !== 'number') continue;
      const ans = p[p.unknown];
      if (typeof ans !== 'number') continue;
      out.push({
        q: `A right triangle has sides a = ${p.a} and b = ${p.b}, with hypotenuse c = ${p.c}. ` +
           `What is side <b>${p.unknown}</b>?`,
        choices: [{ html: String(ans), ok: true },
          ...[ans + 1, ans - 1, ans + 2].filter((v, i, arr) => v !== ans && v > 0 && arr.indexOf(v) === i)
            .slice(0, 3).map(v => ({ html: String(v) }))],
        reveal: `The Pythagorean theorem says a² + b² = c². Here ${p.a}² + ${p.b}² = ${p.c}², ` +
          `because ${p.a * p.a} + ${p.b * p.b} = ${p.c * p.c}.`,
      });
    }
    return out;
  },

  debate: (w) => {
    const D = w.DEBATE ?? {};
    const fallacies = [...new Set((D.SPOT ?? []).map(s => s.fallacy).filter(isStr))];
    const appeals = [...new Set((D.APPEAL_ITEMS ?? []).map(s => s.appeal).filter(isStr))];
    // Ethos / Logos / Pathos mean nothing to a new reader, so every option gets
    // defined in the reveal whichever one they picked.
    const appealGloss = glossaryFrom(D.APPEALS, 'key', ['blurb']);
    const fallacyGloss = glossaryFrom(D.TERMS, 'term', ['simple', 'def']);
    return [
      ...defineTerms(D.TERMS ?? [], { term: 'term', def: 'def', simple: 'simple' },
        'In an argument'),
      ...classify(D.SPOT ?? [], { text: 'text', label: 'fallacy', why: 'why' }, fallacies,
        (s) => `Which thinking mistake is this? ${s}`, fallacyGloss),
      // "Kinds of persuasion" was wrong — Ethos/Logos/Pathos are rhetorical
      // appeals. Plain English asks the same thing without the mislabel.
      ...classify(D.APPEAL_ITEMS ?? [], { text: 'text', label: 'appeal', why: 'why' }, appeals,
        (s) => `How is this trying to persuade you? ${s}`, appealGloss, true),
    ];
  },

  factcheck: (w) => {
    const F = w.FC ?? {};
    const verdicts = [...new Set((F.HEADLINES ?? []).map(h => h.verdict).filter(isStr))];
    return [
      ...defineTerms(F.TERMS ?? [], { term: 'term', def: 'def', simple: 'simple' },
        'When you are checking facts'),
      ...classify(F.HEADLINES ?? [], { text: 'headline', label: 'verdict', why: 'why' }, verdicts,
        (s) => `What's going on with this headline? "${s}"`,
        glossaryFrom(F.TERMS, 'term', ['simple', 'def'])),
    ];
  },

  chem: (w) => defineTerms(w.CHEM?.TERMS ?? [], { term: 'term', def: 'def', simple: 'simple' },
    'In chemistry'),

  english: (w) => {
    const L = w.LIT ?? {};
    const out = defineTerms(L.DEVICES ?? [], { term: 'term', def: 'def', simple: 'simple' },
      'In writing');
    const devices = (L.DEVICES ?? []).map(d => d.term).filter(isStr);
    for (const d of L.DEVICES ?? []) {
      if (!isStr(d.ex) || !isStr(d.term) || devices.length < 5) continue;
      out.push({
        q: `Which literary device is this? ${clean(d.ex)}`,
        choices: [{ html: clean(d.term), ok: true },
          ...seededPick(devices.filter(x => x !== d.term), 3, d.term).map(x => ({ html: clean(x) }))],
        reveal: isStr(d.simple) ? clean(d.simple) : clean(d.def ?? ''),
      });
    }
    return out;
  },

  bio: (w) => defineTerms(w.BIO?.TERMS ?? [], { term: 'term', def: 'def', simple: 'simple' },
    'In biology'),
  physics: (w) => defineTerms(w.PHYS?.TERMS ?? [], { term: 'term', def: 'def', simple: 'simple' },
    'In physics'),
  civics: (w) => defineTerms(w.CIVICS?.TERMS ?? [], { term: 'term', def: 'def', simple: 'simple' },
    'In government'),
};

/* ============================ ids & tagging ============================ */

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

const normalise = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');

/** Longer prompts and longer answers usually mean a harder question. */
function nudgeDifficulty(base, q) {
  const len = q.q.length + q.choices.reduce((n, c) => n + c.html.length, 0);
  if (base === 'medium' && len > 320) return 'hard';
  if (base === 'medium' && len < 110) return 'easy';
  if (base === 'hard' && len < 120) return 'medium';
  return base;
}

/* ============================ generated maths ============================ */
// The Learn Zone's maths is procedural, so there's nothing to import. These are
// authored MCQs with *diagnostic* distractors: each wrong answer is a specific
// mistake (off by one row, added instead of multiplied, forgot to carry), so a
// wrong click tells you which mistake you made rather than just "no".

function mathQuestions() {
  const out = [];
  const add = (band, diff, q, correct, wrongs, reveal) =>
    out.push({ q, choices: [{ html: String(correct), ok: true }, ...wrongs.map(w => ({ html: String(w) }))],
      reveal, subject: 'math', band, diff });

  // Every times-table fact from 2x2 up to 12x12, once each (a ≤ b so 6×7 and
  // 7×6 aren't two separate questions). The distractors are the actual mistakes
  // kids make — one row off, added instead of multiplied — so a wrong click
  // tells you WHICH mistake, and the explanation names it.
  for (let a = 2; a <= 12; a++) {
    for (let b = a; b <= 12; b++) {
      const p = a * b;
      const wrong = [p + a, p - a, p + b, a + b, p - b]
        .filter((v, i, arr) => v !== p && v > 0 && arr.indexOf(v) === i)
        .slice(0, 3);
      // only name a mistake the player could actually have clicked
      const hints = [];
      if (wrong.includes(p + b)) hints.push(`${p + b} is one group too many`);
      if (wrong.includes(p - b)) hints.push(`${p - b} is one group short`);
      if (wrong.includes(a + b)) hints.push(`${a + b} means you added instead of multiplying`);
      add(p <= 50 ? 'A' : 'B', p <= 30 ? 'easy' : p <= 72 ? 'medium' : 'hard',
        `What is ${a} × ${b}?`, p, wrong,
        `${a} × ${b} means ${a} groups of ${b}, which is ${p}.` +
        (hints.length ? ` (${hints.join('; ')}.)` : ''));
    }
  }

  // The matching division facts, phrased as the inverse so the link is obvious.
  for (let d = 2; d <= 12; d++) {
    for (let p = 2; p <= 12; p++) {
      const t = d * p;
      if (t > 108) continue;
      const wrong = [p + 1, p - 1, d, t - d]
        .filter((v, i, arr) => v !== p && v > 0 && arr.indexOf(v) === i)
        .slice(0, 3);
      add(t <= 50 ? 'A' : 'B', t <= 30 ? 'easy' : t <= 72 ? 'medium' : 'hard',
        `What is ${t} ÷ ${d}?`, p, wrong,
        `Ask yourself: ${d} times what makes ${t}? ${d} × ${p} = ${t}, so ${t} ÷ ${d} = ${p}. ` +
        `Division and multiplication are the same fact read backwards.`);
    }
  }

  // multiplication word problems
  const WORDS = [
    ['A trainer has 6 belts holding 4 Poké Balls each. How many Poké Balls?', 6, 4, 'multiply'],
    ['Each Berry bush grows 7 berries. There are 8 bushes. How many berries?', 7, 8, 'multiply'],
    ['A box holds 9 badges. How many badges in 5 boxes?', 9, 5, 'multiply'],
    ['12 trainers each carry 3 potions. How many potions altogether?', 12, 3, 'multiply'],
  ];
  for (const [q, a, b] of WORDS) {
    const p = a * b;
    add(p <= 40 ? 'A' : 'B', 'medium', q, p,
      [a + b, p - a, p + a].filter((v, i, arr) => v !== p && arr.indexOf(v) === i).slice(0, 3),
      `Equal groups means multiply: ${a} × ${b} = ${p}. If you got ${a + b}, you added instead of multiplying.`);
  }

  // division word problems
  const DWORDS = [
    ['48 berries are shared evenly between 6 Pokémon. How many each?', 48, 6],
    ['A trainer splits 35 coins into 5 equal piles. How many per pile?', 35, 5],
    ['72 stickers go into 8 equal packs. How many stickers per pack?', 72, 8],
    ['You have 27 apples and 3 baskets. How many apples per basket?', 27, 3],
  ];
  for (const [q, t, d] of DWORDS) {
    const p = t / d;
    add(t <= 40 ? 'A' : 'B', 'medium', q, p,
      [t - d, p + 1, d].filter((v, i, arr) => v !== p && arr.indexOf(v) === i).slice(0, 3),
      `Sharing evenly means dividing: ${t} ÷ ${d} = ${p}. Subtracting would give ${t - d}, which is a different question.`);
  }

  // fractions, percents, place value
  add('A', 'easy', 'Which fraction is the same as one half?', '2/4', ['1/3', '2/3', '3/4'],
    'Two quarters make one half, because 2 out of 4 equal parts is the same as 1 out of 2.');
  add('A', 'medium', 'Which is bigger: 1/3 or 1/4?', '1/3', ['1/4', 'They are equal', 'You cannot tell'],
    'The bigger the bottom number, the more pieces the whole is cut into — so each piece is smaller. Thirds are bigger than quarters.');
  add('B', 'medium', 'What is 25% of 80?', '20', ['25', '40', '16'],
    '25% is one quarter. 80 ÷ 4 = 20. If you answered 40 you halved it instead.');
  add('B', 'medium', 'What is 3/4 written as a decimal?', '0.75', ['0.34', '0.7', '1.33'],
    '3 ÷ 4 = 0.75. A quarter is 0.25, so three of them is 0.75.');
  add('B', 'hard', 'What is 7 × 8 − 6 × 4?', '32', ['80', '26', '56'],
    'Do the multiplying first: 56 − 24 = 32. Working left to right gives 80, which is the classic order-of-operations trap.');
  add('B', 'hard', 'A shirt costs $40 and is 30% off. What do you pay?', '$28', ['$30', '$12', '$37'],
    '30% of 40 is 12, and 40 − 12 = 28. $12 is the discount, not the price.');
  add('A', 'easy', 'Which number is even?', '14', ['9', '21', '35'],
    'Even numbers end in 0, 2, 4, 6 or 8, and they split into two equal groups.');
  add('A', 'medium', 'What is the value of the 7 in 4,703?', '700', ['7', '70', '7,000'],
    'Reading right to left: 3 ones, 0 tens, 7 hundreds, 4 thousands. So the 7 is worth 700.');
  add('B', 'medium', 'A rectangle is 9 m by 6 m. What is its area?', '54 m²', ['30 m²', '15 m²', '54 m'],
    'Area is length × width: 9 × 6 = 54 square metres. 30 m is the perimeter, which adds the sides instead.');
  add('B', 'hard', 'Which of these is a prime number?', '29', ['21', '27', '33'],
    'A prime has exactly two factors: 1 and itself. 21 = 3 × 7, 27 = 3 × 9, 33 = 3 × 11 — but nothing divides 29.');
  add('A', 'medium', 'What comes next: 4, 8, 12, 16, …?', '20', ['18', '24', '32'],
    'Each step adds 4. These are the multiples of 4, so after 16 comes 20.');
  add('B', 'medium', 'What is the average of 4, 8 and 12?', '8', ['12', '24', '6'],
    'Add them and divide by how many there are: 24 ÷ 3 = 8.');

  return out;
}

/* ============================ authored extras ============================
 * Question types the Learn Zone doesn't cover: shape recognition (drawn as real
 * SVG, not described in words), US state capitals, unit conversions, and the
 * amendments. All authored here so they live in version control next to the
 * importer that emits them.                                                    */

// The quiz panel is dark navy, so shapes are drawn gold with a pale outline.
const svg = (inner, w = 190, h = 150) =>
  `<svg viewBox="0 0 ${w} ${h}" width="190" height="150" role="img" aria-label="shape" ` +
  `style="display:block;margin:12px auto;max-width:100%">` +
  `<g fill="#ffcb05" stroke="#f4f7ff" stroke-width="4" stroke-linejoin="round" ` +
  `stroke-linecap="round">${inner}</g></svg>`;

const poly = (pts) => `<polygon points="${pts}"/>`;
/** Regular n-gon centred in the box, flat-ish side down. */
function regular(n, r = 55, cx = 95, cy = 75, rot = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
  }
  return poly(pts.join(' '));
}

function shapeQuestions() {
  const SHAPES = [
    { name: 'Triangle', art: regular(3, 60), why: 'A triangle has 3 straight sides and 3 corners. Every triangle\'s angles add up to 180°.' },
    { name: 'Square', art: poly('40,20 150,20 150,130 40,130'), why: 'A square has 4 equal sides and 4 right angles. It is a special kind of rectangle.' },
    { name: 'Rectangle', art: poly('20,35 170,35 170,115 20,115'), why: 'A rectangle has 4 right angles, and the opposite sides are equal — but not all four.' },
    { name: 'Pentagon', art: regular(5, 58), why: 'Penta- means five in Greek, so a pentagon has 5 sides.' },
    { name: 'Hexagon', art: regular(6, 58), why: 'Hexa- means six. Honeycomb cells are hexagons because they tile with no gaps.' },
    { name: 'Octagon', art: regular(8, 58), why: 'Octa- means eight — the same root as octopus. Stop signs are octagons.' },
    { name: 'Trapezoid', art: poly('55,35 135,35 170,115 20,115'), why: 'A trapezoid has exactly one pair of parallel sides.' },
    { name: 'Rhombus', art: poly('95,20 165,75 95,130 25,75'), why: 'A rhombus has 4 equal sides like a square, but its corners are not right angles.' },
    { name: 'Parallelogram', art: poly('50,35 175,35 140,115 15,115'), why: 'Both pairs of opposite sides are parallel and equal, but the corners are slanted.' },
    { name: 'Circle', art: '<circle cx="95" cy="75" r="58"/>', why: 'A circle has no sides and no corners — every point on it is the same distance from the centre.' },
    { name: 'Oval', art: '<ellipse cx="95" cy="75" rx="72" ry="45"/>', why: 'An oval (ellipse) is stretched, so it has a long axis and a short one.' },
    { name: 'Right triangle', art: poly('30,125 30,25 160,125'), why: 'One of its angles is exactly 90° — a square corner. That is what makes it "right".' },
    { name: 'Cube', art: poly('40,55 110,55 110,125 40,125') + poly('40,55 70,25 140,25 110,55') + poly('110,55 140,25 140,95 110,125'), why: 'A cube is 3D: 6 square faces, 12 edges and 8 corners.' },
    { name: 'Cylinder', art: '<ellipse cx="95" cy="35" rx="45" ry="16"/><path d="M50 35 L50 115 A45 16 0 0 0 140 115 L140 35"/>', why: 'A cylinder has two circular ends joined by a curved surface — like a can.' },
    { name: 'Cone', art: poly('95,15 145,115 45,115') + '<ellipse cx="95" cy="115" rx="50" ry="16"/>', why: 'A cone has one circular base and rises to a single point.' },
    { name: 'Sphere', art: '<circle cx="95" cy="75" r="58"/><ellipse cx="95" cy="75" rx="58" ry="20" fill="none"/>', why: 'A sphere is perfectly round in every direction — a ball.' },
  ];
  const names = SHAPES.map(s => s.name);
  const out = [];
  for (const s of SHAPES) {
    out.push({
      subject: 'math', band: names.indexOf(s.name) < 12 ? 'A' : 'B',
      diff: ['Triangle', 'Square', 'Circle', 'Rectangle'].includes(s.name) ? 'easy' : 'medium',
      q: `What shape is this?${svg(s.art)}`,
      choices: [{ html: s.name, ok: true },
        ...seededPick(names.filter(n => n !== s.name), 3, s.name).map(n => ({ html: n }))],
      reveal: s.why,
    });
  }

  // side counts, which is a different skill from recognising the picture
  const SIDES = [['Triangle', 3], ['Square', 4], ['Pentagon', 5], ['Hexagon', 6],
    ['Octagon', 8], ['Rectangle', 4], ['Trapezoid', 4]];
  for (const [name, n] of SIDES) {
    out.push({
      subject: 'math', band: 'A', diff: 'easy',
      q: `How many sides does a ${name.toLowerCase()} have?`,
      choices: [{ html: String(n), ok: true },
        ...[n + 1, n - 1, n + 2].filter((v, i, a) => v !== n && v > 2 && a.indexOf(v) === i)
          .slice(0, 3).map(v => ({ html: String(v) }))],
      reveal: `A ${name.toLowerCase()} has ${n} sides and ${n} corners.`,
    });
  }

  // angles
  const ANGLES = [
    ['acute', '<path d="M30 125 L160 125 M30 125 L120 40" fill="none"/>', 'less than 90°'],
    ['right', '<path d="M30 125 L160 125 M30 125 L30 25 M30 105 L50 105 L50 125" fill="none"/>', 'exactly 90°'],
    ['obtuse', '<path d="M30 125 L160 125 M30 125 L0 40" fill="none"/>', 'more than 90° but less than 180°'],
  ];
  for (const [name, art, def] of ANGLES) {
    out.push({
      subject: 'math', band: 'B', diff: 'medium',
      q: `What kind of angle is this?${svg(art)}`,
      choices: [{ html: `${name[0].toUpperCase() + name.slice(1)} angle`, ok: true },
        ...ANGLES.filter(a => a[0] !== name).map(a => ({ html: `${a[0][0].toUpperCase() + a[0].slice(1)} angle` })),
        { html: 'Straight angle' }],
      reveal: `An ${name} angle is ${def}. A straight angle is exactly 180° — a flat line.`,
    });
  }
  return out.map(q => ({ ...q, q: q.q.includes('<svg') ? q.q : q.q }));
}

const STATE_CAPITALS = [
  ['Alabama', 'Montgomery'], ['Alaska', 'Juneau'], ['Arizona', 'Phoenix'], ['Arkansas', 'Little Rock'],
  ['California', 'Sacramento'], ['Colorado', 'Denver'], ['Connecticut', 'Hartford'], ['Delaware', 'Dover'],
  ['Florida', 'Tallahassee'], ['Georgia', 'Atlanta'], ['Hawaii', 'Honolulu'], ['Idaho', 'Boise'],
  ['Illinois', 'Springfield'], ['Indiana', 'Indianapolis'], ['Iowa', 'Des Moines'], ['Kansas', 'Topeka'],
  ['Kentucky', 'Frankfort'], ['Louisiana', 'Baton Rouge'], ['Maine', 'Augusta'], ['Maryland', 'Annapolis'],
  ['Massachusetts', 'Boston'], ['Michigan', 'Lansing'], ['Minnesota', 'Saint Paul'], ['Mississippi', 'Jackson'],
  ['Missouri', 'Jefferson City'], ['Montana', 'Helena'], ['Nebraska', 'Lincoln'], ['Nevada', 'Carson City'],
  ['New Hampshire', 'Concord'], ['New Jersey', 'Trenton'], ['New Mexico', 'Santa Fe'], ['New York', 'Albany'],
  ['North Carolina', 'Raleigh'], ['North Dakota', 'Bismarck'], ['Ohio', 'Columbus'], ['Oklahoma', 'Oklahoma City'],
  ['Oregon', 'Salem'], ['Pennsylvania', 'Harrisburg'], ['Rhode Island', 'Providence'], ['South Carolina', 'Columbia'],
  ['South Dakota', 'Pierre'], ['Tennessee', 'Nashville'], ['Texas', 'Austin'], ['Utah', 'Salt Lake City'],
  ['Vermont', 'Montpelier'], ['Virginia', 'Richmond'], ['Washington', 'Olympia'], ['West Virginia', 'Charleston'],
  ['Wisconsin', 'Madison'], ['Wyoming', 'Cheyenne'],
];

// The biggest city is often NOT the capital — that's the trap worth teaching.
const BIGGEST_CITY = {
  'Alaska': 'Anchorage', 'Arizona': 'Phoenix', 'California': 'Los Angeles', 'Florida': 'Jacksonville',
  'Illinois': 'Chicago', 'Michigan': 'Detroit', 'Missouri': 'Kansas City', 'Nevada': 'Las Vegas',
  'New York': 'New York City', 'Oregon': 'Portland', 'Pennsylvania': 'Philadelphia', 'Texas': 'Houston',
  'Washington': 'Seattle', 'Maryland': 'Baltimore', 'Kentucky': 'Louisville', 'Nebraska': 'Omaha',
};

function capitalQuestions() {
  const caps = STATE_CAPITALS.map(([, c]) => c);
  const states = STATE_CAPITALS.map(([s]) => s);
  const out = [];
  for (const [state, cap] of STATE_CAPITALS) {
    const trap = BIGGEST_CITY[state];
    const wrong = trap
      ? [trap, ...seededPick(caps.filter(c => c !== cap && c !== trap), 2, state)]
      : seededPick(caps.filter(c => c !== cap), 3, state);
    out.push({
      subject: 'general', band: 'B', diff: 'medium',
      q: `What is the capital of <b>${state}</b>?`,
      choices: [{ html: cap, ok: true }, ...wrong.map(c => ({ html: c }))],
      reveal: `${cap} is the capital of ${state}.` +
        (trap ? ` ${trap} is the state's biggest city, but a state's biggest city is often not its capital.` : ''),
    });
    out.push({
      subject: 'general', band: 'B', diff: 'hard',
      q: `<b>${cap}</b> is the capital of which state?`,
      choices: [{ html: state, ok: true },
        ...seededPick(states.filter(s => s !== state), 3, cap).map(s => ({ html: s }))],
      reveal: `${cap} is the capital of ${state}.`,
    });
  }
  return out;
}

function measurementQuestions() {
  const M = [
    ['How many ounces are in a cup?', '8', ['12', '16', '4'], 'A cup is 8 fluid ounces. Two cups make a pint (16 oz).', 'A'],
    ['How many cups are in a pint?', '2', ['4', '8', '3'], 'A pint is 2 cups. The rhyme goes: a pint\'s a pound, the world around.', 'A'],
    ['How many pints are in a quart?', '2', ['4', '8', '3'], 'A quart is 2 pints, or 4 cups. "Quart" comes from quarter — a quarter of a gallon.', 'A'],
    ['How many quarts are in a gallon?', '4', ['2', '8', '16'], 'A gallon is 4 quarts, 8 pints, or 16 cups.', 'A'],
    ['How many cups are in a gallon?', '16', ['8', '12', '32'], '4 quarts × 2 pints × 2 cups = 16 cups in a gallon.', 'B'],
    ['How many ounces are in a pound?', '16', ['12', '8', '20'], 'A pound is 16 ounces. (Weight ounces, not the fluid ounces you measure milk in.)', 'A'],
    ['How many pounds are in a ton?', '2,000', ['1,000', '500', '5,280'], 'A US ton is 2,000 pounds. 5,280 is the number of feet in a mile.', 'B'],
    ['How many inches are in a foot?', '12', ['10', '16', '3'], 'A foot is 12 inches — which is why a ruler is usually 12 inches long.', 'A'],
    ['How many feet are in a yard?', '3', ['12', '5', '36'], 'A yard is 3 feet, or 36 inches. A yard is about one big step.', 'A'],
    ['How many feet are in a mile?', '5,280', ['1,000', '3,280', '2,000'], 'A mile is 5,280 feet, or 1,760 yards. It is an odd number because it came from Roman paces.', 'B'],
    ['How many centimetres are in a metre?', '100', ['10', '1,000', '12'], 'Centi- means one hundredth, so 100 centimetres make a metre.', 'A'],
    ['How many millimetres are in a centimetre?', '10', ['100', '1,000', '12'], 'Milli- means one thousandth. There are 10 millimetres in a centimetre and 1,000 in a metre.', 'A'],
    ['How many metres are in a kilometre?', '1,000', ['100', '10', '5,280'], 'Kilo- means one thousand, so a kilometre is 1,000 metres.', 'A'],
    ['How many grams are in a kilogram?', '1,000', ['100', '10', '16'], 'Kilo- means a thousand — the same prefix as kilometre.', 'A'],
    ['How many millilitres are in a litre?', '1,000', ['100', '10', '500'], 'A litre is 1,000 millilitres. A standard water bottle is about 500 mL — half a litre.', 'A'],
    ['How many seconds are in an hour?', '3,600', ['60', '600', '1,440'], '60 seconds × 60 minutes = 3,600 seconds. (1,440 is the number of minutes in a day.)', 'B'],
    ['How many minutes are in a day?', '1,440', ['720', '3,600', '2,400'], '24 hours × 60 minutes = 1,440 minutes.', 'B'],
    ['How many days are in a leap year?', '366', ['365', '364', '360'], 'A leap year adds February 29th, making 366 days. It happens roughly every 4 years.', 'A'],
    ['How many weeks are in a year?', '52', ['48', '50', '60'], 'A year is about 52 weeks and one extra day, which is why your birthday shifts a weekday each year.', 'A'],
    ['At what temperature does water freeze, in Fahrenheit?', '32°F', ['0°F', '100°F', '212°F'], 'Water freezes at 32°F and boils at 212°F. In Celsius those are 0° and 100°.', 'B'],
    ['At what temperature does water boil, in Celsius?', '100°C', ['0°C', '212°C', '50°C'], 'Water boils at 100°C at sea level — the Celsius scale was built around exactly that.', 'A'],
    ['How many tablespoons are in a cup?', '16', ['8', '12', '4'], '16 tablespoons make a cup; 4 tablespoons make a quarter cup.', 'B'],
    ['How many teaspoons are in a tablespoon?', '3', ['2', '4', '6'], 'A tablespoon is 3 teaspoons. Recipes often use this to scale amounts up and down.', 'A'],
    ['Which unit would you use to measure how much milk is in a jug?', 'Litres', ['Grams', 'Metres', 'Degrees'], 'Volume — how much space a liquid takes up — is measured in litres or in cups, pints and gallons.', 'A'],
    ['Which unit would you use to weigh a backpack?', 'Kilograms', ['Litres', 'Centimetres', 'Seconds'], 'Mass and weight are measured in grams and kilograms, or in ounces and pounds.', 'A'],
  ];
  return M.map(([q, a, wrong, why, band]) => ({
    subject: 'math', band, diff: band === 'A' ? 'easy' : 'medium',
    q, choices: [{ html: a, ok: true }, ...wrong.map(w => ({ html: w }))], reveal: why,
  }));
}

const AMENDMENTS = [
  [1, 'Freedom of speech, religion, press, assembly and petition'],
  [2, 'The right to keep and bear arms'],
  [4, 'Protection from unreasonable searches and seizures'],
  [5, 'The right to remain silent and to due process of law'],
  [6, 'The right to a speedy public trial and a lawyer'],
  [8, 'No cruel and unusual punishment'],
  [13, 'Slavery is abolished'],
  [14, 'Equal protection of the laws for all citizens'],
  [15, 'The right to vote cannot be denied because of race'],
  [19, 'Women get the right to vote'],
  [22, 'A president can only be elected twice'],
  [26, 'The voting age is lowered to 18'],
];

function amendmentQuestions() {
  const texts = AMENDMENTS.map(([, t]) => t);
  const out = [];
  for (const [n, text] of AMENDMENTS) {
    out.push({
      subject: 'history', band: 'B', diff: 'medium',
      q: `What does the <b>${n}${n === 1 ? 'st' : n === 2 ? 'nd' : 'th'} Amendment</b> protect?`,
      choices: [{ html: text, ok: true },
        ...seededPick(texts.filter(t => t !== text), 3, String(n)).map(t => ({ html: t }))],
      reveal: `The ${n}${n === 1 ? 'st' : n === 2 ? 'nd' : 'th'} Amendment covers: ${text}.` +
        (n <= 10 ? ' It is part of the Bill of Rights — the first ten amendments, added in 1791.' : ''),
    });
    out.push({
      subject: 'history', band: 'B', diff: 'hard',
      q: `Which amendment says: "${text}"?`,
      choices: [{ html: `The ${n}${n === 1 ? 'st' : n === 2 ? 'nd' : 'th'} Amendment`, ok: true },
        ...seededPick(AMENDMENTS.filter(([m]) => m !== n), 3, text)
          .map(([m]) => ({ html: `The ${m}${m === 1 ? 'st' : m === 2 ? 'nd' : 'th'} Amendment` }))],
      reveal: `That is the ${n}${n === 1 ? 'st' : n === 2 ? 'nd' : 'th'} Amendment.`,
    });
  }
  // "which of these is really an amendment" — the invented ones are the lesson
  const FAKE = ['The right to a free education through college',
    'The right to own a car at any age',
    'The right to refuse to pay any tax you disagree with',
    'The right to a job chosen by the government'];
  for (const [n, text] of AMENDMENTS.slice(0, 6)) {
    out.push({
      subject: 'history', band: 'A', diff: 'medium',
      q: 'Which of these is really protected by an amendment to the U.S. Constitution?',
      choices: [{ html: text, ok: true }, ...seededPick(FAKE, 3, text).map(f => ({ html: f }))],
      reveal: `Yes — that is the ${n}${n === 1 ? 'st' : n === 2 ? 'nd' : 'th'} Amendment. ` +
        'The others sound reasonable, but no amendment says them. Always check the actual text.',
    });
  }
  return out;
}

/* ============================ graphic novels ============================
 * Books these readers actually own. Facts about a book — who made it, who is in
 * it, what happens — are fair game; the text itself is not, so nothing here
 * quotes a single line. The comics-vocabulary set doubles as real reading
 * instruction: panel, gutter, caption, splash page.                           */

function graphicNovelQuestions() {
  const out = [];
  const add = (band, diff, q, correct, wrongs, reveal) => out.push({
    subject: 'grammar', band, diff, q,
    choices: [{ html: correct, ok: true }, ...wrongs.map(w => ({ html: w }))],
    reveal,
  });

  /* --- who made what --- */
  const CREATORS = [
    ['Smile', 'Raina Telgemeier'], ['Sisters', 'Raina Telgemeier'],
    ['Guts', 'Raina Telgemeier'], ['Drama', 'Raina Telgemeier'],
    ['Ghosts', 'Raina Telgemeier'],
    ['Amulet', 'Kazu Kibuishi'],
    ['Zita the Spacegirl', 'Ben Hatke'], ['Little Robot', 'Ben Hatke'],
    ['Mighty Jack', 'Ben Hatke'],
    ['The Cardboard Kingdom', 'Chad Sell'],
    ['Calvin and Hobbes', 'Bill Watterson'],
    ['The Baby-Sitters Club (the original novels)', 'Ann M. Martin'],
  ];
  const names = [...new Set(CREATORS.map(([, a]) => a))];
  for (const [title, author] of CREATORS) {
    add('A', 'easy', `Who created <b>${title}</b>?`, author,
      seededPick(names.filter(n => n !== author), 3, title),
      `${title} was created by ${author}.`);
  }

  /* --- Raina Telgemeier --- */
  add('A', 'easy', 'In <b>Smile</b>, what happens to Raina that starts the whole story?',
    'She falls and badly injures her two front teeth',
    ['She breaks her arm at a soccer game', 'She moves to a new country', 'She loses her voice before a play'],
    'Smile is a memoir. Raina trips after a Girl Scout meeting, damages her front teeth, and the book follows the years of dental work — and middle school — that follow.');
  add('A', 'medium', 'What kind of book is <b>Smile</b>?', 'A memoir — a true story about the author\'s own life',
    ['A fantasy adventure', 'A mystery novel', 'A collection of poems'],
    'A memoir tells a true story from the author\'s own life. Raina Telgemeier drew her real middle-school years.');
  add('A', 'medium', 'In <b>Sisters</b>, what are Raina and Amara doing for most of the book?',
    'Taking a long family road trip', ['Starting a band', 'Solving a neighbourhood mystery', 'Training for a swim meet'],
    'Sisters follows a road trip to Colorado, using flashbacks to show how the sisters\' relationship got complicated.');
  add('A', 'medium', 'What is <b>Guts</b> mostly about?',
    'Anxiety, and how worry can make your stomach hurt',
    ['Learning to cook', 'A haunted house', 'Winning a spelling bee'],
    'Guts is about Raina\'s anxiety and the stomach aches that came with it. Naming the feeling is a big part of handling it.');
  add('A', 'medium', 'In <b>Drama</b>, what job does Callie do for the school play?',
    'She designs and builds the set', ['She plays the lead role', 'She writes the script', 'She conducts the orchestra'],
    'Callie works on the stage crew as set designer. Drama shows how much of a play happens backstage.');

  /* --- Baby-Sitters Club --- */
  add('A', 'easy', 'In <b>The Baby-Sitters Club</b>, who comes up with the idea for the club?',
    'Kristy Thomas', ['Claudia Kishi', 'Mary Anne Spier', 'Stacey McGill'],
    'Kristy has the great idea in the very first book, and she becomes the club\'s president.');
  add('A', 'medium', 'Whose bedroom does the Baby-Sitters Club meet in?',
    'Claudia Kishi\'s', ['Kristy Thomas\'s', 'Mary Anne Spier\'s', 'Dawn Schafer\'s'],
    'They meet in Claudia\'s room because she has her own phone line — essential for taking booking calls.');
  add('A', 'medium', 'In which town is <b>The Baby-Sitters Club</b> set?',
    'Stoneybrook, Connecticut', ['Stoneybrook, California', 'Riverdale, New York', 'Bayside, Ohio'],
    'The series is set in the fictional town of Stoneybrook, Connecticut.');
  add('B', 'hard', 'The Baby-Sitters Club graphic novels are adaptations. What does that mean?',
    'They retell a story that already existed in another form',
    ['They are written entirely from scratch', 'They are translations into another language',
     'They are shortened versions with no pictures'],
    'An adaptation retells an existing story in a new form. Ann M. Martin wrote the original novels; Raina Telgemeier and later artists adapted them into comics.');

  /* --- The Cardboard Kingdom --- */
  add('A', 'easy', 'In <b>The Cardboard Kingdom</b>, what do the kids make their costumes out of?',
    'Cardboard and other things they find', ['Store-bought superhero suits', 'Cloth their parents sew', 'Nothing — they only imagine them'],
    'Every kid builds an alter ego out of cardboard, tape and paint over one summer in their neighbourhood.');
  add('B', 'medium', 'What is unusual about how <b>The Cardboard Kingdom</b> was made?',
    'Chad Sell drew it, but many different writers helped create the characters',
    ['It was drawn entirely by children', 'It has no words at all', 'It was written by one person in a single day'],
    'Chad Sell illustrated the whole book, and collaborated with a group of writers who each helped shape different kids\' stories.');
  add('A', 'medium', 'What does an "alter ego" mean, like the ones the kids invent?',
    'A second self — another version of who you are',
    ['A best friend', 'A costume you buy', 'A made-up town'],
    'Alter ego is Latin for "the other I". In the book, each kid\'s invented character says something true about them.');

  /* --- Amulet --- */
  add('A', 'easy', 'In <b>Amulet</b>, what is the name of the girl who finds the amulet?',
    'Emily', ['Zita', 'Raina', 'Callie'],
    'Emily Hayes finds the amulet in her great-grandfather\'s house and becomes a Stonekeeper.');
  add('A', 'medium', 'In <b>Amulet</b>, who does Emily explore the strange new world with?',
    'Her younger brother Navin', ['Her cousin', 'Her classmate', 'Alone — she has no one'],
    'Emily and her brother Navin follow their mother into Alledia after she is taken.');
  add('B', 'medium', 'What is a <b>Stonekeeper</b> in the Amulet series?',
    'Someone who carries and controls an amulet\'s power',
    ['A guard who protects a castle', 'A stonemason who builds walls', 'A librarian in the elf city'],
    'Stonekeepers draw power from their amulets — but the stones talk back and try to influence them, which is the series\' central danger.');

  /* --- Ben Hatke --- */
  add('A', 'easy', 'In <b>Zita the Spacegirl</b>, what does Zita press that starts the adventure?',
    'A mysterious button on a device found in a crater',
    ['A doorbell at an abandoned house', 'A button on a spaceship control panel', 'A key on an old piano'],
    'Zita and her friend Joseph find a device in a crater. She presses the button, Joseph is pulled away, and Zita goes after him.');
  add('A', 'medium', 'What is <b>Little Robot</b> mostly about?',
    'A girl who finds a lost robot and becomes its friend',
    ['A robot who takes over a city', 'A boy who builds a robot for a science fair', 'Robots who go to school'],
    'A girl finds a small robot that has fallen off a truck. Much of the book is told with pictures and very few words.');
  add('B', 'medium', 'In <b>Mighty Jack</b>, which old story is Ben Hatke playing with?',
    'Jack and the Beanstalk', ['Cinderella', 'The Three Little Pigs', 'Robin Hood'],
    'Mighty Jack is a retelling of Jack and the Beanstalk — a trade for magic seeds, and a garden that grows something dangerous.');

  /* --- Calvin and Hobbes --- */
  add('A', 'easy', 'In <b>Calvin and Hobbes</b>, what kind of animal is Hobbes?',
    'A tiger', ['A bear', 'A dog', 'A raccoon'],
    'Hobbes is a tiger — a stuffed toy to everyone else, and a full-sized talking friend when Calvin is alone with him.');
  add('B', 'medium', 'What is <b>Calvin and Hobbes</b>?',
    'A newspaper comic strip', ['A graphic novel series', 'A chapter book series', 'A cartoon TV show'],
    'It ran as a daily newspaper strip from 1985 to 1995. The books are collections of those strips, not one continuous story.');
  add('B', 'medium', 'Who are Spaceman Spiff and Stupendous Man?',
    'Characters Calvin imagines himself as', ['Calvin\'s classmates', 'Comic books Calvin reads', 'Hobbes\'s nicknames'],
    'Calvin daydreams himself into these alter egos, usually to escape something boring or scary like a maths test.');
  add('A', 'medium', 'What is <b>Calvinball</b>?',
    'A game where the rules change constantly and can never repeat',
    ['A baseball game Calvin always wins', 'A board game Calvin invented', 'A video game Calvin plays'],
    'Calvinball has exactly one permanent rule: you can never play it the same way twice. Players invent rules as they go.');
  add('B', 'hard', 'Calvin turns a cardboard box into a time machine, a duplicator and a transmogrifier. What does that show about him?',
    'He uses imagination to turn ordinary things into anything',
    ['He is very good at building machines', 'He has real magic powers', 'He is dreaming the whole strip'],
    'The joke works because the box never changes — Calvin does. Watterson lets the reader see what Calvin sees.');

  /* --- comics vocabulary: this is real reading instruction --- */
  const VOCAB = [
    ['panel', 'One framed picture in a comic', 'Panels are the boxes. Reading them in the right order — usually left to right, top to bottom — is the first comics skill.'],
    ['gutter', 'The empty space between two panels', 'Your brain fills in the gutter. Two panels — a raised bat, then a broken window — and you supply the swing yourself.'],
    ['speech balloon', 'The bubble that holds what a character says out loud', 'A pointed tail shows who is talking. A jagged edge usually means shouting or a radio.'],
    ['thought balloon', 'The cloudy bubble that holds what a character is thinking', 'The little bubbles trailing to the character\'s head are the giveaway — nobody else can hear it.'],
    ['caption', 'A box of narration or a time cue, outside any speech balloon', 'Captions do the work of a narrator: "Later that night…" or the character\'s inner voice.'],
    ['splash page', 'A single huge panel filling a whole page', 'Artists save splash pages for big moments, because giving one image the whole page makes the reader slow down.'],
    ['onomatopoeia', 'A word that sounds like the noise it names', 'CRASH, BOOM, THWIP. Comics letter these into the art itself so the sound feels loud.'],
  ];
  const defs = VOCAB.map(([, d]) => d);
  for (const [term, def, why] of VOCAB) {
    add('A', 'medium', `In a comic or graphic novel, what is a <b>${term}</b>?`, def,
      seededPick(defs.filter(d => d !== def), 3, term), why);
  }
  add('B', 'hard', 'In comics, what does the reader do in the gutter between panels?',
    'Imagine what happened in the gap', ['Read a caption', 'Nothing — it is only decoration', 'Find the page number'],
    'This is called closure. The artist shows two moments and trusts you to connect them, which is why comics can move fast.');
  add('A', 'medium', 'What is a graphic novel?',
    'A full-length story told in comics form',
    ['A novel with a few illustrations', 'A very violent novel', 'A novel about graphic design'],
    'Graphic novels tell a complete story in panels and pictures. "Graphic" here means drawn, not gory.');

  return out;
}

/* ============================ run ============================ */

const all = [];
const perSource = [];

// The people index has to exist before any question is finalised, so build it
// from the history bank first.
if (existsSync(join(LEARN_ZONE, 'history'))) indexPeople(sandbox(join(LEARN_ZONE, 'history')));

for (const src of SOURCES) {
  const dir = join(LEARN_ZONE, src.dir);
  if (!existsSync(dir)) { perSource.push({ ...src, found: 0, note: 'missing' }); continue; }
  const win = sandbox(dir);
  const found = [];
  harvest(win, new WeakSet(), found);
  // banks that store facts rather than questions get built into questions
  if (BUILDERS[src.dir]) {
    try { found.push(...BUILDERS[src.dir](win).filter(q => q && q.q && q.choices?.length >= 2)); }
    catch (e) { console.warn(`  builder failed for ${src.dir}: ${e.message}`); }
  }
  // questions whose meaning lives in a passage or a label, re-emitted with it
  try { found.push(...passageQuestions(win), ...labelQuestions(win)); }
  catch (e) { console.warn(`  context builder failed for ${src.dir}: ${e.message}`); }

  for (const raw of found) {
    const q = attachPersonBios(raw);
    all.push({
      id: `${src.dir}:${fnv1a(normalise(q.q))}`,
      subject: src.subject,
      band: src.band,
      diff: nudgeDifficulty(src.diff, q),
      q: q.q,
      choices: q.choices,
      reveal: q.reveal || '',
      ...(q.long ? { long: true } : {}),
      _src: src.dir,
    });
  }
  perSource.push({ ...src, found: found.length });
}

const AUTHORED = [
  ['mathmcq', mathQuestions()],
  ['shape', shapeQuestions()],
  ['capital', capitalQuestions()],
  ['measure', measurementQuestions()],
  ['amend', amendmentQuestions()],
  ['books', graphicNovelQuestions()],
];
for (const [tag, list] of AUTHORED) {
  for (const q of list) {
    all.push({ id: `${tag}:${fnv1a(normalise(q.q))}`, ...q, _src: 'authored-' + tag });
  }
  perSource.push({ dir: 'authored: ' + tag, subject: list[0]?.subject ?? '-', band: '-', found: list.length });
}

/* ---- dedupe by content hash ---- */
const byId = new Map();
let dupes = 0;
for (const q of all) {
  const key = fnv1a(normalise(q.q));
  if (byId.has(key)) { dupes++; continue; }
  byId.set(key, q);
}
let questions = [...byId.values()];

/* ---- quality gate ---- */
const rejected = [];
questions = questions.filter((q) => {
  const answer = q.choices.find(c => c.ok);
  if (!answer) { rejected.push([q.id, 'no correct answer']); return false; }
  if (!q.reveal || q.reveal.length < 15) { rejected.push([q.id, 'no explanation']); return false; }
  // measure the words, not the markup — shape questions carry inline SVG
  const words = q.q.replace(/<[^>]*>/g, '').trim();
  // A reading-comprehension question carries its passage, so it is SUPPOSED to
  // be long; the tight cap only applies to questions that should be one line.
  const cap = q.long ? 2600 : 340;
  if (words.length > cap) { rejected.push([q.id, 'prompt too long']); return false; }
  if (words.length < 8) { rejected.push([q.id, 'prompt too short']); return false; }
  if (/<(script|img|iframe)/i.test(q.q)) { rejected.push([q.id, 'unsafe markup']); return false; }
  return true;
});

/* ---- lint: the "pick the longest answer" tell ---- */
function longestTell(list) {
  let n = 0;
  for (const q of list) {
    const lens = q.choices.map(c => c.html.length);
    if (q.choices.find(c => c.ok).html.length === Math.max(...lens)) n++;
  }
  return list.length ? Math.round((100 * n) / list.length) : 0;
}

/* ---- counts ---- */
const counts = {};
for (const q of questions) {
  const k = `${q.subject}:${q.band}`;
  counts[k] = (counts[k] ?? 0) + 1;
}

console.log('\nsource                    subject  band  found');
for (const s of perSource) {
  console.log(`  ${s.dir.padEnd(22)} ${s.subject.padEnd(8)} ${s.band}     ${s.found}${s.note ? '  (' + s.note + ')' : ''}`);
}

console.log(`\n${questions.length} questions kept  ·  ${dupes} duplicates dropped  ·  ${rejected.length} rejected`);
console.log('\ncell counts (subject:band)');
for (const [k, v] of Object.entries(counts).sort()) {
  const flag = v < 15 ? '  ⚠ thin' : '';
  console.log(`  ${k.padEnd(14)} ${String(v).padStart(4)}${flag}`);
}

const tell = longestTell(questions);
console.log(`\ncorrect-answer-is-longest: ${tell}%${tell > 40 ? '  ⚠ over 40% — kids can game this' : '  (under 40%, good)'}`);

if (REPORT) {
  console.log('\nrejected:');
  for (const [id, why] of rejected.slice(0, 40)) console.log(`  ${id.padEnd(26)} ${why}`);
}

if (DRY) { console.log('\n--dry: nothing written\n'); process.exit(0); }

const stamp = new Date().toISOString().slice(0, 10);
const body = questions.map(q => {
  const { _src, ...rest } = q;
  return JSON.stringify(rest);
}).join(',\n  ');

writeFileSync(join(ROOT, 'data/questions.js'),
`// GENERATED by tools/import-questions.mjs on ${stamp} — DO NOT EDIT BY HAND.
// Harvested from the Learn Zone banks (../math-app) plus authored maths MCQs.
// ${questions.length} questions.  Cells: ${Object.entries(counts).sort().map(([k, v]) => k + '=' + v).join(' ')}
// Correct-answer-is-longest: ${tell}%
//
// Contract: { id, subject, band, diff, q, choices:[{html, ok}], reveal }
//   band 'A' ≈ grades 3-4, 'B' ≈ grades 5-6+.  ids are content hashes, so a
//   re-import keeps every profile's missed list and question bag valid.
window.QBANK = {
  meta: { generated: '${stamp}', total: ${questions.length}, counts: ${JSON.stringify(counts)} },
  questions: [
  ${body}
  ],
};
`);

console.log(`\nWrote data/questions.js — ${questions.length} questions.\n`);
