// A real Pokémon battle simulation.
//
// This module knows NOTHING about trivia, the DOM, or three.js. It takes a
// battle state and a pair of actions, and returns the list of things that
// happened. That separation is the whole point: the simulation can be unit
// tested against known Pokémon behaviour, and the quiz layer sits on top as a
// single "how well did you execute this?" multiplier.
//
// Mechanics implemented, in the order they actually matter competitively:
//   • Priority brackets beat Speed. Speed decides everything else.
//   • Stat stages, -6..+6, with the real multipliers and a hard clamp.
//   • Status conditions that persist: burn, poison, toxic, paralysis, sleep,
//     freeze — plus confusion and flinch as volatiles.
//   • Type effectiveness with dual types (so 4x and 0x both happen), STAB.
//   • The real damage formula, physical/special split, critical hits.
//   • Abilities, held items and natures with genuine mechanical effects.
//   • Accuracy vs evasion, PP, Protect (with consecutive-use failure),
//     multi-hit, drain, recoil, weather.
//
// Everything returns EVENTS rather than strings, so the UI can animate them and
// tests can assert on them.

import { species, statAt, maxHp, typeMultiplier, movesFor, STRUGGLE } from './party.js';

const MOVES = () => window.PL_MOVES ?? {};
const NATURES = () => window.PL_NATURES ?? {};
const ITEMS = () => window.PL_ITEMS ?? {};
const ABIL_FX = () => window.PL_ABILITY_FX ?? {};
const ABILITIES = () => window.PL_ABILITIES ?? {};

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);

/* ============================ randomness ============================ */
// Injectable so tests are deterministic. `rng()` returns [0,1).

let rng = Math.random;
export function setRng(fn) { rng = fn ?? Math.random; }
const chance = (pct) => rng() * 100 < pct;
const between = (lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));

/* ============================ stat stages ============================ */

/** Real multiplier for an attack/defence/speed stage. */
export function stageMult(stage) {
  const s = clamp(stage, -6, 6);
  return s >= 0 ? (2 + s) / 2 : 2 / (2 - s);
}
/** Accuracy and evasion use a 3-based curve instead of a 2-based one. */
export function accStageMult(stage) {
  const s = clamp(stage, -6, 6);
  return s >= 0 ? (3 + s) / 3 : 3 / (3 - s);
}

/* ============================ battlers ============================ */

const STAT_KEYS = ['atk', 'def', 'spa', 'spd', 'spe'];
const API_STAT = {
  attack: 'atk', defense: 'def', 'special-attack': 'spa',
  'special-defense': 'spd', speed: 'spe', accuracy: 'acc', evasion: 'eva',
};

/** The first non-hidden ability, which is what a wild Pokémon shows up with. */
export function defaultAbility(dexId) {
  const list = ABILITIES()[dexId] ?? [];
  return (list.find(a => !a.hidden) ?? list[0])?.name ?? null;
}

/**
 * Build a battler. `mon` is the stored {dex, level, hp} record; everything else
 * is optional and falls back to sensible defaults.
 */
export function makeBattler(mon, opts = {}) {
  const sp = species(mon.dex);
  const moves = (opts.moves ?? autoMoves(mon)).map(name => {
    const m = name === STRUGGLE.name ? STRUGGLE : (MOVES()[name] ?? null);
    return m ? { name, pp: m.pp, maxPp: m.pp } : null;
  }).filter(Boolean);

  return {
    ref: mon,                       // the saved record, so HP changes persist
    dex: mon.dex,
    name: sp.name,
    types: sp.types,
    level: mon.level,
    nature: opts.nature ?? 'serious',
    ability: opts.ability ?? defaultAbility(mon.dex),
    item: opts.item ?? 'none',
    moves,
    maxHp: maxHp(mon.dex, mon.level),
    hp: mon.hp ?? maxHp(mon.dex, mon.level),
    stages: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, acc: 0, eva: 0 },
    status: null,                   // burn | poison | toxic | paralysis | sleep | freeze
    statusTurns: 0,
    volatile: {},                   // confusion, flinch, protectStreak, leechSeed, choiceLock
    fainted: (mon.hp ?? 1) <= 0,
  };
}

/**
 * What this Pokémon knows. A caught Pokémon carries its OWN move list, which it
 * has grown and edited over time — that's the record, not a recomputation. Only
 * a wild or trainer Pokémon (no stored list) falls back to a level-appropriate set.
 */
