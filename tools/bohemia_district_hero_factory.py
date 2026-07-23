#!/usr/bin/env python3
"""BOHEMIA DISTRICT HERO FACTORY v2 (7/23/26) — ICONIC, purpose-legible.

v1 (all 6) went to the GRAVEYARD (DISTRICT_HERO_v1_7_23_26): Paolo, verbatim,
"they were all dogshit... look at pocket city 2 buildings online and what they
look like. they were all ICONIC - you could tell what the building was and the
purpose of it. thumbs down on all of them." v1's failure was generic tan iso
BOXES with tiny signature bits — nothing said its purpose at a glance.

THE FIX (this cook): each hero is a DISTINCTIVE ARCHITECTURE you read instantly,
the Pocket-City-2 lesson (colorful, bold, each building unmistakable) applied in
Bohemia's dead 3/4-iso world:
  - CITY HALL  -> a civic MONUMENT: a columned PORTICO + grand STEPS + a domed
                  CLOCK CUPOLA + a flagpole. Pale civic stone. Government, at a glance.
  - BATTERY    -> a POWER yard: tall lattice TRANSMISSION PYLONS carrying dead
                  lines + big TRANSFORMER cylinders + a HAZARD-striped inverter
                  house with a lightning mark. Electricity, at a glance.
  - TERMINAL   -> a BUS DEPOT: a big sweeping BUTTERFLY CANOPY over a row of bays
                  with real dead BUSES nosed in + a tall MARQUEE sign. Transit,
                  at a glance.

THE 45 DEGREE LAW (Paolo 7/17, gate art_45): every mass is an iso prism/dome —
sky-lit tops, a lit front-right face + a shadowed front-left face, on a ground
diamond. DEAD act-1 treatment (cracks, dead dark glass, a tattered flag, dead
buses, rust) rides ON TOP of the iconic form, never erasing it. Readable symbols
survive (the clock, the lightning mark, the bus silhouette). Zero purple.
Deterministic. Heights differ by design (city hall tallest via its cupola, the
power yard's pylons tall+thin, the depot low+wide under its canopy).

REUSE CHECK:
used BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (the CANON house skins, Paolo's
all-30-UP 7/21 verdict): the neutral stone/wall + roof TONE RAMPS are sampled
straight from the approved wall_plain / roof_shingle tiles in that bank (opened
+ read here), so the masses read as the same weathered material family the
married city wears. The iconic per-type colors (civic stone, hazard yellow,
transit steel, transformer gray) are shifts off those ramps + each district's
engine palette accent — no unrelated new palette invented. The architectural
ISO primitives (dome, colonnade, steps, pylon, cylinder, canopy, bus) are a
fresh cook: no existing iso-building sprite bank (banks/ has only top-down house
skins + the lamp/signal props, none a 3/4 building).

OUTPUT: banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt (UNJUDGED, v2): one
strong iconic hero per district (3). Paolo thumbs; approval wires it into the
CITY tab iso renderer.

Run from repo root: python3 tools/bohemia_district_hero_factory.py
"""
import base64
import io
import json
import math
import os
import sys

import numpy as np
from PIL import Image

HOUSE = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
OUT = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'


def rng(seed):
    s = (seed & 0xffffffff) or 1

    def r():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0xffffffff
        return s / 4294967296.0
    return r


def _sample_tile(bank, cls, idx=0):
    d = json.load(open(bank))
    ts = [x for x in d['tiles'] if x.get('cls') == cls]
    t = ts[idx % len(ts)]
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')).reshape(-1, 3)


def ramp_from(bank, cls, idx=0):
    px = _sample_tile(bank, cls, idx).astype(float)
    px = px[np.argsort(px.mean(1))]
    n = len(px)
    return [tuple(px[int(k * n / 6.0):int((k + 2) * n / 6.0)].mean(0).astype(int)) for k in range(5)]


def ramp_of(base):
    """A 5-step ramp around a base color (dark->light), for the iconic per-type tones."""
    return [shade(base, f) for f in (0.5, 0.68, 0.85, 1.0, 1.16)]


def shade(c, f):
    return (max(0, min(255, int(c[0] * f))), max(0, min(255, int(c[1] * f))), max(0, min(255, int(c[2] * f))))


def mix(c1, c2, t):
    return (int(c1[0] * (1 - t) + c2[0] * t), int(c1[1] * (1 - t) + c2[1] * t), int(c1[2] * (1 - t) + c2[2] * t))


