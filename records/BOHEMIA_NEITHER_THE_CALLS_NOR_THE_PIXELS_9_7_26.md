# NEITHER THE CALLS NOR THE PIXELS (9/7/26)

PLUMBER lane, VAMILY row [fight headroom] THE-FIGHT-HAS-NO-HEADROOM, round 5.

THIS ROUND SHIPS NO SPEEDUP. It ships three negative results and one number that
changes how anybody may measure this fight from now on. Three ideas were tested
and all three died: caching the faction floor, cutting the resolution, and the
theory that the remaining cost is fill rate. Writing that down IS the round --
each one would otherwise cost somebody else a round to rediscover.

Written in the order they were measured, including the ones that looked like wins
first.

## THE ONE NUMBER THAT REFRAMES THE ROW

Every named draw function in the fight, wrapped and clocked in a driven fight:

```
  the whole frame callback           102.8 ms per beat
    drawField                         97.7
      fieldFloor                      86.6
        fieldFloorPaint               39.5   (only on cache misses)
    paintFireButton                    3.1
    drawActionLog                      1.8
    drawFloor                          1.4
    screenOverlays                     0.6
```

A driven fight is 413 to 460 ms of a 500 ms beat. **The fight's own JavaScript
is 103 ms of that. The other 310 to 350 ms is the browser rastering pixels, and
no amount of caching draw CALLS touches it.**

The coordinator's five techniques are all call-count techniques. Two were
already done before this lane arrived (no scaling, no fractional coordinates).
One shipped (the floor cache, worth a median 84 ms). The remaining two are the
same lever again, and the lever is nearly spent: there are 103 ms of JavaScript
left in total, and most of it is the cache machinery itself.

## THE NEGATIVE RESULT, AND HOW IT NEARLY BECAME A FALSE POSITIVE

`drawFloor` paints the faction ambience: a full-canvas colour fill, about sixty
line strokes, a motif pass over ~700 cells, and A FULL-CANVAS RADIAL GRADIENT.
Every frame. Its JavaScript is only 1.4 ms a beat, but JavaScript time says
nothing about the raster it asks for, which is the exact trap this lane fell
into two rounds ago. So it was measured, not reasoned.

**FIRST ANSWER: 200 ms A BEAT.** Swapping `drawFloor` for a cached bitmap,
alternating inside one boot:

```
  as it is   457.1   454.7
  cached     296.9   237.4
```

That is a huge win and it was wrong twice over:

1. **IT FROZE A FEATURE.** The cache included the floor's BEAT PULSE, which is
   the ground flashing on the 120 clock -- "the ground is the metronome". Caching
   it stops the pulse. Some of that 200 ms was simply not drawing a thing the
   game is supposed to draw.
2. **IT MEASURED DEAD FIGHTS.** The encounter ends mid-window, and a finished
   fight reads about 85 ms a beat. Whichever arm was running when a fight died
   collected a number it had not earned.

**HONEST ANSWER: NOTHING.** Keeping the pulse live (blit the static part, draw
the pulse, blit the vignette on top, so the draw order is unchanged) and
reviving the fight whenever it dies mid-window:

```
  as it is   454.4   479.0   497.1
  cached     420.2   496.4   496.9
  pair delta  -34.2   +17.4    -0.2      median: no change
```

**THE FACTION FLOOR IS NOT WORTH CACHING.** Two full-canvas blits cost about
what the fill, the strokes, the motif and the gradient cost. Nobody should spend
a round on it, and this page is why.

## THE THIRD SILENT FAILURE IN THIS INSTRUMENT, NOW FIXED IN THE GATE

The dead-fight contamination is not just an experiment problem: the shipped beat
gate had the same hole. It restarted the encounter once BEFORE the driven window
and never checked again, so a fight dying halfway through handed it a cheap
number. `bohemia_beat_profile.js` now revives mid-window and
`beat_budget_gate.js` prints how many times it had to.

That is three silent failures found in this one instrument across two rounds:
the drive landing on a dead fight, the zoom counter dying with its document, and
now the fight dying mid-window. Every one of them made the game look FASTER,
which is the direction a perf instrument fails in when nobody is checking.

## SO I PRICED THE PIXELS, AND THAT DIED TOO

If the cost is raster, it should scale with the number of pixels. The same driven
fight at three device pixel ratios:

```
  dpr 3   canvas 780x1354 = 1,056,120 px    450.1 ms/beat   90.0% busy
  dpr 2   canvas 780x1354 = 1,056,120 px    412.5 ms/beat   82.5% busy
  dpr 1   canvas  390x677 =   264,030 px    480.2 ms/beat   96.0% busy
```

Two things fall out and the second is the important one.

**THE FIGHT ALREADY CAPS ITS OWN CANVAS AT 2x.** `const dpr=Math.min(devicePixelRatio||1,2)`
in its size(). That is why 3 and 2 are the same canvas to the pixel. Somebody did
that already and nobody should re-discover it.

**AND A QUARTER OF THE PIXELS DID NOT MAKE IT FASTER.** dpr 1 is a quarter of the
area and read SLOWER than both. So fill rate is not the wall either.

## THE NUMBER THAT MATTERS MOST THIS ROUND, AND IT IS A WARNING

Look at the first two rows again: **the SAME canvas, the same build, the same
protocol, 450.1 and 412.5 ms.** Thirty-eight milliseconds apart on runs that
differ in nothing.

**THE DRIVEN FIGHT'S BEAT HAS A NOISE FLOOR OF ABOUT 40 MS BETWEEN IDENTICAL
RUNS.** That is the rule this lane needs written down, because it invalidates a
whole class of claim:

- Any single-sample before-and-after on this fight is worthless. A 40 ms
  "improvement" is a coin toss.
- It is exactly how round 3 published "the target is met, three times out of
  three" off three quiet samples.
- The faction-floor pairs above (-34.2, +17.4, -0.2) sit INSIDE that floor,
  which is another way of saying what they said: no effect.
- The floor cache's median win of 84 ms is twice the noise floor, so that one is
  real. Barely twice.

Anything measured on this surface needs alternating pairs inside ONE boot and at
least three of them, and this record is the reason.

## WHAT IS ACTUALLY LEFT, AND NONE OF IT IS THIS LANE'S TO DECIDE

The fight's own JavaScript is 103 ms of a 450 ms beat. Caching draw calls is
nearly spent. Fill rate is not the wall. The remaining levers are design calls:

1. **THE CAMERA THAT NEVER SETTLES** (COMBAT). Routed last round with numbers.
   It decides whether the floor cache is worth 150 ms or nothing, and it is the
   only lever anybody has measured that is worth more than the noise floor.
2. **WHAT THE FIGHT DRAWS AT ALL.** The canvas is fully painted at least three
   times per frame before a single character: a clear, the faction fill, the
   vignette, the floor blit. Cutting that is changing the picture.

The row stays CLAIMED and its remaining work is a ruling, not code.

Taken by: gates/beat_budget_gate.js and gates/bohemia_beat_profile.js, plus
throwaway probes whose numbers are all above.
