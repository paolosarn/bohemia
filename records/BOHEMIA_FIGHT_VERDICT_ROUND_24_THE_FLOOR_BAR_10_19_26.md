# FIGHT VERDICT 24: THE FLOOR BAR AFTER THE GROUND (DIRECTION 10/19/26, row [fight verdict 24])

Trigger: his NO on COMBAT's [the ground fights] card (10/18, sweep AX): 'The floor tiles are all shit. It's so terrible
so bad I hate. I hate the ground. I hate the floor. He just looks like shit. It's so fucking bad.' COOK TWO claimed
[the fight floor he hates] (10/19, ec5aafef) to redraw it; the coordinator's note on this board: 'You judge both before
VOTE: the ground he said YES to (one real street, the streets joining) is the bar.' This round turns that sentence into
numbers, so the new floor is judged by a machine before it is judged by him.

Shot on the one driver's phone profile (390 x 844 @3x), seed 1, the fight dealt by kind (suburb, strip, freeway, the
desert's scrub, ruin) plus the named freeway and desert boards, at the camera the fight opens on. 0 page errors on all
seven. Tools: tools/bohemia_direction_fight_verdict_24.js (+ .py), tools/bohemia_direction_floor_bar.py.
Picture in VOTE: slices/vote/DIRECTION_FIGHT_VERDICT_24_THE_FLOOR_BAR.png (+ .json), card
direction-fight-verdict-24-the-floor-bar-10-19.

## THE FLOOR BAR (his YES as numbers; the style guide's classes.ground.floor_bar)
Measured at each picture's own pixels: his YES twin records/target/COOK2_ONE_REAL_STREET.webp (57 px a metre) and the
fight's own block pictures slices/fight_ground/block_*.webp (42.9 px a metre), the floor the fight draws.

| | his YES | the floor now (6 blocks) | the bar | now |
|---|---|---|---|---|
| B1 the dirt is pale (saturation) | 0.195 | 0.402 to 0.608 | <= 0.28 | FAILS 6 of 6 |
| B2 desert dirt, not orange (hue) | 39.9 | 28.1 to 35.6 | 36 to 50 | FAILS 6 of 6 |
| B3 no camouflage print (two-tone split) | 7.1 (4.4 on bare yard) | 11.7 to 38.4 | <= 9 | FAILS 6 of 6 |
| B4 the dirt has grit (spread in a cell) | 12.74 | 8.55 to 17.01 | 11 to 15.5 | FAILS 6 of 6 |
| B5 the road never repeats (peak self-match) | 0.132 | 0.324 to 0.909 (515 to 528 px: one house) | <= 0.35 | FAILS 4 of 6 |
| B6 no bright orange roof (share) | 0.04 % | 0.0 to 78.7 % | <= 0.5 % | FAILS 5 of 6 |

**Controls** (`python3 tools/bohemia_direction_floor_bar.py --self`): his YES street passes all six; the floor he said
NO to fails all six blocks. A bar that passes his NO or fails his YES is broken, and this one is neither.

What the numbers say in his words: the fight's dirt is two to three times too orange, it is printed with camouflage
blobs whose two tones sit three to nine times further apart than his street's, it is smoother than his ground (no
grit) except the desert, which is noisier, and the road is the same asphalt tile laid every house: the same crack
cluster comes back every 515 px. His street's road never comes back on itself.

## THE PASS BAR (FIGHT VERDICT 21), ON THE GLASS
| | street | strip | freeway | scrub | ruin | bar | verdict 23 |
|---|---|---|---|---|---|---|---|
| F1 canvas unit | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | <= 1.5 | 1.0 |
| F2 fine band | 0.0203 | 0.0188 | 0.0212 | 0.0307 | 0.0198 | >= 0.020 | 0.021 to 0.025 |
| F3 nothing on the ground that is not ground | FAIL (B3) | FAIL | FAIL | FAIL | FAIL | | FAIL |
| F4 the freeway from the packs | | | FAIL | | | | FAIL |
| F5 cover is a thing | | | FAIL (the median a flat pale strip) | | | | FAIL |

