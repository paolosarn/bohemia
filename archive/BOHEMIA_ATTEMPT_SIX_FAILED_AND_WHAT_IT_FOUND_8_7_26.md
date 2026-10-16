# ATTEMPT SIX AT THE GROUND FAILED, AND THE VERIFICATION IS THE DELIVERABLE

8/7/26 · ART LANE · Paolo chose option A ("build the two-layer system") and said
"ultracode go"

## WHAT WAS RUN

Eleven agents. Three researchers in parallel (the render path, the art measured
from pixels, the laws), two independent designs judged against one criterion —
*which survives somebody looking at it* — one implementer, then **three skeptics
each told to refute it**, then a decision agent with a hard rule: ship only if the
gates are green AND at least two of three skeptics fail to refute AND nobody
reports a regression in an already-finished district.

## THE RESULT

**Gates green. All three skeptics refuted it. Reverted, byte-clean.**

That is the system working exactly as designed. This is the sixth ground attempt
and the first one that was killed *before* Paolo saw it, by machinery instead of
by his eye.

## WHAT THEY SAW, MEASURED ON THE LIVE CANVAS

- **Saturation three times every approved ground.** New soil rendered
  `(252,196,109)` at 52-57% saturation against his shipping dirt and concrete at
  `(127-140,118-130,106-114)` and 16-18%. Apricot and turmeric, not Mojave.
- **The red channel clipped.** 65% of the railyard's new pixels and 43% of solar's
  hit R>=250; in full sun 94-99%. All red-channel texture destroyed. The concrete
  it replaced clips 0.8%.
- **The farm read as a barcode.** Two-cell orange bands alternating with one-cell
  untouched grey (the deliberately-bare crop rows), thirty alternations per
  portrait screen, every boundary razor-straight.
- **Downtown, which was finished and correct, became a beach.** 82.8% of the frame
  changed; 75.1% hot orange against 0.4% before.
- **Building shadows became hard orange staircases.** Invisible on grey concrete
  (delta 43), two and a half times the contrast on the new base (delta 109),
  composited per cell.
- **A visible grid at the 44px cell pitch** — 2.0x to 3.2x the field's edge energy
  at exactly the cell period.
- **Detail was deleted, not layered over.** High-frequency surface detail fell 59%
  downtown and 37% in the farm. His bought concrete's cracks, slab joints, manhole
  covers and weed tufts were overwritten by flat colour.
- **Half the target surfaces never changed at all.** 44.8% of railyard ballast and
  55.4% of solar's access road still returned null, so the exact thing this was
  meant to fix stayed grey.

## THE ROOT CAUSE, AND IT IS THE SAME ONE FOR THE SIXTH TIME

**Paolo's option A was: opaque base FIRST, then scatter transparent overlays ON
TOP. Only layer one was built.** No scatter pool was cooked. So the base landed as
a flat plane with nothing to break it up — which is precisely why it reads as
paint rather than ground.

And the tile pack was certified on the wrong measurement: the cook gated
*luminance* and never saturation, never hue, and never the value after the
in-game colour grade — which pushes toward a warm sun colour and drove red past
255. **VERIFY ON THE REAL SURFACE, failed identically to attempts one through
five.**

> **A VERDICT IS ABOUT THE OBJECT. IT IS NEVER ABOUT WHERE, OR WHAT FOR.**
> The soil pack is genuinely 24 UP / 0 DOWN. That is not a defence.

## WHAT THE SKEPTICS FOUND IN THE *SHIPPED* BUILD, WHICH IS THE REAL PRIZE

They were looking at the live game to compare against, and caught defects that
were already on Paolo's screen from my own 8/5 props work:

- **PURPLE-AND-WHITE STRIPED MARKET AWNINGS on railyard ballast.** Verified
  independently: `port market` idx 5 is **19.6% purple** by opaque pixel, idx 20
  also over the line. Both carry real UP verdicts.
  **PURPLE RESERVATION is a law about the world, not a matter of taste, and an UP
  on an object cannot licence a law breach.**
  **FIXED:** the cook now measures every tile's purple share and drops any that
  crosses 2% regardless of verdict; `exterior_pool_gate` re-derives it so the cook
  cannot quietly stop doing it. Two tiles dropped, zero remain. 37/37.
- **Still open, and Paolo's call, not mine:** the `camp` bucket puts a medieval
  cauldron on a tripod over a lit campfire, conical pavilion tents, a bakery cart
  with bread and fresh produce under market awnings into a dead Las Vegas. He
  thumbed "market stalls" 19 UP and "port market" 29 UP — as market stalls. I put
  them in a railyard. Same rule as everything else this week, and this time I am
  flagging it instead of deciding it. **[PENDING, Paolo]**

## WHAT IS TRUE NOW

The game is exactly as it was before the workflow ran, plus two purple tiles
removed and a law gated. Ground remains unsolved and is **not** getting a seventh
attempt from me. What a seventh attempt would need, in order:

1. **Build layer two first.** The scatter pool is the half that was never made and
   the half the whole plan rested on.
2. **Gate the tile on what the screen shows** — saturation, hue, and the value
   *after* the colour grade — not on raw luminance.
3. **Look at downtown and the suburb before believing any farm.**
