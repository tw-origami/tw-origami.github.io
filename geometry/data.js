/* Geometry Gym — content data. Prep for high-school geometry.
 * Four INTERACTIVE games:
 *   TRIANGLE → drag a triangle's corners; angles always sum to 180°, classify it
 *   PYTHAG   → find the missing side of a right triangle (with squares drawn on the sides)
 *   SHAPES   → compute area, perimeter, volume, and circumference of shapes
 *   PARALLEL → find a missing angle using parallel-line relationships
 */
window.GEO = {

  TEACHER: {
    triangle: {
      how:'Drag the three orange corners of the triangle. Watch the angles at each corner change — and notice they ALWAYS add up to 180°. Try to shape the triangle the challenge asks for (like a right or isosceles triangle).',
      point:'The triangle angle-sum rule (180°) and how triangles are classified are geometry bedrock. Dragging a real triangle makes both stick far better than a diagram.',
      learn:'The angle-sum theorem (angles of a triangle add to 180°) and classifying triangles by angles (acute, right, obtuse) and sides (equilateral, isosceles, scalene).',
      explore:'Ask: “Can you make a triangle whose angles DON’T add to 180°?” (You can’t!) Then have them draw a triangle and measure its angles with a protractor to check.'
    },
    pythag: {
      how:'A right triangle appears with squares drawn on its sides. Two sides are given; find the missing one using a² + b² = c² (the two legs squared add up to the hypotenuse squared). Type your answer and press Check.',
      point:'The Pythagorean theorem is one of the most useful formulas in all of math. Seeing the squares on each side shows WHY it works, not just the formula.',
      learn:'Using a² + b² = c² to find a missing side of a right triangle, and what “legs” and “hypotenuse” mean.',
      explore:'Ask: “Why are the two smaller squares’ areas equal to the big square’s area?” Then have them check a 3-4-5 triangle by drawing it on graph paper.'
    },
    shapes: {
      how:'A shape appears with its measurements labeled. Use the formula to calculate what’s asked — area, perimeter, volume, or circumference. Type your answer and press Check. (Use 3.14 for π.)',
      point:'Area, perimeter, and volume formulas show up in geometry, science, and real life (paint, fencing, packing boxes). This drills the ones that matter most.',
      learn:'The core formulas: rectangle and triangle area, perimeter, circle area and circumference, and the volume of a box.',
      explore:'Ask: “What would you measure in real life to use this formula?” Then have them find the area of a real table or the volume of a cereal box.'
    },
    parallel: {
      how:'Two parallel lines are crossed by a slanted line (a transversal). One angle is given; use the named relationship to find the marked “?” angle. Equal-angle relationships copy the number; supplementary ones add up to 180°. Type your answer.',
      point:'Parallel-line angle rules are a whole unit of geometry — and the reasoning (equal vs. supplementary) is exactly the kind of logic geometry proofs are built on.',
      learn:'Angle relationships on parallel lines: corresponding (F-shape) and alternate (Z-shape) angles are equal; co-interior (C-shape) angles add to 180°.',
      explore:'Ask: “Is this pair equal, or do they add to 180°?” Then have them find these same angle shapes where a street crosses two parallel roads.'
    }
  },

  SOURCES: [
    { key:'khan', name:'Khan Academy — Geometry',
      url:'https://www.khanacademy.org/math/geometry', note:'Free lessons on triangles, the Pythagorean theorem, area and volume, and angle relationships.' },
    { key:'mathisfun', name:'Math is Fun — Geometry',
      url:'https://www.mathsisfun.com/geometry/', note:'Clear, visual explanations of every shape and formula in this app.' },
    { key:'ck12', name:'CK-12 — Geometry',
      url:'https://www.ck12.org/c/geometry/', note:'A full, free geometry textbook to go deeper on any topic.' }
  ],

  /* ───── Glossary (📖 popup) ───── */
  TERMS: [
    { term:'Vertex', def:'A corner point where two sides of a shape meet.', simple:'A corner. A triangle has three vertices.', ex:'The three tips of a triangle.' },
    { term:'Interior angle', def:'An angle inside a shape, between two of its sides.', simple:'An angle inside the shape (not outside).', ex:'A triangle’s three inside angles add to 180°.' },
    { term:'Acute / Right / Obtuse', def:'Angle sizes: acute (< 90°), right (exactly 90°), obtuse (> 90°).', simple:'Small, square-corner, or wide. A right angle is a perfect corner (90°).', ex:'A square’s corners are all right angles.' },
    { term:'Equilateral / Isosceles / Scalene', def:'Triangles by sides: all equal, two equal, or none equal.', simple:'All three sides the same, exactly two the same, or all different.', ex:'A traffic “yield” sign is roughly equilateral.' },
    { term:'Hypotenuse', def:'The longest side of a right triangle, opposite the right angle.', simple:'In a right triangle, the slanted side across from the square corner — always the longest.', ex:'The “5” in a 3-4-5 triangle.' },
    { term:'Leg', def:'One of the two shorter sides of a right triangle that form the right angle.', simple:'The two sides that make the square corner.', ex:'The “3” and “4” in a 3-4-5 triangle.' },
    { term:'Pythagorean theorem', def:'For a right triangle, a² + b² = c² (legs squared add to the hypotenuse squared).', simple:'Square the two legs, add them, and you get the hypotenuse squared.', ex:'3² + 4² = 9 + 16 = 25 = 5².' },
    { term:'Area', def:'The amount of surface a flat shape covers, measured in square units.', simple:'How much space is inside a flat shape.', ex:'A rug that’s 3 m × 2 m has an area of 6 m².' },
    { term:'Perimeter', def:'The total distance around the outside of a shape.', simple:'Add up all the side lengths — the fence around it.', ex:'A 4-by-5 rectangle has a perimeter of 18.' },
    { term:'Volume', def:'The amount of space a 3-D object takes up, in cubic units.', simple:'How much fits inside a solid — length × width × height for a box.', ex:'A 2×3×4 box holds 24 cubic units.' },
    { term:'Circumference', def:'The distance all the way around a circle.', simple:'A circle’s “perimeter.” It equals 2 × π × radius.', ex:'A circle with radius 5 has circumference ≈ 31.4.' },
    { term:'Radius / Diameter', def:'Radius = center to edge; diameter = all the way across (2× radius).', simple:'Radius is halfway; diameter is the full width through the middle.', ex:'A radius of 5 means a diameter of 10.' },
    { term:'Pi (π)', def:'The ratio of a circle’s circumference to its diameter, about 3.14.', simple:'A never-ending number (≈ 3.14) that shows up in every circle.', ex:'Area of a circle = π × r².' },
    { term:'Parallel lines', def:'Two lines that stay the same distance apart and never meet.', simple:'Lines like railroad tracks — always the same gap, never crossing.', ex:'The two long edges of a ruler.' },
    { term:'Transversal', def:'A line that crosses two or more other lines.', simple:'A line cutting across parallel lines, creating angles.', ex:'A road crossing two parallel streets.' },
    { term:'Corresponding angles', def:'Matching-corner angles at each crossing of a transversal — they are equal.', simple:'Same position at each intersection (an “F” shape). Equal.', ex:'Both top-right angles are equal.' },
    { term:'Alternate angles', def:'Angles on opposite sides of the transversal, between the lines — they are equal.', simple:'A “Z” shape — opposite sides, equal.', ex:'Alternate interior angles match.' },
    { term:'Co-interior angles', def:'Same-side interior angles — they add up to 180°.', simple:'A “C” shape — same side, between the lines. They’re supplementary (add to 180°).', ex:'110° and 70° are co-interior.' },
    { term:'Supplementary', def:'Two angles that add up to 180°.', simple:'A pair that together make a straight line.', ex:'120° and 60° are supplementary.' },
    { term:'Congruent / Similar', def:'Congruent = same shape AND size; similar = same shape, different size.', simple:'Congruent shapes are identical twins; similar shapes are scaled copies.', ex:'Two photos of different sizes are similar.' }
  ],

  /* ───── GAME 2 · PYTHAGORAS ─────
   * Each is a right triangle (a, b legs; c hypotenuse) with one side unknown. */
  PYTH: [
    { a:3, b:4, c:5, unknown:'c' },
    { a:6, b:8, c:10, unknown:'c' },
    { a:5, b:12, c:13, unknown:'c' },
    { a:8, b:15, c:17, unknown:'c' },
    { a:9, b:12, c:15, unknown:'c' },
    { a:7, b:24, c:25, unknown:'c' },
    { a:12, b:16, c:20, unknown:'c' },
    { a:10, b:24, c:26, unknown:'c' },
    { a:3, b:4, c:5, unknown:'a' },
    { a:6, b:8, c:10, unknown:'b' },
    { a:5, b:12, c:13, unknown:'a' },
    { a:8, b:15, c:17, unknown:'b' },
    { a:9, b:40, c:41, unknown:'c' },
    { a:20, b:21, c:29, unknown:'c' }
  ],

  /* ───── GAME 3 · SHAPE FORMULAS ─────
   * ans is precomputed; π uses 3.14. */
  SHAPES: [
    { shape:'rectangle', dims:{l:8,w:5}, ask:'area', ans:40, formula:'length × width = 8 × 5', unit:'square units' },
    { shape:'rectangle', dims:{l:9,w:4}, ask:'perimeter', ans:26, formula:'2 × (length + width) = 2 × (9 + 4)', unit:'units' },
    { shape:'rectangle', dims:{l:12,w:7}, ask:'area', ans:84, formula:'length × width = 12 × 7', unit:'square units' },
    { shape:'square', dims:{s:6}, ask:'area', ans:36, formula:'side × side = 6 × 6', unit:'square units' },
    { shape:'square', dims:{s:9}, ask:'perimeter', ans:36, formula:'4 × side = 4 × 9', unit:'units' },
    { shape:'triangle', dims:{b:6,h:4}, ask:'area', ans:12, formula:'½ × base × height = ½ × 6 × 4', unit:'square units' },
    { shape:'triangle', dims:{b:10,h:8}, ask:'area', ans:40, formula:'½ × base × height = ½ × 10 × 8', unit:'square units' },
    { shape:'circle', dims:{r:5}, ask:'area', ans:78.5, formula:'π × r² = 3.14 × 5²', unit:'square units' },
    { shape:'circle', dims:{r:10}, ask:'circumference', ans:62.8, formula:'2 × π × r = 2 × 3.14 × 10', unit:'units' },
    { shape:'circle', dims:{r:3}, ask:'area', ans:28.26, formula:'π × r² = 3.14 × 3²', unit:'square units' },
    { shape:'box', dims:{l:3,w:4,h:5}, ask:'volume', ans:60, formula:'length × width × height = 3 × 4 × 5', unit:'cubic units' },
    { shape:'box', dims:{l:2,w:6,h:5}, ask:'volume', ans:60, formula:'length × width × height = 2 × 6 × 5', unit:'cubic units' }
  ],

  /* ───── GAME 4 · PARALLEL LINES ─────
   * equal:true → answer = known; equal:false → answer = 180 − known.
   * kpos/tpos are diagram positions: T/B intersection + tr/tl/br/bl corner. */
  PARALLEL: [
    { known:65,  rel:'corresponding',      equal:true,  kpos:'T-br', tpos:'B-br', rule:'Corresponding angles (an “F” shape) are equal, so the marked angle is the same.' },
    { known:110, rel:'alternate interior', equal:true,  kpos:'T-br', tpos:'B-tl', rule:'Alternate interior angles (a “Z” shape) are equal.' },
    { known:72,  rel:'co-interior',        equal:false, kpos:'T-br', tpos:'B-tr', rule:'Co-interior (same-side) angles add up to 180°, so subtract from 180.' },
    { known:130, rel:'vertical',           equal:true,  kpos:'T-tr', tpos:'T-bl', rule:'Vertical (opposite) angles are equal.' },
    { known:48,  rel:'linear pair',        equal:false, kpos:'T-tr', tpos:'T-tl', rule:'Angles on a straight line add up to 180°.' },
    { known:95,  rel:'corresponding',      equal:true,  kpos:'T-tl', tpos:'B-tl', rule:'Corresponding angles are equal.' },
    { known:125, rel:'co-interior',        equal:false, kpos:'T-bl', tpos:'B-tl', rule:'Co-interior angles add up to 180°.' },
    { known:53,  rel:'alternate interior', equal:true,  kpos:'T-bl', tpos:'B-tr', rule:'Alternate interior angles are equal.' }
  ]
};
