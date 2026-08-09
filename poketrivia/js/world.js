// Builds the island: heightfield terrain, water, sky, clouds, distant peaks,
// and every prop.
//
// The look is chasing the "Pokémon on N64" concept art — lush layered forest,
// warm dirt paths, half-timbered cottages, mossy stone ruins — but rendered the
// way that era actually could: low-poly, flat-shaded, vertex-coloured, untextured.
//
// Two rules make that work:
//   1. Geometry is NON-INDEXED with per-face colours, so computeVertexNormals()
//      gives one normal per triangle => hard faceted shading.
//   2. Colour variety comes from the vertex stream, never textures. Every leaf
//      cluster, rock and roof slab gets its own tint, which is what keeps a
//      untextured scene from looking like flat plastic.

import * as THREE from 'three';
import {
  HILLS, ZONES, HUB, WATER_Y, SHORE_R, SHORE_FADE, WORLD_EXTENT,
  zoneAt, pathDist, SCATTER, GRASS_PATCHES, inTallGrass, BUILDINGS, RUINS, SIGN_SPOTS,
  WATERFALL,
} from './zones.js';
import { makeNoise, makeRng, WORLD_SEED, clamp, clamp01, smoothstep, lerp } from './rng.js';

const noise = makeNoise(WORLD_SEED);
const TAU = Math.PI * 2;

/* ============================ terrain maths ============================ */

export function heightAt(x, z) {
  const d = Math.hypot(x, z);
  const m = smoothstep((SHORE_R - d) / SHORE_FADE);
  if (m <= 0) return 0;
  let h = 3.6;
  for (const hl of HILLS) {
    const dx = x - hl.x, dz = z - hl.z;
    const g = Math.exp(-(dx * dx + dz * dz) / (2 * hl.sig * hl.sig));
    h += hl.flat ? Math.min(hl.amp, hl.amp * 1.7 * g) : hl.amp * g;
  }
  h += noise(x * 0.045, z * 0.045) * 1.7;
  h += noise(x * 0.13, z * 0.13) * 0.55;
  return h * m;
}

/** Steepness as rise-over-run (1.0 ≈ 45°). */
export function slopeAt(x, z) {
  const e = 0.7;
  const dx = (heightAt(x + e, z) - heightAt(x - e, z)) / (2 * e);
  const dz = (heightAt(x, z + e) - heightAt(x, z - e)) / (2 * e);
  return Math.hypot(dx, dz);
}

export const isWater = (x, z) => heightAt(x, z) < WATER_Y + 0.25;

/* ============================ mesh builder ============================ */

export class Mesher {
  constructor() { this.pos = []; this.col = []; }
  get triCount() { return this.pos.length / 9; }

  _v(p, c) { this.pos.push(p[0], p[1], p[2]); this.col.push(c[0], c[1], c[2]); }
  tri(a, b, c, col) { this._v(a, col); this._v(b, col); this._v(c, col); }
  quad(a, b, c, d, col) { this.tri(a, b, c, col); this.tri(a, c, d, col); }

  box(cx, cy, cz, w, h, d, col, rotY = 0) {
    const hx = w / 2, hy = h / 2, hz = d / 2;
    const co = Math.cos(rotY), si = Math.sin(rotY);
    const P = (sx, sy, sz) => {
      const x = sx * hx, z = sz * hz;
      return [cx + x * co - z * si, cy + sy * hy, cz + x * si + z * co];
    };
    const p000 = P(-1,-1,-1), p100 = P(1,-1,-1), p110 = P(1,1,-1), p010 = P(-1,1,-1);
    const p001 = P(-1,-1, 1), p101 = P(1,-1, 1), p111 = P(1,1, 1), p011 = P(-1,1, 1);
    this.quad(p001, p101, p111, p011, col);
    this.quad(p100, p000, p010, p110, shade(col, 0.78));
    this.quad(p101, p100, p110, p111, shade(col, 0.90));
    this.quad(p000, p001, p011, p010, shade(col, 0.84));
    this.quad(p011, p111, p110, p010, shade(col, 1.12));
    this.quad(p000, p100, p101, p001, shade(col, 0.6));
  }

  cone(cx, cy, cz, r, h, sides, col, spin = 0) {
    const apex = [cx, cy + h, cz];
    const ring = [];
    for (let i = 0; i < sides; i++) {
      const a = spin + (i / sides) * TAU;
      ring.push([cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r]);
    }
    for (let i = 0; i < sides; i++) {
      const p0 = ring[i], p1 = ring[(i + 1) % sides];
      const f = 0.84 + 0.32 * (0.5 + 0.5 * Math.cos(spin + (i / sides) * TAU - 0.9));
      this.tri(apex, p1, p0, shade(col, f));
    }
    const c = [cx, cy, cz];
    for (let i = 0; i < sides; i++) this.tri(c, ring[i], ring[(i + 1) % sides], shade(col, 0.68));
  }

