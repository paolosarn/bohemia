# COOK -- [car recook] ROUND 5: "I'M SO CONFUSED" IS ARITHMETIC, AND IT IS EVERY PROP IN THE GAME

**Lane 16 COOK (the Production Artist), 9/15/26. Board row: `[car recook]`, first line of
this lane.**

> *"every time I see a car it looks like dogshit, **I'm so confused**..."*
> -- Paolo 9/15, playing the demo a second time

---

## 1. THE PART OF HIS SENTENCE NOBODY HAD EXPLAINED

Round 4 answered the second half (*"when I zoom out all the way"*) -- that was a
placeholder sky with the word PLACEHOLDER printed on it, and it is cooked and shipped now.

This round is the first half, and the word that matters is **"I'm so confused."** He is
describing something he can see and cannot name. This is it.

## 2. THE MEASUREMENT

A prop is drawn by fitting its master into the stall its **footprint** buys:
`scale = min(stallW/masterW, stallH/masterH)`. The ground it stands on is drawn at exactly
**1.000** -- 44px tiles into 44px cells, lossless, which is what raising the bake from 22
to 44 bought on 8/1 after Paolo said *"the pixel quality... of the terrain of the ground of
the houses... it's so bad."*

Measured against the shipped footprints at the walk-zoom cell size:

| family | sprites | master | stall | **scale** |
|---|---|---|---|---|
| **car** | 20 | 41-47 x 96 | 88 x 176 | **1.833** |
| lighttower | 6 | 104 x 232 | 141 x 396 | 1.354 |
| pole | 6 | 84 x 192 | 79 x 198 | 0.943 |
| bench | 1 | 96 x 72 | 66 x 48 | 0.672 |
| firebarrel | 12 | 44 x 88 | 40 x 57 | 0.650 |
| barricade | 3 | 96 x 79-89 | 66 x 53 | 0.562-0.668 |
| dumpster | 1 | 96 x 91 | 70 x 57 | 0.629 |
| mailbox | 1 | 62 x 96 | 40 x 57 | 0.596 |
| bin | 4 | 64-66 x 96 | 40 x 57 | 0.508-0.596 |
| barrel | 2 | 61-74 x 96 | 40 x 57 | 0.535-0.596 |
| bollard | 2 | 62-74 x 96 | 35 x 53 | 0.476-0.550 |
| rubble | 41 | 89-96 x 62-74 | 48 x 44 | 0.478-0.544 |
| pallet | 1 | 96 x 62 | 48 x 31 | 0.497 |
| cone | 2 | 63-76 x 96 | 35 x 44 | 0.458 |
| tyre | 1 | 96 x 77 | 44 x 35 | 0.457 |
| bag | 2 | 86-89 x 96 | 40 x 40 | 0.413-0.445 |

### *** SIXTEEN OF SIXTEEN. NOT ONE PROP IN THE GAME LANDS ON AN INTEGER. ***

**And it is not blur.** Smoothing is explicitly off for this draw. It is worse than blur:
it is **uneven**. At 1.833x a source row becomes 2 screen pixels, then 2, then 1, in a
pattern that never repeats cleanly. Every pixel of the car is a different size from its
neighbour **and 83% bigger than the ground pixel beside it.** At 0.429x whole source rows
are discarded, so a bag loses more than half its detail and keeps a ragged edge.

**This repo already knows this and says so in its own words.** The mobile render contract:
*"non-integer scale is BANNED."* The bake comment: *"HLEVELS [11,22,44,88] become a clean
0.25/0.5/1/2 against it, so the no-fractional-scale contract still holds."* The ground
obeys it. **The props never have, and nothing ever checked.**

## 3. WHY THIS IS A GATE AND NOT A FIX

**Fourth time this lane has found this exact fault**, and the first three were all found by
a person looking at a picture:

| when | what | scale |
|---|---|---|
| 9/13 | the yard, over 72% of his first five minutes, smoothing ON | 2.75x |
| 8/25 | the door -- Paolo: *"WHY IS THE DOOR NOT TAKING UP ALL THE SPACE OF THE 2 TILES ITS IN. ITS LIKE A PICTURE OF THE DOOR BRO"* | a 16px square stretched to 44x88 |
| 9/7 | the car, stretched not fitted, at 70% of its own length | -- |
| **now** | the car, correctly fitted, correct aspect, **and still wrong** | 1.833x |

