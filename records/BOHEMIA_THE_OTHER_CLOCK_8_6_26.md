# THE OTHER CLOCK: THE REPOSITORY RUNS OUT BEFORE THE PLAN DOES
## 8/6/26. Measured on a real bare clone, not estimated.

> "WE HAVE 11 months of forward motion work we need to complete."
> "Think outside the box."

On 8/2 a lane found this project was **~43 days from a hard GitHub limit nobody
was tracking**: the alpha was 38.7 MB and gaining ~2 MB a day toward the **100 MB
per-file cap**, above which the push simply fails. They fixed it properly — the
world moved to a sibling page, 38.7 MB → 2.92 MB, first load 29× faster.

**That fixed the FILE. The REPOSITORY is a different ceiling with its own clock,
and nobody was watching that one either.**

---

## THE NUMBERS

| | |
|---|---|
| packed size **now** | **900 MB** |
| time to clone it | **54 seconds** — every session pays this at startup |
| repo age | **11 days** (first commit 2026-07-26) |
| growth, post-extraction | **32.5 MB/day** |
| growth, 7-day average | 65.6 MB/day |

| GitHub limit | | runway |
|---|---|---|
| soft warning | 1 GB | **~4 days** |
| **hard cutoff** | **5 GB** | **~130 days — 4.3 months** |
| per-file hard | 100 MB | biggest file 43.5 MB (banks tiles) |

> **ELEVEN MONTHS OF PLANNED WORK. THE REPOSITORY HITS GITHUB'S CEILING LESS THAN
> HALFWAY THROUGH IT.**

That is not an opinion about the code. It is arithmetic on a limit somebody else
enforces.

---

## THE DRIVER IS NO LONGER THE ALPHA

| path | MB/day |
|---|---|
| `slices/BOHEMIA_CITY_WORLD.html` | **20.5** |
| `slices/BOHEMIA_RUN_CURRENT.html` | 3.6 |
| `slices/BOHEMIA_ALPHA_0_9.html` | 1.9 |

The world page is a **28 MB generated file**, rewritten by string surgery and
committed whole, several times a day, by several lanes. Git stores a version each
time. The extraction moved the weight; it did not stop it accumulating.

---

## THE MEASUREMENT ALMOST LIED TO ME, AND THAT IS WORTH RECORDING

My first reading was **`.git` = 6.9 GB** — past the hard cutoff already, alarm
bells. It was wrong.

    loose objects   3,888 objects   5.34 GiB     <- my own session's rebase churn
    packed          8,107 objects   1.47 GiB

A working session accumulates loose objects that no one else ever downloads. The
true number is what a **fresh bare clone** costs: **900 MB**. That is a 7×
overstatement, and I would have reported it as fact one command earlier.

Then the growth rate did it again: the same query said **90.5 MB/day** over three
days and **257.7 MB/day** over seven — the seven-day figure exceeded the entire
repository, which is impossible. Same cause. Only the numbers taken *inside the
bare clone*, where everything is packed and deduplicated, are trustworthy.

**Fifth time this week an instrument nearly produced a false finding.** The rule
that keeps earning its keep: *when two windows of the same measurement disagree,
the instrument is wrong, not the world.*

---

## WHAT COMES AFTER — AND IT IS NOT A GATE'S CALL

GitHub's own guidance for exactly this shape is to **store programmatically
generated files outside of Git**, or use **Git LFS** for large binaries. The
options, with the honest cost of each:

1. **Build the world page at deploy time** instead of committing it. A GitHub
   Action generates it from the engine modules on push. Removes ~20 MB/day at a
   stroke. Cost: the artifact stops being reviewable in a diff, and every lane's
   patch-tool workflow changes.
2. **Git LFS for the generated slices.** Small change to how they are stored, keeps
   the workflow. Cost: LFS has its own quota and every clone needs the extension.
3. **Stop committing intermediates.** Several 43 MB `banks/BOHEMIA_HD_TILE_REPO_*`
   files and the judge/target PNGs are inputs and outputs, not source.
4. **Do nothing and re-measure monthly.** Legitimate — 130 days is real runway, and
   the fleet is mid-flight on other things. It just has to be a *choice*.

**[PENDING Paolo / fleet-wide]** This changes how every lane ships, so no single
lane gets to pick it, and this one is not going to pick it quietly.

---

## THE GATE

`gates/repo_budget_gate.js` (suite: **REPO BUDGET**, 8 claims) makes the clock
visible so it is never found by luck again:

1. the recorded measurement has not gone **stale** (≤ 21 days)
2. the projected runway to the 5 GB ceiling stays **over 90 days** — long enough to
   change an architecture calmly, short enough that nobody is asleep
3. no file approaches the **100 MB per-file hard cap** (cheap and exact)
4. the named growth drivers still **exist**, so the plan is not aimed at a file
   that has moved

It does **not** clone to measure — that is 54 s and ~900 MB every ship — and it
refuses to fake it with a cheap local `git count-objects`, for the 7×-overstatement
reason above. It holds a real recorded measurement and **fails when that goes
stale**. An honest stale-check beats a cheap wrong number.

Mutation-proven: doubling the growth rate → *"60 days at 70 MB/day"*; ageing the
measurement to 65 days → fails **both** the freshness check and, correctly
projecting forward, the runway; renaming a driver → *"a named driver still
exists: slices/GONE.html"*.

---

## THE LIFE LESSON UNDERNEATH (never preached in game)
Everything that kills a project on schedule was on a schedule the whole time.
Nobody was reading it.
