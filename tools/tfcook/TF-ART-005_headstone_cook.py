#!/usr/bin/env python3
"""HEADSTONES — the cemetery's 925 graves, single cells, ranked next.

THE JOB: 'headstone' x925 (measured 8/21), every one a 1x1 prop cell,
drawing as a generic wall block standing in the new memorial lawn. A
headstone at the 45 view is a small standing slab: sun-lit top edge,
bleached face, its own soft foot shadow on the grass, thirty years of
lean on some. Three variants (upright slab, round-top, low marker), RGBA
over the lawn the cemetery already draws.

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete IS the stone - a desert headstone bleaches
    to the pavement's family, so the slab colour is that pale, shaded.
TASTE CHECK: no names, no dates, no readable anything on any face
(MECHANISM-MINE / CONTENTS-PAOLO'S - the dead are his to name); no
keyline, no dither; the odd stone leans (motivated: settling ground),
never broken glyphs.

  python3 tools/tfcook/TF-ART-005_headstone_cook.py
    -> banks/tileforms/TF-ART-005_HEADSTONE_VOLUME_8_21_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-005_HEADSTONE_VOLUME_8_21_26.json')
C = 44

def load_b64(b): return Image.open(io.BytesIO(base64.b64decode(b.split(',')[-1]))).convert('RGBA')
def pools(im, n=4):
    px = im.load(); seen = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > 200:
                k = (c[0]//14, c[1]//14, c[2]//14); seen.setdefault(k, []).append(c[:3])
    ps = sorted(seen.values(), key=len, reverse=True)[:n]
    return [tuple(sum(v[i] for v in p)//len(p) for i in range(3)) for p in ps]
def bank_tile(path, nm):
    d = json.load(open(os.path.join(REPO, path)))
    for t in d['tiles']:
        if t['name'] == nm: return load_b64(t['b64'])
STONE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json','kerb_return_ne')), key=lambda c: sum(c))

def dim(c,f): return tuple(max(0,min(255,int(v*f))) for v in c)
def noise(c,r,a=5):
    j=r.randint(-a,a); return tuple(max(0,min(255,v+j)) for v in c)

def stone(v):
    im=Image.new('RGBA',(C,C),(0,0,0,0)); px=im.load(); r=random.Random(6060+v)
    lean = r.choice((0,0,0,1,-1))                       # the odd stone leans
    if v==0:   x0,x1,y0,y1 = 15,29,10,36               # upright slab
    elif v==1: x0,x1,y0,y1 = 14,30,13,36               # round top
    else:      x0,x1,y0,y1 = 13,31,24,36               # low marker
    for y in range(y0,y1):
        dx = lean*(y1-y)//14
        for x in range(x0,x1):
            xx=x+dx
            if not (0<=xx<C): continue
            if v==1:                                    # round the top
                cy2=(x0+x1)/2.0; rr=(x1-x0)/2.0
                if y<y0+rr and ((x-cy2)**2+(y-(y0+rr))**2)>rr*rr: continue
            t=(x-x0)/float(x1-x0)
            f=1.12-0.34*t                               # lit left of the face
            c=noise(dim(STONE,f),r,5)
            if y<y0+3 and (v!=1): c=dim(STONE,1.28)     # the sun-lit top edge
            if x==x0: c=dim(STONE,1.2)
            if x==x1-1: c=dim(STONE,0.6)
            px[xx,y]=c+(255,)
    for x in range(x0-2,x1+3):                          # the foot shadow on the grass
        for y in range(y1,min(C,y1+3)):
            xx=x+lean
            if 0<=xx<C: px[xx,y]=(14,12,10,70)
    return im

def b64(im):
    buf=io.BytesIO(); im.save(buf,'PNG',optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles=[{'name':'headstone_%d'%v,'b64':b64(stone(v))} for v in range(3)]
json.dump({
 'law':'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-005 (the '
       'family that gave the cemetery its lawn): 925 single-cell headstones '
       'drew as wall blocks. Stone from the approved pale concrete; no name, '
       'no date, no glyph on any face - the dead are his to name. '
       'tools/tfcook/TF-ART-005_headstone_cook.py',
 'family':'TF-ART-005','cooked':'8/21/26','tiles':tiles,
},open(OUT,'w'))
print('banked %d headstones -> %s'%(len(tiles),OUT))
