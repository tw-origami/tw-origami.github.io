// Proves the Battle Lab rules and referee behave like real Pokémon.
// Run: node pokesim/tools/check-sim.mjs
//
// Covers the three pieces that don't need a browser: the stat/move rules (stats.js), saving and
// syncing (store.js), and the referee (battle.js) running on top of the real engine.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const trivia = join(here, '..', '..', 'poketrivia');

globalThis.window = globalThis;
for (const f of ['data/dex.js', 'data/moves.js', 'data/growth.js', 'data/battle-data.js']) {
  new Function(readFileSync(join(trivia, f), 'utf8'))();
}
new Function(readFileSync(join(here, '..', 'moves-extra.js'), 'utf8'))();
// a stand-in for the browser's localStorage
const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k), key: i => [...mem.keys()][i], get length() { return mem.size; },
};

const S = await import('../stats.js');
const store = await import('../store.js');
const B = await import('../battle.js');
const E = await import('../../poketrivia/js/battle-engine.js');
const party = await import('../../poketrivia/js/party.js');

const TYPES = window.PL_TYPES, DEX = window.PL_DEX, CHART = window.PL_CHART;
let pass = 0;
const section = (s) => console.log('\n' + s);
const check = (label, fn) => { fn(); pass++; console.log('  ok  ' + label); };
const steady = () => 0.5;            // only guaranteed things happen
E.setRng(steady);

const stats = (hp, atk, def, spa, spd, spe) => ({ hp, atk, def, spa, spd, spe });
let counter = 0;
const mk = (side, name, types, st, moves, over = {}) => ({
  id: 'm' + (++counter), side, name, types, level: 50, stats: st, nature: 'serious', ability: 'none',
  item: 'none', legendary: false, img: '', created: counter,
  moves: moves.map(m => (typeof m === 'string' ? { real: m } : { custom: m })), ...over,
});

/* ==================================================================== */
section('the very first thing: registering an invented species must not hide the real ones');

check('a custom species registered BEFORE any lookup leaves Pikachu still findable', () => {
  const m = mk('ryland', 'Zorb', ['electric'], stats(60, 60, 60, 60, 60, 60), ['tackle']);
  const { dex } = store.prepareForBattle(m);
  assert.equal(party.species(dex).name, 'Zorb');
  assert.equal(party.species(25).name, 'Pikachu', 'registering first must not stop the real dex loading');
  assert.equal(party.species(150).name, 'Mewtwo');
});

/* ==================================================================== */
section('stat rules — grounded in how real Pokémon are built');

check('a total over 600 is refused, and at 720 only if legendary', () => {
  const big = stats(120, 120, 120, 120, 120, 120);               // 720
  assert.ok(S.statProblems(big, false).some(p => /720.*600|over the 600/.test(p)));
  assert.deepEqual(S.statProblems(big, true), []);
  assert.ok(S.statProblems(stats(120, 120, 120, 120, 120, 121), true).length, 'even legendaries stop at 720');
});

check('no single stat can pass 255, the real ceiling', () => {
  assert.ok(S.statProblems(stats(256, 1, 1, 1, 1, 1), false).some(p => /255/.test(p)));
  assert.deepEqual(S.statProblems(stats(255, 80, 80, 80, 80, 25), false), []);
});

check('every real Pokémon in the dex fits the legendary budget (the rules are not stricter than reality)', () => {
  for (const d of DEX) assert.deepEqual(S.statProblems(d.stats, true), [], d.name);
});

check('the strongest real ordinary-line Pokémon fit the normal 600 budget', () => {
  const dragonite = DEX.find(d => d.name === 'Dragonite');
  assert.equal(S.total(dragonite.stats), 600);
  assert.deepEqual(S.statProblems(dragonite.stats, false), []);
});

check('a stat total is described the way the games describe it', () => {
  assert.equal(S.tier(195).label, 'First stage');          // Magikarp-ish
  assert.equal(S.tier(500).label, 'Fully evolved');
  assert.equal(S.tier(600).label, 'Pseudo-legendary');     // Dragonite
  assert.equal(S.tier(680).label, 'Legendary');            // Mewtwo
  assert.equal(S.tier(720).label, 'Mythical');
});

check('"scale to fit" brings an over-budget build down to exactly the cap, no stat over 255', () => {
  const s = S.scaleToBudget(stats(255, 255, 255, 255, 255, 255), false);
  assert.equal(S.total(s), 600);
  for (const k of S.STAT_KEYS) assert.ok(s[k] <= 255 && s[k] >= 1);
  assert.deepEqual(S.scaleToBudget(stats(80, 80, 80, 80, 80, 80), false), stats(80, 80, 80, 80, 80, 80), 'a legal build is left alone');
});

check('comparing to real Pokémon finds the right one — a real Pokémon matches itself', () => {
  for (const name of ['Dragonite', 'Snorlax', 'Pikachu', 'Gengar']) {
    const d = DEX.find(x => x.name === name);
    const c = S.compareToReal(d.stats, DEX);
    assert.equal(c.byStrength.name, name, name + ' by strength');
    assert.equal(c.byShape.name, name, name + ' by shape');
  }
});

