#!/usr/bin/env node
/* BOHEMIA -- ANIMATION [the kill cams] (rule 426(h), ask lines 365 and 498): THE KILL CAMS ON THEIR REAL SURFACE. The real fight
   (slices/BOHEMIA_FIGHT.html) on the phone's profile (390 x 844 at three to one, touch) through the shared driver, AUTO, the switch
   ON: HELD BREATH on a last man (seed 23) and HAMMER on a big hit (seed 31), each asked for (cutForce, the gate's way). The song is
   slowed ten times ONLY while the pictures are taken (a page photograph holds the page a few hundred milliseconds, more than a
   key), so every key of the camera is its own picture; the pictures themselves are the game's, at its own zoom and camera.
     node tools/bohemia_animation_the_kill_cams_capture.js
       records/target/animation/kill_cams/after_<style>_NN.png (each key, the page's points: 390 x 844) and phone_<style>.png (the
       whole screen at the phone's pixels), then python3 tools/bohemia_animation_the_kill_cams_capture.py frames -> webp at the
       old card's size (292 x 633) beside its frames (records/target/combat7_11_3/cam_<style>_NN.webp)
   REUSE CHECK: PLUMBER's driver, COMBAT's fight, COMBAT 7's switch key; nothing drawn here. */
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/animation/kill_cams');
const OPTS = seed => ({ seed, speed: 1, kind: 'street', deploy: false, formation: null, auto: true, company: [{}, {}, {}, {}, {}, {}], cap: 6, band: ['brigand_thug', 'brigand_thug', 'brigand_leader'] });
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const out = {};
  for (const [stake, style, seed] of [['last', 'held', 23], ['big', 'hammer', 31]]) {
    const d = await D.open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS=' + JSON.stringify(OPTS(seed)) + ";try{localStorage.setItem('bohemia.killcams.v1','on')}catch(e){}" });
    const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
    await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 });
    await p.evaluate(s => { FIGHT_UI.cutForce = s; }, stake);
    /* the moment before the kill that is asked for: the song slows only once a man of theirs is one blow from going */
    await p.waitForFunction(() => FIGHT.S.units.some(v => v.side === 'them' && FIGHT.onField(v) && v.hp > 0 && v.hp <= 40), null, { timeout: 150000 }).catch(() => {});
    await p.evaluate(() => { FIGHT_UI.speed = (FIGHT_UI.speed || 1) * 0.1; });
    const ok = await p.waitForFunction(() => !!FIGHT_UI.cut && FIGHT_UI.cut.drawn.length > 0, null, { timeout: 300000 }).then(() => true).catch(() => false);
    let n = 0, last = 0, full = false;
    while (ok) {
      const st = await p.evaluate(() => FIGHT_UI.cut ? FIGHT_UI.cut.drawn.length : -1);
      if (st < 0) break;
      if (st > last) { last = st; await p.screenshot({ path: path.join(OUT, 'after_' + style + '_' + String(n).padStart(2, '0') + '.png') }); n++;
        if (!full && n === 2) { full = true; await p.screenshot({ path: path.join(OUT, 'phone_' + style + '.png') }); } }
      await p.waitForTimeout(40);
    }
    out[style] = { stake, seed, frames: n, errs };
    try { await d.browser.close(); } catch (e) {}
  }
  console.log('KILLCAMS ' + JSON.stringify(out));
  process.exit(0);
})().catch(e => { console.log('KILLCAMS ' + JSON.stringify({ err: String(e && e.stack || e) })); process.exit(1); });
