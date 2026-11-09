# THE PLACES GET THEIR USE (WORLD 14, 11/8-11/9; VAMILY rule 436(b), ask line 521; rules 409(c), 429(b)(h), 430, 438)

## HIS WORDS AND THE JOB
Paolo 11/5: "I want you to research every building type in Pocket City 2 and like the eight different genres that they have
buildings for and see if you're missing any of those buildings." Paolo 11/8: "Do more." The coordinator, rule 436(b): the lab the
beasts broke out of and the bank with its vault first, then the unemployment office and the hardware store; each a real Las Vegas
place at its real spot, each with a use (a job, a scavenge, a home base, a fight) and its fight answer in WORLD 13's table.

## MEASURED FIRST (rule 12: a premise, not a gate)
- WORLD TEN (11/6, records/BOHEMIA_WORLD_TEN_THE_MISSING_REAL_PLACES_11_6_26.md) had already SEATED all twelve places at their real
  spots (records/target/bb/real_places.json; the generator's __THE_MISSING_REAL_PLACES__ block), and its gate is green 16/0 on
  current main. So "build the places" was half done. What was missing was the USE, measured on the demo:
  - Each place opened the same settlement screen as any town. Its scavenge dealt the same six goods as a suburb
    (slices/BOHEMIA_SETTLEMENT_SCREEN.html scavenge() picks FIND evenly; BohemiaScavenge.findsOf, which serves the place's own
    finds, has no reader). The bank's vault, the lab's pens, the line round the office: words in a data file only.
  - THE LAB: on the region's land at its real spot (63,-2 on this boot's mirrored valley, 6.1 h on foot), but painted by the region
    as any fortress: its words matched none of vbRegionTrade's looks, so it stood as 'hilltown', houses behind a wall. A lab nobody
    could tell from a town.
  - The four places' fight answers: the bank, the jobs office and the home centres had rows (WORLD 13's table, by kind); the lab
    had none (it is not a valley kind).
  - The road (429(h)): every valley place fronts a road block of the valley's one road network on every one of 96 valleys (24
    seeds x the four turns); the valley's road is ONE joined body on all 96 (measured: the biggest joined body is 100% of road). The
    lab is off-road on the region and the region gives it a dirt track to the nearest road (BOH_REGION roadsOut: 5 tracks).

