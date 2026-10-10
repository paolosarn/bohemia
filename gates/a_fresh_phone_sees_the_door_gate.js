/* ==========================================================================
   A FRESH PHONE SEES THE DOOR  (RUN, 10/9/26, VAMILY [a fresh phone sees the door])

   EYES 10/9 (1bdc7023, a stranger's walk): a wiped-storage boot skipped straight into a mid-game city in two
   seconds, no title, no picks. MEASURED FIRST (RUN): with real touches only, a wiped phone DID open on the title
   and 95 taps on the picture never got past it; the skip was a script's click on the door's BEGIN behind the
   title, which the shell let in (written so for every driver) and the driver made on every boot. So the walk
   "as a stranger" was the driver's, not a stranger's.
   NOW: while the title is up nothing but its own NEW GAME and CONTINUE gets in (__A_FRESH_PHONE_SEES_THE_DOOR__),
   and the driver goes through the title the way a person does (TRAP 7).

   LEGS, on the demo at the phone's profile, storage wiped before the page loads:
     F0 *** FROM THE FIRST MOMENT, NOTHING BEFORE THE TITLE *** (a watcher from the page's first line, every 200 ms
        it can get: until the title is built the door shows only its dark ground, never its splash or picks; play
        never begins and no save is written before NEW GAME)
     F1 *** A WIPED PHONE OPENS ON THE TITLE *** at 2 s, at 5 s (or the first look the page allows) and when the
        valley is loaded: the title over the whole glass, play not begun, no save written
     F2 *** A SCRIPT'S CLICK ON THE DOOR DOES NOT GET IN *** (BEGIN and the door itself, while the title is up)
     F3 a stranger's thumbs on the picture never get in (real taps on a grid, clear of the three buttons)
     F4 NEW GAME is the picks: the title gone, the origins on the glass, play not begun
     F5 BEGIN, a real touch, is the game
     F6 the driver meets the title on a wiped phone and goes through NEW GAME, like a person
     F7 nothing threw
   node gates/a_fresh_phone_sees_the_door_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('A FRESH PHONE SEES THE DOOR: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const WIPE = "try{ if (!sessionStorage.getItem('__wiped')) { localStorage.clear(); sessionStorage.clear(); sessionStorage.setItem('__wiped','1'); } }catch(e){}";
/* and a watcher from the page's first moment, every 200 ms, so the first seconds are looked at however slowly the page builds */
const WATCH = WIPE + "window.__fresh=[];(function w(){ try{ var t=document.getElementById('title'), f=document.getElementById('front');"
  + " var sv=0; for (var i=0;i<localStorage.length;i++){ var k=localStorage.key(i); if(/^bohemia_city_save/.test(k) && localStorage.getItem(k)!=='{\"bohemia\":\"DEAD\"}') sv++; }"
  + " window.__fresh.push({ t: Math.round(performance.now()), door: !!f && getComputedStyle(f).display!=='none', own: !!f && [].some.call(f.children, function(c){ return c.id!=='title' && getComputedStyle(c).visibility==='visible' && getComputedStyle(c).display!=='none' && c.getBoundingClientRect().height>0; }), title: !!t && !t.classList.contains('gone'), began: !!window.__PLAY_BEGAN, saves: sv, ng: window.BOH_TITLE ? BOH_TITLE.newgames|0 : 0 }); }catch(e){}"
  + " if (window.__fresh.length < 3000) setTimeout(w, 200); })();";

const state = () => {
  const t = document.getElementById('title'), r = t ? t.getBoundingClientRect() : null;
  const up = !!t && !t.classList.contains('gone') && getComputedStyle(t).display !== 'none';
  let all = 0, hit = 0; for (let x = 20; x < innerWidth; x += 60) for (let y = 30; y < innerHeight; y += 70) { all++; const e = document.elementFromPoint(x, y); if (e && t && t.contains(e)) hit++; }
  const saves = Object.keys(localStorage).filter(k => /^bohemia_city_save/.test(k) && localStorage.getItem(k) !== '{"bohemia":"DEAD"}');
  return { at: Math.round(performance.now()), up, cover: !!r && r.width >= innerWidth - 1 && r.height >= innerHeight - 1, hit, all, began: !!window.__PLAY_BEGAN, ready: !!window.__LOAD_READY, saves: saves.length,
    refused: window.BOH_TITLE ? BOH_TITLE.refused | 0 : -1 };
};
const btns = () => [...document.querySelectorAll('#title .bm-start [data-k], #title [data-k]')].map(b => b.getBoundingClientRect()).filter(r => r.width > 0 && r.height > 0)
  .map(r => ({ l: r.left, t: r.top, r: r.right, b: r.bottom }));

