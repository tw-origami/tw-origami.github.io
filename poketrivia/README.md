# PokéTrivia Island

An N64-style 3D Pokémon game where every Poké Ball throw and every attack is
powered by answering a trivia question. Math, science, history, English and
general knowledge. Wrong answers always show the right answer and explain it.

Zero build step. It's HTML, CSS and plain ES modules — the same shape as the
other Learn Zone apps, so it can be dropped into that hub as a folder.

## Running it

```bash
python3 tools/serve.py 8155
```

Then open <http://localhost:8155>. Add `?debug=1` for an FPS/draw-call readout
and zone teleport buttons.

`tools/serve.py` is `http.server` plus `Cache-Control: no-store`. Without that,
the browser caches ES modules by URL and keeps serving a stale `js/world.js` no
matter how you bust the query string. Any plain static host works in production.

**Requires** a browser with import-map support: Safari 16.4+, so current iPads
are fine but a very old one will show a blank page.

## How it plays

- Roam a low-poly island with five subject zones around a hub town.
- **Nothing ambushes you.** Walking near a trainer or a wild Pokémon shows an (A)
  prompt naming it; you press A to engage. Encounters are always your choice.
- **Battles are a real Pokémon simulation** (see below). Your Pokémon's actual
  moves are listed with type, power and PP. A stronger move asks a harder
  question, and how well you answer becomes the move's execution quality: right
  answer, full power; close numeric guess, reduced power; wrong answer, the move
  fizzles and you lose the turn.
- **Catching follows the real formula.** Weaken it, put it to sleep, then throw —
  both terms are in the maths, and the encounter screen shows you your live catch
  odds so the strategy is legible. Knock it out and you get nothing.
- **Subjects rotate.** No two questions in a row come from the same topic, and
  every topic comes up once before any repeats.

## The battle engine

`js/battle-engine.js` is a standalone simulation that knows nothing about trivia
or the DOM, so it can be unit-tested against known Pokémon behaviour. What it
implements, in roughly the order a competitive player cares:

- **Priority brackets beat Speed.** Quick Attack (+1) outruns a faster Pokémon;
  Protect (+4) outruns Quick Attack; Trick Room inverts Speed.
- **Stat stages, −6..+6**, with the real multipliers and a hard clamp. Growl
  lowers Attack (not Defense) and bottoms out at −6 rather than reaching zero.
- **Persistent status**: burn (halves physical attack, 1/16 chip), poison (1/8),
  toxic (escalating), paralysis (half speed, 25% full stop), sleep, freeze — with
  the real type immunities.
- **Type effectiveness** with dual types, so 4× and 0× both really happen, plus
  same-type attack bonus.
- **The real damage formula**, physical/special split, critical hits that cut
  through Defense boosts, accuracy vs evasion, PP, multi-hit, drain and recoil.
- **Abilities with genuine effects**: Intimidate, Levitate, Volt Absorb, Static,
  Clear Body, Blaze/Torrent/Overgrow, Sturdy and more. Abilities without a
  mechanical hook are shown as flavour and labelled as not simulated.
- **Held items and natures**: Leftovers, Life Orb, Focus Sash, Choice Band, and
  the full ±10% nature table.
- **An opponent worth outplaying** (`js/battle-ai.js`) that scores every move by
  what would actually happen, with a skill dial — route trainers play loose,
  zone champions play tight.

Move mechanics come from PokéAPI (priority, targets, ailments and their chances,
stat changes, drain, healing, flinch, multi-hit), fetched once by
`tools/fetch-pokeapi.mjs` and committed. Nothing hits the network at runtime.
- Math answers are typed in and get partial credit for being close — within 5% is
  60% power, within 15% is 30%. Small whole numbers must be exact, because
  "3 × 4 = 13" is wrong, not nearly right.
- Signs teach a fact and prime its question to appear in your next few encounters.
- Questions you miss go into a pile that gets re-asked until you beat them. The
  Study Tent in town heals your team.
- Two difficulty bands per profile (A ≈ grades 3–4, B ≈ grades 5–6+) with drift:
  a hot streak nudges questions harder, a cold one nudges them easier.

