import json, random, glob, math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
random.seed(int(sys.argv[2]) if len(sys.argv) > 2 else 7)
OUT = sys.argv[1]
Z = 2; X0, Y0 = 265, 520; W, H = 1080, 1920
def P(x, y): return (int((x - X0) * Z), int((y - Y0) * Z))
bg = Image.open('slices/settlement_ground_towns/anarchists_tall_night.webp').convert('RGB')
can = bg.crop((X0, Y0, X0 + W // Z, Y0 + H // Z)).resize((W, H), Image.LANCZOS).convert('RGBA')
# the stage: the casino floor's own stage, set on the dirt
SC = (535, 1128); st = Image.open('slices/fight_ground/casino/casino_stage.webp').convert('RGBA')
sw, sh_ = int(516 * 0.56 * Z), int(407 * 0.56 * Z); st = st.resize((sw, sh_), Image.LANCZOS)
sx, sy = P(SC[0], SC[1])[0] - sw // 2, P(SC[0], SC[1])[1] - sh_ // 2
shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(shadow).rectangle((sx - 10, sy + 20, sx + sw + 10, sy + sh_ + 26), fill=(0, 0, 0, 150))
can.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(14))); can.alpha_composite(st, (sx, sy))
# the crowd: the town's own 3-D people (slices/rig_town, the same kind of body as YOU), each turned to the stage
rigs = []
for f in sorted(glob.glob('slices/rig_town/person_*.json')):
    j = json.load(open(f)); rigs.append((j, {k: Image.open('slices/rig_town/' + v['file']).convert('RGBA') for k, v in j['sheets'].items() if k in ('talk', 'drink', 'smoke')}))
zones = [(296, 900, 774, 1000, 34), (262, 930, 330, 1012, 6), (290, 1000, 374, 1300, 16), (696, 1000, 772, 1300, 16), (374, 972, 696, 1006, 10), (372, 1276, 700, 1302, 16)]
people = []
for (x0, y0, x1, y1, n) in zones:
    for _ in range(n):
        for tries in range(40):
            x, y = random.uniform(x0, x1), random.uniform(y0, y1)
            if all(abs(x - a) > 14 or abs(y - b) > 8 for a, b in people): people.append((x, y)); break
def tint(im, d):
    k = max(0.0, 1 - d / 330.0) * random.uniform(.82, 1.0); r, g, b, a = im.split()
    f = lambda ch, lo, hi: ch.point(lambda v: min(255, int(v * (lo + (hi - lo) * k))))
    return Image.merge('RGBA', (f(r, .62, 1.30), f(g, .60, 1.14), f(b, .74, .90), a))
POSES = [('talk', 'T')] * 2 + [('talk', 'T_nod')] * 2 + [('talk', 'T_point')] * 2 + [('talk', 'T_both')] * 3 + [('talk', 'T_open')] * 2 + [('talk', 'T_laugh'), ('drink', 'D_swig'), ('drink', 'D_up'), ('smoke', 'K_exhale')]
draws = []
for (x, y) in people:
    dx, dy = SC[0] - x, SC[1] - y; face = int(round(math.atan2(dx, dy) / (math.pi / 4))) % 8
    j, ims = random.choice(rigs); clip, pose = random.choice(POSES); sh = j['sheets'][clip]
    cx, cy, cw, ch, ox, oy = sh['cells'][j['poses'][clip][pose][face]]
    fr = tint(ims[clip].crop((cx, cy, cx + cw, cy + ch)), math.hypot(dx, dy)).resize((cw * Z, ch * Z), Image.NEAREST)
    px, py = P(x, y); draws.append((y, fr, (int(px + (ox - j['foot'][0]) * Z), int(py + (oy - j['foot'][1]) * Z))))
# YOU: the white-haired man, on the stage, arms open
yj = json.load(open('slices/rig_town/you.json')); T = yj['sheets']['talk']; at = Image.open('slices/rig_town/' + T['file']).convert('RGBA')
i = yj['poses']['talk'][sys.argv[3] if len(sys.argv) > 3 else 'T_both'][int(sys.argv[4]) if len(sys.argv) > 4 else 0]; cx, cy, cw, ch, ox, oy = T['cells'][i]
you = at.crop((cx, cy, cx + cw, cy + ch)); YS = 2.5; you = you.resize((int(cw * YS), int(ch * YS)), Image.NEAREST)
you = ImageEnhance.Brightness(you).enhance(1.12)
fx, fy = P(SC[0], SC[1] + 22); YOU_AT = (fx - you.width // 2, fy - you.height)
# the fire drums at the stage's corners
dr = Image.open('slices/fight_ground/light_oil_drum.webp').convert('RGBA').resize((37 * Z, 74 * Z), Image.NEAREST)
fires = [(SC[0] - 160, SC[1] - 96), (SC[0] + 160, SC[1] - 96), (SC[0] - 160, SC[1] + 118), (SC[0] + 160, SC[1] + 118)]
for (x, y) in fires: px, py = P(x, y); draws.append((y, dr, (px - dr.width // 2, py - dr.height)))
for _, im, pos in sorted(draws, key=lambda t: t[0]): can.alpha_composite(im, pos)
# the light: warm fire on the dirt, two cold lamps on him
glow = Image.new('RGB', (W, H), (0, 0, 0)); g = ImageDraw.Draw(glow)
for (x, y) in fires:
    px, py = P(x, y - 30)
    for r, c in ((150, (70, 38, 10)), (90, (90, 50, 14)), (40, (120, 80, 30))): g.ellipse((px - r, py - r * .7, px + r, py + r * .7), fill=c)
px, py = P(SC[0], SC[1] - 20); g.ellipse((px - 250, py - 190, px + 250, py + 190), fill=(36, 29, 22))
cone = Image.new('RGB', (W, H), (0, 0, 0)); c = ImageDraw.Draw(cone)
c.polygon([(120, -40), (260, -40), (px + 150, py + 130), (px - 150, py + 130)], fill=(30, 35, 42)); c.polygon([(W - 120, -40), (W - 260, -40), (px - 150, py + 130), (px + 150, py + 130)], fill=(30, 35, 42))
out = ImageChops.screen(can.convert('RGB'), glow.filter(ImageFilter.GaussianBlur(46))); out = ImageChops.screen(out, cone.filter(ImageFilter.GaussianBlur(26)))
o2 = out.convert('RGBA'); sh2 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh2).ellipse((fx - 52, fy - 14, fx + 52, fy + 12), fill=(0, 0, 0, 150))
o2.alpha_composite(sh2.filter(ImageFilter.GaussianBlur(6))); o2.alpha_composite(you, YOU_AT); out = o2.convert('RGB')
# the tape: scanlines, grain, the dark at the edges (Crashbox)
sl = Image.new('L', (W, H), 255); d = ImageDraw.Draw(sl)
for yy in range(0, H, 4): d.line((0, yy, W, yy), fill=222)
vig = Image.new('L', (W, H), 0); ImageDraw.Draw(vig).ellipse((-260, -120, W + 260, H + 120), fill=255); vig = vig.filter(ImageFilter.GaussianBlur(170))
out = ImageChops.multiply(out, Image.merge('RGB', (sl, sl, sl))); out = ImageChops.multiply(out, Image.merge('RGB', [vig.point(lambda v: 70 + int(v * 185 / 255))] * 3))
noise = Image.effect_noise((W, H), 9).convert('L'); out = ImageChops.add(out, Image.merge('RGB', [noise.point(lambda v: max(0, v - 122))] * 3))
out.save(OUT); print('saved', OUT, out.size, len(people), 'people')
