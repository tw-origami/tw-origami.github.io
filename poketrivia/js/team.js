// The team screen: who you have, who's in the box, and the Pokédex.
//
// Three tabs. Team shows the six you're carrying with everything a player needs
// to plan (stats, moves, XP, and how each one evolves). Box finally makes
// catches beyond six reachable. Pokédex is the collection: full art if caught,
// a silhouette if only seen. Stones and cords are used from here — the game
// never evolves anything with an item on its own.

import * as party from './party.js';
import * as save from './save.js';
import { showEvolution } from './evolution.js';
import * as audio from './audio.js';

const $ = (id) => document.getElementById(id);

const TYPE_COLORS = {
  normal: '#a8a878', fire: '#f08030', water: '#6890f0', electric: '#f8d030',
  grass: '#78c850', ice: '#98d8d8', fighting: '#c03028', poison: '#a040a0',
  ground: '#e0c068', flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
  rock: '#b8a038', ghost: '#705898', dragon: '#7038f8', dark: '#705848',
  steel: '#b8b8d0', fairy: '#ee99ac',
};

let panel = null, open = false, profile = null, tab = 'team', onCloseCb = null;

export const teamOpen = () => open;

function ensurePanel() {
  if (panel) return panel;
  panel = document.createElement('div');
  panel.id = 'team';
  panel.className = 'hidden';
  panel.innerHTML = `
    <div class="teamHead">
      <div class="teamTabs">
        <button data-tab="team" class="on">Team</button>
        <button data-tab="box">Box <span id="boxCount"></span></button>
        <button data-tab="dex">Pokédex <span id="dexCount"></span></button>
      </div>
      <div class="teamItems" id="teamItems"></div>
      <button id="teamClose" type="button">✕</button>
    </div>
    <div class="teamBody" id="teamBody"></div>`;
  document.body.appendChild(panel);

  panel.querySelectorAll('.teamTabs button').forEach(b => {
    b.onclick = () => { tab = b.dataset.tab; render(); };
  });
  $('teamClose').onclick = closeTeam;
  addEventListener('keydown', (e) => {
    if (open && (e.code === 'Escape' || e.code === 'Tab')) { e.preventDefault(); closeTeam(); }
  });
  return panel;
}

export function openTeam(prof, onClose) {
  profile = prof;
  onCloseCb = onClose ?? null;
  ensurePanel();
  open = true;
  tab = 'team';
  render();
  panel.classList.remove('hidden');
  audio.blip();
}

export function closeTeam() {
  if (!open) return;
  open = false;
  panel.classList.add('hidden');
  save.saveProfile(profile);
  onCloseCb?.();
}

/* ============================ shared bits ============================ */

const typeChips = (types) => types.map(t =>
  `<span class="typeChip sm" style="background:${TYPE_COLORS[t] ?? '#888'}">${t}</span>`).join('');

function itemsHtml() {
  const bag = profile.items ?? {};
  const owned = Object.entries(party.EVO_ITEMS)
    .map(([key, it]) => ({ key, ...it, n: bag[key] ?? 0 }))
    .filter(it => it.n > 0);
  if (!owned.length) return '<span class="noItems">No evolution items yet — win badges and study!</span>';
  return owned.map(it =>
    `<span class="itemChip" title="${it.label}">${it.emoji}${it.n > 1 ? '×' + it.n : ''}</span>`).join('');
}

/** "Evolves at Lv16" / "Needs a Fire Stone 🔥" / "Fully evolved". */
function evoHint(mon) {
  const opts = party.evolutionOptions(mon);
  if (!opts.length) return '<span class="evoHint done">Fully evolved</span>';
  return opts.map(o => {
    if (o.level != null) {
      return mon.level >= o.level
        ? `<span class="evoHint soon">Evolving soon!</span>`
        : `<span class="evoHint">Evolves at Lv${o.level}</span>`;
    }
    const it = party.EVO_ITEMS[o.item];
    const have = (profile.items?.[o.item] ?? 0) > 0;
    return `<span class="evoHint ${have ? 'ready' : ''}">Needs a ${it?.label ?? o.item} ${it?.emoji ?? ''}${have ? ' — you have one!' : ''}</span>`;
  }).join(' ');
}

