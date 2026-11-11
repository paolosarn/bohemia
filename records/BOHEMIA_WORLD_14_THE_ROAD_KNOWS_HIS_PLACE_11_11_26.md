# THE ROAD KNOWS HIS PLACE, HIS BOSSES AND HIS JOBS (WORLD 14, 11/11; the coordinator's round, batch two; rule 441)

## THE JOB (the coordinator, 11/11)
"Twelve more road events that touch his settlement, his bosses and his jobs (a face, two or three choices, each costs something)."
Battle Brothers' first answer: its events read the company's state (a contract it holds, a town it is known in, the world's crises)
and its events can hand the company a thing or point it at a place. Ours read HOME BASE, the map's memory of the bosses, and the jobs he
holds; the road's own card, a face, two or three choices, never in the first minute (the director's own clock, gate E6 of TWELVE MORE ON
THE ROAD).

## THE TWELVE (records/target/BOHEMIA_ROAD_EVENTS.json, lane WORLD 14, tools/bohemia_world14_road_events_data.py; plain English, draft:true)
| id | needs | who | the choices (each costs something) |
|---|---|---|---|
| ev_the_family_at_the_door | his place planted | A WOMAN WITH TWO KIDS | take them in (-2 food, THE WIDOW AND HER TWO live at his place) / food and the shelter (-2 food, the town hears) |
| ev_the_solar_cart | his place | A MAN WITH A SHOPPING CART | ten batteries / four nights of food: A ROOFTOP PANEL (HOME BASE's solar build) |
| ev_the_water_tank | his place | A WATER HAULER | six batteries: A ROOF TANK / three hours pulling it to the next town (+3, the town hears) |
| ev_the_seed_library | his place | A LIBRARIAN | three batteries: THE SEED LIBRARY GARDEN / two hours carrying the catalogue (the town hears) |
| ev_the_runaway_cook | a boss's sign up | A MAN WHO RAN FROM {boss} | food / five batteries: {boss} found, his place out of the dark / hand him back (+4, the town turns) |
| ev_the_assessors_map | a boss's sign up | A MAN SELLING MAPS | four batteries / two hours of carrying: {boss} found |
| ev_the_roadblock | a boss found | THE MEN OF {boss} | the toll (-4) / the long way (2.5 h) / break it (a fight) |
| ev_the_leaderless | a boss fallen | A MAN WHO FOUGHT FOR {boss} | three nights of food: he joins / six batteries: his crew leaves the valley |
| ev_the_clients_runner | a job held | A RUNNER FROM {job_from} | push on (-2 food, the client's town likes it) / it takes what it takes (the client's town does not) |
| ev_the_rival_crew | a job held | A CREW BOSS ON A MOTORBIKE | pay them to leave it (-4) / run them off (a fight; the client hears) |
| ev_the_underpass | a job held, one of his men | A KID ON A ROOF | two batteries and two hours the long way / the underpass (a chance: nothing, or a wound of 14) |
| ev_the_letter_for_the_client | a job held | AN OLD MAN AT A BUS STOP | carry the letter (30 min, the client's town hears) / you cannot (the town hears that too) |
Realism: the foreclosures' rooftop solar (Summerlin), the water district's lost pressure on the upper floors, the library's seed
library, the county assessor's parcel maps printed before the servers died, the families who lost the house then the car.

## THE SEAM (slices/bohemia_road_more.js; __THE_ROAD_MORE__ lines in slices/bohemia_road_events.js; one export in slices/bohemia_his_map.js)
- needs.home {planted} ({home}, {home_blocks}) from BohemiaHomeMap.state(); needs.boss {sign | found | fallen} ({boss}, {boss_place},
  {boss_blocks}) from the map's memory (BohemiaHisMap.state().boss) and the bosses' rows; needs.job {held} ({job}, {job_from},
  {job_pay}) from LOOP.held (his own jobs). An event whose state is false is never a candidate.
- fx.home: HOME BASE's own seam, BohemiaHomeMap.give (kind prize/trophy/build/person; a build stands done; before he plants it WAITS
  and the phone says so; the same gift twice is one thing). Chip FOR YOUR PLACE.
- fx.boss {find}: the sign read the sign's own way (slices/bohemia_his_map.js gains readSign in its exports, marked; the boss found,
  his place out of the dark, kept). Chip A PLACE.
- The client's town: the road's own mood with 'faction:{job_from}' (heard through BohemiaJobKinds.settleJob, the same as every mood).

## GATES
- THE ROAD KNOWS HIS PLACE (gates/the_road_knows_his_place_gate.js, new, two halves): K1-K4 node (whole, plain English, every word
  filled by its needs, every choice costs something; four of each subject; the seam; five plants red); on the demo and the alpha,
  upright and sideways, with his place planted (HOME BASE's plantAt), a boss's sign up (the map memory's placeSign), a job taken (the
  board's own take): P1 a candidate only when its state is true, P2 every card (face, words whole, inside the glass, clear of the
  phone), P3 all 27 choice-ends tapped (batteries, food, hours; the gift at his place; the boss found and his place lit; the client's
  town hears; the man joins; the wound; the fight paid when won), P4 a real finger sideways, P5 nothing threw. DEMO 12/0, ALPHA 12/0.
- TWELVE MORE ON THE ROAD pinned to its own twelve (14/0 demo); LANGUAGE 107/0.
