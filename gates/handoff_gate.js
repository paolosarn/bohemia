#!/usr/bin/env node
/* ============================================================================
   HANDOFF GATE — 8/2/26.

   CLAUDE.md: "`00_START_HERE_NEXT_SESSION.md` at repo root: read it immediately
   after this file, every session. There is only ever ONE, it always has this
   exact name so it sorts first and can never be missed."

   TWICE NOW that file has reached main with a LIVE MERGE CONFLICT in it --
   `<<<<<<<`, `=======`, `>>>>>>>` sitting in the text, one lane's head buried
   inside another's. The file's own history records the first time. The second
   was found on 8/2 by a session that only opened it to add its own head.

   WHY IT MATTERS MORE THAN IT LOOKS. Every parallel session is instructed to read
   this file FIRST, before it does anything. A conflicted handoff does not throw,
   does not fail to load, and does not look broken at a glance -- it just quietly
   hides one lane's entire status behind a marker, and the next session plans its
   work against half a picture. It is the highest-traffic file in the repo and the
   only one with no machine check on it at all.

   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This is that gate.

   WHAT IT HOLDS
     1. the file exists, at the exact canonical name, at the repo root
     2. there is exactly ONE of it (no BOHEMIA_HANDOFF.md, no _OLD, no dated copy)
     3. NO conflict markers, in it or in any tracked text file
     4. it still leads with a lane head, so it has not been truncated to nothing
     5. THE WHOLE FLEET IS STILL IN IT (8/27, added the day it wasn't)

   ON CLAIM 5, AND WHY CLAIM 4 WAS NOT ENOUGH. On 8/27 this file reached main at
   SIXTY-ONE LINES. It was 72,322 lines one commit earlier. One lane replaced the
   whole file with its own entry, deleting the live state of nine other lanes
   back through 8/2. Claim 4 exists for exactly that failure and it PASSED --
   because the wreckage still led with a lane head. Its own lane head.

   A check that only asks "is there anything here" cannot tell a handoff from a
   fragment of one. Claim 5 asks the question that was actually meant: every lane
   slug that was in this file at HEAD is still in it now. Lanes may be ADDED, and
   an entry may be demoted, rewritten or shortened -- a lane may never VANISH.

   AND IT CATCHES IT AT THE COMMIT, WHICH IS THE ONLY MOMENT IT CAN. Once a
   truncation lands, the truncated file becomes the baseline and the loss is
   invisible to any diff-based test forever after. That is not a weakness to
   paper over, it is the reason this has to be a pre-push gate and not an audit.

   ON THE MARKER TEST, because a sloppy one would fail the fix it guards: only
   `<<<<<<<` and `>>>>>>>` at the START of a line count. `=======` alone is not
   enough -- that is also a markdown setext heading underline, and this repo's
   records are full of them. And a line that MENTIONS markers mid-sentence (this
   file does, and so does the handoff head that reported the 8/2 conflict) is
   prose about the bug, not the bug. Comments are not code, and prose is not a
   conflict.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const NAME = '00_START_HERE_NEXT_SESSION.md';

let pass = 0, fail = 0;
/* THE HELPER TOOK TWO ARGUMENTS AND ATE THE THIRD, AND THE ONE CALL THAT PASSED A
   THIRD IS THE BLOCK-HEAD CHECK. (9/23, PLUMBER, found while fixing [eyes: head
   blind].) Its author wrote `LOST: <the heads that went>` and the helper threw it
   away, so the one check in this file whose whole job is to name a deleted block
   went red saying only that SOMETHING was deleted. A red that does not say what to
   put back is most of the way to no red at all. Swept the file: 9 call sites, 1
   passes a third argument, and it is that one. Now printed, on failure only. */
const ok = (n, c, why) => {
  if (c) { pass++; return; }
  fail++;
  console.log('  FAIL ' + n);
  if (why) console.log('         ' + why);
};

const HANDOFF = path.join(ROOT, NAME);
ok('the handoff is at the repo root under its exact canonical name', fs.existsSync(HANDOFF));
const text = fs.existsSync(HANDOFF) ? fs.readFileSync(HANDOFF, 'utf8') : '';

/* THERE IS ONLY EVER ONE. A second copy is how a session ends up reading a stale
   one; the law says git history is the archive, not a sibling file. */
const rootFiles = fs.readdirSync(ROOT).filter(f => /START_HERE|HANDOFF/i.test(f));
ok('there is exactly ONE handoff at the root (' + rootFiles.join(', ') + ')', rootFiles.length === 1);

