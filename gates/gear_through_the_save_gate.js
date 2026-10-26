#!/usr/bin/env node
/* GEAR THROUGH THE SAVE (COMBAT [gear never vanishes], rule 191(b), what was left after 80ba31e1: 'the save and the next fight';
   Paolo 10/25: 'in the first fight I had my spear and car-door shield, and in the third fight it disappeared, it was so creepy';
   records/BOHEMIA_PAOLO_SHOOTERS_TAKE_THE_BEST_SHOT_AND_GEAR_NEVER_VANISHES_10_25_26.md).
   GEAR NEVER VANISHES holds ten fights in a row on pieces of his path cut from the demo. This plays the DEMO ITSELF, the way his
   phone does it, with the crash he names (rules 141, 173) in the middle: the company's own screen from the map's bar, the spear
   and the car door dragged into one man's hands, DONE; a road fight through the game's one door, won, the spoils LEFT; then the
   tab KILLED (chrome://crash: no pagehide, no last word) and the link opened again on the same phone, CONTINUE on the title; the
   next fight; killed again; the fight after. In every fight he stands in, the spear is in his hand and the door on his arm; after
   every fight and every reopening, the company the door hands the fight carries both.
   Legs, on his phone (390 x 844 at 3x) and his computer (1440 x 900):
   S1 the drag on the real crew screen puts the spear in his hand and the door on his arm, and DONE keeps them;
   S2 fights one, two and three, the tab killed and reopened by CONTINUE between them: both in his hands in every fight, both in
      the company after every fight and every reopening;
   S3 nothing threw.
   Run: node gates/gear_through_the_save_gate.js [--profile phone_portrait|computer] */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== GEAR THROUGH THE SAVE GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const SPEAR = 'militia_spear', CAR_DOOR = 'wooden_shield', FIGHTS = 3;
const argv = process.argv, only = argv.indexOf('--profile') > 0 ? argv[argv.indexOf('--profile') + 1] : null;

async function waitFor(page, fn, ms) { const s = Date.now(); while (Date.now() - s < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; }

/* the company's screen, from the map, the way the bar opens it; the roster's frame when it is ready */
async function crewScreen(d) {
  await d.fr.evaluate(() => new Promise(res => { const go = () => { try { if (!BohemiaCrewDoor.isOpen()) BohemiaCrewDoor.open({ base: '' }); } catch (e) {} res(true); };
    if (window.BohemiaCrewDoor) return go(); const sc = document.createElement('script'); sc.src = '../engine/bohemia_crew_door.js'; sc.onload = go; document.head.appendChild(sc); }));
  let R = null;
  await waitFor(d.page, async () => { R = d.page.frames().find(f => /ROSTER_SCREEN/.test(f.url())); return !!R && await R.evaluate(() => !!(window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready)); }, 40000);
  await d.page.waitForTimeout(500);
  return R;
}
const company = (d, who) => d.fr.evaluate(n => { const co = JSON.parse(localStorage.getItem('bohemia.company.v1') || 'null') || [], c = co.find(m => m.name === n); return c ? { main: c.gear && c.gear.main, off: c.gear && c.gear.off } : null; }, who);

/* a road fight through the game's one door; his man's hands read in the fight; the fight won, the spoils left */
async function roadFight(d, who) {
  const page = d.page, fr = d.fr;
  await fr.evaluate(() => { try { contactClear(); } catch (e) {} try { roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); } catch (e) {} });
  let f = null;
  await waitFor(page, async () => { const h = await page.$('#fightFrame'); if (!h) return false; const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0)) { f = c; return true; } return false; }, 90000);
  if (!f) return { none: true };
  const held = await f.evaluate(n => { const u = FIGHT.S.units.find(v => v.side === 'you' && v.name === n); return u ? { main: u.weapon && (u.weapon.of || u.weapon).id, off: u.shield ? u.shield.id : null, back: u.shieldBack ? u.shieldBack.id : null } : { off_the_line: true }; }, who);
  await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {});
  await waitFor(page, () => page.evaluate(() => !CITYFIGHT || !!(window.SPOILS && SPOILS.frame)), 20000);
  await page.evaluate(() => { try { if (typeof spoilsLeave === 'function') spoilsLeave(); else nfHome(); } catch (e) {} }).catch(() => {});
  await waitFor(page, () => page.evaluate(() => !CITYFIGHT), 20000);
  await page.waitForTimeout(1500);
  await fr.evaluate(() => { try { contactClear(); } catch (e) {} });
  return held;
}

