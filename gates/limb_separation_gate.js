// BOHEMIA — LIMB SEPARATION GATE (7/26/26). FACTORY LAW: new law, new gate, same turn.
//
// Paolo: "Why is it so hard to have the limbs look separated cleanly? And what
// about the back leg?"
//
// MEASURED: the body draws the limb separation line correctly and THE CLOTHING
// PAINTS OVER IT -- dressing the character destroyed ~70% of its separation. So
// the line is now a SEPARATE LAYER applied AFTER the clothing, colour-coded on the
// clothing (a boundary pixel steps to its OWN garment ramp's darker entry).
//
// WHAT THIS GATE EXISTS TO PROTECT:
//   1. the pass runs AFTER the garments. Under them it is worthless -- that was
//      the entire bug.
//   2. it NEVER invents a colour. Only an entry from the pixel's own ramp.
//   3. it covers LEGS as well as arms. They were excluded once, on a coverage
//      measurement that was the wrong measurement, and he caught it.
//   4. his blend exceptions survive (head, waist, shoulder, torso).
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_LIMB_SEPARATION_7_26_26.md');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== LIMB SEPARATION GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(LAW));
ok('the patch tool is checked in', fs.existsSync(path.join(ROOT, 'tools', 'bohemia_limb_separation_patch.py')));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');
const law = fs.readFileSync(LAW, 'utf8');

ok('the separation pass exists', /LIMB SEPARATION IS A LAYER ON TOP OF THE CLOTHING/.test(src));

/* 1. AFTER the clothing. This is the whole point: under it, it is erased. */
{
  const sep = src.indexOf('LIMB SEPARATION IS A LAYER ON TOP OF THE CLOTHING');
  const garment = src.indexOf('const _fr=SKINNERS[d].skinColorLayer(P,_fs.col');
  const cull = src.indexOf('FINAL FLOATER CULL');
  ok('the separation pass runs AFTER the garment composite (under it, the clothing erases it)',
    sep > garment && garment > 0);
  ok('and before the final floater cull', sep < cull && cull > 0);
}

/* 2. NEVER invents a colour. */
ok('a boundary pixel may only take an entry from its OWN garment ramp',
  /const darkerOf=\(c\)=>\{/.test(src) && /const e=MAP\[c\[0\]\+','\+c\[1\]\+','\+c\[2\]\]/.test(src));
ok('a colour belonging to no known ramp is LEFT ALONE, never guessed',
  /if\(dk\)out\.push\(\[i,dk\]\)/.test(src));
ok('the line goes whichever way the garment has ROOM (his ramp darker, else lighter, else derived)',
  /prefer a DARKER entry of the pixel's OWN ramp/.test(src) && /else a LIGHTER entry of its own ramp/.test(src));
ok('a derived tone never heads toward black (the constitution forbids a black keyline)',
  /const CONTRAST=\d+, FLOOR=\d+, CEIL=\d+;/.test(src) && /NEVER toward black/.test(src));
ok('deriving is the LAST resort, only when the ramp has no headroom either way',
  /else derive one/.test(src) && /fixed contrast step/.test(src));
ok('the colour -> ramp map is rebuilt per frame so tints resolve exactly',
  /window\._SEPMAP=\{\};\s*\/\* LIMB SEPARATION IS A LAYER/.test(src));

/* 3. LEGS TOO. */
{
  const blk = src.slice(src.indexOf('LIMB SEPARATION IS A LAYER ON TOP'), src.indexOf('FINAL FLOATER CULL'));
  ok('the pass covers LEGS as well as arms (they were wrongly excluded once)',
    /9:3,11:3,10:4,12:4/.test(blk));
  /* 4. his blend exceptions */
  ok('WAIST BLEND survives', /\(g===3\|\|g===4\)&&ng===5\)continue/.test(blk));
  ok('SHOULDER BLEND survives', /\(g===1\|\|g===2\)&&ng===5&&y<=SHY2\+1\)continue/.test(blk));
  ok('the head stays clean and the torso carries no shared edge',
    /if\(g===0\|\|g===5\)continue;/.test(blk) && /ng===g\|\|ng===0\)continue/.test(blk));
}

/* the record must keep the wall, or the next session re-solves a solved problem */
ok('the law records the bare-vs-dressed measurement that found the bug',
  /57\.7% \/ 76\.4%/.test(law) && /24\.3% \/ 22\.1%/.test(law));
ok('the law records that the LEGS were wrongly excluded on the wrong measurement',
  /ANSWERS THE BACK LEG/.test(law) && /wrong measurement/.test(law));
ok('the law records the WALL: 79.9% of boundary pixels have no darker tone to use',
  /79\.9%/.test(law));
ok('the law records the actual ramp luminances that prove it', /21, 24, 31/.test(law));
ok('the law puts the remaining decision to Paolo as art/data, not code',
  /A LINE TONE PER GARMENT/.test(law) && /RIM LIGHT/.test(law));
ok('the law records that neither direction works alone, which is why he was right not to choose',
  /NEITHER WORKS ALONE/.test(law));
ok('the law records where the pass actually lands (71 of 79 eligible cells)',
  /71 of 79/.test(law));
ok('the law records the measured result (clothed limbs now separate like bare skin)',
  /72\.6% \/ 66\.7%/.test(law) && /about as well as bare skin/.test(law));
ok('the law records the idempotent-patch trap that wasted three measurement rounds',
  /A PROCESS FAILURE WORTH RECORDING/.test(law) && /is not the same as a tool that did the thing/.test(law));
ok('the law flags the one derived colour so it can be vetoed',
  /ONE place a colour is derived/.test(law));

done();
