// Adds 50 quotes (from the jr-high history reader) to Quote Flip as window.HIST.QUOTES.
// Fetches portraits + life dates from Wikipedia/Wikidata. Keeps FIGURES & PASSAGES.
'use strict';
const fs=require('fs');
const OUT='/Users/traviswilber/Claude-Projects/math-app/history';
const IMGDIR=OUT+'/img';
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const UA='LearnZoneEducationalApp/1.0 (https://tw-origami.github.io; traviswilber@gmail.com)';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function J(u){for(let a=0;a<4;a++){try{const r=await fetch(u,{headers:{'User-Agent':UA,'accept':'application/json'}});if(r.status===429){await sleep(1500*(a+1));continue;}if(!r.ok)return null;return r.json();}catch(e){await sleep(600);}}return null;}
async function BIN(u){for(let a=0;a<4;a++){try{const r=await fetch(u,{headers:{'User-Agent':UA}});if(r.status===429){await sleep(1500*(a+1));continue;}if(!r.ok)return null;return Buffer.from(await r.arrayBuffer());}catch(e){await sleep(600);}}return null;}
const parseYear=t=>{if(!t)return null;const m=t.match(/^([+-])(\d+)/);if(!m)return null;const y=parseInt(m[2],10);return m[1]==='-'?-y:y;};
function eraLabel(b,d){ if(b==null) return null;
  const f=y=>y<0?(-y)+'':(''+y);
  if(d!=null){ const bce=b<0; return f(b)+'–'+f(d)+(bce?' BCE':''); }
  return 'born '+f(b); }

