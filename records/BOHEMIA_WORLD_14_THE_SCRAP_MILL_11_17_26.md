# THE SCRAP MILL (WORLD 14, 11/17)

The coordinator's round under rule 453, item (2): the next building kinds the map lacks from the checklist
(records/BOHEMIA_PAOLO_POCKET_CITY_2_BUILDINGS_AGAINST_OURS_11_5_26.md), each with its settlement screen and what it DOES for him,
the fewest words. Rule 454(a) this week: no person talks, no standing line rewritten. Rule 441: on the real page, alpha and demo, a
phone both ways.

## WHAT THE LIST STILL LACKED (measured on main)
Item 13's smaller ones: the public works yard, the scrap mill ("their steel mill; our junkyard has no mill"), a fishing dock, billboards.
Every other place on the list is seated (WORLD TEN's ten, WORLD 14's bus yard, greenhouses, cooling center and dome).

## WHY ONLY THE MILL THIS BUILD
- A place's VISIT is a person talking (a face, a speech, two or three choices). Rule 454(a) holds that this week, so the use has to be
  wordless.
- A place's own FINDS are written but nothing reads them yet: the settlement screen's SCAVENGE deals the six goods evenly
  (engine/bohemia_scavenge.js findsOf, a note to the scavenge lane since 11/6). A use that rests on finds alone does nothing in play.
- Battle Brothers' answer is the ATTACHED LOCATION: a workshop or a fishing hut by a town puts its goods on that town's market. Ours
  already reads a place by its name: the stall's makers (records/target/bb/stall_prices.json, made_by) answer S.place.name, so a real
  place named there makes that good. The tape shelf doubles the same way (made_by, made_mult 2).
- The mill fits two lists at once (copper wire, tape). The fishing pond has no shelf to put fish on (no food maker), and the public
  works yard has no confirmed address yet. Both wait, with their research, in handoffs/WORLD_FOURTEEN.md.

## NOW
- THE SCRAP MILL, a valley place of kind industrial (records/target/bb/real_places.json, tools/bohemia_world14_valley_seats_data.py):
  North Las Vegas's salvage strip, Commerce Street at Owens Avenue, where the scrap and salvage yards stand wall to wall (NV Salvage on
  Owens, the yards on North Commerce; the big shredder yards further up Losee Road). Seat: 6 blocks east of the Strip, 0.18 of the way
  down the valley. Synced into the generator's DATA block (tools/bohemia_world_ten_real_places_sync.js), the city page re-inlined.
- WHAT IT DOES (no words): its stall holds TWICE THE TAPE (40 rolls at a camp, where a camp holds 20) and sells STRIPPED COPPER WIRE at
  the maker's price, a batch a week (21 at the mill; 31 or more at any faction town that does not make it), bought back there for
  little (3). Carry it to a town that pays more: Battle Brothers' trade loop.
- Its finds (two, the fewest words, draft): copper wire (tape), a forklift battery. No visit, no feed post.
- On the map it is a place like the others: its name, a tap, arriving opens its settlement screen under its own name.

## OTHER LANES' FILES (marked, additive)
- ECONOMY's records/target/bb/stall_prices.json: "THE SCRAP MILL" added to copper wire's made_by and to tape_shelf.made_by.value.
- ECONOMY's gates/trade_goods_carried_gate.js: its maker list (faction towns) also reads the real places' names from
  records/target/bb/real_places.json, so a maker that is no place at all is still refused (its own 'Atlantis' plant stays red).
  TRADE GOODS CARRIED 4/0 and BUY VERSUS SELL 45/0 after.

## THE GATE (gates/the_scrap_mill_gate.js, in the suite as THE SCRAP MILL (demo) and (alpha))
- S1 the row (kind industrial, a valley place at its real spot, finds, no visit or feed); S2 the stall's file (copper wire made at the
  mill, cheaper there than at any faction town that does not make it, bought back for little; tape shelf twice a camp's); S3 the
  mutation (the mill out of the made_by lists, S2 red).
- On the page, demo and alpha, upright and sideways: S4 the mill seated, its own kind; S5 arriving opens its settlement screen under its
  own name, no visit card; S6 the stall opened by a tap: the copper wire line says MADE HERE, the tape shelf 40 against 20; S7 nothing
  threw.
- THE MISSING REAL PLACES 16/0 with the mill (15 valley places on 96 valleys, R7 every table knows every kind).

## ANALOG HORROR
The baler still runs on a truck battery. Nobody feeds it any more, and some nights it runs anyway.

[bb attached locations: a workshop by a town puts its goods on the market; ours is a scrap mill whose stall sells the wire it pulls
out of the walls.]
