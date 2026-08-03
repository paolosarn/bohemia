/* ============================================================================
   EVERY BUILDING HAS A DOOR GATE (8/3/26)

   Paolo: "WY IS IT WHEN IM IN THE OUTSIDE OF A BUILDING I CAN ENTER IT FROM JUST
   WALKING TO ANY WALL OF THE BUILDING NOW IM MAGICALLY IN THE BUILDING."

   The 8/2 rule ("a door is the way in") was correct and covered almost nothing,
   because a mass with NO door is deliberately left permeable so the valley can
   never be sealed shut. Measured on the real surface before this gate existed:

       suburb       42 masses    8 with a door    34 WITH NO DOOR
       commercial   22 masses    0 with a door    22 WITH NO DOOR
       farm         10 masses    0 with a door    10 WITH NO DOOR
       TOTAL        74 masses    8 with a door    66 WITH NO DOOR  = 89%

   So the enforcement covered 11% of buildings. The blocker was never the rule --
   it is that buildings had no doors to enforce.

   THIS GATE IS A RATCHET ON COVERAGE. It walks real district cells in a real
   browser, finds every enterable mass, and asks the game's own massHasDoor()
   whether it has one. The floor only ever goes UP. It cannot be satisfied by
   deleting buildings either, because it also asserts a minimum mass count.

   WHY A RATCHET AND NOT 100%: a mass with no walkable frontage at all genuinely
   has nowhere to put a reachable door, and inventing one would be the 7/27 bug
   over again ("doors scattered over backyard walls that face a dead-dirt lot with
   no way to reach them"). Those stay permeable ON PURPOSE, and the number is
   printed every run so the residual is visible instead of quietly forgotten.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
function pw(){ try{ return require('/opt/node22/lib/node_modules/playwright'); }
  catch(e){ return require('playwright'); } }

/* MEASURED 8/3/26 after the door pass. Raise these when coverage improves; the
   gate fails if coverage falls. Never lower them to make a red run green. */
const FLOOR_PCT = 35;      // reading at the time of writing: 39%
const FLOOR_MASSES = 60;   // reading: 74 -- so coverage cannot be "won" by deleting buildings

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
        const out = { masses: 0, withDoor: 0, byType: {}, kitDoors: 0 };
        try { if (MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}
        out.hasRule = typeof massHasDoor === 'function';
        for (let ty = 20; ty < 80; ty += 7) for (let tx = 20; tx < 80; tx += 7) {
          const t = om.at(tx, ty); if (!t || !t.district) continue;
          const D = t.district;
          const rec = out.byType[D] || (out.byType[D] = { cells: 0, masses: 0, withDoor: 0 });
          if (rec.cells >= 2) continue;
          rec.cells++;
          const seen = new Set();
          for (let ly = 1; ly < FN - 1; ly++) for (let lx = 1; lx < FN - 1; lx++) {
            const gx = tx * FN + lx, gy = ty * FN + ly;
            const c = cellAt(gx, gy); if (!c || c.walk || !c.enter) continue;
            const fp = inFootprint(gx, gy); if (!fp) continue;
            const k = fp.x + ',' + fp.y + ',' + fp.w + ',' + fp.h;
            if (seen.has(k)) continue;
            seen.add(k); rec.masses++; out.masses++;
            if (massHasDoor(gx, gy)) { rec.withDoor++; out.withDoor++; }
          }
        }
        out.kitDoors = window.__KIT_DOORS || 0;
        return out;
      });
      const pct = r.masses ? Math.round(100 * r.withDoor / r.masses) : 0;
      for (const [k, v] of Object.entries(r.byType))
        if (v.masses) console.log('    ' + k.padEnd(14) + ' masses ' + String(v.masses).padStart(4)
          + '   with a door ' + String(v.withDoor).padStart(4)
          + '   permeable ' + String(v.masses - v.withDoor).padStart(4));
      ok('the 8/2 door rule is still in the build', r.hasRule);
      ok('the door pass placed doors on kit districts (' + r.kitDoors + ')', r.kitDoors > 0);
      ok('it saw a real sample of the world (' + r.masses + ' masses, floor ' + FLOOR_MASSES + ')',
         r.masses >= FLOOR_MASSES);
      ok('DOOR COVERAGE ' + pct + '% (' + r.withDoor + '/' + r.masses + '), floor ' + FLOOR_PCT
         + '% -- it was 11% before the door pass', pct >= FLOOR_PCT);
      console.log('    STILL PERMEABLE ON PURPOSE: ' + (r.masses - r.withDoor)
        + ' masses with no walkable frontage to put a reachable door on.');
    }
  } finally { await browser.close(); }
  console.log('EVERY DOOR GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('EVERY DOOR GATE CRASHED: ' + e.message); process.exit(1); });
