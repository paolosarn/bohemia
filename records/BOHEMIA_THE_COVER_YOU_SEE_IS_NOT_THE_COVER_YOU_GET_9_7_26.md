# THE COVER YOU SEE IS NOT THE COVER YOU GET
COOK (16, the Production Artist), VAMILY [combat ground], 9/7/26. Round 2.

## THE ROW
> the combat floor tile at 1.5 to 2 sprite-widths, on the 45-degree corpus: house, yard,
> street, lot, **cover that reads**; a house with a backyard spans 1x2 (9/4 tile law 3d)

Round 1 did the ground. This round is the last clause, and this lane's own reference sheet
says what it means — `reference/library/tile-ground/INDEX.md`, TG-07:

> at one house per tile, cover is HOUSE-PART SIZED — a block wall segment, a dead car, a
> dumpster, a porch pier — and each must break the ground's silhouette **at the tile edge
> where it blocks**; cover that only reads by its colour is not cover.

## THE INSTRUMENT WAS WRONG THREE TIMES AND EVERY WRONG ANSWER WAS CONFIDENT

    try 1   0 pieces, 0 cars     the TEACHING fight. V202 leaves the street arena's cover
                                 branch empty while G.teachBeat is set and skips
                                 scatterCars beside it, in as many words: "a car is cover,
                                 and cover is a later lesson." True, and the wrong fight.
    try 2   0 pieces, 3 cars     asking for a second encounter from inside a fight does
                                 not take — COMBAT's 9/6 fuse is that one step makes at
                                 most one fight — so it re-read the same lesson. And the
                                 3 cars came off `G._cars`, a STALE FIELD left by a
                                 previous lot, not a count of anything on screen.
    try 3   51 pieces, 1 car     `setupEnemiesBody()` is the function the fight itself
                                 calls to lay out a lot. Clear the flag, call it, read the
                                 lot. Car cells are counted off the pillars the frame
                                 draws, so a stale field cannot lie again.

**Never trust a fight number taken from the first encounter.** That is now written into
the handoff, because this shape has cost this row two rounds.

## AND I OVERSTATED A FINDING BEFORE I MEASURED IT, WHICH IS THE OTHER CORRECTION

An earlier note from this lane said the vault state "is signalled by lid colour and nothing
else". **That was wrong**, and reading the draw line was enough to know it:

    const _h=(P.tall===false)?s*0.9:s*1.6

A low piece is drawn at 0.9× the block size and a tall one at 1.6×. That is a 1.8× height
difference — a real silhouette tell, and it is COMBAT's read, not a cook's. It stays
untouched, and so do the lid colours (`#7a94a8` you may vault, `#94836a` you may not).
Changing a signal a player has learned is not a production artist's call.

## THE REAL FINDING, MEASURED, AND THE SPLIT IS THE WHOLE POINT

The blocking test is not a constant:

    if(dA<Math.PI/2 && Math.sin(dA)*P.edist < P.r*0.9)

A piece stops a sightline anywhere within `0.9·r` of its centre, so it is an object
`1.8·r` tiles across. The picture **was** a constant: `s*1.1` where `s = ring*0.62`, which
is 0.68 tiles — the same box for a car door and for the biggest block in the lot.

    a GENERIC piece blocks 1.91 tiles wide, showed 0.68   ->  the picture was 36%
    the widest generic piece blocks 2.07 tiles

TG-07's test is that the picture breaks the ground's silhouette **at the tile edge where
it blocks**. It stopped a third of the way there, on every generic piece, in every fight.
You were being protected by air you could not see.

