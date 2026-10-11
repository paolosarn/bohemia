#!/usr/bin/env python3
"""COOK TWO [the curb has height] (Paolo 10/10, his vote on the borderless street: 'Not final keep going also you
know a sidewalk curb is a little elevated from the street too'; rules 100, 101, 104b, 108; records/ only).
NOTHING DRAWN (rule 108a). THE PACK'S OWN CURB: every slab in '1. Cracked contrete tiles' is drawn RAISED, its
south face showing as the bottom 7 rows of the tile (lum 0-160 against ~330 on top; the study page). That band
IS a curb face seen at 45 degrees. So the curb here is his slab's own south face, lifted off his tiles and laid
along the sidewalk's edge where the eye can see a face (the edge facing south, scaled by how much it faces
south round the corner); a west-facing edge shows only its lit lip, as the pack's slabs do on their sides.
The shadow is his road's own darkest twentieth, 3 px, cast south (his light is from the top).
The corner and the borderless cut are the corner tool's (reused, not copied).
  python3 tools/bohemia_cook2_the_curb_has_height_10_11_26.py
"""
import json, base64, io, os
import numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = os.path.join(R, 'tools/bohemia_cook2_the_corner_one_at_a_time_10_10_26.py')
src = open(spec).read().split('\n# the plan:')[0]           # packs, UP, the per-side cut, the fields, LIP, SHADOW
C = {'__file__': spec}; exec(compile(src, spec, 'exec'), C)
SW, packs, walk, road, TW, TH, SX, SY = C['SW'], C['packs'], C['walk'], C['road'], C['TW'], C['TH'], C['SX'], C['SY']
LIP, SHADOW = C['LIP'], C['SHADOW']
FH = 7                                                       # his south face, measured: 7 rows

# his curb face, lifted: the bottom 7 rows of his slabs, sides cut, end to end
faces = []
for i in (0, 1, 2, 6, 7):
    a = np.asarray(Image.open(io.BytesIO(base64.b64decode(packs[SW][i]['b64']))).convert('RGB'))
    faces.append(a[a.shape[0] - FH:, 5:a.shape[1] - 5])
FACE = np.concatenate(faces * 4, axis=1).astype(float)      # long enough to run the whole sheet

W1 = TH; RAD = int(1.5 * TH); cx = cy = W1 + RAD
yy, xx = np.mgrid[0:SY, 0:SX]
d = np.hypot(xx - cx, yy - cy); inner = (xx < cx) & (yy < cy)
is_walk = (yy < W1) | (xx < W1) | (inner & (d > RAD))
img = np.where(is_walk[..., None], walk, road).astype(float)
edge = np.where(inner, RAD - d, np.where(xx >= cx, yy - W1, xx - W1))      # >0 = into the road, everywhere
# how much the edge faces south (the eye's side at 45 degrees): 1 on the north walk's edge, 0 on the west walk's,
# (cy - y) / RAD round the arc
south = np.where(inner, np.clip((cy - yy) / np.maximum(d, 1), 0, 1), np.where(xx >= cx, 1.0, 0.0))
fh = np.round(FH * south).astype(int)                                    # the face's height at this column
u = np.where(inner, (np.arctan2(cy - yy, cx - xx) * RAD).astype(int), xx) % FACE.shape[1]
face_row = edge - 1                                                      # 0 at the walk's edge
on_face = (edge >= 1) & (face_row < fh) & (fh > 0)
# sample his face: row scaled so a shallow face still shows his top and bottom rows
fr = np.where(fh > 0, (face_row * FH / np.maximum(fh, 1)).astype(int), 0).clip(0, FH - 1)
img[on_face] = FACE[fr[on_face], u[on_face]]
# the lip: his slab's lit edge, 1 px, on every edge (the west edge shows only this, as his slab sides do)
lip = (edge > -2) & (edge <= 0); img[lip] = img[lip] * 0.3 + LIP * 0.7
# the shadow the raised walk throws on the road, below the face, 3 px, his road's darkest
sh = (edge > fh) & (edge <= fh + 3) & (south > 0.15); img[sh] = img[sh] * 0.45 + SHADOW * 0.55
out = img.clip(0, 255).astype(np.uint8)

# the twin: his slab raw (its south face is the curb) at 1:1, and the sheet he voted up (no borders, flat)
tw = Image.new('RGB', (96 * 2 + 4, 96), (14, 14, 14))
for k, i in enumerate((0, 1)):
    tw.paste(Image.open(io.BytesIO(base64.b64decode(packs[SW][i]['b64']))).convert('RGB'), (k * 98, 0))
before = Image.open(os.path.join(R, 'records/target/COOK2_THE_CORNER_CANDIDATE.png')).convert('RGB')
sheet = Image.new('RGB', (tw.width + 16 + before.width + 16 + SX, SY + 70), (14, 14, 14)); dr = ImageDraw.Draw(sheet)
x = 0
for lab, im in (('HIS SLAB: its dark bottom band is a raised edge', tw), ('BEFORE: flat (the sheet you voted up)', before), ('AFTER: the curb stands up, his own face', Image.fromarray(out))):
    sheet.paste(im, (x, 50)); dr.text((x + 2, 8), lab, fill=(235, 235, 235)); x += im.width + 16
dr.text((2, 26), 'ONE QUESTION: does the sidewalk stand up off the street?', fill=(235, 200, 120))
sheet.save(os.path.join(R, 'records/target/COOK2_ONE_AT_A_TIME_THE_CURB.png'))
Image.fromarray(out).save(os.path.join(R, 'records/target/COOK2_THE_CURB_CANDIDATE.png'))
m = dict(face_rows=FH, face_from=[SW, [0, 1, 2, 6, 7]], shadow_px=3, face_px=int(on_face.sum()), lip_px=int(lip.sum()), shadow_count=int(sh.sum()))
json.dump(m, open(os.path.join(R, 'records/BOHEMIA_COOK2_THE_CURB_MEASURED_10_11_26.json'), 'w'), indent=1); print(m)
