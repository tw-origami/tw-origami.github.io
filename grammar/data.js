// Grammar Gym data.
// POS_ITEMS: tag the *highlighted* word (delimited by *asterisks*) with its part of speech.
// FIX_ITEMS: spot the mistake in `wrong`; `fixed` shows the correction with *changes* marked.
window.GRAMMAR = {
  POS_LABEL: {
    noun: 'Noun', verb: 'Verb', adjective: 'Adjective', adverb: 'Adverb',
    pronoun: 'Pronoun', preposition: 'Preposition', conjunction: 'Conjunction'
  },
  POS_INFO: {
    noun: 'A noun names a person, place, thing, or idea.',
    verb: 'A verb shows an action or a state of being.',
    adjective: 'An adjective describes a noun — which one, what kind, or how many.',
    adverb: 'An adverb describes a verb, adjective, or other adverb (often ends in -ly).',
    pronoun: 'A pronoun takes the place of a noun (he, she, it, they, everyone).',
    preposition: 'A preposition shows position or direction (in, on, under, across).',
    conjunction: 'A conjunction joins words, phrases, or ideas (and, but, or, because).'
  },
  // The six mistake types used for the "what's wrong?" choices.
  FIX_TYPES: ['Comma', 'Capitalization', 'Run-on', 'Subject–verb agreement', 'Apostrophe', 'Spelling'],

  POS_ITEMS: [
    // nouns
    { s: 'The *dog* barked at the mailman.', pos: 'noun' },
    { s: 'My *sister* loves to paint.', pos: 'noun' },
    { s: 'We visited the *museum* on Friday.', pos: 'noun' },
    { s: 'A loud *thunder* scared the cat.', pos: 'noun' },
    { s: '*Happiness* is a warm blanket.', pos: 'noun' },
    { s: 'The whole *team* won the trophy.', pos: 'noun' },
    { s: 'She poured juice into the *glass*.', pos: 'noun' },
    { s: '*Chicago* is a very big city.', pos: 'noun' },
    // verbs
    { s: 'The children *run* in the park.', pos: 'verb' },
    { s: 'He *kicked* the ball hard.', pos: 'verb' },
    { s: 'They *are* very tired today.', pos: 'verb' },
    { s: 'I *believe* in you.', pos: 'verb' },
    { s: 'The engine *roared* to life.', pos: 'verb' },
    { s: 'We *travel* every summer.', pos: 'verb' },
    { s: 'She *sings* beautifully.', pos: 'verb' },
    { s: 'The dough *rises* in the oven.', pos: 'verb' },
    // adjectives
    { s: 'The *red* balloon floated away.', pos: 'adjective' },
    { s: 'She has a *curious* mind.', pos: 'adjective' },
    { s: 'That was a *delicious* meal.', pos: 'adjective' },
    { s: 'The *tall* giraffe reached the leaves.', pos: 'adjective' },
    { s: 'We hiked up a *steep* hill.', pos: 'adjective' },
    { s: 'He told a *funny* joke.', pos: 'adjective' },
    { s: 'The *ancient* castle stood on the hill.', pos: 'adjective' },
    // adverbs
    { s: 'She sang *loudly*.', pos: 'adverb' },
    { s: 'He ran *quickly* to the bus.', pos: 'adverb' },
    { s: 'They waited *patiently*.', pos: 'adverb' },
    { s: 'The turtle moved *slowly*.', pos: 'adverb' },
    { s: 'We *often* visit grandma.', pos: 'adverb' },
    { s: 'She spoke *softly* to the baby.', pos: 'adverb' },
    { s: 'Please knock *gently*.', pos: 'adverb' },
    // pronouns
    { s: '*She* found the missing key.', pos: 'pronoun' },
    { s: 'Give the book to *them*.', pos: 'pronoun' },
    { s: '*Everyone* enjoyed the show.', pos: 'pronoun' },
    { s: 'This gift is for *you*.', pos: 'pronoun' },
    // prepositions
    { s: 'The cat hid *under* the bed.', pos: 'preposition' },
    { s: 'We walked *across* the bridge.', pos: 'preposition' },
    { s: 'The keys are *in* the drawer.', pos: 'preposition' },
    { s: 'She sat *beside* her friend.', pos: 'preposition' },
    // conjunctions
    { s: 'I wanted to go, *but* it rained.', pos: 'conjunction' },
    { s: 'We can have pizza *or* pasta.', pos: 'conjunction' },
    { s: 'He is smart *and* kind.', pos: 'conjunction' },
    { s: 'She smiled *because* she was happy.', pos: 'conjunction' }
  ],

  FIX_ITEMS: [
    // Capitalization
    { wrong: 'we are going to florida in march.', fixed: '*We* are going to *Florida* in *March*.', type: 'Capitalization', why: 'Start a sentence with a capital, and capitalize the names of places and months.' },
    { wrong: 'my friend sam speaks french.', fixed: '*My* friend *Sam* speaks *French*.', type: 'Capitalization', why: "Capitalize the first word, people's names, and languages." },
    { wrong: 'on monday we visited chicago.', fixed: '*On* *Monday* we visited *Chicago*.', type: 'Capitalization', why: 'Capitalize the first word, days of the week, and place names.' },
    { wrong: 'i read a book about ancient egypt.', fixed: '*I* read a book about ancient *Egypt*.', type: 'Capitalization', why: "Always capitalize 'I' and the names of specific places." },
    { wrong: 'did you see the pacific ocean?', fixed: '*Did* you see the *Pacific* *Ocean*?', type: 'Capitalization', why: 'Capitalize the first word and proper names like oceans.' },

    // Comma
    { wrong: 'I bought apples oranges and pears.', fixed: 'I bought *apples,* *oranges,* and pears.', type: 'Comma', why: 'Use commas to separate items in a list.' },
    { wrong: 'After the long game we got ice cream.', fixed: 'After the long *game,* we got ice cream.', type: 'Comma', why: 'Use a comma after an introductory phrase.' },
    { wrong: 'Yes I would love to come.', fixed: '*Yes,* I would love to come.', type: 'Comma', why: "Use a comma after an introductory word like 'yes' or 'well.'" },
    { wrong: 'We packed sandwiches chips and juice.', fixed: 'We packed *sandwiches,* *chips,* and juice.', type: 'Comma', why: 'Separate three or more items with commas.' },
    { wrong: 'Well I guess we can try.', fixed: '*Well,* I guess we can try.', type: 'Comma', why: 'Put a comma after an opening word like "well."' },

    // Run-on
    { wrong: 'I was tired I went to bed.', fixed: 'I was tired*, so* I went to bed.', type: 'Run-on', why: "Two complete thoughts need a joining word (like 'so') or a period between them." },
    { wrong: 'She likes tea he likes coffee.', fixed: 'She likes tea*, but* he likes coffee.', type: 'Run-on', why: "Join two sentences with a comma and a word like 'but,' or split them." },
    { wrong: 'The bell rang everyone ran outside.', fixed: 'The bell rang*, and* everyone ran outside.', type: 'Run-on', why: "Don't cram two sentences together — join them or separate them." },
    { wrong: 'It started to rain we opened our umbrellas.', fixed: 'It started to rain*, so* we opened our umbrellas.', type: 'Run-on', why: 'Two complete ideas need proper joining.' },
    { wrong: 'The movie was long it was fun.', fixed: 'The movie was long*, but* it was fun.', type: 'Run-on', why: 'Use a comma plus a joining word between two full sentences.' },

    // Subject–verb agreement
    { wrong: 'The dogs runs fast.', fixed: 'The dogs *run* fast.', type: 'Subject–verb agreement', why: "A plural subject ('dogs') needs a plural verb ('run')." },
    { wrong: 'She walk to school.', fixed: 'She *walks* to school.', type: 'Subject–verb agreement', why: "A singular subject ('she') needs the -s verb form ('walks')." },
    { wrong: 'My brother play soccer.', fixed: 'My brother *plays* soccer.', type: 'Subject–verb agreement', why: "Singular subject → the verb takes -s ('plays')." },
    { wrong: 'The books is on the table.', fixed: 'The books *are* on the table.', type: 'Subject–verb agreement', why: "Plural subject ('books') takes 'are,' not 'is.'" },
    { wrong: 'There is many stars tonight.', fixed: 'There *are* many stars tonight.', type: 'Subject–verb agreement', why: "'Many stars' is plural, so use 'are.'" },

    // Apostrophe
    { wrong: 'Its a beautiful day.', fixed: "*It's* a beautiful day.", type: 'Apostrophe', why: "'It's' with an apostrophe means 'it is.'" },
    { wrong: 'The dogs bone is buried.', fixed: "The *dog's* bone is buried.", type: 'Apostrophe', why: 'Add an apostrophe to show possession: the bone of the dog.' },
    { wrong: 'We cant find the keys.', fixed: "We *can't* find the keys.", type: 'Apostrophe', why: "Contractions need an apostrophe: can't = cannot." },
    { wrong: 'Thats my favorite song.', fixed: "*That's* my favorite song.", type: 'Apostrophe', why: "That's = that is, so it needs an apostrophe." },
    { wrong: 'Their going to be late.', fixed: "*They're* going to be late.", type: 'Apostrophe', why: "'They're' = they are. ('Their' shows possession.)" },

    // Spelling
    { wrong: 'I recieved a gift.', fixed: 'I *received* a gift.', type: 'Spelling', why: "Remember 'i before e, except after c': received." },
    { wrong: 'She is definately right.', fixed: 'She is *definitely* right.', type: 'Spelling', why: "It's spelled 'definitely' — no 'a' in the middle." },
    { wrong: 'We have seperate rooms.', fixed: 'We have *separate* rooms.', type: 'Spelling', why: "'Separate' has an 'a' in the middle: sep-a-rate." },
    { wrong: 'We will meet tomorow.', fixed: 'We will meet *tomorrow*.', type: 'Spelling', why: "'Tomorrow' has two r's." }
  ]
};
