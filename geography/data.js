// World Explorer data. Facts kept kid-friendly and checkable.
// ITEMS drive both modes: "Which country is this from?" and (via a country's
// own items) "Guess the country from these clues."
window.GEO = {
  CAT_LABEL: {
    art: 'Art', invention: 'Invention', discovery: 'Discovery',
    food: 'Food & Farming', landmark: 'Landmark', history: 'History', culture: 'Culture', geo: 'Geography'
  },
  // Category filters shown in Match It.
  CATS: [
    ['all', 'All'], ['geo', '🗺️ Geography'], ['landmark', '🏛️ Landmarks'], ['invention', '💡 Inventions'],
    ['discovery', '🔬 Discoveries'], ['food', '🌾 Food & Farming'],
    ['art', '🎨 Art'], ['history', '📜 History'], ['culture', '🎭 Culture']
  ],
  COUNTRIES: {
    'France':        { flag: '🇫🇷', continent: 'Europe',        capital: 'Paris',        lang: 'French',            blurb: 'A country in western Europe famous for its art and food, and for the French Revolution that began in 1789.' },
    'Italy':         { flag: '🇮🇹', continent: 'Europe',        capital: 'Rome',         lang: 'Italian',           blurb: 'A boot-shaped country in southern Europe, home of the ancient Roman Empire and, later, the Renaissance.' },
    'Japan':         { flag: '🇯🇵', continent: 'Asia',          capital: 'Tokyo',        lang: 'Japanese',          blurb: 'An island nation in East Asia that blends centuries-old traditions with cutting-edge technology.' },
    'Egypt':         { flag: '🇪🇬', continent: 'Africa',        capital: 'Cairo',        lang: 'Arabic',            blurb: 'A country in northeastern Africa, home to one of the world’s oldest civilizations along the Nile River.' },
    'China':         { flag: '🇨🇳', continent: 'Asia',          capital: 'Beijing',      lang: 'Mandarin Chinese',  blurb: 'The world’s most populous country, in East Asia, with inventions and history stretching back thousands of years.' },
    'India':         { flag: '🇮🇳', continent: 'Asia',          capital: 'New Delhi',    lang: 'Hindi & English',   blurb: 'A large country in South Asia famous for its spices, its mathematics, and hundreds of languages.' },
    'Greece':        { flag: '🇬🇷', continent: 'Europe',        capital: 'Athens',       lang: 'Greek',             blurb: 'A country in southeastern Europe, often called the birthplace of democracy, philosophy, and the Olympic Games.' },
    'Mexico':        { flag: '🇲🇽', continent: 'North America', capital: 'Mexico City',  lang: 'Spanish',           blurb: 'A country in North America with deep roots in the ancient Aztec and Maya civilizations.' },
    'Brazil':        { flag: '🇧🇷', continent: 'South America', capital: 'Brasília',     lang: 'Portuguese',        blurb: 'The largest country in South America, much of it covered by the vast Amazon rainforest.' },
    'United States': { flag: '🇺🇸', continent: 'North America', capital: 'Washington, D.C.', lang: 'English',       blurb: 'A large country in North America made of 50 states, known for jazz, movies, and invention.' },
    'United Kingdom':{ flag: '🇬🇧', continent: 'Europe',        capital: 'London',       lang: 'English',           blurb: 'An island nation off the coast of Europe that once ruled a global empire and gave the world Shakespeare.' },
    'Peru':          { flag: '🇵🇪', continent: 'South America', capital: 'Lima',         lang: 'Spanish & Quechua', blurb: 'A country in the Andes Mountains of South America, once the heart of the mighty Inca Empire.' },
    'Australia':     { flag: '🇦🇺', continent: 'Oceania',       capital: 'Canberra',     lang: 'English',           blurb: 'A country that is also a whole continent, famous for unique animals like kangaroos and koalas.' },
    'Germany':       { flag: '🇩🇪', continent: 'Europe',        capital: 'Berlin',       lang: 'German',            blurb: 'A country in central Europe known for its engineering, its castles, and its classical composers.' },
    'Spain':         { flag: '🇪🇸', continent: 'Europe',        capital: 'Madrid',       lang: 'Spanish',           blurb: 'A country on the Iberian Peninsula in southwestern Europe, known for flamenco, football, and a golden age of exploration.' },
    'Canada':        { flag: '🇨🇦', continent: 'North America', capital: 'Ottawa',       lang: 'English & French',  blurb: 'The second-largest country in the world, reaching from the Atlantic to the Pacific to the Arctic, famous for maple syrup and vast wilderness.' },
    'Russia':        { flag: '🇷🇺', continent: 'Europe & Asia', capital: 'Moscow',       lang: 'Russian',           blurb: 'The largest country in the world by area, spanning eastern Europe and northern Asia across eleven time zones.' },
    'South Korea':   { flag: '🇰🇷', continent: 'Asia',          capital: 'Seoul',        lang: 'Korean',            blurb: 'A high-tech country on the southern half of the Korean Peninsula in East Asia, known for K-pop, gaming, and electronics.' },
    'Argentina':     { flag: '🇦🇷', continent: 'South America', capital: 'Buenos Aires', lang: 'Spanish',           blurb: 'A large South American country famous for tango, beef, football, and the wild peaks of Patagonia.' },
    'Netherlands':   { flag: '🇳🇱', continent: 'Europe',        capital: 'Amsterdam',    lang: 'Dutch',             blurb: 'A low, flat country in western Europe famous for canals, windmills, tulips, and bicycles.' },
    'Turkey':        { flag: '🇹🇷', continent: 'Asia & Europe', capital: 'Ankara',       lang: 'Turkish',           blurb: 'A country that sits on two continents at once, linking Europe and Asia, with the ancient city of Istanbul.' },
    'Kenya':         { flag: '🇰🇪', continent: 'Africa',        capital: 'Nairobi',      lang: 'Swahili & English', blurb: 'An East African country on the Equator, famous for wildlife safaris and record-breaking distance runners.' }
  },
  // "Find on the Globe" — matched to Natural Earth shapes by ISO numeric id.
  GLOBE: [
    // Europe
    { name: 'France',         id: '250', flag: '🇫🇷', continent: 'Europe',          capital: 'Paris',        lang: 'French',                 hint: 'Famous for the Eiffel Tower and delicious pastries.' },
    { name: 'Italy',          id: '380', flag: '🇮🇹', continent: 'Europe',          capital: 'Rome',         lang: 'Italian',                hint: 'Shaped like a boot — home of pizza and ancient Rome.' },
    { name: 'Germany',        id: '276', flag: '🇩🇪', continent: 'Europe',          capital: 'Berlin',       lang: 'German',                 hint: 'Known for cars, castles, and composers like Beethoven.' },
    { name: 'Spain',          id: '724', flag: '🇪🇸', continent: 'Europe',          capital: 'Madrid',       lang: 'Spanish',                hint: 'Known for flamenco dancing, paella, and sunny beaches.' },
    { name: 'United Kingdom', id: '826', flag: '🇬🇧', continent: 'Europe',          capital: 'London',       lang: 'English',                hint: 'An island nation, home of Shakespeare and Big Ben.' },
    { name: 'Greece',         id: '300', flag: '🇬🇷', continent: 'Europe',          capital: 'Athens',       lang: 'Greek',                  hint: 'The birthplace of democracy and the Olympics.' },
    { name: 'Portugal',       id: '620', flag: '🇵🇹', continent: 'Europe',          capital: 'Lisbon',       lang: 'Portuguese',             hint: 'A coastal country whose sailors once explored the world.' },
    { name: 'Netherlands',    id: '528', flag: '🇳🇱', continent: 'Europe',          capital: 'Amsterdam',    lang: 'Dutch',                  hint: 'A low, flat country famous for tulips, windmills, and bikes.' },
    { name: 'Norway',         id: '578', flag: '🇳🇴', continent: 'Europe',          capital: 'Oslo',         lang: 'Norwegian',              hint: 'A Scandinavian country famous for its deep fjords.' },
    { name: 'Sweden',         id: '752', flag: '🇸🇪', continent: 'Europe',          capital: 'Stockholm',    lang: 'Swedish',                hint: 'A long Scandinavian country of forests and lakes.' },
    { name: 'Finland',        id: '246', flag: '🇫🇮', continent: 'Europe',          capital: 'Helsinki',     lang: 'Finnish',                hint: 'A northern land of forests, lakes, and the northern lights.' },
    { name: 'Denmark',        id: '208', flag: '🇩🇰', continent: 'Europe',          capital: 'Copenhagen',   lang: 'Danish',                 hint: 'A small Scandinavian country and the home of LEGO.' },
    { name: 'Iceland',        id: '352', flag: '🇮🇸', continent: 'Europe',          capital: 'Reykjavík',    lang: 'Icelandic',              hint: 'A volcanic island near the Arctic, full of geysers.' },
    { name: 'Ireland',        id: '372', flag: '🇮🇪', continent: 'Europe',          capital: 'Dublin',       lang: 'English & Irish',        hint: 'A green island known for shamrocks and St. Patrick’s Day.' },
    { name: 'Poland',         id: '616', flag: '🇵🇱', continent: 'Europe',          capital: 'Warsaw',       lang: 'Polish',                 hint: 'A central European country with medieval castles.' },
    { name: 'Ukraine',        id: '804', flag: '🇺🇦', continent: 'Europe',          capital: 'Kyiv',         lang: 'Ukrainian',              hint: 'A large eastern European country of golden wheat fields.' },
    { name: 'Austria',        id: '040', flag: '🇦🇹', continent: 'Europe',          capital: 'Vienna',       lang: 'German',                 hint: 'An Alpine country famous for classical music.' },
    { name: 'Switzerland',    id: '756', flag: '🇨🇭', continent: 'Europe',          capital: 'Bern',         lang: 'German, French & Italian', hint: 'An Alpine country famous for chocolate and watches.' },
    { name: 'Russia',         id: '643', flag: '🇷🇺', continent: 'Europe & Asia',   capital: 'Moscow',       lang: 'Russian',                hint: 'The largest country in the world, spanning two continents.' },
    // Asia
    { name: 'China',          id: '156', flag: '🇨🇳', continent: 'Asia',            capital: 'Beijing',      lang: 'Mandarin Chinese',       hint: 'The most populous country, home of the Great Wall.' },
    { name: 'Japan',          id: '392', flag: '🇯🇵', continent: 'Asia',            capital: 'Tokyo',        lang: 'Japanese',               hint: 'An island nation known for sushi and Mount Fuji.' },
    { name: 'India',          id: '356', flag: '🇮🇳', continent: 'Asia',            capital: 'New Delhi',    lang: 'Hindi & English',        hint: 'A vast country known for spices and the Taj Mahal.' },
    { name: 'Indonesia',      id: '360', flag: '🇮🇩', continent: 'Asia',            capital: 'Jakarta',      lang: 'Indonesian',             hint: 'A nation of thousands of islands in Southeast Asia.' },
    { name: 'Saudi Arabia',   id: '682', flag: '🇸🇦', continent: 'Asia',            capital: 'Riyadh',       lang: 'Arabic',                 hint: 'A desert kingdom in the Middle East, rich in oil.' },
    { name: 'Turkey',         id: '792', flag: '🇹🇷', continent: 'Asia & Europe',   capital: 'Ankara',       lang: 'Turkish',                hint: 'A country bridging Europe and Asia, home of old Istanbul.' },
    { name: 'Iran',           id: '364', flag: '🇮🇷', continent: 'Asia',            capital: 'Tehran',       lang: 'Persian',                hint: 'A Middle Eastern country with a very old Persian culture.' },
    { name: 'Iraq',           id: '368', flag: '🇮🇶', continent: 'Asia',            capital: 'Baghdad',      lang: 'Arabic',                 hint: 'Home of ancient Mesopotamia, a “cradle of civilization.”' },
    { name: 'Pakistan',       id: '586', flag: '🇵🇰', continent: 'Asia',            capital: 'Islamabad',    lang: 'Urdu',                   hint: 'A South Asian country reaching into the Himalaya mountains.' },
    { name: 'Bangladesh',     id: '050', flag: '🇧🇩', continent: 'Asia',            capital: 'Dhaka',        lang: 'Bengali',                hint: 'A low-lying South Asian country crossed by great rivers.' },
    { name: 'Thailand',       id: '764', flag: '🇹🇭', continent: 'Asia',            capital: 'Bangkok',      lang: 'Thai',                   hint: 'A Southeast Asian country famous for temples and food.' },
    { name: 'Vietnam',        id: '704', flag: '🇻🇳', continent: 'Asia',            capital: 'Hanoi',        lang: 'Vietnamese',             hint: 'A long Southeast Asian country known for rice and pho.' },
    { name: 'South Korea',    id: '410', flag: '🇰🇷', continent: 'Asia',            capital: 'Seoul',        lang: 'Korean',                 hint: 'An East Asian country famous for K-pop and technology.' },
    { name: 'Philippines',    id: '608', flag: '🇵🇭', continent: 'Asia',            capital: 'Manila',       lang: 'Filipino',               hint: 'A Southeast Asian nation of over 7,000 islands.' },
    { name: 'Malaysia',       id: '458', flag: '🇲🇾', continent: 'Asia',            capital: 'Kuala Lumpur', lang: 'Malay',                  hint: 'A Southeast Asian country of rainforests and tall towers.' },
    { name: 'Kazakhstan',     id: '398', flag: '🇰🇿', continent: 'Asia',            capital: 'Astana',       lang: 'Kazakh',                 hint: 'The largest landlocked country, on the Central Asian steppe.' },
    { name: 'Mongolia',       id: '496', flag: '🇲🇳', continent: 'Asia',            capital: 'Ulaanbaatar',  lang: 'Mongolian',              hint: 'A land of wide grasslands where many still live as nomads.' },
    { name: 'Myanmar',        id: '104', flag: '🇲🇲', continent: 'Asia',            capital: 'Naypyidaw',    lang: 'Burmese',                hint: 'A Southeast Asian country famous for golden pagodas.' },
    { name: 'Afghanistan',    id: '004', flag: '🇦🇫', continent: 'Asia',            capital: 'Kabul',        lang: 'Dari & Pashto',          hint: 'A rugged, mountainous country in Central Asia.' },
    // Africa
    { name: 'Egypt',          id: '818', flag: '🇪🇬', continent: 'Africa',          capital: 'Cairo',        lang: 'Arabic',                 hint: 'Home of the ancient pyramids and the Nile River.' },
    { name: 'Nigeria',        id: '566', flag: '🇳🇬', continent: 'Africa',          capital: 'Abuja',        lang: 'English',                hint: 'The most populous country in Africa.' },
    { name: 'South Africa',   id: '710', flag: '🇿🇦', continent: 'Africa',          capital: 'Pretoria',     lang: 'English, Zulu & more',   hint: 'At the southern tip of Africa, known for wildlife safaris.' },
    { name: 'Kenya',          id: '404', flag: '🇰🇪', continent: 'Africa',          capital: 'Nairobi',      lang: 'Swahili & English',      hint: 'An East African country famous for safaris and runners.' },
    { name: 'Ethiopia',       id: '231', flag: '🇪🇹', continent: 'Africa',          capital: 'Addis Ababa',  lang: 'Amharic',                hint: 'An ancient East African country, the birthplace of coffee.' },
    { name: 'Morocco',        id: '504', flag: '🇲🇦', continent: 'Africa',          capital: 'Rabat',        lang: 'Arabic',                 hint: 'A North African country of deserts, markets, and old cities.' },
    { name: 'Algeria',        id: '012', flag: '🇩🇿', continent: 'Africa',          capital: 'Algiers',      lang: 'Arabic',                 hint: 'The largest country in Africa, much of it Sahara Desert.' },
    { name: 'Ghana',          id: '288', flag: '🇬🇭', continent: 'Africa',          capital: 'Accra',        lang: 'English',                hint: 'A West African country and a leading grower of cocoa.' },
    { name: 'Tanzania',       id: '834', flag: '🇹🇿', continent: 'Africa',          capital: 'Dodoma',       lang: 'Swahili',                hint: 'Home of Mount Kilimanjaro, Africa’s tallest peak.' },
    { name: 'DR Congo',       id: '180', flag: '🇨🇩', continent: 'Africa',          capital: 'Kinshasa',     lang: 'French',                 hint: 'A huge central African country covered in rainforest.' },
    { name: 'Madagascar',     id: '450', flag: '🇲🇬', continent: 'Africa',          capital: 'Antananarivo', lang: 'Malagasy & French',      hint: 'A large island off Africa with animals found nowhere else.' },
    // North America
    { name: 'United States',  id: '840', flag: '🇺🇸', continent: 'North America',   capital: 'Washington, D.C.', lang: 'English',            hint: 'Home of the Statue of Liberty and Hollywood.' },
    { name: 'Canada',         id: '124', flag: '🇨🇦', continent: 'North America',   capital: 'Ottawa',       lang: 'English & French',       hint: 'The second-largest country, known for maple syrup.' },
    { name: 'Mexico',         id: '484', flag: '🇲🇽', continent: 'North America',   capital: 'Mexico City',  lang: 'Spanish',                hint: 'Home of chocolate, tacos, and Aztec pyramids.' },
    { name: 'Cuba',           id: '192', flag: '🇨🇺', continent: 'North America',   capital: 'Havana',       lang: 'Spanish',                hint: 'A Caribbean island known for music and classic cars.' },
    // South America
    { name: 'Brazil',         id: '076', flag: '🇧🇷', continent: 'South America',   capital: 'Brasília',     lang: 'Portuguese',             hint: 'The largest country in South America, home of the Amazon.' },
    { name: 'Argentina',      id: '032', flag: '🇦🇷', continent: 'South America',   capital: 'Buenos Aires', lang: 'Spanish',                hint: 'A long South American country famous for tango and beef.' },
    { name: 'Peru',           id: '604', flag: '🇵🇪', continent: 'South America',   capital: 'Lima',         lang: 'Spanish & Quechua',      hint: 'Home of Machu Picchu, llamas, and the first potatoes.' },
    { name: 'Chile',          id: '152', flag: '🇨🇱', continent: 'South America',   capital: 'Santiago',     lang: 'Spanish',                hint: 'A long, thin country along South America’s Pacific coast.' },
    { name: 'Colombia',       id: '170', flag: '🇨🇴', continent: 'South America',   capital: 'Bogotá',       lang: 'Spanish',                hint: 'A South American country famous for coffee and emeralds.' },
    { name: 'Venezuela',      id: '862', flag: '🇻🇪', continent: 'South America',   capital: 'Caracas',      lang: 'Spanish',                hint: 'A South American country with the world’s tallest waterfall.' },
    { name: 'Bolivia',        id: '068', flag: '🇧🇴', continent: 'South America',   capital: 'La Paz',       lang: 'Spanish & Quechua',      hint: 'A South American country with a giant mirror-like salt flat.' },
    // Oceania
    { name: 'Australia',      id: '036', flag: '🇦🇺', continent: 'Oceania',         capital: 'Canberra',     lang: 'English',                hint: 'A country and a continent, home of kangaroos.' },
    { name: 'New Zealand',    id: '554', flag: '🇳🇿', continent: 'Oceania',         capital: 'Wellington',   lang: 'English & Māori',        hint: 'Two islands in the Pacific, known for sheep and scenery.' }
  ],

  // Test-style facts (physical geography, economy/government, history) for the globe game.
  GLOBE_FACTS: {
    'France': ['Uses the euro (€) and is a founding member of the European Union.', 'The Seine River runs through Paris; the Alps rise along its eastern border.', 'A democratic republic and a permanent member of the UN Security Council.'],
    'Italy': ['A boot-shaped peninsula in the Mediterranean Sea, plus the islands of Sicily and Sardinia.', 'The Alps form its northern border; the Apennine Mountains run down its center.', 'Rome surrounds Vatican City, the world’s smallest country and the center of the Catholic Church.'],
    'Germany': ['The most populous country in the European Union; its currency is the euro.', 'The Rhine River is a major waterway; the country reunified in 1990 after the Berlin Wall fell.', 'Europe’s largest economy, known for cars and manufacturing.'],
    'Spain': ['Occupies most of the Iberian Peninsula, between the Atlantic Ocean and the Mediterranean Sea.', 'Spanish spread worldwide through Spain’s colonial empire in the Americas.', 'A member of the European Union that uses the euro.'],
    'United Kingdom': ['An island nation made of England, Scotland, Wales, and Northern Ireland.', 'Birthplace of the Industrial Revolution; it once ruled the largest empire in history.', 'A constitutional monarchy; its currency is the pound sterling (£), not the euro.'],
    'Greece': ['A Mediterranean country with thousands of islands and a long, rugged coastline.', 'Ancient Greece was the birthplace of democracy, philosophy, and the Olympic Games.', 'A member of the European Union that uses the euro.'],
    'Portugal': ['On the Atlantic coast of the Iberian Peninsula, west of Spain.', 'Led the Age of Exploration in the 1400s–1500s; Portuguese is now spoken in Brazil and parts of Africa.', 'A member of the European Union that uses the euro.'],
    'Netherlands': ['A low, flat country — much of it lies below sea level and is protected by dikes.', 'Its port of Rotterdam is one of the world’s busiest; known for windmills and tulips.', 'A founding member of the European Union.'],
    'Norway': ['A Scandinavian country with deep coastal fjords carved by glaciers.', 'Rich in oil and natural gas from the North Sea; it is NOT in the European Union.', 'A constitutional monarchy known for a very high standard of living.'],
    'Sweden': ['The largest Scandinavian country, covered in forests and lakes.', 'A member of the European Union, but it keeps its own currency, the krona.', 'Home to global companies like IKEA and Volvo.'],
    'Finland': ['A Nordic country bordering Russia, filled with forests and thousands of lakes.', 'Part of the European Union; famous for saunas and the northern lights.', 'Often ranked among the world’s happiest countries.'],
    'Denmark': ['The smallest Scandinavian country — a peninsula plus many islands.', 'A member of the European Union that keeps its own currency, the krone.', 'A constitutional monarchy and the birthplace of LEGO.'],
    'Iceland': ['A volcanic island in the North Atlantic, near the Arctic Circle.', 'Sits on the Mid-Atlantic Ridge, giving it geysers, hot springs, and volcanoes.', 'One of the most sparsely populated countries in Europe.'],
    'Ireland': ['An island west of Great Britain, called the “Emerald Isle” for its green land.', 'The Great Famine of the 1840s caused mass emigration, especially to the United States.', 'A member of the European Union that uses the euro.'],
    'Poland': ['A Central European country on the flat North European Plain, meeting the Baltic Sea.', 'The German invasion of Poland in 1939 started World War II.', 'A member of the European Union; its currency is the złoty.'],
    'Ukraine': ['The largest country lying entirely within Europe, on the Black Sea.', 'Its rich “black earth” soil makes it a major wheat grower — a “breadbasket of Europe.”', 'Part of the Soviet Union until it became independent in 1991.'],
    'Austria': ['A landlocked, mountainous country in the Alps of Central Europe.', 'The Danube River flows through Vienna, a historic capital of classical music.', 'A member of the European Union that uses the euro.'],
    'Switzerland': ['A landlocked, mountainous country in the Alps, long famous for staying neutral in wars.', 'Home to the Red Cross and many world organizations in Geneva.', 'NOT in the European Union; its currency is the Swiss franc.'],
    'Russia': ['The largest country in the world by area, spanning Europe and Asia across 11 time zones.', 'The Ural Mountains divide its European and Asian sides; Siberia covers much of the east.', 'Was the core of the Soviet Union (USSR) until it broke apart in 1991.'],
    'China': ['The most populous country in East Asia and the world’s second-largest economy.', 'The Yangtze and Yellow (Huang He) Rivers are its great waterways; the Himalayas rise in the west.', 'A communist state, governed by the Chinese Communist Party.'],
    'Japan': ['An island nation on the Pacific “Ring of Fire,” with many earthquakes and volcanoes like Mount Fuji.', 'A constitutional monarchy with an emperor and one of the world’s largest economies.', 'Its attack on Pearl Harbor in 1941 brought the United States into World War II.'],
    'India': ['The world’s most populous country and its largest democracy.', 'The Himalayas rise in the north; the Ganges River is sacred to Hindus.', 'Gained independence from Britain in 1947, led by Mohandas Gandhi.'],
    'Indonesia': ['The world’s largest island nation, with over 17,000 islands along the Equator.', 'Sits on the “Ring of Fire” with many volcanoes; it has the largest Muslim population of any country.', 'Lies between the Indian and Pacific Oceans in Southeast Asia.'],
    'Saudi Arabia': ['Covers most of the Arabian Peninsula and is mostly desert.', 'Holds some of the world’s largest oil reserves, which drive its economy.', 'Home to Mecca and Medina, the two holiest cities in Islam.'],
    'Turkey': ['A country on two continents, split by the Bosporus Strait at Istanbul.', 'Was the center of the Ottoman Empire for over 600 years.', 'A member of NATO located between Europe and the Middle East.'],
    'Iran': ['A mountainous Middle Eastern country formerly known as Persia.', 'Holds major oil and gas reserves; most people are Shia Muslims.', 'The 1979 Iranian Revolution created an Islamic republic.'],
    'Iraq': ['Lies between the Tigris and Euphrates Rivers — ancient Mesopotamia.', 'Often called a “cradle of civilization,” home to ancient Babylon.', 'Has large oil reserves; its capital is Baghdad.'],
    'Pakistan': ['A South Asian country reaching into the Himalayas, including K2, the world’s second-tallest peak.', 'The Indus River supports its farming; it split from India in 1947.', 'Has one of the world’s largest Muslim populations.'],
    'Bangladesh': ['A low, flat, densely populated country on the Ganges–Brahmaputra river delta.', 'Frequent flooding and cyclones strike because much of it sits near sea level.', 'Became independent from Pakistan in 1971.'],
    'Thailand': ['A Southeast Asian country that was never colonized by a European power.', 'A constitutional monarchy where most people practice Buddhism.', 'Known for rice farming, tourism, and its capital, Bangkok.'],
    'Vietnam': ['A long, narrow Southeast Asian country along the South China Sea.', 'The Mekong River delta is a major rice-growing region.', 'The Vietnam War ended in 1975, reuniting the country under communist rule.'],
    'South Korea': ['Occupies the southern half of the Korean Peninsula, split from North Korea in 1953.', 'A high-tech economy home to companies like Samsung and Hyundai.', 'A democracy, in contrast to communist North Korea to its north.'],
    'Philippines': ['A Southeast Asian country of over 7,000 islands on the Pacific “Ring of Fire.”', 'A former Spanish and then American colony, so it is mostly Roman Catholic.', 'Frequently struck by typhoons.'],
    'Malaysia': ['A Southeast Asian country split between the Malay Peninsula and the island of Borneo.', 'Known for rainforests, rubber, palm oil, and the Petronas Towers.', 'A major producer of electronics and tin.'],
    'Kazakhstan': ['The world’s largest landlocked country, on the steppes of Central Asia.', 'Rich in oil and minerals; it was part of the Soviet Union until 1991.', 'Russia launches rockets from the Baikonur Cosmodrome here.'],
    'Mongolia': ['A landlocked country between Russia and China, mostly grassland steppe and the Gobi Desert.', 'The Mongol Empire under Genghis Khan was the largest land empire in history.', 'Many people still live as nomadic herders.'],
    'Myanmar': ['A Southeast Asian country on the Bay of Bengal, formerly called Burma.', 'Mostly Buddhist and famous for golden pagodas.', 'The Irrawaddy River is its main waterway.'],
    'Afghanistan': ['A landlocked, mountainous country in Central Asia crossed by the Hindu Kush range.', 'Sat on the ancient Silk Road trade route between East and West.', 'Its rugged terrain has made it very hard to conquer throughout history.'],
    'Egypt': ['The Nile, the world’s longest river, flows through it to the Mediterranean Sea.', 'Home to the Pyramids of Giza and one of the world’s oldest civilizations.', 'The Suez Canal links the Mediterranean and Red Seas — a vital shipping route.'],
    'Nigeria': ['The most populous country in Africa, on the Gulf of Guinea.', 'Africa’s largest economy, powered by oil from the Niger River delta.', 'Home to “Nollywood,” one of the world’s biggest film industries.'],
    'South Africa': ['At the southern tip of Africa, where the Atlantic and Indian Oceans meet.', 'Ended apartheid (racial segregation) in the 1990s; Nelson Mandela became its first Black president.', 'Rich in gold and diamonds, and it has three capital cities.'],
    'Kenya': ['An East African country crossed by the Equator, on the Indian Ocean.', 'The Great Rift Valley runs through it; famous for wildlife safaris.', 'Known for producing many of the world’s top long-distance runners.'],
    'Ethiopia': ['A landlocked, mountainous country in the Horn of Africa.', 'One of the world’s oldest nations — it was never colonized by Europeans.', 'The Blue Nile begins here; Ethiopia is the birthplace of coffee.'],
    'Morocco': ['A North African country touching both the Atlantic Ocean and the Mediterranean Sea.', 'The Atlas Mountains and the Sahara Desert lie within it.', 'Sits just across the Strait of Gibraltar from Spain.'],
    'Algeria': ['The largest country in Africa by area; most of it is the Sahara Desert.', 'A major producer of oil and natural gas, with a Mediterranean coastline.', 'Gained independence from France in 1962.'],
    'Ghana': ['A West African country on the Gulf of Guinea.', 'The first country in sub-Saharan Africa to gain independence (1957).', 'A leading producer of cocoa and gold.'],
    'Tanzania': ['Home to Mount Kilimanjaro, the highest peak in Africa.', 'Contains part of Lake Victoria and the Serengeti wildlife plains.', 'Swahili, widely spoken across East Africa, is its main language.'],
    'DR Congo': ['A huge Central African country crossed by the Equator and the Congo River.', 'Covered by the world’s second-largest rainforest.', 'Rich in minerals like cobalt and copper used in electronics.'],
    'Madagascar': ['The world’s fourth-largest island, off the southeast coast of Africa.', 'Its long isolation created plants and animals found nowhere else, like lemurs.', 'A former French colony; Malagasy and French are spoken.'],
    'United States': ['One of the largest countries in the world by area, made up of 50 states.', 'The Mississippi River drains its center; the Rocky Mountains rise in the west.', 'The world’s largest economy; its currency is the U.S. dollar.'],
    'Canada': ['The second-largest country in the world by area, north of the United States.', 'Has the world’s longest coastline and thousands of lakes.', 'Officially bilingual (English and French) and a constitutional monarchy.'],
    'Mexico': ['In North America, between the United States and Central America.', 'Home to the ancient Maya and Aztec civilizations.', 'Mexico City, its capital, is one of the largest cities in the world.'],
    'Cuba': ['The largest island in the Caribbean, just south of Florida.', 'A communist country led for decades by Fidel Castro after the 1959 revolution.', 'Known for sugar, tobacco (cigars), and vintage cars.'],
    'Brazil': ['The largest country in South America and the fifth-largest in the world.', 'Contains most of the Amazon Rainforest and the Amazon River.', 'The only Portuguese-speaking country in the Americas.'],
    'Argentina': ['The second-largest country in South America, stretching south toward Antarctica.', 'The Pampas grasslands support cattle ranching and beef exports.', 'The Andes Mountains form its western border with Chile.'],
    'Peru': ['On the Pacific coast of South America, in the Andes Mountains.', 'Was the center of the Inca Empire; Machu Picchu is a famous Inca site.', 'The Amazon River begins high in its mountains.'],
    'Chile': ['A long, thin country along South America’s Pacific coast, west of the Andes.', 'Contains the Atacama Desert, the driest place on Earth.', 'One of the world’s top exporters of copper.'],
    'Colombia': ['The only South American country with coasts on both the Pacific Ocean and the Caribbean Sea.', 'The Andes run through it; a top producer of coffee and emeralds.', 'Named after the explorer Christopher Columbus.'],
    'Venezuela': ['A South American country on the Caribbean coast with huge oil reserves.', 'Home to Angel Falls, the tallest waterfall in the world.', 'The Orinoco River is its major waterway.'],
    'Bolivia': ['A landlocked country high in the Andes Mountains.', 'Contains Salar de Uyuni, the world’s largest salt flat.', 'Shares Lake Titicaca, the highest navigable lake, with Peru.'],
    'Australia': ['The world’s sixth-largest country and the only country that is also a continent.', 'The Great Barrier Reef, the world’s largest coral reef, lies off its coast.', 'Most people live near the coasts; the dry interior is called the Outback.'],
    'New Zealand': ['Two main islands in the South Pacific, southeast of Australia.', 'Sits on the “Ring of Fire” with volcanoes and earthquakes.', 'The indigenous Māori arrived by canoe about 700 years ago.']
  },

  // ---- Landmark Hunt: physical geography, plotted on the globe by [lon, lat] ----
  FEATURE_TYPES: {
    mountain: { label: 'Mountain',       icon: '⛰️', color: '#a16207' },
    river:    { label: 'River',          icon: '🏞️', color: '#2563eb' },
    ocean:    { label: 'Ocean',          icon: '🌊', color: '#0891b2' },
    desert:   { label: 'Desert',         icon: '🏜️', color: '#d97706' },
    natural:  { label: 'Natural Wonder', icon: '🌍', color: '#16a34a' }
  },
  FEATURES: [
    // Mountains
    { name: 'Mount Everest',        type: 'mountain', lon: 86.9,  lat: 28.0,  where: 'On the border of Nepal and China, in the Himalayas of Asia.',        fact: 'At 8,849 m (29,032 ft) it is the highest mountain on Earth above sea level.' },
    { name: 'Mount Kilimanjaro',    type: 'mountain', lon: 37.35, lat: -3.07, where: 'In Tanzania, in East Africa.',                                        fact: 'The tallest mountain in Africa and the highest free-standing mountain in the world.' },
    { name: 'the Andes',            type: 'mountain', lon: -70.0, lat: -32.65,where: 'Running down the western edge of South America.',                     fact: 'The longest mountain range on land — about 7,000 km through seven countries.' },
    { name: 'the Alps',             type: 'mountain', lon: 9.0,   lat: 46.5,  where: 'Across south-central Europe.',                                        fact: 'Europe’s highest range; Mont Blanc is its tallest peak at 4,808 m.' },
    { name: 'the Rocky Mountains',  type: 'mountain', lon: -106.4,lat: 39.1,  where: 'Down western North America, from Canada to New Mexico.',              fact: 'They form the Continental Divide — rivers on each side flow to different oceans.' },
    { name: 'the Ural Mountains',   type: 'mountain', lon: 59.0,  lat: 60.0,  where: 'Running north–south through western Russia.',                         fact: 'They mark the traditional border between the continents of Europe and Asia.' },
    // Rivers
    { name: 'the Nile River',       type: 'river', lon: 31.2, lat: 27.0,  where: 'In northeastern Africa, flowing north through Egypt to the Mediterranean Sea.', fact: 'About 6,650 km long — usually called the longest river in the world.' },
    { name: 'the Amazon River',     type: 'river', lon: -55.0,lat: -2.5,  where: 'Across northern South America, through Brazil.',                    fact: 'It carries more water than any other river — about a fifth of all river water on Earth.' },
    { name: 'the Mississippi River',type: 'river', lon: -91.0,lat: 32.0,  where: 'Down the middle of the United States to the Gulf of Mexico.',       fact: 'With the Missouri it is the longest river system in North America.' },
    { name: 'the Yangtze River',    type: 'river', lon: 112.0,lat: 30.7,  where: 'Across central China.',                                            fact: 'The longest river in Asia and the third-longest in the world.' },
    { name: 'the Ganges River',     type: 'river', lon: 83.0, lat: 25.3,  where: 'Across northern India and Bangladesh.',                            fact: 'Sacred to Hindus, it flows from the Himalayas to the Bay of Bengal.' },
    { name: 'the Danube River',     type: 'river', lon: 19.0, lat: 45.0,  where: 'Across central and eastern Europe.',                               fact: 'It flows through 10 countries — more than any other river in the world.' },
    // Oceans
    { name: 'the Pacific Ocean',  type: 'ocean', lon: -150.0, lat: 0.0,  where: 'Between Asia and Australia on one side and the Americas on the other.', fact: 'The largest and deepest ocean — bigger than all of Earth’s land combined.' },
    { name: 'the Atlantic Ocean', type: 'ocean', lon: -30.0,  lat: 12.0, where: 'Between the Americas and Europe/Africa.',                              fact: 'The second-largest ocean, and it is still slowly getting wider.' },
    { name: 'the Indian Ocean',   type: 'ocean', lon: 78.0,   lat: -25.0,where: 'South of Asia, between Africa and Australia.',                         fact: 'The third-largest and the warmest of the world’s oceans.' },
    { name: 'the Arctic Ocean',   type: 'ocean', lon: 0.0,    lat: 85.0, where: 'Around the North Pole.',                                              fact: 'The smallest and shallowest ocean — much of it is covered in floating sea ice.' },
    { name: 'the Southern Ocean', type: 'ocean', lon: 0.0,    lat: -65.0,where: 'Circling the continent of Antarctica.',                               fact: 'Recognized as the fifth ocean in 2000; it rings Antarctica.' },
    // Deserts & natural wonders
    { name: 'the Sahara Desert',       type: 'desert',  lon: 13.0,  lat: 23.0, where: 'Across northern Africa.',                        fact: 'The largest hot desert on Earth — almost the size of the whole United States.' },
    { name: 'the Gobi Desert',         type: 'desert',  lon: 105.0, lat: 42.5, where: 'Across northern China and southern Mongolia.',    fact: 'A cold desert famous for the dinosaur fossils found there.' },
    { name: 'the Great Barrier Reef',  type: 'natural', lon: 147.0, lat: -18.0,where: 'Off the northeast coast of Australia.',          fact: 'The largest living structure on Earth — it can be seen from space.' },
    { name: 'the Amazon Rainforest',   type: 'natural', lon: -60.0, lat: -3.0, where: 'Across northern South America.',                  fact: 'The largest rainforest — home to about one in ten known species on Earth.' },
    { name: 'the Grand Canyon',        type: 'natural', lon: -112.1,lat: 36.1, where: 'In Arizona, in the United States.',               fact: 'Carved by the Colorado River over millions of years — up to 1.8 km deep.' }
  ],

  // ---- Earth's 4 Spheres: sorting game (Big History Standard 7) ----
  SPHERE_BINS: [
    { key: 'atmosphere', label: 'Atmosphere', icon: '🌬️', desc: 'the air & weather' },
    { key: 'hydrosphere', label: 'Hydrosphere', icon: '💧', desc: 'all the water' },
    { key: 'lithosphere', label: 'Lithosphere', icon: '🪨', desc: 'rock & land' },
    { key: 'biosphere', label: 'Biosphere', icon: '🌿', desc: 'living things' }
  ],
  SPHERE_ITEMS: [
    { icon: '☁️', name: 'a cloud',    sphere: 'atmosphere', why: 'Clouds float in the air, so they belong to the atmosphere — the blanket of gases around Earth.' },
    { icon: '💨', name: 'the wind',   sphere: 'atmosphere', why: 'Wind is moving air, so it is part of the atmosphere.' },
    { icon: '🌫️', name: 'fog',        sphere: 'atmosphere', why: 'Fog is a cloud of tiny water drops in the air near the ground — part of the atmosphere.' },
    { icon: '🌪️', name: 'a tornado',  sphere: 'atmosphere', why: 'A tornado is a violently spinning column of air, so it belongs to the atmosphere.' },
    { icon: '🌊', name: 'the ocean',  sphere: 'hydrosphere', why: 'Oceans are water, so they belong to the hydrosphere — all of Earth’s water.' },
    { icon: '🏞️', name: 'a lake',     sphere: 'hydrosphere', why: 'A lake is water, so it is part of the hydrosphere.' },
    { icon: '🧊', name: 'a glacier',  sphere: 'hydrosphere', why: 'A glacier is frozen water (ice), so it still counts as part of the hydrosphere.' },
    { icon: '🌧️', name: 'rain',       sphere: 'hydrosphere', why: 'Rain is liquid water falling from clouds — part of the hydrosphere.' },
    { icon: '⛰️', name: 'a mountain', sphere: 'lithosphere', why: 'Mountains are rock, so they belong to the lithosphere — Earth’s solid rock and land.' },
    { icon: '🌋', name: 'a volcano',  sphere: 'lithosphere', why: 'A volcano is built of rock and hardened lava, so it is part of the lithosphere.' },
    { icon: '🏜️', name: 'desert sand',sphere: 'lithosphere', why: 'Sand is tiny bits of rock, so it belongs to the lithosphere.' },
    { icon: '💎', name: 'a crystal',  sphere: 'lithosphere', why: 'Crystals and minerals are rock, so they are part of the lithosphere.' },
    { icon: '🦅', name: 'an eagle',   sphere: 'biosphere', why: 'An eagle is alive, so it belongs to the biosphere — all living things.' },
    { icon: '🌳', name: 'a tree',     sphere: 'biosphere', why: 'Trees are living plants, so they are part of the biosphere.' },
    { icon: '🐟', name: 'a fish',     sphere: 'biosphere', why: 'A fish is a living animal, so it belongs to the biosphere (even though it lives in water!).' },
    { icon: '🍄', name: 'a mushroom', sphere: 'biosphere', why: 'A mushroom is a living thing, so it is part of the biosphere.' }
  ],

  // ---- Map Skills: rough continent boxes for the world-grid game (Standards 1–3) ----
  MAP_CONTINENTS: [
    { name: 'North America', lon: [-165, -55], lat: [12, 70] },
    { name: 'South America', lon: [-80, -37],  lat: [-52, 10] },
    { name: 'Europe',        lon: [-9, 38],    lat: [37, 68] },
    { name: 'Africa',        lon: [-15, 50],   lat: [-33, 35] },
    { name: 'Asia',          lon: [45, 145],   lat: [12, 66] },
    { name: 'Australia',     lon: [114, 152],  lat: [-38, -12] }
  ],

  // ---- Teacher Guide + "How to play" text for every mode ----
  TEACHER: {
    match: {
      how: 'A famous thing pops up — an invention, food, landmark, or artwork. Tap the country it came from.',
      point: 'Connect the everyday things kids know (pizza, the number zero, the light bulb) to the places that gave them to the world.',
      learn: 'That every country has contributed ideas, foods, and inventions — and where on the map those places are.',
      explore: 'Ask: what did YOUR family’s countries give the world? Look up one invention and trace where it spread.'
    },
    country: {
      how: 'You get three clues — three famous things from one country. Tap the country that matches all three.',
      point: 'Build reasoning by combining several facts to reach one answer, instead of memorizing single facts.',
      learn: 'How to use several pieces of evidence together, and which famous things belong to which country.',
      explore: 'Pick a country and try to name three things it’s famous for before checking the Countries list.'
    },
    globe: {
      how: 'A country is highlighted on the spinning globe. Drag to spin, pinch or use +/− to zoom, then tap its name. Wrong guesses give a hint.',
      point: 'Turn flat map facts into a real sense of where countries sit on a round Earth.',
      learn: 'Where countries actually are, plus their capital, continent, and language.',
      explore: 'Spin to a country you’ve never heard of and read its facts. Which continent has the most countries?'
    },
    features: {
      how: 'A red pin marks a natural landmark on the globe. Spin and zoom to look around, then tap what the pin is marking — a mountain, river, ocean, or desert.',
      point: 'Teach where Earth’s big physical features are: the mountains, rivers, oceans, and deserts that shape the world.',
      learn: 'To locate famous mountains, rivers, oceans, and deserts, and to tell those types of features apart.',
      explore: 'Find the river nearest to where you live. Which ocean would a message in a bottle reach from your coast?'
    },
    spheres: {
      how: 'An object appears. Decide which of Earth’s four “spheres” it belongs to and tap that button: Atmosphere (air), Hydrosphere (water), Lithosphere (rock & land), or Biosphere (living things).',
      point: 'Introduce the four connected Earth systems that geographers use to describe how the planet works.',
      learn: 'The four spheres — atmosphere, hydrosphere, lithosphere, biosphere — and how to sort things into them.',
      explore: 'Look out a window and name something from each sphere. Can one thing belong to two spheres at once?'
    },
    mapskills: {
      how: 'Read the world grid: the Equator runs left-to-right and the Prime Meridian runs top-to-bottom. Use them, plus N/S/E/W, to answer the question and tap the right choice.',
      point: 'Build the core map skills — hemispheres, the Equator and Prime Meridian, directions, and continents.',
      learn: 'How latitude and longitude split Earth into hemispheres, how to give directions, and where the continents are.',
      explore: 'Which hemisphere do you live in — north or south of the Equator? East or west of the Prime Meridian?'
    }
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
    { c: 'Germany', cat: 'food',      icon: '🥨', name: 'the pretzel', fact: 'The twisted, knotted pretzel is a beloved German snack with medieval roots.' },

    // ================= Geography clues for the original countries (capitals, rivers, mountains, deserts) =================
    { c: 'France', cat: 'geo', icon: '🏙️', name: 'the city of Paris', fact: 'Paris, on the Seine River, is the capital of France.' },
    { c: 'France', cat: 'geo', icon: '🌊', name: 'the Seine River', fact: 'The Seine winds through the heart of Paris, past the Louvre and Notre-Dame.' },
    { c: 'France', cat: 'food', icon: '🥐', name: 'the croissant', fact: 'A buttery, flaky crescent-shaped pastry eaten across France at breakfast.' },

    { c: 'Italy', cat: 'geo', icon: '🏙️', name: 'the city of Rome', fact: 'Rome, once the center of the Roman Empire, is the capital of Italy.' },
    { c: 'Italy', cat: 'geo', icon: '🌋', name: 'Mount Vesuvius', fact: 'The volcano near Naples that buried the Roman city of Pompeii in 79 CE.' },
    { c: 'Italy', cat: 'food', icon: '🍝', name: 'pasta', fact: 'Italians make hundreds of pasta shapes, from spaghetti to ravioli.' },

    { c: 'Japan', cat: 'geo', icon: '🏙️', name: 'the city of Tokyo', fact: 'Tokyo, one of the largest cities on Earth, is the capital of Japan.' },
    { c: 'Japan', cat: 'culture', icon: '🎌', name: 'origami', fact: 'The Japanese art of folding a single sheet of paper into cranes, animals, and shapes.' },
    { c: 'Japan', cat: 'history', icon: '🥷', name: 'the samurai', fact: 'Skilled warriors who followed a strict code of honor in old Japan.' },

    { c: 'Egypt', cat: 'geo', icon: '🏙️', name: 'the city of Cairo', fact: 'Cairo, near the pyramids on the Nile, is the capital of Egypt.' },
    { c: 'Egypt', cat: 'geo', icon: '🌊', name: 'the Nile River', fact: 'The world’s longest river, flowing north through Egypt to the Mediterranean Sea.' },
    { c: 'Egypt', cat: 'geo', icon: '🏜️', name: 'the Sahara Desert', fact: 'The vast desert that covers most of Egypt and stretches across northern Africa.' },

    { c: 'China', cat: 'geo', icon: '🏙️', name: 'the city of Beijing', fact: 'Beijing, home of the Forbidden City, is the capital of China.' },
    { c: 'China', cat: 'geo', icon: '🌊', name: 'the Yangtze River', fact: 'The longest river in Asia, flowing across central China.' },
    { c: 'China', cat: 'landmark', icon: '🏯', name: 'the Forbidden City', fact: 'A vast walled palace in Beijing where Chinese emperors once lived.' },

    { c: 'India', cat: 'geo', icon: '🏙️', name: 'the city of New Delhi', fact: 'New Delhi is the capital of India, the world’s most populous country.' },
    { c: 'India', cat: 'geo', icon: '🌊', name: 'the Ganges River', fact: 'A river sacred to Hindus, flowing from the Himalayas across northern India.' },
    { c: 'India', cat: 'culture', icon: '🧘', name: 'yoga', fact: 'A practice of stretching, breathing, and meditation that began in ancient India.' },

    { c: 'Greece', cat: 'geo', icon: '🏙️', name: 'the city of Athens', fact: 'Athens, birthplace of democracy, is the capital of Greece.' },
    { c: 'Greece', cat: 'geo', icon: '🏔️', name: 'Mount Olympus', fact: 'The highest mountain in Greece, believed by the ancient Greeks to be the home of the gods.' },
    { c: 'Greece', cat: 'food', icon: '🫒', name: 'olives and olive oil', fact: 'Greece has grown olives for thousands of years.' },

    { c: 'Mexico', cat: 'geo', icon: '🏙️', name: 'the city of Mexico City', fact: 'Mexico City, built where the Aztec capital once stood, is the capital of Mexico.' },
    { c: 'Mexico', cat: 'food', icon: '🌮', name: 'tacos', fact: 'Warm tortillas folded around meat, beans, and salsa — a favorite Mexican food.' },
    { c: 'Mexico', cat: 'geo', icon: '🏖️', name: 'the Yucatán Peninsula', fact: 'A tropical region of Mexico with beaches, jungles, and ancient Maya ruins.' },

    { c: 'Brazil', cat: 'geo', icon: '🏙️', name: 'the city of Brasília', fact: 'Brasília, a planned city built in the 1950s, is the capital of Brazil.' },
    { c: 'Brazil', cat: 'geo', icon: '🌊', name: 'the Amazon River', fact: 'The river carrying more water than any other, flowing across northern Brazil.' },

    { c: 'United States', cat: 'geo', icon: '🏙️', name: 'the city of Washington, D.C.', fact: 'Washington, D.C. is the capital of the United States.' },
    { c: 'United States', cat: 'geo', icon: '🌊', name: 'the Mississippi River', fact: 'A great river that drains the middle of the United States to the Gulf of Mexico.' },
    { c: 'United States', cat: 'food', icon: '🍔', name: 'the hamburger', fact: 'A grilled beef patty in a bun — an American fast-food classic.' },

    { c: 'United Kingdom', cat: 'geo', icon: '🏙️', name: 'the city of London', fact: 'London, on the River Thames, is the capital of the United Kingdom.' },
    { c: 'United Kingdom', cat: 'geo', icon: '🌊', name: 'the River Thames', fact: 'The river that flows through London, past Big Ben and the Houses of Parliament.' },
    { c: 'United Kingdom', cat: 'culture', icon: '🫖', name: 'afternoon tea', fact: 'A British tradition of tea served with small sandwiches and cakes.' },

    { c: 'Peru', cat: 'geo', icon: '🏙️', name: 'the city of Lima', fact: 'Lima, on the Pacific coast, is the capital of Peru.' },
    { c: 'Peru', cat: 'culture', icon: '🎶', name: 'panpipe music', fact: 'Andean musicians play flutes and panpipes made from reeds.' },

    { c: 'Australia', cat: 'geo', icon: '🏙️', name: 'the city of Canberra', fact: 'Canberra, a purpose-built city, is the capital of Australia.' },
    { c: 'Australia', cat: 'geo', icon: '🏜️', name: 'the Outback', fact: 'The vast, dry, remote interior of Australia.' },

    { c: 'Germany', cat: 'geo', icon: '🏙️', name: 'the city of Berlin', fact: 'Berlin, once split by a wall, is the capital of Germany.' },
    { c: 'Germany', cat: 'geo', icon: '🌊', name: 'the Rhine River', fact: 'A major river winding past castles and vineyards through western Germany.' },
    { c: 'Germany', cat: 'geo', icon: '🌲', name: 'the Black Forest', fact: 'A large, dark evergreen forest in southwestern Germany, full of fairy-tale legends.' },

    // ================= Spain =================
    { c: 'Spain', cat: 'geo', icon: '🏙️', name: 'the city of Madrid', fact: 'Madrid, in the center of the country, is the capital of Spain.' },
    { c: 'Spain', cat: 'landmark', icon: '🏛️', name: 'the Alhambra', fact: 'A stunning palace in Granada, built when Muslim rulers governed much of Spain.' },
    { c: 'Spain', cat: 'food', icon: '🥘', name: 'paella', fact: 'A famous rice dish from Valencia, cooked with saffron, vegetables, and seafood or meat.' },
    { c: 'Spain', cat: 'culture', icon: '💃', name: 'flamenco', fact: 'A passionate style of music and dance with guitar, singing, and stamping feet, from southern Spain.' },
    { c: 'Spain', cat: 'art', icon: '🎨', name: 'the paintings of Picasso', fact: 'Pablo Picasso, born in Spain, helped invent Cubism and became one of history’s most famous artists.' },
    { c: 'Spain', cat: 'history', icon: '⛵', name: 'the Age of Exploration', fact: 'Spanish ships funded Columbus’s 1492 voyage, opening sea routes across the Atlantic.' },

    // ================= Canada =================
    { c: 'Canada', cat: 'geo', icon: '🏙️', name: 'the city of Ottawa', fact: 'Ottawa is the capital of Canada, the second-largest country in the world.' },
    { c: 'Canada', cat: 'food', icon: '🍁', name: 'maple syrup', fact: 'Canadians tap sugar maple trees each spring to make sweet maple syrup — the leaf is on their flag.' },
    { c: 'Canada', cat: 'landmark', icon: '🏔️', name: 'Banff National Park', fact: 'A famous park in the Canadian Rockies with turquoise lakes and glaciers.' },
    { c: 'Canada', cat: 'culture', icon: '🏒', name: 'ice hockey', fact: 'Canada’s beloved winter sport, played on frozen ponds and in famous arenas.' },
    { c: 'Canada', cat: 'culture', icon: '🦫', name: 'the beaver', fact: 'The hardworking beaver is a national symbol of Canada.' },
    { c: 'Canada', cat: 'history', icon: '🚂', name: 'the transcontinental railway', fact: 'A railway finished in 1885 linked Canada from the Atlantic all the way to the Pacific.' },

    // ================= Russia =================
    { c: 'Russia', cat: 'geo', icon: '🏙️', name: 'the city of Moscow', fact: 'Moscow, home of Red Square and the Kremlin, is the capital of Russia.' },
    { c: 'Russia', cat: 'landmark', icon: '🏰', name: 'Saint Basil’s Cathedral', fact: 'The colorful, swirling onion-domed cathedral on Moscow’s Red Square.' },
    { c: 'Russia', cat: 'history', icon: '🛰️', name: 'the first satellite, Sputnik', fact: 'The Soviet Union launched Sputnik, the first artificial satellite, in 1957, starting the Space Age.' },
    { c: 'Russia', cat: 'culture', icon: '🩰', name: 'ballet', fact: 'Russian companies like the Bolshoi made ballet world-famous.' },
    { c: 'Russia', cat: 'geo', icon: '🏔️', name: 'the Ural Mountains', fact: 'These mountains run through Russia and mark the border between Europe and Asia.' },
    { c: 'Russia', cat: 'culture', icon: '🪆', name: 'nesting dolls', fact: 'Wooden matryoshka dolls nest one inside another — a classic Russian craft.' },

    // ================= South Korea =================
    { c: 'South Korea', cat: 'geo', icon: '🏙️', name: 'the city of Seoul', fact: 'Seoul, a huge high-tech city, is the capital of South Korea.' },
    { c: 'South Korea', cat: 'culture', icon: '🎵', name: 'K-pop', fact: 'South Korea’s pop music, with groups like BTS, is popular all around the world.' },
    { c: 'South Korea', cat: 'food', icon: '🥬', name: 'kimchi', fact: 'A spicy fermented cabbage side dish eaten at almost every Korean meal.' },
    { c: 'South Korea', cat: 'invention', icon: '📱', name: 'smartphones & electronics', fact: 'Korean companies like Samsung make many of the world’s phones and TVs.' },
    { c: 'South Korea', cat: 'invention', icon: '🔤', name: 'the Hangul alphabet', fact: 'King Sejong created the easy-to-learn Hangul alphabet in the 1440s.' },
    { c: 'South Korea', cat: 'culture', icon: '🕹️', name: 'esports', fact: 'South Korea helped turn competitive video gaming into a huge spectator sport.' },

    // ================= Argentina =================
    { c: 'Argentina', cat: 'geo', icon: '🏙️', name: 'the city of Buenos Aires', fact: 'Buenos Aires, on the Río de la Plata, is the capital of Argentina.' },
    { c: 'Argentina', cat: 'culture', icon: '💃', name: 'the tango', fact: 'This dramatic partner dance was born in the neighborhoods of Buenos Aires.' },
    { c: 'Argentina', cat: 'food', icon: '🥩', name: 'asado (barbecue)', fact: 'Argentines are famous for grilling beef over open fire at cookouts called asado.' },
    { c: 'Argentina', cat: 'culture', icon: '⚽', name: 'football legends', fact: 'Argentina produced stars like Messi and Maradona and has won the football World Cup.' },
    { c: 'Argentina', cat: 'geo', icon: '🏔️', name: 'Patagonia', fact: 'A wild region of mountains, glaciers, and grasslands at the southern tip of South America.' },
    { c: 'Argentina', cat: 'geo', icon: '🌾', name: 'the Pampas', fact: 'Wide, grassy plains where gauchos (cowboys) herd cattle.' },

    // ================= Netherlands =================
    { c: 'Netherlands', cat: 'geo', icon: '🏙️', name: 'the city of Amsterdam', fact: 'Amsterdam, laced with canals, is the capital of the Netherlands.' },
    { c: 'Netherlands', cat: 'landmark', icon: '🌬️', name: 'windmills', fact: 'The Dutch built windmills to grind grain and pump water off their low land.' },
    { c: 'Netherlands', cat: 'food', icon: '🧀', name: 'Gouda cheese', fact: 'Round wheels of Gouda and Edam cheese are famous Dutch exports.' },
    { c: 'Netherlands', cat: 'culture', icon: '🌷', name: 'tulips', fact: 'The Netherlands grows and sells more tulips than anywhere else on Earth.' },
    { c: 'Netherlands', cat: 'art', icon: '🎨', name: 'the paintings of Van Gogh', fact: 'Vincent van Gogh, a Dutch painter, created The Starry Night and Sunflowers.' },
    { c: 'Netherlands', cat: 'geo', icon: '🌊', name: 'land below the sea', fact: 'The Dutch built dikes to hold back the sea and farm land that is actually below sea level.' },

    // ================= Turkey =================
    { c: 'Turkey', cat: 'geo', icon: '🏙️', name: 'the city of Ankara', fact: 'Ankara is the capital of Turkey (though Istanbul is its largest city).' },
    { c: 'Turkey', cat: 'landmark', icon: '🕌', name: 'the Hagia Sophia', fact: 'A giant domed building in Istanbul that has been a church, a mosque, and a museum over 1,500 years.' },
    { c: 'Turkey', cat: 'geo', icon: '🌉', name: 'the city of Istanbul', fact: 'Istanbul sits on two continents — part in Europe, part in Asia — split by a narrow strait.' },
    { c: 'Turkey', cat: 'food', icon: '🍢', name: 'kebabs', fact: 'Grilled meat kebabs are a famous food from Turkey and the wider Middle East.' },
    { c: 'Turkey', cat: 'history', icon: '👑', name: 'the Ottoman Empire', fact: 'For over 600 years the Ottoman Empire ruled from Istanbul across three continents.' },
    { c: 'Turkey', cat: 'food', icon: '🍬', name: 'Turkish delight', fact: 'A chewy, sweet candy dusted with powdered sugar.' },

    // ================= Kenya =================
    { c: 'Kenya', cat: 'geo', icon: '🏙️', name: 'the city of Nairobi', fact: 'Nairobi is the capital of Kenya, in East Africa.' },
    { c: 'Kenya', cat: 'culture', icon: '🦁', name: 'safari wildlife', fact: 'Kenya’s parks are famous for lions, elephants, giraffes, and the great wildebeest migration.' },
    { c: 'Kenya', cat: 'culture', icon: '🏃', name: 'long-distance runners', fact: 'Kenyan runners win many of the world’s biggest marathons and Olympic races.' },
    { c: 'Kenya', cat: 'geo', icon: '🏔️', name: 'the Great Rift Valley', fact: 'A huge valley formed as Earth’s tectonic plates slowly pull apart, running through Kenya.' },
    { c: 'Kenya', cat: 'food', icon: '🌽', name: 'ugali', fact: 'A thick maize porridge that is a staple food across East Africa.' },
    { c: 'Kenya', cat: 'culture', icon: '🔴', name: 'the Maasai people', fact: 'The Maasai are known for their red cloaks, beadwork, and cattle-herding traditions.' }
  ]
};
