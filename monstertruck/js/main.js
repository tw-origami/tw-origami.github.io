// Boot, render loop, and the top-level flow:
//   TITLE → GARAGE → MODE SELECT → ARENA (⇄ back via 🏠)
//
// The N64 look in one line: render into a low framebuffer at pixelRatio 1 and
// let CSS blow it up. That single choice is most of the aesthetic and most of
// the iPad performance budget.

import * as THREE from 'three';
import { buildWorld } from './world.js';
import { createTruck, TOP } from './truck.js';
import { initGates } from './gates.js';
import { Particles } from './particles.js';
import * as rounds from './rounds.js';
import * as screens from './screens.js';
import * as hud from './hud.js';
import * as save from './save.js';
import * as audio from './audio.js';
import * as vo from './vo.js';
import { initInput, poll, takeAction, input } from './input.js';

const RENDER_HEIGHT = 432;
const MIN_W = 480, MAX_W = 1100;
const DEBUG = new URLSearchParams(location.search).has('debug');

const canvas = document.getElementById('view');
// Antialiasing ON, despite the retro look: the chunky read comes from the low
// internal resolution and the flat shading — whereas without MSAA, thin
// geometry (gate posts, light towers) lands on sub-pixel slivers that draw
// stray dark lines on some GPUs and not others.
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(1);
renderer.setClearColor(0x2a1a4a);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.5, 900);
camera.position.set(0, 12, 46);
camera.lookAt(0, 2, 0);

const world = buildWorld(scene);
const truckColor = screens.TRUCKS.find((t) => t.id === save.load().truck) ?? screens.TRUCKS[0];
const truck = createTruck(scene, truckColor.hex);
const gates = initGates(scene);
const particles = new Particles(scene);
rounds.init({ world, gates, truck, particles });
initInput();

let appState = 'title';       // title | garage | modes | arena
let running = false;
let lastAirVo = -99;
let curZone = 'stadium';
let lastCrunchPop = -99;
const ZONE_LABELS = { stadium: 'THE STADIUM!', track: 'RACE TRACK!', playground: 'PLAYGROUND!', parking: 'PARKING LOT!' };
const _p = new THREE.Vector3();

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
// iPad Safari's collapsing toolbar resizes the layout without a window resize
if (window.ResizeObserver) new ResizeObserver(resize).observe(document.getElementById('stage'));
resize();

canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  running = false;
  document.getElementById('oops').classList.remove('hidden');
});
document.getElementById('oopsBtn').onclick = () => location.reload();

/* ---------------- flow ---------------- */

screens.init({
  onStart() {
    audio.unlock();
    vo.speak(window.VO_EXTRA.title, 2);
    screens.overArena();
    screens.show('garage');
    appState = 'garage';
    startLoop();
  },
  onTruck(t) {
    truck.setColor(t.hex);
    save.patch({ truck: t.id });
    const word = window.VO_EXTRA.words.find((w) => w.id === t.id);
    vo.speak(word, 3);
    audio.honk();
  },
  onGarageGo() {
    audio.uiTap();
    screens.show('modes');
    appState = 'modes';
  },
  onMode(m) {
    save.patch({ mode: m });
    screens.show('none');
    hud.show(true);
    appState = 'arena';
    truck.teleport(0, 24, Math.PI);
    truck.snapCam(camera);
    curZone = 'stadium';               // no zone popup for the spawn point
    vo.speak(window.VO_EXTRA.intros[m], 3);
    rounds.start(m);
  },
  onCruise(v) { save.patch({ autoCruise: v }); },
});

hud.init({
  onHome() {
    rounds.stop();
    hud.show(false);
    screens.show('modes');
    appState = 'modes';
  },
  onSayAgain() { rounds.replayCallout(); },
});

/* ---------------- loop ---------------- */

const clock = new THREE.Clock();
let frames = 0, fpsTimer = 0, fps = 0;
let menuAngle = 0;

function startLoop() {
  if (running) return;
  running = true;
  clock.start();
  frame();
}

function frame() {
  if (!running) return;
  requestAnimationFrame(frame);
  tick(Math.min(clock.getDelta(), 0.05), clock.elapsedTime);
}

