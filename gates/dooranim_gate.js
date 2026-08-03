/* ============================================================================
   DOOR SWING GATE (8/2/26)

   Paolo: "WHY IS THERE NO ANIMATIONS WHEN I GO THROUGH AND OPEN A DOOR WEVE
   WORKED ON THAT PREVIOUSLY."

   He was right that we made it. banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt held 30
   approved clips and ZERO frames had ever reached a renderer -- the sixth
   approved-but-unused defect. This gate holds the whole chain and, like the
   traffic-signal gate, it ends by counting real draws in a real browser.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const BANK = path.join(ROOT, 'banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }
function cityBlob(a){
  for (let ci = a.indexOf('CITY_B64'); ci >= 0; ci = a.indexOf('CITY_B64', ci + 1)) {
    const t = a.slice(ci + 8, ci + 20), eq = t.indexOf('='); if (eq < 0) continue;
    const qi = t.slice(eq).search(/['"`]/); if (qi < 0) continue;
    const st = ci + 8 + eq + qi + 1, en = a.indexOf(a[st - 1], st);
    if (en - st < 100000) continue;
    return Buffer.from(a.slice(st, en), 'base64').toString('utf8');
  }
  return '';
}

(async () => {
  const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  const res = Object.entries(bank.clips).filter(([, v]) => v.pack === '4. Doors and entrances');
  ok('his approved swing pack is still in the bank (' + res.length + ' clips)', res.length >= 10);

  const alpha = fs.readFileSync(ALPHA, 'utf8');
  const city = cityBlob(alpha);
  ok('the alpha carries a readable CITY renderer', city.length > 100000);

  /* BYTES, NOT A CITATION */
  let present = 0, total = 0;
  for (const [, v] of res) for (const fr of v.frames) { total++; if (city.indexOf(fr.slice(0, 160)) >= 0) present++; }
  ok('HIS OWN FRAMES are in the shipped renderer, byte for byte (' + present + '/' + total + ')',
     present === total && total > 0);

  /* his own timing ruling, applied not quoted: 9 frames / 2 beats */
  ok('his 9-frames-over-2-beats timing is applied off the BEAT clock, not a wall-clock guess',
     /const DUR=BEAT\*2;/.test(city));
  ok('the swinging door is picked by the SAME seed as the door standing there',
     /DOOR_ANIM_IMG\.length/.test(city) && /doorSwing\(\(tgtX\*73856093\)/.test(city));

  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1500);
    /* ONE WORLD TAB LAW: a tab click may NEVER swallow its own failure. A missing
       RUN tab used to mean this gate quietly probed the wrong surface and failed
       thirty seconds later, nowhere near the cause. */
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]');
      if (!t) throw new Error('THE RUN TAB IS GONE from the alpha tab bar');
      t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
      f = page.frames().find(fr => /srcdoc/.test(fr.url()) && fr !== page.mainFrame());
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (f) {
      const r = await f.evaluate(async () => {
        const out = { loadedClips: 0, drew: 0 };
        out.has = typeof doorSwing === 'function' && typeof doorSwingDraw === 'function';
        if (!out.has) return out;
        for (const cl of DOOR_ANIM_IMG) if (cl[0] && cl[0].complete && cl[0].naturalWidth) out.loadedClips++;
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
        window.__DOOR_SWING_FRAMES = 0;
        doorSwing(12345, hx, hy + 1);          /* fire it exactly as inEnter does */
        out.armed = !!DOORSWING;
        for (let i = 0; i < 6; i++) { try { render(); } catch (e) {} await new Promise(s => setTimeout(s, 90)); }
        out.drew = window.__DOOR_SWING_FRAMES || 0;
        return out;
      });
      ok('the swing player is live', r.has);
      ok('his clips are LOADED in the browser (' + r.loadedClips + ')', r.loadedClips >= 10);
      ok('walking through a door ARMS a swing', r.armed);
      ok('AND THE SWING ACTUALLY DRAWS (' + r.drew + ' animated frames on the canvas)', r.drew > 0);
    }
  } finally { await browser.close(); }
  console.log('DOOR SWING GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('DOOR SWING GATE CRASHED: ' + e.message); process.exit(1); });
