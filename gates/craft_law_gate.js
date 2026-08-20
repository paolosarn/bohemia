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
/* WIDENED 8/2 TO INCLUDE PROFILE, and the reason is the bug it was pinning around.
   sideF stops the mass halfway down the skull so it cannot run over the eyes on a
   FRONT view. BACK was exempted on 8/1; profile never was, so E/W kept half-covering
   the side of the head -- measured: cornrows on E occupied rows 5-6 and nothing
   else. Side-on there is no face in the way either. Pin BOTH exemptions so neither
   can be quietly dropped. */
ok('clause 2 in code: the back AND profile facings cover the whole skull',
  /var sideBot=\(back\|\|prof\)\?hBot:/.test(src));
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
/* THE RATIO AND THE ANCHOR ARE UNCHANGED -- they were factored into _ph/_pq when
   the phase learned to ROTATE WITH THE VIEW (8/2). Cornrows run front-to-back over
   the scalp: from the front you look ACROSS them (vertical stripes), from the SIDE
   you look ALONG them (horizontal bands). The gate pinned the literal inline
   expressions, so refactoring them read as removing them. Pin the behaviour. */
ok('clause 4 in code: two pixels of hair to one of skin (ropes)',
  /if\(tex==='locs'\)\s*return \(_ph%3===2\)/.test(src));
ok('clause 4 in code: the same ratio on the weave, not just the ropes',
  /if\(tex==='braid'\)\s*return \(\(_ph%3===2\)&&\(_pq%3===2\)\)/.test(src));
/* PIN THE BEHAVIOUR, NOT THE CHARACTERS (8/20, RUN lane). These four clauses
   used to be regexes over the source, and the 4X hair pass turned every hair
   distance from PIXELS into CELLS of S=CW/56 -- so `(x-hMn)` became
   `((x-hMn)/S)|0` and four true clauses reported false. Third time this gate has
   done that to itself; it says so twice in its own comments ("pin the
   behaviour", "THIS PINNED THE BROKEN FIX") and the law it enforces says A
   CHECKER THAT CANNOT TELL A MENTION FROM A USE IS THE BROKEN ONE. A regex over
   source can only ever see mentions. So the clauses now LIFT the expression out
   of the alpha, compile it, and run it. Stricter, not looser: the old check
   passed on a file that merely contained the right characters. */
const grab = (re, what) => { const m = src.match(re); if (!m) { f++; console.log('  > FAIL cannot find ' + what + ' in the alpha'); } return m; };
const fn = (expr, args) => Function(...args, 'return (' + expr + ');');
/* A THROW IS A FAIL, NEVER A CRASH. Mutation-tested 8/20: re-anchoring the phase
   to `mn` (the exact bug clause 4 exists for) made the lifted expression
   reference a name that is not a parameter, and the gate DIED -- taking the
   thirty claims after it down with it. A gate that stops reporting is the same
   family as the suite that stopped finishing: silence reads as green. So every
   lifted expression runs inside `probe`, which turns any throw into a red line
   and lets the rest of the law be checked. */
const probe = (name, body) => { try { ok(name, body()); } catch (e) { f++; console.log('  > FAIL ' + name + ' [threw: ' + e.message + ']'); } };

