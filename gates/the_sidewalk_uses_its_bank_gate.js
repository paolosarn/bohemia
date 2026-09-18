/* ============================================================================
   THE SIDEWALK USES ITS BANK (9/18/26, LIFE + CITY lane)
   VAMILY row [side variants] THE-SIDEWALK-DRAWS-THREE-OF-ITS-THIRTY-SIX-TILES.
   COOK [streets fixed] (fe5ba8d0) found the repeat he can see.
   Paolo 7/14, desert_dominance_law: "too much diversity with the desert tiles."

   THE ROW NAMED ONE COLLAPSE. MEASURED, THERE WERE TWO STACKED ON ONE LINE, AND THE
   SECOND ONE IS THE BIGGER.

   1. THE MODULUS. The approved sidewalk bank holds 36 tiles; the suburb asked for
      `_sw % 3`. Measured over 6,968 sidewalk cells around the door, with saTex itself
      as the oracle (it caches one canvas per resolved tile, so identical objects mean
      identical pictures): THREE tiles on the ground. 33 of a judged bank had never
      been drawn since the day it was approved.

   2. THE GRAIN, AND THE COMMENT ABOVE THE LINE ALREADY SAID THE RIGHT WORD. It reads
      "PER PLOT, NEVER PER CELL", which is his 7/14 ruling. The code seeded on
      `tx>>2, ty>>2`, and tx/ty are OVERMAP cells -- a 4x4 group of them is 384 metres
      of street on one tile. That is not a plot, it is a whole neighbourhood, and it is
      why the same pavement runs to the horizon.

   THE FIX IS A REMOVAL AND A REGRAIN, NOT A WIDER NUMBER. saTex already maps any
   integer across the whole pool AND carries his weather-rarity rule while doing it
   (88% of picks stay in the parent half, 12% reach the weathered tail). Pre-modding to
   3 is what threw that away, so the modulus is GONE and the raw per-lot hash goes in.
   The seed is now BOH_LATTICE.LOT_FINE, the one number this lane put in one place
   under his 9/15 step-is-a-house ruling: 24 fine cells, 18 m, the stride the house
   generator packs on. One tile per lot is what a poured walk actually is.

   MEASURED, SAME INSTRUMENT BOTH SIDES:
                              before      after
       tiles on the ground     3 of 36    36 of 36
       patches                     102         181
       median patch size       36 cells    16 cells

   LEG B3 IS THE ONE THAT PROTECTS HIS RULING. A per-cell shuffle would send the median
   patch to about 1 and turn a run of pavement into a checkerboard, which is the exact
   complaint the 7/14 law came from. This gate fails that as hard as it fails the
   repeat, so nobody can "fix" this row by breaking the other half of it.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const TILES_FLOOR = 24;        /* of a 36 pool, measured 36; a big sample must reach most of it */
const PATCH_FLOOR = 6;         /* fine cells: below this a walk reads as a checkerboard */
const PATCH_CEIL = 400;        /* and above this it reads as one slab to the horizon */

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('THE SIDEWALK USES ITS BANK — 36 tiles were judged, 3 were being drawn');
console.log('='.repeat(74));

/* ---- A. THE SOURCE ------------------------------------------------------ */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const sites = (CITY.match(/c\.gArtPool='side';\s*c\.gArtVariant=/g) || []).length;
ok('A1 both sidewalk sites are still here (' + sites + ')', sites === 2);
ok('A2 neither of them mods the variant down any more',
   !/c\.gArtPool='side';\s*c\.gArtVariant=_sw\s*%/.test(CITY));
ok('A3 the seed is the lot, read from the one number and not typed',
   (CITY.match(/const _lotf=BOH_LATTICE\.LOT_FINE;/g) || []).length === 2);
ok('A4 and the lot is not written as a literal beside it',
   !/_lotf\s*=\s*24/.test(CITY));

/* ---- B. DRIVEN, ON THE DEMO -------------------------------------------- */
(async () => {
  let d = null;
  try {
    const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    d = await D.open();
    const m = await d.fr.evaluate(() => {
      const P = window.__proof;
      if (!P) return { err: 'the walked city exposes no __proof' };
      const p = P.getPos();
      let poolHolds = null;
      try { poolHolds = SA_TILES.side.length; } catch (e) { return { err: 'no SA_TILES.side' }; }
      const R = 160, grid = {}, key = (x, y) => x + ',' + y;
      const tiles = new Set();
      let cells = 0;
      for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) {
        const c = P.cellAt(p.hx + i, p.hy + j);
        if (!c || c.gArtPool !== 'side') continue;
        cells++;
        const v = c.gArtVariant >>> 0;
        grid[key(p.hx + i, p.hy + j)] = v;
        /* THE TILE, NOT THE HASH. saTex caches one canvas per resolved index, so this
           uses the drawing function itself as the oracle rather than re-deriving its
           rule here, which would be a second opinion about the thing being measured. */
        try { const t = saTex('side', v); if (t) tiles.add(t); } catch (e) {}
      }
      /* how big is a run of one tile: the grain his ruling is about */
      const done = {}, runs = [];
      for (const k in grid) {
        if (done[k]) continue;
        const v = grid[k], q = [k]; done[k] = 1; let n = 0;
        while (q.length) {
          const cur = q.pop(); n++;
          const [x, y] = cur.split(',').map(Number);
          for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nk = key(x + dx, y + dy);
            if (grid[nk] === v && !done[nk]) { done[nk] = 1; q.push(nk); }
          }
        }
        runs.push(n);
      }
      runs.sort((a, b) => b - a);
      return { poolHolds, cells, tiles: tiles.size, patches: runs.length,
        biggest: runs[0] || 0, median: runs.length ? runs[Math.floor(runs.length / 2)] : 0 };
    });

    if (m.err) ok('B0 ' + m.err, false);
    else {
      console.log('  MEASURED ON THE DEMO, DRIVEN LIKE A PLAYER, AROUND THE DOOR:');
      console.log('    the approved bank holds   : ' + m.poolHolds + ' sidewalk tiles');
      console.log('    sidewalk cells sampled    : ' + m.cells);
      console.log('    DISTINCT TILES DRAWN      : ' + m.tiles);
      console.log('    patches of one tile       : ' + m.patches);
      console.log('    median patch / biggest    : ' + m.median + ' / ' + m.biggest + ' cells');
      ok('B1 there is sidewalk on the ground to judge (' + m.cells + ' cells)', m.cells > 500);
      ok('B2 *** the ground draws most of the bank, not three of it *** ('
         + m.tiles + ' of ' + m.poolHolds + ')', m.tiles >= Math.min(TILES_FLOOR, m.poolHolds));
      ok('B3 *** and it is NOT a per-cell checkerboard *** (median patch ' + m.median
         + ' >= ' + PATCH_FLOOR + ', Paolo 7/14)', m.median >= PATCH_FLOOR);
      ok('B4 and not one slab to the horizon either (median ' + m.median + ' <= '
         + PATCH_CEIL + ')', m.median <= PATCH_CEIL);
      ok('B5 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);
    }
  } catch (e) {
    ok('B harness ran: ' + e.message, false);
  }
  if (d) await d.close();
  console.log('='.repeat(74));
  console.log('  THE SIDEWALK USES ITS BANK: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
