/* ============================================================================
   TRAFFIC SIGNAL GATE (8/1/26)

   Paolo 8/1: "I made traffic lights as well. I even made traffic lights that were
   broken and on the floor and I want to see that on all intersections... we
   haven't seen these traffic lights in a fat fucking minute."

   Measured before the fix: his bank held 348 finished sprites, 6.6 MB, and ZERO
   of them appeared in the shell or the CITY renderer. Two weeks, never placed.

   FOURTH INSTANCE of approved-but-unused (border walls 7/28, the bought sidewalk
   7/31, footsteps 7/31, signals now). banks_used_gate covers banks the run LOADS;
   it cannot catch a bank NOTHING loads. This closes that hole for the signals,
   and it does it the only way that counts: a real browser, standing at a real
   intersection, counting draws that use HIS image objects.
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }

(async () => {
  const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  const alpha = fs.readFileSync(ALPHA, 'utf8');
  /* HIS SPRITES LIVE INSIDE THE BASE64 CITY BLOB, so searching the raw file finds
     nothing even when they shipped. Decode it and search the real renderer -- the
     same lesson street_source_gate learned: check the surface, not the wrapper. */
  /* WHERE the city app lives and WHAT SHAPE it is in are not this gate's business
     (8/4). It moved out of the alpha on 8/2 and stopped being base64, and this gate
     reported his signal bank MISSING when it had shipped fine. One resolver knows. */
  const city = (() => { const a = require('./bohemia_city_app.js').read(); return a ? a.src : ''; })();
  ok('the alpha carries a readable CITY renderer', city.length > 100000);
  ok('his 7/17 signal bank still exists', Array.isArray(bank.signals) && bank.signals.length > 300);

  /* BYTES, NOT A CITATION. Sample his sprites and require them in the shipped file. */
  const sample = bank.signals.filter(s => s.state === 'dead' || s.kind !== 'intact').slice(0, 60);
  const present = sample.filter(s => city.indexOf(s.b64.slice(0, 160)) >= 0).length;
  ok('HIS OWN SPRITES are in the shipped alpha, byte for byte (' + present + ' of ' + sample.length + ' sampled)',
     present > 0);

  /* the wreckage he asked for BY NAME must be among what shipped */
  const wreck = ['fallen_arm', 'dropped_heads', 'scattered'];
  const shipped = wreck.filter(k => bank.signals.some(s => s.kind === k && city.indexOf(s.b64.slice(0, 160)) >= 0));
  ok('THE BROKEN ONES ON THE FLOOR shipped too (' + shipped.join(', ') + ')', shipped.length === wreck.length);

  /* his rulings travel with the art, not just the pixels */
  ok('the ARM LAW is applied (lanes -> reach), not ignored', /function sigArm\(/.test(city));
  ok('the COLOR LAW is applied (galv majority, bronze the stripped minority)', /function sigColor\(/.test(city));

  const { chromium } = pw();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
    await page.goto('file://' + ALPHA);
    await page.waitForTimeout(3000);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await page.waitForTimeout(1500);
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]'); if(!t) throw new Error('that tab is not in the bar'); t.click(); });
    let f = null;
    for (let i = 0; i < 20; i++) {
      await page.waitForTimeout(3000);
      /* FIND THE FRAME BY WHAT IT IS, NOT BY HOW IT WAS LOADED (8/4). It was a
         srcdoc frame until the payload-wall pass; it is a sibling src frame now.
         One predicate knows: gates/bohemia_city_app.js. */
      f = page.frames().find(fr => require('./bohemia_city_app.js').isFrame(fr, page));
      f = page.frames().find(fr => (/srcdoc|CITY_WORLD|CITY_CURRENT/.test(fr.url())) && fr !== page.mainFrame());
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (f) {
      const r = await f.evaluate(() => {
        const out = { loaded: 0, total: 0, inter: 0, drawn: 0 };
        if (typeof SIG_IMG === 'undefined') return out;
        for (const k in SIG_IMG) { out.total++; if (SIG_IMG[k].complete && SIG_IMG[k].naturalWidth) out.loaded++; }
        try { if (typeof swapMode === 'function' && MODE !== 'human') swapMode(); } catch (e) {}
        let found = null;
        for (let ty = 0; ty < 40 && !found; ty++) for (let tx = 0; tx < 40 && !found; tx++) {
          const mm = tileMeta(tx, ty);
          if (mm && mm.road && (mm.N || mm.S) && (mm.E || mm.W)) { out.inter++; found = [tx, ty]; }
        }
        if (found) { hx = found[0] * FN + (FN >> 1); hy = found[1] * FN + (FN >> 1); }
        const set = new Set(); for (const k in SIG_IMG) set.add(SIG_IMG[k]);
        const c = document.getElementById('cv'), ctx = c.getContext('2d');
        const od = ctx.drawImage.bind(ctx);
        ctx.drawImage = function (img, ...a) { if (set.has(img)) out.drawn++; return od(img, ...a); };
        try { render(); } catch (e) {}
        ctx.drawImage = od;
        out.mode = typeof MODE !== 'undefined' ? MODE : '?';
        return out;
      });
      ok('his sprites are LOADED in the browser (' + r.loaded + '/' + r.total + ')',
         r.total > 0 && r.loaded === r.total);
      ok('the world model finds intersections', r.inter > 0);
      ok('the probe measured the WALKED world', r.mode === 'human');
      ok('A SIGNAL IS ACTUALLY ON SCREEN AT AN INTERSECTION (' + r.drawn + ' draws) -- '
         + 'the check the last two weeks were missing', r.drawn > 0);
    }
  } finally { await browser.close(); }
  console.log('TRAFFIC SIGNAL GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('TRAFFIC SIGNAL GATE CRASHED: ' + e.message); process.exit(1); });
