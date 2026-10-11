// Battle Lab — the screens.
//
// Two tabs: Teams (each kid's roster, and the editor for inventing a Pokémon) and Battle
// (pick who fights, then call each turn). All the rules live in stats.js, the referee in
// battle.js and persistence in store.js; this file is only layout and wiring.

import * as S from './stats.js';
import * as store from './store.js';
import * as B from './battle.js';
import * as party from '../poketrivia/js/party.js';
import * as CPU from './computer.js';
import { isSimulated } from '../poketrivia/js/battle-engine.js';

const { esc } = B;
const W = window;
const TYPES = W.PL_TYPES, DEX = W.PL_DEX, CHART = W.PL_CHART;
const MOVES = () => W.PL_MOVES;
const NATURES = Object.keys(W.PL_NATURES);
const ABILITIES = Object.keys(W.PL_ABILITY_FX);
const ITEMS = Object.keys(W.PL_ITEMS);
const SIDES = store.SIDES;
const $ = (sel, root = document) => root.querySelector(sel);

const TYPE_COLOR = {
  normal: '#a8a878', fire: '#f08030', water: '#6890f0', electric: '#f8c820', grass: '#78c850', ice: '#8fd4d4',
  fighting: '#c03028', poison: '#a040a0', ground: '#d8b860', flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
  rock: '#b8a038', ghost: '#705898', dragon: '#7038f8', dark: '#705848', steel: '#a8a8c0', fairy: '#ee99ac',
};
const TYPE_EMOJI = {
  normal: '⭐', fire: '🔥', water: '💧', electric: '⚡', grass: '🌿', ice: '❄️', fighting: '🥊', poison: '☠️',
  ground: '⛰️', flying: '🕊️', psychic: '🔮', bug: '🐛', rock: '🪨', ghost: '👻', dragon: '🐉', dark: '🌙',
  steel: '⚙️', fairy: '✨',
};
const CLASS_ICON = { physical: '💥', special: '🌀', status: '✨' };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const pretty = (k) => k.split('-').map(cap).join(' ');
const chip = (t) => `<span class="tchip" style="--c:${TYPE_COLOR[t]}">${t}</span>`;

/* ================================================================== state */

const prefs = (() => {
  try { return { level: 'own', hints: false, vs: 'pvp', cpuSize: 3, difficulty: 'normal', ...JSON.parse(localStorage.getItem('pokesimPrefs') || '{}') }; }
  catch { return { level: 'own', hints: false, vs: 'pvp', cpuSize: 3, difficulty: 'normal' }; }
})();
const savePrefs = () => { try { localStorage.setItem('pokesimPrefs', JSON.stringify(prefs)); } catch { /* private mode */ } };

const state = {
  tab: 'teams',
  teams: { ryland: [], reid: [] },
  picks: { ryland: [], reid: [] },         // ids, in the order they'll be sent out
  editor: null,                            // the open editor, or null
  bs: null,                                // the battle in progress, or null
  cpu: { team: [] },                       // the generated computer team, shown before the fight
  lastSig: '',
};

function refreshTeams() {
  for (const s of SIDES) state.teams[s.id] = store.listTeam(s.id, TYPES);
  for (const s of SIDES) state.picks[s.id] = state.picks[s.id].filter(id => state.teams[s.id].some(m => m.id === id));
  state.lastSig = store.signature();
  fetchMissingImages();
}

/* Pictures arrive separately from the Pokémon (they are far bigger), and possibly after it. */
const imgTries = new Map();
function fetchMissingImages() {
  for (const s of SIDES) for (const m of state.teams[s.id]) {
    if (!m.img || store.getLocalImage(m.img)) continue;
    const n = imgTries.get(m.img) ?? 0;
    if (n >= 8) continue;
    imgTries.set(m.img, n + 1);
    setTimeout(async () => {
      if (await store.downloadImage(m.img)) { if (!state.editor && !state.bs) render(); }
      else fetchMissingImages();
    }, n === 0 ? 0 : 6000);
  }
}

function toast(msg, ms = 2600) {
  const t = $('#toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.add('hidden'), ms);
}

/* ================================================================== pieces */

function artBox(mon, cls = '') {
  const data = mon.art || store.getLocalImage(mon.img);     // real artwork for the computer's Pokémon
  const c1 = TYPE_COLOR[mon.types[0]], c2 = TYPE_COLOR[mon.types[1] ?? mon.types[0]];
  return { style: `--c1:${c1}cc;--c2:${c2}88`, inner: data ? `<img src="${esc(data)}" alt="">` : TYPE_EMOJI[mon.types[0]] };
}

function monCard(mon) {
  const side = store.sideById(mon.side), a = artBox(mon);
  const total = S.total(mon.stats);
  return `<div class="mon">
    <div class="art" style="${a.style}">${a.inner}</div>
    <h4 title="${esc(mon.name)}">${esc(mon.name)}</h4>
    <div class="types">${mon.types.map(chip).join('')}</div>
    <div class="meta">Lv ${mon.level} · total ${total}${mon.legendary ? ' · ⭐ legendary' : ''}</div>
    <div class="acts">
      <button class="btn small" data-act="edit" data-side="${side.id}" data-id="${mon.id}">Edit</button>
      <button class="btn small danger" data-act="del" data-side="${side.id}" data-id="${mon.id}">Delete</button>
    </div></div>`;
}

/* ================================================================== teams tab */

function renderTeams() {
  $('#app').innerHTML = `
    <h2>Your teams</h2>
    <p class="sub">Invent a Pokémon: give it a picture, types, stats and moves. It’s built the way real ones are — a
      limited stat budget, real types, real moves — so battles stay fair and you learn how it actually works.</p>
    <div class="teams">${SIDES.map(s => {
      const list = state.teams[s.id];
      return `<section class="side" style="--c:${s.color}">
        <header><h3>${esc(store.teamLabel(s))}</h3>
          <button class="btn small" data-act="rename" data-side="${s.id}" title="Give ${esc(s.name)}’s team a name">✏️</button>
          <span class="count">${list.length} Pokémon</span>
          <button class="btn small ${s.id === 'ryland' ? 'ry' : 're'}" data-act="new" data-side="${s.id}">+ New Pokémon</button></header>
        ${store.unreadable(s.id).length ? `<div class="eff" style="margin-bottom:8px">⚠️ ${store.unreadable(s.id).length} saved Pokémon couldn’t be read. It’s still safe in storage — it hasn’t been deleted.</div>` : ''}
        ${list.length ? `<div class="mons">${list.map(monCard).join('')}</div>`
          : `<div class="empty">No Pokémon yet.<br>Tap <b>+ New Pokémon</b> to invent ${esc(s.name)}’s first one.</div>`}
      </section>`;
    }).join('')}</div>`;
}

/* ================================================================== the editor */

const BLANK_STATS = { hp: 80, atk: 80, def: 80, spa: 80, spd: 80, spe: 80 };

/* A half-made Pokémon is kept as the kid goes, so a reload, an accidental close or an update
   landing mid-edit doesn't throw their work away. Local to this device (not synced) and thrown
   away once the Pokémon is actually saved. */
const draftKey = (side) => `pokesimDraft|${side}`;
let draftTimer = null;
function scheduleDraftSave() {
  const e = state.editor;
  if (!e || !e.isNew) return;
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    try {
      localStorage.setItem(draftKey(e.d.side), JSON.stringify({ d: e.d, imgData: e.imgData, invent: e.invent, at: Date.now() }));
    } catch { /* storage full or blocked — nothing more to do */ }
  }, 350);
}
function takeDraft(side) {
  try {
    const raw = localStorage.getItem(draftKey(side));
    if (!raw) return null;
    const x = JSON.parse(raw);
    return x && x.d && x.d.side === side ? x : null;
  } catch { return null; }
}
const clearDraft = (side) => { clearTimeout(draftTimer); try { localStorage.removeItem(draftKey(side)); } catch { /* ignore */ } };

