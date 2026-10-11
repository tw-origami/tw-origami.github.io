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
const VALUE_CAP = 100;        // power x accuracy x (effect worth) x (hits): the most a move may be worth

// The stats a move or ability can name, with the names PokéAPI/the engine use.
export const FX_STATS = [
  { id: 'attack', key: 'atk', label: 'Attack' }, { id: 'defense', key: 'def', label: 'Defense' },
  { id: 'special-attack', key: 'spa', label: 'Sp. Atk' }, { id: 'special-defense', key: 'spd', label: 'Sp. Def' },
  { id: 'speed', key: 'spe', label: 'Speed' },
];
const statLabel = (id) => FX_STATS.find(x => x.id === id || x.key === id)?.label ?? id;
export const AILMENTS = {
  burn: 'burn', paralysis: 'paralyze', poison: 'poison', sleep: 'put to sleep', freeze: 'freeze', confusion: 'confuse',
};

/**
 * What a move can do besides hurt. Every option maps onto something the battle engine really
 * simulates (nothing here is decoration), and each is priced the way the real games price it —
 * a move that burns, drains, or raises your stats is worth more, so it is allowed less raw power.
 * The examples are real moves that sit at the same trade.
 */
export const ATTACK_EFFECTS = [
  { id: 'none',     label: 'No extra effect', example: 'Tackle, Earthquake' },
  { id: 'status',   label: 'Chance to inflict a condition', example: 'Flamethrower (10% burn), Body Slam (30% paralysis)' },
  { id: 'dropFoe',  label: 'Chance to lower the foe’s stat', example: 'Psychic, Shadow Ball, Crunch' },
  { id: 'flinch',   label: 'Chance to make the foe flinch', example: 'Bite, Rock Slide, Waterfall' },
  { id: 'raiseSelf', label: 'Raises its own stat after hitting', example: 'Power-Up Punch, Flame Charge' },
  { id: 'lowerSelf', label: 'Hits hard but lowers its own stats', example: 'Overheat, Close Combat, Draco Meteor' },
  { id: 'drain',    label: 'Heals you by half the damage', example: 'Giga Drain, Drain Punch' },
  { id: 'recoil',   label: 'Hits hard but hurts you back', example: 'Brave Bird, Flare Blitz, Double-Edge' },
  { id: 'multi',    label: 'Hits several times', example: 'Fury Swipes, Double Kick' },
  { id: 'crit',     label: 'Often a critical hit', example: 'Slash, Stone Edge' },
  { id: 'priority', label: 'Goes first', example: 'Quick Attack, Aqua Jet, Extreme Speed' },
];
export const STATUS_EFFECTS = [
  { id: 'inflict', label: 'Inflicts a condition', example: 'Thunder Wave, Will-O-Wisp, Hypnosis' },
  { id: 'buff',    label: 'Raises its own stats', example: 'Swords Dance, Calm Mind, Agility' },
  { id: 'debuff',  label: 'Lowers the foe’s stat', example: 'Growl, Screech, Leer' },
  { id: 'heal',    label: 'Heals half its HP', example: 'Recover, Slack Off' },
];

const clampInt = (v, lo, hi, d) => clamp(Math.round(Number(v)) || d, lo, hi);

