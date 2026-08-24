#!/usr/bin/env node
// Record Spell It audio from data.js via ElevenLabs TTS.
//
// Every word in data.js gets exactly three clips in audio/:
//   <slug>.mp3     the word itself            ("Because.")
//   <slug>_s.mp3   the example sentence       (word.s)
//   <slug>_d.mp3   part of speech + definition ("conjunction. For the reason that.")
//
//   node tools/regen-audio.mjs                # only clips that don't exist yet
//   node tools/regen-audio.mjs --force        # re-record everything
//   node tools/regen-audio.mjs --only=answer,because   # just these words (all 3 clips)
//   node tools/regen-audio.mjs --list-voices
//
// The voice is "Spell It Bee (clone of original)" — an instant clone rebuilt
// from the app's own July recordings, so new clips match the old ones.
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
const AUDIO_DIR = join(ROOT, 'audio');

// "Spell It Bee (clone of original)"
const DEFAULT_VOICE = 'rOZrkClnWyeO048gtBN2';
const MODEL = 'eleven_multilingual_v2';
const SETTINGS = { stability: 0.5, similarity_boost: 0.9, style: 0.2, use_speaker_boost: true };
const DEFAULT_CONCURRENCY = 2;

/* ---------------- args ---------------- */

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const has = (name) => args.includes(`--${name}`);
const voiceId = flag('voice') ?? DEFAULT_VOICE;
const only = flag('only')?.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
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

/* ---------------- manifest from data.js ---------------- */

// Same slug rule as index.html, so clips can never drift from the app.
const slugify = (w) => w.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();

function clips() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(ROOT, 'data.js'), 'utf8'), sandbox);
  const out = [];
  for (const level of sandbox.window.SPELL.LEVELS) {
    for (const w of level.words) {
      const slug = slugify(w.w);
      const cap = w.w.charAt(0).toUpperCase() + w.w.slice(1);
      out.push({ word: slug, file: slug, text: `${cap}.` });
      out.push({ word: slug, file: slug + '_s', text: w.s });
      out.push({ word: slug, file: slug + '_d', text: `${w.pos}. ${w.def}` });
    }
  }
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

mkdirSync(AUDIO_DIR, { recursive: true });
let todo = clips();
if (only) todo = todo.filter((c) => only.includes(c.word));
if (!has('force') && !only) todo = todo.filter((c) => !existsSync(join(AUDIO_DIR, `${c.file}.mp3`)));

if (!todo.length) { console.log('nothing to record — every clip already exists (use --force).'); process.exit(0); }
console.log(`recording ${todo.length} clip(s) with voice ${voiceId}…`);

let done = 0;
const failed = [];
const queue = [...todo];
await Promise.all(Array.from({ length: concurrency }, async () => {
  for (let job = queue.shift(); job; job = queue.shift()) {
    try {
      await speak(key, job.text, join(AUDIO_DIR, `${job.file}.mp3`));
      console.log(`  ${String(++done).padStart(3)}/${todo.length}  ${job.file}  "${job.text.slice(0, 60)}"`);
    } catch (e) {
      failed.push(job.file);
      console.error(`  FAILED ${job.file}: ${e.message}`);
    }
  }
}));

console.log(failed.length ? `done with ${failed.length} failure(s): ${failed.join(', ')}` : `done — ${done} clip(s) written`);
process.exit(failed.length ? 1 : 0);
