# EYES AND EARS -- [zoom range measured] -- ROUND THREE: THE FAR END, CONFIRMED EXACTLY
### 10/1/26 -- session eyes-5vql33

Round two measured the near end (ours vs Pocket City 2's shot 02, 0.75x, same order of
magnitude) and left the far end open, naming two precise blockers: whether the live zoom
variable is denominated in the engine's own 96 m tile, and the lack of a person-scale anchor in
his own far screenshots. This round closes the first blocker completely and finds it makes the
second one unnecessary -- the real finding is bigger than a missing anchor.

## THE VARIABLE, CONFIRMED, NOT GUESSED

`TW` (the live iso tile pixel width) is exactly "pixels drawn for one 96 m overworld tile,"
confirmed two ways: the engine's own constant (`engine/bohemia_overmap.js`:
`TILE_FINE=128, CELL_M=0.75, TILE_M=TILE_FINE*CELL_M` = 96 m) and the city-world file's own base
declaration (`TW0=18, TH0=9`) plus its own comment naming TW0/TH0 as "the scale the pad already"
uses for one tile. `TW = TW0 * CZOOM`. No estimate needed on this side at all -- it is read
straight from the source that generates the valley.

## OUR CAMERA'S OWN FULL RANGE, EXACT

`zoomBounds()` (the function that caps the pinch) returns `[zmin, zmax] = [fit, 2.6]`, where
`fit` on this phone profile measured 0.208 (matching every prior round's own reading). So CZOOM
runs 0.208 to 2.6 -- not just the 1.0 "default" state prior rounds read off as if it were the
near end.

| | CZOOM | TW (px/tile) | metres per pixel | pixels per metre |
|---|---|---|---|---|
| far (fully zoomed out) | 0.208 | 3.7 | 25.6 m/px | 0.039 px/m |
| default resting state | 1.0 | 18 | 5.3 m/px | 0.19 px/m |
| **near ceiling (the pinch's own maximum)** | 2.6 | 46.8 | 2.05 m/px | **0.49 px/m** |

**Our own camera's own ratio, far to its own closest: 12.5x.** Not an estimate -- both ends come
from the same constant and the same live-read `zoomBounds()` ceiling.

## THE REAL FINDING: THE GAP ISN'T A MISSING NUMBER, IT IS A MISSING CAMERA

Pocket City 2's shot 02 (a man walking, not even its closest shot) measured 88 px/m in round two.
Our camera's own absolute best zoom-in (CZOOM 2.6, the ceiling `zoomBounds()` allows) reaches only
0.49 px/m -- **Pocket City 2's shot 02 is about 180x finer than the sharpest our own pinch camera
can ever draw.** Compare that to the near end this whole row is actually about -- "a person up
close, full 112 px art, the barber, the talker" -- and the honest answer is that comparison cannot
even be run on this camera, because that screen is not reachable by continuing to pinch in. It is
a different screen entirely (a tap on a person opens the portrait/barber/dialogue view), which is
exactly what the ruling itself already named as the gap in plain words before this round put a
number on it: "the demo today has a two-stop zoom... the near end (a person up close) is the
talker's portrait and the barber." Round two's "0.75x, same order of magnitude" result was real,
but it compared Pocket City 2's shot 02 against a SEPARATE, non-zoomable screen of ours, not
against where our own continuous camera actually reaches. Our camera, measured honestly end to
end, never gets there at all.

So the two numbers that answer the row in full:
- **Our continuous map camera's own range: 12.5x** (0.208 to 2.6 CZOOM), a little over three
  cartographic zoom-levels (2^3.6), far short of Pocket City 2's own stated **roughly three orders
  of magnitude (~1000x, about ten zoom-levels)** end to end on ONE camera.
- **The near end itself is not a zoom stop on our side at all; it is a hard cut to another
  screen**, which the ruling's own words ("one continuous pinch, no mode, no cut") already name
  as the thing to fix. This round supplies the number that makes the gap concrete: about 180x of
  magnification missing between where our pinch camera tops out and where "a person up close"
  actually lives.

## RULE ZERO

The two engine constants (`TILE_FINE`, `CELL_M`) and the camera's own `zoomBounds()` function were
read directly from the committed source, not inferred from behaviour; the live `zmin` reading
(0.208) matches every prior round's own independent measurement of the same value through the
driver, which is the cross-check that it is the real, in-force ceiling and not a stale comment.

## LIVE VERIFICATION, DRIVEN NOT READ (the proof the table above is not just source-reading)

Ran the driver itself: `d.toMap()` then six `d.pinchIn()` calls, reading `d.state()` before and
after. FAR read `{mode:"city", tw:3.7, czoom:0.208}` -- matching the table exactly. NEAR read
`{mode:"human", tw:46.8, czoom:2.6}` -- the live camera actually stopped at the exact 2.6 ceiling
the source predicted, and pinching past it did not sharpen the view further; it flipped `MODE` from
`"city"` to `"human"` entirely (`swapMode()`, the same function the game calls "DROP IN," the one
the current ruling itself calls out for cutting instead of flowing). Checked what "human" mode's
own zoom actually is, since this matters for whether that flip reaches anywhere near Pocket City
2's close-up: `HWALK_STOPS=[11]` is a ONE-ENTRY array -- the walking screen has exactly one ground
scale (`HC=11` px per fine cell) and no further zoom-in of its own at all, while the person stays
pinned at the LOCKED 112 px box regardless (rule 21/34, "the person never grows with the zoom").
So the live drive proves the finding rather than just the source: the cut is not a smooth
continuation that happens to run out of precision, it is a dead stop into a screen that cannot
zoom in any further than it already does. There is no in-between to measure; PC2's close-up has no
counterpart on this camera to compare it against.

## ROUTED

Not a bounce-back: the ruling already named this gap in its own words before this row existed
("the near end... is the talker's portrait and the barber," a separate screen by design, not yet
a flaw anyone is unaware of). This round's job was only to put the exact number beside it, for
whoever eventually builds the real continuous camera the ruling asks for.

## SHIP TEST FOR THIS ROW

Round one armed the ruler. Round two measured the near end on both sides and found it close.
Round three confirms the live variable exactly (no more estimate), measures our own camera's full
range end to end for the first time, and finds the row's real answer: our ladder does not merely
jump between two rungs, it is missing the rung the whole row was asked about, by a measured 180x.
**[zoom range measured] is done as far as this lane can take it without a camera that does not
exist yet; the number is now exact where round two could only measure part of it.**
