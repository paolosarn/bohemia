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
import tempfile

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bohemia_iso3d import Scene, bake

OUT = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
# SCRATCH was hard-coded to one session's private directory, which does not exist in
# any other session — so this factory could not be run again by anybody, and the
# palette dump it depends on died with check=True before the first hero was built.
# Session-portable now: honour BOHEMIA_SCRATCH if it is set, else the system temp dir.
SCRATCH = os.environ.get('BOHEMIA_SCRATCH') or tempfile.gettempdir()
GRIDS = os.path.join(SCRATCH, 'bohemia_district_grids.json')


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
    """The pad the building stands on — DEFERRED, and it no longer draws parking.

    Paolo, 8/2: "if we from all the icons, we remove all the parking lots cause I honestly
    I'm not really fucking with that anymore. I just really want the main building to be
    biggest as fuck... it just needs to like fill up the square."

    Two rulings in one, and they are the same ruling twice: THE BUILDING IS THE ICON.

      NO PARKING. `lot` and `drive` are accepted and IGNORED. Every icon was spending a
      third of its square on asphalt, which at map zoom is a grey smear that tells you
      nothing about what the building is. All 28 lost it in one edit here rather than 28.

      THE PAD IS FITTED TO THE BUILDING, NOT DECLARED BY HAND. Every builder passed a plot
      rectangle it guessed at -- usually (-3,-3,15,15) whatever it actually built -- so the
      sprite framed on the GUESS and the building sat small in the middle of it. The
      request is recorded now and the pad is drawn AFTER the scene exists, hugging the real
      footprint. That is the same fix as the doors and the window grid, a third time: A
      VALUE PASSED BY HAND WHERE A VALUE COULD BE DERIVED.

    THE VIBE IS A CITY BUILDER, NOT A SURVEY (Paolo, same note): "the city builder vibe is
    supposed to be more of a visual than it being 100% realistic." It still matches the
    walkable district -- same palette, same parts -- but it is a PORTRAIT of the building,
    framed like one.
    """
    s._ground_req = {'patches': list(patches or []), 'groundc': groundc, 'lotc': lotc}


def _draw_ground(s, pad=1.6):
    """Draw the deferred pad, fitted to what the scene actually contains."""
    req = getattr(s, '_ground_req', None)
    if req is None:
        return
    solids = [q for q in s.solids if q[5] >= 0.5]
    if not solids:
        solids = s.solids
    if not solids:
        return
    x0 = min(q[0] for q in solids) - pad
    y0 = min(q[1] for q in solids) - pad
    x1 = max(q[0] + q[3] for q in solids) + pad
    y1 = max(q[1] + q[4] for q in solids) + pad
    g = req['groundc']
    gt = tuple(min(255, int(c * 1.12)) for c in g)
    faces_before = list(s.faces)
    s.faces = []
    s.box((x0, y0, -0.5), (x1 - x0, y1 - y0, 0.55),
          {'top': {'c': gt}, 'px': {'c': g}, 'py': {'c': g}, 'nx': {'c': g}, 'ny': {'c': g}})
    for (px0, py0, px1, py1, col) in req['patches']:
        ax0, ay0 = max(px0, x0), max(py0, y0)
        ax1, ay1 = min(px1, x1), min(py1, y1)
        if ax1 > ax0 and ay1 > ay0:
            s.box((ax0, ay0, 0.0), (ax1 - ax0, ay1 - ay0, 0.06), {'c': col})
    s.faces = s.faces + faces_before


def _door_face(s, org, size, width=2.0, ztop=3.0, doorc=(30, 33, 40),
               framec=(158, 162, 168), awn=None, at_y=None):
    """A door placed ON A REAL FACE, because the face is READ OFF THE SOLID.

    Paolo, 8/2, scoring the four civics down: "doors aren't where they're supposed to."

    He was right on three of the four. `_door` takes a bare x and a bare y-range and
    draws a quad there, and NOTHING checked that a wall was actually behind it. The city
    hall's door ran off the end of its own block, the courthouse's floated a fifth of a
    tile clear of the rotunda, and both looked exactly like what they were: a door
    hanging in the air beside a building.

    This is the same class of bug as the ones that keep coming back -- a value passed by
    hand where a value could be DERIVED. So it is derived now: hand it the box (its
    origin and size, the same two tuples you gave Scene.box) and it computes the +x face
    plane itself and centres the leaf in the box's own y-span. A door placed this way
    CANNOT be off its wall, and gates/round_and_doors_gate.py fails the bake if any hero
    puts a door where no solid stands.
    """
    x, y, _z = org
    dx, dy, _dz = size
    at = x + dx
    cy = (y + dy / 2.0) if at_y is None else at_y
    half = min(width, dy) / 2.0
    _door(s, at, cy - half, cy + half, ztop, doorc=doorc, framec=framec, awn=awn)


def _door(s, at, lo, hi, ztop, doorc=(30, 33, 40), framec=(158, 162, 168), awn=None):
    """A visible ENTRANCE DOOR at GROUND on a building's +x front face at x=at.
    PREFER _door_face: it derives `at` and the leaf span from the solid, so the door
    cannot end up off the wall (Paolo 8/2, "doors aren't where they're supposed to")."""
    # recorded so gates/round_and_doors_gate.py can check every door against a real wall
    if not hasattr(s, 'doors'):
        s.doors = []
    s.doors.append((at, lo, hi, ztop))
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
    """engine/bohemia_cityhall.js — REBUILT 8/2 with the district, on LAS VEGAS CITY HALL
    (Elkus Manfredi, 2012). The old icon carried a CLOCK TOWER, which is a New England town
    hall, and it drew palette codes the rebuilt district no longer has. What this building is
    recognised by is the SOLAR TREE FARM in its plaza and the two shapes that merge behind it:
    the curvilinear council chamber and the angular glass office block, under a canopy on a
    single 160-foot column.

    REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no new graphic pixels of its own — it
    composes the district's OWN palette through the shared iso primitives in
    tools/bohemia_iso3d.py, the same way every other hero here does. No bank was opened
    because none applies: there is no iso hero-building sprite bank in the repo."""
    BLD, PANEL, PLAZA, MAST = P[2], P[6], P[7], P[10]
    GLASS, PIER, CHROOF, DECK = P[11], P[15], P[17], P[24]
    CANOPY = PIER                      # the canopy is gone (Paolo 8/2); the piers took its palette slot
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-3, 4.0, 15, 15, PLAZA)],
            lot=(9.5, -3, 15, 3.5), drive=(9.5, 3.5, 13.5, 6.0),
            groundc=(122, 116, 100), lotc=(58, 58, 66))

    # THE ANGULAR OFFICE BLOCK: seven storeys, stepped, glass.
    # SEVEN STOREYS, which is what the real one is and what stops this reading as the same
    # low bar-plus-drum as the transit centre once both lost their overhead (squint gate,
    # 8/2). Height is the cheapest silhouette there is.
    s.box((-1.5, -2.0, 0), (11.5, 5.6, 16.0), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 8, 8, 5),
          'py': _win(BLD, 4, 8, 11), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    s.box((-1.5, -2.0, 16.0), (11.5, 5.6, 0.45), {'c': CHROOF})
    for i in range(4):                                                   # the roof plant line
        s.box((-0.6 + i * 2.8, -1.2, 16.45), (1.7, 1.7, 0.8), {'c': _dark(BLD, 0.72)['c']})

    # THE CURVILINEAR COUNCIL CHAMBER, merged into it (they meet in the lobby).
    s.prism(4.2, 4.6, 0, 3.6, 7.4, 18, {'c': BLD}, {'c': CHROOF})
    s.prism(4.2, 4.6, 7.4, 1.3, 0.7, 18, {'c': GLASS})

    # THE ENTRY CANOPY on ONE column. The whole point of it: no other supports.
    # A CANOPY PROJECTS OFF A BUILDING, IT DOES NOT TUNNEL THROUGH ONE. This started at
    # y=6.6 and ran straight through the council chamber (y 1.1..7.3), which at icon size
    # reads as a slab slicing the building in half -- glitchy, exactly as he said.
    # NO CANOPY (Paolo 8/2: "new rule no more canopies I only see canopies at parks and
    # shit"). The blade and its mast are gone. A civic entrance without one is STEPS and a
    # row of PIERS, which is what the district's own plot draws now.
    for st in range(3):
        s.box((4.6 - st * 0.5, 5.6 + st * 0.55, 0), (7.2 + st, 0.55, 0.5 - st * 0.14),
              {'c': _dark(CANOPY, 0.94 + st * 0.06)['c']})
    for pi in range(5):
        s.box((5.0 + pi * 1.5, 4.6, 0), (0.55, 0.55, 3.4), {'c': _dark(CANOPY, 1.06)['c']})

    _door_face(s, (-1.5, -2.0, 0), (11.5, 5.6, 16.0), width=2.2, ztop=3.4,
               doorc=_dark(BLD, 0.4)['c'], framec=tuple(min(255, int(c * 1.2)) for c in BLD))

    # THE SOLAR TREE FARM. A grid of masts under panels: the thing you know it by.
    # THE ARRAY IS A GARNISH, NOT HALF THE PICTURE. It used to run twelve units wide at the
    # front and the building had to share the square with it. Paolo 8/2: "I just really want
    # the main building to be biggest as fuck... it just needs to like fill up the square."
    for ty in (9.2, 10.9, 12.6):
        for tx in (-0.6, 1.1, 2.8):
            s.box((tx - 0.13, ty - 0.13, 0), (0.26, 0.26, 1.9), {'c': MAST})
            s.box((tx - 0.7, ty - 0.6, 1.9), (1.4, 1.2, 0.18), {'top': {'c': PANEL},
                  'px': _dark(PANEL, 0.8), 'py': _dark(PANEL, 0.8),
                  'nx': _dark(PANEL, 0.8), 'ny': _dark(PANEL, 0.8)})

    # THE PARKING DECK, attached on the east, its floor lighter because the sun never got in.
    s.box((11.6, -2.0, 0), (4.0, 6.0, 4.4), {'top': {'c': DECK}, 'px': _dark(DECK, 1.25),
          'py': _dark(DECK, 1.1), 'nx': _dark(DECK), 'ny': _dark(DECK)})
    for dy in (-1.2, 0.6, 2.4):
        s.box((11.8, dy, 4.4), (3.6, 0.25, 0.5), {'c': _dark(BLD, 1.05)['c']})   # spandrel rail
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
    s.box((-1.5, -1.5, 0), (5.2, 4.8, 6.4), {'top': {'c': ROOF}, 'px': _win(CTRL, 4, 4, 5, 0.22),
          'py': _win(CTRL, 3, 3, 9, 0.22), 'nx': _dark(CTRL), 'ny': _dark(CTRL)})
    _door(s, 3.5, -0.6, 0.8, 2.6, doorc=_dark(CTRL, 0.5)['c'], framec=tuple(min(255, int(c * 1.15)) for c in CTRL))
    s.box((-1.5, 3.1, 0.5), (5.0, 0.35, 0.7), {'c': HAZ})                   # hazard apron marking
    # rows of BATTERY CONTAINERS (the hero) — Megapack-style enclosures, HVAC on the end
    for r, ry in enumerate((1.5, 5.3, 9.1)):
        s.box((5.5, ry, 0), (8.4, 2.6, 4.6), {'top': _dark(CONT, 1.05), 'px': _dark(CONT, 1.0),
              'py': _dark(CONT, 0.86), 'nx': _dark(CONT), 'ny': _dark(CONT)})
        for cx in range(1, 5):                                             # module seams read as a rack
            s.box((5.5 + cx * 1.7, ry - 0.02, 0.2), (0.12, 0.05, 4.1), _dark(CONT, 0.7))
        s.box((14.0, ry + 0.4, 0), (1.2, 1.7, 3.6), {'c': HVAC})           # HVAC/thermal unit on the end
    # the INVERTER / TRANSFORMER rack tying the array into the grid (taller mass, front-right)
    s.box((5.7, 12.4, 0), (6.4, 2.4, 7.2), {'top': _dark(INV, 0.9), 'px': _dark(INV, 1.0),
          'py': _dark(INV, 0.86), 'nx': _dark(INV), 'ny': _dark(INV)})
    for ix in (7.0, 9.0, 11.0):
        s.box((ix - 0.12, 12.3, 7.2), (0.24, 0.24, 0.9), {'c': tuple(min(255, int(c * 1.2)) for c in INV)})  # bushings read
    s.box((5.7, 12.0, 0.5), (6.0, 0.3, 0.7), {'c': HAZ})                    # hazard band
    # perimeter FENCE posts around the yard + a couple pole lights
    for (fx, fy) in [(-2.5, -2.5), (14.5, -2.5), (14.5, 15.0), (-2.5, 15.0)]:
        s.box((fx - 0.1, fy - 0.1, 0), (0.2, 0.2, 2.2), {'c': FENCE})
    for (lx, ly) in [(4.6, 7.0), (14.6, 7.0)]:
        s.box((lx - 0.08, ly - 0.08, 0), (0.16, 0.16, 2.6), {'c': POLE})
    return s, 7.0


# ---------------------------------------------------------------- TERMINAL (1x1)
def build_terminal(P):
    """engine/bohemia_terminal.js — REBUILT 8/2 with the district, on the BONNEVILLE TRANSIT
    CENTER (2010, downtown Las Vegas): a CURVED two-storey head house, a boarding platform
    under a PHOTOVOLTAIC SHADE STRUCTURE, sawtooth bus bays, and a bank of double-stacked
    bike racks. The old icon had a schedule-board CLOCK TOWER and a flat grey canopy, which
    is an intercity coach station in Ohio, not a LEED Platinum transit centre in the Mojave.

    REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no new graphic pixels of its own — it
    composes the district's OWN palette through the shared iso primitives in
    tools/bohemia_iso3d.py. No bank applies: there is no iso hero-building sprite bank."""
    HALL, PANEL, PLAT, BUSC = P[2], P[6], P[13], P[15]
    GLASS, POST, RACK, MARK, DRIVE = P[11], P[10], P[12], P[20], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-3, 3.0, 15, 7.0, PLAT)],
            drive=(-3, 7.0, 15, 15), groundc=(112, 108, 100), lotc=DRIVE)

    # THE HEAD HOUSE: a bar with a CURVED concourse bulging south out of it.
    s.box((-2.0, -2.0, 0), (13.0, 5.0, 10.4), {'top': _dark(HALL, 0.9), 'px': _win(HALL, 9, 4, 4),
          'py': _win(HALL, 5, 4, 8), 'nx': _dark(HALL), 'ny': _dark(HALL)})
    s.prism(4.5, 3.0, 0, 4.0, 8.4, 18, {'c': HALL}, {'c': _dark(HALL, 0.88)['c']})
    for i in range(8):                                                   # the glazed south wall
        s.box((-1.4 + i * 1.6, 2.9, 0.8), (1.1, 0.08, 5.6), {'c': GLASS})
    _door_face(s, (-2.0, -2.0, 0), (13.0, 5.0, 10.4), width=2.4, ztop=3.0,
               doorc=_dark(HALL, 0.4)['c'], framec=tuple(min(255, int(c * 1.18)) for c in HALL))

    # NO CANOPY (Paolo 8/2: "new rule no more canopies I only see canopies at parks and
    # shit"). The photovoltaic array used to stand over the platform on posts, which is a
    # shade structure however the legend labelled it. It is ON THE ROOF now -- which is
    # where a roof-mounted array belongs, keeps the building's real signature, and leaves
    # nothing on this icon that a person walks under.
    for r_ in range(3):
        for c_ in range(5):
            s.box((-1.4 + c_ * 2.3, -1.6 + r_ * 1.4, 10.4), (1.9, 1.1, 0.2),
                  {'top': {'c': PANEL}, 'px': _dark(PANEL, 0.8), 'py': _dark(PANEL, 0.8),
                   'nx': _dark(PANEL, 0.8), 'ny': _dark(PANEL, 0.8)})
            s.box((-1.4 + c_ * 2.3, -1.6 + r_ * 1.4, 10.4), (0.12, 1.1, 0.12), {'c': POST})

    # THE SAWTOOTH BAYS, STEPPED against each other, with buses still nosed into them.
    for i, bx in enumerate((-1.2, 2.2, 5.6, 9.0)):
        step = 0.0 if i % 2 == 0 else 0.5
        s.box((bx - 0.06, 4.4 + step, 0.0), (0.05, 3.2, 0.06), {'c': MARK})
        s.box((bx + 2.6, 4.4 + step, 0.0), (0.05, 3.2, 0.06), {'c': MARK})
        _vehicle(s, bx + 0.6, 4.6 + step, BUS, BUSC, along='y')

    # THE BIKE RACKS: double-stacked, in a bank beside the doors.
    for ry in (0.0, 1.3, 2.6):
        for rx in (11.4, 12.4):
            s.box((rx, ry, 0), (0.5, 0.9, 0.55), {'c': RACK})
            s.box((rx + 0.05, ry + 0.1, 0.55), (0.4, 0.7, 0.45), {'c': _dark(RACK, 0.8)['c']})
    return s, 7.2


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
    _door_face(s, (-2, -1, 0), (9, 7, 9.0), width=1.8, ztop=2.7,
               doorc=_dark(BLD, 0.4)['c'], framec=tuple(min(255, int(c * 1.2)) for c in BLD))
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
    _door_face(s, (-1, 1.5, 0), (13, 4.5, 5.0), width=1.6, ztop=2.6,
               doorc=_dark(CONC, 0.4)['c'], framec=tuple(min(255, int(c * 1.25)) for c in CONC))
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
    for (cx_, cy_) in ((7.2, 7.6), (10.4, 7.6), (7.2, 10.4), (10.4, 10.4)):
        s.box((cx_ - 0.13, cy_ - 0.13, 0), (0.26, 0.26, 2.6), {'c': _dark(SHELTER, 1.1)['c']})
    s.box((6.6, 7.0, 2.6), (4.4, 4.0, 0.3), {'top': _dark(SHELTER, 1.15),
          'px': _dark(SHELTER, 0.8), 'py': _dark(SHELTER, 0.8),
          'nx': _dark(SHELTER, 0.8), 'ny': _dark(SHELTER, 0.8)})   # THE PICNIC SHELTER
    s.box((0.5, 0.5, 0), (3.8, 3.2, 3.4), {'top': _dark(SHELTER, 0.9), 'px': _win(SHELTER, 2, 2, 4),
          'py': _dark(SHELTER, 0.9), 'nx': _dark(SHELTER), 'ny': _dark(SHELTER)})
    _door(s, 4.1, 1.4, 2.4, 1.9, doorc=_dark(SHELTER, 0.4)['c'], framec=tuple(min(255, int(c * 1.15)) for c in SHELTER))
    # a dead shade tree + benches + a car at the lot (canon CAR size)
    # A PARK'S SILHOUETTE IS ITS TREES. Light masts made it a twin of the speedway; a stand
    # of big dead crowns is a shape nothing else in the valley has.
    for (tx_, ty_, th_) in ((-1.4, 8.6, 6.4), (2.6, 7.4, 7.8), (0.4, 12.0, 5.6), (4.4, 11.4, 6.8)):
        s.box((tx_ - 0.2, ty_ - 0.2, 0), (0.4, 0.4, th_), {'c': (74, 66, 52)})
        s.box((tx_ - 1.3, ty_ - 1.1, th_), (2.6, 2.2, 1.5), {'c': (86, 78, 60)})
        s.box((tx_ - 0.8, ty_ - 0.7, th_ + 1.5), (1.6, 1.4, 0.9), {'c': (96, 88, 68)})
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
    s.box((9.5, -1.0, 0), (3.6, 3.2, 7.2), {'top': _dark(OFFICE, 0.9), 'px': _win(OFFICE, 3, 4, 6),
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
    s.box((12.2, 5.6, 0), (0.5, 0.5, 8.4), {'c': _dark(STORE, 1.12)['c']})      # the PYLON mast
    s.box((11.4, 5.2, 8.4), (2.0, 1.2, 2.4), {'c': DOOR})                       # its blank sign face
    _door_face(s, (-2, -1, 0), (13, 3.6, 4.8), width=1.6, ztop=2.4,
               doorc=_dark(GLASS, 0.7)['c'], framec=tuple(min(255, int(c * 1.2)) for c in STORE))
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
    """engine/bohemia_school.js — a HIGH SCHOOL (Paolo ruled it 7/28). THE STADIUM IS THE
    SIGNATURE and it must be in the icon, because it is the one shape nothing else in the
    valley makes: an obround running track with a rectangle inside it, bleachers down both
    sides, four light towers over the lot. A school icon that is just a building block is
    every other civic building; the track is what makes it a high school at one tile.

    The old icon was a generic E-shaped block plus a bus. It read as 'a school-ish
    building' and nothing more, and it is one of the 32 he rejected."""
    BLD, GYM, SHOP, YARD, FIELD = P[2], P[14], P[20], P[8], P[6]
    TRACK, MARK, BLEACH, TOWER, CARC, DRIVE = P[7], P[10], P[9], P[12], P[17], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), lot=(-3, 11.5, 15, 15), groundc=(96, 100, 78), lotc=(52, 52, 60))

    # THE STADIUM, front and centre: an OBROUND track (two straights, two round ends)
    cx, cy, SL, RO, RI = 6.0, 7.4, 2.9, 2.7, 1.7
    step = 0.30
    iy = -RO - step
    while iy <= RO + step:
        ix = -SL - RO - step
        while ix <= SL + RO + step:
            ax, ay = abs(ix), abs(iy)
            d_out = ay if ax <= SL else math.hypot(ax - SL, ay)
            if d_out <= RO:
                inside = ay <= RI if ax <= SL else math.hypot(ax - SL, ay) <= RI
                s.box((cx + ix, cy + iy, 0.0), (step * 1.08, step * 1.08, 0.07),
                      {'c': FIELD if (inside and ax <= SL) else (TRACK if not inside else FIELD)})
            ix += step
        iy += step
    for i in range(7):                                                    # the yard lines
        lx = -SL + 0.2 + i * (2 * SL - 0.4) / 6.0
        s.box((cx + lx, cy - RI + 0.2, 0.08), (0.09, 2 * RI - 0.4, 0.04), {'c': MARK})

    # RAKED BLEACHERS down both sidelines, and the press box on the home side
    # THREE THIN STEPS READ AS A FLOATING STAIRCASE at icon size, not as stands. Two
    # deeper banks with a raked top read as a mass, which is what a bleacher is. The far
    # side is kept LOWER so it does not fight the school building behind it.
    for sgn, tall in ((1, 1.0), (-1, 0.62)):
        for i, (dy, hgt) in enumerate(((0.0, 0.42), (0.55, 0.78))):
            s.box((cx - SL - 0.4 + i * 0.3, cy + sgn * (RO + 0.5 + dy) - 0.28, 0),
                  (2 * SL + 0.8 - i * 0.6, 0.56, hgt * tall),
                  {'top': _dark(BLEACH, 1.2), 'px': _win(BLEACH, 12, 1, 3 + i, 0.0),
                   'py': _dark(BLEACH, 0.82), 'nx': _dark(BLEACH, 0.78), 'ny': _dark(BLEACH, 0.78)})

    # FOUR LIGHT TOWERS — Friday night lights, the tallest things on the site
    # PAOLO 7/29: "the light towers are far away from the field which is weird and they
    # are tall asf". Both true. Real stadium lights stand just outside the track at the
    # corners of the bowl and they are tall RELATIVE TO THE STANDS, not to the sky --
    # 5.2 units put them at nearly the height of the academic building's whole mass.
    for (lx, ly) in [(cx - SL - 0.9, cy - RO - 0.5), (cx + SL + 0.9, cy - RO - 0.5),
                     (cx - SL - 0.9, cy + RO + 0.5), (cx + SL + 0.9, cy + RO + 0.5)]:
        s.box((lx - 0.16, ly - 0.16, 0), (0.32, 0.32, 8.2), {'c': TOWER})
        s.box((lx - 0.42, ly - 0.42, 3.1), (0.84, 0.84, 0.34),
              {'c': tuple(min(255, int(c * 1.15)) for c in TOWER)})

    # THE ACADEMIC SPINE behind it, two storeys, and the GYM in school colours
    # PAOLO 7/29: "have more school building incorporated" -- the icon was mostly stadium
    # with a thin strip of school behind it. The building now runs the full width, gains a
    # real second storey step-back and TWO wings that come forward, so the mass reads as a
    # school with a stadium rather than a stadium with a wall behind it.
    s.box((-2.6, -3.4, 0), (13.2, 2.8, 4.4), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 9, 2, 4),
          'py': _win(BLD, 8, 2, 8), 'nx': _dark(BLD), 'ny': _dark(BLD)})          # the spine
    s.box((3.2, -3.4, 0), (2.6, 2.8, 9.6), {'top': _dark(BLD, 0.86), 'px': _win(BLD, 2, 6, 21),
          'py': _win(BLD, 2, 6, 24), 'nx': _dark(BLD), 'ny': _dark(BLD)})       # the stair core
    s.box((-1.2, -3.2, 4.4), (10.4, 2.4, 1.5), {'top': _dark(BLD, 1.0), 'px': _win(BLD, 8, 1, 5),
          'py': _dark(BLD, 0.86), 'nx': _dark(BLD), 'ny': _dark(BLD)})            # second storey
    for wy in (-3.4, 0.2):                                                        # wings forward
        s.box((-2.6, wy, 0), (2.8, 3.6, 4.2), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 2, 2, 6),
              'py': _win(BLD, 3, 2, 9), 'nx': _dark(BLD), 'ny': _dark(BLD)})
        s.box((9.4, wy, 0), (2.6, 3.6, 4.2), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 2, 2, 7),
              'py': _win(BLD, 3, 2, 3), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    s.box((12.4, -1.4, 0), (3.8, 4.0, 8.4), {'top': _dark(GYM, 0.95), 'px': _dark(GYM, 1.05),
          'py': _dark(GYM, 0.85), 'nx': _dark(GYM), 'ny': _dark(GYM)})            # the gym, teal
    # PAOLO 7/29: "have another entryway to the school". A building this long with one
    # door is wrong anyway -- a real high school has a main entrance AND a separate
    # athletics entrance, and each one is a way the player gets inside.
    _door_face(s, (-2.6, 0.2, 0), (2.8, 3.6, 4.2), width=1.5, ztop=2.4,
               doorc=_dark(BLD, 0.4)['c'],
               framec=tuple(min(255, int(c * 1.25)) for c in BLD))                # main doors
    _door_face(s, (12.4, -1.4, 0), (3.8, 4.0, 8.4), width=1.4, ztop=2.2,
               doorc=_dark(GYM, 0.4)['c'],
               framec=tuple(min(255, int(c * 1.25)) for c in GYM))                # gym doors
    # THE AUTO SHOP, east of the gym. PAOLO 7/30: "Remove the tennis courts make do what
    # you want." A flat court slab contributed nothing to the silhouette -- it was ground
    # paint. The shop is a real volume with a SAWTOOTH ROOF, which is the one roof shape
    # that says workshop at any size, and it puts the only industrial mass on a civic icon.
    s.box((11.6, 2.2, 0), (4.6, 2.8, 0.05), {'c': YARD})                         # the oiled yard
    s.box((12.2, 2.5, 0), (3.6, 2.0, 2.3), {'top': _dark(SHOP, 0.9), 'px': _win(SHOP, 3, 1, 11),
          'py': _dark(SHOP, 0.86), 'nx': _dark(SHOP), 'ny': _dark(SHOP)})
    for i in range(3):                                                            # north-light monitors
        s.box((12.4 + i * 1.15, 2.6, 2.3), (0.62, 1.8, 0.42),
              {'top': {'c': tuple(min(255, int(c * 1.3)) for c in SHOP)}, 'px': _dark(SHOP, 1.1),
               'py': _dark(SHOP, 0.8), 'nx': _dark(SHOP, 0.9), 'ny': _dark(SHOP, 0.9)})
    _door(s, 15.8, 2.9, 4.1, 1.5, doorc=_dark(SHOP, 0.35)['c'],                   # the roll-up bay
          framec=tuple(min(255, int(c * 1.3)) for c in SHOP))
    _vehicle(s, 11.9, 3.4, CAR, CARC, along='x')                                  # a wreck in the yard

    # THE STUDENT LOT — the tell. High schoolers drive, and nobody came back for these.
    for i in range(4):
        _vehicle(s, -1.0 + i * 3.4, 12.6, CAR, CARC, along='x')
    return s, 4.6                      # PAOLO 7/29: "its a little biggy" -- scaled down


