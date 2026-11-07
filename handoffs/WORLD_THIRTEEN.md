# WORLD THIRTEEN (one file per lane, written only by WORLD THIRTEEN; newest block on top)

WORLD THIRTEEN (11/7, after the ship): THE COORDINATOR'S ROUTINES (rules 430, 429(f)(g)(h)) READ; the round's order is now (1) zones,
(2) the table (SHIPPED), (3) templates, (4) the cut, with 429(h) (every building on one road network) under (1) and (3), and 430 (every
asset of the 15 boards kept and used; only layout, placement and rules change).
- MEASURED FOR 429(g), 22 seeds (tools/bohemia_world_thirteen_zones_measure.js, every district read into twelve zones): the zones all
  exist but the balance is not the real valley's: houses 29.2-30.7% of the map, mile streets 25.5-27.9%, open land 18.8-20.9%,
  transport 12.1-13.2%, commercial 3.6-4.3%, the Strip 2.3-2.4%, green 1.3-1.9%, water 0.8-1.0%, INDUSTRY 0.6-0.8%, civic 0.4-0.6%,
  downtown 0.3-0.4%, the cheap edge (trailer parks, swap meets) 0.2-0.3%. Industry is scattered single blocks: 2,328 house blocks touch
  one, 6 sit inside one. NEXT: the land-use file (zones, share ranges from the real valley's zoning, adjacency rules, a street pattern
  per zone), an industrial corridor by the rail and I-15, the cheap edges by the freeways and the industry, then the gate over 22 seeds
  with planted fails; then every non-house building on the network (97 in 100 built blocks already touch a street; the misses are
  resorts and downtown blocks packed together).

WORLD THIRTEEN (11/7, chat 02m, the map's generation and ONE MAP; VAMILY rule 429, asks 492, 504, 505, 507, 508, 509). BUILD 11/7o (ship f5880ae8) -
EVERY HOUSE ON A STREET. BUILT, NOT YET SEEN. Record: records/BOHEMIA_WORLD_THIRTEEN_ONE_TABLE_AND_A_STREET_AT_EVERY_HOUSE_11_7_26.md.
VOTE world13-a-street-at-every-house-11-7 (stage stand_in).
- (1) ONE TABLE, SHIPPED: records/target/bb/map_fight_kinds.json (a modder's file): 88 map kinds, the town's 12 lots, 23 landmarks
  and its wall and two towers, your lot's 10 pieces, the map's 6 house models: storeys (a 1/2/3 mix), in or on the roof (no
  ladder), cover, what blocks, a street in front. engine/bohemia_fight_kinds.js (BohemiaFightKinds) carries it word for word
  (tools/bohemia_world_thirteen_fight_kinds_sync.js writes it). The painter stands each house as tall as the table says on its
  own roll; vbHouseStorey(gx, gy, lot) answers the fight the same storey. Gate gates/the_map_kinds_have_fight_answers_gate.js.
- (2) THE STREETS, SHIPPED: engine/bohemia_overmap.js houseLanes(m) (__A_STREET_IN_FRONT_OF_EVERY_HOUSE__): every house block its
  own street down its middle, joined to a mile street straight on or as a T, a pocket's track out, the trailer park the one
  exception; the painter lays it (the houses case: a sidewalk each side, a row of houses each side facing it, a bulb where it ends);
  the models face it (bohemia_map_houses.js pick, lot 32+). The fight gets it by being cut from the map. Gate
  gates/a_street_in_front_of_every_house_gate.js (22 seeds). Before: 27% of house tiles on suburb boards had a street beside them;
  now 100%.
- NEXT, IN ORDER: 429(h) the map's half (every building, not only houses, on one joined road network, roads 1 to 4 tiles); 429(c)+(f)
  the 15 place boards (fight_ground.json boards place_*) as templates the generator places where that kind of place lands; 429(g)
  the land-use layer; then 429(a) the cut with COMBAT TWO.
- NOTES OWED (in the record, section 5): COMBAT TWO (lay()'s one-in-seven roof can read vbHouseStorey; its board gate's truth now
  reads the house streets, one marked block); RUN (the_map_stands_taller H1 holds the old storey roll, one marked block); COOK FOUR
  (a two- and three-storey house model are owed: the table is 45 in 100 two storeys).
