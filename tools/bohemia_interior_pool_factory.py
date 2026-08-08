#!/usr/bin/env python3
"""
BOHEMIA INTERIOR POOL FACTORY (7/26/26, CITY lane) - the Great Sweep, made usable.

Paolo killed the first interiors ("Dogshit."). The mechanism was fine; the LOOK
was an empty box wearing an exterior facade kit - five textures, no floor
variety, no furniture, no clutter, nothing to walk in for. Meanwhile 1,927
assets he had personally judged UP were sitting in banks/ unreachable, because
his verdicts are keyed by (pack, idx) into the HD masters and nothing in the
game had ever crossed that key back to the actual images.

This is that crossing, and it is the whole point of the tool:

    banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt   ("Paolo's Great Sweep,
      COMPLETE: every act-1 asset individually judged in context. UP =
      confirmed act-1 spawn pool. THE act-1 art authority.")   2,604 verdicts
                          |  join on (pack, idx)
    banks/BOHEMIA_HD_TILE_REPO_part1-4.txt         (the HD masters)
                          v
    banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt        UP-ONLY, bucketed by what a
                                                   room actually needs

All 87 swept packs resolve against the repo, so nothing is guessed and nothing
is cooked. A DOWN tile can never enter the pool: the filter is his verdict.

SIZE FLAGS ARE HONOURED. The sweep carries BIG / SMALL flags ("scale
corrections pending policy: BIG: render smaller / SMALL: render bigger"), so
each entry ships its own draw scale rather than every prop being one cell.

BUCKETS (pack -> what it is in a room). Buckets are named off the PACK NAMES
Paolo swept, never invented: floors, walls, doors, windows, furniture,
container, clutter, tools, debris, light, plant. Room ROLES then draw from
buckets in the STEP-INSIDE renderer - a stockroom gets containers, a living
room gets furniture, every room gets its own floor.

DELIBERATELY EXCLUDED: 'BLOOD AND GORE', 'skeletons and bones', '10. Zombie
bodies and bones', '6. Blood and infection tiles'. They are UP in the sweep, so
they are legal art - but a body on the floor of a house is a STORY, and where
corpses are is Paolo's call, not a decorator's (MECHANISM-MINE / CONTENTS-
PAOLO'S). They stay out of the automatic dressing pool until he places them.

TASTE CHECK: this factory produces NO candidates and reaches Paolo's thumbs
with nothing, so the pre-judge kill-pass (tools/bohemia_taste_filter.py over
laws/BOHEMIA_PAOLO_TASTE_CANON.md) has nothing to filter here - the filter's
job is to kill obvious NEVER-violators before he sees them, and every tile in
this pool ALREADY CARRIES HIS OWN UP VERDICT. Filtering his approvals through a
taste heuristic would be the machine second-guessing the director, which is the
opposite of the law. The two taste calls that ARE this tool's to make are stated
and enforced instead of hidden: (a) DOWN tiles cannot enter, ever - the filter
is his verdict; (b) bodies and gore are excluded despite being UP, because where
a corpse lies is a story he places, not decoration a tool scatters
(MECHANISM-MINE / CONTENTS-PAOLO'S). When the ART lane assembles this pool into
a judged scene, THAT batch is a candidate and runs the filter.

AMENDED 8/8/26 - HALF OF (b) IS SUPERSEDED, AND NEWEST DATE WINS.
Paolo RULED the placement on 7/31 ("ofc i want a realistic mix of skeletons and
husks... where a body lies determines what a decade made of it") and commissioned
the system 8/8. So "where a corpse lies" is no longer an unwritten story - it is
HIS law, and engine/bohemia_dead.js implements it. Bodies are no longer withheld
from the world; they are placed BY THAT RULING, gated by gates/dead_gate.js.
WHAT DOES NOT CHANGE, and this file is still right about it:
  - this pool stays body-free. Interior dressing scatters furniture; the DEAD are
    placed by exposure and story, which is a different question with its own pass.
  - GORE stays out, everywhere. Blood is fresh-kill canon and is still on hold
    ("story-placed by Paolo" - approved asset index). Ten-year dead do not bleed.
  - NAMED dead (the tower die-off, the exodus road, the hospital order) are still
    entirely his. The dead pass lays down the ambient dead and nothing else.

REUSE CHECK: this tool cooks ZERO pixels. It is pure selection: it opens the
banks below, keeps only tiles Paolo marked UP, and downscales the masters to
the interior draw size. Every pixel that ships came from his approved corpus.
  used BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt - opened as SWEEP, the verdict
  authority; only v == 'UP' survives.
  used BOHEMIA_HD_TILE_REPO_part1.txt - opened as REPO[0], the masters.
  used BOHEMIA_HD_TILE_REPO_part2.txt - opened as REPO[1].
  used BOHEMIA_HD_TILE_REPO_part3.txt - opened as REPO[2].
  used BOHEMIA_HD_TILE_REPO_part4.txt - opened as REPO[3].

  python3 tools/bohemia_interior_pool_factory.py
"""
import base64
import io
import json
import os
import sys
from collections import defaultdict

