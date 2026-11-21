// mlb.js — MLB Stats API client: fetches, caches, and slims game data.
//
// The public feed is large (~400 KB/game) and we poll it, so everything goes
// through a short TTL cache here and reaches the browser as a compact
// projection. The projection's core is a *timeline*: every pitch and every
// completed play stamped with its real UTC time, which is what lets the client
// reconstruct the game as it looked N seconds ago (see public/watch.js).

const API = 'https://statsapi.mlb.com/api';

const TTL = {
  schedule: 60_000,
  game: 8_000,
  player: 6 * 60 * 60_000,
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
    headers: { 'User-Agent': 'baseball-companion/1.0', Accept: 'application/json' },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`MLB API ${res.status} for ${url}`);
  return res.json();
}

const ms = (iso) => (iso ? Date.parse(iso) : null);

// ---------- schedule ----------

export function getSchedule(date) {
  const day = date || new Date().toISOString().slice(0, 10);
  return cached(`sched:${day}`, TTL.schedule, async () => {
    const d = await getJson(`${API}/v1/schedule?sportId=1&date=${day}&hydrate=team,linescore`);
    const games = (d.dates?.[0]?.games || []).map((g) => ({
      gamePk: g.gamePk,
      state: g.status?.abstractGameState, // Preview | Live | Final
      detailedState: g.status?.detailedState,
      startTime: g.gameDate,
      venue: g.venue?.name,
      away: {
        id: g.teams?.away?.team?.id,
        name: g.teams?.away?.team?.name,
        score: g.teams?.away?.score ?? null,
        record: g.teams?.away?.leagueRecord,
      },
      home: {
        id: g.teams?.home?.team?.id,
        name: g.teams?.home?.team?.name,
        score: g.teams?.home?.score ?? null,
        record: g.teams?.home?.leagueRecord,
      },
      inning: g.linescore?.currentInning ?? null,
      isTopInning: g.linescore?.isTopInning ?? null,
    }));
    return { date: day, games };
  });
}

// ---------- game state + timeline ----------

// Flattens the feed into time-stamped moments. Each moment carries the full
// visible game state at that instant, so "what did the game look like at T?"
// is a binary search rather than a replay of everything before it.
function buildTimeline(feed) {
  const plays = feed.liveData?.plays?.allPlays || [];
  const moments = [];
  let away = 0;
  let home = 0; // running score *entering* each play
  // matchup.postOnFirst/Second/Third describe the bases *after* a play resolves,
  // so the runners standing there during an at-bat are the previous play's
  // post-state. (Steals mid-at-bat are the one case this lags, until the next
  // play lands.)
  let bases = { first: false, second: false, third: false };

  for (const play of plays) {
    const about = play.about || {};
    const matchup = play.matchup || {};
    const basesDuring = { ...bases };
    const base = {
      inning: about.inning,
      half: about.isTopInning ? 'top' : 'bottom',
      batterId: matchup.batter?.id ?? null,
      batterName: matchup.batter?.fullName ?? null,
      pitcherId: matchup.pitcher?.id ?? null,
      pitcherName: matchup.pitcher?.fullName ?? null,
      batSide: matchup.batSide?.code ?? null,
      pitchHand: matchup.pitchHand?.code ?? null,
    };

    for (const ev of play.playEvents || []) {
      if (!ev.isPitch || !ev.startTime) continue;
      const pd = ev.pitchData || {};
      const count = ev.count || {};
      moments.push({
        t: ms(ev.startTime),
        kind: 'pitch',
        ...base,
        balls: count.balls ?? 0,
        strikes: count.strikes ?? 0,
        outs: count.outs ?? 0,
        awayScore: away,
        homeScore: home,
        bases: basesDuring,
        speed: pd.startSpeed != null ? Math.round(pd.startSpeed * 10) / 10 : null,
        pitchType: ev.details?.type?.description ?? null,
        pitchCode: ev.details?.type?.code ?? null,
        call: ev.details?.description ?? null, // "Called Strike", "Foul", "Ball"…
        inPlay: !!ev.details?.isInPlay,
        // strike-zone plate coordinates, handy for a future zone plot
        px: pd.coordinates?.pX ?? null,
        pz: pd.coordinates?.pZ ?? null,
        szTop: pd.strikeZoneTop ?? null,
        szBot: pd.strikeZoneBottom ?? null,
      });
    }

    const result = play.result || {};
    if (about.isComplete && about.endTime) {
      away = result.awayScore ?? away;
      home = result.homeScore ?? home;
      bases = {
        first: !!matchup.postOnFirst,
        second: !!matchup.postOnSecond,
        third: !!matchup.postOnThird,
      };
      moments.push({
        t: ms(about.endTime),
        kind: 'play',
        ...base,
        balls: 0,
        strikes: 0,
        outs: (play.count?.outs ?? 0),
        awayScore: away,
        homeScore: home,
        bases: { ...bases },
        event: result.event ?? null,
        eventType: result.eventType ?? null,
        // "atBat" for a real plate-appearance outcome; substitutions, mound
        // visits and steals carry a batter too, so this is what separates them.
        resultType: result.type ?? null,
        desc: result.description ?? null,
        rbi: result.rbi ?? 0,
        isScoringPlay: !!about.isScoringPlay,
        captivating: about.captivatingIndex ?? 0,
      });
    }
  }

  moments.sort((a, b) => a.t - b.t);
  return moments;
}

