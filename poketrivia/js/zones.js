// The island's authored layout: where the land rises, where each subject lives,
// which paths connect them, and what props to scatter. Pure data + tiny lookups.
// world.js turns this into geometry; nothing here imports three.

export const WATER_Y = 0.6;      // sea level
export const SHORE_R = 112;      // island falls to sea around here
export const SHORE_FADE = 30;    // how gradually it falls
export const WORLD_EXTENT = 138; // terrain mesh half-size

/** Gaussian bumps that shape the land. `flat:true` gives a plateau-style top. */
export const HILLS = [
  // Number Meadow — rolling and friendly
  { x:   0, z: -74, amp:  6.5, sig: 30 },
  { x: -18, z: -94, amp:  4.5, sig: 15 },
  { x:  20, z: -60, amp:  3.0, sig: 12 },
  // Ember Volcano — big cone with a crater punched out of the top
  { x:  72, z: -24, amp: 26.0, sig: 17 },
  { x:  72, z: -24, amp: -9.5, sig: 6.0 },
  { x:  50, z: -44, amp:  5.0, sig: 14 },
  // Ancient Ruins — flat-topped plateau
  { x:  46, z:  62, amp: 12.0, sig: 26, flat: true },
  // Word Grove — gentle forested rise
  { x: -46, z:  62, amp:  7.0, sig: 26 },
  { x: -30, z:  80, amp:  4.0, sig: 13 },
  // Sunny Shores — barely above the beach
  { x: -72, z: -24, amp:  2.2, sig: 24 },
  // Trivia Town — a soft mound so the town reads as the island's heart
  { x:   0, z:   0, amp:  3.2, sig: 22 },
  // scenery between zones
  { x: -14, z: -34, amp:  3.0, sig: 11 },
  { x:  28, z:  22, amp:  3.5, sig: 12 },
];

export const HUB = { id: 'hub', name: 'Trivia Town', subject: 'general', x: 0, z: 0, r: 26 };

// `grass` / `grass2` are the two tones the terrain mottles between, so no zone
// is ever one flat colour.
export const ZONES = [
  HUB,
  { id: 'math',    name: 'Number Meadow',  subject: 'math',    x:   0, z: -74, r: 40,
    grass: 0x7cc247, grass2: 0xa8d95e, accent: 0x5fae44, blurb: 'Wild numbers roam the tall grass.' },
  { id: 'science', name: 'Ember Volcano',  subject: 'science', x:  72, z: -24, r: 40,
    grass: 0x8f6f52, grass2: 0xb08a62, accent: 0x6d523c, blurb: 'Hot rocks, big questions.' },
  { id: 'history', name: 'Ancient Ruins',  subject: 'history', x:  46, z:  62, r: 40,
    grass: 0xb2a466, grass2: 0xd0c288, accent: 0x9a8657, blurb: 'The stones remember.' },
  { id: 'grammar', name: 'Word Grove',     subject: 'grammar', x: -46, z:  62, r: 40,
    grass: 0x3f8a3c, grass2: 0x66ad48, accent: 0x2f6b39, blurb: 'Every tree has something to say.' },
  { id: 'shores',  name: 'Sunny Shores',   subject: 'general', x: -72, z: -24, r: 40,
    grass: 0xcdba7c, grass2: 0xe4d59b, accent: 0xb5a169, blurb: 'Sun, sand, and stray facts.' },
];

HUB.grass = 0x6fb648; HUB.grass2 = 0x94cc5a; HUB.accent = 0x5b9440;
HUB.blurb = 'Home base. The Study Tent heals your team.';

export const ZONE_BY_ID = Object.fromEntries(ZONES.map(z => [z.id, z]));

/** Dirt roads from town out to each zone — drawn on the terrain so kids can see where to go. */
export const PATHS = ZONES.filter(z => z.id !== 'hub')
  .map(z => ({ ax: 0, az: 0, bx: z.x, bz: z.z, w: 3.6 }));

