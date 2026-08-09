// The quiz: question selection, the modal, and grading.
//
// Question contract (same one PokéLearn uses, so imported banks drop straight in):
//   { id, subject, band, diff, q, choices: [{html, ok}], reveal }
// Numeric questions instead carry { numeric: <answer>, unit? } and no choices.
//
// The one rule that matters pedagogically: a wrong answer ALWAYS shows the
// right answer and why, before anything else in the game moves.

import { pick, shuffle, clamp, clamp01 } from './rng.js';
import { makeMathQuestion } from './mathgen.js';
import { rollingAccuracy, recordAnswer, dueMissed, missedIds, forgetMissed,
  duePrimed, forgetPrimed } from './save.js';
import { gradeNumeric, parseNumber } from './grading.js';

const $ = (id) => document.getElementById(id);

/* ============================ grading ============================ */

export const QUALITY_LABEL = {
  1: ['Correct!', 'Nailed it!', 'Exactly right!', 'Perfect!'],
  0.6: ['So close!', 'Almost!', 'Nearly there!'],
  0.3: ['Warm — but not quite.', 'Close-ish!'],
  0: ['Not quite — here is why:', 'Not this time. Here is the answer:'],
};

export { gradeNumeric, parseNumber } from './grading.js';

/* ============================ question pools ============================ */

const bank = () => (window.QBANK?.questions ?? []);

/** Fold the signpost questions into the bank so priming can find them by id. */
let signsRegistered = false;
export function registerSigns() {
  if (signsRegistered || !window.SIGNS || !window.QBANK) return;
  signsRegistered = true;
  for (const s of window.SIGNS) {
    if (bank().some(q => q.id === 'sign:' + s.id)) continue;
    window.QBANK.questions.push({
      id: 'sign:' + s.id, subject: s.subject, band: s.band, diff: s.diff,
      q: s.q, choices: s.choices, reveal: s.reveal,
    });
  }
}

const DIFF_ORDER = ['easy', 'medium', 'hard'];

// How long the Next button stays shut after answering, so the explanation gets
// read rather than skipped. A miss is the whole reason the explanation exists,
// so it holds longer than a correct answer.
const READ_HOLD_RIGHT = 3000;
const READ_HOLD_WRONG = 4000;

/* ---------------- subject rotation ----------------
 * Subjects are dealt from their own shuffled bag, and the bag is nudged so the
 * same subject never lands twice in a row. A battle therefore walks across
 * every topic instead of drilling one — which is both better practice and a lot
 * less boring than five history questions in a row. */

export const SUBJECTS = ['math', 'science', 'history', 'grammar', 'general'];
let subjectBag = [];
let lastSubject = null;

export function nextSubject() {
  if (!subjectBag.length) {
    subjectBag = shuffle(SUBJECTS);
    // a fresh shuffle must not hand back the subject we just used
    if (subjectBag[0] === lastSubject && subjectBag.length > 1) {
      [subjectBag[0], subjectBag[1]] = [subjectBag[1], subjectBag[0]];
    }
  }
  lastSubject = subjectBag.shift();
  return lastSubject;
}

/** Reset the rotation — used when a new encounter starts from a clean slate. */
export function resetSubjectRotation() { subjectBag = []; lastSubject = null; }

/** Nudge difficulty by how the player has been doing lately. */
function driftDifficulty(want, profile) {
  const acc = rollingAccuracy(profile);
  let i = DIFF_ORDER.indexOf(want);
  if (i < 0) i = 1;
  if (acc > 0.85) i = Math.min(2, i + 1);
  else if (acc < 0.45) i = Math.max(0, i - 1);
  return DIFF_ORDER[i];
}

// Signs "prime" their question so it shows up soon after you read them.
// Priming lives on the profile (js/save.js) so the promise a sign makes -
// "you'll see this again" - survives a reload and is a guarantee rather than a
// probability. Re-exported here so callers keep one import.
export { primeQuestion, primedCount } from './save.js';

/* ---------------- the question bag ----------------
 * Questions are dealt from a shuffled bag, not drawn at random: every question
 * in a pool comes up once before ANY of them comes up twice, and the bag is
 * saved with the profile so restarting the game doesn't restart the questions.
 * Pure random re-asks the same handful over and over, which is exactly what a
 * kid notices first. */

function bagKey(subject, band) { return subject + ':' + band; }

/** Every question that could ever be dealt for this pool, widest match first. */
function poolFor(subject, band) {
  const all = bank();
  const exact = all.filter(q => q.subject === subject && q.band === band);
  if (exact.length >= 8) return exact;
  const anyBand = all.filter(q => q.subject === subject);
  if (anyBand.length >= 8) return anyBand;
  return all;
}

/** Deal the next question from the bag, reshuffling when it runs dry. */
/** Put a drawn question back near the end of its bag, so it isn't lost. */
function returnToBag(profile, subject, band, q) {
  const bag = profile.bags?.[bagKey(subject, band)];
  if (Array.isArray(bag) && !bag.includes(q.id)) bag.push(q.id);
}