function slimGame(feed) {
  const gd = feed.gameData || {};
  const ld = feed.liveData || {};
  const ls = ld.linescore || {};
  const teamOf = (side) => ({
    id: gd.teams?.[side]?.id,
    name: gd.teams?.[side]?.name,
    abbr: gd.teams?.[side]?.abbreviation,
    record: gd.teams?.[side]?.record?.leagueRecord,
  });

  return {
    gamePk: feed.gamePk,
    fetchedAt: Date.now(),
    status: gd.status?.abstractGameState,
    detailedState: gd.status?.detailedState,
    startTime: gd.datetime?.dateTime,
    venue: gd.venue?.name,
    weather: gd.weather || null,
    teams: { away: teamOf('away'), home: teamOf('home') },
    // "live" = the true current state, used only when the viewer has no offset
    live: {
      inning: ls.currentInning ?? null,
      half: ls.isTopInning ? 'top' : 'bottom',
      balls: ls.balls ?? 0,
      strikes: ls.strikes ?? 0,
      outs: ls.outs ?? 0,
      awayScore: ls.teams?.away?.runs ?? 0,
      homeScore: ls.teams?.home?.runs ?? 0,
    },
    probablePitchers: {
      away: gd.probablePitchers?.away?.fullName ?? null,
      home: gd.probablePitchers?.home?.fullName ?? null,
    },
    timeline: buildTimeline(feed),
  };
}

export function getGame(gamePk) {
  return cached(`game:${gamePk}`, TTL.game, async () => {
    const feed = await getJson(`${API}/v1.1/game/${gamePk}/feed/live`);
    return slimGame(feed);
  });
}

// ---------- players ----------

export function getPlayer(personId) {
  return cached(`player:${personId}`, TTL.player, async () => {
    const hydrate = 'stats(group=[hitting,pitching],type=[season])';
    const d = await getJson(`${API}/v1/people/${personId}?hydrate=${encodeURIComponent(hydrate)}`);
    const p = d.people?.[0];
    if (!p) throw new Error(`no player ${personId}`);

    const statsBy = {};
    for (const s of p.stats || []) {
      const group = s.group?.displayName;
      const stat = s.splits?.[0]?.stat;
      if (group && stat) statsBy[group] = stat;
    }

    return {
      id: p.id,
      name: p.fullName,
      number: p.primaryNumber ?? null,
      position: p.primaryPosition?.abbreviation ?? null,
      positionName: p.primaryPosition?.name ?? null,
      bats: p.batSide?.code ?? null,
      throws: p.pitchHand?.code ?? null,
      age: p.currentAge ?? null,
      height: p.height ?? null,
      weight: p.weight ?? null,
      birthDate: p.birthDate ?? null,
      birthPlace: [p.birthCity, p.birthStateProvince || p.birthCountry].filter(Boolean).join(', '),
      debut: p.mlbDebutDate ?? null,
      pronunciation: p.pronunciation ?? null,
      headshot: `https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_213,q_auto:best/v1/people/${p.id}/headshot/67/current`,
      hitting: statsBy.hitting || null,
      pitching: statsBy.pitching || null,
    };
  });
}
