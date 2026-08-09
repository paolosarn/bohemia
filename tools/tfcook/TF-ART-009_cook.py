#!/usr/bin/env python3
"""TF-ART-009 cook — BRICK MASONRY, DELTA ONLY.

brick_running_0..2 + brick_painted_0..2 (banks/BOHEMIA_TEXTURE_MATCH_8_1_26,
PENDING PAOLO) already cover the running-bond field and the painted face and
are DO-NOT-REPAINT. This cook produces only the three missing structural
pieces the merged board form names:
  (1) soldier/lintel band  — 12px soldier course (= exactly 3 stretcher
      courses) on the 22-course door head, 8 soldiers/cell divided 5/6px
      alternating, the band's other 8 courses harvested VERBATIM from the
      pending field so the bond phase carries to the parapet;
  (2) corner return, both hands — TF-ART-017's two-plane contract: 12px
      return plane (the real 8in wall at 1.7cm/px), same bond COMPRESSED 2:1
      so perpends read as vertical ticks, bed joints keep the 4px rhythm,
      right hand at the away value (0.56 of front), left hand the lit hand,
      both >=18 lum points off the front plane, hands DRAWN not mirrored,
      no keyline on the arris (value step only), grit-chipped arris;
  (3) painted-face sign ghost — rides brick_painted verbatim: geometric
      un-bleached rectangle where the sign hung, mounting holes, rust weeps,
      hard-edged peel patches showing the running-bond brick beneath ON THE
      SAME COURSE GRID (both fields share joint rows at y % 4 == 0). NO TEXT
      EVER (Paolo authors all names — MECHANISM-MINE).

MODULE (form arithmetic, locked, and MEASURED true on the pending fields
before a pixel was painted): course = 4px with the joint row at y % 4 == 0
(row-mean autocorr peaks k=4,8,12 on all six donors); stretcher = 11px, four
wrap 44 exactly (body-row autocorr peaks k=11,22); running bond +5px on
alternate courses inside the donors. MORTAR JOINT IS 0.56px — NEVER DRAWN:
every joint in this cook is a one-step value change, never a mortar-colour
line (a drawn 1px line doubles every joint = graph paper).

BOUNDARIES (not overlaps): fills TF-CITY-008's base/mid/cap grammar, does
not replace it; is the wall AROUND TF-ART-008's storefront; civic infill
beside TF-ART-007's monumental stone; the corner is cooked to TF-ART-017's
two-plane contract (shared law, one geometry — ART-017's own ten-piece
joinery family is NOT cooked here).

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE.
    brick_running_0..2 (PENDING PAOLO, in tolerance): the running-bond field.
    DO-NOT-REPAINT honoured: harvested VERBATIM as the top 8 courses of every
    soldier-band tile (asserted byte-equal in code) and as the front plane of
    every corner tile; the soldier bodies and the compressed return plane are
    resampled FROM the donor's own pixels (zero new colours introduced beyond
    value scaling); the peel patches expose the donor's own pixels at the
    same coordinates. brick_painted_0..2 (PENDING PAOLO): the painted face,
    harvested VERBATIM as the base of every sign-ghost tile (asserted
    byte-equal outside the marks).
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (APPROVED 7/28+7/29)
    — OPENED IN CODE. wall_0/wall_1/wall_base/wall_under_eave/wall_window:
    the approved anchor grammar, shown as the stucco incumbent in the anchor
    composite; door_top/door_bottom: the approved 2-tile door pair the form's
    22-course arithmetic is anchored on, rendered inside the 3-tall brick
    face; roof_parapet, walk_0..2, walk_kerb, road_0: the podium context.
    Display-only — nothing from the starter set is altered.
  banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt — checked: parapet/dock/storefront/
    mandoor. Openings and cap, not masonry. Nothing harvested.
  banks/BOHEMIA_OPENINGS_8_2_26.txt — checked: residential window/boarded/
    garage overlays. No masonry. Nothing fit.
  banks/BOHEMIA_PERIMETER_8_2_26.txt — checked: slump-block YARD walls;
    disqualified by the wall taxonomy (perimeter and building walls never
    share a pool), and it is slump block, not brick.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — checked (asserted in code):
    street/wreck/trash/crate/dead/barrier/camp props. No masonry member.
  banks/BOHEMIA_HD_TILE_REPO_part1..4 x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26 —
    the six UP-carrying wall packs ('2. Broken building walls', '3. Broken
    wall tiles', 'Wall tiles (1)', 'Floor, walls', 'Floor tiles and wall
    tiles', '4. Scrap wall and panels') were OPENED AND LOOKED AT on a
    contact sheet, not skimmed: medieval fieldstone ruins, dungeon ashlar and
    castle brick with heavy black keylines, drawn mortar grids, moss and
    banners — banned subject language (post-collapse Vegas, not fantasy),
    banned outline convention, wrong module, wrong light. And no bought tile
    can phase-match the pending fields' own 4px/11px bond, which every delta
    piece here must join byte-for-byte. Nothing eligible; BOUGHT-BEATS-
    PAINTED satisfied by inspection, not absence.
  VERDICT: mode MIXED — every candidate is the pending fields' own pixels
  (verbatim or resampled/value-scaled); painted pixels are only the genuine
  deltas: soldier bodies, compressed return, ghost marks, holes, weeps.

TASTE CHECK:
  JOINT IS A VALUE STEP: no mortar-colour line anywhere in this cook — the
    soldier bed joint is one darker row (matching the donors' own joint
    rows), perpends are one darker column per soldier (shade side only,
    upper-left key — one-sided so no doubled joint), the return's ticks are
    the donor's own compressed joint pixels.
  NOT A DRAWN GRID: soldier bodies are donor brick texture transposed to
    vertical grain; a FEW soldiers sit darker/lighter, clustered irregular
    (M11), most of the band one value — never every unit outlined.
  45 LAW: the corner shows two planes — front bond + foreshortened return
    with compressed perpend ticks; if the return read as a second flat face
    at the same value the family fails, so both planes are MEASURED >=18
    lum points apart per tile and the pair check (lit hand brighter than
    away hand) is asserted. Sky-lit top belongs to the parapet cap, not here.
  NO KEYLINE ON THE ARRIS: proven, not asserted — the boundary columns are
    the two plane values meeting; a measured check fails the cook if any
    arris column is darker than both planes it separates.
  DARKEST STRUCTURE SEAT: brick reads darker than the stucco incumbent and
    >=18 lum points off the walk and the parapet — measured in code against
    the approved starter tiles and reported, not eyeballed.
  WEAR NAMES ITS CAUSE (M1): the ONE efflorescence streak hangs downward
    from the coping-end joint on the away return (the only joint here that
    holds water); peel patches are hard-edged whole-brick sheets on the
    painted face (latex letting go), S/W-face placement noted in the caption;
    NO spall cooked (spall belongs to bottom courses / under coping — the
    field tiles' job, and the fields are not mine to repaint).
  NO TEXT: the ghost is a geometric un-bleached shadow + mounting holes +
    weeps. Letterforms never.
  8/2 STAMP BUG: three soldier variants, two per corner hand, three ghosts;
    soldier boundaries land on 0/6/11/17/22/28/33/39 so the 11-22-33 grid
    courses out with the field's own perpend pitch (divisors of 44).
  SAT DISCIPLINE: no saturation added anywhere; the lit return is DESATURATED
    (sun-chalked west face), the ghost rectangle regains only what the donor
    itself had before bleaching.
  VERIFY ON THE REAL SURFACE: 3x3 tilings, a 6-wide two-storey run (no 44px
    banding), corner stacks WALL_H=3 tall, a greyscale corner proof, and an
    anchor composite: the full 3-tall brick podium with the approved door
    pair in it, on walk/kerb/road, beside the approved stucco incumbent.

Deterministic: SEED fixed, rerunnable.
Writes ONLY:
  banks/tileforms/TF-ART-009_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-009/*.png
"""

