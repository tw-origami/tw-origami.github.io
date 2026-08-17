function SprintPrompt(title, type, prompt, checklist, rubric, stronger){
  return { title, type, prompt, checklist, rubric, stronger };
}

function DrillCard(label, setup, prompt, choices, answer, coach){
  return { label, setup, prompt, choices, answer, coach };
}

window.WRITING_SPRINT = {
  sprintSeconds: 180,
  MODES: {
    sprint: {
      label: "Sprint Prompt",
      icon: "✍️",
      help: "Write a quick, clear response in 3 minutes, then compare it to a stronger model and rubric.",
      items: [
        SprintPrompt(
          "Library Lunch",
          "Opinion",
          "Your school is deciding whether students should be allowed to eat lunch in the library once a week. Write a short response stating your opinion and support it with reasons and details.",
          [
            "State your opinion in the first sentence.",
            "Give at least two reasons.",
            "Use one specific example or detail.",
            "End with a sentence that sounds finished."
          ],
          [
            "Strong answers make the claim clear right away.",
            "Stronger responses use specific support, not vague opinions.",
            "The best responses link reasons together with transitions like because, for example, and also.",
            "A strong finish restates the point without repeating the exact same sentence."
          ],
          "Students should be allowed to eat lunch in the library once a week because it would give kids a calm place to recharge. Some students do better in the afternoon when they have had a quieter break. It could also help students use library time in a smart way, like finishing a chapter or looking over homework. If the school sets clear rules about cleaning up and using indoor voices, library lunch could be both peaceful and useful."
        ),
        SprintPrompt(
          "Rainy Recess Plan",
          "Informative",
          "Explain the best way a school could make indoor recess more enjoyable on rainy days. Write a short answer with clear suggestions and support.",
          [
            "Name the plan you think would work best.",
            "Explain how it would help students.",
            "Include one practical detail about how it would run.",
            "Keep the response organized from idea to explanation."
          ],
          [
            "Strong answers explain a plan, not just a complaint.",
            "The clearest responses use details that sound realistic in a school building.",
            "Helpful explanations connect the plan to student needs.",
            "A final sentence should leave the reader with the main takeaway."
          ],
          "A school could improve indoor recess by setting up activity zones in different classrooms or parts of the gym. One area could be for board games, another for drawing, and another for movement challenges that stay safe indoors. This would help students choose an activity instead of crowding into one noisy space. Teachers could rotate the zones each week so the choices stay interesting. A simple plan like this would make rainy days feel more organized and much more fun."
        ),
        SprintPrompt(
          "Hero In History",
          "Constructed Response",
          "Choose a historical figure you have learned about. Explain one challenge that person faced and how they responded to it.",
          [
            "Name the person clearly.",
            "Describe the challenge in one or two sentences.",
            "Explain what the person did in response.",
            "Show why that response mattered."
          ],
          [
            "Strong responses focus on one challenge instead of many disconnected facts.",
            "The best answers explain cause and effect.",
            "Specific details are stronger than broad praise.",
            "A clear final sentence should show why the response mattered."
          ],
          "Nelson Mandela faced the challenge of fighting apartheid, a system that treated people unfairly because of race. Instead of giving up after years in prison, he kept working toward justice and later helped lead South Africa through change. His response mattered because he showed that leadership can combine courage with forgiveness. Rather than seeking revenge, he helped his country move toward a fairer future."
        ),
        SprintPrompt(
          "Best Evidence",
          "CER",
          "A class wants to plant a garden. Write a short claim about why the garden would help the school, then support it with evidence and reasoning.",
          [
            "Write a clear claim.",
            "Add at least one piece of evidence or concrete detail.",
            "Explain how the evidence supports the claim.",
            "Make sure the reasoning connects the evidence back to the point."
          ],
          [
            "Strong CER writing has all three parts: claim, evidence, and reasoning.",
            "The strongest evidence is specific, not just 'it would be good.'",
            "Reasoning explains why the evidence matters.",
            "A good response sounds connected all the way through."
          ],
          "A school garden would help students learn in a hands-on way. For example, students could measure plant growth, observe insects, and track how weather affects the beds. This evidence matters because it turns science from something students only read about into something they can actually investigate. A garden would not just make the campus prettier. It would create a real outdoor classroom."
        ),
        SprintPrompt(
          "After-School Choice",
          "Opinion",
          "If your school could add one new after-school club, what should it be? Write a short response that gives your choice and explains why.",
          [
            "Name the club right away.",
            "Give two reasons it would help students.",
            "Use at least one detail or example.",
            "End by reinforcing your choice."
          ],
          [
            "Clear opinion writing chooses one idea and stays focused on it.",
            "Specific benefits are stronger than general praise.",
            "Examples make the answer feel more convincing.",
            "A short response can still sound complete."
          ],
          "My school should add a robotics club because it would give students a fun way to solve problems together. Students could build simple machines, test ideas, and improve designs when something does not work. That kind of trial and error teaches persistence as well as teamwork. A robotics club would also connect math and science to real projects, which could make those subjects feel more exciting."
        ),
        SprintPrompt(
          "Character Lesson",
          "Literary Response",
          "Think of a story in which a character makes a mistake. Write a short response explaining what the character learns from that mistake.",
          [
            "Name the character and the mistake.",
            "Explain what happens because of it.",
            "State the lesson the character learns.",
            "Use details from the story, not just your own opinion."
          ],
          [
            "Strong literary responses stay tied to the text.",
            "The best answers explain both the mistake and the lesson.",
            "Specific story details make the response stronger.",
            "A concluding sentence should connect back to the character's growth."
          ],
          "In many stories, a character learns most after making a poor choice. For example, if a character lies to avoid getting in trouble, the lie often causes even more problems. When the truth finally comes out, the character learns that honesty would have been easier and more respectful from the start. The mistake matters because it changes the character's understanding, not just the plot."
        ),
        SprintPrompt(
          "Better Hallway Flow",
          "Problem-Solution",
          "Hallways can get crowded between classes. Write a short response explaining one smart way a school could reduce hallway traffic problems.",
          [
            "State the solution clearly.",
            "Explain how it would work.",
            "Give one detail showing why it is realistic.",
            "Wrap up with why it would improve the school day."
          ],
          [
            "Strong problem-solution writing names the problem and the fix.",
            "The clearest responses explain the steps, not just the idea.",
            "Useful details make the solution believable.",
            "A final sentence should show the value of the plan."
          ],
          "One smart way to reduce hallway traffic would be to use staggered release times for a few grade levels or wings of the building. If one group leaves class even a minute earlier than another, fewer students pile into the same space at once. This would be realistic because schools already use bell schedules and could adjust them slightly. A calmer hallway would make passing periods safer and less stressful."
        ),
        SprintPrompt(
          "Study Habit",
          "Informative",
          "Explain one study habit that helps students prepare for a big test. Write a short response teaching that habit to someone else.",
          [
            "Name the study habit.",
            "Explain how to do it.",
            "Tell why it works.",
            "Use an example or detail."
          ],
          [
            "Strong informative writing teaches the reader something clear.",
            "Steps help the response feel usable.",
            "The answer is stronger when it explains why the habit works.",
            "A short example can make the advice more memorable."
          ],
          "One helpful study habit is reviewing in short bursts instead of cramming all at once. A student can study for twenty minutes, take a short break, and then return to the material. This works because the brain remembers information better when practice is spread out. For example, reviewing vocabulary a little each day is usually more effective than trying to learn every word the night before a test."
        ),
        SprintPrompt(
          "School Tradition",
          "Narrative",
          "Write a short scene about a school tradition, event, or ordinary day that matters to students. Make the moment feel specific.",
          [
            "Begin with a clear setting or moment.",
            "Include one sensory detail.",
            "Show what makes the moment matter.",
            "End on a line that feels meaningful or complete."
          ],
          [
            "Strong short narrative writing focuses on one moment.",
            "Specific details create a clearer picture than broad descriptions.",
            "The reader should understand why the moment matters.",
            "A short ending can still leave an impression."
          ],
          "The gym always sounded different on field day. Sneakers squeaked, teachers called out directions, and the whole room buzzed with the kind of excitement that made everyone stand a little straighter. Even students who usually stayed quiet were shouting for their teams by the end of the relay. What made the day special was not just the games. It was the feeling that the whole school was pulling in the same direction."
        ),
        SprintPrompt(
          "Should Homework Change?",
          "Argument",
          "Some people think homework should be shorter but more focused. Write a short argument agreeing or disagreeing with that idea.",
          [
            "Say whether you agree or disagree.",
            "Support your position with reasons.",
            "Use a practical example.",
            "End by reinforcing your main point."
          ],
          [
            "A strong argument takes a side instead of staying vague.",
            "Support should connect to students' real experience.",
            "Examples make the position more believable.",
            "A firm final sentence helps the response sound confident."
          ],
          "Homework should be shorter but more focused because students learn more from thoughtful practice than from long packets of repeated work. When assignments are too long, students may rush or stop paying attention. A shorter assignment with strong questions can still show what students understand while leaving time for reading, activities, or rest. Better homework is not always more homework."
        )
      ]
    },
    combine: {
      label: "Sentence Combining",
      icon: "🔗",
      help: "Combine short ideas into smoother, stronger sentences without making them confusing.",
      items: [
        DrillCard(
          "Combine for flow",
          "The dog barked at the mail carrier. The dog pressed its paws against the screen door.",
          "Which revision combines the ideas best?",
          [
            "The dog barked at the mail carrier, pressing its paws against the screen door.",
            "The dog barked at the mail carrier and the dog also pressed its paws hard against the screen door while it kept on barking.",
            "The mail carrier barked at the dog and pressed against the screen door.",
            "The dog barked, it pressed its paws on the door."
          ],
          0,
          "The best combined sentence keeps both ideas, sounds natural, and avoids awkward repetition. The second choice says the same thing but repeats 'the dog' and rambles; the third accidentally changes the meaning; the fourth is a comma splice (two sentences joined by only a comma)."
        ),
        DrillCard(
          "Add detail cleanly",
          "Maya opened her notebook. She was nervous about the speech.",
          "Which sentence combines the ideas most effectively?",
          [
            "Maya was nervous about the speech, and because of that she slowly opened up her notebook to look over her notes again.",
            "Nervous about the speech, Maya opened her notebook.",
            "Maya opened her notebook, so she felt nervous about the speech.",
            "Maya opened her notebook. She felt nervous."
          ],
          1,
          "A good opener can show the feeling first, then the action — and stay short. The first choice is wordy, the third reverses the cause (opening the notebook didn't make her nervous), and the fourth is still two choppy sentences."
        ),
        DrillCard(
          "Use a precise connector",
          "The clouds darkened. The game continued for a few more minutes.",
          "Which revision is strongest?",
          [
            "The clouds darkened, but the game continued for a few more minutes.",
            "The clouds darkened, so the game continued for a few more minutes.",
            "Because the clouds darkened, the game had to continue for several more long minutes without ever stopping.",
            "The clouds darkened, the game continued for a few more minutes."
          ],
          0,
          "The word 'but' shows the contrast between the stormy sky and the game continuing. 'So' and 'because' claim the dark clouds caused the game to keep going, which isn't right, and the last choice is a comma splice."
        ),
        DrillCard(
          "Avoid choppy writing",
          "The bell rang. Students rushed into the hallway. Lockers slammed.",
          "Which revision combines the ideas best?",
          [
            "The bell rang and then the students rushed into the hallway and then the lockers slammed shut all around them.",
            "When the bell rang, students rushed into the hallway and lockers slammed.",
            "When the lockers slammed, the bell rang and students rushed into the hallway.",
            "The bell rang, students rushed, lockers slammed."
          ],
          1,
          "The strongest version keeps the order clear and reads smoothly. The first choice strings everything together with repeated 'and then,' the third scrambles the order of events, and the fourth is a comma splice."
        ),
        DrillCard(
          "Place description well",
          "The creek was shallow. It moved quickly over the rocks.",
          "Which revision is strongest?",
          [
            "The creek, which happened to be pretty shallow, went ahead and moved very quickly over all of the rocks.",
            "The creek was shallow, it moved quickly over the rocks.",
            "The shallow creek moved quickly over the rocks.",
            "The quick creek made the rocks shallow as it moved."
          ],
          2,
          "The shortest choice here is the strongest: it turns 'was shallow' into the adjective 'shallow' and keeps the image crisp. The first is wordy, the second is a comma splice, and the fourth changes the meaning."
        ),
        DrillCard(
          "Combine with cause",
          "Jordan practiced every afternoon. Jordan improved at serving.",
          "Which revision combines the ideas most clearly?",
          [
            "Jordan improved at serving, so he practiced every afternoon.",
            "Jordan practiced every afternoon, so he improved at serving.",
            "Jordan kept practicing his serving every single afternoon after school, and that is the whole reason he slowly got better at it.",
            "Jordan practiced every afternoon, he improved at serving."
          ],
          1,
          "The connector 'so' shows cause and effect: practice led to improvement. The first choice flips the cause backward, the third rambles, and the fourth is a comma splice."
        ),
        DrillCard(
          "Keep the sentence readable",
          "The museum was crowded. We stayed an extra hour.",
          "Which revision works best?",
          [
            "The museum was crowded, we stayed an extra hour.",
            "Because the museum was crowded, we stayed an extra hour.",
            "Although the museum was crowded, we stayed an extra hour.",
            "The museum was really crowded that day, but even so we decided that we would go ahead and stay for one whole extra hour."
          ],
          2,
          "'Although' cleanly signals the contrast — we stayed in spite of the crowd. The first is a comma splice, 'because' wrongly says the crowd was the reason we stayed, and the last choice is padded with extra words."
        ),
        DrillCard(
          "Combine to show timing",
          "Leah finished the puzzle. Her brother walked into the room.",
          "Which revision is strongest?",
          [
            "Leah finished the puzzle so that her brother would walk into the room.",
            "Just as Leah finished the puzzle, her brother walked into the room.",
            "Leah was just about finished with the puzzle at the exact same time that her brother came walking into the room.",
            "Leah finished the puzzle, her brother walked in."
          ],
          1,
          "A time phrase like 'just as' connects the two actions naturally. The first choice invents a cause that isn't there, the third is wordy, and the fourth is a comma splice."
        ),
        DrillCard(
          "Use a vivid sentence",
          "The candles flickered. The power went out.",
          "Which revision combines the ideas best?",
          [
            "The candles flickered when the power went out.",
            "The power went out when the candles flickered.",
            "The candles started to flicker right at the very moment when the power in the whole entire house suddenly went out.",
            "The candles flickered, the power went out."
          ],
          0,
          "This shows the relationship between the two events in just a few words. The second choice reverses which event happened first, the third is padded, and the fourth is a comma splice."
        ),
        DrillCard(
          "Fold in an appositive",
          "Mr. Chen leads the robotics club. He teaches science.",
          "Which revision is strongest?",
          [
            "Mr. Chen, who teaches science, leads the robotics club.",
            "Mr. Chen leads the robotics club, which teaches science.",
            "Mr. Chen teaches science, he leads the robotics club.",
            "Mr. Chen is a teacher who teaches science classes, and he is also the person who leads the school robotics club."
          ],
          0,
          "The phrase 'who teaches science' tucks the second fact in smoothly. The second choice accidentally says the club teaches science, the third is a comma splice, and the fourth says it correctly but uses far too many words."
        ),
        DrillCard(
          "Use parallel structure",
          "Ella packed snacks. Ella packed sunscreen. Ella packed a map.",
          "Which revision is strongest?",
          [
            "Ella packed snacks, and she packed sunscreen, and she also packed a map for the trip.",
            "Ella packed snacks, sunscreen, and a map.",
            "Ella packed snacks, she packed sunscreen, she packed a map.",
            "Ella packed snacks along with also packing sunscreen and a map too."
          ],
          1,
          "A parallel list is the cleanest fix — and here it's also the shortest. The first choice repeats 'she packed,' the third is a comma splice, and the fourth is awkward."
        ),
        DrillCard(
          "Strengthen with purpose",
          "The team met after school. They wanted to revise the project.",
          "Which revision combines the ideas best?",
          [
            "The team met after school to revise the project.",
            "The team met after school, but they wanted to revise the project.",
            "The team decided to get together after school because what they really wanted to do was revise their whole project.",
            "The team met after school, they wanted to revise the project."
          ],
          0,
          "The short phrase 'to revise the project' makes the purpose of the meeting clear. 'But' signals a contrast that isn't there, the third choice is wordy, and the fourth is a comma splice."
        )
      ]
    },
    fix: {
      label: "Fix the Paragraph",
      icon: "🧱",
      help: "Repair weak structure, unclear sentences, and bumpy organization the way test rubrics reward.",
      items: [
        DrillCard(
          "Topic sentence",
          "Paragraph draft: 'Our cafeteria can get loud. Trays bang. People talk over one another. Some students rush to finish and leave.'",
          "Which sentence would work best as a topic sentence at the beginning?",
          [
            "Many students bring their own lunches from home instead of buying food in the cafeteria line each day.",
            "The cafeteria can feel chaotic at lunchtime.",
            "Lunch happens every day at school.",
            "People have different favorite foods."
          ],
          1,
          "A strong topic sentence previews the main idea of the whole paragraph — here, the noise and rush — even if it's short. The other choices are all true but wander off the paragraph's point."
        ),
        DrillCard(
          "Best transition",
          "Paragraph draft: 'First, our class measured the garden beds. ____ , we drew a simple planting map. Finally, we labeled each section.'",
          "Which transition best fits the blank?",
          [
            "On the other hand",
            "In conclusion",
            "Next",
            "For example"
          ],
          2,
          "This paragraph lists steps in order (First... Finally), so the transition should show the next step. 'On the other hand' and 'For example' signal a contrast or an example, and 'In conclusion' would end the paragraph too early."
        ),
        DrillCard(
          "Remove repetition",
          "Paragraph draft: 'The assembly was exciting. The assembly was loud. The assembly was full of students cheering.'",
          "Which revision improves the paragraph most?",
          [
            "The exciting assembly was loud, and it really was an exciting, loud assembly that was full of loud cheering.",
            "The assembly was exciting, loud, and full of cheering students.",
            "The assembly was exciting. It was also loud. Students cheered a lot.",
            "The students cheered."
          ],
          1,
          "The best revision keeps every idea but says 'the assembly' just once. The first choice still repeats words, the third is still choppy, and the fourth drops most of the meaning."
        ),
        DrillCard(
          "Fix a fragment",
          "Paragraph draft: 'Our group wanted to finish the poster on time. Because the markers kept drying out.'",
          "What is the best fix?",
          [
            "Because the markers kept drying out.",
            "The markers kept drying out, so our group wanted to finish the poster on time.",
            "Our group wanted to finish the poster on time, but the markers kept drying out.",
            "Our group wanted to finish the poster on time because the markers kept drying out."
          ],
          2,
          "The second part is a fragment. The best fix joins it to a complete sentence AND keeps the real meaning — the markers made finishing harder. 'Because'/'so' versions say the drying markers were the reason they wanted to finish, which flips the logic."
        ),
        DrillCard(
          "Choose the best conclusion",
          "Paragraph draft: 'Students should have access to water bottles during the school day because staying hydrated helps them focus and feel better in class.'",
          "Which concluding sentence is strongest?",
          [
            "Everyone should always be allowed to do whatever they want during the entire school day, no matter what.",
            "For these reasons, allowing water bottles is a simple change that could support learning.",
            "Water bottles are made of different materials.",
            "Students go to school many days each year."
          ],
          1,
          "A strong conclusion wraps up the paragraph's own point. The first choice overreaches into something the paragraph never argued, and the last two drift to unrelated topics."
        ),
        DrillCard(
          "Clarify pronouns",
          "Paragraph draft: 'Kai handed the model to Marcus after he glued the last wheel on.'",
          "Which revision is clearest?",
          [
            "After Kai glued the last wheel on, he handed the model to Marcus.",
            "Kai handed the model to Marcus after Marcus glued the last wheel on.",
            "After the last wheel was glued on, the finished model was then handed over to Marcus by him.",
            "He handed the model to him after he glued the last wheel on."
          ],
          0,
          "In the original, 'he' could mean Kai or Marcus. The best fix names Kai as the gluer. The second choice picks the wrong person, and the third and fourth still leave 'him'/'he' unclear."
        ),
        DrillCard(
          "Evidence sentence",
          "Paragraph draft: 'The new reading corner helps students. It has beanbags, softer lighting, and bins of high-interest books.'",
          "Why is the second sentence useful?",
          [
            "It gives evidence supporting the first sentence.",
            "It changes the topic completely.",
            "It repeats the first sentence word for word.",
            "It lists some features but has nothing to do with helping students at all."
          ],
          0,
          "Strong paragraphs follow a claim with concrete support. The beanbags, lighting, and books are the details that show HOW the corner helps."
        ),
        DrillCard(
          "Order ideas better",
          "Paragraph draft: 'The game ended in a tie. Everyone cheered when Luis scored the final basket. The clock had only three seconds left.'",
          "Which revision puts the events in the clearest order?",
          [
            "The game ended in a tie, and everyone really likes basketball.",
            "With three seconds left, Luis scored the final basket, and the game ended in a tie.",
            "Luis scored the final basket after the game had already ended in a tie with three seconds left on the clock.",
            "Everyone cheered, the clock had three seconds, the game tied, Luis scored."
          ],
          1,
          "Good structure puts events in an order the reader can follow: time running down, the basket, then the tie. The third choice contradicts itself (scoring after the game ended), and the last one is jumbled."
        ),
        DrillCard(
          "Sentence variety",
          "Paragraph draft: 'I opened the window. I heard the rain. I smelled the wet grass.'",
          "Which revision improves sentence variety most?",
          [
            "The window was opened by me, and then the rain was heard by me, and the wet grass was smelled by me too.",
            "I opened the window and heard the rain while smelling the wet grass.",
            "I opened the window, and I heard the rain, and I smelled the wet grass.",
            "I opened the window. I heard the rain. I smelled the wet grass."
          ],
          1,
          "Combining the actions into one flowing sentence adds variety. The first choice is clumsy passive voice, the third still repeats 'and I,' and the fourth leaves the choppy original unchanged."
        ),
        DrillCard(
          "Strong supporting detail",
          "Paragraph draft: 'The art room is inspiring.'",
          "Which sentence would best support that idea?",
          [
            "Art is something that people all over the world have enjoyed making for a very, very long time.",
            "Finished student work covers the walls, and jars of bright paint line the shelves.",
            "Many art rooms exist in schools.",
            "The room is inside the school building."
          ],
          1,
          "The strongest support uses concrete details the reader can picture. The other choices are true but general and don't show what makes THIS room inspiring."
        ),
        DrillCard(
          "Fix tense shift",
          "Paragraph draft: 'Yesterday we walked to the creek, and then we collect water samples.'",
          "Which revision is correct?",
          [
            "Yesterday we had walked all the way to the creek, and then we are collecting the water samples now.",
            "Yesterday we walked to the creek, and then we collected water samples.",
            "Yesterday we walk to the creek, and then we collect water samples.",
            "Yesterday we walked to the creek, and then we collecting water samples."
          ],
          1,
          "The paragraph starts in past tense ('Yesterday... walked'), so the second verb should stay past tense: 'collected.' The other choices mix tenses or use the wrong verb form."
        ),
        DrillCard(
          "Make the claim stronger",
          "Paragraph draft: 'Recycling is good.'",
          "Which revision is the strongest claim sentence?",
          [
            "Recycling is a very important topic that a lot of people all around the world care deeply about these days.",
            "Our school should recycle more paper because it would reduce waste and save supplies.",
            "Recycling is good because it is good for us.",
            "Recycling helps."
          ],
          1,
          "A stronger claim is specific and gives the reader a clear direction. The first choice sounds big but says nothing specific, the third is circular, and the fourth is too vague."
        )
      ]
    },
    cer: {
      label: "Claim-Evidence-Reasoning",
      icon: "🧠",
      help: "Practice the writing move that turns facts into a short, convincing response.",
      items: [
        DrillCard(
          "Pick the best claim",
          "Source: The school garden produced vegetables that were donated to a local pantry, and science classes used the beds for plant observations.",
          "Which claim is best supported by the source?",
          [
            "The school garden grew vegetables that were given to a food pantry while science classes studied the plants growing in the beds.",
            "The school garden helped both the community and student learning.",
            "Gardens are always easy to maintain.",
            "Science should only ever be taught outdoors in a garden."
          ],
          1,
          "A strong claim matches what the evidence proves — and it's a claim, not just a retelling. The first choice only restates the source without making a point, and the last two overreach beyond what the source shows."
        ),
        DrillCard(
          "Best evidence",
          "Claim: A later school start time could help students feel more prepared for class.",
          "Which detail is the strongest evidence?",
          [
            "A recent report found that teenagers all around the world generally enjoy sleeping in whenever they possibly can.",
            "Students often say mornings feel early.",
            "A survey showed that more students arrived on time after the start time was pushed back.",
            "Many students like breakfast foods."
          ],
          2,
          "Strong evidence is specific and directly tied to the claim. The first choice is long but irrelevant to feeling prepared, and the other two are vague or off-topic."
        ),
        DrillCard(
          "Best reasoning",
          "Claim: The reading corner improves focus. Evidence: Students choose books there and spend more time reading quietly.",
          "Which reasoning sentence is strongest?",
          [
            "This proves that every single student everywhere loves reading in beanbag chairs all day long.",
            "This shows the space helps students settle in and stay engaged with reading.",
            "This means the reading corner has chairs.",
            "This is true because reading is reading."
          ],
          1,
          "Reasoning explains WHY the evidence matters. The first choice overreaches wildly, the third just notices a detail, and the fourth is circular."
        ),
        DrillCard(
          "Match evidence to claim",
          "Claim: The new bus route is more efficient.",
          "Which evidence best supports the claim?",
          [
            "The bus company decided to rearrange several of the stops along the route earlier this year for a number of reasons.",
            "Students enjoy talking on the bus.",
            "The average ride time dropped by eight minutes after the route changed.",
            "The buses are painted in school colors."
          ],
          2,
          "Efficiency is about time or effort saved, so the strongest evidence measures that. The first choice is long but never mentions any improvement, and the others are unrelated."
        ),
        DrillCard(
          "Spot weak reasoning",
          "Claim: Students should have more time to revise essays. Evidence: Many students improve their drafts after teacher feedback.",
          "Which sentence shows weak reasoning?",
          [
            "This matters because feedback gives students a chance to strengthen the weak parts of their writing.",
            "This matters because revision can turn rough first ideas into much clearer final answers.",
            "This matters because essays have words in them.",
            "This matters because more time to revise can improve a draft's organization and detail."
          ],
          2,
          "Weak reasoning doesn't actually explain the link between the claim and the evidence. Notice the weak one is the SHORTEST here — length doesn't decide strength; connection does."
        ),
        DrillCard(
          "Find the strongest CER line",
          "Prompt: Should students be allowed to redo one major assignment each quarter?",
          "Which sentence works best as evidence?",
          [
            "Almost everyone would probably agree that being able to redo things is a really wonderful idea for all students.",
            "Students can probably learn from mistakes.",
            "In one class pilot, students who revised major assignments raised both their scores and the quality of later work.",
            "Redoing work sounds interesting."
          ],
          2,
          "The strongest evidence gives a concrete example with a result. The first choice is long but just an opinion, and the other two are vague."
        ),
        DrillCard(
          "Claim or opinion?",
          "Source: The school replaced disposable trays with washable ones, and cafeteria trash bags filled more slowly afterward.",
          "Which sentence is the strongest claim?",
          [
            "Washable trays reduced waste in the cafeteria.",
            "The cafeteria switched to washable trays, and after that change the trash bags filled up much more slowly than they used to.",
            "Trays are very interesting to think about.",
            "Disposable items are always bad no matter what."
          ],
          0,
          "A strong claim is a short, clear point the source supports. The second choice just retells the source without making a point, and the last two are off-topic or an overreach."
        ),
        DrillCard(
          "Use precise reasoning",
          "Claim: Class jobs build responsibility. Evidence: Students remember to water plants, organize supplies, and report missing materials.",
          "Which reasoning sentence is best?",
          [
            "These examples show that students who do class jobs will grow up to be perfectly responsible adults in every possible way.",
            "These examples show that class jobs give students repeated chances to take care of shared tasks.",
            "These examples show that supplies exist in classrooms.",
            "These examples show that water is important to plants."
          ],
          1,
          "The best reasoning names the pattern in the evidence and links it to the claim. The first choice overreaches, and the other two miss the point about responsibility."
        ),
        DrillCard(
          "Choose relevant evidence",
          "Claim: A longer lunch period could help students return to class calmer.",
          "Which detail is most relevant?",
          [
            "A longer lunch would obviously fix every single problem that students have ever had at school.",
            "Students reported feeling less rushed when they had enough time to eat and talk before class.",
            "Many lunches include fruit.",
            "The cafeteria walls were painted last summer."
          ],
          1,
          "Relevant evidence connects directly to calmness and the length of lunch. The first choice overreaches, and the others have nothing to do with the claim."
        ),
        DrillCard(
          "Reasoning vs. repetition",
          "Claim: The school newspaper helps students become stronger writers. Evidence: Student editors revise headlines, cut repetition, and reorganize articles before printing.",
          "Which sentence is reasoning, not repetition?",
          [
            "The student editors revise the headlines, cut out repetition, and reorganize the articles before they print them.",
            "This matters because practicing those revision moves teaches students how real writing improves before publication.",
            "The newspaper is printed at school.",
            "Writing is good because writers are people who write things."
          ],
          1,
          "Reasoning explains why the evidence matters instead of just repeating it. The first choice simply says the evidence again in new words, and the last is circular."
        ),
        DrillCard(
          "Find the overclaim",
          "Claim: The debate club helps students speak with more confidence. Evidence: Several students volunteered to present in class after joining the club.",
          "Which sentence goes too far beyond the evidence?",
          [
            "The club may well help many students feel a good deal more comfortable when they speak in front of other people.",
            "The evidence suggests the club gives students useful public speaking practice.",
            "The evidence proves every student is now confident in every situation.",
            "The evidence connects debate practice with more classroom participation."
          ],
          2,
          "An overclaim says more than the evidence can show. A few volunteers don't prove EVERY student is now confident in EVERY situation. The longest choice here is actually a careful, reasonable statement — so length isn't the clue, the words 'every' and 'proves' are."
        ),
        DrillCard(
          "Best short CER response",
          "Prompt: Why might a classroom job chart be useful?",
          "Which answer is strongest?",
          [
            "Job charts can be very colorful, and lots of teachers all over the place really seem to enjoy putting them up on their walls.",
            "A classroom job chart can help students share responsibility. For example, students take turns passing out papers, watering plants, and checking supplies. This matters because regular shared tasks help a class run smoothly and teach students to contribute.",
            "A job chart is useful. It exists in classrooms.",
            "Classrooms should have charts because schools have walls."
          ],
          1,
          "The strongest answer has all three parts — a claim, evidence, and reasoning. The first choice is long but never explains why a chart helps, and the last two are too thin."
        )
      ]
    }
  }
};
