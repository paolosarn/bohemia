# IN FRONT OF HIM IS NOT ON HIS WAY (9/12/26, LIFE + CITY lane)
## VAMILY row `[more people]` POPULATION-DEFAULT, round 10

**A walk meets a crowd: 8 of 16 -> 13 of 16. The floor did not move (16 of 16 still
meet somebody). Biggest group seen, 13.**

---

## THE ROUND OPENED BY BEING WRONG, AND THE PROBE SAID SO IN ONE LINE

Round 9 left eight walks in sixteen finding only the floor. My assumption was that
those eight were crowds too small to count: `__want` is
`min(HEADS.cluster, floor(pool/2))` and the pool is capped by the lattice cells
inside his five-minute reach, so sparse ground *can* make a crowd of seven
arithmetically impossible. That was a good theory. It was also wrong, and it was not
close.

A probe repeated the gate's own sixteen walks and, on every sample, recovered the
knot from public state — `PPL_NEAR_AT` plus the bodies inside the seating radius —
and split the misses three ways:

    of the 8 misses:   crowd never big enough   0
                       big enough but BEHIND    8
                       big enough and ahead     0

**Every single miss had twelve or thirteen bodies standing in it, against a
threshold of seven.** Not one walk ever failed for want of people. The tell was in
the *winning* walks too: their ahead-sample counts ran 1 to 3 against 23 to 49
behind, so even the successes met the crowd in the first few steps and then spent
the rest of the walk leaving it.

Round 8 had already bought the crowd and never spent it. The knot was the right
size, inside two screenfuls, on good frontage. It was placed on the best frontage in
**any bearing**, and a straight walk has even odds.

---

## THE FIRST CUT WAS A HALF-PLANE AND IT BOUGHT ONE WALK

Filter the candidates to the half-plane he is walking into, keep the same instrument
picking the best frontage inside it. Measured: **8 -> 9 of 16.** That is noise.

The walk that went the *other* way is what named the real cause. Walk 0 went from
met to missed, and its numbers were: **crowd ahead for 43 of 50 samples, peak seen
1.** Ahead the whole time and never seen once.

First theory was a carrot: the field re-placing the crowd further ahead each
rebuild, so he chases it forever. **Measured, and it is not that.** On four misses,
hundreds of cells of travel each, the anchor moved **0 or 1 times in a whole walk**.
The crowd stands still. Round 9's anchor rule is doing its job.

What the same run did show:

    walk  dir    moves  net travel  anchor moves  CLOSEST HE EVER GOT
      0   1,0     358        64          1               15
      1  -1,0     399       398          0               14
      6   1,-1    271        50          1               15
      7  -1,1     376       183          1               13

**SEE_RANGE is 9.** Walk 1 travelled 398 cells in a dead straight line and passed
the crowd at fourteen. Never once inside seeing range.

A half-plane is **180 degrees wide**. A crowd eighty degrees off his line is
"ahead" by the dot product and he walks straight past it at thirty-odd cells.

---

## WHAT SHIPPED: THE PERPENDICULAR OFFSET, AND THE NUMBER IS SEE ITSELF

The candidate must be forward of him **and** within one `SEE_RANGE` of the *line* he
is walking — the perpendicular distance from that line, integer cross product over
the heading's length.

`SEE` is not a tuning constant here. It is the definition of the question being
asked: **when he draws level with the crowd, it has to be close enough to see.** Any
other number would be somebody's taste.

It stays a **filter, not a weight**. A bonus added to the frontage score would be a
constant nobody could defend, and "the crowd gathers on the best forecourt" stays
exactly as true as it was — it just stops counting forecourts he has already walked
past. It falls back: with no heading yet, or no frontage on his line, it takes the
best spot anywhere, which is round 8's rule unchanged.

**The heading is read, never invented.** The walked surface stores no facing for the
player, and adding one would be a second source of truth for something the positions
already answer. Where he stood at the last rebuild against where he stands now *is*
the heading. It costs one array.

**AND IT IS NOT ROUND 9'S MIRAGE.** That cut rebuilt the field on his position every
sixty cells and threw away the crowd he was walking toward — 4 of 16, worse than 5.
Nothing here changes when a field is discarded. The anchor is still the crowd; a
crowd he is approaching still stands until he has genuinely left it behind. This
only changes which way the **next** one forms, once the old one is already gone.

---

## THE MUTATIONS, RUN ON DISK, AND THEY RE-MEASURED THE HISTORY

| mutation | expected | result |
|---|---|---|
| drop the perpendicular rule, keep the half-plane | RED | **A3 + B1 red, and the walk measured 9 of 16** |
| drop the heading entirely (back to round 9) | RED | **A4 + B1 red, and the walk measured 8 of 16** |

Both mutations reproduced the exact numbers of the two earlier cuts, from the other
direction. The gate is not taking my word for the history; it can re-derive it.

B1 ratcheted from `>= 6` to `>= 11`.

---

## THE STANDING NOTE

**IN FRONT OF HIM AND ON HIS WAY ARE NOT THE SAME THING, AND THE FIRST IS WORTH
ALMOST NOTHING.** A half-plane feels like aiming and is barely better than random:
it bought one walk in sixteen. The useful version had to name the *line*, not the
direction, and to measure width in the one unit that already meant "he can see it".

And the round's other lesson, which this lane keeps re-learning: **the theory that
explains the failure is not the cause until it is measured.** The cap theory was
plausible and cost nothing to test — the probe killed it in one run, and the carrot
theory died the same way twenty minutes later. Two wrong theories, both cheap,
because the measurement came before the fix instead of after it.

---

    walks that met a crowd : 8 of 16  ->  13 of 16
    biggest group seen     : 13
    walks that met anybody : 16 of 16   (round 7's floor, unchanged)
    at three in the morning: 0, and that is correct

    a_crowd_to_walk_into_gate   9/0 (was 7/0; A3 and A4 are new)
    never_empty_gate           14/0     on_the_way_gate   8/0
    alive_gate                 16/0     combat_lab_gate 932/0