## Layout

```
index.html         shell: canvas, DOM UI layers, import map, data script tags
style.css          N64 chrome — navy panels, gold accents, chunky borders
vendor/            three.js r180 (two files: module + core), pinned and offline
js/
  main.js          boot, render loop, mode router, encounter triggers
  world.js         island geometry, props, water, sky, collision queries
  zones.js         authored layout: zone centres, spawn tables, signs, buildings
  player.js        trainer rig, movement, follow camera
  npc.js           roaming wild Pokémon
  trainer-npc.js   standing trainers with line-of-sight challenges
  billboard.js     Y-axis billboards with downscaled sprites
  encounter-catch.js / encounter-battle.js
  quiz.js          question selection + the modal
  grading.js       pure grading (no DOM, so node can test it)
  mathgen.js       procedural numeric math
  party.js         species, stats, real moves, damage, XP, evolution
  save.js          localStorage profiles
  audio.js         WebAudio chiptune synth — no audio files anywhere
  ui.js            HUD, dialog, compass, badges
data/
  dex.js           151 Pokémon: stats, types, catch rates, type chart, evolutions
  moves.js         GENERATED — real moves, learnsets and abilities from PokéAPI
  questions.js     GENERATED — the question bank
  trainers.js      authored trainer rosters, dialogue and badges
tools/
  serve.py             dev server with no-store headers
  fetch-pokeapi.mjs    one-time PokéAPI fetch → data/moves.js
  import-questions.mjs Learn Zone harvest + authored sets → data/questions.js
  check-grading.mjs    node assertions for grading, catching, damage, balance
```

## Regenerating the data

```bash
node tools/import-questions.mjs        # rebuild the question bank
node tools/import-questions.mjs --dry  # counts and lint only, write nothing
node tools/fetch-pokeapi.mjs           # re-fetch move mechanics (needs network)
node tools/check-battle.mjs            # 51 assertions about Pokémon mechanics
node tools/check-grading.mjs           # 32 assertions about grading and balance
```

The importer sandbox-evaluates the Learn Zone banks in `../math-app` (a Proxy
absorbs every DOM call, the same trick `.distractor-check.js` uses), walks the
resulting globals for anything MCQ-shaped, and builds questions from the banks
that store facts rather than questions — part-of-speech items become "what part
of speech is this", country records become capitals, term lists become
definitions with plausible distractors drawn from the other terms.

On top of that it authors what the Learn Zone doesn't cover: the full times
tables and their division inverses with diagnostic distractors, shapes drawn as
inline SVG, US state capitals, unit conversions, constitutional amendments, and
graphic-novel comprehension.

Question ids are content hashes, so re-running the importer produces identical
ids and every profile's missed-question list and shuffled question bag stay
valid.

Every run prints per-cell counts and lints for the "pick the longest answer"
tell — if the correct answer is the longest option more than ~40% of the time,
kids can score well without knowing anything.

## Publishing

This folder is the canonical copy. The Learn Zone repo (`../math-app`) is the
GitHub Pages site, so publishing is just copying the folder in and committing:

```bash
tools/deploy.sh --push
```

That lands it at <https://tw-origami.github.io/poketrivia/>. The script stages
only `poketrivia/` and the hub tile, because the Learn Zone usually has unrelated
work in progress that must not get swept into a deploy commit.

`math-app/poketrivia/` is generated output — never edit it, `deploy.sh` wipes it.

To serve it from a custom domain like `tw-origami.io`, you would need to own that
domain, point its DNS at GitHub Pages, and add a `CNAME` file at the repo root.
Adding that file without the DNS in place takes the current site offline, so it
is deliberately not part of this script.

## Notes

- **Questions never repeat until the pool is exhausted.** They're dealt from a
  shuffled bag saved with the profile, not drawn at random.
- **Privacy**: profile names live only in `localStorage`. Nothing identifying is
  ever written to a file in this repo, matching the Learn Zone's rule about the
  gitignored `plan/` folder.
- **Pokémon assets** (artwork, dex data, moves) are for personal family use, the
  same posture as the existing `pokelearn` app.