function openEditor(sideId, mon = null) {
  // A move can disappear if the move list changes later. Drop it with a clear note rather than
  // leaving a slot the editor can't draw — everything else about the Pokémon is kept as it was.
  let gone = 0;
  if (mon) {
    const kept = mon.moves.filter(m => m.custom || MOVES()[m.real]);
    gone = mon.moves.length - kept.length;
    if (gone) mon = { ...mon, moves: kept };
  }
  if (gone) toast(`${gone} move${gone > 1 ? 's are' : ' is'} no longer available — pick ${gone > 1 ? 'replacements' : 'a replacement'}.`, 5000);

  if (!mon) {
    const draft = takeDraft(sideId);
    if (draft && (draft.d.name?.trim() || draft.d.moves?.length || draft.imgData)) {
      const label = draft.d.name?.trim() ? `“${draft.d.name.trim()}”` : 'a Pokémon';
      if (confirm(`You were in the middle of making ${label}. Carry on with it?`)) {
        state.editor = {
          view: 'form', isNew: true, d: draft.d, imgData: draft.imgData ?? null, imgRemoved: false,
          mf: { q: '', type: '', cls: '', tab: 'real' },
          invent: draft.invent ?? { label: '', type: 'normal', cls: 'physical', power: 70, acc: 100 },
        };
        renderEditor();
        return;
      }
      clearDraft(sideId);
    }
  }
  state.editor = {
    view: 'form',
    isNew: !mon,
    d: mon
      ? JSON.parse(JSON.stringify(mon))
      : { id: store.newId(), side: sideId, name: '', types: ['normal'], level: 50, stats: { ...BLANK_STATS },
          nature: 'serious', ability: 'none', item: 'none', legendary: false, img: '', created: Date.now(), moves: [] },
    imgData: null, imgRemoved: false,
    mf: { q: '', type: '', cls: '', tab: 'real' },
    invent: { label: '', type: 'normal', cls: 'physical', power: 70, acc: 100 },
  };
  renderEditor();
}
const closeEditor = () => { state.editor = null; $('#modal').classList.add('hidden'); $('#modal').innerHTML = ''; render(); };

function draftProblems() {
  const e = state.editor;
  const probs = S.monProblems(e.d, TYPES);
  return probs;
}

function renderEditor() {
  const e = state.editor, d = e.d, side = store.sideById(d.side);
  const m = $('#modal');
  m.classList.remove('hidden');
  m.innerHTML = e.view === 'moves' ? movePickerHtml() : editorHtml(d, side);
  if (e.view === 'form') syncDerived();
}

function editorHtml(d, side) {
  const e = state.editor;
  const a = artBox({ ...d, img: '' });
  const pic = e.imgData ? `<img src="${e.imgData}" alt="">`
    : (!e.imgRemoved && d.img && store.getLocalImage(d.img)) ? `<img src="${store.getLocalImage(d.img)}" alt="">` : a.inner;
  return `<div class="sheet" style="--side:${side.color}">
    <header><h3>${e.isNew ? 'New Pokémon' : 'Edit ' + esc(d.name || 'Pokémon')} <span class="eff">· ${esc(store.teamLabel(side))}</span></h3>
      <button class="btn small x" data-act="close">✕ Close</button></header>
    <div class="body">
      <div class="top-grid">
        <div>
          <div class="pic" id="pic" style="${a.style}">${pic}</div>
          <div class="picbtns">
            <label class="btn small" style="display:inline-block">📷 Picture<input type="file" id="file" accept="image/*" hidden></label>
            <button class="btn small" data-act="rmpic">Remove</button>
          </div>
          <div class="picnote">Any photo or drawing. It’s shrunk automatically.</div>
        </div>
        <div style="display:grid;gap:12px">
          <div class="field"><label class="l">Name</label>
            <input type="text" data-f="name" maxlength="${S.NAME_MAX}" value="${esc(d.name)}" placeholder="What is it called?"></div>
          <div class="row3">
            <div class="field"><label class="l">Type</label><select data-f="type0">${TYPES.map(t => `<option value="${t}" ${d.types[0] === t ? 'selected' : ''}>${cap(t)}</option>`).join('')}</select></div>
            <div class="field"><label class="l">Second type (optional)</label><select data-f="type1"><option value="">— none —</option>${TYPES.map(t => `<option value="${t}" ${d.types[1] === t ? 'selected' : ''}>${cap(t)}</option>`).join('')}</select></div>
            <div class="field"><label class="l">Level</label><input type="number" data-f="level" min="${S.LEVEL_MIN}" max="${S.LEVEL_MAX}" value="${d.level}"></div>
          </div>
          <div class="chips" id="typechart"></div>
        </div>
      </div>

      <div>
        <div class="field" style="margin-bottom:10px">
          <label class="l">Start from a real Pokémon <span class="eff">(copies its types and stats — then change whatever you like)</span></label>
          <select data-f="template"><option value="">— start from scratch —</option>
            ${DEX.map(p => `<option value="${p.id}">${esc(p.name)} (${S.total(p.stats)})</option>`).join('')}</select>
        </div>
        <div class="row2" style="align-items:start">
          <div class="stats">${S.STAT_KEYS.map(k => `
            <div class="stat"><div class="nm"><b>${S.STAT_LABEL[k]}</b><small>${S.STAT_BLURB[k]}</small></div>
              <input type="range" data-stat="${k}" min="${S.STAT_MIN}" max="${S.STAT_MAX}" value="${d.stats[k]}">
              <input type="number" data-stat="${k}" min="${S.STAT_MIN}" max="${S.STAT_MAX}" value="${d.stats[k]}"></div>`).join('')}</div>
          <div class="budget" id="budget"></div>
        </div>
        <label style="display:flex;gap:8px;align-items:center;margin-top:10px;font-weight:700">
          <input type="checkbox" data-f="legendary" ${d.legendary ? 'checked' : ''}>
          ⭐ Legendary — allowed up to ${S.LEGEND_CAP} total instead of ${S.TOTAL_CAP}</label>
      </div>

      <div>
        <label class="l" style="font-weight:800;font-size:13px;display:block;margin-bottom:6px">Moves <span class="eff">(1 to ${S.MAX_MOVES})</span></label>
        <div class="slots" id="slots"></div>
      </div>

      <details class="adv"><summary>Advanced: nature, ability, held item</summary>
        <div class="row3">
          <div class="field"><label class="l">Nature</label><select data-f="nature">${NATURES.map(n => `<option value="${n}" ${d.nature === n ? 'selected' : ''}>${cap(n)}${natureNote(n)}</option>`).join('')}</select></div>
          <div class="field"><label class="l">Ability</label><select data-f="ability"><option value="none">— none —</option>${ABILITIES.map(n => `<option value="${n}" ${d.ability === n ? 'selected' : ''}>${pretty(n)}</option>`).join('')}</select></div>
          <div class="field"><label class="l">Held item</label><select data-f="item">${ITEMS.map(n => `<option value="${n}" ${d.item === n ? 'selected' : ''}>${n === 'none' ? '— none —' : esc(W.PL_ITEMS[n].label)}</option>`).join('')}</select></div>
        </div>
        <div class="eff" id="advnote" style="padding-bottom:12px"></div>
      </details>

      <ul class="problems hidden" id="problems"></ul>
    </div>
    <footer>
      <button class="btn primary" data-act="save" id="savebtn">Save Pokémon</button>
      <button class="btn" data-act="close">Cancel</button>
    </footer></div>`;
}

