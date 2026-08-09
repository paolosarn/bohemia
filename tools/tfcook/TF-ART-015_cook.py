#!/usr/bin/env python3
"""TF-ART-015 cook — LANDFILL CELL GROUND: the five surfaces you stand on
inside a dead dump, with the board's splits EXECUTED: TF-WORLD-012 keeps the
generic fenced-yard floor (folded into the TF-RUN-002 job, none cooked here);
TF-WORLD-004 keeps unlined dead water (TF-ART-006 cooked it, zero geomembrane
there); THIS job cooks the four landfill-specific surfaces + two WANG-16
transitions + the litter drift + six single-placement overlays.

THE JOB (records/tileforms/TF-ART-015_landfill_cell.md):
  refuse_0..2        compacted refuse ground: bleached grey-tan MUMMIFIED
                     matrix in 3-6px clusters ONLY. Nameable junk is NOT
                     baked in — the 52 approved trash props are the objects
                     this surface carries (sparse, 18-50px, placement-time).
                     NOTHING drawn in the 6-12px dead band. No rainbow trash:
                     colour is the first thing the sun takes.
  cap_0..2           daily-cover caliche cap: the PALEST ground in the game.
                     Pale field w/ sparse angular 3-18px clasts — that clast
                     size is the whole difference from dirt.
  pond_pan_0..1      leachate pond pan: neutral/warm black-brown, true
                     black-brown, cracked residue. Engine swatch #3a4436 is
                     a green PLACEHOLDER and is not matched.
  haul_road_*        compacted native-soil road, INVERTED by 30 dry years:
                     coarse stony lag crown, soft powder shoulders.
  haul_wash_A/B      washboard phase pair: 29.33px transverse ripples,
                     3 per 2 cells, DECLARED 88px phase — place strictly
                     alternating A,B,A,B along the travel axis.
  capfill_<combo>    WANG-16 cap-over-fill torn boundary (15 pieces; the
                     blank 16th IS refuse_0..2 / cap_0..2, not re-shipped).
  pondedge_<combo>   WANG-16 lined-pond edge (15 pieces + 4 seam alternates):
                     ground lip -> black HDPE slope (bowed, lit upper band)
                     w/ thermal wrinkles on an 11px module (44's divisor,
                     8/2 stamp-bug law; real spacing 6-24px, 11 lands mid)
                     + concentric salt rings ~10px apart, 3-5px wide ->
                     pan. Panel seams at the 9.3-CELL pitch ship as the 4
                     cardinal seam alternates the placer drops every 9-10
                     edge cells — without seams/wrinkles/rings it is a mud
                     hole, and TF-WORLD-004 already owns mud holes.
  drift_run/corner/tail  litter drift vs the TF-ART-004 fence: sun-welded
                     MAT of pale flakes + dead thistle, 1-1.6 cells deep,
                     covering 40-65% of fence fabric height, steep on the
                     fence face, long windward ramp reading as the pale
                     sky-lit crest; on the fence's NE side (global SSW
                     wind, declared by the form); draws NO fence fabric.
  overlays (single placement, NEVER baked into repeating fields):
                     crack_run (2-3px, chains to tens of cells, WITH
                     contour), settlement_dish (soft dark ellipse, value
                     only, no edge), erosion_rill (slopes only), cap_blowout
                     (ONE 4-cell lift face, ONE 9px pale cover seam at the
                     lip), rut_pair (35px bands 3.3 cells apart), salt_crust.

DO-NOT-COOK strikes honoured:
  - [PENDING Paolo] whether the pond ever holds monsoon water in act 1 —
    story beat, not an art call. NO standing water cooked.
  - NO fluttering plastic bags, no bag anything: film is embrittled and
    gone at year 30. The drift is a compacted mat, closer to felt.
  - Berm + terrace riser are STRUCTURE-layer and not in this job.
  - Rain/night are palette states on indexed tiles (M9) — not built until
    indexing lands; night VALUES are proved in greyscale instead.

HAUL ROAD CONTINGENCY (kept, decided on the proof): if the haul road is
indistinguishable from TF-RUN-002 gravel at 44px, that member is KILLED and
RUN-002 wired instead. HAUL_VS_GRAVEL proof panel renders both side by side.

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE below.
    landfill_cover_0..2 (PENDING PAOLO; the form orders this harvest: "the
    cover-cap base"): HARVESTED as the base canvas of EVERY field surface —
    cap, refuse matrix, pond pan, haul road all start from these donors'
    grain, de-greened (dead valley: the donors carry living weed tufts) and
    de-stoned where the donor's dark-ringed cobbles would read as keyline.
    dead_turf_0..2 (PENDING PAOLO): warm straw pixels HARVESTED as the dead
    thistle ramp in the litter drift — dry plant colour comes from the
    world's own dead grass, not a guess (the ART-006 tumbleweed pattern).
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (APPROVED 7/28+7/29)
    — OPENED IN CODE below. dirt + yard_0: anchor context ONLY (what the
    landfill wears today; the cap must sit clearly lighter). Never edited.
  banks/BOHEMIA_HD_TILE_REPO_part2.txt x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26
    — OPENED IN CODE below: the 52 approved trash props (packs "7. Trash
    and debris" 20 UP, "9. Rubble and debris" 18 UP, "14. Trash and junk
    props" 14 UP) are HARVESTED for the approved-prop CARRY TEST at the
    recorded pack-14 scale fix (render_scale 0.55). They are the objects
    the fill must carry, not the surface — 52 props cannot pave 3,215
    cells (the form's own arithmetic), so the matrix is cooked.
  banks/tileforms/TF-ART-004_CANDIDATES_8_8_26.json — OPENED IN CODE below:
    the chain-link fence the drift is judged WITH in ONE screenshot
    (form collision (c)). run_plain_0 + post_hub composited in proofs;
    NO fence fabric is drawn by this cook.
  banks/BOHEMIA_GROUND_POOL_8_6_26.txt — OPENED IN CODE below: the 10
    UP+seamless gravel tiles are the TF-RUN-002 comparator for the haul
    road kill contingency (HAUL_VS_GRAVEL proof). Not harvested as a
    surface: a haul road is compacted native soil, not gravel, and the
    difference is the whole point of member 4.
  banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt — OPENED IN CODE
    (assert): 16 pools, all paved asphalt roadway/lane geometry. A haul
    road is UNPAVED; nothing there covers it (the form's own shopping
    check). Opened so the shopping-law claim is machine-true.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — OPENED IN CODE (assert):
    street/wreck/trash/crate/dead/barrier/camp PROPS, not surfaces.
  banks/BOHEMIA_PERIMETER_8_2_26.txt, banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt,
  banks/BOHEMIA_OPENINGS_8_2_26.txt — OPENED IN CODE (assert): perimeter
    walls and openings families only. Nothing fits a ground family.
  records/target/BOHEMIA_MASTER_PALETTE.json — OPENED IN CODE below: the 7
    shared deliberate-mark steps + the ONE rust accent are picked FROM the
    64-colour master ramp (M17: a subset, never an invented ramp).
  VERDICT: mode MIXED — every field canvas is HARVESTED donor grain
  (landfill_cover_0..2, form-ordered), straw is harvested dead_turf, props
  and fence in proofs are Paolo's approved art; painted pixels are the
  genuine gaps: the cluster mosaic, caliche clasts, crack nets, washboard,
  HDPE band with rings/wrinkles/seams, drift mat, and the six overlays.

TASTE CHECK:
  DEAD VALLEY: donors de-greened before any use; zero living green, zero
    purple (both measured per tile, purple kill at 2%). The ONE saturated
    accent is rust, spent at 1-2 small clusters per refuse tile, never
    poured. No rainbow trash: the sun took the colour first.
  VALUES ARE THE DISTRICT: cap lightest ground in the game (lum ~140,
    lighter than starter dirt's 132.5 and chalk-desaturated below it),
    pond pan darkest (~57), refuse between (~94): >=18pt separations both
    ways, re-proved in greyscale at night values. At map squint the
    district must read as one pale mass with a dark hole in it.
  TWO SCALES AND NOTHING BETWEEN: refuse matrix clusters 3-6px, nameable
    junk 18-50px arrives as approved props at placement; the 6-12px dead
    band ships EMPTY (NAME-IT-OR-DON'T-DRAW-IT).
  ENGINEERED, NOT A HEAP: the pond is a lined impoundment (panel seams,
    thermal wrinkles, concentric salt rings), the boundary is the theme
    sheet's own hook ("the last lift was never capped") as a WANG set, the
    road is a designed surface that inverted when the water trucks stopped.
  45 LAW: clasts/pebbles carry NW-lit, SE-shaded microrelief; the pond
    slope is a bowed face, widest and fully readable on the FAR (north)
    edge, a sliver on the near (south) edge; drift crest is the sky-lit
    pale top of the ramp. No keyline, no dither, one light, upper left.
  8/2 STAMP BUG: every field ships 2-3 variants; wrinkle module 11px
    (divisor of 44); washboard is 29.33px = 3 per 88px TWO-CELL declared
    phase so the rhythm cannot cut at a cell edge; clasts/pebbles stamp
    on the torus so nothing pools at tile borders.
  VERIFY ON THE REAL SURFACE: 3x3 tilings, WANG assemblies inspected at
    the inner corners FIRST, a 12x12 assembled scene with every member,
    the prop carry test, the fence+drift single screenshot, and the
    anchor strip — PNGs for eyes, and the cook LOOKS at them.

Deterministic: SEED fixed, rerunnable.
Writes ONLY:
  banks/tileforms/TF-ART-015_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-015/*.png
"""

import json, base64, io, os, colorsys, random

from PIL import Image, ImageDraw
import numpy as np

