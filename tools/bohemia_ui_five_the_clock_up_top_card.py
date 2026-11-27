"""THE VOTE CARD FOR THE CLOCK UP TOP (UI FIVE 11/27, rule 487): the demo upright, the top of the screen and the phone, before (the
day and the hour on the phone's first line, nothing at the top) and now (the clock at the bar's right end, the phone without it), and
the same now at night; three columns under one-line labels, written as lossless WebP. Each column is the bar's band and the phone, cut
from the full shot and stacked.
python3 tools/bohemia_ui_five_the_clock_up_top_card.py <folder with before.png now.png night.png> <out.webp>"""
import sys
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
def col(name):
    im = Image.open(src + '/' + name + '.png').convert('RGB'); w, h = im.size
    top = im.crop((0, 0, w, int(h * 0.10)))
    ph = im.crop((int(w * 0.52), int(h * 0.55), w, h))   # the phone, at the bottom right upright
    c = Image.new('RGB', (w, top.height + 12 + ph.height), (18, 14, 10)); c.paste(top, (0, 0)); c.paste(ph, (w - ph.width, top.height + 12)); return c
cols = [col('before'), col('now'), col('night')]
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 34)
except OSError:
    font = ImageFont.load_default()
LAB, GAP = 70, 24
W = sum(c.width for c in cols) + GAP * 2; H = max(c.height for c in cols)
card = Image.new('RGB', (W, LAB + H), (18, 14, 10)); d = ImageDraw.Draw(card)
x = 0
for c, (txt, ink) in zip(cols, [('BEFORE: THE TIME ON THE PHONE', (230, 120, 100)), ('NOW: THE TIME AT THE TOP', (160, 210, 140)), ('NOW, AT NIGHT', (185, 200, 230))]):
    d.text((x + 16, 16), txt, fill=ink, font=font); card.paste(c, (x, LAB)); x += c.width + GAP
card = card.resize((card.width // 2, card.height // 2), Image.LANCZOS)
card.save(out, 'WEBP', lossless=True); print(out, card.size)
