// Wild encounters — a real Pokémon catching loop, not a quiz with a ball on top.
//
// You face the wild Pokémon with your own. You can attack it to bring its HP
// down, put it to sleep or paralyze it, and only then throw. Both of those show
// up directly in the catch formula (party.catchChance), so the strategy a
// Pokémon player already knows is the strategy that works here.
//
// The trivia layer sits on top exactly as it does in trainer battles: your
// answer is the execution quality of whatever you chose to do.

import * as party from './party.js';
import * as E from './battle-engine.js';
import { chooseMove } from './battle-ai.js';
import { ask, pickQuestion, nextSubject } from './quiz.js';
import * as save from './save.js';
import { rand, pick, clamp } from './rng.js';
import * as audio from './audio.js';

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

const WILD_QUALITY = 0.55;     // wild Pokémon hit a little softer than trainers

const TYPE_COLORS = {
  normal: '#a8a878', fire: '#f08030', water: '#6890f0', electric: '#f8d030',
  grass: '#78c850', ice: '#98d8d8', fighting: '#c03028', poison: '#a040a0',
  ground: '#e0c068', flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
  rock: '#b8a038', ghost: '#705898', dragon: '#7038f8', dark: '#705848',
  steel: '#b8b8d0', fairy: '#ee99ac', '???': '#888',
};
const STATUS_LABEL = {
  burn: ['BRN', '#e8552e'], poison: ['PSN', '#a040a0'], toxic: ['TOX', '#7a2c7a'],
  paralysis: ['PAR', '#e0b81c'], sleep: ['SLP', '#7a8aa0'], freeze: ['FRZ', '#79d0e8'],
};
const DIFF_LABEL = { easy: 'easy Q', medium: 'medium Q', hard: 'hard Q' };

/* ============================ panel ============================ */

let panel = null;
function ensurePanel() {
  if (panel) return panel;
  panel = document.createElement('div');
  panel.id = 'encounter';
  panel.className = 'hidden';
  panel.innerHTML = `
    <div class="encWrap">
      <div class="encTop">
        <div class="monPlate">
          <span id="encName"></span><span id="encLv"></span>
          <div class="typeRow" id="encTypes"></div>
        </div>
      </div>
      <div class="wildBars">
        <div class="wildBar">
          <div class="wbTop"><span>Wild</span><span id="wildHpNum"></span></div>
          <div class="hpBar"><div class="hpFill" id="wildHp"></div></div>
          <div class="plateMeta"><span id="wildStatus"></span><span id="wildStages"></span></div>
        </div>
        <div class="wildBar">
          <div class="wbTop"><span id="myMonName"></span><span id="myHpNum2"></span></div>
          <div class="hpBar"><div class="hpFill" id="myHp2"></div></div>
          <div class="plateMeta"><span id="myStatus2"></span><span id="myStages2"></span></div>
        </div>
      </div>
      <div class="encAbility" id="encAbility"></div>
      <div class="encStage">
        <img id="encArt" alt="">
        <div id="encBall" class="ballThrow hidden"></div>
      </div>
      <div class="encMsg" id="encMsg"></div>
      <div class="encActions" id="encActions"></div>
    </div>`;
  document.body.appendChild(panel);
  return panel;
}

/* ============================ rendering ============================ */

function bar(barId, numId, b) {
  const pct = clamp(b.hp / b.maxHp, 0, 1) * 100;
  const el = $(barId);
  el.style.width = pct + '%';
  el.className = 'hpFill ' + (pct > 50 ? 'good' : pct > 20 ? 'warn' : 'low');
  if (numId) $(numId).textContent = `${Math.max(0, b.hp)}/${b.maxHp}`;
}
function statusHtml(b) {
  if (!b.status) return '';
  const [l, c] = STATUS_LABEL[b.status] ?? [b.status.toUpperCase(), '#888'];
  return `<span class="statusChip" style="background:${c}">${l}</span>`;
}
function stagesHtml(b) {
  return Object.entries(b.stages).filter(([, v]) => v)
    .map(([k, v]) => `<span class="stg ${v > 0 ? 'up' : 'down'}">${k.toUpperCase()}${v > 0 ? '+' : ''}${v}</span>`)
    .join('');
}

function refresh(wild, mine) {
  bar('wildHp', 'wildHpNum', wild);
  $('wildStatus').innerHTML = statusHtml(wild);
  $('wildStages').innerHTML = stagesHtml(wild);
  if (mine) {
    $('myMonName').textContent = mine.name.toUpperCase();
    bar('myHp2', 'myHpNum2', mine);
    $('myStatus2').innerHTML = statusHtml(mine);
    $('myStages2').innerHTML = stagesHtml(mine);
  }
}

