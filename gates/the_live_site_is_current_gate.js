#!/usr/bin/env node
/* ============================================================================
   IS THE LIVE SITE CURRENT? -- THE DEPLOY THAT STOPPED AND NOBODY SAW
   (9/22/26, PLUMBER lane, VAMILY row [list loads])

   PAOLO 9/22 opened the alpha's VOTE tab on his phone and got
   "THE LIST DID NOT LOAD" -- a 404 on the vote registry. Rule 14(d): a tab that
   promises a list and shows an error is the worst bug in the game.

   ## WHAT IS ACTUALLY HAPPENING, MEASURED OFF THE ACTIONS API

   The coordinator found two builders racing. Measured here, the race is worse
   than intermittent during a claim storm -- OUR BUILDER NEVER LANDS AT ALL:

       run 2308  08:33:55  cancelled        run 2312  08:34:31  cancelled
       run 2309  08:34:01  cancelled        run 2313  08:34:58  cancelled
       run 2310  08:34:10  cancelled        run 2314  08:35:15  cancelled
       run 2311  08:34:18  cancelled        run 2315  08:35:49  cancelled
       last SUCCESS: run 2306, 01:03:25

   Nine in a row, and every one of them had ZERO JOBS -- cancelled before a
   runner ever picked it up. Each one's cancel time is the next one's create
   time to the second (2314 cancelled 08:35:50, 2315 created 08:35:49).

   THAT IS NOT `cancel-in-progress` FAILING. It is what `concurrency` does: at
   most ONE run may be PENDING in a group, and a newer one supersedes it.
   `cancel-in-progress: false` protects a run that is RUNNING; it does nothing
   for a run that never started. The lanes were pushing every 10 to 40 seconds
   after he voted, so the pending slot was overwritten before a runner was ever
   free, and the chain only settles when the pushes stop.

   AND THAT IS WHY THE REGISTRY 404s. While our builder is stuck in that loop,
   GitHub's own Jekyll builder (workflow 314926822) succeeds in ~80 s on every
   push -- and the Jekyll build publishes no records/ and no *.json. So the live
   site becomes purely Jekyll's, and the file the VOTE tab fetches is not there.

   The 8/6 record predicted this at a 13-minute cadence and called it a deadlock.
   The claim storm made the cadence 10 seconds.

   ## WHY THIS IS A GATE AND NOT A FIX

   The real fix is one click of Paolo's: Settings -> Pages -> Source: GitHub
   Actions, which stops the Jekyll builder existing. That is asked and it is his.
   What this lane can do is make the failure IMPOSSIBLE TO MISS: this was
   invisible for seven hours and the way it surfaced was him finding it on his
   phone. A deploy pipe that stops silently is the same shape as every other
   thing this lane has had to fix -- a checker that cannot say no.

   ## WHAT IT CANNOT SEE, SAID OUT LOUD

   This container's egress policy blocks paolosarn.github.io (measured: HTTP 000,
   connect rejected), so this gate CANNOT fetch the live site and never claims to.
   It reads the Actions API, which it can reach. The live-URL check belongs where
   it already is: the post-deploy leg in .github/workflows/pages.yml, which runs
   on GitHub's own runner and fails the deploy on anything but 200.

     node gates/the_live_site_is_current_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const REPO = 'paolosarn/bohemia';
const JEKYLL_WORKFLOW = '314926822';      /* GitHub's own "pages build and deployment" */
const OURS = 'pages.yml';
/* HOW FAR BEHIND IS TOO FAR. A burst legitimately leaves the site a few minutes
   behind while the newest run works through the queue. Normal cadence is a push
   every ~13 minutes and a build takes 2-3, so 45 minutes is about three missed
   cycles: long enough never to fire on ordinary traffic, short enough that he
   cannot be the one who finds out. When this was written the pipe had been stuck
   for SEVEN HOURS. */
const STALE_MINUTES = 45;

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';

