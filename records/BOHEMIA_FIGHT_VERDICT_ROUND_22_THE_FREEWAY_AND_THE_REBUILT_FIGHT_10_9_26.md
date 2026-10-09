# THE FIGHT VERDICT — ROUND 22: THE FREEWAY AND THE REBUILT FIGHT (DIRECTION, 10/9/26, row [the fight verdict])
# Rule 77a first (coordinator 10/9: start with the freeway board; name every piece that reads as a different game
# from the street board, and the wall across the lanes). Judged LIVE: the rebuilt fight slices/BOHEMIA_FIGHT.html on
# the one driver's phone profile (390 x 844 at 3x), the named boards 'freeway' and 'suburb', seed 1, at the camera it
# opens on and pulled back; COMBAT TWO's [the freeway redone] (8db8c976) is what is on main. 0 page errors.
# Picture in VOTE: slices/vote/DIRECTION_FIGHT_VERDICT_22_THE_FREEWAY.png. Tool: tools/bohemia_direction_fight_verdict_22.js (+ .py).
# Paolo's word this round: "Analog horror VAMILY" -- the bible's line for the fight is the last section.

## PAID
- **THE WALL ACROSS THE LANES IS GONE.** The 4 m sound wall over the freeway is deleted; a low barrier runs down the
  median with a crossover gap. His 10/9 complaint ("an ugly ass gate wall on top of the freeway") is answered.
- **ONE KIT.** The freeway is drawn with the street's own asphalt, lane dashes, curb and lamps; the two boards are the
  same world. TILES ARE LEGOS is green (0 broken seams).
- **THE MEN OPEN AT FULL SIZE** (rule 79): the camera starts on your line with the man at 112, not a tiny figure on a
  huge board. That answers the demo verdict's screen 6.
- **F1 PASSES, AT THE LIMIT:** the fight canvas is 780 wide on a 1170-pixel phone, 1.5 device px per painted px, the
  floor exactly. Up from 3.0 in round 21.

## WHAT READS AS A DIFFERENT GAME FROM THE STREET (the freeway's own pieces; COMBAT TWO draws only this)
1. **THE BARRIER IS A FLAT BAR.** cover_jersey is three tans (97% of its pixels), 0.40 colours per 1000 px against
   the style card's wall floor of 1.55, no stain, no chip, no shadow side. Every street piece around it is baked art;
   this one is a CSS rectangle in paint.
2. **THE EDGE LINES ARE THE LOUDEST THING ON THE BOARD:** #db7e46, saturation 0.68, value 0.86, brighter than any
   street paint. Real road paint is sun-bleached; ours should be the street's own worn line colour.
3. **THE TRAILER IS A BOX:** cover_trailer is four flat colours, 0.04 per 1000 px. Draw it from the car bank's
   materials (rust, the shadow under the bed, the doors).
4. **THE ASPHALT REPEATS IN A CHECKER OF DARK SQUARES**, on the freeway and the street alike (one tile stamped flat;
   AH-03 T8). Rotate or offset the stamp, or bake two variants.
5. **A DARK BAND AND A GRID LINE RUN DOWN THROUGH THE ROAD** at the start column: a highlight drawn as a shadow on the
   world (F3, AH-03 T3).

## WHAT IS WRONG ON EVERY BOARD (COMBAT; the pass bar from round 21)
6. **THE ART IS SHARP AND THE SCREEN THROWS IT AWAY.** The freeway tile at its own pixels reads 0.038 on the fine band
   (passes, 2x the bar); the same asphalt on the glass reads 0.003, and the whole board 0.002 (freeway) / 0.002
   (street), against the bar of 0.020. The tile is authored at 42.9 px/m and the board shows it much smaller,
   resampled smooth. F2 FAILS: draw the tiles at a scale the art was made for, or bake the board to the device
   pixels at the zoom it opens on, nearest-neighbour, never a smoothed shrink.
7. **A BOX OF WORDS POPS OVER THE BOARD** ("Set your line: tap a man, then a lit tile") with no speaker (9/20 law,
   AH-03 T1). It is a rule told by nobody; the companion can say it, once, with a face.
8. **THICK GOLD RINGS UNDER EVERY MAN** (F3: the base is a shadow ring of 2 device px or less in the ground's own colour).

## THE FLOOR'S STILL-WRONG COUNT (release line 3)
F1 PASS (1.5, at the limit). F2 FAIL (0.002 on the glass, the art itself 0.038). F3 FAIL (gold rings, the word box,
the dark band). F4 PASS for the ground (the street's bank on both boards, Legos green). F5 FAIL (the barrier and the
trailer are flat boxes). **STILL WRONG: 3 of 5** (round 21: 5 of 5).

## THE ANALOG HORROR LINE FOR THE FIGHT (his word this round)
The board is ordinary and that is right (R1's first half); it carries ZERO wrong things, which is the other half's
fail. One per board kind, drawn from the world's own state, never a filter (R1, R7, rule 73's power):
- FREEWAY: one stalled car's hazard lights still blinking on the beat, on a road nobody has driven in a year.
- STREET: one porch lamp lit on a block the map says has no power.
- ANY BOARD AT NIGHT: the lamp pools are the only colour (rule 73, night is a colour); nothing glows from nowhere.
COMBAT owns the drawing, WORLD the state row it reads. The camera never points at it (R2).

```json
{"verdict":"FIGHT_VERDICT","round":22,"date":"10/9/26","row":"[the fight verdict]","judged":{"surface":"slices/BOHEMIA_FIGHT.html live, 390x844@3x","boards":["freeway","suburb"],"seed":1,"freeway_ship":"COMBAT TWO 8db8c976","errors":0},
 "paid":["sound wall across the lanes deleted; median Jersey barrier with a gap","one kit: street asphalt, dashes, curb, lamps; Legos green","men open at 112 (rule 79)","F1 1.5 device px (was 3.0)"],
 "different_game":[{"n":1,"piece":"cover_jersey","what":"3 tans, 0.40 col/kpx vs wall floor 1.55"},{"n":2,"piece":"edge lines","what":"#db7e46 sat 0.68 v 0.86, loudest on the board"},{"n":3,"piece":"cover_trailer","what":"4 colours, 0.04 col/kpx"},{"n":4,"piece":"asphalt","what":"dark-square checker repeat (AH-03 T8), both boards"},{"n":5,"piece":"start column","what":"dark band and grid line down the road (F3)"}],
 "every_board":[{"n":6,"what":"art 0.038 at its own pixels, 0.003 asphalt / 0.002 board on the glass; F2 bar 0.020"},{"n":7,"what":"instruction box over the board, no speaker"},{"n":8,"what":"thick gold rings under every man"}],
 "pass_bar":{"F1":"pass 1.5","F2":"fail 0.002","F3":"fail","F4":"pass (ground)","F5":"fail","still_wrong":"3 of 5 (was 5 of 5)"},
 "analog_horror":{"freeway":"a stalled car's hazards blinking on the beat","street":"one porch lamp lit on a block with no power","night":"lamp pools are the only colour"},
 "owners":{"COMBAT TWO":[1,2,3,4,5],"COMBAT":[6,7,8,"the wrong thing per board"],"WORLD":"the state row the wrong thing reads"},
 "picture":"slices/vote/DIRECTION_FIGHT_VERDICT_22_THE_FREEWAY.png"}
```
