// Battle Lab — the referee.
//
// A thin layer over the real battle engine from PokéTrivia. The engine does all the
// Pokémon: the damage formula, type chart, STAB, crits, status, stat stages, abilities,
// held items. This file only does what a person would do at the table: line up two teams,
// take each side's choice for the turn, hand it to the engine, handle fainting and
// switching, and call the winner.
//
// A duel is just a team battle where each team has one Pokémon, so there is one code path.
//
// No DOM in here. It can be driven from the page or from a test.

import * as E from '../poketrivia/js/battle-engine.js';
import * as party from '../poketrivia/js/party.js';
import { prepareForBattle } from './store.js';

const MOVES = () => (globalThis.window ?? globalThis).PL_MOVES ?? {};
const ITEMS = () => (globalThis.window ?? globalThis).PL_ITEMS ?? {};

// Moves that take two turns. The engine plays every move as a single action, so left alone these
// would be strictly better than the real thing — Solar Beam's 120 power with no wind-up.
//   charge   — spend a turn gathering power, then the move goes off next turn
//   recharge — the move goes off at once, then the user can't act the turn after
// (Fly, Dig and Dive also make the user untouchable while charging in the real games; that part
// isn't modelled, so those are a little weaker here than the real moves.)
const CHARGE = new Set(['solar-beam', 'solar-blade', 'razor-wind', 'sky-attack', 'skull-bash',
  'dig', 'fly', 'dive', 'bounce', 'freeze-shock', 'ice-burn', 'shadow-force', 'phantom-force']);
const RECHARGE = new Set(['hyper-beam', 'giga-impact', 'blast-burn', 'frenzy-plant', 'hydro-cannon',
  'rock-wrecker', 'roar-of-time', 'prismatic-laser', 'eternabeam', 'meteor-assault']);
const RECHARGE_KEY = '__recharge', NOOP = '__noop';
const SUN_SKIPS_CHARGE = new Set(['solar-beam', 'solar-blade']);

export const esc = (s) => String(s).replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ------------------------------------------------------------------ setting up */

/**
 * Two kids can easily both call a creature "Flamey", and the engine reports everything by NAME,
 * so a clash would make the log impossible to read (and the code unable to tell whose it was).
 * Names are made unique for the length of the battle: a clash between the two sides gets the
 * owner appended, and a clash inside one team gets a number.
 */
function uniqueNames(sides) {
  const all = sides.flatMap((s, si) => s.team.map(b => ({ b, si })));
  const norm = (n) => n.trim().toLowerCase();
  const groups = new Map();
  for (const x of all) { const k = norm(x.b.name); (groups.get(k) ?? groups.set(k, []).get(k)).push(x); }
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const crossSide = new Set(list.map(x => x.si)).size > 1;
    if (crossSide) for (const x of list) x.b.name = `${x.b.name} (${sides[x.si].name})`;
  }
  // anything still clashing is inside one team
  const seen = new Map();
  for (const x of all) {
    const k = norm(x.b.name), n = (seen.get(k) ?? 0) + 1;
    seen.set(k, n);
    if (n > 1) x.b.name = `${x.b.name} ${n}`;
  }
}

function buildBattler(mon, sideIdx, levelMode) {
  const { dex, moveKeys, ability } = prepareForBattle(mon);
  const level = levelMode === 'own' ? mon.level : levelMode;
  const b = E.makeBattler(
    { dex, level, hp: party.maxHp(dex, level) },
    { moves: moveKeys, nature: mon.nature || 'serious', ability, item: mon.item || 'none' });
  b.mon = mon;
  b.sideIdx = sideIdx;
  return b;
}

/**
 * lineups: [{ side:{id,name,color}, mons:[mon,…] }, { … }] — order is the order they're sent out.
 * levelMode: 'own' to keep each Pokémon's level, or a number to put everyone on the same level.
 */
