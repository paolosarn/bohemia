#!/usr/bin/env python3
"""THE PLACES' FIGHT ANSWERS (WORLD 14, 11/8; VAMILY rules 436(b), 429(b), ask line 521).

Writes a "places" section into WORLD THIRTEEN's table, records/target/bb/map_fight_kinds.json: one row for each missing
place that has a visit (the lab, the bank, the jobs office, the two home centres), in the table's own fields (class, is,
building, storeys, man, cover, open_cover, blocks, street_front) plus 'kind' (the map kind it is, whose row it must agree
with) and 'where' (valley or region). The lab has no valley kind: it stands on the region's land, so this row is its only
fight answer. Nothing else of the file changes; the districts' rows are WORLD THIRTEEN's and are read, never written.
WORLD THIRTEEN's sync (tools/bohemia_world_thirteen_fight_kinds_sync.js) does not carry this section into the engine yet:
a note in handoffs/WORLD_FOURTEEN.md says how it enters when the cut (429(a)) lands.

    python3 tools/bohemia_world14_place_fight_answers.py          write
    python3 tools/bohemia_world14_place_fight_answers.py --check  exit 1 if the file would change
"""
import json, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, 'records/target/bb/map_fight_kinds.json')

ABOUT = ("THE PLACES' OWN ROWS (WORLD 14 11/8, VAMILY rule 436(b), ask line 521): the missing real places of "
         "records/target/bb/real_places.json that have a visit, each with its fight answer in this table's own fields; 'kind' is "
         "the map kind it stands on (its district row above must agree on class, building and storeys), 'where' valley or "
         "region. The lab is on the region's land, not a valley kind: this row is its only answer. Written by "
         "tools/bohemia_world14_place_fight_answers.py; gates/the_places_get_their_use_gate.js holds it. Words draft:true.")

def row(kind, where, is_, d, **over):
    r = {'kind': kind, 'where': where, 'is': is_}
    for f in ('class', 'building', 'storeys', 'man', 'cover', 'open_cover', 'blocks', 'street_front'):
        if f in over: r[f] = over[f]
        elif d and f in d: r[f] = d[f]
    for f in over:
        if f not in r: r[f] = over[f]
    return r

def build(J):
    D = J['districts']
    P = {
      'the_lab': row(None, 'region',
        "the lab on the fossil beds: one long block of labs and the freezer house, the pens in a row behind chain-link, the bone beds "
        "round it; a man goes in the labs (block walls, his cover) or up on the flat roofs (one storey mostly, the freezer house two); "
        "the pens' chain-link stops a step, never a shot", None,
        **{'class': 'roof', 'building': 'compound', 'storeys': {'1': 0.7, '2': 0.3}, 'man': 'in_or_roof', 'cover': 'full',
           'open_cover': 'half', 'blocks': ['walls', 'fence'], 'street_front': True,
           'picture': "the region paints it as any fortress (its trade reads 'hilltown': houses behind a wall); a compound of labs and pens is owed, COOK FOUR's golden piece (rule 408)"}),
      'the_bank': row('bank', 'valley',
        "the bank tower over its banking hall; under it the vault, the strongest room in town: one door, no window, a man inside has "
        "full cover and no shot out; the boxes room beside it; the paper in the cages stops nothing", D.get('bank')),
      'the_unemployment_office': row('jobsoffice', 'valley',
        "one low office block and the line round it: the men in the line are people, never cover; the queue rails and the parked "
        "cars along the line are the open ground's half cover", D.get('jobsoffice')),
      'the_home_center_east': row('hardware', 'valley',
        "the big box: one tall shed (a two-storey roof), the garden centre's fenced yard, the lumber canopy, pallets in the lot for "
        "half cover", D.get('hardware')),
      'the_home_center_west': row('hardware', 'valley',
        "the west side's big box, the same as the east's: the tall shed, the garden yard, the receiving dock at the back",
        D.get('hardware')),
      # ---- BATCH TWO (11/9, rule 440(c)) ----
      'clark_station': row('powerplant', 'valley',
        "the gas plant at Whitney: the turbine hall and the 1954 boiler house (tall, two and three storeys), the stacks, the switchyard "
        "behind its fence; the charging racks inside the hall; whoever is in the hall has full cover and the windows", D.get('powerplant')),
      'lenzie_station': row(None, 'region',
        "the big gas plant at Apex: three turbine halls in a row, the stacks with their red lights, the switchyard's fence and breakers in "
        "the open; a man goes in a hall or up on its roof (two storeys, the stack decks three); the switchyard is half cover", None,
        **{'class': 'roof', 'building': 'works', 'storeys': {'2': 0.6, '3': 0.4}, 'man': 'in_or_roof', 'cover': 'full', 'open_cover': 'half',
           'blocks': ['walls', 'fence'], 'street_front': True,
           'picture': "the region paints it as works (its land kind, industrial); the three halls and the stacks are COOK FOUR's golden piece"}),
      'shark_reef': row('aquarium', 'valley',
        "the resort over it and the aquarium under it: the tunnel under the big tank (a step through, glass both sides), the touch pool, the "
        "tank's open water stops a step; the casino floor above is the fight's ground", D.get('aquarium')),
      'the_animal_shelter': row('shelter', 'valley',
        "one storey of office and kennel runs behind chain-link: the runs stop a step, never a shot; the dogs that never left are in them",
        D.get('shelter')),
      'the_mob_museum': row('mobmuseum', 'valley',
        "the 1933 federal courthouse: three storeys of stone (the hearing room on the third), deep windows, the steps in front; the family's "
        "men inside have full cover and a shot down the street", D.get('mobmuseum')),
      'the_natural_history_museum': row('natmuseum', 'valley',
        "the museum's low halls by Cashman Field, the T. rex in the big hall under a high roof, the cases as half cover inside",
        D.get('natmuseum')),
      'the_tv_station': row('tvstation', 'valley',
        "Channel 8's low studios under the mast; the mast's fenced base and the satellite dishes in the lot (half cover)", D.get('tvstation')),
    }
    for k in P: P[k]['draft'] = True
    J['places'] = {'about': ABOUT, 'rows': P}
    return J

if __name__ == '__main__':
    s0 = open(FILE, encoding='utf-8').read()
    J = build(json.loads(s0))
    s1 = json.dumps(J, indent=1) + '\n'
    if '--check' in sys.argv:
        print('the places rows are ' + ('written' if s1 == s0 else 'NOT written')); sys.exit(0 if s1 == s0 else 1)
    open(FILE, 'w', encoding='utf-8').write(s1)
    print('wrote %d places rows' % len(J['places']['rows']))
