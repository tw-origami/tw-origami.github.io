function S(id, text){ return { id, text }; }
function Q(skill, prompt, choices, answer, explain, evidence, note){
  return { skill, prompt, choices, answer, explain, evidence, note };
}

window.READING_RESCUE = {
  burstTime: 95,
  passages: [
    {
      title: "Rooftop Garden",
      tag: "Informational",
      level: "Grade 5-6",
      hook: "A city school turns an empty roof into something useful.",
      paragraphs: [
        [
          S("rg1", "At Jefferson Middle School, the roof used to be a hot, empty space covered in gray tar."),
          S("rg2", "Now it holds raised garden beds, a rain barrel, and a narrow path where students can stop and observe insects.")
        ],
        [
          S("rg3", "Science teacher Ms. Diaz pushed for the project after noticing that her students understood plant diagrams but had little experience growing anything themselves."),
          S("rg4", "She wanted them to see how roots spread, how soil dries out, and how weather changes what a plant needs from one week to the next.")
        ],
        [
          S("rg5", "The garden did more than improve science lessons."),
          S("rg6", "During lunch, some students began volunteering to water the beds or weigh the vegetables before they were donated to a neighborhood pantry."),
          S("rg7", "By spring, the roof had become one of the busiest and calmest places in the building.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mostly about?", [
          "How difficult it is to repair a school roof",
          "How a rooftop garden changed learning and school life",
          "Why insects are a problem in cities",
          "Why lunches should be longer"
        ], 1, "The passage focuses on how the rooftop garden helped students learn and also changed the feel of the school.", ["rg2","rg3","rg5","rg7"], "These sentences show both the garden itself and the effect it had."),
        Q("Author's Purpose", "Why does the author include Ms. Diaz's reasons for starting the garden?", [
          "To show that the garden was created mainly for decoration",
          "To explain how the project connects to real learning",
          "To prove that textbooks are useless",
          "To compare Jefferson Middle School to other schools"
        ], 1, "The author includes Ms. Diaz's reasoning to show that the garden gave students hands-on science experience.", ["rg3","rg4"], "These lines explain the learning goal behind the project."),
        Q("Inference", "What can you infer about the students from the passage?", [
          "They were forced to work in the garden every day",
          "They became more interested in helping once the garden opened",
          "They disliked science class before the project",
          "They wanted the roof closed during lunch"
        ], 1, "The passage says students began volunteering, which suggests the project made them want to take part.", ["rg6"], "Volunteering is a clue that students were engaged, not just assigned work."),
        Q("Vocabulary in Context", "In the passage, the word \"observe\" most nearly means —", [
          "ignore",
          "watch carefully",
          "draw from memory",
          "measure with a ruler"
        ], 1, "Students stop to observe insects, which means they watch them closely.", ["rg2"], "The clue is the path where students stop and look at insects.")
      ]
    },
    {
      title: "The Blue Bench",
      tag: "Fiction",
      level: "Grade 5-6",
      hook: "A quiet student notices something everyone else missed.",
      paragraphs: [
        [
          S("bb1", "Every afternoon, Nora waited for her older brother on the bright blue bench outside the library."),
          S("bb2", "Most days she read while buses hissed at the curb and parents waved through car windows.")
        ],
        [
          S("bb3", "One windy Tuesday, Nora found a paper tucked under the bench leg so it would not blow away."),
          S("bb4", "It was a grocery list with only four items on it, but the last line read, \"birthday candles - blue if possible.\"")
        ],
        [
          S("bb5", "Nora looked toward the parking lot and saw the crossing guard searching the ground near her bag."),
          S("bb6", "When Nora handed over the list, the guard let out a breathy laugh and said, \"I thought I had lost the most important part.\""),
          S("bb7", "All the way home, Nora kept thinking about those blue candles and the small relief in the guard's voice.")
        ]
      ],
      questions: [
        Q("Inference", "Why does Nora keep thinking about the blue candles at the end?", [
          "She wants to buy candles for herself",
          "She now understands the lost list mattered to someone",
          "She dislikes the color blue",
          "She plans to stop waiting at the library"
        ], 1, "Nora notices the guard's relief, which suggests she understands the list was important for a real reason.", ["bb4","bb6","bb7"], "The birthday candles clue and the guard's reaction help explain Nora's thoughts."),
        Q("Text Evidence", "Which detail best shows that Nora is observant?", [
          "She waited for her brother every afternoon",
          "She read while the buses lined up",
          "She noticed a paper tucked under the bench leg",
          "She walked home after school"
        ], 2, "Seeing the paper under the bench is the clearest evidence that Nora notices small details.", ["bb3"], "This is the exact moment her careful attention matters."),
        Q("Main Idea", "What is a central idea of this passage?", [
          "Libraries should stay open later",
          "Small acts of attention can help other people",
          "Crossing guards carry too many things",
          "Waiting is always boring"
        ], 1, "The passage shows that Nora notices something small and helps someone else because of it.", ["bb3","bb6"], "These sentences show the discovery and the helpful result."),
        Q("Vocabulary in Context", "In the phrase \"let out a breathy laugh,\" the word \"breathy\" helps show that the guard felt —", [
          "furious",
          "relieved and a little emotional",
          "sleepy",
          "confused"
        ], 1, "The guard had been searching and then found the list, so the laugh sounds relieved.", ["bb5","bb6"], "The searching and then the laugh together show the feeling.")
      ]
    },
    {
      title: "Fast Water, Slow Thinking",
      tag: "Science",
      level: "Grade 6",
      hook: "A team learns that quick results are not always the best results.",
      paragraphs: [
        [
          S("fw1", "For the school engineering fair, Omar's team built two tiny water wheels from cardboard spoons and corks."),
          S("fw2", "Their goal was simple: place each wheel under a stream of water and see which design spun longer.")
        ],
        [
          S("fw3", "At first, the team cheered for the wheel that spun fastest."),
          S("fw4", "But after several trials, they noticed that the fast wheel wobbled, splashed, and stopped after only a few seconds."),
          S("fw5", "The slower wheel looked less exciting, yet it stayed steady and kept turning each time they tested it.")
        ],
        [
          S("fw6", "When it was time to write their conclusion, Omar crossed out the sentence \"Design A is best because it is faster.\""),
          S("fw7", "He replaced it with a new claim: \"Design B is stronger because it is more stable and more reliable.\"")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mainly about?", [
          "Why cardboard is a poor material for science projects",
          "How a team changed its conclusion after looking at better evidence",
          "How to build the fastest water wheel possible",
          "Why school fairs should include fewer experiments"
        ], 1, "The passage shows the team moving from first excitement to a stronger conclusion based on repeated evidence.", ["fw3","fw4","fw5","fw7"], "These parts show how the team's thinking changed."),
        Q("Inference", "What lesson did Omar's team learn?", [
          "The noisiest result is always the best one",
          "One trial is enough for a strong conclusion",
          "Reliable results matter more than flashy results",
          "Science projects should avoid water"
        ], 2, "The team learns that steady, repeated success matters more than a quick dramatic moment.", ["fw4","fw5","fw7"], "The wobbling wheel vs. the stable wheel shows what convinced them."),
        Q("Author's Purpose", "Why does the author include Omar crossing out his first sentence?", [
          "To show exactly how the team's thinking improved",
          "To prove that Omar dislikes writing",
          "To show that Design A completely broke apart",
          "To explain how long the fair lasted"
        ], 0, "That moment lets the reader see the team's old idea and the stronger conclusion that replaced it.", ["fw6","fw7"], "These lines make the change in reasoning visible."),
        Q("Vocabulary in Context", "In this passage, the word \"reliable\" most nearly means —", [
          "easy to decorate",
          "likely to work the same way again",
          "made of expensive parts",
          "lighter than expected"
        ], 1, "The slower wheel was reliable because it kept working in repeated trials.", ["fw5","fw7"], "The passage connects reliability with steady repeated performance.")
      ]
    },
    {
      title: "The Missing Headline",
      tag: "Informational",
      level: "Grade 6-7",
      hook: "A school paper discovers that facts alone are not enough.",
      paragraphs: [
        [
          S("mh1", "When the first issue of the school newspaper came back from the printer, everyone rushed to the front table."),
          S("mh2", "The photos looked sharp, the columns were straight, and the pages felt official in a way the staff had never experienced before.")
        ],
        [
          S("mh3", "Then Maya noticed something strange on page one."),
          S("mh4", "The biggest article had no headline, only a blank white space above the opening paragraph."),
          S("mh5", "The reporting was still accurate, but readers passing by could not quickly tell what the story was about.")
        ],
        [
          S("mh6", "At the next meeting, the adviser did not scold anyone."),
          S("mh7", "Instead, she asked the staff what a headline does for a busy reader."),
          S("mh8", "By the end of the discussion, the group had a better answer than \"it looks nice.\"")
        ]
      ],
      questions: [
        Q("Author's Purpose", "Why does the author mention that the reporting was still accurate?", [
          "To show that headlines matter even when the facts are good",
          "To prove the printer caused every problem",
          "To suggest the article should be deleted",
          "To compare newspapers to books"
        ], 0, "The author is showing that accuracy matters, but presentation also helps readers understand the story quickly.", ["mh4","mh5"], "These lines connect the missing headline to the reader's confusion."),
        Q("Main Idea", "What is a central idea of the passage?", [
          "Printing school newspapers is too expensive",
          "Good writing must also be organized for readers",
          "Photographs are the most important part of a paper",
          "Advisers should fix every mistake themselves"
        ], 1, "The passage shows that even accurate reporting needs helpful structure so readers can follow it.", ["mh2","mh5","mh7","mh8"], "The problem was not the facts alone; it was how readers met the story."),
        Q("Inference", "What can you infer about the adviser?", [
          "She prefers students to solve problems by thinking through them",
          "She was angry but tried to hide it",
          "She does not care about the newspaper",
          "She forgot to read the first issue"
        ], 0, "Instead of blaming someone, she asks a question that helps the staff learn from the mistake.", ["mh6","mh7"], "Her response shows a teaching style, not just a correction."),
        Q("Vocabulary in Context", "In the sentence about pages feeling \"official,\" the word \"official\" most nearly means —", [
          "secret",
          "careless",
          "real and professionally made",
          "boring"
        ], 2, "The newspaper felt official because it looked polished and real, like a published paper.", ["mh1","mh2"], "The careful photos and columns are the context clue.")
      ]
    },
    {
      title: "Lunch Table Map",
      tag: "Fiction",
      level: "Grade 5-6",
      hook: "A new student finds a clever way to join a conversation.",
      paragraphs: [
        [
          S("lt1", "On his first day at Willow Creek, Ben carried his lunch tray like it was a package that might break if tilted the wrong way."),
          S("lt2", "The cafeteria sounded like a hundred radios playing at once.")
        ],
        [
          S("lt3", "He spotted one empty seat at a table covered with sketches of buses, train lines, and street names."),
          S("lt4", "Before sitting down, Ben said quietly, \"Your map is missing the shortcut by Pine Street.\""),
          S("lt5", "Three heads popped up at once.")
        ],
        [
          S("lt6", "By the end of lunch, one student had handed Ben a marker, another had asked where he used to live, and a third had renamed the drawing \"The World's Most Useful Lunch Table.\""),
          S("lt7", "When the bell rang, Ben did not hurry out this time.")
        ]
      ],
      questions: [
        Q("Inference", "What can you infer about Ben at the start of the passage?", [
          "He feels nervous in the new cafeteria",
          "He wants to become a teacher",
          "He is angry about lunch",
          "He has already made several friends"
        ], 0, "The careful way he carries the tray and the noisy cafeteria suggest he feels unsure at first.", ["lt1","lt2"], "These details show his discomfort without stating it directly."),
        Q("Text Evidence", "Which detail best shows the moment things begin to change for Ben?", [
          "The cafeteria sounded loud",
          "He saw an empty seat",
          "Three heads popped up at once",
          "The bell rang"
        ], 2, "That moment shows the table suddenly notices him and opens a path into the conversation.", ["lt4","lt5"], "His comment leads directly to the group's reaction."),
        Q("Main Idea", "What is a central idea of this passage?", [
          "Maps are better than conversations",
          "Shared interests can help people connect quickly",
          "School cafeterias should be quieter",
          "Students should always sit alone on the first day"
        ], 1, "Ben connects with the table because he notices and joins something they already care about.", ["lt3","lt4","lt6"], "The drawings on the table become the bridge into friendship."),
        Q("Author's Purpose", "Why does the author end by saying Ben \"did not hurry out this time\"?", [
          "To show he is now late for class",
          "To show that he feels more comfortable than before",
          "To suggest he dislikes the food",
          "To prove he forgot where to go next"
        ], 1, "The ending contrasts with his nervous start and shows that lunch became easier for him.", ["lt1","lt7"], "Comparing the first and last moments shows how Ben changed.")
      ]
    },
    {
      title: "Wind After the Fire",
      tag: "Informational",
      level: "Grade 6-7",
      hook: "A forest's recovery does not begin the way many people expect.",
      paragraphs: [
        [
          S("wf1", "After a wildfire, many hillsides look silent and empty."),
          S("wf2", "To people driving past, the blackened ground can seem like proof that nothing useful will grow there for years.")
        ],
        [
          S("wf3", "But some scientists visit burned forests precisely because the change begins so quickly."),
          S("wf4", "Certain pine cones open only after extreme heat."),
          S("wf5", "Ash can release nutrients into the soil, and the newly cleared ground lets sunlight reach seeds that had waited in darkness.")
        ],
        [
          S("wf6", "This does not mean fire is harmless."),
          S("wf7", "Severe fires can destroy homes, wildlife habitat, and topsoil."),
          S("wf8", "Still, researchers say recovery is not the same thing as returning to the exact forest that existed before.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the main idea of this passage?", [
          "Wildfires always improve forests",
          "Burned forests may begin changing and recovering sooner than people expect",
          "Scientists cause most forest fires",
          "Ash is the only reason plants grow"
        ], 1, "The passage explains that while fires are dangerous, recovery can begin quickly in some important ways.", ["wf2","wf3","wf4","wf5","wf8"], "These sentences move from first impression to a more complex explanation."),
        Q("Author's Purpose", "Why does the author include the sentence \"This does not mean fire is harmless\"?", [
          "To remind readers that the passage is not praising destruction",
          "To change the topic away from forests",
          "To prove scientists were wrong earlier",
          "To explain that wildfires never happen naturally"
        ], 0, "That sentence keeps the explanation balanced and prevents a mistaken oversimplification.", ["wf6","wf7"], "These lines add an important caution to the passage."),
        Q("Inference", "What can you infer about the people driving past the hillsides?", [
          "They probably notice only the immediate damage at first",
          "They understand forest science deeply",
          "They are starting new fires on purpose",
          "They are counting pine cones"
        ], 0, "The passage says the ground can seem empty, which suggests many people see only the first visible damage.", ["wf1","wf2","wf3"], "The author contrasts that first impression with what scientists know."),
        Q("Vocabulary in Context", "In the passage, the word \"precisely\" most nearly means —", [
          "almost",
          "exactly",
          "secretly",
          "suddenly"
        ], 1, "Scientists visit burned forests precisely because change begins quickly, meaning exactly for that reason.", ["wf3"], "The sentence gives the reason directly.")
      ]
    },
    {
      title: "The Borrowed Violin",
      tag: "Fiction",
      level: "Grade 6",
      hook: "A student learns that sounding better is not the same as playing bravely.",
      paragraphs: [
        [
          S("bv1", "Leah had practiced her solo so many times that her brother could hum it from memory."),
          S("bv2", "Still, when she stepped into the rehearsal room, her hands felt cold against the neck of her violin.")
        ],
        [
          S("bv3", "Halfway through tuning, a string on Leah's instrument snapped with a sound like a tiny whip."),
          S("bv4", "Before panic could settle in, Mr. Kwan opened the storage closet and handed her an older school violin."),
          S("bv5", "\"This one is scratchy,\" he warned, \"but it will sing if you stay steady.\"")
        ],
        [
          S("bv6", "The borrowed violin did sound rougher than her own, yet Leah kept her bow moving and finished the piece without stopping."),
          S("bv7", "When the last note faded, she was not proud because it sounded perfect."),
          S("bv8", "She was proud because she had stayed in the music long enough to reach the end.")
        ]
      ],
      questions: [
        Q("Inference", "What does Leah learn by the end of the passage?", [
          "Only expensive instruments are worth playing",
          "Finishing bravely can matter more than sounding perfect",
          "Practice is not useful before a performance",
          "Teachers should never lend instruments"
        ], 1, "Leah's pride comes from staying steady and finishing, not from producing a perfect sound.", ["bv5","bv6","bv7","bv8"], "These lines show what changed in the way she measures success."),
        Q("Text Evidence", "Which detail best supports the idea that Leah is nervous before playing?", [
          "Her brother can hum the solo",
          "She stepped into the rehearsal room",
          "Her hands felt cold against the violin",
          "Mr. Kwan opened the closet"
        ], 2, "Cold hands are a clear physical clue that she feels anxious.", ["bv2"], "This detail directly shows her nervousness."),
        Q("Author's Purpose", "Why does the author include Mr. Kwan's warning about the scratchy violin?", [
          "To show that the replacement instrument is completely unusable",
          "To hint at the challenge Leah will have to face calmly",
          "To prove the closet is old",
          "To show that tuning is more important than performance"
        ], 1, "His comment sets up the real challenge: Leah must stay steady even when conditions are not ideal.", ["bv4","bv5","bv6"], "The warning connects to how Leah later succeeds."),
        Q("Main Idea", "What is this passage mostly about?", [
          "Why students should own backup instruments",
          "How a performer grows by staying steady during an unexpected problem",
          "Why rehearsal rooms are stressful places",
          "How to replace a violin string"
        ], 1, "The snapped string creates the problem, and the heart of the passage is how Leah responds to it.", ["bv3","bv5","bv6","bv8"], "These parts show the challenge and the lesson.")
      ]
    },
    {
      title: "Night Shift at the Aquarium",
      tag: "Informational",
      level: "Grade 6-7",
      hook: "The aquarium looks very different once visitors go home.",
      paragraphs: [
        [
          S("na1", "When the aquarium closes at 6:00, the public areas grow quiet within minutes."),
          S("na2", "But behind the glass and swinging doors, the building becomes busier in a different way.")
        ],
        [
          S("na3", "Divers scrub algae from large tanks, keepers measure water chemistry, and veterinarians watch animals that need extra care."),
          S("na4", "Some fish are fed after dark because they hunt at night in the wild and stay calmer when the lights are low.")
        ],
        [
          S("na5", "Visitors often imagine an aquarium as a place where people simply admire colorful animals."),
          S("na6", "Employees know it is also a place of careful maintenance, constant testing, and patient observation."),
          S("na7", "By morning, most guests never notice how much work happened while they were asleep.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the main idea of this passage?", [
          "Aquariums should stay open later for the public",
          "Much of an aquarium's most important work happens after visitors leave",
          "Veterinarians do all the work in aquariums",
          "Fish prefer complete darkness at all times"
        ], 1, "The passage contrasts what visitors see with the large amount of behind-the-scenes work done at night.", ["na1","na2","na3","na6","na7"], "These lines frame the hidden nighttime work."),
        Q("Author's Purpose", "Why does the author describe fish being fed after dark?", [
          "To give one concrete example of why night work matters",
          "To suggest daytime workers are less skilled",
          "To prove every fish is dangerous",
          "To compare aquariums to forests"
        ], 0, "That detail is an example that makes the broader point more real and specific.", ["na3","na4"], "The author moves from a general list to a vivid example."),
        Q("Inference", "What can you infer about most aquarium visitors?", [
          "They see only a small part of the work needed to care for the animals",
          "They often stay overnight in the building",
          "They already understand water chemistry",
          "They help scrub tanks after closing"
        ], 0, "The passage says guests admire the animals but usually do not notice the hidden maintenance work.", ["na5","na6","na7"], "These lines compare public impressions with employee knowledge."),
        Q("Vocabulary in Context", "In the phrase \"patient observation,\" the word \"patient\" most nearly means —", [
          "sick and waiting for care",
          "calm and willing to take time",
          "easily distracted",
          "excited and noisy"
        ], 1, "Here, patient describes how employees watch carefully over time rather than rushing.", ["na6"], "The context is careful maintenance and testing, not illness.")
      ]
    },
    {
      title: "The Lemon Pencil",
      tag: "Fiction",
      level: "Grade 5-6",
      hook: "A tiny classroom object becomes harder to throw away than expected.",
      paragraphs: [
        [
          S("lp1", "On the last Friday of September, Mrs. Park placed a short yellow pencil on Eli's desk."),
          S("lp2", "It was the kind of pencil most students would have dropped into the class scrap cup without thinking twice.")
        ],
        [
          S("lp3", "\"Use this one for your first draft,\" she said, tapping the eraser."),
          S("lp4", "\"The point is not to look perfect. The point is to keep going.\""),
          S("lp5", "Eli turned the pencil in his fingers and noticed a tiny lemon stamped near the silver band.")
        ],
        [
          S("lp6", "That afternoon, he filled an entire page before stopping to erase even once."),
          S("lp7", "When the bell rang, he slipped the pencil into his backpack instead of leaving it behind with the others."),
          S("lp8", "For the first time all month, the empty page did not seem to be staring back at him.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mostly about?", [
          "Why schools should buy shorter pencils",
          "How a simple object helps a student feel less afraid to begin writing",
          "Why Eli dislikes using erasers",
          "How Mrs. Park decorates classroom supplies"
        ], 1, "The passage centers on how the little pencil changes Eli's attitude toward drafting and making mistakes.", ["lp3","lp4","lp6","lp8"], "These lines connect the pencil to Eli's new confidence."),
        Q("Inference", "Why does Eli keep the pencil in his backpack?", [
          "He wants to sharpen it at home for a test",
          "He now connects it with feeling braver about writing",
          "He plans to give it back to Mrs. Park later",
          "He thinks it is the only pencil left in school"
        ], 1, "Eli keeps the pencil because it now means something to him beyond being a school supply.", ["lp4","lp7","lp8"], "The teacher's advice and Eli's final feeling explain why the pencil matters."),
        Q("Author's Purpose", "Why does the author include Mrs. Park's words about the first draft?", [
          "To explain the lesson Eli needs to hear",
          "To show that Mrs. Park talks too much",
          "To prove the pencil is expensive",
          "To compare two writing teachers"
        ], 0, "Her words explain the big idea behind the scene: drafts are for moving forward, not for looking perfect.", ["lp3","lp4"], "These lines give the message that shapes Eli's change."),
        Q("Vocabulary in Context", "In the phrase \"without thinking twice,\" the words \"thinking twice\" most nearly mean —", [
          "counting carefully",
          "hesitating or reconsidering",
          "solving a difficult problem",
          "writing two drafts"
        ], 1, "Students would toss the pencil without thinking twice, meaning without stopping to reconsider it.", ["lp2"], "The context shows it is usually seen as unimportant.")
      ]
    },
    {
      title: "Rain on the Bleachers",
      tag: "Fiction",
      level: "Grade 6",
      hook: "A canceled game reveals something one teammate had been hiding.",
      paragraphs: [
        [
          S("rb1", "The seventh-grade soccer team had already lined up for warmups when the rain began."),
          S("rb2", "Within minutes, the white field lines turned blurry and the referee folded his notebook shut.")
        ],
        [
          S("rb3", "Most players groaned and kicked at puddles, but Talia climbed onto the first row of bleachers and sat very still."),
          S("rb4", "Miguel sat beside her long enough to notice that she was not watching the storm at all."),
          S("rb5", "She was staring at her hands, opening and closing them like she expected them to forget how to work.")
        ],
        [
          S("rb6", "\"I was glad it got canceled,\" Talia admitted at last."),
          S("rb7", "\"My knee has been hurting since Tuesday, and I didn't want Coach to think I was making excuses.\""),
          S("rb8", "Miguel looked at the muddy field, then back at her."),
          S("rb9", "\"Telling the truth isn't an excuse,\" he said.")
        ]
      ],
      questions: [
        Q("Inference", "What can you infer about Talia before she speaks?", [
          "She is secretly happy because she hates soccer",
          "She is worried about more than just the rain",
          "She wants to sit alone because she is angry at Miguel",
          "She thinks the referee made the wrong call"
        ], 1, "Her stillness and the way she watches her hands suggest she is carrying another worry.", ["rb3","rb4","rb5"], "These details hint at nervousness before she explains it."),
        Q("Text Evidence", "Which detail best shows that Miguel is paying close attention to Talia?", [
          "He notices the white field lines",
          "He sits beside her and watches what she is doing",
          "He looks at the muddy field",
          "He hears the referee close a notebook"
        ], 1, "Miguel notices something specific about her hands and mood, which shows real attention.", ["rb4","rb5"], "This is the strongest evidence of his observation."),
        Q("Main Idea", "What is a central idea of this passage?", [
          "Rainstorms ruin every sports season",
          "Honesty about a problem can take courage",
          "Teammates should always agree with each other",
          "Coaches care only about winning games"
        ], 1, "The passage is really about Talia admitting the truth about her injury and fear.", ["rb6","rb7","rb9"], "These lines show the conflict and the response to it."),
        Q("Author's Purpose", "Why does the author end with Miguel's last line?", [
          "To show that the conversation helped Talia feel understood",
          "To prove Miguel knows more about injuries than coaches do",
          "To suggest the game will start again",
          "To explain why the field became muddy"
        ], 0, "Miguel's line reframes Talia's fear and gives the scene its emotional landing point.", ["rb7","rb9"], "His response directly answers what Talia was worried about.")
      ]
    },
    {
      title: "The Jar of Buttons",
      tag: "Fiction",
      level: "Grade 5-6",
      hook: "A rainy-day chore turns into a story no one expected.",
      paragraphs: [
        [
          S("jb1", "While cleaning the hall closet, Ava found a glass jar packed with buttons of every size and color."),
          S("jb2", "Some were glossy black, some were pearl white, and one near the bottom looked like a tiny moon with four holes in its middle.")
        ],
        [
          S("jb3", "Her grandmother smiled when she saw the jar on the kitchen table."),
          S("jb4", "\"That was my mother's sewing jar,\" she said."),
          S("jb5", "\"Whenever a shirt wore out, she saved the strongest buttons before turning the cloth into rags.\"")
        ],
        [
          S("jb6", "Ava ran her finger through the cool pile and tried to imagine a person who saw a future use in almost everything."),
          S("jb7", "By evening, she had sewn three of the buttons onto an old denim pouch instead of buying a new pencil case online."),
          S("jb8", "The pouch was not fancy, but it felt like part of a conversation that had started long before she was born.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mainly about?", [
          "Why closets should be cleaned every month",
          "How an old jar helps Ava connect to a family habit of reusing things",
          "Why denim is stronger than other fabrics",
          "How to sew a new pencil case from scratch"
        ], 1, "The story focuses on Ava discovering the jar and then using it to connect with an older family way of thinking.", ["jb3","jb5","jb6","jb8"], "These details connect the object to family memory and Ava's choice."),
        Q("Inference", "What can you infer about Ava's grandmother's mother?", [
          "She disliked making clothes",
          "She believed useful things should not be wasted",
          "She collected buttons only because they were pretty",
          "She sold buttons at the market"
        ], 1, "Saving strong buttons from worn-out clothes suggests she valued reuse and practicality.", ["jb4","jb5"], "The explanation about worn-out shirts gives the clue."),
        Q("Author's Purpose", "Why does the author describe one button as looking like \"a tiny moon\"?", [
          "To show Ava notices the jar with imagination and care",
          "To prove the button glows in the dark",
          "To explain the phases of the moon",
          "To suggest the jar belongs outside"
        ], 0, "That description helps the reader see the buttons through Ava's imaginative attention.", ["jb2"], "The comparison makes the jar feel vivid and special."),
        Q("Vocabulary in Context", "In the sentence about a conversation that had started long before Ava was born, the word \"conversation\" most nearly refers to —", [
          "a loud argument in the kitchen",
          "a family idea being passed forward through actions",
          "an online chat about school supplies",
          "instructions printed on the pouch"
        ], 1, "The pouch feels like part of a long conversation because Ava is continuing a family habit or value.", ["jb5","jb7","jb8"], "The older habit and Ava's new choice connect the meaning.")
      ]
    },
    {
      title: "Paper Rockets",
      tag: "Fiction",
      level: "Grade 5-6",
      hook: "A classroom contest becomes more interesting once winning stops being the point.",
      paragraphs: [
        [
          S("pr1", "Mr. Lobo announced the paper rocket challenge right after lunch, when everyone's energy was beginning to slide."),
          S("pr2", "\"One sheet of paper,\" he said, holding it up like a flag. \"Farthest flight wins.\"")
        ],
        [
          S("pr3", "Jaden folded his first rocket quickly and launched it with a snap of his wrist."),
          S("pr4", "It shot forward, dipped sharply, and landed nose-first in the recycling bin."),
          S("pr5", "At the next table, Priya had not thrown anything yet."),
          S("pr6", "She kept adjusting the wings by tiny amounts, then testing how the paper balanced on one finger.")
        ],
        [
          S("pr7", "By the end of class, Priya's rocket did not win the contest."),
          S("pr8", "But when Mr. Lobo asked which design taught them the most about flight, every group pointed to hers."),
          S("pr9", "Jaden was the first to ask if he could borrow her idea and try again tomorrow.")
        ]
      ],
      questions: [
        Q("Inference", "What can you infer about Priya?", [
          "She is more interested in understanding than rushing",
          "She forgot the rules of the contest",
          "She refuses to compete with classmates",
          "She has made paper rockets for years"
        ], 0, "Priya keeps testing and adjusting instead of throwing right away, which suggests patience and curiosity.", ["pr5","pr6"], "Her actions show how she approaches the challenge."),
        Q("Main Idea", "What is the central idea of the passage?", [
          "Fast starts always lead to wins",
          "Careful experimenting can matter more than immediate victory",
          "Paper is too weak for science class",
          "Students should avoid classroom contests"
        ], 1, "The class learns from Priya's design even though it does not win, showing the value of thoughtful testing.", ["pr6","pr7","pr8"], "These parts move the story beyond just who won."),
        Q("Author's Purpose", "Why does the author include Jaden asking to borrow Priya's idea?", [
          "To show he has learned to respect her approach",
          "To prove he never liked contests",
          "To suggest Mr. Lobo will cancel the activity",
          "To explain that Jaden's rocket was broken"
        ], 0, "That final detail shows Jaden changing from quick confidence to real interest in Priya's method.", ["pr3","pr9"], "The ending contrasts with how he began."),
        Q("Vocabulary in Context", "In the sentence about energy beginning to \"slide,\" the word \"slide\" most nearly means —", [
          "move down or fade",
          "rush upward",
          "bounce loudly",
          "freeze in place"
        ], 0, "The class energy is fading after lunch, not literally moving across the floor.", ["pr1"], "The context is about alertness dropping.")
      ]
    },
    {
      title: "Saturday Shoes",
      tag: "Fiction",
      level: "Grade 6",
      hook: "A pair of shoes says more than one friend means it to.",
      paragraphs: [
        [
          S("ss1", "Mara had planned her Saturday outfit around the new blue sneakers in the shoe box by her bed."),
          S("ss2", "She wore them to the community center before breakfast, half hoping someone would notice and half pretending she did not care.")
        ],
        [
          S("ss3", "During cleanup, her friend Imani glanced down and said, \"Wow. Those are definitely not thrift-store shoes.\""),
          S("ss4", "The words were light, but Mara heard the scrape underneath them."),
          S("ss5", "For the rest of the morning, her feet felt heavier than the shoes themselves.")
        ],
        [
          S("ss6", "Later, while stacking folded tablecloths, Imani blurted out, \"I wasn't trying to be rude.\""),
          S("ss7", "\"I just liked them and wished I had said that instead.\""),
          S("ss8", "Mara looked down at the bright blue toes and finally laughed."),
          S("ss9", "\"Next time,\" she said, nudging Imani's shoulder, \"start with that part.\"")
        ]
      ],
      questions: [
        Q("Inference", "What does the phrase \"the scrape underneath them\" suggest about Imani's comment?", [
          "It sounded partly sharp or jealous beneath the joke",
          "It was too quiet for Mara to hear",
          "It was actually praise with no mixed feeling",
          "It was a comment about cleaning the floor"
        ], 0, "The phrase suggests Mara hears a rough edge under the words, not just the words themselves.", ["ss3","ss4"], "The author uses this image to show tone and feeling."),
        Q("Main Idea", "What is a central idea of this passage?", [
          "Good friends never say awkward things",
          "Honest repair can matter after a hurtful moment",
          "New shoes always cause problems",
          "Community centers should have stricter rules"
        ], 1, "The passage moves from a small hurt to an apology that repairs the friendship.", ["ss5","ss6","ss7","ss9"], "These lines show the conflict and how it gets fixed."),
        Q("Author's Purpose", "Why does the author include Mara's final laugh?", [
          "To show the tension between the friends begins to ease",
          "To prove she no longer likes the shoes",
          "To suggest she is laughing at someone else",
          "To show she did not hear Imani"
        ], 0, "The laugh signals a release after the apology and makes the ending warmer.", ["ss6","ss7","ss8","ss9"], "It helps land the scene emotionally."),
        Q("Vocabulary in Context", "In the sentence \"The words were light,\" the word \"light\" most nearly means —", [
          "glowing brightly",
          "said in a casual or joking way",
          "too quiet to hear",
          "written on paper"
        ], 1, "The comment sounds casual on the surface, even though Mara hears something else underneath.", ["ss3","ss4"], "The context contrasts the surface tone with the hidden edge.")
      ]
    },
    {
      title: "The Last Library Card",
      tag: "Fiction",
      level: "Grade 6-7",
      hook: "A student thinks she is rescuing a card, but the rescue goes both ways.",
      paragraphs: [
        [
          S("lc1", "When the town library announced it was switching to digital accounts, Mrs. Alvarez placed a small basket by the checkout desk for old cards."),
          S("lc2", "Most people dropped theirs in without looking twice.")
        ],
        [
          S("lc3", "Sofia almost did the same, then noticed that her card's corners were soft from years of being tucked into backpack pockets."),
          S("lc4", "Her name, written in wobbly third-grade print, stretched across the back."),
          S("lc5", "For a second she could almost feel the weight of the first chapter book she had ever checked out on her own.")
        ],
        [
          S("lc6", "Mrs. Alvarez noticed Sofia hesitating and opened a drawer."),
          S("lc7", "\"I keep a few of these for bookmarks,\" she said."),
          S("lc8", "\"A card can stop being useful in one way and still matter in another.\""),
          S("lc9", "Sofia slid her old card into the book she was borrowing and decided that was exactly right.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mainly about?", [
          "Why digital accounts are confusing",
          "How an old library card becomes a symbol of memory and continued value",
          "Why Sofia writes her name neatly now",
          "How libraries store bookmarks"
        ], 1, "The passage focuses on Sofia realizing the old card still matters because of what it represents.", ["lc3","lc5","lc8","lc9"], "These lines connect the object to memory and new use."),
        Q("Inference", "Why does Sofia hesitate before dropping the card in the basket?", [
          "She suddenly remembers what the card has meant to her",
          "She does not trust the librarian",
          "She forgot how digital accounts work",
          "She wants to keep using the old account number"
        ], 0, "The worn corners and old handwriting trigger memories that make the card feel important.", ["lc3","lc4","lc5"], "These details explain her pause."),
        Q("Author's Purpose", "Why does the author include Mrs. Alvarez's line about usefulness?", [
          "To state the larger idea of the story clearly",
          "To advertise the library's new system",
          "To prove bookmarks are expensive",
          "To compare Sofia to other students"
        ], 0, "That line expresses the passage's theme: something can change purpose and still hold value.", ["lc7","lc8","lc9"], "The line explains Sofia's final choice."),
        Q("Vocabulary in Context", "In the sentence about the card's corners being \"soft,\" the word \"soft\" most nearly suggests —", [
          "made of cloth",
          "worn smooth from long use",
          "easily broken in half",
          "still wet from rain"
        ], 1, "The corners are soft because the card has been handled and carried for years.", ["lc3"], "The backpack-pocket detail gives the clue.")
      ]
    },
    {
      title: "Snow Day Music",
      tag: "Fiction",
      level: "Grade 5-6",
      hook: "Two sisters hear the same storm in very different ways.",
      paragraphs: [
        [
          S("sm1", "By seven in the morning, the snow had covered the cars, the sidewalk, and the basketball hoop at the end of the block."),
          S("sm2", "Mina pressed her forehead to the window and waited for the school-cancelation message like it was a package she had ordered herself.")
        ],
        [
          S("sm3", "Her older sister June was already at the table with sheet music spread in three uneven stacks."),
          S("sm4", "\"If school is canceled, rehearsal is canceled too,\" Mina said hopefully."),
          S("sm5", "June smiled without looking up."),
          S("sm6", "\"Or it becomes practice time,\" she answered.")
        ],
        [
          S("sm7", "An hour later, the cancellation came, followed almost immediately by the thin bright sound of June's violin drifting down the hallway."),
          S("sm8", "Mina meant to be annoyed."),
          S("sm9", "Instead, she sat outside the bedroom door and listened until the storm and the music seemed to be keeping time for each other.")
        ]
      ],
      questions: [
        Q("Inference", "How does Mina's feeling change by the end of the passage?", [
          "She grows from impatient excitement into quiet appreciation",
          "She becomes angrier with June than before",
          "She decides to leave the house immediately",
          "She forgets the storm completely"
        ], 0, "Mina begins focused on the cancellation, but ends up listening closely and appreciating the music.", ["sm2","sm8","sm9"], "The beginning and ending create the change."),
        Q("Author's Purpose", "Why does the author include June's line about practice time?", [
          "To show how differently the sisters view the same snow day",
          "To prove June dislikes school",
          "To explain how violins are tuned",
          "To suggest Mina should join the orchestra"
        ], 0, "June's line highlights the contrast between Mina's hope for free time and June's disciplined view.", ["sm4","sm6"], "These lines set up the sisters' difference."),
        Q("Main Idea", "What is a central idea of the passage?", [
          "Snow days always ruin musicians' plans",
          "The same event can mean something different to different people",
          "Practice is more important than rest in every situation",
          "You should never listen outside a bedroom door"
        ], 1, "The snow day means play to Mina at first and practice to June, and the ending brings those views closer together.", ["sm2","sm6","sm9"], "These details show two meanings for the same day."),
        Q("Vocabulary in Context", "In the phrase \"drifting down the hallway,\" the word \"drifting\" most nearly means —", [
          "breaking suddenly",
          "moving lightly and slowly",
          "getting louder by force",
          "stopping without warning"
        ], 1, "The violin sound drifts because it moves gently through the house.", ["sm7"], "The image is soft and gradual, not sharp.")
      ]
    },
    {
      title: "Fence Shortcut",
      tag: "Fiction",
      level: "Grade 6",
      hook: "A shortcut looks harmless until someone else starts following it.",
      paragraphs: [
        [
          S("fs1", "Every day after school, Devin squeezed through the loose board behind the tennis courts instead of walking the long way around the fence."),
          S("fs2", "The shortcut saved less than a minute, but he liked the feeling of knowing something most people ignored.")
        ],
        [
          S("fs3", "One Thursday, he heard a crack behind him and turned to see Mateo from sixth grade trying the same gap."),
          S("fs4", "Mateo's backpack snagged, and for a moment he tipped sideways with both feet off balance."),
          S("fs5", "Devin grabbed the strap in time, but the thud of the board against the fence sounded much louder than it should have.")
        ],
        [
          S("fs6", "The next afternoon, Devin walked the long route past the front gate."),
          S("fs7", "When Mateo spotted him and laughed, Devin only shrugged."),
          S("fs8", "\"Some shortcuts stop feeling smart once you see them through someone else's shoes,\" he said.")
        ]
      ],
      questions: [
        Q("Inference", "Why does Devin stop using the shortcut?", [
          "He is told by a teacher that the gate is locked",
          "Seeing Mateo almost fall changes how he thinks about the risk",
          "He wants more exercise after school",
          "The shortcut no longer saves any time"
        ], 1, "Devin changes after watching Mateo nearly get hurt doing the same thing.", ["fs3","fs4","fs5","fs6"], "Those events explain the shift in his thinking."),
        Q("Main Idea", "What is the central idea of this passage?", [
          "Fences are always badly designed",
          "A risky choice can look different once it affects someone else",
          "Students should never walk home alone",
          "Time-saving tricks are always worth it"
        ], 1, "The passage is about Devin rethinking the shortcut when he sees its danger more clearly.", ["fs2","fs5","fs8"], "The beginning attitude and ending insight create the theme."),
        Q("Author's Purpose", "Why does the author include the line about the board sounding louder than it should have?", [
          "To show how sharply the moment hits Devin",
          "To prove the fence is made of metal",
          "To suggest Mateo is shouting",
          "To explain why tennis practice ended early"
        ], 0, "That sound detail makes the danger feel bigger and more real to Devin in that moment.", ["fs4","fs5"], "The author uses sound to underline the seriousness."),
        Q("Vocabulary in Context", "In the sentence about seeing things through someone else's shoes, the word \"shoes\" most nearly stands for —", [
          "fashion choices",
          "another person's point of view",
          "the length of the walk home",
          "sports equipment"
        ], 1, "The phrase means understanding the situation from another person's perspective.", ["fs8"], "It is a figurative way of talking about empathy.")
      ]
    },
    {
      title: "The Lantern Walk",
      tag: "Fiction",
      level: "Grade 6-7",
      hook: "A quiet town tradition matters more to one student than anyone realizes.",
      paragraphs: [
        [
          S("lw1", "Each winter, the families on Maple Street hung paper lanterns outside their doors on the longest night of the year."),
          S("lw2", "By seven o'clock, the sidewalks usually glowed with soft reds, golds, and pale white circles of light.")
        ],
        [
          S("lw3", "This year, Ren kept checking the window because the house at the far corner stayed dark."),
          S("lw4", "Mr. Sato had lived there alone since the summer, and he always waved to Ren on the walk to school but never came to block parties."),
          S("lw5", "At last, Ren carried an extra lantern down the sidewalk, trying to look like someone who had an errand and not a nerve problem.")
        ],
        [
          S("lw6", "When Mr. Sato opened the door, he stared at the lantern for a moment and then laughed softly."),
          S("lw7", "\"I used to make these with my daughter,\" he said."),
          S("lw8", "\"I thought I had missed my chance this year.\""),
          S("lw9", "An hour later, the corner house was glowing too, and Ren felt warmer walking home than walking there.")
        ]
      ],
      questions: [
        Q("Inference", "What can you infer about why Ren brings the lantern?", [
          "Ren wants to show off the best design on the block",
          "Ren suspects Mr. Sato might feel left out and wants to include him",
          "Ren has been sent by every family on the street",
          "Ren is trying to sell paper lanterns"
        ], 1, "Ren notices the dark house and chooses to bring an extra lantern, suggesting a wish to include Mr. Sato.", ["lw3","lw4","lw5"], "These clues show both concern and nervousness."),
        Q("Author's Purpose", "Why does the author include Mr. Sato's memory about his daughter?", [
          "To explain why the lantern matters emotionally to him",
          "To prove he invented the tradition",
          "To suggest he is moving away soon",
          "To compare Maple Street with another town"
        ], 0, "His memory reveals why the gesture affects him so strongly.", ["lw6","lw7","lw8"], "These lines deepen the meaning of the moment."),
        Q("Main Idea", "What is a central idea of this passage?", [
          "Neighborhood traditions are expensive to keep",
          "A small act of welcome can carry deep meaning",
          "People should always attend block parties",
          "Winter nights are better than summer nights"
        ], 1, "The story shows how one thoughtful action brings warmth and belonging to someone else.", ["lw5","lw8","lw9"], "These details show the gesture and its effect."),
        Q("Vocabulary in Context", "In the phrase \"a nerve problem,\" the word \"nerve\" most nearly refers to —", [
          "a medical illness",
          "the courage to do something awkward or difficult",
          "a loud feeling of anger",
          "an interest in science"
        ], 1, "Ren is nervous, and the phrase means trying to gather courage.", ["lw5"], "The context is social bravery, not health.")
      ]
    },
    {
      title: "The Broken Crayon Box",
      tag: "Fiction",
      level: "Grade 5-6",
      hook: "A messy art supply becomes the center of a quieter kind of kindness.",
      paragraphs: [
        [
          S("bc1", "During indoor recess, Ms. Han set out puzzles, markers, and an old crayon box held shut with a rubber band."),
          S("bc2", "When Isaac opened it, nearly half the crayons were snapped in two.")
        ],
        [
          S("bc3", "\"Those are the sad crayons,\" Mila joked, reaching for the unbroken markers instead."),
          S("bc4", "Isaac almost followed her, but then he noticed how many colors were still bright at the tips."),
          S("bc5", "He peeled away the paper wrappers, sorted the pieces by shade, and lined them up from pale peach to deep violet.")
        ],
        [
          S("bc6", "Soon two younger students wandered over and asked if they could use the tiny colors for a mosaic drawing."),
          S("bc7", "By the time recess ended, the broken crayons had become a sunset made of careful little squares."),
          S("bc8", "Isaac closed the box gently this time, as if it had turned into something worth protecting.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mostly about?", [
          "Why markers are easier to use than crayons",
          "How attention and care can turn something overlooked into something valuable",
          "Why indoor recess should include only puzzles",
          "How to organize a classroom cabinet"
        ], 1, "The passage focuses on Isaac seeing value in something others ignored and helping transform it.", ["bc3","bc4","bc7","bc8"], "These lines show the shift from junk to something meaningful."),
        Q("Inference", "What can you infer about Isaac?", [
          "He likes finding possibilities in things other people dismiss",
          "He only helps when the teacher tells him to",
          "He is angry that the crayons are old",
          "He prefers mosaics to all other art"
        ], 0, "Isaac notices what is still usable and works carefully with it instead of rejecting it.", ["bc4","bc5"], "His choices suggest patience and imagination."),
        Q("Author's Purpose", "Why does the author include Mila's joke about the \"sad crayons\"?", [
          "To show how easily the crayons could have been ignored",
          "To prove Mila is the best artist in class",
          "To explain where the box came from",
          "To show that Isaac is offended by jokes"
        ], 0, "The joke sets up the contrast between how others see the crayons and how Isaac chooses to see them.", ["bc3","bc4"], "It helps frame Isaac's different response."),
        Q("Vocabulary in Context", "In the sentence about the crayons becoming \"something worth protecting,\" the word \"protecting\" most nearly means —", [
          "hiding forever",
          "treating with care so it is not lost or damaged",
          "returning to the store",
          "using up quickly"
        ], 1, "Isaac closes the box gently because he now sees it as worth caring for.", ["bc8"], "The context points to careful treatment, not hiding.")
      ]
    },
    {
      title: "Fourth Floor Window",
      tag: "Fiction",
      level: "Grade 6",
      hook: "A student begins noticing the city in a new way after one small assignment.",
      paragraphs: [
        [
          S("ff1", "For art homework, Ms. Rivera told everyone to sketch a view from a window."),
          S("ff2", "Jonah groaned because the only window in his apartment bedroom looked toward the alley behind the building.")
        ],
        [
          S("ff3", "At first he saw nothing worth drawing besides a dented dumpster and a crooked fire escape."),
          S("ff4", "Then he noticed the line of shirts fluttering from the laundry pole across the way and the cat that traveled the fence every evening at almost the exact same time."),
          S("ff5", "A rectangle of yellow light appeared in the bakery basement just before sunrise, long before the shop opened downstairs.")
        ],
        [
          S("ff6", "By the time Jonah finished sketching, the alley no longer looked empty."),
          S("ff7", "It looked busy with routines he had never bothered to learn before."),
          S("ff8", "The next morning he taped the drawing beside his bed, as if he had discovered a place that had been waiting there all along.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the passage mainly about?", [
          "Why apartment alleys are noisy places",
          "How paying closer attention changes the way Jonah sees an ordinary place",
          "Why drawing homework is too difficult",
          "How bakeries prepare bread each morning"
        ], 1, "The story is about Jonah moving from dismissal to careful noticing.", ["ff2","ff3","ff4","ff7"], "These lines show how his view changes."),
        Q("Inference", "What does Jonah learn through the assignment?", [
          "A place can hold more life and detail than it first seems to",
          "He should ask to switch bedrooms immediately",
          "Cats make the best subjects for all art",
          "Homework is more important than sleep"
        ], 0, "The alley seems plain at first, but attention reveals patterns and life in it.", ["ff3","ff4","ff5","ff7"], "Those details support the broader lesson."),
        Q("Author's Purpose", "Why does the author include the shirts, cat, and bakery light?", [
          "To show the specific details that change Jonah's opinion",
          "To suggest Jonah should become a baker",
          "To compare city life to country life",
          "To prove the alley is dangerous"
        ], 0, "These details are the evidence that the alley is richer and more interesting than Jonah first thought.", ["ff4","ff5"], "The author uses them to make the change concrete."),
        Q("Vocabulary in Context", "In the sentence about a place that had been \"waiting there all along,\" the phrase most nearly suggests that the alley —", [
          "was newly built overnight",
          "had always had value, even before Jonah noticed it",
          "wanted someone to move away from it",
          "was closed off from the city"
        ], 1, "The alley did not change physically; Jonah's way of seeing it changed.", ["ff6","ff7","ff8"], "The ending makes that idea clear.")
      ]
    },
    {
      title: "The Extra Ticket",
      tag: "Fiction",
      level: "Grade 6-7",
      hook: "One unused seat turns into a harder decision than it first appears.",
      paragraphs: [
        [
          S("et1", "On the morning of the band concert, Kayla found an extra ticket tucked under the permission slips in her folder."),
          S("et2", "Her mother had already planned to come, and her brother had already promised he would not.")
        ],
        [
          S("et3", "At lunch, Kayla thought about offering the ticket to her best friend, but then she noticed Nia pretending not to care when everyone else talked about family members attending."),
          S("et4", "Nia's father drove long delivery routes and was rarely home before midnight."),
          S("et5", "When Kayla slid the ticket across the table, Nia blinked twice before saying anything at all.")
        ],
        [
          S("et6", "That evening, Nia sat beside Kayla's mother in the second row and clapped hardest after the trumpet solo."),
          S("et7", "Walking out afterward, Kayla realized the extra ticket had not simply filled a seat."),
          S("et8", "It had changed who the night belonged to.")
        ]
      ],
      questions: [
        Q("Inference", "Why does Nia blink twice before speaking?", [
          "She is trying to remember where the concert is",
          "She is surprised and moved by Kayla's offer",
          "She cannot hear what Kayla said",
          "She does not want to go to the concert"
        ], 1, "Her reaction suggests the offer matters to her more than she expected or wanted to show.", ["et3","et4","et5"], "The context explains why the ticket feels important."),
        Q("Main Idea", "What is a central idea of this passage?", [
          "Concerts are more fun than sports events",
          "A small generous choice can quietly matter a great deal to someone else",
          "Tickets should always be given to best friends first",
          "Families should attend every school event"
        ], 1, "The passage shows that the extra ticket becomes meaningful because of who receives it.", ["et5","et6","et7","et8"], "These lines show the choice and its emotional result."),
        Q("Author's Purpose", "Why does the author include Nia's father driving late routes?", [
          "To explain why being invited to the concert matters to Nia",
          "To show that Kayla dislikes delivery trucks",
          "To prove Nia is a better student than Kayla",
          "To explain how tickets are printed"
        ], 0, "That detail gives the reader the missing background needed to understand Nia's silence and reaction.", ["et3","et4"], "It builds the emotional stakes of the offer."),
        Q("Vocabulary in Context", "In the sentence about changing \"who the night belonged to,\" the word \"belonged\" most nearly suggests —", [
          "was legally owned by",
          "felt especially meaningful for",
          "was reserved months in advance for",
          "was paid for by"
        ], 1, "The night belongs to Nia in the sense that it becomes deeply important to her.", ["et6","et7","et8"], "The context is emotional meaning, not ownership.")
      ]
    },
    {
      title: "The Quietest Chair",
      tag: "Fiction",
      level: "Grade 5-6",
      hook: "A student discovers that helping does not always begin with saying more.",
      paragraphs: [
        [
          S("qc1", "When the reading circles began, everyone reached for a chair close to a friend or close to the fan."),
          S("qc2", "Lena ended up in the last open seat, a wobbling chair in the back corner beside Theo.")
        ],
        [
          S("qc3", "Theo rarely spoke in class unless a teacher called on him directly."),
          S("qc4", "Whenever it was his turn to read aloud, he cleared his throat so many times that the first sentence almost disappeared."),
          S("qc5", "That day, Lena noticed he had copied three vocabulary words in tiny letters along the edge of his notebook.")
        ],
        [
          S("qc6", "Without making a show of it, Lena folded a sticky note and slid it over."),
          S("qc7", "On it she had written, \"Want me to read the first line with you?\""),
          S("qc8", "Theo looked at the note, then nodded once."),
          S("qc9", "By the end of the chapter, the chair still wobbled, but Theo's voice did not.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mostly about?", [
          "Why classroom furniture should be replaced",
          "How quiet support can help someone feel steadier",
          "Why sticky notes are useful for vocabulary",
          "How reading circles should be organized"
        ], 1, "The heart of the passage is Lena's gentle help and the effect it has on Theo.", ["qc5","qc6","qc7","qc9"], "These details show both the support and the result."),
        Q("Inference", "What can you infer about Lena?", [
          "She enjoys being the center of attention",
          "She notices what others need and helps without embarrassing them",
          "She does not like reading circles",
          "She wants Theo to owe her a favor"
        ], 1, "Lena helps quietly and thoughtfully after paying attention to Theo's struggle.", ["qc5","qc6","qc7"], "Her actions suggest sensitivity and care."),
        Q("Author's Purpose", "Why does the author include the final line about the chair and Theo's voice?", [
          "To compare what stayed shaky with what became steadier",
          "To show the chair broke apart",
          "To prove Lena fixed the furniture",
          "To explain why the class ended early"
        ], 0, "The contrast in the final line highlights Theo's change with a memorable image.", ["qc2","qc9"], "The wobbling chair becomes a symbol the author can use at the end."),
        Q("Vocabulary in Context", "In the sentence saying the first sentence almost \"disappeared,\" the word \"disappeared\" most nearly means —", [
          "was erased from the book",
          "became hard to hear clearly",
          "was translated into another language",
          "was replaced with a new one"
        ], 1, "Theo's throat-clearing makes the sentence fade or become hard to hear.", ["qc4"], "The context is about reading aloud, not printing.")
      ]
    },
    {
      title: "The Unfinished Kite",
      tag: "Fiction",
      level: "Grade 6",
      hook: "A half-made project begins to matter more after someone else leaves it behind.",
      paragraphs: [
        [
          S("uk1", "For three days, the unfinished kite had leaned against the art room wall beside the sink."),
          S("uk2", "Its tissue paper tail was missing, and one bamboo spar stuck out at an angle like a crooked finger.")
        ],
        [
          S("uk3", "Most students assumed the project belonged to someone absent or careless."),
          S("uk4", "Then Ms. Baird explained that Mateo had started it before moving away suddenly last week."),
          S("uk5", "\"He planned every color,\" she said, unfolding a small sketch from the supply drawer.")
        ],
        [
          S("uk6", "During cleanup, Hana asked if she could finish the kite using Mateo's plan."),
          S("uk7", "By Friday afternoon, it was hanging in the window, the blue and silver panels glowing every time the sun shifted."),
          S("uk8", "Hana knew the kite was not hers in the usual sense, but helping it reach the air still felt like part of saying goodbye.")
        ]
      ],
      questions: [
        Q("Inference", "Why does Hana decide to finish the kite?", [
          "She wants to win an art prize with it",
          "She wants to honor the thought Mateo had already put into it",
          "She needs extra credit before the weekend",
          "She thinks the room looks empty without decorations"
        ], 1, "After learning Mateo planned the design, Hana sees the kite as something worth completing respectfully.", ["uk4","uk5","uk6"], "Those details explain her motive."),
        Q("Main Idea", "What is a central idea of this passage?", [
          "Art rooms should label every unfinished project",
          "Completing someone else's work can become an act of care and remembrance",
          "Students should never move during the school year",
          "Kites are the best classroom decoration"
        ], 1, "The story is about Hana turning an abandoned-looking object into a way of honoring someone who left.", ["uk4","uk6","uk7","uk8"], "These lines show the emotional purpose of finishing the kite."),
        Q("Author's Purpose", "Why does the author include the sketch from the supply drawer?", [
          "To show that the kite was imagined carefully before it was left unfinished",
          "To prove Ms. Baird prefers blue and silver",
          "To explain how to build a kite step by step",
          "To suggest Mateo will return soon"
        ], 0, "The sketch proves the kite carried Mateo's intention, which changes how Hana and the reader see it.", ["uk4","uk5"], "It turns the project from random leftovers into a meaningful plan."),
        Q("Vocabulary in Context", "In the phrase \"not hers in the usual sense,\" the word \"usual\" most nearly means —", [
          "ordinary or expected",
          "borrowed from a museum",
          "damaged beyond repair",
          "painted very brightly"
        ], 0, "The kite is not hers in the ordinary way because she did not begin it, even though she helps finish it.", ["uk8"], "The context compares ownership with participation.")
      ]
    },
    {
      title: "The Hallway Echo",
      tag: "Fiction",
      level: "Grade 6-7",
      hook: "One repeated phrase sounds different once a student hears where it came from.",
      paragraphs: [
        [
          S("he1", "For a week, someone had been saying \"Nice job, genius\" whenever Noah answered a hard question in science."),
          S("he2", "The words were followed by a laugh just quiet enough to make the teacher miss it.")
        ],
        [
          S("he3", "Noah told himself not to care, but the sentence began following him into the hallway and onto the bus."),
          S("he4", "On Thursday, he turned the corner near the lockers and heard the phrase again before realizing it was being rehearsed, not aimed."),
          S("he5", "Drew was leaning against the wall, trying out different sarcastic voices for the comedy sketch he had to perform in drama club.")
        ],
        [
          S("he6", "When Drew looked up and saw Noah, his face changed so fast it was almost a second language."),
          S("he7", "\"I didn't mean it the way it sounded in class,\" he said."),
          S("he8", "Noah was not completely sure that was true, but after that day the hallway stopped echoing in quite the same way.")
        ]
      ],
      questions: [
        Q("Inference", "Why does the phrase affect Noah so strongly?", [
          "He knows it may be a joke, but it still feels pointed and repeated",
          "He is worried about failing drama club",
          "He cannot hear very well in science class",
          "He thinks the teacher gave the phrase as homework"
        ], 0, "The repeated line feels personal enough that Noah carries it around mentally even outside class.", ["he1","he2","he3"], "These details show why the words stick with him."),
        Q("Author's Purpose", "Why does the author include Drew rehearsing voices?", [
          "To complicate the situation and make Noah's understanding less simple",
          "To prove drama club causes trouble",
          "To show that science and drama are taught together",
          "To explain why the lockers are noisy"
        ], 0, "The rehearsal detail makes the moment less clear-cut and adds uncertainty.", ["he4","he5","he7","he8"], "It changes how Noah and the reader interpret the earlier phrase."),
        Q("Main Idea", "What is a central idea of this passage?", [
          "Sarcasm is always harmless when people laugh",
          "Words can linger, especially when their meaning feels uncertain",
          "Students should avoid answering difficult questions",
          "Hallways are louder than classrooms"
        ], 1, "The story focuses on how a repeated phrase follows Noah because he cannot fully trust what it means.", ["he2","he3","he8"], "Those lines emphasize the lasting effect of the words."),
        Q("Vocabulary in Context", "In the final sentence, the word \"echoing\" most nearly suggests —", [
          "physically bouncing off the walls only",
          "staying in Noah's mind and feelings",
          "being translated into another language",
          "growing louder every minute"
        ], 1, "The hallway echo is partly emotional: the phrase stops repeating so strongly in Noah's thoughts.", ["he3","he8"], "The context is internal, not just sound.")
      ]
    },
    {
      title: "My Shadow",
      author: "Robert Louis Stevenson",
      tag: "Classic Literature",
      level: "Grade 5",
      hook: "A playful public-domain poem about the mystery of an ordinary shadow.",
      paragraphs: [
        [
          S("mys1", "I have a little shadow that goes in and out with me,"),
          S("mys2", "And what can be the use of him is more than I can see."),
          S("mys3", "He is very, very like me from the heels up to the head;"),
          S("mys4", "And I see him jump before me, when I jump into my bed.")
        ],
        [
          S("mys5", "The funniest thing about him is the way he likes to grow,"),
          S("mys6", "Not at all like proper children, which is always very slow;"),
          S("mys7", "For he sometimes shoots up taller like an india-rubber ball,"),
          S("mys8", "And he sometimes gets so little that there's none of him at all.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this poem mostly about?", [
          "A child trying to hide from bedtime",
          "A child noticing how strange and funny a shadow seems",
          "A lesson about keeping a room clean",
          "A plan to draw people at different heights"
        ], 1, "The speaker keeps describing the shadow's odd behavior with curiosity and humor.", ["mys1","mys2","mys5","mys8"], "Those lines show the poem focuses on the shadow's puzzling and playful changes."),
        Q("Inference", "How does the speaker most likely feel about the shadow?", [
          "Amused and curious",
          "Angry and embarrassed",
          "Bored and sleepy",
          "Jealous and worried"
        ], 0, "Calling the shadow's behavior 'the funniest thing' suggests the speaker enjoys wondering about it.", ["mys2","mys5"], "The poem sounds playful rather than upset."),
        Q("Author's Purpose", "Why does Stevenson compare the shadow to a child that grows?", [
          "To explain a scientific fact about mirrors",
          "To help readers picture how the shadow changes size",
          "To prove the speaker has a twin",
          "To show the speaker wants to be taller"
        ], 1, "The comparison helps readers imagine the shadow stretching and shrinking in a lively way.", ["mys6","mys7","mys8"], "The child-growth comparison makes the size changes easy to picture."),
        Q("Vocabulary in Context", "In the line \"Not at all like proper children,\" the word \"proper\" most nearly means —", [
          "well-behaved",
          "ordinary or usual",
          "rich and dressed up",
          "ready for school"
        ], 1, "The speaker means shadows do not grow in the ordinary slow way real children do.", ["mys6"], "The next lines explain the unusual quick changes.")
      ]
    },
    {
      title: "Bed in Summer",
      author: "Robert Louis Stevenson",
      tag: "Classic Literature",
      level: "Grade 5",
      hook: "A public-domain poem about the unfair feeling of summer bedtime.",
      paragraphs: [
        [
          S("bis1", "In winter I get up at night"),
          S("bis2", "And dress by yellow candle-light."),
          S("bis3", "In summer, quite the other way,"),
          S("bis4", "I have to go to bed by day.")
        ],
        [
          S("bis5", "I have to go to bed and see"),
          S("bis6", "The birds still hopping on the tree,"),
          S("bis7", "Or hear the grown-up people's feet"),
          S("bis8", "Still going past me in the street.")
        ],
        [
          S("bis9", "And does it not seem hard to you,"),
          S("bis10", "When all the sky is clear and blue,"),
          S("bis11", "And I should like so much to play,"),
          S("bis12", "To have to go to bed by day?")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the main idea of this poem?", [
          "Winter mornings are harder than summer mornings",
          "The speaker thinks summer bedtime feels unfair because daylight remains",
          "Birds are louder in summer than in winter",
          "Candles make bedtime less frightening"
        ], 1, "The poem centers on the speaker's complaint that bedtime comes while the day still feels active and bright.", ["bis3","bis4","bis9","bis12"], "Those lines return to the same unfairness."),
        Q("Inference", "What can you infer about the speaker in summer?", [
          "The speaker wants to stay awake and keep enjoying the day",
          "The speaker is eager to go to sleep early",
          "The speaker dislikes birds and traffic",
          "The speaker prefers winter weather"
        ], 0, "The speaker notices signs of life outdoors and says, 'I should like so much to play.'", ["bis5","bis6","bis7","bis11"], "These details show the speaker wants more time."),
        Q("Author's Purpose", "Why does the poet include the birds and the grown-up people's feet?", [
          "To show that the world outside is still awake and busy",
          "To prove the speaker lives in a noisy city",
          "To explain what wakes the speaker in winter",
          "To compare children and adults directly"
        ], 0, "Those images make bedtime feel especially early because activity is still going on outside.", ["bis5","bis6","bis7","bis8"], "The details underline the speaker's complaint."),
        Q("Vocabulary in Context", "In the question \"does it not seem hard to you,\" the word \"hard\" most nearly means —", [
          "solid",
          "difficult or unfair",
          "cold",
          "loud"
        ], 1, "The speaker is not describing texture; the word means the situation feels unfair.", ["bis9","bis12"], "The final question explains why the speaker uses that word.")
      ]
    },
    {
      title: "Where Go the Boats?",
      author: "Robert Louis Stevenson",
      tag: "Classic Literature",
      level: "Grade 5",
      hook: "A public-domain poem that turns paper boats into a faraway adventure.",
      paragraphs: [
        [
          S("wgb1", "Dark brown is the river,"),
          S("wgb2", "Golden is the sand."),
          S("wgb3", "It flows along for ever,"),
          S("wgb4", "With trees on either hand.")
        ],
        [
          S("wgb5", "Green leaves a-floating,"),
          S("wgb6", "Castles of the foam,"),
          S("wgb7", "Boats of mine a-boating,"),
          S("wgb8", "Where will all come home?")
        ],
        [
          S("wgb9", "On goes the river"),
          S("wgb10", "And out past the mill,"),
          S("wgb11", "Away down the valley,"),
          S("wgb12", "Away down the hill."),
          S("wgb13", "Away down the river,"),
          S("wgb14", "A hundred miles or more,"),
          S("wgb15", "Other little children"),
          S("wgb16", "Shall bring my boats ashore.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this poem mostly about?", [
          "A dangerous storm on the river",
          "A child imagining a long journey for tiny boats",
          "How mills are built near valleys",
          "A lesson about cleaning up litter"
        ], 1, "The poem follows the speaker's boats as imagination carries them farther and farther away.", ["wgb7","wgb8","wgb13","wgb16"], "Those lines focus on the boats' journey."),
        Q("Inference", "What does the ending suggest about the speaker?", [
          "The speaker feels angry that the boats are gone",
          "The speaker imagines a friendly world beyond what can be seen",
          "The speaker believes the boats will sink at once",
          "The speaker wants to stop the river"
        ], 1, "Imagining other children finding the boats gives the ending a hopeful, connected feeling.", ["wgb14","wgb15","wgb16"], "The speaker pictures a welcoming destination, not a loss."),
        Q("Author's Purpose", "Why does Stevenson describe the river's color and the trees at the beginning?", [
          "To create a vivid picture before the boats begin their journey",
          "To prove the river is deeper than a lake",
          "To show that the boats are made from wood",
          "To warn readers away from the water"
        ], 0, "The opening images help the reader see the setting clearly before the imagination takes off.", ["wgb1","wgb2","wgb3","wgb4"], "These details paint the scene."),
        Q("Vocabulary in Context", "In the line \"It flows along for ever,\" the phrase \"for ever\" most nearly suggests —", [
          "for a few minutes",
          "without seeming to end",
          "only during storms",
          "in complete silence"
        ], 1, "The poem uses the phrase to make the river feel endless to a child's eye.", ["wgb3","wgb13","wgb14"], "The later lines continue that long, far-moving feeling.")
      ]
    },
    {
      title: "The Swing",
      author: "Robert Louis Stevenson",
      tag: "Classic Literature",
      level: "Grade 5-6",
      hook: "A public-domain poem that captures the thrill of seeing the world from high above.",
      paragraphs: [
        [
          S("sw1", "How do you like to go up in a swing,"),
          S("sw2", "Up in the air so blue?"),
          S("sw3", "Oh, I do think it the pleasantest thing"),
          S("sw4", "Ever a child can do!")
        ],
        [
          S("sw5", "Up in the air and over the wall,"),
          S("sw6", "Till I can see so wide,"),
          S("sw7", "Rivers and trees and cattle and all"),
          S("sw8", "Over the countryside.")
        ],
        [
          S("sw9", "Till I look down on the garden green,"),
          S("sw10", "Down on the roof so brown,"),
          S("sw11", "Up in the air I go flying again,"),
          S("sw12", "Up in the air and down!")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the poem mainly about?", [
          "A child feeling afraid of heights",
          "The joy and freedom of riding on a swing",
          "How to build a swing in a garden",
          "The difference between a roof and a wall"
        ], 1, "The speaker calls swinging 'the pleasantest thing' and describes its exciting motion and view.", ["sw1","sw3","sw7","sw11"], "The whole poem celebrates the experience."),
        Q("Inference", "How does the speaker feel while swinging?", [
          "Proud and bossy",
          "Delighted and exhilarated",
          "Confused and worried",
          "Tired and impatient"
        ], 1, "The enthusiastic questions and lively motion show pure enjoyment.", ["sw1","sw3","sw4","sw11"], "The tone is energetic and happy."),
        Q("Author's Purpose", "Why does Stevenson list \"Rivers and trees and cattle and all\"?", [
          "To show how high the swing lifts the speaker's point of view",
          "To explain where farms are located",
          "To prove the child is traveling miles away",
          "To compare city life to country life"
        ], 0, "The list helps readers picture the broad view the child gets from the top of the swing.", ["sw5","sw6","sw7","sw8"], "The details widen the scene."),
        Q("Vocabulary in Context", "In the phrase \"Till I can see so wide,\" the word \"wide\" most nearly means —", [
          "large in size",
          "over a broad area",
          "hard to understand",
          "close to the ground"
        ], 1, "The speaker can see across the countryside, so 'wide' refers to a broad view.", ["sw6","sw7","sw8"], "The next line explains what that wide view includes.")
      ]
    },
    {
      title: "The Emperor's New Clothes",
      author: "Hans Christian Andersen",
      tag: "Classic Literature",
      level: "Grade 5-6",
      hook: "A public-domain tale about vanity, fear, and one honest voice.",
      paragraphs: [
        [
          S("enc1", "Many years ago there was an Emperor who was so excessively fond of new clothes that he spent all his money on dress."),
          S("enc2", "Two swindlers came to town and said they could weave cloth so wonderful that it was invisible to anyone who was unfit for his office or unusually simple in character.")
        ],
        [
          S("enc3", "The Emperor and his officers could see nothing at all,"),
          S("enc4", "but none of them would say so, for fear of being thought foolish."),
          S("enc5", "So they all praised the cloth and pretended to admire its colors and pattern.")
        ],
        [
          S("enc6", "At last the Emperor walked in procession wearing the clothes that were not there."),
          S("enc7", "Everyone in the street said they were beautiful,"),
          S("enc8", "until a little child cried out that the Emperor had nothing on.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the central idea of this passage?", [
          "Fancy clothing makes rulers wiser",
          "People may pretend to believe something false because they fear looking foolish",
          "Children care more about fashion than adults do",
          "Parades are the best way to test new fabric"
        ], 1, "The story shows how fear and pride keep people from admitting the truth.", ["enc2","enc4","enc5","enc8"], "Those lines trace the lie from beginning to end."),
        Q("Inference", "Why are the officers willing to praise the invisible cloth?", [
          "They secretly love sewing",
          "They are afraid the truth will make them seem foolish or unfit",
          "They can actually see magical colors",
          "They want the child to speak first"
        ], 1, "The passage directly links their pretending to fear of judgment.", ["enc2","enc4","enc5"], "Their silence and praise come from self-protection."),
        Q("Author's Purpose", "Why does Andersen end the scene with the child speaking up?", [
          "To show that honesty can cut through group pressure",
          "To prove children always understand politics",
          "To suggest the child wants attention",
          "To explain why the parade stops suddenly"
        ], 0, "The child's honesty breaks the spell of pretending and reveals the truth plainly.", ["enc6","enc7","enc8"], "The ending contrasts public praise with simple honesty."),
        Q("Vocabulary in Context", "In this passage, the word \"swindlers\" most nearly means —", [
          "skilled artists",
          "traveling guards",
          "dishonest tricksters",
          "careful servants"
        ], 2, "The men fool the Emperor by pretending to weave magical cloth.", ["enc2"], "Their actions reveal what the word means.")
      ]
    },
    {
      title: "The Selfish Giant",
      author: "Oscar Wilde",
      tag: "Classic Literature",
      level: "Grade 5-6",
      hook: "A public-domain tale in which a garden changes with the giant's heart.",
      paragraphs: [
        [
          S("sg1", "Every afternoon, when school was over, the children used to go and play in the Giant's garden."),
          S("sg2", "It was a large lovely garden, with soft green grass and peach-trees that broke into blossoms of delicate pink and pearl.")
        ],
        [
          S("sg3", "One day the Giant came back and cried in a very gruff voice, \"What are you doing here?\""),
          S("sg4", "The children ran away, and the Giant built a high wall and put up a notice-board: TRESPASSERS WILL BE PROSECUTED."),
          S("sg5", "After that, the Spring forgot the garden, and the Snow and the Frost and the North Wind stayed there.")
        ],
        [
          S("sg6", "Then one morning the Giant heard a linnet singing outside his window."),
          S("sg7", "He looked out and saw that the children had crept in through a little hole in the wall, and the trees were once more covered with blossoms."),
          S("sg8", "The Giant understood how selfish he had been.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mostly about?", [
          "Why walls are useful in cold weather",
          "How selfishness pushes joy away and welcome brings it back",
          "How birds migrate during spring",
          "Why children should not play in gardens"
        ], 1, "The garden grows cold when the Giant shuts others out and brightens when he welcomes them back.", ["sg1","sg4","sg5","sg7"], "The changing garden reflects the Giant's behavior."),
        Q("Inference", "What can you infer about the garden's endless winter?", [
          "It symbolizes the Giant's selfish attitude",
          "It proves the garden is at the North Pole",
          "It happens because the wall blocks sunlight forever",
          "It means the children broke the trees"
        ], 0, "The story connects the Giant's harshness with the absence of spring and joy.", ["sg3","sg4","sg5","sg8"], "The weather change follows his selfish choice."),
        Q("Author's Purpose", "Why does Wilde describe the garden as lovely before the Giant returns?", [
          "To show what is lost when the Giant becomes possessive",
          "To explain how expensive the trees are",
          "To compare peach-trees with apple-trees",
          "To prove the children are noisy"
        ], 0, "The beautiful opening makes the later emptiness and recovery more meaningful.", ["sg1","sg2","sg5","sg7"], "The contrast drives the lesson."),
        Q("Vocabulary in Context", "In the sentence about the children having \"crept in,\" the word \"crept\" most nearly means —", [
          "marched proudly",
          "moved slowly and quietly",
          "jumped wildly",
          "flew overhead"
        ], 1, "The children enter through a small hole in the wall, so they move carefully and quietly.", ["sg7"], "The situation gives the clue.")
      ]
    },
    {
      title: "The Happy Prince",
      author: "Oscar Wilde",
      tag: "Classic Literature",
      level: "Grade 6-7",
      hook: "A public-domain tale about a statue and a swallow helping people in need.",
      paragraphs: [
        [
          S("hp1", "High above the city, on a tall column, stood the statue of the Happy Prince."),
          S("hp2", "He was gilded all over with thin leaves of fine gold, for eyes he had two bright sapphires, and a large red ruby glowed on his sword-hilt.")
        ],
        [
          S("hp3", "Looking down, the Prince saw a poor seamstress seated at a table."),
          S("hp4", "Her little boy was lying ill in bed and asking for oranges, but his mother had only river water to give him."),
          S("hp5", "So the Prince asked the Swallow to take the ruby from his sword and carry it to her.")
        ],
        [
          S("hp6", "Night after night the Swallow flew through the city,"),
          S("hp7", "taking the Prince's riches to the poor,"),
          S("hp8", "and the Prince seemed less beautiful on the outside and more useful in the dark.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the main idea of this passage?", [
          "Beautiful statues should be protected from weather",
          "True worth can come from giving up treasure to help others",
          "Cities need more birds at night",
          "Poor families should ask rulers for help directly"
        ], 1, "The Prince and the Swallow use the statue's beauty and riches to relieve suffering.", ["hp2","hp5","hp7","hp8"], "The passage moves from decoration to compassion."),
        Q("Inference", "What can you infer about the Happy Prince from his request to the Swallow?", [
          "He cares more about appearances than people",
          "He feels compassion when he sees suffering below him",
          "He wants the Swallow to leave the city quickly",
          "He regrets being placed on a tall column"
        ], 1, "Seeing the seamstress and her son leads him to give away something valuable.", ["hp3","hp4","hp5"], "His action reveals his character."),
        Q("Author's Purpose", "Why does Wilde describe the Prince as covered in gold and jewels at the start?", [
          "To make the Prince seem dull and ordinary",
          "To set up a contrast between outward splendor and inner generosity",
          "To explain why the city is wealthy",
          "To prove the Swallow likes shiny things"
        ], 1, "The rich description makes the Prince's later sacrifice more powerful.", ["hp1","hp2","hp7","hp8"], "The contrast matters to the theme."),
        Q("Vocabulary in Context", "In the phrase \"a large red ruby glowed,\" the word \"glowed\" most nearly means —", [
          "shone brightly",
          "melted slowly",
          "turned dark",
          "broke apart"
        ], 0, "The jewel is being described as bright and shining on the statue.", ["hp2"], "The image is visual, not destructive.")
      ]
    },
    {
      title: "The Elephant's Child",
      author: "Rudyard Kipling",
      tag: "Classic Literature",
      level: "Grade 6-7",
      hook: "A public-domain origin story about curiosity and one very long nose.",
      paragraphs: [
        [
          S("ec1", "In the High and Far-Off Times the Elephant's Child was full of 'satiable curiosity."),
          S("ec2", "He asked everybody questions, and at last he asked what the Crocodile had for dinner.")
        ],
        [
          S("ec3", "So he went to the great, grey-green, greasy Limpopo River."),
          S("ec4", "The Crocodile caught him by his little nose,"),
          S("ec5", "and the Bi-Coloured-Python-Rock-Snake helped pull from the other side.")
        ],
        [
          S("ec6", "Then the Elephant's Child's nose was drawn out into a trunk."),
          S("ec7", "It was very useful for picking up food, swatting flies, and making a loud trumpeting noise."),
          S("ec8", "After that, he was more careful whom he questioned, but he never lost his curiosity.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mainly about?", [
          "Why crocodiles live near rivers",
          "How curiosity leads the Elephant's Child into trouble and change",
          "Why snakes and elephants are enemies",
          "How to cross the Limpopo River safely"
        ], 1, "The story follows the Elephant's Child from question-asking to the event that changes his nose.", ["ec1","ec2","ec4","ec6"], "Those moments trace the cause and effect."),
        Q("Inference", "What can you infer about the Elephant's Child at the end?", [
          "He has become completely silent",
          "He has learned caution without losing his curious nature",
          "He is angry at all the other animals forever",
          "He wishes his nose had stayed small"
        ], 1, "The final line says he became more careful, not less curious.", ["ec7","ec8"], "His experience changes his behavior but not his personality."),
        Q("Author's Purpose", "Why does Kipling list the trunk's many uses?", [
          "To show that the change, though painful, becomes practical and important",
          "To explain how to train an elephant",
          "To prove the Crocodile was kind",
          "To compare trunks with tails"
        ], 0, "The list turns the trunk from a strange result into a useful adaptation.", ["ec6","ec7"], "These details explain why the new nose matters."),
        Q("Vocabulary in Context", "In the phrase \"'satiable curiosity,\" the word \"curiosity\" most nearly means —", [
          "anger",
          "a strong desire to know",
          "fear of rivers",
          "hunger for fruit"
        ], 1, "The Elephant's Child keeps asking questions because he wants to know things.", ["ec1","ec2"], "His behavior defines the word.")
      ]
    },
    {
      title: "How the Camel Got His Hump",
      author: "Rudyard Kipling",
      tag: "Classic Literature",
      level: "Grade 6-7",
      hook: "A public-domain story in which laziness turns into a permanent problem.",
      paragraphs: [
        [
          S("cam1", "In the beginning of years, when the world was so new, the Camel lived in the middle of a Howling Desert because he did not want to work."),
          S("cam2", "When the Horse and the Dog and the Ox asked him to help, the Camel said only, \"Humph!\"")
        ],
        [
          S("cam3", "At last the Djinn in charge of All Deserts came to speak with him."),
          S("cam4", "The Djinn said the Camel had made extra work for the others by refusing to do his share."),
          S("cam5", "Then the Camel's back puffed up into a great hump.")
        ],
        [
          S("cam6", "The Djinn told him that the hump would let him work for three days without eating,"),
          S("cam7", "but that he had brought the trouble on himself by being idle in the beginning."),
          S("cam8", "And from that day to this, the Camel always wears a hump.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the main idea of this story passage?", [
          "Animals should live only in deserts",
          "Avoiding work can create bigger consequences later",
          "Horses and dogs are better workers than oxen",
          "A hump makes a camel run faster"
        ], 1, "The Camel refuses to help and ends up with a lasting consequence tied to that idleness.", ["cam1","cam2","cam4","cam7"], "The passage connects cause and consequence clearly."),
        Q("Inference", "Why does the Djinn give the Camel a hump?", [
          "To decorate him for the desert",
          "To solve the problem created by the Camel's laziness",
          "To make the other animals laugh",
          "To hide him from travelers"
        ], 1, "The hump is both a punishment and a practical way to make the Camel work afterward.", ["cam4","cam5","cam6"], "The Djinn responds to the imbalance the Camel caused."),
        Q("Author's Purpose", "Why does Kipling include the repeated word \"Humph!\"?", [
          "To show the Camel's stubborn refusal in a memorable way",
          "To prove the Camel has a cough",
          "To explain how deserts sound at night",
          "To show that the other animals are frightened"
        ], 0, "The repeated word gives the Camel a comic but clearly unhelpful attitude.", ["cam2"], "It captures his stubbornness in one sound."),
        Q("Vocabulary in Context", "In this passage, the word \"idle\" most nearly means —", [
          "restless",
          "lazy or avoiding work",
          "confused",
          "polite"
        ], 1, "The Djinn uses the word while explaining that the Camel would not do his share.", ["cam1","cam4","cam7"], "The surrounding details define it.")
      ]
    },
    {
      title: "How the Leopard Got His Spots",
      author: "Rudyard Kipling",
      tag: "Classic Literature",
      level: "Grade 6-7",
      hook: "A public-domain story about camouflage and change.",
      paragraphs: [
        [
          S("leo1", "Once the Leopard lived in a place full of sand and yellow-brown grass, and he was yellowish-brown all over."),
          S("leo2", "The Ethiopian who hunted with him was yellow-brown too, and together they could be plainly seen.")
        ],
        [
          S("leo3", "But the animals moved into the great grey-green forest full of shadows and blotches and bars of light."),
          S("leo4", "There they became hard to see, while the Leopard and the Ethiopian still stood out.")
        ],
        [
          S("leo5", "So the Ethiopian changed his own skin,"),
          S("leo6", "and then with the tips of his fingers he made black marks all over the Leopard."),
          S("leo7", "That is how the Leopard got his spots and could hide among the shadows.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is this passage mainly about?", [
          "Why forests are darker than deserts",
          "How changing surroundings force the Leopard to adapt",
          "Why hunters prefer grasslands",
          "How to paint animal fur"
        ], 1, "The passage shows that once the setting changes, the Leopard must change too in order to blend in.", ["leo1","leo3","leo4","leo7"], "The story is about adaptation to a new environment."),
        Q("Inference", "Why do the animals in the forest become harder to see?", [
          "They leave the forest every night",
          "The shadows and broken light help hide them",
          "They learn to run faster than the Leopard",
          "They cover themselves with sand"
        ], 1, "The forest is described as full of shadows and blotches, which naturally conceal them.", ["leo3","leo4"], "The setting itself provides the clue."),
        Q("Author's Purpose", "Why does Kipling describe the forest as full of \"shadows and blotches and bars of light\"?", [
          "To create the visual pattern that explains why spots would help",
          "To prove the forest is unsafe for children",
          "To compare the forest to a city street",
          "To show that the Leopard is frightened of trees"
        ], 0, "The image prepares readers to understand why spotted camouflage would work there.", ["leo3","leo7"], "The description sets up the solution."),
        Q("Vocabulary in Context", "In the sentence saying the Leopard and Ethiopian \"stood out,\" that phrase most nearly means —", [
          "looked unusual and easy to notice",
          "stood very still",
          "refused to hunt",
          "moved away from each other"
        ], 0, "They are easy to notice because their coloring no longer matches the environment.", ["leo3","leo4"], "The contrast with the hidden animals explains the phrase.")
      ]
    },
    {
      title: "The Remarkable Rocket",
      author: "Oscar Wilde",
      tag: "Classic Literature",
      level: "Grade 6-7",
      hook: "A public-domain satire about someone too proud to understand himself.",
      paragraphs: [
        [
          S("rr1", "At the Prince's marriage there were many fireworks ready to be set off, but none thought more highly of himself than the Rocket."),
          S("rr2", "He talked so much about his own importance that he scarcely let the others speak.")
        ],
        [
          S("rr3", "The Rocket became so emotional while praising his own sensitivity that he burst into tears,"),
          S("rr4", "and his powder grew damp, so he could not be fired with the rest of the fireworks.")
        ],
        [
          S("rr5", "The next day two boys found him and used him to start their fire."),
          S("rr6", "At last he exploded in a fine shower of sparks,"),
          S("rr7", "but nobody was there to admire him.")
        ]
      ],
      questions: [
        Q("Main Idea", "What is the central idea of this passage?", [
          "Real greatness depends on talking loudly",
          "Pride and self-importance can blind someone to reality",
          "Fireworks are too dangerous for celebrations",
          "Children understand rockets better than adults"
        ], 1, "The Rocket thinks he is extraordinary, but his vanity keeps leading him into ridiculous failure.", ["rr1","rr2","rr4","rr7"], "The ending exposes how wrong his self-image is."),
        Q("Inference", "Why is the Rocket unable to join the other fireworks?", [
          "He is hidden behind the palace",
          "His own tears ruin his powder",
          "The Prince changes the program",
          "The other fireworks push him away"
        ], 1, "His emotional display literally makes him too damp to be lit.", ["rr3","rr4"], "The cause and result are stated directly."),
        Q("Author's Purpose", "Why does Wilde have the Rocket finally explode when no one is watching?", [
          "To create irony and reveal the emptiness of his vanity",
          "To show that boys understand fireworks better than royals",
          "To prove the wedding celebration lasted too long",
          "To explain how campfires are usually started"
        ], 0, "The ending is ironic because the Rocket has spent the whole story craving admiration.", ["rr1","rr2","rr7"], "The final moment clashes with his expectations."),
        Q("Vocabulary in Context", "In the line saying the Rocket's powder grew \"damp,\" the word \"damp\" most nearly means —", [
          "hot and bright",
          "slightly wet",
          "carefully packed",
          "ready to explode"
        ], 1, "His tears make the powder wet enough that it cannot ignite properly.", ["rr3","rr4"], "The context defines the word.")
      ]
    }
  ]
};
