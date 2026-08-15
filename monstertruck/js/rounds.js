// The learning loop: pick a target, raise gates, celebrate or gently retry.
//
// Design rules, all deliberate:
//   - The target stays until it's found (mastery), and help escalates — pulse
//     at 3 wrong gates, distractors sink at 5 — so the kid ALWAYS wins.
//   - Wrong gates never block or punish: a wobble, a soft bonk, a kind word.
//   - Look-alike distractors (b/d, 6/9, blue/purple) are held back until the
//     target itself has been mastered twice; then they become the stretch goal.
//   - Letters and numbers open with a small window (first six) that widens as
//     mastery grows, so round one is A-F, not a random dip into 26 letters.

import * as THREE from 'three';
import { GATE, zoneAt } from './world.js';
import * as vo from './vo.js';
import * as audio from './audio.js';
import * as save from './save.js';
import * as hud from './hud.js';
import { pick, shuffle } from './util.js';

const CATS = ['shapes', 'colors', 'letters', 'numbers'];
const CHEERS = ['GREAT JOB!', 'YOU FOUND IT!', 'WOW!', 'MONSTER!'];

let world = null, gatesApi = null, truck = null, particles = null;
let mode = null;
let phase = 'idle';        // idle | free | announce | seeking | celebrate
let timer = 0;
let cooldown = 4;
let target = null;
let entries = [];
let wrongCount = 0;
let replayT = 0;
let sank = false;
let roundToken = 0;        // async VO sequences check this so a stale round can't speak
let sessionStars = 0;
let bags = {};             // category -> ids not yet dealt this cycle
let mixNext = [];

const _v = new THREE.Vector3();
const wait = (s) => new Promise((r) => setTimeout(r, s * 1000));

export function init(deps) {
  ({ world, gates: gatesApi, truck, particles } = deps);
  // tag every item with its kind once — glyphs.js draws off it
  for (const cat of CATS) {
    for (const it of window.CALLOUTS[cat]) it.kind = cat.slice(0, -1);
  }
}

export function start(m) {
  mode = m;
  phase = 'free';
  timer = 2.4;             // the mode-intro VO is playing; first callout right after
  sessionStars = 0;
  roundToken++;
  const s = save.load();
  hud.setStars(s.stars[m] ?? 0);
  hud.setTarget(null);
  world.jumbotron.idle(s.stars[m] ?? 0);
  vo.preload([...window.VO_EXTRA.praise, ...window.VO_EXTRA.retry]);
}

export function stop() {
  phase = 'idle';
  mode = null;
  roundToken++;
  gatesApi.sinkAll();
  vo.stopAll();
  hud.setTarget(null);
}

export const activeTarget = () => (phase === 'seeking' ? target : null);

export function replayCallout() {
  if (phase === 'seeking' && target) {
    vo.speak(target, 3);
    replayT = 12;
  }
}

/* ---------------- selection ---------------- */

function masteredCount(cat) {
  const m = save.load().mastery;
  return window.CALLOUTS[cat].filter((it) => (m[it.vo] ?? 0) >= 1).length;
}

/** Letters/numbers grow from a starter six as mastery builds; shapes/colors are all in from round one. */
function windowed(cat) {
  const list = window.CALLOUTS[cat];
  if (cat === 'shapes' || cat === 'colors') return list;
  return list.slice(0, Math.min(list.length, 6 + Math.floor(masteredCount(cat) / 3)));
}

/** Bag-style dealing: see everything in the window before anything repeats. */
function drawTarget(cat) {
  const pool = windowed(cat);
  let bag = (bags[cat] ?? []).filter((id) => pool.some((it) => it.id === id));
  if (!bag.length) bag = shuffle(pool.map((it) => it.id));
  const id = bag.pop();
  bags[cat] = bag;
  return pool.find((it) => it.id === id);
}

function drawDistractors(cat, tgt) {
  const mastered = (save.load().mastery[tgt.vo] ?? 0) >= 2;
  const excluded = new Set(tgt.confusable ?? []);
  let pool = windowed(cat).filter((it) => it.id !== tgt.id);
  if (!mastered) {
    pool = pool.filter((it) => !excluded.has(it.id) && !(it.confusable ?? []).includes(tgt.id));
    if (cat === 'numbers') pool = pool.filter((it) => Math.abs(it.value - tgt.value) >= 2);
  }
  // tiny windows (early numbers after filtering) can run short — refill from the full category
  if (pool.length < 2) {
    const extra = window.CALLOUTS[cat].filter(
      (it) => it.id !== tgt.id && !excluded.has(it.id) && !pool.includes(it)
    );
    pool = pool.concat(shuffle(extra));
  }
  return shuffle(pool).slice(0, 2);
}

