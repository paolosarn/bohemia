# COMBAT FOUR: THE LIBRARY (BUILD 11/22 - THE LIBRARY)

11/22/26. COMBAT FOUR, more boards (rule 461). The library (the map's kind 'library'), whose fights were still on its steps and its lot.
Rules 416, 59, 428, 451(a), 441, 465. Ask row 651.

## MEASURED BEFORE (main, BUILD 11/22a)
A fight at the library was fought on the suburb's lots, cul-de-sac and yard blocks round it.

## THE FACTS IT IS BUILT ON
- A city's main library is open stacks (rows of steel shelving taller than a man), reading rooms of long tables, study carrels, the card
  catalogue's cabinets, the circulation desk by the doors.
- Without heat or power, paper is fuel: a library is where a winter's fires come from.

## WHAT SHIPPED
ONE DATA FILE, `slices/fight_ground/library/library.json`, the twentieth in `slices/fight_ground/insides.json`. EVERY fight at the library's
cell is fought inside it: measured first at eight in ten, the alpha's one library cell rolled the street on all 6 of its runs, so on the
alpha he would never have met it (the home center's call, 11/20). No new rule code; the ceiling is the hospital's 'grid' (a stand-in).
- `the_stacks`: six rows of steel stacks each side of a centre aisle. THE FIRST PIECE IN AN INSIDE THAT BLOCKS SIGHT: the stacks' row is
  'obstacles', the fight's own sight rule (only that row stops sight), so a man behind a row of stacks is out of sight, where every
  blocker before it (racks, trailers, tanks) gave cover but was seen through. End shelves (low cover, the way round), heaps of books kept
  for the fires (rough 3 AP, low cover), book carts, reading tables (cover), carrels (cover), microfilm readers.
- `the_reading_room`: long reading tables on their sides in rows (cover), the card catalogue's cabinets along both walls (blockers, cover
  beside), carrels, the circulation desk, heaps and carts.
- 13 tile kinds, each its cost and its effect and its Battle Brothers ground ([bb]: the stacks its forest a man hides in, the heaps its
  brush, the catalogue its wall); 11 pieces, all stand-ins (the names for COOK in the handoff). NO HIGH GROUND. No line rewritten (465);
  the tiles' tap lines are new, draft. The fires burn books.

## THE GATE (gates/the_big_insides_gate.js: 314 passed, 0 failed over twenty insides; the library 18 of them)
24 of 24 fights to the end on AUTO, nobody of 288 stood a whole fight; 13% of men on the bare floor after round one against 25% with
rule 428's leg off. MY FIRST CUT: 38%: the stacks' centre aisle and the reading room's ends held men in the open; end shelves, heaps
and carts went there.

## ON THE PAGE (rule 441; tools/bohemia_combat_three_on_the_page.js district:library, C3_INSIDE=library, through the map's own door)
The demo upright 1 fight (the stacks), 6 of 6 taps; the demo on its side 1 (the stacks), 5 of 5; the alpha upright 1 (the reading room),
3 of 3; the alpha on its side 1 (the reading room), 5 of 5. 4 fights, both layouts, all ended on AUTO, 19 of 19 tile taps, 0 page errors;
the ceiling moves a pixel 4.0 to 7.8 of 255 on average. (The demo's runs were at the first share; 8 runs before the change met the street.)

## NEXT ON THIS LANE
THE TALL THINGS BLOCK SIGHT across the insides already built: every blocker before the stacks is seen through (the home center's
racks twice a man's height, the truck stop's shelving, coolers and trailers, the hangar's fuselage and tail, the warehouse's trailer, the
TV station's flats and racks, the powerhouse's generators), which a four-metre rack is not. With a gate leg.
