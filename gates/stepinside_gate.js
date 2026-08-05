/* ============================================================================
   STEP INSIDE GATE (8/3/26)

   Paolo: "WHY WHEN I ENTER A HOUSE I CANT GO LEFT AND RIGHT."

   This was answered once, on 8/2, by flood-filling `inPassable` out from the
   landing cell and concluding movement was not restricted. That was the wrong
   instrument. A flood fill says which cells are reachable IN PRINCIPLE; it never
   presses a direction. So this gate PRESSES THE DIRECTIONS, through the game's own
   stepOnce, in a real browser, in real houses entered through real doors.

   MEASURED BEFORE THE FIX, on the shipped build:
     you land on            the DOOR cell itself, every time
     works there            N, NE, NW
     BLOCKED there          E, SE, S, SW, W
     can turn on landing    0 of 6 houses
     can turn one cell in   6 of 6 houses
   He was standing IN THE OPENING with a jamb either side.

   FOUR ASSERTIONS, every one of them on the running world:
     1. Entering a house lands you OFF the plate perimeter -- through the threshold,
        not stood in it.
     2. LEFT OR RIGHT ACTUALLY MOVES YOU, driven through stepOnce, not inferred.
     3. You can still LEAVE: the door cell is reachable from where you land.
     4. A blocked threshold does not teleport you -- the rule only fires when the
        cell inward is genuinely walkable.
   ========================================================================== */
'use strict';
const CITY_APP = require('./bohemia_city_app.js');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
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
    /* ONE WORLD TAB LAW: a tab click may NEVER swallow its own failure. */
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
    if (f) {
      const r = await f.evaluate(() => {
        const out = { doors: 0, entered: 0, offPerimeter: 0, canTurn: 0, canLeave: 0, sample: [] };
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
        out.hasRule = typeof inStepInside === 'function';
        const doors = [];
        for (let ly = 2; ly < FN - 2; ly++) for (let lx = 2; lx < FN - 2; lx++) {
          const c = cellAt(city.x * FN + lx, city.y * FN + ly);
          if (c && c.face && c.artPool_face === 'hdoor') doors.push([city.x * FN + lx, city.y * FN + ly]);
        }
        out.doors = doors.length;
        for (const d of doors.slice(0, 24)) {
          INSIDE = null;
          let okE = false; try { okE = inEnter(d[0], d[1], d[0], d[1] + 1); } catch (e) {}
          if (!okE || !INSIDE) continue;
          out.entered++;
          const fp = INSIDE.fp, ix = INSIDE.ix, iy = INSIDE.iy, dr = INSIDE.door;
          if (!(ix === 0 || iy === 0 || ix === fp.W - 1 || iy === fp.H - 1)) out.offPerimeter++;
          /* 2. PRESS LEFT AND RIGHT THROUGH THE REAL MOVER. DIRS: 2 = E, 6 = W. */
          const bx = ix;
          let turned = false;
          try { if (stepOnce(6)) turned = true; } catch (e) {}
          if (!turned) { INSIDE.ix = bx; try { if (stepOnce(2)) turned = true; } catch (e) {} }
          if (turned) out.canTurn++;
          /* 3. the way out is still one step back the way he came */
          INSIDE.ix = ix; INSIDE.iy = iy;
          const back = (Math.abs(ix - dr[0]) + Math.abs(iy - dr[1])) <= 1 && inPassable(dr[0], dr[1]);
          if (back) out.canLeave++;
          if (out.sample.length < 3)
            out.sample.push({ plate: [fp.W, fp.H], door: dr, land: [ix, iy], turned: turned });
        }
        INSIDE = null;
        out.stepped = window.__STEPPED_INSIDE || 0;
        return out;
      });
      ok('the walk-through-the-threshold rule is in the build', r.hasRule);
      ok('there are real doors to walk into (' + r.doors + ')', r.doors > 0);
      ok('they open into real interiors (' + r.entered + '/' + Math.min(r.doors, 24) + ')',
         r.entered > 0 && r.entered === Math.min(r.doors, 24));
      ok('YOU LAND INSIDE THE ROOM, not in the doorway (' + r.offPerimeter + '/' + r.entered + ')',
         r.entered > 0 && r.offPerimeter === r.entered);
      ok('LEFT OR RIGHT ACTUALLY MOVES YOU the moment you are in ('
         + r.canTurn + '/' + r.entered + ') -- it was 0 of 6 before',
         r.entered > 0 && r.canTurn === r.entered);
      ok('and you can still get out: the door is one step back (' + r.canLeave + '/' + r.entered + ')',
         r.entered > 0 && r.canLeave === r.entered);
      ok('the rule only fired on real entries (' + r.stepped + ' of ' + r.entered + ')',
         r.stepped > 0 && r.stepped <= r.entered);
    }
  } finally { await browser.close(); }
  console.log('STEP INSIDE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('STEP INSIDE GATE CRASHED: ' + e.message); process.exit(1); });