def put(a, x, y, c, al=255):
    x = int(round(x)); y = int(round(y))
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1]:
        a[y, x, 0], a[y, x, 1], a[y, x, 2], a[y, x, 3] = c[0], c[1], c[2], al


def dark_px(a, x, y, f=0.7):
    x = int(round(x)); y = int(round(y))
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1] and a[y, x, 3] > 0:
        a[y, x, :3] = np.clip(a[y, x, :3].astype(int) * f, 0, 255).astype(int)


# ---------------------------------------------------------------- iso masses
def iso_prism(a, r, cx, by, hw, hd, h, wall, roof, sun='right', jitter=True):
    """A box from the world's three-quarter 45: lit right wall, shadowed left
    wall, sky-lit roof diamond. Returns the roof center (cx, by-h)."""
    lit, shd = (1.2, 0.62) if sun == 'right' else (0.62, 1.2)
    for x in range(int(cx), int(cx + hw) + 1):
        t = (x - cx) / float(hw) if hw else 0
        ey = by + hd * (1.0 - t)
        for yy in range(int(round(ey - h)), int(round(ey)) + 1):
            v = (yy - (ey - h)) / float(h) if h else 0
            ti = 2 if v < 0.55 else 1
            j = (0.97 + 0.06 * r()) if jitter else 1.0
            put(a, x, yy, shade(wall[ti], lit * j))
    for x in range(int(cx - hw), int(cx) + 1):
        t = (cx - x) / float(hw) if hw else 0
        ey = by + hd * (1.0 - t)
        for yy in range(int(round(ey - h)), int(round(ey)) + 1):
            v = (yy - (ey - h)) / float(h) if h else 0
            ti = 2 if v < 0.55 else 1
            j = (0.97 + 0.06 * r()) if jitter else 1.0
            put(a, x, yy, shade(wall[ti], shd * j))
    ty = by - h
    for dx in range(int(-hw), int(hw) + 1):
        span = int(round(hd * (1.0 - abs(dx) / float(hw)))) if hw else 0
        for dy in range(-span, span + 1):
            edge = (abs(dx) > hw - 2) or (span - abs(dy) < 2)
            put(a, cx + dx, ty + dy, shade(roof[3 if edge else 4], 1.0 + 0.04 * r()))
        put(a, cx + dx, ty + span, shade(roof[4], 1.12))
    return (cx, ty)


