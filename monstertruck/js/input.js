// One place for keyboard, touch stick, and pedals.
// Exposes a tiny polled state object; nothing else in the game touches DOM events.
// Adapted from PokéTrivia's input module, reshaped for driving: the stick is
// steering only (x axis), and gas/brake are big dedicated pedals.

import { clamp } from './util.js';

export const input = {
  steer: 0,        // -1 (left) .. 1 (right)
  gas: false,
  brake: false,
  boost: false,    // FAST MODE — hold Shift (or the ⚡ button)
  action: false,   // edge-triggered: Space / Enter — "say it again" + honk
};

const keys = new Set();
const KEYMAP = {
  ArrowUp: 'gas', KeyW: 'gas',
  ArrowDown: 'brake', KeyS: 'brake',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ShiftLeft: 'boost', ShiftRight: 'boost',
};

let stickX = 0;           // touch steering, kept separate so keys can override
let touchGas = false, touchBrake = false, touchBoost = false;

export function takeAction() {
  const a = input.action;
  input.action = false;
  return a;
}

export function initInput() {
  addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = KEYMAP[e.code];
    if (k) { keys.add(k); e.preventDefault(); }
    if (e.code === 'Space' || e.code === 'Enter') {
      // but not when a button has focus — Enter should still click it
      if (document.activeElement?.tagName !== 'BUTTON') { input.action = true; e.preventDefault(); }
    }
  });
  addEventListener('keyup', (e) => {
    const k = KEYMAP[e.code];
    if (k) keys.delete(k);
  });
  addEventListener('blur', () => keys.clear());

  /* ---- virtual steering stick (left half of the screen) ---- */
  const zone = document.getElementById('stickZone');
  const base = document.getElementById('stickBase');
  const knob = document.getElementById('stickKnob');
  const R = 52;
  let stickId = null, ox = 0, oy = 0;

  const setKnob = (dx) => { knob.style.transform = `translate(${dx}px, 0px)`; };

  zone.addEventListener('pointerdown', (e) => {
    stickId = e.pointerId; ox = e.clientX; oy = e.clientY;
    base.style.left = ox + 'px'; base.style.top = oy + 'px';
    base.classList.add('on'); setKnob(0);
    zone.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  });
  zone.addEventListener('pointermove', (e) => {
    if (e.pointerId !== stickId) return;
    let dx = e.clientX - ox;
    dx = clamp(dx, -R, R);
    setKnob(dx);
    stickX = clamp(dx / R, -1, 1);
    e.preventDefault();
  });
  const endStick = (e) => {
    if (e.pointerId !== stickId) return;
    stickId = null; base.classList.remove('on'); setKnob(0);
    stickX = 0;
  };
  zone.addEventListener('pointerup', endStick);
  zone.addEventListener('pointercancel', endStick);

  /* ---- pedals ---- */
  const pedal = (id, set) => {
    const el = document.getElementById(id);
    const down = (e) => { set(true); el.classList.add('down'); el.setPointerCapture?.(e.pointerId); e.preventDefault(); };
    const up = () => { set(false); el.classList.remove('down'); };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  };
  pedal('btnGas', (v) => { touchGas = v; });
  pedal('btnBrake', (v) => { touchBrake = v; });
  pedal('btnBoost', (v) => { touchBoost = v; });

  // Show touch controls only on a touch device.
  if (matchMedia('(hover: none) and (pointer: coarse)').matches) {
    document.getElementById('touch').classList.remove('hidden');
  }
}

/** Fold keyboard state into the polled values each frame (touch already wrote its own). */
export function poll() {
  const kx = (keys.has('right') ? 1 : 0) - (keys.has('left') ? 1 : 0);
  input.steer = kx !== 0 ? kx : stickX;
  input.gas = keys.has('gas') || touchGas;
  input.brake = keys.has('brake') || touchBrake;
  input.boost = keys.has('boost') || touchBoost;
}
