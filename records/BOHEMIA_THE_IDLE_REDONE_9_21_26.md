# THE IDLE, REDONE — ANIMATION, 9/21/26

RULE 22 (Paolo 9/21): "I need the UI chat to be cooking up more... I'll enter the sound
chat and it's not even making fucking sounds. It's coding and checking whether the sounds
are broken or not." ANIMATION owes A CLIP every round, registered in the VOTE tab, or the
round did not happen. Rule 18 still holds the play surface: this clip goes to VOTE only.
It is NOT in POSE.idle in the alpha and must not be until he votes it up.

## WHY THIS CLIP AND NOT ANOTHER ONE
`idle` is on his ORIGINALS THUMBS DOWN list (records/BOHEMIA_CLIP_VERDICTS_9_7_26.txt).
It is also the single most-seen clip in the game: every standing person in the city and
every companion between beats plays it. Redoing the clip that is on screen the longest
buys the most per round.

His amendment, verbatim, and the reason this is a redo and not a deletion:
  "a lot of them are good, a lot of them aren't good. ... IF I KILLED IT I DON'T WANT IT
   GONE. I just think it could be done better. Make a new one."

## WHAT HE KILLED, EXACTLY
    idle:(d,ph)=>{const m=(RUNMIR[d]?-1:1),k=SWF();return {
      upL:m*k*( 0.05+0.03*Math.sin(ph*2*Math.PI)),
      upR:m*k*(-0.05-0.03*Math.sin(ph*2*Math.PI))};},
One sine wave, two arms, exactly out of phase, forever. Nothing else on the body moves.
Every person in a crowd plays it on the same clock, so a street of forty people is forty
metronomes swinging in lock step. That is the defect, and it is not a bending-elbow
defect: there is nothing in the clip to bend.

## WHAT THE REDO IS BUILT FROM
Three clocks that never line up, so the loop never reads as a loop:
  BREATH   in over 0.45 of a beat, out over 1.15, then held. Not a sine. A real breath is
           fast in and slow out, and the hold is the part that makes a body look alive.
  WEIGHT   a drift at 0.75x the loop rate — three against four. It is never in the same
           place twice on the same breath.
  A TURN   one head turn, late in beat three, smoothstepped, that DOES NOT TURN BACK.
The turn is the analog-horror shape (rule 20, DIRECTION's law): the frame is ordinary,
the body is doing an ordinary thing, and one small thing in it does not resolve.

## THE CLIP, VERBATIM, READY TO PASTE INTO POSE WHEN HE VOTES IT UP
    idle:(d,ph)=>{const m=(RUNMIR[d]?-1:1),k=SWF();
      const b=(ph*4)%4;               /* the beat inside a four-beat loop */
      const c=b%2;                    /* breath runs on a two-beat cycle  */
      const br=(c<0.45)?(c/0.45):Math.max(0,1-(c-0.45)/1.15);
      const w=Math.sin(ph*2*Math.PI*0.75);            /* 3 against 4 */
      const t=Math.max(0,Math.min(1,(b-2.55)/0.45));
      const turn=t*t*(3-2*t);
      return {spine:0.020*br+0.010*w,
        head:-0.022*br+0.105*turn,
        hipOff:[0.40*w, 0],
        upL:m*k*( 0.050+0.020*br+0.020*w),
        upR:m*k*(-0.044-0.028*br+0.020*w),
        foreL:0.034*br, foreR:0.016*br-0.048*turn,
        legCompressL:0, legCompressR:0};},  // IDLE LAW: feet NEVER move

## MEASURED, OFF THE SHEET HE IS ACTUALLY LOOKING AT
Counted frame to frame on slices/vote/ANIMATION_THE_IDLE_REDO.png, 4 facings x 16 frames:
                                  killed    redone
    pixels that change each frame     86       128
    biggest change in one frame      335       519
    arms a perfect mirror            yes        no  (|upL+upR| 0 -> 0.0445)
    feet move                      never     never
Every facing differs from its killed row on 15 or 16 of 16 frames, so the sheet is not
accidentally drawing the same clip twice. That check is the reason the sheet is trusted.

## WHAT IDLE LAW COST, AND WHAT IT PROVED ABOUT THE RIG
IDLE LAW: the feet NEVER move in idle. The redo broke it twice before it held.
  1. Breath as a VERTICAL hipOff lifted the feet 1px. Moved to `spine`. Fixed.
  2. A lateral weight shift moved the feet as soon as it got big. Swept it:
     0.40 IS THE MAXIMUM LEGAL LATERAL HIP. Anything above it moves a foot.
  3. Tried `legCompress` instead, expecting a weight shift over planted feet. It does the
     OPPOSITE: the FEET travel 1-6px and the hip travels 0. The rig anchors the hip and
     hangs the legs off it.
  SO: A WEIGHT SHIFT OVER PLANTED FEET IS NOT EXPRESSIBLE ON THIS RIG. Real weight moves
  the hip over a foot that stays put; this rig can only slide the whole body. That is a
  rig finding, not a clip finding, and it caps how alive ANY standing clip can look.
  Named here, not fixed: the rig is not this round's claim and it is frozen anyway.

## HOW THE MEASUREMENT NEARLY LIED, AGAIN
First pass showed the new clip byte-identical to the killed one. POSEHOLD_CACHE and
ARMHOLD_CACHE were serving the old pose: I was measuring the cache, not the clip. Both
must be cleared alongside FRAME_CACHE and HD_CACHE whenever a pose changes. This is the
seventh ruler bug of the same class in this lane and the rule holds: when a ruler's
output is absurd (two different clips scoring identically), the ruler is the suspect.

## WHERE IT IS
  slices/vote/ANIMATION_THE_IDLE_REDO.html   the page, no engine, opens on a phone
  slices/vote/ANIMATION_THE_IDLE_REDO.png    112x112 cells, 16 frames, 8 rows
  records/target/BOHEMIA_VOTE_REGISTRY.json  the row he votes on
TAB: VOTE. Not in the ANIMATION tab and not in the game, by rule 18.
