/* ============================================================================
   BOHEMIA -- A MERGE DID NOT QUIETLY DELETE A LIVE SYSTEM (9/27/26, PEOPLE lane)

   *** THIS GATE EXISTS BECAUSE I CAUSED THE DEFECT IT CHECKS FOR. ***

   CHARACTER, 9/27, in their own commit and raised as [PENDING coordinator]:
     "PEOPLE's [bb company] commit (74aee15c) silently reverted it resolving a
      rebase conflict in the shared alpha file ... it also reverted SOUNDS'
      room-filter fix ... the second time that exact fix has been silently
      reverted."
     "a shared single-file alpha under constant parallel rebases needs a machine
      check that a merge did not quietly delete a live system -- this is the
      second time in this file's history a rebase silently reverted a shipped
      fix. Naming it, not claiming it; PLUMBER or the coordinator is better
      placed to own it."

   They were right, it was mine, and the root cause was one line in my own
   landing helper: it took MY WHOLE COPY of the shared alpha and swapped the
   build stamp, so everything main had added since my branch point was thrown
   away. CHARACTER's 13 wired faction outfits and 20 colourway garments went, and
   SOUNDS' 4-section room filter went with them. Both pushes reported success.

   *** A PUSH THAT SUCCEEDS IS NOT A MERGE THAT WORKED, AND NOTHING IN THIS REPO
   COULD TELL THE DIFFERENCE. *** The lane that lost the work found out a round
   later, by hand, because their own colour gate went 34/4 to 33/5.

   WHAT THIS HOLDS, AND IT IS DELIBERATELY DUMB: the shared surfaces below only
   ever GROW. Lanes add systems to them; nobody removes another lane's. So after
   a rebase, EVERY LINE origin/main HAD MUST STILL BE THERE. A line that main has
   and HEAD does not is either a deletion you meant -- in which case you say so
   in the commit message, which this reads -- or somebody's work you just threw
   away without noticing.

   IT IS OWNED BY WHOEVER WANTS IT. Built here because this lane caused the
   defect and "fix it immediately, root cause, move on" is the standing rule, not
   because PEOPLE is the right long-term owner. PLUMBER or the coordinator should
   take it; it needs no knowledge of this lane to run.

   node gates/a_merge_did_not_delete_a_system_gate.js
   ========================================================================== */
const { execFileSync } = require('child_process');
const path = require('path');
const ROOT = path.dirname(__dirname);

/* THE SHARED SINGLE-FILE SURFACES. Every lane edits these every round, which is
   exactly what makes a bad rebase invisible in them. */
const SHARED = [
  'slices/BOHEMIA_ALPHA_0_9.html',
  'slices/BOHEMIA_CITY_WORLD.html',
  'records/target/BOHEMIA_VOTE_REGISTRY.json'
];

/* A DELETION IS ALLOWED WHEN THE COMMIT SAYS SO. The phrase is deliberately
   awkward to type by accident. */
const SAYS_SO = /DELETES ON PURPOSE/;

let pass = 0; const fail = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function git(args) {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 30 }); }
  catch (e) { return null; }
}

console.log('\nA MERGE DID NOT QUIETLY DELETE A LIVE SYSTEM');

/* WHAT TO COMPARE AGAINST. origin/main if we have it, else the merge base. A
   check that silently compares against nothing is the failure mode this gate is
   named after, so it says out loud which it used. */
let base = 'origin/main';
if (git(['rev-parse', '--verify', '--quiet', 'origin/main']) === null) base = null;
ok('there is a main to compare against', !!base,
   base || 'no origin/main in this clone: nothing can be checked and that is said, not skipped');
if (!base) {
  console.log('\nRED: ' + pass + ' passed, ' + fail.length + ' failed');
  process.exit(1);
}

const msg = git(['log', '-1', '--format=%B']) || '';
const excused = SAYS_SO.test(msg);

/* *** THE SELF-TEST FIRST. A CHECK THAT CANNOT FIND A DELETION IS NOT A CHECK,
   and this gate's whole reason for existing is that the repo had one of those
   (none at all) for months. Feed it a file with a line removed and it must say
   so. *** */
