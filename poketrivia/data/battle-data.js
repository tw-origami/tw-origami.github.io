// Natures, held items and ability implementations.
//
// PokéAPI gives us moves and ability *descriptions*, but abilities have to be
// coded by hand because each one is a special case. These are the ones that
// matter for the 151 Gen-1 Pokémon; anything not listed is display-only flavour
// and the engine says so rather than pretending.

/* ============================ natures ============================
 * Each nature raises one stat by 10% and lowers another by 10%.
 * The five "neutral" natures raise and lower the same stat, so they do nothing. */
window.PL_NATURES = {
  hardy:   { up: null,  down: null },
  lonely:  { up: 'atk', down: 'def' },
  brave:   { up: 'atk', down: 'spe' },
  adamant: { up: 'atk', down: 'spa' },
  naughty: { up: 'atk', down: 'spd' },
  bold:    { up: 'def', down: 'atk' },
  docile:  { up: null,  down: null },
  relaxed: { up: 'def', down: 'spe' },
  impish:  { up: 'def', down: 'spa' },
  lax:     { up: 'def', down: 'spd' },
  timid:   { up: 'spe', down: 'atk' },
  hasty:   { up: 'spe', down: 'def' },
  serious: { up: null,  down: null },
  jolly:   { up: 'spe', down: 'spa' },
  naive:   { up: 'spe', down: 'spd' },
  modest:  { up: 'spa', down: 'atk' },
  mild:    { up: 'spa', down: 'def' },
  quiet:   { up: 'spa', down: 'spe' },
  bashful: { up: null,  down: null },
  rash:    { up: 'spa', down: 'spd' },
  calm:    { up: 'spd', down: 'atk' },
  gentle:  { up: 'spd', down: 'def' },
  sassy:   { up: 'spd', down: 'spe' },
  careful: { up: 'spd', down: 'spa' },
  quirky:  { up: null,  down: null },
};

/* ============================ held items ============================
 * A deliberately small set — the ones a competitive player would actually
 * reach for, each with a clear, teachable effect. */
window.PL_ITEMS = {
  none:        { label: 'Nothing', blurb: 'No held item.' },
  leftovers:   { label: 'Leftovers', blurb: 'Restores a little HP at the end of every turn.',
                 endTurnHeal: 1 / 16 },
  'life-orb':  { label: 'Life Orb', blurb: 'Moves hit 30% harder, but cost you 10% of your HP each time.',
                 damage: 1.3, recoilFrac: 0.1 },
  'choice-band': { label: 'Choice Band', blurb: 'Physical hits are 50% stronger, but you are locked into the first move you pick.',
                 physical: 1.5, choiceLock: true },
  'choice-specs': { label: 'Choice Specs', blurb: 'Special hits are 50% stronger, but you are locked into the first move you pick.',
                 special: 1.5, choiceLock: true },
  'focus-sash': { label: 'Focus Sash', blurb: 'If you are at full HP, you survive any one hit with 1 HP left.',
                 sash: true },
  'sitrus-berry': { label: 'Sitrus Berry', blurb: 'Eaten automatically when you drop below half HP, restoring a quarter of it.',
                 berryAt: 0.5, berryHeal: 0.25 },
  'assault-vest': { label: 'Assault Vest', blurb: 'Special Defense up 50%, but you cannot use status moves.',
                 spdMult: 1.5, noStatus: true },
  'expert-belt': { label: 'Expert Belt', blurb: 'Super-effective hits do 20% more damage.',
                 superMult: 1.2 },
  'rocky-helmet': { label: 'Rocky Helmet', blurb: 'Anything that touches you takes damage back.',
                 contactBack: 1 / 6 },
};

/* ============================ abilities ============================
 * Only abilities with a mechanical hook are listed. `on` names the moment the
 * engine calls it. Anything a Gen-1 Pokémon can have that is NOT here is shown
 * to the player as flavour text and clearly labelled as not yet simulated. */
