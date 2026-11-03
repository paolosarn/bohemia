#!/usr/bin/env node
/* THE SHOP KEEPS ITS ARMOUR (FIXES, VAMILY rule 364, ask line 388; Paolo 11/3: 'when I buy helmets or armor it makes other armor
   unavailable to purchase or disappears'). slices/BOHEMIA_SETTLEMENT_SCREEN.html shopBuy / shelfLive.
   MEASURED before the fix: with the shelf rolled again between his pick and his Buy (restock: the town's ground arriving late, a camp
   turning, the bar's price), the piece he paid for stayed on the shelf and went in his bag, and the LAST piece on the shelf vanished
   (splice at index -1); the next roll put it back.
   On his phone's profile (390 x 844, touch), a fortress's armourer, real taps:
   1. *** BUY EACH ARMOUR PIECE IN TURN ***: each buy takes that one piece off the shelf; every other piece is still on the shelf,
      drawn, and its Buy is lit.
   2. *** THE SAME WITH THE SHELF ROLLED AGAIN BETWEEN THE PICK AND THE BUY ***: only the piece he chose goes, into his stash; nothing
      else leaves the shelf.
   Run: node gates/the_shop_keeps_its_armour_gate.js */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..'), PORT = 8877;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.glb': 'model/gltf-binary' };
let pass = 0, fail = 0;
const ok = (what, c, why) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const srv = http.createServer((rq, rs) => { const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs); });
(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright'); const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(String(e.message)));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 30000 });
  const fresh = async () => {
    await p.evaluate(() => { try { localStorage.removeItem('bohemia.bag.v1'); } catch (e) {} const S = BohemiaSettlement.state; S.sold = {}; S.stash = [];
      BohemiaSettlement.open({ place: { tier: 'fortress', name: 'THE FORT, HENDERSON' }, batteries: 9000 }); });
    await p.waitForTimeout(600);
    await p.evaluate(() => { const s = document.getElementById('sheet'); if (s && s.classList.contains('on')) document.getElementById('close').click(); }); await p.waitForTimeout(300);
    const xy = await p.evaluate(() => BohemiaSettlement.where('armourer')); await p.touchscreen.tap(xy.x, xy.y); await p.waitForTimeout(800);
  };
  const shelf = () => p.evaluate(() => (BohemiaSettlement.state.stock.armourer || []).map(it => it.kind + ':' + it.id));
  const drawn = () => p.evaluate(() => [...document.querySelectorAll('#shelfgrid .slot')].filter(s => s.__it).map(s => s.__it.kind + ':' + s.__it.id));
  const slotAt = (id) => p.evaluate(id => { const s = [...document.querySelectorAll('#shelfgrid .slot')].find(x => x.__it && (x.__it.kind + ':' + x.__it.id) === id); if (!s) return null;
    s.scrollIntoView({ block: 'center' }); const r = s.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, id);
  const buyLit = () => p.evaluate(() => { const a = [...document.querySelectorAll('#sbody .act, #sbody button')].find(x => /^Buy/.test(x.textContent.trim())); return a ? (a.disabled ? 'off' : 'lit') : 'none'; });
  const tapBuy = async () => { const a = await p.evaluate(() => { const a = [...document.querySelectorAll('#sbody .act, #sbody button')].find(x => /^Buy/.test(x.textContent.trim())); if (!a || a.disabled) return null; const r = a.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    if (a) { await p.touchscreen.tap(a.x, a.y); await p.waitForTimeout(600); } return !!a; };
  try {
    /* 1 */
    await fresh();
    const start = (await shelf()).filter(x => /^(head|body):/.test(x));
    const bad1 = []; let bought1 = 0;
    for (const id of start) {
      const before = await shelf(), q = await slotAt(id); if (!q) { bad1.push(id + ' not drawn before its turn'); continue; }
      await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(500);
      if (!(await tapBuy())) { bad1.push(id + ' had no lit Buy'); continue; }
      bought1++;
      const after = await shelf(), gone = before.filter(x => after.indexOf(x) < 0), dr = await drawn();
      if (gone.length !== 1 || gone[0] !== id) bad1.push(id + ': gone ' + JSON.stringify(gone));
      const rest = after.filter(x => /^(head|body):/.test(x));
      for (const o of rest) {
        if (dr.indexOf(o) < 0) { bad1.push(o + ' not drawn after ' + id); continue; }
        const q2 = await slotAt(o); await p.touchscreen.tap(q2.x, q2.y); await p.waitForTimeout(450);
        const lit = await buyLit(); if (lit !== 'lit') bad1.push(o + ' Buy ' + lit + ' after ' + id);
        await p.waitForTimeout(500);   /* past the double tap */
      }
    }
    ok('*** BUY EACH ARMOUR PIECE IN TURN: each buy takes that one piece; every other piece stays on the shelf, drawn, its Buy lit *** (' + start.length + ' pieces)',
      start.length >= 4 && bought1 === start.length && !bad1.length, bad1.slice(0, 3).join(' | ') || start.join(', '));
    /* 2 */
    await fresh();
    const start2 = (await shelf()).filter(x => /^(head|body):/.test(x)); const bad2 = [];
    for (const id of start2) {
      const before = await shelf(), q = await slotAt(id); if (!q) { bad2.push(id + ' not drawn'); continue; }
      await p.touchscreen.tap(q.x, q.y); await p.waitForTimeout(450);
      await p.evaluate(() => BohemiaSettlement.restock()); await p.waitForTimeout(200);   /* the shelf rolled again while his piece is up */
      if (!(await tapBuy())) { bad2.push(id + ' had no lit Buy after the roll'); continue; }
      const after = await shelf(), gone = before.filter(x => after.indexOf(x) < 0), st = await p.evaluate(() => BohemiaSettlement.state.stash.map(x => x.kind + ':' + x.id));
      if (gone.length !== 1 || gone[0] !== id || st.indexOf(id) < 0) bad2.push(id + ': gone ' + JSON.stringify(gone) + ', in the stash ' + (st.indexOf(id) >= 0));
      await p.waitForTimeout(500);
    }
    ok('*** THE SAME WITH THE SHELF ROLLED AGAIN BETWEEN THE PICK AND THE BUY: only his piece goes, into his stash ***',
      start2.length >= 4 && !bad2.length, bad2.slice(0, 3).join(' | ') || start2.length + ' pieces');
    ok('no page errors', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the shop was walked', false, String(e && e.message || e).slice(0, 200)); }
  await b.close(); srv.close();
  console.log('=== THE SHOP KEEPS ITS ARMOUR: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
