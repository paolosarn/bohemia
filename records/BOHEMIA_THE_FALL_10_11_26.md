# THE FALL (ANIMATION, [the fall], 10/11/26) -- V2, THE LAST (rule 95)

## WHY THIS, NOW
PAOLO 10/10, his ninth votes, NO on animation-the-fights-clips-10-9: 'The animation of people ragdolling and falling
down is so broken. It's so dog shit.' The row: in the COMBAT tab a man struck down falls in a clip that reads as a
body falling, all eight directions (rule 107), the hit the same, played live, before and after. The hold (rule 88)
lifts for this row because he asked. V1 was the page he voted down; this is V2 and the last.

## WHAT HE SAW, LOOKED AT FIRST (the fight's clip table, rendered)
    the fall   floor-rise PLAYED BACKWARDS: the man sinks UPRIGHT into a crouch, then a knot of legs. He never tips.
    the dead   sleep@0: it lays the body along the FACING at full length, so facing you it is drawn upright and UPSIDE
               DOWN, feet in the air, head at the bottom. That is the 'ragdolling'.
    the hit    stagger-hit: the arms fly out stiff like a scarecrow.
    the crumple (headshot-2) runs on the wall clock, off the beat; he called that kind 'tweaking, jumping around' on
    7/17. Not the base.

## WHAT SHIPPED, IN THE RIG (slices/BOHEMIA_ALPHA_0_9.html, __THE_FALL__)
    fall-down  2 beats (six drawn pictures): the blow throws him back, the knees give a little, he goes over the heel
               on the side he falls to as one body, and lands lying ACROSS THE FLOOR with his head down on the ground;
               the arms fly out as he goes and land out from the body. Facing east he falls to the west and the other
               way about; facing you to his right, facing away to his left. The dead are its last picture.
    take-hit   1 beat (three pictures): the torso and head snap back away from the blow on the first picture, the
               arms flick, and he is back to standing by the third.
Every facing is posed from its own rest skeleton (rule 107, never a mirror); bones are their rest vectors turned,
never stretched. The fall is not a loop (TERMINAL), so nothing resolves it back to standing.

## WHAT LOOKING FOUND (every one fixed in the art unless it says ruler)
1. The frozen-pose resolver treats a clip as a loop and stood the dead back up on the last picture (6 of 8 facings).
2. The first hit was a 2 degree lean. Now it lands on the first picture and eases out.
3. A deep knee buckle pulled the shins out of the coat and stood the boots up as prongs.
4. THE COATS: every garment is drawn row by row down the screen on the posed body (genCoat's skirt spans rows from
   waist to hem), so ANY tilted body drew a long coat's skirt as an upright box under him, straight legs or not. So
   the falling body is posed UPRIGHT with every relative angle the fall has, the frame is built (every garment right),
   and the finished picture is turned by the body's angle (rollFrame), set on the ground and slid to the middle of
   the box. The last picture is an exact quarter turn: lossless. Faces and hair are inside the frame, so they turn
   with him. The skinner's part grid is shared and read-only, so a turned copy rides out beside it.
5. The first turn clipped the shoulders off (turned before it was moved back into the box); the slide is now worked
   out first from where every pixel lands. The border is drawn after the turn, so the margin is three.
6. The flung hands went over the head and the frame's top cut them (the [hands in the box] defect again): the arms fly
   OUT now, not overhead.
7. The snap-back let go before the fall took over and bobbed the body up; a landing overshoot popped it up 2.6 px.
   The snap now carries into the fall and the landing lands.
8. The turn pivoted on the picture's edge, which was the flung hand: it pivots on the heel, read off the feet rows.

## PROOF
    THE FALL READS (new, gates/the_fall_reads_gate.js, in the suite): 12/0 on the rig's own frames, the player and
    four long-garment outfits (the Reds, the long coat, the cape, the church), all eight facings:
      the dead lie flat (half again as wide as tall, under 55% of standing) with the head at one end on the ground;
      CONTROL: the old dead (sleep@0) fail that ruler on 30 of 40 sets;
      the weight (everything but the arms) only goes down, past the 2 px a body this wide lifts tipping over its heel;
      nothing cut by the frame; every picture keeps 75%+ of the standing body's pixels; eight different dead; the hit
      snaps 1.5 px+ away from the blow and comes back within 3.
    THREE RULERS OF MINE WERE WRONG AND ARE SAID SO: 'under 48 px' (a front-view body lying is its shoulders and an
    arm, 52 px), 'the top never rises' (the arms fly up as he goes, which is right) and 'within 130% of the standing
    pixels' (side-on, the flung arms add a third). And one allowance: 1.2 to 1.7 px of lift on the second picture is a
    rigid body tipping over its edge; three art passes moved it not at all; 2 px allowed, the 2.6 px pop still caught.
    MUTATIONS, 5 caught: the looped dead (4 fail), no turn (3), not set on the ground (1), the landing pop (1), a weak
    hit (1). The rig's neighbours: READS FACING YOU 23/0, ENVELOPE RAMP 10/0, CHARACTER PREVIEW 18/0, FIGHT CLIPS
    TABLE 14/0, SETTLEMENT PEOPLE 8/0, ENGINE SYNC holds. FIELD SURGERY 16/2 and FAMILY ANIM (a timeout) are the same
    on main without this change.
    VOTE animation-the-fall-10-11 (FINAL?, redo of animation-the-fights-clips-10-9): eight facings, before beside now,
    live on the beat, one art pixel to one phone pixel (rule 89), the player and the Reds; filmed at his phone's
    profile (390 wide, 3x), zero page errors.

## WHAT IS NOT DONE, SAID SO
THE FIGHT DOES NOT PLAY IT. Rule 100: nothing art goes in before he says FINAL. When he does: the fight's sheets
(COMBAT's baker, tools/bohemia_fight_people_bake.js) take take-hit, fall-down and its last picture as hit, fall and
dead, and COMBAT's frameFor reads the table (still 0 reads of DB.people.clips in slices/BOHEMIA_FIGHT.html).
THE MAN STRUCK DOWN AND NOT DEAD (crawl-dying) is unchanged; it was not what he named.

## [bb fall] THE SCHOOL LINE, AND WHAT WE DO DIFFERENTLY (rule 39b)
Battle Brothers' figures do not animate their bodies (this lane's 9/28 line): a man killed there is swapped for a
corpse sprite lying on the ground. How it draws the moment between is not in the library, so it is not claimed. WHAT
WE DO DIFFERENTLY: the blow is seen, he goes over on the beat, and the corpse he leaves is the same man lying where he
fell, facing the way he faced.

## ANALOG HORROR LINE (rule 30)
A body that drops in one cut is a tape that skipped; one that goes over in six frames and then lies there, perfectly
still, with nobody coming, is the part of the recording you keep rewinding.
