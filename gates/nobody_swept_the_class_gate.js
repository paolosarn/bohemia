/* ============================================================================
   NOBODY SWEPT THE CLASS (8/29/26, RUN lane)

   THE WORLD LANE'S OWN POST-MORTEM, 8/29, on finding that every freeway in the
   valley was built sideways:

     "The street contract gate's own header describes this identical line, in the
      arterial, as that module's defect number one ... It was fixed there on 8/26
      and NOBODY SWEPT THE CLASS. Third time this month: the dead-green palette
      went the same way, fixed three times one module at a time."

   THREE TIMES. And the cost of the third one was measured: 249 of 952 freeway
   cells cut off from the road network, 214 separate road networks in the valley,
   and a car that could not drive the length of the interstate.

   PAOLO HAS BEEN REPORTING THE VISIBLE HALF OF THIS SINCE 8/15 ("which direction
   a street should be going east to West north to south") and again on 8/28 ("do
   you not see the fucking streets that are not facing the correct direction? I
   keep trying to fucking tell you"). He is not reporting three bugs. He is
   reporting one class, three times, because we fix it one module at a time.

   ------------------------------------------------------------------------
   THE CLASS, STATED SO A MACHINE CAN CHECK IT
   ------------------------------------------------------------------------
   A ROAD MUST NEVER BE HANDED AN AXIS THAT DID NOT COME FROM THE WORLD.

   It has been broken in two different shapes, and the sweep has only ever been
   done on one of them:

     SHAPE A, THE MODULE FORCES IT.  `o.same = o.links = o.streets = ['N','S']`
       in a kit registration, which throws the caller's answer away before the
       module ever sees it. Found in the ARTERIAL (fixed 8/26, 921 cells) and
       then, unswept, in the FREEWAY (fixed 8/29, 249 stranded cells).
       *** THIS SHAPE IS NOW SWEPT AND THIS GATE KEEPS IT SWEPT. ***

     SHAPE B, THE CALLER DEFAULTS IT.  `roadAxis(...) || 'ns'`, which turns "I do
       not know" into a north-south road. roadAxis's own comment names this and
       says the guess "was always the same direction". Fixed for 14 freeway cells
       on 8/27. STILL TRUE FOR 115 MORE, measured 8/28 by
       gates/street_facing_is_measured_gate.js: 115 real crossings built as a
       plain north-south street with no east-west arms at all.
       *** THIS SHAPE HAS NEVER BEEN SWEPT. IT IS COUNTED HERE. ***

   ------------------------------------------------------------------------
   WHY THIS IS A SOURCE SWEEP AND NOT ASHAMED OF IT
   ------------------------------------------------------------------------
   The 8/15 facing gate was 14 regexes against source text and it was WORTHLESS,
   because it was asked to prove a BEHAVIOUR -- do streets face the right way --
   and source text cannot answer that.

   THIS GATE IS ASKED A DIFFERENT QUESTION: does the pattern exist anywhere in
   the code. That IS a question about source, and behaviour is held separately by
   street_facing_is_measured_gate.js, which renders the real surface and counts
   real cells. The two are not substitutes and neither one alone is enough:
   the behaviour gate says HOW BAD, this one says WHERE ELSE.

   node gates/nobody_swept_the_class_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };

/* Comments are stripped everywhere before searching. A MENTION IS NOT A USE, and
   this class is heavily documented -- bohemia_freeway.js quotes the old broken
   line verbatim inside the comment that explains fixing it, so a naive grep
   reports the bug it just fixed. */
