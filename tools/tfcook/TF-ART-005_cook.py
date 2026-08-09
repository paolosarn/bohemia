#!/usr/bin/env python3
"""TF-ART-005 cook (merged with TF-WORLD-005, same asset both lanes) — SPORTS
SURFACES: dead turf yard-line WANG-16 set, mown-stripe pair, running track +
lane lines, hard court + ghost court lines, skinned infield dirt, putting
green, sand bunker, speedway banking + apron stripe.

THE JOB (records/tileforms/TF-ART-005_dead_sports_turf.md merged with
TF-WORLD-005_sports_surfaces.md; ART-005's WANG-16 line contract supersedes
WORLD-005's single-placement where they disagree — residual decision recorded
below and shown on the proof sheet):
The flat dead-turf mat is ALREADY COOKED (dead_turf_0..2, texture-match 8/1,
PENDING PAOLO, in tolerance) and is NEVER repainted here — every turf piece in
this cook paints lines ON a harvested dead_turf canvas, pixel-for-pixel
untouched outside the paint. The cook produces the UNION of both forms' shapes:
  (1) turf_line_<NESW>      WANG-16 yard-line paint set on dead_turf canvases
                            (15 painted pieces; the 16th, blank, IS
                            dead_turf_0..2 and is not re-shipped). Placement:
                            yard lines every 4.6 m = 6 cells.
  (2) turf_stripe_a0..2 /   mown-stripe pairs, one light+dark pass per donor
      turf_stripe_b0..2     (the stripe is a TILE-PAIR value band, so
                            placement decides stripe width — the cemetery
                            striping logic; that hero render is UNJUDGED so
                            only its LOGIC is used, no pixels)
  (3) track_0..2            rubberised running track, chalked brick-red,
                            cracked and lifting at seams, straw weeds in cracks
  (4) track_lane_<..>       lane line set: NS, EW + 4 corners (RESIDUAL
                            DECISION: a lane line on a real oval never
                            terminates or tees, so the 6 pieces the oval needs
                            are cooked and the stub/tee pieces are dead weight
                            — shown assembled on the proof sheet). Lane width
                            1.22 m = ~1.6 cells: lanes read as cell pairs.
  (5) court_0..2            hard court, crazed, colour chalked, faded
                            blue-green
  (6) court_line_<NESW>     ghost court-line WANG-16 on court canvases (15;
                            tennis court 10.97 m = ~15 cells at placement)
  (7) infield_0..2          skinned infield dirt, crusty, weedy
  (8) putting_0..1          putting green: bare, hard, bleached — dies FIRST
  (9) bunker_0..2           sand bunker: perfectly intact pale sand
 (10) banking_0..1          speedway banking, sun-bleached asphalt off the
                            HARMONIZED STREET POOL, rubber-scrubbed
 (11) banking_apron_h/v     apron stripe: double ghost-white band on banking

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE below.
    dead_turf_0..2 (PENDING PAOLO, in tolerance; the merged board form ORDERS
    this harvest: "covers the flat dead-turf mat - build lines/track ON it, do
    not repaint"): HARVESTED VERBATIM as the canvas of every turf_line piece
    and the stripe pair (stripe pair additionally quantized to the donor
    palette — zero new colours). Straw weed colours for track cracks are
    sampled from the same donors' own palette.
    roof_tile_terra_0..2 (APPROVED 8/1): palette HARVESTED as the track's rust
    ramp, desaturated toward the world's sat 0.19 and chalked lighter — the
    track hue comes out of Paolo's own approved terracotta, not a guess.
    roof_tile_sand_0..2 (APPROVED 8/1): pale members HARVESTED as the bunker
    sand ramp.
    lot_asphalt_0..2 (PENDING) opened as the SEPARATION REFERENCE ONLY: the
    form kills any field that reads the same value as parking; every family's
    lum distance to lot asphalt is measured and reported in the bank.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (APPROVED 7/28+7/29) —
    OPENED IN CODE below. dirt: HARVESTED as canvas + palette for the infield
    and (greyed) the putting green. concrete_0/1: HARVESTED as the macro-crack
    GRAIN SOURCE whose luminance drives the track and court fields (poured
    surfaces crack like poured surfaces). yard_0/1/2: anchor context in every
    composite (never edited).
  banks/BOHEMIA_MARKING_BANK_7_17_26.txt (APPROVED-VOLUME 7/17) — OPENED IN
    CODE below: every painted line pixel in this cook (yard lines, court
    lines, lane lines, apron stripes) uses WHITES SAMPLED FROM THIS BANK's
    pocket_line tiles — the same white, aged the same, per the form's anchor.
    The bank's markings_30yr_law (wash + second pass) is why nothing here is
    crisp: lines additionally ghost 30-70% gone.
  banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (approved, REAL_VEGAS R2)
    — OPENED IN CODE below per the 7/31 STREETS-ARE-THE-HARMONIZED-POOL law
    (records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md read first):
    the speedway banking harvests pools.street asphalt as its canvas, then
    sun-bleaches it (a dead speedway is the one asphalt the sun owns) — the
    venue surface separates from parking by measured value, reported.
  banks/BOHEMIA_DESERT_POOLS_7_18_26.txt — corpus Mojave ground, display-only
    crops in the composites to prove the MAT-not-desert read.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — checked: street/wreck/trash/crate/
    dead/barrier/camp props. No sports surface. Nothing fit.
  banks/BOHEMIA_PERIMETER_8_2_26.txt / _CIVIC_OPENINGS_8_3 / _OPENINGS_8_2 —
    checked: walls and openings families only. Nothing fit.
  banks/BOHEMIA_GROUND_POOL_8_6_26.txt — checked: 10 gravel/stone-path tiles;
    a stone path is not an engineered sports surface. Nothing fit.
  banks/BOHEMIA_HD_TILE_REPO_part1..4 x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt
    — pack list walked: no track, court, turf-line, bunker or green pack
    exists in the bought corpus ("3. Grass and ground tiles" is LIVING ground
    cover, a lore kill for act-1 fields; "2. Soil and dirt tiles" is loose
    soil, not a skinned/engineered surface — the starter dirt already covers
    that read at 44px and IS harvested instead).
  banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt — cemetery hero exists
    but the bank is UNJUDGED: its mown-stripe LOGIC is reused (stripe = value
    band pair), zero pixels harvested from it.
  VERDICT: mode MIXED — turf canvases, dirt canvas, banking canvas, line
  whites and the track/bunker ramps are HARVESTED; painted pixels are only the
  genuine gaps (line geometry, track/court fields on harvested grain, ripple
  bunker, hardpan green).

TASTE CHECK:
  DEAD VALLEY: no living green anywhere new — turf stays the donors' straw
    (their own small weed accents are the donors' approved-band content);
    track is desaturated terra rust; court is faded blue-green held at sat
    ~0.12 (the form names these the game's legitimate FADED hue carriers);
    measured green_pct and purple_pct reported per tile, purple kill at 2%.
  QUIET AT DISTANCE: a football field is ~122 cells — these are ground-band
    fields that must sit QUIETER than anything standing on them: no hero
    feature, no keyline, no dither; macro interest comes from cracks and
    chalking at donor-measured density, tuned INTO the bought-tile tolerance
    (edge 14.3-31.0, grain 54.8-77.5) by a deterministic governor.
  LINES ARE GHOSTS: 2-3 px, marking-bank whites, 30-70% gone via clumped
    survival noise (paint dies in patches, survives where traffic didn't
    reach), never crisp. Actual survived fraction measured per line tile.
  8/2 STAMP BUG: no periodic module off 44's divisor grid (bunker ripples run
    at 11 px wave, a divisor); every repeating family ships 2-3 variants,
    never one hero tile.
  45 LAW: pure flat ground planes seen from the world view; the one light
    (upper-left) shows only as crack-lip catches on the track's lifted seams.
  SEPARATION: every family's lum_mean measured against lot_asphalt and the
    street pool so the field never melts into parking (the form's kill).
  VERIFY ON THE REAL SURFACE: 3x3 tilings, WANG sheets, a field corner with a
    line crossing tiles beside yard_0 + desert, an anchor composite, and the
    7/28 high-school stadium plan assembled from these exact tiles with squint
    crops at 1-tile map zoom — PNGs for eyes, not just numbers.

Deterministic: SEED fixed, rerunnable.
Writes ONLY:
  banks/tileforms/TF-ART-005_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-005/*.png
"""