def iso_cyl(a, r, cx, by, rad, h, ramp, cap=None):
    """A vertical cylinder (transformer / drum): shaded across its round face,
    a sky-lit elliptical top cap."""
    cap = cap or ramp
    for dx in range(-rad, rad + 1):
        u = (dx + rad) / (2.0 * rad)                  # 0 left .. 1 right
        ti = int(1 + 3 * (1 - abs(u - 0.62) * 1.7))
        ti = max(0, min(4, ti))
        edge = int(round((rad * 0.5) * math.sqrt(max(0.0, 1 - (dx / (rad + 0.001)) ** 2))))
        for yy in range(int(by - h), int(by) + 1):
            put(a, cx + dx, yy, shade(ramp[ti], 0.97 + 0.06 * r()))
        # bottom ellipse foot
        for k in range(edge):
            put(a, cx + dx, by + k, shade(ramp[max(0, ti - 1)], 0.9))
    # top ellipse cap (sky-lit)
    ry = max(2, rad // 2)
    for dx in range(-rad, rad + 1):
        e = int(round(ry * math.sqrt(max(0.0, 1 - (dx / (rad + 0.001)) ** 2))))
        for dy in range(-e, e + 1):
            put(a, cx + dx, by - h + dy, shade(cap[4 if dy <= 0 else 3], 1.0 + 0.04 * r()))


def iso_dome(a, r, cx, cy, rad, ramp):
    """A hemispherical dome, sky-lit at the crown, shading to the rim. cy = base."""
    for dx in range(-rad, rad + 1):
        for dy in range(-rad, 1):
            d = math.sqrt(dx * dx + dy * dy)
            if d <= rad:
                # sky-lit toward upper-right
                l = 0.62 + 0.5 * (-(dx * 0.5 + dy) / rad)
                l = max(0.5, min(1.2, l))
                ti = int(1 + 3 * (d < rad * 0.85))
                put(a, cx + dx, cy + dy, shade(ramp[min(4, ti + 1)], l))
    # a little rim line
    for dx in range(-rad, rad + 1):
        put(a, cx + dx, cy, shade(ramp[1], 0.8))


def colonnade(a, r, x0, x1, ytop, ybot, stone):
    """A row of columns with a shadowed portico recess behind them."""
    # the recess (dark) behind the columns
    for x in range(int(x0), int(x1)):
        for y in range(int(ytop), int(ybot)):
            put(a, x, y, shade(stone[0], 0.55))
    n = max(3, int((x1 - x0) / 8))
    for i in range(n + 1):
        cxp = x0 + (x1 - x0) * i / float(n)
        for y in range(int(ytop), int(ybot)):
            put(a, cxp, y, shade(stone[3], 1.05 + 0.05 * r()))
            put(a, cxp + 1, y, shade(stone[4], 1.12))
            put(a, cxp - 1, y, shade(stone[1], 0.85))
        # capital + base
        put(a, cxp - 1, ytop, shade(stone[4], 1.15)); put(a, cxp + 1, ytop, shade(stone[4], 1.15))
        put(a, cxp - 1, ybot - 1, shade(stone[2], 0.9)); put(a, cxp + 1, ybot - 1, shade(stone[2], 0.9))


def steps(a, r, cx, by, w, n, stone):
    """Grand iso steps: n stacked shallow ledges, each a lit tread + dark riser."""
    for i in range(n):
        yy = by - i * 3
        ww = w - i * 4
        for dx in range(int(-ww), int(ww) + 1):
            span = max(1, int((6 - 0) * (1.0 - abs(dx) / float(ww))))
            put(a, cx + dx, yy, shade(stone[4], 1.1))          # lit tread edge
            put(a, cx + dx, yy + 1, shade(stone[2], 0.9))
            put(a, cx + dx, yy + 2, shade(stone[0], 0.7))       # riser shadow


def pylon(a, r, cx, by, h, steel):
    """A lattice transmission tower: two battered legs, cross-bracing, arms."""
    topw, botw = 3, 9
    def legx(side, yy):
        t = (by - yy) / float(h)
        return cx + side * (botw - (botw - topw) * t)
    for yy in range(int(by - h), int(by)):
        put(a, legx(-1, yy), yy, shade(steel[3], 1.05))
        put(a, legx(1, yy), yy, shade(steel[2], 0.85))
    # cross bracing (X's)
    seg = h // 6
    for k in range(6):
        y0 = by - k * seg; y1 = by - (k + 1) * seg
        for t in range(seg):
            f = t / float(seg)
            put(a, legx(-1, y0) + (legx(1, y1) - legx(-1, y0)) * f, y0 - t, shade(steel[2], 0.9))
            put(a, legx(1, y0) + (legx(-1, y1) - legx(1, y0)) * f, y0 - t, shade(steel[2], 0.9))
    # cross-arms near the top carrying dead insulators
    for lvl in (0.78, 0.92):
        ay = by - h * lvl
        for dx in range(-13, 14):
            put(a, cx + dx, ay, shade(steel[3], 1.0))
        for ix in (-11, 0, 11):
            put(a, cx + ix, ay + 1, (30, 30, 34)); put(a, cx + ix, ay + 2, (26, 26, 30))
    return cx, by - h


def canopy(a, r, cx, cy, w, d, ramp, droop=8):
    """A big sweeping butterfly canopy: a wide roof diamond that dips at the far
    edge (the bus-depot signature). cy = the roofline height at center."""
    for dx in range(-w, w + 1):
        t = abs(dx) / float(w)
        span = int(round(d * (1.0 - t)))
        dip = int(droop * (t ** 1.4))                  # the sweep
        for dy in range(-span, span + 1):
            lit = 4 if (span - abs(dy) >= 2 and t < 0.9) else 3
            put(a, cx + dx, cy + dy + dip, shade(ramp[lit], 1.0 + 0.04 * r()))
        put(a, cx + dx, cy + span + dip, shade(ramp[4], 1.14))     # lit near edge
        put(a, cx + dx, cy - span + dip, shade(ramp[1], 0.82))     # far shadow edge


def bus(a, r, cx, by, length, skin):
    """A dead bus in 3/4: a long low rounded box, window strip, wheels, dark glass."""
    ramp = ramp_of(skin)
    h = 11
    hd = 5
    # body (a low prism, longer on the x)
    for x in range(int(cx - length), int(cx) + 1):
        t = (cx - x) / float(length)
        ey = by + hd * (1 - t) * 0.4
        for yy in range(int(ey - h), int(ey) + 1):
            v = (yy - (ey - h)) / float(h)
            put(a, x, yy, shade(ramp[2 if v < 0.5 else 1], 0.9))
    for x in range(int(cx), int(cx + length) + 1):
        t = (x - cx) / float(length)
        ey = by + hd * (1 - t) * 0.4
        for yy in range(int(ey - h), int(ey) + 1):
            v = (yy - (ey - h)) / float(h)
            put(a, x, yy, shade(ramp[3 if v < 0.5 else 2], 1.08))
    # window strip (dead dark glass)
    for x in range(int(cx - length + 2), int(cx + length - 1), 4):
        put(a, x, by - h + 3, (20, 22, 26)); put(a, x + 1, by - h + 3, (26, 28, 32))
        put(a, x, by - h + 4, (18, 20, 24))
    # wheels
    for wx in (cx - length + 5, cx + length - 6):
        for dx in range(-2, 3):
            for dy in range(-1, 2):
                if dx * dx + dy * dy <= 4:
                    put(a, wx + dx, by + 1 + dy, (24, 22, 22))


def cracks(a, r, x0, x1, y0, y1, n=8):
    for _ in range(n):
        x = int(x0 + r() * (x1 - x0)); y = int(y0 + r() * (y1 - y0))
        for _k in range(int(3 + r() * 5)):
            dark_px(a, x, y, 0.72)
            x += -1 if r() < 0.5 else 1; y += 1 if r() < 0.7 else 0


def outline(a, col=(12, 11, 9)):
    op = a[..., 3] > 0
    outside = ~op
    b = np.zeros_like(op)
    b[1:] |= outside[1:] & op[:-1]; b[:-1] |= outside[:-1] & op[1:]
    b[:, 1:] |= outside[:, 1:] & op[:, :-1]; b[:, :-1] |= outside[:, :-1] & op[:, 1:]
    ys, xs = np.where(b)
    for y, x in zip(ys, xs):
        a[y, x] = (col[0], col[1], col[2], 255)


# ---------------------------------------------------------------- the heroes
def hero_cityhall(seed, stone_ramp, roof_ramp, accent):
    r = rng(seed)
    W, H = 132, 168
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx = W // 2
    by = H - 20
    STONE = ramp_of((198, 194, 180))                       # pale civic limestone
    # grand steps to the entrance
    steps(a, r, cx, by, 40, 6, STONE)
    # the main civic block (wide, symmetric), on a low plinth
    body_h = 40
    top = iso_prism(a, r, cx, by - 14, 46, 23, body_h, STONE, ramp_of((150, 92, 66)), jitter=True)
    cracks(a, r, cx - 40, cx + 40, by - 50, by - 16, n=10)
    # the columned PORTICO across the front-center (the civic tell)
    colonnade(a, r, cx - 22, cx + 22, int(by - 14 - body_h * 0.72), int(by - 18), STONE)
    # a pediment cap over the portico (a small triangle)
    for i in range(20):
        f = i / 20.0
        py = int(by - 14 - body_h * 0.72) - int(8 * (1 - abs(f - 0.5) * 2))
        put(a, cx - 20 + i * 2, py, shade(STONE[4], 1.12))
        put(a, cx - 20 + i * 2, py + 1, shade(STONE[3], 1.0))
    # symmetric wings (lower side blocks)
    iso_prism(a, r, cx - 38, by - 8, 12, 8, 22, STONE, ramp_of((150, 92, 66)))
    iso_prism(a, r, cx + 26, by - 8, 12, 8, 22, STONE, ramp_of((150, 92, 66)))
    # the domed CLOCK CUPOLA on top (the hero, tallest point)
    drum_cx, drum_y = cx, top[1] - 2
    iso_cyl(a, r, drum_cx, drum_y, 12, 16, ramp_of((186, 182, 168)))
    iso_dome(a, r, drum_cx, drum_y - 16, 12, ramp_of((120, 132, 120)))   # dead copper-patina dome
    # a lantern/cupola tip + a dead clock face on the drum
    fcx, fcy = drum_cx + 6, drum_y - 8
    for dx in range(-4, 5):
        for dy in range(-4, 5):
            if dx * dx + dy * dy <= 15:
                put(a, fcx + dx, fcy + dy, shade((214, 208, 190), 0.94 if dx * dx + dy * dy > 8 else 1.0))
    put(a, fcx, fcy, (30, 28, 24)); put(a, fcx + 2, fcy - 2, (30, 28, 24))   # stopped hands
    # a dead flag on a pole atop the cupola
    px = drum_cx
    for yy in range(drum_y - 16 - 12, drum_y - 16):
        put(a, px, yy, (60, 56, 48))
    for i in range(8):
        put(a, px + 1 + i, drum_y - 16 - 12 + int(i * 0.4), shade(mix(accent, (120, 60, 50), 0.4), 0.8))
        put(a, px + 1 + i, drum_y - 16 - 11 + int(i * 0.4), shade(mix(accent, (120, 60, 50), 0.4), 0.7))
    outline(a)
    return a, cx, by


def hero_battery(seed, stone_ramp, roof_ramp, accent):
    r = rng(seed)
    W, H = 140, 176
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx = W // 2
    by = H - 18
    GRAVEL = ramp_of((84, 80, 70))
    STEEL = ramp_of((120, 128, 138))
    # gravel pad
    iso_prism(a, r, cx, by, 56, 28, 4, GRAVEL, GRAVEL, jitter=True)
    # TRANSFORMER cylinders (a row, the electrical mass) with bushings on top
    tramp = ramp_of((122, 120, 116))
    for i, ox in enumerate((-30, -8, 14)):
        iso_cyl(a, r, cx + ox, by - 3, 9, 26, tramp)
        for bx in (-4, 0, 4):                              # HV bushings (little insulators)
            put(a, cx + ox + bx, by - 3 - 26 - 2, (200, 196, 186))
            put(a, cx + ox + bx, by - 3 - 26 - 3, (150, 148, 140))
    # the HAZARD-striped inverter house (yellow/black — the warning read)
    ih = iso_prism(a, r, cx + 34, by - 2, 14, 9, 20, ramp_of((150, 146, 132)), ramp_of((120, 116, 104)))
    for sx in range(int(cx + 22), int(cx + 46), 4):        # hazard stripes on the lit face
        for k in range(6):
            yy = int(by - 2 - 4 - k * 2)
            put(a, sx, yy, (196, 162, 44)); put(a, sx + 1, yy, (30, 28, 22))
    # a LIGHTNING mark placard (the icon that says power)
    lx, ly = cx + 40, int(by - 2 - 12)
    bolt = [(0, -5), (-1, -2), (1, -2), (0, 0), (-1, 2), (1, 2), (0, 4)]
    for dx, dy in bolt:
        put(a, lx + dx, ly + dy, (230, 206, 70)); put(a, lx + dx, ly + dy + 1, (200, 176, 50))
    # tall lattice TRANSMISSION PYLONS carrying dead lines (the power skyline)
    p1 = pylon(a, r, cx - 34, by - 4, 74, STEEL)
    p2 = pylon(a, r, cx + 6, by - 6, 88, STEEL)
    # dead droooping lines between the pylon arms
    for (ax, ay), (bx2, by2) in (((p1[0], by - 4 - 74 * 0.92), (p2[0], by - 6 - 88 * 0.92)),
                                 ((p1[0], by - 4 - 74 * 0.78), (p2[0], by - 6 - 88 * 0.78))):
        for t in range(0, 100, 2):
            f = t / 100.0
            x = ax + (bx2 - ax) * f
            sag = 10 * math.sin(f * math.pi)
            y = ay + (by2 - ay) * f + sag
            put(a, x, y, (40, 40, 44))
    outline(a)
    return a, cx, by


def hero_terminal(seed, stone_ramp, roof_ramp, accent):
    r = rng(seed)
    W, H = 148, 156
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx = W // 2
    by = H - 16
    WALL = ramp_of((176, 168, 150))
    TEAL = ramp_of((86, 120, 122))                         # weathered transit teal
    # the low apron pad
    iso_prism(a, r, cx, by, 60, 30, 3, ramp_of((92, 90, 84)), ramp_of((92, 90, 84)))
    # the waiting HALL (back-left, a glassy mid box)
    hall = iso_prism(a, r, cx - 30, by - 6, 22, 12, 26, WALL, ramp_of((120, 116, 104)))
    for wy in range(int(by - 6 - 22), int(by - 10), 5):    # dead glass curtain-wall bands
        for wx in range(int(cx - 30), int(cx - 30 + 22), 3):
            put(a, wx, wy, (24, 30, 34)); put(a, wx + 1, wy, (30, 38, 42))
    # a tall MARQUEE / departure sign pylon (the station tell)
    sx = cx - 52
    for yy in range(int(by - 52), int(by)):
        put(a, sx, yy, shade(WALL[1], 0.8)); put(a, sx + 1, yy, shade(WALL[2], 0.9))
    for dy in range(-14, 0):                               # the sign board
        for dx in range(-2, 10):
            put(a, sx + dx, by - 52 + dy, (34, 36, 40) if (dx + dy) % 2 else (44, 46, 52))
    for dx in range(-1, 9):                                # a bus glyph on the sign
        put(a, sx + dx, by - 60, (150, 190, 150))
    # a row of dead BUSES nosed in at the bays
    bus(a, r, cx + 6, by - 2, 16, (150, 132, 70))
    bus(a, r, cx + 34, by + 4, 15, (120, 132, 150))
    # the big sweeping BUTTERFLY CANOPY over the bays (the signature, on posts)
    can_cx, can_cy = cx + 20, by - 40
    for px in (cx - 4, cx + 20, cx + 44):                  # posts
        for yy in range(int(can_cy + 4), int(by)):
            put(a, px, yy, shade(WALL[1], 0.75))
    canopy(a, r, can_cx, can_cy, 40, 18, TEAL, droop=12)
    outline(a)
    return a, cx, by


HEROES = {'cityhall': hero_cityhall, 'battery': hero_battery, 'terminal': hero_terminal}
LABEL = {
    'cityhall': 'City Hall — columned portico + grand steps + domed clock cupola + flag',
    'battery': 'Battery/power yard — transmission pylons + transformer cylinders + hazard inverter house',
    'terminal': 'Transit terminal — sweeping butterfly canopy + dead buses + marquee sign',
}


def main():
    if not os.path.exists(HOUSE):
        print('missing CANON house-skin bank for reuse:', HOUSE); sys.exit(1)
    stone = ramp_from(HOUSE, 'wall', 0)
    roof = ramp_from(HOUSE, 'roof', 0)
    accents = {'cityhall': (150, 60, 50), 'battery': (210, 180, 60), 'terminal': (90, 150, 150)}
    out = {
        'version': 'DISTRICT_HERO_v2_7_23_26',
        'status': 'UNJUDGED (awaiting Paolo thumbs) — v2: ICONIC, purpose-legible 3/4-iso heroes (v1 boxes graveyarded)',
        'perspective': '45deg three-quarter (THE 45 LAW, Paolo 7/17): iso prisms/domes — sky-lit tops, lit front-right + shadowed front-left, on a ground diamond. Never flat side-on.',
        'reuse': 'stone/roof ramps sampled from CANON house skins (BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26); iconic per-type colors are shifts + engine accents.',
        'law': 'ICONIC first (you read the building + its purpose at a glance), DEAD act-1 treatment on top, zero purple, deterministic. Heights differ by design.',
        'anchor': 'base is the bottom vertex of the ground diamond; bx/by per entry is that anchor in sprite pixels.',
        'heroes': [],
    }
    for d, fn in HEROES.items():
        seed = 7300 + (hash(d) % 5000)
        a, bx, by = fn(seed & 0x7fffffff, stone, roof, accents[d])
        buf = io.BytesIO(); Image.fromarray(a, 'RGBA').save(buf, 'PNG')
        out['heroes'].append({'district': d, 'variant': 'iconic', 'label': LABEL[d],
                              'w': int(a.shape[1]), 'h': int(a.shape[0]),
                              'bx': int(bx), 'by': int(by),
                              'b64': base64.b64encode(buf.getvalue()).decode()})
    json.dump(out, open(OUT, 'w'))
    print('cooked %d ICONIC district heroes -> %s' % (len(out['heroes']), OUT))
    for h in out['heroes']:
        print('  %-9s %dx%d  %s' % (h['district'], h['w'], h['h'], h['label']))


if __name__ == '__main__':
    main()