/* *** A CACHED ANSWER IS NOT AN ANSWER, AND THIS GATE CAUGHT ITSELF LYING. ***
   Measured 9/22, the round this gate was written. Two runs three minutes apart,
   same code, same tree, same repo:

     run A   last successful deploy: run #2166, ff62222, 1954 min ago
             of the last 12 completed runs, 0 were cancelled
     run B   last successful deploy: run #2317, 74994fa, 4 min ago
             of the last 12 completed runs, 10 were cancelled

   Run B is the truth (checked against the Actions API by hand, and against
   `git log`: 74994fa is on main). Run A is a THIRTY-TWO HOUR OLD response, and
   it did not look like an error for one second. It printed a run number, a sha
   and an age, in the same shape as the true line, and it said the exact opposite
   about the one thing the gate exists to report.

   GitHub sends `Cache-Control: private, max-age=60, s-maxage=60` on this
   endpoint, so anything between here and GitHub is allowed to answer from a
   store, and something did.

   THE FIX IS NOT `no-cache` ALONE. Asking politely for a fresh copy is not the
   same as knowing you got one, and a gate whose correctness rests on a request
   header nobody verifies is the same class of bug as the pipe that ate the push
   exit code (row [push check]). SO: ask for fresh, then MAKE THE RESPONSE PROVE
   IT, and refuse it if it cannot.

   The proof is the response's own `Date` header, which a cache copies from the
   original. Tolerance is 15 MINUTES, not one, ON PURPOSE: the container clock
   and GitHub's can differ by seconds to minutes and this must never go red for
   skew. 15 minutes is far inside the 45-minute staleness bar this gate enforces,
   and the failure it was built to catch was 1,954 minutes. `Age` is checked too
   where a cache sets it. */
const RESPONSE_MAX_AGE_MINUTES = 15;
let apiRefusal = null;          /* set when a response could not prove it was fresh */

function api(p) {
  const hdr = '/tmp/bohemia-livesite-hdr-' + process.pid + '.txt';
  const args = ['-s', '--max-time', '25',
    '-D', hdr,
    '-H', 'Accept: application/vnd.github+json',
    /* ask for fresh. Not trusted; verified below. */
    '-H', 'Cache-Control: no-cache',
    '-H', 'Pragma: no-cache'];
  if (token) args.push('-H', 'Authorization: Bearer ' + token);
  args.push('https://api.github.com/repos/' + REPO + p);
  let body;
  try { body = execFileSync('curl', args, { encoding: 'utf8', maxBuffer: 1 << 26 }); }
  catch (e) { return null; }

  let heads = '';
  try { heads = fs.readFileSync(hdr, 'utf8'); } catch (e) { heads = ''; }
  try { fs.unlinkSync(hdr); } catch (e) { /* nothing to clean up */ }

  /* THE FRESHNESS PROOF. Last Date: wins -- a proxy CONNECT writes its own
     header block first, so the first one is not GitHub's. */
  const dates = heads.split(/\r?\n/).filter(l => /^date:/i.test(l));
  const ages  = heads.split(/\r?\n/).filter(l => /^age:/i.test(l));
  if (!dates.length) {
    apiRefusal = 'the response carried no Date header, so it cannot show when it was '
      + 'made. This gate refuses a number it cannot date.';
    return null;
  }
  const served = Date.parse(dates[dates.length - 1].replace(/^date:\s*/i, '').trim());
  if (!served) {
    apiRefusal = 'the response Date header did not parse: '
      + dates[dates.length - 1].trim();
    return null;
  }
  const behind = (Date.now() - served) / 60000;
  if (behind > RESPONSE_MAX_AGE_MINUTES) {
    apiRefusal = 'the answer is ' + Math.round(behind) + ' MINUTES OLD (its own Date header '
      + 'says ' + new Date(served).toISOString() + '). Something between here and GitHub '
      + 'served it from a store. A stale deploy reading does not look like an error, it '
      + 'looks like a different true answer, so this is a refusal, not a number.';
    return null;
  }
  if (ages.length) {
    const age = parseInt(ages[ages.length - 1].replace(/^age:\s*/i, ''), 10);
    if (age > RESPONSE_MAX_AGE_MINUTES * 60) {
      apiRefusal = 'a cache answered: Age ' + age + ' seconds.';
      return null;
    }
  }
  try { return JSON.parse(body); }
  catch (e) { return null; }
}
const mins = (iso) => (Date.now() - Date.parse(iso)) / 60000;

