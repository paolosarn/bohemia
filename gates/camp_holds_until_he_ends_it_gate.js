/* CAMP HOLDS UNTIL HE ENDS IT GATE (CAMP [camp holds until he ends it], VAMILY rule 267(a)(d), 10/26/26).
   PAOLO 10/26: 'when I click the camp button it wants to stop having me in camp mode, I hate that, unless an enemy pulls up on me...
   even when I'm in camp mode it keeps making me go out to the city mode, I'm trying to heal'.
   On the cut he plays, phone and computer, the camp made on the map with the HEAL button's own call:
     H1 STRAIGHT AFTER A FIGHT: the contact flag a won fight leaves up until his next step (CITY_CONTACT_POSTED, nothing behind it)
        is up when he makes camp: the camp stands twelve camped hours, its clock runs, and the valley's crews walk while he rests
     H2 A CREW TWO BLOCKS OFF: a hunting crew held two blocks from the camp for twelve camped hours: the camp stands, one of his men
        says who and how far in the camp (from his mouth, with his face), and says it once, not every hour
     H3 EVERY PANEL: every place in the camp tapped open and closed, the company screen opened and closed: the camp stands, its hours
        go on
     H4 HIS TAP ENDS IT: the phone's HEAL app (a real tap; it stands for the camp's HEAL button and BREAK CAMP while the phone is on,
        UI TWO's rule 286(b)) breaks it the beat he taps, back on the map; the camp's own BREAK CAMP where the phone is not up
     H5 A TRAVEL ENDS IT: camped again, a travel (the phone's GO, travelTo) breaks it and the march goes
     H6 AN ENEMY REACHING IT ENDS IT: camped again, the crew walks the last block: the camp breaks on the meet card, which is up on the
        map (or the fight itself where the card is not dealt: the crew caught him)
     H7 nothing threw
   node gates/camp_holds_until_he_ends_it_gate.js [--profile phone_portrait|computer]   (no flag: both) */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const HOURS = 12;

async function campFrame(d) {
  for (let k = 0; k < 50; k++) {
    for (const x of d.page.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
      if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && BohemiaSettlement.ready(); } catch (e) { return false; } }).catch(() => false)) return x;
    await d.page.waitForTimeout(300);
  }
  return null;
}
/* the map at rest: no town open, no card, no hunter of the world's own */
const REST = () => { try { if (typeof loopClose === 'function') loopClose(); } catch (e) {} try { if (MEET.up && typeof meetFallBack === 'function') { const m = MEET.up.msg; try { MEET.up.el.remove(); } catch (e) {} MEET.up = null; meetFallBack(m); } } catch (e) {}
  try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} };
const HOURS_NOW = () => BohemiaMapCamp.state();

