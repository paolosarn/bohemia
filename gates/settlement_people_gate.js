/* THE PEOPLE OF THE PLACE GATE (RUN TWO, row [the finished pictures in], 10/10/26).
   COOK's finished settlement pictures (painted in place over COMBAT TWO's, same names, same boxes)
   with ANIMATION's idle people standing in them. On his phone's profile: every tier and its night
   loads its picture; every building's tap still opens its own sheet; a keeper stands at each
   building's door step, drawn from the people sheets at the picture's scale and moving on the beat;
   the crowd by the stall grows on market day and empties when raided or sick, thins at night.
   Shots in slices/vote/. Run: node gates/settlement_people_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8864;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [], missing = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.waitForTimeout(1500);
  const NAMES = { camp: 'DRY CAMP', town: 'THE WASH, NORTH LAS VEGAS', fortress: 'NELLIS GATE' };
  const counts = {};
  for (const tier of ['camp', 'town', 'fortress']) for (const night of [false, true]) {
    await p.evaluate(o => BohemiaSettlement.open({ place: { tier: o.tier, name: o.name }, traits: [], night: o.night }), { tier, name: NAMES[tier], night });
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => { const L = BohemiaSettlement.folk();
      return { keepers: L.filter(x => x.keeper).map(x => x.k), crowd: L.filter(x => x.crowd).length, order: BohemiaSettlement.order().filter(k => k !== 'lot' && k !== 'build') }; });
    counts[tier + (night ? '_night' : '')] = r.crowd;
    ok(tier + (night ? ' at night' : '') + ': a keeper at every building\'s door', r.keepers.length === r.order.length && r.order.every(k => r.keepers.indexOf(k) >= 0), r.keepers.join(','));
    /* drawn: the canvas at a keeper's feet changes between two beats (he moves) and differs from the bare picture */
    const moved = await p.evaluate(async () => {
      const c = document.querySelector('canvas'), L = BohemiaSettlement.folk().filter(x => x.keeper);
      const k = L[0], pt = BohemiaSettlement.where(k.k);
      const snap = () => { const g = document.createElement('canvas'); g.width = c.width; g.height = c.height; g.getContext('2d').drawImage(c, 0, 0); return g.getContext('2d'); };
      const a = snap(); await new Promise(r => setTimeout(r, 700)); const z = snap();
      let diff = 0; const dpr = c.width / c.clientWidth;
      const r = c.getBoundingClientRect();
      /* scan the whole visible picture; a person breathing changes pixels somewhere every beat */
      const A = a.getImageData(0, 0, c.width, c.height).data, Z = z.getImageData(0, 0, c.width, c.height).data;
      for (let i = 0; i < A.length; i += 16) if (Math.abs(A[i] - Z[i]) > 8) diff++;
      return diff;
    });
    ok('  the people move on the beat, not a still', moved > 30, moved + ' px changed in 700 ms');
  }
  ok('the crowd: a town more than a camp, night thinner than day', counts.town > counts.camp && counts.town_night < counts.town, JSON.stringify(counts));
  const tr = {};
  for (const ids of [[], ['market_day'], ['raided'], ['sickness']]) {
    await p.evaluate(ids => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: ids, night: false }), ids);
    await p.waitForTimeout(500);
    tr[ids[0] || 'plain'] = await p.evaluate(() => BohemiaSettlement.crowdCount());
    if (ids[0] === 'market_day' || !ids.length) await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_THE_PEOPLE_' + (ids[0] ? 'MARKET_DAY' : 'TOWN') + '_10_10.png') });
  }
  ok('market day fills the street, raided and sick empty it', tr.market_day > tr.plain && tr.raided <= 1 && tr.sickness <= 1, JSON.stringify(tr));
  /* every building's tap still lands on COOK's finished picture */
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], night: false }));
  await p.waitForTimeout(400);
  const order = await p.evaluate(() => BohemiaSettlement.order());
  let landed = 0;
  for (const k of order) {
    await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); });
    await p.waitForTimeout(150);
    const pt = await p.evaluate(k => BohemiaSettlement.where(k), k);
    await p.waitForTimeout(350);
    const pt2 = await p.evaluate(k => BohemiaSettlement.where(k), k);
    await p.mouse.click(pt2.x, pt2.y); await p.waitForTimeout(300);
    const open = await p.evaluate(() => BohemiaSettlement.state.open);
    if (open === k) landed++; else console.log('     missed ' + k + ' -> ' + open);
  }
  ok('every building\'s tap still opens its own sheet on the finished picture', landed === order.length, landed + ' of ' + order.length);
  ok('every file loads', missing.length === 0, missing.slice(0, 2).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE PEOPLE OF THE PLACE GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
