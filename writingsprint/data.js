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
            "The dog barked. The mail carrier and the screen door.",
            "Pressing the screen door was the dog and the barked mail carrier.",
            "The dog barked at the mail carrier. It was a door."
          ],
          0,
          "The best combined sentence keeps both ideas, sounds natural, and avoids awkward repetition."
        ),
        DrillCard(
          "Add detail cleanly",
          "Maya opened her notebook. She was nervous about the speech.",
          "Which sentence combines the ideas most effectively?",
          [
            "Maya opened her notebook because the speech was notebook nervous.",
            "Nervous about the speech, Maya opened her notebook.",
            "Maya opened her notebook, and nervous, and speech.",
            "Maya was the speech. She opened nervous notebook."
          ],
          1,
          "A good opener can show the feeling first, then the action."
        ),
        DrillCard(
          "Use a precise connector",
          "The clouds darkened. The game continued for a few more minutes.",
          "Which revision is strongest?",
          [
            "The clouds darkened, but the game continued for a few more minutes.",
            "The clouds darkened, the game continued, darkened.",
            "The clouds darkened. The game, too, because minutes.",
            "Darkened were clouds and the game continuedly."
          ],
          0,
          "The word 'but' shows the contrast between the stormy sky and the game continuing."
        ),
        DrillCard(
          "Avoid choppy writing",
          "The bell rang. Students rushed into the hallway. Lockers slammed.",
          "Which revision combines the ideas best?",
          [
            "The bell rang because lockers slammed the hallway students.",
            "When the bell rang, students rushed into the hallway and lockers slammed.",
            "Students, bell, hallway, lockers slammed.",
            "The bell rang. Students rushed. Lockers slammed in ringing."
          ],
          1,
          "The stronger sentence keeps the sequence clear and turns three short pieces into one smooth moment."
        ),
        DrillCard(
          "Place description well",
          "The creek was shallow. It moved quickly over the rocks.",
          "Which revision is strongest?",
          [
            "The shallow creek moved quickly over the rocks.",
            "The creek was shallow over the rocks and quickly.",
            "Moved quickly was the creek because shallow rocks.",
            "The creek was rocks. It shallow quickly moved."
          ],
          0,
          "This version turns one sentence into a useful adjective and keeps the image crisp."
        ),
        DrillCard(
          "Combine with cause",
          "Jordan practiced every afternoon. Jordan improved at serving.",
          "Which revision combines the ideas most clearly?",
          [
            "Jordan improved at serving, practicing every afternoon.",
            "Jordan practiced every afternoon, so he improved at serving.",
            "Jordan serving improved and afternoon practiced.",
            "Every afternoon improved Jordan because serving."
          ],
          1,
          "The connector 'so' clearly shows the cause-and-effect relationship."
        ),
        DrillCard(
          "Keep the sentence readable",
          "The museum was crowded. We stayed an extra hour.",
          "Which revision works best?",
          [
            "Although the museum was crowded, we stayed an extra hour.",
            "Crowded the museum stayed we hour extra.",
            "The museum was crowded, staying we hour.",
            "We stayed. The museum crowded. An hour extra."
          ],
          0,
          "The word 'although' cleanly signals contrast."
        ),
        DrillCard(
          "Combine to show timing",
          "Leah finished the puzzle. Her brother walked into the room.",
          "Which revision is strongest?",
          [
            "Leah finished the puzzle, into the room her brother walked.",
            "Just as Leah finished the puzzle, her brother walked into the room.",
            "Leah finished. Brother room puzzle walked.",
            "The puzzle was finished by walking into the room."
          ],
          1,
          "A time phrase can make two actions feel connected and natural."
        ),
        DrillCard(
          "Use a vivid sentence",
          "The candles flickered. The power went out.",
          "Which revision combines the ideas best?",
          [
            "The candles flickered when the power went out.",
            "The candles flickered, power out candles.",
            "The power the candles went flickered out.",
            "Flickered were the candles. Out power."
          ],
          0,
          "The stronger version shows the relationship between the two events clearly."
        ),
        DrillCard(
          "Fold in an appositive",
          "Mr. Chen leads the robotics club. He teaches science.",
          "Which revision is strongest?",
          [
            "Mr. Chen, who teaches science, leads the robotics club.",
            "Mr. Chen leads, science teaches, robotics club.",
            "Science is Mr. Chen and the robotics club leads him.",
            "Mr. Chen leads the robotics club and science because teaches."
          ],
          0,
          "This revision combines both facts smoothly and shows how they relate."
        ),
        DrillCard(
          "Use parallel structure",
          "Ella packed snacks. Ella packed sunscreen. Ella packed a map.",
          "Which revision is strongest?",
          [
            "Ella packed snacks, sunscreen, and a map.",
            "Ella packed snacks and sunscreen and packed a map and packed.",
            "Packed Ella map sunscreen snacks.",
            "Ella was packing because a map had sunscreen."
          ],
          0,
          "Parallel lists sound cleaner than repeating the same subject again and again."
        ),
        DrillCard(
          "Strengthen with purpose",
          "The team met after school. They wanted to revise the project.",
          "Which revision combines the ideas best?",
          [
            "The team met after school to revise the project.",
            "After school the project revised wanted the team.",
            "The team met after school. Wanted to revise project.",
            "The project met the team after school to want."
          ],
          0,
          "The infinitive phrase 'to revise' makes the purpose of the meeting clear."
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
            "Lunch happens every day at school.",
            "The cafeteria can feel chaotic because of the noise and rush.",
            "People like different foods at lunch.",
            "Trays are made from strong materials."
          ],
          1,
          "A strong topic sentence previews the main idea of the whole paragraph, not just one tiny detail."
        ),
        DrillCard(
          "Best transition",
          "Paragraph draft: 'First, our class measured the garden beds. ____ , we drew a simple planting map. Finally, we labeled each section.'",
          "Which transition best fits the blank?",
          [
            "On the other hand",
            "Next",
            "For example",
            "At last year"
          ],
          1,
          "This paragraph is sequential, so the transition should show the next step."
        ),
        DrillCard(
          "Remove repetition",
          "Paragraph draft: 'The assembly was exciting. The assembly was loud. The assembly was full of students cheering.'",
          "Which revision improves the paragraph most?",
          [
            "The assembly was exciting, loud, and full of cheering students.",
            "The assembly assembly was exciting and assembly loud.",
            "Exciting students were the assembly of loud.",
            "The assembly was exciting. The assembly was an assembly."
          ],
          0,
          "The strongest revision keeps the meaning but removes unnecessary repetition."
        ),
        DrillCard(
          "Fix a fragment",
          "Paragraph draft: 'Our group wanted to finish the poster on time. Because the markers kept drying out.'",
          "What is the best fix?",
          [
            "Because the markers kept drying out.",
            "Our group wanted to finish the poster on time because the markers kept drying out.",
            "Our group wanted to finish the poster on time, but the markers kept drying out.",
            "Markers drying out on time the poster."
          ],
          2,
          "The second sentence is a fragment. The best fix keeps the original idea and turns it into a complete sentence."
        ),
        DrillCard(
          "Choose the best conclusion",
          "Paragraph draft: 'Students should have access to water bottles during the school day because staying hydrated helps them focus and feel better in class.'",
          "Which concluding sentence is strongest?",
          [
            "Water bottles are made of different materials.",
            "For these reasons, allowing water bottles is a simple change that could support learning.",
            "Students go to school many days each year.",
            "Hydration means drinking water, which is water."
          ],
          1,
          "A strong conclusion wraps up the main point instead of drifting to a new topic."
        ),
        DrillCard(
          "Clarify pronouns",
          "Paragraph draft: 'Kai handed the model to Marcus after he glued the last wheel on.'",
          "Which revision is clearest?",
          [
            "After Kai glued the last wheel on, he handed the model to Marcus.",
            "Kai handed it after he did it and Marcus got it.",
            "After he glued it, Marcus was Kai.",
            "Kai handed the model to Marcus after Marcus and Kai."
          ],
          0,
          "The original sentence is confusing because 'he' could refer to either person. The best revision names the correct person."
        ),
        DrillCard(
          "Evidence sentence",
          "Paragraph draft: 'The new reading corner helps students. It has beanbags, softer lighting, and bins of high-interest books.'",
          "Why is the second sentence useful?",
          [
            "It gives evidence supporting the first sentence.",
            "It changes the topic completely.",
            "It repeats the first sentence word for word.",
            "It asks the reader a question."
          ],
          0,
          "Strong paragraphs follow a claim with concrete support."
        ),
        DrillCard(
          "Order ideas better",
          "Paragraph draft: 'The game ended in a tie. Everyone cheered when Luis scored the final basket. The clock had only three seconds left.'",
          "Which revision puts the events in the clearest order?",
          [
            "The game ended in a tie, and everyone likes basketball.",
            "With only three seconds left on the clock, everyone cheered when Luis scored the final basket, and the game ended in a tie.",
            "Everyone cheered because a tie is a clock.",
            "Luis scored. Tie. Basket. Clock."
          ],
          1,
          "Good paragraph structure often depends on putting events in an order the reader can follow."
        ),
        DrillCard(
          "Sentence variety",
          "Paragraph draft: 'I opened the window. I heard the rain. I smelled the wet grass.'",
          "Which revision improves sentence variety most?",
          [
            "I opened the window and heard the rain while smelling the wet grass.",
            "I opened the I and heard the I and smelled the I.",
            "Window rain grass were opened heard smelled.",
            "I opened the window. The window was opened by me."
          ],
          0,
          "Variety makes the writing sound more mature and less robotic."
        ),
        DrillCard(
          "Strong supporting detail",
          "Paragraph draft: 'The art room is inspiring.'",
          "Which sentence would best support that idea?",
          [
            "Many art rooms exist in schools.",
            "Finished student work covers the walls, and jars of bright paint line the shelves.",
            "Inspiration is a word with four syllables.",
            "The room is inside the school building."
          ],
          1,
          "The strongest support uses concrete details the reader can picture."
        ),
        DrillCard(
          "Fix tense shift",
          "Paragraph draft: 'Yesterday we walked to the creek, and then we collect water samples.'",
          "Which revision is correct?",
          [
            "Yesterday we walked to the creek, and then we collected water samples.",
            "Yesterday we walked to the creek, and then we collecting water samples.",
            "Yesterday we walk to the creek, and then we collect water samples.",
            "Yesterday we collected to the creek."
          ],
          0,
          "The paragraph starts in past tense, so the second verb should stay in past tense too."
        ),
        DrillCard(
          "Make the claim stronger",
          "Paragraph draft: 'Recycling is good.'",
          "Which revision is the strongest claim sentence?",
          [
            "Recycling is good because good things are good.",
            "Our school should recycle more paper because it would reduce waste and save supplies.",
            "Recycling is a topic people know.",
            "Paper can be white or lined."
          ],
          1,
          "A stronger claim is specific and gives the reader a direction right away."
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
            "The school garden helped both the community and student learning.",
            "Gardens are always easy to maintain.",
            "Vegetables are the only useful school project.",
            "Science classes should happen outdoors every day."
          ],
          0,
          "A strong claim matches what the evidence actually proves, not what sounds biggest."
        ),
        DrillCard(
          "Best evidence",
          "Claim: A later school start time could help students feel more prepared for class.",
          "Which detail is the strongest evidence?",
          [
            "Many students like breakfast foods.",
            "Students often say mornings feel early.",
            "A survey showed that more students arrived on time after the start time was pushed back.",
            "The school building opens before sunrise in winter."
          ],
          2,
          "Strong evidence is specific and directly connected to the claim."
        ),
        DrillCard(
          "Best reasoning",
          "Claim: The reading corner improves focus. Evidence: Students choose books there and spend more time reading quietly.",
          "Which reasoning sentence is strongest?",
          [
            "This means the reading corner has chairs.",
            "This shows the space helps students settle in and stay engaged with reading.",
            "This proves all students everywhere like the same books.",
            "This is evidence because it is a sentence."
          ],
          1,
          "Reasoning should explain why the evidence matters, not just repeat it."
        ),
        DrillCard(
          "Match evidence to claim",
          "Claim: The new bus route is more efficient.",
          "Which evidence best supports the claim?",
          [
            "The buses are painted in school colors.",
            "Students enjoy talking on the bus.",
            "The average ride time dropped by eight minutes after the route changed.",
            "The route has many turns."
          ],
          2,
          "Efficiency is about time or effort saved, so the strongest evidence should measure that."
        ),
        DrillCard(
          "Spot weak reasoning",
          "Claim: Students should have more time to revise essays. Evidence: Many students improve their drafts after teacher feedback.",
          "Which sentence shows weak reasoning?",
          [
            "This matters because feedback gives students a chance to strengthen weak parts of their writing.",
            "This matters because revision can turn first ideas into clearer final answers.",
            "This matters because essays have words in them.",
            "This matters because time to revise can improve organization and detail."
          ],
          2,
          "Weak reasoning does not actually explain the connection between the claim and the evidence."
        ),
        DrillCard(
          "Find the strongest CER line",
          "Prompt: Should students be allowed to redo one major assignment each quarter?",
          "Which sentence works best as evidence?",
          [
            "Redoing work sounds interesting.",
            "Students can probably learn from mistakes.",
            "In one class pilot, students who revised major assignments raised both their scores and the quality of later work.",
            "Assignments are part of school."
          ],
          2,
          "The strongest evidence includes a concrete example with a result."
        ),
        DrillCard(
          "Claim or opinion?",
          "Source: The school replaced disposable trays with washable ones, and cafeteria trash bags filled more slowly afterward.",
          "Which sentence is the strongest claim?",
          [
            "Washable trays reduced waste in the cafeteria.",
            "Trays are very interesting to think about.",
            "The cafeteria is a room in the building.",
            "Disposable items are always bad no matter what."
          ],
          0,
          "A strong claim stays grounded in what the source can actually support."
        ),
        DrillCard(
          "Use precise reasoning",
          "Claim: Class jobs build responsibility. Evidence: Students remember to water plants, organize supplies, and report missing materials.",
          "Which reasoning sentence is best?",
          [
            "These examples show that class jobs give students repeated chances to take care of shared tasks.",
            "These examples show that supplies exist in classrooms.",
            "These examples show that students are always perfect.",
            "These examples show that water is important to plants only."
          ],
          0,
          "The best reasoning names the pattern in the evidence and connects it to the claim."
        ),
        DrillCard(
          "Choose relevant evidence",
          "Claim: A longer lunch period could help students return to class calmer.",
          "Which detail is most relevant?",
          [
            "The cafeteria walls were painted last summer.",
            "Students reported feeling less rushed when they had enough time to eat and talk before class.",
            "Many lunches include fruit.",
            "Teachers also eat lunch during the day."
          ],
          1,
          "Relevant evidence connects directly to calmness and the length of lunch."
        ),
        DrillCard(
          "Reasoning vs. repetition",
          "Claim: The school newspaper helps students become stronger writers. Evidence: Student editors revise headlines, cut repetition, and reorganize articles before printing.",
          "Which sentence is reasoning, not repetition?",
          [
            "The editors revise headlines, cut repetition, and reorganize articles.",
            "This matters because practicing those revision moves teaches students how real writing improves before publication.",
            "The newspaper is printed at school.",
            "Writing is writing because writers write."
          ],
          1,
          "Reasoning explains the importance of the evidence instead of just copying it."
        ),
        DrillCard(
          "Find the overclaim",
          "Claim: The debate club helps students speak with more confidence. Evidence: Several students volunteered to present in class after joining the club.",
          "Which sentence goes too far beyond the evidence?",
          [
            "The club may help students feel more comfortable speaking in front of others.",
            "The evidence suggests the club supports public speaking practice.",
            "The evidence proves every student in the school is now confident in every situation.",
            "The evidence connects debate practice with classroom participation."
          ],
          2,
          "Strong CER writing avoids exaggerating beyond what the evidence supports."
        ),
        DrillCard(
          "Best short CER response",
          "Prompt: Why might a classroom job chart be useful?",
          "Which answer is strongest?",
          [
            "A job chart is useful. It exists in classrooms.",
            "A classroom job chart can help students share responsibility. For example, students can take turns passing out papers, watering plants, and checking supplies. This matters because regular shared tasks help a class run smoothly and teach students to contribute.",
            "Job charts are colorful and some people like charts.",
            "Classrooms should have charts because schools have walls."
          ],
          1,
          "The strongest answer includes a claim, evidence, and reasoning in one short response."
        )
      ]
    }
  }
};