function autoMoves(mon) {
  if (Array.isArray(mon.moves) && mon.moves.length) return mon.moves.slice(0, 4);
  const list = movesFor(mon.dex, mon.level).map(m => m.name);
  return list.length ? list : ['tackle'];
}

/* ============================ derived stats ============================ */

function natureMult(nature, key) {
  const n = NATURES()[nature];
  if (!n || !n.up || n.up === n.down) return 1;
  if (n.up === key) return 1.1;
  if (n.down === key) return 0.9;
  return 1;
}

/** Effective stat: base → nature → stage → status → ability → item. */
export function effStat(b, key, battle = null, { ignoreStages = false } = {}) {
  let v = Math.floor(statAt(b.dex, key, b.level) * natureMult(b.nature, key));
  if (!ignoreStages) v = Math.floor(v * stageMult(b.stages[key]));

  if (key === 'atk' && b.status === 'burn' && b.ability !== 'guts') v = Math.floor(v * 0.5);
  if (key === 'spe' && b.status === 'paralysis') v = Math.floor(v * 0.5);

  const fx = ABIL_FX()[b.ability];
  if (fx && key === 'spe' && fx.on === 'speed' && battle?.weather === fx.weather) {
    v = Math.floor(v * fx.mult);
  }
  if (fx && key === 'atk' && fx.atkMult && (!fx.whenStatus || b.status)) {
    v = Math.floor(v * fx.atkMult);
  }
  const item = ITEMS()[b.item];
  if (item?.spdMult && key === 'spd') v = Math.floor(v * item.spdMult);

  return Math.max(1, v);
}

/* ============================ turn order ============================ */

export function moveOf(b, name) { return MOVES()[name] ?? null; }

/**
 * Order actions for the turn. Switches go first, then priority bracket, then
 * Speed — inverted if Trick Room is up. This is the single most important
 * mechanic in competitive play, so it gets its own function and its own tests.
 */
export function orderActions(battle, entries) {
  return entries.slice().sort((a, b) => {
    const aSwitch = a.action.type === 'switch', bSwitch = b.action.type === 'switch';
    if (aSwitch !== bSwitch) return aSwitch ? -1 : 1;
    if (aSwitch && bSwitch) return 0;

    const pa = moveOf(a.user, a.action.move)?.prio ?? 0;
    const pb = moveOf(b.user, b.action.move)?.prio ?? 0;
    if (pa !== pb) return pb - pa;                    // higher priority acts first

    const sa = effStat(a.user, 'spe', battle);
    const sb = effStat(b.user, 'spe', battle);
    if (sa !== sb) return battle.trickRoom ? sa - sb : sb - sa;
    return rng() < 0.5 ? -1 : 1;                      // speed tie: coin flip
  });
}

/* ============================ damage ============================ */

const CONTACT_CLASSES = new Set(['physical']);

/** Critical-hit odds by stage, as the modern games use them. */
function critChance(stage) {
  return [1 / 24, 1 / 8, 1 / 2, 1, 1][clamp(stage, 0, 4)];
}

/**
 * The real damage formula, with every multiplier the competitive scene cares
 * about. `quality` is the trivia layer's contribution: 1 for a right answer.
 */
