#!/usr/bin/env python3
"""ECONOMY [the mayor arc, researched] 10/25 -- the building catalog for rebuilding Bohemia over three acts.

A research calculator, not a gate and not game data (rule 161: research first, nothing built; rule 88: no data
file the game reads). It holds the thirty-one building kinds and five grand works of
records/BOHEMIA_ECONOMY_DAY_81_THE_MAYOR_ARC_YOU_PAY_FOR_THE_CORE_AND_THE_PEOPLE_BUILD_THE_CITY_10_25_26.md,
works every price from ONE formula, writes the draft bank, and prints the page's tables so the page and the bank
can never disagree.

  THE HAND-DAY   one day of one labourer's work: a wage of 1 battery (Battle Brothers' daytaler 6 crowns, mason 8,
                 at his ten to one, GROK_34) + 1 food + 1 water at the ration counter (Day 72) = 3 batteries.
  TAPE           the materials line (rule 47's repair stack; his 7/28 icon: a hammer and duct tape), about 2
                 batteries a point at the counter (Battle Brothers' tools 200 crowns a stack, GROK_31; DRAFT).
  PARTS          what nobody can salvage by hand and you buy whole: a pump head, panels, a press. Batteries.
  HIRED PRICE    3 x hands + 2 x tape + parts: what it costs if every hand is hired.
  OWN HANDS      2 x tape + parts: what it costs when your crew or the people put in the days (they eat anyway).
  DAYS           calendar days on the map clock; the building rises while the company is out.

Every number is DRAFT for TUNING's one table (rule 117: easier than Battle Brothers). The real anchors each row
names are in section 3 of the page, with their sources.

  python3 tools/bohemia_economy_the_mayor_arc_catalog.py            # prints the tables
  python3 tools/bohemia_economy_the_mayor_arc_catalog.py --bank     # also rewrites the draft bank
"""
import json, os, sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
BANK = 'banks/BOHEMIA_ECONOMY_THE_MAYOR_ARC_BUILDINGS_10_25_26.json'
HAND, TAPE = 3, 2

