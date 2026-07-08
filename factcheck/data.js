/* Fact Checker — content data. Media literacy for the online world.
 * Four INTERACTIVE games:
 *   HEADLINE  → does the headline fairly match the article, or is it clickbait?
 *   REDFLAGS  → check off every warning sign in a shady post (multi-select)
 *   SOURCE    → pick the most trustworthy source to answer a question
 *   VERIFY    → choose the smartest move to fact-check a viral claim (lateral reading)
 */
window.FC = {

  TEACHER: {
    headline: {
      how:'Read the headline, then the short article below it. Decide: does the headline honestly match the story (Fair), or does it exaggerate and hype to get clicks (Clickbait)? Pick one.',
      point:'Most people share headlines without reading the article. Comparing the two is the single fastest way to catch misleading news.',
      learn:'Spotting clickbait — headlines that promise shocking, mysterious, or extreme things the article never actually delivers.',
      explore:'Ask: “What did the headline promise, and did the article deliver it?” Then have them rewrite a clickbait headline into an honest one.'
    },
    redflags: {
      how:'Read the post. Then check off EVERY red flag it shows — no author, all-caps hype, no date, no evidence, a weird web address, a too-good-to-be-true claim, or trying to sell you something. Press Check when you’ve found them all. (Some posts are actually trustworthy — those have zero flags!)',
      point:'Unreliable content shares the same warning signs over and over. Learning to scan for them turns kids into instant skeptics.',
      learn:'The common red flags of untrustworthy sources — and that a calm, dated, sourced article usually has none of them.',
      explore:'Ask: “Which red flag is the biggest giveaway here?” Then open a real article together and check how many red flags it has (hopefully zero).'
    },
    source: {
      how:'Read the question at the top. Then pick the source you’d trust MOST to answer it — the one with real expertise and no reason to lie to you.',
      point:'Being a good fact-checker isn’t about knowing everything — it’s about knowing WHERE to look. This builds that instinct.',
      learn:'Judging sources by expertise and motive: an official agency or original study beats a random post, an ad, or hearsay.',
      explore:'Ask: “Does this source actually know, and do they have a reason to spin it?” Then find the best source for a question they’re curious about.'
    },
    verify: {
      how:'A viral claim appears. Pick the smartest next move to check whether it’s true — before you believe it or share it. The best move usually means LEAVING the post to check other sources.',
      point:'Professional fact-checkers use “lateral reading”: they leave the suspicious page and check trusted sources instead of judging by looks or likes.',
      learn:'The real-world fact-checking process — searching other outlets, finding the original study, reverse image searching, and reading laterally.',
      explore:'Ask: “Why is leaving the page smarter than reading its own About section?” Then fact-check a claim they saw online this week together.'
    }
  },

  SOURCES: [
    { key:'newseum', name:'News Literacy Project — Checkology',
      url:'https://newslit.org/', note:'Free lessons on spotting misinformation, checking sources, and reading the news smartly.' },
    { key:'ala', name:'American Library Association — Evaluating Info',
      url:'https://libguides.ala.org/InformationEvaluation', note:'Librarian-approved tips for judging whether a source is trustworthy.' },
    { key:'factcheck', name:'FactCheck.org & Snopes',
      url:'https://www.factcheck.org/', note:'Real fact-checking organizations that investigate viral claims — great examples of the process.' }
  ],

  /* ───── Glossary (📖 popup) ───── */
  TERMS: [
    { term:'Source', def:'Where a piece of information comes from — a person, website, book, or study.', simple:'The origin of a fact. Always ask, “who’s telling me this, and how do THEY know?”', ex:'A study, a news site, or a friend can all be sources.' },
    { term:'Primary Source', def:'A first-hand, original record made by someone who was there.', simple:'Straight from the event — no one in between. A diary, a photo, an original study.', ex:'A soldier’s letter home is a primary source.' },
    { term:'Secondary Source', def:'A source that describes or analyzes primary sources after the fact.', simple:'Someone summarizing or explaining the original — a step removed.', ex:'A textbook about a war is a secondary source.' },
    { term:'Bias', def:'A leaning toward one side that can slant how a source presents information.', simple:'A slant. A company reviewing its OWN product isn’t a fair judge.', ex:'An ad for a snack won’t tell you the downsides.' },
    { term:'Clickbait', def:'A headline designed to get clicks by exaggerating or hiding the real story.', simple:'A hyped-up, misleading headline — “You won’t BELIEVE what happens next!”', ex:'“This ONE trick SHOCKED doctors!”' },
    { term:'Misinformation', def:'False information spread by people who don’t realize it’s wrong.', simple:'Wrong info shared by mistake — the person thought it was true.', ex:'Resharing a fake health tip you believed.' },
    { term:'Disinformation', def:'False information spread on purpose to deceive.', simple:'Lies spread deliberately to fool people.', ex:'A made-up story planted to trick voters.' },
    { term:'Credible', def:'Trustworthy and believable, backed by evidence and expertise.', simple:'A source you can rely on — it knows its stuff and shows its proof.', ex:'A health agency citing real studies is credible.' },
    { term:'Fact', def:'A statement that can be checked and proven true or false.', simple:'Something you can verify. “Water boils at 100°C” is a fact.', ex:'“The library opens at 9 a.m.” — checkable.' },
    { term:'Opinion', def:'A personal belief or judgment that can’t be proven true or false.', simple:'What someone thinks or feels — not something you can fact-check.', ex:'“Pizza is the best food” is an opinion.' },
    { term:'Lateral Reading', def:'Checking a claim by leaving the page and looking at OTHER trusted sources.', simple:'Open new tabs. Instead of trusting a site’s own words, see what others say about it.', ex:'Fact-checkers do this constantly.' },
    { term:'Satire', def:'Writing that uses humor or exaggeration to make a point — not meant literally.', simple:'A joke or spoof. Some “news” sites are comedy, but people mistake them for real.', ex:'The Onion writes fake news for laughs.' },
    { term:'Peer Review', def:'When other experts check a study before it’s published.', simple:'A study that other scientists inspected for mistakes — a mark of trust.', ex:'“Peer-reviewed” studies are more reliable.' },
    { term:'Propaganda', def:'Information, often biased or misleading, used to promote a cause or viewpoint.', simple:'Persuasion pushed hard for one side, often skipping the facts.', ex:'Wartime posters urging you to enlist.' },
    { term:'Reverse Image Search', def:'A tool that finds where a photo originally came from.', simple:'Upload a picture and the search shows its true source and date.', ex:'Reveals when an “old” photo is reused with a fake caption.' }
  ],

  /* ───── GAME 1 · REAL OR CLICKBAIT? ───── */
  HEADLINES: [
    { headline:'You’ll NEVER guess what this dog did next — #3 will SHOCK you!',
      article:'A golden retriever in Ohio learned to fetch the morning newspaper. Its owner thinks it’s adorable.',
      verdict:'Clickbait', why:'The headline promises shocking, mysterious content, but the story is a small, ordinary one. The hype is just there to get clicks.' },
    { headline:'City report: household recycling rose 12% last year',
      article:'According to the city’s annual report, household recycling increased 12% in 2023, thanks to new curbside bins.',
      verdict:'Fair', why:'The headline states exactly what the article shows, with a specific, checkable number and no exaggeration.' },
    { headline:'Scientists CONFIRM chocolate cures every disease!',
      article:'A small study found dark chocolate may slightly improve mood in some adults. The researchers say much more study is needed.',
      verdict:'Clickbait', why:'“Cures every disease” wildly overstates a small, cautious finding that’s only about mood.' },
    { headline:'Local library extends weekend hours starting in May',
      article:'The Riverside Library announced it will open two hours earlier on Saturdays beginning May 1.',
      verdict:'Fair', why:'The headline matches the article’s facts exactly, with no hype or missing details.' },
    { headline:'This ONE food is SECRETLY killing you — doctors are terrified!',
      article:'Nutritionists recommend eating less added sugar as part of a balanced diet.',
      verdict:'Clickbait', why:'Fear-words like “secretly killing you” turn ordinary advice (eat less sugar) into a scary hook.' },
    { headline:'Study links daily walks to better sleep, researchers say',
      article:'A university study found people who walked 30 minutes a day reported falling asleep faster. The authors note it is just one study.',
      verdict:'Fair', why:'The headline reflects the study and even keeps the careful “researchers say.” It doesn’t overpromise.' },
    { headline:'Everyone is QUITTING this app — here’s the SHOCKING reason',
      article:'A survey found 3% of users tried a competing app last month. The large majority stayed.',
      verdict:'Clickbait', why:'“Everyone is quitting” flatly contradicts the article, where most users actually stayed.' },
    { headline:'School board to vote on new start time next week',
      article:'The board will vote Tuesday on a proposal to push the first bell 30 minutes later. No decision has been made yet.',
      verdict:'Fair', why:'The headline accurately says a vote is coming and doesn’t claim the outcome.' },
    { headline:'Doctors HATE this teen — miracle trick melts homework stress instantly!',
      article:'A high-schooler shared that making a to-do list helps her feel less overwhelmed before tests.',
      verdict:'Clickbait', why:'A sensible tip (make a list) is dressed up as a “miracle trick doctors hate” to bait clicks.' },
    { headline:'Town plants 500 trees in new park project',
      article:'Volunteers and the parks department planted 500 saplings along the river this spring as part of a shade project.',
      verdict:'Fair', why:'A calm, specific headline that exactly matches the article — no exaggeration.' }
  ],

  /* ───── GAME 2 · SPOT THE RED FLAGS ───── */
  RED_FLAGS: [
    { key:'author',  label:'No author is named' },
    { key:'caps',    label:'ALL-CAPS, emotional hype' },
    { key:'date',    label:'No date on the post' },
    { key:'evidence',label:'No evidence, links, or sources' },
    { key:'url',     label:'A weird or fake-looking web address' },
    { key:'toogood', label:'A claim too good (or too shocking) to be true' },
    { key:'selling', label:'It’s trying to sell you something' }
  ],
  POSTS: [
    { headline:'DOCTORS HATE HIM! Teen’s ONE weird trick melts fat overnight!',
      meta:'MiracleHealthTruth.co · no author · no date',
      body:'You won’t BELIEVE the results!!! Thousands say it’s the greatest discovery EVER. Order the secret formula NOW before it’s BANNED forever!',
      flags:['author','caps','date','evidence','url','toogood','selling'] },
    { headline:'City council approves new bike lanes on Main Street',
      meta:'The Riverside Times · by Elena Cho · March 4, 2024',
      body:'The council voted 6–1 on Tuesday to add protected bike lanes. According to the city’s transportation report, the change is expected to reduce crashes. A public comment period runs through April.',
      flags:[] },
    { headline:'Scientists SHOCKED: chocolate makes you a genius overnight',
      meta:'BuzzFactNow.net · no author · no date',
      body:'A study (that we can’t actually link to) supposedly shows chocolate raises IQ by 50 points instantly. Experts everywhere are STUNNED!',
      flags:['author','caps','date','evidence','url','toogood'] },
    { headline:'Aliens spotted over downtown, anonymous witness says',
      meta:'MysteryWatch blog · Anonymous · posted “recently”',
      body:'An anonymous source claims to have seen a UFO last night. No photos or other witnesses have come forward.',
      flags:['author','date','evidence'] },
    { headline:'MELT 20 POUNDS in a WEEK with this celebrity’s secret tea!',
      meta:'SlimSecretsShop.co · sponsored',
      body:'A superstar SWEARS by this tea — no diet, no exercise! Limited stock! Order today before it sells out!!!',
      flags:['caps','author','date','evidence','url','toogood','selling'] },
    { headline:'School announces spring concert date',
      meta:'Lincoln Middle School · by the Music Dept. · April 2, 2024',
      body:'The spring concert will be held May 15 at 7 p.m. in the gym. Tickets are free, and a full program is posted on the school website.',
      flags:[] }
  ],

  /* ───── GAME 3 · SOURCE SHOWDOWN ───── */
  SOURCE_Q: [
    { q:'You want to know if a new medicine is safe. Which source do you trust most?',
      options:[
        { t:'A national health agency (like the FDA or CDC) website', best:true },
        { t:'A random influencer’s sponsored post', best:false },
        { t:'A comment under a video', best:false }
      ], why:'A health agency reviews the evidence and has no product to sell. The influencer is paid, and a comment is just one person’s opinion.' },
    { q:'You’re writing about the causes of a historical war. Best source?',
      options:[
        { t:'A history book by a university historian', best:true },
        { t:'A meme you saw online', best:false },
        { t:'A random forum rant', best:false }
      ], why:'A historian’s book is researched and reviewed. Memes and rants aren’t checked for accuracy.' },
    { q:'Did a celebrity really say that quote? Best source?',
      options:[
        { t:'A video or transcript of them actually saying it', best:true },
        { t:'A screenshot with no source', best:false },
        { t:'“My friend told me they said it”', best:false }
      ], why:'The original recording is the surest proof. Screenshots are easy to fake, and hearsay isn’t evidence.' },
    { q:'You need to know the exact wording of a new school rule. Best source?',
      options:[
        { t:'The official school handbook or website', best:true },
        { t:'A rumor going around the hallway', best:false },
        { t:'A friend’s quick summary', best:false }
      ], why:'Go straight to the official document — rumors and summaries drift from the real text.' },
    { q:'Is a viral health tip actually true? Best source?',
      options:[
        { t:'A doctor or medical site that cites studies', best:true },
        { t:'The same viral post, reshared by lots of people', best:false },
        { t:'A website selling the “cure”', best:false }
      ], why:'A source that cites real studies is trustworthy. Repetition isn’t proof, and a seller has a motive to mislead.' },
    { q:'You want to know what really happened at an event you missed. Best source?',
      options:[
        { t:'Several independent news outlets reporting the same facts', best:true },
        { t:'One anonymous post', best:false },
        { t:'A satire (joke) website', best:false }
      ], why:'When independent outlets agree, the facts are solid. A single anonymous post or a joke site can mislead you.' },
    { q:'You’re checking a statistic for a project. Best source?',
      options:[
        { t:'The original study or government data', best:true },
        { t:'A random blog that mentions a number', best:false },
        { t:'A number printed in an ad', best:false }
      ], why:'Trace a statistic to its original source. Blogs and ads can twist or invent numbers.' },
    { q:'You want today’s weather forecast. Best source?',
      options:[
        { t:'The national weather service', best:true },
        { t:'A years-old blog post about weather', best:false },
        { t:'A guess from a stranger', best:false }
      ], why:'An official, up-to-date forecast beats an old post or a random guess.' }
  ],

  /* ───── GAME 4 · FACT-CHECK DETECTIVE ───── */
  VERIFY: [
    { claim:'A post claims a new law “bans all backpacks in schools.” It lists no source.',
      best:'Open a new tab and search trusted news outlets to see if any actually report it.',
      distractors:['Reshare it so your friends can warn everyone.','Read the comments to see if people agree.','Believe it — it already has thousands of likes.'],
      why:'Pros read “laterally” — they leave the post and check other trusted sources first. Likes and comments aren’t proof of anything.' },
    { claim:'A website you’ve never heard of claims a famous person just died.',
      best:'Check whether major, well-known news outlets are reporting the same thing.',
      distractors:['Assume it’s true because the site looks professional.','Share it fast so you’re the first to know.','Believe it because the headline is in all caps.'],
      why:'Huge news spreads across many outlets in minutes. If only one unknown site has it, be very skeptical — a slick design is easy to fake.' },
    { claim:'An article says “a new study proves it” but never links to the study.',
      best:'Search for the actual study to check that it exists and really says that.',
      distractors:['Trust it — studies are always right.','Ignore the missing link; it doesn’t matter.','Believe it because it sounds scientific.'],
      why:'A real study can be found and read. “A study says…” with no link is a classic trick — always look for the original.' },
    { claim:'A shocking quote is going viral as a screenshot.',
      best:'Look for a video or official transcript of the person actually saying it.',
      distractors:['Screenshots can’t be faked, so just trust it.','Share it before it gets deleted.','Judge it by how many times it’s been shared.'],
      why:'Screenshots are easy to fake or take out of context. Go to the original source to confirm what was really said.' },
    { claim:'You’re not sure if a website is trustworthy before believing it.',
      best:'Search the website’s name to see what OTHER sources say about it.',
      distractors:['Read the site’s own “About Us” — it’ll tell the truth.','Trust it if the design looks clean and modern.','Decide based on how many ads it has.'],
      why:'Don’t rely only on what a site says about itself. Read laterally — see what independent sources say about its reputation.' },
    { claim:'A dramatic photo claims to show a flood in your town today.',
      best:'Do a reverse image search to find where and when the photo really came from.',
      distractors:['Assume the caption is accurate.','Share it right away to warn people.','Trust it because it looks so dramatic.'],
      why:'Old or unrelated photos are often reused with fake captions. A reverse image search reveals the photo’s true origin.' }
  ]
};