(function main() {
  process.chdir(ROOT);
  console.log('\nIS THE LIVE SITE CURRENT? (row [list loads]: he got "THE LIST DID NOT LOAD")\n');

  /* ---- THE FLOOR. A gate that cannot see the deploy must not bless it. ---- */
  const ours = api('/actions/workflows/' + OURS + '/runs?per_page=40&branch=main');
  if (!ours || !Array.isArray(ours.workflow_runs)) {
    ok('the Actions API is readable, so this gate can see the deploy at all', false,
      (apiRefusal || (token ? 'the API did not answer' : 'no GH_TOKEN or GITHUB_TOKEN in this environment')).replace(/\.$/, '')
      + '. A deploy gate that passes because it could not look is the loudest form of '
      + 'green over nothing, so this is a refusal, not a skip.');
    console.log('\n=== THE LIVE SITE IS CURRENT: ' + pass + ' passed, ' + fail + ' failed ===');
    process.exit(1);
  }
  ok('the Actions API is readable, so this gate can see the deploy at all', true);

  const runs = ours.workflow_runs;
  const done = runs.filter(r => r.status === 'completed');
  const good = done.filter(r => r.conclusion === 'success');
  const newest = good[0] || null;

  /* ---- 1. HAS ANYTHING DEPLOYED RECENTLY? -------------------------------- */
  if (!newest) {
    ok('at least one `pages` run in the last 40 succeeded', false,
      'none of the last ' + done.length + ' completed runs succeeded. Nothing this lane '
      + 'has pushed is on the live site.');
  } else {
    const age = mins(newest.created_at);
    console.log('  last successful deploy: run #' + newest.run_number + ', '
      + newest.head_sha.slice(0, 7) + ', ' + Math.round(age) + ' min ago');
    ok('the last successful deploy is under ' + STALE_MINUTES + ' minutes old ('
      + Math.round(age) + ' min)', age <= STALE_MINUTES,
      'the live site has not been rebuilt for ' + Math.round(age) + ' minutes. Everything '
      + 'pushed since run #' + newest.run_number + ' (' + newest.head_sha.slice(0, 7)
      + ') is on main and NOT on the site he taps. He should never be the one who finds '
      + 'this out.');
  }

  /* ---- 2. THE BURST SIGNATURE: CANCELLED BEFORE A RUNNER EVER STARTED ---- */
  const recent = done.slice(0, 12);
  const cancelled = recent.filter(r => r.conclusion === 'cancelled');
  console.log('  of the last ' + recent.length + ' completed runs, ' + cancelled.length
    + ' were cancelled');
  ok('most recent runs are not being cancelled in the queue ('
    + cancelled.length + ' of ' + recent.length + ')', cancelled.length < recent.length / 2,
    'a run cancelled with ZERO JOBS never reached a runner: `concurrency` keeps at most '
    + 'ONE pending run per group and a newer push supersedes it. cancel-in-progress:false '
    + 'protects a RUNNING build, not a queued one. While this loop holds, our builder never '
    + 'lands and the live site is whatever GitHub\'s Jekyll builder published -- which '
    + 'carries no records/ and no *.json, which is exactly why the vote registry 404s.');

  /* ---- 3. THE OTHER BUILDER MUST STOP EXISTING --------------------------- */
  const jek = api('/actions/workflows/' + JEKYLL_WORKFLOW + '/runs?per_page=10');
  if (!jek || !Array.isArray(jek.workflow_runs)) {
    ok('GitHub\'s own builder can be seen, so "is it still firing" is answerable', false,
      'could not read workflow ' + JEKYLL_WORKFLOW);
  } else {
    const live = jek.workflow_runs.filter(r => mins(r.created_at) < 24 * 60);
    const wins = live.filter(r => r.conclusion === 'success').length;
    console.log('  GitHub\'s own builder: ' + live.length + ' run(s) in the last day, '
      + wins + ' of them successful');
    ok('GitHub\'s own Jekyll builder is no longer firing (' + live.length + ' runs today)',
      live.length === 0,
      'it fired ' + live.length + ' time(s) in the last day and succeeded ' + wins
      + '. Every success races our deploy for the same site, and the Jekyll build '
      + 'publishes NO records/ and NO *.json, so when it lands last the VOTE tab gets a '
      + '404. THE FIX IS ONE SETTING AND IT IS PAOLO\'S CLICK: Settings -> Pages -> '
      + 'Source: GitHub Actions. Until then this line stays red on purpose, because the '
      + 'race is real and hiding it is how he ended up finding it on his phone.');
  }

  /* ---- 4. AND SAY WHAT THIS GATE CANNOT DO ------------------------------- */
  console.log('\n  THIS GATE DOES NOT FETCH THE LIVE SITE. This container\'s egress policy '
    + 'blocks\n  paolosarn.github.io (measured: HTTP 000, connect rejected), so it reads the '
    + 'Actions\n  API instead and never claims to have seen the page. The live-URL check runs '
    + 'on\n  GitHub\'s own runner, in the post-deploy leg of .github/workflows/pages.yml, '
    + 'which\n  fails the deploy on anything but 200.');

  console.log('\n=== THE LIVE SITE IS CURRENT: ' + pass + ' passed, ' + fail + ' failed ===');
  if (fail) console.log('    the link is not true right now, and that is the point of this gate.');
  process.exit(fail ? 1 : 0);
})();
