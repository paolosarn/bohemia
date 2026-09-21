# THE STEP DROPS A FRAME — ANIMATION, row [tape skip] round two, 9/21/26

## WHAT WAS LEFT, AND WHY IT WAS THE WHOLE POINT
Round one taught the GROUND to hold and drop (the tape skip). The BODY was still
walking a straight ramp across the same beat: the frame index was
`elapsed/BEAT * frames.length`, so while the street stood still his legs strode on
the spot, and while the street jumped 94 px his legs advanced one pose.

**THAT IS THE MOONWALK THE ROW EXISTS TO KILL, REBUILT FROM THE OTHER SIDE.**
Half a fix that fights itself is worse than no fix, because it looks deliberate.

## THE BODY READS THE SAME CLOCK THE GROUND READS
`walkStation(k)` is new and is the only thing that decides when the skip happens.
The ground asks it for a distance, the body asks it for a pose. They cannot
disagree, which is the defect above stated as a mechanism.

Measured on the real surface (the alpha, 4-frame walk clip, 500 ms beat):

    feel     poses drawn   pose changes   longest held pose
    GRID               4              3              125 ms
    SLIDE              4              3              125 ms
    TAPE               3              2              274 ms

The street is still for 275 ms of the beat and the body now holds for 274. Under
GRID and SLIDE the even cycle is untouched, so nothing he has already seen changes
unless he is on TAPE.

## THE STATION PICKS THE POSE, NOT THE DISTANCE
The first cut picked the frame from how far along the curve the ground was. That
made the LAST authored pose flash for a single millisecond and never actually
land, because the stations stop at 0.67 of the way and the beat supplies the rest.
Now station 0 is the held pose and the last station is the LANDED pose, so the
clip's own ends are its ends. With 4 frames and 3 stations one pose is skipped:
that is the effect, not a loss. A drop-out skips a frame.

## A DROP-OUT NEEDS A DISTANCE
**A PRESS IS NOT A LOT AS OFTEN AS IT SOUNDS.** Measured while walking, 16 presses:

    2, 25, 25, 25, 23, 22, 13, 19, 19, 15, 4, 2, 19, 17, 25, 2

Four covered a full lot. Four covered two to four cells. WALK NEVER MISSES agrees
from its own instrument: 15.2 cells a press against a 25 cell step.

Over two cells there is no distance to show, and the same three stations become a
twitch in place. So the skip is only used when the step covers at least half a lot
(137 px on screen at the one walk camera); below that he lands on the beat and
nothing drops. Measured after: 11 of 14 presses skipped, 3 landed.

## ONE PICK, WHERE THERE WERE TWO
The walk frame was chosen in two places, once outdoors and once indoors. Two
copies of a frame index is how the player's legs end up doing one thing in the
street and another in a room. One helper now, and the gate holds it at zero
hand-rolled picks.

## THE GATE
gates/the_step_is_a_tape_skip_gate.js is 24 claims -> 31, all green, and the three
new ones are mutation-proven one at a time:
  - the body back on a straight ramp while the ground skips  -> the hold claim reds
  - every step skips however short                            -> the short-press claim reds
  - the body frozen on one pose for every feel                -> the GRID/SLIDE control reds
Both distance claims carry a VACUOUS-PASS GUARD in both directions: a sweep with
no long presses, or no short ones, proves nothing about a rule whose whole job is
telling them apart, so it fails rather than passes.

## WHAT IS STILL NOT MEASURED
The frame-by-frame look on a real phone. This box clamps a headless page to about
twenty frames a second, fewer than a beat holds. Everything above is measured off
the seam the renderer itself picks with, and off real presses on the real surface,
but nobody has yet watched the drop-out with their eyes at sixty frames a second.

## WHERE IT IS
  slices/BOHEMIA_CITY_WORLD.html                        the clock, the pose, the rule
  slices/vote/ANIMATION_THE_STEP_DROPS_A_FRAME.html      both walks, on the beat
  slices/vote/ANIMATION_THE_STEP_DROPS_A_FRAME.png       the shipped 4-frame walk, no new art
TAB: VOTE for the choice, CITY for the walk.
