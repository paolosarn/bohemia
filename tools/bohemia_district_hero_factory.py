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
import math
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


def _fit(scene, scale, margin=14):
    """Auto-size the canvas + origin so the ENTIRE scene — the whole square plot
    AND the building on it — is in frame with a margin. (Paolo: 'you made it so I
    can't see the whole square tile' — the 18-unit plot's iso diamond ran off the
    hardcoded canvas. Now the frame always contains the full tile.)"""
    xs, ys = [], []
    for verts, _uv, _n, _m in scene.faces:
        for (x, y, z) in verts:
            xs.append((x - y) * scale)
            ys.append((x + y) * scale * 0.5 - z * scale)
    minx, maxx = min(xs), max(xs)
    miny, maxy = min(ys), max(ys)
    w = int(math.ceil(maxx - minx)) + 2 * margin
    h = int(math.ceil(maxy - miny)) + 2 * margin
    return w, h, (margin - minx, margin - miny)


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


def _ground(s, plot, lot):
    """A PAVED city LOT (a square plot — city cells are square tiles): the whole
    plot is weathered CONCRETE sidewalk, with an asphalt PARKING LOT (stall
    stripes) section. No bare dead-dirt — the lot reads as developed city, not a
    building floating in dirt (Paolo: the gray-brown dirt 'does nothing')."""
    x0, y0, x1, y1 = plot
    SW = {'c': (120, 121, 120)}; SWt = {'c': (140, 141, 139)}   # neutral concrete pavement (not dirt-brown)
    s.box((x0, y0, -0.5), (x1 - x0, y1 - y0, 0.55), {'top': SWt, 'px': SW, 'py': SW, 'nx': SW, 'ny': SW})
    lx0, ly0, lx1, ly1 = lot
    LOT = {'t': 'lot', 'asphalt': (56, 57, 61), 'stripe': (150, 150, 140),
           'cols': max(3, int((lx1 - lx0) / 1.5)), 'rows': 2}
    ASP = {'c': (50, 51, 55)}
    s.box((lx0, ly0, 0.0), (lx1 - lx0, ly1 - ly0, 0.08), {'top': LOT, 'px': ASP, 'py': ASP, 'nx': ASP, 'ny': ASP})


