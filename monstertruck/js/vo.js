// The announcer. Every line prefers its recorded clip in audio/vo/<id>.mp3 and
// falls back to the browser's speech synthesis when the clip is missing or
// fails — so the game is fully playable before any clip exists, and the clips
// can be swapped for home recordings later without touching code.
//
// Priorities keep the announcer from talking over the lesson:
//   3 = learning lines (callout / praise / retry / intro) — always win
//   2 = fun lines (big air, five stars) — skipped if a learning line is up
// A new line at >= the current priority replaces it; a lower one is dropped.

import * as audio from './audio.js';

const clips = new Map();      // vo id -> HTMLAudioElement (iOS caps live elements; reuse them)
const missing = new Set();    // ids that 404'd — logged once, then straight to fallback
let current = null;           // { pri, settle() }

/* ---------------- speech synthesis fallback ---------------- */

const synth = window.speechSynthesis;
let voice = null;
function loadVoices() {
  if (!synth) return;
  const vs = synth.getVoices() || [];
  voice = vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
}
if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }

// iOS Safari wedges the synth if an utterance is alive when the tab hides.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && synth) { try { synth.cancel(); } catch { /* ignore */ } }
});

/* ---------------- playback ---------------- */

function stopCurrent() {
  if (current) { current.settle(); current = null; }
  if (synth) { try { synth.cancel(); } catch { /* ignore */ } }
}

function clipFor(id) {
  let a = clips.get(id);
  if (!a) {
    a = new Audio('audio/vo/' + id + '.mp3');
    a.preload = 'auto';
    clips.set(id, a);
  }
  return a;
}

/** Warm the cache for lines we're about to need (don't fetch all ~70 at once). */
export function preload(entries) {
  for (const e of entries) {
    if (e && e.vo && !missing.has(e.vo)) clipFor(e.vo);
  }
}

export const speaking = () => current !== null;
export const speakingPriority = () => current?.pri ?? 0;

/**
 * Say a line. Resolves when the line finishes (or immediately when muted or
 * outranked) so callers can sequence: await praise, then the next callout.
 * Never rejects, and a watchdog settles it even if no media event ever fires.
 */
export function speak(entry, pri = 3) {
  if (!entry || !entry.vo) return Promise.resolve();
  if (audio.isMuted()) return Promise.resolve();          // chip + jumbotron still show the target
  if (current && current.pri > pri) return Promise.resolve();
  stopCurrent();

  return new Promise((resolve) => {
    let done = false;
    let watchdog = 0;
    let el = null;
    const me = {
      pri,
      settle() {
        if (done) return;
        done = true;
        clearTimeout(watchdog);
        if (el) { try { el.pause(); el.currentTime = 0; } catch { /* ignore */ } }
        if (current === me) current = null;
        audio.setDuck(false);
        resolve();
      },
    };

    const fallback = () => {
      if (done || !synth) { me.settle(); return; }
      try {
        const u = new SpeechSynthesisUtterance(entry.text);
        u.lang = 'en-US';
        if (voice) u.voice = voice;
        u.rate = 0.92; u.pitch = 1.05;                    // slow and bright for little ears
        u.onend = () => me.settle();
        u.onerror = () => me.settle();
        synth.speak(u);
      } catch { me.settle(); }
    };

    // One transient fetch hiccup must not demote a real clip to robo-speech
    // forever, so a failed attempt gets one retry with a fresh element before
    // the id is marked missing.
    const startClip = (attempt) => {
      if (done) return;
      let a = clips.get(entry.vo);
      if (!a || attempt > 0 || a.error) {
        a = new Audio('audio/vo/' + entry.vo + '.mp3');
        clips.set(entry.vo, a);
      }
      el = a;
      const failed = () => {
        if (done) return;
        if (attempt === 0) { setTimeout(() => startClip(1), 200); return; }
        if (!missing.has(entry.vo)) {
          missing.add(entry.vo);
          console.info('[vo] no clip for "' + entry.vo + '" — using speech synthesis');
        }
        fallback();
      };
      a.onended = () => me.settle();
      a.onerror = failed;
      try { a.currentTime = 0; } catch { /* not seekable yet */ }
      a.play().catch(failed);
    };

    current = me;
    audio.setDuck(true);
    watchdog = setTimeout(() => me.settle(), 6000);       // sequencing must never hang

    if (missing.has(entry.vo)) { fallback(); return; }
    startClip(0);
  });
}

export function stopAll() { stopCurrent(); }
