"""THE VOTE CARD FOR ONE HAND OR TWO (UI FIVE 11/22, rule 477): the smith with its dearest weapon tapped once, the old card on the left
and now on the right, each under a one-line label, written as lossless WebP for the VOTE tab.
python3 tools/bohemia_ui_five_one_hand_or_two_card.py <the shots' folder> <out.webp>"""
import sys
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
a = Image.open(src + '/before.png').convert('RGB')
b = Image.open(src + '/now.png').convert('RGB')
H = max(a.height, b.height)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 34)
except OSError:
    font = ImageFont.load_default()
LAB, GAP = 70, 24
card = Image.new('RGB', (a.width + GAP + b.width, LAB + H), (18, 14, 10))
d = ImageDraw.Draw(card)
d.text((16, 16), 'BEFORE: ABOUT 53 WORDS, NO HANDS', fill=(230, 120, 100), font=font)
card.paste(a, (0, LAB))
d.text((a.width + GAP + 16, 16), 'NOW: ONE OR TWO HANDS FIRST, 16 WORDS', fill=(160, 210, 140), font=font)
card.paste(b, (a.width + GAP, LAB))
card = card.resize((card.width // 2, card.height // 2), Image.LANCZOS)   # the phone's three pixels a point, halved for the tab
card.save(out, 'WEBP', lossless=True)
print(out, card.size)
