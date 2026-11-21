'use strict';
// hoops-factoids.js — the teaching layer for basketball.
//
// Same shape as factoids.js on the baseball side: a situation goes in,
// relevant explainer cards come out, ordered by how specific they are, with
// general ones rotating so a quiet stretch keeps moving.
//
// Play explainers match on KEYWORDS, not exact strings: the feed uses 54
// distinct type labels for what are really a dozen kinds of event
// ("Pullup Jump Shot", "Turnaround Jump Shot", "Step Back Jump Shot"…).

const Hoops = (() => {
  // ---------- what just happened on the floor ----------
  // First match wins, so the specific tests sit above the general ones.
  const PLAYS = [
    {
      test: (t, c) => /free throw/i.test(t),
      title: 'Free throw',
      body: 'An unguarded shot from 15 feet, worth one point, awarded after certain fouls. Nobody defends it — which is why a poor free-throw shooter becomes a liability late in a close game, when the other team will foul deliberately to put him on the line.',
    },
    {
      test: (t, c) => c.scoreValue === 3,
      title: 'Three-pointer',
      body: 'Anything beyond the arc counts three instead of two — 23 feet 9 inches out, shortening to 22 in the corners. That extra point is why teams now shoot so many of them: a 35% three-point shooter outscores a 50% two-point shooter over the same attempts.',
    },
    {
      test: (t) => /dunk/i.test(t),
      title: 'Dunk',
      body: 'The highest-percentage shot in basketball — the ball goes in from directly above the rim, so there is almost nothing to miss. Everything an offense does, from spacing to the pick and roll, is partly about manufacturing one of these.',
    },
    {
      test: (t) => /layup|floating/i.test(t),
      title: 'Layup',
      body: 'A close-range shot banked or laid softly off the glass while moving. Simple in isolation, hard in traffic: the defense collapses toward the rim, so finishing through contact is its own skill.',
    },
    {
      test: (t) => /putback/i.test(t),
      title: 'Putback',
      body: 'A miss grabbed and immediately scored by the offense. It is the payoff for crashing the offensive glass, and it is demoralising for a defense that already did its job once.',
    },
    {
      test: (t) => /offensive rebound/i.test(t),
      title: 'Offensive rebound',
      body: 'The shooting team recovers its own miss and keeps possession — effectively a free extra try. Teams trade off chasing these against getting back on defense, because everyone crashing the glass means nobody is home if it goes the other way.',
    },
    {
      test: (t) => /defensive rebound/i.test(t),
      title: 'Defensive rebound',
      body: 'The defense secures the miss and the possession changes hands. It is the quiet half of good defense: a stop is not a stop until someone actually grabs the ball.',
    },
    {
      test: (t) => /block/i.test(t),
      title: 'Block',
      body: 'The shot is deflected on its way up. Timing matters more than height — touch it on the way down, or while it is in the cylinder, and it is goaltending, which simply awards the basket.',
    },
    {
      test: (t) => /steal/i.test(t),
      title: 'Steal',
      body: 'The defense takes the ball cleanly and usually goes the other way at once. Steals are the most valuable turnover because they tend to come with the defense out of position.',
    },
    {
      test: (t) => /bad pass|lost ball|out of bounds/i.test(t),
      title: 'Turnover',
      body: 'Possession given away without a shot — the worst outcome of a trip, because it scores nothing and often hands the other team an easy one going back. Teams average roughly one per eight possessions.',
    },
    {
      test: (t) => /shooting foul/i.test(t),
      title: 'Shooting foul',
      body: 'Contact on a player in the act of shooting. He gets free throws — two, or three from beyond the arc, or one plus the basket if the shot still went in.',
    },
    {
      test: (t) => /offensive foul/i.test(t),
      title: 'Offensive foul',
      body: 'The player with the ball commits the contact, usually charging into a defender who got there first. It costs the possession as well as the foul, which is why drawing one is a prized defensive play.',
    },
    {
      test: (t) => /loose ball foul/i.test(t),
      title: 'Loose ball foul',
      body: 'Contact while nobody has possession, almost always wrestling for a rebound. It counts toward the team total that eventually puts the other side in the bonus.',
    },
    {
      test: (t) => /foul/i.test(t),
      title: 'Personal foul',
      body: 'Illegal contact. Six of them and a player is disqualified for the night, so a star picking up early fouls changes how his coach can use him for the rest of the game.',
    },
    {
      test: (t) => /timeout/i.test(t),
      title: 'Timeout',
      body: 'Play stops so a coach can set up a play or break the other team\'s momentum. Each side gets seven per game, with limits on how many carry into the last minutes.',
    },
    {
      test: (t) => /substitution/i.test(t),
      title: 'Substitution',
      body: 'Players rotate constantly — unlike most sports, there is no limit. Coaches stagger their stars\' rest so at least one is on the floor nearly the whole game.',
    },
    {
      test: (t) => /jump ?ball/i.test(t),
      title: 'Jump ball',
      body: 'The referee tosses the ball up between two players. It starts the game, and settles possession when two opponents have equal claim to a held ball.',
    },
    {
      test: (t) => /end period|end of/i.test(t),
      title: 'End of the quarter',
      body: 'Games are four 12-minute quarters. Teams switch baskets at half-time, and any tie after the fourth goes to a five-minute overtime, repeated until somebody leads at the buzzer.',
    },
    {
      test: (t) => /jump shot|jumper/i.test(t),
      title: 'Jump shot',
      body: 'The standard shot: rise, square to the rim, release at the top. Variants in the play-by-play — pullup, step back, turnaround, fadeaway — all describe how the shooter created the sliver of space to get it off.',
    },
  ];

  function playInfo(typeText, ctx = {}) {
    const t = typeText || '';
    return PLAYS.find((p) => p.test(t, ctx)) || null;
  }

  // ---------- stat glossary ----------
  const GLOSSARY = {
    PTS: 'Points scored. Two for a normal field goal, three from beyond the arc, one per free throw.',
    REB: 'Rebounds — missed shots recovered, at either end. Split into offensive (your own team\'s miss) and defensive.',
    AST: 'Assists — passes that lead directly to a teammate scoring. A measure of creating, not finishing.',
    STL: 'Steals — possessions taken cleanly from the other team.',
    BLK: 'Blocks — opponents\' shots deflected on the way up.',
    TO: 'Turnovers — possessions given away without a shot.',
    PF: 'Personal fouls. Six disqualifies a player for the game.',
    MIN: 'Minutes played. Starters usually land between 30 and 36 of the 48.',
    FG: 'Field goals: shots made and attempted, excluding free throws.',
    '3PT': 'Three-pointers made and attempted. Around 35% is a respectable rate.',
    FT: 'Free throws made and attempted. Good shooters live near 85%.',
    'ePM': 'Plus/minus — the team\'s net points while this player was on the floor. Useful but noisy over one game.',
    '+/-': 'Plus/minus — the team\'s net points while this player was on the floor. Useful in bulk, noisy in a single game.',
  };

  // ---------- situational rules ----------
  const AMBIENT_MAX_WEIGHT = 40;

  const RULES = [
    // ----- game state -----
    {
      id: 'overtime',
      tag: 'Rules',
      weight: 95,
      when: (c) => c.period > 4,
      title: 'Overtime',
      body: 'A tie after four quarters goes to a five-minute extra period, as many times as it takes. Fouls carry over, so players already in trouble have very little room.',
    },
    {
      id: 'crunch',
      tag: 'Situation',
      weight: 90,
      when: (c) => c.period >= 4 && c.clockSec != null && c.clockSec <= 180 && Math.abs(c.margin) <= 6,
      title: 'Crunch time',
      body: 'Inside three minutes and within one possession or two. Expect the pace to collapse: teams milk the shot clock, hunt a specific mismatch, and the trailing side starts fouling on purpose to stop the clock and get the ball back.',
    },
    {
      id: 'close-4th',
      tag: 'Situation',
      weight: 72,
      when: (c) => c.period >= 4 && Math.abs(c.margin) <= 8,
      title: 'A one-possession game',
      body: 'Close in the fourth, so rotations shorten — the best five stay on the floor, and nearly every trip goes to the team\'s first option.',
    },
    {
      id: 'blowout',
      tag: 'Situation',
      weight: 68,
      when: (c) => Math.abs(c.margin) >= 22 && c.period >= 3,
      title: (c) => `Up ${Math.abs(c.margin)} — this one is getting away`,
      body: 'A margin this size late usually ends with both benches emptied: the starters sit, and the last minutes are played by the end of each roster.',
    },
    {
      // The gap between "close game" and "blowout" is where most fourth
      // quarters actually live, and it has its own shape worth explaining.
      id: 'two-score',
      tag: 'Situation',
      weight: 66,
      when: (c) => c.period >= 4 && Math.abs(c.margin) >= 9 && Math.abs(c.margin) < 22,
      title: (c) => `A ${Math.abs(c.margin)}-point lead in the fourth`,
      body: 'Uncomfortable for both sides: too big to erase with one possession, too small to rest anybody. The trailing team starts hunting threes and pressing up on defense, because they need points in bunches rather than one trip at a time.',
    },
    {
      id: 'run',
      tag: 'Situation',
      weight: 80,
      when: (c) => Math.abs(c.run || 0) >= 7,
      title: (c) => `On a ${Math.abs(c.run)}-point run`,
      body: 'Basketball swings in bursts, because every score hands the ball straight back. A run like this is usually what forces the other coach to spend a timeout and reset.',
    },
    {
      // close-4th only covers the last quarter, but a game this tight earlier
      // on is just as worth remarking on.
      id: 'tight-early',
      tag: 'Situation',
      weight: 64,
      when: (c) => c.period >= 2 && c.period <= 3 && Math.abs(c.margin) <= 5,
      title: 'Nip and tuck',
      body: 'Neither side has been able to build a cushion. Watch which coach blinks first and goes to his bench early — a lead built while the other team rests its stars is the usual way these break open.',
    },
    {
      id: 'first-quarter',
      tag: 'Basics',
      weight: 34,
      when: (c) => c.period === 1,
      title: 'How the game is shaped',
      body: 'Four quarters of twelve minutes, a running clock that stops on whistles, and unlimited substitutions. The first quarter is mostly both coaches finding out which matchups work.',
    },
    {
      id: 'halftime-ish',
      tag: 'Basics',
      weight: 36,
      when: (c) => c.period === 3,
      title: 'The third quarter',
      body: 'Teams come out of the locker room with adjustments, and the third is where games are most often decided — a team that loses it by double figures rarely recovers.',
    },

    // ----- offense -----
    {
      id: 'pick-and-roll',
      tag: 'Offense',
      weight: 30,
      when: () => true,
      title: 'The pick and roll',
      body: 'One player screens the ball-handler\'s defender, then rolls to the basket. It forces two defenders to make a decision about two attackers, and whatever they choose leaves something open. Most NBA possessions start with one.',
    },
    {
      id: 'spacing',
      tag: 'Offense',
      weight: 29,
      when: () => true,
      title: 'Why everyone stands so far apart',
      body: 'Shooters spread to the arc to drag their defenders with them, which empties the middle for drives. Spacing is why the modern game looks so different from the crowded paint of thirty years ago.',
    },
    {
      id: 'isolation',
      tag: 'Offense',
      weight: 27,
      when: () => true,
      title: 'Isolation',
      body: 'Four players clear out and let one go to work one-on-one. Inefficient on average, but it is what teams fall back on late, when the defense has had time to set and nothing else is open.',
    },
    {
      id: 'transition',
      tag: 'Offense',
      weight: 28,
      when: () => true,
      title: 'Transition',
      body: 'The few seconds after a rebound or steal, before the defense is set, are the most productive in the sport. It is why you see teams sprint the floor after a miss rather than walk it up.',
    },

    // ----- defense -----
    {
      id: 'man-vs-zone',
      tag: 'Defense',
      weight: 30,
      when: () => true,
      title: 'Man-to-man and zone',
      body: 'In man defense each player tracks an opponent; in a zone each guards an area. The NBA is overwhelmingly man, with zone used in short bursts to disrupt a rhythm.',
    },
    {
      id: 'switching',
      tag: 'Defense',
      weight: 29,
      when: () => true,
      title: 'Switching',
      body: 'When a screen comes, the two defenders simply trade assignments rather than fight through it. Clean and simple — but it can leave a guard on a much bigger player, which is exactly the mismatch the offense was hunting.',
    },
    {
      id: 'help',
      tag: 'Defense',
      weight: 28,
      when: () => true,
      title: 'Help defense',
      body: 'A second defender slides over to meet a driver, trusting a teammate to cover the man he left. Good offenses are built to punish it: the ball goes to whoever was abandoned.',
    },
    {
      id: 'boxing-out',
      tag: 'Defense',
      weight: 26,
      when: () => true,
      title: 'Boxing out',
      body: 'Putting your body between your man and the rim as the shot goes up. Most rebounds are won by position a second before the ball comes down, not by jumping highest.',
    },

    // ----- rules -----
    {
      id: 'shot-clock',
      tag: 'Rules',
      weight: 33,
      when: () => true,
      title: 'The 24-second shot clock',
      body: 'A team must attempt a shot that hits the rim within 24 seconds, or lose the ball. Introduced in 1954 after a game ended 19–18, it is the single rule that made basketball watchable.',
    },
    {
      id: 'bonus',
      tag: 'Rules',
      weight: 32,
      when: () => true,
      title: 'The bonus',
      body: 'After a team commits five fouls in a quarter, every further foul — even away from the ball — sends the other side to the free-throw line. It quietly changes how aggressively a defense can play late in a period.',
    },
    {
      id: 'three-seconds',
      tag: 'Rules',
      weight: 25,
      when: () => true,
      title: 'Three in the paint',
      body: 'An offensive player cannot stand in the painted area for more than three seconds. Without it, the biggest player would simply camp under the rim all night.',
    },
    {
      id: 'goaltending',
      tag: 'Rules',
      weight: 24,
      when: () => true,
      title: 'Goaltending',
      body: 'Touch the ball on its way down toward the rim, or while it sits on the rim, and the basket counts automatically. It is why shot-blockers must meet the ball early.',
    },
    {
      id: 'backcourt',
      tag: 'Rules',
      weight: 22,
      when: () => true,
      title: 'Eight seconds and the backcourt',
      body: 'The offense has eight seconds to cross half-court, and once over it cannot pass back. That line is a trap defenses use deliberately when pressing.',
    },
  ];

  // ---------- team lore ----------
  const CELTICS_ID = '2';

  const CELTICS = [
    { title: 'The most championships in the league', body: 'Boston has won 18 titles, more than any other franchise. The banners hang from the rafters rather than being printed on anything — the club\'s long-standing habit of understatement about its own history.' },
    { title: 'Bill Russell won eleven', body: 'Eleven championships in thirteen seasons, including eight in a row. No athlete in any major American sport has matched it, and almost certainly nobody will.' },
    { title: 'The parquet floor', body: 'The famous pattern dates to 1946, pieced together from short scraps of oak because long boards were scarce after the war. Players swore it had dead spots only the home team knew.' },
    { title: 'Celtics and Lakers', body: 'They have met in the Finals twelve times — the defining rivalry of the sport, and the one that carried the NBA into the mainstream during the Bird and Magic years of the 1980s.' },
    { title: "Red Auerbach's cigar", body: 'The coach lit a victory cigar on the bench once he judged a game won. Opponents found it insufferable, which was entirely the point.' },
    { title: 'Larry Bird', body: 'A famously slow-footed forward who beat people with passing, shooting and an unkind running commentary. He would reportedly tell defenders where he intended to shoot from, then do it.' },
    { title: 'The 2008 Big Three', body: 'Garnett, Pierce and Allen were assembled in one summer and won the title in their first season together — the template nearly every contender has copied since.' },
    { title: 'Banner 18', body: 'The 2024 championship broke a tie and put Boston alone at the top of the all-time list, seventeen years after the previous one.' },
  ];

  const GENERAL = [
    { title: 'A game invented indoors', body: 'James Naismith nailed two peach baskets to a gymnasium balcony in 1891 to keep students busy through a New England winter. Someone had to fetch the ball down after every score.' },
    { title: 'The rule that saved the sport', body: 'Before 1954 a leading team could simply hold the ball. One game finished 19–18. The 24-second clock was introduced the next season and scoring nearly doubled.' },
    { title: 'A hundred points in one night', body: 'Wilt Chamberlain scored 100 in a single game in 1962. There is no video of it — the game was played in Hershey, Pennsylvania, and nobody filmed it.' },
    { title: 'The three-pointer is newer than you think', body: 'The NBA only adopted the arc in 1979, and for years it was treated as a gimmick. Teams now take more threes than two-point jumpers.' },
    { title: 'Ten feet, everywhere', body: 'The rim has been exactly ten feet off the floor since 1891, on every court in the world. The players got bigger; the basket never moved.' },
    { title: 'The triple-double', body: 'Double figures in three categories in one game — usually points, rebounds and assists. It is an arbitrary milestone that stuck because it is easy to notice.' },
    { title: 'Why the court looks the way it does', body: 'Ninety-four feet by fifty, with a painted lane that was widened twice specifically to push dominant big men further from the basket.' },
    { title: 'Fouling on purpose', body: 'Trailing late, teams foul deliberately: it stops the clock and gets the ball back at the cost of two free throws. The whole tactic is a bet on the other team missing.' },
  ];

  function teamFacts(teamIds = [], rotation = 0) {
    const isCeltics = teamIds.map(String).includes(CELTICS_ID);
    const pool = isCeltics ? CELTICS : GENERAL;
    const card = pool[Math.abs(rotation) % pool.length];
    return { ...card, tag: isCeltics ? 'Celtics' : 'Basketball lore', isHome: isCeltics };
  }

  // ---------- player notes ----------
  function playerNotes(p) {
    if (!p || !p.stats) return [];
    const s = p.stats;
    const n = (v) => {
      const x = parseFloat(v);
      return Number.isFinite(x) ? x : null;
    };
    const notes = [];

    const pts = n(s.PTS);
    const reb = n(s.REB);
    const ast = n(s.AST);
    const min = n(s.MIN);
    const to = n(s.TO);

    if (pts != null) {
      const line = [
        pts != null ? `${pts} points` : null,
        reb != null ? `${reb} rebounds` : null,
        ast != null ? `${ast} assists` : null,
      ]
        .filter(Boolean)
        .join(', ');
      notes.push(`${line} so far${min != null ? ` in ${min} minutes` : ''}.`);
    }

    if (pts >= 10 && reb >= 10 && ast >= 10) {
      notes.push('That is a triple-double — double figures in three categories, and a genuinely rare night.');
    } else if ([pts, reb, ast].filter((v) => v != null && v >= 10).length === 2) {
      notes.push('Double figures in two categories — a double-double, the workmanlike version of a big game.');
    }

    if (s.FG) {
      const [made, att] = String(s.FG).split('-').map(Number);
      if (att > 0) {
        const pct = Math.round((made / att) * 100);
        notes.push(
          `${made} of ${att} from the field, ${pct}%. Around 46% is league average, and anything over 55% usually means he is getting shots close to the rim.`
        );
      }
    }
    if (s['3PT']) {
      const [made, att] = String(s['3PT']).split('-').map(Number);
      if (att >= 3) {
        notes.push(`${made} of ${att} from three. Roughly 35% is the line between a shooter teams respect and one they leave open.`);
      }
    }
    if (ast != null && to != null && ast >= 4) {
      notes.push(`${ast} assists against ${to} turnovers. Creating more than you give away is the basic test for a primary ball-handler.`);
    }
    if (s['+/-']) {
      notes.push(`His plus/minus is ${s['+/-']} — the team's net points while he has been on the floor. Telling over a season, noisy in one game.`);
    }

    return notes;
  }

  // ---------- selection ----------
  function pick(ctx, { limit = 2, recent = [], rotation = 0 } = {}) {
    const c = { period: 1, clockSec: null, margin: 0, run: 0, typeText: '', scoreValue: 0, ...ctx };

    const matches = RULES.filter((r) => {
      try {
        return r.when(c);
      } catch {
        return false;
      }
    });

    const byWeight = (a, b) => b.weight - a.weight;
    const situational = matches.filter((r) => r.weight >= AMBIENT_MAX_WEIGHT).sort(byWeight);
    const ambient = matches.filter((r) => r.weight < AMBIENT_MAX_WEIGHT).sort(byWeight);

    const out = situational
      .sort((a, b) => {
        const ra = recent.indexOf(a.id);
        const rb = recent.indexOf(b.id);
        if ((ra === -1) !== (rb === -1)) return ra === -1 ? -1 : 1;
        return b.weight - a.weight;
      })
      .slice(0, limit);

    for (let k = 0; out.length < limit && ambient.length && k < ambient.length; k++) {
      const card = ambient[(rotation + k) % ambient.length];
      if (!out.includes(card)) out.push(card);
    }

    const resolve = (v) => (typeof v === 'function' ? v(c) : v);
    return out
      .map((r) => ({ id: r.id, tag: r.tag, title: resolve(r.title), body: resolve(r.body) }))
      .filter((r) => r.body);
  }

  return { pick, playInfo, playerNotes, teamFacts, GLOSSARY, CELTICS_ID };
})();

window.Hoops = Hoops;
