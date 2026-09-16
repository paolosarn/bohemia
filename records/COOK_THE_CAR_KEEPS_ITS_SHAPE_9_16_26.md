# COOK -- [car recook] ROUND 7: THE CAR KEEPS ITS SHAPE AND CHANGES ITS SIZE

**Lane 16 COOK (the Production Artist), 9/16/26. Board row: `[car recook]`, first line of
this lane. The first family off the prop-scale debt: 16 -> 15.**

> *"every time I see a car it looks like dogshit, **I'm so confused**..."* -- Paolo 9/15

---

## 1. WHAT THE LAST TWO ROUNDS SETTLED

**Round 5** measured why he is confused, and it is not the paint. Every prop is drawn by
fitting its master into the stall its footprint buys, and **sixteen of sixteen land on a
fractional scale** while the ground beside them is drawn at exactly 1.000:

```
the stall a car's footprint buys   2 x 4 cells at 44 px   = 88 x 176
the master it is drawn from                              =  45 x 96
fit = min(88/45, 176/96)                                 =     1.833
```

Smoothing is off, so the car was not blurred, it was **uneven** -- a source row becomes 2
screen pixels, then 2, then 1. Every pixel 83% bigger than the ground pixel beside it.

**Round 6** tried to draw twenty new cars from parameters and **they came out as barrels.**
Twice. Killed by its author, graveyarded with the post-mortem. Its one-sentence lesson is
the premise of this round: **a silhouette built from half-width profiles cannot make a car.**
A car's outline is a hard nose, a shoulder stepping out over the front arch, a flat door
section, a step back in at the rear arch, a cut tail. A spline down the middle gives a
lozenge. **The shape has to come from an observed car.**

## 2. SO THIS ROUND SEPARATED THE TWO THINGS THAT WERE TANGLED

The twenty shipped cars are **right about shape** and **wrong about resolution**, and those
are separable:

1. **Take the alpha mask only** of the shipped 45x96 master. It reads as a car because it
   came from one.
2. **Upscale the mask** to 88x176 and re-threshold. **A mask has no pixel grid to break** --
   the entire fault is that scaling *colour* by 1.833 makes uneven pixels, and a one-bit
   coverage map has no pixels to make uneven. Then despurred, so no single-pixel spikes
   survive on the outline.
3. **Read the panels out of the photograph** at its own resolution, by luma, where it is
   still a photograph. Roof brightest, glass darkest, bonnet and boot between -- **not
   asserted by me, read out of each car**, so every one keeps its own layout. That is the
   same reading the 9/7 recolour already did successfully.
4. **Re-shade from scratch on the 88x176 grid**, on the approved ramps, with round 6's rust
   and lighting rules. Every output pixel is authored at the size the stall gives.

| | was | now |
|---|---|---|
| master | 41-47 x 96 | **88 x 176** |
| fit into the stall | **1.833** | **1.000** |
| colours (ceiling 64) | 10-11 | 8 median, 9 worst |
| silhouette | photographed | **the same one**, rescaled as a mask |
| pixels | photographed | authored at 88 x 176 |

**The silhouette survives to 0.6 points**: the cars fill 84.6% of their frame, they filled
84.5% before. The tool refuses to write if that drifts past 6 points, because the shape is
the one thing that must survive.

**Confirmed in the running game** with the one driver: masters `88x176`, stall `88x176`,
fit scale `1`, 20 loaded.

## 3. *** THE RIM IS NOT RUST, AND THAT WAS THE FOURTH TIME ***

The first cut of this tool put its heaviest rust at distance 0-1 from the outline and every
car came out wearing an **orange dotted outline**. Four wrong answers to one question now:

| round | the wrong answer |
|---|---|
| 2 | accent from the single most saturated pixel -- a wreck speckled scarlet off a tail light |
| 4 | the planet's iron oxide over 18.2% of the disc in terracotta's *bright* tones |
| 6 | a one-pixel orange fringe round the whole car |
| 7 | rust densest at distance 0-1 -- an orange dotted outline |

The rim is the **lit and shadow edge the 45-degree law just drew**; painting rust over it
destroys the only two lines giving the body its form. So distance 0 and 1 are forbidden,
rust lives in a band 2 to 7 pixels in, thickest around 4, and only near a patch seed --
because rust is blotches where water stood, not a uniform treatment of an outline.

