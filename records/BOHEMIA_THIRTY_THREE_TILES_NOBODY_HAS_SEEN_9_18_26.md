# THIRTY-THREE TILES NOBODY HAS SEEN
# LIFE + CITY, 9/18/26, VAMILY row [side variants]
# THE-SIDEWALK-DRAWS-THREE-OF-ITS-THIRTY-SIX-TILES
# COOK [streets fixed] (fe5ba8d0) found the repeat. Paolo 7/14, desert_dominance_law:
# "too much diversity with the desert tiles."

---

## 1. THE ROW NAMED ONE COLLAPSE. THERE WERE TWO, ON THE SAME LINE.

The row is right: the suburb picks `c.gArtVariant = _sw % 3` at two sites while the
approved sidewalk pool holds 36 tiles. Measured on the demo, around the door, over
6,968 sidewalk cells, with **saTex itself as the oracle** (it caches one canvas per
resolved tile, so identical objects mean identical pictures):

**THREE TILES ON THE GROUND. Thirty-three of a judged bank had never been drawn since
the day it was approved.**

**And the second collapse is the bigger one, and the comment above the line already
said the right word.** It reads:

> PER PLOT, NEVER PER CELL: desert_dominance_law, Paolo 7/14 ("too much diversity
> with the desert tiles"). A per-cell shuffle turns a run of pavement into a
> checkerboard.

The code seeded on `tx>>2, ty>>2`. **`tx` and `ty` are OVERMAP cells**, so a 4x4 group
of them is **384 metres of street on one tile**. That is not a plot. That is a whole
neighbourhood, and it is why the same pavement runs to the horizon no matter how many
tiles the modulus lets through.

Fixing only the modulus would have given 36 tiles and still painted a quarter of a
kilometre with each one.

## 2. THE FIX IS A REMOVAL AND A REGRAIN, NOT A BIGGER NUMBER

**The modulus is gone, not widened.** `saTex` already maps any integer across the whole
pool, and it carries Paolo's 7/14 weather-rarity rule while doing it: 88% of picks stay
in the parent half of the bank, 12% reach the weathered siblings, which is the rule
that exists because an even shuffle made him ask "why did a bunch of the tiles change
colour". Pre-modding the variant to 3 is what threw that away. Handing it the raw
per-lot hash uses the bank the way the bank says to.

**The seed is the lot.** `BOH_LATTICE.LOT_FINE` — the one number this lane put in one
place under his 9/15 THE STEP IS A HOUSE ruling: 24 fine cells, 18 metres, the stride
the house generator actually packs on. One tile per lot is what a poured walk is, it
changes under your feet every house instead of every quarter kilometre, and it is
**still per plot and never per cell**, so the 7/14 ruling holds.

This is the first time the lattice constant has been read by something other than the
lattice, which is the whole point of having put it in one place.

## 3. MEASURED, SAME INSTRUMENT BOTH SIDES

    the approved bank holds        36 sidewalk tiles
    sidewalk cells sampled      6,968

                              before      after
      TILES ON THE GROUND     3 of 36    36 of 36
      patches of one tile         102         181
      median patch size       36 cells    16 cells
      biggest patch          423 cells   423 cells

The before numbers were taken by stashing the change and re-running the same probe, not
by remembering what it used to do.

## 4. THE GATE, AND THE LEG THAT PROTECTS THE OTHER HALF OF HIS RULING

`gates/the_sidewalk_uses_its_bank_gate.js`, in the suite as THE SIDEWALK USES ITS BANK.
9 pass / 0 fail.

**Leg B3 is the one that matters as much as the repeat.** A per-cell shuffle sends the
median patch to 1 and turns a run of pavement into a checkerboard, which is the exact
complaint the 7/14 law came from. The gate fails that as hard as it fails the repeat,
so nobody can close this row by breaking the other half of it.

Mutations, both run:

    seed per cell again   -> B3 red, median patch 1
    the old %3 back       -> A2 and B2 red, 3 of 36 on the ground

## 5. WHAT I FOUND NEXT DOOR AND DID NOT TOUCH

The same measurement swept every ground pool in sight. One other number stands out and
it is **not** this row:

    pool     holds   drawn on the ground
    side        36    3   -> 36   (this row)
    street      18    3
    hyard        3    3            correct already

**The roadway draws 3 of its 18.** But its variant comes from a different place — the
draw site's `const v = hash(gx,gy,404) & 3`, which is **per cell**, four values. Widening
a per-cell shuffle from 4 to 18 on the asphalt is precisely the change that produced his
7/14 complaint in the first place, so it is a look decision and not a mechanical one. It
needs an eye on it before a number, and it is named here with the count rather than
quietly widened.

`tf_ls` came back as NOT A POOL in `SA_TILES` — it lives in the separately loaded
tileform bank, so this probe cannot read its length. Said out loud rather than reported
as zero.

## 6. WHAT THE PICTURE SHOWS

Photographed at the door before and after, phone size. The kerb band across the lower
third of the screen was one pattern repeating; it now reads as pavement laid in
sections, with the weathered tiles showing up as lighter patches along it. It does not
read as a checkerboard, which is the thing leg B3 exists to keep true.

Shots: `records/side_variants/before_the_door.png` and `after_the_door.png`.

## 7. ONE THING I SAW ON THE GLASS AND COULD NOT EXPLAIN, SAID OUT LOUD

**A bright orange line runs the full width of the screen, about a fifth of the way
down, in BOTH shots** — the one taken this round and the one taken two rounds ago, at
the same place on screen. It is on his first screen and "glitches" is on his break
list, so it is worth writing down.

Three probes and I could not find its source: it is not a thin full-width element in
the walked city's document, not one in the demo shell's document, and there is no row
of saturated orange pixels on either canvas (`#cv` or `#modeFace`) when the page is
read after boot. So it is either transient — a flash both screenshots happened to
catch at the same moment after the door — or something these probes do not reach.

**Named, not diagnosed, and not claimed as a defect in anything.** The two shots are
the evidence. Whoever owns the shell's overlay should look at it with the shots in
hand rather than take a guess of mine.