export function createMatch(lineups, { levelMode = 'own' } = {}) {
  const sides = lineups.map((l, i) => ({
    id: l.side.id, name: l.side.name, owner: l.side.owner ?? l.side.name, color: l.side.color,
    plural: !!l.side.plural,        // "Ryland & Reid" take a plural verb — they win, they send out
    coop: !!l.side.coop,            // one side made of Pokémon from more than one owner
    team: l.mons.map(m => buildBattler(m, i, levelMode)),
    active: null, needSwitch: false, defeated: false,
  }));
  uniqueNames(sides);
  for (const s of sides) s.active = s.team[0];
  return {
    battle: E.createBattle(),
    sides, turn: 0, phase: 'choose', winner: null,
    history: [],          // [{ title, events }] — one entry per turn, for the log
    levelMode,
  };
}

/** Send the leads out and let any switch-in abilities (Intimidate, Drizzle…) fire. */
export function startMatch(match) {
  const [a, b] = match.sides;
  const events = [
    { t: 'lead', side: 0, name: a.active.name }, { t: 'lead', side: 1, name: b.active.name },
  ];
  enter(match, [0, 1], events);
  match.history.push({ title: 'Battle start', events });
  return events;
}

const sunSkipsCharge = (match, move) => SUN_SKIPS_CHARGE.has(move) && match.battle.weather === 'sun';

/* ------------------------------------------------------------------ the choices */

const foeOf = (match, i) => match.sides[1 - i];

/**
 * Trigger switch-in abilities for everyone who has just come out. When more than one Pokémon
 * arrives at once they must all be reset first and only then fire their abilities — see
 * resetOnEntry in the engine — or the later one erases the earlier one's Intimidate.
 */
function enter(match, sideIdxs, events) {
  for (const i of sideIdxs) E.resetOnEntry(match.sides[i].active);
  for (const i of sideIdxs) E.onSwitchIn(match.battle, match.sides[i].active, foeOf(match, i).active, events, { reset: false });
}

export function moveInfo(key) {
  return key === party.STRUGGLE.name ? party.STRUGGLE : (MOVES()[key] ?? null);
}

/** What a side could do right now. Out of PP on everything means Struggle, as in the games. */
export function options(match, i, { hints = false } = {}) {
  const side = match.sides[i], me = side.active, foe = foeOf(match, i).active;
  let moves = me.moves.map(m => {
    const info = moveInfo(m.name);
    const o = {
      key: m.name, label: info?.label ?? m.name, type: info?.type ?? 'normal', cls: info?.class ?? 'physical',
      power: info?.power ?? 0, acc: info?.acc ?? null, pp: m.pp, maxPp: m.maxPp,
      short: info?.short ?? '', disabled: m.pp <= 0, invented: !!info?.invented,
    };
    if (hints && o.power > 0 && foe && !foe.fainted) o.mult = party.typeMultiplier(o.type, foe.types);
    return o;
  });
  // A Pokémon that is recharging, or halfway through a two-turn move, has no real choice.
  if (me.volatile.recharge) {
    return { moves: [{ key: RECHARGE_KEY, label: 'Recharge', type: 'normal', cls: 'status', power: 0, acc: null,
      pp: 1, maxPp: 1, short: 'It has to recover from using that much power.', disabled: false, forced: true }], bench: [] };
  }
  const charging = me.volatile.charging;
  if (charging) {
    const m = moves.find(x => x.key === charging);
    return { moves: [{ ...(m ?? { key: charging, label: charging, type: 'normal', cls: 'physical', power: 0, acc: null, pp: 1, maxPp: 1, short: '' }),
      disabled: false, forced: true }], bench: [] };
  }

  // Choice Band / Specs / Scarf: once it has picked a move, it is stuck with that move until it
  // switches out. The engine only applies the damage boost, so the restriction lives here.
  const lock = me.volatile.choiceLock;
  if (lock) moves = moves.map(m => (m.key === lock ? m : { ...m, disabled: true, locked: true }));
  if (moves.every(m => m.disabled)) {
    const s = party.STRUGGLE;
    moves = [{ key: s.name, label: s.label ?? 'Struggle', type: s.type ?? 'normal', cls: s.class ?? 'physical',
      power: s.power ?? 50, acc: null, pp: 1, maxPp: 1, short: 'No PP left — it flails and hurts itself too.',
      disabled: false, invented: false }];
  }
  const bench = side.team.map((b, idx) => ({ idx, b })).filter(x => x.b !== me && !x.b.fainted)
    .map(x => ({ idx: x.idx, name: x.b.name, level: x.b.level, hp: x.b.hp, maxHp: x.b.maxHp, status: x.b.status, types: x.b.types }));
  return { moves, bench };
}

