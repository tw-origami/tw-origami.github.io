// One settings/progress blob in localStorage.
//
// Same two rules as the other Learn Zone games, both deliberate:
//   1. Every access is try/caught — Safari private browsing throws on write,
//      and the game must stay playable when it does (in-memory fallback).
//   2. Only ids and numbers are stored. No names, no free text: this folder
//      ends up published in a public repo like the other apps.

const KEY = 'monstertruck.v1';

let memory = null;   // fallback when localStorage is unavailable

function fresh() {
  return {
    truck: 'red',
    mode: null,               // last mode played, preselected next visit
    autoCruise: true,         // truck rolls on its own; steering is the game
    stars: { shapes: 0, colors: 0, letters: 0, numbers: 0, mix: 0 },
    mastery: {},              // target id -> times found with no wrong gates
  };
}

export function load() {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? JSON.parse(raw) : fresh();
  } catch {
    memory = fresh();
  }
  // older saves grow new fields in place
  const base = fresh();
  for (const k of Object.keys(base)) if (memory[k] === undefined) memory[k] = base[k];
  return memory;
}

export function patch(changes) {
  const s = load();
  Object.assign(s, changes);
  flush();
  return s;
}

export function flush() {
  try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* private mode */ }
}
