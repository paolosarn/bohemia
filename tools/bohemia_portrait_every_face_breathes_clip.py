#!/usr/bin/env python3
"""PORTRAIT [every face breathes] (rule 246, 10/26/26): the clip's frames (recorded off the VOTE page by
tools/bohemia_portrait_every_face_breathes_clip.js) into one animated WebP, one art pixel to one pixel (rule 89): per man,
his face today (still, the file the game draws) beside the same face as the painter draws it now, at 128 and at the 64 thumb.
Run through the .js (it records, then calls this with its plan)."""
import json
import os
import sys

from PIL import Image, ImageDraw

plan = json.load(open(sys.argv[1]))
ROOT = sys.argv[2]
INK, DIM, BG, CELL = (226, 214, 190), (150, 142, 128), (24, 22, 20), (52, 48, 44, 255)
G = 8
COLS = [128, 128, 64, 64]
W = G + sum(c + G for c in COLS) + 4
TOP = 44
ROW = 128 + 22
H = TOP + ROW * len(plan['men']) + G


def cell(im, n):
    bg = Image.new('RGBA', (n, n), CELL)
    if im is not None:
        bg.alpha_composite(im.convert('RGBA').resize((n, n), Image.NEAREST) if im.size != (n, n) else im.convert('RGBA'))
    return bg.convert('RGB')


today = [{n: Image.open(os.path.join(ROOT, d, 'rest_%d.png' % n)) for n in (128, 64)} for d in plan['today']]
base = Image.new('RGB', (W, H), BG)
dr = ImageDraw.Draw(base)
dr.text((G, 6), 'EVERY FACE BREATHES: his face today (still) | the same face now, breathing on the beat', fill=INK)
dr.text((G, 22), '128 and the 64 thumb, 1:1 | 15 breaths a minute, a blink every 3 to 6 s, a hurt man winces', fill=DIM)
for r, (look, name) in enumerate(plan['men']):
    y = TOP + r * ROW
    x = G
    for c, n in enumerate(COLS):
        if c in (0, 2): base.paste(cell(today[r][n], n), (x, y))
        x += n + G
    dr.text((G, y + 130), name + '   TODAY | NOW', fill=INK)
frames, durs = [], []
for f in plan['frames']:
    im = base.copy()
    for r in range(len(plan['men'])):
        y = TOP + r * ROW
        x = G + 128 + G
        a = f['files'][r * 2]; b = f['files'][r * 2 + 1]
        if a: im.paste(cell(Image.open(a), 128), (x, y))
        x2 = G + 128 + G + 128 + G + 64 + G
        if b: im.paste(cell(Image.open(b), 64), (x2, y))
    frames.append(im); durs.append(int(f['ms']))
frames[0].save(plan['out'], save_all=True, append_images=frames[1:], duration=durs, loop=0, lossless=True, method=4)
print('clip', os.path.relpath(plan['out'], ROOT), base.size, len(frames), 'frames', sum(durs), 'ms')