function natureNote(n) {
  const x = W.PL_NATURES[n];
  return x?.up ? ` (+${S.STAT_LABEL[x.up]}, −${S.STAT_LABEL[x.down]})` : '';
}

/** Everything on the form that depends on the current numbers. Cheap, so called on every input. */
function syncDerived() {
  const e = state.editor, d = e.d;
  const t = S.total(d.stats), capN = S.capFor(d.legendary), over = t > capN;
  const tier = S.tier(t), cmp = S.compareToReal(d.stats, DEX);
  const pct = Math.min(100, (t / capN) * 100);
  $('#budget').innerHTML = `
    <div class="big"><b>${t}</b><span>of ${capN} total</span></div>
    <div class="meter ${over ? 'over' : pct > 92 ? 'warn' : ''}"><i style="width:${pct}%"></i></div>
    ${over
      ? `<p class="over">${t - capN} over the limit.</p><button class="btn small" data-act="fit">Scale to fit</button>`
      : `<p>${capN - t} left to spend.</p>`}
    <p class="tier">${tier.label}</p><p class="eff">${tier.note}</p>
    ${cmp.byStrength ? `<p>About as strong as <b>${esc(cmp.byStrength.name)}</b> (${cmp.byStrength.bst}).</p>` : ''}
    ${cmp.byShape ? `<p>Built like <b>${esc(cmp.byShape.name)}</b>.</p>` : ''}
    <p class="eff">It looks: ${S.describeBuild(d.stats)}.</p>`;

  const prof = S.defensiveProfile(d.types, CHART, TYPES);
  const group = (label, list, fmt) => list.length
    ? `<span class="lbl">${label}</span>${list.map(x => `${chip(x.type)}${fmt ? `<span class="eff">${fmt(x.mult)}</span>` : ''}`).join('')}` : '';
  $('#typechart').innerHTML =
    group('Weak to', prof.weak, m => (m >= 4 ? '×4' : '×2')) +
    (prof.resist.length ? ' ' + group('Resists', prof.resist) : '') +
    (prof.immune.length ? ' ' + group('Immune to', prof.immune) : '');

  const mons = d.moves;
  $('#slots').innerHTML = Array.from({ length: S.MAX_MOVES }, (_, i) => {
    const mv = mons[i];
    if (!mv) return `<div class="slot empty">${i === mons.length ? `<button class="btn small" data-act="addmove">+ Add a move</button>` : '—'}</div>`;
    const info = mv.real ? MOVES()[mv.real] : mv.custom;
    const type = mv.real ? info.type : info.type;
    const stab = d.types.includes(type) && (mv.real ? info.power > 0 : true);
    const power = mv.real ? info.power : info.power;
    const acc = mv.real ? info.acc : info.acc;
    const cls = mv.real ? info.class : info.cls;
    return `<div class="slot"><button class="rm" data-act="rmmove" data-i="${i}" title="Remove">✕</button>
      <div class="nm">${esc(mv.real ? info.label : info.label)} ${mv.custom ? '<span class="eff">· invented</span>' : ''}</div>
      <div>${chip(type)} ${stab ? '<span class="stab">★ same-type</span>' : ''}</div>
      <div class="info">${CLASS_ICON[cls] ?? ''} ${cls} · ${power ? power + ' power' : 'no damage'} · ${acc ? acc + '%' : 'never misses'} · ${mv.real ? info.pp : mv.custom.pp} PP</div></div>`;
  }).join('');

  const probs = draftProblems();
  const ul = $('#problems');
  ul.classList.toggle('hidden', !probs.length);
  ul.innerHTML = probs.map(p => `<li>${esc(p)}</li>`).join('');
  $('#savebtn').disabled = probs.length > 0;

  const ab = d.ability !== 'none' ? (W.PL_ABILITY_FX[d.ability]?.text ?? '').replace("{P}'s", 'Its').replace('{P}', 'It') : '';
  const it = d.item !== 'none' ? W.PL_ITEMS[d.item]?.blurb ?? '' : '';
  const note = $('#advnote');
  if (note) note.textContent = [ab && `Ability: ${ab}`, it && `Item: ${it}`].filter(Boolean).join('   ');
}

