#!/usr/bin/env node
/* THE NEW GUNS PRICED, THE VOTE CARD'S PICTURE (ECONOMY FOUR 11/27, rule 489(b)). From the game's own camera: the demo on a phone
   upright, a new crew; the towns walked in turn until a smith's shelf carries the charge drone; its line tapped so the strip says its
   price. Writes records/target/ECONOMY_FOUR_THE_DRONE_ON_THE_SHELF.jpg (the shelf, and one plain line under it).
   node tools/bohemia_economy_four_the_drone_on_the_shelf_shot.js [scratch_dir] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const Dr = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUT = path.join(ROOT, 'records/target/ECONOMY_FOUR_THE_DRONE_ON_THE_SHELF.jpg');
const TMP = process.argv[2] || require('os').tmpdir();
(async () => {
  const d = await Dr.open({ profile: 'phone_portrait', fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, P = d.page;
  await fr.waitForFunction(() => window.LOOP && LOOP.start && typeof townTap === 'function', null, { timeout: 300000 }); await P.waitForTimeout(3000);
  await fr.evaluate(() => { let k = 0; while (((T.min - 600 + 1440) % 1440) > 10 && k++ < 300) advance(10); });
  let found = null;
  for (const n of ['Network', 'Mob', 'Cartel', 'Caravans', 'Remnants', 'Church', 'Blues', 'Reds', 'Anarchists']) {
    await fr.evaluate((nm) => { try { loopClose(); } catch (e) {} const b = ctBases()[nm]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: nm, x: b.x, y: b.y }); }, n);
    for (let i = 0; i < 180; i++) { if (await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready))) break; await P.waitForTimeout(500); }
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const x = document.querySelector('#meetcard [data-meet="back"]'); if (x) x.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    for (let i = 0; i < 60; i++) { if (await sf.evaluate((nm) => !!(window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === nm), n).catch(() => false)) break; await P.waitForTimeout(500); }
    await P.waitForTimeout(1500);
    for (let t = 0; t < 4; t++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('smith')); if (!xy) break; const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await P.touchscreen.tap(hb.x + xy.x * hb.width / iw[0], hb.y + xy.y * hb.height / iw[1]);
      await P.waitForTimeout(2500); if (await sf.evaluate(() => BohemiaSettlement.state.open === 'smith')) break; }
    const hit = await sf.evaluate(() => { const els = Array.from(document.querySelectorAll('#sbody *')).filter(e => e.children.length === 0 && /charge drone/i.test(e.textContent));
      if (!els.length) return null; let row = els[0]; for (let i = 0; i < 6 && row.parentElement && !/row|line|item|shelf|it\b/i.test(row.className || ''); i++) row = row.parentElement;
      row.scrollIntoView({ block: 'center' }); row.click(); const st = document.querySelector('.shopstrip'); return { text: (row.innerText || '').slice(0, 120), strip: st ? st.textContent.slice(0, 160) : '' }; });
    if (hit) { await P.waitForTimeout(1200); await P.screenshot({ path: path.join(TMP, 'drone_shelf.png') }); found = { town: n, hit }; break; }
    await sf.evaluate(() => { const c = document.getElementById('close'); if (c) c.click(); }); await P.waitForTimeout(600);
  }
  await d.close();
  console.log('found', JSON.stringify(found));
  if (!found) process.exit(2);
  const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 560, height: 1000 }, deviceScaleFactor: 1 });
  const im = 'data:image/png;base64,' + fs.readFileSync(path.join(TMP, 'drone_shelf.png')).toString('base64');
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  await pg.setContent('<body style="margin:0;background:#111;color:#e8dcc4;font:15px/1.35 Georgia,serif"><div style="padding:16px"><img src="' + im + '" style="width:100%;display:block;border:1px solid #333"><div style="padding:8px 2px">' +
    esc('The smith at ' + found.town + ': two charge drones now cost what two real FPV kits did, 30, under the AR (45) and the AK (48). They were 90, priced like a good rifle.') + '</div></div></body>');
  const h = await pg.evaluate(() => document.body.scrollHeight); await pg.setViewportSize({ width: 560, height: h });
  await pg.screenshot({ path: OUT, type: 'jpeg', quality: 82, fullPage: true });
  await br.close();
  console.log('wrote ' + path.relative(ROOT, OUT) + ' ' + fs.statSync(OUT).size + ' bytes');
})().catch(e => { console.error(e); process.exit(1); });
