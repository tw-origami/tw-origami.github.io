// The battle screen. All the actual rules live in js/battle-engine.js — this
// file is presentation: it collects the player's action, asks the question,
// hands the engine an execution quality, and animates the events that come back.
//
// The UI deliberately shows everything a strategic player needs to read the
// board: status conditions, stat stages, weather, PP, move type and power. If
// you can't see it, you can't plan around it.

import * as party from './party.js';
import * as E from './battle-engine.js';
import { chooseMove, chooseSwitch, explainChoice } from './battle-ai.js';
import { ask, pickQuestion, nextSubject } from './quiz.js';
import * as save from './save.js';
import { rand, pick, clamp } from './rng.js';
import * as audio from './audio.js';

const $ = (id) => document.getElementById(id);
const wait = (ms) => new Promise(r => setTimeout(r, ms));

// How well the opponent "answers" its own questions. This is the single
// difficulty dial for the whole game.
const ENEMY_QUALITY = 0.62;

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
  panel.id = 'battle';
  panel.className = 'hidden';
  panel.innerHTML = `
    <div class="btlScene">
      <div class="btlPlate foe">
        <div class="plateTop"><span id="foeName"></span><span id="foeLv"></span></div>
        <div class="hpBar"><div class="hpFill" id="foeHp"></div></div>
        <div class="plateMeta"><span id="foeStatus"></span><span id="foeStages"></span></div>
      </div>
      <div class="btlPlate mine">
        <div class="plateTop"><span id="myName"></span><span id="myLv"></span></div>
        <div class="hpBar"><div class="hpFill" id="myHp"></div></div>
        <div class="plateMeta"><span id="myStatus"></span><span id="myStages"></span>
          <span class="hpNum" id="myHpNum"></span></div>
      </div>
      <div class="pad foePad"></div>
      <div class="pad myPad"></div>
      <img id="foeArt" class="btlArt foeArt" alt="">
      <img id="myArt" class="btlArt myArt" alt="">
      <div class="btlTrainer" id="btlTrainer"></div>
      <div class="btlWeather hidden" id="btlWeather"></div>
    </div>
    <div class="btlBar">
      <div class="btlMsg"><span id="btlMsg"></span></div>
      <div class="btlMenu" id="btlMenu"></div>
    </div>`;
  document.body.appendChild(panel);
  return panel;
}

/* ============================ rendering ============================ */

function setHp(barId, b) {
  const pct = clamp(b.hp / b.maxHp, 0, 1) * 100;
  const el = $(barId);
  el.style.width = pct + '%';
  el.className = 'hpFill ' + (pct > 50 ? 'good' : pct > 20 ? 'warn' : 'low');
}

function stagesHtml(b) {
  const out = [];
  for (const [k, v] of Object.entries(b.stages)) {
    if (!v) continue;
    out.push(`<span class="stg ${v > 0 ? 'up' : 'down'}">${k.toUpperCase()}${v > 0 ? '+' : ''}${v}</span>`);
  }
  return out.join('');
}

function statusHtml(b) {
  if (!b.status) return '';
  const [label, color] = STATUS_LABEL[b.status] ?? [b.status.toUpperCase(), '#888'];
  return `<span class="statusChip" style="background:${color}">${label}</span>`;
}

function showSide(b, which) {
  const p = which === 'foe' ? 'foe' : 'my';
  $(p + 'Name').textContent = b.name.toUpperCase();
  $(p + 'Lv').textContent = 'L' + b.level;
  $(p + 'Art').src = party.artUrl(b.dex);
  $(p + 'Status').innerHTML = statusHtml(b);
  $(p + 'Stages').innerHTML = stagesHtml(b);
  setHp(p + 'Hp', b);
  if (which === 'mine') $('myHpNum').textContent = `${Math.max(0, b.hp)}/${b.maxHp}`;
  $(p + 'Art').classList.toggle('fainted', b.fainted);
}

function showWeather(battle) {
  const el = $('btlWeather');
  if (!battle.weather) { el.classList.add('hidden'); return; }
  const icon = { rain: '🌧️ Rain', sun: '☀️ Harsh sun', sand: '🏜️ Sandstorm', hail: '❄️ Hail' };
  el.textContent = icon[battle.weather] ?? battle.weather;
  el.classList.remove('hidden');
}

const say = (html) => { $('btlMsg').innerHTML = html; };

