// BOHEMIA — CRAFT LAW GATE (8/1/26). The memory Paolo actually asked for.
//
// Paolo 8/1: "Please remember all my feedback and put it into your own training
// data." That is not a thing I can do -- nothing from a session reaches the
// weights, and the next session boots with no memory of this one. What CAN
// persist is this repo, which is why GIT IS THE MEMORY is a standing law.
//
// So this gate IS the remembering. It fails if the craft law is deleted, if a
// clause is quietly dropped, or if the code that implements a clause regresses.
// A law without a machine gate is not enforced, and this repo proved that the
// hard way -- six of nine ungated laws were already broken when someone checked.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_LAW_HOW_HAIR_AND_SHAPE_WORK_8_1_26.md');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== CRAFT LAW GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the craft law is checked in', fs.existsSync(LAW));
if (!fs.existsSync(LAW)) done();
const law = fs.readFileSync(LAW, 'utf8');
const src = fs.readFileSync(ALPHA, 'utf8');

/* ---- the law still says what he said ----------------------------------- */
const CLAUSES = [
  ['1 THE BACK IS NOT THE FRONT',      'THE BACK IS NOT THE FRONT'],
  ['2 COVER THE HEADSPACE',            'COVER THE HEADSPACE'],
  ['3 NO STRAIGHT LINES',              'NO STRAIGHT LINES'],
  ['4 TWO HAIR ONE SKIN (amended)',    'TWO PIXELS OF HAIR, ONE PIXEL OF SKIN'],
  ['5 CENTRE WHAT SHOULD BE CENTRAL',  'CENTRE WHAT SHOULD BE CENTRAL'],
  ['6 A FADE MUST ACTUALLY FADE',      'A FADE MUST ACTUALLY FADE'],
  ['7 LONG HAIR SHOWS FROM THE FRONT', 'LONG HAIR SHOWS FROM THE FRONT'],
];
for (const [name, needle] of CLAUSES) ok('clause ' + name + ' is intact', law.indexOf(needle) >= 0);

/* HIS WORDS SURVIVE, not my paraphrase. Collapse whitespace first: these quotes
   are line-wrapped markdown, and the first version of this check searched for
   them as single lines and failed on quotes that were sitting right there. That
   is the ninth time in this repo a checker assumed prose came unwrapped -- and
   collapsing whitespace ALONE is not enough either: these are markdown
   BLOCKQUOTES, so the '> ' markers survive the collapse and land mid-sentence
   ("...covered more by hair > covered more by hair..."). The LAB lane hit this
   exact bug on his exact quotes. Strip the quote markers, THEN collapse. */
const flat = law.replace(/^\s*>\s?/gm, '').replace(/\s+/g, ' ');
ok('it still quotes him on the back of the head',
  flat.indexOf("there's a lot of headspace that should be covered more by hair") >= 0);
ok('it still quotes him on straight lines',
  flat.indexOf('a lot of straight lines and that') >= 0);
ok('it still quotes him on one pixel (the superseded wording, kept)',
  flat.indexOf('just one pixel not like two or three') >= 0);
ok('and quotes the AMENDMENT that supersedes it',
  flat.indexOf('one pixel for the skin two pixels for the hair') >= 0);

/* the process lessons are load-bearing too -- they are why the craft ones stuck */
for (const needle of [
  'A GATE MUST NEVER OUTRANK A RULING',
  'A CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE',
  'Fix the ruler, never the target',
  'DO NOT CLAIM THINGS ABOUT THE CODEBASE WITHOUT CHECKING',
]) ok('process lesson kept: "' + needle.slice(0, 42) + '"', law.indexOf(needle) >= 0);

/* ---- and the CODE still honours the clauses a machine can check --------- */
ok('clause 2 in code: the back facing covers the whole skull',
  /var sideBot=back\?hBot:/.test(src));
ok('clause 3 in code: row edges take a deterministic wobble',
  /var wob=function\(y,side\)/.test(src) && /mn-=wob\(y,0\); mx\+=wob\(y,1\)/.test(src));
