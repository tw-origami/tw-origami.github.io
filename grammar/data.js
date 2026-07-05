// Grammar Gym data. Content sourced from Grade 6 grammar practice material
// (Writer's Choice workbook) plus kid-friendly originals.
// POS_ITEMS: tag the *highlighted* word (delimited by *asterisks*) with its part of speech.
// FIX_ITEMS: spot the mistake in `wrong`; `fixed` shows the correction with *changes* marked.
// PICK_ITEMS: choose the word that correctly completes the sentence (___ is the blank).
// SENT_ITEMS: decide whether the word group is a complete sentence, a fragment, or a run-on.
window.GRAMMAR = {
  POS_LABEL: {
    noun: 'Noun', verb: 'Verb', adjective: 'Adjective', adverb: 'Adverb',
    pronoun: 'Pronoun', preposition: 'Preposition', conjunction: 'Conjunction',
    interjection: 'Interjection'
  },
  POS_INFO: {
    noun: 'A noun names a person, place, thing, or idea.',
    verb: 'A verb shows an action or a state of being.',
    adjective: 'An adjective describes a noun — which one, what kind, or how many.',
    adverb: 'An adverb describes a verb, adjective, or other adverb — how, when, or where (often ends in -ly).',
    pronoun: 'A pronoun takes the place of a noun (he, she, it, they, everyone, theirs).',
    preposition: 'A preposition shows position or direction (in, on, under, across, during).',
    conjunction: 'A conjunction joins words, phrases, or ideas (and, but, or, because).',
    interjection: 'An interjection is a word that shows strong feeling, often with an exclamation mark (wow, hey, ouch).'
  },
  // The mistake types used for the "what's wrong?" choices.
  FIX_TYPES: ['Comma', 'Capitalization', 'Run-on', 'Subject–verb agreement', 'Apostrophe', 'Spelling', 'Wrong word', 'Double negative'],
  FIX_INFO: {
    'Comma': 'A comma (,) marks a small pause — use it between items in a list, after introductory words, in dates and addresses, and before joining words like "and" or "but."',
    'Capitalization': 'Capital letters start every sentence and the names of specific people, places, days, months, holidays, and languages.',
    'Run-on': 'A run-on crams two complete sentences together with nothing joining them. Fix it with a period, or a comma plus a joining word.',
    'Subject–verb agreement': 'The verb must match its subject: a singular subject takes a singular verb (she walks), and a plural subject takes a plural verb (they walk).',
    'Apostrophe': "An apostrophe (') shows ownership (the dog's bone) or stands in for missing letters in a contraction (can't = cannot).",
    'Spelling': 'The word is spelled wrong — watch for tricky letters, silent letters, and sound-alike patterns.',
    'Wrong word': "A word that sounds right but is the wrong one — like their/they're, than/then, to/too, or good/well.",
    'Double negative': "Two negative words in one sentence (don't + nothing) cancel each other out — keep only one negative."
  },
  SENT_INFO: {
    sentence: 'A complete sentence has a subject (who or what) and a predicate (what they do), and expresses a complete thought.',
    fragment: 'A fragment is missing a subject, a predicate, or both — it leaves you hanging.',
    runon: 'A run-on is two or more complete sentences incorrectly written as one.'
  },

  POS_ITEMS: [
    // nouns
    { s: 'The *dog* barked at the mailman.', pos: 'noun' },
    { s: 'My *sister* loves to paint.', pos: 'noun' },
    { s: 'We visited the *museum* on Friday.', pos: 'noun' },
    { s: 'The loud *thunder* scared the cat.', pos: 'noun' },
    { s: '*Happiness* is a warm blanket.', pos: 'noun' },
    { s: 'The whole *team* won the trophy.', pos: 'noun' },
    { s: 'She poured juice into the *glass*.', pos: 'noun' },
    { s: '*Chicago* is a very big city.', pos: 'noun' },
    { s: 'Ginny plays *piano* in a band.', pos: 'noun' },
    { s: 'Her favorite stamp is from *Zimbabwe*.', pos: 'noun' },
    { s: 'The *jungle* grows right up to the water’s edge.', pos: 'noun' },
    // verbs
    { s: 'The children *run* in the park.', pos: 'verb' },
    { s: 'He *kicked* the ball hard.', pos: 'verb' },
    { s: 'They *are* very tired today.', pos: 'verb' },
    { s: 'I *believe* in you.', pos: 'verb' },
    { s: 'The engine *roared* to life.', pos: 'verb' },
    { s: 'We *travel* every summer.', pos: 'verb' },
    { s: 'She *sings* beautifully.', pos: 'verb' },
    { s: 'The dough *rises* in the oven.', pos: 'verb' },
    { s: 'Hamsters *sleep* during the day.', pos: 'verb' },
    { s: 'The cat *caught* the mouse.', pos: 'verb' },
    { s: 'Maria has *missed* the bus.', pos: 'verb' },
    // adjectives
    { s: 'The *red* balloon floated away.', pos: 'adjective' },
    { s: 'She has a *curious* mind.', pos: 'adjective' },
    { s: 'That was a *delicious* meal.', pos: 'adjective' },
    { s: 'The *tall* giraffe reached the leaves.', pos: 'adjective' },
    { s: 'We hiked up a *steep* hill.', pos: 'adjective' },
    { s: 'He told a *funny* joke.', pos: 'adjective' },
    { s: 'The *ancient* castle stood on the hill.', pos: 'adjective' },
    { s: 'Emily avoided the *large* dog.', pos: 'adjective' },
    { s: 'Its bark sounded *ferocious*.', pos: 'adjective' },
    { s: 'Several *exotic* birds live here.', pos: 'adjective' },
    // adverbs
    { s: 'She sang *loudly*.', pos: 'adverb' },
    { s: 'He ran *quickly* to the bus.', pos: 'adverb' },
    { s: 'They waited *patiently*.', pos: 'adverb' },
    { s: 'The turtle moved *slowly*.', pos: 'adverb' },
    { s: 'We *often* visit Grandma.', pos: 'adverb' },
    { s: 'She spoke *softly* to the baby.', pos: 'adverb' },
    { s: 'Please knock *gently*.', pos: 'adverb' },
    { s: 'The class debated *loudly*.', pos: 'adverb' },
    { s: 'I *almost* missed the train.', pos: 'adverb' },
    // pronouns
    { s: '*She* found the missing key.', pos: 'pronoun' },
    { s: 'Give the book to *them*.', pos: 'pronoun' },
    { s: '*Everyone* enjoyed the show.', pos: 'pronoun' },
    { s: 'This gift is for *you*.', pos: 'pronoun' },
    { s: 'Several people claimed the prize was *theirs*.', pos: 'pronoun' },
    { s: 'Give *me* the ball, please.', pos: 'pronoun' },
    { s: '*Both* of the puppies are cute.', pos: 'pronoun' },
    // prepositions
    { s: 'The cat hid *under* the bed.', pos: 'preposition' },
    { s: 'We walked *across* the bridge.', pos: 'preposition' },
    { s: 'The keys are *in* the drawer.', pos: 'preposition' },
    { s: 'She sat *beside* her friend.', pos: 'preposition' },
    { s: 'All the power failed *during* the storm.', pos: 'preposition' },
    { s: 'My brother hid *beneath* his bed.', pos: 'preposition' },
    { s: 'Shadows fell *across* the wall.', pos: 'preposition' },
    // conjunctions
    { s: 'I wanted to go, *but* it rained.', pos: 'conjunction' },
    { s: 'We can have pizza *or* pasta.', pos: 'conjunction' },
    { s: 'He is smart *and* kind.', pos: 'conjunction' },
    { s: 'She smiled *because* she was happy.', pos: 'conjunction' },
    { s: 'Rinji looked for the book, *but* he couldn’t find it.', pos: 'conjunction' },
    { s: 'We can study at school *or* go to the library.', pos: 'conjunction' },
    // interjections
    { s: '*Wow*! That was an amazing catch.', pos: 'interjection' },
    { s: '*Hey*, that bike is mine!', pos: 'interjection' },
    { s: '*Hooray*! We won the game.', pos: 'interjection' },
    { s: '*Ouch*! That really hurt.', pos: 'interjection' }
  ],

  FIX_ITEMS: [
    // Capitalization
    { wrong: 'we are going to florida in march.', fixed: '*We* are going to *Florida* in *March*.', type: 'Capitalization', why: 'Start a sentence with a capital, and capitalize the names of places and months.' },
    { wrong: 'my friend sam speaks french.', fixed: '*My* friend *Sam* speaks *French*.', type: 'Capitalization', why: "Capitalize the first word, people's names, and languages." },
    { wrong: 'on monday we visited chicago.', fixed: '*On* *Monday* we visited *Chicago*.', type: 'Capitalization', why: 'Capitalize the first word, days of the week, and place names.' },
    { wrong: 'i read a book about ancient egypt.', fixed: '*I* read a book about ancient *Egypt*.', type: 'Capitalization', why: "Always capitalize 'I' and the names of specific places." },
    { wrong: 'did you see the pacific ocean?', fixed: '*Did* you see the *Pacific* *Ocean*?', type: 'Capitalization', why: 'Capitalize the first word and proper names like oceans.' },
    { wrong: 'We saw uncle frank at the movies.', fixed: 'We saw *Uncle* *Frank* at the movies.', type: 'Capitalization', why: "Capitalize family words like 'Uncle' when they are used as part of a name." },
    { wrong: 'The book was written by dr. henri engles.', fixed: 'The book was written by *Dr.* *Henri* *Engles*.', type: 'Capitalization', why: "Capitalize a person's name and a title like 'Dr.' that comes before it." },
    { wrong: 'thanksgiving is on a thursday in november.', fixed: '*Thanksgiving* is on a *Thursday* in *November*.', type: 'Capitalization', why: 'Capitalize holidays, days of the week, and months.' },

    // Comma
    { wrong: 'I bought apples oranges and pears.', fixed: 'I bought *apples,* *oranges,* and pears.', type: 'Comma', why: 'Use commas to separate items in a list.' },
    { wrong: 'After the long game we got ice cream.', fixed: 'After the long *game,* we got ice cream.', type: 'Comma', why: 'Use a comma after an introductory phrase.' },
    { wrong: 'Yes I would love to come.', fixed: '*Yes,* I would love to come.', type: 'Comma', why: "Use a comma after an introductory word like 'yes' or 'well.'" },
    { wrong: 'We packed sandwiches chips and juice.', fixed: 'We packed *sandwiches,* *chips,* and juice.', type: 'Comma', why: 'Separate three or more items with commas.' },
    { wrong: 'Well I guess we can try.', fixed: '*Well,* I guess we can try.', type: 'Comma', why: 'Put a comma after an opening word like "well."' },
    { wrong: 'Mary George and Flora rode the bus to school.', fixed: '*Mary,* *George,* and Flora rode the bus to school.', type: 'Comma', why: 'Use commas between names in a list — otherwise it reads like two people, "Mary George" and Flora.' },
    { wrong: 'Will you be coming with us Frank?', fixed: 'Will you be coming with us*, Frank*?', type: 'Comma', why: "Use a comma to set off a person's name when you speak directly to them." },
    { wrong: 'Hiram was born on June 19 1983 in Detroit.', fixed: 'Hiram was born on June 19*, 1983,* in Detroit.', type: 'Comma', why: 'In a full date, put commas before and after the year.' },
    { wrong: 'We moved to Austin Texas last summer.', fixed: 'We moved to Austin*, Texas,* last summer.', type: 'Comma', why: 'Put commas before and after the state when it follows a city.' },
    { wrong: 'Joseph works hard but he also plays soccer.', fixed: 'Joseph works hard*, but* he also plays soccer.', type: 'Comma', why: "Use a comma before 'and,' 'or,' or 'but' when they join two complete sentences." },
    { wrong: 'After Susan called George came home.', fixed: 'After Susan called*, George* came home.', type: 'Comma', why: 'Use a comma to prevent misreading — without it, it sounds like Susan called George!' },

    // Run-on
    { wrong: 'I was tired I went to bed.', fixed: 'I was tired*, so* I went to bed.', type: 'Run-on', why: "Two complete thoughts need a joining word (like 'so') or a period between them." },
    { wrong: 'She likes tea he likes coffee.', fixed: 'She likes tea*, but* he likes coffee.', type: 'Run-on', why: "Join two sentences with a comma and a word like 'but,' or split them." },
    { wrong: 'The bell rang everyone ran outside.', fixed: 'The bell rang*, and* everyone ran outside.', type: 'Run-on', why: "Don't cram two sentences together — join them or separate them." },
    { wrong: 'It started to rain we opened our umbrellas.', fixed: 'It started to rain*, so* we opened our umbrellas.', type: 'Run-on', why: 'Two complete ideas need proper joining.' },
    { wrong: 'The movie was long it was fun.', fixed: 'The movie was long*, but* it was fun.', type: 'Run-on', why: 'Use a comma plus a joining word between two full sentences.' },
    { wrong: 'The rain stopped the sun came out.', fixed: 'The rain stopped*, and* the sun came out.', type: 'Run-on', why: 'Two complete sentences run together need a comma and a joining word.' },
    { wrong: 'I studied hard the test was easy.', fixed: 'I studied hard*, so* the test was easy.', type: 'Run-on', why: "Join two complete thoughts with a comma plus 'so,' or write two sentences." },

    // Subject–verb agreement
    { wrong: 'The dogs runs fast.', fixed: 'The dogs *run* fast.', type: 'Subject–verb agreement', why: "A plural subject ('dogs') needs a plural verb ('run')." },
    { wrong: 'She walk to school.', fixed: 'She *walks* to school.', type: 'Subject–verb agreement', why: "A singular subject ('she') needs the -s verb form ('walks')." },
    { wrong: 'My brother play soccer.', fixed: 'My brother *plays* soccer.', type: 'Subject–verb agreement', why: "Singular subject → the verb takes -s ('plays')." },
    { wrong: 'The books is on the table.', fixed: 'The books *are* on the table.', type: 'Subject–verb agreement', why: "Plural subject ('books') takes 'are,' not 'is.'" },
    { wrong: 'There is many stars tonight.', fixed: 'There *are* many stars tonight.', type: 'Subject–verb agreement', why: "'Many stars' is plural, so use 'are.'" },
    { wrong: 'Each of the crayons have been sharpened.', fixed: 'Each of the crayons *has* been sharpened.', type: 'Subject–verb agreement', why: "The subject is 'each' (singular) — not 'crayons.' Each one HAS been sharpened." },
    { wrong: 'The owls in the forest hunts by night.', fixed: 'The owls in the forest *hunt* by night.', type: 'Subject–verb agreement', why: "The subject is 'owls' (plural), not 'forest.' Don't let the phrase in between fool you." },
    { wrong: 'Both the wind and the dog was howling.', fixed: 'Both the wind and the dog *were* howling.', type: 'Subject–verb agreement', why: "Subjects joined by 'and' make a plural subject, so use 'were.'" },
    { wrong: 'Here is your new books.', fixed: 'Here *are* your new books.', type: 'Subject–verb agreement', why: "The subject is 'books' (plural) — 'here' is never the subject." },

    // Apostrophe
    { wrong: 'Its a beautiful day.', fixed: "*It's* a beautiful day.", type: 'Apostrophe', why: "'It's' with an apostrophe means 'it is.'" },
    { wrong: 'The dogs bone is buried.', fixed: "The *dog's* bone is buried.", type: 'Apostrophe', why: 'Add an apostrophe to show possession: the bone of the dog.' },
    { wrong: 'We cant find the keys.', fixed: "We *can't* find the keys.", type: 'Apostrophe', why: "Contractions need an apostrophe: can't = cannot." },
    { wrong: 'Thats my favorite song.', fixed: "*That's* my favorite song.", type: 'Apostrophe', why: "That's = that is, so it needs an apostrophe." },
    { wrong: 'Youve got only forty-five minutes.', fixed: "*You've* got only forty-five minutes.", type: 'Apostrophe', why: "You've = you have. Contractions need an apostrophe where letters are missing." },
    { wrong: 'The childrens zoo is open today.', fixed: "The *children's* zoo is open today.", type: 'Apostrophe', why: "'Children' is plural but doesn't end in s, so its possessive is children's." },
    { wrong: 'Did you find all the birds nests?', fixed: "Did you find all the *birds'* nests?", type: 'Apostrophe', why: "For a plural noun ending in s, add just an apostrophe: the nests of the birds = birds' nests." },
    { wrong: 'Kevin works in the carpenters shop.', fixed: "Kevin works in the *carpenter's* shop.", type: 'Apostrophe', why: "The shop belongs to the carpenter, so it needs an apostrophe: carpenter's." },

    // Spelling
    { wrong: 'I recieved a gift.', fixed: 'I *received* a gift.', type: 'Spelling', why: "Remember 'i before e, except after c': received." },
    { wrong: 'She is definately right.', fixed: 'She is *definitely* right.', type: 'Spelling', why: "It's spelled 'definitely' — no 'a' in the middle." },
    { wrong: 'We have seperate rooms.', fixed: 'We have *separate* rooms.', type: 'Spelling', why: "'Separate' has an 'a' in the middle: sep-a-rate." },
    { wrong: 'We will meet tomorow.', fixed: 'We will meet *tomorrow*.', type: 'Spelling', why: "'Tomorrow' has two r's." },
    { wrong: 'My freind lives next door.', fixed: 'My *friend* lives next door.', type: 'Spelling', why: "It's f-r-i-e-n-d — a friend to the end." },
    { wrong: 'We went to the libary after school.', fixed: 'We went to the *library* after school.', type: 'Spelling', why: "'Library' has two r's: li-brar-y." },
    { wrong: 'I like chocolate alot.', fixed: 'I like chocolate *a lot*.', type: 'Spelling', why: "'A lot' is always two words." },
    { wrong: 'It happened becuase of the rain.', fixed: 'It happened *because* of the rain.', type: 'Spelling', why: "Remember: big elephants can always understand small elephants — b-e-c-a-u-s-e." },
    { wrong: 'Wich book do you want?', fixed: '*Which* book do you want?', type: 'Spelling', why: "'Which' starts with wh-, like other question words (what, when, where)." },
    { wrong: 'We waited untill noon.', fixed: 'We waited *until* noon.', type: 'Spelling', why: "'Until' has only one l." },
    { wrong: 'Mark your calender for the trip.', fixed: 'Mark your *calendar* for the trip.', type: 'Spelling', why: "'Calendar' ends in -ar, not -er." },
    { wrong: 'The party was a big suprise.', fixed: 'The party was a big *surprise*.', type: 'Spelling', why: "'Surprise' has two r's: sur-prise." },
    { wrong: 'She is probly at practice.', fixed: 'She is *probably* at practice.', type: 'Spelling', why: "'Probably' has three syllables: prob-ab-ly." },
    { wrong: 'I am writting a story.', fixed: 'I am *writing* a story.', type: 'Spelling', why: "'Writing' has one t. (But 'written' has two!)" },
    { wrong: 'He allways wins at checkers.', fixed: 'He *always* wins at checkers.', type: 'Spelling', why: "'Always' has one l — 'all' drops an l when it joins another word." },
    { wrong: 'That was truely amazing.', fixed: 'That was *truly* amazing.', type: 'Spelling', why: "'Truly' drops the e from 'true.'" },
    { wrong: 'My favorite month is Febuary.', fixed: 'My favorite month is *February*.', type: 'Spelling', why: "'February' has a sneaky first r: Feb-ru-ary." },
    { wrong: 'Did you loose your keys?', fixed: 'Did you *lose* your keys?', type: 'Spelling', why: "'Lose' (one o) means to misplace. 'Loose' (two o's) means not tight." },

    // Wrong word
    { wrong: 'Their going to be late.', fixed: "*They're* going to be late.", type: 'Wrong word', why: "'They're' = they are. 'Their' shows possession (their coats)." },
    { wrong: 'Your my best friend.', fixed: "*You're* my best friend.", type: 'Wrong word', why: "'You're' = you are. 'Your' shows possession (your bike)." },
    { wrong: "The dog wagged it's tail.", fixed: 'The dog wagged *its* tail.', type: 'Wrong word', why: "Possessive 'its' has NO apostrophe. 'It's' always means 'it is.'" },
    { wrong: 'We went too the beach.', fixed: 'We went *to* the beach.', type: 'Wrong word', why: "'To' shows direction. 'Too' means 'also' or 'excessively.'" },
    { wrong: 'I ate to many cookies.', fixed: 'I ate *too* many cookies.', type: 'Wrong word', why: "'Too' means 'more than enough.' 'To' shows direction." },
    { wrong: 'I am taller then my brother.', fixed: 'I am taller *than* my brother.', type: 'Wrong word', why: "Use 'than' to compare. 'Then' tells when." },
    { wrong: 'Put the book over their.', fixed: 'Put the book over *there*.', type: 'Wrong word', why: "'There' is a place. 'Their' shows possession. 'They're' = they are." },
    { wrong: 'The team played good today.', fixed: 'The team played *well* today.', type: 'Wrong word', why: "'Well' is the adverb that describes how they played. 'Good' is an adjective." },
    { wrong: 'I could of won the race.', fixed: 'I could *have* won the race.', type: 'Wrong word', why: "It's 'could have' — 'of' just sounds like the contraction 've." },
    { wrong: 'Omar likes every vegetable accept squash.', fixed: 'Omar likes every vegetable *except* squash.', type: 'Wrong word', why: "'Except' means 'other than.' 'Accept' means to receive." },

    // Double negative
    { wrong: "I don't have nothing to read.", fixed: "I don't have *anything* to read.", type: 'Double negative', why: "Two negatives ('don't' + 'nothing') cancel out — use only one negative." },
    { wrong: "Larry isn't never late for school.", fixed: "Larry isn't *ever* late for school.", type: 'Double negative', why: "'Isn't' is already negative, so use 'ever,' not 'never.'" },
    { wrong: "She doesn't want none.", fixed: "She doesn't want *any*.", type: 'Double negative', why: "'Doesn't' is negative, so pair it with 'any,' not 'none.'" },
    { wrong: "We haven't got no clean clothes.", fixed: "We haven't got *any* clean clothes.", type: 'Double negative', why: "Keep just one negative: haven't + any." },
    { wrong: "I don't know nothing about that.", fixed: "I don't know *anything* about that.", type: 'Double negative', why: "One negative is enough: don't + anything." },
    { wrong: "They can't go nowhere tonight.", fixed: "They can't go *anywhere* tonight.", type: 'Double negative', why: "'Can't' is negative, so use 'anywhere,' not 'nowhere.'" }
  ],

  // Pick the word that correctly completes the sentence.
  PICK_ITEMS: [
    // Agreement (subject–verb, including tricky subjects)
    { s: 'Moira always ___ her homework before dinner.', opts: ['finishes', 'finish'], a: 'finishes', cat: 'agree', why: "Singular subject 'Moira' takes the -s verb form." },
    { s: 'The restaurants ___ early on Saturdays.', opts: ['open', 'opens'], a: 'open', cat: 'agree', why: "Plural subject 'restaurants' takes 'open' (no -s)." },
    { s: 'Zimbabwe ___ a country in Africa.', opts: ['is', 'are'], a: 'is', cat: 'agree', why: 'One country → singular verb.' },
    { s: 'Each of the crayons ___ been sharpened.', opts: ['has', 'have'], a: 'has', cat: 'agree', why: "'Each' is singular, even though 'crayons' is plural." },
    { s: 'There ___ three new puppies at the pet store.', opts: ['are', 'is'], a: 'are', cat: 'agree', why: "The subject is 'puppies' (plural) — 'there' is never the subject." },
    { s: 'Here ___ your new books.', opts: ['are', 'is'], a: 'are', cat: 'agree', why: "The subject is 'books,' so the verb is plural." },
    { s: 'The owls in the forest ___ by night.', opts: ['hunt', 'hunts'], a: 'hunt', cat: 'agree', why: "The subject is 'owls,' not 'forest' — don't be fooled by the phrase in between." },
    { s: 'Some of the students ___ extra work to do.', opts: ['have', 'has'], a: 'have', cat: 'agree', why: "'Some of the students' is plural, so use 'have.'" },
    { s: 'John and I ___ my grandmother on Sundays.', opts: ['visit', 'visits'], a: 'visit', cat: 'agree', why: "Subjects joined by 'and' are plural." },
    { s: 'Either the cars or the truck ___ more gas.', opts: ['uses', 'use'], a: 'uses', cat: 'agree', why: "With 'or,' the verb agrees with the closer subject — 'truck' (singular)." },
    { s: 'Neither the cats nor the dog ___ outside last night.', opts: ['was', 'were'], a: 'was', cat: 'agree', why: "With 'nor,' the verb agrees with the closer subject — 'dog' (singular)." },
    { s: 'Both the radio and the television ___ on.', opts: ['were', 'was'], a: 'were', cat: 'agree', why: "'Both … and' makes a plural subject." },

    // Pronouns (subject vs. object; compound; who/whom)
    { s: '___ likes to ride the train.', opts: ['She', 'Her'], a: 'She', cat: 'pronoun', why: "The subject of a sentence needs a subject pronoun: 'She.'" },
    { s: 'Dad helped ___ with our chores.', opts: ['us', 'we'], a: 'us', cat: 'pronoun', why: "The object of the verb needs an object pronoun: 'us.'" },
    { s: 'My uncles wanted to help, but ___ were too tired.', opts: ['they', 'them'], a: 'they', cat: 'pronoun', why: "'They' is the subject of 'were too tired.'" },
    { s: 'The coach told ___ to try harder.', opts: ['them', 'they'], a: 'them', cat: 'pronoun', why: "'Told' needs an object pronoun: 'them.'" },
    { s: 'My brother always walks with Mom and ___.', opts: ['me', 'I'], a: 'me', cat: 'pronoun', why: "After a preposition, use an object pronoun. Test it: 'walks with me,' not 'walks with I.'" },
    { s: 'The librarian beckoned to Cindy and ___.', opts: ['me', 'I'], a: 'me', cat: 'pronoun', why: "Object of 'to' → object pronoun. Try it alone: 'beckoned to me.'" },
    { s: 'The band and ___ rode on the bus.', opts: ['I', 'me'], a: 'I', cat: 'pronoun', why: "Part of the subject → subject pronoun. Test: 'I rode on the bus.'" },
    { s: 'The audience liked the band and ___.', opts: ['me', 'I'], a: 'me', cat: 'pronoun', why: "Object of 'liked' → object pronoun. Test: 'The audience liked me.'" },
    { s: 'Jackson told you about ___?', opts: ['whom', 'who'], a: 'whom', cat: 'pronoun', why: "'Whom' is the object form — it follows the preposition 'about.'" },
    { s: '___ threw the ball?', opts: ['Who', 'Whom'], a: 'Who', cat: 'pronoun', why: "'Who' is the subject form — it does the throwing." },

    // Comparatives & superlatives
    { s: 'Amanda is the ___ runner I know.', opts: ['fastest', 'faster'], a: 'fastest', cat: 'compare', why: 'Use the superlative (-est) to compare more than two.' },
    { s: 'Ronald used to be ___ than Amanda.', opts: ['faster', 'fastest'], a: 'faster', cat: 'compare', why: 'Use the comparative (-er) to compare exactly two.' },
    { s: 'August is the ___ month of the year.', opts: ['warmest', 'warmer'], a: 'warmest', cat: 'compare', why: 'Comparing all twelve months → superlative.' },
    { s: 'This river is ___ than the Mississippi.', opts: ['muddier', 'muddiest'], a: 'muddier', cat: 'compare', why: 'Two rivers → comparative. (Change y to i: muddier.)' },
    { s: 'Good sportsmanship is ___ than winning.', opts: ['more important', 'most important'], a: 'more important', cat: 'compare', why: "Longer adjectives use 'more' for the comparative." },
    { s: 'That test was the ___ of all.', opts: ['most difficult', 'more difficult'], a: 'most difficult', cat: 'compare', why: "'Of all' compares many → superlative with 'most.'" },
    { s: 'A shark swims ___ than a person.', opts: ['faster', 'more faster'], a: 'faster', cat: 'compare', why: "Never combine 'more' with -er. Just 'faster.'" },
    { s: 'Of all my friends, I like you ___.', opts: ['best', 'better'], a: 'best', cat: 'compare', why: "'Of all' means more than two → superlative 'best.'" },
    { s: 'Jane ran ___ than anyone else.', opts: ['farther', 'farthest'], a: 'farther', cat: 'compare', why: "Comparing Jane to each other runner → comparative 'farther.'" },

    // Word choice (articles, good/well, troublesome words)
    { s: 'Ms. Rodriguez is ___ science teacher.', opts: ['a', 'an'], a: 'a', cat: 'word', why: "Use 'a' before a consonant sound: a science teacher." },
    { s: 'She gives ___ exam every week.', opts: ['an', 'a'], a: 'an', cat: 'word', why: "Use 'an' before a vowel sound: an exam." },
    { s: 'I sang ___ last night.', opts: ['poorly', 'poor'], a: 'poorly', cat: 'word', why: "An adverb ('poorly') describes how you sang." },
    { s: 'The choir sings very ___.', opts: ['well', 'good'], a: 'well', cat: 'word', why: "'Well' is the adverb — it tells how the choir sings." },
    { s: 'Maurice moved ___ away.', opts: ['slowly', 'slow'], a: 'slowly', cat: 'word', why: "The adverb 'slowly' describes the action verb 'moved.'" },
    { s: 'The sun was ___ this morning.', opts: ['bright', 'brightly'], a: 'bright', cat: 'word', why: "After the linking verb 'was,' use the adjective: the sun was bright." },
    { s: 'My younger brother is taller ___ yours.', opts: ['than', 'then'], a: 'than', cat: 'word', why: "'Than' compares. 'Then' tells when." },
    { s: "That's ___ heavy for me to carry.", opts: ['too', 'to'], a: 'too', cat: 'word', why: "'Too' means 'more than enough.'" },
    { s: 'After dinner, I decided to ___ down for a while.', opts: ['lie', 'lay'], a: 'lie', cat: 'word', why: "'Lie' means to recline. 'Lay' means to put something down." },
    { s: 'Maybe Mom can ___ me how to make an apple pie.', opts: ['teach', 'learn'], a: 'teach', cat: 'word', why: 'You teach someone else; you learn for yourself.' },
    { s: 'Do you think the coach will ___ us go with the team?', opts: ['let', 'leave'], a: 'let', cat: 'word', why: "'Let' means to allow. 'Leave' means to go away." },
    { s: "Jackie's jacket was too ___ on me.", opts: ['loose', 'lose'], a: 'loose', cat: 'word', why: "'Loose' (two o's) means not tight. 'Lose' means to misplace." },

    // Avoiding double negatives
    { s: "Lawrence couldn't think of ___ to go with him.", opts: ['anybody', 'nobody'], a: 'anybody', cat: 'neg', why: "'Couldn't' is already negative — pair it with 'anybody.'" },
    { s: "Carrie wouldn't want ___ help.", opts: ['any', 'no'], a: 'any', cat: 'neg', why: "One negative only: wouldn't + any." },
    { s: "We aren't driving ___ with you.", opts: ['anywhere', 'nowhere'], a: 'anywhere', cat: 'neg', why: "'Aren't' is negative, so use 'anywhere.'" },
    { s: "Can't they have ___ fun?", opts: ['any', 'no'], a: 'any', cat: 'neg', why: "'Can't' + 'no' would be a double negative." },
    { s: "We haven't ___ toys for them.", opts: ['any more', 'no more'], a: 'any more', cat: 'neg', why: "Keep one negative: haven't + any more." },
    { s: "Maria can't take her brother ___.", opts: ['anywhere', 'nowhere'], a: 'anywhere', cat: 'neg', why: "'Can't' is the negative — use 'anywhere' with it." }
  ],

  // Complete sentence, fragment, or run-on?
  SENT_KINDS: { sentence: 'Complete sentence', fragment: 'Fragment', runon: 'Run-on' },
  SENT_ITEMS: [
    { s: 'The bell rang.', kind: 'sentence', why: 'Short but complete — it has a subject (bell) and a predicate (rang).' },
    { s: 'Both men fell into the river.', kind: 'sentence', why: 'It has a subject (both men) and a predicate (fell into the river).' },
    { s: 'Robin started a fire and told this story.', kind: 'sentence', why: 'One subject (Robin) with a compound predicate (started AND told) — still one complete sentence.' },
    { s: 'Out of the forest galloped the sheriff.', kind: 'sentence', why: 'The order is flipped, but there is a subject (the sheriff) and a predicate (galloped).' },
    { s: 'Tell me another story.', kind: 'sentence', why: "A command is complete — the subject 'you' is understood: (You) tell me another story." },
    { s: 'She took a boat ride up the Amazon River.', kind: 'sentence', why: 'Subject (she) + predicate (took a boat ride) = complete thought.' },
    { s: 'Two small dogs.', kind: 'fragment', why: 'There is no predicate — what did the dogs DO?', fix: 'Two small dogs *chased the ball*.' },
    { s: 'Gave me a present.', kind: 'fragment', why: 'There is no subject — WHO gave the present?', fix: '*My aunt* gave me a present.' },
    { s: 'After the long game.', kind: 'fragment', why: "It's only a phrase — no subject doing anything.", fix: 'After the long game, *we got ice cream*.' },
    { s: 'The girl with the red backpack.', kind: 'fragment', why: 'A subject with no predicate — what did she do?', fix: 'The girl with the red backpack *waved at us*.' },
    { s: 'Ran all the way home.', kind: 'fragment', why: 'A predicate with no subject — who ran?', fix: '*Jamal* ran all the way home.' },
    { s: 'Because she was happy.', kind: 'fragment', why: "A clause starting with 'because' can't stand alone — it leaves you hanging.", fix: 'She smiled *because she was happy*.' },
    { s: 'Maria looked around Laurie ran.', kind: 'runon', why: 'Two complete sentences are crammed together with nothing joining them.', fix: 'Maria looked around*, and* Laurie ran.' },
    { s: 'The school closed for the summer we were happy.', kind: 'runon', why: 'Two complete thoughts need a joining word or a period.', fix: 'The school closed for the summer*, so* we were happy.' },
    { s: 'The bus turned left the car went straight.', kind: 'runon', why: 'Two sentences fused together — split them or join them properly.', fix: 'The bus turned left*, but* the car went straight.' },
    { s: 'The movie ended we went home.', kind: 'runon', why: 'Two complete sentences run together.', fix: 'The movie ended*, so* we went home.' },
    { s: 'James rode horses George helped the rancher.', kind: 'runon', why: 'Each half could stand alone — they need proper joining.', fix: 'James rode horses*, and* George helped the rancher.' }
  ]
};
