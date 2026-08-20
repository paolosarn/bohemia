#!/usr/bin/env python3
"""SEATING ROWS — the stadium bowl and the school bleachers, ranked next.

THE JOB: stadium 'seating / stands (the bowl)' x2499 and school
'bleachers' x303 are structure cells falling to the generic wall mass -
the biggest single surface at the stadium reads as a blank block field.
A stand at the 45 view is RAKED ROWS: bench after bench stepping toward
the field, each bench a lit top edge over its own shadow, an aisle stair
strip breaking the run. Volume under TF-ART-005 (the family that owns
the stadium's surfaces - turf, lines, and now the seats that watch them).
Two orientations (rows run parallel to the field edge); the wiring picks
per cell from the blob's own continuation. Stands are NEUTRAL WARM GRAY
by the stadium's own dossier note (PURPLE RESERVATION - never purple).

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galvanised steel - school bleachers ARE metal bleachers
    by the district's own legend, so the bench metal is that grey.
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json - kerb_return_ne:
    the approved pale concrete for the aisle stair strips and the warm
    grey concrete rake of the stadium bowl.
TASTE CHECK: thirty summers - bleached benches, the odd missing plank
(1 in 13) showing the dark under-structure; no keyline, no dither; the
row rhythm is declared structure, not stipple; nothing green, no purple.

  python3 tools/tfcook/TF-ART-005_seating_cook.py
    -> banks/tileforms/TF-ART-005_SEATING_VOLUME_8_21_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-005_SEATING_VOLUME_8_21_26.json')
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
GALV = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json','parapet_galv_run_n_a')), key=lambda c: sum(c))
PALE = max(pools(bank_tile('banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json','kerb_return_ne')), key=lambda c: sum(c))
WARM = tuple(int(0.6*p+0.4*g) for p,g in zip(PALE,GALV))   # the bowl's neutral warm grey

def dim(c,f): return tuple(max(0,min(255,int(v*f))) for v in c)
def noise(c,r,a=5):
    j=r.randint(-a,a); return tuple(max(0,min(255,v+j)) for v in c)

def rows(axis, v, metal):
    im=Image.new('RGBA',(C,C),(0,0,0,0)); px=im.load(); r=random.Random(5050+v+(9 if metal else 0)+(70 if axis=='v' else 0))
    base = GALV if metal else WARM
    P=6                                                    # bench pitch
    for a in range(C):                                     # along the rows
        for b in range(C):                                 # across the rake
            x,y=(a,b) if axis=='h' else (b,a)
            k=b%P
            if k==0:   c=dim(base,1.24)                    # the lit bench top edge
            elif k==1: c=noise(base,r,4)                   # the seat plank
            elif k==2: c=dim(base,0.62)                    # its shadow
            else:      c=noise(dim(base,0.88),r,4)         # the tread
            # a missing plank: dark understructure shows
            if k<=1 and ((a//15)+(b//P)*7+v)%13==0 and (a%15)<9:
                c=dim((20,18,16),1.0)
            px[x,y]=c+(255,)
    return im

def aisle(axis):
    im=Image.new('RGBA',(C,C),(0,0,0,0)); px=im.load(); r=random.Random(5151+(1 if axis=='v' else 0))
    W=10
    for a in range(C):
        for k in range(W):
            b=(C-W)//2+k
            x,y=(a,b) if axis=='h' else (b,a)
            # steps every bench pitch: a stair nose line
            c=noise(dim(PALE,1.0),r,4)
            if (a%6)==0: c=dim(PALE,1.22)
            elif (a%6)==1: c=dim(PALE,0.7)
            px[x,y]=c+(255,)
    return im

def b64(im):
    buf=io.BytesIO(); im.save(buf,'PNG',optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles=[]
for axis in ('h','v'):
    for v in range(2):
        tiles.append({'name':'seat_rows_%s_%d'%(axis,v),'b64':b64(rows(axis,v,False))})
        tiles.append({'name':'bleach_rows_%s_%d'%(axis,v),'b64':b64(rows(axis,v,True))})
    tiles.append({'name':'seat_aisle_%s'%axis,'b64':b64(aisle(axis))})
json.dump({
 'law':'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-005 (the '
       'stadium family): the bowl x2499 and the school bleachers x303 fell to '
       'the generic wall mass. Bench metal from the approved galv, rake grey '
       'from the approved pale concrete - neutral warm gray per the stadium '
       'dossier, never purple. tools/tfcook/TF-ART-005_seating_cook.py',
 'family':'TF-ART-005','cooked':'8/21/26','tiles':tiles,
},open(OUT,'w'))
print('banked %d seating pieces -> %s'%(len(tiles),OUT))
