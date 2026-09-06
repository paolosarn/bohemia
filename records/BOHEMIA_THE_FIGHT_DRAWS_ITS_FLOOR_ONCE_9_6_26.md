# THE FIGHT DRAWS ITS FLOOR ONCE (9/6/26)

PLUMBER lane, VAMILY row [fight headroom] THE-FIGHT-HAS-NO-HEADROOM, round 3.
Round 1 took the hidden panel. Round 2 found the wall and said the honest way to
cut it. This is the cut.

## THE HEADLINE

```
  A FIGHTING BEAT, camera settled, three samples   497.5 ms  ->  364 / 394 / 393.5 ms
  A FIGHTING BEAT, camera still gliding            497.5 ms  ->  497.5 ms (unchanged)
  FRAME RATE in a settled fight                    41.6 fps  ->  60.0 fps
  the fight's own JavaScript, per beat             85.4 ms   ->  14.4 ms
  drawImage calls per frame                        2,501     ->  1
  canvas blits, share of a fighting beat           11.4%     ->  0.53%
```

The row's target is a fighting beat under 400 ms of 500. A SETTLED fight now
meets it, three times out of three. The first few seconds of a fight do not, and
that is written up below rather than glossed.

## WHAT THE CHANGE IS

The floor is composed once into an offscreen canvas and blitted, instead of being
repainted a tile at a time every frame. The floor block moved into
`fieldFloorPaint()` verbatim -- not one character of the drawing was edited --
and `fieldFloor()` wraps it with the cache. tools/bohemia_fight_floor_cache_patch.py.

## FIVE MEASUREMENTS DECIDED THE SHAPE, IN THIS ORDER

**1. IS THE COST PER CALL OR PER PIXEL?** The whole idea dies if it is per pixel,
because a composite blit copies MORE pixels than the tiles do. Measured in a live
fight, in the fight's own context:

```
  3,675 tile calls covering 2,116,800 px      8.6 ms   (JS alone 3.9 ms)
  1 composite call covering 1,861,974 px      0.7 ms   (JS alone 0.0 ms)
  1 composite call, 1:1, covering 1,056,120   0.5 ms
```

Twelve times cheaper for the same pixels. Per call, not per pixel, and not close.

**2. DOES THE KEY EVER HIT?** A cache that misses every frame is slower than no
cache. Sampled every animation frame of a live fight: 441 frames, key changed 9
times (98.0%); 535 frames, key changed 0 times once the camera settled.

**3. WORLD SPACE OR DEVICE SPACE?** Composing the floor at natural size and
blitting it under the camera scale is NOT pixel-identical: each tile is resampled
on its own today, a composite is resampled as one image. Measured at the real
zoom of 1.234: mean channel difference 0.167, max 16, 0.37% of channels off by
more than 8. Close is not identical, and this is the one surface the 120 BPM law
governs. So the cache is built THROUGH the camera at the destination's own size
and blitted back 1:1. That is exact, and it is also the fastest of the three
(0.5 ms against 3.4 ms for the world-space blit and 10.9 ms for the tiles),
because a 1:1 blit resamples nothing.

**4. THE MISTAKE THAT WOULD HAVE SHIPPED A WRONG PICTURE.** The first cut rebuilt
the camera on the cache context with `setTransform(getTransform())`. That LOOKS
exact. It is not: getTransform() hands back a float32-rounded matrix while the
context rasterises from the ops that built it.

```
  the same floor, ops against ops            0 channels differ
  the same floor, ops against copied matrix  29,610 channels differ, up to 12 apart
```

So the caller hands in the function that applies the camera and the cache REPLAYS
it. `fieldFloorCam` is that function and it is the only reason this is exact.
This was caught because the proof gate went red, not because anyone reasoned it
out beforehand.

**5. THE OPTIMISATION THAT MADE THE BEAT WORSE.** A cache build costs more
JavaScript than the old path (13.1 ms a frame against 4.76), because it paints
the floor into an offscreen canvas AND blits it. The cover zoom glides for
several seconds at the start of every fight, so the key changes every frame and
every one of those builds is thrown away. The obvious fix is to wait for a key to
repeat before building. THE BEAT SAID THE OPPOSITE:

```
  build on every miss        a gliding fight sits at 419.5 ms of its 500 ms beat
  wait for a repeat          a gliding fight sits at 498 ms
```