/** Strip whatever the form sent down to a legal effect description. */
export function normalizeFx(raw, cls) {
  const id = String(raw?.id ?? 'none');
  const stat = (v, d) => (FX_STATS.some(x => x.id === v) ? v : d);
  if (cls === 'status') {
    switch (id) {
      case 'inflict': {
        const ailment = ['sleep', 'paralysis', 'burn', 'poison', 'confusion'].includes(raw?.ailment) ? raw.ailment : 'paralysis';
        return { id, ailment };
      }
      case 'buff': {
        const stages = clampInt(raw?.stages, 1, 2, 2);
        const a = stat(raw?.stat, 'attack');
        const b = raw?.stat2 && raw.stat2 !== a ? stat(raw.stat2, '') : '';
        // +2 to one stat, or +1 to two — the two shapes real buff moves come in
        return b ? { id, stat: a, stat2: b, stages: 1 } : { id, stat: a, stages };
      }
      case 'debuff': return { id, stat: stat(raw?.stat, 'attack'), stages: clampInt(raw?.stages, 1, 2, 1) };
      case 'heal':   return { id };
      default:       return { id: 'inflict', ailment: 'paralysis' };
    }
  }
  const chance = (d) => ([10, 20, 30].includes(Number(raw?.chance)) ? Number(raw.chance) : d);
  switch (id) {
    case 'status': {
      const ailment = ['burn', 'paralysis', 'poison', 'freeze', 'confusion'].includes(raw?.ailment) ? raw.ailment : 'burn';
      return { id, ailment, chance: ailment === 'freeze' ? 10 : chance(10) };      // real freeze chances are 10%
    }
    case 'dropFoe':  return { id, stat: stat(raw?.stat, 'special-defense'), chance: chance(10) };
    case 'flinch':   return { id, chance: chance(20) };
    case 'raiseSelf': return { id, stat: stat(raw?.stat, 'attack') };
    case 'lowerSelf': {
      const a = stat(raw?.stat, 'special-attack');
      const b = raw?.stat2 && raw.stat2 !== a ? stat(raw.stat2, '') : '';
      return b ? { id, stat: a, stat2: b, stages: 1 } : { id, stat: a, stages: clampInt(raw?.stages, 1, 2, 2) };
    }
    case 'drain':    return { id };
    case 'recoil':   return { id, pct: [25, 33, 50].includes(Number(raw?.pct)) ? Number(raw.pct) : 25 };
    case 'multi':    return { id, hits: raw?.hits === 'two' ? 'two' : 'range' };
    case 'crit':     return { id };
    case 'priority': return { id, prio: Number(raw?.prio) === 2 ? 2 : 1 };
    default:         return { id: 'none' };
  }
}

/** What an effect adds to (or takes from) a move's worth, and how many hits it lands. */
export function fxWorth(fx) {
  const w = { bonus: 1, hits: 1 };
  switch (fx.id) {
    case 'status':   w.bonus = 1 + (fx.chance / 100) * 0.5 * (fx.ailment === 'freeze' ? 1.4 : 1); break;
    case 'dropFoe':  w.bonus = 1 + (fx.chance / 100) * 0.3; break;
    case 'flinch':   w.bonus = 1 + (fx.chance / 100) * 0.4; break;
    case 'raiseSelf': w.bonus = 1.25; break;
    case 'lowerSelf': w.bonus = (fx.stat2 || fx.stages === 2) ? 0.82 : 0.9; break;
    case 'drain':    w.bonus = 1.18; break;
    case 'recoil':   w.bonus = { 25: 0.88, 33: 0.82, 50: 0.7 }[fx.pct]; break;
    case 'multi':    w.hits = fx.hits === 'two' ? 2 : 3.1; break;
    case 'crit':     w.bonus = 1.1; break;
    default: break;
  }
  return w;
}

/** Highest power an attack with this effect can have. A priority move is held far lower. */
export function maxPowerFor(fx) {
  if (fx?.id === 'priority') return fx.prio === 2 ? 80 : 50;           // Quick Attack 40, Extreme Speed 80
  const { bonus, hits } = fxWorth(fx ?? { id: 'none' });
  return clamp(Math.floor(VALUE_CAP / (0.5 * bonus * hits)), CUSTOM_POWER_MIN, CUSTOM_POWER_MAX);
}

/** Highest accuracy that power allows. Reduces to the old rule when there is no effect. */
export function maxAccuracyFor(power, fx) {
  if (fx?.id === 'priority') return 100;
  const { bonus, hits } = fxWorth(fx ?? { id: 'none' });
  return clamp(Math.floor(10000 / Math.max(1, power * bonus * hits)), CUSTOM_ACC_MIN, 100);
}

