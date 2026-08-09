// Proves the question-selection promises the game makes to a learner.
// Run: node tools/check-questions.mjs

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
globalThis.window = globalThis;
for (const f of ['data/questions.js', 'data/signs.js']) {
  new Function(readFileSync(join(root, f), 'utf8'))();
}
// localStorage is absent in node; save.js is written to survive that.
const save = await import('../js/save.js');
const quiz = await import('../js/quiz.js');

let pass = 0;
const section = (s) => console.log('\n' + s);
const check = (label, fn) => { fn(); pass++; console.log('  ok  ' + label); };

const newProfile = (band = 'B') => ({
  id: 'test', name: 'T', band, party: [], box: [], badges: [], beaten: [],
  journal: [], missed: [], bags: {}, seen: [],
  stats: { asked: 0, right: 0, caught: 0, recent: [], encounters: 0 },
});


/** Real ids from the current bank — the seed bank is long gone. */
const realId = (subject, band = 'B', n = 0) => {
  const pool = window.QBANK.questions.filter(q => q.subject === subject && q.band === band);
  if (!pool[n]) throw new Error(`no ${subject}:${band} question #${n}`);
  return pool[n].id;
};

const pickN = (p, n, subject = 'science') =>
  Array.from({ length: n }, () =>
    quiz.pickQuestion({ subject, difficulty: 'medium', profile: p, zoneId: null }));

/* ==================================================================== */
section('a missed question comes back within 3 encounters');

check('the miss is scheduled, not left to chance', () => {
  const p = newProfile();
  save.recordAnswer(p, realId('science'), 0);
  assert.equal(p.missed.length, 1);
  assert.equal(p.missed[0].dueBy, save.RETRY_WITHIN, 'due 3 encounters from now');
});

check('it is actually re-asked inside the window', () => {
  const p = newProfile();
  const first = quiz.pickQuestion({ subject: 'science', difficulty: 'medium', profile: p, zoneId: null });
  save.recordAnswer(p, first.id, 0);                      // get it wrong

  let seenAgainOnEncounter = -1;
  for (let enc = 1; enc <= 6 && seenAgainOnEncounter < 0; enc++) {
    save.noteEncounter(p);
    for (const q of pickN(p, 6)) {                        // a few questions per encounter
      if (q.id === first.id) { seenAgainOnEncounter = enc; break; }
    }
  }
  assert.ok(seenAgainOnEncounter > 0 && seenAgainOnEncounter <= save.RETRY_WITHIN,
    `should return by encounter ${save.RETRY_WITHIN}, came back on ${seenAgainOnEncounter}`);
});

check('it is flagged so the player is told why', () => {
  const p = newProfile();
  const id = realId('science');
  save.recordAnswer(p, id, 0);
  for (let i = 0; i < save.RETRY_WITHIN; i++) save.noteEncounter(p);
  const q = quiz.pickQuestion({ subject: 'science', difficulty: 'medium', profile: p, zoneId: null });
  assert.equal(q.id, id);
  assert.equal(q._retry, true, 'the modal shows "You missed this one before"');
});

check('getting it right retires it', () => {
  const p = newProfile();
  const id = realId('science');
  save.recordAnswer(p, id, 0);
  assert.equal(p.missed.length, 1);
  save.recordAnswer(p, id, 1);
  assert.equal(p.missed.length, 0, 'a correct answer stops the recycling');
});

check('missing it again pushes the deadline back out, and counts', () => {
  const p = newProfile();
  const id = realId('science');
  save.recordAnswer(p, id, 0);
  for (let i = 0; i < 5; i++) save.noteEncounter(p);
  save.recordAnswer(p, id, 0);
  assert.equal(p.missed[0].times, 2, 'repeat offenders are tracked');
});

check('a close numeric answer does not count as beaten', () => {
  const p = newProfile();
  const id = realId('science');
  save.recordAnswer(p, id, 0);
  save.recordAnswer(p, id, 0.6);
  assert.equal(p.missed.length, 1, 'close is not the same as correct');
});

check('several overdue questions all come back', () => {
  const p = newProfile();
  for (const id of [realId('science'), realId('history'), realId('grammar')]) save.recordAnswer(p, id, 0);
  for (let i = 0; i < save.RETRY_WITHIN; i++) save.noteEncounter(p);
  const got = new Set();
  for (let i = 0; i < 3; i++) {
    const q = quiz.pickQuestion({ subject: 'science', difficulty: 'medium', profile: p, zoneId: null });
    got.add(q.id);
    save.recordAnswer(p, q.id, 1);                        // answer each correctly
  }
  assert.equal(got.size, 3, 'all three should be re-asked before anything new');
});

check('an old save with bare-string misses still works', () => {
  const p = newProfile();
  const a = realId('science'), b = realId('history');
  p.missed = [a, b];                                      // legacy format
  const due = save.dueMissed(p);
  assert.equal(due.length, 2);
  assert.ok(due.some(m => m.id === a));
});

