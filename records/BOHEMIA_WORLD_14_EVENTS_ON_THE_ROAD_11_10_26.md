# TWELVE MORE ON THE ROAD (WORLD 14, 11/10; VAMILY rule 443(b), ask line 567; rule 441 fully baked)

## THE JOB
Rule 443(b): EVENTS ON THE ROAD under the overworld law (laws/BOHEMIA_LAW_THE_OVERWORLD_IS_BATTLE_BROTHERS_9_24_26.md: an event may
stop the party on the road, a face with a portrait, two or three choices, never in the first minute, nothing pops up without a mouth).
At least twelve, Battle Brothers' events first, each of the collapse in Las Vegas, each with a real consequence (a man, batteries, food,
a wound, a faction's mood, a place opened). Words draft:true, the player never speaks Spanglish, data a modder can edit, proven on the
real page on a phone both ways.

## MEASURED FIRST (the demo, main 0f4592d0)
- 45 road events (CONTENT 11/2-11/3, records/target/BOHEMIA_ROAD_EVENTS.json), every one a STRANGER met on the road: Battle Brothers'
  location events. Missing were its other two kinds: the COMPANY's own events (a man steals from the box, the food spoils, two men
  fight, a man is called home) and the INJURY events. No event could wound a man, send one of his men away or open a place.
- Sideways (844 x 390) every card ran taller than the glass: the bank's card 478 px in a 348 px box, the last choice below the fold
  behind a scroll.
- The road's chance branch dropped its siblings: a choice that cost an hour AND rolled a chance paid only the chance.

## WHAT WAS BUILT
1. TWELVE ROWS in records/target/BOHEMIA_ROAD_EVENTS.json (lane 'WORLD 14', written by tools/bohemia_world14_road_events_data.py,
   idempotent). Six of his OWN COMPANY (the card says IN THE COMPANY and the speaker is his own man, by name and face), six of the road:

