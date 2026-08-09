// Profiles and progress in localStorage.
//
// Two rules, both deliberate:
//   1. Every access is try/caught — Safari private browsing throws on write,
//      and the game must stay playable when it does (in-memory fallback).
//   2. Only ids and numbers are stored. Kids' names live here and NOWHERE in
//      the repo, because this folder may end up published like the other apps.

const KEY = 'poketrivia.v1';

let memory = null;   // fallback when localStorage is unavailable

function readAll() {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? JSON.parse(raw) : { profiles: [], last: null };
  } catch {
    memory = { profiles: [], last: null };
  }
  if (!Array.isArray(memory.profiles)) memory.profiles = [];
  return memory;
}

function flush() {
  try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* private mode */ }
}

export function listProfiles() { return readAll().profiles.map(p => ({ ...p })); }

export function newProfile(name, band) {
  const all = readAll();
  const p = {
    id: 'p' + (all.profiles.length + 1) + '-' + Math.floor(Math.random() * 1e6).toString(36),
    name: (name || 'Trainer').slice(0, 12),
    band,                     // 'A' (grades 3-4) or 'B' (grades 5-6+)
    created: Date.now(),
    party: [],                // [{dex, level, xp, hp}]
    box: [],                  // caught beyond the party
    badges: [],               // zone ids
    beaten: [],               // trainer ids
    journal: [],              // sign ids read
    missed: [],               // question ids answered wrong
    bags: {},                 // 'subject:band' -> shuffled ids not yet dealt
    seen: [],                 // dex ids encountered
    stats: { asked: 0, right: 0, caught: 0, recent: [] },
    at: { x: 0, z: 24 },
  };
  all.profiles.push(p);
  all.last = p.id;
  flush();
  return p;
}

export function loadProfile(id) {
  const all = readAll();
  return all.profiles.find(p => p.id === id) ?? null;
}

export function lastProfile() {
  const all = readAll();
  return all.last ? loadProfile(all.last) : null;
}

export function saveProfile(p) {
  const all = readAll();
  const i = all.profiles.findIndex(x => x.id === p.id);
  if (i >= 0) all.profiles[i] = p; else all.profiles.push(p);
  all.last = p.id;
  flush();
}

export function deleteProfile(id) {
  const all = readAll();
  all.profiles = all.profiles.filter(p => p.id !== id);
  if (all.last === id) all.last = all.profiles[0]?.id ?? null;
  flush();
}

/** How many encounters a missed question may hide for before it MUST come back. */
export const RETRY_WITHIN = 3;

/** Bump the encounter counter. Called once at the start of every battle/catch. */
export function noteEncounter(p) {
  p.stats.encounters = (p.stats.encounters ?? 0) + 1;
  return p.stats.encounters;
}

/** Older saves stored missed questions as bare id strings. */
function normaliseMissed(p) {
  if (!Array.isArray(p.missed)) { p.missed = []; return p.missed; }
  const now = p.stats?.encounters ?? 0;
  p.missed = p.missed.map(m =>
    typeof m === 'string' ? { id: m, dueBy: now, times: 1 } : m).filter(m => m && m.id);
  return p.missed;
}

/**
 * Record an answer. A miss is scheduled to come back within RETRY_WITHIN
 * encounters — not left to a random draw, which could hide it for an hour.
 * Getting it right retires it.
 */
export function recordAnswer(p, questionId, quality) {
  p.stats.asked++;
  if (quality >= 1) p.stats.right++;
  p.stats.recent.push(quality >= 1 ? 1 : quality > 0 ? 0.5 : 0);
  if (p.stats.recent.length > 12) p.stats.recent.shift();

  if (!questionId) return;                     // generated maths has no stable id
  const missed = normaliseMissed(p);
  const now = p.stats.encounters ?? 0;
  const at = missed.findIndex(m => m.id === questionId);

  if (quality <= 0) {
    if (at >= 0) {
      missed[at].times++;
      missed[at].dueBy = Math.min(missed[at].dueBy, now + RETRY_WITHIN);
    } else {
      missed.push({ id: questionId, dueBy: now + RETRY_WITHIN, times: 1 });
    }
    if (missed.length > 60) missed.shift();
  } else if (quality >= 1 && at >= 0) {
    missed.splice(at, 1);                      // beaten it — stop recycling
  }
}

/* ---------------- signs you've read ----------------
 * Reading a sign tells the player "you'll see this again soon", so it has to be
 * a promise, not a dice roll. Same mechanism as a missed question but a tighter
 * window, and stored on the profile so it survives a reload. */

export const SIGN_WITHIN = 2;

function normalisePrimed(p) {
  if (!Array.isArray(p.primed)) p.primed = [];
  const now = p.stats?.encounters ?? 0;
  p.primed = p.primed
    .map(x => (typeof x === 'string' ? { id: x, dueBy: now + SIGN_WITHIN } : x))
    .filter(x => x && x.id);
  return p.primed;
}

/** Queue a sign's question to appear within the next couple of encounters. */
export function primeQuestion(p, id) {
  const list = normalisePrimed(p);
  const now = p.stats?.encounters ?? 0;
  const at = list.findIndex(x => x.id === id);
  if (at >= 0) list[at].dueBy = Math.min(list[at].dueBy, now + SIGN_WITHIN);
  else list.push({ id, dueBy: now + SIGN_WITHIN });
  if (list.length > 12) list.shift();
}

/** Primed sign questions, soonest deadline first. */
export function duePrimed(p) {
  return normalisePrimed(p).slice().sort((a, b) => a.dueBy - b.dueBy);
}

export function forgetPrimed(p, id) {
  const list = normalisePrimed(p);
  const at = list.findIndex(x => x.id === id);
  if (at >= 0) list.splice(at, 1);
}

export const primedCount = (p) => normalisePrimed(p).length;

/** Missed questions whose deadline has arrived, longest-waiting first. */
export function dueMissed(p) {
  const now = p.stats?.encounters ?? 0;
  return normaliseMissed(p)
    .filter(m => m.dueBy <= now)
    .sort((a, b) => (a.dueBy - b.dueBy) || (b.times - a.times));
}

export const missedIds = (p) => normaliseMissed(p).map(m => m.id);

/** Drop a missed entry — used when its question no longer exists in the bank. */
export function forgetMissed(p, id) {
  const missed = normaliseMissed(p);
  const at = missed.findIndex(m => m.id === id);
  if (at >= 0) missed.splice(at, 1);
}

export function rollingAccuracy(p) {
  const r = p.stats.recent;
  if (r.length < 4) return 0.6;
  return r.reduce((a, b) => a + b, 0) / r.length;
}
