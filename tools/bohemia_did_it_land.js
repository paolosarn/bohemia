#!/usr/bin/env node
/* ============================================================================
   DID IT LAND? -- A PUSH THAT SAYS IT WORKED IS NOT A PUSH THAT WORKED
   (9/23/26, PLUMBER lane, VAMILY row [push check])

   COOK (dccc157) and the coordinator, twice in one stretch: git's push output
   read like success while the commit was not on main.

   ## THE MECHANISM, MEASURED, AND IT IS THIS FLEET'S OWN HABIT

   Every lane checks a push the same way, because it keeps the log short:

       git push origin HEAD:main 2>&1 | tail -2

   A PIPELINE'S EXIT CODE IS THE LAST COMMAND'S, NOT GIT'S. Measured here:

       false | tail -2   ->  exit 0          false  ->  exit 1

   And on a real rejected push -- HEAD~3 to main, non-fast-forward, so main
   could not move:

       hint: 'git pull' before pushing again.
       hint: See the 'Note about fast-forwards' ...
       exit code the caller sees through the pipe: 0

   The rejection is right there in the output and the exit code says success.
   With `tail -2` the hints are all you keep, and they look like advice rather
   than a refusal. THIS LANE HAS PIPED EVERY PUSH THAT WAY FOR ITS WHOLE RUN, so
   this is not somebody else's bug to point at.

   ## WHY THE FIX IS NOT "STOP PIPING"

   It would work and nobody would remember. The lanes land on main every few
   minutes, a rebase-and-retry is routine, and the habit that shortens a noisy
   log will come straight back. So the check does not depend on anybody's shell
   discipline: it asks git what is actually on main, after a fresh fetch.

       git merge-base --is-ancestor <sha> origin/main

   That is a question about the remote, not about the last command's mood. It is
   the same containment test CLAUDE.md already requires for Pages deploys, which
   is a second reason to trust it: it has been right in this repo before.

   ## WHAT IT PRINTS

   The sha BOTH WAYS, as the row asked: what you think you pushed, and what main
   is actually at. A YES with two shas can be checked by a person; a bare YES
   cannot.

     node tools/bohemia_did_it_land.js            did HEAD land on main?
     node tools/bohemia_did_it_land.js <sha>      did that land?
     node tools/bohemia_did_it_land.js --branch claude/x   ...and on that branch
   ========================================================================== */
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const git = (args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
const tryGit = (args) => { try { return { ok: true, out: git(args) }; }
  catch (e) { return { ok: false, out: String((e.stderr || e.stdout || e.message)).trim() }; } };

(function main() {
  const argv = process.argv.slice(2);
  const bi = argv.indexOf('--branch');
  const branch = bi >= 0 ? argv[bi + 1] : null;
  const want = argv.filter((a, i) => a[0] !== '-' && (bi < 0 || i !== bi + 1))[0] || 'HEAD';

  console.log('\nDID IT LAND? (row [push check]: a push that says it worked is not a push '
    + 'that worked)\n');

  const sha = tryGit(['rev-parse', want]);
  if (!sha.ok) {
    console.log('  cannot resolve ' + want + ': ' + sha.out.slice(0, 120));
    process.exit(1);
  }
  const short = tryGit(['rev-parse', '--short', want]).out;
  const subject = tryGit(['log', '-1', '--format=%s', want]).out;

  /* THE FETCH IS THE WHOLE POINT. Asking a stale origin/main whether your commit is on it
     is asking yesterday's snapshot about this minute's race, and it will cheerfully say
     yes to something that lost. */
  const targets = ['main'].concat(branch ? [branch] : []);
  const fetched = tryGit(['fetch', 'origin'].concat(targets));
  if (!fetched.ok) {
    console.log('  THE FETCH FAILED, so nothing below would be about the remote:\n    '
      + fetched.out.slice(0, 200));
    console.log('\n  NO -- not confirmed. Do not report this as pushed.');
    process.exit(1);
  }

  let bad = 0;
  for (const t of targets) {
    const remote = tryGit(['rev-parse', 'origin/' + t]);
    if (!remote.ok) {
      console.log('  origin/' + t + ' does not resolve: ' + remote.out.slice(0, 100));
      bad++; continue;
    }
    const remoteShort = tryGit(['rev-parse', '--short', 'origin/' + t]).out;
    const anc = tryGit(['merge-base', '--is-ancestor', sha.out, 'origin/' + t]);
    /* BOTH SHAS, EVERY TIME. A bare YES is a claim; a YES with the two shas beside it is
       something a person can check without trusting this tool. */
    console.log('    ' + (anc.ok ? 'YES' : 'NO ') + '   ' + short + '  ->  origin/' + t
      + ' is at ' + remoteShort);
    if (!anc.ok) {
      bad++;
      const behind = tryGit(['rev-list', '--count', sha.out + '..origin/' + t]).out;
      const ahead = tryGit(['rev-list', '--count', 'origin/' + t + '..' + sha.out]).out;
      console.log('         your commit is NOT on origin/' + t + '. It is ' + ahead
        + ' commit(s) that origin/' + t + ' has never seen, and origin/' + t + ' has '
        + behind + ' your tree has not merged.');
    }
  }

  console.log('\n  "' + subject.slice(0, 72) + '"');
  if (bad) {
    console.log('\n  *** NOT LANDED. Whatever the push printed, this is what the remote says. ***');
    console.log('      Rebase onto the fetched remote and push again, then run this until it');
    console.log('      says YES. And check the push itself WITHOUT a pipe: `git push ... | tail`');
    console.log('      returns tail\'s exit code, not git\'s, so a rejected push reads as success.');
    process.exit(1);
  }
  console.log('\n  landed. Safe to report as pushed.');
  process.exit(0);
})();
