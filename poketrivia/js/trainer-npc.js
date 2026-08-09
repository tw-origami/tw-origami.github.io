// Trainers standing around the island. They idle, turn to look at you, and
// challenge you when you step into their line of sight — the classic rule.
//
// Each NPC is ONE merged mesh. The player's rig is a dozen little meshes so its
// legs can swing, but seventeen of those would cost over a hundred draw calls,
// which iPad Safari feels immediately. NPCs don't walk, so they don't need it.

import * as THREE from 'three';
import { Mesher, rgb, heightAt, colliders } from './world.js';

const DEFAULT = {
  skin: 0xf0c08a, cap: 0xe23b32, capDk: 0xb02a22, hair: 0x3a2418,
  coat: 0x2f6fd0, coatDk: 0x214f96, jeans: 0x2b3a63, pack: 0xe0a92c,
  shoe: 0xe8e4d8, eye: 0x241a12,
};

function trainerGeometry(over = {}) {
  const c = { ...DEFAULT, ...over };
  const C = Object.fromEntries(Object.entries(c).map(([k, v]) => [k, rgb(v)]));
  const m = new Mesher();

  m.box(-0.26, 0.52, 0, 0.42, 1.05, 0.42, C.jeans);
  m.box(0.26, 0.52, 0, 0.42, 1.05, 0.42, C.jeans);
  m.box(-0.26, 0.13, 0.08, 0.46, 0.26, 0.62, C.shoe);
  m.box(0.26, 0.13, 0.08, 0.46, 0.26, 0.62, C.shoe);

  m.box(0, 1.58, 0, 1.02, 1.05, 0.6, C.coat);
  m.box(0, 1.62, -0.44, 0.86, 0.85, 0.36, C.pack);
  m.box(-0.64, 1.54, 0, 0.26, 0.92, 0.28, C.coatDk);
  m.box(0.64, 1.54, 0, 0.26, 0.92, 0.28, C.coatDk);
  m.box(-0.64, 0.95, 0, 0.28, 0.26, 0.3, C.skin);
  m.box(0.64, 0.95, 0, 0.28, 0.26, 0.3, C.skin);

  m.box(0, 2.5, 0, 0.78, 0.72, 0.72, C.skin);
  m.box(-0.19, 2.54, 0.37, 0.13, 0.16, 0.06, C.eye);
  m.box(0.19, 2.54, 0.37, 0.13, 0.16, 0.06, C.eye);
  m.box(0, 2.8, -0.03, 0.8, 0.2, 0.74, C.hair);
  m.box(0, 3.0, 0, 0.86, 0.34, 0.8, C.cap);
  m.box(0, 2.86, 0.5, 0.84, 0.1, 0.42, C.capDk);

  return m.build();
}

const npcMat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });

export function createTrainers(scene, defs) {
  const list = defs.map((def) => {
    const mesh = new THREE.Mesh(trainerGeometry(def.look), npcMat);
    mesh.position.set(def.x, heightAt(def.x, def.z), def.z);
    mesh.rotation.y = def.face ?? 0;
    scene.add(mesh);
    colliders.push({ x: def.x, z: def.z, r: 1.0 });
    return { def, mesh, bob: Math.random() * 6, beaten: false };
  });

  return {
    list,

    setBeaten(ids) { for (const t of list) t.beaten = ids.includes(t.def.id); },

    update(dt, player) {
      for (const t of list) {
        t.bob += dt * 1.7;
        const dx = player.pos.x - t.mesh.position.x, dz = player.pos.z - t.mesh.position.z;
        const near = Math.hypot(dx, dz) < 16;
        const want = near ? Math.atan2(dx, dz) : (t.def.face ?? 0);
        let diff = ((want - t.mesh.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
        if (diff < -Math.PI) diff += Math.PI * 2;
        t.mesh.rotation.y += diff * Math.min(1, 3 * dt);
        t.mesh.position.y = heightAt(t.mesh.position.x, t.mesh.position.z)
          + Math.sin(t.bob) * 0.04;              // gentle breathing
      }
    },

    /** The unbeaten trainer whose line of sight the player just walked into. */
    challenger(player) {
      for (const t of list) {
        if (t.beaten) continue;
        const d = Math.hypot(player.pos.x - t.mesh.position.x, player.pos.z - t.mesh.position.z);
        if (d < (t.def.sight ?? 7)) return t;
      }
      return null;
    },

    nearest(player, range = 6) {
      let best = null, bestD = range;
      for (const t of list) {
        const d = Math.hypot(player.pos.x - t.mesh.position.x, player.pos.z - t.mesh.position.z);
        if (d < bestD) { bestD = d; best = t; }
      }
      return best;
    },
  };
}
