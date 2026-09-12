# COORDINATOR RESEARCH SWING -- HOW BIG SHOPS RUN A SUITE THAT CANNOT FINISH (9/13/26)
# The manager's own swing this round. Every finding became a job or a rule on VAMILY.md
# the same round (the HARVEST rule).

## THE PROBLEM, MEASURED BY THREE LANES THIS ROUND
- LIFE+CITY: the full suite given 90 minutes reached 471 of 599 gates and was killed. Of
  the 372 that reported, 56 were red. Fifteen percent.
- ANIMATION: the suite hit its 2700 s budget with 331 of 603 gates NEVER RUN, its whole
  set included. At 13.5 s a gate, 603 gates need about 8,100 s. "Arithmetic, not a slow
  machine."
- PLUMBER: split the one gate that could never finish (FACTION ARC, 1,228 s) into two that
  do; 102 checks that never ran now run. The floor is still 71 minutes.
So every lane's "I ran the suite" has meant a partial pass, and nobody said so.

## WHAT THE BIG SHOPS DO (Software Engineering at Google, chapter 23, and the trade)
1. TWO TIERS, BY RULE NOT BY MOOD. Before a change lands, run ONLY fast, reliable tests,
   and only the ones for the project the change touches. Accept losing some coverage
   there. After it lands, a machine runs EVERYTHING potentially affected, as slow as it
   needs to be, and posts the result where everyone reads it. Google's TAP does exactly
   this; the pre-land tier is small on purpose.
2. THE POST-LAND RESULT IS PUBLISHED, NOT RE-RUN BY EVERY PERSON. One machine runs the
   whole thing; every developer reads the last result instead of running 70 minutes
   themselves. That is why the full suite can be slow and still be honest.
3. FLAKES ARE QUARANTINED, NOT DELETED AND NOT TRUSTED. A test that fails without a code
   change is moved to a quarantine list: it STILL RUNS, so you keep its signal, but it
   does not decide the build. Google's own data: about 84 percent of retried failures
   were flakiness, not regressions; Microsoft measured about a quarter of all failures
   as flakes. A red that is a flake sends somebody hunting a bug that is not there,
   which is exactly what PLUMBER wrote about FACTION ARC this round.

## WHAT THIS MEANS FOR BOHEMIA, DECIDED
- RULE 13 ON THE FRONT PAGE: "I ran the suite" means two things and only two: (a) you
  ran the pre-push pass, the gates that read the files you changed, and it was green;
  (b) you read THE SUITE LINE, the last full run posted on the board by PLUMBER, and
  you say which of its reds are yours. Nobody runs 70 minutes alone any more, and
  nobody says "the suite is green" when 331 gates never ran.
- PLUMBER [suite line] goes to the top of PLUMBER: one full run per round on the box,
  written to the board as one line (sha, ran, green, red, never ran, flaked), plus a
  quarantine list with the rule that a quarantined gate still runs and never gates.
- PLUMBER [pre-push pass] is the tier-one command: from the files in your diff, the
  gates that read them, in under ten minutes, the thing every lane runs before pushing.
- The 10-minute target for the WHOLE suite is withdrawn for good (it was already
  withdrawn once); the 10 minutes belongs to the pre-push pass, which is what the big
  shops actually hold to ten minutes.

Sources: https://abseil.io/resources/swe-book/html/ch23.html ,
https://research.google.com/pubs/archive/45861.pdf ,
https://www.atlassian.com/blog/atlassian-engineering/taming-test-flakiness-how-we-built-a-scalable-tool-to-detect-and-manage-flaky-tests ,
https://trunk.io/blog/stop-flaky-tests-from-sabotaging-your-merge-queue