# rung: 1 YOUR GROUND, 2 THE CITY BACKS YOU, 3 THE HOUSE (the pseudo-mayor, 6/30)
# today: the id in engine/bohemia_lotbuild.js's CATALOG when the kind is already built (THIN), else None
# gives: (for the company, for the people, for the money); makes: the one thing it produces (7/26: house or make one)
B = [
  # ---- WATER ----
  dict(id='tank', name='WATER TANK', need='water', today='tank', act=1, rung=1, hands=2, tape=2, parts=0, days=1,
       makes='water: catches and keeps it clean',
       gives=('water you do not buy at the counter', 'a lid on the block\'s water', 'cuts the water bill'),
       look=('a rusted IBC tote on pallets, a tarp lid weighted with tyres', 'a riveted steel tank on a timber stand, patched and whitewashed', 'a clean poly tank, a meter, a gutter run off every roof'),
       real='rainwater tanks; no single price used'),
  dict(id='pump', name='PUMP HOUSE OVER A WELL', need='water', today='pump', act=1, rung=1, hands=8, tape=4, parts=6, days=4,
       makes='water: lifted every day',
       gives=('the crew drinks free at home', 'the block drinks', 'ends the counter\'s water bill (Day 77: the record\'s biggest poverty premium is water bought by the jug)'),
       look=('a cinderblock hut, a hand-pump handle out of a slot, a green-grey hose, a dented bucket', 'a pump shed with a wind-driven lift and a tin roof', 'an electric pump house, a lit panel, a queue that is not there any more'),
       real='hand-pump borehole $3,100 to $3,400, 222 to 1,080 people'),
  dict(id='standpipe', name='STANDPIPE', need='water', today=None, act=1, rung=2, hands=6, tape=4, parts=8, days=3,
       makes='water: sold to the block at your price',
       gives=('a choice every week: fair price for standing, steep price for batteries', 'water without a walk', 'a slow income, or clout'),
       look=('a galvanised pipe out of the rubble, one tap, a chalked price, a jerrycan line', 'three taps on a concrete apron, a painted price board', 'a metered kiosk with a light'),
       real='water kiosks; Day 77: vendor water 5 to 10 times the pipe (UNDP 2006)'),
  dict(id='tower', name='WATER TOWER AND PIPES', need='water', today=None, act=2, rung=2, hands=60, tape=40, parts=80, days=30, knows='a mason or a pipe man',
       makes='water: to every house on the block',
       gives=('the base can house twice the people', 'water in the house, not at the tap', 'the block grows (section 6)'),
       look=('(not in act one)', 'a salvaged tank lifted on a steel frame, rust under fresh primer', 'a painted tower with the block\'s mark, lit at night'),
       real='Warsaw-style rebuilding of mains; scaled from the borehole'),
  # ---- FOOD ----
  dict(id='garden', name='GARDEN BED', need='food', today='garden', act=1, rung=1, hands=2, tape=1, parts=0, days=1,
       makes='food: slowly',
       gives=('a little food a week', 'something growing', 'cuts the food bill a little'),
       look=('a raised bed of pallets and car tyres, dusty kale, a bucket', 'beds in rows, shade cloth, drip lines', 'a green yard, the first green in the valley (rule 159: green waits for act three)'),
       real='Havana 1995: 25,000 family plots grew most of the city\'s vegetables'),
  dict(id='plots', name='THE ALLOTMENTS', need='food', today=None, act=1, rung=2, hands=6, tape=4, parts=6, days=3,
       makes='food: the people plant it, you get a share',
       gives=('food for the crew from other people\'s work', 'the families feed themselves', 'the block stops buying food'),
       look=('a fenced empty lot, wire and old doors for a fence, ten small dug squares', 'plots with names on sticks, a shared hose, a shade tarp', 'a community farm with a painted gate'),
       real='Havana\'s allotments; Alamar organoponico 300 t a year, 180 members'),
  dict(id='cool', name='COOL ROOM', need='food', today=None, act=1, rung=1, hands=6, tape=3, parts=0, days=3,
       makes='keeps food: spoils slower at home',
       gives=('food bought cheap keeps (Battle Brothers: food spoils)', 'nothing rots', 'buy in bulk, pay less'),
       look=('a half-buried room, wet sacking over the door, clay pots in sand', 'an insulated container under earth, a solar fan', 'a cold store with a humming compressor'),
       real='evaporative coolers (clay-pot fridges); no price used'),
  dict(id='farm', name='GREENHOUSE FARM', need='food', today=None, act=2, rung=2, hands=40, tape=30, parts=60, days=20,
       makes='food: a lot, all year',
       gives=('food for a big company', 'work for ten families', 'food becomes cheap at your base and the next town over'),
       look=('(not in act one)', 'a long tunnel of salvaged poly over steel hoops, patched with tape', 'glass houses with grow lights, the first real green'),
       real='Havana\'s organoponicos'),
  # ---- POWER ----
  dict(id='solar', name='SOLAR RACK', need='power', today='solar', act=1, rung=1, hands=2, tape=2, parts=24, days=2,
       makes='batteries: one a day (the bought way)',
       gives=('money that comes in while you are out', 'a lit room', 'pays itself back in about a month'),
       look=('three cracked panels on a pallet frame, cables taped to a car battery', 'a tidy rack, a charge board, labelled cells', 'a clean array on every roof'),
       real='a family solar kit $150 to $217 (UN-Habitat 2014; M-Kopa 2016), paid back in about a year against kerosene'),
  dict(id='wind', name='SCRAP WIND RIG', need='power', today=None, act=1, rung=1, hands=6, tape=5, parts=4, days=5,
       makes='batteries: one a day (the scrap way)',
       gives=('the same money as the rack, paid in hands and tape instead of batteries', 'a light on the street', 'a choice: buy power or build it'),
       look=('a bicycle hub and pipe blades on a bent mast, a car battery in a crate', 'a three-blade rig on a guyed tower', 'a quiet turbine with a light on top'),
       real='William Kamkwamba\'s 5 m windmill from a bicycle, a tractor fan and blue gum poles: four bulbs and phone charging'),
  dict(id='grid', name='THE BLOCK GRID', need='power', today=None, act=2, rung=2, hands=80, tape=60, parts=600, days=45, knows='an electrician',
       makes='light: every house on the block lit',
       gives=('the base\'s nights are safe (the dark is where raids come from)', 'light in every house', 'the block\'s works run at night'),
       look=('(not in act one)', 'a shipping container of cells and inverters, wires on poles strung house to house', 'buried cable and street lamps that work'),
       real='solar-hybrid mini-grid about $3,900 a kW (ESMAP 2022)'),
  # ---- SHELTER ----
  dict(id='roof', name='ROOF ON A DEAD HOUSE', need='shelter', today='roof', act=1, rung=1, hands=10, tape=8, parts=0, days=5,
       makes='a household: a family moves in',
       gives=('hands: the family works your lots', 'a home', 'the first clout, the start of the people building'),
       look=('a gutted stucco house, a blue-grey tarp roof, plywood windows, laundry', 'a patched tin roof, a door that closes, a painted step', 'a whole house, a garden, a light'),
       real='Detroit: a demolition $10,000 to $16,000; putting a roof back is cheaper than tearing down'),
  dict(id='half', name='THE HALF HOUSE', need='shelter', today=None, act=1, rung=2, hands=20, tape=16, parts=10, days=10,
       makes='a household: you build the core, the family builds the rest',
       gives=('hands and a name', 'a family that doubles its own house', 'the people\'s labour, not your batteries, finishes the city'),
       look=('a concrete core with a wet room and a stair, the other half an empty frame', 'the frame filled in, each half different (their choice)', 'a full row, no two alike'),
       real='Quinta Monroy: $7,500 for land, services and a 30 m2 core; families doubled it themselves inside two years'),
  dict(id='bunk', name='BUNKHOUSE', need='shelter', today=None, act=1, rung=1, hands=10, tape=8, parts=4, days=5,
       makes='room: the company can hold more men',
       gives=('the roster cap goes up (rule 151b: money still teaches; more men eat more)', 'beds', 'nothing; it costs you men\'s keep'),
       look=('a gutted garage, cots, a barrel stove, a curtain of blankets', 'bunks in a refitted shop, lockers', 'a barracks with its own lights'),
       real='no price used; housing core as the scale'),
  dict(id='flats', name='THE FLATS REFIT', need='shelter', today=None, act=2, rung=2, hands=120, tape=80, parts=60, days=40, knows='a mason',
       makes='households: twenty families in a dead block of flats',
       gives=('many hands', 'the block fills', 'the city starts to grow on its own'),
       look=('(not in act one)', 'a concrete block of flats, every balcony different, plants, cables', 'a refit tower, solar on the roof, painted balconies'),
       real='scaled from the core house'),
  # ---- SAFETY ----
  dict(id='wall', name='WALL', need='safety', today='wall', act=1, rung=1, hands=6, tape=4, parts=0, days=3,
       makes='keeps out: hogs and thieves',
       gives=('the gardens survive', 'the block sleeps', 'nothing'),
       look=('cars on their sides, pallets, chain-link, razor wire', 'a block wall with a walkway', 'a low wall, a hedge, a gate that stands open'),
       real='no price used'),
  dict(id='lookout', name='LOOKOUT', need='safety', today=None, act=1, rung=1, hands=4, tape=4, parts=0, days=2,
       makes='sight: the fog lifts farther round your base',
       gives=('you see who is coming on the map (rule 155)', 'the block knows first', 'nothing'),
       look=('a scaffold tower on a roof, a tarp hood, a man with binoculars', 'a steel tower with a searchlight', 'a camera mast'),
       real='no price used'),
  dict(id='gate', name='GATE AND BELL', need='safety', today=None, act=1, rung=1, hands=4, tape=3, parts=2, days=2,
       makes='warning: a raid on your base gives you more days',
       gives=('more days to come home and fight (the raid at your gate, engine/bohemia_homebases.js)', 'the block runs inside', 'nothing'),
       look=('a bus parked across the street, a scrap-iron bell on a pole', 'a rolling steel gate, a siren on a battery', 'an open gate with a booth'),
       real='no price used'),
  dict(id='militia', name='MILITIA HOUSE', need='safety', today=None, act=1, rung=2, hands=16, tape=12, parts=10, days=8,
       makes='a garrison: the base fights for itself while you roam',
       gives=('a small raid is beaten without you', 'the block\'s own men guard it', 'no more losing a base to a crew of three'),
       look=('a fortified gas station, sandbags, a painted faction mark (colour as an accent, rule 159)', 'a guard house with a radio', 'a watch office'),
       real='no price used'),
  # ---- HEALTH ----
  dict(id='aid', name='FIRST-AID ROOM', need='health', today=None, act=1, rung=1, hands=4, tape=2, parts=12, days=2,
       makes='healing: a wound heals faster at home, meds go further',
       gives=('the 30 to 40 day injury shorter at home (his 9/27 struck-down rule)', 'the block\'s cuts get stitched', 'fewer meds bought'),
       look=('a back room, a cot, a lamp, a red cross painted on a door (the one painted door)', 'a whitewashed room, two beds, a cabinet', 'a clean room with a light box'),
       real='a health post $28,539 (Nepal 2009) for the clinic above it'),
  dict(id='clinic', name='CLINIC', need='health', today=None, act=2, rung=2, hands=40, tape=30, parts=120, days=20, knows='a doctor (an anatomist or a monk, Battle Brothers\' backgrounds)',
       makes='healing: the long injury halved, the block healthy',
       gives=('your struck-down men back in half the time', 'the people live longer (the century rule counts some people, 9/7)', 'meds made, not bought'),
       look=('(not in act one)', 'a refitted strip-mall clinic, hand-painted sign, a generator', 'a lit hospital wing'),
       real='a health post $28,539 (Nepal 2009); 8 to 9 boreholes'),
  # ---- TRADE ----
  dict(id='stall', name='VENDOR STALL', need='trade', today='stall', act=1, rung=1, hands=2, tape=2, parts=0, days=1,
       makes='clout: people start to know your name',
       gives=('a name', 'a place to swap', 'clout'),
       look=('a table under a beach umbrella, a hand-lettered card', 'a stall with a tin roof and a painted name', 'a kiosk with a screen'),
       real='no price used'),
  dict(id='swap', name='THE SWAP MEET', need='trade', today=None, act=1, rung=2, hands=10, tape=8, parts=0, days=4,
       makes='a market at home: sell in one tap, traders come to you',
       gives=('sell the junk at home in one tap (his item 18)', 'the block trades', 'better prices at your base'),
       look=('a parking lot of tables, tarps, a shopping-trolley fence', 'a covered market, rows, a weigh scale', 'a market hall'),
       real='Aleppo\'s al-Saqatiyah souk, 53 shops: $400,000 and eight months to restore'),
  dict(id='yard', name='CARAVAN YARD', need='trade', today=None, act=2, rung=2, hands=30, tape=20, parts=40, days=12,
       makes='caravans: your own trade on the roads',
       gives=('your goods move between towns while you fight', 'jobs for drivers', 'the made-here spread works for you (Day 68)'),
       look=('(not in act one)', 'a truck yard, two rebuilt trucks, a fuel drum', 'a depot with electric haulers'),
       real='the 7/1 shipping spine'),
  # ---- MAKE ----
  dict(id='shed', name='SHED', need='make', today='shed', act=1, rung=1, hands=2, tape=2, parts=0, days=1,
       makes='tape: a bench and what you drag home',
       gives=('a little tape', 'a place to fix things', 'cuts the tape bill a little'),
       look=('a tin shed, a bench vice, a coffee can of screws', 'a shed with a power tool', 'a clean workshop door'),
       real='no price used'),
  dict(id='workshop', name='WORKSHOP', need='make', today=None, act=1, rung=1, hands=8, tape=6, parts=10, days=4,
       makes='tape and repairs: gear fixed at home',
       gives=('armour and guns repaired free at home (rule 37: gear is the depth)', 'the block\'s things fixed', 'scrap turned into tape'),
       look=('a gutted auto shop, a welder on a car battery, sparks', 'a shop with a lathe, a painted sign', 'a fabrication bay'),
       real='Argentina after 2001: workers restarted about 130 factories by 2004, 300 to 350 later'),
  dict(id='bench', name='LOADING BENCH', need='make', today=None, act=1, rung=2, hands=4, tape=4, parts=30, days=2,
       makes='rounds: reloaded from the brass you pick up',
       gives=('rounds, the scarcest thing in act one', 'nothing', 'brass from the fight becomes ammo'),
       look=('a kitchen table, a hand press, brass sorted in tins', 'a reloading room, a scale', 'a small ammo works'),
       real='hand reloading; no price used'),
  # ---- MOVE ----
  dict(id='road', name='A CLEARED ROAD', need='move', today=None, act=1, rung=1, hands=12, tape=0, parts=0, days=3,
       makes='speed: the map draws road where there were wrecks',
       gives=('faster travel to and from home (roads faster than dirt)', 'the block can reach the next town', 'trade comes'),
       look=('wrecks pushed to the kerb, a lane swept', 'a patched road, painted lines coming back', 'a smooth road with lights'),
       real='Detroit: clearing a house $10,000 to $16,000; a road is many wrecks'),
  dict(id='station', name='RAIL STATION', need='move', today=None, act=2, rung=2, hands=200, tape=150, parts=400, days=60, knows='a rail man',
       makes='the line: the story\'s spine (7/1)',
       gives=('the main quest\'s stations; travel between stations in a tap', 'the city connects', 'the city can grow (7/1: shipping caps growth)'),
       look=('(not in act one)', 'a rebuilt platform, a hand-car, a repainted sign', 'a working station with a train'),
       real='short-line rail rehab about $240,000 to $1,100,000 a mile (US CRISI projects)'),
  # ---- BELONGING (clout) ----
  dict(id='radio', name='RADIO MAST', need='belonging', today=None, act=1, rung=2, hands=4, tape=4, parts=20, days=3,
       makes='clout: your name on the air; the feed hears more',
       gives=('news of the next towns (Day 75: the rumour)', 'the block hears music', 'clout'),
       look=('an antenna made of a ladder and coat hangers on a roof', 'a proper mast, a studio in a back room', 'a broadcast tower'),
       real='no price used'),
  dict(id='school', name='SCHOOL', need='belonging', today=None, act=2, rung=2, hands=40, tape=30, parts=20, days=15,
       makes='clout and the next generation: the heir\'s city',
       gives=('the heir starts with more (the derive, rule 31)', 'children learn', 'clout'),
       look=('(not in act one)', 'a church hall with benches and a chalk wall', 'a school with a playground'),
       real='no price used'),
]