/** Nearest zone centre wins. Hub gets priority inside its radius. */
export function zoneAt(x, z) {
  const dh = Math.hypot(x - HUB.x, z - HUB.z);
  if (dh < HUB.r) return HUB;
  let best = HUB, bestD = Infinity;
  for (const zn of ZONES) {
    const d = Math.hypot(x - zn.x, z - zn.z);
    if (d < bestD) { bestD = d; best = zn; }
  }
  return best;
}

/** Distance from (x,z) to the nearest road, in world units. */
export function pathDist(x, z) {
  let best = Infinity;
  for (const p of PATHS) {
    const vx = p.bx - p.ax, vz = p.bz - p.az;
    const len2 = vx * vx + vz * vz;
    let t = ((x - p.ax) * vx + (z - p.az) * vz) / len2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const dx = x - (p.ax + vx * t), dz = z - (p.az + vz * t);
    const d = Math.hypot(dx, dz) - p.w;
    if (d < best) best = d;
  }
  return best;
}

/** Scatter recipes per zone. Density is what sells "lush" — the ground cover
 *  (`tufts`) matters more than the tree count. */
export const SCATTER = {
  hub:     { trees: 26,  bushes: 22, rocks: 8,  flowers: 60,  tufts: 190, kinds: ['oak', 'maple'] },
  math:    { trees: 58,  bushes: 40, rocks: 12, flowers: 130, tufts: 420, kinds: ['oak', 'maple'] },
  science: { trees: 16,  bushes: 8,  rocks: 74, flowers: 10,  tufts: 90,  kinds: ['dead', 'pine'] },
  history: { trees: 34,  bushes: 26, rocks: 40, flowers: 40,  tufts: 260, kinds: ['cypress', 'oak'] },
  grammar: { trees: 120, bushes: 62, rocks: 14, flowers: 70,  tufts: 430, kinds: ['pine', 'oak', 'maple'] },
  shores:  { trees: 40,  bushes: 20, rocks: 14, flowers: 34,  tufts: 200, kinds: ['palm', 'oak'] },
};

/** The waterfall set-piece: a built stone cliff with water pouring off it. */
export const WATERFALL = { x: 18, z: 70, w: 4.2, lean: 3.4, cliffH: 13 };

/** Tall-grass patches: rare Pokémon only spawn inside these. */
export const GRASS_PATCHES = [
  { zone: 'math',    x: -16, z: -70, r: 11 },
  { zone: 'math',    x:  18, z: -88, r:  9 },
  { zone: 'grammar', x: -54, z:  52, r: 11 },
  { zone: 'grammar', x: -34, z:  74, r:  9 },
  { zone: 'history', x:  36, z:  48, r: 10 },
  { zone: 'shores',  x: -62, z: -40, r: 10 },
  { zone: 'science', x:  56, z: -12, r:  9 },
  { zone: 'hub',     x:  14, z:  20, r:  8 },
];

export function inTallGrass(x, z) {
  for (const g of GRASS_PATCHES) {
    if (Math.hypot(x - g.x, z - g.z) < g.r) return g;
  }
  return null;
}

/** Town cottages — half-timbered, hand-placed so the hub feels built. */
export const BUILDINGS = [
  { x: -14, z:  -9, w: 11, d: 9, h: 5.5, rot:  0.10, roof: 0xc4462f, wall: 0xf3e9d2, label: 'Study Tent' },
  { x:  14, z: -10, w: 10, d: 8, h: 5.0, rot: -0.14, roof: 0x3767b8, wall: 0xefe2c6, label: 'Poké Mart' },
  { x: -16, z:  12, w:  9, d: 8, h: 4.8, rot: -0.22, roof: 0x4a8f43, wall: 0xf3e9d2 },
  { x:  16, z:  13, w:  9, d: 8, h: 4.8, rot:  0.26, roof: 0x8f5aab, wall: 0xefe2c6 },
  { x:  -2, z: -20, w:  8, d: 7, h: 4.4, rot:  0.05, roof: 0xc98a2e, wall: 0xf3e9d2 },
];

