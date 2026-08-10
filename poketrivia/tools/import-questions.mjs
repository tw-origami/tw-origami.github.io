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
  // Some banks store bare SCENARIOS ("You're thirsty after playing outside.")
  // and let their app supply the framing. Standing alone that's a statement,
  // not a question — so ask one.
  if (!prompt.includes('?') && !/_{2,}/.test(prompt) && /[.!]$/.test(prompt.trim())) {
    prompt = prompt.trim() + ' Which is the best choice?';
  }

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

// Reading-passage questions are deliberately NOT imported. They were tried with
// the passage rendered above the question, and the verdict was that a story to
// read doesn't belong in this game's flow at all ("remove any question that
// needs a story to know the answer"). The structural skip in harvest() still
// keeps their context-free versions out, which is what matters — a question
// like "Why does Hana decide to finish the kite?" must never appear bare.

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
      ['Sodium', L.sodiumMg != null ? L.sodiumMg + 'mg' : null],
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
function seededPick(rawPool, n, seedStr) {
  // Dedupe the pool by normalised text first — some source label pools repeat
  // an entry, which used to produce two identical distractors on one question.
  const seenTxt = new Set(), pool = [];
  for (const item of rawPool) {
    const k = normalise(String(item?.label ?? item));
    if (seenTxt.has(k)) continue;
    seenTxt.add(k);
    pool.push(item);
  }
  if (!pool.length) return [];
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
    const t = it[text], raw = it[label];
    if (!isStr(t) || !isStr(raw)) continue;
    // Source items sometimes store a raw KEY ('runon') while the label pool has
    // the display form ('run-on'). Canonicalise, or the raw key is shown as the
    // answer AND its display twin turns up as a distractor on the same card.
    const l = labels.find(x => normalise(x) === normalise(raw)) ?? raw;
    const others = labels.filter(x => normalise(x) !== normalise(l));
    if (others.length < 2) continue;
    const wrong = seededPick(others, 3, t + l);
    const shown = [l, ...wrong];

    // The reveal NAMES the right answer first. Without this, a card whose
    // glossary defines the wrong options but whose `why` never says "Post Hoc"
    // reads like an explanation of everything except the answer.
    let reveal = isStr(it[why]) ? clean(it[why]) : `The answer is ${clean(l)}.`;
    if (!normalise(reveal).includes(normalise(l))) reveal = `<b>${clean(l)}.</b> ${reveal}`;
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
    // Exclude by TEXT, not identity — two terms can share a definition
    // ("-ful" and "-ous" both mean "full of"), and drawing the twin as a
    // distractor would put the right answer on the card twice.
    const others = defs.filter(x => normalise(x) !== normalise(d) && x.length <= 130);
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
      (s) => `What part of speech is the word <b>${(s.match(/\*(.+?)\*/) ?? [, '?'])[1]}</b> here? "${s.replace(/\*/g, '')}"`,
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
        q: `Which word belongs in the blank? "${clean(it.s)}"`,
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
    // The verb has to fit the category. "In which country would you find the
    // Eiffel Tower?" is fine; "In which country would you find gravity?" is
    // nonsense — gravity is everywhere. Inventions and ideas ask where they
    // CAME FROM, places ask where they ARE.
    const GEO_ASK = {
      landmark:  (n) => `In which country would you find ${n}?`,
      nature:    (n) => `In which country would you find ${n}?`,
      invention: (n) => `Which country invented ${n}?`,
      discovery: (n) => `Which country's scientists gave us ${n}?`,
      food:      (n) => `Which country is the original home of ${n}?`,
      art:       (n) => `Which country did ${n} come from?`,
      history:   (n) => `Which country was home to ${n}?`,
      culture:   (n) => `Which country gave the world ${n}?`,
      animal:    (n) => `Which country are ${n} from?`,
    };
    for (const it of G.ITEMS ?? []) {
      if (!isStr(it.name) || !isStr(it.c) || countries.length < 5) continue;
      const ask = GEO_ASK[it.cat] ?? GEO_ASK.landmark;
      out.push({
        q: ask(clean(it.name)),
        choices: [{ html: clean(it.c), ok: true },
          ...seededPick(countries.filter(x => x !== it.c), 3, it.name).map(x => ({ html: clean(x) }))],
        reveal: isStr(it.fact) ? clean(it.fact) : `${clean(it.name)}: ${clean(it.c)}.`,
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
      q: `How many sides does ${/^[aeiou]/i.test(name) ? 'an' : 'a'} ${name.toLowerCase()} have?`,
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
    const trap = BIGGEST_CITY[state] !== cap ? BIGGEST_CITY[state] : null;
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

// [number, kid-level summary, excerpt of the real constitutional text].
// The real words go in the reveal — the Constitution is public domain, and
// seeing "Congress shall make no law…" next to the plain-English version is
// the actual lesson.
const AMENDMENTS = [
  [1, 'Freedom of speech, religion, press, assembly and petition',
    'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble…'],
  [2, 'The right to keep and bear arms',
    'A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.'],
  [4, 'Protection from unreasonable searches and seizures',
    'The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated…'],
  [5, 'The right to remain silent and to due process of law',
    'No person shall… be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law…'],
  [6, 'The right to a speedy public trial and a lawyer',
    'In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial… and to have the Assistance of Counsel for his defence.'],
  [8, 'No cruel and unusual punishment',
    'Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted.'],
  [13, 'Slavery is abolished',
    'Neither slavery nor involuntary servitude… shall exist within the United States, or any place subject to their jurisdiction.'],
  [14, 'Equal protection of the laws for all citizens',
    'No State shall… deprive any person of life, liberty, or property, without due process of law; nor deny to any person within its jurisdiction the equal protection of the laws.'],
  [15, 'The right to vote cannot be denied because of race',
    'The right of citizens of the United States to vote shall not be denied or abridged… on account of race, color, or previous condition of servitude.'],
  [19, 'Women get the right to vote',
    'The right of citizens of the United States to vote shall not be denied or abridged by the United States or by any State on account of sex.'],
  [22, 'A president can only be elected twice',
    'No person shall be elected to the office of the President more than twice…'],
  [26, 'The voting age is lowered to 18',
    'The right of citizens of the United States, who are eighteen years of age or older, to vote shall not be denied or abridged… on account of age.'],
];

const ordinal = (n) => {
  // 22nd, not 22th — but 11th/12th/13th, hence the teens check
  if (n % 100 >= 11 && n % 100 <= 13) return n + 'th';
  return n + ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th');
};

function amendmentQuestions() {
  const texts = AMENDMENTS.map(([, t]) => t);
  const out = [];
  // Every reveal quotes the amendment's real words next to the plain-English
  // version — reading the actual Constitution is the point.
  const quoteBlock = (n, summary, actual) =>
    `The ${ordinal(n)} Amendment covers: ${summary}.` +
    (n <= 10 ? ' It is part of the Bill of Rights — the first ten amendments, added in 1791.' : '') +
    `<div class="lawText"><b>The real text says:</b> “${actual}”</div>`;

  for (const [n, text, actual] of AMENDMENTS) {
    out.push({
      subject: 'history', band: 'B', diff: 'medium',
      q: `What does the <b>${ordinal(n)} Amendment</b> protect?`,
      choices: [{ html: text, ok: true },
        ...seededPick(texts.filter(t => t !== text), 3, String(n)).map(t => ({ html: t }))],
      reveal: quoteBlock(n, text, actual),
    });
    out.push({
      subject: 'history', band: 'B', diff: 'hard',
      q: `Which amendment says: <span class="lawQuote">“${actual}”</span>`,
      choices: [{ html: `The ${ordinal(n)} Amendment`, ok: true },
        ...seededPick(AMENDMENTS.filter(([m]) => m !== n), 3, text)
          .map(([m]) => ({ html: `The ${ordinal(m)} Amendment` }))],
      reveal: quoteBlock(n, text, actual),
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
    add('A', 'medium', `In a comic or graphic novel, what is ${/^[aeiou]/i.test(term) ? 'an' : 'a'} <b>${term}</b>?`, def,
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

let all = [];
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
  // questions whose meaning lives on a nutrition label, re-emitted with it
  try { found.push(...labelQuestions(win)); }
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

/* ---------------- kitchen-table trivia ----------------
 * Authored from a family trivia list Travis supplied: language, human body,
 * animals, geography, ocean, science, space, history, books, music. Converted
 * to MCQ with same-category distractors; the delightful extra facts from the
 * list live in the reveals. A few facts were updated (world population ~8
 * billion; India recently passed China in population; Pluto's demotion). */
function kidTriviaQuestions() {
  const A = 'A', B = 'B';
  const T = (band, subject, diff, q, right, wrongs, reveal) => ({
    subject, band, diff, q,
    choices: [{ html: right, ok: true }, ...wrongs.map(w => ({ html: w }))],
    reveal,
  });
  return [
    /* --- language --- */
    T(A, 'grammar', 'easy', 'What do we call the special letters A, E, I, O and U?',
      'Vowels', ['Consonants', 'Capitals', 'Syllables'],
      'A, E, I, O and U are the vowels. Every other letter is a consonant, and almost every word needs at least one vowel.'),
    T(A, 'grammar', 'easy', 'How many letters are in the English alphabet?',
      '26', ['24', '30', '21'],
      'There are 26 letters — 5 vowels and 21 consonants.'),
    T(A, 'grammar', 'medium', 'A word or sentence that reads the same backward and forward — like "Madam, I\'m Adam" — is called what?',
      'A palindrome', ['A pangram', 'An anagram', 'A homophone'],
      'Palindromes read the same both ways: racecar, level, noon. An anagram is different — that\'s reshuffling letters into a new word.'),
    T(A, 'general', 'easy', 'What is the name of the building where people can borrow books for free?',
      'The library', ['The bookstore', 'The museum', 'The post office'],
      'A library lends books for free — you just have to bring them back so someone else can enjoy them too.'),
    /* --- human body --- */
    T(A, 'science', 'easy', 'How long should you wash your hands with soap to get rid of germs?',
      '20 seconds', ['5 seconds', '2 minutes', '1 hour'],
      'About 20 seconds — roughly the time it takes to sing "Happy Birthday" twice. No watch needed!'),
    T(A, 'science', 'easy', 'Can you see germs with just your eyes?',
      'No — you need a microscope', ['Yes, if you look closely', 'Only in the dark', 'Only red ones'],
      'Germs are far too tiny to see. Scientists use microscopes, which can make things look thousands of times bigger.'),
    T(B, 'science', 'medium', 'Which organ of your body is the heaviest?',
      'Your skin', ['Your heart', 'Your brain', 'Your lungs'],
      'Skin counts as an organ — and it\'s the heaviest one you\'ve got! The heaviest organ INSIDE you is the liver.'),
    T(B, 'science', 'medium', 'Which of these is something your skin does NOT do?',
      'Help you hear', ['Protect you from germs', 'Keep you warm or cool', 'Help you feel things'],
      'Skin protects you, controls your temperature, and gives you the sense of touch — but hearing is the ears\' job.'),
    T(B, 'science', 'medium', 'How many bones does a grown-up human have?',
      '206', ['300', '150', '412'],
      'Adults have 206 bones. Here\'s the twist: babies start with about 300, and some bones join together as they grow!'),
    T(B, 'science', 'medium', 'Where is the smallest bone in your whole body?',
      'In your ear', ['In your little toe', 'In your nose', 'In your wrist'],
      'The stapes, deep in your ear, is smaller than a grain of rice. The smallest muscles are in the ear too!'),
    T(B, 'science', 'medium', 'What is the hardest substance in the human body?',
      'Tooth enamel', ['Skull bone', 'Fingernails', 'Kneecaps'],
      'Tooth enamel is harder than bone — so brush well to keep it that way, because your body can\'t grow it back.'),
    T(A, 'science', 'easy', 'About how much of your body is made of water?',
      'More than two-thirds', ['About one tenth', 'Almost none', 'Exactly half'],
      'You\'re mostly water! That\'s why drinking water matters so much.'),
    /* --- animals --- */
    T(A, 'science', 'easy', 'What sound does an angry cat make?',
      'A hiss', ['A moo', 'A chirp', 'A howl'],
      'Cats meow, purr and yowl — but an angry or scared cat hisses. Some cats even chatter when they spot a bird.'),
    T(A, 'science', 'medium', 'What is the only land mammal that cannot jump?',
      'The elephant', ['The rhinoceros', 'The hippo', 'The giraffe'],
      'Elephants are simply too big — all four feet never leave the ground at once, even when they run.'),
    T(A, 'science', 'medium', 'What is the only mammal that can truly fly?',
      'The bat', ['The flying squirrel', 'The ostrich', 'The sugar glider'],
      'Flying squirrels and sugar gliders only glide. Bats are the one mammal that really flies with its own wings.'),
    T(A, 'science', 'medium', 'What is the biggest fish in the world?',
      'The whale shark', ['The great white shark', 'The blue whale', 'The giant squid'],
      'Despite its name, the whale shark is a fish, not a whale. (The blue whale is bigger — but it\'s a mammal, not a fish!)'),
    T(A, 'science', 'medium', 'An owl is nocturnal. When is it most active?',
      'At night', ['At sunrise', 'In the afternoon', 'All day long'],
      'Nocturnal animals are active at night. Animals that are up in the day, like most birds, are called diurnal.'),
    T(B, 'science', 'medium', 'The platypus is a mammal, but it does something almost no other mammal does. What?',
      'It lays eggs', ['It breathes underwater', 'It has feathers', 'It never sleeps'],
      'The platypus is one of only two egg-laying mammals on Earth — the other is the echidna. Both live in Australia.'),
    T(B, 'science', 'medium', 'What do you call a mammal whose babies grow up in their mother\'s pouch?',
      'A marsupial', ['A reptile', 'A rodent', 'An amphibian'],
      'Kangaroos, koalas and possums are marsupials — their tiny babies finish growing inside the pouch.'),
    T(B, 'science', 'hard', 'What are a rhinoceros\'s horns actually made of?',
      'Keratin — the same stuff as hair', ['Solid bone', 'Ivory', 'Rock-hard skin'],
      'Rhino horn is keratin, the same material as your hair and fingernails.'),
    T(B, 'science', 'medium', 'Which fish is born in a river, lives in the ocean, then swims back to the SAME river to lay its eggs?',
      'The salmon', ['The tuna', 'The goldfish', 'The eel'],
      'Salmon remember the smell of their home river and fight their way back upstream to it — sometimes leaping up waterfalls.'),
    T(B, 'science', 'medium', 'What is the largest animal that has EVER lived — bigger than any dinosaur?',
      'The blue whale', ['Tyrannosaurus rex', 'The woolly mammoth', 'The megalodon'],
      'Blue whales can pass 100 feet long — longer and heavier than any dinosaur we\'ve ever found.'),
    T(B, 'science', 'hard', 'Which came first: sharks or dinosaurs?',
      'Sharks', ['Dinosaurs', 'They appeared together', 'Neither — birds came first'],
      'Sharks have been around for over 400 million years — long before the first dinosaur.'),
    T(A, 'science', 'medium', 'Which bird is the only one that can fly backward?',
      'The hummingbird', ['The eagle', 'The penguin', 'The woodpecker'],
      'Hummingbirds beat their wings in a figure-eight, which lets them hover and even fly backward.'),
    T(A, 'science', 'medium', 'What do gorillas mostly eat?',
      'Plants', ['Meat', 'Fish', 'Insects only'],
      'For all their size and strength, gorillas are gentle and mostly vegetarian — though they do snack on bugs sometimes.'),
    T(B, 'science', 'hard', 'Which animal has fingerprints so similar to ours they have confused the police?',
      'The koala', ['The chimpanzee', 'The raccoon', 'The house cat'],
      'Koala fingerprints are nearly identical to human ones under a microscope — they\'ve genuinely muddled crime scenes.'),
    T(B, 'science', 'hard', 'Which mammal can live to be 200 years old?',
      'The bowhead whale', ['The elephant', 'The blue whale', 'The tortoise'],
      'Bowhead whales in the Arctic can pass 200 years. (Tortoises live long too — but they\'re reptiles, not mammals!)'),
    /* --- geography --- */
    T(A, 'general', 'easy', 'What is the capital of the United States?',
      'Washington, D.C.', ['New York City', 'Los Angeles', 'Chicago'],
      'Washington, D.C. is the capital. The biggest city is New York — a capital is not always the biggest city!'),
    T(A, 'general', 'easy', 'On which continent is the South Pole?',
      'Antarctica', ['Africa', 'Australia', 'South America'],
      'The South Pole sits in the middle of Antarctica, the coldest continent on Earth.'),
    T(A, 'general', 'medium', 'What is the tallest mountain on Earth?',
      'Mount Everest', ['Mount Kilimanjaro', 'Mount Fuji', 'Denali'],
      'Everest, on the border of Nepal and Tibet, is about 29,000 feet — roughly as high as jet planes fly. People in Tibet call it Chomolungma.'),
    T(B, 'general', 'medium', 'Which country has the most people?',
      'India', ['China', 'The United States', 'Russia'],
      'India recently passed China — both have over 1.4 billion people. The United States is third, far behind.'),
    T(B, 'general', 'medium', 'The Andes Mountains run down which continent?',
      'South America', ['Africa', 'Asia', 'Europe'],
      'The Andes run all the way down South America\'s west side — the longest mountain range on land in the world.'),
    T(A, 'general', 'easy', 'Which country is also an entire continent?',
      'Australia', ['Greenland', 'India', 'Iceland'],
      'Australia is the only country that covers a whole continent.'),
    T(A, 'general', 'easy', 'How much of the Earth is covered by ocean?',
      'About 70%', ['About 20%', 'About half', 'Almost all of it'],
      'Oceans cover about 70% of Earth — from space, our planet looks mostly blue.'),
    T(B, 'general', 'medium', 'About how many people live on Earth today?',
      'About 8 billion', ['About 1 million', 'About 500 million', 'About 100 billion'],
      'Around 8 billion people — and the number is still growing.'),
    T(B, 'general', 'hard', 'What is the lowest place on the Earth\'s land?',
      'The shore of the Dead Sea', ['Death Valley', 'The Grand Canyon', 'The Sahara Desert'],
      'The Dead Sea shore, between Jordan and Israel, is more than 1,300 feet below sea level — and the water is so salty you float.'),
    T(A, 'general', 'medium', 'What is the largest U.S. state?',
      'Alaska', ['Texas', 'California', 'Montana'],
      'Alaska is more than twice the size of Texas — but far fewer people live there.'),
    T(A, 'general', 'medium', 'What is the smallest U.S. state?',
      'Rhode Island', ['Delaware', 'Hawaii', 'Connecticut'],
      'Little Rhody! You could fit Rhode Island into Alaska about 425 times.'),
    T(B, 'general', 'medium', 'Which state was the 50th — the last — to join the United States?',
      'Hawaii', ['Alaska', 'Arizona', 'Puerto Rico'],
      'Hawaii joined in August 1959, a few months after Alaska became the 49th.'),
    /* --- ocean --- */
    T(A, 'science', 'easy', 'What is a group of fish called?',
      'A school', ['A herd', 'A flock', 'A pack'],
      'Fish swim in schools. Dolphins travel in pods, birds in flocks, wolves in packs.'),
    T(A, 'science', 'easy', 'What is a group of dolphins called?',
      'A pod', ['A school', 'A pride', 'A swarm'],
      'Dolphins live in pods and work together to hunt and protect each other.'),
    T(A, 'science', 'medium', 'Why can\'t you drink ocean water?',
      'It is too salty', ['It is too cold', 'It has too many fish', 'It is actually fine to drink'],
      'Drinking saltwater makes your body LOSE water — it would make you sicker and thirstier.'),
    T(B, 'science', 'medium', 'What is the largest turtle in the world?',
      'The leatherback sea turtle', ['The snapping turtle', 'The box turtle', 'The Galápagos tortoise'],
      'Leatherbacks can weigh up to 2,000 pounds and swim across entire oceans.'),
    T(B, 'general', 'medium', 'The Great Barrier Reef — the world\'s biggest coral reef — is off the coast of which country?',
      'Australia', ['Brazil', 'Japan', 'Mexico'],
      'It stretches over 1,400 miles along Australia\'s coast and is visible from space.'),
    T(B, 'science', 'hard', 'What is the deepest known spot in the ocean?',
      'The Challenger Deep', ['The Bermuda Triangle', 'The Great Blue Hole', 'The Titanic wreck'],
      'The Challenger Deep, in the Mariana Trench, is nearly 7 miles down — Everest would sink without a trace.'),
    /* --- science & nature --- */
    T(A, 'science', 'easy', 'What made-up name helps you remember the colors of the rainbow?',
      'Roy G. Biv', ['Bob R. Ainbow', 'Mr. Colors', 'Ray N. Bow'],
      'Roy G. Biv: Red, Orange, Yellow, Green, Blue, Indigo, Violet — in order.'),
    T(A, 'science', 'easy', 'Trees need light, soil and what else to grow?',
      'Water', ['Sugar', 'Milk', 'Wind'],
      'Light, soil and water — with those three, a tree makes its own food.'),
    T(A, 'science', 'easy', 'What do we use to measure temperature?',
      'A thermometer', ['A scale', 'A ruler', 'A stopwatch'],
      'A thermometer measures temperature; a scale measures weight; a ruler measures length.'),
    T(B, 'science', 'medium', 'What gas do plants take IN from the air?',
      'Carbon dioxide', ['Oxygen', 'Helium', 'Steam'],
      'Plants breathe in carbon dioxide and release oxygen — the opposite of us. That\'s why forests are called the lungs of the Earth.'),
    T(B, 'science', 'medium', 'The natural home where a plant or animal lives is called its what?',
      'Habitat', ['Ecosystem', 'Territory', 'Nest'],
      'A habitat is a living thing\'s natural home — a frog\'s habitat is a pond, a camel\'s is the desert.'),
    T(B, 'science', 'hard', 'Earth\'s surface is made of giant moving slabs of rock called what?',
      'Tectonic plates', ['Crust sheets', 'Lava shelves', 'Ground rafts'],
      'Tectonic plates drift about as fast as your fingernails grow. Where they meet, you get earthquakes, volcanoes and mountains.'),
    T(B, 'science', 'medium', 'Which scientist is famous for the equation E=mc²?',
      'Albert Einstein', ['Isaac Newton', 'Marie Curie', 'Thomas Edison'],
      'Einstein\'s equation says energy and mass are two forms of the same thing — a tiny bit of matter holds a huge amount of energy.'),
    T(B, 'science', 'medium', 'Electricity needs a complete loop to flow through. What is that loop called?',
      'A circuit', ['A channel', 'A pipeline', 'A current'],
      'A circuit is the complete path. Break the loop — like flipping a switch — and the flow stops.'),
    T(A, 'science', 'medium', 'Which is faster: light or sound?',
      'Light', ['Sound', 'They are the same', 'It depends on the weather'],
      'Light is about a million times faster — that\'s why you see lightning before you hear the thunder.'),
    /* --- space --- */
    T(A, 'science', 'easy', 'Which is bigger: the Sun or the Moon?',
      'The Sun — much bigger', ['The Moon', 'They are the same size', 'It changes'],
      'The Sun is about 400 times wider than the Moon. They look the same size only because the Sun is 400 times farther away.'),
    T(A, 'science', 'easy', 'What color is the planet Mars?',
      'Red', ['Blue', 'Green', 'Yellow'],
      'Mars is covered in rusty red dust — literally rust! It\'s iron in the soil that has oxidised.'),
    T(A, 'science', 'medium', 'What is the biggest planet in our solar system?',
      'Jupiter', ['Saturn', 'Earth', 'Neptune'],
      'Jupiter is enormous — about 1,300 Earths could fit inside it.'),
    T(A, 'science', 'medium', 'Which planet is closest to the Sun?',
      'Mercury', ['Venus', 'Mars', 'Earth'],
      'Mercury is first from the Sun. Venus is second — and actually hotter, because of its thick atmosphere!'),
    T(B, 'science', 'medium', 'Does the Moon make its own light?',
      'No — it reflects sunlight', ['Yes, it glows on its own', 'Only during a full moon', 'Only in winter'],
      'Moonlight is sunlight bouncing off the Moon\'s surface, like a giant mirror in the sky.'),
    T(B, 'science', 'medium', 'Which planet is farthest from the Sun?',
      'Neptune', ['Pluto', 'Uranus', 'Saturn'],
      'Neptune — and if you said Pluto, you\'d have been right until 2006, when scientists reclassified Pluto as a dwarf planet.'),
    T(B, 'history', 'hard', 'What was the first human-made object to orbit the Earth?',
      'Sputnik', ['Apollo 11', 'The Hubble Telescope', 'The International Space Station'],
      'The Soviet Union launched the beach-ball-sized Sputnik in 1957. Its radio beeps started the Space Race.'),
    T(B, 'science', 'medium', 'Since the year 2000, people have ALWAYS been living somewhere off the Earth. Where?',
      'The International Space Station', ['The Moon', 'Mars', 'A submarine'],
      'Astronauts have lived on the ISS continuously since November 2000 — it circles the Earth every 90 minutes.'),
    T(A, 'history', 'medium', 'Who was the first person to walk on the Moon?',
      'Neil Armstrong', ['Buzz Aldrin', 'Yuri Gagarin', 'John Glenn'],
      'Neil Armstrong stepped out first on July 20, 1969; Buzz Aldrin joined him minutes later. Gagarin was the first person in space — from the Soviet Union.'),
    T(B, 'science', 'medium', 'What is the Milky Way?',
      'Our home galaxy', ['A single giant star', 'A comet', 'A nebula near Mars'],
      'The Milky Way is the galaxy we live in — billions of stars. Far from city lights you can see its edge as a cloudy band across the night sky.'),
    /* --- history --- */
    T(A, 'history', 'easy', 'Who was the first president of the United States?',
      'George Washington', ['Abraham Lincoln', 'Thomas Jefferson', 'Benjamin Franklin'],
      'Washington was elected in 1789. Franklin, despite the $100 bill, was never president!'),
    T(A, 'history', 'medium', 'In 1903, the Wright Brothers were the first people to do what?',
      'Fly an airplane', ['Drive a car', 'Climb Mount Everest', 'Reach the North Pole'],
      'Their first flight at Kitty Hawk lasted 12 seconds — shorter than the wingspan of a modern jumbo jet.'),
    T(A, 'history', 'medium', 'How many stripes are on the American flag?',
      '13', ['50', 'original', '26'].map(x => x === 'original' ? '76' : x),
      'The 13 stripes stand for the original 13 colonies; the 50 stars are the 50 states.'),
    T(A, 'history', 'easy', 'What did the Titanic hit that made it sink?',
      'An iceberg', ['A whale', 'Another ship', 'A reef'],
      'The Titanic struck an iceberg in 1912 on its very first voyage across the Atlantic.'),
    T(A, 'history', 'medium', 'Who built the Great Pyramids?',
      'The Egyptians', ['The Romans', 'The Greeks', 'The Aztecs'],
      'Egyptian workers built them about 4,500 years ago as tombs for pharaohs. The Great Pyramid was the tallest building on Earth for nearly 4,000 years.'),
    T(B, 'history', 'medium', 'Alexander Graham Bell invented what?',
      'The telephone', ['The light bulb', 'The radio', 'The camera'],
      'Bell patented the telephone in 1876. The first words down the line were to his assistant: he asked Mr. Watson to come over.'),
    T(B, 'general', 'hard', 'Which country\'s flag shows an eagle holding a snake?',
      'Mexico', ['Spain', 'Egypt', 'Brazil'],
      'An Aztec legend said to build where an eagle sits on a cactus eating a snake — that spot became Mexico City.'),
    T(B, 'history', 'medium', 'Who refused to give up her bus seat in 1955, helping spark the Civil Rights Movement?',
      'Rosa Parks', ['Harriet Tubman', 'Ruby Bridges', 'Sojourner Truth'],
      'Rosa Parks\' arrest in Montgomery, Alabama led to a year-long bus boycott — a turning point for civil rights in America.'),
    T(B, 'history', 'medium', 'Where were the first modern Olympic Games held?',
      'Greece', ['France', 'The United States', 'Italy'],
      'Athens, 1896 — honouring the ancient games held in Greece over 2,500 years earlier.'),
    T(B, 'history', 'hard', 'Alfred Nobel founded the Nobel Prizes. What had he invented?',
      'Dynamite', ['The machine gun', 'Gunpowder', 'The steam engine'],
      'Nobel invented dynamite, and left his fortune to prizes for peace and science — some say after reading his own mistaken obituary calling him a merchant of death.'),
    T(B, 'history', 'hard', 'Abraham Lincoln is in the Hall of Fame of which sport?',
      'Wrestling', ['Boxing', 'Baseball', 'Horse racing'],
      'Lincoln was a champion wrestler as a young man — roughly 300 matches with only one recorded loss.'),
    T(B, 'history', 'medium', 'Who was the first Black player in Major League Baseball?',
      'Jackie Robinson', ['Willie Mays', 'Hank Aaron', 'Babe Ruth'],
      'Jackie Robinson broke the colour barrier with the Brooklyn Dodgers in 1947. His number 42 is retired by every team.'),
    T(B, 'history', 'medium', 'Johannes Gutenberg made it possible for ordinary people to own books by inventing what?',
      'The printing press', ['Paper', 'The pencil', 'The library'],
      'Before Gutenberg\'s press (around 1440), every book was copied by hand. After it, ideas could spread faster than ever before.'),
    T(B, 'history', 'medium', 'Which came first: the Declaration of Independence or the U.S. Constitution?',
      'The Declaration of Independence', ['The Constitution', 'They were signed together', 'Neither is older'],
      'The Declaration (1776) announced America\'s independence; the Constitution (1787) set up its government eleven years later.'),
    /* --- books & music --- */
    T(A, 'general', 'easy', 'Who is Curious George\'s human friend?',
      'The Man in the Yellow Hat', ['The Zookeeper', 'Professor Brown', 'The Bus Driver'],
      'The Man in the Yellow Hat brought George from the jungle and bails him out of trouble in every book.'),
    T(A, 'general', 'medium', 'Which fictional wizard is called "The Boy Who Lived"?',
      'Harry Potter', ['Gandalf', 'Merlin', 'Ron Weasley'],
      'Harry Potter earned the name as a baby, and the lightning scar to go with it.'),
    T(B, 'general', 'medium', 'Who wrote "Charlie and the Chocolate Factory"?',
      'Roald Dahl', ['Dr. Seuss', 'J.K. Rowling', 'Beverly Cleary'],
      'Roald Dahl also wrote Matilda, The BFG and James and the Giant Peach.'),
    T(B, 'general', 'hard', 'Which author created Ramona Quimby and lived to be 104?',
      'Beverly Cleary', ['Judy Blume', 'Roald Dahl', 'E.B. White'],
      'Beverly Cleary wrote about Ramona, Beezus and Henry Huggins — kids on an ordinary street, which was revolutionary at the time.'),
    T(B, 'general', 'hard', 'Leroy Brown is a boy detective. What is his nickname?',
      'Encyclopedia Brown', ['Sherlock Junior', 'Dictionary Dan', 'Professor Brown'],
      'They call him Encyclopedia because his head is packed with facts — he solves a mystery in every chapter.'),
    T(B, 'general', 'medium', 'Paddington Bear originally came from which country?',
      'Peru', ['England', 'Spain', 'Canada'],
      'Paddington travelled from "darkest Peru" to London, where he was found at Paddington Station with a note: "Please look after this bear."'),
    T(A, 'general', 'easy', 'The person who stands at the front and directs an orchestra is called what?',
      'A conductor', ['A director', 'A captain', 'A drummer'],
      'The conductor keeps every musician together, setting the speed and the feeling with a baton.'),
    T(A, 'general', 'easy', 'Which instrument has black keys, white keys and pedals?',
      'The piano', ['The guitar', 'The trumpet', 'The violin'],
      'A piano has 88 keys — 52 white and 36 black, so there are more white ones.'),
    T(A, 'general', 'medium', 'The alphabet song has the same tune as which famous lullaby?',
      '"Twinkle, Twinkle, Little Star"', ['"Rock-a-bye Baby"', '"Happy Birthday"', '"Old MacDonald"'],
      'Sing them side by side — the ABC song and Twinkle Twinkle are note-for-note the same melody, which came from an old French folk tune.'),
  ];
}

const AUTHORED = [
  ['mathmcq', mathQuestions()],
  ['kidtrivia', kidTriviaQuestions()],
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

/* ---- corrections to the source banks ----
 * Applied by content-hash id, so they vanish harmlessly once the source is
 * fixed (the hash changes and the entry stops matching). */

// Two Test Tactics items mark the wrong choice: their own coach text names a
// different answer ("how many fewer" / "how many more"). Trust the coach.
const ANSWER_FIXES = {
  'testtactics:2a79aa32': 'how many fewer',
  'testtactics:db1aaed2': 'how many more',
};
// Items that are unsalvageable as quiz questions (e.g. the prompt itself says
// the answer: "A foggy, creaking house → eerie mood" asking for "Mood").
const EXCLUDE_IDS = new Set([
  'english:d3579fa4',
]);

for (const q of questions) {
  const want = ANSWER_FIXES[q.id];
  if (!want) continue;
  const target = q.choices.find(c => normalise(c.html) === normalise(want));
  if (!target) { console.warn(`  answer fix missed on ${q.id}`); continue; }
  for (const c of q.choices) delete c.ok;
  target.ok = true;
}
questions = questions.filter(q => !EXCLUDE_IDS.has(q.id));

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
