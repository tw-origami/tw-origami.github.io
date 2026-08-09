// Wild Pokémon that wander the overworld as billboards, plus contact detection.
//
// Design rule from the plan: roamers NEVER chase. Walking past one is always an
// option, which is what keeps the quiz rate down to something a kid can sustain
// for an hour. Encounters are chosen by the player, not inflicted on them.

import * as THREE from 'three';
import { makeBillboard, faceCamera, setSprite } from './billboard.js';
import { heightAt, terrainOk, slopeAt } from './world.js';
import { ZONES, ZONE_BY_ID, SPAWNS, GRASS_PATCHES, inTallGrass, zoneAt, WATER_Y } from './zones.js';
import { species } from './party.js';
import { makeRng, WORLD_SEED, rand, clamp, damp } from './rng.js';

const MAX_ACTIVE = 7;
const SPAWN_MIN = 26, SPAWN_MAX = 62;   // distance from the player
const DESPAWN = 95;
const CONTACT = 2.4;

/** Bigger species stand taller in the overworld — height in world units. */
function spriteHeight(dexId) {
  const s = species(dexId);
  if (!s) return 3.5;
  return clamp(2.2 + s.height * 1.15, 2.4, 7.5);
}

export function createRoamers(scene) {
  const rng = makeRng(WORLD_SEED + 401);
  const pool = [];
  const active = [];
  let cooldown = 0;

  function acquire(dexId) {
    const h = spriteHeight(dexId);
    let g = pool.pop();
    if (g) { setSprite(g, dexId, h); g.visible = true; }
    else { g = makeBillboard(dexId, h); scene.add(g); }
    g.userData.height = h;
    return g;
  }

  function release(r) {
    r.group.visible = false;
    pool.push(r.group);
    const i = active.indexOf(r);
    if (i >= 0) active.splice(i, 1);
  }

  /** Find a legal patch of ground near the player to drop a Pokémon onto. */
  function findSpot(px, pz) {
    for (let t = 0; t < 30; t++) {
      const a = rand() * Math.PI * 2;
      const d = SPAWN_MIN + rand() * (SPAWN_MAX - SPAWN_MIN);
      const x = px + Math.cos(a) * d, z = pz + Math.sin(a) * d;
      const y = heightAt(x, z);
      if (y < WATER_Y + 1.4 || slopeAt(x, z) > 1.0) continue;
      return { x, z, y };
    }
    return null;
  }

  function spawnOne(px, pz) {
    const spot = findSpot(px, pz);
    if (!spot) return;
    const zone = zoneAt(spot.x, spot.z);
    const table = SPAWNS[zone.id] ?? SPAWNS.hub;
    const grass = inTallGrass(spot.x, spot.z);
    const list = grass ? table.grass : table.open;
    if (!list?.length) return;
    const entry = rng.weighted(list);
    const level = rng.int(entry.lv[0], entry.lv[1]);
    const group = acquire(entry.dex);
    group.position.set(spot.x, spot.y, spot.z);
    active.push({
      group, dex: entry.dex, level, zone: zone.id, rare: !!grass,
      home: { x: spot.x, z: spot.z },
      dir: rand() * Math.PI * 2,
      wait: rand() * 2,
      bob: rand() * 10,
    });
  }

  return {
    active,

    /** Clear everything — used when an encounter ends or the player teleports. */
    reset() { while (active.length) release(active[0]); },

    update(dt, player, camera, blocked) {
      cooldown -= dt;
      const px = player.pos.x, pz = player.pos.z;

      for (let i = active.length - 1; i >= 0; i--) {
        const r = active[i];
        const dx = r.group.position.x - px, dz = r.group.position.z - pz;
        if (Math.hypot(dx, dz) > DESPAWN) { release(r); continue; }

        // idle wander: short hops around a home point, pausing in between
        r.wait -= dt;
        if (r.wait <= 0) {
          r.dir += (rand() - 0.5) * 2.2;
          r.wait = 0.8 + rand() * 2.4;
        }
        const speed = 1.7;
        const nx = r.group.position.x + Math.cos(r.dir) * speed * dt;
        const nz = r.group.position.z + Math.sin(r.dir) * speed * dt;
        const nearHome = Math.hypot(nx - r.home.x, nz - r.home.z) < 9;
        if (nearHome && terrainOk(nx, nz, r.group.position.y)) {
          r.group.position.x = nx;
          r.group.position.z = nz;
        } else {
          r.dir += 1.9;   // turn back toward home
        }
        r.group.position.y = heightAt(r.group.position.x, r.group.position.z);

        // gentle hover so they read as alive even while standing still
        r.bob += dt * 3.2;
        r.group.userData.sprite.position.y =
          r.group.userData.height / 2 + Math.sin(r.bob) * 0.14;
        faceCamera(r.group, camera);
        r.group.userData.sprite.position.y += Math.sin(r.bob) * 0.14;
      }

      if (!blocked && active.length < MAX_ACTIVE && cooldown <= 0) {
        spawnOne(px, pz);
        cooldown = 0.7;
      }
    },

    /** The roamer the player just bumped into, if any. */
    contact(player) {
      for (const r of active) {
        const d = Math.hypot(r.group.position.x - player.pos.x, r.group.position.z - player.pos.z);
        if (d < CONTACT + r.group.userData.height * 0.12) return r;
      }
      return null;
    },

    remove(r) { release(r); },

    /** Nearest roamer within `range`, for the compass and the "!" prompt. */
    nearest(player, range = 12) {
      let best = null, bestD = range;
      for (const r of active) {
        const d = Math.hypot(r.group.position.x - player.pos.x, r.group.position.z - player.pos.z);
        if (d < bestD) { bestD = d; best = r; }
      }
      return best;
    },
  };
}