window.PL_ABILITY_FX = {
  /* --- on switch-in --- */
  intimidate:   { on: 'switchIn', foeStat: { atk: -1 },
                  text: '{P}\'s Intimidate cut the foe\'s Attack!' },
  drizzle:      { on: 'switchIn', weather: 'rain', text: '{P}\'s Drizzle made it rain!' },
  drought:      { on: 'switchIn', weather: 'sun', text: '{P}\'s Drought turned the sunlight harsh!' },
  'sand-stream':{ on: 'switchIn', weather: 'sand', text: '{P}\'s Sand Stream whipped up a sandstorm!' },

  /* --- damage modifiers --- */
  overgrow:  { on: 'damage', pinchType: 'grass',    mult: 1.5, text: 'Overgrow powered up {P}\'s Grass move!' },
  blaze:     { on: 'damage', pinchType: 'fire',     mult: 1.5, text: 'Blaze powered up {P}\'s Fire move!' },
  torrent:   { on: 'damage', pinchType: 'water',    mult: 1.5, text: 'Torrent powered up {P}\'s Water move!' },
  swarm:     { on: 'damage', pinchType: 'bug',      mult: 1.5, text: 'Swarm powered up {P}\'s Bug move!' },
  'huge-power': { on: 'damage', atkMult: 2, text: '' },
  guts:      { on: 'damage', whenStatus: true, atkMult: 1.5, text: 'Guts turned {P}\'s condition into strength!' },
  'flash-fire': { on: 'damage', boostedBy: 'fire', mult: 1.5, text: 'Flash Fire powered up {P}\'s Fire move!' },

  /* --- immunities and absorptions --- */
  levitate:      { on: 'immune', type: 'ground', text: '{P} floats above the attack — it doesn\'t affect it!' },
  'volt-absorb': { on: 'absorb', type: 'electric', healFrac: 0.25,
                   text: '{P}\'s Volt Absorb turned the attack into health!' },
  'water-absorb':{ on: 'absorb', type: 'water', healFrac: 0.25,
                   text: '{P}\'s Water Absorb turned the attack into health!' },
  'flash-fire-absorb': { on: 'absorb', type: 'fire', healFrac: 0,
                   text: '{P}\'s Flash Fire soaked up the flames!' },
  'lightning-rod': { on: 'absorb', type: 'electric', healFrac: 0, selfStat: { spa: 1 },
                   text: '{P}\'s Lightning Rod drew in the attack and raised its Special Attack!' },

  /* --- contact punishment --- */
  static:      { on: 'contact', chance: 30, ailment: 'paralysis',
                 text: '{P}\'s Static paralyzed the attacker!' },
  'poison-point': { on: 'contact', chance: 30, ailment: 'poison',
                 text: '{P}\'s Poison Point poisoned the attacker!' },
  'flame-body': { on: 'contact', chance: 30, ailment: 'burn',
                 text: '{P}\'s Flame Body burned the attacker!' },
  'rough-skin': { on: 'contact', chance: 100, recoilFrac: 1 / 8,
                 text: 'Rough Skin hurt the attacker!' },

  /* --- status protection --- */
  limber:      { on: 'block', ailment: 'paralysis', text: '{P}\'s Limber prevents paralysis!' },
  'water-veil':{ on: 'block', ailment: 'burn', text: '{P}\'s Water Veil prevents burns!' },
  insomnia:    { on: 'block', ailment: 'sleep', text: '{P}\'s Insomnia keeps it awake!' },
  'vital-spirit': { on: 'block', ailment: 'sleep', text: '{P}\'s Vital Spirit keeps it awake!' },
  immunity:    { on: 'block', ailment: 'poison', text: '{P}\'s Immunity prevents poison!' },
  'magma-armor': { on: 'block', ailment: 'freeze', text: '{P}\'s Magma Armor prevents freezing!' },
  'own-tempo': { on: 'block', ailment: 'confusion', text: '{P}\'s Own Tempo prevents confusion!' },
  'shield-dust': { on: 'blockSecondary', text: '{P}\'s Shield Dust blocked the extra effect!' },

  /* --- stat protection --- */
  'clear-body': { on: 'protectStats', text: '{P}\'s Clear Body prevents stat drops!' },
  'white-smoke': { on: 'protectStats', text: '{P}\'s White Smoke prevents stat drops!' },
  'keen-eye':  { on: 'protectStats', only: 'acc', text: '{P}\'s Keen Eye keeps its accuracy!' },
  'hyper-cutter': { on: 'protectStats', only: 'atk', text: '{P}\'s Hyper Cutter keeps its Attack!' },

  /* --- speed and accuracy --- */
  'swift-swim': { on: 'speed', weather: 'rain', mult: 2, text: '' },
  chlorophyll:  { on: 'speed', weather: 'sun', mult: 2, text: '' },
  'sand-veil':  { on: 'evasion', weather: 'sand', mult: 1.25, text: '' },
  'compound-eyes': { on: 'accuracy', mult: 1.3, text: '' },
  'no-guard':   { on: 'accuracy', always: true, text: 'No Guard means neither side can miss!' },

  /* --- survival --- */
  sturdy:    { on: 'endure', text: '{P} endured the hit with Sturdy!' },
  'shell-armor': { on: 'noCrit', text: '' },
  'battle-armor': { on: 'noCrit', text: '' },
};

/** Abilities we display but do not simulate, so the UI can say so honestly. */
window.PL_ABILITY_UNSIMULATED_NOTE =
  'This ability is shown for accuracy but does not change the battle yet.';
