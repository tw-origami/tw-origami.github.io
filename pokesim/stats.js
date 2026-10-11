// Battle Lab — the rules that keep an invented Pokémon grounded in the real thing.
//
// Pure functions only: no DOM, no storage, no engine. That keeps every rule here
// testable in Node and means the editor and the referee can't disagree about what
// is allowed.
//
// The numbers come from how real Pokémon are actually built:
//   * a base stat runs from 1 up to 255 (Blissey's HP is the real ceiling);
//   * a fully-evolved Pokémon's six base stats add up to roughly 500, the
//     "pseudo-legendaries" such as Dragonite sit at exactly 600, and legendaries run
//     from 580 to about 720. So 600 is a sensible budget for an ordinary Pokémon
//     and 720 for one the kids mark as legendary.

export const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
export const STAT_LABEL = {
  hp: 'HP', atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed',
};
export const STAT_BLURB = {
  hp: 'how much damage it can take',
  atk: 'power of physical moves (punches, bites, slams)',
  def: 'how well it shrugs off physical moves',
  spa: 'power of special moves (beams, blasts, magic)',
  spd: 'how well it shrugs off special moves',
  spe: 'who moves first each turn',
};

export const STAT_MIN = 1;
export const STAT_MAX = 255;
export const TOTAL_CAP = 600;
export const LEGEND_CAP = 720;
export const MAX_MOVES = 4;
export const LEVEL_MIN = 1;
export const LEVEL_MAX = 100;

export const total = (stats) => STAT_KEYS.reduce((n, k) => n + (Number(stats[k]) || 0), 0);
export const capFor = (legendary) => (legendary ? LEGEND_CAP : TOTAL_CAP);
export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/** What a total means, in the terms the real games use. */
export function tier(bst) {
  if (bst <= 300) return { label: 'First stage', note: 'like a Pichu or a Caterpie' };
  if (bst <= 400) return { label: 'Middle stage', note: 'like a Raichu or a Metapod' };
  if (bst <= 500) return { label: 'Fully evolved', note: 'a typical final-form Pokémon' };
  if (bst <= 580) return { label: 'Powerhouse', note: 'one of the stronger final forms' };
  if (bst <= 600) return { label: 'Pseudo-legendary', note: 'the strongest an ordinary Pokémon gets' };
  if (bst <= 680) return { label: 'Legendary', note: 'on the level of Mewtwo or Articuno' };
  return { label: 'Mythical', note: 'the very top of the scale' };
}

/** All the reasons these stats aren't allowed. Empty means fine. */
export function statProblems(stats, legendary) {
  const out = [];
  for (const k of STAT_KEYS) {
    const v = Number(stats[k]);
    if (!Number.isFinite(v) || v < STAT_MIN) out.push(`${STAT_LABEL[k]} must be at least ${STAT_MIN}.`);
    else if (v > STAT_MAX) out.push(`${STAT_LABEL[k]} can't go above ${STAT_MAX} — that's the highest any real Pokémon has.`);
  }
  const t = total(stats), cap = capFor(legendary);
  if (t > cap) out.push(`Total is ${t}, over the ${cap} limit. Take ${t - cap} away somewhere.`);
  return out;
}

/** Fit stats into the budget by shaving every stat in proportion — used by "scale to fit". */
export function scaleToBudget(stats, legendary) {
  const cap = capFor(legendary), t = total(stats);
  const out = {};
  const f = t > cap ? cap / t : 1;
  for (const k of STAT_KEYS) out[k] = clamp(Math.floor(stats[k] * f), STAT_MIN, STAT_MAX);
  // flooring can leave a little unspent — hand it back to the biggest stat
  let spare = cap - total(out);
  if (t > cap) {
    const big = STAT_KEYS.slice().sort((a, b) => out[b] - out[a]);
    for (const k of big) { const add = Math.min(spare, STAT_MAX - out[k]); out[k] += add; spare -= add; if (spare <= 0) break; }
  }
  return out;
}

/* ------------------------------------------------------------------ comparisons */

const shapeOf = (stats) => {
  const t = total(stats) || 1;
  return STAT_KEYS.map(k => stats[k] / t);
};
const dist = (a, b) => Math.sqrt(a.reduce((n, x, i) => n + (x - b[i]) ** 2, 0));

/**
 * Which real Pokémon is this most like? Two answers, because they mean different things:
 *   byStrength — the real Pokémon with the closest stat TOTAL ("about as strong as…")
 *   byShape    — among real Pokémon of similar strength, the one whose stats are
 *                distributed most alike ("built like…") — a speedy glass cannon vs a wall.
 */
export function compareToReal(stats, dex) {
  const t = total(stats);
  if (!dex?.length || !t) return { byStrength: null, byShape: null };
  const real = dex.map(d => ({ id: d.id, name: d.name, stats: d.stats, bst: total(d.stats) }));
  const me = shapeOf(stats);
  const shapeGap = (r) => dist(shapeOf(r.stats), me);
  // Several real Pokémon often share a total exactly (Snorlax and Gyarados are both 540), so a
  // tie on strength is settled by who is built more alike rather than by dex order.
  const byStrength = real.slice().sort((a, b) =>
    (Math.abs(a.bst - t) - Math.abs(b.bst - t)) || (shapeGap(a) - shapeGap(b)))[0];
  const near = real.filter(r => Math.abs(r.bst - t) <= 120);
  const pool = near.length >= 3 ? near : real;
  const byShape = pool.slice().sort((a, b) => shapeGap(a) - shapeGap(b))[0];
  return { byStrength, byShape };
}