/* THE LANE-NAME CHARACTER CLASS, WIDENED 9/23, AND IT WAS NOT A COSMETIC BUG.
   All three regexes in this file spelled a lane name as [A-Z] and spaces. The board
   calls one lane "LIFE + CITY", with a plus, so that lane fell out of every one of
   them. Measured across the whole handoff: the narrow spelling sees 30 lane names,
   the real one sees 31, and the missing name is LIFE + CITY.
   THE COSMETIC CONSEQUENCE was this gate sitting red on "it leads with a lane head"
   because that lane's block happens to be first. THE SERIOUS ONE is that the
   BLOCK-HEAD GUARD below -- built on 9/13 precisely to refuse a commit that deletes a
   block HEAD carries, after 93 commits ate 80 blocks -- COULD NOT SEE THAT LANE'S
   BLOCKS AT ALL, so the one lane whose name has a plus in it has never been protected
   by the guard written to protect everybody.
   This is the [spelling gates] class on this lane's own board, found in this lane's
   own gate: it held a SPELLING (letters and spaces) where the law is a MEANING (a lane
   name followed by its slug in parentheses). The slug shape is the real discriminator,
   so widening the name class cannot make this match prose. */
ok('it is not empty and still leads with a lane head (first line: "'
  + text.split('\n')[0].slice(0, 48) + '...")',
  /^[A-Z][A-Z +\/&-]*\([a-z0-9-]+\):/.test(text.split('\n')[0] || ''));

/* ---- 5. THE WHOLE FLEET IS STILL IN IT ----------------------------------
   Lane heads look like `SOUND (sound-xk7pjp): 8/27 (b) LATEST -- ...`. The slug
   in the parens is the lane's identity and it is stable across months, so the
   SET of slugs is the fleet as this file knows it. Compare against HEAD: a lane
   may be added, an entry may be demoted or rewritten or cut down, but a lane
   that was in here yesterday and is gone today is somebody's memory deleted. */
/* THE MATCHER HAD TO BE TIGHTENED BEFORE IT COULD BE BELIEVED. Its first cut
   accepted any parenthesised lowercase token after a capitalised word and came
   back with 31 "lanes" -- among them `a`, `d`, `03`, `7` and `unchanged`, all of
   them prose. A list that is mostly noise cannot tell you a real name went
   missing, and it would have gone red on any turn that reworded a sentence. A
   lane head is `NAME (slug-xxxxxx): 8/27 ...`: hyphenated slug, then a date. */
const lanes = (s) => {
  const out = new Set();
  const re = /^[A-Z][A-Z +\/&-]*\(([a-z0-9]+(?:-[a-z0-9]+)+)\):\s+\d/gm;
  let m; while ((m = re.exec(s))) out.add(m[1]);
  return out;
};
const now = lanes(text);
let head = null;
try {
  head = lanes(execFileSync('git', ['show', 'HEAD:' + NAME],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 }));
} catch (e) { /* first commit, or not a checkout: nothing to compare against */ }