**AND CARS WERE NEVER ON THIS PATH, WHICH THIS ROUND'S FIRST WRITE-UP GOT WRONG.** The
loop's very first branch is `if(P.car){ if(!P.nose)continue; … CAR_IMG[P.carArt|0] … }`. A
car already draws as **one approved wreck picture** across its whole 2×3 footprint, and the
other five of its six cells draw nothing at all. TG-07's "a dead car" was done before this
round started. The probe reported a car-cell ratio (76%) because it measured every pillar
in `G.pillars` — but that ratio described code cars never reach. Everything here is about
the **generic** pieces, the ~45 of 51 that are not car cells. A probe that measures a
population wider than the code path it is reasoning about will hand you a true number about
nothing, which is the third instrument mistake this row has caught.

## WHAT CHANGED, AND WHAT DELIBERATELY DID NOT

**WIDTH** is now what the piece actually blocks: `ring * 1.8 * P.r`, bucketed to 4 px.
**HEIGHT** is untouched — it is the vault tell.
**THE LID COLOURS** are untouched — they are the vault signal.
**`P.r` is read and never written.** NO DAMAGE BEFORE THE DIAL holds: no damage, accuracy,
range or resource number moves. The mechanic is untouched; the picture stopped lying
about it.

## AND IT COOKS NOTHING, WHICH IS THIS ROW'S PRECEDENT TWICE OVER

The face is the **block wall the fight already carries** — `STREET_B64.wall`, four variants
at 44 px, lifted out of the approved starter bank in round 1 of this same row. TG-07's
first named example is "a block wall segment", and the generator's own comment says *three
pillars in a row IS a wall*. So a wide piece reads as a run of block wall, which is what a
wide piece in a Vegas lot is. No new graphic pixels were cooked in either round.

## ONE BLIT INSTEAD OF FOUR CANVAS OPS

The fight spends most of a 500 ms beat and a large share of it is canvas blits, so 37 to 69
pieces on screen is not a place to be careless. Each piece is baked **once** into a cached
sprite (shadow, wall face, lid, outline) keyed on its size, then drawn with a single
`drawImage` — replacing a `fillRect`, a `strokeRect` and **two ellipse paths** per piece
per frame.

Three things the bake has to get right, and two of them were bugs first:

1. **The anchor sign was inverted** in the first cut (`__ay = -oy`), which would have hung
   every piece of cover below its own shadow. Caught by working the maths out on paper
   before running it, not by looking at the screen.
2. **The bake must ask for the floor's pixel size.** `streetTile` keeps ONE cache for ONE
   px (`if(_stCacheT!==px){ _stCache={}; }`), and the floor asks for `ceil(t)+1`. Asking
   for `round(ring)+1` would empty and refill the entire street cache every frame the
   moment `ring` is fractional — a performance bug that would have looked like nothing.
3. **The width had to be bucketed.** `r` is a continuous roll, so an unbucketed width gave
   every piece its own sprite: measured, **40 pieces produced 46 distinct cached sprites**,
   a bake per piece and a cache buying nothing. Four pixels is under a tenth of a tile.

And the bake **refuses to cache a sprite made before the art was ready**: `streetTile` can
answer nothing while the bank is still decoding, and a sprite baked then would be a flat
box cached forever. If no tile comes back it returns null, the old path draws that frame,
and it tries again on the next one.

## WHAT IT COSTS, AND WHERE THE INSTRUMENT RUNS OUT

