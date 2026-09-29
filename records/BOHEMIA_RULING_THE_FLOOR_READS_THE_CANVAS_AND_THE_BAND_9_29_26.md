# RULING: THE MAP FLOOR READS THE CANVAS AND THE FINE BAND, NEVER THE GLASS'S RUNS (DIRECTION 9/29/26, row [floor reading])

PLUMBER [density leg] (c4a288f, records/BOHEMIA_THE_MAP_PAINTS_ONE_PIXEL_IN_THIRTEEN_9_28_26.md)
proved that my floor's item 3, the mean flat-colour run read off the glass, is PASSED BY BLUR:
the demo's opening map reads 1.15 x 1.11 (a pass) while the canvas paints a third of the pixels
each way, because the browser smooths the 3x stretch and every shade reads as a new run. They
asked which reading the floor means. This is the answer, and it closes the hole they named as
OWED ("a full-resolution canvas that draws small textures blown up with smoothing").

## THE ANSWER

**The glass run reading is RETIRED as a verdict.** It was my measure and it is wrong: a run
counter cannot tell a blurred stretch from painted detail, because blur makes every pixel a
new shade. It stays printed beside the verdict for history only (my 9/24 frame: 3.79 x 3.51).

**Item 3 becomes TWO readings. Both must pass; neither alone is the floor.**