(async () => {
  const errs = [];
  for (const profile of ['phone_portrait', 'computer']) {
    if (only && only !== profile) continue;
    const tag = profile === 'computer' ? 'COMPUTER' : 'PHONE';
    let d = null;
    try {
      d = await D.open({ file: 'BOHEMIA_DEMO.html', profile, engage: true });
      await d.page.waitForTimeout(2500);
      /* S1: the crew screen, the spear and the door in the stash as the market leaves them, dragged into one man's hands, DONE */
      let R = await crewScreen(d);
      if (!R) throw new Error('the crew screen never opened');
      const who = await R.evaluate(() => { const S = BohemiaRosterScreen.state, on = S.front.concat(S.back).filter(i => i != null).map(i => S.crew[i]).filter(m => m && !m.main && !m.dead); return on[0] ? on[0].name : null; });
      if (!who) throw new Error('no man of his but YOU on the line');
      await R.evaluate(a => { const C = window.BohemiaRoster, S = BohemiaRosterScreen.state; S.bag.push(C.itemOf('weapon', a.main)); S.bag.push(C.itemOf('shield', a.off));
        localStorage.setItem('bohemia.bag.v1', JSON.stringify(S.bag)); BohemiaRosterScreen.choose(S.sel); }, { main: SPEAR, off: CAR_DOOR });
      await d.page.waitForTimeout(400);
      const fl = d.page.frameLocator('#cityFrame').frameLocator('#crewdoor iframe');
      const centre = async (loc) => { await loc.scrollIntoViewIfNeeded(); const q = await loc.boundingBox(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; };
      const press = async (a) => { if (profile === 'computer') await d.page.mouse.click(a.x, a.y); else await d.page.touchscreen.tap(a.x, a.y); await d.page.waitForTimeout(400); };
      const drag = async (a, z) => { await d.page.mouse.move(a.x, a.y); await d.page.mouse.down(); await d.page.mouse.move(a.x + 10, a.y - 10, { steps: 3 }); await d.page.mouse.move(z.x, z.y, { steps: 14 }); await d.page.mouse.up(); await d.page.waitForTimeout(400); };
      await press(await centre(fl.locator('#lines .cell.full[aria-label="' + who + '"]').first()));
      const nameOf = id => R.evaluate(id => { const it = BohemiaRosterScreen.state.bag.find(i => i && i.id === id); return it && it.name; }, id);
      const n1 = await nameOf(SPEAR), n2 = await nameOf(CAR_DOOR);
      await drag(await centre(fl.locator('#bag .slot.full[aria-label="' + n1 + '"]').first()), await centre(fl.locator('#card .gslot[data-slot="main"]').first()));
      await drag(await centre(fl.locator('#bag .slot.full[aria-label="' + n2 + '"]').first()), await centre(fl.locator('#card .gslot[data-slot="off"]').first()));
      const onScreen = await R.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(x => x.name === n); return m ? { main: m.gear.main && m.gear.main.id, off: m.gear.off && m.gear.off.id } : null; }, who);
      await press(await centre(fl.locator('#done')));
      await waitFor(d.page, () => d.fr.evaluate(() => !(window.BohemiaCrewDoor && BohemiaCrewDoor.isOpen())), 10000);
      const kept = await company(d, who);
      leg(!!onScreen && onScreen.main === SPEAR && onScreen.off === CAR_DOOR && !!kept && kept.main === SPEAR && kept.off === CAR_DOOR,
        '*** S1 ' + tag + ': THE DRAG PUTS THE SPEAR AND THE CAR DOOR IN ' + who + '\'S HANDS, AND DONE KEEPS THEM *** (the real crew screen, from the map)',
        'screen ' + JSON.stringify(onScreen) + ', the company ' + JSON.stringify(kept));
      /* S2: fight, crash, CONTINUE, fight, crash, CONTINUE, fight */
      const rows = [], bad = [];
      for (let k = 1; k <= FIGHTS; k++) {
        const held = await roadFight(d, who);
        const after = await company(d, who);
        const both = held && held.main === SPEAR && held.off === CAR_DOOR;
        if (!held || held.none) bad.push('fight ' + k + ' never opened');
        else if (held.off_the_line) bad.push('fight ' + k + ': ' + who + ' not on the line');
        else if (!both) bad.push('fight ' + k + ' held ' + JSON.stringify(held));
        if (!after || after.main !== SPEAR || after.off !== CAR_DOOR) bad.push('after fight ' + k + ' the company ' + JSON.stringify(after));
        rows.push(k + ':' + (both ? 'both' : 'MISSING'));
        if (k < FIGHTS) {
          await d.page.waitForTimeout(3000);   /* the save after a fight's end (rule 141(c)) has its moment */
          await d.page.goto('chrome://crash').catch(() => {});
          await new Promise(r => setTimeout(r, 600));
          const old = d; d = await D.open({ file: 'BOHEMIA_DEMO.html', profile, engage: true, again: old });
          await d.page.waitForTimeout(2500);
          const back = await company(d, who);
          rows.push('crash>' + (d.title && d.title.via || '?'));
          if (!d.title || d.title.via !== 'continue') bad.push('reopened ' + k + ' by ' + (d.title && d.title.via) + ', not CONTINUE');
          if (!back || back.main !== SPEAR || back.off !== CAR_DOOR) bad.push('reopened ' + k + ', the company ' + JSON.stringify(back));
        }
      }
      leg(bad.length === 0, '*** S2 ' + tag + ': THREE FIGHTS, THE TAB KILLED AND REOPENED BY CONTINUE BETWEEN THEM: THE SPEAR AND THE CAR DOOR NEVER VANISH *** (rule 191(b); rules 141(c), 173)',
        who + ' ' + rows.join(' ') + (bad.length ? ' | ' + bad.slice(0, 3).join('; ') : ''));
      errs.push.apply(errs, (d.errs || []).map(e => tag + ': ' + e));
    } catch (e) { leg(false, '  ' + tag + ' ran', String(e.message).slice(0, 200)); }
    finally { if (d) await d.close().catch(() => {}); }
  }
  leg(errs.length === 0, 'S3 nothing threw', errs.slice(0, 3).join(' | '));
  done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
