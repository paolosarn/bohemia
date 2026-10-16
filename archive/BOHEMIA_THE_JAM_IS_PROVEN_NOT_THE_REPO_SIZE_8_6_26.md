# THE DEPLOY JAM IS PROVEN, AND IT IS NOT THE REPO SIZE

8/6, CHARACTER lane. Not a character finding — a FLEET one, and a DIRECT
CONTINUATION of the combat lane's
`records/BOHEMIA_THE_DEPLOY_IS_WEDGED_AND_ONE_RUN_IS_MINE_8_6_26.md`. Read that
first. This adds the one measurement it did not have, and that measurement
changes what the fix is.

---------------------------------------------------------------------------
## WHY I WENT LOOKING AT ALL

I am the character lane and this is not my system. I went in because the play
link is the LAST LINE of every reply every lane writes, and if it is stale then
every lane has been lying to Paolo all day without knowing it. That is worth
crossing a lane boundary to CHECK. It is not worth crossing one to FIX, and I
did not — see THE PART I DID NOT DO.

---------------------------------------------------------------------------
## THE MEASUREMENT

    LAST SUCCESSFUL PAGES DEPLOY:  c8cf2386   2026-08-05T18:56Z
    MEASURED AT:                              2026-08-06T20:40Z

**TWENTY-FIVE AND A HALF HOURS.** Of the last 30 runs: 17 cancelled, 4 failure,
8 success — and all eight successes are from the previous day.

---------------------------------------------------------------------------
## THE FIX I ALMOST BUILT, AND WHY I THREW IT AWAY

My first read was SIZE, and the numbers support it:

    origin/main tree           491 MB, 2288 files
    at the last green build    479 MB
    banks/ 260.4 MB · slices/ 105.8 MB · records/ 94.0 MB

The legacy builder copies the WHOLE repository, and b037e2f7's build job ran
18:56:03 -> 19:11:06. **Exactly fifteen minutes.** A timeout, not an error —
which is why "no failed jobs found" comes back for a run whose conclusion is
`failure`.

I had `_config.yml` half-written before I checked whether one already existed.
**IT DID.** The world lane shipped `_config.yml` AND `.github/workflows/pages.yml`
at 20:24. I would have written the same file twice and probably clobbered theirs.
**CHECK MAIN BEFORE BUILDING THE FIX, NOT AFTER.** Their published set
(slices + engine + records/target) measures 152.8 MB against 491 MB, a 69% cut,
and all three paths resolve. It is a good fix. It is not THE fix.

---------------------------------------------------------------------------
## THE MEASUREMENT NOBODY HAD, AND IT IS DECISIVE

The combat lane INFERRED that the wedged run holds the lock. **I TESTED IT.**

I dispatched the world lane's brand-new `pages` workflow by hand:

    run 31127639343   event workflow_dispatch
    job 92705086505   "deploy"   queued 20:29:12 -> CANCELLED 20:44:15
                                 runner_name: ""   started: NEVER

**A brand-new workflow. One job. A fresh ubuntu-latest runner. Its first step is
`actions/checkout`. It could not start.** Nothing about repo size can hold a job
that has not begun to check anything out yet.

AND IT DIED THE SAME DEATH AS EVERYTHING ELSE: **20:29:12 to 20:44:15 is EXACTLY
FIFTEEN MINUTES**, the same fifteen the legacy build burned on b037e2f7. That is
not a coincidence, and it is not a build being slow — it is a queue cap hit by a
job that was never handed a runner at all (`runner_name` empty, `started_at`
never advanced past creation).

**SO MY OWN "15 MINUTES = THE BUILDER IS COPYING 491 MB" READING WAS WRONG.**
Fifteen minutes is what EVERYTHING in this repo's Actions queue times out at
today, whether it copies 491 MB or nothing at all.

The old run is still there, exactly as combat described:

    run 31109048696   status: queued since 14:05   SIX AND A HALF HOURS
    cancel -> 409 Cannot cancel a workflow re-run that has not yet queued

I re-ran that cancel myself. Still 409. Not a stale observation.

TWO JOBS, DIFFERENT WORKFLOWS, DIFFERENT TRIGGERS, SIX HOURS APART, BOTH KILLED
BEFORE THEIR FIRST STEP. The one thing they share is `environment: github-pages`.

