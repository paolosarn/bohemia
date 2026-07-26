#!/usr/bin/env python3
"""
BOHEMIA TARGET SCREEN FACTORY (7/26/26) — the ART lane's first deliverable.

THE ASK (laws/BOHEMIA_ADDENDUM_ART_FIRST_RESET_7_26_26.md, LOCKED):
  "a new ART lane's first and only deliverable is 2-3 hand-assembled candidate
   TARGET SCREENS (fake screenshots) of the walkable street level at its best —
   real character, decorated street, 2-TILE DOORS, visible dressed interior,
   approved assets as the base + whatever coherent new tiles needed, composed
   like a poster. Paolo picks ONE."

This tool composes those screens. It is a POSTER factory, not a game renderer:
every pixel is placed by hand-authored composition, so the screens show the bar,
not the current engine. The winner becomes the visual constitution and
gates/target_screen_gate.py locks its measurable parts.

REUSE CHECK: (REUSE-FIRST, Paolo 7/22 + APPROVED-ASSETS-FIRST, Paolo 7/26.)
  Opened here and used as the base material of every screen -
  used BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (the 30/30 UP house-skin cook,
  records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt): every wall, roof, window,
  boarded panel, door leaf and yard. Nothing here paints a wall by hand.
  used BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt: every road, sidewalk, lane
  line, median, crosswalk, apron and desert lot surface.
  used BOHEMIA_STREET_PROP_POOLS_7_18_26.txt: car wrecks x20, fire barrels x12.
  used BOHEMIA_DESERT_POOLS_7_18_26.txt: ground, rock, rubble, boulder.
  used BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt: the BLESSED lamp bank, which is
  the 45-degree law's own reference sprite.
  used BOHEMIA_MOUNTED_SIGNS_7_13_26.txt: the hazard signs on their poles.
  used BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt: the 85/15 tan block wall.
  The CHARACTER is not drawn here at all: tools/bohemia_char_export.js drives the
  shipped alpha in a real browser and bakes the body through the game's own
  buildFrame()/frameToRGBA(). Read from records/target/char/.
  WHAT IS NEW, and why nothing approved could do it: (a) 2-TILE DOOR OPENINGS -
  the corpus only has wall_door_18..20, a whole door inside ONE 44px tile, and
  law 5 makes doors 2 tiles tall, so the opening is CUT from the approved leaf's
  own pixels and re-hung at 2 cells (approved material, new geometry);
  (b) BUILDING MASSING / SHADING / SHADOWS - there is no approved bank of
  standing street-level volumes (the district heroes were KILLED,
  records/BOHEMIA_DISTRICT_HERO_VERDICT_7_23_26.txt), so the masses are geometry
  only and every surface they expose is filled with an approved tile, per
  records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md.
  DELIBERATELY NOT OPENED: the raw cut corpus embedded in the CITY app. That is
  the PRE-VERDICT judging surface and sampling it put purple and neon in a dead
  house on 7/26. gates/target_screen_gate.py fails if this file reaches for it.

TASTE CHECK: this factory emits POSTERS for a pick-one verdict, not a candidate
bank, so there is no batch to pre-kill - but it is still held to the same
machine-checkable NEVERs out of laws/BOHEMIA_PAOLO_TASTE_CANON.md, and
gates/target_screen_gate.py enforces them directly on the rendered plates
instead of on a bank: never flat side-on (every mass carries a sky-lit top and
the roof is foreshortened), never a hard black outline (near-pure black is
capped and the three tones must order sky>front>away), never purple outside the
Amalgamation (the purity gate sweeps these PNGs like any other art), never a
warm night glow on act-1 windows, never a recolor posing as new work (the
candidates differ by PROJECTION, which is structure), and never verified
anywhere but the real surface (the BEFORE plate is a real screenshot of the
shipped run, and the judge page is driven in a real browser before it ships).
If this tool ever emits a candidate BANK, it must call
bohemia_taste_filter.prefilter() at the emit step like every other factory.

  python3 tools/bohemia_target_screen_factory.py
    -> records/target/BOHEMIA_TARGET_A_FRONTFACE.png
    -> records/target/BOHEMIA_TARGET_B_ISOBLOCK.png
    -> records/target/BOHEMIA_TARGET_C_CUTAWAY.png
    -> records/target/BOHEMIA_TARGET_SPEC.json   (the measurable canon)
    -> slices/BOHEMIA_TARGET_SCREEN_JUDGE_7_26_26.html
"""
import base64
import io
import json
import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUTDIR = 'records/target'
CHARDIR = os.path.join(OUTDIR, 'char')

# ---------------------------------------------------------------------------
# PROPORTION CANON (art-first reset law 5: "doors are 2 tiles tall; proportion
# canon gets its own gate"). Derived, not invented:
#   CELL_M = 0.75 m per ground cell (engine constant, bohemia_overmap.js)
#   human  = 1.75 m (tools/bohemia_scale_study.py, researched)
#   the shipped run already draws a body at CELL*2.15 sprite height
# A 56px bake carries 49px of body, so at CELL=38 a body stands 49px = 1.29
# cells; the body is drawn at BODY_K so it stands 1.55 cells and a 2-cell door
# opening (76px) is cleared to 77% by the head,
# which is what a 1.75 m person looks like in a 2.05 m doorway. Both numbers
# are asserted by gates/target_screen_gate.py.
# ---------------------------------------------------------------------------
CELL = 38                  # ground cell, art px
DOOR_CELLS = 2             # LAW: a door opening is 2 cells tall
BODY_PX = 49               # painted body height inside the 56px bake
BODY_K = 1.35              # so a body stands 66px = 1.74 cells against a 2-cell door
GRID_W, GRID_H = 11, 24    # the framed camera: 11 cells across (the run's own
                           # camera width), so the target is a shot the engine can hold
W, H = GRID_W * CELL, GRID_H * CELL     # 418 x 912 art px, iPhone portrait aspect
SCALE = 2                  # poster = 836 x 1824, integer scale law

BANK_HOUSE = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
BANK_STREET = 'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt'
BANK_PROPS = 'banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt'
BANK_DESERT = 'banks/BOHEMIA_DESERT_POOLS_7_18_26.txt'


def b64img(b):
    return Image.open(io.BytesIO(base64.b64decode(b))).convert('RGBA')


class Corpus:
    """Every approved pixel the screens are built out of. Opened, not claimed."""

    def __init__(self):
        hs = json.load(open(BANK_HOUSE))
        self.house = {}
        for t in hs['tiles']:
            self.house.setdefault(t['id'].rsplit('_', 1)[0], []).append(b64img(t['b64']))
        st = json.load(open(BANK_STREET))['pools']
        self.street = {k: [b64img(b) for b in v] for k, v in st.items()}
        pr = json.load(open(BANK_PROPS))
        self.prop = {k: [b64img(b) for b in pr[k]] for k in ('car_wreck', 'fire_barrel')}
        ds = json.load(open(BANK_DESERT))
        self.desert = {k: [b64img(b) for b in ds[k]] for k in ('ground', 'rock', 'rubble', 'boulder')}

    def pool(self, family):
        """family: 'house:roof_shingle' | 'street:side' | 'desert:rubble'."""
        kind, name = family.split(':')
        return getattr(self, kind)[name]


# ---------------------------------------------------------------------------
# surface fill — approved tiles laid down as MATERIAL, never a flat colour.
# ---------------------------------------------------------------------------
_TCACHE = {}


def cell_tile(pool, gx, gy, size, seed=0, vary=True, uniform=False):
    """One approved tile for one cell. VARY flips it per-cell so a big surface
    never checkerboards — the pools are family-harmonized (their edges match
    by construction), so a flip still meets its neighbour."""
    h = ((gx * 2246822519) ^ (gy * 3266489917) ^ (seed * 668265263)) & 0x7FFFFFFF
    i = ((seed * 2654435761) & 0x7FFFFFFF) % len(pool) if uniform else (h >> 7) % len(pool)
    fl = (h >> 3) & 3 if vary else 0
    key = (id(pool), i, size, fl)
    got = _TCACHE.get(key)
    if got is None:
        im = pool[i]
        if fl & 1:
            im = im.transpose(Image.FLIP_LEFT_RIGHT)
        if fl & 2:
            im = im.transpose(Image.FLIP_TOP_BOTTOM)
        if im.size != (size, size):
            im = im.resize((size, size), Image.LANCZOS)
        got = _TCACHE[key] = im
    return got


