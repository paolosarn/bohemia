/* EVERY SHOP DEAREST FIRST (UI THREE 11/14, VAMILY rule 452, ask row 626).
   PAOLO 11/14: 'I want all shops to display their items descending from the top price of whatever's in the shop, so the first thing
   displayed is the most expensive.'
   THE TOWN'S PAGE (slices/BOHEMIA_SETTLEMENT_SCREEN.html), a town, a fortress and a camp, the phone upright (390 x 844) and sideways
   (844 x 390), his bag seeded with six pieces of different worth:
   L1 every shop's shelf (the smith, the armourer, a camp's guns and plate), read off the glass in the order it stands: the prices
      highest first (a piece bought this visit leaves its gap); a tie keeps the better piece first (its worth from the shop's own row);
   L2 his bag in each shop, by what each piece fetches there: highest first;
   L3 the stall: its goods by their BUY price, its trade goods, and his gear by what it pays: each highest first;
   L4 the same order upright and sideways (the list's, not the glass's).
   L5 THE REAL PAGE: the demo, a town's smith, upright and sideways: the shelf highest first.
   --plant: the one sort keeps the order it was given (L1 red).
   Run: node gates/every_shop_dearest_first_gate.js [--plant] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const { chromium } = (function () { try { return require('/opt/node22/lib/node_modules/playwright'); } catch (e) { return require('playwright'); } })();
let pass = 0, fail = 0, QUIET = false;
const ok = (m, g, x) => { if (QUIET) return g; g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + String(x).slice(0, 420) + ']' : '')); return g; };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg' };
function serve(plant) {
  const srv = http.createServer((rq, rs) => { const u = decodeURIComponent(rq.url.split('?')[0]); const f = path.join(ROOT, u.replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
    if (plant && plant[u]) { let t = fs.readFileSync(f, 'utf8'); plant[u].forEach(([a, b]) => { if (t.indexOf(a) < 0) console.log('  (plant did not find: ' + a.slice(0, 60) + ')'); t = t.split(a).join(b); }); return rs.end(t); }
    fs.createReadStream(f).pipe(rs); });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}
const PLANT = { '/slices/BOHEMIA_SETTLEMENT_SCREEN.html': [[".sort(function(a, b){ return (b.p - a.p) || (b.w - a.w) || (a.i - b.i); })", ".sort(function(a, b){ return a.i - b.i; })"]] };
const down = a => a.every((v, i) => i === 0 || a[i - 1] >= v);
/* the shop as it stands: the shelf's prices and each piece's worth (the shop's own row), the bag's, the stall's lines */
const READ = () => {
  const num = e => +(((e && e.textContent) || '').replace(/[^\d]/g, '')) || 0, S = BohemiaSettlement.state, k = S.open, items = S.stock[k] || [];
  const shelf = [...document.querySelectorAll('#shelfgrid .slot')].filter(t => !t.classList.contains('gone')).map(t => { const it = t.__it; return { p: it ? it.price : num(t.querySelector('em')), w: it ? +(it.value || it.base || 0) : 0, shown: num(t.querySelector('em')) }; });
  const bag = [...document.querySelectorAll('#baggrid .slot.full')].map(t => num(t.querySelector('em')));
  const stall = [...document.querySelectorAll('#sbody .stline[data-key]:not(.stgline)')].filter(l => !l.closest('#stallgoods')).map(l => l.dataset.buy === '' ? null : +l.dataset.buy).filter(v => v != null);
  const trade = [...document.querySelectorAll('#stallgoods [data-buy]')].map(l => l.dataset.buy === '' ? null : +l.dataset.buy).filter(v => v != null);
  const gear = [...document.querySelectorAll('#stallgear .stgline')].map(l => +l.dataset.sell);
  return { k, n: items.length, shelf, bag, stall, trade, gear };
};
async function walk(b, vp, plant) {
  const srv = await serve(plant), port = srv.address().port;
  const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 2, hasTouch: true, isMobile: true }), p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const out = [];
  try {
    await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
    for (const tier of ['town', 'fortress', 'camp']) {
      for (const bld of ['smith', 'armourer', 'arms', 'stall']) {
        await p.evaluate(t => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); BohemiaSettlement.open({ place: { name: 'BLUE DIAMOND', tier: t }, traits: [], day: 1, batteries: 3000 }); }, tier);
        await p.waitForTimeout(400);
        /* his bag: six pieces off the town's own shelves, of different worth, kept (so nothing of the junk rule moves them) */
        await p.evaluate(() => { const S = BohemiaSettlement.state, src = [].concat(S.stock.smith || [], S.stock.armourer || []).slice(0, 6);
          S.stash = src.map(it => Object.assign(JSON.parse(JSON.stringify(it)), { keep: true })); try { localStorage.setItem('bohemia.bag.v1', JSON.stringify(S.stash)); } catch (e) {} });
        const hx = await p.evaluate(k => BohemiaSettlement.where(k), bld); if (!hx) continue;
        for (let t = 0; t < 3; t++) { await p.touchscreen.tap(hx.x, hx.y); await p.waitForTimeout(900); if (await p.evaluate(k => BohemiaSettlement.state.open === k, bld)) break; }
        if (!(await p.evaluate(k => BohemiaSettlement.state.open === k, bld))) continue;
        out.push(Object.assign({ tier, bld }, await p.evaluate(READ)));
      }
    }
  } catch (e) { out.err = e && e.message; }
  await ctx.close(); srv.close(); return { out, errs: errs.filter(e => !/ResizeObserver/.test(e)) };
}
function judge(rows) {
  const s1 = [], s2 = [], s3 = [];
  rows.forEach(r => { const tag = r.tier + ' ' + r.bld;
    if (r.shelf.length) { const ps = r.shelf.map(x => x.p); if (!down(ps)) s1.push(tag + ' ' + ps.join(','));
      for (let i = 1; i < r.shelf.length; i++) if (r.shelf[i].p === r.shelf[i - 1].p && r.shelf[i].w > r.shelf[i - 1].w) s1.push(tag + ' a tie at ' + r.shelf[i].p + ': the lesser piece first'); }
    if (r.bag.length && !down(r.bag)) s2.push(tag + ' bag ' + r.bag.join(','));
    ['stall', 'trade', 'gear'].forEach(k => { if (r[k].length && !down(r[k])) s3.push(tag + ' ' + k + ' ' + r[k].join(',')); }); });
  return { s1, s2, s3, sig: rows.map(r => r.tier + r.bld + ':' + r.shelf.map(x => x.p).join(',') + '|' + r.bag.join(',') + '|' + r.stall.join(',') + '|' + r.gear.join(',')).join(' ') };
}
(async () => {
  console.log('EVERY SHOP DEAREST FIRST (rule 452, ask row 626)');
  const b = await chromium.launch(), sigs = {}, errs = [];
  for (const [name, vp] of [['upright', { width: 390, height: 844 }], ['sideways', { width: 844, height: 390 }]]) {
    const w = await walk(b, vp, null), j = judge(w.out); errs.push(...w.errs); sigs[name] = j.sig;
    const shops = w.out.filter(r => r.shelf.length).length, stalls = w.out.filter(r => r.bld === 'stall').length;
    ok(name + ' L1 every shop\'s shelf highest price first, a tie the better piece first (' + shops + ' shelves: ' + w.out.filter(r => r.shelf.length).map(r => r.tier + ' ' + r.bld + ' ' + r.shelf[0].p + '..' + r.shelf[r.shelf.length - 1].p).join(', ') + ')', shops >= 5 && !j.s1.length, j.s1.slice(0, 3).join('; '));
    ok(name + ' L2 his bag in every shop by what it fetches, highest first (' + w.out.filter(r => r.bag.length).map(r => r.bld + ' ' + r.bag.join('>')).slice(0, 3).join('; ') + ')', w.out.some(r => r.bag.length >= 4) && !j.s2.length, j.s2.slice(0, 3).join('; '));
    ok(name + ' L3 the stall: its goods, its trade goods and his gear, each highest first (' + stalls + ' stalls)', stalls >= 2 && w.out.filter(r => r.bld === 'stall').every(r => r.stall.length >= 2 && r.gear.length >= 2) && !j.s3.length, j.s3.slice(0, 3).join('; '));
  }
  ok('L4 the same order upright and sideways', !!sigs.upright && sigs.upright === sigs.sideways);
  /* L5 the real page */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  for (const prof of ['phone_portrait', 'phone_landscape']) {
    let d; try { d = await open({ profile: prof, door: 120000, engage: true }); } catch (e) { ok(prof + ' L5 the demo opened', false, e.message); continue; }
    const P = d.page; let got = null;
    try { await P.waitForTimeout(4000);
      await d.fr.evaluate(() => { try { if (LOOP && LOOP.open) return; const bs = ctBases(), n = Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); } catch (e) {} }).catch(() => {});
      let sf = null; for (let i = 0; i < 40 && !sf; i++) { await P.waitForTimeout(400); for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place; } catch (e) { return false; } }).catch(() => false)) sf = x; }
      await P.waitForTimeout(1500);
      const k = sf && await sf.evaluate(() => ['smith', 'armourer', 'arms'].find(k => BohemiaSettlement.where(k)));
      if (k) { const w = await sf.evaluate(k => BohemiaSettlement.where(k), k), fb = await (await sf.frameElement()).boundingBox();
        for (let t = 0; t < 4; t++) { await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1300); if (await sf.evaluate(k => BohemiaSettlement.state.open === k, k)) break; await P.waitForTimeout(1000); }
        got = Object.assign({ k }, await sf.evaluate(READ)); }
    } catch (e) { got = { err: e.message }; }
    const ps = got && got.shelf ? got.shelf.map(x => x.p) : [];
    ok(prof + ' L5 THE REAL PAGE: the demo\'s ' + (got && got.k) + ', its shelf highest first (' + ps.join(', ') + ')', ps.length >= 3 && down(ps), got && got.err);
    await d.close();
  }
  ok('E nothing thrown', !errs.length, errs.slice(0, 2).join(' | '));
  if (process.argv.includes('--plant')) {
    QUIET = true; const w = await walk(b, { width: 390, height: 844 }, PLANT), j = judge(w.out); QUIET = false;
    ok('PLANT the one sort keeps the order it was given: L1 goes red (' + j.s1.length + ' out of order)', j.s1.length > 0, j.s1.slice(0, 2).join('; '));
  }
  await b.close();
  console.log('EVERY SHOP DEAREST FIRST: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
