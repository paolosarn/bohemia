# THE STREETS JOIN (COMBAT TWO, 11/10/26)

VAMILY rule 442(d), ask line 547 (the boards' half; the map's half is WORLD 13's). Paolo 11/9, his YES on 'every building on the
road' with a note: "you really need to make sure intersections, the sidewalk and the streets continue looking good like they're
supposed to." The coordinator: where two roads meet, the asphalt, the lines, the kerbs and the sidewalks join and turn the corner
the way a real intersection does; no sidewalk cut off, no road painted over a sidewalk, no seam; gated over 20+ seeds, a planted
sidewalk cut at a corner red; proven on the page on a phone. And for MOTION 3 (rule 442(a), the camp after a fight): a clean seam to
read the fight's last board.
BUILD 11/10f - THE STREETS JOIN. BUILT, NOT YET SEEN. VOTE combat2-the-streets-join-11-10 (stand_in).

## WHAT WAS WRONG (main 74940d89, the same 600 boards the road gate deals)
- Every tile the join painted (3,405 of them, rule 429(h)'s drives and joins) was a whole tile of bare kit asphalt (road_ns,
  road_ew, junction): no sidewalk, no kerb, a dark slab beside the yards.
- Where a painted street met an old block's street it stopped dead at that street's kerb or a strip of gravel short of it (the
  suburb's yards street, the trailer park's lane); a painted street that went on straight into an old one of another width
  stepped at the kerb (the warehouse streets); a drive was painted through downtown's sidewalk.
- In the pictures (the new pixel reader below, every edge a painted tile touches, 136 boards): 4,333 of 5,669 edges a seam.

## THE FIX
- THE PIECES (tools/bohemia_combat_two_the_street_joins_11_10_26.py -> slices/fight_ground/kit_street/joins/, 97 pictures and
  joins.json): COOK TWO's street kit cut and laid together into every piece a street tile can need: open N/E/S/W (the street
  goes on), a sidewalk and its kerb on every side that is not, the sidewalk's corner piece (junction_walks' own) at every inside
  corner, the centre line along a street (road_ew / road_ns under it), never across a junction. Nothing new is painted.
- THE REACH TABLE (joins.json reach): for every tile of every old block picture, each side, how far in its asphalt starts and
  where the asphalt lies along that edge, read off the picture the way the pixel gate reads it.