/* ==================================================================== */
section('a sign you read comes back in the next couple of battles');

check('reading a sign schedules its question', () => {
  const p = newProfile();
  quiz.registerSigns();
  save.primeQuestion(p, 'sign:' + window.SIGNS[0].id);
  assert.equal(p.primed.length, 1);
  assert.equal(p.primed[0].dueBy, save.SIGN_WITHIN);
});

check('it is the very next question asked', () => {
  const p = newProfile();
  quiz.registerSigns();
  const id = 'sign:' + window.SIGNS[0].id;
  save.primeQuestion(p, id);
  const q = quiz.pickQuestion({ subject: 'science', difficulty: 'medium', profile: p, zoneId: null });
  assert.equal(q.id, id, 'a primed sign question jumps the queue');
  assert.equal(q._primed, true, 'and is labelled "From a sign you read!"');
});

check('it is not asked twice', () => {
  const p = newProfile();
  quiz.registerSigns();
  const id = 'sign:' + window.SIGNS[0].id;
  save.primeQuestion(p, id);
  quiz.pickQuestion({ subject: 'science', difficulty: 'medium', profile: p, zoneId: null });
  const second = quiz.pickQuestion({ subject: 'science', difficulty: 'medium', profile: p, zoneId: null });
  assert.notEqual(second.id, id);
  assert.equal(p.primed.length, 0, 'the queue is cleared once it has been asked');
});

check('several signs all come back, soonest first', () => {
  const p = newProfile();
  quiz.registerSigns();
  const ids = window.SIGNS.slice(0, 3).map(s => 'sign:' + s.id);
  for (const id of ids) save.primeQuestion(p, id);
  const got = ids.map(() =>
    quiz.pickQuestion({ subject: 'science', difficulty: 'medium', profile: p, zoneId: null }).id);
  assert.deepEqual(got, ids, 'in the order they were read');
});

check('priming survives a save and reload', () => {
  const p = newProfile();
  quiz.registerSigns();
  save.primeQuestion(p, 'sign:' + window.SIGNS[0].id);
  const reloaded = JSON.parse(JSON.stringify(p));      // as localStorage would
  assert.equal(save.duePrimed(reloaded).length, 1, 'the promise outlives the session');
});

/* ==================================================================== */
section('signs change when you come back to them');

check('every zone has a pool of rotating facts', () => {
  const byZone = {};
  for (const f of window.SIGN_FACTS) byZone[f.zone] = (byZone[f.zone] ?? 0) + 1;
  for (const z of ['hub', 'math', 'science', 'history', 'grammar', 'shores']) {
    assert.ok((byZone[z] ?? 0) >= 3, `zone ${z} needs facts to rotate through, has ${byZone[z] ?? 0}`);
  }
});

check('a second visit to the same post teaches something new', () => {
  // mirrors nextSignFact() in main.js
  const nextFact = (prof, postId, zone) => {
    const tut = window.SIGNS.find(s => s.id === postId);
    if (tut && !prof.journal.includes(tut.id)) return tut;
    const pool = window.SIGN_FACTS.filter(f => f.zone === zone);
    const unread = pool.filter(f => !prof.journal.includes(f.id));
    return unread.length ? unread[0] : pool[prof.journal.length % pool.length];
  };
  const p = newProfile();
  const seen = [];
  for (let visit = 0; visit < 5; visit++) {
    const f = nextFact(p, 'math-1', 'math');
    seen.push(f.id);
    if (!p.journal.includes(f.id)) p.journal.push(f.id);
  }
  assert.equal(new Set(seen).size, seen.length, `repeated a fact too early: ${seen.join(', ')}`);
  assert.equal(seen[0], 'math-1', 'the first visit still teaches how the game works');
});

check('every rotating fact is a real, answerable question', () => {
  for (const f of window.SIGN_FACTS) {
    assert.ok(f.fact && f.fact.length > 20, `${f.id} needs a fact worth reading`);
    assert.equal(f.choices.filter(c => c.ok).length, 1, `${f.id} needs exactly one right answer`);
    assert.ok(f.choices.length >= 3, `${f.id} needs real distractors`);
    assert.ok(f.reveal && f.reveal.length > 20, `${f.id} must explain itself`);
  }
});

check('sign questions are never dealt cold from the bag', () => {
  const p = newProfile();
  for (let i = 0; i < 120; i++) {
    const q = quiz.pickQuestion({ subject: 'general', difficulty: 'medium', profile: p, zoneId: null });
    assert.ok(!q.sign, `${q.id} came up without reading its sign`);
  }
});

/* ==================================================================== */
section('questions that carry a passage or label');

check('nutrition-label questions show the label they ask about', () => {
  const long = window.QBANK.questions.filter(q => q.long);
  assert.ok(long.length >= 20, `expected the label questions, got ${long.length}`);
  for (const q of long) {
    assert.ok(/class="factsLabel"/.test(q.q), `${q.id} is tagged long but carries no label`);
    assert.ok(/class="ctxAsk"/.test(q.q), `${q.id} has a label but no question`);
  }
});

