#!/usr/bin/env node
// JOBS [the town's book] 11/17 -- THE JOBS' SYSTEMS ON HIS PHONE (VAMILY rules 453, 441). The game on a phone (upright and sideways), the demo
// or the alpha (--alpha), A NEW CREW, the valley K7QM9X. --build A: THE TOWN REMEMBERS: one job done for a town (taken by the board's own
// message, played to the pay) moves the town's bar; the bar set to Friendly (the game's own relations record, the one shortcut, said), the
// next board, opened with a finger, has one more person; set to Unfriendly, the town's shelf charges more than at Neutral and its board
// has no three-skull job. Writes <out>/towns_book_<tag>.json.
// --build B: PUSH THE PAY: a town's board with a finger, one person asked twice (the pay pushed 7% an ask, the bar 0.5 an ask), taken at
// the pushed pay; another asked three times: they walk (the bar -2.5 more) and are gone from the board, again when he walks back in, and
// from the phone's list.
// --build C: WHAT WALKING AWAY COSTS: a company with 300 CLOUT; a job's card read before the yes (the cost line); that job taken and
// dropped in the town with a finger; the job that changes halfway taken and walked away from at its turn with a finger (lost); the bar
// and CLOUT each time against what its card said.
// --build D: PAID INTO HIS PLACE: a one-skull find's card, 'Into your place' tapped with a finger (the pay drops by the build's worth),
// taken and played to the pay; the batteries paid are the card's and the build is his (standing, or waiting for his place).
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
    if (BUILDS.indexOf('C') >= 0) {
      const row = { build: 'C' };
      try {
        /* WHAT WALKING AWAY COSTS: a company with 300 CLOUT (the game's own renown record, the one shortcut, said) at a town at 50; the
           card read before the yes; one job taken and dropped in the town with a finger (the bar and CLOUT against what the card said);
           the job that changes halfway taken and walked away from at its turn with a finger (lost), then he walks back in */
        await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; try { loopClose(); } catch (e) {} try { localStorage.removeItem('bohemia.haggle.v1'); } catch (e) {}
          localStorage.setItem('bohemia.renown.v1', JSON.stringify({ score: 300, keys: [], log: [] })); });
        const ids = ['jb-turn-speakers', 'jb-turn-courier'];
        const cands = await fr.evaluate((ids) => { const all = BohemiaBoardShelf.shelf().offers, bs = ctBases() || {}, step = BohemiaBoardShelf.shelf().refresh_days || 3, out = [];
          for (let d = 1; d <= 1 + 10 * step && !out.length; d += step) { const P = BohemiaBoardShelf.mapPlaces(d) || [];
            for (const id of ids) { const o = all.filter(x => x.id === id)[0]; if (!o) continue; const n = (o.towns || [])[0], p = P.filter(q => q.name === n)[0]; if (!p || !bs[n]) continue;
              const L = BohemiaBoardShelf.pick({ name: p.name, tier: p.tier }, d, { traits: p.traits || [], held: [], places: P }) || [];
              if (L.some(x => x.id === id) && L.length >= 2) out.push({ id, n, day: d, others: L.filter(x => x.id !== id).map(x => x.id) }); } }
          return out; }, ids);
        if (!cands.length) throw new Error('no board posts the job that changes halfway with a second job in eleven windows');
        const K = cands[0], tn = K.n; row.town = tn; row.day = K.day; row.turnId = K.id;
        await setBar(tn, 50);
        let T = await openTown(tn, K.day, null, true), sf = T.sf, sfH = T.sfH;
        row.dropId = T.ids.filter(id => id !== K.id)[0]; if (!row.dropId) throw new Error('no second job on the board: ' + JSON.stringify(T.ids));
        const cardCost = async (id) => { if (!await tapIn(sf, sfH, '#sheet button.act.client[data-id="' + id + '"]')) throw new Error('no finger on ' + id);
          if (!await waitFor(() => sf.evaluate(() => !!document.querySelector('#sheet .trip.quit')), 8000)) throw new Error('no cost line on ' + id + '\'s card');
          await page.waitForTimeout(400);
          return sf.evaluate(() => ({ words: document.querySelector('#sheet .trip.quit').textContent, cost: BohemiaSettlement.state.cost ? { drop: BohemiaSettlement.state.cost.drop, fail: BohemiaSettlement.state.cost.fail } : null,
            fit: [...document.querySelectorAll('#sheet .acts button')].map(b => { const r = b.getBoundingClientRect(); return [String(b.textContent || '').slice(0, 10), Math.round(r.top), Math.round(r.bottom), innerHeight]; }) })); };
        const takeIt = async (id) => { const sel = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button.act')].filter(x => /^Take it/.test(x.textContent))[0]; if (!b) return null; b.dataset.take = 'yes'; return '#sheet button[data-take="yes"]'; });
          if (!sel || !await tapIn(sf, sfH, sel)) throw new Error('no finger on Take it for ' + id);
          if (!await waitFor(() => fr.evaluate((j) => LOOP.held.some(h => h.id === j), id), 10000)) throw new Error(id + ' was not taken'); };
        const clout = () => fr.evaluate(() => BohemiaRenown.score());
        /* the drop */
        row.dropCard = await cardCost(row.dropId);
        row.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_C.png')); await page.screenshot({ path: path.join(ROOT, row.png) });
        await takeIt(row.dropId);
        row.drop0 = { bar: await barRaw(tn), clout: await clout() };
        await waitFor(() => sf.evaluate((j) => !!document.querySelector('#sheet [data-held="' + j + '"]'), row.dropId), 8000);
        if (!await tapIn(sf, sfH, '#sheet [data-held="' + row.dropId + '"]')) throw new Error('no finger on the held job');
        if (!await waitFor(() => sf.evaluate(() => !!document.querySelector('#sheet [data-drop="yes"]')), 6000)) throw new Error('no Drop it');
        if (!await tapIn(sf, sfH, '#sheet [data-drop="yes"]')) throw new Error('no finger on Drop it');
        if (!await waitFor(() => fr.evaluate((j) => !LOOP.held.some(h => h.id === j), row.dropId), 8000)) throw new Error('the drop did not land');
        await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600);
        T = await openTown(tn, K.day, null, true); sf = T.sf; sfH = T.sfH;   /* the town hears it when he walks in again (the settled queue) */
        row.drop1 = { bar: await barRaw(tn), clout: await clout() };
        /* the fail */
        row.failCard = await cardCost(K.id);
        await takeIt(K.id);
        row.fail0 = { bar: await barRaw(tn), clout: await clout() };
        await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600);
        const cfH = await page.$('#cityFrame'); row.steps = []; row.talk = null;
        for (let s = 0; s < 10; s++) {
          const st = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return { gone: true };
            const at = (x, y) => { travelStop(); city.x = x; city.y = y; }; const L = j.legs ? j.legs[j.li | 0] : null; if (!L) return { stuck: 'no leg' };
            at(L.x, L.y); const r = BohemiaJobKinds.arrived(L.x, L.y) || BohemiaJobKinds.step(); return { what: 'leg ' + (j.li | 0) + ' ' + (L.act || L.go), fight: !!r }; }, K.id);
          if (st.gone) break; if (st.stuck) throw new Error(st.stuck); row.steps.push(st.what);
          await page.waitForTimeout(1200);
          const tb = await fr.evaluate(() => { const b = [...document.querySelectorAll('button')].filter(x => /Walk away from it/i.test(x.textContent || '') && x.getBoundingClientRect().width > 0)[0]; if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, (b.textContent || '').trim()]; });
          if (tb) { await page.waitForTimeout(500); const cb = await cfH.boundingBox(); await page.touchscreen.tap(cb.x + tb[0], cb.y + tb[1]); row.talk = tb[2]; await page.waitForTimeout(1200); }
          if (await fightUp()) throw new Error('a fight came up at ' + st.what + (tb ? ' after the walk away' : ''));
        }
        row.lost = await fr.evaluate((id) => ({ lost: (window.__JOB_LOST || []).some(l => l.id === id), held: LOOP.held.some(h => h.id === id) }), K.id);
        row.fail1clout = await clout();
        await openTown(tn, K.day);   /* he walks back in: the town hears it */
        row.fail1 = { bar: await barRaw(tn), clout: row.fail1clout };
        row.fit = row.dropCard.fit.concat(row.failCard.fit); row.cardFits = row.dropCard.fit.length >= 3 && row.fit.every(x => x[2] <= x[3]);   /* every button of both cards on the glass */
        row.dropMatch = !!(row.dropCard.cost && row.drop1.bar === row.dropCard.cost.drop.after && row.drop1.clout === row.dropCard.cost.drop.cloutAfter && row.drop0.bar === row.dropCard.cost.drop.before);
        row.failMatch = !!(row.failCard.cost && row.lost.lost && !row.lost.held && row.fail1.bar === row.failCard.cost.fail.after && row.fail1.clout === row.failCard.cost.fail.cloutAfter && row.fail0.bar === row.failCard.cost.fail.before);
      } catch (e) { row.err = String(e && e.message || e).slice(0, 200); }
      out.push(row);
      console.log('  ' + TAG + ' ' + shape + ' C WHAT WALKING AWAY COSTS: ' + (row.err ? 'ERR ' + row.err : row.town + ' day ' + row.day + ': ' + row.dropId + ' card [' + row.dropCard.words + '] dropped: bar ' + row.drop0.bar + ' -> ' + row.drop1.bar + ', CLOUT ' + row.drop0.clout + ' -> ' + row.drop1.clout + (row.dropMatch ? ' (as the card said)' : ' (NOT as the card said)') + '; ' + row.turnId + ' card [' + row.failCard.words + '] walked away at its turn (' + row.talk + '): bar ' + row.fail0.bar + ' -> ' + row.fail1.bar + ', CLOUT ' + row.fail0.clout + ' -> ' + row.fail1.clout + (row.failMatch ? ' (as the card said)' : ' (NOT as the card said)') + ' steps ' + (row.steps || []).join(' > ')));
    }
    if (BUILDS.indexOf('D') >= 0) {
      const row = { build: 'D' };
      try {
        /* PAID INTO HIS PLACE: a one-skull find on its own board, its card with a finger: 'Into your place' tapped (the pay drops by the
           build's worth), taken, played to the pay (no fight at one skull), and the build is his (it waits for a place before he plants) */
        await fr.evaluate(() => { LOOP.held = []; LOOP.fighting = null; try { loopClose(); } catch (e) {} try { localStorage.removeItem('bohemia.haggle.v1'); } catch (e) {} });
        const ids = ['jb-find-singer', 'jb-find-clerk', 'jb-find-dealers', 'qd-ar10', 'qd-ap05', 'ct-find-the-kid'];
        const cands = await fr.evaluate((ids) => { const all = BohemiaBoardShelf.shelf().offers, bs = ctBases() || {}, step = BohemiaBoardShelf.shelf().refresh_days || 3, out = [];
          for (let d = 1; d <= 1 + 12 * step && !out.length; d += step) { const P = BohemiaBoardShelf.mapPlaces(d) || [];
            for (const p of P) { if (!bs[p.name]) continue; const L = BohemiaBoardShelf.pick({ name: p.name, tier: p.tier }, d, { traits: p.traits || [], held: [], places: P }) || [];
              const o = L.filter(x => ids.indexOf(x.id) >= 0 && ((all.filter(y => y.id === x.id)[0] || {}).skulls | 0 || 1) === 1)[0]; if (o) { out.push({ id: o.id, n: p.name, day: d }); break; } } }
          return out; }, ids);
        if (!cands.length) throw new Error('no board posts a one-skull find in thirteen windows');
        const K = cands[0], tn = K.n; row.town = tn; row.day = K.day; row.id = K.id;
        await setBar(tn, 50);
        const T = await openTown(tn, K.day, null, true), sf = T.sf, sfH = T.sfH;
        if (!await tapIn(sf, sfH, '#sheet button.act.client[data-id="' + K.id + '"]')) throw new Error('no finger on ' + K.id);
        if (!await waitFor(() => sf.evaluate(() => !!document.querySelector('#sheet [data-into]')), 10000)) throw new Error('no Into your place on the card');
        const payOf = () => sf.evaluate(() => { const t = (document.querySelector('#sbody .say p') || {}).textContent || ''; const m = t.match(/(\d+) batter/); return m ? +m[1] : null; });
        row.pay0 = await payOf(); row.into0 = await sf.evaluate(() => document.querySelector('#sheet [data-into]').dataset.into);
        if (!await tapIn(sf, sfH, '#sheet [data-into]')) throw new Error('no finger on Into your place');
        if (!await waitFor(() => sf.evaluate(() => { const b = document.querySelector('#sheet [data-into]'); return !!b && b.dataset.into !== 'none'; }), 8000)) throw new Error('the shape did not change');
        await page.waitForTimeout(500);
        row.into1 = await sf.evaluate(() => { const b = document.querySelector('#sheet [data-into]'); return { build: b.dataset.into, label: b.textContent }; });
        row.pay1 = await payOf();
        row.fit = await sf.evaluate(() => [...document.querySelectorAll('#sheet .acts button')].map(b => { const r = b.getBoundingClientRect(); return [String(b.textContent || '').slice(0, 10), Math.round(r.top), Math.round(r.bottom), innerHeight]; }));
        row.cardFits = row.fit.length >= 4 && row.fit.every(x => x[2] <= x[3]);
        row.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_D.png')); await page.screenshot({ path: path.join(ROOT, row.png) });
        const sel = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button.act')].filter(x => /^Take it/.test(x.textContent))[0]; if (!b) return null; b.dataset.take = 'yes'; return '#sheet button[data-take="yes"]'; });
        if (!sel || !await tapIn(sf, sfH, sel)) throw new Error('no finger on Take it');
        if (!await waitFor(() => fr.evaluate((j) => LOOP.held.some(h => h.id === j), K.id), 10000)) throw new Error(K.id + ' was not taken');
        row.held = await fr.evaluate((id) => { const h = LOOP.held.filter(x => x.id === id)[0]; return h ? { pay: h.pay, into: h.into || null } : null; }, K.id);
        const mp = await fr.evaluate(([p, n]) => typeof loopJobPay === 'function' ? loopJobPay(p, n) : null, [row.pay1, tn]);
        await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(600);
        const b0 = await fr.evaluate(() => { try { const r = BohemiaHomeMap.rec(); return { things: (r && r.things || []).length, waiting: (r && r.waiting || []).length }; } catch (e) { return null; } });
        for (let s = 0; s < 10; s++) { const st = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; if (!j) return 'gone';
            const at = (x, y) => { travelStop(); city.x = x; city.y = y; }; const x = j.stage === 'look' ? j.spot.x : j.target.x, y = j.stage === 'look' ? j.spot.y : j.target.y; at(x, y); BohemiaJobKinds.arrived(x, y) || BohemiaJobKinds.step(); return j.stage; }, K.id);
          if (st === 'gone') break; await page.waitForTimeout(900); if (await fightUp()) throw new Error('a fight on a one-skull find'); }
        row.paid = await fr.evaluate((id) => (window.__JOB_PAID || []).filter(p => p.id === id).slice(-1)[0] || null, K.id);
        row.home = await fr.evaluate((id) => { try { const r = BohemiaHomeMap.rec(), k = 'job:' + id, f = (L) => (L || []).filter(t => t.id === k)[0] || null; const t = f(r && r.things), w = f(r && r.waiting); return { thing: t ? { build: t.build, name: t.name, from: t.from, lot: t.lot } : null, waiting: w ? { build: w.build, name: w.name, from: w.from } : null, planted: !!(r && r.planted) }; } catch (e) { return { err: e.message }; } }, K.id);
        row.ok = !!(row.into0 === 'none' && row.into1.build !== 'none' && row.held && row.held.into && row.held.into.build === row.into1.build && row.pay0 - row.pay1 === row.held.into.worth && row.held.pay === row.pay1 && row.paid && row.paid.paid === row.held.pay && row.paid.into && row.paid.into.ok && (row.home.thing || row.home.waiting) && ((row.home.thing || row.home.waiting).build === row.into1.build));
      } catch (e) { row.err = String(e && e.message || e).slice(0, 200); }
      out.push(row);
      console.log('  ' + TAG + ' ' + shape + ' D PAID INTO HIS PLACE: ' + (row.err ? 'ERR ' + row.err : row.town + ' day ' + row.day + ' ' + row.id + ': the card ' + row.pay0 + ' batteries, [' + row.into1.label + '] ' + row.pay1 + '; held ' + JSON.stringify(row.held) + '; paid ' + JSON.stringify(row.paid) + '; his place ' + JSON.stringify(row.home) + (row.ok ? ' OK' : ' NOT OK') + (row.cardFits ? '' : '; A BUTTON OFF THE GLASS ' + JSON.stringify(row.fit))));
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