const mPh = grab(/var _ph=([^,]+), _pq=([^;]+);/, 'the hair texture phase');
const phaseRun = () => {
  const A = ['prof', 'x', 'y', 'hTop', 'hMn', 'S'];
  const ph = fn(mPh[1], A), pq = fn(mPh[2], A);
  let anchored = true, flat = true, rotates = true;
  for (const S of [1, 2, 4]) for (const hMn of [0, 7, 22]) for (const hTop of [0, 5, 19]) {
    /* the phase must READ ZERO at the head's own edge -- that is what "anchored
       to the head" means, and the bug it replaced read zero at the row start,
       which moves every row. */
    if (ph(0, hMn, hTop + 9, hTop, hMn, S) !== 0) anchored = false;
    if (ph(1, hMn + 9, hTop, hTop, hMn, S) !== 0) anchored = false;
    for (let d = 0; d < 24; d++) {
      /* and it must not move at all along the OTHER axis, or the stripe bends */
      if (ph(0, hMn + 5, hTop + d, hTop, hMn, S) !== ph(0, hMn + 5, hTop, hTop, hMn, S)) flat = false;
      if (ph(1, hMn + d, hTop + 5, hTop, hMn, S) !== ph(1, hMn, hTop + 5, hTop, hMn, S)) flat = false;
      /* ROTATION: in profile the quadrature phase is the front-view phase and
         vice versa, so cornrows band the other way when you look along them */
      if (pq(1, hMn + d, hTop, hTop, hMn, S) !== ph(0, hMn + d, hTop, hTop, hMn, S)) rotates = false;
      if (pq(0, hMn, hTop + d, hTop, hMn, S) !== ph(1, hMn, hTop + d, hTop, hMn, S)) rotates = false;
    }
  }
  return { anchored: anchored && flat && !/\bmn\b/.test(mPh[1]) && !/\bmn\b/.test(mPh[2]), rotates };
};
if (mPh) {
  probe('clause 4 in code: the phase is anchored to the HEAD, not the moving row start',
    () => phaseRun().anchored);
  probe('clause 4 in code: and the pattern ROTATES with the view (rows run the right way in profile)',
    () => phaseRun().rotates);
}

/* THIS PINNED THE BROKEN FIX. It asserted the strip centred via
   Math.floor((s[0]+s[1])/2) -- which is exactly the implementation he killed three
   styles over. Flooring an even-width head's centre lands the strip half a pixel
   LEFT, every row, every facing (measured: head 22-33 centre 27.5, strip 25-29
   centre 27). The real bug was PARITY: c-strip..c+strip is always an ODD width and
   an odd strip cannot centre on an even head. Now both edges come off the DOUBLED
   centre, so the strip's parity follows the head's. Measured after: 0.0 offset on
   every front and back facing. */
const mCx = grab(/var hH=Math\.max\(1,hBot-hTop\), hcx=([^,]+), hcxR=/, "the hair's head centre");
if (mCx) probe('clause 5 in code: the head centre floors instead of rounding', () => {
  const hcx = fn(mCx[1], ['hMn', 'hMx', 'S']);
  let exact = true, cellCentred = true;
  for (let w = 3; w <= 40; w++) for (const hMn of [0, 6, 22]) {
    const hMx = hMn + w - 1;
    /* AT S===1 THIS IS THE LITERAL THE OLD REGEX WANTED, verified by arithmetic:
       floor, never round. Math.round breaks .5 upward and puts the mohawk one
       pixel right of centre, forever, which is the note that made this clause. */
    if (hcx(hMn, hMx, 1) !== Math.floor((hMn + hMx) / 2)) exact = false;
    for (const S of [2, 4]) {
      /* above S===1 the centre is a CELL, and the cell's own centre must sit on
         the head's centre within the half pixel an integer grid allows */
      if (Math.abs((hcx(hMn, hMx, S) + (S - 1) / 2) - (hMn + hMx) / 2) > S / 2) cellCentred = false;
    }
  }
  return exact && cellCentred;
});

const mStrip = grab(/var _d2=s\[0\]\+s\[1\];\s*mn=([^;]+); mx=([^;]+);/, 'the strip edges');
if (mStrip) probe('clause 5 in code: a strip takes its parity from the head, so the centre is exact', () => {
  const A = ['_d2', 'strip', 'S'];
  const lo = fn(mStrip[1], A), hi = fn(mStrip[2], A);
  let parity = true;
  for (let a = 0; a < 40; a++) for (let w = 1; w <= 24; w++) for (let strip = 1; strip <= 6; strip++) for (const S of [1, 2, 4]) {
    const b = a + w - 1, d2 = a + b;
    /* THE WHOLE CLAUSE IN ONE LINE: the strip's centre is the head's centre,
       exactly, whatever the two widths' parities are. An odd strip cannot centre
       on an even head, so the strip is the one that gives -- both edges come off
       the DOUBLED centre so mn+mx lands back on s[0]+s[1] every time. */
    if (lo(d2, strip, S) + hi(d2, strip, S) !== d2) parity = false;
  }
  return parity;
});
ok('clause 5: the profile-view gap is recorded as KNOWN and unfixed, not hidden',
  /KNOWN, MEASURED, NOT FIXED/.test(src));
