#!/usr/bin/env python3
"""
BOHEMIA CITY PERIMETER WALL PATCH (7/21/26) - the suburb's walled ring wears
Paolo's OWN approved wall, not a flat color.

Reuse-first law (Paolo 7/21, laws/BOHEMIA_ADDENDUM_ACT_ASSET_TIERS): before
cooking anything new, check what's already judged. banks/BOHEMIA_PERIMETER_
WALL_POOL_7_14_26 IS judged - WB4 is Paolo's own pick from batch 2
(records/BOHEMIA_WALL_PICKS_BATCH2_VERDICTS_7_17_26: "WB4 -> PERIMETER"),
85% tan / 15% original per his law, 13 approved keys x tan/original variants
- and it has sat completely unwired since 7/17 while the suburb's perimeter
wall (v===4 in the CANON SUBURB codes) rendered as flat '#6a5c44'.

This patch is the exact street-art marriage pattern (bohemia_city_streetart_
patch), reusing the SAME saTex/SA_IMG machinery already embedded: the tan
half of the pool (13 tiles) becomes SA_TILES.perimeter, WALL_MAP routes the
suburb wall's color through it for BOTH structure top (texFor) and face
(texForKind), and the existing saFlush() cache-clear/render fires when the
new images finish loading. No new machinery, one more pool plugged in.

Idempotent (marker WALL_MAP). city_tab_gate locks the art in.

  python3 tools/bohemia_city_perimeterwall_patch.py
"""
import base64
import io
import json
import sys
import os

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
POOL = 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt'
TPX = 16
WALL_COLOR = '#6a5c44'

pool = json.load(open(POOL))['pool']
tan = [p['b64'] for p in pool if p.get('variant') == 'tan']
assert len(tan) >= 12, 'expected the 13-key tan half of the approved pool'


def shrink(b64):
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
    im = im.resize((TPX, TPX), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, 'PNG', optimize=True)
    return base64.b64encode(out.getvalue()).decode('ascii')


TILES = [shrink(b) for b in tan]

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'WALL_MAP' in decoded:
    print('the perimeter wall already wears the real art. no-op.')
    sys.exit(0)

assert 'SA_TILES' in decoded and 'saTex' in decoded, \
    'street art patch must run first (SA_IMG/saTex machinery)'

WJS = """
/* ==== PERIMETER WALL ART (7/21): Paolo's own approved pool - WB4 is his
   pick, 85%% tan / 15%% original. Source: %s. Rides the street pools'
   saTex/SA_IMG machinery - one more pool key, same cache-flush. ==== */
SA_TILES.perimeter=%s;
SA_IMG.perimeter=SA_TILES.perimeter.map(b=>{ SA_LEFT++;
  const im=new Image();
  im.onload=()=>{ if(--SA_LEFT===0)saFlush(); };
  im.src='data:image/png;base64,'+b; return im; });
const WALL_MAP={'%s':'perimeter'};
""" % (POOL, json.dumps(TILES), WALL_COLOR)

# 1) inject the pool + loader right after SA_TILES/SA_IMG/saTex exist
ANCHOR = 'function texForKind(kind,col,variant){'
assert ANCHOR in decoded
decoded = decoded.replace(ANCHOR, WJS + '\n' + ANCHOR, 1)

# 2) texFor serves the real wall top for the mapped structure color
TEX_OLD = "function texFor(col,isStruct,variant){ if(!isStruct){ const sp=SA_MAP[col]; if(sp){ const t2=saTex(sp,variant); if(t2)return t2; } }"
assert TEX_OLD in decoded
decoded = decoded.replace(TEX_OLD, TEX_OLD +
    " if(isStruct){ const wp=WALL_MAP[col]; if(wp){ const t3=saTex(wp,variant); if(t3)return t3; } }", 1)

# 3) texForKind serves the real wall face for the mapped structure color
KIND_OLD = "function texForKind(kind,col,variant){ if(kind==='wall'&&(col==='#c04030'||col==='#7a5a48')){ const t4=saTex(variant===3?'wallwin':'wallface',variant); if(t4)return t4; }"
assert KIND_OLD in decoded
decoded = decoded.replace(KIND_OLD, KIND_OLD +
    " if(kind==='wall'&&WALL_MAP[col]){ const t5=saTex(WALL_MAP[col],variant); if(t5)return t5; }", 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('perimeter wall wears the real approved art: %d tan tiles embedded (%d KB)' %
      (len(TILES), sum(len(t) for t in TILES) // 1024))
