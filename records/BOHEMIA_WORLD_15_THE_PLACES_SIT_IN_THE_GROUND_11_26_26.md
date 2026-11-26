# THE PLACES SIT IN THE GROUND (WORLD 15, 11/26; VAMILY rule 480(b) on the map's places as built; rules 479, 464, 476(a), 480(c))

## THE ROUND (the coordinator's words)
'rule 480(b) on the map's places as built: fix the WORLD TWO map gate's last red (41 of 42), every place reads and sits in the
ground, no billboards (464), no footprints (476). WORLD 13 owns the map's draw loop and its frames this round; stay in the places'
content and data.'

## WHAT WAS CHECKED (rule 480(b): improve what we have first, and say which pieces)
- WORLD TWO's map gate (gates/his_map_gate.js), every leg, the phone and the computer.
- The 15 real places seated on the valley (records/target/bb/real_places.json, slices/bohemia_real_places.js) and their 19 pictures
  (slices/place_pieces/), each shot at a block 72, 36, 29 and 18 px with and without its piece, on a phone upright.
- The legends, camps, lairs and ruins the valley generator names on the map (records/target/bb/world_state.json).
- The billboards' and the footprints' files (graveyarded 11/20 and 11/22): not on the page, not drawn.

## WHAT WAS WRONG, MEASURED, AND WHAT IS NOW
1. THE NEXT BOSS'S SIGN NEVER TURNED UP (WORLD TWO's gate, B6, the computer). The valley keeps walkable blocks sealed by walls (ten
   one-block desert pockets on every valley: 66,7; 21,23; 29,34; ...; and a wall a boss brings down can open one). The sign's seeded pick
   landed in one, every route from it failed (the boss's place and the fallback both route from the sign), placeSign said no, and the
   same pick came up every tick while he stood still. NOW the pick is only a block he can walk to from where he stands (the first pick
   is the same as before when it is; a sealed one is passed over, at most 12 looked at). Seven new valleys, 1,300 picks each: no
   miss but the one my sweep made by dropping him into a pocket himself. AND (BOSSES' BUILD 11/26o, after this was found): the next
   sign now waits while a boss's fall plays and while his after card is up; a player taps the card away, so WORLD TWO's gate's B6 now
   does too (a real tap on its first button once its first beat has passed). B6: phone and computer green.
2. TWO PICTURES SAT OFF THEIR OWN GROUND. Measured from each picture's pixels (its plate's front corner and the two side corners its
   lower edges climb to): THE GREENHOUSES' plate stood 12 px right and 7 px lower than its numbers said (drawn left of its block
   and up off the ground); THE BANK's plate is 136 px across, not 150 (drawn a tenth small and 4 px up). The 17 others are within a
   pixel and a quarter. NOW place_pieces.json carries the measured numbers (tools/bohemia_world15_the_places_sit_in_the_ground_11_26_26.py).
3. EVERY PLACE WAS PASTED OVER THE CITY. Drawn after the whole painted city and over it: the tower in front of THE DOME, CHANNEL 8,
   THE COOLING CENTER or SHARK REEF was painted over by the place's ground plate, so the place sat on top of the towers in front of
   it. NOW a place is drawn IN DEPTH with the painting, through the map's own reading (RUN's __YOU_WALK_BEHIND_IT__, the one his crew
   walks behind the towers by): where the painted city stands nearer the camera than the place's block, the city is drawn, not the
   place. 11% to 48% of each place is behind something, measured.
4. EVERY PLACE'S LOT SPILLED OVER ITS NEIGHBOURS. 'wide' 1.3 drew the lot 1.3 blocks across up close, and 'min_css' 46 drew it 46
   points (2.5 blocks) across at the map's own stop (a block 18 points), over the blocks round it: the floating look, a light slab
   on a dark city. Rule 479(a): 'it reads as part of the map the way the valley's own buildings do'. NOW a valley place's lot is ITS
   BLOCK at every zoom (wide 1.0, min_css_valley 0), its edges on the streets. The four places past the rim keep their own sizing
   (COOK SIX's, min_css 46: they stand alone in the desert). His votes on the pictures were YES with no notes; the 46-point floor was
   COOK FIVE's call of 11/17, before rule 479.
5. A TAP ON A PLACE'S PICTURE MISSED IT. The tap's box was one block, so a tap on THE BANK's tower fell on the land behind it. NOW
   the box is the picture as drawn (its plate's corners across, its first opaque row down to its plate's front corner). 15 of 15 taps
   on the top of a picture are the place.
6. A BILLBOARD STILL NAMED ON THE MAP. The valley generator's legends (WORLD 7, 11/3) had THE DEAD BILLBOARD (drawn as a mast, but
   its name on the map reads 'BILLBOARD'). Rule 464: no billboards. NOW it is out of the pool; seven legends stay. Not to come back
   under a new name.
