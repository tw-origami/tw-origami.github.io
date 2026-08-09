// Proves the battle engine behaves like actual Pokémon.
// Run: node tools/check-battle.mjs
//
// Every test here is a claim a competitive player would recognise. If one of
// these breaks, someone who knows the games will notice within a turn or two.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
globalThis.window = globalThis;
for (const f of ['data/dex.js', 'data/moves.js', 'data/battle-data.js']) {
  new Function(readFileSync(join(root, f), 'utf8'))();
}

const E = await import('../js/battle-engine.js');
const party = await import('../js/party.js');

let pass = 0, group = '';
const section = (s) => { group = s; console.log('\n' + s); };
const check = (label, fn) => { fn(); pass++; console.log('  ok  ' + label); };

// Deterministic by default: 0.5 means "only guaranteed things happen".
const steady = () => 0.5;
const always = () => 0;          // every percentage roll succeeds
const never = () => 0.999;       // every percentage roll fails
E.setRng(steady);

const mon = (dex, level, over = {}) =>
  E.makeBattler({ dex, level, hp: party.maxHp(dex, level) }, over);
const has = (log, t, extra = {}) =>
  log.some(e => e.t === t && Object.entries(extra).every(([k, v]) => e[k] === v));
const find = (log, t) => log.find(e => e.t === t);

/* ==================================================================== */
section('turn order — priority beats speed');

check('a faster Pokémon moves first when priority is equal', () => {
  const b = E.createBattle();
  const fast = mon(25, 30);            // Pikachu, speed 90 base
  const slow = mon(143, 30);           // Snorlax, speed 30 base
  const order = E.orderActions(b, [
    { user: slow, action: { type: 'move', move: 'tackle' } },
    { user: fast, action: { type: 'move', move: 'tackle' } },
  ]);
  assert.equal(order[0].user.name, 'Pikachu');
});

check('Quick Attack (+1) lets a slow Pokémon strike first', () => {
  const b = E.createBattle();
  const fast = mon(25, 30);
  const slow = mon(143, 30);
  const order = E.orderActions(b, [
    { user: slow, action: { type: 'move', move: 'quick-attack' } },
    { user: fast, action: { type: 'move', move: 'tackle' } },
  ]);
  assert.equal(order[0].user.name, 'Snorlax', 'priority must override the speed stat');
});

check('Protect (+4) outruns Quick Attack (+1)', () => {
  const b = E.createBattle();
  const a = mon(143, 30), c = mon(25, 30);
  const order = E.orderActions(b, [
    { user: c, action: { type: 'move', move: 'quick-attack' } },
    { user: a, action: { type: 'move', move: 'protect' } },
  ]);
  assert.equal(order[0].user.name, 'Snorlax');
});

check('Trick Room makes the slow Pokémon move first', () => {
  const b = E.createBattle();
  b.trickRoom = true;
  const fast = mon(25, 30), slow = mon(143, 30);
  const order = E.orderActions(b, [
    { user: fast, action: { type: 'move', move: 'tackle' } },
    { user: slow, action: { type: 'move', move: 'tackle' } },
  ]);
  assert.equal(order[0].user.name, 'Snorlax');
});

check('switching always resolves before any move', () => {
  const b = E.createBattle();
  const fast = mon(25, 30), slow = mon(143, 30);
  const order = E.orderActions(b, [
    { user: fast, action: { type: 'move', move: 'quick-attack' } },
    { user: slow, action: { type: 'switch' } },
  ]);
  assert.equal(order[0].action.type, 'switch');
});

/* ==================================================================== */
section('stat stages');

check('the stage multipliers match the real table', () => {
  assert.equal(E.stageMult(0), 1);
  assert.equal(E.stageMult(1), 1.5);
  assert.equal(E.stageMult(2), 2);
  assert.equal(E.stageMult(6), 4);
  assert.equal(E.stageMult(-1), 2 / 3);
  assert.equal(E.stageMult(-2), 0.5);
  assert.equal(E.stageMult(-6), 0.25);
});

check('stages clamp at -6, so Growl can never zero out an attack', () => {
  const b = E.createBattle();
  const user = mon(19, 20), foe = mon(1, 20);
  for (let i = 0; i < 10; i++) E.useMove(b, user, foe, 'growl', 1);
  assert.equal(foe.stages.atk, -6, 'must bottom out at -6, not keep falling');
  const atk = E.effStat(foe, 'atk', b);
  const base = E.effStat(mon(1, 20), 'atk', b);
  assert.equal(atk, Math.floor(base * 0.25), 'at -6 the attack is quartered, not erased');
  assert.ok(atk > 0, 'a stat can never reach zero');
});

