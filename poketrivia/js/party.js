// Pokémon instances, stats, XP, evolution, and the battle damage formula.
// All of the data comes from data/dex.js, copied unchanged from the PokéLearn
// app: PL_DEX (151 species), PL_CHART (type effectiveness), PL_CHAINS (evolutions).

import { clamp, rand } from './rng.js';

const DEX = () => window.PL_DEX ?? [];
const CHART = () => window.PL_CHART ?? {};
const CHAINS = () => window.PL_CHAINS ?? {};

const byId = new Map();
export function species(dexId) {
  if (!byId.size) for (const s of DEX()) byId.set(s.id, s);
  return byId.get(dexId);
}

export const artUrl = (dexId) => `img/art/${dexId}.png`;

/* ---------------- stats ---------------- */

export function maxHp(dexId, level) {
  const s = species(dexId);
  return Math.floor((s.stats.hp * 2 * level) / 100) + level + 10;
}
export function statAt(dexId, key, level) {
  const s = species(dexId);
  return Math.floor((s.stats[key] * 2 * level) / 100) + 5;
}
/* ---------------- experience ----------------
 * The real games give every species a growth curve and a base experience yield,
 * and both are now real data (data/growth.js, from PokéAPI). That's what makes
 * levelling feel right: a Magikarp is worth 40 experience and a Mewtwo 306, and
 * a Charizard on the medium-slow curve takes noticeably longer to level than a
 * Rattata on the fast one. */

const GROWTH = () => window.PL_GROWTH ?? {};

/** Total experience needed to REACH this level, by curve (the standard tables). */
function totalXpFor(level, curve) {
  const n = level;
  switch (curve) {
    case 'fast':        return Math.floor(4 * n ** 3 / 5);
    case 'slow':        return Math.floor(5 * n ** 3 / 4);
    case 'medium-slow': return Math.max(0, Math.floor(6 * n ** 3 / 5 - 15 * n ** 2 + 100 * n - 140));
    default:            return n ** 3;                       // 'medium'
  }
}

/** Experience from this level to the next, for this species. */
export function xpToNext(level, dexId = null) {
  const curve = dexId != null ? (GROWTH()[dexId]?.growth ?? 'medium') : 'medium';
  return Math.max(1, totalXpFor(level + 1, curve) - totalXpFor(level, curve));
}

/**
 * Experience earned for defeating a Pokémon — the real formula.
 * A tough, high-level opponent is worth far more than a weak one.
 */
export function xpForDefeating(dexId, level) {
  const base = GROWTH()[dexId]?.exp ?? 64;
  return Math.max(1, Math.floor(base * level / 7));
}

/**
 * A caught Pokémon. `moves` is stored ON the record and persists — it is not
 * recomputed from the level. That's the whole point of the real games' move
 * system: what your Pokémon knows is a decision you made, not a formula.
 */
export function makeMon(dexId, level) {
  return { dex: dexId, level, xp: 0, hp: maxHp(dexId, level), moves: startingMoves(dexId, level) };
}

export const MOVE_SLOTS = 4;

/** The four moves a freshly caught Pokémon of this level knows: the most recent. */
export function startingMoves(dexId, level) {
  const learned = (LEARNSET()[dexId] ?? [])
    .filter(e => e.lv <= level && MOVES()[e.m] && moveHasEffect(MOVES()[e.m]))
    .map(e => e.m);
  const seen = new Set(), out = [];
  for (const m of learned.reverse()) {          // newest first
    if (seen.has(m)) continue;
    seen.add(m);
    out.push(m);
    if (out.length === MOVE_SLOTS) break;
  }
  return out.length ? out.reverse() : ['tackle'];
}

/** Moves this species learns at exactly this level — what a level-up offers. */
export function movesLearnedAt(dexId, level) {
  return (LEARNSET()[dexId] ?? [])
    .filter(e => e.lv === level && MOVES()[e.m] && moveHasEffect(MOVES()[e.m]))
    .map(e => e.m);
}

/** Every move known, as full records, for the team screen and the engine. */
export function knownMoves(mon) {
  if (!Array.isArray(mon.moves) || !mon.moves.length) mon.moves = startingMoves(mon.dex, mon.level);
  return mon.moves.map(n => MOVES()[n]).filter(Boolean);
}

