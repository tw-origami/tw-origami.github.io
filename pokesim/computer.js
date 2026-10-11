// Battle Lab — the computer opponent.
//
// Two jobs: build a random team out of the real Pokémon, and choose moves for it during a battle.
//
// The teams are real Gen I Pokémon with their real stats, real types and real level-up moves, so
// facing one is also learning what a Charizard or a Machamp is actually like. Difficulty changes
// which Pokémon can turn up and how well the computer plays; it never cheats on the rules.
//
// Pure of the DOM, so it can be tested against the referee in Node.

import { isSimulated, computeDamage } from '../poketrivia/js/battle-engine.js';
import { chooseMove } from '../poketrivia/js/battle-ai.js';
import { total } from './stats.js';
import * as B from './battle.js';

const W = () => globalThis.window ?? globalThis;
const MOVES = () => W().PL_MOVES;

export const CPU_SIDE = { id: 'cpu', name: 'Computer', color: '#8b5cf6', soft: '#ede9fe' };

/** The five legendaries in the Gen I dex: Articuno, Zapdos, Moltres, Mewtwo, Mew. */
const LEGENDARY = new Set([144, 145, 146, 150, 151]);

export const DIFFICULTY = {
  easy:   { label: 'Easy',   bst: [180, 420], legendary: false, skill: 0.2,  note: 'Smaller Pokémon, plays a bit randomly' },
  normal: { label: 'Normal', bst: [330, 540], legendary: false, skill: 0.6,  note: 'Fully-grown Pokémon, plays sensibly' },
  hard:   { label: 'Hard',   bst: [450, 700], legendary: true,  skill: 0.92, note: 'The strongest Pokémon, plays to win' },
};

/* ------------------------------------------------------------------ building a team */

function pickMoves(sp, level, rng) {
  const learn = (W().PL_LEARNSET?.[sp.id] ?? []).filter(x => x.lv <= level);
  const seen = new Set();
  const usable = [];
  for (const { m } of learn) {
    if (seen.has(m)) continue;
    seen.add(m);
    const mv = MOVES()[m];
    if (mv && isSimulated(mv)) usable.push(mv);
  }
  const worth = (mv) => mv.power * ((mv.acc ?? 100) / 100) * (sp.types.includes(mv.type) ? 1.5 : 1);
  // The AI only weighs up damage, so a self-KO move would be used on turn one at full health.
  // Real trainers hold those back, so they're only a last resort for a Pokémon with nothing else.
  const SELF_KO = new Set(['explosion', 'self-destruct', 'misty-explosion']);
  let attacks = usable.filter(mv => mv.power > 0 && !SELF_KO.has(mv.name));
  if (attacks.length < 2) attacks = usable.filter(mv => mv.power > 0);
  attacks.sort((a, b) => worth(b) - worth(a));

  // best attacks first, but no more than two of one type so the set has some range
  const chosen = [], perType = {};
  for (const mv of attacks) {
    if ((perType[mv.type] ?? 0) >= 2) continue;
    chosen.push(mv); perType[mv.type] = (perType[mv.type] ?? 0) + 1;
    if (chosen.length === 3) break;
  }
  // a fourth move that does something useful rather than a fourth attack, when there is one
  const utility = usable.filter(mv => mv.power === 0 && (mv.heal > 0 || (mv.stats?.length && mv.target === 'user')
    || (mv.ailment && ['sleep', 'paralysis', 'burn', 'poison'].includes(mv.ailment))));
  if (utility.length && rng() < 0.7) chosen.push(utility[Math.floor(rng() * utility.length)]);
  for (const mv of attacks) { if (chosen.length >= 4) break; if (!chosen.includes(mv)) chosen.push(mv); }
  if (!chosen.length) chosen.push(MOVES().tackle ?? Object.values(MOVES()).find(m => m.power > 0));
  return chosen.slice(0, 4).map(mv => ({ real: mv.name }));
}

let serial = 0;

/**
 * A random team of real Pokémon.
 *   size       1–6
 *   level      what level they all are
 *   difficulty 'easy' | 'normal' | 'hard'
 */
