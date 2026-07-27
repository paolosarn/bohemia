// BOHEMIA — NECK TONE + CURTAIN BOB GATE (7/27/26). FACTORY LAW: new law, new gate.
//
// Paolo 7/27, two asks in one message:
//   "i wanted the neck color to be just a slightly very slightly barely notieable
//    different skin tone than the face."
//   "heres the code for the updated curtain bob hair please apply"
//
// THE ONE WAY THE NECK TONE SILENTLY GOES WRONG: the pass runs AFTER garments
// composite. A neck cell can be wearing a collar -- the body grid still says
// "neck" while the pixel is cloth -- so an unguarded multiply darkens his hoodie.
// It did: 25.1 -> 23.1 dressed, before the skin-only guard went in. That is the
// kind of change nobody sees and nobody reverts, so it is pinned here.
//
// AND THE HAIR: a repaint must never become a retint. His export carries the ramp
// alongside the pixels; if a future export's ramp drifts, the applier must refuse
// rather than quietly recolour his hair as a side effect of a shape update.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const NECKTOOL = path.join(ROOT, 'tools', 'bohemia_neck_tone_patch.py');
const HAIRTOOL = path.join(ROOT, 'tools', 'bohemia_apply_curtain_bob_7_27.py');
const EXPORT = path.join(ROOT, 'records', 'rig', 'CURTAIN_BOB_7_27_26.json');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== NECK TONE + CURTAIN BOB GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the alpha exists', fs.existsSync(ALPHA));
ok('the neck tone tool is kept', fs.existsSync(NECKTOOL));
ok('the curtain bob applier is kept', fs.existsSync(HAIRTOOL));
ok('his rig export is kept verbatim in records/', fs.existsSync(EXPORT));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const nt = fs.readFileSync(NECKTOOL, 'utf8');
const ht = fs.readFileSync(HAIRTOOL, 'utf8');

/* ---- the neck tone ------------------------------------------------------ */
ok('NECK_TONE is declared exactly once', (src.match(/const NECK_TONE/g) || []).length === 1);
ok('it is on, targets part 3, and the amount is a single tunable flag',
  /const NECK_TONE = \{ on: true, part: 3, mul: [0-9.]+ \};/.test(src));

const iClose = src.indexOf('return { Skinner, REFINE_STATS,');
const iFlag = src.indexOf('const NECK_TONE');
const iFn = src.indexOf('function buildFrame(d,clip,ph){');
ok('the scope anchors are found', iClose > 0 && iFlag > 0 && iFn > 0);
ok('NECK_TONE is declared OUTSIDE the skinner closure and BEFORE buildFrame',
  iFlag > iClose && iFlag < iFn);

/* Capture the block INCLUDING its header comment -- the law it states about
   itself (tone not shadow, reuse-first, the rejected ramp snap) lives there, and
   a gate that only reads the executable lines cannot see a doc rot. */
const m = src.match(/  \/\* =+\n     THE NECK IS ITS OWN SKIN TONE[\s\S]*?if\(NECK_TONE\.on\)\{[\s\S]*?\n  \}/);
ok('the neck tone pass is present', !!m);
if (!m) done();
const pass = m[0];

/* THE GUARD. This is the whole gate. */
ok('SKIN ONLY: the pass checks each pixel against the live skin ramp before touching it',
  /skinRampFor\(\)/.test(pass) && /if\(!_sk\[/.test(pass));
ok('it only touches the neck part', /if\(grid\[i\]!==npart\)continue;/.test(pass));
ok('the collar regression is recorded at the code, with its number',
  /25\.1 -> 23\.1 dressed/.test(pass));
ok('it never writes the occupancy grid', !/grid\[i\]=/.test(pass));

/* IT IS A TONE, NOT A SHADOW -- SHADOWS ARE SEPARATE (7/26) must not be eroded. */
ok('the code states plainly that this is a TONE and not a shadow',
  /A TONE, NOT A SHADOW/.test(pass));
ok('the reason it is not a shadow is on the record: fixed per facing, fixed per frame',
  /not vary per facing/.test(pass) && /identical on every frame of every clip/.test(pass));
ok('REUSE-FIRST: no new hue -- it scales HIS tone rather than inventing one',
  /no new hue is cooked/.test(pass) && /scaled/.test(pass));
ok('the ramp-stop snap is recorded as REJECTED, with the reason',
  /44 units apart/.test(pass) && /hard band/.test(pass));
ok('the stale "runs before garments" claim is gone from the code',
  !/Runs before garments composite/.test(pass));
ok('the tool no longer claims it runs before garments either',
  !/BEFORE garments composite, so a collar/.test(nt));
ok('the tool records the honest headline: the collar hides the neck on this outfit',
  /INVISIBLE on the dressed character/.test(nt));

/* ---- the hair ----------------------------------------------------------- */
ok('the applier refuses to retint his hair as a side effect of a shape update',
  /refusing to retint/.test(ht) && /new\['ramps'\] != old_ramp/.test(ht));
ok('the applier refuses a layer-box change (the rig grid is fixed)',
  /the rig grid is fixed/.test(ht));
ok('the applier refuses unknown directions instead of inventing a pipeline change',
  /directions the build does not author/.test(ht));
ok('REUSE CHECK is documented (it cooks no art)', /REUSE CHECK/.test(ht));
ok('RIG LAW is stated: his pixels are copied verbatim, never reshaped',
  /VERBATIM/.test(ht) && /does not reshape/.test(ht));

const exp = JSON.parse(fs.readFileSync(EXPORT, 'utf8'));
ok('the export is the curtain bob', exp.garment === 'hair/curtain-bob');
const iPD = src.indexOf('const PD_DATA = ');
const pd = JSON.parse(src.slice(iPD + 'const PD_DATA = '.length, src.indexOf('\n', iPD)).trim().replace(/;$/, ''));
const live = pd.layers['hair/curtain-bob'];
ok('the curtain bob is in the build', !!live);
ok('HIS PIXELS ARE WHAT SHIPS: every authored direction matches his export byte for byte',
  !!live && Object.keys(exp.layers).every(d => JSON.stringify(live[d]) === JSON.stringify(exp.layers[d])));
ok('the ramp is still his', JSON.stringify(pd.ramps['hair/curtain-bob']) === JSON.stringify(exp.ramps));
ok('W/NW/SW are still mirrored, not authored',
  !!live && !['W', 'NW', 'SW'].some(d => live[d]));

done();
