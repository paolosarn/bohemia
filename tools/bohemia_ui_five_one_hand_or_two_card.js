/* THE VOTE CARD FOR ONE HAND OR TWO (UI FIVE 11/22, rule 477). The demo upright, the map's own door into Caravans, its smith, the
   dearest weapon (a two-hander) tapped once: once with the three files as they stood before this change (the weapon card, the item
   card, the town screen at 14ef314da, served in their place for the picture only) and once as it is now. Two full-phone shots written to a folder;
   tools/bohemia_ui_five_one_hand_or_two_card.py lays them side by side.
   node tools/bohemia_ui_five_one_hand_or_two_card.js <out folder> */
'use strict';
const path = require('path'), fs = require('fs'), { execSync } = require('child_process');
const BEFORE = '14ef314da';
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = process.argv[2]; if (!OUT) { console.error('give an out folder'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
async function shot(old) {
  const d = await drive.open({ profile: 'phone_portrait', noWorker: true, beforeGoto: old ? async (cdp, pg) => {
    /* the files as they stood before this change (14ef314da, the build before rule 477), served in place of today's */
    for (const f of ['slices/bohemia_ui_weapon_card.js', 'slices/bohemia_ui_three_items.js', 'slices/BOHEMIA_SETTLEMENT_SCREEN.html']) {
      const body = execSync('git show ' + BEFORE + ':' + f, { cwd: ROOT, maxBuffer: 64 << 20 }).toString();
      await pg.route(new RegExp(path.basename(f).replace(/\./g, '\\.') + '(\\?|$)'), async route => { const r = await route.fetch(); await route.fulfill({ response: r, body }); }); } } : undefined });
  const P = d.page;
  try {
    await P.waitForTimeout(2000);
    await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /caravan/i.test(k)), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let sf = null; for (let k = 0; k < 60 && !sf; k++) { await P.waitForTimeout(400);
      for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && /caravan/i.test(BohemiaSettlement.state.place.name) && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) sf = x; }
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {}); await P.waitForTimeout(1200);
    const fb = await (await sf.frameElement()).boundingBox();
    for (let t = 0; t < 3; t++) { const w = await sf.evaluate(() => BohemiaSettlement.where('smith')); await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'smith')) break; }
    await P.waitForTimeout(1200);
    const h = await sf.$('#shelfgrid > .slot.full'); const q = await h.boundingBox(); await P.touchscreen.tap(q.x + q.width / 2, q.y + q.height / 2); await P.waitForTimeout(1500);
    await P.screenshot({ path: path.join(OUT, old ? 'before.png' : 'now.png') });
    console.log((old ? 'before' : 'now') + ' shot');
  } finally { await d.close(); }
}
(async () => { await shot(true); await shot(false); })().catch(e => { console.error(e); process.exit(1); });
