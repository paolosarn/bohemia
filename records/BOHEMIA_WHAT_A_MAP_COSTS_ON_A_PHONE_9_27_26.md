# WHAT A MAP COSTS ON A PHONE

PLUMBER, row `[bb budget]`, rule 33. Paolo made the overworld a Battle Brothers map. The row
asks for the budget before RUN builds: roaming parties, tracks, the clock, travel, at 60 fps on
the throttled phone profile.

## THE ANSWER IN ONE LINE

**The markers are free. The animation loop is not.** Painting the map every frame is broken on a
phone-shaped CPU before a single party is drawn. Painting the same content once per beat costs
1.7 ms of a 500 ms beat.

```
4x throttle (phone-shaped CPU)
  an EMPTY per-frame loop, zero parties drawn          5.2 fps
  60 parties + tracks + clock, PAINTED ON THE BEAT     16 of 16 beats landed,
                                                       1.7 ms per paint, 99.7% headroom

1x (this box, desktop-class) -- the control that proves the harness
  idle map                        58.4 fps
  empty per-frame loop            60.1
  5 / 20 / 60 / 150 parties       60.1  60.1  60.1  60.1
  400 parties                     59.5   (worst frame 50 ms)
  20 / 60 / 150 + tracks          60.1  59.1  60.2
  20 + tracks + clock             60.1
```

400 markers with trails and a clock holds 60 fps at 1x. That is more than six times what a
Battle Brothers map ever shows. **Drawing is not the problem and was never going to be.**

## THE RECOMMENDATION FOR RUN, WITH THE NUMBER BEHIND IT

**Do not put the map on a per-frame animation loop.** Move the parties and tick the clock on the
beat, and repaint then. 120 BPM is one beat every 500 ms, every other system in this game already
runs on it, and a beat-painted map leaves 99.7% of the beat unused at 4x throttle. The design
answer costs nothing, matches the pillar, and the alternative does not survive contact with a
phone.

This also means the map does not need to stop being what it already is: a **redraw-on-demand**
surface. It is idle until something moves it, which is right for a city view and kind to a
battery. Keep that and drive it from the beat.

## THREE INSTRUMENT FAULTS FOUND ON THE WAY, ALL MINE, ALL REPRODUCED

This round took five attempts to produce one honest ladder. Every failure was the instrument, and
each one is the same shape: **a live oracle answering happily about the wrong thing.**

**1. The first ladder measured an idle page and called it slowness.**

```
after the door            MODE=human  czoom=1      rAF 2.4/s
after one squeeze         MODE=city   czoom=1      rAF 1.6/s
after two squeezes        MODE=city   czoom=0.208  rAF 60.3/s
```

`MODE` flips to `city` on the FIRST squeeze while the map is still not up. A "2.3 fps city view"
was a page with nothing to draw. The proof of arrival is **czoom**, not MODE.

**2. The first read after idle is 6.9x low.** Six back-to-back 2 s windows on the same unchanged
map: **8.7, 58.2, 60.3, 60.2, 60.3, 59.8.** Run one is the outlier. This is the 9/21 `[cold read]`
finding in a new place (page loads read 1240, 620, 625, 598, 589 ms), found by the lane that
shipped the fix for it. Every rung now throws a window away first and reports the worse of two
warm reads.

**3. And the surface could not be reached reliably at all, which was the real blocker.** One boot
reached the map in two squeezes. Another sat at `human / czoom 1` **after eight**, and the
squeezes did nothing whatsoever.

## THE CAUSE OF THAT, ON THE GLASS, AND IT IS ONE OF THE FOUR

```
before any squeeze    centre -> div#loadgl   above -> div#loadgl   below -> div#loadgl
after squeeze 1: mode=human czoom=1
after squeeze 2: mode=human czoom=1
after squeeze 3: mode=human czoom=1
inside the frame, centre -> canvas#cv
```

**`#loadgl`, the loading canvas, was still covering the entire page**, so every squeeze landed on
it. Inside the frame `canvas#cv` answered every question happily the whole time, so nothing
downstream noticed. `#loadgl` is the FIRST of the four incidents the `[covered controls]` row
named, and it is still live and **intermittent**: three controlled boots afterwards were all
clean. That is why a single green run never caught it.

## TWO FIXES IN THE ONE DRIVER

**`d.toMap()`** squeezes until the state PROVES the map is up and **throws with the state it got
stuck at** otherwise. Nobody should be able to measure the street and call it the map. Proved both
ways: `toMap(0)` refuses and names `mode=human czoom=1`; `toMap()` reaches `czoom 0.208` and says
so; a second call on the map is a no-op.

**The door check stopped naming ids.** It asked only whether `#fronttap` or `#front` is displayed.
`#loadgl` is a separate overlay that outlives the door, and the comment directly under that check
has named `#loadgl` since it was written. It now asks the only question that matters: **can a
finger reach the game**, by `elementFromPoint` at the frame's centre on the top page. That covers
those two ids, `#loadgl`, and anything anybody adds later. **Third time this lane has moved a
check from a spelling to a meaning.**

Measured safe for the fleet: three boots in a row report the door behind us, a finger reaching
`iframe#cityFrame`, and the map reached at `czoom 0.208`. DRIVER SAYS 6/0 and COVERED CONTROLS
8/0 after the change.

## WHAT IS NOT MEASURED, SAID PLAINLY

**Travel.** The row names it and there is nothing to travel on yet, so there is no honest number
for it. When RUN lands travel this lane prices it; guessing at it now would be a fourth wrong
number in a round that already produced three.

**The 4x rungs.** The per-frame ladder at 4x stops at the floor by design: an empty loop cannot
clear 30 fps, so every rung below it would be measuring the floor rather than the parties. The
beat measurement is the useful half and it is above.
