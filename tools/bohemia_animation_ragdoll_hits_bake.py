#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [ragdoll hits]: pack the filmed frames (tools/bohemia_animation_ragdoll_hits_bake.js) into one
lossless strip the VOTE page plays: slices/vote/ANIMATION_RAGDOLL_HITS.webp, one row per (look, facing, kind), 13 cells
(the twelve drawn keys and the last), and _TABLE.js with the rows, the cell and every key's lift (px above the floor).
REFERENCE CHECK (the 9/4 standing duty): the frames are the alpha's own, packed, never redrawn.
usage: python3 tools/bohemia_animation_ragdoll_hits_bake.py <frames dir>
"""
import os, sys, json
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = sys.argv[1]
t = json.load(open(os.path.join(D, 'table.json')))
CW, CH = t['cell']; K = t['keys']
rows = []
for L in t['looks']:
    for dir in t['dirs']:
        for kind in t['kinds']:
            rows.append((L, dir, kind))
sheet = Image.new('RGBA', (CW * K, CH * len(rows)), (0, 0, 0, 0))
for r, (L, dir, kind) in enumerate(rows):
    for k in range(K):
        im = Image.open(os.path.join(D, '%s_%s_%s_k%02d.png' % (L, kind, dir, k))).convert('RGBA')
        sheet.paste(im, (k * CW, r * CH), im)
out = os.path.join(ROOT, 'slices/vote/ANIMATION_RAGDOLL_HITS.webp')
sheet.save(out, lossless=True, quality=100, method=6)
table = dict(cell=[CW, CH], keys=K, beats=t['beats'], kinds=t['kinds'], looks=t['looks'], dirs=t['dirs'],
             rows={'%s|%s|%s' % r: i for i, r in enumerate(rows)}, lifts=t['lifts'], ground_y=104)   # the 112 picture's ground line, as the ragdoll page draws it
open(os.path.join(ROOT, 'slices/vote/ANIMATION_RAGDOLL_HITS_TABLE.js'), 'w').write('window.RAGDOLL_HITS = ' + json.dumps(table) + ';\n')
maxlift = max(max(v) for d in t['lifts'].values() for v in d.values())
print(json.dumps(dict(webp=os.path.relpath(out, ROOT), rows=len(rows), size=sheet.size, max_lift=maxlift, bytes=os.path.getsize(out))))
