// hoops.js — basketball companion.
//
// Same engine as the baseball side: nba.js hands over a timeline of plays
// stamped with their real UTC time, and the page renders the game as it looked
// `offsetSec` ago, so nothing on screen runs ahead of the viewer's picture.
//
// The sync is simpler here than in baseball. Basketball puts a game clock on
// screen in every broadcast and the feed carries that same clock on every
// play, so the viewer reads it off, types it in, and the offset is exact —
// no snapping to an event and stepping until it lines up.
//
// lib/nba.js is called straight from the browser: ESPN sends
// `access-control-allow-origin: *`, so this page needs no backend and works
// from static hosting. The Node server imports the same file.

import { getScoreboard, getGame } from './lib/nba.js';

const $ = (id) => document.getElementById(id);

const POLL_MS = 10_000;
const TICK_MS = 500;
const DEFAULT_OFFSET = 30;

const state = {
  gameId: null,
  game: null,
  timeline: [],
  players: {},
  offsetSec: DEFAULT_OFFSET,
  shown: {},
  pollTimer: null,
};

const viewerTime = () => Date.now() - state.offsetSec * 1000;

// ---------- helpers ----------

function brief(text, n = 2) {
  if (!text) return '';
  return String(text).split(/(?<=[.!?])\s+/).slice(0, n).join(' ');
}

function banner(msg, isError = false) {
  const el = $('banner');
  if (!msg) {
    el.hidden = true;
    return;
  }
  el.hidden = false;
  el.textContent = msg;
  el.classList.toggle('error', isError);
}

// The upstream module throws on a bad response; this just makes the message
// something a person can act on.
function apiError(e) {
  const m = String(e && e.message) || 'unknown error';
  if (/Failed to fetch|NetworkError|Load failed/i.test(m)) {
    return 'Could not reach the NBA feed — check your connection.';
  }
  return m;
}

function clockTime(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'TBD';
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  } catch {
    return 'TBD';
  }
}

