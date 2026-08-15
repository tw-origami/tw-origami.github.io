// The stadium: dirt arena, ramps, walls, grandstands full of crowd, jumbotron,
// light towers, dusk sky. Everything flat-shaded Lambert at 432p — that combo,
// not jagged edges, is what reads as N64.
//
// The ramps exist twice — as data (RAMPS drives heightAt, which the truck
// physics samples) and as meshes — but both are built from the same array in
// this file, so the picture can never drift from the physics.

import * as THREE from 'three';
import { drawGlyph } from './glyphs.js';

export const ARENA = { hw: 45, hd: 30, r: 14 };   // half-width, half-depth, corner radius

// Symmetric "tent" ramps: ground rises to a ridge at the middle of `l`, then
// falls away. Hittable from either side, no cliffs a kid can drive into.
// yaw 0 = you drive along z to jump it; PI/2 = along x.
export const RAMPS = [
  { x: 0,   z: 12,  w: 11, l: 18, h: 3.6, yaw: 0,           color: 0xe8703a },   // the big one
  { x: -27, z: 0,   w: 8,  l: 12, h: 2.6, yaw: Math.PI / 2, color: 0x3fae4c },
  { x: 27,  z: 0,   w: 8,  l: 12, h: 2.6, yaw: Math.PI / 2, color: 0x2f6fe0 },
  { x: -18, z: -24, w: 7,  l: 10, h: 2.2, yaw: Math.PI / 2, color: 0xf4c531 },
];

// Where the answer gates live (gates.js builds the meshes; rounds.js runs the game).
export const GATE = { z: -14, xs: [-9, 0, 9], halfW: 3.6, clearR: 10 };

/** Arena floor height at a point — 0 dirt, or the side of a ramp. */
export function heightAt(x, z) {
  let y = 0;
  for (const r of RAMPS) {
    const dx = x - r.x, dz = z - r.z;
    const c = Math.cos(r.yaw), s = Math.sin(r.yaw);
    const lx = c * dx + s * dz;        // across the ramp (width)
    const lz = -s * dx + c * dz;       // along the drive direction (length)
    if (Math.abs(lx) < r.w / 2 && Math.abs(lz) < r.l / 2) {
      y = Math.max(y, r.h * (1 - Math.abs(lz) / (r.l / 2)));
    }
  }
  return y;
}

/**
 * Signed-distance test against the rounded-rect wall, inset by margin m.
 * Returns null when inside, else the corrected position and the wall normal.
 */
export function wallPush(x, z, m = 2) {
  const hw = ARENA.hw - m, hd = ARENA.hd - m, r = ARENA.r;
  const qx = Math.abs(x) - (hw - r), qz = Math.abs(z) - (hd - r);
  const mx = Math.max(qx, 0), mz = Math.max(qz, 0);
  const outside = Math.hypot(mx, mz) + Math.min(Math.max(qx, qz), 0) - r;
  if (outside <= 0) return null;
  let nx, nz;
  if (mx > 0 || mz > 0) {
    const L = Math.hypot(mx, mz) || 1;
    nx = (mx / L) * Math.sign(x || 1);
    nz = (mz / L) * Math.sign(z || 1);
  } else if (qx > qz) { nx = Math.sign(x || 1); nz = 0; }
  else { nx = 0; nz = Math.sign(z || 1); }
  return { x: x - nx * outside, z: z - nz * outside, nx, nz };
}

/* ---------------- canvas textures ---------------- */

function makeTex(size, fn) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  fn(c.getContext('2d'), size);
  const tex = new THREE.CanvasTexture(c);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const dirtTex = () => makeTex(64, (g, s) => {
  g.fillStyle = '#8a5a34'; g.fillRect(0, 0, s, s);
  const vars = ['#7a4d2a', '#96653c', '#6d4325', '#a06f42', '#835430'];
  for (let i = 0; i < 380; i++) {
    g.fillStyle = vars[Math.floor(Math.random() * vars.length)];
    const w = 1 + Math.random() * 2.4;
    g.fillRect(Math.random() * s, Math.random() * s, w, w);
  }
  // faint tire scuffs
  g.strokeStyle = 'rgba(60,36,18,.5)';
  for (let i = 0; i < 6; i++) {
    g.beginPath();
    const y = Math.random() * s;
    g.moveTo(0, y); g.quadraticCurveTo(s / 2, y + (Math.random() - 0.5) * 10, s, y);
    g.stroke();
  }
});