function tick(dt, t) {
  poll();

  if (appState === 'arena') {
    const ev = truck.update(dt, input, { autoCruise: save.load().autoCruise });

    if (ev.hitWall) { audio.boing(); particles.burst('dust', truck.pos, 6); }
    if (ev.landed) {
      audio.thud();
      particles.burst('dust', truck.pos, ev.airTime > 0.5 ? 16 : 8);
      if (ev.airTime > 0.5) {
        hud.popup('AIR TIME!', ev.airTime.toFixed(1) + ' sec');
        audio.cheer(1);
        // the fun line never talks over a learning line, and not twice in 10s
        if (ev.airTime > 1.2 && t - lastAirVo > 10 && !vo.speaking()) {
          lastAirVo = t;
          vo.speak(window.VO_EXTRA.airtime, 2);
        }
      }
    }

    if (takeAction()) { rounds.replayCallout(); audio.honk(); }

    // announce the neighborhood as the kid explores
    const z = world.zoneAt(truck.pos);
    if (z !== curZone) {
      curZone = z;
      if (ZONE_LABELS[z]) {
        hud.popup(ZONE_LABELS[z]);
        vo.speak(window.VO_EXTRA.zones[z], 2);
      }
    }

    rounds.update(dt);
    truck.updateCam(camera, dt);
    audio.setEngine(Math.abs(truck.speed) / TOP, input.gas || !truck.grounded ? 0.6 : 0);
  } else {
    // menus: a slow parade lap around the stadium
    menuAngle += dt * 0.07;
    camera.position.set(Math.sin(menuAngle) * 46, 13, Math.cos(menuAngle) * 46);
    camera.lookAt(0, 2, 0);
    audio.setEngine(0, 0);
  }

  const wev = world.update(dt, t, camera, appState === 'arena' ? truck : null);
  for (const c of wev.crushes) {
    audio.crunch();
    particles.burst('dust', _p.set(c.x, 1, c.z), 14);
    particles.burst('spark', _p, 8);
    if (t - lastCrunchPop > 1.2) { lastCrunchPop = t; hud.popup('CRUNCH!'); }
  }
  for (const b of wev.ballHits) {
    audio.pop();
    particles.burst('dust', _p.set(b.x, 1, b.z), 5);
  }
  for (const o of wev.obstacleHits) {
    audio.pop();
    particles.burst('confetti', _p.set(o.x, 3, o.z), 12);
    particles.burst('dust', _p, 8);
  }
  gates.update(dt, t);
  particles.update(dt);

  renderer.render(scene, camera);

  frames++; fpsTimer += dt;
  if (fpsTimer > 0.5) {
    fps = Math.round(frames / fpsTimer); frames = 0; fpsTimer = 0;
    if (DEBUG) {
      document.getElementById('debug').textContent =
        `fps ${fps}\n` +
        `xz  ${truck.pos.x.toFixed(1)}, ${truck.pos.z.toFixed(1)}  y ${truck.pos.y.toFixed(2)}\n` +
        `spd ${truck.speed.toFixed(1)}  ${truck.grounded ? 'ground' : 'AIR ' + truck.airTime.toFixed(2)}\n` +
        `res ${renderer.domElement.width}x${renderer.domElement.height}\n` +
        `tri ${renderer.info.render.triangles}  draws ${renderer.info.render.calls}\n` +
        `state ${appState}`;
    }
  }
}

/* ---------------- debug harness ---------------- */

if (DEBUG) {
  document.getElementById('debug').classList.remove('hidden');
  window.__game = {
    THREE, scene, camera, renderer, world, truck, gates, rounds, particles, input, save,
    pause(on = true) { running = !on; if (!on) { clock.getDelta(); frame(); } },
    draw() { renderer.render(scene, camera); },
    // step the whole game one frame while paused — lets a test harness drive the
    // loop in a background tab, where requestAnimationFrame is throttled
    step(dt = 0.033, n = 1) { for (let i = 0; i < n; i++) tick(dt, clock.elapsedTime + i * dt); },
    // line the truck up 8u north of gate lane `i` (0..2), pointed straight at it
    aimAtGate(i) { truck.teleport([-9, 0, 9][i], -14 + 8, Math.PI); },
  };
}