ok('clause 7 in code: a long style widens its curtain below the jaw',
  /\(opt\.back\|\|0\)>=3&&y>hBot/.test(src));

/* CLAUSE 6 IS BUILT (8/1). It was recorded as unbuilt for exactly as long as it was
   unbuilt -- silence never implied done -- and now it is asserted in the code. */
ok('clause 6 is BUILT and says so', /\*\*BUILT 8\/1\/26\.\*\*/.test(law) && !/\[NOT YET BUILT\.\]/.test(law));
/* REBUILT 8/1 AFTER HE KILLED ALL THREE. My first version was a DENSITY ramp that
   SKIPPED pixels so the raw body showed through -- and a hole is not a hair pixel.
   "some of the pixels of the hair could be like based on the skin tone, you know
   NOT JUST STRAIGHT THE SKIN TONE." It BLENDS now: the pixel stays hair and stays
   in the mass, its colour mixed toward the wearer's own complexion. */
ok('clause 6 in code: it TINTS hair toward the wearer\'s skin, it does not skip',
  /var skinTint=function\(c,x,y\)/.test(src) && /skinMid/.test(src));
ok('clause 6 in code: the tint is capped so a hair pixel never becomes plain skin',
  /Math\.min\(0\.75,/.test(src));
ok('clause 6 in code: every hair pixel is routed through the tint',
  /put\(x,y, skinTint\(/.test(src));
/* ONLY ON THE SKULL (Paolo 8/2). The tint exists because the scalp is under the
   hair; hair hanging past the skull has nothing behind it but air. The test is the
   PART GRID, not a bounding box, so it follows his painted silhouette exactly. */
ok('clause 6 in code: the tint is refused off the skull (head/face pixels only)',
  /var gv=g\[y\*CW\+x\];\s*\n\s*if\(gv!==1&&gv!==2\)return c;/.test(src));
ok('clause 6: the skull test reads the PART GRID, not a bounding box',
  /The test is the PART GRID, not a bounding box/.test(src));
/* PINNED A NAME AND HE APPROVED IT. This asserted SUN CROP was st:'cook' -- so the
   moment he thumbed it up ("Perfect I thumbs up both of the additions"), the gate
   reported a FAILURE for his own verdict. Fifth time today a gate has gone red at a
   ruling being carried out. The invariant was never "this style stays a candidate";
   it is "a skin-toned style ENTERS as a candidate, and only HE promotes it". So:
   there must be candidates awaiting his thumb, and the fade option must appear on
   at least one of them. Names are his to change; the rule is not. */
/* THIS DEMANDED A NON-EMPTY QUEUE, and he emptied it by approving everything.
   "All the hair thumbs up." An empty candidate queue is the GOAL of the verdict
   workflow, not a failure of it -- STALE UNJUDGED IS DEAD cuts the other way too.
   Sixth time today a gate has gone red at a ruling being carried out.
   The real invariant is not "something is pending"; it is that the ROUTE exists:
   the judge board must still SHOW candidates when there are any, so a new cook
   cannot be born straight into canon without passing his thumb. */
ok('clause 6: the judge board still admits candidates, so nothing enters canon unjudged',
  /g\.st === 'canon' \|\| g\.st === 'cook'/.test(src));
/* The tint must be REACHABLE, not necessarily on whatever happens to be pending
   his thumb right now -- the candidate list turns over every round. Assert the
   approved canon carries it. */
ok('clause 6: the skin-tint is live on approved canon styles',
  (src.match(/st:'canon',layer:'hair'[\s\S]{0,240}?fade:\s*\d/g) || []).length >= 4);

/* ---- the rulings this law grew out of are still on file ---------------- */
ok('the wave-1 verdict sheet is kept',
  fs.existsSync(path.join(ROOT, 'records', 'HAIR_VERDICTS_WAVE1_8_1_26.txt')));
ok('the haircut-is-a-luxury addendum is kept',
  fs.existsSync(path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_A_HAIRCUT_IS_A_LUXURY_8_1_26.md')));
ok('the law is honest that training data is not where this lives',
  /That is not something I\s*\ncan do\.|\*\*That is not something I/.test(law));

done();
