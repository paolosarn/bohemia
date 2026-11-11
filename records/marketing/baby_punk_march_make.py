# THE MARCH (rule 446): he leads the whole city down the dead freeway from Las Vegas toward Los Angeles.
# The game's own art only: the freeway ground, the 3-D town people, the oil-drum fires, YOU. python3.13 make3.py <out_clean.png> <out_cam.png> [seed]
import json, random, glob, math, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance, ImageFont
random.seed(int(sys.argv[3]) if len(sys.argv) > 3 else 7)
W, H = 1080, 1920; FG = 'slices/fight_ground/'
# 1. the flat ground: the block's freeway turned to run away from the camera, desert both sides
blk = Image.open(FG + 'block_freewayo_0.webp').convert('RGB')
road = blk.crop((0, 500, 1040, 1320)).rotate(90, expand=True)          # 820 wide, 1040 long
lot = blk.crop((0, 0, 700, 440))
GW, L = 2220, 5200; flat = Image.new('RGB', (GW, L))
for i in range(5): flat.paste(road if i % 2 == 0 else road.transpose(Image.FLIP_TOP_BOTTOM), (700, i * 1040))
for i in range(12):
    t = lot if i % 2 == 0 else lot.transpose(Image.FLIP_TOP_BOTTOM); flat.paste(t, (0, i * 440)); flat.paste(t.transpose(Image.FLIP_LEFT_RIGHT), (1520, i * 440))
r, g, b = flat.split(); flat = Image.merge('RGB', (r.point(lambda v: int(v * .26)), g.point(lambda v: int(v * .30)), b.point(lambda v: int(v * .46))))
# 2. the camera: high, looking down the road (a true perspective, far edge at the horizon)
HOR = 350; quad_s = [(356, HOR), (724, HOR), (1730, 2100), (-650, 2100)]; quad_g = [(0, 0), (GW, 0), (GW, L), (0, L)]
def homog(src, dst):
    A = []; B = []
    for (x, y), (u, v) in zip(src, dst): A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float))
inv = homog(quad_s, quad_g); fwd = homog(quad_g, quad_s)
def to_screen(u, v):
    a, b_, c, d, e, f, g_, h = fwd; w = g_ * u + h * v + 1; return ((a * u + b_ * v + c) / w, (d * u + e * v + f) / w)
def scale_at(u, v): return abs(to_screen(u + 50, v)[0] - to_screen(u - 50, v)[0]) / 100.0
can = flat.transform((W, H), Image.PERSPECTIVE, tuple(inv), Image.BICUBIC).convert('RGBA')
ImageDraw.Draw(can).rectangle((0, 0, W, HOR), fill=(4, 5, 9, 255))
# 3. Las Vegas behind them: dead towers on the horizon, the last glow of the city
sky = Image.new('RGB', (W, H), (0, 0, 0)); sd = ImageDraw.Draw(sky)
sd.ellipse((140, HOR - 150, 940, HOR + 110), fill=(120, 58, 16)); sd.ellipse((330, HOR - 70, 750, HOR + 60), fill=(170, 96, 30)); sd.ellipse((560, HOR - 110, 900, HOR + 40), fill=(0, 70, 66))
can = ImageChops.screen(can.convert('RGB'), sky.filter(ImageFilter.GaussianBlur(70))).convert('RGBA'); cd = ImageDraw.Draw(can)
for (x, w_, h_) in [(120, 46, 120), (182, 34, 78), (238, 60, 168), (322, 40, 96), (392, 30, 132), (452, 54, 62), (654, 44, 150), (716, 62, 92), (800, 36, 190), (858, 58, 110), (934, 42, 70)]:
    cd.rectangle((x, HOR - h_, x + w_, HOR + 2), fill=(3, 3, 6, 255))
    for _ in range(3):
        wx, wy = random.randint(x + 4, x + w_ - 8), random.randint(HOR - h_ + 6, HOR - 10); cd.rectangle((wx, wy, wx + 3, wy + 4), fill=(150, 96, 40, 255))
# 4. who stands where (ground units): fires down both shoulders, the city in rows on the asphalt, him out in front
K = 2.7; RL, RR = 775, 1445; draws = []; fires = []
dr0 = Image.open(FG + 'light_oil_drum.webp').convert('RGBA')
for v in range(260, 5200, 300):
    for u in (RL - 95, RR + 95): fires.append((u, v))
for (u, v) in fires:
    x, y = to_screen(u, v); s = scale_at(u, v) * K
    if y > H + 200: continue
    im = dr0.resize((max(2, int(37 * s)), max(4, int(74 * s))), Image.NEAREST if s >= 1.5 else Image.LANCZOS); draws.append((v, im, (int(x - im.width / 2), int(y - im.height))))
rigs = []
for f in sorted(glob.glob('slices/rig_town/person_*.json')):
    j = json.load(open(f)); sh = j['sheets']['talk']; at = Image.open('slices/rig_town/' + sh['file']).convert('RGBA'); cx, cy, cw, ch, ox, oy = sh['cells'][j['poses']['talk']['T'][0]]
    rigs.append((at.crop((cx, cy, cx + cw, cy + ch)), ox - j['foot'][0], oy - j['foot'][1]))
def tint(im, warm, depth):
    k = warm * random.uniform(.85, 1.0); dk = .30 + .70 * depth; r, g, b, a = im.split()
    f = lambda ch, lo, hi: ch.point(lambda v: min(255, int(v * dk * (lo + (hi - lo) * k))))
    return Image.merge('RGBA', (f(r, .58, 1.34), f(g, .58, 1.12), f(b, .78, .86), a))
