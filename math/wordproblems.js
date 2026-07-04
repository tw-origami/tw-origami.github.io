// Word-problem generator. Templates + random numbers + random characters =
// thousands of unique problems, generated on the fly (no server needed).
// window.makeWordProblem(level) -> problem object compatible with the game
// (same fields as makeProblem: display/answer/kind/step + strip or line data).
(function(){
  const rand = (lo, hi) => Math.floor(Math.random()*(hi-lo+1))+lo;
  const pick = a => a[Math.floor(Math.random()*a.length)];

  // Same difficulty ranges as the main game.
  const MUL_LEVELS = { 1:[1,3], 2:[2,5], 3:[4,9], 4:[6,10], 5:[8,12] };
  const ADD_LEVELS = { 1:[1,5], 2:[1,10], 3:[5,20], 4:[10,50], 5:[20,100] };

  const KIDS   = ['Mia','Leo','Ava','Jack','Zoe','Sam','Lily','Max','Ella','Ben'];
  const HEROES = ['Pikachu','Mario','Luigi','Sonic','Kirby','Elsa','Moana','Spider-Man','Bluey','Yoshi','Steve from Minecraft','Ash Ketchum','Princess Peach','Lightning McQueen','Buzz Lightyear'];
  const person = () => Math.random() < 0.45 ? pick(HEROES) : pick(KIDS);

  // ---- templates: fn(x, y, who) -> problem text ----
  const ADD = [
    (x,y,w)=>`${w} picks ${x} apples, then picks ${y} more. How many apples does ${w} have now?`,
    (x,y,w)=>`${w} scores ${x} points in the first half and ${y} points in the second half. What's the total score?`,
    (x,y,w)=>`The grocery store has ${x} cans of soup and gets a delivery of ${y} more. How many cans are there now?`,
    (x,y,w)=>`${w} builds a tower with ${x} blocks, then adds ${y} more blocks on top. How many blocks tall is the tower?`,
    (x,y,w)=>`${w} collects ${x} coins in one level and ${y} coins in the next. How many coins in all?`,
    (x,y,w)=>`A builder nails ${x} boards in the morning and ${y} boards in the afternoon. How many boards did they nail?`,
    (x,y,w)=>`${w} catches ${x} Pokémon on Monday and ${y} on Tuesday. How many Pokémon did ${w} catch?`,
    (x,y,w)=>`${w} mines ${x} diamonds, then finds a chest with ${y} more. How many diamonds now?`,
    (x,y,w)=>`The team makes ${x} goals in game one and ${y} goals in game two. How many goals total?`,
    (x,y,w)=>`${w} bakes ${x} cookies, then bakes another batch of ${y}. How many cookies altogether?`,
  ];
  const SUB = [
    (m,y,w)=>`${w} has ${m} balloons and ${y} pop. How many balloons are left?`,
    (m,y,w)=>`The store starts with ${m} bananas and sells ${y}. How many bananas are left?`,
    (m,y,w)=>`${w} has ${m} coins and spends ${y} on a power-up. How many coins are left?`,
    (m,y,w)=>`A plumber has ${m} feet of pipe and uses ${y} feet on a job. How many feet are left?`,
    (m,y,w)=>`${w} builds with ${m} blocks, then ${y} blocks fall off. How many blocks are still standing?`,
    (m,y,w)=>`A carpenter has a board ${m} inches long and cuts off ${y} inches. How long is the board now?`,
    (m,y,w)=>`${w} has ${m} candies and gives ${y} to a friend. How many candies does ${w} keep?`,
    (m,y,w)=>`${w} has ${m} hearts, then takes damage and loses ${y}. How many hearts are left?`,
    (m,y,w)=>`The library has ${m} books and ${y} get checked out. How many books are still there?`,
    (m,y,w)=>`${w} throws ${m} pitches and ${y} are balls. How many are strikes?`,
  ];
  const MUL = [
    (x,y,w)=>`${w} has ${y} bags with ${x} oranges in each bag. How many oranges in all?`,
    (x,y,w)=>`Each shelf holds ${x} cans and the store fills ${y} shelves. How many cans is that?`,
    (x,y,w)=>`${w} builds ${y} walls using ${x} blocks each. How many blocks did ${w} use?`,
    (x,y,w)=>`A carpenter cuts ${y} boards into ${x} pieces each. How many pieces are there?`,
    (x,y,w)=>`${w} scores ${x} points every level and beats ${y} levels. What's the total score?`,
    (x,y,w)=>`Each pizza has ${x} slices. ${w} orders ${y} pizzas for the party. How many slices?`,
    (x,y,w)=>`Every Poké Ball pack has ${x} balls. ${w} buys ${y} packs. How many Poké Balls?`,
    (x,y,w)=>`Each basketball team has ${x} players. There are ${y} teams at the gym. How many players?`,
    (x,y,w)=>`${w} plants ${y} rows of carrots with ${x} carrots in each row. How many carrots?`,
    (x,y,w)=>`A plumber needs ${x} washers for each sink and fixes ${y} sinks. How many washers?`,
  ];
  const DIV = [
    (t,x,w)=>`${w} has ${t} strawberries to share equally among ${x} friends. How many does each friend get?`,
    (t,x,w)=>`The store packs ${t} eggs into cartons of ${x}. How many cartons do they fill?`,
    (t,x,w)=>`${w} has ${t} blocks and builds towers ${x} blocks tall. How many towers can ${w} build?`,
    (t,x,w)=>`A carpenter cuts a ${t}-inch board into pieces ${x} inches long. How many pieces?`,
    (t,x,w)=>`${w} collects ${t} coins and trades ${x} coins per prize. How many prizes can ${w} get?`,
    (t,x,w)=>`${t} kids split into teams of ${x} for kickball. How many teams are there?`,
    (t,x,w)=>`${w} has ${t} Pokémon cards and puts ${x} on each page. How many pages get filled?`,
    (t,x,w)=>`${w} mines ${t} iron ore and each tool needs ${x} ore. How many tools can ${w} make?`,
    (t,x,w)=>`A baker has ${t} cupcakes and puts ${x} in each box. How many boxes?`,
    (t,x,w)=>`The plumber has ${t} feet of pipe and cuts it into ${x}-foot sections. How many sections?`,
  ];

  window.makeWordProblem = function(level){
    const op = pick(['add','sub','mul','div']);
    const w = person();
    if (op === 'add'){
      const [lo,hi] = ADD_LEVELS[level];
      const x = rand(lo,hi), y = rand(lo,hi);
      return { display: pick(ADD)(x,y,w), answer: x+y, op:'add', word:true,
               kind:'line', start:x, delta:y, result:x+y, lineMax:x+y, step:1 };
    }
    if (op === 'sub'){
      const [lo,hi] = ADD_LEVELS[level];
      const x = rand(lo,hi), y = rand(lo,hi);
      const m = x + y;   // answer x, never negative
      return { display: pick(SUB)(m,y,w), answer: x, op:'sub', word:true,
               kind:'line', start:m, delta:-y, result:x, lineMax:m, step:1 };
    }
    const [lo,hi] = MUL_LEVELS[level];
    const x = rand(lo,hi), y = rand(lo,hi);
    if (op === 'mul'){
      return { display: pick(MUL)(x,y,w), answer: x*y, op:'mul', word:true,
               kind:'strip', base:x, target:y, product:x*y, step:x };
    }
    // div: (x*y) ÷ x = y
    return { display: pick(DIV)(x*y,x,w), answer: y, op:'div', word:true,
             kind:'strip', base:x, target:y, product:x*y, step:1 };
  };
})();
