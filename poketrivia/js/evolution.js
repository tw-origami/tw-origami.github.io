// The evolution ceremony.
//
// Every route to an evolution — level-up in battle, level-up on a catch, using
// a stone from the team screen — funnels through showEvolution(), so it always
// looks like the event it is instead of a line of text. Holding the real games'
// convention: it can be cancelled mid-flash ("B to stop"), which returns false
// and the caller undoes the change.

import { artUrl, species, learnMove } from './party.js';
import * as audio from './audio.js';

const wait = (ms) => new Promise(r => setTimeout(r, ms));

let panel = null;
function ensurePanel() {
  if (panel) return panel;
  panel = document.createElement('div');
  panel.id = 'evo';
  panel.className = 'hidden';
  panel.innerHTML = `
    <div class="evoStage">
      <div class="evoGlow"></div>
      <img id="evoFrom" alt="">
      <img id="evoTo" alt="">
    </div>
    <div class="evoMsg" id="evoMsg"></div>
    <button id="evoCancel" type="button">B — Stop!</button>`;
  document.body.appendChild(panel);
  return panel;
}

/**
 * Play the ceremony. Resolves true if it completed, false if the player
 * cancelled during the flashing phase (the caller reverts the dex change).
 */
export function showEvolution(ev) {
  ensurePanel();
  const from = document.getElementById('evoFrom');
  const to = document.getElementById('evoTo');
  const msg = document.getElementById('evoMsg');
  const cancelBtn = document.getElementById('evoCancel');

  from.src = artUrl(ev.fromDex);
  to.src = artUrl(ev.dex);
  panel.className = 'phase-wonder';
  msg.innerHTML = `What? <b>${ev.from.toUpperCase()}</b> is changing!`;

  return new Promise((resolve) => {
    let cancelled = false, finished = false;

    const onKey = (e) => { if (e.code === 'KeyB' || e.code === 'Escape') doCancel(); };
    const doCancel = () => { if (!finished) cancelled = true; };
    cancelBtn.onclick = doCancel;
    addEventListener('keydown', onKey);

    const cleanup = (ok) => {
      removeEventListener('keydown', onKey);
      panel.classList.add('hidden');
      resolve(ok);
    };

    (async () => {
      audio.encounter();
      await wait(1400);

      // the flashing phase — cancellable
      panel.className = 'phase-flash';
      for (let i = 0; i < 6; i++) {
        if (cancelled) {
          panel.className = 'phase-wonder';
          msg.innerHTML = `…<b>${ev.from.toUpperCase()}</b> stopped changing. It looks a little relieved.`;
          audio.blip();
          await wait(1600);
          return cleanup(false);
        }
        panel.classList.toggle('swap');
        audio.shake();
        await wait([420, 380, 330, 280, 220, 180][i]);
      }

      finished = true;
      panel.className = 'phase-done';
      audio.fanfare();
      msg.innerHTML = `Congratulations! Your <b>${ev.from.toUpperCase()}</b> evolved into <b>${ev.to.toUpperCase()}</b>!`;
      await wait(2600);
      cleanup(true);
    })();
  });
}

/* ============================ learning a move ============================ */

/**
 * Ask which move to give up. A Pokémon can only hold four, so learning a fifth
 * is a real decision — exactly as in the games. Resolves the slot to overwrite,
 * or -1 to keep the current set and skip the new move.
 */