function code(p) {
  return fs.readFileSync(p, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:"'\\])\/\/[^\n]*/g, '$1');
}

const ENGINE = fs.readdirSync(path.join(ROOT, 'engine'))
  .filter(f => /\.js$/.test(f)).map(f => path.join(ROOT, 'engine', f));
const SLICES = ['slices/BOHEMIA_CITY_WORLD.html'].map(f => path.join(ROOT, f));

console.log('NOBODY SWEPT THE CLASS — a road is never handed an axis the world did not give it');

/* ---- SHAPE A: a kit registration that forces the axis --------------------- */
/* The BOTH-LEGS rule is legitimate and the freeway keeps it deliberately: a
   caller that says nothing still gets a through-running cell. What is banned is
   forcing it UNCONDITIONALLY, with no test of what the caller actually said. */
const forced = [];
for (const f of ENGINE.concat(SLICES)) {
  const src = code(f);
  const re = /o\.(?:same|links|streets)\s*=[^;\n]*\[\s*'(?:N|S|E|W)'[^\]]*\]/g;
  let mth;
  while ((mth = re.exec(src))) {
    const line = src.slice(0, mth.index).split('\n').length;
    const before = src.slice(Math.max(0, mth.index - 220), mth.index);
    /* guarded = the assignment sits behind a test of what the caller supplied,
       or is filtered by it. Unguarded = the world's answer is thrown away. */
    const guarded = /\bif\s*\([^)]*\b(ans|opts|same|links|streets|want)\b/.test(before)
                 || /\.filter\s*\(/.test(mth[0]);
    if (!guarded) forced.push(path.basename(f) + ':' + line);
  }
}
ok('*** SHAPE A IS SWEPT: no road module forces its own axis unconditionally *** '
  + '-- the arterial did it until 8/26 (921 cells) and the freeway until 8/29 '
  + '(249 stranded cells), the same line, three weeks apart, because nobody '
  + 'looked for the second one'
  + (forced.length ? ' [' + forced.join(', ') + ']' : ''),
  forced.length === 0);

/* ---- SHAPE B: a caller that defaults the axis ---------------------------- */
const defaulted = [];
for (const f of ENGINE.concat(SLICES)) {
  const src = code(f);
  const re = /roadAxis\s*\([^)]*\)\s*\|\|\s*'(ns|ew)'/g;
  let mth;
  while ((mth = re.exec(src))) {
    defaulted.push(path.basename(f) + ':' + src.slice(0, mth.index).split('\n').length
      + " -> '" + mth[1] + "'");
  }
}
/* THE CEILING, NOT ZERO, AND SAYING WHY. Every one of these is a real defect and
   the behaviour gate counts what they cost (115 crossings built north-south).
   They are NOT fixed here because a crossing is an agreement between two cells,
   not a decision one cell makes: the one-line fix was tried on 8/28 and took
   street_contract_gate from 19/0 to 17/2, turning 115 wrong-facing cells into
   191 broken seams. It has to be settled where the seam is negotiated, which is
   the WORLD lane's live work. Ratcheted so it cannot grow while that happens. */
const CEIL_DEFAULT = 2;
ok('SHAPE B is counted and cannot grow: ' + defaulted.length + ' places turn "the '
  + 'world does not know" into a north-south road (ceiling ' + CEIL_DEFAULT + ') ['
  + defaulted.join(' | ') + ']', defaulted.length <= CEIL_DEFAULT);

/* ---- AND THE SWEEP IS HONEST ABOUT ITS OWN BLINDNESS --------------------- */
ok('the sweep actually read the road modules (' + ENGINE.length + ' engine files + '
  + SLICES.length + ' slice)', ENGINE.length > 20);
ok('and it strips comments first, because this class is documented by quoting the '
  + 'broken line verbatim -- a naive grep reports the bug it just fixed',
  code(path.join(ROOT, 'engine', 'bohemia_freeway.js')).indexOf('NOBODY SWEPT') < 0);
/* THE SELF-TEST. A sweep that finds nothing because its pattern is wrong looks
   exactly like a sweep that finds nothing because the code is clean. */
const probe = "o.same = o.links = o.streets = ['N', 'S'];";
const reA = /o\.(?:same|links|streets)\s*=[^;\n]*\[\s*'(?:N|S|E|W)'[^\]]*\]/;
ok('*** AND THE PATTERN ACTUALLY MATCHES THE HISTORICAL BUG *** -- a sweep that '
  + 'finds nothing because its regex is wrong looks exactly like a clean codebase',
  reA.test(probe));
ok('and it does not match the legitimate derived form',
  !reA.test("o.links = allowed.filter(function(d){return want.indexOf(d)>=0;});"));

console.log('  MEASURED: shape A (module forces the axis) ' + forced.length
  + ' places · shape B (caller defaults it) ' + defaulted.length + ' places');
console.log('  THE COST OF NOT SWEEPING, from the lane that paid it: arterial 921 '
  + 'cells (8/26), freeway 249 stranded cells and 214 separate road networks '
  + '(8/29), and 115 crossings still built north-south (8/28, counted by '
  + 'street_facing_is_measured_gate).');
console.log('\n=== NOBODY SWEPT THE CLASS: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
