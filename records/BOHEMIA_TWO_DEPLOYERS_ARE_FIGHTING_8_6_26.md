# BOHEMIA — TWO DEPLOYERS ARE FIGHTING, AND THE PREDICTION WAS ALREADY WRITTEN DOWN
### 8.6.26 — found by the FACTIONS lane while verifying its own deploy. Not my lane, not my fix. Written down because nobody can see this from inside a single lane, and the next session will otherwise repeat it.

---

## THE MEASUREMENT

The last 30 Pages runs on this repo:

```
pages build and deployment   cancelled  18
pages build and deployment   failure     5
pages build and deployment   (queued)    2
pages                        failure     3
pages                        cancelled   2
------------------------------------------
SUCCESS                                  0
```

**Zero.** Not one build has reached the finish line in the last thirty runs. The last
recorded success was `c8cf238`, 8/5.

Meanwhile every lane's push worked, every lane's gates went green, and every lane
believed it had shipped. That is the whole disease: *the push working is not the site
working*, and no lane can see it from inside its own turn.

## WHY IT GOT WORSE TODAY, AND THE PART THAT STINGS

`records/BOHEMIA_THE_DEPLOY_IS_WEDGED_AND_ONE_RUN_IS_MINE_8_6_26.md` (COMBAT lane,
earlier today) contains this heading, verbatim:

> **AND DO NOT ADD A CUSTOM .github/workflows/pages.yml TO "FIX" IT.**

...followed by the exact reasoning: a custom workflow using `actions/deploy-pages`
**fails on every run** unless the Pages source is switched from "Deploy from a branch"
to "GitHub Actions" in repo Settings, which no session can set. And then, verbatim:

> Shipping that workflow without the settings change would turn an intermittent
> outage into a permanent one.

`.github/workflows/pages.yml` was added at **20:44 today**, after that was written.

**Both deployers now fire on every push.** Confirmed on my own commit `2810d89`: the
push at 21:58 triggered `pages build and deployment` — GitHub's built-in builder, which
only runs when the source is still set to a branch. It was cancelled at 22:13. The
custom `pages` workflow's own runs at 20:29, 20:58 and 21:11 all ended failure or
cancelled, including one that ran fifteen minutes and was cancelled anyway **despite
declaring `cancel-in-progress: false`** — because the concurrency setting cannot protect
it from a second deployer contending for the same `github-pages` environment.

The new workflow is not wrong. `concurrency: {group: pages, cancel-in-progress: false}`
is genuinely the right shape for a repo with this many lanes, and the docstring in it is
correct about the deadlock it was built to break. **It is simply inert until the settings
change lands, and until then it is a second fighter in the ring.**

## THE TWO CLICKS, AND ONLY PAOLO HAS THEM

Neither is a code change. No session can do either one.

1. **Settings → Pages → Source: "GitHub Actions"** (currently "Deploy from a branch").
   This is the one that matters. It stops the built-in builder from firing, which ends
   the cancellation war AND makes the new `pages.yml` able to succeed at all.
2. If a run is still wedged, cancel it in the web UI — the UI can force states the API
   refuses. The COMBAT record has the specific run link.

Doing (1) alone should clear both problems at once.

## WHAT NO LANE SHOULD DO ABOUT IT

Carried forward from the COMBAT record because it is still correct, and because I
followed it tonight rather than making it worse:

- **DO NOT keep pushing to force a deploy.** Every push contends for the environment.
  A push storm is indistinguishable from the outage itself.
- **DO NOT re-run a failed Pages job.** That is what wedged the last one.
- **DO NOT delete or "fix" the other lane's `pages.yml`.** It is the right fix waiting on
  its prerequisite. Ripping it out is a second lane overwriting a first lane's judgement
  on a file neither of them owns. Flag it; do not adjudicate it.

## THE TRANSFERABLE LESSON

A written warning in a record is not a gate. The COMBAT lane predicted this exact
failure, in plain words, in a file on main, hours before it happened — and it happened
anyway, because *nothing in the machine could read that sentence*. This repo's own first
law says it: A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.

`gates/pages_publish_gate.js` asserts `cancel-in-progress: false` is present in the
workflow and prints **"the deploy queues, never cancels."** That claim was true about the
file and false about the world — 18 cancellations sat in the run history while the gate
said it green. **A gate that reads the config but never the outcome is measuring the
intention, not the result.** The honest version of that check has to look at whether a
build has actually concluded SUCCESS recently, which is exactly the "VERIFY ON THE REAL
SURFACE" law applied to shipping instead of to art.

That gate belongs to whichever lane owns the deploy, so I have not touched it. Naming it
is the contribution.

---
*BOHEMIA — Two Deployers Are Fighting — 8.6.26*
*The push working is not the site working. It never was, and now there are two of them not working.*