## WHAT WAS BUILT: EACH PLACE TALKS WHEN YOU ARRIVE (Battle Brothers' way of entering a location)
Battle Brothers: entering a location shows a picture, a few lines and Attack! / Leave. Ours: the person who is there talks (the
road's own mouth card, slices/bohemia_road_events.js card(): a face that talks, a receipt of words, two or three choices with a chip
saying what each costs), from records/target/bb/real_places.json 'visit' (the one list a modder edits; tools/bohemia_world14_place_visits_data.py
writes it, idempotent). slices/bohemia_place_visits.js (new, WORLD 14's) wraps loopOpenTown by name: on arrival, while a choice is
left there, the card comes first; WALK IN opens the place's settlement screen as before.

| place | who | the choices | what each does |
|---|---|---|---|
| TULE SPRINGS LAB | THE NIGHT TECH | OPEN PEN FOUR; READ THE BOARD BY THE DOOR; WALK IN | a fight with the lab's dire wolves (bohemia_enemies.json 'wolves', handed over as beasts, the game's own party size at two skulls): a win pays the freezers' coolant cells (6 batteries) and the pens' feed (3 food) and closes the pen; a loss costs 2 food and keeps it. The board: an hour, the tech reads what broke out and from which bones (the dire wolf from a 13,000-year-old tooth, gray wolf cells, twenty edits, dog mothers; the sloth from Gypsum Cave's dung), a post on the feed |
| THE BANK | THE LAST TELLER | DRILL THE SAFE DEPOSIT BOXES; RUN THE MEN OFF THE UPPER FLOORS; WALK IN | the boxes: eight hours on the clock, a 55% chance of 8 batteries, else 2; once. The upper floors: a fight with the squatters; a win pays 4 batteries and a crowbar; a loss costs 4. The teller says the rest: forty million in hundreds nobody wants, the vault's wind-up time lock that ran down at ten past four on a Friday |
| UNEMPLOYMENT OFFICE | THE LINE: NUMBER 211 to 215, a new man at the front every four days (a blackjack dealer, a roofer, a casino guard, a line cook, a cab driver; Battle Brothers backgrounds gambler, mason, retired_soldier, butcher, caravan_hand) | TAKE HIM ON (two nights of food); HAND OUT FOOD DOWN THE LINE (3 food, every 7 days); WALK IN | he joins the company (the road's own hire, bohemia.hired.v1, his name and trade); the food: the nearest town likes you more |
| HOME CENTER, EAST | THE NIGHT MANAGER | SEARCH THE BACK FOR WHAT THEY MISSED; RUN THE CREW OUT OF THE LUMBER AISLE; WALK IN | the back: four hours, 50% for 3 batteries and a crowbar, else 1 (a smoke detector's); once. The aisle: a fight; a win pays 2 batteries and a framing hammer |
| HOME CENTER, WEST | THE KEY CUTTER | HAVE HIM SHOW YOU THE RECEIVING DOCK; WALK IN | four hours, 60% for 3 batteries and a pipe wrench, else 1 |

So each has a use of the four the coordinator named: a FIGHT (the pens, the upper floors, the aisle), a SCAVENGE that is the
place's own (the boxes, the back room, the dock; the lab's coolant cells and feed), a HIRE that is the place's whole reason (the
line), and the lore you LEARN at the lab. Not a home base: none of these four is one (THE HOME BASE is rule 437(b)'s lane).

The rules of the card:
- A choice made is gone ('once'); a fight's choice is gone only when the fight is WON ('won'); some come back ('every_days'); the
  hire is per man in the line. With only WALK IN left the card never shows: the place opens like any town.
- Once a day at a place at most (once per man at the line), so a second arrival walks straight in (rule 433: nothing shows that is
  not a question; rule 398: a card with nothing to decide is no card).
- RULE 438 (never a silent button): a choice he cannot pay for is shown greyed with what it needs ('NEED 2 FOOD').
- A chance is rolled in the visit, its branch laid over the choice's own cost. MEASURED: the road's apply() returns at a chance
  and dropped the bank's eight hours (the clock did not move); now the clock moves 480 minutes.
- A SCRIPTED BROWSER IS NOT A PLAYER (CONTENT's rule): under automation the card shows only when a checker sets
  window.__PLACE_VISITS_ON, so the hundred gates that walk into towns are never stopped by a teller. On a phone it always talks.
- The people of the valley speak Spanglish; the player's choices are plain English (THE PLAYER DOES NOT SPEAK SPANGLISH, 9/21).
  Every word draft:true.
- Analog horror, one wrong thing at each: the lab's feeding clock 2,900 days late and LOOSE in the tech's own writing they do not
  remember; the bank's time lock stopped at 4:10 on a Friday; the office screen that has said NOW SERVING 211 for six years; the
  home centre's back-up battery playing the same eleven seconds of store music all night.

## THE LAB READS AS A LAB (rule 430: reuse first)
real_places.json the_lab 'region_trade': 'prison'. slices/bohemia_place_visits.js wraps vbRegionTrade so a region place may name the
region's own look it borrows; the lab is painted with the region's compound look (the test site's: long blind blocks and
containers behind a fence) instead of a hill town. Measured on the phone: a fenced yard of crates and long sheds. COOK FOUR's golden
piece (rule 408) is still owed: the pens in a row behind chain-link, the freezer house. Nothing of the region's file was edited.

## THE FIGHT ANSWERS (WORLD 13's table)
records/target/bb/map_fight_kinds.json now has a 'places' section (tools/bohemia_world14_place_fight_answers.py writes it; nothing
else of the file moves; WORLD 13's gate 13/0 with it): one row each for the lab, the bank, the office and the two home centres, in the
table's own fields plus 'kind' and 'where'. The four valley rows copy their kind's class, building and storeys (the gate holds them
equal) and say what is particular: the bank's vault under it, the strongest room in town, one door, no window, full cover and no shot
out; the office's line (people, never cover), the queue rails; the home centre's yard and pallets. The lab's row is its only answer:
a compound, one storey mostly (0.7), the freezer house two (0.3), in or on the roof, full cover, walls and the pens' chain-link (a
step, never a shot), half cover in the open, a dirt track in front. HOW A NEW KIND ENTERS (for WORLD 13, in handoffs/WORLD_FOURTEEN.md):
a valley place enters through real_places.json and WORLD TEN's sync (the seat block only); its fight answer is its kind's district row,
and a place that refines it adds a row under 'places'; the engine's sync does not carry 'places' yet, and the cut (429(a)) reads it
when it lands.

## THE GATE: THE PLACES GET THEIR USE (gates/the_places_get_their_use_gate.js, registered) 28/0
Node: U1 the five visits whole (a person in Spanglish, 2 or 3 choices in plain English, one WALK IN, each choice real and going, real
foes, weapons and backgrounds); U2 the four valley places at their real spots on 96 valleys (worst 6 blocks off); U3 each on the
valley's one road network on all 96 (384 of 384); U4 the lab on the region at its real coordinates (0.2 blocks off, 6.1 h on foot);
U5 the five fight rows; U6 planted fails 7 of 7 (no WALK IN, a foe nobody knows, a choice that does nothing, the player in
Spanglish, a place cut off from the network, the lab's row taken out, the bank's row against its kind). On the DEMO and on the ALPHA
(his link, rule 438), phone upright, each: U7 the card on arriving at all five; U8 WALK IN opens the screen; U9 the boxes: 480
minutes, 8 or 2 batteries, gone, the second arrival walks straight in; U10 the pens: the wolves as beasts (4 at two skulls), a loss
keeps the pen, a win pays 6 and 3 and closes it; U11 the line: NUMBER 211 joins as a gambler for 2 food, four days on NUMBER 212 and
the card again; U12 the back room pays; U12b a choice he cannot pay for says NEED 2 FOOD; U13 the lab painted as a compound, its dirt
track; U14 all 9 faces drawn; U15 the visits off or a scripted browser that did not ask: straight to the screen; U16 nothing threw.

A REAL WALK, said honestly: the tap on the office one block away (townTap -> meetWalk -> loopArrived -> loopOpenTown) shows the card
on the alpha. A tap four blocks away set the route and then cleared it with no step taken, in this harness, and the SAME happens on a
clean copy of main without this change: the long walk under automation is not reproduced here (the clock starts STOPPED until his
play button), so the gate drives the arrival through the map's own open, the way WORLD TEN's does.

## GATES RUN (rule 13: the pre-push pass, by name)
See the commit message for the numbers of the touched gates.

## NOT DONE, SAID PLAINLY
- The settlement screen's scavenge still deals the six goods evenly (RUN TWO's file; the NOTE stands since 11/6). The places' own
  finds now pay through their visits instead.
- No job on the board sends him to these places yet (the JOBS lane, rule 436(c), and WORLD 9's mix may read the ids).
- The rest of rule 409(c)'s list (the ranch and the greenhouse, the bus yard, the campground, the smaller ones) has no visit.
- COOK FOUR's golden pieces for the four (rule 408): today they wear their like-kind's art; the lab its borrowed compound.
- The numbers (batteries, food, chances, hours) are draft, TUNING's to read into the one table.

## SOURCES
Tule Springs' Ice Age fauna: nps.gov/tusk. The dire wolf from a 13,000-year-old tooth with gray wolf cells, twenty edits and dog
surrogates follows the real 2024-25 dire wolf de-extinction work (no company named in the game). Gypsum Cave's ground sloth dung:
Harrington's 1930 excavation. Bank vault time locks are mechanical clocks; a lock left unwound while closed stays shut. Nevada's 2020
unemployment lines. Hardware stores looted first in disasters: the generators, propane, chainsaws, batteries, plywood.