/* ---------------------------------------------------------------- move picker */

function movePickerHtml() {
  const e = state.editor, f = e.mf, d = e.d;
  const side = store.sideById(d.side);
  return `<div class="sheet" style="--side:${side.color}">
    <header><button class="btn small" data-act="backform">← Back</button><h3>Choose a move for ${esc(d.name || 'your Pokémon')}</h3>
      <button class="btn small x" data-act="close">✕ Close</button></header>
    <div class="body">
      <div class="mtabs">
        <button data-act="mtab" data-mtab="real" class="${f.tab === 'real' ? 'on' : ''}">📖 Real moves</button>
        <button data-act="mtab" data-mtab="invent" class="${f.tab === 'invent' ? 'on' : ''}">✏️ Invent a move</button>
      </div>
      ${f.tab === 'real' ? realMovesHtml() : inventHtml()}
    </div></div>`;
}

function realMovesHtml() {
  const f = state.editor.mf;
  return `<div class="filters">
      <input type="text" data-mf="q" placeholder="Search moves…" value="${esc(f.q)}">
      <select data-mf="type"><option value="">All types</option>${TYPES.map(t => `<option value="${t}" ${f.type === t ? 'selected' : ''}>${cap(t)}</option>`).join('')}</select>
      <select data-mf="cls"><option value="">Any kind</option><option value="physical" ${f.cls === 'physical' ? 'selected' : ''}>Physical</option><option value="special" ${f.cls === 'special' ? 'selected' : ''}>Special</option><option value="status" ${f.cls === 'status' ? 'selected' : ''}>Status</option></select>
    </div>
    <div class="eff">★ marks moves that match your Pokémon’s type and get the same-type bonus (1.5× damage).</div>
    <div class="mlist" id="mlist">${moveRows()}</div>`;
}

function moveRows() {
  const e = state.editor, f = e.mf, d = e.d;
  const taken = new Set(d.moves.filter(m => m.real).map(m => m.real));
  const q = f.q.trim().toLowerCase();
  const list = Object.values(MOVES())
    .filter(m => !m.invented && isSimulated(m))
    .filter(m => (!f.type || m.type === f.type) && (!f.cls || m.class === f.cls) && (!q || m.label.toLowerCase().includes(q)))
    .sort((a, b) => (d.types.includes(b.type) && b.power > 0) - (d.types.includes(a.type) && a.power > 0) || a.label.localeCompare(b.label));
  if (!list.length) return `<div class="empty">No move matches.</div>`;
  return list.map(m => `
    <button class="mrow" data-act="pickmove" data-move="${m.name}" ${taken.has(m.name) ? 'disabled' : ''}>
      <div class="top1">${chip(m.type)}<b>${esc(m.label)}</b>${d.types.includes(m.type) && m.power > 0 ? '<span class="stab">★</span>' : ''}
        <span class="nums">${CLASS_ICON[m.class]} ${m.class} · ${m.power ? m.power + ' pow' : '—'} · ${m.acc ? m.acc + '%' : '∞'} · ${m.pp} PP</span></div>
      <small>${esc(m.short ?? '')}</small></button>`).join('')
    + `<div class="eff" style="padding:6px">${list.length} moves.</div>`;
}

function inventHtml() {
  const v = state.editor.invent;
  const maxAcc = S.maxAccuracyFor(v.power);
  v.acc = Math.min(v.acc, maxAcc);
  return `<div class="invent">
    <div class="field"><label class="l">Move name</label><input type="text" data-iv="label" maxlength="24" value="${esc(v.label)}" placeholder="e.g. Thunder Claw"></div>
    <div class="row2">
      <div class="field"><label class="l">Type</label><select data-iv="type">${TYPES.map(t => `<option value="${t}" ${v.type === t ? 'selected' : ''}>${cap(t)}</option>`).join('')}</select></div>
      <div class="field"><label class="l">Kind</label><div class="radio" style="padding-top:8px">
        <label><input type="radio" name="cls" data-iv="cls" value="physical" ${v.cls === 'physical' ? 'checked' : ''}> 💥 Physical</label>
        <label><input type="radio" name="cls" data-iv="cls" value="special" ${v.cls === 'special' ? 'checked' : ''}> 🌀 Special</label></div></div>
    </div>
    <div class="field"><label class="l">Power: <b id="ivp">${v.power}</b></label>
      <input type="range" data-iv="power" min="${S.CUSTOM_POWER_MIN}" max="${S.CUSTOM_POWER_MAX}" step="5" value="${v.power}" style="width:100%"></div>
    <div class="field"><label class="l">Accuracy: <b id="iva">${v.acc}%</b> <span class="eff">(at most ${maxAcc}% for this power)</span></label>
      <input type="range" data-iv="acc" min="${S.CUSTOM_ACC_MIN}" max="${maxAcc}" step="1" value="${v.acc}" style="width:100%"></div>
    <div class="note" id="ivnote"></div>
    <div class="cmp" id="ivcmp"></div>
    <div><button class="btn primary" data-act="addinvented" id="ivadd">Add this move</button></div>
  </div>`;
}

function syncInvent() {
  const v = state.editor.invent;
  const maxAcc = S.maxAccuracyFor(v.power);
  if (v.acc > maxAcc) v.acc = maxAcc;
  $('#ivp').textContent = v.power; $('#iva').textContent = v.acc + '%';
  const acc = $('[data-iv=acc]'); acc.max = maxAcc; acc.value = v.acc;
  $('#ivnote').innerHTML = `<b>${S.ppFor(v.power)} PP.</b> Real moves trade power for accuracy: Thunderbolt is 90 power at 100%,
    Fire Blast 110 at 85%, Thunder 110 at 70%. The harder it hits, the less often it lands (and the fewer times you can use it).`;
  const near = Object.values(MOVES()).filter(m => !m.invented && m.class === v.cls && m.power > 0 && m.acc)
    .sort((a, b) => (Math.abs(a.power - v.power) + Math.abs(a.acc - v.acc) / 4) - (Math.abs(b.power - v.power) + Math.abs(b.acc - v.acc) / 4))
    .slice(0, 3);
  $('#ivcmp').innerHTML = 'Similar real moves: ' + near.map(m => `<b>${esc(m.label)}</b> (${m.power} @ ${m.acc}%)`).join(', ');
  $('#ivadd').disabled = !v.label.trim();
}

/* ---------------------------------------------------------------- editor events */

