#!/usr/bin/env python3
"""
BOHEMIA CITY STREET ART PATCH (7/20/26) - the streets Paolo MADE, under his
feet in the city.

Paolo (furious, correct): "WE ACTUALLY MADE STREETS BEFORE THE SESSIONS WENT
TO CODE." The approved street art has existed since 7/14 as
banks/BOHEMIA_STREET_POOLS_HARMONIZED (the V11/V12 bakes' own pools: 18
weathered asphalt tiles, 36 sidewalk tiles, washed yellow medians per the
30-year markings law, all judged) - and the city builder's street level was
drawing flat programmer gray instead.

This patch makes the city's ground wear the REAL art:
  - the approved pools are downscaled 44px -> 16px (TPX) and embedded
  - texFor() serves real tiles for street-level ground colors:
      road surface colors -> pools.street (weathered asphalt)
      sidewalk color      -> pools.side
      road-shoulder dirt  -> pools.desert
  - the yellow center-line cells draw pools.median with ORIENTATION (bank
    tiles are authored horizontal; vertical lines rot90 at build time),
    resolved per-cell from the line's neighbors in chunkCanvas
  - texture + chunk caches flush once when the art finishes decoding, so
    no chunk stays baked with placeholder gray

Idempotent (marker SA_TILES); rerun after pool verdicts change the banks.
city_tab_gate locks the art in.

  python3 tools/bohemia_city_streetart_patch.py
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

P = json.load(open(POOLS))['pools']


def shrink(b64, rot=0):
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB')
    if rot:
        im = im.rotate(rot, expand=True)
    im = im.resize((TPX, TPX), Image.LANCZOS)
    out = io.BytesIO()
    im.save(out, 'PNG', optimize=True)
    return base64.b64encode(out.getvalue()).decode('ascii')


TILES = {
    'street':   [shrink(b) for b in P['street'][:6]],
    'side':     [shrink(b) for b in P['side'][:6]],
    'shoulder': [shrink(b) for b in P['desert'][:4]],
    'median_h': [shrink(b) for b in P['median'][:3]],
    'median_v': [shrink(b, rot=90) for b in P['median'][:3]],
}

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'SA_TILES' in decoded:
    print('streets already wear the real art. no-op.')
    sys.exit(0)

SA_JS = """
/* ==== STREET ART (7/20): the approved V11/V12 street pools, on the ground.
   Source: %s (judged art, 30-yr weathering). Gate-locked. ==== */
const SA_TILES=%s;
const SA_MAP={'#8a8a86':'street','#7a7a76':'street','#5e5e5a':'street','#4a4a48':'street','#c8c4b8':'side','#a89a80':'shoulder'};
const SA_IMG={}; let SA_LEFT=0;
for(const k in SA_TILES){ SA_IMG[k]=SA_TILES[k].map(b=>{ SA_LEFT++;
  const im=new Image();
  im.onload=()=>{ if(--SA_LEFT===0)saFlush(); };
  im.src='data:image/png;base64,'+b; return im; }); }
function saFlush(){ try{ _texCache.clear();
  for(const [,v] of chunkCache){ if(v&&v.cv)recycleCv(v); }
  render(); }catch(e){} }
function saTex(pool,variant){ const arr=SA_IMG[pool]; if(!arr)return null;
  const im=arr[variant%%arr.length]; if(!im.complete||!im.naturalWidth)return null;
  const k2='SA|'+pool+'|'+(variant%%arr.length);
  let t=_texCache.get(k2); if(t)return t;
  const c2=document.createElement('canvas'); c2.width=TPX; c2.height=TPX;
  c2.getContext('2d').drawImage(im,0,0,TPX,TPX);
  _texCache.set(k2,t=c2); return t; }
""" % (POOLS, json.dumps(TILES))

# 1) inject the art + helpers just before texForKind (same scope as _texCache)
ANCHOR = 'function texForKind(kind,col,variant){'
assert ANCHOR in decoded
decoded = decoded.replace(ANCHOR, SA_JS + '\n' + ANCHOR, 1)

# 2) texFor serves real ground tiles for mapped colors
TEX_OPEN = 'function texFor(col,isStruct,variant){'
assert TEX_OPEN in decoded
decoded = decoded.replace(TEX_OPEN, TEX_OPEN +
    " if(!isStruct){ const sp=SA_MAP[col]; if(sp){ const t2=saTex(sp,variant); if(t2)return t2; } }", 1)

# 3) center-line cells draw the median with orientation (neighbors decide)
DRAW_OLD = "x.drawImage(texFor(c.g,false,v),i2*TPX,y*TPX);"
assert DRAW_OLD in decoded
DRAW_NEW = ("let _gt=null; if(c.g==='#b8a040'){"
            " const _u=cellAt(gx,gy-1),_d=cellAt(gx,gy+1);"
            " const _vert=(_u&&_u.g==='#b8a040')||(_d&&_d.g==='#b8a040');"
            " _gt=saTex(_vert?'median_v':'median_h',v); }"
            " x.drawImage(_gt||texFor(c.g,false,v),i2*TPX,y*TPX);")
decoded = decoded.replace(DRAW_OLD, DRAW_NEW, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
n = sum(len(v) for v in TILES.values())
print('streets wear the real art: %d approved tiles embedded (%d KB of art)' %
      (n, sum(len(t) for v in TILES.values() for t in v) // 1024))
