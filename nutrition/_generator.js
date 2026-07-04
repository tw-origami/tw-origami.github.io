// Builds nutrition/library.js — the SINGLE master data file all 5 games read from.
// Food→nutrient edges are inverted from the FDA/NIH vitamins-and-minerals chart.
// Everything else (functions, scenarios, swaps, labels, plate) is authored teaching
// content. After this bootstrap, library.js is the editable source of truth.
'use strict';
const fs = require('fs');

// ============ 1) NUTRIENTS: chart food-sources + kid-friendly "what it does" ============
const N = {
  'Vitamin A':   { dv:'900 mcg', does:'healthy eyes & clear vision', foods:['cantaloupe','carrot','milk','cheese','egg','fortified cereal','spinach','broccoli','pumpkin','red pepper','sweet potato'] },
  'Vitamin C':   { dv:'90 mg',  does:'heals cuts & fights germs', foods:['cantaloupe','orange','grapefruit','lemon','kiwi','strawberries','tomato','orange juice','broccoli','Brussels sprouts','bell pepper'] },
  'Vitamin D':   { dv:'20 mcg', flag:'more', does:'strong bones (works with calcium)', foods:['salmon','trout','herring','tuna','flounder','egg','beef liver','mushrooms','fortified milk','fortified orange juice','fortified cereal','soy milk'] },
  'Vitamin E':   { dv:'15 mg',  does:'protects your cells', foods:['fortified cereal','spinach','broccoli','almonds','sunflower seeds','peanuts','peanut butter','vegetable oil'] },
  'Vitamin K':   { dv:'120 mcg',does:'helps blood clot & bones', foods:['broccoli','kale','spinach','turnip greens','collard greens','Swiss chard','mustard greens'] },
  'Vitamin B6':  { dv:'1.7 mg', does:'brain & makes red blood cells', foods:['chickpeas','banana','potato','salmon','tuna'] },
  'Vitamin B12': { dv:'2.4 mcg',does:'energy & red blood cells', foods:['milk','cheese','yogurt','egg','fortified cereal','beef','pork','chicken','turkey','clams','trout','salmon','tuna'] },
  'Biotin':      { dv:'30 mcg', does:'turns food into energy', foods:['avocado','cauliflower','egg','raspberries','beef liver','pork','salmon','whole grains'] },
  'Choline':     { dv:'550 mg', does:'brain development', foods:['egg','beans','peas','cod','salmon','beef liver','milk','nuts','soybeans','broccoli','cauliflower','spinach'] },
  'Folate':      { dv:'400 mcg',does:'makes new cells', foods:['asparagus','avocado','beans','peas','fortified cereal','spinach','kale','orange','orange juice'] },
  'Niacin (B3)': { dv:'16 mg',  does:'turns food into energy', foods:['beans','beef','bread','nuts','pork','chicken','turkey','salmon','tuna','whole grains'] },
  'Pantothenic acid (B5)':{ dv:'5 mg', does:'turns food into energy', foods:['avocado','beans','peas','broccoli','egg','milk','mushrooms','chicken','turkey','salmon','sweet potato','whole grains','yogurt'] },
  'Riboflavin (B2)':{ dv:'1.3 mg', does:'energy & growth', foods:['egg','bread','beef','milk','mushrooms','chicken','oysters','spinach'] },
  'Thiamin (B1)':{ dv:'1.2 mg', does:'energy & nervous system', foods:['beans','peas','bread','nuts','pork','sunflower seeds','whole grains'] },
  'Calcium':     { dv:'1300 mg',flag:'more', does:'strong bones & teeth', foods:['milk','cheese','yogurt','canned salmon','sardines','fortified orange juice','soy milk','fortified cereal','kale','broccoli','collard greens','tofu','almonds','soybeans','bok choy','cottage cheese'] },
  'Iron':        { dv:'18 mg',  flag:'more', does:'carries oxygen in your blood', foods:['beans','peas','lentils','egg','spinach','kale','beef','pork','nuts','beef liver','chicken','turkey','crab','clams','sardines','shrimp','oysters','tofu','fortified cereal','dark chocolate','pumpkin seeds','sunflower seeds'] },
  'Potassium':   { dv:'4700 mg',flag:'more', does:'muscles & heartbeat', foods:['beans','milk','apricots','banana','kiwi','cantaloupe','orange','clams','trout','tomato','potato','sweet potato','spinach','yogurt','salmon','lima beans','plantain','peanuts'] },
  'Magnesium':   { dv:'420 mg', does:'muscles, nerves & energy', foods:['avocado','beans','peas','milk','banana','raisins','spinach','almonds','pumpkin seeds','potato','whole grains'] },
  'Zinc':        { dv:'11 mg',  does:'immune system & healing', foods:['beans','peas','beef','milk','cheese','fortified cereal','nuts','chicken','turkey','shrimp','oysters','crab','whole grains'] },
  'Phosphorus':  { dv:'1250 mg',does:'strong bones & energy', foods:['beans','peas','milk','cheese','beef','nuts','sunflower seeds','chicken','salmon','whole grains','bread'] },
  'Copper':      { dv:'0.9 mg', does:'iron use & nerves', foods:['dark chocolate','crab','oysters','shrimp','lentils','nuts','sunflower seeds','beef liver','whole grains'] },
  'Manganese':   { dv:'2.3 mg', does:'bones & healing', foods:['beans','nuts','pineapple','spinach','sweet potato','whole grains'] },
  'Selenium':    { dv:'55 mcg', does:'protects cells & thyroid', foods:['egg','pasta','rice','beef','Brazil nuts','sunflower seeds','chicken','turkey','salmon','tuna','whole grains'] },
  'Iodine':      { dv:'150 mcg',does:'thyroid & growth', foods:['milk','cheese','cod','tuna','seaweed','bread','potato','turkey'] },
  'Chromium':    { dv:'35 mcg', does:'helps use sugar for energy', foods:['broccoli','apple','banana','orange juice','beef','turkey','whole grains','garlic'] },
  'Molybdenum':  { dv:'45 mcg', does:'helps enzymes work', foods:['beans','peas','nuts','whole grains'] },
  'Chloride':    { dv:'2300 mg',does:'fluid balance & digestion', foods:['seaweed','olives','celery','lettuce','tomato'] },
  // ---- added (not in the chart) ----
  'Protein':     { dv:'50 g',  added:true, does:'builds muscles & heals you', foods:['beef','pork','chicken','turkey','salmon','tuna','cod','trout','shrimp','clams','oysters','crab','sardines','egg','milk','cheese','yogurt','cottage cheese','beans','peas','lentils','lima beans','chickpeas','tofu','soybeans','nuts','peanuts','peanut butter','sunflower seeds'] },
  'Fiber':       { dv:'28 g',  added:true, flag:'more', does:'healthy digestion, keeps you full', foods:['beans','peas','lentils','lima beans','chickpeas','whole grains','oats','avocado','raspberries','broccoli','Brussels sprouts','cauliflower','sweet potato','potato','spinach','kale','almonds','nuts','pumpkin','apple','orange','banana','kiwi','pineapple'] },
  'Omega-3':     { dv:'—',     added:true, does:'brain & focus, healthy heart', foods:['salmon','trout','herring','tuna','sardines','canned salmon','walnuts','flaxseed'] },
};

