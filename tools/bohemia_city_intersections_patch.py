#!/usr/bin/env python3
"""
BOHEMIA CITY INTERSECTIONS PATCH (7/20/26) - the V12 intersection anatomy at
street level in the city.

The approved anatomy (V12, Paolo-blessed proofs + LINE COLOR gate): a CLEAN
BOX where roads cross (no paint inside), FOUR CROSSWALKS at the box edges,
medians and lane lines STOPPING at the crossing. The city's street level had
plain asphalt through every crossing.

This patch upgrades the CANON XSEC road branch:
  - crossing cells (road with both NS and EW road neighbors) get the box:
    clean asphalt, no median, no dashes inside
  - crosswalk bands (approved pools.cross art, orientation-aware: authored
    horizontal, rot90 for the EW-road crossings) at the box edges, spanning
    the roadway only (never the sidewalks)
  - median yellow and white lane dashes stop before the crosswalk
Turn-pocket arrows (cell.mk vocabulary) stay a bake-factory rung.

Also extends the probe: __CITY.human(x,y) teleports the walker so the REAL
surface at any coordinate can be verified (and gates can look at crossings
without a thousand steps).

Idempotent (marker V12 XING). city_tab_gate locks it.

  python3 tools/bohemia_city_intersections_patch.py
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


def shrink(b64, rot=0):
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
    if rot:
        im = im.rotate(rot, expand=True)
    im = im.resize((TPX, TPX), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, 'PNG', optimize=True)
    return base64.b64encode(out.getvalue()).decode('ascii')


alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'V12 XING' in decoded:
    print('intersections already anatomical. no-op.')
    sys.exit(0)

# crosswalk art joins the atlas: authored-horizontal stripes serve the
# NS-road crossings (band spans EW); rot90 serves the EW-road crossings
CR = json.load(open(POOLS))['pools']['cross']
tiles = json.dumps({'cross_ns': [shrink(b) for b in CR[:3]],
                    'cross_ew': [shrink(b, rot=90) for b in CR[:3]]})[1:-1]
SA_OPEN = 'const SA_TILES={'
assert SA_OPEN in decoded
decoded = decoded.replace(SA_OPEN, SA_OPEN + tiles + ',', 1)
SA_MAP_MARK = "'#d8d4c4':'street'};"
assert SA_MAP_MARK in decoded
decoded = decoded.replace(SA_MAP_MARK,
    "'#d8d4c4':'street','#e8e0d0':'cross_ns','#e6ded2':'cross_ew'};", 1)

# the crossing-aware cross-section
OLD = """    if(inV||inH){
      // at a crossing the vertical band wins (one coherent surface)
      const dist=inV?dV:dH, along=inV?ly:lx;
      const rel=dist-medHalf;
      if(dist<medHalf){ c.g='#b8a040'; }                       // median: yellow"""
assert OLD in decoded
NEW = """    if(inV||inH){
      /* V12 XING (7/20): clean box, crosswalks at the box edges, median and
         lane lines stop at the crossing - the approved intersection anatomy */
      const crossing=(m.N||m.S)&&(m.W||m.E);
      const CW=2, roadHalf=medHalf+laneZone;      // paint zone: roadway only
      if(crossing&&dV<roadHalf&&dH<roadHalf){ c.g=RCOL[d]||'#8a8a86'; return c; }
      if(crossing&&inV&&dV<roadHalf&&dH<roadHalf+CW){ c.g='#e8e0d0'; return c; }
      if(crossing&&inH&&dH<roadHalf&&dV<roadHalf+CW){ c.g='#e6ded2'; return c; }
      const dist=inV?dV:dH, along=inV?ly:lx, other=inV?dH:dV;
      const nearX=crossing&&other<roadHalf+CW+2;   // approach zone: no paint
      const rel=dist-medHalf;
      if(dist<medHalf){ c.g=nearX?(RCOL[d]||'#8a8a86'):'#b8a040'; }  // median stops"""
decoded = decoded.replace(OLD, NEW, 1)

DASH_OLD = "if(inLane>=LANE_W&&rel<laneZone-1&&(along%6<3)) c.g='#d8d4c4';"
assert DASH_OLD in decoded
decoded = decoded.replace(DASH_OLD,
    "if(inLane>=LANE_W&&rel<laneZone-1&&(along%6<3)&&!nearX) c.g='#d8d4c4';", 1)

# probe: teleport the walker so any coordinate is verifiable on the real surface
HX = 'let hx=0, hy=0;'
assert HX in decoded
decoded = decoded.replace(HX, HX +
    " setTimeout(function(){ if(window.__CITY)window.__CITY.human=function(x,y){hx=x;hy=y;render();}; },0);", 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('intersections anatomical: clean box + crosswalks (approved art, oriented) + median/dash stop; __CITY.human teleport in')
