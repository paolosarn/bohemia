#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE TIMES A PRESS ON A SLOWED PHONE, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   THE LOT IS BAKED WHILE HE READS (PLUMBER 8, 11/17/26; rule 441(c), ask row 632: 'the scavenge opens on a blank screen for over 4.6 s').
   MEASURED (the demo, phone upright, CPU 4x, the canvas on a GPU process; 'Search the lot' pressed in a town, the same probe before and
   after): the press to the board on the glass 3.9 to 5.1 s (4.7 s on the same walk), 2.5 to 3.0 s of it the block's board baked in a
   hidden fight page. __THE_LOT_IS_BAKED_WHILE_HE_READS__ (slices/BOHEMIA_SETTLEMENT_SCREEN.html, slices/BOHEMIA_SCAVENGE.html): the lot's
   sheet bakes its block's board while he reads it (a hidden copy of the game's page, #scavwarm), and the press shows what is ready.
   After: 0.69 s once he has read the sheet (0.3 s of it held for UI FOUR's move out of the lot); 1.25 to 1.76 s when he presses inside 8 s
   (the bake behind the town is slower).
     W1 HE READ IT: the lot's sheet up until its bake is in (at most 60 s), then SEARCH: the board in play within 1 s of the press, and it
        is the warm bake's board (the game's frame is the copy that baked, its start says warm and ready)
     W2 ONLY THE LOT KEEPS IT: the lot's sheet again makes its copy; the sheet shut and another place's sheet opened lets it go (no #scavwarm), and no game frame is left
     P1 PLANTED: the old way (window.__SCAV_NO_WARM, armed before the page) bakes after the press: the board takes over 2 s
   node gates/the_lot_is_baked_while_he_reads_gate.js   (about 6 min) */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined && x !== '' ? '  [' + x + ']' : '')); };
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function walk(arm, waitWarm) {
  const d = await D.open({ profile: 'phone_portrait', door: 180000, engage: true, pages: true, throttle: 4, gpu: true, arm: arm || '' });
  const p = d.page, fr = d.fr, R = {};
  try {
    await sleep(3000);
    await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await sleep(3000);
    const town = await fr.evaluate(() => { const bs = ctBases(); const L = (window.MAP_TOWN_HIT || []).map(t => t.name).filter(n => bs[n]); return L[0] || Object.keys(bs)[0] || null; });
    await fr.evaluate(n => { const bs = ctBases(); loopOpenTown({ name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }); }, town);
    const sf = await (await fr.waitForSelector('#settleFrame', { timeout: 60000 })).contentFrame();
    for (let i = 0; i < 200 && !(await sf.evaluate(() => BohemiaSettlement.ready() && !!BohemiaSettlement.state.place).catch(() => false)); i++) await sleep(300);
    await sleep(2500);
    const lot = await sf.evaluate(() => ['lot', 'scavenge'].find(k => !!BohemiaSettlement.where(k)) || null);
    const sbox = () => p.evaluate(() => { const b = BohemiaMotion.box(document.getElementById('cityFrame').contentWindow.LOOP.frame); return [b.x, b.y]; });
    const tapWhere = async (k) => { const w = await sf.evaluate(k => BohemiaSettlement.where(k), k); if (!w) return false; const b = await sbox(); await p.touchscreen.tap(b[0] + w.x, b[1] + w.y); return true; };
    const hasSearch = () => sf.evaluate(() => !![...document.querySelectorAll('#sbody .act')].find(x => /Search the lot/i.test(x.textContent || '') && x.getBoundingClientRect().width > 0));
    const openLot = async () => { for (let i = 0; i < 4; i++) { await tapWhere(lot); for (let k = 0; k < 25; k++) { if (await hasSearch()) return true; await sleep(300); } } return false; };
    R.lotUp = await openLot();
    if (waitWarm) {
      R.waited = 0;
      for (; R.waited < 60000; R.waited += 500) { const ready = await sf.evaluate(() => { const w = document.getElementById('scavwarm'); try { return !!(w && w.contentWindow.SCAV.warmed && w.contentWindow.SCAV.warmed.done); } catch (e) { return false; } }); if (ready) break; await sleep(500); }
    } else await sleep(1500);
    const t0 = Date.now();
    await sf.evaluate(() => { const e = [...document.querySelectorAll('#sbody .act')].find(x => /Search the lot/i.test(x.textContent || '')); if (e) e.click(); });
    let st = null;
    for (let i = 0; i < 1200; i++) { const h = await sf.$('#scavgame'), f = h && await h.contentFrame();
      st = f && await f.evaluate(() => { try { const s = SCAV.state(); return { phase: s.phase, warm: s.warm, spots: (s.spots || []).length }; } catch (e) { return null; } }).catch(() => null);
      if (st && ['play', 'empty', 'failed'].includes(st.phase)) break; await sleep(40); }
    R.ms = Date.now() - t0; R.st = st;
    /* W2: the game left by its own LEAVE, the lot's sheet again (its copy made), then another place's sheet over it: the copy goes */
    try { const h = await sf.$('#scavgame'), f = h && await h.contentFrame(); if (f) await f.evaluate(() => { const l = document.getElementById('leave'); if (l) l.click(); }); } catch (e) {}
    for (let i = 0; i < 40 && (await sf.evaluate(() => !!document.getElementById('scavgame'))); i++) await sleep(250);
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await sleep(600);
    await openLot(); await sleep(900);
    R.warmUp = await sf.evaluate(() => !!document.getElementById('scavwarm'));
    const other = await sf.evaluate(() => ['smith', 'arms', 'armourer', 'market', 'stall', 'clinic', 'bar', 'hall'].find(k => !!BohemiaSettlement.where(k)) || null);
    if (other) { await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); }); await sleep(300);
      await sf.evaluate(() => {}); await tapWhere(other); await sleep(1500); }
    R.other = other; R.afterOther = await sf.evaluate(() => ({ warm: !!document.getElementById('scavwarm'), game: !!document.getElementById('scavgame'), open: BohemiaSettlement.state.open }));
  } catch (e) { R.err = String(e && e.message || e).slice(0, 200); }
  await d.close();
  return R;
}

(async () => {
  console.log('\nTHE LOT IS BAKED WHILE HE READS (ask row 632)\n');
  const A = await walk('', true);
  ok('W1 HE READ IT: the sheet up until its bake is in, then SEARCH: the board in play within 1 s, from the warm bake',
    !A.err && A.lotUp === true && A.st && A.st.phase === 'play' && A.ms <= 1000 && A.st.warm && A.st.warm.ready === true,
    A.err || ('read ' + A.waited + ' ms, the press to the board ' + A.ms + ' ms, ' + JSON.stringify(A.st)));
  ok('W2 ONLY THE LOT KEEPS IT: the lot\'s sheet makes its copy, another sheet (' + A.other + ') lets it go, no game frame left',
    !A.err && A.warmUp === true && A.other && A.afterOther && !A.afterOther.warm && !A.afterOther.game, A.err || JSON.stringify({ warmUp: A.warmUp, other: A.other, after: A.afterOther }));
  const P = await walk('window.__SCAV_NO_WARM = true;', false);
  ok('P1 PLANTED: the old way (window.__SCAV_NO_WARM) bakes after the press: the board takes over 2 s', !P.err && P.st && P.st.phase === 'play' && P.ms > 2000 && !P.st.warm,
    P.err || ('the press to the board ' + P.ms + ' ms, ' + JSON.stringify(P.st)));
  console.log('\nTHE LOT IS BAKED WHILE HE READS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
