// Grease Monkey Garage — car & mechanic learning content.
// Parts drawn by carart.js. Facts kept accurate and kid-friendly.
window.CARS = {

  // ---- GAME 1: NAME THAT PART (icon shown → pick the name; reveal the job) ----
  // `key` matches a CARART.part() icon. `cat` drives the category filter.
  PARTS: [
    { key:'engine',     name:'Engine',            cat:'engine',   job:'Burns fuel to make the power that turns the wheels. It’s the heart of the car.', where:'Under the hood, up front on most cars.' },
    { key:'battery',    name:'Battery',           cat:'electric', job:'Stores electricity to start the engine and run the lights, radio, and computers.', where:'Under the hood, usually off to one side.' },
    { key:'tire',       name:'Tire',              cat:'wheels',   job:'The only part that touches the road. Its rubber tread grips so the car can go, turn, and stop.', where:'One at each corner of the car.' },
    { key:'brakes',     name:'Brakes',            cat:'wheels',   job:'Squeeze a spinning disc to slow the wheels down. That’s how the car stops.', where:'Behind each wheel.' },
    { key:'sparkplug',  name:'Spark Plug',        cat:'engine',   job:'Makes a tiny spark that lights the fuel inside the engine — like a lighter for each cylinder.', where:'On top of the engine, one per cylinder.' },
    { key:'radiator',   name:'Radiator',          cat:'engine',   job:'Cools down the hot engine by letting air blow across coolant flowing through it.', where:'At the very front, behind the grille.' },
    { key:'oil',        name:'Oil',               cat:'engine',   job:'Slippery liquid that keeps the engine’s moving metal parts from grinding and overheating.', where:'Inside the engine; you check it with a dipstick.' },
    { key:'alternator', name:'Alternator',        cat:'electric', job:'A mini generator spun by the engine. It recharges the battery and powers the car while you drive.', where:'On the side of the engine, spun by a belt.' },
    { key:'steering',   name:'Steering Wheel',    cat:'controls', job:'The wheel the driver holds to turn the car left and right.', where:'In front of the driver.' },
    { key:'seatbelt',   name:'Seat Belt',         cat:'safety',   job:'Holds you safely in your seat and stops you from flying forward in a crash.', where:'At every seat.' },
    { key:'headlight',  name:'Headlight',         cat:'safety',   job:'Bright lights that let you see the road at night and let other drivers see you.', where:'On the front corners of the car.' },
    { key:'transmission',name:'Transmission',     cat:'engine',   job:'A box of gears that decides how much engine power goes to the wheels — for starting slow or cruising fast.', where:'Bolted to the back of the engine.' },
    { key:'exhaust',    name:'Exhaust / Muffler', cat:'engine',   job:'Carries the engine’s waste gases out the back and quiets the noise.', where:'Underneath, running to the back of the car.' },
    { key:'airfilter',  name:'Air Filter',        cat:'engine',   job:'Cleans the air before it goes into the engine, catching dust and bugs.', where:'In a box near the top of the engine.' },
    { key:'wiper',      name:'Windshield Wiper',  cat:'controls', job:'Wipes rain and snow off the windshield so the driver can see.', where:'On the windshield.' },
    { key:'fuelpump',   name:'Fuel Pump',         cat:'engine',   job:'Pushes gasoline from the tank up to the engine so it always has fuel to burn.', where:'Usually inside the fuel tank.' }
  ],
  PART_CATS: [
    ['all','All'], ['engine','⚙️ Engine'], ['wheels','🛞 Wheels & Brakes'],
    ['electric','🔋 Electrical'], ['safety','🦺 Safety'], ['controls','🎮 Controls']
  ],

  // ---- GAME 2: UNDER THE HOOD (tap the part on the car diagram) ----
  // Keys must match hotspots baked into CARART.carDiagram().
  DIAGRAM_PARTS: [
    { key:'engine',    name:'Engine',    hint:'The heart of the car — makes the power.' },
    { key:'battery',   name:'Battery',   hint:'Stores electricity to start the car.' },
    { key:'radiator',  name:'Radiator',  hint:'Keeps the engine from overheating.' },
    { key:'headlight', name:'Headlight', hint:'Lights up the road at night.' },
    { key:'brakes',    name:'Brakes',    hint:'Slows and stops the wheels.' },
    { key:'fueltank',  name:'Fuel Tank', hint:'Holds the gasoline.' },
    { key:'exhaust',   name:'Exhaust Pipe', hint:'Sends waste gases out the back.' },
    { key:'steering',  name:'Steering Wheel', hint:'The driver turns it to steer.' }
  ],

  // ---- GAME 3: HOW CARS WORK (systems quiz) ----
  HOWITWORKS: [
    { q:'What does an engine actually do?', choices:['Burns fuel to create power that turns the wheels','Stores electricity for the lights','Cools the car down','Cleans the air'], answer:0,
      explain:'The engine burns a mix of fuel and air. Those little explosions push pistons up and down, which spins a shaft that turns the wheels.' },
    { q:'What is the job of the battery?', choices:['To start the engine and power the electronics','To make the car go fast','To cool the engine','To hold gasoline'], answer:0,
      explain:'The battery gives the big jolt of electricity needed to start the engine, and runs things like lights and the radio. The alternator recharges it while you drive.' },
    { q:'How do the brakes stop the car?', choices:['Pads squeeze a spinning disc to slow the wheels','They pour water on the tires','They turn off the engine','They let air out of the tires'], answer:0,
      explain:'When you press the brake pedal, pads clamp onto a metal disc at each wheel. The rubbing (friction) turns motion into heat and slows the car down.' },
    { q:'Why does an engine need oil?', choices:['To keep metal parts slippery so they don’t grind','To make the fuel burn','To fill the tires','To clean the windshield'], answer:0,
      explain:'Oil coats the fast-moving metal parts inside the engine so they slide smoothly instead of grinding and wearing out. That’s why oil changes matter!' },
    { q:'What does a radiator do?', choices:['Cools the engine using coolant and air','Makes the engine hotter','Powers the headlights','Steers the car'], answer:0,
      explain:'Engines make a LOT of heat. Coolant flows through the engine, carries the heat to the radiator, and air blowing through the radiator cools it back down.' },
    { q:'What are spark plugs for?', choices:['They make a spark that lights the fuel','They pump the gas','They hold the wheels on','They clean the oil'], answer:0,
      explain:'Each spark plug snaps a tiny spark at just the right moment to ignite the fuel-and-air mix in a cylinder. No spark, no “bang,” no power.' },
    { q:'What does the alternator do while you drive?', choices:['Recharges the battery and powers the car','Fills the gas tank','Cools the brakes','Turns the steering wheel'], answer:0,
      explain:'The spinning engine turns the alternator, which makes fresh electricity. It refills the battery and runs everything electrical so the battery doesn’t die.' },
    { q:'What is the transmission’s job?', choices:['Choosing the right gear for speed and power','Making electricity','Filtering the air','Holding the doors on'], answer:0,
      explain:'Gears trade speed for power. Low gears give lots of push to get moving; high gears let the engine relax at cruising speed. The transmission picks between them.' },
    { q:'Why do tires have grooves (tread)?', choices:['To grip the road and push away water','To look cool','To make noise','To save gas'], answer:0,
      explain:'The grooves channel rain out from under the tire so the rubber can grip the road. Bald (worn) tires slide, especially in the rain.' },
    { q:'What does the fuel pump do?', choices:['Pushes gas from the tank to the engine','Pumps air into the tires','Pumps water onto the windshield','Pumps oil into the brakes'], answer:0,
      explain:'The engine is up front but the gas is in a tank at the back. The fuel pump pushes gasoline forward through a line so the engine always has fuel.' },
    { q:'Where does an electric car get its power instead of gasoline?', choices:['A big rechargeable battery pack','A bigger radiator','More spark plugs','A second muffler'], answer:0,
      explain:'Electric cars skip the gas engine. A large battery pack stores electricity and feeds electric motors that spin the wheels — no fuel, no exhaust.' },
    { q:'What is under-the-hood coolant (antifreeze) for?', choices:['Carrying heat away from the engine','Making the car smell nice','Cleaning the windows','Charging the battery'], answer:0,
      explain:'Coolant soaks up the engine’s heat and carries it to the radiator. It also keeps from freezing in winter or boiling in summer.' }
  ],

  // ---- GAME 4: FIX IT SHOP (symptom → which part to fix) ----
  // `answer` is a PARTS key; `choices` are PARTS keys (include the answer).
  FIXES: [
    { symptom:'You turn the key and hear click-click-click, but the engine won’t start. The lights are dim too.',
      answer:'battery', choices:['battery','tire','radiator','wiper'],
      explain:'That clicking with dim lights is the classic sign of a dead or weak BATTERY — there isn’t enough power to spin the starter.' },
    { symptom:'There’s a loud squealing sound every time you press the brake pedal.',
      answer:'brakes', choices:['brakes','headlight','fuelpump','airfilter'],
      explain:'Worn-out BRAKE pads have a little metal tab that squeals on purpose to warn you it’s time for new pads.' },
    { symptom:'The temperature gauge is in the red and steam is rising from under the hood.',
      answer:'radiator', choices:['radiator','seatbelt','sparkplug','tire'],
      explain:'Steam and a high temperature mean the engine is overheating — usually a RADIATOR or coolant problem. Pull over and let it cool!' },
    { symptom:'The engine runs rough and shaky, and the check-engine light came on.',
      answer:'sparkplug', choices:['sparkplug','steering','headlight','exhaust'],
      explain:'A rough, shaky idle often means a worn SPARK PLUG is misfiring — one cylinder isn’t lighting its fuel properly.' },
    { symptom:'There’s a dark, slippery puddle under the engine when you pull out of the driveway.',
      answer:'oil', choices:['oil','tire','battery','wiper'],
      explain:'A dark puddle under the engine is usually an OIL leak. Low oil can ruin an engine, so it needs fixing fast.' },
    { symptom:'At night you notice one side of the road ahead is dark and hard to see.',
      answer:'headlight', choices:['headlight','radiator','transmission','fuelpump'],
      explain:'A burned-out HEADLIGHT bulb leaves one side dark. Easy fix, but important for seeing and being seen.' },
    { symptom:'The headlights are getting dim and the battery warning light is glowing while you drive.',
      answer:'alternator', choices:['alternator','brakes','airfilter','seatbelt'],
      explain:'If the battery is charged but things still dim WHILE driving, the ALTERNATOR isn’t making electricity. The battery is slowly draining.' },
    { symptom:'The car shudders and won’t change gears smoothly when speeding up.',
      answer:'transmission', choices:['transmission','headlight','radiator','wiper'],
      explain:'Rough, jerky gear changes point to the TRANSMISSION — the gearbox that decides how power reaches the wheels.' },
    { symptom:'It’s pouring rain and you can’t see well — the glass in front stays streaky and blurry.',
      answer:'wiper', choices:['wiper','sparkplug','battery','exhaust'],
      explain:'Streaky, blurry glass in the rain means the WINDSHIELD WIPERS are worn out and need new blades.' },
    { symptom:'The steering wheel shakes and vibrates in your hands at highway speed.',
      answer:'tire', choices:['tire','oil','headlight','alternator'],
      explain:'A shake that gets worse with speed usually means a TIRE is out of balance or worn unevenly.' },
    { symptom:'The engine is losing power and the check-engine light is on. The air box looks packed with dust and leaves.',
      answer:'airfilter', choices:['airfilter','seatbelt','brakes','radiator'],
      explain:'A clogged AIR FILTER chokes the engine — it can’t breathe. A fresh filter lets it get the clean air it needs.' },
    { symptom:'The engine cranks over and over but never catches, and the fuel gauge shows plenty of gas.',
      answer:'fuelpump', choices:['fuelpump','headlight','tire','wiper'],
      explain:'Cranking with no start (but plenty of gas) can mean the FUEL PUMP isn’t pushing gasoline up to the engine.' }
  ],

  // ---- GAME 5-in-4: DASHBOARD DETECTIVE (warning light → what it means) ----
  // (Shown as the 4th game "Dashboard".) `key` matches CARART.light().
  LIGHTS: [
    { key:'checkengine', name:'Check Engine', urgency:'soon',
      meaning:'Something in the engine or emissions system needs a look.',
      action:'The car can usually still drive, but get it checked soon. If it’s FLASHING, stop soon — that’s serious.',
      choices:['Something in the engine needs checking','You’re low on gas','A door is open','The radio is on'], answer:0 },
    { key:'oil', name:'Oil Pressure', urgency:'now',
      meaning:'The engine is low on oil pressure — its parts might not be getting protected.',
      action:'Stop safely and turn the engine off soon. Driving with no oil pressure can wreck the engine.',
      choices:['The engine’s oil pressure is low','The windshield fluid is low','The tires need air','The lights are on'], answer:0 },
    { key:'battery', name:'Charging System', urgency:'soon',
      meaning:'The battery isn’t charging properly — often the alternator.',
      action:'Get it checked soon. If it dies while driving, the car will lose power.',
      choices:['The battery isn’t charging right','The engine is too hot','You forgot your seat belt','The trunk is open'], answer:0 },
    { key:'temp', name:'Engine Temperature', urgency:'now',
      meaning:'The engine is overheating.',
      action:'Pull over and let it cool down. Overheating can crack the engine.',
      choices:['The engine is overheating','You need an oil change','A tire is flat','The gas cap is loose'], answer:0 },
    { key:'tpms', name:'Tire Pressure', urgency:'soon',
      meaning:'A tire is low on air (or too full).',
      action:'Add air to the low tire soon. Low tires wear out fast and are unsafe.',
      choices:['A tire is low on air','The oil is dirty','The battery is dead','The brakes are worn'], answer:0 },
    { key:'brake', name:'Brake Warning', urgency:'now',
      meaning:'The parking brake is on, OR the brakes need attention (low brake fluid).',
      action:'Make sure the parking brake is fully down. If it stays on, get the brakes checked right away.',
      choices:['The brake system needs attention','A window is down','The AC is broken','You’re low on gas'], answer:0 },
    { key:'fuel', name:'Low Fuel', urgency:'soon',
      meaning:'You’re running low on gas.',
      action:'Find a gas station soon. Running totally empty can even harm the fuel pump.',
      choices:['You’re low on gas','The engine is overheating','A seat belt is unbuckled','The oil is low'], answer:0 },
    { key:'seatbelt', name:'Seat Belt Reminder', urgency:'now',
      meaning:'Someone in the car hasn’t buckled their seat belt.',
      action:'Buckle up before driving — it’s the number-one way to stay safe in a crash.',
      choices:['A seat belt isn’t buckled','The engine needs oil','A tire is flat','The lights are off'], answer:0 },
    { key:'abs', name:'Anti-Lock Brakes (ABS)', urgency:'soon',
      meaning:'The anti-lock braking system needs checking.',
      action:'Normal brakes still work, but the anti-skid feature may be off. Get it checked soon.',
      choices:['The anti-skid brake system needs checking','The radio is broken','You’re low on gas','A door is open'], answer:0 },
    { key:'airbag', name:'Airbag', urgency:'soon',
      meaning:'The airbag safety system has a fault.',
      action:'Get it checked soon — the airbag might not work in a crash.',
      choices:['The airbag system has a fault','The trunk is open','The oil is low','The wipers are on'], answer:0 }
  ]
};