ok('clause 3 in code: the wobble is HASHED, never rolled (an NPC must not shimmer)',
  /_wseed/.test(src) && !/Math\.random[\s\S]{0,200}wob/.test(src));
/* AMENDED 8/1 the same day: 2 HAIR : 1 SKIN, not 1:1. The original %3 was already
   right; I changed it to %2 on an over-reading of his first note and he corrected
   me. The gate now pins the ratio he actually specified, and pins it for EVERY
   skin-through-hair texture, because he said "any sort of skin to hair hairstyle". */
/* ONE FUNCTION, BOTH PATHS (8/1). The ratio used to live inline in the mass loop
   while the front-curtain branch drew SOLID, so half a cornrow had no rows in it.
   And the phase was keyed to the ROW START, which moves every row -- a stripe whose
   phase shifts per row is not a stripe. Anchored to the HEAD (hMn) it lines up
   vertically down the skull whichever path drew it, which is what a cornrow, a loc
   and a fade taper all are. This is the piece fades will reuse. */
ok('clause 4 in code: ONE shared texture function, not a rule per drawing path',
  /var texSkip=function\(x,y\)/.test(src));
ok('clause 4 in code: two pixels of hair to one of skin (ropes)',
  /tex==='locs'\)\s*return \(\(x-hMn\)%3===2\)/.test(src));
ok('clause 4 in code: the same ratio on the weave, not just the ropes',
  /tex==='braid'\)\s*return \(\(\(y-hTop\)%3===2\)&&\(\(x-hMn\)%3===2\)\)/.test(src));
ok('clause 4 in code: the phase is anchored to the HEAD, not the moving row start',
  !/%3===2/.test(src.match(/var texSkip[\s\S]{0,400}/)[0].replace(/x-hMn/g, '')) === false
  && !/\(x-mn\)%3/.test(src));
ok('clause 4 in code: the FRONT CURTAINS use it too (they drew solid before)',
  /if\(texSkip\(xl,y\)\)continue/.test(src) && /if\(texSkip\(xr,y\)\)continue/.test(src));
ok('clause 5 in code: the head centre floors instead of rounding',
  /hcx=Math\.floor\(\(hMn\+hMx\)\/2\)/.test(src));
ok('clause 5 in code: a strip centres on its own row',
  /_rc=Math\.floor\(\(s\[0\]\+s\[1\]\)\/2\)/.test(src));
ok('clause 7 in code: a long style widens its curtain below the jaw',
  /\(opt\.back\|\|0\)>=3&&y>hBot/.test(src));

/* CLAUSE 6 IS BUILT (8/1). It was recorded as unbuilt for exactly as long as it was
   unbuilt -- silence never implied done -- and now it is asserted in the code. */
ok('clause 6 is BUILT and says so', /\*\*BUILT 8\/1\/26\.\*\*/.test(law) && !/\[NOT YET BUILT\.\]/.test(law));
ok('clause 6 in code: the fade is a DENSITY ramp inside the shared texture function',
  /var fadeRows=opt\.fade\|\|0/.test(src) && /if\(fadeRows\)\{/.test(src));
ok('clause 6 in code: it blends into SKIN by skipping, not into a paler hair tone',
  /return true;\s*\/\* the bottom is skin/.test(src));
ok('clause 6: fades ship as CANDIDATES, never canon on my say-so',
  /\{n:'HIGH FADE',st:'cook',layer:'hair'/.test(src));

/* ---- the rulings this law grew out of are still on file ---------------- */
ok('the wave-1 verdict sheet is kept',
  fs.existsSync(path.join(ROOT, 'records', 'HAIR_VERDICTS_WAVE1_8_1_26.txt')));
ok('the haircut-is-a-luxury addendum is kept',
  fs.existsSync(path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_A_HAIRCUT_IS_A_LUXURY_8_1_26.md')));
ok('the law is honest that training data is not where this lives',
  /That is not something I\s*\ncan do\.|\*\*That is not something I/.test(law));

done();
