#!/usr/bin/env python3
"""THE BUS YARD AND THE GREENHOUSES (WORLD 14, 11/11; VAMILY rule 409(c), rule 440(c)'s list, the coordinator's round of 11/11).

The last two of rule 409's missing places, both INSIDE the valley, seated the way WORLD TEN seated the first ten: a row in
records/target/bb/real_places.json (the one list a modder edits) with its real spot and its seat in the valley's own grammar;
tools/bohemia_world_ten_real_places_sync.js then writes ONLY the DATA block of __THE_MISSING_REAL_PLACES__ in
engine/bohemia_overmap.js (WORLD 13's generator is otherwise untouched), and tools/bohemia_city_overmap_resync.py re-inlines it.
Both are kinds the map already has (WORLD 14's note to WORLD 13 in handoffs/WORLD_FOURTEEN.md, 11/9: no new kind enters the
DISTRICT list, no table needs a new row): the bus yard is a 'terminal' (the hall and the bays), the greenhouses a 'farm'.

Where each one really is (verified 11/9 and 11/11):
  THE BUS YARD: the RTC's Sunset Maintenance Facility, 5165 W Sunset Rd at Decatur Blvd, just north of the Beltway (opened 26
    August 2009, 36.6 acres, about 250 buses and 50 paratransit vans; Las Vegas Sun 2009-08-26, Stantec, a bid listing's address)
  THE GREENHOUSES: Urban Seed, 4770 Wynn Road, a few blocks west of the Strip (broke ground July 2016: high-tech greenhouses on a
    small plot in the middle of the city; Las Vegas Weekly 2016-08-02, NPR The Salt 2017-01-23)
The seat: the ten seated places' own lat/lon against their seats (about 240 blocks a degree east, y = 0.27 + 4.79 per degree
south of 36.1732), each to a block.

    python3 tools/bohemia_world14_valley_seats_data.py          write
    python3 tools/bohemia_world14_valley_seats_data.py --check  exit 1 if the file would change
"""
import json, re, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, 'records/target/bb/real_places.json')

ROWS = [
  {"id": "the_bus_yard", "kind": "terminal", "name": "THE BUS YARD", "where": "valley",
   "pocket_city": "bus depot",
   "lat": 36.0716, "lon": -115.2075,
   "latlon_from": "5165 W Sunset Rd at Decatur Blvd, north of the Beltway (to a block)",
   "real": ("The RTC's Sunset Maintenance Facility, 5165 West Sunset Road at Decatur Boulevard, just north of the Beltway: opened in "
            "August 2009 on 36.6 acres, room for about 250 buses and 50 paratransit vans, a maintenance building, a fuel island and a bus "
            "wash that recycles 98 percent of its water. In the collapse it is a fleet with no diesel: two hundred and fifty buses parked "
            "in rows, every one a wagon for twenty men if anybody finds the fuel"),
   "sources": ["https://lasvegassun.com/news/2009/aug/26/rtc-opens-new-bus-maintenance-facility/",
               "https://www.stantec.com/en/projects/united-states-projects/r/rtc-southern-nevada-sunset-bus-operations-maintenance"],
   "seat": {"x": {"from": "strip", "east": -9}, "y": {"of": 0.76}},
   "seat_why": "about 3.5 km west of the Strip at Decatur, on Sunset Road, the valley's south above the Beltway",
   "like": "terminal", "category": "infrastructure", "ground": "industrial", "tier": "camp",
   "use": {"screen": "a settlement screen on arrival: the yard boss and the mechanics who stayed under the maintenance roof",
           "caravan": "a bus is a faction's wagon: the battery banks in the dead buses, the mechanic who knows them",
           "scavenge": "the finds below"},
   "finds": [{"says": "A bus's battery bank, two of the four cells still holding. Heavy as a man.", "good": "battery"},
             {"says": "A roll of route-sign tape and a fare box nobody emptied. The coins are worth nothing. The tape is.", "good": "tape"}],
   "feed": {"who": "@route202", "txt": "the 202 hasnt run since the dollar died. all 250 of them are still parked at sunset and decatur. somebody washes them",
            "kind": "world", "draft": True},
   "licence": "a public agency's yard: the RTC's name is a real public body's, no mark of theirs is drawn"},
  {"id": "the_greenhouses", "kind": "farm", "name": "THE GREENHOUSES", "where": "valley",
   "pocket_city": "greenhouse",
   "lat": 36.0975, "lon": -115.1935,
   "latlon_from": "4770 Wynn Rd, west of the I-15 (to a block)",
   "real": ("Urban Seed's greenhouses at 4770 Wynn Road, a few blocks west of the Strip: in July 2016 it broke ground on a small plot in "
            "the middle of the city, high-tech greenhouses growing greens in towers on a fraction of a field's water. In the collapse it "
            "is the only food in the valley that grows under a roof, and it grows only while somebody keeps the fans and the pumps on"),
   "sources": ["https://lasvegasweekly.com/intersection/2016/aug/02/urban-seed-sustainable-farming-breaks-ground-vegas/",
               "https://www.npr.org/sections/thesalt/2017/01/23/509718598/farm-of-the-future-what-grows-in-las-vegas-stays-in-las-vegas"],
   "seat": {"x": {"from": "strip", "east": -5}, "y": {"of": 0.63}},
   "seat_why": "about 2 km west of the Strip on Wynn Road, south of Tropicana, among the warehouses",
   "like": "farm", "category": "commercial", "ground": "industrial", "tier": "camp",
   "use": {"screen": "a settlement screen on arrival: the grower and the towers of greens under the fans",
           "food": "greens for batteries, every few days; the greenhouse keeps a settlement fed",
           "scavenge": "the finds below"},
   "finds": [{"says": "A tray of seedlings somebody forgot to plant. They are still alive.", "good": "food"},
             {"says": "A pump's spare battery, wrapped in a garbage bag against the damp.", "good": "battery"}],
   "feed": {"who": "@wynnroadgreens", "txt": "the greenhouses on wynn still have lights at night. purple lights. you can see them from the 15",
            "kind": "world", "draft": True},
   "licence": "a real company's farm: its name stays off the map's art; the game calls it THE GREENHOUSES"},
]