// [name, wikiOverride|null, country, flag, role, status, pron|null, quote, bio, story]
const Q = [
 ['Socrates',null,'Greece','🇬🇷','Philosopher','paraphrase','SOCK-ruh-teez',
  'The only true wisdom is in knowing you know nothing.',
  'Socrates was an ancient Greek philosopher from Athens. He did not write books, but became famous because his student Plato wrote about his conversations. He asked people hard questions about courage, justice, and truth, and his way of questioning still shapes classrooms and debates today.',
  'This line summarizes Socrates’ idea in Plato’s Apology: he said he was wise only because he understood how little he truly knew. In Athens, many powerful people claimed certainty, while Socrates showed that real learning starts with humility and questioning.'],
 ['Plato',null,'Greece','🇬🇷','Philosopher','good','PLAY-toh',
  'The beginning is the most important part of the work.',
  'Plato was a Greek philosopher and student of Socrates. He founded the Academy, one of the earliest famous schools in the Western world, and wrote dialogues about government, education, and how people should live. His book The Republic influenced ideas about justice for over 2,000 years.',
  'This comes from Plato’s thinking about education and character. He believed early habits shape the kind of person someone becomes, which is why the beginning of training matters so much. Ancient Greeks treated education as a way to build good citizens, not just memorize facts.'],
 ['Aristotle',null,'Greece','🇬🇷','Philosopher','misattributed','AIR-ih-stot-ul',
  'Knowing yourself is the beginning of all wisdom.',
  'Aristotle was Plato’s student and later taught Alexander the Great. He studied almost everything — animals, government, logic, poetry, and science — and created systems for observing and explaining the world that later thinkers built on for centuries.',
  'The idea fits Aristotle’s interest in self-knowledge, but the exact wording isn’t safely his. It really echoes the ancient Greek saying “Know thyself,” carved at Delphi — a reminder that wisdom includes understanding your own strengths, limits, and choices.'],
 ['Archimedes',null,'Greece','🇬🇷','Mathematician','good','ar-kih-MEE-deez',
  'Give me a place to stand, and I will move the Earth.',
  'Archimedes was a Greek mathematician, inventor, and engineer from Syracuse. He studied levers, pulleys, floating objects, and geometry, showing that math could explain machines and the physical world. His discoveries influenced engineering and science for centuries.',
  'This line is connected to his work with levers. He was making a dramatic point: with the right support point, a lever gives a person enormous power. He didn’t really plan to move the Earth — he meant that knowledge and tools can multiply human strength.'],
 ['Marcus Aurelius',null,'Rome','🇮🇹','Emperor','paraphrase','MAR-kus aw-REE-lee-us',
  'The happiness of your life depends upon the quality of your thoughts.',
  'Marcus Aurelius was a Roman emperor and Stoic philosopher. He ruled during wars and disease, yet kept private notes about self-control, duty, and clear thinking that became the book Meditations. He is remembered for trying to connect power with discipline and responsibility.',
  'The quote summarizes Stoic philosophy: you can’t control everything that happens, but you can work on how you judge and respond to it. Marcus wrote these ideas for himself, not for a speech — even an emperor needed reminders to manage fear, anger, and pride.'],
 ['Cicero',null,'Rome','🇮🇹','Writer','paraphrase','SISS-uh-roh',
  'A room without books is like a body without a soul.',
  'Cicero was a Roman lawyer, writer, politician, and public speaker during the final years of the Roman Republic. His speeches and writings preserved many ideas about law, citizenship, and public duty that students still study to understand Roman politics.',
  'This grew from Cicero’s love of books — after his library was arranged he wrote that his house seemed to have “acquired a soul.” The modern wording isn’t a direct ancient quote, but it reflects how educated Romans saw books as part of a meaningful life.'],
 ['Laozi',null,'China','🇨🇳','Philosopher','good','LOW-dzuh',
  'A journey of a thousand miles begins with a single step.',
  'Laozi (also spelled Lao Tzu) is traditionally known as the founder of Daoism and is connected with the Dao De Jing, a short but influential text about nature, humility, and balance. His ideas shaped Chinese philosophy, art, and government.',
  'The quote teaches that big goals start with small actions. In Daoist thought, people often cause trouble by forcing things too hard, while wisdom begins with simple, natural steps. The saying has lasted because it turns a huge challenge into something you can actually begin.'],
 ['Sun Tzu','Sun_Tzu','China','🇨🇳','Strategist','misattributed','soon dzoo',
  'In the midst of chaos, there is also opportunity.',
  'Sun Tzu is the traditional author of The Art of War, an ancient Chinese book about strategy. His ideas focused on planning, discipline, knowing yourself and your opponent, and winning with the least unnecessary conflict. The book influenced leaders and thinkers worldwide.',
  'The line sounds like Sun Tzu because The Art of War teaches leaders to stay calm and find advantages in confusing situations — but the exact sentence is really a modern summary, not a direct quote. A safer lesson: strategy means understanding disorder before acting.'],
 ['Gautama Buddha','Gautama_Buddha','India / Nepal','🇮🇳','Teacher','paraphrase','GAW-tuh-muh BOO-duh',
  'What we think, we become.',
  'Gautama Buddha was a spiritual teacher in ancient South Asia who taught about suffering, compassion, mindfulness, and inner freedom. Buddhism grew from his teachings and spread across Asia and the world, influencing religion, philosophy, and art.',
  'This is a simple modern version of a Buddhist teaching about the power of the mind (a common translation from the Dhammapada is “All that we are is the result of what we have thought”). It means repeated thoughts and actions shape character over time.'],
 ['Rumi',null,'Persia','🇮🇷','Poet','attributed','ROO-mee',
  'Raise your words, not your voice. It is rain that grows flowers, not thunder.',
  'Rumi was a Persian poet, scholar, and Sufi mystic who wrote about love, faith, grief, and the search for meaning. His work became important across Persian, Turkish, and South Asian literature, and today he is one of the most widely read poets in the world.',
  'The quote teaches gentle persuasion over anger, which fits the spirit of Rumi’s poetry, where love is stronger than force. Because he wrote in Persian and many popular versions are modern translations, it’s best treated as commonly attributed rather than exact wording.'],
 ['Malala Yousafzai',null,'Pakistan','🇵🇰','Activist','good','muh-LAH-lah yoo-SUF-zye',
  'One child, one teacher, one book, one pen can change the world.',
  'Malala Yousafzai grew up in Pakistan’s Swat Valley and spoke up for girls’ education when the Taliban tried to stop girls from going to school. She survived an attack in 2012 and, in 2014, became the youngest person ever to receive the Nobel Peace Prize.',
  'She said this at the United Nations in 2013, on her 16th birthday. Having been attacked for defending education, she used the world stage to argue that books and schools are stronger than fear — turning education into a peaceful form of power.'],
 ['Mother Teresa',null,'Albania / India','🇦🇱','Humanitarian','attributed',null,
  'Not all of us can do great things. But we can do small things with great love.',
  'Mother Teresa was born to an Albanian family in what is now North Macedonia and became a Catholic nun in India. She founded the Missionaries of Charity, serving poor and sick people, especially in Kolkata, and won the Nobel Peace Prize in 1979.',
  'This reflects her message that service does not have to look grand or famous — she often spoke about helping one person at a time. It connects to a broader idea that moral action can happen through small, daily choices.'],
 ['Anne Frank',null,'Germany / Netherlands','🇳🇱','Writer','good',null,
  'How wonderful it is that nobody need wait a single moment before starting to improve the world.',
  'Anne Frank was a Jewish teenager who hid with her family in Amsterdam during the Holocaust. While in hiding from the Nazis, she wrote a diary about hope, family, and growing up. She died in a concentration camp, but her diary became one of the most important records of World War II.',
  'Anne wrote this while Jewish people were being persecuted by Nazi Germany. It is powerful because it comes from someone with very little control over her situation, who still believed people could choose goodness — letting readers see history through one young voice.'],
 ['Helen Keller',null,'United States','🇺🇸','Activist','good',null,
  'Alone we can do so little; together we can do so much.',
  'Helen Keller lost her sight and hearing as a young child. With the help of her teacher Anne Sullivan, she learned to communicate, read, write, and graduate from college. She became an author, speaker, and activist for disability rights and women’s voting rights.',
  'The quote reflects how her achievements depended on partnership, especially with Anne Sullivan. It also connects to her activism: she believed society should work together so people with disabilities could learn and take part fully. It’s about access and human dignity.'],
 ['Rosa Parks',null,'United States','🇺🇸','Activist','good',null,
  'You must never be fearful about what you are doing when it is right.',
  'Rosa Parks was a civil rights activist in Montgomery, Alabama. Famous for refusing to give up her bus seat to a white passenger in 1955, she had already been working for justice with the NAACP. Her arrest helped spark the Montgomery Bus Boycott.',
  'This reflects the courage needed to resist unjust segregation laws. Her action was part of a long struggle against racial discrimination — the lesson being that doing what is right can be scary, but history often changes because ordinary people take principled risks.'],
 ['Harriet Tubman',null,'United States','🇺🇸','Freedom Fighter','attributed',null,
  'Every great dream begins with a dreamer.',
  'Harriet Tubman escaped slavery and then returned many times to help others escape through the Underground Railroad. During the Civil War she served the Union as a scout, nurse, and spy, and later supported women’s voting rights.',
  'The exact quote is hard to prove, but the idea fits her life: she imagined freedom before it was safe to reach for it, then acted with discipline and courage. It’s a reminder that enslaved people were not passive — many planned, escaped, and fought back.'],
 ['Frederick Douglass',null,'United States','🇺🇸','Abolitionist','good',null,
  'Once you learn to read, you will be forever free.',
  'Frederick Douglass was born enslaved in Maryland and escaped to freedom, becoming one of the most powerful writers and abolitionists in American history. His autobiographies exposed the cruelty of slavery and argued for Black freedom, education, and citizenship.',
  'Douglass secretly learned to read when enslavers tried to keep enslaved people from education. Reading helped him understand the system that oppressed him and gave him tools to argue against it — which is why literacy was so dangerous to slavery.'],
 ['Sojourner Truth',null,'United States','🇺🇸','Activist','good',null,
  'Truth is powerful and it prevails.',
  'Sojourner Truth was born enslaved in New York and became a traveling speaker for abolition and women’s rights. She changed her name to reflect her mission to speak truth, and her speeches challenged racism, sexism, and the idea that women should stay silent.',
  'The quote matches her identity as someone who used speech as a weapon against injustice. She lived when Black women were often denied a public voice, and her words forced audiences to face truths they wanted to ignore.'],
 ['Susan B. Anthony',null,'United States','🇺🇸','Activist','good',null,
  'Failure is impossible.',
  'Susan B. Anthony was a major leader in the movement for women’s voting rights in the United States. She organized speeches, petitions, and legal challenges, and was even arrested for voting in 1872, before women had the legal right to vote nationally.',
  'She used this phrase near the end of her life as a rallying cry for women’s suffrage. She didn’t live to see the 19th Amendment pass in 1920, but her organizing helped make it possible — showing how movements can take decades of persistence.'],
 ['Eleanor Roosevelt',null,'United States','🇺🇸','Leader','good',null,
  'No one can make you feel inferior without your consent.',
  'Eleanor Roosevelt was First Lady of the United States from 1933 to 1945, but far more than a president’s wife. She wrote, traveled, spoke publicly, supported civil rights, and helped shape the Universal Declaration of Human Rights after World War II.',
  'The quote reflects her lifelong work against fear and self-doubt. She was often criticized for being outspoken as a woman in politics. The history behind it is about confidence and human rights: prejudice should not define a person’s worth.'],
 ['Franklin D. Roosevelt',null,'United States','🇺🇸','President','good',null,
  'The only thing we have to fear is fear itself.',
  'Franklin D. Roosevelt (FDR) was president during the Great Depression and most of World War II. He created New Deal programs to help the economy and led the United States through a global war.',
  'FDR said this in his first inaugural address in 1933, when banks were failing and many Americans had lost jobs and savings. He was telling people that panic itself could make the crisis worse — an example of how words can calm a country and encourage action.'],
 ['John F. Kennedy',null,'United States','🇺🇸','President','good',null,
  'Ask not what your country can do for you — ask what you can do for your country.',
  'John F. Kennedy was the 35th U.S. president, serving during the Cold War as the U.S. and Soviet Union competed in politics, weapons, and space. His presidency included the Peace Corps and support for the space program.',
  'Kennedy said this in his 1961 inaugural address, asking Americans to think about public service during a tense time. It helped inspire programs like the Peace Corps and became a famous call to civic duty.'],
 ['Winston Churchill',null,'England','🇬🇧','Leader','good',null,
  'Never give in — never, never, never, never.',
  'Winston Churchill was Britain’s prime minister during World War II, remembered for speeches that helped Britain keep going against Nazi Germany. He was also a writer and historian whose long career included both major achievements and serious mistakes.',
  'The popular “Never give up” version is too simplified. Churchill spoke these words at Harrow School in 1941, telling students never to give in except to honor and good sense — a lesson about perseverance, but also judgment.'],
 ['Cesar Chavez',null,'United States','🇺🇸','Labor Leader','good','SEH-zar CHAH-vez',
  'Sí, se puede — Yes, it can be done.',
  'Cesar Chavez was a labor leader and civil rights activist who helped organize farmworkers, especially Mexican American and Filipino American workers. He co-founded the United Farm Workers and used strikes, boycotts, and nonviolent protest to demand fair pay and safer conditions.',
  '“Sí, se puede” became a rallying cry for farmworker organizing. It helped people believe change was possible when growers and politicians seemed too powerful — showing how a short slogan can unite people in a long struggle.'],
 ['Golda Meir',null,'Israel','🇮🇱','Leader','attributed','GOHL-duh my-EER',
  'Trust yourself. Create the kind of self that you will be happy to live with.',
  'Golda Meir was one of the founders of Israel and later its prime minister — one of the first women to lead a modern nation. Born in Kyiv and raised partly in the United States, she moved to the region as a young adult, and her leadership was shaped by war and diplomacy.',
  'This is usually shared as advice about character and responsibility. Meir lived through intense conflict and made hard choices as a leader — it can spark discussion about how leaders balance confidence with the consequences of their decisions.'],
 ['Charles Darwin',null,'England','🇬🇧','Scientist','misattributed',null,
  'It is not the strongest that survives, but the one most adaptable to change.',
  'Charles Darwin was a naturalist who studied plants, animals, and fossils. His voyage on the HMS Beagle helped him develop the theory of evolution by natural selection, and his book On the Origin of Species changed biology forever.',
  'This one sounds like evolution, but Darwin did not write it — it began as a modern summary by a business professor and then got repeated as a direct quote. It’s a great reminder that even famous quotes need evidence.'],
 ['Stephen Hawking',null,'England','🇬🇧','Physicist','good',null,
  'Look up at the stars and not down at your feet.',
  'Stephen Hawking was a British physicist who studied black holes, gravity, and the universe. He lived with ALS, which gradually limited his movement, yet kept writing and teaching using technology. His book A Brief History of Time brought big science questions to the public.',
  'Hawking used this to encourage curiosity and hope — keep asking big questions even when life is hard. His impact wasn’t only scientific; he also showed how technology and determination could help someone share world-changing ideas.'],
 ['Louis Pasteur',null,'France','🇫🇷','Scientist','good','LOO-ee pass-TUR',
  'Chance favors the prepared mind.',
  'Louis Pasteur was a French scientist whose work helped prove that germs can cause disease. He developed pasteurization, improved vaccines, and changed medicine and food safety by showing how invisible microbes affect everyday life.',
  'Pasteur meant that luck matters, but only prepared people notice and understand what luck reveals. His career proves the point: careful experiments turned surprising observations into lifesaving knowledge.'],
 ['Benjamin Franklin',null,'United States','🇺🇸','Inventor','attributed',null,
  'Tell me and I forget. Teach me and I remember. Involve me and I learn.',
  'Benjamin Franklin was a printer, writer, inventor, scientist, and founding figure of the United States. He studied electricity, invented practical devices, and served as a diplomat during the American Revolution, becoming a symbol of curiosity and self-improvement.',
  'The exact quote is hard to prove as Franklin’s, but it matches his belief in hands-on learning — he learned by experimenting, building, and debating. The idea fits the Enlightenment’s trust in reason and experience over memorizing authorities.'],
 ['George Washington Carver',null,'United States','🇺🇸','Scientist','attributed',null,
  'Education is the key to unlock the golden door of freedom.',
  'George Washington Carver was an agricultural scientist and educator born into slavery near the end of the Civil War. He became famous for helping Southern farmers improve soil and grow crops like peanuts and sweet potatoes, and taught at Tuskegee Institute.',
  'The quote fits his life because education opened doors that slavery and racism tried to close. His work wasn’t just about peanuts — it helped farmers survive and care for the land, connecting learning with independence and opportunity.'],
 ['Katherine Johnson',null,'United States','🇺🇸','Mathematician','good',null,
  'Like what you do, and then you will do your best.',
  'Katherine Johnson was a NASA mathematician whose calculations helped send astronauts into space and bring them home safely. She succeeded during a time when Black women faced both racism and sexism in science and government.',
  'Johnson emphasized loving the work and doing it carefully. Her story shows math can have real consequences — a correct calculation could help keep astronauts alive — and that excellence is attention and persistence, not only talent.'],
 ['Ada Lovelace',null,'England','🇬🇧','Mathematician','good',null,
  'Imagination is the discovering faculty.',
  'Ada Lovelace was a mathematician and writer who worked with Charles Babbage’s early mechanical computer designs. She imagined machines might do more than simple arithmetic and described an algorithm for one — which is why many call her the first computer programmer.',
  'Lovelace valued imagination as part of science and math. In the 1800s many saw machines as only mechanical tools, but she imagined broader possibilities — showing computing history began with people thinking creatively, long before laptops.'],
 ['Jane Goodall',null,'England','🇬🇧','Scientist','good',null,
  'What you do makes a difference, and you have to decide what kind of difference you want to make.',
  'Jane Goodall is a primatologist and conservationist best known for studying chimpanzees in Tanzania. She observed behaviors that changed how scientists understood animals — including tool use — and later became a global advocate for conservation and youth action.',
  'Her quote grows out of decades of watching how human choices affect animals and ecosystems. She wants people to understand that everyday actions add up, and her work helped build modern conservation awareness.'],
 ['Carl Sagan',null,'United States','🇺🇸','Astronomer','attributed','SAY-gun',
  'Somewhere, something incredible is waiting to be known.',
  'Carl Sagan was an astronomer, writer, and science communicator who helped study planets, supported space exploration, and hosted the TV series Cosmos. He became famous for making the universe feel huge, mysterious, and understandable.',
  'The quote captures Sagan’s belief that science is a search, not just a list of facts — wonder and skepticism at the same time. He helped make science communication part of popular culture during the space age.'],
 ['Neil Armstrong',null,'United States','🇺🇸','Astronaut','good',null,
  'That’s one small step for [a] man, one giant leap for mankind.',
  'Neil Armstrong was an American astronaut, test pilot, and engineer. In 1969 he became the first person to walk on the Moon during NASA’s Apollo 11 mission — the result of years of work by thousands of people.',
  'He said this as he stepped onto the Moon on July 20, 1969. He intended “a man” (one individual) compared with all humanity. It framed the Moon landing as both a personal step and a human achievement during the Cold War space race.'],
 ['Alexander Graham Bell',null,'Scotland / USA','🇬🇧','Inventor','attributed',null,
  'When one door closes, another opens.',
  'Alexander Graham Bell was an inventor, teacher, and scientist best known for developing the telephone. He also worked with deaf students and studied sound and speech, and his inventions transformed how people connect across distance.',
  'The quote is usually used to teach resilience after disappointment. Bell’s life involved experiments, failures, and competition with other inventors — it fits the inventive mindset that a failed path can lead to a new discovery.'],
 ['Roald Amundsen',null,'Norway','🇳🇴','Explorer','attributed',null,
  'Adventure is just bad planning.',
  'Roald Amundsen was a Norwegian polar explorer who led the first successful expedition to reach the South Pole in 1911. He was known for careful preparation and for learning Arctic survival skills from Indigenous peoples.',
  'The quote sounds funny, but it points to his real strength: preparation. His South Pole success came from planning routes, food, dogs, and clothing carefully — exploration is exciting, but survival often depends on boring details done well.'],
 ['Maya Angelou',null,'United States','🇺🇸','Poet','good',null,
  'Try to be a rainbow in someone’s cloud.',
  'Maya Angelou was a poet, memoirist, performer, and civil rights activist. Her book I Know Why the Caged Bird Sings told the story of her childhood and became a major work in American literature, writing about racism, dignity, and hope.',
  'Angelou often used vivid images to teach moral lessons. A rainbow in someone’s cloud means becoming a source of hope during another person’s hard time — part of her message that people can survive pain and still choose generosity.'],
 ['Dr. Seuss','Dr._Seuss','United States','🇺🇸','Author','good',null,
  'The more that you read, the more things you will know.',
  'Theodor Geisel, known as Dr. Seuss, wrote and illustrated many famous children’s books. His playful rhymes and invented words helped young readers enjoy language, though some of his earlier work also reflects outdated stereotypes worth discussing honestly.',
  'This quote comes from I Can Read With My Eyes Shut! It teaches that reading expands what a person can understand and imagine — and shows how children’s books can shape culture and learning for generations.'],
 ['Mark Twain',null,'United States','🇺🇸','Writer','misattributed',null,
  'Kindness is a language which the deaf can hear and the blind can see.',
  'Mark Twain, born Samuel Clemens, was an American writer and humorist. He wrote The Adventures of Tom Sawyer and Adventures of Huckleberry Finn, using humor and sharp observation to explore American life and criticize hypocrisy and greed.',
  'This kind quote is popular, but it doesn’t sound like Twain’s sharper style and isn’t well sourced to his writing. Twain became a magnet for clever sayings — a good reminder to check attributions before trusting them.'],
 ['Vincent van Gogh',null,'Netherlands','🇳🇱','Painter','attributed','van GOH',
  'Great things are done by a series of small things brought together.',
  'Vincent van Gogh was a Dutch painter whose bold colors and brushstrokes helped shape modern art. He struggled with poverty and mental illness and sold very little art during his lifetime, but paintings like The Starry Night became world famous after his death.',
  'This fits his working life: he created hundreds of drawings and paintings through practice and close observation. It helps us understand that masterpieces are usually built from many small studies, choices, and attempts.'],
 ['Pablo Picasso',null,'Spain','🇪🇸','Painter','good','pih-KAH-soh',
  'Every child is an artist. The problem is how to remain an artist once we grow up.',
  'Pablo Picasso was a Spanish artist who helped create Cubism and changed modern painting and sculpture. His work experimented with shape and emotion, and his painting Guernica became a powerful antiwar symbol.',
  'The quote reflects his belief that children create freely before they learn to fear mistakes. His art often broke rules on purpose — part of modern art’s big shift, where artists were no longer expected only to copy reality.'],
 ['Ludwig van Beethoven',null,'Germany','🇩🇪','Composer','attributed','BAY-toh-ven',
  'Music is a higher revelation than all wisdom and philosophy.',
  'Beethoven was a German composer and pianist whose music helped move classical music into the Romantic era. He continued composing even as he lost his hearing, and his symphonies and sonatas are still performed around the world.',
  'The quote captures his belief that music could express feelings and truths that words could not. His life gives it extra force because he created some of his greatest works while deaf — showing how art can become a way of thinking.'],
 ['Hokusai',null,'Japan','🇯🇵','Artist','good','HOH-koo-sye',
  'At seventy-three I learned a little about the real structure of nature.',
  'Katsushika Hokusai was a Japanese artist famous for woodblock prints, especially The Great Wave off Kanagawa. He worked during Japan’s Edo period, influenced later European artists, and kept changing his style throughout his long life.',
  'Hokusai wrote that only late in life did he begin to understand nature’s true forms, hoping to keep improving if he lived longer. It teaches lifelong learning — great artists often see themselves as still practicing, even after becoming masters.'],
 ['Rabindranath Tagore',null,'India','🇮🇳','Poet','good','ruh-BEEN-druh-naht tuh-GOR',
  'Let your life lightly dance on the edges of Time, like dew on the tip of a leaf.',
  'Rabindranath Tagore was an Indian poet, musician, educator, and thinker — the first non-European to win the Nobel Prize in Literature, in 1913. He wrote poems, songs, and plays, and founded a school that encouraged creativity and global learning.',
  'This comes from Tagore’s poetic view of life as delicate, beautiful, and temporary. He wrote during British colonial rule and thought deeply about freedom and the human spirit, using images to express big ideas about time and life.'],
 ['Muhammad Ali',null,'United States','🇺🇸','Boxer','good',null,
  'Don’t count the days; make the days count.',
  'Muhammad Ali was one of the greatest boxers in history and a major public figure. Known for speed, confidence, and courage outside the ring, he opposed the Vietnam War, lost boxing years because of it, and became a symbol of protest and self-belief.',
  'The quote reflects his attitude toward effort and purpose: don’t just wait for time to pass, use it well. It mattered in his life because his career was interrupted by conviction, yet he returned and stayed influential far beyond sports.'],
 ['Pelé','Pelé','Brazil','🇧🇷','Soccer Player','good','peh-LEH',
  'Success is no accident. It is hard work, perseverance, learning, and love of what you are doing.',
  'Pelé was a Brazilian soccer player considered one of the greatest athletes of all time. He helped Brazil win three World Cups and became a global symbol of soccer skill and joy, making him one of the first truly international sports superstars.',
  'The quote pushes back on the idea that talent alone creates success. Pelé had natural ability but also trained and handled pressure on the world’s biggest stage — sports heroes often represent discipline and national pride, not just trophies.'],
 ['Jesse Owens',null,'United States','🇺🇸','Athlete','good',null,
  'The battles that count aren’t the ones for gold medals. The struggles within yourself — that’s where it’s at.',
  'Jesse Owens was an American track and field athlete who won four gold medals at the 1936 Berlin Olympics. Those Games were held in Nazi Germany, where Adolf Hitler promoted racist ideas — and Owens’ victories challenged that propaganda on a global stage.',
  'The quote points beyond medals to inner courage and discipline. Owens faced racism at home in the U.S. as well as political pressure in Nazi Germany — showing how athletic achievement can become powerful when it challenges hateful ideas.'],
 ['Wilma Rudolph',null,'United States','🇺🇸','Athlete','good',null,
  'Never underestimate the power of dreams and the influence of the human spirit.',
  'Wilma Rudolph was an American sprinter who overcame childhood illness, including polio, to become an Olympic champion. At the 1960 Rome Olympics she won three gold medals and became a role model for athletes, women, and Black Americans during the Civil Rights era.',
  'The quote reflects her journey from serious physical challenges to world-class speed, during a time when segregation and sexism limited opportunities. It shows that personal determination matters — and so does overcoming society’s barriers.'],
 ['Jackie Robinson',null,'United States','🇺🇸','Baseball Player','good',null,
  'A life is not important except in the impact it has on other lives.',
  'Jackie Robinson was the first Black player in modern Major League Baseball, joining the Brooklyn Dodgers in 1947. He faced racist abuse but his success helped break baseball’s color barrier, and he later worked for civil rights and business opportunity.',
  'Robinson lived by the idea that achievement should help others. His baseball career was part of the larger fight against segregation — showing that courage can create a path for the people who come after you.'],
];

