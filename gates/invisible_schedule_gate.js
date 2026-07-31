#!/usr/bin/env node
/* ===========================================================================
   INVISIBLE SCHEDULE GATE — Paolo 7/31/26, and it holds BOTH directions.

   THE RULING (laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.md):
       "it will all be invisible information."
   The game NEVER displays a person's schedule, routine, day shape or working
   hours. The system exists to be FELT - the street is busy at eleven and dead at
   two - and never to be READ. This answered the Majora's Mask question the
   individual-schedule research left open: observing a routine means WALKING it.

   THE LINE IS TENSE, and this gate holds it from both sides:
       PRESENT tense is EYESIGHT and is LEGAL.   "RIGHT NOW: SCAVENGING"
       FUTURE or HABITUAL tense is a TIMETABLE.  "THEIR DAY: OUT 07:15"
   A gate that only banned things would invite the next session to over-correct
   and delete eyesight too, so the eyesight row is asserted PRESENT as well as
   the timetable asserted ABSENT.

   THE ONE WAIVER, dated and named rather than quietly tolerated: the PEOPLE
   lane shipped a THEIR DAY row at 18:38 on 7/31 and the ruling arrived after it.
   Nobody did anything wrong - the law did not exist yet. It is named below, it
   is printed on every run so it cannot rot silently, and a SECOND violation
   fails the build.

   WHAT IS NOT SWEPT, and why: judge/dev surfaces (tools/*_slice.py, *_proof.js,
   gates/) are how Paolo INSPECTS the sim. They are not the game showing the
   player anything, and the ruling is about the game.
   =========================================================================== */
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const rd = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const has = f => fs.existsSync(path.join(ROOT, f));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

const LAW = 'laws/BOHEMIA_ADDENDUM_NOBODY_HAS_A_NAME_UNTIL_YOU_ASK_7_31_26.md';

/* ---------------------------------------------------------------------------
   1. THE LAW IS RECORDED, IN HIS WORDS, AND FINDABLE
   --------------------------------------------------------------------------- */
ok('the addendum exists', has(LAW));
const law = has(LAW) ? rd(LAW) : '';
ok('it carries his ruling verbatim', law.includes('it will all be invisible information'));
ok('it carries the name half verbatim', law.includes("you will not know anyone's name and you'll have to ask everyone"));
ok('the parked idea is marked as an idea, not a ruling',
  /NOT A RULING/.test(law) && law.includes("that's just an idea for now"));
ok('the two exceptions he named are written down',
  law.includes('dialogue at the very beginning') && law.includes('a story reason or request reason'));
if (has('records/BOHEMIA_CANON_INDEX.md')) {
  ok('the canon index knows about it',
    rd('records/BOHEMIA_CANON_INDEX.md').includes('NOBODY_HAS_A_NAME_UNTIL_YOU_ASK'));
} else if (has('BOHEMIA_CANON_INDEX.md')) {
  ok('the canon index knows about it',
    rd('BOHEMIA_CANON_INDEX.md').includes('NOBODY_HAS_A_NAME_UNTIL_YOU_ASK'));
} else {
  ok('the canon index knows about it', false);
}

/* ---------------------------------------------------------------------------
   2. NO TIMETABLE IS PRINTED ON A PLAYER SURFACE
   --------------------------------------------------------------------------- */
/* The player surfaces: the game's own engine modules, the run's dev source, and
   the patch tools that inject code into a shipped renderer. NOT the built files
   (they are derived from these - checking both would double-count the same
   string) and NOT the judge tools. */
const SURFACES = [];
for (const f of fs.readdirSync(path.join(ROOT, 'engine'))) if (f.endsWith('.js')) SURFACES.push('engine/' + f);
SURFACES.push('slices/BOHEMIA_RUN_SLICE_7_26_26.html');
for (const f of fs.readdirSync(path.join(ROOT, 'tools')))
  if (/_patch\.py$/.test(f)) SURFACES.push('tools/' + f);

/* WHAT COUNTS AS PRINTING A TIMETABLE, and the first draft of this got it wrong
   in a way worth recording: it swept for the WORD "schedule" in any quoted
   string and immediately flagged the bus terminal's dead SCHEDULE BOARD - a
   physical object standing in the world with its hands stopped, which is set
   dressing and the opposite of a violation. The ruling is about A PERSON'S
   ROUTINE BEING DISPLAYED, not about a noun.
   So there are two narrow scans and no broad one:
     A. a UI LABEL whose text is a timetable word. `label: 'SCHEDULE'` is the
        violation in its purest form.
     B. the possessive phrasings, anywhere in a quoted string, because
        "THEIR DAY" / "DAILY ROUTINE" cannot mean anything except a person's. */