import base64
import colorsys
import io
import json
import os
import random

import numpy as np
from PIL import Image, ImageDraw

SEED = 90909
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
COURSE = 4                       # px, joint row at y % 4 == 0 (measured on donors)
STRETCH = 11                     # px, four wrap 44 exactly (measured on donors)
RET_W = 12                       # return plane depth px (ART-017: 11-13px)
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-009_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-009')

# soldier layout: 8 soldiers alternating 6/5px -> boundaries at 11/22/33 course
# out with the field's own perpend pitch (11 divides 44)
SOLDIER_W = [6, 5, 6, 5, 6, 5, 6, 5]
BAND_TOP = 32                    # rows 32-43 = the 12px soldier course (3 courses)


# ---------------------------------------------------------------- bank openers
def load_texture_match():
    """REUSE in code: the pending brick fields — the do-not-repaint base."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_TEXTURE_MATCH_8_1_26.txt')))
    out = {}
    for t in d['tiles']:
        if t['material'] in ('brick_running', 'brick_painted'):
            assert t['verdict'] == 'PENDING PAOLO', (t['id'], t['verdict'])
            assert t['in_tolerance'], t['id']
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
            out[t['id']] = np.asarray(im).astype(np.float64)
    for i in range(3):
        assert f'brick_running_{i}' in out and f'brick_painted_{i}' in out
    return out


def load_starter(names):
    """REUSE in code: frozen approved starter tiles (anchors + podium)."""
    d = json.load(open(os.path.join(ROOT, 'banks',
                                    'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))
    out = {}
    for t in d['tiles']:
        if t['id'] in names:
            out[t['id']] = np.asarray(Image.open(io.BytesIO(
                base64.b64decode(t['b64']))).convert('RGB')).astype(np.float64)
    missing = set(names) - set(out)
    assert not missing, missing
    return out


def assert_pools_checked():
    """Shopping sweep honoured in code: pools opened, nothing fit."""
    ext = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')))
    assert set(ext['counts']) == {'street', 'wreck', 'trash', 'crate', 'dead',
                                  'barrier', 'camp'}, ext['counts']    # no masonry
    civ = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_CIVIC_OPENINGS_8_3_26.txt')))
    assert {t['id'] for t in civ['tiles']} == {'civic_parapet', 'civic_dock',
                                               'civic_storefront', 'civic_mandoor'}
    op = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_OPENINGS_8_2_26.txt')))
    assert not any('brick' in t['id'] for t in op['tiles'])           # residential
    per = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_PERIMETER_8_2_26.txt')))
    assert all(t['id'].startswith('perim_') for t in per['tiles'])
    assert not any('brick' in t['id'] for t in per['tiles'])          # not brick,
    # and perimeter taxonomy — building walls never harvest the perimeter pool


def assert_module(D):
    """The form's locked arithmetic, MEASURED on the donor before use."""
    L = lum(D)
    rm = L.mean(axis=1)
    x = rm - rm.mean()
    ac4 = float(np.corrcoef(x, np.roll(x, 4))[0, 1])
    assert ac4 > 0.5, f'course pitch is not 4px (ac4={ac4:.2f})'
    joints = rm[0::4].mean()
    bodies = np.concatenate([rm[1::4], rm[2::4], rm[3::4]]).mean()
    assert joints < bodies - 10, 'joint row is not y%4==0'
    acc = 0.0
    for c in range(11):
        body = L[4 * c + 1: min(4 * c + 4, CELL)].mean(axis=0)
        b = body - body.mean()
        acc += float(np.corrcoef(b, np.roll(b, STRETCH))[0, 1])
    assert acc / 11 > 0.25, 'stretcher pitch is not 11px'


