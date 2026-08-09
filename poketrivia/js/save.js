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

/** Rolling accuracy over the last N answers — drives difficulty drift. */
export function recordAnswer(p, questionId, quality) {
  p.stats.asked++;
  if (quality >= 1) p.stats.right++;
  p.stats.recent.push(quality >= 1 ? 1 : quality > 0 ? 0.5 : 0);
  if (p.stats.recent.length > 12) p.stats.recent.shift();
  if (quality <= 0 && questionId && !p.missed.includes(questionId)) {
    p.missed.push(questionId);
    if (p.missed.length > 60) p.missed.shift();
  } else if (quality >= 1 && questionId) {
    const i = p.missed.indexOf(questionId);
    if (i >= 0) p.missed.splice(i, 1);   // beaten it — stop recycling
  }
}

export function rollingAccuracy(p) {
  const r = p.stats.recent;
  if (r.length < 4) return 0.6;
  return r.reduce((a, b) => a + b, 0) / r.length;
}
