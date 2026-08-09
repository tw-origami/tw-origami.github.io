// Asserts the grading, catch and damage maths. Run: node tools/check-grading.mjs
// These formulas decide whether the game feels fair, so they get real tests.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/* ---- load the browser modules that have no DOM dependency ---- */
globalThis.window = globalThis;
new Function(readFileSync(join(root, 'data/dex.js'), 'utf8'))();
new Function(readFileSync(join(root, 'data/moves.js'), 'utf8'))();

const { gradeNumeric, parseNumber } = await import('../js/grading.js');
const party = await import('../js/party.js');

let pass = 0;
const check = (label, fn) => { fn(); pass++; console.log('  ok  ' + label); };

console.log('\nnumeric grading');
check('exact answer is full credit', () => assert.equal(gradeNumeric(42, 42), 1));
check('within 5% is partial (0.6)', () => assert.equal(gradeNumeric(103, 100), 0.6));
check('within 15% is partial (0.3)', () => assert.equal(gradeNumeric(112, 100), 0.3));
check('20% off is a miss', () => assert.equal(gradeNumeric(120, 100), 0));
check('small whole numbers need exactness', () => {
  assert.equal(gradeNumeric(13, 12), 0, '3x4=13 must not earn partial credit');
  assert.equal(gradeNumeric(12, 12), 1);
});
check('big numbers still allow estimating', () => assert.equal(gradeNumeric(1020, 1000), 0.6));
check('blank / nonsense scores zero', () => {
  assert.equal(gradeNumeric(null, 10), 0);
  assert.equal(gradeNumeric(NaN, 10), 0);
});
check('negative answers work', () => assert.equal(gradeNumeric(-8, -8), 1));

console.log('\nanswer parsing');
check('plain number', () => assert.equal(parseNumber('42'), 42));
check('comma decimal', () => assert.equal(parseNumber('3,5'), 3.5));
check('units are ignored', () => assert.equal(parseNumber('12 km'), 12));
check('fractions are accepted', () => assert.equal(parseNumber('3/4'), 0.75));
check('empty is null', () => assert.equal(parseNumber('   '), null));

// Catch mechanics moved to tools/check-battle.mjs, where they can be tested
// against HP and status — the two things that actually drive the formula.

console.log('\nreal moves from PokéAPI');
check('every Pokémon has a usable move list', () => {
  for (let id = 1; id <= 151; id++) {
    const mv = party.movesFor(id, 20);
    assert.ok(mv.length > 0, `dex ${id} has no moves`);
    assert.ok(mv.some(m => m.power > 0), `dex ${id} has nothing to attack with at L20`);
  }
});
check('learnsets are level-gated', () => {
  const early = party.movesFor(25, 5).map(m => m.name);
  const late = party.movesFor(25, 30).map(m => m.name);
  assert.ok(!early.includes('thunderbolt'), 'Pikachu should not know Thunderbolt at level 5');
  assert.ok(late.includes('thunderbolt'), 'Pikachu should know Thunderbolt by level 30');
});
check('abilities are real', () => {
  const a = party.abilitiesFor(25).map(x => x.name);
  assert.deepEqual(a.sort(), ['lightning-rod', 'static']);
});
check('move power maps to question difficulty', () => {
  assert.equal(party.difficultyForMove(party.moveInfo('tackle')), 'easy');       // 40
  assert.equal(party.difficultyForMove(party.moveInfo('thunderbolt')), 'hard');  // 90
});