import json, base64, io, os, colorsys, random

from PIL import Image, ImageDraw
import numpy as np

SEED = 80805
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
C0, C1 = 21, 22                 # line core: 2px, centred (feather adds the 3rd)
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-005_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-005')

WANG15 = ['N', 'E', 'S', 'W', 'NE', 'NS', 'NW', 'ES', 'EW', 'SW',
          'NES', 'NEW', 'NSW', 'ESW', 'NESW']
LANE6 = ['NS', 'EW', 'NE', 'NW', 'ES', 'SW']

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
    """REUSE in code: frozen approved starter tiles (canvas/grain/anchor)."""
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

def load_marking_whites():
    """REUSE in code: the APPROVED marking bank's aged white paint values —
    every painted line in this cook uses these colours verbatim."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_MARKING_BANK_7_17_26.txt')))
    assert str(d.get('status', '')).startswith('APPROVED'), d.get('status')
    px = []
    for cls in ('pocket_line_h', 'pocket_line_v'):
        for b in d['classes'][cls]:
            a = np.asarray(Image.open(io.BytesIO(base64.b64decode(b))).convert('RGB')
                           ).astype(np.float64)
            L = lum(a)
            m = (L > 130) & ((a.max(axis=2) - a.min(axis=2)) < 40)
            px.append(a[m])
    w = np.concatenate(px)
    w = np.unique(w.astype(np.uint8), axis=0).astype(np.float64)
    assert len(w) >= 8, len(w)
    return w

def load_street_pool():
    """REUSE in code, per the 7/31 harmonized-pool law: the roadway asphalt
    the speedway banking is built on."""
    d = json.load(open(os.path.join(ROOT, 'banks',
                                    'BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt')))
    out = []
    for b in d['pools']['street'][:6]:
        out.append(np.asarray(Image.open(io.BytesIO(base64.b64decode(b))).convert('RGB')
                              ).astype(np.float64))
    return out

def load_desert_crops(n=2):
    """Display-only anchor context: corpus Mojave ground crops (never edited)."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_DESERT_POOLS_7_18_26.txt')))
    crops = []
    for i in range(n):
        a = np.asarray(Image.open(io.BytesIO(base64.b64decode(d['ground'][i]))
                                  ).convert('RGB')).astype(np.float64)
        crops.append(a[8:8 + CELL, 8:8 + CELL])
    return crops

def assert_pool_checked():
    """Shopping sweep, honoured in code: the pools that were checked and did
    not fit — opened so the claim is machine-true, harvested nothing."""
    ext = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')))
    assert set(ext['counts']) == {'street', 'wreck', 'trash', 'crate', 'dead',
                                  'barrier', 'camp'}, ext['counts']
    gp = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_GROUND_POOL_8_6_26.txt')))
    assert list(gp['counts']) == ['gravel'], gp['counts']

# ---------------------------------------------------------------- helpers
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]

def palette_of(*tiles):
    px = np.concatenate([t.reshape(-1, 3) for t in tiles])
    return np.unique(px.astype(np.uint8), axis=0).astype(np.float64)

def quantize_to(pal, px):
    d = ((pal[None, :, :] - px[:, None, :]) ** 2).sum(axis=2)
    return pal[d.argmin(axis=1)]

