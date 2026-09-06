/* DO THE HAIRCUTS READ FROM ALL EIGHT FACINGS?  (COOK, VAMILY [runway hair], 9/6/26)
 *
 * THE CARD NAMES THIS RULE AND NAMES IT AFTER HAIR. records/BOHEMIA_STYLE_CARD_9_5_26.md
 * section 3: "45 DEGREE ART LAW: every garment reads on the three-quarter corpus from all
 * eight facings; a pole judged only from the front is not judged (THE HAIRCUT LESSON,
 * 8/28)." So "every haircut to the card" is, first, this.
 *
 * AND IT IS HIS OWN 8/20 COMPLAINT, WHICH HAS NEVER BEEN A NUMBER:
 *     "east and west hairstyles look like absolute dog shit across the board"
 * He killed 13 of 15 in one sitting saying it. The verdict record calls that ONE RENDER
 * DEFECT JUDGED THIRTEEN TIMES and routes it to CHARACTER as P0, and it has sat there
 * since. Nobody has measured it, so nobody can tell when it is fixed.
 *
 * WHAT THIS MEASURES, AND WHY THIS RULER AND NOT ANOTHER.
 * A haircut's job is to tell one person from another. So the question is not "is the
 * profile pretty", which is taste and not mine, but: FROM THIS ANGLE, CAN YOU TELL THE
 * ELEVEN CUTS APART? That is answerable in pixels and it is what "reads" means.
 *
 *   1. DOES IT DRAW AT ALL       hair pixels per cut per facing.
 *   2. IS IT DISTINCT            for every PAIR of cuts, on one facing, the share of
 *                                pixels where exactly one of the two has hair
 *                                (symmetric difference over union -- 0 means identical
 *                                silhouettes, 1 means no overlap). Averaged over the 55
 *                                pairs, that is how legible the whole set is from that
 *                                angle. Compared FACING TO FACING, the low ones are the
 *                                angles where everybody looks the same.
 *   3. THE WORST PAIR            the two cuts you cannot tell apart from that angle.
 *
 * IT COMPARES SILHOUETTES, NEVER COLOUR (a mask, not pixels), because two cuts in the
 * same ramp must still be two cuts -- STRUCTURE-NOT-COLOR, and colour comes off the
 * person anyway.
 *
 *   node tools/bohemia_hair_eight_facings_9_6_26.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ALPHA = path.join(path.dirname(__dirname), 'slices/BOHEMIA_ALPHA_0_9.html');
const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 600, height: 400 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.GARMENTS,
    { timeout: 40000 });

  const R = await p.evaluate((DIRS) => {
    const CUTS = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    const out = { cuts: CUTS.map(c => c.n), facings: [] };
    for (const d of DIRS) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      const masks = [], sizes = [];
      for (const h of CUTS) {
        let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
        const set = new Set();
        if (o) for (const k in o) set.add(+k);
        masks.push(set); sizes.push(set.size);
      }
      const pairs = [];
      for (let i = 0; i < masks.length; i++) for (let j = i + 1; j < masks.length; j++) {
        let inter = 0;
        const a = masks[i], c = masks[j];
        const small = a.size < c.size ? a : c, big = a.size < c.size ? c : a;
        for (const k of small) if (big.has(k)) inter++;
        const uni = a.size + c.size - inter;
        /* TWO NUMBERS ON PURPOSE, BECAUSE ONE OF THEM DRIFTS WITH SIZE (9/6).
           `d` is symmetric difference over UNION -- the honest "how different are these
           two shapes" number, but two big masses overlap more than two small ones just
           by being big, and from behind every cut is twice the pixels it is from the
           front. So `s` divides the same difference by the SMALLER mask instead: a small
           distinctive feature on a big fall still scores. If the two disagree the ruler
           is measuring size, and the pair table below is how you tell. */
        const small_n = Math.min(a.size, c.size) || 1;
        pairs.push({ a: i, b: j, d: uni ? (uni - inter) / uni : 0,
                     s: (a.size + c.size - 2 * inter) / small_n });
      }
      pairs.sort((x, y) => x.d - y.d);
      const mean = pairs.reduce((s, x) => s + x.d, 0) / pairs.length;
      const smean = pairs.reduce((s2, x) => s2 + x.s, 0) / pairs.length;
      out.facings.push({ dir: d, sizes, mean, smean,
        table: pairs.slice().sort((x, y) => x.d - y.d)
          .map(x => ({ n: CUTS[x.a].n + ' / ' + CUTS[x.b].n, d: x.d, s: x.s })),
        worst: pairs.slice(0, 3).map(x => ({ n: CUTS[x.a].n + ' / ' + CUTS[x.b].n, d: x.d })),
        twins: pairs.filter(x => x.d < 0.25).length });
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return out;
  }, DIRS);

  await b.close();
  if (errs.length) console.log('page errors: ' + errs.slice(0, 3).join(' | '));

  console.log('\nDO THE ' + R.cuts.length + ' CANON HAIRCUTS READ FROM ALL EIGHT FACINGS?');
  console.log('(silhouette only, no colour. 1.00 = no overlap at all, 0.00 = identical)\n');
  console.log('  facing   legibility   pairs under 0.25   smallest cut   the pair you cannot tell apart');
  for (const f of R.facings) {
    const mn = Math.min.apply(null, f.sizes);
    console.log('  ' + f.dir.padEnd(8) +
      f.mean.toFixed(3).padStart(8) + ' /' + f.smean.toFixed(2).padStart(5) + '  ' +
      String(f.twins).padStart(8) + ' of 55   ' +
      String(mn).padStart(8) + ' px   ' +
      f.worst[0].n + '  ' + f.worst[0].d.toFixed(3));
  }
  const byMean = R.facings.slice().sort((a, c) => a.mean - c.mean);
  console.log('\n  WORST ANGLE: ' + byMean[0].dir + ' at ' + byMean[0].mean.toFixed(3) +
    '   BEST ANGLE: ' + byMean[byMean.length - 1].dir + ' at ' +
    byMean[byMean.length - 1].mean.toFixed(3));
  const prof = R.facings.filter(f => f.dir === 'E' || f.dir === 'W');
  const open = R.facings.filter(f => f.dir !== 'E' && f.dir !== 'W');
  const pm = prof.reduce((s, f) => s + f.mean, 0) / prof.length;
  const om = open.reduce((s, f) => s + f.mean, 0) / open.length;
  console.log('  EAST AND WEST ' + pm.toFixed(3) + '   THE OTHER SIX ' + om.toFixed(3) +
    '   the profiles are ' + (100 * (1 - pm / om)).toFixed(0) + '% less legible');
  const worstF = byMean[0];
  console.log('\n  EVERY PAIR FROM ' + worstF.dir + ', the worst angle (union number / smaller-mask number):');
  worstF.table.forEach(t => console.log('    ' + t.n.padEnd(34) +
    t.d.toFixed(3).padStart(7) + '  ' + t.s.toFixed(2).padStart(6)));
  const sFace = R.facings.find(f => f.dir === 'S');
  console.log('\n  THE SAME PAIRS FROM S, the best angle, for comparison:');
  sFace.table.slice(0, 12).forEach(t => console.log('    ' + t.n.padEnd(34) +
    t.d.toFixed(3).padStart(7) + '  ' + t.s.toFixed(2).padStart(6)));
  console.log('\n  per cut, hair pixels by facing:');
  console.log('    ' + 'cut'.padEnd(16) + DIRS.map(d => d.padStart(6)).join(''));
  R.cuts.forEach((n, i) => console.log('    ' + n.padEnd(16) +
    R.facings.map(f => String(f.sizes[i]).padStart(6)).join('')));
})();
