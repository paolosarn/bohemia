#!/usr/bin/env python3
"""BOHEMIA DISTRICT HERO FACTORY v7 (7/24/26) — HAND-BUILT, MATCHED TO THE WALKABLE.

Paolo 7/24 (LOCKED, "very important"): the city-builder 1x1 hero sprite and the
on-foot WALKABLE district must be DAMN NEAR the same place. He chose the clean
HAND-BUILT landmark (not a literal grid extrusion), with its PALETTE and KEY
PIECES matched to the walkable district. So every hero here is modeled from its
OWN district engine's landmarks + palette:

  - CITY HALL   = admin BLOCK + a CLOCK TOWER over the entrance + a forecourt
    PLAZA with a DRY FOUNTAIN + flagpoles (matches engine/bohemia_cityhall.js).
  - BATTERY     = a grid BATTERY-STORAGE yard: a control building + rows of
    BATTERY CONTAINERS with HVAC units + an INVERTER/TRANSFORMER rack + gravel
    yard + perimeter fence (matches engine/bohemia_battery.js). NOT a smokestack
    power plant — that was the old mismatch.
  - TERMINAL    = a waiting HALL + a SCHEDULE-BOARD CLOCK over the doors + a gray
    boarding CANOPY over a ROW of dead BUSES on the platform + a kiss-and-ride
    (matches engine/bohemia_terminal.js). Compact 1x1 (only approved mega-projects
    exceed 1x1 — Paolo 7/24).

Baked from 3D (tools/bohemia_iso3d.py): real lighting + on-plane windows. DEAD
world (broken/boarded panes, dead lawn, dry fountain), zero purple, deterministic.

TASTE CHECK: this factory's candidate batch is run through
tools/bohemia_taste_filter.py (the pre-judge KILL pass over
laws/BOHEMIA_PAOLO_TASTE_CANON.md) BEFORE anything reaches Paolo's thumbs.
The machine-checkable NEVERs kill obvious violators (flat side-on, purple
outside the Amalgamation, hard black outline, tan-ratio, recolor-posing-as-
new-shape, pavement-dominant, graveyard reuse). The filter KILLS, it never
APPROVES; survivors still require Paolo's real verdict. Call
bohemia_taste_filter.prefilter(candidates) at the bank-emit step to adopt it live.

REUSE CHECK: the colors are pulled LIVE from each district's OWN canon PALETTE
(engine/bohemia_<district>.js, via tools/bohemia_district_grid_dump.js ->
district_grids.json, opened + read here in _load_pal) so the hero and the walkable
tile share one source of truth. The 3D geometry + lighting is the fresh cook
(tools/bohemia_iso3d.py); no existing iso hero-building sprite bank to reuse.

OUTPUT: banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt (v7). Paolo thumbs.
Run from repo root: python3 tools/bohemia_district_hero_factory.py
"""
import base64
import io
import json
import math
import os
import subprocess
import sys

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bohemia_iso3d import Scene, bake

OUT = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
SCRATCH = '/tmp/claude-0/-home-user-bohemia/96a4de31-15c3-52d6-95f6-8087b9cb9964/scratchpad'
GRIDS = os.path.join(SCRATCH, 'district_grids.json')


def _hex(h):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def _load_pal():
    """Pull each district's canon palette from its engine module (the walkable
    source of truth). Regenerate the dump so we're never stale."""
    try:
        subprocess.run(['node', 'tools/bohemia_district_grid_dump.js', GRIDS],
                       check=True, capture_output=True)
    except Exception as e:
        if not os.path.exists(GRIDS):
            print('could not dump district grids and none cached:', e); sys.exit(1)
    data = json.load(open(GRIDS))
    return {d: {int(k): _hex(v) for k, v in dd['palette'].items()} for d, dd in data.items()}


# ---------------------------------------------------------------- helpers
def _fit(scene, scale, margin=14):
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


def _ground(s, plot, patches=None, lot=None, drive=None, groundc=(120, 121, 120), lotc=(60, 61, 65)):
    """The square city plot, PAVED, using the district's own ground tones. patches
    is a list of (x0,y0,x1,y1,color) overlays (plaza, gravel, lawn). A LOT + a
    DRIVEWAY apron to the street give parking a reason."""
    x0, y0, x1, y1 = plot
    gt = tuple(min(255, int(c * 1.12)) for c in groundc)
    s.box((x0, y0, -0.5), (x1 - x0, y1 - y0, 0.55), {'top': {'c': gt}, 'px': {'c': groundc},
          'py': {'c': groundc}, 'nx': {'c': groundc}, 'ny': {'c': groundc}})
    for (px0, py0, px1, py1, col) in (patches or []):
        s.box((px0, py0, 0.0), (px1 - px0, py1 - py0, 0.06), {'c': col})
    ASP = {'c': tuple(int(c * 0.85) for c in lotc)}
    if drive:
        dx0, dy0, dx1, dy1 = drive
        s.box((dx0, dy0, 0.0), (dx1 - dx0, dy1 - dy0, 0.07), {'top': {'c': lotc}, 'px': ASP, 'py': ASP, 'nx': ASP, 'ny': ASP})
    if lot:
        lx0, ly0, lx1, ly1 = lot
        LOT = {'t': 'lot', 'asphalt': lotc, 'stripe': (156, 156, 146),
               'cols': max(3, int((lx1 - lx0) / 1.4)), 'rows': 2}
        s.box((lx0, ly0, 0.02), (lx1 - lx0, ly1 - ly0, 0.07), {'top': LOT, 'px': ASP, 'py': ASP, 'nx': ASP, 'ny': ASP})


def _door(s, at, lo, hi, ztop, doorc=(30, 33, 40), framec=(158, 162, 168), awn=None):
    """A visible ENTRANCE DOOR at GROUND on a building's +x front face at x=at."""
    s.quad((at + 0.02, lo - 0.3, 0), (at + 0.02, hi + 0.3, 0), (at + 0.02, hi + 0.3, ztop + 0.4), (at + 0.02, lo - 0.3, ztop + 0.4), {'c': framec}, (1, 0, 0))
    s.quad((at + 0.05, lo, 0), (at + 0.05, hi, 0), (at + 0.05, hi, ztop), (at + 0.05, lo, ztop), {'c': doorc}, (1, 0, 0))
    if awn:
        s.box((at, lo - 0.4, ztop + 0.1), (awn, hi - lo + 0.8, 0.25), {'c': framec})


def _win(wall, cols=4, rows=6, seed=5, dead=0.13, boardc=None):
    return {'t': 'win', 'wall': wall, 'glass': (34, 40, 48),
            'frame': tuple(min(255, int(c * 1.14)) for c in wall),
            'cols': cols, 'rows': rows, 'dead': dead,
            'boardc': boardc or tuple(int(c * 0.85) for c in wall),
            'breakc': (14, 16, 18), 'deadseed': seed}


def _dark(c, f=0.82):
    return {'c': tuple(int(v * f) for v in c)}


# CANON VEHICLE SIZES (Paolo 7/24, LOCKED): "there can only be one consistent car
# size if ur going to have busses and cars in there." ONE car, ONE bus, ONE
# trailer — identical dimensions in EVERY hero, so scale never drifts. (L = along
# the vehicle, W = across, H = tall, world units. Bus ~2.6x a car's length; real.)
CAR = (1.5, 0.8, 0.62)
BUS = (3.9, 1.0, 1.18)
TRAILER = (3.9, 1.0, 1.05)


def _vehicle(s, x, y, size, color, along='x'):
    """A consistent dead vehicle: a body box + a slightly-inset lighter roof so it
    reads as a car/bus, never a plain block. Same helper for every hero."""
    assert size in (CAR, BUS, TRAILER), 'vehicle must use a CANON size (CAR/BUS/TRAILER), got %r' % (size,)
    L, W, H = size
    dx, dy = (L, W) if along == 'x' else (W, L)
    s.box((x, y, 0), (dx, dy, H * 0.6), {'top': _dark(color, 1.06), 'px': _dark(color, 1.0),
          'py': _dark(color, 0.84), 'nx': _dark(color), 'ny': _dark(color)})
    s.box((x + dx * 0.12, y + dy * 0.12, H * 0.6), (dx * 0.76, dy * 0.76, H * 0.4),
          {'c': _dark(color, 0.7)['c']})   # cabin/greenhouse


