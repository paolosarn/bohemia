"""THE VOTE CARD FOR THE ALPHA SAYS CONTINUE (UI FIVE 11/26, ask row 738): the alpha upright after a reload over a saved game, before
(the new game's picks, whose BEGIN continued his game) and now (the title, NEW GAME and CONTINUE), side by side under a one-line label,
halved, written as lossless WebP for the VOTE tab.
python3 tools/bohemia_ui_five_the_alpha_says_continue_card.py <before.png> <now.png> <out.webp>"""
import sys
from PIL import Image, ImageDraw, ImageFont

a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB')
H = max(a.height, b.height)
try:
    font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 34)
except OSError:
    font = ImageFont.load_default()
LAB, GAP = 70, 24
card = Image.new('RGB', (a.width + GAP + b.width, LAB + H), (18, 14, 10)); d = ImageDraw.Draw(card)
d.text((16, 16), 'BEFORE: A NEW CREW, BUT BEGIN CONTINUES', fill=(230, 120, 100), font=font)
card.paste(a, (0, LAB))
d.text((a.width + GAP + 16, 16), 'NOW: NEW GAME OR CONTINUE', fill=(160, 210, 140), font=font)
card.paste(b, (a.width + GAP, LAB))
card = card.resize((card.width // 2, card.height // 2), Image.LANCZOS)
card.save(sys.argv[3], 'WEBP', lossless=True)
print(sys.argv[3], card.size)
