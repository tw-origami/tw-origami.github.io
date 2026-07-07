/* Debate Dojo — content data. Prep for argument, rhetoric, and critical thinking.
 * Four INTERACTIVE games:
 *   FALLACY  → spot the logical fallacy in a real-sounding argument
 *   BUILD    → build a solid argument: claim + evidence + reasoning (create!)
 *   APPEAL   → identify the persuasive appeal: ethos, pathos, or logos
 *   REBUTTAL → choose the strongest response to an argument
 */
window.DEBATE = {

  TEACHER: {
    fallacy: {
      how:'Read the argument. It sounds convincing — but something is broken about HOW it argues. Pick the logical fallacy it commits from the choices. Not sure? Tap 📖 Glossary to review the fallacies first.',
      point:'Persuasive-sounding nonsense is everywhere — ads, social media, arguments with friends. Naming the trick is the first defense against it.',
      learn:'Recognizing common logical fallacies — ad hominem, straw man, slippery slope, bandwagon, false dilemma, and more — by how they cheat.',
      explore:'Ask: “What would a FAIR version of this argument look like?” Then hunt for a fallacy in a real ad or a comment section together.'
    },
    build: {
      how:'You’re given a claim. First choose the strongest EVIDENCE to back it up, then the REASONING that explains how the evidence proves the claim. Your full argument assembles below — aim for the “Solid argument!” check.',
      point:'A real argument is more than an opinion. This builds the Claim–Evidence–Reasoning (CER) structure used in English AND science class, piece by piece.',
      learn:'How to construct a convincing argument: state a claim, back it with relevant evidence, and reason out loud how the two connect.',
      explore:'Ask: “Could someone disagree with your evidence, or with your reasoning?” Then have them build a CER argument about a rule they’d change at home or school.'
    },
    appeal: {
      how:'Read the persuasive line. Decide which appeal it uses: ethos (trust/credibility), pathos (emotion), or logos (logic/facts). Pick one. The glossary explains all three if you need it.',
      point:'Every ad and speech mixes three ancient persuasion tools. Spotting them turns kids from targets into critics.',
      learn:'The three rhetorical appeals — ethos, pathos, and logos — and how speakers and marketers use each to convince you.',
      explore:'Ask: “Which appeal is the strongest here — and which is being used to skip past the facts?” Then decode the appeals in a commercial they’ve seen.'
    },
    rebuttal: {
      how:'Read the argument someone makes. Then pick the strongest rebuttal — the response that actually answers their point with logic, instead of dodging it or attacking them.',
      point:'Winning a debate isn’t about the loudest comeback — it’s about the response that truly addresses the other side’s point.',
      learn:'How to respond to an argument fairly and effectively: answer the actual claim with evidence or logic, not insults or distractions.',
      explore:'Ask: “Why are the other options weaker?” Some dodge, some attack the person. Then have them steel-man the other side — argue it as well as they can.'
    }
  },

  SOURCES: [
    { key:'purdue', name:'Purdue OWL — Logic & Argument',
      url:'https://owl.purdue.edu/owl/general_writing/academic_writing/logic_in_argumentative_writing/index.html', note:'Clear explanations of logical fallacies and how to argue well.' },
    { key:'khan', name:'Khan Academy — Rhetoric & Persuasion',
      url:'https://www.khanacademy.org/ela', note:'Lessons on ethos, pathos, logos, and reading arguments critically.' },
    { key:'ncta', name:'ReadWriteThink (NCTE)',
      url:'https://www.readwritethink.org/', note:'Classroom tools for building arguments and analyzing persuasion.' }
  ],

  /* ───── Glossary (📖 popup): fallacies + appeals + debate terms ───── */
  TERMS: [
    { term:'Ad Hominem', def:'Attacking the person making an argument instead of the argument itself.', simple:'“You’re wrong because you’re dumb.” It dodges the point by insulting the person.', ex:'“Don’t listen to her recycling plan — she failed science.”' },
    { term:'Straw Man', def:'Twisting someone’s argument into a weaker, easier-to-attack version.', simple:'You beat up a fake version of what they said, not the real thing.', ex:'“You want a later start? So you want kids to sleep till noon and skip school!”' },
    { term:'Slippery Slope', def:'Claiming one small step will inevitably lead to extreme consequences.', simple:'“If we allow X, then Y, then total disaster!” — with no proof of the chain.', ex:'“If we let students retake one test, soon no one will study at all.”' },
    { term:'Bandwagon', def:'Arguing something is right just because it’s popular.', simple:'“Everyone’s doing it, so it must be good.” Popularity isn’t proof.', ex:'“All the cool kids drink this — so it must be the best.”' },
    { term:'False Dilemma', def:'Pretending there are only two options when more exist.', simple:'“Either/or” — it hides all the choices in the middle.', ex:'“You’re either with us or against us.”' },
    { term:'Hasty Generalization', def:'Jumping to a broad conclusion from too little evidence.', simple:'One or two examples, then a giant claim about everything.', ex:'“My two friends hate broccoli, so nobody likes it.”' },
    { term:'Appeal to Authority', def:'Claiming something is true just because a famous person says so.', simple:'A celebrity or “expert” endorsement used in place of real evidence.', ex:'“A movie star says this pill works, so it must.”' },
    { term:'Circular Reasoning', def:'When the argument’s conclusion just restates its own premise.', simple:'It goes in a circle — “it’s true because it’s true.”', ex:'“He’s trustworthy because he says he never lies.”' },
    { term:'Red Herring', def:'A distraction that changes the subject to avoid the real point.', simple:'Throwing in something off-topic to dodge the question.', ex:'“Why worry about my grades when there’s so much crime in the world?”' },
    { term:'Ethos', def:'A persuasive appeal based on the speaker’s credibility or character.', simple:'“Trust me — I’m qualified.” It persuades by earning your trust.', ex:'“As a doctor with 20 years’ experience, I recommend…”' },
    { term:'Pathos', def:'A persuasive appeal that targets the audience’s emotions.', simple:'It makes you FEEL something — sad, scared, proud, hopeful.', ex:'“For just $1 a day, you can save this hungry puppy.”' },
    { term:'Logos', def:'A persuasive appeal based on logic, facts, and evidence.', simple:'It persuades your BRAIN with reasons and data.', ex:'“Studies show seat belts cut crash deaths by half.”' },
    { term:'Claim', def:'The main point you are arguing is true.', simple:'The stance you’re taking — the thing you want people to agree with.', ex:'“School lunches should be healthier.”' },
    { term:'Evidence', def:'Facts, data, or examples that support a claim.', simple:'The proof you bring to back up your point.', ex:'A study, a statistic, or a real example.' },
    { term:'Reasoning', def:'The explanation of HOW your evidence supports your claim.', simple:'The “this shows that…” — you connect the dots for the reader.', ex:'“This proves healthier food helps kids focus.”' },
    { term:'Rebuttal', def:'A response that argues against an opposing point.', simple:'Your comeback — but a smart one that actually answers their point.', ex:'“You say it’s too expensive, but the long-term savings are bigger.”' }
  ],

  /* ───── GAME 1 · SPOT THE FALLACY ───── */
  FALLACIES: ['Ad Hominem','Straw Man','Slippery Slope','Bandwagon','False Dilemma','Hasty Generalization','Appeal to Authority','Circular Reasoning','Red Herring'],
  SPOT: [
    { text:'“Don’t trust Maya’s idea for the fundraiser — she can’t even keep her locker clean.”', fallacy:'Ad Hominem', why:'It attacks Maya personally (her messy locker) instead of dealing with her actual idea.' },
    { text:'“If we let students use calculators on one quiz, next they’ll want them on every test, then they’ll forget how to add at all!”', fallacy:'Slippery Slope', why:'It claims one small step leads straight to disaster, with no evidence for the chain of events.' },
    { text:'“Everyone in our grade already has this game, so Mom, you HAVE to buy it for me.”', fallacy:'Bandwagon', why:'It argues the game is worth buying only because it’s popular — popularity isn’t a real reason.' },
    { text:'“You either support the new dress code, or you don’t care about our school at all.”', fallacy:'False Dilemma', why:'It pretends there are only two options, ignoring people who care about school but dislike the dress code.' },
    { text:'“So you think we should recycle more? I guess you want to ban all cars and make us live in caves.”', fallacy:'Straw Man', why:'It twists a reasonable point (recycle more) into a ridiculous extreme that’s easier to mock.' },
    { text:'“My cousin got sick after eating sushi once, so sushi is clearly dangerous for everyone.”', fallacy:'Hasty Generalization', why:'It jumps from a single example to a sweeping claim about all sushi and all people.' },
    { text:'“This energy drink must be the healthiest — a famous streamer said it’s his favorite.”', fallacy:'Appeal to Authority', why:'A streamer’s fame isn’t evidence about health; it uses celebrity in place of real proof.' },
    { text:'“The new rule is fair because rules that are fair are the ones we should follow.”', fallacy:'Circular Reasoning', why:'The reason just repeats the claim — it never actually explains why the rule is fair.' },
    { text:'“Sure, I forgot my homework again — but did you SEE how much homework other teachers assign?”', fallacy:'Red Herring', why:'It dodges the missing homework by changing the subject to other teachers.' },
    { text:'“Coach Ramirez’s strategy is bad because he’s always late to practice.”', fallacy:'Ad Hominem', why:'Being late says nothing about whether the strategy works — it attacks the coach, not the plan.' },
    { text:'“Nine out of ten students chose pizza, so pizza is obviously the best food there is.”', fallacy:'Bandwagon', why:'What’s popular isn’t automatically “the best” — that’s the bandwagon trap.' },
    { text:'“If I don’t get a phone this year, my whole future will be ruined and I’ll have no friends ever.”', fallacy:'Slippery Slope', why:'It leaps from “no phone” to total catastrophe with no logical steps in between.' }
  ],

  /* ───── GAME 2 · ARGUMENT BUILDER (Claim–Evidence–Reasoning) ───── */
  CER: [
    { claim:'Schools should give students longer lunch periods.',
      evidences:[
        { text:'A study found students with 30+ minutes to eat were more focused in afternoon classes.', good:true },
        { text:'Most students say lunch is their favorite part of the day.', good:false, note:'popular opinion, but it doesn’t prove longer lunch helps' },
        { text:'The cafeteria serves pizza every Friday.', good:false, note:'true, but totally unrelated to the claim' }
      ],
      reasonings:[
        { text:'This shows that when students aren’t rushed, they eat better and come back ready to learn.', good:true },
        { text:'So lunch should be longer, because longer lunches are just better.', good:false, note:'circular — it repeats the claim instead of explaining it' },
        { text:'Besides, everybody enjoys a nice break.', good:false, note:'vague — it never links the evidence to the claim' }
      ] },
    { claim:'Cities should build more bike lanes.',
      evidences:[
        { text:'Streets that added protected bike lanes saw crashes drop by nearly a third.', good:true },
        { text:'Bikes come in many bright colors.', good:false, note:'irrelevant — color has nothing to do with the claim' },
        { text:'Some people think biking is fun.', good:false, note:'an opinion, not evidence that lanes help' }
      ],
      reasonings:[
        { text:'This shows bike lanes make streets measurably safer for everyone who uses them.', good:true },
        { text:'Therefore we need bike lanes, because bike lanes are needed.', good:false, note:'circular reasoning' },
        { text:'And bikes are cheaper than cars anyway.', good:false, note:'a new point, not reasoning that connects the evidence' }
      ] },
    { claim:'Students should learn a second language early.',
      evidences:[
        { text:'Research shows younger children pick up new languages faster than teens or adults.', good:true },
        { text:'There are thousands of languages in the world.', good:false, note:'a fact, but it doesn’t support starting early' },
        { text:'Language class can be really fun.', good:false, note:'opinion, not proof' }
      ],
      reasonings:[
        { text:'This means starting young gives students a real head start that’s harder to gain later.', good:true },
        { text:'So we should start early because early is the best time.', good:false, note:'circular — restates the claim' },
        { text:'Plus, traveling is exciting.', good:false, note:'off-topic; doesn’t link evidence to claim' }
      ] }
  ],

  /* ───── GAME 3 · ETHOS, PATHOS, LOGOS ───── */
  APPEALS: [
    { key:'Ethos', emoji:'🎓', blurb:'trust / credibility' },
    { key:'Pathos', emoji:'❤️', blurb:'emotion' },
    { key:'Logos', emoji:'🧠', blurb:'logic / facts' }
  ],
  APPEAL_ITEMS: [
    { text:'“As a dentist for 25 years, I can tell you this toothpaste is the one I trust.”', appeal:'Ethos', why:'It leans on the speaker’s expertise and credibility (“a dentist for 25 years”) to earn your trust.' },
    { text:'“Every 10 seconds, a shelter dog loses its last chance. Please — don’t let this one be next.”', appeal:'Pathos', why:'It targets your emotions — sadness and urgency — rather than giving you facts.' },
    { text:'“In tests, cars with this brake system stopped 20 feet sooner than the average car.”', appeal:'Logos', why:'It persuades with data and logic (a measured 20-foot difference).' },
    { text:'“Nine out of ten engineers who tried it switched to our design.”', appeal:'Logos', why:'It uses a statistic and reasoning to make its case — that’s an appeal to logic.' },
    { text:'“Imagine the pride on your grandmother’s face when you walk across that stage.”', appeal:'Pathos', why:'It stirs warm emotion (pride, family) instead of offering evidence.' },
    { text:'“Recommended by the American Academy of Pediatrics, this is a choice you can rely on.”', appeal:'Ethos', why:'It borrows the credibility of a respected authority to build trust.' },
    { text:'“Studies from three universities all reached the same conclusion: it works.”', appeal:'Logos', why:'Multiple studies and evidence appeal to your reason — that’s logos.' },
    { text:'“Don’t let your family shiver through another freezing winter. Act now.”', appeal:'Pathos', why:'Fear and worry for your family are emotional levers — an appeal to pathos.' },
    { text:'“I’ve coached championship teams for two decades, so trust me on this drill.”', appeal:'Ethos', why:'The speaker’s track record and authority are the persuasion — an ethos appeal.' }
  ],

  /* ───── GAME 4 · BEST REBUTTAL ───── */
  REBUTTAL: [
    { argument:'“We shouldn’t start recycling at school — it costs money to set up the bins.”',
      best:'Actually, many towns give recycling bins to schools for free, and recycling can cut trash-pickup costs over time.',
      distractors:['Whoever said that clearly doesn’t care about the planet at all.','Well, littering is a much bigger problem than recycling anyway.','Everyone knows recycling is good, so we should just do it.'],
      why:'The strong rebuttal answers the actual objection (cost) with a fact. The others attack the person, change the subject, or just appeal to popularity.' },
    { argument:'“Homework should be banned because kids need more free time.”',
      best:'Free time matters, but a small amount of homework helps lessons stick — the goal is the right amount, not zero.',
      distractors:['Anyone who wants to ban homework is just lazy.','What about all the other problems at school, though?','My favorite teacher never gives homework, so it must be bad.'],
      why:'The best response takes the point seriously and offers a reasoned middle ground. The rest insult, distract, or over-generalize from one example.' },
    { argument:'“Our team lost, so the coach is obviously terrible at his job.”',
      best:'One loss isn’t enough to judge a coach — look at the whole season and how the team improved.',
      distractors:['You only say that because you got benched last game.','At least our uniforms look better than theirs.','Everybody agrees the coach is bad, so it’s settled.'],
      why:'The strong rebuttal points out the hasty generalization and asks for more evidence. The others attack the person, change the subject, or bandwagon.' },
    { argument:'“Phones should never be allowed in class — they’re only a distraction.”',
      best:'They can distract, but with clear rules phones can also be useful tools for quick research and learning apps.',
      distractors:['People who say that are stuck in the past.','Yeah, but the cafeteria food is way worse.','All my friends use phones in class, so it’s fine.'],
      why:'The best answer acknowledges the concern and adds a reasoned counter-benefit. The others attack, distract, or lean on popularity.' }
  ]
};
