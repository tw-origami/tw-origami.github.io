/* Storyteller — content data.
 * Built on the principles of the Pip Decks "Storyteller Tactics" program by Steve Rawling.
 * Kid-framed (roughly 4th–6th grade) with original example stories.
 *
 * Four games mirror the four pillars of the Pip method:
 *   COMPASS  → the "System" card: diagnose a problem, pick the right family of tactics
 *   SHAPES   → Structure: name the story arc, then order its beats
 *   GOODBAD  → Style: "thou shalt not be dull" — pick the vivid telling
 *   DOCTOR   → Recipe: match the right tactic to a story's symptom
 */
window.STORY = {

  /* ───────────────────────── SOURCES ───────────────────────── */
  SOURCES: [
    { key:'storyteller', name:'Storyteller Tactics — Pip Decks (Steve Rawling)',
      url:'https://pipdecks.com/products/storyteller-tactics',
      note:'The card deck this whole app is built on. 54 storytelling "tactics" grouped into families, plus Recipe cards that combine them.' },
    { key:'system', name:'Pip Decks — the "System" card idea',
      url:'https://pipdecks.com/pages/storyteller-tactics',
      note:'Every Pip deck starts with a decision flowchart: answer a few yes/no questions and it points you to the right family of tactics. Story Compass is our version of that.' },
    { key:'vonnegut', name:'Kurt Vonnegut — "Shapes of Stories"',
      url:'https://www.youtube.com/watch?v=oP3c1h8v2ZQ',
      note:'The novelist who drew story arcs as simple graphs — "Man in a Hole" and "Boy Meets Girl" come from his famous lecture.' },
    { key:'booker', name:'Christopher Booker — The Seven Basic Plots',
      url:'https://en.wikipedia.org/wiki/The_Seven_Basic_Plots',
      note:'The book behind Voyage & Return, Rags to Riches, Overcoming the Monster and other classic story shapes.' },
    { key:'ted', name:'What makes a great story hook (TED talk titles)',
      url:'https://pipdecks.com/blogs/storytelling/story-hooks',
      note:'Rawling studied 1,000+ TED talk titles to find the "hooks" that make us click and keep listening.' }
  ],

  /* ───────────── GAME 1 · STORY COMPASS (the System card) ─────────────
   * Families = the categories a Pip deck sorts its tactics into.
   * Kid-worded, but true to the real Storyteller Tactics families. */
  FAMILIES: {
    concept: {
      icon:'💡', name:'Concept', tag:'Why tell a story?',
      short:'Make people CARE. Turn a boring topic into something that matters — a battle of good vs evil, a dragon to beat, a rule someone breaks.',
      eli5:'Before you tell a story, give people a reason to lean in. Concept tactics find the BIG idea that makes your topic exciting.',
      examples:['The Dragon & the City','Three Great Conflicts','Good & Evil','Rules, Cheats & Rebels','Secrets & Puzzles']
    },
    explore: {
      icon:'🔍', name:'Explore', tag:"Where's my story?",
      short:"Go hunting for stories in real life — in people's feelings, their mistakes, and the surprising 'huh, that’s funny…' moments.",
      eli5:"You don't invent every story — you FIND them. Explore tactics help you dig up true stories worth telling.",
      examples:['Story Listening','Emotional Dashboard','Thoughtful Failures',"That's Funny",'Data Detectives']
    },
    character: {
      icon:'🎭', name:'Character', tag:"Who's it about?",
      short:'Make us feel WHO the story is about — what they want, what’s stopping them, and why we should trust them.',
      eli5:'Stories are about people (or animals, or robots). Character tactics figure out what your hero wants and why we root for them.',
      examples:["What's My Motivation?",'Hero & Guide','Trust Me, I’m an Expert','Drive Stories','Curious Tales']
    },
    structure: {
      icon:'🏗️', name:'Structure', tag:'What SHAPE is it?',
      short:'Give your story a shape — a beginning, a low point, and a climb back up. The classic arcs like Man in a Hole and Rags to Riches.',
      eli5:'Good stories have a shape you can almost draw as a line — up, down, then up again. Structure tactics are those shapes.',
      examples:['Man in a Hole','Rags to Riches','No Easy Way','Five Ts','Happy Ever Afters']
    },
    style: {
      icon:'✨', name:'Style', tag:'How do I TELL it?',
      short:'Make it vivid and unputdownable. Hook us at the start, paint a picture we can SEE, and never, ever be boring.',
      eli5:'Two people can tell the same story — one is boring, one is amazing. Style tactics are the tricks that make yours amazing.',
      examples:['Movie Time','Story Hooks','Three is the Magic Number','Show & Tell','Rolls Royce Moment']
    },
    function: {
      icon:'🎯', name:'Function', tag:'What should it DO?',
      short:'Put your story to WORK — to persuade, to sell an idea, to warm up a room, or to boil it all down to one punchy pitch.',
      eli5:'A story isn’t just for fun — sometimes it has a job. Function tactics aim your story at a goal, like convincing someone.',
      examples:['Pitch Perfect','Simple Sales Stories','Story-ish Conversations','Icebreaker Stories']
    },
    organise: {
      icon:'🗂️', name:'Organise', tag:'How do I SHARE it?',
      short:'Tell the RIGHT story to the right person at the right time — and keep your best stories in a "story bank" so you never lose them.',
      eli5:'A great story told to the wrong person, or twice to the same person, flops. Organise tactics help you share stories well.',
      examples:['Audience Profile','Story Bank','Big, Small, Inside, Outside']
    }
  },
  /* Problems a young storyteller might have → which family solves it. */
  COMPASS: [
    { q:'"Nobody cares about the thing I’m writing about. How do I make them WANT to listen?"',
      family:'concept', why:'This is a job for CONCEPT tactics. They find the big, exciting idea inside your topic — a dragon to slay, a rule being broken — so people care before you even start.' },
    { q:'"I have to write a true story from my own life… but I can’t think of anything worth telling."',
      family:'explore', why:'EXPLORE tactics go story-hunting. Look at your strongest feelings, your biggest mistakes, or a moment that made you laugh — that’s where the story is hiding.' },
    { q:'"My hero just does stuff. I want readers to actually CARE about them and cheer them on."',
      family:'character', why:'CHARACTER tactics are about people. Figure out what your hero desperately wants and what’s in their way, and suddenly we’re rooting for them.' },
    { q:'"My story is a jumble — the beginning, middle and end are all mixed up and it doesn’t flow."',
      family:'structure', why:'STRUCTURE tactics give your story a shape. Pick an arc like Man in a Hole (comfy → disaster → climb back up) and the beats fall into place.' },
    { q:'"Everything in my story is TRUE… but it’s so boring my teacher fell asleep reading it."',
      family:'style', why:'STYLE tactics fight boredom. Add a hook at the start, a moment we can picture in our heads, and cut the dull parts. Same facts — way more fun.' },
    { q:'"I need my story to convince my parents to let me get a puppy. How do I make it actually WORK?"',
      family:'function', why:'FUNCTION tactics give your story a job. A little "pitch" story shows the problem, the payoff, and why they can trust you to walk the dog.' },
    { q:'"I told my funny camp story to the same friend twice and she groaned. Awkward!"',
      family:'organise', why:'ORGANISE tactics help you tell the RIGHT story to the right person. Keeping a "story bank" means you always know which story you’ve told to whom.' },
    { q:'"I want to grab my reader in the very first sentence so they can’t stop reading."',
      family:'style', why:'That’s a STYLE move called a Story Hook — a question, a surprise, or a secret at the very start that makes us HAVE to keep reading.' },
    { q:'"How do I show WHY my character does what they do, instead of just saying it?"',
      family:'character', why:'CHARACTER tactics like "What’s My Motivation?" dig into what a person wants and fears, so their choices make sense to us.' },
    { q:'"I want my report on plastic pollution to feel like an epic battle, not a list of facts."',
      family:'concept', why:'CONCEPT tactics like Good & Evil turn a topic into a battle — clean oceans vs. plastic trash — so it feels like it matters.' },
    { q:'"How do I warm up a shy group so everyone starts sharing stories?"',
      family:'function', why:'FUNCTION has Icebreaker Stories — playful little story games that get a whole room thinking in a story-ish way.' },
    { q:'"I noticed something weird and surprising while researching. Is that useful?"',
      family:'explore', why:'Yes! EXPLORE loves "That’s Funny…" moments. A surprise means you’ve spotted something worth a story — dig into why it’s odd.' }
  ],

  /* ───────────── GAME 2 · STORY SHAPES (Structure) ─────────────
   * Each arc has beats (for the "order the beats" mode) and famous
   * kid-known examples (for the "guess the shape" mode). */
  ARCS: [
    { key:'hole', name:'Man in a Hole', icon:'⛰️', shape:'⬇️ then ⬆️',
      line:'Comfy → you fall in a hole → you climb out wiser',
      idea:'You’re doing fine, then BAM — something knocks you down into a hole. Down in the dark you find something valuable, then climb back out a little older and wiser.',
      eli5:'Everything’s okay → something bad happens → you learn something → you’re better than before.',
      beats:[
        {icon:'😌', text:'Comfort zone', desc:'Life is fine — but something is missing or about to change.'},
        {icon:'💥', text:'Trigger', desc:'Something knocks the hero down into a "hole."'},
        {icon:'🕳️', text:'Crisis', desc:'The lowest point — but here the hero finds or learns something valuable.'},
        {icon:'🧗', text:'Recovery', desc:'The hero uses what they learned and starts climbing back up.'},
        {icon:'🌞', text:'Better place', desc:'Out of the hole — older, wiser, and stronger than before.'}
      ],
      examples:[
        {t:'Finding Nemo', d:'Marlin’s happy life shatters when Nemo is caught — he crosses the whole ocean and comes back a braver dad.'},
        {t:'Your first day at a new school', d:'Nervous and lost → a rough start → you make a friend → by Friday it feels like home.'},
        {t:'Cloudy with a Chance of Meatballs', d:'Flint’s invention goes wrong and floods the town in food, then he fixes his own mess.'}
      ],
      note:'Novelist Kurt Vonnegut said: "Nobody ever lost money telling the story of a man in a hole." It’s the most useful shape there is.',
      src:'vonnegut' },

    { key:'rags', name:'Rags to Riches', icon:'🌟', shape:'steady ⬆️ up',
      line:'Hidden greatness → a big chance → struggle → shine',
      idea:'The hero starts in a rough spot, but there’s something special inside them nobody sees yet. A chance comes, they struggle, and finally the world sees their hidden value.',
      eli5:'Someone looks like a nobody → gets a chance → works hard → everyone sees how amazing they really are.',
      beats:[
        {icon:'💎', text:'Hidden value', desc:'The hero is in a bad spot, but has a gift nobody has noticed yet.'},
        {icon:'📣', text:'Trigger', desc:'A chance appears — the Ball, the contest, the big opportunity.'},
        {icon:'💪', text:'Struggle', desc:'It’s hard. They get help, but ultimately have to prove themselves.'},
        {icon:'🏆', text:'Deserved recognition', desc:'The world finally sees their true worth.'}
      ],
      examples:[
        {t:'Cinderella', d:'A kind girl treated badly → gets to the ball → loses the slipper → her goodness is finally seen.'},
        {t:'Matilda', d:'A brilliant girl in an awful home discovers her powers and finds a teacher who sees her worth.'},
        {t:'Ratatouille', d:'A rat nobody would trust in a kitchen turns out to be the finest chef in Paris.'}
      ],
      note:'These stories aren’t really about money — they’re about VALUE. The moral is "you can do it too."',
      src:'booker' },

    { key:'noeasy', name:'No Easy Way', icon:'🎢', shape:'⬆️⬇️⬆️ rollercoaster',
      line:'Problem → early win → setback → crisis → comeback',
      idea:'The ultimate rollercoaster. Things start looking up, then get WORSE than ever, and just when all seems lost the hero finds their true strength.',
      eli5:'A problem → things go great → things go terrible → the darkest moment → the hero digs deep and wins.',
      beats:[
        {icon:'🌧️', text:'Problem', desc:'A bad place where danger lurks or potential is wasted.'},
        {icon:'🌟', text:'Early success', desc:'The hero grabs a chance and things start looking up.'},
        {icon:'⚡', text:'Setback', desc:'Enemies or bad luck make things turn worse.'},
        {icon:'🌊', text:'Crisis', desc:'The darkest moment — maybe they wish they’d never started.'},
        {icon:'💡', text:'Recovery', desc:'The hero learns where their real strength lies.'},
        {icon:'🌅', text:'Better place', desc:'Danger is beaten, and the dream comes true.'}
      ],
      examples:[
        {t:'Harry Potter (Sorcerer’s Stone)', d:'Miserable under the stairs → off to Hogwarts → trolls & danger → facing Voldemort → he becomes a true wizard.'},
        {t:'Moana', d:'Stuck on her island → sets sail → Maui bails, the ocean fights back → crisis at Te Fiti → she saves her people.'},
        {t:'Star Wars: A New Hope', d:'A farm boy → joins the rebels → the Death Star strikes → all seems lost → Luke trusts the Force and wins.'}
      ],
      note:'We LOVE the rise-and-fall-and-rise. Real stories have setbacks — that’s what makes the win feel earned.',
      src:'storyteller' },

    { key:'pride', name:'Pride & Fall', icon:'☀️', shape:'⬆️ then crash ⬇️',
      line:'Stuck → you fly too high → ignore the warning → crash',
      idea:'The hero gets a taste of power and lets it go to their head. They ignore a clear warning, fly too high, and end up WORSE off than when they started.',
      eli5:'Someone gets full of themselves → ignores good advice → goes too far → it all comes crashing down.',
      beats:[
        {icon:'🔒', text:'Bad place', desc:'The hero is stuck or trapped and wants out.'},
        {icon:'🕊️', text:'Pride', desc:'They gain a power that feels amazing — maybe too amazing.'},
        {icon:'⚠️', text:'Warning', desc:'Someone warns them: "Don’t go too far!"'},
        {icon:'📉', text:'Fall', desc:'They ignore the warning and push their luck.'},
        {icon:'🕳️', text:'Worse place', desc:'It ends worse than where they began.'}
      ],
      examples:[
        {t:'Icarus', d:'Given wax wings to escape → warned not to fly near the sun → flies too high anyway → wings melt, he falls.'},
        {t:'The tortoise and the hare', d:'The speedy hare gets cocky, takes a nap to show off, and loses the race to the slow tortoise.'},
        {t:'King Midas', d:'Wishes everything he touches turns to gold — then can’t hug his daughter or eat his lunch.'}
      ],
      note:'One of the oldest stories we know. Its lesson: "this sounds too good to be true" — and it was.',
      src:'booker' },

    { key:'voyage', name:'Voyage & Return', icon:'🧭', shape:'out ➡️ and back ⬅️',
      line:'Home → into a strange new world → home, but changed',
      idea:'The hero leaves ordinary life and tumbles into a strange new world full of wonder and danger. They learn a big lesson — then come home different, and home looks different too.',
      eli5:'A normal kid → falls into a weird magical place → has adventures and learns something → comes home changed.',
      beats:[
        {icon:'🏠', text:'Home', desc:'Safe, but a little dull — the hero is itching for something more.'},
        {icon:'🌀', text:'Into the unknown', desc:'They tumble into a strange, exciting new world.'},
        {icon:'🐉', text:'Adventure & danger', desc:'Wonders and threats — the hero learns a big lesson here.'},
        {icon:'🚶', text:'Escape back', desc:'They find their way out, often paying a price.'},
        {icon:'🌅', text:'Return changed', desc:'Home again — but the hero (and home) will never look the same.'}
      ],
      examples:[
        {t:'Alice in Wonderland', d:'Bored Alice → down the rabbit hole → a mad, magical world → wakes up home, changed.'},
        {t:'The Wizard of Oz', d:'Dorothy → whisked to Oz → witches and wizards → clicks her heels: "there’s no place like home."'},
        {t:'Spirited Away', d:'Chihiro → trapped in a spirit bathhouse → grows brave → returns to the human world grown up.'}
      ],
      note:'From The Odyssey to The Hobbit, we love a journey into the unknown — the hero always comes home different.',
      src:'booker' },

    { key:'downfall', name:'Downfall', icon:'👑', shape:'steady ⬇️ down',
      line:'On top → a hidden flaw → denial → a fall they deserved',
      idea:'A powerful character has a hidden flaw — greed, jealousy, pride. Instead of fixing it, they double down and lie to cover it up, until the flaw is exposed and they crash for good.',
      eli5:'Someone powerful has a secret bad habit → hides it instead of fixing it → it catches up and brings them down.',
      beats:[
        {icon:'👑', text:'Flawed power', desc:'The character is on top — but hides a selfish flaw.'},
        {icon:'😤', text:'Desperate denial', desc:'The flaw starts to show; they cover up instead of changing.'},
        {icon:'💣', text:'Deserved disgrace', desc:'The flaw is exposed and they come crashing down.'}
      ],
      examples:[
        {t:'Gollum', d:'The ring’s power twists him; his greed for "my precious" destroys him in the end.'},
        {t:'Scar (The Lion King)', d:'Jealousy drives him to grab the throne by lies — until the truth brings him down.'},
        {t:'The boy who cried wolf', d:'He lies for attention again and again — so no one believes him when it counts.'}
      ],
      note:'We half-enjoy watching the mighty fall — but the real point is "let’s not make the same mistake."',
      src:'booker' }
  ],

  /* ───────────── GAME 3 · GOOD STORY, BAD STORY (Style) ─────────────
   * Two tellings of the same thing. The "good" one uses a real Style
   * tactic. Player picks the stronger telling; reveal names the tactic. */
  GOODBAD: [
    { setup:'Telling about the walk to school in the rain',
      a:'It rained on the way to school and I got wet.',
      b:'I stepped outside and the sky just opened up. By the corner my socks had turned into two little swimming pools.',
      good:'b', tactic:'Movie Time',
      why:'Version B gives you a moment you can SEE and almost feel — socks like swimming pools. Your brain plays a little movie. "It got wet" plays nothing.',
      eli5:'Movie Time: don’t just say what happened — give one picture so vivid the reader sees it in their head.' },

    { setup:'Starting a story about a science fair',
      a:'This is a story about my science fair project on volcanoes.',
      b:'I had exactly four hours to build a volcano before the fair — and I had just knocked the whole thing onto the floor.',
      good:'b', tactic:'Story Hooks',
      why:'Version B opens on trouble and a ticking clock, so you HAVE to know what happens next. Version A tells you the topic and gives you no reason to keep reading.',
      eli5:'Story Hook: start at an exciting or worrying moment, not with "this is a story about…".' },

    { setup:'Describing how good your new bike is',
      a:'My new bike is really fast and really good and really cool and I love it so much.',
      b:'My new bike is so quiet you can hear the wind — and so fast the houses blur.',
      good:'b', tactic:'Rolls Royce Moment',
      why:'Version B picks ONE sharp, real detail (so quiet you hear the wind) that makes you feel the quality. Version A just repeats "really" and proves nothing.',
      eli5:'Rolls Royce Moment: one small, exact detail says more than a pile of "really really goods".' },

    { setup:'Wrapping up a long, rambling summer story',
      a:'…and then we had lunch, and then we drove home, and then we unpacked, and then we watched TV, and then…',
      b:'…and honestly? The best part of the whole trip was that one wave that knocked us all over. We still laugh about it.',
      good:'b', tactic:'Cut to the Chase',
      why:'Version B senses you’re getting bored and jumps to the moment that actually matters. Version A drones through every little step and loses you.',
      eli5:'Cut to the Chase: when a story starts to drag, skip ahead to the exciting or important bit.' },

    { setup:'Telling why recess is the best part of the day',
      a:'Recess is good because you get exercise, and fresh air, and time with friends, and a break, and a snack, and it’s fun.',
      b:'Recess gives you three things: fresh air, your friends, and a break from your desk.',
      good:'b', tactic:'Three is the Magic Number',
      why:'Version B picks the best THREE reasons, which is exactly how many our brains remember. Version A lists six and you forget them all.',
      eli5:'Three is the Magic Number: pick your top three points — three is the sweet spot people remember.' },

    { setup:'Ending a scary story',
      a:'…and then the monster jumped out and it was actually just the cat and everyone was fine and it wasn’t scary.',
      b:'…the closet door creaked open, just an inch. Two eyes blinked in the dark. And then — the hallway light went out.',
      good:'b', tactic:'Leave it Out',
      why:'Version B leaves the scary part to YOUR imagination, which is always scarier. Version A explains everything and pops the tension like a balloon.',
      eli5:'Leave it Out: sometimes what you DON’T show is the best part. Let the reader’s brain fill the gap.' },

    { setup:'Making a boring fact interesting',
      a:'A blue whale’s heart is very big.',
      b:'A blue whale’s heart is so big a small child could crawl right through one of its arteries.',
      good:'b', tactic:'Movie Time',
      why:'Version B turns "big" into something you can picture — a kid crawling through it. Same fact, but now it lands.',
      eli5:'Movie Time again: compare a fact to something you can SEE and it sticks in the memory.' },

    { setup:'Getting attention at the start of a class speech',
      a:'Today I’m going to talk about why we should recycle more.',
      b:'Every hour, our school throws away enough paper to wrap this entire classroom. Every. Hour.',
      good:'b', tactic:'Story Hooks',
      why:'Version B hits you with a surprising, vivid number that makes you sit up. Version A announces the topic and everyone’s already yawning.',
      eli5:'Story Hook: open with a surprise or a big question, not a "today I will talk about…".' }
  ],

  /* ───────────── GAME 4 · STORY DOCTOR (the Recipe principle) ─────────────
   * A story has a "symptom" — pick the tactic that cures it. The four
   * options are drawn from across the families, teaching that you match
   * the right tactic to the need (exactly how Recipe cards work). */
  DOCTOR: [
    { symptom:'"My story is TRUE but sooo boring. Everything just plods along in a flat line — nothing feels exciting."',
      cures:'Movie Time', family:'style',
      why:'The story has no picture in it. Movie Time adds one vivid moment you can SEE, so the reader’s brain plays a little film instead of skimming flat facts.',
      distractors:['Story Bank','Audience Profile','Pitch Perfect'] },

    { symptom:'"Readers put my story down after the first line. They never get hooked in the first place."',
      cures:'Story Hooks', family:'style',
      why:'The opening is weak. A Story Hook — a surprise, a question, or a secret — grabs attention in the very first sentence so they can’t stop.',
      distractors:['Happy Ever Afters','Three Great Conflicts','Story Bank'] },

    { symptom:'"My story is a jumbled mess — the beginning, middle and end are all tangled together."',
      cures:'Five Ts', family:'structure',
      why:'It needs a SHAPE. Five Ts gives you a simple spine — a beginning, middle, end and a turning point — so the beats line up in order.',
      distractors:['Rolls Royce Moment','Social Proof','Story Hooks'] },

    { symptom:'"Nobody cares about my topic. It’s important, but it feels dull and nobody wants to listen."',
      cures:'The Dragon & the City', family:'concept',
      why:'The topic has no stakes yet. The Dragon & the City turns it into an epic — a city worth saving and a dragon to beat — so people suddenly care.',
      distractors:['Story Bank','Five Ts','Cut to the Chase'] },

    { symptom:'"My hero just does random stuff. Readers don’t understand WHY they make their choices."',
      cures:"What's My Motivation?", family:'character',
      why:'The hero has no clear want. "What’s My Motivation?" figures out what the character desperately wants and fears, so their choices finally make sense.',
      distractors:['Movie Time','Audience Profile','Three is the Magic Number'] },

    { symptom:'"I need this story to actually CONVINCE my parents to say yes. It has to do a job, not just entertain."',
      cures:'Pitch Perfect', family:'function',
      why:'The story needs a goal. Pitch Perfect shapes it into a mini-argument — here’s the problem, here’s the payoff, here’s why you can trust me.',
      distractors:['Leave it Out','Man in a Hole','Story Bank'] },

    { symptom:'"I keep telling the same story to the same friends, and I told a secret I wasn’t supposed to. Oops."',
      cures:'Story Bank', family:'organise',
      why:'You have no system for your stories. A Story Bank tracks which story you’ve told to whom — and which ones are okay to share.',
      distractors:['Movie Time','Three Great Conflicts','Rolls Royce Moment'] },

    { symptom:'"My true story has no ups and downs — the hero never struggles, so the ending feels unearned."',
      cures:'No Easy Way', family:'structure',
      why:'It’s too smooth. No Easy Way adds setbacks and a crisis before the win, so the victory actually feels earned.',
      distractors:['Audience Profile','Show & Tell','Story Bank'] },

    { symptom:'"I told my little cousin a story meant for grown-ups and she was totally lost and bored."',
      cures:'Audience Profile', family:'organise',
      why:'Wrong story for the listener. Audience Profile means picturing who you’re talking to first, then choosing a story that fits THEM.',
      distractors:['Pride & Fall','Rolls Royce Moment','Story Hooks'] },

    { symptom:'"My facts are all correct but they feel like a grocery list. There’s no feeling in the story at all."',
      cures:'Emotional Dashboard', family:'explore',
      why:'No emotion, no story. The Emotional Dashboard hunts for the moment you felt something strong — that feeling is where the real story lives.',
      distractors:['Three is the Magic Number','Simple Sales Stories','Five Ts'] }
  ],

  /* ───────────── GAME 5 · HOOK THE READER (Style · Story Hooks) ─────────────
   * Rawling studied 1,000+ TED talk titles and found six "hook" types (QUIRKS).
   * Show an opening line → pick which kind of hook it uses. */
  HOOKS: {
    TYPES: {
      question:    { icon:'❓', name:'Big Question', blurb:'Opens with a question you HAVE to answer',
        eli5:'Ask a question and your brain can’t help trying to answer it — so you keep reading to find out.' },
      twist:       { icon:'🔄', name:'The Big Twist', blurb:'Says the surprising opposite of what you expect',
        eli5:'When everyone zigs, you zag. Say the backwards, surprising thing and people stop to pay attention.' },
      irony:       { icon:'🙃', name:'That’s Not Right!', blurb:'Points out something backwards or unfair',
        eli5:'Show something that isn’t the way it should be, and we lean in to find out WHY it’s so weird.' },
      superlative: { icon:'🏆', name:'Biggest or Tiniest', blurb:'The biggest, fastest, oldest or smallest anything',
        eli5:'Extreme “-est” words — biggest, oldest, tiniest — fill us with wonder or curiosity.' },
      relatable:   { icon:'🫵', name:'Is This You?', blurb:'Talks straight to YOU, so it feels personal',
        eli5:'Say “you” and “we” so the reader feels the story is about them — and they can’t look away.' },
      secret:      { icon:'🤫', name:'Insider Secret', blurb:'Promises a secret or trick only insiders know',
        eli5:'Tease a secret, rule or hidden trick and we HAVE to find out what it is.' }
    },
    LINES: [
      { line:'What would you do if you woke up tomorrow and every grown-up on Earth had disappeared?',
        type:'question', why:'It opens with a question, so your brain immediately starts imagining an answer — and now you’re hooked into finding out what happens.' },
      { line:'You’ve heard “slow and steady wins the race.” Today I’m going to prove that’s completely wrong.',
        type:'twist', why:'It takes something everyone believes and flips it. That surprise makes us stop and think, "wait — how could that be true?"' },
      { line:'Our town just spent a million dollars on a brand-new swimming pool — in a place where it snows nine months a year.',
        type:'irony', why:'Something here is clearly not right. When we spot something backwards or silly, we want to know how it happened.' },
      { line:'A blue whale’s heart is so big a kid could crawl right through one of its arteries.',
        type:'superlative', why:'It uses an extreme — the giant whale heart — and extremes fill us with wonder. We keep reading to marvel some more.' },
      { line:'You know that sinking feeling when you realize you left your homework at home? That’s exactly where my morning started.',
        type:'relatable', why:'It talks straight to YOU about a feeling you’ve had. Now the story feels personal, like it’s about you too.' },
      { line:'There’s a trick to almost never losing at rock-paper-scissors, and hardly anyone knows it.',
        type:'secret', why:'It promises a hidden trick only insiders know. We can’t stand not knowing a secret — so we read on.' },
      { line:'Why does your nose run but your feet smell?',
        type:'question', why:'A funny question we suddenly want answered. Our brain itches to solve it, which keeps us reading.' },
      { line:'Everyone thinks the strongest kid won the tug-of-war. Actually, it was the smallest one — here’s how.',
        type:'twist', why:'It sets up what we expect (the strong kid wins) then flips it. The surprise makes us need the explanation.' },
      { line:'The world’s tiniest frog is smaller than your pinky fingernail.',
        type:'superlative', why:'A record-breaking extreme — the tiniest frog — sparks curiosity. Extremes, big or small, grab attention.' },
      { line:'If you’ve ever searched your whole house for a pen that actually works, this story is for you.',
        type:'relatable', why:'It speaks directly to you about something you’ve totally done. That “that’s so me!” feeling pulls you in.' },
      { line:'Here’s something your teacher will probably never tell you about acing a spelling test.',
        type:'secret', why:'It dangles insider knowledge just out of reach. Promising a secret is a classic way to make us keep reading.' },
      { line:'Our school library banned the one book every single kid actually wants to read.',
        type:'irony', why:'A library banning the most-wanted book is backwards and unfair — exactly the kind of “that’s not right!” that hooks us.' },
      { line:'How does a tiny seed know which way is up before it has ever seen the sun?',
        type:'question', why:'A curious question with no obvious answer. We stick around because our brain wants to close the gap.' },
      { line:'The oldest living tree on Earth was already ancient when the pyramids were brand new.',
        type:'superlative', why:'It stretches an extreme across time — the oldest tree ever. That scale amazes us and keeps us reading.' },
      { line:'We all swear we’ll start the project early. We all end up doing it the night before.',
        type:'relatable', why:'“We all…” includes you in the joke. When a line describes exactly what you do, it feels made just for you.' }
    ]
  }
};
