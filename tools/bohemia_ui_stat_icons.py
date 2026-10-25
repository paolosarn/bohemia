#!/usr/bin/env python3
"""THE STAT ICONS (UI [the PC playtest: the UI's part] (3), 10/25/26; rule 164 item 4, Paolo 10/24 on his PC: 'we need awesome
logos for everything... Battle Brothers has logos too, a heart, a shield').

Battle Brothers puts a small picture beside every stat on a man's page (a heart for hitpoints, a shield for defence, a sword
for melee, and so on). These are ours, one per stat of engine/bohemia_roster.js STATS, BUILT WITH LIGHT AND FORM (ALL THE UI
LOOKS 3-D, 9/20): every icon is a solid with a height, its edges bevelled round, lit by the kit's one sun (slices/ui_kit/kit.json:
screen 155.4 deg, 40 deg up; upper left, the plates' shadows fall down and right), shaded per pixel (diffuse, a hard specular,
grain), outlined in the receipt's ink and dropped on a hard shadow. Never a flat drawing, never a gradient in CSS (rule 114).

  hp              HITPOINTS       a heart, red enamel
  fatigue         FATIGUE         two lungs, the breath you spend
  resolve         RESOLVE         a fist, the wrist taped
  initiative      INITIATIVE      a bolt, brass
  melee_skill     MELEE SKILL     a machete, steel, a wood grip
  ranged_skill    RANGED SKILL    a scope's reticle, the dot red
  melee_defense   MELEE DEFENSE   a shield, steel, a brass boss
  ranged_defense  RANGED DEFENSE  the same shield with three bullet holes, the drab of a vest

Writes slices/stat_icons/<stat>.png at 72 x 72 (24 points at his phone's 3 pixels: one art pixel to one phone pixel) and
records/target/UI_THE_STAT_ICONS_10_25_26.png, the eight beside their names. Seeded: the same file every run.
Run: python3 tools/bohemia_ui_stat_icons.py
"""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'slices', 'stat_icons')
N = 72
SUN_DEG, SUN_ELEV = 155.4, 40.0   # slices/ui_kit/kit.json, the kit's one sun
INK = (12, 8, 5)

# ---- 2D signed distances, the canvas spans [-1, 1], y down ----
def circle(cx, cy, r):
    return lambda x, y: np.hypot(x - cx, y - cy) - r
def ellipse(cx, cy, rx, ry):
    return lambda x, y: (np.hypot((x - cx) / rx, (y - cy) / ry) - 1.0) * min(rx, ry)
def rbox(cx, cy, hx, hy, r=0.0, rot=0.0):
    c, s = math.cos(rot), math.sin(rot)
    def f(x, y):
        u, v = (x - cx) * c + (y - cy) * s, -(x - cx) * s + (y - cy) * c
        qx, qy = np.abs(u) - hx + r, np.abs(v) - hy + r
        return np.hypot(np.maximum(qx, 0), np.maximum(qy, 0)) + np.minimum(np.maximum(qx, qy), 0) - r
    return f
def poly(pts, rot=0.0, off=(0.0, 0.0)):
    c, s = math.cos(rot), math.sin(rot)
    P = [(px * c - py * s + off[0], px * s + py * c + off[1]) for px, py in pts]
    def f(x, y):
        d = np.full(x.shape, 1e9); sgn = np.ones(x.shape)
        for i in range(len(P)):
            (ax, ay), (bx, by) = P[i], P[i - 1]
            ex, ey, wx, wy = bx - ax, by - ay, x - ax, y - ay
            t = np.clip((wx * ex + wy * ey) / (ex * ex + ey * ey), 0, 1)
            d = np.minimum(d, np.hypot(wx - ex * t, wy - ey * t))
            c1, c2, c3 = y >= ay, y < by, ex * wy > ey * wx
            flip = (c1 & c2 & c3) | (~c1 & ~c2 & ~c3)
            sgn = np.where(flip, -sgn, sgn)
        return sgn * d
    return f
