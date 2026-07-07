/* Chem Basics — content data. Prep for freshman chemistry.
 * Four INTERACTIVE games:
 *   ATOM     → build an atom particle-by-particle; the element updates live
 *   MOLECULE → build a molecule to match a chemical formula (read subscripts)
 *   BALANCE  → set coefficients so an equation balances (live atom counts)
 *   PH       → drag a marker to estimate a substance's pH (acids & bases)
 */
window.CHEM = {

  TEACHER: {
    atom: {
      how:'Use the + and − buttons to add or remove protons, neutrons, and electrons. Watch the atom on the left change — and the element name change with it. Try to build the element the challenge asks for (match the number of protons).',
      point:'Everything in chemistry starts with the atom. Letting kids add and remove particles and see the element change makes the abstract feel real.',
      learn:'Protons decide WHICH element it is, neutrons change the mass (making isotopes), and electrons change the charge (making ions).',
      explore:'Ask: “What’s the ONE particle you have to change to make a brand-new element?” (Protons.) Then have them find that element on a periodic table and read its atomic number.'
    },
    molecule: {
      how:'Read the chemical formula at the top. Tap atoms from the palette to add them to the tray until you have exactly the right number of each — the little subscript number tells you how many. Get every count right to build the molecule.',
      point:'A chemical formula is a recipe. Reading those little subscript numbers correctly is a skill kids use in every chemistry unit.',
      learn:'How to read a chemical formula: the symbol tells you the element, the small subscript tells you how many atoms of it.',
      explore:'Ask: “What does the little 2 in H₂O mean — and where is it?” Then have them write the formula for a molecule with 1 carbon and 4 hydrogens (CH₄).'
    },
    balance: {
      how:'Change the big number (coefficient) in front of each molecule with the + and − buttons. The counters show how many of each atom are on the left vs. the right. Make both sides equal — that’s a balanced equation.',
      point:'Matter can’t be created or destroyed, so every atom on the left must appear on the right. Balancing makes that law of conservation visible and tactile.',
      learn:'Balancing chemical equations by adjusting coefficients until the atom counts match — and why the counts must match (conservation of mass).',
      explore:'Ask: “Where did the extra atom come from?” Every unbalanced equation breaks a law of nature. Have them count the atoms on each side before touching a number.'
    },
    ph: {
      how:'A substance appears with its name. Drag the marker along the color scale to guess its pH — low numbers are acids (red), 7 is neutral (green), high numbers are bases (blue). Press Check to see how close you were.',
      point:'The pH scale sorts the everyday world into acids and bases. Placing real substances on it builds intuition kids keep for life.',
      learn:'Reading the pH scale (0–14): below 7 is acidic, 7 is neutral, above 7 is basic — and roughly where common substances fall.',
      explore:'Ask: “Is your favorite drink an acid or a base?” (Most sodas and juices are acids!) Then look up the pH of shampoo or soap and see if the label brags about it.'
    }
  },

  SOURCES: [
    { key:'ck12', name:'CK-12 — Chemistry',
      url:'https://www.ck12.org/c/chemistry/', note:'Free, standards-aligned chemistry textbook — atoms, the periodic table, formulas, and reactions.' },
    { key:'khan', name:'Khan Academy — Chemistry',
      url:'https://www.khanacademy.org/science/chemistry', note:'Video lessons on atomic structure, balancing equations, acids and bases, and more.' },
    { key:'ptable', name:'Ptable — Interactive Periodic Table',
      url:'https://ptable.com/', note:'A clickable periodic table to look up any element’s protons, mass, and properties.' }
  ],

  /* ───── Glossary (📖 popup) ───── */
  TERMS: [
    { term:'Atom', def:'The smallest unit of an element that still counts as that element.', simple:'The basic building block of everything. Break it apart and it stops being that element.', ex:'A single atom of gold is still gold.' },
    { term:'Proton', def:'A positively charged particle in the nucleus of an atom.', simple:'A “plus” particle in the center. The NUMBER of protons is what makes an element that element.', ex:'Every carbon atom has exactly 6 protons.' },
    { term:'Neutron', def:'A particle with no charge, found in the nucleus.', simple:'A no-charge particle in the center that adds mass. Change the neutrons and you get an “isotope.”', ex:'Carbon-12 has 6 neutrons; carbon-14 has 8.' },
    { term:'Electron', def:'A tiny negatively charged particle that orbits the nucleus.', simple:'A “minus” particle zipping around the outside. Add or remove one and the atom becomes charged (an ion).', ex:'Electrons are what flow through a wire as electricity.' },
    { term:'Atomic number', def:'The number of protons in an atom, which identifies the element.', simple:'Just the count of protons. It’s the element’s ID badge — carbon is always #6.', ex:'Oxygen’s atomic number is 8.' },
    { term:'Mass number', def:'The total number of protons plus neutrons in an atom.', simple:'Protons + neutrons. It tells you how heavy the atom is.', ex:'Carbon-12 = 6 protons + 6 neutrons.' },
    { term:'Isotope', def:'Atoms of the same element with different numbers of neutrons.', simple:'Same element, different weight — you changed the neutrons, not the protons.', ex:'Carbon-12 and carbon-14 are isotopes of carbon.' },
    { term:'Ion', def:'An atom with a positive or negative charge from losing or gaining electrons.', simple:'An atom that’s no longer balanced — it lost electrons (+) or gained them (−).', ex:'Na⁺ is a sodium atom that lost one electron.' },
    { term:'Element', def:'A pure substance made of only one kind of atom.', simple:'A single type of atom — one of the ~118 boxes on the periodic table.', ex:'Gold, oxygen, and iron are all elements.' },
    { term:'Molecule', def:'Two or more atoms bonded together.', simple:'Atoms stuck together into a unit — like tiny LEGO builds.', ex:'O₂ (two oxygen atoms) is a molecule.' },
    { term:'Compound', def:'A substance made of two or more DIFFERENT elements bonded together.', simple:'A molecule with more than one kind of element in it.', ex:'Water (H₂O) is a compound of hydrogen and oxygen.' },
    { term:'Chemical formula', def:'A shorthand showing which atoms, and how many, are in a substance.', simple:'A recipe written in symbols and numbers.', ex:'H₂O = 2 hydrogen atoms + 1 oxygen atom.' },
    { term:'Subscript', def:'The small number after a symbol showing how many of that atom there are.', simple:'The little low number that means “how many.” No number means just one.', ex:'The 2 in H₂O means two hydrogens.' },
    { term:'Coefficient', def:'The big number in front of a formula, showing how many of that whole molecule.', simple:'The full-size number in front — it multiplies the ENTIRE molecule after it.', ex:'2H₂O means two whole water molecules.' },
    { term:'Reactant', def:'A starting substance in a chemical reaction (left of the arrow).', simple:'The “before” ingredients that go into a reaction.', ex:'In H₂ + O₂ → H₂O, the reactants are H₂ and O₂.' },
    { term:'Product', def:'A substance made by a chemical reaction (right of the arrow).', simple:'The “after” — what you end up with.', ex:'In H₂ + O₂ → H₂O, the product is H₂O.' },
    { term:'pH', def:'A 0–14 scale measuring how acidic or basic a substance is.', simple:'A number line for acids and bases: under 7 = acid, 7 = neutral, over 7 = base.', ex:'Lemon juice ≈ 2 (acid); soap ≈ 10 (base).' },
    { term:'Acid', def:'A substance with a pH below 7; often sour and reactive.', simple:'Low on the pH scale — think lemon juice, vinegar, stomach acid.', ex:'Vinegar has a pH around 3.' },
    { term:'Base', def:'A substance with a pH above 7; often slippery and bitter.', simple:'High on the pH scale — think soap, baking soda, bleach.', ex:'Baking soda has a pH around 9.' }
  ],

  /* ───── GAME 1 · ATOM BUILDER ─────
   * Elements 1–20 with symbol, name, and the neutrons of the common isotope. */
  ELEMENTS: [
    null,
    { sym:'H',  name:'Hydrogen',  n:0 },  { sym:'He', name:'Helium',    n:2 },
    { sym:'Li', name:'Lithium',   n:4 },  { sym:'Be', name:'Beryllium', n:5 },
    { sym:'B',  name:'Boron',     n:6 },  { sym:'C',  name:'Carbon',    n:6 },
    { sym:'N',  name:'Nitrogen',  n:7 },  { sym:'O',  name:'Oxygen',    n:8 },
    { sym:'F',  name:'Fluorine',  n:10 }, { sym:'Ne', name:'Neon',      n:10 },
    { sym:'Na', name:'Sodium',    n:12 }, { sym:'Mg', name:'Magnesium', n:12 },
    { sym:'Al', name:'Aluminum',  n:14 }, { sym:'Si', name:'Silicon',   n:14 },
    { sym:'P',  name:'Phosphorus',n:16 }, { sym:'S',  name:'Sulfur',    n:16 },
    { sym:'Cl', name:'Chlorine',  n:18 }, { sym:'Ar', name:'Argon',     n:22 },
    { sym:'K',  name:'Potassium', n:20 }, { sym:'Ca', name:'Calcium',   n:20 }
  ],
  SHELLS: [2, 8, 8, 2],   // electron capacity per shell (simplified for 1–20)

  /* ───── GAME 2 · MOLECULE LAB ───── */
  ATOM_PALETTE: [
    { sym:'H',  fill:'#e2e8f0', text:'#334155' },
    { sym:'C',  fill:'#334155', text:'#ffffff' },
    { sym:'N',  fill:'#3b82f6', text:'#ffffff' },
    { sym:'O',  fill:'#ef4444', text:'#ffffff' },
    { sym:'Na', fill:'#a855f7', text:'#ffffff' },
    { sym:'Cl', fill:'#22c55e', text:'#ffffff' }
  ],
  MOLECULES: [
    { name:'Water',            formula:'H₂O',  atoms:{H:2,O:1} },
    { name:'Carbon dioxide',   formula:'CO₂',  atoms:{C:1,O:2} },
    { name:'Methane',          formula:'CH₄',  atoms:{C:1,H:4} },
    { name:'Ammonia',          formula:'NH₃',  atoms:{N:1,H:3} },
    { name:'Table salt',       formula:'NaCl', atoms:{Na:1,Cl:1} },
    { name:'Oxygen gas',       formula:'O₂',   atoms:{O:2} },
    { name:'Hydrogen chloride',formula:'HCl',  atoms:{H:1,Cl:1} },
    { name:'Hydrogen peroxide',formula:'H₂O₂', atoms:{H:2,O:2} }
  ],

  /* ───── GAME 3 · BALANCE IT ─────
   * terms flattened L then R; answer = smallest whole-number coefficients. */
  EQUATIONS: [
    { terms:[{f:'H₂',side:'L',c:{H:2}},{f:'O₂',side:'L',c:{O:2}},{f:'H₂O',side:'R',c:{H:2,O:1}}], answer:[2,1,2] },
    { terms:[{f:'C',side:'L',c:{C:1}},{f:'O₂',side:'L',c:{O:2}},{f:'CO₂',side:'R',c:{C:1,O:2}}], answer:[1,1,1] },
    { terms:[{f:'N₂',side:'L',c:{N:2}},{f:'H₂',side:'L',c:{H:2}},{f:'NH₃',side:'R',c:{N:1,H:3}}], answer:[1,3,2] },
    { terms:[{f:'Na',side:'L',c:{Na:1}},{f:'Cl₂',side:'L',c:{Cl:2}},{f:'NaCl',side:'R',c:{Na:1,Cl:1}}], answer:[2,1,2] },
    { terms:[{f:'CH₄',side:'L',c:{C:1,H:4}},{f:'O₂',side:'L',c:{O:2}},{f:'CO₂',side:'R',c:{C:1,O:2}},{f:'H₂O',side:'R',c:{H:2,O:1}}], answer:[1,2,1,2] },
    { terms:[{f:'H₂O₂',side:'L',c:{H:2,O:2}},{f:'H₂O',side:'R',c:{H:2,O:1}},{f:'O₂',side:'R',c:{O:2}}], answer:[2,2,1] }
  ],

  /* ───── GAME 4 · pH SCALE ───── */
  PH_SUBSTANCES: [
    { name:'Battery acid', emoji:'🔋', ph:1 },
    { name:'Lemon juice',  emoji:'🍋', ph:2 },
    { name:'Vinegar',      emoji:'🧴', ph:3 },
    { name:'Tomato',       emoji:'🍅', ph:4 },
    { name:'Black coffee', emoji:'☕', ph:5 },
    { name:'Milk',         emoji:'🥛', ph:6 },
    { name:'Pure water',   emoji:'💧', ph:7 },
    { name:'Baking soda',  emoji:'🧁', ph:9 },
    { name:'Hand soap',    emoji:'🧼', ph:10 },
    { name:'Ammonia',      emoji:'🧽', ph:11 },
    { name:'Bleach',       emoji:'🧯', ph:13 }
  ]
};
