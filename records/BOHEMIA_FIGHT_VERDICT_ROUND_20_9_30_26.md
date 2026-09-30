# THE FIGHT VERDICT — ROUND 20 (DIRECTION, 9/30/26)
# COMBAT [house tiles back] V232 (80ed2ce), their sheet slices/vote/COMBAT_A_HOUSE_IS_NEVER_SMALLER_THAN_A_MAN_9_29.png
# (before / after at one seed). Against the combat reference, the bible (rule 20h), and from this round
# the AI-slop strand (records/BOHEMIA_AI_SLOP_THE_MACHINE_AND_THE_WORLD_9_30_26.md).

## PAID
- ROUND 19 ITEM 1 IS PAID: a house is never smaller than a man. The house board's camera stops at 0.571
  (a house as wide as the 112 man); 24 real fights, 0 houses under the man. The body board keeps 0.20.
- NOBODY IS LOST: an enemy the glass cannot hold gets a chevron on the edge with his distance in houses,
  red when he aims at you, on the beat. 99 on the edge + 23 on the glass, none lost. Diegetic enough: it
  is the HUD's, it sits on the frame, and it carries a real number.

## STILL WRONG (COOK and COMBAT draw only this list; round 19's numbers carried)
1. **THE PALE OVALS GREW.** Round 19 item 2, unanswered, and the zoom tripled it: pale blue-grey pads
   (mean #8495a0) are 13.9% of the after board, 4.5% before. Still no source (R4), still not baked (R10),
   still not square (37f). Name what they are in the commit; if reach, light the square tile; if shadow,
   the ground's own colour darker, shaped like what casts it.
2. **THE COVER IS NOW HOUSE-SIZED CARDBOARD.** Round 19 item 3 got bigger with the camera: the two-tone
   tan blocks now fill whole tiles (COMBAT names it NEXT: "the cover is drawn house-sized and covers the
   street"). Dress from the walk's banks (s14), style card 5A-bis.
3. **WORDS OVER WORDS.** "ROSA" and "CLEAR" are drawn on top of each other in the middle of the board,
   in a green outlined face that is not the register. Rule 44 (Paolo 9/29): text never overlaps. R5: the
   dead institution's type, never a decorative outline. The three settlement lines across the top stay
   (round 19 item 4).
4. **A FLAT RED DISC** (0.9% of the board, pure saturated red, no edge, no source) sits on the street.
   If it is the aim cue it belongs on the HUD's ring, not painted on the ground as a sticker; R1 wants one
   wrong thing in a frame and a sticker is a second one nobody meant.
5. **DIAMONDS ON A SQUARE GRID:** two pale translucent diamonds on the road read as rotated tiles. 37f:
   the grid is square; a lit tile is square.
6. **THE CANVAS** (round 18-19, standing): the board is still drawn at CSS size; the 9/29 floor (3a and
   3b) reads the fight too.

## THE AI-SLOP STRAND ON THE FIGHT (new this round)
The fight is WORLD, never machine: pair 2 of the card forbids the soft finish on it. The pads, the disc and
the diamonds are soft, glossy, translucent UI shapes painted on the world: that is the machine's finish
leaking onto the ground. The HUD ring and the edge chevrons are the machine's own surface and may be clean.

## THE TWO NUMBERS
Fight length: NOT MEASURED by COMBAT either (their commit says so and names a fight-to-the-end driver as
next). Presses: not re-walked. Both read from COMBAT's commit when the driver lands.

## THE BIBLE (rule 20h)
R1 FAIL (the disc, the words, the ovals: three unmeant things). R4 FAIL (ovals). R5 FAIL (overlap,
outlined type). R10 FAIL on cover, PASS on the road. R2 PASS (the camera floor is fixed, nothing looks at
the wrong thing). R3, R6-R9 not visible in a still.

```json
{"verdict":"FIGHT_VERDICT","round":20,"date":"9/30/26","judged":{"lane":"COMBAT","version":"V232","sha":"80ed2ce","sheet":"slices/vote/COMBAT_A_HOUSE_IS_NEVER_SMALLER_THAN_A_MAN_9_29.png"},
 "paid":["round 19 item 1: house never smaller than a man (camera floor 0.571, 0 of 24)","edge chevrons, nobody lost (99 edge + 23 glass)"],
 "still_wrong":[{"n":1,"what":"pale ovals 13.9% of board (was 4.5%), mean #8495a0","rule":"R4 R10 37f"},
  {"n":2,"what":"cover blocks house-sized two-tone cardboard","rule":"s14 banks, 5A-bis"},
  {"n":3,"what":"ROSA and CLEAR overlap, green outlined type; settlement lines across the top","rule":"rule 44 text never overlaps, R5, 17b"},
  {"n":4,"what":"flat saturated red disc 0.9% on the street","rule":"R1 R4"},
  {"n":5,"what":"translucent diamonds on a square grid","rule":"37f"},
  {"n":6,"what":"fight backing store at CSS size","rule":"9/29 floor 3a+3b"}],
 "ai_slop":"the fight is world: soft translucent UI shapes on the ground are the machine's finish leaking onto it",
 "two_numbers":"not measured (COMBAT names a fight-to-the-end driver as next)",
 "bible":{"R1":"fail","R2":"pass","R4":"fail","R5":"fail","R10":"fail cover / pass road"}}
```
