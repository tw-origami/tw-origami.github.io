// The three answer gates: chunky arches that rise out of the dirt, carry their
// sign (glyph panel, extruded shape, or solid color), and report line crossings.
//
// Detection is a segment test against the gate line, not a box — the truck
// can't tunnel through at top speed. The correct gate's catch width is a bit
// wider than it looks and the wrong gates a bit narrower, so a graze between
// two gates resolves in the kid's favor.

import * as THREE from 'three';
import { GATE } from './world.js';
import { makeGlyphTexture, makeShapeGeometry } from './glyphs.js';

const RISE_T = 0.7, SINK_T = 0.45, BURIED = -9.5;
const FRAME = 0x5a6b8c;

const easeOutBack = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * ((t - 1) ** 3) + c1 * ((t - 1) ** 2); };
const easeIn = (t) => t * t;

let scene = null;
let gates = [];          // [{ root, content, arrow, item, correct, state, animT, wobbleT, pulse, x }]
let beacon = null;       // bouncing marker over the middle of the gate line while seeking

const lambert = (opts) => new THREE.MeshLambertMaterial({ flatShading: true, ...opts });

function disposeContent(g) {
  g.content.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      if (o.material.map) o.material.map.dispose();
      o.material.dispose();
    }
  });
  g.content.clear();
  if (g.frameMat) { g.frameMat.dispose(); g.frameMat = null; }
}

function buildFrame(g, colorHex) {
  // posts + crossbar; color gates paint the whole frame, others stay steel.
  // Color gates self-illuminate: the lesson is the hue, and dusk lighting must
  // never turn blue into purple.
  const m = colorHex
    ? (g.frameMat = lambert({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.55 }))
    : sharedFrameMat;
  const postGeo = new THREE.BoxGeometry(0.75, 4.3, 0.75);
  for (const px of [-3.6, 3.6]) {
    const post = new THREE.Mesh(postGeo, m);
    post.position.set(px, 2.15, 0);
    g.content.add(post);
  }
  const bar = new THREE.Mesh(new THREE.BoxGeometry(7.95, 0.75, 0.75), m);
  bar.position.set(0, 4.35, 0);
  g.content.add(bar);
}

let sharedFrameMat = null;

export function initGates(sceneRef) {
  scene = sceneRef;
  sharedFrameMat = lambert({ color: FRAME, emissive: 0x1a2233 });
  gates = GATE.xs.map((x) => {
    const root = new THREE.Group();
    root.position.set(x, BURIED, GATE.z);
    root.visible = false;
    const content = new THREE.Group();
    root.add(content);

    // per-gate helper arrow, revealed by the help ladder
    const arrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 1.6, 4),
      new THREE.MeshBasicMaterial({ color: 0x3fae4c })
    );
    arrow.rotation.x = Math.PI;         // point down
    arrow.position.y = 9.2;
    arrow.visible = false;
    root.add(arrow);

    scene.add(root);
    return { root, content, arrow, item: null, correct: false, state: 'down', animT: 0, wobbleT: 0, pulse: false, x };
  });

  beacon = new THREE.Mesh(
    new THREE.ConeGeometry(1.1, 2.0, 4),
    new THREE.MeshBasicMaterial({ color: 0xffcf3f })
  );
  beacon.rotation.x = Math.PI;
  beacon.visible = false;
  scene.add(beacon);

  return api;
}

function buildContent(g) {
  const item = g.item;
  buildFrame(g, item.kind === 'color' ? item.hex : null);

  if (item.kind === 'color') {
    // the whole gate is the color; a solid banner block reads from across the arena
    const banner = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.6, 0.5), g.frameMat);
    banner.position.y = 6.5;
    g.content.add(banner);
    return;
  }

  if (item.kind === 'shape') {
    // real geometry, white for every shape gate: shape is the only cue.
    // Emissive keeps it white at dusk instead of a moody gray silhouette.
    const geo = makeShapeGeometry(item.id, 1.9, 0.55);
    const mesh = new THREE.Mesh(geo, lambert({ color: 0xffffff, emissive: 0x999999 }));
    mesh.position.y = 6.5;
    g.content.add(mesh);
    return;
  }

  // letter / number: glyph sign, same texture front and back (two planes so
  // the letter never renders mirrored when approached from behind)
  const tex = makeGlyphTexture(item, 256);
  const geo = new THREE.PlaneGeometry(3.6, 3.6);
  const front = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: tex }));
  front.position.set(0, 6.5, 0.03);
  const back = new THREE.Mesh(geo.clone(), new THREE.MeshBasicMaterial({ map: tex }));
  back.position.set(0, 6.5, -0.03);
  back.rotation.y = Math.PI;
  g.content.add(front, back);
}

