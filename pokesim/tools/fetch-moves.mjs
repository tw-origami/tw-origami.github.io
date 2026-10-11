// Extends the real move list for the Battle Lab.
// Run: node pokesim/tools/fetch-moves.mjs        (needs network; writes pokesim/moves-extra.js)
//
// PokéTrivia's moves.js holds only the moves Gen I Pokémon learn BY LEVEL-UP in FireRed/LeafGreen,
// so staples like Surf, Dragon Claw, Close Combat and Flare Blitz aren't in it. Kids inventing a
// Pokémon will reach for exactly those. This adds the rest from PokéAPI, in the same shape.
//
// It is deliberately conservative: it only adds moves the battle engine can play CORRECTLY.
// A move that the engine would play as something easier or different from the real one is left
// out, because a Battle Lab that's quietly unfair is worse than one with a shorter list.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');

// what we already have, so nothing is overridden
globalThis.window = globalThis;
new Function(readFileSync(join(root, 'poketrivia/data/moves.js'), 'utf8'))();
const have = new Set(Object.keys(window.PL_MOVES));

// categories whose effects the engine simulates faithfully
const OK_CATEGORY = new Set([
  'damage', 'damage-ailment', 'damage-lower', 'damage-raise', 'damage-heal',
  'net-good-stats', 'ailment', 'heal', 'ohko',
]);
// status conditions the engine really models; anything else would do nothing
const REAL_AILMENT = new Set(['burn', 'poison', 'toxic', 'paralysis', 'sleep', 'freeze', 'confusion']);

// Whether the engine can play a move correctly is the ENGINE's call, so ask it rather than
// keeping a second list here that could drift.
const { isSimulated } = await import('../../poketrivia/js/battle-engine.js');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try { const r = await fetch(url); if (r.ok) return await r.json(); if (r.status === 404) return null; }
    catch { /* retry */ }
    await sleep(400 * (i + 1));
  }
  throw new Error('failed: ' + url);
}
const title = (s) => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
const english = (d) => d.effect_entries?.find(e => e.language.name === 'en')?.short_effect
  ?? [...(d.flavor_text_entries ?? [])].reverse().find(e => e.language.name === 'en')?.flavor_text?.replace(/[\n\f]/g, ' ') ?? '';

const list = await get('https://pokeapi.co/api/v2/move?limit=3000');
const candidates = list.results
  .map(m => ({ name: m.name, id: Number(m.url.match(/\/(\d+)\/?$/)[1]), url: m.url }))
  .filter(m => m.id < 10000 && !have.has(m.name));
console.log(`PokéAPI has ${list.results.length} moves; ${have.size} already present; checking ${candidates.length}`);

const out = {};
const skipped = {};
const skip = (why) => { skipped[why] = (skipped[why] ?? 0) + 1; };

let i = 0;
async function worker() {
  while (i < candidates.length) {
    const c = candidates[i++];
    const d = await get(c.url);
    if (!d) { skip('missing'); continue; }
    const m = d.meta ?? {};
    const cat = (m.category?.name ?? 'damage').replace('+', '-');
    const cls = d.damage_class.name;
    if (!OK_CATEGORY.has(cat)) { skip('category ' + cat); continue; }
    if (cls !== 'status' && !d.power && cat !== 'ohko') { skip('power-less attack'); continue; }
    if ((d.generation?.name ?? '') === '') { skip('no generation'); continue; }

    let ailment = m.ailment?.name && m.ailment.name !== 'none' ? m.ailment.name : null;
    let note = '';
    if (ailment && !REAL_AILMENT.has(ailment)) {
      if (cls === 'status' && !(d.stat_changes?.length) && !m.healing) { skip('status move with unmodelled effect'); continue; }
      ailment = null;
      note = ' (The Battle Lab doesn’t simulate this extra effect.)';
    }
    if (cls === 'status' && !ailment && !(d.stat_changes?.length) && !m.healing && !m.drain) {
      skip('status move with no modelled effect'); continue;
    }
    const probe = { name: c.name, cat };
    if (!isSimulated(probe)) { skip('engine cannot play it correctly'); continue; }
    out[c.name] = {
      name: c.name, label: title(c.name), type: d.type.name, power: d.power ?? 0, acc: d.accuracy ?? null,
      class: cls, pp: d.pp ?? 10, prio: d.priority ?? 0, target: d.target?.name ?? 'selected-pokemon',
      cat, ailment, ailChance: m.ailment_chance || (d.effect_chance ?? 0),
      stats: (d.stat_changes ?? []).map(s => ({ stat: s.stat.name, stage: s.change })),
      statChance: m.stat_chance || 0, drain: m.drain || 0, heal: m.healing || 0, flinch: m.flinch_chance || 0,
      critRate: m.crit_rate || 0, hits: m.min_hits ? [m.min_hits, m.max_hits ?? m.min_hits] : null,
      turns: m.min_turns ? [m.min_turns, m.max_turns ?? m.min_turns] : null,
      short: (english(d).replace(/\$effect_chance/g, String(d.effect_chance ?? '')).slice(0, 170) + note).trim(),
      extra: true,
    };
  }
}
await Promise.all(Array.from({ length: 10 }, worker));

const names = Object.keys(out).sort();
const body = `// GENERATED by pokesim/tools/fetch-moves.mjs — DO NOT EDIT BY HAND.
// Source: PokéAPI (https://pokeapi.co). ${names.length} real moves that PokéTrivia's level-up-only
// list doesn't have, limited to ones the battle engine plays correctly.
// Merged into window.PL_MOVES without overriding anything already there.
(function () {
  var M = window.PL_MOVES || (window.PL_MOVES = {});
  var X = ${JSON.stringify(out)};
  for (var k in X) if (!M[k]) M[k] = X[k];
})();
`;
writeFileSync(join(root, 'pokesim/moves-extra.js'), body);
console.log(`wrote ${names.length} moves (${(body.length / 1024).toFixed(0)} KB)`);
console.log('skipped:', skipped);
