# THE SHOT KICKS (ANIMATION, [the shot kicks], 10/9/26)

## WHY THIS, NOW
The lane's top OPEN row. Rule 63 (the rebuilt fight is Battle Brothers' combat; half its men shoot) and 69 (the bank
on the board). The fight's shot was two-hand@0: the aim, HELD.

## A CORRECTION FIRST
Last round's record (BOHEMIA_THE_FIGHTS_CLIPS_10_9_26) said "the bank has no recoil clip". WRONG: deadeye fires with
a recoil, and so do crouch-aim-1h, crouch-aim-2h and cover-fire. But deadeye's is a 2.2 px pull for the sliver of
its bar where |sin| < 0.08, inside a 126-degree sweep, and the crouch-aims are crouched: none is a man standing in
the line who fires once. So the clip was still needed; the claim was still wrong, and it is corrected here.

## WHAT SHIPPED
THE ALPHA: two one-beat firing clips beside deadeye, built on the aim poses the fight already shows (the same
grips, gunTA): fire-2h (a long gun) and fire-1h (a pistol). The kick snaps in over the first tenth of the beat and
eases out over the rest: the gun pulled back toward the shoulder (5 px rifle, 4 pistol), the muzzle climbing (0.30
rad rifle, 0.5 pistol, it flips more), the shoulders and the weight rocking back, the head snapping back; facing
you the climb is the grips rising, since a muzzle pointed into the screen cannot be seen to tilt. _fire is set on
the kick for whatever draws the flash. ANIMBEATS: one beat each.
THE FIGHT'S SHEETS: eight columns APPENDED to all 26 looks (26 -> 34, every older column byte-identical): each clip
at four drawn poses (rising, peak, easing, settled). THE TABLE: shot (fire-2h), shot_1h (fire-1h), aim (two-hand@0).

## WHAT LOOKING FOUND
The first kick read at 112 as nothing: the arms are black on a black coat and the rock was a pixel. Version two
doubled the pull-back, the climb, the rock and the head snap; at the peak of the kick 61 to 79% of the body has
moved against the settled shot on every look. Facing you it stays smaller, and is said so. Stopped at two.

## PROOF
    FIGHT CLIPS TABLE 14/0 (was 11): THE SHOT KICKS -- three or more pictures for the rifle and the pistol, every
    look, both ways; 30% or more of the body moved at the peak; the body ROCKS BACK, away from the aim. MUTATION:
    the shot as the aim held fails all three.
    NOT IN ANY GATE'S LIST, SO MEASURED BY HAND (the elbow gate walks CLIPS, the envelope gate is scoped to five hand
    clips): fire-2h and fire-1h, 0 elbow flips over 8 facings x 12 keys; at most ONE reversal over 120 degrees a bar
    for any joint (the kick itself; the envelope law flags four or more).
    Rig regression on this tree: READS FACING YOU 23/0, ELBOWS 10/0, ENVELOPE 10/0, NEAR HAND 6/0, CLIP HEALTH 6/0,
    CLIP AUDIT 5/0, MOTION VISIBLE 24/0, FROZEN POSES 29/0, ARM HOLD 23/0, COMBAT ANIM 118/0, STRUCTURE 134/0,
    COAT ON LEGS 10/0, NECK 8/0.
    VOTE: animation-the-shot-kicks-10-9, a volley of three, before beside now, from the fight's own sheets. The page
    draws no flash of its own: what plays is only what the sheets carry.

## NOT DONE, SAID SO
The fight plays it once COMBAT's frameFor reads DB.people.clips (routed last round, not taken up yet); the bank's
frames carry no gun sprite, so the weapon and the flash are the fight's to draw on the hand.

## [bb shot] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
Battle Brothers carries a shot with sound and numbers on still figures (library 10_UI_AND_FEEL; this lane's 9/28
line on its still figures). WHAT WE DO DIFFERENTLY: the body fires: the kick lands on the beat, a pistol flips
higher than a rifle, and you can read who just shot from across the board.

## ANALOG HORROR LINE (rule 30)
A gunshot that moves nothing is a sound effect laid over a photograph; the kick is the frame where the tape jumps.