7. NO FOOTPRINTS: checked, none drawn (graveyarded 11/22; THE STRAT LOOKOUT's T1 and this round's D3 refuse the file).

## READS (the trade, said plainly)
A place reads by its own roof, its name plate (from a block 20 px, as before: at the map's own stop, 18 px, no place names are drawn,
which is RUN's and WORLD's old line, not touched) and its tap. At the map's own stop a place is now the size of the buildings round
it. If he wants landmarks to read from the far stop, the answer is a name there, never a bigger sticker.

## NEVER CHOPPY (rule 480(c))
The cut asked every point of a place every frame cost 2 to 25 ms on this box. So each place's cut is KEPT (one per beat frame, at the
zoom it was made at) and drawn with one drawImage: 0.1 ms a frame for all the places on the glass, up close and at the map's stop. A
walk and a pan move the place and the city together, so the same cut holds; a pinch draws the kept cut scaled (no cut made, 158
scaled in the gate's pinch) and the cut is made again once the zoom has held 150 ms, one place a frame, at most 3 ms of cutting a
frame; a sharper map tile arriving under a place makes it again. Nothing is read back.

## FOR OTHER LANES (named, not touched)
- WORLD 13 (the draw loop): the roaming parties are drawn BEFORE the places (BOHEMIA_CITY_WORLD.html, the party loop then
  BohemiaPlacePieces.draw), so a party walking in front of a place is drawn under it.
- WORLD 13 / the painter: A DIFFERENT VALLEY EVERY GAME's V4 'the painting re-baked with the state' is red on main before this round
  (the painting's key no longer carries the state's key: names 0 in its counts); 54 of 60 on main, 55 of 60 here.
- HOME BASE 3: his place's camera 3 is mounted on 'the dead billboard across the street' (records/target/home_settlement/manifest.json,
  CAM 3 THE BILLBOARD): words on his own place's camera, not the map; rule 464 named the map's billboards.
- WORLD TWO / RUN: the map gate's F2 (RUN's dark alone hides the painting's shape: under 3 steps and under half the faint tape's) reads
  3.2 to 3.4 on most new valleys on the phone since about 11/22 (4 runs of 5 here, one of them before any of this round's place
  changes); the tape stays at 6.6 to 10.6, so the relation holds and the absolute 3 is what trips. Not loosened here; HIS MAP phone 20/1
  (that leg), computer 21/0.

## PROVED
gates/the_places_sit_in_the_ground_gate.js (THE PLACES SIT IN THE GROUND, demo and alpha, a phone upright and sideways): D1 the
pictures' numbers are their own ground plates (a planted wrong one caught); D2 the lot is the block; D3 no billboard, no footprints;
D4 the sign's pick; G1 each place drawn once; G2 on its block (its lot its block across, its front corner on its block's, within
half a point); G3 in the ground (where the city stands in front, the city shows; the old way pasted the place over every one of those
points: the test bites); G4 a tap on the top of its picture is the place; G5 0.1 ms a frame, a pinch cuts nothing, held it cuts again;
G6 360 of 360 signs placed, all on a block he can walk to; G7 nothing threw: 32/0 over the four screens and 4/0 static (THE MOB MUSEUM's
every covered point too, once the test waited for the camera's glide: it had compared two shots 7 px apart). gates/his_map_gate.js B6
green on the phone and the computer (HIS MAP computer 21/0, phone 20/1: F2 above). THE PLACES WEAR THEIR OWN PIECE 11/0 (the region's
four too). A DIFFERENT VALLEY EVERY GAME 57/3 (main 54/6: the painting's key, above).
COOK FIVE's gate G2 re-aimed (the lot its block, not 44 points), its G3 measured with the depth off (the picture alone).
VOTE world15-the-places-sit-in-the-ground-11-26.

[bb Battle Brothers' map draws a place at the size of the land it stands on, and the trees in front of it are in front of it.]
[analog horror: from the street you cannot see the bank for the towers in front of it; you only know it is there because someone
wrote its name over the roofs.]