  cyl(cx, cy, cz, rBot, rTop, h, sides, col, spin = 0, leanX = 0, leanZ = 0) {
    const b = [], t = [];
    for (let i = 0; i < sides; i++) {
      const a = spin + (i / sides) * TAU;
      const co = Math.cos(a), si = Math.sin(a);
      b.push([cx + co * rBot, cy, cz + si * rBot]);
      t.push([cx + co * rTop + leanX, cy + h, cz + si * rTop + leanZ]);
    }
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      const f = 0.8 + 0.36 * (0.5 + 0.5 * Math.cos(spin + (i / sides) * TAU - 0.9));
      this.quad(b[j], b[i], t[i], t[j], shade(col, f));
    }
    const ct = [cx + leanX, cy + h, cz + leanZ];
    for (let i = 0; i < sides; i++) this.tri(ct, t[(i + 1) % sides], t[i], shade(col, 1.14));
  }

  /** Lumpy sphere — the workhorse for leaf clusters, bushes, boulders, clouds.
   *  Poles are fans so no degenerate triangles reach computeVertexNormals. */
  blob(cx, cy, cz, r, col, rnd, squashY = 1, wobble = 0.34) {
    const S = 7, R = 4;
    const rows = [];
    for (let i = 1; i < R; i++) {
      const th = (i / R) * Math.PI;
      const row = [];
      for (let j = 0; j < S; j++) {
        const ph = (j / S) * TAU;
        const rr = r * (1 - wobble / 2 + wobble * rnd());
        row.push([
          cx + Math.sin(th) * Math.cos(ph) * rr,
          cy + Math.cos(th) * rr * squashY,
          cz + Math.sin(th) * Math.sin(ph) * rr,
        ]);
      }
      rows.push(row);
    }
    const top = [cx, cy + r * squashY * (1 - wobble / 3), cz];
    const bot = [cx, cy - r * squashY * (1 - wobble / 3), cz];
    const lit = (j, up) => shade(col, (0.74 + 0.3 * up) *
      (0.88 + 0.24 * (0.5 + 0.5 * Math.cos((j / S) * TAU - 0.9))));
    for (let j = 0; j < S; j++) {
      const j2 = (j + 1) % S;
      this.tri(top, rows[0][j2], rows[0][j], lit(j, 1));
      this.tri(bot, rows[R - 2][j], rows[R - 2][j2], lit(j, 0));
    }
    for (let i = 0; i < R - 2; i++) {
      for (let j = 0; j < S; j++) {
        const j2 = (j + 1) % S;
        this.quad(rows[i][j], rows[i][j2], rows[i + 1][j2], rows[i + 1][j],
          lit(j, 1 - i / (R - 2)));
      }
    }
  }

  /** Gabled roof with eaves — cottage silhouette, ridge along X. */
  gable(cx, cy, cz, w, d, h, col, over = 0.7) {
    const hx = w / 2 + over, hz = d / 2 + over;
    const bl = [cx - hx, cy, cz - hz], br = [cx + hx, cy, cz - hz];
    const fr = [cx + hx, cy, cz + hz], fl = [cx - hx, cy, cz + hz];
    const rl = [cx - hx, cy + h, cz], rr = [cx + hx, cy + h, cz];
    this.quad(fl, fr, rr, rl, shade(col, 1.10));
    this.quad(br, bl, rl, rr, shade(col, 0.80));
    this.tri(bl, fl, rl, shade(col, 0.86));
    this.tri(fr, br, rr, shade(col, 0.94));
    this.quad(bl, br, fr, fl, shade(col, 0.55));
  }

  plate(cx, y, cz, w, d, col, rotY = 0) {
    const hx = w / 2, hz = d / 2;
    const co = Math.cos(rotY), si = Math.sin(rotY);
    const P = (sx, sz) => [cx + sx * hx * co - sz * hz * si, y, cz + sx * hx * si + sz * hz * co];
    this.quad(P(-1, 1), P(1, 1), P(1, -1), P(-1, -1), col);
  }

  /** Crossed vertical quads — grass tufts, ferns, reeds. Tapered so they read as blades. */
  cross(cx, cy, cz, w, h, col, rotY = 0, taper = 0.35) {
    for (let k = 0; k < 2; k++) {
      const a = rotY + k * Math.PI / 2;
      const co = Math.cos(a) * w / 2, si = Math.sin(a) * w / 2;
      const p0 = [cx - co, cy, cz - si], p1 = [cx + co, cy, cz + si];
      const p2 = [cx + co * taper, cy + h, cz + si * taper];
      const p3 = [cx - co * taper, cy + h, cz - si * taper];
      this.quad(p0, p1, p2, p3, col);
    }
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }
}