check('shape separates a wall from a glass cannon at the same total', () => {
  const wall = S.compareToReal(stats(130, 60, 140, 40, 90, 30), DEX).byShape;
  const cannon = S.compareToReal(stats(60, 70, 50, 140, 60, 130), DEX).byShape;
  assert.notEqual(wall.name, cannon.name);
  assert.ok(S.describeBuild(stats(130, 60, 140, 40, 90, 30)).includes('sturdy'));
  assert.ok(S.describeBuild(stats(60, 70, 50, 140, 60, 130)).includes('fast'));
});

check('type weaknesses are computed from the real chart (Water/Ground is 4x weak to Grass, immune to Electric)', () => {
  const p = S.defensiveProfile(['water', 'ground'], CHART, TYPES);
  assert.equal(p.weak.find(w => w.type === 'grass').mult, 4);
  assert.ok(p.immune.some(i => i.type === 'electric'));
  const ghost = S.defensiveProfile(['ghost'], CHART, TYPES);
  assert.ok(ghost.immune.some(i => i.type === 'normal') && ghost.immune.some(i => i.type === 'fighting'));
});

/* ==================================================================== */
section('invented moves — held to the trade real moves make');

check('harder-hitting moves are less accurate, like Fire Blast and Thunder', () => {
  assert.equal(S.maxAccuracyFor(90), 100);       // Thunderbolt
  assert.equal(S.maxAccuracyFor(100), 100);      // Earthquake — the hardest that never misses
  assert.equal(S.maxAccuracyFor(110), 90);       // real Fire Blast is 85, Thunder 70
  assert.equal(S.maxAccuracyFor(130), 76);
  assert.ok(S.maxAccuracyFor(120) < S.maxAccuracyFor(100));
});

check('no real damaging move beats the rule by much — the rule describes reality', () => {
  const real = Object.values(window.PL_MOVES).filter(m => m.power >= 20 && m.power <= 130 && m.acc);
  const over = real.filter(m => m.acc > S.maxAccuracyFor(m.power) + 25);
  assert.ok(over.length / real.length < 0.05, `${over.length}/${real.length} real moves far exceed it`);
});

check('the extended move list is well-formed and doesn\'t shadow the base list', () => {
  const extra = Object.values(window.PL_MOVES).filter(m => m.extra);
  assert.ok(extra.length > 300, 'extended list should add a few hundred moves, got ' + extra.length);
  for (const m of extra) {
    assert.ok(TYPES.includes(m.type), m.name + ' type');
    assert.ok(['physical', 'special', 'status'].includes(m.class), m.name + ' class');
    assert.ok(Number.isFinite(m.power) && m.pp > 0, m.name);
    assert.ok(E.isSimulated(m), m.name + ' must be playable');
    assert.ok(m.class === 'status' || m.power > 0 || m.cat === 'ohko', m.name + ' does something');
  }
  for (const k of ['surf', 'dragon-claw', 'close-combat', 'flare-blitz', 'stone-edge', 'play-rough', 'moonblast', 'brave-bird'])
    assert.ok(window.PL_MOVES[k], k + ' should be available');
  assert.equal(window.PL_MOVES.thunderbolt.extra, undefined, 'a base move was not replaced');
});

check('PP shrinks as power grows', () => {
  assert.equal(S.ppFor(40), 30); assert.equal(S.ppFor(90), 15); assert.equal(S.ppFor(100), 10); assert.equal(S.ppFor(130), 5);
});

check('whatever the form sends, a custom move comes out legal', () => {
  const m = S.normalizeCustomMove({ label: '  Mega   Zap  ', type: 'nonsense', cls: 'special', power: 9999, acc: 500 }, TYPES);
  assert.equal(m.label, 'Mega Zap');
  assert.equal(m.type, 'normal');
  assert.equal(m.power, S.CUSTOM_POWER_MAX);
  assert.equal(m.acc, S.maxAccuracyFor(S.CUSTOM_POWER_MAX));
  assert.equal(m.pp, 5);
});

