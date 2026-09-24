# WHICH WAY IS HE FACING
COOK lane, [footprints] round 3, 9/24/26. Session cook-mce6r5.

## HIS TWO RULINGS, BOTH ON THUMBS UP
From records/BOHEMIA_VOTE_VERDICTS_9_23_26.txt, word for word:

  FOOTSTEPS THAT LEAD YOU SOMEWHERE, up:
    "BRO U HAVE TO FIND OUT WHEN ITS FAVING NORTH SOUTH EAST AND WEST FR"
  THE GROUND TELLS YOU WHAT HAPPENED, up:
    "It wont be exactly a straight line but yeah amazing dont have it be exactly a straight line"

Rounds 1 and 2 failed both. Round 2 turned ONE bitmap to the heading with a nearest-neighbour
rotate, which is the one thing you may never do to pixel art: at 45 degrees it chews the toe
taper into stair-steps and the print stops being a boot. And every walk it drew was dead
straight inside each of its segments.

## SIXTEEN FACINGS AND NOT ONE OF THEM RESAMPLED
The boot stops being a bitmap and becomes a PROFILE: twenty steps along its own long axis,
each with the span of sole at that step, read straight out of the silhouette he approved. A
facing is then RE-RASTERISED along that heading rather than rotated, which is what a pixel
artist does by hand and why the diagonals come out clean. Proved three ways in the tool:
  * rasterising NORTH reproduces the first 13 rows of his mask BYTE FOR BYTE;
  * east, south and west are exact 90 and 180 degree turns, which on a pixel grid are
    lossless, and the tool asserts it;
  * the four diagonals come off the same profile at 45 degrees, never through an interpolator.
Eight headings, two feet, sixteen masks.

## TWO DEFECTS THIS FOUND IN THE BOOT HE ALREADY APPROVED
**THE LEFT AND RIGHT BOOTS WERE THE SAME BOOT.** Every row of the approved mask is a
palindrome, so round 1's `right=True` flip was a no-op and a trail has been laying one foot
twice since the beginning. The arch is medial: the waist now moves one pixel toward the
outside of the foot, so a left print and a right print lean away from each other. Sixteen
pixels of difference, which is what makes two lines of feet instead of one line of stamps
(TRK-03).

**AND HIS BOOT IS THE SAME WIDTH AT BOTH ENDS, SO IT DOES NOT SAY WHICH WAY HE WENT.** This
is the real answer to his words and I nearly missed it. Machinery that points a print
correctly is worth nothing if the print is a shape you cannot read a direction off. His ball
is five rows of seven and his heel is four rows of seven, both ending in the same rounded
taper, so NORTH AND SOUTH DRAW THE SAME PICTURE. A real sole is not like that: the ball is
the widest part and the heel is narrower and squarer. So the toe half is his, untouched, byte
for byte, and the heel comes in one pixel each side and ends flat. 7 px ball against a 5 px
heel. That one change is the difference between a trail that leads somewhere and a row of
identical stamps.

BOTH BOOTS ARE ON THE CARD SIDE BY SIDE, in the same dirt at the same size, so he can put the
old heel back with one word.

## THE WANDER
A line of travel drifts a couple of degrees a step and the drift itself drifts, so this is a
seeded second-order wobble, not noise sprinkled on a straight line. Noise on a straight line
is a ruler through a bad camera; it is not a walk. Measured on the walk that ships:
  * it leaves the straight line between its first and last print by 3.05 BOOT LENGTHS;
  * not one set of three prints in it is collinear;
  * it passes through two of the eight facings, E and SE.
The tool refuses a walk under half a boot off straight (his words) and over four boots
(not a walk any more), and refuses any collinear triple.

EIGHT FACINGS MEANS A PRINT IS NEVER MORE THAN 22.5 DEGREES OFF THE WAY HE WALKED, and on
this walk the worst is 22.4. That residual is printed rather than hidden: a sprite has
facings, and the honest thing is to say how far off the nearest one can be.

## RULE 32(f), APPLIED TO MY OWN CARD
His words this round: "this game isn't in first person, when would I see this?" A VOTE item
is a frame off a play surface or a tile at game scale; studies go in records. Round 2's card
had a blown-up study panel and would break this rule. This card has none. Every square on it
is ground at the size the game draws it, and the eight facings are shown as prints lying in
dirt, not as sprites on a sheet.

## REFERENCE CHECK
HAIR-04 (Sandy Gordon, 8-directional turn-around) is the house standard this repo already
turns its art around on, and its rule is the one that matters here: a facing is DRAWN, never
rotated. TRK-01 (the foot progression angle is measured off the line of travel, so when the
line wanders the angle wanders with it). TRK-03 (the two lines of feet are what make a
trackway readable, and they only separate if left and right differ). AH-01 R4 (the press and
its derived sun-side lip are unchanged, so every facing is lit by the same north-west sun) and
R1 (empty ground, one wandering line, nobody at the end). TG-03 and TG-04 for the families.

REUSE CHECK: imports round 1's cook for the loader, the ramps and the press, and round 2's
for the marks and the walk constants. Nothing in either is retyped. New here: the profile, the
rasteriser and the wander.

## WHERE HE SEES IT
The VOTE tab, cook-which-way-is-he-facing-9-24.
Picture slices/vote/COOK_WHICH_WAY_IS_HE_FACING.png.
Rule 18: a bank and a candidate; nothing went to the alpha or the demo.

Bank: banks/BOHEMIA_THE_BOOT_AT_EIGHT_FACINGS_9_24_26.txt
Tool: tools/bohemia_which_way_is_he_facing_cook_9_24_26.py
