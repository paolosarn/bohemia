#!/usr/bin/env node
// JOBS TWO 11/27 -- THE WORK FOLLOWS WHAT IS SHORT, its picture (rule 485(b)). The demo on a phone held upright (390 x 844), a new
// crew, the valley K7QM9X and its own ledger (food short from day one): the town whose board carries a job that brings what the valley
// is short of is opened with a finger on BOARD, and the board is taken twice: NOW (the job paid for the shortage) and BEFORE (the same
// board with the shortage read as nothing, the pay as it was before this build).
// node tools/bohemia_jobs_the_work_follows_what_is_short_picture.js --out dir [--water-days 10]     (writes short_now.png, short_before.png, short.json)
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(arg('--out', 'records/target/jobs_11_27')); fs.mkdirSync(OUT, { recursive: true });
const WATER = arg('--water-days', null);   /* --water-days 10: the valley's water set to that many days (the picture says so) */
(async () => {
  const d = await drive.open({ profile: 'phone_portrait', alpha: false, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, page = d.page;
  await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaPhoneBoard && BohemiaPhoneBoard.loaded() && window.LOOP && LOOP.start && window.BohemiaJobPay && BohemiaJobPay.data(), null, { timeout: 300000 });
  await page.waitForTimeout(4000);
  if (WATER != null) await fr.evaluate((n) => { const L = mktLedger(), G = BohemiaEconomy.GOODS.water; L.stocks.water = Math.round(+n * G.need * L.agents); }, WATER);
  const pick = await fr.evaluate(() => { const all = BohemiaBoardShelf.shelf().offers; const a = BohemiaPhoneBoard.asks().map(x => ({ x, o: all.find(o => o.id === x.id) })).filter(r => r.o && BohemiaJobKinds.short(r.o).mult > 1);
    return a.length ? { place: a[0].x.place, id: a[0].x.id, title: a[0].o.title, short: BohemiaJobKinds.short(a[0].o), shortNow: BohemiaJobKinds.shortNow() } : null; });
  if (!pick) { console.log('no job on the valley\'s boards brings what is short'); await d.close(); return; }
  await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, pick.place);
  const t0 = Date.now(); while (Date.now() - t0 < 90000 && !(await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)).catch(() => false))) await page.waitForTimeout(500);
  if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
  const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
  await sf.waitForFunction((n) => window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n, pick.place, { timeout: 30000 });
  await page.waitForTimeout(2000);
  const openBoard = async () => { for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]);
      if (xy) await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height));
      const t1 = Date.now(); while (Date.now() - t1 < 8000 && !(await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0).catch(() => false))) await page.waitForTimeout(400);
      if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board').catch(() => false)) return true; } return false; };
  const readCards = () => sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => ({ id: b.dataset.id, em: (b.querySelector(':scope > em') || {}).textContent })));
  await openBoard(); await page.waitForTimeout(2000);
  const now = await readCards(); await page.screenshot({ path: path.join(OUT, 'short_now.png') });
  /* BEFORE: the same board with the shortage read as nothing (this build's reader stood down), reopened */
  await sf.evaluate(() => { try { document.getElementById('close').click(); } catch (e) {} });
  await fr.evaluate(() => { window.__SHORT_REAL = BohemiaJobKinds.short; BohemiaJobKinds.short = (o) => ({ good: null, mult: 1 }); });
  await page.waitForTimeout(800); await openBoard(); await page.waitForTimeout(2000);
  const before = await readCards(); await page.screenshot({ path: path.join(OUT, 'short_before.png') });
  await fr.evaluate(() => { BohemiaJobKinds.short = window.__SHORT_REAL; });
  fs.writeFileSync(path.join(OUT, 'short.json'), JSON.stringify({ pick, now, before }, null, 1));
  console.log(JSON.stringify({ pick, now, before }).slice(0, 1500));
  await d.close();
})();
