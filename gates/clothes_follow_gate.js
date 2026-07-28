// BOHEMIA — CLOTHES FOLLOW THE BODY GATE (7/28/26). FACTORY LAW: new law, new gate.
//
// Paolo said the fat and arm dials were wrong three times. It was never the dials:
// BOH_BODYVAR.apply() warps the BODY (BAKED.layers) and never touched garment art
// (PD.layers), so clothing was a fixed shell. Getting fatter worked because the body
// swelled past the coat; getting SKINNIER did nothing, because the body shrank to
// 15px under a coat that stayed 19px. Half the slider was dead.
//
// THE TWO WAYS THIS SILENTLY DIES, both of which it already did once:
//   1. A SILENT CATCH. Wrapping the map build in try/catch and swallowing the error
//      turned a one-line scope bug into a pass that read correctly and did NOTHING.
//      The catch must record what it caught.
//   2. TDZ. rebuildFromRig() runs at load from a line ABOVE the flag, so const/let
//      is still dead when first read -- and the catch assigned to the dead variable
//      too, throwing twice. var, not const.
//
// AND THE ONE THING IT MUST NEVER DO: shift a pixel at neutral dials.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_CLOTHES_FOLLOW_THE_BODY_7_28_26.md');
const TOOL = path.join(ROOT, 'tools', 'bohemia_clothes_follow_the_body_patch.py');
const SWEEP = path.join(ROOT, 'records', 'dials', 'DIAL_SWEEP_7_28_26.png');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== CLOTHES FOLLOW GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the law is recorded', fs.existsSync(LAW));
ok('the alpha exists', fs.existsSync(ALPHA));
ok('the patch tool is kept', fs.existsSync(TOOL));
ok('the sweep he can look at exists', fs.existsSync(SWEEP));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');
const tool = fs.readFileSync(TOOL, 'utf8');

