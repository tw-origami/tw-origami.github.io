// Reading Lab — Part II: Structure & Synthesis. Original passages; see data-1.js for the shape.
// Paired passages carry a second text in `textB` (with `titleB`); questions can ask about either
// or both.
(window.RL_SKILLS = window.RL_SKILLS || []).push(

{
  id: "structure", part: 2, n: 6, title: "Text Structure & Organization", icon: "🏗️",
  concept: "Text structure is how a passage is put together: cause and effect, problem and solution, compare and contrast, sequence (time order), or claim and support. Structure questions ask how the parts fit, or what job a sentence or paragraph does in the whole.",
  strategies: [
    "Notice signal words: \"because\" and \"as a result\" (cause/effect), \"however\" and \"similarly\" (compare), \"first\" and \"later\" (sequence).",
    "For \"the function of this sentence\" questions, ask what it does: introduces, gives an example, adds a contrast, concludes.",
    "Map the passage in a few words per paragraph: problem → attempt → result.",
    "A shift (\"But\", \"Yet\", \"Today\") often marks where the passage turns."
  ],
  example: {
    text: "For decades, the river below the paper mill ran brown, and fish had disappeared. In 1990, the town passed a law requiring the mill to filter its waste. Within ten years, trout were spotted again, and today families swim where no one dared to fish.",
    stem: "Which choice best describes the structure of the passage?",
    choices: ["A list of different kinds of fish", "A problem, the action taken, and the result", "A comparison of two towns", "An argument against paper mills"], answer: 1,
    why: "Polluted river (problem) → law (action) → fish and swimmers return (result). That is {B}. There is only one town, and no argument is made against mills in general."
  },
  passages: [
    {
      id: "st-s", level: "starter", title: "How a Seed Becomes a Sunflower",
      vocab: [["sprout", "a young plant just starting to grow"], ["stem", "the main stalk of a plant"], ["bloom", "to open into a flower"]],
      text: "First, a sunflower seed is planted in warm soil. After about a week, a tiny sprout pushes up through the dirt. Next, the stem grows taller every day, and big green leaves spread out to catch the sun. After two months, a large bud forms at the top. Finally, the bud opens and the sunflower blooms, turning its bright yellow face toward the sun.",
      questions: [
        { stem: "How is the passage organized?", choices: ["In time order, from seed to flower", "By comparing two flowers", "By giving a problem and a solution", "By listing reasons to plant flowers"], answer: 0,
          why: "\"First,\" \"Next,\" \"After two months,\" \"Finally\" show steps in time order ({A})." },
        { stem: "What happens right after the sprout appears?", choices: ["The flower blooms.", "The stem grows taller and leaves spread out.", "The seed is planted.", "A bud forms."], answer: 1,
          why: "The sentence after the sprout begins with \"Next, the stem grows taller\" — {B}." },
        { stem: "Which word signals the last step?", choices: ["First", "Next", "Finally", "After"], answer: 2,
          why: "\"Finally\" tells you the last step ({C})." }
      ]
    },
    {
      id: "st-c", level: "core", title: "Why the Bridge Swayed",
      vocab: [["resonance", "when a small repeated push makes something swing more and more"], ["synchronize", "to happen at the same time"], ["retrofit", "to add new parts to an older structure"]],
      text: "When a new footbridge opened over a river in London, thousands of people crowded onto it on the first day. Within minutes, the bridge began to sway from side to side. The cause surprised engineers. As the bridge moved slightly, walkers adjusted their steps to keep their balance, and without realizing it, they began to synchronize. Thousands of feet pushing at the same rhythm created resonance, making the sway even worse. The bridge was closed after just two days. Engineers then retrofitted it with shock absorbers beneath the deck. When it reopened, the bridge stayed steady, and it has been a popular crossing ever since.",
      questions: [
        { stem: "Which choice best describes the overall structure of the passage?", choices: ["A comparison of two bridges", "An event, its cause, and how the problem was fixed", "A list of famous London landmarks", "A biography of an engineer"], answer: 1,
          why: "Swaying (event) → walkers synchronizing (cause) → shock absorbers (solution). That's {B}." },
        { stem: "The sentence \"The cause surprised engineers\" mainly serves to", choices: ["introduce the explanation that follows", "conclude the passage", "describe the river", "give the bridge's opening date"], answer: 0,
          why: "It sets up the explanation in the next sentences — {A}." },
        { stem: "According to the passage, what made the swaying worse?", choices: ["Strong winds", "Walkers stepping in rhythm together", "The weight of the shock absorbers", "Boats on the river"], answer: 1,
          why: "Feet \"pushing at the same rhythm created resonance, making the sway even worse\" — {B}." },
        { stem: "Which word best signals the shift from the problem to its solution?", choices: ["\"Within minutes\"", "\"As the bridge moved\"", "\"Engineers then retrofitted\"", "\"thousands of people\""], answer: 2,
          why: "\"Then\" introduces the fix — {C}. The others are part of describing the problem." }
      ]
    },
    {
      id: "st-a", level: "advanced", title: "The Clock That Changed the Sea",
      vocab: [["longitude", "how far east or west a place is"], ["chronometer", "a very accurate clock for use at sea"], ["skeptical", "doubtful"]],
      text: "For centuries, sailors could judge how far north or south they were by the height of the sun, but longitude remained a deadly guess. Ships ran aground on coasts their captains believed were days away. In 1714, the British government offered an enormous prize for a practical solution. Most experts assumed the answer lay in the stars, through tables of lunar positions so complex that few navigators could use them. John Harrison, a self-taught carpenter, proposed something else: a clock accurate enough to keep home-port time at sea, so that comparing it with local noon would reveal how far east or west a ship had traveled. The committee was skeptical, and for decades Harrison was given small grants rather than the prize. His fourth chronometer, tested on a voyage to Jamaica in 1761, lost only five seconds. Within a few generations, a chronometer had become standard equipment on ocean-going ships.",
      questions: [
        { stem: "Which choice best describes the structure of the passage?", choices: ["It presents a problem, contrasts two proposed solutions, and traces how one succeeded.", "It compares the lives of two inventors.", "It argues that astronomy is useless.", "It describes a single voyage in time order."], answer: 0,
          why: "Longitude problem → stars vs. clock → Harrison's test and adoption: {A}. The 1761 voyage is one step, not the whole structure ({D})." },
        { stem: "The sentence about ships running aground mainly serves to", choices: ["show how serious the longitude problem was", "explain how the prize was funded", "describe Harrison's childhood", "argue against sailing"], answer: 0,
          why: "Shipwrecks show the cost of not knowing longitude — {A}." },
        { stem: "The phrase \"Most experts assumed the answer lay in the stars\" primarily functions to", choices: ["set up a contrast with Harrison's different approach", "prove that astronomers were dishonest", "conclude the passage", "describe how sailors measured north and south"], answer: 0,
          why: "The next sentence begins \"Harrison… proposed something else,\" so this sets up the contrast — {A}." },
        { stem: "Which detail best shows that Harrison's idea eventually succeeded?", choices: ["The committee was skeptical.", "He was given small grants.", "A chronometer became standard equipment on ocean-going ships.", "The prize was offered in 1714."], answer: 2,
          why: "Widespread adoption shows success — {C}. {A} and {B} show resistance; {D} is background." }
      ]
    }
  ]
},

{
  id: "paired", part: 2, n: 7, title: "Compare, Contrast & Synthesis (Paired Passages)", icon: "⚖️",
  concept: "Paired passages give two texts on the same topic. You need to understand each one alone, then compare them: where do the authors agree, where do they disagree, and how would one respond to the other? Synthesis means combining information from both to reach a conclusion.",
  strategies: [
    "Read Passage 1, then sum up its main point in a few words before reading Passage 2.",
    "Ask: do they disagree about facts, about values, or about what should be done?",
    "For \"how would the author of Passage 2 respond\" questions, use only what Passage 2 actually says.",
    "Look for overlap — paired passages almost always share at least one point."
  ],
  example: {
    text: "Passage 1: School uniforms save families money and reduce teasing about clothes.\n\nPassage 2: Uniforms can be costly for families who must buy special items, and students lose a way to express themselves.",
    stem: "The two passages most directly disagree about",
    choices: ["whether students should attend school", "whether uniforms are affordable for families", "how teasing affects learning", "what colors uniforms should be"], answer: 1,
    why: "Passage 1 says uniforms save money; Passage 2 says they can be costly. That's {B}. Neither discusses attendance ({A}) or colors ({D}), and only Passage 1 mentions teasing ({C})."
  },
  passages: [
    {
      id: "pa-s", level: "starter", title: "Cats or Dogs?", titleB: "Dogs or Cats?",
      vocab: [["loyal", "always on your side"], ["independent", "able to take care of itself"], ["exercise", "activity that keeps a body healthy"]],
      text: "Dogs make the best pets. They are loyal and love to play. A dog will greet you at the door every day. Dogs also help you get exercise, because they need to go on walks.",
      textB: "Cats make the best pets. They are independent and don't need to go for walks. Cats are quiet and clean. They still love to curl up in your lap at night.",
      questions: [
        { stem: "What do both authors agree about?", choices: ["Pets should go on walks.", "Their pet is the best kind of pet.", "Cats are loud.", "Dogs are independent."], answer: 1,
          why: "Each author says their animal \"makes the best pets\" — they agree pets are great, but not on which one ({B})." },
        { stem: "How are the two passages different?", choices: ["One is about dogs and one is about cats.", "Both are about fish.", "Both say walks are bad.", "One is a poem."], answer: 0,
          why: "Passage 1 praises dogs and Passage 2 praises cats ({A})." },
        { stem: "The author of Passage 2 would probably say walks are", choices: ["the best part of having a pet", "not needed for a great pet", "dangerous", "only for cats"], answer: 1,
          why: "Passage 2 praises cats because they \"don't need to go for walks\" — {B}." }
      ]
    },
    {
      id: "pa-c", level: "core", title: "Homework Helps", titleB: "Homework Hurts",
      vocab: [["reinforce", "to make stronger"], ["burnout", "being worn out from too much work"], ["moderate", "not too much and not too little"]],
      text: "Homework gives students a chance to practice what they learned in class, which reinforces new skills. Studies of middle schoolers show that students who complete moderate amounts of homework — about an hour a night — tend to earn higher grades. Homework also teaches responsibility: managing time and meeting deadlines are skills students will need for the rest of their lives.",
      textB: "Many students now spend two or three hours a night on homework, leaving little time for sleep, family, or exercise. Surveys show that heavy homework loads are linked to stress and burnout. While some practice at home can help, assigning more does not always mean students learn more, and tired students may simply copy answers to finish faster.",
      questions: [
        { stem: "The authors of both passages would most likely agree that", choices: ["homework should be banned", "some practice at home can be useful", "students should do three hours of homework", "homework has no effect on grades"], answer: 1,
          why: "Passage 1 supports moderate homework; Passage 2 admits \"some practice at home can help.\" That shared ground is {B}." },
        { stem: "Passage 2 is mainly concerned with", choices: ["the benefits of practice", "the problems caused by too much homework", "how to manage deadlines", "how teachers grade homework"], answer: 1,
          why: "Stress, burnout and lost sleep from heavy loads — {B}." },
        { stem: "How would the author of Passage 2 most likely respond to the claim in Passage 1 that homework teaches responsibility?", choices: ["By agreeing completely with no concerns", "By pointing out that too much homework may lead students to copy answers instead", "By saying responsibility is not important", "By saying students never do homework"], answer: 1,
          why: "Passage 2 notes tired students \"may simply copy answers\" — undermining the responsibility benefit ({B}). It never says responsibility doesn't matter ({C})." },
        { stem: "The word \"moderate\" in Passage 1 helps show that its author", choices: ["supports any amount of homework", "is mainly defending a limited amount of homework", "agrees with everything in Passage 2", "thinks homework is harmful"], answer: 1,
          why: "Specifying \"moderate amounts — about an hour\" limits the claim, which also brings the two passages closer together ({B})." }
      ]
    },
    {
      id: "pa-a", level: "advanced", title: "The Case for Zoos", titleB: "The Case Against Zoos",
      vocab: [["captivity", "being kept in an enclosed place"], ["reintroduce", "to return animals to the wild"], ["advocacy", "public support for a cause"]],
      text: "Modern accredited zoos bear little resemblance to the menageries of a century ago. Many now participate in coordinated breeding programs that have helped species such as the California condor and the Arabian oryx recover from the brink of extinction; in some cases, animals bred in captivity have been reintroduced to the wild. Zoos also serve an educational function that is difficult to replicate: millions of children each year encounter living animals they would otherwise know only from screens, an experience that researchers associate with greater long-term support for conservation.",
      textB: "Defenders of zoos often cite a handful of celebrated breeding successes, but these represent a small fraction of the species held in captivity, most of which are not endangered and will never be released. Large, wide-ranging animals such as elephants and orcas frequently show signs of chronic stress in enclosures that cannot approximate their natural ranges. If the goal is conservation, the resources spent maintaining popular exhibits might accomplish more if directed toward protecting habitats, where species can survive without human management. Education and advocacy, meanwhile, can be achieved through other means.",
      questions: [
        { stem: "The author of Passage 2 would most likely respond to the breeding examples in Passage 1 by arguing that they", choices: ["are fabricated", "are real but unrepresentative of most zoo animals", "prove zoos are essential", "are irrelevant to conservation"], answer: 1,
          why: "Passage 2 calls them \"a handful of celebrated breeding successes\" that are \"a small fraction\" of species held — real but not typical ({B}). It doesn't call them fake ({A})." },
        { stem: "Both passages discuss", choices: ["the financial profits of zoos", "the role of zoos in conservation", "the history of circuses", "laws against hunting"], answer: 1,
          why: "Passage 1 credits zoos with conservation; Passage 2 questions whether they are the best way to achieve it. Both address {B}." },
        { stem: "On which point would the two authors most likely disagree?", choices: ["Whether conservation is a worthwhile goal", "Whether zoos are an effective use of conservation resources", "Whether condors exist", "Whether children like animals"], answer: 1,
          why: "Both value conservation (so not {A}); they disagree about whether zoos are the best way to pursue it — {B}." },
        { stem: "How does Passage 2 address the educational argument made in Passage 1?", choices: ["It agrees that zoos are the only way to educate children.", "It suggests education can be achieved through other means.", "It provides new data showing children dislike zoos.", "It ignores education completely."], answer: 1,
          why: "The last sentence says education \"can be achieved through other means\" — {B}." },
        { stem: "Which choice best describes the relationship between the passages?", choices: ["Passage 2 challenges the main argument of Passage 1.", "Passage 2 gives a historical background for Passage 1.", "Both passages argue for building more zoos.", "Passage 1 responds to criticisms raised in Passage 2."], answer: 0,
          why: "Passage 2 takes Passage 1's points (breeding, education) and disputes them — {A}. {D} gets the order backwards." }
      ]
    }
  ]
},

{
  id: "figurative", part: 2, n: 8, title: "Figurative Language & Literary Devices", icon: "🎨",
  concept: "Figurative language says something beyond the literal words: similes (like/as), metaphors (saying one thing is another), personification (giving human traits to things), hyperbole (exaggeration), and imagery (details that appeal to the senses). Questions ask what an image means or why the author used it.",
  strategies: [
    "Ask what two things are being compared and what they have in common.",
    "Translate the figure into plain words: \"The classroom was a zoo\" means it was loud and chaotic.",
    "Think about the effect: does it create a mood, emphasize something, or reveal feeling?",
    "Don't take figurative choices literally — a \"heart of stone\" is not about rocks."
  ],
  example: {
    text: "The morning fog crept over the harbor on silent cat feet, settling over the boats until only their masts poked through like fingers.",
    stem: "The phrase \"crept over the harbor on silent cat feet\" mainly suggests that the fog",
    choices: ["came in quietly and slowly", "was dangerous to animals", "made a loud noise", "disappeared quickly"], answer: 0,
    why: "Cats move silently and carefully, so the fog arrived quietly and gradually — {A}."
  },
  passages: [
    {
      id: "fi-s", level: "starter", title: "Snow Day",
      vocab: [["blanket", "a warm covering"], ["glitter", "to shine with little sparkles"], ["hush", "a deep quiet"]],
      text: "When I woke up, the whole world was wearing a white blanket. The trees glittered like diamonds in the morning sun. A hush lay over the street, as if the town were holding its breath. My little brother ran outside, and in about one second he was a snowman with a red hat. The cold bit my nose, but I didn't care. It was a snow day!",
      questions: [
        { stem: "\"The whole world was wearing a white blanket\" means", choices: ["people were wearing blankets", "snow covered everything", "the world was cold and sick", "it was bedtime"], answer: 1,
          why: "The snow covers the ground the way a blanket covers a bed ({B})." },
        { stem: "\"The trees glittered like diamonds\" is a", choices: ["simile", "fact about diamonds", "question", "list"], answer: 0,
          why: "It compares trees to diamonds using \"like\" — a simile ({A})." },
        { stem: "\"The cold bit my nose\" means", choices: ["an animal bit the narrator", "the cold felt sharp and stinging", "the narrator has a cold", "the narrator was hungry"], answer: 1,
          why: "The cold can't really bite; it means the cold felt sharp ({B}). This is personification." }
      ]
    },
    {
      id: "fi-c", level: "core", title: "The Night Before the Race",
      vocab: [["churn", "to stir and turn over and over"], ["lumbering", "moving in a slow, heavy way"], ["anthem", "a song of celebration or pride"]],
      text: "The night before the state finals, Jada's stomach was a washing machine, churning and spinning no matter how she lay. The clock on her nightstand was a lumbering giant, each minute dragging its heavy feet. She replayed the course in her mind a thousand times: the long hill, the sharp turn by the lake, the final stretch where her coach would be shouting. Around midnight, rain began tapping on the window, soft and steady, like someone patiently knocking. Somehow, its rhythm became an anthem in her head — keep going, keep going — and at last, she slept.",
      questions: [
        { stem: "The metaphor \"her stomach was a washing machine\" suggests that Jada felt", choices: ["hungry", "nervous and unsettled", "sick from food", "excited to do laundry"], answer: 1,
          why: "A churning, spinning stomach is a picture of nervousness the night before a race ({B}). {A} and {C} take it too literally." },
        { stem: "Describing the clock as \"a lumbering giant\" emphasizes that", choices: ["the clock was very large", "time seemed to pass very slowly", "the clock was broken", "Jada was afraid of giants"], answer: 1,
          why: "Each minute \"dragging its heavy feet\" means time felt slow ({B})." },
        { stem: "\"She replayed the course in her mind a thousand times\" is an example of", choices: ["hyperbole", "a simile", "a fact", "an anthem"], answer: 0,
          why: "She did not literally replay it a thousand times; it's exaggeration — hyperbole ({A})." },
        { stem: "How does the image of the rain change by the end of the passage?", choices: ["It becomes frightening.", "It turns into a calming, encouraging rhythm.", "It stops completely.", "It wakes her up."], answer: 1,
          why: "The rain's rhythm becomes \"an anthem\" telling her to keep going, and she sleeps — {B}." }
      ]
    },
    {
      id: "fi-a", level: "advanced", title: "The Old City at Dusk",
      vocab: [["sentinel", "a guard who keeps watch"], ["ochre", "an earthy yellow-orange color"], ["palimpsest", "something reused or altered but still bearing traces of its earlier form"]],
      text: "At dusk the old city exhales. The heat that has pressed all day against its walls lifts, and the stones, washed ochre by the setting sun, seem briefly to glow from within. The cathedral's twin towers stand like sentinels who have outlasted every army they were built to watch for. Down below, the streets are a palimpsest: a Roman road runs beneath a medieval lane, which in turn runs beneath the bright storefronts of phone shops and cafés, each age written over the last but never quite erasing it. A child on a scooter rattles across the square, scattering pigeons, and for a moment the centuries fold together — a sound older than the towers and as new as tonight.",
      questions: [
        { stem: "The statement that \"the old city exhales\" primarily conveys", choices: ["a sense of relief and release as the day's heat lifts", "that the city is polluted", "that people are leaving the city", "that the city is in danger"], answer: 0,
          why: "Personifying the city as breathing out matches the heat lifting — relief ({A})." },
        { stem: "The comparison of the towers to sentinels suggests that the towers", choices: ["are newly built", "have stood watch over the city for a very long time", "were used as prisons", "are about to fall"], answer: 1,
          why: "Sentinels keep watch, and these have \"outlasted every army\" — long endurance ({B})." },
        { stem: "The author calls the streets \"a palimpsest\" to emphasize that", choices: ["they are poorly maintained", "layers of the city's history remain visible beneath newer ones", "they were recently repaved", "the city has no history"], answer: 1,
          why: "Roman, medieval and modern layers, \"each age written over the last but never quite erasing it\" — {B}." },
        { stem: "The final sentence mainly creates the effect of", choices: ["the past and present seeming to meet in a single moment", "warning readers about scooters", "describing pigeons scientifically", "ending the passage on a frightening note"], answer: 0,
          why: "\"The centuries fold together\" — an image of past and present joining ({A})." }
      ]
    }
  ]
},

{
  id: "summarize", part: 2, n: 9, title: "Summarizing & Paraphrasing", icon: "📝",
  concept: "A summary gives the most important ideas of a passage in fewer words, without opinions or small details. A paraphrase restates one sentence or idea in different words while keeping the exact meaning. Both test whether you can separate what matters from what doesn't.",
  strategies: [
    "A good summary covers the beginning, middle and end — not just one part.",
    "Leave out examples, numbers and opinions that aren't central.",
    "A paraphrase must keep the original meaning: watch for choices that change \"some\" to \"all\" or add new claims.",
    "If a choice adds something the passage never said, it's wrong — even if it sounds true."
  ],
  example: {
    text: "Although electric cars cost more to buy than gas cars, they usually cost less to run, because electricity is cheaper than gasoline and electric motors need fewer repairs.",
    stem: "Which choice best paraphrases the sentence?",
    choices: ["Electric cars are cheaper in every way.", "Electric cars cost more at first but are usually cheaper to operate over time.", "Gas cars need fewer repairs than electric cars.", "Electricity is more expensive than gasoline."], answer: 1,
    why: "{B} keeps both parts: higher purchase price, lower running cost. {A} overstates (\"every way\"). {C} and {D} reverse the facts."
  },
  passages: [
    {
      id: "su-s", level: "starter", title: "The Lost Kite",
      vocab: [["gust", "a sudden strong wind"], ["tangle", "to twist up into a knot"], ["rescue", "to save from danger"]],
      text: "Mia and her dad flew a red kite at the beach. A strong gust pulled the string out of Mia's hands, and the kite flew away. It got tangled in a tall tree. Mia was sad. Her dad found a long stick, and together they gently pulled the kite free. It had a small rip, but they fixed it with tape at home. The next weekend, Mia held the string tight with both hands.",
      questions: [
        { stem: "Which is the best summary of the story?", choices: ["Mia and her dad went to the beach.", "Mia's kite blew into a tree, she and her dad rescued and fixed it, and next time she held on tight.", "The kite was red.", "Mia's dad found a long stick."], answer: 1,
          why: "{B} covers the beginning, middle and end. {A}, {C} and {D} are single details." },
        { stem: "Which detail is NOT important enough for a summary?", choices: ["The kite got stuck in a tree.", "They got the kite down.", "The kite was red.", "They fixed the kite."], answer: 2,
          why: "The color doesn't change what happens, so it can be left out ({C})." },
        { stem: "Which sentence means the same as \"Mia held the string tight with both hands\"?", choices: ["Mia let go of the string.", "Mia held on firmly so she wouldn't lose the kite.", "Mia's hands were cold.", "Mia gave the kite to her dad."], answer: 1,
          why: "{B} says the same thing in different words. The others change the meaning." }
      ]
    },
    {
      id: "su-c", level: "core", title: "The Great Molasses Flood",
      vocab: [["molasses", "a thick, sticky, dark syrup"], ["rupture", "to burst or break open"], ["regulation", "an official rule"]],
      text: "On a warm January day in 1919, a huge storage tank in Boston ruptured, releasing more than two million gallons of molasses into the streets. A wave of thick syrup, at times twenty-five feet high, rushed through the neighborhood at about thirty-five miles per hour, knocking buildings off their foundations. Twenty-one people died and around 150 were injured. Investigators later found that the tank had been poorly built and never properly tested; it had even leaked so badly that the company painted it brown to hide the drips. The disaster led to new regulations requiring engineers to check and approve the plans for large construction projects.",
      questions: [
        { stem: "Which choice best summarizes the passage?", choices: ["Molasses is a thick syrup.", "In 1919, a badly built molasses tank burst in Boston, killing 21 people, and the disaster led to new building rules.", "The tank was painted brown.", "Boston is a city with many old buildings."], answer: 1,
          why: "{B} includes the event, its cause, its human cost and its result. The others are minor details or unrelated." },
        { stem: "Which detail would be LEAST necessary in a short summary?", choices: ["The tank burst in 1919.", "The wave moved at about thirty-five miles per hour.", "Poor construction caused the disaster.", "New regulations followed."], answer: 1,
          why: "The exact speed is a vivid detail but not essential to the main points ({B})." },
        { stem: "Which choice best paraphrases \"it had even leaked so badly that the company painted it brown to hide the drips\"?", choices: ["The company painted the tank brown because it looked nicer.", "The tank leaked so much that the company tried to disguise the leaks with paint.", "The tank never leaked.", "The molasses was brown."], answer: 1,
          why: "{B} keeps the meaning — leaking, then hiding it with paint. {A} changes the reason; {C} contradicts it." },
        { stem: "A student summarizes the passage as \"Companies never test their tanks.\" Why is this summary inaccurate?", choices: ["It is too short.", "It overgeneralizes from one company to all companies.", "It mentions Boston.", "It leaves out the date."], answer: 1,
          why: "The passage is about one tank and one company; \"companies never\" is a sweeping claim the passage doesn't make ({B})." }
      ]
    },
    {
      id: "su-a", level: "advanced", title: "The Placebo Puzzle",
      vocab: [["placebo", "a treatment with no active medicine"], ["efficacy", "the ability to produce the intended result"], ["expectation", "a belief about what will happen"]],
      text: "For most of the twentieth century, the placebo was treated as a nuisance — the background noise that a real drug had to rise above in clinical trials. Researchers have since come to see it as a phenomenon worth studying in its own right. In trials for conditions such as chronic pain and irritable bowel syndrome, patients given inert pills often report substantial improvement, and brain imaging suggests that the expectation of relief can trigger the release of the body's own pain-reducing chemicals. More surprising still, some studies have found benefits even when patients were told openly that their pills contained no medicine. These findings do not mean placebos can cure disease; they have shown little efficacy against tumors or infections, for instance. But they suggest that the context of treatment — a patient's beliefs, rituals, and relationship with a caregiver — may influence outcomes more than was once assumed.",
      questions: [
        { stem: "Which choice best summarizes the passage?", choices: ["Placebos cure most diseases when patients believe in them.", "Once dismissed as background noise, the placebo effect is now studied seriously because expectations and the context of treatment can measurably influence some symptoms, though not diseases like infections.", "Brain imaging is the most important tool in modern medicine.", "Patients should stop taking real medicine."], answer: 1,
          why: "{B} captures the shift in view, the evidence and the stated limits. {A} directly contradicts the passage's limit. {C} and {D} aren't claimed." },
        { stem: "Which choice best paraphrases \"the placebo was treated as a nuisance — the background noise that a real drug had to rise above\"?", choices: ["Placebos were considered the most effective treatment.", "Placebo effects were seen as an annoying baseline that real drugs had to outperform.", "Doctors played music during trials.", "Placebos were banned from trials."], answer: 1,
          why: "{B} keeps both parts: seen as an annoyance and as the baseline to beat." },
        { stem: "Which detail is essential to an accurate summary because it limits the passage's claims?", choices: ["Placebos have shown little efficacy against tumors or infections.", "The trials involved irritable bowel syndrome.", "Placebos are pills.", "Researchers used brain imaging."], answer: 0,
          why: "Without {A}, a summary would overstate what placebos can do. The others are supporting details." },
        { stem: "The phrase \"More surprising still\" signals that the next finding", choices: ["contradicts all previous research", "goes further than the findings already described", "is less important", "is about tumors"], answer: 1,
          why: "It escalates — benefits even when patients know it's a placebo — {B}." }
      ]
    }
  ]
}

);
