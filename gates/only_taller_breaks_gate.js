// BOHEMIA — ONLY TALLER BREAKS GATE (7/26/26). FACTORY LAW: new finding, new gate.
//
// Paolo has twice said the body sliders look bad. Measured, it is ONE HALF OF ONE
// DIAL: height+1 invents 962 pixels against a canon baseline of 133, while
// height-1, belly and arms all sit inside the baseline.
//
// WHY: belly and arms TRANSLATE rest pixels along whole rows, which is lossless.
// Height changes BONE LENGTH and seg()'s WIDTH LAW scales along the bone, so a
// taller body is his art STRETCHED and the resampler must fill rows nobody
// painted. Shorter is nearly free because compressing only drops pixels.
//
// THIS GATE RATCHETS THE CLEAN DIALS. The danger is not the known bad one -- it is
// that a future change quietly makes belly or arms start inventing too, and nobody
// notices because "the sliders were always bad."
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_ONLY_TALLER_BREAKS_7_26_26.md');
const BV = path.join(ROOT, 'engine', 'bohemia_bodyvar.js');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== ONLY TALLER BREAKS GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the finding is recorded', fs.existsSync(LAW));
ok('the body variation engine exists', fs.existsSync(BV));
if (f) done();
const law = fs.readFileSync(LAW, 'utf8'), bv = fs.readFileSync(BV, 'utf8');

/* the mechanism that makes belly and arms SAFE must not be lost */
ok('belly and arms still TRANSLATE by whole rows (integer dx), which is why they are lossless',
  /dx = Math\.round\(dx \|\| 0\)/.test(bv));
ok('the translation still moves the whole part, with no bridge/fill machinery',
  /NO BRIDGE/.test(bv));

/* the record */
ok('the law carries the per-dial measurement', /height \+1\s+962/.test(law) && /CANON\s+133/.test(law));
ok('the law records that belly and arms are INSIDE the baseline',
  /belly\s+\+1\s+161/.test(law) && /arms\s+\+1\s+174/.test(law));
ok('the law explains WHY only growth invents', /Only growth invents/.test(law));
ok('the law names the root cause shared with the animation work',
  /cannot resample pixel art without damaging it/.test(law));
ok('the law leaves the decision to Paolo and lists the real options',
  /SWAP, DO NOT STRETCH/.test(law) && /ROW REPEAT/.test(law) && /CAP THE DIAL AT ZERO/.test(law));
ok('the law states plainly that nothing was changed', /NOT DONE, deliberately/.test(law));

done();