const _c = new THREE.Color();
export function rgb(hex) { _c.setHex(hex); return [_c.r, _c.g, _c.b]; }
function shade(c, f) { return [c[0] * f, c[1] * f, c[2] * f]; }
function mixc(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function tintc(c, rnd, amt = 0.16) {
  const f = 1 - amt / 2 + amt * rnd();
  return [c[0] * f, c[1] * (f * 0.98 + 0.02), c[2] * f];
}

/* ============================ palette ============================ */

const PAL = {
  sand:     rgb(0xe8d6a4),
  wetSand:  rgb(0xc9b283),
  rock:     rgb(0x8d8579),
  rockDark: rgb(0x615a52),
  rockMoss: rgb(0x6f7d55),
  ash:      rgb(0x4a4148),
  lava:     rgb(0xff7a1a),
  dirt:     rgb(0xb98a4e),
  dirtDark: rgb(0x8f6636),
  sky:      rgb(0x3a8ade),
  skyTop:   rgb(0x11418f),
  horizon:  rgb(0xd3e8f7),
  bark:     rgb(0x6f4a2a),
  barkLite: rgb(0x8a6238),
  dead:     rgb(0x6b6259),
  stone:    rgb(0xd2cbb4),
  stoneDk:  rgb(0x9a9280),
  stoneMoss:rgb(0x8b9a6b),
  wood:     rgb(0xa9743c),
  timber:   rgb(0x5b3d24),
  plaster:  rgb(0xf3e9d2),
  glow:     rgb(0xffd88a),
  cloud:    rgb(0xffffff),
  cloudDk:  rgb(0xc6d8ee),
  peak:     rgb(0x6d86a8),
  foam:     rgb(0xeaf6ff),
  river:    rgb(0x4fa8d8),
};

// Leaf palettes: a base plus a sunlit highlight, sampled per cluster.
const LEAF = {
  oak:     [rgb(0x3f8f36), rgb(0x74bd4a)],
  maple:   [rgb(0x4f9b32), rgb(0x9ac94e)],
  pine:    [rgb(0x24632c), rgb(0x3d8a3a)],
  cypress: [rgb(0x5c7f3f), rgb(0x88a851)],
  palm:    [rgb(0x3f9c4e), rgb(0x74c95f)],
  bush:    [rgb(0x377c33), rgb(0x62a542)],
};

const FLOWERS = [rgb(0xff5d73), rgb(0xffd93d), rgb(0xff8fc7), rgb(0xa06bff), rgb(0xfff4e0), rgb(0xff9b3d)];
const ZONE_GRASS = ZONES.map(z => ({ x: z.x, z: z.z, c: rgb(z.grass), c2: rgb(z.grass2 ?? z.grass) }));

/** Blend zone grass by inverse cubed distance — distinct areas, soft seams. */
function grassAt(x, z) {
  let r = 0, g = 0, b = 0, r2 = 0, g2 = 0, b2 = 0, wsum = 0;
  for (const zn of ZONE_GRASS) {
    const d = Math.max(7, Math.hypot(x - zn.x, z - zn.z));
    const w = 1 / (d * d * d);
    r += zn.c[0] * w; g += zn.c[1] * w; b += zn.c[2] * w;
    r2 += zn.c2[0] * w; g2 += zn.c2[1] * w; b2 += zn.c2[2] * w;
    wsum += w;
  }
  // two grass tones mottled by low-frequency noise: sunlit vs shaded meadow
  const t = clamp01(0.5 + 0.75 * noise(x * 0.028, z * 0.028));
  return [lerp(r / wsum, r2 / wsum, t), lerp(g / wsum, g2 / wsum, t), lerp(b / wsum, b2 / wsum, t)];
}

const CRATER = { x: 72, z: -24, r: 6.5 };

function terrainColor(x, z, h, slope) {
  if (h < WATER_Y + 0.15) return rgb(0x1c5a92);
  if (Math.hypot(x - CRATER.x, z - CRATER.z) < CRATER.r && h < 19.5) return PAL.lava;
  if (h < WATER_Y + 0.9) return PAL.wetSand;
  if (h < WATER_Y + 2.3) return mixc(PAL.wetSand, PAL.sand, (h - WATER_Y - 0.9) / 1.4);
  if (h > 22) return mixc(PAL.rock, PAL.ash, clamp01((h - 22) / 5));
  const base = grassAt(x, z);
  if (slope > 1.05) {
    // rocky faces keep a little moss where the slope eases off
    const t = clamp01((slope - 1.05) / 0.8);
    return mixc(mixc(base, PAL.rockMoss, 0.6), mixc(PAL.rock, PAL.rockDark, t), t);
  }
  const pd = pathDist(x, z);
  if (pd < 0) return mixc(PAL.dirt, PAL.dirtDark, clamp01(-pd / 3) * 0.5);
  if (pd < 3.0) return mixc(base, PAL.dirt, (1 - pd / 3.0) * 0.7);
  if (inTallGrass(x, z)) return shade(base, 0.74);
  return base;
}

/* ============================ terrain mesh ============================ */

const GRID = 108;
const STEP = (WORLD_EXTENT * 2) / GRID;

function buildTerrain() {
  const m = new Mesher();
  const N = GRID + 1;
  const hCache = new Float32Array(N * N);
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      hCache[i * N + j] = heightAt(-WORLD_EXTENT + i * STEP, -WORLD_EXTENT + j * STEP);
    }
  }
  const H = (i, j) => hCache[i * N + j];
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const x0 = -WORLD_EXTENT + i * STEP, z0 = -WORLD_EXTENT + j * STEP;
      const x1 = x0 + STEP, z1 = z0 + STEP;
      const a = [x0, H(i, j), z0], b = [x1, H(i + 1, j), z0];
      const c = [x1, H(i + 1, j + 1), z1], d = [x0, H(i, j + 1), z1];
      const cx = x0 + STEP / 2, cz = z0 + STEP / 2;
      const hAvg = (a[1] + b[1] + c[1] + d[1]) / 4;
      const sl = Math.max(Math.abs(a[1] - c[1]), Math.abs(b[1] - d[1])) / (STEP * 1.414);
      const base = terrainColor(cx, cz, hAvg, sl);
      const jit = 0.95 + 0.10 * (0.5 + 0.5 * noise(cx * 0.55, cz * 0.55));
      const col = shade(base, jit);
      // BOTH triangles of a cell get the IDENTICAL colour. Shading the second
      // one even slightly darker draws a diagonal seam across every one of the
      // ~11,600 cells, which reads as scratchy lines all over the ground rather
      // than as texture. Variation already comes from `jit` (per cell) and from
      // the flat-shaded normals, which is plenty.
      m.tri(a, c, b, col);                      // counter-clockwise from above
      m.tri(a, d, c, col);
    }
  }
  return m.build();
}

/* ============================ props ============================ */

export const colliders = [];
export const signPosts = [];

function addCollider(x, z, r) { colliders.push({ x, z, r }); }

/* --- trees --- */

function broadleaf(m, x, y, z, s, rng, kind = 'oak') {
  const [base, hi] = LEAF[kind];
  const spin = rng.range(0, TAU);
  const leanX = rng.range(-0.5, 0.5) * s, leanZ = rng.range(-0.5, 0.5) * s;
  const trunkH = 3.4 * s;
  m.cyl(x, y, z, 0.62 * s, 0.34 * s, trunkH, 5,
    tintc(rng.next() > 0.6 ? PAL.barkLite : PAL.bark, rng.next), spin, leanX, leanZ);
  // a couple of limbs so the canopy doesn't float
  for (let i = 0; i < 2; i++) {
    const a = spin + i * 2.4 + rng.range(-0.4, 0.4);
    m.cyl(x + leanX * 0.7, y + trunkH * 0.72, z + leanZ * 0.7, 0.26 * s, 0.2 * s, 1.5 * s, 5,
      shade(PAL.bark, 0.9), a, Math.cos(a) * 1.4 * s, Math.sin(a) * 1.4 * s);
  }
  // 4 overlapping clusters give the rounded, painterly canopy
  const cx = x + leanX, cz = z + leanZ, cy = y + trunkH + 1.1 * s;
  const R = 2.5 * s;
  m.blob(cx, cy + 0.6 * s, cz, R * 0.92, mixc(base, hi, 0.55), rng.next, 0.86);
  for (let i = 0; i < 3; i++) {
    const a = spin + i * (TAU / 3) + rng.range(-0.3, 0.3);
    const d = R * rng.range(0.55, 0.8);
    m.blob(cx + Math.cos(a) * d, cy + rng.range(-0.5, 0.4) * s, cz + Math.sin(a) * d,
      R * rng.range(0.6, 0.82), tintc(mixc(base, hi, rng.range(0, 0.5)), rng.next, 0.2),
      rng.next, 0.9);
  }
  // Collide with the TRUNK, not the canopy. The canopy is deliberately wider
  // than the trunk, and blocking its full width turns a forest into a maze.
  addCollider(x, z, 0.6 * s);
}

function conifer(m, x, y, z, s, rng) {
  const [base, hi] = LEAF.pine;
  const spin = rng.range(0, TAU);
  const c = tintc(mixc(base, hi, rng.range(0, 0.45)), rng.next, 0.18);
  m.cyl(x, y, z, 0.5 * s, 0.3 * s, 2.4 * s, 5, PAL.bark, spin);
  const layers = 4;
  for (let i = 0; i < layers; i++) {
    const t = i / layers;
    m.cone(x, y + (1.7 + i * 1.75) * s, z, (2.7 - t * 1.7) * s, (3.2 - t * 0.5) * s, 7,
      shade(c, 0.9 + 0.16 * t), spin + i * 0.55);
  }
  // Collide with the TRUNK, not the canopy. The canopy is wider than the trunk
  // by design, and blocking its full width makes a forest feel like a maze.
  addCollider(x, z, 0.55 * s);
}

