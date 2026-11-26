/* THE UI HOLDS ITS FRAMES  (UI FIVE, 11/26/26; VAMILY rule 480(b)(c), rules 400, 441, 444(c))

   PAOLO 11/26: 'Lets turn up full sweep. But improve on what we already have. And make sure fps is never choppy for nothing lets go'.

   MEASURED (the demo upright, a phone 390 x 844, the CPU slowed four times, the GPU drawing the canvases): a shop standing open drew
   about 11 frames a second, tapping a weapon 9, its long card 9, a buy 9, the crew screen 6 to 7. The biggest thing on the page's
   thread in every one of them was the town's own picture, drawn every frame under a sheet that hid all of it but a 22 px band of
   rooftops, and under the crew screen, which hides all of it.
   THE FIX (slices/BOHEMIA_SETTLEMENT_SCREEN.html __THE_TOWN_RESTS_UNDER_ITS_SHEET__): while the shop's sheet is open, still, opaque and
   hides the town's picture but for 6% or less, the town draws eight times a second (nothing at all when it hides every pixel); under
   the crew screen settled over the whole glass it draws nothing; the frame either starts to go, it draws every frame again. Its sounds
   go on. Where more of the town shows beside the sheet, it draws every frame as before.
   And slices/bohemia_ui_nothing_pops.js __THE_WATCHER_SKIPS_A_HIDDEN_PAGE__: its four-a-second walk no longer asks the voice boxes of
   a page that is hidden.

   On the DEMO and the ALPHA, through the one driver, a phone upright (390 x 844) and on its side (844 x 390), the way he gets there
   (the map's own door into CARAVANS, its SMITH, a weapon tapped, the shop's x, the phone's CREW):
     F1 THE SHOP STANDING OPEN: where the sheet hides all of the town's picture but 6% or less (upright: a 22 px band of rooftops; on its
        side: thin edges), the town draws 10 pictures a second or fewer; where more shows, every frame
     F2 A WEAPON'S CARD UP over the shop: the same
     F3 THE SHEET GOES (its x): the town draws every frame again while the sheet folds back, at least 10 pictures in the second after
     F4 THE CREW SCREEN SETTLED: the town draws nothing; it draws again the second after DONE
     F5 THE FRAMES (the demo upright, the CPU slowed four times, the GPU drawing the canvases): the shop standing open draws at least
        1.6 times the frames a second the same town draws with no sheet over it (measured: about 2 to 3 times); the numbers printed
     F6 nothing threw
     F7 TWO TAPS BY THE FINGER (ask row 726, FOUND BY EYES 11/26: at 4x 'tap it twice to buy' bought one time in three; FIXES 3's
        __THE_FINGER_SETS_THE_BEAT__ fixed it, this leg holds it on the glass the way a slow phone hands it over): the stall's BUY tapped
        twice 150 ms apart with the page busy 600 ms between the taps: it buys three times of three (the old clock: none of three)
   PLANTED (the demo upright, the service worker off): the rest taken out of the town's loop: F1 red (the town draws every frame); the
   taps timed by when the page handles them: F7 red.
   node gates/the_ui_holds_its_frames_gate.js [demo|alpha] [phone_portrait|phone_landscape] [--no-plant] [--no-frames] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 500) + ']' : '')); return g; };
const ARGS = process.argv.slice(2);
const PAGES = ['demo', 'alpha'].filter(p => !ARGS.some(a => a === 'demo' || a === 'alpha') || ARGS.includes(p));
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ARGS.some(a => /^phone_/.test(a)) || ARGS.includes(p));

async function town(d, P) {
  await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /caravan/i.test(k)), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let sf = null; for (let k = 0; k < 80 && !sf; k++) { await P.waitForTimeout(400);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && /caravan/i.test(BohemiaSettlement.state.place.name) && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) sf = x; }
  if (sf) { await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 15000 }).catch(() => {}); await P.waitForTimeout(1500); }
  return sf;
}
const still = async (P, h) => { let q = await h.boundingBox(), same = 0; for (let i = 0; i < 40 && same < 5; i++) { await P.waitForTimeout(60); const r = await h.boundingBox(); same = r && q && Math.abs(r.x - q.x) < 0.5 && Math.abs(r.y - q.y) < 0.5 ? same + 1 : 0; q = r; } return q; };
const tapEl = async (P, h) => { if (!h) return false; const q = await still(P, h); if (!q) return false; await P.touchscreen.tap(q.x + q.width / 2, q.y + q.height / 2); return true; };
/* the town's pictures over a window of ms, and the frames the top page drew in it */
async function rate(P, sf, ms) {
  await P.evaluate(() => { if (!window.__hf) { window.__hf = []; const f = t => { window.__hf.push(t); requestAnimationFrame(f); }; requestAnimationFrame(f); } });
  const a = await sf.evaluate(() => window.__TOWN_DRAWN | 0), t0 = await P.evaluate(() => performance.now());
  await P.waitForTimeout(ms);
  const b = await sf.evaluate(() => window.__TOWN_DRAWN | 0), t1 = await P.evaluate(() => performance.now());
  const fr = await P.evaluate(([x, y]) => window.__hf.filter(t => t >= x && t <= y).length, [t0, t1]);
  return { draws: +((b - a) / ((t1 - t0) / 1000)).toFixed(1), frames: +(fr / ((t1 - t0) / 1000)).toFixed(1) };
}

