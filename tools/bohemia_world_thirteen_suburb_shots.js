#!/usr/bin/env node
/* ============================================================================
   THE SUBURB, BEFORE AND AFTER (WORLD THIRTEEN 11/7, rules 426(a), 429(d)): the demo on the phone, a suburb he has seen, at the
   opening zoom and up close at the street stop, painted twice in the same game: with the house streets off (VB_LANES.on false,
   the map as it was) and on. The pictures go to slices/vote/ for the VOTE card.
     node tools/bohemia_world_thirteen_suburb_shots.js [outdir]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = process.argv[2] || path.join(ROOT, 'slices/vote');

(async () => {
  const d = await open({ fog: false, engage: true, beforeTap: async (p) => {
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page;
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!window.BohemiaMapHouses && !!(window.om && om.n)).catch(() => false)) break; }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break;
    if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await page.waitForTimeout(500); }
  for (let i = 0; i < 30; i++) { if (await fr.evaluate(() => BohemiaMapHouses.ready()).catch(() => false)) break; await fr.evaluate(() => { try { render(); } catch (e) {} }); await page.waitForTimeout(500); }
  const spot = await fr.evaluate(() => { const N = om.n, H = /^(suburb|estate|gated)$/; let best = null, bd = -1;
    for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) { if (!cityWalkable(x, y) || loopTownAt(x, y, 4)) continue;
      let k = 0; for (let b = -2; b <= 2; b++) for (let a = -2; a <= 2; a++) { const t = om.at(x + a, y + b); if (t && H.test(t.district)) k++; }
      const sc = k * 100 - Math.abs(x - city.x) - Math.abs(y - city.y); if (sc > bd) { bd = sc; best = [x, y]; } }
    try { travelStop(); } catch (e) {} city.x = best[0]; city.y = best[1]; CITY_GLIDE.tx = null; try { fogClear(best[0], best[1], 9); } catch (e) {}
    try { camHold(); } catch (e) {} render(); return best; });
  console.log('  stood at ' + JSON.stringify(spot));
  const settle = async () => { for (let i = 0; i < 80; i++) { const w = await fr.evaluate(() => { render(); return (VBT.want | 0) + (VBT.busy ? 1 : 0) + (VBC.busy ? 1 : 0); }); if (!w && i > 3) break; await page.waitForTimeout(400); } await fr.evaluate(() => render()); await page.waitForTimeout(600); };
  const repaint = async (on) => { await fr.evaluate((on) => { VB_LANES.on = on; VB_LANES.key = null; VBC.key = null; VBT.tiles.clear(); VBT.bytes = 0; try { MAP_GROUND.key = ''; } catch (e) {} try { vbAskCity && vbAskCity(); } catch (e) {} render(); }, on); await settle(); };
  const shots = [];
  for (const on of [false, true]) {
    await repaint(on);
    for (const [name, z] of [['open', 'open'], ['street', 'street']]) {
      await fr.evaluate((z) => { setZoomAt(z === 'street' ? BohemiaMapHouses.streetTW() / TW0 : 1.6); try { camHold(); } catch (e) {} render(); }, z);
      await settle();
      const f = path.join(OUT, 'WORLD13_SUBURB_' + (on ? 'AFTER' : 'BEFORE') + '_' + name.toUpperCase() + '.png');
      await page.screenshot({ path: f }); shots.push(f);
      const L = await fr.evaluate(() => ({ lanes: VB_LANES.a ? VB_LANES.a.filter(v => v & 3).length : 0, ms: VB_LANES.ms, TW: Math.round(TW) }));
      console.log('  ' + path.basename(f) + ' (house streets ' + (on ? 'on' : 'off') + ', ' + L.lanes + ' house blocks with a street, a block ' + L.TW + ' px)');
    }
  }
  await d.close();
})().catch((e) => { console.error(e); process.exit(1); });