function cypress(m, x, y, z, s, rng) {
  const [base, hi] = LEAF.cypress;
  const spin = rng.range(0, TAU);
  m.cyl(x, y, z, 0.4 * s, 0.28 * s, 1.8 * s, 5, PAL.bark, spin);
  const c = tintc(mixc(base, hi, rng.range(0.1, 0.6)), rng.next, 0.18);
  for (let i = 0; i < 3; i++) {
    m.blob(x, y + (2.6 + i * 2.0) * s, z, (1.9 - i * 0.35) * s, shade(c, 0.92 + i * 0.07),
      rng.next, 1.45, 0.28);
  }
  addCollider(x, z, 0.45 * s);
}

function palm(m, x, y, z, s, rng) {
  const [base, hi] = LEAF.palm;
  const spin = rng.range(0, TAU);
  const lx = rng.range(-1.4, 1.4) * s, lz = rng.range(-1.4, 1.4) * s;
  m.cyl(x, y, z, 0.44 * s, 0.26 * s, 6.0 * s, 6, tintc(PAL.barkLite, rng.next), spin, lx, lz);
  const tx = x + lx, ty = y + 6.0 * s, tz = z + lz;
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = spin + (i / n) * TAU + rng.range(-0.12, 0.12);
    const dx = Math.cos(a), dz = Math.sin(a);
    const c = tintc(mixc(base, hi, rng.range(0, 0.7)), rng.next, 0.2);
    // two-segment drooping frond
    const m1x = tx + dx * 2.1 * s, m1z = tz + dz * 2.1 * s, m1y = ty + 0.5 * s;
    const e = { x: tx + dx * 4.2 * s, y: ty - 1.5 * s, z: tz + dz * 4.2 * s };
    const wv = 0.75 * s;
    m.quad([tx, ty, tz], [m1x - dz * wv, m1y, m1z + dx * wv],
      [e.x, e.y, e.z], [m1x + dz * wv, m1y, m1z - dx * wv], c);
  }
  m.blob(tx, ty - 0.3 * s, tz, 0.7 * s, shade(PAL.barkLite, 0.9), rng.next, 0.9, 0.3);
  addCollider(x, z, 0.5 * s);
}

function deadTree(m, x, y, z, s, rng) {
  const spin = rng.range(0, TAU);
  m.cyl(x, y, z, 0.55 * s, 0.2 * s, 4.6 * s, 5, tintc(PAL.dead, rng.next), spin,
    rng.range(-0.4, 0.4), rng.range(-0.4, 0.4));
  for (let i = 0; i < 3; i++) {
    const a = spin + i * 2.1;
    m.cyl(x, y + (2.4 + i * 0.8) * s, z, 0.22 * s, 0.16 * s, 1.6 * s, 5, shade(PAL.dead, 0.9),
      a, Math.cos(a) * 1.5 * s, Math.sin(a) * 1.5 * s);
  }
  addCollider(x, z, 0.5 * s);
}

const TREE_FN = { oak: broadleaf, maple: (m,x,y,z,s,r) => broadleaf(m,x,y,z,s,r,'maple'),
  pine: conifer, cypress, palm, dead: deadTree };

function bush(m, x, y, z, s, rng) {
  const [base, hi] = LEAF.bush;
  const c = tintc(mixc(base, hi, rng.range(0, 0.6)), rng.next, 0.22);
  m.blob(x, y + 0.55 * s, z, 0.95 * s, c, rng.next, 0.8);
  if (rng.next() > 0.5) m.blob(x + 0.8 * s, y + 0.4 * s, z + 0.3 * s, 0.65 * s, shade(c, 0.9), rng.next, 0.8);
}

function boulderNoCollide(m, x, y, z, s, col, rng) {
  m.blob(x, y, z, s, tintc(col, rng.next, 0.16), rng.next, 0.78, 0.55);
  if (rng.next() > 0.65) {
    m.blob(x + rng.range(-0.3, 0.3) * s, y + s * 0.6, z + rng.range(-0.3, 0.3) * s,
      s * 0.45, PAL.stoneMoss, rng.next, 0.35, 0.5);
  }
}

function boulder(m, x, y, z, s, rng, mossy = true) {
  const c = mixc(PAL.rock, PAL.rockDark, rng.range(0, 0.55));
  m.blob(x, y + s * 0.45, z, s, tintc(c, rng.next, 0.14), rng.next, 0.72, 0.5);
  if (mossy && rng.next() > 0.45) {
    m.blob(x + rng.range(-0.2, 0.2) * s, y + s * 0.95, z + rng.range(-0.2, 0.2) * s,
      s * 0.55, PAL.rockMoss, rng.next, 0.35, 0.5);
  }
  if (s > 1.0) addCollider(x, z, s * 0.85);
}

/* --- built things --- */