/* F7: Caravans' stall, its first BUY tapped twice 150 ms apart while the page is busy 600 ms between the taps (a slow phone's long
   task): the second tap is handled late, so a check by when the page handles it misses; by the finger it buys */
async function busyTwice(P, sf) {
  await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(800);
  await sf.evaluate(() => { const S = BohemiaSettlement.state; window.BohemiaPurse.credit(S.purse, 'electricity', 5000, 'gate:the-ui-holds-its-frames', S.place.name, S.day); });
  for (let t = 0; t < 3; t++) { const w = await sf.evaluate(() => BohemiaSettlement.where('stall')); if (!w) break; const fb = await (await sf.frameElement()).boundingBox(); await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'stall')) break; }
  await P.waitForTimeout(1000);
  let bought = 0, tries = 0; const out = [];
  for (let n = 0; n < 3; n++) {
    const h = (await sf.$$('#sheet .act.stline .sb.buy:not(.off)'))[0]; if (!h) break;
    const q = await still(P, h); if (!q) break; tries++;
    const b0 = await sf.evaluate(() => BohemiaSettlement.bats());
    await P.touchscreen.tap(q.x + q.width / 2, q.y + q.height / 2);
    const busy = sf.evaluate(() => new Promise(r => setTimeout(() => { const t = performance.now(); while (performance.now() - t < 600) {} r(); }, 0)));
    await P.waitForTimeout(150); await P.touchscreen.tap(q.x + q.width / 2, q.y + q.height / 2); await busy;
    await P.waitForTimeout(1300);
    const b1 = await sf.evaluate(() => BohemiaSettlement.bats()); if (b1 < b0) bought++; out.push(b0 + '>' + b1);
    await P.waitForTimeout(500);
  }
  return { bought, tries, say: bought + ' of ' + tries + ' bought (batteries ' + out.join(', ') + ')' };
}
async function walk(page, profile, plant) {
  const tag = page + ' ' + (profile === 'phone_portrait' ? 'upright' : 'on its side');
    console.log('\n' + tag + (plant ? ' PLANTED (the rest taken out)' : ''));
  let d; const errs = [];
  try {
    d = await drive.open({ profile, alpha: page === 'alpha', noWorker: !!plant, beforeGoto: plant ? async (cdp, pg) => {
      await pg.route(/BOHEMIA_SETTLEMENT_SCREEN\.html/, async route => { const r = await route.fetch(); const b = (await r.text()).replace('var under = townUnderSheet();', 'var under = 0;')
        .replace('function fingerAt(e){', 'function fingerAt(e){ return performance.now();');   /* FIXES 3's __THE_FINGER_SETS_THE_BEAT__ undone for the plant */
        await route.fulfill({ response: r, body: b }); }); } : undefined });
  } catch (e) { ok(tag + ': the page boots', false, String(e.message).slice(0, 160)); return; }
  const P = d.page; P.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  try {
    await P.waitForTimeout(2000);
    const sf = await town(d, P); if (!sf) { ok(tag + ': Caravans through the map\'s door', false); return; }
    const t0 = await rate(P, sf, 1500);
    for (let t = 0; t < 3; t++) { const w = await sf.evaluate(() => BohemiaSettlement.where('smith')); const fb = await (await sf.frameElement()).boundingBox(); await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'smith')) break; }
    await P.waitForTimeout(1200);
    const r1 = await rate(P, sf, 2000);
    /* how much of the town's picture shows beside the sheet, measured on the glass the same way the town asks */
    const shown = await sf.evaluate(() => { const a = document.getElementById('sheet').getBoundingClientRect(), c = document.getElementById('cv').getBoundingClientRect();
      const L = Math.max(0, c.left), T = Math.max(0, c.top), R = Math.min(innerWidth, c.right), B = Math.min(innerHeight, c.bottom);
      const iw = Math.max(0, Math.min(R, a.right) - Math.max(L, a.left)), ih = Math.max(0, Math.min(B, a.bottom) - Math.max(T, a.top)); return 1 - iw * ih / ((R - L) * (B - T)); });
    const rests = shown <= 0.06;
    const want = r => rests ? r.draws <= 10 : r.draws >= Math.min(20, r.frames * 0.7);
    if (plant) { ok(tag + ' PLANTED: F1 goes red (the town draws ' + r1.draws + ' pictures a second under the shop, the page ' + r1.frames + ' frames)', !want(r1));
      const b7 = await busyTwice(P, sf); ok(tag + ' PLANTED (the taps timed by when the page handles them): F7 goes red (' + b7.say + ')', b7.bought === 0); return; }
    ok('F1 ' + tag + ' THE SHOP STANDING OPEN: the town draws ' + r1.draws + ' pictures a second (' + Math.round(shown * 1000) / 10 + '% of it shows: ' + (rests ? 'it rests, 8 a second' : 'it draws every frame') + '; the page drew ' + r1.frames + ' frames a second; the town alone before, ' + t0.draws + ')', want(r1));
    await tapEl(P, (await sf.$$('#shelfgrid > .slot.full'))[0]); await P.waitForTimeout(900);
    const r2 = await rate(P, sf, 1500), card = await sf.evaluate(() => { const c = document.getElementById('bwcard'); return !!c && c.style.display !== 'none'; });
    ok('F2 ' + tag + ' A WEAPON\'S CARD UP: the town draws ' + r2.draws + ' a second (the card on the glass ' + card + ')', card && want(r2));
    await sf.evaluate(() => { const c = document.getElementById('bwcard'); if (c) c.style.display = 'none'; });
    const a3 = await sf.evaluate(() => window.__TOWN_DRAWN | 0); await tapEl(P, await sf.$('#close')); await P.waitForTimeout(1000);
    const n3 = (await sf.evaluate(() => window.__TOWN_DRAWN | 0)) - a3, open3 = await sf.evaluate(() => BohemiaSettlement.state.open);
    ok('F3 ' + tag + ' THE SHEET GOES: ' + n3 + ' town pictures in the second after the x (the sheet ' + (open3 ? 'still open' : 'gone') + ')', !open3 && n3 >= 10);
    /* F4 the crew screen */
    let h = null; for (const fx of P.frames()) { const e = await fx.$('#bohphone .app[data-app=crew]').catch(() => null); if (e && await e.boundingBox()) { h = e; break; } }
    const pressed = await tapEl(P, h);
    let R = null; for (let i = 0; i < 80 && !R; i++) { R = P.frames().find(x => /ROSTER_SCREEN/.test(x.url())); if (R && !(await R.evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false))) R = null; if (!R) await P.waitForTimeout(250); }
    await P.waitForTimeout(2500);
    const r4 = await rate(P, sf, 2000);
    let back = null;
    if (R) { const a = await sf.evaluate(() => window.__TOWN_DRAWN | 0);
      /* DONE where he presses it: the phone's (with the phone up the crew screen's own is hidden, bohemia_phone.js), else the screen's */
      let dn = null; for (const fx of P.frames()) { const e = await fx.$('#bohphone .crewp .cdone').catch(() => null); if (e && await e.boundingBox()) { dn = e; break; } }
      if (!dn) { const e = await R.$('#done'); if (e && await e.boundingBox()) dn = e; }
      await tapEl(P, dn); await P.waitForTimeout(1500); back = (await sf.evaluate(() => window.__TOWN_DRAWN | 0)) - a; }
    ok('F4 ' + tag + ' THE CREW SCREEN (the phone\'s CREW ' + (pressed ? 'pressed' : 'not found') + '), settled: the town draws ' + r4.draws + ' a second; after DONE ' + back + ' pictures in 1.5 s', !!R && r4.draws <= 0.5 && back >= 10);
    const b7 = await busyTwice(P, sf);
    ok('F7 ' + tag + ' TWO TAPS BY THE FINGER (ask row 726): the stall\'s BUY tapped twice 150 ms apart with the page busy 600 ms between them, as on a slow phone: it buys every time (' + b7.say + ')', b7.tries === 3 && b7.bought === 3);
    ok('F6 ' + tag + ' nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(tag + ' ran', false, String(e.stack).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}

/* F5 on the slowed phone */
async function frames() {
  console.log('\nthe demo upright, the CPU slowed four times, the GPU drawing the canvases');
  let d; try { d = await drive.open({ profile: 'phone_portrait', throttle: 4, gpu: true }); } catch (e) { ok('F5 the slowed page boots', false, String(e.message).slice(0, 160)); return; }
  const P = d.page;
  try {
    await P.waitForTimeout(3000);
    const sf = await town(d, P); if (!sf) { ok('F5 Caravans', false); return; }
    await P.waitForTimeout(1500);
    const a = await rate(P, sf, 3000);
    for (let t = 0; t < 3; t++) { const w = await sf.evaluate(() => BohemiaSettlement.where('smith')); const fb = await (await sf.frameElement()).boundingBox(); await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(2500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'smith')) break; }
    await P.waitForTimeout(2500);
    const b = await rate(P, sf, 3000);
    ok('F5 THE FRAMES on the slowed phone: the town alone ' + a.frames + ' frames a second, the shop standing open ' + b.frames + ' (' + (b.frames / Math.max(0.1, a.frames)).toFixed(1) + ' times; the town drew ' + b.draws + ' pictures a second under it)', b.frames >= a.frames * 1.6);
  } catch (e) { ok('F5 ran', false, String(e.stack).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}

(async () => {
  for (const page of PAGES) for (const prof of PROFS) await walk(page, prof, false);
  if (!ARGS.includes('--no-frames')) await frames();
  if (!ARGS.includes('--no-plant')) await walk('demo', 'phone_portrait', true);
  console.log('\nTHE UI HOLDS ITS FRAMES: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
