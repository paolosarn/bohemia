#!/usr/bin/env python3
"""PARKED TRAILERS — the industrial yard's 28 dead semi-trailers.

THE JOB: 'parked trailer' x1792 (measured 8/22), twenty-eight blobs and
every one EXACTLY 4x16 cells - a real 40-foot box trailer at 3m x 12m -
drawing as generic wall mass. One multi-cell RGBA prop (176x704), seen
from the 45 above: the sky-lit ribbed aluminium ROOF is the read, thin
lit west edge, dark east edge, the door end with its seams and latch
bars, the nose with its kingpin plate, a soft ground shadow off the east
and south. Three wear variants: bleached, patched, rust-bloomed. Volume
under TF-ART-002 (the corrugated-metal family - a trailer skin IS
corrugated aluminium).

REUSE CHECK: (banks OPENED in code)
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json - parapet_galv_run_n_a:
    the approved galvanised aluminium pale for the roof skin.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json - rail_plate_0: the
    approved rust for rib blooms and streaks.
TASTE CHECK: thirty summers - bleached ribs, blooms only at rib seams,
one odd patch panel; no keyline, no dither; no readable logos or fleet
numbers ever (the words are his); nothing green, no purple.

  python3 tools/tfcook/TF-ART-002_trailer_cook.py
    -> banks/tileforms/TF-ART-002_TRAILER_VOLUME_8_22_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(REPO, 'banks/tileforms/TF-ART-002_TRAILER_VOLUME_8_22_26.json')
CW, CH = 4*44, 16*44

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
ALU  = max(pools(bank_tile('banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json','parapet_galv_run_n_a')), key=lambda c: sum(c))
RUST = pools(bank_tile('banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json','rail_plate_0'))[0]

def dim(c,f): return tuple(max(0,min(255,int(v*f))) for v in c)
def noise(c,r,a=5):
    j=r.randint(-a,a); return tuple(max(0,min(255,v+j)) for v in c)

def trailer(v):
    im=Image.new('RGBA',(CW,CH),(0,0,0,0)); px=im.load(); r=random.Random(7070+v)
    x0,x1,y0,y1 = 8, CW-10, 6, CH-8
    base = dim(ALU, 1.05 if v==0 else 0.98)
    for y in range(y0,y1):
        for x in range(x0,x1):
            c=noise(base,r,4)
            if (y-y0)%12>=10: c=dim(c,0.82)              # the roof rib shadow line
            elif (y-y0)%12==0: c=dim(c,1.16)             # the rib crest
            t=(x-x0)/float(x1-x0)
            c=dim(c,1.06-0.14*t)                          # west lit, east falls off
            px[x,y]=c+(255,)
    if v==1:                                              # the patch panel
        pa,pb=r.randint(3,10),r.randint(3,10)
        for y in range(y0+pa*12,min(y1,y0+pa*12+40)):
            for x in range(x0+6,x1-6):
                px[x,y]=noise(dim(ALU,0.8),r,5)+(255,)
    if v==2:                                              # rust blooms at rib seams
        for k in range(26):
            bx2,by2=r.randint(x0+4,x1-5),r.randint(y0+4,y1-5)
            for dy in range(-2,5):
                for dx in range(-2,3):
                    if r.random()<0.5 and 0<=bx2+dx<CW and 0<=by2+dy<CH:
                        a=110-18*abs(dy)
                        if a>0: px[bx2+dx,by2+dy]=RUST+(a,)
    for x in range(x0,x1):                                # nose plate + door end
        for y in range(y0,y0+7):
            px[x,y]=noise(dim(ALU,0.8),r,4)+(255,)        # the nose (kingpin end)
        for y in range(y1-9,y1):
            px[x,y]=noise(dim(ALU,0.9),r,4)+(255,)        # the door frame band
    for y in range(y1-9,y1):
        px[(x0+x1)//2,y]=dim(ALU,0.6)+(255,)              # the door seam
        px[(x0+x1)//2+1,y]=dim(ALU,1.1)+(255,)
    for k in range(3):                                    # latch bars on the doors
        lx=x0+10+k*((x1-x0-20)//2)
        for y in range(y1-8,y1-1):
            px[lx,y]=dim(ALU,0.55)+(255,)
    for y in range(y0,y1):                                # side edges
        px[x0,y]=dim(ALU,1.22)+(255,)
        px[x1-1,y]=dim(ALU,0.5)+(255,)
    for y in range(y0+2,y1+4):                            # ground shadow east+south
        for k in range(4):
            x=x1+k
            if x<CW: px[x,min(y,CH-1)]=(12,10,8,66-14*k)
    for x in range(x0+2,x1+4):
        for k in range(4):
            y=y1+k
            if y<CH: px[x,y]=(12,10,8,66-14*k)
    return im

def b64(im):
    buf=io.BytesIO(); im.save(buf,'PNG',optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles=[{'name':'trailer_box_%d'%v,'b64':b64(trailer(v))} for v in range(3)]
json.dump({
 'law':'APPROVED per EVERYTHING IS A THUMB 8/9, volume under TF-ART-002 (the '
       'corrugated-metal family): 28 parked semi-trailers, all 4x16 cells, '
       'drew as wall mass. Aluminium from the approved galv, rust from the '
       'approved rail plate; no logo, no fleet number ever. '
       'tools/tfcook/TF-ART-002_trailer_cook.py',
 'family':'TF-ART-002','cooked':'8/22/26','tiles':tiles,
},open(OUT,'w'))
print('banked %d trailers -> %s'%(len(tiles),OUT))
