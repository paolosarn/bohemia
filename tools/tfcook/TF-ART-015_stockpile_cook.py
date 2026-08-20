#!/usr/bin/env python3
"""GYPSUM STOCKPILES — the quarry's product, ranked next by the inventory.

THE JOB: gypsum names 'stockpile' x3015 (measured 8/21) and it falls to
the gravel fallback - but a gypsum stockpile is the palest thing in the
valley: near-white crushed mineral in graded mounds. Two field tiles at
the 45 view: mound crests lit by the sky, south feet in their own soft
shade, conveyor-dropped ridge lines, a dusting of the same white bleeding
onto the ground at the pile edge. Volume under TF-ART-015 (the ground
family that owns worked industrial surfaces).

REUSE CHECK: (bank OPENED in code)
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete anchors the WHITE - gypsum reads one step
    paler and cooler than bleached concrete, so the pile colour is that
    pale lifted, never an invented white.
TASTE CHECK: value work, no keyline, no dither; the mounds read from
their lit crests and shaded feet, not from outlines; nothing green.

  python3 tools/tfcook/TF-ART-015_stockpile_cook.py
    -> banks/tileforms/TF-ART-015_STOCKPILE_VOLUME_8_21_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-015_STOCKPILE_VOLUME_8_21_26.json')
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
PALE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json','kerb_return_ne')), key=lambda c: sum(c))
GYP  = tuple(min(255, int(v*1.22)) for v in (PALE[0], PALE[1], PALE[2]+4))   # paler, a touch cooler

def dim(c,f): return tuple(max(0,min(255,int(v*f))) for v in c)
def noise(c,r,a=5):
    j=r.randint(-a,a); return tuple(max(0,min(255,v+j)) for v in c)

def pile(v):
    im = Image.new('RGBA',(C,C),(0,0,0,0)); px=im.load(); r=random.Random(4040+v)
    # a height field of two-three overlapping mounds
    mounds=[(r.randint(8,36), r.randint(8,36), r.randint(14,20)) for _ in range(3)]
    for y in range(C):
        for x in range(C):
            h=0.0
            for mx,my,mr in mounds:
                d=math.hypot(x-mx,y-my)
                if d<mr: h=max(h,1.0-d/mr)
            # sky light from upper-left: grade brightness by local slope
            hN=0.0; hW=0.0
            for mx,my,mr in mounds:
                dN=math.hypot(x-mx,(y-2)-my); dW=math.hypot((x-2)-mx,y-my)
                if dN<mr: hN=max(hN,1.0-dN/mr)
                if dW<mr: hW=max(hW,1.0-dW/mr)
            lit=(hN-h)+(hW-h)
            f=0.92+0.9*h*0.25+lit*1.4
            c=noise(dim(GYP,max(0.62,min(1.28,f))),r,4)
            if h<=0.02:
                if r.random()<0.25: c=noise(dim(GYP,0.9),r,6)   # the dust apron
                else: continue                                   # ground shows through
            px[x,y]=c+(255,)
    for mx,my,mr in mounds:                                      # the conveyor ridge line
        for k in range(-mr//2,mr//2):
            x=mx+k; y=my-abs(k)//3
            if 0<=x<C and 0<=y<C and px[x,y][3]:
                px[x,y]=dim(GYP,1.3)+(255,)
    return im

def b64(im):
    buf=io.BytesIO(); im.save(buf,'PNG',optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles=[{'name':'gyp_pile_%d'%v,'b64':b64(pile(v))} for v in range(3)]
json.dump({
 'law':'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-015 (the '
       'worked-ground family): gypsum names stockpile x3015 and drew gravel. '
       'White derived from the approved pale concrete, lifted - never an '
       'invented colour. tools/tfcook/TF-ART-015_stockpile_cook.py',
 'family':'TF-ART-015','cooked':'8/21/26','tiles':tiles,
},open(OUT,'w'))
print('banked %d stockpile tiles -> %s (GYP=%s)'%(len(tiles),OUT,GYP))