# ---------------------------------------------------------------- COURTHOUSE
def build_courthouse(P):
    """engine/bohemia_courthouse.js — REBUILT 8/2 with the district, on the LLOYD D. GEORGE
    U.S. COURTHOUSE (CannonDesign, 2000): an L-SHAPED building wrapping a plaza, a ROTUNDA at
    the elbow under a sixty-foot glass dome, a canopy PROJECTING from the top of the building
    with no columns under it, and a bollard line holding the blast standoff. The old icon was
    a portico of columns and a cupola — a county courthouse in Ohio.

    REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no new graphic pixels of its own — it
    composes the district's OWN palette through the shared iso primitives in
    tools/bohemia_iso3d.py. No bank applies: there is no iso hero-building sprite bank."""
    BLD, JOINT, PLAZA, GLASS = P[2], P[6], P[7], P[11]
    BOLL, DOME, WALL, DRIVE = P[15], P[17], P[20], P[1]
    CANOPY = BOLL                      # the canopy is gone (Paolo 8/2); piers use the bollard tone
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(3.0, 3.0, 15, 12.0, PLAZA)],
            lot=(-3, 12.0, 15, 15), drive=(9.0, 10.0, 12.5, 15),
            groundc=(118, 112, 98), lotc=(58, 58, 66))

    # THE L: the north leg east-west, the west leg north-south. One building.
    s.box((-2.0, -2.0, 0), (14.0, 5.0, 13.0), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 10, 6, 4),
          'py': _win(BLD, 4, 6, 9), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    s.box((-2.0, 3.0, 0), (5.0, 8.0, 13.0), {'top': _dark(BLD, 0.88), 'px': _win(BLD, 4, 6, 12),
          'py': _win(BLD, 6, 6, 15), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    for i in range(6):                                                   # the precast panel joints
        s.box((-1.4 + i * 2.3, -2.05, 0.4), (0.14, 0.06, 12.2), {'c': JOINT})

    # THE ROTUNDA at the elbow, under the ring of what is left of the glass dome.
    s.prism(3.6, 4.4, 0, 3.4, 14.2, 20, {'c': BLD}, {'c': DOME})
    s.prism(3.6, 4.4, 14.2, 2.3, 0.9, 20, {'c': DOME}, {'c': GLASS})
    s.prism(3.6, 4.4, 15.1, 0.8, 0.7, 20, {'c': GLASS})

    # THE PROJECTING CANOPY. It cantilevers off the top of the building: NO columns.
    # It CANTILEVERS off the building and reaches over the plaza. It must not cross the
    # rotunda in plan (y 1.1..6.9) or it reads as a slab cutting the icon in half.
    # NO CANOPY (Paolo 8/2). The cantilever is gone; a federal entrance without one is a
    # broad flight of STEPS and the PIERS that carry the wall above them.
    for st in range(3):
        s.box((3.6 - st * 0.45, 4.4 + st * 0.5, 0), (6.4 + st * 0.9, 0.5, 0.55 - st * 0.15),
              {'c': _dark(CANOPY, 0.96 + st * 0.05)['c']})
    for pi in range(4):
        s.box((4.2 + pi * 1.6, 3.6, 0), (0.6, 0.6, 4.2), {'c': _dark(CANOPY, 1.08)['c']})

    _door_face(s, (-2.0, 3.0, 0), (5.0, 8.0, 13.0), width=1.8, ztop=3.4,
               doorc=_dark(BLD, 0.4)['c'],
               framec=tuple(min(255, int(c * 1.2)) for c in BLD))

    # THE BOLLARD LINE: standoff distance, held, and the reason the setback is empty.
    for bx in (-2.0, 0.4, 2.8, 5.2, 7.6, 10.0, 12.4):
        s.box((bx - 0.17, 11.4, 0), (0.34, 0.34, 1.0), {'c': BOLL})
    # THE SECURE YARD wall on the west, with a staff car still behind it.
    s.box((-2.6, 11.2, 0), (9.0, 0.35, 2.4), {'c': WALL})
    return s, 6.8


# ---------------------------------------------------------------- LIBRARY
def build_library(P):
    """engine/bohemia_library.js — REBUILT 8/2 to match the district, which was itself
    rebuilt on the real reference: Antoine Predock's LAS VEGAS LIBRARY AND LIED DISCOVERY
    MUSEUM (1986-90, Las Vegas Blvd, across from Cashman Field). What everybody remembers
    is the geometry -- the CONES and the giant concrete TOWER -- in sandstone, because in
    Predock's own words "the color scheme is provided by the desert."

    IT IS ONE BUILDING. Paolo scored the first rebuild 22%: "there's like six different
    buildings of the library, what's up with that?" He was right, and it was a thinking
    error -- I read the 7/30 "no building is a flat rectangle" law as "make several
    buildings", which is a different thing. Predock's is a single continuous composition:
    a drum, a tower and two wings that all share walls. So does this icon -- every mass
    overlaps the reading-wing spine.

    The icon before that was a reading-room block behind a classical COLONNADE, which is a library
    from a different country and a different century, and it drew palette code 6 -- a code
    the rebuilt district no longer has, so the factory threw KeyError: 6 and the icon bank
    could not be rebuilt at all. gates/tools_run_gate.py caught that; nothing else would
    have, because every other gate reads the pre-baked bank instead of running the factory.

    REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no new graphic pixels of its own -- it
    composes the district's OWN palette through the shared iso primitives in
    tools/bohemia_iso3d.py, the same way every other hero here does. No bank was opened
    because none applies: there is no iso hero-building sprite bank in the repo."""
    BLD, OCULUS, CLERE, PLAZA, TERRACE, PLANT, DRIVE = P[2], P[14], P[11], P[7], P[13], P[10], P[1]
    s = Scene()
    # MORE PARKING (Paolo 8/2, approving at 85%: "the icon could have more parking").
    # The lot now runs the full width of the plot in front of the building the way the
    # district's own does, with a drive apron off the street and cars left in it.
    _ground(s, (-3, -3, 15, 15), patches=[(-3, -3, 15, 10.0, PLAZA)], lot=(-3, 10.0, 15, 15),
            drive=(4.5, 8.5, 8.0, 15), groundc=(122, 116, 100), lotc=(58, 58, 66))
    s.box((-1.5, -1.5, 0), (13, 11, 1.2), {'c': _dark(TERRACE, 1.0)['c']})        # the terrace

    # ONE BUILDING (Paolo 8/2: "there's like six different buildings of the library").
    # Every mass below OVERLAPS the reading wing, so the icon is one continuous
    # composition whose PARTS differ, never a campus of separate boxes.
    # ARTICULATION IS NOT FRAGMENTATION.

    # THE READING WING: the spine. Everything else lands on it. Drawn first so the
    # taller masses read as growing out of it.
    s.box((0.2, 6.2, 1.2), (11.4, 3.4, 3.6), {'top': _dark(BLD, 0.92), 'px': _win(BLD, 9, 2, 6),
          'py': _win(BLD, 3, 2, 10), 'nx': _dark(BLD), 'ny': _dark(BLD)})

    # THE DRUM, landing ON the spine (y runs 1.2..6.4, the wing starts at 6.2). Stepped
    # in plan so it reads round rather than square at icon size, and capped with the
    # OCULUS ring and its lantern -- the thing you remember about it.
    # FOUR steps, not two, and it climbs: at 16x16 map zoom the icon is judged on its
    # OUTLINE alone, and a two-step drum reads as a plain block -- squint_gate caught it
    # as a twin of the battery district the moment the masses joined up. A stepped CONE
    # beside a slender needle is a shape nothing else in the valley has.
    for inset, h in ((0.0, 5.6), (0.55, 6.6), (1.15, 7.5), (1.75, 8.2)):
        s.box((0.4 + inset, 1.2 + inset, 1.2), (5.2 - inset * 2, 5.2 - inset * 2, h - 1.2),
              {'top': _dark(BLD, 0.95), 'px': _win(BLD, 5, 3, 4), 'py': _win(BLD, 5, 3, 9),
               'nx': _dark(BLD), 'ny': _dark(BLD)})
    s.box((2.0, 2.8, 8.2), (2.0, 2.0, 0.5), {'c': OCULUS})                        # the oculus ring
    s.box((2.6, 3.4, 8.7), (0.8, 0.8, 0.8), {'c': tuple(min(255, int(c * 1.1)) for c in OCULUS)})

    # THE TOWER: the HINGE. It shares a wall with the drum (x 5.4 < the drum's 5.6) and
    # sits down onto the spine (y 3.2..6.4). Slender and the tallest thing on the block --
    # a needle, so the outline reads library and not another utility block.
    s.box((5.4, 3.2, 1.2), (2.1, 3.2, 12.6), {'top': _dark(BLD, 0.9), 'px': _win(BLD, 2, 8, 5, 0.1),
          'py': _win(BLD, 2, 8, 12, 0.1), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    s.box((5.65, 3.45, 13.8), (1.6, 2.7, 0.5), {'c': PLANT})

    # THE MUSEUM WING, sharing the tower's east wall and landing on the spine too.
    s.box((7.8, 2.2, 1.2), (3.8, 4.2, 4.4), {'top': _dark(BLD, 0.88), 'px': _win(BLD, 3, 3, 8),
          'py': _win(BLD, 3, 3, 14), 'nx': _dark(BLD), 'ny': _dark(BLD)})
    s.box((7.8, 2.2, 5.6), (3.8, 4.2, 0.3), {'c': P[17]})                          # its roof edge

    for i in range(9):
        s.box((0.7 + i * 1.2, 6.5, 4.8), (0.7, 2.8, 0.5), {'c': CLERE})           # the clerestory teeth
    _door_face(s, (0.2, 6.2, 1.2), (11.4, 3.4, 3.6), width=1.6, ztop=3.2,
               doorc=_dark(BLD, 0.4)['c'],
               framec=tuple(min(255, int(c * 1.2)) for c in BLD))

    for (vx, vy) in ((-1.6, 11.1), (2.2, 11.1), (10.0, 11.1), (0.4, 13.4), (8.0, 13.4), (12.4, 13.4)):
        _vehicle(s, vx, vy, CAR, P[19], along='x')                                 # left in the lot
    return s, 6.4


def _gable(s, org, size, rise, mat, ridge_frac=0.10):
    """A PITCHED ROOF over a box footprint, as four proper quads plus a narrow ridge cap.

    A church does not read as a church from a flat roof with a stripe painted down it. It
    reads from its SECTION: two slopes meeting at a ridge, and gable ends you can see the
    triangle of. So the roof is real geometry, not a decal.

    The ridge is a narrow flat band rather than a knife edge on purpose: a true apex needs
    triangles, and a triangle in this renderer is a quad with two coincident vertices --
    the exact degenerate sliver that made every round roof look like a tarp (Paolo 8/2).
    A truncated ridge keeps every face a real quad and reads identically at icon size.
    """
    x, y, z = org
    dx, dy, dz = size
    zb = z + dz
    along_x = dx >= dy
    rw = (dy if along_x else dx) * ridge_frac
    if along_x:
        y0, y1 = y + dy / 2 - rw / 2, y + dy / 2 + rw / 2
        a = (x, y, zb); b = (x + dx, y, zb); c = (x + dx, y + dy, zb); d = (x, y + dy, zb)
        r0 = (x, y0, zb + rise); r1 = (x + dx, y0, zb + rise)
        r2 = (x + dx, y1, zb + rise); r3 = (x, y1, zb + rise)
    else:
        x0, x1 = x + dx / 2 - rw / 2, x + dx / 2 + rw / 2
        a = (x, y, zb); b = (x + dx, y, zb); c = (x + dx, y + dy, zb); d = (x, y + dy, zb)
        r0 = (x0, y, zb + rise); r1 = (x1, y, zb + rise)
        r2 = (x1, y + dy, zb + rise); r3 = (x0, y + dy, zb + rise)
    lit = {'c': tuple(min(255, int(v * 1.10)) for v in mat)}
    shd = {'c': tuple(int(v * 0.80) for v in mat)}
    end = {'c': tuple(int(v * 0.90) for v in mat)}
    cap = {'c': tuple(min(255, int(v * 1.18)) for v in mat)}
    if along_x:
        s.quad(a, b, r1, r0, shd)                       # the -y slope
        s.quad(d, r3, r2, c, lit)                       # the +y slope
        s.quad(a, r0, r3, d, end)                       # the two gable ends
        s.quad(b, c, r2, r1, end)
    else:
        s.quad(a, r0, r3, d, shd)
        s.quad(b, c, r2, r1, lit)
        s.quad(a, b, r1, r0, end)
        s.quad(d, r3, r2, c, end)
    s.quad(r0, r1, r2, r3, cap, (0, 0, 1))              # the ridge band
    s.solids.append((x, y, zb, dx, dy, rise))


def _spire(s, cx, cy, z0, half, rise, mat, tip=0.16):
    """A STEEPLE: a truncated pyramid on a tower. Four trapezoids and a small cap, so no
    face is a degenerate triangle. The pointed thing over a bell tower is the single most
    recognisable silhouette a church has, and it is what makes the icon read at map size."""
    t = half * tip
    b0 = (cx - half, cy - half, z0); b1 = (cx + half, cy - half, z0)
    b2 = (cx + half, cy + half, z0); b3 = (cx - half, cy + half, z0)
    t0 = (cx - t, cy - t, z0 + rise); t1 = (cx + t, cy - t, z0 + rise)
    t2 = (cx + t, cy + t, z0 + rise); t3 = (cx - t, cy + t, z0 + rise)
    lit = {'c': tuple(min(255, int(v * 1.12)) for v in mat)}
    shd = {'c': tuple(int(v * 0.78) for v in mat)}
    mid = {'c': tuple(int(v * 0.94) for v in mat)}
    s.quad(b0, b1, t1, t0, shd)
    s.quad(b1, b2, t2, t1, mid)
    s.quad(b3, t3, t2, b2, lit)
    s.quad(b0, t0, t3, b3, mid)
    s.quad(t0, t1, t2, t3, lit, (0, 0, 1))
    s.solids.append((cx - half, cy - half, z0, half * 2, half * 2, rise))


# ---------------------------------------------------------------- CHAPEL / CHURCH
def build_chapel(P):
    """engine/bohemia_chapel.js — BUILT 8/2, because there was no icon at all and Paolo
    scored the empty box 0%. He was right to: a district with no map icon is a district
    you cannot find, and an empty panel on a judge card is worth exactly nothing.

    A cruciform church reads from the air by ITS PLAN — the long nave crossed by the
    transepts with a rounded apse at the head — so the icon is built from the plan up:
    nave, transepts, apse, narthex, and the bell tower that is the only vertical thing on
    a Mojave churchyard. Beside it the walled MEMORIAL COURT with its columbarium, because
    in this ground you do not dig graves, you build a wall and fill it.

    REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no new graphic pixels of its own — it
    composes the district's OWN palette through the shared iso primitives in
    tools/bohemia_iso3d.py. No bank applies: there is no iso hero-building sprite bank."""
    STONE, TOWER, PLAZA, GLASS = P[2], P[6], P[7], P[11]
    CROSS, WALL, RIDGE, COURT, GRAVEL, DRIVE = P[10], P[13], P[22], P[4], P[14], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-1.0, 9.5, 12.5, 13.5, PLAZA),
                                          (8.0, -2.5, 14.0, 5.0, COURT)],
            lot=(-3, 13.5, 15, 15), drive=(9.0, 12.0, 12.5, 15),
            groundc=GRAVEL, lotc=(58, 58, 66))

    # THE CROSS, and it has to READ as one: a long narrow NAVE with the TRANSEPTS sticking
    # clear out of both flanks, the APSE rounding off the head, the NARTHEX at the foot.
    # Walls low, roofs steep -- a church is mostly roof, which is exactly why the flat-box
    # first cut read as a warehouse with a tower next to it.
    s.box((4.2, -0.6, 0), (3.2, 9.4, 4.6), {'top': _dark(STONE, 0.92), 'px': _win(STONE, 2, 2, 4),
          'py': _win(STONE, 5, 2, 9), 'nx': _dark(STONE), 'ny': _dark(STONE)})
    _gable(s, (4.2, -0.6, 0), (3.2, 9.4, 4.6), 3.4, RIDGE)
    s.box((0.6, 3.0, 0), (10.4, 3.0, 4.0), {'top': _dark(STONE, 0.9), 'px': _win(STONE, 2, 2, 6),
          'py': _win(STONE, 5, 2, 11), 'nx': _dark(STONE), 'ny': _dark(STONE)})
    _gable(s, (0.6, 3.0, 0), (10.4, 3.0, 4.0), 2.8, RIDGE)
    s.prism(5.8, -0.6, 0, 1.6, 4.6, 16, {'c': STONE}, {'c': _dark(STONE, 0.86)['c']})
    _spire(s, 5.8, -0.6, 4.6, 1.6, 2.4, RIDGE, tip=0.30)                 # the apse cone

    for gy in (0.6, 1.8, 6.6, 7.8):                                      # stained glass, nave flank
        s.box((6.98, gy, 1.0), (0.06, 0.8, 1.5), {'c': GLASS})

    # THE NARTHEX porch and THE BELL TOWER under its STEEPLE -- the silhouette that makes
    # this icon a church at map size and nothing else in the valley.
    s.box((3.6, 8.8, 0), (4.0, 1.8, 2.8), {'top': _dark(STONE, 0.94), 'px': _win(STONE, 2, 1, 12),
          'py': _dark(STONE, 0.9), 'nx': _dark(STONE), 'ny': _dark(STONE)})
    _gable(s, (3.6, 8.8, 0), (4.0, 1.8, 2.8), 1.5, RIDGE)
    s.box((1.0, 8.6, 0), (2.4, 2.4, 10.0), {'top': _dark(TOWER, 0.9), 'px': _dark(TOWER, 1.04),
          'py': _dark(TOWER, 0.84), 'nx': _dark(TOWER), 'ny': _dark(TOWER)})
    s.box((1.25, 8.85, 7.8), (1.9, 1.9, 1.5), {'c': GLASS})              # the belfry opening
    _spire(s, 2.2, 9.8, 10.0, 1.45, 4.4, RIDGE)                           # THE STEEPLE
    s.box((2.05, 9.65, 14.4), (0.3, 0.3, 1.2), {'c': CROSS})             # the finial cross
    s.box((1.6, 9.65, 14.9), (1.2, 0.3, 0.3), {'c': CROSS})
    _door_face(s, (3.6, 8.8, 0), (4.0, 1.8, 2.8), width=1.3, ztop=2.0,
               doorc=_dark(STONE, 0.4)['c'],
               framec=tuple(min(255, int(c * 1.25)) for c in STONE))

    # THE MEMORIAL COURT: a walled square of decomposed granite with the COLUMBARIUM round
    # it. In this ground you do not dig graves, you build a wall and you fill it.
    for (wx, wy, wdx, wdy) in ((8.1, -0.6, 4.2, 0.3), (8.1, 4.4, 4.2, 0.3),
                               (8.1, -0.6, 0.3, 5.3), (12.0, -0.6, 0.3, 5.3)):
        s.box((wx, wy, 0), (wdx, wdy, 1.9), {'top': _dark(WALL, 1.1), 'px': _dark(WALL, 1.0),
              'py': _dark(WALL, 0.85), 'nx': _dark(WALL), 'ny': _dark(WALL)})
    for ty in (0.4, 2.0, 3.6):
        s.box((10.0, ty, 0), (0.22, 0.22, 1.4), {'c': _dark(P[3], 1.0)['c']})
        s.box((9.6, ty - 0.35, 1.4), (1.0, 0.9, 0.3), {'c': _dark(P[3], 0.8)['c']})

    # THE FORECOURT: the churchyard cross, the bell that came through the belfry floor,
    # and the font with nothing in it.
    s.box((5.5, 11.4, 0), (0.36, 0.36, 2.6), {'c': CROSS})
    s.box((4.85, 11.4, 2.0), (1.7, 0.36, 0.36), {'c': CROSS})
    s.prism(2.9, 12.0, 0, 0.8, 0.75, 14, {'c': _dark(CROSS, 0.65)['c']})   # the fallen bell
    s.prism(8.8, 12.0, 0, 0.95, 0.4, 14, {'c': _dark(P[21], 1.0)['c']},
            {'c': _dark(P[21], 0.7)['c']}, inner=0.6)                       # the dry font
    for lx in (0.2, 11.2):
        s.box((lx - 0.08, 12.8, 0), (0.16, 0.16, 2.4), {'c': P[9]})
    _vehicle(s, 1.5, 13.6, CAR, P[19], along='x')
    return s, 6.6


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
            s.box((cx - 0.05, ry + 0.7, 0), (0.1, 0.1, 1.9), {'c': (92, 90, 86)})       # post
            s.quad((cx - 1.4, ry - 0.5, 1.9), (cx + 1.4, ry - 0.5, 1.4), (cx + 1.4, ry + 0.9, 1.4),
                   (cx - 1.4, ry + 0.9, 1.9), PVMAT, (0.2, 0, 0.98))                    # tilted panel
    s.box((-2, -1.6, 0), (3.4, 2.8, 7.2), {'top': _dark(CTRL, 0.9), 'px': _win(CTRL, 3, 4, 4),
          'py': _dark(CTRL, 0.95), 'nx': _dark(CTRL), 'ny': _dark(CTRL)})               # control building
    s.box((1.6, -1.6, 0), (1.4, 1.4, 1.6), {'c': INV})                                  # inverter/transformer pad
    s.box((3.4, -1.6, 0), (1.8, 1.4, 3.2), {'c': SWG})                                  # substation switchgear
    return s, 6.4


# ---------------------------------------------------------------- STADIUM
def build_stadium(P):
    FACADE, BOWL, SCORE, LIGHT, FIELD, CARC = P[2], P[6], P[9], P[12], P[4], P[11]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), lot=(-3, 11, 15, 15), groundc=(96, 94, 88), lotc=(52, 52, 60))
    s.prism(6, 4, 0.02, 5.4, 0.06, 22, {'c': _dark(FIELD, 0.9)['c']})                   # the field oval
    # A BOWL IS A RING. It only read as one while the prism cap was broken and its holes
    # let the field show through; a closed cap turned the whole icon into one flat disc and
    # the HUE gate caught it as monochrome the same turn the cap was repaired.
    s.prism(6, 4, 0, 6.9, 6.4, 26, {'c': FACADE}, {'c': _dark(BOWL, 1.05)['c']}, inner=4.8)
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
        s.box((-2, ry, 0), (11, 2.6, 4.6), {'top': _dark(UNIT, 0.9), 'px': _dark(UNIT, 1.0),
              'py': _dark(UNIT, 0.84), 'nx': _dark(UNIT), 'ny': _dark(UNIT)})
        for ux in range(0, 6):
            s.box((-2 + ux * 1.9 + 0.5, ry - 0.02, 0.15), (0.9, 0.05, 3.4), {'c': ROLLUP})   # orange roll-up doors
        s.box((-2, ry + 1.2, 4.6), (11, 0.25, 0.35), {'c': ROOF})                        # roof ridge
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