/** Teach a move, replacing the one in `slot` (or appending if there's room). */
export function learnMove(mon, moveName, slot = -1) {
  if (!Array.isArray(mon.moves)) mon.moves = startingMoves(mon.dex, mon.level);
  if (mon.moves.includes(moveName)) return false;
  if (mon.moves.length < MOVE_SLOTS) { mon.moves.push(moveName); return true; }
  if (slot < 0 || slot >= MOVE_SLOTS) return false;      // declined
  mon.moves[slot] = moveName;
  return true;
}

export const monName = (mon) => species(mon.dex).name;

/* ---------------- type effectiveness ---------------- */

/** Multiplier for an attack of `atkType` against a Pokémon with `defTypes`. */
export function typeMultiplier(atkType, defTypes) {
  const row = CHART()[atkType] ?? {};
  let mult = 1;
  for (const t of defTypes) mult *= (row[t] ?? 1);
  return mult;
}

export function effectivenessText(mult) {
  if (mult === 0) return "It doesn't affect them at all!";
  if (mult >= 2) return "It's super effective!";
  if (mult <= 0.5) return "It's not very effective…";
  return null;
}

/* ---------------- real moves & abilities (from PokéAPI) ---------------- */

const MOVES = () => window.PL_MOVES ?? {};
const LEARNSET = () => window.PL_LEARNSET ?? {};
const ABILITIES = () => window.PL_ABILITIES ?? {};

export const moveInfo = (name) => MOVES()[name] ?? null;
export const abilitiesFor = (dexId) => ABILITIES()[dexId] ?? [];

/**
 * The four moves a Pokémon knows at this level — the most recent level-up moves
 * it has actually learned, exactly as the games do it. Damaging moves are kept
 * preferentially so a battle always has something to swing with.
 */
/**
 * Does this move actually DO something in our engine?
 *
 * PokéAPI gives us every move a Pokémon learns, but a chunk of the status moves
 * (Whirlwind, Mirror Move, Splash, Conversion…) have effects we don't simulate.
 * Offering one is worse than not having it: you answer correctly, the message
 * says the move was used, and nothing happens — which reads as the game being
 * broken. So they're kept out of the move list rather than shipped as duds.
 */
export function moveHasEffect(mv) {
  if (!mv) return false;
  if (mv.power > 0) return true;                       // it hits things
  if (mv.stats?.length) return true;                   // raises or lowers a stat
  if (mv.ailment) return true;                         // burn, sleep, paralysis…
  if (mv.heal > 0) return true;                        // healing
  if (/protect|detect/.test(mv.name)) return true;     // blocks a turn
  if (/rain-dance|sunny-day|sandstorm|hail/.test(mv.name)) return true;   // weather
  return false;
}

export const STRUGGLE = {
  name: 'struggle', label: 'Struggle', type: 'normal', power: 50, acc: 100,
  class: 'physical', pp: 1, short: 'Used when nothing else can be. It hurts a little to use.',
};

export function movesFor(dexId, level) {
  const learn = LEARNSET()[dexId] ?? [];
  const known = learn.filter(e => e.lv <= level).map(e => MOVES()[e.m])
    .filter(m => m && moveHasEffect(m));          // never offer a move that does nothing

  const damaging = known.filter(m => m.power > 0);
  const status = known.filter(m => m.power === 0);
  // last four learned, damaging first, then status to fill the slots
  const pick4 = [...damaging.slice(-4)];
  for (const s of status.slice(-2)) if (pick4.length < 4) pick4.push(s);

  // Metapod and Kakuna really do learn nothing but Harden. The games fall back
  // to Struggle in that situation, and so do we — otherwise they cannot act.
  if (!damaging.length) pick4.push(STRUGGLE);
  if (!pick4.length) pick4.push(STRUGGLE);

  return pick4.sort((a, b) => a.power - b.power);
}

/** Harder-hitting moves ask harder questions — that's the wager. */
export function difficultyForMove(move) {
  if (!move || move.power === 0) return 'easy';
  if (move.power <= 45) return 'easy';
  if (move.power <= 75) return 'medium';
  return 'hard';
}

