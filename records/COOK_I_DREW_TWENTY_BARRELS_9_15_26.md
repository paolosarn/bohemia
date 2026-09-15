# COOK -- [car recook] ROUND 6: I DREW TWENTY BARRELS, LOOKED AT THEM, AND KILLED THEM

**Lane 16 COOK (the Production Artist), 9/15/26. Board row: `[car recook]`.
NOTHING SHIPPED TO THE GAME THIS ROUND, ON PURPOSE.**

> *"every time I see a car it looks like dogshit, I'm so confused..."* -- Paolo 9/15

---

## 1. WHAT I SET OUT TO DO, AND WHY IT WAS THE RIGHT TARGET

Round 5 measured why he is confused, and it is not the paint: **every prop in the game is
drawn at a fractional scale.** The car is the worst of sixteen at **1.833x** while the
ground beside it is drawn at exactly **1.000**. Smoothing is off, so it is not blurred, it
is *uneven* -- a source row becomes 2 screen pixels, then 2, then 1. Every pixel of the car
is a different size from its neighbour and 83% bigger than the ground pixel next to it.

The arithmetic is not in doubt:

```
the stall a car's footprint buys   2 x 4 cells at 44 px   = 88 x 176
the master it is drawn from                              =  45 x 96
fit = min(88/45, 176/96)                                 =     1.833
```

Round 5 also killed both shortcuts with measurements: a 2x upscale needs transparent margin
to trim and **the shipped cars have zero margin on every edge**; snapping the scale puts the
car at 1.0 (a toy in half its stall) or 2.0 (16px of overhang). **The master has to be
drawn at 88 x 176.** That conclusion still stands.

## 2. SO I BUILT A CAR FACTORY, AND IT DREW BARRELS

Twenty cars, five silhouettes, generated from half-width profiles down the body, panels
shaded by value, glass, seams, wheel arches, rust. On the numbers it was flawless:

| | shipped | mine |
|---|---|---|
| master | 41-47 x 96 | **88 x 176** |
| fit into the stall | 1.833 | **1.000** |
| colours (ceiling 64) | 10-11 | **8** |
| made from | a photograph | drawn |

**Then I rendered it beside the shipped cars and looked. It was a rounded rectangle with
two dark bands across it.** No taper worth the name, the greenhouse drawn full width
instead of inset, no wheels visible at all, and the rust grown as a one-pixel fringe around
the outline.

## 3. I FIXED IT ONCE AND IT WAS STILL A BARREL

Version two: a much harder taper at both ends, the greenhouse inset 26% from the flanks,
wheels drawn breaking the outline at both axles, rust seeded as blobs on the arches and
seams instead of a rim. Nine colours, fit still exactly 1.000.

**Still a barrel.** The taper reads as a rounded end, not a nose. The wheels did not survive
the outline pass. The glass still reads as two stripes across a slab.

**That is my second rejection of my own work, and STOP PRODUCING (Paolo 7/26) is
unambiguous about what happens next:**

> *"a second rejection ends the feature for the session... THE TELL: writing a fourth
> version of anything means you already failed, stop and say so instead of fixing the
> attempt."*

**So I stopped, and nothing went into his game.** The shipped photograph cars are wrong
about resolution but they are unmistakably cars: you can see a bonnet, a windscreen, wheels,
mirrors. Replacing them with barrels that measure perfectly would have made his game worse
while every gate went green. That is the exact failure this lane has been punished for
before, and the only thing that caught it both times was rendering it and looking.

## 4. WHY IT FAILED, IN ONE SENTENCE, SO THE NEXT ATTEMPT DOES NOT REPEAT IT

**A silhouette built from half-width profiles cannot make a car.** A car's outline is not a
smooth function of its length -- it is a hard nose, a shoulder line that steps out over the
front arch, a flat door section, a step back in at the rear arch, and a cut tail. Sampling a
spline down the middle produces exactly what it produced: a lozenge. The readable shape has
to come from an **observed** car, not from parameters.

## 5. *** THE PATH THE NEXT ROUND SHOULD TAKE, AND IT IS NOT THIS ONE ***

The shipped photographs are *right about shape and wrong about resolution.* Those are
separable:

1. Take the shipped 45 x 96 master's **alpha mask only** -- the silhouette, which reads as
   a car because it came from one.
2. Upscale **the mask** to 88 x 176. A mask has no pixel grid to break: an edge scaled by
   1.833 and then re-thresholded is just an edge, and it can be cleaned to a crisp
   one-pixel outline afterwards.
3. Detect the panels **inside** the mask from the photograph's own value structure (roof
   brightest, glass darkest, bonnet and boot between) -- that reading is what the 9/7
   recolour already did successfully.
4. **Re-shade from scratch on the new 88 x 176 grid**, on the same approved asphalt +
   corroded-terracotta ramps, with the rust and lighting rules this round already wrote and
   tested.

The shape comes from the photograph; every pixel is authored fresh at the size the stall
gives. That is a different method from the one that failed, not a third go at it.

**And before that round starts, check rule 16 (THE STEP IS A HOUSE).** Measured this round:
`TPX` is still 44 and `PROP_FP.car` is still `[2, 4, 0]`, so the 88 x 176 stall is intact
even after `[lot lattice]` and `[house board]` shipped. But rule 16 makes bodies larger and
a lot the step, and if the cell or the footprint moves, 20 new masters would encode a
constant that just changed.

## 6. WHAT SURVIVES THIS ROUND

- **The measurement**, and it is already permanent: `gates/prop_scale_gate.py`, shipped last
  round, ratcheted, mutation-tested three ways, in the suite as PROP SCALE.
- **The failure, written down** rather than quietly deleted: the tool is in `graveyard/`,
  out of `tools/` so it cannot be mistaken for shippable, with two lines in
  `gates/bohemia_graveyard.txt` and the picture at
  `records/target/COOK_CARFAIL_BARREL_9_15_26.png`.
- **The rust and lighting rules**, which are sound and reusable: rust grown as blobs on the
  wheel arches and panel seams (never a rim, never the middle of a roof), one light
  direction upper-left, glass broken but panels never missing.

## 7. PROOF

- graveyard: `graveyard/CARFAIL_BARREL_bohemia_car_factory_9_15_26.py`,
  `gates/bohemia_graveyard.txt`
- picture: `records/target/COOK_CARFAIL_BARREL_9_15_26.png` (row 1 shipped at 1.833x, row 2 mine)
- **no art changed in the game, no build stamp** -- nothing on his screen moved
- pre-push pass green
- full suite: 107 red at ad23d875; none named as this lane's
- no demo re-cut (rule 14a)
