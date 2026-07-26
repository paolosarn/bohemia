// BOHEMIA — BACK LIMB GATE (7/26/26). FACTORY LAW: new law, new gate, same turn.
//
// Paolo: "I'm so confused as to why the back arm and the back leg, in whatever
// direction I'm facing, it just can't have the proper clothing... I don't want it
// to be a different shade off the bat, and if you make it a different shade
// that's a whole different layering process that isn't color-coded on the
// clothing pixel wise."
//
// WHAT IT ACTUALLY WAS, and it was not shading: on E and W the two arms SHARE
// most of their painted rest pixels (49 of 83 on E), and a shared rest pixel can
// only bind to ONE bone. It bound to the NEAR arm, so the sleeve rode the near arm
// and the far arm arrived BARE SKIN -- 11.0% dressed on E, 6.8% on W, against
// ~65% everywhere else. It read as "a different shade" because it was skin.
//
// THE FIX: the far arm gets its OWN deform pass, binding the garment pixels
// already on its own footprint to its own bones. Same colours, no darkening.
//
// THE THREE THINGS THIS GATE REFUSES TO LET REGRESS, all of them mistakes I made
// on the way to the fix:
//   1. inventing fill colour (a row-dominant guess painted skin tones onto limbs)
//   2. letting the pass win cells by rank, which UNDRESSED the near limb
//   3. running it on the legs, which never had the defect and got worse
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_BACK_LIMB_CLOTHING_7_26_26.md');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== BACK LIMB GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(LAW));
ok('the patch tool is checked in', fs.existsSync(path.join(ROOT, 'tools', 'bohemia_dress_the_back_limb_patch.py')));
ok('the audit tool is checked in', fs.existsSync(path.join(ROOT, 'tools', 'bohemia_invented_color_audit.js')));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');

ok('the far limb gets its own pass', /function dressBackLimb\(restCol,d,slot\)/.test(src));
ok('it is actually called from the garment composite', /const _fs=dressBackLimb\(restCol,d,slot\)/.test(src));
ok('it binds to the FAR limb rather than the near one', /out\.grid\[i\]=fp/.test(src));

/* 1. NO INVENTED COLOUR. Only a garment colour already on that cell passes through. */
ok('no invented fill: only the garment colour already on the cell is passed through',
  /const src=restCol\[i\]; if\(!src\)continue;/.test(src) && /NO INVENTED FILL/.test(src));
ok('the discarded row-dominant fallback is gone', !/rowCol\[y\]/.test(src));

/* 2. IT MUST NEVER UNDRESS THE NEAR LIMB. */
ok('the pass only paints the FAR limb\'s own cells', /if\(!_fs\.farParts\[grid\[i\]\]\)continue;/.test(src));
ok('the reason is recorded at the code (near thigh fell 88.8% -> 78.9% without it)',
  /must never undress the front one/.test(src));

/* 3. ARMS ONLY. */
ok('it runs on arms and hands only, not the legs',
  /const pairs = near==='R' \? \[\[6,5\],\[8,7\]\] : \[\[5,6\],\[7,8\]\]/.test(src));
ok('the reason the legs are excluded is recorded (they never had the defect)',
  /ARMS AND HANDS ONLY/.test(src) && /leave what is not/.test(src));

/* NO SHADING. This is the part he was most explicit about. */
ok('the far limb gets the SAME colour, with no darkening applied',
  /SAME colour, no shade/.test(src));
ok('the far-arm darkening stays retired', /const farArmParts=\(!SKINNER_API\.RIGFAITH\.on/.test(src));

/* the record */
ok('the law records the measured coverage gap that proves it was not shading',
  /11\.0%/.test(law) && /6\.8%/.test(law));
ok('the law records the real mechanism (shared rest pixels bind once)',
  /SHARE 49 of them/.test(law) && /bind to ONE bone/i.test(law));
ok('the law records the three wrong turns so they are not repeated',
  /WRONG TURNS/.test(law));
ok('the law records that the first audit was wrong and why',
  /67%/.test(law));

done();