# ================================================================ THE SURFACES
# (7/27/26) Paolo: "anytime you build something like this you have to make a city
# builder icon as well like for real." Said the turn the WORLD lane shipped the
# railway and the interchange with no way to point at either one in the city
# builder. Law: laws/BOHEMIA_ADDENDUM_ICON_WITH_EVERY_BUILD_7_27_26.md
#
# These four are SURFACES, not districts, and the rule that made the heroes work
# does not change for them: DON'T INVENT — MATCH THE WALKABLE. Every part below
# is a landmark out of the surface's own engine module, in that module's own
# palette, and every one of them is named in PARTS.

# CANON ROLLING STOCK + AIRCRAFT SIZES, same law as CAR/BUS/TRAILER (Paolo 7/24:
# "there can only be one consistent car size"). A railway and an airfield need
# bodies the road set cannot express, so they get their own canon sizes — ONE
# wagon, ONE locomotive, ONE airliner, ONE fighter, identical in every hero.
RAILCAR = (3.4, 0.92, 1.05)      # covered hopper: L along the rail, W across, H tall
LOCO = (4.3, 0.98, 1.30)         # road unit, longer and taller than a wagon
# ICON PROPORTIONS, NOT SCALE-MODEL ONES. A real narrowbody is about 10:1 body to
# width and at this size that renders as a thin grey girder — accurate and
# unreadable. The style bible is explicit ("chunky, simple, BOLD; fewer, larger
# shapes"), so the body is stubbier and the span is close to the length, which is
# what the eye actually uses to say "aeroplane".
AIRLINER = (5.6, 1.15, 1.15)     # narrowbody fuselage; wingspan is derived below
FIGHTER = (3.0, 0.66, 0.62)


def _railcar(s, x, y, size, color, along='x'):
    """One piece of dead rolling stock: an underframe on trucks with the body
    above it, so it reads as standing ON the rail and not lying beside it."""
    assert size in (RAILCAR, LOCO), 'rolling stock must use a CANON size, got %r' % (size,)
    L, W, H = size
    dx, dy = (L, W) if along == 'x' else (W, L)
    s.box((x, y, 0.10), (dx, dy, 0.16), {'c': (44, 42, 40)})                             # underframe + trucks
    s.box((x + dx * 0.03, y + dy * 0.03, 0.26), (dx * 0.94, dy * 0.94, H),
          {'top': _dark(color, 1.10), 'px': _dark(color, 1.0), 'py': _dark(color, 0.82),
           'nx': _dark(color), 'ny': _dark(color)})                                      # body
    if size is LOCO:                                                                      # the short hood + cab
        s.box((x + dx * 0.62, y + dy * 0.06, 0.26 + H), (dx * 0.3, dy * 0.88, H * 0.42),
              {'c': _dark(color, 0.7)['c']})


def _aircraft(s, x, y, size, color, along='x', nose='+x'):
    """One dead aeroplane, and the thing that decides whether it reads at icon size
    is the WING SWEEP. Built from axis-aligned boxes the first time, it came out a
    plus-sign of grey girders — a wing that leaves the body at 90 degrees and has
    the same value as the body is not a wing, it is a beam. So the wings, the
    tailplane and the fin are QUADS with real sweep, and they are a full value step
    darker than the fuselage so the dart silhouette separates.

    The fuselage is a three-tier stack (belly, barrel, crown) because in flat 3-tone
    shading that is what reads as a cylinder instead of a box."""
    assert size in (AIRLINER, FIGHTER), 'aircraft must use a CANON size, got %r' % (size,)
    L, W, H = size
    span = L * 1.02 if size is AIRLINER else L * 0.94
    top, body, wing = _dark(color, 1.14), _dark(color, 1.0), _dark(color, 0.72)
    Z = 0.62                                       # belly height: it stands on its gear
    sgn = 1.0 if nose == '+x' else -1.0

    def P(a, c, z):
        """a = along the aircraft (0 tail .. 1 nose), c = across (-1 .. 1 half-span)."""
        da = (a - 0.5) * L * sgn
        return (x + L * 0.5 + da, y + c, z) if along == 'x' else (x + c, y + L * 0.5 + da, z)

    def slab(a0, c0, a1, c1, a2, c2, a3, c3, z, mat):
        s.quad(P(a0, c0, z), P(a1, c1, z), P(a2, c2, z), P(a3, c3, z), mat, (0, 0, 1))

    # ---- fuselage: belly, barrel, crown ------------------------------------
    for (za, zb, inset, mat) in ((Z, Z + H * 0.30, W * 0.30, body),
                                 (Z + H * 0.30, Z + H * 0.78, 0.0, body),
                                 (Z + H * 0.78, Z + H, W * 0.26, top)):
        half = W / 2 - inset
        if along == 'x':
            s.box((x + L * 0.03, y - half, za), (L * 0.94, half * 2, zb - za),
                  {'top': top, 'px': body, 'py': _dark(color, 0.86), 'nx': body, 'ny': _dark(color, 0.86)})
        else:
            s.box((x - half, y + L * 0.03, za), (half * 2, L * 0.94, zb - za),
                  {'top': top, 'px': _dark(color, 0.86), 'py': body, 'nx': _dark(color, 0.86), 'ny': body})
    p = P(1.0, 0, Z + H * 0.36)                                                   # tapered nose cone
    if along == 'x':
        s.box((min(p[0], p[0] - sgn * L * 0.09), y - W * 0.24, Z + H * 0.26), (L * 0.09, W * 0.48, H * 0.44), {'c': top['c']})
    else:
        s.box((x - W * 0.24, min(p[1], p[1] - sgn * L * 0.09), Z + H * 0.26), (W * 0.48, L * 0.09, H * 0.44), {'c': top['c']})

    # ---- SWEPT WINGS: root forward, tip aft. This is the whole read. --------
    hs = span / 2
    for side in (-1, 1):
        slab(0.60, 0.0, 0.36, 0.0, 0.22, side * hs, 0.40, side * hs, Z + H * 0.34, wing)
        slab(0.20, side * hs * 0.62, 0.30, side * hs * 0.62,                       # engine nacelle
             0.30, side * hs * 0.42, 0.20, side * hs * 0.42, Z + H * 0.30, _dark(color, 0.6))
        slab(0.10, 0.0, 0.02, 0.0, 0.00, side * hs * 0.34, 0.08, side * hs * 0.34, # tailplane
             Z + H * 0.86, wing)
    # ---- the fin, swept back, tall enough to be the tallest thing on it -----
    fz = Z + H
    fh = L * 0.42 if size is AIRLINER else L * 0.44
    a0, a1 = P(0.12, 0, fz), P(0.02, 0, fz)
    a2, a3 = P(0.02, 0, fz + fh), P(0.16, 0, fz + fh * 0.72)
    n = (0, 1, 0) if along == 'x' else (1, 0, 0)
    s.quad(a0, a1, a2, a3, top, n)
    for lg in (0.24, 0.74):                                                       # gear, so it stands on the apron
        g = P(lg, 0, 0)
        s.box((g[0] - 0.07, g[1] - 0.07, 0), (0.14, 0.14, Z), {'c': (52, 52, 54)})


def _track(s, x0, x1, y, pal, gauge=1.05, sleepers=True):
    """A length of two-rail track on its ballast, in the railway's own colours:
    the ballast prism, the sleepers across it, and the two running rails."""
    BAL, TIE, STEEL = pal
    s.box((x0, y - 1.15, 0), (x1 - x0, 2.30, 0.22),
          {'top': _dark(BAL, 1.10), 'px': _dark(BAL, 0.9), 'py': _dark(BAL, 0.85),
           'nx': _dark(BAL, 0.9), 'ny': _dark(BAL, 0.85)})                               # ballast prism
    if sleepers:
        n = int((x1 - x0) / 0.46)
        for i in range(n):
            s.box((x0 + 0.10 + i * 0.46, y - 0.78, 0.22), (0.20, 1.56, 0.07), {'c': TIE})
    for o in (-gauge / 2, gauge / 2):
        s.box((x0, y + o - 0.05, 0.29), (x1 - x0, 0.10, 0.10),
              {'top': _dark(STEEL, 1.15), 'px': _dark(STEEL, 0.8), 'py': _dark(STEEL, 0.8),
               'nx': _dark(STEEL, 0.8), 'ny': _dark(STEEL, 0.8)})


# ---------------------------------------------------------------- RAIL
def build_rail(P):
    """engine/bohemia_rail.js: a two-track ballasted mainline with a dead consist
    standing on it, a wayside signal + its relay hut, the at-grade crossing with
    the gate arm still down, the right-of-way fence, and the rail-served loading
    pad behind it."""
    BAL, TIE, STEEL, CESS = P[1], P[2], P[3], P[4]
    SROAD, FENCE, SIGNAL, HUT = P[6], P[7], P[8], P[9]
    FREIGHT, LOCOC, XPAVE, XMARK, GATEARM = P[10], P[11], P[12], P[13], P[14]
    SCRAP, PAD, DOCK, YARD = P[15], P[19], P[20], P[21]
    # DEPTH ORDER IS THE WHOLE LAYOUT (learned the hard way on the first bake): in this
    # projection a bigger x+y draws NEARER, so anything tall placed at the front hides
    # everything behind it. The first version put the dock shed at the front and the
    # train behind it, and the train — the entire signature — was invisible. Tall mass
    # goes to the BACK, the thing that has to read goes to the FRONT.
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-3, -3, 15, 1.4, YARD), (-3, -3, 15, -0.6, PAD)],
            drive=(-3, 12.6, 15, 15), groundc=CESS, lotc=SROAD)
    s.box((-2, -2.6, 0), (12.0, 2.0, 3.2), {'top': _dark(DOCK, 0.9), 'px': _dark(DOCK, 1.0),
          'py': _win(DOCK, 5, 1, 7), 'nx': _dark(DOCK), 'ny': _dark(DOCK)})              # dock wall / shed
    for dx in (-1.2, 1.6, 4.4, 7.2):
        s.box((dx, -0.68, 0.1), (1.5, 0.10, 1.9), {'c': _dark(DOCK, 0.6)['c']})          # dock doors
    for fx in (-2.6, 2.4, 7.4, 12.4):
        s.box((fx, 1.9, 0), (0.16, 0.16, 1.9), {'c': FENCE})                             # right-of-way fence
    _track(s, -3, 15, 5.0, (BAL, TIE, STEEL))                                            # the second track
    _railcar(s, 8.6, 5.0 - RAILCAR[1] / 2, RAILCAR, FREIGHT, along='x')
    _railcar(s, 12.2, 5.0 - RAILCAR[1] / 2, RAILCAR, FREIGHT, along='x')
    s.box((1.2, 3.0, 0), (0.26, 0.26, 7.6), {'c': SIGNAL})                               # wayside signal mast
    s.box((0.95, 2.85, 3.0), (0.7, 0.5, 0.9), {'c': _dark(SIGNAL, 0.72)['c']})           # signal head
    s.box((-1.4, 2.6, 0), (1.8, 1.6, 1.9), {'top': _dark(HUT, 0.9), 'px': _win(HUT, 2, 1, 3),
          'py': _dark(HUT, 0.86), 'nx': _dark(HUT), 'ny': _dark(HUT)})                   # relay hut
    _door(s, 0.4, 3.0, 3.7, 1.3)
    _track(s, -3, 15, 8.6, (BAL, TIE, STEEL))                                            # the main, nearest
    _railcar(s, 1.1, 8.6 - LOCO[1] / 2, LOCO, LOCOC, along='x')                          # the dead road unit
    _railcar(s, 5.7, 8.6 - RAILCAR[1] / 2, RAILCAR, FREIGHT, along='x')
    # THE GRADE CROSSING, in front of everything, panels between the rails
    s.box((10.6, 3.0, 0.30), (2.8, 9.6, 0.05), {'c': XPAVE})
    for by in (3.4, 11.4):
        s.box((10.7, by, 0.35), (2.6, 0.24, 0.04), {'c': XMARK})                         # stop bars
    s.box((13.6, 10.4, 0), (0.24, 0.24, 2.6), {'c': GATEARM})                            # crossing mast
    s.box((10.4, 10.28, 1.6), (3.4, 0.18, 0.18), {'c': GATEARM})                         # the arm, still down
    for (sx, sy) in [(-1.6, 11.0), (0.4, 12.0), (2.2, 11.2)]:
        s.box((sx, sy, 0), (1.6, 0.9, 0.55), {'c': SCRAP})                               # stacked relay rail + ties
    return s, 6.3


# ---------------------------------------------------------------- INTERCHANGE
def build_interchange(P):
    """engine/bohemia_interchange.js: two carriageways crossing on two LEVELS —
    the upper one on a piered deck — with a connector ramp curving up to it, the
    high-mast light, the sound wall, the retention basin, and the jam that never
    moved."""
    LANE, LINE, SHLD, BARRIER, GRAIL = P[1], P[2], P[3], P[4], P[5]
    EMBANK, BRUSH, WALL, MAST = P[6], P[7], P[8], P[9]
    CARC, SEMIC, DECK, PIER = P[10], P[11], P[12], P[13]
    DEBRIS, RAMP, GORE, BASIN = P[15], P[16], P[18], P[19]
    s = Scene()
    # the sound wall goes to the BACK for the same depth reason as the other three
    _ground(s, (-3, -3, 15, 15), patches=[(-3, 10.0, 5.4, 15, BASIN)], groundc=EMBANK, lotc=SHLD)
    # THE LOWER CARRIAGEWAY, at grade, running east-west
    s.box((-3, 3.4, 0.02), (18, 5.2, 0.10), {'c': LANE})
    s.box((-3, 3.1, 0.02), (18, 0.34, 0.11), {'c': SHLD})
    s.box((-3, 8.5, 0.02), (18, 0.34, 0.11), {'c': SHLD})
    for ly in (4.7, 7.3):
        for seg in range(9):
            s.box((-2.6 + seg * 2.0, ly, 0.13), (1.1, 0.13, 0.03), {'c': LINE})          # dashed lane lines
    s.box((-3, 5.9, 0.12), (18, 0.30, 0.34), {'c': BARRIER})                             # median barrier
    _vehicle(s, 1.2, 4.2, CAR, CARC, along='x')
    _vehicle(s, 3.4, 7.0, TRAILER, SEMIC, along='x')
    _vehicle(s, 11.0, 4.3, CAR, CARC, along='x')
    s.box((6.4, 4.0, 0.13), (0.5, 0.4, 0.10), {'c': DEBRIS})                             # blown tyre and glass
    # THE PIERS AND THE DECK: the upper road, crossing north-south over the lower
    for (px, py) in [(4.6, 2.6), (4.6, 9.2), (7.4, 2.6), (7.4, 9.2), (4.6, 5.95), (7.4, 5.95)]:
        s.box((px, py, 0), (0.62, 0.62, 3.5), {'c': PIER})
    s.box((3.9, -3, 3.5), (4.4, 18, 0.55), {'top': _dark(DECK, 1.12), 'px': _dark(DECK, 0.8),
          'py': _dark(DECK, 0.86), 'nx': _dark(DECK, 0.8), 'ny': _dark(DECK, 0.86)})
    for seg in range(8):
        s.box((6.0, -2.6 + seg * 2.2, 4.05), (0.14, 1.2, 0.03), {'c': LINE})             # deck lane line
    for gx in (3.9, 8.16):
        s.box((gx, -3, 4.05), (0.18, 18, 0.30), {'c': GRAIL})                            # deck guardrail
    _vehicle(s, 4.5, 0.4, CAR, CARC, along='y')                                          # stopped on the deck
    # THE CONNECTOR RAMP, climbing out of the lower road up to the deck
    for i in range(9):
        t = i / 8.0
        rx = 8.9 + 4.6 * math.sin(t * 1.35)
        ry = 8.9 - 5.2 * t
        s.box((rx, ry, 0.10 + 3.45 * t), (1.55, 1.35, 0.28),
              {'top': _dark(RAMP, 1.18), 'px': _dark(RAMP, 0.8), 'py': _dark(RAMP, 0.86),
               'nx': _dark(RAMP, 0.8), 'ny': _dark(RAMP, 0.86)})
        if i and i < 8:
            s.box((rx + 0.55, ry + 0.5, 0), (0.26, 0.26, 0.10 + 3.45 * t), {'c': PIER})  # ramp bent
    s.box((9.0, 8.7, 0.13), (1.4, 0.20, 0.03), {'c': GORE})                              # the painted gore
    s.box((12.9, 1.0, 0), (0.30, 0.30, 8.2), {'c': MAST})                                # high-mast light tower
    s.box((12.55, 0.65, 8.2), (1.0, 1.0, 0.5), {'c': _dark(MAST, 1.1)['c']})
    s.box((-3, -2.9, 0), (18, 0.5, 2.6), {'top': _dark(WALL, 1.06), 'px': _dark(WALL, 1.0),
          'py': _dark(WALL, 0.82), 'nx': _dark(WALL), 'ny': _dark(WALL)})                # sound wall
    for (bx, by) in [(7.0, 11.4), (10.2, 12.6), (13.0, 10.2)]:
        s.box((bx, by, 0), (0.8, 0.8, 0.55), {'c': BRUSH})                               # dry brush in the infield
    return s, 6.0


# ---------------------------------------------------------------- AIRPORT
def build_airport(P):
    """engine/bohemia_airfield.js (kind 'airport'): the runway with its centreline,
    the parallel taxiway in amber, the terminal, a jet bridge still docked to an
    airliner that never pushed back, the apron stand markings, a floodlight mast
    and the perimeter fence."""
    RUNWAY, RMARK, SHLD, TAXI, TAXIC = P[1], P[2], P[3], P[4], P[5]
    APRON, STANDM, TERM, BRIDGE = P[6], P[7], P[8], P[10]
    LINER, FENCE, SROAD, LMAST = P[11], P[13], P[14], P[15]
    # DEPTH ORDER: the LANDSIDE goes to the BACK and the airside comes FORWARD, so the
    # aeroplane — the entire signature — stands clear in front of the terminal instead
    # of behind it. The first bake had it the other way round and the airliner was
    # completely hidden by the terminal block. Flat things (taxiway, runway) sit at the
    # very front, where they occlude nothing.
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-3, 8.6, 15, 10.6, TAXI), (-3, 11.8, 15, 15, RUNWAY)],
            drive=(-3, -3, 15, -1.8), groundc=APRON, lotc=SROAD)
    s.box((-2, -1.4, 0), (13.0, 3.0, 4.0), {'top': _dark(TERM, 0.92), 'px': _win(TERM, 8, 2, 4),
          'py': _win(TERM, 8, 2, 9), 'nx': _dark(TERM), 'ny': _dark(TERM)})              # the terminal
    _door(s, 11.0, -0.6, 0.6, 1.5)
    # THE STAND, deliberately a value step darker than the apron: a pale airframe on
    # pale concrete disappeared, and the aeroplane is the whole point of the icon.
    s.box((-1.0, 3.4, 0.03), (12.6, 4.6, 0.05), {'c': _dark(APRON, 0.72)['c']})
    s.box((3.6, 1.6, 0), (0.36, 0.36, 1.9), {'c': _dark(BRIDGE, 0.7)['c']})              # bridge rotunda leg
    s.box((3.2, 1.6, 1.9), (1.2, 1.9, 0.9), {'top': _dark(BRIDGE, 1.1), 'px': _dark(BRIDGE, 0.9),
          'py': _dark(BRIDGE, 0.84), 'nx': _dark(BRIDGE, 0.9), 'ny': _dark(BRIDGE, 0.84)})  # jet bridge
    s.box((-0.6, 7.4, 0.06), (11.4, 0.24, 0.04), {'c': STANDM})                          # stand lead-in line
    _aircraft(s, 1.4, 4.2, AIRLINER, LINER, along='x')                                   # the airliner on the stand
    s.box((13.2, 2.0, 0), (0.28, 0.28, 6.2), {'c': LMAST})                               # apron floodlight mast
    s.box((12.9, 1.7, 6.2), (0.9, 0.9, 0.45), {'c': _dark(LMAST, 1.1)['c']})
    for fx in (-2.6, 2.4, 7.4, 12.4):
        s.box((fx, 8.0, 0), (0.16, 0.16, 1.8), {'c': FENCE})                             # perimeter fence
    s.box((-3, 9.5, 0.08), (18, 0.20, 0.04), {'c': TAXIC})                               # amber taxi centreline
    s.box((-3, 11.5, 0.03), (18, 0.34, 0.05), {'c': SHLD})                               # paved shoulder
    for seg in range(7):
        s.box((-2.4 + seg * 2.6, 13.3, 0.08), (1.5, 0.26, 0.04), {'c': RMARK})           # runway centreline
    return s, 6.0


