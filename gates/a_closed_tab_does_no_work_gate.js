#!/usr/bin/env node
/* A CLOSED TAB DOES NO WORK (PLUMBER 8, 11/10/26; rule 441(c), rule 400: 60 on a phone).
   MEASURED (a CPU profile of the town at rest on the demo, phone upright, the CPU slowed 4x): the MUSIC tab's readout wrote the colour
   of 640 dots (160 songs' HERO BEAT, four dots each) five times a second while the MUSIC tab was closed: 494 of 9,494 ms of the page's
   time, and every write woke the nothing-pops watcher into a layout. __A_CLOSED_TAB_DOES_NO_WORK__ (slices/BOHEMIA_ALPHA_0_9.html,
   the demo cut from it): it works only while the MUSIC panel is shown, and writes a dot only when it changes.
     C1 the demo, the MUSIC tab closed, the music playing: the readout writes no dot in 4 s
     C2 the MUSIC tab open: its HERO BEAT dots still move on the beat (the readout works where it is seen)
     P1 PLANTED: the old way (window.__MUS_READ_ALWAYS) with the tab closed writes dots again
   node gates/a_closed_tab_does_no_work_gate.js   (about 1 min) */
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };

(async () => {
  console.log('\nA CLOSED TAB DOES NO WORK\n');
  let d;
  try { d = await drive.open({ profile: 'phone_portrait', door: 180000, engage: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  const p = d.page;
  try {
    await p.waitForFunction(() => typeof MUS !== 'undefined' && MUS.playing && document.querySelectorAll('.hero-live span').length > 0, null, { timeout: 60000 }).catch(() => null);
    /* writes to the dots' style, counted where they land (a write of the same colour lands nowhere, as before the fix) */
    const count = (ms) => p.evaluate((ms) => new Promise(res => {
      let n = 0; const mo = new MutationObserver(rs => rs.forEach(x => { if (x.target && x.target.parentElement && x.target.parentElement.classList.contains('hero-live')) n++; }));
      mo.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['style'] });
      setTimeout(() => { mo.disconnect(); res(n); }, ms); }), ms);
    const st = await p.evaluate(() => ({ playing: typeof MUS !== 'undefined' && !!MUS.playing, dots: document.querySelectorAll('.hero-live span').length, open: !!(document.getElementById('p-music') && document.getElementById('p-music').classList.contains('on')) }));
    const closed = await count(4000);
    ok('C1 the MUSIC tab closed, the music playing: the readout writes no dot in 4 s', st.playing && !st.open && st.dots > 0 && closed === 0, st.dots + ' dots, playing ' + st.playing + ', tab open ' + st.open + ': ' + closed + ' writes');
    await p.evaluate(() => { window.__MUS_READ_ALWAYS = true; });
    const planted = await count(4000);
    await p.evaluate(() => { window.__MUS_READ_ALWAYS = false; });
    await p.evaluate(() => { try { showTabPanel('music'); } catch (_e) {} });
    const open = await count(4000);
    ok('C2 the MUSIC tab open: its HERO BEAT dots still move on the beat', open > 0, open + ' writes in 4 s');
    ok('P1 PLANTED: the old way with the tab closed writes the dots again', planted > 0, planted + ' writes in 4 s');
  } catch (e) { ok('the walk ran to the end [' + String(e.message).slice(0, 200) + ']', false); }
  return done();
  async function done() {
    try { if (d && d.close) await d.close(); } catch (_e) {}
    console.log('\nA CLOSED TAB DOES NO WORK: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
  }
})();