export function randomChoice(match, i, rng = Math.random) {
  const { moves } = options(match, i);
  const ok = moves.filter(m => !m.disabled);
  return { type: 'move', move: ok[Math.floor(rng() * ok.length)].key };
}

function checkChoice(match, i, c) {
  const { moves, bench } = options(match, i);
  if (c?.type === 'move') {
    if (!moves.some(m => m.key === c.move && !m.disabled)) throw new Error(`${match.sides[i].name} can't use that move`);
  } else if (c?.type === 'switch') {
    if (!bench.some(b => b.idx === c.to)) throw new Error(`${match.sides[i].name} can't switch to that one`);
  } else throw new Error('no choice made');
}

/* ------------------------------------------------------------------ one turn */

function swapIn(match, i, to, events, voluntary) {
  const side = match.sides[i];
  const out = side.active;
  out.volatile.choiceLock = null;           // a locked Pokémon is free again once it leaves
  out.volatile.charging = null;
  out.volatile.recharge = false;
  side.active = side.team[to];
  events.push({ t: 'sendOut', side: i, name: side.active.name, from: voluntary ? out.name : null });
}

function settle(match) {
  const [a, b] = match.sides;
  for (const s of match.sides) {
    s.defeated = s.team.every(x => x.fainted);
    s.needSwitch = !s.defeated && s.active.fainted;
  }
  if (a.defeated && b.defeated) { match.winner = 'draw'; match.phase = 'over'; }
  else if (a.defeated) { match.winner = 1; match.phase = 'over'; }
  else if (b.defeated) { match.winner = 0; match.phase = 'over'; }
  else match.phase = (a.needSwitch || b.needSwitch) ? 'replace' : 'choose';
}

/** Resolve one turn from both sides' choices. Returns the events, which are also kept in history. */
export function playTurn(match, choices) {
  if (match.phase !== 'choose') throw new Error('not time to choose');
  match.sides.forEach((_, i) => checkChoice(match, i, choices[i]));
  const events = [];

  // switches happen before anyone attacks, and the attacker then hits whoever came in
  const switching = [0, 1].filter(i => choices[i].type === 'switch');
  for (const i of switching) swapIn(match, i, choices[i].to, events, true);
  enter(match, switching, events);

  for (const i of [0, 1]) {
    const a = match.sides[i].active;
    if (choices[i].type === 'move' && ITEMS()[a.item]?.choiceLock && choices[i].move !== party.STRUGGLE.name) {
      a.volatile.choiceLock = choices[i].move;
    }
  }

  const used = [null, null];                 // the real move each side actually fires this turn
  const entries = [0, 1].map(i => {
    const user = match.sides[i].active, c = choices[i];
    const entry = (move) => ({ user, target: foeOf(match, i).active, quality: 1, action: { type: 'move', move } });
    if (c.type === 'switch') return { user, target: foeOf(match, i).active, quality: 1, action: { type: 'switch' } };
    if (c.move === RECHARGE_KEY) {
      user.volatile.recharge = false;
      events.push({ t: 'recharge', who: user.name });
      return entry(NOOP);                    // an unknown move: the engine does nothing, but end-of-turn still runs
    }
    const wasCharging = user.volatile.charging === c.move;
    if (wasCharging) user.volatile.charging = null;
    else if (CHARGE.has(c.move) && !(sunSkipsCharge(match, c.move))) {
      user.volatile.charging = c.move;
      events.push({ t: 'charge', who: user.name, move: moveInfo(c.move)?.label ?? c.move });
      return entry(NOOP);
    }
    used[i] = c.move;
    return entry(c.move);
  });
  const turnEvents = E.resolveTurn(match.battle, entries);
  events.push(...turnEvents);

  // a recharge move that actually connected leaves the user needing next turn to recover
  for (const i of [0, 1]) {
    if (used[i] && RECHARGE.has(used[i]) && turnEvents.some(e => e.t === 'damage' && e.by === match.sides[i].active.name)) {
      match.sides[i].active.volatile.recharge = true;
    }
  }

  match.turn = match.battle.turn;
  settle(match);
  match.history.push({ title: `Turn ${match.turn}`, events });
  return events;
}