(async ()=>{
  fs.mkdirSync(IMGDIR,{recursive:true});
  // fetch qids for dates
  const wikiTitle=e=> (e[1]||e[0].replace(/ /g,'_'));
  const entries=Q.map(e=>({ name:e[0], wiki:wikiTitle(e), country:e[2], flag:e[3], role:e[4], status:e[5], pron:e[6], quote:e[7], bio:e[8], ctx:e[9] }));
  process.stdout.write('quotes: ');
  for(const e of entries){
    // portrait (reuse cached if present)
    const existing=fs.readdirSync(IMGDIR).find(f=>f.startsWith(slug(e.name)+'.'));
    if(existing){ e.img=existing; }
    else{
      const j=await J('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(e.wiki));
      const src=j&&j.thumbnail&&j.thumbnail.source;
      if(src){ const ext=(src.match(/\.(jpg|jpeg|png)/i)||['','jpg'])[1].toLowerCase(); const file=slug(e.name)+'.'+ext;
        const b=await BIN(src); if(b){ fs.writeFileSync(IMGDIR+'/'+file,b); e.img=file; } }
    }
    // dates via wikidata
    const pp=await J('https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&format=json&formatversion=2&titles='+encodeURIComponent(e.wiki));
    const qid=pp&&pp.query&&pp.query.pages&&pp.query.pages[0]&&pp.query.pages[0].pageprops&&pp.query.pages[0].pageprops.wikibase_item;
    if(qid){ const ent=await J('https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&format=json&ids='+qid);
      const c=ent&&ent.entities&&ent.entities[qid]&&ent.entities[qid].claims;
      const t=p=>c&&c[p]&&c[p][0]&&c[p][0].mainsnak.datavalue&&c[p][0].mainsnak.datavalue.value.time;
      e.eraLabel=eraLabel(parseYear(t('P569')), parseYear(t('P570'))); }
    process.stdout.write(e.img?'.':'o');
    await sleep(120);
  }
  console.log('\ngot '+entries.filter(e=>e.img).length+'/'+entries.length+' portraits, '+entries.filter(e=>e.eraLabel).length+' dated');

  const QUOTES=entries.map(e=>({ name:e.name, quote:e.quote, status:e.status, bio:e.bio, quoteCtx:e.ctx,
    img:e.img||null, flag:e.flag, country:e.country, eraLabel:e.eraLabel||null, role:e.role, pron:e.pron||null }));

  global.window={}; require(OUT+'/library.js'); const H=window.HIST;
  const out=`// MASTER HISTORY LIBRARY — figures, quotes, bios, and reading passages for the 3 games.
// Portraits in img/ are Wikipedia thumbnails (mostly public-domain historical images).
window.HIST = {
  FIGURES: ${JSON.stringify(H.FIGURES,null,0)},
  QUOTES: ${JSON.stringify(QUOTES,null,0)},
  PASSAGES: ${JSON.stringify(H.PASSAGES,null,0)}
};
`;
  fs.writeFileSync(OUT+'/library.js',out);
  console.log('wrote library.js — added QUOTES:', QUOTES.length, '| statuses:', JSON.stringify(QUOTES.reduce((a,q)=>{a[q.status]=(a[q.status]||0)+1;return a;},{})));
})();
