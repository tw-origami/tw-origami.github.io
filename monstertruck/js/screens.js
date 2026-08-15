// Title → garage → mode select. All DOM, all icons — a non-reader can drive
// every menu: trucks are pictures, modes are pictures, and tapping anything
// says its name out loud.

import * as save from './save.js';

export const TRUCKS = [
  { id: 'red',    name: 'RED',    hex: '#e8442e' },
  { id: 'blue',   name: 'BLUE',   hex: '#2f6fe0' },
  { id: 'green',  name: 'GREEN',  hex: '#3fae4c' },
  { id: 'yellow', name: 'YELLOW', hex: '#f4c531' },
];

export const MODES = [
  { id: 'shapes',  name: 'SHAPES',  bg: '#33518f' },
  { id: 'colors',  name: 'COLORS',  bg: '#8a4a3a' },
  { id: 'letters', name: 'LETTERS', bg: '#2f6fe0' },
  { id: 'numbers', name: 'NUMBERS', bg: '#3fae4c' },
  { id: 'mix',     name: 'MIX!',    bg: '#8e4ec6' },
];

const $ = (id) => document.getElementById(id);
const SCREENS = ['title', 'garage', 'modes'];

function truckSVG(hex) {
  // chunky side-view monster truck, front to the right
  return `<svg viewBox="0 0 120 84" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="6" y="34" width="108" height="18" rx="5" fill="${hex}" stroke="#1c1233" stroke-width="4"/>
    <rect x="58" y="12" width="40" height="26" rx="6" fill="${hex}" stroke="#1c1233" stroke-width="4"/>
    <rect x="66" y="18" width="24" height="13" rx="3" fill="#bfe8ff" stroke="#1c1233" stroke-width="3"/>
    <rect x="100" y="36" width="14" height="8" rx="3" fill="#c8ccd8" stroke="#1c1233" stroke-width="3"/>
    <circle cx="32" cy="60" r="19" fill="#1d1d22" stroke="#1c1233" stroke-width="4"/>
    <circle cx="90" cy="60" r="19" fill="#1d1d22" stroke="#1c1233" stroke-width="4"/>
    <circle cx="32" cy="60" r="8" fill="#d8d8e0"/>
    <circle cx="90" cy="60" r="8" fill="#d8d8e0"/>
  </svg>`;
}

function modeIcon(id) {
  if (id === 'shapes') {
    return `<svg viewBox="0 0 120 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="22" r="15" fill="#fff" stroke="#1c1233" stroke-width="3.5"/>
      <polygon points="60,7 75,37 45,37" fill="#fff" stroke="#1c1233" stroke-width="3.5" stroke-linejoin="round"/>
      <rect x="88" y="8" width="28" height="28" rx="3" fill="#fff" stroke="#1c1233" stroke-width="3.5"/>
    </svg>`;
  }
  if (id === 'colors') {
    return `<svg viewBox="0 0 120 44" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="18" cy="22" r="13" fill="#e8442e" stroke="#1c1233" stroke-width="3"/>
      <circle cx="46" cy="22" r="13" fill="#2f6fe0" stroke="#1c1233" stroke-width="3"/>
      <circle cx="74" cy="22" r="13" fill="#3fae4c" stroke="#1c1233" stroke-width="3"/>
      <circle cx="102" cy="22" r="13" fill="#f4c531" stroke="#1c1233" stroke-width="3"/>
    </svg>`;
  }
  if (id === 'letters') return 'ABC';
  if (id === 'numbers') return '123';
  return '🎲';
}

export function init(handlers) {
  $('startBtn').addEventListener('click', handlers.onStart);

  /* ---- garage ---- */
  const cards = $('truckCards');
  const saved = save.load().truck;
  for (const t of TRUCKS) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'truckCard' + (t.id === saved ? ' on' : '');
    card.innerHTML = truckSVG(t.hex) + `<span class="tName" style="color:${t.hex}">${t.name}</span>`;
    card.addEventListener('click', () => {
      for (const c of cards.children) c.classList.toggle('on', c === card);
      handlers.onTruck(t);
    });
    cards.appendChild(card);
  }
  $('garageGo').addEventListener('click', handlers.onGarageGo);

  /* ---- mode select ---- */
  const tiles = $('modeTiles');
  for (const m of MODES) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'modeTile';
    tile.style.background = m.bg;
    tile.innerHTML = `<span class="mIcon">${modeIcon(m.id)}</span>
      <span class="mName">${m.name}</span><span class="mStars" data-mode="${m.id}"></span>`;
    tile.addEventListener('click', () => handlers.onMode(m.id));
    tiles.appendChild(tile);
  }
  $('garageBtn').addEventListener('click', () => show('garage'));

  const cruise = $('cruiseToggle');
  cruise.checked = save.load().autoCruise;
  cruise.addEventListener('change', () => handlers.onCruise(cruise.checked));
}

/** Show one menu screen (hiding the rest), or 'none' for the arena. */
export function show(name) {
  for (const s of SCREENS) $(s).classList.toggle('hidden', s !== name);
  if (name === 'modes') refreshStars();
}

/** Once the 3D world exists, menus go translucent and let it show through. */
export function overArena() {
  for (const s of SCREENS) $(s).classList.add('overArena');
}

export function refreshStars() {
  const stars = save.load().stars;
  for (const el of document.querySelectorAll('.mStars')) {
    const n = stars[el.dataset.mode] ?? 0;
    el.textContent = n > 0 ? '⭐ ' + n : '';
  }
}