# the five grand works: each one a generation; the people's hands and the house's batteries; quest-anchored (7/1)
GRAND = [
  dict(id='pipe', name='THE LAKE MEAD PIPE', act=3, rung=3, batteries=12000, people_hands=4000, days=300,
       does='water to the whole city (laws: Lake Mead the healthy oasis)'),
  dict(id='dam', name='THE DAM\'S TURBINES', act=3, rung=3, batteries=20000, people_hands=6000, days=360,
       does='power for the whole valley (the Hoover equivalent, 7/1)'),
  dict(id='field', name='THE SOLAR FIELD', act=3, rung=3, batteries=15000, people_hands=3000, days=240,
       does='the canon solar project: the city lit at night'),
  dict(id='line', name='THE LINE', act=3, rung=3, batteries=25000, people_hands=8000, days=400,
       does='rail across the valley, station to station (the story\'s spine, 7/1)'),
  dict(id='strip', name='THE STRIP RELIT', act=3, rung=3, batteries=10000, people_hands=2000, days=180,
       does='neon back on the Strip (rule 159: maybe on the Strip)'),
]


def price(b):
  hired = HAND * b['hands'] + TAPE * b['tape'] + b['parts']
  own = TAPE * b['tape'] + b['parts']
  return hired, own


def tables():
  out = []
  out.append('| # | building | need | built today? | act | rung | hands | tape | parts | HIRED price | OWN HANDS price | days |')
  out.append('|---|---|---|---|---|---|---|---|---|---|---|---|')
  for i, b in enumerate(B, 1):
    hired, own = price(b)
    out.append('| %d | %s | %s | %s | %d | %d | %d | %d | %d | **%d** | %d | %d |' % (
      i, b['name'], b['need'], ('yes, `%s`' % b['today']) if b['today'] else 'no', b['act'], b['rung'],
      b['hands'], b['tape'], b['parts'], hired, own, b['days']))
  out.append('')
  out.append('| # | building | makes | for the company | for the people | for the money |')
  out.append('|---|---|---|---|---|---|')
  for i, b in enumerate(B, 1):
    c, p, m = b['gives']
    out.append('| %d | %s | %s | %s | %s | %s |' % (i, b['name'], b['makes'], c, p, m))
  out.append('')
  out.append('| # | building | act one (the ruin) | act two (reclaimed) | act three (the healing) |')
  out.append('|---|---|---|---|---|')
  for i, b in enumerate(B, 1):
    a1, a2, a3 = b['look']
    out.append('| %d | %s | %s | %s | %s |' % (i, b['name'], a1, a2, a3))
  out.append('')
  out.append('| grand work | act | batteries (the house) | hand-days (the people) | days | what it does |')
  out.append('|---|---|---|---|---|---|')
  for g in GRAND:
    out.append('| %s | %d | %d | %d | %d | %s |' % (g['name'], g['act'], g['batteries'], g['people_hands'], g['days'], g['does']))
  return '\n'.join(out)


