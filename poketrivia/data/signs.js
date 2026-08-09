// Signposts around the island.
//
// Each sign carries BOTH the fact it teaches and the question that fact answers.
// Keeping them in one record is deliberate: if a sign only pointed at an id in
// the generated bank, regenerating that bank would silently break the link and
// the "you'll see this again" promise would quietly stop being true.
//
// Reading a sign primes its question to appear in your next few encounters in
// that zone, and adds the fact to your journal.

window.SIGNS = [
  {
    id: 'town-welcome', zone: 'hub', subject: 'general', band: 'A', diff: 'easy',
    fact: 'Welcome to Trivia Town! Every wild Pokémon out here wants to see how much you know. ' +
          'A harder ball asks a harder question — but it catches far better.',
    q: 'Which Poké Ball asks the hardest question but catches best?',
    choices: [{ html: 'The Ultra Ball', ok: true }, { html: 'The Poké Ball' },
      { html: 'The Great Ball' }, { html: 'They are all the same' }],
    reveal: 'Poké Ball = easy question, Great Ball = medium, Ultra Ball = hard. ' +
      'The harder the question you take on, the better your odds of catching.',
  },
  {
    id: 'math-1', zone: 'math', subject: 'math', band: 'A', diff: 'easy',
    fact: 'NUMBER MEADOW. Typed answers get partial credit for being close — so a good ' +
          'estimate still shakes the ball. Only exact answers lock it.',
    q: 'You type an answer that is very close but not exact. What happens?',
    choices: [{ html: 'The ball still shakes, just not as hard', ok: true },
      { html: 'Nothing at all — close is the same as wrong' },
      { html: 'The Pokémon runs away immediately' },
      { html: 'It counts as fully correct' }],
    reveal: 'Within 5% gives you most of the power, within 15% gives you some. ' +
      'Estimating is a real skill, so it is worth real credit.',
  },
  {
    id: 'math-2', zone: 'math', subject: 'math', band: 'A', diff: 'easy',
    fact: 'Multiplying is just adding the same number over and over. 6 × 4 means six groups of four.',
    q: 'What does 6 × 4 mean?',
    choices: [{ html: 'Six groups of four', ok: true }, { html: 'Six plus four' },
      { html: 'Six take away four' }, { html: 'Six shared between four' }],
    reveal: 'Six groups of four is 4 + 4 + 4 + 4 + 4 + 4 = 24. ' +
      'Six plus four is only 10, which is the most common mix-up.',
  },
  {
    id: 'sci-1', zone: 'science', subject: 'science', band: 'B', diff: 'medium',
    fact: 'EMBER VOLCANO. Melted rock underground is called magma. The moment it pours out ' +
          'onto the surface, we call it lava. Same rock, different address.',
    q: 'What is melted rock called while it is still underground?',
    choices: [{ html: 'Magma', ok: true }, { html: 'Lava' }, { html: 'Ash' }, { html: 'Obsidian' }],
    reveal: 'Underground it is magma; above ground it is lava. Obsidian is what lava becomes ' +
      'when it cools so fast it turns to glass.',
  },
  {
    id: 'sci-2', zone: 'science', subject: 'science', band: 'B', diff: 'medium',
    fact: 'Careful up top — the crater is hot. Heat travels three ways: conduction through ' +
          'touching, convection through moving liquid or gas, and radiation straight through space.',
    q: 'You feel warmth on your face standing near a fire without touching it. Which is that?',
    choices: [{ html: 'Radiation', ok: true }, { html: 'Conduction' },
      { html: 'Convection' }, { html: 'Evaporation' }],
    reveal: 'Radiation carries heat as waves through space — it is also how the Sun warms Earth. ' +
      'Conduction needs contact; convection needs a moving fluid.',
  },
  {
    id: 'hist-1', zone: 'history', subject: 'history', band: 'B', diff: 'medium',
    fact: 'ANCIENT RUINS. People built here long before the town existed. Archaeologists study ' +
          'the objects they left behind to work out how they lived.',
    q: 'What do archaeologists study?',
    choices: [{ html: 'Objects and buildings people left behind', ok: true },
      { html: 'Rocks and how mountains form' }, { html: 'Stars and planets' },
      { html: 'Living animals in the wild' }],
    reveal: 'Archaeology digs up tools, pots, bones and buildings. Geology is rocks, ' +
      'astronomy is space, and biology is living things.',
  },
  {
    id: 'hist-2', zone: 'history', subject: 'history', band: 'B', diff: 'hard',
    fact: 'These columns held up a roof once. Now they hold up stories. A record made at the ' +
          'time by someone who was actually there is called a primary source.',
    q: 'Which of these is a primary source about a battle?',
    choices: [{ html: 'A letter written by a soldier who fought in it', ok: true },
      { html: 'A textbook chapter written a century later' },
      { html: 'A film made about it last year' },
      { html: 'An encyclopedia article summarising it' }],
    reveal: 'Primary sources are made at the time by people involved: letters, photos, diaries, ' +
      'treaties. Everything written later using those is a secondary source.',
  },
  {
    id: 'gram-1', zone: 'grammar', subject: 'grammar', band: 'A', diff: 'easy',
    fact: 'WORD GROVE. Every complete sentence needs two things: a subject (who or what) and ' +
          'a verb (what they do). Everything else is decoration.',
    q: 'Which of these is a complete sentence?',
    choices: [{ html: 'Pikachu ran.', ok: true }, { html: 'Running very fast down the hill.' },
      { html: 'The tall grass near the old stone bridge.' }, { html: 'Because it was raining.' }],
    reveal: '"Pikachu ran." has a subject (Pikachu) and a verb (ran). The others are fragments — ' +
      'they are missing one or the other, no matter how long they are.',
  },
  {
    id: 'gram-2', zone: 'grammar', subject: 'grammar', band: 'B', diff: 'medium',
    fact: 'The Greek root "saur" means lizard. Dinosaur, tyrannosaur, sauropod. Once you know a ' +
          'root, you can read words you have never met before.',
    q: 'The Greek root "saur" means what?',
    choices: [{ html: 'Lizard', ok: true }, { html: 'Giant' }, { html: 'Ancient' }, { html: 'Tooth' }],
    reveal: 'Dinosaur means "terrible lizard", tyrannosaur means "tyrant lizard". ' +
      'Roots let you decode a word the first time you see it.',
  },
  {
    id: 'shore-1', zone: 'shores', subject: 'general', band: 'A', diff: 'easy',
    fact: 'SUNNY SHORES. Trainers wash up here from all over the world — and the Pacific out ' +
          'there is the biggest ocean on Earth, larger than all the land put together.',
    q: 'Which is the largest ocean on Earth?',
    choices: [{ html: 'The Pacific', ok: true }, { html: 'The Atlantic' },
      { html: 'The Indian' }, { html: 'The Arctic' }],
    reveal: 'The Pacific covers about a third of the planet\'s surface. The Arctic is the smallest ' +
      'and the shallowest.',
  },
  {
    id: 'shore-2', zone: 'shores', subject: 'general', band: 'B', diff: 'medium',
    fact: 'Look out past the fog. A map flattens the round Earth, which is why places near the ' +
          'poles look far bigger on a map than they really are.',
    q: 'On most world maps, why does Greenland look about as big as Africa?',
    choices: [{ html: 'Flattening a round Earth stretches places near the poles', ok: true },
      { html: 'Greenland really is that big' }, { html: 'Mapmakers made a mistake' },
      { html: 'Ice makes Greenland grow each year' }],
    reveal: 'Africa is roughly 14 times the size of Greenland. The common Mercator projection ' +
      'stretches high latitudes so that compass directions stay straight.',
  },
];
