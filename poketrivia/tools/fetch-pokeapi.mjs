// One-time offline fetch of real move and ability data from PokéAPI.
// Run: node tools/fetch-pokeapi.mjs   →   writes data/moves.js
//
// Same pattern the Learn Zone used for dex.js: hit the API once, commit the
// result, and never touch the network at runtime. The game must work offline.
//
// What it produces:
//   window.PL_MOVES     { name: {name, label, type, power, acc, class, pp, short} }
//   window.PL_LEARNSET  { dexId: [{ m: moveName, lv: level }] }   level-up only
//   window.PL_ABILITIES { dexId: [{ name, label, short, hidden }] }

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://pokeapi.co/api/v2';
const COUNT = 151;

// Gen 3 remakes of the Gen 1 games: they cover all 151, and unlike red-blue they
// carry abilities (which did not exist until Gen 3). Fall back if a species is
// missing from that version group.
const VERSION_GROUPS = ['firered-leafgreen', 'emerald', 'red-blue', 'yellow'];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      if (res.status === 404) return null;
    } catch { /* retry */ }
    await sleep(400 * (i + 1));
  }
  throw new Error('failed: ' + url);
}

const title = (s) => s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');

/** Pull the shortest readable English text out of PokéAPI's several text fields. */
function englishText(entry) {
  const short = entry.effect_entries?.find(e => e.language.name === 'en')?.short_effect;
  if (short) return short;
  const flavour = [...(entry.flavor_text_entries ?? [])]
    .reverse()
    .find(e => e.language.name === 'en');
  return (flavour?.flavor_text ?? flavour?.text ?? '').replace(/[\n\f­]/g, ' ').trim();
}

const moves = {};
const learnset = {};
const abilities = {};
const abilityCache = new Map();
const moveCache = new Map();

async function loadMove(name, url) {
  if (moveCache.has(name)) return moveCache.get(name);
  const d = await get(url);
  if (!d) { moveCache.set(name, null); return null; }
  const m = d.meta ?? {};
  const rec = {
    name,
    label: title(name),
    type: d.type.name,
    power: d.power ?? 0,
    acc: d.accuracy ?? null,             // null = never misses
    class: d.damage_class.name,          // physical | special | status
    pp: d.pp ?? 10,
    // --- everything below is what makes a real battle engine possible ---
    prio: d.priority ?? 0,               // priority bracket, -7..+7; beats speed
    target: d.target?.name ?? 'selected-pokemon',
    cat: m.category?.name ?? 'damage',   // damage | ailment | net-good-stats | heal | unique …
    ailment: m.ailment?.name && m.ailment.name !== 'none' ? m.ailment.name : null,
    ailChance: m.ailment_chance || (d.effect_chance ?? 0),
    stats: (d.stat_changes ?? []).map(s => ({ stat: s.stat.name, stage: s.change })),
    statChance: m.stat_chance || 0,
    drain: m.drain || 0,                 // % of damage healed (or recoil if negative)
    heal: m.healing || 0,                // % of max HP restored
    flinch: m.flinch_chance || 0,
    critRate: m.crit_rate || 0,
    hits: m.min_hits ? [m.min_hits, m.max_hits ?? m.min_hits] : null,
    turns: m.min_turns ? [m.min_turns, m.max_turns ?? m.min_turns] : null,
    short: englishText(d).slice(0, 180),
  };
  moveCache.set(name, rec);
  moves[name] = rec;
  return rec;
}

async function loadAbility(name, url) {
  if (abilityCache.has(name)) return abilityCache.get(name);
  const d = await get(url);
  const rec = d ? { name, label: title(name), short: englishText(d).slice(0, 200) }
                : { name, label: title(name), short: '' };
  abilityCache.set(name, rec);
  return rec;
}

console.log(`Fetching moves + abilities for ${COUNT} Pokémon…`);

for (let id = 1; id <= COUNT; id++) {
  const p = await get(`${API}/pokemon/${id}`);
  if (!p) { console.warn('  missing pokemon', id); continue; }

  // abilities
  abilities[id] = [];
  for (const a of p.abilities) {
    const rec = await loadAbility(a.ability.name, a.ability.url);
    abilities[id].push({ ...rec, hidden: a.is_hidden });
  }

  // level-up learnset from the first version group that has one
  let picked = [];
  for (const vg of VERSION_GROUPS) {
    picked = p.moves.flatMap((m) => {
      const d = m.version_group_details.find(
        v => v.version_group.name === vg && v.move_learn_method.name === 'level-up');
      return d ? [{ name: m.move.name, url: m.move.url, lv: d.level_learned_at }] : [];
    });
    if (picked.length >= 4) break;
  }
  picked.sort((a, b) => a.lv - b.lv);

  learnset[id] = [];
  for (const m of picked) {
    const rec = await loadMove(m.name, m.url);
    if (rec) learnset[id].push({ m: m.name, lv: m.lv });
  }

  if (id % 10 === 0 || id === COUNT) {
    process.stdout.write(`  ${id}/${COUNT}  (${Object.keys(moves).length} moves, ` +
      `${abilityCache.size} abilities)\n`);
  }
  await sleep(60);   // be polite to a free public API
}

const damaging = Object.values(moves).filter(m => m.power > 0).length;
const header = `// GENERATED by tools/fetch-pokeapi.mjs — DO NOT EDIT BY HAND.
// Source: PokéAPI (https://pokeapi.co), level-up learnsets from ${VERSION_GROUPS[0]}.
// ${Object.keys(moves).length} moves (${damaging} damaging), ${abilityCache.size} abilities,
// learnsets for ${Object.keys(learnset).length} Pokémon.\n`;

mkdirSync(join(ROOT, 'data'), { recursive: true });
writeFileSync(join(ROOT, 'data/moves.js'),
  header +
  `window.PL_MOVES = ${JSON.stringify(moves)};\n` +
  `window.PL_LEARNSET = ${JSON.stringify(learnset)};\n` +
  `window.PL_ABILITIES = ${JSON.stringify(abilities)};\n`);

console.log(`\nWrote data/moves.js — ${Object.keys(moves).length} moves, ` +
  `${abilityCache.size} abilities, ${Object.keys(learnset).length} learnsets.`);
