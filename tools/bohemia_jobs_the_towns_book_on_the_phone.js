#!/usr/bin/env node
// JOBS [the town's book] 11/17 -- THE JOBS' SYSTEMS ON HIS PHONE (VAMILY rules 453, 441). The game on a phone (upright and sideways), the demo
// or the alpha (--alpha), A NEW CREW, the valley K7QM9X. --build A: THE TOWN REMEMBERS: one job done for a town (taken by the board's own
// message, played to the pay) moves the town's bar; the bar set to Friendly (the game's own relations record, the one shortcut, said), the
// next board, opened with a finger, has one more person; set to Unfriendly, the town's shelf charges more than at Neutral and its board
// has no three-skull job. Writes <out>/towns_book_<tag>.json.
// node tools/bohemia_jobs_the_towns_book_on_the_phone.js --build A [--alpha] [--shapes phone_portrait,phone_landscape] [--out dir] [--tag t]
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, BUILDS = arg('--build', 'A').split(','), CODE = arg('--code', 'K7QM9X');
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.join(ROOT, arg('--out', 'records/target/jobs_11_17')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
fs.mkdirSync(OUTD, { recursive: true });

async function walk(shape) {
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], out = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const fightUp = () => page.evaluate(() => !!CITYFIGHT);
  /* the town on day d, its BOARD with a finger, this town's own sheet: the people's ids and the shelf's prices */
  async function openTown(tn, day, shot) {
    await fr.evaluate(([n, dd]) => { try { loopClose(); } catch (e) {} DAY.day = dd; const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, [tn, day]);
    await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 60000);
    if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
    const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
    await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn), 20000);
    for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(); if (xy) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y);
      if (await waitFor(() => sf.evaluate((n) => BohemiaSettlement.state.open === 'board' && BohemiaSettlement.state.place.name === n && document.querySelectorAll('#sheet button.act.client').length > 0, tn), 8000)) break; }
    await page.waitForTimeout(1200);
    const r = await sf.evaluate(() => { const S = BohemiaSettlement.state, ids = [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id);
      const all = window.BohemiaBoardShelf.shelf().offers, sk = ids.map(id => { const o = all.filter(x => x.id === id)[0]; return o ? (o.skulls | 0) || 1 : 0; });
      let n = 0, sum = 0; for (const k in (S.stock || {})) (S.stock[k] || []).forEach(it => { if (it.base > 0 && it.price > 0) { n++; sum += it.price / it.base; } });
      return { ids, skulls: sk, priceRatio: n ? sum / n : null, items: n }; });
    if (shot) { r.png = path.relative(ROOT, path.join(OUTD, TAG + '_' + (shape === 'phone_portrait' ? 'upright' : 'sideways') + '_' + shot + '.png')); await page.screenshot({ path: path.join(ROOT, r.png) }); }
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(500);
    return r;
  }
  const setBar = (tn, v) => fr.evaluate(([n, val]) => { let r = null; try { r = JSON.parse(localStorage.getItem('bohemia.relations.v1') || 'null'); } catch (e) {} r = r && r.bars ? r : { bars: {}, seen: {} }; r.seen = r.seen || {};
    r.bars[n] = val; r.seen[n] = DAY.day; localStorage.setItem('bohemia.relations.v1', JSON.stringify(r)); try { localStorage.removeItem('bohemia.job.settled.v1'); } catch (e) {}
    const f = document.getElementById('settleFrame'); try { if (f && f.contentWindow && f.contentWindow.BohemiaSettlement) f.contentWindow.BohemiaSettlement.state.rel = null; } catch (e) {} return true; }, [tn, v]);
  const barOf = (tn) => fr.evaluate((n) => BohemiaJobPay.scoreOf(n, DAY.day), tn);
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