function onEditorInput(ev) {
  const e = state.editor; if (!e) return;
  scheduleDraftSave();
  const t = ev.target, d = e.d;
  if (t.dataset.stat) {
    const k = t.dataset.stat;
    const v = S.clamp(Math.round(Number(t.value) || 0), S.STAT_MIN, S.STAT_MAX);
    d.stats[k] = v;
    document.querySelectorAll(`[data-stat="${k}"]`).forEach(x => { if (x !== t) x.value = v; });
    syncDerived();
  } else if (t.dataset.f === 'name') { d.name = t.value; syncDerived(); }
  else if (t.dataset.f === 'level') { d.level = Math.round(Number(t.value) || 0); syncDerived(); }
  else if (t.dataset.mf) {
    e.mf[t.dataset.mf] = t.value;
    if (e.mf.tab === 'real') $('#mlist').innerHTML = moveRows();
  } else if (t.dataset.iv) {
    const k = t.dataset.iv;
    const v = e.invent;
    if (k === 'label') v.label = t.value;
    else if (k === 'power') v.power = Number(t.value);
    else if (k === 'acc') v.acc = Number(t.value);
    syncInvent();
  }
}

async function onEditorChange(ev) {
  const e = state.editor; if (!e) return;
  scheduleDraftSave();
  const t = ev.target, d = e.d;
  if (t.id === 'file') {
    const file = t.files?.[0];
    if (!file) return;
    try {
      e.imgData = await store.processImageFile(file);
      e.imgRemoved = false;
      scheduleDraftSave();
      $('#pic').innerHTML = `<img src="${e.imgData}" alt="">`;
    } catch (err) { toast(err.message || 'Could not read that picture.'); }
    return;
  }
  switch (t.dataset.f) {
    case 'type0': d.types[0] = t.value; if (d.types[1] === t.value) d.types.length = 1; renderEditor(); return;
    case 'type1': d.types = t.value ? [d.types[0], t.value] : [d.types[0]]; renderEditor(); return;
    case 'legendary': d.legendary = t.checked; syncDerived(); return;
    case 'nature': case 'ability': case 'item': d[t.dataset.f] = t.value; syncDerived(); return;
    case 'template': {
      const p = DEX.find(x => String(x.id) === t.value);
      if (p) {
        d.types = p.types.slice(); d.stats = { ...p.stats };
        if (S.total(d.stats) > S.TOTAL_CAP) d.legendary = true;
        if (!d.name.trim()) d.name = '';
        renderEditor();
      }
      return;
    }
  }
  if (t.dataset.mf) { e.mf[t.dataset.mf] = t.value; if (e.mf.tab === 'real') $('#mlist').innerHTML = moveRows(); }
  if (t.dataset.iv === 'cls') { e.invent.cls = t.value; syncInvent(); }
  if (t.dataset.iv === 'type') { e.invent.type = t.value; syncInvent(); }
}

function addMove(m) {
  scheduleDraftSave();
  const d = state.editor.d;
  if (d.moves.length >= S.MAX_MOVES) { toast(`A Pokémon can only know ${S.MAX_MOVES} moves.`); return; }
  d.moves.push(m);
  state.editor.view = 'form';
  renderEditor();
}

function saveEditor() {
  const e = state.editor, d = e.d;
  const probs = draftProblems();
  if (probs.length) { renderEditor(); return; }
  const mon = {
    id: d.id, side: d.side, name: d.name.trim(), types: d.types, level: d.level,
    stats: d.stats, nature: d.nature, ability: d.ability, item: d.item, legendary: d.legendary,
    img: d.img, created: d.created, moves: d.moves,
  };
  if (e.imgData) {
    const old = d.img;
    mon.img = store.newId();
    store.setLocalImage(mon.img, e.imgData);
    if (old) localStorage.removeItem(store.imgKey(old));
    store.uploadImage(mon.img, e.imgData, mon.name).then(ok => {
      if (globalThis.LZSYNC?.url) toast(ok ? 'Picture is on the other device too ✓' : 'Picture saved here — will keep trying to share it');
    });
  } else if (e.imgRemoved) {
    if (d.img) localStorage.removeItem(store.imgKey(d.img));
    mon.img = '';
  }
  const len = store.saveMon(mon);
  clearDraft(mon.side);
  if (len > 1500) toast('That Pokémon is unusually large — it may be slow to sync.');
  closeEditor();
  refreshTeams();
  render();
  toast(`${mon.name} saved ✓`);
}

/* ================================================================== battle: setup */

const humanSides = () => (prefs.vs === 'pvp' ? SIDES : [store.sideById(prefs.vs)]);

function avgPickLevel() {
  const lv = humanSides().flatMap(sd => state.picks[sd.id].map(id => state.teams[sd.id].find(m => m.id === id)?.level)).filter(Boolean);
  return lv.length ? Math.round(lv.reduce((n, x) => n + x, 0) / lv.length) : 50;
}

/** Build a fresh computer team from the current settings. */
function rollCpu() {
  const level = prefs.level === 'own' ? avgPickLevel() : Number(prefs.level);
  state.cpu.team = CPU.generateTeam({ size: prefs.cpuSize, level, difficulty: prefs.difficulty });
}

function pickColumn(s) {
  const list = state.teams[s.id];
  return `<section class="side" style="--c:${s.color}">
    <header><h3>${esc(store.teamLabel(s))}</h3><span class="count">${state.picks[s.id].length} picked</span></header>
    ${list.length ? `<div class="pickgrid">${list.map(mon => {
      const idx = state.picks[s.id].indexOf(mon.id), a = artBox(mon);
      return `<button class="pick ${idx >= 0 ? 'on' : ''}" style="--c:${s.color};--soft:${s.soft};${a.style}" data-act="pick" data-side="${s.id}" data-id="${mon.id}">
        <span class="order">${idx + 1}</span>
        <div class="art">${a.inner}</div><h4>${esc(mon.name)}</h4>
        <div class="meta">Lv ${mon.level} · ${mon.types.map(cap).join('/')}</div></button>`;
    }).join('')}</div>` : `<div class="empty">No Pokémon yet — add some on the Teams tab.</div>`}
  </section>`;
}

