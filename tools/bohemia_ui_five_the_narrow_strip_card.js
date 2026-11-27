/* THE NARROW STRIP READS WHOLE, the card's pictures (UI FIVE 11/27): the demo on its side, the town's shop strip for a weapon at the
   smith and for a body armour or a helmet at the armourer, now and before (the narrow strip's 11/27 lines taken back out on the way in).
   node tools/bohemia_ui_five_the_narrow_strip_card.js <now|before>
   writes records/target/ui5_the_narrow_strip_11_27/<now|before>_<weapon|armour>.png */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const way = process.argv[2] || 'now';
const OUT = path.join(ROOT, 'records/target/ui5_the_narrow_strip_11_27'); fs.mkdirSync(OUT, { recursive: true });
const BEFORE = b => b
  .replace('gap:1px;padding:1px 4px!important}', 'gap:2px;padding:2px 4px}')
  .replace('text-align:center;font-size:11px;letter-spacing:0;line-height:1.05;', 'text-align:center;font-size:9px;letter-spacing:0;line-height:1.1;')
  .replace('#buywear>span{font-size:11px;line-height:1.05}', '#buywear>span{font-size:9px;line-height:1.1}')
  .replace(/html body #sheet #shopstrip \.onman \.wcls\{display:block;line-height:1\.25\}.*?\.lns\{display:none\}/, '');
(async () => {
  const d = await drive.open({ profile: 'phone_landscape', noWorker: way === 'before', beforeGoto: way === 'before' ? async (c, pg) => {
    await pg.route(/BOHEMIA_SETTLEMENT_SCREEN\.html/, async route => { const r = await route.fetch(); await route.fulfill({ response: r, body: BEFORE(await r.text()) }); }); } : undefined });
  const P = d.page;
  const townUp = async () => { for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }).catch(() => false)) return x; return null; };
  let sf = await townUp();
  if (!sf) { await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }).catch(() => {});
    for (let i = 0; i < 60 && !sf; i++) { await P.waitForTimeout(400); sf = await townUp(); if (!sf && i === 15) await d.fr.evaluate(() => { try { btwFrameRest(); } catch (e) {} }).catch(() => {}); } await P.waitForTimeout(1200); }
  const fb = await (await sf.frameElement()).boundingBox();
  const shoot = async (name) => { const sr = await sf.evaluate(() => { const r = document.getElementById('shopstrip').getBoundingClientRect(); return [r.x, r.y, r.width, r.height]; });
    await P.screenshot({ path: path.join(OUT, way + '_' + name + '.png'), clip: { x: fb.x + sr[0] - 4, y: fb.y + sr[1] - 4, width: sr[2] + 8, height: sr[3] + 8 } }); };
  const want = { weapon: /weapon/, armour: /body|head/ }, got = {};
  for (const shop of ['smith', 'arms', 'armourer']) {
    if (got.weapon && got.armour) break;
    if (!(await sf.evaluate(k => BohemiaSettlement.order().indexOf(k) >= 0, shop))) continue;
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await P.waitForTimeout(600);
    for (let i = 0; i < 3; i++) { const w = await sf.evaluate(k => BohemiaSettlement.where(k), shop); if (w) await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1600); if (await sf.evaluate(() => BohemiaSettlement.state.open) === shop) break; }
    const n = await sf.evaluate(() => document.querySelectorAll('#sheet .grid .slot').length);
    for (let q = 0; q < n && !(got.weapon && got.armour); q++) {
      const c = await sf.evaluate(q => { const s = document.querySelectorAll('#sheet .grid .slot')[q]; const r = s.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, q);
      await P.touchscreen.tap(fb.x + c[0], fb.y + c[1]); await P.waitForTimeout(500);
      const kind = await sf.evaluate(() => { const f = document.querySelector('#shopstrip .ss-facts'); return (f && f.getAttribute('data-kind')) || (document.querySelector('#shopstrip .twoh') ? 'weapon' : document.querySelector('#shopstrip .wcls') ? 'body' : ''); });
      for (const k of Object.keys(want)) if (!got[k] && want[k].test(kind)) { await shoot(k); got[k] = 1; }
    }
  }
  await d.close().catch(() => {});
  console.log(way, JSON.stringify(got));
  process.exit(0);
})();