export function computeDamage(attacker, defender, move, battle, quality = 1, opts = {}) {
  const special = move.class === 'special';
  const crit = opts.forceCrit ?? (!hasFx(defender, 'noCrit') && chance(critChance(move.critRate ?? 0) * 100));

  // A crit ignores the defender's helpful defence boosts and the attacker's
  // own attack drops — it cuts straight through stat games.
  const atkKey = special ? 'spa' : 'atk';
  const defKey = special ? 'spd' : 'def';
  const A = effStat(attacker, atkKey, battle,
    { ignoreStages: crit && attacker.stages[atkKey] < 0 });
  const D = effStat(defender, defKey, battle,
    { ignoreStages: crit && defender.stages[defKey] > 0 });

  let base = Math.floor(Math.floor(Math.floor(2 * attacker.level / 5 + 2) * move.power * A / D) / 50) + 2;

  const mult = [];
  const push = (m, why) => { if (m !== 1) mult.push({ m, why }); };

  if (opts.spread) push(0.75, 'spread move');
  if (crit) push(1.5, 'critical hit');

  // weather
  if (battle.weather === 'rain') {
    if (move.type === 'water') push(1.5, 'rain');
    if (move.type === 'fire') push(0.5, 'rain');
  } else if (battle.weather === 'sun') {
    if (move.type === 'fire') push(1.5, 'harsh sunlight');
    if (move.type === 'water') push(0.5, 'harsh sunlight');
  }

  // a typeless move (Struggle) has no same-type bonus and ignores the type chart entirely
  const stab = !move.typeless && attacker.types.includes(move.type) ? 1.5 : 1;
  push(stab, 'same-type attack bonus');

  const typeMult = move.typeless ? 1 : typeMultiplier(move.type, defender.types);
  push(typeMult, 'type matchup');

  if (!special && attacker.status === 'burn' && attacker.ability !== 'guts') {
    // burn already halved atk in effStat; don't double-count
  }

  // ability: pinch boosts (Blaze / Torrent / Overgrow / Swarm)
  const afx = ABIL_FX()[attacker.ability];
  if (afx?.pinchType === move.type && attacker.hp <= attacker.maxHp / 3) {
    push(afx.mult, attacker.ability);
  }

  // items
  const item = ITEMS()[attacker.item];
  if (item?.damage) push(item.damage, item.label);
  if (item?.physical && !special) push(item.physical, item.label);
  if (item?.special && special) push(item.special, item.label);
  if (item?.superMult && typeMult > 1) push(item.superMult, item.label);

  push(quality, 'answer quality');

  const roll = opts.fixedRoll ?? (0.85 + rng() * 0.15);
  let dmg = base;
  for (const { m } of mult) dmg = dmg * m;
  dmg = Math.floor(dmg * roll);

  return {
    dmg: typeMult === 0 ? 0 : Math.max(1, dmg),
    typeMult, stab, crit, mods: mult,
    contact: CONTACT_CLASSES.has(move.class),
  };
}

function hasFx(b, on) {
  const fx = ABIL_FX()[b.ability];
  return fx && fx.on === on;
}

/* ============================ accuracy ============================ */

export function willHit(attacker, defender, move, battle) {
  if (move.acc == null) return true;                       // never-miss moves
  if (hasFx(attacker, 'accuracy') && ABIL_FX()[attacker.ability].always) return true;
  if (hasFx(defender, 'accuracy') && ABIL_FX()[defender.ability].always) return true;

  let acc = move.acc;
  const afx = ABIL_FX()[attacker.ability];
  if (afx?.on === 'accuracy' && afx.mult) acc *= afx.mult;

  const dfx = ABIL_FX()[defender.ability];
  let evaStage = defender.stages.eva;
  if (dfx?.on === 'evasion' && battle.weather === dfx.weather) acc /= dfx.mult;

  acc *= accStageMult(attacker.stages.acc) / accStageMult(evaStage);
  return chance(clamp(acc, 1, 100));
}

/* ============================ status ============================ */

const STATUS_IMMUNE_TYPES = {
  burn: ['fire'], freeze: ['ice'], paralysis: ['electric'],
  poison: ['poison', 'steel'], toxic: ['poison', 'steel'],
};

// PokéAPI lists many "ailments" the engine has no rules for (trap, leech-seed, yawn, nightmare…).
// Applying one of those used to stamp a permanent junk status on the target that did nothing and
// blocked every real status afterwards. Anything not modelled is simply not applied.
const MAJOR_STATUS = new Set(['burn', 'poison', 'toxic', 'paralysis', 'sleep', 'freeze']);

export function canTakeStatus(target, ailment) {
  if (!ailment) return false;
  if (ailment !== 'confusion' && !MAJOR_STATUS.has(ailment)) return false;
  if (ailment === 'confusion') {
    return !target.volatile.confusion && !hasBlock(target, 'confusion');
  }
  if (target.status) return false;                          // one major status at a time
  const immune = STATUS_IMMUNE_TYPES[ailment] ?? [];
  if (immune.some(t => target.types.includes(t))) return false;
  return !hasBlock(target, ailment);
}

function hasBlock(target, ailment) {
  const fx = ABIL_FX()[target.ability];
  return fx?.on === 'block' && fx.ailment === ailment;
}

function applyStatus(target, ailment, log) {
  if (ailment === 'confusion') {
    target.volatile.confusion = between(2, 5);
    log.push({ t: 'status', who: target.name, status: 'confusion' });
    return true;
  }
  target.status = ailment;
  target.statusTurns = ailment === 'sleep' ? between(1, 3) : 0;
  log.push({ t: 'status', who: target.name, status: ailment });
  return true;
}

/* ============================ stat changes ============================ */

