# THE TAP PICKS WHAT YOU SEE (9/11/26, LIFE + CITY lane)

VAMILY `[tap picks]` THE-TAP-PICKS-THE-TILE-BELOW. His own bug, from his own frame, and
standing duty 8 says his bugs beat the lane's queue — so round 8 of `[more people]` waited.

## HIS WORDS, 9/8

> "when I click a tile in city builder mode it's not the tile it's sitting on, it's like
> below, very awkward, can you fix that?"

Frame: `records/target/PAOLO_THE_TAP_PICKS_THE_WRONG_TILE_9_8_26.png`

## THE ROUTING RULING NAMED TWO CAUSES AND BOTH WERE WRONG

The ruling that carried this row said "READ, NOT GUESSED" and named a draw-time `LIFT` of
1.6, plus page pixels not being scaled to canvas pixels. Reading the code:

- **The `LIFT = 1.6` is `FORCE_POVERTY_LIFT`**, an economics constant in the force model.
  Nothing in the aerial draw uses it.
- **`toCv()` has always scaled** by `cv.width / rect.width`. That was never missing.

Neither was the bug. A premise handed down is still a premise; this round measured.

## WHAT IS ACTUALLY TRUE, MEASURED WITH DRIVEN TAPS

    tapping a tile's GROUND CENTRE      25 of 25 exact, at every zoom
    tapping THE BUILDING YOU CAN SEE     0 of 38

The picker inverted the ground plane, which is exact arithmetic and was never wrong. The
eye is on the ART, which is painted **above** its own footprint. Those two answers agree
only on flat ground — which is why a road always worked, a tower never did, and the whole
thing read as "awkward" rather than broken.

## AND THE FIRST CUT OF THE FIX WAS A DEAD END

It taught the picker about `prism()`, the procedural block the renderer falls back to —
and then measured **zero prism calls at every zoom**. The valley is painted with baked
hero art; the prism path is legacy. A fix for a body the renderer never puts on the glass
would have gone green on a lie.

## THE FIX

The renderer records the rectangle it really blits, and the picker asks the art's own
pixels which tile the finger is on, taking the one painted **last**. One source of truth:
the pick cannot disagree with the picture unless somebody stops recording.

## THE PART THAT TOOK FOUR ATTEMPTS, AND A SCREENSHOT TO SEE

"Whose paint did you touch" is the wrong question for flat ground. A **road plate is
opaque well outside its own diamond** — tile (49,49)'s arterial art paints a solid pixel
over tile (48,48)'s ground centre — so the first working cut sent a tap on open tarmac to
the plot in front of it. **That is his exact bug, reintroduced by the fix for his bug.**

It was caught by looking at a screenshot with the finger and the selection both marked,
not by any number. Three further attempts failed because I reached for a threshold before
measuring the thing I was thresholding:

- the plate's **rectangle** says nothing — the arterial plate reaches 37px above its tile
  on a 24px tile, as tall as a small building, because a plate is mostly transparent margin
- the plate's **reach above its own diamond** says nothing either, for the same reason
- a first cut at 1.5 tiles sat **inside the building cluster** and silently threw away
  every school and shop in the valley

**THE CUT POINT WAS READ OFF THE ART.** Measured at TW=48, every district on screen, as
opaque height in tile-heights:

    desert wash rail cemetery water     1.05
    mall park trailer storage freeway   1.09 - 1.14
    farm suburb arterial                1.20 - 1.23
    ------------- nothing lives in this gap -------------
    school strip commercial             1.54 - 1.56
    terminal chapel apartment campus    1.71 - 1.76
    substation courthouse resort        1.83 - 2.06

Ground stops at 1.23 and buildings start at 1.54. The boundary is an **empty gap in the
art itself**, so the exact number inside it changes nothing — which is the whole
difference between a measured threshold and a tuned one.

Two more things the measurement corrected on the way: the search had to look **sideways**
as well as forward (a tile at x+3, y−1 also has a larger sum and was never being looked
at), and a **mirrored blit lands at a different rectangle** than the one it is issued at.

## AFTER

    buildings tapped   0 of 38   ->   38 of 40   (16/16, 15/16, 7/8 across three zooms)
    open ground                       36 of 36   (12/12 at every zoom)

## THE GATE

`gates/tap_picks_gate.js`, 6 pass / 0 fail, registered. Driven pointer events on **the
alpha** at 390x844 — his own surface, the only link he ever gets.

ONLY A DRIVEN TAP COUNTS. The pad taught the fleet this a week ago: an in-page hit test
said 12 of 12 while real taps landed 2 of 11.

MUTATION-TESTED TWO WAYS, each caught by a different leg:
  - restore the ground-plane picker   -> B1 and B3 red, buildings 0 of 40
  - drop the standing-up rule         -> A2 and B2 red, open ground 0 of 36

And two legs exist because the probe itself was wrong first:
  - **B2 tests OPEN ground only.** Its first cut tapped any flat tile's ground centre and
    scored 0 of 12 at the far zoom — which was the leg being wrong, not the picker. At
    TW=18 a tower's art legitimately lies across several rows of its neighbours' ground,
    so the right answer there IS the tower. Demanding the thing underneath a point you
    cannot see is a frozen premise.
  - **The probe had to dismiss the morning card**, the way a player does. `#daycard`
    covers the whole canvas on boot, and the first three runs reported every tap landing
    nowhere because of it. A checker that does not play the game measures itself.

## HANDED ON

- **PLUMBER `[tap gate]`**: the shared driven-tap gate this row was routed alongside. The
  method here — drive real pointer events, dismiss what covers the canvas, and select the
  sample by the art's own measurements — is the half that was hard; the pad half is
  already written.
- **Still open at the deepest zoom**: with a sample of 8 buildings at TW=48 one tap in
  eight lands on a neighbour. Below the gate's bar and reported rather than hidden.

Tab: CITY. Build stamp: 9/11a.
