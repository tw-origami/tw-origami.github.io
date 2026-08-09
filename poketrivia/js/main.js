// Boot, render loop, and the top-level mode router:
//   TITLE → PROFILE → OVERWORLD ⇄ CATCH | BATTLE | DIALOG
//
// The N64 look in one line: render into a low framebuffer at pixelRatio 1 and
// let CSS blow it up. That single choice is most of the aesthetic and most of
// the iPad performance budget.

import * as THREE from 'three';
import { buildWorld, heightAt, signPosts } from './world.js';
import { createPlayer } from './player.js';
import { createRoamers } from './npc.js';
import { createTrainers } from './trainer-npc.js';
import { initInput, takeAction, input } from './input.js';
import { ZONES, ZONE_BY_ID, zoneAt, SIGN_SPOTS, HUB, BUILDINGS } from './zones.js';
import * as ui from './ui.js';
import * as save from './save.js';
import * as party from './party.js';
import * as audio from './audio.js';
import { runCatch } from './encounter-catch.js';
import { runBattle } from './encounter-battle.js';
import { openTeam, teamOpen } from './team.js';
import { quizOpen, primeQuestion, registerSigns, pickQuestion, pickMissedQuestion,
  nextSubject, ask } from './quiz.js';

// Internal scanlines. N64 output was ~240p, but the concept art we're chasing is
// clean, so we render finer and let the flat shading carry the retro read.
const RENDER_HEIGHT = 432;
const MIN_W = 480, MAX_W = 1100;
const DEBUG = new URLSearchParams(location.search).has('debug');

const canvas = document.getElementById('view');
// Antialiasing ON, despite the retro look. The chunky read comes from the low
// internal resolution and the flat shading, not from jagged edges — whereas
// without MSAA, thin geometry (timber beams, branches) lands on sub-pixel
// slivers that different GPUs rasterise differently, drawing stray dark lines
// across the scene on some machines and not others.
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(1);
renderer.setClearColor(0xd3e8f7);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.5, 900);

const world = buildWorld(scene);
const player = createPlayer(scene, 0, 24);
const roamers = createRoamers(scene);
const trainers = createTrainers(scene, window.TRAINERS ?? []);

initInput(canvas);
ui.initCompass(ZONES.filter(z => z.id !== 'hub'));

let profile = null;
let busy = false;              // an encounter or dialog owns the screen
let encounterCooldown = 0;     // seconds before another wild Pokémon can trigger

/* ---------------- sizing ---------------- */

function resize() {
  const w = Math.max(1, innerWidth), h = Math.max(1, innerHeight);
  const aspect = w / h;
  let rw = Math.round(RENDER_HEIGHT * aspect / 2) * 2;
  rw = Math.min(MAX_W, Math.max(MIN_W, rw));
  const rh = Math.round(rw / aspect / 2) * 2;
  renderer.setSize(rw, rh, false);        // `false` = leave the CSS size alone
  camera.aspect = aspect;
  camera.updateProjectionMatrix();
}
addEventListener('resize', resize);
addEventListener('orientationchange', () => setTimeout(resize, 120));
// A ResizeObserver catches layout changes that never fire a window resize —
// iPad Safari's collapsing toolbar, and any container that resizes after load.
if (window.ResizeObserver) new ResizeObserver(resize).observe(document.getElementById('stage'));
resize();

// Tab (or tapping your ball tray) opens the team screen from the overworld.
addEventListener('keydown', (e) => {
  if (e.code !== 'Tab' || !profile) return;
  e.preventDefault();
  if (teamOpen() || busy || ui.dialogOpen() || quizOpen()) return;
  player.frozen = true;
  openTeam(profile, () => { player.frozen = false; ui.setParty(profile.party); });
});
document.getElementById('balls').addEventListener('pointerdown', (e) => {
  e.preventDefault();
  if (!profile || teamOpen() || busy || ui.dialogOpen() || quizOpen()) return;
  player.frozen = true;
  openTeam(profile, () => { player.frozen = false; ui.setParty(profile.party); });
});

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  running = false;
  ui.oops('The island lost its picture. Tap reload to jump back in.');
});
document.getElementById('oopsBtn').onclick = () => location.reload();