def summary():
  by_act = {}
  for b in B:
    by_act.setdefault((b['act'], b['rung']), []).append(price(b)[0])
  lines = []
  for k in sorted(by_act):
    v = by_act[k]
    lines.append('act %d rung %d: %d kinds, hired %d to %d batteries' % (k[0], k[1], len(v), min(v), max(v)))
  every = sum(price(b)[0] for b in B)
  lines.append('one of every kind, all hands hired: %d batteries; own hands: %d' % (every, sum(price(b)[1] for b in B)))
  lines.append('the five grand works: %d batteries and %d of the people\'s hand-days' % (
    sum(g['batteries'] for g in GRAND), sum(g['people_hands'] for g in GRAND)))
  return '\n'.join(lines)


if __name__ == '__main__':
  assert len(B) == 31, len(B)
  print(tables())
  print()
  print(summary())
  if '--bank' in sys.argv:
    bank = {'draft': True, 'source': 'tools/bohemia_economy_the_mayor_arc_catalog.py',
            'page': 'records/BOHEMIA_ECONOMY_DAY_81_THE_MAYOR_ARC_YOU_PAY_FOR_THE_CORE_AND_THE_PEOPLE_BUILD_THE_CITY_10_25_26.md',
            'note': 'RESEARCH ONLY, never read by the game (rule 161, rule 88). Every number a DRAFT for TUNING (rule 117).',
            'hand_day_batteries': HAND, 'tape_point_batteries': TAPE,
            'buildings': [dict(b, hired=price(b)[0], own_hands=price(b)[1]) for b in B],
            'grand_works': GRAND}
    with open(os.path.join(ROOT, BANK), 'w') as f:
      json.dump(bank, f, indent=1)
      f.write('\n')
    print('wrote', BANK)
