# THE MAP AT YOUR PHONE'S PIXELS (RUN, 10/1/26)

VAMILY `[map pixels]` G1, rule 38a. PLUMBER's measurement:
records/BOHEMIA_THE_MAP_PAINTS_ONE_PIXEL_IN_THIRTEEN_9_28_26.md

> **PAOLO 9/28:** *"how many pixels the Battle Brothers map is and we need to have that exact same
> number at the bare minimum... that has to happen like now."*

## THE CHANGE

The map canvas was created at the page's CSS size (378 x 830) on a 3x phone, so every pixel it
painted was shown as a 3 x 3 block. Now:

- the canvas's backing store is **1134 x 2490 on the map** (CSS size x the phone's pixel ratio);
- every layout line in the city file reads the CSS size (`CVW` x `CVH`, 156 reads moved off
  `cv.width` / `cv.height`), and the context carries the ratio, so nothing that draws had to change;
- **the street stays at one** (it repaints every frame and is no longer how the city is crossed,
  38b); swapping back to the map puts the ratio back;
- the two places that copy the canvas whole read the backing size; the floor copy for the fight
  multiplies its crop by the ratio.

## MAP DENSITY, PLUMBER'S GATE: RED ON PURPOSE SINCE 9/28, GREEN NOW

**13 passed, 0 failed** (it was 8/4: G1 and G2 red on both surfaces). One painted unit at the
opening zoom: **1.28 device px** (the floor is 1.5; it was 3.5).

## THE COST, MEASURED, AND PAID

Nine times the pixels made a full map paint **67 ms -> 115 ms** on this box (3,869 tile draws a
frame; the extra time is all pixel fill). The glide repaints the whole map on every frame of a
journey, and UI's speed pad measured it: **3x delivered 1.5x** (12 blocks in 4 s against 1x's 8).

So **the ground is painted once** into a picture a margin bigger than the screen (72 CSS px at the
opening zoom) and **slid under him while he moves**; only what moves is drawn on top (him, the
parties, the crowds, the route, the plates). The taps and lamps the paint recorded slide with it.
It is painted fresh whenever the map stands still, when he moves past the margin, when the zoom,
size, ratio, night or legend change, and at least every 4 s while moving (1.5 s was the first
number; at 4x CPU it repainted six times in eight seconds and the repaints were the cost).

| travelling on the demo, 8 s, this box | frames a second | blocks crossed | map paints |
|---|---|---|---|
| main, 378 x 830 | 4.4 | 15 | every frame |
| now, 1134 x 2490 | **10.8** | 15 | 5 (2 age, 1 margin, rest before the tap) |
| main at 4x CPU | 0.7 | 6 | every frame |
| now at 4x CPU | **1.4** | **9** | 3 |

A slid frame paints in **9 to 13 ms**; a fresh one in 74 to 106.

## TWO THINGS THE SLIDE TAUGHT ME ABOUT THE OLD MAP

1. **Whether the ground art was smoothed depended on what drew last.** A resize turns smoothing
   on; his marker code turns it off and never back. So the first frame after every resize drew the
   ground smoothed and every frame after it unsmoothed. Pinned to unsmoothed (the steady state
   every player saw).
2. **The building art landed on fractions of a pixel**, so unsmoothed it was sampled a hair
   differently at every camera position: the ground shimmered as the camera slid. Snapped to whole
   CSS pixels, where it always landed at one pixel per CSS pixel.

What is left after both is the browser's own float32 sampling: two FRESH paints from neighbouring
camera spots differ by one-phone-pixel specks on 2 to 4% of pixels, and a slid frame differs from
a fresh paint by the same 0.7 to 2.1%. A slide that is one CSS pixel out misses by 66%. The gate
holds the placement and the 5% ceiling, and says in its source why the number is not zero.

## CHECKS

**THE MAP AT THE PHONE'S PIXELS**, new, **16/0**, registered slow. Mutations, five, each caught and
restored: ratio pinned to one -> 2 red; the slide the wrong way -> 1; the taps not slid -> 1; no
cache -> 2; "always moving" (never paints fresh when he stops) -> 1.

**Five checkers re-aimed to the unit, not loosened** (each did map arithmetic with `cv.width`,
which is now the backing size): map_knows_people, the_face_on_the_map_is_his, the_one_that_is_you,
tap_picks, faction_between. Layout in CSS pixels; pixel reads from a CSS-size copy of the canvas,
the picture each was written against.

## ROUTED

- **PLUMBER [native map]** stays PLUMBER's. This is its shape (painted once, movers on top) on the
  ground only. What is left for that row: paint the margin strip that came into view instead of
  the whole picture (the 100 to 140 ms repaint every few seconds is the last hitch), and a phone.
- **COMBAT [device canvas]**: the same move for the fight canvas. The pattern is `cvSize` /
  `CVW` / `CV_DPR` at the top of the city file and the two lines in `fit()`.
- **COOK**: the land can now be painted at 1:1. Flat cells would lower the density MAP DENSITY now
  holds green, so the land cook has to carry texture at the phone's pixels.
