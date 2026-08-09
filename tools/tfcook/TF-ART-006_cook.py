#!/usr/bin/env python3
"""TF-ART-006 cook (merged with TF-WORLD-004, same asset both lanes) — DEAD
WATER: the drained pool / concrete basin family. Coping+wall WANG-16 ring,
sloped hopper floors, silted deep end with blown sand and a tumbleweed,
faded waterline ceramic band, Lake Mead bathtub ring, drain, ladder anchor,
circular clarifier, cracked-silt lakebed pan, and the standing-scum rain
puddle that collects in the hopper ONLY.

THE JOB (records/tileforms/TF-ART-006_empty_pool_basin.md merged with
records/tileforms/TF-WORLD-004_dead_water.md):
  (1) rim_<NESW combos>   WANG-16 coping+wall ring, 15 pieces (the 16th,
                          blank, IS pool_basin_0..2 from texture-match 8/1
                          and is NOT re-shipped). 45-law: the FAR (north)
                          wall shows its face — tile band, mineral ring,
                          chalked plaster; the near (south) wall shows only
                          coping. Coping 30 cm = 18 px. Ceramic waterline
                          band runs on an 11 px module (44's divisor, the
                          8/2 stamp-bug law) so grout lines wrap tile to
                          tile.
  (2) rim_N_ladder        the human-scale detail that says POOL: galvanized
                          rails over the coping, rungs down the far wall.
  (3) floor_drain         main drain on the shallow floor, mineral halo.
  (4) slope_<nesw>        hopper slope, 4 descent directions: luminance IS
                          geometry (1.00 shallow lip -> 0.80 deep lip) plus
                          faint evaporation contour lines. A flat bottom
                          reads as a tennis court; this is the fix.
  (5) deep_0..2           hopper floor at depth value: silt blotches, blown
                          sand drift (solid alpha ramps, no dither), one
                          tumbleweed collected where the wind left it.
  (6) deep_wet_0..1       RAIN state, hopper ONLY: standing scum puddle,
                          pale dried-foam rim, warm brown-grey water. NEVER
                          green, never blue — flash flood, not swamp.
  (7) silt_0..2           cracked-silt lakebed pan, self-seamless: torus
                          Voronoi mud plates, 1 px hairline cracks, lips
                          catching the upper-left light.
  (8) ring_band_0..1      the BATHTUB RING as a shore band on silt: palest
                          value present, calcium-carbonate chalk with the
                          brown-dark stain line under it (Lake Mead, 30
                          miles away).
  (9) clarifier_5x5       circular industrial treatment basin, 220 px
                          (5x5 cells), RGBA object: concrete coping ring,
                          north inner wall crescent w/ tide ring, floor
                          sloping to the centre well, parked scraper arm.

BOUNDARY STRIKE honoured: the LINED HDPE leachate pond edge is
landfill-only and belongs to TF-ART-015 — NO geomembrane is cooked here
(TF-WORLD-004's own clause). This family owns unlined pools/basins.

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE below.
    pool_basin_0..2 (PENDING PAOLO, in tolerance; the merged board form
    ORDERS this harvest: "covers the plaster floor field - extend, do not
    repaint"): HARVESTED as the canvas of every floor, slope, wall-plaster
    face and the clarifier floor. Never re-shipped as the blank. Weed-tuft
    columns are excluded by a measured green filter when scrambling (a
    drained pool floor in a dead valley holds no living weeds).
    dead_turf_0..2 (PENDING PAOLO): straw ramp HARVESTED for the tumbleweed
    — dry plant colour comes from the world's own dead grass, not a guess.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (APPROVED 7/28+7/29)
    — OPENED IN CODE below. concrete_0/concrete_1: HARVESTED as the coping
    canvas (cast-concrete coping IS the approved slab family — the form's
    anchor demand) and as deck context in every composite. dirt: HARVESTED
    as the silt-pan base canvas and the sand-drift ramp. yard_0: anchor
    context only, never edited.
  banks/BOHEMIA_HD_TILE_REPO_part4.txt x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26
    — OPENED IN CODE below: "1. Water Tiles" UP members (36 UP) are LIVING
    blue water, a lore kill for act-1 dead basins, so no pixel is harvested
    — but the ceramic waterline band's HUE is sampled off those UP tiles
    and desaturated to the world (the last colour left literally comes from
    Paolo's own bought water). Pack lists of part1..4 walked: water packs
    ("1. Water Tiles", "4. Water details and foam", "5. Water and ponds",
    "7. Water fountains and pools", "Water and liquids") are all wet living
    water; "1. Cracked contrete tiles" (42 UP) is a grey HD slab field, the
    44 px slab read is already owned by starter concrete_0/1 which IS
    harvested instead; no drained-pool, coping, tide-ring or silt family
    exists in the bought corpus.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — OPENED IN CODE (assert):
    street/wreck/trash/crate/dead/barrier/camp props. Nothing fit.
  banks/BOHEMIA_GROUND_POOL_8_6_26.txt — OPENED IN CODE (assert): 10 gravel
    tiles. Nothing fit.
  banks/BOHEMIA_PERIMETER_8_2_26.txt, banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt,
  banks/BOHEMIA_OPENINGS_8_2_26.txt — OPENED IN CODE (assert): perimeter
    walls and openings families only. Nothing fit.
  banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt — interior room surfaces (form's
    own shopping check); not opened, not a basin family.
  VERDICT: mode MIXED — every canvas (floors, slopes, faces, coping, silt
  base, sand ramp, straw ramp, band hue) is HARVESTED from Paolo-approved
  or form-ordered PENDING art; painted pixels are only the genuine gaps
  (ring geometry, band grout, mineral ring, drain, ladder, tumbleweed
  strokes, puddle, crack networks, clarifier assembly).

TASTE CHECK:
  DEAD VALLEY: no living green — weed columns filtered out of every
    harvested canvas; tumbleweed is dead-turf straw; the ONE cool hue is
    the ceramic band at sat ~0.24 (the spec: "the one desaturated blue-ish
    band, the last colour left"). green_pct and purple_pct measured per
    tile, purple kill at 2%.
  PALE AND CHALKY, NEVER SWAMP: the named wrong instinct is green water —
    the wet state is warm brown-grey scum (hue ~35), the dry state is
    chalked plaster; the bathtub ring is the palest value present, sitting
    ABOVE floor value, brown stain line under it.
  HOLE, NOT RECTANGLE: far wall face visible, near wall coping-only
    (45-law); slope reads by geometry-luminance, not baked shadow; NO
    keyline, NO dither (solid alpha ramps only), one light upper-left
    (nose of the coping bright, under-lip dark, crack lips catch on the
    upper-left side).
  8/2 STAMP BUG: ceramic band module 11 px (divisor of 44) so grout wraps;
    every repeating family ships 2-3 variants; drift/puddle/tumbleweed sit
    at rng positions per variant, never one hero feature.
  SAT DISCIPLINE: world sits near 0.19; every field is measured against
    the 8/1 tolerance (edge 14.27-31.04, grain 54.82-77.53, colours >=600)
    with a deterministic governor tuning the silt pan INTO band.
  VERIFY ON THE REAL SURFACE: 3x3 tilings, WANG ring-closure assemblies
    (3x5 pool, 1x4 channel, 1x1 pit, 2x2), a full assembled 5x11
    residential pool ON a concrete_0/1 deck beside the anchor, clarifier
    on deck, contact sheet — PNGs for eyes, not just numbers.

Deterministic: SEED fixed, rerunnable.
Writes ONLY:
  banks/tileforms/TF-ART-006_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-006/*.png
"""