/* ---------------- sky dome (static dusk — the storyboard's golden hour) ---------------- */

const SKY_VERT = `
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const SKY_FRAG = `
  uniform vec3 topColor; uniform vec3 midColor; uniform vec3 bottomColor;
  varying vec3 vWorld;
  void main() {
    float h = clamp(normalize(vWorld).y, -1.0, 1.0);
    vec3 c = h > 0.0 ? mix(midColor, topColor, pow(h, 0.7)) : mix(midColor, bottomColor, -h);
    c = floor(c * 32.0) / 32.0;   // chunky quantize = retro banding
    gl_FragColor = vec4(c, 1.0);
  }
`;

/* ---------------- build ---------------- */

export function buildWorld(scene) {
  scene.fog = new THREE.Fog(0xb06a3e, 80, 260);

  const sun = new THREE.DirectionalLight(0xffd9a0, 0.95);
  sun.position.set(30, 42, 18);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x8ea6ff, 0.32);
  fill.position.set(-24, 30, -30);
  scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xffc9a0, 0x5a3a28, 0.42));

  const mat = (opts) => new THREE.MeshLambertMaterial({ flatShading: true, ...opts });

  /* ---- ground ---- */
  const outer = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), mat({ color: 0x4a3a2e }));
  outer.rotation.x = -Math.PI / 2;
  outer.position.y = -0.06;
  scene.add(outer);

  const dirt = dirtTex();
  dirt.repeat.set(13, 9);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ARENA.hw * 2 + 4, ARENA.hd * 2 + 4), mat({ map: dirt }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  /* ---- ramps (from the same RAMPS array the physics uses) ---- */
  for (const r of RAMPS) {
    const profile = new THREE.Shape();
    profile.moveTo(-r.l / 2, 0);
    profile.lineTo(r.l / 2, 0);
    profile.lineTo(0, r.h);
    profile.closePath();
    const geo = new THREE.ExtrudeGeometry(profile, { depth: r.w, bevelEnabled: false });
    geo.translate(0, 0, -r.w / 2);
    geo.rotateY(Math.PI / 2);          // length along z, width along x — matches heightAt
    const m = new THREE.Mesh(geo, mat({ color: r.color }));
    m.position.set(r.x, 0.01, r.z);
    m.rotation.y = r.yaw;
    scene.add(m);
    // white ridge stripe so the launch line reads from a distance
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(r.w, 0.12, 0.5), mat({ color: 0xfff7e8 }));
    stripe.position.set(r.x, r.h + 0.02, r.z);
    stripe.rotation.y = r.yaw;
    scene.add(stripe);
  }

  /* ---- barrier ring (one InstancedMesh, alternating red/white) ---- */
  const wallPts = [];
  {
    const hw = ARENA.hw, hd = ARENA.hd, r = ARENA.r, step = 3.8;
    const seg = (x0, z0, x1, z1) => {
      const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / step));
      for (let i = 0; i < n; i++) {
        const t = (i + 0.5) / n;
        wallPts.push({ x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t, a: Math.atan2(x1 - x0, z1 - z0) + Math.PI / 2 });
      }
    };
    const arc = (cx, cz, a0, a1) => {
      const L = Math.abs(a1 - a0) * r, n = Math.max(1, Math.round(L / step));
      for (let i = 0; i < n; i++) {
        const a = a0 + (a1 - a0) * ((i + 0.5) / n);
        wallPts.push({ x: cx + Math.cos(a) * r, z: cz + Math.sin(a) * r, a: -a });
      }
    };
    seg(-(hw - r), hd, hw - r, hd);
    arc(hw - r, hd - r, Math.PI / 2, 0);
    seg(hw, hd - r, hw, -(hd - r));
    arc(hw - r, -(hd - r), 0, -Math.PI / 2);
    seg(hw - r, -hd, -(hw - r), -hd);
    arc(-(hw - r), -(hd - r), -Math.PI / 2, -Math.PI);
    seg(-hw, -(hd - r), -hw, hd - r);
    arc(-(hw - r), hd - r, Math.PI, Math.PI / 2);
  }
  const wall = new THREE.InstancedMesh(
    new THREE.BoxGeometry(3.4, 1.15, 0.7),
    mat({ color: 0xffffff }),
    wallPts.length
  );
  {
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler(), S = new THREE.Vector3(1, 1, 1);
    const C = new THREE.Color();
    wallPts.forEach((p, i) => {
      Q.setFromEuler(E.set(0, p.a, 0));
      wall.setMatrixAt(i, M.compose(new THREE.Vector3(p.x, 0.55, p.z), Q, S));
      wall.setColorAt(i, C.setHex(i % 2 ? 0xd43c2a : 0xfff7e8));
    });
    wall.instanceColor.needsUpdate = true;
  }
  scene.add(wall);

  /* ---- grandstands + crowd ---- */
  const standMat = mat({ color: 0x5a6b8c });
  const standMat2 = mat({ color: 0x49587a });
  const seats = [];   // collect positions for the crowd instancing
  const bank = (cx, cz, len, ry) => {
    // ry turns local +z toward the arena, so the crowd planes face the action;
    // rows step BACK along local -z, rising away from the field.
    const g = new THREE.Group();
    for (let row = 0; row < 4; row++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(len, 1.05, 2.2), row % 2 ? standMat : standMat2);
      box.position.set(0, row * 0.95 + 0.5, -row * 2.1);
      g.add(box);
      const n = Math.floor(len / 0.8);
      for (let i = 0; i < n; i++) {
        if (Math.random() < 0.12) continue;               // a few empty seats read as real
        seats.push({
          lx: -len / 2 + (i + 0.5) * 0.8 + (Math.random() - 0.5) * 0.3,
          ly: row * 0.95 + 1.45,
          lz: -row * 2.1 + (Math.random() - 0.5) * 0.5,
          g,
        });
      }
    }
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(len, 1.6, 9), mat({ color: 0x3a4562 }));
    skirt.position.set(0, -0.6, -3.2);
    g.add(skirt);
    g.position.set(cx, 0, cz);
    g.rotation.y = ry;
    g.updateMatrixWorld(true);
    scene.add(g);
  };
  bank(0, ARENA.hd + 5, 74, Math.PI);          // north bank: +z side, faces -z
  bank(0, -(ARENA.hd + 5), 74, 0);             // south bank: -z side, faces +z
  bank(ARENA.hw + 5, 0, 44, -Math.PI / 2);     // east bank: +x side, faces -x
  bank(-(ARENA.hw + 5), 0, 44, Math.PI / 2);   // west bank: -x side, faces +x

  const CROWD_COLORS = [0xff5330, 0xffcf3f, 0x3fae4c, 0x2f6fe0, 0x8e4ec6, 0xff7ab8, 0xfff7e8, 0x4fd8e8, 0xf07820];
  const crowd = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.62, 0.95),
    new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }),
    seats.length
  );
  {
    const M = new THREE.Matrix4(), S = new THREE.Vector3(1, 1, 1), C = new THREE.Color();
    const P = new THREE.Vector3(), Q = new THREE.Quaternion();
    seats.forEach((s, i) => {
      P.set(s.lx, s.ly, s.lz).applyMatrix4(s.g.matrixWorld);
      Q.copy(s.g.quaternion);
      crowd.setMatrixAt(i, M.compose(P, Q, S));
      crowd.setColorAt(i, C.setHex(CROWD_COLORS[Math.floor(Math.random() * CROWD_COLORS.length)]));
    });
    crowd.instanceColor.needsUpdate = true;
  }
  crowd.frustumCulled = false;
  scene.add(crowd);

  /* ---- light towers ---- */
  const towerMat = mat({ color: 0x3a4562 });
  const headMat = new THREE.MeshBasicMaterial({ color: 0xfff2c8 });
  for (const [tx, tz] of [[-38, -36], [38, -36], [-38, 36], [38, 36]]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 17, 6), towerMat);
    pole.position.set(tx, 8.5, tz);
    scene.add(pole);
    const head = new THREE.Mesh(new THREE.BoxGeometry(4.4, 2.2, 0.8), headMat);
    head.position.set(tx, 17.6, tz);
    head.lookAt(0, 2, 0);
    scene.add(head);
  }

  /* ---- jumbotron ---- */
  const jCanvas = document.createElement('canvas');
  jCanvas.width = 256; jCanvas.height = 128;
  const jCtx = jCanvas.getContext('2d');
  const jTex = new THREE.CanvasTexture(jCanvas);
  jTex.magFilter = THREE.NearestFilter;
  jTex.minFilter = THREE.NearestFilter;
  jTex.generateMipmaps = false;
  jTex.colorSpace = THREE.SRGBColorSpace;

  const jGroup = new THREE.Group();
  const jFrame = new THREE.Mesh(new THREE.BoxGeometry(17, 9.6, 1.2), mat({ color: 0x2b3350 }));
  jGroup.add(jFrame);
  const jScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(15.6, 8.2),
    new THREE.MeshBasicMaterial({ map: jTex })     // emissive: the screen glows at dusk
  );
  jScreen.position.z = 0.75;
  jGroup.add(jScreen);
  for (const lx of [-6, 6]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.9, 8, 0.9), towerMat);
    leg.position.set(lx, -8, 0);
    jGroup.add(leg);
  }
  jGroup.position.set(0, 12.4, ARENA.hd + 13.5);
  jGroup.rotation.y = Math.PI;                     // face the arena
  scene.add(jGroup);

  function jBase() {
    jCtx.fillStyle = '#101a38';
    jCtx.fillRect(0, 0, 256, 128);
    jCtx.strokeStyle = '#4fd8e8';
    jCtx.lineWidth = 4;
    jCtx.strokeRect(4, 4, 248, 120);
  }
  const jumbotron = {
    setTarget(item) {
      jBase();
      drawGlyph(jCtx, item, 74, 10, 108);
      jCtx.font = '900 34px -apple-system, system-ui, sans-serif';
      jCtx.textAlign = 'center'; jCtx.textBaseline = 'middle';
      jCtx.fillText('👀', 34, 64);
      jCtx.fillText('👉', 226, 64);
      jTex.needsUpdate = true;
    },
    idle(stars) {
      jBase();
      jCtx.font = '900 44px -apple-system, system-ui, sans-serif';
      jCtx.textAlign = 'center'; jCtx.textBaseline = 'middle';
      jCtx.fillText('🛻', 128, 46);
      jCtx.font = '900 30px -apple-system, system-ui, sans-serif';
      jCtx.fillStyle = '#ffcf3f';
      jCtx.fillText('⭐ ' + stars, 128, 96);
      jTex.needsUpdate = true;
    },
    celebrate() {
      jBase();
      jCtx.font = '900 52px -apple-system, system-ui, sans-serif';
      jCtx.textAlign = 'center'; jCtx.textBaseline = 'middle';
      jCtx.fillText('🎉 ⭐ 🎉', 128, 64);
      jTex.needsUpdate = true;
    },
  };
  jumbotron.idle(0);

  /* ---- sky ---- */
  const skyUniforms = {
    topColor: { value: new THREE.Color(0x2a2f7e) },
    midColor: { value: new THREE.Color(0xe0813f) },
    bottomColor: { value: new THREE.Color(0x6a3a22) },
  };
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(320, 20, 14),
    new THREE.ShaderMaterial({ uniforms: skyUniforms, vertexShader: SKY_VERT, fragmentShader: SKY_FRAG, side: THREE.BackSide, depthWrite: false, fog: false })
  );
  dome.renderOrder = -3;
  scene.add(dome);

  const cloudMat = new THREE.MeshBasicMaterial({ color: 0xf0c9a0, fog: false });
  const clouds = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const cloud = new THREE.Group();
    const puffs = 3 + Math.floor(Math.random() * 4);
    for (let p = 0; p < puffs; p++) {
      const r = 6 + Math.random() * 7;
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), cloudMat);
      puff.position.set((p - puffs / 2) * 8 + Math.random() * 4, Math.random() * 3, Math.random() * 6 - 3);
      puff.scale.set(1, 0.5, 0.8);
      cloud.add(puff);
    }
    cloud.position.set((Math.random() - 0.5) * 420, 75 + Math.random() * 50, (Math.random() - 0.5) * 420);
    clouds.add(cloud);
  }
  scene.add(clouds);

  /* ---- live behavior ---- */
  let cheerTimer = 0;
  const crowdBaseY = crowd.position.y;

  return {
    heightAt, wallPush, GATE, RAMPS, jumbotron,

    /** Make the stands go wild for a moment. */
    cheer(seconds = 1.5) { cheerTimer = Math.max(cheerTimer, seconds); },

    update(dt, t, camera) {
      for (const c of clouds.children) {
        c.position.x += dt * 1.4;
        if (c.position.x > 240) c.position.x = -240;
      }
      dome.position.copy(camera.position);
      cheerTimer = Math.max(0, cheerTimer - dt);
      const amp = cheerTimer > 0 ? 0.3 : 0.06;
      const speed = cheerTimer > 0 ? 9 : 2;
      crowd.position.y = crowdBaseY + Math.abs(Math.sin(t * speed)) * amp;
    },
  };
}
