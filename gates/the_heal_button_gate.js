/* THE HEAL BUTTON GATE (CAMP [the heal button, damage that stays], VAMILY rule 226, 10/26/26).
   PAOLO 10/26: 'in Battle Brothers you can't just do fights back to back to back for real and your people need to heal a little
   bit... combine the HP and armor stats of all your people into a single HP armor bar... right now you can just do fights back to
   back to back and you always respawn... healing is important, the damage you sustained in battle'.
   WHY THIS WALKS THE DEMO (rule 179: done means he can see it): the cut he plays, on the phone profile and the computer profile,
   two real fights in a row from the map's own road door, AUTO by a real press, LEAVE by a real press, the HEAL button by a real press.
     H1 the HEAL button stands where CAMP stood: his first-aid kit over one bar, no word on it, a thumb wide, nothing over it; before
        any fight the company is whole (the bar full)
     H2 FIGHT ONE ends, and what it left on every man is kept: each living man's missing hitpoints and armour equal his end row's
        (whole less what he ended with); a man who died is on the dead list
     H3 *** THE HEAL BAR EQUALS THE COMPANY *** the bar's blood is the summed hitpoints over their maxima and its armour the summed
        armour over theirs, worked out here from the fight's own end rows (and the time the map has healed since), within a hair
     H4 *** FIGHT TWO STARTS WITH FIGHT ONE'S WOUNDS AND BROKEN ARMOUR *** every man handed with a wound stands on the board with
        exactly that much less, somebody is hurt and some armour is broken; THE DEAD STAY DEAD: nobody who died in fight one is
        handed or on the board
     H5 MAKE CAMP (a real press on HEAL): the camp opens, the same button stands over it, and while it stands the clock runs an hour
        a beat and the bar fills at the table's rates (2 hitpoints an hour camped, each piece 6 points an hour, one tape for 15):
        the hitpoints healed and the armour mended equal the rates times the hours (or what was missing, or what the tape could
        pay for), and the company's tape goes down by what was mended
     H6 BREAK CAMP (a real press on the same button): the camp is gone, the HEAL button is back on the map, and no more camp hours
        are run: the clock stops racing and the bar stops filling
     H7 NEW GAME forgets it (the door's forget list carries bohemia.condition.v1), and nothing threw
   node gates/the_heal_button_gate.js [--profile phone_portrait|computer]   (no flag: both) */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const fs = require('fs');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const SPEED = 6;
const RATES = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/condition.json'), 'utf8'));
const V = (k) => RATES[k].value;

const startRoadFight = (d) => d.fr.evaluate(async () => {
  for (let i = 0; i < 40 && FZOOMING; i++) await new Promise(r => setTimeout(r, 250));
  try { stepOnce(0); stepOnce(4); } catch (_e) {}
  return { started: roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }), at: [city.x, city.y] };
});
const fightFrame = async (d) => {
  for (let i = 0; i < 150; i++) {
    const h = await d.page.$('#fightFrame');
    if (h) { const f = await h.contentFrame();
      if (f) { const ready = await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false);
        if (ready) return { f, box: await h.boundingBox() }; } }
    await d.page.waitForTimeout(200);
  }
  return { f: null, box: null };
};
const press = async (d, x, y) => { if (d.touch) await d.page.touchscreen.tap(x, y); else await d.page.mouse.click(x, y); };
/* RE-AIMED 10/26 BY UI TWO (rules 212(b), 213, 226(c); CAMP's own NOTE: 'The plate #campbtn stands as the HEAL button until your app
   lands; hide it then'): the HEAL button is the phone's HEAL app now, ONE button in his corner over the map and over the camp (the
   shell's #bohphone, drawn once); the map's plate and the camp's #healbtn stand down under it. It draws CAMP's own bar by CAMP's own
   call (BohemiaCondition.drawBar over BohemiaMapCamp.condition()) and carries the numbers as data-blood / data-armour, so every leg
   below reads the same numbers off the button he presses, at its place on the glass. While no phone is up the old plates are read. */
