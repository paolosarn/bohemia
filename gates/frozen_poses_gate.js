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

/* ---- piece 1: hysteresis on position, across the clip -------------------- */
ok('the frozen-pose path is on', /const POSEHOLD=\{on:true,/.test(src));
ok('joints are held with hysteresis on POSITION, and snap to WHOLE pixels when they move',
  /if\(!h\|\|Math\.abs\(v\[0\]-h\[0\]\)>px\|\|Math\.abs\(v\[1\]-h\[1\]\)>px\)\s*\n?\s*h=\[Math\.round\(v\[0\]\),Math\.round\(v\[1\]\)\]/.test(src));
ok('the hold memory carries ACROSS the clip rather than per frame', /const B=FRAME_CACHE\.buckets, held=\{\}, seq=new Array\(B\)/.test(src));
ok('the clip is resolved twice so the loop point agrees with itself',
  /for\(let pass=0;pass<2;pass\+\+\)/.test(src));

/* ---- piece 2: a frame COUNT, not a threshold ----------------------------- */
ok('the tolerance is solved for per clip against a pose-count target',
  /target:\[\d+,\d+\]/.test(src) && /function poseHoldSeq\(d,clip\)/.test(src) && /it<12/.test(src));
ok('the target is a real band in pixel-art range (a walk cycle is 4-8 drawn frames)',
  (() => { const m = /target:\[(\d+),(\d+)\]/.exec(src); return m && +m[1] >= 4 && +m[2] <= 12; })());
ok('the reason a FIXED tolerance was rejected is recorded at the code, not just in the law',
  /left RUN on 20 poses/.test(src) && /collapsed IDLE to 1/.test(src));

/* ---- piece 3: the cache keys on the POSE, which is what makes it exact --- */
ok('the frame cache keys on the resolved pose signature, not the phase index',
  /const k=d\+'\|'\+clip\+'\|'\+\(_ph\?_ph\.sig:q\)\+'\|'\+frameLookHash\(d\)/.test(src));
ok('every pose carries a signature to key on', /sig:parts\.join\('\|'\)/.test(src));
ok('buildFrame draws the frozen pose', /const _hp=poseHoldAt\(d,clip,ph\)/.test(src));

/* ---- plumbing ------------------------------------------------------------ */
ok('a rig edit or body-slider move re-resolves the frozen poses',
  /try\{POSEHOLD_CACHE\.clear\(\);\}catch\(e\)\{\}/.test(src));
ok('the arm-angle hold is applied INSIDE the resolver, so both mechanisms compose',
  /const P=armHoldApply\(d,clip,ph,raw\.sk\);/.test(src));

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
