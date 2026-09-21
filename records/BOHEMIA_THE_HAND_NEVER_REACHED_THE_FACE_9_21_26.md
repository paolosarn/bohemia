# THE HAND NEVER REACHED THE FACE — ANIMATION, [redo killed], 9/21/26

## THE BATCH, AND WHY THESE FIVE
Paolo 9/7 killed eat, drink, smoke, cough and whistle along with 24 other
originals, and said why: "some of the DIRECTIONS look like dog shit: when it's
facing north-east the hand was behind the head even though it's supposed to be
in front." THAT WAS TWO PROBLEMS WEARING ONE COAT. The draw-order half was fixed
9/13 (NEAR HAND). This is the other half and it is worse.

## THE CAUSE: ONE HELPER USED FOR THE WRONG JOB
All five aimed with `gunT` — THE GUN TARGET. It is the chest point pushed forward
along the facing, which is right for a pistol held out and wrong for a hand at the
mouth, and because the push follows the facing it lands somewhere different in
every direction. His sentence, exactly.

## MEASURED TWICE, AND THE TWO RULERS DISAGREED
**Ruler one, the joints:** how close does sk.handR get to the mouth point. The head
is 18 px crown to neck. The closest any of the five ever came was 12.9 px and the
worst was 21.2 — MORE THAN A WHOLE HEAD-HEIGHT, in every direction.

**Ruler two, the picture:** ask buildFrame for the part id under every DRAWN pixel
and measure hand pixels (7, 8) against the face (1, 2). After the redo, ruler one
said the hand was 2.9 px from the mouth on north-east — the best score of all forty
cells. Ruler two said 45 px. The picture showed an arm reaching past the head with
no hand near it.

**BOTH WERE RIGHT.** Facing away, a hand at the mouth is behind the skull, the
compositor is first-wins, and the reaching hand is never drawn at all; the only
hand pixels left in the frame are the resting one at the hip. **A DISTANCE BETWEEN
TWO JOINTS CANNOT SEE WHAT IS IN FRONT OF WHAT.** That is the near-hand law
arriving from the pose side instead of the draw-order side, and it is the tenth
ruler of this family this lane has thrown away.

## THE REDO, ON THE PICTURE RULER (the only one that counts)
    pictures where the hand reads at the face    9 of 40  ->  33 of 40
    closest the hand ever gets                    10.7px  ->  3.9px
    still not reading                                  -  ->  facing N on all five,
                                                              plus drink/W, smoke/SW
One cell regressed: drink facing west, 16.7 -> 49.

## AND IT IS NOT IN THE ALPHA, BECAUSE IT COSTS ANOTHER LAW
NECK HOLDS HEAD (9/18) goes from 15 detached frames to 22 with the redo in. Every
new one is FACING EAST: the forearm that reaches the mouth in profile passes over
the throat, which is the one thing that law exists to stop.

**AND IT CANNOT BE NUDGED OUT.** Raising the hand so the arm arrives under the jaw
instead of through the neck made BOTH numbers worse: 24 detached and 31 of 40. I
tried three heights and three target shapes; STOP PRODUCING says a third version
means the attempt is wrong, so it is named instead of nudged again.

## BOTH HALVES WANT THE SAME MISSING PIECE
The back views vanish because the hand draws behind the skull. The profile views
cover the throat because the forearm draws over the neck. Both are DRAW ORDER, and
the safe shape already exists in this file: A CLIP THAT BRINGS A HAND TO THE FACE
SHOULD DECLARE IT, the way a gun clip declares `_gun`, and handOrder should bring
that arm-unit and the neck into the right relationship off the flag. A flag is
constant for the whole clip, so unlike the two rules retired on 7/26 it cannot flip
mid-swing, and unlike reading the pose it cannot disagree with itself between
phases. That is the next round of this row.

NEVER SHIP RED: the alpha is untouched. The redo is in the VOTE tab as pictures
rendered from the real build, and the code is below, ready to paste the round the
flag exists.

## THE GATE
gates/the_hand_reaches_the_face_gate.js. It SAYS the redo is not in the build
rather than going red over a thing nobody shipped, and it holds the ratchet (33 of
40, may only go up) from the round it lands. Two mutations caught: eat back on the
gun target (33 -> 28 and the source claim), and the hand welded to the face (the
rest-phase control 21 of 32 -> 0 of 32). The first cut of that control was VACUOUS
— it asked whether any cell was away from the face, and a welded build still
scored 10 away, because on the back views the hand is occluded and reads as far
whatever the pose does.

