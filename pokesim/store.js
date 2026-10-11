// Battle Lab — saving Pokémon, syncing them between devices, and their pictures.
//
// Where things live:
//
//   lzPokesim|<side>|<id>   one small JSON record per Pokémon (name, types, stats, moves…).
//                           The "lz" prefix is what makes lz-sync carry it to every device,
//                           and one-record-each keeps every value comfortably under the size a
//                           synced value can be. Never a single big "team" blob.
//   pokesimImg|<imgId>      the picture, as a downscaled data URL. Deliberately NOT "lz"-prefixed:
//                           pictures are far too big for the key/value sync, so they stay local…
//   docs sheet "pimg-<id>"  …and are copied to the same chunked reading store the article pages
//                           use, which is how the other kid's device gets them.

import * as party from '../poketrivia/js/party.js';
import { clamp, normalizeCustomMove, STAT_KEYS } from './stats.js';

export const SIDES = [
  { id: 'ryland', name: 'Ryland', color: '#3b63e8', soft: '#e8edff' },
  { id: 'reid', name: 'Reid', color: '#3d7f45', soft: '#e6f3e8' },
];
export const sideById = (id) => SIDES.find(s => s.id === id);

const PREFIX = 'lzPokesim|';
export const monKey = (side, id) => `${PREFIX}${side}|${id}`;
export const imgKey = (imgId) => `pokesimImg|${imgId}`;
const IMG_PENDING = (imgId) => `pokesimImgPending|${imgId}`;

const ls = () => globalThis.localStorage;

/* ------------------------------------------------------------------ team names */

// One tiny synced key per side. Optional: with none set, a side is just "Ryland's team".
export const TEAM_NAME_MAX = 24;
const teamKey = (side) => `lzPokesimTeam|${side}`;

export function getTeamName(sideId) {
  return (ls().getItem(teamKey(sideId)) || '').slice(0, TEAM_NAME_MAX);
}
export function setTeamName(sideId, name) {
  const clean = String(name ?? '').replace(/\s+/g, ' ').trim().slice(0, TEAM_NAME_MAX);
  if (clean) ls().setItem(teamKey(sideId), clean); else ls().removeItem(teamKey(sideId));
  return clean;
}
/** What to call a side: their chosen team name, or "<Kid>'s team". */
export function teamLabel(side) {
  return getTeamName(side.id) || `${side.name}’s team`;
}

/* ------------------------------------------------------------------ identity */

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * The engine looks a species up by number, but a Pokémon here is identified by a string id
 * that has to come out the SAME on every device. So the number is a hash of the id, kept well
 * above the real dex (1–151) so the two can never collide.
 */
export function dexIdFor(id) {
  let h = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return 100000 + (h % 900000000);
}

/* ------------------------------------------------------------------ the record */

/** In-memory shape → the compact JSON that is stored and synced. */
export function toRecord(mon) {
  const rec = {
    v: 1,
    n: mon.name,
    t: mon.types,
    l: mon.level,
    s: STAT_KEYS.map(k => mon.stats[k]),
    c: mon.created,
    m: mon.moves.map(m => m.custom
      ? { n: m.custom.label, t: m.custom.type, k: m.custom.cls === 'special' ? 's' : 'p', p: m.custom.power, a: m.custom.acc }
      : m.real),
  };
  if (mon.nature && mon.nature !== 'serious') rec.nt = mon.nature;
  if (mon.ability && mon.ability !== 'none') rec.ab = mon.ability;
  if (mon.item && mon.item !== 'none') rec.it = mon.item;
  if (mon.legendary) rec.lg = 1;
  if (mon.img) rec.im = mon.img;
  return JSON.stringify(rec);
}

