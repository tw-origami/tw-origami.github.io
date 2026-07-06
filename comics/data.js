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

  // ---- FINISH A COMIC: half the story is written; the kid fills the blanks ----
  // Each panel has drawn `art` (bg + cast + props, rendered by art.js), an
  // optional caption, and bubbles. Bubbles are GIVEN (text) or BLANK (the kid
  // writes it, helped by a hint + an "idea" suggestion).
  FINISH_STORIES: [
    { id: 'ember', title: 'Ember the Dragon', star: { kind: 'dragon', expr: 'happy' },
      panels: [
        { art: { bg: 'grass', cast: [{ kind: 'dragon', expr: 'happy', shirt: '#5fb56b', x: 120, scale: 1.15 }], props: [{ kind: 'cake', x: 205, y: 118, scale: 1.1 }] },
          caption: 'Ember the dragon offered to light the birthday candles.',
          bubbles: [ { who: 'Ember', type: 'speech', text: 'Stand back, everyone — I’ve got this!' } ] },
        { art: { bg: 'grass', cast: [{ kind: 'dragon', expr: 'worried', shirt: '#5fb56b', x: 160, scale: 1.2 }], props: [] },
          sfx: 'POOF!',
          bubbles: [ { who: 'Ember', type: 'thought', blank: true, hint: 'Only smoke came out! How does Ember feel?', idea: 'Oh no… just smoke again. Not one spark!' } ] },
        { art: { bg: 'grass', cast: [{ kind: 'dragon', expr: 'sad', shirt: '#5fb56b', x: 105, scale: 1.05 }, { kind: 'kid', expr: 'happy', shirt: '#60a5fa', x: 215, scale: 1.05, flip: true }], props: [] },
          bubbles: [
            { who: 'Friend', type: 'speech', text: 'Hey, don’t worry about it!' },
            { who: 'Friend', type: 'speech', blank: true, hint: 'How does the friend turn the smoke into something good?', idea: 'Your smoke smells like toasted marshmallows — yum!' }
          ] },
        { art: { bg: 'night', cast: [{ kind: 'dragon', expr: 'happy', shirt: '#5fb56b', x: 110, scale: 1.05 }, { kind: 'kid', expr: 'excited', shirt: '#60a5fa', x: 210, scale: 1.05, flip: true }], props: [{ kind: 'cake', x: 135, y: 120, scale: 0.8 }] },
          caption: { blank: true, hint: 'How does the story end? (This is the last panel!)', idea: 'So they toasted marshmallows in Ember’s smoke — the best party ever.' } }
      ] },

    { id: 'astro', title: 'Astro’s Snack Emergency', star: { kind: 'astro', expr: 'happy' },
      panels: [
        { art: { bg: 'space', cast: [{ kind: 'astro', expr: 'mad', shirt: '#f97316', x: 160, scale: 1.2 }], props: [{ kind: 'box', x: 40, y: 120, scale: 0.9 }] },
          caption: 'Far out in space, Astro opened her snack drawer…',
          bubbles: [ { who: 'Astro', type: 'speech', text: 'Empty?! Not a single cookie left!' } ] },
        { art: { bg: 'space', cast: [{ kind: 'alien', expr: 'happy', shirt: '#a78bfa', x: 200, scale: 1.15 }], props: [{ kind: 'cookie', x: 120, y: 96, scale: 0.9 }] },
          bubbles: [ { who: 'Alien', type: 'speech', blank: true, hint: 'A friendly alien floats up holding a cookie. What does it say?', idea: 'Greetings, hungry human! Care for a fresh moon-cookie?' } ] },
        { art: { bg: 'space', cast: [{ kind: 'astro', expr: 'happy', shirt: '#f97316', x: 108, scale: 1.05 }, { kind: 'alien', expr: 'happy', shirt: '#a78bfa', x: 212, scale: 1.05, flip: true }], props: [] },
          bubbles: [ { who: 'Astro', type: 'speech', blank: true, hint: 'What does Astro say back to her new friend?', idea: 'You’re a lifesaver! Want to be snack buddies forever?' } ] },
        { art: { bg: 'space', cast: [{ kind: 'astro', expr: 'happy', shirt: '#f97316', x: 110, scale: 1.05 }, { kind: 'alien', expr: 'happy', shirt: '#a78bfa', x: 205, scale: 1.05, flip: true }], props: [{ kind: 'planet', x: 240, y: 30, scale: 1 }] },
          caption: 'And that’s how Astro made a friend a million miles from home.' }
      ] },

    { id: 'dot', title: 'Detective Dot & the Missing Homework', star: { kind: 'detective', expr: 'sly' },
      panels: [
        { art: { bg: 'room', cast: [{ kind: 'detective', expr: 'neutral', shirt: '#b45309', x: 150, scale: 1.2 }], props: [{ kind: 'magnifier', x: 220, y: 96, scale: 1 }] },
          caption: 'Detective Dot had a brand-new case: the missing math homework.',
          bubbles: [ { who: 'Dot', type: 'speech', text: 'Every clue matters. Let’s look closer…' } ] },
        { art: { bg: 'room', cast: [{ kind: 'detective', expr: 'sly', shirt: '#b45309', x: 105, scale: 1.05 }, { kind: 'dog', expr: 'worried', shirt: '#c8a06a', x: 215, scale: 1, flip: true }], props: [{ kind: 'backpack', x: 150, y: 120, scale: 0.8 }] },
          bubbles: [ { who: 'Dot', type: 'thought', blank: true, hint: 'Dot spots the dog by the backpack. What does she notice?', idea: 'Chew marks… and little paper crumbs. Interesting!' } ] },
        { art: { bg: 'room', cast: [{ kind: 'dog', expr: 'worried', shirt: '#c8a06a', x: 160, scale: 1.2 }], props: [{ kind: 'backpack', x: 40, y: 118, scale: 0.9 }] },
          bubbles: [ { who: 'Dog', type: 'speech', blank: true, hint: 'The guilty dog confesses! What’s its silly excuse?', idea: 'I was just SO hungry for numbers, okay?!' } ] },
        { art: { bg: 'room', cast: [{ kind: 'detective', expr: 'happy', shirt: '#b45309', x: 120, scale: 1.05 }, { kind: 'dog', expr: 'happy', shirt: '#c8a06a', x: 215, scale: 1, flip: true }], props: [] },
          caption: { blank: true, hint: 'How does Dot wrap up the case?', idea: 'Case closed! Dot helped redo the homework — and kept it up high after that.' } }
      ] },

    { id: 'max', title: 'New Kid at Hero School', star: { kind: 'hero', expr: 'happy' },
      panels: [
        { art: { bg: 'school', cast: [{ kind: 'hero', expr: 'worried', shirt: '#ef4444', x: 160, scale: 1.2 }], props: [] },
          caption: 'It was Max’s very first day at Hero School.',
          bubbles: [ { who: 'Max', type: 'thought', blank: true, hint: 'Everyone else can fly or lift cars. How does Max feel?', idea: 'Everyone here is amazing… what if MY power is boring?' } ] },
        { art: { bg: 'school', cast: [{ kind: 'hero', expr: 'worried', shirt: '#ef4444', x: 105, scale: 1.05 }, { kind: 'hero', expr: 'happy', shirt: '#22c55e', x: 215, scale: 1.05, flip: true }], props: [] },
          bubbles: [
            { who: 'Classmate', type: 'speech', text: 'Hi! What’s your superpower?' },
            { who: 'Max', type: 'speech', blank: true, hint: 'What does Max nervously say his power is?', idea: 'Um… I can talk to houseplants?' }
          ] },
        { art: { bg: 'school', cast: [{ kind: 'hero', expr: 'surprised', shirt: '#ef4444', x: 140, scale: 1.15 }], props: [{ kind: 'vine', x: 210, y: 110, scale: 1.2 }] },
          sfx: 'RUMBLE!',
          caption: 'Suddenly, a giant vine wrapped around the whole class!',
          bubbles: [ { who: 'Max', type: 'speech', blank: true, hint: 'Max uses his “boring” plant power to save everyone. What does he say?', idea: 'Leaves — please let my friends go!' } ] },
        { art: { bg: 'school', cast: [{ kind: 'hero', expr: 'happy', shirt: '#ef4444', x: 110, scale: 1.05 }, { kind: 'hero', expr: 'excited', shirt: '#22c55e', x: 210, scale: 1.05, flip: true }], props: [{ kind: 'plant', x: 145, y: 120, scale: 0.8 }] },
          caption: 'Turns out the “boring” power was exactly what they needed. Welcome, Max!' }
      ] },

    { id: 'pixel', title: 'The Cat Who Wanted to Fly', star: { kind: 'cat', expr: 'excited' },
      panels: [
        { art: { bg: 'grass', cast: [{ kind: 'cat', expr: 'neutral', shirt: '#a855f7', x: 130, scale: 1.15 }], props: [{ kind: 'bird', x: 225, y: 40, scale: 0.9 }] },
          caption: 'Pixel the cat watched the birds soar every single day.',
          bubbles: [ { who: 'Pixel', type: 'thought', text: 'One day, I’ll be up there too.' } ] },
        { art: { bg: 'grass', cast: [{ kind: 'cat', expr: 'excited', shirt: '#a855f7', x: 140, scale: 1.15 }], props: [{ kind: 'box', x: 205, y: 120, scale: 0.8 }, { kind: 'umbrella', x: 40, y: 60, scale: 0.9 }] },
          bubbles: [ { who: 'Pixel', type: 'speech', blank: true, hint: 'What wild flying plan does Pixel come up with?', idea: 'A cardboard box plus an umbrella equals WINGS!' } ] },
        { art: { bg: 'night', cast: [{ kind: 'cat', expr: 'surprised', shirt: '#a855f7', x: 160, scale: 1.2 }], props: [] },
          sfx: 'WHOOSH!',
          bubbles: [ { who: 'Pixel', type: 'thought', blank: true, hint: 'Pixel leaps off the fence! What happens?', idea: 'I’m flying! …okay, I’m falling. Still kind of fun!' } ] },
        { art: { bg: 'grass', cast: [{ kind: 'cat', expr: 'happy', shirt: '#a855f7', x: 150, scale: 1.15 }], props: [{ kind: 'star', x: 220, y: 34, scale: 0.7 }] },
          caption: { blank: true, hint: 'What does Pixel learn by the end?', idea: 'Maybe cats can’t fly — but dreaming big is still the best.' } }
      ] }
  ]
};
