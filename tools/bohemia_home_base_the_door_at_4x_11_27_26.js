#!/usr/bin/env node
/* HOME BASE 5, 11/27/26 (rule 480(c), ask rows 729 and 780): the frames of the page in the 9 s after a town's door is opened from the map,
   the demo on a phone slowed 4x, twice. His place (the same game the card sets up) or, with OTHER=1, the first town that is not his.
   Run: [OTHER=1] node tools/bohemia_home_base_the_door_at_4x_11_27_26.js [phone_portrait|phone_landscape] */
const path = require('path'), ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const card = require('fs').readFileSync(path.join(ROOT, 'tools/bohemia_home_base_his_place_his_way_card_11_27_26.js'), 'utf8');
eval(card.slice(card.indexOf('async function setUp'), card.indexOf('async function openHis')));
(async () => {
  const prof = process.argv[2] || 'phone_portrait';
  const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
    for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
    await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
  const P = d.page, F = d.fr;
  for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaGrinder)).catch(() => false)) break; await P.waitForTimeout(250); }
  await setUp(F); await P.waitForTimeout(3000);
  const cdp = await P.context().newCDPSession(P); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  for (let run = 0; run < 2; run++) {
    await P.evaluate(() => { window.__G = []; let last = performance.now(); const t0 = last; const f = (t) => { window.__G.push([Math.round(t - t0), Math.round(t - last)]); last = t; if (t - t0 < 9000) requestAnimationFrame(f); }; requestAnimationFrame(f); });
    const which = await F.evaluate((other) => { const bs = ctBases(), m = BohemiaBetween.mine(), n = other ? Object.keys(bs).filter(k => k !== m)[0] : m, t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; }, process.env.OTHER === '1');
    await P.waitForTimeout(9500);
    const g = await P.evaluate(() => window.__G);
    const big = g.filter(x => x[1] > 50); const late = g.filter(x => x[0] > 3000);
    console.log(which, 'run', run, 'frames', g.length, 'over50', big.length, 'worst', Math.max(...g.map(x => x[1])), 'fps after 3s', (late.length / 6).toFixed(1), JSON.stringify(big.slice(0, 20)));
    await F.evaluate(() => { try { loopClose(); } catch (e) {} }); await P.waitForTimeout(4000);
  }
  await d.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
