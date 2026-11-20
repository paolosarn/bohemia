#!/usr/bin/env python3
"""THE PLACES ARE LAID OUT ON THE MAP (WORLD THIRTEEN 11/20, VAMILY rules 429(c), 461; ask line 504).

Rule 429(c): 'the 15 place boards' layouts are written INTO the world map at their places, so the map gets their good layouts and
the fight gets them back by being the map'. This tool copies each place board's terrain from the fight's own file
(slices/fight_ground/fight_ground.json boards place_<id>, never by hand) into records/target/bb/place_templates.json as 'terrain':
fifteen rows of twenty one-letter codes (. flat, , rough, ; debris, ~ water, ^ height, # blocked), and 'lay': how the map lays it
('built': a box; 'natural': a boulder or a mound; 'own': the map keeps its own layout, which is already the same kind of thing,
with 'lay_why'). tools/bohemia_world_thirteen_place_templates_sync.js then carries both into the generator word for word.

    python3 tools/bohemia_world_thirteen_place_layouts.py           write
    python3 tools/bohemia_world_thirteen_place_layouts.py --check   exit 1 if it would change anything
"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, 'records/target/bb/place_templates.json')
FG = os.path.join(ROOT, 'slices/fight_ground/fight_ground.json')
CODE = {'flat': '.', 'rough': ',', 'debris': ';', 'water': '~', 'height': '^', 'blocked': '#'}
LAY = {'lab': 'built', 'airport': 'built', 'works': 'built', 'marina': 'built', 'golf': 'built', 'shore': 'built',
       'redrock': 'natural', 'landfill': 'natural', 'desert': 'natural', 'pass': 'natural', 'wash': 'natural',
       'suburb': 'own', 'trailer': 'own', 'strip': 'own', 'downtown': 'own'}
WHY = {'suburb': 'the map already lays its houses on lots facing their streets, the models standing on them',
       'trailer': 'the map already lays its trailers in rows with a lane between, the models standing on them',
       'strip': 'the map already stands the resorts on the Boulevard, their marquees and drained pools',
       'downtown': 'the map already stands the old core\'s towers on their grid'}

def build(J, G):
    for k, t in J['templates'].items():
        b = G['boards'][t['board']]
        t['terrain'] = [''.join(CODE.get(x, '.') for x in row) for row in b['terrain']]
        t['lay'] = LAY[k]
        if k in WHY: t['lay_why'] = WHY[k]
        else: t.pop('lay_why', None)
    J['fields']['terrain'] = ("WORLD THIRTEEN 11/20 (tools/bohemia_world_thirteen_place_layouts.py writes it from the fight's own board, never "
        "by hand): the board's 15 rows of 20 tiles, . flat, , rough, ; debris, ~ water, ^ height, # blocked")
    J['fields']['lay'] = ("how the map lays the board at the place's cells (rule 429(c)): built, a box where the board blocks; natural, "
        "a boulder or a mound; own, the map's own layout, already the same kind of thing (lay_why says how)")
    return J

def main():
    s = open(FILE, encoding='utf8').read()
    J = build(json.loads(s), json.load(open(FG, encoding='utf8')))
    out = json.dumps(J, indent=1, ensure_ascii=False) + '\n'
    if '--check' in sys.argv:
        print('in step' if out == s else 'OUT OF STEP'); sys.exit(0 if out == s else 1)
    if out != s: open(FILE, 'w', encoding='utf8').write(out)
    print(('written' if out != s else 'already in step') + ': ' + ', '.join(k + ' ' + J['templates'][k]['lay'] for k in J['order']))

if __name__ == '__main__':
    main()
