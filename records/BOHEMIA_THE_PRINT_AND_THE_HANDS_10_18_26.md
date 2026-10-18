# THE PRINT AND THE HANDS (CHARACTER, [the print and the hands], 10/18/26)

From [the thirteen through the rig]'s own twin diffs (rule 115c): the models carried each faction's colour but not its
print, and the rig's man has mitts for hands; close up, the old flat sprites still won on the print. Cook only (rule
100): nothing in slices/, engine/ or the demo; the rig unedited; the old sprites stay until a replacement passes VOTE.

## What was made
- tools/bohemia_character_the_thirteen_through_the_rig.py: PRINTS, print_tile(), section 1b (the hands), 8c and 8d.
  All fourteen models rebuilt (records/character/rig/<look>.json) and re-rendered through DIRECTION's master rig
  (records/target/character/rig/<look>/), the walk of the four coats included.
- tools/bohemia_character_the_print_and_the_hands.py: the sheet, records/target/character/CHARACTER_THE_PRINT_AND_THE_HANDS.png
  (before = last round's renders out of git at 9ebddcc, after = this round, his twin = the street's flat look).
- VOTE: character-the-print-and-the-hands-10-18, a candidate (rule 108), redo of the thirteen through the rig.

## THE PRINT IS A MATERIAL, NOT A PAINT
Each print is a tile in METRES (32 cm square at 400 px a metre) linked into the cloth's Base Color; the rig's source pass
keeps a linked colour and puts its wear, grime and grain on top, so the print wears like the cloth. It is mapped round
the body in the model's real metres (the angle round the torso, or round its own leg below the hip, times a radius, and
the height; an up-facing face by its plan), seam at the back. Sizes are the real cloth's, pushed to what reads at 57 px a
metre: a real 1 cm pinstripe is half a pixel and vanishes, so the chalk line is 2 cm on an 8 cm repeat (the widest
chalk stripe a suit wears); the plaid's bands 6 cm and its thin line 1.5 cm on a 16 cm repeat (a blanket plaid); the
tee's bands 3 cm.

THE PRINT GOES ON THE PIECE THE EYE SEES (a decision, logged):
- MOB: the pinstripe shirt sits under a mantle and a cape, so the stripe is the suit: mantle, cape and trousers.
- CARAVANS: the plaid shirt sits under a closed cocoon coat, so the plaid is the shoulder mantle (a blanket over the
  coat, the caravan read) and the shirt shows in a 6 cm V.
- COLORFUL: the striped tee under the open car coat, the V widened to 8.5 cm (the twin's teal panel down the front).
Cycle 1: the plaid's red line at (146,84,56) jumped out of the dust; (128,82,58).

## THE HANDS
Each mitt is measured in its own frame from the wrist joint (its long axis to the farthest vertex, the thin axis of
its spread the back of the hand, the third its width), folded 60% into the wrist so its indices and weights stand, and
a hand is modelled in that frame on the same bone, weight 1: a palm, four fingers of two joints each curled toward the
palm (22 and 34 degrees), and a thumb off the palm's midline edge. Pixel-art hands are drawn big: fingers 12% fatter than
life. Cycle 1: the thumb at 0.75 out splayed like a claw from the front; 0.55. At 1:1 the hand is a palm, a thumb and a
fist's edge (the AFTER close-ups); the four fingers merge into one or two pixel columns, as a drawn sprite's do.

## THE CHECKS
- Person card through the rig: Mob, Caravans, Colorful 1 of 8 out (value span, as last round), Body 0.
- Light within the cloth (tools/bohemia_character_light_within_the_cloth.py --rig): every look's median 178 to 212, the
  rig's sun at 204.6 in that convention, so the print and the hands moved no light.
- VOTE TAB gate: my items pass (two older CHARACTER whys trimmed to two sentences); 1 leg red on four other lanes' whys.

## NEXT
The faces (PORTRAIT renders the HD face from this model, rule 115c order); the walk of every look; the Anarchists'
light outlier on the old sprite is answered by its rig model (201.7 within the cloth).

REFERENCE CHECK: the twin is the game's own thirteen as last painted (records/cook3/thirteen_repainted.png, AFTER) and
last round's renders; the runway names (a chalk stripe suit is the Mob's tailoring); analog horror AH-01. No reference game.