/** PP shrinks as power grows — Tackle has 35, Earthquake 10, Hyper Beam 5. */
export function ppFor(power) {
  if (power <= 40) return 30;
  if (power <= 60) return 25;
  if (power <= 80) return 20;
  if (power <= 95) return 15;
  if (power <= 110) return 10;
  return 5;
}

// Real accuracy ceilings for status moves: Hypnosis 60, Sleep Powder 75, Will-O-Wisp 85, Toxic 90.
const STATUS_ACC = { sleep: 75, burn: 85, poison: 90, paralysis: 100, confusion: 100 };
const STATUS_PP = { sleep: 15, burn: 15, poison: 15, paralysis: 20, confusion: 10 };

/** Turn whatever the form produced into a move that is guaranteed legal. */
export function normalizeCustomMove(raw, validTypes) {
  const label = String(raw?.label ?? '').replace(/\s+/g, ' ').trim().slice(0, 24);
  const type = validTypes.includes(raw?.type) ? raw.type : 'normal';
  const isStatus = raw?.cls === 'status';
  if (isStatus) {
    const fx = normalizeFx(raw?.fx, 'status');
    let acc = null, pp = 20;
    if (fx.id === 'inflict') {
      acc = clamp(Math.round(Number(raw?.acc)) || STATUS_ACC[fx.ailment], CUSTOM_ACC_MIN, STATUS_ACC[fx.ailment]);
      pp = STATUS_PP[fx.ailment];
    } else if (fx.id === 'debuff') {
      acc = fx.stages === 2 ? 85 : 100; pp = 20;                          // Growl 100, Screech 85
    } else if (fx.id === 'heal') pp = 10;                                  // Recover
    return { label, type, cls: 'status', power: 0, acc, pp, fx };
  }
  const cls = raw?.cls === 'special' ? 'special' : 'physical';
  const fx = normalizeFx(raw?.fx, cls);
  const power = clamp(Math.round(Number(raw?.power) || CUSTOM_POWER_MIN), CUSTOM_POWER_MIN, maxPowerFor(fx));
  const acc = fx.id === 'priority' ? 100
    : clamp(Math.round(Number(raw?.acc) || 100), CUSTOM_ACC_MIN, maxAccuracyFor(power, fx));
  return { label, type, cls, power, acc, pp: ppFor(power), fx };
}

export function customMoveProblems(m) {
  const out = [];
  if (!m.label) out.push('Give the move a name.');
  return out;
}