(async () => {
  let d, F = {};
  try {
    d = await drive.open({ keepCards: true, arm: WATCH, beforeTap: async (page) => {
      /* F1: three looks, by the page's own clock */
      F.looks = [];
      for (const at of [2000, 5000]) { for (let i = 0; i < 80; i++) { const n = await page.evaluate(() => performance.now()); if (n >= at) break; await page.waitForTimeout(100); } F.looks.push(await page.evaluate(state)); }
      for (let i = 0; i < 240; i++) { if (await page.evaluate(() => !!window.__LOAD_READY)) break; await page.waitForTimeout(500); }
      await page.waitForTimeout(600);
      F.looks.push(await page.evaluate(state));
      F.watch = await page.evaluate(() => window.__fresh.slice());
      /* F2: what the driver used to do */
      await page.evaluate(() => { document.getElementById('fronttap').click(); document.getElementById('front').click(); });
      await page.waitForTimeout(1200);
      F.f2 = await page.evaluate(state);
      /* F3: thumbs on everything but the buttons (28 px clear, a phone's own touch slop) */
      const bs = await page.evaluate(btns);
      const near = (x, y) => bs.some(b => x > b.l - 28 && x < b.r + 28 && y > b.t - 28 && y < b.b + 28);
      F.taps = 0;
      for (let x = 24; x < 390; x += 58) for (let y = 40; y < 844; y += 62) { if (near(x, y)) continue; await page.touchscreen.tap(x, y); F.taps++; }
      await page.waitForTimeout(1200);
      F.f3 = await page.evaluate(state);
      /* F4: NEW GAME, a real touch */
      const nb = await page.evaluate(() => { const b = document.querySelector('#title .bm-start [data-k=new]') || document.querySelector('#title [data-k=new]'); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await page.touchscreen.tap(nb.x, nb.y); await page.waitForTimeout(900);
      F.f4 = await page.evaluate(() => ({ title: !!document.getElementById('title') && !document.getElementById('title').classList.contains('gone'),
        origins: [...document.querySelectorAll('#newco .org')].filter(b => b.getBoundingClientRect().width > 0).length, began: !!window.__PLAY_BEGAN }));
      /* F5: BEGIN, a real touch */
      const ft = await page.evaluate(() => { const r = document.getElementById('fronttap').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      await page.touchscreen.tap(ft.x, ft.y);
      for (let i = 0; i < 30; i++) { await page.waitForTimeout(200); if (await page.evaluate(() => !!window.__PLAY_BEGAN)) break; }
      F.f5 = await page.evaluate(() => ({ began: !!window.__PLAY_BEGAN, front: getComputedStyle(document.getElementById('front')).display }));
    } });
  } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  try {
    const L = F.looks || [], W = F.watch || [];
    const firstDoor = W.find(w => w.door), firstTitle = W.find(w => w.title), early = W.filter(w => w.t <= 5000);
    ok('*** F0 FROM THE FIRST MOMENT, NOTHING BEFORE THE TITLE *** (' + W.length + ' looks every 200 ms to ' + (W.length ? (W[W.length - 1].t / 1000).toFixed(1) : '?') + ' s, ' + early.length + ' in the first 5 s; the door at ' + (firstDoor ? (firstDoor.t / 1000).toFixed(1) : '-') + ' s, the title at ' + (firstTitle ? (firstTitle.t / 1000).toFixed(1) : '-') + ' s; play begun in ' + W.filter(w => w.began).length + ', a save in ' + W.filter(w => w.saves).length + ', the door\'s own splash or picks showing without the title in ' + W.filter(w => w.door && w.own && !w.title).length + ')',
      W.length >= 4 && early.length >= 4 && !!firstTitle /* 10/10: ready in about 6 s now, so fewer looks; they must still cover the first seconds */ && W.every(w => !w.began && w.saves === 0 && w.ng === 0) && W.filter(w => w.door && w.own && !w.title).length === 0);
    ok('*** F1 A WIPED PHONE OPENS ON THE TITLE *** (' + L.map(s => (s.at / 1000).toFixed(1) + ' s: title ' + s.up + ', covers ' + s.cover + ', ' + s.hit + ' of ' + s.all + ' points are the title, began ' + s.began + ', saves ' + s.saves + (s.ready ? ', loaded' : '')).join('; ') + ')',
      L.length === 3 && L.every(s => s.up && s.cover && s.hit === s.all && !s.began && s.saves === 0) && L[2].ready);
    ok('*** F2 A SCRIPT\'S CLICK ON THE DOOR DOES NOT GET IN *** (BEGIN and the door clicked: refused ' + (F.f2 && F.f2.refused) + ', title ' + (F.f2 && F.f2.up) + ', began ' + (F.f2 && F.f2.began) + ')',
      !!F.f2 && F.f2.up && !F.f2.began && F.f2.refused >= 2);
    ok('F3 a stranger\'s thumbs on the picture never get in (' + F.taps + ' real taps clear of the buttons: title ' + (F.f3 && F.f3.up) + ', began ' + (F.f3 && F.f3.began) + ')', F.taps >= 40 && !!F.f3 && F.f3.up && !F.f3.began);
    ok('F4 NEW GAME is the picks (title ' + (F.f4 && F.f4.title) + ', ' + (F.f4 && F.f4.origins) + ' origins on the glass, began ' + (F.f4 && F.f4.began) + ')', !!F.f4 && !F.f4.title && F.f4.origins >= 15 && !F.f4.began);
    ok('F5 BEGIN, a real touch, is the game (began ' + (F.f5 && F.f5.began) + ', the door ' + (F.f5 && F.f5.front) + ')', !!F.f5 && F.f5.began && F.f5.front === 'none');
    ok('F7a nothing threw on the walk (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) { ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false); }
  await d.close();

  /* F6: the driver alone, on a wiped phone */
  let d2;
  try {
    d2 = await drive.open({ keepCards: true, arm: WIPE });
    const g = await d2.page.evaluate(() => ({ began: !!window.__PLAY_BEGAN, ng: window.BOH_TITLE ? BOH_TITLE.newgames : -1, refused: window.BOH_TITLE ? BOH_TITLE.refused : -1 }));
    ok('F6 the driver meets the title on a wiped phone and goes through NEW GAME (saw it ' + d2.title.seen + ', via ' + d2.title.via + ', NEW GAME pressed ' + g.ng + ', in the game ' + g.began + ')',
      d2.title.seen && d2.title.via === 'new' && g.ng === 1 && g.began);
    ok('F7 nothing threw (' + d2.errs.length + (d2.errs.length ? ': ' + String(d2.errs[0]).slice(0, 120) : '') + ')', d2.errs.length === 0);
  } catch (e) { ok('F6 the driver boots a wiped phone [' + String(e.message).slice(0, 160) + ']', false); }
  if (d2) await d2.close();
  done();
})();