const EXCELLENT = {
  'Calcium':  ['cheese','tofu','fortified orange juice','milk','yogurt','canned salmon','sardines'],
  'Iron':     ['fortified cereal','beans','pumpkin seeds','sunflower seeds','soybeans','oysters'],
  'Potassium':['beans','apricots','orange juice','potato','soybeans','sweet potato','spinach'],
};

const EMOJI = {
  'apple':'🍎','apricots':'🍑','asparagus':'🥬','avocado':'🥑','banana':'🍌','beans':'🫘','beef':'🥩','beef liver':'🥩',
  'bok choy':'🥬','cottage cheese':'🥛','lima beans':'🫘','plantain':'🍌',
  'bell pepper':'🫑','bread':'🍞','broccoli':'🥦','Brazil nuts':'🌰','Brussels sprouts':'🥬','cantaloupe':'🍈',
  'canned salmon':'🐟','carrot':'🥕','cauliflower':'🥦','celery':'🥬','cheese':'🧀','chicken':'🍗','chickpeas':'🫘',
  'clams':'🦪','cod':'🐟','collard greens':'🥬','crab':'🦀','dark chocolate':'🍫','egg':'🥚','flaxseed':'🌾','flounder':'🐟',
  'fortified cereal':'🥣','fortified milk':'🥛','fortified orange juice':'🧃','garlic':'🧄','grapefruit':'🍊',
  'herring':'🐟','kale':'🥬','kiwi':'🥝','lemon':'🍋','lentils':'🫘','lettuce':'🥬','milk':'🥛','mushrooms':'🍄',
  'mustard greens':'🥬','nuts':'🥜','oats':'🥣','olives':'🫒','orange':'🍊','orange juice':'🧃','oysters':'🦪',
  'pasta':'🍝','peanut butter':'🥜','peanuts':'🥜','peas':'🟢','pineapple':'🍍','pork':'🥓','potato':'🥔',
  'pumpkin':'🎃','pumpkin seeds':'🎃','raisins':'🍇','raspberries':'🫐','red pepper':'🌶️','rice':'🍚','salmon':'🐟',
  'sardines':'🐟','seaweed':'🌿','shrimp':'🦐','soy milk':'🥛','soybeans':'🫛','spinach':'🥬','strawberries':'🍓',
  'sunflower seeds':'🌻','sweet potato':'🍠','Swiss chard':'🥬','tofu':'⬜','tomato':'🍅','trout':'🐟','tuna':'🐟',
  'turkey':'🦃','turnip greens':'🥬','vegetable oil':'🫗','walnuts':'🌰','whole grains':'🌾','yogurt':'🥛',
};

// plate group + whole/processed per food (for Build-a-Plate and Sort games)
const PLATE_GROUP = {
  fruit:['apple','apricots','banana','cantaloupe','grapefruit','kiwi','lemon','orange','pineapple','plantain','raisins','raspberries','strawberries'],
  vegetable:['asparagus','bell pepper','bok choy','broccoli','Brussels sprouts','carrot','cauliflower','celery','collard greens','garlic','kale','lettuce','mushrooms','mustard greens','pumpkin','red pepper','seaweed','spinach','sweet potato','Swiss chard','tomato','turnip greens','potato','avocado'],
  grain:['bread','fortified cereal','oats','pasta','rice','whole grains'],
  protein:['beans','beef','beef liver','Brazil nuts','chicken','chickpeas','clams','cod','crab','egg','flounder','herring','lentils','lima beans','nuts','oysters','peanut butter','peanuts','peas','pork','pumpkin seeds','salmon','canned salmon','sardines','shrimp','soybeans','sunflower seeds','tofu','trout','tuna','turkey','walnuts','flaxseed'],
  dairy:['cheese','cottage cheese','milk','yogurt','fortified milk','soy milk'],
  drink:['orange juice','fortified orange juice'],
  other:['dark chocolate','olives','vegetable oil'],
};
const groupOf = {};
for (const [g, arr] of Object.entries(PLATE_GROUP)) arr.forEach(f=> groupOf[f]=g);
const PROCESSED = new Set(['bread','fortified cereal','pasta','rice','dark chocolate','olives','vegetable oil','peanut butter','fortified milk','fortified orange juice','canned salmon','orange juice','soy milk','raisins']);

// ---- invert to food -> nutrients ----
const foodMap = {};
for (const [nutrient, info] of Object.entries(N)){
  for (const food of info.foods){
    (foodMap[food] = foodMap[food] || []).push({ nutrient, tier: (EXCELLENT[nutrient]&&EXCELLENT[nutrient].includes(food))?'excellent':'good' });
  }
}
const FOODS = Object.keys(foodMap).sort().map(food=>({
  food, emoji: EMOJI[food]||'🍽️',
  group: groupOf[food]||'other',
  type: PROCESSED.has(food)?'processed':'whole',
  nutrients: foodMap[food].sort((a,b)=> a.tier===b.tier ? a.nutrient.localeCompare(b.nutrient) : (a.tier==='excellent'?-1:1)),
}));