function applyStatChange(target, changes, log, { fromFoe }) {
  const fx = ABIL_FX()[target.ability];
  for (const { stat, stage } of changes) {
    const key = API_STAT[stat] ?? stat;
    if (!(key in target.stages)) continue;

    if (stage < 0 && fromFoe && fx?.on === 'protectStats' && (!fx.only || fx.only === key)) {
      log.push({ t: 'ability', who: target.name, ability: target.ability, text: fx.text });
      continue;
    }
    const before = target.stages[key];
    target.stages[key] = clamp(before + stage, -6, 6);
    const delta = target.stages[key] - before;
    if (delta === 0) {
      log.push({ t: 'statFail', who: target.name, stat: key, dir: stage > 0 ? 'up' : 'down' });
    } else {
      log.push({ t: 'stat', who: target.name, stat: key, stage: delta, now: target.stages[key] });
    }
  }
}

/* ============================ moves with their own damage rules ============================ */

// PokéAPI gives these a power of nothing, which made them silently do nothing. Each is a
// well-known fixed rule, so they are implemented as such rather than as ordinary attacks.
const FIXED_DAMAGE = {
  'dragon-rage': () => 40,
  'sonic-boom': () => 20,
  'seismic-toss': (u) => u.level,
  'night-shade': (u) => u.level,
  'super-fang': (u, t) => Math.max(1, Math.floor(t.hp / 2)),
  'endeavor': (u, t) => Math.max(0, t.hp - u.hp),
};
const OHKO = new Set(['fissure', 'guillotine', 'horn-drill', 'sheer-cold']);

/** Flail / Reversal: the lower its own HP, the harder it hits (the real lookup table). */
function lowHpPower(u) {
  const r = Math.floor((48 * u.hp) / u.maxHp);
  return r <= 1 ? 200 : r <= 4 ? 150 : r <= 9 ? 100 : r <= 16 ? 80 : r <= 32 ? 40 : 20;
}
/** Magnitude: a random strength, with the real odds. */
function magnitudePower() {
  const r = rng() * 100;
  return r < 5 ? 10 : r < 15 ? 30 : r < 35 ? 50 : r < 65 ? 70 : r < 85 ? 90 : r < 95 ? 110 : 150;
}
/**
 * Moves whose real rules need something the engine doesn't keep (the last hit taken, a stockpile,
 * the target's weight, a delayed hit…). Played as plain attacks they'd be wrong, so callers that
 * let a person CHOOSE moves should leave them out.
 */
export const UNSIMULATED_MOVES = new Set([
  'counter', 'mirror-coat', 'spit-up', 'swallow', 'low-kick', 'grass-knot', 'heavy-slam', 'heat-crash',
  'bide', 'metal-burst', 'comeuppance', 'focus-punch', 'future-sight', 'doom-desire', 'last-resort',
  'dream-eater', 'snore', 'sky-drop', 'meteor-beam', 'electro-shot', 'geomancy', 'rest',
  'struggle', 'outrage', 'thrash', 'petal-dance', 'belly-drum', 'psyshock', 'psystrike', 'secret-sword', 'foul-play',
]);
const SIMULATED_UNIQUE = new Set(['protect', 'detect']);
const WEATHER_MOVE = /rain-dance|sunny-day|sandstorm|hail/;

/** Can this move be played correctly? Takes the move record, not just its name. */
export function isSimulated(move) {
  if (!move || UNSIMULATED_MOVES.has(move.name)) return false;
  switch (move.cat) {
    case 'unique': return SIMULATED_UNIQUE.has(move.name);
    case 'whole-field-effect': return WEATHER_MOVE.test(move.name);
    case 'field-effect': case 'force-switch': case 'swagger': return false;
    default: return true;
  }
}

/** A move's power for this particular use (0 when it isn't an ordinary power-based attack). */
function effectivePower(move, user) {
  if (move.name === 'flail' || move.name === 'reversal') return lowHpPower(user);
  if (move.name === 'magnitude') return magnitudePower();
  return move.power;
}

/* ============================ executing one move ============================ */

/**
 * Run one move. Returns an event log.
 * `quality` (0..1) is the trivia layer's execution multiplier:
 *   1     — full effect
 *   0<q<1 — damage scaled; a non-damaging move still works
 *   0     — the move fails outright
 */
/** Moves that cost the user its life when it actually goes off. */
const SELF_KO = new Set(['explosion', 'self-destruct', 'misty-explosion']);

export function useMove(battle, user, target, moveName, quality, log = []) {
  const start = log.length;
  useMoveInner(battle, user, target, moveName, quality, log);
  // Only if the move was really used: a sleeping or paralysed Pokémon doesn't blow itself up.
  // It happens whether or not the attack connected, which is the real (and costly) rule.
  if (SELF_KO.has(moveName) && !user.fainted && log.slice(start).some(e => e.t === 'move' && e.who === user.name)) {
    user.hp = 0;
    checkFaint(user, log);
  }
  return log;
}