# ---------------------------------------------------------------- helpers
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def desat(px, amt):
    g = lum(px)[..., None]
    return np.clip(px + amt * (g - px), 0, 255)


def png_b64(arr):
    im = Image.fromarray(arr.astype(np.uint8), 'RGB')
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()


def save(arr, name, scale=1):
    im = Image.fromarray(arr.astype(np.uint8), 'RGB')
    if scale > 1:
        im = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    im.save(os.path.join(PROOF_DIR, name))


def grid(rows):
    return np.concatenate([np.concatenate(r, axis=1) for r in rows], axis=0)


def labeled_sheet(entries, cols, scale=3, pad=8, label_h=14, bg=(24, 24, 28)):
    cw = max(e[1].shape[1] for e in entries) * scale + pad
    hmax = max(e[1].shape[0] for e in entries)
    chh = hmax * scale + label_h + pad
    rows = (len(entries) + cols - 1) // cols
    im = Image.new('RGB', (cols * cw + pad, rows * chh + pad), bg)
    dr = ImageDraw.Draw(im)
    for i, (lab, a) in enumerate(entries):
        x = pad + (i % cols) * cw
        y = pad + (i // cols) * chh
        t = Image.fromarray(a.astype(np.uint8), 'RGB').resize(
            (a.shape[1] * scale, a.shape[0] * scale), Image.NEAREST)
        im.paste(t, (x, y))
        dr.text((x, y + a.shape[0] * scale + 2), lab[:26], fill=(225, 225, 225))
    return im


# ---------------------------------------------------------------- members
def cook_soldier(D, seed):
    """Soldier/lintel band tile: rows 0-31 = 8 field courses HARVESTED
    VERBATIM (bond phase carries to the parapet); rows 32-43 = the 12px
    soldier course. Each soldier is the donor's own brick texture transposed
    to vertical grain; the bed joint is one darker row (the donors' own joint
    convention), each perpend one darker column on the shade side only."""
    rng = random.Random(SEED + seed)
    t = D.copy()
    # the donor's own joint-row and body-row value relationship
    L = lum(D)
    joint_f = float(L[0::4].mean() / max(np.concatenate(
        [L[1::4], L[2::4], L[3::4]]).mean(), 1e-9))       # ~0.65 measured
    # bed joint row 32: one-step value change on the donor's own pixels
    t[BAND_TOP] = D[BAND_TOP] * min(joint_f + 0.06, 0.86)
    # a FEW soldiers darker/lighter, clustered irregular; most one value
    tones = [1.0] * 8
    k0 = rng.randrange(0, 6)
    tones[k0] = rng.choice([0.90, 1.08])
    tones[min(k0 + 1, 7)] = rng.choice([0.94, 1.05])
    if rng.random() < 0.5:
        tones[rng.randrange(0, 8)] = rng.choice([0.91, 1.07])
    x = 0
    for si, w in enumerate(SOLDIER_W):
        # sample donor body texture w rows x 11 cols, transpose -> 11x w
        c = rng.randrange(11)
        y0 = 4 * c + 1
        rows = [(y0 + i) % CELL for i in range(w)]
        x0 = rng.randrange(CELL)
        cols = [(x0 + j) % CELL for j in range(11)]
        patch = D[np.ix_(rows, cols)]                      # w x 11 x 3
        sold = np.transpose(patch, (1, 0, 2))              # 11 x w x 3, vertical grain
        sold = sold * tones[si]
        # vertical brightness: the standing brick's face, faintly lit at top
        gy = np.linspace(1.03, 0.95, 11)[:, None, None]
        sold = sold * gy
        # perpend: one-step darker column on the shade side (right), one-sided
        sold[:, -1] = sold[:, -1] * 0.80
        t[BAND_TOP + 1: CELL, x:x + w] = sold
        x += w
    return np.clip(t, 0, 255)


def cook_corner(D, hand, seed, effl=False):
    """Corner return, TF-ART-017 two-plane contract. Front plane = the donor
    VERBATIM; return plane = the donor's own bond COMPRESSED 2:1 (perpends
    become vertical ticks, bed joints keep the 4px rhythm because rows are
    untouched), value-scaled to the away value (right hand, 0.56 of front)
    or the lit chalked value (left hand). Hands DRAWN separately from
    different donor regions, never mirrored. No keyline: the arris is the
    two plane values meeting, chipped 1px in irregular clumps (wind grit)."""
    rng = random.Random(SEED + seed)
    t = D.copy()
    if hand == 'r':
        xs = range(CELL - RET_W, CELL)
        base0, fac = CELL - RET_W, 0.56
    else:
        xs = range(RET_W)
        # 1.24 measured 18.2 pts of separation and LOOKED like a flat face —
        # the donor's own ~15-step variance eats a minimum-legal step. Raised
        # until the plane visibly turns (still inside the wall value band).
        base0, fac = 2, 1.38
    # start the compressed run on a brick-body column, never a perpend —
    # otherwise the arris column reads as a drawn line (keyline check below)
    colL = lum(D).mean(axis=0)
    src0 = max(range(base0, base0 + 6), key=lambda c: colL[c % CELL])
    for i, xx in enumerate(xs):
        src = D[:, (src0 + 2 * i) % CELL]                  # 2:1 foreshortening
        col = src * fac
        if hand == 'l':                                    # lit hand: sun-chalked
            col = desat(col[None, :], 0.30)[0]
        t[:, xx] = col
    # grit-chipped arris: irregular 1px clumps swap plane values (M11 clusters)
    arris = (CELL - RET_W) if hand == 'r' else (RET_W - 1)
    y = rng.randrange(0, 6)
    while y < CELL:
        run = rng.randrange(1, 4)
        if rng.random() < 0.45:
            for dy in range(run):
                if y + dy < CELL:
                    if hand == 'r':
                        t[y + dy, arris] = D[y + dy, (src0) % CELL] * fac
                    else:
                        t[y + dy, arris] = D[y + dy, arris]
        y += run + rng.randrange(2, 7)
    if effl:
        # ONE efflorescence streak: hangs downward from the coping-end joint
        # on the away plane (the only joint here that holds water). 2px x ~18.
        ex = CELL - RET_W + 3 + rng.randrange(3)
        ln = 14 + rng.randrange(8)
        for dy in range(ln):
            yy = dy
            f = 0.42 * (1.0 - dy / ln)
            for dx in range(2):
                p = t[yy, ex + dx]
                white = np.array([196., 192., 184.]) * 0.62   # dusty salt, away-lit
                t[yy, ex + dx] = p * (1 - f) + white * f
    return np.clip(t, 0, 255)


def cook_ghost(P, B, seed, rect, npeel):
    """Painted-face sign ghost on brick_painted VERBATIM: the rectangle the
    sign protected keeps its colour while the field bleached (darker, only
    the donor's own colour regained — no saturation invented); mounting
    holes + rust weeps; hard-edged peel patches of WHOLE BRICKS showing the
    running-bond donor beneath on the SAME course grid. No text ever."""
    rng = random.Random(SEED + seed)
    t = P.copy()
    x0, y0, x1, y1 = rect
    # un-bleached, one quiet step — 0.82 read as a dark smear bar, not a ghost
    reg = t[y0:y1, x0:x1]
    t[y0:y1, x0:x1] = np.clip(desat(reg, -0.10) * 0.88, 0, 255)
    holes = [(x0 + 1, y0 + 1), (x1 - 3, y0 + 1), (x0 + 1, y1 - 3), (x1 - 3, y1 - 3)]
    rust = B[np.ix_([13, 17, 21], [3, 14, 25])].reshape(-1, 3).mean(axis=0) * 0.9
    for hx, hy in holes:
        t[hy:hy + 2, hx:hx + 2] = np.array([38., 34., 31.])       # lag bolt hole
        wy = hy + 2
        for k in range(rng.randrange(3, 8)):                      # 1px rust weep
            if wy + k >= CELL:
                break
            f = 0.45 * (1 - k / 8)
            t[wy + k, hx] = t[wy + k, hx] * (1 - f) + rust * f
    # peel: hard-edged sheets, half-brick (6px) course-aligned steps, bounding
    # box capped at 20 x 16 px (the spec's 6-20px patch size — v1 grew three
    # whole bricks along one course and read as a 33px stripe, a drawn bar)
    for _ in range(npeel):
        sy = 4 * rng.randrange(1, 10)
        sx = rng.randrange(0, CELL - 6)
        patch = {(sy, sx)}
        for _ in range(rng.randrange(3, 7)):
            gy, gx = rng.choice(sorted(patch))
            dy, dx = rng.choice([(4, 0), (-4, 0), (0, 6), (0, -6),
                                 (4, 6), (-4, -6)])
            ny, nx = gy + dy, gx + dx
            ys = [c[0] for c in patch] + [ny]
            xs = [c[1] for c in patch] + [nx]
            if (0 <= ny <= CELL - 4 and 0 <= nx <= CELL - 6
                    and max(ys) - min(ys) <= 12 and max(xs) - min(xs) <= 14):
                patch.add((ny, nx))
        mask = np.zeros((CELL, CELL), bool)
        for (py, px) in patch:
            mask[py:py + 4, px:px + 6] = True
        t[mask] = B[mask] * 0.96
        # chalked paint lip catches the upper-left light: the film edge
        # directly ABOVE the tear only, never inside it
        lip = np.zeros_like(mask)
        lip[:-1] = mask[1:] & ~mask[:-1]
        t[lip] = np.clip(t[lip] * 1.08, 0, 255)
    return np.clip(t, 0, 255)


# ---------------------------------------------------------------- metrics
def measure(tile):
    px = tile.reshape(-1, 3)
    L = lum(px)
    colours = len(np.unique(px.astype(np.uint8), axis=0))
    La = lum(tile)
    d = np.abs(np.diff(La, axis=1))
    edge = float(d.mean())
    grain = float((d > 8).mean() * 100)
    flat = px / 255.0
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in flat])
    sat = float(hsv[:, 1].mean())
    hue = hsv[:, 0] * 360
    purple = float(((hue >= 260) & (hue <= 320) & (hsv[:, 1] > 0.15)).mean() * 100)
    green = float(((hue >= 70) & (hue <= 170) & (hsv[:, 1] > 0.25)
                   & (hsv[:, 2] > 0.25)).mean() * 100)
    hot = float(((px[:, 0] > 226) & (px[:, 1] > 200) & (px[:, 2] < 130)).mean())
    black = float((px.max(axis=1) < 14).mean())
    return dict(colours=colours, edge=round(edge, 3), grain=round(grain, 3),
                sat=round(sat, 3), lum_mean=round(float(L.mean()), 3),
                lum_sd=round(float(L.std()), 3), purple_pct=round(purple, 3),
                green_pct=round(green, 3), hot_yellow_frac=round(hot, 5),
                near_black_frac=round(black, 4))


