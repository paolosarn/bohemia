# WORLD FOURTEEN (one file per lane, written only by WORLD FOURTEEN; newest block on top)

WORLD FOURTEEN, ROUND FIVE, BATCH ONE (11/11, the coordinator's round: the two unplaced places, rows 579, 593, 595; rule 441).
BUILD 11/11o - THE BUS YARD AND THE GREENHOUSES. BUILT, NOT YET SEEN. Record: records/BOHEMIA_WORLD_14_THE_BUS_YARD_THE_GREENHOUSES_AND_
FOUR_REDS_11_11_26.md. VOTE world14-the-bus-yard-and-the-greenhouses-11-11 (ui, STAND-IN).
- THE LAST TWO OF RULE 409's PLACES, inside the valley, seated as the 11/9 note to WORLD 13 said (no word against it in its block):
  THE BUS YARD (the RTC's Sunset Maintenance Facility, 5165 W Sunset Rd at Decatur; kind 'terminal'): THE YARD BOSS, PULL THE
  BATTERIES OUT OF A DEAD BUS (4 h, +6, every 5 days), TAKE ON THE LAST MECHANIC (3 food, a caravan hand joins). THE GREENHOUSES
  (Urban Seed's, 4770 Wynn Rd; kind 'farm'): THE GROWER, BUY A CRATE OF GREENS (-3, +4 food, every 3 days), HOLD THE DOORS WHEN THE
  HUNGRY COME TONIGHT (a fight). Rows by tools/bohemia_world14_valley_seats_data.py (new); WORLD TEN's sync wrote only the DATA block.
- FOR WORLD 13: your generator's DATA block gained the two lines (nothing else); both are kinds you already make, no new kind. FOR
  COMBAT: 'terminal' left your 'infrastructure' family (it waited there for THE APRON) and fights on the works yard (landfill) for
  now, engine/bohemia_boardkinds.js and the shell's nfKind; when THE APRON lands, put it back (the note is on the line). FOR SCAVENGE
  TWO: 'terminal' and 'farm' are in SEARCHABLE now (their finds were written, never searchable): every farm block can be searched.
  FOR COOK FOUR: the golden pieces, the yard of buses in rows and the long plastic houses with the purple lights.
- THE FOUR REDS: 579 THE NORMIE HOUR, WORLD 8/0 (the gate read a far town's board at the hour he left, the phone plans from when he
  arrives: a farm job's wait for dark); 593 THE PLACE IN THE DARK 20/0 (slices/bohemia_job_kinds.js __THE_PLACE_IN_THE_DARK_ON_A_BEAT__:
  the job's places come out of the dark first in every draw and once a second; the gate leaves a town's screen before it reads the
  map); 595 THE BAR NAMES THE NEWS 22/0 (WORDS' 143a roll says the news in plain English most times; the gate takes either form) and
  THE NEIGHBOUR TAKES THE REFUGEES 15/0 (the lot's line says {from}; the elder's leg is past the first town's welcome). Rows marked.
- GATES: THE MISSING REAL PLACES 16/0, THE PLACES GET THEIR USE 30/0 (16 places, demo and alpha), FIGHT ANSWERS 17/0, BOARD KINDS
  24/0, EVERY PLACE ITS OWN BOARD PASS, ONE ROOM TABLE 15/0; THREE BLOCKS 21/1 red on clean main too.
- FOR WORLD 13: my two places rows carry your 'piece' (tools/bohemia_world_thirteen_pieces.py re-run, EVERY MAP KIND HAS ITS FIGHT
  ANSWER 22/0); my fight-answers tool now keeps any field another lane wrote on a row. SEEN ONCE, NOT AGAIN: THE PLACE IN THE DARK on
  the computer once could not take its job (loopTakeContract false, D5a/D5b/D6 red), the re-run 10/0; one game in two runs.
- NEXT ON THIS LANE (batch two of this round): twelve road events that touch his settlement, his bosses and his jobs.
[bb Battle Brothers' towns sell provisions and wagons; ours grow greens under a roof and park two hundred and fifty buses with no diesel.]
[analog horror: every bus at the yard still says NOT IN SERVICE, and somebody washes them every night.]

WORLD FOURTEEN, ROUND FOUR (11/10, rule 443(b), ask line 567; rule 441 fully baked). BUILD 11/10x - TWELVE MORE ON THE ROAD. BUILT, NOT
YET SEEN. Record: records/BOHEMIA_WORLD_14_EVENTS_ON_THE_ROAD_11_10_26.md. VOTE world14-twelve-more-on-the-road-11-10 (ui, STAND-IN).
- MEASURED FIRST: the road had 45 events (CONTENT 11/2-11/3), every one a stranger met on the road (Battle Brothers' location events);
  none of his own company's (theft, spoiled food, a brawl, a man called home), no injury event, no event could wound a man, send one
  away or open a place. Sideways every card cut its last choice (478 px of card in a 348 px box).
- BUILT: twelve rows in records/target/BOHEMIA_ROAD_EVENTS.json (lane 'WORLD 14'; tools/bohemia_world14_road_events_data.py): six IN
  THE COMPANY spoken by his own man by name and face (the short battery box, the swollen cans, the old job's place under the fog, the
  last canteen between two of his men, the word from home, the plasma van), six of the road (the rent crew, the green pool, the copper
  men on the streetlights, the timeshare man, the picket line, the dead bank machine). Consequences: a man leaves (4), batteries, food,
  a wound (5), a mood (6), a place opened, a fight. Plain English, draft:true, no new Spanglish.
- THE SEAM (slices/bohemia_road_more.js, new; __THE_ROAD_MORE__ marked in slices/bohemia_road_events.js): needs.crew, needs.place;
  fx.wound (BohemiaCondition's record), fx.leaves (BohemiaHireLock.dismiss), fx.open (fogReveal). The chance keeps its siblings now
  (fixes CONTENT's ev_the_cairn's hour too). The card sideways is two columns (__THE_CARD_SIDEWAYS__); it does NOT dodge the phone
  itself, UI FOUR's layer does (a first try that dodged in the card turned NOTHING POPS N1/N5 red; taken out, 38/0).
- GATES: TWELVE MORE ON THE ROAD (new, two halves) demo 14/0, alpha 14/0 (the alpha brings the map up under the driver on main 158450da,
  so its director step counts now); NOTHING POPS 38/0; THE PLACES GET THEIR USE 30/0; CONTACT STOPS HIM DEAD 18/0; DEMO BUILD 25/0;
  LANGUAGE 107/0; PAGES PUBLISH 27/1 (908 MB over its 900 MB cap, the same on clean main).
- FOR CONTENT (the road's module is yours): the seam is marked lines only; a new row of yours may use needs.crew / needs.place and the
  three new fx the same way (the file header of bohemia_road_more.js lists the words). FOR UI FOUR: the road card sideways is the
  two-column '.rc' with class 'wide' on #roadcard; your layer slides it, the card only leaves you the room. FOR TUNING: every number in
  the twelve is draft. NOT CHECKED: a man wounded on the road walked into a fight (the engine's own condOf path carries it).
- STILL OPEN ON THIS LANE (from batch three): the bus yard and a greenhouse farm need a valley seat (the note to WORLD 13 stands).
[bb Battle Brothers' company events steal from the stash and call a man home; ours are the plasma van, the swollen cans and the rent crew.]
[analog horror: the dead bank machine still runs on its own battery, says her balance is zero every morning, and asks if she would like a receipt.]

WORLD FOURTEEN, BATCH THREE (11/9, rule 440(c), ask line 539). BUILD 11/9j - THE RANCH AND THE LAKE CAMP. BUILT, NOT YET SEEN.
Record: records/BOHEMIA_WORLD_14_THE_RANCH_AND_THE_LAKE_CAMP_11_9_26.md. VOTE world14-the-ranch-and-the-lake-camp-11-9 (ui, STAND-IN), names 7adce071.
- VERIFIED THE REAL SPOTS: the ranch is Spring Mountain Ranch (Red Rock, 36.0697 N 115.4506 W), the campground and RV park Callville Bay
  (Lake Mead, 36.1433 N 114.7256 W): both OUTSIDE the valley. The bus yard is the RTC's Sunset Maintenance Facility, 5165 W Sunset Rd
  (opened 2009, 36.6 acres): INSIDE the valley. A greenhouse farm: none verified yet, inside the valley.
- BUILT, ON THE REGION (WORLD's own tools/bohemia_world_region.py, re-run; the land file gains exactly the two places, nothing else
  moved; the valley's generation untouched): SPRING MOUNTAIN RANCH (-18,65, a road, 8.2 h): THE FOREMAN, BUY A SIDE OF BEEF (-6
  batteries, +6 food, every 4 days), STAND GUARD AGAINST THE RUSTLERS (a fight); CALLVILLE BAY (151,45, a dirt track, 15.4 h): THE
  HARBORMASTER, TRADE BATTERIES FOR DRIED BASS (-4, +5 food), TAKE ON THE MAN FROM SITE 31 (a fisherman joins). The ranch painted
  with the region's garden look, the RV park its trailers look; two more fight rows (fourteen in all).
- Lenzie's line said 'owns Las Vegas' (shipped in 11/9f): the city is called Bohemia (IT IS CALLED BOHEMIA); it says 'the whole valley' now.
- GATES: THE PLACES GET THEIR USE 30/0 over fourteen places (demo and alpha; U13 now checks every region look); THE MISSING REAL PLACES
  16/0; all ten region gates run: eight green, THE ONE RULER 30/3 and IT IS CALLED BOHEMIA 5/1 red on clean main too (not these files).
- STILL OPEN ON THIS LANE: the bus yard (verified, inside the valley) and a greenhouse farm need a valley seat. FOR WORLD THIRTEEN, the
  note of batch two stands: say in your block if your land-use layer should seat them; otherwise the next WORLD round seats them through
  WORLD TEN's DATA block, as places of kinds the map already has.
[bb Battle Brothers sells food and men in its towns; ours sells beef at the ranch and bass at the lake, and the roads' people winter at the camp.]
[analog horror: the phone in the Hughes ranch house still rings; the line was cut before the foreman came.]

WORLD FOURTEEN, BATCH TWO (11/9, rule 440(c), ask line 539: 'More everything pls'). BUILD 11/9f - SEVEN MORE PLACES TALK. BUILT, NOT
YET SEEN. Record: records/BOHEMIA_WORLD_14_SEVEN_MORE_PLACES_TALK_11_9_26.md. VOTE world14-seven-more-places-talk-11-9 (ui, STAND-IN), names 7d1ec7f5.
- The seven WORLD TEN seated get their person and choices (data only, the 11/9c machinery): CLARK STATION, THE MINT (pay the boiler
  crew in food to charge your batteries: -3 food, +6 batteries, every 3 days; take the racks from the men who hold it: a fight, 12),
  LENZIE STATION at Apex (strip the black-start battery room; the scrappers in the switchyard), SHARK REEF (the tunnel to the gift shop;
  fish the tanks for food, every 5 days), the ANIMAL SHELTER (the kennel keeper joins as a houndmaster with the brindle dog, Battle
  Brothers' dog man; leave food for the dogs), THE MOB MUSEUM (the tour: the Mob likes you more; collect a debt for the family: a fight),
  the NATURAL HISTORY MUSEUM (the cases: the beast law's science in the keeper's mouth; pull the T. rex's backup battery: 5, the roaring
  stops), CHANNEL 8 (buy a minute on the air: 5 batteries, the town hears, a post; search studio B).
- Seven more fight rows in WORLD 13's table 'places' (twelve in all; Lenzie's its only one, on the region).
- The chip says what a choice costs first ('-3 FOOD · +6 BAT · 2 H'); before it hid the gas plant's food.
- GATE THE PLACES GET THEIR USE now covers every place with a visit: 30/0 (twelve places, 96 valleys, 960/960 on the network, the
  region's two at their coordinates, 7 plants; demo and alpha; NEW U12c: all 17 non-fight choices pay, the keeper joins as a dog man).
- BATCH THREE, NEXT ON THIS LANE: the ranch and the greenhouse, the bus yard, the campground and RV park. Not on the map yet. Plan: the
  ones whose real spot is outside the valley go on the region (WORLD's own tools/bohemia_world_region.py, as WORLD TEN put the lab and
  Lenzie): a ranch in Red Rock (Spring Mountain Ranch), a campground at Lake Mead (Las Vegas Bay); the ones inside the valley (a bus yard,
  a greenhouse farm) need a seat in the valley's generation. FOR WORLD THIRTEEN: unless you say otherwise in your block, the next WORLD
  round seats them the way WORLD TEN did (real_places.json + its sync, which writes ONLY the DATA block of __THE_MISSING_REAL_PLACES__ in
  engine/bohemia_overmap.js), as places of kinds the map already has (a farm, a trailer park, a terminal), so no new kind enters your
  DISTRICT list and no table needs a new row. If your land-use layer (429(g)) should place them instead, say so and we wait for it.
[bb Battle Brothers' locations hand you a fight or a find; ours hand you the money supply, a dog man, the Mob's ledger and a minute on the air.]
[analog horror: the T. rex roars on its backup battery every night until somebody takes the battery.]

WORLD FOURTEEN (11/8-11/9, chat 02n, the places we are missing; VAMILY rule 436(b), ask line 521; rules 409(c), 429(b)(h), 430, 438).
BUILD 11/9c - THE PLACES TALK. BUILT, NOT YET SEEN. Record: records/BOHEMIA_WORLD_14_THE_PLACES_GET_THEIR_USE_11_8_26.md.
VOTE world14-the-places-talk-11-8 (ui, STAND-IN: the road's own card), names 64380f14 (the ship).
- MEASURED FIRST: WORLD TEN (11/6) had already seated all twelve of rule 409(c)'s first places at their real spots (its gate 16/0 on
  main). The hole was the USE: each opened the same screen as any town (the scavenge deals six goods evenly, the place's own finds have
  no reader), the lab was painted as any fortress (a hill town), the lab had no fight answer.
- NOW EACH PLACE TALKS WHEN YOU ARRIVE (Battle Brothers' location: a picture, a few lines, two or three choices), data in
  records/target/bb/real_places.json 'visit' (tools/bohemia_world14_place_visits_data.py), the card is the road's own (bohemia_road_events.js
  card/apply), slices/bohemia_place_visits.js (new, mine) wraps loopOpenTown: THE NIGHT TECH at TULE SPRINGS LAB (open pen four: the lab's
  dire wolves, a fight; read the board: what broke out, from which bones), THE LAST TELLER at THE BANK (drill the boxes: 8 h, a chance at
  8 batteries; run the men off the upper floors: a fight), THE LINE at the UNEMPLOYMENT OFFICE (NUMBER 211 to 215, a new man every four
  days: take him on for two nights of food and he joins with his trade; hand out food: the town hears), THE NIGHT MANAGER and THE KEY
  CUTTER at the two HOME CENTERs (search the back / the dock: 4 h, batteries and a hand tool; run the crew out of the lumber aisle: a fight).
  WALK IN opens the screen as before. A choice goes once made (a fight's only when won); once a day at most; only WALK IN left = no card;
  a choice he cannot pay for says NEED 2 FOOD (rule 438). Under automation only when a checker sets window.__PLACE_VISITS_ON.
- THE LAB READS AS A LAB: real_places.json the_lab region_trade 'prison'; the module wraps vbRegionTrade so a region place may borrow
  the region's own compound look (crates and long sheds behind a fence) until COOK FOUR's golden piece.
- THE FIGHT ANSWERS: records/target/bb/map_fight_kinds.json 'places' (tools/bohemia_world14_place_fight_answers.py): five rows, the four
  valley ones equal to their kind's class, building and storeys; the lab's its only answer.
- GATE: THE PLACES GET THEIR USE (gates/the_places_get_their_use_gate.js, registered) 28/0: node U1-U6 over 24 seeds x four turns,
  plants 7 of 7; the demo AND the alpha U7-U16. Green with it: THE MISSING REAL PLACES 16/0, EVERY MAP KIND HAS ITS FIGHT ANSWER (full),
  DEMO BUILD 25/0, PAGES PUBLISH 28/0, EVERY SPEAKER HAS A FACE 10/0, VOTE TAB on the card.
- FOR WORLD THIRTEEN (rule 436(b): 'agree in handoffs/ how a new kind enters'; nothing of your generation touched):
  (1) A NEW VALLEY PLACE enters through real_places.json and WORLD TEN's sync (tools/bohemia_world_ten_real_places_sync.js writes only
  the DATA block of __THE_MISSING_REAL_PLACES__ in your engine/bohemia_overmap.js); it is stamped LAST on the finished valley, on ordinary
  ground with a street beside it, and keeps t.was. I added no place and ran no sync this round, so your file is untouched. If you would
  rather the places be seated by your land-use layer (429(g)) when it lands, the file's 'seat' and 'like' say where and what each is; say
  so in your block and the next WORLD round moves them. (2) ITS FIGHT ANSWER is its kind's row in your 'districts'; a place that says
  more adds a row under 'places' (kind, where, and your own fields). Your sync (tools/bohemia_world_thirteen_fight_kinds_sync.js block())
  does not carry 'places' into engine/bohemia_fight_kinds.js; when the cut (429(a)) lands, add 'places' to block() so the fight on a
  place's block reads its row before its kind's. Your gate is green with the section (it reads the five sections it knows). (3) THE LAB
  is on the region, not your valley: its row is under 'places' with where 'region'.
- FOR RUN TWO: the settlement screen's scavenge still deals the six goods evenly; one marked line can read BohemiaScavenge.findsOf(
  S.place.district) (WORLD TEN's NOTE, 11/6, stands).
- FOR JOBS (rule 436(c)) and WORLD 9: the ids (the_lab, the_bank, the_unemployment_office, the_home_center_east/west) can be a job's
  place; a job to the pens or the vault would read the visit's flags (lab_pen_four, bank_upstairs) so it is not offered twice.
- FOR HIRES: the line hires through the road's own manIn (bohemia.hired.v1, background and look); if HIRES wants the line in its own
  recruit list, the five men and their trades are in the file.
- FOR COOK FOUR: the golden pieces (rule 408): the lab (the pens in a row behind chain-link, the freezer house, the bone beds), the bank
  tower over its vault, the office and its line, the big-box home centre with its garden yard. Today they wear their like-kind's art.
- FOR TUNING: every number in the visits (batteries, food, the chances, the hours, the skulls) is draft, yours for the one table.
- NOT DONE: the rest of 409(c)'s list (the ranch and greenhouse, the bus yard, the campground and the smaller ones) has no visit; no
  job sends him to these places yet.
- A REAL WALK: from one block away the map's own arrival shows the card on the alpha; a four-block walk under automation never left (the
  same on a clean copy of main: the harness, not this change).
[bb Battle Brothers' locations greet you with a picture, a few lines and Attack! / Leave; ours greet you with the person who stayed.]
[analog horror: the lab's feeding clock is 2,900 days late, and LOOSE is written next to every animal in the tech's own hand.]

(The START file's WORLD FOURTEEN block of 11/9, moved here when the 11/10 block took its place.)
WORLD FOURTEEN (world-fourteen-01gkdyuu): 11/9 LATEST -- BUILD 11/9j - THE RANCH AND THE LAKE CAMP, BUILT, NOT YET SEEN (rule 440(c), ask
line 539; after 11/9c THE PLACES TALK and 11/9f SEVEN MORE PLACES TALK). Fourteen of rule 409's missing places now talk when you arrive, two
or three choices with real costs: the lab, the bank, the jobs line, the home centres (11/9c); the gas plants, Shark Reef, the shelter, the
museums, Channel 8 (11/9f); now SPRING MOUNTAIN RANCH in Red Rock (beef for batteries; guard the herd from the rustlers) and CALLVILLE BAY on
Lake Mead (dried bass; the man from site 31 joins), both on the region's real land at their real spots. Fourteen fight rows in WORLD 13's
table. Gate THE PLACES GET THEIR USE 30/0 (demo and alpha). Still open: the bus yard (verified: RTC Sunset, 5165 W Sunset Rd) and a
greenhouse farm need a valley seat (a note for WORLD 13 in handoffs/WORLD_FOURTEEN.md).
[bb Battle Brothers' locations greet you with a picture, a few lines and Attack! / Leave; ours greet you with the person who stayed.]
[analog horror: the phone in the Hughes ranch house still rings; the line was cut before the foreman came.]
