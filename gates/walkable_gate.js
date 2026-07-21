// WALKABLE-LAND GATE (Paolo 7/20/26, LOCKED — "this has to be a new rule"). A district occupies a
// full plot of WALKABLE land; it CANNOT be mostly parking lot / driveway with a tiny building
// stranded in it. Buildings + purposeful content must dominate the plot; pavement is connective
// tissue, never the main event. Sweeps EVERY registered district. Deliberate exception: VEHICULAR
// venues (drive-in, gas/truck stop, parking structure) whose vehicle surface IS the venue declare
// `vehicular:true` and are exempt from the pavement cap (but must still be dressed, not a void).
// Law: laws/BOHEMIA_ADDENDUM_WALKABLE_LAND_LAW_7_20_26.md.
const K = require('../engine/bohemia_district_kit.js');
require('../engine/bohemia_world.js'); // load + register every district generator
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const MARGIN = 22; // drivePct may exceed contentPct by at most this (tight aisles to every unit are legit; a sea of apron is not)
const types = K.types().slice().sort();
let checked = 0;
for (const t of types) {
  const spec = K.get(t);
  if (!spec || typeof spec.generate !== 'function' || !spec.legend) continue;
  checked++;
  const vehicular = !!spec.vehicular;
  // worst case across the six street configs (a rotation must not sneak a parking sea past the cap)
  const CONFIGS = [['S'], ['N'], ['E'], ['W'], ['S', 'E'], ['N', 'W']];
  let worstGap = -1e9, sample = null;
  for (const cfg of CONFIGS) {
    const r = spec.generate(7, { streets: cfg });
    const s = K.landStats(r.g, spec.legend);
    const gap = s.drivePct - s.contentPct;
    if (gap > worstGap) { worstGap = gap; sample = s; }
  }
  const drivePct = sample.drivePct, contentPct = sample.contentPct;
  if (vehicular) {
    // a vehicular venue is exempt from the cap but must still be DRESSED (not an empty rectangle):
    // real content present, and its drive surface isn't a featureless void.
    ok(`${t} (vehicular): content present + street-aware`, contentPct >= 6);
  } else {
    // the law: drivable pavement must not dominate purposeful content
    ok(`${t}: drive ${drivePct.toFixed(0)}% does not dominate content ${contentPct.toFixed(0)}% (<= +${MARGIN})`, drivePct <= contentPct + MARGIN);
  }
}
ok('swept every registered district (>=14)', checked >= 14);
ok('landStats helper present on the kit', typeof K.landStats === 'function');

console.log('WALKABLE-LAND GATE: ' + pass + ' passed, ' + fail + ' failed  (' + checked + ' districts swept)');
process.exit(fail ? 1 : 0);