def _door(s, side, at, lo, hi, ztop, doorc=(30, 33, 40), framec=(158, 162, 168), awn=None):
    """A visible ENTRANCE DOOR at a building base: a dark door + a lighter frame on
    a front face, optionally a small flat awning. side 'px' (+x face at x=at) or
    'py' (+y face at y=at); the door spans [lo,hi] along the other axis, z [0,ztop]."""
    if side == 'px':
        s.quad((at + 0.02, lo - 0.3, 0), (at + 0.02, hi + 0.3, 0), (at + 0.02, hi + 0.3, ztop + 0.4), (at + 0.02, lo - 0.3, ztop + 0.4), {'c': framec}, (1, 0, 0))
        s.quad((at + 0.05, lo, 0), (at + 0.05, hi, 0), (at + 0.05, hi, ztop), (at + 0.05, lo, ztop), {'c': doorc}, (1, 0, 0))
        if awn:
            s.box((at, lo - 0.4, ztop + 0.1), (awn, hi - lo + 0.8, 0.25), {'c': framec})
    else:
        s.quad((lo - 0.3, at + 0.02, 0), (hi + 0.3, at + 0.02, 0), (hi + 0.3, at + 0.02, ztop + 0.4), (lo - 0.3, at + 0.02, ztop + 0.4), {'c': framec}, (0, 1, 0))
        s.quad((lo, at + 0.05, 0), (hi, at + 0.05, 0), (hi, at + 0.05, ztop), (lo, at + 0.05, ztop), {'c': doorc}, (0, 1, 0))
        if awn:
            s.box((lo - 0.4, at, ztop + 0.1), (hi - lo + 0.8, awn, 0.25), {'c': framec})


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
    # PAVED SQUARE plot + a parking lot front-right (no bare dirt)
    _ground(s, (-5, -4, 13, 14), (7.2, 6.4, 13, 13.8))
    # a BIGGER civic block: masonry base + a taller, wider glass tower
    s.box((0.8, 0.8, 0), (7.4, 7.4, 2.6), MASON)
    s.box((1.4, 1.4, 2.6), (6.2, 6.2, 19), {'top': ROOF, 'px': GLASS, 'py': GLASS_L, 'nx': ROOF, 'ny': ROOF})
    s.prism(-1.6, 4.6, 0, 3.2, 4.6, 13, DRUMG, DRUMTOP)
    # the grand ENTRANCE: glass doors + a flat canopy on the tower's front (+x) face
    _door(s, 'px', 7.6, 2.8, 5.2, 4.2, doorc=(26, 34, 46), framec=(170, 176, 182), awn=1.4)
    # the SOLAR-TREE grove, a tidy row on the front-left of the plot (clear of the building)
    for (px, py) in [(-3.2, 7.0), (-1.4, 8.6), (-3.6, 9.8), (0.2, 10.0)]:
        s.box((px - 0.13, py - 0.13, 0), (0.34, 0.34, 5.2), POLE)
        z = 5.2
        s.quad((px - 1.1, py - 0.78, z + 0.5), (px + 1.1, py - 0.78, z - 0.25),
               (px + 1.1, py + 0.78, z - 0.25), (px - 1.1, py + 0.78, z + 0.5), PV, (0.35, 0, 0.94))
    return s, 7.0


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
    DOORC = {'c': (58, 52, 44)}
    # PAVED SQUARE plot + parking lot front-right (no bare dirt)
    _ground(s, (-5.5, -4.5, 13, 14), (7.6, 6.6, 13, 13.8))
    # a BIGGER power hall
    s.box((0, 0, 0), (8.6, 7.6, 7.2), {'top': ROOF, 'px': HALL, 'py': dict(HALL, deadseed=9), 'nx': ROOF, 'ny': ROOF})
    # roof vents
    for ox in (1.8, 5.2):
        s.box((ox, 2.8, 7.2), (1.2, 1.9, 0.8), STEEL)
    # a big roll-up LOADING DOOR + a personnel door on the hall front (+x face)
    _door(s, 'px', 8.6, 1.0, 3.6, 4.2, doorc=(48, 46, 42), framec=(150, 150, 146))
    _door(s, 'px', 8.6, 5.2, 6.4, 3.2, doorc=(40, 38, 34), framec=(150, 150, 146))
    # TWO SMOKESTACKS behind the hall (back-left) rising clear above the roofline
    for (sx3, sy3, sh3, sw3) in [(0.7, -2.0, 13.5, 1.35), (2.8, -1.5, 10.5, 1.1)]:
        s.box((sx3, sy3, 0), (sw3, sw3, sh3), STACK)
        s.box((sx3 - 0.08, sy3 - 0.08, sh3 - 1.5), (sw3 + 0.16, sw3 + 0.16, 1.1), {'c': (66, 58, 52)})
    # transformer cylinders in the yard (front-right)
    for cx3 in (10.2, 12.0):
        s.prism(cx3, 3.4, 0, 0.95, 4.6, 12, XFMR)
        s.box((cx3 - 0.15, 3.25, 4.6), (0.3, 0.3, 0.9), STEEL)
    # hazard band low across the hall front
    s.box((0, -0.4, 0.6), (8.6, 0.35, 0.8), HAZ)
    return s, 7.2


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
    # PAVED SQUARE plot + parking lot front-left (no bare dirt)
    _ground(s, (-6.5, -4.5, 12, 13.5), (-6.5, 7.2, 1.2, 13.5))
    # a BIGGER waiting hall (glass), back-left
    s.box((-5, 0.2, 0), (6, 6, 7.2), {'top': ROOF, 'px': WALL, 'py': dict(WALL, deadseed=8), 'nx': ROOF, 'ny': ROOF})
    # the glass ENTRANCE doors on the hall front (+x face), facing the bays
    _door(s, 'px', 1.0, 2.4, 5.0, 3.6, doorc=(30, 42, 52), framec=(168, 172, 176), awn=1.2)
    # a big flat bay CANOPY on four posts, raised so the BUSES are visible under it
    for (px, py) in [(2.0, 1.0), (10.0, 1.0), (2.0, 6.4), (10.0, 6.4)]:
        s.box((px - 0.2, py - 0.2, 0), (0.4, 0.4, 4.2), POST)
    s.box((1.4, 0.6, 4.2), (9.4, 6.4, 0.5), {'top': CANOPY, 'px': CANOPY2, 'py': CANOPY2, 'nx': CANOPY2, 'ny': CANOPY2})
    # dead buses nosed in under the canopy, staggered so both read
    s.box((2.6, 4.6, 0), (6.2, 1.7, 2.0), {'c': (150, 132, 74)})
    s.box((3.6, 2.0, 0), (6.0, 1.7, 2.0), {'c': (120, 132, 150)})
    # a tall marquee sign at the front corner (clear of the hall)
    s.box((11.4, 7.0, 0), (0.4, 0.4, 7.2), MARQ)
    s.box((10.7, 6.4, 5.8), (1.8, 0.35, 1.9), SIGN)
    return s, 7.2


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
        scene, scale = fn(masonry)
        w, h, origin = _fit(scene, scale)
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
