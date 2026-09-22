# THE DEPLOY STOPPED SEVEN AND A HALF HOURS AGO AND THE WAY WE FOUND OUT WAS HIS PHONE

PLUMBER lane, VAMILY row [list loads], 9/22/26. First line of this lane.

PAOLO 9/22 opened the alpha's VOTE tab and got **THE LIST DID NOT LOAD** -- a 404 on the
vote registry. Rule 14(d): a tab that promises a list and shows an error is the worst bug
in the game.

## THE COORDINATOR FOUND TWO BUILDERS RACING. MEASURED, IT IS WORSE THAN A RACE.

Off the Actions API, on the `pages` workflow:

    run 2308  08:33:55  cancelled        run 2312  08:34:31  cancelled
    run 2309  08:34:01  cancelled        run 2313  08:34:58  cancelled
    run 2310  08:34:10  cancelled        run 2314  08:35:15  cancelled
    run 2311  08:34:18  cancelled        run 2315  08:35:49  cancelled

    LAST SUCCESSFUL DEPLOY: run 2306, 01:03:25, cf848a7 -- 455 MINUTES EARLIER

Nine in a row, and **every one of them had ZERO JOBS.** They were cancelled before a
runner ever picked them up. Each one's cancel time is the next one's create time to the
second: 2314 cancelled at 08:35:50, 2315 created at 08:35:49.

## THAT IS NOT `cancel-in-progress` FAILING

`concurrency` keeps at most **ONE run PENDING** per group, and a newer push supersedes it.
`cancel-in-progress: false` protects a run that is **RUNNING**. None of these ever started.

After he voted, every lane claimed its rows at once and the pushes came every 10 to 40
seconds. The pending slot was overwritten before a runner was ever free, so the chain
never settled and nothing deployed.

**This is the 8/6 deadlock back in a new form.** That record measured a 13-minute cadence
and called it a standing deadlock rather than a delay. The claim storm made the cadence
ten seconds.

## AND THAT IS WHY HIS REGISTRY 404ED

While our builder is stuck in that loop, GitHub's own Jekyll builder fires on the same
pushes and succeeds in about eighty seconds. The Jekyll build publishes **no `records/`
and no `*.json`**. So the live site becomes purely Jekyll's, and the file the VOTE tab
fetches is simply not there.

It is not that Jekyll occasionally wins a race. During a storm, **ours never enters it.**

## THE MEASURED FIX, AND IT IS IN THIS LANE

Of the last 60 commits on main, **35 (58%) changed nothing that is published** -- almost
all of them VAMILY.md board edits. Every one of those was rebuilding and re-deploying an
identical site, and worse, flushing the queue on its way past.

