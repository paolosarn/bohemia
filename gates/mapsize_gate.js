#!/usr/bin/env node
/* ============================================================================
   MAP SIZE GATE — Paolo 8/2/26.

     "Before you cut anything, let me ask you: in terms of walking how big is
      our map size compared to Skyrim or Fallout Vegas?"

   He asked the question with "before you cut anything" in front of it, so the
   answer needs a FLOOR, not just a paragraph. valley_scale_gate already pins the
   per-cell scale (0.75 m a fine cell, 128 fine cells a district, derived never
   typed) and a loose "over 5 miles across". Nothing pinned the two numbers he
   actually asked about: HOW MUCH LAND, and HOW MUCH OF IT IS BUILT.

   So a lane could leave the cell scale untouched, turn built districts back into
   desert, and every gate would stay green while the world quietly emptied out.
   That is the cut this gate exists to make impossible without a ruling.

   MEASURED ON THE CANON SEED (hashSeed('bohemia') = 2691674296), 8/2/26:

       96 x 96 cells, 96 m a cell        9.22 km a side, 13.03 km corner to corner
       TOTAL                             84.9 km2      151 million walkable cells
       built districts                   37.0 km2      43.6%
       roads / rail                      32.9 km2      38.8%
       open desert                        5.7 km2       6.7%
       mountain + water                   9.3 km2      10.9%
       ON FOOT                           75.7 km2      89.1%

   AND THE COMPARISON HE ASKED FOR, sourced rather than remembered:
       Skyrim               ~37 km2   playable
       Fallout: New Vegas   ~16.5 km2 playable (6.4 sq mi)
   So the BUILT HALF OF THIS VALLEY ALONE is about the whole of Skyrim, and the
   land you can put a foot on is a bit over four and a half New Vegases.

   WALKING, which is the unit he asked in. Read out of the running city frame,
   not assumed: BEAT = 500 ms and one cell a beat, so a walk is 1.5 m/s (a real
   human pace, 0.75 m a cell twice a second) and holding a direction two beats
   breaks into a run at two cells a beat, 3.0 m/s.
       walk one side       1 h 42 m          run one side        51 m
       walk corner to corner  2 h 25 m       run corner to corner 1 h 13 m

   THE HONEST CAVEAT, recorded here so nobody quotes the flattering half: those
   37 km2 are GENERATED, and Skyrim's 37 km2 are hand-placed. Size was never this
   project's problem. This gate holds the floor; the WALKABLE-LAND LAW holds the
   filling.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

const SEED = 2691674296 >>> 0;               // hashSeed('bohemia'), the ONE MAP
const KM2_PER_CELL = (OM.TILE_M * OM.TILE_M) / 1e6;

/* ---- the shape of the land ----------------------------------------------- */
ok('the valley is 96 x 96 districts (' + OM.OVER_N + ') — changing this is a RULING, not a refactor',
  OM.OVER_N === 96);
const sideM = OM.OVER_N * OM.TILE_M;
ok('which is 9.22 km on a side (' + (sideM / 1000).toFixed(2) + ' km)', Math.abs(sideM - 9216) < 1);
const totalKm2 = OM.OVER_N * OM.OVER_N * KM2_PER_CELL;
ok('and 84.9 km2 of land (' + totalKm2.toFixed(1) + ')', Math.abs(totalKm2 - 84.9) < 0.2);

/* ---- what is ON it, measured, not declared -------------------------------
   Classified from the real census of the real overmap. The floors sit a little
   under the 8/2 measurement so ordinary procedural drift between seeds and
   district-mix changes does not cry wolf; a real hollowing-out clears them by a
   mile. */
const census = OM.census(OM.buildOvermap(SEED));
const IMPASSABLE = /^(mountain|reservoir|lake|water)$/;
const CONNECTIVE = /^(freeway|arterial|strip|beltway|interchange|rail|road)$/;
const BLANK = /^(desert)$/;