// ============ 2) FUNCTIONS: body job -> nutrients (for the matching game) ============
const FUNCTIONS = [
  { fn:'Strong bones & teeth', emoji:'🦴', nutrients:['Calcium','Vitamin D','Phosphorus','Vitamin K','Magnesium'] },
  { fn:'Carry oxygen in your blood', emoji:'🩸', nutrients:['Iron'] },
  { fn:'Heal a cut', emoji:'🩹', nutrients:['Protein','Vitamin C','Zinc'] },
  { fn:'Good eyesight', emoji:'👁️', nutrients:['Vitamin A'] },
  { fn:'Fight off germs', emoji:'🛡️', nutrients:['Vitamin C','Vitamin A','Vitamin D','Zinc','Vitamin E'] },
  { fn:'Turn food into energy', emoji:'⚡', nutrients:['Thiamin (B1)','Riboflavin (B2)','Niacin (B3)','Pantothenic acid (B5)','Biotin','Iron'] },
  { fn:'Strong muscles', emoji:'💪', nutrients:['Protein','Potassium','Magnesium'] },
  { fn:'Steady heartbeat', emoji:'❤️', nutrients:['Potassium','Magnesium','Calcium'] },
  { fn:'Brain & focus', emoji:'🧠', nutrients:['Omega-3','Choline','Iron','Vitamin B12'] },
  { fn:'Healthy skin', emoji:'✨', nutrients:['Vitamin A','Vitamin C','Vitamin E','Biotin'] },
  { fn:'Stop bleeding (clotting)', emoji:'🩸', nutrients:['Vitamin K','Calcium'] },
  { fn:'Healthy digestion', emoji:'🚽', nutrients:['Fiber'] },
  { fn:'Build red blood cells', emoji:'🔴', nutrients:['Iron','Vitamin B12','Folate','Vitamin B6','Copper'] },
  { fn:'Grow big & strong', emoji:'📏', nutrients:['Protein','Vitamin A','Zinc','Vitamin D'] },
  { fn:'Healthy blood pressure', emoji:'🫀', nutrients:['Potassium','Magnesium','Calcium','Vitamin D'] },
  { fn:'Thyroid (your body\'s speed control)', emoji:'🦋', nutrients:['Iodine','Selenium'] },
  { fn:'Make hormones (body messengers)', emoji:'📨', nutrients:['Pantothenic acid (B5)','Vitamin D','Iodine'] },
  { fn:'Protect cells from damage', emoji:'🛡️', nutrients:['Vitamin C','Vitamin E','Selenium','Copper'] },
  { fn:'Healthy nerves (body wiring)', emoji:'⚡', nutrients:['Thiamin (B1)','Vitamin B6','Vitamin B12','Magnesium','Copper'] },
  { fn:'Taste & smell', emoji:'👃', nutrients:['Zinc'] },
];

