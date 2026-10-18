/* ==========================================================================
   THE ZOOM GOES THROUGH CLOUDS  (RUN, 10/2/26, VAMILY [map pixels now], rule 67 s3)

   PAOLO 10/2 (the sixth votes): "the zoom into a fight goes through clouds as the loading screen
   again."
   MEASURED: the door opened the rebuilt fight about 1.0 s after the bell and its ground took another
   1.7 s to build, shown as the fight's own plain loading line.
   NOW (__THE_ZOOM_GOES_THROUGH_CLOUDS__ in the shell): three layers of pixel cloud, drawn once in
   the valley's dust and ash and moved by the compositor (the fight builds on the same thread),
   roll in at the door, hold until the fight's ground is built, and part on two beats; going home
   they close over the fight's card and part over the map.

   LEGS, a road fight on the demo, driven:
     C1 the clouds are up within 400 ms of the door, over the whole glass
     C2 *** THEY HOLD UNTIL THE FIGHT'S GROUND IS BUILT *** (never parting while it is still loading)
     C3 and they part once it is: gone within 1.5 s of the fight being ready
     C4 they move while the fight builds (three compositor animations running)
     C5 they are pixel art: drawn at a quarter of the screen's pixels and shown pixelated
     C6 going home is through clouds too: up when he lands on the map, parted over it after
     C7 they never eat a tap (pointer-events none)
     C8 nothing threw
   node gates/the_zoom_goes_through_clouds_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE ZOOM GOES THROUGH CLOUDS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  try {
    await d.page.waitForTimeout(2000);
    await d.fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 1 }); });
    /* sample every 40 ms from the moment the door opens until the clouds are gone */
    const samples = [];
    let tDoor = null;
    const t0 = Date.now();
    while (Date.now() - t0 < 25000) {
      const s = await d.page.evaluate(() => {
        const f = document.getElementById('fightFrame'), el = document.getElementById('nfclouds');
        const r = el ? el.getBoundingClientRect() : null;
        return { door: !!f, ready: f ? nfReady(f) : false, state: NFC.state, op: el ? +getComputedStyle(el).opacity : 0,
          cover: r ? (r.width >= innerWidth - 1 && r.height >= innerHeight - 1) : false,
          anim: NFC.layers.map(c => c.getAnimations().filter(a => a.playState === 'running').length),
          pe: el ? getComputedStyle(el).pointerEvents : null };
      });
      s.t = Date.now();
      if (s.door && tDoor === null) tDoor = s.t;
      samples.push(s);
      if (tDoor && s.ready && s.state === 'off') break;
      await d.page.waitForTimeout(40);
    }
    const afterDoor = samples.filter(s => tDoor && s.t >= tDoor);
    const upBy = afterDoor.find(s => s.state === 'in' && s.op > 0.95 && s.cover);
    ok('C1 the clouds are up within 400 ms of the door, over the whole glass (' + (upBy ? (upBy.t - tDoor) + ' ms' : 'never') + ')', !!upBy && upBy.t - tDoor <= 400);
    const loading = afterDoor.filter(s => !s.ready);
    const brokeEarly = loading.filter(s => s.state !== 'in');
    ok('*** C2 THEY HOLD UNTIL THE FIGHT\'S GROUND IS BUILT *** (' + loading.length + ' samples while it loaded, ' + brokeEarly.length + ' with the clouds not up)', loading.length > 3 && brokeEarly.length === 0);
    const tReady = (afterDoor.find(s => s.ready) || {}).t, tOff = (afterDoor.find(s => s.ready && s.state === 'off') || {}).t;
    ok('C3 and they part once it is ready (gone ' + (tReady && tOff ? (tOff - tReady) + ' ms' : 'never') + ' after)', !!tReady && !!tOff && tOff - tReady <= 1500);
    const moving = loading.filter(s => s.anim.length === 3 && s.anim.every(n => n >= 1));
    ok('C4 they move while the fight builds (' + moving.length + ' of ' + loading.length + ' loading samples with three compositor animations running)', loading.length > 0 && moving.length === loading.length);
    const art = await d.page.evaluate(() => NFC.layers.map(c => ({ w: c.width, h: c.height, ir: getComputedStyle(c).imageRendering })).concat([{ iw: innerWidth, ih: innerHeight }]));
    const vw = art[art.length - 1];
    ok('C5 they are pixel art (' + art.slice(0, 3).map(a => a.w + 'x' + a.h + ' ' + a.ir).join(', ') + ' for a ' + vw.iw + 'x' + vw.ih + ' screen)',
      art.slice(0, 3).every(a => Math.abs(a.w - Math.round(vw.iw / 4)) <= 1 && a.ir === 'pixelated'));
    ok('C7 they never eat a tap (pointer-events ' + (samples.find(s => s.pe) || {}).pe + ')', samples.every(s => !s.pe || s.pe === 'none'));

    /* C6: the way home */
    const h = await d.page.$('#fightFrame'); const f = await h.contentFrame();
    await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); });
    let atHome = null, partedAfter = null; const th = Date.now();
    while (Date.now() - th < 8000) {
      const s = await d.page.evaluate(() => ({ home: !CITYFIGHT, state: NFC.state, op: NFC.el ? +getComputedStyle(NFC.el).opacity : 0 }));
      if (s.home && !atHome) atHome = s;
      if (atHome && s.state === 'off') { partedAfter = Date.now(); break; }
      await d.page.waitForTimeout(40);
    }
    ok('C6 going home is through clouds too (at the moment he is home the clouds are ' + (atHome ? atHome.state : '?') + '; parted over the map after)', !!atHome && atHome.state === 'in' && !!partedAfter);
    ok('C8 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 100) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
  }
  await d.close();
  done();
})();
