# EYES AND EARS -- E10 [find them]: THE MACHINE IS BUILT, AND IT CANNOT FIND A BODY
# TO MEASURE BECAUSE THE GAME IS DRAWING THEM ABOVE THE SCREEN
## 9/5/26, lane 17 (eyes-5vql33)

E10 asked for a standing machine that opens a real frame from the shipped game, finds every
hostile in it, and answers one question honestly: **could a cold player find this body in one
glance?** Measure the value gap to its neighbours, whether it is coming toward the player, and
whether it survives greyscale.

**The machine is built and it works.** `tools/bohemia_eyes_find_the_enemy.js` (catch) and
`tools/bohemia_eyes_find_the_enemy.py` (measure). And the first thing it found is not an art
answer, it is this:

> **IN 220 STEPS WALKING STRAIGHT AT THE NEAREST HOSTILE CREW, NOT ONE BODY WAS EVER DRAWN
> FULLY INSIDE THE GLASS.** The bodies the game counted as drawn were sitting 55 to 101 pixels
> ABOVE the top edge of a 743-pixel-tall canvas, with a 112-pixel sprite.

## HOW IT FINDS THE BODIES, AND WHY IT IS NOT A SECOND ANSWER
The city draws hostiles in `hostilePass()`. This tool does **not** re-derive where they are --
a second placement is how two things that should agree drift apart. It wraps the pass so the
GAME calls it, and while the pass runs, every `drawImage` on the city canvas is recorded, with
`getTransform()` applied, because the city draws through a camera.

Three mistakes were made and fixed on the way, all of them in the instrument:
1. **Calling `hostilePass` myself** with a made-up camera origin returned 0 while the real
   loop was drawing 4. You wrap the pass; you never call it.
2. **Ignoring the transform.** The first rects came out at x=396 on a 378-wide canvas and
   looked off-screen; they were world coordinates.
3. **Accepting a body that merely OVERLAPS the glass.** Those crops get clamped to the screen
   edge, so the "measurement" was of the top bar and a sliver of shoulder -- it reported
   "3 of 4 bodies found, value gap -33" and every one of those numbers was the UI. Only a body
   FULLY on the glass is a body a player could have found.

## WHAT IT MEASURES, ONCE A BODY IS ACTUALLY ON SCREEN
- **VALUE GAP** -- the body's median brightness against the ring of ground around it. A player
  finds a body by value long before colour; under about 15 of 255, at a glance, on a phone in
  daylight, a body is furniture.
- **GREYSCALE** -- the same gap with colour thrown away, which is what a colour-blind player
  and a dark room both see. A large colour gap with a small value gap means the body is being
  found by hue alone.
- **COMING AT YOU** -- the crew's own state from the module. The approach is the tell.

## WHAT THIS ROUND MEASURED
| | |
|---|---|
| factions at odds with him on a fresh save | **3** (Caravans, Cartel, Remnants) |
| crews within 40 cells | **3** |
| nearest crew | 4 bodies, about 24 cells away |
| crew state when caught | **watch** |
| bodies the game counted as drawn | 4 |
| bodies drawn fully inside the glass, in 80 steps | **0** |
| bodies drawn fully inside the glass, in 220 steps | **0** |
| where the counted bodies actually landed | 55 to 101 px above the top edge |

**So the art question is not answered this round, and it is not answered on purpose.** A body
the clip ate is not a body a player failed to find, and reporting the first as the second is
exactly the kind of false alarm this lane has spent the day catching in itself.

## FOR RUN, WITH THE NUMBERS
The crews exist, the danger list is real, the module places them and the pass draws them --
and on a walk straight at them they are drawn above the visible area. Two possibilities, and
this lane cannot tell them apart from outside: the camera keeps the player centred while the
crew's cell stays north of the frame, or the placement's offset is larger than the glass.
Either way, **a player walking at them for 220 steps never had one fully in front of him.**

Written into RUN's section as `[eyes: off glass]`.

## THE MACHINE IS STANDING
It runs every round from here as part of the standing duty. The day a body lands fully on the
glass, the value gap, the greyscale answer and the crew's state come out with it.