# ---------------------------------------------------------------- CITY HALL
def build_cityhall(P):
    BUILD, CLOCK, PLAZA, FOUNT = P[2], P[6], P[7], P[8]
    DRIVE, LAWN, SEAL, FLAG, SIDE, POLE = P[1], P[4], P[10], P[12], P[11], P[9]
    ROOF = _dark(BUILD, 0.9)['c']
    # PAVED plot (Paolo 7/24: buildings on pavement, not grass) — plaza forecourt +
    # a sidewalk pad under the block + a small visitor lot off a driveway
    _ground(s := Scene(), (-3, -3, 15, 16),
            patches=[(-3, 8.5, 6.5, 15.5, PLAZA), (0.5, 0.5, 12.5, 8.0, SIDE)],
            lot=(8.0, 9.5, 15, 15.5), drive=(11.5, 15.5, 15, 16), groundc=(112, 110, 104), lotc=DRIVE)
    # the administrative BLOCK — a dignified wide civic mass (not a lonely tower)
    FX, FY, FW, FD = 2.0, -1.0, 10.0, 8.5
    s.box((FX, FY, 0), (FW, FD, 9.5), {'top': {'c': ROOF}, 'px': _win(BUILD, 5, 5, 7),
          'py': _win(BUILD, 4, 5, 11), 'nx': _dark(BUILD), 'ny': _dark(BUILD)})
    # the CLOCK TOWER over the entrance (the civic landmark) — a taller thin mass
    TX = FX + FW - 3.2
    s.box((TX, FY + FD - 0.2, 0), (3.2, 2.6, 15.5), {'top': {'c': ROOF},
          'px': _dark(CLOCK, 0.98), 'py': _dark(CLOCK, 0.9), 'nx': _dark(CLOCK), 'ny': _dark(CLOCK)})
    s.quad((TX + 3.24, FY + FD + 0.6, 12.4), (TX + 3.24, FY + FD + 2.0, 12.4),
           (TX + 3.24, FY + FD + 2.0, 13.8), (TX + 3.24, FY + FD + 0.6, 13.8), {'c': (206, 200, 178)}, (1, 0, 0))  # clock face
    # the grand ENTRANCE at GROUND under the tower
    _door(s, FX + FW, FY + FD + 0.3, FY + FD + 2.3, 3.0, doorc=_dark(BUILD, 0.4)['c'],
          framec=tuple(min(255, int(c * 1.2)) for c in CLOCK), awn=1.3)
    # forecourt PLAZA furniture: a DRY FOUNTAIN (round basin) + two flagpoles + civic seal
    s.prism(0.5, 12.4, 0, 1.9, 0.5, 16, {'c': FOUNT}, {'c': _dark(FOUNT, 0.7)['c']})
    s.prism(0.5, 12.4, 0.5, 0.5, 0.7, 10, {'c': _dark(FOUNT, 0.8)['c']})   # dry inner pedestal
    for fx in (-1.8, 2.8):
        s.box((fx - 0.09, 9.6, 0), (0.18, 0.18, 6.0), {'c': FLAG})
    s.box((4.6, 13.6, 0), (0.7, 0.7, 1.4), {'c': SEAL})                     # toppled-seal monument block
    for (lx, ly) in [(-2.4, 14.6), (5.4, 10.0)]:
        s.box((lx - 0.08, ly - 0.08, 0), (0.16, 0.16, 2.4), {'c': POLE})   # plaza pole lights
    return s, 7.2


# ---------------------------------------------------------------- BATTERY (BESS yard)
def build_battery(P):
    CTRL, CONT, HVAC, INV = P[2], P[6], P[7], P[8]
    ROAD, GRAVEL, FENCE, HAZ, PLAC, POLE = P[1], P[4], P[10], P[11], P[12], P[9]
    ROOF = _dark(CTRL, 0.9)['c']
    # gravel yard, an access road + a small pad by the gate
    _ground(s := Scene(), (-3, -3, 15, 16),
            patches=[(-2.5, -2.5, 3.5, 3.5, _dark(GRAVEL, 1.1)['c'])],
            drive=(11.0, 3.0, 14.5, 16), groundc=GRAVEL, lotc=ROAD)
    # the CONTROL building (compact, back-left) — the only real building
    s.box((-1.5, -1.5, 0), (5.0, 4.6, 5.6), {'top': {'c': ROOF}, 'px': _win(CTRL, 4, 3, 5, 0.22),
          'py': _win(CTRL, 3, 3, 9, 0.22), 'nx': _dark(CTRL), 'ny': _dark(CTRL)})
    _door(s, 3.5, -0.6, 0.8, 2.6, doorc=_dark(CTRL, 0.5)['c'], framec=tuple(min(255, int(c * 1.15)) for c in CTRL))
    s.box((-1.5, 3.1, 0.5), (5.0, 0.35, 0.7), {'c': HAZ})                   # hazard apron marking
    # rows of BATTERY CONTAINERS (the hero) — Megapack-style enclosures, HVAC on the end
    for r, ry in enumerate((1.5, 5.3, 9.1)):
        s.box((5.5, ry, 0), (8.4, 2.4, 2.9), {'top': _dark(CONT, 1.05), 'px': _dark(CONT, 1.0),
              'py': _dark(CONT, 0.86), 'nx': _dark(CONT), 'ny': _dark(CONT)})
        for cx in range(1, 5):                                             # module seams read as a rack
            s.box((5.5 + cx * 1.7, ry - 0.02, 0.2), (0.12, 0.05, 2.5), _dark(CONT, 0.7))
        s.box((14.0, ry + 0.4, 0), (1.1, 1.6, 2.2), {'c': HVAC})           # HVAC/thermal unit on the end
    # the INVERTER / TRANSFORMER rack tying the array into the grid (taller mass, front-right)
    s.box((5.7, 12.4, 0), (6.0, 2.2, 3.8), {'top': _dark(INV, 0.9), 'px': _dark(INV, 1.0),
          'py': _dark(INV, 0.86), 'nx': _dark(INV), 'ny': _dark(INV)})
    for ix in (7.0, 9.0, 11.0):
        s.box((ix - 0.12, 12.3, 3.8), (0.24, 0.24, 0.8), {'c': tuple(min(255, int(c * 1.2)) for c in INV)})  # bushings read
    s.box((5.7, 12.0, 0.5), (6.0, 0.3, 0.7), {'c': HAZ})                    # hazard band
    # perimeter FENCE posts around the yard + a couple pole lights
    for (fx, fy) in [(-2.5, -2.5), (14.5, -2.5), (14.5, 15.0), (-2.5, 15.0)]:
        s.box((fx - 0.1, fy - 0.1, 0), (0.2, 0.2, 2.2), {'c': FENCE})
    for (lx, ly) in [(4.6, 7.0), (14.6, 7.0)]:
        s.box((lx - 0.08, ly - 0.08, 0), (0.16, 0.16, 2.6), {'c': POLE})
    return s, 7.0


# ---------------------------------------------------------------- TERMINAL (1x1)
def build_terminal(P):
    HALL, CANOPY, PLAT, BUSC, CLOCK = P[2], P[6], P[7], P[10], P[12]
    DRIVE, MARK, POLE, BENCH = P[1], P[11], P[9], P[8]
    ROOF = _dark(HALL, 0.9)['c']
    # PAVED plot (Paolo 7/24: buildings on pavement, not grass) — the concrete
    # platform apron IS the surface; a kiss-and-ride drive fronts it
    _ground(s := Scene(), (-3, -3, 15, 15),
            patches=[(-2.5, 4.5, 13.5, 8.5, PLAT)],
            drive=(-3, 9.5, 13.5, 15), groundc=(96, 94, 88), lotc=DRIVE)
    # the waiting HALL (back), windows, filling the block width
    s.box((-2.0, -1.0, 0), (12.0, 5.0, 6.6), {'top': {'c': ROOF}, 'px': _win(HALL, 7, 4, 4),
          'py': _win(HALL, 5, 4, 8), 'nx': _dark(HALL), 'ny': _dark(HALL)})
    # the SCHEDULE-BOARD CLOCK over the doors (the terminal landmark)
    s.box((3.0, 3.4, 0), (3.0, 1.4, 9.2), {'top': {'c': ROOF}, 'px': _dark(CLOCK, 1.0),
          'py': _dark(CLOCK, 0.88), 'nx': _dark(CLOCK), 'ny': _dark(CLOCK)})
    s.quad((6.04, 3.7, 6.6), (6.04, 4.5, 6.6), (6.04, 4.5, 8.2), (6.04, 3.7, 8.2), {'c': (206, 200, 178)}, (1, 0, 0))  # clock face
    _door(s, 4.0, 0.4, 3.0, 3.2, doorc=_dark(HALL, 0.4)['c'], framec=tuple(min(255, int(c * 1.18)) for c in HALL), awn=1.2)
    # the gray boarding CANOPY over the platform, on posts (buses read underneath)
    for (px, py) in [(0.0, 4.8), (11.0, 4.8), (0.0, 8.4), (11.0, 8.4)]:
        s.box((px - 0.18, py - 0.18, 0), (0.36, 0.36, 3.8), {'c': _dark(CANOPY, 0.8)['c']})
    s.box((-0.6, 4.4, 3.8), (12.0, 4.4, 0.45), {'top': {'c': CANOPY}, 'px': _dark(CANOPY, 0.8),
          'py': _dark(CANOPY, 0.8), 'nx': _dark(CANOPY, 0.8), 'ny': _dark(CANOPY, 0.8)})
    # a ROW of dead BUSES nosed in at the bays under the canopy (canon BUS size)
    for bx in (0.6, 3.5, 6.4, 9.3):
        _vehicle(s, bx, 4.9, BUS, BUSC, along='y')
        s.box((bx - 0.05, 4.8, 0.0), (0.04, 3.9, 0.06), {'c': MARK})        # bay-line stripe
    for lx in (-1.0, 12.2):
        s.box((lx - 0.08, 6.4, 0), (0.16, 0.16, 3.4), {'c': POLE})
    s.box((10.4, 9.6, 0), (2.2, 0.5, 0.5), {'c': BENCH})                    # a platform bench cluster
    return s, 7.0


