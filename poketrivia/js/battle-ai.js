// The opponent's brain.
//
// A random move picker would make the player's strategy meaningless — there'd be
// nothing to outplay. This AI scores every move it has by what would actually
// happen if it used it, then picks from the top with a little noise so it isn't
// perfectly predictable.
//
// `skill` (0..1) is the difficulty dial: at 0 it plays close to random, at 1 it
// always takes the best line. Route trainers sit low, zone champions sit high.

import { computeDamage, effStat, canTakeStatus, stageMult } from './battle-engine.js';
import { typeMultiplier } from './party.js';

const MOVES = () => window.PL_MOVES ?? {};

/** What this move is worth this turn, in rough "percent of the foe's HP" units. */
function scoreMove(battle, me, foe, slot) {
  const mv = MOVES()[slot.name];
  if (!mv || slot.pp <= 0) return -Infinity;

  const acc = (mv.acc ?? 100) / 100;

  if (mv.power > 0) {
    const res = computeDamage(me, foe, mv, battle, 1, { forceCrit: false, fixedRoll: 0.925 });
    if (res.typeMult === 0) return -Infinity;              // never pick a move that can't hit
    let score = (res.dmg / foe.hp) * 100 * acc;
    if (res.dmg >= foe.hp) score += 100;                   // a knockout is worth everything
    // a chance to paralyze or burn is worth a little extra
    if (mv.ailment && mv.ailChance >= 10 && canTakeStatus(foe, mv.ailment)) score += 6;
    if (mv.flinch >= 10) score += 4;
    if (mv.drain > 0 && me.hp < me.maxHp * 0.6) score += 8;
    if (mv.drain < 0 && me.hp < me.maxHp * 0.35) score -= 15;   // don't kill yourself on recoil
    return score;
  }

  /* --- status moves --- */
  // Healing is worth a lot when hurt and nothing at full HP.
  if (mv.heal > 0) {
    const missing = (me.maxHp - me.hp) / me.maxHp;
    return missing < 0.35 ? -5 : missing * 90;
  }

  // Protect is for scouting and stalling, not for spamming.
  if (/protect|detect/.test(mv.name)) {
    return (me.volatile.protectStreak ?? 0) > 0 ? -20 : (me.hp < me.maxHp * 0.4 ? 25 : 8);
  }

  // A status condition is most valuable early, on a healthy target.
  if (mv.ailment) {
    if (!canTakeStatus(foe, mv.ailment)) return -Infinity;
    const worth = { sleep: 55, paralysis: 40, burn: 38, freeze: 50, poison: 30, toxic: 45, confusion: 25 };
    return (worth[mv.ailment] ?? 20) * acc * (foe.hp / foe.maxHp);
  }

  // Stat moves: boosting is good while you're healthy, debuffing is always ok.
  if (mv.stats?.length) {
    const self = mv.target === 'user';
    const total = mv.stats.reduce((n, s) => n + s.stage, 0);
    if (self && total > 0) {
      const room = 6 - Math.max(...mv.stats.map(s => me.stages[statKey(s.stat)] ?? 0));
      if (room <= 0) return -Infinity;
      return me.hp > me.maxHp * 0.6 ? 22 + total * 6 : 4;
    }
    if (!self && total < 0) {
      const room = 6 + Math.min(...mv.stats.map(s => foe.stages[statKey(s.stat)] ?? 0));
      if (room <= 0) return -Infinity;
      return 16;
    }
  }

  return 3;   // an unknown status move is better than nothing, barely
}

const statKey = (s) => ({
  attack: 'atk', defense: 'def', 'special-attack': 'spa',
  'special-defense': 'spd', speed: 'spe', accuracy: 'acc', evasion: 'eva',
}[s] ?? s);

/** Choose a move. Returns the move name. */
export function chooseMove(battle, me, foe, skill = 0.7) {
  const scored = me.moves
    .map(slot => ({ slot, score: scoreMove(battle, me, foe, slot) }))
    .filter(s => s.score > -Infinity)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return me.moves[0]?.name ?? 'struggle';

  // At high skill it takes the best line; at low skill it wanders down the list.
  const spread = Math.max(1, Math.round((1 - skill) * scored.length));
  const pick = scored[Math.floor(Math.random() * spread)];
  return pick.slot.name;
}

/**
 * Would switching help? Returns the party index to switch to, or -1.
 * The AI switches for the same reason a person does: the current matchup is bad
 * and something on the bench genuinely fixes it.
 */
export function chooseSwitch(battle, me, foe, bench, skill = 0.7) {
  if (skill < 0.5 || !bench.length) return -1;

  const incoming = bestIncomingMultiplier(foe, me);
  if (incoming < 2) return -1;                    // not actually in trouble
  if (me.hp > me.maxHp * 0.5 && incoming < 4) return -1;

  let best = -1, bestScore = 0;
  bench.forEach((b, i) => {
    if (b.fainted) return;
    const takes = bestIncomingMultiplier(foe, b);
    const gives = bestOutgoingMultiplier(b, foe);
    const score = gives / Math.max(0.25, takes);
    if (score > bestScore && takes < incoming) { bestScore = score; best = i; }
  });
  return bestScore >= 2 ? best : -1;
}

function bestIncomingMultiplier(attacker, defender) {
  let worst = 0;
  for (const slot of attacker.moves) {
    const mv = MOVES()[slot.name];
    if (!mv || mv.power <= 0) continue;
    worst = Math.max(worst, typeMultiplier(mv.type, defender.types));
  }
  return worst || 1;
}

function bestOutgoingMultiplier(attacker, defender) {
  return bestIncomingMultiplier(attacker, defender);
}

/** A short, honest note about why the AI did that — used in the battle log. */
export function explainChoice(battle, me, foe, moveName) {
  const mv = MOVES()[moveName];
  if (!mv) return null;
  if (mv.power > 0) {
    const m = typeMultiplier(mv.type, foe.types);
    if (m >= 2) return 'it is going for the type advantage';
    if (m === 0) return null;
  }
  if (mv.heal > 0) return 'it is healing up';
  if (mv.ailment) return 'it is trying to land a status condition';
  if (mv.stats?.some(s => s.stage > 0)) return 'it is setting up';
  return null;
}
