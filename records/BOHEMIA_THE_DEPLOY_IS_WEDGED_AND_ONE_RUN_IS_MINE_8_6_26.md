# THE DEPLOY HAS BEEN DEAD FOR FIVE HOURS AND ONE OF THE REASONS IS MINE

8/6, combat lane. This is not a combat finding. It is a FLEET finding, and every
lane is affected, so it lives in records/ rather than in my own thread.

---------------------------------------------------------------------------
## THE STATE, MEASURED

Nothing has published to the live site since roughly 14:00. Every run since:

    b037e2f7  FAILURE    19:26
    d4f11682  FAILURE    18:55
    d4f11682  cancelled  18:25
    47dedea3  cancelled  18:21
    d4664e01  cancelled  18:08
    a5a86e85  cancelled  17:53      <- my v130
    53c82ad7  cancelled  17:50
    6bc728df  cancelled  17:45
    46e32df4  cancelled  17:44
    b09f3abe  FAILURE    17:15
    65a84f96  FAILURE    14:55
    ba913e69  cancelled  14:43

TWO DISTINCT FAILURE MODES, AND ONLY ONE OF THEM IS NORMAL.

**CANCELLED is normal and expected.** GitHub Pages builds one at a time and
cancels whatever is in flight when a newer commit lands. With this many lanes
pushing, most runs get superseded. That has always been true and is not a bug.

**FAILURE is not normal.** Every one of them is the same thing, and I pulled the
logs on two of them from two different lanes' commits:

    Current status: deployment_in_progress
    ##[error]Timeout reached, aborting!
    Canceling Pages deployment...

The BUILD succeeds every time. It is GitHub's Pages DEPLOYMENT service that sits
in `deployment_in_progress` until the action gives up. Nothing in the repo causes
this and nothing in the repo can fix it.

---------------------------------------------------------------------------
## AND THERE IS EXACTLY ONE WEDGED RUN. IT IS MINE.

Swept every run for a non-terminal state. There is precisely one:

    run 31109048696   sha 75ae0248   status: queued   created 14:05

**It has been sitting in `queued` for five and a half hours.** It is the re-run I
triggered at 14:20 after the first timeout, and re-running was my call.

IT CANNOT BE CANCELLED FROM THE API. Every attempt returns:

    409 Cannot cancel a workflow re-run that has not yet queued

That is a documented GitHub state (see community discussion 196717, "Pages
workflows stuck in Queued state and cannot be cancelled"). A wedged run can hold
the `pages` concurrency lock, and everything behind it either queues forever or
times out — which is exactly the pattern above.

**HONEST ABOUT CAUSATION:** the FIRST timeout (75ae024 at 14:18) happened BEFORE
my re-run, so I did not start this. But I very likely made it worse and I am the
one holding the only wedged slot, and that is worth saying plainly rather than
filing this as somebody else's outage.

---------------------------------------------------------------------------
## THE ONE THING THAT CLEARS IT, AND ONLY PAOLO CAN DO IT

Open the run and cancel it in the web UI, which can force states the API refuses:

    https://github.com/paolosarn/bohemia/actions/runs/31109048696

One click. It unblocks EVERY lane, not just combat.

If the UI also refuses, the fallback is Settings -> Pages, where re-saving the
source forces the Pages environment to re-initialise and drops the stale lock.

---------------------------------------------------------------------------
## WHAT NO LANE SHOULD DO ABOUT IT

**DO NOT KEEP PUSHING TO FORCE A DEPLOY.** Every push cancels the run in flight,
so a push storm makes the queue strictly worse and is indistinguishable from the
outage itself. If the site looks stale, check the runs before pushing again.

**DO NOT RE-RUN A FAILED PAGES JOB.** That is what wedged this one. A re-run of
the Pages dynamic workflow can enter a state that cannot be cancelled. If a
deploy times out, wait for the next real commit to carry the content instead —
any later commit on main contains the earlier work anyway.

**AND DO NOT ADD A CUSTOM .github/workflows/pages.yml TO "FIX" IT.** I looked at
this seriously. The canonical GitHub answer is a workflow with
`concurrency: {group: pages, cancel-in-progress: false}` so deploys QUEUE instead
of cancelling, which is genuinely the right shape for a repo with this many
lanes. BUT this repo currently uses the auto-generated `dynamic/pages/
pages-build-deployment` workflow, which means the Pages source is set to "Deploy
from a branch". A custom workflow using `actions/deploy-pages` FAILS on every run
unless the source is switched to "GitHub Actions" in repo Settings — which no
session can set. Shipping that workflow without the settings change would turn an
intermittent outage into a permanent one. It is the right fix and it is
Paolo-gated, not Claude-gated.

---------------------------------------------------------------------------
## THE LESSON, WHICH IS THE SAME ONE AS THE STAMP

I told him twice to "wait for BUILD 8/4d". That was wrong twice over: the deploy
had not landed, AND the build stamp is a single shared field that every lane
overwrites, so main already read 8/4h from somebody else's work. A build number
cannot identify one lane's change in a fleet this size.

**TELL HIM WHAT TO LOOK AT, NOT WHAT NUMBER TO LOOK FOR.** "Your face is in the
fire button with green fluid in it" is checkable by him in one glance and cannot
be invalidated by another session's commit.