/** Ruined columns on the history plateau. */
export const RUINS = [
  { x: 40, z: 56, h: 9 }, { x: 52, z: 56, h: 7 }, { x: 40, z: 68, h: 6 },
  { x: 52, z: 68, h: 9 }, { x: 46, z: 50, h: 5 }, { x: 34, z: 62, h: 8 },
  { x: 58, z: 62, h: 6 }, { x: 46, z: 74, h: 7 },
];

/** Signposts. `fact` teaches; the linked question is authored in data/signs.js (M3). */
export const SIGN_SPOTS = [
  { id: 'town-welcome', zone: 'hub',     x:   4, z:  18, face: 0.3 },
  { id: 'math-1',       zone: 'math',    x:  -4, z: -46, face: 0 },
  { id: 'math-2',       zone: 'math',    x:  12, z: -80, face: 2.2 },
  { id: 'sci-1',        zone: 'science', x:  50, z: -18, face: -1.4 },
  { id: 'sci-2',        zone: 'science', x:  70, z: -38, face: 0.4 },
  { id: 'hist-1',       zone: 'history', x:  30, z:  40, face: 2.6 },
  { id: 'hist-2',       zone: 'history', x:  50, z:  70, face: 0.2 },
  { id: 'gram-1',       zone: 'grammar', x: -30, z:  42, face: 3.4 },
  { id: 'gram-2',       zone: 'grammar', x: -56, z:  66, face: 1.2 },
  { id: 'shore-1',      zone: 'shores',  x: -56, z: -18, face: -1.9 },
  { id: 'shore-2',      zone: 'shores',  x: -80, z: -38, face: 0.8 },
];

/** Placeholder spawn tables — real ones land in M3. dex ids are Gen 1. */
export const SPAWNS = {
  hub:     { open: [{ dex: 16, w: 4, lv: [2, 4] }, { dex: 19, w: 4, lv: [2, 4] }, { dex: 10, w: 3, lv: [2, 3] }],
             grass:[{ dex: 25, w: 1, lv: [4, 6] }] },
  math:    { open: [{ dex: 16, w: 3, lv: [3, 6] }, { dex: 43, w: 3, lv: [3, 6] }, { dex: 69, w: 2, lv: [4, 7] }],
             grass:[{ dex: 25, w: 2, lv: [6, 9] }, { dex: 133, w: 1, lv: [7, 10] }] },
  science: { open: [{ dex: 4, w: 2, lv: [7, 11] }, { dex: 74, w: 4, lv: [7, 11] }, { dex: 66, w: 3, lv: [7, 10] }],
             grass:[{ dex: 58, w: 2, lv: [10, 13] }, { dex: 126, w: 1, lv: [12, 15] }] },
  history: { open: [{ dex: 27, w: 3, lv: [6, 10] }, { dex: 50, w: 3, lv: [6, 9] }, { dex: 92, w: 2, lv: [8, 11] }],
             grass:[{ dex: 104, w: 2, lv: [9, 12] }, { dex: 138, w: 1, lv: [11, 14] }] },
  grammar: { open: [{ dex: 1, w: 2, lv: [5, 9] }, { dex: 46, w: 4, lv: [5, 8] }, { dex: 43, w: 3, lv: [5, 8] }],
             grass:[{ dex: 63, w: 2, lv: [8, 11] }, { dex: 123, w: 1, lv: [10, 13] }] },
  shores:  { open: [{ dex: 7, w: 2, lv: [4, 8] }, { dex: 129, w: 4, lv: [4, 7] }, { dex: 98, w: 3, lv: [4, 8] }],
             grass:[{ dex: 120, w: 2, lv: [7, 10] }, { dex: 131, w: 1, lv: [10, 14] }] },
};