check('Growl lowers Attack, Tail Whip lowers Defense', () => {
  const b = E.createBattle();
  const user = mon(19, 20), foe = mon(1, 20);
  E.useMove(b, user, foe, 'growl', 1);
  assert.equal(foe.stages.atk, -1);
  assert.equal(foe.stages.def, 0, 'Growl must not touch Defense');
  E.useMove(b, user, foe, 'tail-whip', 1);
  assert.equal(foe.stages.def, -1);
});

check('Swords Dance raises the user\'s own Attack by two stages', () => {
  const b = E.createBattle();
  const user = mon(4, 40), foe = mon(1, 40);
  user.moves.push({ name: 'swords-dance', pp: 20, maxPp: 20 });
  E.useMove(b, user, foe, 'swords-dance', 1);
  assert.equal(user.stages.atk, 2);
  assert.equal(foe.stages.atk, 0, 'a self-targeting boost must not hit the foe');
});

check('a maxed stat reports that it cannot go higher', () => {
  const b = E.createBattle();
  const user = mon(4, 40), foe = mon(1, 40);
  user.moves.push({ name: 'swords-dance', pp: 40, maxPp: 40 });
  for (let i = 0; i < 4; i++) E.useMove(b, user, foe, 'swords-dance', 1);
  const log = E.useMove(b, user, foe, 'swords-dance', 1);
  assert.equal(user.stages.atk, 6);
  assert.ok(has(log, 'statFail'), 'should say it cannot go higher');
});

/* ==================================================================== */
section('type effectiveness');

check('an immunity means literally zero damage', () => {
  const b = E.createBattle();
  const gengar = mon(94, 40);                   // ghost/poison
  const log = E.useMove(b, mon(143, 40), gengar, 'tackle', 1);
  assert.ok(has(log, 'noEffect'), 'Normal must not affect Ghost at all');
  assert.equal(gengar.hp, gengar.maxHp);
});

check('a double weakness multiplies to 4x', () => {
  const b = E.createBattle();
  const charizard = mon(6, 40);                 // fire/flying
  const res = E.computeDamage(mon(25, 40), charizard, window.PL_MOVES['rock-throw'],
    b, 1, { forceCrit: false, fixedRoll: 1 });
  assert.equal(res.typeMult, 4, 'rock hits both fire and flying for double');
});

check('same-type attack bonus is 1.5x and only for matching types', () => {
  const b = E.createBattle();
  const pika = mon(25, 40), foe = mon(19, 40);
  const electric = E.computeDamage(pika, foe, window.PL_MOVES['thunder-shock'], b, 1,
    { forceCrit: false, fixedRoll: 1 });
  const normal = E.computeDamage(pika, foe, window.PL_MOVES['quick-attack'], b, 1,
    { forceCrit: false, fixedRoll: 1 });
  assert.equal(electric.stab, 1.5);
  assert.equal(normal.stab, 1);
});

/* ==================================================================== */
section('status conditions');

check('burn halves physical attack and chips 1/16 each turn', () => {
  const b = E.createBattle();
  const m = mon(4, 40);
  const healthy = E.effStat(m, 'atk', b);
  m.status = 'burn';
  assert.equal(E.effStat(m, 'atk', b), Math.floor(healthy * 0.5));
  const before = m.hp;
  E.endOfTurn(b, [m]);
  assert.equal(before - m.hp, Math.floor(m.maxHp / 16));
});

check('burn does not weaken special attacks', () => {
  const b = E.createBattle();
  const m = mon(4, 40);
  const healthy = E.effStat(m, 'spa', b);
  m.status = 'burn';
  assert.equal(E.effStat(m, 'spa', b), healthy);
});

check('paralysis halves speed and sometimes stops you moving', () => {
  const b = E.createBattle();
  const m = mon(25, 40);
  const healthy = E.effStat(m, 'spe', b);
  m.status = 'paralysis';
  assert.equal(E.effStat(m, 'spe', b), Math.floor(healthy * 0.5));
  E.setRng(always);                                  // force the 25% full-paralysis
  const log = E.useMove(b, m, mon(1, 40), 'thunder-shock', 1);
  assert.ok(has(log, 'fullPara'));
  E.setRng(steady);
});

