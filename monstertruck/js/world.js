// The whole grounds: a stadium (learning gates + ramps) with archway exits, a
// dirt race track looping around the stands, a playground of obstacles to the
// west, a parking lot full of crushable cars to the east, and a fence around
// everything. Flat-shaded Lambert at low res — that combo, not jagged edges,
// is what reads as N64.
//
// Terrain exists twice — as data (WEDGES/CARS drive heightAt, which the truck
// physics samples) and as meshes — but both are built from the same arrays in
// this file, so the picture can never drift from the physics.

import * as THREE from 'three';
import { drawGlyph } from './glyphs.js';

/* ================= layout data ================= */

export const ARENA = { hw: 45, hd: 30, r: 14 };     // stadium infield
const GAP_HALF = 8;                                  // archway openings on the ±x ends
const FENCE = { hw: 250, hd: 170, r: 120 };          // edge of the world

// One big oval circuit with the stadium parked in the middle of it. The inner
// and outer outlines share their corner centres (hw-r and hd-r match), so the
// racing surface stays a uniform 48 wide the whole way round, and the huge
// corner radius makes the ends read as sweeping curves instead of hairpins.
const TRACK = { ihw: 100, ihd: 74, ir: 66, ohw: 148, ohd: 122, or: 114 };
const TRACK_MID = { hw: 124, hd: 98, r: 90 };

// The play zones sit just outside the oval's ends, so leaving the stadium by an
// archway means crossing the infield, cutting over the track, and arriving.
export const PLAYGROUND = { x: -195, z: 0, hw: 34, hd: 25 };
export const PARKING = { x: 195, z: 0, hw: 34, hd: 25 };

// Where the answer gates live (gates.js builds the meshes; rounds.js runs the game).
export const GATE = { z: -14, xs: [-9, 0, 9], halfW: 3.6, clearR: 10 };

// Symmetric "tent" wedges: ground rises to a ridge, then falls away. Hittable
// from either side, no cliffs a kid can drive into. yaw 0 = jump driving along
// z; PI/2 = along x. Stadium ramps first, then the playground pieces.
export const WEDGES = [
  { x: 0,    z: 12,  w: 11, l: 18, h: 3.6, yaw: 0,           color: 0xe8703a },  // the big one
  { x: -27,  z: 0,   w: 8,  l: 12, h: 2.6, yaw: Math.PI / 2, color: 0x3fae4c },
  { x: 27,   z: 0,   w: 8,  l: 12, h: 2.6, yaw: Math.PI / 2, color: 0x2f6fe0 },
  { x: -18,  z: -24, w: 7,  l: 10, h: 2.2, yaw: Math.PI / 2, color: 0xf4c531 },
  // playground: a rhythm of whoops…
  { x: -211, z: -14, w: 10, l: 3.2, h: 0.55, yaw: Math.PI / 2, color: 0xd98a3a },
  { x: -204, z: -14, w: 10, l: 3.2, h: 0.55, yaw: Math.PI / 2, color: 0xc97a2f },
  { x: -197, z: -14, w: 10, l: 3.2, h: 0.55, yaw: Math.PI / 2, color: 0xd98a3a },
  { x: -190, z: -14, w: 10, l: 3.2, h: 0.55, yaw: Math.PI / 2, color: 0xc97a2f },
  { x: -183, z: -14, w: 10, l: 3.2, h: 0.55, yaw: Math.PI / 2, color: 0xd98a3a },
  // …the giant slide…
  { x: -197, z: 8,  w: 7, l: 22, h: 4.4, yaw: Math.PI / 2, color: 0x4fd8e8 },
  // …and a little seesaw plank
  { x: -175, z: 14, w: 3, l: 12, h: 1.5, yaw: 0, color: 0xc9a24a },
];

// Parked cars, all axis-aligned (length along z), pancaked on contact.
const CAR_COLORS = [0xd8dde4, 0xe8442e, 0x2f6fe0, 0x3fae4c, 0xf4c531, 0x8e4ec6];
const CARS = [];
for (let row = 0; row < 2; row++) {
  for (let i = 0; i < 6; i++) {
    CARS.push({
      x: 171 + i * 9.5, z: row ? 9 : -9, w: 2.5, l: 4.8, h: 1.05,
      color: CAR_COLORS[(i + row * 3) % CAR_COLORS.length],
      crushed: false, timer: 0,
    });
  }
}

// Solid rectangles (grandstand banks) and posts the truck bounces off.
const BOXES = [
  { x: 0, z: 39.6, hw: 37.5, hd: 6.4 },      // north stand
  { x: 0, z: -39.6, hw: 37.5, hd: 6.4 },     // south stand
  { x: 54.7, z: 17, hw: 5.4, hd: 9.6 },      // east banks flank the archway
  { x: 54.7, z: -17, hw: 5.4, hd: 9.6 },
  { x: -54.7, z: 17, hw: 5.4, hd: 9.6 },     // west banks
  { x: -54.7, z: -17, hw: 5.4, hd: 9.6 },
];
const CIRCLES = [
  { x: -38, z: -36, r: 1.2 }, { x: 38, z: -36, r: 1.2 },   // light towers
  { x: -38, z: 36, r: 1.2 }, { x: 38, z: 36, r: 1.2 },
  { x: 45, z: -GAP_HALF - 1.4, r: 1.1 }, { x: 45, z: GAP_HALF + 1.4, r: 1.1 },   // archway posts
  { x: -45, z: -GAP_HALF - 1.4, r: 1.1 }, { x: -45, z: GAP_HALF + 1.4, r: 1.1 },
  { x: -217, z: 12, r: 1.8 }, { x: -213, z: -20, r: 1.8 }, { x: -173, z: -6, r: 1.8 },  // tire stacks
];

