#!/usr/bin/env python3
"""BOHEMIA DISTRICT HERO FACTORY v5 (7/23/26) — BAKED FROM 3D.

The "rethink the approach" delivered. After 4 procedural passes stayed programmer-
art, Paolo chose to rethink it; I built tools/bohemia_iso3d.py (a tiny software 3D
iso renderer) and baked City Hall from real 3D volumes. Paolo: "it's looking
better tho" (direction approved) + circled the solar panels ("what's up with
this") — fixed (tall posts + compact angled panels, a real solar-tree grove).

This factory now BUILDS EACH HERO AS A 3D SCENE and bakes it to a sprite, the way
Pocket City 2 makes its buildings ("2.5D isometric sprites baked from 3D source").
Real lighting + on-plane windows fall out of the projection (the whole window-
overlap class of bug is gone). Supersampled + downscaled -> clean antialiased
"baked" edges.

  - CITY HALL = the real Las Vegas City Hall: an angular GLASS office TOWER + a
    CURVED council chamber + a plaza of tall SOLAR TREES. Masonry base.
  - BATTERY/POWER = a pale industrial POWER HALL (punched windows) + tall
    SMOKESTACKS + roof vents + TRANSFORMER cylinders + a hazard band.
  - TERMINAL = a pale glass WAITING HALL + a big flat bay CANOPY on posts +
    dead BUSES + a MARQUEE sign.

DEAD WORLD (act 1): dead-dark glass with BROKEN + BOARDED panes scattered through
the curtain walls, dead-dirt plaza, dead solar panels, dusty tones. THE 45 LAW is
inherent (real iso projection, sky-lit tops, lit-right/shadow-left). Zero purple.
Deterministic (fixed seeds, no Date/random). Heights differ (the tower is tall).

REUSE CHECK:
used BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (CANON house skins, Paolo's
all-30-UP 7/21 verdict): the MASONRY/tan base + boarded-pane tones are sampled
from the approved wall_plain tiles (opened + read here) so the baked buildings sit
in the same weathered material family as the married city. Glass/steel/PV/asphalt
are neutral architectural shifts. The 3D geometry + lighting is the fresh cook
(tools/bohemia_iso3d.py); no existing iso-building sprite bank.

OUTPUT: banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt (v5). Paolo thumbs.

Run from repo root: python3 tools/bohemia_district_hero_factory.py
"""
import base64
import io
import json
import os
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bohemia_iso3d import Scene, bake

HOUSE = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
OUT = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'


