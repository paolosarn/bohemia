# THE FIGHT'S drawImage WALL, MEASURED FROM THE INSIDE (9/6/26)

PLUMBER lane, VAMILY row [fight headroom] THE-FIGHT-HAS-NO-HEADROOM, round 2.
Round 1 took the free 15 ms (the hidden panel). This is the fight itself.

## FIRST, A CORRECTION TO MY OWN LAST ROUND

Last round's record warned that the fight's profile composition swings between runs:
canvas blits read 60.9% on one run and 11.3% on the next. I profiled FOUR fights this
round to find what is stable, and the answer is that the 60.9% reading was the odd one
out. Four consecutive fights, all in the cover phase:

```
  (program)        80.05%   [79.72 .. 80.23]   4/4
  canvas blits     11.56%   [11.52 .. 11.70]   4/4
  the fight         2.12%   [ 2.04 ..  2.12]   4/4
  streetTile        1.33%   [ 1.16 ..  1.39]   4/4
  ms per beat: 498, 498, 497.5, 498
```

So the headline number is not "two thirds of a fight is drawImage". It is that
EIGHTY PERCENT OF A FIGHTING BEAT IS NOT JAVASCRIPT AT ALL. `(program)` is the
browser's own work: raster, composite, the pixel end of canvas calls. The fight's JS
is a small share of its own cost.

## SO I TIMED THE DRAW CALLS FROM INSIDE THE FIGHT

Wrapping the calls needs no attribution and no subtraction. Two samples, five seconds
of a real fight each:

```
  frames                    182 and 184   (about 36 a second)
  time inside the frame callback          125 ms per 500 ms beat
  drawImage calls           455,728 and 460,736
                            = 2,504 PER FRAME
  time inside those calls                  82 ms per beat  (65% of the callback)
  fillRect                  53,347         2 ms per beat
  clearRect                 364            save 1,638
```

**99.9% OF EVERY DRAW CALL IN A FIGHT IS THE SAME THING: a 24x24 street tile.**
455,182 of 455,728. The other 546 are a 112x112 source, which is the tile cache
filling itself.

## AND TWO OF THE FIVE TECHNIQUES ARE ALREADY DONE

The coordinator's research named five. Measured against the real fight:

```
  never scale inside drawImage    ALREADY CLEAN: 0 of 455,728 calls scale
  round x and y to whole numbers  ALREADY CLEAN: 0 of 455,728 are fractional
```

Whoever wrote that loop already floors both coordinates and blits at natural size.
Nobody should spend a round "fixing" either of them. What is left is the first three:
cut the CALL COUNT, pre-render, and layer.

## WHERE THE 2,504 CALLS COME FROM, AND WHY THEY ARE CACHEABLE

One blit per visible cell, every frame, in `drawField`:

```js
    const _st = streetTile(_sk, _si, Math.ceil(t)+1, (h/_sn)|0);
    if(_st){ x.drawImage(_st, Math.floor(sx2), Math.floor(sy2)); }
```

The tile a cell shows is `hash(wx, wy)` -- a pure function of the cell's world
coordinates. It cannot change during a fight. What changes is the camera.

So the composed floor is a pure function of a short, enumerable list, and that list IS
the cache key:

```
  t (the tile pitch)      cx, cy (camera)      offx, offy (G.worldOff)
  gx0, gx1, gy0, gy1      G.arenaKind          G.cityRoom w/h, G._roomAt
  STREET_READY
```

Nothing else is read by the loop. Same key, same picture, provably.

## THE ONE THING THAT DECIDES WHETHER THIS REACHES THE TARGET

The fight's own frame callback is 125 ms of a 500 ms beat. The beat is 497.5 ms busy.
**So about 370 ms per beat is happening OUTSIDE the fight's JavaScript** -- browser
raster and composite, most of it the pixel end of those 2,504 calls a frame.

That matters for the target of "under 400 ms of 500":
- Deleting every line of the fight's JS would only reach ~370 ms per beat.
- Which is under 400 -- but only just, and only if the raster falls with the calls.
- Cutting the call count is therefore the ONLY lever that moves both halves at once,
  because each call carries both its JS cost and the raster it asks for.

## WHAT I DID NOT DO, AND WHY

I did not change the renderer. Composing that floor into an offscreen canvas has to
happen under the same transform the loop draws through (`uzInvert` maps the camera),
and getting that wrong is a silently wrong picture rather than a crash. This lane can
measure a fight but it cannot yet SEE one: there is no screenshot pass on the fight,
EYES AND EARS has not built one, and "verify on the real surface" for a renderer means
looking at it. Shipping unverified surgery into the one surface the 120 BPM law governs
is a worse trade than waiting a round.

## I BUILT THE EYE, AND IT IMMEDIATELY TOLD ME MY PLAN WAS WRONG

gates/bohemia_fight_pixels.js boots the demo, walks into a fight through the real door,
waits for the cover phase with the camera settled, and fingerprints the fight canvas as
a 16x16 grid of channel averages -- a DISTANCE rather than a hash, because a hash
answers "identical or not" and a noise floor has to be expressed in a number.

ITS FIRST ANSWER WAS A LIE AND IT IS WORTH WRITING DOWN. It reported a noise floor of
EXACTLY ZERO across three boots whose camera zoom was visibly different (1.0735, 1.0209,
1.3). A perfectly stable picture from a visibly different camera is not a stable fight,
so I went looking: `querySelector('canvas')` was returning a 183x54 LOGO. The fight
frame holds three canvases and the field is the third, `#cv`, 780x1354. The tool was
photographing a logo. Caught by asking why a number was too good, not by being pleased
with it.

POINTED AT THE REAL CANVAS, THE ANSWER CHANGED COMPLETELY:

```
  three boots of ONE unchanged tree
  distance from the first sample:  1.58,  44.74
  THE NOISE FLOOR: 44.74 mean channel difference
```

**A FIGHT DOES NOT REPEAT ACROSS BOOTS.** Two samples landed close and the third did
not, on identical code. So a before-and-after picture comparison across two trees CANNOT
prove a renderer change -- any difference a floor cache made would be buried under a
difference the fight makes by itself.

## SO THE NEXT ROUND'S PLAN IS DIFFERENT FROM THE ONE I WOULD HAVE FOLLOWED

1. PROVE IT INSIDE ONE FRAME, not across two boots. In a single frame, with the same
   camera and the same inputs, compose the floor BOTH ways into two offscreen canvases
   and compare them to each other. Session-to-session variance cannot enter, because
   there is only one session and one frame. That is the honest instrument for this
   change and it is what the 44.74 above rules out any substitute for.
2. Then the floor cache, keyed exactly as listed above.
3. Then measure the beat again. The expected win is 2,504 calls a frame down to 1
   whenever the camera is still, which in the cover phase is most frames.

The cross-boot fingerprint tool stays anyway: it is the right instrument for "did this
change the fight at all", just not for "is this pixel-identical".

Taken by: gates/bohemia_beat_profile.js and two throwaway probes whose numbers are
above. Held by: gates/beat_budget_gate.js.