/** A one-line read on how the stats are spent — a kid-friendly way to see trade-offs. */
export function describeBuild(stats) {
  const t = total(stats);
  if (!t) return '';
  const offense = Math.max(stats.atk, stats.spa);
  const bulk = stats.hp + stats.def + stats.spd;
  const parts = [];
  if (stats.spe >= 100) parts.push('fast');
  else if (stats.spe <= 50) parts.push('slow');
  if (bulk >= 270) parts.push('sturdy');
  else if (bulk <= 170) parts.push('fragile');
  if (offense >= 110) parts.push(stats.atk >= stats.spa ? 'hard-hitting' : 'blast-heavy');
  else if (offense <= 55) parts.push('weak-hitting');
  if (!parts.length) return 'a balanced all-rounder';
  return parts.join(', ');
}

/* ---------------------------------------------------------------------- types */

/**
 * How every attacking type fares against this typing. Returns multipliers grouped the
 * way players think about them: what it's weak to, what it resists, what can't touch it.
 */
export function defensiveProfile(types, chart, allTypes) {
  const weak = [], resist = [], immune = [];
  for (const atk of allTypes) {
    let m = 1;
    for (const def of types) m *= chart[atk]?.[def] ?? 1;
    if (m === 0) immune.push({ type: atk, mult: 0 });
    else if (m > 1) weak.push({ type: atk, mult: m });
    else if (m < 1) resist.push({ type: atk, mult: m });
  }
  weak.sort((a, b) => b.mult - a.mult);
  resist.sort((a, b) => a.mult - b.mult);
  return { weak, resist, immune };
}

/* ----------------------------------------------------------- invented moves */

export const CUSTOM_POWER_MIN = 20;
export const CUSTOM_POWER_MAX = 130;
export const CUSTOM_ACC_MIN = 50;

/**
 * An invented move is held to the same trade the real ones make: the harder it hits,
 * the less reliably. Thunderbolt is 90 power at 100%, Fire Blast 110 at 85%, Thunder
 * 110 at 70%. Power x accuracy therefore stays at or under 10,000, which is also why
 * Earthquake (100 at 100%) is the hardest-hitting move that never misses.
 */
export const maxAccuracyFor = (power) => clamp(Math.floor(10000 / Math.max(1, power)), CUSTOM_ACC_MIN, 100);

/** PP shrinks as power grows — Tackle has 35, Earthquake 10, Hyper Beam 5. */
export function ppFor(power) {
  if (power <= 40) return 30;
  if (power <= 60) return 25;
  if (power <= 80) return 20;
  if (power <= 95) return 15;
  if (power <= 110) return 10;
  return 5;
}

/** Turn whatever the form produced into a move that is guaranteed legal. */
export function normalizeCustomMove(raw, validTypes) {
  const label = String(raw?.label ?? '').replace(/\s+/g, ' ').trim().slice(0, 24);
  const type = validTypes.includes(raw?.type) ? raw.type : 'normal';
  const cls = raw?.cls === 'special' ? 'special' : 'physical';
  const power = clamp(Math.round(Number(raw?.power) || CUSTOM_POWER_MIN), CUSTOM_POWER_MIN, CUSTOM_POWER_MAX);
  const acc = clamp(Math.round(Number(raw?.acc) || 100), CUSTOM_ACC_MIN, maxAccuracyFor(power));
  return { label, type, cls, power, acc, pp: ppFor(power) };
}

export function customMoveProblems(m) {
  const out = [];
  if (!m.label) out.push('Give the move a name.');
  return out;
}

/* --------------------------------------------------------------- the whole mon */

export const NAME_MAX = 20;

/** Everything wrong with a Pokémon as it stands. Empty means it can be saved. */
export function monProblems(mon, validTypes) {
  const out = [];
  if (!String(mon.name ?? '').trim()) out.push('Give it a name.');
  if (!mon.types?.length) out.push('Pick at least one type.');
  else if (mon.types.some(t => !validTypes.includes(t))) out.push('One of its types isn’t a real type.');
  else if (mon.types.length === 2 && mon.types[0] === mon.types[1]) out.push('Its two types must be different.');
  const lv = Number(mon.level);
  if (!Number.isInteger(lv) || lv < LEVEL_MIN || lv > LEVEL_MAX) out.push(`Level must be ${LEVEL_MIN}–${LEVEL_MAX}.`);
  out.push(...statProblems(mon.stats ?? {}, !!mon.legendary));
  const n = mon.moves?.length ?? 0;
  if (n < 1) out.push('Pick at least one move.');
  if (n > MAX_MOVES) out.push(`A Pokémon can only know ${MAX_MOVES} moves.`);
  for (const m of mon.moves ?? []) if (m.custom) out.push(...customMoveProblems(m.custom));
  return out;
}
