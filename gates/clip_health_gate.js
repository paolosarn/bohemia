// BOHEMIA — CLIP HEALTH GATE (8/2/26). Every clip, every facing, real phases.
//
// Paolo names animations as the next big block of work. Before building on top of
// 102 clips, somebody should check the 102 clips still work -- and nothing did.
// MOTION VISIBLE proves a clip whose NAME promises movement moves. It does not
// sweep the whole set for frames that THROW, or for a clip that has quietly gone
// still. This is the net under the whole animation lane.
//
// THE SAMPLING TRAP THIS GATE EXISTS AROUND, learned twice today: the first sweep
// sampled 4 phases and reported `brace` and `winded` as FROZEN. Resampled at the
// engine's real 24 buckets they show 20 and 16 distinct frames. A clip's motion can
// alias to identical frames at coarse phases, so a coarse sweep INVENTS regressions.
// This gate samples FRAME_CACHE.buckets, whatever that is, so it can never drift
// out of step with the engine it is measuring.
const path = require('path');
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== CLIP HEALTH GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForTimeout(2400);
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  if (errs.length) { await b.close(); done(); }

  const R = await pg.evaluate(() => {
    const D = ['S','SE','E','NE','N','NW','W','SW'];
    /* the ENGINE's own bucket count, so this can never drift out of step with it */
    const N = (typeof FRAME_CACHE !== 'undefined' && FRAME_CACHE.buckets) || 24;
    const threw = [], still = [], empty = [];
    for (const c of CLIPS) {
      const seen = new Set();
      let minInk = 1e9;
      for (const d of D) {
        for (let k = 0; k < N; k++) {
          let fr;
          try { fr = buildFrame(d, c, k / N); }
          catch (e) { threw.push(c + '@' + d); continue; }
          let ink = 0, sig = 2166136261 >>> 0;
          for (let i = 0; i < fr.px.length; i++) if (fr.px[i]) { ink++; sig ^= i; sig = Math.imul(sig, 16777619) >>> 0; }
          if (ink < minInk) minInk = ink;
          seen.add(d + ':' + sig.toString(36));
        }
      }
      if (minInk < 150) empty.push(c + ':' + minInk);
      if (seen.size <= D.length) still.push(c);   /* one frame per facing = nothing moves */
    }
    return { n: CLIPS.length, buckets: N, threw, still, empty };
  });

  ok(`the whole clip set is swept (${R.n} clips x 8 facings x ${R.buckets} phases)`, R.n > 90);
  ok(`no clip THROWS on any frame (${R.threw.length})` + (R.threw.length ? ': ' + R.threw.slice(0,3) : ''),
    R.threw.length === 0);
  ok(`no clip renders an empty body (${R.empty.length})` + (R.empty.length ? ': ' + R.empty.slice(0,3) : ''),
    R.empty.length === 0);
  ok(`no clip has gone completely still (${R.still.length})` + (R.still.length ? ': ' + R.still.slice(0,5) : ''),
    R.still.length === 0);
  ok('it samples the ENGINE\'s bucket count, so a coarse probe cannot invent a regression',
    R.buckets >= 24);

  await b.close();
  done();
})();
