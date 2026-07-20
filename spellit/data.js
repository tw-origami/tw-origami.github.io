/* Spell It! — content data for a classic say-it-and-spell-it bee.
 * The app SPEAKS each word (browser speech), the speller types it.
 * Five levels of difficulty; every word has a part of speech, a kid-friendly
 * definition, and an example sentence (the pronouncer reads it aloud, and the
 * on-screen version hides the word so it isn't a giveaway).
 */
window.SPELL = {

  LEVELS: [
    {
      id:'sprout', emoji:'🌱', name:'Sprout', grade:'Grades 1–2',
      blurb:'First spelling words — short, friendly, and a great warm-up.',
      words:[
        { w:'friend',  pos:'noun',        def:'Someone you like and enjoy being with.',         s:'My best friend sits next to me.' },
        { w:'because', pos:'conjunction', def:'For the reason that.',                             s:'I wore boots because it was raining.' },
        { w:'happy',   pos:'adjective',   def:'Feeling or showing joy.',                          s:'She was happy to see her puppy.' },
        { w:'school',  pos:'noun',        def:'A place where you go to learn.',                   s:'We read books at school every day.' },
        { w:'water',   pos:'noun',        def:'The clear liquid we drink.',                       s:'Please pour me a glass of water.' },
        { w:'little',  pos:'adjective',   def:'Small in size.',                                   s:'A little mouse ran under the door.' },
        { w:'people',  pos:'noun',        def:'More than one person.',                            s:'Many people came to the fair.' },
        { w:'funny',   pos:'adjective',   def:'Something that makes you laugh.',                  s:'The clown told a funny joke.' },
        { w:'apple',   pos:'noun',        def:'A round fruit that grows on trees.',               s:'I packed an apple for lunch.' },
        { w:'family',  pos:'noun',        def:'The people who are related to you.',               s:'My whole family ate dinner together.' },
        { w:'rabbit',  pos:'noun',        def:'A small furry animal with long ears.',             s:'The rabbit hopped across the grass.' },
        { w:'yellow',  pos:'adjective',   def:'The color of the sun or a banana.',                s:'She drew a big yellow sun.' },
        { w:'once',    pos:'adverb',      def:'One time.',                                        s:'We visit the beach once a year.' },
        { w:'said',    pos:'verb',        def:'Spoke — the past tense of “say.”',                 s:'He said hello to the teacher.' },
        { w:'garden',  pos:'noun',        def:'A place where plants and flowers grow.',           s:'Tomatoes grow in our garden.' },
        { w:'please',  pos:'interjection',def:'A polite word used when you ask for something.',    s:'May I please have some water?' },
        { w:'before',  pos:'preposition', def:'Earlier than something else.',                     s:'Brush your teeth before bed.' },
        { w:'money',   pos:'noun',        def:'The coins and bills we use to buy things.',        s:'She saved her money in a jar.' },
        { w:'under',   pos:'preposition', def:'Below or beneath something.',                      s:'The cat hid under the bed.' },
        { w:'every',   pos:'adjective',   def:'Each one, with none left out.',                    s:'We practice the words every day.' }
      ]
    },
    {
      id:'worker', emoji:'🐝', name:'Worker', grade:'Grades 3–4',
      blurb:'Longer words with a few tricky letters to watch for.',
      words:[
        { w:'weather',   pos:'noun',      def:'What it is like outside, such as rain or sun.',    s:'The weather was warm and sunny.' },
        { w:'thought',   pos:'verb',      def:'Had an idea in your mind — past tense of “think.”', s:'I thought about the answer for a while.' },
        { w:'enough',    pos:'adjective', def:'As much as you need.',                             s:'We have enough chairs for everyone.' },
        { w:'favorite',  pos:'adjective', def:'The one you like best.',                           s:'Blue is my favorite color.' },
        { w:'bicycle',   pos:'noun',      def:'A two-wheeled vehicle you pedal.',                 s:'She rode her bicycle to the park.' },
        { w:'calendar',  pos:'noun',      def:'A chart that shows the days and months.',          s:'I marked my birthday on the calendar.' },
        { w:'dangerous', pos:'adjective', def:'Able to cause harm.',                              s:'Crossing without looking is dangerous.' },
        { w:'February',  pos:'noun',      def:'The second month of the year.',                    s:'Valentine’s Day is in February.' },
        { w:'neighbor',  pos:'noun',      def:'A person who lives near you.',                     s:'Our neighbor waved from her yard.' },
        { w:'beautiful', pos:'adjective', def:'Very pretty or lovely.',                           s:'The garden was full of beautiful flowers.' },
        { w:'surprise',  pos:'noun',      def:'Something you did not expect.',                    s:'The party was a big surprise.' },
        { w:'remember',  pos:'verb',      def:'To keep in your mind; to not forget.',             s:'Please remember to bring your lunch.' },
        { w:'through',   pos:'preposition', def:'In one side and out the other.',                 s:'The train went through the tunnel.' },
        { w:'children',  pos:'noun',      def:'More than one child.',                             s:'The children played on the swings.' },
        { w:'different', pos:'adjective', def:'Not the same.',                                    s:'The twins wore different shoes.' },
        { w:'answer',    pos:'noun',      def:'A reply to a question.',                           s:'Raise your hand to answer.' },
        { w:'build',     pos:'verb',      def:'To make something by putting parts together.',     s:'They will build a treehouse.' },
        { w:'minute',    pos:'noun',      def:'A length of time equal to sixty seconds.',         s:'Please wait one minute.' },
        { w:'group',     pos:'noun',      def:'A number of people or things that are together.',  s:'Our group won the game.' },
        { w:'early',     pos:'adverb',    def:'Before the usual or expected time.',               s:'We woke up early for the trip.' }
      ]
    },
    {
      id:'forager', emoji:'🍯', name:'Forager', grade:'Grades 5–6',
      blurb:'Multi-syllable words — sound them out in chunks.',
      words:[
        { w:'necessary',   pos:'adjective', def:'Needed; something that must be done.',           s:'Sleep is necessary for good health.' },
        { w:'separate',    pos:'verb',      def:'To move things apart.',                          s:'Please separate the red and blue tiles.' },
        { w:'believe',     pos:'verb',      def:'To think that something is true.',               s:'I believe you can do it.' },
        { w:'tomorrow',    pos:'noun',      def:'The day after today.',                           s:'The spelling test is tomorrow morning.' },
        { w:'restaurant',  pos:'noun',      def:'A place where meals are served.',                s:'We ate pasta at the restaurant.' },
        { w:'beginning',   pos:'noun',      def:'The start of something.',                        s:'The beginning of the movie was exciting.' },
        { w:'difference',  pos:'noun',      def:'The way things are not alike.',                  s:'Can you spot the difference in the pictures?' },
        { w:'vacuum',      pos:'noun',      def:'A machine that sucks up dust.',                  s:'He ran the vacuum across the carpet.' },
        { w:'environment', pos:'noun',      def:'The natural world and everything around us.',    s:'Recycling helps protect the environment.' },
        { w:'definitely',  pos:'adverb',    def:'For sure; without a doubt.',                     s:'I will definitely be there.' },
        { w:'rhythm',      pos:'noun',      def:'A repeating beat or pattern.',                   s:'We clapped to the rhythm of the song.' },
        { w:'familiar',    pos:'adjective', def:'Well known or easy to recognize.',               s:'Her face looked familiar to me.' },
        { w:'temperature', pos:'noun',      def:'How hot or cold something is.',                  s:'The temperature dropped at night.' },
        { w:'probably',    pos:'adverb',    def:'Most likely.',                                   s:'It will probably rain later.' },
        { w:'sincerely',   pos:'adverb',    def:'In an honest and truthful way.',                 s:'She sincerely thanked her coach.' },
        { w:'knowledge',   pos:'noun',      def:'The facts and information that you know.',       s:'Reading adds to your knowledge.' },
        { w:'medicine',    pos:'noun',      def:'Something you take to feel better when sick.',   s:'He took his medicine and rested.' },
        { w:'curious',     pos:'adjective', def:'Eager to learn or know more about something.',   s:'The curious kitten explored the box.' },
        { w:'opposite',    pos:'noun',      def:'Something completely different from another.',   s:'Hot is the opposite of cold.' },
        { w:'exercise',    pos:'noun',      def:'Activity that keeps your body strong and fit.',  s:'Running is good exercise.' }
      ]
    },
    {
      id:'champion', emoji:'👑', name:'Champion', grade:'Grades 7–8',
      blurb:'Real spelling-bee words with silent and doubled letters.',
      words:[
        { w:'accommodate',   pos:'verb',      def:'To have room for, or to help something fit.',  s:'The hall can accommodate three hundred guests.' },
        { w:'embarrass',     pos:'verb',      def:'To make someone feel shy or ashamed.',         s:'I did not mean to embarrass you.' },
        { w:'privilege',     pos:'noun',      def:'A special right or benefit.',                  s:'Driving is a privilege, not a right.' },
        { w:'recommend',     pos:'verb',      def:'To suggest something as good.',                s:'I recommend this book to everyone.' },
        { w:'maintenance',   pos:'noun',      def:'The work of keeping something in good shape.', s:'The car needs regular maintenance.' },
        { w:'questionnaire', pos:'noun',      def:'A set of written questions to answer.',        s:'Please fill out the questionnaire.' },
        { w:'millennium',    pos:'noun',      def:'A period of one thousand years.',              s:'The year 2000 began a new millennium.' },
        { w:'pronunciation', pos:'noun',      def:'The way a word is said.',                      s:'Her pronunciation of the word was perfect.' },
        { w:'mischievous',   pos:'adjective', def:'Playful in a naughty way.',                    s:'The mischievous kitten knocked over the plant.' },
        { w:'conscience',    pos:'noun',      def:'The sense of right and wrong inside you.',     s:'His conscience told him to tell the truth.' },
        { w:'guarantee',     pos:'verb',      def:'To promise that something will happen.',       s:'They guarantee the toy for one full year.' },
        { w:'exaggerate',    pos:'verb',      def:'To make something sound bigger than it is.',   s:'Do not exaggerate — it was not that scary.' },
        { w:'perseverance',  pos:'noun',      def:'Not giving up when things are hard.',          s:'Her perseverance won her the medal.' },
        { w:'handkerchief',  pos:'noun',      def:'A small cloth for your nose or face.',         s:'He kept a handkerchief in his pocket.' },
        { w:'lieutenant',    pos:'noun',      def:'An officer who ranks just below a captain.',   s:'The lieutenant led the small team.' },
        { w:'conscientious', pos:'adjective', def:'Careful to do things well and correctly.',     s:'She is a conscientious student.' },
        { w:'Renaissance',   pos:'noun',      def:'A period of great art and learning in Europe.', s:'Leonardo lived during the Renaissance.' },
        { w:'hierarchy',     pos:'noun',      def:'A system where things are ranked by level.',   s:'Ants live in a strict hierarchy.' },
        { w:'silhouette',    pos:'noun',      def:'The dark outline of something against light.', s:'We saw the silhouette of the mountains.' },
        { w:'camouflage',    pos:'noun',      def:'Coloring or covering that helps something blend in.', s:'The lizard used camouflage to hide.' }
      ]
    },
    {
      id:'traps', emoji:'⚠️', name:'Tricky Traps', grade:'Most-misspelled words',
      blurb:'The sneaky ones — silent letters and surprising spellings.',
      words:[
        { w:'weird',     pos:'adjective', def:'Strange or unusual.',                              s:'That was a really weird dream.' },
        { w:'receive',   pos:'verb',      def:'To get something.',                                s:'You will receive a prize at the end.' },
        { w:'license',   pos:'noun',      def:'An official card that gives permission.',          s:'She showed her fishing license.' },
        { w:'argument',  pos:'noun',      def:'A disagreement, or the reasons for something.',    s:'They had a short argument and made up.' },
        { w:'grateful',  pos:'adjective', def:'Thankful.',                                        s:'I am grateful for your help.' },
        { w:'jewelry',   pos:'noun',      def:'Rings, necklaces, and other ornaments.',           s:'She kept her jewelry in a small box.' },
        { w:'Wednesday', pos:'noun',      def:'The day after Tuesday.',                           s:'We have art class on Wednesday.' },
        { w:'broccoli',  pos:'noun',      def:'A green vegetable shaped like a tiny tree.',       s:'He ate all of his broccoli.' },
        { w:'tongue',    pos:'noun',      def:'The muscle in your mouth for tasting and talking.', s:'The cold ice cream numbed her tongue.' },
        { w:'island',    pos:'noun',      def:'Land with water all around it.',                   s:'They sailed to a small island.' },
        { w:'muscle',    pos:'noun',      def:'A body part that helps you move.',                 s:'Running builds strong leg muscle.' },
        { w:'scissors',  pos:'noun',      def:'A tool with two blades for cutting.',              s:'Use the scissors to cut the paper.' },
        { w:'chocolate', pos:'noun',      def:'A sweet brown treat made from cocoa.',             s:'She loves chocolate ice cream.' },
        { w:'business',  pos:'noun',      def:'A company, or the work of buying and selling.',    s:'Her family runs a small bakery business.' },
        { w:'rhyme',     pos:'verb',      def:'To end with the same sound as another word.',      s:'The words “cat” and “hat” rhyme.' },
        { w:'yacht',     pos:'noun',      def:'A fancy boat used for sailing or racing.',         s:'The yacht sailed into the harbor.' },
        { w:'rhinoceros',pos:'noun',      def:'A large animal with thick skin and horns.',        s:'The rhinoceros has two horns.' },
        { w:'mysterious',pos:'adjective', def:'Full of mystery; hard to explain or understand.',  s:'A mysterious light glowed in the woods.' },
        { w:'lightning', pos:'noun',      def:'The bright flash of light during a storm.',        s:'Lightning lit up the whole sky.' },
        { w:'vegetable', pos:'noun',      def:'A plant grown to be eaten, such as a carrot.',     s:'Spinach is a healthy vegetable.' }
      ]
    }
  ],

  TIPS: [
    { t:'Break it into syllables', d:'Say the word slowly in chunks: cal‑en‑dar, ne‑ces‑sar‑y. Spell one chunk at a time.' },
    { t:'Listen for silent letters', d:'Some letters hide: the k in “know,” the b in “thumb,” the s in “island,” the c in “muscle.”' },
    { t:'“i before e, except after c”', d:'Think “believe” and “piece,” but “receive” and “ceiling.” (A few rebels like “weird” break the rule!)' },
    { t:'Watch for double letters', d:'“Accommodate” has two c’s AND two m’s. “Embarrass” has two r’s and two s’s.' },
    { t:'Use the definition and sentence', d:'Hearing the word in a sentence tells you which word it is — like “their,” “there,” or “they’re.”' },
    { t:'Picture the word', d:'Close your eyes and try to “see” the letters. Writing it in the air can help too.' }
  ],

  SOURCES: [
    { name:'Merriam-Webster', url:'https://www.merriam-webster.com/',
      note:'Look up any word to check its spelling, meaning, and how it sounds.' },
    { name:'Scripps National Spelling Bee', url:'https://spellingbee.com/',
      note:'The official home of the national spelling bee, with study word lists.' },
    { name:'Merriam-Webster Word Central', url:'https://www.wordcentral.com/',
      note:'A kid-friendly dictionary from Merriam-Webster.' }
  ]
};
