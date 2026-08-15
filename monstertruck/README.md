# Monster Truck

A learning game for preschoolers, styled like a Nintendo-64-era monster truck
game. Drive around a stadium, hit the ramps, and listen for the announcer:
*"Find the triangle!"* — three gates rise from the dirt, and driving through
the right one earns a star, confetti, and a crowd roar. Fireworks every five
stars. Teaches **shapes, colors, letters (A–Z), and numbers 1–10**.

The stadium sits in a much bigger open world: archways on both ends lead out
to a dirt race track looping around the stands, a **playground** (whoop bumps,
a giant slide, a seesaw, tire stacks, beach balls that roll when you shove
them) and a **parking lot** full of cars that pancake — CRUNCH! — when you
drive over them (they pop back after a while). The announcer names each place
as you roll in.

Live at: https://tw-origami.github.io/monstertruck/

## Design rules (the pedagogy, all deliberate)

- **No reading required.** Every menu is pictures; every target is spoken
  aloud and shown on the gate, the jumbotron, and the HUD chip.
- **No fail states, no timers.** A wrong gate wobbles, the announcer gently
  retries, and the target stays until found. Help escalates: after 3 wrong
  gates the correct one pulses green with an arrow; after 5 the wrong ones
  sink away. The kid always wins.
- **Look-alikes are held back.** b/d/p/q, m/w, i/l, n/u, 6/9, 3/8, 1/7,
  blue/purple, red/orange, square/diamond never appear as distractors until
  the target itself has been mastered twice — then they become the stretch.
- **Small windows that grow.** Letters and numbers start with the first six;
  every 3 masteries adds one more. Shapes and colors are all in from round one.
- **Number gates teach counting**: the digit plus that many dots.
- **Shape gates share one color** (and color gates differ *only* by hue), so
  color can never leak the answer inside a category.
- **Auto-cruise** is on by default — the truck rolls on its own and steering
  is the whole game, playable with one thumb. Parents can toggle it on the
  mode screen.
- **Learning lives in the stadium; everywhere else is pure play.** Drive out
  an archway mid-round and the gates pack up with no penalty; drive back in
  and a fresh callout follows. The kid chooses when it's school time.

## Layout

```
index.html        canvas + all DOM overlays (title, garage, modes, HUD, touch)
style.css         chunky N64 chrome; the canvas is upscaled with pixelated rendering
data/callouts.js  single source of truth: every target and every announcer line
js/
  main.js         boot, 432p render pipeline, screen flow, game loop, debug harness
  world.js        arena, ramps + heightAt(), stands, instanced crowd, jumbotron, sky
  truck.js        kinematic driving (yaw-only, no flipping), suspension, chase cam
  gates.js        gate meshes + rise/sink + segment-test crossing detection
  rounds.js       round state machine, target/distractor selection, help ladder
  glyphs.js       what every target looks like, in 2D (canvas) and 3D (extrude)
  vo.js           announcer: mp3 first, speechSynthesis fallback, priority queue
  audio.js        synthesized SFX + engine loop + crowd murmur (no audio files)
  particles.js    dust, confetti, firework sparks (instanced)
  input.js        keyboard + touch stick/pedals
  hud.js          target chip, stars, popups, mute
  screens.js      title / truck select / mode select
  save.js         one localStorage blob (ids + numbers only — repo is public)
audio/vo/*.mp3    the announcer's 69 voice clips (see below)
vendor/           three.js r180, pinned, offline
tools/            serve.py (dev), deploy.sh (publish), check-callouts.mjs (audit)
```

No build step, no CDN, no analytics. The whole game works offline from a
static folder. Requires import-map support (Safari 16.4+, any recent Chrome).

## The voice

`audio/vo/<id>.mp3`, one clip per line in `data/callouts.js`. The shipped set
was TTS-generated (Higgsfield seed_audio, "Grady" preset, ~14 credits for all
69 lines). The game prefers the mp3 and falls back to the browser's
`speechSynthesis` for any missing clip, so:

- **Re-recording is drop-in**: record a replacement with the same filename
  (e.g. `shape_triangle.mp3` for "Find the triangle!"), drop it in, done.
  `node tools/check-callouts.mjs` lists every expected id and its script line.
- Deleting a clip never breaks the game — the fallback voice covers it.

## Controls

| Input | Action |
|---|---|
| ←/→ or A/D, or the touch stick | steer |
| ↑/W or the GO! pedal | full speed |
| ↓/S or the STOP pedal | brake, then slow reverse |
| Space, or the 🔊 button | hear the callout again (+ honk) |

## Develop

```
python3 tools/serve.py 8166
```

then open http://localhost:8166/?debug for the overlay (fps, tris, draws) and
the `window.__game` harness (`step(dt, n)` drives frames in a throttled tab;
`aimAtGate(i)` lines the truck up on a gate lane).

## Publish

```
tools/deploy.sh          # copy into ../math-app/monstertruck (wiped first)
tools/deploy.sh --push   # + path-selective commit and push to GitHub Pages
```

The copy in `math-app/monstertruck/` is generated — never edit it there. The
deploy stages only `monstertruck index.html dev.html`, because the hub repo
usually carries unrelated work in progress.