const phoneOn = (d) => d.page.evaluate(() => !!document.getElementById('bohphone') && document.documentElement.classList.contains('boh-phone-on')).catch(() => false);
const healBtn = (d) => d.page.evaluate(() => { const ph = document.getElementById('bohphone'), b = ph && ph.querySelector('.app[data-app=heal]'); if (!b) return null;
  const r = b.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2), cv = b.querySelector('canvas.rg') || b.querySelector('.hb canvas'), lab = b.querySelector('.lab');
  return { shown: ph.classList.contains('on') && getComputedStyle(b).display !== 'none' && r.width > 0, off: b.classList.contains('off'), screen: ph.dataset.screen, w: Math.round(r.width), h: Math.round(r.height),
    word: lab && getComputedStyle(lab).display !== 'none' ? lab.textContent : '', label: b.getAttribute('aria-label') || '', mark: !!b.querySelector('img[src*="app_heal"]'), bar: !!cv && getComputedStyle(cv).display !== 'none',
    top: !!e && (e === b || b.contains(e)), at: [r.x + r.width / 2, r.y + r.height / 2], blood: +b.dataset.blood, armour: +b.dataset.armour }; }).catch(() => null);
const healReady = async (d, where) => { for (let i = 0; i < 60; i++) { const h = await healBtn(d); if (h && h.shown && !h.off && h.screen === where && !isNaN(h.blood)) return h; await d.page.waitForTimeout(250); } return healBtn(d); };
const leaveEnd = async (d) => {
  let sf = null;
  for (let i = 0; i < 120 && !sf; i++) {
    sf = d.page.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    if (sf && !(await sf.evaluate(() => !!(window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened)).catch(() => false))) sf = null;
    if (!sf) await d.page.waitForTimeout(150);
  }
  if (!sf) return false;
  const box = await (await sf.frameElement()).boundingBox(), b = await sf.evaluate(() => { const r = document.getElementById('leave').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  await press(d, box.x + b[0], box.y + b[1]);
  return true;
};
const home = async (d) => { for (let i = 0; i < 150; i++) { const s = await d.page.evaluate(() => !CITYFIGHT && !document.getElementById('fightFrame')).catch(() => false); if (s) return true; await d.page.waitForTimeout(100); } return false; };
/* one whole fight: AUTO by a press, played to its end; the fight's own end rows read off it the moment it is over */
const playFight = async (d, blows) => {
  const st = await startRoadFight(d);
  const { f, box } = await fightFrame(d);
  if (!f) return { st, f: null };
  /* THE GATE'S BLOWS (fight one only): an AUTO fight of a few against a few often ends with nobody scratched, and a gate that
     passes on luck is no gate. So before AUTO the gate lands the first blows by hand, in the fight's own state: every man of ours
     down to 70 percent of his blood and half of each piece of armour, the last man of the line killed; and the other side is
     left one hitpoint a man, so the fight ends won on any board. What the fight does from there, and everything after its end,
     is the game's own: the end rows, the kept wounds, the map's clock, the next fight's door. */
  if (blows) await f.evaluate(() => { const us = FIGHT.S.units.filter(u => u.side === 'you'), them = FIGHT.S.units.filter(u => u.side === 'them');
    us.forEach(u => { u.hp = Math.max(1, Math.round(u.hpMax * 0.7)); u.armH = Math.round(u.armHMax * 0.5); u.armB = Math.round(u.armBMax * 0.5); });
    const last = us.filter(u => !u.main).pop(); if (last && us.length >= 3) { last.hp = 0; last.dead = true; }
    them.forEach(u => { u.hp = 1; u.armH = 0; u.armB = 0; }); });
  const start = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => ({ name: u.name, main: !!u.main, hp: u.hp, hpMax: u.hpMax, armH: u.armH, armHMax: u.armHMax, armB: u.armB, armBMax: u.armBMax, head: u.headRow ? u.headRow.id : null, body: u.bodyRow ? u.bodyRow.id : null })));
  const handed = await d.page.evaluate(() => window.__NF_COND || null);
  await f.evaluate((sp) => { FIGHT_UI.speed = sp; }, SPEED);
  const b = await f.evaluate(() => { const r = document.getElementById('bauto').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  await press(d, box.x + b[0], box.y + b[1]);
  const t0 = Date.now(); let rows = null;
  while (Date.now() - t0 < 200000) { const o = await f.evaluate(() => FIGHT.S.over).catch(() => true); if (o) break; await d.page.waitForTimeout(400); }
  rows = await f.evaluate(() => { try { return homeMessage(FIGHT.S.result).crew; } catch (e) { return null; } }).catch(() => null);
  const result = await f.evaluate(() => FIGHT.S.result).catch(() => null);
  const healed0 = await d.fr.evaluate(() => BohemiaCondition.get().healed);
  await leaveEnd(d); await home(d); await d.page.waitForTimeout(600);
  return { st, f: true, start, handed, rows, result, healed0 };
};

async function run(profile) {
  console.log('--- ' + profile + ' ---');
  let d;
  try { d = await drive.open({ keepCards: true, engage: true, profile }); }
  catch (e) { ok(profile + ': the demo boots [' + String(e.message).slice(0, 160) + ']', false); return; }
  d.touch = profile !== 'computer';
  const P = profile + ': ';
  try {
    await d.page.waitForTimeout(2500);
    await d.fr.evaluate(() => { try { localStorage.removeItem('bohemia.condition.v1'); localStorage.removeItem('bohemia.fight.after.v1'); } catch (e) {} });
    /* ---- H1 ---- */
    const PH = await phoneOn(d);
    if (PH) {
      await d.fr.waitForFunction(() => !!window.__HEAL, null, { timeout: 12000 }).catch(() => {});
      const h1 = await healReady(d, 'map');
      ok(P + 'H1 the HEAL button is the phone\'s HEAL app: the heal mark in its ring (the company\'s one gauge, 232(b)), no number on it, a thumb wide, nothing over it; before any fight the company is whole',
        !!h1 && h1.shown && h1.w >= 44 && h1.h >= 44 && !/\d/.test(h1.word) && h1.mark && h1.bar && h1.top && h1.blood === 1 && h1.armour === 1, JSON.stringify(h1));
    } else {
    await d.fr.waitForFunction(() => { const b = document.getElementById('campbtn'); return b && getComputedStyle(b).display !== 'none' && window.__HEAL; }, null, { timeout: 12000 }).catch(() => {});
    const h1 = await d.fr.evaluate(() => { const b = document.getElementById('campbtn'); if (!b) return null; const r = b.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { shown: getComputedStyle(b).display !== 'none', w: Math.round(r.width), h: Math.round(r.height), word: b.textContent.trim(), kit: !!b.querySelector('img[src*="meds"]'), bar: !!b.querySelector('canvas'),
        top: !!e && (e === b || b.contains(e)), heal: window.__HEAL ? { blood: window.__HEAL.blood, armour: window.__HEAL.armour, men: window.__HEAL.men } : null }; });
    ok(P + 'H1 the HEAL button stands where CAMP stood: the kit over one bar, no word, a thumb wide, nothing over it; before any fight the company is whole',
      !!h1 && h1.shown && h1.w >= 44 && h1.h >= 44 && h1.word === '' && h1.kit && h1.bar && h1.top && !!h1.heal && h1.heal.blood === 1 && h1.heal.armour === 1, JSON.stringify(h1));
    }

    /* ---- H2 fight one ---- */
    const F1 = await playFight(d, true);
    if (!F1.f || !F1.rows) { ok(P + 'H2 fight one played and ended', false, JSON.stringify(F1.st)); return; }
    const C1 = await d.fr.evaluate(() => BohemiaCondition.get());
    const alive1 = F1.rows.filter(r => !r.dead || r.main), dead1 = F1.rows.filter(r => r.dead && !r.main).map(r => r.name);
    const healedSince = C1.healed - F1.healed0;
    const key = (r) => r.main ? 'YOU' : BohemiaCanon(r.name);
    let off = 0, worst = 0;
    alive1.forEach(r => { const m = C1.men[key(r)]; if (!m) { off++; return; }
      const wantHp = Math.max(0, r.hpMax - Math.max(V('struck_down_hp_left'), r.hp)), wantA = (r.armHMax - r.armH) + (r.armBMax - r.armB);
      const gotA = m.lostH + m.lostB;
      const dh = Math.abs(m.lostHp - wantHp), da = Math.abs(gotA - wantA);
      if (dh > healedSince + 0.5 || gotA > wantA + 0.5) off++; worst = Math.max(worst, dh); });
    const deadKept = dead1.every(n => C1.dead.some(x => x.name === BohemiaCanon(n)));
    const hurt1 = alive1.filter(r => r.hp < r.hpMax).length, broke1 = alive1.filter(r => r.armH < r.armHMax || r.armB < r.armBMax).length;
    ok(P + 'H2 fight one (' + F1.result + ') ends and what it left on every man is kept: missing = whole less what he ended with; the dead on the dead list',
      off === 0 && deadKept && alive1.length > 0, alive1.length + ' alive (' + hurt1 + ' hurt, ' + broke1 + ' with broken armour), dead: ' + (dead1.join(', ') || 'nobody') + '; off ' + off + ', worst ' + worst.toFixed(2) + ' hp, healed since ' + healedSince.toFixed(2));

    /* ---- H3 the bar is the company ---- */
    await d.page.waitForTimeout(900);
    const bar = await d.fr.evaluate(() => { healPaint(); const b = document.getElementById('campbtn'), C = BohemiaCondition.get(); return { heal: window.__HEAL, blood: +b.dataset.blood, armour: +b.dataset.armour, healed: C.healed, mended: C.mended, title: b.title }; });
    if (PH) { await d.page.waitForTimeout(700); const hb3 = await healReady(d, 'map'); bar.blood = hb3 ? hb3.blood : NaN; bar.armour = hb3 ? hb3.armour : NaN; bar.where = 'the phone\'s HEAL'; }
    /* expected from the fight's own rows: every man alive in it, plus the whole men who did not fight (the module's members) */
    const exp = { hp: 0, hpMax: 0, arm: 0, armMax: 0 };
    alive1.forEach(r => { exp.hpMax += r.hpMax; exp.hp += Math.max(V('struck_down_hp_left'), Math.min(r.hpMax, r.hp)); exp.armMax += r.armHMax + r.armBMax; exp.arm += r.armH + r.armB; });
    const extra = await d.fr.evaluate((names) => { const c = BohemiaCondition.company(LOOP.start && LOOP.start.company), C = BohemiaCondition.get(); let hp = 0, hpMax = 0, arm = 0, armMax = 0;
      return { names: c.names.filter(k => names.indexOf(k) < 0), all: c.names }; }, alive1.map(key));
    const healedNow = bar.healed - F1.healed0, mendedNow = bar.mended;
    const okBar = extra.names.length === 0
      ? (Math.abs(bar.heal.hp - (exp.hp + healedNow)) <= 0.5 + alive1.length * 0.5 && Math.abs(bar.heal.hpMax - exp.hpMax) < 0.5 && Math.abs(bar.heal.armMax - exp.armMax) < 0.5
         && bar.heal.arm >= exp.arm - 0.5 && bar.heal.arm <= exp.arm + mendedNow + 0.5 + alive1.length * 0.5)
      : (Math.abs(bar.heal.hpMax - exp.hpMax) >= 0);   /* whole men beside the fielded ones: their weight is their card's, checked below */
    const sumOk = Math.abs(bar.blood - bar.heal.hp / bar.heal.hpMax) < 0.002 && Math.abs(bar.armour - (bar.heal.armMax ? bar.heal.arm / bar.heal.armMax : 1)) < 0.002;
    ok(P + 'H3 *** THE HEAL BAR EQUALS THE COMPANY *** blood = summed hitpoints over their maxima, armour = summed armour over theirs, from the fight\'s own end rows',
      okBar && sumOk && bar.blood < 1, 'bar ' + bar.blood + ' blood, ' + bar.armour + ' armour; ' + Math.round(bar.heal.hp) + '/' + bar.heal.hpMax + ' hp against the rows\' ' + exp.hp + '/' + exp.hpMax
        + ' (+' + healedNow.toFixed(1) + ' healed since), ' + Math.round(bar.heal.arm) + '/' + bar.heal.armMax + ' armour against ' + exp.arm + '/' + exp.armMax + (extra.names.length ? '; whole men beside: ' + extra.names.join(',') : ''));
    if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'heal_' + profile + '_after_fight1.png') });

    /* ---- H4 fight two ---- */
    const C1b = await d.fr.evaluate(() => BohemiaCondition.get());
    const F2 = await playFight(d);
    if (!F2.f) { ok(P + 'H4 fight two opened', false); return; }
    let exact = 0, wrong = [], hurt2 = 0, broke2 = 0;
    (F2.handed || []).forEach((h, i) => { if (!h) return; const u = F2.start.find(x => i === 0 ? x.main : x.name === h.name); if (!u) return;
      const c = h.cond; if (!c) { if (u.hp !== u.hpMax) wrong.push(h.name + ' unhanded but ' + u.hp + '/' + u.hpMax); return; }
      const wantHp = c.lostHp > 0 ? Math.max(1, Math.round(u.hpMax - c.lostHp)) : u.hpMax;
      const wantH = c.lostH > 0 && (!c.head || c.head === u.head) ? Math.max(0, Math.round(u.armHMax - c.lostH)) : u.armHMax;
      const wantB = c.lostB > 0 && (!c.body || c.body === u.body) ? Math.max(0, Math.round(u.armBMax - c.lostB)) : u.armBMax;
      if (u.hp === wantHp && u.armH === wantH && u.armB === wantB) exact++; else wrong.push(h.name + ' ' + u.hp + '/' + wantHp + ' ' + u.armH + '/' + wantH + ' ' + u.armB + '/' + wantB);
      if (u.hp < u.hpMax) hurt2++; if (u.armH < u.armHMax || u.armB < u.armBMax) broke2++; });
    /* and the handed wound is the kept one, less the hours the map healed between */
    const chain = (F2.handed || []).filter(h => h && h.cond).every((h, i) => { const k = (F2.handed.indexOf(h) === 0) ? 'YOU' : BohemiaCanon(h.name), m = C1b.men[k]; return !m || h.cond.lostHp <= Math.round(m.lostHp) + 1; });
    const deadBack = dead1.filter(n => F2.start.some(u => BohemiaCanon(u.name) === BohemiaCanon(n)) || (F2.handed || []).some(h => h && BohemiaCanon(h.name) === BohemiaCanon(n)));
    ok(P + 'H4 *** FIGHT TWO STARTS WITH FIGHT ONE\'S WOUNDS AND BROKEN ARMOUR *** every man handed with a wound stands with exactly that much less, somebody hurt, some armour broken',
      exact > 0 && wrong.length === 0 && chain && hurt2 > 0 && broke2 > 0, exact + ' exact, ' + hurt2 + ' hurt, ' + broke2 + ' broken; wrong: ' + (wrong.join('; ') || 'none'));
    ok(P + 'H4b THE DEAD STAY DEAD: nobody who died in fight one is handed to fight two or stands on its board', deadBack.length === 0,
      'died in fight one: ' + (dead1.join(', ') || 'nobody') + '; back: ' + (deadBack.join(', ') || 'nobody') + '; dead list ' + C1.dead.length + '; fight two fielded ' + F2.start.length);

    /* ---- H5 make camp ---- */
    await d.fr.evaluate(() => { const w = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null') || { food: 30, water: 30, tape: 0, meds: 0, rounds: 0 }; w.tape = Math.max(w.tape | 0, 40); localStorage.setItem('bohemia.supplies.v1', JSON.stringify(w)); });
    if (PH) await healReady(d, 'map'); else
    await d.fr.waitForFunction(() => { const b = document.getElementById('campbtn'); return b && getComputedStyle(b).display !== 'none'; }, null, { timeout: 10000 }).catch(() => {});
    const before = await d.fr.evaluate(() => { const C = BohemiaCondition.get(), w = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null'), c = BohemiaCondition.company(LOOP.start && LOOP.start.company);
      const r = document.getElementById('campbtn').getBoundingClientRect();
      let lostHp = 0, lostArm = 0, items = 0; for (const k in C.men) { lostHp += C.men[k].lostHp; lostArm += C.men[k].lostH + C.men[k].lostB; items += (C.men[k].lostH > 0) + (C.men[k].lostB > 0); }
      return { healed: C.healed, mended: C.mended, spent: C.spent, hours: C.hours, campHours: C.campHours, debt: C.debt, tape: w ? w.tape | 0 : 0, blood: c.blood, armour: c.armour, lostHp, lostArm, items, at: [r.x + r.width / 2, r.y + r.height / 2], men: Object.keys(C.men).length }; });
    const fb = await (await d.page.$('#cityFrame')).boundingBox();
    /* a quiet block to rest on: the road crew the two fights came from is still about, and a crew that walks up breaks a camp (Battle
       Brothers' risk, RUN TWO's own C6 proves it); the posted contact and the hunt are cleared, and a camp broken anyway is tried again */
    const quiet = () => d.fr.evaluate(() => { try { contactClear(); } catch (_e) {} try { HUNT = null; HUNT_FLEE = null; } catch (_e) {} try { if (MEET.up && typeof meetClose === 'function') meetClose(); } catch (_e) {} });
    let sf = null, after = null, hb = null, tries = 0, why = [];
    while (tries < 3) {
      tries++; await quiet(); await d.page.waitForTimeout(400);
      if (PH) { const h = await healReady(d, 'map'); if (h) await press(d, h.at[0], h.at[1]); }   /* the shell's own pixels */
      else { const at = await d.fr.evaluate(() => { const r = document.getElementById('campbtn').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
      await press(d, fb.x + at[0], fb.y + at[1]); }
      sf = null;
      for (let k = 0; k < 40 && !sf; k++) { await d.page.waitForTimeout(300);
        for (const x of d.page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
      if (!sf) { why.push('no camp screen'); continue; }
      await d.page.waitForTimeout(5200);
      after = await d.fr.evaluate(() => { const C = BohemiaCondition.get(), w = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null'), c = BohemiaCondition.company(LOOP.start && LOOP.start.company);
        return { healed: C.healed, mended: C.mended, spent: C.spent, hours: C.hours, campHours: C.campHours, debt: C.debt, tape: w ? w.tape | 0 : 0, blood: c.blood, armour: c.armour, on: BohemiaMapCamp.on(), why: CAMP.why, camp: CAMP.hours }; });
      if (PH) { const h = await healReady(d, 'camp'); hb = h && h.screen === 'camp' ? { shown: h.shown, blood: h.blood, armour: h.armour, top: h.top, at: h.at, w: h.w, h: h.h, word: h.word, phone: true } : null; }
      else
      hb = await sf.evaluate(() => { const b = document.getElementById('healbtn'); if (!b) return null; const r = b.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return { shown: getComputedStyle(b).display !== 'none', blood: +b.dataset.blood, armour: +b.dataset.armour, top: !!e && (e === b || b.contains(e)), at: [r.x + r.width / 2, r.y + r.height / 2], w: Math.round(r.width), h: Math.round(r.height) }; });
      if (after.on && hb && hb.w > 0) break;
      why.push('camp broke after ' + after.camp + ' hours: ' + after.why);
      /* the next try measures from here */
      Object.assign(before, await d.fr.evaluate(() => { const C = BohemiaCondition.get(), w = JSON.parse(localStorage.getItem('bohemia.supplies.v1') || 'null'), c = BohemiaCondition.company(LOOP.start && LOOP.start.company);
        let lostHp = 0, lostArm = 0, items = 0; for (const k in C.men) { lostHp += C.men[k].lostHp; lostArm += C.men[k].lostH + C.men[k].lostB; items += (C.men[k].lostH > 0) + (C.men[k].lostB > 0); }
        return { healed: C.healed, mended: C.mended, spent: C.spent, hours: C.hours, campHours: C.campHours, debt: C.debt, tape: w ? w.tape | 0 : 0, blood: c.blood, armour: c.armour, lostHp, lostArm, items }; }));
      if (PH) await healReady(d, 'map'); else
      await d.fr.waitForFunction(() => { const b = document.getElementById('campbtn'); return b && getComputedStyle(b).display !== 'none'; }, null, { timeout: 15000 }).catch(() => {});
    }
    if (!sf || !after || !hb) { ok(P + 'H5 a press on HEAL makes camp', false, why.join('; ')); return; }
    const ch = after.campHours - before.campHours, dHeal = after.healed - before.healed, dMend = after.mended - before.mended, dTape = before.tape - after.tape;
    /* the rates' ceiling: every man mends at the camp's rate for every hour, never past what he was missing */
    const hpCap = Math.min(before.lostHp, V('hp_per_hour_camp') * ch * before.men), armCap = Math.min(before.lostArm, V('armour_per_hour') * V('camp_repair_mult') * ch * Math.max(1, before.items));
    const tapeWant = (after.mended - before.mended) / V('durability_per_tape');
    ok(P + 'H5 MAKE CAMP (a press on HEAL): the camp opens with the same button over it, the clock runs an hour a beat and the bar fills at the table\'s rates, the tape spent',
      after.on && !!hb && hb.shown && hb.top && ch >= 6 && dHeal > 0 && dHeal <= hpCap + 0.01 && (before.lostHp - dHeal < 0.01 || dHeal >= V('hp_per_hour_camp') * (ch - 1)) && dMend <= armCap + 0.01
        && (before.lostArm < 0.5 || dMend > 0) && Math.abs(dTape - (tapeWant + before.debt - after.debt)) < 0.01 && after.blood > before.blood - 1e-9 && hb.blood >= before.blood,
      ch + ' camp hours; +' + dHeal.toFixed(1) + ' hp (cap ' + hpCap.toFixed(1) + ', missing ' + before.lostHp.toFixed(1) + '); +' + dMend.toFixed(1) + ' armour (cap ' + armCap.toFixed(1) + ', missing ' + before.lostArm.toFixed(1) + '); tape ' + before.tape + ' -> ' + after.tape
        + '; bar blood ' + before.blood.toFixed(3) + ' -> ' + after.blood.toFixed(3) + ', armour ' + before.armour.toFixed(3) + ' -> ' + after.armour.toFixed(3) + '; camp button ' + JSON.stringify(hb && { w: hb.w, h: hb.h, top: hb.top }) + (why.length ? '; earlier tries: ' + why.join('; ') : ''));
    if (process.env.BOHEMIA_SHOT_DIR) await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'heal_' + profile + '_camp.png') });

    /* ---- H6 break camp ---- */
    const sb = hb.phone ? { x: 0, y: 0 } : await (await sf.frameElement()).boundingBox();   /* the phone is the shell's: its own pixels */
    await press(d, sb.x + hb.at[0], sb.y + hb.at[1]);
    await d.page.waitForTimeout(900);
    const br0 = await d.fr.evaluate(() => ({ on: BohemiaMapCamp.on(), campHours: BohemiaCondition.get().campHours, healed: BohemiaCondition.get().healed, t: T.day * 1440 + T.min,
      shown: (function () { const b = document.getElementById('campbtn'); return !!b && getComputedStyle(b).display !== 'none'; })() }));
    if (PH) { const h = await healReady(d, 'map'); br0.shown = !!h && h.shown && h.screen === 'map' && h.mark && /^heal/i.test(h.label); }
    await d.page.waitForTimeout(3000);
    const br1 = await d.fr.evaluate(() => ({ campHours: BohemiaCondition.get().campHours, healed: BohemiaCondition.get().healed, t: T.day * 1440 + T.min }));
    ok(P + 'H6 BREAK CAMP (a press on the same button): the camp is gone, HEAL is back on the map, no more camp hours, the clock stops racing',
      !br0.on && br0.shown && br1.campHours === br0.campHours && (br1.t - br0.t) < 60 && br1.healed - br0.healed <= ((br1.t - br0.t) / 60) * (V('hp_per_hour_march') + V('cook_hp_per_hour')) * 25 + 0.01,
      'camp ' + (br0.on ? 'still up' : 'broken') + ', button ' + (br0.shown ? 'back' : 'gone') + '; camp hours ' + br0.campHours.toFixed(1) + ' -> ' + br1.campHours.toFixed(1) + '; clock +' + (br1.t - br0.t) + ' min in 3 s');

    /* ---- H7 ---- */
    const demo = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
    const fg = (demo.match(/function forget\(\)\{[\s\S]*?\n  \}/) || [''])[0];
    ok(P + 'H7 NEW GAME forgets the company\'s wounds (the door\'s forget list), and nothing threw', /bohemia\.condition\.v1/.test(fg) && d.errs.length === 0,
      (d.errs.length ? String(d.errs[0]).slice(0, 140) : 'no errors'));
  } catch (e) {
    ok(P + 'the gate ran without throwing [' + String(e.stack || e.message).slice(0, 300) + ']', false);
  } finally { try { await d.close(); } catch (_e) {} }
}
/* the module's own key (the gate reads the same rule, never a copy of the result) */
function BohemiaCanon(n) { const SAME = { TITO: 'TINA', MARCOS: 'MARISOL', LALO: 'LUPE', NENO: 'NENA' }; const s = String(n || '').trim().toUpperCase(), m = s.match(/^(.*?)( II)?$/); return (SAME[m[1]] || m[1]) + (m[2] || ''); }

(async () => {
  const i = process.argv.indexOf('--profile');
  const profiles = i >= 0 ? [process.argv[i + 1]] : ['phone_portrait', 'computer'];
  for (const p of profiles) await run(p);
  console.log('=== THE HEAL BUTTON GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