/**
 * After a knockout the owner picks who comes in — no turn is spent. If both sides need one they
 * both come in together, and only then do the switch-in abilities fire.
 */
export function replace(match, picks) {
  if (match.phase !== 'replace') throw new Error('nobody needs replacing');
  const need = [0, 1].filter(i => match.sides[i].needSwitch);
  for (const i of need) {
    const p = picks[i];
    const mon = match.sides[i].team[p];
    if (p == null || !mon || mon.fainted || mon === match.sides[i].active) throw new Error(`${match.sides[i].name} must pick someone who can still fight`);
  }
  const events = [];
  for (const i of need) swapIn(match, i, picks[i], events, false);
  enter(match, need, events);
  settle(match);
  match.history.push({ title: 'Replacements', events });
  return events;
}

/* ------------------------------------------------------------------ reading it back */

export function sideOfName(match, name) {
  return match.sides.findIndex(s => s.team.some(b => b.name === name));
}

const STATUS_TEXT = {
  burn: 'was burned!', poison: 'was poisoned!', toxic: 'was badly poisoned!',
  paralysis: 'is paralyzed! It may not be able to move!', sleep: 'fell asleep!',
  freeze: 'was frozen solid!', confusion: 'became confused!',
};
const STAT_NAME = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', acc: 'Accuracy', eva: 'Evasiveness' };
const EFF = (m) => m === 0 ? "It had no effect…" : m >= 4 ? 'It’s doubly super effective!!'
  : m >= 2 ? 'It’s super effective!' : m <= 0.25 ? 'It’s barely effective…' : m <= 0.5 ? 'It’s not very effective…' : '';