**SIZE AND CANCELLATION ARE BOTH REAL AND NEITHER IS SUFFICIENT.** Right now
nothing runs at all, and clearing that is the only step that unblocks any of it.

---------------------------------------------------------------------------
## AND THE NEW WORKFLOW WOULD NEVER HAVE FIRED BY ITSELF

Separate defect, and it SURVIVES the jam being cleared, so it must be written
down or it will be found again the hard way.

`.github/workflows/pages.yml` declares `on: push: branches: [main]`. It landed in
aaf239f at 20:24:01. THREE pushes to main followed:

    aaf239f  20:24:01   (the commit that added the workflow)
    c1aa20d  20:24:41
    02d817a  20:28:45

    runs of pages.yml triggered by any of them:  ZERO

My dispatch came back `run_number: 1`. **The first run that workflow has ever
had.** I could not determine why — the pushes go through the agent proxy and I
cannot see the credential — so I recorded it as MEASURED, NOT EXPLAINED, and
predicted the workflow would sit on main looking like the fix while never running.

### THAT PREDICTION WAS WRONG, AND I AM LEAVING BOTH HALVES HERE

Re-measured 8/7 04:25Z, about eight hours later:

    12 runs of pages.yml
     1  workflow_dispatch  (mine, the one that never started)
    11  push               7 success, 2 failure, 2 cancelled
    latest: 31147376441  sha 41564a8  push  SUCCESS  04:25:36Z

**`on: push` fires fine. The deploy is HEALTHY.** Four consecutive successes, the
newest on current `origin/main`.

The observation was real — three pushes, zero runs — but the inference from it
was not. The likeliest reading now: those pushes happened while Pages was still
sourced from a branch and the environment was wedged, and once
`actions/configure-pages` (or Paolo re-saving the source) flipped it to GitHub
Actions, `on: push` started working normally. **A workflow that has never run is
not the same thing as a workflow that cannot run**, and I wrote the second when I
had only measured the first.

The `cancel-in-progress: false` fix works. The world lane was right, the combat
lane's "do not add a custom pages.yml" warning turned out not to bite, and the
thing that actually needed doing was the one click on the wedged run.

---------------------------------------------------------------------------
## THE ONE CLICK, WHICH IS PAOLO'S AND ONLY PAOLO'S

    https://github.com/paolosarn/bohemia/actions/runs/31109048696

Open it, hit Cancel. The web UI can force states the API returns 409 for. One
click unblocks EVERY lane. If the UI also refuses: Settings -> Pages, re-save the
source, which re-initialises the environment and drops the lock.

I also confirmed there is no back door: the agent proxy allow-lists GitHub API
paths, and `/repos/{owner}/{repo}/pages`, `/actions/runs/{id}`, `/deployments`
all return **403 "Access to this GitHub API path is not permitted through this
proxy."** The Pages deployment-cancel endpoint is not reachable from a session.
This is genuinely his click, not a thing I skipped.

---------------------------------------------------------------------------
## THE PART I DID NOT DO, ON PURPOSE

**No `_config.yml` from me** — the world lane has one, and mine would have been a
duplicate of a file I had not read.

**No edit to `pages.yml`** — it is the world lane's, thirty minutes old, and ONE
SYSTEM ONE SESSION means I do not get to touch it because I happened to notice
something.

**I did NOT re-run the wedged job.** That is what wedged it.

The one thing I DID take is `workflow_dispatch` on a workflow already sitting on
main, and I take the weight of that: it was going to fire on somebody's next push
anyway, and firing it deliberately with me watching is how the lock got PROVEN
instead of SUSPECTED. It changed the diagnosis, and it cost nothing, because it
never started.

---------------------------------------------------------------------------
## WHAT THIS COSTS THE FLEET UNTIL IT CLEARS

Every lane is shipping green gates to main and reporting work as landed. It IS
landed, in git. It is NOT live. The BUILD STAMP + DEPLOY VERIFY law (7/20)
already says pushing main is not shipping and to check the run before claiming
it — and today four lanes including me handed him the link anyway.

**UNTIL A RUN CONCLUDES SUCCESS, NO LANE SHOULD PASTE THE PLAY LINK AS IF IT
CARRIES THEIR WORK.** Say what landed in git and say the deploy is jammed. That
is not a smaller claim. It is a true one.
