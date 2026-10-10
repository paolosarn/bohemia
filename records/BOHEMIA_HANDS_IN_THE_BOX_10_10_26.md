# HANDS IN THE BOX (ANIMATION, [hands in the box], 10/10/26)

## WHY THIS, NOW
Found baking the town ([the settlement's idle people], 10/9): the hail's raised hand was sliced flat at the top of
the 112 box on 9 of 25 outfits, so the town got the nod instead. Every surface that bakes from the rig (the fight's
sheets, the town's people, the map's cast) inherits whatever the box cuts. The row: measure every clip x outfit x
facing, fix it in the rig, never per bake, a gate on the rig.

## WHAT WAS CUT, MEASURED FIRST
Every outfit (the player, the 12 townsfolk, the 13 factions) x every bank clip (107) x 8 facings x 12 drawn keys,
266,000 drawings: 1,209 (outfit, clip, facing) sets of 22,256 had pixels in the top row of the box.
    raised hands  cheer 208, flee-sprint 166, hands-up 131, stretch 126, jumping-jacks 125, hail 125, heave 64:
                  945, on EVERY outfit, the player's own included (50 sets)
    the jump      168 (the whole body lifts 16 px; standing, the hair has 7 px to the top, 4 on the tall bodies)
    the sleep     78 (the body lies along the frame, feet up the picture)
    the church    8: his flat cap touches the top while he only STANDS (idle, every facing)
WHY: the 56 rig drawn at double size puts the head top 12 px down (9 on the tall bodies) and an arm is 32 px; a
hand thrown straight up has its joint at 0 to 4 px, -4 on the tall bodies, and its own pixels reach 4 to 8 px past
the joint by facing.

## THE RULE, IN THE RIG (slices/BOHEMIA_ALPHA_0_9.html, __HANDS_IN_THE_BOX__)
handsInBox(P): no hand joint above a ceiling; when a pose would put one there the arm swings OUT about the shoulder
(the elbow first if it is over too), then the forearm about the elbow, just far enough. Bone lengths kept, the side
the hand was on kept, continuous in the pose (it cannot make a joint jump between two drawn keys).
buildFrame builds with NO ceiling, which is the old picture to the byte. ONLY if an arm part (5-8 in the part grid:
the upper arms, the forearms with the hands) is in the top row does it put the ceiling 1 px under that hand and
build again, 1 px more a try, at most ten. A hat or a jump at the top is not an arm and is never rebuilt.

## THREE VERSIONS, AND WHY THE THIRD IS THE ONE (and the stop)
1. A FIXED JOINT CEILING (5 px, then 7): 7,359 cut frames to 3,786. A hand's pixels reach 5 px past the joint on
   SE and 7 to 8 on S, E and W, so any one number either cut some hands or lowered others for nothing.
2. READ THE PICTURE, RETRY WHEN THE CLAMP HAD FIRED: 758 left, all where the joint sat just under the ceiling
   (so the clamp never fired) and the side-on hand still reached the top.
3. RETRY ON AN ARM IN THE TOP ROW, NO CEILING ON THE FIRST BUILD, TRIES START AT THE BOX: 6,322 arm-cut frames to
   ZERO, every frame that was not cut unchanged to the byte. Stopped here (a fourth version is the tell).

## PROOF
    A RAISED HAND IS NEVER CUT (new, gates/a_raised_hand_is_never_cut_gate.js, in the suite as HANDS IN THE BOX),
    on the rig's own frames, rule off against on, 26 outfits x 7 hand clips x 8 facings x 12 keys = 17,472 frames:
      CONTROL: 6,322 frames with an arm in the top row with the rule off (the ruler can see a cut)
      0 with the rule on
      0 frames that were not cut changed (the rule touches only what it fixes)
      a raised hand stays raised: still reaching the standing head's top on 1,293 of 1,344 sets; the 51 that do
      not are 49 on the church (his cap already fills the box, so nothing fits over his head) and 2 back views (the
      reds' hands-up and stretch facing away)
      no arm comes down more than 5 px from where it was drawn
    FULL BANK (all 107 clips, through the 1,398 (outfit, clip, facing) sets whose pixels come within a pixel of the
    top, the only places an arm can be in row 0): arm-cut frames ONLY in the seven hand clips (cheer 1,934, flee-
    sprint 1,194, hands-up 1,172, stretch 1,078, hail 575, jumping-jacks 322, heave 47), all 6,322 to 0. Twelve
    frames came out different without a cut: all twelve the church's HEADSHOT, which differs when built twice with
    the rule OFF too (12 of 12): that clip carries its own running state, not this rule's.
    NOTHING BAKED CHANGES: the fight's sheets (SE, SW) and the town's people (S, SE, SW) had no arm in the top row on
    any outfit (the sweep's only hits on their clips are the church's cap), so neither is rebaked.
    VOTE animation-hands-in-the-box-10-10: the tallest outfits' wave, cheer and hands-up, rule off beside on, from the
    rig's own frames, twelve keys a bar on the 120 beat; looked at.

## WHAT IS NOT DONE, SAID SO
THE JUMP (168 sets) AND THE SLEEP (78) ARE THE BOX'S HEADROOM, NOT A HAND: the jump lifts the whole body 16 px with
7 px of room over the hair. Shrinking the jump to fit kills it; the real answer is the box (more room over the head)
or the jump's lift carried as an offset the surface draws. Opened as [room over the head]: it changes the frame every
surface reads, so it is measured and proposed to every reader before a pixel moves.
THE CHURCH'S CAP touches the top standing still: that is the outfit's height and its hat, CHARACTER's look, not a
pose. Routed to CHARACTER with the measurement (cap top at row 0 on all 8 facings, idle; the tall body's head top is
row 9 and the cap is 9 px tall).

## [bb box] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
Battle Brothers draws a man as layered still pieces on a fixed sprite (this lane's 9/28 line: its figures do not
animate their bodies), so a raised arm never has to fit a frame; the library has nothing on a box cutting a sprite,
and it is not claimed. WHAT WE DO DIFFERENTLY: our people throw their hands up, and the rig itself guarantees the
gesture arrives whole on every surface, instead of an artist fixing each sheet by hand.

## ANALOG HORROR LINE (rule 30)
A hand cut off by the top of the picture is a framing mistake; a hand that reaches for the edge and stops just
inside it is a recording that knows where its frame is.
