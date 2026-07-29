# FINDING — THE DISTRICTS ARE SMALL BECAUSE ONE HALF OF THE GAME NEVER GOT THE 7/6 RULING (7/28/26)

> "im big concerned the districts arent as big as they should be? why do the
>  districts feel so small small? look in the project files and get the correct
>  answer" — Paolo, 7/28

He is right, it is measurable, and the number is **16x**.

---

## THE MEASUREMENT

Read off both live surfaces, same seed, same world:

| | fine cells per district | metres per district | valley across |
|---|---|---|---|
| **THE RUN** (`bohemia_world.js`) | **128 x 128** = 16,384 | **96m x 96m** | **5.73 miles** |
| **THE CITY** (`bohemia_overmap.js`) | **32 x 32** = 1,024 | **24m x 24m** | **1.43 miles** |

**4x linear. 16x area.**

And it is not a zoom difference. Asked to generate the SAME suburb cell (12,4):
- the RUN produces 16,384 tiles carrying **23 house footprints**
- the CITY produces **1,024 fine cells**

The city is not drawing the same neighborhood smaller. It is building a
neighborhood one sixteenth the size.

**24m x 24m is 79ft x 79ft.** That is a single residential lot being asked to
hold an entire district.

The city's whole Las Vegas valley is **1.43 miles across** — smaller than the
real Strip.

---

## WHAT THE LAW SAYS

`laws/BOHEMIA_ADDENDUM_VALLEY_SCALE_LAW_7_6_26.md`, **LOCKED 7/6/26**, and its
title line is explicit:

> **## 1. VALLEY SCALE LAW (LOCKED, revokes the 24m SLOT SCALE LAW of 7/5)**
>
> - 1 overmap cell = ONE NEIGHBORHOOD = **128x128 fine cells** = 8x8 chunks
>   (CHUNK=16) = **96m x 96m**
> - Valley span = 96 x 96m = ~5.7 miles across = Los Santos scale, a 1:4 linear
>   compression of the real 22.9 mi valley (GTA's exact proven ratio)
> - **Constants relocked in bohemia_overmap.js: TILE_FINE=128, SLOT_FINE=128**

And its own completion checklist, line 66:

> 1. bohemia_overmap.js scale constants: **DONE this session (relocked, builds...)**

## WHAT THE FILE ACTUALLY SAYS, 22 DAYS LATER

`engine/bohemia_overmap.js`, lines 16-20 — unchanged:

```js
// SLOT SCALE LAW (LOCKED 7/5/26, supersedes the 240 two-grid model):
// 1 slot = 32x32 fine cells = 2x2 chunks (CHUNK=16) = 24m x 24m at 0.75m/cell
// = ~6,200 sq ft explorable per slot. CDDA precedent: 24x24 per overmap tile,
// big buildings assembled from multiple slots.
const OVER_N=96, TILE_FINE=32, SLOT_FINE=32, CELL_M=0.75, TILE_M=TILE_FINE*CELL_M;
```

**The constants are still 32. The header comment still cites the 7/5 law by
name — the law that the 7/6 ruling explicitly revokes.** The relock the 7/6 law
records as DONE was never done.

## AND IT IS LIVE, NOT A DEAD CONSTANT

In the CITY frame: `const FN = OM.TILE_FINE`, and **`FN` appears 4,812 times**
in that renderer. It is the number the entire city surface is built on.

---

## THE ROOT CAUSE — WHY THIS SURVIVED 22 DAYS

**There are TWO sources of truth for the same number, and only one of them got
relocked.**

- `engine/bohemia_world.js` line 613: `var T = 128;` — **hardcoded**, correct,
  never reads the overmap.
- `engine/bohemia_overmap.js` line 20: `TILE_FINE = 32` — the revoked value,
  and what the city reads.

So the RUN has been right the whole time *by a separate hardcoded constant*, not
by obeying the law. The law changed one file; the other file already happened to
agree with the new answer, so nothing looked broken from the run's side, and
nothing in the repo compares the two.

This is the same shape as the ONE MAP bug I fixed on 7/28 (the city on seed 2026
while the game booted 'bohemia'): **two surfaces, two private copies of a fact
that must be one fact, and no machine comparing them.** That one was a seed.
This one is scale. Same class, same file, same week.

---

## WHY HE FEELS IT NOW AND NOT BEFORE

Another session wired the **RUN tab to open the CITY panel** on 7/28
(`PANEL = (t.dataset.p==='run') ? 'city' : ...`). So when he taps RUN he is now
looking at the 24m surface, not the 96m one. The bug is 22 days old; his
exposure to it is hours old.

---

## WHAT I DID NOT DO

**I did not change the constant.** Flipping `TILE_FINE` 32 -> 128 multiplies the
city's world by 16 in area: every district generator that has ever been tuned
against a 32-cell plot, every city gate, the chunk baker, the plot cache, the
memory ratchet measured at 97.5 MB, and the drivable/walkable land gates all
sit downstream of it. That is a world-lane structural change with a very large
blast radius and it is his call, not a thing to do quietly at the end of a
session.

**THREE THINGS ARE TRUE AND SHOULD BE SAID TOGETHER:**
1. The law is unambiguous, it is LOCKED, and 128 is the ruled answer.
2. The run already obeys it and looks correct.
3. Making the city obey it is not a one-line change in practice, even though it
   is a one-line change in the file.

## THE FIX, WHEN HE CALLS IT

1. `TILE_FINE = SLOT_FINE = 128` in `bohemia_overmap.js`, and delete the stale
   7/5 header comment that still cites the revoked law.
2. **Then the real work:** re-run every district gate, because 48 generators
   have been producing content sized for a 24m lot and will now be filling a
   96m neighborhood. Expect the WALKABLE-LAND LAW to fire loudly — districts
   that currently pass "buildings dominate the plot" may become mostly empty
   ground at 16x the area. That is the whole job, and it is worth doing.
3. **A gate so it can never split again:** one check that asserts the run's
   `TILE_PER_CELL` and the overmap's `TILE_FINE` are the SAME NUMBER. That gate
   is what was missing for 22 days, and it is the same gate-shaped hole the ONE
   MAP seed bug went through.

---

## THE STANDING LESSON

A law that says "constants relocked" and a checklist that says "DONE" are both
just text. **Nothing in this repo compared the two files.** The ONE MAP law was
written on 7/27 about exactly this failure mode for seeds, and the identical
failure was sitting in the same module for scale the whole time.

Where two surfaces hold private copies of one fact, the fact needs a gate, not a
paragraph.