# ---------------------------------------------------------------- AIRBASE
def build_airbase(P):
    """engine/bohemia_airfield.js (kind 'airbase'): the same field anatomy with the
    military landside — arch-roofed hangars instead of a terminal, and a fighter
    sitting on its alert pad between two concrete blast revetments."""
    RUNWAY, RMARK, SHLD, TAXI, TAXIC = P[1], P[2], P[3], P[4], P[5]
    APRON, STANDM, HANGAR = P[6], P[7], P[9]
    FIGHTERC, FENCE, SROAD, LMAST, BLAST, REVET = P[12], P[13], P[14], P[15], P[16], P[17]
    # DEPTH ORDER, same law as the airport: hangars to the BACK, the fighter and its
    # revetments FORWARD where they read, the flat runway at the front.
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(-3, 8.6, 15, 10.6, TAXI), (-3, 11.8, 15, 15, RUNWAY),
                                          (11.4, 11.8, 15, 15, BLAST)],
            drive=(-3, -3, 15, -1.8), groundc=APRON, lotc=SROAD)
    for hx in (-2.0, 5.4):                                                                # two hangars, doors open
        s.box((hx, -1.8, 0), (6.0, 3.2, 3.0), {'top': _dark(HANGAR, 0.94), 'px': _dark(HANGAR, 1.0),
              'py': _dark(HANGAR, 0.86), 'nx': _dark(HANGAR), 'ny': _dark(HANGAR)})
        s.box((hx + 0.35, -1.3, 3.0), (5.3, 2.2, 0.85), {'c': _dark(HANGAR, 1.12)['c']}) # the arched roof crown
        s.box((hx + 0.6, 1.32, 0.05), (4.8, 0.10, 2.4), {'c': (26, 28, 32)})             # the open hangar mouth
    s.box((0.4, 2.8, 0.03), (8.0, 4.6, 0.05), {'c': _dark(APRON, 0.72)['c']})            # the alert pad
    for ry in (2.9, 7.0):                                                                 # blast revetments
        s.box((0.6, ry, 0), (7.4, 0.5, 1.6), {'top': _dark(REVET, 1.10), 'px': _dark(REVET, 1.0),
              'py': _dark(REVET, 0.82), 'nx': _dark(REVET), 'ny': _dark(REVET)})
    s.box((0.6, 6.6, 0.06), (7.4, 0.18, 0.04), {'c': STANDM})                            # alert-pad lead-in line
    _aircraft(s, 2.2, 3.9, FIGHTER, FIGHTERC, along='x')                                 # the fighter on its pad
    s.box((13.0, 2.4, 0), (0.28, 0.28, 6.0), {'c': LMAST})                                # floodlight mast
    s.box((12.7, 2.1, 6.0), (0.9, 0.9, 0.45), {'c': _dark(LMAST, 1.1)['c']})
    for fx in (-2.6, 2.4, 7.4, 12.4):
        s.box((fx, 8.0, 0), (0.16, 0.16, 1.8), {'c': FENCE})                              # perimeter fence
    s.box((-3, 9.5, 0.08), (18, 0.20, 0.04), {'c': TAXIC})                                # amber taxi centreline
    s.box((-3, 11.5, 0.03), (18, 0.34, 0.05), {'c': SHLD})
    for seg in range(7):
        s.box((-2.4 + seg * 2.6, 13.3, 0.08), (1.5, 0.26, 0.04), {'c': RMARK})            # runway centreline
    return s, 6.0



# ---------------------------------------------------------------- CAMPUS
def build_campus(P):
    """engine/bohemia_campus.js: the QUAD is the signature — an open middle with the
    academic halls turned to face it, the colonnaded library as the biggest mass, and
    the dry fountain where the walks cross. A campus icon that shows a building alone
    is just an office; what says CAMPUS is buildings around a shared green."""
    LAWN, WALK, HALL, LIB, FOUNT = P[4], P[6], P[2], P[8], P[7]
    DRIVE, TREE, DORM, POLE = P[1], P[3], P[9], P[12]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), patches=[(0.5, 0.5, 11.5, 11.5, LAWN)],
            drive=(-3, 12.2, 15, 15), groundc=(104, 100, 88), lotc=(58, 58, 66))
    # THE QUAD: its walks, on the diagonals people actually cut
    for t in range(0, 46):
        f = t / 45.0
        s.box((0.8 + 10.4 * f, 0.8 + 10.4 * f, 0.02), (0.5, 0.5, 0.05), {'c': WALK})
        s.box((0.8 + 10.4 * f, 11.2 - 10.4 * f, 0.02), (0.5, 0.5, 0.05), {'c': WALK})
    s.box((0.6, 5.6, 0.02), (10.8, 0.8, 0.05), {'c': WALK})
    s.box((5.6, 0.6, 0.02), (0.8, 10.8, 0.05), {'c': WALK})
    s.prism(6, 6, 0.02, 1.5, 0.10, 16, {'c': WALK})                                   # fountain apron
    s.prism(6, 6, 0.10, 1.0, 0.45, 16, {'c': FOUNT}, {'c': _dark(FOUNT, 0.75)['c']})  # dry basin
    s.box((5.8, 5.8, 0.55), (0.4, 0.4, 0.8), {'c': _dark(FOUNT, 1.15)['c']})          # dead jet
    # THE LIBRARY, biggest mass, colonnade facing the quad
    s.box((-2, -2.4, 0), (7.8, 3.4, 8.6), {'top': _dark(LIB, 0.9), 'px': _win(LIB, 5, 4, 4),
          'py': _win(LIB, 6, 2, 9), 'nx': _dark(LIB), 'ny': _dark(LIB)})
    for cy2 in (-1.6, -0.6, 0.4, 1.4, 2.4, 3.4):
        s.box((5.5, cy2, 0), (0.45, 0.45, 4.6), {'c': _dark(LIB, 1.18)['c']})
    s.box((5.5, -1.8, 4.6), (0.6, 5.8, 0.5), {'c': _dark(LIB, 1.1)['c']})
    _door_face(s, (-2, -2.4, 0), (7.8, 3.4, 8.6), width=1.2, ztop=2.4)
    # ACADEMIC HALLS turning to face the quad
    s.box((-2.4, 3.4, 0), (3.0, 8.4, 7.4), {'top': _dark(HALL, 0.9), 'px': _win(HALL, 2, 5, 5),
          'py': _win(HALL, 6, 3, 7), 'nx': _dark(HALL), 'ny': _dark(HALL)})
    _door(s, 0.4, 6.6, 7.6, 1.5)
    s.box((12.0, 1.0, 0), (2.6, 7.4, 4.2), {'top': _dark(HALL, 0.9), 'px': _win(HALL, 2, 3, 3),
          'py': _win(HALL, 5, 3, 6), 'nx': _win(HALL, 2, 3, 8), 'ny': _dark(HALL)})
    # a residence hall behind, set apart from the teaching core
    s.box((7.5, 12.4, 0), (6.0, 2.2, 3.6), {'top': _dark(DORM, 0.9), 'px': _win(DORM, 4, 3, 2),
          'py': _win(DORM, 6, 3, 5), 'nx': _dark(DORM), 'ny': _dark(DORM)})
    for (tx, ty) in [(2.4, 2.2), (9.4, 3.0), (3.0, 9.4), (9.8, 9.0)]:                  # dead quad trees
        s.box((tx, ty, 0), (0.28, 0.28, 1.9), {'c': (74, 66, 54)})
        s.box((tx - 0.5, ty - 0.5, 1.9), (1.3, 1.3, 0.5), {'c': TREE})
    for (px2, py2) in [(0.4, 0.4), (11.4, 0.4), (0.4, 11.4)]:                          # dark pole lights
        s.box((px2, py2, 0), (0.2, 0.2, 3.0), {'c': POLE})
    _vehicle(s, 1.0, 13.2, CAR, (78, 78, 86), along='x')
    return s, 6.2


# ---------------------------------------------------------------- SPEEDWAY
def build_speedway(P):
    """engine/bohemia_speedway.js: the OVAL is the signature and nothing else comes
    close. Unlike an aeroplane it is a shape that SURVIVES SHRINKING — a ring reads at
    any size — which is exactly why this one works at 1x1 and the airfield's did not."""
    TRACK, MARK, INFIELD, STAND = P[6], P[7], P[4], P[2]
    GARAGE, LOT, TOWER, CARC, FENCE = P[8], P[1], P[12], P[14], P[11]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(96, 92, 82), lotc=(58, 58, 62))
    cx, cy, RX, RY, TW = 6.0, 5.6, 6.6, 4.8, 1.5
    # the banked oval: a ring of short arcs, raised so the banking reads
    N = 96
    for i in range(N):
        th = i * 2 * math.pi / N
        px, py = cx + math.cos(th) * RX, cy + math.sin(th) * RY
        s.box((px - 0.55, py - 0.55, 0), (1.1 + TW * 0.1, 1.1 + TW * 0.1, 0.55),
              {'top': _dark(TRACK, 1.25), 'px': _dark(TRACK, 0.9), 'py': _dark(TRACK, 0.8),
               'nx': _dark(TRACK, 0.9), 'ny': _dark(TRACK, 0.8)})
    for i in range(N):                                                            # the painted apron
        th = i * 2 * math.pi / N
        px, py = cx + math.cos(th) * (RX - 1.0), cy + math.sin(th) * (RY - 1.0)
        s.box((px - 0.3, py - 0.3, 0.55), (0.6, 0.6, 0.05), {'c': MARK})
    # THE INFIELD IS FLAT BOXES, NOT A PRISM. s.prism triangulates its top face and
    # shades each facet, so a 26-sided one came out as a radial FAN across the middle of
    # the icon, a sunburst where the grass should be. A grid of low boxes clipped to the
    # ellipse gives one flat tone, which is what the style bible asks for anyway.
    step, iy = 0.55, -RY
    while iy <= RY:
        ix = -RX
        while ix <= RX:
            if (ix * ix) / ((RX - 1.3) ** 2) + (iy * iy) / ((RY - 1.3) ** 2) <= 1.0:
                s.box((cx + ix, cy + iy, 0.30), (step * 1.06, step * 1.06, 0.22), {'c': INFIELD})
            ix += step
        iy += step
    # GARAGE ROW + pit lane inside, on the front-stretch side
    s.box((cx - 3.4, cy + 1.6, 0.5), (6.8, 1.0, 0.06), {'c': MARK})
    for i in range(7):
        s.box((cx - 3.3 + i * 1.0, cy + 2.7, 0.5), (0.8, 1.5, 1.1),
              {'top': _dark(GARAGE, 1.05), 'px': _dark(GARAGE, 1.0), 'py': _dark(GARAGE, 0.8),
               'nx': _dark(GARAGE), 'ny': _dark(GARAGE)})
    # THE GRANDSTAND, front stretch only — three of the four sides never have stands
    # RAKED, and deliberately low: the first bake put a tall blank slab across the front
    # and it hid the oval, which is the one thing the icon exists to show.
    for i, (dy, hgt) in enumerate(((0.0, 0.9), (0.85, 1.6), (1.7, 2.3))):
        s.box((cx - 5.2, cy + RY + 1.5 + dy, 0), (10.4, 0.85, hgt),
              {'top': _dark(STAND, 1.14), 'px': _win(STAND, 14, 1, 3, 0.0),
               'py': _dark(STAND, 0.82), 'nx': _dark(STAND), 'ny': _dark(STAND)})
    s.box((cx - 0.9, cy + RY + 0.6, 0), (1.8, 0.7, 0.4), {'c': _dark(MARK, 0.8)['c']})   # tunnel mouth
    # the catch fence posts, and one light tower: the tallest thing on the site
    for i in range(0, N, 8):
        th = i * 2 * math.pi / N
        s.box((cx + math.cos(th) * (RX + 1.1) - 0.08, cy + math.sin(th) * (RY + 1.1) - 0.08, 0),
              (0.16, 0.16, 1.5), {'c': FENCE})
    s.box((cx - RX - 2.2, cy - RY - 0.6, 0), (0.32, 0.32, 5.4), {'c': TOWER})
    s.box((cx - RX - 2.6, cy - RY - 1.0, 5.4), (1.1, 1.1, 0.45), {'c': _dark(TOWER, 1.1)['c']})
    # dead cars still on the grid
    for i in range(3):
        _vehicle(s, cx - 2.6 + i * 1.9, cy + 1.7, CAR, CARC, along='x')
    return s, 6.0


# ---------------------------------------------------------------- BALLPARK
def build_ballpark(P):
    """engine/bohemia_ballpark.js: the DIAMOND is the signature and it is a shape
    nothing else in the valley makes — a ninety-degree wedge opening away from one
    corner, where the stadium district is a closed ring around a rectangle.

    THE VIEW IS FROM BEHIND HOME PLATE, which is not a stylistic choice: put the plate
    at the front and the grandstand stands between the viewer and the entire park. Home
    goes at the BACK corner, the field opens toward the viewer, and because the foul
    lines run out along the two ground axes the infield square renders as a true
    DIAMOND in the 45-degree view for free — the real geometry, not a drawn shape."""
    TURF, DIRT, CHALK, STAND = P[4], P[6], P[7], P[2]
    CONC, WALL, TOWER, DUG, PEN, MOUND, LOT = P[9], P[11], P[12], P[8], P[13], P[14], P[1]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(92, 88, 78), lotc=(56, 54, 50))
    hx, hy, FOUL = 1.6, 1.6, 11.2
    # THE FIELD: a quarter disc between the two foul lines, laid as flat boxes (a prism
    # would fan — the speedway infield taught that one)
    step, iy = 0.42, 0.0
    while iy <= FOUL:
        ix = 0.0
        while ix <= FOUL:
            d = math.hypot(ix, iy)
            if d <= FOUL:
                c = DIRT if d > FOUL - 0.9 else TURF                     # warning track inside the wall
                s.box((hx + ix, hy + iy, 0.0), (step * 1.06, step * 1.06, 0.06), {'c': c})
            ix += step
        iy += step
    # THE SKINNED DIAMOND — an axis-aligned square here, a diamond on screen
    BASE = 4.8
    s.box((hx - 0.5, hy - 0.5, 0.05), (BASE + 1.4, BASE + 1.4, 0.05), {'c': DIRT})
    s.box((hx + 0.7, hy + 0.7, 0.09), (BASE - 0.6, BASE - 0.6, 0.04), {'c': _dark(TURF, 1.05)['c']})
    s.prism(hx + BASE / 2, hy + BASE / 2, 0.09, 0.7, 0.20, 14, {'c': MOUND})            # the mound
    for (bxp, byp) in [(hx, hy), (hx + BASE, hy), (hx + BASE, hy + BASE), (hx, hy + BASE)]:
        s.box((bxp - 0.22, byp - 0.22, 0.10), (0.44, 0.44, 0.05), {'c': CHALK})         # the bases
    for t in range(0, 40):                                                             # the chalked foul lines
        f = t / 39.0 * (FOUL - 0.6)
        s.box((hx + f, hy - 0.18, 0.10), (0.3, 0.16, 0.04), {'c': CHALK})
        s.box((hx - 0.18, hy + f, 0.10), (0.16, 0.3, 0.04), {'c': CHALK})
    # THE OUTFIELD WALL, on the same arc as the field
    for i in range(46):
        th = i * (math.pi / 2) / 45.0
        s.box((hx + math.cos(th) * FOUL - 0.16, hy + math.sin(th) * FOUL - 0.16, 0),
              (0.46, 0.46, 0.62), {'top': _dark(WALL, 1.3), 'px': _dark(WALL, 0.95),
               'py': _dark(WALL, 0.95), 'nx': _dark(WALL, 0.8), 'ny': _dark(WALL, 0.8)})
    # THE BOWL: three raked tiers wrapping from foul pole round behind the plate, and the
    # concourse behind them. It stops at the lines — nobody seats the outfield.
    # a 200-degree wrap, not 270: a full three-quarter ring reads as the STADIUM district,
    # and the walkable ballpark's stands stop partway down each line for the same reason
    A0, A1 = math.radians(125), math.radians(325)          # stops 35 deg short of each line
    for tier, (r, hgt) in enumerate(((2.2, 0.75), (2.85, 1.2), (3.5, 1.65))):
        for i in range(56):
            th = A0 + i * (A1 - A0) / 55.0
            s.box((hx + math.cos(th) * r - 0.28, hy + math.sin(th) * r - 0.28, 0),
                  (0.62, 0.62, hgt), {'top': _dark(STAND, 1.18), 'px': _win(STAND, 1, 1, 3 + tier, 0.0),
                   'py': _dark(STAND, 0.86), 'nx': _dark(STAND, 0.8), 'ny': _dark(STAND, 0.8)})
    for i in range(56):
        th = A0 + i * (A1 - A0) / 55.0
        s.box((hx + math.cos(th) * 4.15 - 0.28, hy + math.sin(th) * 4.15 - 0.28, 0), (0.62, 0.62, 0.10),
              {'c': CONC})
    # DUGOUTS on both lines, BULLPENS past them — all in foul territory, where they live
    s.box((hx + 2.6, hy - 1.5, 0), (2.6, 0.8, 0.55), {'top': _dark(DUG, 1.1), 'px': _dark(DUG, 0.9),
          'py': _dark(DUG, 0.8), 'nx': _dark(DUG), 'ny': _dark(DUG)})
    s.box((hx - 1.5, hy + 2.6, 0), (0.8, 2.6, 0.55), {'top': _dark(DUG, 1.1), 'px': _dark(DUG, 0.9),
          'py': _dark(DUG, 0.8), 'nx': _dark(DUG), 'ny': _dark(DUG)})
    s.box((hx + 7.2, hy - 1.8, 0), (2.4, 1.0, 0.75), {'top': _dark(PEN, 1.1), 'px': _dark(PEN, 0.9),
          'py': _dark(PEN, 0.8), 'nx': _dark(PEN), 'ny': _dark(PEN)})
    s.box((hx - 1.8, hy + 7.2, 0), (1.0, 2.4, 0.75), {'top': _dark(PEN, 1.1), 'px': _dark(PEN, 0.9),
          'py': _dark(PEN, 0.8), 'nx': _dark(PEN), 'ny': _dark(PEN)})
    # SIX LIGHT TOWERS ringing the field — the tallest things on a ballpark site
    for (lx, ly) in [(hx - 1.9, hy + 11.4), (hx + 11.4, hy - 1.9), (hx + 9.2, hy + 9.2),
                     (hx + 12.2, hy + 4.6), (hx + 4.6, hy + 12.2), (hx - 3.6, hy - 3.6)]:
        s.box((lx - 0.18, ly - 0.18, 0), (0.36, 0.36, 8.6), {'c': TOWER})
        s.box((lx - 0.7, ly - 0.7, 8.6), (1.4, 1.4, 0.5),
              {'c': tuple(min(255, int(c * 1.14)) for c in TOWER)})
    _vehicle(s, 13.4, 13.4, CAR, _dark(LOT, 1.4)['c'], along='x')                        # one car in the lot
    return s, 5.2


# ---------------------------------------------------------------- TOWN
def build_town(P):
    """engine/bohemia_town.js: the signature is the STREET WALL — attached false-front
    storefronts shoulder to shoulder on both sides of one wide street, with the covered
    boardwalk between them and the kerb, and the WATER TOWER standing over the lot as
    the tallest thing and the reason the town is there at all.

    The one CROSS STREET is in the icon on purpose. It is what the walkable district
    was missing in its first pass, and without it a main street reads as a corridor
    instead of a town: the block is the unit, and a block needs a corner."""
    STREET, FRONT, FALSE, SALOON = P[1], P[2], P[7], P[8]
    WALK, HOUSE, TOWER, POLE, MARK, CANOPY, SHED = P[6], P[9], P[11], P[12], P[10], P[16], P[15]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(104, 96, 76), lotc=(52, 52, 58),
            drive=(5.0, -3, 9.2, 15))
    s.box((5.0, 5.4, 0.02), (10.0, 2.6, 0.05), {'c': _dark(STREET, 1.25)['c']})          # the cross street
    for t in range(9):                                                                  # angle bays down both kerbs
        yb = -2.0 + t * 1.7
        if 5.0 < yb < 8.2:
            continue
        s.box((5.05, yb, 0.06), (1.1, 0.22, 0.04), {'c': MARK})
        s.box((8.05, yb, 0.06), (1.1, 0.22, 0.04), {'c': MARK})
    # THE STREET WALL, both sides, cut by the cross street, each unit a different height
    for side, (bx, bw, wx) in enumerate(((1.2, 3.6, 4.85), (9.3, 3.6, 9.15))):
        s.box((wx - (0.55 if side else 0.0), -3, 0.02), (0.6, 18, 0.09), {'c': WALK})    # the boardwalk
        runs, yy, unit = [], -2.6, 0
        while yy < 14.0:
            hgt = 1.6 + ((unit * 7 + side * 3) % 5) * 0.34
            dep = 1.5 + ((unit * 5 + side) % 3) * 0.5
            if not (yy + dep > 5.0 and yy < 8.2):                                       # skip the junction
                anchor = (side == 0 and unit == 2) or (side == 1 and unit == 5)
                col = SALOON if anchor else FRONT
                s.box((bx, yy, 0), (bw, dep - 0.12, hgt),
                      {'top': _dark(col, 0.88), 'px': _win(col, 3, 2, unit + side * 4),
                       'py': _win(col, 2, 2, unit + 7), 'nx': _dark(col), 'ny': _dark(col)})
                # THE FALSE FRONT: a parapet on the STREET face, taller than the roof it hides
                fx = bx + bw - 0.2 if side == 0 else bx
                s.box((fx, yy, 0), (0.2, dep - 0.12, hgt + 0.55),
                      {'top': _dark(FALSE, 1.1), 'px': _dark(FALSE, 1.0), 'py': _dark(FALSE, 0.85),
                       'nx': _dark(FALSE, 1.0), 'ny': _dark(FALSE, 0.85)})
                runs.append((yy, dep))
            yy += dep
            unit += 1
        # the continuous shade canopy over the boardwalk, which is why anybody walked it
        for (ry, rd) in runs:
            s.box((wx - (0.65 if side else -0.05), ry + 0.1, 1.55), (0.75, rd - 0.3, 0.12),
                  {'c': _dark(WALK, 0.78)['c']})
    # HOUSES on dirt lots out back, and a shed
    for (hx2, hy2, hw2, hd2) in [(-2.4, -1.4, 2.4, 2.0), (-2.4, 2.4, 2.0, 2.6),
                                 (13.0, 0.4, 2.2, 2.4), (13.0, 9.4, 2.4, 2.0)]:
        s.box((hx2, hy2, 0), (hw2, hd2, 1.5), {'top': _dark(HOUSE, 0.88), 'px': _win(HOUSE, 2, 1, 4),
              'py': _win(HOUSE, 2, 1, 8), 'nx': _dark(HOUSE), 'ny': _dark(HOUSE)})
        s.box((hx2 - 0.15, hy2 - 0.15, 1.5), (hw2 + 0.3, hd2 + 0.3, 0.28), {'c': _dark(HOUSE, 1.12)['c']})
    s.box((-2.2, 6.2, 0), (1.4, 1.2, 1.0), {'c': SHED})
    # THE GAS STATION at the town's mouth: pumps under a canopy you walk under
    for (cpx, cpy) in [(10.4, 11.6), (13.4, 11.6), (10.4, 13.6), (13.4, 13.6)]:
        s.box((cpx - 0.11, cpy - 0.11, 0), (0.22, 0.22, 1.9), {'c': POLE})
    s.box((10.1, 11.3, 1.9), (3.6, 2.6, 0.32), {'top': {'c': CANOPY}, 'px': _dark(CANOPY, 0.85),
          'py': _dark(CANOPY, 0.85), 'nx': _dark(CANOPY, 0.85), 'ny': _dark(CANOPY, 0.85)})
    for px2 in (11.2, 12.6):
        s.box((px2, 12.3, 0), (0.4, 0.6, 0.9), {'c': _dark(FRONT, 0.7)['c']})
    # THE WATER TOWER — the tallest thing here, and the reason the town is here
    for (lx2, ly2) in [(-1.6, 11.2), (0.6, 11.2), (-1.6, 13.4), (0.6, 13.4)]:
        s.box((lx2 - 0.12, ly2 - 0.12, 0), (0.24, 0.24, 4.2), {'c': _dark(TOWER, 0.82)['c']})
    s.prism(-0.5, 12.3, 4.2, 1.7, 1.9, 14, {'c': TOWER}, {'c': _dark(TOWER, 1.16)['c']})
    s.prism(-0.5, 12.3, 6.1, 1.2, 0.7, 14, {'c': _dark(TOWER, 1.1)['c']})
    for py3 in (0.0, 9.6):                                                              # dark pole lights
        s.box((4.55, py3, 0), (0.18, 0.18, 2.6), {'c': POLE})
        s.box((9.45, py3 + 2.4, 0), (0.18, 0.18, 2.6), {'c': POLE})
    _vehicle(s, 6.2, 3.2, CAR, (86, 82, 76), along='y')                                 # left where it died
    _vehicle(s, 7.8, 10.4, CAR, (74, 72, 70), along='y')
    return s, 6.2


