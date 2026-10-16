"""THE PHONE'S CRACK, the finding sheet (UI [the phone's crack], 10/16/26). Composes, draws nothing: the phone now, then
candidates A to D (his pack 5 glass laid on it in the browser) at 1:1 on his phone, and the windows they were cut from.
python3 tools/bohemia_ui_the_phones_crack_sheet.py <dir with phone_now.png phone_A..D.png>"""
import sys, json
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
AMB, INK, BG = (240, 196, 106, 255), (242, 228, 198, 255), (28, 24, 20, 255)
shots = [('NOW', 'phone_now.png'), ('A: one star', 'phone_A.png'), ('B: a shattered pane', 'phone_B.png'), ('C: a tall pane', 'phone_C.png'), ('D: five stars on the old path', 'phone_D.png')]
ims = [(t, Image.open(S + '/' + n).convert('RGBA')) for t, n in shots]
cuts = json.load(open('records/target/ui_the_phones_crack/cuts.json'))
wins = sorted(set(c['src'] for c in cuts.values() if c['src'].startswith('reference/')))
W = sum(i.width + 16 for _, i in ims) + 16
sh = Image.new('RGBA', (W, 2000), BG); d = ImageDraw.Draw(sh)
d.text((16, 10), "THE PHONE'S CRACK FROM HIS PACK: A FINDING, NOT A CANDIDATE  (UI, 1 art px = 1 phone px)", font=F, fill=AMB)
lines = ["His pack 5 'Windows and broken glass' is the only broken glass in the approved 1,927 tiles. Cut whole and laid on the phone:",
         "each star is 8 to 25 points on a 156-point phone, and its sky-blue window glass reads as frost on black, not a crack.",
         "A running crack would need drawn lines between the stars, which rule 108 forbids. Not sent to VOTE; round two (F, G) uses his cracked-floor pack instead."]
for i, l in enumerate(lines): d.text((16, 40 + i * 20), l, font=f, fill=INK)
x, y = 16, 112
for t, i in ims:
    d.text((x, y), t, font=f, fill=AMB); sh.alpha_composite(i, (x, y + 24)); x += i.width + 16
y += 24 + ims[0][1].height + 24
d.text((16, y), 'THE TWINS, 1:1: the windows the cuts came from', font=f, fill=INK); y += 26; x = 16
for w in wins:
    im = Image.open(w).convert('RGBA'); sh.alpha_composite(im, (x, y)); d.text((x, y + 100), w.split('_')[-1][:-4], font=f, fill=AMB); x += im.width + 24
y += 130
sh = sh.crop((0, 0, W, y)); out = 'records/target/ui_the_phones_crack/UI_THE_PHONES_CRACK_FINDING.png'; sh.save(out); print(out, sh.size)