/* ---------------- signs ---------------- */

// Each signpost's fact AND its question live together in data/signs.js, so
// regenerating the question bank can never break the "you'll see this again" link.
registerSigns();
const SIGN_BY_ID = Object.fromEntries((window.SIGNS ?? []).map(s => [s.id, s]));

// Whatever the A button would act on right now. Nothing in the overworld
// triggers on its own — you walked next to it, you did not agree to fight it.
let focus = null;

function checkInteractables() {
  let best = null, bestD = Infinity;
  const consider = (kind, d, range, data, label) => {
    if (d > range || d >= bestD) return;
    bestD = d; best = { kind, data, label };
  };

  for (const s of signPosts) {
    consider('sign', Math.hypot(player.pos.x - s.x, player.pos.z - s.z), 4.4, s, 'Read sign');
  }
  for (const b of BUILDINGS) {
    if (!b.label) continue;
    const d = Math.hypot(player.pos.x - b.x, player.pos.z - (b.z + b.d / 2 + 2));
    consider('building', d, 4.5, b, b.label === 'Study Tent' ? 'Rest & study' : 'Look inside');
  }
  if (profile) {
    for (const t of trainers.list) {
      if (t.beaten || (t.def.requires ?? 0) > profile.badges.length) continue;
      const d = Math.hypot(player.pos.x - t.mesh.position.x, player.pos.z - t.mesh.position.z);
      consider('trainer', d, t.def.sight ?? 7, t.def, `Battle ${t.def.name}`);
    }
    const wild = roamers.nearest(player, 5);
    if (wild) {
      const d = Math.hypot(wild.group.position.x - player.pos.x, wild.group.position.z - player.pos.z);
      consider('wild', d, 5, wild, `Approach ${party.species(wild.dex).name.toUpperCase()}`);
    }
  }

  focus = best;
  const locked = busy || ui.dialogOpen() || quizOpen() || teamOpen() || encounterCooldown > 0;
  ui.setPrompt(locked ? null : best?.label ?? null);
}

/** The A button. One place, so nothing can start an encounter behind your back. */
function interact() {
  if (!focus || encounterCooldown > 0) return;
  switch (focus.kind) {
    case 'sign': readSign(focus.data); break;
    case 'building': useBuilding(focus.data); break;
    case 'trainer': startBattle(focus.data); break;
    case 'wild': startCatch(focus.data); break;
  }
}

/**
 * Signs change. The first visit to a post shows its tutorial fact (how the game
 * works); every visit after that draws a fresh fact from that zone's pool, so
 * walking past a sign you've already read teaches something new instead of
 * repeating itself. Dealt bag-style: you see all of a zone's facts before any
 * of them comes round again.
 */
function nextSignFact(post) {
  const tutorial = SIGN_BY_ID[post.id];
  if (tutorial && !profile.journal.includes(tutorial.id)) return tutorial;

  const zone = tutorial?.zone ?? post.zone ?? 'hub';
  const pool = (window.SIGN_FACTS ?? []).filter(f => f.zone === zone);
  if (!pool.length) return tutorial ?? null;

  const unread = pool.filter(f => !profile.journal.includes(f.id));
  // all read? start the cycle again, oldest first
  return unread.length ? unread[0] : pool[profile.journal.length % pool.length];
}

function readSign(post) {
  busy = true;
  player.frozen = true;
  const rec = nextSignFact(post);
  if (rec) {
    primeQuestion(profile, 'sign:' + rec.id);
    if (!profile.journal.includes(rec.id)) profile.journal.push(rec.id);
    save.saveProfile(profile);
  }
  const text = rec
    ? rec.fact + '  …You have a feeling this will come up again soon.'
    : 'The paint has worn off this sign.';
  ui.showDialog(text, 'Sign', () => { busy = false; player.frozen = false; });
}

