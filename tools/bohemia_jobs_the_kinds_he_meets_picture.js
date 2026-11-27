#!/usr/bin/env node
// JOBS TWO 11/27 -- THE KINDS HE MEETS, its picture (rule 494(a)(b)). The demo on a phone held upright (390 x 844), a new crew, the
// valley K7QM9X, day 1: the town whose board carries a caravan that goes TOWN TO TOWN is opened with a finger on BOARD (the board),
// and the caravan's person is tapped (the card: where it goes). Beside them, the first day each of the nine kinds the map plays was
// offered, before and now (tools/bohemia_jobs_the_kinds_he_meets.js --json, before with --no-kinds at the old counts).
// node tools/bohemia_jobs_the_kinds_he_meets_picture.js --before b.json --now n.json --out records/target/JOBS_TWO_THE_KINDS_HE_MEETS.jpg [--dir shots]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { chromium } = require('playwright');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const DIR = path.resolve(arg('--dir', 'records/target/jobs_11_27k')); fs.mkdirSync(DIR, { recursive: true });
const OUT = path.resolve(arg('--out', 'records/target/JOBS_TWO_THE_KINDS_HE_MEETS.jpg'));
const BEFORE = JSON.parse(fs.readFileSync(arg('--before'), 'utf8')), NOW = JSON.parse(fs.readFileSync(arg('--now'), 'utf8'));
(async () => {
  const d = await drive.open({ profile: 'phone_portrait', alpha: false, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
  const fr = d.fr, page = d.page;
  await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaPhoneBoard && BohemiaPhoneBoard.loaded() && window.LOOP && LOOP.start, null, { timeout: 300000 });
  await page.waitForTimeout(4000);
  const pick = await fr.evaluate(() => { const D = BohemiaJobKinds.data(), all = BohemiaBoardShelf.shelf().offers;
    const a = BohemiaPhoneBoard.asks().filter(x => { const r = D.offers[x.id]; return r && r.kind === 'haul-caravan' && r.place && r.place.town; });
    return a.length ? { place: a[0].place, id: a[0].id, title: (all.find(o => o.id === a[0].id) || {}).title, to: D.offers[a[0].id].place.town, asks: BohemiaPhoneBoard.asks().length } : null; });
  if (!pick) { console.log('no town-to-town caravan on the valley\'s boards on day 1'); await d.close(); process.exit(1); }
  await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, pick.place);
  const t0 = Date.now(); while (Date.now() - t0 < 90000 && !(await fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)).catch(() => false))) await page.waitForTimeout(500);
  if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
  const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
  await sf.waitForFunction((n) => window.BohemiaSettlement && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n, pick.place, { timeout: 30000 });
  await page.waitForTimeout(2000);
  const tapAt = async (xy) => { const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height)); };
  for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')); if (xy) await tapAt(xy);
    const t1 = Date.now(); while (Date.now() - t1 < 8000 && !(await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0).catch(() => false))) await page.waitForTimeout(400);
    if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board').catch(() => false)) break; }
  await page.waitForTimeout(2500);
  const board = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => ({ id: b.dataset.id, t: (b.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90) })));
  await page.screenshot({ path: path.join(DIR, 'board.png') });
  const xy = await sf.evaluate((id) => { const b = document.querySelector('#sheet button.act.client[data-id="' + id + '"]'); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, pick.id);
  if (xy) await tapAt(xy);
  await page.waitForTimeout(3500);
  const card = await sf.evaluate(() => ((document.getElementById('sheet') || {}).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 400));
  await page.screenshot({ path: path.join(DIR, 'card.png') });
  await d.close();
  fs.writeFileSync(path.join(DIR, 'kinds.json'), JSON.stringify({ pick, board, card }, null, 1));
  console.log(JSON.stringify({ pick, board, card }).slice(0, 1400));
  /* the picture: the board, the card, the nine kinds' first day before and now */
  const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(DIR, f)).toString('base64');
  const rows = NOW.built9.map(b => { const w = BEFORE.built9.find(x => x.kind === b.kind) || {}, day = v => v == null ? 46 : v;
    return '<div class="row"><span>' + b.say.toUpperCase() + '</span><div><div class="bar b"><i style="width:' + day(w.first) * 9 + 'px"></i><b>DAY ' + (w.first == null ? '-' : w.first) + '</b></div>' +
      '<div class="bar a"><i style="width:' + day(b.first) * 9 + 'px"></i><b>DAY ' + b.first + '</b></div></div></div>'; }).join('');
  const html = '<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#16130f;color:#e8dcc4;font:16px ui-monospace,Menlo,monospace;width:1400px;display:flex}' +
    '.l{display:flex;gap:14px;padding:20px}.l img{width:330px;border:2px solid #3a2f22}.r{flex:1;padding:26px 24px}h1{font-size:24px;margin:0 0 14px;color:#f0e2c2;letter-spacing:1px}' +
    '.row{display:flex;align-items:center;margin:7px 0}.row span{width:200px;color:#9c8c70;font-size:14px}.bar{display:flex;align-items:center;height:18px;margin:2px 0}.bar i{display:block;height:15px}' +
    '.bar b{margin-left:8px;font-weight:normal;font-size:13px}.b i{background:#8a1d14}.a i{background:#c9b994}.key{margin-top:18px;color:#9c8c70;font-size:14px}.key em{display:inline-block;width:14px;height:14px;vertical-align:-2px;margin:0 6px 0 12px}</style>' +
    '<div class="l"><img src="' + img('board.png') + '"><img src="' + img('card.png') + '"></div><div class="r"><h1>' + pick.place.toUpperCase() + ' TO ' + String(pick.to).toUpperCase() + '</h1>' + rows +
    '<div class="key"><em style="background:#8a1d14"></em>BEFORE<em style="background:#c9b994"></em>NOW</div></div>';
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  await p.setContent(html); await p.waitForTimeout(300);
  const h = await p.evaluate(() => document.body.scrollHeight); await p.setViewportSize({ width: 1400, height: h });
  await p.screenshot({ path: OUT, type: 'jpeg', quality: 84, fullPage: true }); await b.close();
  console.log('wrote ' + path.relative(ROOT, OUT));
})();