let built = 0, connective = 0, blank = 0, impassable = 0;
for (const [kind, n] of Object.entries(census)) {
  if (IMPASSABLE.test(kind)) impassable += n;
  else if (CONNECTIVE.test(kind)) connective += n;
  else if (BLANK.test(kind)) blank += n;
  else built += n;
}
const km2 = c => c * KM2_PER_CELL;
const cells = built + connective + blank + impassable;

ok('every one of the ' + (OM.OVER_N * OM.OVER_N) + ' cells is classified (' + cells + ')',
  cells === OM.OVER_N * OM.OVER_N);
ok('BUILT DISTRICTS DO NOT FALL BELOW 35 km2 — about the whole of Skyrim ('
  + km2(built).toFixed(1) + ' km2, ' + (built / cells * 100).toFixed(1) + '%)', km2(built) >= 35.0);
ok('THE LAND YOU CAN PUT A FOOT ON DOES NOT FALL BELOW 73 km2 ('
  + km2(built + connective + blank).toFixed(1) + ' km2)', km2(built + connective + blank) >= 73.0);
ok('and the valley is not mostly rock and water (' + km2(impassable).toFixed(1) + ' km2)',
  km2(impassable) / km2(cells) < 0.25);
ok('the district mix stays varied: 60+ types placed (' + Object.keys(census).length + ')',
  Object.keys(census).length >= 60);

/* ---- walking, because that is the unit he asked in ------------------------
   READ OUT OF THE SHIPPED CITY FRAME. A crossing time derived from a constant
   somebody typed in a comment is a guess; this is the blob he walks. */
const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
const b64 = /CITY_B64\s*=\s*'([^']+)'/.exec(alpha);
ok('the walked world is in the alpha', !!b64);
const frame = b64 ? Buffer.from(b64[1], 'base64').toString('utf8') : '';
ok('the beat is 500 ms (the 120 BPM law), so a step is a step',
  /const BEAT=500;/.test(frame));
ok('a walk is ONE cell a beat and a run is TWO — the crossing times below are real',
  /if\(running&&moved\)stepOnce\(di\);/.test(frame));

const WALK_MS = 1.5, RUN_MS = 3.0;           // 0.75 m a cell, 2 and 4 cells a second
const hhmm = s => Math.floor(s / 3600) + ' h ' + String(Math.round(s % 3600 / 60)).padStart(2, '0') + ' m';
const diagM = sideM * Math.SQRT2;
ok('walking one side takes over an hour and a half (' + hhmm(sideM / WALK_MS) + ')',
  sideM / WALK_MS > 5400);
ok('walking corner to corner takes over two hours (' + hhmm(diagM / WALK_MS) + ')',
  diagM / WALK_MS > 7200);

console.log('');
console.log('  MAP SIZE, on the canon seed:');
console.log('    ' + OM.OVER_N + ' x ' + OM.OVER_N + ' districts · ' + (sideM / 1000).toFixed(2)
  + ' km a side · ' + totalKm2.toFixed(1) + ' km2 · '
  + ((OM.OVER_N * OM.TILE_FINE) ** 2 / 1e6).toFixed(0) + ' million walkable cells');
console.log('    built ' + km2(built).toFixed(1) + '  roads ' + km2(connective).toFixed(1)
  + '  desert ' + km2(blank).toFixed(1) + '  rock/water ' + km2(impassable).toFixed(1)
  + '   ON FOOT ' + km2(built + connective + blank).toFixed(1) + ' km2');
console.log('    vs Skyrim ~37 km2 · vs Fallout New Vegas ~16.5 km2');
console.log('    walk a side ' + hhmm(sideM / WALK_MS) + ' · run a side ' + hhmm(sideM / RUN_MS)
  + ' · walk corner to corner ' + hhmm(diagM / WALK_MS));
console.log('\n=== MAP SIZE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
if (fail) process.exit(1);