if (head) {
  const gone = [...head].filter(l => !now.has(l));
  ok('THE WHOLE FLEET IS STILL IN THE HANDOFF: ' + now.size + ' lane(s), and none '
    + 'of HEAD\'s ' + head.size + ' has vanished' + (gone.length ? ' -- LOST: ' + gone.join(', ') : ''),
    gone.length === 0);
  /* ---- AND THE CASE BETWEEN THOSE TWO, WHICH IS THE ONE THAT KEEPS HAPPENING.
     (9/13, PLUMBER.) A LANE'S CURRENT STATE CAN BE DELETED WHILE ITS HISTORY
     SURVIVES, and neither check above can see it.

     MEASURED, not supposed. ae12177 (UI, [no slop] round 7) rewrote this file from
     a STALE READ: 79 lines added, 290 removed, net -211. It took PLUMBER 9/13 (b),
     PLUMBER 9/13 (c) AND WORDS 9/13 (c) with it. WORDS lost their current state and
     had no way to know.

     The fleet check above passed because no SLUG vanished -- both lanes still had
     older blocks. The bulk check passed because -211 lines of ~80,000 is 0.26%, and
     it allows anything above 80%. So the two of them cover "a lane disappeared" and
     "the file was truncated", and a lane's newest block falls straight between.

     This holds the BLOCK HEADS instead: every `LANE (slug): date LATEST` line that
     HEAD has must still be here. Lanes ADD a head each round and rewrite bodies, not
     heads, so a legitimate edit never trips it.

     THE ARCHIVE ESCAPE IS BUILT IN FROM THE START, because [handoff cut] is going to
     remove hundreds of these on purpose and a guard that blocks the planned work gets
     switched off. A head that is gone from here but present in archive/handoffs/ has
     been archived, not lost, and that is fine. */
  /* *** AND THE HEAD PATTERN HELD A SPELLING WHERE THE LAW IS A MEANING, FOR THE
     SECOND TIME IN THIS ONE FILE. (9/23, PLUMBER, row [eyes: head blind], found
     and proved by EYES AND EARS, who did not fix it because gates are this lane's.)

     THE ROUND MARKER USED TO BE `\(\w\)`: EXACTLY ONE CHARACTER. A lane past its
     twenty-sixth round of a day runs out of single letters and writes (aa), (ap),
     (bf). Two live lanes are already there, so their CURRENT heads were invisible
     to the check built to protect current heads.

     REPRODUCED IN A THROWAWAY TREE ON CURRENT MAIN, ONE DIFFERENCE AT A TIME, with
     EYES AND EARS carrying two blocks the way it will next round:
       delete its newest block, head `9/23 (aq)`  ->  8 passed, 0 failed, EXIT 0, silent
       the same deletion, head `9/23 (q)`         ->  7 passed, 1 failed, EXIT 1, named
     235 characters against 236. One character decided whether a live lane's entire
     current state could be deleted in silence.
     The fleet check above does not cover it either: that one only asks whether the
     SLUG survived, and an older block keeps the slug alive. This is the exact gap
     this check was written for on 9/13, and it was open on the longest-running lanes.

     THE MARKER IS AN ARBITRARY TAG THE LANES INVENT and the gate has no business
     constraining its shape, so it now accepts any parenthesised run with no space
     in it. The slug is the discriminator; it always was.

     AND THE SLUG CLASS REQUIRED A HYPHEN, which hid 118 more heads. MEASURED rather
     than assumed, because EYES called them history and history is exactly what the
     9/13 incident ate (80 blocks):
       hyphen-less slugs, newest head each: f3eu53 8/26, 0lurbs 8/11, 1eztay 8/9,
       7h9sfy 8/6, factions 8/2, xk7pjp 8/2, e2r7sv 8/1, eak241 8/1
       the live lanes, for comparison: words-8dqrnq 9/24, sound-xk7pjp 9/23
     EYES was right that they are all history. They are still 118 real block heads
     this check claims to hold and does not, so they are now held. The archive escape
     above already covers [handoff cut] removing them on purpose.
     THE NOISE THE ORIGINAL TIGHTENING WAS BUILT TO REJECT STAYS REJECTED, and the
     separation is measured, not picked: every real hyphen-less slug is 6 to 8
     characters (f3eu53, factions), every prose token is 1 to 2 (a, b, c, d, e, 03).
     Nothing lives between 2 and 6, so the floor of 5 has room on both sides. */
  const SLUG = '[a-z0-9]+(?:-[a-z0-9]+)+|[a-z0-9]{5,}';
  const HEADRE = new RegExp(
    '^[A-Z][A-Z +\\/&-]*\\((?:' + SLUG + ')\\):\\s+\\S+(?:\\s+\\([^)\\s]+\\))?\\s+LATEST', 'gm');
  const headsOf = (t) => new Set((t.match(HEADRE) || []).map(x => x.trim()));
  const headNow = headsOf(text);
  let headWas = new Set();
  try {
    headWas = headsOf(execFileSync('git', ['show', 'HEAD:' + NAME],
      { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 }));
  } catch (e) { /* nothing to compare against */ }

  let archived = '';
  try {
    const dir = path.join(ROOT, 'archive', 'handoffs');
    for (const f of fs.readdirSync(dir)) archived += fs.readFileSync(path.join(dir, f), 'utf8');
  } catch (e) { /* no archive yet, which is the state today */ }

  const droppedHeads = [...headWas].filter(x => !headNow.has(x) && !archived.includes(x));
  ok('NO LANE LOST ITS NEWEST BLOCK: all ' + headWas.size + ' block head(s) HEAD carries are '
    + 'still here (or are in archive/handoffs/). One commit written from a stale read deleted '
    + 'THREE lanes\' current state on 9/13 and neither check above could see it, because no lane '
    + 'vanished and the loss was 0.26% of the bytes',
    droppedHeads.length === 0,
    droppedHeads.length ? 'LOST: ' + droppedHeads.slice(0, 6).join(' | ') : headNow.size + ' here now');

  /* and the blunt one, because a lane can survive as a one-line stub while the
     rest of its history is gone. 8/27's truncation was 99.9% of the bytes. */
  const wasBytes = execFileSync('git', ['show', 'HEAD:' + NAME],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 }).length;
  const keptPct = wasBytes ? Math.round(text.length / wasBytes * 100) : 100;
  ok('and it did not lose the bulk of itself in one write (' + keptPct + '% of HEAD\'s '
    + wasBytes + ' bytes; this file only ever grows)', keptPct >= 80);
} else {
  ok('no HEAD copy to compare the fleet against (first commit, or not a checkout) '
    + '-- ' + now.size + ' lane(s) present', now.size > 0);
}