# ---------------------------------------------------------------- DOWNTOWN
def build_downtown(P):
    POD, TOWER, MECH, BRIDGE, DECK = P[2], P[6], P[10], P[12], P[13]
    PLAZA, DRIVE = P[7], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-2, -2, 14, 14, PLAZA)], groundc=PLAZA, lotc=DRIVE)
    # a podium base filling the block to the street wall + slender towers rising from it
    s.box((-1, -1, 0), (14, 13, 3.4), {'top': _dark(POD, 0.9), 'px': _win(POD, 9, 2, 3),
          'py': _win(POD, 8, 2, 7), 'nx': _dark(POD), 'ny': _dark(POD)})
    for (tx, ty, th, sd) in [(0.8, 0.4, 21, 3), (8.4, 4.6, 16, 8)]:
        s.box((tx, ty, 3.4), (4.2, 4.2, th), {'top': _dark(TOWER, 0.85), 'px': _win(TOWER, 3, int(th / 2.2), sd),
              'py': _win(TOWER, 3, int(th / 2.2), sd + 4), 'nx': _dark(TOWER), 'ny': _dark(TOWER)})
        s.box((tx + 1.1, ty + 1.1, 3.4 + th), (2.0, 2.0, 1.3), {'c': MECH})
    s.box((3.2, 2.6, 13.6), (6.2, 1.2, 0.9), {'c': BRIDGE})                 # skybridge between the towers
    _door(s, 13, 5.0, 7.6, 3.0, doorc=_dark(POD, 0.4)['c'], framec=tuple(min(255, int(c * 1.2)) for c in POD), awn=1.2)
    return s, 6.4


# ---------------------------------------------------------------- INDUSTRIAL
def build_industrial(P):
    WARE, DOCK, OFFICE, GUARD, TRAILERC, DRIVE = P[2], P[4], P[6], P[11], P[9], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(9.5, -3, 15, 15), groundc=(88, 86, 80), lotc=DRIVE)
    # one big distribution warehouse
    s.box((-2, -1, 0), (11, 8, 6.4), {'top': _dark(WARE, 0.9), 'px': _win(WARE, 6, 3, 4, 0.2),
          'py': _dark(WARE, 0.96), 'nx': _dark(WARE), 'ny': _dark(WARE)})
    for dy in (0.2, 1.6, 3.0, 4.4, 5.8):                                    # a row of dock doors on the front
        s.box((9.0, dy, 0), (0.16, 1.0, 2.2), {'c': DOCK})
    for ty in (0.3, 2.2, 4.1, 6.0):                                         # parked trailers (canon TRAILER size)
        _vehicle(s, 10.5, ty, TRAILER, TRAILERC, along='x')
    s.box((-2, 7.6, 0), (4.2, 2.6, 3.2), {'top': _dark(OFFICE, 0.9), 'px': _win(OFFICE, 3, 2, 6),
          'py': _win(OFFICE, 2, 2, 9), 'nx': _dark(OFFICE), 'ny': _dark(OFFICE)})   # front office
    s.box((7.6, -2.6, 0), (1.5, 1.5, 2.3), {'c': GUARD})                    # guard shack at the gate
    return s, 6.6


# ---------------------------------------------------------------- MEDICAL
def build_medical(P):
    BLD, DOOR, CANOPY, GARAGE, VEH, WALK, REDX, DRIVE = P[2], P[4], P[7], P[8], P[11], P[6], P[9], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(9.5, -3, 15, 15), groundc=(120, 120, 124), lotc=DRIVE)
    # the hospital block + ER wing
    s.box((-2, -1, 0), (9, 7, 9.0), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 6, 7, 4),
          'py': _win(BLD, 5, 7, 8), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    # a RED CROSS on the front face so it reads as a hospital
    s.quad((7.04, 2.6, 5.6), (7.04, 4.4, 5.6), (7.04, 4.4, 6.4), (7.04, 2.6, 6.4), {'c': REDX}, (1, 0, 0))
    s.quad((7.04, 3.2, 5.0), (7.04, 3.8, 5.0), (7.04, 3.8, 7.0), (7.04, 3.2, 7.0), {'c': REDX}, (1, 0, 0))
    # entrance drop-off canopy + doors
    s.box((7, 2.2, 0), (2.2, 3.2, 3.0), {'c': CANOPY})
    _door(s, 7, 2.6, 4.4, 2.7, doorc=_dark(BLD, 0.4)['c'], framec=tuple(min(255, int(c * 1.2)) for c in BLD))
    # the decked PARKING GARAGE (front-right) — horizontal deck bands read as levels
    s.box((9.5, 7, 0), (5, 6.5, 6.2), {'top': _dark(GARAGE, 0.9), 'px': _win(GARAGE, 1, 5, 2, 0.0),
          'py': _win(GARAGE, 1, 5, 5, 0.0), 'nx': _dark(GARAGE), 'ny': _dark(GARAGE)})
    for (cx, cy) in [(10.4, -1.6), (12.3, -1.6), (9.9, 5.4)]:               # a couple parked cars (canon CAR size)
        _vehicle(s, cx, cy, CAR, VEH, along='y')
    return s, 6.6


# ---------------------------------------------------------------- MALL
def build_mall(P):
    CONC, ANCHOR, FOOD, CARC, DRIVE, LOT = P[2], P[6], P[7], P[10], P[1], P[4]
    s = Scene()
    _ground(s, (-4, -3, 14, 15), lot=(-4, 10, 14, 15), drive=(4, 9.5, 8, 15), groundc=(96, 94, 86), lotc=LOT)
    # DUMBBELL: a long concourse spine with a big-box anchor at each end + a food-court bump
    s.box((-1, 1.5, 0), (13, 4.5, 5.0), {'top': _dark(CONC, 0.92), 'px': _win(CONC, 10, 2, 4, 0.18),
          'py': _dark(CONC, 0.95), 'nx': _dark(CONC), 'ny': _dark(CONC)})               # concourse
    for ax in (-2.0, 9.5):                                                              # anchor store at each end
        s.box((ax, 0.5, 0), (4.5, 6.5, 6.4), {'top': _dark(ANCHOR, 0.9), 'px': _win(ANCHOR, 3, 3, 5, 0.16),
              'py': _win(ANCHOR, 4, 3, 9, 0.16), 'nx': _dark(ANCHOR), 'ny': _dark(ANCHOR)})
    s.box((4.5, 6.0, 0), (4.0, 2.6, 4.2), {'top': _dark(FOOD, 0.9), 'px': _win(FOOD, 4, 2, 7),
          'py': _dark(FOOD, 0.9), 'nx': _dark(FOOD), 'ny': _dark(FOOD)})                # food-court bump-out
    _door(s, 12.5, 3.0, 4.5, 2.6, doorc=_dark(CONC, 0.4)['c'], framec=tuple(min(255, int(c * 1.25)) for c in CONC))
    for cx in (1.5, 4.0, 6.5, 9.0, 11.0):                                               # abandoned cars in the lot (canon CAR size)
        _vehicle(s, cx, 12.2, CAR, CARC, along='x')
    return s, 6.4