function cpuColumn() {
  const c = CPU.CPU_SIDE, team = state.cpu.team;
  const label = (k) => MOVES()[k]?.label ?? k;
  return `<section class="side" style="--c:${c.color}">
    <header style="flex-wrap:wrap"><h3>🤖 Computer</h3><span class="count">${team.length} Pokémon</span>
      <button class="btn small" data-act="reroll" style="margin-left:auto">🎲 New team</button></header>
    <div class="cpubar">
      <label>How many <select id="cpusize">${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${prefs.cpuSize === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
      <label>Difficulty <select id="cpudiff">${Object.entries(CPU.DIFFICULTY).map(([k, d]) => `<option value="${k}" ${prefs.difficulty === k ? 'selected' : ''}>${d.label}</option>`).join('')}</select></label>
    </div>
    <div class="eff" style="margin:0 0 10px">${esc(CPU.DIFFICULTY[prefs.difficulty].note)}. Real Pokémon with their real stats and moves.</div>
    <div class="pickgrid">${team.map(m => {
      const a = artBox(m);
      return `<div class="pick" style="--c:${c.color};--soft:${c.soft};${a.style};cursor:default">
        <div class="art">${a.inner}</div><h4>${esc(m.name)}</h4>
        <div class="meta">Lv ${m.level} · ${m.types.map(cap).join('/')}</div>
        <div class="meta" style="margin-top:3px">${m.moves.map(x => esc(label(x.real))).join(' · ')}</div></div>`;
    }).join('')}</div>
  </section>`;
}

function renderBattleSetup() {
  const humans = humanSides();
  if (prefs.vs !== 'pvp' && !state.cpu.team.length) rollCpu();
  const ready = humans.every(s => state.picks[s.id].length > 0) && (prefs.vs === 'pvp' || state.cpu.team.length > 0);
  const sizes = prefs.vs === 'pvp' ? SIDES.map(s => state.picks[s.id].length) : [state.picks[prefs.vs].length, state.cpu.team.length];
  const mode = !ready ? '' : (sizes[0] === 1 && sizes[1] === 1 ? 'Duel' : `Team battle · ${sizes[0]} vs ${sizes[1]}`);
  const opt = (v, text) => `<button class="btn ${prefs.vs === v ? 'primary' : ''}" data-act="vs" data-vs="${v}">${text}</button>`;
  $('#app').innerHTML = `
    <h2>Pick who fights</h2>
    <div class="vsbar" style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 14px">
      ${opt('pvp', `${esc(SIDES[0].name)} vs ${esc(SIDES[1].name)}`)}
      ${opt('ryland', `${esc(SIDES[0].name)} vs 🤖 Computer`)}
      ${opt('reid', `${esc(SIDES[1].name)} vs 🤖 Computer`)}
    </div>
    <p class="sub">Tap Pokémon to add them. Pick one for a duel, or several for a team battle — the order you tap is the order they’re sent out.</p>
    <div class="teams">${humans.map(pickColumn).join('')}${prefs.vs === 'pvp' ? '' : cpuColumn()}</div>
    <div class="setupbar">
      <label>Levels <select id="levelmode">
        <option value="own" ${prefs.level === 'own' ? 'selected' : ''}>Each Pokémon’s own level</option>
        <option value="50" ${prefs.level === '50' ? 'selected' : ''}>Everyone at level 50</option>
        <option value="100" ${prefs.level === '100' ? 'selected' : ''}>Everyone at level 100</option></select></label>
      <label class="chk"><input type="checkbox" id="hints" ${prefs.hints ? 'checked' : ''}> Show type hints while choosing</label>
      <span class="eff">${mode}</span>
      <button class="btn primary go" data-act="start" ${ready ? '' : 'disabled'}>⚔️ Start battle</button>
    </div>`;
}

function startBattle() {
  let lineups, cpuIdx = -1;
  const pickMons = (sd) => state.picks[sd.id].map(id => state.teams[sd.id].find(m => m.id === id)).filter(Boolean);
  const human = (sd) => ({ side: { ...sd, name: store.getTeamName(sd.id) || sd.name, owner: sd.name }, mons: pickMons(sd) });
  if (prefs.vs === 'pvp') {
    lineups = SIDES.map(human);
  } else {
    if (!state.cpu.team.length) rollCpu();
    lineups = [human(store.sideById(prefs.vs)), { side: { ...CPU.CPU_SIDE, owner: 'Computer' }, mons: state.cpu.team }];
    cpuIdx = 1;
  }
  if (lineups.some(l => !l.mons.length)) return;
  beginMatch(lineups, cpuIdx);
}

function beginMatch(lineups, cpuIdx) {
  const match = B.createMatch(lineups, { levelMode: prefs.level === 'own' ? 'own' : Number(prefs.level) });
  B.startMatch(match);
  state.bs = { match, choices: [null, null], picks: {}, lineups, cpuIdx, skill: CPU.DIFFICULTY[prefs.difficulty].skill };
  autoPickReplacements();
  renderBattle();
}

/* ================================================================== battle: the fight */

function hpClass(pct) { return pct <= 20 ? 'low' : pct <= 50 ? 'mid' : ''; }

function fighterHtml(i) {
  const bs = state.bs, m = bs.match, side = m.sides[i], b = side.active, snap = B.snapshot(b);
  const a = artBox(b.mon);
  const pips = side.team.map(x => `<span class="pip ${x.fainted ? 'out' : ''} ${x === b ? 'cur' : ''}" title="${esc(x.name)}"></span>`).join('');
  const badges = [
    snap.status && `<span class="badge status">${snap.status}</span>`,
    snap.confused && `<span class="badge status">confused</span>`,
    ...snap.stages.map(s => `<span class="badge ${s.v > 0 ? 'up' : 'down'}">${B.esc((({ atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe', acc: 'Acc', eva: 'Eva' })[s.stat]))} ${s.v > 0 ? '+' : ''}${s.v}</span>`),
  ].filter(Boolean).join('');
  return `<section class="fighter ${snap.fainted ? 'fainted' : ''}" style="--c:${side.color}">
    <div class="who">
      <div class="art" style="${a.style}">${a.inner}</div>
      <div><div class="trainer">${esc(side.name)}${side.owner && side.owner !== side.name ? ` <span class="eff">· ${esc(side.owner)}</span>` : ''}</div><h3>${esc(b.name)}</h3>
        <div>${b.types.map(chip).join(' ')} <span class="eff">Lv ${b.level}</span></div></div>
    </div>
    <div class="hp"><div class="bar"><i class="${hpClass(snap.pct)}" style="width:${snap.pct}%"></i></div>
      <div class="txt"><span>HP ${snap.hp} / ${snap.maxHp}</span><span>${snap.pct}%</span></div></div>
    <div class="badges">${badges}</div>
    <div class="pips">${pips}</div>
    ${actionsHtml(i)}
  </section>`;
}

