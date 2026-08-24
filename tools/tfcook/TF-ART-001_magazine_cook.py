#!/usr/bin/env python3
"""EARTH-COVERED MAGAZINES — the arsenal's twelve ammunition igloos.

THE JOB: 'earth-covered magazine' x1372 (measured 8/23) - twelve blobs,
each ~19x16 cells (a real 14x12m igloo), drawing as generic civic mass.
A real magazine is a concrete barrel vault buried under graded earth: the
read from the 45 above is a long EARTH MOUND - lit crest, falling flanks,
scrubby edges - with a pale concrete HEADWALL on the south face and one
dark steel blast door. Pieces are position-banded earth tiles (crest /
mid / edge north / edge south approach), a headwall band, and the door
overlay; the wiring reads each cell's place in its own mound by walking
to the blob edges. Volume under TF-ART-001 (the block/bunker family).

REUSE CHECK: (banks OPENED in code)
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - dirt + yard_0:
    the approved ground pair IS the mound's earth; the bands only shift
    its value (a mound is the same dirt, lit differently).
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete for the headwall.
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    steel greys for the blast door.
TASTE CHECK: dead brush clumps on the flanks, never green; no keyline,
no dither - the mound reads from its value bands; no markings or unit
numbers on the headwall (words are his).

  python3 tools/tfcook/TF-ART-001_magazine_cook.py
    -> banks/tileforms/TF-ART-001_MAGAZINE_VOLUME_8_23_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-001_MAGAZINE_VOLUME_8_23_26.json')
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

st = json.load(open(os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
byid = {t['id']: t for t in st['tiles']}
EARTH = pools(load_b64(byid['dirt']['b64']))[0]
def bank_tile(path, nm):
    d = json.load(open(os.path.join(REPO, path)))
    for t in d['tiles']:
        if t['name'] == nm: return load_b64(t['b64'])
CONC = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json','kerb_return_ne')), key=lambda c: sum(c))
GALV = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json','parapet_galv_run_n_a')), key=lambda c: sum(c))

def dim(c,f): return tuple(max(0,min(255,int(v*f))) for v in c)
def noise(c,r,a=6):
    j=r.randint(-a,a); return tuple(max(0,min(255,v+j)) for v in c)

def earth(band, v):
    # first render read as flat pale ROAD: one value per band, +-6 noise,
    # base dirt pool far brighter than the desert around it. The berm reads
    # from VALUE STEPS between bands (dark flanks, lit crest) and from
    # chunky earth mottle, so: base pulled down toward the desert, band
    # separation widened, and fist-size light/dark mottle over the field.
    f = {'crest':1.1,'mid':0.92,'edge_n':0.72,'edge_s':0.78}[band]
    im=Image.new('RGBA',(C,C),(0,0,0,0)); px=im.load(); r=random.Random(8080+v+hash(band)%97)
    for y in range(C):
        for x in range(C):
            c=noise(dim(EARTH,f),r,9)
            px[x,y]=c+(255,)
    for k in range(r.randint(5,7)):                         # graded-earth mottle
        mx,my=r.randint(0,C-9),r.randint(0,C-7)
        mf=r.choice((0.85,0.9,1.08,1.12))
        for dy in range(r.randint(4,6)):
            for dx in range(r.randint(5,8)):
                if r.random()<0.7:
                    px[mx+dx,my+dy]=noise(dim(EARTH,f*mf),r,7)+(255,)
    scrub = 4 if 'edge' in band else 2
    for k in range(scrub):                                  # dead brush clumps
        bx2,by2=r.randint(4,C-8),r.randint(4,C-8)
        for dy in range(4):
            for dx in range(5):
                if r.random()<0.5:
                    px[bx2+dx,by2+dy]=noise(dim(EARTH,0.5),r,6)+(255,)
    return im

def headwall(v):
    im=Image.new('RGBA',(C,C),(0,0,0,0)); px=im.load(); r=random.Random(8181+v)
    for y in range(C):
        for x in range(C):
            f=1.12 if y<4 else 1.0
            c=noise(dim(CONC,f),r,4)
            if y>C-6: c=dim(c,0.7)                          # foot shade
            px[x,y]=c+(255,)
    for y in range(6,C,11):                                 # pour joints
        for x in range(C):
            px[x,y]=dim(CONC,0.82)+(255,)
    return im

def door():
    W=2*C
    im=Image.new('RGBA',(W,C),(0,0,0,0)); px=im.load(); r=random.Random(8282)
    x0,x1,y0,y1=10,W-10,4,C-2
    for y in range(y0,y1):
        for x in range(x0,x1):
            c=noise(dim(GALV,0.55),r,5)
            if (x-x0)%22>=20: c=dim(GALV,0.4)               # the leaf seam
            if y<y0+3 or y>y1-3 or x<x0+3 or x>x1-3: c=dim(GALV,0.75)  # frame
            px[x,y]=c+(255,)
    for k in range(2):                                      # hinge straps
        hy=y0+8+k*16
        for x in range(x0+3,x1-3):
            if (x//6)%2==0: px[x,hy]=dim(GALV,0.85)+(255,)
    return im

def b64(im):
    buf=io.BytesIO(); im.save(buf,'PNG',optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles=[]
for band in ('crest','mid','edge_n','edge_s'):
    for v in range(2):
        tiles.append({'name':'mag_%s_%d'%(band,v),'b64':b64(earth(band,v))})
tiles.append({'name':'mag_head_0','b64':b64(headwall(0))})
tiles.append({'name':'mag_head_1','b64':b64(headwall(1))})
tiles.append({'name':'mag_door','b64':b64(door())})
json.dump({
 'law':'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-001 (the '
       'bunker family): twelve earth-covered magazines, ~19x16 each, drew as '
       'civic mass. Earth from the approved dirt, headwall from the approved '
       'pale concrete, door steel from the approved galv; no markings ever. '
       'tools/tfcook/TF-ART-001_magazine_cook.py',
 'family':'TF-ART-001','cooked':'8/23/26','tiles':tiles,
},open(OUT,'w'))
print('banked %d magazine pieces -> %s'%(len(tiles),OUT))