// ============ 3) SCENARIOS: "best fuel" multiple choice ============
const SCENARIOS = [
  { level:1, prompt:"You're thirsty after playing outside in the sun.", why:"Water refills what you sweat out — no sugar needed.",
    options:[{label:'Water',emoji:'💧',correct:true},{label:'Soda',emoji:'🥤'},{label:'Candy',emoji:'🍬'}] },
  { level:1, prompt:"You want a snack that helps you grow strong muscles.", why:"Eggs are packed with protein, the muscle builder.",
    options:[{label:'Egg',emoji:'🥚',correct:true},{label:'Lollipop',emoji:'🍭'},{label:'Chips',emoji:'🍟'}] },
  { level:1, prompt:"You need energy that lasts all morning at school.", why:"Oatmeal has fiber, so energy comes slow and steady.",
    options:[{label:'Oatmeal',emoji:'🥣',correct:true},{label:'Donut',emoji:'🍩'},{label:'Candy',emoji:'🍬'}] },
  { level:1, prompt:"Which drink is best for your teeth?", why:"Milk has calcium for strong teeth — soda can cause cavities.",
    options:[{label:'Milk',emoji:'🥛',correct:true},{label:'Soda',emoji:'🥤'},{label:'Juice pouch',emoji:'🧃'}] },
  { level:2, prompt:"You have a big test and want to help your brain focus.", why:"Fish, nuts and berries feed your brain (omega-3!).",
    options:[{label:'Salmon',emoji:'🐟',correct:true},{label:'Blueberries',emoji:'🫐',correct:true},{label:'Walnuts',emoji:'🌰',correct:true},{label:'Cookies',emoji:'🍪'}] },
  { level:2, prompt:"You scraped your knee — which foods help it heal?", why:"Protein rebuilds skin; vitamin C helps make new tissue.",
    options:[{label:'Chicken',emoji:'🍗',correct:true},{label:'Orange',emoji:'🍊',correct:true},{label:'Soda',emoji:'🥤'},{label:'Fries',emoji:'🍟'}] },
  { level:2, prompt:"You feel tired and pale — which food gives iron?", why:"Spinach and beans are full of iron to carry oxygen.",
    options:[{label:'Spinach',emoji:'🥬',correct:true},{label:'Beans',emoji:'🫘',correct:true},{label:'Gummy bears',emoji:'🐻'}] },
  { level:2, prompt:"You want a snack to stay full until dinner.", why:"Fiber in apples and nuts keeps your tummy satisfied.",
    options:[{label:'Apple',emoji:'🍎',correct:true},{label:'Almonds',emoji:'🥜',correct:true},{label:'Candy',emoji:'🍬'}] },
  { level:3, prompt:"You're building muscle for soccer season — pick the best plate.", why:"Chicken, beans and eggs all deliver muscle-building protein.",
    options:[{label:'Chicken',emoji:'🍗',correct:true},{label:'Beans',emoji:'🫘',correct:true},{label:'Egg',emoji:'🥚',correct:true},{label:'Soda',emoji:'🥤'}] },
  { level:3, prompt:"It's cold season — which foods help your immune system?", why:"Vitamin C and zinc power your germ-fighting defenses.",
    options:[{label:'Orange',emoji:'🍊',correct:true},{label:'Bell pepper',emoji:'🫑',correct:true},{label:'Pumpkin seeds',emoji:'🎃',correct:true},{label:'Ice cream',emoji:'🍦'}] },
  { level:3, prompt:"You want strong bones for growing tall.", why:"Calcium + vitamin D team up to build bone.",
    options:[{label:'Milk',emoji:'🥛',correct:true},{label:'Yogurt',emoji:'🥛',correct:true},{label:'Salmon',emoji:'🐟',correct:true},{label:'Chips',emoji:'🍟'}] },
  { level:3, prompt:"You need quick hydration AND a little natural sugar mid-game.", why:"Watermelon is mostly water with natural sugar — better than soda.",
    options:[{label:'Watermelon',emoji:'🍉',correct:true},{label:'Water',emoji:'💧',correct:true},{label:'Energy drink',emoji:'⚡'}] },
  { level:1, prompt:"You just woke up — pick a breakfast that sticks with you all morning.", why:"Oatmeal's fiber digests slowly, so you stay full longer.",
    options:[{label:'Oatmeal',emoji:'🥣',correct:true},{label:'Donut',emoji:'🍩'},{label:'Fruit gummies',emoji:'🐻'}] },
  { level:1, prompt:"Your bones are growing! Best drink with dinner?", why:"Milk's calcium is the building block of bones.",
    options:[{label:'Milk',emoji:'🥛',correct:true},{label:'Fruit punch',emoji:'🧃'},{label:'Soda',emoji:'🥤'}] },
  { level:1, prompt:"Which snack is good for your eyes?", why:"Carrots are loaded with vitamin A for healthy vision.",
    options:[{label:'Carrot sticks',emoji:'🥕',correct:true},{label:'Cheese puffs',emoji:'🧀'},{label:'Cookies',emoji:'🍪'}] },
  { level:1, prompt:"You want something sweet — which treat also has vitamins?", why:"Strawberries are sweet AND full of vitamin C.",
    options:[{label:'Strawberries',emoji:'🍓',correct:true},{label:'Candy',emoji:'🍬'},{label:'Cake',emoji:'🍰'}] },
  { level:1, prompt:"It's a hot recess — what goes in your water bottle?", why:"Plain water hydrates best — sugary drinks slow you down.",
    options:[{label:'Water',emoji:'💧',correct:true},{label:'Soda',emoji:'🥤'},{label:'Sweet tea',emoji:'🧋'}] },
  { level:1, prompt:"Which snack helps your tummy stay regular?", why:"Apples (with the skin!) bring fiber for healthy digestion.",
    options:[{label:'Apple',emoji:'🍎',correct:true},{label:'Cheese puffs',emoji:'🧀'},{label:'Gummies',emoji:'🐻'}] },
  { level:1, prompt:"Pick the food that helps a scrape heal faster.", why:"Oranges bring vitamin C, which your skin uses to rebuild.",
    options:[{label:'Orange',emoji:'🍊',correct:true},{label:'Marshmallow',emoji:'🍡'},{label:'Soda',emoji:'🥤'}] },
  { level:1, prompt:"Your muscles are sore after gymnastics — best snack?", why:"Yogurt and eggs have protein to repair muscles.",
    options:[{label:'Yogurt',emoji:'🥛',correct:true},{label:'Egg',emoji:'🥚',correct:true},{label:'Chips',emoji:'🍟'}] },
  { level:2, prompt:"You've been tired and pale lately. Which foods bring iron?", why:"Beef, beans and spinach are iron champions — iron carries oxygen.",
    options:[{label:'Beef',emoji:'🥩',correct:true},{label:'Beans',emoji:'🫘',correct:true},{label:'Spinach',emoji:'🥬',correct:true},{label:'Ice cream',emoji:'🍦'}] },
  { level:2, prompt:"Movie night! Pick the better snacks.", why:"Popcorn is a whole grain and apples bring fiber — win-win.",
    options:[{label:'Popcorn',emoji:'🍿',correct:true},{label:'Apple slices',emoji:'🍎',correct:true},{label:'Candy',emoji:'🍬'}] },
  { level:2, prompt:"Long bike ride tomorrow — what's the best dinner fuel?", why:"Whole grains and sweet potatoes store slow-burning energy.",
    options:[{label:'Brown rice',emoji:'🍚',correct:true},{label:'Sweet potato',emoji:'🍠',correct:true},{label:'French fries',emoji:'🍟'}] },
  { level:2, prompt:"Your skin is dry — which foods feed your skin?", why:"Vitamin A (carrots), C (oranges) and E (almonds) all care for skin.",
    options:[{label:'Carrot',emoji:'🥕',correct:true},{label:'Orange',emoji:'🍊',correct:true},{label:'Almonds',emoji:'🥜',correct:true},{label:'Chips',emoji:'🍟'}] },
  { level:2, prompt:"Coach says: rehydrate AND replace potassium after practice.", why:"Bananas are famous for potassium; water refills your sweat.",
    options:[{label:'Banana',emoji:'🍌',correct:true},{label:'Water',emoji:'💧',correct:true},{label:'Soda',emoji:'🥤'}] },
  { level:2, prompt:"Which breakfast wins for brain power before school?", why:"Eggs (choline), oats (steady energy) and berries feed your brain.",
    options:[{label:'Egg',emoji:'🥚',correct:true},{label:'Oatmeal',emoji:'🥣',correct:true},{label:'Berries',emoji:'🫐',correct:true},{label:'Donut',emoji:'🍩'}] },
  { level:2, prompt:"You keep catching colds — which foods build your defenses?", why:"Vitamin C (orange, pepper) and zinc (beans) power your immune system.",
    options:[{label:'Orange',emoji:'🍊',correct:true},{label:'Bell pepper',emoji:'🫑',correct:true},{label:'Beans',emoji:'🫘',correct:true},{label:'Candy',emoji:'🍬'}] },
  { level:2, prompt:"Dentist visit next week! Which choices help your teeth?", why:"Calcium in milk and cheese keeps teeth strong; sugar feeds cavities.",
    options:[{label:'Milk',emoji:'🥛',correct:true},{label:'Cheese',emoji:'🧀',correct:true},{label:'Gummies',emoji:'🐻'},{label:'Soda',emoji:'🥤'}] },
  { level:3, prompt:"Race day is coming — build your training plate.", why:"Pasta fuels, bananas add potassium, water hydrates — athlete basics.",
    options:[{label:'Pasta',emoji:'🍝',correct:true},{label:'Banana',emoji:'🍌',correct:true},{label:'Water',emoji:'💧',correct:true},{label:'Energy drink',emoji:'⚡'}] },
  { level:3, prompt:"Growth spurt! Which foods feed growing bones?", why:"Calcium (yogurt, tofu) plus vitamin D (salmon) build bone together.",
    options:[{label:'Yogurt',emoji:'🥛',correct:true},{label:'Tofu',emoji:'⬜',correct:true},{label:'Salmon',emoji:'🐟',correct:true},{label:'Chips',emoji:'🍟'}] },
  { level:3, prompt:"Road trip! Which snacks keep your energy steady for hours?", why:"Protein (nuts, cheese) plus fiber (apple) = no sugar crash.",
    options:[{label:'Nuts',emoji:'🥜',correct:true},{label:'Apple',emoji:'🍎',correct:true},{label:'Cheese stick',emoji:'🧀',correct:true},{label:'Candy',emoji:'🍬'}] },
  { level:3, prompt:"Spelling bee tomorrow — what's tonight's brain dinner?", why:"Omega-3 in salmon and walnuts is famous brain fuel.",
    options:[{label:'Salmon',emoji:'🐟',correct:true},{label:'Walnuts',emoji:'🌰',correct:true},{label:'Blueberries',emoji:'🫐',correct:true},{label:'Candy',emoji:'🍬'}] },
  { level:3, prompt:"Your body is making new red blood cells — what does it need?", why:"Iron (beans, beef) plus folate (spinach) build red blood cells.",
    options:[{label:'Beans',emoji:'🫘',correct:true},{label:'Spinach',emoji:'🥬',correct:true},{label:'Beef',emoji:'🥩',correct:true},{label:'Soda',emoji:'🥤'}] },
  { level:3, prompt:"Sore after swim practice — best recovery combo?", why:"Protein repairs muscle; potassium (banana) stops cramps.",
    options:[{label:'Yogurt',emoji:'🥛',correct:true},{label:'Banana',emoji:'🍌',correct:true},{label:'Egg',emoji:'🥚',correct:true},{label:'Chips',emoji:'🍟'}] },
  { level:3, prompt:"Your tummy's been 'stuck' — which foods get digestion moving?", why:"Fiber is the answer: beans, raspberries and oatmeal have lots.",
    options:[{label:'Beans',emoji:'🫘',correct:true},{label:'Raspberries',emoji:'🫐',correct:true},{label:'Oatmeal',emoji:'🥣',correct:true},{label:'Cheese puffs',emoji:'🧀'}] },
  { level:3, prompt:"All-day picnic in the sun — which combo keeps you hydrated?", why:"Watermelon and cucumber are mostly water — plus actual water!",
    options:[{label:'Watermelon',emoji:'🍉',correct:true},{label:'Cucumber',emoji:'🥒',correct:true},{label:'Water',emoji:'💧',correct:true},{label:'Soda',emoji:'🥤'}] },
];