/* ============================ tabs ============================ */

function render() {
  panel.querySelectorAll('.teamTabs button').forEach(b =>
    b.classList.toggle('on', b.dataset.tab === tab));
  $('boxCount').textContent = profile.box.length ? `(${profile.box.length})` : '';
  $('dexCount').textContent = `${profile.stats.caughtDex?.length ?? countCaught()}/151`;
  $('teamItems').innerHTML = itemsHtml();
  const body = $('teamBody');
  if (tab === 'team') renderTeam(body);
  else if (tab === 'box') renderBox(body);
  else renderDex(body);
}

function countCaught() {
  const ids = new Set([...profile.party, ...profile.box].map(m => m.dex));
  return ids.size;
}

/* ---------------- team ---------------- */

function renderTeam(body) {
  if (!profile.party.length) {
    body.innerHTML = '<p class="teamEmpty">No Pokémon yet — walk up to one and press the button!</p>';
    return;
  }
  body.innerHTML = profile.party.map((mon, i) => {
    const sp = party.species(mon.dex);
    const hpMax = party.maxHp(mon.dex, mon.level);
    const hpPct = Math.round(100 * Math.max(0, mon.hp) / hpMax);
    const xpNeed = party.xpToNext(mon.level, mon.dex);
    const xpPct = Math.round(100 * Math.min(1, mon.xp / xpNeed));
    const moves = party.knownMoves(mon).map(mv =>
      `<span class="mvRow"><span class="mvType sm" style="background:${TYPE_COLORS[mv.type] ?? '#888'}">${mv.type}</span>
        ${mv.label}<small>${mv.power > 0 ? 'pow ' + mv.power : 'status'}</small></span>`).join('');
    const abil = party.abilitiesFor(mon.dex).filter(a => !a.hidden)[0];
    const usable = Object.keys(party.EVO_ITEMS)
      .filter(item => (profile.items?.[item] ?? 0) > 0 &&
        party.evolutionOptions(mon).some(o => o.item === item));

    return `<div class="monCard" data-i="${i}">
      <div class="monLeft">
        <img src="${party.artUrl(mon.dex)}" alt="${sp.name}">
        <div class="monOrder">
          <button class="ordBtn" data-up="${i}" ${i === 0 ? 'disabled' : ''}>▲</button>
          <button class="ordBtn" data-down="${i}" ${i === profile.party.length - 1 ? 'disabled' : ''}>▼</button>
        </div>
      </div>
      <div class="monMain">
        <div class="monTop"><b>${sp.name.toUpperCase()}</b> <span>Lv${mon.level}</span> ${typeChips(sp.types)}
          ${mon.status ? `<span class="statusChip sm">${mon.status}</span>` : ''}</div>
        <div class="barRow"><span>HP</span><div class="hpBar slim"><div class="hpFill ${hpPct > 50 ? 'good' : hpPct > 20 ? 'warn' : 'low'}" style="width:${hpPct}%"></div></div><small>${Math.max(0, mon.hp)}/${hpMax}</small></div>
        <div class="barRow"><span>XP</span><div class="hpBar slim"><div class="xpFill" style="width:${xpPct}%"></div></div><small>${mon.xp}/${xpNeed}</small></div>
        <div class="monMoves">${moves}</div>
        <div class="monFoot">
          ${abil ? `<span class="abilTag" title="${abil.short ?? ''}">${abil.label}</span>` : ''}
          ${evoHint(mon)}
          ${usable.map(item =>
            `<button class="useItem" data-use="${item}" data-mon="${i}">Use ${party.EVO_ITEMS[item].emoji} ${party.EVO_ITEMS[item].label}</button>`).join('')}
          ${i === 0 ? '<span class="leadTag">LEADS</span>' : ''}
          <button class="toBox" data-tobox="${i}" ${profile.party.length === 1 ? 'disabled title="Your last Pokémon stays with you"' : ''}>To box</button>
        </div>
      </div>
    </div>`;
  }).join('');

  body.querySelectorAll('.ordBtn').forEach(b => b.onclick = () => {
    const i = +(b.dataset.up ?? b.dataset.down);
    const j = b.dataset.up != null ? i - 1 : i + 1;
    [profile.party[i], profile.party[j]] = [profile.party[j], profile.party[i]];
    audio.blip();
    render();
  });
  body.querySelectorAll('.toBox').forEach(b => b.onclick = () => {
    profile.box.push(profile.party.splice(+b.dataset.tobox, 1)[0]);
    audio.blip();
    render();
  });
  body.querySelectorAll('.useItem').forEach(b => b.onclick = async () => {
    const mon = profile.party[+b.dataset.mon];
    const ev = party.useEvoItem(profile, mon, b.dataset.use);
    if (!ev) return;
    panel.classList.add('hidden');
    const ok = await showEvolution(ev);
    if (!ok) {
      mon.dex = ev.fromDex;
      party.grantItem(profile, b.dataset.use);   // changed their mind — refund it
    }
    panel.classList.remove('hidden');
    save.saveProfile(profile);
    render();
  });
}

