"""THE VOTE CARD FOR EACH SLOT ITS OWN PICTURE (UI FIVE 11/22, rule 474): the two shots of the armourer after one buy, the old
painter's on top and now below, each under a one-line label, written as lossless WebP for the VOTE tab.
python3 tools/bohemia_ui_five_each_slot_its_own_picture_card.py <the shots' folder> <out.webp>"""
import sys
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
a = Image.open(src + '/before.png').convert('RGB')
b = Image.open(src + '/now.png').convert('RGB')
W = max(a.width, b.width)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 30)
except OSError:
    font = ImageFont.load_default()
LAB = 60
card = Image.new('RGB', (W, LAB + a.height + LAB + b.height), (18, 14, 10))
d = ImageDraw.Draw(card)
d.text((16, 12), 'BEFORE: ONE BUY AND THE PICTURES SLIDE ONTO WRONG PIECES', fill=(230, 120, 100), font=font)
card.paste(a, (0, LAB))
d.text((16, LAB + a.height + 12), 'NOW: EVERY SLOT WEARS ITS OWN PIECE', fill=(160, 210, 140), font=font)
card.paste(b, (0, LAB + a.height + LAB))
card.save(out, 'WEBP', lossless=True)
print(out, card.size)
