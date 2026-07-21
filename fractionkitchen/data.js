function gcd(a, b){
  a = Math.abs(a);
  b = Math.abs(b);
  while (b){
    const t = a % b;
    a = b;
    b = t;
  }
  return a || 1;
}

function F(n, d){
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function Raw(n, d){
  return { n, d };
}

function fracKey(f){ return f.n + "/" + f.d; }
function sameFrac(a, b){ return a.n * b.d === b.n * a.d; }
function mulFrac(a, b){ return F(a.n * b.n, a.d * b.d); }

function rotateChoices(correct, others, slot){
  const pool = [correct].concat(others);
  const unique = [];
  const seen = new Set();
  pool.forEach(choice => {
    if (choice.n <= 0 || choice.d <= 0) return;
    const key = fracKey(choice);
    if (!seen.has(key)){
      seen.add(key);
      unique.push(choice);
    }
  });
  for (let delta = 1; unique.length < 4 && delta < 8; delta++){
    const plus = F(correct.n + delta, correct.d);
    const minus = correct.n - delta > 0 ? F(correct.n - delta, correct.d) : null;
    [plus, minus].forEach(choice => {
      if (!choice) return;
      const key = fracKey(choice);
      if (!seen.has(key) && unique.length < 4){
        seen.add(key);
        unique.push(choice);
      }
    });
  }
  const trimmed = unique.slice(0, 4);
  const answer = Math.min(slot % 4, trimmed.length - 1);
  const choices = trimmed.slice();
  const correctIndex = choices.findIndex(choice => sameFrac(choice, correct));
  if (correctIndex !== answer){
    const tmp = choices[answer];
    choices[answer] = choices[correctIndex];
    choices[correctIndex] = tmp;
  }
  return { choices, answer };
}

function scaleCoach(cfg){
  const factor = F(cfg.to, cfg.from);
  const correct = mulFrac(cfg.amount, factor);
  const rotated = rotateChoices(correct, [
    cfg.amount,
    F(correct.n + 1, correct.d),
    correct.n > 1 ? F(correct.n - 1, correct.d) : F(correct.n + 2, correct.d),
    mulFrac(cfg.amount, F(2, 1))
  ], cfg.slot);
  return {
    recipe: cfg.recipe,
    ingredient: cfg.ingredient,
    unit: cfg.unit,
    from: cfg.from,
    to: cfg.to,
    amount: cfg.amount,
    correct,
    choices: rotated.choices,
    answer: rotated.answer,
    coach: "Scale by the same factor as the servings. " + cfg.from + " to " + cfg.to + " means multiply by " + factor.n + "/" + factor.d + ", so " + cfg.amount.n + "/" + cfg.amount.d + " becomes " + correct.n + "/" + correct.d + "."
  };
}

function measureCoach(cfg){
  const target = cfg.target;
  const filled = target.n * (cfg.displayDen / target.d);
  const correct = F(filled, cfg.displayDen);
  const options = [Raw(filled, cfg.displayDen)];
  const candidates = [filled - 1, filled + 1, filled - 2, filled + 2, filled + 3];
  candidates.forEach(n => {
    if (n > 0 && n <= cfg.displayDen){
      options.push(Raw(n, cfg.displayDen));
    }
  });
  const unique = [];
  const seen = new Set();
  options.forEach(choice => {
    const key = choice.n + "/" + choice.d;
    if (!seen.has(key)){
      seen.add(key);
      unique.push(choice);
    }
  });
  const trimmed = unique.slice(0, 4);
  const answer = cfg.slot % 4;
  const correctIndex = trimmed.findIndex(choice => sameFrac(choice, correct));
  if (correctIndex !== answer){
    const tmp = trimmed[answer];
    trimmed[answer] = trimmed[correctIndex];
    trimmed[correctIndex] = tmp;
  }
  return {
    recipe: cfg.recipe,
    ingredient: cfg.ingredient,
    target,
    displayDen: cfg.displayDen,
    choices: trimmed,
    answer,
    coach: "Use an equivalent fraction. " + target.n + "/" + target.d + " matches " + correct.n + "/" + correct.d + ", so the correct bar fills " + correct.n + " of " + correct.d + " equal parts."
  };
}

function fixCoach(cfg){
  const factor = F(cfg.to, cfg.from);
  const correct = mulFrac(cfg.amount, factor);
  const rotated = rotateChoices(correct, [
    cfg.wrong,
    cfg.amount,
    F(correct.n + 1, correct.d),
    correct.n > 1 ? F(correct.n - 1, correct.d) : F(correct.n + 2, correct.d)
  ], cfg.slot);
  return {
    recipe: cfg.recipe,
    ingredient: cfg.ingredient,
    unit: cfg.unit,
    from: cfg.from,
    to: cfg.to,
    amount: cfg.amount,
    wrong: cfg.wrong,
    correct,
    choices: rotated.choices,
    answer: rotated.answer,
    coach: "The batch card is off because the servings changed from " + cfg.from + " to " + cfg.to + ". Multiply " + cfg.amount.n + "/" + cfg.amount.d + " by " + factor.n + "/" + factor.d + " to get " + correct.n + "/" + correct.d + "."
  };
}

const scaleConfigs = [
  { recipe:"Berry Pancakes", ingredient:"flour", unit:"cups", from:4, to:8, amount:F(3,4), slot:0 },
  { recipe:"Taco Rice", ingredient:"broth", unit:"cups", from:3, to:6, amount:F(2,3), slot:1 },
  { recipe:"Muffin Batter", ingredient:"milk", unit:"cups", from:2, to:6, amount:F(1,2), slot:2 },
  { recipe:"Lemonade", ingredient:"lemon juice", unit:"cups", from:4, to:8, amount:F(3,8), slot:3 },
  { recipe:"Pasta Salad", ingredient:"dressing", unit:"cups", from:6, to:3, amount:F(5,6), slot:0 },
  { recipe:"Pizza Dough", ingredient:"olive oil", unit:"cups", from:8, to:4, amount:F(3,4), slot:1 },
  { recipe:"Sunrise Smoothie", ingredient:"yogurt", unit:"cups", from:5, to:10, amount:F(2,5), slot:2 },
  { recipe:"Fruit Salsa", ingredient:"honey", unit:"cups", from:4, to:6, amount:F(1,4), slot:3 },
  { recipe:"Waffle Mix", ingredient:"oats", unit:"cups", from:5, to:15, amount:F(3,5), slot:0 },
  { recipe:"Camp Chili", ingredient:"beans", unit:"cups", from:4, to:2, amount:F(7,8), slot:1 },
  { recipe:"Cookie Dough", ingredient:"cocoa", unit:"cups", from:6, to:9, amount:F(2,3), slot:2 },
  { recipe:"Apple Crisp", ingredient:"oats", unit:"cups", from:3, to:12, amount:F(3,4), slot:3 },
  { recipe:"Veggie Soup", ingredient:"broth", unit:"cups", from:8, to:12, amount:F(5,8), slot:0 },
  { recipe:"Granola Crunch", ingredient:"syrup", unit:"cups", from:3, to:4, amount:F(1,3), slot:1 },
  { recipe:"Pretzel Bites", ingredient:"cheese sauce", unit:"cups", from:5, to:15, amount:F(3,10), slot:2 },
  { recipe:"Yogurt Parfait", ingredient:"berries", unit:"cups", from:6, to:3, amount:F(7,12), slot:3 },
  { recipe:"Rice Bowl", ingredient:"teriyaki sauce", unit:"cups", from:4, to:10, amount:F(1,2), slot:0 },
  { recipe:"Banana Bread", ingredient:"brown sugar", unit:"cups", from:2, to:5, amount:F(2,5), slot:1 },
  { recipe:"Cornbread", ingredient:"oil", unit:"cups", from:6, to:9, amount:F(3,8), slot:2 },
  { recipe:"Trail Mix Bars", ingredient:"melted butter", unit:"cups", from:3, to:12, amount:F(1,6), slot:3 }
];

const measureConfigs = [
  { recipe:"Berry Pancakes", ingredient:"milk", target:F(3,4), displayDen:8, slot:0 },
  { recipe:"Trail Mix Bars", ingredient:"peanut butter", target:F(2,3), displayDen:6, slot:1 },
  { recipe:"Pizza Sauce", ingredient:"cheese", target:F(5,6), displayDen:12, slot:2 },
  { recipe:"Lemonade", ingredient:"water", target:F(1,2), displayDen:8, slot:3 },
  { recipe:"Veggie Soup", ingredient:"corn", target:F(3,5), displayDen:10, slot:0 },
  { recipe:"Cookie Dough", ingredient:"vanilla", target:F(1,4), displayDen:8, slot:1 },
  { recipe:"Waffle Mix", ingredient:"berries", target:F(7,8), displayDen:8, slot:2 },
  { recipe:"Fruit Salsa", ingredient:"mango", target:F(2,5), displayDen:10, slot:3 },
  { recipe:"Granola Crunch", ingredient:"oats", target:F(5,8), displayDen:8, slot:0 },
  { recipe:"Camp Chili", ingredient:"beans", target:F(3,10), displayDen:10, slot:1 },
  { recipe:"Sunrise Smoothie", ingredient:"juice", target:F(2,3), displayDen:12, slot:2 },
  { recipe:"Pretzel Bites", ingredient:"cheese sauce", target:F(1,3), displayDen:9, slot:3 },
  { recipe:"Apple Crisp", ingredient:"apple slices", target:F(3,8), displayDen:8, slot:0 },
  { recipe:"Taco Rice", ingredient:"salsa", target:F(7,10), displayDen:10, slot:1 },
  { recipe:"Muffin Batter", ingredient:"oil", target:F(5,12), displayDen:12, slot:2 },
  { recipe:"Banana Bread", ingredient:"milk", target:F(1,2), displayDen:12, slot:3 },
  { recipe:"Pasta Salad", ingredient:"peas", target:F(4,5), displayDen:10, slot:0 },
  { recipe:"Rice Bowl", ingredient:"soy sauce", target:F(1,6), displayDen:12, slot:1 },
  { recipe:"Yogurt Parfait", ingredient:"granola", target:F(5,9), displayDen:9, slot:2 },
  { recipe:"Cornbread", ingredient:"cornmeal", target:F(7,12), displayDen:12, slot:3 }
];

const fixConfigs = [
  { recipe:"Berry Pancakes", ingredient:"flour", unit:"cups", from:4, to:8, amount:F(3,4), wrong:F(3,4), slot:0 },
  { recipe:"Taco Rice", ingredient:"broth", unit:"cups", from:3, to:6, amount:F(2,3), wrong:F(1,1), slot:1 },
  { recipe:"Muffin Batter", ingredient:"milk", unit:"cups", from:2, to:6, amount:F(1,2), wrong:F(1,1), slot:2 },
  { recipe:"Lemonade", ingredient:"lemon juice", unit:"cups", from:4, to:8, amount:F(3,8), wrong:F(3,8), slot:3 },
  { recipe:"Pasta Salad", ingredient:"dressing", unit:"cups", from:6, to:3, amount:F(5,6), wrong:F(5,6), slot:0 },
  { recipe:"Pizza Dough", ingredient:"olive oil", unit:"cups", from:8, to:4, amount:F(3,4), wrong:F(3,2), slot:1 },
  { recipe:"Sunrise Smoothie", ingredient:"yogurt", unit:"cups", from:5, to:10, amount:F(2,5), wrong:F(2,5), slot:2 },
  { recipe:"Fruit Salsa", ingredient:"honey", unit:"cups", from:4, to:6, amount:F(1,4), wrong:F(1,2), slot:3 },
  { recipe:"Waffle Mix", ingredient:"oats", unit:"cups", from:5, to:15, amount:F(3,5), wrong:F(6,5), slot:0 },
  { recipe:"Camp Chili", ingredient:"beans", unit:"cups", from:4, to:2, amount:F(7,8), wrong:F(7,4), slot:1 },
  { recipe:"Cookie Dough", ingredient:"cocoa", unit:"cups", from:6, to:9, amount:F(2,3), wrong:F(4,3), slot:2 },
  { recipe:"Apple Crisp", ingredient:"oats", unit:"cups", from:3, to:12, amount:F(3,4), wrong:F(3,2), slot:3 },
  { recipe:"Veggie Soup", ingredient:"broth", unit:"cups", from:8, to:12, amount:F(5,8), wrong:F(5,4), slot:0 },
  { recipe:"Granola Crunch", ingredient:"syrup", unit:"cups", from:3, to:4, amount:F(1,3), wrong:F(1,2), slot:1 },
  { recipe:"Pretzel Bites", ingredient:"cheese sauce", unit:"cups", from:5, to:15, amount:F(3,10), wrong:F(3,5), slot:2 },
  { recipe:"Yogurt Parfait", ingredient:"berries", unit:"cups", from:6, to:3, amount:F(7,12), wrong:F(7,12), slot:3 },
  { recipe:"Rice Bowl", ingredient:"teriyaki sauce", unit:"cups", from:4, to:10, amount:F(1,2), wrong:F(1,1), slot:0 },
  { recipe:"Banana Bread", ingredient:"brown sugar", unit:"cups", from:2, to:5, amount:F(2,5), wrong:F(4,5), slot:1 },
  { recipe:"Cornbread", ingredient:"oil", unit:"cups", from:6, to:9, amount:F(3,8), wrong:F(1,2), slot:2 },
  { recipe:"Trail Mix Bars", ingredient:"melted butter", unit:"cups", from:3, to:12, amount:F(1,6), wrong:F(1,3), slot:3 }
];

window.FRACTION_KITCHEN = {
  MODES: {
    cards: {
      label: "Kitchen Cards",
      icon: "🃏",
      help: "Flip kitchen conversion cards first, then mark whether you knew the measurement fact before moving into the game stations.",
      items: [
        {
          title: "Cup to Tablespoons",
          front: "1 cup = ? tablespoons",
          back: "1 cup = 16 tablespoons.",
          coach: "This is one of the most useful kitchen facts because many smaller recipe amounts build up to one cup."
        },
        {
          title: "Tablespoon to Teaspoons",
          front: "1 tablespoon = ? teaspoons",
          back: "1 tablespoon = 3 teaspoons.",
          coach: "This helps when a recipe gives a small amount and your measuring spoon set uses teaspoons."
        },
        {
          title: "Cup to Ounces",
          front: "1 cup = ? fluid ounces",
          back: "1 cup = 8 fluid ounces.",
          coach: "In recipes, this usually means fluid ounces for liquid measure, not weight ounces."
        },
        {
          title: "Half Cup",
          front: "1/2 cup = ? tablespoons",
          back: "1/2 cup = 8 tablespoons.",
          coach: "Since 1 cup is 16 tablespoons, half of a cup is half of 16."
        },
        {
          title: "Quarter Cup",
          front: "1/4 cup = ? tablespoons",
          back: "1/4 cup = 4 tablespoons.",
          coach: "A quarter is one fourth of the whole, so take one fourth of 16 tablespoons."
        },
        {
          title: "Three Fourths Cup",
          front: "3/4 cup = ? tablespoons",
          back: "3/4 cup = 12 tablespoons.",
          coach: "Build it from quarters: 1/4 cup is 4 tablespoons, so 3 quarters make 12 tablespoons."
        },
        {
          title: "Eighth Cup",
          front: "1/8 cup = ? tablespoons",
          back: "1/8 cup = 2 tablespoons.",
          coach: "Half of 1/4 cup is 1/8 cup, so halve 4 tablespoons to get 2."
        },
        {
          title: "Two Cups",
          front: "2 cups = ? pint",
          back: "2 cups = 1 pint.",
          coach: "Cup-pint-quart-gallon facts stack together, so learning one helps with the next."
        },
        {
          title: "Four Cups",
          front: "4 cups = ? quart",
          back: "4 cups = 1 quart.",
          coach: "A quart is bigger than a pint, so it takes 4 cups instead of 2."
        },
        {
          title: "One Gallon",
          front: "1 gallon = ? quarts",
          back: "1 gallon = 4 quarts.",
          coach: "The gallon-family ladder goes cups to pints to quarts to gallons."
        },
        {
          title: "Gallon to Cups",
          front: "1 gallon = ? cups",
          back: "1 gallon = 16 cups.",
          coach: "Start with 1 gallon = 4 quarts and 1 quart = 4 cups, then multiply 4 x 4."
        },
        {
          title: "Gallon to Ounces",
          front: "1 gallon = ? fluid ounces",
          back: "1 gallon = 128 fluid ounces.",
          coach: "If 1 cup is 8 fluid ounces and 1 gallon is 16 cups, then 16 x 8 = 128."
        }
      ]
    },
    scale: {
      label: "Scale Recipe",
      icon: "📈",
      help: "Match the ingredient amount to the new serving size by scaling the fraction up or down.",
      items: scaleConfigs.map(scaleCoach)
    },
    measure: {
      label: "Measure It",
      icon: "🥄",
      help: "Pick the measuring bar that shows the right fraction of a cup.",
      items: measureConfigs.map(measureCoach)
    },
    fix: {
      label: "Fix the Batch",
      icon: "🧁",
      help: "A kitchen helper scaled the recipe wrong. Fix the ingredient amount before the batch goes bad.",
      items: fixConfigs.map(fixCoach)
    }
  }
};