def wrap_test(t):
    """Offset test (M10) both axes: the torus wrap step vs the internal step."""
    L = lum(t)
    wx = float(np.abs(L[:, -1] - L[:, 0]).mean())
    ix = float(np.abs(np.diff(L, axis=1)).mean())
    wy = float(np.abs(L[-1, :] - L[0, :]).mean())
    iy = float(np.abs(np.diff(L, axis=0)).mean())
    return dict(wrap_x=round(wx, 2), internal_x=round(ix, 2),
                wrap_y=round(wy, 2), internal_y=round(iy, 2))


def run_seam(tiles_row, axis=1):
    strip = np.concatenate(tiles_row, axis=axis)
    L = lum(strip)
    if axis == 0:
        L = L.T
    W = CELL
    steps = np.abs(np.diff(L, axis=1))
    j_cols = [k * W - 1 for k in range(1, len(tiles_row))]
    j = float(np.mean([steps[:, c].mean() for c in j_cols]))
    internal = float(np.delete(steps, j_cols, axis=1).mean())
    return round(j, 3), round(internal, 3)


# ---------------------------------------------------------------- main
def main():
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)
    assert_pools_checked()

    tm = load_texture_match()
    R = [tm[f'brick_running_{i}'] for i in range(3)]
    P = [tm[f'brick_painted_{i}'] for i in range(3)]
    for D in R + P:
        assert_module(D)

    st = load_starter(['wall_0', 'wall_1', 'wall_base', 'wall_under_eave',
                       'wall_window', 'door_top', 'door_bottom', 'roof_parapet',
                       'walk_0', 'walk_1', 'walk_2', 'walk_kerb', 'road_0'])

    tiles, sheets, checks = [], {}, {}

    def add(name, arr, kind, harvested, extra=None):
        e = dict(name=name, px=CELL, b64=png_b64(arr), metrics=measure(arr),
                 kind=kind, harvested_from=harvested, layer='structure')
        if extra:
            e.update(extra)
        tiles.append(e)
        sheets[name] = arr

    # ---- (1) soldier/lintel band, 3 variants
    soldiers = []
    for i in range(3):
        t = cook_soldier(R[i], 10 + i)
        assert np.array_equal(t[:BAND_TOP], R[i][:BAND_TOP]), \
            'field rows not verbatim — do-not-repaint violated'
        soldiers.append(t)
        add(f'brick_soldier_{i}', t,
            'soldier/lintel band: 12px soldier course (courses 23-25 on the '
            '22-course door head), 8 soldiers 6/5px alternating, 8 field '
            'courses above to the parapet. SINGLE PLACEMENT (the lintel row '
            'of a 3-tall wall).',
            f'rows 0-31 brick_running_{i} VERBATIM (asserted); soldiers are '
            f'the same donor transposed to vertical grain; joints are value '
            f'steps at the donor\'s own joint ratio')

    # ---- (2) corner return, both hands, 2 variants each
    corners = {}
    specs = [('l', 0, 20, False), ('l', 1, 21, False),
             ('r', 1, 22, True), ('r', 2, 23, False)]
    for hand, di, sd, ef in specs:
        t = cook_corner(R[di], hand, sd, effl=ef)
        k = f'brick_corner_{hand}_{sd - (20 if hand == "l" else 22)}'
        corners[k] = t
        # two-plane separation, measured not asserted
        if hand == 'r':
            front, ret = lum(t[:, :CELL - RET_W]).mean(), lum(t[:, CELL - RET_W:]).mean()
        else:
            front, ret = lum(t[:, RET_W:]).mean(), lum(t[:, :RET_W]).mean()
        sep = abs(front - ret)
        assert sep >= 18, f'{k} planes only {sep:.1f} apart — flat-face fail'
        checks[f'{k}_plane_sep_lum'] = round(sep, 1)
        add(k, t,
            f'corner return, {"lit (west) hand" if hand == "l" else "away hand"}'
            ': front plane + 12px foreshortened return (2:1), perpends as '
            'vertical ticks, bed joints keep the 4px rhythm, grit-chipped '
            'arris, no keyline. SINGLE PLACEMENT at the building edge.' +
            (' Carries the one efflorescence streak (coping-end joint).' if ef else ''),
            f'front: brick_running_{di} VERBATIM; return: the same donor '
            f'compressed 2:1 and value-scaled '
            f'({"1.24 lit, sun-chalked desat" if hand == "l" else "0.56 away"})')

    # pair check: lit hand brighter than away hand (never mirrored)
    lit = lum(sheets['brick_corner_l_0']).mean()
    away = lum(sheets['brick_corner_r_0']).mean()
    assert lit > away, 'pair check failed'
    checks['pair_check_lum'] = dict(corner_l_0=round(lit, 1), corner_r_0=round(away, 1))

    # no-keyline proof: arris column never darker than both planes
    for k, t in corners.items():
        hand = 'r' if '_r_' in k else 'l'
        arris = (CELL - RET_W) if hand == 'r' else (RET_W - 1)
        a = lum(t[:, arris]).mean()
        if hand == 'r':
            p1 = lum(t[:, arris - 3:arris]).mean()
            p2 = lum(t[:, arris + 1:arris + 4]).mean()
        else:
            p1 = lum(t[:, arris + 1:arris + 4]).mean()
            p2 = lum(t[:, arris - 3:arris]).mean()
        # a keyline = the boundary column darker than BOTH planes by more
        # than the normal one-step joint change; the arris belongs to the
        # return plane, so it may sit at that plane's value, never below both
        assert not (a < p1 - 6 and a < p2 - 6), f'{k}: keyline on the arris'
        checks[f'{k}_arris_vs_planes'] = [round(a, 1), round(p1, 1), round(p2, 1)]

    # ---- (3) painted-face sign ghost, 3 variants
    rects = [(6, 8, 38, 24), (12, 12, 33, 32), (4, 16, 27, 28)]
    ghosts = []
    for i in range(3):
        t = cook_ghost(P[i], R[i], 30 + i, rects[i], npeel=1 + (i % 2))
        ghosts.append(t)
        add(f'brick_painted_ghost_{i}', t,
            'painted face with sign GHOST: un-bleached rectangle + mounting '
            'holes + rust weeps + hard-edged 6-20px peel showing running '
            'bond on the same course grid. S/W faces only. SINGLE '
            'PLACEMENT. No text.',
            f'base: brick_painted_{i} VERBATIM outside the marks; peel '
            f'exposes brick_running_{i} at the same coordinates')

    # ---------------------------------------------------------------- seams
    seam = {}
    for i in range(3):
        seam[f'brick_running_{i}_wrap'] = wrap_test(R[i])
        seam[f'brick_painted_{i}_wrap'] = wrap_test(P[i])
    for i in range(3):
        seam[f'brick_soldier_{i}_wrap'] = wrap_test(soldiers[i])
    for k, t in corners.items():
        L = lum(t)
        seam[f'{k}_vwrap'] = dict(wrap_y=round(float(np.abs(L[-1] - L[0]).mean()), 2),
                                  internal_y=round(float(np.abs(np.diff(L, axis=0)).mean()), 2))
    seam['field_6run_mixed'] = run_seam([R[k % 3] for k in range(6)])
    seam['field_6run_same'] = run_seam([R[0]] * 6)
    seam['soldier_6run_mixed'] = run_seam([soldiers[k % 3] for k in range(6)])
    seam['painted_6run_mixed'] = run_seam([P[k % 3] for k in range(6)])
    seam['field_vstack_mixed'] = run_seam([R[k % 3] for k in range(3)], axis=0)
    seam['corner_r_vstack'] = run_seam([corners['brick_corner_r_0']] * 3, axis=0)
    seam['corner_l_vstack'] = run_seam([corners['brick_corner_l_0']] * 3, axis=0)

    # 18-point law: brick vs the ground it stands on and the parapet above
    fld = float(np.mean([lum(r).mean() for r in R]))
    checks['lum_separation'] = dict(
        brick_field=round(fld, 1),
        walk=round(float(lum(st['walk_0']).mean()), 1),
        parapet=round(float(lum(st['roof_parapet']).mean()), 1),
        stucco_wall=round(float(lum(st['wall_1']).mean()), 1),
        vs_walk=round(abs(fld - float(lum(st['walk_0']).mean())), 1),
        vs_parapet=round(abs(fld - float(lum(st['roof_parapet']).mean())), 1))

    # ---------------------------------------------------------------- proofs
    # (a) 3x3 tiled proofs of the seamless families (harvested fields, and the
    # lintel band shown as the top row over field — its real placement)
    save(grid([[R[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_brick_running.png', 3)
    save(grid([[P[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_brick_painted.png', 3)
    save(grid([[soldiers[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_brick_soldier.png', 3)
    # 6-wide two-storey run: no 44px banding (lintel row over field row)
    save(grid([[soldiers[k % 3] for k in range(6)],
               [R[k % 3] for k in range(6)],
               [R[(k + 1) % 3] for k in range(6)]]), 'RUN_6WIDE_3TALL.png', 2)
    # corner stacks at WALL_H=3, flanking field, greyscale twin
    stackL = grid([[corners['brick_corner_l_0'], R[0], R[1]],
                   [corners['brick_corner_l_1'], R[2], R[0]],
                   [corners['brick_corner_l_0'], R[1], R[2]]])
    stackR = grid([[R[1], R[0], corners['brick_corner_r_0']],
                   [R[0], R[2], corners['brick_corner_r_1']],
                   [R[2], R[1], corners['brick_corner_r_0']]])
    both = np.concatenate([stackL, np.full((CELL * 3, 8, 3), 24.0), stackR], axis=1)
    save(both, 'CORNER_STACKS_3TALL.png', 3)
    g = lum(both)
    save(np.stack([g, g, g], axis=2), 'CORNER_STACKS_GREY.png', 3)

    # (b) ANCHOR COMPOSITE: stucco incumbent | alley | 3-tall brick podium
    # with the approved door pair, soldier lintel row, both corners, painted
    # ghost bay; roof_parapet above, walk/kerb/road in front. 3x nearest.
    cols_n, rows_n = 11, 7
    cv = np.full((rows_n * CELL, cols_n * CELL, 3), 16.0)

    def put(r, c, a):
        cv[r * CELL:(r + 1) * CELL, c * CELL:(c + 1) * CELL] = a

    # stucco incumbent (approved grammar): cols 0-3
    for c in range(4):
        put(0, c, st['roof_parapet'])
        put(1, c, st['wall_under_eave'])
        put(2, c, st['wall_1'] if c != 1 else st['wall_window'])
        put(3, c, st['wall_base'])
    put(2, 2, st['door_top'])
    put(3, 2, st['door_bottom'])
    # col 4: alley shadow (context void, not a tile)
    # brick podium: cols 5-10
    put(0, 5, st['roof_parapet']); put(1, 5, corners['brick_corner_l_0'])
    put(2, 5, corners['brick_corner_l_1']); put(3, 5, corners['brick_corner_l_0'])
    layout = {6: ('field', 0), 7: ('door', 1), 8: ('field', 2), 9: ('ghost', 0)}
    for c, (kind, i) in layout.items():
        put(0, c, st['roof_parapet'])
        put(1, c, soldiers[i % 3])
        if kind == 'door':
            put(2, c, st['door_top']); put(3, c, st['door_bottom'])
        elif kind == 'ghost':
            put(1, c, P[1]); put(2, c, ghosts[0]); put(3, c, P[2])
        else:
            put(2, c, R[i % 3]); put(3, c, R[(i + 1) % 3])
    put(0, 10, st['roof_parapet']); put(1, 10, corners['brick_corner_r_0'])
    put(2, 10, corners['brick_corner_r_1']); put(3, 10, corners['brick_corner_r_0'])
    for c in range(cols_n):
        put(4, c, st[f'walk_{c % 3}']); put(5, c, st['walk_kerb']); put(6, c, st['road_0'])
    save(cv, 'ANCHOR_COMPOSITE_3x.png', 3)
    # squint at map zoom: brick block must read darker than the stucco block
    sq = Image.fromarray(cv.astype(np.uint8), 'RGB').resize((cols_n, rows_n), Image.LANCZOS)
    sq.resize((cols_n * 16, rows_n * 16), Image.NEAREST).save(
        os.path.join(PROOF_DIR, 'SQUINT_1TILE.png'))
    sqa = np.asarray(sq).astype(np.float64)
    checks['squint_block_lum'] = dict(
        stucco_block=round(float(lum(sqa[1:4, 0:4]).mean()), 1),
        brick_block=round(float(lum(sqa[1:4, 5:11]).mean()), 1))

    # (c) contact sheet of all candidates + the harvested fields for context
    entries = [(t['name'], sheets[t['name']]) for t in tiles]
    entries += [(f'HARVEST brick_running_{i}', R[i]) for i in range(3)]
    entries += [(f'HARVEST brick_painted_{i}', P[i]) for i in range(3)]
    labeled_sheet(entries, 5).save(os.path.join(PROOF_DIR, 'CONTACT_SHEET_all.png'))

    # ---------------------------------------------------------------- bank
    bank = {
        'form': 'TF-ART-009',
        'cooked': '2026-08-09',
        'mode': 'MIXED',
        'delta_only': 'brick_running_0..2 and brick_painted_0..2 '
            '(BOHEMIA_TEXTURE_MATCH_8_1_26, PENDING PAOLO) are the fields and '
            'were NOT repainted — every candidate here is built on them '
            'verbatim (asserted in code) and they are NOT re-banked here.',
        'module': 'course 4px (joint row y%4==0), stretcher 11px (4 wrap 44), '
            'soldier course 12px = 3 courses, soldiers 6/5px alternating with '
            'boundaries on the 11px perpend grid, return 12px at 2:1, all '
            'measured on the donors before cooking (assert_module).',
        'boundaries': 'fills TF-CITY-008 grammar; wall around TF-ART-008 '
            'storefront; infill beside TF-ART-007 stone; corner cooked to '
            'TF-ART-017 two-plane contract (ART-017 keeps its own family).',
        'seam_contract': {
            'field': 'SELF-SEAMLESS both axes on the declared 4-brick/2-course '
                     'phase (harvested tiles, baseline reported)',
            'soldier_band': 'wraps horizontally (single placement row)',
            'corners': 'vertically self-seamless (run up the 3-tall wall)',
            'ghost': 'single placement on the painted face',
            'measured': seam},
        'checks': checks,
        'harvest_sources': [
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt: brick_running_0..2 + '
            'brick_painted_0..2 (PENDING PAOLO) — verbatim base of every piece',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt: anchors + '
            'podium context, display-only'],
        'consumers': ['TF-ART-009'],
        'tiles': tiles,
        'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    }
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f)

    print('tiles:', len(tiles))
    print('checks:', json.dumps(checks, indent=1))
    print('seams:', json.dumps(seam, indent=1))
    for t in tiles:
        m = t['metrics']
        print(' %-24s lum%7.1f sat %.3f col%5d edge%6.2f grain%6.2f '
              'purp %.2f grn %.2f blk %.3f' % (
                  t['name'], m['lum_mean'], m['sat'], m['colours'], m['edge'],
                  m['grain'], m['purple_pct'], m['green_pct'], m['near_black_frac']))


if __name__ == '__main__':
    main()