def _sample_mean(bank, cls, idx=0):
    d = json.load(open(bank))
    ts = [x for x in d['tiles'] if x.get('cls') == cls]
    t = ts[idx % len(ts)]
    a = np.asarray(Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')).reshape(-1, 3)
    return tuple(a.mean(0).astype(int))


def _anchor(scene, origin, scale):
    xs, ys = [], []
    for verts, _uv, _n, _m in scene.faces:
        for p in verts:
            if p[2] <= 0.6:
                xs.append(p[0]); ys.append(p[1])
    fcx = (min(xs) + max(xs)) / 2.0
    fcy = (min(ys) + max(ys)) / 2.0
    bx = origin[0] + (fcx - fcy) * scale
    by = origin[1] + (fcx + fcy) * scale * 0.5
    return int(round(bx)), int(round(by))


# ---------------------------------------------------------------- city hall
def build_cityhall(masonry):
    s = Scene()
    GLASS = {'t': 'win', 'wall': (150, 168, 182), 'glass': (44, 58, 76), 'frame': (156, 162, 168),
             'cols': 4, 'rows': 10, 'dead': 0.13, 'boardc': tuple(int(c * 0.9) for c in masonry),
             'breakc': (12, 14, 16), 'deadseed': 7}
    GLASS_L = dict(GLASS); GLASS_L['deadseed'] = 11
    ROOF = {'c': (118, 120, 122)}
    MASON = {'c': masonry}
    DRUMG = {'t': 'win', 'wall': (186, 182, 172), 'glass': (60, 86, 102), 'frame': (150, 156, 160),
             'cols': 12, 'rows': 3, 'v0': 0.28, 'v1': 0.8, 'dead': 0.12, 'boardc': tuple(int(c * 0.9) for c in masonry),
             'breakc': (14, 16, 18), 'deadseed': 3}
    DRUMTOP = {'c': (150, 150, 146)}
    PV = {'t': 'win', 'wall': (74, 90, 112), 'glass': (60, 74, 98), 'frame': (158, 164, 172), 'cols': 3, 'rows': 2}
    POLE = {'c': (150, 154, 160)}
    PLAZA = {'c': (96, 90, 78)}
    PLAZA2 = {'c': (108, 101, 88)}
    s.box((-4.5, -1.5, -0.5), (15.5, 12, 0.5), {'top': PLAZA2, 'px': PLAZA, 'py': PLAZA, 'nx': PLAZA, 'ny': PLAZA})
    s.box((1.6, 1.6, 0), (5.4, 5.4, 2.2), MASON)
    s.box((2, 2, 2), (4.6, 4.6, 17), {'top': ROOF, 'px': GLASS, 'py': GLASS_L, 'nx': ROOF, 'ny': ROOF})
    s.prism(-1.2, 4.2, 0, 2.6, 4.2, 12, DRUMG, DRUMTOP)
    for (px, py) in [(-2.4, 6.6), (1.2, 7.2), (5.4, 6.0), (-1.0, 9.0), (3.2, 9.4), (7.2, 8.0)]:
        s.box((px - 0.13, py - 0.13, 0), (0.34, 0.34, 5.2), POLE)
        z = 5.2
        s.quad((px - 1.15, py - 0.8, z + 0.5), (px + 1.15, py - 0.8, z - 0.25),
               (px + 1.15, py + 0.8, z - 0.25), (px - 1.15, py + 0.8, z + 0.5), PV, (0.35, 0, 0.94))
    return s, 180, 200, (108, 162), 8.5


# ---------------------------------------------------------------- battery / power
def build_battery(masonry):
    s = Scene()
    HALL = {'t': 'win', 'wall': (196, 198, 202), 'glass': (34, 40, 48), 'frame': (150, 150, 150),
            'cols': 6, 'rows': 3, 'punch': True, 'v0': 0.15, 'v1': 0.85, 'dead': 0.2,
            'boardc': (150, 142, 124), 'breakc': (14, 16, 18), 'deadseed': 5}
    ROOF = {'c': (120, 118, 112)}
    STEEL = {'c': (128, 132, 138)}
    STACK = {'c': (118, 116, 110)}
    XFMR = {'c': (122, 120, 116)}
    HAZ = {'c': (196, 164, 48)}
    PLAZA = {'c': (90, 86, 78)}
    PLAZA2 = {'c': (101, 96, 86)}
    s.box((-5, -2, -0.5), (16, 12, 0.5), {'top': PLAZA2, 'px': PLAZA, 'py': PLAZA, 'nx': PLAZA, 'ny': PLAZA})
    s.box((0, 0, 0), (7, 6.5, 6.5), {'top': ROOF, 'px': HALL, 'py': dict(HALL, deadseed=9), 'nx': ROOF, 'ny': ROOF})
    # roof vents
    for ox in (1.5, 4.2):
        s.box((ox, 2.4, 6.5), (1.1, 1.7, 0.7), STEEL)
    # TWO SMOKESTACKS standing BEHIND the hall (back-left, negative y) so they rise
    # clear above the roofline — the power tell — with a dark rim band near the top
    for (sx3, sy3, sh3, sw3) in [(0.6, -1.8, 12.5, 1.2), (2.4, -1.4, 10, 1.0)]:
        s.box((sx3, sy3, 0), (sw3, sw3, sh3), STACK)
        s.box((sx3 - 0.07, sy3 - 0.07, sh3 - 1.4), (sw3 + 0.14, sw3 + 0.14, 1.0), {'c': (66, 58, 52)})
    # transformer cylinders in the yard (front-right)
    for cx3 in (8.6, 10.4):
        s.prism(cx3, 3.2, 0, 0.9, 4.4, 12, XFMR)
        s.box((cx3 - 0.15, 3.05, 4.4), (0.3, 0.3, 0.9), STEEL)
    # hazard band low across the hall front
    s.box((0, -0.4, 0.6), (7, 0.35, 0.8), HAZ)
    return s, 176, 190, (80, 132), 8.0


# ---------------------------------------------------------------- terminal
def build_terminal(masonry):
    s = Scene()
    WALL = {'t': 'win', 'wall': (202, 204, 208), 'glass': (36, 48, 58), 'frame': (160, 164, 168),
            'cols': 5, 'rows': 4, 'dead': 0.16, 'boardc': (150, 144, 128), 'breakc': (14, 18, 22), 'deadseed': 4}
    ROOF = {'c': (120, 118, 112)}
    POST = {'c': (120, 118, 112)}
    CANOPY = {'c': (96, 140, 138)}
    CANOPY2 = {'c': (78, 116, 114)}
    MARQ = {'c': (150, 154, 160)}
    SIGN = {'c': (44, 48, 54)}
    PLAZA = {'c': (88, 86, 82)}
    PLAZA2 = {'c': (99, 96, 90)}
    s.box((-6, -1.5, -0.5), (17, 11, 0.5), {'top': PLAZA2, 'px': PLAZA, 'py': PLAZA, 'nx': PLAZA, 'ny': PLAZA})
    # the waiting hall (glass), back-left
    s.box((-4.5, 0.5, 0), (5, 5, 6.5), {'top': ROOF, 'px': WALL, 'py': dict(WALL, deadseed=8), 'nx': ROOF, 'ny': ROOF})
    # a big flat bay CANOPY on four posts, raised so the BUSES are visible under it
    for (px, py) in [(1.5, 1.0), (9.0, 1.0), (1.5, 6.0), (9.0, 6.0)]:
        s.box((px - 0.2, py - 0.2, 0), (0.4, 0.4, 4.0), POST)
    s.box((1.0, 0.6, 4.0), (8.6, 6.0, 0.5), {'top': CANOPY, 'px': CANOPY2, 'py': CANOPY2, 'nx': CANOPY2, 'ny': CANOPY2})
    # dead buses nosed in under the canopy, staggered so both read
    s.box((2.2, 4.4, 0), (5.6, 1.6, 1.9), {'c': (150, 132, 74)})
    s.box((3.2, 2.0, 0), (5.4, 1.6, 1.9), {'c': (120, 132, 150)})
    # a tall marquee sign at the front corner (clear of the hall)
    s.box((10.4, 6.6, 0), (0.4, 0.4, 7.0), MARQ)
    s.box((9.7, 6.0, 5.6), (1.8, 0.35, 1.9), SIGN)
    return s, 178, 152, (86, 104), 7.8


HEROES = {'cityhall': build_cityhall, 'battery': build_battery, 'terminal': build_terminal}
LABEL = {
    'cityhall': 'City Hall — the real Las Vegas City Hall, baked from 3D: glass tower + curved council chamber + solar-tree plaza',
    'battery': 'Battery/power yard — baked from 3D: pale power hall + smokestacks + roof vents + transformer cylinders + hazard band',
    'terminal': 'Transit terminal — baked from 3D: glass waiting hall + a big bay canopy on posts + dead buses + marquee',
}


def main():
    if not os.path.exists(HOUSE):
        print('missing CANON house-skin bank for reuse:', HOUSE); sys.exit(1)
    masonry = _sample_mean(HOUSE, 'wall', 0)
    out = {
        'version': 'DISTRICT_HERO_v5_7_23_26',
        'status': 'UNJUDGED (awaiting Paolo thumbs) — v5: BAKED FROM 3D (tools/bohemia_iso3d.py). direction approved by Paolo; v1-v4 superseded.',
        'perspective': '45deg three-quarter, REAL iso projection (baked from 3D volumes): sky-lit tops, lit-right/shadow-left, on-plane windows.',
        'reference': 'City Hall = the real Las Vegas City Hall (glass tower + curved council chamber + solar-tree plaza). Baked from 3D like Pocket City 2.',
        'reuse': 'masonry/boarded tones sampled from CANON house skins (BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26); glass/steel/PV are shifts.',
        'law': 'DEAD act-1 (broken + boarded glass panes, dead solar panels, dead-dirt plaza), zero purple, deterministic. Heights differ.',
        'anchor': 'bx/by = the projected footprint-center at ground level (z=0), for planting the sprite on a tile.',
        'heroes': [],
    }
    for d, fn in HEROES.items():
        scene, w, h, origin, scale = fn(masonry)
        img = bake(scene, w, h, origin=origin, scale=scale, ss=4)
        bx, by = _anchor(scene, origin, scale)
        buf = io.BytesIO(); Image.fromarray(img, 'RGBA').save(buf, 'PNG')
        out['heroes'].append({'district': d, 'variant': 'iconic', 'label': LABEL[d],
                              'w': int(w), 'h': int(h), 'bx': bx, 'by': by,
                              'b64': base64.b64encode(buf.getvalue()).decode()})
    json.dump(out, open(OUT, 'w'))
    print('baked %d district heroes (v5, from 3D) -> %s' % (len(out['heroes']), OUT))
    for hh in out['heroes']:
        print('  %-9s %dx%d anchor(%d,%d)  %s' % (hh['district'], hh['w'], hh['h'], hh['bx'], hh['by'], hh['label']))


if __name__ == '__main__':
    main()