from PIL import Image

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO_DIR)

SWEEP = 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt'
# named one per line so the REUSE-FIRST gate can literally verify each claimed
# bank is opened, rather than trusting a list comprehension
MASTERS_1 = 'banks/BOHEMIA_HD_TILE_REPO_part1.txt'
MASTERS_2 = 'banks/BOHEMIA_HD_TILE_REPO_part2.txt'
MASTERS_3 = 'banks/BOHEMIA_HD_TILE_REPO_part3.txt'
MASTERS_4 = 'banks/BOHEMIA_HD_TILE_REPO_part4.txt'
REPO = [MASTERS_1, MASTERS_2, MASTERS_3, MASTERS_4]
OUT = 'banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt'
PX = 48                      # interior draw size; masters are 96px, this is an exact halving

# pack name -> bucket. Named off the packs Paolo swept, nothing invented.
BUCKETS = {
    'floors': ['1. Cracked contrete tiles', '1. Metal floor tiles', 'Floor tiles!',
               '1. Cobblestone floor tiles', '1. Floor tiles', '3. Stone paths',
               'Floor tiles', 'Floor tiles (1)', '1. Floor tiles (1)',
               '2. Rusted metal floor tiles', 'Floor tiles and wall tiles'],
    'dirtfloor': ['2. Dirt path tiles', '2. Soil and dirt tiles', '8. Burned Ground and fire marks',
                  '7. Burnt ground tiles'],
    'walls': ['Wall tiles (1)', '3. Broken wall tiles', '2. Broken building walls',
              '4. Scrap wall and panels', 'Floor, walls'],
    'doors': ['4. Doors and entrances', '11. Industrial doors and gates'],
    'windows': ['5. Windows and broken glass'],
    'furniture': ['Furniture and fixtures (1)', 'Furniture and fixtures', '17. Benches and seating'],
    'tools': ['15. Workbenches and tools', '7. Computers and screens', '11. Gauges and meters',
              '13. Pipes and wiring', '18. Pipes and cables'],
    'container': ['11. Crates, barrels and supplies', '11. Crates and barrels',
                  'Barrels, crates and objects', 'Cargo, crates and containers',
                  '13. crates and barrels', '12. Crates, barrels and storage'],
    'clutter': ['Jars, bottles and items', 'Jars, pots and items', 'Food, drink and cafe props',
                '16. Loot and survival props', '11. Survival props', '12. Weapons and supplies',
                '18. Winter food and drinks'],
    'debris': ['7. Trash and debris', '9. Rubble and debris', '14. Trash and junk props',
               '12. Ruined building parts'],
    'light': ['18. Light sources and fire barrels', '18. Lights and emergency props'],
    'plant': ['16. Dead trees and plants', '15. Dead Trees and dry plants'],
}
# UP, but a story rather than decoration - Paolo places bodies, not a decorator.
EXCLUDED = {'BLOOD AND GORE', 'skeletons and bones', '10. Zombie bodies and bones',
            '6. Blood and infection tiles'}