| id | kind | who | the choices (what each does) |
|---|---|---|---|
| ev_the_short_box | company | his man | let the six batteries go (a sick nephew on an oxygen machine) / take it out of his share (a chance: he pays it back, or he is gone with six more) / throw him out (+4, he leaves) |
| ev_the_swollen_cans | company | his man | throw out the swollen cans (-3 food) / boil them hard (1 h, 80%: kept; else a wound of 18) / eat them as they are (50%: a wound of 30) |
| ev_the_old_job | company | his man | he knows a place under the fog from his old job: mark it (the place opens on the map) / forget it |
| ev_the_last_canteen | company | two of his men | one drank the last water: split two nights of water (-2 food) / let them settle it (the other is wounded, 14) |
| ev_the_word_from_home | company | his man | a letter from home: let him go with two nights of food (he leaves) / send five batteries / say the company needs him (a chance: he stays, or goes with five) |
| ev_the_plasma_van | injury | THE PLASMA VAN | his man sells a pint (1 h, +4 batteries, a wound of 10) / not today |
| ev_the_rent_crew | road | A WOMAN ON HER STEP | pay her rent (-3, the block likes you) / run the rent crew off (a fight: +6 and the block's favour when won) / walk on |
| ev_the_green_pool | road | A MAN WITH A BUCKET | boil two nights of pool water (2 h, +2 food) / drink it as it is (+3 food, 60%: else a wound of 16) |
| ev_the_copper_men | road | A MAN ON A LADDER | help him strip the streetlights (3 h, +4, the block likes you less) / tell him to leave the poles alone (the block likes you more) |
| ev_the_timeshare_man | road | A MAN IN A POLO SHIRT | sit through the pitch for the breakfast (2 h, +2 food) / buy week thirty-two (-10) / walk on |
| ev_the_picket_line | road | A WOMAN WITH A SIGN | give the line two nights of food (-2, favour) / cross the line and sell to the casino (+3, the block likes you less) / walk on |
| ev_the_dead_atm | road | A WOMAN AT A BANK MACHINE | pry the machine open (1 h, +3) / leave her to her machine |

   Realism first, each a real thing of Las Vegas's crash: the 2008 foreclosures' green pools (the county's mosquito crews), copper
   stripped out of streetlights (the valley's own long-running theft), the plasma centres that pay by the pint, the Culinary Union's
   picket lines on the Strip, the timeshare pitch for a free breakfast, botulism in swollen cans, the rent collector after the courts
   stopped. Plain English (the player never speaks Spanglish; no new Spanglish line). His men are named, never 'he' or 'his' for them.
   Every line draft:true. Battle Brothers' first answer: its company events (theft from the stash, spoiled provisions, a brawl in the
   ranks, a man called home), its injury events, its location events (Battle Brothers Wiki, 'Events').
2. THE SEAM: __THE_ROAD_MORE__ in slices/bohemia_road_events.js (CONTENT's; marked lines only) and slices/bohemia_road_more.js (new):
   a row may ask for needs.crew {n, bg} (one or two of HIS men, never YOU: {man}, {man_look}, {man_bg}, {other}, {other_look}) and
   needs.place {hidden} (the nearest real place still under the fog: {place}, {place_id}, {blocks}); a choice may do fx.wound {name, hp}
   (kept in the company's condition record, engine/bohemia_condition.js, the HEAL bar's numbers; a road wound never kills, one
   hitpoint stays), fx.leaves {name} (BohemiaHireLock.dismiss, the one way a man goes) and fx.open {id} (the fog lifts round it).
   The chip on a choice says it first: HE LEAVES, A WOUND, A PLACE, A CHANCE. A row that cannot be filled (no men, no hidden place)
   is never a candidate. Loaded by BOHEMIA_CITY_WORLD.html after the road module.
3. THE CHANCE KEEPS ITS SIBLINGS: apply's chance branch now pays the choice's other fields too (the hour of boiling, the pool's water);
   this also fixes CONTENT's ev_the_cairn, whose hour was dropped.
4. THE CARD SIDEWAYS (__THE_CARD_SIDEWAYS__): a wide, short glass lays the card in two columns, the face and the words on the left,
   the choices on the right; all of it stands in the glass. It does not dodge the phone itself: UI FOUR's layer (NOTHING POPS) slides
   every voice clear of the phone; the wide card is only made narrow enough that the layer has room. (A first try dodged the phone in
   the card and turned NOTHING POPS N1 and its planted N5 red; taken out, both green.) Upright the card is the card it was.

## GATES (the merged tree, main 158450da + this)
- TWELVE MORE ON THE ROAD (gates/twelve_more_on_the_road_gate.js, registered as two halves): node E1-E6 (whole, plain English, every
  word filled, both kinds, every consequence, the other 45 stand, the seam, five plants each red, the first minute on the director's
  own code with the clock held: 30 s nothing, 70 s fires); then on the page, a phone upright and sideways: P1 the director fires a
  card past the first minute off a town's ground, P2 every card of the twelve has a face, whole words, two or three choices, inside
  the glass, none under the phone, P3 every choice and both ends of every chance tapped (35 taps) does what it says, P4 a real finger
  sideways, P5 nothing threw. DEMO 14/0, ALPHA 14/0.
- NOTHING POPS, VOICES CLEAR, TOOLTIPS 38/0 (N1 0 sq pt under the phone both ways; N5 planted 5955). THE PLACES GET THEIR USE 30/0.
  CONTACT STOPS HIM DEAD 18/0. DEMO BUILD 25/0. LANGUAGE 107/0. PAGES PUBLISH 27/1, the one red (the publish list 908 MB over its
  900 MB cap) the same on clean main, not these files.

## NOT DONE
- The road's 45 older rows keep CONTENT's numbers; TUNING owns every number here (all draft).
- A road wound is lostHp on the man's condition record (the HEAL bar shows it, the clock and the camp mend it). The condition engine
  hands that record to the fight (condOf -> cond.hpCut, its own path); a wounded man walked into a fight was NOT checked this round.