**A law without a machine gate is not enforced.** So this round's ship is arithmetic that
runs every time, forever, instead of a fifth version of a car.

## 4. WHAT THE FIX ACTUALLY IS, AND WHY I DID NOT DO IT THIS ROUND

Each master must be **authored at the pixel size its own stall gives**, so the fit is
exactly 1.000. A car master is **88 x 176**, not 45 x 96. That is a real re-cook of 106
sprites and it deserves its own row.

**I measured the two shortcuts and rejected both:**

- **Resize the existing masters.** A 2x nearest upscale gives 90 x 192 against an 88 x 176
  stall. To trim to fit I would need 1px of transparent margin each side and 8px of height.
  **Measured: the smallest transparent margin across all 20 cars is 0 on every edge** --
  they fill their masters edge to edge. Any trim cuts the car.
- **Snap the scale in the renderer.** The car goes to 1.0 (half its stall -- a toy) or 2.0
  (16px of overhang, which breaks the invariant that a fit is only ever smaller than its
  stall). The small props would change size by -23% to +17%, and **how much ground a bin
  occupies is a world fact, not presentation.**

Round 3 of this row already drew that line: *"distortion is presentation, which is a
cook's"* -- but the **stall** was established as correct and not mine.

## 5. *** MY OWN GATE PASSED 6 OF 6 WHILE MEASURING ZERO FAMILIES ***

The first version of this gate ran green. It had read **nothing**: a regex that did not
match, a loop that never ran, and every assertion after it vacuously true.

**Fifth time in six rounds this lane has been handed a clean answer by the wrong oracle**
(the sign pool, `tf_cu` the cooling unit, the "138 flat cells" I published and had to
retract, the pizza planet, now this). The difference is that this one was about to be
*permanent* -- a gate that lies is worse than no gate.

Two fixes, both in the gate:

1. The sizes now come from **the same node eval the game uses**, read off the PNG headers,
   never from a regex over a 1.6 MB base64 blob.
2. **The first assertion is that the gate measured something at all.** `len(rows) >= 10`,
   because every arm after it is vacuous when that is false.

**Mutation-tested three ways, each one bites:**

| mutation | result |
|---|---|
| un-freeze `car` so a known-bad family looks new | FAIL "NEW: car" |
| make a frozen family worse (car footprint 2x4 -> 3x6) | FAIL "WORSE: car" |
| make the reader match nothing, the original fault | FAIL "THIS GATE ACTUALLY MEASURED SOMETHING -- 0 families" |

## 6. THE RATCHET

Today's sixteen are frozen as named debt. A **new** prop family that draws fractionally
fails; a frozen one that gets **further** from an integer fails. The list can only shrink.
Same shape as the purity ratchet and the reference-check baseline.

Registered in the suite as **PROP SCALE**.

## 7. WHAT ELSE THIS ROUND MEASURED

- **The rust on the car is not the problem I thought it was.** The row says the body's
  saturation maxes at 0.21 and the rust accent is three times louder. I measured the real
  walk-zoom screen instead of trusting it: **the ground he walks on is itself at 0.31-0.37
  saturation** (it is the approved ground ramp, which I placed there in round 2). Rust at
  terracotta's corroded end, 0.31-0.35, sits exactly in line with the ground. The premise
  I inherited was weaker than it reads, and I did not cook against it.
- **There is no car on screen where he spawns.** Nearest is 32 cells away against a visible
  radius of 14. He has to walk 32 steps to meet one. **Routed: LIFE + CITY / WORLD** --
  that is placement, not art.

## 8. PROOF

- gate: `gates/prop_scale_gate.py`, ratcheted, mutation-tested three ways, registered in
  the suite as PROP SCALE, baseline `gates/prop_scale_baseline.json`
- **no art changed this round, and no build stamp** -- nothing on his screen moved
- pre-push pass green: PROP SCALE 7/0, PROPS 76/0, REFERENCE CHECK 11/0, PIXEL CRAFT 30/0,
  ART 45 16/0, CITY TAB 64/0, ALPHA LOADS 20/0, REUSE-FIRST 207/5 (all five are other
  lanes' `*_patch.py` files, none in this diff)
- full suite: 107 red at ad23d875; none named as this lane's
- no demo re-cut (rule 14a)
