// World Explorer data. Facts kept kid-friendly and checkable.
// ITEMS drive both modes: "Which country is this from?" and (via a country's
// own items) "Guess the country from these clues."
window.GEO = {
  CAT_LABEL: {
    art: 'Art', invention: 'Invention', discovery: 'Discovery',
    food: 'Food & Farming', landmark: 'Landmark', history: 'History', culture: 'Culture'
  },
  // Category filters shown in Match It.
  CATS: [
    ['all', 'All'], ['landmark', '🏛️ Landmarks'], ['invention', '💡 Inventions'],
    ['discovery', '🔬 Discoveries'], ['food', '🌾 Food & Farming'],
    ['art', '🎨 Art'], ['history', '📜 History'], ['culture', '🎭 Culture']
  ],
  COUNTRIES: {
    'France':        { flag: '🇫🇷', continent: 'Europe',        capital: 'Paris' },
    'Italy':         { flag: '🇮🇹', continent: 'Europe',        capital: 'Rome' },
    'Japan':         { flag: '🇯🇵', continent: 'Asia',          capital: 'Tokyo' },
    'Egypt':         { flag: '🇪🇬', continent: 'Africa',        capital: 'Cairo' },
    'China':         { flag: '🇨🇳', continent: 'Asia',          capital: 'Beijing' },
    'India':         { flag: '🇮🇳', continent: 'Asia',          capital: 'New Delhi' },
    'Greece':        { flag: '🇬🇷', continent: 'Europe',        capital: 'Athens' },
    'Mexico':        { flag: '🇲🇽', continent: 'North America', capital: 'Mexico City' },
    'Brazil':        { flag: '🇧🇷', continent: 'South America', capital: 'Brasília' },
    'United States': { flag: '🇺🇸', continent: 'North America', capital: 'Washington, D.C.' },
    'United Kingdom':{ flag: '🇬🇧', continent: 'Europe',        capital: 'London' },
    'Peru':          { flag: '🇵🇪', continent: 'South America', capital: 'Lima' },
    'Australia':     { flag: '🇦🇺', continent: 'Oceania',       capital: 'Canberra' },
    'Germany':       { flag: '🇩🇪', continent: 'Europe',        capital: 'Berlin' }
  },
  ITEMS: [
    // ---- France ----
    { c: 'France', cat: 'landmark',   icon: '🗼', name: 'the Eiffel Tower', fact: 'Built for the 1889 World’s Fair in Paris, it was the tallest structure on Earth for 41 years.' },
    { c: 'France', cat: 'invention',  icon: '🎈', name: 'the hot-air balloon', fact: 'The Montgolfier brothers launched the first one in 1783 — a sheep, a duck, and a rooster were early passengers.' },
    { c: 'France', cat: 'invention',  icon: '📖', name: 'Braille', fact: 'Louis Braille, blind since childhood, created this reading system of raised dots in the 1820s.' },
    { c: 'France', cat: 'discovery',  icon: '🦠', name: 'pasteurization', fact: 'Louis Pasteur discovered that gently heating liquids kills germs, making milk safe to drink.' },
    { c: 'France', cat: 'food',       icon: '🥖', name: 'the baguette', fact: 'This long, crusty loaf is so French that it is protected by law and honored by UNESCO.' },
    { c: 'France', cat: 'art',        icon: '🎨', name: 'Impressionism', fact: 'Painters like Claude Monet created this style with soft, dabbing brushstrokes of light and color.' },
    { c: 'France', cat: 'history',    icon: '✊', name: 'the French Revolution', fact: 'In 1789, the people overthrew the king with the cry “Liberty, Equality, Fraternity.”' },

    // ---- Italy ----
    { c: 'Italy', cat: 'art',       icon: '🖼️', name: 'the Mona Lisa', fact: 'Leonardo da Vinci painted her mysterious smile around 1503; today she hangs in a museum in Paris.' },
    { c: 'Italy', cat: 'history',   icon: '🏟️', name: 'the Roman Empire', fact: 'Ruled from Rome, it once stretched across Europe, North Africa, and the Middle East.' },
    { c: 'Italy', cat: 'landmark',  icon: '🏛️', name: 'the Colosseum', fact: 'This giant arena in Rome held 50,000 spectators for games nearly 2,000 years ago.' },
    { c: 'Italy', cat: 'food',      icon: '🍕', name: 'pizza', fact: 'Modern pizza was born in Naples; the Margherita shows the red, white, and green of Italy’s flag.' },
    { c: 'Italy', cat: 'invention', icon: '🎹', name: 'the piano', fact: 'Bartolomeo Cristofori invented it around 1700 so a player could play both soft and loud.' },
    { c: 'Italy', cat: 'discovery', icon: '🔭', name: 'Galileo’s discoveries', fact: 'Galileo used a telescope to discover Jupiter’s four biggest moons in 1610.' },

    // ---- Japan ----
    { c: 'Japan', cat: 'art',       icon: '🌊', name: 'The Great Wave', fact: 'Hokusai’s woodblock print of a towering wave is one of the most famous artworks in the world.' },
    { c: 'Japan', cat: 'invention', icon: '🚄', name: 'the bullet train', fact: 'The Shinkansen opened in 1964 and zooms along at over 300 km/h (186 mph).' },
    { c: 'Japan', cat: 'invention', icon: '🍜', name: 'instant ramen', fact: 'Momofuku Ando invented instant noodles in 1958 — later the first noodles eaten in space.' },
    { c: 'Japan', cat: 'food',      icon: '🍣', name: 'sushi', fact: 'Vinegared rice with fresh fish became Japan’s most famous dish, now eaten around the world.' },
    { c: 'Japan', cat: 'culture',   icon: '🌸', name: 'cherry blossoms', fact: 'Each spring, people gather for “hanami” to picnic under the pink sakura blooms.' },
    { c: 'Japan', cat: 'landmark',  icon: '🗻', name: 'Mount Fuji', fact: 'Japan’s tallest mountain is a sacred volcano, painted and photographed for centuries.' },

    // ---- Egypt ----
    { c: 'Egypt', cat: 'landmark',  icon: '🔺', name: 'the Pyramids of Giza', fact: 'Built as royal tombs about 4,500 years ago, they are the only ancient wonder still standing.' },
    { c: 'Egypt', cat: 'invention', icon: '📜', name: 'papyrus paper', fact: 'Ancient Egyptians made the first paper-like sheets from the papyrus reed that grew along the Nile.' },
    { c: 'Egypt', cat: 'invention', icon: '📅', name: 'the 365-day calendar', fact: 'The Egyptians split the year into 365 days, close to the calendar we still use.' },
    { c: 'Egypt', cat: 'history',   icon: '👑', name: 'the pharaohs', fact: 'God-kings like Tutankhamun ruled ancient Egypt and were buried with dazzling treasure.' },
    { c: 'Egypt', cat: 'food',      icon: '🌾', name: 'farming along the Nile', fact: 'Yearly floods left rich black soil, letting Egyptians grow wheat in the middle of a desert.' },
    { c: 'Egypt', cat: 'culture',   icon: '🔣', name: 'hieroglyphics', fact: 'Egyptians wrote using hundreds of picture-symbols carved onto temples and tombs.' },

    // ---- China ----
    { c: 'China', cat: 'invention', icon: '🧭', name: 'the compass', fact: 'Ancient China invented the magnetic compass, letting sailors find their way far out at sea.' },
    { c: 'China', cat: 'invention', icon: '🧨', name: 'gunpowder', fact: 'Chinese alchemists stumbled on gunpowder while searching for a potion for long life.' },
    { c: 'China', cat: 'invention', icon: '📄', name: 'paper', fact: 'Cai Lun improved papermaking around 100 CE — one of China’s “Four Great Inventions.”' },
    { c: 'China', cat: 'landmark',  icon: '🧱', name: 'the Great Wall', fact: 'Stretching over 21,000 km, it was built across centuries to guard China’s borders.' },
    { c: 'China', cat: 'food',      icon: '🍵', name: 'tea', fact: 'Tea drinking began in China thousands of years ago before spreading around the globe.' },
    { c: 'China', cat: 'culture',   icon: '🧵', name: 'silk', fact: 'China kept the secret of spinning silk from silkworms for hundreds of years.' },
    { c: 'China', cat: 'art',       icon: '🏺', name: 'porcelain', fact: 'Chinese potters perfected fine white porcelain so prized that we still call the dishes “china.”' },

    // ---- India ----
    { c: 'India', cat: 'invention', icon: '0️⃣', name: 'the number zero', fact: 'Ancient Indian mathematicians developed zero as a number, changing math forever.' },
    { c: 'India', cat: 'discovery', icon: '🔢', name: 'the decimal system', fact: 'The place-value number system used worldwide today was developed in ancient India.' },
    { c: 'India', cat: 'landmark',  icon: '🕌', name: 'the Taj Mahal', fact: 'An emperor built this white marble tomb for his beloved wife in the 1600s.' },
    { c: 'India', cat: 'culture',   icon: '♟️', name: 'chess', fact: 'Chess grew out of an ancient Indian board game called chaturanga.' },
    { c: 'India', cat: 'food',      icon: '🌶️', name: 'spices and curry', fact: 'India has grown and traded pepper, cardamom, and other spices for thousands of years.' },
    { c: 'India', cat: 'food',      icon: '🍃', name: 'tea farming', fact: 'India is one of the world’s largest tea growers, famous for Assam and Darjeeling.' },

    // ---- Greece ----
    { c: 'Greece', cat: 'invention', icon: '🗳️', name: 'democracy', fact: 'Ancient Athens created democracy, where citizens vote to make decisions together.' },
    { c: 'Greece', cat: 'culture',   icon: '🏅', name: 'the Olympic Games', fact: 'The first Olympics were held in Olympia, Greece, in 776 BCE.' },
    { c: 'Greece', cat: 'landmark',  icon: '🏛️', name: 'the Parthenon', fact: 'This marble temple on the Acropolis was built for the goddess Athena 2,400 years ago.' },
    { c: 'Greece', cat: 'discovery', icon: '📐', name: 'geometry', fact: 'Greek thinkers like Euclid and Pythagoras wrote down the rules of geometry.' },
    { c: 'Greece', cat: 'history',   icon: '🧠', name: 'the great philosophers', fact: 'Socrates, Plato, and Aristotle taught people how to think, question, and reason.' },
    { c: 'Greece', cat: 'culture',   icon: '🎭', name: 'theatre', fact: 'The Greeks invented drama, staging the first comedies and tragedies.' },
    { c: 'Greece', cat: 'art',       icon: '🗿', name: 'marble sculpture', fact: 'Greek artists carved lifelike marble statues of gods and athletes that still inspire artists today.' },

    // ---- Mexico ----
    { c: 'Mexico', cat: 'food',     icon: '🍫', name: 'chocolate', fact: 'The Maya and Aztecs made a bitter chocolate drink from cacao beans long before Europeans tasted it.' },
    { c: 'Mexico', cat: 'food',     icon: '🌽', name: 'corn (maize)', fact: 'Farmers in Mexico tamed corn from a wild grass over 9,000 years ago.' },
    { c: 'Mexico', cat: 'landmark', icon: '🔺', name: 'Chichén Itzá', fact: 'The Maya built this great stepped pyramid, El Castillo, as a temple and calendar.' },
    { c: 'Mexico', cat: 'history',  icon: '🦅', name: 'the Aztec Empire', fact: 'The Aztecs built a huge capital on a lake, where Mexico City stands today.' },
    { c: 'Mexico', cat: 'culture',  icon: '💀', name: 'Day of the Dead', fact: 'Families honor loved ones who have died with marigolds, sugar skulls, and altars.' },
    { c: 'Mexico', cat: 'art',      icon: '🎨', name: 'Frida Kahlo’s paintings', fact: 'Frida Kahlo became world-famous for her bold, colorful self-portraits.' },

    // ---- Brazil ----
    { c: 'Brazil', cat: 'landmark', icon: '⛰️', name: 'Christ the Redeemer', fact: 'This 30-meter statue watches over Rio de Janeiro from a mountaintop.' },
    { c: 'Brazil', cat: 'culture',  icon: '🥁', name: 'Carnival and samba', fact: 'Brazil’s Carnival fills the streets with parades, costumes, and samba dancing.' },
    { c: 'Brazil', cat: 'food',     icon: '☕', name: 'coffee', fact: 'Brazil grows more coffee than any other country in the world.' },
    { c: 'Brazil', cat: 'landmark', icon: '🌳', name: 'the Amazon rainforest', fact: 'The world’s largest rainforest is home to millions of kinds of plants and animals.' },
    { c: 'Brazil', cat: 'culture',  icon: '⚽', name: 'football (soccer)', fact: 'Brazil has won the football World Cup a record five times.' },

    // ---- United States ----
    { c: 'United States', cat: 'invention', icon: '💡', name: 'the light bulb', fact: 'Thomas Edison developed a practical, long-lasting electric light bulb in 1879.' },
    { c: 'United States', cat: 'invention', icon: '✈️', name: 'the airplane', fact: 'The Wright brothers made the first powered flight in 1903 in North Carolina.' },
    { c: 'United States', cat: 'culture',   icon: '🎷', name: 'jazz', fact: 'Jazz music was born in New Orleans, blending African and European sounds.' },
    { c: 'United States', cat: 'landmark',  icon: '🗽', name: 'the Statue of Liberty', fact: 'A gift from France in 1886, she welcomes visitors to New York Harbor.' },
    { c: 'United States', cat: 'landmark',  icon: '🏜️', name: 'the Grand Canyon', fact: 'The Colorado River carved this mile-deep canyon over millions of years.' },
    { c: 'United States', cat: 'culture',   icon: '🏀', name: 'basketball', fact: 'James Naismith invented basketball in 1891, using a peach basket as the first hoop.' },

    // ---- United Kingdom ----
    { c: 'United Kingdom', cat: 'discovery', icon: '🍎', name: 'gravity', fact: 'Isaac Newton explained gravity — the force that pulls an apple down and holds planets in orbit.' },
    { c: 'United Kingdom', cat: 'discovery', icon: '💊', name: 'penicillin', fact: 'Alexander Fleming discovered the first antibiotic in 1928, going on to save millions of lives.' },
    { c: 'United Kingdom', cat: 'discovery', icon: '🧬', name: 'the theory of evolution', fact: 'Charles Darwin explained how living things change over time through natural selection.' },
    { c: 'United Kingdom', cat: 'invention', icon: '🕸️', name: 'the World Wide Web', fact: 'Tim Berners-Lee invented the Web in 1989, giving us websites and links.' },
    { c: 'United Kingdom', cat: 'culture',   icon: '✒️', name: 'Shakespeare’s plays', fact: 'William Shakespeare wrote plays like Romeo and Juliet, still performed 400 years later.' },
    { c: 'United Kingdom', cat: 'landmark',  icon: '🗿', name: 'Stonehenge', fact: 'This ring of giant standing stones was raised about 5,000 years ago.' },

    // ---- Peru ----
    { c: 'Peru', cat: 'landmark', icon: '⛰️', name: 'Machu Picchu', fact: 'The Inca built this stone city high in the Andes Mountains in the 1400s.' },
    { c: 'Peru', cat: 'food',     icon: '🥔', name: 'the potato', fact: 'Potatoes were first farmed in the Andes of Peru — there are thousands of varieties.' },
    { c: 'Peru', cat: 'history',  icon: '🛤️', name: 'the Inca Empire', fact: 'The Inca ran the largest empire in the Americas, linked by 40,000 km of roads.' },
    { c: 'Peru', cat: 'culture',  icon: '🦙', name: 'llamas and weaving', fact: 'Andean people raised llamas and wove colorful cloth from soft alpaca wool.' },

    // ---- Australia ----
    { c: 'Australia', cat: 'landmark', icon: '🎭', name: 'the Sydney Opera House', fact: 'Its white sail-shaped roofs make it one of the most famous buildings on Earth.' },
    { c: 'Australia', cat: 'landmark', icon: '🪨', name: 'Uluru', fact: 'This giant red sandstone rock in the outback is sacred to Aboriginal Australians.' },
    { c: 'Australia', cat: 'landmark', icon: '🐠', name: 'the Great Barrier Reef', fact: 'The world’s largest coral reef is so big it can be seen from space.' },
    { c: 'Australia', cat: 'culture',  icon: '🪃', name: 'the boomerang', fact: 'Aboriginal Australians made boomerangs, some shaped to curve back when thrown.' },
    { c: 'Australia', cat: 'culture',  icon: '🦘', name: 'kangaroos and koalas', fact: 'These animals live naturally only in Australia and nowhere else.' },

    // ---- Germany ----
    { c: 'Germany', cat: 'invention', icon: '🖨️', name: 'the printing press', fact: 'Johannes Gutenberg’s movable-type press (about 1440) made books cheap and common.' },
    { c: 'Germany', cat: 'invention', icon: '🚗', name: 'the automobile', fact: 'Karl Benz built the first practical gasoline-powered car in 1886.' },
    { c: 'Germany', cat: 'invention', icon: '💊', name: 'aspirin', fact: 'The pain reliever aspirin was developed by the German company Bayer in 1897.' },
    { c: 'Germany', cat: 'culture',   icon: '🎼', name: 'classical music', fact: 'Germany gave the world great composers like Beethoven and Bach.' },
    { c: 'Germany', cat: 'food',      icon: '🥨', name: 'the pretzel', fact: 'The twisted, knotted pretzel is a beloved German snack with medieval roots.' }
  ]
};