def ring(cx, cy, r, w):
    return lambda x, y: np.abs(np.hypot(x - cx, y - cy) - r) - w
def union(*fs):
    return lambda x, y: np.min(np.stack([f(x, y) for f in fs]), axis=0)
def smooth(a, b, k):
    def f(x, y):
        da, db = a(x, y), b(x, y); h = np.clip(0.5 + 0.5 * (db - da) / k, 0, 1)
        return db * (1 - h) + da * h - k * h * (1 - h)
    return f
def cut(a, b):
    return lambda x, y: np.maximum(a(x, y), -b(x, y))
def offset(a, r):
    return lambda x, y: a(x, y) + r

# ---- materials: base colour, how hard the shine, how much grain ----
M = {
    'enamel':  ((176, 36, 30), 0.55, 0.06),
    'lung':    ((96, 132, 168), 0.35, 0.07),
    'lungdk':  ((70, 98, 128), 0.25, 0.07),
    'skin':    ((184, 134, 98), 0.25, 0.08),
    'tape':    ((170, 176, 180), 0.30, 0.10),
    'brass':   ((204, 156, 62), 0.75, 0.06),
    'steel':   ((150, 156, 162), 0.85, 0.07),
    'steeldk': ((92, 98, 106), 0.60, 0.08),
    'wood':    ((112, 72, 40), 0.20, 0.12),
    'red':     ((200, 40, 32), 0.70, 0.04),
    'drab':    ((104, 110, 78), 0.35, 0.09),
    'drabdk':  ((70, 74, 52), 0.25, 0.09),
    'hole':    ((22, 16, 12), 0.05, 0.02),
}

# ---- the eight: parts (shape, material, height, bevel, base) ----
def heart():
    lobes = union(circle(-0.29, -0.2, 0.37), circle(0.29, -0.2, 0.37))
    tip = poly([(-0.64, -0.08), (0.64, -0.08), (0.0, 0.74)])
    return [(smooth(lobes, tip, 0.12), 'enamel', 0.42, 0.42, 0.0)]
def lungs():
    L = ellipse(-0.36, 0.16, 0.30, 0.5); R = ellipse(0.36, 0.16, 0.30, 0.5)
    tube = rbox(0.0, -0.5, 0.075, 0.3, 0.06)
    br = union(rbox(-0.14, -0.12, 0.17, 0.05, 0.04, rot=0.55), rbox(0.14, -0.12, 0.17, 0.05, 0.04, rot=-0.55))
    return [(cut(L, rbox(-0.02, 0.1, 0.07, 0.6)), 'lung', 0.34, 0.3, 0.0), (cut(R, rbox(0.02, 0.1, 0.07, 0.6)), 'lung', 0.34, 0.3, 0.0),
            (union(tube, br), 'lungdk', 0.2, 0.08, 0.22)]
def fist():
    palm = rbox(0.04, 0.12, 0.5, 0.34, 0.16)
    knuckles = union(*[rbox(x, -0.26, 0.115, 0.17, 0.11) for x in (-0.34, -0.11, 0.12, 0.35)])
    thumb = rbox(-0.05, 0.12, 0.36, 0.11, 0.1, rot=-0.12)
    wrist = rbox(0.06, 0.66, 0.34, 0.15, 0.05)
    return [(palm, 'skin', 0.3, 0.3, 0.0), (knuckles, 'skin', 0.3, 0.2, 0.08), (thumb, 'skin', 0.22, 0.14, 0.3), (wrist, 'tape', 0.26, 0.1, 0.0)]
def bolt():
    return [(poly([(0.22, -0.9), (-0.5, 0.12), (-0.06, 0.12), (-0.26, 0.9), (0.52, -0.18), (0.07, -0.18), (0.34, -0.9)]), 'brass', 0.36, 0.2, 0.0)]
