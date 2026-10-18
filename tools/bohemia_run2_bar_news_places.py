#!/usr/bin/env python3
"""RUN TWO [the bar names the news], 10/18/26: THE PLACES THE BAR CAN NAME.

ECONOMY day 75 (records/BOHEMIA_ECONOMY_DAY_75_THE_RUMOUR_THE_NEXT_TOWN_HAS_NEWS_94_PERCENT_OF_THE_TIME_AND_THE_BAR_TELLS_NONE_10_18_26.md):
the next town has news 94 percent of the time and the bar has never told one, because the bar reads a fixed list and
no other town. The keeper can only name a town he knows is there, so this bakes the towns the map's loop actually
arrives at: the faction seats (slices/BOHEMIA_CITY_WORLD.html CT_BASES_BAKED on CT_BASES_SEED, the table loopTownAt
reads), each with where it is on the valley's 384 m cells and how a keeper says it ('over by the Mob', 'the Mob's
place'). The region's far towns (engine/BOHEMIA_REGION_LAND.json) are not settlements the loop opens yet, so they are
not named: a keeper who names a town you cannot travel to is the 'marked on your map' lie ECONOMY 3d found.
Custom (the player's own faction slot, 'no preset philosophy') is a place you can stand in, never a town the keeper
gossips about.

Same bytes every run. Run: python3 tools/bohemia_run2_bar_news_places.py
"""
import json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
OUT = os.path.join(ROOT, 'records/target/BOHEMIA_BAR_NEWS_PLACES.json')
REACH = 106   # ECONOMY day 75, 3b: Battle Brothers' named-item rumour reach, 30 of 140 tiles, scaled to the region's 496 cells
NEVER_TOLD = {'Custom': "the player's own faction slot (BOHEMIA_faction_graph.json: 'Player faction. No preset philosophy.')"}


def main():
    src = open(CITY, encoding='utf8').read()
    bases = json.loads(re.search(r'var CT_BASES_BAKED = (\{.*?\});', src).group(1))
    seed = re.search(r'var CT_BASES_SEED\s*=\s*"([^"]*)"', src).group(1)
    places = []
    for name in sorted(bases):
        b = bases[name]
        row = {'id': name, 'name': name, 'x': b['x'], 'y': b['y'],
               'at': 'over by the ' + name, 'of': 'the ' + name + ("' place" if name.endswith('s') else "'s place"), 'draft': True}
        if name in NEVER_TOLD:
            row['told'] = False
            row['why'] = NEVER_TOLD[name]
        places.append(row)
    out = {
        '_about': ("THE PLACES THE BAR CAN NAME (RUN TWO [the bar names the news], baked by tools/bohemia_run2_bar_news_places.py; "
                   "never edit by hand). The towns the map's loop arrives at: the faction seats on the valley's 384 m cells (x east, "
                   "y south), how a keeper says each one, and the reach a rumour carries. The news itself is never stored here: "
                   "slices/bohemia_bar_news.js reads each town's situation from the map's own dice (engine/bohemia_livingmap.js "
                   "traitsFor) and FACTIONS' raid ledger on the map's day, so what the keeper says is what you find when you get there."),
        'source': 'slices/BOHEMIA_CITY_WORLD.html CT_BASES_BAKED (seed "%s"), the table loopTownAt reads' % seed,
        'seed': seed,
        'cell_m': 384,
        'reach_cells': REACH,
        'reach_why': ("Battle Brothers' tavern names an item up to 30 tiles out on a 140-tile map (wiki 1931 Tavern Rumors); "
                      "scaled to the region's 496 cells that is 106 (ECONOMY day 75, 3b). Every valley seat is inside it, so "
                      "the keeper tells the nearest town with news first."),
        'draft': True,
        'places': places,
    }
    with open(OUT, 'w', encoding='utf8') as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
        f.write('\n')
    print(OUT, len(places), 'places')


if __name__ == '__main__':
    main()
