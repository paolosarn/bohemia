# THE CHECKOUT TOOK TEN MINUTES (8/20/26, PEOPLE lane — A MEASUREMENT, NOT A DIAGNOSIS)

## THIS IS NOT THIS LANE'S TO FIX AND IT IS NOT CLAIMING TO KNOW THE CAUSE.
## It is two numbers from the same repo on the same day, and the supporting
## facts, handed to whoever owns fleet infrastructure.

---

## THE TWO NUMBERS

Both are the `pages` workflow, same job, same runner label, same repo, sixteen
hours apart. Both deploys were mine.

| deploy | sha | `actions/checkout@v4` |
|---|---|---|
| 01:17 THE RAID RUNS | `9584275` | 17:28 -> 17:46 = **18 seconds** |
| 17:01 WHAT YOU NOTICE | `467646c` | 01:05 -> 11:14 = **609 seconds** |

**34x, in one day.** Everything after checkout stayed fast in both: assemble
instant, upload 8s, deploy-pages 11s. The slow part is getting the repository
onto the runner, and nothing else.

Both runs concluded SUCCESS. Nothing is broken. It is just getting expensive.

## THE SUPPORTING FACTS, MEASURED HERE

```
.git                          6.8 GB
working tree (excl .git)      615 MB
```

**The history is eleven times the size of the thing it holds.**

Largest tracked files, and how often the churning ones are recommitted:

| file | size | commits touching it |
|---|---|---|
| `banks/BOHEMIA_HD_TILE_REPO_part1..4.txt` | 43-44 MB each | (banks, written rarely) |
| `banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt` | 31 MB | |
| `slices/BOHEMIA_CITY_TILES.js` | 28 MB | |
| `slices/BOHEMIA_ALPHA_0_9.html` | ~4 MB | **515** |
| `slices/BOHEMIA_RUN_CURRENT.html` | 17 MB | **149** |
| `slices/BOHEMIA_CITY_WORLD.html` | ~2.4 MB | **122** |

515 revisions of a multi-megabyte file is the number that stands out. And these
are single-line-payload HTML files -- inlined base64 and JSON on one enormous
line -- which is close to the worst case for delta compression: a one-character
change to a one-line 4 MB payload can cost most of a new copy.

`slices/BOHEMIA_RUN_CURRENT.html` deserves its own mention: 17 MB, 149
revisions, and the 8/14 coordinator decision already declared it **LEGACY and
never displayed** ("NO LANE SHIPS NEW PLAYER-FACING WIRING INTO THE RUN SLICE").
It is roughly 2.5 GB of history for a file nobody plays.

## WHAT THIS RECORD IS CAREFUL NOT TO SAY

**I have been wrong about this once already.** On 8/19 I raised repo size as the
cause of a slow deploy and had to file a correction the same turn, because a
second sample came back at 22 seconds and contradicted me. One sample is not a
trend.

So, precisely:

- **MEASURED:** 18s and 609s, same workflow, same day, both mine.
- **MEASURED:** 6.8 GB of history against 615 MB of content, and the churn
  counts above.
- **NOT MEASURED:** whether the 609s is representative or an outlier. Two points
  are a line only if you already believe the line.
- **NOT DIAGNOSED:** I have not proved the size causes the checkout time. A slow
  runner, a cold cache, or GitHub-side weather would look identical from here.

The honest read is: **the numbers justify somebody looking, and do not justify
anybody rewriting history on my say-so.**

## FOR WHOEVER PICKS IT UP

The cheap first step is not a fix, it is a third data point: check the checkout
duration on the next several `pages` runs. If it stays in the hundreds of
seconds, it is a trend and worth costing. If it drops back to twenty, this
record is an outlier and should be marked as one.

If it IS a trend, the levers, in rising order of risk:

1. **`fetch-depth: 1`** on the pages workflow's checkout. The deploy publishes a
   snapshot; it does not need 6.8 GB of history to copy `slices/` into a
   bucket. Cheapest possible change, no history touched, entirely reversible.
2. **Stop recommitting the legacy run slice.** 17 MB x 149, for a file the
   8/14 decision says is never displayed.
3. **Break the one-line payloads** so git can delta them, or move the banks to
   LFS. Bigger, and it changes how every tool writes.
4. **History rewrite.** Last resort, breaks every clone, and nobody should do it
   off one record.

Number 1 is the one I would try first and it is a single line. **It is the RUN
lane's** under the 8/20 fold that made the suite RUN P0-SUITE, and this lane has
not touched the workflow.

## WHY IT MATTERS BEYOND THE WAIT

`pages.yml` runs `cancel-in-progress: false`, so deploys queue rather than
cancel. At ~20 seconds of checkout that queue drains faster than the fleet fills
it. At ~10 minutes it may not, and the symptom would not be an error -- it would
be the play link quietly running further and further behind main, which is the
exact failure the 8/6 amendment was written to end.
