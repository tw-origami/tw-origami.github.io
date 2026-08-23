// Draw Lab data. Coordinates for step-by-step guides are in a 0–100 space
// (origin top-left, y goes down) and scale to whatever size the canvas is.
// Primitive keys: c=circle[x,y,r]  e=ellipse[x,y,rx,ry,rotDeg]  l=line[x1,y1,x2,y2]
//   p=polyline{p:[[x,y]...],close}  a=arc[x,y,r,startDeg,endDeg]  d=dot[x,y,r]
window.DRAW = {
  SUBJECTS: [
    { name: 'Cat', emoji: '🐱', steps: [
      { say: 'Draw a big circle for the head.', add: [{ c: [50, 54, 28] }] },
      { say: 'Add two pointy triangle ears on top.', add: [{ p: [[30, 38], [38, 10], [49, 32]], close: true }, { p: [[51, 32], [62, 10], [70, 38]], close: true }] },
      { say: 'Draw two eyes.', add: [{ d: [41, 52, 3] }, { d: [59, 52, 3] }] },
      { say: 'Add a little triangle nose and a smile.', add: [{ p: [[47, 60], [53, 60], [50, 65]], close: true }, { a: [45, 65, 5, 0, 180] }, { a: [55, 65, 5, 0, 180] }] },
      { say: 'Draw three whiskers on each side.', add: [{ l: [36, 60, 15, 55] }, { l: [36, 63, 14, 63] }, { l: [36, 66, 15, 71] }, { l: [64, 60, 85, 55] }, { l: [64, 63, 86, 63] }, { l: [64, 66, 85, 71] }] },
      { say: 'Now color your cat any way you like! 🎨', add: [] }
    ]},
    { name: 'Fish', emoji: '🐟', steps: [
      { say: 'Draw an oval for the body.', add: [{ e: [46, 52, 26, 16, 0] }] },
      { say: 'Add a triangle tail on the right.', add: [{ p: [[70, 52], [92, 38], [92, 66]], close: true }] },
      { say: 'Draw a big round eye.', add: [{ c: [32, 48, 4] }, { d: [32, 48, 1.6] }] },
      { say: 'Add a fin on the top and bottom.', add: [{ p: [[46, 36], [54, 27], [59, 38]], close: true }, { p: [[46, 68], [54, 77], [59, 66]], close: true }] },
      { say: 'Give your fish a little smile.', add: [{ a: [28, 54, 6, 5, 80] }] },
      { say: 'Add bubbles and color it in! 🫧', add: [{ c: [18, 40, 2] }, { c: [14, 34, 1.5] }, { c: [20, 29, 1.1] }] }
    ]},
    { name: 'Flower', emoji: '🌸', steps: [
      { say: 'Draw a small circle in the middle.', add: [{ c: [50, 40, 8] }] },
      { say: 'Add six petals around the circle.', add: [{ e: [66, 40, 10, 6, 0] }, { e: [58, 54, 10, 6, 60] }, { e: [42, 54, 10, 6, 120] }, { e: [34, 40, 10, 6, 0] }, { e: [42, 26, 10, 6, 120] }, { e: [58, 26, 10, 6, 60] }] },
      { say: 'Draw a long stem going down.', add: [{ l: [50, 48, 50, 84] }] },
      { say: 'Add two leaves on the stem.', add: [{ e: [40, 64, 9, 5, -30] }, { e: [60, 70, 9, 5, 30] }] },
      { say: 'Color your flower! 🌈', add: [] }
    ]},
    { name: 'House', emoji: '🏠', steps: [
      { say: 'Draw a square for the walls.', add: [{ p: [[28, 50], [72, 50], [72, 84], [28, 84]], close: true }] },
      { say: 'Add a triangle roof on top.', add: [{ p: [[24, 50], [50, 28], [76, 50]], close: true }] },
      { say: 'Draw a door.', add: [{ p: [[44, 84], [44, 66], [56, 66], [56, 84]], close: false }] },
      { say: 'Add two windows.', add: [{ p: [[32, 58], [40, 58], [40, 66], [32, 66]], close: true }, { p: [[60, 58], [68, 58], [68, 66], [60, 66]], close: true }] },
      { say: 'Draw a sun and the ground.', add: [{ c: [84, 18, 6] }, { l: [8, 84, 92, 84] }] },
      { say: 'Color your house! 🎨', add: [] }
    ]},
    { name: 'Sun', emoji: '☀️', steps: [
      { say: 'Draw a circle in the middle.', add: [{ c: [50, 50, 20] }] },
      { say: 'Add rays pointing out all around.', add: [{ l: [50, 26, 50, 14] }, { l: [67, 33, 76, 24] }, { l: [74, 50, 88, 50] }, { l: [67, 67, 76, 76] }, { l: [50, 74, 50, 88] }, { l: [33, 67, 24, 76] }, { l: [26, 50, 12, 50] }, { l: [33, 33, 24, 24] }] },
      { say: 'Give the sun a happy face.', add: [{ d: [43, 47, 2.5] }, { d: [57, 47, 2.5] }, { a: [50, 52, 8, 20, 160] }] },
      { say: 'Color it bright yellow and orange! 🌞', add: [] }
    ]},
    { name: 'Rocket', emoji: '🚀', steps: [
      { say: 'Draw a tall oval for the body.', add: [{ e: [50, 48, 13, 28, 0] }] },
      { say: 'Add a pointy nose cone on top.', add: [{ p: [[37, 28], [50, 6], [63, 28]], close: true }] },
      { say: 'Draw a fin on each bottom side.', add: [{ p: [[37, 60], [24, 80], [37, 74]], close: true }, { p: [[63, 60], [76, 80], [63, 74]], close: true }] },
      { say: 'Add a round window.', add: [{ c: [50, 38, 7] }] },
      { say: 'Draw flames shooting out the bottom.', add: [{ p: [[40, 76], [44, 92], [50, 80], [56, 92], [60, 76]], close: false }] },
      { say: 'Color your rocket and add stars! ⭐', add: [{ d: [16, 22, 1.4] }, { d: [84, 30, 1.4] }, { d: [22, 60, 1.2] }] }
    ]},
    { name: 'Butterfly', emoji: '🦋', steps: [
      { say: 'Draw a long thin body down the middle.', add: [{ e: [50, 52, 3.5, 20, 0] }] },
      { say: 'Add two big wings on top.', add: [{ e: [35, 40, 14, 12, -20] }, { e: [65, 40, 14, 12, 20] }] },
      { say: 'Add two smaller wings on the bottom.', add: [{ e: [38, 64, 10, 10, 20] }, { e: [62, 64, 10, 10, -20] }] },
      { say: 'Draw two antennae with dots on top.', add: [{ l: [48, 33, 42, 22] }, { l: [52, 33, 58, 22] }, { d: [42, 21, 1.6] }, { d: [58, 21, 1.6] }] },
      { say: 'Add spots and color the wings! 🎨', add: [{ c: [35, 40, 3 ] }, { c: [65, 40, 3] }, { c: [38, 64, 2] }, { c: [62, 64, 2] }] }
    ]},
    { name: 'Snowman', emoji: '⛄', steps: [
      { say: 'Draw a big circle near the bottom.', add: [{ c: [50, 74, 17] }] },
      { say: 'Add a medium circle for the tummy.', add: [{ c: [50, 50, 12] }] },
      { say: 'Add a small circle for the head.', add: [{ c: [50, 30, 9] }] },
      { say: 'Draw eyes, a carrot nose, and buttons.', add: [{ d: [47, 28, 1.6] }, { d: [53, 28, 1.6] }, { p: [[50, 30], [58, 31], [50, 33]], close: true }, { d: [50, 46, 1.6] }, { d: [50, 52, 1.6] }] },
      { say: 'Add stick arms and a top hat.', add: [{ l: [38, 48, 22, 40] }, { l: [62, 48, 78, 40] }, { p: [[43, 22], [57, 22], [57, 12], [43, 12]], close: true }, { l: [40, 22, 60, 22] }] },
      { say: 'Color it in! ❄️', add: [] }
    ]},
    { name: 'Ice Cream', emoji: '🍦', steps: [
      { say: 'Draw a triangle cone pointing down.', add: [{ p: [[38, 50], [62, 50], [50, 88]], close: true }] },
      { say: 'Add a big scoop on top.', add: [{ c: [50, 42, 15] }] },
      { say: 'Add a second scoop!', add: [{ c: [50, 28, 12] }] },
      { say: 'Put a cherry on top.', add: [{ c: [50, 16, 4] }, { l: [50, 12, 54, 7] }] },
      { say: 'Add waffle lines on the cone and color it! 🍒', add: [{ l: [43, 58, 50, 55] }, { l: [50, 66, 57, 62] }, { l: [45, 70, 55, 66] }] }
    ]}
  ],

  // Trace It shapes are generated in code; this just names and orders them.
  TRACE: [
    { key: 'circle',   name: 'Circle',    emoji: '⭕' },
    { key: 'square',   name: 'Square',    emoji: '⬜' },
    { key: 'triangle', name: 'Triangle',  emoji: '🔺' },
    { key: 'wave',     name: 'Wavy line', emoji: '〰️' },
    { key: 'zigzag',   name: 'Zig-zag',   emoji: '⚡' },
    { key: 'star',     name: 'Star',      emoji: '⭐' },
    { key: 'spiral',   name: 'Spiral',    emoji: '🌀' },
    { key: 'heart',    name: 'Heart',     emoji: '❤️' }
  ],

  // Studio creative prompts.
  PROMPTS: [
    'a robot chef cooking dinner', 'a dragon eating ice cream', 'your dream treehouse',
    'a monster made of candy', 'an underwater city', 'a superhero pet',
    'a spaceship for your whole family', 'a silly hat-making machine',
    'a dinosaur riding a skateboard', 'a castle in the clouds',
    'the coolest sneaker ever', 'an alien’s favorite snack',
    'a cat who is also a wizard', 'a race car of the future',
    'a jungle full of tiny creatures', 'a snowman on vacation',
    'a pizza planet', 'your own video-game character',
    'a friendly sea monster', 'a garden that grows toys',
    'a bird building a wild nest', 'a bug wearing a backpack',
    'a house on top of a whale', 'a machine that makes rainbows'
  ],

  // Art Words reference (short, kid-friendly).
  TERMS: [
    { term: 'Line', def: 'A mark that connects two points — straight, curvy, zig-zag, or wavy. Lines are the start of every drawing.' },
    { term: 'Shape', def: 'A flat, closed area like a circle, square, or triangle. Big drawings are built from simple shapes.' },
    { term: 'Form', def: 'A shape that looks 3-D, like a ball or a box, usually made to look solid with shading.' },
    { term: 'Outline', def: 'The line around the outside edge of a shape or object.' },
    { term: 'Contour', def: 'A line that follows the edges and curves of an object, inside and out.' },
    { term: 'Proportion', def: 'How big or small the parts of a drawing are compared to each other — like a head compared to a body.' },
    { term: 'Symmetry', def: 'When two sides match, like a butterfly’s wings or a face. Fold it in half and both sides line up.' },
    { term: 'Shading', def: 'Making parts darker or lighter to show where light hits and where shadows fall.' },
    { term: 'Highlight', def: 'The brightest spot, where the most light hits an object.' },
    { term: 'Shadow', def: 'The dark area where light is blocked.' },
    { term: 'Value', def: 'How light or dark something is, from white to black.' },
    { term: 'Texture', def: 'How something would feel if you touched it — rough, smooth, fluffy, bumpy — shown with marks.' },
    { term: 'Horizon line', def: 'The line where the sky seems to meet the ground or sea. Everything lines up around it.' },
    { term: 'Perspective', def: 'A way of drawing so far-away things look smaller and close things look bigger.' },
    { term: 'Foreground', def: 'The part of a picture that feels closest to you.' },
    { term: 'Background', def: 'The part of a picture that feels farthest away.' },
    { term: 'Primary colors', def: 'Red, yellow, and blue — the colors you mix to make all the others.' },
    { term: 'Secondary colors', def: 'Orange, green, and purple — made by mixing two primary colors.' },
    { term: 'Warm colors', def: 'Reds, oranges, and yellows — they feel warm, like fire or the sun.' },
    { term: 'Cool colors', def: 'Blues, greens, and purples — they feel cool, like water or ice.' },
    { term: 'Composition', def: 'How you arrange everything on the page to make a picture look balanced and interesting.' },
    { term: 'Sketch', def: 'A quick, rough drawing you make to plan before adding details.' }
  ],

  TEACHER: {
    learn: {
      how: 'Pick something to draw. A blue guide shape appears each step — copy it onto your canvas, then tap “Next step ▶”. When you’re done, tap Save to keep your art.',
      point: 'Teach drawing the way artists really work: build any object from a few simple shapes, one step at a time.',
      learn: 'That hard-looking drawings are just circles, ovals, triangles, and lines put together in order — and that anyone can learn to draw.',
      explore: 'Try drawing the same thing again from memory with the guide turned off. Then invent your own step-by-step for something new.'
    },
    trace: {
      how: 'A dotted shape appears. Trace right on top of the dots with your finger or mouse, then tap “Check ✓” to see how smooth your line was. Try for 3 stars!',
      point: 'Build the hand control and steady lines that every drawing depends on — the “handwriting” of art.',
      learn: 'Control over curves, corners, and long smooth strokes, which makes every other drawing easier.',
      explore: 'Try tracing with your other hand, or slower, or in one single stroke without lifting. Which shape is hardest?'
    },
    studio: {
      how: 'Free draw! Pick colors and brush sizes, erase, undo, or clear. Tap “🎲 Prompt” for an idea, or start the timer for a speed-draw challenge. Save your work when you’re happy.',
      point: 'Give kids an open, pressure-free space to create, experiment, and follow their own imagination.',
      learn: 'Creative confidence — how to plan a picture, choose colors, fix mistakes, and finish a piece of their own.',
      explore: 'Do a 60-second speed-draw of a prompt, then a slow careful version of the same idea. How are they different?'
    }
  }
};