/** Honest, compact effects for the common Gen-1 status moves. */
const STATUS_EFFECTS = {
  'growl':        { foeAtk: -0.25, text: 'lowered its foe\'s Attack!' },
  'tail-whip':    { foeDef: -0.25, text: 'lowered its foe\'s Defense!' },
  'leer':         { foeDef: -0.25, text: 'lowered its foe\'s Defense!' },
  'screech':      { foeDef: -0.4,  text: 'sharply lowered its foe\'s Defense!' },
  'string-shot':  { skip: true,    text: 'slowed its foe right down!' },
  'thunder-wave': { skip: true,    text: 'paralyzed its foe — it can\'t move!' },
  'sleep-powder': { skip: true,    text: 'put its foe to sleep!' },
  'sing':         { skip: true,    text: 'sang its foe to sleep!' },
  'hypnosis':     { skip: true,    text: 'hypnotized its foe!' },
  'stun-spore':   { skip: true,    text: 'paralyzed its foe!' },
  'poison-powder':{ dot: 0.08,     text: 'poisoned its foe!' },
  'toxic':        { dot: 0.10,     text: 'badly poisoned its foe!' },
  'leech-seed':   { dot: 0.08,     text: 'planted a seed that drains its foe!' },
  'harden':       { selfDef: 0.3,  text: 'raised its own Defense!' },
  'withdraw':     { selfDef: 0.3,  text: 'pulled into its shell!' },
  'defense-curl': { selfDef: 0.25, text: 'curled up and got tougher!' },
  'swords-dance': { selfAtk: 0.5,  text: 'sharply raised its Attack!' },
  'agility':      { selfAtk: 0.2,  text: 'sped up and hits harder!' },
  'double-team':  { selfDef: 0.2,  text: 'made copies of itself!' },
  'recover':      { heal: 0.3,     text: 'restored its health!' },
  'rest':         { heal: 0.5,     text: 'slept and healed up!' },
  'softboiled':   { heal: 0.3,     text: 'restored its health!' },
};

export function statusEffect(move) {
  return STATUS_EFFECTS[move?.name] ?? { selfAtk: 0.3, text: 'focused hard — its next hit will land harder!' };
}

/* ---------------- damage ---------------- */

/**
 * Damage, using the real move's type, power and physical/special class, scaled
 * by how well the question was answered. `quality` is 1 for a right answer,
 * 0.6 / 0.3 for close numeric guesses, 0 for a miss.
 *
 * `move` may be a real move record or a plain {type, power, class} — passing a
 * bare number still works for the old call shape.
 */
export function damage(attacker, defender, move, quality, jitter = true, mods = {}) {
  if (quality <= 0) return { dmg: 0, mult: 1, fizzled: true, missed: false };

  const mv = typeof move === 'number'
    ? { power: move, type: species(attacker.dex).types[0], class: 'physical', acc: 100 }
    : move;

  // Real accuracy: a 70%-accurate move really can miss. Answering well doesn't
  // change that, which is why the strongest moves aren't automatically best.
  if (jitter && mv.acc && rand() * 100 > mv.acc) {
    return { dmg: 0, mult: 1, fizzled: false, missed: true };
  }

  const special = mv.class === 'special';
  const atk = statAt(attacker.dex, special ? 'spa' : 'atk', attacker.level) * (1 + (mods.selfAtk ?? 0));
  const def = statAt(defender.dex, special ? 'spd' : 'def', defender.level) * (1 + (mods.foeDef ?? 0));
  const mult = typeMultiplier(mv.type, species(defender.dex).types);
  // same-type attack bonus, exactly like the games
  const stab = species(attacker.dex).types.includes(mv.type) ? 1.5 : 1;
  // The real games divide by 50. We use 38 so a knockout takes 2-3 good hits
  // instead of 4-5 — every hit here costs a question, and a champion fight has
  // to stay inside a kid's attention span.
  const base = ((2 * attacker.level) / 5 + 2) * mv.power * (atk / Math.max(1, def)) / 38 + 2;
  const roll = jitter ? 0.85 + rand() * 0.15 : 0.93;
  return {
    dmg: Math.max(1, Math.round(base * mult * stab * quality * roll)),
    mult, stab, fizzled: false, missed: false,
  };
}

/* ---------------- catching ---------------- */

export const BALLS = [
  { id: 'poke',  name: 'Poké Ball',  bonus: 1.0, difficulty: 'easy',   xp: 20, color: '#e8442e' },
  { id: 'great', name: 'Great Ball', bonus: 1.5, difficulty: 'medium', xp: 35, color: '#2f6fd0' },
  { id: 'ultra', name: 'Ultra Ball', bonus: 2.0, difficulty: 'hard',   xp: 50, color: '#f0c419' },
];