check('poison chips 1/8, toxic ramps up every turn', () => {
  const b = E.createBattle();
  const p = mon(1, 40); p.status = 'poison';
  const t = mon(4, 40); t.status = 'toxic';
  E.endOfTurn(b, [p, t]);
  assert.equal(find(E.endOfTurn(b, [p]), 'statusHurt').amount, Math.floor(p.maxHp / 8));
  const first = t.maxHp - t.hp;
  E.endOfTurn(b, [t]);
  const second = (t.maxHp - t.hp) - first;
  assert.ok(second > first, `toxic must escalate (${first} then ${second})`);
});

check('a Fire type cannot be burned and an Electric type cannot be paralyzed', () => {
  assert.equal(E.canTakeStatus(mon(4, 30), 'burn'), false);
  assert.equal(E.canTakeStatus(mon(25, 30), 'paralysis'), false);
  assert.equal(E.canTakeStatus(mon(1, 30), 'burn'), true);
});

check('sleep stops you moving, then wears off', () => {
  const b = E.createBattle();
  const m = mon(1, 30), foe = mon(4, 30);
  m.status = 'sleep'; m.statusTurns = 2;
  assert.ok(has(E.useMove(b, m, foe, 'tackle', 1), 'asleep'));
  assert.ok(has(E.useMove(b, m, foe, 'tackle', 1), 'asleep'));
  const log = E.useMove(b, m, foe, 'tackle', 1);
  assert.ok(has(log, 'wake'));
  assert.ok(has(log, 'move'), 'should act on the turn it wakes up');
});

check('Thunderbolt paralyzes about 10% of the time', () => {
  const b = E.createBattle();
  E.setRng(always);
  const foe = mon(1, 40);
  E.useMove(b, mon(25, 40), foe, 'thunderbolt', 1);
  assert.equal(foe.status, 'paralysis', 'the 10% secondary must be able to fire');
  E.setRng(never);
  const foe2 = mon(1, 40);
  E.useMove(b, mon(25, 40), foe2, 'thunderbolt', 1);
  assert.equal(foe2.status, null, 'and must not fire every time');
  E.setRng(steady);
});

/* ==================================================================== */
section('abilities');

check('Intimidate lowers the foe\'s Attack on switch-in', () => {
  const b = E.createBattle();
  const gyarados = mon(130, 40, { ability: 'intimidate' });
  const foe = mon(1, 40);
  E.onSwitchIn(b, gyarados, foe);
  assert.equal(foe.stages.atk, -1);
});

check('Levitate makes Ground moves miss entirely', () => {
  const b = E.createBattle();
  const gengar = mon(94, 40, { ability: 'levitate' });
  const log = E.useMove(b, mon(50, 40), gengar, 'dig', 1);
  assert.ok(has(log, 'abilityImmune'), 'Ground must not touch a Levitate Pokémon');
  assert.equal(gengar.hp, gengar.maxHp);
});

check('Volt Absorb turns an Electric hit into healing', () => {
  const b = E.createBattle();
  const lanturn = mon(125, 40, { ability: 'volt-absorb' });
  lanturn.hp = Math.floor(lanturn.maxHp / 2);
  const before = lanturn.hp;
  const log = E.useMove(b, mon(25, 40), lanturn, 'thunder-shock', 1);
  assert.ok(lanturn.hp > before, 'should heal, not take damage');
  assert.ok(has(log, 'abilityAbsorb'));
});

check('Static can paralyze whatever touched you', () => {
  const b = E.createBattle();
  E.setRng(always);
  const pika = mon(25, 40, { ability: 'static' });
  const attacker = mon(1, 40);
  E.useMove(b, attacker, pika, 'tackle', 1);
  assert.equal(attacker.status, 'paralysis', 'contact moves trigger Static');
  E.setRng(steady);
});

check('Static does not trigger on a special move (no contact)', () => {
  const b = E.createBattle();
  E.setRng(always);
  const pika = mon(25, 40, { ability: 'static' });
  const attacker = mon(1, 40);
  attacker.moves.push({ name: 'absorb', pp: 25, maxPp: 25 });
  E.useMove(b, attacker, pika, 'absorb', 1);
  assert.equal(attacker.status, null);
  E.setRng(steady);
});