function useMoveInner(battle, user, target, moveName, quality, log = []) {
  // Struggle is the engine's own move; a data file that happens to list one must never replace it
  const move = moveName === STRUGGLE.name ? STRUGGLE : (MOVES()[moveName] ?? null);
  if (!move) return log;

  const slot = user.moves.find(m => m.name === moveName);

  /* --- things that stop you moving at all --- */
  if (user.volatile.flinch) {
    user.volatile.flinch = false;
    log.push({ t: 'flinch', who: user.name });
    return log;
  }
  if (user.status === 'sleep') {
    if (user.statusTurns > 0) {
      user.statusTurns--;
      log.push({ t: 'asleep', who: user.name });
      return log;
    }
    user.status = null;
    log.push({ t: 'wake', who: user.name });
  }
  if (user.status === 'freeze') {
    if (!chance(20)) { log.push({ t: 'frozen', who: user.name }); return log; }
    user.status = null;
    log.push({ t: 'thaw', who: user.name });
  }
  if (user.status === 'paralysis' && chance(25)) {
    log.push({ t: 'fullPara', who: user.name });
    return log;
  }
  if (user.volatile.confusion > 0) {
    user.volatile.confusion--;
    if (user.volatile.confusion === 0) log.push({ t: 'snapOut', who: user.name });
    else if (chance(33)) {
      // hurt itself: a typeless 40-power physical hit against its own defence
      const self = computeDamage(user, user, { power: 40, type: '???', class: 'physical' },
        battle, 1, { fixedRoll: 1 });
      user.hp = Math.max(0, user.hp - self.dmg);
      log.push({ t: 'confusedHit', who: user.name, dmg: self.dmg });
      checkFaint(user, log);
      return log;
    }
  }

  if (slot && slot.pp <= 0) { log.push({ t: 'noPp', who: user.name, move: move.label }); return log; }
  if (slot) slot.pp--;

  log.push({ t: 'move', who: user.name, move: move.label, moveType: move.type, prio: move.prio });

  if (quality <= 0) { log.push({ t: 'fizzle', who: user.name, move: move.label }); return log; }

  /* --- Protect --- */
  if (move.cat === 'unique' && /protect|detect/.test(move.name)) {
    const streak = user.volatile.protectStreak ?? 0;
    if (streak > 0 && !chance(100 / Math.pow(3, streak))) {
      log.push({ t: 'protectFail', who: user.name });
      user.volatile.protectStreak = 0;
      return log;
    }
    user.volatile.protecting = true;
    user.volatile.protectStreak = streak + 1;
    log.push({ t: 'protect', who: user.name });
    return log;
  }
  user.volatile.protectStreak = 0;

  const selfTargeted = move.target === 'user' || move.target === 'users-field' || move.target === 'entire-field';

  if (!selfTargeted && target.volatile.protecting) {
    log.push({ t: 'blocked', who: target.name, move: move.label });
    return log;
  }

  /* --- weather moves --- */
  if (move.cat === 'whole-field-effect' || /rain-dance|sunny-day|sandstorm|hail/.test(move.name)) {
    const w = { 'rain-dance': 'rain', 'sunny-day': 'sun', sandstorm: 'sand', hail: 'hail' }[move.name];
    if (w) {
      battle.weather = w;
      battle.weatherTurns = 5;
      log.push({ t: 'weather', weather: w });
      return log;
    }
  }

  /* --- ability immunities and absorptions --- */
  if (!selfTargeted && move.power > 0) {
    const dfx = ABIL_FX()[target.ability];
    if (dfx?.on === 'immune' && dfx.type === move.type) {
      log.push({ t: 'abilityImmune', who: target.name, ability: target.ability, text: dfx.text });
      return log;
    }
    if (dfx?.on === 'absorb' && dfx.type === move.type) {
      if (dfx.healFrac) {
        const heal = Math.floor(target.maxHp * dfx.healFrac);
        target.hp = Math.min(target.maxHp, target.hp + heal);
        log.push({ t: 'heal', who: target.name, amount: heal, why: target.ability });
      }
      if (dfx.selfStat) {
        applyStatChange(target, Object.entries(dfx.selfStat).map(([stat, stage]) => ({ stat, stage })),
          log, { fromFoe: false });
      }
      log.push({ t: 'abilityAbsorb', who: target.name, ability: target.ability, text: dfx.text });
      return log;
    }
  }

  const isOhko = OHKO.has(move.name);
  const fixedFn = FIXED_DAMAGE[move.name];
  const power = effectivePower(move, user);

  /* --- accuracy --- */
  if (isOhko) {
    // a one-hit KO lands 30% of the time, +1% per level the user has over the target, and
    // never works at all on a higher-level target
    const odds = 30 + (user.level - target.level);
    if (user.level < target.level || !chance(clamp(odds, 1, 100))) {
      log.push({ t: 'miss', who: user.name, move: move.label, acc: clamp(odds, 0, 100) });
      return log;
    }
  } else if (power > 0 || fixedFn || move.acc != null) {
    if (!willHit(user, target, move, battle)) {
      log.push({ t: 'miss', who: user.name, move: move.label, acc: move.acc });
      return log;
    }
  }

  /* --- damage --- */
  let dealt = 0, res = null;
  if (power > 0 || fixedFn || isOhko) {
    const hits = move.hits ? between(move.hits[0], move.hits[1]) : 1;
    for (let i = 0; i < hits && target.hp > 0; i++) {
      // type matchup still applies to these (Seismic Toss can't touch a Ghost); the amount doesn't
      const shaped = power > 0 && !fixedFn && !isOhko ? { ...move, power } : { ...move, power: 1 };
      res = computeDamage(user, target, shaped, battle, quality);
      if (res.typeMult === 0) {
        log.push({ t: 'noEffect', who: target.name, moveType: move.type });
        return log;
      }
      if (isOhko) res = { ...res, dmg: target.hp, crit: false, stab: 1 };
      else if (fixedFn) res = { ...res, dmg: Math.max(1, fixedFn(user, target)), crit: false, stab: 1 };
      let dmg = Math.min(res.dmg, target.hp);
      // Focus Sash / Sturdy: survive a would-be knockout from full HP with 1 HP
      const item = ITEMS()[target.item];
      const sashes = (item?.sash && target.hp === target.maxHp) ||
        (hasFx(target, 'endure') && target.hp === target.maxHp);
      if (dmg >= target.hp && sashes) {
        dmg = target.hp - 1;
        log.push({ t: 'endured', who: target.name, why: item?.sash ? item.label : target.ability });
      }
      target.hp -= dmg;
      dealt += dmg;
      log.push({
        t: 'damage', who: target.name, by: user.name, move: move.label,
        dmg, crit: res.crit, typeMult: res.typeMult, stab: res.stab > 1,
        hpLeft: target.hp, maxHp: target.maxHp,
      });
    }
    if (hits > 1) log.push({ t: 'multiHit', who: user.name, hits });

    // drain and recoil (PokéAPI stores recoil as a negative drain)
    if (move.drain > 0 && dealt > 0) {
      const heal = Math.max(1, Math.floor(dealt * move.drain / 100));
      user.hp = Math.min(user.maxHp, user.hp + heal);
      log.push({ t: 'heal', who: user.name, amount: heal, why: 'drain' });
    } else if (move.drain < 0 && dealt > 0) {
      const hurt = Math.max(1, Math.floor(dealt * Math.abs(move.drain) / 100));
      user.hp = Math.max(0, user.hp - hurt);
      log.push({ t: 'recoil', who: user.name, amount: hurt });
    }

    // Struggle: a fixed share of the USER's max HP, not of the damage dealt
    if (move.recoilMaxFrac && res) {
      const hurt = Math.max(1, Math.floor(user.maxHp * move.recoilMaxFrac));
      user.hp = Math.max(0, user.hp - hurt);
      log.push({ t: 'recoil', who: user.name, amount: hurt, why: move.label });
    }

    // Life Orb costs you HP every time it powers a hit
    const uItem = ITEMS()[user.item];
    if (uItem?.recoilFrac && dealt > 0) {
      const cost = Math.max(1, Math.floor(user.maxHp * uItem.recoilFrac));
      user.hp = Math.max(0, user.hp - cost);
      log.push({ t: 'recoil', who: user.name, amount: cost, why: uItem.label });
    }

    // contact abilities fire back
    if (res?.contact && target.hp > 0) {
      const dfx = ABIL_FX()[target.ability];
      if (dfx?.on === 'contact' && chance(dfx.chance)) {
        if (dfx.ailment && canTakeStatus(user, dfx.ailment)) {
          applyStatus(user, dfx.ailment, log);
          log.push({ t: 'ability', who: target.name, ability: target.ability, text: dfx.text });
        } else if (dfx.recoilFrac) {
          const hurt = Math.max(1, Math.floor(user.maxHp * dfx.recoilFrac));
          user.hp = Math.max(0, user.hp - hurt);
          log.push({ t: 'ability', who: target.name, ability: target.ability, text: dfx.text });
        }
      }
      const tItem = ITEMS()[target.item];
      if (tItem?.contactBack) {
        const hurt = Math.max(1, Math.floor(user.maxHp * tItem.contactBack));
        user.hp = Math.max(0, user.hp - hurt);
        log.push({ t: 'itemHurt', who: user.name, item: tItem.label, amount: hurt });
      }
    }
  }

  /* --- healing moves --- */
  if (move.heal > 0) {
    const heal = Math.floor(user.maxHp * move.heal / 100);
    if (user.hp >= user.maxHp) log.push({ t: 'healFail', who: user.name });
    else {
      user.hp = Math.min(user.maxHp, user.hp + heal);
      log.push({ t: 'heal', who: user.name, amount: heal, why: move.label });
    }
  }

  /* --- stat changes --- */
  if (move.stats?.length) {
    const rolled = move.statChance ? chance(move.statChance) : true;
    const secondaryBlocked = move.power > 0 && hasFx(target, 'blockSecondary');
    if (rolled && !(secondaryBlocked && move.stats[0].stage < 0)) {
      // "damage-raise" is PokéAPI's category for a damaging move that changes the USER's stats —
      // including the ones that LOWER them (Overheat, Close Combat, Superpower, Draco Meteor).
      // Those used to land on the target, so Superpower weakened the foe instead of the user.
      const toSelf = move.target === 'user' || move.cat === 'damage-raise'
        || move.stats.every(s => s.stage > 0) && move.power === 0;
      const who = toSelf ? user : target;
      applyStatChange(who, move.stats, log, { fromFoe: who === target });
    }
  }

  /* --- ailments --- */
  if (move.ailment) {
    const pct = move.ailChance || (move.power > 0 ? 0 : 100);
    if (pct > 0 && chance(pct)) {
      const blockedSecondary = move.power > 0 && hasFx(target, 'blockSecondary');
      if (!blockedSecondary && canTakeStatus(target, move.ailment)) applyStatus(target, move.ailment, log);
      else if (move.power === 0) log.push({ t: 'statusFail', who: target.name, status: move.ailment });
    }
  }

  /* --- flinch --- */
  if (move.flinch > 0 && chance(move.flinch) && !hasFx(target, 'blockSecondary')) {
    target.volatile.flinch = true;
  }

  // Belt and braces: if a status move somehow produced no visible outcome, say
  // so rather than leaving the player wondering why a right answer did nothing.
  if (move.power === 0 && !fixedFn && !isOhko && !log.some(e =>
    ['stat', 'statFail', 'status', 'statusFail', 'heal', 'healFail', 'weather', 'protect'].includes(e.t))) {
    log.push({ t: 'noOutcome', who: user.name, move: move.label });
  }

  checkFaint(target, log);
  checkFaint(user, log);
  return log;
}