# =============================================================================
# THE NO-ICON DEBT, PAID (8/4/26).
#
# Paolo approved the four civics at 85% on the big-icons language, and APPROVAL
# UNLOCKS VOLUME. Twenty-one registered districts had NO map icon at all -- a
# third of the valley rendering as nothing at the zoom he actually navigates by.
# He scored the chapel's missing icon 0% on 8/2 and he was right to: an empty
# panel is worth exactly nothing.
#
# Every one below is built to the SAME approved language:
#   THE BUILDING IS THE ICON. No parking, ever. The pad is fitted, never declared.
#   ONE READABLE SIGNATURE per district, and it is the thing you would name if
#   somebody pointed at the plot and asked what it was.
#   Grounded in what the WALKABLE district actually contains -- the legend codes
#   are read straight off each engine module, so the icon and the ground agree.
#
# Airport and airbase stay OUT. They are finished, they are wrong, the reason is
# written above HEROES, and it is Paolo's design call and not mine to guess a
# fifth time.
# =============================================================================


def build_apartment(P):
    """engine/bohemia_apartment.js: a Sun Belt garden-apartment court. The signature is
    the EXTERIOR STAIR AND WALKWAY -- Vegas walk-ups put their circulation on the
    outside of the building, so the stairs and the deck rails ARE the elevation, and
    the drained POOL in the courtyard is the second thing you name."""
    BLDG, STAIR, CLUB, POOL, FENCE = P[2], P[15], P[7], P[8], P[12]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(112, 104, 88), lotc=(60, 60, 66))
    for (bx, by, bw, bd) in [(-2.0, -2.0, 4.4, 10.0), (8.6, -2.0, 4.4, 10.0),
                             (-2.0, 9.0, 15.0, 3.6)]:
        s.box((bx, by, 0), (bw, bd, 6.6),
              {'top': _dark(BLDG, 0.9), 'px': _win(BLDG, 3, 3, 4), 'py': _win(BLDG, 5, 3, 7),
               'nx': _win(BLDG, 3, 3, 9), 'ny': _win(BLDG, 5, 3, 2)})
        s.box((bx - 0.18, by - 0.18, 6.6), (bw + 0.36, bd + 0.36, 0.38), {'c': _dark(BLDG, 1.14)['c']})
        # THE EXTERIOR WALKWAY DECKS, two levels, CANTILEVERED OFF the courtyard face --
        # entirely outside the block's own plan, which is what an exterior walkway is and
        # also what stops it reading as a slab passing through the building.
        if bw < 6:
            wx = (bx + bw) if bx < 4 else (bx - 0.75)
            for lev in (2.1, 4.4):
                # the deck STOPS at the stair tower; a walkway that runs through its own
                # stair is a slab tunnelling through a mass, which is a rendering error
                s.box((wx, by + 0.3, lev), (0.75, bd - 2.1, 0.16), {'c': STAIR})
                for ry in range(5):
                    s.box((wx + (0.67 if bx < 4 else 0.0), by + 0.5 + ry * 1.5, lev), (0.08, 0.08, 0.8), {'c': STAIR})
            s.box((wx, by + bd - 1.7, 0), (0.75, 1.5, 4.9), {'c': _dark(STAIR, 0.86)['c']})  # the stair tower
    s.box((3.2, 1.4, -0.05), (4.2, 4.6, 0.12), {'c': _dark(POOL, 0.7)['c']})            # the drained pool
    s.box((3.6, 1.8, 0.05), (3.4, 3.8, 0.08), {'c': POOL})
    s.box((3.0, 6.6, 0), (4.6, 2.0, 3.2), {'top': _dark(CLUB, 0.9), 'px': _win(CLUB, 4, 2, 5),
          'py': _dark(CLUB, 0.86), 'nx': _dark(CLUB), 'ny': _dark(CLUB)})                # the clubhouse
    _door_face(s, (3.0, 6.6, 0), (4.6, 2.0, 3.2), width=1.1, ztop=2.0)
    for (fx, fy) in [(-2.6, -2.6), (13.4, -2.6), (13.4, 12.8), (-2.6, 12.8)]:
        s.box((fx, fy, 0), (0.16, 0.16, 1.9), {'c': FENCE})
    return s, 6.2


def build_suburb(P):
    """engine/bohemia_suburb.js: the signature is the CUL-DE-SAC -- houses shoulder to
    shoulder around a bulb of road behind a continuous block WALL, which is what a Sun
    Belt subdivision is from the air and why the 7/21 research called the privacy wall
    the defining feature. Garages face the street; the wall faces everything else."""
    HOUSE, ROOF, WALL, ROAD, GARAGE = P[2], P[9], P[4], P[1], P[6]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(116, 106, 88), lotc=(58, 58, 62))
    s.box((4.6, -3.0, 0.01), (2.8, 11.0, 0.07), {'c': ROAD})                             # the street in
    s.prism(6.0, 9.6, 0.01, 3.4, 0.07, 20, {'c': ROAD})                                  # the BULB
    lots = [(-1.4, -1.6), (-1.4, 2.6), (-1.4, 6.8), (9.0, -1.6), (9.0, 2.6), (9.0, 6.8),
            (1.4, 11.6), (7.2, 11.6)]
    for i, (hx, hy) in enumerate(lots):
        hw, hd = 3.4, 3.2
        # TWO-STOREY IS THE MAJORITY in a Sun Belt subdivision, not the exception -- five of
        # the eight, which is what Summerlin actually looks like and what stops a ring of
        # houses squinting into any other low field.
        s.box((hx, hy, 0), (hw, hd, 2.9 + (i % 3) * 0.5 + (2.6 if i % 8 < 5 else 0.0)),
              {'top': _dark(HOUSE, 0.9), 'px': _win(HOUSE, 3, 2, i), 'py': _win(HOUSE, 3, 2, i + 5),
               'nx': _dark(HOUSE), 'ny': _dark(HOUSE)})
        _gable(s, (hx - 0.2, hy - 0.2, 2.9 + (i % 3) * 0.5 + (2.6 if i % 8 < 5 else 0.0)),
               (hw + 0.4, hd + 0.4, 0), 1.15, ROOF)
        gx = hx + hw if hx < 4 else hx - 1.5
        s.box((gx, hy + 0.6, 0), (1.5, 1.9, 2.2), {'top': _dark(ROOF, 0.95), 'px': {'c': GARAGE},
              'py': _dark(HOUSE, 0.86), 'nx': {'c': GARAGE}, 'ny': _dark(HOUSE, 0.86)})   # the garage door
        if i < 3:                                                                          # and the FRONT DOOR
            _door_face(s, (hx, hy, 0), (hw, hd, 2.9 + (i % 3) * 0.5 + (2.6 if i % 8 < 5 else 0.0)),
                       width=0.8, ztop=1.7)
    # THE BLOCK WALL, continuous, which is the whole point of the form
    for (wx, wy, ww, wd) in [(-2.6, -2.6, 15.4, 0.3), (-2.6, -2.6, 0.3, 15.4),
                             (12.5, -2.6, 0.3, 15.4), (-2.6, 12.5, 15.4, 0.3)]:
        s.box((wx, wy, 0), (ww, wd, 2.1), {'top': _dark(WALL, 1.12), 'px': _dark(WALL, 1.0),
              'py': _dark(WALL, 0.84), 'nx': _dark(WALL, 1.0), 'ny': _dark(WALL, 0.84)})
    return s, 6.0


def build_trailer(P):
    """engine/bohemia_trailer.js: rows of SINGLE-WIDES on their pads, long axis all the
    same way, skirted, with the sheds and propane bottles between them. The signature is
    the REPETITION and the one BURNED unit that stopped the row -- a trailer park reads
    as a barcode from above and that is exactly what it should look like."""
    HOME, BURNT, SHED, PROP, FENCE, POLE = P[2], P[8], P[7], P[13], P[12], P[9]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(114, 104, 84), lotc=(74, 70, 62))
    # THE MANAGER'S DOUBLE-WIDE, crosswise at the mouth: twice the width, its own porch,
    # and turned 90 degrees to every other unit. Real parks put the office at the entrance
    # and it is the one unit that is not a single-wide.
    s.box((-2.4, -2.6, 0), (4.6, 4.4, 3.4),
          {'top': _dark(HOME, 0.9), 'px': _win(HOME, 4, 2, 3), 'py': _win(HOME, 4, 2, 8),
           'nx': _dark(HOME), 'ny': _dark(HOME)})
    s.box((-2.6, -2.8, 3.4), (5.0, 4.8, 0.36), {'c': _dark(HOME, 1.18)['c']})
    _door_face(s, (-2.4, -2.6, 0), (4.6, 4.4, 3.4), width=0.9, ztop=2.0)
    for ri, ry in enumerate((2.6, 5.6, 8.6, 11.6, 14.6)):
        for ci, base in enumerate((-2.2, 7.6)):
            cx = base + ri * 1.15 * (1 if ci == 0 else -1)      # THE ECHELON: pads angled off the loop
            burned = (ri == 2 and ci == 0)
            col = BURNT if burned else HOME
            hgt = 1.4 if burned else 2.5
            s.box((cx, ry, 0), (4.6, 2.4, hgt),
                  {'top': _dark(col, 0.92), 'px': _win(col, 4, 1, ri * 3 + ci),
                   'py': _win(col, 4, 1, ri + ci * 5), 'nx': _dark(col), 'ny': _dark(col)})
            if not burned:
                s.box((cx - 0.12, ry + 1.0, hgt), (4.84, 0.4, 0.26), {'c': _dark(col, 1.16)['c']})  # the ridge cap
                s.box((cx + 0.2, ry - 0.05, 0), (0.9, 0.1, 0.05), {'c': _dark(col, 0.6)['c']})      # skirting gap
                if ri == 0 and ci == 0:                                                            # a way into a home
                    _door_face(s, (cx, ry, 0), (4.6, 2.4, hgt), width=0.7, ztop=1.6)
                s.box((cx + 4.7, ry + 0.5, 0), (0.9, 1.0, 1.3), {'c': SHED})                        # the shed
                s.box((cx + 4.75, ry + 1.8, 0), (0.35, 0.35, 0.75), {'c': PROP})                    # propane bottle
    for (fx, fy) in [(-2.7, -2.7), (13.3, -2.7), (13.3, 15.2), (-2.7, 15.2)]:
        s.box((fx, fy, 0), (0.16, 0.16, 1.8), {'c': FENCE})
    # THE YARD LIGHT: one tall pole lighting the whole lot, which is the only thing in a
    # mobile home park taller than a single-wide and the one vertical it honestly has.
    s.box((6.4, 5.9, 0), (0.4, 0.4, 9.2), {'c': _dark(POLE, 0.88)['c']})
    s.box((6.05, 5.55, 9.2), (1.1, 1.1, 0.6), {'c': POLE})
    for k in range(3):                                                                      # its guy wires' anchors
        s.box((6.5 + [1.4, -1.4, 0.0][k], 6.0 + [0.0, 0.0, 1.5][k], 0), (0.16, 0.16, 0.5),
              {'c': _dark(POLE, 0.7)['c']})
    return s, 5.6


def build_cemetery(P):
    """engine/bohemia_cemetery.js: the MAUSOLEUM is the only building with height on a
    memorial park, and the HEADSTONE FIELD around it is the pattern you recognise from
    the air -- a grid of small pale marks, which is why the walkable plot carries 917 of
    them. The obelisk gives the plot its one vertical."""
    MAUS, STONE, OBEL, CHAPEL, COLUM, TREE = P[7], P[6], P[11], P[2], P[8], P[3]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(112, 108, 92), lotc=(60, 60, 62))
    s.box((3.6, 3.0, 0), (5.2, 4.4, 5.0), {'top': _dark(MAUS, 0.9), 'px': _dark(MAUS, 1.0),
          'py': _dark(MAUS, 0.84), 'nx': _dark(MAUS), 'ny': _dark(MAUS)})                 # THE MAUSOLEUM
    for cx in (4.0, 5.4, 6.8, 8.2):                                                       # its colonnade front
        s.box((cx, 7.4, 0), (0.5, 0.45, 4.2), {'c': _dark(MAUS, 1.12)['c']})
    s.box((3.4, 2.8, 5.0), (5.6, 4.8, 0.42), {'c': _dark(MAUS, 1.16)['c']})
    _door_face(s, (3.6, 3.0, 0), (5.2, 4.4, 5.0), width=1.3, ztop=2.4)
    for gy in (-2.0, -0.6, 0.8, 8.8, 10.2, 11.6, 13.0):                                   # THE HEADSTONE FIELD
        for gx in range(11):
            s.box((-2.0 + gx * 1.42, gy, 0), (0.45, 0.28, 0.62), {'c': STONE})
    for gy in (2.4, 4.0, 5.6, 7.2):
        for gx in (0, 1, 7, 8, 9, 10):
            s.box((-2.0 + gx * 1.42, gy, 0), (0.45, 0.28, 0.62), {'c': STONE})
    s.box((10.6, 5.0, 0), (1.3, 1.3, 1.0), {'c': _dark(OBEL, 0.9)['c']})                  # THE OBELISK
    s.box((10.85, 5.25, 1.0), (0.8, 0.8, 5.6), {'c': OBEL})
    s.prism(11.25, 5.65, 6.6, 0.55, 0.9, 4, {'c': _dark(OBEL, 1.15)['c']})
    s.box((-2.2, 3.2, 0), (2.6, 4.0, 2.2), {'c': COLUM})                                  # the columbarium wall
    s.box((-2.2, 3.2, 2.2), (2.6, 4.0, 0.22), {'c': _dark(COLUM, 1.14)['c']})
    for (tx, ty) in [(1.6, 1.4), (9.6, 9.4), (1.4, 9.6)]:
        s.box((tx, ty, 0), (0.22, 0.22, 2.0), {'c': TREE})
        s.box((tx - 0.4, ty - 0.4, 2.0), (1.0, 1.0, 0.3), {'c': _dark(TREE, 0.9)['c']})
    return s, 6.0


def build_jail(P):
    """engine/bohemia_jail.js, built on the CLARK COUNTY DETENTION CENTER (JMA Architects
    with HOK, 1981-84, 330 S Casino Center Blvd). The thing worth knowing about it is the
    brief: it sits blocks from Fremont and the architects were told to design a jail THAT
    WOULD NOT LOOK LIKE ONE, so it is a twelve-storey, 350,000 sq ft tower with narrow
    horizontal bands of recessed windows -- an office block, until you see the walled yard
    and the guard towers at its feet. That contradiction IS the icon."""
    TOWER, WALL, GUARD, YARD, WIRE, POLE = P[2], P[12], P[6], P[7], P[8], P[9]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(96, 94, 90), lotc=(58, 58, 62))
    # THE TOWER: it reads as an office block on purpose. Narrow horizontal window bands.
    s.box((1.0, 0.6, 0), (6.4, 5.0, 14.5),
          {'top': _dark(TOWER, 0.9), 'px': _win(TOWER, 7, 9, 4), 'py': _win(TOWER, 6, 9, 8),
           'nx': _win(TOWER, 7, 9, 12), 'ny': _win(TOWER, 6, 9, 3)})
    s.box((0.8, 0.4, 14.5), (6.8, 5.4, 0.5), {'c': _dark(TOWER, 1.14)['c']})
    s.box((2.2, 1.8, 15.0), (2.6, 2.2, 1.2), {'c': _dark(TOWER, 0.96)['c']})              # rooftop plant
    _door_face(s, (1.0, 0.6, 0), (6.4, 5.0, 14.5), width=1.4, ztop=2.6)
    s.box((8.0, 1.4, 0), (4.4, 4.0, 4.2), {'top': _dark(TOWER, 0.88), 'px': _win(TOWER, 4, 3, 6),
          'py': _dark(TOWER, 0.86), 'nx': _dark(TOWER), 'ny': _dark(TOWER)})              # the low intake block
    # THE SECURE YARD: the wall with wire on top is what a tower alone would never say
    s.box((-2.4, 7.2, 0.02), (15.0, 5.6, 0.06), {'c': YARD})
    for (wx, wy, ww, wd) in [(-2.6, 6.9, 15.4, 0.34), (-2.6, 6.9, 0.34, 6.2),
                             (12.4, 6.9, 0.34, 6.2), (-2.6, 12.8, 15.4, 0.34)]:
        s.box((wx, wy, 0), (ww, wd, 3.4), {'top': {'c': WIRE}, 'px': _dark(WALL, 1.0),
              'py': _dark(WALL, 0.84), 'nx': _dark(WALL, 1.0), 'ny': _dark(WALL, 0.84)})
    for (gx, gy) in [(-2.2, 7.3), (12.0, 7.3), (-2.2, 12.4), (12.0, 12.4)]:               # THE GUARD TOWERS
        s.box((gx, gy, 0), (0.5, 0.5, 5.2), {'c': _dark(GUARD, 0.86)['c']})
        s.box((gx - 0.5, gy - 0.5, 5.2), (1.5, 1.5, 1.5), {'top': _dark(GUARD, 1.1),
              'px': _win(GUARD, 2, 1, 3), 'py': _win(GUARD, 2, 1, 7), 'nx': _win(GUARD, 2, 1, 5),
              'ny': _win(GUARD, 2, 1, 9)})
    s.box((5.0, 9.4, 0), (0.2, 0.2, 3.6), {'c': POLE})
    return s, 5.4


def build_landfill(P):
    """engine/bohemia_landfill.js, built on APEX REGIONAL (2,200 acres, the largest
    landfill in the world by area and volume, up to 15,000 tons a day at peak). Its shape
    is not a pit, it is a MOUNTAIN: the valley is etched into stepped TERRACES with the
    waste layered under each one like a sheet cake, gas wells piped across the face, and
    a flare stack burning what the 12 MW methane plant does not take. The terraced mound
    is the icon; nothing else in the valley has that stepped profile."""
    FILL, BERM, SOIL, BLDG, GAS, POND, DOZER = P[6], P[7], P[4], P[2], P[13], P[8], P[10]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(104, 92, 74), lotc=(78, 72, 60))
    # THE TERRACED MOUND: four stepped benches, each smaller, each a value lighter
    steps = [(-0.5, 0.0, 12.0, 11.5, 0.0, 2.4), (0.8, 1.2, 9.4, 9.0, 2.4, 2.2),
             (2.1, 2.4, 6.8, 6.6, 4.6, 2.0), (3.4, 3.6, 4.2, 4.2, 6.6, 1.8)]
    for i, (bx, by, bw, bd, bz, bh) in enumerate(steps):
        c = tuple(min(255, int(v * (0.88 + i * 0.07))) for v in FILL)
        s.box((bx, by, bz), (bw, bd, bh), {'top': _dark(c, 1.12), 'px': _dark(c, 1.0),
              'py': _dark(c, 0.82), 'nx': _dark(c, 1.0), 'ny': _dark(c, 0.82)})
        s.box((bx, by, bz + bh), (bw, bd, 0.16), {'c': BERM})                             # the cell berm lip
    # THE WORKING FACE: raw fill and a dozer on the top bench
    s.box((3.8, 4.0, 8.4), (3.4, 3.4, 0.14), {'c': _dark(SOIL, 0.9)['c']})
    _vehicle(s, 4.6, 5.2, CAR, DOZER, along='x')
    # THE GAS WELLS piped down the face, and the FLARE STACK
    for (wx, wy, wz) in [(1.4, 1.8, 2.4), (2.6, 3.0, 4.6), (4.0, 4.2, 6.6), (9.2, 8.0, 0.0), (1.0, 9.0, 0.0)]:
        s.box((wx, wy, wz), (0.22, 0.22, 1.1), {'c': GAS})
    s.box((12.4, 1.0, 0), (1.4, 1.4, 1.2), {'c': _dark(GAS, 0.8)['c']})
    s.box((12.75, 1.35, 1.2), (0.7, 0.7, 7.4), {'c': GAS})
    s.box((12.55, 1.15, 8.6), (1.1, 1.1, 0.7), {'c': _dark(GAS, 1.2)['c']})               # the flare head
    s.box((-2.4, 8.6, 0), (3.0, 2.6, 3.0), {'top': _dark(BLDG, 0.9), 'px': _win(BLDG, 3, 2, 5),
          'py': _dark(BLDG, 0.86), 'nx': _dark(BLDG), 'ny': _dark(BLDG)})                 # the scale house
    _door_face(s, (-2.4, 8.6, 0), (3.0, 2.6, 3.0), width=1.0, ztop=2.0)
    s.box((8.6, 11.4, -0.05), (4.0, 2.6, 0.12), {'c': POND})                              # the leachate pond
    return s, 5.6


def build_railyard(P):
    """engine/bohemia_railyard.js: the signature is the FAN -- a bundle of parallel tracks
    spreading out of one throat, which is the only place in the valley that shape occurs.
    The ENGINE SHED at the head of it and the GANTRY CRANE straddling the container road
    are what give the fan a scale, and a locomotive sits in the shed road because an empty
    yard is a car park with rails in it."""
    SHED, TRACK, LOCOC, BOX, CONT, CRANE, POLE = P[2], P[6], P[8], P[7], P[10], P[13], P[9]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(96, 92, 84), lotc=(66, 64, 58))
    BALLAST = P[4]
    RAILPAL = (BALLAST, _dark(BALLAST, 0.72)['c'], TRACK)
    for i, ty in enumerate((0.4, 2.0, 3.6, 5.2, 6.8, 8.4, 10.0)):                         # THE TRACK FAN
        _track(s, -2.6 + i * 0.9, 13.0, ty, RAILPAL)
    s.box((-2.6, -0.6, 0), (7.4, 8.4, 9.4), {'top': _dark(SHED, 0.9), 'px': _win(SHED, 4, 6, 3),
          'py': _win(SHED, 7, 6, 6), 'nx': _dark(SHED), 'ny': _win(SHED, 7, 6, 11)})      # THE RUNNING SHED
    s.box((-2.9, -0.9, 9.4), (8.0, 9.0, 0.5), {'c': _dark(SHED, 1.14)['c']})
    for mv in (1.2, 3.6, 6.0):                                                            # its roof monitors
        s.box((-2.0, mv, 9.9), (6.2, 1.1, 1.3), {'top': _dark(SHED, 1.2), 'px': _dark(SHED, 1.05),
              'py': _dark(SHED, 0.8), 'nx': _dark(SHED, 1.05), 'ny': _dark(SHED, 0.8)})
    for dz in (0.4, 2.0, 3.6, 5.2, 6.8):                                                  # its five shed roads
        s.box((4.78, dz, 0), (0.06, 1.2, 4.2), {'c': _dark(SHED, 0.55)['c']})
    # no at_y: the leaf centres itself in the solid's own y-span. Passing one by hand is how
    # this door ended up 0.8 off the end of its own wall -- the same trap, again.
    _door_face(s, (-2.6, -0.6, 0), (7.4, 8.4, 9.4), width=1.6, ztop=3.6)                  # the man door
    _railcar(s, 3.4, 0.1, LOCO, LOCOC, along='x')                                         # the locomotive, shed road
    _railcar(s, 7.6, 3.3, RAILCAR, BOX, along='x')
    _railcar(s, 4.0, 4.9, RAILCAR, _dark(BOX, 0.86)['c'], along='x')
    _railcar(s, 8.4, 6.5, RAILCAR, BOX, along='x')
    # THE GANTRY CRANE straddling the container road
    for (lx, ly) in [(5.0, 8.0), (5.0, 12.2), (10.6, 8.0), (10.6, 12.2)]:
        s.box((lx, ly, 0), (0.3, 0.3, 5.4), {'c': _dark(CRANE, 0.86)['c']})
    s.box((4.7, 7.8, 5.4), (6.2, 0.7, 0.7), {'c': CRANE})
    s.box((4.7, 11.9, 5.4), (6.2, 0.7, 0.7), {'c': CRANE})
    s.box((7.2, 7.8, 6.1), (1.3, 4.8, 0.4), {'c': _dark(CRANE, 1.12)['c']})
    for (cx, cy) in [(5.6, 9.0), (5.6, 10.4), (8.4, 9.0), (8.4, 10.4), (8.4, 11.0)]:
        s.box((cx, cy, 0), (2.5, 1.1, 1.1), {'top': _dark(CONT, 1.1), 'px': _dark(CONT, 1.0),
              'py': _dark(CONT, 0.82), 'nx': _dark(CONT, 1.0), 'ny': _dark(CONT, 0.82)})
    s.box((11.8, 2.4, 0), (0.22, 0.22, 4.0), {'c': POLE})
    return s, 5.6


