// DOM HUD over the canvas: target chip, star counter, popups, mute, home.
// All text lives out here where it stays crisp — the 3D buffer is deliberately
// low-res and would chew small type to mush.

import { drawGlyph } from './glyphs.js';
import * as audio from './audio.js';

const $ = (id) => document.getElementById(id);
let popupT1 = 0, popupT2 = 0;

export function init({ onHome, onSayAgain }) {
  $('homeBtn').addEventListener('click', () => { audio.uiTap(); onHome(); });
  $('sayAgain').addEventListener('click', onSayAgain);
  $('muteBtn').addEventListener('click', () => {
    const muted = audio.toggleMute();
    $('muteBtn').textContent = muted ? '🔇' : '🔊';
    if (!muted) audio.uiTap();
  });
  $('muteBtn').textContent = audio.isMuted() ? '🔇' : '🔊';
}

export function show(on) {
  $('hud').classList.toggle('hidden', !on);
}

/** The "we're looking for THIS" reminder. null hides it between rounds. */
export function setTarget(item) {
  const chip = $('targetChip');
  if (!item) { chip.classList.add('hidden'); return; }
  const canvas = $('chipCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGlyph(ctx, item, 2, 2, canvas.width - 4);
  chip.classList.remove('hidden');
  chip.classList.remove('pop');
  void chip.offsetWidth;                 // restart the pop animation
  chip.classList.add('pop');
}

export function setStars(n, pop = false) {
  $('starNum').textContent = n;
  if (pop) {
    const el = $('starCount');
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
  }
}

/** Big center shout: AIR TIME!, GREAT JOB!, … Auto-fades. */
export function popup(text, sub = '') {
  const el = $('popup');
  clearTimeout(popupT1); clearTimeout(popupT2);
  el.classList.remove('hidden', 'fade');
  void el.offsetWidth;
  el.innerHTML = '';
  el.append(document.createTextNode(text));
  if (sub) {
    const s = document.createElement('small');
    s.textContent = sub;
    el.append(s);
  }
  popupT1 = setTimeout(() => el.classList.add('fade'), 1100);
  popupT2 = setTimeout(() => el.classList.add('hidden'), 1500);
}
