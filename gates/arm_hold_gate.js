// BOHEMIA — ARM HOLD GATE (7/26/26). FACTORY LAW: new law, new gate, same turn.
//
// Paolo: "Do what you have to do next and know what comes after."
//
// WHAT THIS PROTECTS: the arms are drawn at HELD poses resolved across the whole
// clip with hysteresis, instead of being inverse-sampled through continuous
// rotation. In profile an arm is a ~3px strip and a 3px strip cannot be resampled
// continuously without churning its own boundary -- measured own-shape flicker
// arm-R 1.98/frame against torso 0.38 and thighs 0.29 at the same pixel area.
//
// THE PART THAT MUST NOT BE LOST: HYSTERESIS. Five earlier attempts snapped the
// angle WITHOUT memory and every one measured worse, because bucketing with no
// memory oscillates at the bucket edges and each oscillation is a whole-shape
// change. A future edit that keeps the snapping and drops the hysteresis would
// look like a simplification and would silently restore a defect that took
// twelve attempts to find. This gate refuses it.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_ARMS_HOLD_THEIR_POSE_7_26_26.md');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== ARM HOLD GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(LAW));
ok('the patch tool is checked in', fs.existsSync(path.join(ROOT, 'tools', 'bohemia_arm_hold_patch.py')));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');

/* ---- the mechanism ------------------------------------------------------- */
ok('the arm hold is on', /const ARMHOLD=\{on:true,steps:16,hyst:2\.0\}/.test(src));
ok('it covers BOTH arm chains, shoulder through hand',
  /const ARMHOLD_CHAINS=\[\['shL','elL','handL'\],\['shR','elR','handR'\]\]/.test(src));
ok('the resolver exists', /function armHoldSeq\(d,clip\)/.test(src));
ok('buildFrame actually draws the held pose (a resolver nothing calls is decoration)',
  /const P=armHoldApply\(d,clip,ph,_ps\.sk\)/.test(src));

/* THE HYSTERESIS ITSELF -- the whole reason this works where five attempts did not */
ok('the bucket is only left when the angle moves MORE than the hysteresis band',
  /if\(cur===undefined\|\|Math\.abs\(want-cur\)>ARMHOLD\.hyst\)cur=Math\.round\(want\)/.test(src));
ok('the hysteresis band is real (a band of 0 is plain snapping, which measured worse)',
  /hyst:\s*([0-9.]+)/.test(src) && parseFloat(/hyst:\s*([0-9.]+)/.exec(src)[1]) >= 1.4);
ok('the memory persists ACROSS the clip rather than being recomputed per frame',
  /const held=\{\}, seq=new Array\(B\)/.test(src));
ok('the clip is resolved twice so the loop point agrees with itself',
  /for\(let pass=0;pass<2;pass\+\+\)/.test(src));
ok('the held pose is resolved on the SAME phase grid buildFrameCached quantizes to',
  /const B=FRAME_CACHE\.buckets/.test(src));
ok('the root joint is snapped to whole pixels too (a held angle on a sliding root still slides)',
  /let cx=Math\.round\(P\[c\[0\]\]\[0\]\), cy=Math\.round\(P\[c\[0\]\]\[1\]\)/.test(src));

/* ---- correctness plumbing ------------------------------------------------ */
ok('a rig edit or body-slider move re-resolves the held poses',
  /try\{ARMHOLD_CACHE\.clear\(\);\}catch\(e\)\{\}/.test(src));
ok('the cache clear is TDZ-safe (rebuildFromRig runs once before this const initialises)',
  /temporal dead zone/.test(src));

/* ---- ONLY the arms ------------------------------------------------------- */
ok('the legs are NOT held (they already hold still at 0.29-0.31; holding them costs smoothness for nothing)',
  !/'waA','knA','footA'/.test(src.slice(src.indexOf('ARMHOLD_CHAINS'), src.indexOf('ARMHOLD_CHAINS') + 400)));

/* ---- the record ---------------------------------------------------------- */
ok('the law records the composited result, not just the internal one',
  /6,481\s*->\s*3,314/.test(law) && /49% removed/.test(law));
ok('the law records WHY the five snap attempts failed, so nobody re-simplifies it',
  /oscillates/.test(law) && /NO MEMORY/.test(law));
ok('the law records the per-part flicker table that isolated the arms',
  /1\.98/.test(law) && /0\.38/.test(law));
ok('the law states what comes after, in order', /WHAT COMES AFTER/.test(law));
ok('the law is honest that this manages the symptom, not the 3px arm itself',
  /it does not widen the arm/.test(law));

done();
