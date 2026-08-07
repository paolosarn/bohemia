/* ============================================================================
   BOHEMIA CANON MEASURE (8/7/26, LAB lane)

   MEASURES THE CANON CONSTANTS OUT OF THE RUNNING WORLD instead of out of prose.

   WHY THIS EXISTS. gates/canon_constants_gate.js (mine, 8/5) proves every declared
   constant is REALLY IN the law that cites it. That is worth having and it is only
   half the job, because a law and a codebase can agree on paper and disagree in
   fact. Its check E1 was supposed to close that half -- "no shipped engine module
   declares a constant that disagrees with the registry" -- and on 8/7 I measured
   what E1 actually compares:

       13 OF THE 14 CONSTANTS HAD ZERO ENGINE DECLARATIONS FOR IT TO COMPARE.
       It swept 112 modules and found TWO numbers, both of them BPM.

   E1 matches a variable whose NAME equals the registry key. The engine does not
   name things that way: the valley's size is OVER_N x TILE_FINE x CELL_M, not
   VALLEY_KM2, and the three currencies are an ARRAY whose LENGTH is three, not a
   number 3. So for everything that mattered E1 could not fail. A CHECK THAT
   CANNOT FAIL IS WORSE THAN NO CHECK, because it reports safety.

   AND THE DRIFT WAS REAL AND SITTING THERE. First run of this tool, against the
   canon seed: BUILT_KM2 measured 38.35 where the registry declared 37.0, and
   ONFOOT_KM2 measured 76.09 where it declared 75.7. Not a bug -- the map has been
   GROWING since the 8/3 measurement (a dozen districts landed since) and nothing
   re-measured. Exactly the silent drift the gate was built to prevent, living
   inside the gate that was built to prevent it.

   THE FIX IS THE PATTERN THAT ALREADY WORKS IN THIS REPO. Not a smarter name
   match -- a GENERATOR plus "regenerating changes nothing", the same shape
   gates/run_gate.js uses on the run slice. The measured rows are generated from
   the live engine; the gate regenerates and fails if the registry moved. The rows
   cannot drift by construction, because nobody types them.

   TWO CONSTANTS ARE NOT MEASURABLE AND THEY SAY SO OUT LOUD. An honest EXEMPT
   list with a written reason per row, asserted to be exactly that set, so a future
   constant cannot join it silently. That is the anti-vacuity rule: every constant
   is MEASURED or EXEMPT-WITH-A-REASON, never quietly unchecked.

   NO NEW CANON. Measures what is already there and invents nothing. Every
   classification set below is documented because a measurement whose definition
   is hidden is just another unverifiable number.
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');

/* THE CANON SEED. 7 is the seed every other scale gate measures on
   (gates/people_gate.js partG uses SM.measure(7)), so this tool uses the same one
   and a drift between tools shows up as a drift, not as two seeds. */
const CANON_SEED = 7;

/* ---------------------------------------------------------------------------
   THE CLASSIFICATION, WRITTEN DOWN. These three sets are the definitions behind
   BUILT / ONFOOT, taken from the breakdown in
   records/BOHEMIA_MAP_SIZE_VS_THE_REFERENCES_8_3_26.md:
       84.9 total = 37.0 BUILT + 32.9 roads + 5.7 desert + 9.3 rock/water
       75.7 walkable = total - rock/water
   So BUILT is "everything that is not road, not bare desert, and not rock or
   water", and ONFOOT is "everything you can put a foot on", i.e. total minus rock
   and water. Both definitions are the record's, not new ones.
   --------------------------------------------------------------------------- */
const ROAD_TYPES = ['freeway', 'arterial', 'beltway', 'strip', 'interchange'];
const ROCKWATER_TYPES = ['mountain', 'water'];
const BARE_TYPES = ['desert'];

