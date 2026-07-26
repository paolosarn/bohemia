#!/usr/bin/env python3
"""
BOHEMIA CITY POCKETS PATCH (7/20/26) - left-turn pockets at the crossings.

The V12 anatomy's next piece: at an intersection approach, the innermost
lane becomes a TURN POCKET - its boundary line goes SOLID (the approved
pocket_line art, edge-positioned per the 7/17 bold-markings ruling) for the
pocket length before the crosswalk, instead of the dashed lane line.

HONEST SCOPE CALL: pocket ARROWS are NOT in this patch. The approved bold
arrows are 5px-shaft art; downscaled to the city's 16px ground tiles they
would be illegible mush - the exact "wtf is the purpose of these lines"
crime Paolo already killed once. Arrows come when the street level has a
zoom-true marking treatment (multi-cell arrows at high zoom). Recorded in
the handoff; lines now, arrows properly or not at all.

Uses pools.pocket_line_v / pocket_line_h from the harmonized bank (approved,
both orientations authored - no rotation needed). Seed-regen friendly by
construction: pure f(tileMeta neighbors + cell position).

Idempotent (marker POCKETS). city_tab_gate locks it.

  python3 tools/bohemia_city_pockets_patch.py
"""
import base64
import io
import json
import os
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
POOLS = 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt'
TPX = 16


def shrink(b64):
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
    im = im.resize((TPX, TPX), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, 'PNG', optimize=True)
    return base64.b64encode(out.getvalue()).decode('ascii')


alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'POCKETS' in decoded and "'pocket_v'" in decoded:
    print('pockets already in. no-op.')
    sys.exit(0)

P = json.load(open(POOLS))['pools']
tiles = json.dumps({'pocket_v': [shrink(b) for b in P['pocket_line_v'][:3]],
                    'pocket_h': [shrink(b) for b in P['pocket_line_h'][:3]]})[1:-1]
SA_OPEN = 'const SA_TILES={'
assert SA_OPEN in decoded
decoded = decoded.replace(SA_OPEN, SA_OPEN + tiles + ',', 1)
MAP_MARK = "'#e8e0d0':'cross_ns','#e6ded2':'cross_ew'};"
assert MAP_MARK in decoded
decoded = decoded.replace(MAP_MARK,
    "'#e8e0d0':'cross_ns','#e6ded2':'cross_ew','#e4decb':'pocket_v','#e2dcc9':'pocket_h'};", 1)

DASH_OLD = "if(inLane>=LANE_W&&rel<laneZone-1&&(along%6<3)&&!nearX) c.g='#d8d4c4';"
assert DASH_OLD in decoded
DASH_NEW = ("/* POCKETS (7/20): at an approach, the innermost lane's boundary goes"
            " SOLID pocket-line art for the pocket length before the crosswalk;"
            " arrows wait for a zoom-true treatment (bold-marking law). */"
            " const pocket=crossing&&rel%(LANE_W+1)>=LANE_W&&rel<LANE_W+1&&other>roadHalf&&other<=roadHalf+CW+6;"
            " if(pocket) c.g=inV?'#e4decb':'#e2dcc9';"
            " else if(inLane>=LANE_W&&rel<laneZone-1&&(along%6<3)&&!nearX) c.g='#d8d4c4';")
decoded = decoded.replace(DASH_OLD, DASH_NEW, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('pockets in: solid pocket lines at approaches (approved art, both orientations); arrows deferred to zoom-true')