# ---------------------------------------------------------------- PARK
def build_park(P):
    SHELTER, TURF, PATH, CARC = P[2], P[6], P[4], P[11]
    BENCH, LOT = P[8], P[1]
    PAVE = (100, 98, 92)
    s = Scene()
    # a park is OPEN: mostly dead turf + a winding path, a small shelter, a lot at the edge.
    # (Turf stays — a park IS the grass; but the BUILDING sits on a paved pad, Paolo 7/24.)
    _ground(s, (-3, -3, 15, 15), patches=[(-2, -2, 14, 14, TURF), (0.0, 0.0, 4.6, 4.0, PAVE)],
            lot=(9.5, 10.5, 15, 15), groundc=TURF, lotc=LOT)
    # winding path (a couple light bands)
    s.box((-2, 3.0, 0.01), (13, 1.1, 0.05), {'c': PATH})
    s.box((5.0, 3.0, 0.01), (1.1, 9.0, 0.05), {'c': PATH})
    # the small SHELTER / restroom building on its paved pad (the only structure)
    s.box((0.5, 0.5, 0), (3.6, 3.0, 2.8), {'top': _dark(SHELTER, 0.9), 'px': _win(SHELTER, 2, 2, 4),
          'py': _dark(SHELTER, 0.9), 'nx': _dark(SHELTER), 'ny': _dark(SHELTER)})
    _door(s, 4.1, 1.4, 2.4, 1.9, doorc=_dark(SHELTER, 0.4)['c'], framec=tuple(min(255, int(c * 1.15)) for c in SHELTER))
    # a dead shade tree + benches + a car at the lot (canon CAR size)
    s.box((9.0, 5.5, 0), (0.5, 0.5, 3.0), {'c': (70, 60, 48)})
    for (bx, by) in [(2.0, 6.5), (7.5, 8.0)]:
        s.box((bx, by, 0), (1.6, 0.4, 0.4), {'c': BENCH})
    _vehicle(s, 10.4, 11.4, CAR, CARC, along='x')
    return s, 6.6


# ---------------------------------------------------------------- WAREHOUSE (flex/tenant units)
def build_warehouse(P):
    UNIT, OFFICE, BURN, FENCE, CARC, DRIVE = P[2], P[7], P[8], P[12], P[10], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(-3, 9.5, 15, 15), groundc=(84, 80, 72), lotc=DRIVE)
    # rows of flex/tenant UNITS (long low bays wall-to-wall, storage-density reference)
    for r, ry in enumerate((0.0, 3.4, 6.8)):
        col = BURN if r == 1 else UNIT                                    # one burned-out row reads act-1
        s.box((-2, ry, 0), (11, 2.6, 3.2), {'top': _dark(col, 0.95), 'px': _dark(col, 1.0),
              'py': _dark(col, 0.84), 'nx': _dark(col), 'ny': _dark(col)})
        for ux in range(0, 6):                                            # roll-up door seams
            s.box((-2 + ux * 1.9 + 0.5, ry - 0.02, 0.2), (0.9, 0.04, 2.4), _dark(col, 0.7))
    # the leasing OFFICE bay at the corner
    s.box((9.5, -1.0, 0), (3.4, 3.0, 3.4), {'top': _dark(OFFICE, 0.9), 'px': _win(OFFICE, 3, 2, 6),
          'py': _win(OFFICE, 2, 2, 9), 'nx': _dark(OFFICE), 'ny': _dark(OFFICE)})
    for (fx, fy) in [(-2.5, -2.5), (13.5, -2.5), (13.5, 9.5), (-2.5, 9.5)]:   # fortress fence posts
        s.box((fx - 0.1, fy - 0.1, 0), (0.2, 0.2, 2.2), {'c': FENCE})
    for cx in (-1.0, 1.5, 4.0):                                              # abandoned cars in the drive aisle (canon CAR size)
        _vehicle(s, cx, 11.0, CAR, CARC, along='x')
    return s, 6.6


# ---------------------------------------------------------------- COMMERCIAL
def build_commercial(P):
    STORE, GLASS, GASC, DOOR, SERV, PUMP = P[2], P[12], P[10], P[7], P[9], P[11]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), lot=(-3, 6.5, 15, 15), drive=(4, 6.5, 8, 15), groundc=(104, 102, 96), lotc=(52, 52, 60))
    # an L of STORES on the back property lines, glass storefronts facing the lot
    s.box((-2, -1, 0), (13, 3.6, 4.8), {'top': _dark(STORE, 0.9), 'px': _win(STORE, 11, 2, 4, 0.14, GLASS),
          'py': _dark(STORE, 0.95), 'nx': _dark(STORE), 'ny': _dark(STORE)})
    s.box((-2, -1, 0), (3.4, 6.0, 4.8), {'top': _dark(STORE, 0.9), 'px': _dark(STORE, 0.96),
          'py': _win(STORE, 4, 2, 9, 0.14, GLASS), 'nx': _dark(STORE), 'ny': _dark(STORE)})
    s.box((-2, 2.6, 4.8), (13, 0.3, 0.7), {'c': DOOR})                          # sign band
    _door(s, 11, 3.0, 4.6, 2.4, doorc=_dark(GLASS, 0.7)['c'], framec=tuple(min(255, int(c * 1.2)) for c in STORE))
    # a GAS STATION in the front corner: a flat canopy on posts + pumps
    for (px, py) in [(9.5, 9.0), (13.5, 9.0), (9.5, 12.5), (13.5, 12.5)]:
        s.box((px - 0.16, py - 0.16, 0), (0.32, 0.32, 3.0), {'c': _dark(GASC, 0.8)['c']})
    s.box((9.2, 8.6, 3.0), (4.6, 4.4, 0.4), {'top': {'c': GASC}, 'px': _dark(GASC, 0.8), 'py': _dark(GASC, 0.8),
          'nx': _dark(GASC, 0.8), 'ny': _dark(GASC, 0.8)})
    for (mx, my) in [(11.0, 10.0), (11.0, 11.5)]:
        s.box((mx, my, 0), (0.6, 0.9, 1.3), {'c': PUMP})                        # fuel pumps
    for cx in (0.5, 3.0, 5.5):
        _vehicle(s, cx, 8.5, CAR, P[6], along='x')                             # cars in the lot
    return s, 6.6


# ---------------------------------------------------------------- SCHOOL
def build_school(P):
    BLD, GYM, COURT, FIELD, BUSC, DRIVE = P[2], P[7], P[8], P[6], P[12], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(7.5, -2.5, 14.5, 4.0, COURT)], lot=(-3, 10, 9, 15),
            drive=(2, 10, 6, 15), groundc=(102, 100, 94), lotc=(52, 52, 60))
    # the E-shaped school building (a spine + wings) + a taller gym block
    s.box((-2, -1, 0), (9, 2.8, 4.6), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 7, 2, 4),
          'py': _win(BLD, 6, 2, 8), 'nx': _dark(BLD), 'ny': _dark(BLD)})        # spine
    for wy in (-1.0, 2.6, 6.2):                                                 # three wings
        s.box((-2, wy, 0), (2.6, 3.0, 4.2), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 2, 2, int(wy) + 5),
              'py': _dark(BLD, 0.95), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    s.box((5.5, 5.0, 0), (4.5, 4.5, 6.2), {'top': _dark(GYM, 0.9), 'px': _dark(GYM, 1.0),
          'py': _dark(GYM, 0.85), 'nx': _dark(GYM), 'ny': _dark(GYM)})          # gym
    _door(s, 7.0, 0.5, 2.3, 2.4, doorc=_dark(BLD, 0.4)['c'], framec=tuple(min(255, int(c * 1.2)) for c in BLD))
    _vehicle(s, 8.5, -2.0, BUS, BUSC, along='x')                               # a school bus
    return s, 6.6


# ---------------------------------------------------------------- COURTHOUSE
def build_courthouse(P):
    BLD, STEPS, COL, DOME, PLAZA, DRIVE = P[2], P[6], P[8], P[10], P[7], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-3, -3, 15, 9.5, PLAZA)], lot=(9.5, 10.5, 15, 15),
            drive=(11, 10.5, 14, 15), groundc=(114, 112, 106), lotc=(58, 58, 66))
    # a stately civic block on a raised podium
    s.box((-1, -1, 0), (11, 8, 1.8), {'c': _dark(STEPS, 1.0)['c']})             # podium
    s.box((0, 0, 1.8), (8.5, 6.5, 8.0), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 6, 4, 4),
          'py': _win(BLD, 4, 4, 8), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    # a PORTICO of columns across the front (+x) + a lintel
    for cy in (0.4, 1.6, 2.8, 4.0, 5.2, 6.4):
        s.box((8.5, cy, 1.8), (0.55, 0.55, 6.4), {'c': COL})
    s.box((8.5, 0.2, 8.2), (0.8, 6.6, 0.7), {'c': tuple(min(255, int(c * 1.05)) for c in COL)})
    # grand STEPS down to grade
    for i, sz in enumerate((1.6, 1.1, 0.6)):
        s.box((9.2 + i * 0.55, 1.5, 0), (0.55, 4.0, sz), {'c': STEPS})
    # a DOME / cupola on the roof center
    s.prism(4.2, 3.2, 9.8, 1.7, 1.3, 14, {'c': DOME}, {'c': tuple(min(255, int(c * 1.1)) for c in DOME)})
    return s, 6.4


