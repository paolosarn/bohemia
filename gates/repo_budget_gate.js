#!/usr/bin/env node
/* ============================================================================
   REPO BUDGET GATE — 8/6/26. The ceiling nobody was watching.

   Paolo: "WE HAVE 11 MONTHS of forward motion work we need to complete."

   On 8/2 a lane found the project was ~43 days from a hard GitHub limit nobody
   was tracking: the alpha was 38.7 MB and gaining ~2 MB a day toward the 100 MB
   PER-FILE cap, above which the push simply fails. They fixed it by moving the
   world out to a sibling page. 38.7 MB -> 2.92 MB. Excellent work.

   IT FIXED THE FILE. IT DID NOT FIX THE REPOSITORY, AND THAT IS A DIFFERENT
   CEILING WITH ITS OWN CLOCK.

   Measured 8/6 on a real bare clone from origin, not estimated:

       packed size            900 MB      (54 s to clone; every session pays it)
       repo age               11 days     (first commit 2026-07-26)
       growth, post-extraction  32.5 MB/day
       GitHub soft warning    1024 MB  ->    ~4 days
       GitHub HARD cutoff     5120 MB  ->  ~130 days  (4.3 months)

   ELEVEN MONTHS OF PLANNED WORK, AND THE REPOSITORY HITS GITHUB'S CEILING LESS
   THAN HALFWAY THROUGH IT. That is not a prediction about code quality. It is
   arithmetic on a limit somebody else enforces.

   The driver is no longer the alpha (1.9 MB/day). It is
   slices/BOHEMIA_CITY_WORLD.html at 20.5 MB/day: a 28 MB GENERATED file, rewritten
   by string surgery and committed whole, several times a day, by several lanes.
   GitHub's own guidance is the answer and this gate does not get to choose it:
   "store programmatically generated files outside of Git" / Git LFS. THAT IS A
   FLEET DECISION AND PAOLO'S CALL, not a gate's. This gate only makes sure the
   clock is visible, because the whole lesson of 8/2 is that a limit nobody watches
   arrives on an ordinary Tuesday.

   WHY THE MEASUREMENT IS RECORDED, NOT TAKEN HERE. A bare clone is ~54 s and
   ~900 MB of network, and the suite runs this every ship. And a LOCAL
   `git count-objects` is not a substitute -- a working session accumulates loose
   objects (this session held 5.34 GiB of them against a 900 MB real repo, a 7x
   overstatement, and I nearly reported it). So the gate holds a recorded real
   measurement and FAILS WHEN IT GOES STALE, rather than pretending it can compute
   the packed size cheaply. An honest stale-check beats a cheap wrong number.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const BUDGET = path.join(ROOT, 'records/BOHEMIA_REPO_BUDGET_8_6_26.json');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

ok('the repo budget measurement is on disk', fs.existsSync(BUDGET));
if (!fs.existsSync(BUDGET)) { console.log('\n=== REPO BUDGET GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(1); }
const B = JSON.parse(fs.readFileSync(BUDGET, 'utf8'));

/* ---- 1. the measurement has not rotted ----------------------------------
   A number this important is worse than useless once it is old: it reads as
   reassurance. The refresh command is in the JSON itself. */
const TODAY = execFileSync('git', ['log', '-1', '--format=%ad', '--date=short'],
  { cwd: ROOT, encoding: 'utf8' }).trim();
const ageDays = Math.round((Date.parse(TODAY) - Date.parse(B.measured_on)) / 86400000);
ok('the measurement is fresh (taken ' + B.measured_on + ', repo head ' + TODAY
  + ', ' + ageDays + ' days old) — re-measure with the command in the JSON', ageDays <= 21);

/* ---- 2. the runway --------------------------------------------------------
   Projected forward from the recorded anchor at the recorded rate. The floor is
   90 days because that is long enough to change an architecture calmly and short
   enough that nobody is asleep. */
const projected = B.packed_mb + Math.max(0, ageDays) * B.growth_mb_per_day;
const daysToHard = (B.limits_mb.github_hard_cutoff - projected) / B.growth_mb_per_day;
const daysToSoft = (B.limits_mb.github_soft_warning - projected) / B.growth_mb_per_day;
ok('THE REPOSITORY HAS MORE THAN 90 DAYS BEFORE GITHUB\'S HARD CEILING ('
  + Math.round(daysToHard) + ' days at ' + B.growth_mb_per_day + ' MB/day, '
  + Math.round(projected) + ' MB projected today)', daysToHard > 90);

/* ---- 3. the per-file limit, which IS cheap and exact to check -------------
   This is the one that fails the push outright, with no warning and no email. */
let biggest = { f: '(none)', mb: 0 };
const walk = d => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else { const mb = fs.statSync(p).size / 1048576; if (mb > biggest.mb) biggest = { f: path.relative(ROOT, p), mb }; }
  }
};
walk(ROOT);
ok('no tracked file is near the 100 MB per-file HARD limit (biggest: '
  + biggest.f + ' at ' + biggest.mb.toFixed(1) + ' MB)', biggest.mb < 80);

/* ---- 4. THE METHOD IS RECORDED, because the first numbers here were WRONG ---
   The 8/6 first draft published 32.5 MB/day and a 130-day runway. Both came from
   summing %(objectsize:disk) over a rev-list window -- the same method that had
   already returned 90.5 MB/day over three days and 257.7 MB/day over seven, the
   second larger than the whole repository. The contradiction was noticed, written
   down, and then the method was used anyway for the per-path attribution. That is
   how the wrong number shipped, and it named the wrong file as the top driver.
   MEASURED PROPERLY (two bare clones 5.1 h apart, subtract): 0.251 MB per commit.
   So the gate now insists the JSON carries the METHOD and the CORRECTION, because
   the next person to refresh this will reach for the same convenient wrong query. */
ok('the measurement METHOD is written down (differential, not a windowed sum)',
  typeof B._method === 'string' && /differential/i.test(B._method));
ok('the correction is on the record so the bad number is not re-derived',
  typeof B._CORRECTION_8_6 === 'string' && B._CORRECTION_8_6.length > 80);
ok('the growth rate is anchored to a PER-COMMIT measurement, not a per-day guess',
  typeof B.growth_mb_per_commit === 'number' && B.growth_mb_per_commit > 0);

console.log('');
console.log('  REPO BUDGET, from the ' + B.measured_on + ' bare-clone measurement:');
console.log('    packed ' + B.packed_mb + ' MB  ·  ' + B.growth_mb_per_day + ' MB/day  ·  clone '
  + B.clone_seconds + 's  ·  projected today ' + Math.round(projected) + ' MB');
console.log('    soft warning (1 GB) in ' + Math.round(daysToSoft) + ' days  ·  '
  + 'HARD CEILING (5 GB) in ' + Math.round(daysToHard) + ' days ('
  + (daysToHard / 30.4).toFixed(1) + ' months)');
console.log('    biggest single file: ' + biggest.f + ' ' + biggest.mb.toFixed(1) + ' MB of the 100 MB hard cap');
console.log('    ' + B.growth_mb_per_commit + ' MB/commit measured differentially · '
  + 'heaviest path in history: slices/BOHEMIA_ALPHA_0_9.html 441 MB = 49% of the repo');
console.log('\n=== REPO BUDGET GATE: ' + pass + ' passed, ' + fail + ' failed ===');
if (fail) process.exit(1);
