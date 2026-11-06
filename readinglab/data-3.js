// Reading Lab — Part III: Argument & Rhetoric. Original passages; see data-1.js for the shape.
// Chart passages carry `chart: { title, unit, rows: [[label, value], ...] }`, drawn as a bar chart
// beside the text; questions about it must be answerable from those numbers alone.
(window.RL_SKILLS = window.RL_SKILLS || []).push(

{
  id: "claims", part: 3, n: 10, title: "Claims, Evidence & Reasoning", icon: "🧠",
  concept: "A claim is what the author wants you to believe. Evidence is the proof (data, examples, expert findings). Reasoning connects the two by explaining why the evidence supports the claim. Strong arguments have all three; weak ones skip steps or use evidence that doesn't really fit.",
  strategies: [
    "Find the claim first — often a \"should\" statement or a clear position.",
    "Ask: does this evidence actually prove this claim, or just something related to it?",
    "Watch for jumps: one example used to prove a rule about everything.",
    "Questions often ask which new finding would strengthen or weaken the claim."
  ],
  example: {
    text: "Our school should start fifteen minutes later. Teenagers' sleep cycles naturally shift later during adolescence, and schools that delayed their start times reported fewer tardies and higher attendance.",
    stem: "Which choice best describes the role of the information about sleep cycles?",
    choices: ["It is the author's claim.", "It provides reasoning for why a later start could help students.", "It weakens the author's argument.", "It is an unrelated detail."], answer: 1,
    why: "The claim is \"start fifteen minutes later.\" The sleep-cycle fact explains why that would help — reasoning that links the claim to the attendance evidence ({B})."
  },
  passages: [
    {
      id: "cl-s", level: "starter", title: "We Need a Class Garden",
      vocab: [["claim", "what someone wants you to believe"], ["harvest", "to pick crops when they are ready"], ["reason", "why something is true or a good idea"]],
      text: "Our class should plant a garden. First, a garden would teach us about science, like how plants use sunlight and water. Second, we could harvest vegetables and taste them at lunch. Kids who grow vegetables are more likely to eat them! Third, working in the garden would get us outside and moving. A class garden is a great idea for everyone.",
      questions: [
        { stem: "What is the author's claim?", choices: ["Plants use sunlight.", "Our class should plant a garden.", "Lunch is too short.", "Vegetables are green."], answer: 1,
          why: "The author wants us to believe the class should plant a garden — that's the claim ({B}). The others are details or not stated." },
        { stem: "Which is a reason the author gives?", choices: ["Gardens are expensive.", "A garden would get us outside and moving.", "Gardens need lots of rain.", "Bugs live in gardens."], answer: 1,
          why: "{B} is one of the three reasons (First, Second, Third)." },
        { stem: "Which sentence gives evidence that kids will eat the vegetables?", choices: ["\"Kids who grow vegetables are more likely to eat them!\"", "\"Our class should plant a garden.\"", "\"A class garden is a great idea for everyone.\"", "\"First, a garden would teach us about science.\""], answer: 0,
          why: "{A} is the support for eating vegetables. {B} and {C} state the claim; {D} is a different reason." }
      ]
    },
    {
      id: "cl-c", level: "core", title: "Ban Phones at Lunch?",
      vocab: [["policy", "a rule or plan an organization follows"], ["interact", "to talk and do things with others"], ["anecdote", "a short personal story used as an example"]],
      text: "Our school should ban phones during lunch. When phones are out, students stare at screens instead of talking to each other. A school in our district tried a lunchtime phone ban last year; afterward, 68 percent of students surveyed said they talked to more classmates during lunch, and counselors reported fewer conflicts that started online. Lunch is one of the few times in the day when students can interact freely, and phones are crowding that time out. My own friend group used to sit in silence scrolling; now that we leave our phones in our bags, we actually catch up. A lunchtime ban is a small policy change that could make a big difference.",
      questions: [
        { stem: "What is the main claim of the passage?", choices: ["Phones should be banned all day.", "The school should ban phones during lunch.", "Students talk too much at lunch.", "Counselors need more training."], answer: 1,
          why: "The first and last sentences state it — {B}. {A} goes beyond the claim (only lunch)." },
        { stem: "Which evidence is the strongest support for the claim?", choices: ["The author's friend group now talks more.", "68 percent of surveyed students at a school with a ban said they talked to more classmates.", "Lunch is one of the few free times in the day.", "Phones are small."], answer: 1,
          why: "A survey of many students at a school that tried the policy is stronger than one friend group's anecdote ({A}). {C} is reasoning, not evidence." },
        { stem: "The story about the author's friend group functions as", choices: ["an anecdote that adds personal support", "statistical proof", "a counterargument", "the claim"], answer: 0,
          why: "It is a personal story — an anecdote ({A}), which supports the claim but is weaker than data." },
        { stem: "Which finding, if true, would most WEAKEN the author's argument?", choices: ["Students at the other school also reported enjoying lunch more.", "Conflicts at the other school rose after the ban.", "Many students already leave phones in their bags.", "Phones are useful in class."], answer: 1,
          why: "The argument uses fewer conflicts as support; if conflicts rose, that evidence would be undercut ({B}). {A} would strengthen it." }
      ]
    },
    {
      id: "cl-a", level: "advanced", title: "The Four-Minute Mile of Recycling",
      vocab: [["contamination", "unwanted material mixed in that spoils something"], ["incentive", "something that motivates action"], ["extrapolate", "to extend known results to a new situation"]],
      text: "Cities hoping to increase recycling often begin with awareness campaigns: posters, mailers, and school assemblies urging residents to do their part. The evidence suggests such campaigns rarely move the numbers for long. A more reliable lever, I would argue, is price. When one mid-sized city switched from a flat trash fee to charging households by the bag, its recycling rate rose from 22 to 41 percent within two years, while the volume of landfill waste fell by nearly a third. Critics warn that pay-per-bag systems encourage illegal dumping, and that problem deserves attention; yet the city reported only a small, temporary increase that faded once enforcement improved. One success, of course, does not guarantee another, and it would be unwise to extrapolate directly to cities with very different housing. Still, when the incentive changes, behavior tends to follow — a lesson that years of posters have not managed to teach.",
      questions: [
        { stem: "Which choice best states the author's central claim?", choices: ["Awareness campaigns are the best way to increase recycling.", "Charging households by the amount of trash is a more reliable way to increase recycling than awareness campaigns.", "Illegal dumping makes pay-per-bag systems impossible.", "All cities should recycle 41 percent of their waste."], answer: 1,
          why: "\"A more reliable lever, I would argue, is price\" — {B}. {A} is what the author argues against; {C} is a concern the author addresses; {D} invents a target." },
        { stem: "The city's change from 22 to 41 percent primarily serves as", choices: ["evidence for the effectiveness of pricing", "a counterargument", "an example of an awareness campaign", "proof that every city will succeed"], answer: 0,
          why: "It shows results after the price change — evidence ({A}). The author explicitly warns against {D}." },
        { stem: "How does the author handle the concern about illegal dumping?", choices: ["Ignores it", "Acknowledges it and offers evidence that it was limited and temporary", "Agrees it makes the policy a failure", "Claims dumping never happens"], answer: 1,
          why: "\"That problem deserves attention; yet… only a small, temporary increase\" — acknowledge and respond ({B})." },
        { stem: "Which sentence shows the author limiting the strength of the claim?", choices: ["\"The evidence suggests such campaigns rarely move the numbers.\"", "\"One success, of course, does not guarantee another.\"", "\"When the incentive changes, behavior tends to follow.\"", "\"Cities hoping to increase recycling often begin with awareness campaigns.\""], answer: 1,
          why: "{B} admits the evidence comes from one city and may not transfer — a limit on the claim." }
      ]
    }
  ]
},

{
  id: "bias", part: 3, n: 11, title: "Bias, Rhetoric & Counterarguments", icon: "📣",
  concept: "Bias is when a writer favors one side, sometimes without saying so. Rhetoric is the set of tools used to persuade: loaded words, emotional appeals, appeals to experts, and rhetorical questions. A counterargument is the other side's view; strong writers address it fairly instead of ignoring or twisting it.",
  strategies: [
    "Look for loaded words (\"reckless,\" \"heroic\") that push feelings instead of facts.",
    "Ask whose voices are included — and whose are missing.",
    "Notice how the writer treats the other side: fairly stated, mocked, or ignored?",
    "A neutral version of a sentence uses plain words that don't take sides."
  ],
  example: {
    text: "The reckless city council has once again wasted taxpayer money on a so-called \"art project\" that no one asked for.",
    stem: "Which choice is the most neutral way to describe the same event?",
    choices: ["The heroic council funded a brilliant artwork.", "The city council approved funding for a public art project.", "The council foolishly threw away money.", "Nobody likes the council's art."], answer: 1,
    why: "{B} states the facts without loaded words like \"reckless,\" \"wasted\" or \"so-called.\" {A} is biased in the other direction."
  },
  passages: [
    {
      id: "bi-s", level: "starter", title: "The Best Cereal Ever",
      vocab: [["opinion", "what someone thinks or feels"], ["fact", "something that can be proven true"], ["advertisement", "a message trying to get you to buy something"]],
      text: "Crunch Stars is the most amazing cereal in the whole universe! Every bite is packed with super crunchy fun. Smart kids everywhere choose Crunch Stars. Each bowl has 8 grams of sugar and comes with a free sticker. Why would you eat boring cereal when you could eat Crunch Stars?",
      questions: [
        { stem: "What is the purpose of this passage?", choices: ["To teach about farming", "To get you to buy Crunch Stars", "To tell a true story", "To explain how cereal is made"], answer: 1,
          why: "It praises the cereal and asks why you'd eat anything else — it's an advertisement ({B})." },
        { stem: "Which sentence is a FACT?", choices: ["\"It is the most amazing cereal in the universe!\"", "\"Each bowl has 8 grams of sugar.\"", "\"Smart kids everywhere choose Crunch Stars.\"", "\"Every bite is packed with super crunchy fun.\""], answer: 1,
          why: "Sugar grams can be measured and proven ({B}). The others are opinions or exaggerations." },
        { stem: "\"Smart kids everywhere choose Crunch Stars\" is meant to make you", choices: ["feel that you should buy it to be smart too", "learn about the brain", "eat less cereal", "go to school"], answer: 0,
          why: "It suggests smart kids pick it, so you should too — a persuasion trick ({A})." }
      ]
    },
    {
      id: "bi-c", level: "core", title: "Skate Park Showdown",
      vocab: [["loaded word", "a word chosen to cause strong feelings"], ["perspective", "a point of view"], ["omit", "to leave out"]],
      text: "Last night, angry neighbors crowded into City Hall to stop a new skate park from ruining their quiet street. Residents complained about the noise and the gangs of teenagers who would flock there day and night. \"Our property values will crash,\" warned one homeowner. The council will vote next week on whether to destroy the last open field in the neighborhood for the project.",
      questions: [
        { stem: "Which group's perspective is missing from the passage?", choices: ["Homeowners near the site", "The skaters and supporters of the park", "City Hall", "Neighbors who worry about noise"], answer: 1,
          why: "Only opponents are quoted; no supporter or skater is heard ({B})." },
        { stem: "Which phrase is the clearest example of a loaded word choice?", choices: ["\"will vote next week\"", "\"gangs of teenagers\"", "\"City Hall\"", "\"new skate park\""], answer: 1,
          why: "\"Gangs\" makes teenagers sound dangerous rather than describing them neutrally ({B})." },
        { stem: "Which is the most neutral way to state the last sentence?", choices: ["The council will vote next week on whether to build the skate park on the open field.", "The council will finally save the field next week.", "The council will ruin the neighborhood next week.", "Teenagers will take over the field next week."], answer: 0,
          why: "{A} removes \"destroy\" and states the decision plainly. The others take a side." },
        { stem: "The passage is biased mainly because it", choices: ["uses numbers", "presents only one side and uses emotional language", "mentions City Hall", "is too short"], answer: 1,
          why: "Only opponents' views plus words like \"ruining\" and \"destroy\" — {B}." }
      ]
    },
    {
      id: "bi-a", level: "advanced", title: "The Debate Over Daylight Saving",
      vocab: [["concede", "to admit a point to the other side"], ["straw man", "a weak or twisted version of an opponent's argument, set up to be easily defeated"], ["equivocal", "unclear or open to more than one interpretation"]],
      text: "Each spring, the clocks spring forward and the predictable complaints return. Opponents of daylight saving time point to studies showing a brief rise in heart attacks and traffic accidents in the days after the change. These findings are real, and I concede that the transition itself is disruptive. But the solution is not to abolish daylight saving; it is to make it permanent. Some critics insist that permanent daylight time would force children to wait for school buses in pitch darkness all winter. This concern is not frivolous, though it is often overstated: districts could shift start times, as several already have. What critics rarely acknowledge is the evidence on the other side — that longer evenings are associated with more outdoor activity and fewer evening traffic deaths. The research is admittedly equivocal on the long-term effects, but on balance it favors light in the evening over light at dawn.",
      questions: [
        { stem: "How does the author treat the evidence about heart attacks and accidents?", choices: ["Dismisses it as false", "Concedes that it is real while arguing for a different solution", "Uses it to support abolishing daylight saving", "Ignores it"], answer: 1,
          why: "\"These findings are real, and I concede…\" then argues for permanence instead — {B}." },
        { stem: "In addressing the school-bus concern, the author", choices: ["sets up a straw man to mock critics", "calls the concern reasonable but argues it can be addressed", "agrees that permanent daylight time is impossible", "says children should not ride buses"], answer: 1,
          why: "\"Not frivolous, though often overstated\" plus a proposed fix — {B}. The author states the concern fairly, so {A} doesn't apply." },
        { stem: "The phrase \"the predictable complaints\" suggests the author", choices: ["is completely neutral", "views opponents' arguments with some impatience", "agrees with the complaints", "is uncertain what opponents believe"], answer: 1,
          why: "Calling complaints \"predictable\" shows a slightly dismissive attitude — a sign of the author's leaning ({B})." },
        { stem: "Which statement best describes the author's use of evidence?", choices: ["The author presents only evidence that supports one side.", "The author acknowledges evidence on both sides and admits the research is not conclusive.", "The author relies entirely on personal stories.", "The author offers no evidence."], answer: 1,
          why: "Both sides' studies are mentioned and the research is called \"admittedly equivocal\" — {B}." }
      ]
    }
  ]
},

{
  id: "charts", part: 3, n: 12, title: "Charts, Graphs & Informational Texts", icon: "📊",
  concept: "Some passages come with a chart or table. Questions ask you to read the numbers correctly, connect them to the text, and decide what the data does — and does not — show. The most common trap is a choice that sounds reasonable but isn't actually supported by the numbers.",
  strategies: [
    "Read the title, labels and units before looking at the bars or numbers.",
    "Find the exact numbers the question asks about; don't estimate if you can read them.",
    "A chart shows what happened, not why. Be careful with choices about causes.",
    "Check whether the text and the chart agree, and what each adds."
  ],
  example: {
    text: "A survey asked 200 students how they get to school. 90 walk, 60 ride the bus, 30 are driven, and 20 bike.",
    chart: { title: "How students get to school", unit: "students", rows: [["Walk", 90], ["Bus", 60], ["Car", 30], ["Bike", 20]] },
    stem: "What fraction of the surveyed students walk to school?",
    choices: ["About one-quarter", "Less than half", "Exactly half", "Most of them"], answer: 1,
    why: "90 out of 200 is 45 percent — less than half ({B}). It is more than a quarter ({A} wrong), not exactly half ({C}), and not most ({D})."
  },
  passages: [
    {
      id: "ch-s", level: "starter", title: "Our Class Pet Vote",
      vocab: [["vote", "to choose by saying or marking your choice"], ["most", "the biggest amount"], ["fewest", "the smallest amount"]],
      text: "Our class voted for a new class pet. Each student got one vote. The chart shows how many votes each pet got. The pet with the most votes will come to our classroom next month!",
      chart: { title: "Class pet votes", unit: "votes", rows: [["Hamster", 9], ["Fish", 6], ["Turtle", 4], ["Rabbit", 3]] },
      questions: [
        { stem: "Which pet will come to the classroom?", choices: ["Fish", "Hamster", "Turtle", "Rabbit"], answer: 1,
          why: "The hamster got the most votes (9), so it wins ({B})." },
        { stem: "Which pet got the fewest votes?", choices: ["Hamster", "Fish", "Turtle", "Rabbit"], answer: 3,
          why: "The rabbit got only 3 votes — the fewest ({D})." },
        { stem: "How many students voted in all?", choices: ["9", "19", "22", "4"], answer: 2,
          why: "Add them up: 9 + 6 + 4 + 3 = 22 ({C})." }
      ]
    },
    {
      id: "ch-c", level: "core", title: "Screen Time and Sleep",
      vocab: [["survey", "a set of questions asked to many people"], ["average", "the typical amount, found by adding and dividing"], ["correlation", "a connection where two things change together"]],
      text: "A middle school surveyed 400 students about their screen use in the hour before bed and how many hours they usually sleep. The results are shown in the chart. Students who used screens the most before bed reported the least sleep. The school's newsletter concluded that \"screens before bed cause students to lose sleep.\"",
      chart: { title: "Average hours of sleep, by screen time in the hour before bed", unit: "hours of sleep", rows: [["No screens", 9.1], ["Under 30 min", 8.6], ["30–60 min", 8.0], ["Full hour", 7.2]] },
      questions: [
        { stem: "According to the chart, students who used screens for the full hour slept on average", choices: ["9.1 hours", "8.0 hours", "7.2 hours", "8.6 hours"], answer: 2,
          why: "The \"Full hour\" bar is 7.2 hours ({C})." },
        { stem: "How much more sleep did students with no screens get than students with a full hour of screens?", choices: ["0.5 hours", "1.9 hours", "1.1 hours", "2.5 hours"], answer: 1,
          why: "9.1 − 7.2 = 1.9 hours ({B})." },
        { stem: "Which statement is best supported by the data?", choices: ["More screen time before bed is associated with less sleep.", "Every student who uses screens sleeps badly.", "Screens are the only cause of lost sleep.", "Students sleep more on weekends."], answer: 0,
          why: "The chart shows a pattern (correlation) — {A}. {B} overgeneralizes from averages; {C} claims a cause; {D} isn't in the data." },
        { stem: "Why is the newsletter's conclusion stronger than the data allows?", choices: ["The survey was too large.", "A survey shows a connection but cannot prove that screens cause the lost sleep.", "The chart has four bars.", "Students cannot report their own sleep."], answer: 1,
          why: "Students who sleep less might use screens more for another reason; correlation isn't causation ({B})." }
      ]
    },
    {
      id: "ch-a", level: "advanced", title: "Where the Town's Electricity Comes From",
      vocab: [["renewable", "coming from a source that doesn't run out, like wind or sun"], ["proportion", "a part compared to the whole"], ["projection", "an estimate of the future based on current data"]],
      text: "In 2015, the town of Millbrook drew nearly all of its electricity from a coal plant and a natural-gas plant. Over the following decade, it added a wind farm on the ridge and rooftop solar on schools and public buildings. The chart shows the share of the town's electricity from each source in 2025. Town officials have described Millbrook as \"mostly renewable,\" and a recent report projects that solar's share could double by 2035 if current installation rates continue. Critics note that the coal plant, though smaller, still runs year-round and remains the single largest source of local air pollution.",
      chart: { title: "Millbrook electricity by source, 2025", unit: "percent", rows: [["Natural gas", 34], ["Wind", 28], ["Coal", 18], ["Solar", 14], ["Hydro", 6]] },
      questions: [
        { stem: "According to the chart, what percentage of Millbrook's electricity came from renewable sources (wind, solar and hydro) in 2025?", choices: ["28 percent", "42 percent", "48 percent", "52 percent"], answer: 2,
          why: "28 + 14 + 6 = 48 percent ({C})." },
        { stem: "Is the officials' description of the town as \"mostly renewable\" supported by the chart?", choices: ["Yes, because wind is the largest source.", "No, because renewable sources make up less than half of the town's electricity.", "Yes, because coal is the smallest source.", "No, because the chart has no renewable sources."], answer: 1,
          why: "48 percent is less than half, so \"mostly\" is not supported ({B}). Natural gas is the largest source ({A} wrong); hydro is smallest ({C} wrong)." },
        { stem: "If solar's share doubles by 2035 as projected and every other source stays the same, which statement would be true?", choices: ["Solar would become the largest single source.", "Solar would provide 28 percent, the same as wind provides now.", "Coal would disappear.", "Renewable sources would fall."], answer: 1,
          why: "14 × 2 = 28, which equals wind's share ({B}). Natural gas at 34 percent would still be larger, so {A} is false." },
        { stem: "Which claim from the passage can NOT be checked using the chart?", choices: ["Natural gas is the largest source.", "Wind provides more electricity than coal.", "The coal plant is the largest source of local air pollution.", "Hydro is the smallest source."], answer: 2,
          why: "The chart shows electricity shares, not pollution, so {C} can't be checked with it. The others can be read directly." }
      ]
    }
  ]
}

);