/* ---------------- box ---------------- */

function renderBox(body) {
  if (!profile.box.length) {
    body.innerHTML = '<p class="teamEmpty">The box is empty. It holds anything you catch beyond six.</p>';
    return;
  }
  body.innerHTML = `<div class="boxGrid">` + profile.box.map((mon, i) => {
    const sp = party.species(mon.dex);
    return `<div class="boxCell">
      <img src="${party.artUrl(mon.dex)}" alt="${sp.name}">
      <b>${sp.name}</b><small>Lv${mon.level}</small>
      <button data-topty="${i}" ${profile.party.length >= party.PARTY_MAX ? 'disabled title="Party is full"' : ''}>To party</button>
    </div>`;
  }).join('') + '</div>';

  body.querySelectorAll('[data-topty]').forEach(b => b.onclick = () => {
    if (profile.party.length >= party.PARTY_MAX) return;
    profile.party.push(profile.box.splice(+b.dataset.topty, 1)[0]);
    audio.blip();
    render();
  });
}

/* ---------------- pokédex ---------------- */

function renderDex(body) {
  const caught = new Set([...profile.party, ...profile.box].map(m => m.dex));
  const seen = new Set(profile.seen ?? []);
  const total = window.PL_DEX.length;
  body.innerHTML = `<div class="dexBar">Seen ${seen.size} · Caught ${caught.size} / ${total}</div>
    <div class="dexGrid">` + window.PL_DEX.map(d => {
    const st = caught.has(d.id) ? 'caught' : seen.has(d.id) ? 'seen' : 'unknown';
    return `<button class="dexCell ${st}" data-dex="${d.id}" ${st === 'unknown' ? 'disabled' : ''}>
      ${st === 'unknown' ? `<span class="dexNum">${d.id}</span>` : `<img src="${party.artUrl(d.id)}" alt="">`}
    </button>`;
  }).join('') + `</div><div class="dexDetail hidden" id="dexDetail"></div>`;

  body.querySelectorAll('.dexCell:not(.unknown)').forEach(b => b.onclick = () => {
    const d = window.PL_DEX.find(x => x.id === +b.dataset.dex);
    const isCaught = caught.has(d.id);
    const detail = $('dexDetail');
    detail.innerHTML = `
      <img src="${party.artUrl(d.id)}" class="${isCaught ? '' : 'silhouette'}" alt="">
      <div>
        <b>#${d.id} ${isCaught ? d.name.toUpperCase() : '???'}</b>
        <div class="dexGenus">${isCaught ? d.genus : 'Catch it to learn more'} ${isCaught ? typeChips(d.types) : ''}</div>
        <p>${isCaught ? d.dex : 'You have seen this Pokémon, but it slipped away. The Pokédex only fills in what you catch.'}</p>
      </div>`;
    detail.classList.remove('hidden');
    audio.blip();
  });
}