function cottage(m, b) {
  const y = heightAt(b.x, b.z);
  const wall = rgb(b.wall ?? 0xf3e9d2), roofC = rgb(b.roof);
  const w = b.w, d = b.d, h = b.h, rot = b.rot ?? 0;
  // fieldstone footing
  m.box(b.x, y + 0.55, b.z, w + 0.5, 1.3, d + 0.5, PAL.stoneDk, rot);
  // plaster walls
  m.box(b.x, y + 1.1 + h / 2, b.z, w, h, d, wall, rot);
  // half-timbering: corner posts, a mid rail, and two braces per long wall
  // Beam thickness. Anything under ~0.3 lands on sub-pixel slivers at the
  // internal render resolution and draws stray dark lines.
  const t = 0.36;
  const co = Math.cos(rot), si = Math.sin(rot);
  const at = (lx, lz) => [b.x + lx * co - lz * si, b.z + lx * si + lz * co];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const [px, pz] = at(sx * (w / 2 - t / 2), sz * (d / 2 - t / 2));
    m.box(px, y + 1.1 + h / 2, pz, t * 1.4, h, t * 1.4, PAL.timber, rot);
  }
  for (const sz of [-1, 1]) {
    const [px, pz] = at(0, sz * (d / 2 + 0.02));
    m.box(px, y + 1.1 + h * 0.52, pz, w, t, t, PAL.timber, rot);
    m.box(px, y + 1.1 + h * 0.5, pz, t, h, t, PAL.timber, rot);
  }
  for (const sx of [-1, 1]) {
    const [px, pz] = at(sx * (w / 2 + 0.02), 0);
    m.box(px, y + 1.1 + h * 0.52, pz, t, t, d, PAL.timber, rot);
  }
  // roof + chimney
  m.gable(b.x, y + 1.1 + h, b.z, w, d, h * 0.85, roofC, 0.8);
  const [chx, chz] = at(w * 0.3, -d * 0.2);
  m.box(chx, y + 1.1 + h + h * 0.6, chz, 1.1, h * 1.3, 1.1, PAL.stoneDk, rot);
  // door and warm windows on the +Z face
  const [dx, dz] = at(0, d / 2 + 0.08);
  m.box(dx, y + 2.5, dz, 1.9, 2.8, 0.16, rgb(0x6b421f), rot);
  m.box(dx, y + 2.5, dz + 0.02, 1.5, 2.4, 0.2, rgb(0x8a5a2b), rot);
  for (const sx of [-1, 1]) {
    const [wx, wz] = at(sx * w * 0.3, d / 2 + 0.08);
    m.box(wx, y + 1.1 + h * 0.72, wz, 1.4, 1.3, 0.16, PAL.glow, rot);
    m.box(wx, y + 1.1 + h * 0.72, wz + 0.06, 0.16, 1.3, 0.2, PAL.timber, rot);
    // flower box under the sill
    m.box(wx, y + 1.1 + h * 0.72 - 0.85, wz + 0.12, 1.5, 0.4, 0.45, PAL.timber, rot);
    m.blob(wx, y + 1.1 + h * 0.72 - 0.5, wz + 0.2, 0.42,
      FLOWERS[Math.abs(b.x | 0) % FLOWERS.length], Math.random, 0.6, 0.5);
  }
  addCollider(b.x, b.z, Math.max(w, d) * 0.66);
}

function signpost(m, spot) {
  const y = heightAt(spot.x, spot.z);
  m.cyl(spot.x, y - 0.2, spot.z, 0.3, 0.28, 2.4, 5, PAL.timber);
  const by = y + 2.9;
  m.box(spot.x, by, spot.z, 3.2, 1.7, 0.3, PAL.timber, spot.face);
  m.box(spot.x, by, spot.z, 2.7, 1.2, 0.38, rgb(0xdcc38d), spot.face);
  m.box(spot.x, by + 0.9, spot.z, 3.5, 0.22, 0.42, shade(PAL.timber, 0.85), spot.face);
  signPosts.push({ id: spot.id, zone: spot.zone, x: spot.x, y, z: spot.z });
  addCollider(spot.x, spot.z, 0.75);
}

function ruinColumn(m, r, rng) {
  const y = heightAt(r.x, r.z);
  m.box(r.x, y + 0.05, r.z, 3.0, 0.7, 3.0, PAL.stoneDk);
  m.box(r.x, y + 0.55, r.z, 2.4, 0.5, 2.4, PAL.stone);
  // fluted shaft: a stack of drums, each slightly rotated
  const drums = Math.max(2, Math.round(r.h / 1.6));
  for (let i = 0; i < drums; i++) {
    const dy = y + 0.8 + i * (r.h / drums);
    m.cyl(r.x, dy, r.z, 0.95 - i * 0.03, 0.92 - i * 0.03, r.h / drums, 8,
      tintc(i % 2 ? PAL.stone : shade(PAL.stone, 0.95), rng.next, 0.1), i * 0.2);
  }
  if (r.h > 7) {
    m.box(r.x, y + 0.9 + r.h, r.z, 2.7, 0.7, 2.7, PAL.stone);
    m.box(r.x, y + 1.5 + r.h, r.z, 2.2, 0.5, 2.2, PAL.stoneDk);
  }
  if (rng.next() > 0.5) m.blob(r.x + rng.range(-1.2, 1.2), y + 0.35, r.z + rng.range(-1.2, 1.2),
    0.7, PAL.stoneMoss, rng.next, 0.4, 0.5);
  addCollider(r.x, r.z, 1.15);
}

/** Free-standing stone arch — the ruins' landmark, straight off the concept art. */
function stoneArch(m, cx, cz, rot, rng) {
  const y = heightAt(cx, cz);
  const span = 9, ph = 9;
  for (const s of [-1, 1]) {
    const px = cx + Math.cos(rot) * (span / 2) * s;
    const pz = cz + Math.sin(rot) * (span / 2) * s;
    m.box(px, y + 0.4, pz, 3.4, 0.9, 2.6, PAL.stoneDk, rot);
    for (let i = 0; i < 5; i++) {
      m.box(px, y + 1.2 + i * (ph / 5), pz, 2.6, ph / 5 - 0.08, 2.2,
        tintc(i % 2 ? PAL.stone : shade(PAL.stone, 0.94), rng.next, 0.1), rot);
    }
    addCollider(px, pz, 1.5);
  }
  // voussoirs sweeping over the gap
  const N = 9;
  for (let i = 0; i <= N; i++) {
    const a = Math.PI * (i / N);
    const ox = Math.cos(a) * (span / 2), oy = Math.sin(a) * 3.2;
    m.box(cx + Math.cos(rot) * ox, y + 1.2 + ph + oy, cz + Math.sin(rot) * ox,
      1.5, 1.3, 2.2, tintc(PAL.stone, rng.next, 0.12), rot);
  }
}

/** Wide stone stair climbing a slope, following a direction. */
function stairs(m, x0, z0, x1, z1, width, steps, rng) {
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = lerp(x0, x1, t), z = lerp(z0, z1, t);
    const y = heightAt(x, z);
    const rot = Math.atan2(z1 - z0, x1 - x0);
    m.box(x, y - 0.25, z, 2.0, 0.9 + 0.05 * i, width,
      tintc(i % 2 ? PAL.stone : PAL.stoneDk, rng.next, 0.1), rot);
    if (i % 3 === 0) {
      for (const s of [-1, 1]) {
        m.blob(x + Math.sin(rot) * (width / 2) * s, y + 0.2, z - Math.cos(rot) * (width / 2) * s,
          0.7, PAL.stoneMoss, rng.next, 0.5, 0.5);
      }
    }
  }
}

