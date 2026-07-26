// BOHEMIA — FROZEN POSES GATE (Paolo 7/26/26, LOCKED). FACTORY LAW: new law, new
// gate, same turn.
//
// "Show me a couple animations where there's just zero morphing. I'm tired of it."
//
// THE LAW: a clip is a small set of FROZEN POSES, and every frame of a hold is the
// SAME FRAME -- one cache entry -- not a fresh recomputation that ought to match.
// Zero morphing during a hold is therefore structural: there is nothing to differ
// because nothing is recomputed.
//
// THE THREE PIECES THAT MUST ALL SURVIVE, because any one of them alone is
// worthless:
//   1. hysteresis on joint POSITION, resolved across the whole clip
//   2. the tolerance SOLVED FOR per clip to hit a pose COUNT (a fixed tolerance
//      was measured and it left run on 20 poses and idle on 1)
//   3. the frame cache keyed on the POSE SIGNATURE, not the phase index -- this is
//      the piece that turns "identical-looking" into "identical"
//
// Deleting piece 3 would look like a harmless cache tweak and would quietly turn
// the guarantee back into a hope.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_FROZEN_POSES_7_26_26.md');
const PROOF = path.join(ROOT, 'records', 'BOHEMIA_ZERO_MORPH_PROOF_7_26_26.txt');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== FROZEN POSES GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(LAW));
ok('the patch tool is checked in', fs.existsSync(path.join(ROOT, 'tools', 'bohemia_pose_hold_patch.py')));
ok('the proof tool is checked in (a claim he cannot re-run is not a claim)',
  fs.existsSync(path.join(ROOT, 'tools', 'bohemia_zero_morph_proof.js')));
ok('the measured proof is committed', fs.existsSync(PROOF));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');
const proof = fs.readFileSync(PROOF, 'utf8');

/* ---- piece 1: KEY THE EXTREMES ------------------------------------------- */
/* The original mechanism here was "hold the joint unless it moved more than X".
   Paolo killed it on sight: "the arms aren't moving for a lot of the animations."
   Measured, walk lost 100% of its hand travel, because a stay-put rule LAGS and
   the swing reverses before the last step fires. The rule is now the animator's
   rule and the gate guards THAT. */
ok('the frozen-pose path is on', /const POSEHOLD=\{on:true,/.test(src));
ok('the lagging stay-put position rule is GONE (it killed the arm swing)',
  !/Math\.abs\(v\[0\]-h\[0\]\)>px/.test(src));
ok('every phase where a hand REVERSES DIRECTION is a key, so the extremes are drawn',
  /if\(v1\[0\]\*v2\[0\]\+v1\[1\]\*v2\[1\] < 0\) isKey\[q\]=1;/.test(src) &&
  /for\(const hj of \['handL','handR'\]\)/.test(src));
ok('keys are filled in by EQUAL ARC LENGTH along the pose trajectory',
  /const want=Math\.max\(2,POSEHOLD\.keys\), gap=total\/want/.test(src));
ok('every frame snaps to its NEAREST key, never the previous one (nearest cannot lag)',
  /every phase snaps to its NEAREST key/.test(src) &&
  /const dd=Math\.min\(\(q-k\+B\)%B,\(k-q\+B\)%B\)/.test(src));
ok('the drawn pose is still snapped to WHOLE pixels', /const x=Math\.round\(v\[0\]\), y=Math\.round\(v\[1\]\)/.test(src));

/* ---- piece 2: a key count in pixel-art range ----------------------------- */
ok('the key count is a real number in pixel-art range (a cycle is 8-12 drawn frames)',
  (() => { const m = /keys:(\d+)\}/.exec(src); return m && +m[1] >= 6 && +m[1] <= 16; })());
ok('the reason the stay-put rule was killed is recorded at the code, not just in the law',
  /the arms aren't moving for a lot of the/.test(src) && /29\.8 -> 0\.0/.test(src));

/* ---- piece 3: the cache keys on the POSE, which is what makes it exact --- */
ok('the frame cache keys on the resolved pose signature, not the phase index',
  /const k=d\+'\|'\+clip\+'\|'\+\(_ph\?_ph\.sig:q\)\+'\|'\+frameLookHash\(d\)/.test(src));
ok('every pose carries a signature to key on', /sig:parts\.join\('\|'\)/.test(src));
ok('buildFrame draws the frozen pose', /const _hp=poseHoldAt\(d,clip,ph\)/.test(src));

/* ---- plumbing ------------------------------------------------------------ */
ok('a rig edit or body-slider move re-resolves the frozen poses',
  /try\{POSEHOLD_CACHE\.clear\(\);\}catch\(e\)\{\}/.test(src));
ok('the superseded arm-angle hold is switched OFF (it was the same lagging rule)',
  /const ARMHOLD=\{on:false,/.test(src));

/* ---- the measured claim, ratcheted -------------------------------------- */
{
  const rows = [...proof.matchAll(/->\s*(\d+)\s+\d+\s*$/gm)].map(m => +m[1]);
  ok('the proof reports per-clip morph figures', rows.length >= 4);
  ok('EVERY clip in the proof reports ZERO morph pixels during holds' +
    (rows.some(n => n !== 0) ? ' [' + rows.join(',') + ']' : ''), rows.length >= 4 && rows.every(n => n === 0));
  ok('the proof defines morph fairly (a pose change is animation, and is excluded)',
    /POSE DID NOT CHANGE/.test(proof) && /excluded/.test(proof));
  ok('the proof sheets he can actually look at are committed',
    fs.existsSync(path.join(ROOT, 'records', 'zeromorph')) &&
    fs.readdirSync(path.join(ROOT, 'records', 'zeromorph')).filter(x => x.endsWith('.png')).length >= 4);
}

/* ---- AMPLITUDE IS A GUARANTEE NOW, not an afterthought ------------------- */
/* Zero morph with dead arms is a worse build than morph with live arms. He proved
   that by looking at it. So the swing is gated alongside the morph, and the two
   are measured in the same report. */
ok('the law records the amplitude collapse that got the first version rejected',
  /-100%/.test(law) && /the hands do not move/.test(law));
ok('the law records the amplitude RESTORED by keying the extremes',
  /89%/.test(law) || /handTravelKept/.test(law));
ok('the law names the rule that caused it, so nobody writes a stay-put hold again',
  /STAY PUT UNLESS/.test(law) && /LAGS/.test(law));

/* ---- the record stays honest -------------------------------------------- */
ok('the law records that fourteen earlier attempts failed and why (they kept recomputing)',
  /fourteen/i.test(law) && /RECOMPUTED/.test(law));
ok('the law records that the clothing needed no work, which is what he asked about',
  /CAME ALONG FOR FREE/.test(law) && /identical dressed and naked/.test(law));
ok('the law leaves the one thing a number cannot answer to Paolo (clean vs chopped)',
  /reads as clean animation or as chop/.test(law));
ok('the law states plainly that this does NOT fix the body sliders',
  /WHAT THIS DOES NOT FIX/.test(law) && /Holding a bad shape still/.test(law));

done();
