# A FIGHT NOBODY IS PLAYING IS NOT A FIGHT (9/7/26)

PLUMBER lane, VAMILY row [fight headroom] THE-FIGHT-HAS-NO-HEADROOM, round 4.
Round 3 shipped the floor cache and published a number. This round checked that
number against a fight somebody is actually playing, and it did not survive.

## WHAT I PUBLISHED, AND WHAT IS ACTUALLY TRUE

```
  PUBLISHED (round 3)   a settled fighting beat: 497.5 ms -> 364 / 394 / 393.5
                        "the row's target is met, three times out of three"

  TRUE (this round)     a fight BEING PLAYED:    497.5 ms -> 347 / 386.8 / 428.4
                        median 386.8 against a median of 497.5 before
                        the target is met by the MEDIAN and the spread crosses it
```

Both sets are real measurements of the same build. The difference is entirely in
what was being measured: round 3 measured a fight with nobody touching it.

## WHY A QUIET FIGHT IS THE WRONG FIGHT

The floor cache is keyed on the camera, because it is built through the camera
and that is what makes it pixel-exact. So it holds exactly as long as the camera
holds still. The cover camera does this, every frame:

```js
  uzT = fit(the distance to the farthest living enemy)
  G._uzE += (uzT - G._uzE) * 0.10
```

Two things fall out of that, and both were measured rather than reasoned:

1. **THE EASE NEVER ARRIVES.** Ten percent of the remaining distance, every
   frame, needs about 335 frames to land inside float64 -- six seconds at 60 fps.
2. **THE TARGET KEEPS MOVING.** It is a function of where the enemies are. They
   walk at you, you step, the frame re-fits, and the ease restarts.

Measured over 28 seconds of a driven fight, twice:

```
  DISTINCT CAMERA ZOOMS      309  and  599
  cache hit rate             43% to 75%   (not 100%)
  quiet fight, same build    100%
```

So the camera is almost never still while anybody is playing, and the number I
published was the ceiling of the change rather than the effect of it.

## THE NUMBERS THAT REPLACE IT

Three driven fights each way, same 28-second protocol, Chromium's own
TaskDuration so raster is counted and not just my JavaScript:

```
  BEFORE the floor cache    498.0   497.5   497.3     busy 99.6 / 99.5 / 99.5 %
  AFTER  the floor cache    428.4   386.8   347.0     busy 85.7 / 77.4 / 69.4 %
  frames a second           45-49   ->      41-56
  tile blits per frame      2,505   ->      639-1,930
```

Three samples was not enough either. With seven driven samples the spread is
wide, and WHAT IT DEPENDS ON IS EXACTLY ONE THING -- how much the camera moved:

```
  distinct zooms in 28 s   cache hit rate   the driven beat
       333                    79.6%            392.9 ms
       863                    43.7%            413.5 ms
      1068                    12.4%            484.6 ms
  (and three earlier runs at 309-599 zooms, 43-75% hits: 347, 386.8, 428.4)

  ALL SEVEN, SORTED   347  386.8  392.9  413.5  428.4  484.6  497.5
  MEDIAN              413.5      against a BEFORE median of 497.5
```

So the honest statement is not a number, it is a relationship: **the floor cache
is worth between nothing and 150 ms of every beat, and which end you get is
decided entirely by whether the camera happens to be still.** The median win is
84 ms. The worst sample is no win at all.

**THE ROW'S TARGET IS NOT MET.** 400 ms of 500, and the driven median is 413.5.
I said last round it was met. It is not, and it is not close enough to round.

ONE CAVEAT ON THE GATE'S OWN NUMBER, because it will read higher than these: the
gate takes its TaskDuration reading while its sampling profiler is attached, so
the profiler's own cost is inside it. It is an upper bound, comparable to other
gate runs and not to the numbers above, which were taken with nothing attached.

## HOW I MISSED IT, WHICH IS THE USEFUL PART

The instrument profiled a fight and then WAITED for the camera to settle before
measuring, because in round 3 I had found that the opening of a fight was a
camera transient and I did not want to measure a transient. That was right. What
I did not ask is whether the thing left after the transient was still a fight.
It was not: it was an idle screen with a fight on it.