const TREES = [];
for (let i = 0; i < 34; i++) {
  const a = (i / 34) * Math.PI * 2 + 0.17;
  const x = Math.cos(a) * 218 + Math.sin(i * 7) * 12;
  const z = Math.sin(a) * 150 + Math.cos(i * 5) * 10;
  // keep the play pads clear, and never drop a trunk on the racing surface
  if (Math.abs(x - PLAYGROUND.x) < 46 && Math.abs(z) < 34) continue;
  if (Math.abs(x - PARKING.x) < 46 && Math.abs(z) < 34) continue;
  if (roundSDF(x, z, TRACK.ohw, TRACK.ohd, TRACK.or).d < 10) continue;
  TREES.push({ x, z, s: 0.8 + ((i * 37) % 10) / 14 });
  CIRCLES.push({ x, z, r: 0.9 });
}

/**
 * Learning stops around the track's centre line, evenly spaced by distance
 * driven: { x, z, yaw } with yaw pointing along the racing line. A round on the
 * track raises its three gates ACROSS one of these — same game as the stadium,
 * played at speed. Lanes are wider apart out here because the track is.
 */
export const TRACK_LANES = [-14, 0, 14];

export function trackCheckpoints(n = 8) {
  const { hw, hd, r } = TRACK_MID;
  const ax = hw - r, az = hd - r;                 // corner centres
  // one lap, counter-clockwise from the south straight: straight, corner, …
  const legs = [
    { seg: [-ax, -hd, ax, -hd] },
    { arc: [ax, -az, -Math.PI / 2, 0] },
    { seg: [hw, -az, hw, az] },
    { arc: [ax, az, 0, Math.PI / 2] },
    { seg: [ax, hd, -ax, hd] },
    { arc: [-ax, az, Math.PI / 2, Math.PI] },
    { seg: [-hw, az, -hw, -az] },
    { arc: [-ax, -az, Math.PI, Math.PI * 1.5] },
  ];
  const lens = legs.map((l) => (l.seg
    ? Math.hypot(l.seg[2] - l.seg[0], l.seg[3] - l.seg[1])
    : Math.abs(l.arc[3] - l.arc[2]) * r));
  const total = lens.reduce((a, b) => a + b, 0);

  const out = [];
  for (let i = 0; i < n; i++) {
    let s = (i / n) * total, k = 0;
    while (s > lens[k] && k < legs.length - 1) { s -= lens[k]; k++; }
    const leg = legs[k], u = s / lens[k];
    let x, z, tx, tz;
    if (leg.seg) {
      const [x0, z0, x1, z1] = leg.seg;
      x = x0 + (x1 - x0) * u; z = z0 + (z1 - z0) * u;
      tx = x1 - x0; tz = z1 - z0;
    } else {
      const [cx, cz, a0, a1] = leg.arc;
      const a = a0 + (a1 - a0) * u;
      x = cx + Math.cos(a) * r; z = cz + Math.sin(a) * r;
      tx = -Math.sin(a); tz = Math.cos(a);
    }
    out.push({ x, z, yaw: Math.atan2(tx, tz) });
  }
  return out;
}

/* ================= physics queries ================= */

/** Ground height at a point: dirt, the side of a wedge, or a car (pancaked or not). */
export function heightAt(x, z) {
  let y = 0;
  for (const r of WEDGES) {
    const dx = x - r.x, dz = z - r.z;
    if (Math.abs(dx) > 12 || Math.abs(dz) > 12) continue;      // cheap reject
    const c = Math.cos(r.yaw), s = Math.sin(r.yaw);
    const lx = c * dx + s * dz;
    const lz = -s * dx + c * dz;
    if (Math.abs(lx) < r.w / 2 && Math.abs(lz) < r.l / 2) {
      y = Math.max(y, r.h * (1 - Math.abs(lz) / (r.l / 2)));
    }
  }
  for (const car of CARS) {
    const dx = Math.abs(x - car.x), dz = Math.abs(z - car.z);
    if (dx < car.w / 2 && dz < car.l / 2) {
      const h = car.crushed ? 0.26 : car.h;
      const edge = Math.min(car.w / 2 - dx, car.l / 2 - dz);
      y = Math.max(y, h * Math.min(1, edge / 0.55));
    }
  }
  return y;
}

// Signed distance to a rounded-rect outline; positive outside. Also hands back
// the outward normal so pushes work from either side.
function roundSDF(x, z, hw, hd, r) {
  const qx = Math.abs(x) - (hw - r), qz = Math.abs(z) - (hd - r);
  const mx = Math.max(qx, 0), mz = Math.max(qz, 0);
  const d = Math.hypot(mx, mz) + Math.min(Math.max(qx, qz), 0) - r;
  let nx, nz;
  if (mx > 0 || mz > 0) {
    const L = Math.hypot(mx, mz) || 1;
    nx = (mx / L) * Math.sign(x || 1);
    nz = (mz / L) * Math.sign(z || 1);
  } else if (qx > qz) { nx = Math.sign(x || 1); nz = 0; }
  else { nx = 0; nz = Math.sign(z || 1); }
  return { d, nx, nz };
}