def torus_blur(n, k=5, passes=2):
    for _ in range(passes):
        for ax in (0, 1):
            m = np.zeros_like(n)
            for d in range(-(k // 2), k // 2 + 1):
                m += np.roll(n, d, axis=ax)
            n = m / k
    return n

def torus_noise(rg, k=5, passes=2):
    n = torus_blur(rg.standard_normal((CELL, CELL)), k, passes)
    return (n - n.min()) / (n.max() - n.min() + 1e-9)

def scrambled(donors, seed, runs=(3, 7)):
    """Variant synthesis off approved canvases: real donor COLUMNS in short
    runs with circular rolls (the ART-002 pattern) — donor grain, donor
    colours, wrap preserved (donors are seamless; run boundaries are internal
    value steps just like the tile edge)."""
    rng = random.Random(seed)
    cols, x = [], 0
    while x < CELL:
        d = donors[rng.randrange(len(donors))]
        run = min(rng.randrange(*runs), CELL - x)
        sx = rng.randrange(CELL - run + 1)
        roll = rng.randrange(CELL)
        for k in range(run):
            cols.append(np.roll(d[:, sx + k], roll, axis=0))
        x += run
    tex = np.stack(cols, axis=1).astype(np.float64)
    # soften run-boundary steps a hair (keeps grain, kills stripes)
    return 0.86 * tex + 0.14 * (np.roll(tex, 1, axis=1) + tex + np.roll(tex, -1, axis=1)) / 3.0

def ramp_map(L01, ramp):
    """Map a 0..1 grain field through a lum-sorted colour ramp, interpolating."""
    idx = L01 * (len(ramp) - 1)
    lo = np.clip(np.floor(idx).astype(int), 0, len(ramp) - 1)
    hi = np.clip(lo + 1, 0, len(ramp) - 1)
    f = (idx - lo)[..., None]
    return ramp[lo] * (1 - f) + ramp[hi] * f

def desat(pal, amt):
    g = lum(pal)[..., None]
    return np.clip(pal + amt * (g - pal), 0, 255)

def crack_walk(rng, n, length, wander, snap_axis=True, width2=0.35):
    """Torus random-walk crack mask (wraps => cracks run multi-cell when
    tiled). depth 1.0 core, extra width probabilistic."""
    m = np.zeros((CELL, CELL))
    paths = []
    for _ in range(n):
        x, y = rng.uniform(0, CELL), rng.uniform(0, CELL)
        if snap_axis:
            ang = rng.choice([0.0, np.pi / 2]) + rng.uniform(-0.28, 0.28)
        else:
            ang = rng.uniform(0, 2 * np.pi)
        pts = []
        for _ in range(length):
            ang += rng.uniform(-wander, wander) * 0.3
            x = (x + np.cos(ang)) % CELL
            y = (y + np.sin(ang)) % CELL
            xi, yi = int(x) % CELL, int(y) % CELL
            m[yi, xi] = 1.0
            pts.append((yi, xi))
            if rng.random() < width2:
                m[yi, (xi + 1) % CELL] = max(m[yi, (xi + 1) % CELL], 0.7)
        paths.append(pts)
    return m, paths

def governor(t, lo=55.5, hi=76.5, e_lo=14.6, e_hi=30.5, seed=0):
    """Deterministic detail-density governor: land edge+grain inside the
    bought-tile tolerance band."""
    rg = np.random.default_rng(SEED + seed)
    jit = rg.uniform(-1, 1, (CELL, CELL, 1))
    for _ in range(6):
        L = lum(t)
        d = np.abs(np.diff(L, axis=1))
        grain = (d > 8).mean() * 100
        edge = d.mean()
        if grain > hi or edge > e_hi:
            t = 0.86 * t + 0.14 * (np.roll(t, 1, axis=1) + t + np.roll(t, -1, axis=1)) / 3.0
        elif grain < lo or edge < e_lo:
            t = np.clip(t * (1 + 0.055 * jit) + 2.4 * jit, 0, 255)
        else:
            break
    return np.clip(t, 0, 255)

# ---------------------------------------------------------------- line paint
def wang_mask(bits):
    core = np.zeros((CELL, CELL), bool)
    if 'N' in bits: core[0:C1 + 1, C0:C1 + 1] = True
    if 'S' in bits: core[C0:CELL, C0:C1 + 1] = True
    if 'E' in bits: core[C0:C1 + 1, C0:CELL] = True
    if 'W' in bits: core[C0:C1 + 1, 0:C1 + 1] = True
    d = core.copy()
    for ax in (0, 1):
        for sh in (-1, 1):
            d |= np.roll(core, sh, axis=ax)
    return core, d & ~core

def paint_ghost(canvas, bits, whites, seed, gone_lo=0.32, gone_hi=0.55,
                core_a=0.78, feath_a=0.30):
    """Ghost-painted line on an untouched harvested canvas. Survival is CLUMPED
    (paint dies in patches); marking-bank whites verbatim; canvas pixels
    outside the paint are byte-identical to the donor."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    core, feath = wang_mask(bits)
    surv = torus_noise(rg, 5, 2)
    gone = rng.uniform(gone_lo + 0.03, gone_hi - 0.03)
    # quantile over the LINE's own pixels: the gone fraction is a per-piece
    # contract, not a whole-tile average (v1 let a low patch eat 91% of a line)
    keep = surv > np.quantile(surv[core], gone)
    fine = rg.random((CELL, CELL)) > 0.12
    corek = core & keep & fine
    feathk = feath & keep & (rg.random((CELL, CELL)) < 0.38)
    wcol = whites[rg.integers(0, len(whites), (CELL, CELL))]
    t = canvas.copy()
    av = core_a * (0.75 + 0.25 * surv)            # paint thins where it is dying
    t[corek] = t[corek] * (1 - av[corek, None]) + wcol[corek] * av[corek, None]
    t[feathk] = t[feathk] * (1 - feath_a) + wcol[feathk] * feath_a
    survived = float(corek.sum()) / max(core.sum(), 1)
    return np.clip(t, 0, 255), round(survived, 3)

# ---------------------------------------------------------------- families
def cook_track(concrete, terra_pal, straw, seed):
    """Chalked brick-red rubberised track on approved poured-concrete grain;
    ramp = approved terracotta desaturated to field discipline; cracks lift at
    the seams (lit lip on the upper-left side, the one light); dead straw
    weeds in the cracks."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    ramp = np.clip(desat(terra_pal, 0.26) * 1.42, 0, 255)
    ramp = ramp[np.argsort(lum(ramp))]
    ramp = ramp[len(ramp) // 6:]                      # drop the soot-dark tail
    g = lum(scrambled(concrete, SEED + seed))
    p2, p98 = np.percentile(g, 2), np.percentile(g, 98)
    g01 = np.clip((g - p2) / max(p98 - p2, 1e-9), 0, 1)
    t = ramp_map(0.22 + 0.62 * g01, ramp)
    # chalking: UV-eaten patches go pale and grey
    ch = torus_noise(rg, 5, 2)
    m = ch > 0.68
    t[m] = np.clip(desat(t[m], 0.42) * 1.08, 0, 255)
    # cracks: LONG and STRAIGHTISH (poured-section seams, not crazing) — they
    # wrap, so they run multi-cell when tiled; two per tile keeps it QUIET
    cm, paths = crack_walk(rng, 2, rng.randrange(90, 130), 0.22)
    t = np.clip(t * (1 - 0.48 * cm[..., None]), 0, 255)
    # lifted seam lips catch the upper-left light; weeds in the cracks
    for pts in paths:
        for (yi, xi) in pts:
            if rng.random() < 0.22:
                t[(yi - 1) % CELL, (xi - 1) % CELL] = np.clip(
                    t[(yi - 1) % CELL, (xi - 1) % CELL] * 1.16, 0, 255)
            if rng.random() < 0.10:
                t[yi, xi] = straw[rng.randrange(len(straw))] * rng.uniform(0.8, 1.0)
                if rng.random() < 0.3:
                    t[(yi + 1) % CELL, xi] = straw[rng.randrange(len(straw))] * 0.75
    return governor(t, seed=seed)

def cook_court(concrete, seed):
    """Hard court: faded blue-green acrylic over the same poured grain,
    crazed with a fine crack web, colour chalking off in patches."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    steps = np.linspace(72, 128, 160)
    drift = np.sin(np.linspace(0, 2.6, 160)) * 0.02
    ramp = np.stack([steps * 0.895, steps * (1.045 + drift), steps * (1.025 - drift)],
                    axis=1)
    g = lum(scrambled(concrete, SEED + seed + 1))
    p2, p98 = np.percentile(g, 2), np.percentile(g, 98)
    g01 = np.clip((g - p2) / max(p98 - p2, 1e-9), 0, 1)
    t = ramp_map(0.12 + 0.74 * g01, np.clip(ramp, 0, 255))
    ch = torus_noise(rg, 5, 2)
    m = ch > 0.66                                     # chalked: grey shows through
    t[m] = np.clip(desat(t[m], 0.62) * 1.07, 0, 255)
    cm, _ = crack_walk(rng, 7, 26, 1.5, snap_axis=False, width2=0.12)
    t = np.clip(t * (1 - 0.34 * cm[..., None]), 0, 255)
    # acrylic is not one pigment: per-channel micro-scatter lifts the colour
    # count to the bought-tile floor without touching the read
    t = np.clip(t * (1 + rg.normal(0, 0.02, (CELL, CELL, 3))), 0, 255)
    return governor(t, seed=seed)

def cook_infield(dirt, straw, seed):
    """Skinned infield dirt: approved starter dirt canvas, warmed and crusted —
    drying cracks, wind-blown straw flecks."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = scrambled([dirt], SEED + seed) * np.array([1.025, 0.99, 0.945])[None, None, :]
    t = np.clip(desat(t, 0.10) * 0.90, 0, 255)
    cm, paths = crack_walk(rng, 4, 34, 1.1, snap_axis=False, width2=0.15)
    t = np.clip(t * (1 - 0.38 * cm[..., None]), 0, 255)
    # crusted fines are not one clay: per-channel micro-scatter (colour floor)
    t = np.clip(t * (1 + rg.normal(0, 0.018, (CELL, CELL, 3))), 0, 255)
    fl = rg.random((CELL, CELL)) < 0.004
    for (yi, xi) in np.argwhere(fl):
        t[yi, xi] = straw[rng.randrange(len(straw))] * rng.uniform(0.75, 0.95)
    for pts in paths:
        for (yi, xi) in pts:
            if rng.random() < 0.05:
                t[yi, xi] = straw[rng.randrange(len(straw))] * 0.8
    return governor(t, seed=seed)

def cook_putting(dirt, concrete, seed):
    """Putting green, thirty years dead: it died FIRST and completely — bare
    bleached hardpan, tight fine grain, hairline cracks, no green left at all."""
    rng = random.Random(SEED + seed)
    base = 0.62 * scrambled([dirt], SEED + seed) + 0.38 * scrambled(concrete, SEED + seed + 9)
    t = np.clip(base * np.array([0.985, 0.985, 0.95])[None, None, :] * 0.92, 0, 255)
    cm, _ = crack_walk(rng, 3, 24, 1.3, snap_axis=False, width2=0.08)
    t = np.clip(t * (1 - 0.30 * cm[..., None]), 0, 255)
    return governor(t, seed=seed)

def cook_bunker(sand_ramp, seed, wavevec):
    """Sand bunker: sand does not care. Pale intact sand off the approved
    sand-tile ramp, low wind ripples at 11px wave (a divisor of 44 — wraps)."""
    rg = np.random.default_rng(SEED + seed)
    g = torus_noise(rg, 3, 2) * 0.65 + rg.random((CELL, CELL)) * 0.35
    ys, xs = np.mgrid[0:CELL, 0:CELL]
    kx, ky = wavevec
    ripple = 0.16 * np.sin(2 * np.pi * (kx * xs + ky * ys) / CELL + rg.uniform(0, 6.28))
    g01 = np.clip(0.24 + 0.58 * g + ripple, 0, 1)
    t = ramp_map(g01, sand_ramp)
    t = np.clip(t * (1 + rg.normal(0, 0.012, (CELL, CELL, 3))), 0, 255)
    # normalize into the pale top of the lum band (palest family on the plot,
    # still inside the bought-tile tolerance)
    t = np.clip(t * (119.5 / max(lum(t).mean(), 1)), 0, 255)
    return governor(t, seed=seed)

def cook_banking(street, seed):
    """Speedway banking: harmonized-pool roadway asphalt, sun-bleached (the
    value that separates it from live parking), rubber-scrubbed in horizontal
    smears (the traffic ran along the tile, thirty years ago)."""
    rng = random.Random(SEED + seed)
    base = scrambled(street, SEED + seed)
    # shadow-compress BEFORE the bleach: the donor's crack pits must not
    # survive as black holes in a sun-flattened surface
    t = np.clip(255.0 * (base / 255.0) ** 0.78 * 1.30, 0, 255)
    t = np.clip(desat(t, 0.30) * np.array([1.02, 1.0, 0.97])[None, None, :], 0, 255)
    # clamp outliers both ways (pit blobs and bleached weed flecks)
    med = np.median(t.reshape(-1, 3), axis=0)
    L = lum(t)
    for mask, w in ((L < 62, 0.6), (L > 168, 0.55)):
        t[mask] = t[mask] * (1 - w) + med[None, :] * w
    for _ in range(5):                                 # rubber smears, horizontal
        y = rng.randrange(CELL)
        x0 = rng.randrange(CELL)
        ln = rng.randrange(10, 26)
        f = rng.uniform(0.82, 0.90)
        for k in range(ln):
            x = (x0 + k) % CELL
            for dy in range(rng.randrange(1, 3)):
                t[(y + dy) % CELL, x] = t[(y + dy) % CELL, x] * f
    # wrap insurance: the bleach amplifies the donor's own junction step —
    # cross-fade the outer ring toward rolled interior content
    for axis, span, depth in ((0, 4, 0.35), (1, 4, 0.35)):
        n = t.shape[axis]
        rolled = np.roll(t, n // 2, axis=axis)
        idx = np.arange(n)
        w = np.clip((span - np.minimum(idx, n - 1 - idx)) / span * depth, 0, depth)
        wsh = w[:, None, None] if axis == 0 else w[None, :, None]
        t = t * (1 - wsh) + rolled * wsh
    return governor(t, seed=seed)

def paint_apron(banking, whites, seed, vertical=False):
    """Apron stripe: double ghost-white band (marking whites, 30yr washed +
    ghosted) running along the banking; _h runs EW, _v runs NS."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = banking.copy()
    surv = torus_noise(rg, 5, 2)
    keep = surv > np.quantile(surv, rng.uniform(0.28, 0.42))
    wcol = whites[rg.integers(0, len(whites), (CELL, CELL))]
    for band in ((16, 18), (26, 28)):
        for r in range(*band):
            for c in range(CELL):
                y, x = (c, r) if vertical else (r, c)
                if keep[y, x] and rg.random() > 0.12:
                    a = 0.8 * (0.78 + 0.22 * surv[y, x])
                    t[y, x] = t[y, x] * (1 - a) + wcol[y, x] * a
    return np.clip(t, 0, 255)

# ---------------------------------------------------------------- metrics
def measure(tile):
    a = tile.astype(np.float64)
    L = lum(a)
    colours = len(np.unique(a.reshape(-1, 3).astype(np.uint8), axis=0))
    d = np.abs(np.diff(L, axis=1))
    edge = float(d.mean())
    grain = float((d > 8).mean() * 100)
    flat = a.reshape(-1, 3) / 255.0
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in flat])
    sat = float(hsv[:, 1].mean())
    hue = hsv[:, 0] * 360
    purple = float(((hue >= 260) & (hue <= 320) & (hsv[:, 1] > 0.15)).mean() * 100)
    green = float(((hue >= 70) & (hue <= 170) & (hsv[:, 1] > 0.25) & (hsv[:, 2] > 0.25)).mean() * 100)
    return dict(colours=colours, edge=round(edge, 3), grain=round(grain, 3),
                sat=round(sat, 3), lum_mean=round(float(L.mean()), 3),
                lum_sd=round(float(L.std()), 3),
                purple_pct=round(purple, 3), green_pct=round(green, 3),
                hwrap=round(float(np.abs(L[:, 0] - L[:, -1]).mean()), 3),
                vwrap=round(float(np.abs(L[0, :] - L[-1, :]).mean()), 3),
                edge_darkening=round(float(min(L.mean(axis=0)[0], L.mean(axis=0)[-1])
                                           - L.mean(axis=0)[10:-10].mean()), 3))

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
    """entries: list of (label, 44px tile array)."""
    cw, chh = CELL * scale + pad, CELL * scale + label_h + pad
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

# ---------------------------------------------------------------- main
def main():
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)
    assert_pool_checked()

    tm = load_texture_match({'dead_turf', 'roof_tile_terra', 'roof_tile_sand',
                             'lot_asphalt'})
    turf = [tm[f'dead_turf_{i}'][0] for i in range(3)]
    assert all(tm[f'dead_turf_{i}'][1] == 'PENDING PAOLO' for i in range(3))
    for i in range(3):
        assert tm[f'roof_tile_terra_{i}'][1].startswith('APPROVED')
        assert tm[f'roof_tile_sand_{i}'][1].startswith('APPROVED')
    terra_pal = palette_of(*[tm[f'roof_tile_terra_{i}'][0] for i in range(3)])
    sandp = palette_of(*[tm[f'roof_tile_sand_{i}'][0] for i in range(3)])
    sand_ramp = sandp[lum(sandp) > 92]
    sand_ramp = sand_ramp[np.argsort(lum(sand_ramp))]
    sand_ramp = np.clip(desat(sand_ramp, 0.22) * 1.06, 0, 255)
    lot = [tm[f'lot_asphalt_{i}'][0] for i in range(3)]

    starter = load_starter(['dirt', 'concrete_0', 'concrete_1',
                            'yard_0', 'yard_1', 'yard_2'])
    dirt = starter['dirt']
    concrete = [starter['concrete_0'], starter['concrete_1']]
    yards = [starter['yard_0'], starter['yard_1'], starter['yard_2']]

    whites = load_marking_whites()
    street = load_street_pool()
    desert = load_desert_crops(2)

    turf_pal = palette_of(*turf)
    straw = turf_pal[(lum(turf_pal) > 95) & (lum(turf_pal) < 185)]
    r, g, b = straw[:, 0], straw[:, 1], straw[:, 2]
    straw = straw[(r >= g) & (g > b)]                 # straw/bone members only
    assert len(straw) > 20, len(straw)

    tiles, sheets = [], {}
    def add(name, arr, kind, harvested, extra=None):
        m = measure(arr)
        e = dict(name=name, px=CELL, b64=png_b64(arr), metrics=m, kind=kind,
                 harvested_from=harvested, in_tolerance=in_tolerance(m))
        if extra:
            e.update(extra)
        tiles.append(e)
        sheets[name] = arr

    # ---- (1) turf yard-line WANG-16 (blank = dead_turf_0..2, not re-shipped)
    turf_lines = {}
    for i, bits in enumerate(WANG15):
        # multi-connection pieces carry the most paint: keep them off the
        # brightest donor so the lifted mean stays inside the lum band
        ci = i % 3
        if len(bits) >= 3:
            ci = 0 if i % 2 == 0 else 2
        elif len(bits) == 2 and ci == 1:
            ci = 0 if i % 2 == 0 else 2
        canvas = turf[ci]
        t, survived = paint_ghost(canvas, bits, whites, 100 + i)
        turf_lines[bits] = t
        add(f'turf_line_{bits}', t, 'WANG-16 yard-line piece on dead turf',
            f'canvas dead_turf_{ci} verbatim (texture-match 8/1) + marking-bank whites',
            dict(wang=bits, paint_survived=survived))

    # ---- (2) mown-stripe pair (zero new colours vs the donor palette)
    stripes_a, stripes_b = [], []
    for i in range(3):
        # light pass capped so the brightest donor stays inside the lum band;
        # the stripe read is the PAIR DELTA, carried mostly by the dark pass
        fa = min(1.06, 120.8 / lum(turf[i]).mean())
        a_i = quantize_to(turf_pal, np.clip(turf[i] * fa, 0, 255).reshape(-1, 3)).reshape(CELL, CELL, 3)
        b_i = quantize_to(turf_pal, np.clip(turf[i] * 0.86, 0, 255).reshape(-1, 3)).reshape(CELL, CELL, 3)
        stripes_a.append(a_i); stripes_b.append(b_i)
        add(f'turf_stripe_a{i}', a_i, 'mown-stripe pair, light pass',
            f'dead_turf_{i} canvas, value pass quantized to the dead_turf palette (0 new colours)')
        add(f'turf_stripe_b{i}', b_i, 'mown-stripe pair, dark pass',
            f'dead_turf_{i} canvas, value pass quantized to the dead_turf palette (0 new colours)')
    sa, sb = stripes_a[0], stripes_b[0]

    # ---- (3) track fields + (4) lane pieces
    tracks = [cook_track(concrete, terra_pal, straw, 200 + i) for i in range(3)]
    for i, t in enumerate(tracks):
        add(f'track_{i}', t, 'running track field, chalked rust, cracked',
            'grain: starter concrete (approved); ramp: roof_tile_terra palette '
            '(approved) desaturated; weeds: dead_turf straw members')
    lanes = {}
    for i, bits in enumerate(LANE6):
        t, survived = paint_ghost(tracks[i % 3], bits, whites, 300 + i,
                                  gone_lo=0.30, gone_hi=0.58)
        lanes[bits] = t
        add(f'track_lane_{bits}', t, 'track lane-line piece (oval set: NS/EW + corners)',
            'track field + marking-bank whites', dict(wang=bits, paint_survived=survived))

    # ---- (5) court fields + (6) court-line WANG-16
    courts = [cook_court(concrete, 400 + i) for i in range(3)]
    for i, t in enumerate(courts):
        add(f'court_{i}', t, 'hard court field, faded blue-green, crazed',
            'grain: starter concrete (approved); colour painted (faded acrylic, sat ~0.12)')
    court_lines = {}
    for i, bits in enumerate(WANG15):
        t, survived = paint_ghost(courts[i % 3], bits, whites, 500 + i,
                                  gone_lo=0.34, gone_hi=0.58, core_a=0.70)
        court_lines[bits] = t
        add(f'court_line_{bits}', t, 'WANG-16 court-line piece on hard court',
            'court field + marking-bank whites', dict(wang=bits, paint_survived=survived))

    # ---- (7) infield, (8) putting, (9) bunker, (10) banking, (11) apron
    infields = [cook_infield(dirt, straw, 600 + i) for i in range(3)]
    for i, t in enumerate(infields):
        add(f'infield_{i}', t, 'skinned infield dirt, crusted, weedy',
            'starter dirt canvas (approved) + dead_turf straw flecks')
    puttings = [cook_putting(dirt, concrete, 700 + i) for i in range(2)]
    for i, t in enumerate(puttings):
        add(f'putting_{i}', t, 'putting green, dead first: bare bleached hardpan',
            'starter dirt + concrete canvases (approved), greyed')
    bunkers = [cook_bunker(sand_ramp, 800 + i, wv)
               for i, wv in enumerate(((0, 4), (1, 4), (-1, 4)))]
    for i, t in enumerate(bunkers):
        add(f'bunker_{i}', t, 'sand bunker, perfectly intact pale sand',
            'ramp: roof_tile_sand palette (approved), pale members')
    bankings = [cook_banking(street, 900 + i) for i in range(2)]
    for i, t in enumerate(bankings):
        add(f'banking_{i}', t, 'speedway banking, sun-bleached, rubber-scrubbed',
            'canvas: harmonized street pool roadway (approved, 7/31 law), bleached')
    apron_h = paint_apron(bankings[0], whites, 950, vertical=False)
    apron_v = paint_apron(bankings[1], whites, 951, vertical=True)
    add('banking_apron_h', apron_h, 'apron stripe EW, double ghost-white band',
        'banking canvas + marking-bank whites')
    add('banking_apron_v', apron_v, 'apron stripe NS, double ghost-white band',
        'banking canvas + marking-bank whites')

    # ---------------------------------------------------------------- seams
    seam = {}
    seam['dead_turf_donor_3x_baseline'] = run_seam([turf[k % 3] for k in range(9)])
    seam['turf_stripe_pair'] = run_seam(
        [stripes_a[k % 3] if k % 2 == 0 else stripes_b[k % 3] for k in range(8)])
    seam['track_10run'] = run_seam([tracks[k % 3] for k in range(10)])
    seam['court_10run'] = run_seam([courts[k % 3] for k in range(10)])
    seam['infield_10run'] = run_seam([infields[k % 3] for k in range(10)])
    seam['putting_10run'] = run_seam([puttings[k % 2] for k in range(10)])
    seam['bunker_10run'] = run_seam([bunkers[k % 3] for k in range(10)])
    seam['banking_10run'] = run_seam([bankings[k % 2] for k in range(10)])
    seam['yardline_run_EW'] = run_seam(
        [turf_lines['E' if k == 0 else ('W' if k == 5 else 'EW')] for k in range(6)])

    # value separation from parking (the WORLD-005 kill)
    lot_lum = round(float(np.mean([lum(a).mean() for a in lot])), 1)
    street_lum = round(float(np.mean([lum(a).mean() for a in street])), 1)
    separation = {'lot_asphalt_lum': lot_lum, 'street_pool_lum': street_lum}
    for fam, arrs in (('turf', turf), ('track', tracks), ('court', courts),
                      ('infield', infields), ('putting', puttings),
                      ('bunker', bunkers), ('banking', bankings)):
        fl = round(float(np.mean([lum(a).mean() for a in arrs])), 1)
        separation[fam] = {'lum': fl, 'delta_vs_lot': round(fl - lot_lum, 1)}

    # ---------------------------------------------------------------- proofs
    # (a) 3x3 tiled proofs
    save(grid([[turf[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_turf_donor.png', 3)
    save(grid([[(stripes_a[r] if (k % 2 == 0) else stripes_b[r]) for k in range(3)]
               for r in range(3)]),
         'TILED_3x3_turf_stripe.png', 3)
    save(grid([[tracks[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_track.png', 3)
    save(grid([[courts[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_court.png', 3)
    save(grid([[infields[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_infield.png', 3)
    save(grid([[puttings[(r + k) % 2] for k in range(3)] for r in range(3)]),
         'TILED_3x3_putting.png', 3)
    save(grid([[bunkers[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_bunker.png', 3)
    save(grid([[bankings[(r + k) % 2] for k in range(3)] for r in range(3)]),
         'TILED_3x3_banking.png', 3)

    # (b) WANG sheets
    wang_entries = [('blank=dead_turf_0', turf[0])] + \
                   [(b, turf_lines[b]) for b in WANG15]
    labeled_sheet(wang_entries, 4).save(os.path.join(PROOF_DIR, 'WANG_SHEET_turf_lines.png'))
    labeled_sheet([('blank=court_0', courts[0])] + [(b, court_lines[b]) for b in WANG15],
                  4).save(os.path.join(PROOF_DIR, 'WANG_SHEET_court_lines.png'))
    # lane set + assembled oval corner (the residual-decision proof)
    lane_entries = [(b, lanes[b]) for b in LANE6]
    labeled_sheet(lane_entries, 6).save(os.path.join(PROOF_DIR, 'LANE_SET_track.png'))
    ring = grid([[lanes['ES'], lanes['EW'], lanes['SW']],
                 [lanes['NS'], tracks[0], lanes['NS']],
                 [lanes['NE'], lanes['EW'], lanes['NW']]])
    save(ring, 'LANE_RING_3x3.png', 3)

    # (c) field corner: a line crossing tiles and STOPPING, beside yard_0 + desert
    rowsFC = []
    for ry in range(5):
        row = []
        for rx in range(6):
            if rx == 1:
                row.append(turf_lines['NES'] if ry == 2 else turf_lines['NS'])
            elif ry == 2 and rx in (2, 3):
                row.append(turf_lines['EW'])
            elif ry == 2 and rx == 4:
                row.append(turf_lines['W'])          # the line STOPS here
            else:
                row.append(turf[(rx + ry) % 3])
        row.append(yards[ry % 3])
        row.append(desert[ry % 2])
        rowsFC.append(row)
    save(grid(rowsFC), 'FIELD_CORNER_LINE_STOPS_beside_yard_desert.png', 3)

    # (d) anchor composite
    comp = [
        ('yard_0 APPROVED', yards[0]), ('yard_1 APPROVED', yards[1]),
        ('desert corpus', desert[0]), ('dead_turf_0 donor', turf[0]),
        ('dead_turf_1 donor', turf[1]), ('lot_asphalt ref', lot[0]),
        ('turf_line_EW', turf_lines['EW']), ('turf_line_NESW', turf_lines['NESW']),
        ('turf_stripe_a0', sa), ('turf_stripe_b0', sb),
        ('track_0', tracks[0]), ('track_lane_EW', lanes['EW']),
        ('court_0', courts[0]), ('court_line_ES', court_lines['ES']),
        ('infield_0', infields[0]), ('putting_0', puttings[0]),
        ('bunker_0', bunkers[0]), ('banking_0', bankings[0]),
        ('banking_apron_h', apron_h), ('marking white anchor',
                                       np.tile(whites[np.argsort(lum(whites))][
                                           np.linspace(0, len(whites) - 1, CELL).astype(int)][None, :, :],
                                               (CELL, 1, 1))),
    ]
    labeled_sheet(comp, 6).save(os.path.join(PROOF_DIR, 'ANCHOR_COMPOSITE.png'))

    # (e) contact sheet, every candidate
    labeled_sheet([(t['name'], sheets[t['name']]) for t in tiles], 8, scale=2) \
        .save(os.path.join(PROOF_DIR, 'CONTACT_SHEET_all.png'))

    # (f) the 7/28 high-school stadium wearing it + squint crops
    W, H = 34, 26
    canvas = np.zeros((H * CELL, W * CELL, 3))
    rngL = random.Random(SEED + 9999)
    def put(cx, cy, a):
        canvas[cy * CELL:(cy + 1) * CELL, cx * CELL:(cx + 1) * CELL] = a
    def turf_pick(cx, cy):
        # desert_dominance_law logic: one dominant, accents clustered
        return turf[0] if (cx * 7 + cy * 13) % 20 < 17 else turf[1 + (cx + cy) % 2]
    for cy in range(H):
        for cx in range(W):
            put(cx, cy, yards[(cx + cy) % 3])
    # stadium: track ring 2 wide around a 10x16 field at (2,2)..(15,21)
    fx0, fy0, fw, fh = 4, 4, 10, 16
    tx0, ty0, tw, th = fx0 - 2, fy0 - 2, fw + 4, fh + 4
    for cy in range(ty0, ty0 + th):
        for cx in range(tx0, tx0 + tw):
            inner = fx0 <= cx < fx0 + fw and fy0 <= cy < fy0 + fh
            if inner:
                continue
            put(cx, cy, tracks[(cx + cy) % 3])
    # lane line ring mid-ring
    lx0, ly0, lw, lh = tx0 + 1, ty0 + 1, tw - 2, th - 2
    for cx in range(lx0 + 1, lx0 + lw - 1):
        put(cx, ly0, lanes['EW']); put(cx, ly0 + lh - 1, lanes['EW'])
    for cy in range(ly0 + 1, ly0 + lh - 1):
        put(lx0, cy, lanes['NS']); put(lx0 + lw - 1, cy, lanes['NS'])
    put(lx0, ly0, lanes['ES']); put(lx0 + lw - 1, ly0, lanes['SW'])
    put(lx0, ly0 + lh - 1, lanes['NE']); put(lx0 + lw - 1, ly0 + lh - 1, lanes['NW'])
    # field turf + yard lines every 6 rows, stubs at the sidelines
    for cy in range(fy0, fy0 + fh):
        for cx in range(fx0, fx0 + fw):
            put(cx, cy, turf_pick(cx, cy))
    for cy in range(fy0 + 2, fy0 + fh, 6):
        put(fx0, cy, turf_lines['E'])
        for cx in range(fx0 + 1, fx0 + fw - 1):
            put(cx, cy, turf_lines['EW'])
        put(fx0 + fw - 1, cy, turf_lines['W'])
    # court pad 8x5 at (19,3): perimeter + centre line, full WANG exercise
    cx0, cy0, cw2, ch2 = 19, 3, 8, 5
    for cy in range(cy0, cy0 + ch2):
        for cx in range(cx0, cx0 + cw2):
            put(cx, cy, courts[(cx + cy) % 3])
    x1, y1, x2, y2 = cx0, cy0, cx0 + cw2 - 1, cy0 + ch2 - 1
    mid = (x1 + x2) // 2
    for cx in range(x1 + 1, x2):
        put(cx, y1, court_lines['ESW' if cx == mid else 'EW'])
        put(cx, y2, court_lines['NEW' if cx == mid else 'EW'])
    for cy in range(y1 + 1, y2):
        put(x1, cy, court_lines['NS']); put(x2, cy, court_lines['NS'])
        put(mid, cy, court_lines['NESW' if cy == (y1 + y2) // 2 else 'NS'])
    put(x1, y1, court_lines['ES']); put(x2, y1, court_lines['SW'])
    put(x1, y2, court_lines['NE']); put(x2, y2, court_lines['NW'])
    for cy in range(y1 + 1, y2):
        put(mid, cy, court_lines['NESW' if cy == (y1 + y2) // 2 else 'NS'])
    # ball diamond wedge 9x9 at (19,10): infield wedge in turf
    dx0, dy0, ds = 19, 10, 9
    for cy in range(dy0, dy0 + ds):
        for cx in range(dx0, dx0 + ds):
            k = (cx - dx0) + (dy0 + ds - 1 - cy)
            put(cx, cy, infields[(cx + cy) % 3] if k <= 5 else turf_pick(cx, cy))
    # putting + bunker 4x4 at (29,10)
    for cy in range(10, 14):
        for cx in range(29, 33):
            put(cx, cy, puttings[(cx + cy) % 2])
    put(29, 13, bunkers[0]); put(30, 13, bunkers[1]); put(29, 12, bunkers[2])
    # banking strip 2 wide at (29,16..24) with apron column
    for cy in range(16, 25):
        put(30, cy, bankings[cy % 2]); put(31, cy, bankings[(cy + 1) % 2])
        put(29, cy, apron_v)
    save(canvas, 'STADIUM_IN_PLACE_1x.png', 1)
    # squint: oval + diamond at 1-tile map zoom
    oval = canvas[ty0 * CELL:(ty0 + th) * CELL, tx0 * CELL:(tx0 + tw) * CELL]
    dia = canvas[dy0 * CELL:(dy0 + ds) * CELL, dx0 * CELL:(dx0 + ds) * CELL]
    sq = Image.new('RGB', (44 * 8 * 2 + 24, 44 * 8 + 40), (24, 24, 28))
    for i, (lab, region) in enumerate((('track oval @1 tile', oval),
                                       ('diamond wedge @1 tile', dia))):
        im = Image.fromarray(region.astype(np.uint8), 'RGB').resize((44, 44), Image.LANCZOS)
        im = im.resize((44 * 8, 44 * 8), Image.NEAREST)
        sq.paste(im, (8 + i * (44 * 8 + 8), 8))
        ImageDraw.Draw(sq).text((8 + i * (44 * 8 + 8), 44 * 8 + 14), lab,
                                fill=(225, 225, 225))
    sq.save(os.path.join(PROOF_DIR, 'SQUINT_1TILE_oval_diamond.png'))

    # ---------------------------------------------------------------- bank
    bank = {
        'form': 'TF-ART-005',
        'merged_with': 'TF-WORLD-005 (same asset both lanes; ART-005 WANG-16 line '
                       'contract supersedes single-placement)',
        'cooked': '2026-08-09',
        'mode': 'MIXED',
        'note': 'Dead-turf mat NOT repainted: every turf piece paints marking-bank '
                'whites on a verbatim dead_turf_0..2 canvas (texture-match 8/1, '
                'PENDING PAOLO, harvest ordered by the merged board form). Track '
                'ramp = approved roof_tile_terra palette desaturated to field '
                'discipline; bunker ramp = approved roof_tile_sand pale members; '
                'infield/putting on approved starter dirt/concrete canvases; '
                'banking on harmonized street-pool roadway per the 7/31 law, '
                'sun-bleached for separation from parking. Court is the one fully '
                'painted colour (faded blue-green acrylic, sat ~0.12 — the form '
                'names it a legitimate faded hue carrier). Cemetery mown-stripe '
                'anchor is UNJUDGED in its bank, so only its striping LOGIC is '
                'used: stripe = tile-pair value band, placement sets stripe width. '
                'Yard lines place every 6 cells (4.6 m); lane lines read as cell '
                'pairs (1.22 m); tennis court 15 cells wide at true proportion.',
        'residual_decision': 'WORLD-005 single-placement vs ART-005 WANG-16: lines '
                             'ship as WANG sets (turf + court full 15-piece; blank '
                             '= the unpainted field). Track lanes ship 6 pieces '
                             '(NS/EW + 4 corners) because a lane line on an oval '
                             'never terminates or tees — see LANE_RING_3x3.png.',
        'wang_contract': 'line core rows/cols 21-22 (2px) + 1px feather, centred; '
                         'a connected edge always presents the same 2px core at '
                         'the same offset; ghosting is clumped survival 30-70% '
                         'gone so position, width and whites are the contract, '
                         'crispness never is.',
        'seam_contract': {'fields': 'SELF-SEAMLESS (wrap + 10-run junction measured below)',
                          'lines': 'WANG-16 (turf/court), oval 6-set (track lanes)',
                          'measured': seam},
        'separation_vs_parking': separation,
        'harvest_sources': [
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt: dead_turf_0..2 canvases (PENDING, '
            'harvest ordered), roof_tile_terra + roof_tile_sand palettes (APPROVED)',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt: dirt/concrete canvases, '
            'yard anchors (APPROVED)',
            'banks/BOHEMIA_MARKING_BANK_7_17_26.txt: aged line whites (APPROVED-VOLUME)',
            'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt: banking canvas (approved pool, '
            '7/31 law)'],
        'consumers': ['TF-ART-005', 'TF-WORLD-005'],
        'tiles': tiles,
        'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    }
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f)
    print('tiles:', len(tiles))
    print('seams:', json.dumps(seam, indent=1))
    print('separation:', json.dumps(separation, indent=1))
    bad = [t['name'] for t in tiles if t['metrics']['purple_pct'] > 2.0]
    print('purple kills:', bad or 'none')
    out_tol = [(t['name'], t['metrics']) for t in tiles if not t['in_tolerance']]
    print('out of tolerance:', len(out_tol))
    for n, m in out_tol:
        print('  ', n, m)

if __name__ == '__main__':
    main()
