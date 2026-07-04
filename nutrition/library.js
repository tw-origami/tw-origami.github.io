// ============================================================================
// MASTER NUTRITION LIBRARY — the single source of truth for all 5 games.
// Food→nutrient links are inverted from the FDA/NIH Vitamins & Minerals chart.
// Protein, Fiber, Omega-3 and all teaching content (functions, scenarios, swaps,
// labels, plate) are authored. Edit THIS file to update any game's content.
// ============================================================================
window.LIB = {
  NUTRIENTS: {
  "Vitamin A": {
    "dv": "900 mcg",
    "flag": null,
    "added": false,
    "does": "healthy eyes & clear vision"
  },
  "Vitamin C": {
    "dv": "90 mg",
    "flag": null,
    "added": false,
    "does": "heals cuts & fights germs"
  },
  "Vitamin D": {
    "dv": "20 mcg",
    "flag": "more",
    "added": false,
    "does": "strong bones (works with calcium)"
  },
  "Vitamin E": {
    "dv": "15 mg",
    "flag": null,
    "added": false,
    "does": "protects your cells"
  },
  "Vitamin K": {
    "dv": "120 mcg",
    "flag": null,
    "added": false,
    "does": "helps blood clot & bones"
  },
  "Vitamin B6": {
    "dv": "1.7 mg",
    "flag": null,
    "added": false,
    "does": "brain & makes red blood cells"
  },
  "Vitamin B12": {
    "dv": "2.4 mcg",
    "flag": null,
    "added": false,
    "does": "energy & red blood cells"
  },
  "Biotin": {
    "dv": "30 mcg",
    "flag": null,
    "added": false,
    "does": "turns food into energy"
  },
  "Choline": {
    "dv": "550 mg",
    "flag": null,
    "added": false,
    "does": "brain development"
  },
  "Folate": {
    "dv": "400 mcg",
    "flag": null,
    "added": false,
    "does": "makes new cells"
  },
  "Niacin (B3)": {
    "dv": "16 mg",
    "flag": null,
    "added": false,
    "does": "turns food into energy"
  },
  "Pantothenic acid (B5)": {
    "dv": "5 mg",
    "flag": null,
    "added": false,
    "does": "turns food into energy"
  },
  "Riboflavin (B2)": {
    "dv": "1.3 mg",
    "flag": null,
    "added": false,
    "does": "energy & growth"
  },
  "Thiamin (B1)": {
    "dv": "1.2 mg",
    "flag": null,
    "added": false,
    "does": "energy & nervous system"
  },
  "Calcium": {
    "dv": "1300 mg",
    "flag": "more",
    "added": false,
    "does": "strong bones & teeth"
  },
  "Iron": {
    "dv": "18 mg",
    "flag": "more",
    "added": false,
    "does": "carries oxygen in your blood"
  },
  "Potassium": {
    "dv": "4700 mg",
    "flag": "more",
    "added": false,
    "does": "muscles & heartbeat"
  },
  "Magnesium": {
    "dv": "420 mg",
    "flag": null,
    "added": false,
    "does": "muscles, nerves & energy"
  },
  "Zinc": {
    "dv": "11 mg",
    "flag": null,
    "added": false,
    "does": "immune system & healing"
  },
  "Phosphorus": {
    "dv": "1250 mg",
    "flag": null,
    "added": false,
    "does": "strong bones & energy"
  },
  "Copper": {
    "dv": "0.9 mg",
    "flag": null,
    "added": false,
    "does": "iron use & nerves"
  },
  "Manganese": {
    "dv": "2.3 mg",
    "flag": null,
    "added": false,
    "does": "bones & healing"
  },
  "Selenium": {
    "dv": "55 mcg",
    "flag": null,
    "added": false,
    "does": "protects cells & thyroid"
  },
  "Iodine": {
    "dv": "150 mcg",
    "flag": null,
    "added": false,
    "does": "thyroid & growth"
  },
  "Chromium": {
    "dv": "35 mcg",
    "flag": null,
    "added": false,
    "does": "helps use sugar for energy"
  },
  "Molybdenum": {
    "dv": "45 mcg",
    "flag": null,
    "added": false,
    "does": "helps enzymes work"
  },
  "Chloride": {
    "dv": "2300 mg",
    "flag": null,
    "added": false,
    "does": "fluid balance & digestion"
  },
  "Protein": {
    "dv": "50 g",
    "flag": null,
    "added": true,
    "does": "builds muscles & heals you"
  },
  "Fiber": {
    "dv": "28 g",
    "flag": "more",
    "added": true,
    "does": "healthy digestion, keeps you full"
  },
  "Omega-3": {
    "dv": "—",
    "flag": null,
    "added": true,
    "does": "brain & focus, healthy heart"
  }
},
  FOODS: [{"food":"Brazil nuts","emoji":"🌰","group":"protein","type":"whole","nutrients":[{"nutrient":"Selenium","tier":"good"}]},{"food":"Brussels sprouts","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Fiber","tier":"good"},{"nutrient":"Vitamin C","tier":"good"}]},{"food":"Swiss chard","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Vitamin K","tier":"good"}]},{"food":"almonds","emoji":"🍽️","group":"other","type":"whole","nutrients":[{"nutrient":"Fiber","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Vitamin E","tier":"good"}]},{"food":"apple","emoji":"🍎","group":"fruit","type":"whole","nutrients":[{"nutrient":"Chromium","tier":"good"},{"nutrient":"Fiber","tier":"good"}]},{"food":"apricots","emoji":"🍑","group":"fruit","type":"whole","nutrients":[{"nutrient":"Potassium","tier":"excellent"}]},{"food":"asparagus","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Folate","tier":"good"}]},{"food":"avocado","emoji":"🥑","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Biotin","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Folate","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"}]},{"food":"banana","emoji":"🍌","group":"fruit","type":"whole","nutrients":[{"nutrient":"Chromium","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Potassium","tier":"good"},{"nutrient":"Vitamin B6","tier":"good"}]},{"food":"beans","emoji":"🫘","group":"protein","type":"whole","nutrients":[{"nutrient":"Iron","tier":"excellent"},{"nutrient":"Potassium","tier":"excellent"},{"nutrient":"Choline","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Folate","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Manganese","tier":"good"},{"nutrient":"Molybdenum","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Thiamin (B1)","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"beef","emoji":"🥩","group":"protein","type":"whole","nutrients":[{"nutrient":"Chromium","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Riboflavin (B2)","tier":"good"},{"nutrient":"Selenium","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"beef liver","emoji":"🥩","group":"protein","type":"whole","nutrients":[{"nutrient":"Biotin","tier":"good"},{"nutrient":"Choline","tier":"good"},{"nutrient":"Copper","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"bell pepper","emoji":"🫑","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Vitamin C","tier":"good"}]},{"food":"bread","emoji":"🍞","group":"grain","type":"processed","nutrients":[{"nutrient":"Iodine","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Riboflavin (B2)","tier":"good"},{"nutrient":"Thiamin (B1)","tier":"good"}]},{"food":"broccoli","emoji":"🥦","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Calcium","tier":"good"},{"nutrient":"Choline","tier":"good"},{"nutrient":"Chromium","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Vitamin A","tier":"good"},{"nutrient":"Vitamin C","tier":"good"},{"nutrient":"Vitamin E","tier":"good"},{"nutrient":"Vitamin K","tier":"good"}]},{"food":"canned salmon","emoji":"🐟","group":"protein","type":"processed","nutrients":[{"nutrient":"Calcium","tier":"excellent"},{"nutrient":"Omega-3","tier":"good"}]},{"food":"cantaloupe","emoji":"🍈","group":"fruit","type":"whole","nutrients":[{"nutrient":"Potassium","tier":"good"},{"nutrient":"Vitamin A","tier":"good"},{"nutrient":"Vitamin C","tier":"good"}]},{"food":"carrot","emoji":"🥕","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Vitamin A","tier":"good"}]},{"food":"cauliflower","emoji":"🥦","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Biotin","tier":"good"},{"nutrient":"Choline","tier":"good"},{"nutrient":"Fiber","tier":"good"}]},{"food":"celery","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Chloride","tier":"good"}]},{"food":"cheese","emoji":"🧀","group":"dairy","type":"whole","nutrients":[{"nutrient":"Calcium","tier":"excellent"},{"nutrient":"Iodine","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Vitamin A","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"chicken","emoji":"🍗","group":"protein","type":"whole","nutrients":[{"nutrient":"Iron","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Riboflavin (B2)","tier":"good"},{"nutrient":"Selenium","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"chickpeas","emoji":"🫘","group":"protein","type":"whole","nutrients":[{"nutrient":"Fiber","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Vitamin B6","tier":"good"}]},{"food":"clams","emoji":"🦪","group":"protein","type":"whole","nutrients":[{"nutrient":"Iron","tier":"good"},{"nutrient":"Potassium","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"}]},{"food":"cod","emoji":"🐟","group":"protein","type":"whole","nutrients":[{"nutrient":"Choline","tier":"good"},{"nutrient":"Iodine","tier":"good"},{"nutrient":"Protein","tier":"good"}]},{"food":"collard greens","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Calcium","tier":"good"},{"nutrient":"Vitamin K","tier":"good"}]},{"food":"crab","emoji":"🦀","group":"protein","type":"whole","nutrients":[{"nutrient":"Copper","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"dark chocolate","emoji":"🍫","group":"other","type":"processed","nutrients":[{"nutrient":"Copper","tier":"good"}]},{"food":"egg","emoji":"🥚","group":"protein","type":"whole","nutrients":[{"nutrient":"Biotin","tier":"good"},{"nutrient":"Choline","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Riboflavin (B2)","tier":"good"},{"nutrient":"Selenium","tier":"good"},{"nutrient":"Vitamin A","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"flaxseed","emoji":"🌾","group":"protein","type":"whole","nutrients":[{"nutrient":"Omega-3","tier":"good"}]},{"food":"flounder","emoji":"🐟","group":"protein","type":"whole","nutrients":[{"nutrient":"Vitamin D","tier":"good"}]},{"food":"fortified cereal","emoji":"🥣","group":"grain","type":"processed","nutrients":[{"nutrient":"Iron","tier":"excellent"},{"nutrient":"Calcium","tier":"good"},{"nutrient":"Folate","tier":"good"},{"nutrient":"Vitamin A","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Vitamin D","tier":"good"},{"nutrient":"Vitamin E","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"fortified milk","emoji":"🥛","group":"dairy","type":"processed","nutrients":[{"nutrient":"Vitamin D","tier":"good"}]},{"food":"fortified orange juice","emoji":"🧃","group":"drink","type":"processed","nutrients":[{"nutrient":"Calcium","tier":"excellent"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"garlic","emoji":"🧄","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Chromium","tier":"good"}]},{"food":"grapefruit","emoji":"🍊","group":"fruit","type":"whole","nutrients":[{"nutrient":"Vitamin C","tier":"good"}]},{"food":"herring","emoji":"🐟","group":"protein","type":"whole","nutrients":[{"nutrient":"Omega-3","tier":"good"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"kale","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Calcium","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Folate","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Vitamin K","tier":"good"}]},{"food":"kiwi","emoji":"🥝","group":"fruit","type":"whole","nutrients":[{"nutrient":"Fiber","tier":"good"},{"nutrient":"Potassium","tier":"good"},{"nutrient":"Vitamin C","tier":"good"}]},{"food":"lemon","emoji":"🍋","group":"fruit","type":"whole","nutrients":[{"nutrient":"Vitamin C","tier":"good"}]},{"food":"lentils","emoji":"🫘","group":"protein","type":"whole","nutrients":[{"nutrient":"Copper","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Protein","tier":"good"}]},{"food":"lettuce","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Chloride","tier":"good"}]},{"food":"milk","emoji":"🥛","group":"dairy","type":"whole","nutrients":[{"nutrient":"Calcium","tier":"excellent"},{"nutrient":"Choline","tier":"good"},{"nutrient":"Iodine","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Potassium","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Riboflavin (B2)","tier":"good"},{"nutrient":"Vitamin A","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"mushrooms","emoji":"🍄","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Riboflavin (B2)","tier":"good"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"mustard greens","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Vitamin K","tier":"good"}]},{"food":"nuts","emoji":"🥜","group":"protein","type":"whole","nutrients":[{"nutrient":"Choline","tier":"good"},{"nutrient":"Copper","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Manganese","tier":"good"},{"nutrient":"Molybdenum","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Thiamin (B1)","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"oats","emoji":"🥣","group":"grain","type":"whole","nutrients":[{"nutrient":"Fiber","tier":"good"}]},{"food":"olives","emoji":"🫒","group":"other","type":"processed","nutrients":[{"nutrient":"Chloride","tier":"good"}]},{"food":"orange","emoji":"🍊","group":"fruit","type":"whole","nutrients":[{"nutrient":"Fiber","tier":"good"},{"nutrient":"Folate","tier":"good"},{"nutrient":"Potassium","tier":"good"},{"nutrient":"Vitamin C","tier":"good"}]},{"food":"orange juice","emoji":"🧃","group":"drink","type":"processed","nutrients":[{"nutrient":"Chromium","tier":"good"},{"nutrient":"Folate","tier":"good"},{"nutrient":"Vitamin C","tier":"good"}]},{"food":"oysters","emoji":"🦪","group":"protein","type":"whole","nutrients":[{"nutrient":"Iron","tier":"excellent"},{"nutrient":"Copper","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Riboflavin (B2)","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"pasta","emoji":"🍝","group":"grain","type":"processed","nutrients":[{"nutrient":"Selenium","tier":"good"}]},{"food":"peanut butter","emoji":"🥜","group":"protein","type":"processed","nutrients":[{"nutrient":"Protein","tier":"good"},{"nutrient":"Vitamin E","tier":"good"}]},{"food":"peanuts","emoji":"🥜","group":"protein","type":"whole","nutrients":[{"nutrient":"Protein","tier":"good"},{"nutrient":"Vitamin E","tier":"good"}]},{"food":"peas","emoji":"🟢","group":"protein","type":"whole","nutrients":[{"nutrient":"Choline","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Folate","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Molybdenum","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Thiamin (B1)","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"pineapple","emoji":"🍍","group":"fruit","type":"whole","nutrients":[{"nutrient":"Fiber","tier":"good"},{"nutrient":"Manganese","tier":"good"}]},{"food":"pork","emoji":"🥓","group":"protein","type":"whole","nutrients":[{"nutrient":"Biotin","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Thiamin (B1)","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"}]},{"food":"potato","emoji":"🥔","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Potassium","tier":"excellent"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Iodine","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Vitamin B6","tier":"good"}]},{"food":"pumpkin","emoji":"🎃","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Fiber","tier":"good"},{"nutrient":"Vitamin A","tier":"good"}]},{"food":"pumpkin seeds","emoji":"🎃","group":"protein","type":"whole","nutrients":[{"nutrient":"Magnesium","tier":"good"}]},{"food":"raisins","emoji":"🍇","group":"fruit","type":"processed","nutrients":[{"nutrient":"Magnesium","tier":"good"}]},{"food":"raspberries","emoji":"🫐","group":"fruit","type":"whole","nutrients":[{"nutrient":"Biotin","tier":"good"},{"nutrient":"Fiber","tier":"good"}]},{"food":"red pepper","emoji":"🌶️","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Vitamin A","tier":"good"}]},{"food":"rice","emoji":"🍚","group":"grain","type":"processed","nutrients":[{"nutrient":"Selenium","tier":"good"}]},{"food":"salmon","emoji":"🐟","group":"protein","type":"whole","nutrients":[{"nutrient":"Biotin","tier":"good"},{"nutrient":"Choline","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Omega-3","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Selenium","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Vitamin B6","tier":"good"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"sardines","emoji":"🐟","group":"protein","type":"whole","nutrients":[{"nutrient":"Calcium","tier":"excellent"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Omega-3","tier":"good"},{"nutrient":"Protein","tier":"good"}]},{"food":"seaweed","emoji":"🌿","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Chloride","tier":"good"},{"nutrient":"Iodine","tier":"good"}]},{"food":"shrimp","emoji":"🦐","group":"protein","type":"whole","nutrients":[{"nutrient":"Copper","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"soy milk","emoji":"🥛","group":"dairy","type":"processed","nutrients":[{"nutrient":"Calcium","tier":"good"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"soybeans","emoji":"🫛","group":"protein","type":"whole","nutrients":[{"nutrient":"Choline","tier":"good"},{"nutrient":"Protein","tier":"good"}]},{"food":"spinach","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Potassium","tier":"excellent"},{"nutrient":"Choline","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Folate","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Manganese","tier":"good"},{"nutrient":"Riboflavin (B2)","tier":"good"},{"nutrient":"Vitamin A","tier":"good"},{"nutrient":"Vitamin E","tier":"good"},{"nutrient":"Vitamin K","tier":"good"}]},{"food":"strawberries","emoji":"🍓","group":"fruit","type":"whole","nutrients":[{"nutrient":"Vitamin C","tier":"good"}]},{"food":"sunflower seeds","emoji":"🌻","group":"protein","type":"whole","nutrients":[{"nutrient":"Copper","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Selenium","tier":"good"},{"nutrient":"Thiamin (B1)","tier":"good"},{"nutrient":"Vitamin E","tier":"good"}]},{"food":"sweet potato","emoji":"🍠","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Potassium","tier":"excellent"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Manganese","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Vitamin A","tier":"good"}]},{"food":"tofu","emoji":"⬜","group":"protein","type":"whole","nutrients":[{"nutrient":"Calcium","tier":"excellent"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Protein","tier":"good"}]},{"food":"tomato","emoji":"🍅","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Chloride","tier":"good"},{"nutrient":"Potassium","tier":"good"},{"nutrient":"Vitamin C","tier":"good"}]},{"food":"trout","emoji":"🐟","group":"protein","type":"whole","nutrients":[{"nutrient":"Omega-3","tier":"good"},{"nutrient":"Potassium","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"tuna","emoji":"🐟","group":"protein","type":"whole","nutrients":[{"nutrient":"Iodine","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Omega-3","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Selenium","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Vitamin B6","tier":"good"},{"nutrient":"Vitamin D","tier":"good"}]},{"food":"turkey","emoji":"🦃","group":"protein","type":"whole","nutrients":[{"nutrient":"Chromium","tier":"good"},{"nutrient":"Iodine","tier":"good"},{"nutrient":"Iron","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Selenium","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"turnip greens","emoji":"🥬","group":"vegetable","type":"whole","nutrients":[{"nutrient":"Vitamin K","tier":"good"}]},{"food":"vegetable oil","emoji":"🫗","group":"other","type":"processed","nutrients":[{"nutrient":"Vitamin E","tier":"good"}]},{"food":"walnuts","emoji":"🌰","group":"protein","type":"whole","nutrients":[{"nutrient":"Omega-3","tier":"good"}]},{"food":"whole grains","emoji":"🌾","group":"grain","type":"whole","nutrients":[{"nutrient":"Biotin","tier":"good"},{"nutrient":"Chromium","tier":"good"},{"nutrient":"Copper","tier":"good"},{"nutrient":"Fiber","tier":"good"},{"nutrient":"Magnesium","tier":"good"},{"nutrient":"Manganese","tier":"good"},{"nutrient":"Molybdenum","tier":"good"},{"nutrient":"Niacin (B3)","tier":"good"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Phosphorus","tier":"good"},{"nutrient":"Selenium","tier":"good"},{"nutrient":"Thiamin (B1)","tier":"good"},{"nutrient":"Zinc","tier":"good"}]},{"food":"yogurt","emoji":"🥛","group":"dairy","type":"whole","nutrients":[{"nutrient":"Calcium","tier":"excellent"},{"nutrient":"Pantothenic acid (B5)","tier":"good"},{"nutrient":"Protein","tier":"good"},{"nutrient":"Vitamin B12","tier":"good"}]}],
  FUNCTIONS: [{"fn":"Strong bones & teeth","emoji":"🦴","nutrients":["Calcium","Vitamin D","Phosphorus","Vitamin K","Magnesium"]},{"fn":"Carry oxygen in your blood","emoji":"🩸","nutrients":["Iron"]},{"fn":"Heal a cut","emoji":"🩹","nutrients":["Protein","Vitamin C","Zinc"]},{"fn":"Good eyesight","emoji":"👁️","nutrients":["Vitamin A"]},{"fn":"Fight off germs","emoji":"🛡️","nutrients":["Vitamin C","Vitamin A","Vitamin D","Zinc","Vitamin E"]},{"fn":"Turn food into energy","emoji":"⚡","nutrients":["Thiamin (B1)","Riboflavin (B2)","Niacin (B3)","Pantothenic acid (B5)","Biotin","Iron"]},{"fn":"Strong muscles","emoji":"💪","nutrients":["Protein","Potassium","Magnesium"]},{"fn":"Steady heartbeat","emoji":"❤️","nutrients":["Potassium","Magnesium","Calcium"]},{"fn":"Brain & focus","emoji":"🧠","nutrients":["Omega-3","Choline","Iron","Vitamin B12"]},{"fn":"Healthy skin","emoji":"✨","nutrients":["Vitamin A","Vitamin C","Vitamin E","Biotin"]},{"fn":"Stop bleeding (clotting)","emoji":"🩸","nutrients":["Vitamin K","Calcium"]},{"fn":"Healthy digestion","emoji":"🚽","nutrients":["Fiber"]},{"fn":"Build red blood cells","emoji":"🔴","nutrients":["Iron","Vitamin B12","Folate","Vitamin B6","Copper"]},{"fn":"Grow big & strong","emoji":"📏","nutrients":["Protein","Vitamin A","Zinc","Vitamin D"]}],
  SCENARIOS: [{"level":1,"prompt":"You're thirsty after playing outside in the sun.","why":"Water refills what you sweat out — no sugar needed.","options":[{"label":"Water","emoji":"💧","correct":true},{"label":"Soda","emoji":"🥤"},{"label":"Candy","emoji":"🍬"}]},{"level":1,"prompt":"You want a snack that helps you grow strong muscles.","why":"Eggs are packed with protein, the muscle builder.","options":[{"label":"Egg","emoji":"🥚","correct":true},{"label":"Lollipop","emoji":"🍭"},{"label":"Chips","emoji":"🍟"}]},{"level":1,"prompt":"You need energy that lasts all morning at school.","why":"Oatmeal has fiber, so energy comes slow and steady.","options":[{"label":"Oatmeal","emoji":"🥣","correct":true},{"label":"Donut","emoji":"🍩"},{"label":"Candy","emoji":"🍬"}]},{"level":1,"prompt":"Which drink is best for your teeth?","why":"Milk has calcium for strong teeth — soda can cause cavities.","options":[{"label":"Milk","emoji":"🥛","correct":true},{"label":"Soda","emoji":"🥤"},{"label":"Juice pouch","emoji":"🧃"}]},{"level":2,"prompt":"You have a big test and want to help your brain focus.","why":"Fish, nuts and berries feed your brain (omega-3!).","options":[{"label":"Salmon","emoji":"🐟","correct":true},{"label":"Blueberries","emoji":"🫐","correct":true},{"label":"Walnuts","emoji":"🌰","correct":true},{"label":"Cookies","emoji":"🍪"}]},{"level":2,"prompt":"You scraped your knee — which foods help it heal?","why":"Protein rebuilds skin; vitamin C helps make new tissue.","options":[{"label":"Chicken","emoji":"🍗","correct":true},{"label":"Orange","emoji":"🍊","correct":true},{"label":"Soda","emoji":"🥤"},{"label":"Fries","emoji":"🍟"}]},{"level":2,"prompt":"You feel tired and pale — which food gives iron?","why":"Spinach and beans are full of iron to carry oxygen.","options":[{"label":"Spinach","emoji":"🥬","correct":true},{"label":"Beans","emoji":"🫘","correct":true},{"label":"Gummy bears","emoji":"🐻"}]},{"level":2,"prompt":"You want a snack to stay full until dinner.","why":"Fiber in apples and nuts keeps your tummy satisfied.","options":[{"label":"Apple","emoji":"🍎","correct":true},{"label":"Almonds","emoji":"🥜","correct":true},{"label":"Candy","emoji":"🍬"}]},{"level":3,"prompt":"You're building muscle for soccer season — pick the best plate.","why":"Chicken, beans and eggs all deliver muscle-building protein.","options":[{"label":"Chicken","emoji":"🍗","correct":true},{"label":"Beans","emoji":"🫘","correct":true},{"label":"Egg","emoji":"🥚","correct":true},{"label":"Soda","emoji":"🥤"}]},{"level":3,"prompt":"It's cold season — which foods help your immune system?","why":"Vitamin C and zinc power your germ-fighting defenses.","options":[{"label":"Orange","emoji":"🍊","correct":true},{"label":"Bell pepper","emoji":"🫑","correct":true},{"label":"Pumpkin seeds","emoji":"🎃","correct":true},{"label":"Ice cream","emoji":"🍦"}]},{"level":3,"prompt":"You want strong bones for growing tall.","why":"Calcium + vitamin D team up to build bone.","options":[{"label":"Milk","emoji":"🥛","correct":true},{"label":"Yogurt","emoji":"🥛","correct":true},{"label":"Salmon","emoji":"🐟","correct":true},{"label":"Chips","emoji":"🍟"}]},{"level":3,"prompt":"You need quick hydration AND a little natural sugar mid-game.","why":"Watermelon is mostly water with natural sugar — better than soda.","options":[{"label":"Watermelon","emoji":"🍉","correct":true},{"label":"Water","emoji":"💧","correct":true},{"label":"Energy drink","emoji":"⚡"}]}],
  SWAPS: [{"better":{"label":"Water","emoji":"💧"},"worse":{"label":"Soda","emoji":"🥤"},"why":"Soda has lots of added sugar and no nutrients."},{"better":{"label":"Whole-grain bread","emoji":"🍞"},"worse":{"label":"White bread","emoji":"🍞"},"why":"Whole grains keep the fiber that white bread loses."},{"better":{"label":"Baked potato","emoji":"🥔"},"worse":{"label":"French fries","emoji":"🍟"},"why":"Baking skips the fried oil and extra salt."},{"better":{"label":"Whole apple","emoji":"🍎"},"worse":{"label":"Apple juice","emoji":"🧃"},"why":"The whole apple keeps the fiber; juice is mostly sugar."},{"better":{"label":"Greek yogurt","emoji":"🥛"},"worse":{"label":"Ice cream","emoji":"🍦"},"why":"Yogurt has protein and calcium with less sugar."},{"better":{"label":"Nuts","emoji":"🥜"},"worse":{"label":"Chips","emoji":"🍟"},"why":"Nuts add protein and healthy fat instead of just salt."},{"better":{"label":"Grilled chicken","emoji":"🍗"},"worse":{"label":"Chicken nuggets","emoji":"🍗"},"why":"Grilling skips the fried, salty coating."},{"better":{"label":"Orange","emoji":"🍊"},"worse":{"label":"Orange soda","emoji":"🥤"},"why":"A real orange has vitamin C and fiber, not just sugar."},{"better":{"label":"Popcorn (plain)","emoji":"🍿"},"worse":{"label":"Candy","emoji":"🍬"},"why":"Air-popped popcorn is a whole grain with fiber."},{"better":{"label":"Milk","emoji":"🥛"},"worse":{"label":"Energy drink","emoji":"⚡"},"why":"Milk builds bones; energy drinks add sugar and caffeine."},{"better":{"label":"Brown rice","emoji":"🍚"},"worse":{"label":"White rice","emoji":"🍚"},"why":"Brown rice keeps its fiber and minerals."},{"better":{"label":"Frozen berries","emoji":"🫐"},"worse":{"label":"Fruit gummies","emoji":"🐻"},"why":"Real berries have vitamins; gummies are mostly sugar."},{"better":{"label":"Oatmeal","emoji":"🥣"},"worse":{"label":"Sugary cereal","emoji":"🥣"},"why":"Oatmeal has fiber and far less added sugar."},{"better":{"label":"Cheese stick","emoji":"🧀"},"worse":{"label":"Candy bar","emoji":"🍫"},"why":"Cheese gives protein and calcium instead of just sugar."}],
  SUGAR_ALIASES: ["sugar","high-fructose corn syrup","corn syrup","cane sugar","dextrose","sucrose","fructose","glucose","honey","molasses","fruit juice concentrate","maltose","brown sugar","evaporated cane juice","agave nectar"],
  LABELS: [{"name":"Crunchy O’s Cereal","emoji":"🥣","servingSize":"1 cup (40g)","servingsPerContainer":9,"calories":150,"sugarG":12,"fiberG":2,"ingredients":["Whole grain oats","Sugar","Corn syrup","Salt","Honey","Natural flavor"],"questions":[{"q":"What is one serving size?","choices":["1 cup","The whole box","9 cups"],"answer":0,"explain":"The label says 1 cup (40g) is one serving."},{"q":"How many servings are in the whole box?","choices":["1","9","40"],"answer":1,"explain":"Servings per container = 9, so the box has 9 servings."},{"q":"How many sugar names hide in the ingredients?","choices":["1","2","3"],"answer":2,"explain":"Sugar, Corn syrup, and Honey are all added sugars — that's 3!"}]},{"name":"Berry Fruit Snacks","emoji":"🐻","servingSize":"1 pouch (26g)","servingsPerContainer":10,"calories":80,"sugarG":11,"fiberG":0,"ingredients":["Corn syrup","Sugar","Fruit juice concentrate","Gelatin","Citric acid","Red 40"],"questions":[{"q":"How much sugar is in ONE pouch?","choices":["0g","11g","80g"],"answer":1,"explain":"Each pouch has 11g of sugar — most of the pouch!"},{"q":"How many hidden sugars are in the ingredients?","choices":["1","2","3"],"answer":2,"explain":"Corn syrup, Sugar, and Fruit juice concentrate are all sugar."},{"q":"Is this a good source of fiber?","choices":["Yes","No"],"answer":1,"explain":"Fiber is 0g — these are basically candy."}]},{"name":"Plain Greek Yogurt","emoji":"🥛","servingSize":"1 container (170g)","servingsPerContainer":1,"calories":100,"sugarG":6,"fiberG":0,"ingredients":["Cultured pasteurized milk","Live active cultures"],"questions":[{"q":"How many added sugars are in the ingredients?","choices":["0","2","5"],"answer":0,"explain":"None! The 6g of sugar is natural milk sugar — no sugar added."},{"q":"How many servings in the container?","choices":["1","6","170"],"answer":0,"explain":"Servings per container = 1. The whole cup is one serving."}]},{"name":"Whole Wheat Bread","emoji":"🍞","servingSize":"1 slice (28g)","servingsPerContainer":20,"calories":80,"sugarG":2,"fiberG":3,"ingredients":["Whole wheat flour","Water","Yeast","Salt"],"questions":[{"q":"How many hidden sugars are in the ingredients?","choices":["0","1","3"],"answer":0,"explain":"None — just whole wheat, water, yeast, and salt."},{"q":"Is this a good source of fiber?","choices":["Yes","No"],"answer":0,"explain":"3g of fiber per slice — whole wheat keeps its fiber."}]}],
  PLATE: {"targets":{"vegetable":0.3,"fruit":0.2,"grain":0.25,"protein":0.25},"drink":"dairy","note":"Aim for about half your plate fruits & veggies, a quarter grains, a quarter protein, plus a drink."}
};
