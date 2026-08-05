/* ============================================================================
   INTERIOR WALL GATE (8/2/26)

   Paolo: "MY BIGGEST THING WITH INTERIORS WHY IS THE DOOR TWO TILES AND THE
   WALLS ARE ONE TILE SOUTH AND NORTH."

   Measured before: one real interior frame, 127 draws, and the ONLY ones taller
   than a single cell were the six doors. The door stood in 3/4 elevation at two
   tiles while the wall carrying it lay flat at one -- two projections in one
   frame, which is why a door indoors read as a picture hung on a floor strip.

   This gate enters a real house on the real surface and counts the DESTINATION
   HEIGHTS of what gets drawn. It does not read the source.
   ========================================================================== */
'use strict';
const CITY_APP = require('./bohemia_city_app.js');
const path = require('path');
const ALPHA = path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }

(async () => {
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
      /* FIND THE FRAME BY WHAT IT IS, NOT BY HOW IT WAS LOADED (8/4). It was a
         srcdoc frame until the payload-wall pass; it is a sibling src frame now.
         One predicate knows: gates/bohemia_city_app.js. */
      f = page.frames().find(fr => CITY_APP.isFrame(fr, page));
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (!f) throw new Error('no frame');

    const r = await f.evaluate(() => {
      const out = { entered: false };
      try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
      /* walk into a real house through a real door, from whichever side is walkable */
      const t0x = city.x, t0y = city.y;
      outer:
      for (let ly = 2; ly < FN - 2; ly++) for (let lx = 2; lx < FN - 2; lx++) {
        const gx = t0x * FN + lx, gy = t0y * FN + ly;
        const c = cellAt(gx, gy);
        if (!c || c.walk || !c.enter) continue;
        if (c.artPool_face !== 'hdoor' && !c.portal) continue;
        let ap = null;
        for (const d of DIRS) { const q = cellAt(gx + d[0], gy + d[1]); if (q && q.walk) { ap = [gx + d[0], gy + d[1], d]; break; } }
        if (!ap) continue;
        try { INSIDE = null; } catch (e) {}
        hx = ap[0]; hy = ap[1];
        stepOnce(DIRS.findIndex(d => d[0] === -ap[2][0] && d[1] === -ap[2][1]));
        if (INSIDE) { out.entered = true; break outer; }
      }
      if (!out.entered) return out;

      /* count destination heights of everything the interior draws */
      const cv2 = document.getElementById('cv'), ctx = cv2.getContext('2d');
      const H = {}; const orig = ctx.drawImage.bind(ctx);
      ctx.drawImage = function (img, ...a) {
        try {
          let dh, dw;
          if (a.length >= 8) { dw = a[6]; dh = a[7]; } else if (a.length >= 4) { dw = a[2]; dh = a[3]; }
          if (this.canvas === cv2 && dh > 0) { const k = Math.round(dh / Math.max(1, Math.round(dw)));
            H[k] = (H[k] || 0) + 1; }
        } catch (e) {}
        return orig(img, ...a);
      };
      try { render(); } catch (e) { out.err = String(e).slice(0, 80); }
      ctx.drawImage = orig;
      out.heightsInCells = H;          /* key = destination height / width, in cells */
      out.plate = INSIDE.fp.W + 'x' + INSIDE.fp.H;
      try { INSIDE = null; } catch (e) {}
      return out;
    });

    ok('the probe actually got inside a house (plate ' + r.plate + ')', r.entered);
    const h = r.heightsInCells || {};
    ok('INTERIOR WALLS STAND TWO TILES, not one (' + (h[2] || 0) + ' two-tall draws)',
       (h[2] || 0) > 0);
    ok('and the room is not ALL two-tall -- the floor still lies flat ('
       + (h[1] || 0) + ' one-tall draws)', (h[1] || 0) > 0);
    ok('the wall and the door now agree: both two tiles, so no draw is three or more',
       Object.keys(h).every(k => +k <= 2));
  } finally { await browser.close(); }
  console.log('INTERIOR WALL GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('INTERIOR WALL GATE CRASHED: ' + e.message); process.exit(1); });