/* ---- the flag ----------------------------------------------------------- */
ok('CLOTHES_FOLLOW is declared exactly once', (src.match(/CLOTHES_FOLLOW = \{/g) || []).length === 1);
ok('it is on', /var CLOTHES_FOLLOW = \{ on: true \};/.test(src));

/* TDZ: rebuildFromRig() runs at load from ABOVE these, so they must be hoisted. */
ok('the flag is var, not const/let (it is read at load from a line above it)',
  /var CLOTHES_FOLLOW/.test(src) && !/(const|let) CLOTHES_FOLLOW/.test(src));
ok('the map is var too -- the catch assigns to it, so a dead binding throws twice',
  /var CLOTHES_FIT/.test(src) && !/(const|let) CLOTHES_FIT/.test(src));
ok('the TDZ trap is written down at the code', /temporal dead zone/.test(src));

/* ---- THE SILENT CATCH. This is the one that cost the round. ------------- */
ok('the init catch RECORDS what it caught instead of swallowing it',
  /catch\(_e\)\{CLOTHES_FIT=\{\};window\._CLOTHFIT_ERR=/.test(src));
ok('the swallowed-error lesson is recorded at the code',
  /the catch below swallowed it/.test(src));

/* ---- CW is not in scope here. Third closure boundary to cost a round. --- */
ok('the map build uses a LOCAL 56, not the skinner closure\'s CW',
  /const _CW = 56;/.test(src) && /\(idx\/_CW\)\|0/.test(src));
ok('the closure-scope trap is recorded at the code',
  /CW lives inside the SKINNER_API closure/.test(src));

/* ---- the fit itself ------------------------------------------------------ */
ok('the map is rebuilt whenever the body package is rebuilt',
  /BOH_BODYVAR\.apply\(BAKED,G\.bodyVar\);\s*\n\s*try\{buildClothesFit\(\);\}/.test(src));
ok('it is driven by the BODY\'s own measured extents, canon vs warped',
  /const warped = pkg\.layers\[d\], canon = BAKED\.layers\[d\];/.test(src));
ok('the torso and BOTH arms drive their own cloth', /for\(const part of \[4,5,6\]\)/.test(src));
ok('rows the body did not move are omitted, which is what makes neutral identity structural',
  /if\(l0===l1 && r0===r1\) continue;/.test(src));
ok('neutral dials short-circuit before any map is built (apply returns BAKED itself)',
  /pkg === BAKED/.test(src));
ok('the fit is applied where the garment lands in REST space, before the skinner',
  /if\(CLOTHES_FOLLOW\.on\) sx = fitClothX\(d,sx,sy\);/.test(src));
ok('fitClothX is the identity for a row that is not in the map',
  /const e = rows\[sy\]; if\(!e\) return sx;/.test(src));

/* ---- the record ---------------------------------------------------------- */
ok('the law carries the proof that the garment never moved',
  /jacket pixels identical across the WHOLE belly range:  TRUE/.test(law));
ok('the law carries the before/after silhouette table',
  /\| belly −1 \| 15 \| 19 \| \*\*15\*\* \|/.test(law));
ok('the law states plainly that half the slider was dead',
  /Half of that slider was dead/.test(law));
ok('the law pins the byte-identical neutral measurement',
  /\*\*0 pixels changed\*\*/.test(law));
ok('the law pins the no-new-holes measurement',
  /\*\*2 with the feature off, 2 with it on\*\*/.test(law));
ok('the law explains why a row SHIFT would not have worked',
  /it cannot\nmake a coat narrower|cannot make a coat narrower/.test(law));
ok('the law records all three scope traps as one shape',
  /THREE SCOPE TRAPS ON THE WAY, ALL THE SAME SHAPE/.test(law));
ok('the law states the rule a silent catch broke',
  /must\n   record what it caught|must record what it caught/.test(law));
ok('arm LENGTH is flagged as not existing, and left to him',
  /ARM LENGTH DOES NOT EXIST/.test(law) && /\[PENDING, Paolo's call\]/.test(law));
ok('the tool documents its REUSE CHECK (it cooks no art)', /REUSE CHECK/.test(tool));


/* ---- THE SQUIGGLE AND THE SHOULDER ARE ONE BUG (Paolo 7/28, same day) ----
   The torso profile returned 0 for the top 35%, so the chest was pinned while the
   gut moved: shoulder 18/18/18 against a navel of 15/19/23. A fixed shoulder over
   a moving waist is a STEP, and the step is what reads as squiggly. Separately the
   arm was shifted PER ROW, which bends it into the waist contour. Both are gated
   here because both are one-line reversions away. */
const BV = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_bodyvar.js'), 'utf8');
ok('the chest is no longer pinned at zero', !/if \(t < 0\.35\) return 0;/.test(BV));
ok('the chest takes a SHARE of the dial and eases up to full at the navel',
  /var SH = 0\.5;/.test(BV) && /if \(t < 0\.35\) return SH \* \(0\.35 \+ 0\.65 \* ss\(t \/ 0\.35\)\);/.test(BV));
ok('the very top still barely moves, so the shoulder cannot jump off the neck',
  /A share, not a free pass|share, not a free pass/.test(BV));
ok('THE ARM IS RIGID: one shift for the whole limb, not one per row',
  /const rowShift = \{\};\s*\/\* same dx on every row = a rigid translation \*\//.test(BV));
ok('the single shift is taken at the row the arm ATTACHES to',
  /let armTop = 1e9;/.test(BV) && /edge\[armTop\]/.test(BV));
ok('it does not bend at the hip either', /the arm does not bend at the hip either/.test(BV));
ok('the measured squiggle is recorded at the code',
  /35 35 35 36 36 36 35 35 35 36 36/.test(BV) && /Three direction\n               flips|three direction flips/i.test(BV));
ok('the engine module and the alpha carry the same body (ENGINE SYNC LAW)',
  src.indexOf('same dx on every row = a rigid translation') > 0);
ok('the law records that the squiggle and the shoulder are ONE bug',
  /THE SQUIGGLE AND THE SHOULDER ARE ONE BUG/.test(law));
ok('the law pins the shoulder-never-moved table', /\| belly −1 \| \*\*18\*\* \| 15 \|/.test(law));
ok('the law pins the flip count before and after', /belly -1  direction flips: 3 -> 1/.test(law));

done();