/** Sleep and freeze are worth far more than the others — same as the real games. */
export const STATUS_CATCH_BONUS = { sleep: 2.5, freeze: 2.5, paralysis: 1.5, burn: 1.5, poison: 1.5, toxic: 1.5 };

/**
 * The real catch formula. This is why you weaken a Pokémon and put it to sleep
 * before throwing — both terms are right here in the numerator:
 *
 *   a = ((3·maxHP − 2·HP) × rate × ball × status) / (3·maxHP)
 *
 * At full HP the HP term is 1/3; at 1 HP it approaches 1, so knocking a
 * Pokémon down to red roughly triples your odds before any ball or status.
 */
export function catchChance(dexId, hp, hpMax, status, ballBonus) {
  const rate = species(dexId).catch;
  const statusBonus = STATUS_CATCH_BONUS[status] ?? 1;
  const a = ((3 * hpMax - 2 * Math.max(1, hp)) * rate * ballBonus * statusBonus) / (3 * hpMax);
  return clamp(a / 255, 0.02, 0.95);
}

/** How wobbly the ball looks — three shakes means it was very close. */
export function shakeCount(chanceValue, caught) {
  if (caught) return 3;
  if (chanceValue > 0.55) return 3;
  if (chanceValue > 0.3) return 2;
  return chanceValue > 0.12 ? 1 : 0;
}

/* ---------------- progression ---------------- */

/**
 * Add XP and level up, returning everything worth announcing — levels, new
 * moves to learn, and evolutions, in the order the real games do them.
 *
 * A 'learn' event means the caller must ASK: with a free slot the move is taken
 * automatically, but on a full set the player chooses which move to give up, or
 * to skip the new one. That choice is the whole point of the 4-move limit.
 */
export function grantXp(mon, amount) {
  const events = [];
  mon.xp += amount;
  while (mon.xp >= xpToNext(mon.level, mon.dex) && mon.level < 100) {
    mon.xp -= xpToNext(mon.level, mon.dex);
    mon.level++;
    const wasMax = maxHp(mon.dex, mon.level - 1);
    // levelling raises max HP; the gain is added rather than a free full heal
    mon.hp = Math.max(1, mon.hp + (maxHp(mon.dex, mon.level) - wasMax));
    events.push({ type: 'level', level: mon.level });

    for (const move of movesLearnedAt(mon.dex, mon.level)) {
      if (!Array.isArray(mon.moves)) mon.moves = startingMoves(mon.dex, mon.level - 1);
      if (mon.moves.includes(move)) continue;
      // record WHICH form is learning it: the real games teach the move before
      // the evolution animation, so the prompt should still say Charmander.
      events.push({ type: 'learn', move, full: mon.moves.length >= MOVE_SLOTS, atDex: mon.dex });
    }

    const evo = evolutionFor(mon);
    if (evo) {
      const from = species(mon.dex).name;
      const fromDex = mon.dex;
      const wasMaxHp = maxHp(fromDex, mon.level);
      mon.dex = evo;
      // Evolving raises max HP but is NOT a free heal — carry the damage over,
      // exactly as useEvoItem does for stones.
      mon.hp = Math.max(1, mon.hp + (maxHp(mon.dex, mon.level) - wasMaxHp));
      events.push({ type: 'evolve', from, to: species(evo).name, fromDex, dex: evo });
    }
  }
  return events;
}

/* ---------------- evolution ----------------
 * PL_CHAINS is [{id, nodes:[{id, from, level, trigger, item, trade}]}].
 * Three real routes exist in the Gen-1 data and all three work here:
 *   • level-up at a threshold (52 forms)      — automatic on levelling
 *   • use a stone (13 forms)                  — profile.items, earned by learning
 *   • trade (4 forms: Alakazam, Machamp,      — no second player, so the
 *     Golem, Gengar)                            fan-game "linking cord" item
 */

export const EVO_ITEMS = {
  'moon stone':    { label: 'Moon Stone',    emoji: '🌙' },
  'fire stone':    { label: 'Fire Stone',    emoji: '🔥' },
  'water stone':   { label: 'Water Stone',   emoji: '💧' },
  'thunder stone': { label: 'Thunder Stone', emoji: '⚡' },
  'leaf stone':    { label: 'Leaf Stone',    emoji: '🍃' },
  'linking cord':  { label: 'Linking Cord',  emoji: '🔗' },
};