function beginRound() {
  const cat = mode === 'mix' ? nextMixCat() : mode;
  target = drawTarget(cat);
  const distractors = drawDistractors(cat, target);
  entries = shuffle([{ item: target, correct: true }, ...distractors.map((d) => ({ item: d, correct: false }))]);
  wrongCount = 0;
  sank = false;
  roundToken++;
  phase = 'announce';
  hud.setTarget(target);
  world.jumbotron.setTarget(target);
  vo.preload([target]);
}

function nextMixCat() {
  if (!mixNext.length) mixNext = shuffle(CATS);
  return mixNext.pop();
}

/* ---------------- outcomes ---------------- */

function onCorrect(index) {
  phase = 'celebrate';
  timer = 0;
  sank = false;

  const s = save.load();
  s.stars[mode] = (s.stars[mode] ?? 0) + 1;
  if (wrongCount === 0) s.mastery[target.vo] = (s.mastery[target.vo] ?? 0) + 1;
  save.flush();
  sessionStars++;

  gatesApi.positionOf(index, _v);
  particles.burst('confetti', _v, 42, 1.2);
  particles.burst('dust', _v, 8);
  audio.fanfare();
  audio.starPop();
  audio.cheer(1.5);
  world.cheer(1.8);
  world.jumbotron.celebrate();
  hud.setStars(s.stars[mode], true);
  hud.popup(pick(CHEERS));
  hud.setTarget(null);

  const big = sessionStars % 5 === 0;
  cooldown = big ? 6.5 : 4;
  const token = roundToken;
  (async () => {
    await vo.speak(pick(window.VO_EXTRA.praise), 3);
    if (token !== roundToken || !big) return;
    // every fifth star: fireworks over the stands
    audio.bigFanfare();
    audio.cheer(2);
    world.cheer(3);
    vo.speak(window.VO_EXTRA.fivestars, 2);
    for (let i = 0; i < 6; i++) {
      const p = _v.set((Math.random() - 0.5) * 60, 15 + Math.random() * 6, (Math.random() - 0.5) * 44);
      particles.later(i * 0.4, 'spark', p, 55, 1.6);
      audio.firePop(i * 0.4);
    }
  })();
}

function onWrong(index) {
  wrongCount++;
  replayT = 12;
  gatesApi.wobble(index);
  audio.bonk();

  if (wrongCount === 3) gatesApi.pulseCorrect();
  if (wrongCount >= 5) gatesApi.soloCorrect();

  const token = roundToken;
  (async () => {
    await vo.speak(pick(window.VO_EXTRA.retry), 3);
    if (token !== roundToken || phase !== 'seeking') return;
    await wait(0.35);
    if (token !== roundToken || phase !== 'seeking') return;
    vo.speak(target, 3);
  })();
}

/* ---------------- per-frame ---------------- */

export function update(dt) {
  if (phase === 'idle') return;

  // The learning game lives in the stadium. Drive out an archway and the round
  // packs up without penalty; drive back in and a fresh callout follows soon.
  if (zoneAt(truck.pos) !== 'stadium') {
    if (phase === 'announce' || phase === 'seeking') {
      roundToken++;
      gatesApi.sinkAll();
      hud.setTarget(null);
      vo.stopAll();
      phase = 'away';
    } else if (phase === 'free') {
      phase = 'away';
    }
    if (phase !== 'celebrate') return;   // celebrations get to finish
  } else if (phase === 'away') {
    phase = 'free';
    timer = 2.2;
    world.jumbotron.idle(save.load().stars[mode] ?? 0);
  }

  if (phase === 'free') {
    timer -= dt;
    if (timer <= 0) beginRound();
    return;
  }

  if (phase === 'announce') {
    // never raise gates under the truck — wait for it to clear the line
    if (Math.abs(truck.pos.z - GATE.z) > 7) {
      gatesApi.show(entries);
      audio.whoosh();
      for (let i = 0; i < 3; i++) particles.burst('dust', gatesApi.positionOf(i, _v), 10);
      vo.speak(target, 3);
      replayT = 12;
      phase = 'seeking';
    }
    return;
  }

  if (phase === 'seeking') {
    replayT -= dt;
    if (replayT <= 0) replayCallout();
    const hit = gatesApi.crossing(truck.prevPos, truck.pos, truck.pos.y);
    if (hit) (hit.correct ? onCorrect : onWrong)(hit.index);
    return;
  }

  if (phase === 'celebrate') {
    timer += dt;
    if (timer > 0.55 && !sank) { sank = true; gatesApi.sinkAll(); }
    if (timer > 1.6) {
      phase = 'free';
      timer = cooldown;
      world.jumbotron.idle(save.load().stars[mode] ?? 0);
    }
  }
}
