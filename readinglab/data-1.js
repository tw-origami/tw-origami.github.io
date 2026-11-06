// Reading Lab — Part I: Core Comprehension.
// Every passage here is original. Each skill follows the same shape:
//   concept + strategies, a worked example with the reasoning shown, then one passage per level
//   (starter = grades 3–5, core = 6–8, advanced = 9–12 / SAT-style).
// A question's `answer` is the index of the right choice; `why` explains the right answer AND why
// the tempting wrong ones fail, which is where most of the learning happens.
(window.RL_SKILLS = window.RL_SKILLS || []).push(

{
  id: "main-idea", part: 1, n: 1, title: "Main Idea & Central Theme", icon: "🎯",
  concept: "The main idea is the one point the whole passage is making. It is not just the topic (\"bees\") but a full thought about the topic (\"bees are vital to growing much of our food\"). Every other sentence should help explain, prove, or show that one idea.",
  strategies: [
    "Ask two questions: What is this mostly about? What is it saying about that?",
    "The main idea is big enough to cover the whole passage, but specific enough to say something.",
    "Watch out for answers that are true but only describe one sentence — that is a detail, not the main idea.",
    "The main idea is often in the first or last sentence, but check that it really covers everything."
  ],
  example: {
    text: "Libraries are no longer just places to borrow books. Many now lend out tools, musical instruments, and even cake pans. Some offer free classes on coding or job interviews, and others give families a quiet place to use the internet. For many towns, the library has become a community center that happens to have books.",
    stem: "Which choice best states the main idea of the passage?",
    choices: ["Libraries lend out cake pans.", "Modern libraries offer far more than books and serve as community centers.", "People no longer read books at libraries.", "Coding classes are popular in small towns."],
    answer: 1,
    why: "{B} covers every sentence: tools, classes and internet access are all examples of libraries offering more than books. {A} is just one example. {C} contradicts the passage — it still \"has books.\" {D} is a single detail stretched too far."
  },
  passages: [
    {
      id: "mi-s", level: "starter", title: "The Busy Beaver",
      vocab: [["dam", "a wall that holds back water"], ["gnaw", "to bite and chew over and over"], ["pond", "a small, still body of water"]],
      text: "Beavers are nature's builders. They gnaw through trees with their strong front teeth and drag the logs into streams. Then they pack the logs with mud and stones to make a dam. The dam slows the water and makes a deep pond. In the middle of the pond, beavers build a lodge where their family can stay safe and warm. Their hard work also makes a new home for fish, frogs, and birds.",
      questions: [
        { stem: "What is the main idea of the passage?", choices: ["Beavers have strong front teeth.", "Beavers build dams and ponds that make homes for themselves and other animals.", "Frogs live in ponds.", "Streams move very fast."], answer: 1,
          why: "{B} covers the whole passage: the building, the pond, the lodge and the homes for other animals. {A} is one detail. {C} is one small part of the last sentence. {D} is never said." },
        { stem: "Which sentence best tells you the main idea?", choices: ["\"Beavers are nature's builders.\"", "\"The dam slows the water and makes a deep pond.\"", "\"In the middle of the pond, beavers build a lodge.\"", "\"Then they pack the logs with mud and stones.\""], answer: 0,
          why: "{A} is the big idea that the rest of the passage explains — everything else describes what they build. {B}, {C} and {D} are steps or details." },
        { stem: "Why does the author mention fish, frogs, and birds?", choices: ["To show that beavers eat them", "To show that the beavers' work helps other animals too", "To explain how a dam is made", "To compare beavers to birds"], answer: 1,
          why: "The last sentence says the work \"makes a new home\" for them — so {B}. Nothing says beavers eat them ({A}), and they are not part of building ({C}) or a comparison ({D})." }
      ]
    },
    {
      id: "mi-c", level: "core", title: "Why Your Brain Loves a Nap",
      vocab: [["consolidate", "to combine and make stronger"], ["alert", "awake and paying attention"], ["cognitive", "having to do with thinking and learning"]],
      text: "For years, naps were seen as something only toddlers needed. Researchers now argue that a short afternoon nap can help people of all ages. In one study, students who napped for twenty minutes after a lesson remembered more of it the next day than students who stayed awake. Scientists think sleep gives the brain a chance to consolidate new memories, moving them from short-term to long-term storage. Short naps also leave people feeling more alert, with fewer of the cognitive slips — like rereading the same line three times — that come with an afternoon slump. The key is length: naps longer than about thirty minutes can leave people groggy instead of refreshed.",
      questions: [
        { stem: "Which choice best states the central idea of the passage?", choices: ["Toddlers need more sleep than adults.", "Short naps can improve memory and alertness for people of all ages.", "Students should sleep during lessons.", "Long naps are the best way to feel refreshed."], answer: 1,
          why: "{B} ties together the study, the memory explanation and the alertness point. {A} is the old belief the passage moves away from. {C} misreads the study (they napped after the lesson). {D} contradicts the last sentence." },
        { stem: "The study about students mainly serves to", choices: ["prove that all students are tired", "give evidence that napping helps memory", "explain why naps make people groggy", "show that adults nap less than teenagers"], answer: 1,
          why: "The study compares nappers and non-nappers on remembering a lesson — evidence for {B}. It says nothing about everyone being tired ({A}), grogginess ({C}), or adults versus teens ({D})." },
        { stem: "As used in the passage, \"consolidate\" most nearly means", choices: ["erase", "strengthen and store", "share with others", "forget quickly"], answer: 1,
          why: "The same sentence explains it: moving memories \"from short-term to long-term storage.\" That is strengthening and storing ({B}). {A} and {D} are the opposite; {C} doesn't fit." },
        { stem: "Which detail adds a limit to the passage's main claim?", choices: ["Naps were once seen as only for toddlers.", "Students who napped remembered more.", "Naps longer than about thirty minutes can leave people groggy.", "Short naps leave people feeling more alert."], answer: 2,
          why: "{C} says naps only help if they are short — a limit or condition. {A} is background, while {B} and {D} support the claim rather than limit it." }
      ]
    },
    {
      id: "mi-a", level: "advanced", title: "The Paradox of the Overgrown Garden",
      vocab: [["proliferate", "to increase rapidly in number"], ["counterintuitive", "opposite to what one would expect"], ["biodiversity", "the variety of living things in an area"]],
      text: "Homeowners have long measured a well-kept yard by its uniformity: a single species of grass, cut short and watered generously. Yet ecologists increasingly describe such lawns as \"green deserts.\" Because they offer almost nothing in the way of flowers, seeds, or shelter, these lawns support remarkably little wildlife. When researchers in several cities persuaded residents to mow only once a month, the results were counterintuitive: the \"messier\" yards hosted far more bees and butterflies, as clover and dandelions were finally allowed to bloom. Some insect populations, long in decline, began to proliferate within a single season. None of this requires abandoning the yard altogether; a strip of native plants along a fence can contribute meaningfully to local biodiversity. The lesson is not that tidiness is wrong, but that our definition of a \"healthy\" yard may have been measuring the wrong thing.",
      questions: [
        { stem: "Which choice best states the central idea of the passage?", choices: ["Homeowners should stop mowing their lawns entirely.", "Neat, uniform lawns support little wildlife, so rethinking what makes a yard \"healthy\" can benefit insects and biodiversity.", "Dandelions are more attractive than grass.", "Bees are disappearing from every city."], answer: 1,
          why: "{B} captures both the problem (green deserts) and the conclusion (redefining a healthy yard). {A} is directly contradicted — \"none of this requires abandoning the yard.\" {C} is an opinion the passage never gives. {D} overstates; the passage mentions some insect populations in decline." },
        { stem: "The phrase \"green deserts\" is used to suggest that uniform lawns are", choices: ["dry and in need of more water", "green on the surface but lacking life and variety", "located mostly in hot climates", "difficult to maintain"], answer: 1,
          why: "The next sentence explains it: they offer almost nothing to wildlife. A desert here means empty of life, not dry — so {B}. {A} takes \"desert\" too literally; {C} and {D} are not suggested." },
        { stem: "Which detail best supports the claim that less mowing helps wildlife?", choices: ["Homeowners have long valued uniform yards.", "The \"messier\" yards hosted far more bees and butterflies.", "A strip of native plants can be planted along a fence.", "Grass is often watered generously."], answer: 1,
          why: "{B} is the direct result from the study comparing mowing schedules. {A} and {D} describe the old approach; {C} is a separate suggestion, not evidence about mowing." },
        { stem: "The final sentence mainly serves to", choices: ["criticize homeowners who keep tidy yards", "restate the central idea as a change in how we judge yards", "introduce a new study", "argue that insects are more important than people"], answer: 1,
          why: "\"The lesson is not that tidiness is wrong, but…\" sums up the passage's point — {B}. It explicitly avoids criticizing tidiness ({A}), adds no study ({C}), and makes no comparison of importance ({D})." }
      ]
    }
  ]
},

{
  id: "details", part: 1, n: 2, title: "Supporting Details & Evidence", icon: "🔎",
  concept: "Supporting details are the facts, examples, numbers and observations an author uses to back up a main idea or claim. Detail questions ask you to find information, or to pick which piece of evidence best supports a particular statement.",
  strategies: [
    "Detail questions are \"open book\" — go back and find the answer in the text instead of relying on memory.",
    "When asked which detail supports a claim, match the evidence to that exact claim, not just any true sentence.",
    "Wrong answers are often true statements from the passage that don't support the claim being asked about.",
    "Look for numbers, examples and results — they are usually the strongest evidence."
  ],
  example: {
    text: "Reading aloud to young children does more than entertain them. In one survey of 2,000 families, children who were read to daily knew about 300 more words by kindergarten than children who were rarely read to. Parents also reported that bedtime stories helped children calm down and fall asleep more easily.",
    stem: "Which detail best supports the claim that reading aloud helps children's vocabulary?",
    choices: ["The survey included 2,000 families.", "Children read to daily knew about 300 more words by kindergarten.", "Bedtime stories helped children calm down.", "Reading aloud entertains children."],
    answer: 1,
    why: "{B} is the only detail about words. {A} describes the study, not its result. {C} is true but supports a different benefit (sleep). {D} is the idea the passage says reading goes beyond."
  },
  passages: [
    {
      id: "de-s", level: "starter", title: "Lunch in Space",
      vocab: [["astronaut", "a person trained to travel in space"], ["float", "to drift without falling"], ["crumb", "a tiny piece of food"]],
      text: "Eating in space is tricky. Without gravity, food and drinks float away if they are not held down. Astronauts drink from pouches with straws so liquid doesn't drift around the station. They eat tortillas instead of bread, because bread makes crumbs, and crumbs can float into machines and break them. Salt and pepper come as liquids, since tiny grains would scatter everywhere. Even with all these rules, astronauts say a warm meal with friends is one of the best parts of their day.",
      questions: [
        { stem: "Why do astronauts eat tortillas instead of bread?", choices: ["Tortillas taste better in space.", "Bread makes crumbs that can float into machines.", "Bread is too heavy for rockets.", "Tortillas stay warm longer."], answer: 1,
          why: "The passage says it directly: bread makes crumbs that can break machines ({B}). The other reasons are never mentioned." },
        { stem: "Which detail supports the idea that eating in space is tricky?", choices: ["A warm meal is one of the best parts of the day.", "Food and drinks float away if they are not held down.", "Astronauts eat with friends.", "Astronauts are trained to travel in space."], answer: 1,
          why: "{B} shows a problem astronauts must solve. {A} and {C} are about enjoying meals, not difficulty. {D} is the vocabulary meaning, not a detail about eating." },
        { stem: "How do astronauts keep drinks from drifting?", choices: ["They drink from pouches with straws.", "They freeze their drinks.", "They only drink water.", "They drink very quickly."], answer: 0,
          why: "The passage says they drink from pouches with straws ({A}). The other choices are not in the text." }
      ]
    },
    {
      id: "de-c", level: "core", title: "The Four-Day School Week",
      vocab: [["district", "an area that runs its own public schools"], ["absenteeism", "how often people are absent"], ["mixed", "including both good and bad results"]],
      text: "More than a thousand school districts in the United States now hold classes only four days a week, usually with longer school days. Supporters point to savings: one rural district reported cutting its bus and heating costs by about 7 percent. Teachers in several districts say the long weekend makes it easier to recruit new staff. Student absenteeism has also dropped in some schools, since families schedule doctor's visits on the free day. Research on learning, however, has been mixed. A large study found that test scores in four-day districts grew slightly more slowly over several years than in similar five-day districts, especially in math.",
      questions: [
        { stem: "Which detail best supports the claim that four-day weeks can save money?", choices: ["More than a thousand districts use a four-day week.", "One district cut its bus and heating costs by about 7 percent.", "Families schedule doctor's visits on the free day.", "Test scores grew more slowly in math."], answer: 1,
          why: "{B} gives a specific cost saving. {A} shows popularity, not savings. {C} explains lower absenteeism. {D} is about learning, not money." },
        { stem: "According to the passage, why has absenteeism dropped in some schools?", choices: ["Students enjoy longer school days.", "Families schedule appointments on the day off.", "Teachers give fewer tests.", "Buses arrive earlier."], answer: 1,
          why: "The passage connects lower absenteeism to doctor's visits on the free day — {B}. The others are not given as reasons." },
        { stem: "The author mentions the large study mainly to", choices: ["prove that four-day weeks always lower scores", "show that the evidence about learning is not all positive", "explain how districts save on heating", "argue that teachers prefer five-day weeks"], answer: 1,
          why: "It follows \"research on learning, however, has been mixed\" and shows a possible downside — {B}. {A} overstates (\"slightly,\" \"always\"). {C} and {D} are unrelated to the study." },
        { stem: "Which statement is NOT supported by the passage?", choices: ["Four-day weeks usually have longer days.", "Some teachers find the schedule helps recruiting.", "Four-day weeks clearly improve test scores.", "Some districts saw lower absenteeism."], answer: 2,
          why: "The study suggests scores grew more slowly, so {C} is not supported. {A}, {B} and {D} are all stated in the passage." }
      ]
    },
    {
      id: "de-a", level: "advanced", title: "Measuring the Quiet",
      vocab: [["ambient", "relating to the surrounding environment"], ["correlate", "to have a connection where one thing changes with another"], ["mitigate", "to make less severe"]],
      text: "Urban planners have long treated noise as a nuisance rather than a health concern, but a growing body of data suggests the distinction is misleading. In a five-year study of 40,000 residents in three European cities, people living where ambient traffic noise regularly exceeded 55 decibels at night were about 20 percent more likely to report high blood pressure than those in quieter areas. Sleep diaries kept by a subset of participants showed that the louder group woke more often, even when they did not remember waking. The researchers were careful to note that noisy streets also tend to be more polluted and less affluent, so noise alone cannot be said to cause the difference; still, the pattern held after they adjusted for income and air quality. Several cities have since tried to mitigate the problem with quieter road surfaces and night-time speed limits, and early measurements show reductions of three to five decibels.",
      questions: [
        { stem: "Which finding most directly supports the claim that noise may be a health concern?", choices: ["The study followed 40,000 residents for five years.", "Residents in noisy areas were about 20 percent more likely to report high blood pressure.", "Noisy streets tend to be less affluent.", "Quieter road surfaces reduced noise by three to five decibels."], answer: 1,
          why: "{B} links noise to a health outcome. {A} describes the study's size, not its finding. {C} is a complicating factor. {D} is about solutions, not health effects." },
        { stem: "The sleep diaries are mentioned primarily to", choices: ["suggest a way noise might affect health even without people noticing", "prove that participants were dishonest", "show that the study was too small", "explain how decibels are measured"], answer: 0,
          why: "The louder group woke more often \"even when they did not remember waking\" — a hidden mechanism, {A}. Nothing suggests dishonesty ({B}) or size problems ({C}), and measurement isn't discussed ({D})." },
        { stem: "Why does the author include the detail about pollution and income?", choices: ["To argue that noise has no effect on health", "To acknowledge other factors that could explain the results", "To criticize cities for building busy roads", "To show that wealthy residents prefer quiet"], answer: 1,
          why: "It admits other possible causes before noting the pattern held after adjusting — {B}. {A} contradicts the conclusion. {C} and {D} are not the purpose." },
        { stem: "As used in the passage, \"mitigate\" most nearly means", choices: ["measure", "worsen", "reduce", "ignore"], answer: 2,
          why: "Quieter roads and speed limits \"reduce\" noise by three to five decibels — so mitigate means reduce ({C})." }
      ]
    }
  ]
},

{
  id: "vocab", part: 1, n: 3, title: "Vocabulary in Context", icon: "🔤",
  concept: "Vocabulary-in-context questions ask what a word means in this specific passage, not its dictionary definition in general. Many words have several meanings, and tests love words whose everyday meaning is not the one that fits the sentence.",
  strategies: [
    "Cover the choices. Read the sentence and put in your own word first.",
    "Look at the words around it — clues like \"but,\" \"because,\" or \"in other words\" signal the meaning.",
    "Try each choice in the sentence. The right one keeps the sentence's meaning, not just its sound.",
    "Be careful with the most common meaning of a word; it is often the trap."
  ],
  example: {
    text: "The coach was reluctant to change the lineup so late in the season; she worried that switching players now would only confuse the team.",
    stem: "As used in the passage, \"reluctant\" most nearly means",
    choices: ["excited", "unwilling", "forgetful", "required"], answer: 1,
    why: "The clue is that she \"worried\" about changing — she didn't want to. {B} fits. {A} is the opposite; {C} and {D} don't match the worry."
  },
  passages: [
    {
      id: "vo-s", level: "starter", title: "Tess and the Tall Slide",
      vocab: [["timid", "shy and easily scared"], ["summit", "the very top"], ["triumph", "a great win or success"]],
      text: "Tess was timid around the tall slide. She would stand at the bottom and watch the other kids climb up and zoom down, but her feet never moved. One day her big brother held her hand and climbed with her, one step at a time. When they reached the summit, Tess looked down and her knees shook. Then she sat, took a deep breath, and pushed off. She landed at the bottom laughing. \"Again!\" she shouted, running back to the ladder. It felt like a real triumph.",
      questions: [
        { stem: "In the passage, \"timid\" means", choices: ["brave", "shy and scared", "fast", "angry"], answer: 1,
          why: "Her feet \"never moved\" while she watched others — she was scared ({B}). Brave ({A}) is the opposite." },
        { stem: "\"Summit\" in the passage means", choices: ["the bottom of the slide", "the ladder", "the top of the slide", "the playground"], answer: 2,
          why: "They climbed \"one step at a time\" and then looked down — they were at the top ({C})." },
        { stem: "Which clue helps you know \"triumph\" means a great success?", choices: ["Her knees shook.", "She watched the other kids.", "She landed laughing and wanted to go again.", "Her brother held her hand."], answer: 2,
          why: "Laughing and shouting \"Again!\" shows she felt she had won something — {C}. {A} and {B} happen before her success." }
      ]
    },
    {
      id: "vo-c", level: "core", title: "The Robot Competition",
      vocab: [["meticulous", "very careful about small details"], ["setback", "a problem that delays progress"], ["persevere", "to keep going despite difficulty"]],
      text: "Two weeks before the regional robotics competition, our team's robot lost a wheel in practice and slammed into the wall. It was a serious setback. Some of us wanted to drop out, but Priya, our captain, refused. She was meticulous: she rebuilt the axle, labeled every wire, and kept a notebook of each test run, down to the millimeter. \"We just have to persevere,\" she kept saying, even when the third version failed too. On the day of the competition, our robot didn't win, but it finished every round without a single breakdown — something no one, including us, had expected.",
      questions: [
        { stem: "As used in the passage, \"setback\" most nearly means", choices: ["a victory", "a problem that slows progress", "a type of wheel", "a rule of the contest"], answer: 1,
          why: "The robot crashed two weeks before the contest and some wanted to quit — a problem ({B})." },
        { stem: "Which detail best shows that Priya was meticulous?", choices: ["She refused to drop out.", "She labeled every wire and recorded tests to the millimeter.", "The robot didn't win.", "She was the team captain."], answer: 1,
          why: "Labeling every wire and recording measurements to the millimeter shows great attention to detail — {B}. {A} shows determination, not carefulness." },
        { stem: "As used in the passage, \"persevere\" most nearly means", choices: ["give up", "complain", "keep trying", "win easily"], answer: 2,
          why: "She says it \"even when the third version failed too\" — keeping going despite failure ({C})." },
        { stem: "In the last sentence, \"breakdown\" most nearly means", choices: ["an emotional collapse", "a mechanical failure", "a list of parts", "a dance move"], answer: 1,
          why: "The sentence is about the robot finishing every round, so it means the robot didn't fail mechanically ({B}). {A} is a real meaning of the word, but not in this context." }
      ]
    },
    {
      id: "vo-a", level: "advanced", title: "The Town Meeting",
      vocab: [["ambivalent", "having mixed feelings"], ["concede", "to admit that something is true, often reluctantly"], ["temper", "to soften or moderate"]],
      text: "When the proposal to replace the old covered bridge came before the town meeting, few residents were simply for or against it. Most were ambivalent: they valued the bridge as a landmark but resented the weight limit that sent delivery trucks on a twenty-minute detour. The engineer hired by the town was careful not to oversell the new design. She conceded that a modern span would lack the charm of the original, but argued that the old timbers could be preserved in a pedestrian walkway beside it. Her candor seemed to temper the room's suspicion. By the end of the evening, even the bridge's most vocal defenders granted that the plan addressed their concerns, though they stopped short of endorsing it.",
      questions: [
        { stem: "As used in the passage, \"ambivalent\" most nearly means", choices: ["uninterested", "having mixed feelings", "strongly opposed", "confused about the facts"], answer: 1,
          why: "The next clause explains: they valued the bridge but resented the weight limit — mixed feelings ({B}). {A} and {C} don't fit \"few were simply for or against.\"" },
        { stem: "As used in the passage, \"conceded\" most nearly means", choices: ["admitted", "denied", "demanded", "hid"], answer: 0,
          why: "She admits a drawback of her own plan (it lacks charm) before arguing for it — {A}." },
        { stem: "As used in the passage, \"temper\" most nearly means", choices: ["anger", "soften", "test", "heat"], answer: 1,
          why: "Her honesty made people less suspicious — it softened the mood ({B}). \"Anger\" ({A}) is the everyday meaning of the noun, which is the trap here." },
        { stem: "Which phrase best helps clarify the meaning of \"candor\"?", choices: ["\"careful not to oversell the new design\"", "\"a twenty-minute detour\"", "\"the old timbers could be preserved\"", "\"most vocal defenders\""], answer: 0,
          why: "Not overselling and openly admitting a weakness are signs of honesty — the meaning of candor ({A}). The others describe facts or people, not her honesty." },
        { stem: "In the last sentence, \"granted\" most nearly means", choices: ["gave money", "acknowledged", "refused", "allowed to enter"], answer: 1,
          why: "The defenders admitted the plan addressed their concerns — acknowledged ({B}). {A} and {D} are other meanings of \"grant\" that don't fit." }
      ]
    }
  ]
},

{
  id: "inference", part: 1, n: 4, title: "Inference & Drawing Conclusions", icon: "🧩",
  concept: "An inference is a conclusion the text doesn't state directly but strongly supports. You take one small, logical step beyond the words — not a leap, and not a guess based on outside knowledge.",
  strategies: [
    "The right inference is usually the most careful, reasonable one — not the most dramatic.",
    "You should be able to point to the sentence(s) that support it. If you can't, it's probably wrong.",
    "Beware of choices that need outside facts or assumptions the passage never gives you.",
    "Pay attention to actions, body language and what characters avoid saying."
  ],
  example: {
    text: "Marcus checked the clock again. The bus was already ten minutes late, and his interview started at nine. He pulled out his phone, opened a map, and began walking quickly in the direction of downtown.",
    stem: "It can most reasonably be inferred that Marcus",
    choices: ["has never ridden a bus before", "decided to walk so he wouldn't be late for his interview", "does not want the job", "lives downtown"], answer: 1,
    why: "The late bus, the interview time and walking quickly toward downtown all point to {B}. {A} and {D} need information the passage never gives; {C} contradicts his hurry."
  },
  passages: [
    {
      id: "in-s", level: "starter", title: "The Muddy Boots",
      vocab: [["puddle", "a small pool of water on the ground"], ["grin", "a big smile"], ["mud", "soft, wet dirt"]],
      text: "Leo came in through the back door. His boots were covered in mud, and his jeans were wet up to the knees. He was holding a jar with a lid full of tiny holes. Inside, something green hopped. Leo had a huge grin on his face. \"Mom!\" he called. \"Come see what I found by the pond!\"",
      questions: [
        { stem: "What can you infer is in the jar?", choices: ["A rock", "A frog or other small animal", "Some water", "A toy car"], answer: 1,
          why: "Something green that hops, from the pond, in a jar with air holes — most likely a frog ({B})." },
        { stem: "Why does the lid have tiny holes?", choices: ["So the animal can breathe", "So the jar is lighter", "Because the jar is broken", "So the mud can get in"], answer: 0,
          why: "Air holes let a living animal breathe ({A}). The other reasons don't make sense with an animal inside." },
        { stem: "How is Leo feeling?", choices: ["Scared", "Bored", "Excited and proud", "Angry"], answer: 2,
          why: "His \"huge grin\" and calling his mom to see show he is excited and proud ({C})." }
      ]
    },
    {
      id: "in-c", level: "core", title: "The Empty Seat",
      vocab: [["glance", "a quick look"], ["linger", "to stay longer than needed"], ["fidget", "to move around nervously"]],
      text: "Every Tuesday, Ana saved the seat beside her in the cafeteria. Today she set her backpack on it again and kept glancing toward the door. When a group of sixth graders asked if the seat was free, she said, \"Sorry, it's taken,\" without looking up. Halfway through lunch, she took out her phone, typed something, then deleted it. Her sandwich sat unopened. When the bell rang, she lingered for a moment, fidgeting with the backpack strap, before finally lifting it off the empty chair and walking slowly to class.",
      questions: [
        { stem: "It can most reasonably be inferred that Ana", choices: ["dislikes the sixth graders", "was expecting someone who did not come", "forgot to bring lunch", "was late for class"], answer: 1,
          why: "Saving a seat, watching the door and lingering all point to waiting for someone who never arrived — {B}. {A} is too strong; {C} contradicts the sandwich; {D} isn't shown." },
        { stem: "Which detail best supports the idea that Ana felt uncertain about contacting someone?", choices: ["She saved the seat every Tuesday.", "She typed something on her phone, then deleted it.", "The sixth graders asked about the seat.", "She walked to class."], answer: 1,
          why: "Typing and then deleting shows she couldn't decide what to say — {B}." },
        { stem: "Her sandwich sitting unopened most likely suggests that Ana", choices: ["was too worried or distracted to eat", "doesn't like sandwiches", "was saving it for her friend", "had already eaten"], answer: 0,
          why: "Combined with her glancing and fidgeting, not eating suggests she was preoccupied ({A}). The others need information not given." },
        { stem: "Which choice is NOT a reasonable inference from the passage?", choices: ["Ana usually sits with someone on Tuesdays.", "Ana was disappointed at the end of lunch.", "Ana's friend moved to a different school.", "Ana was paying attention to the door."], answer: 2,
          why: "Nothing tells us why the person didn't come — {C} is a guess. {A}, {B} and {D} are supported by the saved seat, the slow walk and the glancing." }
      ]
    },
    {
      id: "in-a", level: "advanced", title: "The Inheritance",
      vocab: [["perfunctory", "done quickly, as a routine, without real interest"], ["meticulously", "with great care for details"], ["inscrutable", "impossible to understand or read"]],
      text: "The lawyer's reading of the will was brief and perfunctory, a list of bank accounts and furniture divided evenly among the three children. It was only at the end that he mentioned the workshop. \"The tools,\" he said, \"and the contents of the garage, go to Daniel.\" Margaret, the eldest, let out a small laugh that she turned into a cough. Their father had kept that garage meticulously organized for forty years, each chisel outlined on the pegboard in black marker, yet Daniel had not set foot in it since he was fifteen, the summer of the argument no one discussed. Daniel's expression remained inscrutable. He signed where the lawyer pointed, thanked him, and asked, very quietly, whether the old radio on the workbench still worked.",
      questions: [
        { stem: "Margaret's laugh, turned into a cough, most likely suggests that she", choices: ["found the bequest surprising or ironic and tried to hide her reaction", "was sick during the meeting", "was angry that she did not receive money", "did not hear the lawyer clearly"], answer: 0,
          why: "Turning a laugh into a cough is an attempt to hide a reaction; the passage then explains why the gift is ironic — Daniel hadn't entered the garage in years. {A} fits. {B} takes the cough literally." },
        { stem: "The passage most strongly suggests that Daniel and his father", choices: ["worked together in the garage often", "had a falling-out years earlier that was never openly resolved", "disliked woodworking", "were not related"], answer: 1,
          why: "\"The summer of the argument no one discussed\" and his long absence support {B}. {A} is contradicted. {C} and {D} aren't supported." },
        { stem: "Daniel's question about the radio most likely suggests that", choices: ["he plans to sell everything in the garage", "he is uninterested in his father's things", "he has memories connected to the workshop that still matter to him", "he needs a radio for work"], answer: 2,
          why: "Asking \"very quietly\" about a specific object from the workbench hints at personal attachment — {C}. {A} and {B} contradict this tone; {D} is unsupported." },
        { stem: "The detail about each chisel being outlined on the pegboard primarily serves to", choices: ["show how much care the father put into the workshop", "explain why the tools are valuable", "prove that Daniel used the tools", "describe the lawyer's office"], answer: 0,
          why: "Outlining every tool shows deep care — making the gift to Daniel more meaningful ({A}). Nothing is said about value ({B}) or Daniel using them ({C})." }
      ]
    }
  ]
},

{
  id: "purpose-tone", part: 1, n: 5, title: "Author's Purpose & Tone", icon: "🎭",
  concept: "Purpose is why the author wrote something — to inform, persuade, entertain, or explain. Tone is the author's attitude, shown through word choice: hopeful, critical, humorous, worried, neutral. A single paragraph or sentence can also have its own purpose inside the larger passage.",
  strategies: [
    "Look at word choice. \"Disaster\" and \"setback\" describe the same event with very different tones.",
    "For purpose questions about a detail, ask: what would be missing if this sentence were removed?",
    "Tone answers are usually moderate — \"cautiously optimistic\" is more common than \"furious.\"",
    "Separate the author's attitude from the attitudes of people described in the passage."
  ],
  example: {
    text: "City officials promised the new parking app would \"end the headache of finding a space downtown.\" Three months later, drivers report that the app shows open spaces that are not there, charges them twice, and crashes during rush hour. The headache, it seems, now comes with a monthly fee.",
    stem: "The author's tone toward the parking app is best described as",
    choices: ["enthusiastic", "neutral", "mocking and critical", "confused"], answer: 2,
    why: "The list of failures and the joke that the headache \"now comes with a monthly fee\" show a critical, mocking attitude — {C}."
  },
  passages: [
    {
      id: "pt-s", level: "starter", title: "Help Our Park!",
      vocab: [["litter", "trash left on the ground"], ["volunteer", "a person who helps for free"], ["gloves", "coverings for your hands"]],
      text: "Our park is a great place to play, but it needs your help! Every week, people leave litter on the grass and near the pond. Ducks can get sick from eating plastic. This Saturday at 10 a.m., we are having a park clean-up day. Volunteers will get free gloves, bags, and lemonade. Bring your family and friends. Together, we can make our park clean and safe for everyone!",
      questions: [
        { stem: "What is the author's main purpose?", choices: ["To tell a funny story about ducks", "To get people to join the park clean-up", "To explain how lemonade is made", "To describe the history of the park"], answer: 1,
          why: "The passage gives a time, a place and invites people to come — it is trying to persuade them to join ({B})." },
        { stem: "Why does the author mention that ducks can get sick?", choices: ["To give a reason why the litter is a problem", "To teach about duck food", "To make readers laugh", "To describe the pond"], answer: 0,
          why: "It shows why cleaning up matters — {A}." },
        { stem: "The tone of the passage is", choices: ["sad and hopeless", "excited and encouraging", "angry", "bored"], answer: 1,
          why: "Exclamation points, \"Together, we can…\" and free lemonade make it upbeat and encouraging ({B})." }
      ]
    },
    {
      id: "pt-c", level: "core", title: "The Last Video Store",
      vocab: [["nostalgic", "longing for the past"], ["dwindle", "to slowly get smaller"], ["relic", "something left from an earlier time"]],
      text: "On a quiet corner downtown sits what may be the last video rental store in the state. Its shelves still hold thousands of movies, sorted by hand into categories like \"Weird Westerns\" and \"Movies That Made Grandma Cry.\" The owner, Ray, admits that customers have dwindled to a few dozen regulars. Some come in out of nostalgic curiosity; others because the films they love can't be found on any streaming service. Ray doesn't think of his store as a relic. \"People think everything is online,\" he says, tapping a dusty case. \"It isn't. Somebody has to keep the stuff the internet forgot.\"",
      questions: [
        { stem: "The author's main purpose is to", choices: ["persuade readers to cancel streaming services", "describe a store and its owner's view of why it still matters", "explain how video rental stores make money", "criticize people who no longer rent movies"], answer: 1,
          why: "The passage paints a picture of the store and ends with Ray's reason for keeping it — {B}. It never tells readers to cancel anything ({A}) or explains finances ({C})." },
        { stem: "The category names like \"Movies That Made Grandma Cry\" are included mainly to", choices: ["show the store's personal, quirky character", "list the store's most popular films", "prove that the store is organized badly", "explain why customers left"], answer: 0,
          why: "The handmade, funny categories show personality ({A}). They are not a popularity list ({B}) or a criticism ({C})." },
        { stem: "The author's tone toward Ray's store is best described as", choices: ["dismissive", "warm and appreciative", "angry", "strictly neutral, with no attitude at all"], answer: 1,
          why: "Details like hand-sorted shelves and giving Ray the last word show warmth ({B}). Nothing is dismissive or angry." },
        { stem: "Ray's final quotation mainly serves to", choices: ["explain the store's purpose in his own words", "admit that the store will close soon", "argue that the internet is dangerous", "describe the dusty cases"], answer: 0,
          why: "\"Somebody has to keep the stuff the internet forgot\" states why the store exists — {A}. He doesn't mention closing ({B}) or danger ({C})." }
      ]
    },
    {
      id: "pt-a", level: "advanced", title: "On the Virtue of Being Bored",
      vocab: [["incessant", "never stopping"], ["fallow", "left unused for a while so it can recover"], ["reflexively", "automatically, without thinking"]],
      text: "We have engineered boredom nearly out of existence. A minute in line, a pause at a red light, the walk from the car to the door: each is now filled, reflexively, with the glow of a screen. It would be easy to mourn this as a loss of attention span, and many writers have. I want to make a narrower and perhaps stranger claim — that boredom was doing useful work. Farmers once left fields fallow so the soil could recover; the idle mind, unoccupied by incessant input, seems to perform a similar renewal. Psychologists who have asked bored subjects to complete creative tasks find, more often than not, that they generate more original ideas than subjects who were entertained. None of this means we must throw away our phones. It means only that the empty minute was never as empty as it looked.",
      questions: [
        { stem: "The author's primary purpose is to", choices: ["argue that boredom has value we may be losing", "explain how smartphones are made", "demand that readers stop using phones", "describe the history of farming"], answer: 0,
          why: "The author explicitly says boredom \"was doing useful work\" and ends with the empty minute not being empty — {A}. {C} is directly rejected: \"none of this means we must throw away our phones.\"" },
        { stem: "The comparison to fields left fallow mainly serves to", choices: ["suggest that rest can renew the mind the way it renews soil", "show that farmers are often bored", "argue that people should work outdoors", "explain a scientific study about soil"], answer: 0,
          why: "The analogy links an idle field recovering to an idle mind renewing — {A}. The others take the comparison literally." },
        { stem: "The author sets this claim apart from other writers' by", choices: ["agreeing that attention spans are shrinking", "making a narrower claim about what boredom accomplishes", "rejecting all research on boredom", "focusing only on children"], answer: 1,
          why: "\"I want to make a narrower and perhaps stranger claim\" — {B}. The author sets aside the attention-span argument rather than adopting it." },
        { stem: "The tone of the final two sentences is best described as", choices: ["alarmed", "measured and reassuring", "sarcastic", "indifferent"], answer: 1,
          why: "The author calmly limits the claim (\"It means only…\") rather than raising alarm — measured and reassuring ({B})." }
      ]
    }
  ]
}

);
