// Cheap instanced particle bursts: dust, confetti, firework sparks.
// One InstancedMesh per type; fade is done by scaling to zero so every type can
// share one material. Multi-color types color per instance from a palette.
// Adapted from the chicken game's emitter, plus a tiny scheduler so a fireworks
// volley can stagger its bursts without anyone setTimeout-ing into the scene.

import * as THREE from 'three';
import { pick } from './util.js';

const PALETTE = [0xff5330, 0xffcf3f, 0x3fae4c, 0x2f6fe0, 0x8e4ec6, 0xff7ab8, 0x4fd8e8];

const TYPES = {
  dust:     { color: 0xcdb891, size: 0.5,  gravity: -1.4, drag: 3.0, life: 0.7, spin: 2, spread: 2.2, up: 2.2, grow: 1.8 },
  confetti: { palette: true,   size: 0.34, gravity: -2.6, drag: 1.6, life: 2.1, spin: 10, spread: 4.5, up: 8.0 },
  spark:    { palette: true,   size: 0.42, gravity: -2.2, drag: 0.9, life: 1.5, spin: 6, spread: 7.5, up: 2.5, basic: true },
};
const CAPACITY = 90;

class Emitter {
  constructor(scene, cfg) {
    this.cfg = cfg;
    // sparks glow (unlit); dust and confetti sit in the scene light
    const mat = cfg.basic
      ? new THREE.MeshBasicMaterial({ color: cfg.palette ? 0xffffff : cfg.color, side: THREE.DoubleSide })
      : new THREE.MeshLambertMaterial({ color: cfg.palette ? 0xffffff : cfg.color, side: THREE.DoubleSide, flatShading: true });
    this.mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(cfg.size, cfg.size), mat, CAPACITY);
    this.mesh.frustumCulled = false;
    this.mesh.count = CAPACITY;
    this.slots = [];
    for (let i = 0; i < CAPACITY; i++) {
      this.slots.push({ live: false, pos: new THREE.Vector3(), vel: new THREE.Vector3(), rot: new THREE.Euler(), spin: new THREE.Vector3(), t: 0 });
    }
    this.next = 0;
    scene.add(this.mesh);
    this._m = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._s = new THREE.Vector3();
    this._c = new THREE.Color();
    this.hideAll();
  }

  hideAll() {
    const zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (let i = 0; i < CAPACITY; i++) this.mesh.setMatrixAt(i, zero);
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  burst(origin, count, boost = 1) {
    const c = this.cfg;
    for (let i = 0; i < count; i++) {
      const s = this.slots[this.next];
      const idx = this.next;
      this.next = (this.next + 1) % CAPACITY;
      s.live = true; s.t = 0;
      s.pos.copy(origin);
      s.pos.x += (Math.random() - 0.5) * 0.6;
      s.pos.z += (Math.random() - 0.5) * 0.6;
      const a = Math.random() * Math.PI * 2, r = Math.random() * c.spread * boost;
      s.vel.set(Math.cos(a) * r, (c.up * (0.5 + Math.random())) * boost, Math.sin(a) * r);
      s.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      s.spin.set((Math.random() - 0.5) * c.spin, (Math.random() - 0.5) * c.spin, (Math.random() - 0.5) * c.spin);
      if (c.palette) {
        this.mesh.setColorAt(idx, this._c.setHex(pick(PALETTE)));
      }
    }
    if (c.palette && this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }

  update(dt) {
    const c = this.cfg;
    let any = false;
    for (let i = 0; i < CAPACITY; i++) {
      const s = this.slots[i];
      if (!s.live) continue;
      any = true;
      s.t += dt;
      const k = s.t / c.life;
      if (k >= 1) {
        s.live = false;
        this.mesh.setMatrixAt(i, this._m.makeScale(0, 0, 0));
        continue;
      }
      s.vel.y += c.gravity * dt;
      s.vel.x -= s.vel.x * c.drag * dt;
      s.vel.z -= s.vel.z * c.drag * dt;
      s.pos.addScaledVector(s.vel, dt);
      if (s.pos.y < 0.05) { s.pos.y = 0.05; s.vel.y *= -0.25; s.vel.x *= 0.5; s.vel.z *= 0.5; }
      s.rot.x += s.spin.x * dt; s.rot.y += s.spin.y * dt; s.rot.z += s.spin.z * dt;
      const grow = c.grow ? 1 + k * c.grow : 1;
      const fade = Math.min(1, (1 - k) * 2.2) * grow;
      this._q.setFromEuler(s.rot);
      this.mesh.setMatrixAt(i, this._m.compose(s.pos, this._q, this._s.set(fade, fade, fade)));
    }
    if (any) this.mesh.instanceMatrix.needsUpdate = true;
  }
}

export class Particles {
  constructor(scene) {
    this.emitters = {};
    for (const [name, cfg] of Object.entries(TYPES)) this.emitters[name] = new Emitter(scene, cfg);
    this.pending = [];   // { t, type, pos, n, boost } — staggered volleys
  }

  burst(type, origin, count = 10, boost = 1) {
    const e = this.emitters[type];
    if (e) e.burst(origin, count, boost);
  }

  /** Queue a burst `delay` seconds from now (fireworks volleys). */
  later(delay, type, origin, count, boost = 1) {
    this.pending.push({ t: delay, type, pos: origin.clone(), n: count, boost });
  }

  update(dt) {
    for (let i = this.pending.length - 1; i >= 0; i--) {
      const p = this.pending[i];
      p.t -= dt;
      if (p.t <= 0) {
        this.burst(p.type, p.pos, p.n, p.boost);
        this.pending.splice(i, 1);
      }
    }
    for (const k in this.emitters) this.emitters[k].update(dt);
  }
}
