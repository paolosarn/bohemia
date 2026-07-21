#!/usr/bin/env python3
"""
BOHEMIA CITY LAMP POSTS PATCH (7/20/26) - the V11 lamp bodies at their posts.

The city's night showed lamp glow as abstract dots. The BLESSED lamp art
(banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26: Paolo's approved dark bodies,
56x96 RGBA) now stands ON the sidewalks at street level:

  - PLACEMENT per the canon STAGGERED LAW (bohemia_blockgen): every 8 cells
    along the road, alternating sides, on the sidewalk row nearest the curb.
    Pure f(global coords) - seed-regen friendly, continuous across tiles.
  - DEAD IS DEFAULT (act-1 law): the body is always the dark variant.
  - At NIGHT, if the cell's circuit is LIVE (BOH_POWERGRID), a runtime
    amber HEAD GLOW draws over the head - rgb-only, no new baked art, no
    verdict owed (the exact V11 wired-lamp pattern, already blessed).

Idempotent (marker LAMP POSTS). city_tab_gate locks it.

  python3 tools/bohemia_city_lampposts_patch.py
"""
import base64
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt'

lamps = json.load(open(BANK))['lamps']
# three blessed dark bodies, full-res (renderer scales; smoothing off = crisp)
LAMPS = []
for e in lamps[:3]:
    b = e['b64']
    LAMPS.append(b + '=' * (-len(b) % 4))

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'LAMP POSTS' in decoded:
    print('lamp posts already standing. no-op.')
    sys.exit(0)

# 1) the blessed bodies + loader, near the street art block
INJ = """
/* ==== LAMP POSTS (7/20): the blessed V11 dark lamp bodies (%s) stand on
   the sidewalks per the STAGGERED LAW; DEAD IS DEFAULT; at night a live
   circuit adds an rgb-only head glow (the blessed V11 wired pattern). ==== */
const LAMP_B64=%s;
const LAMP_IMG=LAMP_B64.map(b=>{ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });
""" % (BANK, json.dumps(LAMPS))
ANCHOR = 'function texForKind(kind,col,variant){'
assert ANCHOR in decoded
decoded = decoded.replace(ANCHOR, INJ + '\n' + ANCHOR, 1)

# 2) realizeCell: mark lamp cells on the curb-side sidewalk row (staggered law)
SIDE_OLD = "else if(rel<laneZone+xs.side){ c.g='#c8c4b8'; }          // sidewalk"
assert SIDE_OLD in decoded
SIDE_NEW = ("else if(rel<laneZone+xs.side){ c.g='#c8c4b8';"
            " /* LAMP POSTS: staggered law - every 8 along, alternating sides, curb row */"
            " if(rel<laneZone+1&&!crossing){ const _gal=inV?gy:gx;"
            " if(_gal%8===2){ const _sideP=inV?((lx-mid)>0):((ly-mid)>0);"
            " if((((_gal>>3)&1)===0)===_sideP) c.lamp=1; } } }")
decoded = decoded.replace(SIDE_OLD, SIDE_NEW, 1)

# 3) chunk bake collects posts
BAKE_OLD = "ch2.lamps=[];"
assert BAKE_OLD in decoded
decoded = decoded.replace(BAKE_OLD, "ch2.lamps=[]; ch2.posts=[];", 1)
CELL_MARK = "ch2.lamps.push([i2,y]); }"
assert CELL_MARK in decoded
decoded = decoded.replace(CELL_MARK, "ch2.lamps.push([i2,y]); }\n    if(c.lamp)ch2.posts.push([i2,y]);", 1)

# 4) renderHuman draws the standing bodies (+ live head glow at night),
# spliced AFTER the night block, inside the per-chunk loop (clean braces)
BLOCK_OLD = """    if(night){
      g.fillStyle='rgba(10,14,26,0.48)'; g.fillRect(bx,by,cs,cs);
      g.fillStyle='rgba(255,220,120,0.85)';
      for(const [lx,ly] of ch.lamps){ g.fillRect(bx+lx*C+C*0.35,by+ly*C+C*0.4,Math.max(2,C*0.14),Math.max(2,C*0.14)); }
    }
  }"""
assert BLOCK_OLD in decoded
BLOCK_NEW = """    if(night){
      g.fillStyle='rgba(10,14,26,0.48)'; g.fillRect(bx,by,cs,cs);
      g.fillStyle='rgba(255,220,120,0.85)';
      for(const [lx,ly] of ch.lamps){ g.fillRect(bx+lx*C+C*0.35,by+ly*C+C*0.4,Math.max(2,C*0.14),Math.max(2,C*0.14)); }
    }
    if(ch.posts&&ch.posts.length)for(const [px2,py2] of ch.posts){
      const im=LAMP_IMG[(px2+py2)%LAMP_IMG.length];
      if(im.complete&&im.naturalWidth) g.drawImage(im, bx+px2*C-C*0.25, by+(py2-2)*C, C*1.5, C*3);
      if(night){
        const tX=((cx<<4)+px2)>>5, tY=((cy<<4)+py2)>>5;
        if(POWER.at(tX,tY).live){
          g.fillStyle='rgba(255,196,90,0.9)';
          g.fillRect(bx+px2*C+C*0.1, by+(py2-2)*C+C*0.3, Math.max(2,C*0.32), Math.max(2,C*0.32));
          g.fillStyle='rgba(255,170,60,0.16)';
          g.beginPath(); g.ellipse(bx+px2*C+C*0.5, by+py2*C+C*0.5, C*1.7, C*1.2, 0, 0, 7); g.fill();
        }
      }
    }
  }"""
decoded = decoded.replace(BLOCK_OLD, BLOCK_NEW, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('lamp posts standing: %d blessed bodies embedded, staggered-law placement, live head glow at night' % len(LAMPS))