- slices/bohemia_street_board.js fromTemplate, streetsMeet (after roadsJoin): every painted tile takes the piece for what is
  around it (a side is open where the tile beside it is road drawn as road and neither side shut it; an inside corner gets its
  corner piece unless both tiles beside it go on into the tile across); THE MOUTH: where it meets an old street whose own edge is
  a kerb, sidewalk or gravel, that strip is drawn over with the new street's own edge, mirrored across the shared edge (L.decals),
  so the old kerb opens and the sidewalks meet; THE TAPER: where it goes on straight into an old street of another width, its
  kerb angles in or out over the near half of the tile (at a junction's corner only the corner square); a side whose old street
  cannot take it (a cul-de-sac's round end met from the side, a path too narrow) ends in a kerb; A CURB CUT: a single painted drive
  across a paved block's sidewalk keeps the sidewalk (no road painted over a sidewalk); THE CITY: a road the join ran off the board
  runs on through the ring, straight, to a street there or the ring's end (a ring house in its way is not drawn).
- slices/BOHEMIA_FIGHT.html: joins.json loaded (DB.streetJoins) and handed to fromTemplate; laidPaint draws the mouths and the
  tapers (taperPaint) after the ground and before the buildings, so the board's bake, the ring's bake and the close draw all
  have them.
- A DEAL THAT HISTORY CHANGED (found on the way, fixed): libOf keeps every mirrored block it builds in the block library under its
  mirrored name ('golf.1|h'), and the place and family deals took their pools from the library's keys, so a later deal in the
  same page drew from mirrored copies and mirrored them again ('golf.1|h|h'): the same seed dealt a different board depending on
  how many deals came before it (the stadium's board changed between two deals in one process). The deals now take the library's
  own blocks only. This matters for the camp: its page deals the fight's board again from the fight's options and die, on a fresh
  page; a fight whose own deal had tried several times could be re-dealt as another board.

## THE SEAM FOR MOTION 3 (the camp after a fight, rule 442(a))
- FIGHT.boardNow() (window.fightBoardNow() adds the camera: zoom, cx, cy, tw, th): the board this fight stands on, whole, as plain
  data: its blocks, terrain, cover, lights, roofs, storeys, and a laid board's every ground picture, building, mouth and taper,
  its ring; the light (night, power), its cols and size.
- FIGHT_OPTS.boardDef = that boardDef: FIGHT.setup stands that very board again, tile for tile, with no deal at all (a grown or
  cut board at its own size; the grow-to-fit and the cut are skipped; S.handed true, S.handErr says why if refused).
- Gated: THE STREETS JOIN J8, 30 boards taken from a fight, through JSON, handed to a fresh setup on another seed: 30 of 30 the
  same board (every picture, mouth, building, piece and light); planted: one tile changed, caught.

## PROOF
- gates/the_streets_join_gate.js (THE STREETS JOIN, registered) 13/0 in about 40 s:
  J1 THE PIECE: 3,496 pieces on 570 boards and their rings, every one the piece the gate works out again from the board's own
  roads (planted: a sidewalk's corner taken away, caught); J2 THE MOUTH: 866 places a painted street meets an old street with a
  kerb, sidewalk or gravel there, every one opened as deep as that edge (planted: a mouth taken away, caught); J3 NO SEAM, IN THE
  PICTURES (gates/the_streets_join_pixels.py, the pictures themselves along every edge a piece or a mouth touches, 114 boards):
  0 seams of 5,635 edges (before: 4,333 of 5,669) (planted in the pictures: the corner piece gone and the mouth gone, both caught);
  J4 THE CITY: 39 roads run off the board, every one runs on through the ring (planted: a run taken away, caught); J5 A CURB CUT
  ONLY ACROSS A SIDEWALK: 147; J6 NOTHING ELSE MOVED: 95 boards against the pieces off, terrain, cover, lights, roads, tiles the
  same; J7 ENOUGH: 600 boards, 15 places at 20 seeds; straights 2,920, corners 328, T's 119, 90 old street tiles a new street
  crosses (opened both sides), dead ends 172; 454 tapers, 22 sides ended in a kerb; J8 above.
- ON THE PAGE HE PLAYS (a scratch probe: the alpha and the demo opened through the title, THE RAIDERS, BEGIN; a fight started by
  the map's own handover; ENGAGE with a finger; the camera panned onto the corner as a finger pans): the alpha upright (the suburb,
  31 pieces and 6 mouths; the trailer park, 8 and 5), the demo sideways (the suburb; a warehouse street at the battery, 22 pieces
  and 6 tapers); 0 page errors. The card: before (main) and after at the same corner, the alpha upright; the warehouse junction,
  the demo sideways.
- ALSO RUN, ONE AT A TIME: EVERY BUILDING ON THE ROAD 9/0 (it now loads the pieces; R3 accepts a curb cut's own sidewalk); THE
  OLD LAYOUT, THE NEW HOUSES 25/0; THE BOARD IS THE CITY AT THAT SPOT 194/0; EVERY PLACE ITS OWN BOARD PASS; THE CAMP IS PITCHED
  ON THE BOARD 14/0; THE CASINO FLOOR 9/0.
- RED HERE AND ON MAIN, BETTER HERE: NO BOARD BREAKS ITS OWN PICTURE (every_place_no_seams): main suburb block seams 16%, cell
  borders seen 21.5%, cut-offs 18.0%, the trailer park 5.9% / 4.7% (red); here suburb 8% (green), 19.7%, 14.0%, the trailer park
  2.5% / 2.0% (green). The suburb's rest is the yards blocks' own borders (PLUMBER 8's suite list). RED HERE AND ON MAIN, THE SAME:
  NOBODY ON ANYBODY, THE WATER RUNS ON (the file staggered; the canal's ground, 8.5 against 1.3).

## WEAK, SAID OUT LOUD
- The kit's asphalt is darker and more cracked than the old yards' and the trailer lane's: the joins are continuous, the material
  changes at the mouth (a darker street meeting a lighter one).
- A taper's kerb is a drawn line on the tile, 3 art px; at the far zoom stop it is a hairline.
- A mouth over an old street's sidewalk carries the new street's own walk up to the old asphalt: the two sidewalks meet square,
  not with a rounded kerb return.
- 22 sides end in a kerb where the old street could not take the new one: the road goes on in the network (a man walks it), but
  the picture shows a kerb there.
- The map's own streets are WORLD 13's (442(d)'s other half).

[bb] Battle Brothers' battle maps are cut from the world tile's terrain and draw no roads that must meet; ours are a piece of the
city, so its streets join like a city's, our swag.
[analog horror] the dead suburb's new street meets the old one clean, kerb to kerb, as if a crew still came to pour the asphalt.