## 4. *** SEVENTH REGISTRY COLLISION, AND THE MOST DANGEROUS ONE YET ***

`BOHEMIA_CITY_PROPS.js` holds **two tables and both have a key called `"car"`**:

```
const PROP_FP  = {... "car": [2.0, 4.0, 0.0] ...}    the FOOTPRINT
const PROP_B64 = {... "car": ["iVBOR..."] ...}       the ART
```

`PROP_FP` comes first. My search for `"car"\s*:\s*\[` found **the footprint**, and the
first write **put twenty base64 images over it** -- which would have handed every car in
the game a footprint made of PNG strings.

**The only reason I know is that the write is followed by a read-back that refused to claim
success.** It printed `wrote the pool and read back something else -- STOP`, I checked the
file, found the corruption, and restored it. Same shape as `TP_TILES["street"]` (the STOP
signs) versus `SA_TILES["street"]` (the road) in `[streets fixed]` round 1.

The tool now anchors its search **after** `const PROP_B64`, and refuses outright if the
first thing inside the target is not a PNG.

## 5. AND THE ART LIVES IN TWO PLACES

`props_gate` asserts every object in the street-furniture bank also appears in the sibling
the page loads. My first successful write updated only the sibling: **105 objects matched
became 85 -- exactly the twenty cars.**

The 9/7 car round already wrote this rule down (*"both banks and both surfaces cooked by ONE
tool so they cannot drift"*) and I still had to be told by a gate. One tool now writes both,
in the same call, with a read-back on each. PROPS GATE back to 76/0, 105 objects.

## 6. THE RATCHET MOVED FOR THE FIRST TIME

`gates/prop_scale_gate.py`, built last round, now reports `car 20 1.000 ok` and the frozen
debt is re-pinned at **15 families instead of 16**. The list can only shrink and it just
did.

**Fifteen still owed**, worst first: lighttower 1.354, pole 0.943, bench 0.672, firebarrel
0.650, barricade, dumpster, mailbox, bin, barrel, bollard, rubble, pallet, cone, tyre, bag.
This round's method works on all of them: their silhouettes are equally photographed and
equally separable from their resolution.

## 7. REFERENCE CHECK

**Compared to:** the shipped cars side by side at the size the game draws them, and overhead
photographs of abandoned sedans, wagons and pickups -- salvage yards and Mojave roadside
wrecks. Plus the repo as its own ruler: the craft ceiling, the 45-degree law, the approved
ramps.

**Structural rules taken:** from above a car is mostly roof and the roof is the brightest
panel (read out of the photograph, not asserted); rust starts at the edges, seams and wheel
arches and never in the middle of a roof; one light direction, upper-left.

**What changed from the reference:** the palette, deliberately. A real wreck is any colour
that left a factory; these are asphalt and corroded terracotta, because ONE PALETTE PER
FAMILY and the family a car sits on is the road. **No new colour: the same eleven-colour
family the shipped cars ended on.** This changes resolution, never palette.

## 8. PROOF

- tool: `tools/bohemia_car_from_its_own_shape_cook_9_16_26.py` (measure / `--sheet` /
  `--write`; anchors after `PROP_B64`, proves its target holds PNGs, writes both copies,
  reads back both, refuses on silhouette drift over 6 points or a fit that is not 1.000)
- art: `slices/BOHEMIA_CITY_PROPS.js` and `banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt`
- picture: `records/target/COOK_CAR_AT_ONE_TO_ONE_9_16_26.png` (row 1 shipped at 1.833x, row 2 mine at 1.000)
- pre-push pass green: PROP SCALE 7/0 (car now ok, debt 16 -> 15), PROPS 76/0, PIXEL CRAFT
  30/0, ART 45 16/0, REFERENCE CHECK 11/0, CITY TAB 64/0, ALPHA LOADS 20/0, REUSE-FIRST
  208/5 (all five other lanes' `*_patch.py`)
- full suite: 107 red at ad23d875; none named as this lane's
- no demo re-cut (rule 14a) -- and none needed: the props file is loaded by reference