check('Clear Body blocks the foe\'s stat drops but allows your own boosts', () => {
  const b = E.createBattle();
  const metang = mon(95, 40, { ability: 'clear-body' });   // Onix stands in
  E.useMove(b, mon(19, 40), metang, 'growl', 1);
  assert.equal(metang.stages.atk, 0, 'Clear Body must refuse the drop');
  metang.moves.push({ name: 'harden', pp: 30, maxPp: 30 });
  E.useMove(b, metang, mon(19, 40), 'harden', 1);
  assert.equal(metang.stages.def, 1, 'but its own boost still works');
});

check('Blaze only kicks in below a third HP', () => {
  const b = E.createBattle();
  const chariz = mon(6, 40, { ability: 'blaze' });
  const foe = mon(1, 40);
  const ember = window.PL_MOVES.ember;
  const healthy = E.computeDamage(chariz, foe, ember, b, 1, { forceCrit: false, fixedRoll: 1 }).dmg;
  chariz.hp = Math.floor(chariz.maxHp / 4);
  const pinched = E.computeDamage(chariz, foe, ember, b, 1, { forceCrit: false, fixedRoll: 1 }).dmg;
  assert.ok(pinched > healthy * 1.4, `Blaze should add ~50% (${healthy} → ${pinched})`);
});

/* ==================================================================== */
section('held items');

check('Leftovers restores 1/16 at end of turn', () => {
  const b = E.createBattle();
  const m = mon(143, 40, { item: 'leftovers' });
  m.hp = Math.floor(m.maxHp / 2);
  const before = m.hp;
  E.endOfTurn(b, [m]);
  assert.equal(m.hp - before, Math.floor(m.maxHp / 16));
});

check('Life Orb hits harder but costs you HP', () => {
  const b = E.createBattle();
  const plain = mon(4, 40);
  const orbed = mon(4, 40, { item: 'life-orb' });
  const foe = mon(1, 40);
  const ember = window.PL_MOVES.ember;
  const a = E.computeDamage(plain, foe, ember, b, 1, { forceCrit: false, fixedRoll: 1 }).dmg;
  const c = E.computeDamage(orbed, foe, ember, b, 1, { forceCrit: false, fixedRoll: 1 }).dmg;
  assert.ok(c > a, 'Life Orb should boost damage');
  const before = orbed.hp;
  E.useMove(b, orbed, mon(1, 40), 'ember', 1);
  assert.ok(orbed.hp < before, 'and cost the holder health');
});

check('Focus Sash survives a knockout from full HP', () => {
  const b = E.createBattle();
  const frail = mon(129, 5, { item: 'focus-sash' });      // Magikarp
  const log = E.useMove(b, mon(150, 60), frail, 'psychic', 1);
  assert.equal(frail.hp, 1, 'should be left on exactly 1 HP');
  assert.ok(has(log, 'endured'));
  assert.equal(frail.fainted, false);
});

/* ==================================================================== */
section('natures');

check('a nature shifts two stats by 10% in opposite directions', () => {
  const b = E.createBattle();
  const neutral = mon(4, 50, { nature: 'serious' });
  const adamant = mon(4, 50, { nature: 'adamant' });      // +atk / -spa
  assert.ok(E.effStat(adamant, 'atk', b) > E.effStat(neutral, 'atk', b));
  assert.ok(E.effStat(adamant, 'spa', b) < E.effStat(neutral, 'spa', b));
  assert.equal(E.effStat(adamant, 'def', b), E.effStat(neutral, 'def', b));
});

/* ==================================================================== */
section('moves with special behaviour');

check('Protect blocks the incoming move', () => {
  const b = E.createBattle();
  const me = mon(1, 40), foe = mon(4, 40);
  me.moves.push({ name: 'protect', pp: 10, maxPp: 10 });
  E.useMove(b, me, foe, 'protect', 1);
  const log = E.useMove(b, foe, me, 'ember', 1);
  assert.ok(has(log, 'blocked'));
  assert.equal(me.hp, me.maxHp);
});

check('Protect used twice in a row is likely to fail', () => {
  const b = E.createBattle();
  E.setRng(never);                       // fail the 1-in-3 re-use roll
  const me = mon(1, 40), foe = mon(4, 40);
  me.moves.push({ name: 'protect', pp: 10, maxPp: 10 });
  E.useMove(b, me, foe, 'protect', 1);
  me.volatile.protecting = false;
  const log = E.useMove(b, me, foe, 'protect', 1);
  assert.ok(has(log, 'protectFail'), 'spamming Protect must not be free');
  E.setRng(steady);
});