(function selfTest() {
  const a = ['one', 'two', 'three', 'four'];
  const b = ['one', 'three', 'four'];
  const lost = missing(a, b);
  ok('[self-test] it can see a line that went missing',
     lost.length === 1 && lost[0] === 'two', lost.join('|') || 'saw nothing');
  ok('[self-test] and it does not cry about a line that only moved',
     missing(a, ['four', 'one', 'two', 'three']).length === 0);
  ok('[self-test] or about lines that were added',
     missing(a, a.concat(['five'])).length === 0);
})();

/* WHAT MAIN HAS THAT HEAD DOES NOT. Counted as a MULTISET so a line that
   legitimately appears twice and now appears once is still caught, and so a
   reordering is not. */
function missing(mainLines, headLines) {
  const have = new Map();
  for (const l of headLines) have.set(l, (have.get(l) || 0) + 1);
  const lost = [];
  for (const l of mainLines) {
    const n = have.get(l) || 0;
    if (n > 0) have.set(l, n - 1); else lost.push(l);
  }
  return lost;
}

/* *** AND THE CONTROL THAT MATTERS: REPLAY THE REAL INCIDENT. ***
   A self-test on made-up arrays proves the arithmetic. This proves the RULE, on
   the actual commits, and it can never quietly stop meaning anything because
   both shas are permanent history. CHARACTER's [runway redo] wiring landed at
   4f1611e4; my 74aee15c is a descendant of it and dropped it anyway. If this
   gate had existed, that push would have been red. */
(function replayTheIncident() {
  const before = git(['show', '4f1611e4:' + SHARED[0]]);
  const after = git(['show', '74aee15c:' + SHARED[0]]);
  if (before === null || after === null) {
    ok('[control] the real incident can be replayed', false,
       'one of the two commits is not in this clone');
    return;
  }
  const lost = missing(before.split('\n'), after.split('\n'))
    .filter(l => l.trim().length > 0)
    .filter(l => l.indexOf('id="buildstamp"') < 0);
  ok('*** [control] IT GOES RED ON THE REAL REVERT THAT CAUSED THIS GATE ***',
     lost.length > 0,
     lost.length + ' lines CHARACTER had at 4f1611e4 that PEOPLE 74aee15c dropped');
  ok('[control] and one of them is the outfit wiring they said they lost',
     lost.some(l => /worn:\{hair:/.test(l)),
     'the faction outfit rows');
})();

let totalLost = 0;
for (const f of SHARED) {
  const mainTxt = git(['show', base + ':' + f]);
  const headTxt = git(['show', 'HEAD:' + f]);
  if (mainTxt === null || headTxt === null) {
    ok('both sides of ' + path.basename(f) + ' could be read', false, 'one side missing');
    continue;
  }
  const lost = missing(mainTxt.split('\n'), headTxt.split('\n'))
    .filter(l => l.trim().length > 0)
    /* the build stamp is REPLACED every ship, by design and by law */
    .filter(l => l.indexOf('id="buildstamp"') < 0);
  totalLost += lost.length;
  ok('*** ' + path.basename(f) + ' still has everything main had ***',
     lost.length === 0 || excused,
     lost.length === 0 ? 'nothing lost'
       : lost.length + ' line(s) main has and this tree does not'
         + (excused ? ', and the commit says DELETES ON PURPOSE' : ''));
  if (lost.length && !excused) {
    console.log('       the first few, so you can see whose they are:');
    for (const l of lost.slice(0, 6)) console.log('         - ' + l.trim().slice(0, 110));
    if (lost.length > 6) console.log('         ... and ' + (lost.length - 6) + ' more');
  }
}

if (totalLost === 0) {
  console.log('\n       Nothing was lost. That is the normal answer and it is cheap to');
  console.log('       get: these files only ever grow, so anything missing is somebody\'s');
  console.log('       work that a merge threw away.');
}

console.log('\n' + (fail.length ? 'RED' : 'GREEN') + ': ' + pass + ' passed, '
  + fail.length + ' failed');
if (fail.length) { fail.forEach(f => console.log('   FAIL  ' + f)); process.exit(1); }
