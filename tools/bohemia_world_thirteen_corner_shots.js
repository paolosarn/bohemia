#!/usr/bin/env node
/* ============================================================================
   THE CORNERS, ON HIS PHONE (WORLD THIRTEEN 11/10, rule 442(d)): the demo on the phone, stood where a house street runs out onto a
   mile street (a mouth), at the near stop and the street stop. Run it on the tree after the corners (it finds the spot and prints it)
   and on the tree before with that spot, for the VOTE card's before and after.
     node tools/bohemia_world_thirteen_corner_shots.js OUTDIR LABEL [X,Y]
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = process.argv[2], LABEL = process.argv[3] || 'NOW', AT = process.argv[4] ? process.argv[4].split(',').map(Number) : null;

(async () => {
  const d = await open({ fog: false, engage: true, beforeTap: async (p) => {
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page;
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!window.BohemiaMapHouses && !!(window.om && om.n)).catch(() => false)) break; }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break;
    if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await page.waitForTimeout(500); }
  for (let i = 0; i < 60; i++) { if (await fr.evaluate(() => { try { vbCityInput(); } catch (e) {} return !!(window.VB_TOWNS && VB_TOWNS.list); }).catch(() => false)) break; await page.waitForTimeout(250); }
  const spot = await fr.evaluate((AT) => { const N = om.n;
    let best = AT;
    if (!best) { const LV = vbLanesValley(); let bd = -1e9;
      /* a mouth onto a mile street with the most mouths and T's round it, nearest the valley's middle */
      for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) { const t = om.at(x, y); if (!t || t.district !== 'arterial' || !(LV[y * N + x] & 240) || loopTownAt(x, y, 3)) continue;
        let k = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const v = LV[(y + b) * N + x + a], u = om.at(x + a, y + b); if (u && (v & 240)) k += /^(arterial|strip)$/.test(u.district) ? 3 : 1; }
        const sc = k * 4 - Math.hypot(x - N / 2, y - N / 2) * 0.2; if (sc > bd) { bd = sc; const s = LV[y * N + x] & 240;
          best = s & 16 ? [x + 0.5, y, 0, 1] : s & 32 ? [x + 1, y + 0.5, -1, 0] : s & 64 ? [x + 0.5, y + 1, 0, -1] : [x, y + 0.5, 1, 0]; } } }
    try { travelStop(); } catch (e) {} city.x = best[0] - 0.5 + best[2] * 0.8; city.y = best[1] - 0.5 + best[3] * 0.8;   /* the crew back off the corner, into the mile street, so it shows */ CITY_GLIDE.tx = null; try { fogClear(Math.round(best[0]), Math.round(best[1]), 14); } catch (e) {}
    try { camHold(); } catch (e) {} render(); return best; }, AT);
  console.log('  stood by ' + spot.join(',') + ' (a mouth onto a mile street; pass it back as X,Y,DX,DY for the before)');
  const settle = async () => { for (let i = 0; i < 80; i++) { const w = await fr.evaluate(() => { render(); return (VBT.want | 0) + (VBT.busy ? 1 : 0) + (VBC.busy ? 1 : 0); }); if (!w && i > 3) break; await page.waitForTimeout(400); } await fr.evaluate(() => render()); await page.waitForTimeout(800); };
  for (const [name, z] of [['near', 'half'], ['street', 'street']]) {
    await fr.evaluate((z) => { const st = BohemiaMapHouses.streetTW() / TW0; setZoomAt(z === 'street' ? st : st * 0.45); try { camHold(); } catch (e) {} render(); }, z);
    await settle();
    const f = path.join(OUT, 'WORLD13_CORNERS_' + LABEL + '_' + name.toUpperCase() + '.png');
    await page.screenshot({ path: f });
    console.log('  ' + f);
  }
  await d.close();
})().catch((e) => { console.error(e); process.exit(1); });
