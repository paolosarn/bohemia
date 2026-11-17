#!/usr/bin/env node
// JOBS [the town's book] 11/17 -- THE JOBS' SYSTEMS ON HIS PHONE (VAMILY rules 453, 441). The game on a phone (upright and sideways), the demo
// or the alpha (--alpha), A NEW CREW, the valley K7QM9X. --build A: THE TOWN REMEMBERS: one job done for a town (taken by the board's own
// message, played to the pay) moves the town's bar; the bar set to Friendly (the game's own relations record, the one shortcut, said), the
// next board, opened with a finger, has one more person; set to Unfriendly, the town's shelf charges more than at Neutral and its board
// has no three-skull job. Writes <out>/towns_book_<tag>.json.
// --build B: PUSH THE PAY: a town's board with a finger, one person asked twice (the pay pushed 7% an ask, the bar 0.5 an ask), taken at
// the pushed pay; another asked three times: they walk (the bar -2.5 more) and are gone from the board, again when he walks back in, and
// from the phone's list.
// node tools/bohemia_jobs_the_towns_book_on_the_phone.js --build A [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir] [--tag t]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, BUILDS = arg('--build', 'A').split(','), CODE = arg('--code', 'K7QM9X');
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.resolve(ROOT, arg('--out', 'records/target/jobs_11_17')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
fs.mkdirSync(OUTD, { recursive: true });

async function walk(shape) {
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], out = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const fightUp = () => page.evaluate(() => !!CITYFIGHT);
  /* the town on day d, its BOARD with a finger, this town's own sheet: the people's ids and the shelf's prices */
  async function openTown(tn, day, shot, keep) {
    await fr.evaluate(([n, dd]) => { try { loopClose(); } catch (e) {} DAY.day = dd; const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, [tn, day]);
    await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 60000);
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn), 20000);
    for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [window.innerWidth, window.innerHeight]); if (xy) await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height));
      if (await waitFor(() => sf.evaluate((n) => BohemiaSettlement.state.open === 'board' && BohemiaSettlement.state.place.name === n && document.querySelectorAll('#sheet button.act.client').length > 0, tn), 8000)) break; }
    await page.waitForTimeout(1200);
    const r = await sf.evaluate(() => { const S = BohemiaSettlement.state, ids = [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id);
      const all = window.BohemiaBoardShelf.shelf().offers, sk = ids.map(id => { const o = all.filter(x => x.id === id)[0]; return o ? (o.skulls | 0) || 1 : 0; });
      let n = 0, sum = 0; for (const k in (S.stock || {})) (S.stock[k] || []).forEach(it => { if (it.base > 0 && it.price > 0) { n++; sum += it.price / it.base; } });
      return { ids, skulls: sk, priceRatio: n ? sum / n : null, items: n }; });
    if (shot) { r.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_' + shot + '.png')); await page.screenshot({ path: path.join(ROOT, r.png) }); }
    if (keep) { r.sf = sf; r.sfH = sfH; return r; }
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(500);
    return r;
  }
  /* a finger on an element inside the town's frame: scrolled in, the sheet stopped sliding, the finger lands on it (elementFromPoint) */
  let coverSeen = 0, lastTap = null;
  async function tapIn(sf, sfH, sel, ms) {
    /* the finger lands only where nothing of the map or the page sits over the town's frame (the alpha's HUD held sideways, EYES rows
       611/612): each frame up the chain must own the point, else the sheet is scrolled so the button sits somewhere free */
    const t0 = Date.now(); let last = null, k = 0; const blocks = ['center', 'start', 'end', 'nearest'];
    const cfH = await page.$('#cityFrame');
    while (Date.now() - t0 < (ms || 8000)) {
      const r = await sf.evaluate(([q, bl]) => { const e = document.querySelector(q); if (!e || e.disabled) return null; let b = e.getBoundingClientRect(); if (b.top < 0 || b.bottom > innerHeight || b.left < 0 || b.right > innerWidth) { e.scrollIntoView({ block: bl, behavior: 'instant' }); b = e.getBoundingClientRect(); }   /* a thumb does not scroll what it can see (the screen snaps a nudged frame back) */
        const x = b.left + b.width / 2, y = b.top + b.height / 2, h = document.elementFromPoint(x, y); return { x, y, hit: !!(h && (h === e || e.contains(h))) }; }, [sel, blocks[k % blocks.length]]).catch(() => null);
      if (r && r.hit && last && Math.abs(r.x - last.x) < 1 && Math.abs(r.y - last.y) < 1) {
        /* the town's frame can be drawn scaled (the alpha held sideways): its own pixels times the drawn size over its own size */
        const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [window.innerWidth, window.innerHeight]), ksx = hb.width / (iw[0] || hb.width), ksy = hb.height / (iw[1] || hb.height);
        const px = hb.x + r.x * ksx, py = hb.y + r.y * ksy; let free = true;
        if (cfH) { const cb = await cfH.boundingBox(), cw = await fr.evaluate(() => [window.innerWidth, window.innerHeight]); free = await fr.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.id === 'settleFrame'; }, [(px - cb.x) * (cw[0] || cb.width) / cb.width, (py - cb.y) * (cw[1] || cb.height) / cb.height]).catch(() => true);
          if (free) free = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && e.id === 'cityFrame'; }, [px, py]).catch(() => true); }
        if (free) { lastTap = { px: Math.round(px), py: Math.round(py), sel, at: await sf.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.tagName + '.' + (e.className || '') + ' ' + (e.textContent || '').trim().slice(0, 30)) : null; }, [r.x, r.y]).catch(() => null) };
          await sf.evaluate(() => { if (!window.__clkOn) { window.__clkOn = 1; document.addEventListener('click', (ev) => { (window.__clk = window.__clk || []).push((ev.target.tagName || '') + ' ' + String(ev.target.textContent || '').trim().slice(0, 30)); }, true); } }).catch(() => {});
          await page.touchscreen.tap(px, py); return true; }
        coverSeen = (coverSeen || 0) + 1; k++; last = null; await page.waitForTimeout(250); continue;
      }
      last = r; await page.waitForTimeout(250);
    }
    return false;
  }
  const setBar = (tn, v) => fr.evaluate(([n, val]) => { let r = null; try { r = JSON.parse(localStorage.getItem('bohemia.relations.v1') || 'null'); } catch (e) {} r = r && r.bars ? r : { bars: {}, seen: {} }; r.seen = r.seen || {};
    r.bars[n] = val; r.seen[n] = DAY.day; localStorage.setItem('bohemia.relations.v1', JSON.stringify(r)); try { localStorage.removeItem('bohemia.job.settled.v1'); } catch (e) {}
    const f = document.getElementById('settleFrame'); try { if (f && f.contentWindow && f.contentWindow.BohemiaSettlement) f.contentWindow.BohemiaSettlement.state.rel = null; } catch (e) {} return true; }, [tn, v]);
  const barOf = (tn) => fr.evaluate((n) => BohemiaJobPay.scoreOf(n, DAY.day), tn);
  const barRaw = (tn) => fr.evaluate((n) => { try { const r = JSON.parse(localStorage.getItem('bohemia.relations.v1') || 'null'); return r && r.bars && typeof r.bars[n] === 'number' ? r.bars[n] : 50; } catch (e) { return null; } }, tn);   /* the town's own record, read while he stands in it */
  const asksOf = (key) => fr.evaluate((k) => { try { const m = JSON.parse(localStorage.getItem('bohemia.haggle.v1') || '{}'); return m[k] || null; } catch (e) { return null; } }, key);
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaJobPay && BohemiaJobPay.board && window.LOOP && LOOP.start && PARTY_MATH.loaded, null, { timeout: 180000 });
    await page.waitForTimeout(2500);
    if (BUILDS.indexOf('A') >= 0) {
      const row = { build: 'A', town: 'Anarchists' };
      try {
        /* one job done for the town: the singer found and walked home (no fight at one skull), the board's own message to take it */
        const tn = row.town; await fr.evaluate(() => { LOOP.held = []; DAY.day = 1; });
        row.barBefore = await barOf(tn);
        await fr.evaluate((n) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === 'jb-find-singer')[0]; const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) });
          window.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: n, batteries: null, contract: c }, '*'); }, tn);
        await waitFor(() => fr.evaluate(() => LOOP.held.some(h => h.id === 'jb-find-singer')), 10000);
        row.town = await fr.evaluate(() => (LOOP.held.filter(h => h.id === 'jb-find-singer')[0] || {}).from || null);   /* the town the job is from, as the map made it */
        row.barBefore = await barOf(row.town);
        for (let s = 0; s < 8; s++) { const st = await fr.evaluate(() => { const j = LOOP.held.filter(h => h.id === 'jb-find-singer')[0]; if (!j) return 'gone';
            const at = (x, y) => { travelStop(); city.x = x; city.y = y; }; const x = j.stage === 'look' ? j.spot.x : j.target.x, y = j.stage === 'look' ? j.spot.y : j.target.y; at(x, y); BohemiaJobKinds.arrived(x, y) || BohemiaJobKinds.step(); return j.stage; });
          if (st === 'gone') break; await page.waitForTimeout(800); if (await fightUp()) throw new Error('a fight on a one-skull find'); }
        row.paid = await fr.evaluate(() => (window.__JOB_PAID || []).filter(p => p.id === 'jb-find-singer').slice(-1)[0] || null);
        row.settledQ = await fr.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.job.settled.v1') || '[]'); } catch (e) { return 'ERR'; } }); row.settledActs = await fr.evaluate(() => window.__JOB_SETTLED_ACTS || null);
        await openTown(row.town, 1);   /* the town hears it when he walks in (the settled queue) */
        row.barAfter = await barOf(row.town); row.doneMove = Math.round((row.barAfter - row.barBefore) * 100) / 100;
        row.relRec = await fr.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.relations.v1') || 'null'); } catch (e) { return 'ERR'; } });
        /* Friendly: the next board (a fresh window) against Neutral's */
        const t2 = 'Network'; await setBar(t2, 50); const n0 = await openTown(t2, 4); await setBar(t2, 75); const n1 = await openTown(t2, 7, 'A_friendly_board'); row.boardPng = n1.png;
        row.friendly = { neutral: n0.ids, friendly: n1.ids }; row.friendlyMore = n1.ids.length - n0.ids.length;
        /* Unfriendly: the shelf's prices against Neutral's in one window, and the board in a fresh one */
        const t3 = 'Mob'; await setBar(t3, 50); const p0 = await openTown(t3, 10); await setBar(t3, 25); const p1 = await openTown(t3, 10); const b1 = await openTown(t3, 13);
        row.prices = { neutral: p0.priceRatio, unfriendly: p1.priceRatio, items: p1.items }; row.priceUp = p0.priceRatio ? p1.priceRatio / p0.priceRatio : null;
        row.cold = { ids: b1.ids, skulls: b1.skulls }; row.coldTop = b1.skulls.some(k => k >= 3);
        row.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_A.png')); await page.screenshot({ path: path.join(ROOT, row.png) });
      } catch (e) { row.err = String(e && e.message || e).slice(0, 200); }
      out.push(row);
      console.log('  ' + TAG + ' ' + shape + ' A THE TOWN REMEMBERS: ' + (row.err ? 'ERR ' + row.err : row.town + ' bar ' + row.barBefore + ' -> ' + row.barAfter + ' (paid ' + (row.paid && row.paid.paid) + '); Network board neutral ' + JSON.stringify(row.friendly.neutral) + ' friendly ' + JSON.stringify(row.friendly.friendly) + '; Mob prices x' + (row.priceUp || 0).toFixed(3) + ' over ' + row.prices.items + ' items, unfriendly board skulls ' + JSON.stringify(row.cold.skulls)));
    }
    if (BUILDS.indexOf('B') >= 0) {
      const row = { build: 'B', town: 'Caravans' };
      try {
        /* PUSH THE PAY: a town at Neutral, its board with a finger; one person asked twice (the pay pushed, the bar), taken at the pushed pay;
           another asked three times: they walk, gone from the board, and gone when he walks in again. The bar is the town's own record,
           read while he stands in it (the map's read drifts it by the map's clock) */
        const tn = row.town; await fr.evaluate(() => { LOOP.held = []; }); try { await fr.evaluate(() => localStorage.removeItem('bohemia.haggle.v1')); } catch (e) {}
        await setBar(tn, 50);
        const T = await openTown(tn, 16, null, true), sf = T.sf, sfH = T.sfH;
        if (T.ids.length < 2) throw new Error('the board has ' + T.ids.length + ' people, two wanted');
        row.board = T.ids; row.id = T.ids[0]; row.walkId = T.ids[1];
        row.payBase = await sf.evaluate((id) => (window.BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0] || {}).pay | 0, row.id);
        row.payExpected = Math.max(1, Math.round(row.payBase * Math.pow(1.07, 2)));
        row.barBefore = await barRaw(tn);
        if (!await tapIn(sf, sfH, '#sheet button.act.client[data-id="' + row.id + '"]')) throw new Error('no finger on ' + row.id);
        if (!await waitFor(() => sf.evaluate(() => !!document.querySelector('#sheet [data-ask]')), 8000)) throw new Error('no ask on the card');
        row.askLabel = await sf.evaluate(() => document.querySelector('#sheet [data-ask]').textContent);
        row.says0 = await sf.evaluate(() => (document.querySelector('#sbody .say p') || {}).textContent || '');
        row.fit = await sf.evaluate(() => [...document.querySelectorAll('#sheet .acts button')].map(b => { const r = b.getBoundingClientRect(); return [String(b.textContent || '').slice(0, 10), Math.round(r.top), Math.round(r.bottom), innerHeight]; }));
        row.cardFits = row.fit.length >= 3 && row.fit.every(x => x[2] <= x[3]);   /* every button of the card on the glass, the ask added */
        row.asks = [];
        for (let k = 0; k < 2; k++) {
          if (!await tapIn(sf, sfH, '#sheet [data-ask="more"]')) throw new Error('no finger on the ask ' + (k + 1));
          if (!await waitFor(async () => ((await asksOf(row.id + '@' + tn)) || {}).asks === k + 1, 8000)) {
            row.miss = { cover: coverSeen, clicks: await sf.evaluate(() => (window.__clk || []).slice(-4)).catch(() => null), last: lastTap, rec: await asksOf(row.id + '@' + tn), held: await fr.evaluate(() => LOOP.held.map(h => h.id)) };
            row.missPng = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_B_miss.png')); await page.screenshot({ path: path.join(ROOT, row.missPng) });
            throw new Error('the ask ' + (k + 1) + ' did not land ' + JSON.stringify(row.miss).slice(0, 400)); }
          await waitFor(() => sf.evaluate(() => !!document.querySelector('#sheet [data-ask]')), 4000); await page.waitForTimeout(500);
          row.asks.push({ bar: await barRaw(tn), says: await sf.evaluate(() => (document.querySelector('#sbody .say p') || {}).textContent || '') }); }
        row.lastLabel = await sf.evaluate(() => { const a = document.querySelector('#sheet [data-ask]'); return a ? a.dataset.ask + ' ' + a.textContent : null; });
        row.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_B.png')); await page.screenshot({ path: path.join(ROOT, row.png) });
        row.barAsked = await barRaw(tn); row.barMove = Math.round((row.barAsked - row.barBefore) * 100) / 100;
        const takeSel = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button.act')].filter(x => /^Take it/.test(x.textContent))[0]; if (!b) return null; b.dataset.take = 'yes'; return '#sheet button[data-take="yes"]'; });
        if (!takeSel || !await tapIn(sf, sfH, takeSel)) throw new Error('no finger on Take it');
        await waitFor(() => fr.evaluate((id) => LOOP.held.some(h => h.id === id), row.id), 10000);
        row.held = await fr.evaluate((id) => { const h = LOOP.held.filter(x => x.id === id)[0]; return h ? { id: h.id, pay: h.pay, from: h.from } : null; }, row.id);
        row.payPushed = row.held ? row.held.pay : null;
        /* what the map pays on a contract of that base, the same sum it made the held job with (the start's add, CLOUT, the standing) */
        const mp = await fr.evaluate(([a, b, n]) => typeof loopJobPay === 'function' ? [loopJobPay(a, n), loopJobPay(b, n)] : null, [row.payExpected, row.payBase, tn]);
        row.payHeldExpected = mp ? mp[0] : null; row.payHeldUnpushed = mp ? mp[1] : null;
        /* the other person, asked three times: they walk */
        await waitFor(() => sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0), 8000); await page.waitForTimeout(600);
        const w0 = await barRaw(tn);
        if (!await tapIn(sf, sfH, '#sheet button.act.client[data-id="' + row.walkId + '"]')) throw new Error('no finger on ' + row.walkId);
        for (let k = 0; k < 3; k++) { const want = k < 2 ? 'more' : 'walk';
          if (!await waitFor(() => sf.evaluate((w) => !!document.querySelector('#sheet [data-ask="' + w + '"]'), want), 6000)) throw new Error('no ' + want + ' ask at ' + (k + 1));
          if (k === 2) row.walkLabel = await sf.evaluate(() => document.querySelector('#sheet [data-ask="walk"]').textContent);
          if (!await tapIn(sf, sfH, '#sheet [data-ask="' + want + '"]')) throw new Error('no finger on the ' + want + ' ask');
          if (!await waitFor(async () => ((await asksOf(row.walkId + '@' + tn)) || {}).asks === k + 1, 8000)) throw new Error('the ask ' + (k + 1) + ' on ' + row.walkId + ' did not land');
          await page.waitForTimeout(500); }
        row.walkRec = await asksOf(row.walkId + '@' + tn);
        await waitFor(() => sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0), 8000); await page.waitForTimeout(500);
        row.boardAfter = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id));
        row.walkMove = Math.round(((await barRaw(tn)) - w0) * 100) / 100;
        await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(500);
        const again = await openTown(tn, 16);   /* he walks in again, the same window */
        row.boardAgain = again.ids; row.phoneList = await fr.evaluate(([n, d]) => { try { return (BohemiaBoardShelf.pick({ name: n, tier: mapTierOf(n) }, d, { places: BohemiaBoardShelf.mapPlaces(d) }) || []).map(o => o.id); } catch (e) { return 'ERR ' + e.message; } }, [tn, 16]);
        row.walkedGone = !!(row.walkRec && row.walkRec.walked) && row.boardAfter.indexOf(row.walkId) < 0 && row.boardAgain.indexOf(row.walkId) < 0 && Array.isArray(row.phoneList) && row.phoneList.indexOf(row.walkId) < 0;
      } catch (e) { row.err = String(e && e.message || e).slice(0, 200); }
      out.push(row);
      console.log('  ' + TAG + ' ' + shape + ' B PUSH THE PAY: ' + (row.err ? 'ERR ' + row.err : row.town + ' ' + row.id + ' base ' + row.payBase + ' -> ' + row.payExpected + ', held ' + row.payPushed + ' (the map sum ' + row.payHeldExpected + ', unpushed ' + row.payHeldUnpushed + '), bar ' + row.barMove + ' [' + row.askLabel + ' / ' + row.lastLabel + ']; ' + row.walkId + ' [' + row.walkLabel + '] walked: board ' + JSON.stringify(row.boardAfter) + ' again ' + JSON.stringify(row.boardAgain) + ' phone ' + JSON.stringify(row.phoneList) + ', bar ' + row.walkMove));
    }
  } catch (e) { out.push({ err: String(e && e.message || e).slice(0, 300) }); console.log('  ' + TAG + ' ' + shape + ' ERR ' + String(e && e.message || e).slice(0, 300)); }
  await d.close().catch(() => {});
  return { shape, alpha: ALPHA, rows: out, errs };
}
(async () => {
  const res = [];
  for (const s of SHAPES) res.push(await walk(s));
  const f = path.join(OUTD, 'towns_book_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_the_towns_book_on_the_phone.js', tag: TAG, alpha: ALPHA, builds: BUILDS, walks: res }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f));
})();