function say(text) {
  const m = $('encMsg');
  m.innerHTML = text;
  m.classList.remove('pulse');
  void m.offsetWidth;
  m.classList.add('pulse');
}

function actions(list) {
  const box = $('encActions');
  box.innerHTML = '';
  return new Promise((resolve) => {
    for (const a of list) {
      const b = document.createElement('button');
      b.className = 'encBtn' + (a.cls ? ' ' + a.cls : '');
      const chip = a.type
        ? `<span class="mvType" style="background:${TYPE_COLORS[a.type] ?? '#888'}">${a.type}</span>` : '';
      b.innerHTML = `<span>${a.label}${chip}</span>` + (a.hint ? `<small>${a.hint}</small>` : '');
      b.disabled = !!a.disabled;
      b.title = a.tip ?? '';
      b.onclick = () => { box.innerHTML = ''; resolve(a); };
      box.appendChild(b);
    }
  });
}

/* ============================ the throw ============================ */

function throwMeter() {
  const box = $('encActions');
  box.innerHTML = `
    <div class="throwWrap">
      <div class="throwBar">
        <div class="throwZone"></div>
        <div class="throwMark" id="throwMark"></div>
      </div>
      <button class="encBtn throwGo" id="throwGo">THROW!</button>
      <small>Tap when the ball is in the gold zone</small>
    </div>`;
  const mark = $('throwMark'), go = $('throwGo');
  return new Promise((resolve) => {
    let t = 0, raf = 0, done = false, last = performance.now();
    const step = (now) => {
      if (done) return;
      t += ((now - last) / 1000) * 1.9;
      last = now;
      mark.style.left = (Math.abs((t % 2) - 1) * 100) + '%';
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const fire = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      const pos = parseFloat(mark.style.left) / 100;
      const accuracy = Math.max(0, 1 - Math.abs(pos - 0.5) * 2.2);
      mark.classList.add(accuracy > 0.6 ? 'good' : 'wide');
      go.disabled = true;
      audio.blip();
      setTimeout(() => { box.innerHTML = ''; resolve(accuracy); }, 300);
    };
    go.onclick = fire;
    addEventListener('keydown', function k(e) {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); removeEventListener('keydown', k); fire(); }
    });
  });
}

async function shakeBall(times) {
  const ball = $('encBall');
  ball.classList.remove('hidden');
  for (let i = 0; i < times; i++) {
    ball.classList.remove('shake');
    void ball.offsetWidth;
    ball.classList.add('shake');
    audio.shake();
    await wait(500);
  }
}

/* ============================ narration ============================ */

const EFF_TEXT = (m) => m >= 4 ? "It's doubly super effective!" : m >= 2 ? "It's super effective!"
  : m === 0 ? "It doesn't affect it at all!" : m <= 0.5 ? "It's not very effective…" : null;
const STATUS_TEXT = {
  burn: 'was burned!', poison: 'was poisoned!', toxic: 'was badly poisoned!',
  paralysis: 'is paralyzed!', sleep: 'fell asleep!', freeze: 'was frozen solid!',
  confusion: 'became confused!',
};

function narrate(ev) {
  const who = (n) => `<b>${n.toUpperCase()}</b>`;
  switch (ev.t) {
    case 'move': return `${who(ev.who)} used <b>${ev.move.toUpperCase()}</b>!`;
    case 'damage': {
      const e = EFF_TEXT(ev.typeMult);
      return `${ev.dmg} damage.` + (ev.crit ? ' <b>Critical hit!</b>' : '') + (e ? ` ${e}` : '');
    }
    case 'noEffect': return `It doesn't affect ${who(ev.who)} at all!`;
    case 'miss': return `It missed! That move lands ${ev.acc}% of the time.`;
    case 'fizzle': return `…the move had no power behind it.`;
    case 'status': return `${who(ev.who)} ${STATUS_TEXT[ev.status] ?? 'was affected!'}`;
    case 'stat': return `${who(ev.who)}'s ${ev.stat.toUpperCase()} ${ev.stage > 0 ? 'rose' : 'fell'}!`;
    case 'statusHurt': return `${who(ev.who)} is hurt by its ${ev.status}!`;
    case 'heal': return `${who(ev.who)} recovered ${ev.amount} HP!`;
    case 'recoil': return `${who(ev.who)} took ${ev.amount} recoil damage.`;
    case 'faint': return `${who(ev.who)} fainted!`;
    case 'fullPara': return `${who(ev.who)} is paralyzed and couldn't move!`;
    case 'asleep': return `${who(ev.who)} is fast asleep.`;
    case 'wake': return `${who(ev.who)} woke up!`;
    case 'flinch': return `${who(ev.who)} flinched!`;
    case 'ability':
    case 'abilityImmune':
    case 'abilityAbsorb': return ev.text ? ev.text.replace('{P}', who(ev.who)) : null;
    default: return null;
  }
}

