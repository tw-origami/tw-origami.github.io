'use strict';
// factoids.js — the teaching layer.
//
// A situation (count, bases, outs, pitch type, what just happened) comes in;
// relevant explainer cards come out. Rules are ordered by how specific they are,
// so "bases loaded, full count" beats a generic "what is a strike zone" card,
// and anything shown recently is suppressed so the panel keeps moving.

const Factoids = (() => {
  // ---------- reference: pitch types ----------
  const PITCHES = {
    'Four-Seam Fastball': {
      short: 'The straight one, thrown hardest.',
      body: 'Held across the seams and thrown with backspin. It travels the straightest of any pitch, and the backspin makes it drop less than gravity says it should — which is why hitters describe a good one as "rising". Typically 92–100 mph.',
    },
    Sinker: {
      short: 'A fastball that dives and runs.',
      body: 'Thrown nearly as hard as a four-seamer but with sidespin, so it tails toward the pitcher\'s arm side and drops late. Sinkers are ground-ball pitches — the goal is weak contact on top of the ball, not a strikeout.',
    },
    Cutter: {
      short: 'A fastball with a last-second nudge.',
      body: 'Breaks a few inches toward the pitcher\'s glove side right at the plate. Too late for the hitter to adjust, so it misses the bat\'s sweet spot and produces broken bats and jammed swings.',
    },
    Slider: {
      short: 'Breaks sideways and down, hard.',
      body: 'Roughly 5–10 mph slower than the fastball with sharp late break away from a same-handed hitter. The classic two-strike put-away pitch: it starts looking like a strike and finishes off the plate.',
    },
    Sweeper: {
      short: 'A slider with an enormous sideways break.',
      body: 'A recent trend — a slider tuned for horizontal movement, sometimes well over a foot of sweep. Brutal on same-handed hitters, more hittable for opposite-handed ones.',
    },
    Curveball: {
      short: 'Big slow loop, top to bottom.',
      body: 'Thrown with topspin so it drops sharply, often 12–20 mph slower than the fastball. Used to steal an early strike or to freeze a hitter geared up for velocity.',
    },
    'Knuckle Curve': {
      short: 'A curveball with a knuckle grip.',
      body: 'A knuckle-style grip adds spin and sharpens the downward break compared with a standard curve. It behaves like a curveball, not a knuckleball.',
    },
    Changeup: {
      short: 'Looks like a fastball, arrives late.',
      body: 'The whole trick is deception: identical arm speed and release to the fastball, but 8–12 mph slower. The hitter commits early and swings before the ball gets there. Most effective against opposite-handed hitters.',
    },
    Splitter: {
      short: 'Falls off the table at the last moment.',
      body: 'Held split between two fingers, which kills spin so the bottom drops out just as it reaches the plate. Generates swings over the top of the ball and lots of strikeouts.',
    },
    Slurve: {
      short: 'Halfway between a slider and a curve.',
      body: 'Sweeping sideways break like a slider with more downward drop like a curveball.',
    },
    Knuckleball: {
      short: 'No spin, no idea where it goes.',
      body: 'Thrown with almost no rotation so air turbulence pushes it unpredictably. Slow (65–75 mph) and nearly as hard to catch as it is to hit — teams often assign a personal catcher.',
    },
    Forkball: { short: 'A slower, deeper-gripped splitter.', body: 'Jammed further between the fingers than a splitter, producing a slower pitch with a big late tumble.' },
    'Eephus': { short: 'A joke pitch that sometimes works.', body: 'A high lobbed arc around 50–60 mph, used purely to disrupt timing after a diet of mid-90s heat.' },
  };

  // ---------- reference: stat glossary ----------
  const GLOSSARY = {
    AVG: 'Batting average — hits divided by at-bats. .300 is excellent, .250 is roughly average, .200 is the "Mendoza line" of struggle.',
    OBP: 'On-base percentage — how often a hitter reaches base by any means, walks included. It values patience that batting average ignores. .350 is very good.',
    SLG: 'Slugging percentage — total bases per at-bat, so extra-base hits count more. It measures power, not consistency.',
    OPS: 'On-base plus slugging (OBP + SLG) — one number combining getting on base with hitting for power. Around .700 is average, .900 is All-Star territory, 1.000+ is an MVP season.',
    ERA: 'Earned run average — runs the pitcher is responsible for, per nine innings. Under 3.00 is excellent; around 4.00 is league average.',
    WHIP: 'Walks and hits per inning pitched — how many baserunners a pitcher allows. Under 1.10 is excellent; 1.30 is about average.',
    RBI: 'Runs batted in — runners who scored because of this batter. It depends heavily on teammates getting on base ahead of them.',
    OPSPLUS: 'OPS+ — OPS adjusted for ballpark and era, scaled so 100 is exactly league average. 130 means 30% better than average.',
  };

  // ---------- what every count means ----------
  // The count drives nearly every decision in an at-bat, so rather than a few
  // generic "hitter's count" cards this explains the exact one on the board.
  const COUNTS = {
    '0-0': 'Even. Most pitchers want a first-pitch strike here — hitters do far worse once they fall behind, so that first pitch is quietly one of the most important of the at-bat.',
    '1-0': 'Slight edge to the hitter. Nothing decisive, but the pitcher now needs a strike and the hitter can afford to wait for one he likes.',
    '2-0': "A hitter's count. The pitcher almost has to throw a fastball in the zone, and the hitter knows it — this is where damage gets done.",
    '3-0': 'Maximum pressure on the pitcher. One more ball is a walk, so most hitters take the pitch automatically. A hitter given the "green light" here is being told a strike is nearly guaranteed.',
    '0-1': 'Small edge to the pitcher. He can now afford to waste a pitch off the plate to see if the hitter chases.',
    '1-1': 'The true swing count. What happens next decides whether this becomes a hitter\'s count or a pitcher\'s count, so both sides treat it as the at-bat\'s hinge.',
    '2-1': 'Advantage hitter. He can sit on one pitch in one zone and let anything else go by.',
    '3-1': 'One of the best counts a hitter ever gets. The pitcher must throw a strike or walk him, so the hitter can look for a specific pitch in a specific spot and swing hard — hitters slug better on 3-1 than almost any other count.',
    '0-2': 'The pitcher owns this at-bat. He can miss on purpose — low and away, or in the dirt — and dare the hitter to chase. Hitters bat under .200 from here, so they shorten up and just try to survive.',
    '1-2': 'Still firmly the pitcher\'s count. Expect a breaking ball starting in the zone and finishing outside it.',
    '2-2': 'Even, but tense: one strike ends it, one ball opens it up. The hitter has to protect the plate while the pitcher hunts for a chase.',
    '3-2': 'Full count — the next pitch ends the at-bat unless it is fouled off. Runners usually take off with the pitch, since a walk protects them anyway and a hit gets them an extra base.',
  };

  // ---------- situational rules ----------
  // weight: higher = more specific = shown first.
  // `body` may be a string or a function of the situation.
  const RULES = [
    {
      id: 'count-explain',
      tag: 'The count',
      weight: 65,
      when: (c) => COUNTS[`${c.balls}-${c.strikes}`] !== undefined,
      title: (c) => `${c.balls}-${c.strikes}: what it means`,
      body: (c) => COUNTS[`${c.balls}-${c.strikes}`],
    },

    // ----- bases and outs -----
    {
      id: 'bases-loaded',
      tag: 'Situation',
      weight: 95,
      when: (c) => c.bases.first && c.bases.second && c.bases.third,
      title: 'Bases loaded',
      body: 'Every base is occupied, so the defense can force a runner out at any base — including home. It also means the pitcher has nowhere to put the hitter: a walk hands over a run without a swing.',
    },
    {
      id: 'scoring-position',
      tag: 'Situation',
      weight: 70,
      when: (c) => (c.bases.second || c.bases.third) && !(c.bases.first && c.bases.second && c.bases.third),
      title: 'Runner in scoring position',
      body: 'A runner on second or third is said to be "in scoring position" because a single will usually score them. You will hear a hitter\'s batting average with runners in scoring position quoted constantly — it is treated as a measure of clutch.',
    },
    {
      id: 'dp-depth',
      tag: 'Situation',
      weight: 72,
      when: (c) => c.bases.first && !c.bases.second && c.outs < 2,
      title: 'Double-play situation',
      body: 'Runner on first with fewer than two outs: a ground ball can end the inning in one swing. The middle infielders shade toward second base to turn it, and the pitcher wants a ground ball rather than a strikeout.',
    },
    {
      id: 'two-outs',
      tag: 'Situation',
      weight: 40,
      when: (c) => c.outs === 2 && (c.bases.first || c.bases.second || c.bases.third),
      title: 'Two outs — runners are going',
      body: 'With two outs, runners sprint on contact instead of waiting to see if a fly ball is caught, because a caught ball ends the inning regardless. That extra jump turns singles into runs.',
    },
    {
      id: 'infield-fly',
      tag: 'Rules',
      weight: 76,
      when: (c) => c.bases.first && c.bases.second && c.outs < 2,
      title: 'Infield fly rule is in effect',
      body: 'With runners on first and second and fewer than two outs, an easy pop-up in the infield makes the batter automatically out — even if nobody catches it. Without this rule a fielder could drop it deliberately and turn an easy double play.',
    },

    // ----- game context -----
    {
      id: 'extras',
      tag: 'Rules',
      weight: 92,
      when: (c) => c.inning > 9,
      title: 'Extra innings: the runner on second',
      body: 'In the regular season each extra inning starts with a free runner on second base — the "ghost runner" — to push toward a quick finish. It does not apply in the postseason, where extra innings are played the old way.',
    },
    {
      id: 'save-situation',
      tag: 'Situation',
      weight: 74,
      when: (c) => c.inning >= 9 && Math.abs(c.awayScore - c.homeScore) <= 3 && Math.abs(c.awayScore - c.homeScore) > 0,
      title: 'Save situation',
      body: 'A team leading by three runs or fewer in the ninth typically brings in its closer — the best reliever, saved specifically for this moment. Finishing the game with the lead intact earns him a "save".',
    },
    {
      id: 'close-late',
      tag: 'Situation',
      weight: 50,
      when: (c) => c.inning >= 7 && Math.abs(c.awayScore - c.homeScore) <= 1,
      title: 'Close and late',
      body: 'From the seventh inning on in a one-run game, managers stop managing for today\'s box score: pinch hitters chosen for one matchup, relievers brought in to face a single batter, defensive replacements late.',
    },
    {
      id: 'first-inning',
      tag: 'Basics',
      weight: 30,
      when: (c) => c.inning === 1,
      title: 'How an inning works',
      body: 'Each inning has two halves. The away team always bats in the top half, the home team in the bottom — which is why the home team gets the last at-bat, and why they skip it entirely if they are already ahead.',
    },

    // ----- what just happened -----
    {
      id: 'ev-strikeout',
      tag: 'What just happened',
      weight: 88,
      when: (c) => c.eventType === 'strikeout',
      title: 'Strikeout',
      body: 'Three strikes and the batter is out. On a scorecard it is a K — and a backwards K if the hitter never swung at strike three, which is considered the more embarrassing way to go.',
    },
    {
      id: 'ev-walk',
      tag: 'What just happened',
      weight: 86,
      when: (c) => c.eventType === 'walk',
      title: 'Walk',
      body: 'Four pitches outside the strike zone and the batter is awarded first base. It costs the pitcher nothing on the scoreboard directly, but it is a free baserunner and it runs up his pitch count.',
    },
    {
      id: 'ev-ibb',
      tag: 'What just happened',
      weight: 90,
      when: (c) => c.eventType === 'intent_walk',
      title: 'Intentional walk',
      body: 'The defense deliberately puts this hitter on base — usually to face a weaker hitter next, or to set up a force play at every base. Since 2017 no pitches are thrown; the manager just signals it.',
    },
    {
      id: 'ev-hr',
      tag: 'What just happened',
      weight: 94,
      when: (c) => c.eventType === 'home_run',
      title: 'Home run',
      body: 'Over the fence in fair territory: the batter and every runner score. A home run with the bases loaded is a grand slam, worth four runs — the most any single swing can produce.',
    },
    {
      id: 'ev-dp',
      tag: 'What just happened',
      weight: 90,
      when: (c) => /double_play/.test(c.eventType || ''),
      title: 'Double play',
      body: 'Two outs on one batted ball, usually shortstop to second baseman to first. It is the fastest way out of trouble for a pitcher, which is why announcers call it a pitcher\'s best friend.',
    },
    {
      id: 'ev-sac',
      tag: 'What just happened',
      weight: 88,
      when: (c) => /sac_fly|sac_bunt/.test(c.eventType || ''),
      title: 'Sacrifice',
      body: 'The batter gives himself up to move a runner — a fly ball deep enough for the runner to tag and score, or a bunt to advance him. Because it is intentional, it does not count against the hitter\'s batting average.',
    },
    {
      id: 'ev-steal',
      tag: 'What just happened',
      weight: 86,
      when: (c) => /stolen_base/.test(c.eventType || ''),
      title: 'Stolen base',
      body: 'The runner takes off during the pitch and reaches the next base before the throw. Larger bases and limits on pickoff attempts have made steals far more common — and far more successful — since 2023.',
    },
    {
      id: 'ev-cs',
      tag: 'What just happened',
      weight: 86,
      when: (c) => /caught_stealing|pickoff/.test(c.eventType || ''),
      title: 'Caught stealing',
      body: 'The catcher\'s throw beat the runner. A catcher\'s "pop time" — glove to second base, usually under two seconds — is the number scouts care about here.',
    },
    {
      id: 'ev-hbp',
      tag: 'What just happened',
      weight: 88,
      when: (c) => c.eventType === 'hit_by_pitch',
      title: 'Hit by pitch',
      body: 'The batter is awarded first base. He is expected to attempt to avoid the ball, though umpires rarely enforce that — and hitters who crowd the plate tend to collect a lot of these.',
    },
    {
      id: 'ev-balk',
      tag: 'Rules',
      weight: 95,
      when: (c) => /balk/.test(c.eventType || ''),
      title: 'Balk',
      body: 'The pitcher made an illegal deceptive move with runners on base — flinching mid-motion, or faking a throw he never made. Every runner advances one base for free.',
    },
    {
      id: 'ev-mound-visit',
      tag: 'Rules',
      weight: 84,
      when: (c) => /mound_visit/.test(c.eventType || ''),
      title: 'Mound visit',
      body: 'A coach or catcher heads out to settle the pitcher down or change signs. Each team gets a strictly limited number per game, so they are spent carefully — and a manager visiting the same pitcher twice in one inning forces a pitching change.',
    },
    {
      id: 'ev-pitching-change',
      tag: 'Rules',
      weight: 84,
      when: (c) => /pitching_substitution/.test(c.eventType || ''),
      title: 'Pitching change',
      body: 'A new pitcher enters. He must face at least three batters, or finish the half-inning, before he can be replaced — a rule added in 2020 to stop the parade of one-batter relievers.',
    },
    {
      id: 'ev-error',
      tag: 'What just happened',
      weight: 84,
      when: (c) => /error/.test(c.eventType || ''),
      title: 'Error',
      body: 'The official scorer judged that a fielder should have made this play. Runs that score afterward become "unearned" and are removed from the pitcher\'s ERA, since they were not his fault.',
    },

    // ----- always-available basics -----
    {
      id: 'strike-zone',
      tag: 'Basics',
      weight: 22,
      when: () => true,
      title: 'What counts as a strike',
      body: 'The strike zone is a column over home plate running from the midpoint of the batter\'s chest down to just below the kneecap — so it changes size with every hitter, and is judged at the moment the ball crosses the plate.',
    },
    {
      id: 'three-outs',
      tag: 'Basics',
      weight: 20,
      when: () => true,
      title: 'Three outs and you switch',
      body: 'A half-inning ends after three outs, and any runners left on base are wiped out — they do not carry over. That is why stranding runners is such a recurring source of misery.',
    },
    {
      id: 'pitch-clock',
      tag: 'Rules',
      weight: 26,
      when: () => true,
      title: 'The pitch clock',
      body: 'Pitchers get 15 seconds to start their motion with the bases empty and 18 with runners on; the hitter must be set with 8 seconds left. Violations are an automatic ball or strike. It cut roughly half an hour off the average game when introduced in 2023.',
    },
    {
      id: 'positions',
      tag: 'Basics',
      weight: 18,
      when: () => true,
      title: 'The nine positions, by number',
      body: 'Scorekeeping numbers them 1–9: pitcher, catcher, first base, second base, third base, shortstop, then left, center and right field. A "6-4-3 double play" is shortstop to second baseman to first baseman.',
    },
    {
      id: 'no-clock',
      tag: 'Basics',
      weight: 19,
      when: () => true,
      title: 'A game measured in outs, not minutes',
      body: 'There is no game clock. A team must record 27 outs to win, which is why no lead is ever formally safe and why a team down by ten in the ninth still gets to bat.',
    },
    {
      id: 'tagging-up',
      tag: 'Basics',
      weight: 24,
      when: () => true,
      title: 'Tagging up',
      body: 'On a caught fly ball, a runner must be touching his base at the moment of the catch before he can advance. That is why you see runners freeze halfway down the line, waiting to see whether the ball is caught.',
    },
    {
      id: 'foul-two-strikes',
      tag: 'Rules',
      weight: 25,
      when: () => true,
      title: 'Why fouls can go on forever',
      body: 'A foul ball is a strike — except it can never be strike three. A hitter can foul off pitch after pitch with two strikes and stay alive indefinitely, which is how at-bats reach twelve pitches. The exception: bunting foul with two strikes is an out.',
    },
    {
      id: 'battery',
      tag: 'Basics',
      weight: 23,
      when: () => true,
      title: 'The catcher runs the game',
      body: 'Pitcher and catcher are called the battery. The catcher chooses each pitch and its location, frames borderline pitches to steal strikes, and controls the running game. Since 2022 the call is sent electronically via PitchCom rather than finger signs.',
    },
    {
      id: 'abs-challenge',
      tag: 'Rules',
      weight: 28,
      when: () => true,
      title: 'Challenging a ball or strike',
      body: 'Ball-strike calls can now be challenged and reviewed by automated tracking. Only the pitcher, catcher or batter can trigger one, immediately, by tapping his helmet or cap — no help from the dugout — and a team keeps its challenge if it wins.',
    },
    {
      id: 'platoon',
      tag: 'Strategy',
      weight: 27,
      when: () => true,
      title: 'Why handedness decides matchups',
      body: 'Hitters generally do better against a pitcher who throws from the opposite side, because breaking balls move toward them rather than away. Whole lineups and bullpen decisions are built around getting that platoon advantage.',
    },
    {
      id: 'shift-ban',
      tag: 'Rules',
      weight: 26,
      when: () => true,
      title: 'The shift is banned',
      body: 'Since 2023 two infielders must stand on each side of second base with both feet on the dirt. Teams had been stacking three fielders on a pull hitter\'s side and erasing hits; the rule brought ground-ball singles back.',
    },
    {
      id: 'dh',
      tag: 'Rules',
      weight: 21,
      when: () => true,
      title: 'The designated hitter',
      body: 'A tenth player bats in place of the pitcher without playing the field. It has been used in both leagues since 2022, so pitchers essentially never hit anymore.',
    },
    {
      id: 'bullpen',
      tag: 'Strategy',
      weight: 29,
      when: () => true,
      title: 'How a bullpen is organized',
      body: 'Starters go until roughly 90–100 pitches, then relievers take over in defined roles: middle relief, a setup man for the eighth, and the closer for the ninth. Modern staffs script these matchups innings ahead.',
    },
    {
      id: 'statcast',
      tag: 'Numbers',
      weight: 28,
      when: () => true,
      title: 'Exit velocity and launch angle',
      body: 'Every batted ball is tracked for how hard (exit velocity) and at what angle it leaves the bat. The sweet combination — roughly 98+ mph at to 25–30 degrees — is called a barrel, and barrels turn into extra-base hits far more often than anything else.',
    },
    {
      id: 'walkoff',
      tag: 'Basics',
      weight: 24,
      when: () => true,
      title: 'The walk-off',
      body: 'Because the home team bats last, if it takes the lead in the bottom of the final inning the game stops instantly — no need to finish the inning. The winning hit is a "walk-off", named for the losing pitcher walking off the field.',
    },
    {
      id: 'scorer',
      tag: 'Numbers',
      weight: 22,
      when: () => true,
      title: 'Someone decides hit or error',
      body: 'An official scorer at every game judges whether a ball that fell in was a hit or a fielder\'s mistake. It is a human judgment call, and it directly moves batting averages and ERAs.',
    },

    // ----- baserunning -----
    {
      id: 'br-lead',
      tag: 'Baserunning',
      weight: 34,
      when: (c) => c.bases.first || c.bases.second || c.bases.third,
      title: 'The lead, and why pitchers hate it',
      body: 'A runner edges off his base before the pitch to shorten the trip to the next one. The pitcher answers with pickoff throws — but he is limited to two disengagements per plate appearance, and a third failed one is a balk, so runners now take bolder leads than they used to.',
    },
    {
      id: 'br-steal-how',
      tag: 'Baserunning',
      weight: 36,
      when: (c) => c.bases.first && !c.bases.second,
      title: 'How a stolen base actually works',
      body: 'The runner goes the instant the pitcher commits to the plate — the "jump" matters more than raw speed. He needs roughly 3.5 seconds to reach second; the pitcher takes about 1.3 to deliver and the catcher about 2.0 to throw. Those margins are why steals hinge on tenths of a second.',
    },
    {
      id: 'br-force',
      tag: 'Baserunning',
      weight: 33,
      when: (c) => c.bases.first,
      title: 'Force plays versus tag plays',
      body: 'A runner forced to advance because the batter is coming to his base can be put out by a fielder simply touching that base. If he is not forced, he has to be tagged with the ball. That single distinction explains most of what infielders do.',
    },
    {
      id: 'br-hit-and-run',
      tag: 'Baserunning',
      weight: 35,
      when: (c) => c.bases.first && c.outs < 2,
      title: 'The hit and run',
      body: 'The runner takes off as if stealing and the batter is obliged to swing at almost anything. It pulls an infielder toward second to cover the bag, opening a hole for the ground ball to sneak through — and it stays out of a double play.',
    },
    {
      id: 'br-third',
      tag: 'Baserunning',
      weight: 38,
      when: (c) => c.bases.third && c.outs < 2,
      title: 'Runner on third, fewer than two outs',
      body: 'The most valuable spot on the field. A deep fly ball, a ground ball to the right side, a wild pitch or a slow roller all score him — the batter does not even need a hit. The infield often plays in to cut the run off, which makes ground balls likelier to sneak through.',
    },
    {
      id: 'br-extra-base',
      tag: 'Baserunning',
      weight: 30,
      when: () => true,
      title: 'Taking the extra base',
      body: 'Good baserunning is mostly reading the ball off the bat and the fielder\'s throw — going first to third on a single, or scoring from second. Teams track this as a skill in its own right, separate from stolen bases.',
    },
    {
      id: 'br-rundown',
      tag: 'Baserunning',
      weight: 31,
      when: (c) => c.bases.first || c.bases.second || c.bases.third,
      title: 'The rundown',
      body: 'A runner caught between bases gets chased back and forth — a "pickle". Fielders are taught to run him hard toward the base behind him and use as few throws as possible, since every throw is a chance to drop it.',
    },
  ];

  // ---------- team lore ----------
  // The home team gets its own shelf; every other matchup draws from the
  // general pool so there's always something to learn.
  const RED_SOX_ID = 111;

  const RED_SOX = [
    { title: 'Fenway Park, opened 1912', body: 'The oldest ballpark in the major leagues, and it shows on purpose — odd angles, obstructed-view seats and a hand-operated scoreboard still worked by people standing inside the left field wall.' },
    { title: 'The Green Monster', body: 'The left field wall stands 37 feet tall and sits only 310 feet from home plate. It turns towering home runs into loud singles and routine fly balls into doubles off the wall, which is why hitters have to relearn the park.' },
    { title: 'The Curse of the Bambino', body: 'Boston won the 1918 World Series, then sold Babe Ruth to the Yankees. They did not win another for 86 years. Generations of fans grew up treating the drought as fate rather than coincidence.' },
    { title: 'How the curse ended', body: 'Down three games to none to the Yankees in the 2004 ALCS, Boston won four straight — still the only team in major league history to erase a 3-0 postseason deficit — then swept the World Series.' },
    { title: 'Ted Williams hit .406', body: 'In 1941 he became the last man to bat .400 over a full season. On the final day he could have sat out to protect the number and refused, then went 6-for-8 in a doubleheader.' },
    { title: 'The lone red seat', body: 'One red seat sits far out in the right field bleachers, marking where a Ted Williams home run landed in 1946 — an estimated 502 feet, the longest ever measured at Fenway.' },
    { title: "Pesky's Pole", body: 'The right field foul pole stands just 302 feet from home plate, the shortest in baseball. A gentle fly ball that hooks around it counts the same as a 450-foot blast to center.' },
    { title: 'The deepest corner', body: 'Right-center field opens into "the Triangle", where the wall runs out to 420 feet. A ball hit there can rattle around long enough to turn into a triple, which is rare in the modern game.' },
    { title: 'Four titles in fifteen years', body: 'After 86 years without one, Boston won the World Series in 2004, 2007, 2013 and 2018 — turning the sport\'s most famous losers into its most successful franchise of the century.' },
    { title: 'The 2018 team', body: 'They won 108 games, the most in franchise history, and lost only three times in the entire postseason on the way to the title.' },
    { title: 'Yastrzemski, 1967', body: 'Carl Yastrzemski won the Triple Crown — leading the league in average, home runs and RBI in the same season. Only one player has done it since.' },
    { title: 'Sweet Caroline', body: 'The whole park sings it in the middle of the eighth inning, every home game. It started as a one-off in the late 1990s and hardened into ritual.' },
    { title: 'The oldest rivalry', body: 'Red Sox–Yankees is the longest-running feud in American sport. Games between them routinely run past four hours, largely because neither side gives away an at-bat.' },
  ];

  const GENERAL = [
    { title: 'The geometry never changes', body: 'The mound is 60 feet 6 inches from home plate, the bases are 90 feet apart, and home plate is 17 inches wide. Those numbers have barely moved in over a century, which is why records across eras stay roughly comparable.' },
    { title: '108 stitches', body: 'Every baseball is hand-stitched with exactly 108 double stitches. Those raised seams are what let a pitcher grip the ball and make it move — without them, breaking pitches would not exist.' },
    { title: "Cy Young's 511 wins", body: 'The award for the best pitcher is named after a man who won 511 games. Nobody else reached 420, and no modern starter will come close — the record is considered permanently out of reach.' },
    { title: 'The 56-game hitting streak', body: 'Joe DiMaggio got a hit in 56 straight games in 1941. No one has come within 12 games of it since, and statisticians treat it as one of the least likely records in sport.' },
    { title: 'Seven no-hitters', body: 'Nolan Ryan threw seven of them, three more than anyone else, and got the last one at 44 years old. He also walked more batters than any pitcher in history — control was never the point.' },
    { title: 'The perfect game', body: 'Twenty-seven batters, none reaching base by any means. It has happened only about two dozen times in more than a century of major league baseball.' },
    { title: 'Rickey Henderson ran wild', body: 'He stole 1,406 bases, roughly 50% more than anyone else in history, and scored more runs than any player ever. He was still stealing bases at 44.' },
    { title: 'Why gloves kept growing', body: 'Early players caught barehanded, and the first gloves were fingerless scraps of leather that players were mocked for wearing. Modern gloves are so effective that the rules now cap their size.' },
    { title: 'The seventh-inning stretch', body: 'Everyone stands and sings partway through the seventh. The custom is over a century old, and the leading explanation is simply that fans on wooden benches needed to move.' },
    { title: 'A season of baseballs', body: 'Major league teams go through roughly 900,000 baseballs a year. A ball typically lasts only a few pitches before it is scuffed enough to be thrown out.' },
    { title: 'Nobody bats .400 anymore', body: 'Failing 60% of the time makes you a star. Pitchers now throw harder, relievers arrive fresh every inning, and defenses are positioned by data — all of which quietly stripped away the easy hits.' },
    { title: 'The strikeout took over', body: 'Strikeouts have risen almost every season for fifty years, and now outnumber hits. Velocity climbed, hitters accepted the tradeoff for power, and the ball is put in play less than at any time in the sport\'s history.' },
  ];

  // Returns lore for this matchup: the home team's own shelf when they're
  // involved, otherwise the general pool.
  function teamFacts(teamIds = [], rotation = 0) {
    const isRedSox = teamIds.includes(RED_SOX_ID);
    const pool = isRedSox ? RED_SOX : GENERAL;
    const card = pool[Math.abs(rotation) % pool.length];
    return { ...card, tag: isRedSox ? 'Red Sox' : 'Baseball lore', isRedSox };
  }

  // ---------- player notes ----------
  // Turns a stat line into things you can actually learn from, rather than
  // numbers you'd have to already understand.
  const LG = { ops: 0.71, avg: 0.248, era: 4.1 }; // rough league averages for context

  function playerNotes(p, today, which) {
    if (!p) return [];
    const notes = [];
    const num = (v) => (v == null ? null : Number(v));

    if (today && today.text) notes.push(today.text);

    if (which === 'batter' && p.hitting) {
      const h = p.hitting;
      const avg = num(h.avg);
      const ops = num(h.ops);
      const hits = num(h.hits);
      const bb = num(h.baseOnBalls);
      const so = num(h.strikeOuts);
      const hr = num(h.homeRuns);
      const sb = num(h.stolenBases);

      if (hits) {
        const ab = num(h.atBats);
        if (ab && avg) {
          notes.push(
            `${hits} hits this season. A .${String(h.avg).replace('.', '')} average means roughly one hit every ${(1 / avg).toFixed(1)} at-bats — and hitting .300 is considered excellent precisely because failing seven times out of ten is a good day.`
          );
        }
      }
      if (ops) {
        const verdict =
          ops >= 0.9 ? 'All-Star territory' : ops >= 0.78 ? 'clearly above average' : ops >= LG.ops ? 'about league average' : 'below league average';
        notes.push(`His ${h.ops} OPS is ${verdict} — league average sits near .${String(LG.ops).slice(2)}. OPS adds on-base ability to power, so it captures both halves of hitting in one number.`);
      }
      if (bb && so && bb >= so * 0.8) {
        notes.push(`${bb} walks against ${so} strikeouts is remarkable plate discipline — most hitters strike out roughly twice as often as they walk.`);
      }
      if (hr >= 20 && sb >= 15) {
        notes.push(`${hr} home runs with ${sb} steals is the rare power-and-speed combination teams build lineups around.`);
      }
    }

    if (which === 'pitcher' && p.pitching) {
      const s = p.pitching;
      const era = num(s.era);
      const ip = parseFloat(s.inningsPitched);
      const so = num(s.strikeOuts);
      const whip = num(s.whip);

      if (era != null) {
        const verdict = era < 3 ? 'excellent' : era < 4 ? 'solidly above average' : era < 4.6 ? 'around league average' : 'a rough season';
        notes.push(`A ${s.era} ERA means he gives up about ${era.toFixed(1)} earned runs per nine innings — ${verdict}. Runs caused by fielding errors are excluded, since those are not his fault.`);
      }
      if (so && ip) {
        notes.push(`${so} strikeouts in ${s.inningsPitched} innings is ${((so / ip) * 9).toFixed(1)} per nine innings. Around 9 is a strikeout pitcher; under 7 means he relies on weak contact instead.`);
      }
      if (whip != null) {
        notes.push(`His ${s.whip} WHIP is how many walks and hits he allows per inning — under 1.10 is excellent, 1.30 is typical. It is the cleanest measure of how often he pitches with traffic on the bases.`);
      }
    }

    if (p.debut) {
      const yr = new Date(p.debut).getFullYear();
      const seasons = new Date().getFullYear() - yr;
      if (seasons <= 1) notes.push(`He debuted in ${yr}, so this is essentially his rookie run in the majors.`);
      else if (seasons >= 12) notes.push(`He has been in the majors since ${yr} — ${seasons} seasons, a long career by baseball standards.`);
    }

    return notes;
  }

  // ---------- selection ----------
  // Cards split in two: situational ones (weight >= 40) that earn their place by
  // matching what's on the field, and ambient ones that fill the remaining slots
  // and rotate on a timer — otherwise a quiet inning would pin the same three
  // "basics" cards on screen indefinitely.
  const AMBIENT_MAX_WEIGHT = 40;

  function pick(ctx, { limit = 3, recent = [], rotation = 0 } = {}) {
    const c = {
      balls: 0, strikes: 0, outs: 0, inning: 1,
      awayScore: 0, homeScore: 0, eventType: null,
      bases: { first: false, second: false, third: false },
      ...ctx,
      bases: { first: false, second: false, third: false, ...(ctx.bases || {}) },
    };

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

    // Situational cards win their slots outright, newest-shown last so a repeated
    // situation doesn't show the identical card twice running.
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
    return out.map((r) => ({ id: r.id, tag: r.tag, title: resolve(r.title), body: resolve(r.body) }));
  }

  function pitchInfo(name) {
    return name ? PITCHES[name] || null : null;
  }

  return { pick, pitchInfo, playerNotes, teamFacts, PITCHES, GLOSSARY, COUNTS, RED_SOX_ID };
})();

window.Factoids = Factoids;
