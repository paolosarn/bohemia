/* BOHEMIA 2X -- THE BODY ITSELF, NOT ITS SHADOW (Paolo 8/14)
 *
 * *** WHY THIS FILE EXISTS: THE PREVIOUS RULER WAS MEASURING HIS COAT. ***
 * bohemia_2x_geometry.js tried to isolate the body by excluding pure black from the
 * rendered PNG. But PUNK WEARS A BLACK COAT -- rgb in the low 20s -- so "everything
 * that is not black" excluded most of his torso and legs, and the box it reported
 * was skin and highlights, not the body. It then flagged a 2px "body moved" on S
 * that is a coat highlight, and reported the left edge shedding -1px on E, which is
 * not a thing a thinner border can do. A ruler that cannot tell the outline from a
 * black garment is the broken instrument, and the answer is to fix the ruler, never
 * to argue with the target.
 *
 * THE HONEST MEASUREMENT is the part-id GRID, and the renderer hands it over
 * directly. CHAR_OUTLINE says so in its own comment: "The body GRID is untouched --
 * colour only -- so occupancy, hit-testing and every measurement tool still see the
 * true silhouette." So the grid is the body with no border, no clothing, no
 * ambiguity: per part id, exactly where that part is.
 *
 * Run it at both resolutions and compare the 56 box DOUBLED against the 112 box. If
 * the migration is honest they are the same rectangle, per part, per facing -- and
 * if a limb is bound to a joint at half its true position, that limb's box is the
 * thing that screams.
 *
 * RIG CHECK (RIG IS LAW, Paolo 7/26/26): READS the rig, writes nothing. It asks the
 *   skinner for the posed part-id grid and measures where each part landed. It never
 *   edits BAKED, a joint, a bone or a pixel of his art -- the entire job is to report
 *   whether a doubled rig puts his body in the same place the 56 rig did.
 *   built on: BAKED, posedSkel, SKINNERS
 *   joints: none named
 *     (the pose is taken whole from posedSkel; no joint is touched by name)
 *   parts: none named -- every part id present in the grid is measured generically
 *
 *   node tools/bohemia_2x_gridbox.js <out.json>
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = process.argv[2];

const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
const CLIPS = ['idle', 'walk'];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);

  const R = await page.evaluate(({ DIRS, CLIPS }) => {
    const out = { rigW: BAKED.W, rs: (typeof RIG_RS !== 'undefined' ? RIG_RS : 1), boxes: {}, err: null };
    try {
      for (const d of DIRS) for (const c of CLIPS) for (const ph of [0, 0.5]) {
        /* the SKINNED grid for this exact pose -- the same call buildFrame makes */
        const _ps = posedSkel(d, c, ph);
        const P = _ps.sk;
        SKINNERS[d].orderOverride = null;
        const g = SKINNERS[d].skin(P);
        const W = BAKED.W;
        const per = {};
        for (let i = 0; i < g.length; i++) {
          const p = g[i]; if (!p) continue;
          const x = i % W, y = (i / W) | 0;
          const b = per[p] || (per[p] = [1e9, 1e9, -1, -1, 0]);
          if (x < b[0]) b[0] = x; if (y < b[1]) b[1] = y;
          if (x > b[2]) b[2] = x; if (y > b[3]) b[3] = y;
          b[4]++;
        }
        out.boxes[d + '|' + c + '|' + ph] = per;
      }
    } catch (e) { out.err = e.message + ' @ ' + (e.stack || '').split('\n')[1]; }
    return out;
  }, { DIRS, CLIPS });

  if (R.err) { console.log('  THREW: ' + R.err); await browser.close(); process.exit(1); }
  if (errs.length) console.log('  PAGE ERRORS: ' + errs.slice(0, 3).join(' | '));
  console.log('2X GRIDBOX: rig ' + R.rigW + ', RIG_RS ' + R.rs + ', ' +
              Object.keys(R.boxes).length + ' posed grids, ' +
              Object.keys(R.boxes).reduce((a, k) => a + Object.keys(R.boxes[k]).length, 0) + ' part boxes');
  if (OUT) { fs.writeFileSync(OUT, JSON.stringify(R)); console.log('  -> ' + OUT); }
  await browser.close();
})();
