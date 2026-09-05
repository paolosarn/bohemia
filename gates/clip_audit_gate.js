/* BOHEMIA -- CLIP AUDIT GATE (ANIMATION lane, 9/5/26)
 *
 * Pins what the 9/5 clip audit established, so it cannot rot back.
 * Record: records/BOHEMIA_THE_63_CLIP_AUDIT_9_5_26.md
 *
 * WHY IT IS NOT A SECOND clip_health_gate. That gate asks whether a clip THROWS,
 * has gone STILL, or renders EMPTY, and loop_seam_gate asks whether it SNAPS at the
 * wrap. Both are green on all 105 clips and he is still calling the set fucked. So
 * our animation gates could say CRASHES or MOVES and had no word for MOVES WRONG.
 * This gate is that vocabulary:
 *
 *   - THE SET DOES NOT SHRINK. 105 clips reach the engine (64 canon + 41
 *     candidates). A clip that quietly stops being registered is invisible to every
 *     other check, because a check that iterates CLIPS cannot miss what left CLIPS.
 *   - NO TWO CLIPS ARE THE SAME MOTION. Two names and one cycle is the ONE ID ONE
 *     WHOLE PERSON mistake with a different noun, and with 105 hand-authored pose
 *     functions a copy-paste makes one silently.
 *   - HEAD-ON DOES NOT GET QUIETER. The audit measured the median clip's head-on
 *     view carrying 41% of its profile view's motion. That number is the open
 *     question this lane owes him; the gate holds the floor so a future edit cannot
 *     make it worse while nobody is looking.
 *
 * AND IT SAYS THE OWED THING OUT LOUD. Day 20's finding was that our gates print a
 * debt inside a green pass and it reads as fine. The head-on gap and `jump` are
 * PENDING HIS VERDICT, so they cannot be failures -- but they are printed as an
 * AWAITING HIS VERDICT block, not buried in a summary line.
 *
 * Samples at FRAME_CACHE.buckets, the renderer's own frame count, on S/N/E/W --
 * both head-on views and both profiles, which is what the head-on question needs.
 * A coarser sweep invents regressions (clip_health_gate learned that twice).
 */
const path = require('path');
const { settle: SETTLE } = require(path.join(__dirname, 'bohemia_settle.js'));
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');

const CLIP_FLOOR = 105;      /* measured 9/5. may grow, must never shrink */
const HEADON_FLOOR = 0.36;   /* measured median 0.41; floor allows normal drift, not decay */

let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); }
  if (f) { console.log(`\n=== CLIP AUDIT GATE: ${p} passed, ${f} failed ===`); process.exit(1); }

  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2400);
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  if (errs.length) { await b.close(); console.log(`\n=== CLIP AUDIT GATE: ${p} passed, ${f} failed ===`); process.exit(1); }

  const R = await pg.evaluate(() => {
    const D = ['S', 'N', 'E', 'W'];
    const N = (typeof FRAME_CACHE !== 'undefined' && FRAME_CACHE.buckets) || 24;
    const threw = [], sigs = {}, peak = {};
    for (const c of CLIPS) {
      peak[c] = {};
      for (const d of D) {
        const grids = [];
        let bad = false;
        for (let k = 0; k < N; k++) {
          try { grids.push(buildFrame(d, c, k / N).grid); }
          catch (e) { threw.push(c + '@' + d); bad = true; break; }
        }
        if (bad) continue;
        let ink = 0;
        for (let i = 0; i < grids[0].length; i++) if (grids[0][i]) ink++;
        let mx = 0;
        for (let k = 0; k < grids.length; k++) {
          const A = grids[k], B = grids[(k + 1) % grids.length];
          let ch = 0;
          for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) ch++;
          if (ch > mx) mx = ch;
        }
        peak[c][d] = ink ? mx / ink : 0;
        if (d === 'S') {
          let chain = '';
          for (const g of grids) {
            let s = 2166136261 >>> 0;
            for (let i = 0; i < g.length; i++) if (g[i]) { s ^= (i * 31 + g[i]); s = Math.imul(s, 16777619) >>> 0; }
            chain += s.toString(36) + '.';
          }
          sigs[c] = chain;
        }
      }
    }
    const twins = [], keys = Object.keys(sigs);
    for (let i = 0; i < keys.length; i++)
      for (let j = i + 1; j < keys.length; j++)
        if (sigs[keys[i]] === sigs[keys[j]]) twins.push(keys[i] + ' == ' + keys[j]);
    return { n: CLIPS.length, buckets: N, threw, twins, peak };
  });

  await b.close();

  ok(`the whole clip set still reaches the engine (${R.n} clips, floor ${CLIP_FLOOR})`, R.n >= CLIP_FLOOR);
  ok('no frame throws' + (R.threw.length ? ' -- ' + R.threw.slice(0, 4).join(', ') : ''), R.threw.length === 0);
  ok('no two clips render the same motion' + (R.twins.length ? ' -- ' + R.twins.slice(0, 3).join('; ') : ''), R.twins.length === 0);

  const ratios = [];
  for (const c in R.peak) {
    const q = R.peak[c];
    const h = Math.max(q.S || 0, q.N || 0), pr = Math.max(q.E || 0, q.W || 0);
    if (pr > 0) ratios.push({ c, r: h / pr });
  }
  ratios.sort((a, b2) => a.r - b2.r);
  const med = ratios.length ? ratios[ratios.length >> 1].r : 0;
  ok(`head-on still carries at least ${(HEADON_FLOOR*100)|0}% of profile, median (measured ${(med*100).toFixed(0)}%)`,
     med >= HEADON_FLOOR);

  console.log('');
  console.log('  AWAITING HIS VERDICT -- measured, not failing, because the call is his:');
  console.log(`    head-on carries a median ${(med*100).toFixed(0)}% of profile motion; ` +
              `${ratios.filter(x=>x.r<0.35).length} of ${ratios.length} clips under 35%.`);
  console.log('    the quietest: ' + ratios.slice(0, 5).map(x => x.c + ' ' + (x.r*100).toFixed(0) + '%').join(', '));
  console.log('    `jump` is carried by the arms, not the legs, and has no crouch before it.');
  console.log('    `whistle` is a static hold, not a cycle.');
  console.log('    Record: records/BOHEMIA_THE_63_CLIP_AUDIT_9_5_26.md');

  console.log(`\n=== CLIP AUDIT GATE: ${p} passed, ${f} failed ===`);
  process.exit(f ? 1 : 0);
})();