def build_substation(P):
    """engine/bohemia_substation.js: a transmission substation is a YARD OF FRAMES, not a
    building -- lattice switchgear structures carrying the busbars overhead, transformer
    banks with their radiator fins under them, and the little control house that runs it
    all. The lattice IS the silhouette, and it is the only place in the valley that
    reads as an open steel frame against sky."""
    CTRL, XFMR, SWG, BUS, INSUL, FENCE = P[2], P[6], P[7], P[8], P[10], P[12]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(104, 100, 92), lotc=(72, 70, 64))
    # THE SWITCHGEAR LATTICE: two frames of legs carrying the busbar gantries
    for fy in (0.6, 5.4, 10.2):
        for lx in (-1.6, 2.4, 6.4, 10.4):
            s.box((lx, fy, 0), (0.32, 0.32, 7.4), {'c': _dark(SWG, 0.86)['c']})
            s.box((lx - 0.1, fy - 0.1, 3.4), (0.52, 0.52, 0.2), {'c': SWG})                # the mid brace
        s.box((-1.8, fy - 0.1, 7.4), (12.6, 0.5, 0.5), {'c': SWG})                          # the top gantry
        for bx in (-1.0, 3.0, 7.0, 11.0):                                                   # THE BUSBAR run
            s.box((bx, fy + 0.1, 8.0), (0.16, 0.16, 0.9), {'c': INSUL})
        s.box((-1.6, fy + 0.14, 8.9), (12.3, 0.1, 0.1), {'c': BUS})
    # THE TRANSFORMER BANKS, radiator fins on the flanks
    for (tx, ty) in [(0.2, 2.2), (4.2, 2.2), (8.2, 2.2)]:
        s.box((tx, ty, 0), (3.4, 3.2, 5.4), {'top': _dark(XFMR, 1.08), 'px': _dark(XFMR, 1.0),
              'py': _dark(XFMR, 0.82), 'nx': _dark(XFMR, 1.0), 'ny': _dark(XFMR, 0.82)})
        for fn in range(6):
            s.box((tx + 0.3 + fn * 0.5, ty - 0.26, 0.5), (0.26, 0.26, 4.2), {'c': _dark(XFMR, 0.72)['c']})
        for bh in (0.9, 1.9):                                                                # bushings
            s.box((tx + bh, ty + 1.1, 5.4), (0.9, 0.9, 1.6), {'c': INSUL})
        # THE FIRE WALL between banks: blast-rated concrete, and the reason a bank row is a
        # WALL OF MASS rather than a field of cabinets
        s.box((tx + 3.5, ty - 0.4, 0), (0.4, 4.0, 6.6), {'top': _dark(CTRL, 1.15), 'px': _dark(CTRL, 1.0),
              'py': _dark(CTRL, 0.8), 'nx': _dark(CTRL, 1.0), 'ny': _dark(CTRL, 0.8)})
    s.box((-2.4, 11.4, 0), (4.2, 2.6, 3.4), {'top': _dark(CTRL, 0.9), 'px': _win(CTRL, 4, 2, 5),
          'py': _dark(CTRL, 0.86), 'nx': _dark(CTRL), 'ny': _dark(CTRL)})                   # THE CONTROL HOUSE
    _door_face(s, (-2.4, 11.4, 0), (4.2, 2.6, 3.4), width=1.1, ztop=2.2)
    for (fx, fy) in [(-2.8, -2.2), (12.6, -2.2), (12.6, 13.6), (-2.8, 13.6)]:
        s.box((fx, fy, 0), (0.18, 0.18, 2.4), {'c': FENCE})
    return s, 5.6


def build_watertreat(P):
    """engine/bohemia_watertreat.js: the signature is CIRCLES. A water reclamation plant
    is the only industrial site whose plan is round -- the clarifiers are big open drums
    with a rotating bridge across each one -- and the rectangular aeration basins beside
    them are what makes the circles read as circles. Vegas returns nearly all its indoor
    water through plants like this, which is why the valley has one at all."""
    BLDG, CLAR, BASIN, PIPE, SLUDGE, FENCE = P[2], P[6], P[7], P[8], P[10], P[12]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(106, 104, 98), lotc=(70, 70, 66))
    for (cx, cy, rad, wall) in [(1.4, 3.2, 4.4, 4.6), (9.2, 3.2, 4.4, 4.6),
                                (1.4, 11.0, 2.4, 3.0), (9.2, 11.0, 2.4, 3.0)]:
        s.prism(cx, cy, 0, rad, wall, 24, {'c': CLAR}, {'c': _dark(SLUDGE, 0.9)['c']}, inner=rad - 0.7)
        s.prism(cx, cy, 0, rad - 0.7, 0.5, 24, {'c': _dark(SLUDGE, 0.8)['c']},
                {'c': _dark(SLUDGE, 1.0)['c']})                                             # crusted floor
        s.box((cx - rad, cy - 0.2, wall), (rad * 2, 0.4, 0.3), {'c': PIPE})                 # the rotating bridge
        s.box((cx - 0.4, cy - 0.4, wall), (0.8, 0.8, 1.4), {'c': _dark(PIPE, 1.1)['c']})    # its centre drive
    s.box((5.9, -1.4, -0.05), (2.4, 15.0, 0.1), {'c': _dark(BASIN, 0.8)['c']})              # the aeration channel
    for by in range(8):                                                                     # its baffle walls
        s.box((5.9, -1.4 + by * 1.9, 0), (2.4, 0.22, 1.6), {'c': BASIN})
    s.box((5.9, -1.4, 0), (0.22, 15.0, 1.6), {'c': BASIN})
    s.box((8.08, -1.4, 0), (0.22, 15.0, 1.6), {'c': BASIN})
    s.box((-2.4, 5.2, 0), (3.4, 3.0, 4.6), {'top': _dark(BLDG, 0.9), 'px': _win(BLDG, 3, 3, 5),
          'py': _dark(BLDG, 0.86), 'nx': _dark(BLDG), 'ny': _dark(BLDG)})                   # blower / control
    _door_face(s, (-2.4, 5.2, 0), (3.4, 3.0, 4.6), width=1.1, ztop=2.3)
    # THE DIGESTERS: the tall cone-roofed drums that make a treatment plant read from a
    # distance. Without them the whole site is knee-high and the icon has no vertical.
    for (dx2, dy2) in [(12.6, 6.0), (12.6, 10.6)]:
        s.prism(dx2, dy2, 0, 1.6, 6.6, 16, {'c': _dark(BLDG, 0.94)['c']},
                {'c': _dark(BLDG, 1.06)['c']})
        s.prism(dx2, dy2, 6.6, 1.35, 1.5, 16, {'c': _dark(PIPE, 0.9)['c']},
                {'c': _dark(PIPE, 1.1)['c']})                                               # the fixed cone roof
        s.box((dx2 - 0.16, dy2 - 0.16, 8.1), (0.32, 0.32, 0.9), {'c': PIPE})                # the gas takeoff
    for px in (8.4, 10.4, 12.4):                                                            # the pipe gallery
        s.box((px, 12.6, 0.8), (0.36, 0.36, 0.5), {'c': PIPE})
    s.box((8.0, 12.7, 1.3), (5.0, 0.2, 0.2), {'c': PIPE})
    for (fx, fy) in [(-2.8, -2.4), (12.6, -2.4), (12.6, 13.4), (-2.8, 13.4)]:
        s.box((fx, fy, 0), (0.18, 0.18, 2.2), {'c': FENCE})
    return s, 5.8


def build_waterpark(P):
    """engine/bohemia_waterpark.js, on the dead WET'N'WILD (27 acres on the Strip,
    1985-2004, closed and never replaced). The signature is the SLIDE TOWER -- a stack of
    platforms with flumes spiralling off it, the tallest thing on the site by a long way
    and the only structure in the valley shaped like that. The drained WAVE POOL at its
    foot is the second read: a big pale bowl with a deep end."""
    LOCK, WAVE, RIVER, TOWER, SPLASH, SNACK, CHAIR = P[2], P[6], P[7], P[8], P[9], P[13], P[11]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(114, 110, 96), lotc=(64, 64, 68))
    # THE SLIDE TOWER: stacked platforms, each smaller, with flumes spiralling down
    for i, (tz, half) in enumerate([(0.0, 1.9), (2.6, 1.55), (5.2, 1.2), (7.8, 0.85)]):
        s.box((4.2 - half, 4.2 - half, tz), (half * 2, half * 2, 2.6),
              {'top': _dark(TOWER, 1.12), 'px': _dark(TOWER, 1.0), 'py': _dark(TOWER, 0.82),
               'nx': _dark(TOWER, 1.0), 'ny': _dark(TOWER, 0.82)})
    s.box((3.7, 3.7, 10.4), (1.0, 1.0, 0.5), {'c': _dark(TOWER, 1.2)['c']})
    for i, (fx, fy) in enumerate([(-1.2, -1.2), (9.6, -1.2), (9.6, 9.6), (-1.2, 9.6)]):     # THE FLUMES
        steps = 7
        for k in range(steps):
            t = k / float(steps - 1)
            zx = 4.2 + (fx - 4.2) * t
            zy = 4.2 + (fy - 4.2) * t
            s.box((zx - 0.45, zy - 0.45, 9.0 - t * 8.2), (0.9, 0.9, 0.34),
                  {'c': _dark(RIVER, 1.0 + (k % 2) * 0.16)['c']})
    s.box((-2.4, 10.2, -0.05), (8.6, 4.0, 0.12), {'c': _dark(WAVE, 0.72)['c']})             # THE WAVE POOL
    s.box((-2.4, 10.2, 0.06), (5.2, 4.0, 0.1), {'c': WAVE})                                 # its shallow end
    s.box((-2.6, 10.0, 0), (0.3, 4.4, 0.7), {'c': _dark(WAVE, 1.2)['c']})                   # the wave wall
    s.box((7.4, 10.4, -0.04), (2.4, 2.4, 0.1), {'c': SPLASH})                               # a splash pool
    s.box((10.6, 10.4, 0), (2.4, 2.2, 3.0), {'top': _dark(SNACK, 0.9), 'px': _win(SNACK, 3, 2, 4),
          'py': _dark(SNACK, 0.86), 'nx': _dark(SNACK), 'ny': _dark(SNACK)})                # the snack bar
    s.box((10.2, -1.8, 0), (2.8, 4.4, 3.6), {'top': _dark(LOCK, 0.9), 'px': _win(LOCK, 3, 3, 7),
          'py': _dark(LOCK, 0.86), 'nx': _dark(LOCK), 'ny': _dark(LOCK)})                   # the locker building
    _door_face(s, (10.2, -1.8, 0), (2.8, 4.4, 3.6), width=1.2, ztop=2.3)
    for (lx, ly) in [(-1.6, 6.4), (0.2, 6.4), (2.0, 6.4), (7.2, 6.4), (9.0, 6.4)]:
        s.box((lx, ly, 0), (0.9, 0.42, 0.3), {'c': CHAIR})                                  # the lounger row
    return s, 5.6


def build_golf(P):
    """engine/bohemia_golf.js: the signature is the GREEN AND ITS BUNKERS -- a pale kidney
    of sand wrapping a mown circle with a pin in it, which no other district has. In act 1
    the fairways are dead brown and only the SAND still reads bright, so the bunkers do
    most of the work. The CLUBHOUSE is the one building and it sits above the 18th."""
    CLUB, FAIR, GREEN, SAND, HAZ, TEE, PIN, TREE, CART = P[2], P[4], P[6], P[7], P[8], P[9], P[10], P[12], P[13]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(112, 100, 76), lotc=(62, 62, 62))
    for (fx, fy, fw, fd) in [(-2.6, -2.0, 7.4, 5.6), (4.0, 4.4, 9.0, 4.6), (-2.6, 8.4, 6.4, 5.0)]:
        s.box((fx, fy, 0.01), (fw, fd, 0.07), {'c': FAIR})                                  # the dead fairways
    for (gx, gy, gr) in [(2.6, 0.8, 2.0), (10.4, 6.6, 1.8), (0.8, 10.6, 1.7)]:
        s.prism(gx, gy, 0.02, gr + 0.85, 0.06, 18, {'c': SAND})                             # the bunker ring
        s.prism(gx, gy, 0.05, gr, 0.08, 18, {'c': GREEN})                                   # THE GREEN
        s.box((gx - 0.05, gy - 0.05, 0.13), (0.1, 0.1, 1.5), {'c': PIN})                    # the pin
        s.box((gx + 0.05, gy - 0.02, 1.2), (0.45, 0.04, 0.3), {'c': _dark(PIN, 1.3)['c']})  # its flag
    for (bx, by) in [(6.4, 2.0), (7.8, 9.6), (-1.4, 5.6)]:
        s.prism(bx, by, 0.02, 1.15, 0.06, 14, {'c': SAND})                                  # free bunkers
    s.box((5.0, 11.6, -0.04), (4.6, 2.2, 0.1), {'c': _dark(HAZ, 0.8)['c']})                 # the dry hazard
    for (tx, ty) in [(-2.0, 3.2), (5.2, 7.6), (11.6, 11.4)]:
        s.box((tx, ty, 0.02), (1.5, 1.0, 0.12), {'c': TEE})                                 # the tee boxes
    s.box((9.4, -2.2, 0), (3.8, 3.6, 4.4), {'top': _dark(CLUB, 0.9), 'px': _win(CLUB, 4, 3, 5),
          'py': _win(CLUB, 4, 3, 9), 'nx': _dark(CLUB), 'ny': _dark(CLUB)})                 # THE CLUBHOUSE
    _gable(s, (9.2, -2.4, 4.4), (4.2, 4.0, 0), 1.25, _dark(CLUB, 1.14)['c'])
    _door_face(s, (9.4, -2.2, 0), (3.8, 3.6, 4.4), width=1.3, ztop=2.4)
    for (tx2, ty2) in [(0.4, 3.6), (7.0, 0.4), (3.4, 12.4), (12.0, 3.0)]:
        s.box((tx2, ty2, 0), (0.24, 0.24, 2.2), {'c': TREE})
        s.box((tx2 - 0.5, ty2 - 0.5, 2.2), (1.24, 1.24, 0.34), {'c': _dark(TREE, 0.9)['c']})
    _vehicle(s, 6.0, 5.6, CAR, CART, along='x')                                             # a cart left mid-round
    return s, 5.8


def build_drivein(P):
    """engine/bohemia_drivein.js: the SCREEN TOWER, and nothing else is close. It is a
    flat wall four storeys high standing alone at the end of a field with nothing behind
    it, braced from the back -- the single most recognisable silhouette any American
    roadside form has. The projection booth sits low in the middle of the ramped rows,
    and the rows themselves are the arcs of earth cars park nose-up on."""
    SCREEN, BOOTH, ROW, POLE, VEH = P[6], P[2], P[4], P[7], P[8]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(100, 92, 78), lotc=(58, 58, 62))
    # THE SCREEN TOWER: a wall, its back bracing, and the dark deck it stands on
    s.box((-1.0, -2.4, 0), (11.0, 0.55, 12.6),
          {'top': _dark(SCREEN, 1.18), 'px': {'c': tuple(min(255, int(c * 1.22)) for c in SCREEN)},
           'py': _dark(SCREEN, 0.7), 'nx': _dark(SCREEN, 0.86), 'ny': _dark(SCREEN, 0.7)})
    s.box((-1.3, -2.7, 0), (11.6, 0.3, 13.1), {'c': _dark(SCREEN, 0.62)['c']})               # its frame edge
    for bx in (0.0, 2.6, 5.2, 7.8):                                                          # the back bracing
        s.box((bx, -2.4, 0), (0.3, -0.0 + 1.9, 0.3), {'c': _dark(SCREEN, 0.58)['c']})
        s.quad((bx, -0.5, 0), (bx + 0.3, -0.5, 0), (bx + 0.3, -1.85, 8.0), (bx, -1.85, 8.0),
               {'c': _dark(SCREEN, 0.58)['c']}, (0, -1, 0))
    # THE RAMPED ROWS: low arcs of earth, cars nose up on each one
    for i, ry in enumerate((1.6, 3.4, 5.2, 7.0, 8.8, 10.6, 12.4)):
        s.box((-2.0, ry, 0), (13.0, 0.75, 0.34 + i * 0.05), {'c': ROW})
        s.box((-2.0, ry + 0.75, 0), (13.0, 0.12, 0.1), {'c': _dark(ROW, 0.7)['c']})
        s.box((-1.6 + (i % 3) * 0.4, ry - 0.5, 0), (0.16, 0.16, 2.4), {'c': POLE})           # the speaker poles
        s.box((5.4 + (i % 2) * 0.6, ry - 0.5, 0), (0.16, 0.16, 2.4), {'c': POLE})
    _vehicle(s, 2.2, 3.5, CAR, VEH, along='x')
    _vehicle(s, 7.8, 7.1, CAR, _dark(VEH, 0.82)['c'], along='x')
    _vehicle(s, 0.6, 10.7, CAR, _dark(VEH, 1.1)['c'], along='x')
    s.box((10.6, 5.6, 0), (2.6, 3.0, 3.2), {'top': _dark(BOOTH, 0.9), 'px': _win(BOOTH, 3, 2, 4),
          'py': _dark(BOOTH, 0.86), 'nx': _dark(BOOTH), 'ny': _dark(BOOTH)})                 # the booth
    _door_face(s, (10.6, 5.6, 0), (2.6, 3.0, 3.2), width=1.0, ztop=2.1)
    return s, 5.4


def build_boneyard(P):
    """engine/bohemia_boneyard.js: a wrecking yard, and its signature is the CRUSHED-CAR
    STACK -- flattened bodies piled six and eight high in leaning towers, which is a
    shape nothing else makes. The CRANE with its grapple stands over them, and the loose
    wrecks fill the dirt aisles below in three different faded colours because a yard of
    one colour is a scrapheap nobody can read."""
    OFF, SCRAP, STACK, CRANE, WRECK, BLUE, WHITE, FENCE = P[2], P[3], P[7], P[8], P[6], P[13], P[14], P[12]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(96, 86, 70), lotc=(70, 64, 54))
    # THE CRUSHED-CAR STACKS: each slab a flattened car, each stack leaning its own way
    for si, (sx, sy, n) in enumerate([(-2.2, 0.2, 9), (-2.2, 2.2, 7), (-2.2, 4.2, 8),
                                      (-2.2, 6.2, 6), (-2.2, 8.2, 9), (-2.2, 10.2, 7)]):
        for k in range(n):
            jog = ((si * 3 + k * 5) % 5 - 2) * 0.09
            col = [WRECK, BLUE, WHITE][(si + k) % 3]
            s.box((sx + jog, sy + jog * 0.6, k * 0.62), (2.5, 1.5, 0.58),
                  {'top': _dark(col, 1.1), 'px': _dark(col, 1.0), 'py': _dark(col, 0.8),
                   'nx': _dark(col, 1.0), 'ny': _dark(col, 0.8)})
    # THE CRANE over the stacks
    s.box((7.2, 3.4, 0), (2.2, 2.2, 1.4), {'c': _dark(CRANE, 0.8)['c']})                     # the tracks
    s.box((7.5, 3.7, 1.4), (1.6, 1.6, 3.2), {'top': _dark(CRANE, 1.1), 'px': _win(CRANE, 2, 2, 4),
          'py': _dark(CRANE, 0.84), 'nx': _dark(CRANE), 'ny': _dark(CRANE)})                 # the house
    # THE BOOM, up and over the stacks -- the tallest thing for blocks, and what you see
    # before you see the yard at all
    s.quad((7.9, 4.2, 4.6), (8.5, 4.2, 4.6), (4.6, 4.2, 15.4), (4.0, 4.2, 15.4), {'c': CRANE}, (0, -1, 0))
    s.quad((7.9, 4.8, 4.6), (8.5, 4.8, 4.6), (4.6, 4.8, 15.4), (4.0, 4.8, 15.4), {'c': _dark(CRANE, 0.84)['c']}, (0, 1, 0))
    s.box((4.0, 4.15, 14.6), (0.9, 0.75, 0.9), {'c': _dark(CRANE, 1.12)['c']})                # the boom head
    s.box((4.2, 4.3, 10.4), (0.22, 0.22, 4.2), {'c': _dark(CRANE, 0.6)['c']})                 # the fall
    s.box((3.9, 4.05, 9.6), (0.8, 0.8, 1.0), {'c': _dark(CRANE, 1.1)['c']})                   # the grapple
    for (wx, wy, along) in [(7.4, 7.0, 'x'), (10.4, 7.0, 'x'), (7.4, 9.4, 'x'),
                            (10.4, 9.4, 'x'), (7.4, 11.8, 'x'), (10.4, 11.8, 'x'),
                            (-2.2, 10.6, 'x'), (1.0, 10.6, 'x')]:
        _vehicle(s, wx, wy, CAR, [WRECK, BLUE, WHITE][(int(wx) + int(wy)) % 3], along=along)
    s.box((9.6, -2.2, 0), (3.4, 3.0, 3.4), {'top': _dark(OFF, 0.9), 'px': _win(OFF, 3, 2, 5),
          'py': _dark(OFF, 0.86), 'nx': _dark(OFF), 'ny': _dark(OFF)})                       # office / parts
    _door_face(s, (9.6, -2.2, 0), (3.4, 3.0, 3.4), width=1.1, ztop=2.2)
    for (tx, ty) in [(-2.2, 0.6), (-2.2, 3.4), (-2.2, 6.2)]:                                 # the tyre piles
        s.prism(tx, ty, 0, 1.0, 1.5, 12, {'c': SCRAP}, {'c': _dark(SCRAP, 1.12)['c']})
    for (fx, fy) in [(-2.8, -2.6), (13.0, -2.6), (13.0, 13.4), (-2.8, 13.4)]:
        s.box((fx, fy, 0), (0.18, 0.18, 2.2), {'c': FENCE})
    return s, 5.6


