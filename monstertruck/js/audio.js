// Chiptune SFX plus two continuous beds: the engine and a crowd murmur.
// Same stance as the other games: every effect is synthesized, no audio files —
// the only files in audio/ are the announcer's voice clips (see vo.js).
// The AudioContext is created on the first tap, because browsers require that.

let ctx = null;
let muted = false;
let bed = null;        // gain node for engine + crowd, ducked while the announcer talks
let engine = null;     // { osc, sub, gain, filter }
let crowd = null;      // { gain } looped murmur
let cheerT = 0;

try { muted = localStorage.getItem('monstertruck.mute') === '1'; } catch { /* ignore */ }

export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext ?? window.webkitAudioContext;
  if (!AC) return;
  try { ctx = new AC(); } catch { ctx = null; return; }

  // Continuous sounds route through one duckable gain so the announcer's voice
  // always sits on top of the mix.
  bed = ctx.createGain();
  bed.gain.value = muted ? 0 : 1;
  bed.connect(ctx.destination);
  startEngine();
  startCrowd();
}

export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem('monstertruck.mute', muted ? '1' : '0'); } catch { /* ignore */ }
  if (bed && ctx) bed.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.05);
  return muted;
}
export const isMuted = () => muted;

/** Pull the beds down while a voice clip plays, back up after. */
export function setDuck(on) {
  if (!bed || !ctx || muted) return;
  bed.gain.setTargetAtTime(on ? 0.22 : 1, ctx.currentTime, 0.08);
}

/* ---------------- continuous: engine ---------------- */

function startEngine() {
  const osc = ctx.createOscillator();   // the rasp
  const sub = ctx.createOscillator();   // the rumble underneath
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = 'sawtooth';
  sub.type = 'square';
  osc.frequency.value = 46;
  sub.frequency.value = 23;
  filter.type = 'lowpass';
  filter.frequency.value = 340;
  gain.gain.value = 0;
  osc.connect(filter); sub.connect(filter);
  filter.connect(gain).connect(bed);
  osc.start(); sub.start();
  engine = { osc, sub, gain, filter };
}

/** speedNorm 0..1, rev = extra throttle growl (gas held / airborne). */
export function setEngine(speedNorm, rev = 0) {
  if (!engine || !ctx) return;
  const f = 44 + speedNorm * 86 + rev * 26;
  const t = ctx.currentTime;
  engine.osc.frequency.setTargetAtTime(f, t, 0.06);
  engine.sub.frequency.setTargetAtTime(f / 2, t, 0.06);
  engine.gain.gain.setTargetAtTime(0.028 + speedNorm * 0.05 + rev * 0.02, t, 0.08);
}

/* ---------------- continuous: crowd ---------------- */

function startCrowd() {
  const len = Math.floor(ctx.sampleRate * 2);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  // brown-ish noise reads as a distant crowd; white reads as static
  let last = 0;
  for (let i = 0; i < len; i++) {
    last = (last + (Math.random() * 2 - 1) * 0.02) * 0.98;
    d[i] = last * 3.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.6;
  const gain = ctx.createGain();
  gain.gain.value = 0.014;
  src.connect(bp).connect(gain).connect(bed);
  src.start();
  crowd = { gain };
}

/** Swell the crowd for a moment (correct answers, big air). intensity ~1..2. */
export function cheer(intensity = 1) {
  if (!crowd || !ctx || muted) return;
  const t = ctx.currentTime;
  cheerT = intensity;
  crowd.gain.gain.cancelScheduledValues(t);
  crowd.gain.gain.setTargetAtTime(0.05 * intensity, t, 0.06);
  crowd.gain.gain.setTargetAtTime(0.014, t + 1.1 * intensity, 0.5);
  // a few rising "woo" sweeps on top
  for (let i = 0; i < 2 + intensity; i++) {
    sweep(300 + Math.random() * 160, 700 + Math.random() * 300, i * 0.09, 0.5, 'sine', 0.016);
  }
}

/** Is the crowd currently roaring? world.js bobs the stands off this. */
export function cheerLevel() {
  if (cheerT > 0) cheerT = Math.max(0, cheerT - 0.016);
  return cheerT;
}

/* ---------------- one-shot primitives ---------------- */

function note(freq, start, dur, type = 'square', gain = 0.12) {
  if (!ctx || muted) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function sweep(f0, f1, start, dur, type = 'square', gain = 0.1) {
  if (!ctx || muted) return;
  const t0 = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f0, t0);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
  osc.connect(g).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(start, dur, gain = 0.08) {
  if (!ctx || muted) return;
  const t0 = ctx.currentTime + start;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = gain;
  src.buffer = buf;
  src.connect(g).connect(ctx.destination);
  src.start(t0);
}

const N = { c4: 261.6, d4: 293.7, e4: 329.6, f4: 349.2, g4: 392, a4: 440, b4: 493.9,
  c5: 523.3, d5: 587.3, e5: 659.3, f5: 698.5, g5: 784, a5: 880, c6: 1046.5 };

/* ---------------- named effects ---------------- */

export const uiTap    = () => note(N.a5, 0, 0.05, 'square', 0.06);
export const honk     = () => { note(N.a4, 0, 0.16, 'square', 0.14); note(N.e4, 0, 0.16, 'square', 0.1); };
export const boing    = () => sweep(140, 320, 0, 0.18, 'sine', 0.12);          // soft wall bounce
export const bonk     = () => { note(N.e4, 0, 0.1, 'sine', 0.1); note(N.c4, 0.09, 0.16, 'sine', 0.09); }; // wrong gate, gentle
export const whoosh   = () => { noise(0, 0.25, 0.05); sweep(160, 640, 0, 0.3, 'sine', 0.04); };  // gates rising
export const thud     = () => { noise(0, 0.1, 0.1); sweep(120, 50, 0, 0.14, 'square', 0.1); };   // landing
export const starPop  = () => { note(N.g5, 0, 0.08); note(N.c6, 0.07, 0.16); };
export const fanfare  = () => {
  const seq = [[N.c5, 0], [N.e5, 0.1], [N.g5, 0.2], [N.c6, 0.3], [N.g5, 0.46], [N.c6, 0.56]];
  for (const [f, t] of seq) note(f, t, t > 0.4 ? 0.34 : 0.12);
  note(N.c4, 0, 0.5, 'triangle', 0.08);
};
export const firePop  = (delay = 0) => { noise(delay, 0.2, 0.12); sweep(700 + Math.random() * 400, 120, delay, 0.35, 'square', 0.05); };
export const crunch   = () => {         // pancaking a parked car
  noise(0, 0.3, 0.16);
  sweep(260, 45, 0, 0.32, 'sawtooth', 0.12);
  note(1180, 0.02, 0.07, 'square', 0.05);
};
export const pop      = () => sweep(280, 720, 0, 0.13, 'sine', 0.11);   // beach ball boop
export const bigFanfare = () => {
  const seq = [[N.c5, 0], [N.c5, 0.12], [N.c5, 0.24], [N.e5, 0.36], [N.g5, 0.52], [N.c6, 0.68]];
  for (const [f, t] of seq) note(f, t, 0.3);
  note(N.c4, 0, 1.0, 'triangle', 0.09);
  noise(0.68, 0.4, 0.05);
};