function actionsHtml(i) {
  const bs = state.bs, m = bs.match, side = m.sides[i];
  if (m.phase === 'over') return '';
  if (i === bs.cpuIdx) {
    return `<div class="actions"><h5>🤖 The computer chooses when you press Resolve</h5>
      <div class="eff">Its move is picked at the same moment as yours, so there’s no peeking.</div></div>`;
  }
  if (m.phase === 'replace') {
    if (!side.needSwitch) return `<div class="actions"><h5>Waiting for the other side to pick…</h5></div>`;
    const alive = side.team.map((b, idx) => ({ b, idx })).filter(x => !x.b.fainted && x.b !== side.active);
    return `<div class="actions"><h5>${esc(side.name)}: who comes in?</h5><div class="bench">${alive.map(x => `
      <button class="benchbtn ${bs.picks[i] === x.idx ? 'chosen' : ''}" style="--c:${side.color};--soft:${store.sideById(side.id).soft}" data-act="replace" data-side="${i}" data-idx="${x.idx}">
        <b>${esc(x.b.name)}</b><span class="hpmini">${x.b.hp}/${x.b.maxHp} HP · Lv ${x.b.level}</span></button>`).join('')}</div></div>`;
  }
  const o = B.options(m, i, { hints: prefs.hints });
  const ch = bs.choices[i];
  const moves = o.moves.map(mv => {
    const hint = prefs.hints && mv.mult !== undefined
      ? (mv.mult === 0 ? `<span class="hint imm">No effect</span>` : mv.mult > 1 ? `<span class="hint sup">Super effective ×${mv.mult}</span>`
        : mv.mult < 1 ? `<span class="hint res">Not very effective ×${mv.mult}</span>` : '') : '';
    return `<button class="move ${ch?.type === 'move' && ch.move === mv.key ? 'chosen' : ''}" style="--mc:${TYPE_COLOR[mv.type]}"
        data-act="move" data-side="${i}" data-key="${mv.key}" ${mv.disabled ? 'disabled' : ''}>
        <b>${esc(mv.label)}</b>
        <span class="info">${chip(mv.type)} ${CLASS_ICON[mv.cls] ?? ''} ${mv.power ? mv.power + ' pow' : 'status'} · ${mv.acc ? mv.acc + '%' : '—'} · PP ${mv.pp}/${mv.maxPp}${mv.locked ? ' · 🔒 locked' : ''}</span>${hint}</button>`;
  }).join('');
  const bench = o.bench.length ? `<h5>Or switch</h5><div class="bench">${o.bench.map(x => `
      <button class="benchbtn ${ch?.type === 'switch' && ch.to === x.idx ? 'chosen' : ''}" style="--c:${side.color};--soft:${store.sideById(side.id).soft}" data-act="switch" data-side="${i}" data-idx="${x.idx}">
        <b>${esc(x.name)}</b><span class="hpmini">${x.hp}/${x.maxHp} HP · Lv ${x.level}${x.status ? ' · ' + x.status : ''}</span></button>`).join('')}</div>` : '';
  return `<div class="actions"><h5>${esc(side.name)} chooses <button class="btn small" data-act="random" data-side="${i}" style="margin-left:6px">🎲 random</button></h5>
    <div class="moves">${moves}</div>${bench}</div>`;
}

function logHtml() {
  const m = state.bs.match;
  return state.bs.match.history.slice().reverse().map(h => {
    const lines = h.events.map(ev => {
      const text = B.narrate(ev, m);
      if (!text) return '';
      const si = ev.side ?? (ev.who ? B.sideOfName(m, ev.who) : -1);
      const col = si >= 0 ? ` style="border-left-color:${esc(m.sides[si].color)}"` : '';
      return `<div class="line"${col}>${text}</div>`;
    }).join('');
    return lines ? `<div class="turn"><h6>${esc(h.title)}</h6>${lines}</div>` : '';
  }).join('');
}

function renderBattle() {
  const bs = state.bs, m = bs.match;
  let center = '';
  if (m.phase === 'choose') {
    const ready = [0, 1].every(i => i === bs.cpuIdx || bs.choices[i]);
    center = `<div class="center"><span class="info">Turn ${m.turn + 1}${m.battle.weather ? ' · ' + esc(m.battle.weather) : ''}</span>
      <button class="btn primary fight" data-act="resolve" ${ready ? '' : 'disabled'}>⚔️ Resolve turn</button>
      <span class="info">${bs.cpuIdx >= 0
        ? (ready ? 'Ready — the computer will choose now.' : 'Pick a move or a switch, then press Resolve.')
        : (ready ? 'Both sides chosen.' : 'Each side picks a move or a switch.')}</span></div>`;
  } else if (m.phase === 'replace') {
    const need = [0, 1].filter(i => m.sides[i].needSwitch);
    const ready = need.every(i => bs.picks[i] != null);
    center = `<div class="center"><span class="info">Someone fainted — pick who comes in.</span>
      <button class="btn primary fight" data-act="sendout" ${ready ? '' : 'disabled'}>Send them out</button></div>`;
  } else {
    const r = B.summary(m);
    center = `<div class="winner"><h2>${r.draw ? '🤝 It’s a draw!' : `🏆 ${esc(r.winner.name)} wins!`}</h2>
      <div>${r.turns} turns · ${r.standing.map(s => `${esc(s.name)}: ${s.alive} of ${s.total} standing`).join(' · ')}</div>
      <div class="center"><button class="btn primary" data-act="rematch">Rematch</button>
        ${bs.cpuIdx >= 0 ? `<button class="btn" data-act="rematch-new">Rematch vs a new computer team</button>` : ''}
        <button class="btn" data-act="tosetup">Pick different fighters</button></div></div>`;
  }
  $('#app').innerHTML = `<div class="arena">${fighterHtml(0)}${fighterHtml(1)}</div>${center}
    <div class="log">${logHtml()}</div>
    <div class="center"><button class="btn small" data-act="tosetup">← Leave battle</button></div>`;
}