/** One engine event as a sentence (HTML-safe), or null when it isn't worth a line. */
export function narrate(ev, match) {
  const who = (n) => `<b>${esc(n)}</b>`;
  const side = (i) => esc(match.sides[i].name);
  const verb = (i, one, many) => (match.sides[i].plural ? many : one);
  switch (ev.t) {
    case 'lead': return `${side(ev.side)} ${verb(ev.side, 'sends', 'send')} out ${who(ev.name)}!`;
    case 'sendOut': return ev.from
      ? `${side(ev.side)} ${verb(ev.side, 'pulls', 'pull')} back ${who(ev.from)} and ${verb(ev.side, 'sends', 'send')} out ${who(ev.name)}!`
      : `${side(ev.side)} ${verb(ev.side, 'sends', 'send')} out ${who(ev.name)}!`;
    case 'charge': return `${who(ev.who)} is gathering power for <b>${esc(ev.move)}</b>!`;
    case 'recharge': return `${who(ev.who)} has to recharge — it can't move!`;
    case 'turn': return null;
    case 'switch': return null;
    case 'move': return `${who(ev.who)} used <b>${esc(ev.move)}</b>!`;
    case 'damage': {
      const bits = [`${ev.dmg} damage.`];
      if (ev.crit) bits.push('<span class="eff">A critical hit!</span>');
      const e = EFF(ev.typeMult);
      if (e) bits.push(`<span class="eff">${e}</span>`);
      if (ev.stab) bits.push('<span class="eff">Same-type bonus.</span>');
      return bits.join(' ');
    }
    case 'noEffect': return `<span class="eff">It doesn’t affect ${who(ev.who)} at all…</span>`;
    case 'miss': return `It missed! <span class="eff">That move only lands ${ev.acc}% of the time.</span>`;
    case 'status': return `${who(ev.who)} ${STATUS_TEXT[ev.status] ?? 'was affected!'}`;
    case 'statusFail': return '…but it failed.';
    case 'stat': return `${who(ev.who)}’s ${STAT_NAME[ev.stat] ?? ev.stat} ${Math.abs(ev.stage) >= 2 ? 'sharply ' : ''}${ev.stage > 0 ? 'rose' : 'fell'}!`;
    case 'statFail': return `${who(ev.who)}’s ${STAT_NAME[ev.stat] ?? ev.stat} won’t go any ${ev.dir === 'up' ? 'higher' : 'lower'}!`;
    case 'heal': return `${who(ev.who)} recovered ${ev.amount} HP${ev.why ? ` (${esc(ev.why)})` : ''}!`;
    case 'healFail': return '…but its HP is already full.';
    case 'recoil': return `${who(ev.who)} was hurt by ${esc(ev.why ?? 'recoil')} — ${ev.amount} HP.`;
    case 'statusHurt': return `${who(ev.who)} is hurt by its ${esc(ev.status)}! ${ev.amount} HP.`;
    case 'weatherHurt': return `${who(ev.who)} is buffeted by the ${esc(ev.weather)}! ${ev.amount} HP.`;
    case 'itemHurt': return `${who(ev.who)} was hurt by the ${esc(ev.item)}!`;
    case 'faint': return `<b class="faint">${esc(ev.who)} fainted!</b>`;
    case 'flinch': return `${who(ev.who)} flinched and couldn’t move!`;
    case 'asleep': return `${who(ev.who)} is fast asleep.`;
    case 'wake': return `${who(ev.who)} woke up!`;
    case 'frozen': return `${who(ev.who)} is frozen solid!`;
    case 'thaw': return `${who(ev.who)} thawed out!`;
    case 'fullPara': return `${who(ev.who)} is paralyzed! It couldn’t move!`;
    case 'confusedHit': return `${who(ev.who)} is confused — it hurt itself! ${ev.dmg} HP.`;
    case 'snapOut': return `${who(ev.who)} snapped out of its confusion!`;
    case 'protect': return `${who(ev.who)} protected itself!`;
    case 'protectFail': return '…but it failed. <span class="eff">Protect can’t be used turn after turn.</span>';
    case 'blocked': return `${who(ev.who)} protected itself from the attack!`;
    case 'abilityImmune':
    case 'abilityAbsorb':
    case 'ability': return ev.text ? esc(ev.text).replace('{P}', who(ev.who)) : null;
    case 'endured': return `${who(ev.who)} hung on with its ${esc(ev.why)}!`;
    case 'weather': return `The weather changed: ${esc(ev.weather)}.`;
    case 'weatherEnd': return `The ${esc(ev.weather)} stopped.`;
    case 'noPp': return '…but that move has no PP left!';
    case 'noOutcome': return '…but nothing happened.';
    case 'multiHit': return `It hit ${ev.hits} times!`;
    case 'noTarget': return null;
    default: return null;
  }
}

export function snapshot(b) {
  return {
    name: b.name, level: b.level, hp: b.hp, maxHp: b.maxHp, pct: Math.max(0, Math.round((b.hp / b.maxHp) * 100)),
    status: b.status, fainted: b.fainted, types: b.types,
    stages: Object.entries(b.stages).filter(([, v]) => v).map(([stat, v]) => ({ stat, v })),
    confused: (b.volatile?.confusion ?? 0) > 0,
  };
}

export function summary(match) {
  const w = match.winner;
  return {
    winner: w === 'draw' ? null : match.sides[w],
    draw: w === 'draw',
    turns: match.turn,
    standing: match.sides.map(s => ({ name: s.name, alive: s.team.filter(b => !b.fainted).length, total: s.team.length })),
  };
}
