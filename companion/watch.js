// watch.js — companion panel, Broadsheet edition.
//
// The whole page renders the game as it looked `offsetSec` ago, so it stays in
// step with a stream that runs behind real time. lib/mlb.js hands us a timeline
// of time-stamped moments; rendering is "binary search for the last moment at
// or before the viewer's clock, then draw it".
//
// That module is called straight from the browser — statsapi.mlb.com sends
// `access-control-allow-origin: *`, so this page needs no backend and works
// the same from static hosting as from the local server. The Node server
// imports the very same file, so there is one copy of the slimming logic.
//
// This screen is read from across a room, so copy is trimmed to its leading
// sentences on the way out (see `brief`) — the content library keeps the long
// version, the page shows the part you can take in at a glance.

import { getSchedule, getGame, getPlayer } from './lib/mlb.js';

const $ = (id) => document.getElementById(id);

const POLL_MS = 10_000;
const TICK_MS = 500;
const DEFAULT_OFFSET = 30; // sane starting guess for a live stream, in seconds

const state = {
  gamePk: null,
  game: null,
  timeline: [],
  pitchIdx: [], // indexes into timeline of kind==='pitch', for stepping
  offsetSec: DEFAULT_OFFSET,
  shownPlayers: { batter: null, pitcher: null },
  noteKeys: {},
  players: new Map(),
  pollTimer: null,
};

const viewerTime = () => Date.now() - state.offsetSec * 1000;

// ---------- helpers ----------

// Keep the first n sentences. Decimals are safe: the split needs whitespace
// after the period, and ".400" has none.
function brief(text, n = 2) {
  if (!text) return '';
  const parts = String(text).split(/(?<=[.!?])\s+/);
  return parts.slice(0, n).join(' ');
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
    return 'Could not reach the MLB API — check your connection.';
  }
  return m;
}

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Safari throws on `toLocaleTimeString([], …)` where Chromium shrugs, and a
// missing/odd date shouldn't take the whole schedule down with it.
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

function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