def machete():
    rot = -math.pi / 4
    blade = poly([(-0.2, -0.1), (0.72, -0.16), (0.9, -0.02), (0.78, 0.1), (-0.2, 0.09)], rot=rot)
    guard = poly([(-0.27, -0.2), (-0.2, -0.2), (-0.2, 0.2), (-0.27, 0.2)], rot=rot)
    grip = poly([(-0.78, -0.08), (-0.27, -0.08), (-0.27, 0.08), (-0.78, 0.08)], rot=rot)
    return [(blade, 'steel', 0.18, 0.16, 0.0), (offset(guard, -0.0), 'brass', 0.26, 0.06, 0.04), (grip, 'wood', 0.24, 0.07, 0.02)]
def reticle():
    ticks = union(rbox(0, -0.62, 0.05, 0.22), rbox(0, 0.62, 0.05, 0.22), rbox(-0.62, 0, 0.22, 0.05), rbox(0.62, 0, 0.22, 0.05))
    return [(ring(0, 0, 0.54, 0.12), 'steeldk', 0.42, 0.12, 0.0), (ticks, 'steeldk', 0.26, 0.06, 0.0), (circle(0, 0, 0.1), 'red', 0.3, 0.1, 0.0)]
SHIELD = [(-0.62, -0.74), (0.62, -0.74), (0.64, -0.05), (0.0, 0.86), (-0.64, -0.05)]
def shield(face, rim, holes=None):
    body = offset(poly(SHIELD), -0.04)
    inner = poly([(x * 0.78, y * 0.78 - 0.02) for x, y in SHIELD])
    if holes:   # shot through: the holes go through the plate, the dark behind them shows
        H = union(*[circle(x, y, 0.08) for x, y in holes])
        return [(cut(body, inner), rim, 0.36, 0.1, 0.0), (cut(inner, H), face, 0.22, 0.24, 0.0), (H, 'hole', 0.04, 0.02, 0.0)]
    parts = [(cut(body, inner), rim, 0.36, 0.1, 0.0), (inner, face, 0.22, 0.24, 0.0)]
    parts.append((circle(0, -0.08, 0.17), 'brass', 0.42, 0.17, 0.0))
    return parts
ICONS = [
    ('hp', 'HITPOINTS', heart), ('fatigue', 'FATIGUE', lungs), ('resolve', 'RESOLVE', fist), ('initiative', 'INITIATIVE', bolt),
    ('melee_skill', 'MELEE SKILL', machete), ('ranged_skill', 'RANGED SKILL', reticle),
    ('melee_defense', 'MELEE DEFENSE', lambda: shield('steel', 'steeldk')),
    ('ranged_defense', 'RANGED DEFENSE', lambda: shield('drab', 'drabdk', holes=[(-0.22, -0.3), (0.24, -0.12), (-0.04, 0.24)])),
]

