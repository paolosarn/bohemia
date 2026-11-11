# THE BUS YARD, THE GREENHOUSES, AND FOUR RED GATES (WORLD 14, 11/11; the coordinator's round; rules 409(c), 440(c), 441; rows 579, 593, 595)

## THE JOB (the coordinator, 11/11)
(1) The two places still unplaced, the bus yard and the greenhouse, on the map with their settlement screens and what each is for.
(2) Twelve more road events (the next batch, its own build). (3) Rows 579, 593 and 595 (THE NORMIE HOUR, THE PLACE IN THE DARK,
THE BAR NAMES THE NEWS, red on main). Rule 441: proven on the real page, alpha and demo, phone both ways.

## THE TWO PLACES (verified)
- THE BUS YARD: the RTC's Sunset Maintenance Facility, 5165 W Sunset Rd at Decatur Blvd, just north of the Beltway; opened 26 August
  2009, 36.6 acres, about 250 buses and 50 paratransit vans, a maintenance building, a fuel island, a wash that recycles 98 percent of
  its water (Las Vegas Sun 2009-08-26; Stantec; a bid listing gives the address).
- THE GREENHOUSES: Urban Seed, 4770 Wynn Road, a few blocks west of the Strip: in July 2016 high-tech greenhouses on a small plot in the
  middle of the city, greens in towers on a fraction of a field's water (Las Vegas Weekly 2016-08-02; NPR The Salt 2017-01-23). The
  game calls it THE GREENHOUSES; the company's name stays off the art.
- SEATED the way WORLD TEN seated the first ten, as the 11/9 note to WORLD 13 said (WORLD 13 wrote nothing against it): a row each in
  records/target/bb/real_places.json (tools/bohemia_world14_valley_seats_data.py, new), WORLD TEN's sync writing ONLY the DATA block
  of __THE_MISSING_REAL_PLACES__ in engine/bohemia_overmap.js, re-inlined by tools/bohemia_city_overmap_resync.py (the page gains the
  two DATA lines, nothing else). Kinds the map already has, so no new kind enters the DISTRICT list: the bus yard a 'terminal' (the
  hall and the bays), the greenhouses a 'farm'. Seats from the ten seated places' own lat/lon (about 240 blocks a degree east): the
  bus yard strip -9, y 0.76; the greenhouses strip -5, y 0.63. On every one of 96 valleys (24 seeds, four turns), the worst 9 blocks
  off its spot, none lost, nothing else moved.
- WHAT EACH IS FOR (the visit, Battle Brothers' location: a face, two choices, WALK IN to its settlement screen):
  | place | who | the choices |
  |---|---|---|
  | THE BUS YARD | THE YARD BOSS | PULL THE BATTERIES OUT OF A DEAD BUS (4 h, +6 batteries, every 5 days: the RTC's electric buses' banks); TAKE ON THE LAST MECHANIC (3 food: he joins, a caravan hand: a bus is a faction's wagon) |
  | THE GREENHOUSES | THE GROWER | BUY A CRATE OF GREENS (-3 batteries, +4 food, every 3 days: the pumps run on batteries); HOLD THE DOORS WHEN THE HUNGRY COME TONIGHT (a fight: +6 food and the block's favour when won) |
  Their fight rows in WORLD 13's table 'places' (the yard's hall, the buses in rows half cover, the fuel island; the greenhouses' plastic
  that stops nothing, the towers of greens a step, the pump shed of block). Their finds and their feed lines are in the rows.
- EVERY TABLE KNOWS BOTH KINDS (THE MISSING REAL PLACES R7): 'terminal' and 'farm' were never searchable (engine/bohemia_scavenge.js
  SEARCHABLE, their finds already written), and 'terminal' fought on the catch-all (it waited in COMBAT's 'infrastructure' family for
  THE APRON). Now both can be searched; the terminal fights on the works yard (engine/bohemia_boardkinds.js landfill family, the
  shell's nfKind the same) until THE APRON lands, then it goes back to that family (the note is in the file). R7's paint check read only
  the roof and casino lines (every kind WORLD TEN added was a building); a farm is painted green fields, so it now reads any explicit
  class in vbClassOf (the fall-through lot is still no paint).

## THE FOUR RED GATES (rows 579, 593, 595)
- 579 THE NORMIE HOUR, WORLD (N5 F5): a far job said 319 min on the phone and 593 on its town's board. MEASURED: a farm job waits for
  dark when he gets there by day; the phone plans from the hour he ARRIVES (night, no wait), the gate read the board at the hour he
  LEFT (day, the whole wait). The game was right; the gate now reads the board at his arrival's clock. 8/0.
- 593 THE PLACE IN THE DARK (D4b, D4c, and on the computer D5b, D6): the dark opened over a job's places only inside the job layer's
  draw, which the farthest stop does not reach, and after the towns were drawn in that frame (so a town came out named but not
  drawn). NOW slices/bohemia_job_kinds.js (__THE_PLACE_IN_THE_DARK_ON_A_BEAT__) opens it first in every map draw and on its own beat
  once a second. And the camp can end with him inside a town's screen (measured: ANARCHISTS' screen up, the map under it drawing 0
  towns): the gate reads the map after he leaves the town, the town's own way out. 20/0.
- 595 THE BAR NAMES THE NEWS (the first line): the bar told the right news, the nearest town's ('...market day over by the Colorful'),
  but WORDS' rule 143a (Paolo 10/24: 'it should be 10 to 15% randomized') rolls every keeper line: about one in eight keeps its Spanish,
  the rest are plain English ('...more to buy.' for the data's '...more to buy, ya sabes.'). The gate now takes the line either way
  (as written, or through the words lane's own plain()). 22/0.
- 595 THE NEIGHBOUR TAKES THE REFUGEES: the lot's line had no {from} ('People sleeping in the rubble...'): it says where they came from
  now (records/target/settlement_traits.json). And the elder said the FIRST TOWN's welcome (TUNING's change 7: the first town ever,
  once) instead of the refugees' line: the leg is about the refugees, so he has been to a town before it. 15/0.

## GATES (this tree, main 75daeb7b + this)
THE MISSING REAL PLACES 16/0 (12 valley places x 96 valleys); THE PLACES GET THEIR USE 30/0 (16 places, demo and alpha: the card at
all 16, U12c all 23 non-fight choices pay); EVERY MAP KIND HAS ITS FIGHT ANSWER 17/0; BOARD KINDS 24/0; EVERY PLACE ITS OWN BOARD
PASS; ONE ROOM TABLE 15/0; THE NORMIE HOUR, WORLD 8/0; THE PLACE IN THE DARK 20/0; THE BAR NAMES THE NEWS 22/0; THE NEIGHBOUR TAKES
THE REFUGEES 15/0. THREE BLOCKS 21/1 the same on clean main (cornerw missing from the library, not these files).

## NOT DONE
- Their own art: the bus yard wears the terminal's look and the greenhouses the farm's green fields; the yard of buses in rows and
  the long plastic houses with the purple lights are COOK FOUR's golden pieces.
- The twelve road events of the coordinator's (2) are the next build.