check('a Pokémon needs a name, a type, a move, and legal stats', () => {
  const ok = mk('ryland', 'Okay', ['fire'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  assert.deepEqual(S.monProblems(ok, TYPES), []);
  assert.ok(S.monProblems({ ...ok, name: ' ' }, TYPES).length);
  assert.ok(S.monProblems({ ...ok, types: [] }, TYPES).length);
  assert.ok(S.monProblems({ ...ok, types: ['fire', 'fire'] }, TYPES).length);
  assert.ok(S.monProblems({ ...ok, moves: [] }, TYPES).length);
  assert.ok(S.monProblems({ ...ok, moves: Array(5).fill({ real: 'tackle' }) }, TYPES).length);
  assert.ok(S.monProblems({ ...ok, level: 101 }, TYPES).length);
});

/* ==================================================================== */
section('saving — one small record each, identical on every device');

check('a Pokémon survives a save and a load exactly', () => {
  const m = mk('reid', 'Blazewing', ['fire', 'flying'], stats(78, 84, 78, 109, 85, 100),
    ['flamethrower', 'air-slash', { label: 'Sun Slash', type: 'fire', cls: 'special', power: 95, acc: 100, pp: 15 }],
    { nature: 'timid', ability: 'blaze', item: 'leftovers', legendary: false, img: 'abc123' });
  store.saveMon(m);
  const back = store.listTeam('reid', TYPES).find(x => x.id === m.id);
  assert.deepEqual(back, m);
});

check('the stored record is small enough to ride the sync (well under the URL budget)', () => {
  const m = mk('reid', 'Twenty Letters Longgg', ['fire', 'flying'], stats(78, 84, 78, 109, 85, 100),
    [{ label: 'A Very Long Move Name', type: 'fire', cls: 'special', power: 95, acc: 100, pp: 15 },
     { label: 'Another Long Move Nme', type: 'water', cls: 'physical', power: 80, acc: 100, pp: 20 },
     { label: 'Third Long Move Name!', type: 'ice', cls: 'special', power: 60, acc: 100, pp: 25 },
     { label: 'Fourth Long Move Name', type: 'dark', cls: 'physical', power: 40, acc: 100, pp: 30 }],
    { nature: 'timid', ability: 'blaze', item: 'leftovers', legendary: true, img: 'abcdef123456' });
  const text = store.toRecord(m);
  assert.ok(text.length < 600, `worst-case record is ${text.length} chars`);
});

check('the same Pokémon id always maps to the same dex number, clear of the real dex', () => {
  assert.equal(store.dexIdFor('abc'), store.dexIdFor('abc'));
  assert.notEqual(store.dexIdFor('abc'), store.dexIdFor('abd'));
  for (const id of ['a', 'zzzz', 'm1', Date.now().toString(36)]) assert.ok(store.dexIdFor(id) >= 100000);
});

check('garbage from the sync never becomes a Pokémon', () => {
  assert.equal(store.fromRecord('ryland', 'x', 'not json', TYPES), null);
  assert.equal(store.fromRecord('ryland', 'x', '{"v":2}', TYPES), null);
  assert.equal(store.fromRecord('ryland', 'x', JSON.stringify({ v: 1, n: 'X', t: ['bogus'], s: [1, 1, 1, 1, 1, 1], m: ['tackle'] }), TYPES), null);
  const wild = store.fromRecord('ryland', 'x', JSON.stringify({ v: 1, n: 'X'.repeat(99), t: ['fire'], l: 9999, s: [999, -5, 'a', 1, 1, 1], m: ['tackle'] }), TYPES);
  assert.equal(wild.name.length, 20); assert.equal(wild.level, 100); assert.equal(wild.stats.hp, 255); assert.equal(wild.stats.atk, 1);
});

check('delete removes it, and the page can tell something changed', () => {
  const m = mk('ryland', 'Gone', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const before = store.signature();
  store.saveMon(m);
  const during = store.signature();
  assert.notEqual(before, during);
  store.deleteMon(m);
  assert.ok(!store.listTeam('ryland', TYPES).some(x => x.id === m.id));
});

check('a team name is optional, defaults to "<Kid>\'s team", and is capped', () => {
  const ry = store.SIDES[0];
  store.setTeamName('ryland', '');
  assert.equal(store.teamLabel(ry), 'Ryland’s team');
  assert.equal(store.setTeamName('ryland', '  Thunder   Pups  '), 'Thunder Pups');
  assert.equal(store.teamLabel(ry), 'Thunder Pups');
  assert.equal(store.setTeamName('ryland', 'x'.repeat(60)).length, store.TEAM_NAME_MAX);
  assert.ok(store.signature().includes(':'), 'a rename must change what the page watches');
  const before = store.signature();
  store.setTeamName('ryland', 'Different');
  assert.notEqual(store.signature(), before);
  store.setTeamName('ryland', '');
  assert.equal(store.teamLabel(ry), 'Ryland’s team', 'clearing it restores the default');
});

check('only genuine image data is accepted as a picture', () => {
  assert.ok(store.isImageData('data:image/png;base64,iVBORw0KGgo='));
  assert.ok(store.isImageData('data:image/jpeg;base64,/9j/4AAQ'));
  assert.ok(!store.isImageData('data:image/svg+xml;base64,PHN2Zz4='), 'svg can carry script');
  assert.ok(!store.isImageData('javascript:alert(1)'));
  assert.ok(!store.isImageData('data:text/html;base64,PGI+'));
  assert.ok(!store.isImageData('data:image/png;base64,' + 'A'.repeat(40000)), 'oversized');
});

/* ==================================================================== */
section('the referee — real Pokémon behaviour on invented creatures');

const duel = (a, b, opts) => {
  const m = B.createMatch([{ side: { id: 'ryland', name: 'Ryland', color: '#00f' }, mons: Array.isArray(a) ? a : [a] },
                           { side: { id: 'reid', name: 'Reid', color: '#0a0' }, mons: Array.isArray(b) ? b : [b] }], opts);
  B.startMatch(m);
  return m;
};
const mv = (key) => ({ type: 'move', move: key });
const dmgOf = (events, who) => events.filter(e => e.t === 'damage' && e.who === who).reduce((n, e) => n + e.dmg, 0);

check('the faster Pokémon moves first', () => {
  const fast = mk('ryland', 'Zippy', ['normal'], stats(70, 70, 70, 70, 70, 130), ['tackle']);
  const slow = mk('reid', 'Plodder', ['normal'], stats(70, 70, 70, 70, 70, 20), ['tackle']);
  const m = duel(fast, slow);
  const ev = B.playTurn(m, [mv('tackle'), mv('tackle')]);
  assert.equal(ev.find(e => e.t === 'move').who, 'Zippy');
});

check('Quick Attack lets a slow Pokémon strike first', () => {
  const fast = mk('ryland', 'Zippy', ['normal'], stats(70, 70, 70, 70, 70, 130), ['tackle']);
  const slow = mk('reid', 'Plodder', ['normal'], stats(70, 70, 70, 70, 70, 20), ['quick-attack']);
  const m = duel(fast, slow);
  assert.equal(B.playTurn(m, [mv('tackle'), mv('quick-attack')]).find(e => e.t === 'move').who, 'Plodder');
});

check('type matchups matter: water beats fire, and it is 2x super effective', () => {
  const water = mk('ryland', 'Splash', ['water'], stats(80, 80, 80, 80, 80, 80), ['water-gun']);
  const fire = mk('reid', 'Ember', ['fire'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const grass = mk('reid', 'Leaf', ['grass'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const vsFire = B.playTurn(duel(water, fire), [mv('water-gun'), mv('tackle')]);
  const vsGrass = B.playTurn(duel(water, grass), [mv('water-gun'), mv('tackle')]);
  assert.equal(vsFire.find(e => e.t === 'damage' && e.who === 'Ember').typeMult, 2);
  assert.equal(vsGrass.find(e => e.t === 'damage' && e.who === 'Leaf').typeMult, 0.5);
  assert.ok(dmgOf(vsFire, 'Ember') > dmgOf(vsGrass, 'Leaf') * 3, 'super effective hits far harder than resisted');
});

check('same-type attack bonus applies to an invented creature', () => {
  const sparky = mk('ryland', 'Sparky', ['electric'], stats(80, 80, 80, 80, 80, 80), ['thunder-shock']);
  const dummy = mk('reid', 'Dummy', ['normal'], stats(200, 80, 80, 80, 80, 20), ['tackle']);
  const ev = B.playTurn(duel(sparky, dummy), [mv('thunder-shock'), mv('tackle')]);
  assert.equal(ev.find(e => e.t === 'damage' && e.who === 'Dummy').stab, true);
});

check('an electric move cannot touch a ground type', () => {
  const sparky = mk('ryland', 'Sparky', ['electric'], stats(80, 80, 80, 80, 80, 80), ['thunder-shock']);
  const rock = mk('reid', 'Pebble', ['ground'], stats(80, 80, 80, 80, 80, 20), ['tackle']);
  const ev = B.playTurn(duel(sparky, rock), [mv('thunder-shock'), mv('tackle')]);
  assert.ok(ev.some(e => e.t === 'noEffect' && e.who === 'Pebble'));
  assert.equal(dmgOf(ev, 'Pebble'), 0);
});

check('a stronger attacker does more damage, and a sturdier defender takes less', () => {
  const weak = mk('ryland', 'Weak', ['normal'], stats(80, 40, 80, 40, 80, 80), ['tackle']);
  const strong = mk('ryland', 'Strong', ['normal'], stats(80, 140, 80, 40, 80, 80), ['tackle']);
  const soft = mk('reid', 'Soft', ['normal'], stats(80, 80, 40, 80, 40, 20), ['tackle']);
  const hard = mk('reid', 'Hard', ['normal'], stats(80, 80, 140, 80, 140, 20), ['tackle']);
  const d = (a, b) => dmgOf(B.playTurn(duel(a, b), [mv('tackle'), mv('tackle')]), b.name);
  assert.ok(d(strong, soft) > d(weak, soft));
  assert.ok(d(strong, soft) > d(strong, hard));
});

check('an invented move hits as hard as its power says it should', () => {
  const user = (power) => mk('ryland', 'Maker', ['normal'], stats(80, 100, 80, 80, 80, 80),
    [{ label: 'Custom', type: 'normal', cls: 'physical', power, acc: 100, pp: 10 }]);
  const target = () => mk('reid', 'Target', ['normal'], stats(250, 80, 80, 80, 80, 20), ['tackle']);
  const hit = (p) => { const m = duel(user(p), target()); const k = m.sides[0].active.moves[0].name;
    return dmgOf(B.playTurn(m, [mv(k), mv('tackle')]), 'Target'); };
  assert.ok(hit(100) > hit(40) * 2, 'power 100 should do well over twice the damage of power 40');
  const m = duel(user(80), target());
  assert.equal(B.options(m, 0).moves[0].invented, true);
});

check('a move that can miss sometimes does', () => {
  const user = mk('ryland', 'Shaky', ['normal'], stats(80, 80, 80, 80, 80, 80),
    [{ label: 'Wild Swing', type: 'normal', cls: 'physical', power: 120, acc: 60, pp: 5 }]);
  const tgt = mk('reid', 'Tgt', ['normal'], stats(250, 80, 80, 80, 80, 20), ['tackle']);
  E.setRng(() => 0.99);                                       // every percentage roll fails
  const m = duel(user, tgt);
  const ev = B.playTurn(m, [mv(m.sides[0].active.moves[0].name), mv('tackle')]);
  assert.ok(ev.some(e => e.t === 'miss'));
  E.setRng(steady);
});

check('duplicate names are made unique so the log can be read', () => {
  const a = mk('ryland', 'Flamey', ['fire'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('reid', 'flamey', ['fire'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const m = duel(a, b);
  assert.deepEqual(m.sides.map(s => s.active.name), ['Flamey (Ryland)', 'flamey (Reid)']);
  const c = mk('ryland', 'Twin', ['fire'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const d = mk('ryland', 'Twin', ['water'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const t = duel([c, d], b);
  assert.deepEqual(t.sides[0].team.map(x => x.name), ['Twin', 'Twin 2']);
  assert.equal(new Set(t.sides.flatMap(s => s.team.map(x => x.name.toLowerCase()))).size, 3);
});

check('the battle announces the team name but remembers who owns it', () => {
  const a = mk('ryland', 'A', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('reid', 'B', ['normal'], stats(80, 80, 80, 80, 80, 20), ['tackle']);
  const m = B.createMatch([
    { side: { id: 'ryland', name: 'Thunder Pups', owner: 'Ryland', color: '#00f' }, mons: [a] },
    { side: { id: 'reid', name: 'Reid', color: '#0a0' }, mons: [b] }]);
  B.startMatch(m);
  assert.deepEqual(m.sides.map(s => s.name), ['Thunder Pups', 'Reid']);
  assert.deepEqual(m.sides.map(s => s.owner), ['Ryland', 'Reid']);
  assert.ok(B.narrate(m.history[0].events[0], m).includes('Thunder Pups'));
});

check('a level setting puts every Pokémon on the same footing', () => {
  const big = mk('ryland', 'Big', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle'], { level: 100 });
  const m = duel(big, mk('reid', 'Lil', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle'], { level: 10 }), { levelMode: 50 });
  assert.deepEqual(m.sides.map(s => s.active.level), [50, 50]);
  assert.equal(m.sides[0].active.maxHp, m.sides[1].active.maxHp);
  const own = duel(big, mk('reid', 'Lil', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle'], { level: 10 }));
  assert.deepEqual(own.sides.map(s => s.active.level), [100, 10]);
});

check('a duel runs to a knockout and calls the right winner', () => {
  const a = mk('ryland', 'Heavy', ['fighting'], stats(100, 140, 80, 40, 80, 60), ['karate-chop', 'tackle']);
  const b = mk('reid', 'Light', ['normal'], stats(60, 60, 60, 60, 60, 60), ['tackle']);
  const m = duel(a, b);
  let guard = 0;
  while (m.phase === 'choose' && guard++ < 100) B.playTurn(m, [mv('karate-chop'), mv('tackle')]);
  assert.equal(m.phase, 'over');
  assert.equal(m.winner, 0);
  assert.ok(m.sides[1].active.fainted && !m.sides[0].active.fainted);
  assert.equal(B.summary(m).winner.name, 'Ryland');
});

check('a team battle: a knockout asks for a replacement without costing a turn', () => {
  const lead = mk('ryland', 'Lead', ['normal'], stats(40, 40, 40, 40, 40, 20), ['tackle']);
  const back = mk('ryland', 'Back', ['normal'], stats(90, 90, 90, 90, 90, 90), ['tackle']);
  const foe = mk('reid', 'Foe', ['normal'], stats(90, 130, 90, 90, 90, 130), ['tackle']);
  const m = duel([lead, back], foe);
  m.sides[0].active.hp = 1;
  const turnBefore = m.turn;
  B.playTurn(m, [mv('tackle'), mv('tackle')]);
  assert.equal(m.phase, 'replace');
  assert.equal(m.sides[0].needSwitch, true);
  assert.equal(m.sides[1].needSwitch, false);
  assert.throws(() => B.playTurn(m, [mv('tackle'), mv('tackle')]), /not time/);
  B.replace(m, { 0: 1 });
  assert.equal(m.phase, 'choose');
  assert.equal(m.sides[0].active.name, 'Back');
  assert.equal(m.turn, turnBefore + 1, 'the replacement did not use up a turn');
});

check('you cannot replace with a fainted Pokémon, or with the one already out', () => {
  const a = mk('ryland', 'A', ['normal'], stats(40, 40, 40, 40, 40, 20), ['tackle']);
  const b = mk('ryland', 'B', ['normal'], stats(90, 90, 90, 90, 90, 90), ['tackle']);
  const c = mk('ryland', 'C', ['normal'], stats(90, 90, 90, 90, 90, 90), ['tackle']);
  const foe = mk('reid', 'Foe', ['normal'], stats(90, 130, 90, 90, 90, 130), ['tackle']);
  const m = duel([a, b, c], foe);
  m.sides[0].team[1].hp = 0; m.sides[0].team[1].fainted = true;
  m.sides[0].active.hp = 1;
  B.playTurn(m, [mv('tackle'), mv('tackle')]);
  assert.equal(m.phase, 'replace');
  assert.throws(() => B.replace(m, { 0: 1 }), /still fight/);
  assert.throws(() => B.replace(m, { 0: 0 }), /still fight/);
  B.replace(m, { 0: 2 });
  assert.equal(m.sides[0].active.name, 'C');
});

check('switching costs the turn, and the foe hits whoever came in', () => {
  const a = mk('ryland', 'Out', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('ryland', 'In', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const foe = mk('reid', 'Foe', ['normal'], stats(80, 100, 80, 80, 80, 120), ['tackle']);
  const m = duel([a, b], foe);
  const ev = B.playTurn(m, [{ type: 'switch', to: 1 }, mv('tackle')]);
  assert.ok(ev.some(e => e.t === 'sendOut' && e.name === 'In' && e.from === 'Out'));
  assert.ok(!ev.some(e => e.t === 'move' && e.who === 'Out'), 'the Pokémon that switched out did not attack');
  assert.ok(!ev.some(e => e.t === 'move' && e.who === 'In'), 'switching used the whole turn');
  assert.ok(ev.some(e => e.t === 'damage' && e.who === 'In'), 'the foe hit the one who came in');
  assert.equal(m.sides[0].team[0].hp, m.sides[0].team[0].maxHp, 'the one who left took nothing');
});

check('a battle only ends when a whole team has fainted', () => {
  const a1 = mk('ryland', 'A1', ['normal'], stats(1, 1, 1, 1, 1, 1), ['tackle']);
  const a2 = mk('ryland', 'A2', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const foe = mk('reid', 'Foe', ['normal'], stats(90, 130, 90, 90, 90, 130), ['tackle']);
  const m = duel([a1, a2], foe);
  B.playTurn(m, [mv('tackle'), mv('tackle')]);
  assert.notEqual(m.phase, 'over', 'one down, one to go');
  assert.equal(m.winner, null);
});

check('a double knockout from poison at the end of the turn is a draw', () => {
  const a = mk('ryland', 'Alpha', ['normal'], stats(80, 80, 80, 80, 80, 90), ['tackle']);
  const b = mk('reid', 'Beta', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const m = duel(a, b);
  for (const s of m.sides) { s.active.hp = 1; s.active.status = 'poison'; }
  B.playTurn(m, [mv('tackle'), mv('tackle')]);
  assert.equal(m.phase, 'over');
  assert.equal(m.winner, 'draw');
  assert.equal(B.summary(m).draw, true);
});

check('with no PP left a Pokémon Struggles instead of being stuck', () => {
  const a = mk('ryland', 'Tired', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('reid', 'Fresh', ['normal'], stats(80, 80, 80, 80, 80, 20), ['tackle']);
  const m = duel(a, b);
  m.sides[0].active.moves.forEach(x => { x.pp = 0; });
  const o = B.options(m, 0);
  assert.equal(o.moves.length, 1);
  assert.equal(o.moves[0].key, party.STRUGGLE.name);
  const ev = B.playTurn(m, [mv(o.moves[0].key), mv('tackle')]);
  assert.ok(ev.some(e => e.t === 'damage'), 'Struggle actually does something');
});

check('two Ghosts with no PP left cannot stalemate — Struggle ignores type and wears them down', () => {
  const a = mk('ryland', 'Boo', ['ghost'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('reid', 'Wisp', ['ghost'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const m = duel(a, b);
  for (const s of m.sides) s.active.moves.forEach(x => { x.pp = 0; });
  let guard = 0;
  while (m.phase === 'choose' && guard++ < 200) {
    B.playTurn(m, [B.randomChoice(m, 0), B.randomChoice(m, 1)]);
  }
  assert.equal(m.phase, 'over', 'it must end');
  assert.ok(guard < 100, `took ${guard} turns`);
});

check('a Choice item locks the holder into the first move it picks, until it switches out', () => {
  const a = mk('ryland', 'Banded', ['normal'], stats(80, 100, 80, 80, 80, 80), ['tackle', 'quick-attack', 'scratch'], { item: 'choice-band' });
  const b = mk('ryland', 'Bench', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const foe = mk('reid', 'Foe', ['normal'], stats(250, 80, 80, 80, 80, 20), ['tackle']);
  const m = duel([a, b], foe);
  assert.equal(B.options(m, 0).moves.filter(x => !x.disabled).length, 3, 'free before it has picked');
  B.playTurn(m, [mv('tackle'), mv('tackle')]);
  const o = B.options(m, 0);
  assert.deepEqual(o.moves.filter(x => !x.disabled).map(x => x.key), ['tackle']);
  assert.throws(() => B.playTurn(m, [mv('scratch'), mv('tackle')]), /can't use/);
  B.playTurn(m, [{ type: 'switch', to: 1 }, mv('tackle')]);
  B.playTurn(m, [{ type: 'switch', to: 0 }, mv('tackle')]);
  assert.equal(B.options(m, 0).moves.filter(x => !x.disabled).length, 3, 'free again after switching out');
});

check('Hyper Beam costs the next turn: the user must recharge', () => {
  const a = mk('ryland', 'Beamer', ['normal'], stats(250, 100, 80, 100, 80, 120), ['hyper-beam', 'tackle']);
  const b = mk('reid', 'Tank', ['normal'], stats(250, 80, 200, 80, 200, 20), ['tackle']);
  const m = duel(a, b);
  const t1 = B.playTurn(m, [mv('hyper-beam'), mv('tackle')]);
  assert.ok(t1.some(e => e.t === 'damage' && e.by === 'Beamer'), 'it hit');
  const o = B.options(m, 0);
  assert.equal(o.moves.length, 1);
  assert.equal(o.moves[0].forced, true);
  assert.equal(o.bench.length, 0);
  const t2 = B.playTurn(m, [mv('__recharge'), mv('tackle')]);
  assert.ok(t2.some(e => e.t === 'recharge' && e.who === 'Beamer'));
  assert.ok(!t2.some(e => e.t === 'move' && e.who === 'Beamer'), 'it did not attack while recharging');
  assert.equal(B.options(m, 0).moves.length, 2, 'free again after recharging');
});

check('a Hyper Beam that misses needs no recharge', () => {
  const a = mk('ryland', 'Beamer', ['normal'], stats(250, 100, 80, 100, 80, 120), ['hyper-beam', 'tackle']);
  const b = mk('reid', 'Tank', ['normal'], stats(250, 80, 200, 80, 200, 20), ['tackle']);
  E.setRng(() => 0.99);
  const m = duel(a, b);
  B.playTurn(m, [mv('hyper-beam'), mv('tackle')]);
  E.setRng(steady);
  assert.equal(B.options(m, 0).moves.length, 2);
});

check('Solar Beam takes a turn to charge, then goes off at full strength', () => {
  const a = mk('ryland', 'Sunny', ['grass'], stats(250, 80, 80, 130, 80, 120), ['solar-beam', 'tackle']);
  const b = mk('reid', 'Tank', ['normal'], stats(250, 80, 80, 80, 80, 20), ['tackle']);
  const m = duel(a, b);
  const t1 = B.playTurn(m, [mv('solar-beam'), mv('tackle')]);
  assert.ok(t1.some(e => e.t === 'charge' && e.who === 'Sunny'));
  assert.equal(t1.filter(e => e.t === 'damage' && e.who === 'Tank').length, 0, 'no damage on the charge turn');
  assert.equal(m.sides[0].active.moves.find(x => x.name === 'solar-beam').pp, 10, 'PP is not spent on the charge turn');
  const o = B.options(m, 0);
  assert.deepEqual(o.moves.map(x => x.key), ['solar-beam']);
  assert.equal(o.moves[0].forced, true);
  const t2 = B.playTurn(m, [mv('solar-beam'), mv('tackle')]);
  assert.ok(t2.some(e => e.t === 'damage' && e.who === 'Tank'));
  assert.equal(m.sides[0].active.moves.find(x => x.name === 'solar-beam').pp, 9);
});

check('in harsh sunlight Solar Beam skips its charge turn', () => {
  const a = mk('ryland', 'Sunny', ['grass'], stats(250, 80, 80, 130, 80, 120), ['solar-beam']);
  const b = mk('reid', 'Tank', ['normal'], stats(250, 80, 80, 80, 80, 20), ['tackle']);
  const m = duel(a, b);
  m.battle.weather = 'sun'; m.battle.weatherTurns = 5;
  const t1 = B.playTurn(m, [mv('solar-beam'), mv('tackle')]);
  assert.ok(!t1.some(e => e.t === 'charge'));
  assert.ok(t1.some(e => e.t === 'damage' && e.who === 'Tank'));
});

check('switching out cancels a charge in progress', () => {
  const a = mk('ryland', 'Sunny', ['grass'], stats(250, 80, 80, 130, 80, 120), ['solar-beam']);
  const c = mk('ryland', 'Other', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('reid', 'Tank', ['normal'], stats(250, 80, 80, 80, 80, 20), ['tackle']);
  const m = duel([a, c], b);
  B.playTurn(m, [mv('solar-beam'), mv('tackle')]);
  assert.equal(B.options(m, 0).bench.length, 0, 'locked into finishing it');
  assert.equal(m.sides[0].active.volatile.charging, 'solar-beam');
});

check('Explosion in a battle: the user faints and the turn is still resolved cleanly', () => {
  const a = mk('ryland', 'Boomer', ['normal'], stats(80, 100, 80, 80, 80, 120), ['explosion']);
  const b = mk('reid', 'Foe', ['normal'], stats(150, 80, 80, 80, 80, 20), ['tackle']);
  const m = duel(a, b);
  B.playTurn(m, [mv('explosion'), mv('tackle')]);
  assert.equal(m.sides[0].active.fainted, true);
  assert.equal(m.phase, 'over');
  assert.equal(m.winner, 1);
});

check('PP really is used up', () => {
  const a = mk('ryland', 'A', ['normal'], stats(250, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('reid', 'B', ['normal'], stats(250, 80, 80, 80, 80, 20), ['tackle']);
  const m = duel(a, b);
  const before = m.sides[0].active.moves[0].pp;
  B.playTurn(m, [mv('tackle'), mv('tackle')]);
  assert.equal(m.sides[0].active.moves[0].pp, before - 1);
});

check('a lead\'s Intimidate lowers the foe\'s Attack the moment it comes out', () => {
  const a = mk('ryland', 'Growler', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle'], { ability: 'intimidate' });
  const b = mk('reid', 'Target', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const m = duel(a, b);
  assert.equal(m.sides[1].active.stages.atk, -1);
  assert.equal(m.sides[0].active.stages.atk, 0);
});

check('an invented Pokémon with no ability, nature or item battles without trouble', () => {
  const a = mk('ryland', 'Plain', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle'], { ability: 'none', item: 'none', nature: 'serious' });
  const b = mk('reid', 'Plain2', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  assert.doesNotThrow(() => B.playTurn(duel(a, b), [mv('tackle'), mv('tackle')]));
});

check('a bad choice is refused rather than guessed at', () => {
  const a = mk('ryland', 'A', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('reid', 'B', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const m = duel(a, b);
  assert.throws(() => B.playTurn(m, [mv('thunderbolt'), mv('tackle')]), /can't use/);
  assert.throws(() => B.playTurn(m, [{ type: 'switch', to: 0 }, mv('tackle')]), /can't switch/);
  assert.throws(() => B.playTurn(m, [null, mv('tackle')]), /no choice/);
});

check('a kid\'s name can never inject markup into the battle log', () => {
  const a = mk('ryland', '<img src=x onerror=alert(1)>', ['normal'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const b = mk('reid', 'B', ['normal'], stats(80, 80, 80, 80, 80, 20), ['tackle']);
  const m = duel(a, b);
  const lines = [...m.history[0].events, ...B.playTurn(m, [mv('tackle'), mv('tackle')])]
    .map(e => B.narrate(e, m)).filter(Boolean).join(' ');
  assert.ok(!/<img/i.test(lines), 'markup must be escaped');
  assert.ok(lines.includes('&lt;img'));
});

check('hints show effectiveness only when asked', () => {
  const water = mk('ryland', 'Splash', ['water'], stats(80, 80, 80, 80, 80, 80), ['water-gun']);
  const fire = mk('reid', 'Ember', ['fire'], stats(80, 80, 80, 80, 80, 80), ['tackle']);
  const m = duel(water, fire);
  assert.equal(B.options(m, 0).moves[0].mult, undefined);
  assert.equal(B.options(m, 0, { hints: true }).moves[0].mult, 2);
});

/* ==================================================================== */
section('300 random battles — nothing crashes, every battle ends, every event reads');

check('random team battles always finish with a consistent result', () => {
  let seed = 12345;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  E.setRng(rnd);
  const realMoves = Object.values(window.PL_MOVES).filter(m => m.power > 0 && !m.invented && E.isSimulated(m));
  const abilities = Object.keys(window.PL_ABILITY_FX), items = Object.keys(window.PL_ITEMS), natures = Object.keys(window.PL_NATURES);
  const pickOf = (a) => a[Math.floor(rnd() * a.length)];
  let draws = 0, lines = 0;
  for (let n = 0; n < 300; n++) {
    const team = (side) => Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => {
      const t1 = pickOf(TYPES), t2 = rnd() < 0.4 ? pickOf(TYPES.filter(x => x !== t1)) : null;
      const st = S.scaleToBudget(stats(...Array.from({ length: 6 }, () => 20 + Math.floor(rnd() * 200))), rnd() < 0.2);
      return mk(side, pickOf(['Aaa', 'Bbb', 'Aaa', 'Ccc']), t2 ? [t1, t2] : [t1], st,
        Array.from({ length: 1 + Math.floor(rnd() * 4) }, () => pickOf(realMoves).name),
        { level: 20 + Math.floor(rnd() * 80), ability: pickOf(abilities), item: pickOf(items), nature: pickOf(natures) });
    });
    const m = duel(team('ryland'), team('reid'), { levelMode: rnd() < 0.5 ? 50 : 'own' });
    let guard = 0;
    while (m.phase !== 'over' && guard++ < 400) {
      if (m.phase === 'replace') {
        const picks = {};
        for (const i of [0, 1]) if (m.sides[i].needSwitch) picks[i] = m.sides[i].team.findIndex(b => !b.fainted);
        B.replace(m, picks);
      } else {
        const ch = [0, 1].map(i => {
          const o = B.options(m, i);
          if (o.bench.length && rnd() < 0.15) return { type: 'switch', to: o.bench[Math.floor(rnd() * o.bench.length)].idx };
          return B.randomChoice(m, i, rnd);
        });
        B.playTurn(m, ch);
      }
    }
    if (m.phase !== 'over') {
      console.log('--- battle ' + n + ' stuck: turn', m.turn, 'phase', m.phase);
      for (const s of m.sides) for (const x of s.team) console.log('   ', s.name, x === s.active ? '*' : ' ', x.name, x.types.join('/'),
        'hp', x.hp + '/' + x.maxHp, 'item', x.item, 'ab', x.ability, 'st', x.status, '|', x.moves.map(q => q.name + ':' + q.pp).join(' '));
      for (const h of m.history.slice(-2)) { console.log(' ', h.title); for (const e of h.events) { const t = B.narrate(e, m); if (t) console.log('     ', t.replace(/<[^>]+>/g, '')); } }
    }
    assert.equal(m.phase, 'over', 'battle ' + n + ' did not finish');
    const [a, b] = m.sides;
    if (m.winner === 'draw') { draws++; assert.ok(a.defeated && b.defeated); }
    else { assert.ok(m.sides[1 - m.winner].defeated && !m.sides[m.winner].defeated); }
    for (const h of m.history) for (const e of h.events) { const t = B.narrate(e, m); if (t) lines++; assert.ok(t === null || typeof t === 'string'); }
    for (const s of m.sides) for (const x of s.team) assert.ok(x.hp >= 0 && x.hp <= x.maxHp);
  }
  E.setRng(steady);
  console.log(`        (${draws} draws, ${lines} narrated lines)`);
});

console.log('\n' + pass + ' Battle Lab checks passed');