async function useBuilding(b) {
  busy = true;
  player.frozen = true;
  if (b.label === 'Study Tent') {
    party.healParty(profile);
    ui.setParty(profile.party);
    audio.fanfare();
    const owed = save.missedIds(profile).length;
    const offer = owed
      ? `Everyone is back to full health! You have ${owed} question${owed === 1 ? '' : 's'} still to crack. Want to study a few?`
      : 'Everyone is back to full health! Want to sit and read for a bit?';
    save.saveProfile(profile);
    ui.showDialog(offer, 'Study Tent', async () => {
      const yes = await ui.confirm('Study now?', 'Yes, study', 'Not now');
      if (yes) await studySession();
      busy = false; player.frozen = false;
    });
  } else {
    ui.showDialog('The shopkeeper waves. "Balls are free on this island — the questions are the price."',
      b.label, () => { busy = false; player.frozen = false; });
  }
}

/**
 * A quiet study session. This is where the long reading-comprehension questions
 * belong — there is no battle waiting, so a passage can take as long as it takes.
 * Missed questions come first, because clearing those is the whole point.
 */
async function studySession() {
  const ROUNDS = 4;
  const clearedBefore = profile.stats.cleared ?? 0;
  let right = 0;
  for (let i = 0; i < ROUNDS; i++) {
    const q = pickMissedQuestion(profile)
      ?? pickQuestion({
        subject: nextSubject(), difficulty: 'medium', profile,
        zoneId: null, allowLong: 'always',      // passages are welcome here
      });
    const { quality } = await ask(q, profile, { difficulty: 'medium' });
    if (quality >= 1) right++;
  }

  // Every 5 missed questions finally beaten earns an evolution item of the
  // player's choice — studying is literally how Pokémon grow here.
  const earned = Math.floor((profile.stats.cleared ?? 0) / 5) - Math.floor(clearedBefore / 5);
  for (let i = 0; i < earned; i++) {
    const item = await ui.choose(
      'You cleared 5 tricky questions! Nurse Joy opens a drawer of evolution stones. Pick one:',
      Object.entries(party.EVO_ITEMS).map(([value, it]) => ({ value, label: `${it.emoji} ${it.label}` })));
    party.grantItem(profile, item);
    audio.badge();
    ui.showBanner(`Got the ${party.EVO_ITEMS[item].label}! Check your team screen.`);
  }

  save.saveProfile(profile);
  ui.showBanner(right === ROUNDS
    ? `Perfect session — ${right}/${ROUNDS}!`
    : `Studied ${ROUNDS} questions · ${right} right`);
}

/* ---------------- encounters ---------------- */

async function startCatch(roamer) {
  busy = true;
  player.frozen = true;
  const zone = ZONE_BY_ID[roamer.zone] ?? HUB;
  const outcome = await runCatch(roamer, profile, zone);
  if (outcome !== 'ran') roamers.remove(roamer);
  ui.setParty(profile.party);
  // a short breather so the prompt doesn't reappear under your finger
  encounterCooldown = 2.5;
  busy = false;
  player.frozen = false;
}

async function startBattle(def) {
  busy = true;
  player.frozen = true;
  const zone = zoneAt(player.pos.x, player.pos.z);
  const outcome = await runBattle(def, profile, zone);
  trainers.setBeaten(profile.beaten);
  if (outcome === 'lose') {
    party.healParty(profile);
    player.teleport(0, 20);
    roamers.reset();
  }
  if (profile.badges.length >= 5 && !profile.beaten.includes('island-champ')) {
    ui.showBanner('All five badges! The Champion is waiting in town.');
  }
  ui.setParty(profile.party);
  save.saveProfile(profile);
  encounterCooldown = 2.5;
  busy = false;
  player.frozen = false;
}

/* ---------------- loop ---------------- */

const clock = new THREE.Clock();
let running = false;
let frames = 0, fpsTimer = 0, fps = 0;

