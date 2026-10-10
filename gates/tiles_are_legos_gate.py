#!/usr/bin/env python3
"""TILES ARE LEGOS (rule 77, PAOLO 10/5: 'the tiles aren't speaking to each other... these things should
conjoin easily like Legos'). Reads every fight board on disk (slices/fight_ground) and every seam in it,
the board's own and its apron's, with the edge reader of tools/bohemia_combat2_tiles_are_legos_cook_10_5_26.py:
road, curb and water runs must meet within 3 px, yard sides meet yard sides and desert sides desert sides,
and every lane, centre and curb line that crosses one side crosses the other within 3 px.

  LEG 1  THE SETS HE NAMED ARE CLEAN: the freeway board and the street (suburb) board have ZERO faults,
         board and apron.
  LEG 1b EVERY BOARD BY SIZE IS CLEAN (rule 79): the six kinds' small, middle and large boards, zero faults.
  LEG 1c THE FUTURES JOIN: every board in its reclaimed and raided pictures has no more broken seams than today.
  LEG 5  THE STREET IS HIS PACK'S (rule 82a): every town block on a board lays its street from COOK TWO's kit, every
         kit tile names its (pool, index) keys; the houses and yards are the named exception (COOK FOUR re-cuts them).
  LEG 2  THE REST CAN ONLY GET BETTER: every other board's faults (board, apron) are at or under the
         ratchet in gates/tiles_are_legos_ratchet.json. Lower the ratchet when a board improves.
  LEG 3  THE DATA FILE IS TRUE: records/target/bb/BOHEMIA_GROUND_EDGES.json names every shipped block's four
         edges and the compass, and its runs match a fresh read of the pictures.
  LEG 4  THE GATE BITES: the freeway board with its top row dropped onto the overpass's row (a town block
         against the freeway's lanes) and with a desert block put where the overpass lands must fault.
"""
import importlib, json, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
L = importlib.import_module('bohemia_combat2_tiles_are_legos_cook_10_5_26')
RATCHET = os.path.join(REPO, 'gates/tiles_are_legos_ratchet.json')
CLEAN = ('freeway', 'suburb')

fails = []
m = json.load(open(L.MAN))
edges = L.read_all(m)
now = {}
for name, b in m['boards'].items():
    own = L.board_faults(b['blocks'], edges)
    ap = L.board_faults(b['apron']['blocks'], edges) if 'apron' in b else None
    if ap is None: fails.append('%s has no apron to read' % name); ap = []
    now[name] = [len(own), len(ap)]
    if name in CLEAN and (own or ap):
        fails.append('LEG 1: %s must be clean, has %d board faults and %d with its apron: %s' % (name, len(own), len(ap), (own + ap)[:3]))
print('faults now (board, with apron):', json.dumps(now))
for kind, sizes in m.get('sized', {}).items():                   # LEG 1b (rule 79): every cut board joins
    for size, sb in sizes.items():
        f = L.board_faults(sb['blocks'], edges)
        if f: fails.append('LEG 1b: sized %s %s has %d broken seams: %s' % (kind, size, len(f), f[:2]))
if len(m.get('sized', {})) < 6: fails.append('LEG 1b: the six kinds at three sizes are not all in the manifest')
for state, F in m.get('futures', {}).items():                    # LEG 1c: the futures join as the present does
    m2 = json.loads(json.dumps(m))
    for bid, src in F['blocks'].items(): m2['blocks'][bid]['src'] = src
    fe = L.read_all(m2)
    for name, b in m['boards'].items():
        f = L.board_faults(b['blocks'], fe)
        if len(f) > now[name][0]: fails.append('LEG 1c: %s %s has %d broken seams, the present day %d' % (state, name, len(f), now[name][0]))
if set(m.get('futures', {})) != {'reclaimed', 'raided'}: fails.append('LEG 1c: the two futures are not in the manifest')
KIT = json.load(open(L.KIT_JSON))['pieces'] if os.path.exists(L.KIT_JSON) else {}   # LEG 5 (rule 82a): the street is his pack's
TOWN = ('subs', 'corner', 'lots', 'suburb_stem', 'main', 'works', 'strip', 'ruin')
used_blocks = {x for b in m['boards'].values() for row in b['blocks'] for x in row}
for bid in sorted(used_blocks):
    if bid.split('.')[0] not in TOWN: continue
    plan = m['blocks'][bid].get('kit_plan')
    if not plan: fails.append('LEG 5: %s lays its street without the kit' % bid); continue
    for rc, piece in plan.items():
        if piece not in KIT or not KIT[piece].get('keys'): fails.append('LEG 5: %s tile %s is %s, which names no pack key' % (bid, rc, piece))
rat = json.load(open(RATCHET))
for name, (o, a) in now.items():
    if name in CLEAN: continue
    if name not in rat: fails.append('LEG 2: %s has no ratchet line' % name); continue
    if o > rat[name][0] or a > rat[name][1]:
        fails.append('LEG 2: %s got worse: %d/%d faults, the ratchet is %d/%d' % (name, o, a, rat[name][0], rat[name][1]))
data = json.load(open(L.OUT))
if 'NORTH' not in data.get('compass', ''): fails.append('LEG 3: the data file carries no compass')
ppm = [m['tile_px'][1] / m['tile_metres'], m['tile_px'][0] / m['tile_metres']]
for bid, e in edges.items():
    d = data['blocks'].get(bid)
    if not d: fails.append('LEG 3: %s is shipped and not in the data file' % bid); continue
    for s, v in e.items():
        fresh = [[t, round(a / ppm[s in 'NS'], 2), round(b_ / ppm[s in 'NS'], 2)] for t, a, b_ in v['runs']]
        if fresh != d[s]['runs']: fails.append('LEG 3: %s side %s in the data file is not what the picture shows' % (bid, s)); break
fw = m['boards']['freeway']['blocks']
bad1 = [list(fw[0]), list(fw[0]), list(fw[2])]
bad2 = [list(fw[0]), list(fw[1]), [('scrub.0' if fw[1][c].startswith('freewayo') else fw[2][c]) for c in range(len(fw[2]))]]
if not L.board_faults(bad1, edges): fails.append('LEG 4: a town row on the freeway row reads clean: the gate is blind')
if not L.board_faults(bad2, edges): fails.append('LEG 4: the overpass landing on dirt reads clean: the gate is blind')
if fails:
    print('TILES ARE LEGOS: RED'); [print('  ' + f) for f in fails]; sys.exit(1)
print('TILES ARE LEGOS: green (%s clean, the rest at or under the ratchet, the data file true, the gate bites)' % ', '.join(CLEAN))
