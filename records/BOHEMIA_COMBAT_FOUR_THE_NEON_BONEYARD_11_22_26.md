# COMBAT FOUR: THE NEON BONEYARD (BUILD 11/22 - THE NEON BONEYARD)

11/22/26. COMBAT FOUR, more boards (rule 461: 'more boards, more ground, every floor tile from Battle Brothers with its cost and
effect'). The Neon Boneyard (the map's kind 'boneyard': the Las Vegas Blvd North cluster, 'Cashman Field + Neon Boneyard + Mormon
Fort', real, engine/bohemia_overmap.js), whose fights were all fought outside. Rules 416, 59, 428, 451(a), 441, 465, and rule 20's
analog horror at the source (a projector that still plays the old show onto dead signs when somebody runs the generator). Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22z)
A fight at the Neon Boneyard was fought outside: 'boneyard' is in the works yard's family (engine/bohemia_boardkinds.js 'landfill'),
never inside. The boneyard keeps its one cell in 40 of 40 valleys (engine/bohemia_overmap.js census, seeds 1 to 40).

## THE FACTS IT IS BUILT ON
- The map's own words above: the boneyard stands beside Cashman Field and the Mormon Fort, as the real ones do.
- The real Neon Museum has kept the city's dead signs since 1996, more than 250 of them from the Strip and downtown, most out in its
  open yard (the boneyard); its visitor center is the old La Concha Motel's lobby, moved there whole; its North Gallery shows dead signs
  in the dark with the old light thrown back onto them.
- A sign shop is where a sign is made and mended: the glass benders' benches with their burners, racks of new tube glass, the
  transformers that light the tubes, sign faces laid flat on sawhorses for paint, crates of bulbs, a scissor lift to reach the top; a
  casino's name in giant letters stands on the floor taller than a man.
- A MISMATCH, NOT MINE TO FIX: the dead's own line for the kind (engine/bohemia_dead.js, WORLD's) reads 'a field of sealed fuselages,
  and what got in them', an aircraft boneyard; the map seats the Neon Boneyard. No line rewritten (465); it is in the handoff for WORLD.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/boneyard/boneyard.json`, the thirty-ninth in `slices/fight_ground/insides.json` (share 0.5: half
the fights at the boneyard's cell by the cell's own dice; the rest in the yard of signs). No new rule code; the ceiling is the warehouse's roof ('joist',
a stand-in, at 10%).
- `the_sign_shop`: a casino's name in giant letters standing across the floor with letters missing (they hide a man), racks of sign
  faces in the corners (they hide a man), two sign faces laid flat on sawhorses as long as a bus (nobody walks over them, a man is seen
  across), racks of new tube glass (seen through), the benders' benches with their burners cold (cover), sign cans set on their sides,
  scissor lifts folded down and crates of bulbs (cover), transformers and a fallen arrow still pointing at a door that is not there (low
  cover), broken tube glass by the walls (rough 3 AP); doors on both sides and the bottom, three fires burning old sign frames.
- `the_dark_gallery`: dead signs stood on end in rows like headstones (they hide a man), a dead name in giant letters across the middle
  (they hide a man), the projectors on their stands (cover), sign cans (cover), bulb rails, transformers and arrows (low cover), broken
  glass, the monsoon's water standing between the signs (Battle Brothers' swamp: 4 AP, a man in it fights worse); doors on both sides and
  the bottom, two fires.
- 19 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the letters, the standing signs and the racks of
  faces its wall, the sawhorse faces and the tube racks its palisade you see through, the glass its rough ground, the water its swamp);
  15 pieces with the walls, all stand-ins painting at least 9% of a tile (I13) (the names for COOK in the handoff). NO HIGH GROUND: the
  lifts are folded and dead. No line rewritten (465); the tiles' tap lines are new, draft.

## THE GATE (gates/the_big_insides_gate.js, three suite entries: 685 passed, 0 failed over thirty-nine insides (230 in 562 s, 229 in 572 s and 226 in 549 s, the three run side by side; the third again after the share moved, 226 in 188 s alone); the boneyard 21 of them alone, in 47 s)
22 of 40 fights the gate deals at the boneyard go inside (the share 0.5); 24 of 24 fights to the end on AUTO (6.5 rounds), nobody of 288 stood
a whole fight; 6% of men on the bare floor after round one against 14% with rule 428's leg off; every board's floor joined, both layouts
dealt both ways; I11 STANDING WATER IS SWAMP: a man of his in the gallery's water is struck at 20% where the same tile dry reads 10%; I12
the letters and the standing signs hide a man, the sawhorse faces and the tube racks are seen past; I13: 13 stand-in pieces, each
painting at least 9% of a tile.
MY FIRST CUT, MEASURED AND CHANGED, TWICE: 16% bare after round one (the sign shop 17%): the middle cross aisles were open floor. I filled
them all and it went to 2%, but with rule 428's leg off it was 4%: a board so full of cover that the rule made no difference, which I8
refuses (the rule must win by five points). Half the fill came out: 6% against 14%.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:boneyard, C3_INSIDE=boneyard, through the map's own door)
FIRST AT 0.4, TWELVE RUNS, TWELVE FIGHTS OUTSIDE, AND THAT WAS NOT LUCK. A place's inside is rolled from its cell (the same cell the same
answer: seedOf(x,y + its ground) against the share), so over a whole valley a one-cell place is fought either always inside or never.
The boneyard's cell lands on five places over 40 valleys (53,17 in 18 valleys; 40,17 in 10; 42,23 in 7; 55,23 in 3; 51,23 in 2), and
their rolls are 0.413, 0.341, 0.926, 0.490, 0.790: at 0.4 only 40,17 went inside, 10 valleys of 40, and the page's valleys met only 53,17
and 42,23. At 0.5 three of the five go inside: 31 valleys of 40. THE LESSON, FOR EVERY ONE-CELL PLACE FROM NOW: read the rolls at its
real cells before choosing its share, never the share alone.
At 0.5: 5 fights inside on the demo upright, the demo on its side, the alpha upright and the alpha on its side twice (the cell 53,17,
THE DARK GALLERY every time: the cell deals its layout too), all ended on AUTO, 23 of 23 tile taps (the floor, a sign can, transformers,
a bulb rail, a projector, a fallen arrow, the doors), 0 page errors; the runs that met 42,23 fought in the yard, 0 page errors. THE SIGN
SHOP is seen on the fight page opened alone (the card's top left) and in the gate (24 boards). Run two at a time.

## ALSO IN THIS BUILD: SEVEN VOTE CARDS OPENED ON THE WRONG PICTURE
The VOTE cards of the storage yard, the radio station, the speedway, the granary, the fuel depot, the battery farm and the Mini Grand Prix
(BUILDS 11/22r to 11/22z) each had their first picture (show.first) on the water treatment plant's: the ship script I copied from carried
its path, and each after copied it on. Each card opens on its own picture now (records/target/vote_first/<id>.webp, on disk all along);
this card's script takes the path from its own id.

## SAID PLAINLY
VOTE card combat4-the-neon-boneyard-11-22 (stand_in): the sign shop and the dark gallery from the fight's camera, and a real fight
inside. The pictures are stand-ins (a street sign for a giant letter, a casino's screens for a dead sign on end, a container for the
racks of faces, a bulldozer for a scissor lift) until COOK draws them; the ground's rules are real. The projector's loop is in the words
(draft); its picture is COOK's and its sound is SOUNDS'.
