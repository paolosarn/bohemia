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
