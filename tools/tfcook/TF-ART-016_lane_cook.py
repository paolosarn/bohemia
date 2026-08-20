#!/usr/bin/env python3
"""THE O&M TWO-TRACK — TF-ART-016's fifth member, the folded one, shipped.

THE JOB: the form's member 5 folded into the approved yard gravel as a
DRESSING, not a second gravel family - and this is the dressing. A dead
plant's service lanes keep their two compacted WHEEL TRACKS and the pale
crown between them forever, because compacted caliche does not heal
(form section D: in rain the tracks hold water in two long strips while
the crown stays pale - that contrast is baked dry here as value only).
Sites measured: solar 'gravel access road' x8989 per cell, battery /
substation / reclaim 'access road' x355-555. RGBA overlays riding the
bought yard gravel: two darker rut bands, the faint pale crown, nothing
else - one stone is one pixel, so no stones are drawn (form's own
budget). Horizontal and vertical variants; the wiring picks the axis from
the lane's own continuation and lays both at a junction.

REUSE CHECK: (bank OPENED in code)
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - yard_0: the
    approved dead gravel these ruts compact into; the rut and crown values
    are ITS values shifted, so the dressing can never step off the ground
    it rides.
TASTE CHECK: value work only; no keyline, no dither; ruts fade at the
edges (a tire path, not painted lines); nothing green.

  python3 tools/tfcook/TF-ART-016_lane_cook.py
    -> banks/tileforms/TF-ART-016_LANE_VOLUME_8_20_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-016_LANE_VOLUME_8_20_26.json')
C = 44

st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
im0 = Image.open(io.BytesIO(base64.b64decode(byid['yard_0']['b64'].split(',')[-1]))).convert('RGBA')
px0 = im0.load(); tot=[0,0,0]; n=0
for y in range(im0.height):
    for x in range(im0.width):
        c=px0[x,y]
        if c[3]>200: tot=[tot[i]+c[i] for i in range(3)]; n+=1
YARD = tuple(v//n for v in tot)

def track(axis, v):
    im = Image.new('RGBA', (C, C), (0,0,0,0)); px = im.load(); r = random.Random(3030+v+(0 if axis=='h' else 7))
    RUT_C = [13, 29]                                  # the two wheel lines
    for a in range(C):                                # along the lane
        for b in range(C):                            # across the lane
            x,y = (a,b) if axis=='h' else (b,a)
            dmin = min(abs(b-RUT_C[0]), abs(b-RUT_C[1]))
            if dmin <= 2:
                alpha = 66 - 16*dmin + r.randint(-8,8)      # compacted, darker
                if alpha>0: px[x,y] = tuple(int(c*0.6) for c in YARD) + (max(0,alpha),)
            elif abs(b-21) <= 3 and r.random() < 0.8:
                px[x,y] = tuple(min(255,int(c*1.14)) for c in YARD) + (34,)   # the pale crown
    return im

def b64(im):
    buf = io.BytesIO(); im.save(buf,'PNG',optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles=[]
for axis in ('h','v'):
    for v in range(2):
        tiles.append({'name':'lane_track_%s_%d'%(axis,v),'b64':b64(track(axis,v))})
json.dump({
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-016 '
           '(the form itself folded member 5 into the approved gravel as a '
           'dressing - this is the dressing). Rut and crown values derived '
           'from the approved yard gravel itself. '
           'tools/tfcook/TF-ART-016_lane_cook.py',
    'family': 'TF-ART-016', 'cooked': '8/20/26', 'tiles': tiles,
}, open(OUT,'w'))
print('banked %d lane pieces -> %s (YARD=%s)'%(len(tiles),OUT,YARD))