function checkFaint(b, log) {
  if (b.hp <= 0 && !b.fainted) {
    b.hp = 0;
    b.fainted = true;
    log.push({ t: 'faint', who: b.name });
  }
}

/* ============================ end of turn ============================ */

export function endOfTurn(battle, battlers, log = []) {
  // weather ticks down and chips anything not immune to it
  if (battle.weather && battle.weatherTurns > 0) {
    battle.weatherTurns--;
    if (battle.weather === 'sand') {
      for (const b of battlers) {
        if (b.fainted || b.types.some(t => ['rock', 'ground', 'steel'].includes(t))) continue;
        const d = Math.max(1, Math.floor(b.maxHp / 16));
        b.hp = Math.max(0, b.hp - d);
        log.push({ t: 'weatherHurt', who: b.name, weather: 'sand', amount: d });
        checkFaint(b, log);
      }
    }
    if (battle.weatherTurns === 0) {
      log.push({ t: 'weatherEnd', weather: battle.weather });
      battle.weather = null;
    }
  }

  for (const b of battlers) {
    if (b.fainted) continue;

    if (b.status === 'burn' || b.status === 'poison') {
      const d = Math.max(1, Math.floor(b.maxHp / (b.status === 'burn' ? 16 : 8)));
      b.hp = Math.max(0, b.hp - d);
      log.push({ t: 'statusHurt', who: b.name, status: b.status, amount: d });
    } else if (b.status === 'toxic') {
      b.statusTurns++;
      const d = Math.max(1, Math.floor(b.maxHp * b.statusTurns / 16));
      b.hp = Math.max(0, b.hp - d);
      log.push({ t: 'statusHurt', who: b.name, status: 'toxic', amount: d });
    }

    const item = ITEMS()[b.item];
    if (item?.endTurnHeal && b.hp > 0 && b.hp < b.maxHp) {
      const heal = Math.max(1, Math.floor(b.maxHp * item.endTurnHeal));
      b.hp = Math.min(b.maxHp, b.hp + heal);
      log.push({ t: 'heal', who: b.name, amount: heal, why: item.label });
    }
    if (item?.berryAt && !b.volatile.berryUsed && b.hp > 0 && b.hp <= b.maxHp * item.berryAt) {
      const heal = Math.floor(b.maxHp * item.berryHeal);
      b.hp = Math.min(b.maxHp, b.hp + heal);
      b.volatile.berryUsed = true;
      b.item = 'none';
      log.push({ t: 'heal', who: b.name, amount: heal, why: item.label });
    }

    b.volatile.protecting = false;
    b.volatile.flinch = false;
    checkFaint(b, log);
  }
  return log;
}

