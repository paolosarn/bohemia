#!/usr/bin/env python3
"""BOHEMIA CHAR STAGE OVERLAP FIX (8/9/26, CHARACTER lane)

PAOLO REPORTED A DEAD SHUFFLE BUTTON. IT IS NOT DEAD, AND SAYING SO IS THE
POINT -- but there IS a real defect at that exact spot and this is it.

WHAT I MEASURED, in a real iPhone-portrait DPR-3 browser, before touching
anything:

    #charFit      rect [23, 403, 106, 23]   "SHUFFLE FIT"
    #charClipLbl  rect [23, 407,  47, 19]   the clip name
    overlap: TRUE

Both are anchored bottom-left of #charStage, so THE BUTTON SITS ON TOP OF THE
CLIP LABEL. `document.elementFromPoint` at the label's own centre returns
`charFit`, and the label's `reachesSelf` is FALSE -- it is completely buried.
That is why the control renders as a garbled smear with the letters of "idle"
bleeding out from behind a dress emoji, which is exactly what a dead button
looks like from arm's length in the sun.

THE BUTTON ITSELF WORKS, AND I PROVED IT RATHER THAN ASSUMED IT:
  - a tap at #charFit's centre reaches #charFit (reachesSelf TRUE)
  - three clicks move window.G_WORN from {} to four named canon garments
  - the big preview's colour histogram, averaged over six frames so the idle
    animation cannot fake a difference, changes substantially
  - no page errors
The clothes-tab per-square shuffle works too (clip idle -> argue, tap reaches
the button, 245 squares). SO NO SHUFFLE BUTTON IN THIS BUILD IS INERT.

I ALSO GOT THIS WRONG ONCE ON THE WAY, and it is worth writing down: my first
probe read `G.equipped` and reported "NOTHING MOVED AFTER 4 CLICKS". shuffleFit
writes `window.G_WORN`. I measured the wrong variable and nearly filed a dead
button that works. THE TWO WARDROBE OBJECTS EXISTING SIDE BY SIDE IS ITSELF THE
FINDING -- G.equipped holds path-style ids ("shirt/cowl-hood") and G_WORN holds
named canon garments ("FIELD JACKET"), and that split is the unfinished wardrobe
merge. Not fixed here; a merge is a design change, not a layout nudge, and it
needs its own turn.

THE FIX: the clip label moves to the TOP-LEFT of the stage. RIG: NEW already
holds top-right and the two shuffle buttons hold the bottom corners, so top-left
is the only free corner and nothing else has to move. The label is INFORMATION
and the buttons are CONTROLS; when they collide, the control keeps the thumb-
reachable corner and the label goes where nothing is tapped.

    python3 tools/bohemia_charstage_overlap_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = 'id="charClipLbl" style="position:absolute;left:7px;bottom:7px;'
NEW = 'id="charClipLbl" style="position:absolute;left:7px;top:7px;'

alpha = open(ALPHA, encoding='utf8').read()

if NEW in alpha and OLD not in alpha:
    print('  ok   (already) clip label already moved off the shuffle button')
    sys.exit(0)

n = alpha.count(OLD)
if n != 1:
    print('  MISS clip label anchor — expected exactly 1 match, found %d' % n)
    print('CHAR STAGE OVERLAP: refused to write')
    sys.exit(1)

open(ALPHA, 'w', encoding='utf8').write(alpha.replace(OLD, NEW, 1))
print('  ok   clip label bottom-left -> top-left, out from under SHUFFLE FIT')
print('CHAR STAGE OVERLAP: applied to %s' % ALPHA)