# ---- 11/14 (rule 447's round): two more of the list's smaller ones, kinds the map already has ----
ROWS += [
  {"id": "the_cooling_center", "kind": "school", "name": "THE COOLING CENTER", "where": "valley",
   "pocket_city": "community center (the list's rec center: the real cooling stations)",
   "lat": 36.1162, "lon": -115.1392,
   "latlon_from": "Cambridge Recreation Center, 3930 Cambridge St, east of Maryland Pkwy between Flamingo and Twain (to a block)",
   "real": ("Clark County's Cambridge Recreation Center on Cambridge Street, one of the county's named cooling stations when an extreme "
            "heat warning is up: water, chairs, the gym's air conditioning. In the collapse it is the only cold room for a mile, on a "
            "generator that runs on whatever anybody brings it, and in August people sleep on the gym floor in rows"),
   "sources": ["https://www.fox5vegas.com/2026/07/03/clark-county-activates-cooling-stations-las-vegas-area-extreme-heat-risk-rises/"],
   "seat": {"x": {"from": "strip", "east": 7}, "y": {"of": 0.54}},
   "seat_why": "about 3 km east of the Strip near Maryland Parkway between Flamingo and Twain",
   "like": "school", "category": "civic", "ground": "suburb_block", "tier": "camp",
   "use": {"screen": "a settlement screen on arrival: the night aide, the gym of cots, the generator",
           "heat": "the summer's cold room: batteries keep the generator going, and the town hears who kept it",
           "scavenge": "the finds below"},
   "finds": [{"says": "A case of bottled water under the bleachers, the plastic gone soft in the heat. Still sealed.", "good": "food"},
             {"says": "The scoreboard's backup battery, behind a panel nobody opened in years.", "good": "battery"}],
   "feed": {"who": "@cambridgecots", "txt": "cambridge rec has cold air again tonight. bring a battery or bring a chair. no dogs. ok some dogs",
            "kind": "world", "draft": True},
   "licence": "a public building: the county's name is a real public body's, no mark of theirs is drawn"},
  {"id": "the_dome", "kind": "casino", "name": "THE DOME", "where": "valley",
   "pocket_city": "indoor amusement park",
   "lat": 36.1376, "lon": -115.1650,
   "latlon_from": "behind Circus Circus, 2880 Las Vegas Blvd S (to a block)",
   "real": ("The Adventuredome behind Circus Circus on the north Strip: opened in 1993, five acres of rides under a pink glass dome, "
            "the indoor amusement park of the list. In the collapse the glass still keeps the sun off, the coaster has its own battery "
            "room so a run could finish in a blackout, and the arcade's prize counter is full of tokens nobody can spend"),
   "sources": ["https://en.wikipedia.org/wiki/Adventuredome"],
   "seat": {"x": {"from": "strip", "east": 1}, "y": {"of": 0.44}},
   "seat_why": "behind Circus Circus on the north Strip, between the Strip and the I-15",
   "like": "casino", "category": "gaming_resort", "ground": "the_strip", "tier": "camp",
   "use": {"screen": "a settlement screen on arrival: the ride mechanic who stayed, the rides under the pink glass",
           "batteries": "the coaster's battery room, once", "scavenge": "the finds below"},
   "finds": [{"says": "A slot machine's backup battery behind a panel with a cartoon clown on it.", "good": "battery"},
             {"says": "A roll of tape from the arcade's prize counter, and a bucket of tokens nobody can spend.", "good": "tape"}],
   "feed": {"who": "@pinkdome", "txt": "the coaster under the pink dome ran again at 11. nobody on it. it always finishes the run",
            "kind": "world", "draft": True},
   "licence": "a real casino's park: the game calls it THE DOME; Circus Circus and Adventuredome names stay off the art"},
]

def row_text(r):
    t = json.dumps(r, indent=2, ensure_ascii=False)
    return '\n'.join('    ' + l for l in t.split('\n'))

def build(s):
    for r in ROWS:
        m = re.search(r'\n    \{\n      "id": "%s",' % re.escape(r['id']), s)
        if m:   # replace the row in place, keeping a visit the visits tool wrote
            start = m.start() + 1
            nxt = re.search(r'\n    \}(,\n    \{|\n  \])', s[start:])
            end = start + nxt.start() + len('\n    }')
            old = json.loads(s[start:end])
            new = dict(r)
            if 'visit' in old: new['visit'] = old['visit']
            s = s[:start] + row_text(new) + s[end:]
        else:   # after the last valley place, so the sync keeps the valley's rows together
            a = re.search(r'\n    \{\n      "id": "spring_mountain_ranch",', s)
            s = s[:a.start() + 1] + row_text(r) + ',\n' + s[a.start() + 1:]
    return s

if __name__ == '__main__':
    s0 = open(FILE, encoding='utf-8').read()
    s1 = build(s0)
    json.loads(s1)
    if '--check' in sys.argv:
        print('the two rows are ' + ('written' if s1 == s0 else 'NOT written')); sys.exit(0 if s1 == s0 else 1)
    open(FILE, 'w', encoding='utf-8').write(s1)
    print('wrote %d rows' % len(ROWS))
