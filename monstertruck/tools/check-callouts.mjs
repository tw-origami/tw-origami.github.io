#!/usr/bin/env node
// Validate data/callouts.js and report voice-clip coverage.
//
// Hard errors (exit 1): malformed data the game would trip over.
// Warnings (exit 0): missing or orphaned mp3s — the speechSynthesis fallback
// keeps the game shippable without clips, and spare files hurt nothing.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(join(ROOT, 'data/callouts.js'), 'utf8'), sandbox);
const { CALLOUTS, VO_EXTRA } = sandbox.window;

const errors = [];
const warnings = [];
const allVo = new Map();   // vo id -> where it came from

function claimVo(vo, where) {
  if (!vo) { errors.push(`${where}: missing vo id`); return; }
  if (allVo.has(vo)) errors.push(`duplicate vo id "${vo}" (${where} and ${allVo.get(vo)})`);
  allVo.set(vo, where);
}

/* ---- categories ---- */
const CATS = ['shapes', 'colors', 'letters', 'numbers'];
for (const cat of CATS) {
  const list = CALLOUTS?.[cat];
  if (!Array.isArray(list) || !list.length) { errors.push(`CALLOUTS.${cat} missing or empty`); continue; }
  const ids = new Set();
  for (const it of list) {
    const where = `${cat}/${it.id}`;
    if (!it.id) errors.push(`${cat}: item without id`);
    if (ids.has(it.id)) errors.push(`${cat}: duplicate id "${it.id}"`);
    ids.add(it.id);
    if (!it.text) errors.push(`${where}: missing text`);
    claimVo(it.vo, where);
    if (cat === 'colors' && !/^#[0-9a-f]{6}$/i.test(it.hex ?? '')) errors.push(`${where}: bad hex "${it.hex}"`);
    if ((cat === 'letters' || cat === 'numbers') && !it.glyph) errors.push(`${where}: missing glyph`);
    for (const c of it.confusable ?? []) {
      if (!list.some((o) => o.id === c)) errors.push(`${where}: confusable "${c}" is not a ${cat} id`);
      else if (!(list.find((o) => o.id === c).confusable ?? []).includes(it.id)) {
        warnings.push(`${where}: confusable "${c}" is not symmetric`);
      }
    }
  }
}
if (CALLOUTS?.letters?.length !== 26) errors.push(`expected 26 letters, got ${CALLOUTS?.letters?.length}`);
const values = (CALLOUTS?.numbers ?? []).map((n) => n.value).join(',');
if (values !== '1,2,3,4,5,6,7,8,9,10') errors.push(`numbers.value should be 1..10, got ${values}`);

/* ---- extras ---- */
for (const p of VO_EXTRA?.praise ?? []) claimVo(p.vo, 'praise');
for (const r of VO_EXTRA?.retry ?? []) claimVo(r.vo, 'retry');
for (const [k, v] of Object.entries(VO_EXTRA?.intros ?? {})) claimVo(v.vo, `intro ${k}`);
for (const [k, v] of Object.entries(VO_EXTRA?.zones ?? {})) claimVo(v.vo, `zone ${k}`);
for (const key of ['title', 'airtime', 'fivestars']) claimVo(VO_EXTRA?.[key]?.vo, key);
for (const w of VO_EXTRA?.words ?? []) claimVo(w.vo, `word ${w.id}`);
if (!(VO_EXTRA?.praise?.length >= 3)) errors.push('need at least 3 praise lines');
if (!(VO_EXTRA?.retry?.length >= 2)) errors.push('need at least 2 retry lines');
for (const mode of ['shapes', 'colors', 'letters', 'numbers', 'mix']) {
  if (!VO_EXTRA?.intros?.[mode]) errors.push(`missing intro for mode "${mode}"`);
}

/* ---- clip coverage ---- */
const voDir = join(ROOT, 'audio/vo');
const onDisk = existsSync(voDir)
  ? readdirSync(voDir).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4))
  : [];
const missing = [...allVo.keys()].filter((vo) => !onDisk.includes(vo));
const orphans = onDisk.filter((f) => !allVo.has(f));
if (missing.length) warnings.push(`${missing.length} vo clip(s) missing (fallback speech will cover): ${missing.join(', ')}`);
if (orphans.length) warnings.push(`${orphans.length} orphan mp3(s) in audio/vo: ${orphans.join(', ')}`);

/* ---- report ---- */
for (const w of warnings) console.log('warn:', w);
for (const e of errors) console.error('ERROR:', e);
console.log(`callouts: ${allVo.size} voice lines, ${onDisk.length} clips on disk, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