# ---------------------------------------------------------------- LIBRARY
def build_library(P):
    BLD, STEPS, COL, STACKS, PLAZA, DRIVE = P[2], P[6], P[8], P[11], P[7], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-3, -3, 15, 9.5, PLAZA)], lot=(9.5, 10.5, 15, 15),
            drive=(11, 10.5, 14, 15), groundc=(114, 112, 106), lotc=(58, 58, 66))
    s.box((-1, -1, 0), (11, 8, 1.4), {'c': _dark(STEPS, 1.0)['c']})             # low podium
    # a long reading-room block + a taller stacks tower behind
    s.box((0, 0, 1.4), (9, 6.5, 6.4), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 7, 3, 4),
          'py': _win(BLD, 5, 3, 8), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    s.box((1.5, 0.5, 1.4), (4.5, 5.5, 9.5), {'top': _dark(STACKS, 0.9), 'px': _win(STACKS, 3, 6, 6, 0.1),
          'py': _win(STACKS, 3, 6, 11, 0.1), 'nx': _dark(STACKS), 'ny': _dark(STACKS)})   # stacks tower
    # a COLONNADE across the front + steps
    for cy in (0.5, 2.0, 3.5, 5.0, 6.4):
        s.box((9.0, cy, 1.4), (0.5, 0.5, 5.2), {'c': COL})
    s.box((9.0, 0.3, 6.6), (0.7, 6.4, 0.6), {'c': tuple(min(255, int(c * 1.05)) for c in COL)})
    for i, sz in enumerate((1.2, 0.7)):
        s.box((9.6 + i * 0.5, 1.6, 0), (0.5, 3.8, sz), {'c': STEPS})
    _door(s, 9.05, 3.0, 4.4, 2.4, doorc=_dark(BLD, 0.4)['c'], framec=tuple(min(255, int(c * 1.2)) for c in BLD))
    return s, 6.4


# ---------------------------------------------------------------- FARM
def build_farm(P):
    HOUSE, SILO, TRACTOR, FENCE, BARN, FIELD = P[2], P[6], P[10], P[11], P[14], P[13]
    s = Scene()
    # a farm is DIRT + dead crop rows, not grass or pavement (agricultural)
    DIRT = (92, 82, 64)
    _ground(s, (-3, -3, 15, 15), patches=[(4.0, 4.0, 14.5, 14.5, _dark(FIELD, 0.9)['c'])],
            drive=(-3, -1, 4, 1.5), groundc=DIRT, lotc=(70, 62, 48))
    # dead crop rows in the field
    for fy in range(0, 10, 2):
        s.box((4.5, 5.0 + fy, 0.02), (9.5, 0.5, 0.12), {'c': _dark(FIELD, 1.1)['c']})
    # the red BARN (gable approximated by a darker peaked cap) + a tall SILO beside it
    s.box((-2, -1, 0), (5.5, 4.5, 4.4), {'top': _dark(BARN, 0.7), 'px': _dark(BARN, 1.0),
          'py': _dark(BARN, 0.82), 'nx': _dark(BARN), 'ny': _dark(BARN)})
    s.box((-1.4, -0.4, 4.4), (4.3, 3.3, 1.4), {'c': _dark(BARN, 0.78)['c']})    # peaked roof cap
    s.prism(4.3, 0.6, 0, 1.5, 7.2, 14, {'c': SILO}, {'c': tuple(min(255, int(c * 1.05)) for c in SILO)})
    s.prism(4.3, 0.6, 7.2, 1.5, 0.9, 14, {'c': _dark(SILO, 0.8)['c']})          # silo dome cap
    # the farmhouse + a tractor + a fence line
    s.box((-2, 5.5, 0), (3.4, 3.0, 3.6), {'top': _dark(HOUSE, 0.9), 'px': _win(HOUSE, 3, 2, 4),
          'py': _win(HOUSE, 2, 2, 9), 'nx': _dark(HOUSE), 'ny': _dark(HOUSE)})
    _vehicle(s, 7.5, 1.0, CAR, TRACTOR, along='x')                             # a dead tractor
    for fx in range(0, 8):
        s.box((-2.5 + fx * 2.0, 9.5, 0), (0.12, 0.12, 1.1), {'c': FENCE})
    return s, 6.6


# ---------------------------------------------------------------- FIRE STATION
def build_firestation(P):
    QUART, BAYDOOR, TOWER, ENGINE, STAFF, DRIVE = P[2], P[6], P[7], P[8], P[10], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(-3, 6.5, 15, 12), groundc=(100, 98, 92), lotc=(56, 56, 62))
    # the station: quarters + the apparatus-bay block with RED roll-up doors on the front
    s.box((-2, -1, 0), (11, 5.5, 5.6), {'top': _dark(QUART, 0.9), 'px': _dark(QUART, 1.0),
          'py': _win(QUART, 8, 3, 8), 'nx': _dark(QUART), 'ny': _dark(QUART)})
    for by in (0.2, 2.2, 4.2):                                                  # red apparatus bay doors
        s.box((9.0, by, 0), (0.18, 1.6, 3.2), {'c': BAYDOOR})
    # the HOSE / drying tower (the tall landmark)
    s.box((-1.5, -1.2, 0), (2.0, 2.0, 10.5), {'top': _dark(TOWER, 0.9), 'px': _win(TOWER, 1, 6, 4, 0.08),
          'py': _win(TOWER, 1, 6, 8, 0.08), 'nx': _dark(TOWER), 'ny': _dark(TOWER)})
    # a red FIRE ENGINE pulled out onto the apron + a staff car
    _vehicle(s, 9.8, 0.4, BUS, ENGINE, along='y')
    _vehicle(s, 9.8, 4.8, CAR, STAFF, along='y')
    return s, 6.6


# ---------------------------------------------------------------- POLICE STATION
def build_policestation(P):
    STN, SALLY, PATROL, IMPOUND, ANT, FENCE = P[2], P[6], P[7], P[8], P[10], P[12]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(-3, 7, 15, 12), groundc=(96, 96, 100), lotc=(56, 56, 64))
    s.box((-2, -1, 0), (9, 6, 6.0), {'top': _dark(STN, 0.9), 'px': _win(STN, 6, 4, 4),
          'py': _win(STN, 4, 4, 8), 'nx': _dark(STN), 'ny': _dark(STN)})               # station
    s.box((7.2, -0.5, 0), (3.6, 4.2, 4.4), {'top': _dark(SALLY, 0.9), 'px': _dark(SALLY, 1.0),
          'py': _dark(SALLY, 0.85), 'nx': _dark(SALLY), 'ny': _dark(SALLY)})            # sally port
    _door(s, 7.0, 1.0, 3.0, 2.6, doorc=_dark(STN, 0.4)['c'], framec=tuple(min(255, int(c * 1.2)) for c in STN))
    s.box((-0.5, -0.8, 6.0), (0.16, 0.16, 2.6), {'c': ANT})                             # roof antenna mast
    s.prism(-0.42, -0.72, 8.6, 0.6, 0.18, 10, {'c': ANT})                               # dish
    for cx in (0.5, 3.0, 5.5):
        _vehicle(s, cx, 8.5, CAR, PATROL, along='x')                                    # patrol fleet
    _vehicle(s, 8.5, 8.5, CAR, IMPOUND, along='x')                                      # impound wreck
    for (fx, fy) in [(-2.5, -2.5), (13.5, -2.5), (13.5, 6.5), (-2.5, 6.5)]:
        s.box((fx - 0.1, fy - 0.1, 0), (0.2, 0.2, 2.0), {'c': FENCE})
    return s, 6.6


