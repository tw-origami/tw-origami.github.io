// Battle Lab — the battle stage.
//
// A small arena above the fight panels where the two Pokémon face each other and the turn is
// replayed like a video game: attackers lunge or fire an orb in the move's type colour, the target
// shakes, damage numbers float up, HP bars drain, fainted Pokémon drop out and new ones slide in.
//
// It is only a replay. The referee has already decided everything; this walks the event list it
// produced and shows it. If anything here throws or is skipped, the fight panels (which are drawn
// from the real match state afterwards) are still correct.

const wait = (ms) => new Promise(r => setTimeout(r, ms));

/** The stage markup for whoever is currently out. */
const esc = (t) => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function stageHtml(match, art, { enter = false } = {}) {
  const mon = (i) => {
    const b = match.sides[i].active, a = art(b.mon);
    return `<div class="st-mon st-${i ? 'right' : 'left'} ${b.fainted ? 'gone' : ''} ${enter ? 'entering' : ''}" data-st="${i}">
      <div class="st-art" style="${a.style}">${a.inner}</div><div class="st-shadow"></div></div>`;
  };
  return `<div class="stage" id="stage" aria-hidden="true" data-n0="${esc(match.sides[0].active.name)}" data-n1="${esc(match.sides[1].active.name)}">
    <div class="st-ground"></div>${mon(0)}${mon(1)}<div class="st-fx"></div>
    <div class="st-cap"></div>
    <button class="btn small st-skip" data-act="skip" hidden>⏭ Skip</button>
  </div>`;
}

const STATUS_SHORT = { burn: 'BRN', paralysis: 'PAR', poison: 'PSN', toxic: 'PSN', sleep: 'SLP', freeze: 'FRZ', confusion: 'CONF' };
const STAT_SHORT = { atk: 'Attack', def: 'Defense', spa: 'Sp. Atk', spd: 'Sp. Def', spe: 'Speed', acc: 'Accuracy', eva: 'Evasion' };

/**
 * Replays `events`. Resolves when finished (or skipped). Never rejects.
 *   ctx.match            the match, already in its after-the-turn state
 *   ctx.hp               Map battler name → HP at the start of the replay (mutated as it plays)
 *   ctx.art(mon)         → {style, inner}
 *   ctx.typeColor(type)  → css colour
 *   ctx.moveClass(label) → 'physical' | 'special' | 'status'
 *   ctx.narrate(ev)      → html caption or null
 *   ctx.refreshPanel(i)  redraw fight panel i from the match
 *   ctx.setPanelHp(i, hp, max)
 *   ctx.control          { skipped: boolean } — set true to fast-forward
 */
