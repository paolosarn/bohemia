# COMBAT FOUR: THE COVER YOU COULD NOT SEE (11/22/26) -- A BUG HE CAN FEEL, ACROSS FOURTEEN INSIDES

11/22/26. Found looking at the campus's science labs on the fight page (rule 441): the labs' benches, gas cylinders and carts were
in the data, laid on the board (rows 2 to 4 and 10 to 12: 20 benches, 12 cylinders, 20 carts in the board's own list) and loaded on
the page (their pictures in the page's image table), and still the rooms looked like bare floor. Rules 416, 59, 441. Ask row 651.

## THE CAUSE, MEASURED
An inside's piece is drawn AS a finished piece of another kit (its 'like', a stand-in) until COOK's own picture is in, and it is drawn
at that picture's own size. A tile is a house (rule 416): 515 x 364 pixels of picture. Measured by the pictures' own pixels (alpha over
40; tools/bohemia_measure_the_stand_ins.py, written for this): a shopping cart paints 1.1% of a tile, a freight cart 0.7%, a tyre stack
1.6%, a hose coil 1.5%, sandbags 3.0%, a barrier 4.7%, a drum group 5.0%, a propane tank 5.6%, a column 5.9%, a cart corral 6.4% (and
thin rails at that). A tile the table calls cover (or one nobody may stand on) drawn with one of these reads as bare floor: he would
put a man on 'open ground' that is cover, or run past cover he cannot see. Fifty-two pieces in fourteen insides were drawn so (and three in the arsenal, not yet listed, which goes in with them swapped), among
them the tool chests and wheel sets of the rail shops, the bank's safes and tables, City Hall's tables and cameras, the shelter's
crates, the library's book carts, the hangar's carts and dollies, the police station's desks.

## TRIED FIRST, AND DROPPED
A cluster: the small stand-in laid four or five times in its tile. Measured on the page: five shopping carts are five dots of about
seven pixels each at the fight's own camera, and a cluster of corrals is a tangle of faint rails. The tile still read as floor.
Dropped, nothing of it shipped.

## WHAT SHIPPED
- THE SWAP (data only, no rule changed, no tile's cost or effect changed): every stand-in that paints under 9% of a tile borrows a
  readable picture instead, by what it is: a crate stack (sb_bales_S, 13.7%) for a tool chest, a safe, a cart, a book cart, a dolly,
  a camera rig; a tunnel camp's tables (tunnel_camp_b, 39.9%) for a desk, a table, a lab bench, an end cap; a junk pile (sb_rubble_S,
  10.5%) for drums, bottles, copiers, readers, a toolbox; a booth (garage_booth, 34.5%) for a compressor, a power cart, gas cylinders;
  a counter with seats (casino_seats, 34.2%) for a podium, an island, ropes, a lectern, cones, a jerky stand; a tangle (tunnel_jam,
  24.6%) for tyres, wheel sets, hoses, cables; a heap (sb_heap_S, 15.8%) for sandbags; a concrete core (garage_core, 44.3%) for a
  column; the casino's cage for the rail shop's work platform; the casino's glass for the aquarium's tunnel. Each piece keeps the
  name of what it was ('stand_in_was'), so COOK sees what it stands for; COOK's own picture replaces it the same way as before.
- THE GATE (gates/the_big_insides_gate.js, I13 A COVER TILE LOOKS LIKE COVER): every piece of every inside drawn as a stand-in borrows
  a picture that paints at least 9% of a tile, by gates/the_stand_ins_measured.json (60 pictures measured); a borrowed picture the
  table has not measured is a fail; a wall's picture is a wall; COOK's own picture is his to size. Planted: the first stand-in drawn as
  a shopping cart is caught. Run on main's rail shops before the swap: red, 5 pieces under 9% (the platform 8.7%, the wheel sets 1.6%,
  the tool chests 1.1%, the drums 5.0%, the freight carts 0.7%); after: green.
- The police car (a patrol car, 9.3%) stays itself.

## THE GATE AND THE PAGE
The big insides gate over twenty-seven insides: 473 passed, 0 failed in 409 s alone on the box (I13 green on all 27). On the page the
campus played 10 fights inside on all four ways with the swapped pictures (its record) and the rail shops on the demo upright 1 fight in the engine shop, 4 of 4 taps (wheel sets, the floor, a tool chest, drums), 0 page errors, the wheel sets, chests and drums now drawn where a man can see them.

## SEEN
The campus's science labs before and after, the same board from the fight's camera: the VOTE card's picture.
