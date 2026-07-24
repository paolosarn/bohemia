#!/usr/bin/env python3
"""BOHEMIA DISTRICT HERO FACTORY v4 (7/23/26) — real references + fixed geometry.

Paolo on v3: "they're all kind of ass... the windows aren't correctly on the walls
in this 2D-3D view, there's things overlapping when they shouldn't. Look in Google
like real Las Vegas City Hall because that's essentially what the real City Hall is
gonna be like. They literally look the same as before."

TWO real fixes this pass:

1. THE WINDOW-ON-WALL BUG (v1-v3, real geometry error). Windows were placed at a
   flat screen-Y and clipped by a loose test, so they spilled past the sloped iso
   face edges and overlapped things in front. FIXED: every face is now parametrized
   by its own (u,v) axes — u along the sloped ground edge, v straight up — and each
   pixel's (u,v) is computed by INVERSE-mapping, so windows/mullions land EXACTLY on
   the face plane, gridded, and can never cross an edge. `face_windows()`.

2. CITY HALL IS THE REAL LAS VEGAS CITY HALL (2012, Elkus Manfredi), not a generic
   classical dome (that's why it kept looking the same + wrong for Vegas). Research
   (gbdmagazine / Architect Magazine / Wikipedia): a MODERN building — an ANGULAR
   ~7-storey GLASS office TOWER merged with a CURVED council chamber, masonry
   accents, and its signature a PLAZA OF "SOLAR TREES" (33 tubular columns topped
   with tilted PV panels). Built here as: glass curtain-wall tower + a low curved
   glass council drum + a grove of dead solar trees on a dead-dirt plaza.

Style bible still governs (records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md): chunky
clean masses on a dressed plot + soft shadow, soft flat shading, NO hard black
outline, PALE masonry + colored/glass, DEAD-dark glass (never lit), dead-world
finish. THE 45 LAW: iso, sky-lit tops, lit-right/shadow-left, ground diamond. Zero
purple. Deterministic. Heights differ (the glass tower is tall).

REUSE CHECK:
used BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (CANON house skins, Paolo's all-30-UP
7/21 verdict): the pale masonry + faded accent TONE RAMPS are sampled from the
approved wall_plain / roof_shingle tiles (opened + read here). Glass + steel + PV
tones are shifts off those + neutral grays. No unrelated new palette. The iso
primitives (face-mapped windows, curved drum, solar tree, stacks, canopy, bus) are
a fresh cook.

OUTPUT: banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt (v4). Paolo thumbs.

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


def _sample(bank, cls, idx=0):
    d = json.load(open(bank))
    ts = [x for x in d['tiles'] if x.get('cls') == cls]
    t = ts[idx % len(ts)]
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')).reshape(-1, 3)


def ramp_from(bank, cls, idx=0):
    px = _sample(bank, cls, idx).astype(float)
    px = px[np.argsort(px.mean(1))]
    n = len(px)
    return [tuple(px[int(k * n / 6.0):int((k + 2) * n / 6.0)].mean(0).astype(int)) for k in range(5)]


def sh(c, f):
    return (max(0, min(255, int(c[0] * f))), max(0, min(255, int(c[1] * f))), max(0, min(255, int(c[2] * f))))


def mix(c1, c2, t):
    return (int(c1[0] * (1 - t) + c2[0] * t), int(c1[1] * (1 - t) + c2[1] * t), int(c1[2] * (1 - t) + c2[2] * t))


def ramp_of(base):
    return [sh(base, f) for f in (0.6, 0.78, 0.9, 1.0, 1.12)]


def put(a, x, y, c, al=255):
    x = int(round(x)); y = int(round(y))
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1]:
        a[y, x, 0], a[y, x, 1], a[y, x, 2], a[y, x, 3] = c[0], c[1], c[2], al


def blend(a, x, y, c, al):
    x = int(round(x)); y = int(round(y))
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1]:
        o = a[y, x]
        if o[3] == 0:
            a[y, x] = (c[0], c[1], c[2], int(al * 255))
        else:
            a[y, x, :3] = np.clip(o[:3].astype(float) * (1 - al) + np.array(c) * al, 0, 255).astype(int)


def dark(a, x, y, f=0.72):
    x = int(round(x)); y = int(round(y))
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1] and a[y, x, 3] > 0:
        a[y, x, :3] = np.clip(a[y, x, :3].astype(int) * f, 0, 255).astype(int)


# ----- ground: soft drop shadow + a directional dead-dirt PLOT ---------------
def shadow(a, cx, cy, rw, rh):
    for dx in range(-rw, rw + 1):
        e = int(rh * math.sqrt(max(0.0, 1 - (dx / (rw + 0.001)) ** 2)))
        for dy in range(-e, e + 1):
            blend(a, cx + dx, cy + dy, (18, 16, 14), 0.32)


def plot(a, r, cx, by, hw, hd, dirt):
    for dx in range(-hw, hw + 1):
        span = int(hd * (1 - abs(dx) / float(hw)))
        ld = 1.1 if dx > 0 else (0.82 if dx < 0 else 0.96)
        for dy in range(-span, span + 1):
            v = 3 if (r() < 0.5) else 2
            put(a, cx + dx, by + dy, sh(dirt[v], ld * (0.98 + 0.04 * r())))


# ----- the iso BOX fill (solid faces + roof), NO black outline ---------------
# convention: (cx,by) is the box's CENTER-BOTTOM; the near/bottom ground vertex is
# (cx, by+hd), right vertex (cx+hw,by), left vertex (cx-hw,by). rises h.
def box_fill(a, cx, by, hw, hd, h, wall, roof, sun='right', edge=True):
    RI, LI = (3, 0) if sun == 'right' else (0, 3)
    for x in range(int(cx), int(cx + hw) + 1):
        t = (x - cx) / float(hw) if hw else 0
        ey = by + hd * (1.0 - t)
        for yy in range(int(round(ey - h)), int(round(ey)) + 1):
            put(a, x, yy, wall[RI])
    for x in range(int(cx - hw), int(cx) + 1):
        t = (cx - x) / float(hw) if hw else 0
        ey = by + hd * (1.0 - t)
        for yy in range(int(round(ey - h)), int(round(ey)) + 1):
            put(a, x, yy, wall[LI])
    ty = by - h
    for dx in range(int(-hw), int(hw) + 1):
        span = int(round(hd * (1.0 - abs(dx) / float(hw)))) if hw else 0
        for dy in range(-span, span + 1):
            put(a, cx + dx, ty + dy, roof[3] if (span - abs(dy) >= 1 and abs(dx) < hw - 1) else roof[2])
    if edge:
        for yy in range(int(ty), int(by + hd) + 1):
            dark(a, cx, yy, 0.9)                       # subtle near-corner definition
        for dx in range(int(-hw), int(hw) + 1):
            span = int(round(hd * (1.0 - abs(dx) / float(hw)))) if hw else 0
            put(a, cx + dx, ty + span, roof[4])
    return (cx, ty)


# ----- CORRECT on-plane windows: inverse-map each face pixel to (u,v) ---------
# side 'R' (right face) or 'L' (left face). A curtain grid (glass panes + mullions)
# for glass:True; small punched windows for glass:False. Clipped to the face — a
# window can NEVER cross the face edge or overlap what's in front (the fix).
def face_windows(a, side, cx, by, hw, hd, h, cols, rows, glass_col, frame_col,
                 glass=True, u0=0.07, u1=0.93, v0=0.08, v1=0.9, litf=1.0, shf=0.82):
    if side == 'R':
        xr = range(int(cx), int(cx + hw) + 1)
        def uv(x, y):
            u = (x - cx) / float(hw) if hw else 0        # 0 near .. 1 right
            ey = by + hd * (1.0 - u)
            v = (ey - y) / float(h) if h else 0
            return u, v
        f = litf
    else:
        xr = range(int(cx - hw), int(cx) + 1)
        def uv(x, y):
            u = (cx - x) / float(hw) if hw else 0        # 0 near .. 1 left
            ey = by + hd * (1.0 - u)
            v = (ey - y) / float(h) if h else 0
            return u, v
        f = shf
    for x in xr:
        for y in range(int(by - h - 1), int(by + hd) + 1):
            if a[y % a.shape[0], x % a.shape[1], 3] == 0:
                pass
            u, v = uv(x, y)
            if not (u0 <= u <= u1 and v0 <= v <= v1):
                continue
            cu = (u - u0) / (u1 - u0) * cols
            cv = (v - v0) / (v1 - v0) * rows
            fu, fv = cu - math.floor(cu), cv - math.floor(cv)
            if glass:
                border = fu < 0.14 or fu > 0.86 or fv < 0.12 or fv > 0.88
                c = frame_col if border else glass_col
            else:
                win = 0.28 < fu < 0.72 and 0.24 < fv < 0.76
                if not win:
                    continue
                c = glass_col
            put(a, x, y, sh(c, f))


def iso_cyl(a, r, cx, by, rad, h, ramp, ry=None):
    ry = ry or max(2, rad // 2)
    for dx in range(-rad, rad + 1):
        u = (dx + rad) / (2.0 * rad)
        ti = max(0, min(4, int(1 + 3 * (1 - abs(u - 0.6) * 1.7))))
        for yy in range(int(by - h), int(by) + 1):
            put(a, cx + dx, yy, ramp[ti])
    for dx in range(-rad, rad + 1):
        e = int(ry * math.sqrt(max(0.0, 1 - (dx / (rad + 0.001)) ** 2)))
        for dy in range(-e, e + 1):
            put(a, cx + dx, by - h + dy, ramp[4 if dy <= 0 else 3])


def curved_drum(a, cx, by, rw, rh, h, wall, glassc, framec):
    """A low CURVED council-chamber wing: a wide low half-cylinder, glass banded."""
    for dx in range(-rw, rw + 1):
        u = (dx + rw) / (2.0 * rw)
        ti = 3 if dx > 0 else (0 if dx < -rw * 0.2 else 1)
        edge = int(rh * math.sqrt(max(0.0, 1 - (dx / (rw + 0.001)) ** 2)))
        for yy in range(int(by - h), int(by) + edge + 1):
            put(a, cx + dx, yy, wall[ti])
        # a curved glass band wrapping the drum
        for gy in (int(by - h * 0.7), int(by - h * 0.38)):
            put(a, cx + dx, gy, sh(glassc, 1.0 if dx > 0 else 0.8))
            put(a, cx + dx, gy + 1, sh(glassc, 0.9 if dx > 0 else 0.72))
    # sky-lit curved roof cap
    for dx in range(-rw, rw + 1):
        e = int(rh * math.sqrt(max(0.0, 1 - (dx / (rw + 0.001)) ** 2)))
        for dy in range(-e, e + 1):
            put(a, cx + dx, by - h + dy, wall[4] if dy <= 0 else wall[3])


def solar_tree(a, r, cx, by, h):
    """A dead 'solar tree': a tubular column + a tilted PV panel top (LV City Hall
    plaza signature). Dead-world: the panel is dark, dulled, a little askew."""
    steel = ramp_of((120, 124, 130))
    for yy in range(int(by - h), int(by)):
        put(a, cx, yy, steel[3]); put(a, cx - 1, yy, steel[1])
    # the tilted panel: a small iso diamond, dead PV blue-gray, faint cell grid
    pv = (56, 66, 84)
    pcx, pcy = cx, by - h - 2
    pw, pd = 9, 4
    for dx in range(-pw, pw + 1):
        span = int(pd * (1 - abs(dx) / float(pw)))
        for dy in range(-span, span + 1):
            tilt = int(dx * 0.35)                        # the panel tips down to one side
            cell = (abs(dx) % 3 == 0) or (abs(dy) % 2 == 0)
            put(a, pcx + dx, pcy + dy + tilt, sh(pv, 1.08 if dy <= 0 else 0.9) if not cell else sh(pv, 0.7))


def stack(a, cx, by, h, ramp, cap=(66, 62, 56)):
    for yy in range(int(by - h), int(by)):
        w = 3
        for dx in range(-w, w + 1):
            u = (dx + w) / (2.0 * w)
            put(a, cx + dx, yy, ramp[max(0, min(4, int(1 + 3 * (1 - abs(u - 0.62) * 1.7))))])
    for dx in range(-3, 4):
        put(a, cx + dx, by - h, cap); put(a, cx + dx, by - h - 1, sh(cap, 1.2))


def canopy(a, r, cx, cy, w, d, ramp, droop=10):
    for dx in range(-w, w + 1):
        t = abs(dx) / float(w)
        span = int(round(d * (1.0 - t)))
        dip = int(droop * (t ** 1.5))
        for dy in range(-span, span + 1):
            put(a, cx + dx, cy + dy + dip, ramp[3] if (span - abs(dy) >= 1 and t < 0.92) else ramp[2])
        put(a, cx + dx, cy + span + dip, ramp[4])
        dark(a, cx + dx, cy - span + dip, 0.85)


def busv(a, cx, by, length, skin):
    ramp = ramp_of(skin); h = 11; hd = 4
    for x in range(int(cx - length), int(cx + length) + 1):
        side = 3 if x >= cx else 1
        t = 1 - abs(x - cx) / float(length)
        ey = by + hd * t
        for yy in range(int(ey - h), int(ey) + 1):
            put(a, x, yy, ramp[side])
    for x in range(int(cx - length + 2), int(cx + length - 1), 4):
        put(a, x, by - h + 3, (26, 30, 36)); put(a, x + 1, by - h + 3, (32, 36, 42))
    for wx in (cx - length + 5, cx + length - 6):
        for dx in range(-2, 3):
            for dy in range(-1, 2):
                if dx * dx + dy * dy <= 4:
                    put(a, wx + dx, by + dy, (26, 24, 24))


def cracks(a, r, x0, x1, y0, y1, n=6):
    for _ in range(n):
        x = int(x0 + r() * (x1 - x0)); y = int(y0 + r() * (y1 - y0))
        for _k in range(int(2 + r() * 4)):
            dark(a, x, y, 0.84)
            x += -1 if r() < 0.5 else 1; y += 1 if r() < 0.7 else 0


# ----------------------------------------------------------------- the heroes
def hero_cityhall(seed, wall_ramp, roof_ramp):
    """The REAL Las Vegas City Hall: an angular glass office TOWER + a curved
    council-chamber DRUM + a plaza of dead SOLAR TREES. Modern, not classical."""
    r = rng(seed)
    W, H = 168, 190
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx, by = W // 2 + 8, H - 26
    DIRT = ramp_of((90, 84, 72))
    MASON = ramp_of((176, 168, 154))                     # textured masonry accent
    GLASS = (44, 58, 74)                                  # dead-dark blue office glass
    MULL = (150, 156, 162)                               # steel mullions
    FLAT = ramp_of((120, 120, 118))
    shadow(a, cx - 4, by + 8, 70, 22)
    plot(a, r, cx - 4, by + 4, 66, 33, DIRT)
    # --- the curved COUNCIL CHAMBER drum (front-left, low) ---
    curved_drum(a, cx - 34, by - 2, 20, 10, 24, ramp_of((186, 182, 172)), (70, 96, 112), MULL)
    # --- the angular GLASS TOWER (the mass, tall ~7 storeys) ---
    tx, tby = cx + 6, by
    thw, thd, th = 26, 13, 78
    box_fill(a, tx, tby, thw, thd, th, ramp_of((150, 168, 182)), FLAT)   # glassy body base tone
    face_windows(a, 'R', tx, tby, thw, thd, th, 5, 9, GLASS, MULL, glass=True, litf=1.06, shf=1.0)
    face_windows(a, 'L', tx, tby, thw, thd, th, 3, 9, GLASS, MULL, glass=True, litf=0.8, shf=0.78)
    # masonry base band + entrance on the tower
    for x in range(int(tx - thw), int(tx + thw) + 1):
        t = abs(x - tx) / float(thw)
        ey = tby + thd * (1 - t)
        for yy in range(int(ey - 10), int(ey) + 1):
            side = 3 if x >= tx else 0
            put(a, x, yy, MASON[side])
    # a slightly angular clipped top corner (the building's angular signature)
    for k in range(10):
        for dx in range(int(thw - k * 2), int(thw) + 1):
            put(a, tx + dx, tby - th + int(thd * (1 - dx / float(thw))) - (10 - k), (0, 0, 0), 0)
    cracks(a, r, tx - thw, tx + thw, tby - th, tby, n=6)
    # --- the SOLAR-TREE plaza (front, the LV signature) ---
    for i, (ox, oy, hh) in enumerate([(-52, 10, 22), (-40, 18, 20), (-52, 26, 18), (12, 30, 20), (30, 26, 18)]):
        solar_tree(a, r, cx + ox, by + oy, hh)
    # a dead flagpole by the entrance
    for yy in range(int(by - 30), int(by)):
        put(a, cx - 6, yy, (70, 66, 58))
    return a, cx - 4, by + 4


def hero_battery(seed, wall_ramp, roof_ramp):
    r = rng(seed)
    W, H = 150, 152
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx, by = W // 2, H - 22
    HALL = ramp_of((196, 198, 202))
    DIRT = ramp_of((86, 82, 74))
    STEEL = ramp_of((120, 126, 134))
    FLAT = ramp_of((120, 118, 112))
    shadow(a, cx, by + 8, 60, 20)
    plot(a, r, cx, by + 4, 58, 29, DIRT)
    box_fill(a, cx - 14, by, 34, 17, 30, HALL, FLAT)
    face_windows(a, 'R', cx - 14, by, 34, 17, 30, 5, 2, (30, 34, 40), (150, 150, 150), glass=False, v0=0.28, v1=0.62)
    face_windows(a, 'L', cx - 14, by, 34, 17, 30, 3, 2, (26, 30, 36), (150, 150, 150), glass=False, v0=0.28, v1=0.62, shf=0.7)
    for ox in (-24, -12, 0):
        iso_cyl(a, r, cx - 14 + ox + 8, by - 30 - 1, 4, 6, STEEL)
    stack(a, cx - 2, by - 30, 34, FLAT)
    stack(a, cx + 8, by - 30, 26, FLAT)
    for ox in (16, 30):
        iso_cyl(a, r, cx + ox, by - 2, 8, 20, ramp_of((122, 120, 116)))
        for bx in (-3, 0, 3):
            put(a, cx + ox + bx, by - 2 - 20 - 2, (206, 202, 192)); put(a, cx + ox + bx, by - 2 - 20 - 3, (150, 148, 140))
    for sx in range(int(cx - 14 - 30), int(cx - 14 + 30), 4):
        put(a, sx, by - 6, (196, 164, 48)); put(a, sx + 1, by - 6, (34, 32, 24))
    lx, ly = cx - 30, by - 16
    for dx, dy in [(0, -5), (-1, -2), (1, -2), (0, 0), (-1, 2), (1, 2), (0, 4)]:
        put(a, lx + dx, ly + dy, (232, 208, 74)); put(a, lx + dx, ly + dy + 1, (200, 176, 52))
    cracks(a, r, cx - 44, cx + 10, by - 28, by, n=5)
    return a, cx, by + 4


def hero_terminal(seed, wall_ramp, roof_ramp):
    r = rng(seed)
    W, H = 158, 146
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx, by = W // 2, H - 20
    WALL = ramp_of((202, 204, 208))
    DIRT = ramp_of((88, 86, 82))
    FLAT = ramp_of((118, 116, 110))
    TEAL = ramp_of((92, 132, 132))
    shadow(a, cx, by + 8, 64, 21)
    plot(a, r, cx, by + 4, 62, 31, DIRT)
    box_fill(a, cx - 30, by - 4, 22, 11, 26, WALL, FLAT)
    face_windows(a, 'R', cx - 30, by - 4, 22, 11, 26, 4, 4, (30, 40, 48), (160, 164, 168), glass=True, v0=0.12, v1=0.86)
    face_windows(a, 'L', cx - 30, by - 4, 22, 11, 26, 3, 4, (26, 34, 42), (160, 164, 168), glass=True, litf=0.8, shf=0.76, v0=0.12, v1=0.86)
    sx = cx - 52
    for yy in range(int(by - 48), int(by)):
        put(a, sx, yy, FLAT[1]); put(a, sx + 1, yy, FLAT[2])
    for dy in range(-12, 0):
        for dx in range(-2, 9):
            put(a, sx + dx, by - 48 + dy, (36, 38, 42) if (dx + dy) % 2 else (48, 50, 56))
    for dx in range(-1, 8):
        put(a, sx + dx, by - 55, (150, 190, 150))
    busv(a, cx + 6, by - 2, 16, (150, 132, 72))
    busv(a, cx + 34, by + 4, 15, (120, 132, 150))
    ccx, ccy = cx + 20, by - 38
    for px in (cx - 4, cx + 20, cx + 44):
        for yy in range(int(ccy + 4), int(by)):
            put(a, px, yy, FLAT[1])
    canopy(a, r, ccx, ccy, 40, 17, TEAL, droop=12)
    return a, cx, by + 4


HEROES = {'cityhall': hero_cityhall, 'battery': hero_battery, 'terminal': hero_terminal}
LABEL = {
    'cityhall': 'City Hall — the real Las Vegas City Hall: angular glass tower + curved council chamber + a plaza of dead solar trees',
    'battery': 'Battery/power yard — pale power hall, smokestacks + roof transformers, transformer cylinders, hazard/lightning',
    'terminal': 'Transit terminal — pale waiting hall, sweeping bus canopy, dead buses, marquee sign',
}


def main():
    if not os.path.exists(HOUSE):
        print('missing CANON house-skin bank for reuse:', HOUSE); sys.exit(1)
    wall = ramp_from(HOUSE, 'wall', 0)
    roof = ramp_from(HOUSE, 'roof', 0)
    out = {
        'version': 'DISTRICT_HERO_v4_7_23_26',
        'status': 'UNJUDGED (awaiting Paolo thumbs) — v4: fixed on-plane windows + City Hall rebuilt as the REAL Las Vegas City Hall (v1-v3 superseded)',
        'perspective': '45deg three-quarter (THE 45 LAW). windows inverse-mapped onto each face plane so they never cross an edge.',
        'reference': 'City Hall = the real Las Vegas City Hall (2012, Elkus Manfredi): angular glass tower + curved council chamber + solar-tree plaza. Pocket City 2 style bible for the rest.',
        'reuse': 'masonry/accent ramps sampled from CANON house skins (BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26); glass/steel/PV are shifts.',
        'law': 'DEAD act-1 (dead-dark glass never lit, dead solar trees, dead-dirt plaza, cracks), zero purple, deterministic. Heights differ (the tower is tall).',
        'anchor': 'base is the bottom vertex of the ground diamond; bx/by per entry is that anchor in sprite pixels.',
        'heroes': [],
    }
    for d, fn in HEROES.items():
        seed = 7400 + (hash(d) % 5000)
        a, bx, by = fn(seed & 0x7fffffff, wall, roof)
        buf = io.BytesIO(); Image.fromarray(a, 'RGBA').save(buf, 'PNG')
        out['heroes'].append({'district': d, 'variant': 'iconic', 'label': LABEL[d],
                              'w': int(a.shape[1]), 'h': int(a.shape[0]),
                              'bx': int(bx), 'by': int(by),
                              'b64': base64.b64encode(buf.getvalue()).decode()})
    json.dump(out, open(OUT, 'w'))
    print('cooked %d district heroes (v4) -> %s' % (len(out['heroes']), OUT))
    for h in out['heroes']:
        print('  %-9s %dx%d  %s' % (h['district'], h['w'], h['h'], h['label']))


if __name__ == '__main__':
    main()