// ============ 4) SWAPS: healthier choice + why ============
const SWAPS = [
  { better:{label:'Water',emoji:'💧'}, worse:{label:'Soda',emoji:'🥤'}, why:'Soda has lots of added sugar and no nutrients.' },
  { better:{label:'Whole-grain bread',emoji:'🍞'}, worse:{label:'White bread',emoji:'🍞'}, why:'Whole grains keep the fiber that white bread loses.' },
  { better:{label:'Baked potato',emoji:'🥔'}, worse:{label:'French fries',emoji:'🍟'}, why:'Baking skips the fried oil and extra salt.' },
  { better:{label:'Whole apple',emoji:'🍎'}, worse:{label:'Apple juice',emoji:'🧃'}, why:'The whole apple keeps the fiber; juice is mostly sugar.' },
  { better:{label:'Greek yogurt',emoji:'🥛'}, worse:{label:'Ice cream',emoji:'🍦'}, why:'Yogurt has protein and calcium with less sugar.' },
  { better:{label:'Nuts',emoji:'🥜'}, worse:{label:'Chips',emoji:'🍟'}, why:'Nuts add protein and healthy fat instead of just salt.' },
  { better:{label:'Grilled chicken',emoji:'🍗'}, worse:{label:'Chicken nuggets',emoji:'🍗'}, why:'Grilling skips the fried, salty coating.' },
  { better:{label:'Orange',emoji:'🍊'}, worse:{label:'Orange soda',emoji:'🥤'}, why:'A real orange has vitamin C and fiber, not just sugar.' },
  { better:{label:'Popcorn (plain)',emoji:'🍿'}, worse:{label:'Candy',emoji:'🍬'}, why:'Air-popped popcorn is a whole grain with fiber.' },
  { better:{label:'Milk',emoji:'🥛'}, worse:{label:'Energy drink',emoji:'⚡'}, why:'Milk builds bones; energy drinks add sugar and caffeine.' },
  { better:{label:'Brown rice',emoji:'🍚'}, worse:{label:'White rice',emoji:'🍚'}, why:'Brown rice keeps its fiber and minerals.' },
  { better:{label:'Frozen berries',emoji:'🫐'}, worse:{label:'Fruit gummies',emoji:'🐻'}, why:'Real berries have vitamins; gummies are mostly sugar.' },
  { better:{label:'Oatmeal',emoji:'🥣'}, worse:{label:'Sugary cereal',emoji:'🥣'}, why:'Oatmeal has fiber and far less added sugar.' },
  { better:{label:'Cheese stick',emoji:'🧀'}, worse:{label:'Candy bar',emoji:'🍫'}, why:'Cheese gives protein and calcium instead of just sugar.' },
  { better:{label:'Sparkling water',emoji:'🫧'}, worse:{label:'Soda',emoji:'🥤'}, why:'All the bubbles, none of the sugar.' },
  { better:{label:'Banana',emoji:'🍌'}, worse:{label:'Fruit snacks',emoji:'🐻'}, why:'A real banana has potassium and fiber — fruit snacks are candy.' },
  { better:{label:'Whole-wheat pasta',emoji:'🍝'}, worse:{label:'White pasta',emoji:'🍝'}, why:'Whole wheat keeps its fiber and B vitamins.' },
  { better:{label:'Baked chicken',emoji:'🍗'}, worse:{label:'Fried chicken',emoji:'🍗'}, why:'Baking skips the extra fried oil.' },
  { better:{label:'Trail mix',emoji:'🥜'}, worse:{label:'Candy bar',emoji:'🍫'}, why:'Nuts bring protein; dried fruit brings natural sweetness.' },
  { better:{label:'Water',emoji:'💧'}, worse:{label:'Sports drink',emoji:'🧴'}, why:'For everyday play, water hydrates without the added sugar.' },
  { better:{label:'Veggies & hummus',emoji:'🥕'}, worse:{label:'Chips & dip',emoji:'🍟'}, why:'Hummus is made of beans — protein and fiber included.' },
  { better:{label:'Plain yogurt + berries',emoji:'🫐'}, worse:{label:'Candy-flavored yogurt',emoji:'🍭'}, why:'Real berries sweeten without piles of added sugar.' },
  { better:{label:'Avocado on toast',emoji:'🥑'}, worse:{label:'Butter on toast',emoji:'🧈'}, why:'Avocado adds healthy fat, fiber, and vitamins.' },
  { better:{label:'Baked fish',emoji:'🐟'}, worse:{label:'Fish sticks',emoji:'🍤'}, why:'Real fish without the fried, salty coating.' },
  { better:{label:'Sweet potato fries',emoji:'🍠'}, worse:{label:'Regular fries',emoji:'🍟'}, why:'Sweet potatoes add vitamin A and fiber.' },
  { better:{label:'Fruit smoothie',emoji:'🥤'}, worse:{label:'Milkshake',emoji:'🍦'}, why:'Whole fruit keeps its fiber; milkshakes are mostly sugar.' },
  { better:{label:'Olive oil',emoji:'🫗'}, worse:{label:'Butter',emoji:'🧈'}, why:'Plant oils have healthier fats for your heart.' },
  { better:{label:'Whole orange',emoji:'🍊'}, worse:{label:'Orange candy',emoji:'🍬'}, why:'The real thing has vitamin C and fiber.' },
  { better:{label:'Cheese & crackers',emoji:'🧀'}, worse:{label:'Cheese puffs',emoji:'🟠'}, why:'Real cheese has protein and calcium; puffs are mostly salt.' },
  { better:{label:'Corn on the cob',emoji:'🌽'}, worse:{label:'Corn chips',emoji:'🍟'}, why:'The whole vegetable keeps its fiber and vitamins.' },
  { better:{label:'Veggie pizza',emoji:'🍕'}, worse:{label:'Pepperoni pizza',emoji:'🍕'}, why:'Veggies add vitamins; pepperoni adds salt and fat.' },
  { better:{label:'Plain milk',emoji:'🥛'}, worse:{label:'Chocolate milk',emoji:'🍫'}, why:'Same calcium and protein, minus the added sugar.' },
  { better:{label:'Natural peanut butter',emoji:'🥜'}, worse:{label:'Chocolate spread',emoji:'🍫'}, why:'Peanut butter is protein; chocolate spread is mostly sugar.' },
  { better:{label:'Eggs & toast',emoji:'🥚'}, worse:{label:'Sugary cereal',emoji:'🥣'}, why:'Protein at breakfast keeps you full till lunch.' },
  { better:{label:'Raisins',emoji:'🍇'}, worse:{label:'Gummy bears',emoji:'🐻'}, why:'Raisins are real fruit with iron and fiber.' },
  { better:{label:'Turkey sandwich',emoji:'🥪'}, worse:{label:'Hot dog',emoji:'🌭'}, why:'Turkey is lean protein; hot dogs are heavily processed and salty.' },
  { better:{label:'Dark chocolate square',emoji:'🍫'}, worse:{label:'Milk chocolate bar',emoji:'🍫'}, why:'Dark chocolate has less sugar and even some iron.' },
  { better:{label:'Carrot sticks',emoji:'🥕'}, worse:{label:'Pretzels',emoji:'🥨'}, why:'Carrots bring vitamin A; pretzels are just salty starch.' },
  { better:{label:'Watermelon slice',emoji:'🍉'}, worse:{label:'Popsicle',emoji:'🍧'}, why:'Watermelon hydrates with natural sweetness and vitamins.' },
  { better:{label:'Roasted chickpeas',emoji:'🫘'}, worse:{label:'Cheese crackers',emoji:'🧀'}, why:'Chickpeas are crunchy AND full of protein and fiber.' },
  { better:{label:'Low-sugar granola bar',emoji:'🌾'}, worse:{label:'Candy bar',emoji:'🍫'}, why:'Oats give lasting energy instead of a sugar spike.' },
  { better:{label:'Fresh grapes',emoji:'🍇'}, worse:{label:'Jelly',emoji:'🍯'}, why:'Whole grapes keep their fiber; jelly is basically sugar.' },
  { better:{label:'Salsa',emoji:'🍅'}, worse:{label:'Cheese dip',emoji:'🧀'}, why:'Salsa is chopped vegetables; cheese dip is salt and fat.' },
  { better:{label:'Waffles + fruit',emoji:'🧇'}, worse:{label:'Waffles + syrup',emoji:'🍯'}, why:'Fruit sweetens with vitamins instead of plain sugar.' },
  { better:{label:'Fruit-infused water',emoji:'💧'}, worse:{label:'Lemonade',emoji:'🍋'}, why:'Fruit slices add flavor without a cup of sugar.' },
];