const LABELS = /label\s*:\s*(['"`])([^'"`\n]*)\1/g;
const LABEL_WORDS = /^\s*(THEIR DAY|THEIR HOURS|THEIR ROUTINE|THEIR SCHEDULE|SCHEDULE|ROUTINE|TIMETABLE|HOURS|THEIR CLOCK)\s*$/i;
const POSSESSIVE = /(['"`])[^'"`\n]*\b(THEIR DAY|THEIR HOURS|THEIR ROUTINE|THEIR SCHEDULE|DAILY ROUTINE|HIS ROUTINE|HER ROUTINE)\b[^'"`\n]*\1/gi;

/* THE WAIVER. Dated, named, owned. Anything not on this list fails. */
const WAIVED = [
  { file: 'engine/bohemia_people.js', label: 'THEIR DAY', since: '7/31/26',
    owner: 'PEOPLE lane',
    why: 'shipped at 18:38 on 7/31, one hour BEFORE the ruling existed. cardFor() '
       + 'pushes a row labelled THEIR DAY whose value is dayLineOf() -> "OUT 07:15 '
       + '· HOME 21:30". Theirs to remove or to argue; not this lane\'s file.' }
];

const found = [];
for (const f of SURFACES) {
  const src = rd(f);
  const at = k => src.slice(0, k).split('\n').length;
  let m;
  LABELS.lastIndex = 0;
  while ((m = LABELS.exec(src))) if (LABEL_WORDS.test(m[2]))
    found.push({ file: f, text: m[0], word: m[2].trim().toUpperCase(), line: at(m.index) });
  POSSESSIVE.lastIndex = 0;
  while ((m = POSSESSIVE.exec(src))) {
    const word = m[2].toUpperCase(), line = at(m.index);
    if (found.some(v => v.file === f && v.line === line && v.word === word)) continue;  // same row, both scans
    found.push({ file: f, text: m[0], word: word, line: line });
  }
}
const unwaived = found.filter(v => !WAIVED.some(w => w.file === v.file && v.word === w.label));

ok('NO NEW TIMETABLE IS PRINTED ANYWHERE ON A PLAYER SURFACE', unwaived.length === 0);
if (unwaived.length) for (const v of unwaived)
  console.log('       ' + v.file + ':' + v.line + '  ' + v.text);

/* The waiver has to still be REAL. A waiver for something that no longer exists
   is a lie the next reader inherits, so this fails if the PEOPLE lane fixes it
   and nobody deletes the waiver. */
for (const w of WAIVED) {
  const still = found.some(v => v.file === w.file && v.word === w.label);
  ok('the ' + w.label + ' waiver still describes something real (' + w.file + ')', still);
  if (still) console.log('       WAIVED ' + w.since + ' · ' + w.owner + ' · ' + w.file + ' · ' + w.label);
}
ok('the waiver list has not grown past the one it was written for', WAIVED.length === 1);

/* ---------------------------------------------------------------------------
   3. EYESIGHT SURVIVES. Present tense is not a timetable.
   --------------------------------------------------------------------------- */
if (has('engine/bohemia_people.js')) {
  const ppl = rd('engine/bohemia_people.js');
  ok("the RIGHT NOW row is still there (present tense is eyesight, and it is LEGAL)",
    /['"]RIGHT NOW['"]/.test(ppl));
  ok('and it is still fed by where somebody is at THIS turn, not by their day',
    /nowLineOf\s*\(/.test(ppl));
}

/* ---------------------------------------------------------------------------
   4. THIS LANE'S OWN HALF: person facts never reach the player
   --------------------------------------------------------------------------- */
{
  const run = rd('slices/BOHEMIA_RUN_SLICE_7_26_26.html');
  // every region between the RUN PERSON FACTS delimiters
  const regions = [];
  const OPEN = '/* ==== RUN PERSON FACTS (7/31) ==== */', CLOSE = '/* ==== /RUN PERSON FACTS ==== */';
  let i = 0;
  while ((i = run.indexOf(OPEN, i)) >= 0) {
    const j = run.indexOf(CLOSE, i);
    if (j < 0) break;
    regions.push([i, j + CLOSE.length]); i = j + 1;
  }
  ok('the run patch delimiters are balanced', regions.length >= 4);
  const inRegion = k => regions.some(r => k >= r[0] && k < r[1]);

  const FACTS = /\b(heatTol|scheduleSeed|workDir|workDist|favDir|earlyBy|duskSit|darkStay|wetStay)\b/g;
  const leaked = [];
  let m; FACTS.lastIndex = 0;
  while ((m = FACTS.exec(run))) if (!inRegion(m.index))
    leaked.push(run.slice(0, m.index).split('\n').length + ': ' + m[1]);
  ok('a person FACT never appears in the run outside the patch block', leaked.length === 0);
  if (leaked.length) console.log('       ' + leaked.join('\n       '));

  /* and inside the block it may only be READ by the test hook, never drawn */
  ok('the only place the run reads a person fact is the gate hook',
    /__RUN_PEOPLE[\s\S]{0,2000}heatTol/.test(run));
  ok('the run draws no person fact into a label',
    !/(fillText|textContent|innerHTML)[^\n]*\b(heatTol|archetype|scheduleSeed|workDir)\b/.test(run));
}

/* ---------------------------------------------------------------------------
   5. NAMES ARE EARNED, SO NO MODULE MAY MANUFACTURE ONE
   --------------------------------------------------------------------------- */
{
  const P = require(path.join(ROOT, 'engine/bohemia_population.js'));
  ok('the population module ships NO names (CONTENTS-PAOLO\'S)',
    Array.isArray(P.NAMES) && P.NAMES.length === 0);
  if (has('engine/bohemia_people.js')) {
    const People = require(path.join(ROOT, 'engine/bohemia_people.js'));
    const cast = People.NAMED_CAST || (People.tables && People.tables().NAMED_CAST);
    ok('the identity module ships NO named cast',
      cast == null || Object.keys(cast).length === 0);
    ok('and it has no procedural name generator',
      !/function\s+\w*[Nn]ameGen|NAME_PARTS|FIRST_NAMES|SURNAMES/.test(rd('engine/bohemia_people.js')));
  }
}

console.log('\n=== INVISIBLE SCHEDULE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
console.log('    Paolo 7/31: a routine is FELT, never READ. A name is ASKED FOR, never given.');
if (fail) process.exit(1);
