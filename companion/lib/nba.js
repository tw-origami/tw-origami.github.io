// nba.js — NBA data client: fetches, caches, and slims game data.
//
// Mirrors mlb.js in shape so the companion UI works the same way: the core of
// the projection is a *timeline* of plays stamped with their real UTC time,
// which is what lets the client reconstruct the game as it looked N seconds
// ago (see public/hoops.js).
//
// Source is ESPN's public site API. The official cdn.nba.com liveData feed
// carries the same data (and is what the swar/nba_api Python package wraps),
// but it is served behind Akamai and answers 403 to requests from here, so
// this uses the endpoint that actually responds.

const API = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';

const TTL = {
  scoreboard: 60_000,
  game: 8_000,
};

const cache = new Map(); // key -> { at, value }

async function cached(key, ttl, fn) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.value;
  const value = await fn();
  cache.set(key, { at: Date.now(), value });
  return value;
}

async function getJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'basketball-companion/1.0', Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`ESPN ${res.status} for ${url}`);
  return res.json();
}

const ms = (iso) => (iso ? Date.parse(iso) : null);

// "11:24" -> 684, "0.7" -> 1. Used for ordering within a period and for
// matching the clock a viewer reads off their screen.
function clockToSeconds(display) {
  if (!display) return null;
  const s = String(display).trim();
  if (s.includes(':')) {
    const [m, sec] = s.split(':');
    return Number(m) * 60 + Number(sec);
  }
  return Math.ceil(Number(s));
}

const recordOf = (competitor) =>
  (competitor.records || competitor.record || []).find((r) => r.type === 'total')?.summary || null;

function teamOf(competitor) {
  const t = competitor.team || {};
  return {
    id: t.id,
    abbr: t.abbreviation,
    name: t.displayName,
    short: t.shortDisplayName || t.name,
    score: competitor.score != null ? Number(competitor.score) : 0,
    record: recordOf(competitor),
  };
}

// ---------- scoreboard ----------

export function getScoreboard(date) {
  const key = date || 'today';
  return cached(`nba:sb:${key}`, TTL.scoreboard, async () => {
    const url = date ? `${API}/scoreboard?dates=${date.replace(/-/g, '')}` : `${API}/scoreboard`;
    const d = await getJson(url);
    const games = (d.events || []).map((e) => {
      const c = (e.competitions || [])[0] || {};
      const comps = c.competitors || [];
      const away = comps.find((x) => x.homeAway === 'away') || {};
      const home = comps.find((x) => x.homeAway === 'home') || {};
      const st = e.status || {};
      return {
        gameId: e.id,
        state: st.type?.state || 'pre', // pre | in | post
        statusText: st.type?.shortDetail || st.type?.description || '',
        startTime: e.date,
        period: st.period ?? null,
        clock: st.displayClock ?? null,
        away: teamOf(away),
        home: teamOf(home),
      };
    });
    return { date: d.day?.date || key, games };
  });
}

// ---------- one game ----------

// Plays arrive in order but roughly a quarter of them share a wallclock, since
// the feed stamps a whole cluster (a basket, the foul, the substitution) at one
// instant. sequenceNumber is NOT a reliable tiebreak within such a cluster —
// it put a 9:40 play before a 9:43 one in testing, which showed up as the score
// counting backwards on screen. The game clock settles it: inside a period it
// counts DOWN, so more seconds remaining means earlier.
function buildTimeline(plays) {
  return plays
    .filter((p) => p.wallclock)
    .map((p) => ({
      t: ms(p.wallclock),
      seq: Number(p.sequenceNumber) || 0,
      period: p.period?.number ?? null,
      periodText: p.period?.displayValue ?? null,
      clock: p.clock?.displayValue ?? null,
      clockSec: clockToSeconds(p.clock?.displayValue),
      awayScore: p.awayScore ?? 0,
      homeScore: p.homeScore ?? 0,
      text: p.text || p.shortDescription || '',
      typeText: p.type?.text || null,
      scoring: !!p.scoringPlay,
      shooting: !!p.shootingPlay,
      scoreValue: p.scoreValue ?? 0,
      teamId: p.team?.id ?? null,
      athleteIds: (p.participants || []).map((x) => x.athlete?.id).filter(Boolean),
    }))
    .sort(
      (a, b) =>
        a.t - b.t ||
        (a.period ?? 0) - (b.period ?? 0) ||
        (b.clockSec ?? 0) - (a.clockSec ?? 0) ||
        a.seq - b.seq
    );
}

// The boxscore doubles as the player directory — unlike the MLB feed there's no
// separate people endpoint to hydrate, so every name, headshot and stat line
// the page needs is already here.
function buildPlayers(boxscore) {
  const players = {};
  for (const teamBlock of boxscore?.players || []) {
    const teamId = teamBlock.team?.id;
    for (const group of teamBlock.statistics || []) {
      const labels = group.labels || [];
      for (const row of group.athletes || []) {
        const a = row.athlete || {};
        if (!a.id) continue;
        const stats = {};
        labels.forEach((label, i) => {
          if (row.stats && row.stats[i] !== undefined) stats[label] = row.stats[i];
        });
        players[a.id] = {
          id: a.id,
          name: a.displayName,
          short: a.shortName,
          jersey: a.jersey ?? null,
          position: a.position?.abbreviation ?? null,
          headshot: a.headshot?.href || `https://a.espncdn.com/i/headshots/nba/players/full/${a.id}.png`,
          teamId,
          starter: !!row.starter,
          didNotPlay: !!row.didNotPlay,
          stats,
        };
      }
    }
  }
  return players;
}

function slimGame(d, gameId) {
  const header = d.header || {};
  const comp = (header.competitions || [])[0] || {};
  const comps = comp.competitors || [];
  const away = comps.find((x) => x.homeAway === 'away') || {};
  const home = comps.find((x) => x.homeAway === 'home') || {};
  const status = comp.status?.type || {};
  const venue = d.gameInfo?.venue || {};

  return {
    gameId,
    fetchedAt: Date.now(),
    state: status.state || 'pre', // pre | in | post
    statusText: status.shortDetail || status.description || '',
    startTime: comp.date || header.timeValid || null,
    venue: venue.fullName || null,
    venueCity: [venue.address?.city, venue.address?.state].filter(Boolean).join(', ') || null,
    teams: { away: teamOf(away), home: teamOf(home) },
    // live period/clock — used only when the viewer has no offset set
    live: {
      period: comp.status?.period ?? null,
      clock: comp.status?.displayClock ?? null,
    },
    leaders: (d.leaders || []).flatMap((t) =>
      (t.leaders || []).map((l) => ({
        category: l.displayName,
        teamId: t.team?.id,
        athleteId: l.leaders?.[0]?.athlete?.id ?? null,
        name: l.leaders?.[0]?.athlete?.displayName ?? null,
        value: l.leaders?.[0]?.displayValue ?? null,
      }))
    ),
    players: buildPlayers(d.boxscore),
    timeline: buildTimeline(d.plays || []),
  };
}

export function getGame(gameId) {
  return cached(`nba:game:${gameId}`, TTL.game, async () => {
    const d = await getJson(`${API}/summary?event=${encodeURIComponent(gameId)}`);
    return slimGame(d, gameId);
  });
}
