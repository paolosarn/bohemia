/* ===========================================================================
   BOHEMIA — THE BACK LIMB COLOR AUDIT (7/26/26)
   ---------------------------------------------------------------------------
   Paolo: "There's still fucked up MATH colored pixels that do weird random
   shit... why can't the back arm and the back leg have the proper clothing... I
   don't want it to be a different shade off the bat, and if you make it a
   different shade that's a whole different layering process that isn't actually
   color-coded on the clothing pixel wise."

   FIRST ATTEMPT AT THIS AUDIT WAS WRONG and is recorded so nobody repeats it: it
   tested whether an on-screen colour exists in his painted palette. That test is
   meaningless here, because garments store RAMP INDICES (0,1,2) resolved through
   PD.ramps and then TINTED, so legal tinting invents new RGB by design. The test
   said 67% of the character was "invented", which is nonsense.

   THE RIGHT TEST, and it is exactly his sentence: the back limb should be wearing
   the SAME CLOTHING as the front limb. So compare the colour sets:

     colours that appear on the FAR arm/leg but NEVER on the near one
     colours that appear on the NEAR arm/leg but never on the far one

   A garment is one garment. If the far side has exclusive colours, something is
   shading it separately -- which is the thing he says must be its own layer and
   must never be baked into the clothing's pixels.

   Plus a second, independent count: LONE PIXELS -- a garment pixel whose colour
   matches none of its four neighbours. That is "weird random shit" made
   measurable.

     node tools/bohemia_invented_color_audit.js

   REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks zero pixels.
   =========================================================================== 
  RIG CHECK (RIG IS LAW, Paolo 7/26/26): Measures near-vs-far limb garment coverage through the real render path. Reads
  the rig; changes nothing.
    built on: posedSkel, SKINNERS, SKINNER_API
    joints: none named
    parts: none
*/
const fs = require('fs'), path = require('path'), os = require('os');
function loadPlaywright() {
  const tries = ['playwright', '/opt/node22/lib/node_modules/playwright',
                 path.join(os.homedir(), '.npm-global/lib/node_modules/playwright')];
  for (const t of tries) { try { return require(t); } catch (e) { } }
  return null;
}
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(ROOT, 'records', 'BOHEMIA_BACK_LIMB_COLOR_AUDIT_7_26_26.txt');
const DIRS8 = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];

