/* Budget Boss — content data. Personal / household budgeting for middle-school+.
 * Centerpiece = "Budget Builder" sim. Four support games + a money dictionary.
 *   BUDGET BUILDER → split a monthly paycheck across categories, survive surprises, save
 *   NEED OR WANT   → tell essentials apart from extras
 *   EXPENSE SORTER → sort spending into budget categories
 *   SMART MONEY    → decisions about saving, emergencies, debt & credit
 *   BUDGET MATH    → the numbers: leftovers, %, 50/30/20, interest
 */
window.BUD = {

  SOURCES: [
    { key:'cfpb', name:'CFPB — Money as You Grow / Youth Financial Education',
      url:'https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/',
      note:'The U.S. Consumer Financial Protection Bureau’s kid-and-teen money lessons — budgeting, saving and smart spending.' },
    { key:'mymoney', name:'MyMoney.gov (U.S. Financial Literacy)',
      url:'https://www.mymoney.gov/',
      note:'The federal government’s hub for the basics of earning, saving, spending, borrowing and protecting your money.' },
    { key:'khan', name:'Khan Academy — Personal Finance',
      url:'https://www.khanacademy.org/college-careers-more/personal-finance',
      note:'Free lessons on budgeting, saving, credit, interest and avoiding debt.' },
    { key:'investopedia', name:'Investopedia — Personal Finance',
      url:'https://www.investopedia.com/personal-finance-4427760',
      note:'Plain-English definitions for every money term in this app.' }
  ],

  /* ───────── Money Dictionary ───────── */
  TERMS: [
    { term:'Income', def:'The money you take IN — usually from a job (your paycheck).', ex:'A paycheck of $2,400 a month is your income.',
      simple:'Every dollar coming toward you. It’s where your whole budget starts — you can only plan to spend money you actually bring in.' },
    { term:'Gross vs Net Pay', def:'Gross = what you earn before taxes. Net = "take-home" pay after taxes come out.', ex:'Earn $3,000 (gross), take home $2,400 (net).',
      simple:'The number on the job offer (gross) is bigger than what actually lands in your account (net), because taxes get taken out first. Budget with the NET number — that’s what you really have.' },
    { term:'Expense', def:'Money that goes OUT — anything you spend or owe.', ex:'Rent, groceries, gas and your phone bill are expenses.',
      simple:'Anything you pay for. The whole game of budgeting is making sure your expenses stay smaller than your income.' },
    { term:'Budget', def:'A plan for how you’ll use your income — how much goes to each thing.', ex:'A budget gives every dollar a job before you spend it.',
      simple:'A plan you make on purpose so your money goes where YOU want it to, instead of just disappearing and leaving you wondering where it went.' },
    { term:'Need', def:'Something you must have to live and work — food, housing, basic transport.', ex:'Rent and groceries are needs.',
      simple:'Stuff you truly can’t skip — the roof over your head, food, getting to work. Needs get paid FIRST, always.' },
    { term:'Want', def:'Something nice to have but not essential.', ex:'A concert ticket or a new game is a want.',
      simple:'The fun extras. Totally fine to spend on — but only after your needs and savings are covered, and only with money you actually have.' },
    { term:'Fixed Expense', def:'A cost that’s the same amount each month.', ex:'Rent of $1,000 every month is fixed.',
      simple:'A bill that doesn’t change — same number every single month. Easy to plan around because you always know it’s coming.' },
    { term:'Variable Expense', def:'A cost that changes month to month.', ex:'Groceries, gas and fun money go up and down.',
      simple:'Spending that wobbles from month to month. This is usually where you have the most control to cut back when money is tight.' },
    { term:'Savings', def:'Money you set aside instead of spending — for goals or emergencies.', ex:'Putting $200 a month into savings.',
      simple:'Money you deliberately DON’T spend, so future-you has it. Paying yourself first — saving before you spend on wants — is the #1 money habit.' },
    { term:'Emergency Fund', def:'Savings kept for surprise costs, like a car repair or medical bill.', ex:'A $1,000 cushion for the unexpected.',
      simple:'A stash of money for “uh-oh” moments. It’s the difference between a surprise bill being a small annoyance versus going into debt.' },
    { term:'Interest', def:'Extra money paid for borrowing — or earned for saving.', ex:'Borrow $1,000 at 20% → owe $1,200.',
      simple:'A fee for using someone else’s money. When YOU borrow, interest makes what you owe grow. When you save, interest can make your money grow instead.' },
    { term:'Debt', def:'Money you owe to someone else, usually with interest.', ex:'A $500 credit-card balance is debt.',
      simple:'Borrowed money you have to pay back — plus interest. A little can be okay; too much traps you, because the interest keeps piling on.' },
    { term:'Credit', def:'Borrowing now with a promise to pay back later.', ex:'A credit card lets you buy now, pay later.',
      simple:'Permission to spend money you don’t have yet. Powerful but risky — if you can’t pay it back fast, interest turns a small buy into a big bill.' },
    { term:'Credit Card', def:'A card that borrows money for each purchase; you’re billed monthly.', ex:'Pay the FULL balance to avoid interest.',
      simple:'A borrow-as-you-buy card. Pay the whole balance every month and it’s basically free; pay only part and interest starts eating you alive.' },
    { term:'Minimum Payment', def:'The smallest amount you must pay on a debt each month.', ex:'Paying only the minimum keeps you in debt for years.',
      simple:'The tiny amount a lender “lets” you pay. Paying only that is a trap — most of it goes to interest, so the debt barely shrinks.' },
    { term:'50/30/20 Rule', def:'A budget guide: 50% needs, 30% wants, 20% savings.', ex:'On $2,000: $1,000 needs, $600 wants, $400 savings.',
      simple:'A simple starting recipe for splitting your take-home pay: half for needs, a third for fun, a fifth for your future. Adjust to fit your life.' },
    { term:'Paycheck', def:'The payment you get from a job, often every two weeks or monthly.', ex:'Your net paycheck is what you budget with.',
      simple:'Your regular pay from working. Knowing exactly when it arrives and how much lands helps you plan the whole month.' },
    { term:'Subscription', def:'A recurring charge for a service, billed automatically.', ex:'A $15/month streaming plan.',
      simple:'A charge that repeats on its own until you cancel. Easy to forget — a few unused ones can quietly drain your budget every month.' },
    { term:'Overdraft', def:'Spending more than you have in your account, usually with a fee.', ex:'A $35 fee for overspending your balance.',
      simple:'Spending money that isn’t there. The bank may cover it — then charge you a painful fee. Tracking your balance keeps this from happening.' },
    { term:'Utilities', def:'Basic home services you pay for — electricity, water, heat, internet.', ex:'The power and water bills.',
      simple:'The bills that keep your home running — lights, water, heat, internet. Usually needs, and often variable, so they’re worth watching.' }
  ],

  /* ───────── GAME 1 · BUDGET BUILDER (sim) ─────────
   * Each month: fixed bills are auto-paid; you split what’s left among Food,
   * Transport, Fun and Savings; then a life event hits your savings. */
  SIM: {
    months: 5,
    cats: [
      { key:'food', name:'Food', icon:'🍎', min:250, note:'Groceries — a need. Go too low and it’s a rough month.' },
      { key:'transport', name:'Transportation', icon:'🚗', min:100, note:'Getting to work — a need.' },
      { key:'fun', name:'Fun', icon:'🎉', min:0, note:'Entertainment & extras — a want. Nice, but optional.' },
      { key:'savings', name:'Savings', icon:'💰', min:0, note:'Money for your future and emergencies. Pay yourself!' }
    ],
    lives: [
      { id:'solo', name:'On Your Own', emoji:'🏠', income:2400,
        blurb:'You’ve got your first apartment and a steady job. Rent and bills come first — then it’s up to you.',
        fixed:[ {name:'Rent', amt:1000, icon:'🏠'}, {name:'Phone & Utilities', amt:150, icon:'💡'}, {name:'Insurance', amt:100, icon:'🛡️'} ] },
      { id:'roomies', name:'Roommate Life', emoji:'👫', income:2000,
        blurb:'You split a place with roommates, so rent is cheaper — but so is your paycheck. Balance is everything.',
        fixed:[ {name:'Rent (split)', amt:650, icon:'🏠'}, {name:'Phone & Utilities', amt:100, icon:'💡'}, {name:'Insurance', amt:100, icon:'🛡️'} ] },
      { id:'family', name:'Family Budget', emoji:'👨‍👩‍👧', income:4200,
        blurb:'A bigger paycheck, but a family means bigger bills too. More to juggle, more to protect.',
        fixed:[ {name:'Rent', amt:1500, icon:'🏠'}, {name:'Utilities', amt:250, icon:'💡'}, {name:'Insurance', amt:300, icon:'🛡️'}, {name:'Childcare', amt:450, icon:'🧸'} ],
        mins:{food:550, transport:200} }
    ],
    /* Life events fire AFTER you budget — mostly hitting savings. amt<0 = surprise
     * cost (pulls from savings; if not enough → debt), amt>0 = windfall. */
    events: [
      { icon:'🚗', text:'Your car needs a $300 repair to keep running.', amt:-300, kind:'emergency',
        tip:'This is exactly what an emergency fund is for.' },
      { icon:'🩺', text:'A surprise medical bill arrives: $200.', amt:-200, kind:'emergency',
        tip:'Health costs are unpredictable — savings soften the blow.' },
      { icon:'📱', text:'Your phone screen shattered — $180 to replace.', amt:-180, kind:'emergency',
        tip:'Little disasters add up. Good thing you saved… right?' },
      { icon:'🦷', text:'Emergency dentist visit: $250.', amt:-250, kind:'emergency',
        tip:'Ouch — for your wallet too. Emergency funds save the day.' },
      { icon:'🎁', text:'You got a work bonus of $250!', amt:250, kind:'bonus',
        tip:'Windfall! Saving some of it beats spending it all.' },
      { icon:'💵', text:'A tax refund landed: $300 extra.', amt:300, kind:'bonus',
        tip:'Free-feeling money is a great chance to boost savings.' },
      { icon:'🎂', text:'It was a quiet month — nothing unexpected.', amt:0, kind:'calm',
        tip:'Calm months are perfect for growing your savings.' },
      { icon:'🔧', text:'The heater broke: $220 to fix it.', amt:-220, kind:'emergency',
        tip:'Home repairs love bad timing. Savings = peace of mind.' },
      { icon:'💳', text:'A subscription you forgot about charged you $60.', amt:-60, kind:'small',
        tip:'Sneaky recurring charges. Worth checking your statements!' }
    ]
  },

  /* ───────── GAME 2 · NEED OR WANT? ───────── */
  NEEDWANT: [
    { item:'🏠 This month’s rent', answer:'Need', why:'A place to live is a basic need — and usually your biggest one. Rent gets paid first.' },
    { item:'🛒 Groceries for the week', answer:'Need', why:'Food you cook at home is a need. (Fancy restaurant meals every night lean toward a want.)' },
    { item:'🎮 The newest video game', answer:'Want', why:'Fun, but not essential. A want you buy only after needs and savings are handled.' },
    { item:'💡 The electricity bill', answer:'Need', why:'Utilities that keep your lights, heat and water on are needs.' },
    { item:'👟 A 4th pair of sneakers', answer:'Want', why:'You already have shoes, so more pairs are a want — a treat, not a necessity.' },
    { item:'🚌 Bus fare to get to work', answer:'Need', why:'Getting to your job is a need — without it, you can’t earn income.' },
    { item:'🎬 A streaming subscription', answer:'Want', why:'Entertainment is a want. Nice to have, easy to cut when money is tight.' },
    { item:'💊 Medicine you’re prescribed', answer:'Need', why:'Health care and prescriptions are needs — your well-being comes first.' },
    { item:'☕ A $6 coffee every morning', answer:'Want', why:'A daily treat is a want. Small wants add up fast — $6 a day is ~$180 a month!' },
    { item:'🧥 A warm coat when you have none', answer:'Need', why:'Basic clothing for the weather is a need. (A tenth jacket would be a want.)' },
    { item:'📱 Your phone/internet bill', answer:'Need', why:'In modern life, a basic phone and internet are needs for work and safety — though the fancy unlimited plan can be trimmed.' },
    { item:'🎉 Concert tickets', answer:'Want', why:'A fun experience, but a want. Budget for it from your “fun” money.' },
    { item:'💧 The water bill', answer:'Need', why:'Running water is a need. Utilities like water and heat aren’t optional.' },
    { item:'🍔 Fast food when your fridge is full', answer:'Want', why:'You already have food at home, so eating out is a want in this case.' },
    { item:'🛡️ Health insurance', answer:'Need', why:'Insurance protects you from huge surprise bills — a need for staying financially safe.' },
    { item:'⌚ A designer smartwatch', answer:'Want', why:'A regular phone already tells time and more — a luxury watch is a want.' }
  ],

  /* ───────── GAME 3 · EXPENSE SORTER (categories) ───────── */
  CATEGORIES: {
    Housing:{ icon:'🏠', desc:'Rent or mortgage — paying for where you live.' },
    Food:{ icon:'🍎', desc:'Groceries and meals.' },
    Transportation:{ icon:'🚗', desc:'Getting around — gas, bus pass, car costs.' },
    Utilities:{ icon:'💡', desc:'Bills that keep the home running — power, water, internet.' },
    Health:{ icon:'🩺', desc:'Doctor visits, medicine, and health insurance.' },
    Savings:{ icon:'💰', desc:'Money set aside for the future or emergencies.' },
    Fun:{ icon:'🎉', desc:'Entertainment and extras — the “wants.”' }
  },
  CATSORT: [
    { item:'Your monthly rent payment', cat:'Housing' },
    { item:'A cart full of groceries', cat:'Food' },
    { item:'Filling up the gas tank', cat:'Transportation' },
    { item:'The electric bill', cat:'Utilities' },
    { item:'A visit to the doctor', cat:'Health' },
    { item:'$100 moved into your emergency fund', cat:'Savings' },
    { item:'Movie tickets and popcorn', cat:'Fun' },
    { item:'Your monthly bus pass', cat:'Transportation' },
    { item:'The internet bill', cat:'Utilities' },
    { item:'A prescription from the pharmacy', cat:'Health' },
    { item:'Concert tickets', cat:'Fun' },
    { item:'Money you put away for a vacation', cat:'Savings' },
    { item:'A restaurant dinner', cat:'Food' },
    { item:'Car insurance payment', cat:'Transportation' },
    { item:'The water bill', cat:'Utilities' },
    { item:'A new streaming subscription', cat:'Fun' }
  ],

  /* ───────── GAME 4 · SMART MONEY (decisions) ───────── */
  SMART: [
    { q:'Your car breaks down: a $400 repair. You have a $600 emergency fund. What’s the smart move?',
      correct:'Use the emergency fund — that’s exactly what it’s for', distractors:['Put it on a credit card you can’t pay off','Skip the repair and hope','Take a payday loan at huge interest'],
      why:'Emergency funds exist for surprises like this. Using it means no debt and no interest — then you rebuild the fund over the next few months.' },
    { q:'You get $200 for your birthday. What’s the smartest plan?',
      correct:'Save some and spend some', distractors:['Spend all of it today','Lend it all to a friend','Put it on lottery tickets'],
      why:'“Save some, spend some” lets you enjoy the gift AND grow your savings. Splitting windfalls is a habit that quietly builds wealth.' },
    { q:'A store offers 10% off today if you open their credit card (25% interest) and you can’t pay it off this month. Worth it?',
      correct:'No — 25% interest costs far more than 10% saved', distractors:['Yes — any discount is good','Yes — worry about it later','Yes — credit is free money'],
      why:'Saving 10% once but paying 25% interest again and again is a losing trade. Discounts aren’t deals if they push you into expensive debt.' },
    { q:'You want a $600 phone but only have $300 saved. Best move?',
      correct:'Keep saving until you can afford it', distractors:['Buy it on a credit card you can’t pay','Take out a loan','Skip rent this month to buy it'],
      why:'Waiting and saving costs you nothing extra. Borrowing for a want means paying interest — the phone ends up costing far more than $600.' },
    { q:'Only pay the credit-card minimum, or pay the full balance? Which is smarter?',
      correct:'Pay the full balance to avoid interest', distractors:['Always pay just the minimum','Pay nothing this month','Pay a random amount'],
      why:'Paying the full balance means zero interest. Paying only the minimum keeps you in debt for years while interest piles up.' },
    { q:'How big should an emergency fund usually be?',
      correct:'A few months of expenses', distractors:['Exactly $10','As little as possible','You don’t need one'],
      why:'A cushion of about 3 months of expenses covers most surprises — a job gap, a big repair — without forcing you into debt.' },
    { q:'You spot a $15/month subscription you never use. What should you do?',
      correct:'Cancel it', distractors:['Keep it just in case','Buy a second one','Ignore it forever'],
      why:'An unused $15/month is $180 a year for nothing. Reviewing subscriptions is one of the easiest ways to free up money.' },
    { q:'You get a $300/month raise. Smartest first move?',
      correct:'Save or invest a good chunk of it', distractors:['Increase every expense to match','Buy something expensive on credit','Quit budgeting — you’re rich now'],
      why:'Letting spending balloon to eat a raise (“lifestyle creep”) leaves you no better off. Banking part of a raise turns more income into real security.' },
    { q:'A payday loan offers fast cash at a huge interest rate. Wise choice when you’re short?',
      correct:'Avoid it — the fees can trap you in debt', distractors:['Yes, it’s quick and easy','Yes, take the biggest one','Yes, take several at once'],
      why:'Payday loans charge sky-high rates. Many borrowers can’t repay in time and take new loans to cover old ones — a debt trap. Cut costs or find cheaper help first.' },
    { q:'At the end of the month you have $80 left over. Best use?',
      correct:'Move it into savings', distractors:['Spend it just because it’s there','Let it vanish untracked','Buy something to “treat yourself” every time'],
      why:'Sweeping leftovers into savings turns small amounts into a real cushion over time. Money with no plan tends to disappear.' }
  ],

  /* ───────── GAME 5 · BUDGET MATH (numbers) ───────── */
  MATH: [
    { q:'You earn $2,000 a month and follow the 50/30/20 rule. How much goes to SAVINGS (20%)?',
      answer:400, unit:'$', wrongs:[200,1000,600],
      why:'20% of $2,000 = 0.20 × 2,000 = $400. (Needs get $1,000 and wants get $600.)' },
    { q:'Income is $1,800. You spend $700 on rent, $300 on food, $150 on transport, and $200 on fun. How much can you SAVE?',
      answer:450, unit:'$', wrongs:[350,650,1350],
      why:'Add expenses: 700 + 300 + 150 + 200 = $1,350. Savings = 1,800 − 1,350 = $450.' },
    { q:'You earn $2,000 but your expenses total $2,300. Are you over budget, and by how much?',
      answer:-300, unit:'$', wrongs:[300,4300,-2300], signed:true,
      why:'2,000 − 2,300 = −$300. You’re OVER budget by $300 — spending more than you earn, which means debt or dipping into savings.' },
    { q:'You save $50 every month. How much will you have after 1 year (12 months)?',
      answer:600, unit:'$', wrongs:[500,120,650],
      why:'$50 × 12 months = $600. Small, steady saving really adds up over a year.' },
    { q:'You put $1,000 on a credit card at 20% interest and don’t pay it off for a year. About how much interest do you owe?',
      answer:200, unit:'$', wrongs:[20,1000,120],
      why:'20% of $1,000 = 0.20 × 1,000 = $200 in interest — money paid for nothing but borrowing.' },
    { q:'Using 50/30/20 on a $3,000 income, how much is for NEEDS (50%)?',
      answer:1500, unit:'$', wrongs:[600,900,3000],
      why:'50% of $3,000 = half = $1,500 for needs. (Wants get $900, savings $600.)' },
    { q:'You want to save $1,200 for a trip in 6 months. How much must you save each month?',
      answer:200, unit:'$', wrongs:[120,600,1200],
      why:'$1,200 ÷ 6 months = $200 a month. Breaking a big goal into monthly chunks makes it doable.' },
    { q:'Your rent is $900 and your income is $3,000. What percent of your income goes to rent?',
      answer:30, unit:'%', wrongs:[9,3,90],
      why:'900 ÷ 3,000 = 0.30 = 30%. (A common guideline is keeping housing near or below ~30% of income.)' },
    { q:'You earn $2,500 and want to save 20% of it. How many dollars is that?',
      answer:500, unit:'$', wrongs:[250,200,2000],
      why:'20% of $2,500 = 0.20 × 2,500 = $500 saved.' },
    { q:'Income $1,500. Needs cost $1,100. How much is left for wants and savings combined?',
      answer:400, unit:'$', wrongs:[600,2600,1100],
      why:'1,500 − 1,100 = $400 left to split between wants and savings.' }
  ]
};