/* ============================ switch-in ============================ */

/** Stat changes and volatiles do not follow a Pokémon out of battle. */
export function resetOnEntry(entering) {
  entering.volatile.protectStreak = 0;
  for (const k of Object.keys(entering.stages)) entering.stages[k] = 0;
  entering.volatile.confusion = 0;
}

/**
 * Fire a Pokémon's switch-in effects. Pass `{ reset: false }` when two Pokémon enter at the same
 * moment (both leads, or two replacements after a double knockout): call `resetOnEntry` on each
 * FIRST, then this for each. Otherwise the second one's reset wipes the stat drop the first
 * one's Intimidate just caused — the real games let everyone enter, then trigger abilities.
 */
export function onSwitchIn(battle, entering, foe, log = [], { reset = true } = {}) {
  if (reset) resetOnEntry(entering);

  const fx = ABIL_FX()[entering.ability];
  if (fx?.on === 'switchIn') {
    if (fx.weather) {
      battle.weather = fx.weather;
      battle.weatherTurns = 5;
      log.push({ t: 'ability', who: entering.name, ability: entering.ability, text: fx.text });
      log.push({ t: 'weather', weather: fx.weather });
    }
    if (fx.foeStat && foe && !foe.fainted) {
      log.push({ t: 'ability', who: entering.name, ability: entering.ability, text: fx.text });
      applyStatChange(foe, Object.entries(fx.foeStat).map(([stat, stage]) => ({ stat, stage })),
        log, { fromFoe: true });
    }
  }
  return log;
}