// ============ 5) LABELS: nutrition-label reading + hidden-sugar round ============
const SUGAR_ALIASES = ['sugar','high-fructose corn syrup','corn syrup','cane sugar','dextrose','sucrose','fructose','glucose','honey','molasses','fruit juice concentrate','maltose','brown sugar','evaporated cane juice','agave nectar'];
const LABELS = [
  { name:'Crunchy O’s Cereal', emoji:'🥣', servingSize:'1 cup (40g)', servingsPerContainer:9, calories:150, sugarG:12, fiberG:2,
    ingredients:['Whole grain oats','Sugar','Corn syrup','Salt','Honey','Natural flavor'],
    questions:[
      { q:'What is one serving size?', choices:['1 cup','The whole box','9 cups'], answer:0, explain:'The label says 1 cup (40g) is one serving.' },
      { q:'How many servings are in the whole box?', choices:['1','9','40'], answer:1, explain:'Servings per container = 9, so the box has 9 servings.' },
      { q:'How many sugar names hide in the ingredients?', choices:['1','2','3'], answer:2, explain:'Sugar, Corn syrup, and Honey are all added sugars — that\'s 3!' },
    ] },
  { name:'Berry Fruit Snacks', emoji:'🐻', servingSize:'1 pouch (26g)', servingsPerContainer:10, calories:80, sugarG:11, fiberG:0,
    ingredients:['Corn syrup','Sugar','Fruit juice concentrate','Gelatin','Citric acid','Red 40'],
    questions:[
      { q:'How much sugar is in ONE pouch?', choices:['0g','11g','80g'], answer:1, explain:'Each pouch has 11g of sugar — most of the pouch!' },
      { q:'How many hidden sugars are in the ingredients?', choices:['1','2','3'], answer:2, explain:'Corn syrup, Sugar, and Fruit juice concentrate are all sugar.' },
      { q:'Is this a good source of fiber?', choices:['Yes','No'], answer:1, explain:'Fiber is 0g — these are basically candy.' },
    ] },
  { name:'Plain Greek Yogurt', emoji:'🥛', servingSize:'1 container (170g)', servingsPerContainer:1, calories:100, sugarG:6, fiberG:0,
    ingredients:['Cultured pasteurized milk','Live active cultures'],
    questions:[
      { q:'How many added sugars are in the ingredients?', choices:['0','2','5'], answer:0, explain:'None! The 6g of sugar is natural milk sugar — no sugar added.' },
      { q:'How many servings in the container?', choices:['1','6','170'], answer:0, explain:'Servings per container = 1. The whole cup is one serving.' },
    ] },
  { name:'Whole Wheat Bread', emoji:'🍞', servingSize:'1 slice (28g)', servingsPerContainer:20, calories:80, sugarG:2, fiberG:3,
    ingredients:['Whole wheat flour','Water','Yeast','Salt'],
    questions:[
      { q:'How many hidden sugars are in the ingredients?', choices:['0','1','3'], answer:0, explain:'None — just whole wheat, water, yeast, and salt.' },
      { q:'Is this a good source of fiber?', choices:['Yes','No'], answer:0, explain:'3g of fiber per slice — whole wheat keeps its fiber.' },
    ] },
  { name:'Tropical Fruit Punch', emoji:'🧃', servingSize:'1 cup (240ml)', servingsPerContainer:8, calories:110, sugarG:26, fiberG:0,
    ingredients:['Water','High-fructose corn syrup','Fruit juice concentrate','Citric acid','Red 40'],
    questions:[
      { q:'How much sugar is in ONE cup?', choices:['8g','26g','110g'], answer:1, explain:'26 grams — about 6 teaspoons of sugar in one cup!' },
      { q:'How many hidden sugars are in the ingredients?', choices:['0','1','2'], answer:2, explain:'High-fructose corn syrup AND fruit juice concentrate are both added sugar.' },
      { q:'If you drink the whole bottle, how many cups is that?', choices:['1','8','26'], answer:1, explain:'Servings per container = 8 — the whole bottle is 8 cups of punch!' },
    ] },
  { name:'Chicken Noodle Soup (can)', emoji:'🥫', servingSize:'1 cup (245g)', servingsPerContainer:2, calories:90, sugarG:1, fiberG:1, sodiumMg:890,
    ingredients:['Chicken broth','Noodles','Chicken','Salt','Sugar','Celery'],
    questions:[
      { q:'If you eat the WHOLE can, how many servings is that?', choices:['1','2','4'], answer:1, explain:'The can holds 2 servings — eating it all doubles everything on the label.' },
      { q:'The whole can has how much sodium?', choices:['890mg','1780mg','90mg'], answer:1, explain:'890mg × 2 servings = 1780mg — most of a day\'s salt in one can!' },
      { q:'How many added sugars hide in the ingredients?', choices:['0','1','3'], answer:1, explain:'Just one — "Sugar." Always scan the list!' },
    ] },
  { name:'Natural Peanut Butter', emoji:'🥜', servingSize:'2 tbsp (32g)', servingsPerContainer:14, calories:190, sugarG:1, fiberG:3,
    ingredients:['Peanuts','Salt'],
    questions:[
      { q:'How many added sugars are in the ingredients?', choices:['0','1','2'], answer:0, explain:'Zero — just peanuts and salt. The 1g of sugar is natural from peanuts.' },
      { q:'Is this a good source of fiber?', choices:['Yes','No'], answer:0, explain:'3g per serving — peanuts keep their fiber.' },
    ] },
  { name:'Chocolate Milk', emoji:'🍫', servingSize:'1 cup (240ml)', servingsPerContainer:1, calories:180, sugarG:24, fiberG:0,
    ingredients:['Milk','Sugar','Cocoa','Natural flavor'],
    questions:[
      { q:'Plain milk has 12g of natural sugar. How much sugar was ADDED here?', choices:['0g','12g','24g'], answer:1, explain:'24g total − 12g natural milk sugar = 12g of added sugar.' },
      { q:'How many added sugars are in the ingredients?', choices:['0','1','2'], answer:1, explain:'One — "Sugar." (Cocoa itself isn\'t sugar.)' },
    ] },
  { name:'Frosty Flakes Cereal', emoji:'🥣', servingSize:'1 cup (37g)', servingsPerContainer:12, calories:140, sugarG:14, fiberG:1,
    ingredients:['Milled corn','Sugar','Corn syrup','Brown sugar','Salt','Vitamins'],
    questions:[
      { q:'How many sugar names hide in the ingredients?', choices:['1','2','3'], answer:2, explain:'Sugar, Corn syrup, AND Brown sugar — three ways to say sugar!' },
      { q:'Is this cereal a good source of fiber?', choices:['Yes','No'], answer:1, explain:'Only 1g — compare that to oatmeal\'s 4g.' },
    ] },
  { name:'Chewy Granola Bars', emoji:'🌾', servingSize:'1 bar (24g)', servingsPerContainer:6, calories:140, sugarG:11, fiberG:2,
    ingredients:['Whole grain oats','Brown sugar','Honey','Corn syrup','Almonds','Salt'],
    questions:[
      { q:'How many added sugars hide in the ingredients?', choices:['1','2','3'], answer:2, explain:'Brown sugar, Honey, and Corn syrup — 3 sugars in a "healthy" bar.' },
      { q:'If you eat 2 bars, how much sugar is that?', choices:['11g','22g','6g'], answer:1, explain:'11g × 2 = 22g — check labels before grabbing seconds!' },
    ] },
  { name:'Unsweetened Applesauce', emoji:'🍎', servingSize:'1 cup (246g)', servingsPerContainer:4, calories:60, sugarG:12, fiberG:2,
    ingredients:['Apples','Water','Vitamin C (ascorbic acid)'],
    questions:[
      { q:'There\'s 12g of sugar — was any of it ADDED?', choices:['Yes','No'], answer:1, explain:'No! It\'s all natural fruit sugar — the ingredients are just apples and water.' },
      { q:'How many added sugars are in the ingredients?', choices:['0','1','2'], answer:0, explain:'Zero. "Vitamin C" is a vitamin, not a sugar.' },
    ] },
  { name:'Cheesy Crackers', emoji:'🧀', servingSize:'27 crackers (30g)', servingsPerContainer:8, calories:150, sugarG:1, fiberG:1, sodiumMg:230,
    ingredients:['Enriched flour','Vegetable oil','Cheese','Salt','Sugar','Paprika'],
    questions:[
      { q:'If you eat HALF the box, how many servings is that?', choices:['2','4','8'], answer:1, explain:'8 servings per box ÷ 2 = 4 servings — that\'s 108 crackers!' },
      { q:'How many added sugars hide in the ingredients?', choices:['0','1','2'], answer:1, explain:'One — even salty snacks often sneak in sugar.' },
    ] },
];

