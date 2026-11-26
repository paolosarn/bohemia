/* THE ALPHA SAYS CONTINUE  (UI FIVE, 11/26/26; VAMILY rules 482, 441, 66; ask row 738)

   FOUND BY EYES 11/26: 'after a reload the alpha's front says Three of you and nothing owed. Start clean. 290 BATTERIES, every new
   game's choice (the crew's name, who you were, the fights, the shelves, the valley's code) and no CONTINUE; BEGIN then skipped the
   barber and brought back the game he was playing. The page says a new start, the button continues, the choices do nothing.'

   THE CAUSE: the start screen's title (NEW GAME / CONTINUE / SETTINGS, slices/BOHEMIA_ALPHA_0_9.html __THE_START_SCREEN__) was the
   demo's alone ('the workshop opens on VOTE'), so the workshop over a save showed the new game's door, whose BEGIN continues the save.
   THE FIX (__THE_ALPHA_SAYS_CONTINUE__): over a saved game the workshop shows the title too, CONTINUE through the door's own BEGIN and
   NEW GAME asked once; with no save it keeps its door as before; and a workshop that held no save when it opened writes none before
   BEGIN (the hold FIXES 2 built for the demo, __NO_SAVE_BEFORE_NEW_GAME__), so a reload never offers CONTINUE on a game nobody began.

   On the ALPHA, through the one driver, a phone upright (390 x 844) and on its side (844 x 390):
     A1 A FRESH PHONE: on the door, before BEGIN, no save written and no title (the picks and BEGIN, as before)
     A2 BEGIN writes the save; a RELOAD shows the title, NEW GAME and CONTINUE on the glass, and a tap where a crew sits under it changes nothing
     A3 CONTINUE (a real tap): the game he was playing comes back (the same day) and the workshop lands where it lands after BEGIN
     A4 RELOAD and NEW GAME (a real tap, asked once 'this ends day N', a second tap): the page comes back on the picks, no title, no save
     A5 nothing threw
   PLANTED (upright, the service worker off): the workshop's title taken away again: A2 red.
   node gates/the_alpha_says_continue_gate.js [phone_portrait|phone_landscape] [--no-plant] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 500) + ']' : '')); return g; };
const ARGS = process.argv.slice(2);
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ARGS.some(a => /^phone_/.test(a)) || ARGS.includes(p));

const READ = () => ({ began: !!window.__PLAY_BEGAN, day: (() => { try { const s = CITYSAVE.load(); return s && s.data ? s.data.day : null; } catch (e) { return 'err'; } })(),
  title: !!(window.BOH_TITLE && BOH_TITLE.up()), picks: [...document.querySelectorAll('#front [data-k=origin]')].filter(e => e.getBoundingClientRect().width > 2).length,
  btns: [...document.querySelectorAll('#front [data-k]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight && /^(new|cont|continue)$/.test(e.dataset.k); }).map(e => e.dataset.k + ':' + e.textContent.replace(/\s+/g, ' ').trim().slice(0, 30)),
  front: (() => { const f = document.getElementById('front'); return f ? getComputedStyle(f).display : 'none'; })(),
  tab: ((document.querySelector('.tab.on, [data-tab].on') || {}).textContent || '').trim().slice(0, 20) });
async function tapK(P, k) {
  const c = await P.evaluate(k => { const b = [...document.querySelectorAll('#front [data-k=' + k + ']')].find(e => e.getBoundingClientRect().width > 2); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, k);
  if (c) await P.touchscreen.tap(c[0], c[1]); return !!c;
}

async function walk(profile, plant) {
  const tag = 'the alpha ' + (profile === 'phone_portrait' ? 'upright' : 'on its side');
  console.log('\n' + tag + (plant ? ' PLANTED (the workshop\'s title taken away)' : ''));
  let onDoor = null; const errs = [];
  let d;
  try {
    d = await drive.open({ profile, alpha: true, noWorker: !!plant, beforeTap: async (pg) => { await pg.waitForTimeout(6000); onDoor = await pg.evaluate(READ); },
      beforeGoto: plant ? async (cdp, pg) => { await pg.route(/BOHEMIA_ALPHA_0_9\.html/, async route => { const r = await route.fetch(); const b = (await r.text()).replace("if (!window.__BOHEMIA_DEMO_BUILD && !saved()) { T.skipped = 'workshop'; return; }", "if (!window.__BOHEMIA_DEMO_BUILD) { T.skipped = 'workshop'; return; }"); await route.fulfill({ response: r, body: b }); }); } : undefined });
  } catch (e) { ok(tag + ': the page boots', false, String(e.message).slice(0, 160)); return; }
  const P = d.page; P.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  try {
    await P.waitForTimeout(5000);
    const began = await P.evaluate(READ);
    if (!plant) ok('A1 ' + tag + ' A FRESH PHONE: on the door before BEGIN no save and no title (' + JSON.stringify(onDoor && { day: onDoor.day, title: onDoor.title, picks: onDoor.picks }) + ')', !!onDoor && onDoor.day == null && !onDoor.title && onDoor.picks >= 3);
    await P.reload({ waitUntil: 'load' }); await P.waitForTimeout(7000);
    const r2 = await P.evaluate(READ);
    /* a tap on the door's picks under the title: held */
    const pick = await P.evaluate(() => { const b = [...document.querySelectorAll('#front [data-k=origin]')].find(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.top > 0 && r.bottom < innerHeight; }); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    const onPick = () => P.evaluate(() => { const o = document.querySelector('#front [data-k=origin].on'); return o ? o.textContent.replace(/\s+/g, ' ').trim().slice(0, 30) : null; });
    const sel0 = await onPick();
    if (pick && r2.title) { await P.touchscreen.tap(pick[0], pick[1]); await P.waitForTimeout(500); }
    const r2b = await P.evaluate(READ), sel1 = await onPick();
    const a2 = began.began && began.day >= 1 && r2.title && r2.btns.some(b => /^new/.test(b)) && r2.btns.some(b => /^cont/.test(b)) && r2b.title && !r2b.began;
    if (plant) { ok(tag + ' PLANTED: A2 goes red (after the reload: title ' + r2.title + ', ' + r2.btns.join(', ') + ')', !a2); return; }
    ok('A2 ' + tag + ' BEGIN wrote day ' + began.day + '; a RELOAD shows the title (' + r2.btns.join(', ') + '); a tap where a crew sits under it changes nothing (the crew picked "' + sel0 + '" -> "' + sel1 + '", the title still up ' + r2b.title + ')', a2 && sel0 === sel1);
    await tapK(P, 'cont') || await tapK(P, 'continue');
    await P.waitForTimeout(7000);
    const r3 = await P.evaluate(READ);
    ok('A3 ' + tag + ' CONTINUE (a real tap): the game comes back (day ' + r3.day + ', began ' + r3.began + ', the door ' + r3.front + ', the tab ' + r3.tab + ')', r3.began && r3.day === began.day && r3.front === 'none' && !r3.title);
    await P.reload({ waitUntil: 'load' }); await P.waitForTimeout(7000);
    const n1 = await tapK(P, 'new'); await P.waitForTimeout(800);
    const asked = await P.evaluate(() => (document.getElementById('front').innerText.replace(/\s+/g, ' ').match(/this ends day \d+/i) || [''])[0]);
    const n2 = await tapK(P, 'new'); await P.waitForTimeout(9000);
    const r4 = await P.evaluate(READ);
    ok('A4 ' + tag + ' NEW GAME (asked "' + asked + '", tapped again): the picks (' + r4.picks + '), no title, no save (' + r4.day + ')', n1 && n2 && !!asked && !r4.title && r4.picks >= 3 && r4.day == null && !r4.began);
    ok('A5 ' + tag + ' nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(tag + ' ran', false, String(e.stack).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}

(async () => {
  for (const prof of PROFS) await walk(prof, false);
  if (!ARGS.includes('--no-plant')) await walk('phone_portrait', true);
  console.log('\nTHE ALPHA SAYS CONTINUE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
