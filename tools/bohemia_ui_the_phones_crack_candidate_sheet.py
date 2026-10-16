"""THE PHONE'S CRACK, the candidate sheet (UI [the phone's crack], 10/16/26). Composes, draws nothing: the phone now and
candidates F and G (his pack 15 lava cracks recoloured to glass, laid in the browser) at 1:1 on his phone, then each cut beside
the pack tile it came from, 1:1. python3 tools/bohemia_ui_the_phones_crack_candidate_sheet.py <dir with phone_now/F/G.png>"""
import sys, json, glob, io, base64
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 20)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
AMB, INK, BG = (240, 196, 106, 255), (242, 228, 198, 255), (28, 24, 20, 255)
cuts = json.load(open('records/target/ui_the_phones_crack/cuts.json'))
def bank_tile(i):
    for g in sorted(glob.glob('banks/BOHEMIA_HD_TILE_REPO_part*.txt')):
        P = json.load(open(g))['packs']
        if '15. Cracked floor details' in P: return Image.open(io.BytesIO(base64.b64decode(P['15. Cracked floor details'][i]['b64'].split(',', 1)[-1]))).convert('RGBA')
shots = [('NOW: the hairline crack in the game', 'phone_now.png'), ('F: the corner and one run', 'phone_F.png'), ('G: the corner and two runs', 'phone_G.png')]
ims = [(t, Image.open(S + '/' + n).convert('RGBA')) for t, n in shots]
W = max(sum(i.width + 24 for _, i in ims) + 24, 1100)
sh = Image.new('RGBA', (W, 2000), BG); d = ImageDraw.Draw(sh)
d.text((16, 10), "THE PHONE'S CRACK, FROM YOUR PACK  (UI, 1 art px = 1 phone px)", font=F, fill=AMB)
d.text((16, 40), "Your pack 15 'Cracked floor details', lava recoloured to glass: every pixel where the artist put it, only its colour changed.", font=f, fill=INK)
x, y = 16, 74
for t, i in ims:
    d.text((x, y), t, font=f, fill=AMB); sh.alpha_composite(i, (x, y + 24)); x += i.width + 24
y += 24 + ims[0][1].height + 28
d.text((16, y), 'EACH CUT BESIDE ITS PACK TILE, 1:1 (his tile left, the recolour right)', font=f, fill=INK); y += 28; x = 16
pairs = []
for k in ['F1', 'F2', 'G1', 'G3']:
    c = cuts[k]; i = int(c['src'].split('#')[1]); src = bank_tile(i)
    if c['turn']: src = src.transpose(Image.Transpose.ROTATE_90)
    cut = Image.open(c['out']).convert('RGBA')
    sh.alpha_composite(src, (x, y)); sh.alpha_composite(cut, (x + src.width + 8, y))
    d.text((x, y + 100), '#%d%s' % (i, ' turned 90' if c['turn'] else ''), font=f, fill=AMB)
    x += src.width + cut.width + 40
y += 130
sh = sh.crop((0, 0, W, y)); out = 'records/target/ui_the_phones_crack/UI_ONE_AT_A_TIME_THE_PHONES_CRACK.png'; sh.save(out); print(out, sh.size)
