# Baby Punk's show pictures two and three (rule 446): the game's own art only. python3.13 make2.py <strip|freeway> <out.png> [seed]
import json, random, glob, math, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
scene, OUT = sys.argv[1], sys.argv[2]; random.seed(int(sys.argv[3]) if len(sys.argv) > 3 else 7)
W, H, Z = 1080, 1920, 2
FG = 'slices/fight_ground/'
CFG = {
 # the dead Strip: the casino's front, the boulevard, the pool glowing at the bottom
 'strip': dict(base=FG + 'block_strip_0.webp', box=(780, 60, 720, 1280), sc=(540, 1010), n=150, area=(-40, 560, 1120, 1640),
               no=[(0, 0, 1080, 590), (0, 1650, 1080, 1920)], glow=[((0, 1660, 1080, 1920), (0, 74, 70))],
               props=[('kit_cover/cover_car_burned', 150, 760, 1.5), ('kit_cover/cover_car_suv', 930, 1560, 1.5), ('kit_cover/cover_car_lane', 930, 740, 1.5)]),
 # the freeway crossing: the stage where the two roads meet, the crowd down all four
 'freeway': dict(base=FG + 'block_freewayo_0.webp', box=(856, 142, 864, 1536), sc=(540, 960), n=170, area=(-40, 240, 1120, 1840),
               no=[], glow=[],
               props=[('kit_cover/cover_car_burned', 170, 420, 1.4), ('kit_cover/cover_car_lane', 900, 1560, 1.4), ('kit_cover/cover_car_suv', 150, 1640, 1.4), ('kit_cover/cover_car_drive', 930, 360, 1.4), ('kit_cover/cover_jersey', 250, 700, 1.4), ('kit_cover/cover_jersey', 830, 1230, 1.4)]),
}[scene]
x0, y0, cw_, ch_ = CFG['box']; SC = CFG['sc']
day = Image.open(CFG['base']).convert('RGB').crop((x0, y0, x0 + cw_, y0 + ch_)).resize((W, H), Image.LANCZOS)
r, g, b = day.split()   # the same ground at night: cold, dark, the blue kept
can = Image.merge('RGB', (r.point(lambda v: int(v * .30)), g.point(lambda v: int(v * .34)), b.point(lambda v: int(v * .50)))).convert('RGBA')
draws = []
def night(im, k=.55):
    r, g, b, a = im.split(); return Image.merge('RGBA', (r.point(lambda v: int(v * k)), g.point(lambda v: int(v * k)), b.point(lambda v: int(v * (k + .12))), a))
