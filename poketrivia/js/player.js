// The trainer you steer, plus the camera that chases them.
// Look is straight off the concept sheet: red cap, blue jacket, backpack, seen from behind.

import * as THREE from 'three';
import { heightAt, moveWithCollision, cameraDistance } from './world.js';
import { input, pollKeys, takeLook } from './input.js';
import { clamp, damp, lerp } from './rng.js';

const SPEED = 11.5;
const CAM_DIST_DEFAULT = 15;
const CAM_HEIGHT = 7.2;

const BASE_COLORS = {
  skin:  0xf0c08a,
  cap:   0xe23b32,
  capDk: 0xb02a22,
  hair:  0x3a2418,
  coat:  0x2f6fd0,
  coatDk:0x214f96,
  jeans: 0x2b3a63,
  pack:  0xe0a92c,
  shoe:  0xe8e4d8,
  eye:   0x241a12,
};

function boxMesh(w, h, d, color) {
  const g = new THREE.BoxGeometry(w, h, d);
  return new THREE.Mesh(g, new THREE.MeshLambertMaterial({ color, flatShading: true }));
}

export function buildTrainer(over = {}) {
  const C = { ...BASE_COLORS, ...over };
  const g = new THREE.Group();

  const legL = boxMesh(0.42, 1.05, 0.42, C.jeans);
  const legR = boxMesh(0.42, 1.05, 0.42, C.jeans);
  legL.position.set(-0.26, 0.52, 0); legR.position.set(0.26, 0.52, 0);
  const shoeL = boxMesh(0.46, 0.26, 0.62, C.shoe); shoeL.position.set(0, -0.5, 0.08);
  const shoeR = shoeL.clone();
  legL.add(shoeL); legR.add(shoeR);
  // pivot legs from the hip so rotation swings the foot, not the whole box
  const hipL = new THREE.Group(), hipR = new THREE.Group();
  hipL.position.set(0, 1.05, 0); hipR.position.set(0, 1.05, 0);
  legL.position.y = -0.52; legR.position.y = -0.52;
  hipL.add(legL); hipR.add(legR);
  hipL.position.x = -0.26; hipR.position.x = 0.26;
  g.add(hipL, hipR);

  const torso = boxMesh(1.02, 1.05, 0.6, C.coat);
  torso.position.y = 1.58;
  g.add(torso);

  const pack = boxMesh(0.86, 0.85, 0.36, C.pack);
  pack.position.set(0, 1.62, -0.44);
  g.add(pack);

  const armL = boxMesh(0.26, 0.92, 0.28, C.coatDk);
  const armR = armL.clone();
  const shL = new THREE.Group(), shR = new THREE.Group();
  shL.position.set(-0.64, 2.0, 0); shR.position.set(0.64, 2.0, 0);
  armL.position.y = -0.46; armR.position.y = -0.46;
  const handL = boxMesh(0.28, 0.26, 0.3, C.skin); handL.position.y = -0.55;
  const handR = handL.clone();
  armL.add(handL); armR.add(handR);
  shL.add(armL); shR.add(armR);
  g.add(shL, shR);

  const head = boxMesh(0.78, 0.72, 0.72, C.skin);
  head.position.y = 2.5;
  const eyeL = boxMesh(0.13, 0.16, 0.06, C.eye); eyeL.position.set(-0.19, 0.04, 0.37);
  const eyeR = eyeL.clone(); eyeR.position.x = 0.19;
  head.add(eyeL, eyeR);
  const hair = boxMesh(0.8, 0.2, 0.74, C.hair); hair.position.set(0, 0.3, -0.03);
  head.add(hair);
  const capTop = boxMesh(0.86, 0.34, 0.8, C.cap); capTop.position.set(0, 0.5, 0);
  const brim = boxMesh(0.84, 0.1, 0.42, C.capDk); brim.position.set(0, 0.36, 0.5);
  head.add(capTop, brim);
  g.add(head);

  // soft blob shadow — cheaper and more period-correct than a shadow map
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.95, 12),
    new THREE.MeshBasicMaterial({ color: 0x102030, transparent: true, opacity: 0.32, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.06;
  g.add(shadow);

  g.userData = { hipL, hipR, shL, shR, torso, head, shadow };
  return g;
}

export function createPlayer(scene, startX = 0, startZ = 22) {
  const mesh = buildTrainer();
  const pos = new THREE.Vector3(startX, heightAt(startX, startZ), startZ);
  mesh.position.copy(pos);
  scene.add(mesh);

  const state = {
    mesh, pos,
    facing: Math.PI,        // radians; model's +Z points this way
    camYaw: 0,              // direction from player to camera
    camDist: CAM_DIST_DEFAULT,
    camNear: CAM_DIST_DEFAULT,
    walkPhase: 0,
    speed: 0,
    frozen: false,
  };

  const camPos = new THREE.Vector3();
  const camTarget = new THREE.Vector3();
  let camInit = false;

  state.update = function (dt, camera) {
    pollKeys(dt);
    state.camYaw += takeLook();
    if (input.zoom) {
      state.camDist = clamp(state.camDist + input.zoom, 8, 26);
      input.zoom = 0;
    }

    let mx = state.frozen ? 0 : input.move.x;
    let my = state.frozen ? 0 : input.move.y;
    const mag = Math.hypot(mx, my);
    if (mag > 1) { mx /= mag; my /= mag; }

    // camera-relative movement: "up" always means away from the camera
    const fx = -Math.sin(state.camYaw), fz = -Math.cos(state.camYaw);
    const rx = -fz, rz = fx;
    let dx = fx * my + rx * mx;
    let dz = fz * my + rz * mx;
    const len = Math.hypot(dx, dz);

    state.speed = damp(state.speed, len > 0.02 ? SPEED * Math.min(1, len) : 0, 12, dt);

    if (len > 0.02) {
      dx /= len; dz /= len;
      state.facing = Math.atan2(dx, dz);
      const step = state.speed * dt;
      moveWithCollision(pos.x, pos.z, pos.x + dx * step, pos.z + dz * step, pos.y, pos);
      state.walkPhase += state.speed * dt * 1.5;
    } else {
      state.walkPhase = damp(state.walkPhase % (Math.PI * 2), 0, 8, dt);
    }

    pos.y = heightAt(pos.x, pos.z);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.rotation.y = shortestAngle(mesh.rotation.y, state.facing, dt);

    // walk cycle
    const sw = Math.sin(state.walkPhase) * Math.min(1, state.speed / SPEED);
    const u = mesh.userData;
    u.hipL.rotation.x = sw * 0.75;
    u.hipR.rotation.x = -sw * 0.75;
    u.shL.rotation.x = -sw * 0.55;
    u.shR.rotation.x = sw * 0.55;
    const bob = Math.abs(Math.cos(state.walkPhase)) * 0.09 * Math.min(1, state.speed / SPEED);
    u.torso.position.y = 1.58 + bob;
    u.head.position.y = 2.5 + bob;
    u.shadow.position.y = 0.06;

    // camera swings back behind the player once they stop steering it
    if (input.lookedRecently > 1.4 && state.speed > 1) {
      state.camYaw = angleTo(state.camYaw, state.facing + Math.PI, 1.6, dt);
    }

    const dirX = Math.sin(state.camYaw), dirZ = Math.cos(state.camYaw);
    const want = cameraDistance(pos.x, pos.y, pos.z, dirX, dirZ, state.camDist);
    // snap in fast when something blocks the view, ease back out slowly
    state.camNear = want < state.camNear ? want : damp(state.camNear, want, 3, dt);
    const cx = pos.x + dirX * state.camNear;
    const cz = pos.z + dirZ * state.camNear;
    let cy = pos.y + CAM_HEIGHT * (0.55 + 0.45 * (state.camNear / state.camDist));
    cy = Math.max(cy, heightAt(cx, cz) + 2.2);

    if (!camInit) { camPos.set(cx, cy, cz); camInit = true; }
    camPos.x = damp(camPos.x, cx, 6, dt);
    camPos.y = damp(camPos.y, cy, 5, dt);
    camPos.z = damp(camPos.z, cz, 6, dt);
    camera.position.copy(camPos);

    camTarget.set(
      damp(camTarget.x || pos.x, pos.x, 9, dt),
      damp(camTarget.y || pos.y + 2.2, pos.y + 2.2, 7, dt),
      damp(camTarget.z || pos.z, pos.z, 9, dt)
    );
    camera.lookAt(camTarget);
  };

  state.teleport = function (x, z) {
    pos.set(x, heightAt(x, z), z);
    mesh.position.copy(pos);
    camInit = false;
  };

  return state;
}

function shortestAngle(cur, target, dt) {
  let d = ((target - cur + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return cur + d * Math.min(1, 14 * dt);
}
function angleTo(cur, target, lambda, dt) {
  let d = ((target - cur + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return cur + d * (1 - Math.exp(-lambda * dt));
}
