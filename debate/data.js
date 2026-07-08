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
    { term:'Rebuttal', def:'A response that argues against an opposing point.', simple:'Your comeback — but a smart one that actually answers their point.', ex:'“You say it’s too expensive, but the long-term savings are bigger.”' },
    { term:'Post Hoc (False Cause)', def:'Assuming that because one thing happened before another, the first caused the second.', simple:'“It happened after, so it must be because of it.” Order alone isn’t proof of cause.', ex:'“I washed my car, then it rained — so washing it caused the rain.”' },
    { term:'Tu Quoque (Whataboutism)', def:'Dodging a criticism by pointing out that the critic does the same thing.', simple:'“Well, YOU do it too!” — it deflects instead of answering the point.', ex:'“You can’t tell me to slow down, you speed all the time!”' },
    { term:'Loaded Question', def:'A question with an unfair assumption built in, so any answer traps you.', simple:'A trick question that assumes something bad about you before you even answer.', ex:'“Have you stopped copying homework yet?”' },
    { term:'Appeal to Ignorance', def:'Claiming something is true just because it hasn’t been proven false (or the reverse).', simple:'“You can’t prove it’s NOT true, so it must be true.” Missing proof isn’t proof.', ex:'“No one’s proven aliens aren’t here, so they must be.”' },
    { term:'Bias', def:'A leaning toward one side that can make an argument or source unfair.', simple:'A slant — when someone favors one side and it colors what they say.', ex:'A team’s own coach isn’t a neutral judge of that team.' },
    { term:'Concession', def:'Admitting a fair point from the other side before you answer it.', simple:'Saying “you’re right about that part, but…” — it makes you look reasonable and strengthens your case.', ex:'“Yes, it costs money — but it saves more over time.”' }
  ],

  /* ───── GAME 1 · SPOT THE FALLACY ───── */
  FALLACIES: ['Ad Hominem','Straw Man','Slippery Slope','Bandwagon','False Dilemma','Hasty Generalization','Appeal to Authority','Circular Reasoning','Red Herring','Post Hoc','Tu Quoque','Loaded Question','Appeal to Ignorance'],
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
    { text:'“If I don’t get a phone this year, my whole future will be ruined and I’ll have no friends ever.”', fallacy:'Slippery Slope', why:'It leaps from “no phone” to total catastrophe with no logical steps in between.' },
    { text:'“Ignore the new kid’s science-fair idea — he just moved here and barely knows anyone.”', fallacy:'Ad Hominem', why:'Being new says nothing about whether the idea is good; it targets the person, not the science.' },
    { text:'“Why would we take budget advice from him? He wears the same hoodie every single day.”', fallacy:'Ad Hominem', why:'His clothing has nothing to do with his budget plan — it’s a personal attack.' },
    { text:'“You want salad options in the cafeteria? So you want to ban pizza and force everyone to eat rabbit food!”', fallacy:'Straw Man', why:'It twists “add salad” into “ban pizza,” a distorted, easier-to-attack version of the point.' },
    { text:'“Oh, you support a longer passing period? I guess you just want kids wandering the halls all day doing nothing.”', fallacy:'Straw Man', why:'It exaggerates a small request into an absurd one that was never made.' },
    { text:'“If the teacher accepts one late essay, soon no one will turn anything in on time and grades will collapse.”', fallacy:'Slippery Slope', why:'It assumes one exception triggers total chaos, skipping every step in between.' },
    { text:'“This app has ten million downloads, so it’s obviously the safest one to use.”', fallacy:'Bandwagon', why:'Popularity (downloads) isn’t the same as safety — that’s the bandwagon trap.' },
    { text:'“Our whole friend group is skipping the meeting, so it clearly doesn’t matter.”', fallacy:'Bandwagon', why:'What the group does isn’t evidence about whether the meeting matters.' },
    { text:'“Either we cancel the field trip completely, or we accept that someone’s going to get hurt.”', fallacy:'False Dilemma', why:'It offers only two extremes and ignores safe middle options like better supervision.' },
    { text:'“The first two episodes were boring, so the entire series is a total waste of time.”', fallacy:'Hasty Generalization', why:'It draws a big conclusion about the whole show from a tiny sample of it.' },
    { text:'“A kid from that school was rude to me once, so everyone there must be rude.”', fallacy:'Hasty Generalization', why:'One person’s behavior can’t fairly stand in for an entire school.' },
    { text:'“This diet definitely works — a famous singer swears by it.”', fallacy:'Appeal to Authority', why:'A singer’s fame isn’t medical evidence; it uses celebrity in place of proof.' },
    { text:'“This is the best book ever, because nothing else is as good as it is.”', fallacy:'Circular Reasoning', why:'The reason just restates the claim — it never gives an actual reason.' },
    { text:'“You’re asking why I failed the quiz? Did you know the school Wi-Fi has been terrible lately?”', fallacy:'Red Herring', why:'The Wi-Fi is an off-topic distraction that dodges the real question about the quiz.' },
    { text:'“I wore my lucky socks and we won the game, so the socks are what made us win.”', fallacy:'Post Hoc', why:'The socks came before the win, but that doesn’t mean they caused it — that’s false cause.' },
    { text:'“Ever since the new principal arrived, it’s rained a lot. She must be bad luck.”', fallacy:'Post Hoc', why:'Two things happening in order isn’t proof one caused the other.' },
    { text:'“I started drinking this smoothie and then aced my test, so the smoothie made me smarter.”', fallacy:'Post Hoc', why:'The smoothie came first, but studying — not the drink — is the likely cause.' },
    { text:'“You’re telling ME not to text and walk? I’ve seen you do it a hundred times!”', fallacy:'Tu Quoque', why:'It dodges the point by accusing the other person of the same thing, instead of answering it.' },
    { text:'“How can Mom say I stay up too late when Dad does the exact same thing?”', fallacy:'Tu Quoque', why:'Whether Dad does it doesn’t change whether the advice is correct — it just deflects.' },
    { text:'“So, are you going to keep cheating on your homework, or finally start being honest?”', fallacy:'Loaded Question', why:'It sneaks in the assumption that you were cheating — any answer makes you look guilty.' },
    { text:'“Why do you always ruin every single group project?”', fallacy:'Loaded Question', why:'It assumes you always ruin projects before you’ve even responded.' },
    { text:'“No one has ever proven that ghosts aren’t real, so they must exist.”', fallacy:'Appeal to Ignorance', why:'A lack of disproof isn’t proof — you can’t conclude something is true just because it isn’t disproven.' },
    { text:'“You can’t prove the new student is trustworthy, so we shouldn’t trust them at all.”', fallacy:'Appeal to Ignorance', why:'Missing proof of trustworthiness isn’t proof of the opposite.' }
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
      ] },
    { claim:'Schools should teach students how to manage money.',
      evidences:[
        { text:'A survey found most teens graduate without knowing how to budget or read a paycheck.', good:true },
        { text:'Money is used in almost every country on Earth.', good:false, note:'true, but it doesn’t support teaching it in school' },
        { text:'Some people are just naturally good with money.', good:false, note:'an opinion, not evidence' }
      ],
      reasonings:[
        { text:'This shows students are leaving school missing a skill they’ll use for the rest of their lives.', good:true },
        { text:'So they should learn it because money skills are important to learn.', good:false, note:'circular — repeats the claim' },
        { text:'Besides, math class is already hard enough.', good:false, note:'off-topic; doesn’t connect to the evidence' }
      ] },
    { claim:'Communities should protect their local parks.',
      evidences:[
        { text:'Neighborhoods with parks nearby report lower stress and more daily exercise.', good:true },
        { text:'Parks usually have grass and some trees.', good:false, note:'irrelevant description, not support' },
        { text:'A lot of people say they enjoy parks.', good:false, note:'popular opinion, not proof' }
      ],
      reasonings:[
        { text:'This shows parks directly improve the health of the people who live around them.', good:true },
        { text:'Therefore parks should be protected because they’re worth protecting.', good:false, note:'circular reasoning' },
        { text:'And the leaves look pretty in the fall.', good:false, note:'off-topic; ignores the evidence' }
      ] },
    { claim:'Students should get short breaks during long classes.',
      evidences:[
        { text:'Studies show attention drops sharply after about 20 minutes of nonstop focus.', good:true },
        { text:'Classes are held in rooms with desks and chairs.', good:false, note:'irrelevant to the claim' },
        { text:'Pretty much everybody enjoys a break.', good:false, note:'opinion, not evidence' }
      ],
      reasonings:[
        { text:'This means a short break resets focus so the rest of class isn’t wasted staring blankly.', good:true },
        { text:'So breaks help because breaks are helpful.', good:false, note:'circular — restates itself' },
        { text:'Plus, lunch is the best part of the day.', good:false, note:'off-topic' }
      ] },
    { claim:'Libraries should stay open later in the evening.',
      evidences:[
        { text:'A city that extended library hours saw a big jump in teens using it for homework.', good:true },
        { text:'Libraries hold thousands of books.', good:false, note:'a fact, but it doesn’t support later hours' },
        { text:'Reading is a really nice hobby.', good:false, note:'opinion, not evidence' }
      ],
      reasonings:[
        { text:'This shows longer hours give students who are busy after school a quiet place to work.', good:true },
        { text:'Therefore hours should be longer because longer hours are better.', good:false, note:'circular reasoning' },
        { text:'Also, the library is usually pretty quiet.', good:false, note:'off-topic; ignores the evidence' }
      ] },
    { claim:'Sports teams should rotate who gets to be captain.',
      evidences:[
        { text:'Groups that shared leadership roles reported members felt more motivated and included.', good:true },
        { text:'Captains often wear a special armband or “C” on their jersey.', good:false, note:'irrelevant detail' },
        { text:'Being captain is a lot of fun.', good:false, note:'opinion, not proof' }
      ],
      reasonings:[
        { text:'This shows spreading the role builds motivation and leadership across the whole team.', good:true },
        { text:'So we should rotate captains because rotating captains is a good idea.', good:false, note:'circular reasoning' },
        { text:'Besides, everybody likes winning games.', good:false, note:'off-topic' }
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
    { text:'“I’ve coached championship teams for two decades, so trust me on this drill.”', appeal:'Ethos', why:'The speaker’s track record and authority are the persuasion — an ethos appeal.' },
    { text:'“Trusted by teachers across the country for more than 30 years.”', appeal:'Ethos', why:'It leans on a long, trusted reputation to build credibility.' },
    { text:'“As the team’s longtime captain, I’ve earned the right to call this play.”', appeal:'Ethos', why:'It persuades through the speaker’s experience and standing — an ethos appeal.' },
    { text:'“Our founder is a former NASA engineer, so you know the science is solid.”', appeal:'Ethos', why:'It borrows the founder’s credentials to make you trust the product.' },
    { text:'“Picture your little sister’s face if she opens an empty box this holiday.”', appeal:'Pathos', why:'It works on your emotions — guilt and love — not on evidence.' },
    { text:'“Thousands of families will go cold and hungry tonight. You can change that.”', appeal:'Pathos', why:'It stirs sympathy and urgency to move you, rather than presenting data.' },
    { text:'“Remember how proud you felt crossing that finish line? Chase that feeling again.”', appeal:'Pathos', why:'It appeals to pride and nostalgia — pure emotion.' },
    { text:'“Don’t let another lonely senior spend the holidays with no one to call.”', appeal:'Pathos', why:'It targets your compassion and guilt — an emotional appeal.' },
    { text:'“Switching saved the average family $340 a year across our study of 5,000 homes.”', appeal:'Logos', why:'A specific number from a large study appeals to logic and evidence.' },
    { text:'“If we recycle just half our waste, the landfill lasts twice as long — that’s simple math.”', appeal:'Logos', why:'It reasons from numbers and cause-and-effect — an appeal to logic.' },
    { text:'“Three out of four users finished the course when lessons were under ten minutes.”', appeal:'Logos', why:'It uses a statistic and reasoning to make its point.' },
    { text:'“The bridge holds 40 tons and the truck weighs 12, so it’s well within the limit.”', appeal:'Logos', why:'It persuades with facts and arithmetic — a logos appeal.' }
  ],

  /* ───── GAME 4 · BEST REBUTTAL ───── */
  REBUTTAL: [
    { argument:'“We shouldn’t start recycling at school — it costs money to set up the bins.”',
      best:'Actually, many towns give recycling bins to schools for free, and recycling can cut trash-pickup costs over time.',
      distractors:['Honestly, anyone who whines about paying for a few bins clearly doesn’t care one bit about the planet or our future.','Sure, but littering over at the park is a much bigger problem than recycling, so let’s talk about that instead.','Come on, everybody already knows recycling is a good thing, so there’s really no reason to sit here debating it at all.'],
      why:'The strong rebuttal answers the actual objection (cost) with a fact. The others attack the person, change the subject, or just appeal to popularity.' },
    { argument:'“Homework should be banned because kids need more free time.”',
      best:'Free time matters, but a small amount of homework helps lessons stick — the goal is the right amount, not zero.',
      distractors:['Let’s be real — anybody who wants to ban homework completely is just lazy and looking for an excuse to slack off.','Honestly, what about the crowded hallways and the awful cafeteria food? Those seem like way bigger problems at school.','My favorite teacher never assigns a single bit of homework, and her class is great, so homework must just be a bad thing.'],
      why:'The best response takes the point seriously and offers a reasoned middle ground. The rest insult, distract, or over-generalize from one example.' },
    { argument:'“Our team lost, so the coach is obviously terrible at his job.”',
      best:'One loss isn’t enough to judge a coach — look at the whole season and how the team improved.',
      distractors:['You’re just defending him because you’re his favorite and scared of getting benched.','Whatever — at least our team’s uniforms look way cooler than the boring ones the other school wears.','Come on, pretty much everyone already agrees the coach is bad, so it’s basically settled by now.'],
      why:'The strong rebuttal points out the hasty generalization and asks for more evidence. The others attack the person, change the subject, or bandwagon.' },
    { argument:'“Phones should never be allowed in class — they’re only a distraction.”',
      best:'They can distract, but with clear rules phones can also be useful tools for quick research and learning apps.',
      distractors:['People who want phones banned are just stuck in the past and too old to get how kids actually learn these days.','Sure, maybe — but have you tasted the cafeteria food lately? That’s honestly a way bigger problem we should fix first.','Pretty much all of my friends already use their phones in class, so clearly it’s totally fine and not a big deal at all.'],
      why:'The best answer acknowledges the concern and adds a reasoned counter-benefit. The others attack, distract, or lean on popularity.' },
    { argument:'“We shouldn’t start a school garden — nobody will take care of it.”',
      best:'Actually, the science club already offered to run it, and it can be built into class projects.',
      distractors:['Honestly, only a super lazy person would ever be against planting a nice little garden.','Speaking of eyesores, have you seen the parking lot? It’s a total mess and honestly way uglier.','Come on, pretty much everyone I’ve talked to wants a garden, so let’s just go build it already.'],
      why:'The strong rebuttal answers the real worry (upkeep) with a concrete plan. The others attack, distract, or bandwagon.' },
    { argument:'“Video games are a complete waste of time.”',
      best:'Some games actually build problem-solving and teamwork — it depends on the game and how long you play.',
      distractors:['People who call games a waste are usually just old and totally out of touch with kids.','Okay, but what about all the hours everyone spends staring at the TV every single night, though?','Every single one of my friends plays video games nonstop, so there’s no way it’s a waste of anyone’s time.'],
      why:'The best answer draws a reasoned distinction. The others insult, change the subject, or lean on popularity.' },
    { argument:'“Our class shouldn’t recycle — one person will just put trash in the wrong bin.”',
      best:'One slip-up doesn’t ruin the effort — clear labels and a quick reminder fix most mix-ups.',
      distractors:['Honestly, that’s about the dumbest reason to skip recycling that I’ve ever heard anyone make.','Speaking of trash, have you even looked at the hallways lately? They’re absolutely filthy right now.','Nobody else in the whole school worries about it at all, so why should our class even bother, really?'],
      why:'The strong rebuttal addresses the objection head-on. The rest attack, distract, or bandwagon.' },
    { argument:'“Longer P.E. is pointless because not everyone likes sports.”',
      best:'P.E. can be more than sports — walking, dance, and yoga keep everyone active, not just athletes.',
      distractors:['You’re only calling P.E. pointless because you’re bad at sports and don’t want to play.','Sure, but what about how boring math class is every single day? That seems like a way bigger issue.','Almost every kid I know can’t stand P.E., so we should honestly just cut the whole thing already.'],
      why:'The best response reframes the concern with a real solution. The others attack, distract, or over-generalize.' },
    { argument:'“There’s no point voting in the student election — one vote never matters.”',
      best:'Close elections are often decided by a handful of votes, and turnout shows leaders what students care about.',
      distractors:['Let’s be honest, the people who don’t bother voting are just lazy and want one more excuse to do absolutely nothing.','Anyway, can we talk about how the vending machines are always broken? That’s the thing that actually affects us every day.','Honestly, nobody I know ever votes in these student elections, so I don’t get why anyone would even bother trying at all.'],
      why:'The strong rebuttal answers the “one vote” claim with real reasoning. The others attack, distract, or bandwagon.' },
    { argument:'“Summer homework is a great idea — kids forget everything otherwise.”',
      best:'A little review helps, but piling on full assignments burns kids out — light, optional practice is the balance.',
      distractors:['Come on, only a total teacher’s pet who loves showing off would ever actually agree that summer homework is a good idea.','Sure, but what about how ridiculously short summer break already is? That’s what we should really be complaining about here.','Literally my entire class hates the idea of summer homework, so that basically proves it’s a terrible plan for everybody.'],
      why:'The best answer weighs both sides and offers a middle ground. The others insult, distract, or over-generalize.' },
    { argument:'“We shouldn’t have a longer lunch — kids will just waste the extra time.”',
      best:'More time also means kids actually finish eating and get a real break, which helps them focus afterward.',
      distractors:['Anyone who wants a longer lunch is honestly just looking for an easy excuse to slack off and do nothing.','Speaking of wasting time, have you seen how long the bus line takes every single afternoon lately, though?','Come on, basically every single kid in the whole school wants a longer lunch, so we should just make it happen.'],
      why:'The strong rebuttal answers the “wasted time” worry with a real benefit. The others attack, change the subject, or bandwagon.' },
    { argument:'“School should start later because teens don’t get enough sleep.”',
      best:'Teens do need sleep, but a later start also pushes back sports and buses — the fix has to consider both.',
      distractors:['Only a lazy teenager who never wants to get out of bed would ever ask for a later school start time.','Honestly, what about how bad the cafeteria breakfast is? That seems like a way more urgent problem to me.','Practically everyone I know wants school to start later, so honestly it’s just the obvious right call for us.'],
      why:'The best answer takes the point seriously and weighs the trade-offs. The others insult, distract, or bandwagon.' },
    { argument:'“We should ban junk food from the vending machines — it’s unhealthy.”',
      best:'Cutting the worst options makes sense, but leaving a few choices and teaching balance beats a total ban.',
      distractors:['People who want to ban junk food are just control freaks who can’t stand anyone else having any fun.','Sure, but what about the greasy pizza they serve at lunch every day? That’s honestly way worse than one candy bar.','Almost nobody actually eats the healthy stuff anyway, so there’s really no point in even offering it at all.'],
      why:'The strong rebuttal offers a balanced middle path. The others attack, change the subject, or over-generalize.' },
    { argument:'“There’s no reason to learn cursive anymore — everyone types now.”',
      best:'Typing is common, but handwriting still helps with note-taking and reading old documents, so it isn’t useless.',
      distractors:['Honestly, anyone who still defends cursive is just old-fashioned and probably afraid of any new technology.','Honestly, what about how nobody can do long division by hand either? Why single out cursive as the problem?','None of my friends can even read cursive anymore, so obviously it’s a completely pointless thing to keep teaching.'],
      why:'The best answer gives real reasons handwriting still matters. The others attack, distract, or over-generalize.' },
    { argument:'“We shouldn’t adopt school uniforms — they crush kids’ individuality.”',
      best:'Uniforms limit outfits, but kids still show who they are through their words, their art, and how they treat people.',
      distractors:['Whoever wants uniforms clearly just wants to control everyone and make the whole school boring and bland.','Sure, but what about how expensive the field trips are? That’s a way bigger money problem for our families.','Every single kid I’ve asked absolutely hates the idea of uniforms, so that pretty much settles the whole debate for good.'],
      why:'The strong rebuttal answers the “individuality” worry directly. The others attack, distract, or bandwagon.' },
    { argument:'“Recess should be cut so we have more time for real learning.”',
      best:'Recess isn’t wasted time — a real break actually helps kids concentrate better when they get back to class.',
      distractors:['Only someone who hates fun and totally forgot what being a kid is like would ever want to take away recess.','Honestly, what about all the time we lose switching classes? That adds up to way more minutes than recess does.','Basically every student in the building would riot if you cut recess, so there’s no way it’s a good idea.'],
      why:'The best answer shows recess supports learning. The others attack, change the subject, or bandwagon.' },
    { argument:'“Field trips are a waste — you can learn the same stuff from a textbook.”',
      best:'Textbooks help, but seeing things in person makes lessons stick in a way that reading alone often can’t.',
      distractors:['Honestly, people who don’t like field trips are probably just antisocial and don’t want to hang out with anyone.','Sure, but what about how outdated half of our textbooks are? That’s the real problem we should fix first.','Nobody actually reads the textbook anyway, so saying it replaces a trip makes no sense whatsoever to me.'],
      why:'The strong rebuttal explains what a trip adds. The others attack, distract, or over-generalize.' },
    { argument:'“We shouldn’t allow a class pet — someone will forget to feed it.”',
      best:'One forgetful day is fixable with a feeding schedule and a backup helper, so that’s not a reason to skip it.',
      distractors:['Only a heartless person who doesn’t even like animals would ever be against having a cute little class pet.','Speaking of being ignored, when is the last time anybody actually watered the plants in the front office?','Everybody in the whole class already wants a pet, so honestly we should just stop debating and go get one already.'],
      why:'The best answer solves the real worry with a plan. The others attack, change the subject, or bandwagon.' },
    { argument:'“Online classes are just as good as in-person, so why have school buildings?”',
      best:'Online works for some things, but in person you get hands-on labs and help that a screen can’t fully replace.',
      distractors:['Anyone who prefers buildings is just scared of technology and stuck doing everything the slow old-fashioned way.','Sure, but what about how painfully slow the school wifi is? That seems like the bigger thing to complain about.','Loads of people keep saying online is totally fine, so that basically proves buildings are a waste of money now.'],
      why:'The strong rebuttal names what in-person adds. The others attack, distract, or bandwagon.' },
    { argument:'“We should get rid of grades — they just stress everyone out.”',
      best:'Grades can stress kids out, but with no feedback at all it’s hard to know what you’ve learned or improved.',
      distractors:['Anybody who wants to get rid of grades is obviously just a bad student trying to dodge being held accountable.','Honestly, what about how stressful the crowded hallways are? Nobody ever seems to want to fix that one, though.','Tons of kids would love to ditch grades, so clearly that’s the popular and therefore the right choice here.'],
      why:'The best answer weighs the downside against what grades are for. The others attack, distract, or bandwagon.' }
  ]
};
