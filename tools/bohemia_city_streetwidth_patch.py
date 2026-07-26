#!/usr/bin/env python3
"""
BOHEMIA CITY STREET WIDTH PATCH (7/20/26) - the street WIDTH MODELS, in the
city.

Paolo: "we made whole models based on how wide the streets should be and I'm
not seeing that - everything looks like a suburban street." Correct: the
city drew every road as one narrow band + a center dash. The CANON anatomy
(engine/bohemia_blockgen.js, gated by LINE COLOR): LANE_W=2 LOCKED, lanes
1-4 per direction (freeway-class up to 5), a lane DIVIDER between lanes,
median 1-2, sidewalk rows outside, band = 2*(lanes*LANE_W+(lanes-1))+median.

This patch replaces the city's road cross-section with the canon models:
  arterial : 3 lanes/dir, median 1, sidewalks 2  (half-width 11 -> ~22 cells)
  strip    : 4 lanes/dir, median 2, sidewalks 2  (~28 cells - a boulevard)
  freeway/beltway : 4 lanes/dir, median 2, no sidewalks (~24 cells)
LINE COLOR LAW holds: YELLOW only at the direction-separating median, WHITE
dashes between same-direction lanes. The divider/median cells resolve to
the approved lane_div/median art (orientation-aware) via the street-art
patch's color map; sidewalks and asphalt already wear the real pools.
Rail and interchange keep their existing look.

Idempotent (marker CANON XSEC). city_tab_gate locks the models in.

  python3 tools/bohemia_city_streetwidth_patch.py
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

if 'CANON XSEC' in decoded:
    print('street widths already canon. no-op.')
    sys.exit(0)

# the exact block the city uses today (asserted, byte-safe)
i = decoded.index('if(m.road){ // centered bands')
j = decoded.index('return c;', i)
j = decoded.index('}', j) + 1
old_block = decoded[i:j]
assert 'const hw=BW[d]' in old_block and len(old_block) < 1200

NEW = """if(m.road){ /* CANON XSEC (7/20): the street WIDTH MODELS from
    engine/bohemia_blockgen.js - LANE_W=2 LOCKED, lanes/dir per class, white
    dividers between lanes, yellow only at the median (LINE COLOR LAW),
    sidewalk rows outside. Rail/interchange keep their look. */
    const XS={arterial:{lanes:3,med:1,side:2},strip:{lanes:4,med:2,side:2},
      freeway:{lanes:4,med:2,side:0},beltway:{lanes:4,med:2,side:0},
      interchange:{lanes:3,med:1,side:0}};
    const LANE_W=2;
    const xs=XS[d];
    const c={g:'#a89a80',s:null,walk:true,q:m.q};
    if(!xs){ // rail: unchanged narrow band
      const hw=BW[d], col=RCOL[d];
      const inV=Math.abs(lx-mid+0.5)<=hw, inH=Math.abs(ly-mid+0.5)<=hw;
      const vGo=(m.N||m.S||(!m.W&&!m.E)), hGo=(m.W||m.E);
      const vSeg=inV&&(m.N&&m.S?true:m.N?ly<=mid:m.S?ly>=mid:true);
      const hSeg=inH&&(m.W&&m.E?true:m.W?lx<=mid:m.E?lx>=mid:false);
      if((vGo&&vSeg)||(hGo&&hSeg)){ c.g=col;
        if(d==='rail'&&(ly&1)===0&&Math.abs(lx-mid+0.5)<=1)c.g='#3a2e24'; }
      return c;
    }
    const medHalf=Math.ceil(xs.med/2), laneZone=xs.lanes*LANE_W+(xs.lanes-1);
    const hw=medHalf+laneZone+xs.side;
    const vGo=(m.N||m.S||(!m.W&&!m.E)), hGo=(m.W||m.E);
    const dV=Math.abs(lx-mid+0.5), dH=Math.abs(ly-mid+0.5);
    const vSeg=dV<=hw&&(m.N&&m.S?true:m.N?ly<=mid:m.S?ly>=mid:true);
    const hSeg=dH<=hw&&(m.W&&m.E?true:m.W?lx<=mid:m.E?lx>=mid:false);
    const inV=vGo&&vSeg, inH=hGo&&hSeg;
    if(inV||inH){
      // at a crossing the vertical band wins (one coherent surface)
      const dist=inV?dV:dH, along=inV?ly:lx;
      const rel=dist-medHalf;
      if(dist<medHalf){ c.g='#b8a040'; }                       // median: yellow
      else if(rel<laneZone){
        const inLane=rel%(LANE_W+1);
        // white dash between same-direction lanes, never after the last lane
        if(inLane>=LANE_W&&rel<laneZone-1&&(along%6<3)) c.g='#d8d4c4';
        else c.g=RCOL[d]||'#8a8a86';                           // asphalt
      }
      else if(rel<laneZone+xs.side){ c.g='#c8c4b8'; }          // sidewalk
      return c;
    }
    return c;
  }"""

decoded = decoded.replace(old_block, NEW, 1)

# the approved lane_div art joins the embedded atlas (both orientations)
LD = json.load(open(POOLS))['pools']['lane_div']
lane_tiles = json.dumps({'lane_h': [shrink(b) for b in LD[:2]],
                         'lane_v': [shrink(b, rot=90) for b in LD[:2]]})[1:-1]
SA_OPEN = 'const SA_TILES={'
assert SA_OPEN in decoded
decoded = decoded.replace(SA_OPEN, SA_OPEN + lane_tiles + ',', 1)

# the white lane-divider color joins the art map (lane_div, orientation-aware)
SA_MAP_OLD = "const SA_MAP={'#8a8a86':'street','#7a7a76':'street','#5e5e5a':'street','#4a4a48':'street','#c8c4b8':'side','#a89a80':'shoulder'};"
assert SA_MAP_OLD in decoded
decoded = decoded.replace(SA_MAP_OLD, SA_MAP_OLD.replace("};", ",'#d8d4c4':'street'};"), 1)
# orientation-aware overlay for dividers rides the median special-case
ORI_OLD = ("let _gt=null; if(c.g==='#b8a040'){"
           " const _u=cellAt(gx,gy-1),_d=cellAt(gx,gy+1);"
           " const _vert=(_u&&_u.g==='#b8a040')||(_d&&_d.g==='#b8a040');"
           " _gt=saTex(_vert?'median_v':'median_h',v); }")
assert ORI_OLD in decoded
ORI_NEW = ("let _gt=null; if(c.g==='#b8a040'||c.g==='#d8d4c4'){"
           " const _u=cellAt(gx,gy-1),_d=cellAt(gx,gy+1);"
           " const _vert=(_u&&_u.g===c.g)||(_d&&_d.g===c.g);"
           " const _pool=(c.g==='#b8a040')?(_vert?'median_v':'median_h'):(_vert?'lane_v':'lane_h');"
           " _gt=saTex(_pool,v); }")
decoded = decoded.replace(ORI_OLD, ORI_NEW, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('street widths are canon: arterial ~22 cells, strip ~28, freeway ~24 (LANE_W=2, dividers white, median yellow)')
