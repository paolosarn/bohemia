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
/* ASK FOR THE PROPERTY, NEVER FOR THE SPELLING (8/11, second time in one day).
   This spelled out `BOH_BODYVAR.apply(BAKED,G.bodyVar);` and went red the moment
   the AGE AXIS composed under it. The PROPERTY is ordering: the clothes refit has
   to run in the same breath as the body package being rebuilt, whatever is
   wrapped around the baked package or the dials. So: the BODY_PKG assignment,
   then buildClothesFit, with nothing but whitespace between them. */
ok('the map is rebuilt whenever the body package is rebuilt',
  /BODY_PKG\s*=\s*BOH_BODYVAR\.apply\([\s\S]{0,200}?\);\s*try\{buildClothesFit\(\);\}/.test(src));
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


/* ---- SHOULDERS + ARM LENGTH (Paolo 7/29/26): the two dials that make a female
   read out of ONE rig. No female rig, ever -- that arc is graveyarded. ------- */
const SALAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_SHOULDERS_AND_ARM_LENGTH_7_29_26.md');
ok('the shoulders/arm-length law is recorded', fs.existsSync(SALAW));
ok('both dials are registered', /'shoulders', 'armLength'/.test(BV));
ok('the amplitudes are GROUNDED in real anthropometry, not picked',
  /biacromial-to-biiliac/.test(BV) && /1\.4 in men and 1\.2 in women/.test(BV) &&
  /arm span tracks height/i.test(BV) && /1\.00 and 1\.05/.test(BV));
ok('shoulders is +-20% and arm length is the narrow +-12%',
  /shoulders: 0\.20/.test(BV) && /armLength: 0\.12/.test(BV));
ok('the TORSO answers to more than one dial, summed as width and never multiplied',
  /\{ dial: 'shoulders'/.test(BV) && /summed as fractional width, never multiplied/.test(BV));
ok('the shoulder profile stops before the pelvis, which hips now owns',
  /hips own the bottom, not this dial/.test(BV));
ok('ARM LENGTH is a BONE dial scaled from the shoulder, so the arm cannot tear off',
  /function warpArmLength/.test(BV) && /that is where an arm hangs from/.test(BV));
ok('THE ARMS RIDE THE SHOULDER, not just the belly',
  /if \(\(v\.belly \|\| v\.shoulders \|\| v\.hips\) && src\[4\]\)/.test(BV));
ok('the dead-in-one-direction measurement is recorded at the code',
  /18px at every setting from -1 to 0/.test(BV));
ok('the 1px void fix lives in the OUTLINE, where the bug actually was',
  /CLOSE 1PX VOIDS/.test(src) && /if\(px\[i\+1\]&&px\[i-1\]&&px\[i\+CW\]&&px\[i-CW\]\)/.test(src));
ok('the void fix cannot eat armpits or crotch gaps',
  /a cell with even one empty\s*\n?\s*neighbour is left alone|one empty neighbour is left alone/.test(src));
ok('the law pins the measured numbers', /\*\*16 \/ 18 \/ 20\*\*/.test(fs.readFileSync(SALAW,'utf8')) &&
  /14\.08 \/ 16\.00 \/ 17\.92 px/.test(fs.readFileSync(SALAW,'utf8')));
ok('the law states NO FEMALE RIG, ever',
  /\*\*No female rig\. Ever\.\*\*/.test(fs.readFileSync(SALAW,'utf8')));
/* HE RULED ON IT THE SAME DAY, so the gate now pins the RULING instead of the
   open question: "nah when i put fat its like your fat fuck that woman belly
   shit... more unisex vibes". Fat is fat. */
ok('his FAT IS FAT ruling is recorded, and the research it overrules is named',
  /\*\*FAT IS FAT\.\*\*/.test(fs.readFileSync(SALAW,'utf8')) &&
  /deliberately \*\*overruled\*\*/.test(fs.readFileSync(SALAW,'utf8')));
ok('how a woman reads is recorded in HIS words, and needs no new mechanism',
  /slightly skinnier arms, shorter/.test(fs.readFileSync(SALAW,'utf8')));


/* ---- HIPS + LIMB THICKNESS TIED (Paolo 7/29/26: "we can add hip width and arm
   width can be tied to leg width too") ------------------------------------- */
ok('hips is registered and the torso takes THREE dials via a list',
  /DIAL_NAMES = \['height', 'belly', 'arms', 'shoulders', 'armLength', 'hips'\]/.test(BV) &&
  /also: \[\s*\n\s*\{ dial: 'shoulders'/.test(BV) && /\{ dial: 'hips'/.test(BV));
ok('shoulders own the top, hips own the pelvis -- they do not overlap',
  /hips own the bottom, not this dial/.test(BV) && /shoulders own the top/.test(BV));
ok('LIMB THICKNESS IS ONE DIAL: the arms dial drives the thighs',
  /9:  \{ dial: 'arms'/.test(BV) && /10: \{ dial: 'arms'/.test(BV) && /function legProfile/.test(BV));
ok('the leg is gentler than the arm, and the reason is recorded',
  /profile caps at 0\.55/.test(BV) && /would be a cartoon/.test(BV));
ok('the thigh floor is 4, not 5 -- a 5px floor killed the whole narrow half',
  /9:  \{ dial: 'arms', biasAmp: 0, minW: 4/.test(BV) && /thigh 5\/5\/5\/5\/7/.test(BV));
/* THE TRAP THAT ATE AN ENTIRE DIAL: a width dial absent from warpLayers' early-out
   is silently dead no matter what PART_SPEC says. hips measured 11px at every
   setting until it was named there too. */
ok('every width dial is named in the warpLayers early-out',
  /if \(!v\.belly && !v\.arms && !v\.shoulders && !v\.hips\) return layers;/.test(BV));
ok('the silently-dead-dial trap is recorded at the code',
  /silently dead, which is exactly how it/.test(BV));

done();
