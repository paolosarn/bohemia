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

LOOKS = {'the_lab': 'prison'}   # the region look a place borrows until COOK FOUR's golden piece (vbRegionTrade's own looks)

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
