#!/usr/bin/env python3
"""THE CAMP COMES UP AT ONCE -- the VOTE card's strip (CAMP FOUR, 11/26/26, VAMILY rule 480 on rule 472(e)).
Lays the shots tools/bohemia_camp4_capture_at_once.js kept: one row a build (main's files over this build's), one shot a second from
the MAKE CAMP tap, each captioned with its second.
  python3 tools/bohemia_camp4_lay_the_strip.py OUT.webp "ROW LABEL" DIR1 "ROW LABEL" DIR2
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

out = sys.argv[1]
rows_in = list(zip(sys.argv[2::2], sys.argv[3::2]))
def font(n):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
        if os.path.exists(f): return ImageFont.truetype(f, n)
    return ImageFont.load_default()
F, FB = font(18), font(24)
INK, PAPER, RED = (236, 224, 196), (18, 14, 10), (214, 60, 44)
H = 520
rows = []
for label, d in rows_in:
    idx = json.load(open(os.path.join(d, 'index.json')))['index']
    cells = []
    for q in idx:
        im = Image.open(q['file']).convert('RGB'); w = round(im.width * H / im.height); im = im.resize((w, H), Image.LANCZOS)
        c = Image.new('RGB', (w, H + 34), PAPER); c.paste(im, (0, 0)); g = ImageDraw.Draw(c)
        g.text((8, H + 6), '+%d S' % q['k'], font=F, fill=RED if q['k'] else INK); cells.append(c)
    W = sum(c.width for c in cells) + 10 * (len(cells) + 1)
    R = Image.new('RGB', (W, H + 34 + 52), PAPER); g = ImageDraw.Draw(R); g.text((12, 12), label, font=FB, fill=INK); x = 10
    for c in cells: R.paste(c, (x, 48)); x += c.width + 10
    rows.append(R)
S = Image.new('RGB', (max(r.width for r in rows), sum(r.height for r in rows)), PAPER); y = 0
for r in rows: S.paste(r, (0, y)); y += r.height
S.save(out, 'WEBP', quality=86, method=6)
print(out, S.size)
