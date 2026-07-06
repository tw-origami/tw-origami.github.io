/* Science Lab — content data. Aimed at junior-high (grades 6–8).
 * Five games, five different skills:
 *   LABEL    → identification / spatial (tap the part on an SVG diagram)
 *   SEQUENCE → process / ordering (order the stages of a cycle)
 *   CLOZE    → reading comprehension (fill blanks from a word bank)
 *   CAUSE    → scientific reasoning (what happens next?)
 *   SORT     → classification (put the item in the right category)
 * Interactive labeling diagrams are hand-built SVG so hotspots stay exact.
 * Topic photos are decorative illustrations (Higgsfield) — never labels.
 */
window.SCI = {

  SOURCES: [
    { key:'ck12', name:'CK-12 Middle School Science',
      url:'https://www.ck12.org/c/physical-science/',
      note:'Free, standards-aligned middle-school science textbook — great for checking any of these facts.' },
    { key:'nasa', name:'NASA Science — Universe & Earth',
      url:'https://science.nasa.gov/',
      note:'Official source for the star life cycle, layers of Earth, and the water cycle.' },
    { key:'ngss', name:'Next Generation Science Standards (NGSS)',
      url:'https://www.nextgenscience.org/',
      note:'The standards most U.S. middle-school science tests are built on — cells, ecosystems, matter, Earth systems.' },
    { key:'khan', name:'Khan Academy — Middle School Biology',
      url:'https://www.khanacademy.org/science/ms-biology',
      note:'Video lessons on cells, body systems, photosynthesis and food chains.' }
  ],

  /* Real reference diagrams shown via the "See the real diagram" button in
   * Label It, plus attribution shown in the Sources popup. */
  IMAGE_CREDITS: [
    { title:'Human heart diagram', credit:'ZooFari', license:'CC BY-SA 3.0', url:'https://commons.wikimedia.org/wiki/File:Heart_diagram-en.svg' },
    { title:'Earth internal structure', credit:'IsadoraofIbiza', license:'CC BY 3.0', url:'https://commons.wikimedia.org/wiki/File:Earth_Internal_Structure.svg' },
    { title:'Animal cell structure', credit:'Mariana Ruiz (LadyofHats)', license:'Public domain', url:'https://commons.wikimedia.org/wiki/File:Animal_cell_structure_en.svg' },
    { title:'The Water Cycle', credit:'U.S. Geological Survey (USGS)', license:'Public domain', url:'https://www.usgs.gov/media/images/water-cycle-png' }
  ],

  /* Decorative topic art (generated). Used for hero + topic headers only. */
  TOPICS: {
    body:      { icon:'🫀', name:'The Human Body', img:'img/body.png' },
    plants:    { icon:'🌱', name:'Plants',         img:'img/plant.png' },
    earth:     { icon:'🌍', name:'Planet Earth',   img:'img/earth.png' },
    space:     { icon:'⭐', name:'Space & Stars',  img:'img/space.png' },
    cells:     { icon:'🔬', name:'Cells',          img:'img/cell.png' },
    ecosystem: { icon:'🦊', name:'Ecosystems',     img:'img/ecosystem.png' }
  },

  /* ───────────── GAME 1 · LABEL IT ─────────────
   * Each diagram: an SVG background + parts with hotspot x/y (in the 0–400
   * viewBox). The app draws a dot at each part; asks you to tap the one that
   * matches a function clue. viewBox is always "0 0 400 400". */
  DIAGRAMS: [
    { key:'heart', topic:'body', title:'The Human Heart',
      real:{ img:'img/ref/heart_ref.png', credit:'ZooFari, Wikimedia Commons', license:'CC BY-SA 3.0', url:'https://commons.wikimedia.org/wiki/File:Heart_diagram-en.svg' },
      note:'Simplified front view. Remember: the heart’s own left and right are mirror-flipped from yours as you look at it!',
      svg:`<defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fecdd3"/><stop offset="1" stop-color="#fb7185"/></linearGradient></defs>
        <path d="M200 360 C 90 280 60 190 60 150 C 60 95 110 70 150 70 C 180 70 195 90 200 105 C 205 90 220 70 250 70 C 290 70 340 95 340 150 C 340 190 310 280 200 360 Z" fill="url(#hg)" stroke="#9f1239" stroke-width="4"/>
        <line x1="200" y1="110" x2="200" y2="350" stroke="#9f1239" stroke-width="4"/>
        <path d="M70 175 Q 200 210 330 175" fill="none" stroke="#9f1239" stroke-width="4"/>
        <rect x="135" y="20" width="26" height="70" rx="10" fill="#60a5fa" stroke="#1d4ed8" stroke-width="3"/>
        <path d="M215 90 C 215 40 260 40 265 25" fill="none" stroke="#f87171" stroke-width="18" stroke-linecap="round"/>
        <path d="M185 90 C 185 55 165 50 160 38" fill="none" stroke="#38bdf8" stroke-width="13" stroke-linecap="round"/>`,
      parts:[
        { name:'Right Atrium', x:150, y:150, clue:'This upper chamber RECEIVES oxygen-poor blood coming back from the body.',
          fact:'The right atrium takes in "used" (oxygen-poor) blood from the vena cava and pushes it down into the right ventricle.' },
        { name:'Right Ventricle', x:150, y:265, clue:'This lower chamber PUMPS oxygen-poor blood to the lungs to pick up oxygen.',
          fact:'The right ventricle sends oxygen-poor blood through the pulmonary artery to the lungs.' },
        { name:'Left Atrium', x:250, y:150, clue:'This upper chamber RECEIVES oxygen-rich blood coming back from the lungs.',
          fact:'The left atrium collects freshly oxygenated blood from the lungs and passes it to the left ventricle.' },
        { name:'Left Ventricle', x:250, y:270, clue:'This chamber has the THICKEST walls — it pumps oxygen-rich blood to the whole body.',
          fact:'The left ventricle is the strongest chamber. It pushes blood out the aorta to every part of your body.' },
        { name:'Aorta', x:245, y:45, clue:'The body’s LARGEST artery — it carries oxygen-rich blood away from the heart.',
          fact:'The aorta is the biggest blood vessel. It carries oxygen-rich blood from the left ventricle to the whole body.' },
        { name:'Vena Cava', x:148, y:40, clue:'The largest VEIN — it brings oxygen-poor blood back to the heart from the body.',
          fact:'The vena cava returns oxygen-poor blood from the body into the right atrium.' }
      ],
      src:'khan' },

    { key:'plant', topic:'plants', title:'Parts of a Plant',
      note:'Every part has a job that keeps the plant alive and helps it make new plants.',
      svg:`<rect x="0" y="300" width="400" height="100" fill="#c8a06a"/>
        <circle cx="60" cy="55" r="34" fill="#fde047"/>
        <g stroke="#fde047" stroke-width="5"><line x1="60" y1="8" x2="60" y2="22"/><line x1="105" y1="55" x2="119" y2="55"/><line x1="93" y1="22" x2="103" y2="12"/></g>
        <rect x="192" y="120" width="16" height="185" rx="6" fill="#16a34a"/>
        <path d="M196 230 C 150 215 120 235 110 265 C 150 270 185 255 196 235 Z" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
        <path d="M204 210 C 250 195 285 215 296 245 C 255 250 218 235 204 215 Z" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
        <circle cx="200" cy="105" r="26" fill="#f472b6"/>
        <g fill="#ec4899"><circle cx="200" cy="72" r="15"/><circle cx="200" cy="138" r="15"/><circle cx="167" cy="105" r="15"/><circle cx="233" cy="105" r="15"/></g>
        <circle cx="200" cy="105" r="15" fill="#fbbf24"/>
        <g stroke="#8b5e34" stroke-width="4" fill="none"><path d="M200 305 C 190 340 170 355 150 375"/><path d="M200 305 C 205 345 220 360 245 378"/><path d="M200 305 L 200 385"/></g>`,
      parts:[
        { name:'Flower', x:200, y:105, clue:'This colorful part makes SEEDS and attracts pollinators like bees.',
          fact:'The flower is where reproduction happens — it makes seeds and its colors and smell attract pollinators.' },
        { name:'Leaves', x:280, y:232, clue:'These flat green parts make FOOD for the plant using sunlight (photosynthesis).',
          fact:'Leaves are food factories. They use sunlight, water and carbon dioxide to make sugar in photosynthesis.' },
        { name:'Stem', x:200, y:210, clue:'This part holds the plant up and CARRIES water and food between roots and leaves.',
          fact:'The stem supports the plant and works like a highway, moving water up and food around.' },
        { name:'Roots', x:200, y:355, clue:'These underground parts ANCHOR the plant and soak up water and nutrients from the soil.',
          fact:'Roots hold the plant in place and absorb water and minerals from the soil.' }
      ],
      src:'ck12' },

    { key:'earth', topic:'earth', title:'Layers of the Earth',
      real:{ img:'img/ref/earth_ref.png', credit:'IsadoraofIbiza, Wikimedia Commons', license:'CC BY 3.0', url:'https://commons.wikimedia.org/wiki/File:Earth_Internal_Structure.svg' },
      note:'From the thin crust you stand on to a solid iron ball hotter than the Sun’s surface.',
      svg:`<circle cx="200" cy="200" r="170" fill="#ea580c"/>
        <circle cx="200" cy="200" r="170" fill="none" stroke="#7c2d12" stroke-width="10"/>
        <circle cx="200" cy="200" r="100" fill="#f59e0b"/>
        <circle cx="200" cy="200" r="50" fill="#fde68a"/>
        <circle cx="200" cy="200" r="50" fill="none" stroke="#fbbf24" stroke-width="2"/>`,
      parts:[
        { name:'Crust', x:200, y:40, clue:'The THIN, solid, rocky outer shell — this is where we live.',
          fact:'The crust is Earth’s thin, solid outer layer. It’s where the oceans, continents and all life sit.' },
        { name:'Mantle', x:200, y:120, clue:'The thickest layer — hot rock that flows very slowly, driving the moving plates.',
          fact:'The mantle is a thick layer of hot, slowly-flowing rock. Its movement drags the crust’s tectonic plates.' },
        { name:'Outer Core', x:270, y:200, clue:'A layer of LIQUID iron and nickel — its swirling creates Earth’s magnetic field.',
          fact:'The outer core is liquid iron and nickel. Its motion generates the magnetic field that our compasses use.' },
        { name:'Inner Core', x:200, y:200, clue:'A SOLID ball of iron and nickel at the center — the hottest layer of all.',
          fact:'The inner core is a solid ball of iron and nickel. It’s incredibly hot but stays solid because of crushing pressure.' }
      ],
      src:'nasa' },

    { key:'cell', topic:'cells', title:'Animal Cell',
      real:{ img:'img/ref/cell_ref.png', credit:'Mariana Ruiz (LadyofHats), Wikimedia Commons', license:'Public domain', url:'https://commons.wikimedia.org/wiki/File:Animal_cell_structure_en.svg' },
      note:'A cell is like a tiny factory — each organelle is a machine with its own job.',
      svg:`<path d="M60 90 Q 40 60 90 55 Q 200 40 320 60 Q 370 70 355 130 Q 375 220 340 300 Q 320 350 240 345 Q 140 360 80 320 Q 35 290 55 200 Q 40 130 60 90 Z" fill="#fbcfe8" stroke="#db2777" stroke-width="5"/>
        <circle cx="200" cy="200" r="58" fill="#a78bfa" stroke="#6d28d9" stroke-width="4"/>
        <circle cx="212" cy="190" r="16" fill="#6d28d9"/>
        <ellipse cx="110" cy="130" rx="34" ry="18" fill="#fb923c" stroke="#c2410c" stroke-width="3" transform="rotate(-20 110 130)"/>
        <ellipse cx="300" cy="280" rx="34" ry="18" fill="#fb923c" stroke="#c2410c" stroke-width="3" transform="rotate(25 300 280)"/>
        <circle cx="300" cy="120" r="30" fill="#93c5fd" stroke="#2563eb" stroke-width="3"/>
        <g fill="#7c3aed"><circle cx="150" cy="290" r="4"/><circle cx="170" cy="300" r="4"/><circle cx="255" cy="150" r="4"/><circle cx="140" cy="230" r="4"/></g>`,
      parts:[
        { name:'Nucleus', x:200, y:200, clue:'The CONTROL CENTER — it holds the cell’s DNA and gives the orders.',
          fact:'The nucleus is the control center. It stores DNA (the instructions) and directs everything the cell does.' },
        { name:'Cell Membrane', x:350, y:180, clue:'The outer boundary — it controls what gets IN and OUT of the cell.',
          fact:'The cell membrane is a gatekeeper. It lets nutrients in and waste out, controlling what crosses.' },
        { name:'Mitochondrion', x:110, y:130, clue:'The POWERHOUSE — it turns food into usable energy for the cell.',
          fact:'Mitochondria are the powerhouses. They break down food to release energy the cell can use.' },
        { name:'Cytoplasm', x:120, y:290, clue:'The jelly-like fluid that FILLS the cell, where the organelles float.',
          fact:'Cytoplasm is the jelly filling the cell. Organelles float in it and many reactions happen here.' },
        { name:'Vacuole', x:300, y:120, clue:'A storage bubble — it holds water, food, or waste.',
          fact:'A vacuole is a storage sac for water, food or waste. In plant cells it’s huge; in animal cells it’s small.' }
      ],
      src:'ngss' },

    { key:'watercycle', topic:'earth', title:'The Water Cycle',
      real:{ img:'img/ref/water_ref.png', credit:'U.S. Geological Survey (USGS)', license:'Public domain', url:'https://www.usgs.gov/media/images/water-cycle-png' },
      note:'The Sun powers a never-ending recycling of Earth’s water.',
      svg:`<rect x="0" y="0" width="400" height="400" fill="#dbeafe"/>
        <rect x="0" y="300" width="400" height="100" fill="#3b82f6"/>
        <path d="M0 300 L120 300 L60 210 Z" fill="#6b7280"/>
        <path d="M60 300 L230 300 L150 180 Z" fill="#9ca3af"/>
        <circle cx="55" cy="55" r="34" fill="#fde047"/>
        <g stroke="#fde047" stroke-width="5"><line x1="55" y1="6" x2="55" y2="20"/><line x1="100" y1="55" x2="114" y2="55"/></g>
        <g fill="#f1f5f9" stroke="#cbd5e1" stroke-width="3"><circle cx="210" cy="95" r="30"/><circle cx="250" cy="95" r="36"/><circle cx="290" cy="100" r="28"/><rect x="205" y="95" width="90" height="30"/></g>
        <g stroke="#1e3a8a" stroke-width="4" fill="none" marker-end="url(#wa)"><path d="M330 285 C 340 210 330 170 285 140"/></g>
        <g stroke="#1d4ed8" stroke-width="4"><line x1="225" y1="135" x2="220" y2="175"/><line x1="250" y1="135" x2="245" y2="180"/><line x1="275" y1="135" x2="270" y2="170"/></g>
        <defs><marker id="wa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#1e3a8a"/></marker></defs>`,
      parts:[
        { name:'Evaporation', x:330, y:230, clue:'The Sun heats water, turning it into invisible vapor that RISES into the air.',
          fact:'Evaporation: the Sun’s heat turns liquid water into water vapor (a gas) that rises into the sky.' },
        { name:'Condensation', x:250, y:95, clue:'High up, cool vapor turns back into tiny droplets that form CLOUDS.',
          fact:'Condensation: as vapor rises and cools, it turns back into tiny liquid droplets that gather into clouds.' },
        { name:'Precipitation', x:248, y:160, clue:'Droplets join, get heavy, and FALL as rain, snow, or hail.',
          fact:'Precipitation: droplets combine until they’re heavy enough to fall as rain, snow, sleet or hail.' },
        { name:'Collection', x:340, y:350, clue:'Fallen water GATHERS in oceans, lakes, and rivers — ready to start again.',
          fact:'Collection: water gathers in oceans, lakes, rivers and underground, ready to evaporate and repeat the cycle.' }
      ],
      src:'nasa' }
  ],

  /* ───────────── GAME 2 · SEQUENCE IT ─────────────
   * Order the stages. Steps are stored in the correct order. */
  SEQUENCES: [
    { title:'Life Cycle of a Sun-like Star', icon:'⭐', topic:'space',
      note:'Our Sun is about halfway through its main-sequence life — in ~5 billion years it will become a red giant, then a white dwarf.',
      steps:[
        {icon:'☁️', text:'Nebula', desc:'A giant cloud of gas and dust in space.'},
        {icon:'🌟', text:'Protostar', desc:'Gravity pulls the cloud together until it heats up.'},
        {icon:'☀️', text:'Main-Sequence Star', desc:'Steady fusion — the long, stable adult phase (like our Sun now).'},
        {icon:'🔴', text:'Red Giant', desc:'The star runs low on fuel, swells up, and glows red.'},
        {icon:'💍', text:'Planetary Nebula', desc:'Outer layers puff away into a colorful shell of gas.'},
        {icon:'⚪', text:'White Dwarf', desc:'The hot, dense leftover core slowly cools down.'}
      ], src:'nasa' },

    { title:'Life Cycle of a Massive Star', icon:'💥', topic:'space',
      note:'Stars much bigger than the Sun end in a spectacular supernova — the source of most heavy elements in the universe.',
      steps:[
        {icon:'☁️', text:'Nebula', desc:'A huge cloud of gas and dust.'},
        {icon:'☀️', text:'Massive Star', desc:'A very large, hot main-sequence star.'},
        {icon:'🔴', text:'Red Supergiant', desc:'It swells enormously as fuel runs out.'},
        {icon:'💥', text:'Supernova', desc:'The core collapses and the star explodes.'},
        {icon:'⚫', text:'Black Hole or Neutron Star', desc:'The crushed remains — gravity so strong even light can’t escape (or a tiny dense star).'}
      ], src:'nasa' },

    { title:'Life Cycle of a Plant', icon:'🌻', topic:'plants',
      note:'A flowering plant’s cycle repeats: its seeds grow into new plants that make more seeds.',
      steps:[
        {icon:'🌰', text:'Seed', desc:'A seed lands in soil with the beginnings of a plant inside.'},
        {icon:'🌱', text:'Germination', desc:'With water and warmth, the seed sprouts a root and shoot.'},
        {icon:'🌿', text:'Seedling', desc:'A young plant grows leaves and reaches for the sun.'},
        {icon:'🪴', text:'Mature Plant', desc:'The plant grows big and strong.'},
        {icon:'🌸', text:'Flowering & Pollination', desc:'Flowers bloom; pollinators move pollen between them.'},
        {icon:'🍎', text:'Fruit & Seeds', desc:'Pollinated flowers make fruit holding new seeds — and it starts again.'}
      ], src:'ck12' },

    { title:'The Water Cycle', icon:'💧', topic:'earth',
      note:'Driven by the Sun, water endlessly cycles between the ground, the air, and back.',
      steps:[
        {icon:'☀️', text:'Evaporation', desc:'The Sun heats water into vapor that rises.'},
        {icon:'☁️', text:'Condensation', desc:'Vapor cools high up and forms clouds.'},
        {icon:'🌧️', text:'Precipitation', desc:'Water falls as rain, snow or hail.'},
        {icon:'🌊', text:'Collection', desc:'Water gathers in oceans, lakes and rivers — ready to repeat.'}
      ], src:'nasa' },

    { title:'The Rock Cycle', icon:'🪨', topic:'earth',
      note:'Rocks are constantly recycled — any rock type can slowly become another over millions of years.',
      steps:[
        {icon:'🌋', text:'Magma', desc:'Hot melted rock deep underground.'},
        {icon:'🪨', text:'Igneous Rock', desc:'Magma cools and hardens into igneous rock.'},
        {icon:'🏜️', text:'Sediment', desc:'Weathering breaks rock into tiny bits (sediment).'},
        {icon:'🧱', text:'Sedimentary Rock', desc:'Layers of sediment press together into rock.'},
        {icon:'💎', text:'Metamorphic Rock', desc:'Heat and pressure change it into metamorphic rock — which can melt back into magma.'}
      ], src:'ck12' },

    { title:'Blood Flow Through the Heart', icon:'🫀', topic:'body',
      note:'Blood makes a figure-eight: body → heart → lungs → heart → body, over and over.',
      steps:[
        {icon:'🩸', text:'Body → Vena Cava', desc:'Oxygen-poor blood returns from the body.'},
        {icon:'↘️', text:'Right Atrium', desc:'It collects in the right upper chamber.'},
        {icon:'⬇️', text:'Right Ventricle', desc:'Pushed into the right lower chamber.'},
        {icon:'🫁', text:'Lungs', desc:'Sent to the lungs to pick up oxygen.'},
        {icon:'↩️', text:'Left Atrium & Ventricle', desc:'Oxygen-rich blood returns to the heart’s left side.'},
        {icon:'🚀', text:'Aorta → Body', desc:'The left ventricle pumps it out to the whole body.'}
      ], src:'khan' },

    { title:'The Path of Digestion', icon:'🍽️', topic:'body',
      note:'Food is broken down step by step so your body can absorb the nutrients.',
      steps:[
        {icon:'👄', text:'Mouth', desc:'Teeth and saliva start breaking food down.'},
        {icon:'🧵', text:'Esophagus', desc:'A tube squeezes food down to the stomach.'},
        {icon:'🫙', text:'Stomach', desc:'Acids and muscles churn food into mush.'},
        {icon:'🌀', text:'Small Intestine', desc:'Nutrients are absorbed into the blood.'},
        {icon:'🚮', text:'Large Intestine', desc:'Water is absorbed; waste is left behind.'}
      ], src:'khan' },

    { title:'Butterfly Metamorphosis', icon:'🦋', topic:'ecosystem',
      note:'"Complete metamorphosis" means the animal totally changes form at each stage.',
      steps:[
        {icon:'🥚', text:'Egg', desc:'A butterfly lays eggs on a leaf.'},
        {icon:'🐛', text:'Larva (Caterpillar)', desc:'A hungry caterpillar hatches and eats a lot.'},
        {icon:'🛖', text:'Pupa (Chrysalis)', desc:'It forms a chrysalis and transforms inside.'},
        {icon:'🦋', text:'Adult Butterfly', desc:'A butterfly emerges, ready to fly and lay eggs.'}
      ], src:'ck12' }
  ],

  /* ───────────── GAME 3 · FILL THE BLANK ─────────────
   * text uses "___" placeholders. answers are in order. bank = answers + extra
   * distractor words. Fill blanks left-to-right by tapping the right word. */
  CLOZE: [
    { title:'Photosynthesis', topic:'plants',
      text:'Plants make their own food in a process called ___. Their ___ take in carbon dioxide from the air and water from the ___. Using energy from the ___, they turn these into ___ (food) and release ___ into the air.',
      answers:['photosynthesis','leaves','soil','Sun','sugar','oxygen'],
      bank:['photosynthesis','leaves','soil','Sun','sugar','oxygen','roots','carbon dioxide'],
      note:'Photosynthesis is why plants are called "producers" — they make food from sunlight, and give us the oxygen we breathe.',
      src:'khan' },

    { title:'How the Heart Works', topic:'body',
      text:'The heart is a muscle that pumps ___ around the body. The right side sends oxygen-poor blood to the ___ to pick up oxygen. The ___ side then pumps the oxygen-rich blood to the rest of the body through the body’s largest artery, the ___.',
      answers:['blood','lungs','left','aorta'],
      bank:['blood','lungs','left','aorta','right','vein'],
      note:'The left ventricle has the thickest walls because it has the biggest job: pushing blood to your whole body.',
      src:'khan' },

    { title:'The Water Cycle', topic:'earth',
      text:'The Sun’s heat causes ___, turning liquid water into vapor. As the vapor rises and cools, ___ forms clouds. When droplets get heavy they fall as ___. Finally the water gathers in oceans and rivers during ___.',
      answers:['evaporation','condensation','precipitation','collection'],
      bank:['evaporation','condensation','precipitation','collection','erosion'],
      note:'The whole water cycle is powered by the Sun — no sunlight, no evaporation, no cycle.',
      src:'nasa' },

    { title:'Cells', topic:'cells',
      text:'All living things are made of ___. The ___ is the control center that holds the DNA. The ___ are the "powerhouses" that make energy from food. The ___ controls what enters and leaves the cell.',
      answers:['cells','nucleus','mitochondria','cell membrane'],
      bank:['cells','nucleus','mitochondria','cell membrane','cytoplasm'],
      note:'A cell is the smallest unit of life. Every plant, animal and person is built from them.',
      src:'ngss' },

    { title:'Food Chains', topic:'ecosystem',
      text:'Energy in an ecosystem starts with the ___. ___ like grass capture that energy to make food. ___ eat plants or other animals for energy. ___ like fungi break down dead things and return nutrients to the soil.',
      answers:['Sun','Producers','Consumers','Decomposers'],
      bank:['Sun','Producers','Consumers','Decomposers','Predators'],
      note:'Every food chain traces back to the Sun — it is the original source of almost all energy on Earth.',
      src:'khan' },

    { title:'Layers of the Earth', topic:'earth',
      text:'We live on the thin, solid ___. Below it is the thick, slowly-flowing ___. Deeper still is the liquid ___, whose swirling creates Earth’s magnetic field. At the very center is the solid ___.',
      answers:['crust','mantle','outer core','inner core'],
      bank:['crust','mantle','outer core','inner core','atmosphere'],
      note:'The inner core is solid even though it’s hotter than the mantle — the crushing pressure keeps it from melting.',
      src:'nasa' }
  ],

  /* ───────────── GAME 4 · CAUSE & EFFECT ─────────────
   * A scenario → what happens next? Pick the correct outcome. */
  CAUSE: [
    { topic:'space',
      q:'A giant star much bigger than the Sun runs out of fuel and its core suddenly collapses. What happens next?',
      correct:'It explodes in a supernova.',
      distractors:['It quietly becomes a white dwarf.','It turns back into a nebula and restarts.','Nothing — it just cools off slowly.'],
      why:'When a massive star’s core collapses, the outer layers rebound and blast outward in a supernova — one of the most powerful explosions in the universe. Only big stars do this; Sun-sized stars fade to white dwarfs instead.' },

    { topic:'ecosystem',
      q:'A disease wipes out most of the rabbits in a meadow. The rabbits eat grass, and foxes eat the rabbits. What happens to the FOXES?',
      correct:'Fox numbers drop because they have less food.',
      distractors:['Fox numbers rise because there’s more grass.','Foxes are unaffected — they don’t need rabbits.','Foxes turn into producers.'],
      why:'In a food chain, energy flows upward. Fewer rabbits means less food for foxes, so the fox population falls. Meanwhile the grass may grow thicker with fewer rabbits eating it.' },

    { topic:'plants',
      q:'You put a healthy plant in a completely dark closet for two weeks. What happens?',
      correct:'It weakens and turns pale or yellow.',
      distractors:['It grows faster to escape the dark.','It stays exactly the same.','It starts making oxygen faster.'],
      why:'Plants need light for photosynthesis to make food. Without light they can’t make sugar, lose their green chlorophyll, turn pale, and eventually die.' },

    { topic:'earth',
      q:'The Sun’s energy heats the surface of a warm ocean on a sunny day. What happens to some of the water?',
      correct:'It evaporates into water vapor and rises.',
      distractors:['It freezes into ice.','It turns into sediment.','It sinks to the ocean floor.'],
      why:'Heat gives water molecules enough energy to escape as gas — evaporation. That rising vapor is the first step of the water cycle.' },

    { topic:'body',
      q:'You start sprinting to catch a bus. Your muscles suddenly need much more oxygen. What does your body do?',
      correct:'Your heart beats faster and you breathe harder.',
      distractors:['Your heart slows down to save energy.','Your digestion speeds up instead.','Nothing changes.'],
      why:'Working muscles need more oxygen and fuel. The heart pumps faster to deliver oxygen-rich blood, and your lungs breathe faster to grab more oxygen.' },

    { topic:'cells',
      q:'A cell’s mitochondria stop working. What is the cell’s biggest immediate problem?',
      correct:'It can’t make enough energy to do its jobs.',
      distractors:['It can’t hold its DNA anymore.','It floats away.','It gets too much energy.'],
      why:'Mitochondria are the powerhouses that release energy from food. Without them, the cell runs out of usable energy and can’t function.' },

    { topic:'earth',
      q:'Two of Earth’s tectonic plates slowly push against each other for millions of years along a boundary. What can form?',
      correct:'Mountains slowly build up.',
      distractors:['The ocean instantly boils.','A new planet forms.','The plates disappear.'],
      why:'When plates collide, the crust crumples and is pushed upward over a very long time, building mountain ranges like the Himalayas.' },

    { topic:'ecosystem',
      q:'Decomposers like fungi and bacteria are removed from a forest. What happens over time?',
      correct:'Dead plants and animals pile up and nutrients aren’t recycled.',
      distractors:['The forest grows twice as fast.','Nothing — they weren’t doing anything.','The Sun stops shining.'],
      why:'Decomposers break down dead things and return nutrients to the soil. Without them, dead matter builds up and plants can’t get the recycled nutrients they need.' },

    { topic:'plants',
      q:'All the bees and other pollinators vanish from an apple orchard. What happens to the apple crop?',
      correct:'Far fewer apples grow.',
      distractors:['More apples grow than ever.','Apples grow faster but smaller.','Nothing changes at all.'],
      why:'Many flowers need pollinators to move pollen so they can make fruit and seeds. No pollinators means most flowers aren’t pollinated, so far fewer apples form.' },

    { topic:'body',
      q:'Someone’s diet has almost no calcium for a long time. Which body part is most affected?',
      correct:'Their bones become weaker.',
      distractors:['Their hair changes color.','Their eyes get bigger.','Their blood turns green.'],
      why:'Calcium is a key building block of bone. Without enough of it, bones lose strength and can become brittle.' },

    { topic:'earth',
      q:'A pot of water is heated on a stove until it boils. What is happening to the water?',
      correct:'Liquid water is changing into gas (water vapor).',
      distractors:['The water is becoming a new substance.','The water is freezing.','The water is turning into oxygen.'],
      why:'Boiling is a change of state from liquid to gas. It’s a physical change — it’s still water (H₂O), just in gas form.' },

    { topic:'space',
      q:'The Moon moves directly between the Sun and the Earth, lining up perfectly. What do people on Earth see?',
      correct:'A solar eclipse — the Moon blocks the Sun.',
      distractors:['A rainbow at night.','The Sun gets brighter.','A supernova.'],
      why:'When the Moon passes directly between the Sun and Earth, it casts a shadow and blocks the Sun’s light — a solar eclipse.' },

    { topic:'ecosystem',
      q:'A new predator with no natural enemies is introduced to an island full of ground-nesting birds. What likely happens?',
      correct:'The bird population drops sharply.',
      distractors:['The birds instantly grow bigger.','The predator becomes a plant.','Nothing — islands are safe.'],
      why:'An introduced predator with no enemies and easy prey can multiply fast and devastate native species that never evolved defenses against it — a common cause of extinctions.' },

    { topic:'cells',
      q:'A single cell grows, copies its DNA, and then splits into two identical cells. What just happened?',
      correct:'Cell division (the cell reproduced).',
      distractors:['The cell died.','Photosynthesis.','Digestion.'],
      why:'Cells grow and divide to make more cells — that’s how living things grow and repair themselves. The DNA must be copied first so each new cell gets a full set.' }
  ],

  /* ───────────── GAME 5 · SORT IT ─────────────
   * Each round: an item + a set of category buckets. Pick the right one. */
  SORT: [
    // States of matter
    { item:'A block of ice 🧊', cats:['Solid','Liquid','Gas'], answer:'Solid',
      why:'Ice is water in its solid state — its particles are locked in place, so it keeps its shape.' },
    { item:'Steam from a kettle ♨️', cats:['Solid','Liquid','Gas'], answer:'Gas',
      why:'Steam is water as a gas. Its particles spread out and fill whatever space they’re in.' },
    { item:'Juice in a cup 🧃', cats:['Solid','Liquid','Gas'], answer:'Liquid',
      why:'A liquid takes the shape of its container but keeps the same volume.' },
    { item:'The air in a balloon 🎈', cats:['Solid','Liquid','Gas'], answer:'Gas',
      why:'Air is a gas — it spreads out to fill the whole balloon.' },

    // Producer / Consumer / Decomposer
    { item:'A blade of grass 🌾', cats:['Producer','Consumer','Decomposer'], answer:'Producer',
      why:'Grass is a producer — it makes its own food from sunlight through photosynthesis.' },
    { item:'A hungry rabbit 🐰', cats:['Producer','Consumer','Decomposer'], answer:'Consumer',
      why:'A rabbit can’t make its own food, so it eats plants — that makes it a consumer.' },
    { item:'A mushroom on a dead log 🍄', cats:['Producer','Consumer','Decomposer'], answer:'Decomposer',
      why:'Fungi are decomposers — they break down dead matter and recycle nutrients back into the soil.' },
    { item:'An oak tree 🌳', cats:['Producer','Consumer','Decomposer'], answer:'Producer',
      why:'Trees are producers — their leaves make food from sunlight, water and carbon dioxide.' },

    // Vertebrate / Invertebrate
    { item:'A frog 🐸', cats:['Vertebrate','Invertebrate'], answer:'Vertebrate',
      why:'A frog has a backbone (spine), so it’s a vertebrate.' },
    { item:'An earthworm 🪱', cats:['Vertebrate','Invertebrate'], answer:'Invertebrate',
      why:'Worms have no backbone, so they’re invertebrates — like insects, spiders and jellyfish.' },
    { item:'A shark 🦈', cats:['Vertebrate','Invertebrate'], answer:'Vertebrate',
      why:'Sharks have a backbone (made of cartilage), so they are vertebrates.' },
    { item:'An octopus 🐙', cats:['Vertebrate','Invertebrate'], answer:'Invertebrate',
      why:'Despite being clever, an octopus has no backbone — it’s an invertebrate.' },

    // Body systems (which system is this organ part of?)
    { item:'The stomach', cats:['Digestive','Circulatory','Respiratory','Nervous'], answer:'Digestive',
      why:'The stomach breaks down food, so it belongs to the digestive system.' },
    { item:'The lungs', cats:['Digestive','Circulatory','Respiratory','Nervous'], answer:'Respiratory',
      why:'The lungs take in oxygen and release carbon dioxide — the respiratory system.' },
    { item:'The heart', cats:['Digestive','Circulatory','Respiratory','Nervous'], answer:'Circulatory',
      why:'The heart pumps blood, so it’s the star of the circulatory system.' },
    { item:'The brain', cats:['Digestive','Circulatory','Respiratory','Nervous'], answer:'Nervous',
      why:'The brain sends and receives signals — it’s the command center of the nervous system.' },

    // Physical vs Chemical change
    { item:'Melting an ice cube 🧊', cats:['Physical Change','Chemical Change'], answer:'Physical Change',
      why:'Melting only changes the state (solid → liquid). It’s still water, so it’s a physical change.' },
    { item:'Wood burning in a fire 🔥', cats:['Physical Change','Chemical Change'], answer:'Chemical Change',
      why:'Burning makes new substances (ash, smoke, gases) and can’t be undone — a chemical change.' },
    { item:'An iron nail rusting 🔩', cats:['Physical Change','Chemical Change'], answer:'Chemical Change',
      why:'Rust is a brand-new substance formed when iron reacts with oxygen — a chemical change.' },
    { item:'Tearing a sheet of paper 📄', cats:['Physical Change','Chemical Change'], answer:'Physical Change',
      why:'Torn paper is still paper, just in pieces — only its shape changed, so it’s physical.' },

    // Living vs Nonliving
    { item:'A cactus 🌵', cats:['Living','Nonliving'], answer:'Living',
      why:'A cactus grows, needs water, and reproduces — it’s a living thing.' },
    { item:'A rock 🪨', cats:['Living','Nonliving'], answer:'Nonliving',
      why:'A rock doesn’t grow, eat, or reproduce, so it’s nonliving.' }
  ]
};
