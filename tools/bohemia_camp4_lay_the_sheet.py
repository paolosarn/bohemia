#!/usr/bin/env python3
"""THE CAMP WAITS FOR YOU -- the VOTE card's sheet (CAMP FOUR, 11/22/26, VAMILY rule 472).
Lays the shots tools/bohemia_camp4_capture_the_camp_waits.js took into one sheet: the upright row on top, the row on its side under it,
each shot captioned with what it shows, its time from the MAKE CAMP tap and the camp's clock. A strip of the measured load (before and
after) runs along the foot.
  python3 tools/bohemia_camp4_lay_the_sheet.py SHOTDIR OUT.webp "BEFORE LINE" "AFTER LINE"
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

shots, out = sys.argv[1], sys.argv[2]
before = sys.argv[3] if len(sys.argv) > 3 else ''
after = sys.argv[4] if len(sys.argv) > 4 else ''
idx = json.load(open(os.path.join(shots, 'index.json')))
def font(n):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf']:
        if os.path.exists(f): return ImageFont.truetype(f, n)
    return ImageFont.load_default()
F, FS = font(22), font(18)
INK, PAPER, RED = (236, 224, 196), (18, 14, 10), (214, 60, 44)
def clk(m):
    if m is None: return ''
    m = int(m); d, r = divmod(m, 1440); return 'DAY %d %02d:%02d' % (d, r // 60, r % 60)
rows = []
for way in ['upright', 'side']:
    row = [q for q in idx if q['way'] == way]
    row = [q for i, q in enumerate(row) if not (i and q.get('t') is not None and q.get('t') == row[i - 1].get('t'))]   # one shot of one moment
    if not row: continue
    H = 640 if way == 'upright' else 300
    cells = []
    for q in row:
        im = Image.open(q['file']).convert('RGB'); w = round(im.width * H / im.height); im = im.resize((w, H), Image.LANCZOS)
        fn = FS if w < 420 else F
        words, lines, cur = q['label'].split(' '), [], ''
        for wd in words:   # the caption wrapped to the shot's width, never cut
            t = (cur + ' ' + wd).strip()
            if fn.getlength(t) > w - 14 and cur: lines.append(cur); cur = wd
            else: cur = t
        lines.append(cur)
        CH = 16 + 24 * len(lines) + 28
        cap = Image.new('RGB', (w, CH), PAPER); g = ImageDraw.Draw(cap)
        for i, L in enumerate(lines): g.text((8, 6 + 24 * i), L, font=fn, fill=INK)
        g.text((8, 10 + 24 * len(lines)), ((('+%.1f S  ' % (q['t'] / 1000.0)) if q.get('t') is not None else '') + clk(q.get('clock'))), font=FS, fill=RED)
        c = Image.new('RGB', (w, H + CH), PAPER); c.paste(im, (0, 0)); c.paste(cap, (0, H)); cells.append(c)
    W = sum(c.width for c in cells) + 12 * (len(cells) + 1); R = Image.new('RGB', (W, max(c.height for c in cells) + 24), PAPER); x = 12
    for c in cells: R.paste(c, (x, 12)); x += c.width + 12
    rows.append(R)
W = max(r.width for r in rows); foot = 96
S = Image.new('RGB', (W, sum(r.height for r in rows) + foot), PAPER); y = 0
for r in rows: S.paste(r, (0, y)); y += r.height
g = ImageDraw.Draw(S)
g.text((14, y + 10), 'BEFORE: ' + before, font=F, fill=(170, 150, 120))
g.text((14, y + 50), 'AFTER:  ' + after, font=F, fill=INK)
S.save(out, 'WEBP', quality=86, method=6)
print(out, S.size)
