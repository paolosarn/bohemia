"""THE VOTE CARD FOR THE UI HOLDS ITS FRAMES (UI FIVE 11/26, rule 480(c)): frames a second on the slowed phone (the demo, 390 x 844, the
CPU slowed four times), before and now, for each UI change measured; paired horizontal bars, a legend and direct value labels; the
palette's dark slots 1 and 2 (validated with the dataviz skill's validator, all checks pass on #191919). Written as lossless WebP.
python3 tools/bohemia_ui_five_the_ui_holds_its_frames_card.py <out.webp>"""
import sys
from PIL import Image, ImageDraw, ImageFont

ROWS = [  # (change, before, now): the probe's midpoints, records/BOHEMIA_UI_FIVE_THE_UI_HOLDS_ITS_FRAMES_11_26_26.md
    ('THE SHOP STANDING OPEN', 11, 26),
    ('A WEAPON TAPPED', 8.5, 19),
    ('ITS MORE (THE LONG CARD)', 7.8, 27),
    ('A BUY (TWO TAPS)', 8.9, 21.5),
    ('AN ARMOUR PIECE TAPPED', 9.6, 21),
    ('THE SHEET GOES', 9.9, 14.5),
    ('THE CREW SCREEN, HIS GEAR TAPPED', 7, 20),
    ('THE CREW SCREEN, LOOKING ROUND', 6.5, 22.5),
]
SURF, INK, INK2, GRID = (25, 25, 25), (239, 239, 239), (156, 156, 156), (56, 56, 56)
BEFORE, NOW = (0xE7, 0x66, 0x24), (0x33, 0x8C, 0xED)
W, H, S = 1200, 820, 1
try:
    F = lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', n)
    FB = lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', n)
except OSError:
    F = FB = lambda n: ImageFont.load_default()
im = Image.new('RGB', (W, H), SURF); d = ImageDraw.Draw(im)
d.text((40, 28), 'FRAMES A SECOND ON A SLOWED PHONE', fill=INK, font=FB(30))
d.text((40, 70), 'the demo, 390 x 844, the CPU slowed four times; more is smoother', fill=INK2, font=F(20))
# legend (two series: always present)
lx = 40
for name, col in (('before', BEFORE), ('now', NOW)):
    d.rounded_rectangle((lx, 112, lx + 18, 130), radius=4, fill=col); d.text((lx + 26, 108), name, fill=INK, font=F(20)); lx += 130
X0, X1, MAX = 470, 1120, 30.0
y = 160; BH, GAP, ROW = 22, 2, 76
# recessive grid at 10, 20, 30
for v in (0, 10, 20, 30):
    gx = X0 + (X1 - X0) * v / MAX; d.line((gx, y - 8, gx, y + ROW * len(ROWS) - 20), fill=GRID, width=1); d.text((gx - 8, y + ROW * len(ROWS) - 14), str(v), fill=INK2, font=F(16))
for name, b, n in ROWS:
    d.text((40, y + 12), name, fill=INK, font=F(19))
    for i, (v, col) in enumerate(((b, BEFORE), (n, NOW))):
        top = y + i * (BH + GAP); x2 = X0 + (X1 - X0) * v / MAX
        d.rounded_rectangle((X0, top, max(X0 + 6, x2), top + BH), radius=4, fill=col)
        d.rectangle((X0, top, X0 + 4, top + BH), fill=col)   # square end at the baseline, rounded at the data end
        d.text((x2 + 8, top + 1), ('%g' % v), fill=INK, font=F(17))
    y += ROW
im.save(sys.argv[1], 'WEBP', lossless=True)
print(sys.argv[1], im.size)