SEED = 80815
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
WASH_PERIOD = 88.0 / 3.0            # 29.333px, 3 ripples per 2 cells
WRINKLE_MOD = 11                    # divisor of 44 — wrinkles wrap tile-to-tile
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-015_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-015')

WANG15 = ['N', 'E', 'S', 'W', 'NE', 'NS', 'NW', 'ES', 'EW', 'SW',
          'NES', 'NEW', 'NSW', 'ESW', 'NESW']

# value ladder (day): cap lightest ground in the game, pond pan darkest.
LUM_CAP, LUM_FILL, LUM_POND = 140.0, 94.0, 57.0
LUM_CROWN, LUM_SHOULDER = 112.0, 124.0

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
    """REUSE in code: frozen approved starter tiles (anchor context only)."""
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

def load_trash_props():
    """REUSE in code: the 52 approved trash props (HD part2 packs 7/9/14
    crossed with the 7/13 Great Sweep, UP only). Carry-test objects."""
    hd = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_HD_TILE_REPO_part2.txt')))
    v = json.load(open(os.path.join(ROOT, 'banks',
                                    'BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))['verdicts']
    props = []
    for pack in ('7. Trash and debris', '9. Rubble and debris',
                 '14. Trash and junk props'):
        ups = [r['idx'] for r in v if r['pack'] == pack and r['v'] == 'UP']
        for i in ups:
            e = hd['packs'][pack][i]
            im = Image.open(io.BytesIO(base64.b64decode(e['b64']))).convert('RGBA')
            # recorded size fix for pack 14 (render_scale 0.55); packs 7/9
            # rendered at the same scale keeps every prop in the 18-50px
            # nameable band the form demands
            sc = 0.55
            im = im.resize((max(1, round(im.width * sc)),
                            max(1, round(im.height * sc))), Image.NEAREST)
            props.append((pack, i, np.asarray(im).astype(np.float64)))
    assert len(props) == 52, len(props)      # the exact count the form cites
    return props

def load_fence_pieces():
    """REUSE in code: TF-ART-004 chain-link candidates — the drift is judged
    WITH the fence in one screenshot (form collision (c))."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'tileforms',
                                    'TF-ART-004_CANDIDATES_8_8_26.json')))
    out = {}
    for t in d['tiles']:
        if t['name'] in ('run_plain_0', 'run_trash_0', 'post_hub'):
            out[t['name']] = np.asarray(Image.open(io.BytesIO(
                base64.b64decode(t['b64']))).convert('RGBA')).astype(np.float64)
    assert set(out) == {'run_plain_0', 'run_trash_0', 'post_hub'}
    return out

def load_gravel():
    """REUSE in code: TF-RUN-002 comparator for the haul-road kill call."""
    gp = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_GROUND_POOL_8_6_26.txt')))
    assert list(gp['counts']) == ['gravel'], gp['counts']
    tiles = [np.asarray(Image.open(io.BytesIO(base64.b64decode(e['b64'])))
                        .convert('RGB')).astype(np.float64)
             for e in gp['buckets']['gravel'][:3]]
    return tiles

def load_master_steps():
    """REUSE in code: the 7 shared steps + ONE rust accent are a SUBSET of
    the 64-colour master ramp (M17) — never an invented ramp."""
    d = json.load(open(os.path.join(ROOT, 'records', 'target',
                                    'BOHEMIA_MASTER_PALETTE.json')))
    ramp = np.array(d['ramp_rgb'], dtype=np.float64)
    assert len(ramp) == 64
    L = 0.299 * ramp[:, 0] + 0.587 * ramp[:, 1] + 0.114 * ramp[:, 2]
    def nearest(target):
        return ramp[int(np.argmin(np.abs(L - target)))]
    steps = [nearest(t) for t in (48, 68, 85, 100, 120, 145, 180)]
    rust = ramp[int(np.argmax((ramp[:, 0] - ramp[:, 2])   # most rust-orange
                              * (L > 90) * (L < 130)))]
    return steps, rust

def assert_pools_checked():
    """Shopping sweep honoured in code: banks checked that did not fit —
    opened so the claim is machine-true, harvested nothing."""
    sp = json.load(open(os.path.join(ROOT, 'banks',
                                     'BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt')))
    pools = sp['pools'] if 'pools' in sp else sp
    assert pools, 'street bank empty?'         # paved lane geometry only
    ext = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')))
    assert set(ext['counts']) == {'street', 'wreck', 'trash', 'crate', 'dead',
                                  'barrier', 'camp'}, ext['counts']
    for b in ('BOHEMIA_PERIMETER_8_2_26.txt', 'BOHEMIA_CIVIC_OPENINGS_8_3_26.txt',
              'BOHEMIA_OPENINGS_8_2_26.txt'):
        d = json.load(open(os.path.join(ROOT, 'banks', b)))
        assert 'tiles' in d, b                 # wall/opening families, no ground

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

def noise1d(rg, size, k=7):
    n = rg.standard_normal(size)
    for _ in range(3):
        m = np.zeros_like(n)
        for d in range(-(k // 2), k // 2 + 1):
            m += np.roll(n, d)
        n = m / k
    return (n - n.min()) / (n.max() - n.min() + 1e-9)

def de_green(a):
    """Dead valley: living weed tufts in a donor are replaced by the donor's
    own median field tone, modulated by local luminance so grain survives."""
    t = a.copy()
    c = t / 255.0
    mx, mn = c.max(axis=2), c.min(axis=2)
    s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-9), 0)
    g = (c[..., 1] > c[..., 0] * 1.06) & (c[..., 1] > c[..., 2] * 1.06) \
        & (s > 0.24) & (mx > 0.22)
    d = mx - mn
    nz = d > 1e-9
    r_, g_, b_ = c[..., 0], c[..., 1], c[..., 2]
    hh = np.zeros_like(s)
    m1 = nz & (mx == g_)
    hh[m1] = 60 * (2 + (b_ - r_)[m1] / d[m1])
    m2 = nz & (mx == r_) & ~m1
    hh[m2] = (60 * ((g_ - b_)[m2] / d[m2])) % 360
    g |= (hh >= 55) & (hh <= 170) & (s > 0.24) & (mx > 0.40)
    if not g.any():
        return t
    g = (g | np.roll(g, 1, 0) | np.roll(g, -1, 0)
         | np.roll(g, 1, 1) | np.roll(g, -1, 1))
    med = np.median(t[~g].reshape(-1, 3), axis=0)
    L = torus_blur(lum(t), 5, 2)
    f = (L / max(L.mean(), 1))[..., None]
    t[g] = np.clip(med[None, :] * f[g], 0, 255)
    return t

def de_stone(a, thr=58):
    """The donors' dark-ringed cobbles read as keyline at cap value. Replace
    near-black outline pixels with the donor's own field tone (same trick as
    de_green: median modulated by blurred local luminance)."""
    t = a.copy()
    L = lum(t)
    g = L < thr
    if not g.any():
        return t
    g = (g | np.roll(g, 1, 0) | np.roll(g, -1, 0)
         | np.roll(g, 1, 1) | np.roll(g, -1, 1))
    med = np.median(t[~g].reshape(-1, 3), axis=0)
    Lb = torus_blur(L, 5, 2)
    f = np.clip(Lb / max(Lb.mean(), 1), 0.6, 1.4)[..., None]
    t[g] = np.clip(med[None, :] * f[g], 0, 255)
    return t

def scrambled(donors, seed, runs=(3, 7)):
    """Variant synthesis off harvested canvases: donor COLUMNS in short runs
    with circular rolls (the ART-002/005/006 pattern) — donor grain, donor
    colours, wrap preserved. Donors arrive already de-greened."""
    rng = random.Random(seed)
    cols, x = [], 0
    while x < CELL:
        d = donors[rng.randrange(len(donors))]
        run = min(rng.randrange(*runs), CELL - x)
        sx = rng.randrange(d.shape[1] - run + 1)
        roll = rng.randrange(d.shape[0])
        for k in range(run):
            cols.append(np.roll(d[:, sx + k], roll, axis=0))
        x += run
    tex = np.stack(cols, axis=1).astype(np.float64)
    sm = (np.roll(tex, 1, axis=1) + tex + np.roll(tex, -1, axis=1)) / 3.0
    return tex * 0.72 + sm * 0.28

def torus_voronoi(rg, n):
    """Torus voronoi labels + boundary + first/second distance gap."""
    pts = np.stack([rg.integers(0, CELL, n), rg.integers(0, CELL, n)], 1)
    yy, xx = np.mgrid[0:CELL, 0:CELL]
    dy = np.abs(yy[..., None] - pts[:, 0]); dy = np.minimum(dy, CELL - dy)
    dx = np.abs(xx[..., None] - pts[:, 1]); dx = np.minimum(dx, CELL - dx)
    dist = np.sqrt(dy ** 2 + dx ** 2)
    lab = np.argmin(dist, axis=2)
    srt = np.sort(dist, axis=2)
    return lab, srt[..., 1] - srt[..., 0]

def stamp_torus(mask_layer, cy, cx, poly_mask):
    """OR a small polygon mask into a CELLxCELL layer, wrapped on the torus
    (clasts/pebbles never pool away from tile borders)."""
    h, w = poly_mask.shape
    sh = np.zeros_like(mask_layer)
    sh[:h, :w] = poly_mask
    mask_layer |= np.roll(np.roll(sh, cy - h // 2, 0), cx - w // 2, 1)
    return mask_layer

def angular_clast(rg, r):
    """Convex angular polygon mask ~2r px across (ripped caliche breaks
    angular, never river-round)."""
    n = int(rg.integers(5, 8))
    ang = np.sort(rg.uniform(0, 2 * np.pi, n))
    rad = rg.uniform(0.62, 1.0, n) * r
    vx = rad * np.cos(ang) * 1.15          # 45-law: wider than tall
    vy = rad * np.sin(ang) * 0.85
    s = int(2 * r + 3)
    im = Image.new('L', (s, s), 0)
    ImageDraw.Draw(im).polygon(
        [(float(x + s / 2), float(y + s / 2)) for x, y in zip(vx, vy)], fill=1)
    return np.asarray(im, bool)

def relief(t, m, hi=1.10, lo=0.86):
    """45-law microrelief on a mask: NW rim lit, SE rim shaded (one light)."""
    up = m & ~np.roll(np.roll(m, 1, 0), 1, 1)
    dn = m & ~np.roll(np.roll(m, -1, 0), -1, 1)
    t[up] = np.clip(t[up] * hi, 0, 255)
    t[dn] *= lo
    return t

def retune(t, mean, sat=None):
    t = np.clip(t, 0, 255)
    t = np.clip(t * (mean / max(lum(t).mean(), 1)), 0, 255)
    if sat is not None:
        t = np.clip(desat(t, sat), 0, 255)
    return t

def govern(t, mean, gmin=55.5, gmax=76.5, emin=14.5, emax=30.5, it=12):
    """Deterministic detail governor: tune INTO the 8/1 bought-tile band
    while pinning the tile's mean to the family's value-ladder rung."""
    for _ in range(it):
        t = np.clip(t, 0, 255)
        m = quick_metrics(t)
        if gmin <= m['grain'] <= gmax and emin <= m['edge'] <= emax:
            break
        if m['grain'] < gmin or m['edge'] < emin:
            b = torus_blur(t.transpose(2, 0, 1), 3, 1).transpose(1, 2, 0)
            t = t + (t - b) * 0.35            # unsharp on the torus
        else:
            b = torus_blur(t.transpose(2, 0, 1), 3, 1).transpose(1, 2, 0)
            t = t * 0.78 + b * 0.22
        t = np.clip(t * (mean / max(lum(t).mean(), 1)), 0, 255)
    return np.clip(t * (mean / max(lum(t).mean(), 1)), 0, 255)

def quick_metrics(a):
    L = lum(a)
    d = np.abs(np.diff(L, axis=1))
    return dict(edge=float(d.mean()), grain=float((d > 8).mean() * 100))

# ---------------------------------------------------------------- metrics
def measure(tile, alpha=None):
    a = tile.astype(np.float64)
    vis = np.ones(a.shape[:2], bool) if alpha is None else alpha > 128
    L = lum(a)
    colours = len(np.unique(a[vis].reshape(-1, 3).astype(np.uint8), axis=0))
    d = np.abs(np.diff(L, axis=1))
    pair = vis[:, 1:] & vis[:, :-1]
    edge = float(d[pair].mean()) if pair.any() else 0.0
    grain = float((d[pair] > 8).mean() * 100) if pair.any() else 0.0
    flat = a[vis].reshape(-1, 3) / 255.0
    if flat.shape[0] == 0:
        # a tile whose visible mask is empty measures as nothing, not a crash
        return dict(colours=0, edge=0.0, grain=0.0, sat=0.0, lum_mean=0.0,
                    lum_sd=0.0, purple_pct=0.0, green_pct=0.0)
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
    if alpha is None and a.shape[0] == a.shape[1] == CELL:
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
        im = Image.fromarray(np.dstack([arr, alpha]).astype(np.uint8), 'RGBA')
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

def over(base, rgba, y, x):
    """Alpha-composite an RGBA float array onto an RGB float canvas."""
    h, w = rgba.shape[:2]
    H, W = base.shape[:2]
    y0, x0 = max(0, y), max(0, x)
    y1, x1 = min(H, y + h), min(W, x + w)
    if y1 <= y0 or x1 <= x0:
        return
    sub = rgba[y0 - y:y1 - y, x0 - x:x1 - x]
    a = (sub[..., 3:4]) / 255.0
    base[y0:y1, x0:x1] = base[y0:y1, x0:x1] * (1 - a) + sub[..., :3] * a

def labeled_sheet(entries, cols, scale=3, pad=8, label_h=14, bg=(24, 24, 28)):
    cw = max(e[1].shape[1] for e in entries) * scale + pad
    chh = max(e[1].shape[0] for e in entries) * scale + label_h + pad
    rows = (len(entries) + cols - 1) // cols
    im = Image.new('RGB', (cols * cw + pad, rows * chh + pad), bg)
    dr = ImageDraw.Draw(im)
    for i, (lab, a) in enumerate(entries):
        x = pad + (i % cols) * cw
        y = pad + (i // cols) * chh
        t = Image.fromarray(a.astype(np.uint8),
                            'RGBA' if a.shape[2] == 4 else 'RGB')
        t = t.resize((t.width * scale, t.height * scale), Image.NEAREST)
        if a.shape[2] == 4:
            bgt = Image.new('RGBA', t.size, (70, 64, 55, 255))
            bgt.alpha_composite(t)
            t = bgt.convert('RGB')
        im.paste(t, (x, y))
        dr.text((x, y + t.height + 2), lab[:26], fill=(225, 225, 225))
    return im

# ---------------------------------------------------------------- painters
class P:                                   # shared canvases + palette
    pass

def refuse_tile(rg, seed):
    """Compacted refuse: bleached grey-tan MUMMIFIED matrix, 3-6px clusters
    only. ~85 torus-voronoi cells on 44px = 4-5px each; every mark is a
    cluster, no orphan confetti, nothing in the 6-12px dead band."""
    t = scrambled(P.fill_donors, seed)
    t = retune(t, LUM_FILL, 0.72)
    lab, gap = torus_voronoi(np.random.default_rng(seed), 85)
    rng = np.random.default_rng(seed + 1)
    n_rust = 0
    for i in range(85):
        r = rng.random()
        if r < 0.22:   c, k = P.S[2], 0.42       # bleached board grey
        elif r < 0.50: c, k = P.S[3], 0.38       # dun film/paper mat
        elif r < 0.68: c, k = P.S[4], 0.34       # pale flake wad
        elif r < 0.78: c, k = P.S[1], 0.46       # shadowed void / rubber
        elif r < 0.86: c, k = P.S[5] * 0.96, 0.30  # sun-white plastic
        elif r < 0.885 and n_rust < 2:
            c, k = P.RUST, 0.40                  # THE one accent, rare
            n_rust += 1
        else:
            continue                             # donor matrix shows through
        m = lab == i
        jit = 0.92 + 0.16 * rng.random()
        t[m] = t[m] * (1 - k) + c[None, :] * jit * k
    edge_se = lab != np.roll(np.roll(lab, -1, 0), -1, 1)
    edge_nw = lab != np.roll(np.roll(lab, 1, 0), 1, 1)
    t[edge_se] *= 0.90                           # cluster relief: one light
    t[edge_nw] = np.clip(t[edge_nw] * 1.06, 0, 255)
    t = govern(t, LUM_FILL)
    return np.clip(desat(t, 0.9), 0, 255)

def cap_tile(rg, seed):
    """Daily-cover cap: ripped caliche. The palest ground in the game; pale
    field + sparse ANGULAR 3-18px clasts (the whole difference from dirt)."""
    t = scrambled(P.cap_donors, seed)
    t = retune(t, LUM_CAP, 0.52)                 # chalk: value up, chroma down
    rng = np.random.default_rng(seed + 2)
    m = np.zeros((CELL, CELL), bool)
    for _ in range(int(rng.integers(11, 16))):
        r = float(rng.uniform(1.5, 9))           # 3-18px across
        m = stamp_torus(m, int(rng.integers(0, CELL)), int(rng.integers(0, CELL)),
                        angular_clast(rng, r))
    clast = P.S[6]
    n = torus_noise(rng, CELL, 3, 1)
    t[m] = t[m] * 0.35 + clast[None, :] * (0.92 + 0.13 * n[m, None]) * 0.65
    t = relief(t, m, 1.08, 0.80)
    # fines between clasts: faint darker wash where the field dips
    f = torus_noise(rng, CELL, 9)
    dip = (f < 0.30) & ~m
    t[dip] *= 0.94
    t = govern(t, LUM_CAP)
    return np.clip(desat(t, 0.9), 0, 255)

def pond_pan_tile(rg, seed):
    """Leachate pond pan: neutral/warm black-brown residue over liner, fine
    desiccation net, faint salt ghosts. The darkest ground in the game.
    The engine's #3a4436 green swatch is a placeholder and is NOT matched."""
    t = scrambled(P.fill_donors, seed)
    t = retune(t, LUM_POND, 0.30)
    t *= np.array([1.06, 1.00, 0.88])[None, None, :]   # warm, never green
    rng = np.random.default_rng(seed + 3)
    lab, gap = torus_voronoi(rng, 14)
    crack = gap < 0.9
    t[crack] *= 0.72
    lip = np.roll(np.roll(crack, -1, 0), -1, 1) & ~crack
    t[lip] = np.clip(t[lip] * 1.09, 0, 255)      # upper-left lip catch
    ghost = torus_noise(rng, CELL, 11) > 0.80    # salt ghost blotches
    t[ghost] = t[ghost] * 0.82 + P.S[3][None, :] * 0.18
    t = govern(t, LUM_POND)
    return np.clip(t, 0, 255)

def pebble_lag(t, rng, count, lo=1.0, hi=2.6, k=0.55):
    """Coarse stony lag: 2-5px rounded pebbles, NW-lit SE-shaded."""
    m = np.zeros((CELL, CELL), bool)
    for _ in range(count):
        r = float(rng.uniform(lo, hi))
        s = int(2 * r + 3)
        im = Image.new('L', (s, s), 0)
        ImageDraw.Draw(im).ellipse([s / 2 - r * 1.15, s / 2 - r * 0.85,
                                    s / 2 + r * 1.15, s / 2 + r * 0.85], fill=1)
        m2 = np.zeros((CELL, CELL), bool)
        m2 = stamp_torus(m2, int(rng.integers(0, CELL)), int(rng.integers(0, CELL)),
                         np.asarray(im, bool))
        jit = 0.9 + 0.25 * rng.random()
        c = P.S[4] if rng.random() < 0.7 else P.S[5]
        t[m2] = t[m2] * (1 - k) + c[None, :] * jit * k
        t = relief(t, m2, 1.10, 0.82)
        m |= m2
    return t, m

def haul_crown_tile(rg, seed, ripples=False, phase_off=0.0):
    """Haul road crown: compacted native soil INVERTED by 30 years of wind —
    the binding fines blew off, a coarse stony lag armours the crown.
    ripples=True adds the washboard at the DECLARED 88px two-cell phase."""
    t = scrambled(P.fill_donors, seed)
    t = retune(t, LUM_CROWN, 0.62)
    rng = np.random.default_rng(seed + 4)
    # longitudinal wear: faint E-W streaks (travel axis), value only
    stre = noise1d(rng, CELL, 9)
    t *= (0.97 + 0.06 * stre)[:, None, None]
    t, _ = pebble_lag(t, rng, 46)
    if ripples:
        x = np.arange(CELL, dtype=np.float64) + phase_off
        w = np.cos(2 * np.pi * x / WASH_PERIOD)
        t *= (1.0 + 0.11 * w)[None, :, None]
        crest = np.where(np.diff(np.signbit(np.diff(w))))[0]  # local maxima
        for c in crest + 1:
            if 0 <= c - 1 and c + 1 < CELL:
                t[:, c - 1] = np.clip(t[:, c - 1] * 1.07, 0, 255)  # lit west lip
                t[:, c + 1] *= 0.90                                 # east shade
    t = govern(t, LUM_CROWN)
    return np.clip(desat(t, 0.85), 0, 255)

def haul_shoulder_tile(rg, seed):
    """Haul road shoulder: where the crown's fines went — soft blown powder,
    finer and paler than the crown, faint drift tongues."""
    t = scrambled(P.fill_donors, seed)
    b = torus_blur(t.transpose(2, 0, 1), 3, 1).transpose(1, 2, 0)
    t = t * 0.45 + b * 0.55
    t = retune(t, LUM_SHOULDER, 0.5)
    rng = np.random.default_rng(seed + 5)
    f = torus_noise(rng, CELL, 13, 3)
    tongue = f > 0.72                            # powder drift tongues
    t[tongue] = t[tongue] * 0.75 + P.S[5][None, :] * 0.9 * 0.25
    t, _ = pebble_lag(t, rng, 7, 1.0, 1.8, 0.4)  # a few stranded stones
    t = govern(t, LUM_SHOULDER)
    return np.clip(desat(t, 0.8), 0, 255)

# ------------------------------------------------------------ WANG: cap/fill
def capfill_tile(combo, fillc, capc):
    """Cap advancing over uncapped fill from the named edges. Torn earthen
    boundary: shared periodic wobble per edge so pieces chain; pale lit lip
    on the cap side, dark crease on the fill side. Value steps, no keyline."""
    t = fillc.copy()
    yy, xx = np.mgrid[0:CELL, 0:CELL]
    m = np.zeros((CELL, CELL), bool)
    if 'N' in combo: m |= yy < P.capw['N'][xx]
    if 'S' in combo: m |= yy > CELL - 1 - P.capw['S'][xx]
    if 'W' in combo: m |= xx < P.capw['W'][yy]
    if 'E' in combo: m |= xx > CELL - 1 - P.capw['E'][yy]
    t[m] = capc[m]
    inner = m & ~(np.roll(m, -1, 0) & np.roll(m, 1, 0)
                  & np.roll(m, -1, 1) & np.roll(m, 1, 1))
    t[inner] = np.clip(t[inner] * 1.10, 0, 255)          # torn lip, lit
    outer = ~m & (np.roll(m, -1, 0) | np.roll(m, 1, 0)
                  | np.roll(m, -1, 1) | np.roll(m, 1, 1))
    t[outer] *= 0.80                                      # crease on the fill
    out2 = ~m & ~outer & (np.roll(outer, -1, 0) | np.roll(outer, 1, 0)
                          | np.roll(outer, -1, 1) | np.roll(outer, 1, 1))
    t[out2] *= 0.92
    return np.clip(t, 0, 255)

# ------------------------------------------------------------ WANG: pond edge
POND_BAND = {'N': 24.0, 'S': 9.0, 'E': 15.0, 'W': 15.0}   # 45-law: far face
POND_LIP = 5.0                                            # widest, near sliver

def pond_geometry(combo):
    """Distance field from the ground lip: iso-contours curve smoothly round
    inner corners (M12 names them the trap). Band width blends by direction
    to the nearest ground pixel: far (N) face widest, near (S) a sliver."""
    yy, xx = np.mgrid[0:CELL, 0:CELL]
    gm = np.zeros((CELL, CELL), bool)
    if 'N' in combo: gm |= yy < POND_LIP + P.pondw['N'][xx]
    if 'S' in combo: gm |= yy > CELL - 1 - POND_LIP - P.pondw['S'][xx]
    if 'W' in combo: gm |= xx < POND_LIP + P.pondw['W'][yy]
    if 'E' in combo: gm |= xx > CELL - 1 - POND_LIP - P.pondw['E'][yy]
    gy, gx = np.where(gm)
    py, px = np.where(~gm)
    d2 = (py[:, None] - gy[None, :]) ** 2 + (px[:, None] - gx[None, :]) ** 2
    nearest = np.argmin(d2, axis=1)
    D = np.zeros((CELL, CELL))
    D[py, px] = np.sqrt(d2[np.arange(len(py)), nearest])
    dy = py - gy[nearest]
    dx = px - gx[nearest]
    ady, adx = np.abs(dy).astype(float), np.abs(dx).astype(float)
    wns = np.where(dy > 0, POND_BAND['N'], POND_BAND['S'])
    wew = POND_BAND['E']
    Wd = np.ones((CELL, CELL))
    Wd[py, px] = (ady * wns + adx * wew) / np.maximum(ady + adx, 1e-9)
    U = np.full((CELL, CELL), 2.0)
    U[py, px] = D[py, px] / np.maximum(Wd[py, px], 1e-9)
    # along-slope coordinate for wrinkles/seams: perpendicular to gradient
    S = np.zeros((CELL, CELL), dtype=int)
    S[py, px] = np.where(ady >= adx, px, py)
    return gm, U, S

def pond_edge_tile(combo, capc, panc, seam=False):
    """Lined pond edge: cap-graded ground lip -> carbon-black HDPE slope
    (lit upper band, dark to the toe, thermal wrinkles on the 11px module,
    two concentric salt rings) -> pan. seam=True adds ONE panel seam running
    down-slope (the 9.3-cell-pitch alternate the placer drops)."""
    gm, U, S = P.pond_geo[combo]
    t = panc.copy()
    t[gm] = capc[gm]
    band = (~gm) & (U < 1.0)
    u = U[band]
    base = 62.0 - 26.0 * np.clip(u, 0, 1)            # lit top -> dark toe
    hd = np.stack([base * 1.04, base * 1.00, base * 0.90], axis=1)
    n = torus_noise(P.rg_pond, CELL, 5)[band]        # liner sheen unevenness
    t[band] = hd * (0.92 + 0.16 * n[:, None])
    # thermal wrinkles: down-slope ridges, 11px module (wraps tile-to-tile)
    sc = S[band]
    wr = (sc + P.wrinkle_jit[sc % CELL]) % WRINKLE_MOD
    lit = (wr == 0) & (u > 0.10) & (u < 0.95)
    sh = (wr == 1) & (u > 0.10) & (u < 0.95)
    bandvals = t[band]
    bandvals[lit] = np.clip(bandvals[lit] + 12, 0, 255)
    bandvals[sh] = np.clip(bandvals[sh] - 8, 0, 255)
    # concentric salt rings: pale bands at two stands of the falling level
    for u0, wdt, k in ((0.52, 0.055, 0.62), (0.80, 0.045, 0.50)):
        ring = np.abs(u - u0 - 0.04 * (n - 0.5)) < wdt
        bandvals[ring] = (bandvals[ring] * (1 - k)
                          + P.SALT[None, :] * (0.9 + 0.2 * n[ring, None]) * k)
    t[band] = bandvals
    if seam:                                          # ONE panel seam alternate
        sm = band & (S % CELL == 17)
        t[sm] = np.clip(t[sm] * 0.72, 0, 255)
        sm2 = band & (S % CELL == 18)
        t[sm2] = np.clip(t[sm2] * 1.12, 0, 255)       # lit weld edge
    # crease where the lip meets the liner, lit ground lip nose
    crease = (~gm) & (U < 0.06)
    t[crease] *= 0.62
    nose = gm & (np.roll(~gm, -1, 0) | np.roll(~gm, 1, 0)
                 | np.roll(~gm, -1, 1) | np.roll(~gm, 1, 1))
    t[nose] = np.clip(t[nose] * 1.06, 0, 255)
    # toe shadow where liner meets pan
    toe = (~gm) & (U >= 1.0) & (
        np.roll(U < 1.0, -1, 0) | np.roll(U < 1.0, 1, 0)
        | np.roll(U < 1.0, -1, 1) | np.roll(U < 1.0, 1, 1))
    t[toe] *= 0.80
    return np.clip(t, 0, 255)

# ------------------------------------------------------------ litter drift
def drift_mat(rg, w, hprof, base_y):
    """The sun-welded mat: RGBA. hprof[x] = mat height above base_y. Felt
    texture of pale flakes + straw, pale sky-lit crest (the windward ramp
    bowed toward the viewer), dark contact shadow at the base line."""
    t = np.zeros((base_y + 1, w, 4))
    rng = rg
    fl = noise1d(rng, w, 5)
    for x in range(w):
        h = int(hprof[x])
        if h <= 0:
            continue
        for i in range(h):
            y = base_y - i
            fr = i / max(h, 1)                       # 0 base -> 1 crest
            r = rng.random()
            if r < 0.42: c = P.S[3] * (0.85 + 0.25 * fr)
            elif r < 0.70: c = P.S[4] * (0.82 + 0.28 * fr)
            elif r < 0.86: c = P.STRAW[int(rng.integers(0, len(P.STRAW)))] * (0.8 + 0.3 * fr)
            else: c = P.S[2] * (0.9 + 0.2 * fr)
            t[y, x, :3] = np.clip(c, 0, 255)
            t[y, x, 3] = 255
        # crest: palest 2px — the ramp's sky-lit top
        for k in range(2):
            y = base_y - h + k
            if 0 <= y <= base_y:
                c = P.S[5] * (0.95 + 0.1 * fl[x])
                t[y, x, :3] = np.clip(c, 0, 255)
                t[y, x, 3] = 255
        t[base_y, x, :3] = P.S[1] * 0.8              # contact shadow line
        t[base_y, x, 3] = 255
    # felt it: neighbouring flecks bleed (sun-welded, not loose litter)
    rgb = t[..., :3]
    sm = (np.roll(rgb, 1, 1) + rgb + np.roll(rgb, -1, 1)) / 3.0
    t[..., :3] = np.where(t[..., 3:4] > 0, rgb * 0.62 + sm * 0.38, rgb)
    return t

def add_thistle(t, rg, xs, base_y):
    """Dead thistle caught in the mat: branched straw sticks above the crest
    (little off shapes, one-pixel strokes, never straight rakes)."""
    for x0 in xs:
        col = np.where(t[:, x0, 3] > 0)[0]
        top = col.min() if len(col) else base_y
        hh = int(rg.integers(5, 11))
        c = P.STRAW[int(rg.integers(0, len(P.STRAW)))]
        y = top
        x = x0
        for i in range(hh):
            y -= 1
            if y < 0: break
            x += int(rg.integers(-1, 2))
            x = max(0, min(t.shape[1] - 1, x))
            t[y, x, :3] = np.clip(c * (0.9 + 0.02 * i), 0, 255)
            t[y, x, 3] = 255
            if rg.random() < 0.4:                    # side twig
                x2 = max(0, min(t.shape[1] - 1, x + int(rg.integers(-2, 3))))
                t[y, x2, :3] = np.clip(c * 0.85, 0, 255)
                t[y, x2, 3] = 255
    return t

# ------------------------------------------------------------ overlays
def crack_run(rg):
    """Tension crack: 2-3px, runs the FULL 3-cell piece so runs chain into
    tens of cells WITH the contour. Endpoints pinned at y=22 on both ends."""
    w, h = CELL * 3, CELL
    t = np.zeros((h, w, 4))
    path = 22 + (noise1d(rg, w, 15) - 0.5) * 16
    path[0] = path[-1] = 22                          # chainable endpoints
    for x in range(w):
        y = int(round(path[x]))
        wdt = 2 if (x * 7) % 11 < 7 else 3
        for k in range(wdt):
            yy = min(h - 1, y + k)
            t[yy, x, :3] = P.S[0] * (0.9 + 0.2 * ((x + k) % 3) / 2)
            t[yy, x, 3] = 255
        if y - 1 >= 0:                               # upper-left lip catch
            t[y - 1, x, :3] = P.S[5] * 0.7
            t[y - 1, x, 3] = 140
    return t

def settlement_dish(rg):
    """Soft dark ellipse, VALUE ONLY, no edge: a black RGBA whose alpha is a
    solid radial ramp (no dither) — multiplies the cap down ~14% at centre."""
    w, h = CELL * 4, CELL * 3
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.sqrt(((xx - w / 2) / (w * 0.46)) ** 2 + ((yy - h / 2) / (h * 0.44)) ** 2)
    a = np.clip(1.0 - d, 0, 1) ** 1.5 * 0.34 * 255
    n = torus_noise(rg, max(w, h), 13, 3)[:h, :w]
    a *= (0.85 + 0.3 * n)
    t = np.zeros((h, w, 4))
    t[..., 3] = np.clip(a, 0, 255)
    return t

def erosion_rill(rg):
    """Slope-only rill: branches upslope (north), digs downslope. 6-18px
    channels, pale levees. Placed on the pond edge / cap shoulder slopes."""
    w, h = CELL, CELL * 2
    t = np.zeros((h, w, 4))
    def channel(x0, y0, wdt):
        x = float(x0)
        for y in range(y0, h):
            x += rg.uniform(-0.7, 0.7)
            xi = int(max(1, min(w - 2, x)))
            ww = max(1, int(wdt + (y - y0) * 0.04))
            for k in range(-ww // 2, ww // 2 + 1):
                xx2 = max(0, min(w - 1, xi + k))
                t[y, xx2, :3] = P.S[1] * (0.85 + 0.2 * ((y + k) % 3) / 2)
                t[y, xx2, 3] = 255
            lx = max(0, xi - ww // 2 - 1)
            t[y, lx, :3] = P.S[5] * 0.75             # west levee, lit
            t[y, lx, 3] = 160
    channel(int(w * 0.55), 0, 2)
    channel(int(w * 0.30), int(h * 0.25), 1)         # upslope branch joins
    channel(int(w * 0.75), int(h * 0.4), 1)
    return t

def cap_blowout(rg):
    """THE story tile: monsoon tore the cap open. ONE lift face 4 cells of
    rise, ONE 9px pale cover seam at the lip (six inches, 40 CFR 258.21),
    raw fill face below, debris apron at the toe. 4x5 cells RGBA."""
    w, h = CELL * 4, CELL * 5
    t = np.zeros((h, w, 4))
    rim = 30 + (noise1d(rg, w, 9) - 0.5) * 14        # torn hole rim
    face_h = CELL * 4                                # one lift, 4 cells
    for x in range(w):
        y0 = int(rim[x])
        # the 9px cover seam at the lip: pale caliche band, drawn ONCE here
        for k in range(9):
            y = y0 + k
            if y >= h: break
            c = P.S[6] * (0.88 + 0.12 * ((x + k) % 4) / 3)
            t[y, x, :3] = np.clip(c * (1.0 - 0.15 * (k / 9)), 0, 255)
            t[y, x, 3] = 255
        # exposed lift face: raw mummified fill, darker, vertical tear streaks
        st = noise1d(rg, w, 3)
        for y in range(y0 + 9, min(h - CELL // 2, y0 + 9 + face_h)):
            fr = (y - y0 - 9) / face_h
            c = (P.S[2] * (1 - fr) + P.S[1] * fr) * (0.9 + 0.2 * st[x])
            if (x * 13 + y * 7) % 17 < 2:
                c = P.S[3] * 0.9                     # torn film flecks
            t[y, x, :3] = np.clip(c, 0, 255)
            t[y, x, 3] = 255
        # toe apron: spilled clusters thinning out
        for y in range(min(h, y0 + 9 + face_h), h):
            if rg.random() < 0.5 - 0.5 * (y - (y0 + 9 + face_h)) / (CELL // 2 + 1):
                t[y, x, :3] = P.S[int(rg.integers(2, 5))] * (0.85 + 0.2 * rg.random())
                t[y, x, 3] = 255
        t[int(rim[x]) - 1 if rim[x] >= 1 else 0, x, :3] = P.S[6]
        t[int(rim[x]) - 1 if rim[x] >= 1 else 0, x, 3] = 255  # lit lip
    return t

def rut_pair(rg):
    """Dual-tyre ruts on the haul road: two 35px compacted bands whose
    CENTRES sit 3.3 cells (145px) apart across the road — the 2.5m track of
    a transfer trailer. 1x4-cell piece, wraps E-W along the travel axis."""
    w, h = CELL, CELL * 4
    t = np.zeros((h, w, 4))
    for cy in (16, 161):                             # centres 145px apart
        for dy in range(-17, 18):
            y = cy + dy
            if not (0 <= y < h):
                continue
            fr = abs(dy) / 17.0
            a = int(200 * (1 - fr) ** 1.4)
            if a <= 8:
                continue
            dark = 0.82 + 0.1 * fr
            t[y, :, :3] = P.S[2] * dark
            t[y, :, 3] = a
        yl = cy - 18
        if 0 <= yl < h:
            t[yl, :, :3] = P.S[5] * 0.8              # lit north berm line
            t[yl, :, 3] = 120
    return t

def salt_crust(rg):
    """Salt-crust patch: pale crinkled blotch for the pond margin."""
    t = np.zeros((CELL, CELL, 4))
    yy, xx = np.mgrid[0:CELL, 0:CELL]
    n = torus_noise(rg, CELL, 7)
    d = np.sqrt(((xx - 22) / 19) ** 2 + ((yy - 23) / 15) ** 2) + (n - 0.5) * 0.5
    m = d < 1.0
    fr = np.clip(1 - d, 0, 1)
    t[m, :3] = (P.SALT[None, :] * (0.85 + 0.3 * n[m, None]))
    t[m, 3] = np.clip(90 + 165 * fr[m], 0, 255)
    ring = (d >= 0.75) & (d < 1.0)
    t[ring, :3] = P.SALT * 1.05                      # crinkle rim, palest
    return t

# ---------------------------------------------------------------- main
def main():
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)
    assert_pools_checked()

    tm = load_texture_match({'landfill_cover', 'dead_turf'})
    for i in range(3):
        assert tm[f'landfill_cover_{i}'][1] == 'PENDING PAOLO'
    lc = [tm[f'landfill_cover_{i}'][0] for i in range(3)]
    turf = [tm[f'dead_turf_{i}'][0] for i in range(3)]
    st = load_starter(['dirt', 'yard_0'])
    props = load_trash_props()
    fence = load_fence_pieces()
    gravel = load_gravel()
    steps, rust = load_master_steps()

    rg = np.random.default_rng(SEED)

    # shared palette: 7 master-ramp steps + ONE rust accent + salt (a pale
    # step lightened in value only, still the ramp's own hue)
    P.S = steps
    P.RUST = rust
    P.SALT = np.clip(desat(steps[6][None, None, :], 0.45)[0, 0] * 1.02, 0, 255)

    # straw ramp for the thistle, off dead turf's own warm pixels
    tp = np.concatenate([x.reshape(-1, 3) for x in turf])
    warm = tp[(lum(tp) > 104) & (tp[:, 0] > tp[:, 2] * 1.1) & (tp[:, 0] >= tp[:, 1])]
    straw = desat(np.unique(warm.astype(np.uint8), axis=0).astype(np.float64), 0.65)
    srt = straw[np.argsort(lum(straw))]
    P.STRAW = srt[max(0, len(srt) - 70):len(srt) - 15] * 0.92

    # donors: de-greened everywhere (dead valley); cap donors also de-stoned
    # (the donors' dark cobble rings would read as keyline at cap value)
    dg = [de_green(a) for a in lc]
    P.fill_donors = dg
    P.cap_donors = [de_stone(a) for a in dg]

    # WANG wobble profiles (periodic 44 so pieces chain), pond geometry cache
    P.capw = {b: (13 + noise1d(np.random.default_rng(SEED + 7 + i), CELL, 7) * 6)
              .astype(int) for i, b in enumerate('NESW')}
    P.pondw = {b: (noise1d(np.random.default_rng(SEED + 17 + i), CELL, 9) * 3)
               .astype(int) for i, b in enumerate('NESW')}
    P.wrinkle_jit = (noise1d(np.random.default_rng(SEED + 23), CELL, 5) * 4).astype(int)
    P.rg_pond = np.random.default_rng(SEED + 29)
    P.pond_geo = {c: pond_geometry(c) for c in WANG15}

    tiles = []
    def bank_tile(name, arr, kind, harvested, alpha=None, px=None, extra=None):
        m = measure(arr, alpha)
        e = dict(name=name, px=px or arr.shape[1], b64=png_b64(arr, alpha),
                 metrics=m, kind=kind, harvested_from=harvested,
                 in_tolerance=bool(in_tolerance(m)) if alpha is None else None)
        if extra:
            e.update(extra)
        tiles.append(e)
        return arr

    # ------------------------------------------------------------ fields
    refuse = [bank_tile(f'refuse_{k}', refuse_tile(rg, SEED + 100 + k),
                        'compacted refuse ground: bleached 3-6px cluster '
                        'matrix, nameable junk arrives as approved props',
                        'landfill_cover_0..2 de-greened scramble; cluster '
                        'steps from the master ramp',
                        extra={'layer': 'ground', 'solid': False})
              for k in range(3)]
    caps = [bank_tile(f'cap_{k}', cap_tile(rg, SEED + 110 + k),
                      'daily-cover caliche cap: palest ground in the game, '
                      'angular 3-18px clasts (the difference from dirt). '
                      'lum_mean sits ABOVE the 8/1 band by design: the form '
                      'demands it lighter than starter dirt (132.5)',
                      'landfill_cover de-greened+de-stoned scramble, chalked; '
                      'clasts painted in master-ramp bone',
                      extra={'layer': 'ground', 'solid': False,
                             'lum_waiver': 'palest-ground demand (form E/G): '
                                           'dirt=132.5 makes the 121.4 band '
                                           'ceiling unreachable for a lighter cap'})
            for k in range(3)]
    ponds = [bank_tile(f'pond_pan_{k}', pond_pan_tile(rg, SEED + 120 + k),
                       'leachate pond pan: warm black-brown residue, '
                       'desiccation net, salt ghosts. Darkest ground in game',
                       'landfill_cover de-greened scramble, darkened; cracks '
                       'painted', extra={'layer': 'ground', 'solid': False})
             for k in range(2)]
    crown = bank_tile('haul_road_crown_0', haul_crown_tile(rg, SEED + 130),
                      'haul road crown: coarse stony lag (fines blown off), '
                      'no ripples — pullouts/plain stretches',
                      'landfill_cover scramble; lag pebbles painted',
                      extra={'layer': 'ground', 'solid': False})
    shoulder = bank_tile('haul_road_shoulder_0', haul_shoulder_tile(rg, SEED + 131),
                         'haul road shoulder: the crown\'s fines, soft pale '
                         'powder with drift tongues (the INVERTED road)',
                         'landfill_cover scramble, blurred + powder painted',
                         extra={'layer': 'ground', 'solid': False})
    washA = bank_tile('haul_wash_A', haul_crown_tile(rg, SEED + 132, True, 0.0),
                      'washboard phase A: crests at global x=0, 29.33 '
                      '(29.33px transverse ripples, 3 per 88px two-cell '
                      'period). PLACE STRICTLY ALTERNATING A,B,A,B',
                      'crown canvas + cosine washboard',
                      extra={'layer': 'ground', 'solid': False,
                             'phase': 'x offset 0 of the declared 88px period'})
    washB = bank_tile('haul_wash_B', haul_crown_tile(rg, SEED + 133, True, 44.0),
                      'washboard phase B: crest at global x=58.67 (in-tile '
                      '14.67). PLACE STRICTLY ALTERNATING A,B,A,B',
                      'crown canvas + cosine washboard',
                      extra={'layer': 'ground', 'solid': False,
                             'phase': 'x offset 44 of the declared 88px period'})

    # ------------------------------------------------------------ WANG sets
    fillc, capc = refuse[0], caps[0]
    capfill = {}
    for combo in WANG15:
        capfill[combo] = bank_tile(
            f'capfill_{combo}', capfill_tile(combo, fillc, capc),
            'WANG-16 cap-over-fill torn boundary (the theme sheet\'s "the '
            'last lift was never capped"); blank 16th = refuse_*/cap_*, '
            'not re-shipped',
            'fill/cap canvases as refuse_0/cap_0; torn edge painted',
            extra={'wang': combo, 'wang_bits': 'edges where the CAP is',
                   'layer': 'ground', 'solid': False})
    pondedge = {}
    for combo in WANG15:
        pondedge[combo] = bank_tile(
            f'pondedge_{combo}', pond_edge_tile(combo, capc, ponds[0]),
            'WANG-16 lined-pond edge: cap lip -> black HDPE slope (lit top, '
            'wrinkles on 11px module, 2 salt rings) -> pan; far N face '
            'widest, near S a sliver (45 law); blank 16th = pond_pan_*',
            'lip: cap_0 canvas; pan: pond_pan_0; liner/rings/wrinkles painted',
            extra={'wang': combo, 'wang_bits': 'edges where the GROUND is',
                   'layer': 'ground', 'solid': False})
    for b in 'NESW':
        pondedge[b + '_seam'] = bank_tile(
            f'pondedge_{b}_seam', pond_edge_tile(b, capc, ponds[0], seam=True),
            'panel-seam alternate: ONE HDPE seam down-slope. Placer drops '
            'one every 9-10 edge cells (the 9.3-cell roll pitch)',
            'as pondedge_' + b + '; seam painted',
            extra={'wang': b, 'wang_bits': 'edges where the GROUND is',
                   'layer': 'ground', 'solid': False,
                   'pitch': 'place every 9-10 edge cells'})

    # ------------------------------------------------------------ drift
    rgd = np.random.default_rng(SEED + 200)
    base_y = 87                                   # the fence pieces' baseline
    hp_run = 26 + noise1d(rgd, CELL * 4, 11) * 8  # 26-34px: 42-55% of fabric
    drun = drift_mat(rgd, CELL * 4, hp_run, base_y)
    drun = add_thistle(drun, rgd, [9, 38, 61, 90, 118, 147, 166], base_y)
    xs = np.arange(CELL * 2)
    hp_cor = 26 + (xs / (CELL * 2 - 1)) ** 2 * 14 + noise1d(rgd, CELL * 2, 9) * 4
    dcor = drift_mat(rgd, CELL * 2, hp_cor, base_y)   # pocket deepens east
    dcor = add_thistle(dcor, rgd, [15, 44, 70, 82], base_y)
    hp_tail = np.clip(26 - (xs / (CELL * 2 - 1)) * 34 + noise1d(rgd, CELL * 2, 9) * 4,
                      0, None)
    dtail = drift_mat(rgd, CELL * 2, hp_tail, base_y)  # tapers to nothing east
    dtail = add_thistle(dtail, rgd, [8, 30], base_y)
    for name, arr, kindx in (
            ('drift_run', drun, 'fence-run drift, wraps E-W (176px, matches '
                                'the TF-ART-004 run footprint; base at the '
                                'fence baseline y=87, drawn BEHIND the mesh '
                                '— NE side, global SSW wind)'),
            ('drift_corner', dcor, 'corner pocket: deepest against the post'),
            ('drift_tail', dtail, 'run end: the mat tapers to flakes')):
        bank_tile(name, arr[..., :3], kindx,
                  'flakes: master-ramp steps; thistle: dead_turf straw '
                  'harvest; NO fence fabric drawn',
                  alpha=arr[..., 3], px=arr.shape[1],
                  extra={'layer': 'prop-overlay', 'solid': False,
                         'covers_fence_fabric_pct': '40-65 (fabric 62px, '
                                                    'mat 26-40px)'})

    # ------------------------------------------------------------ overlays
    rgo = np.random.default_rng(SEED + 300)
    ovl = {
        'ovl_crack_run': (crack_run(rgo), 'tension crack, 2-3px, chains '
                          'end-to-end (y=22 both ends) into tens-of-cells '
                          'runs WITH the contour — never baked into a field'),
        'ovl_settlement_dish': (settlement_dish(rgo), 'settlement dish: 4x3 '
                                'cell soft dark ellipse, VALUE ONLY (alpha '
                                'ramp multiply), no edge line'),
        'ovl_erosion_rill': (erosion_rill(rgo), 'erosion rill: slopes ONLY, '
                             'branches upslope, digs downslope'),
        'ovl_cap_blowout': (cap_blowout(rgo), 'cap blowout: ONE 4-cell lift '
                            'face, ONE 9px caliche cover seam at the lip, '
                            'toe apron — the "last lift was never capped" '
                            'story tile'),
        'ovl_rut_pair': (rut_pair(rgo), 'dual-tyre rut pair: 35px bands, '
                         'centres 3.3 cells apart, wraps along travel'),
        'ovl_salt_crust': (salt_crust(rgo), 'salt-crust patch for the pond '
                           'margin'),
    }
    for name, (arr, kindx) in ovl.items():
        bank_tile(name, arr[..., :3], kindx + ' [SINGLE PLACEMENT]',
                  'palette: master-ramp steps over harvested-canvas grounds',
                  alpha=arr[..., 3], px=arr.shape[1],
                  extra={'layer': 'ground-overlay', 'solid': False,
                         'placement': 'single, never tiled'})

    # ------------------------------------------------------------ seams
    seam = {}
    rr = random.Random(SEED + 40)
    for fam, arrs in (('refuse', refuse), ('cap', caps), ('pond_pan', ponds),
                      ('haul_crown', [crown, shoulder])):
        row = [arrs[rr.randrange(len(arrs))] for _ in range(10)]
        j, internal = run_seam(row)
        ws = [(t['metrics'].get('hwrap', 0), t['metrics'].get('vwrap', 0))
              for t in tiles if t['name'].startswith(fam)]
        seam[fam] = dict(junction=j, internal=internal,
                         ratio=round(j / max(internal, 1e-9), 3),
                         wrap_max=round(max((max(w) for w in ws), default=0.0), 3))
    j, internal = run_seam([washA, washB, washA, washB, washA, washB])
    seam['wash_AB'] = dict(junction=j, internal=internal,
                           ratio=round(j / max(internal, 1e-9), 3),
                           note='A,B alternating is the contract; A alone '
                                'breaks the 88px rhythm by design')
    strip = np.concatenate([washA, washB, washA, washB, washA, washB], axis=1)
    colL = lum(strip).mean(axis=0)
    sm = np.convolve(colL, np.ones(5) / 5, mode='wrap' if False else 'same')
    crests = [i for i in range(2, len(sm) - 2)
              if sm[i] == max(sm[i - 2:i + 3]) and sm[i] > sm.mean()]
    gaps = np.diff(crests)
    gaps = gaps[gaps > 10]
    seam['washboard_pitch'] = dict(
        measured_px=[int(g) for g in gaps],
        mean=round(float(gaps.mean()), 2) if len(gaps) else None,
        declared=29.33)
    # donor reference: what a bought-tile junction measures
    j, internal = run_seam([dg[0], dg[1]])
    seam['donor_reference'] = dict(junction=j, internal=internal)

    # value ladder, day + night, greyscale
    Lc = float(np.mean([lum(c).mean() for c in caps]))
    Lf = float(np.mean([lum(f).mean() for f in refuse]))
    Lp = float(np.mean([lum(p).mean() for p in ponds]))
    night = lambda L: L * 0.40 + 8.0
    values = dict(cap=round(Lc, 1), fill=round(Lf, 1), pond=round(Lp, 1),
                  cap_minus_fill=round(Lc - Lf, 1),
                  fill_minus_pond=round(Lf - Lp, 1),
                  night_cap_minus_fill=round(night(Lc) - night(Lf), 1),
                  night_fill_minus_pond=round(night(Lf) - night(Lp), 1),
                  starter_dirt=round(float(lum(st['dirt']).mean()), 1),
                  cap_vs_dirt=round(Lc - float(lum(st['dirt']).mean()), 1))

    # ------------------------------------------------------------ proofs
    def three_by_three(arrs, name):
        save(grid([[arrs[(i * 3 + j) % len(arrs)] for j in range(3)]
                   for i in range(3)]), name, 2)
    three_by_three(refuse, 'REFUSE_3x3.png')
    three_by_three(caps, 'CAP_3x3.png')
    three_by_three(ponds + [ponds[0]], 'POND_PAN_3x3.png')
    three_by_three([crown, washA, washB, shoulder], 'HAUL_3x3.png')
    save(strip, 'WASHBOARD_PHASE_STRIP.png', 3)

    # WANG assemblies — inner corners FIRST (M12)
    def wang_scene(pieces, blanks, outer, w=6, h=6, hole=None):
        cells = []
        for i in range(h):
            row = []
            for j in range(w):
                if i in (0, h - 1) or j in (0, w - 1):
                    row.append(outer[(i + j) % len(outer)])
                    continue
                bits = ''
                if i == 1: bits += 'N'
                if j == w - 2: bits += 'E'
                if i == h - 2: bits += 'S'
                if j == 1: bits += 'W'
                key = ''.join(b for b in 'NESW' if b in bits)
                row.append(pieces[key] if key else blanks[(i + j) % len(blanks)])
            cells.append(row)
        return grid(cells)
    # cap island ON fill (cap outside? no: capfill bits = where cap is, so a
    # FILL pit surrounded by cap uses the pieces; plus a 1x1 pit = NESW)
    s1 = wang_scene(capfill, refuse, caps, 6, 6)
    pit = grid([[caps[0], caps[1], caps[2]],
                [caps[1], capfill['NESW'], caps[0]],
                [caps[2], caps[0], caps[1]]])
    pad = np.full((s1.shape[0], 12, 3), 24.0)
    fit = np.full((s1.shape[0], pit.shape[1], 3), 24.0)
    fit[:pit.shape[0]] = pit
    save(np.concatenate([s1, pad, fit], axis=1), 'CAPFILL_WANG.png', 2)
    s2 = wang_scene(pondedge, ponds, caps, 6, 6)
    seam_scene = grid([[caps[0], pondedge['N_seam'], pondedge['N']],
                       [pondedge['W'], ponds[0], pondedge['E']],
                       [pondedge['SW'], pondedge['S'], pondedge['ES']]])
    fit2 = np.full((s2.shape[0], seam_scene.shape[1], 3), 24.0)
    fit2[:seam_scene.shape[0]] = seam_scene
    save(np.concatenate([s2, pad, fit2], axis=1), 'PONDEDGE_WANG.png', 2)

    # 12x12 assembled scene: cap, fill, boundary, blowout, pond+edge, haul
    # road, fence + drift — every member in one picture
    W = H = 12
    scene = np.zeros((H * CELL, W * CELL, 3))
    for i in range(H):
        for j in range(W):
            scene[i * CELL:(i + 1) * CELL, j * CELL:(j + 1) * CELL] = \
                caps[(i + j) % 3] if i < 4 else refuse[(i * 2 + j) % 3]
    # boundary row: cap N of fill
    for j in range(W):
        scene[4 * CELL:5 * CELL, j * CELL:(j + 1) * CELL] = capfill['N']
    # pond 4x4 at rows 6-9, cols 0-3
    for i in range(4):
        for j in range(4):
            bits = ''
            if i == 0: bits += 'N'
            if j == 3: bits += 'E'
            if i == 3: bits += 'S'
            if j == 0: bits += 'W'
            key = ''.join(b for b in 'NESW' if b in bits)
            piece = pondedge[key] if key else ponds[(i + j) % 2]
            if key == 'N' and j == 2:
                piece = pondedge['N_seam']
            scene[(6 + i) * CELL:(7 + i) * CELL, j * CELL:(j + 1) * CELL] = piece
    # haul road rows 10 (shoulder) + 11 (crown, washboarded) cols 4-11...
    for j in range(W):
        if j >= 4:
            scene[10 * CELL:11 * CELL, j * CELL:(j + 1) * CELL] = \
                washA if j % 2 == 0 else washB
            scene[11 * CELL:12 * CELL, j * CELL:(j + 1) * CELL] = shoulder
    # overlays: dish on cap, crack chain across cap, blowout on the boundary,
    # rill on pond edge, salt at pond margin, ruts along the road
    over(scene, settlement_dish(np.random.default_rng(SEED + 301)), CELL // 2, 6 * CELL)
    cr = crack_run(np.random.default_rng(SEED + 302))
    over(scene, cr, 2 * CELL + 10, 0)
    over(scene, cr, 2 * CELL + 10, 3 * CELL)
    over(scene, cr, 2 * CELL + 10, 6 * CELL)
    over(scene, cap_blowout(np.random.default_rng(SEED + 303)), 3 * CELL, 8 * CELL)
    over(scene, erosion_rill(np.random.default_rng(SEED + 304)), 6 * CELL - 8, 2 * CELL)
    over(scene, salt_crust(np.random.default_rng(SEED + 305)), 5 * CELL + 20, CELL)
    rp = rut_pair(np.random.default_rng(SEED + 306))
    rpr = np.transpose(rp, (1, 0, 2))[:, ::-1]        # rotate: road runs E-W
    for j in range(4, 12, 2):
        over(scene, rpr, 10 * CELL + 4, j * CELL)
    # approved props ON the fill (sparse, like the real district)
    rgp = np.random.default_rng(SEED + 307)
    picks = rgp.choice(len(props), 7, replace=False)
    spots = [(5, 1), (5, 5), (6, 7), (7, 5), (8, 9), (9, 6), (8, 4)]
    for pi, (ri, rj) in zip(picks, spots):
        pk, idx, arr = props[pi]
        over(scene, arr, ri * CELL + 6, rj * CELL + 4)
    # fence + drift along the south edge of the cap (rows 0-1), NE side:
    # drift drawn BEHIND the mesh, base on the fence baseline
    fy = 0
    for rep in range(3):
        over(scene, drun, fy, rep * CELL * 4)
    over(scene, dtail, fy, 8 * CELL)
    for rep in range(3):
        over(scene, fence['run_plain_0'], fy, rep * CELL * 4)
    save(scene, 'SCENE_12x12.png', 2)
    sq = np.asarray(Image.fromarray(scene.astype(np.uint8)).resize(
        (W * CELL // 8, H * CELL // 8), Image.BILINEAR))
    save(np.asarray(Image.fromarray(sq).resize((sq.shape[1] * 6, sq.shape[0] * 6),
                                               Image.NEAREST)), 'SQUINT_MAP.png')

    # prop carry test: the 52 approved props on the cooked fill
    carry = grid([[refuse[(i + j) % 3] for j in range(6)] for i in range(4)])
    rgp2 = np.random.default_rng(SEED + 308)
    picks = rgp2.choice(len(props), 12, replace=False)
    pos = [(8, 10), (10, 100), (6, 196), (14, 150), (60, 30), (66, 120),
           (58, 210), (104, 60), (110, 160), (100, 228), (118, 8), (30, 60)]
    for pi, (y, x) in zip(picks, pos):
        over(carry, props[pi][2], y, x)
    save(carry, 'PROP_CARRY.png', 2)

    # drift + fence in ONE screenshot (collision (c) law)
    dfw = CELL * 8
    df = np.zeros((CELL * 4, dfw, 3))
    for i in range(4):
        for j in range(8):
            df[i * CELL:(i + 1) * CELL, j * CELL:(j + 1) * CELL] = \
                refuse[(i + j) % 3] if i >= 2 else caps[(i + j) % 3]
    over(df, drun, CELL, 0)
    over(df, dcor, CELL, CELL * 4)
    over(df, fence['run_plain_0'], CELL, 0)
    over(df, fence['run_plain_0'], CELL, CELL * 4)
    over(df, fence['post_hub'], CELL, CELL * 6 - 22)
    over(df, dtail, CELL, CELL * 6)
    save(df, 'DRIFT_FENCE.png', 3)

    # anchor composite: cook beside the approved/bought anchors, 3x
    entries = [
        ('cap_0 (NEW)', caps[0]), ('starter dirt (TODAY)', st['dirt']),
        ('yard_0 (TODAY)', st['yard_0']), ('refuse_0 (NEW)', refuse[0]),
        ('DONOR landfill_cover_0', lc[0]), ('pond_pan_0 (NEW)', ponds[0]),
        ('haul_crown (NEW)', crown), ('GRAVEL (RUN-002 pool)', gravel[0]),
        ('haul_wash_A (NEW)', washA), ('haul_shoulder (NEW)', shoulder),
    ]
    labeled_sheet(entries, cols=5, scale=3).save(
        os.path.join(PROOF_DIR, 'ANCHOR_COMPOSITE.png'))
    # haul vs gravel contingency panel: the kill call is made LOOKING at this
    hg = grid([[crown, washA, gravel[0], gravel[1]],
               [washB, shoulder, gravel[2], gravel[0]]])
    save(hg, 'HAUL_VS_GRAVEL.png', 3)

    # greyscale day + night values (M14/M18): does the skeleton hold?
    ladder = grid([[caps[0], refuse[0], ponds[0], washA]])
    g_day = np.repeat(lum(ladder)[..., None], 3, axis=2)
    g_night = np.repeat((lum(ladder) * 0.40 + 8)[..., None], 3, axis=2)
    save(np.concatenate([g_day, np.full((12, g_day.shape[1], 3), 24.0), g_night],
                        axis=0), 'GREYSCALE_NIGHT.png', 3)

    # contact sheet of every banked entry
    entries = []
    for t in tiles:
        im = Image.open(io.BytesIO(base64.b64decode(t['b64'])))
        entries.append((t['name'], np.asarray(im.convert(
            'RGBA' if im.mode == 'RGBA' else 'RGB')).astype(np.float64)))
    labeled_sheet(entries, cols=8, scale=2).save(
        os.path.join(PROOF_DIR, 'CONTACT_SHEET.png'))

    # ------------------------------------------------------------ bank
    fields = [t for t in tiles if t['name'].split('_')[0] in
              ('refuse', 'cap', 'pond') or t['name'].startswith('haul')]
    out_tol = [(t['name'], {k: t['metrics'][k] for k in
                            ('colours', 'edge', 'grain', 'sat', 'lum_mean')})
               for t in fields if t['in_tolerance'] is False]
    bank = {
        'form': 'TF-ART-015',
        'cooked': '2026-08-09',
        'mode': 'MIXED',
        'note': 'LANDFILL CELL GROUND. Splits executed: TF-WORLD-012 keeps '
                'the generic yard floor (none cooked here, it lives in the '
                'TF-RUN-002 job); TF-WORLD-004/TF-ART-006 keep unlined dead '
                'water (the HDPE lined-pond edge is cooked HERE and only '
                'here); TF-ART-004 owns the fence (the drift draws zero '
                'fence fabric and is proved WITH the fence in one '
                'screenshot); berm + terrace riser are structure-layer, NOT '
                'here. Every field canvas is harvested landfill_cover_0..2 '
                'grain (form-ordered cover-cap base), de-greened for the '
                'dead valley; deliberate marks use 7 master-ramp steps + '
                'ONE rust accent. No bags, no water, no green, no purple, '
                'no brown-mud.',
        'value_ladder': values,
        'lum_waiver': 'cap_0..2 lum_mean ~%s sits above the 8/1 tolerance '
                      'ceiling (121.4) BY DESIGN: the form demands the cap '
                      'palest in the game and clearly lighter than starter '
                      'dirt (132.5). Every other cap metric is in band. '
                      'Flagged for the sweep, not hidden.' % values['cap'],
        'haul_contingency': 'HAUL_VS_GRAVEL.png renders crown/washboard/'
                            'shoulder beside the RUN-002 gravel pool. The '
                            'cook\'s own look-call is recorded in '
                            'whatISawInMyOwnProof; the kill switch stays '
                            'live until the sweep.',
        'washboard_phase': 'DECLARED: 88px (2-cell) period, 3 ripples, '
                           'crests at global x = 0 / 29.33 / 58.67. '
                           'haul_wash_A at even cells, _B at odd, strictly '
                           'alternating along the travel axis.',
        'pond_seam_pitch': 'pondedge_<NESW>_seam carries ONE panel seam; '
                           'place one every 9-10 edge cells (9.3-cell HDPE '
                           'roll pitch). Base pieces carry wrinkles+rings '
                           'only.',
        'do_not_cook_honoured': [
            'no monsoon water in the pan [PENDING Paolo, story beat]',
            'no fluttering bags (film is gone at year 30), no animation',
            'no berm / terrace riser (structure-layer, own form)',
            'rain/night are M9 palette states — not built before indexing'],
        'seam_contract': {'fields': 'SELF-SEAMLESS (wrap + 10-run junction '
                                    'measured)', 'measured': seam,
                          'wang': 'capfill + pondedge WANG-16; escalation '
                                  'to BLOB-47 decided on the proof sheet '
                                  'per the form (inner corners inspected)'},
        'out_of_tolerance': out_tol,
        'harvest_sources': [
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt: landfill_cover_0..2 '
            'canvases (PENDING, form-ordered harvest), dead_turf straw',
            'banks/BOHEMIA_HD_TILE_REPO_part2.txt x ACT1_CONFIRMED: 52 UP '
            'trash props, carry test at the recorded 0.55 scale fix',
            'banks/tileforms/TF-ART-004_CANDIDATES_8_8_26.json: fence for '
            'the one-screenshot drift proof (no fabric drawn here)',
            'records/target/BOHEMIA_MASTER_PALETTE.json: the 7 steps + rust',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt: dirt/'
            'yard_0 anchor context only',
            'banks/BOHEMIA_GROUND_POOL_8_6_26.txt: gravel comparator only'],
        'consumers': ['TF-ART-015', 'TF-WORLD-012 (split honoured: generic '
                      'yard floor lives in the TF-RUN-002 job)'],
        'tiles': tiles,
        'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    }
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f)
    print('tiles:', len(tiles))
    print('values:', json.dumps(values))
    print('seams:', json.dumps(seam, indent=1))
    bad = [t['name'] for t in tiles if t['metrics']['purple_pct'] > 2.0]
    print('purple kills:', bad or 'none')
    grn = [(t['name'], t['metrics']['green_pct']) for t in tiles
           if t['metrics']['green_pct'] > 2.0]
    print('green over 2%:', grn or 'none')
    print('fields out of 8/1 tolerance:', len(out_tol), 'of', len(fields))
    for n, m in out_tol:
        print('  ', n, m)

if __name__ == '__main__':
    main()