def build_wash(P):
    """engine/bohemia_wash.js: the LAS VEGAS WASH is a lined trapezoidal flood channel,
    and its icon is exactly that -- a concrete trough cut straight across the plot with
    riprap on the banks and a road bridge over it. The SEWER TUNNEL MOUTH in the wall is
    the thing that matters here and it is the only reason anybody goes down: this valley's
    channels are where people actually live, and the mouth is a way IN."""
    CONC, INVERT, BANK, RIP, TUNNEL, FENCE, BRUSH = P[2], P[6], P[4], P[9], P[8], P[10], P[3]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(112, 102, 82), lotc=(70, 68, 62))
    # THE TRAPEZOIDAL CHANNEL: sloped walls cut down to a flat invert
    for side, (wy, ny) in enumerate([(1.2, 1.0), (9.2, -1.0)]):
        s.quad((-3.0, wy, 2.2), (14.0, wy, 2.2), (14.0, wy + ny * 2.0, -1.4),
               (-3.0, wy + ny * 2.0, -1.4), {'c': CONC}, (0, -ny, 0.4))
        s.box((-3.0, wy - 0.28 * ny, 2.2), (17.0, 0.56, 0.3), {'c': _dark(CONC, 1.16)['c']})  # the coping
        s.box((-3.0, wy - 1.5 * ny, 0), (17.0, 1.2, 0.5), {'c': BANK})                        # the bank
        for rx in range(8):                                                                   # riprap
            s.box((-2.6 + rx * 2.1, wy - 1.3 * ny, 0.5), (0.7, 0.55, 0.42), {'c': RIP})
    s.box((-3.0, 3.2, -1.5), (17.0, 6.0, 0.14), {'c': INVERT})                                # the invert floor
    s.box((-3.0, 5.9, -1.42), (17.0, 0.7, 0.06), {'c': _dark(INVERT, 0.78)['c']})             # the low-flow trickle
    # THE SEWER TUNNEL MOUTH, in the north wall -- the way in
    s.box((4.4, 1.05, -1.4), (3.0, 0.35, 2.4), {'c': _dark(CONC, 1.1)['c']})
    s.box((4.9, 0.98, -1.4), (2.0, 0.2, 1.9), {'c': TUNNEL})
    # THE BRIDGE over it
    s.box((9.6, 0.2, 2.5), (3.2, 11.0, 0.7), {'top': _dark(BANK, 1.2), 'px': _dark(BANK, 0.9),
          'py': _dark(BANK, 0.78), 'nx': _dark(BANK, 0.9), 'ny': _dark(BANK, 0.78)})
    for by in (2.0, 5.2, 8.4):
        s.box((10.0, by, -1.5), (2.4, 0.7, 4.0), {'c': _dark(CONC, 0.86)['c']})                # its piers
    for by2 in (0.2, 11.0):
        for k in range(5):
            s.box((9.7 + k * 0.66, by2, 3.2), (0.12, 0.2, 0.8), {'c': FENCE})                  # the bridge rail
    # THE GAUGE MAST AND THE BRIDGE LIGHT: a lined channel is a trench, but the things
    # that WATCH it stand up. The staff gauge on the wall is the only warning anybody down
    # there gets that a wall of water is coming, which in this valley kills people.
    s.box((2.2, 1.0, -1.4), (0.3, 0.3, 7.4), {'c': _dark(CONC, 0.6)['c']})
    for k in range(7):
        s.box((2.15, 0.94, -0.9 + k * 0.85), (0.4, 0.42, 0.16),
              {'c': _dark(CONC, 1.3 if k % 2 else 0.75)['c']})
    s.box((9.4, 0.0, 3.2), (0.28, 0.28, 3.4), {'c': _dark(BANK, 0.8)['c']})
    s.box((9.28, 0.22, 6.45), (0.52, 1.0, 0.22), {'c': _dark(BANK, 1.25)['c']})
    for (bx, by3) in [(0.4, -1.4), (6.6, -2.0), (2.4, 11.8), (11.0, 12.4)]:
        s.box((bx, by3, 0), (0.7, 0.7, 0.5), {'c': BRUSH})
    return s, 5.6


def build_freeway(P):
    """engine/bohemia_freeway.js: the ELEVATED DECK on its columns, with a SIGN GANTRY
    over the lanes below and the sound wall running the length of the embankment. Both
    the deck and the gantry are SPANS, not canopies (8/2): infrastructure that carries
    something across a gap, which is the distinction the no-canopies law draws itself."""
    LANE, LINE, BARRIER, SOUND, DECK, COL, GANTRY, SEMI, VEH = P[1], P[2], P[4], P[8], P[12], P[13], P[14], P[11], P[10]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(104, 96, 80), lotc=(58, 58, 62))
    s.box((-3.0, 1.0, 0.01), (17.0, 9.0, 0.09), {'c': LANE})                                   # the roadbed
    for ly in (3.0, 4.9, 6.8):                                                                 # the lane lines
        for k in range(11):
            s.box((-2.6 + k * 1.55, ly, 0.11), (0.85, 0.14, 0.03), {'c': LINE})
    s.box((-3.0, 5.4, 0.1), (17.0, 0.5, 0.85), {'top': _dark(BARRIER, 1.14), 'px': _dark(BARRIER, 1.0),
          'py': _dark(BARRIER, 0.84), 'nx': _dark(BARRIER, 1.0), 'ny': _dark(BARRIER, 0.84)})  # median barrier
    for (sy, ) in [(0.5, ), (10.2, )]:                                                         # THE SOUND WALLS
        s.box((-3.0, sy, 0), (17.0, 0.45, 3.4), {'top': _dark(SOUND, 1.16), 'px': _dark(SOUND, 1.0),
              'py': _dark(SOUND, 0.82), 'nx': _dark(SOUND, 1.0), 'ny': _dark(SOUND, 0.82)})
    # THE OVERPASS DECK on its columns -- a SPAN, crossing the lanes
    for cy in (2.2, 8.6):
        s.box((6.0, cy, 0), (1.6, 1.4, 5.6), {'c': COL})
    s.box((5.4, -1.0, 5.6), (2.8, 13.5, 0.9), {'top': _dark(DECK, 1.18), 'px': _dark(DECK, 0.94),
          'py': _dark(DECK, 0.8), 'nx': _dark(DECK, 0.94), 'ny': _dark(DECK, 0.8)})
    for gy in (-1.0, 11.6):                                                                    # its parapets
        s.box((5.4, gy, 6.5), (2.8, 0.9, 0.7), {'c': _dark(DECK, 0.8)['c']})
    # THE SIGN GANTRY over the lanes -- also a SPAN
    for gy2 in (1.4, 9.6):
        s.box((11.4, gy2, 0.1), (0.34, 0.34, 5.0), {'c': GANTRY})
    s.box((11.3, 1.3, 5.0), (0.55, 8.6, 0.4), {'c': GANTRY})
    s.box((11.25, 2.4, 3.6), (0.2, 2.6, 1.4), {'c': _dark(GANTRY, 1.2)['c']})                  # the blank panel
    s.box((11.25, 6.4, 3.6), (0.2, 2.6, 1.4), {'c': _dark(GANTRY, 1.2)['c']})
    _vehicle(s, 0.4, 3.3, TRAILER, SEMI, along='x')
    _vehicle(s, 8.6, 7.2, CAR, VEH, along='x')
    _vehicle(s, 2.6, 8.2, CAR, _dark(VEH, 0.84)['c'], along='x')
    return s, 5.6


def build_arterial(P):
    """engine/bohemia_arterial.js: a six-lane Vegas arterial, and the icon is the
    INTERSECTION -- the signal masts reaching out over the lanes on their long arms,
    the crosswalk ladders, the raised median with its dead palms, and the block wall
    behind the sidewalk. The mast arm is the vertical; everything else is flat."""
    ROAD, LINE, MEDIAN, WALK, WALL, LIGHT, MAST, PALM, VEH = P[1], P[2], P[4], P[6], P[8], P[9], P[12], P[11], P[14]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(106, 98, 82), lotc=(58, 58, 62))
    s.box((-3.0, 1.4, 0.01), (17.0, 8.4, 0.09), {'c': ROAD})                                   # the roadway
    s.box((3.6, -3.0, 0.02), (4.6, 17.0, 0.09), {'c': ROAD})                                   # the cross street
    s.box((-3.0, 5.2, 0.1), (6.4, 0.9, 0.35), {'c': MEDIAN})                                   # the raised median
    s.box((8.4, 5.2, 0.1), (5.8, 0.9, 0.35), {'c': MEDIAN})
    for (px, py) in [(-1.6, 5.5), (1.4, 5.5), (9.6, 5.5), (12.4, 5.5)]:                        # dead palms in it
        s.box((px, py, 0.35), (0.26, 0.26, 3.2), {'c': PALM})
        s.box((px - 0.4, py - 0.4, 3.55), (1.06, 1.06, 0.24), {'c': _dark(PALM, 0.82)['c']})
    for k in range(9):                                                                         # the crosswalk ladders
        s.box((3.2, 1.7 + k * 0.85, 0.11), (0.5, 0.42, 0.03), {'c': LINE})
        s.box((8.2, 1.7 + k * 0.85, 0.11), (0.5, 0.42, 0.03), {'c': LINE})
    for k in range(6):
        s.box((3.9 + k * 0.75, 1.1, 0.11), (0.42, 0.5, 0.03), {'c': LINE})
        s.box((3.9 + k * 0.75, 9.5, 0.11), (0.42, 0.5, 0.03), {'c': LINE})
    for (sy, ) in [(0.4, ), (10.0, )]:                                                         # sidewalk + block wall
        s.box((-3.0, sy, 0.02), (17.0, 1.0, 0.1), {'c': WALK})
        s.box((-3.0, sy + (1.0 if sy < 5 else -0.35), 0), (17.0, 0.35, 2.2),
              {'top': _dark(WALL, 1.14), 'px': _dark(WALL, 1.0), 'py': _dark(WALL, 0.84),
               'nx': _dark(WALL, 1.0), 'ny': _dark(WALL, 0.84)})
    # THE SIGNAL MASTS, arms reaching out over the lanes -- the vertical of the whole plot
    for (mx, my, arm) in [(3.0, 0.9, 1.0), (8.8, 10.2, -1.0)]:
        s.box((mx, my, 0), (0.36, 0.36, 6.2), {'c': _dark(MAST, 0.88)['c']})
        s.box((mx, my + (0.36 if arm > 0 else -4.6), 5.9), (0.3, 4.6, 0.3), {'c': MAST})
        for k in range(3):
            hy = my + arm * (1.1 + k * 1.2)
            s.box((mx + 0.02, hy, 5.0), (0.32, 0.34, 0.85), {'c': _dark(MAST, 0.66)['c']})
    for (lx, ly) in [(-1.0, 0.6), (6.0, 10.4), (12.0, 0.6)]:                                   # streetlights
        s.box((lx, ly, 0), (0.2, 0.2, 4.4), {'c': LIGHT})
        s.box((lx, ly + 0.2, 4.25), (0.18, 1.1, 0.18), {'c': LIGHT})
    _vehicle(s, 0.2, 2.6, CAR, VEH, along='x')
    _vehicle(s, 10.6, 7.6, CAR, _dark(VEH, 0.84)['c'], along='x')
    return s, 5.6


def build_mountain(P):
    """engine/bohemia_mountain.js: a limestone ridge on the valley rim. The icon is the
    RIDGE CREST -- a stepped mass rising to one summit with cliff bands on its face, talus
    fanning off the bottom and a ravine cut into the flank. It is the tallest thing in the
    valley and it should read that way at map zoom."""
    ROCK, CREST, CLIFF, TALUS, RAVINE, SHRUB, BOULDER = P.get(0, P[2]), P[1], P[2], P[3], P[4], P[6], P[7]
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=(104, 94, 80), lotc=(84, 78, 68))
    # THE MASSIF: stepped prisms rising to one summit, each a value lighter
    steps = [(5.4, 5.4, 0.0, 7.6, 3.4, ROCK), (5.6, 5.2, 3.4, 5.9, 3.2, _dark(ROCK, 1.08)['c']),
             (5.9, 5.0, 6.6, 4.3, 3.0, CLIFF), (6.2, 4.8, 9.6, 2.7, 2.8, _dark(CREST, 0.96)['c']),
             (6.4, 4.7, 12.4, 1.3, 1.9, CREST)]
    for (cx, cy, cz, rad, hgt, col) in steps:
        s.prism(cx, cy, cz, rad, hgt, 9, {'c': col}, {'c': tuple(min(255, int(v * 1.14)) for v in col)})
    # THE CLIFF BANDS on the sunward face
    for (bz, bw) in [(2.6, 6.4), (5.8, 4.9), (8.8, 3.4)]:
        s.box((5.4 - bw * 0.5, 5.4 - bw * 0.52, bz), (bw, 0.5, 0.75), {'c': _dark(CLIFF, 0.74)['c']})
    # THE TALUS FAN off the foot, and the ravine cut
    for (tx, ty, tr) in [(1.0, 10.4, 2.3), (10.6, 10.0, 2.0), (11.4, 1.4, 1.8), (0.4, 1.8, 1.9)]:
        s.prism(tx, ty, 0, tr, 0.9, 8, {'c': TALUS}, {'c': _dark(TALUS, 1.12)['c']})
    s.box((5.0, 8.6, 0), (1.5, 4.4, 0.35), {'c': RAVINE})
    for (bx, by) in [(2.4, 12.2), (9.0, 12.6), (12.4, 6.0), (-1.8, 6.4)]:
        s.prism(bx, by, 0, 0.75, 0.75, 7, {'c': BOULDER}, {'c': _dark(BOULDER, 1.14)['c']})
    for (sx, sy) in [(3.2, 11.0), (11.0, 12.0), (-2.0, 9.0), (12.6, 9.4)]:
        s.box((sx, sy, 0), (0.6, 0.6, 0.45), {'c': SHRUB})
    return s, 5.4