for (name, px, py, s) in CFG['props']:
    im = Image.open(FG + name + '.webp').convert('RGBA'); im = night(im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)); draws.append((py, im, (px - im.width // 2, py - im.height)))
# the stage: the casino floor's own stage
st = Image.open(FG + 'casino/casino_stage.webp').convert('RGBA').resize((578, 456), Image.LANCZOS); sx, sy = SC[0] - 289, SC[1] - 228
shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(shadow).rectangle((sx - 10, sy + 20, sx + 588, sy + 482), fill=(0, 0, 0, 160))
can.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(14))); can.alpha_composite(st, (sx, sy))
# the crowd: the town's 3-D people, thick at the stage and thinning out, each turned to it
rigs = []
for f in sorted(glob.glob('slices/rig_town/person_*.json')):
    j = json.load(open(f)); rigs.append((j, {k: Image.open('slices/rig_town/' + v['file']).convert('RGBA') for k, v in j['sheets'].items() if k in ('talk', 'drink', 'smoke')}))
ax0, ay0, ax1, ay1 = CFG['area']; people = []; tries = 0
def blocked(x, y):
    if sx - 26 < x < sx + 604 and sy + 30 < y < sy + 520: return True          # on the stage, or hidden behind its front
    return any(a < x < c and b < y < d for a, b, c, d in CFG['no'])
while len(people) < CFG['n'] and tries < 40000:
    tries += 1; x, y = random.uniform(ax0, ax1), random.uniform(ay0, ay1)
    if blocked(x, y): continue
    d = math.hypot((x - SC[0]) / 1.0, (y - SC[1]) / 1.25)
    if random.random() > max(.06, 1.25 - d / 520.0): continue
    if all(abs(x - a) > 30 or abs(y - b) > 17 for a, b in people): people.append((x, y))
def tint(im, d):
    k = max(0.0, 1 - d / 700.0) * random.uniform(.82, 1.0); r, g, b, a = im.split()
    f = lambda ch, lo, hi: ch.point(lambda v: min(255, int(v * (lo + (hi - lo) * k))))
    return Image.merge('RGBA', (f(r, .50, 1.30), f(g, .50, 1.14), f(b, .66, .90), a))
POSES = [('talk', 'T')] * 2 + [('talk', 'T_nod')] * 2 + [('talk', 'T_point')] * 2 + [('talk', 'T_both')] * 3 + [('talk', 'T_open')] * 2 + [('talk', 'T_laugh'), ('drink', 'D_swig'), ('drink', 'D_up'), ('smoke', 'K_exhale')]
for (x, y) in people:
    dx, dy = SC[0] - x, SC[1] - y; face = int(round(math.atan2(dx, dy) / (math.pi / 4))) % 8
    j, ims = random.choice(rigs); clip, pose = random.choice(POSES); sh = j['sheets'][clip]
    cx, cy, cw, ch, ox, oy = sh['cells'][j['poses'][clip][pose][face]]
    fr = tint(ims[clip].crop((cx, cy, cx + cw, cy + ch)), math.hypot(dx, dy)).resize((cw * Z, ch * Z), Image.NEAREST)
    draws.append((y, fr, (int(x + (ox - j['foot'][0]) * Z), int(y + (oy - j['foot'][1]) * Z))))
# YOU: the white-haired man, on the stage, facing the camera
yj = json.load(open('slices/rig_town/you.json')); T = yj['sheets']['talk']; at = Image.open('slices/rig_town/' + T['file']).convert('RGBA')
cx, cy, cw, ch, ox, oy = T['cells'][yj['poses']['talk'][sys.argv[4] if len(sys.argv) > 4 else 'T_both'][0]]
you = ImageEnhance.Brightness(at.crop((cx, cy, cx + cw, cy + ch)).resize((int(cw * 2.5), int(ch * 2.5)), Image.NEAREST)).enhance(1.12)
fx, fy = SC[0], SC[1] + 44; YOU_AT = (fx - you.width // 2, fy - you.height)
# the fire drums: the stage's corners, and more down the crowd
dr = Image.open(FG + 'light_oil_drum.webp').convert('RGBA').resize((74, 148), Image.NEAREST)
fires = [(SC[0] - 320, SC[1] - 192), (SC[0] + 320, SC[1] - 192), (SC[0] - 320, SC[1] + 236), (SC[0] + 320, SC[1] + 236)]
far = [(SC[0] - 430, SC[1] + 560), (SC[0] + 430, SC[1] + 560), (SC[0] - 440, SC[1] - 520), (SC[0] + 440, SC[1] - 520)]
far = [(x, y) for x, y in far if not blocked(x, y) and 80 < y < H - 40]
for (x, y) in fires + far: draws.append((y, dr, (x - 37, y - 148)))
for _, im, pos in sorted(draws, key=lambda t: t[0]): can.alpha_composite(im, pos)
# the light: warm fire on the ground, two cold lamps on him, and the scene's own glow (the pool)
glow = Image.new('RGB', (W, H), (0, 0, 0)); gd = ImageDraw.Draw(glow)
for (x, y) in fires + far:
    for rr, c in ((300, (98, 54, 14)), (180, (124, 68, 18)), (80, (150, 100, 38))): gd.ellipse((x - rr, y - 60 - rr * .7, x + rr, y - 60 + rr * .7), fill=c)
gd.ellipse((SC[0] - 500, SC[1] - 420, SC[0] + 500, SC[1] + 340), fill=(58, 44, 28))
out = ImageChops.screen(can.convert('RGB'), glow.filter(ImageFilter.GaussianBlur(92)))
if CFG['glow']:
    g2 = Image.new('RGB', (W, H), (0, 0, 0)); d2 = ImageDraw.Draw(g2)
    for box, c in CFG['glow']: d2.rectangle(box, fill=c)
    out = ImageChops.screen(out, g2.filter(ImageFilter.GaussianBlur(40)))
cone = Image.new('RGB', (W, H), (0, 0, 0)); c = ImageDraw.Draw(cone); px, py = SC[0], SC[1] - 40
c.polygon([(120, -40), (260, -40), (px + 150, py + 130), (px - 150, py + 130)], fill=(30, 35, 42)); c.polygon([(W - 120, -40), (W - 260, -40), (px - 150, py + 130), (px + 150, py + 130)], fill=(30, 35, 42))
out = ImageChops.screen(out, cone.filter(ImageFilter.GaussianBlur(26)))
o2 = out.convert('RGBA'); sh2 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh2).ellipse((fx - 52, fy - 14, fx + 52, fy + 12), fill=(0, 0, 0, 150))
o2.alpha_composite(sh2.filter(ImageFilter.GaussianBlur(6))); o2.alpha_composite(you, YOU_AT); out = o2.convert('RGB')
# the tape: scanlines, grain, the dark at the edges
sl = Image.new('L', (W, H), 255); d = ImageDraw.Draw(sl)
for yy in range(0, H, 4): d.line((0, yy, W, yy), fill=222)
vig = Image.new('L', (W, H), 0); ImageDraw.Draw(vig).ellipse((-260, -120, W + 260, H + 120), fill=255); vig = vig.filter(ImageFilter.GaussianBlur(170))
out = ImageChops.multiply(out, Image.merge('RGB', (sl, sl, sl))); out = ImageChops.multiply(out, Image.merge('RGB', [vig.point(lambda v: 70 + int(v * 185 / 255))] * 3))
noise = Image.effect_noise((W, H), 9).convert('L'); out = ImageChops.add(out, Image.merge('RGB', [noise.point(lambda v: max(0, v - 122))] * 3))
out.save(OUT); print('saved', OUT, out.size, len(people), 'people')