(async () => {
  const pw = loadPlaywright();
  if (!pw) { console.error('AUDIT: playwright not resolvable.'); process.exit(2); }
  const browser = await pw.chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
  const errs = []; page.on('pageerror', e => errs.push(String(e.message || e)));
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForFunction(() => typeof buildFrame === 'function', null, { timeout: 180000 });

  const data = await page.evaluate(({ DIRS8 }) => {
    const CW = 56, CH = 56, NPH = 24;
    const clips = (Array.isArray(CLIPS) ? CLIPS : Object.keys(CLIPS)).slice(0, 20);
    const kc = c => c[0] + ',' + c[1] + ',' + c[2];
    const out = { farDarkActive: null, res: {} };
    /* is the far-arm darkening genuinely retired? state it, do not assume it */
    try { out.farDarkActive = !SKINNER_API.RIGFAITH.on; } catch (e) { out.farDarkActive = 'unknown'; }

    for (const d of DIRS8) {
      const near = DEPTH[d] ? DEPTH[d].nearSide : 'R';
      /* PAIRS of the same limb: [nearPart, farPart] */
      const pairs = near === 'R'
        ? [[6, 5, 'upper arm'], [8, 7, 'hand'], [10, 9, 'thigh'], [12, 11, 'foot']]
        : [[5, 6, 'upper arm'], [7, 8, 'hand'], [9, 10, 'thigh'], [11, 12, 'foot']];
      const acc = pairs.map(p => ({ limb: p[2], nearCols: {}, farCols: {} }));
      let lone = 0, garmentPx = 0;

      for (const clip of clips) for (let k = 0; k < NPH; k++) {
        const ph = (k + 0.5) / NPH;
        let f = null, grid = null;
        try {
          f = buildFrameCached(d, clip, ph);
          const h = poseHoldAt(d, clip, ph);
          grid = SKINNERS[d].skin(h ? h.sk : posedSkel(d, clip, ph).sk);
        } catch (e) { }
        if (!f || !f.px || !grid) continue;
        const px = f.px;
        for (let pi = 0; pi < pairs.length; pi++) {
          const [np, fp] = pairs[pi];
          for (let i = 0; i < px.length; i++) {
            const c = px[i]; if (!c) continue;
            const pid = grid[i];
            if (pid === np) acc[pi].nearCols[kc(c)] = (acc[pi].nearCols[kc(c)] || 0) + 1;
            else if (pid === fp) acc[pi].farCols[kc(c)] = (acc[pi].farCols[kc(c)] || 0) + 1;
          }
        }
        /* LONE PIXELS: a body/garment pixel matching none of its 4 neighbours */
        for (let i = 0; i < px.length; i++) {
          const c = px[i]; if (!c || !grid[i]) continue;
          garmentPx++;
          const x = i % CW, y = (i / CW) | 0;
          const nb = [];
          if (x + 1 < CW) nb.push(px[i + 1]); if (x > 0) nb.push(px[i - 1]);
          if (y + 1 < CH) nb.push(px[i + CW]); if (y > 0) nb.push(px[i - CW]);
          let same = 0;
          for (const n of nb) if (n && n[0] === c[0] && n[1] === c[1] && n[2] === c[2]) same++;
          if (!same) lone++;
        }
      }
      const limbs = acc.map(a => {
        const nearOnly = [], farOnly = [];
        for (const c in a.farCols) if (!a.nearCols[c]) farOnly.push([c, a.farCols[c]]);
        for (const c in a.nearCols) if (!a.farCols[c]) nearOnly.push([c, a.nearCols[c]]);
        farOnly.sort((x, y) => y[1] - x[1]); nearOnly.sort((x, y) => y[1] - x[1]);
        const farTot = Object.values(a.farCols).reduce((s, v) => s + v, 0);
        const farExc = farOnly.reduce((s, v) => s + v[1], 0);
        return { limb: a.limb, farPx: farTot, farExclusivePx: farExc,
                 pctFarExclusive: farTot ? +(farExc / farTot * 100).toFixed(1) : 0,
                 farOnlyTop: farOnly.slice(0, 4), nearOnlyTop: nearOnly.slice(0, 3) };
      });
      out.res[d] = { limbs, lonePixels: lone, bodyPx: garmentPx,
                     pctLone: garmentPx ? +(lone / garmentPx * 100).toFixed(2) : 0 };
    }
    return out;
  }, { DIRS8 });

  await browser.close();

  const L = [];
  L.push('BOHEMIA — THE BACK LIMB COLOR AUDIT (7/26/26)');
  L.push('measured in a real browser on slices/BOHEMIA_ALPHA_0_9.html');
  L.push('');
  L.push('Paolo: "why can\'t the back arm and the back leg have the proper clothing... I');
  L.push('don\'t want it to be a different shade off the bat, and if you make it a different');
  L.push('shade that\'s a whole different layering process that isn\'t color-coded on the');
  L.push('clothing pixel wise."');
  L.push('');
  L.push('THE TEST: a garment is ONE garment, so the back limb should show the same colours');
  L.push('as the front limb. Colours EXCLUSIVE to the far side mean something is shading it');
  L.push('separately, baked into the clothing pixels where he says it must never be.');
  L.push('');
  L.push('(A first version of this audit tested palette membership instead. That was wrong:');
  L.push('garments store ramp INDICES that get tinted, so legal tinting invents RGB by');
  L.push('design and the test claimed 67% of the character was invented. Discarded.)');
  L.push('');
  L.push('far-arm darkening currently active: ' + data.farDarkActive);
  L.push('');
  for (const d of DIRS8) {
    const r = data.res[d];
    L.push(`--- ${d} ---   lone pixels: ${r.lonePixels} of ${r.bodyPx} (${r.pctLone}%)`);
    for (const lb of r.limbs) {
      L.push(`  ${lb.limb.padEnd(10)} far px ${String(lb.farPx).padStart(7)}   EXCLUSIVE to far ${String(lb.farExclusivePx).padStart(7)}  (${lb.pctFarExclusive}%)`);
      if (lb.farOnlyTop.length) L.push('     far-only colours : ' + lb.farOnlyTop.map(([c, n]) => `${c} x${n}`).join('   '));
    }
    L.push('');
  }
  L.push(errs.length ? 'PAGE ERRORS:\n  ' + errs.slice(0, 6).join('\n  ') : 'page errors: none');
  L.push('');
  L.push('regenerate: node tools/bohemia_invented_color_audit.js');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
})();