// PL_CHAINS was generated from PokéAPI filtered to Gen 1 — and any chain whose
// ROOT is a Gen-2 baby (Pichu, Cleffa, Igglybuff) was dropped entirely, taking
// three perfectly good Gen-1 evolutions with it. Without this supplement a
// caught Pikachu can never become Raichu.
const MISSING_LINKS = [
  { from: 25, to: 26, item: 'thunder stone' },   // Pikachu  → Raichu
  { from: 35, to: 36, item: 'moon stone' },      // Clefairy → Clefable
  { from: 39, to: 40, item: 'moon stone' },      // Jigglypuff → Wigglytuff
];

let evoIndex = null;   // from-dex -> [{to, level?, item?}]
function buildEvoIndex() {
  evoIndex = new Map();
  const add = (from, entry) => {
    const list = evoIndex.get(from) ?? [];
    list.push(entry);
    evoIndex.set(from, list);
  };
  for (const chain of CHAINS()) {
    for (const n of chain.nodes ?? []) {
      if (n.from == null) continue;
      if (n.trade) add(n.from, { to: n.id, item: 'linking cord' });
      else if (n.item) add(n.from, { to: n.id, item: n.item });
      else if (n.trigger === 'level-up' && n.level != null) add(n.from, { to: n.id, level: n.level });
    }
  }
  for (const m of MISSING_LINKS) add(m.from, { to: m.to, item: m.item });
}

/** The automatic route only: level-up evolutions. Stones never fire on their own. */
export function evolutionFor(mon) {
  if (!evoIndex) buildEvoIndex();
  for (const o of evoIndex.get(mon.dex) ?? []) {
    if (o.level != null && mon.level >= o.level) return o.to;
  }
  return null;
}

/** Everything this Pokémon could evolve into, for the team screen's hint. */
export function evolutionOptions(mon) {
  if (!evoIndex) buildEvoIndex();
  return (evoIndex.get(mon.dex) ?? []).map(o => ({
    to: o.to, toName: species(o.to).name,
    level: o.level ?? null, item: o.item ?? null,
    itemLabel: o.item ? (EVO_ITEMS[o.item]?.label ?? o.item) : null,
  }));
}

/** Which party members an item would evolve, without evolving them. */
export function itemTargets(profile, item) {
  if (!evoIndex) buildEvoIndex();
  return profile.party.filter(mon =>
    (evoIndex.get(mon.dex) ?? []).some(o => o.item === item));
}

/**
 * Use a stone or cord on one Pokémon. Consumes the item and returns the same
 * event shape grantXp emits, so the ceremony code is shared.
 */
export function useEvoItem(profile, mon, item) {
  if (!evoIndex) buildEvoIndex();
  if ((profile.items?.[item] ?? 0) <= 0) return null;
  const opt = (evoIndex.get(mon.dex) ?? []).find(o => o.item === item);
  if (!opt) return null;
  profile.items[item]--;
  const from = species(mon.dex).name;
  const fromDex = mon.dex;
  mon.dex = opt.to;
  mon.hp = Math.min(mon.hp, maxHp(mon.dex, mon.level));   // keep damage, new cap
  return { type: 'evolve', from, to: species(opt.to).name, fromDex, dex: opt.to };
}

/** Grant an evolution item, creating the bag on old saves. */
export function grantItem(profile, item, n = 1) {
  profile.items = profile.items ?? {};
  profile.items[item] = (profile.items[item] ?? 0) + n;
}

/* ---------------- party helpers ---------------- */

export const PARTY_MAX = 6;

export function addCatch(profile, mon) {
  if (profile.party.length < PARTY_MAX) profile.party.push(mon);
  else profile.box.push(mon);
  if (!profile.seen.includes(mon.dex)) profile.seen.push(mon.dex);
  profile.stats.caught++;
}

export const firstHealthy = (profile) => profile.party.find(m => m.hp > 0) ?? null;
export const partyWiped = (profile) => profile.party.every(m => m.hp <= 0);

export function healParty(profile) {
  for (const m of profile.party) m.hp = maxHp(m.dex, m.level);
}

/** The starter you're handed in town if you somehow reach a battle with nothing. */
export function ensureStarter(profile) {
  if (profile.party.length === 0) {
    const starter = makeMon([1, 4, 7][Math.floor(rand() * 3)], 5);
    profile.party.push(starter);
    if (!profile.seen.includes(starter.dex)) profile.seen.push(starter.dex);
    return starter;
  }
  return null;
}