/* ============================ the battle object ============================ */

export function createBattle() {
  return { weather: null, weatherTurns: 0, trickRoom: false, turn: 0 };
}

/**
 * Resolve one full turn. `entries` is [{user, target, action, quality}] where
 * action is {type:'move', move} or {type:'switch'} (the caller performs the
 * actual swap and calls onSwitchIn).
 */
export function resolveTurn(battle, entries) {
  battle.turn++;
  const log = [];
  const ordered = orderActions(battle, entries);
  log.push({ t: 'turn', n: battle.turn, order: ordered.map(e => e.user.name) });

  for (const e of ordered) {
    if (e.user.fainted) continue;
    if (e.action.type === 'switch') { log.push({ t: 'switch', who: e.user.name }); continue; }
    if (e.target?.fainted) { log.push({ t: 'noTarget', who: e.user.name }); continue; }
    useMove(battle, e.user, e.target, e.action.move, e.quality ?? 1, log);
  }

  endOfTurn(battle, ordered.map(e => e.user), log);
  return log;
}

/* ============================ explaining it ============================ */

/** Plain-language reasons a hit landed the way it did — the teaching layer. */
export function explainDamage(res, move, attacker, defender) {
  const bits = [];
  if (res.typeMult === 0) bits.push(`${move.type} moves don't affect ${defender.types.join('/')} at all`);
  else if (res.typeMult >= 4) bits.push('doubly super effective — both of its types are weak to this');
  else if (res.typeMult >= 2) bits.push('super effective');
  else if (res.typeMult <= 0.25) bits.push('barely scratched it — both types resist this');
  else if (res.typeMult <= 0.5) bits.push('not very effective');
  if (res.stab > 1) bits.push(`same-type bonus (${attacker.name} is ${move.type})`);
  if (res.crit) bits.push('critical hit');
  return bits;
}
