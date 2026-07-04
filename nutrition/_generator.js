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
  'Calcium':     { dv:'1300 mg',flag:'more', does:'strong bones & teeth', foods:['milk','cheese','yogurt','canned salmon','sardines','fortified orange juice','soy milk','fortified cereal','kale','broccoli','collard greens','tofu'] },
  'Iron':        { dv:'18 mg',  flag:'more', does:'carries oxygen in your blood', foods:['beans','peas','lentils','egg','spinach','kale','beef','pork','nuts','beef liver','chicken','turkey','crab','clams','sardines','shrimp','oysters','tofu','fortified cereal'] },
  'Potassium':   { dv:'4700 mg',flag:'more', does:'muscles & heartbeat', foods:['beans','milk','apricots','banana','kiwi','cantaloupe','orange','clams','trout','tomato','potato','sweet potato','spinach'] },
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
  'Protein':     { dv:'50 g',  added:true, does:'builds muscles & heals you', foods:['beef','pork','chicken','turkey','salmon','tuna','cod','trout','shrimp','clams','oysters','crab','sardines','egg','milk','cheese','yogurt','beans','peas','lentils','chickpeas','tofu','soybeans','nuts','peanuts','peanut butter','sunflower seeds'] },
  'Fiber':       { dv:'28 g',  added:true, flag:'more', does:'healthy digestion, keeps you full', foods:['beans','peas','lentils','chickpeas','whole grains','oats','avocado','raspberries','broccoli','Brussels sprouts','cauliflower','sweet potato','potato','spinach','kale','almonds','nuts','pumpkin','apple','orange','banana','kiwi','pineapple'] },
  'Omega-3':     { dv:'—',     added:true, does:'brain & focus, healthy heart', foods:['salmon','trout','herring','tuna','sardines','canned salmon','walnuts','flaxseed'] },
};

const EXCELLENT = {
  'Calcium':  ['cheese','tofu','fortified orange juice','milk','yogurt','canned salmon','sardines'],
  'Iron':     ['fortified cereal','beans','pumpkin seeds','sunflower seeds','soybeans','oysters'],
  'Potassium':['beans','apricots','orange juice','potato','soybeans','sweet potato','spinach'],
};

const EMOJI = {
  'apple':'🍎','apricots':'🍑','asparagus':'🥬','avocado':'🥑','banana':'🍌','beans':'🫘','beef':'🥩','beef liver':'🥩',
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
  fruit:['apple','apricots','banana','cantaloupe','grapefruit','kiwi','lemon','orange','pineapple','raisins','raspberries','strawberries'],
  vegetable:['asparagus','bell pepper','broccoli','Brussels sprouts','carrot','cauliflower','celery','collard greens','garlic','kale','lettuce','mushrooms','mustard greens','pumpkin','red pepper','seaweed','spinach','sweet potato','Swiss chard','tomato','turnip greens','potato','avocado'],
  grain:['bread','fortified cereal','oats','pasta','rice','whole grains'],
  protein:['beans','beef','beef liver','Brazil nuts','chicken','chickpeas','clams','cod','crab','egg','flounder','herring','lentils','nuts','oysters','peanut butter','peanuts','peas','pork','pumpkin seeds','salmon','canned salmon','sardines','shrimp','soybeans','sunflower seeds','tofu','trout','tuna','turkey','walnuts','flaxseed'],
  dairy:['cheese','milk','yogurt','fortified milk','soy milk'],
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
];

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