function dealFrom(profile, subject, band, preferDiff) {
  const pool = poolFor(subject, band);
  if (!pool.length) return null;

  profile.bags = profile.bags ?? {};
  const key = bagKey(subject, band);
  let bag = profile.bags[key];

  // (Re)fill when empty, or when the bank changed size under us (new import).
  const ids = pool.map(q => q.id);
  if (!Array.isArray(bag) || bag.length === 0) {
    bag = shuffle(ids);
    profile.bags[key] = bag;
  } else {
    // drop ids that no longer exist so a re-import can't wedge the bag
    bag = bag.filter(id => ids.includes(id));
    if (!bag.length) bag = shuffle(ids);
    profile.bags[key] = bag;
  }

  // Prefer the requested difficulty, but only from what's still in the bag —
  // taking out of order is fine, skipping the bag entirely is not.
  let idx = bag.findIndex(id => {
    const q = pool.find(x => x.id === id);
    return q && q.diff === preferDiff;
  });
  if (idx < 0) idx = 0;

  const id = bag.splice(idx, 1)[0];
  return pool.find(q => q.id === id) ?? null;
}

/**
 * Pick a question. Priority: a sign you just read > one you got wrong before >
 * the next card off the shuffled bag for this subject and band.
 */
/** A question this player has previously got wrong, for the STUDY move. */
export function pickMissedQuestion(profile) {
  const ids = missedIds(profile);
  for (const id of shuffle(ids)) {
    const q = bank().find(x => x.id === id);
    if (q) return { ...q, _retry: true };
  }
  return null;
}

/**
 * Pick a question.
 *
 * `allowLong` controls reading-comprehension questions, which carry a whole
 * passage. They are excellent practice but a 200-word read in the middle of a
 * battle kills the pace, so battles mostly skip them and the Study Tent
 * welcomes them.
 */
export function pickQuestion({ subject, difficulty, profile, zoneId, allowLong = 'rare' }) {
  const diff = driftDifficulty(difficulty, profile);

  // A sign you just read promised "you'll see this again soon", so it jumps the
  // queue: guaranteed inside SIGN_WITHIN encounters.
  for (const s of duePrimed(profile)) {
    const q = bank().find(x => x.id === s.id);
    forgetPrimed(profile, s.id);
    if (q) return { ...q, _primed: true };
  }

  // A question you got wrong is GUARANTEED to come back within a few
  // encounters, not left to a dice roll that might hide it for an hour.
  for (const m of dueMissed(profile)) {
    const q = bank().find(x => x.id === m.id);
    if (q) return { ...q, _retry: true };
    // The bank was regenerated and this question no longer exists. Drop it,
    // otherwise it sits in the list forever and can never be cleared.
    forgetMissed(profile, m.id);
  }


  // and it may also resurface early, which is only ever a bonus
  const missed = missedIds(profile);
  if (missed.length && Math.random() < 0.2) {
    const q = bank().find(x => x.id === pick(missed));
    if (q) return { ...q, _retry: true };
  }

  // Maths is generated fresh every time, so it can never repeat anyway.
  if (subject === 'math') return makeMathQuestion(profile.band, diff);

  const wantLong = allowLong === 'always' ? true
    : allowLong === 'never' ? false
    : Math.random() < 0.15;                    // 'rare': the odd one mid-battle

  for (let tries = 0; tries < 6; tries++) {
    const q = dealFrom(profile, subject, profile.band, diff);
    if (!q) break;
    if (!!q.long === wantLong || allowLong === 'always') return q;
    if (!q.long && !wantLong) return q;
    // drew the wrong length — keep it for later rather than burning it
    returnToBag(profile, subject, profile.band, q);
  }
  return dealFrom(profile, subject, profile.band, diff)
    ?? makeMathQuestion(profile.band, diff);   // never leave the player stuck
}

/** Progress through the current bag, for the pause menu / debug readout. */
export function bagStatus(profile, subject, band) {
  const pool = poolFor(subject, band);
  const left = profile.bags?.[bagKey(subject, band)]?.length ?? pool.length;
  return { left, total: pool.length };
}

/* ============================ the modal ============================ */

let modal = null;
function ensureModal() {
  if (modal) return modal;
  modal = document.createElement('div');
  modal.id = 'quiz';
  modal.className = 'hidden';
  modal.innerHTML = `
    <div class="qbox">
      <div class="qhead"><span id="qSubject"></span><span id="qTag"></span></div>
      <p id="qPrompt"></p>
      <div id="qChoices"></div>
      <form id="qNumForm" class="hidden">
        <input id="qNum" type="text" inputmode="decimal" autocomplete="off"
               autocorrect="off" spellcheck="false" placeholder="type your answer">
        <button type="submit" id="qNumGo">Answer</button>
      </form>
      <div id="qFeedback" class="qfb hidden"></div>
      <div id="qReveal" class="qreveal hidden"></div>
      <button id="qNext" class="hidden">Next ▶</button>
    </div>`;
  document.body.appendChild(modal);
  return modal;
}