def build_desert(P):
    """engine/bohemia_desert.js. LOW BY NATURE and named as such in the big-icons gate:
    open Mojave has no building in it and inventing one would be a lie about the map.
    What it does have is TEXTURE -- desert pavement varnished dark, rock lag, creosote in
    its regular spacing (they poison each other's roots, which is why the spacing is even),
    a dry rill, and the dumped debris and burned car that say somebody has been here."""
    PAVE, LAG, CREO, BURSAGE, CALICHE, RILL, DEBRIS, BURNT, OUT, YUCCA = (
        P.get(0, P[4]), P[1], P[2], P[3], P[4], P[5], P[7], P[8], P[11], P[12])
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=PAVE, lotc=CALICHE)
    for (px, py, pw, pd, col) in [(-2.0, -1.4, 6.0, 5.0, LAG), (6.4, 2.2, 5.4, 4.6, CALICHE),
                                  (-1.0, 7.4, 7.0, 5.2, LAG), (8.4, 8.6, 4.4, 4.0, CALICHE)]:
        s.box((px, py, 0.01), (pw, pd, 0.06), {'c': col})
    s.box((-2.6, 4.6, 0.02), (16.0, 1.1, 0.07), {'c': RILL})                                   # the dry rill
    s.box((1.4, 5.6, 0.02), (1.0, 7.0, 0.07), {'c': _dark(RILL, 0.94)['c']})
    # CREOSOTE, evenly spaced because they poison each other's roots -- the real signature
    for gy in range(5):
        for gx in range(5):
            cx = -1.6 + gx * 3.05 + ((gy % 2) * 1.5)
            cy = -1.6 + gy * 3.05
            s.prism(cx, cy, 0, 0.62, 1.15, 7, {'c': CREO}, {'c': _dark(CREO, 1.16)['c']})
            s.prism(cx + 1.35, cy + 1.3, 0, 0.38, 0.6, 6, {'c': BURSAGE}, {'c': _dark(BURSAGE, 1.14)['c']})
    # THE ROCK OUTCROP: the one thing open Mojave stands up, and the only vertical this
    # district honestly has. A varnished limestone knob reads across the flat for miles.
    for (ox, oy, orr, oh) in [(9.6, 0.2, 2.8, 8.6), (0.2, 11.6, 1.6, 3.2)]:
        s.prism(ox, oy, 0, orr, oh, 7, {'c': OUT}, {'c': _dark(OUT, 1.16)['c']})
        s.prism(ox + 0.5, oy + 0.4, oh * 0.62, orr * 0.62, oh * 0.75, 6, {'c': _dark(OUT, 0.92)['c']},
                {'c': _dark(OUT, 1.1)['c']})
        s.prism(ox + 0.2, oy + 0.7, oh * 1.15, orr * 0.34, oh * 0.5, 6, {'c': _dark(OUT, 1.04)['c']},
                {'c': _dark(OUT, 1.2)['c']})
    for (yx, yy) in [(4.4, 1.0), (12.0, 6.4), (5.6, 12.2)]:                                    # DEAD YUCCA
        s.box((yx, yy, 0), (0.3, 0.3, 2.5), {'c': YUCCA})
        for k in range(4):
            s.box((yx - 0.45 + (k % 2) * 0.9, yy - 0.4 + (k // 2) * 0.8, 1.9 + k * 0.12),
                  (0.55, 0.5, 0.14), {'c': _dark(YUCCA, 0.88)['c']})
    s.box((7.2, 11.0, 0), (1.4, 1.0, 0.45), {'c': DEBRIS})
    _vehicle(s, 2.6, 8.6, CAR, BURNT, along='x')                                                # the burned car
    return s, 5.6


def build_water(P):
    """engine/bohemia_water.js. LOW BY NATURE and named: this is Lake Mead's shoreline
    after the drought and the whole subject is a HORIZONTAL. What makes it legible is the
    BATHTUB RING -- the white mineral band the water left behind on the rock as it dropped
    over twenty years -- with the exposed lakebed cracking below it and a LAUNCH RAMP that
    now ends a long way short of the water. The sunken boat is the punchline."""
    OPEN, SHALLOW, RING, BED, SILT, SHELL, ROCK, RAMP, BOAT, BRUSH = (
        P.get(0, P[1]), P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9])
    s = Scene()
    _ground(s, (-3, -3, 15, 15), groundc=BED, lotc=SILT)
    s.box((-3.0, -3.0, 0.02), (17.0, 7.2, 0.08), {'c': OPEN})                                  # THE WATER
    s.box((-3.0, 3.4, 0.03), (17.0, 1.6, 0.08), {'c': SHALLOW})                                # its shallows
    # THE BATHTUB RING: the shoreline shelf, stepped, with the white band on its face
    s.box((-3.0, 5.0, 0), (17.0, 2.4, 1.5), {'top': {'c': BED}, 'px': {'c': RING},
          'py': {'c': RING}, 'nx': {'c': RING}, 'ny': {'c': RING}})
    s.box((-3.0, 7.4, 0), (17.0, 2.0, 2.7), {'top': {'c': SILT}, 'px': _dark(ROCK, 1.0),
          'py': {'c': RING}, 'nx': _dark(ROCK, 1.0), 'ny': {'c': RING}})
    s.box((-3.0, 9.4, 0), (17.0, 2.2, 3.8), {'top': {'c': SHELL}, 'px': _dark(ROCK, 1.0),
          'py': _dark(ROCK, 0.86), 'nx': _dark(ROCK, 1.0), 'ny': _dark(ROCK, 0.86)})
    for (rx, ry, rr, rh) in [(0.6, 12.4, 1.5, 2.2), (7.4, 12.8, 1.8, 2.6), (12.4, 12.0, 1.3, 1.9)]:
        s.prism(rx, ry, 3.8, rr, rh, 8, {'c': ROCK}, {'c': _dark(ROCK, 1.16)['c']})             # shore rock
    # THE LAUNCH RAMP, ending high and dry
    s.quad((3.2, 4.2, 0.1), (6.0, 4.2, 0.1), (6.0, 11.6, 3.8), (3.2, 11.6, 3.8), {'c': RAMP}, (0, -0.4, 1))
    # the ramp cleats are MARKS ON A SLOPE, not boxes standing on it -- drawn as quads so
    # they are not solids, because a cleat is a texture and a solid is a thing you hit
    for k in range(6):
        cz = 0.14 + k * 0.6
        s.quad((3.2, 4.6 + k * 1.15, cz), (6.0, 4.6 + k * 1.15, cz),
               (6.0, 4.72 + k * 1.15, cz), (3.2, 4.72 + k * 1.15, cz),
               {'c': _dark(RAMP, 0.82)['c']}, (0, 0, 1))
    _vehicle(s, 8.8, 1.4, CAR, BOAT, along='x')                                                 # the sunken boat
    # brush clumps, each pinned to the shelf it actually stands on. Deriving z from a y
    # threshold put one of them straddling two shelves and half-buried in the upper bank.
    for (bx, by, bz) in [(1.0, 6.2, 1.5), (10.6, 6.6, 1.5), (5.0, 8.2, 2.7), (11.8, 10.4, 3.8)]:
        s.box((bx, by, bz), (0.7, 0.7, 0.5), {'c': BRUSH})
    return s, 5.6


HEROES = {'cityhall': build_cityhall, 'battery': build_battery, 'terminal': build_terminal,
          'downtown': build_downtown, 'industrial': build_industrial, 'medical': build_medical,
          'mall': build_mall, 'park': build_park, 'warehouse': build_warehouse,
          'commercial': build_commercial, 'school': build_school, 'courthouse': build_courthouse,
          'library': build_library, 'farm': build_farm, 'firestation': build_firestation,
          'policestation': build_policestation, 'solar': build_solar, 'stadium': build_stadium,
          'storage': build_storage, 'truckstop': build_truckstop, 'swapmeet': build_swapmeet,
          # SURFACES (7/27, the icon law) — the ground the WORLD lane built
          'rail': build_rail, 'interchange': build_interchange,
          # THE LANDMARK SET (7/27), icons shipping with their ground per the icon law
          'campus': build_campus, 'speedway': build_speedway,
          'town': build_town, 'ballpark': build_ballpark,
          # 8/2: he scored the chapel's MISSING icon 0%, correctly. A district with no map
          # icon is a district you cannot find, and an empty panel is worth exactly nothing.
          'chapel': build_chapel,
          # 8/4: THE NO-ICON DEBT PAID. He approved the four civics at 85% on the
          # big-icons language, and APPROVAL UNLOCKS VOLUME -- so the nineteen
          # districts that still rendered as nothing on the map get built in it.
          'apartment': build_apartment, 'suburb': build_suburb, 'trailer': build_trailer,
          'cemetery': build_cemetery, 'jail': build_jail, 'landfill': build_landfill,
          'railyard': build_railyard, 'substation': build_substation,
          'watertreat': build_watertreat, 'waterpark': build_waterpark,
          'golf': build_golf, 'drivein': build_drivein, 'boneyard': build_boneyard,
          'wash': build_wash, 'freeway': build_freeway, 'arterial': build_arterial,
          'mountain': build_mountain, 'desert': build_desert, 'water': build_water}

# HELD BACK, DELIBERATELY: 'airport': build_airport, 'airbase': build_airbase.
# Both builders are finished and correct and they stay in this file, but they are
# NOT in HEROES, so nothing bakes and nothing wires. The reason is the bar, not the
# code: the ICONIC SIGNATURE of an airfield is the AEROPLANE, and at 1x1 tile size
# the aeroplane does not read.
#
# What was tried, in order, and what each one taught:
#   1. axis-aligned boxes for the wings -> a plus-sign of grey girders. A wing that
#      leaves the body at 90 degrees with the body's own value is not a wing.
#   2. swept QUADS a full value step darker -> correct dart silhouette. Verified by
#      baking _aircraft alone on a bare plate: it reads unmistakably as an aeroplane.
#      So the geometry is NOT the problem and must not be rewritten again.
#   3. icon proportions instead of scale-model ones (stubby body, span ~= length,
#      tall fin), per the style bible's "chunky, simple, BOLD".
#   4. a darker stand under it so a pale airframe stops vanishing into pale concrete.
# After 4 it is better and still not there. The tell in the STOP PRODUCING law is
# exactly this: a fourth version means the approach is what is wrong, not the
# attempt. The real problem is SIZE — a hero is a whole 1x1 district plot, an
# airfield is the largest flat thing in the valley, and squeezing a runway, a
# taxiway, a terminal AND a legible aeroplane into one plot asks the aeroplane to
# be small. Every other hero's signature is a BUILDING, which survives shrinking.
# That is a design question (does an airfield hero drop the runway and show the
# aeroplane and terminal only?) and it is Paolo's call, not mine to keep guessing.
# Tracked in BOHEMIA_BACKLOG.md. Adding these two back is one line, once he rules.
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
    'school': 'High school — matched to the walkable district (Paolo ruled it HIGH SCHOOL, 7/28): the STADIUM as the landmark — an obround running TRACK with the football FIELD inside it, raked BLEACHERS down both sidelines, a press box and four LIGHT TOWERS standing close in at the corners of the bowl — plus the academic spine with its second storey and two forward wings, TWO entryways (main doors and the gym doors), the GYM in school colours, the AUTO SHOP under its sawtooth roof with a roll-up bay standing open over an oiled yard (Paolo 7/30 killed the tennis courts and gave the ground to it), and the STUDENT LOT with the cars still in it, which is the tell that it is a high school and not a middle school. No playground and no tennis: both were rulings, both are held at zero by the gate.',
    'courthouse': 'Courthouse — matched: a stately civic block on a podium + a COLUMN PORTICO + grand STEPS + a DOME.',
    'apartment': 'Garden apartments — matched: three walk-up BLOCKS around a court, their circulation on the OUTSIDE the way Sun Belt walk-ups build it (open WALKWAY DECKS on two levels and the stair run at the end), the DRAINED POOL in the middle of the court, the clubhouse, and the perimeter fence.',
    'arterial': 'Arterial — matched: the INTERSECTION, with SIGNAL MASTS reaching their long arms out over the lanes and the heads hanging off them, crosswalk ladders on all four legs, the raised MEDIAN with its dead palms, sidewalk and block wall behind, and streetlights. The mast arm is the vertical; everything else is flat by nature.',
    'boneyard': 'Wrecking yard — matched: six CRUSHED-CAR STACKS, flattened bodies piled six and eight high in leaning towers — a shape nothing else makes — with the CRANE and its grapple standing over them, loose wrecks in three faded colours filling the dirt aisles, tyre piles and the parts office.',
    'cemetery': 'Memorial park — matched: the MAUSOLEUM with its colonnade front (the only building with height on a cemetery), the HEADSTONE FIELD gridded around it, the OBELISK monument, a columbarium wall and the dead trees in their grates.',
    'desert': "Open desert — LOW BY NATURE and named as such: there is no building in open Mojave and inventing one would be a lie about the map. What it has is TEXTURE — varnished desert pavement, rock lag, CREOSOTE in its evenly spaced grid (they poison each other's roots, which is why the spacing is even), bursage between them, a dry rill, rock outcrops, dead yucca, dumped debris and a burned car.",
    'drivein': 'Drive-in theater — matched: the SCREEN TOWER, a flat wall four storeys high standing alone with its back bracing and nothing behind it, which is the most recognisable silhouette the American roadside has. Seven RAMPED ROWS of earth with speaker poles and the cars that never left, and the projection booth.',
    'freeway': 'Freeway — matched: the ELEVATED DECK on its columns crossing the lanes, a SIGN GANTRY over them with its panels blank, sound walls the length of both embankments, the median barrier and a dead semi in the slow lane. The deck and the gantry are SPANS, not canopies (8/2) — infrastructure carrying something across a gap.',
    'golf': 'Golf course — matched: three GREENS each ringed by its SAND BUNKER with the pin and flag standing in it — in act 1 the fairways are dead brown and only the sand still reads bright, so the bunkers do the work. Plus the dry water hazard, the tee boxes, the CLUBHOUSE under its gable and a cart left mid-round.',
    'jail': 'Detention center — matched, on the CLARK COUNTY DETENTION CENTER (JMA with HOK, 1981-84): a twelve-storey TOWER with narrow horizontal window bands, designed on a brief to NOT LOOK LIKE A JAIL because it sits blocks from Fremont. The walled SECURE YARD with razor wire and four GUARD TOWERS at its feet is what gives it away.',
    'landfill': 'Landfill — matched, on APEX REGIONAL (2,200 acres, the largest in the world by area and volume): the TERRACED MOUND, four stepped benches with waste layered under each like a sheet cake, GAS WELLS piped down the face, a FLARE STACK burning what the methane plant does not take, the scale house and a leachate pond.',
    'mountain': 'Mountain — matched: a limestone RIDGE on the valley rim, a stepped massif rising to one summit with CLIFF BANDS across its sunward face, TALUS fans off the foot, a ravine cut into the flank and boulders on the apron. The tallest thing in the valley and it reads that way at map zoom.',
    'railyard': 'Rail yard — matched: the TRACK FAN spreading out of one throat (a shape nothing else in the valley makes), the ENGINE SHED at its head with a locomotive standing in the shed road, boxcars down the body roads, and the GANTRY CRANE straddling the container aisle.',
    'substation': 'Transmission substation — matched: a YARD OF FRAMES, not a building. Three lattice SWITCHGEAR structures carrying BUSBARS overhead on insulators, six TRANSFORMER BANKS with radiator fins and bushings under them, and the small control house. The open steel frame against sky is the only one in the valley.',
    'suburb': 'Subdivision — matched: a CUL-DE-SAC bulb with eight houses shoulder to shoulder around it, gabled roofs, GARAGE doors facing the street, and the continuous BLOCK WALL that rings the whole thing — the defining feature of a Sun Belt subdivision from the air (7/21 Vegas urbanism research).',
    'trailer': 'Mobile home park — matched: fifteen SINGLE-WIDES on their pads, all the same way round, skirted, with a ridge cap, a SHED and a PROPANE BOTTLE beside each one — and the one BURNED-OUT unit that stopped a row. A trailer park reads as a barcode from above and this one does.',
    'wash': 'Flood channel — matched, on the LAS VEGAS WASH: a lined TRAPEZOIDAL CHANNEL cut straight across the plot, sloped concrete walls down to a flat invert with the low-flow trickle in it, riprap on the banks, a road BRIDGE on piers over it, and the SEWER TUNNEL MOUTH in the wall — which is the way IN, and why this district matters at all.',
    'water': 'Lake shore — LOW BY NATURE and named as such: the subject is a horizontal. What makes it legible is the BATHTUB RING, the white mineral band the water left on the rock as it dropped over twenty years, with the exposed lakebed cracking below it, shore rock above, and a LAUNCH RAMP that now ends a long way short of the water. The sunken boat is the punchline.',
    'waterpark': "Water park — matched, on the dead WET'N'WILD (27 acres on the Strip, 1985-2004): the SLIDE TOWER, four stacked platforms with FLUMES spiralling off all four corners, the drained WAVE POOL with its wave wall and shallow end, a splash pool, the locker building, the snack bar and the lounger row.",
    'watertreat': 'Water reclamation plant — matched: CIRCLES, which no other industrial site has. Four CLARIFIER drums with the rotating bridge across each one and crusted sludge in the floor, the baffled AERATION CHANNEL beside them making the circles read as circles, the blower house and the pipe gallery.',
    'chapel': 'Church — matched: the CRUCIFORM plan (nave crossed by the transepts, a rounded APSE at the head, the NARTHEX porch at the foot) under its roof RIDGE, the BELL TOWER with its belfry and cross finial, the walled MEMORIAL COURT with its columbarium and dead planting, and a forecourt with the churchyard cross, the fallen bell and the dry font. There was no chapel icon at all until 8/2, and Paolo scored the empty panel 0%.',
    'library': 'Library — matched to the rebuilt district, which is built on the real reference: Antoine Predock\'s Las Vegas Library and Lied Discovery Museum (1986-90, Las Vegas Blvd). The DRUM with its oculus ring and lantern, the giant concrete TOWER, and the long reading wing under a clerestory that runs its whole length, all on a raised terrace above the plaza — sandstone and concrete, because in Predock\'s words the colour scheme is provided by the desert. The old icon was a classical COLONNADE, which is a library from a different country and a different century.',
    'farm': 'Farm — matched: a red BARN + a tall SILO + a farmhouse + a dead tractor + crop-row fields (dirt, not grass).',
    'firestation': 'Fire station — matched: quarters + a bay block with RED apparatus doors + a HOSE TOWER + a red fire engine + staff car.',
    'policestation': 'Police station — matched: a station building + a SALLY PORT + a PATROL-CAR fleet + an impound wreck + a roof antenna + a fence.',
    'solar': 'Solar — matched: a FIELD of tilted PV panel rows + a control building + inverter pads + substation switchgear.',
    'stadium': 'Stadium — matched: the oval seating BOWL + facade + a field + four LIGHT TOWERS + a scoreboard + a parking field.',
    'storage': 'Self-storage — matched: unit rows wall-to-wall with ORANGE roll-up doors + a leasing office + a fortress fence.',
    'truckstop': 'Truck stop — matched: a store/diner + a big FUEL CANOPY over pumps + a wash bay + a tall PYLON sign + parked rigs.',
    'swapmeet': 'Swap meet — matched: a food hall + rows of colorful STALL TENTS (the market) + a pylon sign + gravel lot.',
    'rail': 'Railway — matched to the walkable corridor: two ballasted TRACKS with a dead LOCOMOTIVE and FREIGHT WAGONS standing on them + a wayside SIGNAL and its RELAY HUT + the at-grade CROSSING with the GATE ARM still down + the ROW fence + the rail-served LOADING DOCK and stacked relay steel.',
    'interchange': 'Interchange — matched: two carriageways crossing on TWO LEVELS, the upper one on a piered DECK, with a connector RAMP curving up to it + a HIGH-MAST light + the sound wall + the retention basin + the jam that never moved.',
    'airport': 'Airport — matched: the RUNWAY and its centreline + the amber TAXIWAY + the TERMINAL + a JET BRIDGE still docked to a dead AIRLINER on the stand + a floodlight mast + the perimeter fence.',
    'campus': 'Campus — matched to the walkable district: the QUAD with its diagonal walks and DRY FOUNTAIN, the academic halls turned to FACE it, the colonnaded LIBRARY as the biggest mass, a residence hall set apart, dead quad trees.',
    'speedway': 'Speedway — matched: the banked OVAL with its painted apron, the GRANDSTAND on the front stretch only, the GARAGE ROW and pit lane inside, the spectator TUNNEL mouth, a catch fence and one light tower.',
    'town': 'Town — matched to the walkable district: the STREET WALL of attached FALSE-FRONT storefronts on both sides of one wide main street, the covered BOARDWALK between the shopfronts and the kerb, the SALOON and the HALL as the anchors, the one CROSS STREET that makes it a block instead of a corridor, angle bays, houses on dirt lots out back, the fuel CANOPY at the town\'s mouth, and the WATER TOWER standing over all of it.',
    'ballpark': 'Ballpark — matched: the ninety-degree DIAMOND seen from behind home plate, the skinned infield with its MOUND and bases, the chalked FOUL LINES, dead outfield turf inside a WARNING TRACK and the outfield WALL, a raked GRANDSTAND bowl that wraps the plate and stops at the poles, the CONCOURSE behind it, DUGOUTS and BULLPENS down both lines, and six LIGHT TOWERS.',
    'airbase': 'Air base — matched: the same field with the military landside — two arch-roofed HANGARS with their doors open + a dead FIGHTER on its alert pad between two concrete blast REVETMENTS + the blast pad off the runway threshold.',
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
        'gym block — the taller gymnasium mass (code 14 tone)',
        'auto shop (CTE) — an industrial volume with three north-light sawtooth monitors on its roof and a roll-up bay door on the front face (code 20)',
        'shop yard — the oiled slab in front of the bays, with a dead car left in it (code 8)',
        'ground entrance — doors on the spine front, and a second set on the gym',
        'student lot — the cars nobody came back for (canon CAR, code 17); lot + drive (code 1)',
    ],
    'courthouse': [
        'podium — the raised civic base/steps mass (code 6 "grand steps")',
        'civic block — the stately building on the podium (code 2), windows',
        'column portico x6 — the front colonnade + a lintel (code 8 "portico columns")',
        'grand steps — the tiered steps down to grade (code 6)',
        'dome/cupola — the dome on the roof center (code 10 "dome / cupola"); plaza (code 7) + lot/drive (code 1)',
    ],
    'chapel': [
        'nave — the long bar of the cross, stained glass down its flank (code 2 "building (church)")',
        'transepts — the arms that cross it, which is what makes the plan a CROSS from the air (code 2)',
        'apse — the rounded head at the north end (code 2)',
        'roof ridge — the pitched line down the nave and both arms (code 22 "roof ridge")',
        'narthex — the entry porch at the foot, doors at ground (code 2 + code 18 "doorway")',
        'bell tower — the only vertical thing on a Mojave churchyard: belfry opening (code 11 "stained glass") + a cross finial (code 10)',
        'memorial court — the walled square of decomposed granite (code 4 "memorial court") inside its COLUMBARIUM wall (code 13), dead planting down the middle (code 3)',
        'churchyard cross — the standing cross in the forecourt (code 10)',
        'fallen bell — the bell itself, on the ground where it came through the belfry floor (code 10)',
        'dry font — the font in the forecourt, a ring with nothing in it (code 21 "dry font")',
        'pole lights x2 + abandoned car (canon CAR) — the forecourt lights (code 9) and the lot (code 1)',
    ],
    'chapel': [
        'nave — the long bar of the cross, stained glass down its flank (code 2 "building (church)")',
        'transepts — the arms that cross it, which is what makes the plan a CROSS from the air (code 2)',
        'apse — the rounded head at the north end (code 2)',
        'roof ridge — the pitched line down the nave and both arms (code 22 "roof ridge")',
        'narthex — the entry porch at the foot, doors at ground (code 2 + code 18 "doorway")',
        'bell tower — the only vertical thing on a Mojave churchyard: belfry opening (code 11 "stained glass") + a cross finial (code 10)',
        'memorial court — the walled square of decomposed granite (code 4) inside its COLUMBARIUM wall (code 13), dead planting down the middle (code 3)',
        'churchyard cross — the standing cross in the forecourt (code 10)',
        'fallen bell — the bell itself, on the ground where it came through the belfry floor (code 10)',
        'dry font — the font in the forecourt, a ring with nothing in it (code 21 "dry font")',
        'pole lights x2 + abandoned car (canon CAR) — the forecourt lights (code 9) and the lot (code 1)',
    ],
    'library': [
        'terrace — the raised base the whole composition sits on (code 13 "terrace / walk")',
        'the DRUM — a stepped cylinder so it reads round at icon size, capped by the OCULUS ring and its lantern (code 2 sandstone, code 14 "oculus ring")',
        'the TOWER — the tall square concrete mass, rooftop plant on its cap (code 2, code 10 "rooftop plant")',
        'the READING WING — a long low bar with nine CLERESTORY teeth running its length (code 2, code 11 "clerestory glazing")',
        'ground entrance doors on the wing; entry plaza (code 7) + lot/drive (code 1) with one dead car (canon CAR, code 19)',
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
    # ---- THE SURFACES (7/27, the icon law). Every part is a landmark out of the
    # surface's own engine module, in that module's own palette.
    'campus': [
        'quad — the open green heart with its diagonal walks, the thing that makes a campus a campus (walkable code 4 "quad (dead lawn)" + code 6 "walkway / plaza")',
        'dry fountain — the basin where the walks cross, silted, the jet dead (code 7 "dry fountain")',
        'library — the biggest single mass, with a COLONNADE of six piers and an architrave facing the quad, doors at ground (code 8 "library")',
        'academic halls x2 — teaching blocks turned to FACE the quad, windows with dead panes, a door at grade on the quad side (code 2 "academic hall")',
        'residence hall — set apart behind the teaching core, every window dark (code 9 "residence hall")',
        'dead quad trees x4 — trunk plus a bare crown, the irrigation that kept them long gone (code 3 "dead tree")',
        'pole lights x3 — campus lights, heads dark (code 12 "pole light")',
        'abandoned car (canon CAR) — one at the kerb (code 1 pavement / drive); the paved ring is the drive apron',
    ],
    'speedway': [
        'banked oval — the racing surface as a raised ring, which IS the signature and the reason this icon reads at 1x1 (code 6 "racing surface")',
        'painted apron — the marking ring on the inside edge of the banking (code 7 "track marking")',
        'infield — the dead turf inside the oval, sunk below the banking (code 4 "infield (dead turf)")',
        'grandstand — three rising tiers on the FRONT STRETCH ONLY, because three of the four sides of a superspeedway have no stands (code 2 "grandstand")',
        'garage row x7 — the bays behind pit lane, inside the oval (code 8 "garage row")',
        'pit lane — the painted lane in front of the garages (code 9 "pit road" / code 10 stall markings)',
        'tunnel mouth — the spectator underpass, the only way into the infield (code 13 "tunnel mouth")',
        'catch fence posts — the fence ring outside the banking (code 11 "catch fence")',
        'light tower — the tallest thing on the site, head dark (code 12 "light tower")',
        'dead race cars x3 (canon CAR) — still on the grid where the race stopped (code 14 "dead race car")',
    ],
    'ballpark': [
        'outfield — the quarter disc of dead turf between the two foul lines, which IS the signature: a ninety-degree wedge, where the stadium district is a closed ring (code 4 "outfield (dead turf)")',
        'warning track — the band of skinned dirt inside the wall, so a fielder feels the wall before he hits it (code 6 "infield dirt")',
        'outfield wall — the arc of padded wall on the same radius as the field (code 11 "outfield wall")',
        'skinned diamond — the dirt square joining the four bases, which renders as a DIAMOND in the 45-degree view because the foul lines really are perpendicular (code 6)',
        'pitcher\'s mound — the raised mound at the middle of the diamond (code 14 "pitcher\'s mound")',
        'bases x4 + chalked foul lines — the bases and the two lines running out to the poles (code 7 "base / chalk")',
        'grandstand — three RAKED tiers wrapping from foul pole round behind home plate and stopping at the other pole, because no small park seats the outfield (code 2 "grandstand")',
        'concourse — the walkway ring behind the seating (code 9 "concourse")',
        'dugouts x2 — sunk on both baselines in FOUL territory, where a dugout actually is (code 8 "dugout")',
        'bullpens x2 — past the end of the seating down both lines (code 13 "bullpen")',
        'light towers x6 — the masts ringing the field, every head dark (code 12 "light tower")',
        'abandoned car (canon CAR) — one left in the lot (code 1 "parking / drive")',
    ],
    'town': [
        'street wall (both sides) — attached storefronts shoulder to shoulder, no gaps, which IS the signature: gaps between buildings make a strip mall, a much later object (code 2 "storefront")',
        'false fronts — the tall parapet on the STREET face of every unit, hiding a shallow roof (code 7 "false front")',
        'saloon + hall anchors — the two bigger units, one per side (code 8 "saloon / hall")',
        'boardwalk + shade canopy — the covered footway between the shopfronts and the kerb, under a continuous canopy (code 6 "boardwalk")',
        'main street — the one wide carriageway, laid out for a wagon team to turn in (code 1 "main street")',
        'cross street — the junction that makes the row a BLOCK instead of a corridor; the walkable district had none in its first pass and read as a barcode (code 1)',
        'angle bays — the angled parking down both kerbs, the other thing that says main street (code 10 "angle-park marking")',
        'houses x4 + shed — detached houses on dirt lots out behind the row (code 9 "house", code 15 "shed / outbuilding")',
        'fuel canopy + pumps — the station at the town\'s mouth, the one OVERHEAD layer you walk under (code 16 "fuel canopy")',
        'water tower — the tank on its four legs, the tallest thing here and the reason the town is here at all (code 11 "water tower")',
        'pole lights x4 — the street poles, heads dark (code 12 "pole light")',
        'abandoned cars x2 (canon CAR) — left in the street where they died (code 1)',
    ],
    'rail': [
        'main track — the ballast prism (code 1 "ballast") with sleepers across it (code 2 "tie") and two gauge-spaced running rails (code 3 "rail")',
        'second track — the same prism again, because the walkable corridor is a TWO-track mainline, not a single line',
        'dead locomotive (canon LOCO) — the road unit standing on the main where the crew left it (code 11 "dead locomotive"), short hood + cab',
        'dead freight wagons x2 (canon RAILCAR) — covered hoppers standing on the second track (code 10 "dead freight car")',
        'wayside signal — the mast and its head, every lamp dark (code 8 "signal mast")',
        'relay hut — the signal relay hut at the foot of the mast, door at ground, racks stripped (code 9 "relay hut")',
        'grade crossing — the roadway carried straight through the right of way (code 12 "crossing pavement") with a stop bar on each approach (code 13 "crossing marking")',
        'gate arm — the crossing mast and its arm, still down across the road (code 14 "gate arm")',
        'loading dock — the rail-served dock wall and shed behind the corridor (code 20 "dock wall") with its dock doors, on the concrete pad (code 19 "loading pad")',
        'scrap stacks x3 — relay rail, ties and cut steel stacked on the frontage (code 15 "scrap pile")',
        'right-of-way fence x4 — the fence line along the corridor (code 7 "ROW fence")',
        'ground — the walking cess either side of the ballast (code 4 "cess"), the material yard (code 21) and the gravel maintenance road (code 6 "service road")',
    ],
    'interchange': [
        'lower carriageway — the at-grade interstate running east-west (code 1 "travel lane") with its paved shoulders (code 3 "shoulder")',
        'lane lines — the dashed white lines on both roadways (code 2 "white lane line"); no yellow exists on a freeway, the barrier does that job',
        'median barrier — the concrete F-shape barrier down the middle of the lower road (code 4 "median barrier")',
        'piers x6 — the concrete piers standing in the lower road\'s median and on its shoulders (code 13 "pier")',
        'deck — the upper carriageway crossing north-south on its own structure (code 12 "deck"), the two-level truth the whole junction is about',
        'deck guardrail — the steel rail down both edges of the deck (code 5 "guardrail")',
        'connector ramp — the two-lane ramp curving up out of the lower road to deck height on its own bents (code 16 "ramp lane")',
        'gore marking — the painted nose where the ramp splits off (code 18 "gore marking")',
        'dead cars x3 + dead semi (canon CAR / TRAILER) — the jam that started here and never moved (codes 10, 11)',
        'debris — a blown tyre and glass in the lane (code 15 "rubble / debris")',
        'high-mast light — the light tower over the junction, every head dark (code 9 "high-mast light")',
        'sound wall — the block wall around the outside of the structure (code 8 "sound wall")',
        'retention basin — the drainage basin the whole structure sheds into (code 19 "retention basin")',
        'dry brush x3 — waist-high brush in the unreachable infield (code 7 "dead brush") on the graded embankment (code 6)',
    ],
    'airport': [
        'runway — the runway strip across the field (code 1 "runway") with its paved shoulder (code 3)',
        'runway centreline — the dashed chalky centreline down it (code 2 "runway marking")',
        'taxiway — the full-length parallel taxiway (code 4 "taxiway") with the amber centreline that is the one warm line on the whole field (code 5 "taxi centreline")',
        'terminal — the terminal block, glass dead dark, doors at ground standing open (code 8 "terminal")',
        'jet bridge — the bridge still docked to the aeroplane, on its rotunda leg (code 10 "jet bridge")',
        'dead airliner (canon AIRLINER) — the narrowbody on the stand: fuselage, nose, swept wings, tailplane and fin (code 11 "dead airliner")',
        'stand lead-in line — the painted lead-in to a stand nobody is coming to (code 7 "stand marking")',
        'floodlight mast — the apron light mast, every head dark (code 15 "light mast")',
        'perimeter fence x4 — the field fence (code 13 "perimeter fence"); the apron (code 6) and the service road (code 14) are the ground',
    ],
    'airbase': [
        'runway — the runway strip (code 1 "runway") with its paved shoulder (code 3) and the chevroned blast pad off the threshold (code 16 "blast pad")',
        'runway centreline — the dashed centreline (code 2 "runway marking")',
        'taxiway — the parallel taxiway (code 4) and its amber centreline (code 5 "taxi centreline")',
        'hangars x2 — the landside row: arch-roofed hangars with the doors standing half open on nothing (code 9 "hangar")',
        'blast revetments x2 — the concrete walls either side of the alert pad (code 17 "revetment")',
        'dead fighter (canon FIGHTER) — the aeroplane on the pad between the revetments, canopy up, tyres flat (code 12 "dead fighter")',
        'alert-pad lead-in line — the painted lead-in onto the pad (code 7 "stand marking")',
        'floodlight mast — the apron light mast, dark (code 15 "light mast")',
        'perimeter fence x4 — the field fence (code 13); the apron (code 6) and the service road (code 14) are the ground',
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
        _draw_ground(scene)                       # the pad, fitted to what got built
        # BIGGER (Paolo 8/2: "I want them taller. I want them wider... big as fuck as big
        # as we can have it"). The sprite frames TIGHT on the building now that the parking
        # is gone, and the scale is lifted so the mass fills the square instead of sitting
        # small in the middle of an apron it no longer has.
        scale = scale * 1.55
        w, h, origin = _fit(scene, scale, margin=5)
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