const api = {
  /** Raise the three gates with `entries` = [{ item, correct }]. */
  show(entries) {
    entries.forEach((e, i) => {
      const g = gates[i];
      disposeContent(g);
      g.item = e.item;
      g.correct = e.correct;
      buildContent(g);
      g.state = 'rising';
      g.animT = -i * 0.13;              // small stagger reads as showmanship
      g.wobbleT = 0;
      g.pulse = false;
      g.arrow.visible = false;
      g.root.visible = true;
      g.root.position.y = BURIED;
      g.root.rotation.z = 0;
    });
    beacon.visible = true;
  },

  sinkAll() {
    for (const g of gates) if (g.state !== 'down') { g.state = 'sinking'; g.animT = 0; }
    beacon.visible = false;
  },

  /** Help ladder step 2: only the correct gate remains. */
  soloCorrect() {
    for (const g of gates) {
      if (!g.correct && g.state !== 'down') { g.state = 'sinking'; g.animT = 0; }
    }
  },

  /** Help ladder step 1: the correct gate pulses and gets an arrow. */
  pulseCorrect() {
    for (const g of gates) {
      if (g.correct) { g.pulse = true; g.arrow.visible = true; }
    }
  },

  wobble(i) { gates[i].wobbleT = 0.9; },

  anyUp: () => gates.some((g) => g.state === 'up' || g.state === 'rising'),

  positionOf(i, out = new THREE.Vector3()) {
    return out.set(gates[i].x, 1.5, GATE.z);
  },

  correctIndex: () => gates.findIndex((g) => g.correct),

  /** Snapshot for the debug harness and check scripts. */
  states: () => gates.map((g) => ({
    id: g.item?.id ?? null, correct: g.correct, state: g.state,
    wobble: +g.wobbleT.toFixed(2), pulse: g.pulse,
  })),

  /**
   * Did the segment prev→cur cross the gate line through one of the gates?
   * Returns { index, correct } or null. `y` = truck height at the crossing —
   * sail clean over the whole thing (y ≥ 8.5) and nothing counts.
   */
  crossing(prev, cur, y) {
    if (!this.anyUp()) return null;
    const a = prev.z - GATE.z, b = cur.z - GATE.z;
    if ((a > 0) === (b > 0) || a === b) return null;
    if (y >= 8.5) return null;
    const tx = prev.x + (cur.x - prev.x) * (a / (a - b));
    for (let i = 0; i < gates.length; i++) {
      const g = gates[i];
      if (g.state === 'down' || g.state === 'sinking') continue;
      const halfW = GATE.halfW * (g.correct ? 1.15 : 0.8);
      if (Math.abs(tx - g.x) < halfW) return { index: i, correct: g.correct };
    }
    return null;
  },

  update(dt, t) {
    for (const g of gates) {
      if (g.state === 'rising') {
        g.animT += dt;
        const k = Math.min(1, Math.max(0, g.animT) / RISE_T);
        g.root.position.y = BURIED + (0 - BURIED) * easeOutBack(k);
        if (k >= 1) { g.state = 'up'; g.root.position.y = 0; }
      } else if (g.state === 'sinking') {
        g.animT += dt;
        const k = Math.min(1, g.animT / SINK_T);
        g.root.position.y = (BURIED - 0) * easeIn(k);
        if (k >= 1) { g.state = 'down'; g.root.visible = false; g.arrow.visible = false; }
      }

      if (g.wobbleT > 0) {
        g.wobbleT = Math.max(0, g.wobbleT - dt);
        g.root.rotation.z = Math.sin(g.wobbleT * 24) * 0.11 * g.wobbleT;
      }

      const s = g.pulse ? 1 + Math.sin(t * 7) * 0.09 : 1;
      g.content.scale.set(s, s, s);
      if (g.arrow.visible) g.arrow.position.y = 9.2 + Math.sin(t * 5) * 0.5;
    }
    if (beacon.visible) {
      beacon.position.set(0, 10.5 + Math.sin(t * 4) * 0.6, GATE.z);
      beacon.rotation.y = t * 1.5;
    }
  },
};
