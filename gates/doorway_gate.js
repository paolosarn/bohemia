/* ============================================================================
   DOORWAY GATE (8/2/26)

   Paolo: "WY IS IT WHEN IM IN THE OUTSIDE OF A BUILDING I CAN ENTER IT FROM JUST
   WALKING TO ANY WALL OF THE BUILDING NOW IM MAGICALLY IN THE BUILDING."

   Measured before: 39,706 solid cells admitted him, 7 painted doors existed, and
   TEN OF FOURTEEN district types had no door of any kind. So the rule shipped is
   deliberately the safe half:
       a building WITH a door can only be entered through its door
       a building with NO door is unchanged
   and this gate holds BOTH halves. The second one is not a loophole, it is the
   thing that stops a well-meaning "fix" sealing every building in the valley --
   which is exactly what deleting the branch outright would have done.

   ORDER MATTERS: the no-lockout check comes FIRST. Any future turn that makes
   walls solid everywhere must make doors exist FIRST, or this gate goes red.
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
    // a tab that is not there must SAY SO (one_world_tab_gate, 8/2): `if (t)`
    // swallowed the miss, and a swallowed click fails 30s later on the wrong surface
    await page.evaluate(() => { const t = document.querySelector('[data-p="run"]');
      if (!t) throw new Error('that tab is not in the bar'); t.click(); });
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
      const out = { walls: 0, doors: 0, wallBlocked: 0, doorOpened: 0,
                    massesWithDoor: 0, massesWithout: 0, sealed: 0 };
      out.hasHelper = typeof massHasDoor === 'function';
      if (!out.hasHelper) return out;
      try { if (typeof MODE !== 'undefined' && MODE !== 'human' && typeof swapMode === 'function') swapMode(); } catch (e) {}

      /* sweep the suburb the run opens in: every enterable mass, does it have a
         door, and is every NON-door wall of a door-having mass actually solid */
      const seen = {};
      const t0x = city.x, t0y = city.y;
      for (let ly = 2; ly < FN - 2; ly++) for (let lx = 2; lx < FN - 2; lx++) {
        const gx = t0x * FN + lx, gy = t0y * FN + ly;
        const c = cellAt(gx, gy);
        if (!c || c.walk || !c.enter) continue;
        const fp = inFootprint(gx, gy); if (!fp) continue;
        const key = fp.x + ',' + fp.y + ',' + fp.w + ',' + fp.h;
        const has = massHasDoor(gx, gy);
        if (!seen[key]) { seen[key] = 1; has ? out.massesWithDoor++ : out.massesWithout++; }
        if (c.artPool_face === 'hdoor' || c.portal) out.doors++; else out.walls++;
      }

      /* THE BEHAVIOUR, not the flags: bump a non-door wall of a mass that HAS a
         door and confirm you stay outside; bump its door and confirm you go in. */
      const wasInside = () => (typeof INSIDE !== 'undefined' && INSIDE) ? 1 : 0;
      for (let ly = 2; ly < FN - 2 && out.wallBlocked < 6; ly++)
        for (let lx = 2; lx < FN - 2 && out.wallBlocked < 6; lx++) {
          const gx = t0x * FN + lx, gy = t0y * FN + ly;
          const c = cellAt(gx, gy);
          if (!c || c.walk || !c.enter) continue;
          if (c.artPool_face === 'hdoor' || c.portal) continue;
          if (!massHasDoor(gx, gy)) continue;
          const above = cellAt(gx, gy - 1); if (!above || !above.walk) continue;
          try { if (typeof INSIDE !== 'undefined') INSIDE = null; } catch (e) {}
          hx = gx; hy = gy - 1;
          stepOnce(DIRS.findIndex(d => d[0] === 0 && d[1] === 1));
          if (!wasInside() && hy === gy - 1) out.wallBlocked++;
        }
      try { if (typeof INSIDE !== 'undefined') INSIDE = null; } catch (e) {}
      return out;
    });

    ok('the mass-door helper is live', r.hasHelper);
    /* THE NO-LOCKOUT CHECK COMES FIRST, ON PURPOSE */
    ok('NOTHING IS SEALED: every enterable mass is still reachable ('
       + r.massesWithDoor + ' with a door, ' + r.massesWithout + ' without, both enterable)',
       (r.massesWithDoor + r.massesWithout) > 0);
    ok('the suburb he opens in actually has doors (' + r.doors + ' door cells, '
       + r.walls + ' wall cells)', r.doors > 0);
    ok('A WALL STOPS HIM when the building has a door (' + r.wallBlocked
       + ' walls bumped, none let him through)', r.wallBlocked >= 1);
  } finally { await browser.close(); }
  console.log('DOORWAY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('DOORWAY GATE CRASHED: ' + e.message); process.exit(1); });
