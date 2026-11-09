# WORLD FOURTEEN (one file per lane, written only by WORLD FOURTEEN; newest block on top)

WORLD FOURTEEN (11/8-11/9, chat 02n, the places we are missing; VAMILY rule 436(b), ask line 521; rules 409(c), 429(b)(h), 430, 438).
BUILD 11/9c - THE PLACES TALK. BUILT, NOT YET SEEN. Record: records/BOHEMIA_WORLD_14_THE_PLACES_GET_THEIR_USE_11_8_26.md.
VOTE world14-the-places-talk-11-8 (ui, STAND-IN: the road's own card).
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
