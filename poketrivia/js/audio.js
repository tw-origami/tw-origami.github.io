// A tiny chiptune synth. No audio files anywhere — every sound is generated,
// which keeps the whole game one folder of text and PNGs.
// The AudioContext is created on the first tap, because browsers require that.

let ctx = null;
let muted = false;

try { muted = localStorage.getItem('poketrivia.mute') === '1'; } catch { /* ignore */ }

export function unlock() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext ?? window.webkitAudioContext;
  if (!AC) return;
  try { ctx = new AC(); } catch { ctx = null; }
}

export function toggleMute() {
  muted = !muted;
  try { localStorage.setItem('poketrivia.mute', muted ? '1' : '0'); } catch { /* ignore */ }
  return muted;
}
export const isMuted = () => muted;

/** One note. `type` picks the timbre: square reads as melody, triangle as bass. */
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

export const correct   = () => { note(N.e5, 0, .09); note(N.g5, .08, .09); note(N.c6, .16, .18); };
export const wrong     = () => { note(N.e4, 0, .12, 'sawtooth', .1); note(N.c4, .12, .22, 'sawtooth', .1); };
export const shake     = () => { noise(0, .08, .05); note(N.a4, 0, .06, 'square', .07); };
export const encounter = () => { sweep(180, 720, 0, .22); note(N.c5, .22, .1); note(N.e5, .32, .1); note(N.g5, .42, .2); };
export const fanfare   = () => {
  const seq = [[N.c5, 0], [N.e5, .1], [N.g5, .2], [N.c6, .3], [N.g5, .46], [N.c6, .56]];
  for (const [f, t] of seq) note(f, t, t > .4 ? .34 : .12);
  note(N.c4, 0, .5, 'triangle', .08);
};
export const levelUp   = () => { for (let i = 0; i < 4; i++) note([N.c5, N.e5, N.g5, N.c6][i], i * .08, .22); };
export const hit       = (strong) => { noise(0, strong ? .16 : .09, strong ? .12 : .07); sweep(strong ? 320 : 220, 60, 0, strong ? .2 : .12, 'square', .09); };
export const badge     = () => {
  const seq = [[N.g4, 0], [N.c5, .12], [N.e5, .24], [N.g5, .36], [N.c6, .5]];
  for (const [f, t] of seq) note(f, t, .3);
  note(N.c4, 0, .8, 'triangle', .07);
};
export const blip      = () => note(N.a5, 0, .05, 'square', .06);
export const faint     = () => sweep(500, 90, 0, .5, 'square', .1);