check('a draining move heals the attacker', () => {
  const b = E.createBattle();
  const me = mon(1, 40); me.hp = Math.floor(me.maxHp / 2);
  me.moves.push({ name: 'absorb', pp: 25, maxPp: 25 });
  const before = me.hp;
  const log = E.useMove(b, me, mon(19, 40), 'absorb', 1);
  assert.ok(me.hp > before);
  assert.ok(has(log, 'heal', { why: 'drain' }));
});

check('a recoil move hurts the attacker', () => {
  const b = E.createBattle();
  const me = mon(143, 45);
  me.moves.push({ name: 'double-edge', pp: 15, maxPp: 15 });
  const before = me.hp;
  const log = E.useMove(b, me, mon(1, 45), 'double-edge', 1);
  assert.ok(me.hp < before);
  assert.ok(has(log, 'recoil'));
});

check('Recover restores half your HP, and fails at full', () => {
  const b = E.createBattle();
  const me = mon(151, 50);
  me.moves.push({ name: 'recover', pp: 10, maxPp: 10 });
  me.hp = Math.floor(me.maxHp / 4);
  E.useMove(b, me, mon(1, 50), 'recover', 1);
  assert.ok(me.hp > me.maxHp * 0.7, 'should heal about half the bar');
  me.hp = me.maxHp;
  assert.ok(has(E.useMove(b, me, mon(1, 50), 'recover', 1), 'healFail'));
});

check('PP runs out and the move stops working', () => {
  const b = E.createBattle();
  const me = mon(1, 20), foe = mon(19, 60);
  const slot = me.moves.find(m => window.PL_MOVES[m.name].power > 0);
  slot.pp = 1;
  E.useMove(b, me, foe, slot.name, 1);
  assert.equal(slot.pp, 0);
  assert.ok(has(E.useMove(b, me, foe, slot.name, 1), 'noPp'));
});

/* ==================================================================== */
section('critical hits');

check('a critical hit ignores the defender\'s Defense boosts', () => {
  const b = E.createBattle();
  const atk = mon(4, 40), def = mon(1, 40);
  def.stages.def = 4;                                     // heavily fortified
  const move = window.PL_MOVES.scratch;
  const normal = E.computeDamage(atk, def, move, b, 1, { forceCrit: false, fixedRoll: 1 }).dmg;
  const crit = E.computeDamage(atk, def, move, b, 1, { forceCrit: true, fixedRoll: 1 }).dmg;
  assert.ok(crit > normal * 2, `a crit should cut through the wall (${normal} → ${crit})`);
});

/* ==================================================================== */
section('switching');

check('switching out clears your stat changes', () => {
  const b = E.createBattle();
  const m = mon(1, 40);
  m.stages.atk = -4; m.stages.spe = 2; m.volatile.confusion = 3;
  E.onSwitchIn(b, m, mon(4, 40));
  assert.equal(m.stages.atk, 0);
  assert.equal(m.stages.spe, 0);
  assert.equal(m.volatile.confusion, 0);
});

check('but status conditions follow you out', () => {
  const b = E.createBattle();
  const m = mon(1, 40);
  m.status = 'burn';
  E.onSwitchIn(b, m, mon(4, 40));
  assert.equal(m.status, 'burn', 'burn is not cured by switching');
});

/* ==================================================================== */
section('catching — weaken it, sleep it, then throw');

const pct = (dex, hpFrac, status, ball) => {
  const hpMax = party.maxHp(dex, 20);
  return party.catchChance(dex, Math.max(1, Math.round(hpMax * hpFrac)), hpMax, status, ball);
};

check('knocking it into the red roughly triples your odds', () => {
  const full = pct(16, 1, null, 1);        // Pidgey at full HP
  const red = pct(16, 0.05, null, 1);
  assert.ok(red > full * 2.5, `full ${(full * 100).toFixed(0)}% → red ${(red * 100).toFixed(0)}%`);
});

