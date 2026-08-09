// Y-axis billboards for the overworld Pokémon — the Paper Mario trick.
//
// THREE.Sprite full-billboards, which tips backwards under a follow-cam looking
// down. A plane that only spins around Y stays planted on the ground and reads
// as a standing character instead.
//
// Textures are the official artwork downscaled to 96px in a canvas at load time:
// tiny on the GPU, and NearestFilter on a small image gives the chunky look for
// free without shipping a second set of assets.

import * as THREE from 'three';
import { artUrl } from './party.js';

const cache = new Map();
const SIZE = 96;

export function loadSprite(dexId) {
  if (cache.has(dexId)) return cache.get(dexId);
  const tex = new THREE.Texture();
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;

  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = c.height = SIZE;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    // trim the transparent margin the official art carries so the creature
    // fills the billboard instead of floating in the middle of it
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    tex.image = c;
    tex.needsUpdate = true;
  };
  img.onerror = () => { /* leave the texture blank rather than break the scene */ };
  img.src = artUrl(dexId);

  cache.set(dexId, tex);
  return tex;
}

const geo = new THREE.PlaneGeometry(1, 1);

export function makeBillboard(dexId, height = 4) {
  const mat = new THREE.MeshBasicMaterial({
    map: loadSprite(dexId),
    transparent: true,
    alphaTest: 0.45,          // beats transparent-sorting: no popping between overlaps
    side: THREE.DoubleSide,
    depthWrite: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.set(height, height, 1);
  mesh.userData.dex = dexId;

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 10),
    new THREE.MeshBasicMaterial({ color: 0x102030, transparent: true, opacity: 0.28, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;

  const group = new THREE.Group();
  group.add(mesh, shadow);
  group.userData = { sprite: mesh, shadow, height };
  return group;
}

/** Face the camera, spinning only around Y so it stays upright on the ground. */
export function faceCamera(group, camera) {
  const s = group.userData.sprite;
  s.position.y = group.userData.height / 2;
  s.rotation.y = Math.atan2(camera.position.x - group.position.x, camera.position.z - group.position.z);
  group.userData.shadow.position.y = 0.07;
  group.userData.shadow.scale.setScalar(group.userData.height);
}

export function setSprite(group, dexId, height) {
  group.userData.sprite.material.map = loadSprite(dexId);
  group.userData.sprite.material.needsUpdate = true;
  if (height) {
    group.userData.height = height;
    group.userData.sprite.scale.set(height, height, 1);
  }
}
