/* WHAT IS THE COMBAT FLOOR ACTUALLY MADE OF?  (COOK, [combat ground], 9/6/26)
 *
 * The row says: "the combat floor tile at 1.5 to 2 sprite-widths, on the 45-degree corpus:
 * house, yard, street, lot, cover that reads; a house with a backyard spans 1x2 (9/4 tile
 * law 3d)". Before cooking any of that, ask the board what it has.
 *
 * MEASURED IN THE FIGHT'S OWN REALM, on the real surface, the way the plumber's floor gate
 * does it: boot to play, start an encounter, then read the floor the frame is drawing.
 *
 *   node tools/bohemia_combat_ground_probe_9_6_26.js
 */
'use strict';
const path = require('path');
const PERF = require(path.dirname(__dirname) + '/gates/bohemia_phone_perf.js');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const LOOK = `(() => {
  if (typeof G === 'undefined' || typeof streetKindAt !== 'function') return { err: 'no fight' };
  /* THE BIGGEST CANVAS IS THE BOARD. The first run of this took
     document.querySelector('canvas') and got a 183x54 UI strip, so it reported the kind
     mix of a sliver and called it the floor. */
  const all = [...document.querySelectorAll('canvas')];
  if (!all.length) return { err: 'no canvas' };
  const cv = all.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0];
  const W = cv.width, H = cv.height;
  const t = (typeof G.ring === 'number' && G.ring) ? G.ring : 44;
  G.worldOff = G.worldOff || { x: 0, y: 0 };
  const offx = G.worldOff.x, offy = G.worldOff.y;
  const cx = W / 2, cy = H / 2;
  /* the same window the floor paints, without the camera maths: what a body can see */
  const half = Math.ceil((W / 2) / t) + 2, halfY = Math.ceil((H / 2) / t) + 2;
  const kinds = {}, missing = {}, sizes = {};
  let cells = 0, art = 0, flat = 0;
  for (let wy = -halfY; wy <= halfY; wy++) for (let wx = -half; wx <= half; wx++) {
    cells++;
    /* FOLLOW THE PAINT LOOP, DO NOT RE-STATE IT. streetKindAt still answers 'lot' for the
       band beside the street; the floor refines that to house / yard / wall exactly where
       it refines the lot's variant. A probe that stops at streetKindAt measures the old
       board and reports 26% lot on a build that has none. */
    let k = streetKindAt(wx);
    if (k === 'lot' && typeof lotSubKind === 'function') k = lotSubKind(wx, wy);
    kinds[k] = (kinds[k] || 0) + 1;
    const n = ((typeof STREET_B64 !== 'undefined' && STREET_B64[k]) || [1]).length;
    const h = (Math.imul(wx|0,73856093) ^ Math.imul(wy|0,19349663)) >>> 0;
    const idx = (k === 'lot' && typeof lotIdx === 'function') ? lotIdx(wx, wy, n) : (h % n);
    let tile = null; try { tile = streetTile(k, idx, Math.ceil(t) + 1, (h / n) | 0); } catch (e) {}
    if (tile) { art++; sizes[k] = tile.width; } else { flat++; missing[k] = (missing[k] || 0) + 1; }
  }
  const have = (typeof STREET_B64 !== 'undefined') ? Object.keys(STREET_B64) : [];
  const counts = {}; for (const k of have) counts[k] = STREET_B64[k].length;
  return { W, H, tile: t, arenaKind: G.arenaKind || 'street', cells, art, flat,
           kinds, missing, have: counts, ready: (typeof STREET_READY !== 'undefined') ? !!STREET_READY : null,
           canvases: all.map(c => c.width + 'x' + c.height).join(' '),
           spriteW: (function(){ for (const n of ['RIG_W','SPR_W','BODY_W','CW'])
             { try { const v = eval(n); if (typeof v === 'number' && v > 0) return { n: n, v: v }; } catch (e) {} }
             return null; })() };
})()`;

(async () => {
  const { chromium } = PERF.requirePlaywright();
  const { srv, port } = await PERF.startServer();
  const browser = await chromium.launch();
  let r = null;
  try {
    const ctx = await browser.newContext(PERF.PHONE);
    await ctx.addInitScript(PERF.WITNESS);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    page.__cdp = cdp;
    await cdp.send('Performance.enable');
    await PERF.bootToPlay(page, 'http://127.0.0.1:' + port, PERF.PAGES.demo, () => {}, {});
    await PERF.awaitQuiet(cdp, 25000);
    const started = await page.evaluate(() => {
      try { cityEncounterIn({ packageId: 1, label: 'combat ground probe' }); return 'ok'; }
      catch (e) { return 'threw: ' + e.message; }
    });
    if (started !== 'ok') { r = { err: 'the fight never started: ' + started }; }
    else {
      let cf = null;
      for (let i = 0; i < 300 && !cf; i++) {
        await sleep(100);
        const h = await page.$('#combatFrame');
        if (h) { const c = await h.contentFrame();
          if (c && (await c.evaluate(() => document.querySelectorAll('canvas').length).catch(() => 0)) > 0) cf = c; }
      }
      if (!cf) r = { err: 'the fight never showed a canvas' };
      else { await sleep(2500); r = await cf.evaluate(LOOK).catch(e => ({ err: String(e) })); }
    }
  } finally { await browser.close(); try { srv.close(); } catch (e) {} }

  if (!r || r.err) { console.log('PROBE FAILED: ' + (r && r.err)); process.exit(1); }
  console.log('\nWHAT IS THE COMBAT FLOOR MADE OF?');
  console.log('  arena "' + r.arenaKind + '", canvas ' + r.W + 'x' + r.H + ', tile ' + r.tile + ' px' +
              (r.spriteW ? ', sprite ' + r.spriteW.v + ' px (' + r.spriteW.n + ')' +
                '  -> tile is ' + (r.tile / r.spriteW.v).toFixed(2) + ' sprite-widths' : ''));
  console.log('  canvases on the page: ' + r.canvases);
  console.log('  street tile bank ready: ' + r.ready);
  console.log('\n  THE BANK HAS ' + Object.keys(r.have).length + ' KINDS:');
  for (const k of Object.keys(r.have).sort())
    console.log('    ' + k.padEnd(10) + r.have[k] + ' variant' + (r.have[k] === 1 ? '' : 's'));
  console.log('\n  WHAT THE BOARD ASKS FOR, over ' + r.cells + ' visible cells:');
  const tot = r.cells;
  for (const k of Object.keys(r.kinds).sort((a, b) => r.kinds[b] - r.kinds[a])) {
    const miss = r.missing[k] || 0;
    console.log('    ' + k.padEnd(10) + String(r.kinds[k]).padStart(6) + ' cells  ' +
      (100 * r.kinds[k] / tot).toFixed(1).padStart(5) + '%   ' +
      (miss ? 'NO ART -- flat fill' : 'drawn from the bank'));
  }
  console.log('\n  *** ' + r.flat + ' of ' + tot + ' cells (' + (100 * r.flat / tot).toFixed(1) +
    '%) have no tile at all and fall through to a flat colour with a tone jitter. ***');
  console.log('  ' + r.art + ' cells (' + (100 * r.art / tot).toFixed(1) + '%) draw approved art.');
})();
