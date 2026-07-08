/* Bio Basics — content data. Freshman biology: cells, genetics, life's systems.
 * Centerpiece = "Punnett Predictor" heredity sim. Four support games + dictionary.
 *   PUNNETT  → pick parent traits, see the offspring odds in a Punnett square
 *   CELLS    → match an organelle to its job (beyond Science Lab's basics)
 *   SEQUENCE → order life's processes: mitosis, DNA→RNA→protein, classification
 *   HEREDITY → genetics reasoning: dominant/recessive, genotype vs phenotype
 *   CLASSIFY → sort a living thing into its kingdom
 */
window.BIO = {

  SOURCES: [
    { key:'genome', name:'National Human Genome Research Institute (NIH)',
      url:'https://www.genome.gov/genetics-glossary',
      note:'The U.S. government’s genetics glossary — DNA, genes, alleles and heredity explained.' },
    { key:'khan', name:'Khan Academy — High School Biology',
      url:'https://www.khanacademy.org/science/high-school-biology',
      note:'Free lessons on cells, mitosis, DNA, genetics and classification.' },
    { key:'ck12', name:'CK-12 Biology',
      url:'https://www.ck12.org/c/biology/',
      note:'A free, standards-aligned biology textbook covering everything in this app.' },
    { key:'ngss', name:'Next Generation Science Standards (NGSS)',
      url:'https://www.nextgenscience.org/',
      note:'The life-science standards most middle- and high-school biology tests are built on.' }
  ],

  /* ───────── Biology Dictionary ───────── */
  TERMS: [
    { term:'DNA', def:'The molecule that carries the instructions for building and running a living thing.', ex:'DNA is shaped like a twisted ladder — a double helix.',
      simple:'The instruction manual inside every cell, written in a 4-letter code. It tells your body how to build everything from eye color to enzymes.' },
    { term:'Gene', def:'A section of DNA that codes for one trait or protein.', ex:'A gene for eye color.',
      simple:'One “chapter” of your DNA manual — a single instruction, like the one for whether your earlobes hang free or attach.' },
    { term:'Allele', def:'A different version of the same gene.', ex:'The brown allele (B) and the blue allele (b) of an eye-color gene.',
      simple:'A flavor of a gene. You get two of each — one from each parent — and they might match or be different.' },
    { term:'Chromosome', def:'A tightly coiled package of DNA. Humans have 46 (23 pairs).', ex:'You inherit 23 chromosomes from each parent.',
      simple:'DNA wound up tight for storage, like thread on a spool. Your cells keep their whole manual bundled into 46 of them.' },
    { term:'Genotype', def:'The exact pair of alleles an organism has for a trait (like BB, Bb, or bb).', ex:'Bb is a genotype.',
      simple:'The actual gene combo written in the DNA — the letters, like Bb. It’s the “code,” not necessarily what you can see.' },
    { term:'Phenotype', def:'The trait you can actually observe, produced by the genotype.', ex:'Brown eyes is a phenotype.',
      simple:'What actually shows up on the outside — brown eyes, tall, round seeds. Different codes (BB and Bb) can give the same look.' },
    { term:'Dominant', def:'An allele that shows up even if only one copy is present (written as a capital letter).', ex:'B (brown) is dominant over b (blue).',
      simple:'The “louder” version of a gene. If you have even one, it wins and shows. We write it as a CAPITAL letter.' },
    { term:'Recessive', def:'An allele that only shows when there are two copies (written lowercase).', ex:'Blue eyes (bb) needs two recessive alleles.',
      simple:'The “quieter” version. It only shows if BOTH of your copies are recessive — otherwise the dominant one hides it. Written lowercase.' },
    { term:'Homozygous', def:'Having two identical alleles for a trait (BB or bb).', ex:'BB and bb are both homozygous.',
      simple:'“Same-same” — your two copies match (both capital or both lowercase).' },
    { term:'Heterozygous', def:'Having two different alleles for a trait (Bb).', ex:'Bb is heterozygous.',
      simple:'“Mixed” — one dominant and one recessive copy (like Bb). The dominant one is what you’ll see.' },
    { term:'Punnett Square', def:'A grid that shows all the allele combinations offspring could inherit.', ex:'Bb × Bb gives a 3:1 ratio.',
      simple:'A little box that maps out every combo two parents could pass on, so you can predict the odds of each offspring outcome.' },
    { term:'Trait', def:'A feature of an organism, like height, color, or shape.', ex:'Seed shape is a trait.',
      simple:'Any characteristic of a living thing — the stuff genes decide, like fur color or whether you can roll your tongue.' },
    { term:'Heredity', def:'The passing of traits from parents to offspring through genes.', ex:'You inherited your hair color from your parents.',
      simple:'How features get handed down the family line — the reason you look a bit like your parents.' },
    { term:'Mitosis', def:'Cell division that makes two identical copies of a cell.', ex:'Your skin heals by mitosis.',
      simple:'How one cell splits into two exact copies — how you grow and heal. The DNA is copied first so each new cell gets a full set.' },
    { term:'Cell Cycle', def:'The full life of a cell: growing, copying its DNA, and dividing.', ex:'Interphase is the longest part.',
      simple:'The repeating loop a cell lives: grow, copy its DNA, then split. Most of the time it’s just growing (interphase).' },
    { term:'Organelle', def:'A tiny structure inside a cell with a specific job.', ex:'The nucleus and ribosomes are organelles.',
      simple:'A little “organ” inside a cell — each one is a machine with its own task, like the nucleus (control) or ribosome (build).' },
    { term:'Ribosome', def:'The organelle that builds proteins by reading RNA.', ex:'Ribosomes assemble amino acids into proteins.',
      simple:'The cell’s tiny factory that reads the RNA instructions and snaps together proteins, the workers that run your body.' },
    { term:'Protein', def:'A molecule that does most of the work in cells, built from amino acids.', ex:'Enzymes and muscle are proteins.',
      simple:'The “doers” of the cell — they build structures, carry things, and speed up reactions. Your DNA’s whole job is coding for these.' },
    { term:'Transcription', def:'Copying a gene from DNA into a messenger RNA (mRNA).', ex:'Step 1 of making a protein.',
      simple:'Making an RNA “photocopy” of one DNA instruction so it can leave the nucleus and be used.' },
    { term:'Translation', def:'Reading mRNA at a ribosome to build a protein.', ex:'Step 2 of making a protein.',
      simple:'The ribosome “reads” the RNA message and translates its code into an actual protein.' },
    { term:'Species', def:'A group of organisms that can breed and produce fertile offspring.', ex:'Dogs are one species.',
      simple:'The most specific group in classification — organisms alike enough to have babies that can also have babies.' },
    { term:'Taxonomy', def:'The science of naming and grouping living things.', ex:'Domain → Kingdom → … → Species.',
      simple:'How scientists sort every living thing into nested groups, from huge (domain) down to exact (species).' },
    { term:'Kingdom', def:'A very broad group of living things (Animals, Plants, Fungi, Protists, Bacteria).', ex:'A mushroom is in kingdom Fungi.',
      simple:'One of the biggest buckets life is sorted into. Are you dealing with an animal, a plant, a fungus, a protist, or bacteria?' }
  ],

  /* ───────── GAME 1 · PUNNETT PREDICTOR (heredity sim) ─────────
   * Handled in code. Each trait has a letter, a dominant and recessive
   * phenotype (with a color for the offspring dots). */
  PUNNETT: {
    genotypes: ['hom-dom','het','hom-rec'],   // BB, Bb, bb
    traits: [
      { id:'pea',   name:'Pea seed shape', letter:'R', emoji:'🫛',
        dom:{ label:'Round', color:'#84cc16' }, rec:{ label:'Wrinkled', color:'#a16207' },
        note:'The classic trait Gregor Mendel studied — round is dominant over wrinkled.' },
      { id:'mouse', name:'Mouse fur color', letter:'B', emoji:'🐭',
        dom:{ label:'Black fur', color:'#374151' }, rec:{ label:'White fur', color:'#e5e7eb' },
        note:'Black fur (B) is dominant; a mouse needs two recessive alleles (bb) to be white.' },
      { id:'eyes',  name:'Eye color (simplified)', letter:'B', emoji:'👁️',
        dom:{ label:'Brown eyes', color:'#78350f' }, rec:{ label:'Blue eyes', color:'#3b82f6' },
        note:'Real eye color uses many genes, but in the classic model brown is dominant over blue.' },
      { id:'tongue',name:'Tongue rolling', letter:'T', emoji:'👅',
        dom:{ label:'Can roll', color:'#ec4899' }, rec:{ label:'Can’t roll', color:'#f9a8d4' },
        note:'Being able to roll your tongue is treated as dominant (T) in classic genetics.' },
      { id:'dragon',name:'Dragon fire-breathing', letter:'F', emoji:'🐉',
        dom:{ label:'Breathes fire', color:'#ef4444' }, rec:{ label:'No fire', color:'#60a5fa' },
        note:'A fun made-up trait — fire-breathing (F) is dominant over no fire (f).' }
    ],
    /* Guided lesson: predict → build the square → explain, changing ONE parent
     * at a time from a fixed baseline. Free play is the graduation step. */
    lesson: [
      { head:'🧬 Meet the Punnett square',
        body:'Every offspring gets <b>one allele from each parent</b>. A Punnett square maps out every possible combo so you can predict the odds. Round (R) is <b>dominant</b>; a pea only looks wrinkled with two recessives (rr). Let’s cross two hybrids: <b>Rr × Rr</b>.',
        trait:'pea', p1:'het', p2:'het',
        predictQ:'Both parents are Rr — round, but each carries a hidden r. Most of their offspring will be…',
        options:[{t:'Mostly round',ok:true},{t:'Mostly wrinkled',ok:false},{t:'Exactly half and half',ok:false}],
        explain:'The four boxes are RR, Rr, Rr, rr. Three of them have at least one R, so <b>3/4 are round</b> and only 1/4 (rr) is wrinkled — the famous <b>3:1 ratio</b>.' },
      { head:'🔬 Change just ONE parent',
        body:'Keep parent 1 as <b>Rr</b>, but make parent 2 <b>rr</b> (wrinkled). Scientists call this a “test cross.” Changing one thing lets us see exactly what it does to the odds.',
        trait:'pea', p1:'het', p2:'hom-rec',
        predictQ:'Now it’s Rr × rr. What share of the offspring will be wrinkled (rr)?',
        options:[{t:'About half',ok:true},{t:'None of them',ok:false},{t:'Three out of four',ok:false}],
        explain:'The square gives Rr, Rr, rr, rr — <b>2/4 round and 2/4 wrinkled</b>, a 1:1 split. Swapping one parent to rr doubled the wrinkled odds versus the last cross.' },
      { head:'👀 Where recessives hide',
        body:'Now cross a <b>purebred round</b> plant (RR) with a <b>wrinkled</b> one (rr). They look completely different — so what will their offspring look like?',
        trait:'pea', p1:'hom-dom', p2:'hom-rec',
        predictQ:'RR × rr. The offspring will be…',
        options:[{t:'All round — but each secretly carries an r',ok:true},{t:'All wrinkled',ok:false},{t:'Half round, half wrinkled',ok:false}],
        explain:'Every box is Rr, so <b>all 4 look round</b> — the dominant R hides the r. But each one is a “carrier.” Cross two of these and wrinkled comes back (that was step 1!).' },
      { head:'🫛 Two recessives',
        body:'Last experiment: cross two <b>wrinkled</b> plants (rr × rr). With no R anywhere to hide the trait, what happens?',
        trait:'pea', p1:'hom-rec', p2:'hom-rec',
        predictQ:'rr × rr. The offspring will be…',
        options:[{t:'All wrinkled',ok:true},{t:'All round',ok:false},{t:'A 3:1 mix',ok:false}],
        explain:'Every box is rr, so <b>all 4 are wrinkled</b>. A recessive trait “breeds true” — two recessive parents can only make recessive offspring.' },
      { free:true, head:'🎓 You’re the geneticist!',
        body:'You’ve got it! Now experiment freely: pick any trait, set each parent’s genotype, and try to make all-dominant offspring, all-recessive, or a perfect 3:1 ratio.' }
    ]
  },

  /* ───────── GAME 2 · CELL COMMAND (organelle → job) ───────── */
  CELLS: [
    { name:'Nucleus', icon:'🧠', clue:'the CONTROL center that stores the DNA and gives the orders' },
    { name:'Ribosome', icon:'🏭', clue:'the tiny factory that BUILDS proteins by reading RNA' },
    { name:'Mitochondria', icon:'🔋', clue:'the POWERHOUSE that releases energy from food' },
    { name:'Endoplasmic Reticulum', icon:'🛣️', clue:'the folded “highway” that makes and moves proteins and fats around the cell' },
    { name:'Golgi Apparatus', icon:'📦', clue:'the PACKAGING center that wraps and ships proteins where they need to go' },
    { name:'Lysosome', icon:'♻️', clue:'the CLEANUP crew that digests waste and worn-out parts' },
    { name:'Cell Membrane', icon:'🚪', clue:'the GATEKEEPER that controls what enters and leaves the cell' },
    { name:'Vacuole', icon:'🫙', clue:'the STORAGE tank for water, food, or waste (huge in plant cells)' },
    { name:'Chloroplast', icon:'🌿', clue:'where PHOTOSYNTHESIS happens — only in plant cells — turning sunlight into food' },
    { name:'Cell Wall', icon:'🧱', clue:'the stiff outer SUPPORT layer around plant cells that gives them shape' },
    { name:'Cytoplasm', icon:'🌊', clue:'the jelly-like fluid that FILLS the cell and holds the organelles' },
    { name:'Chromosome', icon:'🧬', clue:'the tightly coiled PACKAGE of DNA inside the nucleus' }
  ],

  /* ───────── GAME 3 · SEQUENCE IT (order life's processes) ───────── */
  SEQUENCES: [
    { title:'The Cell Cycle & Mitosis', icon:'🔬',
      note:'A memory trick for the mitosis phases: “IPed My Ants” — Interphase, Prophase, Metaphase, Anaphase, Telophase.',
      steps:[
        {icon:'🌱', text:'Interphase', desc:'The cell grows and copies its DNA (the longest phase).'},
        {icon:'🧶', text:'Prophase', desc:'The DNA coils into visible chromosomes.'},
        {icon:'➖', text:'Metaphase', desc:'Chromosomes line up in the Middle of the cell.'},
        {icon:'↔️', text:'Anaphase', desc:'The chromosome copies are pulled Apart to opposite ends.'},
        {icon:'👯', text:'Telophase', desc:'Two new nuclei form, one at each end.'},
        {icon:'✂️', text:'Cytokinesis', desc:'The cell pinches in two — now there are two identical cells.'}
      ], src:'khan' },

    { title:'DNA → RNA → Protein (Central Dogma)', icon:'🧬',
      note:'The “central dogma” of biology: DNA is copied to RNA (transcription), and RNA is read to build protein (translation).',
      steps:[
        {icon:'📖', text:'DNA', desc:'The master instructions, stored safely in the nucleus.'},
        {icon:'✍️', text:'Transcription', desc:'One gene is copied into a messenger RNA (mRNA).'},
        {icon:'📨', text:'mRNA leaves the nucleus', desc:'The RNA copy carries the message out to the cytoplasm.'},
        {icon:'🏭', text:'Translation at a ribosome', desc:'A ribosome reads the mRNA code, three letters at a time.'},
        {icon:'🧱', text:'Protein is built', desc:'Amino acids link into a protein — the finished product.'}
      ], src:'genome' },

    { title:'Classifying Life (Kingdom → Species)', icon:'🌳',
      note:'Mnemonic: “Dear King Philip Came Over For Good Soup” — Domain, Kingdom, Phylum, Class, Order, Family, Genus, Species.',
      steps:[
        {icon:'🌍', text:'Domain', desc:'The broadest group of all (like Eukarya).'},
        {icon:'👑', text:'Kingdom', desc:'e.g., Animals, Plants, Fungi.'},
        {icon:'🧩', text:'Phylum', desc:'A big group within a kingdom (e.g., animals with backbones).'},
        {icon:'🏫', text:'Class', desc:'e.g., Mammals.'},
        {icon:'📋', text:'Order', desc:'e.g., Carnivores.'},
        {icon:'👪', text:'Family', desc:'e.g., the dog family.'},
        {icon:'🏷️', text:'Genus', desc:'A small group of very similar species.'},
        {icon:'🐕', text:'Species', desc:'One exact kind of organism — the most specific level.'}
      ], src:'ck12' },

    { title:'Levels of Organization', icon:'🏗️',
      note:'Life is built up in levels: small parts combine into bigger working wholes.',
      steps:[
        {icon:'🔬', text:'Cell', desc:'The smallest unit of life.'},
        {icon:'🧵', text:'Tissue', desc:'A group of similar cells working together (like muscle).'},
        {icon:'❤️', text:'Organ', desc:'Different tissues teaming up (like the heart).'},
        {icon:'🫁', text:'Organ System', desc:'Organs working together (like the circulatory system).'},
        {icon:'🧍', text:'Organism', desc:'All the systems together make one living thing.'}
      ], src:'ngss' }
  ],

  /* ───────── GAME 4 · HEREDITY (genetics reasoning) ───────── */
  HEREDITY: [
    { q:'In genetics, what does a CAPITAL letter (like B) stand for?',
      correct:'A dominant allele', distractors:['A recessive allele','A chromosome','A protein'],
      why:'Capital letters mark dominant alleles — the version that shows up even if you only have one copy. Lowercase (b) is recessive.' },
    { q:'A pea plant’s genotype is Bb. What do we call having two DIFFERENT alleles like this?',
      correct:'Heterozygous', distractors:['Homozygous','Recessive','A phenotype'],
      why:'Two different alleles (one dominant, one recessive) is heterozygous. Two matching alleles (BB or bb) would be homozygous.' },
    { q:'Brown (B) is dominant over blue (b). Which genotype gives BLUE eyes?',
      correct:'bb', distractors:['BB','Bb','Any of them'],
      why:'A recessive trait like blue eyes only shows when BOTH alleles are recessive (bb). One B would make the eyes brown.' },
    { q:'The genotype is the code (like Bb). What is the PHENOTYPE?',
      correct:'The trait you can actually see (like brown eyes)', distractors:['The pair of alleles','The DNA molecule','A type of cell'],
      why:'Genotype is the gene combo (Bb); phenotype is the visible result (brown eyes). Different genotypes can share a phenotype.' },
    { q:'Cross Bb × Bb. What fraction of offspring show the DOMINANT trait?',
      correct:'3 out of 4', distractors:['1 out of 4','2 out of 4','4 out of 4'],
      why:'Bb × Bb gives 1 BB, 2 Bb, and 1 bb. Three of those four have at least one B, so 3/4 show the dominant trait — the classic 3:1 ratio.' },
    { q:'Cross Bb × bb. What fraction of offspring show the RECESSIVE trait?',
      correct:'2 out of 4', distractors:['1 out of 4','3 out of 4','0 out of 4'],
      why:'Bb × bb gives Bb, Bb, bb, bb — half are bb, so 2/4 (one half) show the recessive trait.' },
    { q:'Which genotype is HOMOZYGOUS dominant?',
      correct:'BB', distractors:['Bb','bb','Bo'],
      why:'Homozygous means two matching alleles. BB is homozygous dominant; bb is homozygous recessive; Bb is heterozygous.' },
    { q:'You inherit your alleles from…',
      correct:'One from each parent', distractors:['Only your mother','Only your father','You make them up yourself'],
      why:'For each gene you get one allele from each parent, which is why you can be a mix of both.' },
    { q:'Two brown-eyed parents (both Bb) have a blue-eyed child. How?',
      correct:'Each parent passed down their hidden recessive b allele', distractors:['That’s impossible','The child’s genes changed','Only one parent has genes'],
      why:'Both parents are Bb — they look brown but each carries a hidden b. If both pass the b, the child is bb (blue). That’s a recessive trait skipping a generation.' },
    { q:'A “carrier” for a recessive trait is someone who…',
      correct:'Has one recessive allele but doesn’t show the trait', distractors:['Shows the recessive trait','Has no alleles for it','Can never pass it on'],
      why:'A carrier is heterozygous (like Bb): the dominant allele hides the recessive one, but they can still pass the recessive allele to their kids.' },
    { q:'If a trait shows up in every generation and one copy is enough to see it, the trait is probably…',
      correct:'Dominant', distractors:['Recessive','A phenotype','A chromosome'],
      why:'Dominant traits appear whenever at least one dominant allele is present, so they tend to show in every generation.' },
    { q:'In a Punnett square, what goes along the top and side?',
      correct:'The alleles each parent can pass on', distractors:['The finished offspring','The parents’ full bodies','Random letters'],
      why:'You put one parent’s two possible alleles across the top and the other parent’s down the side; the boxes show every combination the offspring could get.' }
  ],

  /* ───────── GAME 5 · CLASSIFY IT (which kingdom?) ───────── */
  KINGDOMS: {
    Animal:{ icon:'🦊', desc:'Many-celled, eats other things for food, and usually moves.' },
    Plant:{ icon:'🌳', desc:'Many-celled, makes its own food from sunlight, has cell walls.' },
    Fungi:{ icon:'🍄', desc:'Absorbs nutrients from other things (often decomposers); includes mushrooms, molds and yeast.' },
    Protist:{ icon:'🦠', desc:'Mostly tiny, simple organisms that don’t fit the other groups — like amoebas and algae.' },
    Bacteria:{ icon:'🧫', desc:'Single-celled organisms with no nucleus — the tiniest and most ancient life.' }
  },
  CLASSIFY: [
    { item:'🐕 A dog', kingdom:'Animal' },
    { item:'🌳 An oak tree', kingdom:'Plant' },
    { item:'🍄 A mushroom', kingdom:'Fungi' },
    { item:'🦠 An amoeba', kingdom:'Protist' },
    { item:'🧫 E. coli in your gut', kingdom:'Bacteria' },
    { item:'🌹 A rose bush', kingdom:'Plant' },
    { item:'🍞 The mold growing on old bread', kingdom:'Fungi' },
    { item:'🐬 A dolphin', kingdom:'Animal' },
    { item:'🫧 Green pond algae', kingdom:'Protist' },
    { item:'🥖 The yeast that makes bread rise', kingdom:'Fungi' },
    { item:'🦅 An eagle', kingdom:'Animal' },
    { item:'🌵 A cactus', kingdom:'Plant' },
    { item:'🦷 The bacteria that cause cavities', kingdom:'Bacteria' },
    { item:'🐝 A honeybee', kingdom:'Animal' }
  ]
};