export function fromRecord(side, id, text, validTypes) {
  let r;
  try { r = JSON.parse(text); } catch { return null; }
  if (!r || r.v !== 1 || !Array.isArray(r.s) || r.s.length !== 6) return null;
  const types = (r.t || []).filter(t => validTypes.includes(t)).slice(0, 2);
  if (!types.length) return null;
  const stats = {};
  STAT_KEYS.forEach((k, i) => { stats[k] = clamp(Math.round(Number(r.s[i]) || 1), 1, 255); });
  const moves = (r.m || []).slice(0, 4).map(m => typeof m === 'string'
    ? { real: m }
    : { custom: normalizeCustomMove({ label: m.n, type: m.t, cls: m.k === 's' ? 'special' : 'physical', power: m.p, acc: m.a }, validTypes) });
  return {
    id, side,
    name: String(r.n ?? '').slice(0, 20) || 'Unnamed',
    types,
    level: clamp(Math.round(Number(r.l) || 50), 1, 100),
    stats,
    nature: r.nt || 'serious',
    ability: r.ab || 'none',
    item: r.it || 'none',
    legendary: !!r.lg,
    img: r.im || '',
    created: Number(r.c) || 0,
    moves,
  };
}

/* ------------------------------------------------------------------ the team */

export function listTeam(side, validTypes) {
  const out = [];
  const store = ls();
  const pre = `${PREFIX}${side}|`;
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (!k || k.indexOf(pre) !== 0) continue;
    const mon = fromRecord(side, k.slice(pre.length), store.getItem(k), validTypes);
    if (mon) out.push(mon);
  }
  return out.sort((a, b) => a.created - b.created || a.id.localeCompare(b.id));
}

/** A cheap fingerprint of everything stored, so the page can tell when sync changed something. */
export function signature() {
  const store = ls();
  const parts = [];
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k && (k.indexOf(PREFIX) === 0 || k.indexOf('lzPokesimTeam|') === 0)) parts.push(k + '=' + store.getItem(k));
  }
  parts.sort();
  let h = 0;
  const s = parts.join('\n');
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return parts.length + ':' + h;
}

export function saveMon(mon) {
  const text = toRecord(mon);
  ls().setItem(monKey(mon.side, mon.id), text);
  return text.length;
}

export function deleteMon(mon) {
  ls().removeItem(monKey(mon.side, mon.id));
  if (mon.img) ls().removeItem(imgKey(mon.img));
}

/* -------------------------------------------------------- readying the engine */

/**
 * The battle engine looks Pokémon and moves up in shared tables, so an invented one has to be
 * put in them first. Safe to call again — it just overwrites with the current version.
 * Returns what the engine needs: the dex number and the list of move keys.
 */
export function prepareForBattle(mon) {
  const dex = dexIdFor(mon.id);
  party.registerSpecies({
    id: dex, name: mon.name, types: mon.types, stats: { ...mon.stats },
    genus: 'Made-up Pokémon', custom: true,
  });
  const MOVES = (globalThis.window ?? globalThis).PL_MOVES;
  const moveKeys = mon.moves.map((m, i) => {
    if (m.real) return m.real;
    const key = `custom-${mon.id}-${i}`;
    const c = m.custom;
    MOVES[key] = {
      name: key, label: c.label, type: c.type, power: c.power, acc: c.acc, class: c.cls, pp: c.pp,
      prio: 0, target: 'selected-pokemon', cat: 'damage', ailment: null, ailChance: 0, stats: [],
      statChance: 0, drain: 0, heal: 0, flinch: 0, critRate: 0, hits: null, turns: null,
      short: 'An invented move — plain damage with no extra effect.', invented: true,
    };
    return key;
  });
  return { dex, moveKeys };
}

/* ------------------------------------------------------------------ pictures */

export const MAX_IMG_CHARS = 36000;      // the sheet's reading store holds 45,000 per document
const IMG_OK = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
export const isImageData = (s) => typeof s === 'string' && s.length <= MAX_IMG_CHARS + 2000 && IMG_OK.test(s);

export const getLocalImage = (imgId) => (imgId ? ls().getItem(imgKey(imgId)) : null);
export function setLocalImage(imgId, dataUrl) {
  if (isImageData(dataUrl)) { ls().setItem(imgKey(imgId), dataUrl); return true; }
  return false;
}