// ============ 5b) KID DAILY TARGETS (ages ~9-13; NIH RDA / AHA / Dietary Guidelines) ============
// Used to give "is that a lot?" context wherever amounts appear.
const KID_DAILY = {
  'Fiber':      { amount:'~25g',            note:'Kids need about 25 grams of fiber a day.' },
  'Added sugar':{ amount:'under 25g',       note:'Doctors say kids should stay UNDER about 25 grams (6 teaspoons) of added sugar a day.' },
  'Sodium':     { amount:'under 1,800mg',   note:'Kids should stay under about 1,800mg of sodium (salt) a day.' },
  'Calcium':    { amount:'1,300mg',         note:'Growing kids need about 1,300mg of calcium a day — more than grown-ups!' },
  'Iron':       { amount:'~8mg',            note:'Kids around 9–13 need about 8mg of iron a day.' },
  'Protein':    { amount:'~34g',            note:'Kids around 9–13 need about 34 grams of protein a day.' },
  'Vitamin C':  { amount:'~45mg',           note:'Kids around 9–13 need about 45mg of vitamin C a day — one orange nearly covers it!' },
  'Vitamin D':  { amount:'15mcg (600 IU)',  note:'Kids need about 15mcg of vitamin D a day — sunshine helps your body make it too.' },
  'Potassium':  { amount:'~2,500mg',        note:'Kids around 9–13 need about 2,300–2,500mg of potassium a day.' },
};