cols = [RL + 40 + i * 74 for i in range(9)]; n = 0; FRONT = 4420
for v in range(60, FRONT + 1, 96):
    for u in cols:
        uu, vv = u + random.uniform(-4, 4), v + random.uniform(-5, 5); x, y = to_screen(uu, vv); s = scale_at(uu, vv) * K
        im, ox, oy = random.choice(rigs); warm = max(0.0, 1 - min(uu - (RL - 95), (RR + 95) - uu) / 330.0); depth = (vv / L) ** 1.6
        fr = tint(im, warm, depth).resize((max(2, int(im.width * s)), max(4, int(im.height * s))), Image.NEAREST if s >= 1.5 else Image.LANCZOS)
        draws.append((vv, fr, (int(x + ox * s), int(y + oy * s)))); n += 1
for _, im, pos in sorted(draws, key=lambda t: t[0]): can.alpha_composite(im, pos)
# 5. the light: every drum warms the road, the far end sinks into the dark, a cold lamp on him
glow = Image.new('RGB', (W, H), (0, 0, 0)); gd = ImageDraw.Draw(glow)
for (u, v) in fires:
    x, y = to_screen(u, v); s = scale_at(u, v) * K; y -= 40 * s
    if y > H + 300: continue
    for rr, c in ((150, (92, 50, 13)), (85, (118, 64, 17)), (38, (150, 100, 38))): gd.ellipse((x - rr * s, y - rr * s * .6, x + rr * s, y + rr * s * .6), fill=c)
out = ImageChops.screen(can.convert('RGB'), glow.filter(ImageFilter.GaussianBlur(30)))
haze = Image.new('L', (W, H), 255); hd = ImageDraw.Draw(haze)
for yy in range(HOR, HOR + 420): hd.line((0, yy, W, yy), fill=int(110 + 145 * ((yy - HOR) / 420.0) ** .7))
out = ImageChops.multiply(out, Image.merge('RGB', (haze, haze, haze)))
YU, YV = (RL + RR) / 2.0, 4905; fx, fy = to_screen(YU, YV); fx, fy = int(fx), int(fy)
lamp = Image.new('RGB', (W, H), (0, 0, 0)); ld = ImageDraw.Draw(lamp); ld.ellipse((fx - 250, fy - 120, fx + 250, fy + 90), fill=(40, 46, 56)); ld.polygon([(fx - 70, -40), (fx + 70, -40), (fx + 210, fy + 40), (fx - 210, fy + 40)], fill=(16, 19, 24))
out = ImageChops.screen(out, lamp.filter(ImageFilter.GaussianBlur(34)))
# 6. YOU: the white-haired man, alone in front of all of them, arms open, facing the camera
yj = json.load(open('slices/rig_town/you.json')); T = yj['sheets']['talk']; at = Image.open('slices/rig_town/' + T['file']).convert('RGBA')
cx, cy, cw, ch, ox, oy = T['cells'][yj['poses']['talk'][sys.argv[4] if len(sys.argv) > 4 else 'T_both'][0]]; YS = 3.0
you = ImageEnhance.Brightness(at.crop((cx, cy, cx + cw, cy + ch)).resize((int(cw * YS), int(ch * YS)), Image.NEAREST)).enhance(1.14)
o2 = out.convert('RGBA'); sh2 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); ImageDraw.Draw(sh2).ellipse((fx - 64, fy - 16, fx + 64, fy + 14), fill=(0, 0, 0, 170))
o2.alpha_composite(sh2.filter(ImageFilter.GaussianBlur(7))); o2.alpha_composite(you, (fx - you.width // 2, fy - you.height)); out = o2.convert('RGB')
# 7. the tape: scanlines, grain, the dark at the edges
sl = Image.new('L', (W, H), 255); d = ImageDraw.Draw(sl)
for yy in range(0, H, 4): d.line((0, yy, W, yy), fill=222)
vig = Image.new('L', (W, H), 0); ImageDraw.Draw(vig).ellipse((-260, -120, W + 260, H + 120), fill=255); vig = vig.filter(ImageFilter.GaussianBlur(170))
out = ImageChops.multiply(out, Image.merge('RGB', (sl, sl, sl))); out = ImageChops.multiply(out, Image.merge('RGB', [vig.point(lambda v: 70 + int(v * 185 / 255))] * 3))
noise = Image.effect_noise((W, H), 9).convert('L'); out = ImageChops.add(out, Image.merge('RGB', [noise.point(lambda v: max(0, v - 122))] * 3))
out.save(sys.argv[1])
# 8. the same frame as the camera saw it (for posting as a still; the clean one goes to the video tool)
cam = out.copy(); cd = ImageDraw.Draw(cam); F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 30); BONE = (216, 204, 176)
cd.ellipse((44, 52, 66, 74), fill=(200, 30, 24)); cd.text((80, 44), 'REC', font=F, fill=BONE); cd.text((44, 92), 'CAM 13 · I-15 SOUTH', font=F, fill=BONE)
cd.text((44, H - 88), 'LAS VEGAS > LOS ANGELES', font=F, fill=BONE)
for (x, y, dx, dy) in ((30, 30, 1, 1), (W - 30, 30, -1, 1), (30, H - 30, 1, -1), (W - 30, H - 30, -1, -1)): cd.line((x, y, x + 46 * dx, y), fill=BONE, width=3); cd.line((x, y, x, y + 46 * dy), fill=BONE, width=3)
cam.save(sys.argv[2]); print('saved', n, 'people', (fx, fy))
