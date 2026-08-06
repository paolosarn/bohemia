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

---

# CORRECTION, SAME DAY: I OVERSTATED THIS BY MORE THAN TWICE

Everything above about **which file** and **how fast** was wrong. The finding —
that the repository ceiling exists, is unwatched, and needed a gate — stands. The
numbers did not.

| | I published | measured properly |
|---|---|---|
| growth | 32.5 MB/day | **0.251 MB/commit → 13.8–27.1 MB/day** |
| runway to 5 GB | 130 days (4.3 months) | **155–305 days (5.1–10.0 months)** |
| top driver | `BOHEMIA_CITY_WORLD.html`, 20.5 MB/day | **`BOHEMIA_ALPHA_0_9.html`, 441 MB = 49% of the whole repo** |

## how the wrong number got out

I summed `%(objectsize:disk)` over a `rev-list` window. **That same method had
already given me 90.5 MB/day over three days and 257.7 MB/day over seven — and I
wrote down, in this very document, that the seven-day figure was larger than the
entire repository and therefore impossible.**

Then I used it anyway for the per-file attribution, because that part *looked*
plausible. **Noticing an instrument is broken and then trusting it for the next
question is worse than never noticing.**

## the only method that works

**Differential.** Bare-clone, wait, bare-clone again, subtract the `size-pack`
numbers, divide by the commits in between:

    899.81 MiB  →  905.58 MiB   =  5.77 MB over 23 commits  =  0.251 MB/commit

Anything else estimates how git *might* pack. Git packs far better than a naive sum
assumes: the world page's whole history is **219 MB raw and 22.7 MB packed**, a 10×
difference, which is exactly the gap between my claim and reality.

## what this does to yesterday's split

The art-bank split is still **correct** and it cost almost nothing — git delta-
compressed the new tiles file against the old page it came out of, which is why 23
commits including it added only 5.77 MB. But it saves ~2.8 MB per world-page commit,
not 20.5 MB/day. **The "about a year of runway" claim is withdrawn.** The runway is
5–10 months and always was.

## and the real weight is unreachable

`BOHEMIA_ALPHA_0_9.html` is **441 MB — half the repository** — from 315 commits of a
file that reached 38.7 MB before it was slimmed. That history is already written.
Reclaiming it means rewriting history, which is not survivable under six parallel
lanes. **The heaviest thing in this repo is a bill that has already been paid and
cannot be refunded.** Everything actionable is about the *rate* from here.

## THE LIFE LESSON UNDERNEATH (never preached in game)
The most expensive mistakes are not the ones you fail to notice. They are the ones
you notice, write down, and then walk past because the next answer looked right.