function measure(seed) {
  const s = (seed === undefined) ? CANON_SEED : seed;
  const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
  const ENG = require(path.join(ROOT, 'engine/bohemia_engine.js'));

  const om = OM.buildOvermap(s);
  const census = OM.census(om);

  const cellKm2 = (OM.TILE_M * OM.TILE_M) / 1e6;
  let cells = 0, road = 0, rock = 0, bare = 0;
  for (const [type, n] of Object.entries(census)) {
    cells += n;
    if (ROAD_TYPES.indexOf(type) >= 0) road += n;
    else if (ROCKWATER_TYPES.indexOf(type) >= 0) rock += n;
    else if (BARE_TYPES.indexOf(type) >= 0) bare += n;
  }
  const built = cells - road - rock - bare;

  /* CURRENCIES is an ARRAY inside bohemia_engine.js and is not exported, so it is
     read STRUCTURALLY off the shipped source: the array literal's element count,
     not a grep for a number. This is the one row measured from code text rather
     than from a live object, and it says so in its `how`. */
  const engSrc = fs.readFileSync(path.join(ROOT, 'engine/bohemia_engine.js'), 'utf8');
  const cm = engSrc.match(/const\s+CURRENCIES\s*=\s*\[([^\]]*)\]/);
  const currencyNames = cm
    ? cm[1].split(',').map(t => t.trim()).filter(Boolean)
        .map(t => (t.match(/CURRENCY\.([A-Z_]+)/) || [, t])[1])
    : [];

  const round = (v, dp) => Number(v.toFixed(dp));

  return {
    seed: s,
    census: census,
    cellKm2: cellKm2,
    currencyNames: currencyNames,
    parts: { cells: cells, road: road, rock: rock, bare: bare, built: built },
    /* key -> [value, how it was measured] */
    values: {
      CELLS_PER_SIDE:      [OM.OVER_N,                     'engine/bohemia_overmap.js OVER_N, live'],
      TILES_PER_CELL_SIDE: [OM.TILE_FINE,                  'engine/bohemia_overmap.js TILE_FINE, live'],
      FINE_TILES_PER_SIDE: [OM.OVER_N * OM.TILE_FINE,      'OVER_N x TILE_FINE, derived from live'],
      METRES_PER_TILE:     [OM.CELL_M,                     'engine/bohemia_overmap.js CELL_M, live'],
      VALLEY_KM2:          [round(cells * cellKm2, 2),     'buildOvermap(' + s + ') census: all ' + cells + ' cells x ' + cellKm2 + ' km2'],
      BUILT_KM2:           [round(built * cellKm2, 2),     'census minus road/desert/rock: ' + built + ' cells'],
      ONFOOT_KM2:          [round((cells - rock) * cellKm2, 2), 'census minus rock/water: ' + (cells - rock) + ' cells'],
      STEPS_ACROSS_VALLEY: [OM.OVER_N * OM.TILE_FINE,      'one step per fine tile, so === FINE_TILES_PER_SIDE'],
      BEAT_SECONDS:        [ENG.Heartbeat.MS_PER_BEAT / 1000, 'engine Heartbeat.MS_PER_BEAT / 1000, live'],
      BPM:                 [ENG.Heartbeat.BPM,             'engine Heartbeat.BPM, live'],
      CURRENCIES:          [currencyNames.length,          'bohemia_engine.js CURRENCIES array length (structural, not live)'],
      GENERATIONS:         [ENG.Generations.GEN_COUNT,     'engine Generations.GEN_COUNT, live']
    }
  };
}

/* ---------------------------------------------------------------------------
   NOT MEASURABLE, AND EACH ONE SAYS WHY. The gate asserts this list is EXACTLY
   the set of unmeasured constants, so nothing can join it without a reason being
   written here first.
   --------------------------------------------------------------------------- */
const EXEMPT = {
  /* THIS ROW'S REASON FAILED MY OWN NEW W3 CHECK. It described the law in words
     ("the mobile-camp law") and cited no artifact, so a gate built to demand real
     citations could not verify the excuse for the one row it excuses. Fixed by
     citing the file, which is what the registry demands of every other row --
     fix the target, not the ruler. */
  SECONDS_PER_STEP:
    'a DESIGN number in laws/BOHEMIA_ADDENDUM_THE_MOBILE_CAMP_7_27_26.md (average seconds ' +
    'one step costs in-game). No engine module carries it: the action clock in ' +
    'bohemia_engine.js spends time per ACTION, not per step, so there is nothing running ' +
    'to measure. Becomes measurable the day a per-step cost lands in code, and must be ' +
    'measured then. [PENDING Paolo owns the number itself.]',
  LIT_PERCENT:
    'CLUSTERED POWER says 12% of the valley is lit and OWNED. Nothing in the world model ' +
    'exposes a lit-cell set yet -- neither bohemia_overmap.js nor bohemia_world.js exports ' +
    'any power/lit/grid accessor (checked 8/7), so the share cannot be counted off a real ' +
    'world. Whoever builds the power grid must add the accessor and move this row into ' +
    'MEASURED, and this gate will then hold the 12% to the map.'
};

/* The exact markdown block the registry must carry. Generated, never typed. */
function render(m) {
  const keys = Object.keys(m.values);
  const w = Math.max.apply(null, keys.map(k => k.length));
  const lines = keys.map(k => {
    const [v, how] = m.values[k];
    return k.padEnd(w) + ' | ' + String(v).padEnd(8) + ' | ' + how;
  });
  return '```measured\n' +
    '# GENERATED by tools/bohemia_canon_measure.js -- DO NOT HAND-EDIT.\n' +
    '# Measured off the running engine at canon seed ' + m.seed + '.\n' +
    '# canon_constants_gate.js regenerates this and fails if it moved, so these\n' +
    '# rows cannot drift from the world the way the hand-typed ones did.\n' +
    lines.join('\n') + '\n```';
}

module.exports = { measure, render, EXEMPT, CANON_SEED, ROAD_TYPES, ROCKWATER_TYPES, BARE_TYPES };

if (require.main === module) {
  const m = measure();
  console.log(render(m));
  console.log('\ncensus parts: ' + JSON.stringify(m.parts));
  console.log('currencies in code: ' + m.currencyNames.join(', '));
}
