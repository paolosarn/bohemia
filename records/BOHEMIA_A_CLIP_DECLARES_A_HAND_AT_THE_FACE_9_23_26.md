# A CLIP DECLARES A HAND AT THE FACE — ANIMATION, [redo killed], 9/23/26

## THE PIECE THE ROW HAS BEEN WAITING ON, AND IT WORKS
Paolo 9/7: "when it's facing north-east the hand was behind the head even though
it's supposed to be in front." Two rounds established that the back views were
never a pose problem: **facing away, a hand at the mouth is behind the skull, the
compositor is first-wins, and the reaching hand is never drawn at all.**

A clip now DECLARES it, exactly the way a gun clip declares `_gun`, and handOrder
reads the flag and brings the working arm-unit forward. A declaration is constant
for the whole clip, so unlike the two rules retired on 7/26 it cannot flip
mid-swing, and unlike reading the pose it cannot disagree with itself between
phases.

**MEASURED ON THE DRAWN FRAME, five clips x eight facings:**

    pictures where the hand reads at the face
        killed                     9 of 40
        redo, no declaration      33 of 40   (facing N: 45 to 49 px away)
        redo + the declaration    40 OF 40   (facing N: 6.6 to 7.3 px)

Every facing, every clip, under 16px on a 22px head. The back views are closed.

## AND THEY ARE STILL NOT IN THE ALPHA, FOR THE SAME SEVEN FRAMES
NECK HOLDS HEAD: ceiling 15, and with the poses in it reads 23.

**ISOLATED, WHICH IS THE NEW FACT.** Three trees, one ruler:
    flag + order rule, ORIGINAL poses      8/0 green
    flag OFF, redone poses                 22 detached
    flag ON, redone poses                  23 detached
So the POSES cost 7 and the order rule costs 1. The mechanism is clean; the poses
are what the gate objects to.

**AND THE CAUSE IS NOT WHAT IT LOOKED LIKE.** The gate reports **0 frames draw NO
NECK** (it was 31 before this rule), so nothing is covering the throat. The head
blob simply sits 3px off the body blob on profile views. The old gun-target arm
ran horizontally across the upper chest and bridged that gap; taking it away
uncovers a separation that was always there.

## FOUR ATTEMPTS, AND THE FOURTH IS WHERE I STOPPED
  1. three target heights (9/21) -- made both numbers worse
  2. sliding the hand sideways clear of the skull (9/21) -- fixed N on two clips
     and broke NW on three
  3. putting the FACE behind the working arm-unit so the arm bridges the jaw to
     the shoulder (9/23) -- measured IDENTICAL, 23 either way, so it was deleted
  4. halving the head rotation on the three offending clips (9/23) -- 23 again,
     and drink went 3px to 4px
STOP PRODUCING, 7/26: a fourth version means the attempt is wrong. It is named.

## AND A THING HE SAID THAT THIS DOES NOT ANSWER
His verdict was "it looks like all of them Northeast and south tweaking". **THE
DECLARATION FIXES THE FACINGS HE DID NOT NAME.** On S and NE the hand was already
5 to 8 px from the face before and after; the sheets bake byte-identical there,
which is how it was caught. So his complaint about those two is about MOTION, not
placement, and it is unanswered. Said out loud rather than counted as a win.

## WHAT SHIPPED
The FLAG and the ORDER RULE, with the five poses out. The flag is inert until a
clip declares it, so nothing he plays changes, and the mechanism is banked and
gated. The clips are in VOTE, playing, with the back views fixed.

## THE GATE, AND A BUG IN MY OWN
HAND TO FACE keyed "is the redo in the build" on the HELPER FUNCTIONS. They landed
this round with the declaration while the poses stayed out, so a deliberate hold
turned into four red claims. A GATE THAT READS THE PLUMBING INSTEAD OF THE PRODUCT
WILL ALWAYS DO THAT. It reads the CLIPS now.

## WHERE IT IS
  slices/BOHEMIA_ALPHA_0_9.html                     the flag, carried and read
  slices/vote/ANIMATION_THE_HAND_IN_FRONT_PLAYS.html  the back views, playing
TAB: VOTE.