/* --- waterfall set-piece --- */

let waterfallMesh = null;

/** The rock face the water falls off. Terrain here is a gentle slope, so the
 *  cliff is built rather than sculpted — stacked ledges reading as a rock wall. */
function waterfallCliff(m, rng) {
  const W = WATERFALL;
  const baseY = heightAt(W.x, W.z);
  // Irregular stacked boulders read as a rock face; a solid box reads as a wall.
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const y = baseY + t * W.cliffH;
    for (let s = -1; s <= 1; s += 2) {
      const off = (W.w + 5.5) * s + s * (1 - t) * 3.2;
      for (let k = 0; k < 3; k++) {
        boulderNoCollide(m, W.x + off + rng.range(-2.4, 2.4), y + rng.range(-0.8, 0.8),
          W.z - t * 1.4 + rng.range(-2.2, 1.6), rng.range(1.6, 3.0),
          mixc(PAL.rock, PAL.rockDark, 0.15 + t * 0.4), rng);
      }
    }
    // back wall behind the sheet
    for (let k = 0; k < 2; k++) {
      boulderNoCollide(m, W.x + rng.range(-3.4, 3.4), y + rng.range(-0.6, 0.6),
        W.z - 3.4 + rng.range(-1.5, 0.6), rng.range(2.0, 3.4),
        mixc(PAL.rock, PAL.rockDark, 0.55), rng);
    }
  }
  for (let i = 0; i < 14; i++) {
    const a = rng.range(0, TAU), d = rng.range(5, 13);
    const x = W.x + Math.cos(a) * d, z = W.z + Math.sin(a) * d;
    boulder(m, x, heightAt(x, z), z, rng.range(0.8, 2.2), rng, true);
  }
  // mossy ledges catch the light at the lip
  for (let i = 0; i < 8; i++) {
    m.blob(W.x + rng.range(-9, 9), baseY + W.cliffH - rng.range(0, 3), W.z + rng.range(-2, 1),
      rng.range(0.8, 1.7), PAL.stoneMoss, rng.next, 0.45, 0.5);
  }
  addCollider(W.x, W.z - 1.5, 4.5);
}

function buildWaterfall() {
  const m = new Mesher();
  const W = WATERFALL;
  const top = heightAt(W.x, W.z) + W.cliffH;
  const bot = heightAt(W.x, W.z + W.lean) + 0.2;
  const w = W.w;
  const rng = makeRng(WORLD_SEED + 91);
  // Vertical ribbons, each its own width and shade — that reads as falling water.
  // One wide sheet just reads as a pale wall.
  const RIBBONS = 5, BANDS = 8;
  for (let r = 0; r < RIBBONS; r++) {
    const cx = W.x + (r - (RIBBONS - 1) / 2) * (w * 0.42);
    const half = w * 0.24 * rng.range(0.75, 1.15);
    const bright = rng.range(0.15, 0.55);
    const zJit = rng.range(-0.35, 0.35);
    for (let i = 0; i < BANDS; i++) {
      const t0 = i / BANDS, t1 = (i + 1) / BANDS;
      const y0 = lerp(top, bot, t0), y1 = lerp(top, bot, t1);
      const s0 = half * (1 + t0 * 0.45), s1 = half * (1 + t1 * 0.45);
      const c = mixc(mixc(PAL.river, PAL.foam, bright), PAL.foam, t0 * 0.75);
      m.quad(
        [cx - s0, y0, W.z + t0 * W.lean + zJit], [cx + s0, y0, W.z + t0 * W.lean + zJit],
        [cx + s1, y1, W.z + t1 * W.lean + zJit], [cx - s1, y1, W.z + t1 * W.lean + zJit], c);
    }
  }
  // foam at the lip and spray at the base
  for (let i = 0; i < 16; i++) {
    const a = rng.range(0, TAU), d = rng.range(0, w * 1.1);
    m.blob(W.x + Math.cos(a) * d, bot + rng.range(-0.2, 1.0),
      W.z + W.lean + Math.sin(a) * d * 0.6, rng.range(0.7, 1.7),
      shade(PAL.foam, rng.range(0.85, 1.0)), rng.next, 0.55, 0.6);
  }
  for (let i = 0; i < 8; i++) {
    m.blob(W.x + rng.range(-w, w), top - 0.2, W.z + rng.range(-1, 1), rng.range(0.5, 1.1),
      PAL.foam, rng.next, 0.5, 0.6);
  }
  const geo = m.build();
  // Unlit on purpose: falling water should read bright against the shaded rock,
  // and Lambert would put the whole sheet in the cliff's shadow.
  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.92,
  });
  const mesh = new THREE.Mesh(geo, mat);
  const basePos = geo.attributes.position.array.slice();
  mesh.userData.animate = (t) => {
    const p = geo.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) {
      const y = basePos[i + 1];
      p[i] = basePos[i] + Math.sin(y * 0.7 + t * 6) * 0.18;
      p[i + 2] = basePos[i + 2] + Math.cos(y * 0.9 + t * 5) * 0.14;
    }
    geo.attributes.position.needsUpdate = true;
  };
  return mesh;
}

/* --- scatter --- */

function scatter(rng, zone, count, minGap, opts = {}) {
  const out = [], tries = count * 26;
  const placed = [];
  for (let t = 0; t < tries && out.length < count; t++) {
    const a = rng.range(0, TAU), rr = Math.sqrt(rng.next()) * (opts.radius ?? zone.r ?? 38);
    const x = zone.x + Math.cos(a) * rr, z = zone.z + Math.sin(a) * rr;
    const h = heightAt(x, z);
    if (h < WATER_Y + (opts.minH ?? 1.6)) continue;
    if (h > (opts.maxH ?? 24)) continue;
    if (slopeAt(x, z) > (opts.maxSlope ?? 1.1)) continue;
    if (pathDist(x, z) < (opts.pathGap ?? 2.6)) continue;
    if (Math.hypot(x - HUB.x, z - HUB.z) < (opts.hubGap ?? 0)) continue;
    let ok = true;
    for (const p of placed) if (Math.hypot(x - p[0], z - p[1]) < minGap) { ok = false; break; }
    if (!ok) continue;
    placed.push([x, z]);
    out.push({ x, z, y: h });
  }
  return out;
}

