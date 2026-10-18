# EYES AND EARS -- [fight floor measured] -- ROUND THREE: THE AFTER NUMBER
### 10/4/26 -- session eyes-5vql33

Row (rule 46f): post F1-F3 again every time COMBAT ships on the fight's floor. Since round
two's reading, COMBAT shipped more (V236) and COMBAT TWO shipped two real art drops (the
floor set, the cover pieces, both at 42.9 px/m from the 7/28 bank). This round reruns the
same tool, same four seeds, same controls, fresh off current main, and looks at the actual
pixels behind the number that moved the wrong way.

## RULE ZERO

All three controls green before any number is trusted: the door was behind us, the fight
frame answered (setupCombat/houseOn found), and the classifier's own synthetic proofs (a
flat grey patch fires no class, a saturated red patch fires red>0.95; a flat patch bands
~0, a checkerboard bands ~1) passed before touching a real screenshot. Same tool as round
two (tools/bohemia_eyes_fight_floor.js, tools/bohemia_eyes_fight_floor_measure.py),
REUSE-FIRST: no second instrument invented for the same named test.

## THE THREE NUMBERS, AGAINST BOTH BASELINES

| | the original verdict (COMBAT V233) | round two (after V234/V235) | round three (now) | bar |
|---|---|---|---|---|
| F1 painted-unit, device px | 3.0 / 3.0 / 3.0 / 3.0 | 3.0 / 3.0 / 3.0 / 3.0 | 3.0 / 3.0 / 3.0 / 3.0 | <=1.5 |
| F2 fine band, both axes | 0.007-0.011 | 0.019-0.026 | 0.022-0.031 | >=0.020 |
| F3 never-ground % | 3.1 / 9.6 / 4.8 / 3.3 | 1.25 / 1.57 / 2.27 / 2.5 | 1.59 / 3.59 / 2.78 / 2.96 | 0 |

F1: UNCHANGED, still failing, third reading in a row at exactly 3.0 on all four boards.
Round two already flagged this as a possible shared test-reach gap (this lane's reach
method, a direct BohemiaArena.set/setupCombat call, may not trigger the same backing-store
resize a real tap does); a third identical reading on a build that has shipped three more
times since makes that explanation more likely, not less, but this lane cannot prove it
without instrumenting the reach itself, which is COMBAT's code to touch, not this lane's.

F2: KEEPS IMPROVING, now passing all four boards with more margin than round two had.

F3: PASSES AGAINST THE ORIGINAL VERDICT (down from 3.1/9.6/4.8/3.3) BUT IS WORSE THAN ROUND
TWO ON THREE OF FOUR BOARDS (1.25->1.59, 1.57->3.59, 2.27->2.78; only 2.5->2.96 is close).
Reporting this straight rather than only citing the flattering comparison.

## LOOKING AT THE ACTUAL PIXELS, NOT JUST THE NUMBER (this is the job: judge what is on
## screen, not what a formula says about it)

Opened the saved screenshots (records/eyes_fight_floor/fight_5.png, fight_13.png) and looked.
Two real, visible things are driving the "white marks" and "red" classes, not a reading
error:

1. **FOUR LINES OF FLAVOUR TEXT ARE DRAWN STACKED ON TOP OF EACH OTHER at the top of the
   fight screen** ("THE MARQUEE", "THE WAY OUT", "THE CHOIR", "THE ROAD" on one board;
   repeats of "THE WAY OUT" and "THE CHOIR" on another), overlapping into a smear nobody
   could read mid-fight. This is near-white text on a dark band, which is exactly what the
   "white marks" class is built to catch, and it is a real, new, visible defect, not a
   measurement artifact. It is not the same bug as the release line's own NO OVERLAP
   reds (those are the quest line under the settings button and a street hint under a
   town's name); this one is inside the fight screen itself and nobody has named it yet.
2. **A small red dot sits floating over open ground above a character's head** (fight_5,
   left figure) -- a real mark, not board art, sitting on the floor region this measure
   reads. Whether it is meant as a status cue is not this lane's call; it is a red mark on
   the ground region either way, which is what F3's "red" class exists to catch.

NAMED, NOT ASSERTED AS THE WHOLE STORY: F3's own classes() scans the whole board crop with
no mask for the standing characters themselves, so a character's pale skin or light
clothing can also read as "white marks" without being floor art at all. DIRECTION's own
verdict already said this measure is "a lower bound... this tool does not claim to improve
on that." This round does not have a clean way to separate how much of the white-marks
share is the stacked ticker text versus character pixels without a mask neither tool has;
what it CAN say with confidence, because it is visible on the glass, is that the stacked
ticker text is real and is not nothing.

## ROUTED

[fight floor measured] stays this lane's: the numbers are posted, the verdict is DIRECTION's
and COMBAT's to act on. The stacked ticker text is a new, separate, visible defect on a
SHIPPED item -- bounced back by name (rule 10): [eyes: ticker overlap].

## SHIP TEST FOR THIS ROUND

F1 and F2 are read the same way as round two, on the current build, with the same controls.
F3's regression against round two (not against the original verdict) is reported honestly
rather than only citing the number that looks good, and its two visible drivers are shown,
not guessed at. Next reading: whenever COMBAT or COMBAT TWO ships on the floor again.
