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


# ---------------------------------------------------------------- CITY HALL
def build_cityhall(P):
    BUILD, CLOCK, PLAZA, FOUNT = P[2], P[6], P[7], P[8]
    DRIVE, LAWN, SEAL, FLAG, SIDE, POLE = P[1], P[4], P[10], P[12], P[11], P[9]
    ROOF = _dark(BUILD, 0.9)['c']
    # plaza forecourt (front-left) + a small visitor lot (front-right) off a driveway
    _ground(s := Scene(), (-3, -3, 15, 16),
            patches=[(-3, 8.5, 6.5, 15.5, PLAZA), (0.5, 0.5, 12.5, 8.0, SIDE)],
            lot=(8.0, 9.5, 15, 15.5), drive=(11.5, 15.5, 15, 16), groundc=LAWN, lotc=DRIVE)
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
    HALL, CANOPY, PLAT, BUS, CLOCK = P[2], P[6], P[7], P[10], P[12]
    DRIVE, LAWN, MARK, POLE, BENCH = P[1], P[4], P[11], P[9], P[8]
    ROOF = _dark(HALL, 0.9)['c']
    # lawn plot; the platform + a kiss-and-ride drive as the front vehicle surface
    _ground(s := Scene(), (-3, -3, 15, 15),
            patches=[(-2.5, 4.5, 13.5, 8.0, PLAT)],
            drive=(-3, 9.5, 13.5, 15), groundc=LAWN, lotc=DRIVE)
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
    # a ROW of dead BUSES nosed in at the bays under the canopy
    for bx in (0.4, 4.2, 8.0):
        s.box((bx, 5.2, 0), (3.2, 2.0, 2.1), {'top': _dark(BUS, 1.05), 'px': _dark(BUS, 1.0),
              'py': _dark(BUS, 0.85), 'nx': _dark(BUS), 'ny': _dark(BUS)})
        s.box((bx + 0.3, 5.1, 0.0), (2.6, 0.04, 0.06), {'c': MARK})        # bay-line stripe
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
    WARE, DOCK, OFFICE, GUARD, TRAILER, DRIVE = P[2], P[4], P[6], P[11], P[9], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), drive=(9.5, -3, 15, 15), groundc=(88, 86, 80), lotc=DRIVE)
    # one big distribution warehouse
    s.box((-2, -1, 0), (11, 8, 6.4), {'top': _dark(WARE, 0.9), 'px': _win(WARE, 6, 3, 4, 0.2),
          'py': _dark(WARE, 0.96), 'nx': _dark(WARE), 'ny': _dark(WARE)})
    for dy in (0.2, 1.6, 3.0, 4.4, 5.8):                                    # a row of dock doors on the front
        s.box((9.0, dy, 0), (0.16, 1.0, 2.2), {'c': DOCK})
    for ty in (0.4, 3.0, 5.6):                                             # parked trailers in the truck court
        s.box((10.6, ty, 0), (3.8, 1.8, 1.9), {'top': _dark(TRAILER, 1.05), 'px': _dark(TRAILER),
              'py': _dark(TRAILER, 0.85), 'nx': _dark(TRAILER), 'ny': _dark(TRAILER)})
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
    return s, 6.6


# ---------------------------------------------------------------- MALL
def build_mall(P):
    CONC, ANCHOR, FOOD, CAR, DRIVE, LOT = P[2], P[6], P[7], P[10], P[1], P[4]
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
    for cx in (2.0, 6.5, 10.0):                                                         # abandoned cars in the lot
        s.box((cx, 12.5, 0), (1.7, 0.9, 0.7), {'c': CAR})
    return s, 6.4


# ---------------------------------------------------------------- PARK
def build_park(P):
    SHELTER, TURF, PATH, CAR = P[2], P[6], P[4], P[11]
    BENCH, WATER, LOT = P[8], P[9], P[1]
    s = Scene()
    # a park is OPEN: mostly dead turf + a winding path, a small shelter, a lot at the edge
    _ground(s, (-3, -3, 15, 15), patches=[(-2, -2, 14, 14, TURF)], lot=(9.5, 10.5, 15, 15), groundc=TURF, lotc=LOT)
    # winding path (a couple light bands)
    s.box((-2, 3.0, 0.01), (13, 1.1, 0.05), {'c': PATH})
    s.box((5.0, 3.0, 0.01), (1.1, 9.0, 0.05), {'c': PATH})
    # the small SHELTER / restroom building (the only structure)
    s.box((0.5, 0.5, 0), (3.6, 3.0, 2.8), {'top': _dark(SHELTER, 0.9), 'px': _win(SHELTER, 2, 2, 4),
          'py': _dark(SHELTER, 0.9), 'nx': _dark(SHELTER), 'ny': _dark(SHELTER)})
    _door(s, 4.1, 1.4, 2.4, 1.9, doorc=_dark(SHELTER, 0.4)['c'], framec=tuple(min(255, int(c * 1.15)) for c in SHELTER))
    # a dead shade tree + a couple benches (dead world: bare trunk)
    s.box((9.0, 5.5, 0), (0.5, 0.5, 3.0), {'c': (70, 60, 48)})
    for (bx, by) in [(2.0, 6.5), (7.5, 8.0)]:
        s.box((bx, by, 0), (1.6, 0.4, 0.4), {'c': BENCH})
    return s, 6.6


# ---------------------------------------------------------------- WAREHOUSE (flex/tenant units)
def build_warehouse(P):
    UNIT, OFFICE, BURN, FENCE, CAR, DRIVE = P[2], P[7], P[8], P[12], P[10], P[1]
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
    return s, 6.6


HEROES = {'cityhall': build_cityhall, 'battery': build_battery, 'terminal': build_terminal,
          'downtown': build_downtown, 'industrial': build_industrial, 'medical': build_medical,
          'mall': build_mall, 'park': build_park, 'warehouse': build_warehouse}
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
}


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
    print('baked %d district heroes (v7, matched to walkable) -> %s' % (len(out['heroes']), OUT))
    for hh in out['heroes']:
        print('  %-9s %dx%d anchor(%d,%d)' % (hh['district'], hh['w'], hh['h'], hh['bx'], hh['by']))


if __name__ == '__main__':
    main()