import json, base64, io, os, colorsys, random

from PIL import Image, ImageDraw
import numpy as np

SEED = 80806
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
COP = 18                       # coping 30 cm at 44 px / 0.75 m
BAND = 11                      # ceramic waterline module: divisor of 44
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-006_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-006')

WANG15 = ['N', 'E', 'S', 'W', 'NE', 'NS', 'NW', 'ES', 'EW', 'SW',
          'NES', 'NEW', 'NSW', 'ESW', 'NESW']

# ---------------------------------------------------------------- bank openers
def load_texture_match(materials):
    """REUSE in code: texture-match bank tiles for the named materials."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_TEXTURE_MATCH_8_1_26.txt')))
    out = {}
    for t in d['tiles']:
        if t['material'] in materials:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
            out[t['id']] = (np.asarray(im).astype(np.float64), t['verdict'])
    return out

def load_starter(names):
    """REUSE in code: frozen approved starter tiles (canvas/anchor)."""
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

def load_water_hue():
    """REUSE in code: the ceramic band hue is sampled off Paolo's own bought
    UP water tiles (HD part4 x ACT1 confirmed), then desaturated to the
    world. No wet pixel ships — only the hue survives, like the water."""
    hd = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_HD_TILE_REPO_part4.txt')))
    v = json.load(open(os.path.join(ROOT, 'banks',
                                    'BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))['verdicts']
    ups = [r['idx'] for r in v if r['pack'] == '1. Water Tiles' and r['v'] == 'UP']
    assert len(ups) >= 20, len(ups)
    px = []
    for i in ups[:8]:
        e = hd['packs']['1. Water Tiles'][i]
        a = np.asarray(Image.open(io.BytesIO(base64.b64decode(e['b64'])))
                       .convert('RGBA')).astype(np.float64)
        vis = a[a[..., 3] > 128][:, :3]
        px.append(vis)
    p = np.concatenate(px)
    hsv = np.array([colorsys.rgb_to_hsv(*(c / 255.0)) for c in
                    p[np.random.default_rng(SEED).integers(0, len(p), 4000)]])
    hue = float(np.median(hsv[:, 0]))
    assert 0.5 < hue < 0.65, hue          # his water is cyan-blue
    return hue

def assert_pools_checked():
    """Shopping sweep, honoured in code: banks that were checked and did not
    fit — opened so the claim is machine-true, harvested nothing."""
    ext = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')))
    assert set(ext['counts']) == {'street', 'wreck', 'trash', 'crate', 'dead',
                                  'barrier', 'camp'}, ext['counts']
    gp = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_GROUND_POOL_8_6_26.txt')))
    assert list(gp['counts']) == ['gravel'], gp['counts']
    for b in ('BOHEMIA_PERIMETER_8_2_26.txt', 'BOHEMIA_CIVIC_OPENINGS_8_3_26.txt',
              'BOHEMIA_OPENINGS_8_2_26.txt'):
        d = json.load(open(os.path.join(ROOT, 'banks', b)))
        assert 'tiles' in d, b                # wall/opening families, no basin

# ---------------------------------------------------------------- helpers
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]

def desat(a, k):
    g = lum(a)[..., None]
    return g + (a - g) * k

def torus_blur(n, k=5, passes=2):
    for _ in range(passes):
        for ax in (0, 1):
            m = np.zeros_like(n)
            for d in range(-(k // 2), k // 2 + 1):
                m += np.roll(n, d, axis=ax)
            n = m / k
    return n

def torus_noise(rg, size, k=5, passes=2):
    n = torus_blur(rg.standard_normal((size, size)), k, passes)
    return (n - n.min()) / (n.max() - n.min() + 1e-9)

def col_has_green(col):
    """Weed-tuft detector: living green at donor saturation."""
    c = col / 255.0
    mx, mn = c.max(axis=1), c.min(axis=1)
    s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-9), 0)
    r, g, b = c[:, 0], c[:, 1], c[:, 2]
    green = (g > r * 1.12) & (g > b * 1.12) & (s > 0.28) & (mx > 0.25)
    return bool(green.any())

def scrambled(donors, seed, runs=(3, 7), green_filter=True):
    """Variant synthesis off harvested canvases: real donor COLUMNS in short
    runs with circular rolls (the ART-002/005 pattern) — donor grain, donor
    colours, wrap preserved. green_filter drops weed-tuft columns (dead
    valley: a drained basin holds no living plants)."""
    rng = random.Random(seed)
    cols, x = [], 0
    while x < CELL:
        d = donors[rng.randrange(len(donors))]
        run = min(rng.randrange(*runs), CELL - x)
        ok, tries = False, 0
        while not ok:
            sx = rng.randrange(d.shape[1] - run + 1)
            roll = rng.randrange(d.shape[0])
            ok = not (green_filter and any(
                col_has_green(np.roll(d[:, sx + k], roll, axis=0))
                for k in range(run)))
            tries += 1
            if tries > 24:                      # fall back to donor 0 (clean)
                d = donors[0]
        for k in range(run):
            cols.append(np.roll(d[:, sx + k], roll, axis=0))
        x += run
    tex = np.stack(cols, axis=1).astype(np.float64)
    sm = (np.roll(tex, 1, axis=1) + tex + np.roll(tex, -1, axis=1)) / 3.0
    return tex * 0.72 + sm * 0.28

def hairline(t, rg, n=2, dark=0.78):
    """1 px spider cracks, torus random-walk so seamless families stay
    seamless. Upper-left lip catch: the pixel up-left of the crack +6."""
    h, w = t.shape[:2]
    for _ in range(n):
        y, x = int(rg.integers(0, h)), int(rg.integers(0, w))
        horiz = rg.random() < 0.5
        for _ in range(int(rg.integers(26, 44))):
            t[y % h, x % w] *= dark
            ly, lx = (y - 1) % h, (x - 1) % w
            t[ly, lx] = np.clip(t[ly, lx] + 6, 0, 255)
            if horiz:
                x += 1
                y += int(rg.integers(-1, 2))
            else:
                y += 1
                x += int(rg.integers(-1, 2))
    return t

# ---------------------------------------------------------------- metrics
def measure(tile, alpha=None):
    a = tile.astype(np.float64)
    if alpha is None:
        vis = np.ones(a.shape[:2], bool)
    else:
        vis = alpha > 128
    L = lum(a)
    colours = len(np.unique(a[vis].reshape(-1, 3).astype(np.uint8), axis=0))
    d = np.abs(np.diff(L, axis=1))
    pair = vis[:, 1:] & vis[:, :-1]
    edge = float(d[pair].mean()) if pair.any() else 0.0
    grain = float((d[pair] > 8).mean() * 100) if pair.any() else 0.0
    flat = a[vis].reshape(-1, 3) / 255.0
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in flat])
    sat = float(hsv[:, 1].mean())
    hue = hsv[:, 0] * 360
    purple = float(((hue >= 260) & (hue <= 320) & (hsv[:, 1] > 0.15)).mean() * 100)
    green = float(((hue >= 70) & (hue <= 170) & (hsv[:, 1] > 0.25)
                   & (hsv[:, 2] > 0.25)).mean() * 100)
    m = dict(colours=colours, edge=round(edge, 3), grain=round(grain, 3),
             sat=round(sat, 3), lum_mean=round(float(L[vis].mean()), 3),
             lum_sd=round(float(L[vis].std()), 3),
             purple_pct=round(purple, 3), green_pct=round(green, 3))
    if alpha is None:
        m.update(hwrap=round(float(np.abs(L[:, 0] - L[:, -1]).mean()), 3),
                 vwrap=round(float(np.abs(L[0, :] - L[-1, :]).mean()), 3),
                 edge_darkening=round(float(min(L.mean(axis=0)[0], L.mean(axis=0)[-1])
                                            - L.mean(axis=0)[10:-10].mean()), 3))
    return m

def in_tolerance(m):
    return (m['colours'] >= 600 and 14.2733 <= m['edge'] <= 31.0407 and
            54.8203 <= m['grain'] <= 77.5264 and 0.0358 <= m['sat'] <= 0.5228 and
            45.8207 <= m['lum_mean'] <= 121.4371 and 5.365 <= m['lum_sd'] <= 60.5444)

def run_seam(tiles_row):
    strip = np.concatenate(tiles_row, axis=1)
    L = lum(strip.astype(np.float64))
    W = tiles_row[0].shape[1]
    steps = np.abs(np.diff(L, axis=1))
    j_cols = [k * W - 1 for k in range(1, len(tiles_row))]
    j = float(np.mean([steps[:, c].mean() for c in j_cols]))
    internal = float(np.delete(steps, j_cols, axis=1).mean())
    return round(j, 3), round(internal, 3)

# ---------------------------------------------------------------- proofs
def png_b64(arr, alpha=None):
    if alpha is not None:
        rgba = np.dstack([arr, alpha]).astype(np.uint8)
        im = Image.fromarray(rgba, 'RGBA')
    else:
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
    cw = CELL * scale + pad
    chh = CELL * scale + label_h + pad
    rows = (len(entries) + cols - 1) // cols
    im = Image.new('RGB', (cols * cw + pad, rows * chh + pad), bg)
    dr = ImageDraw.Draw(im)
    for i, (lab, a) in enumerate(entries):
        x = pad + (i % cols) * cw
        y = pad + (i // cols) * chh
        t = Image.fromarray(a.astype(np.uint8), 'RGB').resize(
            (CELL * scale, CELL * scale), Image.NEAREST)
        im.paste(t, (x, y))
        dr.text((x, y + CELL * scale + 2), lab[:22], fill=(225, 225, 225))
    return im

# ---------------------------------------------------------------- painters
class Palettes:
    pass

def make_band_colours(hue):
    """Faded ceramic waterline: bought-water hue, world saturation, chalked."""
    out = []
    for v in (0.50, 0.44, 0.39):               # three fired-glaze values
        r, g, b = colorsys.hsv_to_rgb(hue, 0.24, v)
        out.append(np.array([r, g, b]) * 255)
    grout = np.array([74.0, 76.0, 74.0])
    return out, grout

RING_PALE = np.array([206.0, 198.0, 180.0])    # calcium carbonate chalk
RING_STAIN = np.array([106.0, 84.0, 60.0])     # the brown-dark dry stain
LADDER_HI = np.array([176.0, 178.0, 180.0])    # galvanized, sky-lit
LADDER_LO = np.array([108.0, 111.0, 115.0])
RUST = np.array([116.0, 88.0, 66.0])

def face_bands(t, P, rg, y0, y1, x0=0, x1=CELL):
    """The far-wall face between y0..y1: ceramic band, mineral ring, chalked
    plaster with drip streaks. Heights scale to the space available."""
    span = y1 - y0
    hb = max(3, round(span * 8 / 18))
    hr = max(2, round(span * 3 / 18))
    # ceramic band: 11px module, grout wraps tile to tile; ~8% chipped
    for x in range(x0, x1):
        seg = (x // BAND) % 4
        col = P.band_cols[int(P.band_pick[seg])]
        for y in range(y0, y0 + hb):
            if x % BAND == 0:
                t[y, x] = P.grout
            elif (y - y0) in (0, hb - 1):
                t[y, x] = col * 0.82
            else:
                t[y, x] = col * (1.0 if (x % BAND) < 6 else 0.94)
    for seg in range(4):                        # chipped segments -> plaster
        if P.band_chip[seg]:
            xs, xe = max(x0, seg * BAND + 1), min(x1, (seg + 1) * BAND)
            if xs < xe:
                t[y0:y0 + hb, xs:xe] = P.plaster[y0:y0 + hb, xs:xe] * 0.74
    # bathtub ring: palest value present, wavy bottom, brown stain line under
    wob = (torus_noise(rg, CELL, 7) * 2).astype(int)
    for x in range(x0, x1):
        yr0 = y0 + hb
        yr1 = min(y1, yr0 + hr + wob[0, x % CELL] - 1)
        for y in range(yr0, max(yr0 + 1, yr1)):
            n = 0.9 + 0.1 * ((x * 7 + y * 3) % 5) / 4
            t[y, x] = RING_PALE * n
        if yr1 < y1:
            t[yr1, x] = t[yr1, x] * 0.45 + RING_STAIN * 0.55
    # chalked plaster below, darker toward the floor (geometry, not shadow)
    yp0 = y0 + hb + hr + 1
    for y in range(yp0, y1):
        f = 0.74 - 0.10 * (y - yp0) / max(1, y1 - yp0)
        t[y, x0:x1] = P.plaster[y, x0:x1] * f
    # mineral drip streaks off the ring
    for dx in P.drips:
        x = x0 + dx % max(1, (x1 - x0))
        for y in range(yp0, min(y1, yp0 + 4)):
            t[y, x] = t[y, x] * 0.55 + RING_PALE * 0.45 * (1 - (y - yp0) * 0.2)
    return t

def rim_tile(combo, P, rg):
    """One WANG-16 coping+wall piece. Bits = which tile edges carry the rim
    (pool boundary), interior of the pool on this tile."""
    t = P.floor.copy()
    has = set(combo)
    # far-wall face under a north rim
    if 'N' in has:
        y1 = (CELL - COP) if 'S' in has else 36
        face_bands(t, P, rg, COP, y1)
        if 'S' not in has:
            t[36, :] *= 0.60                     # crease where face meets floor
    # cove where the floor runs under the hidden near wall
    if 'S' in has:
        ys = CELL - COP
        t[ys - 2, :] *= 0.85
        t[ys - 1, :] *= 0.70
    # side-wall slivers (edge-on faces: thin value steps, no keyline)
    if 'E' in has:
        for i, f in ((3, 0.90), (2, 0.78), (1, 0.62)):
            t[:, CELL - COP - i] *= f
    if 'W' in has:
        for i, f in ((3, 0.90), (2, 0.78), (1, 0.62)):
            t[:, COP + i - 1] *= f
    # coping mask: union band along each rimmed edge
    m = np.zeros((CELL, CELL), bool)
    if 'N' in has: m[:COP, :] = True
    if 'S' in has: m[CELL - COP:, :] = True
    if 'W' in has: m[:, :COP] = True
    if 'E' in has: m[:, CELL - COP:] = True
    t[m] = P.coping[m]
    # nose (bright) + under-lip (dark): the one light, upper-left
    pad = np.pad(m, 1, constant_values=True)
    inner = m & ~(pad[1:-1, 1:-1] & pad[:-2, 1:-1] & pad[2:, 1:-1]
                  & pad[1:-1, :-2] & pad[1:-1, 2:])
    t[inner] *= 0.62
    pad2 = np.pad(m & ~inner, 1, constant_values=True)
    m2 = m & ~inner
    nose = m2 & ~(pad2[1:-1, 1:-1] & pad2[:-2, 1:-1] & pad2[2:, 1:-1]
                  & pad2[1:-1, :-2] & pad2[1:-1, 2:])
    t[nose] = np.clip(t[nose] * 1.10, 0, 255)
    return np.clip(t, 0, 255)

def add_ladder(t):
    """Galvanized ladder on the far wall: rails hook over the coping, rungs
    down the face — the human-scale anchor. Left edge of each rail lit."""
    for xr in (9, 33):
        for y in range(3, 41):
            f = 1.0 - 0.35 * (y / 41)
            t[y, xr] = LADDER_HI * f
            t[y, xr + 1] = LADDER_LO * f
        t[2, xr - 1:xr + 2] = LADDER_HI          # hook over the coping
        t[41, xr:xr + 2] = LADDER_LO * 0.7       # anchor foot
    for yr in (21, 28, 35):
        t[yr, 11:33] = LADDER_LO * (1.0 - 0.2 * (yr - 21) / 14)
        t[yr - 1, 11:33] = np.clip(t[yr - 1, 11:33] * 1.05, 0, 255)
    return t

def drain_tile(P, rg):
    t = P.floor.copy()
    cx, cy, rx, ry = 22, 24, 6, 4                # 45-law: ellipse cross-section
    yy, xx = np.mgrid[0:CELL, 0:CELL]
    d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    halo = (d > 1.0) & (d <= 1.9)
    t[halo] = t[halo] * 0.55 + RING_PALE * 0.45  # mineral halo, palest wash
    ringm = (d > 0.62) & (d <= 1.0)
    t[ringm] = RUST * 0.9
    top = ringm & (yy < cy)
    t[top] = np.clip(RUST * 1.25, 0, 255)        # upper-left catches light
    inner = d <= 0.62
    t[inner] = np.array([58.0, 55.0, 50.0])
    for sy in (23, 25):                          # grate slits
        row = inner[sy]
        t[sy, row] = np.array([38.0, 36.0, 33.0])
    return np.clip(hairline(t, rg, 1), 0, 255)

def slope_tile(P, rg, direction):
    """Descent toward `direction`: shallow lip 1.00 -> deep lip 0.80.
    Luminance IS the geometry. Faint evaporation contours cross the fall."""
    t = P.slope_canvas.copy()
    g = 1.0 - 0.20 * (np.arange(CELL) + 0.5) / CELL
    if direction == 's':
        t *= g[:, None, None]
        axis_wrap = 'h'
    elif direction == 'n':
        t *= g[::-1][:, None, None]
        axis_wrap = 'h'
    elif direction == 'e':
        t *= g[None, :, None]
        axis_wrap = 'v'
    else:
        t *= g[::-1][None, :, None]
        axis_wrap = 'v'
    wob = (torus_noise(rg, CELL, 9) * 3).astype(int)
    for frac in (0.34, 0.68):                    # stillstand tide contours
        k = int(CELL * frac)
        for i in range(CELL):
            if direction in ('s', 'n'):
                y = (k + wob[0, i] - 1) % CELL
                if direction == 'n':
                    y = CELL - 1 - y
                t[y, i] = t[y, i] * 0.72 + RING_PALE * 0.28
                t[(y + 1) % CELL, i] = t[(y + 1) % CELL, i] * 0.85 + RING_STAIN * 0.15
            else:
                x = (k + wob[i, 0] - 1) % CELL
                if direction == 'w':
                    x = CELL - 1 - x
                t[i, x] = t[i, x] * 0.72 + RING_PALE * 0.28
                t[i, (x + 1) % CELL] = t[i, (x + 1) % CELL] * 0.85 + RING_STAIN * 0.15
    t = hairline(t, rg, 2)
    return np.clip(t, 0, 255), axis_wrap

def tumbleweed(t, rg, cx, cy):
    """Dead-turf straw ball, 45-law: ellipse, sky-lit top, open weave."""
    straw = P_STRAW
    for _ in range(52):
        a0 = rg.uniform(0, 2 * np.pi)
        rr = rg.uniform(2.0, 6.5)
        x = cx + rr * 1.15 * np.cos(a0)
        y = cy + rr * 0.85 * np.sin(a0)
        if not (0 <= int(y) < CELL and 0 <= int(x) < CELL):
            continue
        litf = 1.18 if (np.cos(a0) < 0 and np.sin(a0) < 0) else 0.82
        c = straw[int(rg.integers(0, len(straw)))] * litf
        t[int(y), int(x)] = np.clip(c, 0, 255)
        if rg.random() < 0.5:
            x2, y2 = int(x + rg.integers(-1, 2)), int(y + rg.integers(-1, 2))
            if 0 <= y2 < CELL and 0 <= x2 < CELL:
                t[y2, x2] = np.clip(c * 0.92, 0, 255)
    return t

def deep_tile(P, rg, kind):
    t = P.deep_canvas.copy()
    n = torus_noise(rg, CELL, 7)
    silt = n > 0.62                              # silt blotches, darker, matte
    t[silt] = t[silt] * 0.86 + np.array([96.0, 88.0, 74.0]) * 0.14
    if kind in (1, 2):                           # blown sand drift: solid ramps
        dn = torus_noise(rg, CELL, 9)
        gx = (np.arange(CELL) / CELL)[None, :]
        gy = (np.arange(CELL) / CELL)[:, None]
        field = dn * 0.6 + (gx * 0.55 + gy * 0.45) * (0.75 if kind == 1 else 0.5)
        for th, mixk in ((0.72, 0.55), (0.82, 0.85)):
            m = field > th
            t[m] = t[m] * (1 - mixk) + P.sand[None, :] * mixk
    if kind == 2:
        t = tumbleweed(t, rg, 14 + int(rg.integers(0, 14)),
                       16 + int(rg.integers(0, 10)))
    t = hairline(t, rg, 2)
    return np.clip(t, 0, 255)

def wet_tile(P, rg):
    """RAIN state, hopper only: standing scum puddle. Warm brown-grey,
    dried-foam pale rim. Never green, never blue."""
    t = P.deep_canvas.copy()
    n = torus_noise(rg, CELL, 9)
    yy, xx = np.mgrid[0:CELL, 0:CELL]
    bowl = ((xx - 22) / 19.0) ** 2 + ((yy - 26) / 14.0) ** 2
    field = bowl + (n - 0.5) * 0.55
    pud = field < 0.85
    edge_ring = (field >= 0.85) & (field < 1.02)
    scum = np.array([171.0, 158.0, 128.0])       # dried foam line
    t[edge_ring] = t[edge_ring] * 0.45 + scum * 0.55
    depth = np.clip((0.85 - field) / 0.85, 0, 1)
    wat = np.array([64.0, 56.0, 44.0])
    for c in range(3):
        ch = t[..., c]
        ch[pud] = (ch[pud] * 0.25 + wat[c] * 0.75) * (1.0 - 0.25 * depth[pud])
    rim_in = pud & (field > 0.70)
    t[rim_in] *= 0.82                            # wet darkening at the meniscus
    t = hairline(t, rg, 1)
    return np.clip(t, 0, 255)

def silt_tile(P, rg, seed):
    """Cracked-silt lakebed pan, self-seamless: torus Voronoi mud plates."""
    base = scrambled(P.dirt_donors, seed, green_filter=True)
    g = lum(base)[..., None]
    chalk = g + (base - g) * 0.42                # desaturate toward chalk
    t = np.clip(chalk * 0.92 + 34, 0, 255)       # pale grey-tan
    pts = np.stack([rg.integers(0, CELL, 14), rg.integers(0, CELL, 14)], 1)
    yy, xx = np.mgrid[0:CELL, 0:CELL]
    dy = np.abs(yy[..., None] - pts[:, 0])
    dy = np.minimum(dy, CELL - dy)
    dx = np.abs(xx[..., None] - pts[:, 1])
    dx = np.minimum(dx, CELL - dx)
    dist = np.sqrt(dy ** 2 + dx ** 2)
    srt = np.sort(dist, axis=2)
    crack = (srt[..., 1] - srt[..., 0]) < 0.9    # plate boundaries
    dome = np.clip(srt[..., 0] / 7.0, 0, 1)
    t *= (1.06 - 0.12 * dome)[..., None]         # plates dome up, dip at edges
    t[crack] *= 0.66
    lip = np.roll(crack, (-1, -1), (0, 1)) & ~crack
    t[lip] = np.clip(t[lip] * 1.09, 0, 255)      # upper-left lip catch
    # deterministic governor: tune INTO the bought-tile tolerance band
    for _ in range(8):
        m = measure(np.clip(t, 0, 255))
        if 54.8203 <= m['grain'] <= 77.5264 and m['edge'] <= 31.0407:
            break
        mean = t.mean()
        if m['grain'] < 54.8203 or m['edge'] < 14.2733:
            t = np.clip((t - mean) * 1.13 + mean, 0, 255)
        else:
            t = t * 0.7 + torus_blur(t.transpose(2, 0, 1), 3, 1
                                     ).transpose(1, 2, 0) * 0.3
    return np.clip(t, 0, 255)

def ring_band_tile(P, rg, seed):
    """The BATHTUB RING as a shore band on silt: palest value present,
    successive stillstand lines, brown stain under. Wraps horizontally."""
    t = silt_tile(P, rg, seed)
    wob = (torus_noise(rg, CELL, 9) * 4).astype(int)
    y0, y1 = 13, 30
    for x in range(CELL):
        a = y0 + wob[0, x] - 2
        b = y1 + wob[1, x] - 2
        for y in range(a, b):
            n = 0.88 + 0.12 * ((x * 5 + y * 7) % 7) / 6
            t[y % CELL, x] = t[y % CELL, x] * 0.28 + RING_PALE * n * 0.72
        for k, f in ((0, 0.62), (1, 0.80)):      # brown stain under the ring
            t[(b + k) % CELL, x] = t[(b + k) % CELL, x] * f \
                + RING_STAIN * (1 - f) * 1.2
        t[(a - 1) % CELL, x] = t[(a - 1) % CELL, x] * 0.75 + RING_PALE * 0.25
        inner = a + 4 + (wob[2, x] // 2)         # one stillstand line inside
        if inner < b - 1:
            t[inner % CELL, x] = t[inner % CELL, x] * 0.6 \
                + RING_STAIN * 0.25 + RING_PALE * 0.15 * 0
    return np.clip(t, 0, 255)

def clarifier(P, rg):
    """Circular treatment basin, 5x5 cells, RGBA object. 45-law: ellipse,
    far inner wall crescent visible, floor slopes to the centre well,
    scraper arm parked where the power died."""
    S = CELL * 5
    cx, cy = S / 2, S / 2 - 4
    rx, ry = 106.0, 92.0
    yy, xx = np.mgrid[0:S, 0:S].astype(float)
    e_out = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    rx2, ry2 = rx - 13, ry - 12
    e_in = ((xx - cx) / rx2) ** 2 + ((yy - cy) / ry2) ** 2
    drop = 13
    e_in_s = ((xx - cx) / rx2) ** 2 + ((yy - cy - drop) / ry2) ** 2
    t = np.zeros((S, S, 3))
    alpha = np.zeros((S, S))
    conc = np.concatenate([np.concatenate([P.coping_big[(i + j) % 3]
                                           for j in range(5)], axis=1)
                           for i in range(5)], axis=0)
    plas = np.concatenate([np.concatenate([P.floor_big[(i * 2 + j) % 3]
                                           for j in range(5)], axis=1)
                           for i in range(5)], axis=0)
    ringm = (e_out <= 1.0) & (e_in > 1.0)
    t[ringm] = conc[ringm]
    alpha[ringm] = 255
    facem = (e_in <= 1.0) & (e_in_s > 1.0)       # north inner wall crescent
    fdep = np.clip((yy - (cy - ry2)) / drop, 0, 1)
    t[facem] = (plas[facem] * (0.74 - 0.12 * fdep[facem, None]))
    band = facem & (e_in > 0.86)                 # tide ring high on the wall
    t[band] = t[band] * 0.4 + RING_PALE * 0.6
    alpha[facem] = 255
    floorm = e_in_s <= 1.0
    rad = np.sqrt(e_in_s)
    slopef = 1.0 - 0.22 * (1.0 - np.clip(rad, 0, 1))
    t[floorm] = plas[floorm] * slopef[floorm, None]
    alpha[floorm] = 255
    for rr in (0.62, 0.38):                      # evaporation rings on floor
        rim = floorm & (np.abs(rad - rr) < 0.018)
        t[rim] = t[rim] * 0.62 + RING_PALE * 0.38
    wellm = (((xx - cx) / 10.0) ** 2 + ((yy - cy - drop) / 8.0) ** 2) <= 1.0
    t[wellm] = np.array([52.0, 50.0, 46.0])
    # parked scraper arm: centre to rim, rusted, top edge lit
    ang = np.deg2rad(207)
    for rstep in range(0, int(rx2) - 2):
        x = int(cx + rstep * np.cos(ang))
        y = int(cy + drop + rstep * np.sin(ang) * (ry2 / rx2))
        if 0 <= y < S - 1 and 0 <= x < S:
            t[y, x] = RUST * (1.0 - 0.25 * rstep / rx2)
            t[y + 1, x] = RUST * 0.62
    # centre pier: small stub, sky-lit top, south face darker
    t[int(cy + drop) - 8:int(cy + drop) - 4, int(cx) - 3:int(cx) + 3] = \
        np.array([150.0, 146.0, 138.0])
    t[int(cy + drop) - 4:int(cy + drop) + 1, int(cx) - 3:int(cx) + 3] = \
        np.array([98.0, 95.0, 90.0])
    # coping nose/lip on both ring boundaries (value steps, no keyline)
    outer_edge = ringm & (e_out > 0.94)
    t[outer_edge] = np.clip(t[outer_edge] * 1.08, 0, 255)
    inner_edge = ringm & (e_in < 1.09)
    t[inner_edge] *= 0.62
    return np.clip(t, 0, 255), alpha.astype(np.uint8)

# ---------------------------------------------------------------- main
P_STRAW = None

def main():
    global P_STRAW
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)
    assert_pools_checked()

    tm = load_texture_match({'pool_basin', 'dead_turf'})
    for i in range(3):
        assert tm[f'pool_basin_{i}'][1] == 'PENDING PAOLO'
    pb = [tm[f'pool_basin_{i}'][0] for i in range(3)]
    turf = [tm[f'dead_turf_{i}'][0] for i in range(3)]
    st = load_starter(['concrete_0', 'concrete_1', 'dirt', 'yard_0'])
    hue = load_water_hue()
    print('bought-water hue harvested:', round(hue * 360, 1), 'deg')

    # straw ramp for the tumbleweed, off dead turf's own pale members
    tp = np.concatenate([x.reshape(-1, 3) for x in turf])
    warm = tp[(lum(tp) > 104) & (tp[:, 0] > tp[:, 2])]
    P_STRAW = desat(np.unique(warm.astype(np.uint8), axis=0).astype(np.float64), 0.8)
    P_STRAW = P_STRAW[np.argsort(lum(P_STRAW))][-40:]

    rg = np.random.default_rng(SEED)

    class P: pass
    P.floor = scrambled(pb, SEED + 1)
    P.plaster = scrambled(pb, SEED + 2)
    P.slope_canvas = scrambled(pb, SEED + 3)
    P.deep_canvas = np.clip(scrambled(pb, SEED + 4) * 0.80, 0, 255)
    # coping: approved slab family, sun-struck; concrete_1's chasm crack
    # filtered out (a coping ring is cast in short segments, not one slab)
    cop_donors = [st['concrete_0'],
                  np.where(lum(st['concrete_1'])[..., None] < 30,
                           st['concrete_0'], st['concrete_1'])]
    P.coping = np.clip(desat(scrambled(cop_donors, SEED + 5), 0.85) * 1.08, 0, 255)
    P.coping_big = [np.clip(desat(scrambled(cop_donors, SEED + 6 + i), 0.85)
                            * 1.08, 0, 255) for i in range(3)]
    P.floor_big = [scrambled(pb, SEED + 9 + i) for i in range(3)]
    P.dirt_donors = [st['dirt']]
    dp = st['dirt'].reshape(-1, 3)
    P.sand = np.clip(desat(dp[lum(dp) > np.quantile(lum(dp), 0.7)].mean(axis=0)
                           [None, :], 0.6) * 1.18, 0, 255)[0]
    P.band_cols, P.grout = make_band_colours(hue)
    P.band_pick = rg.integers(0, 3, 4)
    P.band_chip = rg.random(4) < 0.10
    P.drips = [int(x) for x in rg.integers(0, CELL, 3)]

    tiles = []
    def bank_tile(name, arr, kind, harvested, alpha=None, px=CELL, extra=None):
        m = measure(arr, alpha)
        e = dict(name=name, px=px, b64=png_b64(arr, alpha), metrics=m,
                 kind=kind, harvested_from=harvested,
                 in_tolerance=bool(in_tolerance(m)) if alpha is None else None)
        if extra:
            e.update(extra)
        tiles.append(e)
        return arr

    rims = {}
    for combo in WANG15:
        rims[combo] = bank_tile(
            f'rim_{combo}', rim_tile(combo, P, rg),
            'WANG-16 coping+wall rim piece (blank 16th = pool_basin_0..2, '
            'not re-shipped)',
            'floor/plaster: pool_basin scramble (texture-match 8/1, harvest '
            'ordered); coping: starter concrete_0/1 (APPROVED); band hue: '
            'bought UP water tiles',
            extra={'wang': combo, 'layer': 'ground+structure',
                   'solid': 'wall face yes, floor no'})
    rims['N_ladder'] = bank_tile(
        'rim_N_ladder', add_ladder(rim_tile('N', P, rg)),
        'rim_N + galvanized ladder (the human-scale detail that says pool)',
        'as rim_N; ladder painted', extra={'wang': 'N', 'layer': 'ground+structure',
                                           'solid': 'wall face yes, floor no'})
    bank_tile('floor_drain', drain_tile(P, rg),
              'main drain on shallow floor, mineral halo',
              'floor: pool_basin scramble; drain painted',
              extra={'layer': 'ground', 'solid': False})
    slopes = {}
    for d in 'nesw':
        arr, _ = slope_tile(P, rg, d)
        slopes[d] = bank_tile(
            f'slope_{d}', arr,
            f'hopper slope, descends {d.upper()}: shallow lip 1.00 -> deep '
            'lip 0.80, luminance is geometry',
            'pool_basin scramble canvas + tide contours painted',
            extra={'layer': 'ground', 'solid': False,
                   'edge_note': 'shallow lip mates pool_basin_*, deep lip mates deep_*'})
    deeps = {}
    for k in range(3):
        deeps[k] = bank_tile(
            f'deep_{k}', deep_tile(P, rg, k),
            'hopper floor at depth value (0.80): silt' +
            (', sand drift' if k else '') + (', tumbleweed' if k == 2 else ''),
            'pool_basin scramble x0.80; sand ramp off starter dirt; straw '
            'off dead_turf',
            extra={'layer': 'ground', 'solid': False})
    wets = {}
    for k in range(2):
        wets[k] = bank_tile(
            f'deep_wet_{k}', wet_tile(P, rg),
            'RAIN state, hopper ONLY: standing scum puddle, dried-foam rim',
            'pool_basin scramble x0.80; puddle painted (warm brown-grey, '
            'never green)',
            extra={'layer': 'ground', 'solid': False, 'weather': 'rain'})
    silts = {}
    for k in range(3):
        silts[k] = bank_tile(
            f'silt_{k}', silt_tile(P, rg, SEED + 20 + k),
            'cracked-silt lakebed pan, self-seamless',
            'starter dirt scramble, chalked; crack net painted',
            extra={'layer': 'ground', 'solid': False})
    ringb = {}
    for k in range(2):
        ringb[k] = bank_tile(
            f'ring_band_0{k}'.replace('00', '0').replace('01', '1'),
            ring_band_tile(P, rg, SEED + 30 + k),
            'bathtub-ring shore band on silt (palest value present, brown '
            'stain under) — wraps horizontally, rotate at placement',
            'silt base as silt_*; mineral band painted',
            extra={'layer': 'ground', 'solid': False})
    cl_rgb, cl_a = clarifier(P, rg)
    bank_tile('clarifier_5x5', cl_rgb,
              'circular treatment basin / clarifier, 5x5 cells, RGBA object',
              'coping: starter concrete scrambles; floor/wall: pool_basin '
              'scrambles; arm/pier painted',
              alpha=cl_a, px=CELL * 5,
              extra={'layer': 'ground+structure', 'solid': 'ring yes, floor no'})

    # ------------------------------------------------------------ seam battery
    seam = {}
    for fam, arrs in (('silt', [silts[k] for k in range(3)]),
                      ('deep', [deeps[k] for k in range(3)])):
        rr = random.Random(SEED + 40)
        row = [arrs[rr.randrange(3)] for _ in range(10)]
        j, internal = run_seam(row)
        ws = [(t['metrics']['hwrap'], t['metrics']['vwrap'])
              for t in tiles if t['name'].startswith(fam)]
        seam[fam] = dict(junction=j, internal=internal,
                         wrap_max=round(max(max(w) for w in ws), 3),
                         edge_darkening_worst=round(min(
                             t['metrics']['edge_darkening'] for t in tiles
                             if t['name'].startswith(fam)), 3))
    j, internal = run_seam([deeps[0], pb[0], silts[0] * 0 + pb[1]][:2])
    seam['deep_vs_pool_basin_donor'] = dict(junction=j, internal=internal)
    j, internal = run_seam([pb[0], pb[1]])
    seam['donor_vs_donor_reference'] = dict(junction=j, internal=internal)
    # coping continuity along a rim run (the ring contract)
    row = [rims['NW'], rims['N'], rims['N_ladder'], rims['N'], rims['NE']]
    strip = np.concatenate(row, axis=1)
    Lc = lum(strip[:COP - 2])                    # inside the coping band
    steps = np.abs(np.diff(Lc, axis=1))
    jc = [k * CELL - 1 for k in range(1, 5)]
    seam['coping_run'] = dict(
        junction=round(float(np.mean([steps[:, c].mean() for c in jc])), 3),
        internal=round(float(np.delete(steps, jc, axis=1).mean()), 3))

    # ------------------------------------------------------------ proofs
    def three_by_three(arrs, name):
        rr = random.Random(SEED + 50)
        save(grid([[arrs[rr.randrange(len(arrs))] for _ in range(3)]
                   for _ in range(3)]), name, 2)
    three_by_three([silts[k] for k in range(3)], 'SILT_3x3.png')
    three_by_three([deeps[k] for k in range(3)], 'DEEP_3x3.png')
    save(grid([[ringb[0], ringb[1], ringb[0]]]), 'RING_BAND_STRIP.png', 3)

    deck = lambda i, j: st['concrete_0'] if (i * 3 + j) % 2 else st['concrete_1']

    def assemble(w, h, fill):
        """Ring of rim pieces closing a w x h basin, on a concrete deck."""
        cells = []
        for i in range(h + 2):
            rowt = []
            for j in range(w + 2):
                if i in (0, h + 1) or j in (0, w + 1):
                    rowt.append(deck(i, j))
                    continue
                bits = ''
                if i == 1: bits += 'N'
                if j == w: bits += 'E'
                if i == h: bits += 'S'
                if j == 1: bits += 'W'
                key = ''.join(b for b in 'NESW' if b in bits)
                rowt.append(rims[key] if key else fill(i - 1, j - 1))
            cells.append(rowt)
        return grid(cells)

    a1 = assemble(3, 3, lambda i, j: pb[(i + j) % 3])
    a2 = assemble(4, 1, lambda i, j: pb[j % 3])          # 1-cell channel
    a3 = assemble(1, 1, lambda i, j: pb[0])              # 1x1 pit
    a4 = assemble(2, 2, lambda i, j: pb[(i * 2 + j) % 3])
    pad = np.full((a1.shape[0], 12, 3), 24.0)
    def fit(a, hgt):
        out = np.full((hgt, a.shape[1], 3), 24.0)
        out[:a.shape[0]] = a
        return out
    H = max(x.shape[0] for x in (a1, a2, a3, a4))
    save(np.concatenate([fit(a1, H), pad[:H], fit(a2, H), pad[:H],
                         fit(a3, H), pad[:H], fit(a4, H)], axis=1),
         'RING_CLOSURE.png', 2)

    # the full residential pool: 5 x 11, deep end south, ON the real deck
    def pool_fill(i, j):
        # i 0..10 rows inside basin, j 0..4 — but rims occupy the border ring;
        # this fill only sees interior cells (i 1..9, j 1..3 of the basin)
        if i <= 3:
            return pb[(i + j) % 3] if not (i == 2 and j == 2) else drain_arr
        if i in (4, 5):
            return slopes['s']
        if i <= 8:
            pick = [deeps[0], deeps[1], deeps[2],
                    deeps[0], wets[0]][(i * 3 + j) % 5]
            return pick
        return deeps[(i + j) % 3]
    drain_arr = [t for t in tiles if t['name'] == 'floor_drain']
    drain_arr = np.asarray(Image.open(io.BytesIO(base64.b64decode(
        drain_arr[0]['b64']))).convert('RGB')).astype(np.float64)
    cells = []
    for i in range(13):
        rowt = []
        for j in range(7):
            if i in (0, 12) or j in (0, 6):
                rowt.append(deck(i, j))
                continue
            bits = ''
            if i == 1: bits += 'N'
            if j == 5: bits += 'E'
            if i == 11: bits += 'S'
            if j == 1: bits += 'W'
            key = ''.join(b for b in 'NESW' if b in bits)
            if key == 'N' and j == 3:
                rowt.append(np.asarray(Image.open(io.BytesIO(base64.b64decode(
                    [t for t in tiles if t['name'] == 'rim_N_ladder'][0]['b64']
                ))).convert('RGB')).astype(np.float64))
            elif key:
                rowt.append(rims[key])
            else:
                rowt.append(pool_fill(i - 1, j - 1))
        cells.append(rowt)
    pool_img = grid(cells)
    anchor_col = grid([[st['concrete_0']], [st['concrete_1']],
                       [pb[0]], [st['dirt']], [st['yard_0']]])
    hpad = np.full((pool_img.shape[0], 16, 3), 24.0)
    ac = np.full((pool_img.shape[0], CELL, 3), 24.0)
    ac[:anchor_col.shape[0]] = anchor_col
    save(np.concatenate([pool_img, hpad, ac], axis=1),
         'POOL_ASSEMBLY_ANCHOR.png', 2)

    # clarifier on deck
    deck_big = grid([[deck(i, j) for j in range(6)] for i in range(6)])
    a = cl_a.astype(np.float64)[..., None] / 255.0
    off = 22
    region = deck_big[off:off + CELL * 5, off:off + CELL * 5]
    deck_big[off:off + CELL * 5, off:off + CELL * 5] = \
        region * (1 - a) + cl_rgb * a
    save(deck_big, 'CLARIFIER_ANCHOR.png', 2)

    # contact sheet
    entries = []
    for t in tiles:
        if t['px'] == CELL:
            arr = np.asarray(Image.open(io.BytesIO(base64.b64decode(t['b64'])))
                             .convert('RGB')).astype(np.float64)
            entries.append((t['name'], arr))
    entries += [('ANCHOR concrete_0', st['concrete_0']),
                ('DONOR pool_basin_0', pb[0])]
    labeled_sheet(entries, cols=8).save(os.path.join(PROOF_DIR, 'CONTACT_SHEET.png'))

    # ------------------------------------------------------------ bank
    bank = {
        'form': 'TF-ART-006',
        'merged_with': 'TF-WORLD-004',
        'cooked': '2026-08-09',
        'mode': 'MIXED',
        'note': 'DEAD WATER family. Every canvas harvested: floors/slopes/'
                'faces off pool_basin_0..2 (texture-match 8/1, PENDING '
                'PAOLO, harvest ordered by the merged board form — the '
                'blank WANG-16 16th piece IS pool_basin_0..2 and is not '
                're-shipped); coping off APPROVED starter concrete_0/1 (the '
                'anchor demand: same concrete family as the approved slab); '
                'silt base + sand ramp off starter dirt; tumbleweed straw '
                'off dead_turf; ceramic waterline band hue sampled from '
                'Paolo\'s own bought UP water tiles and desaturated to the '
                'world. Painted: ring geometry, band grout, mineral '
                'bathtub ring, drain, ladder, tumbleweed, scum puddle, '
                'crack networks, clarifier assembly.',
        'boundary_strike': 'NO geomembrane cooked — the lined HDPE leachate '
                           'pond edge is landfill-only and stays with '
                           'TF-ART-015 (TF-WORLD-004\'s own clause). This '
                           'family owns unlined pools/basins.',
        'wang_contract': 'rim_<combo>: bits = tile edges carrying the pool '
                         'boundary; coping 18 px (30 cm); far (N) wall shows '
                         'face (11 px-module ceramic band + mineral ring + '
                         'chalked plaster), near (S) wall coping only; E/W '
                         'edge-on slivers. Blank = pool_basin_0..2.',
        'seam_contract': {'floors_and_silt': 'SELF-SEAMLESS (wrap + 10-run '
                                             'junction measured below)',
                          'rim_ring': 'WANG-16 (closure assemblies rendered, '
                                      'coping-band run measured below)',
                          'slopes': 'directional transition: shallow lip mates '
                                    'pool_basin_*, deep lip mates deep_*',
                          'measured': seam},
        'geometry': 'residential pool 5x11 cells assembled in proof; drop '
                    'read = far-wall face + 0.80 deep-floor value '
                    '(geometry, not baked shadow); clarifier 5x5 cells.',
        'weather': 'deep_wet_* is the RAIN state and collects in the hopper '
                   'ONLY (flash flood; TF-WORLD-004 D).',
        'harvest_sources': [
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt: pool_basin_0..2 canvases '
            '(PENDING, harvest ordered), dead_turf straw ramp (PENDING)',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt: '
            'concrete_0/1 coping + deck, dirt silt/sand, yard_0 anchor '
            '(APPROVED)',
            'banks/BOHEMIA_HD_TILE_REPO_part4.txt x ACT1_CONFIRMED: bought UP '
            'water tiles, HUE ONLY for the ceramic band'],
        'consumers': ['TF-ART-006', 'TF-WORLD-004'],
        'tiles': tiles,
        'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    }
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f)
    print('tiles:', len(tiles))
    print('seams:', json.dumps(seam, indent=1))
    bad = [t['name'] for t in tiles if t['metrics']['purple_pct'] > 2.0]
    print('purple kills:', bad or 'none')
    grn = [(t['name'], t['metrics']['green_pct']) for t in tiles
           if t['metrics']['green_pct'] > 2.0]
    print('green over 2%:', grn or 'none')
    fields = [t for t in tiles if t['name'].split('_')[0] in
              ('deep', 'silt', 'slope', 'ring') and 'wet' not in t['name']]
    out_tol = [(t['name'], t['metrics']) for t in fields if not t['in_tolerance']]
    print('field tiles out of tolerance:', len(out_tol), 'of', len(fields))
    for n, m in out_tol:
        print('  ', n, m)

if __name__ == '__main__':
    main()