A beat is 80% raster, not JavaScript. Painting the floor once into an offscreen
canvas and blitting it 1:1 rasterises cheaper than 2,500 blits onto the live
canvas EVEN WHEN NOTHING IS REUSED. The JavaScript number said one thing and the
beat said the other, and the 120 BPM law is about the beat. The repeat rule was
removed.

## HOW IT IS PROVED, AND WHY IT COULD NOT BE PROVED THE OBVIOUS WAY

gates/fight_floor_cache_gate.js. A fight does not repeat across boots -- this
lane measured that noise floor at 44.74 last round -- so a before-and-after
screenshot across two trees could never have shown a floor cache working; the
difference would be buried under the difference the fight makes by itself.

So the comparison happens INSIDE ONE FRAME. One boot, one fight, one synchronous
block of JavaScript, the same camera and the same G: the floor is composed BOTH
WAYS into two canvases and the two are compared to each other.

```
  channels differing, cache against the old path    0 of 4,224,480
  three runs at three different camera zooms        0, 0, 0
  a cache HIT is exactly one draw call              1
  a cache MISS paints the same floor and blits it   2,502 = 2,501 + 1
```

And the control arm matters: the ORIGINAL path drawn twice into two canvases
differs in 0 channels, so the comparison has a real zero to measure against and
an off-by-one cannot be waved away as rasteriser noise.

The gate also holds the floors that stop a silent pass: fewer than 500 tile calls
on the uncached arm, or a canvas under 40% covered, or fewer than a million
channels read, and it goes red -- because a comparison of two blank canvases
passes perfectly.

## WHAT IS SAFE, AND WHY

- **THE SIM IS NOT TOUCHED.** This is painting only.
- **THE CACHE STANDS DOWN RATHER THAN GUESS.** It runs the original path whenever
  anything could make a composite differ from N draws: globalAlpha below 1
  (overlapping tiles would double-blend), any composite operation but
  source-over, any filter, a destination whose size is not the W and H handed in,
  the aim/dial phase, the incoming-volley cinematic (which applies its own
  transform), or a camera replay that does not land on the destination's own
  transform.
- **THE TRAILING STATE IS PRESERVED EXACTLY.** The old block left fillStyle,
  strokeStyle, lineWidth, lineCap and lineJoin set to whatever its last fill and
  its grid lines left behind, and code after it could read that. The cache
  context is SEEDED from the destination before painting and its trailing state
  is copied back after the blit. The gate checks all five.
- **IT SELF-HEALS.** A miss simply repaints. There is no state to reset.
- **IT COSTS ONE CANVAS, AND ONLY IN A REAL FIGHT.** The cache is one canvas the
  size of the fight's own (780x1354 on this phone profile, about 4 MB). It is
  created on the first build, and the first build cannot happen in the hidden
  combat frame because round 1's guard returns out of draw() before the floor is
  reached when the frame has no viewport. Nobody who never fights pays for it.
- **THE ART ARRIVING LATE WAS CHECKED, NOT ASSUMED.** The obvious way to freeze a
  stale floor is for tile art to finish decoding after the cache was built. The
  key carries STREET_READY, and STREET_READY is safe to rely on because all four
  street-tile batches register their pending count SYNCHRONOUSLY at parse time,
  before any image can fire onload, so the flag goes false to true exactly once,
  when the last image across every batch lands. There is no late batch that could
  add art while the flag already reads true.

## WHAT IS NOT DONE

**THE OPENING OF A FIGHT IS UNCHANGED AT 497.5 MS.** The cover camera eases 10%
of the way to its target every frame, so it needs about 335 frames -- five to
eight seconds -- to land, and while it moves the floor is a genuinely different
picture every frame. No cache can help that; it is not a cache problem, it is
that the picture really is changing. Snapping the ease when it is close enough
would fix it and that is a CAMERA change, which is not this lane's to make.

**AND IT IS STILL NOT MEASURED ON A REAL PHONE.** Same [PENDING Paolo] as
[sixty fps]: everything here is a phone-shaped Chromium at 390x844 dpr 3.

So the row stays CLAIMED. Half a target is not a target.

Taken by: gates/fight_floor_cache_gate.js, gates/beat_budget_gate.js and
gates/bohemia_beat_profile.js (which now profiles the settled fight as well as
the opening, because measuring only the opening measures a camera transient and
calls it the fight).