/**
 * Resolve every solid against a point with margin m. Returns the corrected
 * position (plus the last push normal) or null when nothing was hit.
 */
export function collide(x, z, m = 2) {
  let px = x, pz = z, hit = false, nx = 0, nz = 0;

  // the fence contains everything
  {
    const f = roundSDF(px, pz, FENCE.hw - m, FENCE.hd - m, FENCE.r);
    if (f.d > 0) { px -= f.nx * f.d; pz -= f.nz * f.d; nx = -f.nx; nz = -f.nz; hit = true; }
  }

  // stadium wall: a thin two-sided shell with archway gaps on the ±x ends
  {
    const s = roundSDF(px, pz, ARENA.hw, ARENA.hd, ARENA.r);
    const half = 0.5 + m;
    const inGap = Math.abs(s.nx) > Math.abs(s.nz) && Math.abs(pz) < GAP_HALF;
    if (!inGap && Math.abs(s.d) < half) {
      const side = s.d >= 0 ? 1 : -1;
      px += s.nx * (side * half - s.d);
      pz += s.nz * (side * half - s.d);
      nx = s.nx * side; nz = s.nz * side; hit = true;
    }
  }

  for (const b of BOXES) {
    const dx = px - b.x, dz = pz - b.z;
    if (Math.abs(dx) < b.hw + m && Math.abs(dz) < b.hd + m) {
      const penX = b.hw + m - Math.abs(dx), penZ = b.hd + m - Math.abs(dz);
      if (penX < penZ) { px += Math.sign(dx || 1) * penX; nx = Math.sign(dx || 1); nz = 0; }
      else { pz += Math.sign(dz || 1) * penZ; nx = 0; nz = Math.sign(dz || 1); }
      hit = true;
    }
  }

  for (const c of CIRCLES) {
    const dx = px - c.x, dz = pz - c.z;
    const d = Math.hypot(dx, dz), min = c.r + m;
    if (d < min) {
      const L = d || 1;
      px = c.x + (dx / L) * min;
      pz = c.z + (dz / L) * min;
      nx = dx / L; nz = dz / L; hit = true;
    }
  }

  return hit ? { x: px, z: pz, nx, nz } : null;
}

/** Which part of the grounds a point is in. Rounds only run in the stadium. */
export function zoneAt(p) {
  if (Math.abs(p.x) < ARENA.hw + 2 && Math.abs(p.z) < ARENA.hd + 2) return 'stadium';
  if (Math.abs(p.x - PLAYGROUND.x) < PLAYGROUND.hw && Math.abs(p.z - PLAYGROUND.z) < PLAYGROUND.hd) return 'playground';
  if (Math.abs(p.x - PARKING.x) < PARKING.hw && Math.abs(p.z - PARKING.z) < PARKING.hd) return 'parking';
  const onTrack = roundSDF(p.x, p.z, TRACK.ohw, TRACK.ohd, TRACK.or).d < 0
    && roundSDF(p.x, p.z, TRACK.ihw, TRACK.ihd, TRACK.ir).d > 0;
  return onTrack ? 'track' : 'grounds';
}

/* ================= canvas textures ================= */

function makeTex(size, fn) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  fn(c.getContext('2d'), size);
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const noiseTex = (base, vars, streaks) => makeTex(64, (g, s) => {
  g.fillStyle = base; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 380; i++) {
    g.fillStyle = vars[Math.floor(Math.random() * vars.length)];
    const w = 1 + Math.random() * 2.4;
    g.fillRect(Math.random() * s, Math.random() * s, w, w);
  }
  if (streaks) {
    g.strokeStyle = streaks;
    for (let i = 0; i < 6; i++) {
      g.beginPath();
      const y = Math.random() * s;
      g.moveTo(0, y); g.quadraticCurveTo(s / 2, y + (Math.random() - 0.5) * 10, s, y);
      g.stroke();
    }
  }
});

const dirtTex = () => noiseTex('#8a5a34', ['#7a4d2a', '#96653c', '#6d4325', '#a06f42', '#835430'], 'rgba(60,36,18,.5)');
const chipTex = () => noiseTex('#b5772f', ['#a3682a', '#c98938', '#93601f', '#c2792d'], null);
const asphaltTex = () => makeTex(128, (g, s) => {
  g.fillStyle = '#41454e'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 500; i++) {
    g.fillStyle = ['#3a3d44', '#4a4e58', '#363940'][i % 3];
    g.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
  // parking bay lines, two rows
  g.fillStyle = '#e8e6da';
  for (let x = 6; x < s; x += 18) {
    g.fillRect(x, 8, 3, 34);
    g.fillRect(x, s - 42, 3, 34);
  }
});

/* ================= sky ================= */

const SKY_VERT = `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const SKY_FRAG = `
  uniform vec3 topColor; uniform vec3 midColor; uniform vec3 bottomColor;
  varying vec3 vWorld;
  void main() {
    float h = clamp(normalize(vWorld).y, -1.0, 1.0);
    vec3 c = h > 0.0 ? mix(midColor, topColor, pow(h, 0.7)) : mix(midColor, bottomColor, -h);
    c = floor(c * 32.0) / 32.0;   // chunky quantize = retro banding
    gl_FragColor = vec4(c, 1.0);
  }
