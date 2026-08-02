#!/usr/bin/env python3
"""
ROUND ROOFS AND DOORS GATE (8/2/26, WORLD lane).

    "The icons are tweaking out a little bit. I don't know why every time you make a
     circular shape the roof of all your circles looks like tarps and shit. It's very
     bad. Doors aren't where they're supposed to."
                                                            -- Paolo, 8/2/26

Two findings in one sentence, and BOTH ARE PIPELINE BUGS, not content -- which is why he
kept seeing them survive rebuild after rebuild. VERIFY ON THE REAL SURFACE (7/18) names
this exactly: a symptom that survives content changes is a PIPELINE bug.

1. THE ROOF OF EVERY CIRCLE. Scene.prism's top cap was emitted as
       for i in range(0, n - 2, 2): quad(topv[0], topv[i+1], topv[i+2], topv[min(i+2,n-1)])
   which STEPS BY TWO (so half the fan is never drawn -- wedge-shaped HOLES) and whose
   fourth vertex is the SAME POINT as its third (so every quad it does emit is a
   degenerate sliver). Holes plus slivers at 2:1 iso is a tarp pegged over a drum. It was
   in EVERY circular thing the factory has ever baked. Fixed to a centred fan.

2. DOORS OFF THEIR WALLS. `_door(s, at, lo, hi, ...)` takes a bare plane and a bare span
   and draws a leaf there, and nothing ever checked a wall was behind it. Fixed by
   deriving the face from the solid (`_door_face`) -- and by this gate, which checks the
   geometry instead of trusting anyone to call the right helper.

WHY THIS GATE MEASURES AND DOES NOT JUST GREP. The 8/2 library post-mortem is about a
gate that asserted a made-up count and then forced every future session to keep the bug.
So: this one bakes every hero for real and then asks the geometry --
    - does every prism cap CLOSE? (fan quads must cover the full turn, no repeats)
    - does every door stand ON a solid's face, with wall behind it and floor under it?
No source-text check anywhere. A tool can always be edited around a grep.

  python3 gates/round_and_doors_gate.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools'))

PASS = FAIL = 0
def ok(n, c):
    global PASS, FAIL
    if c:
        PASS += 1
    else:
        FAIL += 1
        print('  FAIL: ' + n)


try:
    import bohemia_iso3d as ISO
    import bohemia_district_hero_factory as F
except Exception as e:                                             # noqa: BLE001
    print('  FAIL: the hero factory does not import (%s)' % str(e)[:140])
    print('ROUND AND DOORS GATE: 0 passed, 1 failed')
    sys.exit(1)

EPS = 1e-6

# ---------------------------------------------------------------- 1. THE ROUND ROOF
# Bake a prism on its own and interrogate the cap it produced. A closed cap covers the
# whole turn exactly once: every rim vertex is used, and no quad repeats a vertex.
for n in (12, 18, 20, 24):
    sc = ISO.Scene()
    before = len(sc.faces)
    sc.prism(0.0, 0.0, 0.0, 3.0, 4.0, n, {'c': (200, 200, 200)})
    caps = [f for f in sc.faces[before:] if f[2] == (0, 0, 1)]
    ok('the cap of an %d-gon prism is EMITTED at all' % n, len(caps) > 0)

    degenerate = 0
    for verts, _uv, _nrm, _m in caps:
        for a in range(4):
            for b in range(a + 1, 4):
                if all(abs(verts[a][k] - verts[b][k]) < EPS for k in range(3)):
                    degenerate += 1
    ok('no cap quad on an %d-gon REPEATS A VERTEX (a repeated vertex is a sliver, and '
       'slivers are half of why a circle read as a tarp)' % n, degenerate == 0)

    # every rim vertex must appear in the cap, or there is a hole where it is missing
    rim = set()
    import math
    for i in range(n):
        rim.add((round(3.0 * math.cos(2 * math.pi * i / n), 5),
                 round(3.0 * math.sin(2 * math.pi * i / n), 5)))
    used = set()
    for verts, _uv, _nrm, _m in caps:
        for v in verts:
            used.add((round(v[0], 5), round(v[1], 5)))
    ok('the %d-gon cap USES EVERY RIM VERTEX — a missing one is a wedge-shaped HOLE in '
       'the roof, which is the other half of the tarp' % n, rim <= used)

    # area check: the cap's quads must sum to the polygon's own area (no gaps, no overlap)
    def _area(vs):
        a = 0.0
        for i in range(len(vs)):
            x1, y1 = vs[i][0], vs[i][1]
            x2, y2 = vs[(i + 1) % len(vs)][0], vs[(i + 1) % len(vs)][1]
            a += x1 * y2 - x2 * y1
        return abs(a) / 2.0
    poly = 0.5 * n * 3.0 * 3.0 * math.sin(2 * math.pi / n)
    got = sum(_area(v) for v, _u, _nn, _m in caps)
    ok('the %d-gon cap COVERS ITS OWN AREA (%.2f of %.2f) — under is a hole, over is an '
       'overlap, and both show' % (n, got, poly), abs(got - poly) < poly * 0.02)

# ---------------------------------------------------------------- 2. DOORS ON WALLS
P = F._load_pal()
floating, checked, doorless = [], 0, []
for d, fn in sorted(F.HEROES.items()):
    try:
        scene, _scale = fn(P[d])
    except Exception as e:                                          # noqa: BLE001
        floating.append('%s (build failed: %s)' % (d, str(e)[:60]))
        continue
    doors = getattr(scene, 'doors', [])
    if not doors:
        doorless.append(d)
        continue
    for (at, lo, hi, ztop) in doors:
        checked += 1
        cy = (lo + hi) / 2.0
        on_wall = False
        for (sx, sy, sz, dx, dy, dz) in scene.solids:
            # the leaf must sit on the +x face plane of this solid, its span inside the
            # solid's own y-span, its head under the solid's roof, and its foot at grade
            if not (abs((sx + dx) - at) <= 0.25
                    and sy - 0.05 <= cy <= sy + dy + 0.05
                    and lo >= sy - 0.35 and hi <= sy + dy + 0.35
                    and ztop <= sz + dz + 0.35):
                continue
            # the wall's foot is either at grade, or standing on a PODIUM that reaches
            # grade underneath it -- a door at the top of a plinth is a real door.
            if sz <= 0.35 or any(px <= at <= px + pdx + 0.3 and py - 0.3 <= cy <= py + pdy + 0.3
                                 and pz <= 0.35 and pz + pdz >= sz - 0.05
                                 for (px, py, pz, pdx, pdy, pdz) in scene.solids):
                on_wall = True
                break
        if not on_wall:
            floating.append('%s @x=%.2f y=%.1f..%.1f' % (d, at, lo, hi))

ok('EVERY DOOR STANDS ON A WALL: %d doors checked across %d heroes, and each one has a '
   'solid whose +x face it sits on, whose y-span contains it, and whose roof is above its '
   'head (Paolo 8/2: "doors aren\'t where they\'re supposed to")%s'
   % (checked, len(F.HEROES), ('  -- floating: ' + '; '.join(floating[:8])) if floating else ''),
   not floating)
# A BUILDING YOU CANNOT ENTER IS NOT A BUILDING. Twelve heroes have no door on them at
# all, which is the strongest form of what he caught. Named, so the list can only SHRINK
# -- the same ratchet the silhouette twins and the monoblocks run on. Do not add to it:
# new work must ship with a door.
DOORLESS_DEBT = {
    'ballpark', 'farm', 'firestation', 'industrial', 'interchange', 'solar',
    'speedway', 'stadium', 'storage', 'swapmeet', 'town', 'warehouse',
}
new_doorless = sorted(set(doorless) - DOORLESS_DEBT)
stale = sorted(DOORLESS_DEBT - set(doorless))
ok('NO NEW DOORLESS HERO: a building you cannot enter is not a building, and anything '
   'built from here ships with a door%s'
   % (('  -- new: ' + ', '.join(new_doorless)) if new_doorless else ''), not new_doorless)
ok('THE DOORLESS DEBT ONLY SHRINKS: nothing is still on the list that already has a door%s'
   % (('  -- stale: ' + ', '.join(stale)) if stale else ''), not stale)
print('  DOORLESS DEBT: %d declared, %d actually doorless' % (len(DOORLESS_DEBT), len(doorless)))

# ------------------------------------------------- 3. SLABS DO NOT TUNNEL THROUGH WALLS
# Paolo, 8/2: "details shits just looking glitchy for all of them bro."
# A CANOPY PROJECTS OFF A BUILDING, IT DOES NOT PASS THROUGH ONE. City hall's entry canopy
# ran straight through the council chamber, the courthouse's through the rotunda, and the
# terminal's solar deck through the curved concourse. At icon size a thin slab crossing a
# mass reads as a rendering error, which is exactly the word he used.
tunnels = []
for d, fn in sorted(F.HEROES.items()):
    try:
        scene, _scale = fn(P[d])
    except Exception:                                               # noqa: BLE001
        continue
    slabs = [s2 for s2 in scene.solids if s2[5] <= 0.8 and s2[2] >= 2.0]      # thin AND high
    masses = [s2 for s2 in scene.solids if s2[5] >= 2.0]                      # a real volume
    for (ax, ay, az, adx, ady, adz) in slabs:
        for (bx, by, bz, bdx, bdy, bdz) in masses:
            # THE TEST: does the slab overlap, in PLAN, a mass that stands MEANINGFULLY
            # taller than the slab's own top? Then the mass must be passing through it.
            # A cap sitting on its own drum grazes a neighbour by a few hundredths and is
            # not this; the 0.5 margin is what separates a merge seam from a tunnel.
            if bz + bdz <= az + adz + 0.5:
                continue
            ox_ = min(ax + adx, bx + bdx) - max(ax, bx)
            oy_ = min(ay + ady, by + bdy) - max(ay, by)
            if ox_ > 0.45 and oy_ > 0.45:
                tunnels.append('%s slab top z=%.1f crossed by a mass to z=%.1f (%.1f x %.1f)'
                               % (d, az + adz, bz + bdz, ox_, oy_))
                break

ok('NO SLAB TUNNELS THROUGH A BUILDING: a canopy, a deck or a shade projects OFF a mass '
   'and reaches over open ground — it never crosses one at mid-height, which at icon size '
   'reads as a rendering error%s'
   % (('  -- ' + '; '.join(tunnels[:6])) if tunnels else ''), not tunnels)

# ------------------------------------------------- 4. THE GRID IS ON THE PIXEL GRID
# The window grid used FIXED fractions (a mullion was 13% of a pane, whatever a pane
# measured), so pane widths and mullion widths landed on fractions of a final pixel and
# every window wall came out RAGGED. _snap_grid measures the face and returns a whole-pixel
# pitch. Checked here on the numbers, because the raggedness is arithmetic, not opinion.
for span, count in ((41.0, 8), (70.0, 4), (134.0, 6), (23.0, 9), (200.0, 12)):
    n, mfrac, used = ISO._snap_grid(span, count)
    pitch = span * used / n
    ok('a %.0fpx span asked for %d cells snaps to %d cells of EXACTLY %.0f px with a '
       '%.0f px line — no fractional pane, no fractional mullion'
       % (span, count, n, pitch, mfrac * pitch),
       abs(pitch - round(pitch)) < 0.02 and abs(mfrac * pitch - 1.0) < 0.02)

LAW = 'laws/BOHEMIA_ADDENDUM_ROUND_ROOFS_AND_DOORS_8_2_26.md'
ok('the law is filed with his words in it', os.path.exists(LAW)
   and 'looks like tarps' in open(LAW, encoding='utf8').read())

print('ROUND AND DOORS GATE: %d passed, %d failed  (%d doors on %d heroes)'
      % (PASS, FAIL, checked, len(F.HEROES)))
sys.exit(1 if FAIL else 0)
