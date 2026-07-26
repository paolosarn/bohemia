# BOHEMIA — THE REASSEMBLY TEST (ART lane, 7/26/26)
# amendment C of the art-first reset, run for the first time

## THE RULE

> **THE ANTI-BIOSHOCK RULE:** the painted mockup is not the constitution — the
> target phase's acceptance test is CUT the picked mockup into the real starter
> tileset and REASSEMBLE the identical frame from those tiles on the real render
> path. The tile-reassembled frame is the framed target. **If reassembly looks
> worse, the mockup lied; fix before locking.**

## THE VERDICT: THE MOCKUP LIED

Measured before anything was built, by cutting the shipped target plate on the
contract's own 38px grid:

| variant | cells | UNIQUE tiles |
|---|---|---|
| the shipped plate | 264 | **262** |
| dirt pass + vignette off | 264 | 256 |
| …and cast shadows off | 264 | 240 |

262 unique tiles for 264 cells. **The painting was using a different one-off tile
for almost every square on screen.** That is not a world — a world built that way
needs a unique tile per cell of the entire valley. Every cell had drawn its own
random pool pick, its own random flip, and its own row-by-row gradient.

This is exactly the failure amendment C was written to catch, and it caught it
on the first run. Nobody had to notice it in a screenshot.

## THE FIX: A REAL, BOUNDED, NAMED TILE SET

`banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt` — **38 tiles** for the same 264
cells, plus 11 named sprites and the cast-shadow rects. Every tile is generated
once from approved material and reused; every tile carries a plain-English
description, per NAME IT OR DON'T DRAW IT.

- **ground (16):** asphalt ×3, centre line, sidewalk ×3, kerb, gutter, crossing,
  yard ×3, concrete ×2, dirt
- **walls (10):** stucco ×3, base course, under-eave course, window, boarded,
  left corner, right corner, and the two halves of the 2-tile door
- **garage (2):** the open bay's top and bottom
- **roof (10):** slope, ridge, eave, four hip corners, gravel deck, parapet

## WHAT THE FIRST REASSEMBLY LOST, AND WHY

The first pass looked markedly worse than the painting, and the reasons were
specific and fixable, not vague:

1. **No silhouette.** A row of wall tiles has no ends, so every building ran off
   the edge of the world as one continuous band. → **wall corner tiles** (a lit
   step on the left edge, a shaded step on the right).
2. **The roof was a stripe.** A hip roof is a trapezoid and a trapezoid is not a
   grid of squares. → **four hip-corner tiles** carrying the diagonal, with the
   outside of the cut **transparent**, so the roof reads as a shape sitting on a
   house.
3. **Nothing sat on the ground.** A cast shadow cannot live in a ground tile — it
   would need a unique tile per building per hour of day. → the shadows ship as
   **DATA** and the renderer draws them **at runtime**. This was the single
   biggest loss.
4. **No gaps between buildings.** → the map lays a dirt alley between houses.

After those four, the reassembly holds. Mean absolute difference from the
painting is **34/255**, and essentially all of it is the two poster passes (the
dirt noise and the vignette) which are a full-screen post effect at runtime, not
art.

## WHAT THIS CHANGES

- **The tile-reassembled frame is now THE TARGET**, per amendment C, and the
  judge page leads with it. The painting is shown underneath as the thing it was
  cut from. Paolo's one tap applies to the tiled frame, because that is the one
  the engine can actually draw.
- The render contract's pipeline rule is now proven, not asserted: the frame is
  drawn on a real browser canvas, offscreen at 1×, integer-blitted, smoothing
  off (`slices/BOHEMIA_REASSEMBLY_7_26_26.html`).
- Any future target that cuts into more tiles than `MAX_TILES = 96` fails the
  build.

## WHAT IS STILL HONEST TO SAY

- The reassembly is **close to but not identical to** the painting, and it never
  will be while the painting carries full-screen noise. That is correct: those
  passes belong to the renderer.
- The walls are still one tan material because the approved wall corpus is one
  tan material. That is a **corpus** problem, not a tiling problem, and it is the
  same open note from the previous round.
- The palette is still unindexed (46,082 colours). Section 6 of the render
  contract still says so.

## FILES

- `tools/bohemia_starter_tileset.py` — cuts the set, lays the map, writes the page
- `tools/bohemia_reassembly_shot.js` — drives the real canvas and saves the frame
- `banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt` — 38 tiles, the map, the sprites, the shadows
- `records/target/REASSEMBLED.png` — **the framed target**
- `records/target/TILESET_CONTACT.png` — every tile in the set, labelled
- `gates/target_screen_gate.py` — 1,074 checks, the reassembly test among them