F1 holds. F2 is 3 of 5 at the bar; strip and ruin read just under (0.0188, 0.0198). This round deals by kind where
verdict 23 shot the named boards, so it is not a like-for-like drop; named, not bounced.

## VERDICT 22's SEVEN, RECOUNTED
1. the barrier a flat bar: STILL WRONG (the freeway's median is a flat pale strip with lamps, no height, no shadow).
2. the edge lines the loudest thing: BETTER (the edges are quiet; the loudest thing on every town board is now the
   bright orange roofs).
3. the trailer a 4-colour box: not on these seeds.
4. sharp art shown soft: FIXED (F1; F2 3 of 5).
5. a line down the road: STILL WRONG, and it became a grid: a pale line on every house tile across the whole board.
6. a box of words over the board: STILL WRONG ('Drag a man inside the chalk. Kept for the next fight.' on paper).
7. thick gold rings under every man: FIXED (a dark contact shadow under each man).
**Still wrong: 3 of 7, two fixed, one better, one not seen** (verdict 23: 4 of 7).

## NEW, BY EYE
- A man as big as a house: at the opening camera the ground is drawn 12.4 px a metre and the men 57 (THE GROUND MAY
  ZOOM, THE PERSON MAY NOT), so a man reads nine metres tall beside a ranch roof the width of his shoulders. His YES
  street is drawn at 57 px a metre, the men's own scale, which is part of why it reads as a real street. His 10/18
  'can the characters just be a little smaller' is the same thing seen from the other side: COMBAT [the people a
  little smaller].
- One orange roof repeated five in a row on every town board (rule 114: no run over four; his note: roofs tan).
- A lamp on every house front: when everything has a lamp, nothing is the one wrong thing.
- The named freeway carries a flat brown band at its top: one colour, no ground in it (AH-03 T2, the even fill).
- The desert: the same camouflage, stronger orange (saturation 0.61), green specks sprinkled evenly.

## THE ANALOG HORROR LINE (one calm wrong thing per board, standing since verdict 22)
NOT YET on any board. Street: one lamp burning in full daylight, its pool on the asphalt, the other lamps dark.
Strip: one shop sign lit, the shop dark. Freeway: one car with its hazards blinking, nobody in it. Desert: one
shopping cart standing upright in the open, nothing near it. Nothing else moves; never a filter.

## OWNERS
- COOK TWO [the fight floor he hates]: B1 to B5 on the new kit before VOTE (`python3 tools/bohemia_direction_floor_bar.py
  <kit sheet>`). The way is already on disk: his YES street's own pieces (his soil tile with the frames cut, one pale
  dirt; his cracked road with two variants and no run over four). The freeway and its median from the same asphalt.
- COMBAT TWO [the boards on the new floor]: re-lay on the new kit; one lamp per crossing, not one per house.
- COOK FOUR: roofs tan (B6), two variants per house so no row repeats past four.
- COMBAT: the paper card into the bar's own line (6); the house grid drawn on the ground (5); the man-to-ground scale
  ([the people a little smaller]).

```json
{"verdict":24,"date":"10/19/26","seed":1,"kinds":["suburb","strip","freeway","scrub","ruin"],
 "floor_bar":{"B1":"6/6 fail","B2":"6/6 fail","B3":"6/6 fail","B4":"6/6 fail","B5":"4/6 fail","B6":"5/6 fail","yes_passes":true},
 "F1":true,"F2_at_bar":"3 of 5","F3":false,"F4":false,"F5":false,"still_wrong_of_22":3,"fixed":[4,7],"better":[2],
 "analog_horror_line":false,"ground_px_per_metre_on_glass":12.4,"errors":0,
 "picture":"slices/vote/DIRECTION_FIGHT_VERDICT_24_THE_FLOOR_BAR.png"}
```