function autoPickReplacements() {
  const bs = state.bs, m = bs.match;
  bs.picks = {};
  if (m.phase !== 'replace') return;
  for (const i of [0, 1]) {
    if (!m.sides[i].needSwitch) continue;
    if (i === bs.cpuIdx) { bs.picks[i] = CPU.chooseReplacement(m, i, bs.skill); continue; }
    const alive = m.sides[i].team.map((b, idx) => ({ b, idx })).filter(x => !x.b.fainted && x.b !== m.sides[i].active);
    if (alive.length === 1) bs.picks[i] = alive[0].idx;
  }
  // if only the computer needs someone new there's nothing for the person to decide
  const need = [0, 1].filter(i => m.sides[i].needSwitch);
  if (need.length && need.every(i => i === bs.cpuIdx) && bs.picks[bs.cpuIdx] != null) {
    B.replace(m, bs.picks);
    bs.picks = {};
    autoPickReplacements();
  }
}

function resolveTurn() {
  const bs = state.bs;
  if (bs.cpuIdx >= 0) bs.choices[bs.cpuIdx] = CPU.choose(bs.match, bs.cpuIdx, bs.skill);
  try { B.playTurn(bs.match, bs.choices); }
  catch (err) { toast(err.message); return; }
  bs.choices = [null, null];
  autoPickReplacements();
  renderBattle();
}

/* ================================================================== routing + events */

function render() {
  document.querySelectorAll('.top nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === state.tab));
  if (state.tab === 'teams') renderTeams();
  else if (state.bs) renderBattle();
  else renderBattleSetup();
}

document.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-act],[data-tab]');
  if (!t) return;
  if (t.dataset.tab) {                     // top navigation
    if (state.editor) return;
    state.tab = t.dataset.tab; render(); return;
  }
  const act = t.dataset.act, side = t.dataset.side, id = t.dataset.id;
  const e = state.editor;
  switch (act) {
    case 'new': openEditor(side); break;
    case 'rename': {
      const sd = store.sideById(side);
      const cur = store.getTeamName(side);
      const got = prompt(`Name for ${sd.name}’s team?\n(Leave it empty to just use “${sd.name}’s team”.)`, cur);
      if (got === null) break;
      store.setTeamName(side, got);
      state.lastSig = store.signature();
      render();
      break;
    }
    case 'edit': openEditor(side, state.teams[side].find(m => m.id === id)); break;
    case 'del': {
      const mon = state.teams[side].find(m => m.id === id);
      if (mon && confirm(`Delete ${mon.name}? This can’t be undone.`)) { store.deleteMon(mon); refreshTeams(); render(); toast(`${mon.name} deleted`); }
      break;
    }
    case 'close': closeEditor(); break;
    case 'save': saveEditor(); break;
    case 'rmpic': if (e) { e.imgData = null; e.imgRemoved = true; renderEditor(); } break;
    case 'fit': if (e) { e.d.stats = S.scaleToBudget(e.d.stats, e.d.legendary); scheduleDraftSave(); renderEditor(); } break;
    case 'addmove': if (e) { e.view = 'moves'; renderEditor(); } break;
    case 'backform': if (e) { e.view = 'form'; renderEditor(); } break;
    case 'rmmove': if (e) { e.d.moves.splice(Number(t.dataset.i), 1); scheduleDraftSave(); syncDerived(); } break;
    case 'mtab': if (e) { e.mf.tab = t.dataset.mtab; renderEditor(); if (e.mf.tab === 'invent') syncInvent(); } break;
    case 'pickmove': addMove({ real: t.dataset.move }); break;
    case 'addinvented': {
      const c = S.normalizeCustomMove(e.invent, TYPES);
      if (!c.label) { toast('Give the move a name first.'); break; }
      e.invent = { label: '', type: 'normal', cls: 'physical', power: 70, acc: 100 };
      addMove({ custom: c });
      break;
    }
    case 'pick': {
      const arr = state.picks[side], i = arr.indexOf(id);
      if (i >= 0) arr.splice(i, 1); else if (arr.length < 6) arr.push(id); else toast('A team can have up to 6.');
      renderBattleSetup(); break;
    }
    case 'start': startBattle(); break;
    case 'vs': prefs.vs = t.dataset.vs; savePrefs(); if (prefs.vs !== 'pvp') rollCpu(); renderBattleSetup(); break;
    case 'reroll': rollCpu(); renderBattleSetup(); break;
    case 'move': { state.bs.choices[Number(side)] = { type: 'move', move: t.dataset.key }; renderBattle(); break; }
    case 'switch': { state.bs.choices[Number(side)] = { type: 'switch', to: Number(t.dataset.idx) }; renderBattle(); break; }
    case 'random': { const i = Number(side); if (i === state.bs.cpuIdx) break; state.bs.choices[i] = B.randomChoice(state.bs.match, i); renderBattle(); break; }
    case 'resolve': resolveTurn(); break;
    case 'replace': { state.bs.picks[Number(side)] = Number(t.dataset.idx); renderBattle(); break; }
    case 'sendout': {
      try { B.replace(state.bs.match, state.bs.picks); } catch (err) { toast(err.message); break; }
      autoPickReplacements(); renderBattle(); break;
    }
    case 'rematch': beginMatch(state.bs.lineups, state.bs.cpuIdx); break;
    case 'rematch-new': {
      const lineups = state.bs.lineups.slice();
      rollCpu();
      lineups[state.bs.cpuIdx] = { side: lineups[state.bs.cpuIdx].side, mons: state.cpu.team };
      beginMatch(lineups, state.bs.cpuIdx);
      break;
    }
    case 'tosetup': state.bs = null; renderBattleSetup(); break;
  }
});

const modal = $('#modal');
modal.addEventListener('input', onEditorInput);
modal.addEventListener('change', onEditorChange);
// (No click-outside-to-close: a half-built Pokémon is too easy to lose by tapping the wrong spot.)

document.addEventListener('change', (ev) => {
  if (ev.target.id === 'levelmode') { prefs.level = ev.target.value; savePrefs(); }
  if (ev.target.id === 'hints') { prefs.hints = ev.target.checked; savePrefs(); }
  if (ev.target.id === 'cpusize') { prefs.cpuSize = Number(ev.target.value); savePrefs(); rollCpu(); renderBattleSetup(); }
  if (ev.target.id === 'cpudiff') { prefs.difficulty = ev.target.value; savePrefs(); rollCpu(); renderBattleSetup(); }
});

/* Another device may have added a Pokémon; sync writes straight to storage, so look for it. */
setInterval(() => {
  if (state.editor || state.bs) return;
  const sig = store.signature();
  if (sig !== state.lastSig) { refreshTeams(); render(); }
}, 2500);

/* ================================================================== go */

refreshTeams();
store.resumeUploads(SIDES.flatMap(s => state.teams[s.id]));
render();

// handy for poking at from the console
W.__pokesim = { state, store, B, S, openEditor, refreshTeams, render };
