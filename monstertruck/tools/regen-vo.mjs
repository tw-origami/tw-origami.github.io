#!/usr/bin/env node
// Re-record the announcer from data/callouts.js via ElevenLabs TTS.
//
// The manifest is the only source of truth: every line the game can speak gets
// exactly one audio/vo/<vo>.mp3, so a clip can never drift from its script.
//
//   node tools/regen-vo.mjs                 # only the clips that don't exist yet
//   node tools/regen-vo.mjs --force         # re-record everything
//   node tools/regen-vo.mjs --only=title,praise_1
//   node tools/regen-vo.mjs --voice=<id> --list-voices
//
// The API key is read from ELEVENLABS_API_KEY, or from
// ~/.config/tw-origami/secrets.env — deliberately OUTSIDE this folder, which is
// copied wholesale into the public Pages repo on every deploy. Never put a key
// in this directory.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VO_DIR = join(ROOT, 'audio/vo');

// "Jessica — playful, bright": young, warm, clear on a single loud word, which
// is what a callout is. Swap with --voice=<id>.
const DEFAULT_VOICE = 'cgSgspJ2msm6clMCkdW9';
const MODEL = 'eleven_multilingual_v2';
const SETTINGS = { stability: 0.40, similarity_boost: 0.75, style: 0.45, use_speaker_boost: true };
// Low tiers cap concurrent requests hard; 2 finishes 73 lines in about a minute
// without tripping it. Raise with --jobs=N if the plan allows.
const DEFAULT_CONCURRENCY = 2;

/* ---------------- args ---------------- */

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const has = (name) => args.includes(`--${name}`);
const voiceId = flag('voice') ?? DEFAULT_VOICE;
const only = flag('only')?.split(',').map((s) => s.trim()).filter(Boolean);
const concurrency = Math.max(1, Number(flag('jobs')) || DEFAULT_CONCURRENCY);

/* ---------------- key ---------------- */

function apiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  const envFile = join(homedir(), '.config/tw-origami/secrets.env');
  if (existsSync(envFile)) {
    const m = readFileSync(envFile, 'utf8').match(/^\s*ELEVENLABS_API_KEY\s*=\s*(.+)$/m);
    const v = m?.[1].trim().replace(/^["']|["']$/g, '');
    if (v) return v;
  }
  console.error(`no API key. Put it in ${envFile} as ELEVENLABS_API_KEY=... (or export it).`);
  process.exit(1);
}

/* ---------------- the lines ---------------- */

function lines() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(ROOT, 'data/callouts.js'), 'utf8'), sandbox);
  const { CALLOUTS, VO_EXTRA } = sandbox.window;

  const out = [];
  const add = (o) => { if (o?.vo && o?.text) out.push({ vo: o.vo, text: o.text }); };
  for (const cat of ['shapes', 'colors', 'letters', 'numbers']) (CALLOUTS[cat] ?? []).forEach(add);
  (VO_EXTRA.praise ?? []).forEach(add);
  (VO_EXTRA.retry ?? []).forEach(add);
  Object.values(VO_EXTRA.intros ?? {}).forEach(add);
  Object.values(VO_EXTRA.zones ?? {}).forEach(add);
  for (const k of ['title', 'airtime', 'fivestars']) add(VO_EXTRA[k]);
  (VO_EXTRA.words ?? []).forEach(add);
  return out;
}

/* ---------------- generate ---------------- */

async function listVoices(key) {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': key } });
  const { voices } = await res.json();
  for (const v of voices) console.log(v.voice_id, ' ', v.name);
}

async function speak(key, text, file, attempt = 1) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
    }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (attempt < 5 && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 1200 * attempt));
      return speak(key, text, file, attempt + 1);
    }
    throw new Error(`${res.status} ${body.slice(0, 160)}`);
  }
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

const key = apiKey();
if (has('list-voices')) { await listVoices(key); process.exit(0); }

mkdirSync(VO_DIR, { recursive: true });
let todo = lines();
if (only) todo = todo.filter((l) => only.includes(l.vo));
if (!has('force') && !only) todo = todo.filter((l) => !existsSync(join(VO_DIR, `${l.vo}.mp3`)));

if (!todo.length) { console.log('nothing to record — every clip already exists (use --force).'); process.exit(0); }
console.log(`recording ${todo.length} line(s) with voice ${voiceId}…`);

let done = 0;
const failed = [];
const queue = [...todo];
await Promise.all(Array.from({ length: concurrency }, async () => {
  for (let job = queue.shift(); job; job = queue.shift()) {
    try {
      await speak(key, job.text, join(VO_DIR, `${job.vo}.mp3`));
      console.log(`  ${String(++done).padStart(3)}/${todo.length}  ${job.vo}  "${job.text}"`);
    } catch (e) {
      failed.push(job.vo);
      console.error(`  FAILED ${job.vo}: ${e.message}`);
    }
  }
}));

console.log(failed.length ? `done with ${failed.length} failure(s): ${failed.join(', ')}` : `done — ${done} clip(s) written`);
process.exit(failed.length ? 1 : 0);
