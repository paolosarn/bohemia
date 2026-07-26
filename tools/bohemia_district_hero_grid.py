#!/usr/bin/env python3
"""BOHEMIA DISTRICT HERO — GRID-DRIVEN (7/24/26). PROTOTYPE.

Paolo 7/24, "very important": the city-builder 1x1 hero sprite and the on-foot
WALKABLE district must be DAMN NEAR the same, not two separate inventions. So the
hero is now EXTRUDED FROM the district's own canonical grid (the exact layout you
walk through) — same footprints, same palette, same landmarks. One canonical
body, two renders (ENGINE SYNC LAW). tools/bohemia_district_grid_dump.js runs the
engine generate() and dumps the grid; this extrudes it to a 3D sprite and bakes
it with tools/bohemia_iso3d.py.

REUSE CHECK: this cooks NO new pixels of its own — it reuses each district's OWN
canon PALETTE (from engine/bohemia_<district>.js, dumped to district_grids.json)
and the shared 3D baker (tools/bohemia_iso3d.py). Nothing sampled from banks/
because the source of truth is the district engine module itself.
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

SCRATCH = '/tmp/claude-0/-home-user-bohemia/96a4de31-15c3-52d6-95f6-8087b9cb9964/scratchpad'
GRIDS = os.path.join(SCRATCH, 'district_grids.json')

# how tall each legend KIND stands when extruded (world units), + per-district overrides
KIND_H = {'ground': 0, 'drive': 0, 'gate': 0, 'marking': 0, 'water-dead': 0,
          'tree-dead': 1.8, 'prop': 1.3, 'vehicle': 2.2, 'overhead': 0,
          'building': 8.0, 'structure': 9.0}
OVERRIDE = {
    'cityhall': {'building': 22.0, 'structure': 6.0},
    'battery':  {'building': 8.0,  'structure': 13.0},
    'terminal': {'building': 8.0,  'structure': 10.0},
}
OVERHEAD_Z = 4.6      # canopy floats here
GROUND_KINDS = {'ground', 'drive', 'gate', 'marking', 'water-dead'}


def _hex(h):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def _trim(grid, W, H):
    # bounding box of everything that isn't desert (code 0), padded by 2
    xs0, ys0, xs1, ys1 = W, H, 0, 0
    for y in range(H):
        for x in range(W):
            if grid[y][x] != 0:
                xs0 = min(xs0, x); ys0 = min(ys0, y)
                xs1 = max(xs1, x); ys1 = max(ys1, y)
    xs0 = max(0, xs0 - 2); ys0 = max(0, ys0 - 2)
    xs1 = min(W - 1, xs1 + 2); ys1 = min(H - 1, ys1 + 2)
    return xs0, ys0, xs1, ys1


def _downsample(grid, x0, y0, x1, y1, block, kinds):
    """majority code per block, but a RAISED kind in the block wins over ground
    (keeps buildings/structures/buses/landmarks from being washed out)."""
    out = []
    for by in range(y0, y1 + 1, block):
        row = []
        for bx in range(x0, x1 + 1, block):
            counts = {}
            raised = {}
            for yy in range(by, min(by + block, y1 + 1)):
                for xx in range(bx, min(bx + block, x1 + 1)):
                    c = grid[yy][xx]
                    counts[c] = counts.get(c, 0) + 1
                    if kinds.get(str(c), 'ground') not in GROUND_KINDS:
                        raised[c] = raised.get(c, 0) + 1
            pick = max(raised, key=raised.get) if raised else max(counts, key=counts.get)
            row.append(pick)
        out.append(row)
    return out


def _winmat(wall):
    return {'t': 'win', 'wall': wall, 'glass': (34, 40, 48),
            'frame': tuple(min(255, int(c * 1.12)) for c in wall),
            'cols': 2, 'rows': 3, 'dead': 0.14,
            'boardc': tuple(int(c * 0.85) for c in wall), 'breakc': (14, 16, 18), 'deadseed': 5}


def build(district, data, cw=1.0):
    grid, W, H = data['grid'], data['W'], data['H']
    pal = {int(k): _hex(v) for k, v in data['palette'].items()}
    kinds = data['kinds']
    ov = OVERRIDE.get(district, {})
    x0, y0, x1, y1 = _trim(grid, W, H)
    block = 3
    ds = _downsample(grid, x0, y0, x1, y1, block, kinds)
    nH = len(ds); nW = len(ds[0])
    s = Scene()
    CONCRETE = (74, 72, 66)
    for j in range(nH):
        for i in range(nW):
            c = ds[j][i]
            k = kinds.get(str(c), 'ground')
            col = pal.get(c, (90, 90, 90))
            wx, wy = i * cw, j * cw
            # ground plate under every cell (raised cells get a concrete pad)
            base = col if k in GROUND_KINDS else CONCRETE
            s.box((wx, wy, -0.4), (cw, cw, 0.45), {'c': base})
            if k in GROUND_KINDS:
                continue
            if k == 'overhead':
                # a floating canopy slab (buses/platform read underneath)
                s.box((wx, wy, OVERHEAD_Z), (cw, cw, 0.4), {'c': col})
                continue
            h = ov.get(k, KIND_H.get(k, 1.5))
            if h <= 0:
                continue
            if k in ('building', 'structure') and h >= 4:
                mats = {'top': {'c': tuple(int(v * 0.9) for v in col)},
                        'px': _winmat(col), 'py': _winmat(col),
                        'nx': {'c': tuple(int(v * 0.82) for v in col)},
                        'ny': {'c': tuple(int(v * 0.82) for v in col)}}
                s.box((wx, wy, 0), (cw, cw, h), mats)
            else:
                s.box((wx, wy, 0), (cw, cw, h), {'c': col})
    return s, 7.5


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


def main():
    data = json.load(open(GRIDS))
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for district, dd in data.items():
        if only and district != only:
            continue
        scene, scale = build(district, dd)
        w, h, origin = _fit(scene, scale)
        img = bake(scene, w, h, origin=origin, scale=scale, ss=3)
        Image.fromarray(img, 'RGBA').save(os.path.join(SCRATCH, 'hg_%s.png' % district))
        print('  %-9s %dx%d  (%d faces)' % (district, w, h, len(scene.faces)))


if __name__ == '__main__':
    main()
