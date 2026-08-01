// PokéLearn — hand-authored teaching content.
//
// Everything in dex.js comes from PokéAPI. Everything HERE is written by hand,
// because no API carries it: what the pieces of a Pokémon name actually mean,
// and which real animal, plant, object or myth each design started from.
//
// Accuracy rule for both lists: if an origin is disputed or guesswork, it is
// left out rather than invented. Every natural-history fact describes the REAL
// organism, not the Pokémon.
//
// PL_NAMES     — name etymology for the Name Forge game.
// PL_CREATURES — real-world basis, habitat and adaptation for Creature Connection.

window.PL_NAMES = [
  { id: 1, name: 'Bulbasaur',
    parts: [
      { text: 'Bulb', mean: 'a round plant root that sprouts, like a tulip bulb', src: 'English' },
      { text: 'asaur', mean: 'lizard — from Greek "sauros", the same root in dinosaur', src: 'Greek' }
    ],
    why: 'A little dinosaur-like creature with a plant bulb growing on its back.',
    root: 'saur', rootMean: 'lizard', rootWords: ['dinosaur', 'tyrannosaur', 'sauropod'] },

  { id: 2, name: 'Ivysaur',
    parts: [
      { text: 'Ivy', mean: 'a climbing vine that creeps up walls and trees', src: 'English' },
      { text: 'saur', mean: 'lizard — from Greek "sauros"', src: 'Greek' }
    ],
    why: 'The bulb has opened into a bud, and vines now grow along its reptile body.',
    root: 'saur', rootMean: 'lizard', rootWords: ['dinosaur', 'stegosaur', 'sauropod'] },

  { id: 3, name: 'Venusaur',
    parts: [
      { text: 'Venu', mean: 'from the Venus flytrap, a plant that snaps shut on bugs', src: 'English' },
      { text: 'saur', mean: 'lizard — from Greek "sauros"', src: 'Greek' }
    ],
    why: 'A huge plant-lizard with a giant flower blooming on its back.',
    root: 'saur', rootMean: 'lizard', rootWords: ['dinosaur', 'tyrannosaur', 'sauropod'] },

  { id: 4, name: 'Charmander',
    parts: [
      { text: 'Char', mean: 'to burn something until it turns black', src: 'English' },
      { text: 'mander', mean: 'from salamander, a small lizard-shaped amphibian', src: 'English' }
    ],
    why: 'A little salamander with a flame burning on the tip of its tail.',
    root: 'char', rootMean: 'burn, scorch', rootWords: ['charcoal', 'charred', 'charbroil'] },

  { id: 5, name: 'Charmeleon',
    parts: [
      { text: 'Char', mean: 'to burn something until it turns black', src: 'English' },
      { text: 'meleon', mean: 'from chameleon, a lizard that changes color', src: 'English' }
    ],
    why: 'It has changed color from orange to red as it grew hotter and fiercer.',
    root: 'char', rootMean: 'burn, scorch', rootWords: ['charcoal', 'charred', 'charbroil'] },

  { id: 6, name: 'Charizard',
    parts: [
      { text: 'Char', mean: 'to burn something until it turns black', src: 'English' },
      { text: 'izard', mean: 'from lizard, a scaly reptile with four legs and a tail', src: 'English' }
    ],
    why: 'A winged fire-breathing lizard that can scorch anything in its path.',
    root: 'char', rootMean: 'burn, scorch', rootWords: ['charcoal', 'charred', 'charbroil'] },

  { id: 7, name: 'Squirtle',
    parts: [
      { text: 'Squir', mean: 'from squirt, to shoot a thin jet of water', src: 'English' },
      { text: 'tle', mean: 'from turtle, a reptile that carries a hard shell', src: 'English' }
    ],
    why: 'A baby turtle that squirts water out of its mouth.' },

  { id: 8, name: 'Wartortle',
    parts: [
      { text: 'War', mean: 'fighting between armies — here it means battle-ready', src: 'English' },
      { text: 'tortle', mean: 'a blend of tortoise and turtle, both shelled reptiles', src: 'English' }
    ],
    why: 'A tougher, battle-hardened turtle with a furry tail and ears.' },

  { id: 9, name: 'Blastoise',
    parts: [
      { text: 'Blast', mean: 'a sudden powerful burst, like a blast of air or water', src: 'English' },
      { text: 'oise', mean: 'from tortoise, a slow land turtle with a heavy shell', src: 'English' }
    ],
    why: 'A tortoise with water cannons in its shell that blast jets at enemies.',
    root: 'blast', rootMean: 'a bursting rush of air or force', rootWords: ['blastoff', 'sandblast', 'blastwave'] },

  { id: 11, name: 'Metapod',
    parts: [
      { text: 'Meta', mean: 'change — from Greek "meta", as in metamorphosis', src: 'Greek' },
      { text: 'pod', mean: 'a closed case that holds something growing inside, like a pea pod', src: 'English' }
    ],
    why: 'It is a hard cocoon that sits still while the bug inside changes shape.',
    root: 'meta', rootMean: 'change', rootWords: ['metamorphosis', 'metabolism'] },

  { id: 12, name: 'Butterfree',
    parts: [
      { text: 'Butter', mean: 'from butterfly, an insect with big colorful wings', src: 'English' },
      { text: 'free', mean: 'able to go anywhere, not trapped', src: 'English' }
    ],
    why: 'It breaks free of its cocoon and flies away as a butterfly.' },

  { id: 15, name: 'Beedrill',
    parts: [
      { text: 'Bee', mean: 'a buzzing insect with a stinger', src: 'English' },
      { text: 'drill', mean: 'a spinning tool that bores holes', src: 'English' }
    ],
    why: 'A giant bee with drill-shaped stingers on its arms and tail.' },

  { id: 25, name: 'Pikachu',
    parts: [
      { text: 'Pika', mean: 'from "pikapika", the Japanese sound-word for sparkling electricity', src: 'Japanese' },
      { text: 'chu', mean: 'the Japanese sound a mouse makes, like "squeak"', src: 'Japanese' }
    ],
    why: 'An electric mouse whose cheeks crackle and spark.' },

  { id: 26, name: 'Raichu',
    parts: [
      { text: 'Rai', mean: 'thunder — the Japanese word "rai"', src: 'Japanese' },
      { text: 'chu', mean: 'the Japanese sound a mouse makes, like "squeak"', src: 'Japanese' }
    ],
    why: 'The grown-up electric mouse, powerful enough to throw thunder.' },

  { id: 27, name: 'Sandshrew',
    parts: [
      { text: 'Sand', mean: 'tiny grains of rock that cover deserts and beaches', src: 'English' },
      { text: 'shrew', mean: 'a small burrowing animal with a pointed nose', src: 'English' }
    ],
    why: 'A little digging animal that lives in dry, sandy ground.' },

  { id: 37, name: 'Vulpix',
    parts: [
      { text: 'Vul', mean: 'from Latin "vulpes", meaning fox', src: 'Latin' },
      { text: 'pix', mean: 'from six, the number of tails it has', src: 'English' }
    ],
    why: 'A fox with six curled tails.' },

  { id: 38, name: 'Ninetales',
    parts: [
      { text: 'Nine', mean: 'the number after eight', src: 'English' },
      { text: 'tales', mean: 'stories — spelled like "tails" on purpose', src: 'English' }
    ],
    why: 'It has nine tails, from old legends about magical nine-tailed foxes.' },

  { id: 39, name: 'Jigglypuff',
    parts: [
      { text: 'Jiggly', mean: 'wobbling back and forth, like jello', src: 'English' },
      { text: 'puff', mean: 'a soft round puff of air, like a marshmallow', src: 'English' }
    ],
    why: 'A soft, round, balloon-like creature that wobbles and inflates when it sings.' },

  { id: 45, name: 'Vileplume',
    parts: [
      { text: 'Vile', mean: 'disgusting or nasty-smelling', src: 'English' },
      { text: 'plume', mean: 'a cloud of dust or smoke that rises in the air', src: 'French' }
    ],
    why: 'Its giant flower puffs out clouds of foul-smelling pollen.',
    root: 'plume', rootMean: 'feather or rising cloud', rootWords: ['plumage', 'plummet'] },

  { id: 48, name: 'Venonat',
    parts: [
      { text: 'Veno', mean: 'from venom, the poison an animal injects with a bite or sting', src: 'Latin' },
      { text: 'nat', mean: 'from gnat, a tiny flying insect', src: 'English' }
    ],
    why: 'A fuzzy poison bug with huge eyes.',
    root: 'venom', rootMean: 'animal poison', rootWords: ['venomous', 'envenomed'] },

  { id: 49, name: 'Venomoth',
    parts: [
      { text: 'Veno', mean: 'from venom, the poison an animal injects with a bite or sting', src: 'Latin' },
      { text: 'moth', mean: 'a night-flying insect with dusty wings', src: 'English' }
    ],
    why: 'A moth that scatters poisonous dust from its wings.',
    root: 'venom', rootMean: 'animal poison', rootWords: ['venomous', 'envenomed'] },

  { id: 50, name: 'Diglett',
    parts: [
      { text: 'Dig', mean: 'to make a hole in the ground', src: 'English' },
      { text: 'lett', mean: 'from the ending "-let", which means little, as in piglet', src: 'English' }
    ],
    why: 'A little digger that pokes its head up out of a tunnel.',
    root: '-let', rootMean: 'little one', rootWords: ['piglet', 'booklet', 'droplet'] },

  { id: 51, name: 'Dugtrio',
    parts: [
      { text: 'Dug', mean: 'the past tense of dig — it already made its holes', src: 'English' },
      { text: 'trio', mean: 'a group of three', src: 'Latin' }
    ],
    why: 'Three diggers popping out of the ground together.',
    root: 'tri', rootMean: 'three', rootWords: ['triangle', 'tricycle', 'triple'] },

  { id: 54, name: 'Psyduck',
    parts: [
      { text: 'Psy', mean: 'mind — from Greek "psyche", the same root in psychic', src: 'Greek' },
      { text: 'duck', mean: 'a water bird with a flat bill', src: 'English' }
    ],
    why: 'A duck with a constant headache that unleashes mind powers.',
    root: 'psych', rootMean: 'mind', rootWords: ['psychic', 'psychology', 'psychiatrist'] },

  { id: 57, name: 'Primeape',
    parts: [
      { text: 'Prim', mean: 'from primate, the animal group that includes monkeys and apes', src: 'Latin' },
      { text: 'eape', mean: 'from ape, a large tailless primate like a gorilla', src: 'English' }
    ],
    why: 'A furious ape that never stops chasing whatever made it angry.',
    root: 'prim', rootMean: 'first', rootWords: ['primate', 'primary', 'primitive'] },

  { id: 59, name: 'Arcanine',
    parts: [
      { text: 'Arca', mean: 'from arcane, meaning mysterious and known only to a few', src: 'Latin' },
      { text: 'nine', mean: 'from canine, meaning dog-like', src: 'Latin' }
    ],
    why: 'A legendary dog said to be almost mythical, with a fiery mane.',
    root: 'canine', rootMean: 'dog', rootWords: ['canine teeth', 'canid'] },

  { id: 60, name: 'Poliwag',
    parts: [
      { text: 'Poli', mean: 'from polliwog, another word for a tadpole', src: 'English' },
      { text: 'wag', mean: 'to swing back and forth, like a tail wagging', src: 'English' }
    ],
    why: 'A tadpole with a swirl on its belly and a wagging tail.' },

  { id: 62, name: 'Poliwrath',
    parts: [
      { text: 'Poli', mean: 'from polliwog, another word for a tadpole', src: 'English' },
      { text: 'wrath', mean: 'furious anger', src: 'English' }
    ],
    why: 'The grown, muscled tadpole that fights with raw fury.' },

  { id: 66, name: 'Machop',
    parts: [
      { text: 'Mac', mean: 'from macho, meaning showing off strength', src: 'Spanish' },
      { text: 'hop', mean: 'from chop, a hard downward strike with the hand', src: 'English' }
    ],
    why: 'A small muscle-bound fighter always training its punches and chops.' },

  { id: 68, name: 'Machamp',
    parts: [
      { text: 'Ma', mean: 'from macho, meaning showing off strength', src: 'Spanish' },
      { text: 'champ', mean: 'short for champion, the winner of a contest', src: 'English' }
    ],
    why: 'A four-armed champion wrestler.',
    root: 'champ', rootMean: 'winner', rootWords: ['champion', 'championship'] },

  { id: 69, name: 'Bellsprout',
    parts: [
      { text: 'Bell', mean: 'a hollow cup shape that rings when struck', src: 'English' },
      { text: 'sprout', mean: 'a new shoot pushing up from a seed', src: 'English' }
    ],
    why: 'A young plant on a thin stem with a bell-shaped head.' },

  { id: 71, name: 'Victreebel',
    parts: [
      { text: 'Vic', mean: 'from victory, winning a fight or contest', src: 'Latin' },
      { text: 'tree', mean: 'a tall woody plant', src: 'English' },
      { text: 'bel', mean: 'from bell, a hollow cup shape', src: 'English' }
    ],
    why: 'A tree-sized bell-shaped pitcher plant that swallows its prey whole.',
    root: 'vict', rootMean: 'conquer, win', rootWords: ['victory', 'victor', 'convict'] },

  { id: 72, name: 'Tentacool',
    parts: [
      { text: 'Tentac', mean: 'from tentacle, a long bendy arm on a squid or jellyfish', src: 'Latin' },
      { text: 'ool', mean: 'from cool, calm and unbothered', src: 'English' }
    ],
    why: 'A drifting jellyfish trailing long stinging tentacles.',
    root: 'tentacle', rootMean: 'feeler, grasping arm', rootWords: ['tentacled', 'tentacular'] },

  { id: 74, name: 'Geodude',
    parts: [
      { text: 'Geo', mean: 'earth — from Greek "ge", the same root in geography', src: 'Greek' },
      { text: 'dude', mean: 'a casual word for a guy', src: 'English' }
    ],
    why: 'A rock with arms — literally an earth-guy.',
    root: 'geo', rootMean: 'earth', rootWords: ['geography', 'geology', 'geode'] },

  { id: 78, name: 'Rapidash',
    parts: [
      { text: 'Rapid', mean: 'very fast', src: 'Latin' },
      { text: 'ash', mean: 'from dash, to run quickly', src: 'English' }
    ],
    why: 'A blazing-fast horse with a mane of fire.',
    root: 'rapid', rootMean: 'fast', rootWords: ['rapidly', 'rapids'] },

  { id: 79, name: 'Slowpoke',
    parts: [
      { text: 'Slow', mean: 'not fast', src: 'English' },
      { text: 'poke', mean: 'from "slowpoke", a person who dawdles and holds everyone up', src: 'English' }
    ],
    why: 'It is famously dopey and takes several seconds to notice anything.' },

  { id: 80, name: 'Slowbro',
    parts: [
      { text: 'Slow', mean: 'not fast', src: 'English' },
      { text: 'bro', mean: 'short for brother, a laid-back buddy', src: 'English' }
    ],
    why: 'Still slow, now with a shellfish clamped on its tail like a permanent buddy.' },

  { id: 81, name: 'Magnemite',
    parts: [
      { text: 'Magne', mean: 'from magnet, a metal that pulls iron toward it', src: 'Greek' },
      { text: 'mite', mean: 'a tiny creature, or simply something very small', src: 'English' }
    ],
    why: 'A small floating magnet with screws and coils sticking out.',
    root: 'magnet', rootMean: 'attracting metal', rootWords: ['magnetic', 'magnetism', 'electromagnet'] },

  { id: 88, name: 'Grimer',
    parts: [
      { text: 'Grime', mean: 'thick, sticky dirt', src: 'English' },
      { text: 'r', mean: 'the ending "-er", meaning one that does it', src: 'English' }
    ],
    why: 'A living pile of sludge that leaves grime everywhere it oozes.' },

  { id: 92, name: 'Gastly',
    parts: [
      { text: 'Gas', mean: 'a substance like air that spreads out and has no shape', src: 'English' },
      { text: 'tly', mean: 'making the word sound like ghastly, meaning horrifying', src: 'English' }
    ],
    why: 'A ghost made almost entirely of poisonous gas.' },

  { id: 93, name: 'Haunter',
    parts: [
      { text: 'Haunt', mean: 'when a ghost keeps visiting a place', src: 'English' },
      { text: 'er', mean: 'the ending "-er", meaning one who does it', src: 'English' }
    ],
    why: 'A ghost with floating hands that haunts dark places.',
    root: '-er', rootMean: 'one who does something', rootWords: ['painter', 'runner', 'teacher'] },

  { id: 100, name: 'Voltorb',
    parts: [
      { text: 'Volt', mean: 'the unit that measures electric push', src: 'English' },
      { text: 'orb', mean: 'a ball or sphere', src: 'Latin' }
    ],
    why: 'An electric sphere shaped exactly like a Poké Ball.',
    root: 'orb', rootMean: 'circle, sphere', rootWords: ['orbit', 'orbital'] },

  { id: 101, name: 'Electrode',
    parts: [
      { text: 'Electr', mean: 'electricity — from Greek "elektron", meaning amber, which sparks when rubbed', src: 'Greek' },
      { text: 'ode', mean: 'from Greek "hodos", meaning path or way', src: 'Greek' }
    ],
    why: 'Its name is the real word for the metal piece electricity flows through.',
    root: 'electro', rootMean: 'electricity', rootWords: ['electric', 'electronic', 'electrician'] },

  { id: 102, name: 'Exeggcute',
    parts: [
      { text: 'Ex', mean: 'from execute, meaning to carry something out', src: 'Latin' },
      { text: 'egg', mean: 'the round shell a baby bird or reptile grows in', src: 'English' },
      { text: 'cute', mean: 'the rest of execute — and it also means adorable', src: 'English' }
    ],
    why: 'A cluster of six egg-shaped seeds that huddle together.' },

  { id: 104, name: 'Cubone',
    parts: [
      { text: 'Cub', mean: 'a baby animal, like a bear cub', src: 'English' },
      { text: 'one', mean: 'from bone, the hard white pieces inside a skeleton', src: 'English' }
    ],
    why: 'A lonely cub that wears a skull helmet and carries a bone club.' },

  { id: 106, name: 'Hitmonlee',
    parts: [
      { text: 'Hitmon', mean: 'from "hit man", a fighter who strikes hard', src: 'English' },
      { text: 'lee', mean: 'from Bruce Lee, the famous martial artist known for kicks', src: 'English' }
    ],
    why: 'A kickboxer whose legs stretch out to launch flying kicks.' },

  { id: 108, name: 'Lickitung',
    parts: [
      { text: 'Licki', mean: 'from licking, running your tongue over something', src: 'English' },
      { text: 'tung', mean: 'the word tongue, spelled the way it sounds', src: 'English' }
    ],
    why: 'It attacks with a tongue longer than its whole body.' },

  { id: 110, name: 'Weezing',
    parts: [
      { text: 'Weez', mean: 'from wheeze, a whistling sound when breathing is hard', src: 'English' },
      { text: 'ing', mean: 'the ending "-ing", meaning it is happening right now', src: 'English' }
    ],
    why: 'A double ball of toxic gas that constantly puffs and wheezes smoke.' },

  { id: 115, name: 'Kangaskhan',
    parts: [
      { text: 'Kangas', mean: 'from kangaroo, an animal that carries its baby in a pouch', src: 'English' },
      { text: 'khan', mean: 'from Genghis Khan, a famous fierce conqueror', src: 'English' }
    ],
    why: 'A kangaroo-like parent that fights ferociously to protect the baby in its pouch.' },

  { id: 123, name: 'Scyther',
    parts: [
      { text: 'Scythe', mean: 'a long curved blade on a pole, used to cut grain', src: 'English' },
      { text: 'r', mean: 'the ending "-er", meaning one that does it', src: 'English' }
    ],
    why: 'A mantis whose arms are two enormous curved blades.' },

  { id: 125, name: 'Electabuzz',
    parts: [
      { text: 'Electa', mean: 'from electric, having to do with electricity', src: 'Greek' },
      { text: 'buzz', mean: 'the humming sound electricity makes', src: 'English' }
    ],
    why: 'A crackling electric creature that hums with current.',
    root: 'electro', rootMean: 'electricity', rootWords: ['electric', 'electronic', 'electricity'] },

  { id: 126, name: 'Magmar',
    parts: [
      { text: 'Magma', mean: 'melted rock deep underground — it is called lava once it erupts', src: 'Latin' },
      { text: 'r', mean: 'an added ending that makes it sound like a name', src: 'Made-up' }
    ],
    why: 'A fire creature that lives in volcano craters and burns like molten rock.',
    root: 'magma', rootMean: 'melted rock', rootWords: ['magmatic', 'magma chamber'] },

  { id: 128, name: 'Tauros',
    parts: [
      { text: 'Taur', mean: 'bull — from Greek "tauros"', src: 'Greek' },
      { text: 'os', mean: 'a Greek word ending, kept from the original word', src: 'Greek' }
    ],
    why: 'A raging bull that charges with its horns down.',
    root: 'taur', rootMean: 'bull', rootWords: ['Taurus', 'minotaur'] },

  { id: 129, name: 'Magikarp',
    parts: [
      { text: 'Magi', mean: 'from magic, using mysterious powers', src: 'Greek' },
      { text: 'karp', mean: 'the fish carp, spelled with a K', src: 'English' }
    ],
    why: 'A useless flopping carp that magically transforms into a sea dragon.',
    root: 'magi', rootMean: 'magic, wizard', rootWords: ['magician', 'magical'] },

  { id: 133, name: 'Eevee',
    parts: [
      { text: 'Ee', mean: 'the letter E, standing for evolution', src: 'English' },
      { text: 'vee', mean: 'the letter V, the second letter of evolution', src: 'English' }
    ],
    why: 'Its name is just "E-V" — because it can evolve into many different forms.' },

  { id: 134, name: 'Vaporeon',
    parts: [
      { text: 'Vapor', mean: 'water turned into a gas, like steam or mist', src: 'Latin' },
      { text: 'eon', mean: 'the shared ending for all Eevee evolutions', src: 'Made-up' }
    ],
    why: 'A water form that can melt into water and vanish like vapor.',
    root: 'vapor', rootMean: 'mist, steam', rootWords: ['evaporate', 'vaporize', 'vapor trail'] },

  { id: 135, name: 'Jolteon',
    parts: [
      { text: 'Jolt', mean: 'a sudden sharp shock or jerk', src: 'English' },
      { text: 'eon', mean: 'the shared ending for all Eevee evolutions', src: 'Made-up' }
    ],
    why: 'An electric form with spiky fur that fires needle-like jolts.' },

  { id: 136, name: 'Flareon',
    parts: [
      { text: 'Flar', mean: 'from flare — a sudden bright burst of flame', src: 'English' },
      { text: 'eon', mean: 'the shared ending on every Eevee evolution', src: 'Made-up' }
    ],
    why: 'A fire form with a flame sac that flares up inside its body.' },

  { id: 137, name: 'Porygon',
    parts: [
      { text: 'Pory', mean: 'from poly, meaning many — from Greek "polys"', src: 'Greek' },
      { text: 'gon', mean: 'angle or corner — from Greek "gonia"', src: 'Greek' }
    ],
    why: 'A computer creature built out of flat polygon shapes, like early 3D graphics.',
    root: 'gon', rootMean: 'angle, corner', rootWords: ['polygon', 'hexagon', 'pentagon'] },

  { id: 142, name: 'Aerodactyl',
    parts: [
      { text: 'Aero', mean: 'air — from Greek "aer"', src: 'Greek' },
      { text: 'dactyl', mean: 'finger — from Greek "daktylos"', src: 'Greek' }
    ],
    why: 'An ancient flying reptile whose wings stretch across long finger bones.',
    root: 'aero', rootMean: 'air', rootWords: ['aerobic', 'airplane aerodynamics', 'aerosol'] },

  { id: 143, name: 'Snorlax',
    parts: [
      { text: 'Snor', mean: 'from snore, the rumbling noise of deep sleep', src: 'English' },
      { text: 'lax', mean: 'from relax, to rest and go limp', src: 'Latin' }
    ],
    why: 'It eats, sleeps, and blocks roads — it does almost nothing else.',
    root: 'lax', rootMean: 'loose, relaxed', rootWords: ['relax', 'laxity'] },

  { id: 144, name: 'Articuno',
    parts: [
      { text: 'Artic', mean: 'from arctic, the frozen region at the top of the world', src: 'Greek' },
      { text: 'uno', mean: 'one — the Spanish word "uno"', src: 'Spanish' }
    ],
    why: 'The first of the three legendary birds, and the one made of ice.',
    root: 'un/uni', rootMean: 'one', rootWords: ['unicycle', 'unicorn', 'unison'] },

  { id: 145, name: 'Zapdos',
    parts: [
      { text: 'Zap', mean: 'a quick electric shock', src: 'English' },
      { text: 'dos', mean: 'two — the Spanish word "dos"', src: 'Spanish' }
    ],
    why: 'The second legendary bird, crackling with lightning.',
    root: 'du/do', rootMean: 'two', rootWords: ['duo', 'duet', 'duplicate'] },

  { id: 146, name: 'Moltres',
    parts: [
      { text: 'Mol', mean: 'from molten, meaning melted by heat', src: 'Latin' },
      { text: 'tres', mean: 'three — the Spanish word "tres"', src: 'Spanish' }
    ],
    why: 'The third legendary bird, with wings of flame.',
    root: 'tri/tres', rootMean: 'three', rootWords: ['triangle', 'triple', 'tricycle'] },

  { id: 148, name: 'Dragonair',
    parts: [
      { text: 'Dragon', mean: 'a legendary serpent-like beast, often winged', src: 'Greek' },
      { text: 'air', mean: 'the gases we breathe, or the sky itself', src: 'English' }
    ],
    why: 'A graceful serpent said to control the weather and fly through the air.',
    root: 'dragon', rootMean: 'great serpent', rootWords: ['dragonfly', 'snapdragon'] },

  { id: 149, name: 'Dragonite',
    parts: [
      { text: 'Dragon', mean: 'a legendary serpent-like beast, often winged', src: 'Greek' },
      { text: 'ite', mean: 'the ending "-ite", used for a member or a kind of thing', src: 'Greek' }
    ],
    why: 'The full-grown winged dragon of the family.',
    root: 'dragon', rootMean: 'great serpent', rootWords: ['dragonfly', 'snapdragon'] },

  { id: 150, name: 'Mewtwo',
    parts: [
      { text: 'Mew', mean: 'the name of the tiny Pokémon it was cloned from', src: 'English' },
      { text: 'two', mean: 'the number after one — it is the second version', src: 'English' }
    ],
    why: 'A lab-made clone of Mew, so it is literally "Mew number two".' }
];