function buildProps() {
  const m = new Mesher();
  const rng = makeRng(WORLD_SEED + 7);

  for (const zone of ZONES) {
    const rec = SCATTER[zone.id];
    if (!rec) continue;
    const hubGap = zone.id === 'hub' ? 21 : 0;
    // canopy: a dominant species plus a secondary one for variety
    const kinds = rec.kinds ?? [rec.kind];
    for (const p of scatter(rng, zone, rec.trees, 5.2, { hubGap })) {
      const kind = kinds[Math.floor(rng.next() * kinds.length)];
      (TREE_FN[kind] ?? broadleaf)(m, p.x, p.y - 0.2, p.z, rng.range(0.75, 1.4), rng);
    }
    for (const p of scatter(rng, zone, rec.bushes ?? 0, 2.4, { hubGap: hubGap * 0.6, pathGap: 1.6 }))
      bush(m, p.x, p.y - 0.1, p.z, rng.range(0.7, 1.5), rng);
    for (const p of scatter(rng, zone, rec.rocks, 3.4, { maxSlope: 1.9, hubGap }))
      boulder(m, p.x, p.y, p.z, rng.range(0.5, 2.1), rng, zone.id !== 'science');
    for (const p of scatter(rng, zone, rec.flowers, 1.5, { pathGap: 0.6, hubGap: hubGap * 0.4 })) {
      const c = FLOWERS[Math.floor(rng.next() * FLOWERS.length)];
      m.cross(p.x, p.y - 0.05, p.z, 0.5, 0.55, shade(LEAF.bush[0], 1.1), rng.range(0, TAU));
      m.blob(p.x, p.y + 0.55, p.z, 0.26, c, rng.next, 0.7, 0.5);
    }
    // ground cover everywhere, thin — this is what sells "lush" more than trees do
    for (const p of scatter(rng, zone, rec.tufts ?? 0, 1.1, { pathGap: 0.4, hubGap: hubGap * 0.35 })) {
      m.cross(p.x, p.y - 0.1, p.z, rng.range(0.6, 1.1), rng.range(0.5, 1.0),
        tintc(mixc(LEAF.bush[0], LEAF.bush[1], rng.next()), rng.next, 0.2), rng.range(0, TAU));
    }
  }

  // tall grass: dense, darker, obviously different from ordinary ground cover
  for (const g of GRASS_PATCHES) {
    const n = Math.round(g.r * g.r * 0.8);
    for (let i = 0; i < n; i++) {
      const a = rng.range(0, TAU), rr = Math.sqrt(rng.next()) * g.r;
      const x = g.x + Math.cos(a) * rr, z = g.z + Math.sin(a) * rr;
      const y = heightAt(x, z);
      if (y < WATER_Y + 1.2) continue;
      m.cross(x, y - 0.12, z, rng.range(0.9, 1.5), rng.range(1.3, 2.2),
        tintc(shade(LEAF.pine[0], 1.05), rng.next, 0.22), rng.range(0, TAU), 0.2);
    }
  }

  // pebbles lining the roads
  for (let i = 0; i < 320; i++) {
    const a = rng.range(0, TAU), d = rng.range(10, 108);
    const x = Math.cos(a) * d, z = Math.sin(a) * d;
    const pd = pathDist(x, z);
    if (pd < 0.1 || pd > 1.8) continue;
    const y = heightAt(x, z);
    if (y < WATER_Y + 1.4) continue;
    m.blob(x, y + 0.05, z, rng.range(0.2, 0.45), tintc(PAL.stoneDk, rng.next, 0.2), rng.next, 0.45, 0.5);
  }

  for (const b of BUILDINGS) cottage(m, b);
  for (const r of RUINS) ruinColumn(m, r, rng);
  for (const s of SIGN_SPOTS) signpost(m, s);

  stoneArch(m, 46, 60, 0.3, rng);
  stairs(m, 31, 45, 40, 54, 7, 9, rng);
  stairs(m, 63, -8, 69, -16, 5, 7, rng);
  waterfallCliff(m, rng);

  // reeds around the waterfall pool
  for (let i = 0; i < 40; i++) {
    const a = rng.range(0, TAU), d = rng.range(3, 11);
    const x = WATERFALL.x + Math.cos(a) * d, z = WATERFALL.z + WATERFALL.lean + Math.sin(a) * d;
    const y = heightAt(x, z);
    if (y < WATER_Y + 0.4 || y > WATERFALL.poolY + 3) continue;
    m.cross(x, y - 0.1, z, 0.5, rng.range(1.2, 2.2), shade(LEAF.oak[0], 1.15), rng.range(0, TAU), 0.15);
  }

  return m.build();
}

/* ============================ water, sky, distance ============================ */

function buildWater() {
  const g = new THREE.PlaneGeometry(700, 700, 30, 30);
  g.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshLambertMaterial({
    color: 0x2f86cc, flatShading: true, transparent: true, opacity: 0.9,
  });
  const mesh = new THREE.Mesh(g, mat);
  mesh.position.y = WATER_Y;
  mesh.renderOrder = 1;
  const base = g.attributes.position.array.slice();
  mesh.userData.animate = (t) => {
    const p = g.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) {
      p[i + 1] = Math.sin(base[i] * 0.05 + t * 1.3) * 0.3 + Math.cos(base[i + 2] * 0.07 + t * 0.9) * 0.24;
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
  };
  return mesh;
}

function buildSky() {
  const g = new THREE.SphereGeometry(600, 20, 14);
  const pos = g.attributes.position;
  const col = [];
  for (let i = 0; i < pos.count; i++) {
    const t = clamp01((pos.getY(i) / 600) * 1.15 + 0.12);
    const c = t > 0.4 ? mixc(PAL.sky, PAL.skyTop, (t - 0.4) / 0.6) : mixc(PAL.horizon, PAL.sky, t / 0.4);
    col.push(c[0], c[1], c[2]);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({
    vertexColors: true, side: THREE.BackSide, fog: false,
  }));
}

