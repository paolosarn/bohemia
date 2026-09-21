# THE GLIDE DIED WHEN THE STEP GREW — ANIMATION, row [tape skip], 9/21/26

## THE ROW
Coordinator 9/21, off this lane's own measurement (e764a506): one press is 25 real
paces, 18.75 m in half a second, 135 km/h, and the feet depict 3% to 11% of it. His
default: the body does not skate; on the beat he is standing at the next lot, and
between the two there are two or three dropped frames, the way a tape skips.

## WHAT I FOUND BEFORE BUILDING ANY OF IT
**THE WALK GLIDE HAS BEEN DEAD SINCE RULE 16, AND NOTHING SAID SO.**

    camCell:  if(Math.abs(dx)>4 || Math.abs(dy)>4){ GLIDE=null; return [cx,cy]; }

That ceiling was written on 8/23, when a step was ONE cell and the bike's four was
the biggest thing one beat could move. Its own comment says exactly that. Rule 16
(9/15) made one step a whole lot, 25 cells. Nothing connected the two numbers.

So every full step is 25 > 4 and the glide is killed on its first drawn frame. The
chip in the drawer says SLIDE. The source says SLIDE. What ships is GRID: the whole
world jumping 275 px in ONE frame, twice a second.

MEASURED on the walked city at the live camera (STEP_CELLS 25, HC 11):
    before   gliding() true on 0 of 60 samples across a press
    after    true again, and 3 of 3 full-lot steps drawn in flight

**AND IT BROKE THE WALK UNEVENLY, WHICH IS WHY NOBODY SAW IT.** A press shortened by
something in the way moves one or two cells, fits under the old ceiling, and glides
fine. Measured in a suburb: **9 of 12 presses are shortened**, only 3 are full lots.
So the walk slid when a wall was near and teleported when the road was clear, and
the difference was invisible in code either way.

A NUMBER TYPED INTO A GUARD IS A NUMBER THAT EXPIRES, and it expires SILENTLY,
because a guard that refuses everything looks exactly like a feature nobody turned
on. The ceiling is derived from the step now (four lots, a bike step, the step
code's own `(RIDING?4:1)*STEP_CELLS`), floored at the old 4 so it can never be
tighter than it was, and the gate asks the code for it instead of restating it.

## THE THIRD FEEL
GRID teleports the lot in one frame. SLIDE eases across the beat, which is what
makes the legs read as skating: the ground moves every frame and the feet do not
keep up with any of them. TAPE is neither: the ground HOLDS on the lot he left for
55% of the beat, drops through two stations, and lands on the next lot on the beat.

Measured through the game's own curve at 1 ms across one beat, at the live camera
where one lot is 275 px:

    feel     ground positions in a beat    times it moves    biggest single move
    GRID                              2                 1                  275px
    SLIDE                           273               272                    2px
    TAPE                              4                 3                   94px

TAPE IS THE SMALLEST HONEST MOVE FROM WHAT SHIPS, NOT THE BIGGEST: it breaks one
275 px jump into three of 94. SLIDE would be the large change. That is why TAPE is
the default and why the default is safe to set under rule 18.

Under the analog horror law (9/20) the dropped frame is the genre's own grammar
rather than a new effect: the frame is ordinary and part of it is missing. Rule 20
also asks for long stillness, which is why the first drop is at 0.55 of the beat
and not at 0.25.

## ONE COPY OF THE CURVE
`walkCurve(feel,k)` is written once. camCell calls it, the seam hands it out, and
the gate and the vote page read it off the seam. A second copy agrees with the
first until the day it does not, and this lane has now paid for that seven times.

## THE CLAIM THAT TOOK FOUR CUTS, EVERY WRONG ONE CAUGHT BY THE SAME MUTATION
The load-bearing claim is "a full step is really drawn in flight". Put the expired
ceiling back and it must go red. It did not, three times:

  1. It read `gliding()`. That flag is SET by the step and only CLEARED by a draw,
     so a glide that every single frame kills still reads as on to anything that
     does not draw. A claim built from a flag measures the flag.
  2. It asked how far along the line from where he started. TWO steps land inside
     one sample window, so a camera sitting exactly on the MIDDLE LOT scored 0.5
     and read as in-flight while it was teleporting lot to lot.
  3. It asked the right question -- is the ground drawn off the cell he is standing
     on -- and STILL passed, which is how the uneven-breakage fact above was found:
     the short steps always glided.
  4. Scored on FULL-LOT STEPS ONLY, with a vacuous-pass guard (no full step seen is
     a FAIL, not a pass). Clean 3 of 3, mutant 0 of 3.

## WHAT I COULD NOT MEASURE, SAID OUT LOUD
**The per-frame ground motion as actually drawn on glass is NOT measured here.**
This container's headless page clamps every timer and rAF to about twenty a second,
fewer frames than a beat contains, and a ruler that samples slower than the thing it
measures cannot count how many times that thing moved. I built four cuts of that
instrument before naming it instead of shipping a fifth (STOP PRODUCING, 7/26).
What IS measured: the curve the game runs, at 1 ms, and whether the camera draws the
ground off his lot at all. The frame-by-frame look belongs on a real phone.

## FOR RUN, NAMED NOT CROSSED
- The glide block is RUN's (`__WALK_FEEL_SLIDE__`, 8/23). The ceiling fix is inside
  row [tape skip] because the row is impossible without it, and it is flagged here.
- **9 of 12 presses in a suburb do not complete a lot.** A 25-cell step rarely has
  25 clear cells. Whatever the stride depicts has to survive being cut to 1 or 2
  cells, and today the two cases are drawn by different code paths.
- A feel he has already flipped by hand lives in localStorage and beats the default,
  so the new default only reaches a phone that has never touched the chip.

## WHERE IT IS
  slices/BOHEMIA_CITY_WORLD.html              the feel, the curve, the ceiling
  gates/the_step_is_a_tape_skip_gate.js        24 ok, 4 mutations caught
  slices/vote/ANIMATION_HOW_A_STEP_IS_DRAWN.html   the three, side by side, on the beat
TAB: CITY for the walk, VOTE for the choice.