// PokéLearn — real-world creature and object basis for Generation 1 Pokémon designs.
// Every realFact / adapt / lesson describes the REAL organism or object, not the Pokémon.

window.PL_CREATURES = [
  { id: 1, name: 'Bulbasaur',
    real: 'Seed-carrying frog', realKind: 'amphibian',
    realFact: 'Frogs breathe partly through their moist skin, so oxygen can pass straight into their blood even while they sit underwater.',
    habitat: 'freshwater',
    adapt: 'A frog\'s skin stays damp and thin so it can absorb oxygen without surfacing, which lets it hide from predators underwater.',
    lesson: 'Some animals swap gases through their skin instead of only through lungs.',
    distractors: ['Newt', 'Salamander', 'Toad'] },

  { id: 4, name: 'Charmander',
    real: 'Salamander (fire lizard legend)', realKind: 'amphibian',
    realFact: 'Salamanders were once believed to be born from fire because they hid in damp logs and crawled out when the logs were thrown on a hearth.',
    habitat: 'forest',
    adapt: 'Many salamanders can regrow a lost tail or leg, which lets them escape a predator\'s grip and rebuild the missing part.',
    lesson: 'Regeneration lets some animals rebuild body parts they lose.',
    distractors: ['Gecko', 'Skink', 'Iguana'] },

  { id: 7, name: 'Squirtle',
    real: 'Turtle', realKind: 'reptile',
    realFact: 'A turtle\'s shell is not a house it climbs into — it is made of about 50 fused bones, including its ribs and backbone.',
    habitat: 'freshwater',
    adapt: 'The bony shell is armor grown from the skeleton itself, protecting the turtle from jaws that would crush a soft-bodied animal.',
    lesson: 'Bones can evolve into armor when protection matters more than speed.',
    distractors: ['Tortoise', 'Terrapin', 'Crocodile'] },

  { id: 10, name: 'Caterpie',
    real: 'Swallowtail caterpillar', realKind: 'insect',
    realFact: 'Swallowtail caterpillars pop out a forked orange organ called an osmeterium that smells foul and drives away hunting birds and wasps.',
    habitat: 'forest',
    adapt: 'The osmeterium is a chemical alarm that costs no fighting, letting a soft slow caterpillar repel attackers.',
    lesson: 'Chemical defense can protect an animal that cannot run or fight.',
    distractors: ['Silkworm', 'Inchworm', 'Millipede'] },

  { id: 12, name: 'Butterfree',
    real: 'Butterfly', realKind: 'insect',
    realFact: 'Inside its chrysalis a caterpillar breaks most of its body down into a soupy mix and rebuilds it into a winged adult with new eyes, legs, and mouthparts.',
    habitat: 'grassland',
    adapt: 'Complete metamorphosis lets the young and adult eat totally different foods, so they never compete with each other.',
    lesson: 'Metamorphosis means one animal can live two completely different lives.',
    distractors: ['Moth', 'Lacewing', 'Dragonfly'] },

  { id: 13, name: 'Weedle',
    real: 'Stinging caterpillar', realKind: 'insect',
    realFact: 'Some caterpillars, like the saddleback, carry hollow spines connected to venom glands that sting like nettles when touched.',
    habitat: 'forest',
    adapt: 'Venomous spines make a slow, fleshy caterpillar painful to eat, so birds learn to leave it alone.',
    lesson: 'Bright warning colors plus a painful defense teach predators to stay away — that is aposematism.',
    distractors: ['Earwig', 'Grub', 'Maggot'] },

  { id: 15, name: 'Beedrill',
    real: 'Hornet', realKind: 'insect',
    realFact: 'Unlike a honeybee, a hornet\'s stinger is smooth, so it can sting again and again without pulling loose and dying.',
    habitat: 'forest',
    adapt: 'Hornets build paper nests by chewing wood into pulp, giving the colony a weatherproof home they make from scratch.',
    lesson: 'Social insects work as one colony, sharing defense and nest-building jobs.',
    distractors: ['Honeybee', 'Mosquito', 'Horsefly'] },

  { id: 16, name: 'Pidgey',
    real: 'Pigeon', realKind: 'bird',
    realFact: 'Homing pigeons can find their way back over hundreds of kilometers, using the sun, smells, and the Earth\'s magnetic field as a compass.',
    habitat: 'urban',
    adapt: 'Pigeons feed their chicks "crop milk," a rich fluid from the throat lining, so they can raise young even when seeds are scarce.',
    lesson: 'Many animals navigate using cues people cannot sense, like magnetic fields.',
    distractors: ['Sparrow', 'Starling', 'Dove'] },

  { id: 19, name: 'Rattata',
    real: 'Rat', realKind: 'mammal',
    realFact: 'A rat\'s front teeth never stop growing, so it must gnaw constantly to keep them worn down to a usable length.',
    habitat: 'urban',
    adapt: 'Ever-growing chisel teeth stay sharp no matter how much hard food a rat chews, solving the problem of teeth wearing out.',
    lesson: 'Rodents share one key trait: teeth that grow for life and self-sharpen with use.',
    distractors: ['Mouse', 'Vole', 'Shrew'] },

  { id: 21, name: 'Spearow',
    real: 'Sparrow', realKind: 'bird',
    realFact: 'House sparrows follow people so closely that they now live on every continent except Antarctica, nesting in building gaps and signs.',
    habitat: 'urban',
    adapt: 'Sparrows eat almost anything — seeds, crumbs, insects — which lets them survive in cities where picky eaters cannot.',
    lesson: 'Generalist animals that eat many foods thrive in places humans change.',
    distractors: ['Finch', 'Wren', 'Swift'] },

  { id: 23, name: 'Ekans',
    real: 'Snake', realKind: 'reptile',
    realFact: 'A snake flicks its forked tongue to grab scent particles from the air, then presses them into a sensing organ in the roof of its mouth.',
    habitat: 'grassland',
    adapt: 'The fork gives two samples at once, so a snake can tell which side a smell is stronger on and steer toward prey.',
    lesson: 'Paired sense organs let animals figure out the direction a signal comes from.',
    distractors: ['Legless lizard', 'Eel', 'Worm'] },

  { id: 25, name: 'Pikachu',
    real: 'Pika', realKind: 'mammal',
    realFact: 'A pika is a small round relative of the rabbit that lives high on rocky mountain slopes and squeaks loudly to warn its neighbors.',
    habitat: 'mountain',
    adapt: 'Pikas cut and dry piles of grass called haypiles and stash them under rocks so they can eat all through the alpine winter.',
    lesson: 'Small mammals in cold places have round bodies and short ears, which lose less body heat.',
    distractors: ['Mouse', 'Squirrel', 'Hamster'] },

  { id: 27, name: 'Sandshrew',
    real: 'Pangolin', realKind: 'mammal',
    realFact: 'A pangolin is the only mammal covered in overlapping scales, which are made of keratin — the same stuff as your fingernails.',
    habitat: 'desert',
    adapt: 'It rolls into a tight armored ball that even a lion\'s jaws cannot open, protecting its soft belly.',
    lesson: 'Curling into a ball turns armor on the back into armor on every side.',
    distractors: ['Armadillo', 'Anteater', 'Aardvark'] },

  { id: 29, name: 'Nidoran♀',
    real: 'Rabbit', realKind: 'mammal',
    realFact: 'A rabbit\'s eyes sit high on the sides of its head, giving it a view of nearly a full circle without turning around.',
    habitat: 'grassland',
    adapt: 'Wide-set eyes let a rabbit watch for hawks and foxes in almost every direction while it keeps eating.',
    lesson: 'Prey animals usually have side-facing eyes for wide vision; predators have front-facing eyes for judging distance.',
    distractors: ['Hare', 'Guinea pig', 'Chinchilla'] },

  { id: 35, name: 'Clefairy',
    real: 'Fairy (folklore)', realKind: 'mythology',
    realFact: 'European fairy stories often explained rings of mushrooms in grass as "fairy rings" where fairies had danced at night.',
    habitat: 'mountain',
    adapt: 'Real fairy rings form when one underground fungus grows outward evenly in a circle, fruiting mushrooms along its expanding edge.',
    lesson: 'Old myths were often people\'s best guess at explaining real natural patterns.',
    distractors: ['Elf', 'Gnome', 'Sprite'] },

  { id: 37, name: 'Vulpix',
    real: 'Fox', realKind: 'mammal',
    realFact: 'Red foxes pounce on mice hidden under snow, and they succeed far more often when they leap facing roughly north or south.',
    habitat: 'forest',
    adapt: 'A fox\'s huge ears pinpoint the rustle of a mouse under snow, letting it hunt food it cannot see at all.',
    lesson: 'Sharp hearing can locate hidden prey as precisely as eyesight.',
    distractors: ['Coyote', 'Jackal', 'Dingo'] },

  { id: 38, name: 'Ninetales',
    real: 'Kitsune (nine-tailed fox myth)', realKind: 'mythology',
    realFact: 'In Japanese folklore a kitsune is a fox spirit that grows another tail as it ages, reaching nine tails and great wisdom after centuries.',
    habitat: 'forest',
    adapt: 'The legend likely grew from real foxes being clever, hard to trap, and often seen near rice-field shrines.',
    lesson: 'Cultures build myths around animals whose real behavior seems uncannily smart.',
    distractors: ['Tanuki', 'Kappa', 'Tengu'] },

  { id: 41, name: 'Zubat',
    real: 'Bat', realKind: 'mammal',
    realFact: 'Bats shout in high-pitched pulses and listen to the echoes, building a sound picture accurate enough to catch a moth in total darkness.',
    habitat: 'cave',
    adapt: 'Echolocation lets bats hunt at night when birds cannot compete with them for flying insects.',
    lesson: 'Echolocation means finding objects by listening to your own sound bounce back.',
    distractors: ['Flying squirrel', 'Colugo', 'Swift'] },

  { id: 43, name: 'Oddish',
    real: 'Mandrake root', realKind: 'plant',
    realFact: 'The mandrake plant has a thick forked root that can look like a tiny human body, which is why medieval legends said it screamed when pulled up.',
    habitat: 'forest',
    adapt: 'That deep taproot stores water and food underground, letting the plant survive dry seasons and regrow its leaves.',
    lesson: 'Storage roots are a plant\'s underground pantry for surviving hard seasons.',
    distractors: ['Turnip', 'Ginseng', 'Carrot'] },

  { id: 45, name: 'Vileplume',
    real: 'Rafflesia flower', realKind: 'plant',
    realFact: 'Rafflesia grows the largest single flower on Earth, up to a meter across, and it smells like rotting meat.',
    habitat: 'forest',
    adapt: 'The stench attracts carrion flies, which carry pollen between flowers — the plant tricks flies into doing a bee\'s job.',
    lesson: 'Plants advertise to whichever animal will move their pollen, even if the ad is a bad smell.',
    distractors: ['Titan arum', 'Hibiscus', 'Sunflower'] },

  { id: 46, name: 'Paras',
    real: 'Cordyceps fungus', realKind: 'fungus',
    realFact: 'Cordyceps fungi infect insects, take over the body, and finally sprout a stalk out of the dead insect to release spores.',
    habitat: 'forest',
    adapt: 'The fungus makes an infected ant climb high and clamp onto a leaf before dying, so spores fall over a wide area below.',
    lesson: 'A parasite is an organism that lives on or in another and harms it while it benefits.',
    distractors: ['Bracket fungus', 'Puffball', 'Lichen'] },

  { id: 48, name: 'Venonat',
    real: 'Moth', realKind: 'insect',
    realFact: 'A male silk moth can detect a female\'s scent molecules from more than a kilometer away using his feathery antennae.',
    habitat: 'forest',
    adapt: 'Feathery antennae have huge surface area covered in scent receptors, letting a moth track a faint smell trail through the dark.',
    lesson: 'Animals communicate with chemical signals called pheromones that travel on the wind.',
    distractors: ['Cicada', 'Beetle', 'Firefly'] },

  { id: 50, name: 'Diglett',
    real: 'Mole', realKind: 'mammal',
    realFact: 'A mole\'s front paws are turned permanently outward like shovels, and it can tunnel many meters of new burrow in a single day.',
    habitat: 'grassland',
    adapt: 'Moles have extra-rich blood that holds oxygen well, which lets them breathe the stale low-oxygen air of sealed tunnels.',
    lesson: 'Life underground reshapes an animal\'s hands, eyes, and even its blood.',
    distractors: ['Gopher', 'Naked mole-rat', 'Shrew'] },

  { id: 52, name: 'Meowth',
    real: 'Maneki-neko (beckoning cat)', realKind: 'mythology',
    realFact: 'The maneki-neko is a Japanese good-luck figurine of a cat with one raised paw, often holding an old gold coin called a koban.',
    habitat: 'urban',
    adapt: 'The raised paw copies the way a real cat lifts a paw to wash its face, which shopkeepers read as the cat waving customers in.',
    lesson: 'Lucky charms often come from misreading an ordinary animal behavior as a message.',
    distractors: ['Lion dance figure', 'Daruma doll', 'Foo dog'] },

  { id: 54, name: 'Psyduck',
    real: 'Duck', realKind: 'bird',
    realFact: 'Ducks stay warm on icy water because a heat-exchange system in their legs keeps hot blood from draining away into cold feet.',
    habitat: 'freshwater',
    adapt: 'Oily feathers shed water completely, so a duck can float for hours without ever getting soaked and chilled.',
    lesson: 'Waterproofing and heat exchange let warm-blooded animals live in cold water.',
    distractors: ['Goose', 'Swan', 'Grebe'] },

  { id: 56, name: 'Mankey',
    real: 'Macaque', realKind: 'mammal',
    realFact: 'Japanese macaques live farther north than any other monkey and soak in volcanic hot springs to stay warm in snowy winters.',
    habitat: 'mountain',
    adapt: 'Thick winter fur plus learned behaviors like bathing in hot springs let macaques survive freezing mountains.',
    lesson: 'Some animals survive harsh places by learning new behaviors, not just by changing their bodies.',
    distractors: ['Baboon', 'Lemur', 'Gibbon'] },

  { id: 58, name: 'Growlithe',
    real: 'Shisa / guardian lion-dog', realKind: 'mythology',
    realFact: 'Shisa are lion-dog statues placed in pairs on Okinawan rooftops and gates, one with an open mouth and one closed, to guard the home.',
    habitat: 'urban',
    adapt: 'The idea spread along trade routes from real lions in Asia and Africa to places that had never seen one, so the statues look part dog.',
    lesson: 'Stories about animals change shape as they travel to lands where that animal does not live.',
    distractors: ['Kirin', 'Baku', 'Qilin'] },

  { id: 60, name: 'Poliwag',
    real: 'Tadpole', realKind: 'amphibian',
    realFact: 'You can sometimes see a tadpole\'s coiled intestines through its clear belly skin — the spiral shape helps it digest tough algae.',
    habitat: 'freshwater',
    adapt: 'A tadpole breathes with gills and swims with a tail, then absorbs both as it grows lungs and legs for land.',
    lesson: 'Amphibians change body plans partway through life so young and adults use different habitats.',
    distractors: ['Fish fry', 'Water beetle larva', 'Newt eft'] },

  { id: 63, name: 'Abra',
    real: 'Fennec fox / big-eared desert mammal', realKind: 'mammal',
    realFact: 'The fennec fox has ears nearly as long as its head, the largest ears compared to body size of any dog-family animal.',
    habitat: 'desert',
    adapt: 'Those giant ears radiate body heat into the air and pick up the sound of insects moving under the sand.',
    lesson: 'In hot places, big thin body parts act like radiators to dump excess heat.',
    distractors: ['Bat-eared fox', 'Jerboa', 'Kit fox'] },

  { id: 66, name: 'Machop',
    real: 'Sumo wrestler', realKind: 'object',
    realFact: 'Sumo is a Japanese sport over a thousand years old in which two wrestlers try to push each other out of a circular clay ring.',
    habitat: 'urban',
    adapt: 'A wrestler wins by keeping a low center of gravity — the lower and wider your base, the harder you are to tip over.',
    lesson: 'Balance depends on center of gravity: low and wide is stable, tall and narrow tips easily.',
    distractors: ['Weightlifter', 'Boxer', 'Judoka'] },

  { id: 69, name: 'Bellsprout',
    real: 'Pitcher plant', realKind: 'plant',
    realFact: 'Pitcher plants grow leaves shaped like slippery vases; insects slide in and are digested in the fluid at the bottom.',
    habitat: 'freshwater',
    adapt: 'Trapping insects gives the plant nitrogen, which is missing from the poor boggy soil it grows in.',
    lesson: 'When soil lacks nutrients, some plants get them by eating animals instead.',
    distractors: ['Venus flytrap', 'Sundew', 'Bladderwort'] },

  { id: 72, name: 'Tentacool',
    real: 'Jellyfish', realKind: 'other-invertebrate',
    realFact: 'A jellyfish is about 95 percent water and has no brain, heart, or bones — just a nerve net spread through its body.',
    habitat: 'ocean',
    adapt: 'Its tentacles are lined with stinging cells that fire like tiny harpoons the instant they touch prey.',
    lesson: 'An animal can hunt and respond to the world without a brain, using a simple nerve net.',
    distractors: ['Sea anemone', 'Squid', 'Comb jelly'] },

  { id: 74, name: 'Geodude',
    real: 'Geode / boulder', realKind: 'object',
    realFact: 'A geode is a plain-looking round rock that is hollow inside and lined with crystals grown slowly from mineral-rich water.',
    habitat: 'mountain',
    adapt: 'The crystals form because water seeps into a gas bubble in cooled lava and leaves minerals behind, layer by layer, over ages.',
    lesson: 'Crystals grow atom by atom out of solutions, which is why they have flat faces and sharp angles.',
    distractors: ['Meteorite', 'Fossil nodule', 'Pumice'] },

  { id: 77, name: 'Ponyta',
    real: 'Horse', realKind: 'mammal',
    realFact: 'A horse walks on a single toe: the hoof is one giant toenail, and its ancestors had several toes that shrank away.',
    habitat: 'grassland',
    adapt: 'Long springy leg tendons store and return energy with each stride, letting a horse run far without tiring quickly.',
    lesson: 'Fossils show bodies changing over millions of years — horses went from many toes to one.',
    distractors: ['Zebra', 'Donkey', 'Deer'] },

  { id: 79, name: 'Slowpoke',
    real: 'Slow loris / hippo-like slow mammal', realKind: 'mammal',
    realFact: 'The slow loris moves so slowly and quietly that predators often fail to notice it at all, and it is the only venomous primate.',
    habitat: 'forest',
    adapt: 'Extreme slowness is camouflage in motion — it never makes the sudden movement that a predator\'s eye is built to catch.',
    lesson: 'Predators detect movement, so moving very slowly can hide you as well as color does.',
    distractors: ['Sloth', 'Tapir', 'Capybara'] },

  { id: 81, name: 'Magnemite',
    real: 'Magnet', realKind: 'object',
    realFact: 'Every magnet has a north and a south pole, and if you cut one in half you get two smaller magnets, each with both poles again.',
    habitat: 'urban',
    adapt: 'A magnet works because countless tiny atomic magnets inside it line up in the same direction instead of pointing randomly.',
    lesson: 'Magnetism is a force that pulls or pushes without touching — opposite poles attract, like poles repel.',
    distractors: ['Battery', 'Light bulb', 'Compass needle'] },

  { id: 83, name: 'Farfetch\'d',
    real: 'Wild duck (and leek)', realKind: 'bird',
    realFact: 'Migrating ducks and geese fly in a V so each bird rides the swirl of air off the wingtip of the one ahead, saving energy.',
    habitat: 'freshwater',
    adapt: 'Flying in formation lets a flock travel much farther on the same amount of food than any bird could alone.',
    lesson: 'Working together can make a whole group more efficient than its members are separately.',
    distractors: ['Heron', 'Crane', 'Stork'] },

  { id: 86, name: 'Seel',
    real: 'Seal', realKind: 'mammal',
    realFact: 'Seals have a thick blubber layer and can slow their heartbeat dramatically to stretch one breath into a long, deep dive.',
    habitat: 'polar',
    adapt: 'Blubber insulates so well that a seal stays warm in near-freezing water that would kill a person in minutes.',
    lesson: 'Fat layers are insulation: they trap body heat where fur would be flattened by water.',
    distractors: ['Sea lion', 'Walrus', 'Otter'] },

  { id: 88, name: 'Grimer',
    real: 'Slime mold', realKind: 'fungus',
    realFact: 'A slime mold is a single huge cell with many nuclei that creeps across the forest floor engulfing bacteria as it goes.',
    habitat: 'forest',
    adapt: 'Slime molds can solve mazes by spreading everywhere, then withdrawing from dead ends and keeping the shortest food route.',
    lesson: 'Problem-solving does not require a brain — simple rules repeated can produce smart-looking results.',
    distractors: ['Mildew', 'Yeast', 'Algae mat'] },

  { id: 90, name: 'Shellder',
    real: 'Clam', realKind: 'mollusk',
    realFact: 'A clam pulls its two shell halves shut with powerful muscles, and you can count growth rings on the shell like tree rings.',
    habitat: 'ocean',
    adapt: 'Clams filter seawater through their gills to strain out tiny food particles, so they eat without ever chasing anything.',
    lesson: 'Filter feeders sieve food from water, a strategy used by animals from clams to whales.',
    distractors: ['Oyster', 'Mussel', 'Scallop'] },

  { id: 92, name: 'Gastly',
    real: 'Will-o\'-the-wisp / swamp gas', realKind: 'other',
    realFact: 'Travelers long reported ghostly lights over marshes; the likely cause is gases from rotting plants that glow or ignite over the bog.',
    habitat: 'freshwater',
    adapt: 'Decaying plant matter in oxygen-poor mud releases methane and other gases, which can produce faint flickering light at the surface.',
    lesson: 'Many "ghost" sightings turn out to be ordinary chemistry that people could not explain yet.',
    distractors: ['Aurora', 'Fog bow', 'Ball lightning'] },

  { id: 95, name: 'Onix',
    real: 'Rock strata / obsidian serpent legend', realKind: 'object',
    realFact: 'Layers of sedimentary rock form when sand and mud settle year after year and get pressed into stone, oldest layer at the bottom.',
    habitat: 'cave',
    adapt: 'Because layers stack in order, geologists read a cliff face like a book to tell which events happened first.',
    lesson: 'Rock layers record time: deeper usually means older.',
    distractors: ['Coal seam', 'Iron ore', 'Limestone cave'] },

  { id: 98, name: 'Krabby',
    real: 'Crab', realKind: 'other-invertebrate',
    realFact: 'A crab wears its skeleton on the outside, so to grow it must crack the old shell off and harden a bigger one underneath.',
    habitat: 'ocean',
    adapt: 'A fiddler crab\'s oversized claw is used for signaling and fighting rivals, not for feeding — the small claw does the eating.',
    lesson: 'An exoskeleton protects well but must be shed and regrown for the animal to get bigger.',
    distractors: ['Lobster', 'Shrimp', 'Barnacle'] },

  { id: 100, name: 'Voltorb',
    real: 'Poké Ball / electric battery', realKind: 'object',
    realFact: 'A battery makes electricity from a chemical reaction that pushes electrons out one end and pulls them in the other.',
    habitat: 'urban',
    adapt: 'Because the reaction only runs when the circuit is closed, a battery can sit unused for years and still hold its charge.',
    lesson: 'Electric current is moving charge, and it only flows around a complete circuit.',
    distractors: ['Magnet', 'Fuse', 'Capacitor'] },

  { id: 102, name: 'Exeggcute',
    real: 'Seeds / eggs', realKind: 'plant',
    realFact: 'A seed is a tiny plant packed with its own food supply, and some seeds can stay alive but dormant for hundreds of years.',
    habitat: 'grassland',
    adapt: 'The hard seed coat waits for the right warmth and moisture before sprouting, so the seedling does not start in a killing frost.',
    lesson: 'Dormancy lets living things pause until conditions are good enough to grow.',
    distractors: ['Acorn cluster', 'Frog spawn', 'Spore pod'] },

  { id: 103, name: 'Exeggutor',
    real: 'Coconut palm', realKind: 'plant',
    realFact: 'Coconuts float and stay viable in seawater for months, which is how palms colonized islands across the Pacific.',
    habitat: 'ocean',
    adapt: 'The thick fibrous husk keeps seawater out and adds buoyancy, turning the seed into a long-distance boat.',
    lesson: 'Seed dispersal by water, wind, or animals lets plants reach places the parent never could.',
    distractors: ['Banana tree', 'Date palm', 'Bamboo'] },

  { id: 104, name: 'Cubone',
    real: 'Animal skull', realKind: 'object',
    realFact: 'A skull is not one bone but around 22 fused bones, and the joints between them stay soft in babies so the head can grow.',
    habitat: 'desert',
    adapt: 'Scientists identify an animal from its skull alone, because tooth shape reveals whether it ate meat, plants, or both.',
    lesson: 'Teeth and skull shape tell you what an animal ate — sharp for meat, flat and ridged for plants.',
    distractors: ['Antler', 'Tusk', 'Shell'] },

  { id: 108, name: 'Lickitung',
    real: 'Chameleon / anteater tongue', realKind: 'reptile',
    realFact: 'A chameleon fires its tongue out faster than a car accelerates, snatching an insect more than a body length away.',
    habitat: 'forest',
    adapt: 'The tongue launches from stored elastic energy, like a slingshot, so it moves faster than muscle alone could pull it.',
    lesson: 'Storing energy in stretchy tissue lets animals move far faster than muscles alone allow.',
    distractors: ['Gecko', 'Monitor lizard', 'Frog'] },

  { id: 109, name: 'Koffing',
    real: 'Volcanic gas vent', realKind: 'object',
    realFact: 'Volcanic vents called fumaroles hiss out steam and sulfur gases, coating nearby rocks in yellow sulfur crystals.',
    habitat: 'volcanic',
    adapt: 'The gases escape because they are dissolved in magma deep down and expand as pressure drops near the surface, like a shaken soda.',
    lesson: 'Gases dissolved under pressure come fizzing out when the pressure is released.',
    distractors: ['Geyser', 'Hot spring', 'Smokestack'] },

  { id: 114, name: 'Tangela',
    real: 'Vine tangle / kelp', realKind: 'plant',
    realFact: 'Climbing vines grow coiling tendrils that sweep in circles until they touch a support, then wind tightly around it.',
    habitat: 'forest',
    adapt: 'Climbing lets a vine reach sunlight in the canopy without spending years building a thick trunk of its own.',
    lesson: 'Competition for sunlight drives plants to grow tall — or to climb something that already is.',
    distractors: ['Moss', 'Fern', 'Seaweed'] },

  { id: 118, name: 'Goldeen',
    real: 'Goldfish / fancy carp', realKind: 'fish',
    realFact: 'Fish sense water movement with a lateral line, a row of tiny hair cells along the body that feels currents and nearby motion.',
    habitat: 'freshwater',
    adapt: 'The lateral line lets a school of fish turn together in an instant, because each fish feels its neighbors move.',
    lesson: 'Animals have senses humans lack — fish literally feel the water moving around them.',
    distractors: ['Koi', 'Guppy', 'Angelfish'] },

  { id: 120, name: 'Staryu',
    real: 'Starfish', realKind: 'other-invertebrate',
    realFact: 'A starfish has no brain and walks on hundreds of tiny water-powered tube feet on its underside.',
    habitat: 'ocean',
    adapt: 'Many starfish can regrow a lost arm, and a few can rebuild a whole body from one arm and part of the center.',
    lesson: 'Radial symmetry means a body is arranged around a center instead of having a left and right side.',
    distractors: ['Sea urchin', 'Sand dollar', 'Sea cucumber'] },

  { id: 124, name: 'Jynx',
    real: 'Yuki-onna (snow woman)', realKind: 'mythology',
    realFact: 'The yuki-onna is a figure from Japanese folklore said to appear to travelers during blizzards in the northern mountains.',
    habitat: 'polar',
    adapt: 'Such tales likely spread because blizzards genuinely killed travelers, and the story warned people to respect winter storms.',
    lesson: 'Folklore often works as a safety warning wrapped inside a scary story.',
    distractors: ['Banshee', 'Siren', 'Ice giant'] },

  { id: 127, name: 'Pinsir',
    real: 'Stag beetle', realKind: 'insect',
    realFact: 'A male stag beetle\'s huge jaws are not for eating — they are for wrestling rival males off a branch.',
    habitat: 'forest',
    adapt: 'Oversized jaws win mating contests, which is why males grow them even though they make feeding harder.',
    lesson: 'Sexual selection can favor traits that look impressive even when they are inconvenient for daily life.',
    distractors: ['Rhinoceros beetle', 'Weevil', 'Mantis'] },

  { id: 128, name: 'Tauros',
    real: 'Bull / aurochs', realKind: 'mammal',
    realFact: 'The aurochs was the wild ancestor of modern cattle, standing taller than a person at the shoulder; the last one died in 1627.',
    habitat: 'grassland',
    adapt: 'Cattle have a four-chambered stomach with microbes that break down grass, food most mammals cannot digest at all.',
    lesson: 'Symbiosis: gut microbes digest food for the animal, and the animal gives them a home.',
    distractors: ['Bison', 'Yak', 'Water buffalo'] },

  { id: 129, name: 'Magikarp',
    real: 'Carp', realKind: 'fish',
    realFact: 'Chinese legend says a carp that swims up a waterfall at the Dragon Gate turns into a dragon — and real carp do leap upstream.',
    habitat: 'freshwater',
    adapt: 'Carp survive in warm, muddy, low-oxygen water where fussier fish die, which is why they thrive in ponds worldwide.',
    lesson: 'Tolerating harsh conditions can beat being the strongest competitor.',
    distractors: ['Salmon', 'Catfish', 'Trout'] },

  { id: 131, name: 'Lapras',
    real: 'Plesiosaur (Loch Ness legend)', realKind: 'reptile',
    realFact: 'Plesiosaurs were long-necked marine reptiles that swam with four flippers, and fossils show they gave birth to live young.',
    habitat: 'ocean',
    adapt: 'Four wing-like flippers let them "fly" through water with steady control instead of the side-to-side thrash of a fish tail.',
    lesson: 'Convergent evolution: unrelated animals like plesiosaurs, dolphins, and sharks all evolved streamlined bodies for the same job.',
    distractors: ['Ichthyosaur', 'Mosasaur', 'Sea turtle'] },

  { id: 132, name: 'Ditto',
    real: 'Mimic octopus', realKind: 'mollusk',
    realFact: 'The mimic octopus can change color, texture, and posture to impersonate sea snakes, flatfish, and lionfish.',
    habitat: 'ocean',
    adapt: 'By copying a venomous animal, a soft boneless octopus makes predators treat it as dangerous.',
    lesson: 'Mimicry means looking like something else — often something dangerous — to stay safe.',
    distractors: ['Cuttlefish', 'Chameleon', 'Slime mold'] },

  { id: 133, name: 'Eevee',
    real: 'Fennec-like wild canid', realKind: 'mammal',
    realFact: 'All dog breeds, from chihuahua to great dane, descend from wolves — a huge range of shapes from one starting species.',
    habitat: 'grassland',
    adapt: 'Breeders selected different traits from the same ancestor, showing how much variation one species can hold.',
    lesson: 'Selective breeding is evolution sped up by human choices instead of nature\'s.',
    distractors: ['Raccoon', 'Fennec fox', 'Jackal'] },

  { id: 138, name: 'Omanyte',
    real: 'Ammonite', realKind: 'mollusk',
    realFact: 'Ammonites were shelled relatives of squid that filled the seas for 300 million years and died out with the dinosaurs.',
    habitat: 'ocean',
    adapt: 'Gas-filled chambers inside the coiled shell let an ammonite adjust its buoyancy and hover in the water without swimming.',
    lesson: 'Fossils are the record of species that once ruled and then went extinct.',
    distractors: ['Nautilus', 'Trilobite', 'Belemnite'] },

  { id: 140, name: 'Kabuto',
    real: 'Horseshoe crab', realKind: 'other-invertebrate',
    realFact: 'Horseshoe crabs have existed for over 400 million years, have ten eyes, and have blue blood that clots around bacteria.',
    habitat: 'ocean',
    adapt: 'Their blue blood detects bacterial contamination so reliably that it is used to test medicines for safety.',
    lesson: 'A "living fossil" is a species whose body plan has barely changed for a very long time.',
    distractors: ['Trilobite', 'Crab', 'Isopod'] },

  { id: 142, name: 'Aerodactyl',
    real: 'Pterosaur', realKind: 'reptile',
    realFact: 'Pterosaurs were flying reptiles, not dinosaurs, and their wings were skin stretched from the body to one enormously long finger.',
    habitat: 'mountain',
    adapt: 'Their bones were hollow and air-filled, making them strong but light enough for the largest ones to fly with a wingspan like a small plane.',
    lesson: 'Flight evolved separately in insects, pterosaurs, birds, and bats — the same solution found four times.',
    distractors: ['Archaeopteryx', 'Dimetrodon', 'Giant condor'] },

  { id: 143, name: 'Snorlax',
    real: 'Hibernating bear', realKind: 'mammal',
    realFact: 'A denning bear can go months without eating or drinking, living off fat while its heart rate drops to as few as 8 beats a minute.',
    habitat: 'forest',
    adapt: 'Slowing the whole body down means a bear needs almost no food during the season when there is almost none to find.',
    lesson: 'Hibernation saves energy by turning the body\'s engine down to idle through a hard season.',
    distractors: ['Walrus', 'Manatee', 'Tapir'] },

  { id: 144, name: 'Articuno',
    real: 'Snowy owl / phoenix-style legendary bird', realKind: 'bird',
    realFact: 'Snowy owls have feathers down to their toes and hunt in the Arctic, where daylight can last all night in summer.',
    habitat: 'polar',
    adapt: 'Dense feathering, even on the feet, insulates the owl at temperatures far below freezing.',
    lesson: 'Trapped air inside feathers or fur is what actually keeps an animal warm.',
    distractors: ['Albatross', 'Gyrfalcon', 'Ptarmigan'] },

  { id: 146, name: 'Moltres',
    real: 'Phoenix (myth)', realKind: 'mythology',
    realFact: 'The phoenix is an ancient Greek and Egyptian legend of a bird that burns to ash and is reborn from it.',
    habitat: 'volcanic',
    adapt: 'The myth mirrors a real pattern: some forests need fire, and certain pine cones only open to release seeds in a blaze.',
    lesson: 'Fire can renew an ecosystem as well as destroy it.',
    distractors: ['Griffin', 'Thunderbird', 'Roc'] },

  { id: 147, name: 'Dratini',
    real: 'Eel', realKind: 'fish',
    realFact: 'European eels are born in the Sargasso Sea, drift thousands of kilometers to rivers, then swim all the way back to spawn.',
    habitat: 'ocean',
    adapt: 'Eels change body shape and color for each stage of that journey, from transparent larva to river-dwelling adult.',
    lesson: 'Migration means moving between habitats, sometimes across an entire ocean, to feed and breed.',
    distractors: ['Sea snake', 'Lamprey', 'Ribbonfish'] },

  { id: 149, name: 'Dragonite',
    real: 'Eastern dragon (myth)', realKind: 'mythology',
    realFact: 'Chinese dragons are described as long serpents with antlers and whiskers, and are seen as bringers of rain and rivers, not monsters.',
    habitat: 'ocean',
    adapt: 'Scholars think dragon legends grew partly from fossil bones of large extinct animals that people found and tried to explain.',
    lesson: 'Fossils inspired myths long before anyone knew what a dinosaur was.',
    distractors: ['Western dragon', 'Wyvern', 'Serpent god'] }
];