function buildClouds() {
  const m = new Mesher();
  const rng = makeRng(WORLD_SEED + 33);
  for (let i = 0; i < 22; i++) {
    const a = rng.range(0, TAU), d = rng.range(90, 330);
    const x = Math.cos(a) * d, z = Math.sin(a) * d, y = rng.range(58, 110);
    const puffs = rng.int(3, 6), s = rng.range(7, 15);
    for (let p = 0; p < puffs; p++) {
      m.blob(x + rng.range(-1.4, 1.4) * s, y + rng.range(-0.25, 0.25) * s,
        z + rng.range(-0.7, 0.7) * s, s * rng.range(0.55, 1.0),
        mixc(PAL.cloud, PAL.cloudDk, rng.range(0, 0.45)), rng.next, 0.55, 0.4);
    }
  }
  return new THREE.Mesh(m.build(), new THREE.MeshBasicMaterial({
    vertexColors: true, fog: false, side: THREE.DoubleSide,
  }));
}

/** Hazy peaks past the horizon — cheap, and they give the ocean a far shore. */
function buildDistance() {
  const m = new Mesher();
  const rng = makeRng(WORLD_SEED + 55);
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * TAU + rng.range(-0.08, 0.08);
    const d = rng.range(255, 340);
    const x = Math.cos(a) * d, z = Math.sin(a) * d;
    const h = rng.range(20, 58);
    // biased hard toward the horizon colour so they read as haze, not scenery
    m.cone(x, -6, z, rng.range(30, 62), h, 5,
      tintc(mixc(PAL.peak, PAL.horizon, rng.range(0.45, 0.8)), rng.next, 0.08), rng.range(0, TAU));
  }
  return new THREE.Mesh(m.build(), new THREE.MeshLambertMaterial({
    vertexColors: true, flatShading: true,
  }));
}

/* ============================ assembly ============================ */

export function buildWorld(scene) {
  scene.background = new THREE.Color(0xd3e8f7);
  scene.fog = new THREE.Fog(0xd3e8f7, 46, 250);

  // Warm key, cool fill, soft sky bounce. Lit total stays near 1.0 because
  // there's no tone mapping — brighter than that and the vertex colours wash out.
  const sun = new THREE.DirectionalLight(0xfff0cf, 0.88);
  sun.position.set(60, 90, 40);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xc6dcff, 0.3);
  fill.position.set(-60, 34, -70);
  scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xbcdcff, 0x93916a, 0.36));

  const land = new THREE.Mesh(buildTerrain(),
    new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
  scene.add(land);

  const props = new THREE.Mesh(buildProps(), new THREE.MeshLambertMaterial({
    vertexColors: true, flatShading: true, side: THREE.DoubleSide,
  }));
  scene.add(props);

  const water = buildWater();
  scene.add(water);
  waterfallMesh = buildWaterfall();
  scene.add(waterfallMesh);
  scene.add(buildDistance());
  scene.add(buildClouds());
  scene.add(buildSky());

  const tris = (land.geometry.attributes.position.count + props.geometry.attributes.position.count) / 3;
  return {
    land, props, water, tris,
    update(t) { water.userData.animate(t); waterfallMesh.userData.animate(t); },
  };
}

/* ============================ movement queries ============================ */

export function terrainOk(x, z, fromY) {
  const h = heightAt(x, z);
  return h >= WATER_Y + 0.25 && Math.abs(h - fromY) <= 1.6 && slopeAt(x, z) <= 1.6;
}

function pushOut(p) {
  for (let iter = 0; iter < 3; iter++) {
    let moved = false;
    for (const c of colliders) {
      const dx = p.x - c.x, dz = p.z - c.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < c.r * c.r) {
        const d = Math.sqrt(d2) || 1e-4;
        const k = (c.r - d) / d + 1e-3;
        p.x += dx * k; p.z += dz * k;
        moved = true;
      }
    }
    if (!moved) break;
  }
  return p;
}

const _try = { x: 0, z: 0 };
// Angles to try when the straight line is blocked, in order. Sliding along a
// tangent is what keeps a dense forest walkable — without it you stop dead the
// moment two trunks line up, which reads as the scenery fighting you.
const SLIDE = [0, 0.4, -0.4, 0.9, -0.9, 1.4, -1.4];

/** Resolve a step, writing the accepted position into `out`. */
export function moveWithCollision(fromX, fromZ, toX, toZ, fromY, out) {
  const dx = toX - fromX, dz = toZ - fromZ;
  const len = Math.hypot(dx, dz);
  if (len > 1e-6) {
    const ang = Math.atan2(dx, dz);
    for (const off of SLIDE) {
      const a = ang + off;
      // full speed straight ahead, a little slower the further you have to veer
      const step = len * (off === 0 ? 1 : 0.85);
      _try.x = fromX + Math.sin(a) * step;
      _try.z = fromZ + Math.cos(a) * step;
      pushOut(_try);
      if (terrainOk(_try.x, _try.z, fromY)) { out.x = _try.x; out.z = _try.z; return true; }
    }
  }
  // last resort: single-axis, which handles sliding along a straight wall
  for (const [ax, az] of [[toX, fromZ], [fromX, toZ]]) {
    _try.x = ax; _try.z = az;
    pushOut(_try);
    if (terrainOk(_try.x, _try.z, fromY)) { out.x = _try.x; out.z = _try.z; return true; }
  }
  out.x = fromX; out.z = fromZ;
  return false;
}

/** How far the camera can sit behind the player before scenery gets in the way. */
export function cameraDistance(px, py, pz, dx, dz, maxDist) {
  const SAMPLES = 8, MIN = 8.5;
  for (let i = 3; i <= SAMPLES; i++) {
    const t = (i / SAMPLES) * maxDist;
    if (t < MIN) continue;
    const x = px + dx * t, z = pz + dz * t;
    let blocked = heightAt(x, z) > py + 3.4;
    if (!blocked) {
      for (const c of colliders) {
        // ignore whatever the player is already standing next to — otherwise a
        // single roadside tree yanks the camera into the back of their head
        if ((c.x - px) * (c.x - px) + (c.z - pz) * (c.z - pz) < 12) continue;
        const ex = c.r + 0.3;
        if ((x - c.x) * (x - c.x) + (z - c.z) * (z - c.z) < ex * ex) { blocked = true; break; }
      }
    }
    if (blocked) return Math.max(MIN, ((i - 1) / SAMPLES) * maxDist);
  }
  return maxDist;
}

export function canWalk(x, z, fromY) {
  if (!terrainOk(x, z, fromY)) return false;
  for (const c of colliders) {
    if ((x - c.x) * (x - c.x) + (z - c.z) * (z - c.z) < c.r * c.r) return false;
  }
  return true;
}
