/* BOHEMIA — BUILT ON THE MAP, THE VOTE PICTURE (10/9/26, LIFE + CITY, [built on the map]).
 * The alpha's own map on a phone, reached by the pinch, the camera on your base: a wall and a tank started
 * at the base (one battery each), the game's own SLEEP and wake, then two shots in the same camera: the
 * base with its lot book emptied for one render (as it was) and with it back (as it is).
 * Nothing is drawn by this tool; tools/bohemia_built_on_the_map_cook.py crops the base out of both.
 * REFERENCE CHECK:
 *   AH-01    the ordinary frame with ONE wrong thing: the game's own frames, nothing composed.
 *   BLDG-03  one light direction: the built things carry the street's north light.
 *   BLDG-05  structural sanity: they stand on the ground in front of the base with their own shadows.
 * REUSE CHECK: every pixel is the alpha's own canvas.
 * Run:  node tools/bohemia_built_on_the_map_cook.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'records', 'lifecity_pictures', 'built_on_the_map');
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await D.open({ alpha: true });
  try {
    await d.toMap();
    for (let i = 0; i < 3; i++) { await d.pinchIn(); await d.page.waitForTimeout(1500); if (await d.fr.evaluate(() => CZOOM) > 0.5) break; }
    const at = await d.fr.evaluate(() => { const b = ctBases(), m = Object.keys(b).find(n => lotIsMine(n)); window.__m = m; city.x = b[m].x; city.y = b[m].y; render();
      const p = iso(b[m].x, b[m].y, (typeof __lastOx !== 'undefined') ? __lastOx : 0, 0); return m; });
    const plate = () => d.fr.evaluate(() => { render(); const q = MAP_DREW && MAP_DREW.baseAt && MAP_DREW.baseAt[window.__m]; return q ? { sx: q.sx, cy: q.cy } : null; });
    const where = {};
    await d.fr.evaluate(async () => {
      const P = purseGet(), m = window.__m; BohemiaPurse.credit(P, 'electricity', 2, 'cook', 'cook', DAY.day);
      BohemiaLotBuild.start(lotBookFor(m), P, { x: 0, y: 0 }, 'wall', DAY.day, lotHoldFor(m));
      BohemiaLotBuild.start(lotBookFor(m), P, { x: 1, y: 0 }, 'tank', DAY.day, lotHoldFor(m));
      document.getElementById('sleepbtn').click(); await new Promise(r => setTimeout(r, 600));
      const go = document.querySelector('#daycardIn .dcgo'); if (go) go.click(); else DAY.wake();
      await new Promise(r => setTimeout(r, 600)); });
    /* the night moves the camera: put it back on the base, let it settle, and then take BOTH shots in
       the same frame of mind: BEFORE is the very same camera with the base's lot book emptied for one
       render (the base as it was), AFTER is the book put back. Only what you built differs. */
    await d.fr.evaluate(() => { const b = ctBases(); city.x = b[window.__m].x; city.y = b[window.__m].y; render(); });
    await d.page.waitForTimeout(4000);
    await d.fr.evaluate(() => { const b = ctBases(); city.x = b[window.__m].x; city.y = b[window.__m].y; window.__keep = LOT_BOOK[window.__m]; delete LOT_BOOK[window.__m]; render(); });
    await d.page.waitForTimeout(600); await d.shot(path.join(OUT, 'before.png')); where.before = await plate();
    await d.fr.evaluate(() => { LOT_BOOK[window.__m] = window.__keep; render(); });
    await d.page.waitForTimeout(600); await d.shot(path.join(OUT, 'after.png')); where.after = await plate();
    fs.writeFileSync(path.join(OUT, 'where.json'), JSON.stringify(where));   /* the base on the glass, the game's own */
    console.log('base', at, 'zoom', await d.fr.evaluate(() => CZOOM), 'drawn', await d.fr.evaluate(() => MAP_DREW.built && MAP_DREW.built[window.__m]));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });
