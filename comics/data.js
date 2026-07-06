// Comic Studio content: drawing lessons, storytelling teaching, and idea banks.
// The Studio (draw + type in panels) is fully interactive in index.html; this
// file holds the "learn" and "get ideas" material.
window.COMICS = {

  // ---- LEARN TO DRAW: expressions (SVG faces are generated in index.html) ----
  EXPRESSIONS: [
    { mood: 'Happy',     emoji: '😀', tip: 'Curved-up mouth, relaxed eyebrows, bright open eyes.' },
    { mood: 'Sad',       emoji: '😢', tip: 'Mouth curves down, inner eyebrows lift up, eyes droop.' },
    { mood: 'Angry',     emoji: '😠', tip: 'Eyebrows slant DOWN toward the nose — that one change says “mad.”' },
    { mood: 'Surprised', emoji: '😲', tip: 'Wide round eyes, eyebrows way up, mouth is a little “O.”' },
    { mood: 'Worried',   emoji: '😟', tip: 'Eyebrows up in the middle, a small wavy mouth, eyes looking to the side.' },
    { mood: 'Excited',   emoji: '🤩', tip: 'Huge open smile, sparkly wide eyes, eyebrows lifted high.' }
  ],

  // ---- LEARN TO DRAW: build a cartoon face step by step ----
  FACE_STEPS: [
    'Draw a big circle for the head. Don’t worry if it’s not perfect!',
    'Add a light cross: one line down the middle, one across. These are your guides.',
    'Put two eyes ON the sideways line, one on each side of the middle.',
    'Add a small nose where the two lines cross.',
    'Draw the mouth below the nose. A curve up = happy!',
    'Add ears at eye height, then hair on top. You made a face! 🎉'
  ],

  // ---- LEARN TO DRAW: bodies from simple shapes ----
  BODY_STEPS: [
    { key: 'stick',  tip: 'Start with a stick figure to plan the POSE. Lines are quick to fix.' },
    { key: 'shapes', tip: 'Wrap the stick in shapes: a circle head, oval body, tube arms and legs.' },
    { key: 'action', tip: 'For action, bend the pose! A curved “line of action” makes it feel alive.' }
  ],

  // ---- LEARN TO DRAW: quick pro tips ----
  DRAW_TIPS: [
    { icon: '💨', title: 'Speed lines', text: 'Draw straight lines behind a moving character to show they’re FAST.' },
    { icon: '💥', title: 'Impact stars', text: 'A spiky burst behind a hit means POW! Big bursts = big moments.' },
    { icon: '🔍', title: 'Close-up vs. wide', text: 'Zoom in on a face for feelings. Zoom out to show WHERE they are.' },
    { icon: '😀', title: 'Feelings first', text: 'The eyebrows and mouth carry the emotion. Change those, change the mood.' },
    { icon: '✏️', title: 'Light then dark', text: 'Sketch lightly first. Only press hard for the lines you want to keep.' },
    { icon: '🖐️', title: 'Mitten hands', text: 'Hands are hard! Start with a mitten shape, then split off the thumb.' }
  ],

  // ---- TELL STORIES: the Story Spine (fill-in planner) ----
  STORY_SPINE: [
    { label: 'Once there was…',    hint: 'Who is your hero?',            example: 'a shy robot named Bolt' },
    { label: 'Every day…',         hint: 'What was normal for them?',    example: 'he swept the space station floors' },
    { label: 'Until one day…',     hint: 'What changed? (the problem)',  example: 'a warning light started blinking red' },
    { label: 'Because of that…',   hint: 'What did they do?',            example: 'Bolt rolled off to find the leak' },
    { label: 'Until finally…',     hint: 'The big moment!',              example: 'he fixed it just before the air ran out' },
    { label: 'And ever since…',    hint: 'How did things end up?',       example: 'the crew calls Bolt their little hero' }
  ],

  // ---- TELL STORIES: comic storytelling tips ----
  STORY_TIPS: [
    { icon: '🎬', title: 'Show, don’t tell', text: 'Instead of writing “he was scared,” DRAW wide eyes and shaky lines. Pictures do the talking.' },
    { icon: '🗯️', title: 'Speech vs. caption', text: 'Round bubbles are for talking. Square caption boxes are for the narrator (“Later that night…”).' },
    { icon: '⏱️', title: 'Panels = time', text: 'Each panel is a moment. More small panels feel fast; one big panel slows things down for a big beat.' },
    { icon: '🪝', title: 'End on a hook', text: 'Finish a page with a surprise or a question so the reader HAS to turn to the next one.' },
    { icon: '🔊', title: 'Sound effects', text: 'BOOM, CLICK, WHOOSH! Big letters make readers “hear” your comic.' },
    { icon: '💛', title: 'Give them a want', text: 'Every good hero WANTS something. The story is them trying to get it — and what gets in the way.' }
  ],

  // ---- GET IDEAS: the story-spark word banks ----
  IDEAS: {
    character: [
      'a shy robot', 'a brave kid detective', 'a talking cat', 'a clumsy young wizard',
      'a superhero-in-training', 'a space explorer', 'a friendly monster', 'a ninja librarian',
      'a dragon who’s afraid of fire', 'a pair of time-traveling twins', 'a tiny inventor mouse',
      'a ghost who can’t scare anyone', 'a skateboarding grandma', 'an alien exchange student',
      'a knight who’s allergic to metal', 'a mermaid who wants to see snow'
    ],
    trait: [
      'who is super curious', 'who is always hungry', 'who is secretly super strong',
      'who can talk to animals', 'who is incredibly unlucky', 'who never gives up',
      'who is afraid of the dark', 'who tells terrible jokes', 'who collects weird socks',
      'who is the fastest in town', 'who forgets everything', 'who is brand new in town'
    ],
    setting: [
      'in a floating city in the clouds', 'in an underwater school', 'in a haunted candy shop',
      'on a space station diner', 'in a jungle full of robots', 'inside a giant hollow tree',
      'at a middle school for heroes', 'in a library that never ends', 'in a town where it’s always Halloween',
      'on a pirate ship in the sky', 'in a desert made of glass', 'in a tiny village under the floorboards'
    ],
    goal: [
      'wants to find a lost pet', 'wants to win the big tournament', 'wants to save the school',
      'wants to find a hidden treasure', 'wants to make one real friend', 'wants to get home before dark',
      'wants to stop a prank war', 'wants to fix a broken invention', 'wants to prove everyone wrong',
      'wants to deliver a secret message'
    ],
    problem: [
      'but a sneaky rival is one step ahead', 'but they lost the only map', 'but nobody believes them',
      'but a huge storm is rolling in', 'but their powers suddenly stopped working',
      'but the villain is actually their friend', 'but time is running out fast',
      'but the door is locked from the other side', 'but they made a promise they can’t keep',
      'but the lights just went out'
    ],
    twist: [
      'Twist: the “villain” was right all along.', 'Twist: a secret door appears out of nowhere.',
      'Twist: an old enemy offers to help.', 'Twist: the treasure turns out to be fake.',
      'Twist: they had the power the whole time.', 'Twist: the sidekick has been keeping a big secret.',
      'Twist: it leads them right back home.', 'Twist: there are two of them now.'
    ],
    genre: [
      'Mystery 🔍', 'Superhero 🦸', 'Sci-Fi 🚀', 'Fantasy 🐉',
      'Comedy 😂', 'Adventure 🗺️', 'Spooky 👻', 'Slice-of-life 🏡', 'Sports 🏆'
    ]
  },

  // ---- GET IDEAS: quick drawing challenges ----
  CHALLENGES: [
    'Draw your character looking SURPRISED.',
    'Draw the same face happy, then angry.',
    'Draw a hand giving a thumbs up.',
    'Draw someone running with speed lines.',
    'Draw a spooky setting with no people in it.',
    'Draw a close-up of one eye showing fear.',
    'Design a cool logo for your hero.',
    'Draw a giant “POW!” sound effect.',
    'Draw your character from behind.',
    'Draw two characters arguing — no words, just faces.',
    'Draw a tiny thing as if it were HUGE.',
    'Draw the messiest room you can imagine.'
  ],

  // ---- GET IDEAS: hero name generator ----
  NAMES: {
    first: ['Captain', 'Doctor', 'Kid', 'Lady', 'The Amazing', 'Super', 'Professor', 'Major', 'Mighty', 'Sir', 'Madam', 'Agent'],
    last:  ['Thunderbolt', 'Whisper', 'Quantum', 'Nightowl', 'Sparkle', 'Ironpaw', 'Zephyr', 'Comet', 'Shadow', 'Cinder', 'Frost', 'Boomerang', 'Pixel', 'Marvel']
  },
};
