const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
// BOHEMIA — CLOTHES FACING GATE (8/1/26). FACTORY LAW: new machinery, own gate.
//
// Paolo 8/1: "I'm very concerned that the back of many outfits look like the
// front of all the outfits ... when I'm facing north the back of my outfits are
// the exact same when I'm facing south you know it's very disturbing."
//
// He was right and it was ONE VARIABLE. 19 generators read `curDir` to pick
// front-from-back. It was assigned in exactly one place -- the CLOTHES-tab
// preview -- so the CHARACTER view, the crowd and the run all rendered every
// garment as if he were facing south, forever. The back-facing code was written,
// wired, and never fed.
//
// WHAT THIS GATE HOLDS:
//   IT IS FED        the composite hands the frame's direction to the generators.
//                    Proved by FORCING the old broken value and showing the
//                    render changes -- if it did not change, nothing is reading.
//   IT IS HANDED     the CLOTHES preview owns curDir. The composite must put it
//   BACK             back, or judging a garment in the CLOTHES tab silently
//                    starts depending on which way the CHARACTER tab last looked.
//   BACKS DIFFER     coats and bags must render differently front vs back, and
//                    the difference must survive the body's own differences.
const path = require('path'), fs = require('fs');
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const src = fs.readFileSync(ALPHA, 'utf8');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== FACING GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the setter is exposed from the generators\' closure', /window\.CLO_SET_DIR\s*=\s*function/.test(src));
ok('the composite feeds the FRAME direction', /CLO_SET_DIR\s*\(\s*d\s*\)/.test(src));
ok('and restores it in a finally (the CLOTHES preview owns this variable)',
  /finally\s*\{\s*if\(window\.CLO_SET_DIR\)\s*window\.CLO_SET_DIR\(_cdWas\)/.test(src));

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2200);
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  if (errs.length) { await b.close(); done(); }
  await pg.evaluate(() => { const fr = document.getElementById('front'); if (fr) fr.click(); });
  await SETTLE(pg, 500);

  const R = await pg.evaluate(() => {
    const keepW = window.G_WORN, keepE = G.equipped;
    const eq = {}; for (const k in keepE) eq[k] = keepE[k];
    ['shirt','jacket','pants','shoes','hat','glasses','hair'].forEach(k => eq[k] = '');
    const sig = (d) => { const fr = buildFrame(d, 'idle', 0); let h = 2166136261 >>> 0;
      for (let i = 0; i < fr.px.length; i++) { const c = fr.px[i];
        h ^= c ? (((c[0] << 16) | (c[1] << 8) | c[2]) + 1) : 0; h = Math.imul(h, 16777619) >>> 0; }
      return h.toString(36); };
    const res = { fed: [], notFed: [], bare: {} };
    try {
      G.equipped = eq;
      /* THE DECISIVE TEST. Render N normally, then render N with the generators
         PINNED to the old broken 'S' by re-setting curDir immediately after the
         composite would have set it. If those two frames are identical, nothing
         is reading the direction and the bug is back. */
      window.G_WORN = {};
      for (const d of ['S','N']) res.bare[d] = sig(d);
      /* SHOES JOINED THIS LIST ON 8/1. When the direction first started flowing,
         genShoes did not move -- it read no facing at all, so all 18 canon shoes
         rendered byte-identical front to back and he saw a laced tongue on the back
         of his heel. That was recorded as the honest remainder of the facing fix
         rather than bundled into it, and then built: no laces from behind, a heel
         counter, and a one-pixel centre seam. */
      const PICK = ['DENIM JACKET','SOOT TRENCH','LEATHER JACKET','OXBLOOD SATCHEL',
                    'BROWN BOOTS','WHITE SNEAKERS'];
      for (const nm of PICK) {
        const g = (window.GARMENTS || []).find(x => x.n === nm);
        if (!g) continue;
        window.G_WORN = { [g.layer]: nm };
        const real = sig('N');
        /* pin it: make the setter a no-op that always leaves 'S' behind */
        const realSetter = window.CLO_SET_DIR;
        window.CLO_SET_DIR = function (dd) { return realSetter('S'); };
        if (typeof FRAME_CACHE !== 'undefined') FRAME_CACHE.map.clear();
        const pinned = sig('N');
        window.CLO_SET_DIR = realSetter;
        if (typeof FRAME_CACHE !== 'undefined') FRAME_CACHE.map.clear();
        (real !== pinned ? res.fed : res.notFed).push(nm);
      }
      /* HANDED BACK: after a composite, the value the preview left must survive */
      window.G_WORN = { outer: 'DENIM JACKET' };
      window.CLO_SET_DIR('W');
      sig('N');
      res.restored = window.CLO_SET_DIR(null) === 'W';
    } finally { window.G_WORN = keepW; G.equipped = keepE; }
    return res;
  });

  ok(`the direction actually reaches the generators (${R.fed.length} fed, ${R.notFed.length} deaf${R.notFed.length ? ': ' + R.notFed.join(', ') : ''})`,
    R.fed.length >= 5 && R.notFed.length === 0);
  ok('the CLOTHES preview gets its value back after a composite', R.restored === true);
  ok('the bare body itself still differs front vs back (the control)', R.bare.S !== R.bare.N);

  await b.close();
  done();
})();