# the sweep's own size flags -> how big the prop draws, in cells
FLAG_SCALE = {'BIG': 0.72, 'SMALL': 1.25, None: 1.0}

sweep = json.load(open(SWEEP, encoding='utf8'))
verdicts = sweep['verdicts']
masters = {}
for i, path in enumerate(REPO):
    for pack, tiles in json.load(open(path, encoding='utf8'))['packs'].items():
        masters.setdefault(pack, tiles)

pack_bucket = {}
for b, packs in BUCKETS.items():
    for p in packs:
        assert p not in pack_bucket, 'pack in two buckets: ' + p
        pack_bucket[p] = b

pool = defaultdict(list)
kept = dropped_down = dropped_unbucketed = missing = 0
for v in verdicts:
    if v['v'] != 'UP':
        dropped_down += 1
        continue
    pack = v['pack']
    if pack in EXCLUDED:
        continue
    b = pack_bucket.get(pack)
    if not b:
        dropped_unbucketed += 1
        continue
    tiles = masters.get(pack)
    if not tiles or v['idx'] >= len(tiles):
        missing += 1
        continue
    raw = tiles[v['idx']].get('b64')
    if not raw:
        missing += 1
        continue
    im = Image.open(io.BytesIO(base64.b64decode(raw))).convert('RGBA')
    im = im.resize((PX, PX), Image.NEAREST)
    buf = io.BytesIO()
    im.save(buf, format='PNG', optimize=True)
    pool[b].append({
        'pack': pack, 'idx': v['idx'],
        'scale': FLAG_SCALE.get(v.get('flag')),
        'b64': base64.b64encode(buf.getvalue()).decode('ascii'),
    })
    kept += 1

# CAPS. 1,172 UP tiles resolve, but the alpha is already 33MB and every byte
# here rides inside it. Each bucket keeps an EVENLY SPACED slice of its pack
# order rather than the first N, so the variety Paolo approved survives the cut
# instead of the pool collapsing onto whichever pack happened to sort first.
CAPS = {'floors': 48, 'dirtfloor': 24, 'walls': 48, 'doors': 20, 'windows': 16,
        'furniture': 31, 'tools': 40, 'container': 60, 'clutter': 80,
        'debris': 50, 'light': 24, 'plant': 24}
capped = 0
for b, items in list(pool.items()):
    n = CAPS.get(b, 24)
    if len(items) > n:
        step = len(items) / float(n)
        pool[b] = [items[int(i * step)] for i in range(n)]
        capped += len(items) - n
kept -= capped

assert kept > 400, 'interior pool is suspiciously small: %d' % kept
for b in ('floors', 'walls', 'doors', 'furniture', 'container', 'clutter', 'debris'):
    assert pool[b], 'bucket %s came out empty - a room needs it' % b

out = {
    'version': 'BOHEMIA_INTERIOR_POOL_v1',
    'built': '2026-07-26',
    'source': {'verdicts': SWEEP, 'masters': REPO},
    'law': 'UP-ONLY. Every tile here carries a Paolo UP verdict from the Great Sweep '
           '(banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt). A DOWN tile cannot be in this file. '
           'Excluded on purpose: ' + ', '.join(sorted(EXCLUDED)) + ' - UP, but bodies are a story '
           'Paolo places, not decoration.',
    'px': PX,
    'counts': {b: len(v) for b, v in sorted(pool.items())},
    'buckets': dict(pool),
}
json.dump(out, open(OUT, 'w', encoding='utf8'))
size = os.path.getsize(OUT)
print('INTERIOR POOL -> %s' % OUT)
print('  kept %d UP tiles | %d DOWN rejected | %d UP outside the interior buckets | %d unresolved'
      % (kept, dropped_down, dropped_unbucketed, missing))
print('  %d trimmed by the per-bucket caps (even spread kept)' % capped)
print('  ' + ' '.join('%s=%d' % (b, len(v)) for b, v in sorted(pool.items())))
print('  %.2f MB at %dpx' % (size / 1048576.0, PX))