def render(parts, seed):
    s = 2   # two samples a pixel each way, averaged: the solid's edge is a real edge, not a stair
    n = N * s
    g = (np.arange(n) + 0.5) / n * 2 - 1
    x, y = np.meshgrid(g * 0.98, g * 0.98)   # a hair of margin for the outline and the shadow
    eps = 2.0 / n
    def height(f, H, b, z0):
        d = f(x, y); t = np.clip(-d / b, 0, 1)
        return np.where(d < 0, z0 + H * np.sqrt(1 - (1 - t) ** 2), -1.0), d
    top = np.full(x.shape, -1.0); idx = np.full(x.shape, -1)
    hs = []
    for i, (f, m, H, b, z0) in enumerate(parts):
        h, _ = height(f, H, b, z0); hs.append(h)
        win = h > top; top = np.where(win, h, top); idx = np.where(win, i, idx)
    inside = idx >= 0
    # the normal from the top surface's slope
    gy, gx = np.gradient(top, eps)
    gx = np.where(inside, gx, 0); gy = np.where(inside, gy, 0)
    nz = 1.0 / np.sqrt(1 + gx * gx + gy * gy); nx, ny = -gx * nz, -gy * nz
    a, e = math.radians(SUN_DEG), math.radians(SUN_ELEV)
    L = np.array([math.cos(a) * math.cos(e), -math.sin(a) * math.cos(e), math.sin(e)])
    Hv = L + np.array([0, 0, 1.0]); Hv = Hv / np.linalg.norm(Hv)
    dif = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    spec_d = np.clip(nx * Hv[0] + ny * Hv[1] + nz * Hv[2], 0, 1)
    rng = np.random.default_rng(seed)
    grain = rng.normal(0, 1, x.shape)
    col = np.zeros(x.shape + (3,))
    for i, (f, m, H, b, z0) in enumerate(parts):
        base, shine, gr = M[m]
        sel = idx == i
        c = np.array(base, float)[None, None, :] * (0.34 + 0.78 * dif[..., None]) * (1 + gr * grain[..., None])
        c = c + 255 * shine * (spec_d[..., None] ** 40) * 0.9
        col = np.where(sel[..., None], c, col)
    # a contact line where one part stands on another: the edge of the higher one reads
    step = np.zeros(x.shape, bool)
    for dy, dx in ((0, 1), (1, 0), (0, -1), (-1, 0)):
        sh = np.roll(np.roll(top, dy * s, 0), dx * s, 1); si = np.roll(np.roll(idx, dy * s, 0), dx * s, 1)
        step |= inside & (si >= 0) & (si != idx) & (sh - top > 0.08)
    col = np.where(step[..., None], col * 0.45, col)
    # down to the art's own pixels, then the outline and the hard shadow at that size
    col = col.reshape(N, s, N, s, 3).mean(axis=(1, 3))
    cov = inside.reshape(N, s, N, s).mean(axis=(1, 3))
    solid = cov >= 0.5
    rgb = np.clip(col / np.maximum(cov, 1e-6)[..., None], 0, 255)
    rgb = (np.round(rgb / 8) * 8).clip(0, 255)   # a pixel's palette, not a photograph's
    out = np.zeros((N, N, 4))
    sh = np.roll(np.roll(solid, 3, 0), 3, 1) & ~solid
    out[sh] = (0, 0, 0, 120)
    edge = np.zeros_like(solid)
    for dy, dx in ((0, 1), (1, 0), (0, -1), (-1, 0)):
        edge |= np.roll(np.roll(solid, dy, 0), dx, 1)
    edge &= ~solid
    out[edge] = INK + (255,)
    out[solid, :3] = rgb[solid]; out[solid, 3] = 255
    return Image.fromarray(out.astype(np.uint8), 'RGBA')

def main():
    os.makedirs(OUT, exist_ok=True)
    tiles = []
    for i, (k, name, fn) in enumerate(ICONS):
        im = render(fn(), 1000 + i)
        im.save(os.path.join(OUT, k + '.png'))
        tiles.append((k, name, im))
    # the sheet: the eight beside their names at 1:1 and at 3x, on the crew screen's dark ground
    W, H = 8 * 150 + 40, 320
    sheet = Image.new('RGBA', (W, H), (24, 18, 13, 255)); dr = ImageDraw.Draw(sheet)
    try: font = ImageFont.truetype(os.path.join(ROOT, 'slices', 'fonts', 'BohemiaCasing-Regular.ttf'), 14)
    except Exception: font = ImageFont.load_default()
    dr.text((20, 10), "THE STAT ICONS (UI, 10/25): BUILT WITH LIGHT AND FORM, THE KIT'S ONE SUN; 72 PX = 24 POINTS ON HIS PHONE, 1:1", fill=(226, 189, 106), font=font)
    for i, (k, name, im) in enumerate(tiles):
        x = 20 + i * 150
        sheet.alpha_composite(im, (x + 39, 40))
        big = im.resize((144, 144), Image.NEAREST)
        sheet.alpha_composite(big, (x, 130))
        dr.text((x, 290), name, fill=(239, 227, 200), font=font)
    sheet.save(os.path.join(ROOT, 'records', 'target', 'UI_THE_STAT_ICONS_10_25_26.png'))
    print('wrote', len(tiles), 'icons to slices/stat_icons/ and the sheet records/target/UI_THE_STAT_ICONS_10_25_26.png')

if __name__ == '__main__':
    main()
