#!/usr/bin/env python3
"""THE LANDMARK CARD (COOK, 9/24/26).

One renderer for every landmark plan this lane cooks, so a card is rebuilt from the plan
instead of assembled by hand beside it. Round 5's Sphere card was hand-made outside its
tool, which means it could not be regenerated and could silently disagree with the bank.

It takes a small JSON job written by the cook (the plan already rendered to a PPM, a title,
a legend and the closing lines) and lays it out in the family the Sphere and the tower
already established: title, one line of subtitle, the plan big, swatches, and the sentence
that says what you are looking at.

REFERENCE CHECK: none. This draws no world art -- it is a page layout for a picture the cook
has already made, and every colour in it comes from that cook's own palette.
REUSE CHECK: reads a PPM and a JSON, writes one PNG, imports nothing of the game's.

    python3 tools/bohemia_landmark_card.py <job.json>
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont


def font(size, bold=False):
    """A real face where the box has one, the default bitmap where it does not. PIL's
    built-in font is one small size, and a title set in it is unreadable next to a 640 px
    plan -- the tower's and the Sphere's cards both set their titles large."""
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else ''),
              '/usr/share/fonts/truetype/freefont/FreeSans%s.ttf' % ('Bold' if bold else '')):
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

job = json.load(open(sys.argv[1]))
plan = Image.open(job['ppm']).convert('RGB')
PAD = int(job.get('pad', 26))
GAP = 16
SW = 24                                   # a legend swatch
F_TITLE, F_SUB, F_BODY = font(31, True), font(16), font(16)
ROW = 30

cols = 2
rows = (len(job['legend']) + cols - 1) // cols


def wide(text, f):
    """THE CARD IS MEASURED, NOT GUESSED. The first render sized the page off the plan and
    the closing lines ran straight off the right edge -- a card that cuts its own sentence in
    half has failed before he reads a word of it. Every string is measured here."""
    try:
        box = d0.textbbox((0, 0), text, font=f)
        return box[2] - box[0]
    except Exception:
        return len(text) * 8


d0 = ImageDraw.Draw(Image.new('RGB', (8, 8)))
need = max([wide(job['title'], F_TITLE), wide(job['sub'], F_SUB)]
           + [wide(l, F_BODY) for l in job['foot']]
           + [2 * (SW + 12 + wide(n, F_BODY)) + 30 for _, n in job['legend']])
CW = max(plan.size[0], int(need)) + PAD * 2
CH = (PAD + 40 + 26 + plan.size[1] + GAP + rows * ROW + GAP
      + len(job['foot']) * 22 + PAD)

card = Image.new('RGB', (CW, CH), (17, 16, 15))
d = ImageDraw.Draw(card)
y = PAD
d.text((PAD, y), job['title'], fill=(236, 231, 222), font=F_TITLE)
y += 40
d.text((PAD, y), job['sub'], fill=(150, 142, 130), font=F_SUB)
y += 26
card.paste(plan, ((CW - plan.size[0]) // 2, y))
y += plan.size[1] + GAP
colw = (CW - PAD * 2) // cols
for i, (hexcol, name) in enumerate(job['legend']):
    cx = PAD + (i % cols) * colw
    cy = y + (i // cols) * ROW
    rgb = tuple(int(hexcol[k:k + 2], 16) for k in (1, 3, 5))
    d.rectangle([cx, cy, cx + SW, cy + SW - 6], fill=rgb)
    d.text((cx + SW + 12, cy), name, fill=(206, 200, 190), font=F_BODY)
y += rows * ROW + GAP
for line in job['foot']:
    d.text((PAD, y), line, fill=(176, 154, 114), font=F_BODY)
    y += 22

os.makedirs(os.path.dirname(job['out']), exist_ok=True)
card.save(job['out'])
print('wrote %s  (%.0f KB)' % (os.path.relpath(job['out'], os.path.dirname(os.path.dirname(
    os.path.abspath(__file__)))), os.path.getsize(job['out']) / 1024))