One before/after pair proves nothing here. On an unchanged tree this gate read **345.5,
379, 461 and 498 ms** in one round of work, and the reason is in its own output: the
number tracks how much the camera moved, and the camera's 10%-per-frame ease never
settles (the PLUMBER's 9/7 round four). So the runs were interleaved on the same tree,
same box, with the zoom count printed beside every number:

    BEFORE  498.0 ms  (31 zooms)      AFTER  497.5 ms  (30 zooms)     -0.5 ms
    BEFORE  379.0 ms  ( 9 zooms)      AFTER  426.0 ms  ( 1 zoom )     not comparable
    BEFORE  345.5 ms  ( 1 zoom )      AFTER  402.5 ms  ( 1 zoom )    +57.0 ms

Adding every run taken on the patched tree, all of them at a 1-zoom camera:

    AFTER, 1 zoom   402.5   426.0   492.5 ms      against one BEFORE at 1 zoom, 345.5 ms

**AND THAT IS WHERE THIS MEASUREMENT STOPS BEING ABLE TO ANSWER.** The after runs spread
90 ms among themselves at nominally identical camera conditions — as wide as the effect
being looked for — and there is one before sample to weigh them against. The box was not
the culprit: the gate's own CPU yardstick read 0.71× to 0.91× across every run, a 28%
band, while the fight numbers moved 44%. It is the camera, exactly as the gate says.

So the honest statement is a boundary, not a number:

- **In a fight anybody is actually playing, no cost is measurable** — −0.5 ms across the
  one properly matched pair (31 zooms against 30). That is **not** a good number either: a
  moving fight is already pinned at 99.6% of the beat, so there is no room left for a
  difference to appear in. "Invisible at the ceiling" is not the same as "free".
- **In a still fight something is there and this instrument cannot size it.** Every after
  run sits above the one before run, which is a direction, not a measurement. Claiming
  "55 ms" off n=1 against a 90 ms spread would be the same mistake the PLUMBER's round
  four corrected on 9/7, one round earlier, on this exact gate.

**AND THE PLUMBER PUT A NUMBER ON EXACTLY THIS, ONE COMMIT BEFORE THIS ONE.** Their
[fight headroom] round five (3de44b4b, 9/7) measured the same build twice under one protocol
at 450.1 and 412.5 ms and concluded: *"THE DRIVEN FIGHT'S BEAT HAS A NOISE FLOOR OF ABOUT
40 MS BETWEEN IDENTICAL RUNS. Therefore: any single-sample before-and-after on this fight is
worthless; 40 ms is a coin toss… Anything measured on this surface needs alternating pairs
inside ONE boot, at least three."* The matched pair here is −0.5 ms, comfortably inside that
floor; the still-fight spread is 90 ms, more than twice it. Two lanes arrived at the same
conclusion from opposite directions in the same hour, which is the strongest form this
answer could take: **the effect is not resolvable on this instrument, and saying so is the
result.**

**WHAT CAN BE STATED EXACTLY IS THE ARITHMETIC, BECAUSE IT DOES NOT NEED A PROFILER.**
A generic piece went from 30 px wide to about 90, so the fight paints roughly three times
the cover pixels: **48,000 px of cover per frame became 145,000**, on a 1.06 M px canvas —
about 9% more of the screen painted. That number is deterministic, it is the whole cost,
and it is the honest thing to hand the next person.

**And the cause is area, not call count.** One `drawImage` now replaces a `fillRect`, a
`strokeRect` and two ellipse paths, so the fight makes *fewer* calls than it did. What it
paints is bigger, and that is the unavoidable price of a picture the size of the thing it
draws.

**AND THE LOOP HAD NO CULL, WHICH IS PART OF THE ANSWER TO COMBAT'S OWN NEW RULE.** COMBAT
claimed **[draw budget]** on 9/7 — *"the fight loop is FULL (497 of 500 ms a beat)… anything
new that draws in the fight… ships with its cost stated"*. Reading this loop to size my own
cost showed that **every piece in `G.pillars` was painted whether or not it was on screen**:
measured across three arenas on a phone canvas — 42 of 51, 69 of 91, 37 of 51 — so **17%,
24% and 27% of the cover paint went off the edge of the screen** in the three lots this row
has looked at.
Four comparisons per piece fix that, and they pay back part of what the honest width costs.
It is the kind of thing you only find by being made to account for your own milliseconds,
which is that rule working an hour after it was written.

Three things were done to keep that price as small as it honestly can be. The width is
**bucketed to 4 px**, which took a lot from 46 cached sprites down to 14 for the same 40
pieces. The shadow's overhang was a **ratio** (1.4545× the half-width) tuned when every
block was 0.68 tiles; kept as a ratio it made the blit 45% wider than the piece itself, for
a faint ellipse. It is a distance now, capped at a quarter of the block size, which takes
an 84 px face from a 124 px sprite to a 100 px one — a fifth of the fill rate back, and a
more truthful shadow into the bargain. And **off-screen pieces are no longer painted at
all**, which is about a quarter of them.

BEAT BUDGET stays green (21/0) through all of it, and it holds no line for the fight on
purpose, because the fight has no headroom to hold one against.

## AND A GATE WENT RED ON THE WAY, AND IT WAS NOT THIS CHANGE

`fight_moves_you` came back **169 passed, 1 failed** on one run, on this arm:

> V199 AND THE THING HE REJECTED DOES NOT COME BACK, WHICH IS THE SAFETY CHECK AND IT IS
> A NUMBER … at the untouched V35 rates that is **16%** of men

Its condition is `nerve.dflt.leftPct > 0 && nerve.dflt.leftPct < 15`. Nothing about the
width of a drawn box can change how many men rout, so it was checked rather than assumed:

    my tree, run 1     16   RED        my tree, run 2     14   green
    origin/main        10   green

**The same tree gives 14 and 16 on consecutive runs against a hard bar of 15.** It is a
sampled percentage sitting inside its own noise, so the arm is a coin flip — the exact
bug class this lane has now found six times: *a checker with a fixed number where it needs
a measurement.* Reported, not touched: it is COMBAT's gate and their number to set. All
six gates are green on the shipped tree, `fight_moves_you` at 170/0.

**[FOR COMBAT]** `gates/fight_moves_you_gate.js`, the V199 leftPct arm: the bar is one
point away from what the arm measures, so it will keep going red on other people's
unrelated work. It needs either more deals per run until the percentage settles, or a bar
set outside the spread — the same fix your own V164 arm already carries a note about
("a ruler that cannot tell a broken rule from an empty sample… the fix was more deals and
not a looser claim").

## ROUTED, NOT DONE: THE COVER GENERATOR WAS SIZED BEFORE A TILE WAS A HOUSE

**[FOR COMBAT]** A car cell is authored as exactly one tile (`CAR_W 2 × CAR_L 3`, `r ≈ 0.5`)
and blocks 0.90 tiles — right. A generic piece rolls `bulk = 0.45 + random*0.70` and blocks
up to **2.07 tiles: wider than the house standing beside it**. That generator is V89/V139;
the tile became a house on 9/4. Now that the picture tells the truth, the mis-scaling is
visible instead of hidden, which is the honest place for it to be. The dial is yours — it
is a fight number, not a picture — and this round changed no part of it.

**And the fix pays for itself, which is why the number goes with it.** The blocked corridor
is `1.8·r` tiles wide, so shrinking the roll makes cover smaller AND cheaper in one move —
the paint cost above *is* the mis-scaling, measured in pixels. A `bulk` that topped out near
a house instead of past one would put a generic piece close to the car cell's 0.90 tiles and
roughly halve the cover pixels painted, taking the 48,000 → 145,000 back down toward where
it started. Nothing here presumes that is the right call. It is the number that goes with
the decision.

## WHAT THE ROW HAS LEFT

Every cook clause of the row is now built. Clause 3d of the tile law says *"a combat ground
tile at that size is a real canvas on the 45-degree corpus: the house, the yard, the street,
cover that reads"* — house, yard and street landed in round 1, cover reads in this one, and
"a house with a big backyard is one by two tiles" is the paired house-row / yard-row split
round 1 shipped. The remaining clause, the 1.5-to-2 sprite-widths tile itself, is **already
built and is explicitly not a cook's**: the law says *"THE EXACT RATIO IS BY EYE, HIS"*, and
the dial exists in the fight today as the TILE WIDTH button, default 1.75, `TILE_WIDE` marked
`[DIAL] his number, by eye, and his to change`.