def fill_rect(dst, pool, x, y, w, h, size=CELL, seed=0, tint=None, uniform=False):
    """Tile an approved material across a pixel rect, clipped. UNIFORM picks ONE
    member of the pool and only flips it — a wall is one material, and mixing
    pool members across a facade is what made target v1 read as patchwork."""
    patch = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gx0, gy0 = x // size, y // size
    for gy in range((h // size) + 2):
        for gx in range((w // size) + 2):
            t = cell_tile(pool, gx0 + gx, gy0 + gy, size, seed, uniform=uniform)
            patch.paste(t, (gx * size - (x % size), gy * size - (y % size)))
    if tint:
        patch = shade(patch, tint)
    dst.alpha_composite(patch, (x, y))


def shade(im, factor, warm=(1.0, 1.0, 1.0)):
    """Multiply a surface's value. This is how the 3-tone read is built:
    a sky-lit top, a mid front face, a dark side — Pocket City rule 3, no
    black keyline anywhere."""
    px = im.load()
    out = im.copy()
    o = out.load()
    for j in range(im.height):
        for i in range(im.width):
            r, g, b, a = px[i, j]
            if not a:
                continue
            o[i, j] = (min(255, int(r * factor * warm[0])),
                       min(255, int(g * factor * warm[1])),
                       min(255, int(b * factor * warm[2])), a)
    return out


def soft_shadow(dst, poly, blur=7, alpha=110):
    """The pooled drop shadow every mass sits in (Pocket City rule 1)."""
    lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    ImageDraw.Draw(lay).polygon(poly, fill=(24, 18, 10, alpha))
    dst.alpha_composite(lay.filter(ImageFilter.GaussianBlur(blur)))


def band(dst, x, y, w, h, rgba):
    lay = Image.new('RGBA', (max(1, w), max(1, h)), rgba)
    dst.alpha_composite(lay, (x, y))


# ---------------------------------------------------------------------------
# THE 2-TILE DOOR — approved leaf pixels, new geometry (see REUSE CHECK).
# ---------------------------------------------------------------------------
def door_panel(C, w, h, open_amount=0.0):
    """Cut the door leaf out of the approved wall_door tile and re-hang it at
    2 cells. The leaf's own stiles/rails/panel lines are kept; only the
    OPENING is new."""
    src = C.house['wall_door'][0]
    bb = (6, 6, 38, 44)                      # the leaf inside the 44px tile
    leaf = src.crop(bb).resize((w, h), Image.LANCZOS)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    if open_amount <= 0.01:
        out.alpha_composite(leaf)
        return out
    # swung inward: the visible sliver of leaf, foreshortened, plus the dark jamb
    sw = max(2, int(w * (1.0 - open_amount)))
    out.alpha_composite(shade(leaf.resize((sw, h), Image.LANCZOS), 0.55), (w - sw, 0))
    return out


def interior_plate(C, w, h, seed=3):
    """What you SEE through the open door: a dressed room built from the same
    material as the exterior (INTERIOR-MATCHES-EXTERIOR law, and Paolo 7/26:
    'you're not using a single one of them')."""
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    fill_rect(im, C.house['wall_plain'], 0, 0, w, h, size=CELL, seed=seed)
    im = shade(im, 0.30, warm=(1.06, 0.98, 0.88))          # a room with no power
    d = ImageDraw.Draw(im)
    # the floor line: where the back wall meets the floor plate
    fy = int(h * 0.62)
    band(im, 0, fy, w, 2, (18, 14, 10, 190))
    floor = Image.new('RGBA', (w, h - fy - 2), (0, 0, 0, 0))
    fill_rect(floor, C.street['side'], 0, 0, w, h - fy - 2, size=CELL, seed=seed + 1)
    im.alpha_composite(shade(floor, 0.34), (0, fy + 2))
    # DRESSING (props, not decoration): a table, a chair, a mattress on the floor
    tw, th = int(w * 0.42), max(3, int(h * 0.08))
    tx, ty = int(w * 0.10), fy - th - int(h * 0.05)
    d.rectangle([tx, ty, tx + tw, ty + th], fill=(74, 56, 36, 255))          # table top
    d.rectangle([tx + 2, ty + th, tx + 5, ty + th + int(h * 0.12)], fill=(52, 38, 24, 255))
    d.rectangle([tx + tw - 5, ty + th, tx + tw - 2, ty + th + int(h * 0.12)], fill=(52, 38, 24, 255))
    d.ellipse([tx + tw - 14, ty - 6, tx + tw - 4, ty + 1], fill=(96, 90, 74, 255))  # a can on it
    mx, my = int(w * 0.58), fy + int(h * 0.10)
    d.rectangle([mx, my, mx + int(w * 0.34), my + int(h * 0.14)], fill=(58, 52, 46, 255))
    d.rectangle([mx, my, mx + int(w * 0.34), my + 2], fill=(78, 72, 64, 255))       # mattress
    # a shaft of daylight from the doorway, the only light in there
    lay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(lay).polygon([(int(w * 0.18), h), (int(w * 0.82), h),
                                 (int(w * 0.66), fy), (int(w * 0.34), fy)],
                                fill=(214, 186, 122, 46))
    im.alpha_composite(lay.filter(ImageFilter.GaussianBlur(5)))
    return im


# ---------------------------------------------------------------------------
# THE MASS — an oblique (cavalier 45) building volume. Geometry only: every
# face it exposes is filled with an APPROVED tile. Pocket City rules 2/3:
# few big clean volumes, three flat tones, NO black keyline.
# ---------------------------------------------------------------------------
SHEAR = 0.34          # how far the top slab slides right per cell of height
ROOF_FS = 0.26        # ROOF FORESHORTENING: a pitched roof seen from the world's
                      # 45 view is squashed. Without this a roof reads as
                      # wallpaper laid on the floor (target v1's worst read).
TOP, FRONT, SIDE = 1.30, 0.97, 0.56     # the three tones (sky / mid / away)


def _tex(C, family, w, h, seed, tone, warm=(1.0, 1.0, 1.0), texel=CELL):
    im = Image.new('RGBA', (max(1, w), max(1, h)), (0, 0, 0, 0))
    fill_rect(im, C.pool(family), 0, 0, max(1, w), max(1, h), size=texel, seed=seed,
              uniform=True)
    return shade(im, tone, warm=warm)


def _paste_poly(dst, src, at, poly):
    m = Image.new('L', src.size, 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    dst.paste(src, at, m)


def mass(dst, C, gx, gy, w, d, tall, wall='house:wall_plain', roof='house:roof_shingle',
         seed=0, flat_roof=False, eave=5, parapet=False):
    """One building volume, in the world's 45 view.

    Ground footprint is (w x d) cells. On screen the mass is:
      a PITCHED roof (foreshortened, ridge line, sun slope vs shade slope),
      a MID front face carrying the windows and the 2-cell door,
      a DARK away-side wedge opened by the shear,
      and a pooled ground shadow.
    Returns the front-face rect (x, y, w, h) for dressing."""
    x0, y0 = gx * CELL, gy * CELL
    fw, fd, fh = int(w * CELL), int(d * CELL), int(tall * CELL)
    sh = int(fh * SHEAR)
    rd = max(int(CELL * 0.62), int(fd * ROOF_FS))   # the roof's SCREEN depth
    front_y = y0 + fd - fh                      # top of the front face
    roof_top = front_y - rd

    # 1. THE CAST SHADOW. Vegas noon is a hard light from the upper left, so a
    #    mass throws a real shape down-right across its own yard. This is the
    #    biggest single depth cue in the whole plate — a mass with only a pooled
    #    contact shadow still reads as a sticker.
    thr = int(fh * 0.42)
    soft_shadow(dst, [(x0 + 4, y0 + fd - 4), (x0 + fw + 6, y0 + fd - 4),
                      (x0 + fw + 6 + thr, y0 + fd + thr), (x0 + 4 + thr, y0 + fd + thr)],
                blur=9, alpha=118)
    soft_shadow(dst, [(x0 + 4, y0 + fd - 6), (x0 + fw + 8, y0 + fd - 6),
                      (x0 + fw + 16, y0 + fd + 9), (x0 + 12, y0 + fd + 9)],
                blur=4, alpha=130)

    # 2. the AWAY side face (darkest) — the wedge the shear opens on the right
    side = _tex(C, wall, sh, fd + fh, seed + 5, SIDE, (0.93, 0.95, 1.03))
    _paste_poly(dst, side, (x0 + fw, front_y),
                [(0, 0), (sh, -0), (sh, fd), (0, fd + fh - (fd - 0))]
                if False else [(0, 0), (sh, -sh), (sh, fd - sh), (0, fd)])

    # 3. the ROOF. Two slopes meeting at a ridge: the far slope catches the sky,
    #    the near slope is the one you look at. Eaves OVERHANG the wall and cast
    #    onto it — that overhang is what makes a box read as a building.
    ex = eave
    rw = fw + ex * 2
    if flat_roof:
        deck = _tex(C, roof, rw, rd, seed + 1, TOP, (1.02, 1.0, 0.95), texel=20)
        dst.alpha_composite(deck, (x0 - ex + sh, roof_top))
        if parapet:
            band(dst, x0 - ex + sh, roof_top + rd - 4, rw, 4, (24, 19, 12, 120))
            band(dst, x0 - ex + sh, roof_top + rd - 7, rw, 3, (206, 196, 172, 190))
    else:
        far = _tex(C, roof, rw, rd, seed + 1, TOP, (1.03, 1.0, 0.93), texel=20).resize(
            (rw, max(2, int(rd * 0.44))), Image.LANCZOS)
        near = _tex(C, roof, rw, rd, seed + 2, TOP * 0.80, (1.0, 0.99, 0.96), texel=20).resize(
            (rw, max(2, rd - int(rd * 0.44))), Image.LANCZOS)
        dst.alpha_composite(far, (x0 - ex + sh, roof_top))
        dst.alpha_composite(near, (x0 - ex + sh, roof_top + far.height))
        ry = roof_top + far.height
        band(dst, x0 - ex + sh, ry - 2, rw, 2, (255, 244, 214, 120))    # the RIDGE, sun-caught
        band(dst, x0 - ex + sh, ry, rw, 1, (46, 34, 20, 150))
    # the eave lip + its cast shadow down the wall
    band(dst, x0 - ex + sh, roof_top + rd - 3, rw, 3, (58, 44, 28, 235))
    for i in range(7):
        band(dst, x0 - ex + sh, roof_top + rd + i, rw, 1, (26, 20, 12, int(110 - i * 15)))

    # 4. the FRONT face
    fr = _tex(C, wall, fw, fh, seed + 3, FRONT, (1.02, 1.0, 0.97))
    dst.alpha_composite(fr, (x0, front_y))
    # a soft vertical fall-off: walls are lit from above, not evenly
    for i in range(fh):
        a = int(52 * (i / float(fh)) ** 1.7)
        band(dst, x0, front_y + i, fw, 1, (30, 24, 15, a))
    # 5. corner value-steps instead of a keyline (Pocket City rule 3)
    band(dst, x0, front_y, 2, fh, (255, 246, 220, 40))
    band(dst, x0 + fw - 2, front_y, 2, fh, (36, 28, 18, 90))
    # 6. grime at the base — 30 years of dust, never a clean floor join
    for i in range(CELL // 2):
        a = int(86 * (1 - i / (CELL / 2.0)) ** 1.3)
        band(dst, x0, front_y + fh - 1 - i, fw, 1, (34, 26, 16, a))
    return (x0, front_y, fw, fh)


def windows(dst, C, rect, cols, rows=1, kind='wall_window', top=0.30, boarded=0.34,
            seed=0, wide=1.0):
    """Big, neat, readable GRIDS of dead dark glass (Pocket City rule 5, dead-
    world reconciliation: never a warm glow, the place is abandoned). Panes are
    cut from the approved wall_window / wall_boarded tiles and re-framed at a
    size you can actually read on a phone."""
    x0, y0, fw, fh = rect
    cw = int((fw / float(cols)) * 0.62 * wide)
    ch = int(cw * 0.74)
    pitch = fw / float(cols)
    rnd = random.Random(seed * 977 + 13)
    for r in range(rows):
        for c in range(cols):
            wx = int(x0 + pitch * c + (pitch - cw) / 2)
            wy = int(y0 + fh * top + r * ch * 1.75)
            if wy + ch > y0 + fh - CELL * 0.5:
                continue
            k = 'wall_boarded' if rnd.random() < boarded else kind
            src = C.house[k][rnd.randrange(len(C.house[k]))]
            pane = src.crop((6, 6, 38, 32)).resize((cw, ch), Image.LANCZOS)
            band(dst, wx - 3, wy - 3, cw + 6, ch + 6, (74, 66, 52, 235))     # the frame
            band(dst, wx - 3, wy - 3, cw + 6, 2, (196, 184, 156, 210))       # lit head
            dst.alpha_composite(shade(pane, 0.92), (wx, wy))
            band(dst, wx, wy, cw, 3, (18, 14, 9, 150))                       # reveal shadow
            band(dst, wx - 5, wy + ch + 3, cw + 10, 3, (208, 196, 168, 235))  # the SILL, sun-caught
            for i in range(5):                                               # sill drop shadow
                band(dst, wx - 5, wy + ch + 6 + i, cw + 10, 1, (28, 22, 14, 100 - i * 18))


def hang_door(dst, C, rect, at_cell, open_amount=0.66, interior=True, seed=1, stoop=True):
    """A 2-CELL DOOR OPENING (art-first reset law 5) with the dressed interior
    visible straight through it. This is the single measurement the target-match
    gate cares most about: the opening is exactly DOOR_CELLS tall and a standing
    body clears ~77% of it."""
    x0, y0, fw, fh = rect
    dw, dh = int(CELL * 1.10), CELL * DOOR_CELLS
    dx = int(x0 + at_cell * CELL)
    dy = y0 + fh - dh
    # the reveal: the wall has thickness, so the opening is recessed
    band(dst, dx - 4, dy - 5, dw + 8, dh + 5, (58, 46, 30, 255))
    band(dst, dx - 4, dy - 5, dw + 8, 3, (188, 174, 144, 220))       # lit lintel
    if interior:
        dst.alpha_composite(interior_plate(C, dw, dh, seed=seed), (dx, dy))
    else:
        band(dst, dx, dy, dw, dh, (16, 13, 9, 255))
    dst.alpha_composite(door_panel(C, dw, dh, open_amount), (dx, dy))
    band(dst, dx - 2, dy, 2, dh, (30, 24, 15, 210))
    band(dst, dx + dw, dy, 2, dh, (30, 24, 15, 210))
    if stoop:                                                        # a concrete step
        sx, sw2 = dx - 7, dw + 14
        band(dst, sx, y0 + fh, sw2, 6, (176, 166, 142, 255))
        band(dst, sx, y0 + fh, sw2, 2, (214, 204, 178, 255))
        for i in range(7):
            band(dst, sx + 3, y0 + fh + 6 + i, sw2, 1, (30, 24, 15, 110 - i * 14))
    # daylight spilling out of the opening onto the step
    lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    ImageDraw.Draw(lay).polygon([(dx + 2, dy + dh), (dx + dw - 2, dy + dh),
                                 (dx + dw + 8, dy + dh + 13), (dx - 8, dy + dh + 13)],
                                fill=(232, 202, 136, 40))
    dst.alpha_composite(lay.filter(ImageFilter.GaussianBlur(4)))
    return (dx, dy, dw, dh)


# ---------------------------------------------------------------------------
# PROPS — approved sprites, dropped at their own 3/4 scale with a pooled
# shadow. TILE_SRC=44 is the corpus cell; everything rescales by CELL/44 so a
# fire barrel is the same real-world size it was cooked at.
# ---------------------------------------------------------------------------
TILE_SRC = 44
BANK_LAMPS = 'banks/BOHEMIA_LAMP_DARK_VARIANTS_7_14_26.txt'
BANK_SIGNS = 'banks/BOHEMIA_MOUNTED_SIGNS_7_13_26.txt'
BANK_WALLS = 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt'


def load_extra(C):
    """The blessed lamp bank (the 45-law reference), the mounted signs and the
    perimeter wall pool — all approved, all opened here."""
    def arr(path, key):
        d = json.load(open(path))
        return [b64img(e['b64'] if isinstance(e, dict) else e) for e in d[key]]
    C.lamp = arr(BANK_LAMPS, 'lamps')
    C.sign = arr(BANK_SIGNS, 'signs')
    C.wall_pool = arr(BANK_WALLS, 'pool')
    return C


def drop(dst, sprite, gx, gy, scale=None, shadow=True, dark=1.0):
    """Stand an approved sprite on the ground at cell (gx,gy): its FEET land on
    the cell's front edge, so it occupies one footprint and rises out of it."""
    k = (CELL / float(TILE_SRC)) * (scale or 1.0)
    w, h = max(1, int(sprite.width * k)), max(1, int(sprite.height * k))
    im = sprite.resize((w, h), Image.LANCZOS)
    if dark != 1.0:
        im = shade(im, dark)
    fx = int(gx * CELL + CELL / 2 - w / 2)
    fy = int((gy + 1) * CELL - h)
    if shadow:
        soft_shadow(dst, [(fx + 3, (gy + 1) * CELL - 5), (fx + w - 3, (gy + 1) * CELL - 5),
                          (fx + w + 6, (gy + 1) * CELL + 4), (fx + 10, (gy + 1) * CELL + 4)],
                    blur=4, alpha=105)
    dst.alpha_composite(im, (fx, fy))


def chainlink(dst, gx0, gx1, gy, tall=1.2):
    """A chain-link run. NEW geometry (no fence bank exists) but drawn to the
    45 law: posts show a lit top cap, the mesh bows toward the viewer."""
    y1 = (gy + 1) * CELL
    y0 = int(y1 - tall * CELL)
    lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for x in range(gx0 * CELL, gx1 * CELL, 5):
        d.line([(x, y1), (x + 5, y0)], fill=(150, 148, 138, 92))
        d.line([(x, y0), (x + 5, y1)], fill=(150, 148, 138, 92))
    d.rectangle([gx0 * CELL, y0, gx1 * CELL, y0 + 2], fill=(168, 164, 152, 210))
    for gx in range(gx0, gx1 + 1, 3):
        px = gx * CELL
        d.rectangle([px, y0 - 2, px + 3, y1], fill=(126, 122, 112, 235))
        d.ellipse([px - 1, y0 - 5, px + 4, y0 - 1], fill=(196, 190, 172, 255))   # lit cap
    dst.alpha_composite(lay)


def wire(dst, pts, sag=10, col=(28, 24, 18, 200)):
    """Overhead service drop. The dead grid still has its wires up."""
    lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    for i in range(len(pts) - 1):
        (x0, y0), (x1, y1) = pts[i], pts[i + 1]
        prev = None
        for s in range(41):
            t = s / 40.0
            x = x0 + (x1 - x0) * t
            y = y0 + (y1 - y0) * t + math.sin(math.pi * t) * sag
            if prev:
                d.line([prev, (x, y)], fill=col, width=2)
            prev = (x, y)
    dst.alpha_composite(lay)


def grunge(im, seed=7, strength=34, cellsize=57):
    """One low-frequency dirt pass over the whole plate. Tiled material always
    betrays its period; 30 years of Mojave dust does not fall on a grid."""
    rnd = random.Random(seed)
    w, h = im.width // cellsize + 2, im.height // cellsize + 2
    n = Image.new('L', (w, h))
    n.putdata([128 + rnd.randint(-strength, strength) for _ in range(w * h)])
    n = n.resize(im.size, Image.BICUBIC)
    lay = Image.new('RGBA', im.size, (0, 0, 0, 0))
    lay.putalpha(n.point(lambda v: max(0, 128 - v)))
    lay = Image.merge('RGBA', (Image.new('L', im.size, 44), Image.new('L', im.size, 35),
                               Image.new('L', im.size, 22), lay.getchannel('A')))
    im.alpha_composite(lay)
    return im


def sun_pass(im, warm=(1.045, 1.005, 0.93), vignette=0.30):
    """VEGAS NOON: the whole plate takes one warm key, then a soft vignette so
    the poster has a centre. Never a colour cast on the art itself."""
    out = shade(im, 1.0, warm=warm)
    v = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(v)
    m = max(im.size)
    for i in range(26):
        a = int(vignette * 255 * (i / 26.0) ** 2.4)
        d.rectangle([-m + i * (m // 26), -m + i * (m // 26),
                     im.width + m - i * (m // 26), im.height + m - i * (m // 26)],
                    outline=(10, 8, 5, a), width=max(2, m // 26))
    out.alpha_composite(v.filter(ImageFilter.GaussianBlur(30)))
    return out


def body(dst, name, gx, gy, k=1.0, ring=None):
    """THE REAL CHARACTER — the alpha's own bake, never a stand-in. Feet land
    on the cell's front edge, painter order is the caller's job."""
    src = Image.open(os.path.join(CHARDIR, name + '.png')).convert('RGBA')
    bb = src.getbbox()
    src = src.crop(bb)
    w = max(1, int(src.width * k))
    h = max(1, int(src.height * k))
    im = src.resize((w, h), Image.NEAREST)
    fx = int(gx * CELL + CELL / 2 - w / 2)
    fy = int((gy + 1) * CELL - h)
    soft_shadow(dst, [(fx + 1, fy + h - 3), (fx + w - 1, fy + h - 3),
                      (fx + w + 7, fy + h + 4), (fx + 7, fy + h + 4)], blur=3, alpha=120)
    if ring:
        lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
        ImageDraw.Draw(lay).ellipse([fx - 4, fy + h - 7, fx + w + 4, fy + h + 5],
                                    outline=ring, width=2)
        dst.alpha_composite(lay)
    dst.alpha_composite(im, (fx, fy))
    return (fx, fy, w, h)


# ===========================================================================
# CANDIDATE A — "THE FRONT FACE"
# The projection the engine's own LAYERING law already describes (ground /
# structure 3/4 front face / overhead / prop / portal). North-up, axis-aligned,
# every mass extrudes UP the screen out of its footprint: a pitched sky-lit
# roof, a mid front face, a dark away-side. Cheapest to reach from what ships
# today — it keeps the run's square grid, its collision and its 8-way walk.
# ===========================================================================
def street_surface(im, C, road_y0, road_h, walk_y0, walk_h, centre_row=None):
    """The road the whole valley already owns: asphalt, a faded centre line,
    detached sidewalk behind a curb, gutter shadow. Approved street pools."""
    fill_rect(im, C.street['street'], 0, road_y0 * CELL, W, road_h * CELL, seed=2)
    if centre_row is not None:
        fill_rect(im, C.street['lane_div'], 0, centre_row * CELL, W, CELL, seed=3)
    fill_rect(im, C.street['side'], 0, walk_y0 * CELL, W, walk_h * CELL, seed=4)
    band(im, 0, road_y0 * CELL - 4, W, 4, (200, 190, 164, 200))       # the curb lip, sun-caught
    band(im, 0, road_y0 * CELL - 1, W, 2, (150, 140, 118, 220))
    for i in range(9):                                                # gutter shadow
        band(im, 0, road_y0 * CELL + i, W, 1, (26, 22, 14, 120 - i * 12))


def scorch(im, C, gx, gy, w, h, seed=0, a=150):
    """Burn scars: the approved scorch pool, punched in soft-edged so it reads
    as a stain on the asphalt and not another tile."""
    patch = Image.new('RGBA', (w * CELL, h * CELL), (0, 0, 0, 0))
    fill_rect(patch, C.street['scorch'], 0, 0, w * CELL, h * CELL, seed=seed)
    m = Image.new('L', patch.size, 0)
    ImageDraw.Draw(m).ellipse([2, 2, w * CELL - 2, h * CELL - 2], fill=a)
    patch.putalpha(Image.composite(patch.getchannel('A'), Image.new('L', patch.size, 0),
                                   m.filter(ImageFilter.GaussianBlur(9))))
    im.alpha_composite(patch, (gx * CELL, gy * CELL))


def blockwall(im, C, gy, tall=2.0, seed=0):
    """The 85/15 tan perimeter wall that walls every Vegas lot. Approved
    perimeter-wall pool, min 2 tiles tall (its own law), seen from BEHIND at the
    bottom of frame so the poster has a dark foreground edge."""
    y1 = int((gy + 1) * CELL)
    fh = int(tall * CELL)
    cap = Image.new('RGBA', (W, int(CELL * 0.5)), (0, 0, 0, 0))
    pool = C.wall_pool
    fill_rect(cap, pool, 0, 0, W, int(CELL * 0.5), size=CELL, seed=seed, uniform=True)
    face = Image.new('RGBA', (W, fh), (0, 0, 0, 0))
    fill_rect(face, pool, 0, 0, W, fh, size=CELL, seed=seed, uniform=True)
    im.alpha_composite(shade(face, 0.52, warm=(0.95, 0.96, 1.02)), (0, y1 - fh))
    im.alpha_composite(shade(cap, 0.86, warm=(1.03, 1.0, 0.95)), (0, y1 - fh - int(CELL * 0.5)))
    band(im, 0, y1 - fh - int(CELL * 0.5), W, 2, (226, 214, 184, 190))
    for i in range(10):
        band(im, 0, y1 - fh + i, W, 1, (24, 19, 12, 130 - i * 12))


def crosswalk(im, C, gx0, ncell, gy0, nrow, seed=0):
    """A ladder crosswalk + stop bar out of the approved cross/marking pool —
    the same markings the arterial engine already lays valley-wide."""
    for r in range(nrow):
        fill_rect(im, C.street['cross'], gx0 * CELL, (gy0 + r) * CELL,
                  ncell * CELL, CELL, seed=seed + r)


def screen_A(C):
    """THE SHOT: standing on the near curb looking north across the street at
    your own frontage. In an axis-aligned 3/4 you only ever see SOUTH faces, so
    the street's north side is the side that HAS a face — which is exactly the
    shot a walkable street level wants: facade, open door, yard, curb, asphalt,
    and a dark foreground wall to frame it."""
    im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    # --- 1. THE GROUND PLANE ---------------------------------------------
    # the base plane is the DARK harmonized concrete, never raw orange dirt: any
    # gap the masses leave then reads as an alley, not as a hole in the art.
    fill_rect(im, C.street['side'], 0, 0, W, H, seed=1)
    band(im, 0, 0, W, H, (26, 21, 13, 130))
    street_surface(im, C, road_y0=14, road_h=5, walk_y0=12, walk_h=2, centre_row=16)
    fill_rect(im, C.street['side'], 0, 19 * CELL, W, 2 * CELL, seed=14)   # the near walk
    band(im, 0, 19 * CELL - 3, W, 4, (198, 188, 162, 200))                # near curb lip
    fill_rect(im, C.street['side'], 8 * CELL, 3 * CELL, 3 * CELL, 9 * CELL, seed=9)  # driveway
    fill_rect(im, C.house['yard_deserttan'], 0, 6 * CELL, 8 * CELL, 6 * CELL,
              seed=6, uniform=True)
    band(im, 0, 6 * CELL, 8 * CELL, 6 * CELL, (48, 38, 22, 46))
    fill_rect(im, C.street['side'], int(3.6 * CELL), 6 * CELL, CELL + 12, 6 * CELL, seed=7)
    crosswalk(im, C, 2, 4, 14, 2, seed=2)
    band(im, 2 * CELL, 17 * CELL, 4 * CELL, 4, (170, 162, 136, 110))       # faded stop bar
    scorch(im, C, 7, 16, 3, 2, seed=4, a=80)
    # --- 2. THE FRONTAGE — a CONTINUOUS street wall, never a gap of dirt --
    # the backdrop block: the streetwall never breaks to raw dirt at the top edge
    mass(im, C, -4, -5, 20, 4, 4.0, wall='house:wall_plain',
         roof='house:roof_stile_desertbrown', seed=61)
    st = mass(im, C, -3, 1, 6, 5, 5.2, wall='house:wall_plain',
              roof='house:roof_gravel', seed=12, flat_roof=True, parapet=True)
    windows(im, C, st, cols=3, top=0.36, boarded=0.85, seed=8)
    far = mass(im, C, 7, 0, 8, 4, 5.4, wall='house:wall_plain',
               roof='house:roof_stile_graybrown', seed=17)
    windows(im, C, far, cols=3, top=0.42, boarded=0.7, seed=19)
    # the block behind the block: no hole in a streetwall ever shows raw dirt
    mass(im, C, 1, -3, 8, 4, 4.0, wall='house:wall_plain',
         roof='house:roof_stile_desertbrown', seed=52)
    # THE HERO HOUSE — terracotta over pale, its 2-CELL DOOR standing open
    rect = mass(im, C, 2, 2, 6, 5, 4.0, wall='house:wall_plain',
                roof='house:roof_stile_terracotta', seed=31, eave=7)
    windows(im, C, rect, cols=3, top=0.26, boarded=0.34, seed=5)
    hang_door(im, C, rect, at_cell=2.6, open_amount=0.56, seed=2)
    # THE GARAGE — a lower mass, so the roofline is a silhouette and not a slab
    g = mass(im, C, 8, 3, 5, 4, 2.7, wall='house:wall_plain',
             roof='house:roof_gravel', seed=44, flat_roof=True, parapet=True)
    hang_door(im, C, g, at_cell=1.2, open_amount=0.0, interior=False, seed=6, stoop=False)
    # --- 3. THE DRESSING --------------------------------------------------
    chainlink(im, 0, 3, 11)
    chainlink(im, 5, 8, 11)
    drop(im, C.desert['rubble'][2], 6, 10, scale=0.5)
    drop(im, C.desert['boulder'][11], 1, 9, scale=0.42)
    drop(im, C.desert['rock'][4], 7, 11, scale=0.38)
    drop(im, C.prop['car_wreck'][6], 9, 10, scale=1.05)
    drop(im, C.prop['car_wreck'][2], 1, 16, scale=1.05)
    drop(im, C.prop['car_wreck'][14], 8, 18, scale=1.05)
    drop(im, C.desert['rubble'][5], 4, 18, scale=0.6)
    drop(im, C.lamp[4], 2, 20, scale=1.5, dark=0.82)
    drop(im, C.prop['fire_barrel'][3], 0, 13, scale=0.95)
    drop(im, C.lamp[2], 9, 13, scale=1.6, dark=0.9)
    drop(im, C.sign[7], 6, 13, scale=0.85)
    wire(im, [(int(9.4 * CELL), int(10.3 * CELL)), (int(0.4 * CELL), int(10.1 * CELL))], sag=9)
    blockwall(im, C, 23, tall=2.4, seed=3)
    grunge(im)
    # --- 4. THE BODIES ----------------------------------------------------
    body(im, 'idle_S', 4, 11, k=BODY_K)                    # YOU, on your own front walk
    body(im, 'walk_E_1', 7, 13, k=BODY_K)                  # the lineman, working the block
    return sun_pass(im)


# ===========================================================================
# CANDIDATE B — "THE ISO BLOCK"
# True 2:1 dimetric — the projection of the city-builder Paolo already said he
# likes ("I like the districts in city builder mode"), brought down to walking
# distance. Every mass is a real volume with a sky-lit top, a lit SE face and a
# shaded SW face, so BOTH sides of a street show frontage — the thing candidate
# A structurally cannot do. Costs a new renderer and a diamond grid.
# ===========================================================================
TW, TH = 52, 26            # the iso diamond: 2:1, the Pocket City ratio
ZH = 38                    # PX PER CELL OF HEIGHT. Deliberately taller than TH:
                           # at TH the vertical unit is so short that a 2-cell
                           # door would be 64px and a body would out-top it. At
                           # ZH=38 a 2-cell door is 76px and a 59px body clears
                           # 77% of it — the proportion candidate A also carries.
ORIGIN = (W // 2, 40)


def iso(gx, gy, gz=0.0):
    return (int(ORIGIN[0] + (gx - gy) * (TW // 2)),
            int(ORIGIN[1] + (gx + gy) * (TH // 2) - gz * ZH))


def _affine_paste(dst, tex, O, U, V, mask_poly=None, extra=None):
    """Map the texture's own rect onto the parallelogram O + u*U + v*V."""
    (ux, uy), (vx, vy) = U, V
    det = ux * vy - uy * vx
    if abs(det) < 1e-6:
        return
    tw, th = tex.size
    # (u,v) from screen delta
    a11, a12 = vy / det, -vx / det
    a21, a22 = -uy / det, ux / det
    xs = [O[0], O[0] + ux, O[0] + vx, O[0] + ux + vx]
    ys = [O[1], O[1] + uy, O[1] + vy, O[1] + uy + vy]
    x0, y0 = int(min(xs)) - 1, int(min(ys)) - 1
    bw, bh = int(max(xs)) - x0 + 2, int(max(ys)) - y0 + 2
    if bw <= 0 or bh <= 0:
        return
    dx, dy = x0 - O[0], y0 - O[1]
    coeffs = (tw * a11, tw * a12, tw * (a11 * dx + a12 * dy),
              th * a21, th * a22, th * (a21 * dx + a22 * dy))
    warped = tex.transform((bw, bh), Image.AFFINE, coeffs, Image.NEAREST)
    poly = mask_poly or [(O[0] - x0, O[1] - y0), (O[0] + ux - x0, O[1] + uy - y0),
                         (O[0] + ux + vx - x0, O[1] + uy + vy - y0),
                         (O[0] + vx - x0, O[1] + vy - y0)]
    m = Image.new('L', (bw, bh), 0)
    ImageDraw.Draw(m).polygon(poly, fill=255)
    warped.putalpha(Image.composite(warped.getchannel('A'), Image.new('L', (bw, bh), 0), m))
    dst.alpha_composite(warped, (x0, y0))


def iso_ground(dst, C, family, gx, gy, seed=0, tone=1.0, texel=44, uniform=False):
    """One diamond of approved ground material, sheared into the 2:1 grid."""
    pool = C.pool(family) if isinstance(family, str) else family
    tex = cell_tile(pool, gx, gy, texel, seed, uniform=uniform)
    tex = shade(tex, tone) if tone != 1.0 else tex
    O = iso(gx, gy)
    _affine_paste(dst, tex, (O[0] - TW // 2, O[1]), (TW // 2, TH // 2), (-TW // 2, TH // 2))


def iso_box(dst, C, gx, gy, w, d, tall, wall='house:wall_plain',
            roof='house:roof_shingle', seed=0, pitched=True, parapet=False, texel=32):
    """A real volume in the 2:1 grid: sky-lit top, lit SE face, shaded SW face.
    Returns (se_face, sw_face) as (O, U, V) frames so doors and windows can be
    hung ON the face in its own space instead of stamped over it."""
    hz = tall
    # ---- the two faces a camera below the world can actually see ---------
    # LEFT face:  the plane gy = gy+d, spanning gx. Its normal points down-left.
    #             Sun is upper-left, so this is the LIT face — it carries the door.
    # RIGHT face: the plane gx = gx+w, spanning gy. Normal points down-right: SHADED.
    A = iso(gx, gy + d, 0)
    B = iso(gx + w, gy + d, 0)
    lf_O, lf_U, lf_V = (A[0], A[1] - int(hz * ZH)), (B[0] - A[0], B[1] - A[1]), (0, int(hz * ZH))
    Dd = iso(gx + w, gy, 0)
    rf_O, rf_U, rf_V = (Dd[0], Dd[1] - int(hz * ZH)), (B[0] - Dd[0], B[1] - Dd[1]), (0, int(hz * ZH))
    se_O, se_U, se_V = lf_O, lf_U, lf_V
    sw_O, sw_U, sw_V = rf_O, rf_U, rf_V
    # cast shadow first, on the ground, thrown to the lower right
    sp = [iso(gx, gy + d), iso(gx + w, gy + d),
          (iso(gx + w, gy + d)[0] + int(hz * TW * 0.5), iso(gx + w, gy + d)[1] + int(hz * TH * 0.5)),
          (iso(gx, gy + d)[0] + int(hz * TW * 0.5), iso(gx, gy + d)[1] + int(hz * TH * 0.5))]
    soft_shadow(dst, sp, blur=8, alpha=120)
    wtex_r = _tex(C, wall, texel * max(1, d), texel * max(1, int(round(hz))), seed + 2,
                  SIDE * 1.12, (0.94, 0.96, 1.05), texel=texel)
    _affine_paste(dst, wtex_r, rf_O, rf_U, rf_V)
    wtex_l = _tex(C, wall, texel * max(1, w), texel * max(1, int(round(hz))), seed + 3,
                  FRONT * 1.10, (1.03, 1.0, 0.96), texel=texel)
    _affine_paste(dst, wtex_l, lf_O, lf_U, lf_V)
    # the value step where the two faces meet — never a black keyline
    lay0 = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    ImageDraw.Draw(lay0).line([(B[0], B[1] - int(hz * ZH)), (B[0], B[1])],
                              fill=(250, 240, 214, 60), width=2)
    dst.alpha_composite(lay0)
    # ---- the top ---------------------------------------------------------
    top_lift = int(hz * ZH)
    rtex = _tex(C, roof, texel * max(1, w), texel * max(1, d), seed + 1, TOP, (1.03, 1.0, 0.94),
                texel=22)
    tO = (iso(gx, gy)[0] - TW // 2, iso(gx, gy)[1] - top_lift)
    if not pitched:
        _affine_paste(dst, rtex, tO, (TW // 2 * w, TH // 2 * w), (-TW // 2 * d, TH // 2 * d))
        if parapet:
            # a real coping: a low wall around the deck, lit on top, shading the
            # deck under it. Never a wireframe outline.
            lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
            dd = ImageDraw.Draw(lay)
            ph = int(ZH * 0.26)
            for (a, b, tone) in ((iso(gx, gy + d, hz), iso(gx + w, gy + d, hz), 0.94),
                                 (iso(gx + w, gy, hz), iso(gx + w, gy + d, hz), 0.62)):
                dd.polygon([a, b, (b[0], b[1] - ph), (a[0], a[1] - ph)],
                           fill=(int(158 * tone), int(146 * tone), int(122 * tone), 255))
                dd.line([(a[0], a[1] - ph), (b[0], b[1] - ph)], fill=(226, 214, 186, 255), width=2)
            dst.alpha_composite(lay)
            # DRESSED DECK: AC units, a roof-access box, vents. A blank deck the
            # size of a city block is the biggest dead area an iso city can have.
            rr = random.Random(seed * 31 + 7)
            for _ in range(max(2, (w * d) // 3)):
                bx = gx + 0.5 + rr.random() * max(0.4, w - 1.4)
                by = gy + 0.5 + rr.random() * max(0.4, d - 1.4)
                bh = 0.22 + rr.random() * 0.30
                bw2 = 0.55 + rr.random() * 0.5
                p0 = iso(bx, by, hz); p1 = iso(bx + bw2, by, hz)
                p2 = iso(bx + bw2, by + bw2, hz); p3 = iso(bx, by + bw2, hz)
                l2 = Image.new('RGBA', dst.size, (0, 0, 0, 0)); d2 = ImageDraw.Draw(l2)
                d2.polygon([p0, p1, p2, p3], fill=(38, 32, 22, 90))          # its shadow
                up = lambda q: (q[0], q[1] - int(bh * ZH))
                d2.polygon([p3, p2, up(p2), up(p3)], fill=(112, 104, 88, 255))
                d2.polygon([p2, p1, up(p1), up(p2)], fill=(78, 72, 60, 255))
                d2.polygon([up(p0), up(p1), up(p2), up(p3)], fill=(168, 158, 134, 255))
                dst.alpha_composite(l2)
    else:
        # a GABLE: two slopes meeting over the middle of the depth
        rz = hz + max(0.75, d * 0.24)
        mid = gy + d / 2.0
        far = [iso(gx, gy, hz), iso(gx + w, gy, hz), iso(gx + w, mid, rz), iso(gx, mid, rz)]
        near = [iso(gx, mid, rz), iso(gx + w, mid, rz),
                iso(gx + w, gy + d, hz), iso(gx, gy + d, hz)]
        for poly, tone, sd in ((far, TOP, seed + 1), (near, TOP * 0.74, seed + 4)):
            xs = [q[0] for q in poly]; ys = [q[1] for q in poly]
            bx, by = min(xs), min(ys)
            t = _tex(C, roof, texel * max(1, w), texel * max(2, d), sd, tone, (1.03, 1.0, 0.94),
                     texel=22)
            _affine_paste(dst, t, poly[0],
                          (poly[1][0] - poly[0][0], poly[1][1] - poly[0][1]),
                          (poly[3][0] - poly[0][0], poly[3][1] - poly[0][1]))
        lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
        ImageDraw.Draw(lay).line([iso(gx, mid, rz), iso(gx + w, mid, rz)],
                                 fill=(255, 246, 216, 190), width=3)   # the RIDGE, sun-caught
        # the two gable ends, so the roof is a solid and not two floating planes
        for gxx, tone in ((gx, SIDE * 1.1), (gx + w, FRONT * 1.02)):
            ImageDraw.Draw(lay).polygon([iso(gxx, gy, hz), iso(gxx, mid, rz), iso(gxx, gy + d, hz)],
                                        fill=(int(150 * tone), int(136 * tone), int(112 * tone), 255))
        dst.alpha_composite(lay)
    return (se_O, se_U, se_V), (sw_O, sw_U, sw_V)


def face_paste(dst, sprite, frame, u, v, wcell, hcell, cells_w, cells_h):
    """Hang a flat sprite ON an iso wall face. (u,v) are 0..1 across the face,
    so a door hung at 2 cells tall stays 2 cells tall in the projection."""
    O, U, V = frame
    su, sv = wcell / float(cells_w), hcell / float(cells_h)
    o = (int(O[0] + U[0] * u + V[0] * v), int(O[1] + U[1] * u + V[1] * v))
    _affine_paste(dst, sprite, o, (int(U[0] * su), int(U[1] * su)),
                  (int(V[0] * sv), int(V[1] * sv)))


def iso_drop(dst, sprite, gx, gy, scale=1.0, dark=1.0, shadow=True):
    """Stand an approved 3/4 sprite on an iso cell. The corpus props were cooked
    in the world's 45 view already, so they drop straight in — no re-projection,
    which is exactly why the 45 LAW exists."""
    k = (ZH / 44.0) * scale       # props were cooked at 1 cell = 44px; match HEIGHT
    w, h = max(1, int(sprite.width * k)), max(1, int(sprite.height * k))
    im = sprite.resize((w, h), Image.LANCZOS)
    if dark != 1.0:
        im = shade(im, dark)
    cx, cy = iso(gx + 0.5, gy + 0.5)
    if shadow:
        soft_shadow(dst, [(cx - w // 3, cy - 3), (cx + w // 3, cy - 3),
                          (cx + w // 2 + 5, cy + 6), (cx - w // 4 + 5, cy + 6)],
                    blur=4, alpha=110)
    dst.alpha_composite(im, (int(cx - w / 2), int(cy - h)))


def iso_body(dst, name, gx, gy, k=1.20):
    src = Image.open(os.path.join(CHARDIR, name + '.png')).convert('RGBA')
    src = src.crop(src.getbbox())
    w, h = max(1, int(src.width * k)), max(1, int(src.height * k))
    im = src.resize((w, h), Image.NEAREST)
    cx, cy = iso(gx + 0.5, gy + 0.5)
    soft_shadow(dst, [(cx - w // 3, cy - 3), (cx + w // 3, cy - 3),
                      (cx + w // 2 + 4, cy + 5), (cx - w // 4 + 4, cy + 5)], blur=3, alpha=125)
    dst.alpha_composite(im, (int(cx - w / 2), int(cy - h)))


def screen_B(C):
    """THE SHOT: the lane runs DIAGONALLY across the phone (a street along a
    world axis is a diagonal in 2:1), so the frontage block lands in the middle
    of frame instead of being pushed off both edges. Sun upper-left, three tones
    a mass: sky-lit top, lit left face, shaded right face."""
    im = Image.new('RGBA', (W, H), (14, 12, 9, 255))
    RY0, RY1 = 15, 19                 # the carriageway: gy in [RY0, RY1]
    WALKN, WALKS = RY0 - 2, RY1 + 2   # sidewalk either side

    def surface(gy):
        if RY0 <= gy <= RY1:
            return ('road', C.street['street'], 1.0, 2, False)
        if WALKN <= gy < RY0 or RY1 < gy <= WALKS:
            return ('walk', C.street['side'], 1.0, 4, True)
        return ('yard', C.house['yard_deserttan'], 0.90, 6, True)

    # --- 1. THE GROUND ----------------------------------------------------
    for v in range(-4, 78):
        for u in range(-11, 12):
            if (u + v) & 1:
                continue
            gx, gy = (v + u) // 2, (v - u) // 2
            sx, sy = iso(gx, gy)
            if sx < -TW or sx > W + TW or sy < -TH or sy > H + TH:
                continue
            kind, fam, tone, sd, uni = surface(gy)
            if kind == 'road' and gy == (RY0 + RY1) // 2 and gx % 4 < 2:
                fam, sd, uni = C.street['lane_div'], 5, True
            iso_ground(im, C, fam, gx, gy, seed=sd, tone=tone, uniform=uni,
                       texel=44)
    # the curb lips, both sides of the carriageway
    lay = Image.new('RGBA', im.size, (0, 0, 0, 0))
    dd = ImageDraw.Draw(lay)
    for gy in (RY0 - 0.02, RY1 + 1.02):
        pts = [iso(gx, gy) for gx in range(-6, 46)]
        dd.line([(p[0], p[1] + 3) for p in pts], fill=(34, 28, 18, 165), width=4)
        dd.line(pts, fill=(206, 196, 170, 215), width=3)
    im.alpha_composite(lay)

    # --- 2. THE MASSES ----------------------------------------------------
    # NORTH of the lane (gy < RY0): their LIT face turns straight at the street,
    # so that row carries the doors and windows the shot is about.
    # SOUTH of the lane: backs and yards — a real block, not a stage flat.
    plan = [
        (3,  9, 4, 4, 2.8, 'house:roof_shingle',           True,  False, 71, 'house'),
        (8,  9, 4, 4, 3.6, 'house:roof_gravel',            False, True,  77, 'store'),
        (13, 9, 4, 4, 3.0, 'house:roof_stile_terracotta',  True,  False, 84, 'HERO'),
        (18, 9, 4, 4, 2.7, 'house:roof_stile_graybrown',   True,  False, 87, 'house'),
        (23, 9, 4, 4, 2.9, 'house:roof_shingle',           True,  False, 90, 'house'),
        (2,  3, 4, 4, 3.4, 'house:roof_gravel',            False, True,  63, 'store'),
        (8,  3, 4, 4, 2.8, 'house:roof_shingle',           True,  False, 66, 'house'),
        (14, 3, 4, 4, 3.1, 'house:roof_stile_desertbrown', True,  False, 69, 'house'),
        (20, 3, 4, 4, 2.9, 'house:roof_shingle',           True,  False, 60, 'house'),
        (3,  21, 4, 4, 2.8, 'house:roof_stile_graybrown',  True,  False, 93, 'back'),
        (9,  21, 4, 4, 3.0, 'house:roof_shingle',          True,  False, 96, 'back'),
        (15, 21, 4, 4, 2.7, 'house:roof_stile_desertbrown', True, False, 99, 'back'),
        (21, 21, 4, 4, 3.3, 'house:roof_gravel',           False, True, 102, 'back'),
        (27, 21, 4, 4, 2.8, 'house:roof_shingle',          True,  False, 105, 'back'),
        (9,  28, 4, 4, 2.9, 'house:roof_shingle',          True,  False, 108, 'back'),
        (15, 28, 4, 4, 2.7, 'house:roof_stile_terracotta', True,  False, 111, 'back'),
        (21, 28, 4, 4, 3.1, 'house:roof_stile_graybrown',  True,  False, 114, 'back'),
        (27, 28, 4, 4, 2.8, 'house:roof_gravel',          False,  True, 117, 'back'),
    ]
    plan.sort(key=lambda b: (b[0] + b[2]) + (b[1] + b[3]))
    for (gx, gy, w, d, tall, roof, pitched, parapet, seed, kind) in plan:
        lf, rf = iso_box(im, C, gx, gy, w, d, tall, wall='house:wall_plain',
                         roof=roof, seed=seed, pitched=pitched, parapet=parapet)
        rnd = random.Random(seed)
        for c in range(w):
            k = 'wall_boarded' if rnd.random() < (0.8 if kind == 'store' else 0.42) else 'wall_window'
            src = C.house[k][rnd.randrange(len(C.house[k]))]
            pane = src.crop((5, 5, 39, 31))
            fr = Image.new('RGBA', (pane.width + 8, pane.height + 8), (80, 72, 56, 255))
            fr.alpha_composite(shade(pane, 0.9), (4, 4))
            band(fr, 0, 0, fr.width, 2, (208, 196, 168, 220))
            face_paste(im, fr, lf, (c + 0.16) / float(w), 0.22, 0.68, 0.52, w, tall)
        if kind == 'HERO':
            dw, dh = 44, 88                       # 2 cells tall in face space
            leaf = Image.new('RGBA', (dw, dh), (0, 0, 0, 0))
            leaf.alpha_composite(interior_plate(C, dw, dh, seed=4))
            leaf.alpha_composite(door_panel(C, dw, dh, 0.58))
            jam = Image.new('RGBA', (dw + 10, dh + 7), (54, 43, 28, 255))
            jam.alpha_composite(leaf, (5, 7))
            band(jam, 0, 0, dw + 10, 3, (198, 184, 152, 235))
            face_paste(im, jam, lf, 1.30 / float(w), 1.0 - DOOR_CELLS / float(tall),
                       1.06, DOOR_CELLS + 0.16, w, tall)

    # --- 3. THE DRESSING --------------------------------------------------
    iso_drop(im, C.prop['car_wreck'][6], 14, 16, scale=1.15)
    iso_drop(im, C.prop['car_wreck'][2], 22, 18, scale=1.15)
    iso_drop(im, C.prop['car_wreck'][14], 8, 15, scale=1.15)
    iso_drop(im, C.prop['fire_barrel'][3], 11, 14, scale=0.52)
    iso_drop(im, C.lamp[2], 13, 13, scale=0.95, dark=0.9)
    iso_drop(im, C.lamp[2], 8, 13, scale=0.95, dark=0.9)
    iso_drop(im, C.lamp[2], 22, 20, scale=0.95, dark=0.9)
    iso_drop(im, C.sign[7], 18, 14, scale=0.5)
    iso_drop(im, C.desert['boulder'][11], 6, 11, scale=0.3)
    iso_drop(im, C.desert['rubble'][2], 16, 12, scale=0.35)
    iso_drop(im, C.desert['rock'][4], 12, 20, scale=0.3)
    grunge(im)
    # --- 4. THE BODIES ----------------------------------------------------
    iso_body(im, 'walk_SE_1', 12, 14)               # the lineman, working the block
    iso_body(im, 'idle_S', 19, 14)                  # YOU, at your own gate
    return sun_pass(im)


# ===========================================================================
# CANDIDATE C — "THE CUTAWAY"
# The same 2:1 world as B, but the building you are IN is drawn open: the two
# walls between you and the camera are cut to knee height and the dressed
# interior is on screen at all times. No loading, no separate interior mode —
# which is the INTERIOR-MATCHES-EXTERIOR law (Paolo 7/19, LOCKED) made visible:
# the room is literally the footprint. Costs the most renderer work; sells the
# thing the other two hide behind a door.
# ===========================================================================
def iso_open_box(dst, C, gx, gy, w, d, tall, roof='house:roof_stile_terracotta',
                 seed=0, texel=32):
    """A cut-open volume. Far walls stand full height with their INNER faces to
    the camera, near walls are cut to a knee, the floor plate is the footprint
    (never clamped — that is the law), and the roof is lifted off."""
    hz = tall
    knee = 0.42
    # --- the far walls, inner faces toward the camera ---------------------
    # plane gy = gy (the north wall), inner side faces +gy = down-left
    A, Bp = iso(gx, gy, 0), iso(gx + w, gy, 0)
    n_O, n_U, n_V = (A[0], A[1] - int(hz * ZH)), (Bp[0] - A[0], Bp[1] - A[1]), (0, int(hz * ZH))
    # plane gx = gx (the west wall), inner side faces +gx = down-right
    Cw = iso(gx, gy + d, 0)
    w_O, w_U, w_V = (A[0], A[1] - int(hz * ZH)), (Cw[0] - A[0], Cw[1] - A[1]), (0, int(hz * ZH))
    # outside shells of those same two walls, so the mass still reads solid
    iso_box_shell(dst, C, gx, gy, w, d, hz, seed)
    # --- the floor plate: THE FOOTPRINT, cell for cell --------------------
    for jx in range(w):
        for jy in range(d):
            iso_ground(dst, C, C.street['side'], gx + jx, gy + jy, seed=seed + 3,
                       tone=0.44, uniform=True)
    # --- the inner faces --------------------------------------------------
    itex = _tex(C, 'house:wall_plain', texel * w, texel * max(1, int(round(hz))), seed + 11,
                0.50, (1.06, 0.98, 0.88), texel=texel)
    _affine_paste(dst, itex, n_O, n_U, n_V)
    itex2 = _tex(C, 'house:wall_plain', texel * d, texel * max(1, int(round(hz))), seed + 12,
                 0.38, (1.02, 0.99, 0.95), texel=texel)
    _affine_paste(dst, itex2, w_O, w_U, w_V)
    # a window punched in the far wall: daylight is the only light in there
    src = C.house['wall_window'][0].crop((5, 5, 39, 31))
    fr = Image.new('RGBA', (src.width + 8, src.height + 8), (70, 62, 48, 255))
    fr.alpha_composite(shade(src, 1.35), (4, 4))
    face_paste(dst, fr, (n_O, n_U, n_V), 0.55, 0.24, 0.62, 0.44, w, hz)
    # --- the near walls, cut to a knee ------------------------------------
    D2, E2 = iso(gx, gy + d, 0), iso(gx + w, gy + d, 0)
    s_O, s_U, s_V = (D2[0], D2[1] - int(knee * ZH)), (E2[0] - D2[0], E2[1] - D2[1]), (0, int(knee * ZH))
    ktex = _tex(C, 'house:wall_plain', texel * w, texel, seed + 13, FRONT * 1.05,
                (1.03, 1.0, 0.96), texel=texel)
    _affine_paste(dst, ktex, s_O, s_U, s_V)
    F2 = iso(gx + w, gy, 0)
    e_O, e_U, e_V = (F2[0], F2[1] - int(knee * ZH)), (E2[0] - F2[0], E2[1] - F2[1]), (0, int(knee * ZH))
    ktex2 = _tex(C, 'house:wall_plain', texel * d, texel, seed + 14, SIDE * 1.12,
                 (0.95, 0.96, 1.04), texel=texel)
    _affine_paste(dst, ktex2, e_O, e_U, e_V)
    lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    dd = ImageDraw.Draw(lay)
    for a, b in ((D2, E2), (F2, E2)):
        dd.line([(a[0], a[1] - int(knee * ZH)), (b[0], b[1] - int(knee * ZH))],
                fill=(226, 214, 186, 220), width=3)
    # the THRESHOLD: the cut knee opens where the front door is, so the room
    # and the street are one continuous surface you walk across.
    t0, t1 = iso(gx + 1.1, gy + d), iso(gx + 2.2, gy + d)
    dd.polygon([t0, t1, (t1[0], t1[1] - int(knee * ZH)), (t0[0], t0[1] - int(knee * ZH))],
               fill=(150, 140, 118, 255))
    dd.line([t0, t1], fill=(216, 204, 176, 240), width=3)
    dst.alpha_composite(lay)
    # --- NO ROOF. A dollhouse cut takes the lid off; a floating slab just
    #     occludes the room it was supposed to reveal (the first C render did
    #     exactly that). What stays is the wall-top coping so the cut is read
    #     as deliberate surgery and not as a missing asset.
    lay3 = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    d3 = ImageDraw.Draw(lay3)
    top = [iso(gx, gy, hz), iso(gx + w, gy, hz), iso(gx + w, gy + d, hz), iso(gx, gy + d, hz)]
    d3.line([top[0], top[1]], fill=(232, 220, 190, 235), width=3)
    d3.line([top[0], top[3]], fill=(232, 220, 190, 235), width=3)
    dst.alpha_composite(lay3)
    return (n_O, n_U, n_V)


def iso_box_shell(dst, C, gx, gy, w, d, hz, seed, texel=32):
    """The two OUTER faces of a cut-open building's far walls, so from the
    street it is still a solid house and not a stage flat."""
    A = iso(gx, gy, 0)
    up = int(hz * ZH)
    Bp = iso(gx + w, gy, 0)
    Cw = iso(gx, gy + d, 0)
    t1 = _tex(C, 'house:wall_plain', texel * w, texel * max(1, int(round(hz))), seed + 21,
              SIDE * 0.9, (0.94, 0.96, 1.04), texel=texel)
    _affine_paste(dst, t1, (A[0], A[1] - up - 4), (Bp[0] - A[0], Bp[1] - A[1]), (0, up))
    t2 = _tex(C, 'house:wall_plain', texel * d, texel * max(1, int(round(hz))), seed + 22,
              SIDE * 0.9, (0.94, 0.96, 1.04), texel=texel)
    _affine_paste(dst, t2, (A[0] - 4, A[1] - up), (Cw[0] - A[0], Cw[1] - A[1]), (0, up))


def iso_room_dressing(dst, C, gx, gy, w, d, seed=0):
    """What is actually IN the room. Dressing, not decoration: a mattress on the
    floor, a table with what is left on it, a stove, a footlocker."""
    def blockprop(cx, cy, sw, sh, top, side, face):
        p0, p1 = iso(cx, cy), iso(cx + sw, cy)
        p2, p3 = iso(cx + sw, cy + sw), iso(cx, cy + sw)
        lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
        dd = ImageDraw.Draw(lay)
        dd.polygon([p0, p1, p2, p3], fill=(30, 25, 16, 105))
        u = lambda q: (q[0], q[1] - int(sh * ZH))
        dd.polygon([p3, p2, u(p2), u(p3)], fill=face)
        dd.polygon([p2, p1, u(p1), u(p2)], fill=side)
        dd.polygon([u(p0), u(p1), u(p2), u(p3)], fill=top)
        dst.alpha_composite(lay)
    blockprop(gx + 0.35, gy + 0.35, 1.15, 0.18, (146, 136, 118, 255), (62, 57, 49, 255),
              (96, 89, 78, 255))                                   # the mattress
    blockprop(gx + 2.4, gy + 0.45, 1.05, 0.46, (150, 112, 66, 255), (52, 38, 22, 255),
              (98, 73, 43, 255))                                   # the table
    blockprop(gx + 2.6, gy + 2.3, 0.75, 0.62, (176, 170, 158, 255), (58, 56, 52, 255),
              (110, 106, 98, 255))                                 # the stove
    blockprop(gx + 0.45, gy + 2.5, 0.85, 0.34, (132, 106, 62, 255), (46, 36, 21, 255),
              (88, 70, 41, 255))                                   # a footlocker
    rr = random.Random(seed * 17 + 3)
    lay0 = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    d0 = ImageDraw.Draw(lay0)
    for _ in range(26):                                    # 30 years of floor grit
        px2, py2 = gx + 0.2 + rr.random() * (w - 0.4), gy + 0.2 + rr.random() * (d - 0.4)
        q = iso(px2, py2)
        r2 = 1 + rr.randrange(3)
        d0.ellipse([q[0] - r2 * 2, q[1] - r2, q[0] + r2 * 2, q[1] + r2],
                   fill=(96 + rr.randrange(40), 86 + rr.randrange(30), 66, 190))
    dst.alpha_composite(lay0)
    # the shaft of daylight from the cut side: the only light in a dead house
    lay = Image.new('RGBA', dst.size, (0, 0, 0, 0))
    ImageDraw.Draw(lay).polygon([iso(gx + 0.2, gy + d), iso(gx + w, gy + d),
                                 iso(gx + w, gy + 1.2), iso(gx + 1.6, gy + 0.4)],
                                fill=(238, 208, 138, 54))
    dst.alpha_composite(lay.filter(ImageFilter.GaussianBlur(7)))


def screen_C(C):
    """THE SHOT: the same lane as B, but YOUR house is open. Walk through the
    door and the near walls drop to a knee — no fade, no second mode. The room
    IS the footprint (INTERIOR-MATCHES-EXTERIOR, Paolo 7/19)."""
    im = Image.new('RGBA', (W, H), (14, 12, 9, 255))
    RY0, RY1 = 15, 19
    WALKN, WALKS = RY0 - 2, RY1 + 2

    def surface(gy):
        if RY0 <= gy <= RY1:
            return ('road', C.street['street'], 1.0, 2, False)
        if WALKN <= gy < RY0 or RY1 < gy <= WALKS:
            return ('walk', C.street['side'], 1.0, 4, True)
        return ('yard', C.house['yard_deserttan'], 0.90, 6, True)

    for v in range(-4, 78):
        for u in range(-11, 12):
            if (u + v) & 1:
                continue
            gx, gy = (v + u) // 2, (v - u) // 2
            sx, sy = iso(gx, gy)
            if sx < -TW or sx > W + TW or sy < -TH or sy > H + TH:
                continue
            kind, fam, tone, sd, uni = surface(gy)
            if kind == 'road' and gy == (RY0 + RY1) // 2 and gx % 4 < 2:
                fam, sd, uni = C.street['lane_div'], 5, True
            iso_ground(im, C, fam, gx, gy, seed=sd, tone=tone, uniform=uni, texel=44)
    lay = Image.new('RGBA', im.size, (0, 0, 0, 0))
    dd = ImageDraw.Draw(lay)
    for gy in (RY0 - 0.02, RY1 + 1.02):
        pts = [iso(gx, gy) for gx in range(-6, 46)]
        dd.line([(p[0], p[1] + 3) for p in pts], fill=(34, 28, 18, 165), width=4)
        dd.line(pts, fill=(206, 196, 170, 215), width=3)
    im.alpha_composite(lay)

    plan = [
        (3,  9, 4, 4, 2.8, 'house:roof_shingle',           True,  False, 71, 'house'),
        (8,  9, 4, 4, 3.6, 'house:roof_gravel',            False, True,  77, 'store'),
        (18, 9, 4, 4, 2.7, 'house:roof_stile_graybrown',   True,  False, 87, 'house'),
        (23, 9, 4, 4, 2.9, 'house:roof_shingle',           True,  False, 90, 'house'),
        (2,  3, 4, 4, 3.4, 'house:roof_gravel',            False, True,  63, 'store'),
        (8,  3, 4, 4, 2.8, 'house:roof_shingle',           True,  False, 66, 'house'),
        (14, 3, 4, 4, 3.1, 'house:roof_stile_desertbrown', True,  False, 69, 'house'),
        (20, 3, 4, 4, 2.9, 'house:roof_shingle',           True,  False, 60, 'house'),
        (3,  21, 4, 4, 2.8, 'house:roof_stile_graybrown',  True,  False, 93, 'back'),
        (9,  21, 4, 4, 3.0, 'house:roof_shingle',          True,  False, 96, 'back'),
        (15, 21, 4, 4, 2.7, 'house:roof_stile_desertbrown', True, False, 99, 'back'),
        (21, 21, 4, 4, 3.3, 'house:roof_gravel',           False, True, 102, 'back'),
        (27, 21, 4, 4, 2.8, 'house:roof_shingle',          True,  False, 105, 'back'),
        (9,  28, 4, 4, 2.9, 'house:roof_shingle',          True,  False, 108, 'back'),
        (15, 28, 4, 4, 2.7, 'house:roof_stile_terracotta', True,  False, 111, 'back'),
        (21, 28, 4, 4, 3.1, 'house:roof_stile_graybrown',  True,  False, 114, 'back'),
        (27, 28, 4, 4, 2.8, 'house:roof_gravel',          False,  True, 117, 'back'),
    ]
    CUT = (13, 9, 5, 4, 3.0)          # YOUR house, open
    items = [(b, 'solid') for b in plan] + [(CUT + ('house:roof_stile_terracotta',
                                                    True, False, 84, 'CUT'), 'cut')]
    items.sort(key=lambda it: (it[0][0] + it[0][2]) + (it[0][1] + it[0][3]))
    for (b, mode) in items:
        gx, gy, w, d, tall = b[0], b[1], b[2], b[3], b[4]
        if mode == 'cut':
            iso_open_box(im, C, gx, gy, w, d, tall, roof=b[5], seed=b[8])
            iso_room_dressing(im, C, gx, gy, w, d, seed=b[8])
            iso_body(im, 'idle_S', gx + 3.6, gy + 3.1)      # YOU, standing in it
            continue
        roof, pitched, parapet, seed, kind = b[5], b[6], b[7], b[8], b[9]
        lf, rf = iso_box(im, C, gx, gy, w, d, tall, wall='house:wall_plain',
                         roof=roof, seed=seed, pitched=pitched, parapet=parapet)
        rnd = random.Random(seed)
        for c in range(w):
            k = 'wall_boarded' if rnd.random() < (0.8 if kind == 'store' else 0.42) else 'wall_window'
            src = C.house[k][rnd.randrange(len(C.house[k]))]
            pane = src.crop((5, 5, 39, 31))
            fr = Image.new('RGBA', (pane.width + 8, pane.height + 8), (80, 72, 56, 255))
            fr.alpha_composite(shade(pane, 0.9), (4, 4))
            band(fr, 0, 0, fr.width, 2, (208, 196, 168, 220))
            face_paste(im, fr, lf, (c + 0.16) / float(w), 0.22, 0.68, 0.52, w, tall)

    iso_drop(im, C.prop['car_wreck'][6], 14, 16, scale=1.15)
    iso_drop(im, C.prop['car_wreck'][2], 22, 18, scale=1.15)
    iso_drop(im, C.prop['car_wreck'][14], 8, 15, scale=1.15)
    iso_drop(im, C.prop['fire_barrel'][3], 11, 14, scale=0.52)
    iso_drop(im, C.lamp[2], 18, 13, scale=0.95, dark=0.9)
    iso_drop(im, C.lamp[2], 8, 13, scale=0.95, dark=0.9)
    iso_drop(im, C.lamp[2], 22, 20, scale=0.95, dark=0.9)
    iso_drop(im, C.sign[7], 20, 14, scale=0.5)
    iso_drop(im, C.desert['boulder'][11], 6, 11, scale=0.3)
    iso_drop(im, C.desert['rock'][4], 12, 20, scale=0.3)
    grunge(im)
    iso_body(im, 'walk_SE_1', 9, 14)                        # the lineman, outside
    return sun_pass(im)


CANDIDATES = [
    dict(key='A_FRONTFACE', name='A - THE FRONT FACE',
         one_line='The grid we already have, standing up.',
         blurb=('North-up, square grid - the exact grid the run walks today - but every '
                'building STANDS UP: a pitched sky-lit roof, a wall you can read, windows '
                'with sills, and a door two tiles tall with the room visible through it. '
                'Cheapest to reach: the walk, the collision and the map all stay as they are.'),
         costs='Cheapest. Only one side of a street can ever show its face.'),
    dict(key='B_ISOBLOCK', name='B - THE ISO BLOCK',
         one_line='The city-builder look, down at street level.',
         blurb=('True 3/4 isometric - the same projection as the district view you said you '
                'liked - brought down to walking distance. Every building is a real box with '
                'a lit side, a shaded side and a dressed roof, and BOTH sides of a street '
                'wear a face. The deepest-looking of the three.'),
         costs='New renderer + diamond grid. The approved car wrecks read top-down against it.'),
    dict(key='C_CUTAWAY', name='C - THE CUTAWAY',
         one_line='Same as B, but the house you are in is open.',
         blurb=('The iso world of B, except the building you walk into loses its two near '
                'walls: the room, its floor and everything in it are on screen while you are '
                'in it. No loading, no second mode, and the room is literally the same size '
                'as the house is from outside.'),
         costs='Most renderer work. Wall-hiding rules for every building type.'),
]


def write_spec():
    """THE MEASURABLE CANON. Whichever candidate Paolo picks, these are the
    numbers gates/target_screen_gate.py holds the art to."""
    spec = {
        'version': 'BOHEMIA_TARGET_SCREEN_v1',
        'built': '2026-07-26',
        'law': 'laws/BOHEMIA_ADDENDUM_ART_FIRST_RESET_7_26_26.md (TARGET SCREEN LAW)',
        'status': 'AWAITING PAOLO - he picks ONE; the winner becomes the visual constitution',
        'frame': {'art_w': W, 'art_h': H, 'poster_scale': SCALE,
                  'aspect': round(W / float(H), 4), 'note': 'iPhone portrait'},
        'proportion_canon': {
            'cell_m': 0.75, 'human_m': 1.75, 'door_cells_tall': DOOR_CELLS,
            'body_px_in_56_bake': BODY_PX,
            'head_clears_door_pct_min': 68, 'head_clears_door_pct_max': 90,
            'derivation': ('a 2-cell door is ~2.05m of opening, so a 1.75m body must clear '
                           'about 77% of it. Art that breaks this reads as dolls in a '
                           'dollhouse or giants in a shed.')},
        'projection': {'A_FRONTFACE': {'kind': 'axis-aligned oblique', 'cell_px': CELL,
                                       'shear': SHEAR, 'roof_foreshorten': ROOF_FS},
                       'B_ISOBLOCK': {'kind': '2:1 dimetric', 'tw': TW, 'th': TH, 'zh': ZH},
                       'C_CUTAWAY': {'kind': '2:1 dimetric, near walls cut', 'tw': TW,
                                     'th': TH, 'zh': ZH, 'knee_cells': 0.42}},
        'tones': {'top': TOP, 'front': FRONT, 'side': SIDE,
                  'law': 'three flat tones per volume, NO black keyline (Pocket City rule 3)'},
        'source_banks': [BANK_HOUSE, BANK_STREET, BANK_PROPS, BANK_DESERT,
                         BANK_LAMPS, BANK_SIGNS, BANK_WALLS],
        'character_source': ('the shipped alpha buildFrame()/frameToRGBA(), exported by '
                             'tools/bohemia_char_export.js'),
        'candidates': [{k: c[k] for k in ('key', 'name', 'one_line', 'costs')}
                       for c in CANDIDATES],
    }
    with open(os.path.join(OUTDIR, 'BOHEMIA_TARGET_SPEC.json'), 'w') as f:
        json.dump(spec, f, indent=1)
    return spec


JUDGE = 'slices/BOHEMIA_TARGET_SCREEN_JUDGE_7_26_26.html'
CARD_T = '''
  <div class="card">
    <div class="hd"><span class="tag">{n}</span> {name}</div>
    <div class="one">{one}</div>
    <div class="pair">
      <figure><img src="data:image/png;base64,{before}"><figcaption>NOW &mdash; the build you play</figcaption></figure>
      <figure><img src="data:image/png;base64,{shot}"><figcaption>{name}</figcaption></figure>
    </div>
    <div class="blurb">{blurb}</div>
    <div class="cost"><b>What it costs:</b> {costs}</div>
    <div class="row">
      <button class="pick" data-k="{key}">THIS IS THE ONE</button>
      <button class="no" data-k="{key}">NOT THIS</button>
    </div>
    <textarea data-note="{key}" placeholder="notes on {name} (optional)"></textarea>
  </div>'''

PAGE_HEAD = '''<meta charset="utf-8">
<title>BOHEMIA - PICK THE TARGET SCREEN</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
 :root{--bg:#0d0f0a;--ink:#e8e0cc;--dim:#9a9480;--acc:#cdbd8a;--card:#181a12;--line:#3a3a2c}
 body.sun{--bg:#efe8d4;--ink:#241f16;--dim:#5d5644;--acc:#6a5320;--card:#fdf8ea;--line:#c8bfa4}
 body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,sans-serif}
 .wrap{max-width:520px;margin:0 auto;padding:14px 12px 40px}
 h1{font:800 19px/1.25 -apple-system,sans-serif;color:var(--acc);margin:0 0 6px}
 .lede{font:12.5px/1.6 -apple-system,sans-serif;color:var(--dim);margin:0 0 16px}
 .card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:12px;margin:0 0 18px}
 .hd{font:800 15px -apple-system,sans-serif;color:var(--acc)}
 .tag{display:inline-block;background:var(--acc);color:var(--bg);border-radius:5px;padding:1px 7px;margin-right:6px}
 .one{font:600 12.5px/1.5 -apple-system,sans-serif;color:var(--ink);margin:5px 0 9px}
 .pair{display:grid;grid-template-columns:1fr 1fr;gap:7px}
 figure{margin:0}
 figure img{width:100%;display:block;border-radius:8px;image-rendering:pixelated;border:1px solid var(--line)}
 figcaption{font:10px -apple-system,sans-serif;color:var(--dim);text-align:center;margin-top:4px}
 .blurb{font:12px/1.6 -apple-system,sans-serif;color:var(--dim);margin:10px 0 6px}
 .cost{font:11.5px/1.5 -apple-system,sans-serif;color:var(--dim);margin-bottom:10px}
 .row{display:flex;gap:8px}
 button{flex:1;font:800 13px -apple-system,sans-serif;padding:12px 6px;border-radius:10px;border:1px solid var(--line);background:#20241a;color:var(--ink)}
 body.sun button{background:#eee6d0}
 button.on{background:#3f8c3f;color:#fff;border-color:#3f8c3f}
 button.no.on{background:#8c3f3f;color:#fff;border-color:#8c3f3f}
 textarea{width:100%;box-sizing:border-box;margin-top:8px;min-height:44px;background:transparent;color:var(--ink);border:1px solid var(--line);border-radius:8px;padding:7px;font:12px -apple-system,sans-serif}
 .bar{position:sticky;top:0;background:var(--bg);padding:8px 0;display:flex;gap:8px;z-index:9}
 pre{white-space:pre-wrap;font:11px ui-monospace,monospace;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px;color:var(--dim)}
</style>
<body>
<div class="wrap">
 <div class="bar">
  <button id="sun">SUN MODE</button>
  <button id="exp">EXPORT .txt</button>
 </div>
 <h1>PICK THE TARGET SCREEN</h1>
 <p class="lede">Three versions of the same street at its best, each one sitting next to the
 build you actually play right now. This is not a thumbs-up pile &mdash; <b>pick ONE</b>.
 Whichever you pick becomes the rule every future piece of art has to move the game toward,
 and a machine check gets built the same day to hold it there. Every wall, roof, window, door
 leaf, road, sidewalk, wreck, barrel, lamp and sign in all three is art you already approved.
 The person is your real character, baked by the game itself.</p>
'''

PAGE_TAIL = '''
 <div class="card">
   <div class="hd">ANYTHING ELSE</div>
   <textarea id="global" placeholder="what is wrong with all three, what is missing, what you actually want"></textarea>
 </div>
 <pre id="out">export shows up here</pre>
</div>
<script>
var V={},N={};
document.querySelectorAll('button.pick,button.no').forEach(function(b){
  b.onclick=function(){
    var k=b.dataset.k, mine=b.classList.contains('no')?'NOT':'PICK';
    if(mine==='PICK'){ document.querySelectorAll('button.pick').forEach(function(o){o.classList.remove('on');}); }
    document.querySelectorAll('button[data-k="'+k+'"]').forEach(function(o){o.classList.remove('on');});
    b.classList.add('on'); V[k]=mine;
    if(mine==='PICK'){ for(var kk in V){ if(kk!==k&&V[kk]==='PICK'){ delete V[kk]; } } }
  };
});
document.getElementById('sun').onclick=function(){document.body.classList.toggle('sun');};
document.getElementById('exp').onclick=function(){
  document.querySelectorAll('textarea[data-note]').forEach(function(t){N[t.dataset.note]=t.value;});
  var L=['=== BOHEMIA TARGET SCREEN VERDICT 7/26/26 ===',
         'law: TARGET SCREEN LAW (art-first reset). Paolo picks ONE.',''];
  ['A_FRONTFACE','B_ISOBLOCK','C_CUTAWAY'].forEach(function(k){
    L.push(k+': '+(V[k]||'(no answer)')+(N[k]?('  // '+N[k]):''));
  });
  L.push('','GLOBAL: '+(document.getElementById('global').value||'(none)'));
  var txt=L.join('\\n');
  document.getElementById('out').textContent=txt;
  var a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'}));
  a.download='BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt'; a.click();
};
</script>'''


def _b64(path_):
    return base64.b64encode(open(path_, 'rb').read()).decode()


def write_judge():
    """The judging surface. ONE tap picks the constitution; SUN MODE for
    daylight; per-candidate notes; a comment section at the bottom always;
    export as .txt (never .json) - the verdict workflow, unchanged."""
    before = _b64(os.path.join(OUTDIR, 'BEFORE_RUN.png'))
    cards = ''.join(
        CARD_T.format(n=i + 1, name=c['name'], one=c['one_line'], before=before,
                      shot=_b64(os.path.join(OUTDIR, 'BOHEMIA_TARGET_%s.png' % c['key'])),
                      blurb=c['blurb'], costs=c['costs'], key=c['key'])
        for i, c in enumerate(CANDIDATES))
    open(JUDGE, 'w').write(PAGE_HEAD + cards + PAGE_TAIL)
    return JUDGE


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    C = load_extra(Corpus())
    for name, fn in (('A_FRONTFACE', screen_A), ('B_ISOBLOCK', screen_B),
                     ('C_CUTAWAY', screen_C)):
        art = fn(C)
        art.convert('RGB').resize((W * SCALE, H * SCALE), Image.NEAREST).save(
            os.path.join(OUTDIR, 'BOHEMIA_TARGET_%s.png' % name))
        print('  ->', name)
    write_spec()
    print('  ->', write_judge())


if __name__ == '__main__':
    main()