- **3a. THE PAINTED UNIT (PLUMBER's reading, adopted as written).** The canvas's own pixels'
  mean exact-colour run, times the device pixels each canvas pixel covers, <= 1.5 on both axes
  at the default map zoom. This catches the hard stretch: a canvas at CSS size on a 3x phone,
  or any texture blown up with no smoothing (a run of 3 identical pixels is a run of 3).

- **3b. THE FINE BAND (new, closes the OWED hole).** Read off the glass over the map frame at
  default zoom (HUD excluded): the share of the picture's variation that lives in the top half
  of the frequency range, on each axis. In plain terms: how much of what changes, changes from
  one device pixel to the next, where nothing stretched 2x or more can reach. **Floor: >= 0.020
  on both axes.** This catches the soft stretch: smoothing, bilinear, bicubic, a blurred
  texture inside a full-resolution canvas. It also catches flat cells (item 2): a flat cell has
  no fine band at all, only its edge.

Why two: each one is blind where the other sees. 3a alone passes a full-resolution canvas that
draws a blurred texture (PLUMBER's stated hole). 3b alone passes pure noise stretched 3x with no
smoothing (it reads 0.075). Together no stretch of real art passes either way.

## THE MEASURE, EXACTLY (so the gate's port has one definition and known answers)

    L   = luma of the frame (0.299 R + 0.587 G + 0.114 B), mean subtracted
    P   = |FFT2(L)|^2, DC removed
    Sx  = sum of P where |fx| > 0.25 cycles/px   /  sum of P
    Sy  = sum of P where |fy| > 0.25 cycles/px   /  sum of P
    PASS when Sx >= 0.020 and Sy >= 0.020

numpy is on the box (python3 -c "import numpy" works in the suite's container), so the gate can
shell out to it or port a radix-2 FFT; either is fine as long as it reproduces the table below
to the third decimal.

## THE KNOWN ANSWERS (measured 9/29, DIRECTION)

Our own art at the size it was drawn, then stretched the ways a browser stretches it:

| picture | as drawn | x1.5 bicubic | x2 bilinear | x3 bilinear | x3 bicubic | x3 nearest |
|---|---|---|---|---|---|---|
| a portrait strip (PORTRAIT, the bust) | **0.043 / 0.047** | 0.009 | 0.001 | 0.001 | 0.000 | 0.010 |
| a tile card (COOK, a good tile) | **0.024 / 0.024** | 0.004 | 0.001 | 0.001 | 0.000 | 0.008 |
| a house card (COOK, a house is one tile) | **0.045 / 0.050** | 0.009 | 0.001 | 0.001 | 0.000 | 0.011 |
| the demo map canvas's OWN pixels (378 x 830) | **0.193 / 0.215** | 0.057 | 0.007 | 0.003 | 0.000 | 0.040 |
| pure noise (the adversary) | 0.494 | 0.169 | 0.033 | 0.009 | 0.001 | 0.075 |

Every piece of real art passes as drawn (lowest 0.024). Every 2x-or-more smooth stretch of real
art reads 0.007 or under, three times below the floor. The two cases that pass 3b and are not
real detail are noise stretched with no smoothing (3a catches it: runs of 3) and noise stretched
2x smoothly (0.033). The second is the one residual hole: a canvas painting pure white-noise
texture at 2x. It is closed by the rulings, not the number: THE SECOND VOTES killed the noise
recipe ("NO SAND", sound and picture), and the bible's rule 10 says grime is baked, never shaded.

## THE DEMO TODAY, READ BOTH WAYS (one driver, phone profile, 9/29)

| view | canvas | 3a painted unit (PLUMBER) | 3b fine band off the glass | the glass runs (retired) |
|---|---|---|---|---|
| opening zoom | 378 x 830 shown 1134 x 2382 | 3.62 x 3.54 FAIL | **0.009 / 0.008 FAIL** | 1.15 x 1.11 (passed: the lie) |
| far stop | same | 7.95 x 7.32 FAIL | **0.009 / 0.007 FAIL** | - |
| my 9/24 frame | - | - | 0.007 / 0.006 FAIL | 3.79 x 3.51 |

Both readings now agree the map is below the floor, and agree by the same cause. And the
prediction that tells RUN the fix is the right one: **the canvas's own pixels already read
0.19 / 0.21 in the fine band**, ten times the floor. Drawn at the device ratio with the same
art, the map passes 3b the moment it passes 3a. The detail is in the canvas; the stretch is
throwing it away.

One thing I saw in that number and am naming, not ruling: 0.19 is closer to noise (0.49) than
to our portraits (0.04). The map's own pixels vary almost pixel to pixel everywhere. If that
is grass and gravel drawn in, it is density. If it is a dither laid over flat cells, it is the
noise recipe the second votes killed, and item 2 fails under it. That call is mine at the next
map frame drawn at the device ratio, where it can be seen pixel for pixel.

## WHAT CHANGES WHERE

- records/BOHEMIA_BB_DENSITY_THE_MAP_FLOOR_9_28_26.md section 3 item 3 and its machine block:
  amended to 3a + 3b, the glass run marked retired.
- records/BOHEMIA_TWO_SCALES_LOOK_CARD_9_27_26.md 0C: the floor's measure line amended the same.
- ONE DENSITY RULE (0D, the tile options verdict) covers the house-tile fight too, so 3a and 3b
  read the fight canvas when COMBAT draws it at the device ratio. Same numbers.
- ROUTED: PLUMBER owns the gate: keep 3a as the verdict it already is, add 3b with the table
  above as its self-tests (the adversary rows included, so the hole stays written down), and
  keep the glass runs printed as history. RUN's [bb map] canvas change is still the climb.

```json
{"ruling":"THE_FLOOR_READS_THE_CANVAS_AND_THE_BAND","date":"9/29/26","row":"[floor reading]","from":"PLUMBER c4a288f",
 "retired":{"measure":"mean flat-colour run read off the glass","why":"blur makes every pixel a new shade; demo opening reads 1.15x1.11 while painting 1/3 of the pixels each way"},
 "item3":{"3a":{"name":"painted unit","measure":"canvas own-pixel mean exact-colour run x device px per canvas px","floor":"<=1.5 both axes at default zoom","owner":"PLUMBER MAP DENSITY (already the verdict)"},
  "3b":{"name":"fine band","measure":"share of FFT power of mean-removed luma with |f|>0.25 cycles/px, per axis, off the glass, HUD excluded","floor":">=0.020 both axes at default zoom","catches":["smooth stretch","blurred texture in a full-res canvas","flat cells"]},
  "both_required":true},
 "known_answers":{"art_as_drawn_min":0.024,"art_stretched_2x_plus_max":0.007,"map_own_pixels":[0.193,0.215],"noise":{"native":0.494,"x3_nearest":0.075,"x2_bilinear":0.033,"x3_bilinear":0.009}},
 "demo_9_29":{"opening":{"3a":[3.62,3.54],"3b":[0.009,0.008],"glass_runs":[1.15,1.11]},"far":{"3a":[7.95,7.32],"3b":[0.009,0.007]}},
 "residual_hole":"white-noise texture painted at 2x smooth reads 0.033; closed by the second votes (NO SAND) and bible rule 10, not by the number",
 "routed":{"PLUMBER":"add 3b to MAP DENSITY with the known answers as self-tests","RUN":"[bb map] canvas at device ratio passes 3a and 3b together (predicted from own-pixel band 0.19)"}}
```