function menu(items) {
  const box = $('btlMenu');
  box.innerHTML = '';
  return new Promise((resolve) => {
    for (const it of items) {
      const b = document.createElement('button');
      b.className = 'btlBtn' + (it.cls ? ' ' + it.cls : '');
      const chip = it.type
        ? `<span class="mvType" style="background:${TYPE_COLORS[it.type] ?? '#888'}">${it.type}</span>` : '';
      b.innerHTML = `<b>${it.name}</b>${chip}` + (it.blurb ? `<small>${it.blurb}</small>` : '');
      b.disabled = !!it.disabled;
      b.title = it.tip ?? '';
      b.onclick = () => { box.innerHTML = ''; resolve(it); };
      box.appendChild(b);
    }
  });
}

/** Move buttons showing everything you need to choose well. */
function moveOptions(b, foe) {
  return b.moves.map((slot) => {
    const mv = window.PL_MOVES[slot.name];
    const eff = mv.power > 0 ? party.typeMultiplier(mv.type, foe.types) : 1;
    const effTag = mv.power <= 0 ? ''
      : eff === 0 ? ' · no effect' : eff >= 2 ? ' · super!' : eff <= 0.5 ? ' · resisted' : '';
    return {
      id: 'move:' + slot.name,
      move: mv, slot,
      name: mv.label.toUpperCase(),
      type: mv.type,
      blurb: (mv.power > 0 ? `pow ${mv.power}` : 'status') +
        ` · pp ${slot.pp}/${slot.maxPp} · ${DIFF_LABEL[party.difficultyForMove(mv)]}${effTag}`,
      tip: mv.short,
      disabled: slot.pp <= 0,
      cls: mv.power === 0 ? 'mv-status'
        : eff >= 2 ? 'mv-super' : eff === 0 ? 'mv-none'
        : mv.power <= 45 ? 'mv-jab' : mv.power <= 75 ? 'mv-strike' : 'mv-blast',
    };
  });
}

/* ============================ event narration ============================ */

async function flash(imgId) {
  const el = $(imgId);
  el.classList.remove('struck');
  void el.offsetWidth;
  el.classList.add('struck');
  await wait(380);
}

const EFF_TEXT = (m) => m >= 4 ? "It's doubly super effective!" : m >= 2 ? "It's super effective!"
  : m === 0 ? "It doesn't affect it at all!" : m <= 0.25 ? 'It barely scratched it…'
  : m <= 0.5 ? "It's not very effective…" : null;

const STATUS_TEXT = {
  burn: 'was burned!', poison: 'was poisoned!', toxic: 'was badly poisoned!',
  paralysis: 'is paralyzed! It may not move!', sleep: 'fell asleep!',
  freeze: 'was frozen solid!', confusion: 'became confused!',
};

/** Turn one engine event into a line of text, or null to skip it. */
function narrate(ev, mineName) {
  const who = (n) => `<b>${n.toUpperCase()}</b>`;
  switch (ev.t) {
    case 'move': return `${who(ev.who)} used <b>${ev.move.toUpperCase()}</b>!`;
    case 'damage': {
      const bits = [`${ev.dmg} damage.`];
      if (ev.crit) bits.push('<span class="eff">A critical hit!</span>');
      const e = EFF_TEXT(ev.typeMult);
      if (e) bits.push(`<span class="eff">${e}</span>`);
      if (ev.stab) bits.push('<span class="eff">Same-type bonus.</span>');
      return bits.join(' ');
    }
    case 'noEffect': return `<span class="eff">It doesn't affect ${who(ev.who)} at all!</span>`;
    case 'miss': return `But it missed! <span class="eff">That move only lands ${ev.acc}% of the time.</span>`;
    case 'fizzle': return `…but the move had no power behind it. <span class="eff">A wrong answer means a wasted turn.</span>`;
    case 'status': return `${who(ev.who)} ${STATUS_TEXT[ev.status] ?? 'was affected!'}`;
    case 'statusFail': return `…but it failed.`;
    case 'stat': {
      const dir = ev.stage > 0 ? 'rose' : 'fell';
      const amt = Math.abs(ev.stage) >= 2 ? 'sharply ' : '';
      return `${who(ev.who)}'s ${ev.stat.toUpperCase()} ${amt}${dir}!`;
    }
    case 'statFail': return `${who(ev.who)}'s ${ev.stat.toUpperCase()} won't go ${ev.dir === 'up' ? 'higher' : 'lower'}!`;
    case 'heal': return `${who(ev.who)} recovered ${ev.amount} HP${ev.why ? ` (${ev.why})` : ''}!`;
    case 'healFail': return `…but its HP is already full.`;
    case 'recoil': return `${who(ev.who)} was hurt by ${ev.why ?? 'recoil'} — ${ev.amount} HP.`;
    case 'statusHurt': return `${who(ev.who)} is hurt by its ${ev.status}! ${ev.amount} HP.`;
    case 'weatherHurt': return `${who(ev.who)} is buffeted by the ${ev.weather}! ${ev.amount} HP.`;
    case 'itemHurt': return `${who(ev.who)} was hurt by the ${ev.item}!`;
    case 'faint': return `${who(ev.who)} fainted!`;
    case 'flinch': return `${who(ev.who)} flinched and couldn't move!`;
    case 'asleep': return `${who(ev.who)} is fast asleep.`;
    case 'wake': return `${who(ev.who)} woke up!`;
    case 'frozen': return `${who(ev.who)} is frozen solid!`;
    case 'thaw': return `${who(ev.who)} thawed out!`;
    case 'fullPara': return `${who(ev.who)} is paralyzed! It couldn't move!`;
    case 'confusedHit': return `${who(ev.who)} is confused — it hurt itself! ${ev.dmg} HP.`;
    case 'snapOut': return `${who(ev.who)} snapped out of its confusion!`;
    case 'protect': return `${who(ev.who)} protected itself!`;
    case 'protectFail': return `…but it failed. <span class="eff">Protect can't be spammed.</span>`;
    case 'blocked': return `${who(ev.who)} protected itself from the attack!`;
    case 'abilityImmune':
    case 'abilityAbsorb':
    case 'ability': return ev.text ? ev.text.replace('{P}', who(ev.who)) : null;
    case 'endured': return `${who(ev.who)} hung on with its ${ev.why}!`;
    case 'weather': return `The weather changed: ${ev.weather}.`;
    case 'weatherEnd': return `The ${ev.weather} stopped.`;
    case 'noPp': return `…but there's no power left in that move!`;
    case 'multiHit': return `Hit ${ev.hits} times!`;
    default: return null;
  }
}

