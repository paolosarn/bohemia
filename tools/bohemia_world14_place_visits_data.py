#!/usr/bin/env python3
"""THE PLACES' OWN VISITS (WORLD 14, 11/8; VAMILY rule 436(b), ask line 521; rule 409(c)).

Writes each missing place's VISIT into records/target/bb/real_places.json (the one list a modder edits): the person
you meet there, what they say, and two or three choices with real costs, Battle Brothers' way of entering a location
(a picture, a few lines, Attack! / Leave). The words are draft:true (the player speaks plain English, the people of the
valley speak Spanglish). Idempotent: re-running replaces each place's "visit" block in place and touches nothing else.

    python3 tools/bohemia_world14_place_visits_data.py          write
    python3 tools/bohemia_world14_place_visits_data.py --check  exit 1 if the file would change
"""
import json, re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, 'records/target/bb/real_places.json')

VISITS = {
  'the_lab': {
    'head': 'TULE SPRINGS LAB · THE FOSSIL BEDS',
    'who': {'name': 'THE NIGHT TECH', 'look': 'cast_apron', 'from': 'at the gate of TULE SPRINGS LAB'},
    'says': ("Payroll stopped, so I stopped going home. Nobody feeds them now, only me, and the feed ran out in the spring. "
             "Pen four still has the wolves. The big ones, from the tooth they dug out back. The doors ran on the grid, so now it's chain. "
             "Mira, the clock by the door still counts down to feeding time. It's late two thousand nine hundred days."),
    'opts': [
      {'id': 'pens', 't': 'Open pen four.', 'once': 'won',
       'fx': {'fight': {'foe': 'wolves', 'n': 'party', 'skulls': 2, 'label': 'the wolves of pen four',
                        'win': {'bats': 6, 'food': 3, 'flag': 'lab_pen_four',
                                'say': "The coolant cells off the freezers, six still holding. Feed pellets in the pens, three nights for the company. The tech chains pen four shut behind you. Out of habit, the tech says."},
                        'lose': {'food': -2, 'say': "You got out. The tech chains the door again and does not look at you. Something in pen four is eating your two nights of food."}}}},
      {'id': 'board', 't': 'Read the board by the door.', 'once': True,
       'fx': {'mins': 60, 'flag': 'lab_board_read',
              'say': ("Okay, the board. DIRE WOLF: a tooth, thirteen thousand years, gray wolf cells, twenty edits, dog mothers. CAMEL. HORSE. "
                      "AMERICAN LION. GROUND SLOTH: the dung in Gypsum Cave, dry for eleven thousand years. MAMMOTH: elephant mother. "
                      "Somebody wrote LOOSE next to every one. In my writing. I don't remember writing it."),
              'post': {'who': '@northedge', 'txt': "read the board at the tule springs lab. every animal on it says LOOSE. the wolves came off a tooth. a TOOTH"}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'the_bank': {
    'head': 'THE BANK · 300 SOUTH FOURTH',
    'who': {'name': 'THE LAST TELLER', 'look': 'cast_shortcoat', 'from': 'behind the counter of THE BANK'},
    'says': ("Welcome to the bank, jefe. Everything is still here. Forty million in hundreds, in the cages, and nobody wants it. People come look and they laugh. "
             "The big vault has a wind-up time lock and nobody wound it. It stopped at ten past four on a Friday and that door has not opened since. "
             "The boxes room was open when it stopped. Some men sleep upstairs. They burn the twenties to cook."),
    'opts': [
      {'id': 'boxes', 't': 'Drill the safe deposit boxes.', 'once': True,
       'fx': {'mins': 480, 'flag': 'bank_boxes',
              'chance': {'p': 0.55,
                         'yes': {'bats': 8, 'say': "Box 1140: a lantern and four batteries still in the plastic. Box 1188, the same. People kept the real money in the boxes."},
                         'no': {'bats': 2, 'say': "Most of them were open already. Somebody had the same idea first. Two batteries in a box full of letters."}}}},
      {'id': 'upstairs', 't': 'Run the men off the upper floors.', 'once': 'won',
       'fx': {'fight': {'foe': 'brigands', 'n': 'party', 'skulls': 1, 'label': 'the men on the upper floors',
                        'win': {'bats': 4, 'gear': 'crowbar', 'flag': 'bank_upstairs',
                                'say': "A stove on the fourth floor, fed with hundreds. Four batteries in a manager's desk and the crowbar they opened it with. The teller goes back to counting."},
                        'lose': {'bats': -4, 'say': "They threw you down the stairs and took four for the trouble. The teller never looked up."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'the_unemployment_office': {
    'head': 'UNEMPLOYMENT OFFICE · THE LINE',
    'every_days': 4,
    'who': {'name': '{name}', 'look': '{look}', 'from': 'in the line at the UNEMPLOYMENT OFFICE'},
    'says': '{says}',
    'line': [
      {'name': 'NUMBER 211', 'look': 'cast_poncho', 'bg': 'gambler',
       'says': "Eleven years I dealt blackjack. I been in this line every morning since the dollar went. Nobody is behind the window. The screen says NOW SERVING 211 and I am 211, so. You hiring, jefe? I count fast and I don't flinch.",
       'yes': "Two nights of food. That's more than the state ever paid me. Vámonos."},
      {'name': 'NUMBER 212', 'look': 'cast_widebrim', 'bg': 'mason',
       'says': "I did roofs. Tile, twenty summers on the tile. Hot work, jefe, I don't mind hot. They say this line is for work. Six years nobody came out that door. The screen still says 211. It always says 211.",
       'yes': "First job in six years. I'll carry whatever you got."},
      {'name': 'NUMBER 213', 'look': 'cast_shortcoat', 'bg': 'retired_soldier',
       'says': "Two tours, then fourteen years security on a casino floor. I know how to stand in one place, I been practicing in this line. Give me something that shoots, hermano, and a place to stand.",
       'yes': "Good. I was getting too good at standing."},
      {'name': 'NUMBER 214', 'look': 'cast_apron', 'bg': 'butcher',
       'says': "Line cook. I can make dinner out of nothing, and nothing is what everybody has now, verdad? I'll cook for the whole crew for one bowl of it.",
       'yes': "Show me the wagon. Whatever is in it, I can make it last."},
      {'name': 'NUMBER 215', 'look': 'cast_pack', 'bg': 'caravan_hand',
       'says': "I drove a cab on the Strip, then a truck out to Primm. Every road in this valley, I know which ones are still roads, te lo juro. The screen in there flickers at night. Still 211.",
       'yes': "Every road. You'll see. Vámonos."}],
    'opts': [
      {'id': 'hire', 't': 'Take him on. Two nights of food, up front.', 'need': {'food': 2}, 'per_man': True,
       'fx': {'food': -2, 'man': {'n': 1, 'name': '{name}', 'bg': '{bg}', 'look': '{look}'}, 'say': '{yes}'}},
      {'id': 'feed', 't': 'Hand out food down the line.', 'need': {'food': 3}, 'every_days': 7,
       'fx': {'food': -3, 'mood': {'act': 'favor', 'place': 'near'},
              'say': "Nobody pushes. They have been in line too long to push. Somebody at the back starts clapping, then stops."}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'the_home_center_east': {
    'head': 'HOME CENTER · EAST SIDE',
    'who': {'name': 'THE NIGHT MANAGER', 'look': 'cast_widebrim', 'from': 'in the garden centre of the HOME CENTER'},
    'says': ("Everything with a plug went the first week, jefe. The generators, the propane, the chainsaws, the batteries off the end caps. "
             "Then the plywood for the windows, then the wire. What's left is paint and doorknobs. A crew sleeps in the lumber aisle now. "
             "Listen. The music. The back-up battery still plays it, the same eleven seconds, all night."),
    'opts': [
      {'id': 'back', 't': 'Search the back for what they missed.', 'once': True,
       'fx': {'mins': 240, 'flag': 'home_center_east_back',
              'chance': {'p': 0.5,
                         'yes': {'bats': 3, 'gear': 'crowbar', 'say': "Behind the returns desk: a crowbar still on its card and three lantern batteries in a return nobody ever processed."},
                         'no': {'bats': 1, 'say': "One battery, out of a smoke detector. Everybody forgets the smoke detectors."}}}},
      {'id': 'aisle', 't': 'Run the crew out of the lumber aisle.', 'once': 'won',
       'fx': {'fight': {'foe': 'brigands', 'n': 'party', 'skulls': 1, 'label': 'the crew in the lumber aisle',
                        'win': {'bats': 2, 'gear': 'framing_hammer', 'flag': 'home_center_east_aisle',
                                'say': "They had the last framing hammer in the store and two batteries. The manager folds their blankets and puts them out on the curb."},
                        'lose': {'say': "They know the aisles better than you. The music kept playing the whole time."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'the_home_center_west': {
    'head': 'HOME CENTER · WEST SIDE',
    'who': {'name': 'THE KEY CUTTER', 'look': 'cast_satchel', 'from': 'at the key counter of the HOME CENTER'},
    'says': ("Thirty years I cut keys here. Nobody needs a key now, everything is open. Mira, all open. "
             "The west side went slower than the east. There's still some in receiving, if you know where the dock door is. I know where it is."),
    'opts': [
      {'id': 'dock', 't': 'Have him show you the receiving dock.', 'once': True,
       'fx': {'mins': 240, 'flag': 'home_center_west_dock',
              'chance': {'p': 0.6,
                         'yes': {'bats': 3, 'gear': 'pipe_wrench', 'say': "A pallet nobody unwrapped. A pipe wrench and three batteries in the shrink wrap. He cuts you a key for the dock door. Habit."},
                         'no': {'bats': 1, 'say': "Somebody found the dock first. One battery in a forklift's dash."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  # ---- BATCH TWO (11/9, rule 440(c)): the seven WORLD TEN seated, given their people ----
  'clark_station': {
    'head': 'CLARK STATION · THE MINT',
    'who': {'name': 'THE LAST OPERATOR', 'look': 'cast_shortcoat', 'from': 'in the control room of CLARK STATION'},
    'says': ("The gas stopped coming down the pipe the year the dollar went, jefe. Nineteen units, and one still turns: they cut a hatch in the old "
             "1954 boiler and feed it pallets and tires. That one unit charges every battery on this side of the valley. Whoever holds this plant "
             "prints the money. Listen. The control room still calls out the load every hour. Nobody here is reading it."),
    'opts': [
      {'id': 'charge', 't': 'Pay the boiler crew to charge your batteries.', 'need': {'food': 3}, 'every_days': 3,
       'fx': {'food': -3, 'bats': 6, 'mins': 120,
              'say': "Three nights of food for the crew, and two hours on the bus bar. Six batteries come off the rack warm. The load call says the same number it always says."}},
      {'id': 'guards', 't': 'Take the racks from the men who hold the plant.', 'once': 'won',
       'fx': {'fight': {'foe': 'brigands', 'n': 'party', 'skulls': 2, 'label': 'the men who hold the plant',
                        'win': {'bats': 12, 'flag': 'clark_racks',
                                'say': "Their charging racks, twelve batteries full. The operator keeps feeding the boiler. Somebody always holds the mint, he says; today it was you."},
                        'lose': {'bats': -6, 'say': "They held. Six of yours went on their rack before you got out the gate."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'lenzie_station': {
    'head': 'LENZIE STATION · APEX',
    'who': {'name': 'THE TURBINE WATCHER', 'look': 'faction_remnants', 'from': 'under the stacks of LENZIE STATION'},
    'says': ("Three turbines and not one cubic foot of gas, hermano. The pipe is dry since the dollar. Once a week I turn the shafts by hand so the "
             "bearings don't seize, because the day the gas comes back, whoever has a turbine that turns owns the whole valley. The stacks still have "
             "their lights. Red, every night, for airplanes that don't come."),
    'opts': [
      {'id': 'battery_room', 't': 'Strip the station battery room.', 'once': True,
       'fx': {'mins': 240, 'flag': 'lenzie_battery_room',
              'chance': {'p': 0.5,
                         'yes': {'bats': 10, 'say': "The plant kept a whole room of batteries to start the turbines with no grid. Ten still hold. The watcher says that was the only way to ever start them again."},
                         'no': {'bats': 4, 'say': "Most of the room was dead, the acid gone to crust. Four still hold."}}}},
      {'id': 'switchyard', 't': 'Run the scrappers out of the switchyard.', 'once': 'won',
       'fx': {'fight': {'foe': 'brigands', 'n': 'party', 'skulls': 2, 'label': 'the scrappers in the switchyard',
                        'win': {'bats': 6, 'gear': 'pickaxe', 'flag': 'lenzie_switchyard',
                                'say': "Six batteries in their truck and the pick they were pulling copper with. The watcher counts the breakers they left. Most of them."},
                        'lose': {'say': "They kept the switchyard. The copper goes out on their truck to somebody who pays."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'shark_reef': {
    'head': 'SHARK REEF · UNDER THE RESORT',
    'who': {'name': 'THE AQUARIST', 'look': 'cast_skirt', 'from': 'at the top of the stairs to SHARK REEF'},
    'says': ("Nobody fed the big tank since the power went, jefe. Fifteen kinds of shark, the rays, the sawfish. Now there are four sharks and they "
             "are very big. The tunnel under the tank still holds. Some nights the emergency lights come on by themselves and you can see them "
             "going round and round over your head. The glass is not my problem. The glass is what holds."),
    'opts': [
      {'id': 'tunnel', 't': 'Go through the tunnel to the gift shop.', 'once': True,
       'fx': {'mins': 120, 'flag': 'reef_tunnel',
              'chance': {'p': 0.6,
                         'yes': {'bats': 4, 'food': 2, 'say': "The gift shop on the far side: flashlights still boxed, four good batteries, and a shelf of candy. Over your head, the whole way, something kept pace."},
                         'no': {'bats': 1, 'say': "Somebody cleared the gift shop first. One battery in a toy shark. Over your head, the whole way, something kept pace."}}}},
      {'id': 'fish', 't': 'Fish the touch pool and the big tank.', 'every_days': 5,
       'fx': {'mins': 180,
              'chance': {'p': 0.7,
                         'yes': {'food': 4, 'say': "Two rays and a grouper off the top of the big tank, four nights of food. The sharks watched the line the whole time."},
                         'no': {'food': 1, 'gear': -1, 'say': "Something took the net and whatever you were holding it with. One small fish from the touch pool."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'the_animal_shelter': {
    'head': 'ANIMAL SHELTER · MOJAVE ROAD',
    'who': {'name': 'THE KENNEL KEEPER', 'look': 'cast_bedroll', 'from': 'in the kennel runs of the ANIMAL SHELTER'},
    'says': ("When the staff stopped coming I opened every kennel, so they would have a chance. Most of them went to the washes, those are your wild "
             "dogs now. Some came back. These ones never left, and I feed them what I find. Mira, the brindle one. He picks people. Tonight he is "
             "sitting by your boots. The intake bell still rings at nine every morning. There is nobody at the door."),
    'opts': [
      {'id': 'keeper', 't': 'Take the keeper and the brindle dog with you.', 'need': {'food': 2}, 'once': True,
       'fx': {'food': -2, 'man': {'n': 1, 'name': 'THE KENNEL KEEPER', 'bg': 'houndmaster', 'look': 'cast_bedroll'},
              'say': "Okay. The brindle comes, and I come with the brindle. The others know where the food is now. Two nights of food for the road, sí."}},
      {'id': 'feed', 't': 'Leave food for the dogs.', 'need': {'food': 2}, 'every_days': 7,
       'fx': {'food': -2, 'mood': {'act': 'favor', 'place': 'near'},
              'say': "The dogs eat in a row, oldest first. People on Mojave Road hear a crew fed the shelter dogs."}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'the_mob_museum': {
    'head': 'THE MOB MUSEUM · 300 STEWART',
    'who': {'name': 'THE DOCENT', 'look': 'faction_mob', 'from': 'on the courthouse steps of THE MOB MUSEUM'},
    'says': ("Welcome to the museum, my friend. The family keeps it now. It's ours, it was always ours. The chair is downstairs, the wall from "
             "Chicago with the bullet holes. The tour is free. What you do after the tour, that has a price. Ask me about the Kefauver room. "
             "Everybody who testified in there is dead now, every single one, so the room is very quiet, sabes."),
    'opts': [
      {'id': 'tour', 't': 'Take the tour.', 'once': True,
       'fx': {'mins': 60, 'flag': 'mob_tour', 'mood': {'act': 'favor', 'place': 'faction:mob'},
              'say': "The chair, the wall, the hearing room. At the end the docent writes your company's name in a ledger. He says it is the guest book."}},
      {'id': 'debt', 't': 'Collect a debt for the family.', 'once': 'won',
       'fx': {'fight': {'foe': 'brigands', 'n': 'party', 'skulls': 1, 'label': 'the men who owe the family',
                        'win': {'bats': 10, 'mood': {'act': 'favor', 'place': 'faction:mob'}, 'flag': 'mob_debt',
                                'say': "Ten batteries, counted twice on the courthouse steps. The family remembers who collects."},
                        'lose': {'mood': {'act': 'negotiation_fail', 'place': 'faction:mob'}, 'say': "They did not pay, and now the family has two debts to collect."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'the_natural_history_museum': {
    'head': 'NATURAL HISTORY MUSEUM · BY CASHMAN FIELD',
    'who': {'name': 'THE KEEPER OF THE BONES', 'look': 'cast_cape', 'from': 'under the T. rex at the NATURAL HISTORY MUSEUM'},
    'says': ("The lab people came here first, before the fossil beds. They took samples from everything: the mammoth tooth, the sloth hair in the "
             "case, the camel. They did not take the T. rex. You can't, mano, the DNA is gone after a million years. That's chemistry, not money. "
             "So he is the one thing in this valley that is never coming back. Some nights his motor still roars on the backup battery."),
    'opts': [
      {'id': 'cases', 't': 'Read the cases with the keeper.', 'once': True,
       'fx': {'mins': 60, 'flag': 'museum_cases',
              'say': ("Here is the rule they worked by. Ice Age and after, a million years at the most, from frozen ground and dry caves. A living "
                      "animal the right size to carry the baby. The wolf had a dog, the mammoth an elephant. The T. rex has nothing. Anybody who "
                      "tells you they saw a dinosaur is lying to you."),
              'post': {'who': '@cashmanfield', 'txt': "the bone man at the museum says the labs could only bring back ice age stuff. nothing older than a million years. so whatever is in the washes is old but not THAT old"}}},
      {'id': 'battery', 't': 'Pull the backup battery out of the T. rex.', 'once': True,
       'fx': {'mins': 60, 'bats': 5, 'flag': 'museum_rex_battery',
              'say': "Five batteries out of the T. rex's backup bank. The keeper does not watch. That night, for the first time, the roaring stops."}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'the_tv_station': {
    'head': 'CHANNEL 8 · DESERT INN',
    'who': {'name': 'THE NIGHT PRODUCER', 'look': 'faction_network', 'from': 'in the newsroom of CHANNEL 8'},
    'says': ("We're still on the air, jefe. Thursdays, if the generator starts. Nobody has a TV, so we put the picture on the mast, the lights, and "
             "people read it from across the valley. Mostly we read the names of who is missing. Sometimes the camera in studio B comes on by "
             "itself and there is somebody at the desk we don't know."),
    'opts': [
      {'id': 'air', 't': 'Buy a minute on the air for your company.', 'need': {'bats': 5}, 'every_days': 7,
       'fx': {'bats': -5, 'mood': {'act': 'favor', 'place': 'near'},
              'say': "One minute on the mast, Thursday: your company's name and that you take work. People three towns over read it in the lights.",
              'post': {'who': '@channel8', 'txt': "ON 8 THURSDAY: a crew with batteries came in and bought a minute. they say they take work. the names of the missing after"}}},
      {'id': 'studio_b', 't': 'Search studio B.', 'once': True,
       'fx': {'mins': 60, 'flag': 'channel8_studio_b',
              'chance': {'p': 0.5,
                         'yes': {'bats': 4, 'say': "The camera's battery packs, four of them, charged. Nobody at the desk. The red light on the camera stays on after you take its battery."},
                         'no': {'bats': 1, 'say': "One pack. The chair at the anchor desk was warm."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  # ---- BATCH THREE (11/9, rule 440(c)): the two on the region's real land ----
  'spring_mountain_ranch': {
    'head': 'SPRING MOUNTAIN RANCH · RED ROCK',
    'who': {'name': 'THE FOREMAN', 'look': 'cast_barearms', 'from': 'at the corrals of SPRING MOUNTAIN RANCH'},
    'says': ("Forty head left, jefe, out of four hundred. The springs still run, that is the only reason we are alive. Everybody in the valley "
             "wants beef and nobody wants to herd. The rustlers come down from Blue Diamond on the full moon. Mira, the old ranch house, the "
             "Hughes house. The phone in there still rings sometimes. The line has been cut since before I came."),
    'opts': [
      {'id': 'beef', 't': 'Buy a side of beef.', 'need': {'bats': 6}, 'every_days': 4,
       'fx': {'bats': -6, 'food': 6, 'say': "A side of beef, salted, six nights for the company. Six batteries in the foreman's coffee can. One a night, he says, same as the stall."}},
      {'id': 'rustlers', 't': 'Stand guard against the rustlers tonight.', 'once': 'won',
       'fx': {'fight': {'foe': 'brigands', 'n': 'party', 'skulls': 1, 'label': 'the rustlers from Blue Diamond',
                        'win': {'food': 4, 'bats': 4, 'mood': {'act': 'favor', 'place': 'near'}, 'flag': 'ranch_rustlers',
                                'say': "The rustlers ran for the hills without the herd. The foreman pays in beef and batteries and tells the ranches up the road."},
                        'lose': {'food': -2, 'say': "They took six head and two nights of your food off the wagon. The foreman counts the herd again."}}}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
  'callville_bay': {
    'head': 'CALLVILLE BAY · LAKE MEAD',
    'who': {'name': 'THE HARBORMASTER', 'look': 'cast_poncho', 'from': 'on the dock at CALLVILLE BAY'},
    'says': ("Forty motorhomes and not one with gas, hermano. Nobody here is going anywhere, so we fish. The lake went down a hundred feet, the "
             "marina sits on the mud like a dead boat. Every winter the roaming people come in off the roads and stay till spring. Oye, the "
             "camp host's sign still says THREE NIGHT LIMIT. Some of us have been here eleven years."),
    'opts': [
      {'id': 'bass', 't': 'Trade batteries for dried bass.', 'need': {'bats': 4}, 'every_days': 4,
       'fx': {'bats': -4, 'food': 5, 'say': "Five nights of striped bass, dried on a line between two motorhomes. Fish is cheaper than beef out here. Everybody has a rod."}},
      {'id': 'site31', 't': 'Take on the man from site 31.', 'need': {'food': 2}, 'once': True,
       'fx': {'food': -2, 'man': {'n': 1, 'name': 'SITE 31', 'bg': 'fisherman', 'look': 'cast_poncho'},
              'say': "Eleven years on site 31. I know every road to every water there is. Two nights of food and I'm yours, sí."}},
      {'id': 'in', 't': 'Walk in.', 'in': True}]},
}

ABOUT = ("THE VISIT (WORLD 14 11/8, VAMILY rule 436(b), ask line 521): Battle Brothers' way of entering a location, a picture, a few "
         "lines, two or three choices. 'who' talks (a face from engine/bohemia_crew_faces.js, the road's own card, slices/bohemia_road_events.js), "
         "'says' is their line, each of 'opts' is a choice: 't' the words on the button, 'need' what it asks you to have (food, bats, men), "
         "'fx' what it does in the road's own words (bats, food, gear, man, mood, mins, flag, chance, say; 'fight' is a fight here: foe "
         "a faction of records/target/bb/bohemia_enemies.json or brigands, n a number or 'party' (the game's own party math), skulls, label, "
         "win and lose; 'post' a line on the feed), 'once' true (gone once chosen) or 'won' (gone once the fight is won), 'every_days' "
         "(back after that many days), 'in' true (walk in: the place's settlement screen). 'line' is a queue: the next one at the front "
         "every 'every_days', '{name}' '{says}' '{look}' '{bg}' '{yes}' read from him. The card shows on arriving while a choice is left; "
         "with only 'Walk in.' left it never shows. slices/bohemia_place_visits.js reads this.")

def visit_text(v):
    t = json.dumps(dict(v, draft=True), indent=2, ensure_ascii=False)
    return '\n'.join(('      ' + l) if i else l for i, l in enumerate(t.split('\n')))

LOOKS = {'the_lab': 'prison'}   # the ranch and the campground carry theirs in their own entries (11/9)   # the region look a place borrows until COOK FOUR's golden piece (vbRegionTrade's own looks)

def build(s):
    for pid, tr in LOOKS.items():
        m = re.search(r'\n    \{\n      "id": "%s",' % re.escape(pid), s)
        seg = s[m.start():]
        if '"region_trade"' not in seg.split('"visit"')[0]:
            k = seg.index('\n      "what": ')
            ins = '\n      "region_trade": "%s",\n      "region_trade_why": "the region paints a place from its words and the lab\'s matched nothing (a hill town, houses behind a wall); it borrows the region\'s own compound look, long blind blocks and containers behind a fence, until COOK FOUR\'s golden piece (rule 408)",' % tr
            s = s[:m.start() + k] + ins + s[m.start() + k:]
    for pid, v in VISITS.items():
        m = re.search(r'\n    \{\n      "id": "%s",' % re.escape(pid), s)
        if not m: raise SystemExit('no place ' + pid)
        start = m.start()
        nxt = re.search(r'\n    \}(,\n    \{|\n  \])', s[start:])
        end = start + nxt.start()
        body = s[start:end]
        body = re.sub(r',\n      "visit": \{[\s\S]*$', '', body) if '"visit":' in body else body
        body = body + ',\n      "visit": ' + visit_text(v)
        s = s[:start] + body + s[end:]
    if '"visit_about"' not in s:
        s = s.replace('\n  "places": [', '\n  "visit_about": ' + json.dumps(ABOUT, ensure_ascii=False) + ',\n  "places": [', 1)
    return s

if __name__ == '__main__':
    s0 = open(FILE, encoding='utf-8').read()
    s1 = build(s0)
    json.loads(s1)
    if '--check' in sys.argv:
        print('the visits are ' + ('written' if s1 == s0 else 'NOT written')); sys.exit(0 if s1 == s0 else 1)
    open(FILE, 'w', encoding='utf-8').write(s1)
    print('wrote %d visits' % len(VISITS))