/* ======================================================================
   A CONFLICTED FILE NEVER REACHES MAIN (9/24, PLUMBER, row [no markers]).

   It happened TWICE in one round on the one file Paolo had already complained
   about: a rebase resolver threw, `git add` staged the vote registry WITH THE
   MARKERS, `rebase --continue` committed it, and his VOTE tab was unparseable on
   main. The leg that was here caught the second one AFTER the push, in another
   lane's round.

   *** AND IT COULD NOT HAVE CAUGHT A CONFLICT IN THE ALPHA AT ALL. *** The old
   sweep skipped any file over 4 MB, with the comment "the 34MB alpha, not text to
   diff". The alpha is 5 MB. So is the demo. RUN_CURRENT is 22 MB. THE HANDOFF
   ITSELF IS 7 MB. Every one of them was exempt from the check written to protect
   them. PROVED, not argued: a real unresolved merge planted at the alpha's <body>
   left the gate at 8 PASSED, 0 FAILED, EXIT 0.
   The skip bought nothing. `git grep` over the WHOLE tree, the four 45 MB tile
   banks included, is 0.31 SECONDS, so the candidates are found by git and only
   those few files are ever read.

   AND THE RULE IS STRUCTURAL, NOT A WORD SEARCH. Measured across 4,879 tracked
   text files: "any line starting <<<<<<< or >>>>>>>" hits ONE file, and it is a
   record QUOTING this exact bug (the 8/27 write-up of a marker rendering on the
   front splash). A check that goes red on a document describing the failure is a
   check the fleet switches off. A real conflict is an ORDERED TRIAD -- `<<<<<<< x`
   then a line that is exactly `=======` then `>>>>>>> y` -- and on this tree that
   rule finds ZERO. It separates the two cleanly with nothing in between. */
const START = /^<<<<<<< \S/, MID = /^=======$/, END = /^>>>>>>> \S/;

function hasRealConflict(body) {
  let state = 0;                       /* 0 nothing, 1 saw start, 2 saw the middle */
  for (const line of body.split('\n')) {
    if (START.test(line)) { state = 1; continue; }
    if (MID.test(line)) { if (state === 1) state = 2; continue; }
    if (END.test(line)) { if (state === 2) return true; state = 0; }
  }
  return false;
}

ok('THE HANDOFF CARRIES NO UNRESOLVED MERGE', !hasRealConflict(text));

/* and nowhere else either: a conflicted law, record, slice or workflow is the same
   failure with a different blast radius. NO EXTENSION LIST and NO SIZE LIMIT --
   both were holes, and git does the expensive part. */
let candidates = [], swept = 0;
try {
  swept = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 })
    .split('\n').filter(Boolean).length;
  candidates = execFileSync('git',
    ['grep', '-l', '-I', '-E', '^(<<<<<<< |>>>>>>> )', '--', '.'],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 })
    .split('\n').filter(Boolean);
} catch (e) {
  /* git grep exits 1 when NOTHING matches, which is the good case. Anything else
     (not a checkout) leaves candidates empty and the handoff leg above still stands. */
}

const conflicted = [];
for (const f of candidates) {
  let body;
  try { body = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
  if (hasRealConflict(body)) conflicted.push(f);
}
ok('NO TRACKED FILE CARRIES AN UNRESOLVED MERGE, the alpha and the demo included ('
  + (conflicted.length ? conflicted.join(', ') : swept + ' files swept, '
     + candidates.length + ' carried a marker line, none was a real conflict') + ')',
  conflicted.length === 0,
  conflicted.length ? 'a rebase resolver threw and the commit went out anyway. Open each '
    + 'file, resolve it, and do not `git add` a file you have not looked at.' : '');

/* ---- AND EVERY JSON THE GAME LOADS MUST PARSE ------------------------------
   The markers were only how it broke that time. What actually reached his phone
   was a file the VOTE tab could not read, and A STRAY COMMA DOES THE SAME DAMAGE
   WITH NOTHING TO GREP FOR. The published surface is slices/ + engine/ +
   records/target (_config.yml), so those are the files a bad one actually
   reaches him through. */
let jsons = [];
try {
  jsons = execFileSync('git', ['ls-files', 'records/target/*.json', 'slices/*.json',
    'engine/*.json'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 })
    .split('\n').filter(Boolean);
} catch (e) { /* not a checkout */ }

const broken = [];
for (const f of jsons) {
  try { JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); }
  catch (e) { broken.push(f + ' (' + String(e.message).slice(0, 60) + ')'); }
}
ok('EVERY JSON ON THE PUBLISHED SURFACE PARSES ('
  + (broken.length ? broken.join(' | ') : jsons.length + ' checked') + ')',
  broken.length === 0,
  broken.length ? 'his VOTE tab reads one of these. A file that does not parse is '
    + '"THE LIST DID NOT LOAD" on his phone, which is where we found out last time.' : '');

console.log('\n=== HANDOFF GATE: ' + pass + ' passed, ' + fail + ' failed ===');
console.log('    the one file every session reads first is readable.');
if (fail) process.exit(1);