/* ============================ the battle ============================ */

/**
 * Run a battle. `trainer` = { id, name, title, roster, lines, badge?, skill? }
 * Resolves 'win' | 'lose' | 'ran'.
 */
export async function runBattle(trainer, profile, zone) {
  ensurePanel();
  party.ensureStarter(profile);

  const battle = E.createBattle();
  const skill = trainer.skill ?? (trainer.badge ? 0.85 : 0.6);

  const myTeam = profile.party.map(m => E.makeBattler(m));
  const foeTeam = trainer.roster.map(r =>
    E.makeBattler(party.makeMon(r.dex, r.level), { ability: r.ability, item: r.item, nature: r.nature }));

  let mine = myTeam.find(b => !b.fainted) ?? myTeam[0];
  let foe = foeTeam[0];
  let foeIdx = 0;

  $('btlTrainer').textContent = trainer.title ? `${trainer.title} ${trainer.name}` : trainer.name;
  panel.classList.remove('hidden');
  audio.encounter();
  showSide(foe, 'foe');
  showSide(mine, 'mine');
  showWeather(battle);

  /** Play back an engine log, one line at a time, refreshing the plates. */
  async function play(log) {
    for (const ev of log) {
      const line = narrate(ev, mine.name);
      if (ev.t === 'damage') {
        audio.hit(ev.typeMult >= 2);
        await flash(ev.who === mine.name ? 'myArt' : 'foeArt');
      }
      if (ev.t === 'faint') audio.faint();
      if (ev.t === 'status' || ev.t === 'stat') audio.blip();
      showSide(foe, 'foe');
      showSide(mine, 'mine');
      showWeather(battle);
      if (line) { say(line); await wait(1250); }
    }
  }

  say(`${trainer.name}: ${pick(trainer.lines?.start ?? ["Let's see what you know!"])}`);
  await wait(1500);

  // switch-in abilities fire before anything else, exactly like the games
  await play(E.onSwitchIn(battle, foe, mine));
  await play(E.onSwitchIn(battle, mine, foe));

  say(`${trainer.name} sent out <b>${foe.name.toUpperCase()}</b>!`);
  await wait(1200);

  let result = 'ran';

  battle_loop:
  for (;;) {
    /* ---------------- collect the player's action ---------------- */
    say(`What will <b>${mine.name.toUpperCase()}</b> do?`);
    const bench = myTeam.filter(b => b !== mine && !b.fainted);
    const choice = await menu([
      ...moveOptions(mine, foe),
      { id: 'switch', name: 'SWITCH', blurb: `${bench.length} ready`, disabled: !bench.length, cls: 'mv-switch' },
      { id: 'run', name: 'RUN AWAY', blurb: 'no penalty', cls: 'mv-run' },
    ]);

    if (choice.id === 'run') { result = 'ran'; break; }

    let myEntry = null;

    if (choice.id === 'switch') {
      const picked = await menu([
        ...bench.map(b => ({
          id: 'to:' + b.name, target: b, name: b.name.toUpperCase(),
          blurb: `L${b.level} · ${b.hp}/${b.maxHp} HP${b.status ? ' · ' + b.status : ''}`,
        })),
        { id: 'back', name: 'BACK', blurb: '' },
      ]);
      if (!picked.target) continue;
      const old = mine;
      mine = picked.target;
      showSide(mine, 'mine');
      say(`That's enough, ${old.name.toUpperCase()}! Go, <b>${mine.name.toUpperCase()}</b>!`);
      await wait(1100);
      await play(E.onSwitchIn(battle, mine, foe));
      // switching costs you the turn — the foe still gets to move
      myEntry = { user: mine, target: foe, action: { type: 'switch' }, quality: 1 };
    } else {
      const difficulty = party.difficultyForMove(choice.move);
      // Subjects rotate across the whole curriculum rather than sticking to the
      // zone, so no two questions in a row come from the same topic.
      const subject = nextSubject();
      const q = pickQuestion({ subject, difficulty, profile, zoneId: zone.id });
      const { quality } = await ask(q, profile, { difficulty });
      myEntry = { user: mine, target: foe, action: { type: 'move', move: choice.slot.name }, quality };
    }

    /* ---------------- the opponent decides ---------------- */
    const foeMove = chooseMove(battle, foe, mine, skill);
    const foeEntry = { user: foe, target: mine, action: { type: 'move', move: foeMove }, quality: ENEMY_QUALITY };

    /* ---------------- resolve, then narrate ---------------- */
    const log = E.resolveTurn(battle, [myEntry, foeEntry]);
    await play(log);

    /* ---------------- handle knockouts ---------------- */
    if (foe.fainted) {
      const xp = Math.round(25 * foe.level);
      for (const b of myTeam.filter(x => !x.fainted)) {
        b.ref.hp = b.hp;
        for (const ev of party.grantXp(b.ref, Math.round(xp / Math.max(1, myTeam.filter(x => !x.fainted).length)))) {
          if (ev.type === 'level') {
            audio.levelUp();
            say(`<b>${b.name.toUpperCase()}</b> grew to level ${ev.level}!`);
            b.level = ev.level;
            b.maxHp = party.maxHp(b.ref.dex, ev.level);
            await wait(1200);
          } else {
            audio.fanfare();
            say(`What? <b>${ev.from.toUpperCase()}</b> is changing… it evolved into <b>${ev.to.toUpperCase()}</b>!`);
            await wait(1900);
          }
        }
      }
      syncTeam(myTeam);
      showSide(mine, 'mine');

      foeIdx++;
      if (foeIdx >= foeTeam.length) { result = 'win'; break; }
      foe = foeTeam[foeIdx];
      showSide(foe, 'foe');
      say(`${trainer.name} sent out <b>${foe.name.toUpperCase()}</b>!`);
      await wait(1300);
      await play(E.onSwitchIn(battle, foe, mine));
      continue;
    }

    if (mine.fainted) {
      syncTeam(myTeam);
      const next = myTeam.find(b => !b.fainted);
      if (!next) { result = 'lose'; break battle_loop; }
      const options = myTeam.filter(b => !b.fainted);
      const picked = options.length === 1 ? { target: options[0] } : await menu(
        options.map(b => ({ id: 'to:' + b.name, target: b, name: b.name.toUpperCase(),
          blurb: `L${b.level} · ${b.hp}/${b.maxHp} HP` })));
      mine = picked.target;
      showSide(mine, 'mine');
      say(`Go, <b>${mine.name.toUpperCase()}</b>!`);
      await wait(1100);
      await play(E.onSwitchIn(battle, mine, foe));
    }
  }

  syncTeam(myTeam);

  if (result === 'win') {
    audio.fanfare();
    say(`${trainer.name}: ${pick(trainer.lines?.lose ?? ['You really do know your stuff!'])}`);
    if (!profile.beaten.includes(trainer.id)) profile.beaten.push(trainer.id);
    await wait(1900);
    if (trainer.badge && !profile.badges.includes(trainer.badge)) {
      profile.badges.push(trainer.badge);
      audio.badge();
      say(`🏅 You earned the <b>${trainer.badgeName ?? trainer.badge}</b> badge!`);
      await wait(2400);
    }
  } else if (result === 'lose') {
    say('Your whole team is worn out. Everyone heads back to the Study Tent.');
    await wait(2000);
  }

  panel.classList.add('hidden');
  save.saveProfile(profile);
  return result;
}

/** Write battle HP and status back onto the saved party records. */
function syncTeam(team) {
  for (const b of team) {
    b.ref.hp = Math.max(0, b.hp);
    b.ref.status = b.status ?? null;      // status persists out of battle, like the games
  }
}