/** A sentence saying exactly what the move does — shown in the editor and the move list. */
export function describeMove(c) {
  const fx = c.fx ?? { id: 'none' };
  const bits = [];
  if (c.cls === 'status') {
    switch (fx.id) {
      case 'inflict': bits.push(`${cap(AILMENTS[fx.ailment])} the target${c.acc ? ` (${c.acc}% accurate)` : ''}.`); break;
      case 'buff': bits.push(`Raises its own ${statLabel(fx.stat)}${fx.stat2 ? ` and ${statLabel(fx.stat2)}` : ''} by ${fx.stages === 2 ? 'two stages' : 'one stage'}.`); break;
      case 'debuff': bits.push(`Lowers the target’s ${statLabel(fx.stat)} by ${fx.stages === 2 ? 'two stages' : 'one stage'}.`); break;
      case 'heal': bits.push('Restores half of its max HP.'); break;
    }
    return bits.join(' ');
  }
  bits.push(`${c.power} power${fx.id === 'multi' ? ' per hit' : ''}, ${c.acc}% accurate.`);
  switch (fx.id) {
    case 'status': bits.push(`${fx.chance}% chance to ${AILMENTS[fx.ailment]} the target.`); break;
    case 'dropFoe': bits.push(`${fx.chance}% chance to lower the target’s ${statLabel(fx.stat)}.`); break;
    case 'flinch': bits.push(`${fx.chance}% chance to make the target flinch.`); break;
    case 'raiseSelf': bits.push(`Raises its own ${statLabel(fx.stat)} by one stage.`); break;
    case 'lowerSelf': bits.push(`Lowers its own ${statLabel(fx.stat)}${fx.stat2 ? ` and ${statLabel(fx.stat2)}` : ''} by ${fx.stat2 || fx.stages === 1 ? 'one stage' : 'two stages'}.`); break;
    case 'drain': bits.push('Heals the user by half the damage dealt.'); break;
    case 'recoil': bits.push(`The user takes ${fx.pct}% of the damage back.`); break;
    case 'multi': bits.push(fx.hits === 'two' ? 'Hits twice.' : 'Hits two to five times.'); break;
    case 'crit': bits.push('High chance of a critical hit.'); break;
    case 'priority': bits.push(`Goes first${fx.prio === 2 ? ' (+2 priority)' : ''}.`); break;
  }
  return bits.join(' ');
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** The record the battle engine reads. The engine's field names are PokéAPI's. */
export function toEngineMove(c, key) {
  const fx = c.fx ?? { id: 'none' };
  const rec = {
    name: key, label: c.label, type: c.type, power: c.cls === 'status' ? 0 : c.power, acc: c.acc ?? null,
    class: c.cls, pp: c.pp, prio: 0, target: 'selected-pokemon', cat: 'damage', ailment: null, ailChance: 0,
    stats: [], statChance: 0, drain: 0, heal: 0, flinch: 0, critRate: 0, hits: null, turns: null,
    short: describeMove(c), invented: true,
  };
  const st = (id, stage) => ({ stat: id, stage });
  switch (fx.id) {
    case 'inflict': rec.cat = 'ailment'; rec.ailment = fx.ailment; break;
    case 'buff': rec.cat = 'net-good-stats'; rec.target = 'user';
      rec.stats = [st(fx.stat, fx.stages), ...(fx.stat2 ? [st(fx.stat2, 1)] : [])]; break;
    case 'debuff': rec.cat = 'net-good-stats'; rec.stats = [st(fx.stat, -fx.stages)]; break;
    case 'heal': rec.cat = 'heal'; rec.target = 'user'; rec.heal = 50; break;
    case 'status': rec.cat = 'damage-ailment'; rec.ailment = fx.ailment; rec.ailChance = fx.chance; break;
    case 'dropFoe': rec.cat = 'damage-lower'; rec.stats = [st(fx.stat, -1)]; rec.statChance = fx.chance; break;
    case 'flinch': rec.flinch = fx.chance; break;
    case 'raiseSelf': rec.cat = 'damage-raise'; rec.stats = [st(fx.stat, 1)]; break;
    case 'lowerSelf': rec.cat = 'damage-raise';
      rec.stats = [st(fx.stat, -fx.stages), ...(fx.stat2 ? [st(fx.stat2, -1)] : [])]; break;
    case 'drain': rec.cat = 'damage-heal'; rec.drain = 50; break;
    case 'recoil': rec.drain = -fx.pct; break;
    case 'multi': rec.hits = fx.hits === 'two' ? [2, 2] : [2, 5]; break;
    case 'crit': rec.critRate = 1; break;
    case 'priority': rec.prio = fx.prio; break;
    default: break;
  }
  return rec;
}

/* --------------------------------------------------------- invented abilities */

/**
 * An ability is built from the effects the engine actually has, the same ones the real abilities
 * use — so "make your own ability" means choosing a real mechanic and naming it. There is no
 * free-form option: anything the engine can't simulate would be a promise the game can't keep.
 */
export const ABILITY_KINDS = [
  { id: 'intimidate', label: 'Weakens the foe when it comes out', example: 'Intimidate', params: ['stat'] },
  { id: 'weather', label: 'Changes the weather when it comes out', example: 'Drizzle, Drought, Sand Stream', params: ['weather'] },
  { id: 'pinch', label: 'Powers up one type when it is low on HP', example: 'Blaze, Torrent, Overgrow', params: ['type'] },
  { id: 'immune', label: 'Immune to one type of move', example: 'Levitate', params: ['type'] },
  { id: 'absorb', label: 'Absorbs one type of move and heals from it', example: 'Volt Absorb, Water Absorb', params: ['type'] },
  { id: 'contact', label: 'May give a condition to anything that hits it up close', example: 'Static, Flame Body, Poison Point', params: ['ailment3'] },
  { id: 'thorns', label: 'Hurts anything that hits it up close', example: 'Rough Skin' },
  { id: 'block', label: 'Can never suffer one condition', example: 'Limber, Insomnia, Water Veil', params: ['ailment5'] },
  { id: 'speedWeather', label: 'Twice as fast in one kind of weather', example: 'Swift Swim, Chlorophyll', params: ['weather'] },
  { id: 'sturdy', label: 'Survives a knockout blow from full health', example: 'Sturdy' },
  { id: 'noCrit', label: 'Can’t be hit by critical hits', example: 'Battle Armor, Shell Armor' },
  { id: 'aim', label: 'Its moves are more accurate', example: 'Compound Eyes' },
  { id: 'guard', label: 'Foes can’t lower its stats', example: 'Clear Body, Hyper Cutter', params: ['statAny'] },
  { id: 'shield', label: 'Immune to the extra effects of attacks', example: 'Shield Dust' },
  { id: 'power', label: 'Its Attack is boosted', example: 'Huge Power, Hustle', params: ['mult'] },
];
export const WEATHERS = [{ id: 'rain', label: 'rain' }, { id: 'sun', label: 'harsh sunlight' }, { id: 'sand', label: 'a sandstorm' }];
const AIL3 = ['burn', 'paralysis', 'poison'];
const AIL5 = ['paralysis', 'burn', 'sleep', 'poison', 'freeze', 'confusion'];
const typeOk = (t, valid) => (valid.includes(t) ? t : 'normal');

export function normalizeCustomAbility(raw, validTypes) {
  const label = String(raw?.label ?? '').replace(/\s+/g, ' ').trim().slice(0, 24);
  const kind = ABILITY_KINDS.some(k => k.id === raw?.kind) ? raw.kind : 'intimidate';
  const out = { label, kind };
  switch (kind) {
    case 'intimidate': out.stat = FX_STATS.some(x => x.id === raw?.stat) ? raw.stat : 'attack'; break;
    case 'weather': case 'speedWeather': out.weather = WEATHERS.some(w => w.id === raw?.weather) ? raw.weather : 'rain'; break;
    case 'pinch': case 'immune': case 'absorb': out.type = typeOk(raw?.type, validTypes); break;
    case 'contact': out.ailment = AIL3.includes(raw?.ailment) ? raw.ailment : 'paralysis'; break;
    case 'block': out.ailment = AIL5.includes(raw?.ailment) ? raw.ailment : 'paralysis'; break;
    case 'guard': out.stat = FX_STATS.some(x => x.id === raw?.stat) ? raw.stat : ''; break;   // '' = any stat
    case 'power': out.mult = Number(raw?.mult) === 2 ? 2 : 1.5; break;
    default: break;
  }
  return out;
}

export function abilityProblems(ab, stats) {
  const out = [];
  if (!ab.label) out.push('Give the ability a name.');
  // Huge Power doubles Attack, which is only fair on a Pokémon that starts with little of it —
  // in the real games it belongs to Azumarill (50) and Mawile (105), never to a heavy hitter.
  if (ab.kind === 'power' && ab.mult === 2 && (stats?.atk ?? 0) > 90) {
    out.push('Doubling Attack is only allowed on a Pokémon with base Attack of 90 or less — otherwise pick 1.5×.');
  }
  return out;
}

/** What the engine reads. {P} is replaced with the Pokémon's name when it triggers. */
export function abilityFx(ab) {
  const L = ab.label || 'Its ability';
  switch (ab.kind) {
    case 'intimidate': return { on: 'switchIn', foeStat: { [FX_STATS.find(x => x.id === ab.stat)?.key ?? 'atk']: -1 },
      text: `{P}'s ${L} cut the foe's ${statLabel(ab.stat)}!` };
    case 'weather': return { on: 'switchIn', weather: ab.weather, text: `{P}'s ${L} changed the weather!` };
    case 'pinch': return { on: 'damage', pinchType: ab.type, mult: 1.5, text: `${L} powered up {P}'s ${cap(ab.type)} move!` };
    case 'immune': return { on: 'immune', type: ab.type, text: `{P}'s ${L} made it immune!` };
    case 'absorb': return { on: 'absorb', type: ab.type, healFrac: 0.25, text: `{P}'s ${L} absorbed the attack!` };
    case 'contact': return { on: 'contact', chance: 30, ailment: ab.ailment, text: `{P}'s ${L} affected the attacker!` };
    case 'thorns': return { on: 'contact', chance: 100, recoilFrac: 0.125, text: `{P}'s ${L} hurt the attacker!` };
    case 'block': return { on: 'block', ailment: ab.ailment, text: `{P}'s ${L} protected it!` };
    case 'speedWeather': return { on: 'speed', weather: ab.weather, mult: 2 };
    case 'sturdy': return { on: 'endure', text: `{P} hung on with ${L}!` };
    case 'noCrit': return { on: 'noCrit' };
    case 'aim': return { on: 'accuracy', mult: 1.3 };
    case 'guard': return { on: 'protectStats', ...(ab.stat ? { only: FX_STATS.find(x => x.id === ab.stat)?.key } : {}),
      text: `{P}'s ${L} stopped its stats being lowered!` };
    case 'shield': return { on: 'blockSecondary' };
    case 'power': return { on: 'damage', atkMult: ab.mult };
    default: return { on: 'none' };
  }
}

export function describeAbility(ab) {
  const t = (id) => cap(id);
  const w = (id) => WEATHERS.find(x => x.id === id)?.label ?? id;
  switch (ab.kind) {
    case 'intimidate': return `When it comes out, the foe’s ${statLabel(ab.stat)} drops by one stage.`;
    case 'weather': return `When it comes out, it brings ${w(ab.weather)} for five turns.`;
    case 'pinch': return `Its ${t(ab.type)} moves hit 1.5× as hard when it’s at a third of its HP or less.`;
    case 'immune': return `${t(ab.type)} moves can’t hurt it at all.`;
    case 'absorb': return `${t(ab.type)} moves don’t hurt it — they heal it by a quarter of its HP instead.`;
    case 'contact': return `30% chance to ${AILMENTS[ab.ailment]} anything that hits it with a contact move.`;
    case 'thorns': return 'Anything that hits it with a contact move loses an eighth of its own HP.';
    case 'block': return `It can never be ${ab.ailment === 'sleep' ? 'put to sleep' : ab.ailment === 'confusion' ? 'confused' : ab.ailment === 'paralysis' ? 'paralyzed' : ab.ailment === 'freeze' ? 'frozen' : ab.ailment === 'burn' ? 'burned' : 'poisoned'}.`;
    case 'speedWeather': return `Its Speed doubles in ${w(ab.weather)}.`;
    case 'sturdy': return 'If it’s at full HP, it survives a hit that would have knocked it out, with 1 HP left.';
    case 'noCrit': return 'Critical hits never land on it.';
    case 'aim': return 'Its moves are 30% more accurate.';
    case 'guard': return ab.stat ? `Foes can’t lower its ${statLabel(ab.stat)}.` : 'Foes can’t lower any of its stats.';
    case 'shield': return 'The extra effects of attacks (burns, stat drops, flinching) don’t affect it.';
    case 'power': return `Its Attack is multiplied by ${ab.mult}.`;
    default: return '';
  }
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
  if (mon.ability === 'custom') out.push(...abilityProblems(mon.customAbility ?? {}, mon.stats));
  return out;
}
