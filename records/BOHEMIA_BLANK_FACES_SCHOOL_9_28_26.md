# [blank faces] SCHOOL ROUND -- WHY A FACE READS AS NOBODY, RE-MEASURED
# PORTRAIT (chat 20), 9/28/26. Coordinator 9/14: what makes a small painted face
# read as a person, measured against twenty shipped faces at his phone size,
# deliver the three defects by frequency. No face is redrawn this round.

## THE OLD ANSWER, RE-CHECKED, AND FOUND STALE
The 9/21b note on this row gave a starting point from a hand-inspected face
(53cbb684): "bead eyes (a white rectangle with a block, no pupil, no ring, no
lid shadow), a flat rectangle mouth, and NO LIGHT on the face mass." That was
before this session's own [customizations first], [horror face] R1 and R6, and
the eye-white ruling (Paolo 9/22: "the eyes not being all white... less of a
frog") all landed. Read the renderer's own source before measuring anything:

- THE EYE now has a sclera tied to the face's own skin ramp (not a universal
  white), a lid shadow, a 1x2 pixel iris/pupil block, and a one-pixel catchlight
  (`[238,244,242]`, drawn to one side of the pupil). "Bead eyes, no pupil, no
  ring" is not what ships any more.
- THE MOUTH is four named shapes (closed/mid/open/wide) reading Preston Blair's
  chart compressed into nine pixels, with an inner dark seam and a lip
  highlight. "A flat rectangle mouth" is not what ships any more either.

Both are corrected here rather than carried forward unchecked, which is the
whole point of a school round: measure the CURRENT build, not the last note
written about it.

## THE METHOD
Twenty crowd faces (`gate:crowd:0` through `gate:crowd:190`, every tenth id, a
spread across the population rather than a hand-picked few), rendered with the
game's own `faceFor`/`renderFace`, read as raw pixels with no camera or export
step in between. Three candidate defects, each checked with a number, not a
guess, and each checked for whether it holds ACROSS the sample or was one
face's accident:

## 1. THE LIGHT (still open, and it is worse than the last reading said)
The world's own rule (`gates/art_45_gate.py`, the ruler [horror face] borrowed
for R4): on a lit mass, the right third of each row should out-luminance the
left third by at least 8% of the row's mean. Applied here to skin pixels only,
row by row, from the top of the face to the chin, on all twenty:

    faces meeting the 8% threshold          0 of 20
    faces where right actually beats left   2 of 20 (both under 3%, still short)
    faces leaning the WRONG way (left > right)  18 of 20
    mean right-minus-left, as % of the face's own base luminance   -1.95%

[horror face]'s own R4 finding (120 faces, median right-minus-left 1.52 against
a needed 9.84) read this as "barely lit, but the right direction." ON THIS
SEPARATE, BROADER SAMPLE THE SIGN FLIPS: the faces don't lean weakly right,
they lean left almost every time. The earlier number and this one are not a
contradiction -- they are two different samples (that round's 120 were the
family and a few named faces; this round's 20 are the general crowd) -- but the
practical answer for "does a face in the valley read as lit" is now measurably
WORSE than "faint but correct": it is faint and usually backwards.
READING THE SOURCE EXPLAINS THE SIGN: the renderer already draws a static
soft-shadow polygon starting at the face's own screen-right (`cx+7` onward) and
a light strip only across the forehead. That shadow placement is backwards
against the world's own convention (art_45's ruler wants the RIGHT third
brighter, matching the sun this world already draws everywhere else); the
portrait renderer puts its one built-in shadow on exactly the side that should
be lit. That is the whole mechanism behind "18 of 20 lean the wrong way" -- it
is not noise, it is one polygon on the wrong side. Whether to flip that polygon
or replace it with something that reads the world's actual light direction per
scene is a build question for whoever takes this next, not answered here.

## 2. THE HAIR HAS NO VOLUME (new this round -- not in the 9/21b list at all)
The renderer defines a highlight tone (`+22` per channel) and a shadow tone
(`x0.8`) for hair, and uses the highlight for a small triangle at the crown.
Measured what fraction of a hairstyle's own drawn pixels are the flat BASE
tone versus either variant, across all twenty:

    average flat-tone share of the hair mass    84.8%
    range across the twenty                     64.4% to 99.2%
    average hair pixel count per face           609 of 4,096 (14.9% of the canvas)

A hairstyle occupying roughly a seventh of the whole small portrait, with 85%
of its own pixels one identical colour, reads as a coloured cap rather than a
lit mass with any volume -- the same complaint as THE LIGHT, on a different
asset, and one this row's own original category list ("the eyes and their
light... where the light comes from") did not name because nobody had looked
at the hair specifically before.

## 3. THE BROW SHADOW IS AN ACCIDENT, NOT A DESIGNED CUE
Classical portrait construction (and every pixel-portrait tutorial that covers
a face at this resolution) gives the brow ridge its own cast shadow into the
eye socket, independent of any external light direction, because it is a
self-shadowing concavity on the skull, not a stylistic choice. Measured: the
average skin luminance in the strip between brow and eye, against each face's
own whole-face skin baseline, on the 14 of 20 faces with bare eyes (shades
fully occlude the socket on the other 6, so they are excluded rather than
counted as passing or failing something they cannot show):

    faces with a real dip (>=7% darker than baseline)    7 of 14
    faces with no meaningful dip, or the WRONG way        7 of 14 (three of
                                          those actually read brighter there)

Reading the source: there is no code that targets the socket at all. Where a
dip shows up, it is incidental overlap with the general soft-shadow polygon
that also covers part of the cheek and jaw; where the polygon does not happen
to reach that far, there is nothing there. A cue this basic to "this is a
skull, not a mask" is present in exactly half the population, by luck.

## THE THREE, RANKED BY FREQUENCY (as asked)
    1. THE LIGHT           20 of 20 faces fail it, 18 of 20 fail it backwards
    2. THE HAIR HAS NO VOLUME   20 of 20 faces show it (84.8% average flatness)
    3. THE BROW SHADOW IS LUCK   7 of 14 bare-eyed faces show no cue at all

All three are drawing/rendering questions, not customisation questions: they
apply the same way to every face the generator makes, his own approved one
included, so none of them is something a slider already reaches.

## WHAT THIS ROUND DID NOT DO
No face is redrawn (rule 6, mode: research). No fix for any of the three
shipped, proposed as code, or estimated in cost. That is the next lane's
question if one of these is worth taking further, not this round's.

## COOK (rule 22)
tools/bohemia_cook_why_a_face_reads_as_nobody.js -> slices/vote/PORTRAIT_WHY_A_FACE_READS_AS_NOBODY.{html,png}.
Six real crowd faces, the extremes of each measurement, rendered with the
game's own facePerform blink/brow timing so the card plays (rule 25) rather
than showing a still. No vote asked beyond "does this match what you see" --
there is no fix on the table to approve or reject yet.

## WHERE HE SEES IT
TAB: VOTE, in the alpha. Item `portrait-why-a-face-reads-as-nobody-9-28`.