// A kicker / title / body block — the page's one repeated reading unit.
function readingBlock(kicker, title, body, cls = '') {
  const wrap = document.createElement('div');
  if (cls) wrap.className = cls;
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

// ---------- schedule ----------

async function loadSchedule() {
  const sel = $('game-select');
  try {
    const { games } = await getSchedule();
    if (!games.length) {
      sel.innerHTML = '<option value="">No games scheduled today</option>';
      return;
    }
    sel.innerHTML = '';
    for (const g of games) {
      const opt = document.createElement('option');
      opt.value = g.gamePk;
      const when =
        g.state === 'Live'
          ? `${g.isTopInning ? 'Top' : 'Bot'} ${ordinal(g.inning || 1)}`
          : g.state === 'Final'
            ? 'Final'
            : clockTime(g.startTime);
      const score = g.state === 'Preview' ? '' : ` ${g.away.score}–${g.home.score}`;
      opt.textContent = `${g.away.name} @ ${g.home.name} · ${when}${score}`;
      sel.appendChild(opt);
    }
    const saved = localStorage.getItem('bc.gamePk');
    const live = games.find((g) => g.state === 'Live');
    const pick = games.some((g) => String(g.gamePk) === saved) ? saved : String((live || games[0]).gamePk);
    sel.value = pick;
    selectGame(Number(pick));
  } catch (e) {
    banner('Could not load the schedule: ' + apiError(e), true);
  }
}

// ---------- game polling ----------

function selectGame(gamePk) {
  if (!gamePk || gamePk === state.gamePk) return;
  state.gamePk = gamePk;
  state.game = null;
  state.timeline = [];
  state.pitchIdx = [];
  state.shownPlayers = { batter: null, pitcher: null };
  state.noteKeys = {};
  // Drop every render-dedup key, or the new game's first draw gets skipped as
  // "unchanged" and the previous game's cards linger.
  for (const k of ['lastSituation', 'lastSeasonKey', 'lastLore', 'lastCount']) {
    state[k] = null;
  }
  $('situation-list').innerHTML = '';
  localStorage.setItem('bc.gamePk', String(gamePk));

  const savedOffset = Number(localStorage.getItem(`bc.offset.${gamePk}`));
  setOffset(Number.isFinite(savedOffset) && savedOffset > 0 ? savedOffset : DEFAULT_OFFSET, false);

  clearInterval(state.pollTimer);
  state.pollTimer = setInterval(pollGame, POLL_MS);
  pollGame();
}

async function pollGame() {
  if (!state.gamePk) return;
  try {
    const game = await getGame(state.gamePk);
    state.game = game;
    state.timeline = game.timeline || [];
    state.pitchIdx = state.timeline.reduce((acc, m, i) => {
      if (m.kind === 'pitch') acc.push(i);
      return acc;
    }, []);
    banner(
      game.status === 'Preview' ? `Game hasn't started yet — first pitch ${clockTime(game.startTime)}.` : ''
    );
  } catch (e) {
    banner('Lost contact with the MLB API: ' + apiError(e), true);
  }
}

// ---------- timeline lookup ----------

// Last moment at or before t.
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

function lastOfKind(fromIdx, kind) {
  for (let i = fromIdx; i >= 0; i--) if (state.timeline[i].kind === kind) return state.timeline[i];
  return null;
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
  // Floor, never round. The offset is whole seconds, so rounding up would put
  // the viewer's clock *before* the pitch we just snapped to — and the panel
  // would then display the previous pitch, making a correct snap look wrong.
  state.offsetSec = Math.max(0, Math.floor(sec));
  const label = fmtDelay(state.offsetSec);
  setText('delay-label', label);
  setText('delay-overlay', state.offsetSec === 0 ? 'live' : `${label} behind live`);
  if (persist && state.gamePk) localStorage.setItem(`bc.offset.${state.gamePk}`, String(state.offsetSec));
}

// The sync controls are useless without a loaded game, and silently doing
// nothing reads as "the button is broken" — say what's missing instead.
function haveTimeline() {
  if (state.pitchIdx.length) return true;
  banner(
    state.game
      ? 'No pitches in this game yet — sync once it starts.'
      : 'No game loaded yet, so there is nothing to sync to. Pick a game above.',
    true
  );
  return false;
}

function syncToNearestPitch() {
  if (!haveTimeline()) return;
  const t = viewerTime();
  let best = null;
  let bestDist = Infinity;
  for (const i of state.pitchIdx) {
    const d = Math.abs(state.timeline[i].t - t);
    if (d < bestDist) {
      bestDist = d;
      best = state.timeline[i];
    }
  }
  if (best) {
    setOffset((Date.now() - best.t) / 1000);
    banner('');
  }
}

// Walk one pitch earlier (dir -1, further behind) or later (dir +1).
function stepPitch(dir) {
  if (!haveTimeline()) return;
  const t = viewerTime();
  let cur = -1;
  for (let k = 0; k < state.pitchIdx.length; k++) {
    if (state.timeline[state.pitchIdx[k]].t <= t + 250) cur = k;
    else break;
  }
  const next = Math.min(state.pitchIdx.length - 1, Math.max(0, cur + (dir > 0 ? 1 : -1)));
  const m = state.timeline[state.pitchIdx[next]];
  if (m) setOffset((Date.now() - m.t) / 1000);
}

// ---------- today's line ----------
// Derived from the *delayed* timeline rather than the boxscore, so a home run
// can't appear in a player's line seconds before the viewer sees him hit it.

const HIT_TYPES = new Set(['single', 'double', 'triple', 'home_run']);
const NON_AB = new Set([
  'walk',
  'intent_walk',
  'hit_by_pitch',
  'sac_fly',
  'sac_bunt',
  'sac_fly_double_play',
  'sac_bunt_double_play',
  'catcher_interf',
]);

// "a double" / "2 doubles" — reads like a person wrote it.
function countPhrase(n, singular, pluralWord) {
  if (n === 1) return (/^[aeiou]/i.test(singular) ? 'an ' : 'a ') + singular;
  return `${n} ${pluralWord || singular + 's'}`;
}

function joinList(items) {
  if (items.length <= 1) return items[0] || '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function batterToday(id, upto) {
  let ab = 0;
  let hits = 0;
  let walks = 0;
  let ks = 0;
  let rbi = 0;
  const extras = {}; // 'double' -> 2
  for (const m of state.timeline) {
    if (m.t > upto) break;
    if (m.kind !== 'play' || m.resultType !== 'atBat' || m.batterId !== id) continue;
    rbi += m.rbi || 0;
    if (NON_AB.has(m.eventType)) {
      if (m.eventType === 'walk' || m.eventType === 'intent_walk') walks++;
      continue;
    }
    ab++;
    if (HIT_TYPES.has(m.eventType)) {
      hits++;
      if (m.eventType !== 'single') {
        const label = m.eventType.replace('_', ' ');
        extras[label] = (extras[label] || 0) + 1;
      }
    }
    if (m.eventType === 'strikeout') ks++;
  }
  if (!ab && !walks) return null;

  const bits = Object.entries(extras).map(([label, n]) => countPhrase(n, label));
  if (walks) bits.push(countPhrase(walks, 'walk'));
  if (rbi) bits.push(rbi === 1 ? 'an RBI' : `${rbi} RBI`);
  if (!bits.length && ks) bits.push(countPhrase(ks, 'strikeout'));

  const tail = bits.length ? ` with ${joinList(bits)}` : '';
  return { ab, hits, walks, rbi, text: `${hits}-for-${ab} today${tail}.` };
}

function pitcherToday(id, upto) {
  let pitches = 0;
  let ks = 0;
  let walks = 0;
  let hits = 0;
  for (const m of state.timeline) {
    if (m.t > upto) break;
    if (m.pitcherId !== id) continue;
    if (m.kind === 'pitch') pitches++;
    else if (m.kind === 'play' && m.resultType === 'atBat') {
      if (m.eventType === 'strikeout') ks++;
      else if (m.eventType === 'walk' || m.eventType === 'intent_walk') walks++;
      else if (HIT_TYPES.has(m.eventType)) hits++;
    }
  }
  if (!pitches) return null;
  const bits = [];
  if (ks) bits.push(countPhrase(ks, 'strikeout'));
  if (hits) bits.push(`${countPhrase(hits, 'hit')} allowed`);
  if (walks) bits.push(countPhrase(walks, 'walk'));
  const tail = bits.length ? `, with ${joinList(bits)}` : '';

  // Each side has its own starter — the first pitcher to work the top half and
  // the first to work the bottom — so checking only the game's opening pitch
  // would misfile one of them as a reliever.
  const isStarter = ['top', 'bottom'].some((half) => {
    const first = state.timeline.find((m) => m.kind === 'pitch' && m.half === half);
    return first && first.pitcherId === id;
  });
  const context = isStarter
    ? ' Starters usually come out around 90 to 100 pitches.'
    : ' He came out of the bullpen; relievers must face at least three batters.';

  return { pitches, text: `${pitches} pitches in this game${tail}.${context}` };
}

// ---------- players ----------

// Caches the *promise*, not the result, so a slow lookup can't fire a pile of
// duplicate requests and a failing one isn't retried twice a second.
function ensurePlayer(id) {
  if (!id) return Promise.resolve(null);
  if (!state.players.has(id)) {
    const pending = getPlayer(id).catch(() => null);
    state.players.set(id, pending);
    pending.then((p) => {
      if (!p) setTimeout(() => state.players.delete(id), 60_000);
    });
  }
  return state.players.get(id);
}

function statHtml(pairs) {
  return pairs
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([label, value, tipKey]) => {
      const tip = (window.Factoids.GLOSSARY[tipKey] || '').replace(/"/g, '&quot;');
      return `<div title="${tip}"><span>${label}</span><b>${value}</b></div>`;
    })
    .join('');
}

async function renderPlayer(which, id, now) {
  const card = $(`${which}-card`);
  if (!id) {
    card.hidden = true;
    return;
  }

  const p = await ensurePlayer(id);
  if (!p) return;

  // Static half — only redrawn when the player actually changes.
  if (state.shownPlayers[which] !== id) {
    state.shownPlayers[which] = id;
    card.hidden = false;

    const shot = $(`${which}-shot`);
    // Content blockers eat mlbstatic.com for some people; fall back to initials
    // rather than leaving a broken image in the column.
    shot.onerror = () => {
      shot.onerror = null;
      const initials = p.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('');
      shot.src =
        'data:image/svg+xml,' +
        encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><rect width="42" height="42" fill="#8b8481"/><text x="21" y="28" font-size="16" font-family="Georgia,serif" fill="#f3f2f2" text-anchor="middle">${initials}</text></svg>`
        );
    };
    shot.src = p.headshot;
    shot.alt = p.name;

    setText(`${which}-name`, p.name);
    const side = (c) => (c === 'L' ? 'left' : c === 'R' ? 'right' : c);
    const hand =
      which === 'batter'
        ? p.bats
          ? `Bats ${side(p.bats)}`
          : ''
        : p.throws
          ? `Throws ${side(p.throws)}`
          : '';
    setText(
      `${which}-sub`,
      [p.number ? `#${p.number}` : '', p.positionName, hand].filter(Boolean).join(' · ')
    );

    const s = which === 'batter' ? p.hitting : p.pitching;
    $(`${which}-stats`).innerHTML = s
      ? which === 'batter'
        ? statHtml([
            ['AVG', s.avg, 'AVG'],
            ['OPS', s.ops, 'OPS'],
            ['HR', s.homeRuns, 'SLG'],
            ['RBI', s.rbi, 'RBI'],
          ])
        : statHtml([
            ['ERA', s.era, 'ERA'],
            ['WHIP', s.whip, 'WHIP'],
            ['IP', s.inningsPitched, 'ERA'],
            ['W–L', `${s.wins}–${s.losses}`, 'ERA'],
          ])
      : '';
  }

  // Rotating half — the teaching note under the stat line, cycled so the column
  // stays alive through a long at-bat instead of parking on one sentence.
  const today = which === 'batter' ? batterToday(id, now) : pitcherToday(id, now);
  const notes = window.Factoids.playerNotes(p, today, which);
  if (!notes.length) return;
  const note = brief(notes[Math.floor(Date.now() / 20_000) % notes.length], 2);
  if (state.noteKeys[which] === note) return;
  state.noteKeys[which] = note;
  setText(`${which}-note`, note);
}

// ---------- render ----------

function renderDateline(m) {
  const g = state.game;
  if (!g) return;
  const el = $('dateline-state');
  el.textContent = g.status === 'Live' ? 'Live' : g.status === 'Final' ? 'Final' : 'Scheduled';
  el.classList.toggle('is-final', g.status === 'Final');
  el.classList.toggle('is-preview', g.status === 'Preview');

  setText(
    'dateline-inning',
    m ? `${m.half === 'top' ? 'Top' : 'Bottom'} ${ordinal(m.inning)} · ${m.outs} out` : g.detailedState || ''
  );
  setText('dateline-venue', [g.venue, longDate(g.startTime)].filter(Boolean).join(' · '));
}

function renderScoreline(m) {
  const g = state.game;
  if (!g) return;
  setText('sb-away', g.teams.away.abbr || '—');
  setText('sb-home', g.teams.home.abbr || '—');
  // Never fall back to the live linescore: if the viewer's clock sits before the
  // first moment, showing the true current state would spoil the very thing the
  // offset exists to hide.
  setText('sb-away-score', m ? m.awayScore : 0);
  setText('sb-home-score', m ? m.homeScore : 0);

  const half = m ? m.half : null;
  $('sb-away').classList.toggle('batting', half === 'top');
  $('sb-away-score').classList.toggle('batting', half === 'top');
  $('sb-home').classList.toggle('batting', half === 'bottom');
  $('sb-home-score').classList.toggle('batting', half === 'bottom');

  setText('cnt-balls', m ? m.balls : 0);
  setText('cnt-strikes', m ? m.strikes : 0);
  setText('cnt-outs', m ? m.outs : 0);

  const bases = (m && m.bases) || {};
  $('b1').classList.toggle('on', !!bases.first);
  $('b2').classList.toggle('on', !!bases.second);
  $('b3').classList.toggle('on', !!bases.third);
}

function renderLastPitch(pitch) {
  const card = $('last-pitch-card');
  if (!pitch) {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  // The plate numeral is four copies of the same text: the paper union plus one
  // span per process plate, offset and multiplied into register.
  const mph = pitch.speed != null ? pitch.speed.toFixed(1) : '—';
  for (const id of ['mph-paper', 'mph-c', 'mph-m', 'mph-y']) setText(id, mph);
  setText('lp-type', pitch.pitchType || 'Pitch');
  setText('lp-call', pitch.call || '');
  const info = window.Factoids.pitchInfo(pitch.pitchType);
  setText('lp-explain', info ? brief(info.body, 2) : '');
}

function renderHappened(play, now) {
  const card = $('happened-card');
  // Only surface a play for a while after it lands, so the column doesn't sit on
  // stale news through a long at-bat.
  if (!play || now - play.t > 45_000 || !play.desc) {
    card.hidden = true;
    return;
  }
  card.hidden = false;
  setText('happened-desc', play.desc);
}

function renderCount(m) {
  const balls = m ? m.balls : 0;
  const strikes = m ? m.strikes : 0;
  const key = `${balls}-${strikes}`;
  if (key === state.lastCount) return;
  state.lastCount = key;
  setText('count-val', `${balls}–${strikes}`);
  setText('count-explain', brief(window.Factoids.COUNTS[key] || '', 2));
}

// The live read on the moment — bases, outs, strategy — rebuilt whenever the
// situation on the field changes. The count has its own block below, so that
// card is excluded here.
function renderSituation(m, play, now) {
  const wrap = $('situation-list');
  if (!m) {
    wrap.innerHTML = '';
    state.lastSituation = null;
    return;
  }
  const fresh = play && now - play.t < 25_000 ? play.eventType : null;
  const cards = window.Factoids
    .pick(
      {
        balls: m.balls,
        strikes: m.strikes,
        outs: m.outs,
        inning: m.inning,
        awayScore: m.awayScore,
        homeScore: m.homeScore,
        bases: m.bases || {},
        eventType: fresh,
      },
      { limit: 5, rotation: Math.floor(Date.now() / 30_000) }
    )
    .filter((c) => c.id !== 'count-explain')
    .slice(0, 2); // two, so the column fits one screen without scrolling

  const key = cards.map((c) => c.id + '§' + c.title).join('|');
  if (key === state.lastSituation) return;
  state.lastSituation = key;

  wrap.innerHTML = '';
  for (const c of cards) wrap.appendChild(readingBlock(c.tag, c.title, brief(c.body, 2)));
}

// Rotating reading under the players: this club, or the sport at large.
function renderLore() {
  const g = state.game;
  const wrap = $('lore-list');
  if (!g?.teams) {
    wrap.innerHTML = '';
    return;
  }
  const ids = [g.teams.away?.id, g.teams.home?.id].filter(Boolean);
  const rot = Math.floor(Date.now() / 40_000);
  const facts = [window.Factoids.teamFacts(ids, rot), window.Factoids.teamFacts(ids, rot + 1)];

  const key = facts.map((f) => f.title).join('|');
  if (key === state.lastLore) return;
  state.lastLore = key;

  wrap.innerHTML = '';
  wrap.classList.toggle('is-redsox', !!facts[0].isRedSox);
  for (const f of facts) wrap.appendChild(readingBlock(f.tag, f.title, brief(f.body, 1)));
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
  const key = `${a.record.wins}-${a.record.losses}/${h.record.wins}-${h.record.losses}`;
  if (key === state.lastSeasonKey) return;
  state.lastSeasonKey = key;

  card.hidden = false;
  const row = (t) =>
    `<div class="season-row"><b>${t.name}</b><span class="season-rec">${t.record.wins}–${t.record.losses}</span></div>`;
  $('season-rows').innerHTML = row(a) + row(h);

  const better = Number(a.record.pct) >= Number(h.record.pct) ? a : h;
  const games = Math.abs((a.record.wins - a.record.losses) / 2 - (h.record.wins - h.record.losses) / 2);
  setText(
    'season-note',
    games >= 0.5
      ? `${better.name} lead by ${games % 1 ? games.toFixed(1) : games}.`
      : 'Dead even.'
  );
}

// ---------- the sync heartbeat ----------

const FIRING_MS = 1600;

function nextPitchAfter(t) {
  for (const i of state.pitchIdx) {
    const m = state.timeline[i];
    if (m.t > t) return m;
  }
  return null;
}

function renderBeat() {
  const beat = $('beat');
  const label = $('beat-label');
  const count = $('beat-count');
  if (!beat) return;

  if (!state.game || !state.pitchIdx.length) {
    beat.className = 'beat waiting';
    label.textContent = '';
    count.textContent = 'no game';
    return;
  }

  const vt = viewerTime();
  const last = lastOfKind(indexAt(vt), 'pitch');

  if (last && vt - last.t < FIRING_MS) {
    beat.className = 'beat firing';
    label.textContent = '';
    count.textContent = 'PITCH';
    return;
  }

  const next = nextPitchAfter(vt);
  if (!next) {
    // Two different reasons there's no next pitch, and conflating them reads as
    // a bug: the game is over, or the viewer has caught up to the live edge.
    beat.className = 'beat waiting';
    label.textContent = '';
    count.textContent = state.game.status === 'Final' ? 'final' : 'waiting…';
    return;
  }

  const secs = (next.t - vt) / 1000;
  beat.className = 'beat';
  label.textContent = 'next';
  count.textContent =
    secs >= 60 ? `${Math.floor(secs / 60)}m ${String(Math.floor(secs % 60)).padStart(2, '0')}s` : `${secs.toFixed(1)}s`;
}

// ---------- tick ----------

function tick() {
  if (!state.game) return;

  // A game with no timeline yet (not started, or just switched to). Draw the new
  // game's shell and clear the last one's cards rather than bailing out and
  // leaving a stale scoreline and stale players on screen.
  if (!state.timeline.length) {
    renderDateline(null);
    renderScoreline(null);
    renderLastPitch(null);
    renderHappened(null, 0);
    renderCount(null);
    renderSituation(null);
    $('batter-card').hidden = true;
    $('pitcher-card').hidden = true;
    renderSeason();
    renderLore();
    return;
  }

  const now = viewerTime();
  const idx = indexAt(now);
  const m = idx >= 0 ? state.timeline[idx] : null;
  const play = lastOfKind(idx, 'play');

  renderDateline(m);
  renderScoreline(m);
  renderLastPitch(lastOfKind(idx, 'pitch'));
  renderHappened(play, now);
  renderCount(m);
  renderSituation(m, play, now);
  renderSeason();
  renderLore();

  if (m) {
    renderPlayer('batter', m.batterId, now);
    renderPlayer('pitcher', m.pitcherId, now);
  }
}

// ---------- video slot ----------
// Plays a source as-is. Detection and the cookie-replaying proxy live on the
// main Stream Finder page.

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

  const isHls = /\.m3u8(\?|$)/i.test(src);
  if (isHls && window.Hls && window.Hls.isSupported()) {
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
        videoError(
          'Could not play that stream — it may need the referer/cookie handling the main Stream Finder page does.'
        );
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
  localStorage.setItem('bc.videoUrl', url);
});

$('clear-video').addEventListener('click', () => {
  $('video-url').value = '';
  localStorage.removeItem('bc.videoUrl');
  clearVideo();
});

// Streams expire, so the URL is remembered but never auto-played — it's there
// to edit rather than to fail on load.
const savedVideo = localStorage.getItem('bc.videoUrl');
if (savedVideo) $('video-url').value = savedVideo;

// ---------- wire up ----------

$('game-select').addEventListener('change', (e) => selectGame(Number(e.target.value)));
$('refresh').addEventListener('click', loadSchedule);
$('theme-toggle').addEventListener('click', () =>
  applyTheme(document.body.dataset.theme === 'night' ? 'paper' : 'night')
);
$('sync-now').addEventListener('click', syncToNearestPitch);
$('pitch-back').addEventListener('click', () => stepPitch(-1));
$('pitch-fwd').addEventListener('click', () => stepPitch(1));
$('nudge-less').addEventListener('click', () => setOffset(state.offsetSec - 1));
$('nudge-more').addEventListener('click', () => setOffset(state.offsetSec + 1));
$('go-live').addEventListener('click', () => setOffset(0));

applyTheme(localStorage.getItem('bc.theme') || 'night');
setOffset(DEFAULT_OFFSET, false);
loadSchedule();
setInterval(tick, TICK_MS);
// The heartbeat runs on its own faster clock — the panel only needs redrawing
// twice a second, but a countdown has to move smoothly to be readable.
setInterval(renderBeat, 100);
