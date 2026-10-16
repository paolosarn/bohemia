# WHICH TAB EATS THE PHONE — the gigabyte is THREE JUDGE SHEETS, not the game
### 8/20/26, RUN lane, P0-SUITE red sweep. Measured, not estimated.

## THE SHORT VERSION
CANVAS MEMORY went red and it was RIGHT — one of the few reds in this sweep that
was not a blind ruler. The shipped alpha peaks at **1,155 MB resident, 516% of
the 224 MB iOS Safari floor** the mobile render contract pins. The ratchets it
blew through were set on 7/27, when the same measurement read **~93 MB**.

**But the aggregate number hides the only thing that matters.** Priced one tab
at a time:

| | pixels held |
|---|---|
| ALPHA, just loaded | **55 MB** |
| RUN tab — the thing he actually plays | **+44 MB** |
| walking 480 steps of valley | **+2.5 MB** |
| VOTE + ART + LOOK | **+861 MB** |

**THE GAME IS FINE. THE JUDGE SHEETS ARE THE BILL.**

## THE TABLE
Every tab opened once, in order, delta measured after each. Canvas backing
stores at w×h×4 plus decoded `<img>` bytes at naturalW×naturalH×4, counted
across every frame including the city iframe.

| TAB | canvas Δ | image Δ | images Δ | running |
|---|---|---|---|---|
| **vote** | 0.4 MB | **476.2 MB** | 51 | 531.9 MB |
| **look** | 1.0 MB | **169.8 MB** | 21 | 702.7 MB |
| words | 11.1 MB | 0.0 MB | 0 | 713.8 MB |
| cutscene | 0.9 MB | 0.0 MB | 0 | 714.7 MB |
| direct | 1.5 MB | 0.0 MB | 0 | 716.2 MB |
| run | 44.5 MB | 0.0 MB | 0 | 760.7 MB |
| char | 5.2 MB | 0.0 MB | 0 | 765.9 MB |
| clothes | 2.5 MB | 0.0 MB | 0 | 768.4 MB |
| anim | 0.0 MB | 0.0 MB | 0 | 768.4 MB |
| rig | 0.5 MB | 0.0 MB | 0 | 768.9 MB |
| combat | 1.9 MB | 0.0 MB | 0 | 770.8 MB |
| music | 0.0 MB | 0.0 MB | 0 | 770.9 MB |
| map | 13.1 MB | 0.0 MB | 0 | 783.9 MB |
| slice | 0.1 MB | 0.0 MB | 0 | 784.0 MB |
| life | 0.0 MB | 0.7 MB | 6 | 784.7 MB |
| **art** | 0.1 MB | **214.7 MB** | 28 | 999.5 MB |

## THE THREE FINDINGS

**1. ONE HUNDRED IMAGES COST 861 MB.** VOTE, LOOK and ART between them decode
100 images for **860.7 MB** — an average of **8.6 MB each**, which is a picture
around 1,465 × 1,465 pixels. On a phone showing a 390-point-wide column. These
are judge sheets: the pictures exist so he can look at art and thumb it, and the
source PNG being small is irrelevant, because a decoded image costs
naturalW × naturalH × 4 no matter what it weighed on disk.

**2. NOTHING IS EVER GIVEN BACK.** Returning to the RUN tab and forcing three
collections released **0.2 MB out of 999.5**. Section 8 of the render contract
is a law about exactly this — "caches that never let go are how a small game
hits a 224 MB wall" — and the answer it gives is BOUND THE CACHE, DO NOT RAISE
THE CEILING. A tab that costs 200 MB and gives it back is a different animal
from one that costs 200 MB forever, and all three of these are the second kind.

**3. THE PLAYED GAME IS NOT THE PROBLEM, AND THAT IS THE ACTIONABLE PART.**
Load plus RUN is ~100 MB of pixels. Walking 480 steps across the valley added
2.5 MB, which is a cache doing roughly the right thing. He can boot the alpha,
play, and never come near the floor. He gets killed if he TOURS THE JUDGE TABS —
and touring the judge tabs is precisely what a verdict session is.

## WHAT THIS DOES NOT SAY
It is a **headless desktop chromium** measurement, not an iPhone. Backing-store
bytes are the same arithmetic on any device so those transfer; the JS heap and
the compositor's own copies do not. What transfers is the SHAPE: 100 images at
8.6 MB apiece, released never.

It also does not name a culprit inside those three tabs. It prices the tab, not
the picture. The next step for whoever owns one is to find which images they
are — the count is small enough to list by hand.

## OWNERS, AND WHY THIS LANE STOPPED HERE
VOTE, LOOK and ART are judge surfaces belonging to the ART and WORLD lanes, and
ONE SYSTEM ONE SESSION means RUN does not go and re-architect their sheets while
they are live in them. Per the sweep law a red with an owner gets fixed or gets
a written line: this is the line, with the arithmetic attached, because "the
alpha uses a gigabyte" is unactionable and "your tab costs 476 MB in 51 images
and frees none of it" is a fix.

**THE RATCHET STAYS WHERE IT IS.** Raising a ceiling to make a number go green
is the GOODHART GUARD, and the gate that caught this says so in its own failure
message.

## HOW TO RE-TAKE IT
```
node tools/bohemia_which_tab_eats_the_phone.js   # the per-tab bill
node tools/bohemia_canvas_memory_probe.js        # the record CANVAS MEMORY reads
```
Both write to `records/target/`. Neither touches engine code, renders art, or
changes behaviour; they read.