// ============ 6) PLATE targets (MyPlate proportions) ============
const PLATE = {
  targets: { vegetable:0.30, fruit:0.20, grain:0.25, protein:0.25 },
  drink: 'dairy',   // a glass of milk/water on the side
  note: 'Aim for about half your plate fruits & veggies, a quarter grains, a quarter protein, plus a drink.',
};

// ============ emit ============
const out =
`// ============================================================================
// MASTER NUTRITION LIBRARY — the single source of truth for all 5 games.
// Food→nutrient links are inverted from the FDA/NIH Vitamins & Minerals chart.
// Protein, Fiber, Omega-3 and all teaching content (functions, scenarios, swaps,
// labels, plate) are authored. Edit THIS file to update any game's content.
// ============================================================================
window.LIB = {
  NUTRIENTS: ${JSON.stringify(Object.fromEntries(Object.entries(N).map(([k,v])=>[k,{dv:v.dv,flag:v.flag||null,added:!!v.added,does:v.does}])), null, 2)},
  FOODS: ${JSON.stringify(FOODS)},
  FUNCTIONS: ${JSON.stringify(FUNCTIONS)},
  SCENARIOS: ${JSON.stringify(SCENARIOS)},
  SWAPS: ${JSON.stringify(SWAPS)},
  KID_DAILY: ${JSON.stringify(KID_DAILY, null, 2)},
  SUGAR_ALIASES: ${JSON.stringify(SUGAR_ALIASES)},
  LABELS: ${JSON.stringify(LABELS)},
  PLATE: ${JSON.stringify(PLATE)}
};
`;
fs.mkdirSync('/Users/traviswilber/Claude-Projects/math-app/nutrition', { recursive:true });
fs.writeFileSync('/Users/traviswilber/Claude-Projects/math-app/nutrition/library.js', out);

// report
const edges = FOODS.reduce((a,f)=>a+f.nutrients.length,0);
console.log('NUTRIENTS:', Object.keys(N).length, ' FOODS:', FOODS.length, ' edges:', edges);
console.log('FUNCTIONS:', FUNCTIONS.length, ' SCENARIOS:', SCENARIOS.length, ' SWAPS:', SWAPS.length, ' LABELS:', LABELS.length);
console.log('groups:', Object.fromEntries(['fruit','vegetable','grain','protein','dairy','drink','other'].map(g=>[g,FOODS.filter(f=>f.group===g).length])));
