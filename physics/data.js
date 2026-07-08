/* Physics Playground — content data. Forces, motion & energy for middle-school.
 * Centerpiece = "Launch the Cart" F=ma simulator. Four support games + dictionary.
 *   LAUNCH   → change mass & force, watch acceleration (Newton's 2nd law)
 *   LAWS     → which of Newton's three laws does this show?
 *   MOTION   → speed vs velocity vs acceleration
 *   ENERGY   → kinetic or potential?
 *   MACHINES → name the simple machine
 */
window.PHYS = {

  SOURCES: [
    { key:'phet', name:'PhET Interactive Simulations (Univ. of Colorado)',
      url:'https://phet.colorado.edu/en/simulations/filter?subjects=motion',
      note:'Free, research-based physics simulations — forces, motion and energy you can play with.' },
    { key:'physicsclassroom', name:'The Physics Classroom',
      url:'https://www.physicsclassroom.com/class/newtlaws',
      note:'Clear lessons on Newton’s laws, forces, and motion written for students.' },
    { key:'khan', name:'Khan Academy — Physics',
      url:'https://www.khanacademy.org/science/physics/forces-newtons-laws',
      note:'Free videos and practice on forces, F=ma, energy and simple machines.' },
    { key:'nasa', name:'NASA — Newton’s Laws of Motion',
      url:'https://www.nasa.gov/learning-resources/for-kids-and-students/',
      note:'How the same laws that launch rockets work on a skateboard or a soccer ball.' }
  ],

  /* ───────── Physics Dictionary ───────── */
  TERMS: [
    { term:'Force', def:'A push or a pull. Measured in newtons (N).', ex:'Kicking a ball puts a force on it.',
      simple:'Any push or pull. Nothing changes its motion — starting, stopping, speeding up, turning — without a force behind it.' },
    { term:'Mass', def:'How much matter (“stuff”) an object is made of. Measured in kilograms (kg).', ex:'A bowling ball has more mass than a beach ball.',
      simple:'How much stuff is packed into something. More mass = harder to get moving and harder to stop.' },
    { term:'Speed', def:'How fast something moves — distance over time. No direction.', ex:'60 miles per hour.',
      simple:'Just how fast, nothing about which way. A speedometer shows speed.' },
    { term:'Velocity', def:'Speed AND the direction it’s moving.', ex:'60 mph heading north.',
      simple:'Speed plus direction. “30 mph” is speed; “30 mph east” is velocity.' },
    { term:'Acceleration', def:'How quickly velocity changes — speeding up, slowing down, or turning.', ex:'0 to 60 mph in 5 seconds.',
      simple:'Any change in velocity. Speeding up, slowing down, OR changing direction all count as acceleration.' },
    { term:'Inertia', def:'An object’s resistance to a change in its motion.', ex:'You lurch forward when a car stops fast.',
      simple:'The “keep doing what I’m doing” tendency. Still things stay still, moving things keep moving — until a force changes it.' },
    { term:'Newton’s 1st Law', def:'An object stays at rest or in motion unless a force acts on it (the law of inertia).', ex:'A puck glides on ice until friction stops it.',
      simple:'Things don’t start, stop, or turn on their own — it takes a force. Left alone, motion just keeps going.' },
    { term:'Newton’s 2nd Law', def:'Force = mass × acceleration (F = m·a). More force → more acceleration; more mass → less.', ex:'A light cart speeds up more than a heavy one from the same push.',
      simple:'The math of pushes: the same push moves a light thing more than a heavy thing. Push harder to accelerate more.' },
    { term:'Newton’s 3rd Law', def:'For every action there is an equal and opposite reaction.', ex:'A rocket pushes gas down; the gas pushes the rocket up.',
      simple:'Every push comes with a push back, just as strong, the other way. That’s how rockets, swimming, and jumping work.' },
    { term:'Friction', def:'A force that resists motion when two surfaces rub together.', ex:'A ball rolls farther on ice than on grass.',
      simple:'The grippy force that slows sliding things down. Rough surfaces have lots; ice has almost none.' },
    { term:'Gravity', def:'The force that pulls objects toward each other — on Earth, toward the ground.', ex:'A dropped apple falls down.',
      simple:'The pull that makes things fall and gives them weight. Earth’s gravity pulls everything toward its center.' },
    { term:'Net Force', def:'The total force left over after combining all forces on an object.', ex:'Push 10 N right, friction 3 N left → 7 N net.',
      simple:'Add up all the pushes and pulls; what’s left over is the net force. Only the leftover actually accelerates the object.' },
    { term:'Kinetic Energy', def:'The energy of motion. Faster and heavier = more of it. KE = ½·m·v².', ex:'A rolling bowling ball.',
      simple:'Movement energy. Anything moving has it — and the faster or heavier it is, the more it packs.' },
    { term:'Potential Energy', def:'Stored energy waiting to be released — from position or being stretched.', ex:'A ball at the top of a hill.',
      simple:'Stored-up energy ready to go. Lift something high or stretch a spring and you load it with potential energy.' },
    { term:'Energy Transfer', def:'Energy changing from one form to another — it’s never destroyed.', ex:'Potential → kinetic as a coaster drops.',
      simple:'Energy doesn’t vanish, it just switches forms. A falling object trades stored (potential) energy for motion (kinetic).' },
    { term:'Work', def:'Using a force to move something over a distance. W = force × distance.', ex:'Lifting a box up onto a shelf.',
      simple:'In physics, “work” means a force actually moved something. Push on a wall that doesn’t budge and you did zero work.' },
    { term:'Simple Machine', def:'A basic tool that makes work easier: lever, wheel & axle, pulley, inclined plane, wedge, screw.', ex:'A ramp is an inclined plane.',
      simple:'One of six basic tools that let a small force do a big job — like a ramp, a lever, or a pulley.' },
    { term:'Lever', def:'A stiff bar that pivots on a fixed point (the fulcrum) to lift or move a load.', ex:'A seesaw or a crowbar.',
      simple:'A bar that tips on a pivot. Push down on one end to lift something on the other — like a seesaw.' },
    { term:'Momentum', def:'Mass in motion — how hard it is to stop something moving. Mass × velocity.', ex:'A heavy truck is harder to stop than a bike.',
      simple:'The “oomph” of a moving object. Heavier and faster means more momentum, which means harder to stop.' }
  ],

  /* ───────── GAME 1 · LAUNCH THE CART (F = m·a simulator) ─────────
   * Handled in code. These are the tunable ranges + surfaces. */
  SIM: {
    g: 10,                                  // simplified gravity (m/s²)
    trackMeters: 20,                        // finish line distance
    mass:  { min:1, max:10, step:1, def:2, unit:'kg' },
    force: { min:5, max:100, step:5, def:40, unit:'N' },
    surfaces: [
      { id:'ice',   name:'Ice',   icon:'🧊', mu:0.0, note:'No friction — nothing slows the cart.' },
      { id:'track', name:'Track', icon:'🛤️', mu:0.2, note:'A little friction, like a smooth floor.' },
      { id:'grass', name:'Grass', icon:'🌿', mu:0.4, note:'Lots of friction — hard to get moving.' }
    ],
    /* Guided lesson that walks the learner through F = m·a, one experiment at a time.
     * apply = preset the controls when the step opens; req = settings needed before a launch "counts";
     * predict = ask before launching; free = open sandbox (graduation). */
    lesson: [
      { head:'🚀 Welcome to the launch lab',
        body:'Every launch obeys one rule: <b>Force = mass × acceleration</b> (F = m·a). Push harder and the cart speeds up faster; pile on mass and it fights back. We’ll <b>prove it</b> in 3 quick experiments, changing just one thing each time. First, let’s set a baseline — hit <b>🚀 Launch!</b>',
        apply:{ mass:2, force:40, surf:'ice' },
        req:{ mass:2, force:40, surf:'ice' },
        learn:'That’s your <b>baseline</b> on frictionless ice: a 2&nbsp;kg cart with a 40&nbsp;N push. Every experiment below changes exactly ONE thing from here, so you can see precisely what it does. Watch the <b>Acceleration</b> readout each time.' },

      { head:'💪 Experiment 1 — more force',
        body:'Keep the cart at 2&nbsp;kg, but <b>double the push to 80&nbsp;N</b> — tap ＋ on <b>Launch force</b>. Make your prediction, then Launch.',
        apply:{ mass:2, force:40, surf:'ice' },
        req:{ mass:2, force:80, surf:'ice' },
        predict:{ q:'Predict: double the push, and the cart will…', options:['Speed up','No change','Slow down'], answer:'Speed up' },
        learn:'Double the push → the acceleration <b>doubled</b>. Force and acceleration go up together — that’s the F and the a sitting on the same side of F = m·a.' },

      { head:'⚖️ Experiment 2 — more mass',
        body:'Put the force back to 40&nbsp;N, then <b>make the cart heavier: 4&nbsp;kg</b> — tap ＋ on <b>Mass</b>. Same push, heavier cart — predict first, then Launch.',
        apply:{ mass:2, force:40, surf:'ice' },
        req:{ mass:4, force:40, surf:'ice' },
        predict:{ q:'Predict: double the mass, and the cart will…', options:['Speed up','No change','Slow down'], answer:'Slow down' },
        learn:'Double the mass → the acceleration <b>halved</b>. Mass resists motion, so the same push moves a heavy cart less. Bigger m means smaller a.' },

      { head:'🌍 Experiment 3 — friction',
        body:'Same 2&nbsp;kg cart and 40&nbsp;N push, but now you’re on <b>🌿 Grass</b> instead of ice. Predict what rough ground does, then Launch — and watch the <b>friction</b> number in the equation.',
        apply:{ mass:2, force:40, surf:'grass' },
        req:{ mass:2, force:40, surf:'grass' },
        predict:{ q:'Predict: move from ice to grass, and the cart will…', options:['Speed up','No change','Slow down'], answer:'Slow down' },
        learn:'On grass, <b>friction</b> is subtracted from your push before it ever reaches the cart. Less <b>net</b> force means less acceleration — so the very same 40&nbsp;N does less here than on ice.' },

      { head:'🎓 You did it — free play!',
        body:'You just discovered <b>F = m·a</b>: more force = faster, more mass = slower, and friction steals from your push. The lab is now yours — mix any settings and launch. <b>Challenge:</b> can you make the cart crash with over <b>1000 J</b> of kinetic energy? (Hint: go heavy AND fast.)',
        free:true }
    ]
  },

  /* ───────── GAME 2 · WHICH LAW? (Newton's three laws) ───────── */
  LAWS: {
    1:{ name:'1st Law — Inertia', icon:'🛑', desc:'Objects keep doing what they’re doing (resting or moving straight) until a force changes it.' },
    2:{ name:'2nd Law — F = m·a', icon:'⚖️', desc:'A force makes an object accelerate. More force → more acceleration; more mass → less.' },
    3:{ name:'3rd Law — Action/Reaction', icon:'🚀', desc:'Every action force has an equal and opposite reaction force.' }
  },
  LAW_ITEMS: [
    { q:'A hockey puck slides across the ice and keeps gliding until friction slowly stops it.', law:1,
      why:'With almost no force acting on it, the moving puck just keeps moving — that’s inertia, the 1st law.' },
    { q:'When the school bus stops suddenly, your body jerks forward.', law:1,
      why:'Your body was moving and “wants” to keep moving — inertia. The 1st law is why seatbelts matter.' },
    { q:'The same push makes an empty cart speed up much faster than a fully loaded one.', law:2,
      why:'Same force, more mass → less acceleration. That’s F = m·a, the 2nd law.' },
    { q:'A rocket pushes hot gas downward, and the rocket shoots upward.', law:3,
      why:'The rocket pushes the gas one way; the gas pushes the rocket the opposite way, just as hard — the 3rd law.' },
    { q:'You push off the wall of a pool and glide backward through the water.', law:3,
      why:'You push the wall; the wall pushes you back equally in the opposite direction — action and reaction, the 3rd law.' },
    { q:'To accelerate a heavier skateboard as fast as a light one, you have to push harder.', law:2,
      why:'More mass needs more force for the same acceleration. F = m·a, the 2nd law.' },
    { q:'A soccer ball sits still on the field and won’t move until someone kicks it.', law:1,
      why:'At rest it stays at rest until a force (the kick) acts on it — the 1st law of inertia.' },
    { q:'Air rushes out of a balloon and the balloon zips around the room.', law:3,
      why:'The balloon pushes air out one way; the escaping air pushes the balloon the other way — the 3rd law.' },
    { q:'Pressing the gas harder makes your go-kart speed up more quickly.', law:2,
      why:'More force produces more acceleration for the same mass — the 2nd law, F = m·a.' },
    { q:'A book lying on a table stays put unless something pushes or pulls it.', law:1,
      why:'No net force, no change in motion — the book stays at rest. That’s the 1st law.' },
    { q:'When you jump, your legs push down on the ground and the ground pushes you up.', law:3,
      why:'Your push on the Earth is matched by the Earth’s push on you — equal and opposite, the 3rd law.' },
    { q:'A loaded moving truck takes much longer to stop than a bicycle going the same speed.', law:2,
      why:'More mass means a given braking force causes less deceleration (and it has more momentum) — the 2nd law at work.' }
  ],

  /* ───────── GAME 3 · SPEED / VELOCITY / ACCELERATION ───────── */
  MOTION: {
    Speed:{ icon:'⏱️', desc:'How fast something goes — a number with no direction.' },
    Velocity:{ icon:'🧭', desc:'Speed AND direction together.' },
    Acceleration:{ icon:'📈', desc:'Any change in velocity — speeding up, slowing down, or turning.' }
  },
  MOTION_ITEMS: [
    { q:'“The car was traveling at 55 miles per hour.”', ans:'Speed',
      why:'Just a number for how fast — no direction given — so it’s speed.' },
    { q:'“The plane flew at 500 mph heading due west.”', ans:'Velocity',
      why:'It gives speed AND direction (west), which makes it velocity.' },
    { q:'“The dragster went from 0 to 100 mph in 4 seconds.”', ans:'Acceleration',
      why:'Its velocity changed (it sped up), and change in velocity is acceleration.' },
    { q:'“The runner slowed from a sprint to a walk.”', ans:'Acceleration',
      why:'Slowing down is still a change in velocity — that’s acceleration (sometimes called deceleration).' },
    { q:'“A ball rolls at a steady 3 meters per second.”', ans:'Speed',
      why:'A steady “how fast” with no direction stated — that’s speed.' },
    { q:'“The wind blew at 20 km/h toward the northeast.”', ans:'Velocity',
      why:'Speed with a direction (northeast) = velocity.' },
    { q:'“Rounding the track at a constant 30 mph, the car keeps turning.”', ans:'Acceleration',
      why:'Trick one! Even at constant speed, changing DIRECTION changes velocity — so the car is accelerating.' },
    { q:'“The elevator speeds up as it starts to rise.”', ans:'Acceleration',
      why:'Speeding up is a change in velocity — acceleration.' },
    { q:'“A snail crept along at 0.001 mph.”', ans:'Speed',
      why:'Slow, but still just a “how fast” number with no direction — speed.' },
    { q:'“The rocket climbed straight up at 2 km/s.”', ans:'Velocity',
      why:'Speed (2 km/s) plus direction (straight up) = velocity.' },
    { q:'“The cyclist braked hard to avoid the dog.”', ans:'Acceleration',
      why:'Braking changes velocity (slowing down) — that’s acceleration.' },
    { q:'“The bus moved at 40 mph.”', ans:'Speed',
      why:'A bare “how fast” with no direction — speed.' }
  ],

  /* ───────── GAME 4 · KINETIC OR POTENTIAL? ───────── */
  ENERGY: [
    { item:'📚 A book resting on a high shelf', ans:'Potential', why:'Held up high, it has stored (gravitational) potential energy — ready to fall if it slips off.' },
    { item:'⚽ A soccer ball rolling across the grass', ans:'Kinetic', why:'It’s moving, so it has kinetic energy — the energy of motion.' },
    { item:'🎢 A coaster car paused at the very top of the hill', ans:'Potential', why:'At the top it’s barely moving but loaded with potential energy, about to turn into a thrilling drop.' },
    { item:'🏹 A drawn-back bowstring', ans:'Potential', why:'Stretched and held, the bow stores elastic potential energy, ready to launch the arrow.' },
    { item:'🍎 An apple falling from a tree', ans:'Kinetic', why:'It’s in motion as it falls, so it has kinetic energy (converted from potential as it drops).' },
    { item:'🏃 A kid sprinting in a race', ans:'Kinetic', why:'Moving fast = lots of kinetic energy.' },
    { item:'💧 Water held still behind a tall dam', ans:'Potential', why:'The high, still water stores potential energy — released as kinetic energy when it flows down.' },
    { item:'🏎️ A race car speeding down the straight', ans:'Kinetic', why:'Fast and heavy in motion — a big amount of kinetic energy.' },
    { item:'🪀 A yo-yo resting at the top of its string', ans:'Potential', why:'Wound up and lifted, it holds potential energy before it drops and spins.' },
    { item:'🎯 An arrow flying through the air', ans:'Kinetic', why:'In flight and moving fast, the arrow has kinetic energy.' },
    { item:'🧗 A rock balanced at the edge of a cliff', ans:'Potential', why:'High up and motionless, it stores gravitational potential energy.' },
    { item:'🛝 A kid sliding down a slide', ans:'Kinetic', why:'Sliding = moving, so it’s kinetic energy (trading the potential energy they had at the top).' },
    { item:'🧨 A compressed spring in a toy', ans:'Potential', why:'Squeezed and held, the spring stores elastic potential energy, ready to pop.' },
    { item:'💨 A gust of wind spinning a pinwheel', ans:'Kinetic', why:'Moving air and a spinning pinwheel are both in motion — kinetic energy.' }
  ],

  /* ───────── GAME 5 · NAME THAT MACHINE (simple machines) ───────── */
  MACHINES: {
    Lever:{ icon:'⚖️', desc:'A stiff bar that pivots on a fulcrum to lift or move a load.' },
    'Wheel & Axle':{ icon:'🛞', desc:'A wheel fixed to a rod (axle) — turning one turns the other, making it easier to move or turn things.' },
    Pulley:{ icon:'🪢', desc:'A wheel with a rope that changes the direction of a pulling force to lift loads.' },
    'Inclined Plane':{ icon:'📐', desc:'A ramp — a flat slanted surface that trades a longer path for an easier climb.' },
    Wedge:{ icon:'🔪', desc:'Two inclined planes back-to-back that push things apart (cutting or splitting).' },
    Screw:{ icon:'🔩', desc:'An inclined plane wrapped around a cylinder — it holds things together or lifts as it turns.' }
  },
  MACHINE_ITEMS: [
    { item:'🛝 A playground seesaw', machine:'Lever' },
    { item:'🪛 A crowbar prying open a crate', machine:'Lever' },
    { item:'🚪 A doorknob you turn', machine:'Wheel & Axle' },
    { item:'🚲 The wheels on a bicycle', machine:'Wheel & Axle' },
    { item:'🚩 The rope-and-wheel that raises a flag', machine:'Pulley' },
    { item:'🏗️ A crane lifting a heavy beam', machine:'Pulley' },
    { item:'♿ A wheelchair ramp', machine:'Inclined Plane' },
    { item:'🛝 A playground slide', machine:'Inclined Plane' },
    { item:'🪓 An axe splitting a log', machine:'Wedge' },
    { item:'🔪 A knife slicing an apple', machine:'Wedge' },
    { item:'🔩 A bolt screwing into wood', machine:'Screw' },
    { item:'🫙 The twisting lid of a jar', machine:'Screw' },
    { item:'🍾 A bottle opener popping a cap', machine:'Lever' },
    { item:'🌀 A spiral staircase', machine:'Screw' },
    { item:'🪟 The cord that raises window blinds', machine:'Pulley' },
    { item:'🚗 A steering wheel', machine:'Wheel & Axle' }
  ]
};