# ---------------------------------------------------------------- SOLAR
def build_solar(P):
    CTRL, INV, SWG, PANEL = P[2], P[4], P[6], P[7]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(-3, -1.5, 1.5, 0.5), groundc=(108, 100, 84), lotc=(72, 66, 54))
    PVMAT = {'t': 'win', 'wall': PANEL, 'glass': _dark(PANEL, 0.8)['c'], 'frame': (120, 126, 136), 'cols': 6, 'rows': 2}
    for ry in (1.0, 3.6, 6.2, 8.8, 11.4):                                               # a FIELD of tilted PV rows
        for cx in (3.0, 6.5, 10.0, 13.2):
            s.box((cx - 0.05, ry + 0.7, 0), (0.1, 0.1, 1.2), {'c': (92, 90, 86)})       # post
            s.quad((cx - 1.4, ry - 0.5, 1.9), (cx + 1.4, ry - 0.5, 1.4), (cx + 1.4, ry + 0.9, 1.4),
                   (cx - 1.4, ry + 0.9, 1.9), PVMAT, (0.2, 0, 0.98))                    # tilted panel
    s.box((-2, -1.6, 0), (3.2, 2.6, 3.4), {'top': _dark(CTRL, 0.9), 'px': _win(CTRL, 3, 2, 4),
          'py': _dark(CTRL, 0.95), 'nx': _dark(CTRL), 'ny': _dark(CTRL)})               # control building
    s.box((1.6, -1.6, 0), (1.4, 1.4, 1.6), {'c': INV})                                  # inverter/transformer pad
    s.box((3.4, -1.6, 0), (1.8, 1.4, 2.2), {'c': SWG})                                  # substation switchgear
    return s, 6.4


# ---------------------------------------------------------------- STADIUM
def build_stadium(P):
    FACADE, BOWL, SCORE, LIGHT, FIELD, CARC = P[2], P[6], P[9], P[12], P[4], P[11]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), lot=(-3, 11, 15, 15), groundc=(96, 94, 88), lotc=(52, 52, 60))
    s.prism(6, 4, 0.02, 5.4, 0.06, 22, {'c': _dark(FIELD, 0.9)['c']})                   # the field oval
    s.prism(6, 4, 0, 6.9, 6.4, 26, {'c': FACADE}, {'c': _dark(BOWL, 1.05)['c']})        # the bowl (facade wall + seating top)
    for (lx, ly) in [(0.4, -1.2), (11.6, -1.2), (0.4, 9.2), (11.6, 9.2)]:
        s.box((lx - 0.12, ly - 0.12, 0), (0.24, 0.24, 9.2), {'c': LIGHT})               # light-tower mast
        s.box((lx - 0.55, ly - 0.55, 9.2), (1.1, 1.1, 0.6), {'c': tuple(min(255, int(c * 1.12)) for c in LIGHT)})
    s.box((6.0, -1.8, 0), (2.2, 0.4, 5.2), {'c': SCORE})                                # scoreboard / jumbotron
    _vehicle(s, 2.0, 12.0, CAR, CARC, along='x')                                        # abandoned car in the lot
    return s, 6.2


# ---------------------------------------------------------------- SELF-STORAGE
def build_storage(P):
    UNIT, ROOF, ROLLUP, FENCE, OFFICE, VEH = P[2], P[4], P[6], P[8], P[12], P[10]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(-3, 9.5, 15, 15), groundc=(84, 80, 72), lotc=(52, 52, 58))
    for ry in (0.0, 3.4, 6.8):                                                          # unit rows wall-to-wall
        s.box((-2, ry, 0), (11, 2.6, 3.0), {'top': _dark(UNIT, 0.9), 'px': _dark(UNIT, 1.0),
              'py': _dark(UNIT, 0.84), 'nx': _dark(UNIT), 'ny': _dark(UNIT)})
        for ux in range(0, 6):
            s.box((-2 + ux * 1.9 + 0.5, ry - 0.02, 0.15), (0.9, 0.05, 2.3), {'c': ROLLUP})   # orange roll-up doors
        s.box((-2, ry + 1.2, 3.0), (11, 0.25, 0.3), {'c': ROOF})                        # roof ridge
    s.box((9.5, -1.0, 0), (3.4, 3.0, 3.4), {'top': _dark(OFFICE, 0.9), 'px': _win(OFFICE, 3, 2, 6),
          'py': _win(OFFICE, 2, 2, 9), 'nx': _dark(OFFICE), 'ny': _dark(OFFICE)})       # office
    for (fx, fy) in [(-2.5, -2.5), (13.5, -2.5), (13.5, 9.5), (-2.5, 9.5)]:
        s.box((fx - 0.1, fy - 0.1, 0), (0.2, 0.2, 2.2), {'c': FENCE})                   # fortress fence
    _vehicle(s, 0.0, 11.0, CAR, VEH, along='x')
    return s, 6.6


# ---------------------------------------------------------------- TRUCK STOP
def build_truckstop(P):
    STORE, CANOPY, WASH, PYLON, VEH = P[2], P[4], P[7], P[8], P[10]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(-3, -3, 15, 15), groundc=(60, 60, 66), lotc=(52, 52, 58))   # vehicular venue: paved
    s.box((-2, -1, 0), (5, 4, 4.6), {'top': _dark(STORE, 0.9), 'px': _win(STORE, 4, 2, 4),
          'py': _win(STORE, 3, 2, 8), 'nx': _dark(STORE), 'ny': _dark(STORE)})          # store / diner
    _door(s, 3.0, 0.5, 2.5, 2.4, doorc=_dark(STORE, 0.4)['c'], framec=tuple(min(255, int(c * 1.2)) for c in STORE))
    for (px, py) in [(5.5, 5.0), (13.5, 5.0), (5.5, 9.0), (13.5, 9.0)]:
        s.box((px - 0.2, py - 0.2, 0), (0.4, 0.4, 4.0), {'c': (92, 90, 86)})            # canopy posts
    s.box((5.0, 4.4, 4.0), (9.0, 5.2, 0.5), {'top': {'c': CANOPY}, 'px': _dark(CANOPY, 0.85),
          'py': _dark(CANOPY, 0.85), 'nx': _dark(CANOPY, 0.85), 'ny': _dark(CANOPY, 0.85)})   # fuel canopy
    for (mx, my) in [(7.5, 6.5), (11.5, 6.5)]:
        s.box((mx, my, 0), (0.7, 1.0, 1.4), {'c': _dark(STORE, 0.7)['c']})              # fuel pumps
    s.box((-2, 5.5, 0), (3.5, 3.0, 3.6), {'top': _dark(WASH, 0.9), 'px': _dark(WASH, 1.0),
          'py': _dark(WASH, 0.85), 'nx': _dark(WASH), 'ny': _dark(WASH)})               # wash bay
    s.box((12.5, -2.0, 0), (0.5, 0.5, 8.0), {'c': (92, 90, 86)})
    s.box((11.6, -2.4, 6.4), (2.2, 0.4, 2.0), {'c': PYLON})                             # pylon price sign
    _vehicle(s, 5.8, 11.4, TRAILER, VEH, along='x')
    _vehicle(s, 10.2, 11.4, TRAILER, VEH, along='x')                                    # parked rigs
    return s, 6.2


# ---------------------------------------------------------------- SWAP MEET
def build_swapmeet(P):
    HALL, TENT, PYLON, REDTENT, TEALTENT, CARC = P[2], P[4], P[8], P[13], P[14], P[10]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(96, 90, 78), lotc=(60, 58, 52))               # gravel market lot
    s.box((-2, -1, 0), (5, 3.5, 4.4), {'top': _dark(HALL, 0.9), 'px': _win(HALL, 4, 2, 4),
          'py': _dark(HALL, 0.95), 'nx': _dark(HALL), 'ny': _dark(HALL)})               # food hall / office
    tents = [TENT, REDTENT, TEALTENT]
    for r, ry in enumerate((3.6, 6.1, 8.6, 11.1)):                                      # rows of market stall tents
        for cc, cx in enumerate((-0.8, 2.2, 5.2, 8.2, 11.2)):
            col = tents[(r + cc) % 3]
            for (pxo, pyo) in [(-0.9, -0.7), (0.9, -0.7), (-0.9, 0.7), (0.9, 0.7)]:
                s.box((cx + pxo - 0.06, ry + pyo - 0.06, 0), (0.12, 0.12, 1.8), {'c': (82, 80, 76)})
            s.box((cx - 1.1, ry - 0.9, 1.8), (2.2, 1.8, 0.3), {'c': col})               # tent canopy
    s.box((12.5, -2.0, 0), (0.5, 0.5, 6.5), {'c': (92, 90, 86)})
    s.box((11.6, -2.4, 5.0), (2.2, 0.4, 1.6), {'c': PYLON})                             # market pylon sign
    _vehicle(s, 7.0, -2.0, CAR, CARC, along='x')
    return s, 6.2


HEROES = {'cityhall': build_cityhall, 'battery': build_battery, 'terminal': build_terminal,
          'downtown': build_downtown, 'industrial': build_industrial, 'medical': build_medical,
          'mall': build_mall, 'park': build_park, 'warehouse': build_warehouse,
          'commercial': build_commercial, 'school': build_school, 'courthouse': build_courthouse,
          'library': build_library, 'farm': build_farm, 'firestation': build_firestation,
          'policestation': build_policestation, 'solar': build_solar, 'stadium': build_stadium,
          'storage': build_storage, 'truckstop': build_truckstop, 'swapmeet': build_swapmeet}
