#!/usr/bin/env python3
"""BOHEMIA DISTRICT HERO FACTORY v3 (7/23/26) — built to the STYLE BIBLE.

v1 (generic boxes) and v2 (sight-unseen, hard black outlines + muddy walls) both
missed. Paolo sent a 66-shot Pocket City 2 reference set (saved forever in
records/refs/pocketcity2/) and I distilled it into
records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md. v3 is cooked to that bible.

THE PC2 LOOK, applied in our DEAD world:
  - chunky, SIMPLE, bold masses on a dressed PLOT with a soft DROP SHADOW
  - soft 3-tone shading (bright top / mid right face / darker left face), FLAT,
    and NO hard black outline (v2's biggest sin — killed here)
  - PALE weathered walls (cream / stone / light gray) with the COLOR on the ROOF
  - big NEAT window GRIDS in DEAD-DARK glass (abandoned: never the warm night glow)
  - each building's ONE iconic signature, bold: City Hall's DOME + columns, the
    power plant's SMOKESTACKS + transformers, the depot's sweeping CANOPY + bus
  - DEAD act-1 finish on top: dead-dirt plot (no living turf), faded roof, a
    boarded window, cracks, a dead vehicle — but the ICON reads first

THE 45 DEGREE LAW (Paolo 7/17, gate art_45): iso prisms/domes, sky-lit tops, a
lit right face + a shadowed left face, on a ground diamond. Zero purple.
Deterministic. Heights differ by design.

REUSE CHECK:
used BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (the CANON house skins, Paolo's
all-30-UP 7/21 verdict): the PALE wall + faded roof TONE RAMPS are sampled from
the approved wall_plain / roof_shingle tiles in that bank (opened + read here),
so the heroes wear the same weathered stucco/terracotta family as the married
city. Iconic per-type accents (stone, hazard yellow, transit teal, transformer
gray) are shifts off those ramps. No unrelated new palette. The iso primitives
(soft box, dome, colonnade, cylinder, canopy, bus, window grid) are a fresh cook.

OUTPUT: banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt (UNJUDGED, v3): one
iconic hero per district (3). Paolo thumbs; approval wires it into the CITY tab.

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
    return [sh(base, f) for f in (0.62, 0.78, 0.9, 1.0, 1.1)]


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
            t = al
            a[y, x, :3] = np.clip(o[:3].astype(float) * (1 - t) + np.array(c) * t, 0, 255).astype(int)


def dark(a, x, y, f=0.72):
    x = int(round(x)); y = int(round(y))
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1] and a[y, x, 3] > 0:
        a[y, x, :3] = np.clip(a[y, x, :3].astype(int) * f, 0, 255).astype(int)


# ----- soft drop shadow + a dressed dead-dirt PLOT under the building ---------
def shadow(a, cx, cy, rw, rh):
    for dx in range(-rw, rw + 1):
        e = int(rh * math.sqrt(max(0.0, 1 - (dx / (rw + 0.001)) ** 2)))
        for dy in range(-e, e + 1):
            blend(a, cx + dx, cy + dy, (18, 16, 14), 0.34)


def plot(a, r, cx, by, hw, hd, dirt):
    """A flat dead-dirt iso lot the building sits on (no living turf: dead-world).
    Lit directionally (right brighter, left in shadow) like the 3/4 world's ground,
    so the plot reinforces the light direction rather than flattening it."""
    for dx in range(-hw, hw + 1):
        span = int(hd * (1 - abs(dx) / float(hw)))
        ld = 1.12 if dx > 0 else (0.8 if dx < 0 else 0.96)   # right lit / left shadow
        for dy in range(-span, span + 1):
            v = 3 if (r() < 0.5) else 2
            put(a, cx + dx, by + dy, sh(dirt[v], ld * (0.98 + 0.04 * r())))


# ----- the soft iso box: 3 flat tones, NO black outline ----------------------
def box(a, cx, by, hw, hd, h, wall, roof, sun='right', edge=True):
    """cx,by = bottom vertex of the base diamond. Bright top / mid right / dark
    left, flat and clean. A subtle (non-black) corner edge for definition."""
    RI, LI = (3, 0) if sun == 'right' else (0, 3)      # clean light side / clearly darker shadow side (PC2)
    # right face
    for x in range(int(cx), int(cx + hw) + 1):
        t = (x - cx) / float(hw) if hw else 0
        ey = by + hd * (1.0 - t)
        for yy in range(int(round(ey - h)), int(round(ey)) + 1):
            put(a, x, yy, wall[RI])
    # left face
    for x in range(int(cx - hw), int(cx) + 1):
        t = (cx - x) / float(hw) if hw else 0
        ey = by + hd * (1.0 - t)
        for yy in range(int(round(ey - h)), int(round(ey)) + 1):
            put(a, x, yy, wall[LI])
    # top face (roof)
    ty = by - h
    for dx in range(int(-hw), int(hw) + 1):
        span = int(round(hd * (1.0 - abs(dx) / float(hw)))) if hw else 0
        for dy in range(-span, span + 1):
            put(a, cx + dx, ty + dy, roof[3] if (span - abs(dy) >= 1 and abs(dx) < hw - 1) else roof[2])
    # subtle definition: the near vertical corner + roof near-edge, one tone down
    if edge:
        for yy in range(int(ty), int(by) + 1):
            dark(a, cx, yy, 0.9)
        for dx in range(int(-hw), int(hw) + 1):
            span = int(round(hd * (1.0 - abs(dx) / float(hw)))) if hw else 0
            put(a, cx + dx, ty + span, roof[4])       # lit near ridge
    return (cx, ty)


def window_grid(a, cx, by, hw, hd, h, sun='right', rows=3, top=0.72, bot=0.22, boarded_at=None, wall=None):
    """Neat rows/cols of DEAD-dark glass on the lit right face."""
    glass = (28, 32, 38)
    for rr in range(rows):
        wy = by - h * (bot + (top - bot) * rr / max(1, rows - 1))
        i = 0
        for x in range(int(cx + hw * 0.18), int(cx + hw * 0.9), 5):
            t = (x - cx) / float(hw)
            ey = by + hd * (1.0 - t)
            if wy < ey - 2:
                bd = (boarded_at is not None and (rr, i) == boarded_at and wall is not None)
                for ax in range(3):
                    for ayy in range(3):
                        put(a, x + ax, wy - ayy, sh(wall[2], 1.05) if bd else glass)
                if bd:
                    put(a, x, wy, sh(wall[3], 1.1)); put(a, x + 2, wy - 2, sh(wall[3], 1.1))
            i += 1


def dome(a, r, cx, cy, rad, ramp):
    for dx in range(-rad, rad + 1):
        for dy in range(-rad, 1):
            d = math.sqrt(dx * dx + dy * dy)
            if d <= rad:
                l = 0.7 + 0.42 * (-(dx * 0.4 + dy) / rad)
                put(a, cx + dx, cy + dy, sh(ramp[3], max(0.6, min(1.15, l))))
    for dx in range(-rad, rad + 1):
        put(a, cx + dx, cy, sh(ramp[1], 0.9))


def cyl(a, r, cx, by, rad, h, ramp):
    for dx in range(-rad, rad + 1):
        u = (dx + rad) / (2.0 * rad)
        ti = max(0, min(4, int(1 + 3 * (1 - abs(u - 0.6) * 1.7))))
        for yy in range(int(by - h), int(by) + 1):
            put(a, cx + dx, yy, ramp[ti])
    ry = max(2, rad // 2)
    for dx in range(-rad, rad + 1):
        e = int(ry * math.sqrt(max(0.0, 1 - (dx / (rad + 0.001)) ** 2)))
        for dy in range(-e, e + 1):
            put(a, cx + dx, by - h + dy, ramp[4 if dy <= 0 else 3])


def stack(a, cx, by, h, ramp, cap=(70, 66, 60)):
    """A smokestack: a slim tapering cylinder with a dark rim."""
    for yy in range(int(by - h), int(by)):
        w = 3
        for dx in range(-w, w + 1):
            u = (dx + w) / (2.0 * w)
            put(a, cx + dx, yy, ramp[max(0, min(4, int(1 + 3 * (1 - abs(u - 0.62) * 1.7))))])
    for dx in range(-3, 4):
        put(a, cx + dx, by - h, cap)
        put(a, cx + dx, by - h - 1, sh(cap, 1.2))


def colonnade(a, x0, x1, ytop, ybot, stone):
    for x in range(int(x0), int(x1)):
        for y in range(int(ytop), int(ybot)):
            put(a, x, y, sh(stone[0], 0.7))                 # portico recess
    n = max(3, int((x1 - x0) / 7))
    for i in range(n + 1):
        cxp = x0 + (x1 - x0) * i / float(n)
        for y in range(int(ytop), int(ybot)):
            put(a, cxp, y, stone[3]); put(a, cxp + 1, y, stone[4])
        put(a, cxp, ytop - 1, stone[4]); put(a, cxp, ybot - 1, stone[2])


def steps(a, cx, by, w, n, stone):
    for i in range(n):
        yy = by - i * 2
        ww = w - i * 3
        for dx in range(int(-ww), int(ww) + 1):
            put(a, cx + dx, yy, stone[4])
            put(a, cx + dx, yy + 1, stone[2])


def canopy(a, r, cx, cy, w, d, ramp, droop=10):
    for dx in range(-w, w + 1):
        t = abs(dx) / float(w)
        span = int(round(d * (1.0 - t)))
        dip = int(droop * (t ** 1.5))
        for dy in range(-span, span + 1):
            put(a, cx + dx, cy + dy + dip, ramp[3] if (span - abs(dy) >= 1 and t < 0.92) else ramp[2])
        put(a, cx + dx, cy + span + dip, ramp[4])
        dark(a, cx + dx, cy - span + dip, 0.85)


def bus(a, cx, by, length, skin):
    ramp = ramp_of(skin); h = 11; hd = 4
    for x in range(int(cx - length), int(cx + length) + 1):
        side = 3 if x >= cx else 2
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
            dark(a, x, y, 0.82)
            x += -1 if r() < 0.5 else 1; y += 1 if r() < 0.7 else 0


# ----------------------------------------------------------------- the heroes
def hero_cityhall(seed, wall_ramp, roof_ramp):
    r = rng(seed)
    W, H = 150, 150
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx, by = W // 2, H - 22
    STONE = ramp_of((214, 210, 196))                      # PALE civic stone
    DIRT = ramp_of((92, 84, 70))
    ROOF = ramp_of((150, 96, 70))                          # faded terracotta
    shadow(a, cx, by + 8, 60, 20)
    plot(a, r, cx, by + 4, 58, 29, DIRT)
    steps(a, cx, by + 2, 30, 5, STONE)
    body = box(a, cx, by, 44, 22, 34, STONE, ROOF)         # the wide civic block
    window_grid(a, cx, by, 44, 22, 34, rows=2, top=0.62, bot=0.24, boarded_at=(0, 2), wall=STONE)
    cracks(a, r, cx - 40, cx + 40, by - 32, by, n=6)
    # columned PORTICO across the front-center
    colonnade(a, cx - 20, cx + 20, int(by - 26), int(by - 4), STONE)
    for i in range(22):                                    # a pale pediment cap
        f = i / 22.0
        py = int(by - 26) - int(7 * (1 - abs(f - 0.5) * 2))
        put(a, cx - 20 + i * 2, py, STONE[4]); put(a, cx - 20 + i * 2, py + 1, STONE[3])
    # low symmetric wings
    box(a, cx - 40, by + 2, 12, 7, 20, STONE, ROOF)
    box(a, cx + 28, by + 2, 12, 7, 20, STONE, ROOF)
    # the DOME + cupola (the tell), pale stone
    dcx, dy = cx, body[1] + 2
    cyl(a, r, dcx, dy, 11, 12, ramp_of((198, 194, 182)))   # drum
    dome(a, r, dcx, dy - 12, 12, ramp_of((206, 202, 190)))
    # a dead clock on the drum
    fx, fy = dcx + 5, dy - 6
    for dx in range(-3, 4):
        for dyy in range(-3, 4):
            if dx * dx + dyy * dyy <= 9:
                put(a, fx + dx, fy + dyy, sh((222, 218, 202), 0.95 if dx * dx + dyy * dyy > 5 else 1.0))
    put(a, fx, fy, (40, 38, 34)); put(a, fx + 1, fy - 1, (40, 38, 34))
    # a dead flag on a thin pole atop the dome
    for yy in range(dy - 12 - 10, dy - 12):
        put(a, dcx, yy, (70, 66, 58))
    for i in range(7):
        put(a, dcx + 1 + i, dy - 12 - 10 + int(i * 0.4), sh((150, 78, 66), 0.85))
        put(a, dcx + 1 + i, dy - 12 - 9 + int(i * 0.4), sh((150, 78, 66), 0.72))
    return a, cx, by + 4


def hero_battery(seed, wall_ramp, roof_ramp):
    r = rng(seed)
    W, H = 150, 152
    a = np.zeros((H, W, 4), dtype=np.uint8)
    cx, by = W // 2, H - 22
    HALL = ramp_of((196, 198, 202))                        # pale industrial hall
    DIRT = ramp_of((86, 82, 74))
    STEEL = ramp_of((120, 126, 134))
    FLAT = ramp_of((120, 118, 112))
    shadow(a, cx, by + 8, 60, 20)
    plot(a, r, cx, by + 4, 58, 29, DIRT)
    # the main POWER HALL (flat roof, big + bold), left of center
    box(a, cx - 14, by, 34, 17, 30, HALL, FLAT)
    window_grid(a, cx - 14, by, 34, 17, 30, rows=2, top=0.6, bot=0.26, wall=HALL)
    # roof-mounted transformers + vents on the flat roof (the industrial tell)
    for ox in (-24, -12, 0):
        cyl(a, r, cx - 14 + ox + 8, by - 30 - 1, 4, 6, STEEL)
    # two SMOKESTACKS rising behind the hall
    stack(a, cx - 2, by - 30, 34, FLAT)
    stack(a, cx + 8, by - 30, 26, FLAT)
    # TRANSFORMER cylinders in the yard (right), with HV bushings
    for ox in (16, 30):
        cyl(a, r, cx + ox, by - 2, 8, 20, ramp_of((122, 120, 116)))
        for bx in (-3, 0, 3):
            put(a, cx + ox + bx, by - 2 - 20 - 2, (206, 202, 192)); put(a, cx + ox + bx, by - 2 - 20 - 3, (150, 148, 140))
    # a HAZARD-yellow band + LIGHTNING mark on the hall (the power read)
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
    WALL = ramp_of((202, 204, 208))                        # pale station wall
    DIRT = ramp_of((88, 86, 82))
    FLAT = ramp_of((118, 116, 110))
    TEAL = ramp_of((92, 132, 132))                         # weathered transit teal
    shadow(a, cx, by + 8, 64, 21)
    plot(a, r, cx, by + 4, 62, 31, DIRT)
    # the waiting HALL (pale, flat roof, big window band), back-left
    box(a, cx - 30, by - 4, 22, 11, 26, WALL, FLAT)
    window_grid(a, cx - 30, by - 4, 22, 11, 26, rows=3, top=0.72, bot=0.2, wall=WALL)
    # a schedule-board strip on the hall face
    for x in range(int(cx - 30 + 4), int(cx - 30 + 20)):
        put(a, x, int(by - 4 - 26 * 0.85), (34, 34, 38)); put(a, x, int(by - 4 - 26 * 0.85) + 1, (48, 48, 44))
    # a tall MARQUEE sign pylon
    sx = cx - 52
    for yy in range(int(by - 48), int(by)):
        put(a, sx, yy, FLAT[1]); put(a, sx + 1, yy, FLAT[2])
    for dy in range(-12, 0):
        for dx in range(-2, 9):
            put(a, sx + dx, by - 48 + dy, (36, 38, 42) if (dx + dy) % 2 else (48, 50, 56))
    for dx in range(-1, 8):
        put(a, sx + dx, by - 55, (150, 190, 150))          # a bus glyph
    # dead BUSES nosed in at the bays
    bus(a, cx + 6, by - 2, 16, (150, 132, 72))
    bus(a, cx + 34, by + 4, 15, (120, 132, 150))
    # the big sweeping CANOPY over the bays (the signature), on posts
    ccx, ccy = cx + 20, by - 38
    for px in (cx - 4, cx + 20, cx + 44):
        for yy in range(int(ccy + 4), int(by)):
            put(a, px, yy, FLAT[1])
    canopy(a, r, ccx, ccy, 40, 17, TEAL, droop=12)
    return a, cx, by + 4


HEROES = {'cityhall': hero_cityhall, 'battery': hero_battery, 'terminal': hero_terminal}
LABEL = {
    'cityhall': 'City Hall — pale stone block, columned portico, grand steps, a dome + clock, a dead flag',
    'battery': 'Battery/power yard — pale power hall, smokestacks + roof transformers, transformer cylinders, hazard/lightning',
    'terminal': 'Transit terminal — pale waiting hall, sweeping bus canopy, dead buses, marquee sign',
}


def main():
    if not os.path.exists(HOUSE):
        print('missing CANON house-skin bank for reuse:', HOUSE); sys.exit(1)
    wall = ramp_from(HOUSE, 'wall', 0)
    roof = ramp_from(HOUSE, 'roof', 0)
    out = {
        'version': 'DISTRICT_HERO_v3_7_23_26',
        'status': 'UNJUDGED (awaiting Paolo thumbs) — v3, cooked to the PC2 style bible (v1 boxes GRAVEYARDED by Paolo; v2 superseded pre-judge once the real references landed)',
        'perspective': '45deg three-quarter (THE 45 LAW, Paolo 7/17): iso prisms/domes, sky-lit tops, lit right + shadowed left, on a ground diamond.',
        'style': 'records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md — chunky simple masses on a dressed dead-dirt plot + soft shadow, PALE walls + colored roof, soft 3-tone shading NO black outline, dead-dark window grids, iconic signature, dead-world finish.',
        'reuse': 'pale wall + faded roof ramps sampled from CANON house skins (BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26); iconic accents are shifts.',
        'law': 'ICONIC first + PC2 clean look, DEAD act-1 (dead-dark glass never lit, dead-dirt plot, cracks, a boarded window, dead buses), zero purple, deterministic.',
        'anchor': 'base is the bottom vertex of the ground diamond; bx/by per entry is that anchor in sprite pixels.',
        'heroes': [],
    }
    for d, fn in HEROES.items():
        seed = 7300 + (hash(d) % 5000)
        a, bx, by = fn(seed & 0x7fffffff, wall, roof)
        buf = io.BytesIO(); Image.fromarray(a, 'RGBA').save(buf, 'PNG')
        out['heroes'].append({'district': d, 'variant': 'iconic', 'label': LABEL[d],
                              'w': int(a.shape[1]), 'h': int(a.shape[0]),
                              'bx': int(bx), 'by': int(by),
                              'b64': base64.b64encode(buf.getvalue()).decode()})
    json.dump(out, open(OUT, 'w'))
    print('cooked %d PC2-style district heroes (v3) -> %s' % (len(out['heroes']), OUT))
    for h in out['heroes']:
        print('  %-9s %dx%d  %s' % (h['district'], h['w'], h['h'], h['label']))


if __name__ == '__main__':
    main()