check('sleep is worth far more than paralysis', () => {
  // Bulbasaur (rate 45) rather than a common — a high-rate species just pins
  // the 95% ceiling and the comparison tells you nothing.
  const none = pct(1, 0.4, null, 1);
  const para = pct(1, 0.4, 'paralysis', 1);
  const asleep = pct(1, 0.4, 'sleep', 1);
  assert.ok(para > none, 'paralysis must help');
  assert.ok(asleep > para * 1.5, `sleep should clearly beat paralysis (${para} vs ${asleep})`);
});

check('a better ball helps, but not as much as playing well', () => {
  const ultraFull = pct(25, 1, null, 2.0);
  const pokeSleepRed = pct(25, 0.05, 'sleep', 1.0);
  assert.ok(pokeSleepRed > ultraFull,
    'a weakened sleeping target with a basic ball beats a fresh one with the best ball');
});

check('a legendary stays hard even played perfectly', () => {
  const best = pct(150, 0.05, 'sleep', 2.0);        // Mewtwo, red, asleep, Ultra Ball
  assert.ok(best < 0.15, `should stay a long hunt, got ${(best * 100).toFixed(1)}%`);
  assert.ok(best > 0.02, 'but not impossible');
});

check('a common Pokémon is catchable without a whole battle', () => {
  assert.ok(pct(16, 1, null, 1) > 0.25, 'a full-HP Pidgey should still be a fair shot');
});

check('the shake count tells you how close you were', () => {
  assert.equal(party.shakeCount(0.9, true), 3);
  assert.equal(party.shakeCount(0.6, false), 3);
  assert.equal(party.shakeCount(0.35, false), 2);
  assert.equal(party.shakeCount(0.2, false), 1);
  assert.equal(party.shakeCount(0.05, false), 0);
});

/* ==================================================================== */
section('the trivia layer on top');

check('a wrong answer makes the move fail without changing anything else', () => {
  const b = E.createBattle();
  const me = mon(4, 40), foe = mon(1, 40);
  const log = E.useMove(b, me, foe, 'ember', 0);
  assert.ok(has(log, 'fizzle'));
  assert.equal(foe.hp, foe.maxHp);
});

check('a close answer scales damage but still lands the hit', () => {
  const b = E.createBattle();
  const foeFull = mon(1, 40), foePart = mon(1, 40);
  E.useMove(b, mon(4, 40), foeFull, 'ember', 1);
  E.useMove(b, mon(4, 40), foePart, 'ember', 0.6);
  const full = foeFull.maxHp - foeFull.hp;
  const part = foePart.maxHp - foePart.hp;
  assert.ok(part > 0 && part < full, `${part} should sit between 0 and ${full}`);
});

check('answer quality never overrides a type immunity', () => {
  const b = E.createBattle();
  const gengar = mon(94, 40);
  E.useMove(b, mon(143, 40), gengar, 'tackle', 1);
  assert.equal(gengar.hp, gengar.maxHp, 'a perfect answer cannot make Normal hit Ghost');
});

/* ==================================================================== */
section('a full turn end to end');

check('resolveTurn runs both sides in the right order and ticks the turn', () => {
  const b = E.createBattle();
  const pika = mon(25, 30), lax = mon(143, 30);
  const log = E.resolveTurn(b, [
    { user: lax, target: pika, action: { type: 'move', move: 'tackle' }, quality: 1 },
    { user: pika, target: lax, action: { type: 'move', move: 'thunder-shock' }, quality: 1 },
  ]);
  const turn = find(log, 'turn');
  assert.equal(turn.n, 1);
  assert.equal(turn.order[0], 'Pikachu', 'the faster one acts first');
  assert.ok(has(log, 'damage'));
});

check('a battle actually reaches a knockout', () => {
  const b = E.createBattle();
  const strong = mon(150, 60), weak = mon(129, 10);       // Mewtwo vs Magikarp
  let turns = 0;
  while (!weak.fainted && turns < 30) {
    E.resolveTurn(b, [
      { user: strong, target: weak, action: { type: 'move', move: strong.moves.find(m => window.PL_MOVES[m.name].power > 0).name }, quality: 1 },
      { user: weak, target: strong, action: { type: 'move', move: weak.moves[0].name }, quality: 1 },
    ]);
    turns++;
  }
  assert.ok(weak.fainted, 'the fight has to end');
  assert.ok(turns <= 3, `a level-60 legendary should flatten a level-10 Magikarp fast (took ${turns})`);
});

console.log(`\n${pass} battle checks passed\n`);