console.log('\ndamage');
const EMBER = party.moveInfo('ember');            // fire, 40, special
const FLAME = party.moveInfo('flamethrower');     // fire, 90, special
const mine = party.makeMon(4, 10);                // Charmander
const foe = party.makeMon(1, 10);                 // Bulbasaur (grass — weak to fire)
check('a wrong answer does nothing', () => {
  const r = party.damage(mine, foe, EMBER, 0);
  assert.equal(r.dmg, 0);
  assert.equal(r.fizzled, true);
});
check('the move\'s own type sets effectiveness', () => {
  const r = party.damage(mine, foe, EMBER, 1, false);
  assert.equal(r.mult, 2, 'fire on grass should be 2x');
  assert.equal(r.stab, 1.5, 'a fire Pokémon using a fire move gets STAB');
});
check('a mismatched move loses the type bonus', () => {
  const r = party.damage(mine, foe, party.moveInfo('scratch'), 1, false);
  assert.equal(r.mult, 1);
  assert.equal(r.stab, 1);
});
check('answer quality scales damage', () => {
  const full = party.damage(mine, foe, EMBER, 1, false).dmg;
  const part = party.damage(mine, foe, EMBER, 0.6, false).dmg;
  assert.ok(part < full && part > 0, `${part} should sit between 0 and ${full}`);
});
check('stronger moves hit harder', () => {
  const weak = party.damage(mine, foe, EMBER, 1, false).dmg;
  const strong = party.damage(mine, foe, FLAME, 1, false).dmg;
  assert.ok(strong > weak * 1.8, `${strong} should clearly beat ${weak}`);
});
check('a right answer clearly beats the enemy baseline', () => {
  const ENEMY_QUALITY = 0.62;   // mirrors js/encounter-battle.js
  const a = party.makeMon(19, 10), b = party.makeMon(19, 10);
  const mv = party.moveInfo('tackle');
  const player = party.damage(a, b, mv, 1, false).dmg;
  const enemy = party.damage(b, a, mv, ENEMY_QUALITY, false).dmg;
  assert.ok(player > enemy * 1.4,
    `knowing the answer must out-damage the AI with room to spare (${player} vs ${enemy})`);
});
/** Turns to win vs turns to lose, assuming the player answers `acc` of the time. */
function fightOdds(me, foe, acc) {
  const myBest = party.movesFor(me.dex, me.level).filter(m => m.power > 0).pop();
  const foeBest = party.movesFor(foe.dex, foe.level).filter(m => m.power > 0).pop();
  const myHit = party.damage(me, foe, myBest, 1, false).dmg;
  const foeHit = party.damage(foe, me, foeBest, 0.62, false).dmg;
  return {
    win: Math.ceil(party.maxHp(foe.dex, foe.level) / myHit / acc),
    lose: Math.ceil(party.maxHp(me.dex, me.level) / foeHit),
    myHit, foeHit, myBest: myBest.label, foeBest: foeBest.label,
  };
}

check('the tutorial fight is winnable at 50% accuracy', () => {
  // Losing is a real teaching moment later on, but not on the very first fight.
  const o = fightOdds(party.makeMon(1, 5), party.makeMon(19, 3), 0.5);
  assert.ok(o.lose > o.win,
    `tutorial: ${o.myBest} does ${o.myHit} (win in ${o.win}), ` +
    `${o.foeBest} does ${o.foeHit} (lose in ${o.lose})`);
});
check('an even mid-game fight is winnable at 70% accuracy', () => {
  // Charmander vs Rattata: no type edge either way, so this is purely about
  // whether the player knows their answers.
  const o = fightOdds(party.makeMon(4, 12), party.makeMon(19, 11), 0.7);
  assert.ok(o.lose > o.win, `mid-game: win in ${o.win}, lose in ${o.lose}`);
});
check('a coin-flip player loses an even mid-game fight', () => {
  // The stakes have to be real, or the questions stop mattering.
  const o = fightOdds(party.makeMon(4, 12), party.makeMon(19, 11), 0.4);
  assert.ok(o.lose <= o.win, `guessing should not win: win in ${o.win}, lose in ${o.lose}`);
});
check('a bad type matchup really punishes you', () => {
  // Charmander into Geodude: fire is resisted, rock hits back for double. Even a
  // strong player should lose this and learn to switch — that IS the lesson.
  const o = fightOdds(party.makeMon(4, 12), party.makeMon(74, 11), 0.9);
  assert.ok(o.lose < o.win, `type matchups must matter: win in ${o.win}, lose in ${o.lose}`);
});
check('switching to the right type turns that fight around', () => {
  const o = fightOdds(party.makeMon(7, 12), party.makeMon(74, 11), 0.7);   // Squirtle
  assert.ok(o.lose > o.win, `water should beat rock: win in ${o.win}, lose in ${o.lose}`);
});
check('a champion fight stays inside ~20 questions', () => {
  // 3 Pokémon at L15 vs a L18 team: count the correct answers a clean run needs
  const mine = party.makeMon(6, 18);
  let hits = 0;
  for (const lv of [14, 15, 16]) {
    const foe = party.makeMon(105, lv);
    const mv = party.movesFor(mine.dex, mine.level).filter(m => m.power > 0).pop();
    hits += Math.ceil(party.maxHp(foe.dex, foe.level) / party.damage(mine, foe, mv, 1, false).dmg);
  }
  assert.ok(hits <= 14, `a champion should fall in about a dozen good answers, not ${hits}`);
});

console.log('\nprogression');
check('levelling up raises max HP', () => {
  assert.ok(party.maxHp(25, 20) > party.maxHp(25, 5));
});
check('enough XP evolves Charmander into Charmeleon at 16', () => {
  const m = party.makeMon(4, 15);
  m.xp = 0;
  const events = party.grantXp(m, party.xpToNext(15) + 1);
  assert.ok(events.some(e => e.type === 'evolve' && e.to === 'Charmeleon'),
    'expected an evolution, got ' + JSON.stringify(events));
  assert.equal(m.dex, 5);
});
check('a fully healed party is at max HP', () => {
  const p = { party: [party.makeMon(25, 12)] };
  p.party[0].hp = 1;
  party.healParty(p);
  assert.equal(p.party[0].hp, party.maxHp(25, 12));
});

console.log(`\n${pass} checks passed\n`);