**A GATE THAT CAN ONLY SEE A QUIET FIGHT WILL FLATTER EVERY CHANGE ANYONE MAKES
TO THE FIGHT, FOREVER.** So the fix is not to remember this; it is in the gate.

## WHAT IS BUILT SO IT CANNOT HAPPEN AGAIN

gates/bohemia_beat_profile.js now takes THREE fight windows and
gates/beat_budget_gate.js prints all three, with the driven one named as the
honest one:

```
  the opening        camera still gliding from the entry fit
  nobody playing     the CEILING, labelled as the ceiling
  BEING PLAYED       the controls driven, TaskDuration read, the headline
```

And it holds two new checks so the window cannot quietly become another quiet
one: the driven window must produce more than twenty distinct camera zooms, and
it must have more than five thousand profile samples. A drive that stopped
driving fails instead of passing.

THE GATE CAUGHT ITSELF TWICE WHILE I WAS BUILDING IT, and both catches are worth
keeping because both were silent failures:

1. **THE DRIVE LANDED ON A DEAD FIGHT.** By the time the driven window starts,
   two profiling windows and a settle wait have gone by and the encounter can be
   over. A dead fight has nothing to move the camera, which reads as a
   beautifully cheap beat: one run produced 1 distinct zoom and 354.5 ms. The
   profiler restarts the encounter now if the fight is over, and prints what it
   found, what it tapped, and the state it left the fight in.
2. **THE ZOOM COUNTER DIED WITHOUT SAYING SO.** It was a requestAnimationFrame
   ticker inside the fight frame, and it twice reported ONE distinct zoom on a
   fight that was plainly moving. A loop in there dies with its document (the
   encounter can be rebuilt under it) and is throttled when the frame is not
   painting, and either way it fails silently. The zoom is polled from the driver
   now, where a dead poll is a failed call.

AND ONE THING THAT COULD NOT BE ASSERTED, WHICH IS ITS OWN FINDING. I first made
"the camera moved" a pass/fail. It went red on a legitimately still fight: an
encounter with one stationary enemy pins the auto-frame at its ceiling and holds
there even while somebody is playing. A gate red on arrival gets switched off by
the next session that meets it, which is this gate's own rule. So the fact rides
ALONGSIDE the number every run instead:

```
  >> THE CAMERA MOVED (24 distinct zooms seen), so the number above is a fight,
     not a ceiling.
  >> THE CAMERA WAS ALMOST STILL THIS RUN (1 distinct zoom at 1.3000), SO THE
     NUMBER ABOVE IS A CEILING AND NOT THE GAME.
```

A reader who cannot tell which kind of fight was measured is exactly how this
lane published a ceiling as a result in the first place.

Runs of the finished gate: 466 ms (24 zooms), 497 ms (30 zooms), 394.2 ms
(1 zoom, correctly labelled a ceiling).

## WHAT WOULD ACTUALLY CLOSE THE ROW, AND IT IS NOT THIS LANE'S

The floor cache is exact because it is built through the camera. Nothing keyed on
the camera can hold while the camera moves every frame, and the camera moves
every frame because a 10%-per-frame ease never arrives. A camera that SNAPPED
when it was within a fraction of a pixel of its target would settle in a few
frames instead of never, the cache would hold through the still parts of a fight,
and the beat would fall further.

That is a change to how the camera feels, so it belongs to COMBAT, not to the
plumber. It is written up here with its numbers rather than done here.

Two other things are still open on this row and neither is code:
- **A REAL HANDSET.** Everything here is a phone-shaped Chromium at 390x844
  dpr 3. Same [PENDING Paolo] as [sixty fps].
- **THE TARGET ITSELF.** 400 ms of 500 was set on the desktop harness before
  anybody had a driven number. The driven median is 386.8.

The row stays CLAIMED. A median is not a guarantee.

Taken by: gates/beat_budget_gate.js and gates/bohemia_beat_profile.js, both of
which now drive the fight they measure.