async function run(profile) {
  console.log('--- ' + profile + ' ---');
  let d;
  try { d = await drive.open({ keepCards: true, engage: true, profile }); }
  catch (e) { ok(profile + ': the demo boots [' + String(e.message).slice(0, 160) + ']', false); return; }
  const P = profile + ': ';
  const tapIn = async (fr, sel, xy) => { const loc = fr.locator(sel).first(); const r = await loc.boundingBox(); if (!r) return false;
    const box = await fr.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { l: b.left, t: b.top }; }, sel);
    const pos = xy ? { x: xy.x - box.l, y: xy.y - box.t } : undefined;
    if (profile === 'phone_portrait') await loc.tap(pos ? { position: pos } : {}); else await loc.click(pos ? { position: pos } : {}); return true; };
  try {
    await d.page.waitForTimeout(2500);
    /* ---- H1 straight after a fight ---- */
    await d.fr.evaluate(REST); await d.page.waitForTimeout(600);
    const h1a = await d.fr.evaluate(() => { CITY_CONTACT_POSTED = true; const made = BohemiaMapCamp.make(); return { made, min: T.day * 1440 + T.min }; });
    await d.page.waitForTimeout(500 * HOURS + 1500);
    const h1 = await d.fr.evaluate(() => Object.assign(BohemiaMapCamp.state(), { flag: CITY_CONTACT_POSTED, min: T.day * 1440 + T.min, last: window.__CAMP || null }));
    ok(P + 'H1 *** STRAIGHT AFTER A FIGHT *** (the won fight\'s contact flag up, no enemy behind it): the camp stands ' + HOURS + ' camped hours, its clock runs, the flag is down so the valley walks',
      h1a.made && h1.on && h1.hours >= HOURS && h1.min - h1a.min >= HOURS * 60 && !h1.flag, JSON.stringify({ made: h1a.made, on: h1.on, hours: h1.hours, mins: h1.min - h1a.min, flag: h1.flag, why: h1.why }));
    /* ---- H2 a crew two blocks off ---- */
    const cf = await campFrame(d);
    const h2a = await d.fr.evaluate(() => { const at = [city.x + 2, city.y], h = { id: 'hunt:gate', ev: null, name: 'The Gate Crew', arch: 'human', count: 3, made: performance.now() };
      Object.defineProperty(h, 'at', { get: () => at.slice(), set: () => {}, enumerable: true });   /* it passes two blocks off and never closes */
      Object.defineProperty(h, 'steps', { get: () => 0, set: () => {}, enumerable: true });
      HUNT = h; window.__CAMP_WARNED = []; return BohemiaMapCamp.state().hours; });
    if (process.env.BOHEMIA_SHOT_DIR) { await d.page.waitForTimeout(1300); await d.page.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp_warned_' + profile + '.png') }); }
    await d.page.waitForTimeout(500 * HOURS + 1500);
    const h2 = await d.fr.evaluate(() => Object.assign(BohemiaMapCamp.state(), { warned: (window.__CAMP_WARNED || []).length, dist: (window.__CAMP_WARNED || [])[0] ? __CAMP_WARNED[0].dist : null }));
    const w2 = cf ? await cf.evaluate(() => { const o = document.getElementById('campwarn'), W = window.__CAMP_WARN || null;
      return { n: W ? W.n : 0, line: W ? W.line : '', by: W ? W.by : '', card: !!o, face: !!(o && o.querySelector('canvas.face')), name: o ? (o.querySelector('.nm') || {}).textContent : '' }; }) : null;
    ok(P + 'H2 *** A CREW TWO BLOCKS OFF *** for ' + HOURS + ' camped hours: the camp stands, one of his men says who and how far in the camp (his face, his name), once',
      h2.on && h2.hours - h2a >= HOURS && h2.warned === 1 && h2.dist === 2 && !!w2 && w2.n === 1 && /The Gate Crew/.test(w2.line) && /Two blocks off/.test(w2.line) && (w2.card ? w2.face : true),
      JSON.stringify({ on: h2.on, hours: h2.hours - h2a, warned: h2.warned, dist: h2.dist, said: w2 }));
    await d.fr.evaluate(() => { HUNT = null; });
    /* ---- H3 every panel ---- */
    let h3 = { opened: [], err: 'no camp frame' };
    if (cf) {
      const order = await cf.evaluate(() => BohemiaSettlement.order());
      h3 = { opened: [], order };
      for (const k of order) { const xy = await cf.evaluate((k) => BohemiaSettlement.where(k), k); if (!xy) continue;
        const box = await (await cf.frameElement()).boundingBox();   /* a finger on the building, in the page's own pixels (the camp gate's way) */
        if (profile === 'phone_portrait') await d.page.touchscreen.tap(box.x + xy.x, box.y + xy.y); else await d.page.mouse.click(box.x + xy.x, box.y + xy.y);
        await cf.waitForTimeout(700);
        const shown = await cf.evaluate(() => document.getElementById('sheet').classList.contains('on'));
        /* the X: where it is against the phone the shell draws over the game (for UI's board), then closed by its own click, the camp
           gate's way (closing is not what this leg measures; the camp standing through it is) */
        if (shown) { const xr = await cf.evaluate(() => { const c = document.getElementById('close'), r = c && c.getBoundingClientRect(); return r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; });
          const box = await (await cf.frameElement()).boundingBox(), ph = await d.page.evaluate(() => { const e = document.getElementById('bohphone'), r = e && e.getBoundingClientRect(); return r && r.width ? { x: r.left, y: r.top, w: r.width, h: r.height } : null; });
          if (xr && box) { const X = { x: box.x + xr.x, y: box.y + xr.y, w: xr.w, h: xr.h }; h3.x = h3.x || { at: [Math.round(X.x), Math.round(X.y)], underPhone: !!ph && X.x + X.w > ph.x && X.x < ph.x + ph.w && X.y + X.h > ph.y && X.y < ph.y + ph.h }; } }
        await cf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); });
        await cf.waitForTimeout(400); h3.opened.push(k + (shown ? '' : '(no sheet)')); }
      await cf.evaluate(() => { try { BohemiaCrewDoor.open({ onDone: () => {} }); } catch (e) {} }); await cf.waitForTimeout(2500);
      h3.crew = await cf.evaluate(() => BohemiaCrewDoor.isOpen()); await cf.evaluate(() => BohemiaCrewDoor.close()); await cf.waitForTimeout(600);
    }
    const h3a = await d.fr.evaluate(HOURS_NOW); await d.page.waitForTimeout(2500); const h3b = await d.fr.evaluate(HOURS_NOW);
    ok(P + 'H3 *** EVERY PANEL *** opened and closed (every place in the camp, the company screen): the camp stands and its hours go on',
      !!cf && h3.opened.filter(k => !/no sheet/.test(k)).length >= 2 && h3.crew && h3b.on && h3b.hours > h3a.hours, JSON.stringify(Object.assign(h3, { on: h3b.on, hours: [h3a.hours, h3b.hours] })));
    /* ---- H4 his tap ends it: the phone's HEAL app (where the HEAL button is while the phone is on), and the camp's BREAK CAMP ---- */
    const state = () => d.fr.evaluate(() => ({ on: BohemiaMapCamp.on(), why: (window.__CAMP || {}).why, frame: LOOP.frame ? LOOP.frame.style.display : null }));
    const tapHeal = async () => { for (const x of d.page.frames()) { const sel = '#bohphone .app[data-app=heal]';
        if (await x.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }, sel).catch(() => false)) return await tapIn(x, sel); }
      return false; };
    let h4 = { phone: await tapHeal() };
    await d.page.waitForTimeout(900); h4 = Object.assign(h4, await state());
    /* and the camp's own BREAK CAMP: on the glass only when the phone is not up (UI TWO, rule 286(b): no button twice; with the phone
       up its HEAL is the camp's break) */
    await d.fr.evaluate(REST); await d.page.waitForTimeout(400);
    await d.fr.evaluate(() => BohemiaMapCamp.make()); const cf4 = await campFrame(d); let h4b = { leave: false };
    if (cf4) { const phoneOn = await d.page.evaluate(() => document.documentElement.classList.contains('boh-phone-on'));
      const shown = await cf4.evaluate(() => { const b = document.getElementById('leave'), r = b && b.getBoundingClientRect(); return !!b && r.width > 0 && r.height > 0 && getComputedStyle(b).visibility !== 'hidden'; });
      h4b.phoneOn = phoneOn; h4b.breakCampShown = shown;
      h4b.leave = phoneOn ? (!shown && await tapHeal()) : await tapIn(cf4, '#leave');
      await d.page.waitForTimeout(900); h4b = Object.assign(h4b, await state()); }
    ok(P + 'H4 HIS TAP ENDS IT: the phone\'s HEAL app, tapped, breaks camp and he is on the map, and again a camp later (the camp\'s own BREAK CAMP is off the glass while the phone is up, rule 286(b); without the phone it breaks it)',
      h4.phone && h4.on === false && h4.why === 'left' && h4.frame === 'none' && h4b.leave && h4b.on === false && h4b.why === 'left' && h4b.frame === 'none', JSON.stringify({ heal: h4, again: h4b }));
    /* ---- H5 a travel ends it ---- */
    await d.fr.evaluate(REST); await d.page.waitForTimeout(500);
    const h5 = await d.fr.evaluate(async () => { const made = BohemiaMapCamp.make(); await new Promise(r => setTimeout(r, 1200));
      let to = null; for (const [dx, dy] of [[3, 0], [-3, 0], [0, 3], [0, -3], [2, 2], [-2, -2], [4, 0], [0, 4]]) if (cityWalkable(city.x + dx, city.y + dy) && !loopTownAt(city.x + dx, city.y + dy, 0)) { to = [city.x + dx, city.y + dy]; break; }
      const went = to ? !!travelTo(0, 0, to) : false;
      return { made, went, on: BohemiaMapCamp.on(), why: (window.__CAMP || {}).why, travel: !!TRAVEL, frame: LOOP.frame ? LOOP.frame.style.display : null }; });
    ok(P + 'H5 A TRAVEL ENDS IT: camped, a travel breaks camp and the march goes', h5.made && h5.went && !h5.on && h5.why === 'travel' && h5.travel && h5.frame === 'none', JSON.stringify(h5));
    /* ---- H6 an enemy reaching it ends it ---- */
    await d.fr.evaluate(REST); await d.page.waitForTimeout(500);
    const h6a = await d.fr.evaluate(() => { window.__H6C = window.__HUNT_CAUGHT | 0; const made = BohemiaMapCamp.make(); let at = null;
      for (const [dx, dy] of [[2, 0], [-2, 0], [0, 2], [0, -2], [1, 0], [0, 1], [-1, 0], [0, -1]]) if (cityWalkable(city.x + dx, city.y + dy)) { at = [city.x + dx, city.y + dy]; break; }
      HUNT = { id: 'hunt:gate2', ev: null, name: 'The Gate Crew', arch: 'human', count: 3, at: at || [city.x + 2, city.y], steps: 0, made: performance.now() }; return { made }; });
    let h6 = null; for (let k = 0; k < 24; k++) { await d.page.waitForTimeout(500); h6 = await d.fr.evaluate(() => ({ on: BohemiaMapCamp.on(), why: (window.__CAMP || {}).why, meet: !!MEET.up, frame: LOOP.frame ? LOOP.frame.style.display : null, fighting: !!LOOP.fighting, caught: (window.__HUNT_CAUGHT | 0) - (window.__H6C | 0) })); if (!h6.on) break; }
    ok(P + 'H6 AN ENEMY REACHING IT ENDS IT: the crew walks in, the camp breaks on the meet card, up on the map', h6a.made && h6 && !h6.on && h6.why === 'contact' && (h6.meet || h6.fighting || h6.caught > 0) && h6.frame === 'none', JSON.stringify(h6));
    await d.fr.evaluate(REST);
    ok(P + 'H7 nothing threw', d.errs.length === 0, d.errs.length ? String(d.errs[0]).slice(0, 160) : 'no errors');
  } catch (e) {
    ok(P + 'the gate ran without throwing [' + String(e.stack || e.message).slice(0, 300) + ']', false);
  } finally { try { await d.close(); } catch (_e) {} }
}

(async () => {
  const i = process.argv.indexOf('--profile');
  const profiles = i >= 0 ? [process.argv[i + 1]] : ['phone_portrait', 'computer'];
  for (const p of profiles) await run(p);
  console.log('=== CAMP HOLDS UNTIL HE ENDS IT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
