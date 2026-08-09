// Procedural math questions, so the maths well never runs dry.
// Number ranges are ported from the Learn Zone's math/wordbank.js levels.

import { pick, rand } from './rng.js';

const HEROES = ['Ash', 'Misty', 'Brock', 'Pikachu', 'Charizard', 'Squirtle', 'Bulbasaur',
  'Eevee', 'Snorlax', 'Professor Oak', 'Nurse Joy', 'a Youngster'];
const THINGS = ['Poké Balls', 'berries', 'badges', 'potions', 'apples', 'stickers',
  'trading cards', 'rare candies', 'coins', 'fossils'];

const R = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

// band A ≈ grades 3-4, band B ≈ grades 5-6+
const RANGES = {
  A: { easy: { add: [2, 20],  mul: [2, 6],  sub: [2, 20] },
       medium:{ add: [5, 50],  mul: [2, 9],  sub: [5, 40] },
       hard:  { add: [10, 100],mul: [3, 12], sub: [10, 80] } },
  B: { easy: { add: [10, 60],  mul: [3, 9],  sub: [10, 60] },
       medium:{ add: [20, 200],mul: [4, 12], sub: [20, 150] },
       hard:  { add: [50, 500],mul: [6, 20], sub: [50, 400] } },
};

const num = (q, answer, reveal, unit) => ({
  id: null, subject: 'math', numeric: answer, unit, q, reveal,
});

const TEMPLATES = [
  // --- word problems ---
  (r) => { const a = R(...r.mul), b = R(...r.mul), who = pick(HEROES), th = pick(THINGS);
    return num(`${who} has ${a} bags of ${th}. Each bag holds ${b}. How many ${th} in all?`,
      a * b, `${a} groups of ${b} is ${a} × ${b} = ${a * b}.`); },

  (r) => { const b = R(...r.mul), n = R(2, 9), tot = b * n, who = pick(HEROES);
    return num(`${who} splits ${tot} berries evenly among ${n} Pokémon. How many does each get?`,
      b, `Sharing evenly means dividing: ${tot} ÷ ${n} = ${b}.`); },

  (r) => { const a = R(...r.add), b = R(...r.add);
    return num(`A trainer walked ${a} steps, rested, then walked ${b} more. How many steps altogether?`,
      a + b, `${a} + ${b} = ${a + b}.`, 'steps'); },

  (r) => { const a = R(...r.sub), b = R(1, Math.max(2, Math.floor(a * 0.8)));
    return num(`There were ${a} Pidgey in a field. ${b} flew away. How many are left?`,
      a - b, `Taking away means subtracting: ${a} − ${b} = ${a - b}.`); },

  // --- money ---
  (r) => { const price = R(3, 25), n = R(2, 8);
    return num(`Potions cost $${price} each. What do ${n} potions cost?`,
      price * n, `${n} × $${price} = $${price * n}.`, 'dollars'); },

  (r) => { const paid = R(20, 100), cost = R(5, 19);
    return num(`You pay with $${paid} for something that costs $${cost}. How much change?`,
      paid - cost, `Change is what's left: $${paid} − $${cost} = $${paid - cost}.`, 'dollars'); },

  // --- fractions & percents (band B leans on these) ---
  (r, band) => { const whole = R(2, 12) * 4, part = whole / 4;
    return num(`What is one quarter (1/4) of ${whole}?`, part,
      `A quarter means split into 4 equal parts: ${whole} ÷ 4 = ${part}.`); },

  (r, band) => { const whole = R(2, 20) * 10, pct = pick([10, 20, 25, 50]);
    return num(`What is ${pct}% of ${whole}?`, (whole * pct) / 100,
      `${pct}% means ${pct} out of every 100. ${whole} × ${pct}/100 = ${(whole * pct) / 100}.`); },

  // --- geometry ---
  (r) => { const w = R(3, 18), h = R(3, 18);
    return num(`A rectangular battle arena is ${w} m by ${h} m. What is its area?`,
      w * h, `Area of a rectangle is length × width: ${w} × ${h} = ${w * h} square metres.`, 'm²'); },

  (r) => { const w = R(3, 20), h = R(3, 20);
    return num(`A garden is ${w} m by ${h} m. How much fence goes all the way around?`,
      2 * (w + h), `Perimeter adds every side: ${w} + ${h} + ${w} + ${h} = ${2 * (w + h)} m.`, 'm'); },

  // --- estimation: the one place partial credit really shines ---
  (r) => { const a = R(180, 980), b = R(180, 980);
    return num(`About how much is ${a} + ${b}? (Close counts!)`, a + b,
      `Round to the nearest hundred and add, then check: ${a} + ${b} = ${a + b}.`); },

  (r) => { const n = R(12, 48), each = R(6, 19);
    return num(`${n} trainers each carry about ${each} items. Roughly how many items in total?`,
      n * each, `${n} × ${each} = ${n * each}. Estimating with round numbers gets you close fast.`); },

  // --- time & rates ---
  (r) => { const speed = R(2, 9), hours = R(2, 9);
    return num(`A Rapidash runs ${speed} km every hour. How far in ${hours} hours?`,
      speed * hours, `Distance = speed × time: ${speed} × ${hours} = ${speed * hours} km.`, 'km'); },

  (r) => { const start = R(1, 9), add = R(2, 9), n = R(4, 8);
    const seq = Array.from({ length: n }, (_, i) => start + i * add);
    return num(`What number comes next? ${seq.join(', ')}, …`, start + n * add,
      `Each step adds ${add}, so after ${seq[n - 1]} comes ${start + n * add}.`); },
];

/** One fresh numeric maths question for the given band and difficulty. */
export function makeMathQuestion(band = 'B', difficulty = 'medium') {
  const r = (RANGES[band] ?? RANGES.B)[difficulty] ?? RANGES.B.medium;
  const t = pick(TEMPLATES);
  const q = t(r, band);
  q.band = band;
  q.diff = difficulty;
  q.id = null;              // generated questions aren't tracked in missed[]
  return q;
}
