// BOHEMIA — OWN CANVAS GATE (Paolo 7/26/26, LOCKED). FACTORY LAW: new law, new
// gate, same turn.
//
// "So build it differently, so the arm and the torso don't share pixels. Just
//  imagine on the right side of the screen you do the front arm, on the left the
//  back arm, in the middle the torso, and then you put them back together."
//
// WHAT THIS LOCKS: skin() samples every part ALONE, on its own canvas, and only
// composites afterwards. It may never go back to sampling into one shared screen
// with a running claim buffer, because that made the torso's own shape depend on
// where the arm was standing that frame.
//
// AND IT LOCKS THE HONEST PART. This change did NOT fix the morphing (6,537 ->
// 6,518, i.e. nothing). What it did was isolate the defect: with each part on its
// own canvas the arms' own shapes flicker 3-6x worse than the torso and legs at
// the same pixel area, the BACK arm worst -- exactly what he reported. The
// addendum records that, records eleven negative results, and records that the
// remaining fix is art, not code. A future edit that keeps the architecture and
// deletes the "it did not work" fails here on purpose.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_OWN_CANVAS_7_26_26.md');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== OWN CANVAS GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(LAW));
ok('the patch tool is checked in', fs.existsSync(path.join(ROOT, 'tools', 'bohemia_own_canvas_patch.py')));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');

/* ---- the architecture he asked for --------------------------------------- */
ok('every part has its own private canvas', /this\.partCv = new Uint8Array\(13\*CW\*CH\)/.test(src));
ok('the primary inverse sample no longer yields cells to a nearer part',
  /if \(mask\[sc\]\) continue;\s*\/\/ OWN CANVAS: only I can be in my way/.test(src));
ok('the retired forward-splat carries the same rule, so it cannot bring the coupling back',
  /if \(mask\[sc\]\) continue;\s*\/\/ OWN CANVAS, same rule/.test(src));
ok('a part commits to its OWN sheet, not to a shared screen',
  /for \(let sc = 0; sc < CW\*CH; sc\+\+\) if \(mask\[sc\]\) partCv\[cb\+sc\]=1;/.test(src));
ok('the parts are put back together only after every one is drawn whole',
  /PUT THEM BACK TOGETHER/.test(src) &&
  /for \(let sc = 0; sc < CW\*CH; sc\+\+\) if \(partCv\[cb\+sc\] && !out\[sc\]\) \{ out\[sc\]=p; claim\[sc\]=p; \}/.test(src));

/* THE REGRESSION THAT MATTERS: nothing may write to `claim` during sampling
   again. That single line is what coupled the parts together. */
{
  const skin = /skin\(pose\) \{[\s\S]*?\n  \}\n/.exec(src);
  ok('the skinner body is locatable', !!skin);
  if (skin) {
    const body = skin[0];
    const compositeTail = body.indexOf('PUT THEM BACK TOGETHER');
    const sampling = compositeTail > 0 ? body.slice(0, compositeTail) : body;
    ok('NOTHING writes to the claim buffer during sampling (that was the coupling)',
      !/claim\[sc\]\s*=/.test(sampling));
    ok('no sampling test reads the claim buffer any more',
      !/if \(claim\[sc\]/.test(sampling));
  }
}

/* ---- the record stays honest --------------------------------------------- */
ok('the law states plainly that this did NOT move the picture',
  /IT DID NOT MOVE THE PICTURE/.test(law) && /6,518/.test(law));
ok('the law records what it DID do: the defect is the arms\' own resample',
  /1\.98/.test(law) && /the back arm/i.test(law));
ok('the law records the torso and legs holding still, which is the comparison that proves it',
  /0\.38/.test(law) && /0\.29/.test(law));
ok('the law keeps every negative result so nobody rebuilds them',
  /EVERYTHING RULED OUT/.test(law) && /7,524/.test(law) && /angle snap/.test(law));
ok('the law records that the metric itself was checked for false positives',
  /THE METRIC WAS CHECKED TOO/.test(law));
ok('the law states the remaining fix is ART, not another renderer attempt',
  /is not a renderer fix/i.test(law) && /A twelfth attempt is not a plan/.test(law));

done();