`;

/* ================= build ================= */

export function buildWorld(scene) {
  scene.fog = new THREE.Fog(0xb06a3e, 190, 660);

  const sun = new THREE.DirectionalLight(0xffd9a0, 0.95);
  sun.position.set(30, 42, 18);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x8ea6ff, 0.32);
  fill.position.set(-24, 30, -30);
  scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xffc9a0, 0x5a3a28, 0.42));

  const mat = (opts) => new THREE.MeshLambertMaterial({ flatShading: true, ...opts });

  /* ---- ground layers ---- */
  const beyond = new THREE.Mesh(new THREE.PlaneGeometry(1500, 1200), mat({ color: 0x3a3226 }));
  beyond.rotation.x = -Math.PI / 2;
  beyond.position.y = -0.09;
  scene.add(beyond);

  const grass = new THREE.Mesh(new THREE.PlaneGeometry(FENCE.hw * 2 + 14, FENCE.hd * 2 + 14), mat({ color: 0x55603a }));
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -0.05;
  scene.add(grass);

  const dirt = dirtTex();
  dirt.repeat.set(13, 9);
  const infield = new THREE.Mesh(new THREE.PlaneGeometry(ARENA.hw * 2 + 4, ARENA.hd * 2 + 4), mat({ map: dirt }));
  infield.rotation.x = -Math.PI / 2;
  scene.add(infield);

  // the race track: a rounded-rect ring, built as one flat shape with a hole
  const roundedRectPath = (target, hw, hd, r) => {
    target.moveTo(-hw + r, -hd);
    target.lineTo(hw - r, -hd);
    target.absarc(hw - r, -hd + r, r, -Math.PI / 2, 0, false);
    target.lineTo(hw, hd - r);
    target.absarc(hw - r, hd - r, r, 0, Math.PI / 2, false);
    target.lineTo(-hw + r, hd);
    target.absarc(-hw + r, hd - r, r, Math.PI / 2, Math.PI, false);
    target.lineTo(-hw, -hd + r);
    target.absarc(-hw + r, -hd + r, r, Math.PI, Math.PI * 1.5, false);
  };
  const trackShape = new THREE.Shape();
  roundedRectPath(trackShape, TRACK.ohw, TRACK.ohd, TRACK.or);
  const trackHole = new THREE.Path();
  roundedRectPath(trackHole, TRACK.ihw, TRACK.ihd, TRACK.ir);
  trackShape.holes.push(trackHole);
  const trackDirt = dirtTex();
  trackDirt.repeat.set(0.08, 0.08);
  const track = new THREE.Mesh(new THREE.ShapeGeometry(trackShape, 44), mat({ map: trackDirt, color: 0xc2a06a }));
  track.rotation.x = -Math.PI / 2;
  track.position.y = 0.015;
  scene.add(track);

  const chips = chipTex();
  chips.repeat.set(8, 6);
  const playPad = new THREE.Mesh(new THREE.PlaneGeometry(PLAYGROUND.hw * 2, PLAYGROUND.hd * 2), mat({ map: chips }));
  playPad.rotation.x = -Math.PI / 2;
  playPad.position.set(PLAYGROUND.x, 0.01, PLAYGROUND.z);
  scene.add(playPad);

  const lot = new THREE.Mesh(new THREE.PlaneGeometry(PARKING.hw * 2, PARKING.hd * 2), mat({ map: asphaltTex() }));
  lot.rotation.x = -Math.PI / 2;
  lot.position.set(PARKING.x, 0.01, PARKING.z);
  scene.add(lot);

  /* ---- wedge ramps (from the same array the physics uses) ---- */
  for (const r of WEDGES) {
    const profile = new THREE.Shape();
    profile.moveTo(-r.l / 2, 0);
    profile.lineTo(r.l / 2, 0);
    profile.lineTo(0, r.h);
    profile.closePath();
    const geo = new THREE.ExtrudeGeometry(profile, { depth: r.w, bevelEnabled: false });
    geo.translate(0, 0, -r.w / 2);
    geo.rotateY(Math.PI / 2);          // length along z, width along x — matches heightAt
    const m = new THREE.Mesh(geo, mat({ color: r.color }));
    m.position.set(r.x, 0.012, r.z);
    m.rotation.y = r.yaw;
    scene.add(m);
    if (r.h >= 1) {                    // ridge stripe so real launch lines read from afar
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.12, 0.5), mat({ color: 0xfff7e8 }));
      stripe.position.set(r.x, r.h + 0.02, r.z);
      stripe.rotation.y = r.yaw;
      scene.add(stripe);
    }
  }

  /* ---- barrier rings: stadium wall (with archway gaps) + outer fence ---- */
  const barrierPts = (hw, hd, r, step, skipGaps) => {
    const pts = [];
    const push = (x, z, a) => {
      if (skipGaps && Math.abs(z) < GAP_HALF + 1 && Math.abs(x) > hw - r) return;
      pts.push({ x, z, a });
    };
    const seg = (x0, z0, x1, z1) => {
      const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / step));
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        push(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, Math.atan2(x1 - x0, z1 - z0) + Math.PI / 2);
      }
    };
    const arc = (cx, cz, a0, a1) => {
      const L = Math.abs(a1 - a0) * r, n = Math.max(1, Math.round(L / step));
      for (let i = 0; i < n; i++) {
        const a = a0 + (a1 - a0) * ((i + 0.5) / n);
        push(cx + Math.cos(a) * r, cz + Math.sin(a) * r, -a);
      }
    };
    seg(-(hw - r), hd, hw - r, hd);
    arc(hw - r, hd - r, Math.PI / 2, 0);
    seg(hw, hd - r, hw, -(hd - r));
    arc(hw - r, -(hd - r), 0, -Math.PI / 2);
    seg(hw - r, -hd, -(hw - r), -hd);
    arc(-(hw - r), -(hd - r), -Math.PI / 2, -Math.PI);
    seg(-hw, -(hd - r), -hw, hd - r);
    arc(-(hw - r), hd - r, Math.PI, Math.PI / 2);
    return pts;
  };
  const buildBarrier = (pts) => {
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(3.4, 1.15, 0.7), mat({ color: 0xffffff }), pts.length);
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(1, 1, 1);
    const C = new THREE.Color();
    pts.forEach((p, i) => {
      Q.setFromEuler(E.set(0, p.a, 0));
      mesh.setMatrixAt(i, M.compose(new THREE.Vector3(p.x, 0.55, p.z), Q, S));
      mesh.setColorAt(i, C.setHex(i % 2 ? 0xd43c2a : 0xfff7e8));
    });
    mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);
  };
  buildBarrier(barrierPts(ARENA.hw, ARENA.hd, ARENA.r, 3.8, true));
  buildBarrier(barrierPts(FENCE.hw, FENCE.hd, FENCE.r, 6.5, false));

  /* ---- archways over the stadium exits ---- */
  const emojiSign = (emoji) => {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#1c1233'; g.fillRect(0, 0, 128, 64);
    g.strokeStyle = '#ffcf3f'; g.lineWidth = 5; g.strokeRect(3, 3, 122, 58);
    g.font = '40px -apple-system, system-ui, sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(emoji, 64, 34);
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };
  const arch = (x, facing, emoji) => {
    const g = new THREE.Group();
    const postGeo = new THREE.BoxGeometry(1.6, 8, 1.6);
    const pmat = mat({ color: 0xd43c2a });
    for (const pz of [-(GAP_HALF + 1.4), GAP_HALF + 1.4]) {
      const post = new THREE.Mesh(postGeo, pmat);
      post.position.set(0, 4, pz);
      g.add(post);
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, (GAP_HALF + 2.2) * 2), pmat);
    beam.position.y = 8.4;
    g.add(beam);
    for (const s of [-1, 1]) {
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.5), new THREE.MeshBasicMaterial({ map: emojiSign(emoji) }));
      sign.position.set(s * 1.0, 8.5, 0);
      sign.rotation.y = s > 0 ? Math.PI / 2 : -Math.PI / 2;
      g.add(sign);
    }
    g.position.set(x, 0, 0);
    void facing;
    scene.add(g);
  };
  arch(-45, 1, '⚽');    // west exit → playground
  arch(45, -1, '🚗');    // east exit → parking lot

  /* ---- grandstands + crowd (banks flank the archways on the ±x ends) ---- */
  const standMat = mat({ color: 0x5a6b8c });
  const standMat2 = mat({ color: 0x49587a });
  const seats = [];
  const bank = (cx, cz, len, ry) => {
    // ry turns local +z toward the arena; rows step BACK along local -z
    const g = new THREE.Group();
    for (let row = 0; row < 4; row++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(len, 1.05, 2.2), row % 2 ? standMat : standMat2);
      box.position.set(0, row * 0.95 + 0.5, -row * 2.1);
      g.add(box);
      const n = Math.floor(len / 0.8);
      for (let i = 0; i < n; i++) {
        if (Math.random() < 0.12) continue;
        seats.push({
          lx: -len / 2 + (i + 0.5) * 0.8 + (Math.random() - 0.5) * 0.3,
          ly: row * 0.95 + 1.45,
          lz: -row * 2.1 + (Math.random() - 0.5) * 0.5,
          g,
        });
      }
    }
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(len, 1.6, 9), mat({ color: 0x3a4562 }));
    skirt.position.set(0, -0.6, -3.2);
    g.add(skirt);
    g.position.set(cx, 0, cz);
    g.rotation.y = ry;
    g.updateMatrixWorld(true);
    scene.add(g);
  };
  bank(0, ARENA.hd + 5, 74, Math.PI);
  bank(0, -(ARENA.hd + 5), 74, 0);
  bank(ARENA.hw + 5, 17, 18, -Math.PI / 2);
  bank(ARENA.hw + 5, -17, 18, -Math.PI / 2);
  bank(-(ARENA.hw + 5), 17, 18, Math.PI / 2);
  bank(-(ARENA.hw + 5), -17, 18, Math.PI / 2);

  const CROWD_COLORS = [0xff5330, 0xffcf3f, 0x3fae4c, 0x2f6fe0, 0x8e4ec6, 0xff7ab8, 0xfff7e8, 0x4fd8e8, 0xf07820];
  const crowd = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.62, 0.95),
    new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }),
    seats.length
  );
  {
    const M = new THREE.Matrix4(), S = new THREE.Vector3(1, 1, 1), C = new THREE.Color();
    const P = new THREE.Vector3(), Q = new THREE.Quaternion();
    seats.forEach((s, i) => {
      P.set(s.lx, s.ly, s.lz).applyMatrix4(s.g.matrixWorld);
      Q.copy(s.g.quaternion);
      crowd.setMatrixAt(i, M.compose(P, Q, S));
      crowd.setColorAt(i, C.setHex(CROWD_COLORS[Math.floor(Math.random() * CROWD_COLORS.length)]));
    });
    crowd.instanceColor.needsUpdate = true;
  }
  crowd.frustumCulled = false;
  scene.add(crowd);

  /* ---- light towers ---- */
  const towerMat = mat({ color: 0x3a4562 });
  const headMat = new THREE.MeshBasicMaterial({ color: 0xfff2c8 });
  for (const [tx, tz] of [[-38, -36], [38, -36], [-38, 36], [38, 36]]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 17, 6), towerMat);
    pole.position.set(tx, 8.5, tz);
    scene.add(pole);
    const head = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.2, 0.8), headMat);
    head.position.set(tx, 17.6, tz);
    head.lookAt(0, 2, 0);
    scene.add(head);
  }

  /* ---- jumbotron ---- */
  const jCanvas = document.createElement('canvas');
  jCanvas.width = 256; jCanvas.height = 128;
  const jCtx = jCanvas.getContext('2d');
  const jTex = new THREE.CanvasTexture(jCanvas);
  jTex.magFilter = THREE.NearestFilter;
  jTex.minFilter = THREE.NearestFilter;
  jTex.generateMipmaps = false;
  jTex.colorSpace = THREE.SRGBColorSpace;

  const jGroup = new THREE.Group();
  const jFrame = new THREE.Mesh(new THREE.BoxGeometry(17, 9.6, 1.2), mat({ color: 0x2b3350 }));
  jGroup.add(jFrame);
  const jScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(15.6, 8.2),
    new THREE.MeshBasicMaterial({ map: jTex })
  );
  jScreen.position.z = 0.75;
  jGroup.add(jScreen);
  for (const lx of [-6, 6]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.9, 8, 0.9), towerMat);
    leg.position.set(lx, -8, 0);
    jGroup.add(leg);
  }
  jGroup.position.set(0, 12.4, ARENA.hd + 13.5);
  jGroup.rotation.y = Math.PI;
  scene.add(jGroup);

  function jBase() {
    jCtx.fillStyle = '#101a38';
    jCtx.fillRect(0, 0, 256, 128);
    jCtx.strokeStyle = '#4fd8e8';
    jCtx.lineWidth = 4;
    jCtx.strokeRect(4, 4, 248, 120);
  }
  const jumbotron = {
    setTarget(item) {
      jBase();
      drawGlyph(jCtx, item, 74, 10, 108);
      jCtx.font = '900 34px -apple-system, system-ui, sans-serif';
      jCtx.textAlign = 'center'; jCtx.textBaseline = 'middle';
      jCtx.fillText('👀', 34, 64);
      jCtx.fillText('👉', 226, 64);
      jTex.needsUpdate = true;
    },
    idle(stars) {
      jBase();
      jCtx.font = '900 44px -apple-system, system-ui, sans-serif';
      jCtx.textAlign = 'center'; jCtx.textBaseline = 'middle';
      jCtx.fillText('🛻', 128, 46);
      jCtx.font = '900 30px -apple-system, system-ui, sans-serif';
      jCtx.fillStyle = '#ffcf3f';
      jCtx.fillText('⭐ ' + stars, 128, 96);
      jTex.needsUpdate = true;
    },
    celebrate() {
      jBase();
      jCtx.font = '900 52px -apple-system, system-ui, sans-serif';
      jCtx.textAlign = 'center'; jCtx.textBaseline = 'middle';
      jCtx.fillText('🎉 ⭐ 🎉', 128, 64);
      jTex.needsUpdate = true;
    },
  };
  jumbotron.idle(0);

  /* ---- playground props: tire stacks + push balls ---- */
  const tireMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(1.5, 1.6, 0.62, 12), mat({ color: 0x22242a }), 6);
  {
    const M = new THREE.Matrix4();
    let i = 0;
    for (const c of [{ x: -217, z: 12 }, { x: -213, z: -20 }, { x: -173, z: -6 }]) {
      for (let s = 0; s < 2; s++) {
        tireMesh.setMatrixAt(i++, M.makeTranslation(c.x, 0.33 + s * 0.64, c.z));
      }
    }
  }
  scene.add(tireMesh);

  const BALL_COLORS = [0xe8442e, 0xf4c531, 0x2f6fe0];
  const balls = [[-189, -2], [-199, 18], [-181, 10]].map(([bx, bz], i) => {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), mat({ color: BALL_COLORS[i] }));
    mesh.position.set(bx, 1.5, bz);
    scene.add(mesh);
    return { mesh, pos: new THREE.Vector3(bx, 0, bz), vel: new THREE.Vector3(), r: 1.5, cool: 0 };
  });

  /* ---- parked cars (instanced; squashed matrices when crushed) ---- */
  const carBodies = new THREE.InstancedMesh(new THREE.BoxGeometry(2.3, 0.75, 4.6), mat({ color: 0xffffff }), CARS.length);
  const carCabins = new THREE.InstancedMesh(new THREE.BoxGeometry(2.0, 0.55, 2.3), mat({ color: 0xcfe8f5 }), CARS.length);
  const carShadows = new THREE.InstancedMesh(new THREE.BoxGeometry(2.4, 0.18, 4.7), mat({ color: 0x24262c }), CARS.length);
  {
    const C = new THREE.Color();
    CARS.forEach((car, i) => carBodies.setColorAt(i, C.setHex(car.color)));
    carBodies.instanceColor.needsUpdate = true;
  }
  const writeCar = (i) => {
    const car = CARS[i];
    const k = car.crushed ? 0.3 : 1;
    const M = new THREE.Matrix4();
    M.makeScale(car.crushed ? 1.15 : 1, k, car.crushed ? 1.08 : 1).setPosition(car.x, 0.5 * k + 0.12, car.z);
    carBodies.setMatrixAt(i, M);
    M.makeScale(1, car.crushed ? 0.12 : 1, 1).setPosition(car.x, car.crushed ? 0.3 : 1.05, car.z - 0.35);
    carCabins.setMatrixAt(i, M);
    M.identity().setPosition(car.x, 0.09, car.z);
    carShadows.setMatrixAt(i, M);
  };
  CARS.forEach((_, i) => writeCar(i));
  scene.add(carBodies, carCabins, carShadows);

  /* ---- trees ---- */
  const treeTops = new THREE.InstancedMesh(new THREE.ConeGeometry(2.6, 5.5, 7), mat({ color: 0x3f6b34 }), TREES.length);
  const treeTrunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.4, 0.5, 2.2, 6), mat({ color: 0x6d4c33 }), TREES.length);
  {
    const M = new THREE.Matrix4(), S = new THREE.Vector3(), Q = new THREE.Quaternion();
    TREES.forEach((t, i) => {
      S.set(t.s, t.s, t.s);
      treeTops.setMatrixAt(i, M.compose(new THREE.Vector3(t.x, 2 + 2.7 * t.s, t.z), Q, S));
      treeTrunks.setMatrixAt(i, M.compose(new THREE.Vector3(t.x, 1.1 * t.s, t.z), Q, S));
    });
  }
  scene.add(treeTops, treeTrunks);

  /* ---- track dressing: centre line, start/finish, banner arches ---- */

  // dashed centre line, walked around the mid-line oval
  {
    const dashes = barrierPts(TRACK_MID.hw, TRACK_MID.hd, TRACK_MID.r, 22, false);
    const mesh = new THREE.InstancedMesh(
      new THREE.BoxGeometry(8, 0.08, 0.7),
      new THREE.MeshBasicMaterial({ color: 0xf4ead2 }),
      dashes.length
    );
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(1, 1, 1);
    dashes.forEach((p, i) => {
      Q.setFromEuler(E.set(0, p.a, 0));
      mesh.setMatrixAt(i, M.compose(new THREE.Vector3(p.x, 0.03, p.z), Q, S));
    });
    scene.add(mesh);
  }

  // start/finish: a checkered band across the south straight
  {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = '#f4ead2'; g.fillRect(0, 0, 64, 64);
    g.fillStyle = '#1c1233';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) if ((x + y) % 2) g.fillRect(x * 16, y * 16, 16, 16);
    const tex = new THREE.CanvasTexture(c);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false; tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 8);
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(7, TRACK.ohd - TRACK.ihd),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.04, -TRACK_MID.hd);
    scene.add(line);
  }

  // arches straddle the straights — wide enough to pass under anywhere on the track
  const HALF_SPAN = (TRACK.ohd - TRACK.ihd) / 2 + 2;
  for (const bz of [-TRACK_MID.hd, TRACK_MID.hd]) {
    const g = new THREE.Group();
    const pmat = mat({ color: 0x2f6fe0 });
    for (const s of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(1.2, 9, 1.2), pmat);
      post.position.set(0, 4.5, s * HALF_SPAN);
      g.add(post);
      CIRCLES.push({ x: 0, z: bz + s * HALF_SPAN, r: 0.9 });
    }
    const banner = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.4, HALF_SPAN * 2 + 1.2), mat({ color: 0xffcf3f }));
    banner.position.y = 9.6;
    g.add(banner);
    g.position.set(0, 0, bz);
    scene.add(g);
  }

  /* ---- checkpoint markers: a striped post pair flanking each learning stop ---- */
  // Permanent scenery so the spots read as part of the track; the answer gates
  // themselves rise between them only while a round is running.
  {
    const cps = trackCheckpoints();
    const posts = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.45, 0.55, 6.5, 6),
      mat({ color: 0xfff7e8 }),
      cps.length * 2
    );
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(1, 1, 1);
    const C = new THREE.Color();
    let i = 0;
    for (const cp of cps) {
      // step sideways off the racing line: local x is across the track
      const c = Math.cos(cp.yaw), s = Math.sin(cp.yaw);
      for (const side of [-1, 1]) {
        const off = side * 25;
        const x = cp.x + off * c, z = cp.z - off * s;
        posts.setMatrixAt(i, M.compose(new THREE.Vector3(x, 3.25, z), Q, S));
        posts.setColorAt(i, C.setHex(side < 0 ? 0xd43c2a : 0x2f6fe0));
        CIRCLES.push({ x, z, r: 0.5 });
        i++;
      }
    }
    posts.instanceColor.needsUpdate = true;
    scene.add(posts);
  }

  /* ---- sky ---- */
  const skyUniforms = {
    topColor: { value: new THREE.Color(0x2a2f7e) },
    midColor: { value: new THREE.Color(0xe0813f) },
    bottomColor: { value: new THREE.Color(0x6a3a22) },
  };
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(700, 20, 14),
    new THREE.ShaderMaterial({ uniforms: skyUniforms, vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, fog: false })
  );
  dome.renderOrder = -3;
  scene.add(dome);

  const cloudMat = new THREE.MeshBasicMaterial({ color: 0xf0c9a0, fog: false });
  const clouds = new THREE.Group();
  for (let i = 0; i < 13; i++) {
    const cloud = new THREE.Group();
    const puffs = 3 + Math.floor(Math.random() * 4);
    for (let p = 0; p < puffs; p++) {
      const r = 6 + Math.random() * 7;
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), cloudMat);
      puff.position.set((p - puffs / 2) * 8 + Math.random() * 4, Math.random() * 3, Math.random() * 6 - 3);
      puff.scale.set(1, 0.5, 0.8);
      cloud.add(puff);
    }
    cloud.position.set((Math.random() - 0.5) * 800, 95 + Math.random() * 60, (Math.random() - 0.5) * 800);
    clouds.add(cloud);
  }
  scene.add(clouds);

  /* ---- live behavior ---- */
  let cheerTimer = 0;
  const crowdBaseY = crowd.position.y;
  const _d = new THREE.Vector3();

  return {
    heightAt, collide, zoneAt, GATE, ARENA, jumbotron,

    /** Make the stands go wild for a moment. */
    cheer(seconds = 1.5) { cheerTimer = Math.max(cheerTimer, seconds); },

    /**
     * Per-frame world life. Needs the truck for crushing and ball pushing.
     * Returns events for main to turn into sound and particles:
     * { crushes: [{x,z}], ballHits: [{x,z}], restores: [{x,z}] }
     */
    update(dt, t, camera, truck) {
      const ev = { crushes: [], ballHits: [], restores: [] };

      for (const c of clouds.children) {
        c.position.x += dt * 1.4;
        if (c.position.x > 420) c.position.x = -420;
      }
      dome.position.copy(camera.position);
      cheerTimer = Math.max(0, cheerTimer - dt);
      const amp = cheerTimer > 0 ? 0.3 : 0.06;
      const speed = cheerTimer > 0 ? 9 : 2;
      crowd.position.y = crowdBaseY + Math.abs(Math.sin(t * speed)) * amp;

      if (truck) {
        /* cars: pancake on contact, pop back after a rest */
        for (let i = 0; i < CARS.length; i++) {
          const car = CARS[i];
          const dx = Math.abs(truck.pos.x - car.x), dz = Math.abs(truck.pos.z - car.z);
          const near = dx < car.w / 2 + 1.3 && dz < car.l / 2 + 1.3;
          if (!car.crushed && near && truck.pos.y < 1.7) {
            car.crushed = true;
            car.timer = 22;
            writeCar(i);
            ev.crushes.push({ x: car.x, z: car.z });
          } else if (car.crushed) {
            car.timer -= dt;
            if (car.timer <= 0 && !near) {
              car.crushed = false;
              writeCar(i);
              ev.restores.push({ x: car.x, z: car.z });
            }
          }
        }
        carBodies.instanceMatrix.needsUpdate = true;
        carCabins.instanceMatrix.needsUpdate = true;

        /* beach balls: nudge, roll, bounce */
        for (const b of balls) {
          b.cool = Math.max(0, b.cool - dt);
          _d.set(b.pos.x - truck.pos.x, 0, b.pos.z - truck.pos.z);
          const d = _d.length();
          if (d < b.r + 2.2) {
            _d.normalize();
            const punch = 4 + Math.abs(truck.speed) * 0.85;
            b.vel.x = _d.x * punch;
            b.vel.z = _d.z * punch;
            if (b.cool <= 0) { ev.ballHits.push({ x: b.pos.x, z: b.pos.z }); b.cool = 0.4; }
          }
          b.vel.multiplyScalar(Math.max(0, 1 - 1.1 * dt));
          b.pos.addScaledVector(b.vel, dt);
          const wp = collide(b.pos.x, b.pos.z, b.r);
          if (wp) {
            b.pos.x = wp.x; b.pos.z = wp.z;
            const dot = b.vel.x * wp.nx + b.vel.z * wp.nz;
            if (dot < 0) { b.vel.x -= 1.7 * dot * wp.nx; b.vel.z -= 1.7 * dot * wp.nz; }
          }
          b.mesh.position.set(b.pos.x, b.r * (1 + Math.abs(Math.sin(t * 3)) * 0.04), b.pos.z);
          b.mesh.rotation.x += b.vel.z * dt / b.r;
          b.mesh.rotation.z -= b.vel.x * dt / b.r;
        }

      }

      return ev;
    },
  };
}
