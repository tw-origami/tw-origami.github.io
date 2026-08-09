// One place for keyboard, touch stick, and drag-to-look.
// Exposes a tiny polled state object; nothing else in the game touches DOM events.

import { clamp } from './rng.js';

export const input = {
  move: { x: 0, y: 0 },   // -1..1, screen space (y = away from camera)
  look: 0,                // yaw delta accumulated since last read
  zoom: 0,                // wheel/pinch delta
  action: false,          // edge-triggered "A" press; read with takeAction()
  lookedRecently: 0,      // seconds since the player last dragged the camera
  enabled: true,
};

const keys = new Set();
const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
};

export function takeAction() {
  const a = input.action;
  input.action = false;
  return a;
}

export function takeLook() {
  const l = input.look;
  input.look = 0;
  return l;
}

export function initInput(canvas) {
  addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = KEYMAP[e.code];
    if (k) { keys.add(k); e.preventDefault(); }
    if (e.code === 'Space' || e.code === 'Enter') { input.action = true; e.preventDefault(); }
    if (e.code === 'KeyQ') keys.add('turnL');
    if (e.code === 'KeyE') keys.add('turnR');
  });
  addEventListener('keyup', (e) => {
    const k = KEYMAP[e.code];
    if (k) keys.delete(k);
    if (e.code === 'KeyQ') keys.delete('turnL');
    if (e.code === 'KeyE') keys.delete('turnR');
  });
  addEventListener('blur', () => keys.clear());

  /* ---- drag to look (mouse or touch on the 3D view) ---- */
  let dragId = null, lastX = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragId = e.pointerId; lastX = e.clientX;
    canvas.setPointerCapture?.(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerId !== dragId) return;
    input.look += (e.clientX - lastX) * 0.006;
    lastX = e.clientX;
    input.lookedRecently = 0;
  });
  const endDrag = (e) => { if (e.pointerId === dragId) dragId = null; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('wheel', (e) => { input.zoom += e.deltaY * 0.02; e.preventDefault(); }, { passive: false });

  /* ---- virtual stick ---- */
  const zone = document.getElementById('stickZone');
  const base = document.getElementById('stickBase');
  const knob = document.getElementById('stickKnob');
  const R = 52;
  let stickId = null, ox = 0, oy = 0;

  const setKnob = (dx, dy) => { knob.style.transform = `translate(${dx}px, ${dy}px)`; };

  zone.addEventListener('pointerdown', (e) => {
    stickId = e.pointerId; ox = e.clientX; oy = e.clientY;
    base.style.left = ox + 'px'; base.style.top = oy + 'px';
    base.classList.add('on'); setKnob(0, 0);
    zone.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== stickId) return;
    let dx = e.clientX - ox, dy = e.clientY - oy;
    const d = Math.hypot(dx, dy);
    if (d > R) { dx = dx / d * R; dy = dy / d * R; }
    setKnob(dx, dy);
    input.move.x = clamp(dx / R, -1, 1);
    input.move.y = clamp(-dy / R, -1, 1);
    e.preventDefault();
  });
  const endStick = (e) => {
    if (e.pointerId !== stickId) return;
    stickId = null; base.classList.remove('on'); setKnob(0, 0);
    input.move.x = 0; input.move.y = 0;
  };
  zone.addEventListener('pointerup', endStick);
  zone.addEventListener('pointercancel', endStick);

  const press = (e) => { input.action = true; e.preventDefault(); e.stopPropagation(); };
  document.getElementById('btnA').addEventListener('pointerdown', press);
  // The on-screen prompt is a button too. Without this a tap on it fell through
  // to the joystick zone underneath and walked the player instead.
  document.getElementById('prompt').addEventListener('pointerdown', press);

  // Show touch controls only on a touch device.
  if (matchMedia('(hover: none) and (pointer: coarse)').matches) {
    document.getElementById('touch').classList.remove('hidden');
  }
}

/** Fold keyboard state into input.move each frame (stick already writes it directly). */
export function pollKeys(dt) {
  input.lookedRecently += dt;
  const kx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
  const ky = (keys.has('up') ? 1 : 0) - (keys.has('down') ? 1 : 0);
  if (kx || ky) { input.move.x = kx; input.move.y = ky; }
  else if (!document.getElementById('stickBase').classList.contains('on')) {
    input.move.x = 0; input.move.y = 0;
  }
  if (keys.has('turnL')) { input.look -= 2.2 * dt; input.lookedRecently = 0; }
  if (keys.has('turnR')) { input.look += 2.2 * dt; input.lookedRecently = 0; }
}
