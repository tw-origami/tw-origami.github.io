/* Essay Builder — content data. Prep for high-school academic writing.
 * Four INTERACTIVE games:
 *   ARCHITECT  → order the scrambled parts of an essay into a real structure
 *   BUILDER    → construct your own thesis from a side + two reasons (create!)
 *   EVIDENCE   → pick the evidence that actually proves a claim
 *   TRANSITION → choose the transition that fits how two ideas connect
 */
window.ESSAY = {

  TEACHER: {
    architect: {
      how:'The skeleton at the top shows where each part of an essay goes. Read the scrambled pieces below and tap the one that belongs in the highlighted slot — hook first, then thesis, then your reasons, then the conclusion. Fill all five to build the essay.',
      point:'Lots of kids can write good sentences but freeze when it’s time to organize a whole essay. This makes the skeleton of an academic essay visible and hands-on.',
      learn:'The shape of a five-part essay — hook, thesis, two body reasons with evidence, and a conclusion — and the job each part does.',
      explore:'Ask: “Which sentence is the thesis, and how do you know?” Then have them find the thesis in an article, and check that every paragraph really supports it.'
    },
    builder: {
      how:'Pick a side of the debate, then tap TWO reasons that back it up. The builder assembles a real thesis statement out of your choices. Swap reasons to see it change, and ⭐ save the ones you like.',
      point:'A thesis isn’t a fact or a feeling — it’s an arguable claim supported by reasons. Building one by hand is the fastest way to understand that.',
      learn:'How to write a strong thesis: take a clear side, then give the reasons that will become your body paragraphs.',
      explore:'Ask: “Could someone reasonably disagree with this?” If not, it’s just a fact, not an argument. Have them turn a dull topic into a thesis worth defending.'
    },
    evidence: {
      how:'Read the claim at the top. Then choose the piece of evidence that best proves it — not just any fact about the topic, but the one that actually backs up the point.',
      point:'Weak essays grab any fact that mentions the topic. Strong essays pick evidence that directly proves the specific claim being made.',
      learn:'Telling strong, relevant evidence apart from facts that are true but off-point or too weak to prove anything.',
      explore:'Ask: “WHY does this evidence prove the claim?” Great writers always explain that link — it’s called analysis. Have them add a “this shows that…” sentence.'
    },
    transition: {
      how:'Read the two sentences. Figure out how they connect — is it a contrast? a cause? an added point? Then pick the transition word that signals that exact relationship.',
      point:'Transitions are the glue of an essay. The right one tells the reader precisely how two ideas relate; the wrong one just confuses them.',
      learn:'The main types of transitions — contrast, cause/effect, addition, example, and sequence — and when to reach for each.',
      explore:'Ask: “What relationship is this transition showing?” Then have them reread a paragraph they wrote and add a transition between two ideas that felt choppy.'
    }
  },

  SOURCES: [
    { key:'purdue', name:'Purdue OWL — Essay Writing',
      url:'https://owl.purdue.edu/owl/general_writing/', note:'The writing lab most high schools point you to for thesis statements, structure, and citations.' },
    { key:'khan', name:'Khan Academy — Writing',
      url:'https://www.khanacademy.org/ela', note:'Free lessons on building arguments, using evidence, and organizing essays.' },
    { key:'readwritethink', name:'ReadWriteThink (NCTE)',
      url:'https://www.readwritethink.org/', note:'Classroom-tested writing tools and interactives from the National Council of Teachers of English.' }
  ],

  /* ───── Glossary (📖 popup) ───── */
  TERMS: [
    { term:'Thesis', def:'The one-sentence main argument of your essay, usually at the end of the introduction.', simple:'Your whole essay boiled down to one sentence that takes a side. Everything else exists to prove it.', ex:'“Schools should start later because it improves teens’ health, focus, and grades.”' },
    { term:'Hook', def:'The opening line that grabs the reader’s attention.', simple:'The bait at the very start — a surprising fact, question, or image that makes someone want to keep reading.', ex:'“Millions of teens stumble into first period half asleep.”' },
    { term:'Topic Sentence', def:'The first sentence of a body paragraph, stating that paragraph’s one main point.', simple:'A mini-thesis for a single paragraph — it tells the reader what that paragraph will prove.', ex:'“First, teens are wired to fall asleep late at night.”' },
    { term:'Evidence', def:'Facts, quotes, examples, or data used to back up a claim.', simple:'The proof. Anyone can make a claim; evidence is what shows it’s actually true.', ex:'“A sleep study found teens need 8–10 hours a night.”' },
    { term:'Analysis', def:'Your explanation of HOW a piece of evidence proves your point.', simple:'The “so what?” — don’t just drop a fact, explain why it matters to your argument.', ex:'“This shows early bells cut into the sleep teens actually need.”' },
    { term:'Transition', def:'A word or phrase that connects ideas and shows how they relate.', simple:'The bridge between ideas — words like “however,” “therefore,” or “for example” that keep writing from feeling choppy.', ex:'“However,” “In addition,” “As a result.”' },
    { term:'Conclusion', def:'The final paragraph that restates the thesis and leaves a lasting thought.', simple:'The wrap-up — remind the reader of your point and end with something memorable. No new evidence here.', ex:'“For these reasons, a later start would help students thrive.”' },
    { term:'Claim', def:'A statement you argue is true and then support with evidence.', simple:'A point you’re trying to prove. Your thesis is your biggest claim; topic sentences are smaller ones.', ex:'“Homework causes stress.”' },
    { term:'Counterargument', def:'The opposing view, which a strong essay names and then answers.', simple:'The other side’s best point. Naming it — then refuting it — makes YOUR argument stronger, not weaker.', ex:'“Some say homework builds discipline, but…”' },
    { term:'Citation', def:'A note showing where a fact or quote came from.', simple:'Giving credit to your source so readers know your evidence is real (and you’re not stealing ideas).', ex:'“(Smith, 2021)” or a footnote.' }
  ],

  /* ───── GAME 1 · ESSAY ARCHITECT ─────
   * Order the parts. Roles are unique within an essay, so the right card for
   * the highlighted slot is unambiguous. */
  ROLES: [
    { role:'Hook', hint:'grabs attention' },
    { role:'Thesis', hint:'your main argument' },
    { role:'First reason', hint:'point + evidence' },
    { role:'Second reason', hint:'point + evidence' },
    { role:'Conclusion', hint:'wraps it up' }
  ],
  ESSAYS: [
    { topic:'Should schools start later?', parts:[
      'Every morning, millions of teenagers stumble into first period barely awake.',
      'Schools should start later in the day because it improves students’ health, focus, and grades.',
      'First, sleep scientists say teens are wired to fall asleep late, so early bells rob them of the rest they need.',
      'In addition, well-rested students pay attention longer and score higher on tests.',
      'For these reasons, pushing back the first bell would help students learn and feel their best.' ] },
    { topic:'Should schools require uniforms?', parts:[
      'Imagine never having to decide what to wear to school again.',
      'Schools should require uniforms because they save time, cut down on bullying, and build a sense of community.',
      'First, a set outfit means no stressful morning choices and fewer clothing distractions in class.',
      'Uniforms also make it harder to tease classmates over expensive or unusual clothes.',
      'In the end, uniforms could make school mornings simpler and school days a little kinder.' ] },
    { topic:'Should kids wait for a smartphone?', parts:[
      'By age twelve, most kids are already begging for a phone of their own.',
      'Kids should wait until high school for a smartphone because it protects their focus, sleep, and safety.',
      'For one thing, constant notifications make it far harder to concentrate on homework.',
      'Late-night scrolling also steals the sleep that growing brains badly need.',
      'Waiting a few more years would let kids enjoy childhood before the endless pull of a screen.' ] },
    { topic:'Should school be year-round?', parts:[
      'What if summer vacation lasted three weeks instead of three months?',
      'Schools should switch to a year-round calendar because it prevents learning loss and eases stress.',
      'First, long summers cause the “summer slide,” where students forget much of what they learned.',
      'Shorter, more frequent breaks also give students regular rest without falling behind.',
      'A year-round schedule could keep learning steady and give everyone a healthier rhythm.' ] }
  ],

  /* ───── GAME 2 · THESIS BUILDER ─────
   * Pick a side, then two reasons → assemble a real thesis. */
  THESIS_TOPICS: [
    { topic:'Should students get less homework?',
      sides:[
        { stance:'Students should get less homework', reasons:['it gives them time to rest and recharge','too much homework causes stress and burnout','families need time together in the evening','kids learn from hobbies and play, too'] },
        { stance:'Students should keep regular homework', reasons:['practice helps new lessons actually stick','it builds responsibility and time-management','it prepares them for harder classes ahead','it lets parents see what’s being taught'] }
      ] },
    { topic:'Should phones be allowed in class?',
      sides:[
        { stance:'Phones should be banned during class', reasons:['they pull attention away from the lesson','they make cheating far too easy','constant notifications interrupt learning','face-to-face focus helps students remember more'] },
        { stance:'Phones should be allowed during class', reasons:['they are powerful tools for quick research','the right apps make learning interactive','students need to practice using them responsibly','they let families reach kids in an emergency'] }
      ] },
    { topic:'Should P.E. be required every year?',
      sides:[
        { stance:'P.E. should be required every year', reasons:['it keeps students healthy and active','exercise boosts focus and mood','it teaches teamwork and fair play','it builds habits that last a lifetime'] },
        { stance:'P.E. should be optional', reasons:['students have different interests and needs','it frees up time for other subjects','not everyone enjoys competitive sports','kids can stay active outside of school'] }
      ] },
    { topic:'Should schools sell junk food?',
      sides:[
        { stance:'Schools should stop selling junk food', reasons:['healthy food helps students concentrate','it fights the rise in childhood obesity','schools should model good habits','better fuel means better energy for class'] },
        { stance:'Schools should keep selling snacks', reasons:['students deserve some freedom of choice','snack sales raise money for school programs','banning it just pushes it off campus','moderation matters more than a total ban'] }
      ] }
  ],

  /* ───── GAME 3 · EVIDENCE MATCH ───── */
  EVIDENCE: [
    { claim:'Reading for fun builds a bigger vocabulary.',
      correct:'A study found students who read 20 minutes a day knew thousands more words than those who didn’t.',
      distractors:['Many people like to read at the beach in the summer.','Some novels are more than 500 pages long.','Libraries are usually quiet places.'],
      why:'The study directly links reading time to word knowledge — that proves the claim. The others mention reading but never show it grows vocabulary.' },
    { claim:'Recess helps students focus in class.',
      correct:'Teachers reported that students who had a midday recess made fewer mistakes all afternoon.',
      distractors:['Recess is usually held outside on a playground.','Kids enjoy playing games with their friends.','Some schools hold recess right before lunch.'],
      why:'Fewer afternoon mistakes ties recess to better focus. The rest describe recess but don’t prove it helps concentration.' },
    { claim:'Planting trees in cities helps cool them down.',
      correct:'Neighborhoods with more trees measured up to 10°F cooler on hot days than bare ones nearby.',
      distractors:['Trees come in thousands of different species.','People love resting in the shade of a big tree.','Some cities are famous for their parks.'],
      why:'The temperature difference proves trees cool a city. The others are true but show no cooling effect.' },
    { claim:'Eating breakfast helps students do better in school.',
      correct:'Kids who ate breakfast scored higher on morning quizzes than kids who skipped it.',
      distractors:['Cereal is a very common breakfast food.','Some people don’t feel hungry early in the morning.','Breakfast is usually served before noon.'],
      why:'Comparing the quiz scores of breakfast-eaters and skippers proves the point. The others are just facts about breakfast.' },
    { claim:'Bike lanes make streets safer for everyone.',
      correct:'Streets that added protected bike lanes saw crashes drop by nearly a third the next year.',
      distractors:['Bikes are usually cheaper to own than cars.','Many cities are adding new bike lanes.','Some people bike all the way to work.'],
      why:'A measured drop in crashes is direct proof of “safer.” The others are about bikes but show no safety effect.' },
    { claim:'Group projects build students’ communication skills.',
      correct:'After a group project, students said they got better at explaining their ideas and listening to others.',
      distractors:['Group projects can be assigned in almost any subject.','Some students would rather work alone.','Projects usually come with a deadline.'],
      why:'Explaining ideas and listening IS communication — that proves the claim. The others never touch the skill.' }
  ],

  /* ───── GAME 4 · TRANSITION LAB ───── */
  RELATIONS: ['Contrast','Cause & effect','Addition','Example','Sequence'],
  TRANSITIONS: [
    { before:'The team practiced every single day.', after:'they still lost in the very first round.', relation:'Contrast',
      correct:'However,', options:['However,','Therefore,','For example,','First,'],
      why:'The result is the opposite of what you’d expect from all that practice — that’s a contrast, so “However” fits.' },
    { before:'It rained hard all week long.', after:'the big game was moved to Saturday.', relation:'Cause & effect',
      correct:'As a result,', options:['As a result,','However,','For instance,','Meanwhile,'],
      why:'The rain CAUSED the game to move — “As a result” signals cause and effect.' },
    { before:'Exercise makes your body stronger.', after:'it lifts your mood and lowers stress.', relation:'Addition',
      correct:'In addition,', options:['In addition,','However,','Therefore,','For example,'],
      why:'The second point ADDS another benefit — “In addition” signals you’re piling on more support.' },
    { before:'Many animals have clever defenses.', after:'the pufferfish puffs up to scare off predators.', relation:'Example',
      correct:'For example,', options:['For example,','However,','As a result,','In contrast,'],
      why:'The pufferfish is a specific EXAMPLE of the general idea — “For example” fits.' },
    { before:'Mix the flour and eggs into a smooth batter.', after:'pour it onto the hot griddle.', relation:'Sequence',
      correct:'Next,', options:['Next,','However,','For example,','In contrast,'],
      why:'These are steps in order — “Next” signals the sequence of what to do.' },
    { before:'The new phone has a gorgeous screen.', after:'its battery dies in just a few hours.', relation:'Contrast',
      correct:'On the other hand,', options:['On the other hand,','Therefore,','In addition,','First,'],
      why:'A strong point followed by a downside is a contrast — “On the other hand” fits.' },
    { before:'She studied every night for a whole month.', after:'she aced the final exam.', relation:'Cause & effect',
      correct:'Therefore,', options:['Therefore,','However,','For example,','Meanwhile,'],
      why:'The studying led to the result — “Therefore” signals cause and effect.' },
    { before:'Recycling saves natural resources.', after:'it cuts down on pollution.', relation:'Addition',
      correct:'Furthermore,', options:['Furthermore,','However,','For instance,','Finally,'],
      why:'The second benefit adds to the first — “Furthermore” signals addition.' }
  ]
};
