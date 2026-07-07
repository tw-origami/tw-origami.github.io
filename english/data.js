/* Lit Devices Lab — content data. Aimed at rising 9th graders.
 * Four INTERACTIVE games (not flashcards):
 *   DETECTIVE → hunt literary devices hidden inside a real passage (tap to find)
 *   FORGE     → build your own similes & metaphors on a "figurative forge" (create!)
 *   TONE      → rewrite one sentence into different tones by choosing words (diction lab)
 *   THEME     → tap the clue sentence that reveals a story's theme, then name it
 */
window.LIT = {

  /* ───── Teacher Guide — shown at the bottom, updates per game ───── */
  TEACHER: {
    detective: {
      how:'Read the passage. When the game asks you to find a device (like a simile or personification), tap the exact phrase in the text that matches. Find all of them to finish the passage.',
      point:'Literary devices don’t show up on a neat list in real life — they’re woven into sentences. This game trains the eye to spot them in the wild.',
      learn:'Telling apart similes, metaphors, personification, hyperbole, alliteration, onomatopoeia, idioms, oxymorons, allusions, and irony by how they actually work in a sentence.',
      explore:'Ask your student: “Why did the writer pick that device right there?” Then challenge them to find the same devices in a song lyric or the book they’re reading now.'
    },
    forge: {
      how:'Pick a Subject and an Image (or tap 🎲 to spin them). Choose “is like” to make a simile or “is” to make a metaphor. Read the line you just built, then ⭐ save your favorites.',
      point:'The leap from recognizing figurative language to CREATING it is where real understanding happens. This is a sandbox — there are no wrong answers, only vivid ones.',
      learn:'How a simile and a metaphor are constructed, and how one good comparison can pack a whole feeling into a few words.',
      explore:'Ask: “Which comparison is the most surprising?” Great writers love unexpected pairings. Have them forge one about something in their own room, then explain why it fits.'
    },
    tone: {
      how:'The game names a target mood (like Eerie or Cheerful). Tap one word for each blank so the whole sentence matches that mood. Watch the meter climb — reach 100% and press “Lock it in.”',
      point:'Kids often think the meaning of a sentence is fixed. This shows them that a single swapped word (“crept” vs. “strolled”) can flip the entire feeling.',
      learn:'Diction (word choice) and how it creates tone and mood — a skill that powers both careful reading and strong writing.',
      explore:'Ask: “How would a news report describe this scene versus a horror story?” Have them rewrite a text they sent today in a completely different tone.'
    },
    theme: {
      how:'Read the short story. First, tap the ONE sentence that best reveals the lesson. Then choose the theme — the big-picture message — from the options.',
      point:'The hardest jump in English class is separating what HAPPENS in a story from what it MEANS. This breaks that skill into two clear steps.',
      learn:'Finding the central message (theme) of a story by first locating the key piece of evidence — a task on nearly every reading test.',
      explore:'Ask: “What would you title this story’s lesson?” Then have them name the theme of their favorite movie and point to the scene that proves it.'
    }
  },

  SOURCES: [
    { key:'litcharts', name:'LitCharts — Literary Devices & Terms',
      url:'https://www.litcharts.com/literary-devices-and-terms',
      note:'Clear definitions and examples for every device in this app — metaphor, irony, theme and more.' },
    { key:'khan', name:'Khan Academy — Reading & Vocabulary',
      url:'https://www.khanacademy.org/ela',
      note:'Free lessons on close reading, figurative language, and analyzing themes.' },
    { key:'commonlit', name:'CommonLit',
      url:'https://www.commonlit.org/',
      note:'Free reading passages with questions on theme, tone, and literary devices — used in many schools.' },
    { key:'purdue', name:'Purdue OWL — Literary Terms',
      url:'https://owl.purdue.edu/',
      note:'The writing lab most high schools point you to for terms, essays, and citations.' }
  ],

  /* ───── Glossary (📖 popup) ───── */
  DEVICES: [
    { term:'Simile', def:'A comparison of two different things using the words “like” or “as.”', ex:'“Her smile was as bright as the sun.”', simple:'It compares two things and literally uses the word LIKE or AS.' },
    { term:'Metaphor', def:'A comparison that says one thing IS another, without “like” or “as.”', ex:'“Time is a thief.”', simple:'Like a simile, but it drops the “like/as” and says one thing IS the other.' },
    { term:'Personification', def:'Giving human qualities or actions to something that isn’t human.', ex:'“The wind whispered through the trees.”', simple:'An object, animal, or idea does something only a person could do.' },
    { term:'Hyperbole', def:'An extreme exaggeration used for emphasis, not meant literally.', ex:'“I’ve told you a million times.”', simple:'A wild over-exaggeration for effect.' },
    { term:'Alliteration', def:'The repetition of the same beginning sound in nearby words.', ex:'“Peter Piper picked a peck of peppers.”', simple:'A bunch of nearby words start with the same sound.' },
    { term:'Onomatopoeia', def:'A word that imitates the actual sound it describes.', ex:'“The bacon sizzled; the door went bang.”', simple:'The word IS the sound — buzz, pop, sizzle, bang.' },
    { term:'Idiom', def:'A common phrase whose meaning can’t be taken from the literal words.', ex:'“It’s raining cats and dogs.”', simple:'A saying that means something different from the actual words.' },
    { term:'Imagery', def:'Descriptive language that appeals to the five senses.', ex:'“The crisp air smelled of woodsmoke.”', simple:'Words that let you see, hear, smell, taste, or feel the scene.' },
    { term:'Symbolism', def:'When an object stands for a bigger idea beyond itself.', ex:'“A white dove for peace.”', simple:'A thing that represents something bigger.' },
    { term:'Foreshadowing', def:'Hints an author drops about what will happen later.', ex:'“Little did she know, it was the last time…”', simple:'A sneak-preview clue for something coming later.' },
    { term:'Irony', def:'When what happens (or is said) is the opposite of what’s expected.', ex:'“The fire station burned down.”', simple:'The outcome flips your expectation.' },
    { term:'Oxymoron', def:'Two opposite words placed right next to each other.', ex:'“Deafening silence.”', simple:'A two-word contradiction that still makes sense.' },
    { term:'Allusion', def:'A reference to a well-known person, place, event, or work.', ex:'“He’s a real Romeo.”', simple:'A shout-out to something famous you’re meant to recognize.' },
    { term:'Theme', def:'The central message or lesson a story reveals about life.', ex:'A bragging hare loses a race → don’t be overconfident.', simple:'The deeper “so what” / life lesson of a story.' },
    { term:'Tone', def:'The author’s attitude toward the subject, shown through word choice.', ex:'“Oh, great, another Monday.” (sarcastic)', simple:'How the WRITER feels about the topic.' },
    { term:'Mood', def:'The feeling or atmosphere the writing creates in the reader.', ex:'A foggy, creaking house → eerie mood.', simple:'How the writing makes YOU (the reader) feel.' },
    { term:'Diction', def:'An author’s specific word choices, which shape tone and mood.', ex:'“crept” vs. “strolled” — same action, different feeling.', simple:'The exact words a writer picks — swap one and the whole vibe changes.' }
  ],

  /* ───── GAME 1 · DEVICE DETECTIVE ─────
   * Each passage renders as flowing text; the {p,d} chunks are tappable device
   * "suspects". The game asks you to find one device at a time. Devices are
   * unique within a passage so any correct-typed span counts. */
  DETECTIVE: [
    { parts:[ 'The morning sun ', {p:'stretched its arms', d:'Personification'}, ' over the hills. The rusty truck ', {p:'coughed and sputtered', d:'Onomatopoeia'}, ' to life, and we shot down the road, ', {p:'quick as a lightning bolt', d:'Simile'}, '.' ] },
    { parts:[ 'The classroom was ', {p:'a total zoo', d:'Metaphor'}, ' that afternoon. Backpacks flew, ', {p:'chairs screeched', d:'Onomatopoeia'}, ', and Mr. Diaz swore he had said it ', {p:'a million times', d:'Hyperbole'}, '.' ] },
    { parts:[ 'Outside, the ', {p:'wind whispered', d:'Personification'}, ' against the glass. She pulled the blanket close, wrapped in the ', {p:'soft, silver silence', d:'Alliteration'}, ' of the snow. The night felt ', {p:'like a held breath', d:'Simile'}, '.' ] },
    { parts:[ 'He strolled in ', {p:'fashionably late', d:'Oxymoron'}, ' again. ', {p:'“Nice of you to join us,”', d:'Irony'}, ' the coach muttered, not even looking up as the whole gym ', {p:'buzzed with whispers', d:'Onomatopoeia'}, '.' ] },
    { parts:[ 'That trophy was ', {p:'the Holy Grail', d:'Allusion'}, ' of our entire season. When the buzzer rang, the crowd ', {p:'erupted like a volcano', d:'Simile'}, '. We had ', {p:'moved mountains', d:'Idiom'}, ' to get here.' ] },
    { parts:[ 'The old house ', {p:'groaned in its sleep', d:'Personification'}, '. Dust hung in the air ', {p:'thick as fog', d:'Simile'}, ', and somewhere a shutter went ', {p:'bang, bang, bang', d:'Onomatopoeia'}, ' in the wind.' ] }
  ],

  /* ───── GAME 2 · FIGURATIVE FORGE ─────
   * Pick a subject + an image; the forge assembles a real simile/metaphor and
   * explains what it paints. q = the quality the image evokes (drives the note). */
  FORGE_SUBJECTS: [
    'the city at night', 'her temper', 'the crowded hallway', 'my empty stomach',
    'the winter wind', 'his messy bedroom', 'the roaring crowd', 'the ticking clock',
    'the full moon', 'my racing heart', 'the final exam', 'the tangled headphones',
    'the silent classroom', 'that first day of school', 'the traffic jam', 'her laughter'
  ],
  FORGE_IMAGES: [
    { img:'a field of fallen stars', q:'scattered with tiny points of light' },
    { img:'a hungry wildfire',       q:'fast, wild, and impossible to control' },
    { img:'a sleeping giant',        q:'huge, still, and full of hidden power' },
    { img:'a tangled ball of yarn',  q:'knotted up and hard to sort out' },
    { img:'a marching army',         q:'loud, endless, and unstoppable' },
    { img:'a cracked mirror',        q:'broken into sharp, fractured pieces' },
    { img:'a warm blanket',          q:'soft, heavy, and comforting' },
    { img:'a shaken soda can',       q:'ready to burst at any second' },
    { img:'a locked vault',          q:'sealed tight and giving nothing away' },
    { img:'a fading candle',         q:'flickering and about to go out' },
    { img:'a runaway drum solo',     q:'pounding in a fast, relentless beat' },
    { img:'a maze with no exit',     q:'confusing and impossible to escape' },
    { img:'a bottomless well',       q:'deep, dark, and endless' },
    { img:'a fresh coat of paint',   q:'bright, clean, and full of a fresh start' }
  ],

  /* ───── GAME 3 · TONE REWRITER ─────
   * One template, four tones. Each slot has on-tone words per tone; the game
   * mixes in decoys from other tones. Choose words to hit the target tone. */
  TONES: [
    { key:'Cheerful', emoji:'😄', color:'#f59e0b' },
    { key:'Gloomy',   emoji:'🌧️', color:'#64748b' },
    { key:'Eerie',    emoji:'👻', color:'#7c3aed' },
    { key:'Exciting', emoji:'⚡', color:'#dc2626' }
  ],
  TONE_SENTS: [
    { template:'The {a} house sat at the end of the {b} lane.',
      slots:{
        a:{ Cheerful:['bright','welcoming'], Gloomy:['crumbling','forgotten'], Eerie:['crooked','shadowed'], Exciting:['grand','towering'] },
        b:{ Cheerful:['sunny','flower-lined'], Gloomy:['muddy','empty'], Eerie:['foggy','silent'], Exciting:['bustling','winding'] }
      } },
    { template:'She {a} into the room and {b} at everyone.',
      slots:{
        a:{ Cheerful:['skipped','breezed'], Gloomy:['shuffled','trudged'], Eerie:['drifted','crept'], Exciting:['burst','charged'] },
        b:{ Cheerful:['beamed','waved'], Gloomy:['sighed','stared'], Eerie:['glared','whispered'], Exciting:['shouted','pointed'] }
      } },
    { template:'The {a} waves {b} against the {c} shore.',
      slots:{
        a:{ Cheerful:['sparkling','playful'], Gloomy:['gray','heavy'], Eerie:['black','glassy'], Exciting:['towering','thundering'] },
        b:{ Cheerful:['danced','lapped'], Gloomy:['dragged','slumped'], Eerie:['hissed','slithered'], Exciting:['crashed','exploded'] },
        c:{ Cheerful:['golden','sandy'], Gloomy:['bare','littered'], Eerie:['deserted','moonlit'], Exciting:['rocky','storm-swept'] }
      } }
  ],

  /* ───── GAME 4 · THEME DETECTIVE ─────
   * Tap the sentence that best reveals the theme, then name the theme.
   * clue = index of the key sentence. */
  THEME: [
    { title:'The Race',
      sentences:['A speedy hare mocked a slow tortoise for even entering the race.','So sure of winning, the hare stopped to nap halfway through.','The tortoise never stopped, plodding past the sleeping hare to cross the finish line first.'],
      clue:2, answer:'Steady effort beats overconfidence',
      options:['Steady effort beats overconfidence','Always take a nap when tired','Fast runners always win','Racing is dangerous'],
      why:'The tortoise wins by never stopping while the cocky hare loses — steady effort beats arrogance.' },
    { title:'The Locket',
      sentences:['Mara found a gold locket on the sidewalk that would’ve sold for a lot.','But she noticed a photo inside and spent all afternoon tracking down its owner.','It was an elderly man who’d lost his late wife’s only picture, and he cried when she returned it.'],
      clue:1, answer:'Kindness matters more than money',
      options:['Kindness matters more than money','Never pick things up off the ground','Old people are forgetful','Gold is valuable'],
      why:'Mara gives up money to return something priceless — kindness is worth more than personal gain.' },
    { title:'The New Kid',
      sentences:['Everyone avoided the new student because of his ragged clothes and quiet manner.','When the class genius froze at the science fair, no one knew what to do.','The new kid quietly solved it — he’d been building rockets with his dad for years.'],
      clue:2, answer:'Don’t judge people by appearances',
      options:['Don’t judge people by appearances','Science fairs are hard','New students are shy','Always wear nice clothes'],
      why:'The overlooked kid turns out brilliant — you can’t judge someone by how they look.' },
    { title:'The Wall',
      sentences:['Two farmers feuded for years, building the fence between them higher each season.','One dry summer, a wildfire swept down the valley toward both farms.','Only by tearing the fence down and working side by side did they save their land.'],
      clue:2, answer:'Cooperation is stronger than conflict',
      options:['Cooperation is stronger than conflict','Fences should be tall','Wildfires ruin farms','Never trust a neighbor'],
      why:'They only survive by working together — cooperation beats holding a grudge.' },
    { title:'The Jar',
      sentences:['Dev saved every dollar for the newest phone, skipping lunches and every outing.','He finally bought the phone — and realized he had no one to text.','Slowly, he learned to put the jar away and say yes to his friends instead.'],
      clue:1, answer:'Relationships are worth more than things',
      options:['Relationships are worth more than things','Phones are a waste of money','Always eat lunch','Saving money is bad'],
      why:'Dev gets the object but loses his friends — people matter more than possessions.' },
    { title:'The Understudy',
      sentences:['Nadia never landed a lead role, but she learned every part anyway, just in case.','On opening night, the star lost her voice minutes before curtain.','Nadia stepped in without missing a single line.'],
      clue:0, answer:'Preparation creates opportunity',
      options:['Preparation creates opportunity','Stars always get sick','Acting is easy','Understudies never perform'],
      why:'Her quiet, constant preparation is what lets her seize the moment — being ready creates opportunity.' }
  ]
};
