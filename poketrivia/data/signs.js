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

/* ============================================================
 * Rotating fact signs.
 *
 * The signs above teach the GAME and are shown the first time you visit each
 * post. After that a post draws from this pool instead, so walking back past a
 * sign you already read teaches you something new rather than repeating itself.
 * Dealt bag-style per profile: every fact in a zone comes up before any repeats.
 * ============================================================ */

window.SIGN_FACTS = [
  /* ---------------- Trivia Town (general) ---------------- */
  { id: 'f-hub-1', zone: 'hub', subject: 'general', band: 'A', diff: 'easy',
    fact: 'TOWN NOTICE: A group of fish is called a school. A group of dolphins is a pod.',
    q: 'What do you call a group of dolphins?',
    choices: [{ html: 'A pod', ok: true }, { html: 'A school' }, { html: 'A flock' }, { html: 'A pack' }],
    reveal: 'Dolphins live in pods. Fish swim in schools, birds fly in flocks, wolves run in packs.' },
  { id: 'f-hub-2', zone: 'hub', subject: 'general', band: 'A', diff: 'easy',
    fact: 'TOWN NOTICE: The piano has 88 keys — 52 white and 36 black.',
    q: 'Does a piano have more white keys or more black keys?',
    choices: [{ html: 'More white keys', ok: true }, { html: 'More black keys' },
      { html: 'Exactly the same number' }, { html: 'It depends on the piano' }],
    reveal: '52 white and 36 black, 88 in total. The black ones come in groups of two and three, which is how players find their place without looking.' },
  { id: 'f-hub-3', zone: 'hub', subject: 'general', band: 'B', diff: 'medium',
    fact: 'TOWN NOTICE: Australia is the only country that is also an entire continent.',
    q: 'Which country is also a whole continent?',
    choices: [{ html: 'Australia', ok: true }, { html: 'Greenland' }, { html: 'India' }, { html: 'Iceland' }],
    reveal: 'Australia covers a continent all by itself. Greenland is big but belongs to North America — and to Denmark.' },
  { id: 'f-hub-4', zone: 'hub', subject: 'general', band: 'A', diff: 'easy',
    fact: 'TOWN NOTICE: The person who stands at the front of an orchestra and keeps everyone together is the conductor.',
    q: 'Who directs an orchestra?',
    choices: [{ html: 'The conductor', ok: true }, { html: 'The drummer' },
      { html: 'The captain' }, { html: 'The composer' }],
    reveal: 'The conductor sets the speed and the mood with a baton. The composer is the person who WROTE the music — often long ago.' },

  /* ---------------- Number Meadow (math) ---------------- */
  { id: 'f-math-1', zone: 'math', subject: 'math', band: 'A', diff: 'easy',
    fact: 'MEADOW POST: Zero is the only number that is neither positive nor negative.',
    q: 'Is zero positive or negative?',
    choices: [{ html: 'Neither', ok: true }, { html: 'Positive' }, { html: 'Negative' }, { html: 'Both at once' }],
    reveal: 'Zero sits exactly in the middle of the number line. It is the only number that is neither above nor below nothing.' },
  { id: 'f-math-2', zone: 'math', subject: 'math', band: 'A', diff: 'easy',
    fact: 'MEADOW POST: Any number multiplied by zero is zero. Always. No exceptions.',
    q: 'What is 4,829 × 0?',
    choices: [{ html: '0', ok: true }, { html: '4,829' }, { html: '1' }, { html: '48,290' }],
    reveal: 'Zero groups of anything is nothing at all — so anything times zero is zero, however big the number.' },
  { id: 'f-math-3', zone: 'math', subject: 'math', band: 'B', diff: 'medium',
    fact: 'MEADOW POST: A prime number has exactly two factors — itself and 1. That is why 1 is NOT prime.',
    q: 'Why is 1 not a prime number?',
    choices: [{ html: 'It has only one factor, not two', ok: true },
      { html: 'It is too small' }, { html: 'It is an odd number' }, { html: 'It actually is prime' }],
    reveal: 'A prime needs exactly two different factors. 1 only has one (itself), so it misses the rule. The smallest prime is 2 — and it is the only even one.' },
  { id: 'f-math-4', zone: 'math', subject: 'math', band: 'B', diff: 'medium',
    fact: 'MEADOW POST: The angles inside any triangle always add up to 180 degrees.',
    q: 'A triangle has angles of 90° and 45°. What is the third angle?',
    choices: [{ html: '45°', ok: true }, { html: '90°' }, { html: '135°' }, { html: '30°' }],
    reveal: '180 − 90 − 45 = 45. Every triangle\'s angles total 180°, no matter its shape or size.' },

  /* ---------------- Ember Volcano (science) ---------------- */
  { id: 'f-sci-1', zone: 'science', subject: 'science', band: 'A', diff: 'easy',
    fact: 'VOLCANO SIGN: Melted rock is called MAGMA while it is underground, and LAVA once it reaches the surface.',
    q: 'What is melted rock called while it is still underground?',
    choices: [{ html: 'Magma', ok: true }, { html: 'Lava' }, { html: 'Ash' }, { html: 'Obsidian' }],
    reveal: 'Same hot rock, two names. Underground it is magma; the moment it pours out it becomes lava.' },
  { id: 'f-sci-2', zone: 'science', subject: 'science', band: 'B', diff: 'medium',
    fact: 'VOLCANO SIGN: Earth\'s surface is made of giant slabs of rock called tectonic plates. Volcanoes grow where they meet.',
    q: 'What are the giant moving slabs of Earth\'s surface called?',
    choices: [{ html: 'Tectonic plates', ok: true }, { html: 'Lava shelves' },
      { html: 'Crust sheets', }, { html: 'Bedrock blocks' }],
    reveal: 'Tectonic plates drift about as fast as your fingernails grow. Where they collide or pull apart you get earthquakes, volcanoes and mountains.' },
  { id: 'f-sci-3', zone: 'science', subject: 'science', band: 'A', diff: 'easy',
    fact: 'VOLCANO SIGN: Light travels about a million times faster than sound.',
    q: 'Why do you see lightning before you hear thunder?',
    choices: [{ html: 'Light travels much faster than sound', ok: true },
      { html: 'Thunder happens a moment later' }, { html: 'Your eyes work faster than your ears' },
      { html: 'Sound cannot travel through clouds' }],
    reveal: 'They happen at the same instant. Light reaches you almost immediately; sound crawls along at about 1 mile every 5 seconds — so counting the gap tells you how far away the storm is.' },
  { id: 'f-sci-4', zone: 'science', subject: 'science', band: 'B', diff: 'medium',
    fact: 'VOLCANO SIGN: Plants breathe in carbon dioxide and breathe out oxygen — the opposite of us.',
    q: 'Which gas do plants take IN from the air?',
    choices: [{ html: 'Carbon dioxide', ok: true }, { html: 'Oxygen' }, { html: 'Helium' }, { html: 'Nitrogen' }],
    reveal: 'Plants take in carbon dioxide and release oxygen. That swap is why forests are called the lungs of the planet.' },

  /* ---------------- Ancient Ruins (history) ---------------- */
  { id: 'f-hist-1', zone: 'history', subject: 'history', band: 'A', diff: 'easy',
    fact: 'CARVED STONE: The Great Pyramids were built by Egyptian workers about 4,500 years ago.',
    q: 'Who built the Great Pyramids?',
    choices: [{ html: 'The Egyptians', ok: true }, { html: 'The Romans' },
      { html: 'The Greeks' }, { html: 'The Aztecs' }],
    reveal: 'Egyptian workers built them as tombs for pharaohs. The Great Pyramid stayed the tallest building on Earth for nearly 4,000 years.' },
  { id: 'f-hist-2', zone: 'history', subject: 'history', band: 'B', diff: 'medium',
    fact: 'CARVED STONE: Before the printing press, every single book was copied out by hand.',
    q: 'What did Johannes Gutenberg invent that let ordinary people own books?',
    choices: [{ html: 'The printing press', ok: true }, { html: 'Paper' },
      { html: 'The pencil', }, { html: 'The alphabet' }],
    reveal: 'Gutenberg\'s press, around 1440, meant a book could be made in hours instead of months — and ideas began to travel faster than ever before.' },
  { id: 'f-hist-3', zone: 'history', subject: 'history', band: 'B', diff: 'medium',
    fact: 'CARVED STONE: The Declaration of Independence came in 1776. The Constitution followed eleven years later.',
    q: 'Which came first — the Declaration of Independence or the Constitution?',
    choices: [{ html: 'The Declaration of Independence', ok: true }, { html: 'The Constitution' },
      { html: 'They were signed the same day' }, { html: 'The Constitution, by 50 years' }],
    reveal: 'The Declaration (1776) announced independence. The Constitution (1787) built the government that followed it.' },
  { id: 'f-hist-4', zone: 'history', subject: 'history', band: 'A', diff: 'easy',
    fact: 'CARVED STONE: The 13 stripes on the American flag stand for the original 13 colonies.',
    q: 'How many stripes are on the American flag?',
    choices: [{ html: '13', ok: true }, { html: '50' }, { html: '7' }, { html: '26' }],
    reveal: '13 stripes for the 13 original colonies, and 50 stars for the 50 states today.' },

  /* ---------------- Word Grove (grammar) ---------------- */
  { id: 'f-gram-1', zone: 'grammar', subject: 'grammar', band: 'A', diff: 'easy',
    fact: 'GROVE MARKER: A, E, I, O and U are vowels. Every other letter is a consonant.',
    q: 'What do we call the letters A, E, I, O and U?',
    choices: [{ html: 'Vowels', ok: true }, { html: 'Consonants' },
      { html: 'Syllables' }, { html: 'Capitals' }],
    reveal: 'Five vowels, twenty-one consonants. Almost every English word needs at least one vowel to be sayable.' },
  { id: 'f-gram-2', zone: 'grammar', subject: 'grammar', band: 'B', diff: 'medium',
    fact: 'GROVE MARKER: A palindrome reads the same forward and backward — like "racecar" or "Madam, I\'m Adam".',
    q: 'Which of these is a palindrome?',
    choices: [{ html: 'level', ok: true }, { html: 'listen' }, { html: 'forest' }, { html: 'garden' }],
    reveal: '"level" reads the same both ways. So do racecar, noon and kayak.' },
  { id: 'f-gram-3', zone: 'grammar', subject: 'grammar', band: 'B', diff: 'medium',
    fact: 'GROVE MARKER: The root "saur" means lizard. That is why dinosaur means "terrible lizard".',
    q: 'The word root "saur" means what?',
    choices: [{ html: 'Lizard', ok: true }, { html: 'Terrible' }, { html: 'Giant' }, { html: 'Ancient' }],
    reveal: 'From the Greek sauros. Dinosaur = terrible lizard, tyrannosaur = tyrant lizard — and Bulbasaur = bulb lizard!' },
  { id: 'f-gram-4', zone: 'grammar', subject: 'grammar', band: 'A', diff: 'easy',
    fact: 'GROVE MARKER: A noun names a person, place or thing. A verb is what they DO.',
    q: 'In "The Pikachu ran quickly", which word is the verb?',
    choices: [{ html: 'ran', ok: true }, { html: 'Pikachu' }, { html: 'quickly' }, { html: 'The' }],
    reveal: '"ran" is the action, so it is the verb. "Pikachu" is the noun and "quickly" is an adverb describing HOW it ran.' },

  /* ---------------- Sunny Shores (general) ---------------- */
  { id: 'f-shore-1', zone: 'shores', subject: 'general', band: 'A', diff: 'easy',
    fact: 'BEACH SIGN: You cannot drink sea water. The salt actually makes your body lose water.',
    q: 'Why can\'t people drink ocean water?',
    choices: [{ html: 'The salt makes you lose water', ok: true }, { html: 'It is too cold' },
      { html: 'There are too many fish in it' }, { html: 'You can — it is perfectly fine' }],
    reveal: 'Your body has to use its own water to flush out all that salt, so drinking sea water leaves you thirstier than before.' },
  { id: 'f-shore-2', zone: 'shores', subject: 'general', band: 'A', diff: 'easy',
    fact: 'BEACH SIGN: About 70% of the Earth is covered by ocean. From space it looks blue.',
    q: 'Roughly how much of Earth is covered by ocean?',
    choices: [{ html: 'About 70%', ok: true }, { html: 'About 20%' },
      { html: 'About 40%' }, { html: 'Almost all of it' }],
    reveal: 'Around 70%. There is far more ocean than land — and most of it has never been explored.' },
  { id: 'f-shore-3', zone: 'shores', subject: 'science', band: 'B', diff: 'medium',
    fact: 'BEACH SIGN: The whale shark is the biggest FISH in the world — but the blue whale is the biggest animal.',
    q: 'What is the largest fish in the world?',
    choices: [{ html: 'The whale shark', ok: true }, { html: 'The blue whale' },
      { html: 'The great white shark' }, { html: 'The giant squid' }],
    reveal: 'The whale shark is a fish despite its name. The blue whale is bigger overall — but it is a mammal, so it does not count as a fish.' },
  { id: 'f-shore-4', zone: 'shores', subject: 'science', band: 'B', diff: 'hard',
    fact: 'BEACH SIGN: The deepest place in the ocean is the Challenger Deep — nearly 7 miles down.',
    q: 'If you dropped Mount Everest into the deepest part of the ocean, what would happen?',
    choices: [{ html: 'It would sink completely out of sight', ok: true },
      { html: 'Its peak would stick out above the water' },
      { html: 'It would exactly reach the surface' },
      { html: 'It would float' }],
    reveal: 'The Challenger Deep is about 36,000 feet; Everest is about 29,000. The mountain would vanish with more than a mile of water to spare.' },
];