export function askLearnMove(mon, moveName, atDex = null) {
  const M = window.PL_MOVES ?? {};
  const incoming = M[moveName];
  let box = document.getElementById('learnBox');
  if (!box) {
    box = document.createElement('div');
    box.id = 'learnBox';
    box.className = 'hidden';
    box.innerHTML = `<div class="learnCard">
      <h4 id="learnTitle"></h4>
      <div class="learnNew" id="learnNew"></div>
      <p class="learnAsk">It already knows four moves. Which should it forget?</p>
      <div class="learnGrid" id="learnGrid"></div>
      <button id="learnSkip" class="ghost">Don't learn it</button>
    </div>`;
    document.body.appendChild(box);
  }

  const TYPE_COLORS = {
    normal: '#a8a878', fire: '#f08030', water: '#6890f0', electric: '#f8d030',
    grass: '#78c850', ice: '#98d8d8', fighting: '#c03028', poison: '#a040a0',
    ground: '#e0c068', flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
    rock: '#b8a038', ghost: '#705898', dragon: '#7038f8', dark: '#705848',
    steel: '#b8b8d0', fairy: '#ee99ac',
  };
  const card = (mv, extra = '') =>
    `<div class="mvCard ${extra}">
      <b>${mv.label.toUpperCase()}</b>
      <span class="mvType" style="background:${TYPE_COLORS[mv.type] ?? '#888'}">${mv.type}</span>
      <small>${mv.power > 0 ? 'power ' + mv.power : 'status'} · ${mv.acc == null ? 'never misses' : mv.acc + '% acc'} · ${mv.pp} PP</small>
      <em>${mv.short ?? ''}</em>
    </div>`;

  document.getElementById('learnTitle').innerHTML =
    `<b>${species(atDex ?? mon.dex).name.toUpperCase()}</b> wants to learn <b>${incoming.label.toUpperCase()}</b>!`;
  document.getElementById('learnNew').innerHTML = card(incoming, 'incoming');

  const grid = document.getElementById('learnGrid');
  grid.innerHTML = '';
  box.classList.remove('hidden');
  audio.levelUp();

  return new Promise((resolve) => {
    mon.moves.forEach((name, i) => {
      const mv = M[name];
      if (!mv) return;
      const b = document.createElement('button');
      b.className = 'mvPick';
      b.innerHTML = card(mv);
      b.onclick = () => { box.classList.add('hidden'); resolve(i); };
      grid.appendChild(b);
    });
    document.getElementById('learnSkip').onclick = () => { box.classList.add('hidden'); resolve(-1); };
  });
}

/**
 * Run a list of grantXp events in order: level, then any move learned at that
 * level, then evolution — the same sequence the real games use.
 * `mon` is the saved record, so everything here persists.
 */
export async function playXpEvents(events, mon, say) {
  for (const ev of events) {
    if (ev.type === 'level') {
      audio.levelUp();
      if (say) { say(`<b>${species(mon.dex).name.toUpperCase()}</b> grew to level ${ev.level}!`); await wait(1000); }

    } else if (ev.type === 'learn') {
      if (!ev.full) {
        learnMove(mon, ev.move);                       // free slot — just take it
        audio.levelUp();
        if (say) {
          say(`<b>${species(ev.atDex ?? mon.dex).name.toUpperCase()}</b> learned <b>${(window.PL_MOVES?.[ev.move]?.label ?? ev.move).toUpperCase()}</b>!`);
          await wait(1400);
        }
      } else {
        const slot = await askLearnMove(mon, ev.move, ev.atDex);
        if (slot >= 0) {
          const forgot = window.PL_MOVES?.[mon.moves[slot]]?.label ?? mon.moves[slot];
          learnMove(mon, ev.move, slot);
          audio.fanfare();
          if (say) {
            say(`It forgot <b>${forgot.toUpperCase()}</b> and learned <b>${(window.PL_MOVES?.[ev.move]?.label ?? ev.move).toUpperCase()}</b>!`);
            await wait(1500);
          }
        } else if (say) {
          say(`<b>${species(ev.atDex ?? mon.dex).name.toUpperCase()}</b> did not learn the new move.`);
          await wait(1200);
        }
      }

    } else if (ev.type === 'evolve') {
      const ok = await showEvolution(ev);
      if (!ok && mon) mon.dex = ev.fromDex;     // the player said no — undo it
    }
  }
}
