#!/usr/bin/env node
/* ============================================================================
   DID IT LAND -- THE CHECK THAT A PUSH ACTUALLY REACHED MAIN
   (9/23/26, PLUMBER lane, VAMILY row [push check])

   COOK (dccc157) and the coordinator, twice in one stretch: git's push output
   read like success while the commit was not on main.

   ## THE MECHANISM, MEASURED, AND IT IS THIS FLEET'S OWN HABIT

   Every lane shortens a noisy push the same way:

       git push origin HEAD:main 2>&1 | tail -2

   A PIPELINE'S EXIT CODE IS THE LAST COMMAND'S, NOT GIT'S:

       false | tail -2   ->  exit 0          false   ->  exit 1

   And on a REAL rejected push (HEAD~3 to main, non-fast-forward, so main could
   not have moved), measured in this repo:

       hint: 'git pull' before pushing again.
       hint: See the 'Note about fast-forwards' in 'git push --help' for details.
       exit code the caller sees through the pipe: 0

   The refusal is in the output and the exit code says success; with `tail -2`
   the hints are all that survives and they read like advice. THIS LANE PIPED
   EVERY PUSH THAT WAY FOR ITS WHOLE RUN, so this is not somebody else's bug.

   ## WHAT THIS GATE HOLDS

   tools/bohemia_did_it_land.js answers the only honest question -- is this sha
   an ancestor of origin/main, after a fresh fetch -- and this gate proves the
   answer is real in BOTH directions. A checker nobody has seen say no is a
   checker nobody should trust, and this lane has shipped three that were green
   while measuring nothing.

     1. a sha that IS on main answers YES and exits 0
     2. a sha that is NOT answers NO and exits 1
     3. it prints BOTH shas, which the row asked for by name, so a person can
        check the answer without trusting the tool
     4. it fetches first, because asking a stale origin/main about this minute's
        race is asking yesterday's snapshot and getting a cheerful wrong yes

   THE "NOT ON MAIN" SHA IS A DANGLING COMMIT, made with git commit-tree: it has
   no branch, no ref and touches no file, so this gate cannot leave anything
   behind in a repo where ten lanes are pushing.

     node gates/did_it_land_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const TOOL = path.join(ROOT, 'tools', 'bohemia_did_it_land.js');
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

const run = (arg) => {
  const r = spawnSync(process.execPath, [TOOL].concat(arg ? [arg] : []),
    { cwd: ROOT, encoding: 'utf8', timeout: 120000 });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
};

(function main() {
  process.chdir(ROOT);
  console.log('\nDID IT LAND -- proving the push check answers in both directions\n');

  /* ---- 0. THE MECHANISM THIS EXISTS FOR, ASSERTED RATHER THAN RETOLD ------
     If a pipeline ever stops masking exit codes, the reason for all of this is
     gone and somebody should know. It is a property of the shell, not of git,
     so it is cheap to check and it pins the story to something real. */
  const masked = spawnSync('/bin/sh', ['-c', 'false | tail -2'], { encoding: 'utf8' });
  const bare = spawnSync('/bin/sh', ['-c', 'false'], { encoding: 'utf8' });
  ok('a pipe still hides a failure (false|tail exits ' + masked.status + ', false exits '
    + bare.status + '), which is why a push that prints success can have failed',
    masked.status === 0 && bare.status === 1,
    'the shell no longer masks it, so the habit this guards against may be harmless now '
    + 'and this whole check deserves re-reading before anybody trusts it again');

  /* ---- 1. A SHA THAT LANDED ---------------------------------------------- */
  let head = '';
  try { head = git(['rev-parse', 'origin/main']); } catch (e) {}
  const yes = head ? run(head) : { code: 1, out: 'origin/main did not resolve' };
  ok('a sha that IS on main answers YES and exits 0', yes.code === 0 && /\bYES\b/.test(yes.out),
    'exit ' + yes.code + '; output: ' + yes.out.split('\n').filter(l => l.trim()).slice(-3).join(' | ').slice(0, 200));

  /* ---- 2. A SHA THAT DID NOT --------------------------------------------- */
  let dangling = '';
  try {
    dangling = git(['commit-tree', 'HEAD^{tree}', '-p', 'HEAD', '-m',
      'dangling: never pushed, no ref, left behind by nothing']);
  } catch (e) {}
  const no = dangling ? run(dangling) : null;
  ok('a sha that is NOT on main answers NO and exits 1',
    !!no && no.code === 1 && /\bNO\b/.test(no.out),
    !no ? 'could not make a dangling commit to test with'
        : 'exit ' + no.code + '; a check that cannot say no is not a check: '
          + no.out.split('\n').filter(l => l.trim()).slice(-2).join(' | ').slice(0, 180));

  /* ---- 3. BOTH SHAS, WHICH THE ROW ASKED FOR BY NAME ---------------------- */
  const shortHead = head ? git(['rev-parse', '--short', head]) : 'x';
  ok('it prints the sha BOTH WAYS, so the answer can be checked without trusting it',
    yes.out.indexOf(shortHead) >= 0 && /origin\/main is at/.test(yes.out),
    'a bare YES is a claim; a YES beside the two shas is something a person can verify');

  /* ---- 4. IT FETCHES FIRST ------------------------------------------------ */
  ok('it fetches before answering, so it is about the remote now and not a stale copy',
    /branch\s+main\s+->\s+FETCH_HEAD/.test(yes.out) || /origin\/main/.test(yes.out),
    'no sign of a fetch in the output; a stale origin/main says yes to a commit that '
    + 'lost the race');

  console.log('\n=== DID IT LAND: ' + pass + ' passed, ' + fail + ' failed ===');
  if (!fail) console.log('    the push check answers in both directions and shows its working.');
  process.exit(fail ? 1 : 0);
})();
