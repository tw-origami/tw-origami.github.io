// Trainers on the island. Two route trainers per subject zone, then a Champ who
// guards that zone's badge. Beating all five badges unlocks the Island Champion.
//
// `look` recolours the shared trainer model. `sight` is how far their line of
// sight reaches. Rosters climb with the zone's spawn levels.

window.TRAINERS = [
  /* ---------------- Trivia Town ---------------- */
  { id: 'town-rival', name: 'Ren', title: 'Rival', zone: 'hub',
    x: 4, z: -2, face: 0.4, sight: 6,
    look: { cap: 0x2f6fd0, capDk: 0x214f96, coat: 0xe23b32, coatDk: 0xb02a22, pack: 0x3aa757 },
    // Deliberately one under-levelled Pokémon. This is the tutorial fight, and a
    // kid who gets half the questions wrong still has to be able to win it.
    roster: [{ dex: 19, level: 3 }],
    lines: { start: ['You made it to town! Let\'s see who studied harder.'],
             lose: ['Okay, okay — you know your stuff. Go on ahead!'] } },

  /* ---------------- Number Meadow (math) ---------------- */
  { id: 'math-1', name: 'Tally', title: 'Counter', zone: 'math',
    x: -6, z: -48, face: 3.1, sight: 7,
    look: { cap: 0x3aa757, capDk: 0x287943, coat: 0x2f6fd0 },
    roster: [{ dex: 10, level: 6 }, { dex: 13, level: 7 }],
    lines: { start: ['Numbers never lie. Do you?'], lose: ['You add up better than I do.'] } },

  { id: 'math-2', name: 'Digit', title: 'Estimator', zone: 'math',
    x: 10, z: -66, face: 1.2, sight: 7,
    look: { cap: 0xf0c419, capDk: 0xc79a12, coat: 0x8f5aab },
    roster: [{ dex: 43, level: 8 }, { dex: 69, level: 9 }],
    lines: { start: ['Close is good. Exact is better!'], lose: ['Right on the nose. Every time.'] } },

  { id: 'math-champ', name: 'Sumire', title: 'Meadow Champ', zone: 'math',
    x: 0, z: -84, face: 0, sight: 8, badge: 'math', badgeName: 'Number Badge',
    look: { cap: 0xffffff, capDk: 0xcccccc, coat: 0x1d7a2e, coatDk: 0x145622, pack: 0xf0c419 },
    roster: [{ dex: 25, level: 10 }, { dex: 133, level: 11 }, { dex: 44, level: 12 }],
    lines: { start: ['The meadow tests everyone. Ready?'],
             lose: ['The Number Badge is yours. You earned every point of it.'] } },

  /* ---------------- Ember Volcano (science) ---------------- */
  { id: 'sci-1', name: 'Cinder', title: 'Hiker', zone: 'science',
    x: 54, z: -6, face: -1.2, sight: 7,
    look: { cap: 0xd94f3d, capDk: 0xa8382a, coat: 0x8a6238 },
    roster: [{ dex: 74, level: 9 }, { dex: 66, level: 10 }],
    lines: { start: ['Hot rocks and hard questions up here.'], lose: ['You cooled me right off.'] } },

  { id: 'sci-2', name: 'Bunsen', title: 'Scientist', zone: 'science',
    x: 78, z: -40, face: 0.6, sight: 7,
    look: { cap: 0xffffff, capDk: 0xdddddd, coat: 0xf3e9d2, coatDk: 0xd8cdb2 },
    roster: [{ dex: 81, level: 10 }, { dex: 100, level: 11 }],
    lines: { start: ['Hypothesis: you will lose. Let\'s test it.'], lose: ['Hypothesis rejected. Well done.'] } },

  { id: 'sci-champ', name: 'Vulcan', title: 'Volcano Champ', zone: 'science',
    x: 72, z: -40, face: 0, sight: 8, badge: 'science', badgeName: 'Ember Badge',
    look: { cap: 0xff7a1a, capDk: 0xc75a10, coat: 0x4a4148, coatDk: 0x322c32 },
    roster: [{ dex: 58, level: 13 }, { dex: 78, level: 14 }, { dex: 126, level: 15 }],
    lines: { start: ['The mountain asks the questions. I just deliver them.'],
             lose: ['Take the Ember Badge. You kept your head in the heat.'] } },

  /* ---------------- Ancient Ruins (history) ---------------- */
  { id: 'hist-1', name: 'Sherd', title: 'Digger', zone: 'history',
    x: 34, z: 44, face: 2.4, sight: 7,
    look: { cap: 0xb08347, capDk: 0x8d6835, coat: 0xc6b57f },
    roster: [{ dex: 27, level: 9 }, { dex: 50, level: 10 }],
    lines: { start: ['Everything here has a story. Know any of them?'],
             lose: ['You have done your reading.'] } },

  { id: 'hist-2', name: 'Papyrus', title: 'Scribe', zone: 'history',
    x: 56, z: 72, face: 0.2, sight: 7,
    look: { cap: 0xf3e9d2, capDk: 0xd8cdb2, coat: 0x8f5aab },
    roster: [{ dex: 92, level: 11 }, { dex: 104, level: 12 }],
    lines: { start: ['Primary sources only, please.'], lose: ['I will write this one down.'] } },

  { id: 'hist-champ', name: 'Ozymandia', title: 'Ruins Champ', zone: 'history',
    x: 46, z: 60, face: 3.14, sight: 8, badge: 'history', badgeName: 'Stone Badge',
    look: { cap: 0xd2cbb4, capDk: 0x9a9280, coat: 0x9a8657, coatDk: 0x6f603d },
    roster: [{ dex: 105, level: 14 }, { dex: 95, level: 15 }, { dex: 138, level: 16 }],
    lines: { start: ['These stones outlasted their builders. Will your answers last?'],
             lose: ['The Stone Badge. Carry it further than they carried theirs.'] } },

  /* ---------------- Word Grove (grammar) ---------------- */
  { id: 'gram-1', name: 'Comma', title: 'Reader', zone: 'grammar',
    x: -32, z: 46, face: 3.6, sight: 7,
    look: { cap: 0x53a04a, capDk: 0x3d7a37, coat: 0xe23b32 },
    roster: [{ dex: 46, level: 8 }, { dex: 1, level: 9 }],
    lines: { start: ['Careful. Every word counts in here.'], lose: ['Beautifully put.'] } },

  { id: 'gram-2', name: 'Verba', title: 'Poet', zone: 'grammar',
    x: -58, z: 68, face: 1.0, sight: 7,
    look: { cap: 0x8f5aab, capDk: 0x6d4184, coat: 0x2f6fd0 },
    roster: [{ dex: 63, level: 10 }, { dex: 102, level: 11 }],
    lines: { start: ['A sentence needs a subject and a verb. You need luck.'],
             lose: ['You did not need the luck after all.'] } },

  { id: 'gram-champ', name: 'Lexi', title: 'Grove Champ', zone: 'grammar',
    x: -46, z: 78, face: 0, sight: 8, badge: 'grammar', badgeName: 'Word Badge',
    look: { cap: 0x2f6b39, capDk: 0x1e4a27, coat: 0x4f9e56, coatDk: 0x357040, pack: 0xf0c419 },
    roster: [{ dex: 123, level: 14 }, { dex: 65, level: 15 }, { dex: 3, level: 16 }],
    lines: { start: ['Say what you mean. Then prove you mean it.'],
             lose: ['The Word Badge, well spoken for.'] } },

  /* ---------------- Sunny Shores (general) ---------------- */
  { id: 'shore-1', name: 'Sandy', title: 'Swimmer', zone: 'shores',
    x: -58, z: -14, face: -1.8, sight: 7,
    look: { cap: 0x4fa8d8, capDk: 0x3782ab, coat: 0xf0c419 },
    roster: [{ dex: 129, level: 8 }, { dex: 98, level: 9 }],
    lines: { start: ['Facts wash up here from everywhere.'], lose: ['You know your world.'] } },

  { id: 'shore-2', name: 'Beacon', title: 'Sailor', zone: 'shores',
    x: -84, z: -36, face: 0.8, sight: 7,
    look: { cap: 0xffffff, capDk: 0xcccccc, coat: 0x16306b, coatDk: 0x0d1f47 },
    roster: [{ dex: 120, level: 10 }, { dex: 116, level: 11 }],
    lines: { start: ['Name me something true and I will let you pass.'],
             lose: ['Fair winds to you.'] } },

  { id: 'shore-champ', name: 'Marisol', title: 'Shores Champ', zone: 'shores',
    x: -72, z: -44, face: 0, sight: 8, badge: 'shores', badgeName: 'Sun Badge',
    look: { cap: 0xf0c419, capDk: 0xc79a12, coat: 0x4fa8d8, coatDk: 0x3782ab },
    roster: [{ dex: 131, level: 15 }, { dex: 121, level: 15 }, { dex: 9, level: 17 }],
    lines: { start: ['The whole world drifts past this beach. Show me what you picked up.'],
             lose: ['The Sun Badge is yours. Go be the Champion.'] } },

  /* ---------------- Island Champion (needs all five badges) ---------------- */
  { id: 'island-champ', name: 'Professor Elm-Oak', title: 'Island Champion', zone: 'hub',
    x: 0, z: -26, face: 0, sight: 6, requires: 5,
    badge: 'champion', badgeName: 'Champion Crown',
    look: { cap: 0xf0c419, capDk: 0xc79a12, coat: 0xf3e9d2, coatDk: 0xd8cdb2, pack: 0xe23b32 },
    roster: [{ dex: 6, level: 20 }, { dex: 9, level: 20 }, { dex: 3, level: 20 }, { dex: 143, level: 22 }],
    lines: { start: ['Five badges. Now the real exam — every subject, no warnings.'],
             lose: ['You are the Champion of this island. Nobody handed you a single answer.'] } },
];
