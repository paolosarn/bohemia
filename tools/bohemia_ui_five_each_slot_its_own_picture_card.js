/* THE VOTE CARD FOR EACH SLOT ITS OWN PICTURE (UI FIVE 11/22, rule 474). The demo upright, the map's own door into Caravans, its
   armourer, the dearest piece bought with a double tap, the shelf and the bag shot: once with the old painter (slot i drawn as the i-th
   piece of the raw list, the way it was before this fix, put back for the picture only) and once as it is now. The two shots are
   written to a folder; tools/bohemia_ui_five_each_slot_its_own_picture_card.py lays them out (before on top, now below).
   node tools/bohemia_ui_five_each_slot_its_own_picture_card.js <out folder> */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = process.argv[2]; if (!OUT) { console.error('give an out folder'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
async function shot(old) {
  const d = await drive.open({ profile: 'phone_portrait', noWorker: true, beforeGoto: old ? async (cdp, pg) => {
    await pg.route(/bohemia_ui_materials\.js/, async route => { const r = await route.fetch(); const b = (await r.text()).replace("var it = b.__it || null, old = b.querySelector('.bm-icon');",
      "var it = (function(){ var S0 = BohemiaSettlement.state, i = [].indexOf.call(grid.children, b); return grid.id === 'shelfgrid' ? (S0.stock[S0.open] || [])[i] : (S0.stash || [])[i]; })() || null, old = b.querySelector('.bm-icon');");
      await route.fulfill({ response: r, body: b }); }); } : undefined });
  const P = d.page;
  try {
    await P.waitForTimeout(2000);
    await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /caravan/i.test(k)), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
      for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && /caravan/i.test(BohemiaSettlement.state.place.name) && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) sf = x; }
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200);
    await sf.evaluate(() => { const S = BohemiaSettlement.state; window.BohemiaPurse.credit(S.purse, 'electricity', 20000, 'the vote card', S.place.name, S.day); });
    const fb = await (await sf.frameElement()).boundingBox();
    for (let t = 0; t < 3; t++) { const w = await sf.evaluate(() => BohemiaSettlement.where('armourer')); await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'armourer')) break; }
    await P.waitForTimeout(900);
    const r = await sf.evaluate(() => { const b = document.querySelector('#shelfgrid > .slot.full'); const q = b.getBoundingClientRect(); return [q.x + q.width / 2, q.y + q.height / 2]; });
    await P.touchscreen.tap(fb.x + r[0], fb.y + r[1]); await P.waitForTimeout(120); await P.touchscreen.tap(fb.x + r[0], fb.y + r[1]); await P.waitForTimeout(1800);
    const box = await sf.evaluate(() => { const a = document.querySelector('#sheet .gridh'), g = document.getElementById('baggrid') || document.getElementById('shelfgrid'), q = a.getBoundingClientRect(), z = g.getBoundingClientRect(); return [Math.max(0, q.x - 6), q.y - 4, Math.min(innerWidth, z.right + 6) - Math.max(0, q.x - 6), z.bottom - q.y + 8]; });
    await P.screenshot({ path: path.join(OUT, old ? 'before.png' : 'now.png'), clip: { x: fb.x + box[0], y: fb.y + box[1], width: box[2], height: Math.min(box[3], 620) } });
    console.log((old ? 'before' : 'now') + ' shot', box.map(Math.round).join(','));
  } finally { await d.close(); }
}
(async () => { await shot(true); await shot(false); })().catch(e => { console.error(e); process.exit(1); });