/* ============================ the encounter ============================ */

/** Resolves 'caught' | 'fled' | 'ran' | 'ko'. */
export async function runCatch(roamer, profile, zone) {
  ensurePanel();
  party.ensureStarter(profile);

  const sp = party.species(roamer.dex);
  const battle = E.createBattle();
  const wild = E.makeBattler(party.makeMon(roamer.dex, roamer.level));
  const myTeam = profile.party.map(m => E.makeBattler(m));
  let mine = myTeam.find(b => !b.fainted) ?? myTeam[0];

  $('encName').textContent = sp.name.toUpperCase();
  $('encLv').textContent = 'Lv' + roamer.level;
  $('encTypes').innerHTML = sp.types
    .map(t => `<span class="typeChip" style="background:${TYPE_COLORS[t] ?? '#888'}">${t}</span>`).join('');
  const abil = party.abilitiesFor(roamer.dex).filter(a => !a.hidden);
  $('encAbility').innerHTML = abil.length
    ? `<b>Ability:</b> ${abil.map(a => a.label).join(' / ')} — ${abil[0].short}` : '';
  $('encArt').src = party.artUrl(roamer.dex);
  $('encBall').className = 'ballThrow hidden';
  panel.classList.remove('hidden');
  audio.encounter();
  refresh(wild, mine);

  if (!profile.seen.includes(roamer.dex)) profile.seen.push(roamer.dex);

  async function play(log) {
    for (const ev of log) {
      const line = narrate(ev);
      if (ev.t === 'damage') audio.hit(ev.typeMult >= 2);
      if (ev.t === 'faint') audio.faint();
      refresh(wild, mine);
      if (line) { say(line); await wait(1150); }
    }
  }

  say(`A wild ${sp.name.toUpperCase()} appeared!` + (roamer.rare ? ' It looks rare!' : ''));
  await wait(1100);
  await play(E.onSwitchIn(battle, wild, mine));
  await play(E.onSwitchIn(battle, mine, wild));

  let result = 'ran', wrongStreak = 0;

  for (;;) {
    if (wild.fainted) { result = 'ko'; break; }
    if (mine.fainted) {
      const next = myTeam.find(b => !b.fainted);
      if (!next) {
        say(`${mine.name.toUpperCase()} can't battle. You back away carefully.`);
        await wait(1700);
        result = 'fled';
        break;
      }
      mine = next;
      refresh(wild, mine);
      say(`Go, <b>${mine.name.toUpperCase()}</b>!`);
      await wait(1100);
      await play(E.onSwitchIn(battle, mine, wild));
    }

    /* ---------------- what do you do? ---------------- */
    const odds = party.catchChance(wild.dex, wild.hp, wild.maxHp, wild.status, 1.0);
    say(`What will you do? <span class="odds">A Poké Ball would land about ${Math.round(odds * 100)}% of the time right now.</span>`);

    const bench = myTeam.filter(b => b !== mine && !b.fainted);
    const choice = await actions([
      ...mine.moves.map((slot) => {
        const mv = window.PL_MOVES[slot.name];
        const eff = mv.power > 0 ? party.typeMultiplier(mv.type, wild.types) : 1;
        return {
          kind: 'move', slot, move: mv,
          label: mv.label.toUpperCase(), type: mv.type,
          hint: (mv.power > 0 ? `pow ${mv.power}` : 'status') +
            ` · pp ${slot.pp}/${slot.maxPp} · ${DIFF_LABEL[party.difficultyForMove(mv)]}` +
            (mv.power > 0 && eff >= 2 ? ' · super!' : mv.power > 0 && eff === 0 ? ' · no effect' : ''),
          tip: mv.short,
          disabled: slot.pp <= 0,
          cls: mv.power === 0 ? 'mv-status' : eff >= 2 ? 'ballGreat' : '',
        };
      }),
      { kind: 'ball', label: '🔴 THROW A BALL', hint: 'pick your ball next', cls: 'ballPoke' },
      { kind: 'switch', label: 'SWITCH', hint: `${bench.length} ready`, disabled: !bench.length, cls: 'ghost' },
      { kind: 'run', label: 'Walk away', cls: 'ghost' },
    ]);

    if (choice.kind === 'run') { result = 'ran'; break; }

    if (choice.kind === 'switch') {
      const picked = await actions([
        ...bench.map(b => ({ kind: 'to', target: b, label: b.name.toUpperCase(),
          hint: `L${b.level} · ${b.hp}/${b.maxHp} HP` })),
        { kind: 'back', label: 'Back' },
      ]);
      if (picked.target) {
        mine = picked.target;
        refresh(wild, mine);
        say(`Go, <b>${mine.name.toUpperCase()}</b>!`);
        await wait(1000);
        await play(E.onSwitchIn(battle, mine, wild));
      }
      continue;
    }

    /* ---------------- throwing a ball ---------------- */
    if (choice.kind === 'ball') {
      const ball = await actions([
        ...party.BALLS.map(b => ({
          kind: 'pick', ball: b, label: b.name,
          hint: `${b.difficulty} question · ${Math.round(party.catchChance(wild.dex, wild.hp, wild.maxHp, wild.status, b.bonus) * 100)}% now`,
          cls: b.id === 'poke' ? 'ballPoke' : b.id === 'great' ? 'ballGreat' : 'ballUltra',
        })),
        { kind: 'back', label: 'Back' },
      ]);
      if (ball.kind === 'back') continue;

      const b = ball.ball;
      $('encBall').style.background = b.color;
      const subject = nextSubject();
      const q = pickQuestion({ subject, difficulty: b.difficulty, profile, zoneId: zone.id });
      const { quality } = await ask(q, profile, { difficulty: b.difficulty });

      if (quality <= 0) {
        audio.wrong();
        wrongStreak++;
        say('Your throw goes wide — the ball never opens.');
        await wait(1200);
      } else {
        audio.correct();
        say('Good answer! Now line up your throw…');
        const accuracy = await throwMeter();
        const aim = 0.75 + accuracy * 0.45;
        say(accuracy > 0.75 ? 'A perfect throw!' : accuracy > 0.4 ? 'Good throw!' : 'That one went wide…');
        await wait(600);

        const chanceVal = clamp(
          party.catchChance(wild.dex, wild.hp, wild.maxHp, wild.status, b.bonus) * quality * aim, 0.02, 0.97);
        const caught = rand() < chanceVal;
        await shakeBall(party.shakeCount(chanceVal, caught));

        if (caught) {
          audio.fanfare();
          $('encBall').classList.add('caught');
          const rareBonus = wild.maxHp > 0 && party.species(wild.dex).catch <= 45 ? 15 : 0;
          const xp = b.xp + rareBonus;
          const mon = party.makeMon(roamer.dex, roamer.level);
          mon.hp = Math.max(1, wild.hp);
          mon.status = wild.status ?? null;
          party.addCatch(profile, mon);
          say(`Gotcha! ${sp.name.toUpperCase()} was caught!  +${xp} XP`);
          for (const m of profile.party) party.grantXp(m, Math.round(xp / profile.party.length));
          await wait(1900);
          result = 'caught';
          break;
        }
        $('encBall').classList.add('hidden');
        say(chanceVal > 0.5
          ? `Argh! So close — ${sp.name.toUpperCase()} broke free!`
          : `${sp.name.toUpperCase()} broke out easily. <span class="odds">Wear it down or put it to sleep first.</span>`);
        await wait(1400);
      }

      // throwing costs you the turn — the wild Pokémon still gets to act
      await play(E.resolveTurn(battle, [
        { user: wild, target: mine, action: { type: 'move', move: chooseMove(battle, wild, mine, 0.45) }, quality: WILD_QUALITY },
      ]));
      continue;
    }

    /* ---------------- attacking it ---------------- */
    const difficulty = party.difficultyForMove(choice.move);
    const subject = nextSubject();
    const q = pickQuestion({ subject, difficulty, profile, zoneId: zone.id });
    const { quality } = await ask(q, profile, { difficulty });
    if (quality <= 0) wrongStreak++; else wrongStreak = 0;

    await play(E.resolveTurn(battle, [
      { user: mine, target: wild, action: { type: 'move', move: choice.slot.name }, quality },
      { user: wild, target: mine, action: { type: 'move', move: chooseMove(battle, wild, mine, 0.45) }, quality: WILD_QUALITY },
    ]));

    if (wild.fainted) {
      say(`${sp.name.toUpperCase()} fainted — you can't catch it now. <span class="odds">Next time, leave it a sliver of HP.</span>`);
      await wait(2200);
      result = 'ko';
      break;
    }
    // a wild Pokémon only bolts if you keep flailing at it
    if (wrongStreak >= 3 && rand() < 0.5) {
      say(`${sp.name.toUpperCase()} got bored and wandered off. You still learned something!`);
      await wait(1700);
      result = 'fled';
      break;
    }
  }

  for (const b of myTeam) { b.ref.hp = Math.max(0, b.hp); b.ref.status = b.status ?? null; }
  panel.classList.add('hidden');
  save.saveProfile(profile);
  return result;
}