/**
 * Shrink a chosen file to something that can be stored and synced. Tries progressively smaller
 * sizes until it fits. A picture with transparent areas is kept as PNG so the background stays
 * see-through (a cut-out creature on JPEG would get a white box); anything else becomes JPEG,
 * which is a fraction of the size. Browser only.
 */
export async function processImageFile(file) {
  const bmp = await loadBitmap(file);
  const probe = document.createElement('canvas');
  probe.width = probe.height = 48;
  const pc = probe.getContext('2d', { willReadFrequently: true });
  pc.drawImage(bmp, 0, 0, 48, 48);
  const px = pc.getImageData(0, 0, 48, 48).data;
  let transparent = false;
  for (let i = 3; i < px.length; i += 4) if (px[i] < 250) { transparent = true; break; }

  for (const size of [192, 160, 128, 112, 96, 80]) {
    const k = Math.min(1, size / Math.max(bmp.width, bmp.height));
    const w = Math.max(1, Math.round(bmp.width * k)), h = Math.max(1, Math.round(bmp.height * k));
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    if (!transparent) { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); }
    g.drawImage(bmp, 0, 0, w, h);
    const url = transparent ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.82);
    if (url.length <= MAX_IMG_CHARS && isImageData(url)) return url;
  }
  throw new Error('That picture is too detailed to shrink down. Try a simpler one.');
}

async function loadBitmap(file) {
  if (globalThis.createImageBitmap) {
    try { return await createImageBitmap(file); } catch { /* fall through to <img> */ }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file isn’t a picture I can read.')); };
    img.src = url;
  });
}

/* ------------------------------------------------------------ picture syncing */

const endpoint = () => globalThis.LZSYNC?.url || '';
let nonce = 0;
async function api(params) {
  const url = endpoint() + '?' + params + '&_=' + Date.now() + '.' + (++nonce);
  const r = await fetch(url, { method: 'GET', cache: 'no-store' });
  return r.json();
}
const docId = (imgId) => 'pimg-' + imgId;
const CHUNK = 1200;

/**
 * Copy a picture up to the shared store. A URL can't carry a whole picture, so it goes up in
 * numbered pieces; piece 0 starts the document afresh and the rest append.
 *
 * If ANY piece fails the whole upload starts again from piece 0 rather than retrying that piece.
 * A piece the server received but whose reply got lost would otherwise be appended twice and
 * corrupt the picture, and there is no way to tell the two cases apart from this side.
 */
export async function uploadImage(imgId, dataUrl, title = '') {
  if (!endpoint() || !isImageData(dataUrl)) return false;
  ls().setItem(IMG_PENDING(imgId), '1');
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      let sent = 0, seq = 0;
      while (sent < dataUrl.length) {
        const piece = dataUrl.slice(sent, sent + CHUNK);
        const res = await api(`action=docput&id=${encodeURIComponent(docId(imgId))}&seq=${seq}` +
          `&chunk=${encodeURIComponent(piece)}` + (seq === 0 ? `&title=${encodeURIComponent(title)}` : ''));
        if (!res?.ok || res.length !== sent + piece.length) throw new Error('piece ' + seq + ' not accepted');
        sent += piece.length; seq++;
      }
      ls().removeItem(IMG_PENDING(imgId));
      return true;
    } catch {
      await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  return false;                 // left pending — resumeUploads() tries again on the next visit
}

/** Anything that never finished uploading last time is retried. */
export function resumeUploads(mons) {
  for (const m of mons) {
    if (m.img && ls().getItem(IMG_PENDING(m.img))) {
      const data = getLocalImage(m.img);
      if (data) uploadImage(m.img, data, m.name);
    }
  }
}

/** Fetch a picture another device uploaded. Returns the data URL or null. */
export async function downloadImage(imgId) {
  if (!endpoint() || !imgId) return null;
  try {
    const res = await api(`action=doc&id=${encodeURIComponent(docId(imgId))}`);
    if (res?.ok && isImageData(res.body)) { setLocalImage(imgId, res.body); return res.body; }
  } catch { /* not there yet */ }
  return null;
}
