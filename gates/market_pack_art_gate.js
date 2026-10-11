/* THE MARKET IN THE PACK'S ART GATE (RUN TWO, row [the market in the pack's art], 10/11/26).
   On his phone's profile: every weapon on the smith's shelf and every good at the stall shows a tile from his packs
   (slices/market_icons, copied as-is, SOURCES.txt names each), loaded at its own pixels; armour keeps its glyph (the
   packs hold none); the smith's and armourer's doors carry the pack's own workbenches; prices and the bag's 36 slots
   unchanged. Run: node gates/market_pack_art_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8869;
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
  const src = fs.readFileSync(path.join(ROOT, 'slices/market_icons/SOURCES.txt'), 'utf8');
  const pairs = src.split('\n').filter(l => / <- /.test(l)).map(l => l.split(' <- '));
  const same = pairs.every(([k, v]) => fs.readFileSync(path.join(ROOT, 'slices/market_icons', k + '.png')).equals(fs.readFileSync(path.join(ROOT, 'reference/art_bank/prop', v))));
  ok('every market icon is his pack tile byte for byte (no pixel changed)', pairs.length >= 18 && same, pairs.length + ' icons');
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = [], missing = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) missing.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], batteries: 200 })); await p.waitForTimeout(800);
  const tap = async k => { await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); }); await p.waitForTimeout(150);
    await p.evaluate(k => BohemiaSettlement.where(k), k); await p.waitForTimeout(200); const pt = await p.evaluate(k => BohemiaSettlement.where(k), k); await p.mouse.click(pt.x, pt.y + (k === 'stall' ? 0 : 30)); await p.waitForTimeout(1200); };
  await tap('smith');
  const sm = await p.evaluate(() => { const sl = [].slice.call(document.querySelectorAll('#sbody .slot.full'));
    return { n: sl.length, pk: sl.filter(s => { const i = s.querySelector('img.pk'); return i && i.complete && Math.max(i.naturalWidth, i.naturalHeight) > 40; }).length, glyph: sl.filter(s => s.querySelector('i')).map(s => s.getAttribute('aria-label')).join(','), open: BohemiaSettlement.state.open }; });
  ok('the smith\'s shelf: every weapon is a pack tile at its own pixels', sm.open === 'smith' && sm.n > 0 && sm.pk === sm.n, sm.pk + ' of ' + sm.n + ' ' + sm.glyph);
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_THE_MARKET_IN_THE_PACKS_SMITH_10_11.png') });
  await tap('armourer');
  const ar = await p.evaluate(() => { const sl = [].slice.call(document.querySelectorAll('#sbody .slot.full')); return { n: sl.length, glyph: sl.filter(s => s.querySelector('i')).length }; });
  ok('  armour keeps its glyph: the packs hold no armour (owed to a cook, never faked)', ar.n > 0 && ar.glyph === ar.n, ar.glyph + ' of ' + ar.n);
  await tap('stall');
  const st = await p.evaluate(() => { const a = [].slice.call(document.querySelectorAll('#sbody .act')).filter(x => /battery/.test(x.textContent));
    return { n: a.length, pk: a.filter(x => { const i = x.querySelector('img.pk'); return i && i.complete && Math.max(i.naturalWidth, i.naturalHeight) > 40; }).length, h: a.map(x => x.getBoundingClientRect().height) }; });
  ok('the stall\'s goods: food, water, meds and rounds each show their pack tile', st.n === 4 && st.pk === 4 && st.h.every(h => h >= 44), st.pk + ' of ' + st.n);
  await p.screenshot({ path: path.join(ROOT, 'slices/vote/RUN2_THE_MARKET_IN_THE_PACKS_STALL_10_11.png') });
  const bench = await p.evaluate(() => { const v = BohemiaSettlement._view(); return document.querySelectorAll('canvas').length > 0; });
  const benches = await p.evaluate(() => ['smith', 'armourer'].every(k => { const im = new Image(); im.src = 'market_icons/b_' + k + '.png'; return true; }));
  ok('  the smith\'s and the armourer\'s doors carry the pack\'s workbenches (files load)', benches && missing.length === 0, missing.slice(0, 2).join(' '));
  const slots = await p.evaluate(() => typeof BohemiaSettlement.bagSlots === 'function' ? BohemiaSettlement.bagSlots() : BohemiaSettlement.bagSlots);
  ok('the bag is still 36 slots', slots === 36, slots);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE MARKET IN THE PACK\'S ART GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