function frame() {
  if (!running) return;
  requestAnimationFrame(frame);
  tick(Math.min(clock.getDelta(), 0.05), clock.elapsedTime);
}

function tick(dt, t) {
  const locked = busy || quizOpen();

  if (takeAction()) {
    if (!ui.advanceDialog() && !locked) interact();
  }

  player.update(dt, camera);
  world.update(t);
  roamers.update(dt, player, camera, locked);
  trainers.update(dt, player);

  encounterCooldown = Math.max(0, encounterCooldown - dt);

  ui.setZone(zoneAt(player.pos.x, player.pos.z));
  ui.updateCompass(player.pos.x, player.pos.z, player.camYaw);
  checkInteractables();

  renderer.render(scene, camera);

  frames++; fpsTimer += dt;
  if (fpsTimer > 0.5) {
    fps = Math.round(frames / fpsTimer); frames = 0; fpsTimer = 0;
    if (DEBUG) {
      ui.setDebug(
        `fps ${fps}\n` +
        `xz  ${player.pos.x.toFixed(0)}, ${player.pos.z.toFixed(0)}\n` +
        `res ${renderer.domElement.width}x${renderer.domElement.height}\n` +
        `tri ${Math.round(world.tris)}  draws ${renderer.info.render.calls}\n` +
        `wild ${roamers.active.length}  party ${profile?.party.length ?? 0}`
      );
    }
  }
}

/* ---------------- profile picker ---------------- */

let pickBand = 'B';

function renderProfiles() {
  const list = document.getElementById('profList');
  list.innerHTML = '';
  for (const p of save.listProfiles()) {
    const row = document.createElement('button');
    row.className = 'profRow';
    row.innerHTML = `<span>${p.name}</span>
      <small>${p.badges.length} badges · ${p.party.length} on team · ${p.stats.caught} caught</small>`;
    row.onclick = () => begin(save.loadProfile(p.id));
    list.appendChild(row);
  }
}

document.getElementById('bandPick').onclick = (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  pickBand = b.dataset.band;
  for (const x of e.currentTarget.querySelectorAll('button')) x.classList.toggle('on', x === b);
};

document.getElementById('profGo').onclick = () => {
  const name = document.getElementById('profName').value.trim() || 'Trainer';
  begin(save.newProfile(name, pickBand));
};

function begin(p) {
  profile = p;
  party.ensureStarter(profile);
  save.saveProfile(profile);
  document.getElementById('profiles').classList.add('hidden');
  ui.showHud(true);
  ui.setParty(profile.party);
  if (profile.at) player.teleport(profile.at.x, profile.at.z);
  trainers.setBeaten(profile.beaten);
  ui.setBadges(profile.badges);
  if (DEBUG) ui.initDebug(ZONES, (z) => { player.teleport(z.x, z.z + 8); roamers.reset(); });
  running = true;
  clock.start();
  frame();

  setInterval(() => {
    if (!profile || busy) return;
    profile.at = { x: player.pos.x, z: player.pos.z };
    save.saveProfile(profile);
  }, 8000);
}

/* ---------------- start ---------------- */

document.getElementById('startBtn').onclick = () => {
  audio.unlock();
  document.getElementById('title').classList.add('hidden');
  renderProfiles();
  document.getElementById('profiles').classList.remove('hidden');
  const last = save.lastProfile();
  if (last) document.getElementById('profName').placeholder = 'Or make a new trainer';
};

if (DEBUG) {
  window.__game = {
    THREE, scene, camera, renderer, world, player, roamers, input,
    get profile() { return profile; },
    pause(on = true) { running = !on; if (!on) { clock.getDelta(); frame(); } },
    draw() { renderer.render(scene, camera); },
    // step the whole game one frame while paused — lets a test harness drive the
    // loop in a background tab, where requestAnimationFrame is throttled
    step(dt = 0.033, n = 1) { for (let i = 0; i < n; i++) tick(dt, clock.elapsedTime + i * dt); },
  };
}
