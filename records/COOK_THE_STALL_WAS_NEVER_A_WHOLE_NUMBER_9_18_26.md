# COOK -- [car recook] ROUND 8: THE DEBT IS PAID. SIXTEEN OF SIXTEEN AT 1.000.

**Lane 16 COOK (the Production Artist), 9/18/26. Board row: `[car recook]`.
The prop-scale debt went 15 -> 0, and 85 photographs got cooked on the way.**

> *"every time I see a car it looks like dogshit, **I'm so confused**..."* -- Paolo 9/15

---

## 1. I CAME IN TO DRAW FIFTEEN MORE AND RULE 12 STOPPED ME AT THE DOOR

Round 7 fixed the car by authoring its master at 88x176, the size its stall gives, so the
fit is 1.000 instead of 1.833. The handoff said: run the same method over the other fifteen,
but **read each family's own stall, never assume 88x176.**

So I read them. And found this:

> A footprint is in **cells**, because that is a fact about the world -- a bin is 0.9 of a
> cell wide. Multiplied by a 44px cell that is **39.6 pixels**. A master is always a whole
> number of pixels, so `min(39.6/w, 39.6/h)` **can never be 1.000 for any art anybody could
> ever draw.**

| | |
|---|---|
| families with a whole-pixel stall | **2** (car, lamp) |
| families where 1.000 was impossible by construction | **15** |

**The car was fixable *because* its footprint happened to be a whole number.** The other
fifteen were a debt that could not be paid by drawing, no matter how good the drawing was.
`prop_scale_gate` had been measuring a bill nobody could settle.

## 2. THE FIX IS TWO HALVES AND NEITHER WORKS ALONE

**One: round the drawn rectangle to whole pixels.** `Math.round(C*fp[0])`, marked
`__A_STALL_IS_A_WHOLE_NUMBER_OF_PIXELS__`.

This is **presentation and nothing else**, and I checked before touching it: `PROP_FP` is
read **nowhere in `engine/`** -- only in this draw call and by the gate. No occupancy, no
clamp, no walkable-land fact moves. The rectangle changes by at most half a pixel.

**Two: author each master at its own rounded stall.** The gate was updated to round the same
way, so the checker and the renderer cannot disagree.

## 3. AND THE FIRST CUT PUT EVERY FAMILY ON ASPHALT AND THE SHEET SHOWED ME A WORLD WITH NO COLOUR IN IT

The orange barrel, the red-and-white barricade, the wooden bench, the green dumpster, the
blue mailbox, the orange cone, the burning fire barrel -- **all grey.**

Asphalt is right for a **car** because a car sits on the road. It is not right for a traffic
cone, whose orange is the entire reason it reads as a cone. **ONE PALETTE PER FAMILY means
the family is THE MATERIAL**, not the thing underneath it. Fixed by giving each family its
own approved ramp:

| ramp | families | why |
|---|---|---|
| **asphalt** | bin, dumpster, mailbox, bollard, barricade, bag, tyre, pole, lighttower, car | painted or galvanised metal on a street |
| **terracotta** | barrel, firebarrel, cone | bare corroded steel and hazard orange -- terracotta **is** the approved orange, so the cone stays a cone without inventing a tone |
| **deck** | bench, pallet | wood |
| **concrete** | rubble | broken masonry |

**The green dumpster and the blue mailbox are now grey, and that is a deliberate trade
written down rather than hidden:** no approved act-1 ramp contains green or blue, inventing
one breaks ONE PALETTE PER FAMILY, and COLOUR IS TERRITORY reserves saturated colour for
factions.

## 4. *** AND MEASURING THEM FOUND A SECOND, BIGGER FAULT NOBODY HAD NAMED ***

The shipped props *look* well coloured. They look that way **because they are photographs**:

```
bag 3,052   barrel 4,215   barricade 3,436   bench 2,849   bin 3,487
bollard 2,524   cone 2,751   dumpster 5,272   firebarrel 2,765
mailbox 3,043   pallet 2,863   rubble 3,477   tyre 3,125      (median colours per sprite)
```

**EIGHTY-FIVE OF ONE HUNDRED AND FIVE PROP SPRITES WERE OVER THE 64-COLOUR CEILING.**
The car was the only family anybody had ever cooked -- on 9/7, by this lane.

This is the fourth time this lane has found a photograph shipped as pixel art: the cars
(median 3,031 -> 9), the street (1,235 -> 7), the yard (16px blurred -> 44px lossless), and
now **every remaining prop in the game**. Fixing the size without the palette would have
left a photograph at the right size, so both landed together.

## 5. RESULT

| | was | now |
|---|---|---|
| families drawn at a fractional scale | **16 of 16** | **0 of 16** |
| sprites over the 64-colour ceiling | **85 of 105** | **0 of 105** |
| colours, worst sprite | 5,272 | **9** |
| silhouette drift, worst family | -- | **2.1 points** |

**Confirmed in the running game** with the one driver: 16 families, every one at scale 1,
zero fractional. **The prop-scale ratchet is re-pinned at zero** -- the debt this lane
measured two rounds ago is paid in full.

## 6. THE METHOD, UNCHANGED FROM ROUND 7 BECAUSE IT WORKED

1. Take the shipped master's **alpha mask only** -- it reads as the object because it came
   from one.
2. **Upscale the mask** and re-threshold. A mask has no pixel grid to break: the whole fault
   is that scaling *colour* by a fractional factor makes uneven pixels. Then despurred.
3. **Read the light and shade out of the photograph** at its own resolution, by luma, so
   every object keeps its own form without this tool asserting any of it.
4. **Re-shade from scratch** on the new grid, on its family's approved ramp, rust grown
   inward from the silhouette with **distance 0 and 1 forbidden** -- the rim is the lit and
   shadow edge the 45-degree law just drew.

## 7. REFERENCE CHECK

**Compared to:** the shipped props side by side at the size the game draws them; photographs
of the real objects (municipal bins, steel drums, traffic cones, jersey barricades, pallets,
rubble piles); and the repo as its own ruler -- the craft ceiling, the 45-degree law, the
approved act-1 ramps.

**Structural rules taken:** each object's own light and shade is read from its photograph
rather than asserted; rust starts at the edges and seams and never on the rim or the middle
of a face; one light direction, upper-left.

**What changed from the reference:** the palette, deliberately and per material. A real
dumpster is green and a real mailbox is blue; these are on approved ramps because ONE
PALETTE PER FAMILY, and that trade is stated in section 3 rather than buried.

## 8. PROOF

- tool: `tools/bohemia_every_prop_its_own_size_cook_9_18_26.py` (measure / `--sheet` /
  `--write`; per-family target read from its own footprint, anchors after `PROP_B64` and
  proves its target holds a PNG, writes both copies, reads back both, refuses on a colour
  over the ceiling or silhouette drift past 8 points)
- renderer: `slices/BOHEMIA_CITY_WORLD.html`, `__A_STALL_IS_A_WHOLE_NUMBER_OF_PIXELS__`
- art: `slices/BOHEMIA_CITY_PROPS.js` and `banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt`
- picture: `records/target/COOK_EVERY_PROP_AT_ONE_TO_ONE_9_18_26.png`
- pre-push pass green: PROP SCALE 7/0 (**debt 15 -> 0**), PROPS 76/0, PIXEL CRAFT 30/0,
  ART 45 16/0, REFERENCE CHECK 11/0, CITY TAB 64/0, ALPHA LOADS 20/0, REUSE-FIRST 209/5
  (all five other lanes' `*_patch.py`)
- full suite: 107 red at ad23d875; none named as this lane's
- no demo re-cut (rule 14a); the props file is loaded by reference
