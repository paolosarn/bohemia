#!/usr/bin/env node
/* ============================================================================
   THE ZONES, ON HIS PHONE (WORLD THIRTEEN 11/10, rule 429(g)(h)): the demo on the phone, the same valley (world 1), stood on the
   rail corridor (the generator's own railX, the middle of the valley), at a wide stop and up close at the street stop. Run it on a
   tree before the zones and on one after, with a label, for the VOTE card's before and after.
     node tools/bohemia_world_thirteen_zone_shots.js OUTDIR LABEL
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = process.argv[2], LABEL = process.argv[3] || 'NOW';

(async () => {
  const d = await open({ fog: false, world: 1, engage: true, beforeTap: async (p) => {
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page;
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!window.BohemiaMapHouses && !!(window.om && om.n)).catch(() => false)) break; }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break;
    if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await page.waitForTimeout(500); }
  const spot = await fr.evaluate(() => { const N = om.n, L = om.layout || {}, rx = L.railX != null ? L.railX : (N >> 1);
    let best = null, bd = -1;
    for (let y = Math.round(N * 0.3); y < Math.round(N * 0.6); y++) for (let x = rx - 4; x <= rx + 4; x++) { if (!cityWalkable(x, y) || loopTownAt(x, y, 3)) continue;
      let k = 0; for (let b = -2; b <= 2; b++) for (let a = -2; a <= 2; a++) { const t = om.at(x + a, y + b); if (t && /^(industrial|warehouse|storage)$/.test(t.district)) k++; }
      const sc = k * 10 - Math.abs(y - N * 0.45); if (sc > bd) { bd = sc; best = [x, y]; } }
    if (!best) best = [rx + 1, Math.round(N * 0.45)];
    try { travelStop(); } catch (e) {} city.x = best[0]; city.y = best[1]; CITY_GLIDE.tx = null; try { fogClear(best[0], best[1], 14); } catch (e) {}
    try { camHold(); } catch (e) {} render(); return best; });
  console.log('  stood at ' + JSON.stringify(spot) + ' on the rail corridor');
  const settle = async () => { for (let i = 0; i < 80; i++) { const w = await fr.evaluate(() => { render(); return (VBT.want | 0) + (VBT.busy ? 1 : 0) + (VBC.busy ? 1 : 0); }); if (!w && i > 3) break; await page.waitForTimeout(400); } await fr.evaluate(() => render()); await page.waitForTimeout(800); };
  for (const [name, z] of [['wide', 0.75], ['street', 'street']]) {
    await fr.evaluate((z) => { setZoomAt(z === 'street' ? BohemiaMapHouses.streetTW() / TW0 : z); try { camHold(); } catch (e) {} render(); }, z);
    await settle();
    const f = path.join(OUT, 'WORLD13_ZONES_' + LABEL + '_' + name.toUpperCase() + '.png');
    await page.screenshot({ path: f });
    console.log('  ' + f);
  }
  await d.close();
})().catch((e) => { console.error(e); process.exit(1); });