function longDate(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

const setText = (id, text) => {
  const el = $(id);
  if (el) el.textContent = text;
};

const periodName = (n) => (!n ? '—' : n <= 4 ? `Q${n}` : n === 5 ? 'OT' : `${n - 4}OT`);

// "11:24" -> 684. Accepts "1124", "11.24" and bare seconds too, because the
// viewer is typing what they see at speed.
function parseClock(raw) {
  if (!raw) return null;
  const s = String(raw).trim().replace(/[.\s]/g, ':');
  if (/^\d{3,4}$/.test(s)) {
    const sec = Number(s.slice(-2));
    const min = Number(s.slice(0, -2));
    return min * 60 + sec;
  }
  if (s.includes(':')) {
    const [m, sec] = s.split(':');
    const mm = Number(m);
    const ss = Number(sec);
    if (!Number.isFinite(mm) || !Number.isFinite(ss)) return null;
    return mm * 60 + ss;
  }
  const n = Number(s);
  return Number.isFinite(n) ? Math.ceil(n) : null;
}

function readingBlock(kicker, title, body) {
  const wrap = document.createElement('div');
  const k = document.createElement('p');
  k.className = 'kick';
  k.textContent = kicker;
  const h = document.createElement('h3');
  h.className = 'block-title';
  h.textContent = title;
  const p = document.createElement('p');
  p.className = 'minor';
  p.textContent = body;
  wrap.append(k, h, p);
  return wrap;
}

// ---------- theme ----------

function applyTheme(name) {
  const theme = name === 'paper' ? 'paper' : 'night';
  document.body.dataset.theme = theme;
  setText('theme-toggle', theme === 'night' ? 'Paper' : 'Night');
  localStorage.setItem('bc.theme', theme);
}

// ---------- scoreboard ----------

async function loadScoreboard() {
  const sel = $('game-select');
  try {
    const { games } = await getScoreboard();
    if (!games.length) {
      sel.innerHTML = '<option value="">No games scheduled today</option>';
      return;
    }
    sel.innerHTML = '';
    for (const g of games) {
      const opt = document.createElement('option');
      opt.value = g.gameId;
      const when =
        g.state === 'in'
          ? `${periodName(g.period)} ${g.clock || ''}`.trim()
          : g.state === 'post'
            ? 'Final'
            : clockTime(g.startTime);
      const score = g.state === 'pre' ? '' : ` ${g.away.score}–${g.home.score}`;
      opt.textContent = `${g.away.name} @ ${g.home.name} · ${when}${score}`;
      sel.appendChild(opt);
    }
    const saved = localStorage.getItem('hoops.gameId');
    const live = games.find((g) => g.state === 'in');
    const pick = games.some((g) => g.gameId === saved) ? saved : (live || games[0]).gameId;
    sel.value = pick;
    selectGame(pick);
  } catch (e) {
    banner('Could not load the schedule: ' + apiError(e), true);
  }
}

// ---------- game ----------

function selectGame(gameId) {
  if (!gameId || gameId === state.gameId) return;
  state.gameId = gameId;
  state.game = null;
  state.timeline = [];
  state.players = {};
  state.shown = {};
  $('situation-list').innerHTML = '';
  localStorage.setItem('hoops.gameId', gameId);

  const saved = Number(localStorage.getItem(`hoops.offset.${gameId}`));
  setOffset(Number.isFinite(saved) && saved > 0 ? saved : DEFAULT_OFFSET, false);

  clearInterval(state.pollTimer);
  state.pollTimer = setInterval(pollGame, POLL_MS);
  pollGame();
}

async function pollGame() {
  if (!state.gameId) return;
  try {
    const g = await getGame(state.gameId);
    state.game = g;
    state.timeline = g.timeline || [];
    state.players = g.players || {};
    populatePeriods();
    banner(
      g.state === 'pre' ? `Tip-off ${clockTime(g.startTime)}.` : ''
    );
  } catch (e) {
    banner('Lost contact with the NBA feed: ' + apiError(e), true);
  }
}

function populatePeriods() {
  const sel = $('sync-period');
  const max = Math.max(4, ...state.timeline.map((m) => m.period || 0));
  if (sel.options.length === max) return;
  sel.innerHTML = '';
  for (let p = 1; p <= max; p++) {
    const o = document.createElement('option');
    o.value = String(p);
    o.textContent = periodName(p);
    sel.appendChild(o);
  }
  const cur = state.timeline.length ? state.timeline[state.timeline.length - 1].period : 1;
  sel.value = String(cur || 1);
}

// ---------- timeline lookup ----------

function indexAt(t) {
  const tl = state.timeline;
  let lo = 0;
  let hi = tl.length - 1;
  let ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (tl[mid].t <= t) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

// Net scoring over the recent stretch — the thing commentators call a run.
// Positive means the home side is on it.
function runAt(idx, lookback = 24) {
  if (idx < 1) return 0;
  const now = state.timeline[idx];
  const then = state.timeline[Math.max(0, idx - lookback)];
  const home = (now.homeScore || 0) - (then.homeScore || 0);
  const away = (now.awayScore || 0) - (then.awayScore || 0);
  return home - away;
}

// ---------- sync ----------

function fmtDelay(sec) {
  if (sec < 120) return `${sec}s`;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h ? `${h}h ${m}m` : `${m}m ${String(s).padStart(2, '0')}s`;
}

function setOffset(sec, persist = true) {
  // Floor, never round: rounding up would put the viewer's clock before the
  // play we matched, so the panel would show the previous one.
  state.offsetSec = Math.max(0, Math.floor(sec));
  const label = fmtDelay(state.offsetSec);
  setText('delay-label', label);
  setText('delay-overlay', state.offsetSec === 0 ? 'live' : `${label} behind live`);
  if (persist && state.gameId) {
    localStorage.setItem(`hoops.offset.${state.gameId}`, String(state.offsetSec));
  }
}

// The whole sync, in one step: find the play at the clock the viewer can see,
// and set the delay to the gap between that play's real time and now.
function syncToClock() {
  if (!state.timeline.length) {
    banner('No play-by-play loaded yet — pick a game that has started.', true);
    return;
  }
  const period = Number($('sync-period').value);
  const target = parseClock($('sync-clock').value);
  if (target == null) {
    banner('Type the clock as it reads on your screen, for example 11:24.', true);
    return;
  }

  const inPeriod = state.timeline.filter((m) => m.period === period && m.clockSec != null);
  if (!inPeriod.length) {
    banner(`No plays recorded yet in ${periodName(period)}.`, true);
    return;
  }

  let best = inPeriod[0];
  let bestDist = Infinity;
  for (const m of inPeriod) {
    const d = Math.abs(m.clockSec - target);
    if (d < bestDist) {
      bestDist = d;
      best = m;
    }
  }

  setOffset((Date.now() - best.t) / 1000);
  banner(
    bestDist <= 2
      ? ''
      : `Nearest play to ${periodName(period)} ${$('sync-clock').value} was at ${best.clock} — synced to that, ${bestDist}s off. Nudge with ±1s if needed.`
  );
}

// ---------- render ----------

function renderDateline(m) {
  const g = state.game;
  if (!g) return;
  const el = $('dateline-state');
  el.textContent = g.state === 'in' ? 'Live' : g.state === 'post' ? 'Final' : 'Scheduled';
  el.classList.toggle('is-final', g.state === 'post');
  el.classList.toggle('is-preview', g.state === 'pre');
  setText('dateline-inning', m ? `${periodName(m.period)} · ${m.clock || ''}` : g.statusText || '');
  setText(
    'dateline-venue',
    [g.venue, g.venueCity, longDate(g.startTime)].filter(Boolean).join(' · ')
  );
}

function renderScoreline(m, idx) {
  const g = state.game;
  if (!g) return;
  setText('sb-away', g.teams.away.abbr || '—');
  setText('sb-home', g.teams.home.abbr || '—');
  // Never fall back to the live score: that is exactly the spoiler the offset
  // exists to prevent.
  const away = m ? m.awayScore : 0;
  const home = m ? m.homeScore : 0;
  setText('sb-away-score', away);
  setText('sb-home-score', home);
  $('sb-away').classList.toggle('batting', away > home);
  $('sb-away-score').classList.toggle('batting', away > home);
  $('sb-home').classList.toggle('batting', home > away);
  $('sb-home-score').classList.toggle('batting', home > away);

  setText('gc-period', m ? periodName(m.period) : '—');
  setText('gc-clock', m && m.clock ? m.clock : '--:--');
  $('gc-clock').classList.toggle('urgent', !!(m && m.clockSec != null && m.clockSec <= 60));

  const margin = Math.abs(home - away);
  setText('tl-margin', margin);
  const run = m ? runAt(idx) : 0;
  setText('tl-run', run === 0 ? '—' : `${run > 0 ? '+' : ''}${run}`);
}

function renderPlay(m) {
  const card = $('play-card');
  if (!m) {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  // The plate numeral carries the points the play was worth — the basketball
  // analogue of the pitch speed it replaces.
  const val = m.scoring && m.scoreValue ? `+${m.scoreValue}` : '·';
  for (const id of ['pts-paper', 'pts-c', 'pts-m', 'pts-y']) setText(id, val);
  setText('play-unit', m.scoring ? 'points' : 'the play');
  setText('play-type', m.typeText || 'Play');
  setText('play-when', `${periodName(m.period)} ${m.clock || ''}`.trim());
  const info = window.Hoops.playInfo(m.typeText, m);
  setText('play-explain', info ? brief(info.body, 2) : '');
}

function renderHappened(m, now) {
  const card = $('happened-card');
  if (!m || !m.text || now - m.t > 45_000) {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  setText('happened-desc', m.text);
}

function renderSituation(m, idx) {
  const wrap = $('situation-list');
  if (!m) {
    wrap.innerHTML = '';
    state.lastSit = null;
    return;
  }
  const cards = window.Hoops.pick(
    {
      period: m.period,
      clockSec: m.clockSec,
      margin: (m.homeScore || 0) - (m.awayScore || 0),
      run: runAt(idx),
      typeText: m.typeText || '',
      scoreValue: m.scoreValue || 0,
    },
    { limit: 2, rotation: Math.floor(Date.now() / 30_000) }
  );
  const key = cards.map((c) => c.id + '§' + c.title).join('|');
  if (key === state.lastSit) return;
  state.lastSit = key;
  wrap.innerHTML = '';
  for (const c of cards) wrap.appendChild(readingBlock(c.tag, c.title, brief(c.body, 2)));
}

const STAT_KEYS = ['PTS', 'REB', 'AST', 'MIN', '+/-'];

function renderPerson(slot, athleteId) {
  const card = $(`${slot}-card`);
  const p = athleteId ? state.players[athleteId] : null;
  if (!p) {
    card.hidden = true;
    state.shown[slot] = null;
    return;
  }
  card.hidden = false;

  if (state.shown[slot] !== p.id) {
    state.shown[slot] = p.id;
    const shot = $(`${slot}-shot`);
    shot.onerror = () => {
      shot.onerror = null;
      const initials = p.name.split(' ').map((w) => w[0]).slice(0, 2).join('');
      shot.src =
        'data:image/svg+xml,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><rect width="42" height="42" fill="#8b8481"/><text x="21" y="28" font-size="16" font-family="Georgia,serif" fill="#f3f2f2" text-anchor="middle">${initials}</text></svg>`
        );
    };
    shot.src = p.headshot;
    shot.alt = p.name;
    setText(`${slot}-name`, p.name);
    setText(
      `${slot}-sub`,
      [p.jersey ? `#${p.jersey}` : '', p.position, p.starter ? 'Starter' : ''].filter(Boolean).join(' · ')
    );
  }

  $(`${slot}-stats`).innerHTML = STAT_KEYS.filter((k) => p.stats[k] !== undefined)
    .map((k) => {
      const tip = (window.Hoops.GLOSSARY[k] || '').replace(/"/g, '&quot;');
      return `<div title="${tip}"><span>${k}</span><b>${p.stats[k]}</b></div>`;
    })
    .join('');

  const notes = window.Hoops.playerNotes(p);
  if (notes.length) {
    const note = brief(notes[Math.floor(Date.now() / 20_000) % notes.length], 2);
    if (state.shown[slot + 'note'] !== note) {
      state.shown[slot + 'note'] = note;
      setText(`${slot}-note`, note);
    }
  }
}

function renderSeason() {
  const g = state.game;
  const card = $('season-card');
  const a = g?.teams?.away;
  const h = g?.teams?.home;
  if (!a?.record || !h?.record) {
    card.hidden = true;
    return;
  }
  const key = `${a.record}/${h.record}`;
  if (key === state.lastSeason) return;
  state.lastSeason = key;
  card.hidden = false;
  const row = (t) =>
    `<div class="season-row"><b>${t.name}</b><span class="season-rec">${t.record}</span></div>`;
  $('season-rows').innerHTML = row(a) + row(h);

  const pct = (rec) => {
    const [w, l] = String(rec).split('-').map(Number);
    return w + l ? w / (w + l) : 0;
  };
  const better = pct(a.record) >= pct(h.record) ? a : h;
  setText('season-note', `${better.name} have the better record of the two.`);
}

function renderLore() {
  const g = state.game;
  const wrap = $('lore-list');
  if (!g?.teams) {
    wrap.innerHTML = '';
    return;
  }
  const ids = [g.teams.away?.id, g.teams.home?.id].filter(Boolean);
  const rot = Math.floor(Date.now() / 40_000);
  const facts = [window.Hoops.teamFacts(ids, rot), window.Hoops.teamFacts(ids, rot + 1)];
  const key = facts.map((f) => f.title).join('|');
  if (key === state.lastLore) return;
  state.lastLore = key;
  wrap.innerHTML = '';
  wrap.classList.toggle('is-redsox', !!facts[0].isHome);
  for (const f of facts) wrap.appendChild(readingBlock(f.tag, f.title, brief(f.body, 1)));
}

// ---------- tick ----------

function tick() {
  if (!state.game) return;

  if (!state.timeline.length) {
    renderDateline(null);
    renderScoreline(null, -1);
    renderPlay(null);
    renderHappened(null, 0);
    renderSituation(null);
    $('p1-card').hidden = true;
    $('p2-card').hidden = true;
    renderSeason();
    renderLore();
    return;
  }

  const now = viewerTime();
  const idx = indexAt(now);
  const m = idx >= 0 ? state.timeline[idx] : null;

  renderDateline(m);
  renderScoreline(m, idx);
  renderPlay(m);
  renderHappened(m, now);
  renderSituation(m, idx);
  renderSeason();
  renderLore();

  const ids = (m && m.athleteIds) || [];
  renderPerson('p1', ids[0]);
  renderPerson('p2', ids[1]);
}

// ---------- video slot ----------

let currentHls = null;

function videoError(msg) {
  const el = $('video-err');
  el.hidden = !msg;
  el.textContent = msg || '';
}

function clearVideo() {
  if (currentHls) {
    currentHls.destroy();
    currentHls = null;
  }
  const v = $('video');
  v.removeAttribute('src');
  v.load();
  v.hidden = true;
  $('no-video').hidden = false;
  $('clear-video').hidden = true;
  videoError('');
}

function playSource(src) {
  if (currentHls) {
    currentHls.destroy();
    currentHls = null;
  }
  videoError('');
  const v = $('video');
  v.hidden = false;
  $('no-video').hidden = true;
  $('clear-video').hidden = false;

  if (/\.m3u8(\?|$)/i.test(src) && window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
    currentHls = hls;
    hls.loadSource(src);
    hls.attachMedia(v);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => v.play().catch(() => {}));
    hls.on(window.Hls.Events.ERROR, (_e, data) => {
      if (!data.fatal) return;
      if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
      else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
      else {
        hls.destroy();
        currentHls = null;
        videoError('Could not play that stream — it may need the referer/cookie handling the Stream Finder page does.');
      }
    });
    return;
  }
  v.src = src;
  v.play().catch(() => {});
  v.onerror = () => videoError('Could not play that source.');
}

$('video-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const url = $('video-url').value.trim();
  if (!url) return;
  playSource(url);
  localStorage.setItem('hoops.videoUrl', url);
});
$('clear-video').addEventListener('click', () => {
  $('video-url').value = '';
  localStorage.removeItem('hoops.videoUrl');
  clearVideo();
});
const savedVideo = localStorage.getItem('hoops.videoUrl');
if (savedVideo) $('video-url').value = savedVideo;

// ---------- wire up ----------

$('game-select').addEventListener('change', (e) => selectGame(e.target.value));
$('refresh').addEventListener('click', loadScoreboard);
$('theme-toggle').addEventListener('click', () =>
  applyTheme(document.body.dataset.theme === 'night' ? 'paper' : 'night')
);
$('sync-go').addEventListener('click', syncToClock);
$('sync-clock').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    syncToClock();
  }
});
$('nudge-less').addEventListener('click', () => setOffset(state.offsetSec - 1));
$('nudge-more').addEventListener('click', () => setOffset(state.offsetSec + 1));
$('go-live').addEventListener('click', () => setOffset(0));

applyTheme(localStorage.getItem('bc.theme') || 'night');
setOffset(DEFAULT_OFFSET, false);
loadScoreboard();
setInterval(tick, TICK_MS);