## THE CODE, VERBATIM, READY TO PASTE
```js
function facePtRig(d){const r=RIG[d];
  /* the mouth: down the skull from the crown toward the neck */
  return [r.headTop[0]+(r.neck[0]-r.headTop[0])*0.62,
          r.headTop[1]+(r.neck[1]-r.headTop[1])*0.62];}
/* WHERE THE HAND SITS WHEN IT IS AT THE FACE: at the mouth, nudged toward the
   CAMERA so it reads in front of the skull instead of buried in it, and `up`
   above it for a cigarette or a bottle lip.
   *** THE FIRST CUT PUSHED IT ALONG THE FACING AND THE PICTURE CAUGHT IT. ***
   Numbers said the hand was 0.3 px from the mouth on north-east, the best score
   of all forty cells, and the picture showed an arm pointing off into nothing
   with no hand anywhere near the head. Facing away from the camera, the mouth is
   on the FAR side of the skull, so a hand perfectly at the mouth is hidden behind
   it -- correct anatomy that reads as a mistake. A DISTANCE TO A POINT CANNOT SEE
   WHAT IS IN FRONT OF WHAT, which is the same thing the near-hand law (9/13) is
   about, arriving from the pose side instead of the draw-order side.
   So the nudge is mostly SCREEN-DOWNWARD, toward the viewer, on every facing, and
   only its sideways part follows the facing (which is what keeps it reading as in
   front of the lips in profile). The hand is never behind the head again by
   construction, not by a per-facing table. */
function faceT(d,out,up){const m=facePtRig(d),a=FACEANG[d];
  /* AND THE HEIGHT IS NOT FREE. The first heights put the hand just under the
     mouth, and NECK HOLDS HEAD (9/18) went red on six frames, all facing east:
     the forearm came across horizontally and covered the throat, which is the
     one thing that law exists to stop. The hand rides higher now so the arm
     arrives UNDER THE JAW instead of THROUGH THE NECK. Caught by that gate, not
     by looking, which is the whole reason it is in the suite. */
  return [m[0]+Math.cos(a)*out, m[1]+out*0.55-up];}
/* *** THE THIRD CUT OF THIS WAS BUILT, MEASURED AND THROWN AWAY. ***
   Facing away, the drawn hand is 45 to 49 px from the face on all five clips --
   half a body -- because a hand at the mouth is BEHIND the skull, the compositor
   is first-wins, and the reaching hand is not drawn at all; the only hand pixels
   left are the resting one at the hip. I tried sliding the hand sideways, clear
   of the skull, as the facing turns away. It FIXED north on two clips (47 -> 20)
   and BROKE north-west on three (13 -> 47): the hand pops in and out of view
   depending on whether it lands over the body or off the silhouette, so the
   target position is not the lever. STOP PRODUCING, 7/26: a third version means
   the attempt is wrong, so it is named instead of nudged again.
   THE LEVER IS DRAW ORDER, AND THE SAFE SHAPE ALREADY EXISTS IN THIS FILE. A
   clip that brings a hand to the face should DECLARE it, the way a gun clip
   declares _gun, and handOrder should bring that arm-unit forward off the flag.
   A flag is constant for the whole clip, so unlike the two rules retired on
   7/26 it cannot flip mid-swing, and unlike reading the pose it cannot disagree
   with itself between phases. Named for the next round of [redo killed]. */
/* AND THE REACH: u of 0 leaves the hand exactly where the rest pose has it, u of
   1 puts it at the face. Every one of these clips is a hand LEAVING the body and
   COMING BACK, so the clip keeps its own envelope and only the destination moves. */
function faceReach(d,u,out,up){const h=RIG[d].handR,t=faceT(d,out,up);
  const k=(u<0)?0:(u>1?1:u);
  return [h[0]+(t[0]-h[0])*k, h[1]+(t[1]-h[1])*k];}

eat:(d,ph)=>{const c=Math.abs(Math.sin(ph*2*Math.PI));   /* __THE_HAND_NEVER_REACHED_THE_FACE__ */
   return {ikR:faceReach(d,0.42+0.58*c,2.6,-1.2),bendR:'auto',upL:0.3,foreL:-0.4,head:0.06*c,spine:0.03};},

drink:(d,ph)=>{const t=ph;const e=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));const up=e(0.1,0.3)*(1-e(0.7,0.9));
   /* __THE_HAND_NEVER_REACHED_THE_FACE__: the bottle lip sits ABOVE the mouth and
      the head tips back to meet it, which is why `up` is positive here. */
   return {ikR:faceReach(d,0.30+0.70*up,2.2,1.6),bendR:'auto',head:-0.18*up,upL:0.25,foreL:-0.3};},

smoke:(d,ph)=>{const t=ph;const e=(a,b)=>Math.min(1,Math.max(0,(t-a)/(b-a)));const up=e(0.05,0.2)*(1-e(0.45,0.6));
   /* __THE_HAND_NEVER_REACHED_THE_FACE__: the cigarette goes TO the lips and the
      hand drops away between drags, so the rest end of the reach is low. */
   return {ikR:faceReach(d,0.26+0.74*up,3.0,-0.4),bendR:'auto',head:0.04-0.1*up,upL:0.2,foreL:-0.25,spine:-0.02};},

cough:(d,ph)=>{const t=(ph*2)%1;const b=Math.max(0,Math.sin(t*Math.PI*3))*(t<0.6?1:0);
   /* __THE_HAND_NEVER_REACHED_THE_FACE__: a cough covers the mouth and STAYS there
      through the fit, so the reach is high all the way across and only tightens
      on the spasm. The old one aimed at a fixed point in front of the chest and
      never moved at all, which is why it read as a man doubling over at nothing. */
   return {spine:spF(d)*(0.12+0.18*b),head:spF(d)*(0.1+0.1*b),
     ikR:faceReach(d,0.80+0.20*b,2.0,-0.8),bendR:'auto',upL:gL(d)*0.15,
     hipOff:[0,0.8*b],legCompressL:0.06*b,legCompressR:0.06*b};},

whistle:(d,ph)=>{const br=Math.sin(ph*2*Math.PI);
   /* __THE_HAND_NEVER_REACHED_THE_FACE__: fingers AT the lips, held, breathing.
      A whistle is the one of the five where the hand never leaves the face. */
   return {ikR:faceReach(d,0.92+0.04*br,2.4,-0.6),bendR:'auto',
     head:-spF(d)*0.08+0.02*br,spine:-spF(d)*0.04,upL:gL(d)*(0.15+0.05*br),
     hipOff:[0,-0.4*Math.max(0,br)]};},
```
