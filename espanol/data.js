/* Español Start — content data. A confidence head-start for Spanish 1.
 * Four INTERACTIVE games:
 *   COGNATE  → true friend or false friend? guess if a word means what it looks like
 *   MATCH    → match Spanish words to English (greetings, colors, family, food, numbers)
 *   SAYIT    → pick the right phrase to respond in a real situation
 *   BUILD    → put scrambled Spanish words into the correct sentence order
 */
window.ES = {

  TEACHER: {
    cognate: {
      how:'A Spanish word appears that looks like an English one. Decide: is it a TRUE friend (it really means the English word it resembles) or a FALSE friend (a trap that means something else)? Pick one, then see what it actually means.',
      point:'Roughly a third of Spanish words are guessable from English — a superpower for beginners. But a handful are sneaky traps, and this game teaches both at once.',
      learn:'Using cognates to guess new words, while learning the famous “false friends” that fool beginners (librería = bookstore, not library!).',
      explore:'Ask: “What English word does this look like — and is that a clue or a trap?” Then have them find three more cognates on a food label or product in the house.'
    },
    match: {
      how:'Tap a Spanish word on the left, then tap its English meaning on the right. Correct pairs lock in green. Match all of them to clear the board. A new set of words comes each round.',
      point:'Every language starts with a core of everyday words. Matching builds that first vocabulary through active recall, not just staring at a list.',
      learn:'Essential Spanish 1 vocabulary — greetings, colors, family, food, and numbers — the words you meet in week one.',
      explore:'Ask: “Which word will you use the most?” Then challenge them to label five things in their room with Spanish sticky notes.'
    },
    sayit: {
      how:'You’re dropped into a real situation — someone greets you, asks your name, or says thanks. Pick the response that actually fits. Tap 📖 Phrasebook if you want to review first.',
      point:'Knowing words isn’t the same as using them. This practices the actual back-and-forth of a first conversation.',
      learn:'Functional Spanish — greetings, introductions, thank-yous, and the everyday phrases that get you through day one.',
      explore:'Ask: “How would you answer if a real person said that to you?” Then have them role-play a two-line conversation out loud.'
    },
    build: {
      how:'You’re given an English sentence and its Spanish words, shuffled. Tap the words in the correct order to rebuild the sentence. Watch for word order — in Spanish, the describing word usually comes AFTER the noun!',
      point:'Sentence order is where beginners freeze. Rebuilding real sentences shows the patterns — especially that adjectives follow nouns.',
      learn:'Basic Spanish sentence structure and common verbs (ser, tener, hablar), including the rule that adjectives usually come after the noun.',
      explore:'Ask: “What’s different about the order from English?” (“coche rojo” = “car red”). Then have them build a sentence about their own family.'
    }
  },

  SOURCES: [
    { key:'spanishdict', name:'SpanishDict',
      url:'https://www.spanishdict.com/', note:'Free dictionary, conjugations, and beginner lessons — great for checking any word here.' },
    { key:'duolingo', name:'Duolingo — Spanish',
      url:'https://www.duolingo.com/course/es/en/Learn-Spanish', note:'A free, game-like way to keep building vocabulary and grammar.' },
    { key:'studyspanish', name:'StudySpanish.com',
      url:'https://studyspanish.com/', note:'Free grammar and pronunciation lessons organized for beginners.' }
  ],

  /* ───── GAME 1 · COGNATE DETECTIVE ─────
   * friend:true = a real cognate (means its look-alike). false = a trap. */
  COGNATES: [
    { word:'familia',    looks:'family',      friend:true,  meaning:'family' },
    { word:'música',     looks:'music',       friend:true,  meaning:'music' },
    { word:'hospital',   looks:'hospital',    friend:true,  meaning:'hospital' },
    { word:'importante', looks:'important',   friend:true,  meaning:'important' },
    { word:'teléfono',   looks:'telephone',   friend:true,  meaning:'telephone' },
    { word:'delicioso',  looks:'delicious',   friend:true,  meaning:'delicious' },
    { word:'animal',     looks:'animal',      friend:true,  meaning:'animal' },
    { word:'problema',   looks:'problem',     friend:true,  meaning:'problem' },
    { word:'información', looks:'information',  friend:true,  meaning:'information' },
    { word:'imposible',  looks:'impossible',  friend:true,  meaning:'impossible' },
    { word:'doctor',     looks:'doctor',      friend:true,  meaning:'doctor' },
    { word:'chocolate',  looks:'chocolate',   friend:true,  meaning:'chocolate' },
    { word:'librería',   looks:'library',     friend:false, meaning:'bookstore', real:'(library is “biblioteca”)' },
    { word:'ropa',       looks:'rope',        friend:false, meaning:'clothes',   real:'(rope is “cuerda”)' },
    { word:'sopa',       looks:'soap',        friend:false, meaning:'soup',      real:'(soap is “jabón”)' },
    { word:'éxito',      looks:'exit',        friend:false, meaning:'success',   real:'(exit is “salida”)' },
    { word:'carpeta',    looks:'carpet',      friend:false, meaning:'folder',    real:'(carpet is “alfombra”)' },
    { word:'fábrica',    looks:'fabric',      friend:false, meaning:'factory',   real:'(fabric is “tela”)' },
    { word:'once',       looks:'once (one time)', friend:false, meaning:'eleven', real:'(the number 11)' },
    { word:'pan',        looks:'pan',         friend:false, meaning:'bread',     real:'(a pan is “sartén”)' },
    { word:'vaso',       looks:'vase',        friend:false, meaning:'a drinking glass', real:'(a vase is “florero”)' },
    { word:'largo',      looks:'large',       friend:false, meaning:'long',      real:'(large is “grande”)' },
    { word:'red',        looks:'red',         friend:false, meaning:'net / network', real:'(the color red is “rojo”)' }
  ],

  /* ───── GAME 2 · MATCH UP · also feeds the Phrasebook ───── */
  VOCAB: {
    'Greetings': [
      { es:'hola', en:'hi / hello', say:'OH-lah' },
      { es:'gracias', en:'thank you', say:'GRAH-see-ahs' },
      { es:'adiós', en:'goodbye', say:'ah-DYOHS' },
      { es:'por favor', en:'please', say:'por fah-VOR' },
      { es:'de nada', en:'you’re welcome', say:'deh NAH-dah' },
      { es:'buenos días', en:'good morning', say:'BWEH-nohs DEE-ahs' },
      { es:'buenas noches', en:'good night', say:'BWEH-nahs NOH-chehs' },
      { es:'sí', en:'yes', say:'see' }
    ],
    'Colors': [
      { es:'rojo', en:'red', say:'ROH-hoh' },
      { es:'azul', en:'blue', say:'ah-SOOL' },
      { es:'verde', en:'green', say:'VER-deh' },
      { es:'amarillo', en:'yellow', say:'ah-mah-REE-yoh' },
      { es:'negro', en:'black', say:'NEH-groh' },
      { es:'blanco', en:'white', say:'BLAHN-koh' },
      { es:'rosa', en:'pink', say:'ROH-sah' },
      { es:'naranja', en:'orange', say:'nah-RAHN-hah' }
    ],
    'Family': [
      { es:'madre', en:'mother', say:'MAH-dreh' },
      { es:'padre', en:'father', say:'PAH-dreh' },
      { es:'hermano', en:'brother', say:'er-MAH-noh' },
      { es:'hermana', en:'sister', say:'er-MAH-nah' },
      { es:'abuela', en:'grandmother', say:'ah-BWEH-lah' },
      { es:'hijo', en:'son', say:'EE-hoh' },
      { es:'familia', en:'family', say:'fah-MEE-lyah' },
      { es:'perro', en:'dog', say:'PEH-rroh' }
    ],
    'Food': [
      { es:'pan', en:'bread', say:'pahn' },
      { es:'agua', en:'water', say:'AH-gwah' },
      { es:'leche', en:'milk', say:'LEH-cheh' },
      { es:'manzana', en:'apple', say:'mahn-SAH-nah' },
      { es:'queso', en:'cheese', say:'KEH-soh' },
      { es:'pollo', en:'chicken', say:'POH-yoh' },
      { es:'arroz', en:'rice', say:'ah-RROHS' },
      { es:'huevo', en:'egg', say:'WEH-voh' }
    ],
    'Numbers': [
      { es:'uno', en:'1', say:'OO-noh' },
      { es:'dos', en:'2', say:'dohs' },
      { es:'tres', en:'3', say:'trehs' },
      { es:'cuatro', en:'4', say:'KWAH-troh' },
      { es:'cinco', en:'5', say:'SEEN-koh' },
      { es:'seis', en:'6', say:'sase' },
      { es:'siete', en:'7', say:'SYEH-teh' },
      { es:'ocho', en:'8', say:'OH-choh' },
      { es:'nueve', en:'9', say:'NWEH-veh' },
      { es:'diez', en:'10', say:'dyehs' },
      { es:'once', en:'11', say:'OHN-seh' },
      { es:'doce', en:'12', say:'DOH-seh' }
    ],
    'Days': [
      { es:'lunes', en:'Monday', say:'LOO-nehs' },
      { es:'martes', en:'Tuesday', say:'MAR-tehs' },
      { es:'miércoles', en:'Wednesday', say:'MYER-koh-lehs' },
      { es:'jueves', en:'Thursday', say:'HWEH-vehs' },
      { es:'viernes', en:'Friday', say:'VYER-nehs' },
      { es:'sábado', en:'Saturday', say:'SAH-bah-doh' },
      { es:'domingo', en:'Sunday', say:'doh-MEEN-goh' }
    ]
  },

  /* ───── GAME 3 · SAY IT ───── */
  SAYIT: [
    { prompt:'Someone greets you: “¡Hola! ¿Cómo estás?”', correct:'Muy bien, gracias. ¿Y tú?', distractors:['Me llamo Ana.','Tengo diez años.','Es azul.'], why:'“¿Cómo estás?” asks how you are, so you answer how you feel — “Muy bien, gracias” (very well, thanks).' },
    { prompt:'A new classmate asks: “¿Cómo te llamas?”', correct:'Me llamo Alex.', distractors:['Muy bien.','De nada.','Buenas noches.'], why:'“¿Cómo te llamas?” means “what’s your name?” — answer with “Me llamo…” (my name is…).' },
    { prompt:'You want to thank someone. What do you say?', correct:'Gracias.', distractors:['Por favor.','Perdón.','Hola.'], why:'“Gracias” means “thank you.” (“Por favor” means please.)' },
    { prompt:'Someone says “Gracias.” How do you reply?', correct:'De nada.', distractors:['Por favor.','Adiós.','Sí.'], why:'“De nada” means “you’re welcome.”' },
    { prompt:'It’s morning. How do you greet your teacher?', correct:'Buenos días.', distractors:['Buenas noches.','Adiós.','De nada.'], why:'“Buenos días” = “good morning.” (“Buenas noches” means good night.)' },
    { prompt:'You’re leaving. What do you say?', correct:'Adiós.', distractors:['Hola.','Gracias.','Sí.'], why:'“Adiós” means “goodbye.”' },
    { prompt:'You didn’t catch what the teacher said. You could politely ask:', correct:'¿Puede repetir, por favor?', distractors:['Me llamo Sam.','Tengo un perro.','Muy bien.'], why:'“¿Puede repetir, por favor?” = “Can you repeat, please?” — perfect when you miss something.' },
    { prompt:'Someone asks “¿Cuántos años tienes?” (How old are you?)', correct:'Tengo trece años.', distractors:['Me llamo Leo.','Estoy bien.','Es rojo.'], why:'You give your age with “Tengo … años” — literally “I HAVE … years.” Spanish uses “have,” not “am.”' },
    { prompt:'You need a restroom. How do you ask?', correct:'¿Dónde está el baño?', distractors:['¿Cómo estás?','¿Qué hora es?','Me gusta el fútbol.'], why:'“¿Dónde está el baño?” = “Where is the bathroom?” — a phrase you’ll be glad to know.' },
    { prompt:'How do you say “please”?', correct:'Por favor.', distractors:['Gracias.','De nada.','Perdón.'], why:'“Por favor” means “please.”' }
  ],

  /* ───── GAME 4 · SENTENCE BUILDER ───── */
  SENTENCES: [
    { en:'I have two brothers.', words:['Yo','tengo','dos','hermanos'], note:'“Tener” (to have) is one of the most-used verbs in Spanish.' },
    { en:'My name is Ana.', words:['Me','llamo','Ana'], note:'“Me llamo…” literally means “I call myself…”.' },
    { en:'The dog is big.', words:['El','perro','es','grande'], note:'“Es” comes from “ser” (to be). The adjective “grande” follows the noun.' },
    { en:'I like soccer.', words:['Me','gusta','el','fútbol'], note:'“Me gusta” literally means “it pleases me.”' },
    { en:'She has a red car.', words:['Ella','tiene','un','coche','rojo'], note:'Notice “coche rojo” = “car red” — the color goes AFTER the noun!' },
    { en:'We speak Spanish.', words:['Nosotros','hablamos','español'], note:'“Hablamos” is the “we” form of “hablar” (to speak).' },
    { en:'The house is white.', words:['La','casa','es','blanca'], note:'“Blanca” follows the noun and matches “casa” (feminine).' },
    { en:'Today is Monday.', words:['Hoy','es','lunes'], note:'Days of the week are not capitalized in Spanish.' },
    { en:'He is my father.', words:['Él','es','mi','padre'], note:'“Mi” means “my.” “Es” again comes from “ser.”' },
    { en:'I want water, please.', words:['Quiero','agua','por','favor'], note:'“Quiero” = “I want,” from the verb “querer.”' }
  ]
};
