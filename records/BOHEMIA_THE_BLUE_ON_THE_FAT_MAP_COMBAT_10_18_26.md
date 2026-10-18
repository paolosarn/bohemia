# THE BLUE ON THE FAT MAP (COMBAT, 10/18, [the blue thing on the fat map])

HIS WORDS (the fourteenth votes, NO on combat-the-fat-map-sideways-10-18):
"Bro, what the fuck is that blue collision bro what the fuck this is? It's getting better but like what the fuck"

## WHAT THE BLUE WAS
Not a collision box, not a zone, not a highlight. The card's TOP half (the "before") showed two flat
blue rectangles left and right of the fight, sideways at night. They were HOLES: map blocks around
the board that never loaded left bare glass in the ring canvas, and the night pass (multiply by the
moonlight, rgb 185,198,240) painted bare glass that exact colour. The bottom half (the fix, every
block loaded) had none. The card put the bug on top, so the bug is what he read.

## WHAT CHANGED
1. The ring canvas is laid with ground (#2a2219, the board's own under-colour) before any block, so a
   block that fails to load is dirt, never moonlight on glass. Close in, a missing ring block draws
   the same dirt plus the ring's dim. slices/BOHEMIA_FIGHT.html, GROUND_UNDER.
2. A new leg in THE REBUILT FIGHT PLAYS: six ring blocks knocked out on purpose, on three screens,
   night and day, pinched out and close in. On the old code: 73.23 percent of the ring canvas moon blue
   at night on all three screens. On the fix: 0.00 everywhere.

## MEASURED ON THE CURRENT BUILD (no blocks knocked out)
18 shots (sideways, upright, laptop; seeds 1, 7, 23; at the open and pinched out; night): moon-blue
pixels 0.00 to 0.06 percent of the glass (the 0.06 is lamp glints in the art, not a hole). Zero
failed requests.

## THE CARD
combat-the-fat-map-no-blue-10-18, redo of combat-the-fat-map-sideways-10-18: ONE picture from the
game's camera, sideways at night, no before half. Rule 117: nothing new lit.

## SEEN ON THE WAY (not fixed, routed)
The deploy line's speech box cuts its last word sideways ("FIGHT when / ready." clipped) at 844 x 390.
UI owns the box's size; COMBAT owns the words (deploySay). Rule 117 says fewer words: COMBAT shortens
the line next round if UI does not grow the box.
