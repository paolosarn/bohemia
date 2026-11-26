/* ==========================================================================
   THE CARD READS CLEAN, AND OPENS AT ONCE  (JOBS 2, 11/26/26; ask row 730; VAMILY rules 482, 480(c), 466(c), 441)

   EYES 11/26 on the alpha slowed 4x: a job's row to its card 683 ms (a task of 608 ms), Take it 800 ms. MEASURED by a profile of the tap:
   the card planned the whole job and rolled every fight to write what it asks (311 ms at 4x) and planned it again for the trip. And the
   card read as a run-on sentence ending '1 fight, 1 maybe. Your name: about +122 FOLLOWERS.' (rule 482: cleaner, less clutter; 466(c):
   the numbers stay in the background).
   NOW: the card's two reads are kept per job and town (ten minutes of the map's clock, his block, his jobs, crew and name), and a board
   he reads warms them for its people in idle time; the card says the trip as PLACE · about N hours beside its mark, and each stop on its
   own line, with no sum and no followers.

     C1  the files: the jobs' cache, its warm-up from the board, the card drawn from it, the lines, the style
     C2  on his phone, the demo and the alpha, upright and sideways: every person on Caravans' board opened with a finger: the trip line
         says where and about how long, each stop on its own line, no number of followers, Take it and Not now on the glass; the cache
         was warmed by the board and the card came from it
     C3  on the demo held upright, the CPU slowed 4x (the GPU drawing): the longest task from a finger on a person to the card under 300
         ms (608 before, EYES; 535 measured), Take it's under 350 ms (701 before, EYES; 372 measured). The card's own reads are out of the
         profile; what is left in the window is the town's own frame at 4x (its picture drawn every frame, about 200 ms there; RUN TWO's,
         records/BOHEMIA_JOBS_TWO_RULE_480_THE_JOBS_AS_BUILT_11_26_26.md), so the bar sits over it, not under it
     C4  nothing threw
   node gates/the_card_reads_clean_gate.js       CARD_FILES=1 the files only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE CARD READS CLEAN: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
{ const JK = T('slices/bohemia_job_kinds.js'), SH = T('slices/bohemia_board_shelf.js'), SS = T('slices/BOHEMIA_SETTLEMENT_SCREEN.html');
  const c1 = [/__THE_CARD_IS_INSTANT__/.test(JK) && /function asksCard\(c, place\)/.test(JK) && /function tripCard\(c, place\)/.test(JK) && /function warm\(offers, place\)/.test(JK) && /requestIdleCallback\(go, \{ timeout: 900 \}\)/.test(JK)
      && /asksCard: asksCard, tripCard: tripCard, tripLine: tripLine, warm: warm,/.test(JK),
    /__THE_CARD_READS_CLEAN__/.test(JK) && /return \{ words: words, stops: stops, lines: lines,/.test(JK) && /function tripLine\(T\)/.test(JK),
    /JKw\.warm\(/.test(SH),
    /JA\.asksCard \? JA\.asksCard\(o, S\.place\.name\)/.test(SS) && /JK\.tripCard \? JK\.tripCard\(o, S\.place\.name\)/.test(SS) && /JK\.tripLine \? JK\.tripLine\(TR\) : TR\.words/.test(SS) && /st\.className = 'st'/.test(SS) && /\.say \.trip\.asks \.st\{/.test(SS)];
  ok('C1 the files: the card\'s reads kept and warmed from the board, the card drawn from them, the trip line and the stops a line each', c1.every(Boolean), c1.map(b => b ? 1 : 0).join('')); }
if (process.env.CARD_FILES) done();

const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const ARM = "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}";
async function board(shape, alpha, throttle) {
  const d = await drive.open(Object.assign({ profile: shape, alpha, fog: false, keepCards: true, engage: true, arm: ARM }, throttle ? { throttle, gpu: true } : {}));
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(200); } return false; };
  await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.LOOP && LOOP.start, null, { timeout: 300000 });
  await page.waitForTimeout(throttle ? 8000 : 2500);
  const tn = 'Caravans';
  await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; travelStop(); city.x = b.x; city.y = b.y; townTap({ name: n, x: b.x, y: b.y }); }, tn);
  await waitFor(() => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)), 90000);
  if (await fr.evaluate(() => !!(window.MEET && MEET.up))) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); });
  const sfH = await fr.$('#settleFrame'), sf = await sfH.contentFrame();
  await waitFor(() => sf.evaluate((n) => !!(BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n), tn), 30000);
  const openBoard = async () => { for (let k = 0; k < 4; k++) { const xy = await sf.evaluate(() => BohemiaSettlement.where('board')), hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]);
      if (xy) await page.touchscreen.tap(hb.x + xy.x * hb.width / (iw[0] || hb.width), hb.y + xy.y * hb.height / (iw[1] || hb.height));
      if (await waitFor(() => sf.evaluate(() => BohemiaSettlement.state.open === 'board' && document.querySelectorAll('#sheet button.act.client').length > 0), 10000)) return true; } return false; };
  const tap = async (sel) => { const r = await sf.evaluate((q) => { const e = document.querySelector(q); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel);
    if (!r) return false; const hb = await sfH.boundingBox(), iw = await sf.evaluate(() => [innerWidth, innerHeight]); await page.touchscreen.tap(hb.x + r.x * hb.width / iw[0], hb.y + r.y * hb.height / iw[1]); return true; };
  const ltOn = () => sf.evaluate(() => { window.__LT = []; if (!window.__LTO) { window.__LTO = new PerformanceObserver(l => l.getEntries().forEach(e => window.__LT.push(Math.round(e.duration)))); window.__LTO.observe({ entryTypes: ['longtask'] }); } });
  return { d, fr, page, sf, sfH, errs, waitFor, openBoard, tap, ltOn, tn };
}
(async () => {
  const rows = [], errs = [];
  for (const [shape, alpha] of [['phone_portrait', false], ['phone_landscape', false], ['phone_portrait', true], ['phone_landscape', true]]) {
    const row = { shape, alpha, cards: [] };
    try {
      const B = await board(shape, alpha, 0);
      if (!(await B.openBoard())) throw new Error('the board did not open');
      await B.page.waitForTimeout(3500);   /* the board read; its warm-up in idle time */
      const ids = await B.sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => b.dataset.id));
      row.warmed = await B.fr.evaluate(() => window.__CARD_WARMED | 0);
      for (const id of ids) {
        if (!(await B.sf.evaluate(() => BohemiaSettlement.state.open === 'board' && !!document.querySelector('#sheet button.act.client')))) await B.openBoard();
        const h0 = await B.fr.evaluate(() => window.__CARD_HITS | 0);
        await B.tap('#sheet button.act.client[data-id="' + id + '"]');
        await B.waitFor(() => B.sf.evaluate(() => [...document.querySelectorAll('#sheet button')].some(x => /take it/i.test(x.textContent || ''))), 8000);
        const c = await B.sf.evaluate(() => { const on = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); return r.height > 0 && r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1; };
          const tr = document.querySelector('#sheet .say .trip:not(.asks)'), as = document.querySelector('#sheet .say .trip.asks'), lines = as ? [...as.querySelectorAll('.st')].map(e => e.textContent) : [];
          const take = [...document.querySelectorAll('#sheet button')].filter(x => /take it|drop/i.test(x.textContent || ''))[0], no = [...document.querySelectorAll('#sheet button')].filter(x => /not now/i.test(x.textContent || ''))[0];
          return { trip: tr ? tr.textContent : null, lines, text: as ? as.textContent : '', take: on(take), no: on(no) }; });
        c.hit = (await B.fr.evaluate(() => window.__CARD_HITS | 0)) > h0; c.id = id;
        row.cards.push(c);
        await B.sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button')].filter(x => /not now/i.test(x.textContent || ''))[0]; if (b) b.click(); }); await B.page.waitForTimeout(700);
      }
      B.errs.forEach(e => errs.push(e)); await B.d.close().catch(() => {});
    } catch (e) { row.err = String(e && e.message || e).slice(0, 200); }
    rows.push(row);
  }
  const good = (c) => !!c.trip && /·/.test(c.trip) && /minute|hour|day/.test(c.trip) && c.lines.length >= 1 && c.lines.every(l => l.length > 3) && !/FOLLOWERS|CLOUT|Your name|What it asks/.test(c.text) && c.take && c.no;
  ok('C2 on his phone, the demo and the alpha, upright and sideways: every person on Caravans\' board: the trip says where and about how long, a stop a line, no followers, Take it and Not now on the glass, the card from the board\'s warm-up',
    rows.length === 4 && rows.every(r => !r.err && r.cards.length >= 1 && r.cards.every(good) && r.warmed >= 1 && r.cards.some(c => c.hit)),
    rows.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : r.cards.length + ' cards, warmed ' + r.warmed + ', ' + r.cards.map(c => (good(c) ? '' : 'BAD ') + c.lines.length + ' stops' + (c.hit ? '' : ' (read at the tap)')).join(', ') + ' | "' + (r.cards[0] && r.cards[0].trip) + '"')).join(' || '));
  /* C3: the slowed phone */
  let slow = null;
  try {
    const B = await board('phone_portrait', false, 4);
    if (!(await B.openBoard())) throw new Error('the board did not open at 4x');
    await B.page.waitForTimeout(4500);
    await B.ltOn(); await B.tap('#sheet button.act.client');
    await B.waitFor(() => B.sf.evaluate(() => [...document.querySelectorAll('#sheet button')].some(x => /take it/i.test(x.textContent || ''))), 10000); await B.page.waitForTimeout(500);
    const card = await B.sf.evaluate(() => window.__LT.slice());
    await B.page.waitForTimeout(2500);
    await B.sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet button')].filter(x => /take it/i.test(x.textContent || ''))[0]; if (b) b.id = b.id || 'cg_take'; });
    await B.ltOn(); await B.tap('#cg_take');
    await B.waitFor(() => B.fr.evaluate(() => LOOP.held.length > 0), 10000); await B.page.waitForTimeout(700);
    const take = await B.sf.evaluate(() => window.__LT.slice());
    slow = { card: Math.max(0, ...card), take: Math.max(0, ...take), cardAll: card, takeAll: take, held: await B.fr.evaluate(() => LOOP.held.length) };
    B.errs.forEach(e => errs.push(e)); await B.d.close().catch(() => {});
  } catch (e) { slow = { err: String(e && e.message || e).slice(0, 200) }; }
  ok('C3 the demo upright, the CPU slowed 4x: the longest task from a finger on a person to the card under 300 ms (608 before), Take it\'s under 350 ms (701 before)',
    !!slow && !slow.err && slow.card < 300 && slow.take < 350 && slow.held > 0, JSON.stringify(slow));
  ok('C4 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
  done();
})();
