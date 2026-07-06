/* Startup Studio — content data. Middle-school+ business & entrepreneurship.
 * Centerpiece = "Run It" tycoon sim. Four support games + a dictionary.
 *   RUN IT       → run a startup over 7 days: buy stock, set price, market, profit
 *   PROFIT/LOSS  → the money math: Profit = Revenue − Costs
 *   PRICE IT     → pricing & markup decisions
 *   WHO DOES WHAT→ sort tasks into company departments
 *   BOSS MOVES   → strategy: smart calls when things go sideways
 */
window.BIZ = {

  SOURCES: [
    { key:'investopedia', name:'Investopedia — Business Essentials',
      url:'https://www.investopedia.com/business-essentials-4689820',
      note:'Plain-English definitions of every business term in this app — revenue, profit, margin, cash flow and more.' },
    { key:'ja', name:'Junior Achievement (JA)',
      url:'https://jausa.ja.org/',
      note:'The classic K-12 program that teaches kids entrepreneurship, work readiness and financial literacy.' },
    { key:'sba', name:'U.S. Small Business Administration (SBA)',
      url:'https://www.sba.gov/business-guide',
      note:'The official U.S. guide to starting and running a real business — pricing, funding, hiring and operations.' },
    { key:'khan', name:'Khan Academy — Entrepreneurship',
      url:'https://www.khanacademy.org/college-careers-more/entrepreneurship2',
      note:'Free video lessons and interviews with real founders about starting a company.' }
  ],

  /* ───────── Startup Dictionary (popup + used in reveals) ───────── */
  TERMS: [
    { term:'Revenue', def:'All the money a business takes IN from selling things — before any costs are subtracted.', ex:'Sell 50 smoothies at $5 each → $250 revenue.', simple:'Every dollar that goes into the cash register from sales, before you pay for anything. It is NOT your profit — it is the "top line" you start from.' },
    { term:'Cost (Expense)', def:'Money a business spends to operate — supplies, rent, ads, wages.', ex:'Fruit, cups, and cart rent are all costs.', simple:'Any money that leaves your pocket to keep the business going. If you have to pay for it, it is a cost.' },
    { term:'Profit', def:'What’s left after you subtract costs from revenue. Profit = Revenue − Costs.', ex:'$250 revenue − $110 costs = $140 profit.', simple:'The money you actually get to KEEP after paying for everything. This is the whole point — a business that never makes a profit eventually shuts down.' },
    { term:'Loss', def:'When costs are bigger than revenue — the business lost money that day.', ex:'$80 revenue − $120 costs = −$40 (a loss).', simple:'The opposite of profit — you spent more than you brought in, so you ended the day in the hole.' },
    { term:'Fixed Cost', def:'A cost that stays the same no matter how much you sell.', ex:'Rent is $20 a day whether you sell 1 smoothie or 100.', simple:'A bill you owe no matter what. It does not care if you had your best day ever or sold nothing — it is the same either way.' },
    { term:'Variable Cost', def:'A cost that changes with how much you make or sell.', ex:'Each extra smoothie needs more fruit — a variable cost.', simple:'A cost that grows the more you sell. Sell twice as many smoothies and you buy twice as much fruit.' },
    { term:'Markup', def:'How much you add on top of what an item cost you, to make a profit.', ex:'A shirt costs you $8; you sell it for $20 — a $12 markup.', simple:'The extra you add on top of what something cost YOU, so you come out ahead when a customer buys it.' },
    { term:'Profit Margin', def:'The share of the price that is profit, shown as a percent.', ex:'$5 smoothie with $2 cost → $3 profit = 60% margin.', simple:'Out of every $1 a customer hands you, how many cents you actually keep. A 60% margin means 60¢ of each dollar is profit.' },
    { term:'Supply & Demand', def:'Demand = how much people want it. Supply = how much is available. Together they push prices up or down.', ex:'Heat wave = high demand for cold smoothies → you can charge more.', simple:'When lots of people want something and there is not much of it, the price goes UP. When nobody wants it or there is tons of it, the price goes DOWN.' },
    { term:'Inventory (Stock)', def:'The products or supplies a business has on hand to sell.', ex:'Buying 40 smoothies’ worth of fruit is your inventory.', simple:'The stuff you have ready to sell. Too little and you run out and miss sales; too much and it might spoil or sit there tying up your cash.' },
    { term:'Cash Flow', def:'The money moving in and out of a business. Run out of cash and you’re stuck — even if you’re profitable on paper.', ex:'Spend all your cash on stock and you can’t pay rent.', simple:'Whether you actually have money in hand right when you need it. You can look successful on paper and still be stuck if the cash is not there yet to pay a bill.' },
    { term:'Break-even', def:'The point where revenue exactly equals costs — no profit, no loss.', ex:'You break even the moment sales cover all your costs.', simple:'The moment your sales have paid back exactly what you spent — not up, not down, just even. Every sale after that starts making real profit.' },
    { term:'Marketing', def:'Everything you do to get people to notice and want your product.', ex:'Posting on social media or handing out flyers.', simple:'Getting the word out so people even know you exist and want what you are selling. The best product still fails if nobody hears about it.' },
    { term:'Brand', def:'The personality, name and look people recognize and trust.', ex:'The logo, colors and vibe that make your shop feel like YOU.', simple:'The reputation and vibe people picture when they hear your name — the reason someone trusts one company over another before they even try it.' },
    { term:'Target Market', def:'The specific group of people most likely to buy from you.', ex:'Thirsty park-goers on a hot day are a smoothie cart’s target market.', simple:'The exact type of person you are trying to reach, instead of wasting time and money trying to sell to literally everyone.' },
    { term:'Competitor', def:'Another business trying to win the same customers as you.', ex:'The other smoothie stand across the park.', simple:'Someone else going after the same customers and the same money you want. You have to give people a reason to pick you over them.' },
    { term:'Investor', def:'Someone who gives a business money now, hoping to earn more back later — often for part-ownership.', ex:'An investor gives $500 for 20% of your company.', simple:'A person who chips in money now, betting your business will grow so they get more back later — usually in exchange for owning a slice of it.' },
    { term:'ROI (Return on Investment)', def:'How much you get back compared to what you spent. Higher is better.', ex:'Spend $10 on ads, earn $40 extra → a great ROI.', simple:'For every dollar you put in, how many come back out. Spend a little and get a lot back = a smart move; spend a lot for barely anything = a bad one.' },
    { term:'Wholesale vs Retail', def:'Wholesale = buying in bulk cheaply; retail = selling one-at-a-time to shoppers for more.', ex:'Buy shirts wholesale at $8, sell retail at $20.', simple:'Buy cheap in big batches (wholesale), then sell them one at a time for more (retail). The gap between the two prices is where your profit comes from.' },
    { term:'Customer', def:'The person who buys your product. Keeping them happy = repeat business.', ex:'A happy customer tells friends and comes back.', simple:'The person actually paying you. Treat them well and they come back AND bring friends — that is way cheaper than finding new customers every time.' }
  ],

  /* ───────── GAME 1 · RUN IT (tycoon sim) ─────────
   * Pick a startup, then run 7 days. Each day: react to a market event,
   * buy stock, set a price, spend on ads, then open for business. */
  SIM: {
    days: 7,
    startups: [
      { id:'smoothie', name:'Smoothie Cart', emoji:'🥤',
        blurb:'Fresh smoothies at the park. Cheap to make and sells in big numbers — but leftover fruit spoils, so don’t overstock!',
        unitCost:2, sugPrice:5, baseDemand:40, rent:20, startCash:120, mkScale:30, unit:'smoothie' },
      { id:'shirts', name:'Custom T-Shirt Brand', emoji:'👕',
        blurb:'Cool custom tees. Bigger profit on each sale, but you sell fewer per day. A middle-of-the-road business.',
        unitCost:8, sugPrice:20, baseDemand:14, rent:10, startCash:220, mkScale:35, unit:'shirt' },
      { id:'sneakers', name:'Sneaker Resale', emoji:'👟',
        blurb:'Buy limited sneakers and resell for more. Huge money per sale — but each pair is expensive, so mistakes hurt.',
        unitCost:60, sugPrice:100, baseDemand:6, rent:15, startCash:650, mkScale:45, unit:'pair' }
    ],
    /* Market events shown BEFORE you decide, so you can react.
     * dmd = demand multiplier; costMul = temporary unit-cost multiplier. */
    events: [
      { icon:'☀️', text:'Heat wave! Everyone’s hot and thirsty today.', dmd:1.45, tip:'Great day to stock up — and maybe nudge the price up.' },
      { icon:'📱', text:'A local influencer posted about you overnight!', dmd:1.6, tip:'Demand is way up. Make sure you have enough stock.' },
      { icon:'🎪', text:'A street festival brought big crowds to town.', dmd:1.35, tip:'Lots of foot traffic — buy extra inventory.' },
      { icon:'🎉', text:'It’s payday — people have money to spend.', dmd:1.2, tip:'Shoppers are less picky about price today.' },
      { icon:'🙂', text:'A normal, steady day.', dmd:1.0, tip:'Nothing special — play it balanced.' },
      { icon:'😴', text:'A slow, quiet day. Not many people out.', dmd:0.8, tip:'Don’t overbuy — you may not sell much.' },
      { icon:'🥊', text:'A competitor set up shop right next to you.', dmd:0.7, tip:'A lower price or some ads can win customers back.' },
      { icon:'🌧️', text:'Cold and rainy all day.', dmd:0.6, tip:'Demand is low. Buy less so nothing goes to waste.' },
      { icon:'💸', text:'Your supplier raised prices today.', dmd:1.0, costMul:1.5, tip:'Each unit costs more today — watch your profit.' }
    ]
  },

  /* ───────── GAME 2 · PROFIT OR LOSS? (money math) ─────────
   * Profit = Revenue − Costs. Pick the right amount (some are losses). */
  PROFITLOSS: [
    { biz:'🥤 Smoothie cart', rev:250, cost:110,
      why:'Profit = Revenue − Costs = $250 − $110 = $140. Costs were smaller than revenue, so it’s a profit.' },
    { biz:'👕 T-shirt drop', rev:240, cost:300,
      why:'Revenue − Costs = $240 − $300 = −$60. Costs were bigger than revenue, so the business took a $60 loss.' },
    { biz:'👟 Sneaker resale', rev:600, cost:420,
      why:'Profit = $600 − $420 = $180. A healthy profit — but notice how big the costs are in this business.' },
    { biz:'🍪 Bake sale', rev:95, cost:95,
      why:'Revenue − Costs = $95 − $95 = $0. That’s the break-even point: no profit, but no loss either.' },
    { biz:'🎨 Sticker shop', rev:180, cost:65,
      why:'Profit = $180 − $65 = $115. Low costs plus solid sales makes a strong profit.' },
    { biz:'🚲 Bike repair stand', rev:140, cost:210,
      why:'Revenue − Costs = $140 − $210 = −$70 (a loss). Spending more than you earn can’t last long.' },
    { biz:'🧁 Cupcake stand', rev:320, cost:185,
      why:'Profit = $320 − $185 = $135. Remember: revenue is ALL money in; profit is what’s left after costs.' },
    { biz:'🎮 Game reselling', rev:450, cost:450,
      why:'$450 − $450 = $0 — exactly break-even. You covered your costs but made nothing extra.' },
    { biz:'🌸 Flower cart', rev:210, cost:130,
      why:'Profit = $210 − $130 = $80. A nice profit on a small business.' },
    { biz:'📸 Photo booth', rev:160, cost:240,
      why:'Revenue − Costs = $160 − $240 = −$80 (a loss). The booth rental cost more than it brought in.' }
  ],

  /* ───────── GAME 3 · PRICE IT RIGHT (pricing decisions) ───────── */
  PRICING: [
    { q:'Each friendship bracelet costs you $3 in string and beads. What’s a smart selling price?',
      correct:'$8', distractors:['$2','$3','$40'],
      why:'You must sell ABOVE your $3 cost to make a profit, but not so high people won’t buy. $8 gives a fair $5 profit. $2 is a loss, $3 just breaks even, and $40 is way too high for a bracelet.' },
    { q:'You buy sneakers for $60 a pair and want a 50% markup. What price should you set?',
      correct:'$90', distractors:['$30','$60','$120'],
      why:'A 50% markup means adding half of the cost: $60 + (50% of $60 = $30) = $90. $120 would be a 100% markup.' },
    { q:'It’s almost closing time and you still have lots of smoothies that spoil tonight. What’s the smart move?',
      correct:'Put them on sale to sell as many as you can', distractors:['Raise the price to make more','Do nothing and toss the leftovers','Buy even more smoothies'],
      why:'Perishable stock is worth $0 tomorrow. A discount turns "about to be wasted" into real money. Selling at a lower price beats selling nothing.' },
    { q:'A competitor sells the exact same shirt as you for $20. You price yours at $35. What likely happens?',
      correct:'Most shoppers buy the cheaper one', distractors:['Everyone pays more for yours','Nothing changes','You instantly sell out'],
      why:'If two products are identical, price wins. To charge more, you’d need to be different or better in some way (better design, brand, or service).' },
    { q:'Your smoothies cost $2 to make. A customer offers to buy 10 if you sell them for $1.50 each. Should you?',
      correct:'No — you’d lose money on every one', distractors:['Yes — a sale is always good','Yes — 10 sales is a lot','Yes — to beat competitors'],
      why:'Selling below your $2 cost means losing 50¢ per smoothie — $5 lost on the deal. Volume doesn’t help if every sale loses money.' },
    { q:'Demand for your product is HUGE and you’re almost sold out. What can you do?',
      correct:'Raise the price a bit — people still want it', distractors:['Cut the price in half','Give the rest away','Close early'],
      why:'When demand is high and supply is low, you can charge more. That’s supply and demand — scarcity lets you raise the price.' },
    { q:'You want customers to feel your brand is fancy and high-quality. Which pricing fits?',
      correct:'A higher "premium" price', distractors:['The lowest price possible','Below your cost','A random price each day'],
      why:'Premium pricing signals quality — think designer brands. A rock-bottom price can make people think "cheap." Price is part of your brand image.' },
    { q:'What does it mean to sell something "at cost"?',
      correct:'Selling for exactly what it cost you — no profit', distractors:['Selling for double','Selling at a loss on purpose','Selling the most expensive way'],
      why:'"At cost" means price = cost, so you break even. Stores sometimes do this on a few items to attract customers who then buy other things.' },
    { q:'You raise your smoothie price from $5 to $10. What most likely happens to how many you sell?',
      correct:'You sell fewer of them', distractors:['You sell exactly the same','You sell way more','Sales don’t depend on price'],
      why:'Usually, higher price → lower demand. The trick is finding the price where price × quantity gives you the MOST total profit.' },
    { q:'Your product costs $4 and you sell it for $10. What’s your profit per item (your margin)?',
      correct:'$6', distractors:['$4','$10','$14'],
      why:'Profit per item = price − cost = $10 − $4 = $6. That $6 is your margin on every single sale.' }
  ],

  /* ───────── GAME 4 · WHO DOES WHAT? (departments) ───────── */
  DEPARTMENTS: {
    Marketing:{ icon:'📣', desc:'Gets people to notice and want your product — ads, social media, branding.' },
    Sales:{ icon:'🤝', desc:'Actually closes deals and convinces customers or stores to buy.' },
    Finance:{ icon:'💰', desc:'Handles the money — tracking profit, paying bills, budgeting, taxes.' },
    Operations:{ icon:'⚙️', desc:'Makes the day-to-day run — producing, stocking, and shipping products.' },
    'Human Resources':{ icon:'🧑‍🤝‍🧑', desc:'Takes care of the people — hiring, training and supporting the team.' },
    'Customer Service':{ icon:'🎧', desc:'Helps customers after the sale — questions, problems, refunds.' },
    'Product / R&D':{ icon:'🔧', desc:'Designs and improves the product itself and invents new ones.' }
  },
  DEPT_ITEMS: [
    { task:'Designing an eye-catching ad for Instagram', dept:'Marketing' },
    { task:'Tracking the company’s profit and paying taxes', dept:'Finance' },
    { task:'Interviewing and hiring a new employee', dept:'Human Resources' },
    { task:'Replying to an upset customer’s email', dept:'Customer Service' },
    { task:'Making sure orders get packed and shipped on time', dept:'Operations' },
    { task:'Convincing a big store to carry your product', dept:'Sales' },
    { task:'Inventing a new flavor or product feature', dept:'Product / R&D' },
    { task:'Choosing the company logo and colors', dept:'Marketing' },
    { task:'Creating a budget for next month', dept:'Finance' },
    { task:'Training the team on how to use new equipment', dept:'Human Resources' },
    { task:'Restocking the shelves and managing inventory', dept:'Operations' },
    { task:'Giving a refund to fix a customer’s bad experience', dept:'Customer Service' },
    { task:'Cold-calling shops to set up sales meetings', dept:'Sales' },
    { task:'Running tests to improve the product’s design', dept:'Product / R&D' },
    { task:'Deciding whether the company can afford a new machine', dept:'Finance' },
    { task:'Writing a catchy slogan for a new campaign', dept:'Marketing' }
  ],

  /* ───────── GAME 5 · BOSS MOVES (strategy) ───────── */
  STRATEGY: [
    { q:'A new competitor opens across the street and undercuts your price. What’s the smartest first move?',
      correct:'Find a way to stand out — better quality, service, or brand', distractors:['Drop your price to $0 to crush them','Ignore it completely','Immediately shut down'],
      why:'You don’t have to win on price alone. Being different or better (great service, unique product, strong brand) keeps loyal customers even if someone is cheaper. A race to $0 bankrupts everyone.' },
    { q:'Your product suddenly goes viral and you keep selling out by noon. What should you do?',
      correct:'Buy more inventory so you stop missing sales', distractors:['Keep stock the same and turn people away','Stop advertising','Lower the price'],
      why:'Selling out means lost sales — money left on the table. When demand jumps, scaling up your inventory (and maybe price) captures it. Just don’t overbuild for a fad that might fade.' },
    { q:'Your only supplier suddenly can’t deliver. What’s the wise thing to have or find?',
      correct:'A backup supplier', distractors:['Nothing — just wait months','One more of the same supplier','A bigger sign out front'],
      why:'Relying on a single supplier is risky. A backup keeps you running when one fails. Smart businesses avoid single points of failure.' },
    { q:'Sales are slow and you’re not sure why. What’s the best move?',
      correct:'Ask customers for honest feedback', distractors:['Blame the customers','Guess randomly and hope','Raise prices to make up for it'],
      why:'Customers will tell you what’s wrong — price, product, or awareness — if you ask. Feedback beats guessing, and fixing the real problem beats hoping.' },
    { q:'One giant customer makes up almost all your sales. Why is that risky?',
      correct:'If they leave, you lose almost everything at once', distractors:['It isn’t risky at all','Big customers never leave','You’ll pay less tax'],
      why:'Depending on one customer is fragile — if they walk, your business could collapse. Spreading sales across many customers is much safer.' },
    { q:'You’re low on cash but have three "nice-to-have" expenses. What should you do first?',
      correct:'Cut the expenses you don’t really need', distractors:['Spend more to look successful','Ignore it and hope for sales','Buy a fancy office'],
      why:'When cash is tight, protect it. Cutting non-essential costs keeps you alive long enough to earn revenue. Running out of cash ends a business even if it’s profitable on paper.' },
    { q:'An investor offers $1,000 now in exchange for owning 40% of your company. What’s the real trade-off?',
      correct:'You get cash now but give up part of future profits and control', distractors:['It’s free money with no downside','You have to pay it back double tomorrow','You lose your product'],
      why:'Investment isn’t free — you trade a share of ownership (and future profits and say) for money now. Sometimes worth it to grow fast; sometimes better to keep 100% and grow slower.' },
    { q:'A customer had a bad experience and complained. Handled well, this can become…',
      correct:'A loyal fan who tells others', distractors:['A guaranteed lawsuit','Nothing worth your time','An automatic refund of everything'],
      why:'A well-fixed problem often makes customers MORE loyal than if nothing went wrong. Great customer service turns complaints into word-of-mouth marketing.' },
    { q:'You have a great month and make big profit. What’s a smart use of some of it?',
      correct:'Reinvest some back into the business to grow', distractors:['Spend all of it immediately','Hide it and never use it','Stop selling'],
      why:'Reinvesting profit — more inventory, better tools, marketing — helps a business grow. Spending every dollar the moment you earn it leaves nothing for the next opportunity or a rainy day.' },
    { q:'Two products cost you the same to make. One sells for a $2 profit, the other for a $9 profit, and both sell equally well. Which should you push?',
      correct:'The $9-profit product', distractors:['The $2-profit product','Neither','Whichever is cheaper to buy'],
      why:'Same cost and same demand, but far more profit per sale — focus your effort where the margin is bigger. That’s working smarter, not harder.' }
  ]
};
