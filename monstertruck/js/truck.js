// The monster truck: forgiving arcade kinematics plus a bouncy body.
//
// Physics is yaw-only — velocity always points along the heading, no drift, no
// flipping; pitch and roll are purely visual. That single decision is most of
// what makes the game drivable by a three-year-old: the truck goes where it
// points, walls are soft, and nothing can ever end up upside down.

import * as THREE from 'three';
import { clamp, damp } from './util.js';
import { heightAt, collide } from './world.js';

export const TOP = 16;          // u/s flat out
const CRUISE = 8;               // auto-cruise rolling speed: steering IS the game
const REVERSE = -4.5;
const ACCEL = 14, BRAKE = 24, DRAG = 6;
const GRAV = 28;                // a touch floaty — real gravity reads as a stumble
const STEER_RATE = 2.2;
const WHEEL_R = 0.95;
const MAX_CLIMB = 14;           // u/s — fastest the wheels can ride terrain upward
const MAX_LAUNCH = 9;           // u/s — the biggest legit ramp launch is ~7

export function createTruck(scene, colorHex) {
  const mat = (opts) => new THREE.MeshLambertMaterial({ flatShading: true, ...opts });
  const bodyMat = mat({ color: colorHex });
  const darkMat = mat({ color: 0x22283a });

  const group = new THREE.Group();      // yaw + ground pitch live here
  const body = new THREE.Group();       // suspension bounce/lean lives here
  group.add(body);

  // model faces +z (the direction positive speed travels)
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.5, 3.4), darkMat);
  chassis.position.y = -0.25;
  body.add(chassis);
  const shell = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 3.5), bodyMat);
  shell.position.y = 0.3;
  body.add(shell);
  const bed = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.5, 1.2), darkMat);
  bed.position.set(0, 0.75, -1.0);
  body.add(bed);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.85, 1.5), bodyMat);
  cab.position.set(0, 1.05, 0.45);
  body.add(cab);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.55, 1.56), mat({ color: 0xbfe8ff }));
  glass.position.set(0, 1.12, 0.45);
  body.add(glass);
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.35, 0.35), mat({ color: 0xc8ccd8 }));
  bumper.position.set(0, -0.1, 1.85);
  body.add(bumper);
  for (const ex of [-0.75, 0.75]) {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.85, 6), mat({ color: 0xc8ccd8 }));
    pipe.position.set(ex, 1.05, -1.55);
    body.add(pipe);
  }

  // wheels: a steer pivot per wheel, cylinder + hub inside
  const wheels = [];
  const wheelGeo = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.75, 10);
  wheelGeo.rotateZ(Math.PI / 2);        // axis along x
  const hubGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.78, 8);
  hubGeo.rotateZ(Math.PI / 2);
  for (const [wx, wz, front] of [[-1.35, 1.25, 1], [1.35, 1.25, 1], [-1.35, -1.25, 0], [1.35, -1.25, 0]]) {
    const pivot = new THREE.Group();
    pivot.position.set(wx, WHEEL_R, wz);
    const tire = new THREE.Mesh(wheelGeo, mat({ color: 0x1d1d22 }));
    const hub = new THREE.Mesh(hubGeo, mat({ color: 0xd8d8e0 }));
    pivot.add(tire, hub);
    group.add(pivot);
    wheels.push({ pivot, tire, hub, front });
  }

  // fake blob shadow: reads as N64, and shows the landing spot during a jump
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(2.0, 14),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  group.add(shadow);

  scene.add(group);

  const t = {
    group,
    pos: new THREE.Vector3(0, 0, 24),
    yaw: Math.PI,                       // spawn facing the gates
    speed: 0,
    vy: 0,
    grounded: true,
    airTime: 0,
    prevPos: new THREE.Vector3(0, 0, 24),

    dir(out = new THREE.Vector3()) {
      return out.set(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    },

    setColor(hex) { bodyMat.color.set(hex); },

    teleport(x, z, yaw = this.yaw) {
      this.pos.set(x, heightAt(x, z), z);
      this.prevPos.copy(this.pos);
      this.yaw = yaw;
      this.speed = 0; this.vy = 0; this.grounded = true; this.airTime = 0;
      springY = 0; springV = 0; groundVy = 0;
    },
  };

  let springY = 0, springV = 0;         // body bounce
  let lean = 0;                         // accel pitch, smoothed
  let pitch = 0;                        // whole-truck ground pitch
  let groundVy = 0;                     // climb rate while grounded, becomes launch vy
  let wheelSpin = 0;

  /**
   * One physics step. Returns per-frame events for main to turn into
   * dust/sound/popups: { landed, airTime, hitWall, jumped }.
   */
  t.update = function (dt, inp, { autoCruise = true, frozen = false } = {}) {
    const ev = { landed: false, airTime: 0, hitWall: false, jumped: false };
    this.prevPos.copy(this.pos);

    /* ---- longitudinal ---- */
    let target;
    if (frozen) target = 0;
    else if (inp.brake) target = this.speed > 0.6 ? 0 : REVERSE;
    else if (inp.gas) target = TOP;
    else target = autoCruise ? CRUISE : 0;
    if (target > 0) target *= 1 - 0.3 * Math.abs(inp.steer);   // auto-slow in turns

    const rate = inp.brake ? BRAKE : (Math.abs(target) > Math.abs(this.speed) ? ACCEL : DRAG);
    const prevSpeed = this.speed;
    this.speed += clamp(target - this.speed, -rate * dt, rate * dt);

    /* ---- steering (near-full lock at low speed, damped flat out) ---- */
    const speedFactor = clamp(Math.abs(this.speed) / 4, 0, 1) * (1 - 0.35 * Math.abs(this.speed) / TOP);
    const airFactor = this.grounded ? 1 : 0.4;
    if (!frozen) this.yaw -= inp.steer * STEER_RATE * speedFactor * airFactor * dt;

    /* ---- move ---- */
    this.pos.x += Math.sin(this.yaw) * this.speed * dt;
    this.pos.z += Math.cos(this.yaw) * this.speed * dt;

    const wp = collide(this.pos.x, this.pos.z, 2.0);
    if (wp) {
      this.pos.x = wp.x; this.pos.z = wp.z;
      if (Math.abs(this.speed) > 3.5) { ev.hitWall = true; springV -= 0.5; }
      this.speed *= 0.45;
    }

    /* ---- vertical: ground follow, launches, landings ---- */
    const gY = heightAt(this.pos.x, this.pos.z);
    if (this.grounded) {
      // Launch when following the ground would mean falling faster than gravity
      // allows — cresting a ridge at speed — or when it simply vanished under us
      // (driving off a ramp's side). A fixed height threshold doesn't work here:
      // it silently glues the truck to any slope gentler than the threshold.
      const newGroundVy = (gY - this.pos.y) / Math.max(dt, 1e-4);
      const cliff = gY < this.pos.y - 0.5;
      const cantFollow = newGroundVy < groundVy - GRAV * dt * 1.5;
      if (cliff || cantFollow) {
        this.grounded = false;
        // clamped: clipping a ramp's SIDE snaps y up a step in one frame, and
        // an unclamped climb rate there once turned into a moon launch
        this.vy = clamp(groundVy, 0, MAX_LAUNCH);
        this.airTime = 0;
        if (this.vy > 2.5) ev.jumped = true;
      } else if (gY > this.pos.y) {
        // ride up at a capped rate instead of teleporting — a ramp's side edge
        // is a height cliff, and the old instant snap was the launch-spike bug
        const step = Math.min(gY - this.pos.y, MAX_CLIMB * dt);
        this.pos.y += step;
        groundVy = step / Math.max(dt, 1e-4);
      } else {
        groundVy = newGroundVy;
        this.pos.y = gY;
      }
    }
    if (!this.grounded) {
      this.vy -= GRAV * dt;
      this.pos.y += this.vy * dt;
      this.airTime += dt;
      if (this.pos.y <= gY) {
        this.pos.y = gY;
        this.grounded = true;
        ev.landed = true;
        ev.airTime = this.airTime;
        springV -= Math.min(Math.abs(this.vy), 14) * 0.09;
        this.vy = 0;
        groundVy = 0;
      }
    }

    /* ---- visual suspension + tilt ---- */
    springV += (-springY * 90 - springV * 9) * dt;
    springY = clamp(springY + springV * dt, -0.45, 0.45);

    const d = t.dir(_dir);
    if (this.grounded) {
      const hF = heightAt(this.pos.x + d.x * 1.7, this.pos.z + d.z * 1.7);
      const hB = heightAt(this.pos.x - d.x * 1.7, this.pos.z - d.z * 1.7);
      pitch += ((-Math.atan2(hF - hB, 3.4)) - pitch) * damp(14, dt);
    } else {
      pitch += (clamp(-this.vy * 0.045, -0.5, 0.4) - pitch) * damp(3.5, dt);
    }

    const accel = (this.speed - prevSpeed) / Math.max(dt, 1e-4);
    lean += (clamp(accel * -0.01, -0.14, 0.14) - lean) * damp(6, dt);

    group.position.set(this.pos.x, this.pos.y, this.pos.z);
    group.rotation.order = 'YXZ';
    group.rotation.y = this.yaw;
    group.rotation.x = pitch;
    body.position.y = 1.35 + springY;
    body.rotation.x = lean;
    body.rotation.z = -inp.steer * 0.13 * speedFactor;

    wheelSpin += (this.speed / WHEEL_R) * dt;
    for (const w of wheels) {
      w.tire.rotation.x = wheelSpin;
      w.hub.rotation.x = wheelSpin;
      w.pivot.rotation.y = w.front ? inp.steer * -0.42 : 0;
    }

    shadow.position.y = gY - this.pos.y + 0.03;
    const shScale = clamp(1 - (this.pos.y - gY) * 0.07, 0.45, 1);
    shadow.scale.set(shScale, shScale, 1);
    shadow.material.opacity = 0.3 * shScale;

    return ev;
  };

  /* ---- chase camera: fixed follow, no orbit — one less thing to fumble ---- */
  const camPos = new THREE.Vector3(0, 6, 32);
  const camLook = new THREE.Vector3();
  let fov = 55;

  t.updateCam = function (camera, dt) {
    const d = t.dir(_dir);
    _v.set(
      this.pos.x - d.x * 10.5,
      5.1 + this.pos.y * 0.35 + heightAt(this.pos.x - d.x * 8, this.pos.z - d.z * 8) * 0.5,
      this.pos.z - d.z * 10.5
    );
    // the camera may swing wide, but never inside stands, fences, or trees
    const wp = collide(_v.x, _v.z, 0.4);
    if (wp) { _v.x = wp.x; _v.z = wp.z; }
    camPos.lerp(_v, damp(4, dt));
    _v.set(this.pos.x + d.x * 4.5, this.pos.y + 1.5, this.pos.z + d.z * 4.5);
    camLook.lerp(_v, damp(6, dt));
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    // portrait phones need a wider base FOV or the truck fills the screen
    const baseFov = camera.aspect < 1 ? 66 : 55;
    const wantFov = baseFov + (Math.abs(this.speed) / TOP) * 8;
    if (Math.abs(wantFov - fov) > 0.25) {
      fov = wantFov;
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  };

  /** Jump the camera straight to its follow position (mode entry, teleports). */
  t.snapCam = function (camera) {
    const d = t.dir(_dir);
    camPos.set(this.pos.x - d.x * 10.5, 5.1 + this.pos.y * 0.35, this.pos.z - d.z * 10.5);
    camLook.set(this.pos.x + d.x * 4.5, this.pos.y + 1.5, this.pos.z + d.z * 4.5);
    camera.position.copy(camPos);
    camera.lookAt(camLook);
  };

  return t;
}

const _dir = new THREE.Vector3();
const _v = new THREE.Vector3();