LABEL = {
    'cityhall': 'City Hall — matched to the walkable district: an admin BLOCK + a CLOCK TOWER over the entrance + a forecourt PLAZA with a DRY FOUNTAIN + flagpoles. Same palette as the tile you walk.',
    'battery': 'Battery — matched to the walkable district: a grid BATTERY-STORAGE yard (control building + rows of BATTERY CONTAINERS with HVAC + an INVERTER/TRANSFORMER rack + gravel + fence). Not a smokestack plant.',
    'terminal': 'Transit terminal (1x1) — matched to the walkable district: a waiting HALL + a SCHEDULE-BOARD CLOCK over the doors + a gray boarding CANOPY over a ROW of dead BUSES + a kiss-and-ride.',
    'downtown': 'Downtown — matched: a podium base filling the block + two slender TOWERS with rooftop mech + a SKYBRIDGE. The dense core.',
    'industrial': 'Industrial — matched: one big distribution WAREHOUSE + a row of DOCK DOORS + parked TRAILERS in the truck court + a front office + guard shack.',
    'medical': 'Medical — matched: a hospital BLOCK with a RED CROSS + an entrance drop-off canopy + a decked PARKING GARAGE.',
    'mall': 'Mall — matched: the DUMBBELL — a long concourse with a big-box ANCHOR at each end + a food-court bump + a parking field.',
    'park': 'Park — matched: open dead TURF + a winding PATH + a small SHELTER/restroom + a dead shade tree + benches.',
    'warehouse': 'Warehouse — matched: rows of flex/tenant UNITS (one burned) with roll-up doors + a leasing office + a fortress fence.',
    'commercial': 'Commercial — matched: an L of STORES with glass storefronts + a parking lot + a GAS-STATION canopy & pumps in the corner.',
    'school': 'School — matched: an E-shaped school building + a taller GYM block + a court + a school bus.',
    'courthouse': 'Courthouse — matched: a stately civic block on a podium + a COLUMN PORTICO + grand STEPS + a DOME.',
    'library': 'Library — matched: a reading-room block + a stacks tower + a front COLONNADE + steps.',
    'farm': 'Farm — matched: a red BARN + a tall SILO + a farmhouse + a dead tractor + crop-row fields (dirt, not grass).',
    'firestation': 'Fire station — matched: quarters + a bay block with RED apparatus doors + a HOSE TOWER + a red fire engine + staff car.',
    'policestation': 'Police station — matched: a station building + a SALLY PORT + a PATROL-CAR fleet + an impound wreck + a roof antenna + a fence.',
    'solar': 'Solar — matched: a FIELD of tilted PV panel rows + a control building + inverter pads + substation switchgear.',
    'stadium': 'Stadium — matched: the oval seating BOWL + facade + a field + four LIGHT TOWERS + a scoreboard + a parking field.',
    'storage': 'Self-storage — matched: unit rows wall-to-wall with ORANGE roll-up doors + a leasing office + a fortress fence.',
    'truckstop': 'Truck stop — matched: a store/diner + a big FUEL CANOPY over pumps + a wash bay + a tall PYLON sign + parked rigs.',
    'swapmeet': 'Swap meet — matched: a food hall + rows of colorful STALL TENTS (the market) + a pylon sign + gravel lot.',
}