export function generateTeam({ size = 3, level = 50, difficulty = 'normal', rng = Math.random } = {}) {
  const cfg = DIFFICULTY[difficulty] ?? DIFFICULTY.normal;
  const dex = W().PL_DEX;
  let pool = dex.filter(d => {
    const t = total(d.stats);
    return t >= cfg.bst[0] && t <= cfg.bst[1] && (cfg.legendary || !LEGENDARY.has(d.id));
  });
  if (pool.length < size) pool = dex.filter(d => cfg.legendary || !LEGENDARY.has(d.id));

  const team = [];
  const bag = pool.slice();
  for (let i = 0; i < Math.max(1, Math.min(6, size)) && bag.length; i++) {
    const sp = bag.splice(Math.floor(rng() * bag.length), 1)[0];
    const abil = (W().PL_ABILITIES?.[sp.id] ?? []).find(a => !a.hidden)?.name;
    team.push({
      id: `cpu-${Date.now().toString(36)}-${++serial}-${sp.id}`,
      side: CPU_SIDE.id,
      name: sp.name,
      types: sp.types.slice(),
      level: Math.max(1, Math.min(100, Math.round(level))),
      stats: { ...sp.stats },
      nature: 'serious',
      ability: abil && W().PL_ABILITY_FX?.[abil] ? abil : 'none',
      item: 'none',
      legendary: LEGENDARY.has(sp.id),
      img: '',
      art: `../poketrivia/img/art/${sp.id}.png`,
      dex: sp.id,
      created: serial,
      moves: pickMoves(sp, Math.max(1, Math.round(level)), rng),
      cpu: true,
    });
  }
  return team;
}

/* ------------------------------------------------------------------ playing */

/** Expected damage this Pokémon's best move would do to the foe right now, as a fraction of the foe's HP. */
function bestHit(match, me, foe) {
  let best = 0;
  for (const slot of me.moves) {
    const mv = MOVES()[slot.name];
    if (!mv || slot.pp <= 0 || !(mv.power > 0)) continue;
    const r = computeDamage(me, foe, mv, match.battle, 1, { fixedRoll: 0.925 });
    best = Math.max(best, (r.dmg / Math.max(1, foe.hp)) * ((mv.acc ?? 100) / 100));
  }
  return best;
}

/** Who to send in after a knockout: whoever would hurt the foe most, with a little noise at low skill. */
export function chooseReplacement(match, i, skill = 0.6, rng = Math.random) {
  const side = match.sides[i], foe = match.sides[1 - i].active;
  const alive = side.team.map((b, idx) => ({ b, idx })).filter(x => !x.b.fainted && x.b !== side.active);
  if (!alive.length) return null;
  if (rng() > skill) return alive[Math.floor(rng() * alive.length)].idx;
  alive.sort((a, b) => bestHit(match, b.b, foe) - bestHit(match, a.b, foe));
  return alive[0].idx;
}

/**
 * The computer's choice for this turn: a move, or occasionally a switch. Always legal — if the
 * AI's pick is somehow not on the list it falls back to a random legal move.
 */
export function choose(match, i, skill = 0.6, rng = Math.random) {
  const opts = B.options(match, i);
  const legal = opts.moves.filter(m => !m.disabled);
  if (!legal.length) return B.randomChoice(match, i, rng);
  if (legal.length === 1 && legal[0].forced) return { type: 'move', move: legal[0].key };

  const me = match.sides[i].active, foe = match.sides[1 - i].active;

  // a skilled player gets out of a hopeless matchup when something on the bench is clearly better
  if (opts.bench.length && skill >= 0.55 && !me.volatile.choiceLock) {
    const mine = bestHit(match, me, foe);
    const bench = opts.bench.map(x => ({ x, hit: bestHit(match, match.sides[i].team[x.idx], foe) }))
      .sort((a, b) => b.hit - a.hit)[0];
    if (mine < 0.12 && bench && bench.hit > Math.max(0.3, mine * 3) && rng() < skill * 0.6) {
      return { type: 'switch', to: bench.x.idx };
    }
  }

  let key;
  try { key = chooseMove(match.battle, me, foe, skill); } catch { key = null; }
  if (key && legal.some(m => m.key === key)) return { type: 'move', move: key };
  return B.randomChoice(match, i, rng);
}
