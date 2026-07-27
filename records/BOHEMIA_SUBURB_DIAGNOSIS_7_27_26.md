# BOHEMIA — WHY THE SUBURB LOOKS WRONG (diagnosis, 7/27/26, CITY lane)

> Paolo, 7/27: "The houses aren't good... I can't get outside the suburb. The
> door suck the house is this target art the garage is suck... you really should
> be using the suburb district."

He gave one instruction inside a pile of rejections: **use the suburb district.**
This is the answer to that instruction. It is a DIAGNOSIS, not a rebuild. Under
STOP PRODUCING rule 3 a rejected thing does not go back with a fresh coat, so
everything below is either (a) fixed because it is a mechanical defect that
contradicts the district's own data, or (b) written down for him to rule on
because it is taste and taste is his.

---

## 0. FIRST, THE THING THAT WAS ACTUALLY STOPPING HIM

"I can't get outside the suburb" was not the suburb. Movement is press-and-HOLD
on an arrow; iOS answers a long press on text with the Copy / Look Up / Search
callout; the alpha never set `-webkit-touch-callout` anywhere in 33MB. He was
fighting the operating system for every step. Fixed separately
(tools/bohemia_touch_guard_patch.py) and gated.

The map is cleared of the charge, measured: every suburb sample sits **16 to 50
steps** from a district that is not a suburb, and **7,645 of 7,649** built cells
can be walked out of. (The 4 that cannot are listed in §5 for the world lane.)

---

## 1. THE SUBURB DISTRICT *IS* BEING USED, AT FULL CANON SCALE

This needed checking before anything else, because "you should be using the
suburb district" reads as "you are not". The plumbing is correct:

- `BohemiaSuburb` generates a **128x128** tile grid (SZ=128, TILE=0.75m = 96m).
- The walked world's cell is **32x32** fine tiles (FN = OM.TILE_FINE = 32).
- `__subGrid` maps a **4x4 group of overmap cells to one 128x128 grid**, sliced
  1:1 — `res.g[(ty&3)*32 + y][(tx&3)*32 + x]`. No downsampling, no stretching.

A real cell (6,1) reads back:

| code | meaning | tiles | share |
|---|---|---|---|
| 0 | dead-ground yard | 554 | 54.1% |
| 2 | house | 268 | 26.2% |
| 1 | road | 96 | 9.4% |
| 6 | garage | 80 | 7.8% |
| 9 | house upper floor | 14 | 1.4% |
| 3 | driveway | 12 | 1.2% |

The generator's plot is intact and its proportions are the ones the dossier
describes. **The defect is entirely in how the art layer reads that plot.**

One consequence worth stating plainly, because it explains a lot of the feel:
one overmap cell is **1/16th of a neighborhood, 24m across**. Dropping in puts
you inside about two houses' worth of a plot that was authored as a whole walled
subdivision. Nothing is broken about that — it is what a 4x4 group means — but it
is why a drop-in never reads as "a neighborhood."

---

## 2. FIXED: THE DOOR WAS A DICE ROLL

Every exposed house tile picked its facade from a per-tile hash — 60% wall, 20%
window, 10% boarded, **10% door**. Measured across 24 real suburb cells:

- 727 exposed house fronts
- **62 doors**, one every twelve tiles, down every wall on every side
- 643 of those fronts face a **dead-dirt backyard** with no path to them

A house does not have six front doors. And the plot already knew where the front
was: the generator marks the **driveway apron (3)** and the **residential street
(1)** in its own legend. Of the 727 exposed fronts, 60 sit above a driveway and
24 above a street.

Now: a door is placed only where the house meets its driveway or its street, and
only on the leftmost tile of a contiguous run (a driveway is 3-4 wide, so that is
one door per approach). After the fix, measured on the same 24 cells:

- **17 doors, 17 of them reachable, 0 on backyard dirt.**

The generic-district path had the same dice roll and it was worse there: those
dossiers already declare their doors as **portal** tiles you step through, so a
hashed door painted on a wall is a door that **lies** — it reads enterable and is
not. That path now paints no doors at all. Gate: `gates/frontdoor_gate.js`.

**A REAL QUESTION FOR HIM, NOT DECIDED HERE:** 17 doors across 24 cells means
most houses have no front door, because in this plot the walkable approach runs
driveway -> garage, and the garage's own dossier says it has "a door into the
house". So most homes are entered through the garage. That may be exactly right
(it is how a Vegas tract house actually works) or he may want a front door on
every home. His call.

---

## 3. NOT FIXED, AND I CHECKED WHETHER IT WAS A BUG: THE RED-BRICK ROOFS

The houses read as red brick boxes. I checked whether the roof pool had been
mis-wired with wall textures. **It has not.**
`records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt` has him thumbing all 30
candidates UP, and `SA_TILES.hroof` holds exactly the 14 he approved as roofs:
`roof_shingle_0-5`, `roof_gravel_6-7`, `roof_stile_terracotta_21-22`,
`roof_stile_desertbrown_23-24`, `roof_stile_graybrown_25-26`.

So the red-brick read is those approved shingle tiles tiling at 16px across a big
flat rectangle. That is a **taste call and it is his alone** — the material is
what he approved, and nobody re-cooks it off a rejection. What is worth him
knowing: a tract-house roof has a ridge, a slope and a shadow, and a seamless
tile has none of those, so at any size above one house the roof reads as
wallpaper rather than a roof. If he wants that changed it is a new ask, not a
fix.

---

## 4. NOT FIXED, WRITTEN UP: TWO MORE THINGS HE IS SEEING

**THE FACADE IS ONE TILE TALL AND DOOR LAW SAYS TWO.** The chunk baker draws a
facade as a single cell (`x.drawImage(tex, i2*TPX, y*TPX)`). The INTERIORS obey
the 2-tile door law and `interiors_gate.js` asserts it byte-for-byte
(`g.drawImage(im,sx,sy-C,C,C*2)`). The exteriors do not. So a door outside is a
1-tile smudge at the bottom of a wall while the same door inside is a real
door — the inside and the outside disagree about the law. Changing it changes how
every building in the game reads, so it is his call, not a quiet fix.

**54% OF A SUBURB CELL IS DEAD DIRT, RENDERED AS ONE FLAT NOISE.** The share
itself is honest — a real subdivision is mostly yard, and act 1 is a dead world
with no vegetation ever. But it is drawn as a single blended texture per block
with no incident at all, so half of every screen is a flat tan void. This is
what WALKABLE-LAND LAW means by "dressed, never a void", except the law's gate
only checks pavement-vs-content ratios and cannot see "the ground is boring."
Dressing it is new content, which is frozen behind his rulings.

---

## 5. FOR THE WORLD LANE, NOT TOUCHED

4 cells of 7,649 are sealed — you can drop into them and never walk out:
`88,1 solar` · `92,8 estate` · `92,39 suburb` · `5,53 gypsum`. Measured by
flood-filling walkable tiles from the game's own drop-in point. ONE SYSTEM, ONE
SESSION: connectivity is the world lane's, and `landlocked_gate.js` is where it
belongs.

---

## WHAT THIS SESSION DID NOT DO

Did not re-cook a house, a roof, a garage or a door texture. Did not surface a
single candidate for judgment. He rejected those and the law says a rejection
ends the thing, not restarts it.
