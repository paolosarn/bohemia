#!/usr/bin/env node
/* THE BAG SORTS GATE (RUN TWO, row [the bag sorts], 10/18/26).
   Battle Brothers' stash has a sort button; ours filled in the order things were bought. On his phone's profile with
   real taps: a mixed bag (food, a cheap pistol, a hood, a dear rifle, a vest, a car door, tape, a dear helm) sorted once
   at the smith (the settlement's shop) and once on the crew screen (the roster's bag); both through the ONE function
   (engine/bohemia_bag_sort.js): weapons, armour (body then shields), heads, then goods, the dearest first in each; the
   order kept in bohemia.bag.v1 and posted; nothing added, nothing lost; a second tap changes nothing.
   Run: node gates/the_bag_sorts_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname), PORT = 8871;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };
const BAG = [
  { id: 'g_food', kind: 'good', name: 'a ration', price: 1 },
  { id: 'w_cheap', kind: 'weapon', cls: 'dagger', name: 'beat-up pistol', price: 4 },
  { id: 'h_hood', kind: 'head', name: 'a rag hood', price: 3 },
  { id: 'w_dear', kind: 'weapon', cls: 'crossbow', name: 'good rifle', price: 40 },
  { id: 'b_vest', kind: 'body', name: 'a padded vest', price: 12 },
  { id: 's_door', kind: 'shield', name: 'a car door', price: 5 },
  { id: 'g_tape', kind: 'good', name: 'tape', price: 2 },
  { id: 'h_helm', kind: 'head', name: 'a full riot helm', price: 30 }];
const WANT = 'w_dear,w_cheap,b_vest,s_door,h_helm,h_hood,g_tape,g_food';
const srv = http.createServer((rq, rs) => {
  const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const S = require(path.join(ROOT, 'engine/bohemia_bag_sort.js'));
  ok('the one function: weapons, armour, heads, goods, dearest first', S.sort(BAG).map(i => i.id).join() === WANT, S.sort(BAG).map(i => i.id).join());
  ok('  pure: the bag handed in is untouched, nothing added or lost', BAG[0].id === 'g_food' && S.sort(BAG).length === BAG.length);
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript(st => { try { if (!sessionStorage.getItem('__w')) { sessionStorage.setItem('__w', 1); localStorage.setItem('bohemia.bag.v1', JSON.stringify(st)); } } catch (e) {} }, BAG);
  const errs = [];
  /* 1. the settlement's smith */
  const p = await ctx.newPage(); p.on('pageerror', e => errs.push(String(e.message)));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && (BohemiaSettlement.state.stock.smith || []).length > 0, null, { timeout: 30000 });
  await p.evaluate(b => { window.__settleLog = []; BohemiaSettlement.open({ place: { tier: 'town', name: 'SORT TOWN' }, traits: [], bag: b }); }, BAG);
  await p.waitForTimeout(400);
  const xy = await p.evaluate(() => BohemiaSettlement.where('smith')); await p.mouse.click(xy.x, xy.y); await p.waitForTimeout(300);
  const btn = await p.$('#sortbag'); const box = btn && await btn.boundingBox();
  ok('the smith\'s bag has a SORT button a thumb can hit, on the glass', !!box && box.height >= 44 && box.y + box.height <= 844 * 3, box ? Math.round(box.height) + ' px at y ' + Math.round(box.y) : 'none');
  if (box) { await btn.scrollIntoViewIfNeeded(); const bb = await btn.boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(300); }
  const s1 = await p.evaluate(() => ({ st: BohemiaSettlement.state.stash.map(i => i.id).join(), ls: JSON.parse(localStorage.getItem('bohemia.bag.v1')).map(i => i.id).join(),
    posted: ((window.__settleLog || []).filter(m => m.act === 'sort').pop() || {}).bag, grid: document.querySelectorAll('#baggrid .slot.full').length }));
  ok('  one tap sorts it: weapons, armour, heads, goods, dearest first', s1.st === WANT, s1.st);
  ok('  kept on the phone and told to the game, nothing lost', s1.ls === WANT && (s1.posted || []).join() === WANT && s1.grid === BAG.length, s1.ls + ' / ' + s1.grid);
  /* 2. the crew screen's bag */
  await p.evaluate(b => localStorage.setItem('bohemia.bag.v1', JSON.stringify(b)), BAG);
  const r = await ctx.newPage(); r.on('pageerror', e => errs.push(String(e.message)));
  await r.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
  await r.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready, null, { timeout: 30000 });
  await r.waitForTimeout(600);
  const before = await r.evaluate(() => BohemiaRosterScreen.state.bag.map(i => i.id).join());
  const rb = await r.$('#sortbag'); await rb.scrollIntoViewIfNeeded(); const rbb = await rb.boundingBox();
  ok('the crew screen\'s bag has the same SORT, a thumb tall', rbb && rbb.height >= 44, rbb && Math.round(rbb.height) + ' px');
  await r.touchscreen.tap(rbb.x + rbb.width / 2, rbb.y + rbb.height / 2); await r.waitForTimeout(300);
  const after = await r.evaluate(() => ({ st: BohemiaRosterScreen.state.bag.map(i => i.id).join(), ls: JSON.parse(localStorage.getItem('bohemia.bag.v1')).map(i => i.id).join() }));
  ok('  one tap sorts it the same way, kept', before !== WANT && after.st === WANT && after.ls === WANT, before + ' -> ' + after.st);
  await r.touchscreen.tap(rbb.x + rbb.width / 2, rbb.y + rbb.height / 2); await r.waitForTimeout(200);
  ok('  a second tap changes nothing', await r.evaluate(() => BohemiaRosterScreen.state.bag.map(i => i.id).join()) === WANT);
  ok('nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await b.close(); srv.close();
  console.log('\nTHE BAG SORTS: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
