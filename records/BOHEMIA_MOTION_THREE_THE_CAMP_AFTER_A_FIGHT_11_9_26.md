# MOTION 3 -- THE CAMP AFTER A FIGHT (11/9/26)

Rule 440(e) (Paolo 11/9, 'More everything pls'), rule 406(f)(g)(h) amended 11/6, ask lines 469 and 539. His words (406, 11/6): 'once you
finish a battle and you're in the victory screen and you camp there, you actually camp on the combat tiles that you just were on, and
your company's interacting with their kills or the buildings nearby, the camp one through four tiles that are connected'. The
coordinator's brief: the company at rest on the tiles where it won, leaning on the buildings, going through the dead, sitting by a fire,
each man his own pose from the rig's existing clips first (rule 430), on the beat, 60 frames on a cheap phone; read 11/6m and 11/6o
first, improve, never throw away.

## 1. WHAT WAS THERE (read first; all of it kept)

CAMP THREE, BUILD 11/6m THE CAMP ON THE BOARD and its 406(f)(g) round (records/BOHEMIA_CAMP_THREE_THE_CAMP_ON_THE_BOARD_11_6_26.md):
MAKE CAMP on the loot screen pitches the camp on the very board the fight was fought on (the fight's options and die handed over), the
dead drawn where they fell with a pool under each, the camp pitched where most of them lie; by day men with an easy job go through them
(act 'loot', ANIMATION's kneel), never more than half the company; at the fire men bind cuts, tend the hurt, cook, clean a gun; the watch
smokes at the edge; the hurt lie bandaged; at night they sleep. CAMP THREE's own NEXT list began with the rest of 406(g): 'his men leaning
on the buildings next to the camp's tiles'. NOTHING used the board's walls: the fight's grid (campBoardGrid: 0 a wall, a roof, water, a
raised tile) reached the camp and only the pitch read it.

## 2. MEASURED (gates/the_camp_after_a_fight_gate.js, the demo at 390 x 844: a road fight, won, MAKE CAMP tapped on the loot screen)

- The camp stood on the fight's board with its 3 dead (2 in the picture); by day YOU, DESI and RAUL took cook / loot / watch-or-loot:
  a company of three put two men on the dead and nobody near a house.
- THE FRAME RATE AT CAMP, AT REST: 4 to 22 frames a second on this box with frames up to 1.2 s. A CPU profile of 2.5 s at rest: the camp's
  own drawing 14 ms; THE MAP, behind a camp screen that covers the whole glass, 825 ms in vbCityDraw's restore, 206 ms in its fills, 97 ms
  in mapDepthBlit. The map's loop wakes about once every two seconds under a place, and each wake was a full map paint (400+ ms on this
  box): a freeze every two seconds that nobody could see the result of.

## 3. WHAT IS NEW

- THE WALLS (slices/bohemia_camp_board.js, __THE_CAMP_AFTER_A_FIGHT__, BohemiaCampBoard.walls(L)): every side of an open tile on the
  camp's square or the ring one tile round it that touches a HOUSE of the board's own grid (a 0 tile with 4+ 0 tiles in its 3 by 3,
  never a kerb, never the board's edge), the more house the better, mapped onto the
  camp's picture the way the dead are, the spot just inside the open tile against that side, and the way he faces so the wall is at his
  RIGHT HAND (ANIMATION's flirt o.wall: 'beside a wall a hand up on it, leaning his weight in'). A wall behind him reads best (N, W, S, E).
- THE LEAN (slices/bohemia_camp_look.js): by day, on the board, a man with an easy job and no body to go through leans on a wall that
  touches the camp's tiles; never the hurt, never the watch, never YOU (he walks to your taps); a quarter of the company at most, at
  least one where there is a HOUSE he can be SEEN at (the picture is wider than an upright phone: the settlement's live camera says what
  is on the glass; never under the phone; clear of the fire by a man's width, 70 px); when the dead took every free man (a company of three: two), the second
  of them leans instead. He is drawn by the rig's own clip, ANIMATION's flirt with o.wall (rule 430), on the activity clock (three keys a
  beat at 120 BPM); 'leans on the wall' on his card; the still 'smoke' picture while his sheet loads. window.__CAMP_NO_LEAN = the old way.
  So by day the camp after a fight reads: one goes through the dead, one leans on the house, the fire kept.
- THE MAP RESTS UNDER A PLACE (slices/BOHEMIA_CITY_WORLD.html, a marked block in the map's file, NOTE for RUN and PLUMBER): RUN's
  __THE_MAP_RESTS_UNDER_THE_FIGHT__ already rested the map under a fight; this rests its PICTURE under a place (a town, a camp) the same
  way: while the place's frame is up, opaque, and covers the glass down from the map's own bar, and nothing of the map can show (no morph
  on the glass, no dive), renderCity is not called; the rest of the frame runs (the day, the camera, the clock: the camp's hour still
  moves), and the caches are kept for the way back. The first frame the map can show, it draws. window.__MAP_DRAW_UNDER = the old way.

## 4. AFTER

THE CAMP AFTER A FIGHT (gate) on the demo, phone upright: MAKE CAMP on the loot screen, the camp on the fight's own board with its 3 dead
(2 in its picture). THE HONEST PART: the demo's first road fight deals a board where the camp (a company of three: ONE tile) touches no
house: its nearest house is a block two tiles east, off the camp's picture, and the only blocked tile touching the camp is a one-tile
wall line (a kerb on the picture). The first cut leaned RAUL on that kerb and the phone shot showed a man standing in the open, a ghost
in the picture's haze (measured, then refused): A HOUSE NOW MEANS 4 OR MORE BLOCKED TILES IN THE 3 BY 3 ROUND THE WALL TILE, so on that
board NOBODY leans, rightly. The gate then plants a house (a 3 by 2 block) in the board's own grid beside the camp's tile and lays the
camp again: by day 'YOU clean, DESI loot, RAUL lean', RAUL on that house's wall spot, the wall at his right hand, on the glass, drawn
ANIMATION's flirt every frame from frame 0. The planted fail (window.__CAMP_NO_LEAN, by day at 8 o'clock) is red: two loot, nobody at a
wall. FRAMES at rest in a calm stretch of daylight: the old way 12.1 frames a second, now 47.7 to 50.7, worst frame 67 to 133 ms; the
camp's clock ran 11 -> 15 across the sample. The map rested its picture 5 to 9 times a camp (its loop wakes about once in two seconds
under a place). With the map resting under towns too, THE UI MORPHS EVERYWHERE's town changes ran 52 to 60 frames a second while they
played (19/0).

## 5. WEAK, ROUTED, NEXT

- 48 to 51 frames a second on this software-drawn box, not 60: what is left is the settlement screen's own frame (duskOf, the board
  picture drawn at 3x); on a phone's GPU that picture is a single blit. PLUMBER's to take to 60 if a phone shows it.
- On a one-tile camp a house must touch the camp's tile to be leaned on: the demo's first road fight has none, so he will see the lean
  where a fight was fought among houses (or on a bigger company's camp). The VOTE card's frame is the gate's planted house, said so.
- The carcass haul (rule 392) at a beast's body is still the same kneel as at a man's ('loot'): there is no butcher clip in the rig; an
  ANIMATION job if he wants it different.
- The wreck as it lay (cover blown up in the fight comes back whole at camp: the camp re-deals the board) stays COMBAT TWO's hook, as
  CAMP THREE wrote it.
- The lean takes a quarter of the company: a bigger company could also sit on a doorstep (the rig's 'sit' at a wall) next.

[bb] Battle Brothers' camp is a state on the world map; ours is the street the fight was on, with its houses to lean on.
[analog horror] the house they lean on is the house they fought around; the bodies are still there when the hour comes round.
