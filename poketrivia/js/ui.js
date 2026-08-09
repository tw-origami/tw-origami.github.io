// All the DOM chrome: zone banner, dialog box, compass, party tray, action prompt.
// Kept deliberately dumb — it renders what it's told and reports clicks back.

import { clamp } from './rng.js';

const $ = (id) => document.getElementById(id);

const el = {
  hud: $('hud'), zoneChip: $('zoneChip'), zoneName: $('zoneName'),
  banner: $('banner'), bannerText: $('bannerText'),
  dialog: $('dialog'), dialogText: $('dialogText'), dialogWho: $('dialogWho'),
  balls: $('balls'), badges: $('badges'), prompt: $('prompt'), promptText: $('promptText'),
  rose: $('cRose'), blips: $('cBlips'), debug: $('debug'),
};

/* ---------------- zone banner ---------------- */

let shownZone = null;
export function setZone(zone) {
  if (!zone || zone.id === shownZone) return;
  shownZone = zone.id;
  el.zoneName.textContent = zone.name;
  el.bannerText.textContent = zone.name;
  el.banner.classList.remove('hidden');
  // restart the CSS animation
  el.banner.style.animation = 'none';
  void el.banner.offsetWidth;
  el.banner.style.animation = '';
  clearTimeout(setZone._t);
  setZone._t = setTimeout(() => el.banner.classList.add('hidden'), 2600);
}

export function showHud(on = true) { el.hud.classList.toggle('hidden', !on); }

/** A one-off message in the big banner slot (badge unlocks, milestones). */
export function showBanner(text, ms = 3200) {
  el.bannerText.textContent = text;
  el.banner.classList.remove('hidden');
  el.banner.style.animation = 'none';
  void el.banner.offsetWidth;
  el.banner.style.animation = '';
  clearTimeout(showBanner._t);
  showBanner._t = setTimeout(() => el.banner.classList.add('hidden'), ms);
}

const BADGE_ICON = { math: '🔢', science: '🔥', history: '🏛️', grammar: '📖', shores: '☀️', champion: '👑' };
export function setBadges(badges) {
  el.badges.innerHTML = '';
  for (const b of badges) {
    const s = document.createElement('span');
    s.className = 'badge';
    s.textContent = BADGE_ICON[b] ?? '🏅';
    el.badges.appendChild(s);
  }
}

/* ---------------- dialog box ---------------- */

let typing = null;
let onDone = null;

export const dialogOpen = () => !el.dialog.classList.contains('hidden');

export function showDialog(text, who = null, done = null) {
  el.dialog.classList.remove('hidden');
  el.dialogWho.classList.toggle('hidden', !who);
  if (who) el.dialogWho.textContent = who;
  onDone = done;
  clearInterval(typing);
  let i = 0;
  el.dialogText.textContent = '';
  typing = setInterval(() => {
    i += 2;
    el.dialogText.textContent = text.slice(0, i);
    if (i >= text.length) { clearInterval(typing); typing = null; }
  }, 16);
  el.dialog._full = text;
}

/** Returns true if it consumed the button press. */
export function advanceDialog() {
  if (!dialogOpen()) return false;
  if (typing) {                       // first press: finish typing instantly
    clearInterval(typing); typing = null;
    el.dialogText.textContent = el.dialog._full;
    return true;
  }
  el.dialog.classList.add('hidden');  // second press: close
  const d = onDone; onDone = null;
  if (d) d();
  return true;
}

/* ---------------- action prompt ---------------- */

export function setPrompt(text) {
  if (!text) { el.prompt.classList.add('hidden'); return; }
  el.promptText.textContent = text;
  el.prompt.classList.remove('hidden');
}

/* ---------------- party tray ---------------- */

export function setParty(party) {
  el.balls.innerHTML = '';
  for (const p of party) {
    const b = document.createElement('div');
    b.className = 'ball' + (p.hp <= 0 ? ' fainted' : '');
    b.title = p.name;
    el.balls.appendChild(b);
  }
}

/* ---------------- compass ---------------- */

const SVG_NS = 'http://www.w3.org/2000/svg';
let blipEls = [];

export function initCompass(zones) {
  el.blips.innerHTML = '';
  blipEls = zones.map((z) => {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('r', '4.5');
    c.setAttribute('fill', '#' + (z.accent ?? 0xffffff).toString(16).padStart(6, '0'));
    el.blips.appendChild(c);
    return { el: c, zone: z };
  });
}

export function updateCompass(px, pz, camYaw) {
  el.rose.setAttribute('transform', `rotate(${(camYaw * 180 / Math.PI).toFixed(1)} 50 50)`);
  const sin = Math.sin(camYaw), cos = Math.cos(camYaw);
  for (const b of blipEls) {
    const ox = b.zone.x - px, oz = b.zone.z - pz;
    const fwd = ox * -sin + oz * -cos;      // toward the top of the dial
    const rgt = ox * cos + oz * -sin;
    const d = Math.hypot(fwd, rgt);
    const k = d < 1 ? 0 : Math.min(32, d * 0.3) / d;
    b.el.setAttribute('cx', (50 + rgt * k).toFixed(1));
    b.el.setAttribute('cy', (50 - fwd * k).toFixed(1));
    b.el.setAttribute('opacity', d < 14 ? '0.25' : '1');
  }
}

/* ---------------- debug ---------------- */

let dbgBody = null;
export function initDebug(zones, onTeleport) {
  if (dbgBody) return;
  el.debug.classList.remove('hidden');
  dbgBody = document.createElement('div');
  el.debug.appendChild(dbgBody);
  const row = document.createElement('div');
  for (const z of zones) {
    const b = document.createElement('button');
    b.textContent = z.name.split(' ')[0];
    b.onclick = () => onTeleport(z);
    row.appendChild(b);
  }
  el.debug.appendChild(row);
}
export function setDebug(text) { if (dbgBody) dbgBody.textContent = text; }

/* ---------------- misc ---------------- */

export function oops(msg) {
  $('oopsText').textContent = msg;
  $('oops').classList.remove('hidden');
}
