// Writing Workshop — a guided studio where a kid writes THEIR OWN essay or
// book report from scratch. Each writing type is a list of steps; each step
// teaches a bit of craft, then gives fields + sentence starters to fill in.
// The app saves their work and assembles the finished piece at the end.
window.WRITING = {

  // Hook types for a compelling opening (shown in the intro step).
  HOOKS: [
    { type:'Ask a question', how:'Open with a question that makes the reader curious.', ex:'What would you do if you woke up and gravity was gone?' },
    { type:'Surprising fact', how:'Drop a fact that makes them go “whoa.”', ex:'A single giant sequoia tree can weigh as much as ten blue whales.' },
    { type:'Bold statement', how:'Say something strong you’ll back up.', ex:'Recess is the most important class of the whole school day.' },
    { type:'Tiny story', how:'Start in the middle of a moment.', ex:'The bell rang, but nobody moved — every eye was on the window.' }
  ],

  // Transition words to connect ideas (shown while drafting body paragraphs).
  TRANSITIONS: {
    'Add an idea':['Also','In addition','Another reason','Plus','What’s more'],
    'Give an example':['For example','For instance','Such as','To show this'],
    'Show a result':['So','As a result','Because of this','This means'],
    'Compare / contrast':['However','On the other hand','But','Even so','Similarly'],
    'Wrap up':['In conclusion','All in all','To sum up','That’s why','In the end']
  },

  // Self-editing checklist shown on the final "Put It Together" step.
  CHECKLIST: [
    'Does my introduction have a hook that grabs the reader?',
    'Can a reader find my main idea (thesis) easily?',
    'Does every paragraph stick to ONE idea?',
    'Did I back up each point with a fact, example, or detail?',
    'Did I use my OWN words (no copying)?',
    'Did I use transition words to connect my paragraphs?',
    'Did I read it out loud to catch bumpy sentences?',
    'Does my ending remind the reader of my main idea?'
  ],

  // ---------------------------------------------------------------------
  //  WRITING TYPES
  //  section: { key, title, icon, teach, tip?, inFinal, heading?, join,
  //             fields:[ {key,label,placeholder,starters?,copyFrom?,stars?} ] }
  //  inFinal = becomes part of the finished piece. Others are planning steps.
  // ---------------------------------------------------------------------
  TYPES: [
    {
      id:'opinion', name:'Opinion Essay', icon:'💪',
      blurb:'Convince the reader to agree with your opinion.',
      sections:[
        { key:'topic', title:'Pick a topic & take a side', icon:'🎯', inFinal:false,
          teach:'A great opinion essay starts with a topic you actually care about. Pick something you have real feelings about, then narrow it down so it’s not too big. “Animals” is huge — “Why every kid should have a pet” is just right.',
          fields:[
            { key:'topic', label:'What is your topic?', placeholder:'e.g., Kids should have longer recess' },
            { key:'side', label:'What is your opinion? Which side are you on?', placeholder:'I think… / I believe…', starters:['I believe that…','I think that…','In my opinion,…'] }
          ] },
        { key:'reasons', title:'Brainstorm your reasons', icon:'🧠', inFinal:false,
          teach:'Now dump out EVERY reason you can think of — good or silly. Don’t judge yet, just list. When you’re done, star your 3 strongest reasons. Those will become your body paragraphs.',
          fields:[ { key:'reasons', label:'List your reasons (one per line). Then pick your best 3.', placeholder:'• Reason 1\n• Reason 2\n• Reason 3\n• …', big:true } ] },
        { key:'research', title:'Find facts & take notes', icon:'🔎', inFinal:false,
          teach:'Opinions are stronger with FACTS behind them. Look in trusted places (books, an encyclopedia, a teacher-approved site). Write each fact in YOUR OWN words — never copy-paste. Jot down where you found it so you can prove it’s real. Using someone’s exact words as your own is called plagiarism, and it’s a no-no.',
          fields:[
            { key:'notes', label:'Facts & notes (in your own words)', placeholder:'• Fact:  …\n   (found in: …)\n• Fact:  …\n   (found in: …)', big:true },
            { key:'sources', label:'Where did your facts come from?', placeholder:'e.g., “Everything Dogs” book; kids.nationalgeographic.com' }
          ] },
        { key:'thesis', title:'Write your thesis', icon:'⭐', inFinal:false,
          teach:'Your thesis is ONE clear sentence that says your opinion AND hints at your reasons. It’s the backbone of the whole essay. A handy formula: “[Opinion] because [reason 1], [reason 2], and [reason 3].”',
          fields:[ { key:'thesis', label:'Your thesis sentence', placeholder:'Kids should have longer recess because it helps them focus, stay healthy, and make friends.', starters:['___ because ___, ___, and ___.'] } ] },
        { key:'intro', title:'Write your introduction', icon:'🚀', inFinal:true, join:'para',
          teach:'The intro has three jobs: HOOK the reader, give a little background, and land your thesis. Start with a hook (pick a style below), add a sentence of background, then state your opinion.',
          showHooks:true,
          fields:[
            { key:'hook', label:'Your hook (grab their attention!)', placeholder:'Start with a question, a surprising fact, a bold statement, or a tiny story.' },
            { key:'background', label:'A sentence of background', placeholder:'Set up what you’re talking about.' },
            { key:'thesisFinal', label:'Your thesis', placeholder:'State your opinion clearly.', copyFrom:'thesis' }
          ] },
        { key:'body1', title:'Body paragraph — Reason 1', icon:'1️⃣', inFinal:true, join:'para',
          teach:'Each body paragraph makes ONE point. Use this recipe: a TOPIC SENTENCE (your reason), then EVIDENCE (a fact or example from your notes), then EXPLAIN why it matters. This is called the P-E-E sandwich: Point, Evidence, Explain.',
          showTransitions:true,
          fields:[
            { key:'point', label:'Point — your first reason (topic sentence)', placeholder:'One reason is that…', starters:['One reason is…','First,…','To begin,…'] },
            { key:'evidence', label:'Evidence — a fact or example', placeholder:'For example,… (use a fact from your notes)', starters:['For example,…','For instance,…','Studies show…'] },
            { key:'explain', label:'Explain — why does this matter?', placeholder:'This shows that…', starters:['This shows that…','This means…','That’s important because…'] }
          ] },
        { key:'body2', title:'Body paragraph — Reason 2', icon:'2️⃣', inFinal:true, join:'para',
          teach:'Same recipe, new reason. Start with a transition word so it flows from the last paragraph. Point → Evidence → Explain.',
          showTransitions:true,
          fields:[
            { key:'point', label:'Point — your second reason', placeholder:'Another reason is…', starters:['Another reason is…','In addition,…','Also,…'] },
            { key:'evidence', label:'Evidence — a fact or example', placeholder:'For instance,…', starters:['For instance,…','For example,…'] },
            { key:'explain', label:'Explain — why it matters', placeholder:'This proves that…', starters:['This proves that…','As a result,…'] }
          ] },
        { key:'body3', title:'Body paragraph — Reason 3 (optional)', icon:'3️⃣', inFinal:true, join:'para',
          teach:'Add your third reason the same way, or leave this blank if two strong reasons are enough. Quality beats quantity!',
          showTransitions:true,
          fields:[
            { key:'point', label:'Point — your third reason', placeholder:'Finally,… (or leave blank)', starters:['Finally,…','Most importantly,…'] },
            { key:'evidence', label:'Evidence', placeholder:'For example,…' },
            { key:'explain', label:'Explain', placeholder:'This matters because…' }
          ] },
        { key:'conclusion', title:'Write your conclusion', icon:'🏁', inFinal:true, join:'para',
          teach:'Don’t just stop — stick the landing. Restate your opinion in FRESH words (don’t copy your thesis exactly), remind the reader of your big reasons, and end with a final thought or a call to action (“So next time you…”).',
          fields:[
            { key:'restate', label:'Restate your opinion in new words', placeholder:'Clearly, …', starters:['Clearly,…','As you can see,…','All in all,…'] },
            { key:'wrap', label:'Remind them of your reasons', placeholder:'For all these reasons,…' },
            { key:'call', label:'Final thought or call to action', placeholder:'So next time you…, remember…' }
          ] }
      ]
    },

    {
      id:'inform', name:'Informative Essay', icon:'📚',
      blurb:'Explain or teach the reader about a topic.',
      sections:[
        { key:'topic', title:'Choose a topic to explain', icon:'🎯', inFinal:false,
          teach:'An informative essay TEACHES — no opinions, just clear facts. Pick a topic you find cool and want to explain, then narrow it so you can really dig in. “Space” → “How black holes form.”',
          fields:[ { key:'topic', label:'What will you explain?', placeholder:'e.g., How volcanoes erupt' } ] },
        { key:'questions', title:'List your big questions', icon:'❓', inFinal:false,
          teach:'Good research starts with questions. What would a reader want to know about your topic? Write 3–5 questions. Each one can become a body paragraph.',
          fields:[ { key:'questions', label:'Questions to answer', placeholder:'• What is it?\n• How does it work?\n• Why does it matter?', big:true } ] },
        { key:'research', title:'Research & take notes', icon:'🔎', inFinal:false,
          teach:'Find answers in trusted sources and write them in your OWN words — never copy. Note where each fact came from. Paraphrasing (saying it your way) proves you actually understand it, and it keeps you clear of plagiarism.',
          fields:[
            { key:'notes', label:'Facts & notes (your own words)', placeholder:'• …\n• …\n• …', big:true },
            { key:'sources', label:'Your sources', placeholder:'Book titles / kid-safe websites you used' }
          ] },
        { key:'thesis', title:'Write your main-idea sentence', icon:'⭐', inFinal:false,
          teach:'Your thesis here says WHAT you’ll explain and the main parts. Formula: “This essay explains [topic] by looking at [part 1], [part 2], and [part 3].”',
          fields:[ { key:'thesis', label:'Main-idea sentence', placeholder:'This essay explains how volcanoes erupt, including magma, pressure, and eruptions.', starters:['This essay explains…','There are three main parts to…'] } ] },
        { key:'intro', title:'Write your introduction', icon:'🚀', inFinal:true, join:'para',
          teach:'Hook the reader, give a little background, and state what you’ll explain. Even facts can start with a fun hook!',
          showHooks:true,
          fields:[
            { key:'hook', label:'Your hook', placeholder:'A surprising fact makes a great hook for an info essay.' },
            { key:'background', label:'Background sentence', placeholder:'Set up the topic.' },
            { key:'thesisFinal', label:'What you’ll explain', placeholder:'State your main idea.', copyFrom:'thesis' }
          ] },
        { key:'body1', title:'Body paragraph — Part 1', icon:'1️⃣', inFinal:true, join:'para',
          teach:'One idea per paragraph. Topic sentence (the part you’re explaining), then a fact/detail from your notes, then explain it in plain words so anyone gets it.',
          showTransitions:true,
          fields:[
            { key:'point', label:'Topic sentence — the first part', placeholder:'First, it helps to know…', starters:['First,…','To start,…','One key part is…'] },
            { key:'evidence', label:'A fact or detail', placeholder:'For example,…' },
            { key:'explain', label:'Explain it simply', placeholder:'In other words,…', starters:['In other words,…','This means…'] }
          ] },
        { key:'body2', title:'Body paragraph — Part 2', icon:'2️⃣', inFinal:true, join:'para',
          teach:'Next part, same recipe. Begin with a transition so it flows.',
          showTransitions:true,
          fields:[
            { key:'point', label:'Topic sentence — the second part', placeholder:'Next,…', starters:['Next,…','Another part is…','After that,…'] },
            { key:'evidence', label:'A fact or detail', placeholder:'For instance,…' },
            { key:'explain', label:'Explain it', placeholder:'This means…' }
          ] },
        { key:'body3', title:'Body paragraph — Part 3 (optional)', icon:'3️⃣', inFinal:true, join:'para',
          teach:'Add a third part if your topic needs it, or leave it blank.',
          showTransitions:true,
          fields:[
            { key:'point', label:'Topic sentence — third part', placeholder:'Finally,… (or leave blank)' },
            { key:'evidence', label:'A fact or detail', placeholder:'For example,…' },
            { key:'explain', label:'Explain it', placeholder:'So…' }
          ] },
        { key:'conclusion', title:'Write your conclusion', icon:'🏁', inFinal:true, join:'para',
          teach:'Wrap up by restating your main idea in fresh words and summing up the parts. End with why this topic is interesting or useful to know.',
          fields:[
            { key:'restate', label:'Restate your main idea (new words)', placeholder:'In short,…', starters:['In short,…','To sum up,…','As you can see,…'] },
            { key:'wrap', label:'Sum up the parts', placeholder:'Now you know about…' },
            { key:'call', label:'Why it matters', placeholder:'This is important because…' }
          ] }
      ]
    },

    {
      id:'narrative', name:'Personal Narrative', icon:'✍️',
      blurb:'Tell a true story from your own life.',
      sections:[
        { key:'moment', title:'Pick your moment', icon:'🎯', inFinal:false,
          teach:'A personal narrative is a TRUE story from your life — usually one small moment, not your whole life. The best ones changed you somehow. Think of a time you were scared, proud, surprised, or learned something. Zoom in on ONE moment.',
          fields:[
            { key:'moment', label:'What moment will you write about?', placeholder:'e.g., The first time I rode a bike without training wheels' },
            { key:'sowhat', label:'Why does this moment matter to you?', placeholder:'What did it change, teach you, or make you feel?' }
          ] },
        { key:'details', title:'Gather the details', icon:'🧠', inFinal:false,
          teach:'Stories come alive with the FIVE SENSES. Before you write, jot what you saw, heard, felt, smelled, and how your body felt. These details are what make a reader feel like they’re THERE.',
          fields:[ { key:'details', label:'Sights, sounds, feelings, smells…', placeholder:'• Saw:\n• Heard:\n• Felt:\n• Smelled:\n• My heart / hands / stomach…', big:true } ] },
        { key:'begin', title:'The beginning', icon:'🚀', inFinal:true, join:'para',
          teach:'Drop the reader right into the moment — don’t start with “Hi, my name is.” Set the scene (where/when) and hook them with action or a feeling. SHOW, don’t just tell: instead of “I was nervous,” write “My hands were shaking and my mouth went dry.”',
          showHooks:true,
          fields:[
            { key:'scene', label:'Set the scene — where and when', placeholder:'It was a freezing Saturday morning…' },
            { key:'hook', label:'Hook — start with action or a feeling', placeholder:'Show us the moment beginning.' }
          ] },
        { key:'middle', title:'The middle — what happened', icon:'📈', inFinal:true, join:'para',
          teach:'Tell what happened, step by step, building up to the BIG moment. Use strong verbs (sprinted, whispered, crashed) and keep the details coming. This is the heart of your story — slow down and make us feel it.',
          fields:[
            { key:'buildup', label:'What happened, step by step', placeholder:'Then… After that… Suddenly…', big:true, starters:['Then…','Suddenly…','Just as…','Out of nowhere…'] },
            { key:'climax', label:'The BIG moment', placeholder:'The most exciting / scary / important second.' }
          ] },
        { key:'end', title:'The ending', icon:'🏁', inFinal:true, join:'para',
          teach:'Land the plane. How did the moment end? Then share what you FELT or LEARNED — that’s the “so what” you wrote in step 1. A great ending leaves the reader thinking.',
          fields:[
            { key:'resolve', label:'How did it end?', placeholder:'Finally,…' },
            { key:'lesson', label:'What you felt or learned', placeholder:'That’s when I realized…', starters:['That’s when I realized…','I’ll never forget…','From that day on,…'] }
          ] }
      ]
    },

    {
      id:'bookreport', name:'Book Report', icon:'📖',
      blurb:'Tell about a book you read and what you thought.',
      sections:[
        { key:'book', title:'The book', icon:'📕', inFinal:true, join:'lines',
          teach:'Start with the basics so your reader knows what book you mean. Write the exact title and the author’s name.',
          fields:[
            { key:'title', label:'Book title', placeholder:'e.g., Charlotte’s Web' },
            { key:'author', label:'Author', placeholder:'e.g., E. B. White' },
            { key:'genre', label:'Genre (kind of book)', placeholder:'e.g., fantasy, mystery, nonfiction' }
          ] },
        { key:'summary', title:'What it’s about', icon:'📝', inFinal:true, heading:'Summary', join:'para',
          teach:'Give a SHORT summary — the main thing that happens, in your own words. Don’t retell every page, and don’t spoil the ending! Two or three sentences is plenty. Answer: who is it about, and what’s the big problem or adventure?',
          fields:[ { key:'summary', label:'Quick summary (no big spoilers!)', placeholder:'This book is about…', big:true, starters:['This book is about…','The story follows…','It all starts when…'] } ] },
        { key:'characters', title:'The characters', icon:'👥', inFinal:true, heading:'Main Characters', join:'para',
          teach:'Introduce the main character(s). Who are they? What are they like? Use a describing word or two and maybe an example of something they do.',
          fields:[ { key:'characters', label:'Main character(s) — who and what they’re like', placeholder:'The main character is… They are…', big:true, starters:['The main character is…','My favorite character is… because…'] } ] },
        { key:'setting', title:'The setting', icon:'🗺️', inFinal:true, heading:'Setting', join:'para',
          teach:'The setting is WHERE and WHEN the story happens. A farm? A spaceship? Long ago or the future? A sentence or two.',
          fields:[ { key:'setting', label:'Where and when does it take place?', placeholder:'The story takes place…', starters:['The story takes place…','It is set in…'] } ] },
        { key:'favorite', title:'Your favorite part', icon:'⭐', inFinal:true, heading:'My Favorite Part', join:'para',
          teach:'Pick the part you liked most — the funniest, most exciting, or most surprising moment — and say WHY it stuck with you. This is where YOUR voice shines.',
          fields:[ { key:'favorite', label:'Favorite / most exciting part + why', placeholder:'My favorite part was… because…', big:true, starters:['My favorite part was…','The most exciting part was when…'] } ] },
        { key:'opinion', title:'What you thought', icon:'💭', inFinal:true, heading:'What I Thought', join:'para',
          teach:'Give your honest opinion. Did you like it? What was great, and was anything not so great? Back it up with a reason — “I liked it because…” is way better than just “it was good.”',
          fields:[
            { key:'rating', label:'Your rating', placeholder:'', stars:true },
            { key:'opinion', label:'Did you like it? Why or why not?', placeholder:'I liked this book because…', big:true, starters:['I liked this book because…','I thought it was… because…','One thing I’d change is…'] }
          ] },
        { key:'recommend', title:'Who should read it', icon:'🙌', inFinal:true, heading:'Who Should Read It', join:'para',
          teach:'Finish by telling who would enjoy this book. Kids who love adventure? Animal fans? People who like to laugh? Give a recommendation.',
          fields:[ { key:'recommend', label:'Who would like this book?', placeholder:'I would recommend this book to…', starters:['I would recommend this book to…','This book is perfect for anyone who…'] } ] }
      ]
    }
  ]
};