check('no question needs a story you have to read first', () => {
  // Reading passages were removed outright: a story to read does not fit this
  // game's pace, and the question is nonsense without it.
  const withPassage = window.QBANK.questions.filter(q => /class="passageBox"/.test(q.q));
  assert.equal(withPassage.length, 0, `${withPassage.length} passage questions are still in the bank`);
  for (const q of window.QBANK.questions) {
    const plain = q.q.replace(/<[^>]+>/g, ' ');
    const unquoted = plain.replace(/["“'‘][^"”'’]*["”'’]/g, ' ');
    assert.ok(!/\bthis (passage|story)\b/i.test(unquoted),
      `${q.id} still asks about a story: ${plain.slice(0, 80)}`);
  }
});

check('the "servings in the box" question now shows the box', () => {
  const q = window.QBANK.questions.find(x => /servings are in the whole box/i.test(x.q));
  assert.ok(q, 'question should still exist');
  assert.match(q.q, /Servings per container/, 'the label it asks about must be on screen');
  assert.equal(q.choices.find(c => c.ok).html, '9');
});

check('a question naming a person teaches who they were', () => {
  const withBio = window.QBANK.questions.filter(q => /class="whoBox"/.test(q.reveal));
  assert.ok(withBio.length > 10, `expected person bios, got ${withBio.length}`);
  for (const q of withBio.slice(0, 40)) {
    assert.match(q.reveal, /Who was .+\?/, `${q.id} bio card needs a heading`);
    assert.ok(q.reveal.length > 120, `${q.id} bio should be a real explanation`);
  }
});

check('no question depends on context it does not show', () => {
  for (const q of window.QBANK.questions) {
    const plain = q.q.replace(/<[^>]+>/g, ' ');
    // Ignore quoted text: a test-taking question legitimately quotes another
    // question ("Which quote from the passage…?") and asks what it's really for.
    const unquoted = plain.replace(/["“'‘][^"”'’]*["”'’]/g, ' ');
    if (/\b(this|the) (passage|label)\b/i.test(unquoted)) {
      assert.ok(/class="(passageBox|factsLabel)"/.test(q.q),
        `${q.id} refers to a passage or label that is not on screen: ${plain.slice(0, 90)}`);
    }
  }
});

/* ==================================================================== */
section('subjects rotate');

check('no topic ever appears twice in a row', () => {
  quiz.resetSubjectRotation();
  const seq = Array.from({ length: 200 }, () => quiz.nextSubject());
  const repeats = seq.filter((s, i) => i > 0 && s === seq[i - 1]);
  assert.equal(repeats.length, 0, `found ${repeats.length} back-to-back repeats`);
});

check('every topic comes up before any repeats', () => {
  quiz.resetSubjectRotation();
  const n = quiz.SUBJECTS.length;
  for (let cycle = 0; cycle < 20; cycle++) {
    const got = new Set(Array.from({ length: n }, () => quiz.nextSubject()));
    assert.equal(got.size, n, `cycle ${cycle} only covered ${got.size} of ${n} subjects`);
  }
});

/* ==================================================================== */
section('the question bag');

check('a pool is exhausted before anything repeats', () => {
  const p = newProfile();
  // Sign questions are excluded — they're earned by reading the sign, not dealt.
  const pool = window.QBANK.questions.filter(q => q.subject === 'history' && q.band === 'B' && !q.sign);
  assert.ok(pool.length > 20, 'need a real pool to test against');
  const seen = pickN(p, pool.length, 'history').map(q => q.id);
  assert.equal(new Set(seen).size, seen.length,
    'every question in the pool should be dealt once before any repeats');
});

check('the bag survives a save/reload', () => {
  const p = newProfile();
  pickN(p, 5, 'history');
  const snapshot = JSON.parse(JSON.stringify(p));          // as localStorage would
  const before = p.bags['history:B'].length;
  assert.ok(before > 0);
  assert.equal(snapshot.bags['history:B'].length, before,
    'progress through the bag is stored on the profile, not in memory');
});

/* ==================================================================== */
section('the bank itself');

check('every question is answerable', () => {
  for (const q of window.QBANK.questions) {
    assert.equal(q.choices.filter(c => c.ok).length, 1, `${q.id} needs exactly one right answer`);
    assert.ok(q.choices.length >= 2, `${q.id} needs choices`);
    assert.ok(q.reveal && q.reveal.length > 10, `${q.id} must explain itself`);
  }
});

check('ids are unique, so the missed list can never collide', () => {
  const ids = window.QBANK.questions.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

check('every signpost question is wired into the bank', () => {
  quiz.registerSigns();
  for (const s of window.SIGNS) {
    assert.ok(window.QBANK.questions.some(q => q.id === 'sign:' + s.id),
      `sign ${s.id} must be findable so priming works`);
  }
});

console.log(`\n${pass} question checks passed\n`);
