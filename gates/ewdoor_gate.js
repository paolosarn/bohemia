/* ============================================================================
   EAST/WEST FACING DOOR GATE (8/3/26)

   Paolo, on the original list: "WE MADE A COUPLE VERSIONS OF DOORS WHEN THEY ARE
   FACING EAST AND WEST WHY ARE WE NOT DOING THAT."
   Paolo, 8/3, after I said it was handled: "I never saw your eastern west facing
   doors, bro what's up with that?"

   HE WAS RIGHT AND THE TICKET WAS CLOSED WRONG. On 8/2 the E/W bank was measured
   (7px of paint at the west or east edge of a 44x44 tile), read as door JAMBS for
   the tile next door, shipped as a bleed into the neighbouring cell, and the E/W
   door item was ticked off. The pixels were measured correctly. The JOB was read
   wrong, and nobody rendered the tiles and looked -- the first one is a brown door
   leaf swung open, seen edge-on. They are side doors, drawn the only way a fixed
   3/4 camera can draw one.

   THE GAP THAT LEFT:
       324 house cells approach from the SOUTH  ->  81 doors
       368 approach from the EAST
       336 approach from the WEST               ->   0 doors
   Side approaches outnumber south approaches 2.2 to 1 and every one was blank wall.

   THIS GATE PRESSES ON THE ACTUAL CLAIM, in a real browser: side doors are FLAGGED
   on real cells, they DRAW on the real canvas, the mass they belong to counts as
   having a door (so the wall beside it seals), and they never land on a cell whose
   side is not walkable -- a door you cannot reach is the 7/27 bug returning.
   ========================================================================== */
'use strict';
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
      f = page.frames().find(fr => /srcdoc/.test(fr.url()) && fr !== page.mainFrame());
      if (!f) continue;
      const up = await f.evaluate(() => typeof fit === 'function' &&
        document.getElementById('cv').width > 300).catch(() => false);
      if (up) break;
    }
    ok('the world frame booted', !!f);
    if (f) {
      const r = await f.evaluate(() => {
        const out = { flagged: 0, W: 0, E: 0, sealed: 0, unreachable: 0, draws: 0, spot: null };
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
        out.hasPass = typeof ewDoorPass === 'function';
        for (let ty = 20; ty < 80; ty += 7) for (let tx = 20; tx < 80; tx += 7) {
          const t = om.at(tx, ty); if (!t || !t.district) continue;
          for (let ly = 2; ly < FN - 2; ly++) for (let lx = 2; lx < FN - 2; lx++) {
            const gx = tx * FN + lx, gy = ty * FN + ly;
            const c = cellAt(gx, gy); if (!c || (!c.doorW && !c.doorE)) continue;
            out.flagged++; if (c.doorW) out.W++; if (c.doorE) out.E++;
            /* the mass it belongs to must now COUNT as having a door */
            if (massHasDoor(gx, gy)) out.sealed++;
            /* and the side it faces must be walkable, or it is a door you cannot reach */
            const side = cellAt(gx + (c.doorW ? -1 : 1), gy);
            if (!side || !side.walk) out.unreachable++;
            if (!out.spot) out.spot = [gx, gy];
          }
        }
        if (out.spot) {
          HC = 44; hx = out.spot[0]; hy = out.spot[1] + 3;
          window.__EW_DOOR_DRAWS = 0;
          try { render(); } catch (e) { out.renderErr = String(e && e.message || e).slice(0, 100); }
          out.draws = window.__EW_DOOR_DRAWS || 0;
        }
        return out;
      });
      ok('the side-door render pass is in the build', r.hasPass);
      ok('side doors are FLAGGED on real cells (' + r.flagged + ': ' + r.W + ' west, ' + r.E + ' east)',
         r.flagged > 0 && r.W > 0 && r.E > 0);
      ok('every side door counts toward its mass having a door (' + r.sealed + '/' + r.flagged + ')',
         r.flagged > 0 && r.sealed === r.flagged);
      ok('NO SIDE DOOR IS UNREACHABLE -- the cell it faces is walkable ('
         + r.unreachable + ' bad)', r.unreachable === 0);
      ok('and they DRAW on the real canvas (' + r.draws + ')' + (r.renderErr ? ' -- ' + r.renderErr : ''),
         r.draws > 0 && !r.renderErr);
    }
  } finally { await browser.close(); }
  console.log('E/W DOOR GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('E/W DOOR GATE CRASHED: ' + e.message); process.exit(1); });
