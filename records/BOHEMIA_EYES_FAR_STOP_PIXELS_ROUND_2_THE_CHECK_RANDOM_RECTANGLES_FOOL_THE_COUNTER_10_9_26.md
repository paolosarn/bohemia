# EYES AND EARS -- [the far stop's pixels counted] -- ROUND TWO: THE CHECK
### 10/9/26 -- session eyes-5vql33

Row (rule 65a, COOK 50b5eb1d): count distinct painted pixels at the far stop, before and after
RUN's [the far end at two million pixels], against Battle Brothers' sourced floor. Round one
(records/BOHEMIA_EYES_FAR_STOP_PIXELS_ROUND_1_SCHOOL_NEAREST_NEIGHBOR_HAS_A_NAME_10_9_26.md) sourced
the row's own counting method against real image-forensics literature and resolved the missing
photo. This round builds `tools/bohemia_eyes_far_stop_pixels.js` and runs it, armed by round one.

## TWO REAL BUGS CAUGHT BEFORE A SINGLE NUMBER WAS TRUSTED

The first run of the instrument reported a clean number: 707,021 distinct pixels, 99.87% of 2x2
blocks uniform, only 158 colours total. Before writing that down, I looked at the actual
screenshot, same habit this lane has used before to catch a wrong reading. It showed a MOON in a
starfield, not the valley. CZOOM still read 0.208, the documented far-stop floor, but the canvas
had swapped to a different screen: an extra pinchOut() squeeze, meant to confirm the camera's own
minimum, had asked the engine to zoom out further while it was ALREADY sitting at that minimum,
which the engine answers not by refusing but by firing its own seam guard (SEAM_GUARD, skyEnter())
and opening the sky. CZOOM's own number stayed frozen through the swap, so reading state alone
could never have caught this -- only the screenshot did. Fixed: stop asking once toMap() lands.

The fix was not the whole story. With the extra squeeze removed, a SECOND run of the SAME,
unmodified toMap() call landed in sky mode on its own, same czoom reported both times it happened
and both times it did not. toMap()'s own reach is one continuous drag gesture covering the whole
1.0 -> 0.208 range in a single motion (the law's own 9/24 note on this exact camera: "the seam
fires on move 0, and moves 1 to 39 of the SAME finger-drag zoom the city camera"), so a drag whose
internal moves run slightly past the floor before the engine's per-move clamp catches up can cross
the seam nondeterministically, within one gesture. This is a real flake in the shared,
previously-proven driver, not this tool's own bug, and not caught by any prior tool because none
needed to land precisely AT the floor rather than merely under toMap()'s own 0.5 threshold. Worked
around here with a real recovery touch, not a state hack -- the engine's own documented "one tap
back down to the valley" (skyExit(), via a real pinchIn()), retried until it lands, refusing the
whole measurement rather than reporting the wrong screen if it never recovers. ROUTED to RUN and
PLUMBER: any future instrument measuring precisely at the camera's floor will hit this same seam.

## THE REAL NUMBER, AT THE REAL VALLEY

Third run: one recovery touch, czoom 0.2083, confirmed SKY false, confirmed on the real screenshot
(labelled mountains -- Frenchman, Black, Spring, Mt Charleston -- real highway route markers,
individually painted crowds and buildings on a raised city plot). This is the far stop.

Canvas buffer: 1134x2490 = 2,823,660 painted pixels. By the row's own literal method (unique colour
values per 2x2 block, summed -- round one's sourced, matched method): **1,485,640 distinct painted
pixels**, 52.6% of the buffer. That is the real "before" number for release line 3b.

AGAINST THE SOURCED FLOOR: Battle Brothers' own documented construction gives ~2,073,600 at 1080p
(round one's sourced stand-in). 1,485,640 is BELOW that floor -- not a pass yet -- but it is 71.7%
of the way there, a world away from COOK's own 9,216 figure, which was 0.44% of the same floor.

## THE CAUTION THIS ROUND EARNED, NOT ASSUMED

That gap between COOK's 9,216 and this round's 1,485,640 is itself the finding, and round one's own
sourcing already named the reason before this round found it live: Mahdian and Saic's own paper on
resampling detection (cited round one) warns that this whole family of detector is "very sensitive
to noise." COOK's own description of the far stop's method is "one flat colour plus NINETY RANDOM
RECTANGLES" per cell -- and random, procedurally injected noise is exactly the kind of signal that
defeats a block-duplication counter without adding one real, intentional, hand-placed piece of
detail. A SECOND INSTRUMENT, BUILT TO CHECK THIS DIRECTLY: round one's other proposed method,
"downsample until it stops changing," run for real this round as a sweep over candidate block sizes
(2 through 64) looking for the size at which the image is genuinely built from flat repeated
blocks. IT FOUND NONE: match drops from 23.88% of blocks uniform at size 2 to under 1% by size 4 and
to 0% by size 16 -- there is no clean larger repeat-block anywhere in this canvas. Battle Brothers'
own hand-painted hexes would not show one either, for the opposite, good reason (real continuous
tonal variation, not duplicated blocks); COOK's random-rectangle noise produces the identical
signature for the opposite, bad reason (noise that never repeats, but was never meant as content
either). THE HONEST READING: a pixel-count instrument, round one's own sourced choice, genuinely
cannot tell these two apart, and this round found the live demo sitting in exactly the blind spot
that caution predicted, not a hypothetical one. 1,485,640 is a real, correctly-measured number; it
is not, on its own, evidence the far stop looks like Battle Brothers.

## THE RECORD

Three screenshots: records/eyes_far_stop_pixels/far_stop_canvas.png (the map art, clipped),
far_stop_full_phone.png (his full profile with the HUD), and the earlier sky frame kept in git
history on the superseded commit as the documented false start, not reshot. Full numbers:
records/eyes_far_stop_pixels/report.json.

## ROUTED

- RUN and PLUMBER: toMap()'s own gesture can cross the valley's own seam into sky mode
  nondeterministically when landing precisely at the camera's floor (zmin); the shared driver's
  `there()` check (czoom < 0.5) does not catch this, only a direct SKY flag read and a real
  screenshot do. Worth a gate leg if any other lane ever needs the exact floor, not just "on the
  map."
- RUN's [the far end at two million pixels]: the "after" measurement is still owed, premise
  unchanged from round one (that row is still OPEN). When it ships, re-run
  tools/bohemia_eyes_far_stop_pixels.js unmodified for the after number, same instrument, same
  method, a real before/after.
- COOK / whoever owns the far stop's painter: the random-rectangle noise is cheap to generate and
  genuinely defeats a block-duplication counter, but it is not free -- it is the reason this
  round's own instrument cannot certify real improvement without a human eye on the actual
  screenshot too. Worth knowing before trusting a future pixel-count alone.

## SHIP TEST FOR THIS ROUND

A real instrument, armed by round one's sourced methods, measured the real demo's far stop and
caught two of its own wrong readings before either was reported -- one from its own extra gesture,
one from the shared driver's own flake -- using the same "look at the actual screenshot" discipline
this lane has used before, not a new habit invented for this round. The real "before" number is
posted: 1,485,640 distinct painted pixels by the row's own method, against Battle Brothers'
2,073,600 floor. Round one's second proposed method (the block-size sweep) was built for real, not
left as a plan, and it independently confirmed the round's real caution rather than just restating
it: COOK's random-rectangle noise produces the same signature a pixel counter would read as
"detailed," which round one's own sourced caveat already warned against. The after number and the
Battle Brothers side both wait on RUN's still-open row, named, not forced.