const SUBJECT_LABEL = {
  math: '➗ Math', science: '🔬 Science', history: '🏛️ History',
  grammar: '✏️ English', general: '🌍 Trivia',
};

/**
 * Show a question and resolve with { quality, question }.
 * Never resolves before the player has seen the correct answer.
 */
export function ask(question, profile, { difficulty } = {}) {
  ensureModal();
  return new Promise((resolve) => {
    const qSubject = $('qSubject'), qTag = $('qTag'), qPrompt = $('qPrompt');
    const qChoices = $('qChoices'), qForm = $('qNumForm'), qNum = $('qNum');
    const qFb = $('qFeedback'), qRev = $('qReveal'), qNext = $('qNext');

    qSubject.textContent = SUBJECT_LABEL[question.subject] ?? question.subject ?? '';
    qTag.textContent = question._primed ? 'From a sign you read!'
      : question._retry ? 'You missed this one before' : (difficulty ?? '');
    qTag.className = question._primed ? 'tag primed' : question._retry ? 'tag retry' : 'tag';
    qPrompt.innerHTML = question.q;
    qFb.className = 'qfb hidden';
    qRev.className = 'qreveal hidden';
    qNext.classList.add('hidden');
    qChoices.innerHTML = '';
    modal.classList.remove('hidden');

    const finish = (quality) => {
      recordAnswer(profile, question.id, quality);
      const key = quality >= 1 ? 1 : quality >= 0.6 ? 0.6 : quality > 0 ? 0.3 : 0;
      qFb.textContent = (quality >= 1 ? '✅ ' : quality > 0 ? '🟡 ' : '❌ ') + pick(QUALITY_LABEL[key]);
      qFb.className = 'qfb ' + (quality >= 1 ? 'ok' : quality > 0 ? 'part' : 'no');
      qRev.innerHTML = revealHtml(question, quality);
      qRev.className = 'qreveal';
      qNext.classList.remove('hidden');

      // Hold Next shut briefly so the explanation actually gets read. Mashing
      // through the answer is exactly how a kid learns nothing from a miss, and
      // the pause matters most when they got it wrong.
      const holdMs = quality >= 1 ? READ_HOLD_RIGHT : READ_HOLD_WRONG;
      let left = Math.ceil(holdMs / 1000);
      qNext.disabled = true;
      qNext.classList.add('waiting');
      const label = () => { qNext.textContent = left > 0 ? `Read it… ${left}` : 'Next ▶'; };
      label();
      const tick = setInterval(() => { left--; label(); if (left <= 0) clearInterval(tick); }, 1000);
      const release = setTimeout(() => {
        clearInterval(tick);
        qNext.disabled = false;
        qNext.classList.remove('waiting');
        qNext.textContent = 'Next ▶';
        qNext.focus();
      }, holdMs);

      qNext.onclick = () => {
        if (qNext.disabled) return;
        clearTimeout(release);
        clearInterval(tick);
        modal.classList.add('hidden');
        resolve({ quality, question });
      };
    };

    if (question.numeric != null) {
      qForm.classList.remove('hidden');
      qNum.value = '';
      qNum.disabled = false;
      setTimeout(() => qNum.focus(), 60);
      qForm.onsubmit = (e) => {
        e.preventDefault();
        if (qNum.disabled) return;
        qNum.disabled = true;
        finish(gradeNumeric(parseNumber(qNum.value), question.numeric));
      };
    } else {
      qForm.classList.add('hidden');
      const choices = shuffle(question.choices);
      const btns = choices.map((c, i) => {
        const b = document.createElement('button');
        b.className = 'qchoice';
        b.innerHTML = `<span class="qletter">${'ABCD'[i]}</span><span>${c.html}</span>`;
        b.onclick = () => {
          btns.forEach((x, j) => {
            x.disabled = true;
            if (choices[j].ok) x.classList.add('right');
          });
          if (!c.ok) b.classList.add('wrong');
          finish(c.ok ? 1 : 0);
        };
        qChoices.appendChild(b);
        return b;
      });
    }
  });
}

function revealHtml(q, quality) {
  const answer = q.numeric != null
    ? `<h4>Answer: ${q.numeric}${q.unit ? ' ' + q.unit : ''}</h4>`
    : `<h4>Answer: ${(q.choices.find(c => c.ok) ?? {}).html ?? ''}</h4>`;
  const body = q.reveal ? `<p>${q.reveal}</p>` : '';
  const nudge = quality > 0 && quality < 1
    ? `<p class="closeNote">Your guess was close, so your move still had some power. Exact answers hit hardest.</p>`
    : '';
  return answer + body + nudge;
}

export const quizOpen = () => modal && !modal.classList.contains('hidden');
