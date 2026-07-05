// MASTER HISTORY LIBRARY — figures, quotes, bios, and reading passages for the 3 games.
// Portraits in img/ are Wikipedia thumbnails (mostly public-domain historical images).
window.HIST = {
  FIGURES: [
 {
  "name": "Marie Curie",
  "slug": "marie_curie",
  "country": "Poland / France",
  "flag": "🇵🇱",
  "era": 1900,
  "eraLabel": "1867–1934",
  "role": "Scientist",
  "emoji": "🔬",
  "img": "marie_curie.jpg",
  "facts": [
   "Discovered the elements radium and polonium",
   "First person ever to win two Nobel Prizes",
   "Her research led to X-rays and cancer treatment"
  ],
  "quote": "Nothing in life is to be feared, it is only to be understood.",
  "bio": "A scientist born in Poland who worked in France. She discovered radioactive elements and won two Nobel Prizes — the first person ever to do so. Her work led to X-rays, though the radiation she studied also made her ill."
 },
 {
  "name": "Albert Einstein",
  "slug": "albert_einstein",
  "country": "Germany",
  "flag": "🇩🇪",
  "era": 1920,
  "eraLabel": "1879–1955",
  "role": "Scientist",
  "emoji": "🧠",
  "img": "albert_einstein.jpg",
  "facts": [
   "Created the theory of relativity",
   "Explained that energy equals mass times c squared (E=mc²)",
   "Won the Nobel Prize in Physics"
  ],
  "quote": "Imagination is more important than knowledge.",
  "bio": "A physicist who changed how we understand space, time, and gravity. His famous equation E=mc² and theory of relativity reshaped science. He fled Germany when the Nazis rose to power."
 },
 {
  "name": "Isaac Newton",
  "slug": "isaac_newton",
  "country": "England",
  "flag": "🇬🇧",
  "era": 1690,
  "eraLabel": "1643–1727",
  "role": "Scientist",
  "emoji": "🍎",
  "img": "isaac_newton.jpg",
  "facts": [
   "Described the law of gravity",
   "Wrote three laws of motion",
   "Built the first reflecting telescope"
  ],
  "quote": "If I have seen further, it is by standing on the shoulders of giants.",
  "bio": "An English scientist and mathematician who explained gravity and the laws of motion. His ideas became the foundation of modern physics."
 },
 {
  "name": "Leonardo da Vinci",
  "slug": "leonardo_da_vinci",
  "country": "Italy",
  "flag": "🇮🇹",
  "era": 1500,
  "eraLabel": "1452–1519",
  "role": "Artist & Inventor",
  "emoji": "🎨",
  "img": "leonardo_da_vinci.png",
  "facts": [
   "Painted the Mona Lisa",
   "Sketched flying machines centuries before airplanes",
   "Studied the human body through detailed drawings"
  ],
  "quote": "Learning never exhausts the mind.",
  "bio": "An Italian genius of the Renaissance who was both a great painter and an inventor. He filled notebooks with ideas for machines the world would not build for hundreds of years."
 },
 {
  "name": "Nikola Tesla",
  "slug": "nikola_tesla",
  "country": "Serbia",
  "flag": "🇷🇸",
  "era": 1900,
  "eraLabel": "1856–1943",
  "role": "Inventor",
  "emoji": "⚡",
  "img": "nikola_tesla.jpeg",
  "facts": [
   "Developed the AC electricity we use today",
   "Invented the induction motor",
   "Experimented with sending power wirelessly"
  ],
  "quote": "The present is theirs; the future, for which I really worked, is mine.",
  "bio": "A Serbian-American inventor whose alternating-current (AC) system powers our homes today. He was brilliant but died with little money despite his many inventions."
 },
 {
  "name": "Thomas Edison",
  "slug": "thomas_edison",
  "country": "United States",
  "flag": "🇺🇸",
  "era": 1900,
  "eraLabel": "1847–1931",
  "role": "Inventor",
  "emoji": "💡",
  "img": "thomas_edison.jpg",
  "facts": [
   "Invented a practical electric light bulb",
   "Created the phonograph to record sound",
   "Held over 1,000 patents"
  ],
  "quote": "Genius is one percent inspiration and ninety-nine percent perspiration.",
  "bio": "An American inventor whose light bulb, phonograph, and movie camera changed daily life. He was famous for never giving up after failed experiments."
 },
 {
  "name": "Ada Lovelace",
  "slug": "ada_lovelace",
  "country": "England",
  "flag": "🇬🇧",
  "era": 1840,
  "eraLabel": "1815–1852",
  "role": "Mathematician",
  "emoji": "💻",
  "img": "ada_lovelace.png",
  "facts": [
   "Wrote the first computer program",
   "Imagined computers could do more than just math",
   "A computer language is named after her"
  ],
  "quote": null,
  "bio": "An English mathematician who wrote instructions for an early mechanical computer — making her the world's first computer programmer, a century before modern computers."
 },
 {
  "name": "Galileo Galilei",
  "slug": "galileo_galilei",
  "country": "Italy",
  "flag": "🇮🇹",
  "era": 1610,
  "eraLabel": "1564–1642",
  "role": "Astronomer",
  "emoji": "🔭",
  "img": "galileo_galilei.jpg",
  "facts": [
   "Improved the telescope to study the night sky",
   "Discovered four moons orbiting Jupiter",
   "Was punished for teaching that Earth orbits the Sun"
  ],
  "quote": "And yet it moves.",
  "bio": "An Italian astronomer who used a telescope to prove Earth moves around the Sun. Powerful leaders put him on trial and kept him under house arrest for his ideas."
 },
 {
  "name": "George Washington Carver",
  "slug": "george_washington_carver",
  "country": "United States",
  "flag": "🇺🇸",
  "era": 1900,
  "eraLabel": "1864–1943",
  "role": "Scientist",
  "emoji": "🥜",
  "img": "george_washington_carver.jpg",
  "facts": [
   "Found hundreds of uses for the peanut",
   "Taught farmers how to enrich tired soil",
   "Was born into slavery and became a famous scientist"
  ],
  "quote": null,
  "bio": "An American scientist born into slavery who became a leading agricultural researcher. He helped farmers by finding new uses for crops like peanuts and sweet potatoes."
 },
 {
  "name": "Katherine Johnson",
  "slug": "katherine_johnson",
  "country": "United States",
  "flag": "🇺🇸",
  "era": 1960,
  "eraLabel": "1918–2020",
  "role": "Mathematician",
  "emoji": "🚀",
  "img": "katherine_johnson.jpg",
  "facts": [
   "Calculated flight paths for NASA astronauts",
   "Helped send the first Americans safely to space",
   "Broke barriers as a Black woman in science"
  ],
  "quote": null,
  "bio": "An American mathematician whose calculations sent astronauts to space and back. She succeeded at NASA at a time when Black women faced great unfairness."
 },
 {
  "name": "Al-Khwarizmi",
  "slug": "al_khwarizmi",
  "country": "Persia",
  "flag": "🇮🇷",
  "era": 820,
  "eraLabel": "c. 780–850",
  "role": "Mathematician",
  "emoji": "🔢",
  "img": "al_khwarizmi.jpg",
  "facts": [
   "Helped create the branch of math called algebra",
   "The word \"algorithm\" comes from his name",
   "Spread the number system we use today"
  ],
  "quote": null,
  "bio": "A Persian scholar in Baghdad who helped invent algebra. So much of modern math and computing traces back to his work that the word 'algorithm' comes from his name."
 },
 {
  "name": "Zheng He",
  "slug": "zheng_he",
  "country": "China",
  "flag": "🇨🇳",
  "era": 1410,
  "eraLabel": "1371–1433",
  "role": "Explorer",
  "emoji": "⛵",
  "img": "zheng_he.jpg",
  "facts": [
   "Led enormous treasure fleets across the oceans",
   "Sailed as far as Africa and the Middle East",
   "Commanded ships far larger than Europe’s"
  ],
  "quote": null,
  "bio": "A Chinese admiral who led giant fleets across Asia and to Africa — decades before European voyages. His treasure ships were among the largest wooden ships ever built."
 },
 {
  "name": "Ibn Battuta",
  "slug": "ibn_battuta",
  "country": "Morocco",
  "flag": "🇲🇦",
  "era": 1340,
  "eraLabel": "1304–1369",
  "role": "Explorer",
  "emoji": "🧭",
  "img": "ibn_battuta.jpg",
  "facts": [
   "Traveled over 75,000 miles in his lifetime",
   "Journeyed across Africa, Asia, and Europe",
   "Wrote a famous book describing the world he saw"
  ],
  "quote": null,
  "bio": "A traveler from Morocco who journeyed farther than almost anyone of his time — across Africa, the Middle East, India, and China — and wrote about all he saw."
 },
 {
  "name": "Christopher Columbus",
  "slug": "christopher_columbus",
  "country": "Italy / Spain",
  "flag": "🇪🇸",
  "era": 1490,
  "eraLabel": "1451–1506",
  "role": "Explorer",
  "emoji": "🚢",
  "img": "christopher_columbus.jpg",
  "facts": [
   "Sailed across the Atlantic Ocean in 1492",
   "Opened lasting contact between Europe and the Americas",
   "His voyages brought great harm to Indigenous peoples"
  ],
  "quote": null,
  "bio": "An Italian explorer sailing for Spain who crossed the Atlantic in 1492. His voyages connected two worlds — but also began centuries of harm and disease for the Indigenous peoples already living in the Americas."
 },
 {
  "name": "Amelia Earhart",
  "slug": "amelia_earhart",
  "country": "United States",
  "flag": "🇺🇸",
  "era": 1930,
  "eraLabel": "1897–1937",
  "role": "Aviator",
  "emoji": "✈️",
  "img": "amelia_earhart.jpg",
  "facts": [
   "First woman to fly alone across the Atlantic",
   "Set many aviation records",
   "Disappeared during a flight around the world"
  ],
  "quote": "Adventure is worthwhile in itself.",
  "bio": "An American pilot who set records and became the first woman to fly solo across the Atlantic. She vanished over the Pacific while trying to fly around the world."
 },
 {
  "name": "Sacagawea",
  "slug": "sacagawea",
  "country": "United States (Shoshone)",
  "flag": "🪶",
  "era": 1805,
  "eraLabel": "c. 1788–1812",
  "role": "Guide",
  "emoji": "🏔️",
  "img": "sacagawea.jpg",
  "facts": [
   "Guided the Lewis and Clark expedition",
   "Helped translate with Native American nations",
   "Traveled thousands of miles carrying her baby"
  ],
  "quote": null,
  "bio": "A young Shoshone woman who guided and translated for the Lewis and Clark expedition across western North America, carrying her infant son the whole way."
 },
 {
  "name": "Cleopatra",
  "slug": "cleopatra",
  "country": "Egypt",
  "flag": "🇪🇬",
  "era": -40,
  "eraLabel": "69–30 BCE",
  "role": "Ruler",
  "emoji": "👑",
  "img": "cleopatra.jpg",
  "facts": [
   "The last pharaoh of ancient Egypt",
   "Was famous for her intelligence and many languages",
   "Formed alliances with powerful Roman leaders"
  ],
  "quote": null,
  "bio": "The last pharaoh of ancient Egypt, known for her sharp mind and skill with languages. She allied with Rome's leaders to protect Egypt's independence."
 },
 {
  "name": "Mansa Musa",
  "slug": "mansa_musa",
  "country": "Mali",
  "flag": "🇲🇱",
  "era": 1320,
  "eraLabel": "c. 1280–1337",
  "role": "Ruler",
  "emoji": "💰",
  "img": "mansa_musa.jpg",
  "facts": [
   "Possibly the richest person in all of history",
   "Ruled the wealthy West African empire of Mali",
   "Built Timbuktu into a great center of learning"
  ],
  "quote": null,
  "bio": "The emperor of Mali in West Africa and possibly the richest person who ever lived. His famous journey to Mecca spread Mali's gold and fame across the world."
 },
 {
  "name": "Genghis Khan",
  "slug": "genghis_khan",
  "country": "Mongolia",
  "flag": "🇲🇳",
  "era": 1210,
  "eraLabel": "c. 1162–1227",
  "role": "Ruler",
  "emoji": "🏹",
  "img": "genghis_khan.jpg",
  "facts": [
   "Built the largest connected land empire in history",
   "United the scattered Mongol tribes",
   "His conquests were extremely violent"
  ],
  "quote": null,
  "bio": "A Mongol leader who united his people and built the largest land empire ever. His empire connected trade across Asia, but his conquests killed huge numbers of people."
 },
 {
  "name": "Qin Shi Huang",
  "slug": "qin_shi_huang",
  "country": "China",
  "flag": "🇨🇳",
  "era": -220,
  "eraLabel": "259–210 BCE",
  "role": "Emperor",
  "emoji": "🏯",
  "img": "qin_shi_huang.jpg",
  "facts": [
   "First emperor to unite all of China",
   "Began building early parts of the Great Wall",
   "Was buried with the Terracotta Army"
  ],
  "quote": null,
  "bio": "The first emperor to unite China under one rule. He standardized writing and money and began the Great Wall — but he ruled harshly and punished those who disagreed."
 },
 {
  "name": "Julius Caesar",
  "slug": "julius_caesar",
  "country": "Rome",
  "flag": "🇮🇹",
  "era": -50,
  "eraLabel": "100–44 BCE",
  "role": "Ruler",
  "emoji": "⚔️",
  "img": "julius_caesar.jpg",
  "facts": [
   "A Roman general who expanded the empire",
   "Reformed the calendar we still use today",
   "Was assassinated by Roman senators"
  ],
  "quote": "I came, I saw, I conquered.",
  "bio": "A Roman general and ruler who expanded Rome's power. He gave us the 365-day calendar, but his grab for power led senators to assassinate him."
 },
 {
  "name": "Napoleon Bonaparte",
  "slug": "napoleon_bonaparte",
  "country": "France",
  "flag": "🇫🇷",
  "era": 1805,
  "eraLabel": "1769–1821",
  "role": "Ruler",
  "emoji": "🎖️",
  "img": "napoleon_bonaparte.jpg",
  "facts": [
   "Rose from soldier to emperor of France",
   "Created a legal code copied around the world",
   "His wars caused millions of deaths"
  ],
  "quote": null,
  "bio": "A French general who crowned himself emperor and conquered much of Europe. His laws still shape many countries, but his endless wars cost millions of lives."
 },
 {
  "name": "Nelson Mandela",
  "slug": "nelson_mandela",
  "country": "South Africa",
  "flag": "🇿🇦",
  "era": 1990,
  "eraLabel": "1918–2013",
  "role": "Leader",
  "emoji": "✊",
  "img": "nelson_mandela.jpg",
  "facts": [
   "Fought to end apartheid in South Africa",
   "Spent 27 years in prison for his beliefs",
   "Became South Africa’s first Black president"
  ],
  "quote": "It always seems impossible until it’s done.",
  "bio": "A South African leader who fought the unjust system of apartheid. He spent 27 years in prison, then forgave his jailers and became the country's first Black president."
 },
 {
  "name": "Mahatma Gandhi",
  "slug": "mahatma_gandhi",
  "country": "India",
  "flag": "🇮🇳",
  "era": 1940,
  "eraLabel": "1869–1948",
  "role": "Leader",
  "emoji": "🕊️",
  "img": "mahatma_gandhi.jpg",
  "facts": [
   "Led India to independence peacefully",
   "Used nonviolent protest to create change",
   "Inspired civil rights movements worldwide"
  ],
  "quote": "Be the change you wish to see in the world.",
  "bio": "A leader who guided India to independence using peaceful protest instead of violence. His methods inspired freedom movements all over the world."
 },
 {
  "name": "Martin Luther King Jr.",
  "slug": "martin_luther_king_jr",
  "country": "United States",
  "flag": "🇺🇸",
  "era": 1960,
  "eraLabel": "1929–1968",
  "role": "Leader",
  "emoji": "✊🏾",
  "img": "martin_luther_king_jr.jpg",
  "facts": [
   "Led the American civil rights movement",
   "Gave the famous \"I Have a Dream\" speech",
   "Won the Nobel Peace Prize"
  ],
  "quote": "Darkness cannot drive out darkness; only light can do that.",
  "bio": "An American minister who led the civil rights movement for equal rights through peaceful protest. His 'I Have a Dream' speech is one of the most famous ever given."
 },
 {
  "name": "Abraham Lincoln",
  "slug": "abraham_lincoln",
  "country": "United States",
  "flag": "🇺🇸",
  "era": 1863,
  "eraLabel": "1809–1865",
  "role": "Leader",
  "emoji": "🎩",
  "img": "abraham_lincoln.jpg",
  "facts": [
   "The 16th president of the United States",
   "Led the country through the Civil War",
   "Helped end slavery in the United States"
  ],
  "quote": "Whatever you are, be a good one.",
  "bio": "The U.S. president who guided the nation through its Civil War and worked to end slavery. He was assassinated soon after the war ended."
 },
 {
  "name": "Frida Kahlo",
  "slug": "frida_kahlo",
  "country": "Mexico",
  "flag": "🇲🇽",
  "era": 1940,
  "eraLabel": "1907–1954",
  "role": "Artist",
  "emoji": "🌺",
  "img": "frida_kahlo.jpg",
  "facts": [
   "Painted many powerful self-portraits",
   "Turned her pain and illness into art",
   "Became a symbol of Mexican culture"
  ],
  "quote": "I paint my own reality.",
  "bio": "A Mexican painter known for bold, colorful self-portraits. A childhood illness and a bus accident caused her lifelong pain, which she poured into her art."
 },
 {
  "name": "William Shakespeare",
  "slug": "william_shakespeare",
  "country": "England",
  "flag": "🇬🇧",
  "era": 1600,
  "eraLabel": "1564–1616",
  "role": "Writer",
  "emoji": "🎭",
  "img": "william_shakespeare.jpg",
  "facts": [
   "Wrote 37 plays and many poems",
   "Invented hundreds of English words",
   "Wrote \"Romeo and Juliet\" and \"Hamlet\""
  ],
  "quote": "To be, or not to be: that is the question.",
  "bio": "An English playwright often called the greatest writer in the language. His plays are still performed everywhere, and he coined hundreds of words we still use."
 },
 {
  "name": "Ludwig van Beethoven",
  "slug": "ludwig_van_beethoven",
  "country": "Germany",
  "flag": "🇩🇪",
  "era": 1810,
  "eraLabel": "1770–1827",
  "role": "Composer",
  "emoji": "🎼",
  "img": "ludwig_van_beethoven.jpg",
  "facts": [
   "Composed nine famous symphonies",
   "Kept writing music after becoming deaf",
   "Changed classical music forever"
  ],
  "quote": null,
  "bio": "A German composer whose symphonies changed music forever. Astonishingly, he wrote some of his greatest works after he had gone completely deaf."
 },
 {
  "name": "Confucius",
  "slug": "confucius",
  "country": "China",
  "flag": "🇨🇳",
  "era": -500,
  "eraLabel": "551–479 BCE",
  "role": "Philosopher",
  "emoji": "☯️",
  "img": "confucius.jpg",
  "facts": [
   "A teacher whose ideas shaped China for ages",
   "Taught about kindness, respect, and learning",
   "His sayings fill a book called the Analects"
  ],
  "quote": "It does not matter how slowly you go as long as you do not stop.",
  "bio": "A Chinese teacher and thinker whose ideas about respect, family, and learning shaped East Asian culture for over two thousand years."
 },
 {
  "name": "Hokusai",
  "slug": "hokusai",
  "country": "Japan",
  "flag": "🇯🇵",
  "era": 1820,
  "eraLabel": "1760–1849",
  "role": "Artist",
  "emoji": "🌊",
  "img": "hokusai.jpg",
  "facts": [
   "Created the print \"The Great Wave\"",
   "Made tens of thousands of artworks",
   "Influenced artists around the world"
  ],
  "quote": null,
  "bio": "A Japanese artist famous for the woodblock print 'The Great Wave off Kanagawa.' He made art tirelessly into his eighties and inspired painters worldwide."
 },
 {
  "name": "Wangari Maathai",
  "slug": "wangari_maathai",
  "country": "Kenya",
  "flag": "🇰🇪",
  "era": 1990,
  "eraLabel": "1940–2011",
  "role": "Leader",
  "emoji": "🌳",
  "img": "wangari_maathai.jpg",
  "facts": [
   "Started a movement to plant millions of trees",
   "First African woman to win the Nobel Peace Prize",
   "Fought for the environment and for women"
  ],
  "quote": "It’s the little things citizens do. That’s what will make the difference.",
  "bio": "A Kenyan scientist and activist who led ordinary people to plant tens of millions of trees. She was the first African woman to win the Nobel Peace Prize."
 }
],
  PASSAGES: [
 {
  "slug": "marie_curie",
  "title": "The Scientist Who Glowed",
  "text": "Marie Curie was born in Poland in 1867, at a time when women were not allowed to attend university there. Determined to learn, she moved to France and studied late into the night, sometimes so poor that she nearly fainted from hunger. Her hard work paid off. Curie discovered two new elements and won two Nobel Prizes — the first person ever to do so. But her discoveries had a hidden danger. The radioactive materials she handled every day slowly made her sick, because no one yet understood how harmful they were.",
  "questions": [
   {
    "q": "What is the main idea of this passage?",
    "choices": [
     "Curie was too poor to eat",
     "Curie overcame obstacles to make great discoveries",
     "France is better than Poland",
     "Nobel Prizes are hard to win"
    ],
    "answer": 1,
    "explain": "The passage is mostly about how Curie pushed past hardships to achieve major scientific discoveries."
   },
   {
    "q": "Why did Marie Curie move to France?",
    "choices": [
     "To become rich",
     "Because women could not attend university in Poland",
     "To win a Nobel Prize",
     "To escape a war"
    ],
    "answer": 1,
    "explain": "The passage says women were not allowed to attend university in Poland, so she moved to France to study."
   },
   {
    "q": "In this passage, the word \"determined\" means —",
    "choices": [
     "confused",
     "giving up easily",
     "strongly wanting to do something",
     "very tired"
    ],
    "answer": 2,
    "explain": "\"Determined to learn,\" she studied late into the night — she strongly wanted to succeed."
   },
   {
    "q": "What can you infer about radioactivity in Curie’s time?",
    "choices": [
     "People knew it was dangerous",
     "Its dangers were not yet understood",
     "It was not real",
     "Only women could study it"
    ],
    "answer": 1,
    "explain": "The passage says she got sick because no one yet understood how harmful it was."
   }
  ]
 },
 {
  "slug": "mansa_musa",
  "title": "The Richest Man Who Ever Lived",
  "text": "In the 1300s, the West African empire of Mali was rich beyond imagination, and its ruler, Mansa Musa, may have been the wealthiest person in all of history. Mali controlled vast amounts of gold. In 1324, Mansa Musa made a long journey to Mecca, traveling with a caravan of thousands of people. Along the way he gave away so much gold that its value actually dropped in the cities he passed through. But Mansa Musa cared about more than riches. He brought back scholars and architects and turned the city of Timbuktu into a famous center of learning and books.",
  "questions": [
   {
    "q": "What is this passage mostly about?",
    "choices": [
     "How to travel to Mecca",
     "A wealthy African ruler who valued learning",
     "Why gold loses value",
     "The city of Timbuktu today"
    ],
    "answer": 1,
    "explain": "The passage focuses on Mansa Musa’s wealth and how he used it to support learning."
   },
   {
    "q": "What happened to the value of gold as Mansa Musa traveled?",
    "choices": [
     "It went up",
     "It dropped",
     "It stayed the same",
     "It disappeared"
    ],
    "answer": 1,
    "explain": "He gave away so much gold that its value dropped in the cities he passed through."
   },
   {
    "q": "Which sentence best shows that Mansa Musa cared about more than money?",
    "choices": [
     "Mali controlled vast amounts of gold",
     "He traveled with thousands of people",
     "He turned Timbuktu into a center of learning",
     "He may have been the wealthiest person in history"
    ],
    "answer": 2,
    "explain": "Building a center of learning shows he valued knowledge, not just riches."
   },
   {
    "q": "The word \"vast\" in the passage means —",
    "choices": [
     "tiny",
     "extremely large",
     "hidden",
     "fake"
    ],
    "answer": 1,
    "explain": "\"Vast amounts of gold\" means a huge, enormous quantity."
   }
  ]
 },
 {
  "slug": "katherine_johnson",
  "title": "The Human Computer",
  "text": "Before electronic computers were trusted, NASA relied on brilliant human mathematicians to check their numbers. One of the best was Katherine Johnson. She calculated the flight paths that would carry astronauts into space and safely back to Earth. When NASA first used an electronic computer for John Glenn’s orbit, Glenn refused to fly until Johnson had checked the machine’s math by hand. Johnson did all of this at a time when Black women in America faced unfair rules and were often kept apart from others at work. Her skill was so important that it could not be ignored.",
  "questions": [
   {
    "q": "What is the main idea of the passage?",
    "choices": [
     "Computers are always wrong",
     "A gifted mathematician helped NASA despite facing unfairness",
     "John Glenn was afraid to fly",
     "NASA had no computers"
    ],
    "answer": 1,
    "explain": "The passage highlights Johnson’s vital work at NASA while facing discrimination."
   },
   {
    "q": "Why did John Glenn want Johnson to check the computer’s math?",
    "choices": [
     "She was his friend",
     "He trusted her calculations",
     "The computer was broken",
     "She asked to"
    ],
    "answer": 1,
    "explain": "Glenn refused to fly until Johnson verified the numbers — he trusted her."
   },
   {
    "q": "What does the passage suggest about Johnson’s time period?",
    "choices": [
     "Everyone was treated equally",
     "Black women faced unfair treatment",
     "NASA hired only women",
     "Space travel was easy"
    ],
    "answer": 1,
    "explain": "It states Black women faced unfair rules and were often kept apart at work."
   }
  ]
 },
 {
  "slug": "zheng_he",
  "title": "The Admiral of the Treasure Fleet",
  "text": "Almost a hundred years before European ships crossed the oceans, a Chinese admiral named Zheng He led some of the largest fleets the world had ever seen. His “treasure ships” were several times bigger than the boats European explorers would later use. Between 1405 and 1433, Zheng He sailed to Southeast Asia, India, the Middle East, and the eastern coast of Africa. He carried silk and porcelain to trade and returned with gifts, including a giraffe that amazed the Chinese court. After his voyages ended, China turned its attention inward, and the great fleets were never rebuilt.",
  "questions": [
   {
    "q": "What is the passage mainly about?",
    "choices": [
     "How to build a ship",
     "A Chinese admiral’s great ocean voyages",
     "Giraffes in China",
     "European explorers"
    ],
    "answer": 1,
    "explain": "The passage describes Zheng He’s large fleets and his voyages."
   },
   {
    "q": "How did Zheng He’s ships compare to later European ships?",
    "choices": [
     "They were smaller",
     "They were about the same",
     "They were several times bigger",
     "They were faster but weaker"
    ],
    "answer": 2,
    "explain": "The passage says his treasure ships were several times bigger."
   },
   {
    "q": "What happened after Zheng He’s voyages ended?",
    "choices": [
     "China built even bigger fleets",
     "China turned its attention inward",
     "Europe copied his ships",
     "He sailed to the Americas"
    ],
    "answer": 1,
    "explain": "China turned inward and the great fleets were never rebuilt."
   }
  ]
 },
 {
  "slug": "wangari_maathai",
  "title": "One Tree at a Time",
  "text": "In Kenya, a scientist named Wangari Maathai noticed that the forests were disappearing. Without trees, the soil washed away and streams dried up, making life harder for families. Instead of waiting for others to fix the problem, Maathai encouraged ordinary women to plant trees — first a few, then thousands, then tens of millions. Her Green Belt Movement helped the land and gave women new confidence and income. Some powerful people opposed her, but she refused to back down. In 2004, she became the first African woman to win the Nobel Peace Prize.",
  "questions": [
   {
    "q": "What problem did Maathai set out to solve?",
    "choices": [
     "Too many trees",
     "Disappearing forests and damaged land",
     "A lack of schools",
     "Unemployment in cities"
    ],
    "answer": 1,
    "explain": "She noticed forests disappearing, which damaged the soil and streams."
   },
   {
    "q": "What was the Green Belt Movement?",
    "choices": [
     "A running race",
     "An effort to plant many trees",
     "A new government",
     "A type of forest"
    ],
    "answer": 1,
    "explain": "It was Maathai’s effort that led people to plant tens of millions of trees."
   },
   {
    "q": "The phrase \"refused to back down\" shows that Maathai was —",
    "choices": [
     "easily scared",
     "determined and brave",
     "unfriendly",
     "uninterested"
    ],
    "answer": 1,
    "explain": "Refusing to back down against powerful opponents shows courage and determination."
   },
   {
    "q": "What is the lesson of this passage?",
    "choices": [
     "Only leaders can make change",
     "Small actions by ordinary people can make a big difference",
     "Trees are not important",
     "Kenya has no forests"
    ],
    "answer": 1,
    "explain": "Ordinary women planting trees created huge change — small actions add up."
   }
  ]
 },
 {
  "slug": "galileo_galilei",
  "title": "The Man Who Looked Up",
  "text": "Long ago, most people believed that the Sun and stars circled the Earth. Then an Italian scientist named Galileo pointed a new invention — the telescope — at the night sky. He saw mountains on the Moon and four tiny moons circling the planet Jupiter. These discoveries convinced him that the Earth was not the center of everything; instead, the Earth traveled around the Sun. Powerful leaders were angry and put Galileo on trial, forcing him to take back his words. He spent his final years under house arrest, yet his careful observations helped launch modern science.",
  "questions": [
   {
    "q": "What did Galileo’s telescope help him discover?",
    "choices": [
     "New countries",
     "Moons circling Jupiter",
     "A cure for illness",
     "Buried treasure"
    ],
    "answer": 1,
    "explain": "He saw mountains on the Moon and four moons around Jupiter."
   },
   {
    "q": "Why were powerful leaders angry with Galileo?",
    "choices": [
     "He built a telescope",
     "He taught that Earth moves around the Sun",
     "He was Italian",
     "He was too quiet"
    ],
    "answer": 1,
    "explain": "His idea that Earth orbits the Sun challenged accepted beliefs, angering leaders."
   },
   {
    "q": "The word \"convinced\" in the passage means —",
    "choices": [
     "made unsure",
     "made to believe",
     "made angry",
     "made tired"
    ],
    "answer": 1,
    "explain": "The discoveries convinced him — they made him believe Earth orbits the Sun."
   },
   {
    "q": "What is the main idea?",
    "choices": [
     "Telescopes are fun",
     "Galileo’s discoveries helped begin modern science despite opposition",
     "Jupiter has moons",
     "House arrest is unfair"
    ],
    "answer": 1,
    "explain": "The passage is about Galileo’s discoveries and their importance despite the trouble they caused him."
   }
  ]
 }
]
};