The workflow now builds only when a published path changes:

    slices/**   engine/**   records/target/**   _config.yml
    .github/workflows/pages.yml   tools/bohemia_cut_the_demo.js

That cuts the trigger rate by more than half and lets the queue settle. The cutter and the
registry are both in the list, so a real change still deploys; a board edit does not.

**THE REAL FIX IS STILL ONE CLICK OF PAOLO'S**: Settings -> Pages -> Source: GitHub
Actions, which stops the Jekyll builder existing at all. That is asked and it is his. This
makes the storm survivable until then.

## THE GATE, BECAUSE THIS WAS INVISIBLE FOR SEVEN HOURS

`gates/the_live_site_is_current_gate.js`, in the suite as LIVE SITE CURRENT. It reads the
Actions API and goes red on three things:

    the last successful deploy is older than 45 minutes      (455 when written)
    most recent runs are being cancelled in the queue        (8 of 12 when written)
    GitHub's own builder is still firing at all              (10 runs that day)

The third stays red on purpose until Paolo's click. The race is real and hiding it is
exactly how he ended up finding it on his phone.

**WHAT IT CANNOT DO, SAID OUT LOUD:** this container's egress policy blocks
paolosarn.github.io (measured: HTTP 000, connect rejected), so the gate never fetches the
live site and never claims to. The live-URL check belongs where it already is -- the
post-deploy leg in the workflow, on GitHub's own runner, which fails the deploy on
anything but 200.

**FLOOR:** if the API cannot be read, the gate FAILS rather than skipping. A deploy gate
that passes because it could not look is the loudest possible form of green over nothing.

## A GATE THAT WAS PRINTING A REASSURANCE IT NEVER CHECKED

`pages_publish_gate.js` ended every run with "the deploy queues, never cancels". It never
tested that; it carried the sentence from the 8/6 commit message. Nine cancelled runs say
it is false.

A gate that prints a reassurance it does not check is worse than one that prints nothing,
because it is read as a measurement. It now says what it actually holds and points at the
gate that measures the deploy.

## AND THE 8/6 "NOISE" LINE, CORRECTED WHERE THIS LANE WROTE IT

`BOHEMIA_THE_LINK_IS_NOT_TRUE_8_6_26.md` told the next session that GitHub's built-in
builder was "noise now, not a symptom" and to stop reading it. True when written; false
since about 9/21.

A line that tells the next session to **STOP LOOKING** at something is the most expensive
kind of line to leave rotting. An ordinary stale line gets contradicted by the next
measurement. A "do not look here" line removes the measurement that would have
contradicted it.

Corrected in place. Its sibling, `BOHEMIA_TWO_DEPLOYERS_ARE_FIGHTING_8_6_26.md`, had it
right on 8/6 -- "both deployers fire on every push", "only runs when the source is still
set to a branch" -- and nobody read it for six weeks. That one gets the forward pointer
rather than a correction.

## THE GATE CAUGHT ITSELF LYING BEFORE IT SHIPPED, AND THAT IS THE BEST PART OF THE ROUND

Two runs of `the_live_site_is_current_gate.js`, three minutes apart, same code, same tree:

```
run A   last successful deploy: run #2166, ff62222, 1954 min ago
        of the last 12 completed runs, 0 were cancelled
        === 1 passed, 3 failed ===

run B   last successful deploy: run #2317, 74994fa, 4 min ago
        of the last 12 completed runs, 10 were cancelled
        === 2 passed, 2 failed ===
```

Run B is the truth. Checked by hand against the Actions API and against `git log`
(74994fa is on main; run 2317 concluded SUCCESS at 08:41:50). **Run A was a
thirty-two-hour-old response**, and it did not look like an error for one second. It
printed a run number, a sha and an age, in exactly the shape of the true line, and it said
the opposite about the one thing this gate exists to report.

This endpoint answers with `Cache-Control: private, max-age=60, s-maxage=60`, so anything
between this container and GitHub is allowed to answer from a store, and something did.

**This is the same shape as [push check] and [driver says], for the third round running:**
a tool returning a believable wrong number with no error, where the wrongness is invisible
because the output is well formed. The pipe that ate a push's exit code, the driver that
opened the demo when asked for the alpha, and now a deploy gate reading a day-and-a-half-old
answer. None of the three threw. All three printed something a person would quote.

THE FIX IS NOT `no-cache` ALONE. Asking politely for a fresh copy is not the same as knowing
you got one, and a gate whose correctness rests on a request header nobody verifies is the
same bug wearing a different coat. So the gate asks for fresh **and then makes the response
prove it**, from the response's own `Date` header (which a cache copies from the original),
plus `Age` where a cache sets it. It refuses anything it cannot date.

The bar is FIFTEEN MINUTES, not one, on purpose: the container clock and GitHub's can differ
by seconds to minutes, and a gate that goes red for clock skew teaches the fleet to ignore
it. Fifteen minutes sits far inside the forty-five-minute staleness bar this gate enforces,
and the failure it was built to catch was 1,954 minutes.

MUTATION-CHECKED BOTH WAYS, exit codes read without a pipe:

| mutation | result |
|---|---|
| tolerance forced below any real age | FAIL on the floor leg, exit 1, **zero** deploy numbers printed |
| the Date header hidden from the proof | FAIL on the floor leg, exit 1, "refuses a number it cannot date" |
| restored | 2 passed, 2 failed, exit 1 (red on purpose, see below) |

The important property is the third column of row one: **when it cannot prove the answer is
fresh it prints no number at all.** A refusal is a thing a person acts on. A believable
wrong number is a thing a person repeats.

## WHERE THE DEPLOY ACTUALLY STANDS AT THE END OF THIS ROUND

The storm broke on its own while this round was being written. Runs 2307 and 2316 and 2317
concluded SUCCESS between 08:33 and 08:42, so the site is current again and his VOTE tab
should load. 10 of the last 12 completed runs were still cancelled in the queue, so the
mechanism that caused it has not gone anywhere, which is why that leg stays red.

The paths filter shipped this round cuts the trigger rate by more than half, measured on
real history. It makes the storm survivable. It does not make it impossible.

**The thing that makes it impossible is one click and it is Paolo's: Settings -> Pages ->
Source: GitHub Actions.** Until then two builders publish this site and whichever finishes
last wins, and the one that keeps winning during a storm publishes no `records/` and no
`*.json`.