export async function play(events, ctx) {
  const root = document.getElementById('stage');
  if (!root) return;
  const ctl = ctx.control;
  const skipBtn = root.querySelector('.st-skip');
  if (skipBtn) skipBtn.hidden = false;
  const fx = root.querySelector('.st-fx'), cap = root.querySelector('.st-cap');
  const els = [root.querySelector('[data-st="0"]'), root.querySelector('[data-st="1"]')];
  // who the stage is showing right now (set when it was drawn: whoever was out before the turn)
  const shown = [root.dataset.n0, root.dataset.n1];
  const sideOf = (name) => ctx.match.sides.findIndex(s => s.team.some(b => b.name === name));
  const pause = (ms) => (ctl.skipped ? Promise.resolve() : wait(ms));
  const anim = (el, kf, opt) => {
    if (ctl.skipped || !el || !el.animate) return Promise.resolve();
    try { return el.animate(kf, { fill: 'none', ...opt }).finished.catch(() => {}); } catch { return Promise.resolve(); }
  };
  const center = (el) => { const r = el.getBoundingClientRect(), s = root.getBoundingClientRect(); return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 }; };
  const float = (i, text, cls) => {
    if (ctl.skipped) return;
    const c = center(els[i]), n = document.createElement('div');
    n.className = 'st-float ' + cls; n.textContent = text;
    n.style.left = c.x + 'px'; n.style.top = (c.y - 30) + 'px';
    fx.appendChild(n); setTimeout(() => n.remove(), 1200);
  };
  const setHp = (name, hp, max) => {
    ctx.hp.set(name, hp);
    const i = sideOf(name);
    if (i >= 0 && shown[i] === name) ctx.setPanelHp(i, hp, max ?? 0);
  };
  const maxOf = (name) => ctx.match.sides.flatMap(s => s.team).find(b => b.name === name)?.maxHp ?? 1;
  const hurt = (name, amount) => setHp(name, Math.max(0, (ctx.hp.get(name) ?? 0) - amount), maxOf(name));
  const mend = (name, amount) => setHp(name, Math.min(maxOf(name), (ctx.hp.get(name) ?? 0) + amount), maxOf(name));

  const showMon = (i, battler) => {
    const a = ctx.art(battler.mon);
    const art = els[i].querySelector('.st-art');
    art.setAttribute('style', a.style); art.innerHTML = a.inner;
    els[i].classList.remove('gone');
  };

  let last = null;
  try {
    for (const ev of events) {
      if (ctl.skipped) break;
      const text = ctx.narrate(ev);
      if (text) cap.innerHTML = text;
      switch (ev.t) {
        case 'lead':
        case 'sendOut': {
          const b = ctx.match.sides[ev.side].team.find(x => x.name === ev.name);
          if (!b) break;
          if (ev.from && !ctl.skipped) await anim(els[ev.side], [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.2)', opacity: 0 }], { duration: 220 });
          shown[ev.side] = ev.name;
          showMon(ev.side, b);
          ctx.refreshPanel(ev.side);
          setHp(ev.name, ctx.hp.get(ev.name) ?? b.hp, b.maxHp);
          await anim(els[ev.side], [{ transform: 'translateX(' + (ev.side ? 80 : -80) + 'px) scale(.3)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.2,1.4,.4,1)' });
          await pause(150);
          break;
        }
        case 'move': {
          const i = sideOf(ev.who);
          if (i < 0) break;
          last = { i, type: ev.moveType, cls: ctx.moveClass(ev.move) };
          const col = ctx.typeColor(ev.moveType);
          const dir = i ? -1 : 1;
          if (last.cls === 'physical') {
            await anim(els[i], [{ transform: 'none' }, { transform: `translateX(${-dir * 14}px)`, offset: .25 },
              { transform: `translateX(${dir * 120}px) scale(1.08)`, offset: .6 }, { transform: 'none' }], { duration: 480, easing: 'ease-in-out' });
          } else if (last.cls === 'special') {
            const a = center(els[i]), b = center(els[1 - i]);
            const orb = document.createElement('div');
            orb.className = 'st-orb'; orb.style.setProperty('--oc', col);
            orb.style.left = a.x + 'px'; orb.style.top = a.y + 'px';
            fx.appendChild(orb);
            await anim(els[i], [{ transform: 'none' }, { transform: `scale(1.1)` }, { transform: 'none' }], { duration: 220 });
            await anim(orb, [{ transform: 'translate(-50%,-50%) scale(.5)', opacity: .9 },
              { transform: `translate(calc(-50% + ${b.x - a.x}px), calc(-50% + ${b.y - a.y}px)) scale(1.2)`, opacity: 1 }],
              { duration: 380, easing: 'ease-in', fill: 'forwards' });
            orb.remove();
          } else {
            await anim(els[i], [{ boxShadow: `0 0 0 0 ${col}` }, { boxShadow: `0 0 0 26px transparent` }], { duration: 520 });
            await anim(els[i], [{ transform: 'none' }, { transform: 'translateY(-14px)' }, { transform: 'none' }], { duration: 300 });
          }
          break;
        }
        case 'damage': {
          const i = sideOf(ev.who);
          if (i < 0) break;
          const hit = anim(els[i], [{ transform: 'none', filter: 'none' },
            { transform: 'translateX(-10px)', filter: 'brightness(3)', offset: .2 }, { transform: 'translateX(9px)', offset: .4 },
            { transform: 'translateX(-6px)', filter: 'brightness(1.6)', offset: .6 }, { transform: 'none', filter: 'none' }], { duration: 420 });
          float(i, '-' + ev.dmg, ev.crit ? 'st-crit' : (ev.typeMult > 1 ? 'st-sup' : 'st-dmg'));
          setHp(ev.who, Math.max(0, ev.hpLeft), ev.maxHp);
          await hit;
          await pause(180);
          break;
        }
        case 'heal': { const i = sideOf(ev.who); mend(ev.who, ev.amount); float(i, '+' + ev.amount, 'st-heal'); await pause(450); break; }
        case 'recoil': case 'statusHurt': case 'weatherHurt': {
          const i = sideOf(ev.who); hurt(ev.who, ev.amount); float(i, '-' + ev.amount, 'st-dmg');
          await anim(els[i], [{ filter: 'none' }, { filter: 'brightness(2)' }, { filter: 'none' }], { duration: 300 });
          await pause(250); break;
        }
        case 'confusedHit': { const i = sideOf(ev.who); hurt(ev.who, ev.dmg); float(i, '-' + ev.dmg, 'st-dmg'); await pause(500); break; }
        case 'miss': {
          const i = last ? 1 - last.i : 0;
          float(i, 'Miss!', 'st-note');
          await anim(els[i], [{ transform: 'none' }, { transform: `translateX(${i ? 40 : -40}px)` }, { transform: 'none' }], { duration: 300 });
          await pause(250); break;
        }
        case 'noEffect': float(sideOf(ev.who), 'No effect', 'st-note'); await pause(600); break;
        case 'status': float(sideOf(ev.who), STATUS_SHORT[ev.status] ?? ev.status, 'st-status'); await pause(600); break;
        case 'stat': {
          const i = sideOf(ev.who);
          float(i, `${STAT_SHORT[ev.stat] ?? ev.stat} ${ev.stage > 0 ? '▲' : '▼'}`, ev.stage > 0 ? 'st-up' : 'st-down');
          await pause(550); break;
        }
        case 'faint': {
          const i = sideOf(ev.who);
          if (i >= 0 && shown[i] === ev.who) {
            ctx.setPanelHp(i, 0, maxOf(ev.who));
            await anim(els[i], [{ transform: 'none', opacity: 1 }, { transform: 'translateY(60px) rotate(' + (i ? 12 : -12) + 'deg)', opacity: 0 }], { duration: 650, fill: 'forwards' });
            els[i].classList.add('gone');
          }
          await pause(200); break;
        }
        case 'ability': case 'abilityImmune': case 'abilityAbsorb': case 'weather':
        case 'charge': case 'recharge': case 'flinch': case 'asleep': case 'frozen': case 'fullPara': case 'protect': case 'blocked':
          if (text) await pause(750);
          break;
        default:
          if (text) await pause(350);
      }
    }
  } catch { /* the replay is decoration; the panels are drawn from the real state next */ }
  if (skipBtn) skipBtn.hidden = true;
}