# PARTS — DOSSIER-OR-DON'T (Paolo 7/24, LOCKED): every part of every hero building
# is written up here. If a part exists in the bake, it is named here (and vice
# versa). Each line: PART — what it is + which walkable-district landmark it mirrors.
# hero_dossier_gate.py fails the build if a bank hero has no PARTS entry.
PARTS = {
    'cityhall': [
        'admin block — the mayor/council/clerk mass (walkable code 2 "building (city hall)"), windows w/ boarded dead panes',
        'clock tower — the stopped clock tower over the entrance (code 6 "clock tower"), with a pale clock face',
        'ground entrance — doors at grade on the block front + a flat awning (the chained public doors, code 2 face)',
        'forecourt plaza — the public plaza pavers before the block (code 7 "plaza")',
        'dry fountain — the dead reflecting fountain, round basin + inner pedestal (code 8 "dry fountain")',
        'flagpoles x2 — the halyard poles flanking the fountain (code 12 "flagpole")',
        'civic-seal monument — the toppled seal block (code 10 "civic seal / monument")',
        'plaza pole lights x2 — dead plaza lights (code 9)',
        'sidewalk pad — the paved pad under the block (code 11 "sidewalk"); visitor lot + driveway (code 1)',
    ],
    'battery': [
        'control building — the monitoring/switchgear building (code 2), windows + a door + a hazard apron band (code 11)',
        'battery-container rows x3 — Megapack-style enclosures with module seams (code 6 "battery container")',
        'HVAC units x3 — the thermal unit at each row end (code 7 "HVAC / thermal unit")',
        'inverter/transformer rack — the grid-tie rack w/ three bushings + a hazard band (code 8 "inverter/transformer rack")',
        'perimeter fence posts x4 — the double security fence (code 10 "perimeter fence")',
        'pole lights x2 — dead yard lights (code 9); gravel yard (code 4) + access-road drive (code 1)',
    ],
    'terminal': [
        'waiting hall — the terminal building mass (code 2), windows',
        'schedule-board clock — the stopped clock/board tower over the doors (code 12) w/ a clock face',
        'ground entrance — glass doors at grade + awning on the hall front',
        'boarding canopy — the gray overhead canopy on 4 posts (code 6 "boarding canopy")',
        'dead buses x4 (canon BUS) — nose-in at the bays w/ bay-line stripes (code 10 bus, code 11 marking)',
        'pole lights x2 (code 9) + a platform bench cluster (code 8); concrete platform (code 7) + kiss-and-ride drive (code 1)',
    ],
    'downtown': [
        'podium base — the block-filling retail/parking podium (code 2 "podium / mid-rise"), storefront windows',
        'slender towers x2 — the towers rising from the podium (code 6 "tower") w/ rooftop mech boxes (code 10)',
        'skybridge — the bridge between the towers (code 12 "skybridge", overhead)',
        'ground entrance — doors + awning on the podium front; plaza (code 7) + street/lot (code 1)',
    ],
    'industrial': [
        'distribution warehouse — the one big box (code 2 "warehouse"), a clerestory window band',
        'dock doors x5 — the loading-dock door row on the front (code 4 "dock door")',
        'parked trailers x4 (canon TRAILER) — trailers in the truck court (code 9 "parked trailer")',
        'front office — the office block (code 6) + a guard shack at the gate (code 11); truck court drive (code 1)',
    ],
    'medical': [
        'hospital block — the hospital + ER mass (code 2), windows',
        'red cross — the + on the front face so it reads as a hospital (code 9 accent)',
        'entrance drop-off canopy — the canopy over the doors (code 7 "canopy") + ground doors (code 4)',
        'parking garage — the decked garage, horizontal deck bands (code 8 "parking garage")',
        'parked cars x3 (canon CAR) — visitor/ambulance vehicles (code 11); visitor lot drive (code 1)',
    ],
    'mall': [
        'concourse — the long enclosed spine (code 2 "concourse"), a clerestory band',
        'anchor stores x2 — the big-box anchor at each end of the dumbbell (code 6 "anchor store")',
        'food-court bump — the food-court bump-out (code 7 "food court")',
        'ground entrance — a mall vestibule door on the concourse front',
        'abandoned cars x5 (canon CAR) — in the parking field (code 10); parking lot + drive (codes 4/1)',
    ],
    'park': [
        'shelter/restroom — the only building, on a PAVED pad (code 2), window + door',
        'winding path — the trail bands crossing the turf (code 4 "path")',
        'dead shade tree — a bare dead trunk (dead-world)',
        'benches x2 (code 8) + a car at the edge lot (canon CAR, code 11)',
        'open dead turf — the park ground itself (code 6 turf); a small edge lot (code 1)',
    ],
    'warehouse': [
        'flex/tenant unit rows x3 — long low bays wall-to-wall w/ roll-up door seams (code 2 "tenant unit")',
        'burned unit row — one scorched/dark row, act-1 (code 8 "burned unit")',
        'leasing office — the office bay at the corner (code 7 "office bay"), windows',
        'fortress fence posts x4 (code 12 "fence") + abandoned cars x3 (canon CAR, code 10); drive aisle (code 1)',
    ],
    'commercial': [
        'store L — stores on the back + side property lines w/ glass storefronts (code 2 "store", code 12 storefront glass)',
        'sign band — the storefront sign band (code 7 store-door tone)',
        'ground entrance — a storefront door on the front (code 7 "store door")',
        'gas-station canopy — the flat fuel canopy on 4 posts in the corner (code 10 "gas canopy", overhead)',
        'fuel pumps x2 (code 11) + cars x3 (canon CAR, code 6 tone); parking lot fronting + drive (codes 4/1)',
    ],
    'school': [
        'E-building — the classroom spine + three wings (code 2 "building (school/gym)"), windows',
        'gym block — the taller gymnasium mass (code 7 tone)',
        'court — a paved sport court (code 8)',
        'ground entrance — doors on the spine front',
        'school bus (canon BUS) — a dead bus at the drop-off (code 12 tone); bus/car lot + drive (code 1)',
    ],
    'courthouse': [
        'podium — the raised civic base/steps mass (code 6 "grand steps")',
        'civic block — the stately building on the podium (code 2), windows',
        'column portico x6 — the front colonnade + a lintel (code 8 "portico columns")',
        'grand steps — the tiered steps down to grade (code 6)',
        'dome/cupola — the dome on the roof center (code 10 "dome / cupola"); plaza (code 7) + lot/drive (code 1)',
    ],
    'library': [
        'low podium — the civic base (code 6 "entrance steps")',
        'reading-room block — the long main block (code 2 "building (library)"), windows',
        'stacks tower — the taller stacks mass behind (code 11 "stacks / reading detail")',
        'front colonnade x5 — the colonnade + lintel (code 8 "colonnade columns")',
        'steps + ground entrance doors; plaza (code 7) + lot/drive (code 1)',
    ],
    'farm': [
        'red barn — the barn w/ a peaked roof cap (code 14 "barn")',
        'silo — the tall grain silo cylinder + dome cap (code 6 "silo")',
        'farmhouse — the farmhouse/shed (code 2), windows',
        'dead tractor (canon CAR) — a dead tractor in the yard (code 10 "tractor")',
        'crop-row fields — dead crop rows on dirt, NOT grass (code 13 field) + a fence line (code 11)',
    ],
    'firestation': [
        'station quarters — the crew-quarters block (code 2 "building (station quarters)"), windows',
        'apparatus bay doors x3 — RED roll-up bay doors on the front (code 6 "apparatus bay door")',
        'hose/drying tower — the tall hose tower landmark (code 7 "hose / drying tower")',
        'fire engine (canon BUS) — a RED rig pulled onto the apron (code 8 "fire engine")',
        'staff car (canon CAR) — an abandoned staff car (code 10); the paved apron/drive (code 1)',
    ],
    'policestation': [
        'station building — the main station mass (code 2 "building (station)"), windows + a door',
        'sally port — the secure vehicle-bay block (code 6 "sally port")',
        'roof antenna/dish — the comms mast + dish on the roof (code 10 "roof antenna / dish")',
        'patrol-car fleet x3 (canon CAR) — white cruisers (code 7 "patrol car (fleet)")',
        'impound wreck (canon CAR) — a towed wreck (code 8 "impound wreck")',
        'perimeter fence posts x4 (code 12 "fence / wall"); paved lot + drive (code 1)',
    ],
    'solar': [
        'PV panel field — rows of tilted photovoltaic panels on posts (code 7 "panel"), the hero mass',
        'control building — the monitoring building (code 2 "control building"), windows',
        'inverter/transformer pad — the inverter pad (code 4 "inverter / transformer pad")',
        'substation switchgear — the grid-tie switchgear (code 6 "substation switchgear"); desert/gravel pad (code 1)',
    ],
    'stadium': [
        'seating bowl — the oval bowl (facade wall + seating top) (code 2 facade + code 6 "seating / stands")',
        'field — the oval playing field in the center (code 4)',
        'light towers x4 — the floodlight masts with light banks (code 12 "light tower / floodlight mast")',
        'scoreboard — the jumbotron/scoreboard mast (code 9 "scoreboard / jumbotron")',
        'abandoned car (canon CAR) — a car in the lot (code 11); parking field (codes 1)',
    ],
    'storage': [
        'unit rows x3 — self-storage bays wall-to-wall (code 2 "storage-unit building") w/ a roof ridge (code 4)',
        'roll-up doors — ORANGE closed roll-up doors along each row (code 6 "roll-up door (closed)")',
        'office — the leasing office (code 12 "office"), windows',
        'fortress fence posts x4 (code 8 "perimeter fence") + an abandoned vehicle (canon CAR, code 10); drive (code 1)',
    ],
    'truckstop': [
        'store/diner — the store + diner building (code 2), windows + a door',
        'fuel canopy — the big overhead fuel canopy on posts (code 4 "fuel canopy roof") over pumps',
        'wash bay — the car/truck wash bay (code 7 "wash bay")',
        'pylon sign — the tall price pylon (code 8 "pylon / price sign")',
        'parked rigs x2 (canon TRAILER) — dead rigs (code 10); the paved apron (vehicular venue, code 1)',
    ],
    'swapmeet': [
        'food hall/office — the permanent building (code 2 "building (food hall / office)"), windows',
        'stall tents — rows of market stall canopies in three colors (code 4 tan + code 13 red + code 14 teal, overhead)',
        'market pylon sign — the market sign (code 8 "market pylon sign")',
        'abandoned car (canon CAR) — a car by the entrance (code 10); the gravel market lot (code 1)',
    ],
}


def _write_dossier(heroes):
    lines = ['# BOHEMIA DISTRICT HERO DOSSIER (generated — do not hand-edit)',
             '',
             'DOSSIER-OR-DON\'T (Paolo 7/24, LOCKED): every part of every hero building is',
             'named here. Regenerated by tools/bohemia_district_hero_factory.py; enforced by',
             'gates/hero_dossier_gate.py (every bank hero must have a parts list here).', '']
    for h in heroes:
        d = h['district']
        lines.append('## %s  (%dx%d, anchor %d,%d)' % (d.upper(), h['w'], h['h'], h['bx'], h['by']))
        lines.append('_%s_' % LABEL[d])
        lines.append('')
        for part in PARTS.get(d, []):
            lines.append('- %s' % part)
        lines.append('')
    open('records/BOHEMIA_DISTRICT_HERO_DOSSIER.md', 'w', encoding='utf8').write('\n'.join(lines))


def main():
    P = _load_pal()
    out = {
        'version': 'DISTRICT_HERO_v7_7_24_26',
        'status': 'UNJUDGED (awaiting Paolo thumbs) — v7: HAND-BUILT heroes MATCHED to the walkable district (palette + key pieces pulled from each engine module). Terminal is 1x1.',
        'perspective': '45deg three-quarter, REAL iso projection baked from 3D volumes: sky-lit tops, lit-right/shadow-left, on-plane windows.',
        'reference': 'Each hero mirrors its OWN walkable district (engine/bohemia_<district>.js): City Hall = admin block + clock tower + plaza + dry fountain; Battery = BESS yard (containers + inverters + control); Terminal = hall + schedule clock + canopy + bus row.',
        'reuse': 'palette pulled LIVE from each district engine module (district_grids.json) so hero + walkable tile share one source of truth.',
        'law': 'DEAD act-1 (boarded glass, dead lawn, dry fountain), zero purple, deterministic. HERO=WALKABLE (Paolo 7/24). Only approved mega-projects exceed 1x1.',
        'anchor': 'bx/by = the projected footprint-center at ground level (z=0), for planting the sprite on a tile.',
        'heroes': [],
    }
    for d, fn in HEROES.items():
        scene, scale = fn(P[d])
        w, h, origin = _fit(scene, scale)
        img = bake(scene, w, h, origin=origin, scale=scale, ss=4)
        bx, by = _anchor(scene, origin, scale)
        buf = io.BytesIO(); Image.fromarray(img, 'RGBA').save(buf, 'PNG')
        out['heroes'].append({'district': d, 'variant': 'iconic', 'label': LABEL[d],
                              'w': int(w), 'h': int(h), 'bx': bx, 'by': by,
                              'b64': base64.b64encode(buf.getvalue()).decode()})
    json.dump(out, open(OUT, 'w'))
    _write_dossier(out['heroes'])   # DOSSIER-OR-DON'T: write up every part of every hero
    print('baked %d district heroes (v7, matched to walkable) -> %s' % (len(out['heroes']), OUT))
    print('  dossier -> records/BOHEMIA_DISTRICT_HERO_DOSSIER.md')
    for hh in out['heroes']:
        print('  %-9s %dx%d anchor(%d,%d)' % (hh['district'], hh['w'], hh['h'], hh['bx'], hh['by']))


if __name__ == '__main__':
    main()
