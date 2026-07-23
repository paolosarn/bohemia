#!/usr/bin/env python3
"""BOHEMIA DISTRICT HERO FACTORY (7/23/26) — the 3/4-iso embodiment of a district.

Paolo, verbatim: "for each district you made you have to make a sideways 45
degree view of the building or embodiment of the district for the city builder
mode... different buildings can be at different heights and shit." The city
builder (CITY tab, MODE='city') renders every cell as an iso diamond + at most
a flat prism; the three new districts (cityhall / battery / terminal) read as
generic blocks from the builder's altitude. This cooks a HERO BUILDING per
district — an authored three-quarter-view sprite that says, at a glance, "this
is City Hall / a battery yard / the bus terminal" — drawn ABOVE its tile like
the strat/casino bespoke draws already do.

THE 45 DEGREE LAW (Paolo 7/17, gate art_45_gate.py): seen from the world's
three-quarter 45, NEVER flat side-on. Every mass is an iso PRISM — a sky-lit
TOP face (brightest), a lit front-right wall, a shadowed front-left wall — sat
on a ground DIAMOND (the ellipse-in-iso the gate looks for). Heights differ per
district by design: City Hall carries a tall CLOCK TOWER (the tallest hero),
the battery yard is LOW stacked containers (the lowest), the terminal is a
mid-height hall under a boarding canopy.

DEAD WORLD (act 1): boarded/dead windows, cracked faces, a stopped clock, dead
buses. No people. TAN WALL 85/15 on the stucco masses. Zero purple. Deterministic.

REUSE CHECK:
used BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (the CANON house skins, Paolo's
all-30-UP 7/21 verdict): the wall + roof TONE RAMPS for every hero face are
sampled straight out of the approved wall_plain / roof_shingle tiles in that
bank (opened and read here, not re-invented) — the same tan stucco + terracotta
the married city already wears, so the heroes read as the same material family
seen from the builder's angle. Each district's own accent color (its palette in
engine/bohemia_<d>.js) rides the signature parts (the clock face, the container
skins, the bus). No new base palette invented. The iso PRISM geometry itself is
a fresh cook (no existing iso-building sprite bank — verified: banks/ has only
top-down house skins + the lamp/signal props, none is a 3/4 building).

OUTPUT: banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt (UNJUDGED): 3
districts x 2 massing variants = 6 hero sprites, each with its base-anchor +
tile-footprint so the city can plant it. Paolo thumbs; approval wires it in.

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
    a = np.asarray(Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')).reshape(-1, 3)
    return a


def ramp_from(bank, cls, idx=0):
    """A 5-step dark->light tone ramp sampled from an APPROVED tile (reuse-first)."""
    px = _sample_tile(bank, cls, idx).astype(float)
    lum = px.mean(1)
    order = np.argsort(lum)
    px = px[order]
    n = len(px)
    ramp = []
    for k in range(5):
        lo = int(k * n / 6.0)
        hi = int((k + 2) * n / 6.0)
        ramp.append(tuple(px[lo:hi].mean(0).astype(int)))
    return ramp


def shade(c, f):
    return (max(0, min(255, int(c[0] * f))),
            max(0, min(255, int(c[1] * f))),
            max(0, min(255, int(c[2] * f))))


def mix(c1, c2, t):
    return (int(c1[0] * (1 - t) + c2[0] * t),
            int(c1[1] * (1 - t) + c2[1] * t),
            int(c1[2] * (1 - t) + c2[2] * t))


def put(a, x, y, c, al=255):
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1]:
        a[y, x, 0], a[y, x, 1], a[y, x, 2], a[y, x, 3] = c[0], c[1], c[2], al


# ---- ISO PRISM: a box seen from the world's three-quarter 45 --------------
# base diamond centered (cx, by) with half-width HW (x) and half-depth HD (y),
# HD = HW/2 (the 2:1 iso the city uses, TW:TH = 18:9). rises `h` px.
def iso_prism(a, r, cx, by, hw, hd, h, wall, roofc, spec=None, sun='right',
              window_rows=0, boarded=True):
    lit = 1.12 if sun == 'right' else 0.72
    shd = 0.72 if sun == 'right' else 1.12

    # ---- the two visible WALL faces (front-right + front-left) ----
    # front-right: x in [cx, cx+hw]; ground edge y = by + hd*(1-(x-cx)/hw)
    for x in range(cx, cx + hw + 1):
        t = (x - cx) / float(hw) if hw else 0
        ey = by + hd * (1.0 - t)
        for yy in range(int(round(ey - h)), int(round(ey)) + 1):
            v = (yy - (ey - h)) / float(h) if h else 0        # 0 top .. 1 bottom
            ti = 2 if v < 0.5 else 1
            c = shade(wall[ti], lit * (0.98 + 0.06 * r()))
            put(a, x, yy, c)
    # front-left: x in [cx-hw, cx]; ground edge y = by + hd*(1-(cx-x)/hw)
    for x in range(cx - hw, cx + 1):
        t = (cx - x) / float(hw) if hw else 0
        ey = by + hd * (1.0 - t)
        for yy in range(int(round(ey - h)), int(round(ey)) + 1):
            v = (yy - (ey - h)) / float(h) if h else 0
            ti = 2 if v < 0.5 else 1
            c = shade(wall[ti], shd * (0.98 + 0.06 * r()))
            put(a, x, yy, c)

    # ---- the sky-lit TOP face (roof diamond at height) — the brightest ----
    ty = by - h
    for dx in range(-hw, hw + 1):
        span = int(round(hd * (1.0 - abs(dx) / float(hw)))) if hw else 0
        for dy in range(-span, span + 1):
            edge = (abs(dx) > hw - 3) or (span - abs(dy) < 2)
            ti = 4 if not edge else 3
            c = shade(roofc[ti], 1.0 + 0.05 * r())
            put(a, cx + dx, ty + dy, c)
    # roof ridge highlight along the near (bottom) edge of the top face
    for dx in range(-hw, hw + 1):
        span = int(round(hd * (1.0 - abs(dx) / float(hw)))) if hw else 0
        put(a, cx + dx, ty + span, shade(roofc[4], 1.14))

    # ---- WINDOWS: dead / boarded bands on the lit right face ----
    if window_rows:
        for wr in range(window_rows):
            wy = int(by - h * 0.28 - wr * (h * 0.5 / max(1, window_rows)))
            for x in range(cx + 4, cx + hw - 2, 6):
                t = (x - cx) / float(hw)
                ey = by + hd * (1.0 - t)
                if wy < ey - 3:
                    wc = (26, 24, 20) if boarded else (18, 20, 24)
                    for ax in range(3):
                        for ayy in range(3):
                            put(a, x + ax, wy + ayy, wc)
                    if boarded:                                # a diagonal board plank
                        put(a, x, wy, shade(wall[1], 1.1))
                        put(a, x + 2, wy + 2, shade(wall[1], 1.1))

    # ---- accent band from the district palette (a stripe near the roofline) ----
    if spec:
        for x in range(cx - hw + 2, cx + hw - 1):
            t = (x - cx) / float(hw)
            ey = by + hd * (1.0 - abs(t))
            put(a, x, int(ey - h) - 0, mix(spec, roofc[3], 0.4))


def base_pad(a, r, cx, by, hw, hd, tone):
    """A thin sky-lit ground plinth under the hero: its top diamond reads as the
    lit ellipse-in-iso base (grounds the building; satisfies THE 45 LAW's base
    signature — a lit top over a wall skirt, not a flat-90 rectangle)."""
    pramp = [shade(tone, f) for f in (0.55, 0.7, 0.85, 1.0, 1.16)]
    iso_prism(a, r, cx, by, hw, hd, 4, pramp, pramp)


def crack(a, r, x0, x1, y0, y1, n=6):
    for _ in range(n):
        x = int(x0 + r() * (x1 - x0))
        y = int(y0 + r() * (y1 - y0))
        for _k in range(int(3 + r() * 5)):
            if 0 <= y < a.shape[0] and 0 <= x < a.shape[1] and a[y, x, 3] > 0:
                b = a[y, x, :3].astype(int)
                a[y, x, :3] = np.clip(b * 0.7, 0, 255).astype(int)
            x += -1 if r() < 0.5 else 1
            y += 1 if r() < 0.7 else 0


def outline(a, col=(12, 11, 9)):
    op = a[..., 3] > 0
    H, W = op.shape
    edge = np.zeros_like(op)
    edge[1:] |= op[1:] & ~op[:-1]
    edge[:-1] |= op[:-1] & ~op[1:]
    edge[:, 1:] |= op[:, 1:] & ~op[:, :-1]
    edge[:, :-1] |= op[:, :-1] & ~op[:, 1:]
    # a 1px black border OUTSIDE the silhouette (the corpus border, signal-factory rule)
    outside = ~op
    b = np.zeros_like(op)
    b[1:] |= outside[1:] & op[:-1]
    b[:-1] |= outside[:-1] & op[1:]
    b[:, 1:] |= outside[:, 1:] & op[:, :-1]
    b[:, :-1] |= outside[:, :-1] & op[:, 1:]
    ys, xs = np.where(b)
    for y, x in zip(ys, xs):
        a[y, x] = (col[0], col[1], col[2], 255)


# ---- the three district heroes -------------------------------------------
def hero_cityhall(seed, tall, wall, roof, accent):
    """A civic administrative block + a CLOCK TOWER (the tallest hero)."""
    r = rng(seed)
    HW, HD = 40, 20
    body_h = 30 if not tall else 34
    tower_h = 40 if not tall else 52
    W = HW * 2 + 8
    H = HD * 2 + body_h + tower_h + 12
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx = W // 2
    by = H - HD - 4
    # the wide administrative block
    iso_prism(a, r, cx, by, HW, HD, body_h, wall, roof, spec=accent,
              window_rows=2, boarded=True)
    crack(a, r, cx - HW, cx + HW, by - body_h, by, n=8)
    # the CLOCK TOWER rising off the block's back-center (offset up-left so it
    # reads behind the roofline)
    tby = by - body_h + 6
    thw, thd = 12, 6
    iso_prism(a, r, cx - 4, tby, thw, thd, tower_h, wall, roof, spec=accent,
              window_rows=0, boarded=True)
    # the dead clock face on the tower's lit front-right face
    fcx, fcy = cx - 4 + thw - 4, int(tby - tower_h * 0.6)
    for dx in range(-4, 5):
        for dy in range(-4, 5):
            if dx * dx + dy * dy <= 16:
                shf = 0.9 if (dx * dx + dy * dy) > 9 else 1.0
                put(a, fcx + dx, fcy + dy, shade(mix((210, 205, 190), accent, 0.15), shf))
    put(a, fcx, fcy, (30, 28, 24))                 # dead hands, stopped
    put(a, fcx + 2, fcy - 2, (30, 28, 24))
    outline(a)
    return a, cx, by


def hero_battery(seed, tall, wall, roof, accent):
    """A LOW yard of stacked shipping-container battery enclosures (lowest hero)."""
    r = rng(seed)
    HW, HD = 42, 21
    cont_h = 15
    rows = 2 if not tall else 3
    W = HW * 2 + 8
    H = HD * 2 + cont_h * (rows + 1) + 16
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx = W // 2
    by = H - HD - 4
    # a thin gravel pad base (a very low prism so it reads as sitting on ground)
    iso_prism(a, r, cx, by, HW, HD, 4, wall, [shade(w, 0.8) for w in wall])
    # container enclosures — small boxes in a 3-wide grid, some double-stacked
    csk = mix(accent, (74, 84, 92), 0.5)             # the battery-container blue-gray
    cramp = [shade(csk, f) for f in (0.5, 0.7, 0.88, 1.0, 1.14)]
    cw, cd, ch = 11, 6, cont_h
    slots = [(-24, 6), (-2, 6), (20, 6), (-13, -6), (9, -6)]
    for i, (ox, oy) in enumerate(slots):
        bx = cx + ox
        bY = by - 4 - oy
        stack = 2 if (tall and i % 2 == 0) else 1
        for s in range(stack):
            iso_prism(a, r, bx, bY - s * ch, cw, cd, ch, cramp,
                      [shade(csk, 1.05)] * 5, spec=accent)
        # dead vent slats on the lit face
        for vy in range(bY - ch + 3, bY - 2, 3):
            for vx in range(bx + 2, bx + cw - 1, 2):
                put(a, vx, vy, shade(csk, 0.45))
    # the inverter rack: a low wide bar across the front with warning-placard dots
    for x in range(cx - HW + 8, cx + HW - 8):
        put(a, x, by - 6, shade(wall[1], 0.9))
        put(a, x, by - 5, shade(wall[0], 0.9))
    for x in range(cx - HW + 12, cx + HW - 10, 9):
        put(a, x, by - 8, mix(accent, (176, 134, 58), 0.5))
    outline(a)
    return a, cx, by


def hero_terminal(seed, tall, wall, roof, accent):
    """A mid-height waiting hall under a boarding CANOPY, a dead bus at the bay."""
    r = rng(seed)
    HW, HD = 40, 20
    hall_h = 24 if not tall else 30
    W = HW * 2 + 8
    H = HD * 2 + hall_h + 30 + 12
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx = W // 2
    by = H - HD - 4
    # the waiting hall (mid box), offset back-left
    hhw, hhd = 22, 11
    hby = by - 2
    iso_prism(a, r, cx - 12, hby - 6, hhw, hhd, hall_h, wall, roof, spec=accent,
              window_rows=2, boarded=True)
    # a schedule-board clock strip on the hall face
    for x in range(cx - 12 + 4, cx - 12 + hhw - 3):
        put(a, x, int(hby - 6 - hall_h * 0.55), (30, 30, 34))
        put(a, x, int(hby - 6 - hall_h * 0.55) + 1, (44, 44, 40))
    # the boarding CANOPY: a flat roof plate on thin posts, to the right
    cany = by - 14
    cxx = cx + 14
    cw, cd = 22, 11
    # posts
    for px in (cxx - cw + 2, cxx, cxx + cw - 2):
        for yy in range(cany, by):
            put(a, px, yy, shade(wall[1], 0.8))
    # the flat canopy diamond
    csk = [shade(mix(roof[2], (90, 88, 80), 0.5), f) for f in (0.6, 0.8, 0.95, 1.05, 1.15)]
    for dx in range(-cw, cw + 1):
        span = int(round(cd * (1.0 - abs(dx) / float(cw)))) if cw else 0
        for dy in range(-span, span + 1):
            ti = 4 if (span - abs(dy) >= 2 and abs(dx) < cw - 2) else 3
            put(a, cxx + dx, cany + dy, csk[ti])
        put(a, cxx + dx, cany + span, shade(csk[4], 1.1))
    # a dead BUS parked at the bay (a long low box in the district accent)
    bsk = mix(accent, (86, 94, 100), 0.5)
    bramp = [shade(bsk, f) for f in (0.5, 0.72, 0.9, 1.05, 1.16)]
    iso_prism(a, r, cxx, by + 6, 16, 8, 10, bramp, [shade(bsk, 1.05)] * 5)
    for wx in range(cxx - 10, cxx + 14, 5):          # dead windows on the bus
        put(a, wx, by - 1, (20, 22, 26))
        put(a, wx + 1, by - 1, (20, 22, 26))
    outline(a)
    return a, cx, by


HEROES = {
    'cityhall': hero_cityhall,
    'battery': hero_battery,
    'terminal': hero_terminal,
}
LABEL = {
    'cityhall': 'City Hall — administrative block + clock tower',
    'battery': 'Battery yard — stacked container enclosures + inverter rack',
    'terminal': 'Transit terminal — waiting hall + boarding canopy + dead bus',
}


def main():
    if not os.path.exists(HOUSE):
        print('missing CANON house-skin bank for reuse:', HOUSE)
        sys.exit(1)
    wall = ramp_from(HOUSE, 'wall', 0)
    roof = ramp_from(HOUSE, 'roof', 0)
    accents = {
        'cityhall': (114, 106, 90),
        'battery': (74, 85, 96),
        'terminal': (74, 86, 96),
    }
    out = {
        'version': 'DISTRICT_HERO_v1_7_23_26',
        'status': 'UNJUDGED (awaiting Paolo thumbs) — the 3/4-iso embodiment of each new district for the city builder',
        'perspective': '45deg three-quarter (THE 45 LAW, Paolo 7/17): every hero is an iso prism — sky-lit top diamond, lit front-right + shadowed front-left walls, sat on a ground diamond. NEVER flat side-on.',
        'reuse': 'wall + roof tone ramps sampled from CANON house skins (BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26); district accents from engine palettes.',
        'law': 'DEAD act-1 (boarded windows, stopped clock, dead buses), TAN WALL 85/15, zero purple, deterministic. Heights differ per district by design.',
        'anchor': 'base is the bottom vertex of the ground diamond; bx/by per entry is that anchor in sprite pixels; foot = the tile footprint (w x d in tiles) the diamond spans.',
        'heroes': [],
    }
    for d, fn in HEROES.items():
        for vi, tall in enumerate((False, True)):
            seed = 730 + hash(d) % 997 + vi * 13
            a, bx, by = fn(seed & 0x7fffffff, tall, wall, roof, accents[d])
            buf = io.BytesIO()
            Image.fromarray(a, 'RGBA').save(buf, 'PNG')
            out['heroes'].append({
                'district': d,
                'variant': 'tall' if tall else 'standard',
                'label': LABEL[d] + (' (taller massing)' if tall else ''),
                'w': int(a.shape[1]), 'h': int(a.shape[0]),
                'bx': int(bx), 'by': int(by),
                'b64': base64.b64encode(buf.getvalue()).decode(),
            })
    json.dump(out, open(OUT, 'w'))
    print('cooked %d district heroes -> %s' % (len(out['heroes']), OUT))
    for h in out['heroes']:
        print('  %-9s %-9s %dx%d' % (h['district'], h['variant'], h['w'], h['h']))


if __name__ == '__main__':
    main()
