# HOME BASE 5, 11/27/26: HIS PLACE, HIS WAY: the VOTE card's picture (run by tools/bohemia_home_base_his_place_his_way_card_11_27_26.js,
# which passes the shots as JSON in argv[1]). Upright on top (eight shots in a row), sideways below (two rows of four): before, MOVE with
# its lots lit, moved, LIME, his sign, the name, WORKS AT, and what came back after the page was shut and opened again.
import sys, json
from PIL import Image, ImageDraw, ImageFont
a = json.loads(sys.argv[1]); S = a['shots']
try: fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 18)
except Exception: fnt = ImageFont.load_default()
G, T = 10, 28
UP = [('0_before', 'BEFORE'), ('2_move_lit', 'MOVE: LOTS LIT'), ('3_moved', 'MOVED'), ('4_painted', 'PAINT: LIME'), ('5_signed', 'SIGN'),
      ('7_named_whole', 'ITS NAME'), ('9_works_there', 'WORKS AT'), ('10_reloaded', 'AFTER A RELOAD')]
SIDE = UP
uw, uh = 300, 650; sw, sh = 600, 277
W = max(len(UP) * uw + (len(UP) - 1) * G, 4 * sw + 3 * G)
H = T + uh + G + 2 * (T + sh + G)
C = Image.new('RGB', (W, H), (18, 14, 10)); d = ImageDraw.Draw(C); grn, dim = (226, 196, 120), (190, 170, 140)
lab = lambda x, y, s, c=grn: d.text((x + 4, y + 4), s, font=fnt, fill=c)
def one(p, w, h): return Image.open(p).convert('RGB').resize((w, h), Image.LANCZOS)
P = S.get('phone_portrait', {}); L = S.get('phone_landscape', {})
for i, (k, t) in enumerate(UP):
    x = i * (uw + G)
    lab(x, 0, t, dim if k == '0_before' else grn)
    if k in P: C.paste(one(P[k], uw, uh), (x, T))
y0 = T + uh + G
first = None
for i, (k, t) in enumerate(SIDE):
    r, c = divmod(i, 4); x = c * (sw + G); y = y0 + r * (T + sh + G)
    lab(x, y, t + ' (sideways)', dim if k == '0_before' else grn)
    if k in L: C.paste(one(L[k], sw, sh), (x, y + T))
    if k == '7_named_whole': first = (x, y + T)
C.save(a['out'], 'WEBP', quality=84, method=6)
if '7_named_whole' in L: Image.open(L['7_named_whole']).convert('RGB').resize((844, 390), Image.LANCZOS).save(a['first'], 'WEBP', quality=88, method=6)
for prof, S2 in S.items():
    for n, p in S2.items():
        im = Image.open(p).convert('RGB'); im.resize((im.width // 3, im.height // 3), Image.LANCZOS).save(a['dir'] + '/his_place_his_way_%s_%s.webp' % (prof, n), 'WEBP', quality=82, method=6)
print(json.dumps({'card': C.size, 'firstAt': list(first) + [sw, sh] if first else None}))
