#!/usr/bin/env python3
"""TF-ART-014 cook — CROP FIELD: the dead furrowed field, its irrigation, and
the hard edge where it stops against raw desert.

THE JOB (records/tileforms/TF-ART-014_crop_field.md): one ground material seen
in five states, for the ~5,200 farm cells whose WALKABLE-LAND claim rides on it:
  (1) field_plain_0..2      furrowed dead field. THE LOCK: 30in real pitch =
                            the 44px cell exactly — ONE ridge + trough per
                            cell, grain NE-SW so the upper-left key catches
                            the flanks, phase-locked across every seam
                            (all field-family tiles share one global phase
                            (x+y) mod 44; only the jitter differs), relief a
                            5-6 VALUE step across a ~15px trough (year-30
                            ghost of the cut — soft, never an outlined
                            stripe), break/kink varied irregularly so there
                            is no 44px metronome. THE INVERSION: troughs go
                            LIGHTER when dry (salt crust + caliche chips
                            collect in low ground) — measured and reported
                            as trough_minus_ridge per tile.
  (2) field_bald_0..1       wind-scoured bald patch: relief locally erased,
                            coarse caliche lag armouring the scour.
  (3) field_windrow_0..1    stubble-clump windrow riding the grain — the
                            engine's code-7 every-3rd-cell variant (furrow
                            grain itself lives in the code-4 tile; NO engine
                            change, the two legend codes finally differ).
  (4) bare_plot_0..1        bare graded plot, disked flat: NO directional
                            grain at all — that absence is the read.
  (5) berm_ew/ns_0..1       irrigation berm crossing: a 9-30px BOWED relief
                            band, sky-lit top flank, shaded lower-right
                            flank — a cross-section, never two parallel
                            lines (45-degree law). Crown carries no salt;
                            the toe (low ground) does.
  (6) ditch_earth_0..1      dry ditch bottom, earthen + silted: bowed
                            trough, upper-left inner bank shaded, lip catch
                            on the lower-right, bottom the PALEST part of
                            the family (salt + silt).
  (7) ditch_conc_0..1       concrete-lined + cracked: joints FIRST, hairline
                            cracks grow from the joint, panel edges lifted
                            (lit lip on the upper-left side of the crack),
                            silted from the ends inward.
  (8) edge_in_* + edge_*    field/desert hard edge WANG set, INNER CORNERS
                            FIRST (M12): 4 concave notch pieces + 15 edge
                            combos. The hard line wavers +-2px, the field's
                            border ridge stands lit on the field side, the
                            desert beyond is harvested corpus desert.
  (9) track_*               pivot wheel-track arc, 6-piece single-placement
                            set (NS/EW + 4 bends): gravel-filled rut PAIR,
                            recessed (NW wall shaded, SE lip lit), salt-pale
                            (the ruts are low ground). ONLY the ground rut —
                            the pivot MACHINE (span/towers/alfalfa circle)
                            is TF-WORLD-014's and is not cooked here.

BOUNDARIES HONOURED: TF-WORLD-014 owns the pivot machine — this cook draws
only dirt and the rut. TF-ART-005's dead turf is a MAT over sand; this is
bare soil with relief — opposite deaths, palettes kept separable (turf is
warmer/straw, this is greyer/browner; separation measured). TF-RUN-002 owns
gravel BEDS — caliche here is a scatter of a handful of 3-9px clasts per
cell, clustered in troughs, never a surface. The Russian-thistle drift
against the downwind (NE) fence belongs to the fence line's cook, not the
open field — noted, not cooked.

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE below.
    crop_furrow_0..2 (PENDING PAOLO; the board form names them the furrowed
    base): HARVESTED as the soil body of every tile in the family — BUT
    surgically: the donors carry LIVING GREEN weeds (measured 8.1% green on
    crop_furrow_1 — a dead-valley lore kill) and a hard HORIZONTAL corduroy
    at ~11px pitch, 4 furrows per tile (the midwest-corduroy failure the
    form forbids, and 11px is a 44-divisor metronome besides). The harvest
    therefore DE-GREENS (green pixels quantized to the donors' own non-green
    soil palette), FLATTENS the baked corduroy (row/column profile divided
    out, micro-grain kept), then re-imposes the researched macro: one
    NE-SW furrow per cell at ghost depth, salt-pale troughs, caliche chips.
    Donor grain and donor colours; researched relief.
    stucco_bone_0..2 + roof_tile_sand_0..2 (both APPROVED 8/1): pale members
    HARVESTED as the 2-3 step PALE CALCIUM accent ramp (salt crust, caliche
    clasts, ditch silt) — the family's only high value, off Paolo-approved
    pixels, desaturated to ground discipline.
    dead_turf_0..2 (PENDING PAOLO): straw members only, HARVESTED as the
    stubble/windrow straw so cut stubble and dead turf share one straw
    truth; canvases NOT used (MAT vs bare-soil boundary above).
    metal_corrugate_0..2 + adobe_red_0..2 + wood_fence_0..2: opened as the
    SEPARATION REFERENCE ONLY — the farm's structure band; every family's
    luminance distance to them is measured and reported (M14 >= 18).
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (APPROVED 7/28+7/29)
    — OPENED IN CODE below. dirt: HARVESTED into the bare graded plot (a
    disked plot is closer to yard dirt than to furrow soil; blended with the
    flattened furrow soil so the plot stays agricultural). concrete_0/1:
    HARVESTED as the ditch lining canvas (poured lining cracks like poured
    concrete). yard_0/1/2: anchor context in composites, never edited.
  banks/BOHEMIA_DESERT_POOLS_7_18_26.txt (corpus Mojave floor) — OPENED IN
    CODE below: 44px crops HARVESTED as the desert side of every WANG edge
    piece and as the anchor context. The form's own shopping check says the
    desert must NOT be the field — here it is only ever the thing the field
    stops against, and the contrast over that line is the asset.
  banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt — read: {key,pack,idx} references
    into the HD packs (no pixels in the bank); the same corpus desert the
    DESERT_POOLS carry verbatim, so the pools are the pixel source used.
  banks/BOHEMIA_GROUND_POOL_8_6_26.txt (UP-ONLY, seamless-only) — OPENED IN
    CODE below: gravel bucket HARVESTED as the pivot-rut gravel fill (a
    gravel-filled rut should be made of Paolo's UP gravel, not painted
    gravel). Scatter-vs-bed boundary respected: gravel appears ONLY inside
    the rut mask.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — checked in code: street/wreck/
    trash/crate/dead/barrier/camp props. No agricultural ground. Nothing fit.
  banks/BOHEMIA_PERIMETER_8_2_26.txt / _CIVIC_OPENINGS_8_3 / _OPENINGS_8_2 —
    checked in code: walls and openings families only. Nothing fit.
  banks/BOHEMIA_HD_TILE_REPO_part1..4 x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26
    — pack list walked (form section B did the full walk): NO agricultural
    family exists anywhere in the bought corpus; "grass and ground" is
    LIVING cover (lore kill), "soil and dirt" is loose soil with no furrow
    grain and is already represented at 44px by the starter dirt, which IS
    harvested instead.
  VERDICT: mode MIXED — soil bodies, calcium ramp, straw, desert margins,
  rut gravel and the ditch concrete are all HARVESTED; painted pixels are
  only the genuine gaps (the researched furrow relief, salt inversion,
  chip clasts, berm/ditch cross-sections, the hard edge geometry, ruts).

TASTE CHECK:
  DEAD VALLEY: donors' living green is measurably killed (green_pct
    reported per tile, ~0 after harvest; purple_pct reported, kill at 2%).
    No living anything: stubble is dead straw off dead_turf's own members.
  QUIET, GREYER, DARKER THAN DESERT: family desaturated to the world's
    ~0.19 against the corpus desert's measured ~0.55, lum held near the
    ground band mean — the field must read paler-in-speckle but flatter,
    looser, deader across the hard line, and must NOT out-detail the barn
    (M2/M13; edge+grain held to the bought-tile tolerance by the governor,
    structure separation measured >= 18).
  THE INVERSION IS THE RESEARCH: dry troughs LIGHTER than ridges (salt +
    caliche in the low ground) — measured per field tile and reported;
    a dark-trough tile would be the invented one.
  NO METRONOME (8/2 stamp bug): one furrow per cell is the LOCK (pitch =
    cell = 30in, a 44-divisor by definition), so variety is carried by
    per-variant break/kink jitter, amplitude scour, chip clustering and
    3+2+2 field variants — never one hero tile. Donors' own 11px corduroy
    (4-per-tile metronome) is flattened away.
  45 LAW: berm, ditch and rut are drawn as bowed cross-sections — sky-lit
    top / shaded lower-right for raised, inverted for recessed, bowing
    modulated along the run — never two parallel lines.
  NO keyline, NO dither, ONE light (upper-left), no baked cast shadows
    (form shading only; the berm's runtime shadow is the shadow pass's).
  VERIFY ON THE REAL SURFACE: 3x3 tilings, LONG RUNS both axes (a
    directional grain only fails at length), WANG sheet with inner corners
    first, an inner-corner L assembly, a track ring, a farm-block assembly
    with a 1-tile squint, and the anchor composite against corpus desert —
    PNGs for eyes, not just numbers.

Deterministic: SEED fixed, rerunnable.
Writes ONLY:
  banks/tileforms/TF-ART-014_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-014/*.png
"""

import json, base64, io, os, colorsys, random

from PIL import Image, ImageDraw
import numpy as np

SEED = 80814
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-014_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-014')

WANG15 = ['N', 'E', 'S', 'W', 'NE', 'NS', 'NW', 'ES', 'EW', 'SW',
          'NES', 'NEW', 'NSW', 'ESW', 'NESW']
INNER4 = ['NE', 'SE', 'SW', 'NW']          # corner-notch pieces, cooked FIRST
TRACK6 = ['NS', 'EW', 'NE', 'NW', 'ES', 'SW']

YS, XS = np.mgrid[0:CELL, 0:CELL].astype(np.float64)

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

def load_desert_crops(n=4):
    """REUSE in code: corpus Mojave ground — the thing the field stops
    against. 44px crops for the WANG desert margins + display anchors."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_DESERT_POOLS_7_18_26.txt')))
    crops = []
    for i in range(n):
        a = np.asarray(Image.open(io.BytesIO(base64.b64decode(d['ground'][i]))
                                  ).convert('RGB')).astype(np.float64)
        crops.append(a[8:8 + CELL, 8:8 + CELL])
    return crops

def load_gravel(n=4):
    """REUSE in code: Paolo's UP-verdicted seamless gravel (7/13 Great Sweep)
    — the pivot rut's gravel fill."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_GROUND_POOL_8_6_26.txt')))
    assert list(d['counts']) == ['gravel'], d['counts']
    out = []
    for e in d['buckets']['gravel'][:n]:
        a = np.asarray(Image.open(io.BytesIO(base64.b64decode(e['b64']))
                                  ).convert('RGB')).astype(np.float64)
        assert a.shape == (CELL, CELL, 3), a.shape
        out.append(a)
    return out

def assert_pool_checked():
    """Shopping sweep honoured in code: pools checked that did not fit —
    opened so the claim is machine-true, harvested nothing."""
    ext = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')))
    assert set(ext['counts']) == {'street', 'wreck', 'trash', 'crate', 'dead',
                                  'barrier', 'camp'}, ext['counts']
    per = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_PERIMETER_8_2_26.txt')))
    assert 'wall' in per['note'].lower(), 'perimeter bank is walls'
    for f in ('BOHEMIA_CIVIC_OPENINGS_8_3_26.txt', 'BOHEMIA_OPENINGS_8_2_26.txt'):
        op = json.load(open(os.path.join(ROOT, 'banks', f)))
        assert 'overlay' in op['note'].lower() and len(op['tiles']) > 0, f
    tp = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_TERRAIN_PICKS_7_14_26.txt')))
    assert 'DESERT' in tp['picks'] and 'b64' not in tp['picks']['DESERT'][0], \
        'terrain picks are references; pixels come from the desert pools'

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

def noise1d(rg, k=7):
    n = rg.standard_normal(CELL)
    for _ in range(2):
        m = np.zeros_like(n)
        for d in range(-(k // 2), k // 2 + 1):
            m += np.roll(n, d)
        n = m / k
    n = n - n.mean()
    mx = np.abs(n).max() + 1e-9
    return n / mx                                   # [-1,1], circular

def scrambled(donors, seed, runs=(3, 7)):
    """Variant synthesis off harvested canvases: real donor COLUMNS in short
    runs with circular rolls — donor grain, donor colours, wrap preserved."""
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
    return 0.86 * tex + 0.14 * (np.roll(tex, 1, axis=1) + tex + np.roll(tex, -1, axis=1)) / 3.0

def desat(pal, amt):
    g = lum(pal)[..., None]
    return np.clip(pal + amt * (g - pal), 0, 255)

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

# ---------------------------------------------------------------- the harvest
def degreen(a, soil_pal):
    """Kill the donors' living green: green pixels quantized to the donors'
    own non-green soil palette. DEAD VALLEY, measured."""
    f = a.reshape(-1, 3) / 255.0
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in f])
    hue = hsv[:, 0] * 360
    m = (hue >= 55) & (hue <= 175) & (hsv[:, 1] > 0.15)
    out = a.reshape(-1, 3).copy()
    if m.any():
        out[m] = quantize_to(soil_pal, out[m])
    return out.reshape(a.shape)

def flatten_corduroy(a):
    """Divide out the donors' baked 11px horizontal corduroy (and any column
    banding) so the researched one-per-cell NE-SW relief can be re-imposed.
    Micro-grain survives; the macro stripe dies."""
    t = a.copy()
    L = lum(t)
    target = L.mean()
    rmean = torus_blur(L, 3, 1).mean(axis=1)
    t *= np.clip(target / np.maximum(rmean, 1), 0.72, 1.42)[:, None, None]
    L = lum(t)
    cmean = L.mean(axis=0)
    t *= np.clip(L.mean() / np.maximum(cmean, 1), 0.85, 1.18)[None, :, None]
    return np.clip(t, 0, 255)

def no_green(t):
    """DEAD VALLEY, enforced by construction: a pixel reads green only when
    g exceeds both r and b, so clamping g to max(r,b) removes green hue from
    the soil entirely — the low-sat olive flecks the hue-gate misses die too."""
    out = t.copy()
    out[..., 1] = np.minimum(out[..., 1], np.maximum(out[..., 0], out[..., 2]))
    return out

def tone_to_field(t, lum_target=95.0, desat_amt=0.46, contrast=0.58):
    """Grey the harvested soil to the world's discipline: greyer + darker
    than the desert across the fence, sat toward ~0.19 — and QUIETED
    (micro-contrast compressed) so the ghosted furrow macro can carry the
    read; the governor re-adds fine grain up to the bought-tile floor."""
    t = desat(t, desat_amt)
    m = t.reshape(-1, 3).mean(axis=0)[None, None, :]
    t = m + (t - m) * contrast
    t = np.clip(t * (lum_target / max(lum(t).mean(), 1)), 0, 255)
    return no_green(t * np.array([1.01, 1.0, 0.97])[None, None, :])

def dephase(t):
    """Make the soil PHASE-NEUTRAL: remove any broad luminance bias along the
    (x+y) furrow-phase axis that the scrambled synthesis rolled in by chance,
    so the only structure on that axis is the authored relief + salt (the
    measured inversion is then the cook's claim, never texture luck).
    Circularly smoothed profile => only low-frequency bias dies; grain lives."""
    L = lum(t)
    d = ((XS + YS) % CELL).astype(int)
    prof = np.zeros(CELL)
    for k in range(CELL):
        prof[k] = L[d == k].mean()
    sm = prof.copy()
    for _ in range(2):
        sm = sum(np.roll(sm, s) for s in range(-3, 4)) / 7.0
    corr = np.clip(L.mean() / np.maximum(sm, 1), 0.85, 1.18)
    return np.clip(t * corr[d][..., None], 0, 255)

# ---------------------------------------------------------------- furrow core
REL = 0.042          # ~7 lum flank-to-flank on the quieted soil: a ghost,
                     # soft not erased, legible because the micro is quiet
JIT_PX = 2.6         # break/kink amplitude (irregular, torus-periodic)

def furrow_parts(rg):
    """Shared macro for every field-family tile: global phase (x+y) mod 44
    (ONE furrow per cell, NE-SW, phase-locked across seams and variants),
    per-variant jitter/amplitude so no two tiles kink alike."""
    J = (torus_noise(rg, 9, 2) - 0.5) * 2 * JIT_PX
    p = 2 * np.pi * ((XS + YS) + J) / CELL
    A = 0.55 + 0.45 * torus_noise(rg, 7, 2)
    lit = -np.sin(p)                              # + on the NW flank (the key)
    trough = np.clip((-np.cos(p) - 0.12) / 0.88, 0, 1)   # ~15px low band
    return p, A, lit, trough

def salt_wash(t, rg, trough, salt_col, base=0.050, patch=0.34):
    """THE INVERSION: dry troughs go LIGHTER — salt crust + fines in the low
    ground. A deterministic whole-trough lift (the crust floor, so the
    inversion survives every variant's noise roll) plus clumped patches."""
    t = t * (1 + base * trough)[..., None]
    sn = torus_noise(rg, 5, 2)
    m = trough * np.clip((sn - 0.50) / 0.50, 0, 1)
    return t * (1 - patch * m[..., None]) + salt_col[None, None, :] * (patch * m[..., None])

def put_clast(t, rng, cy, cx, size, calc_ramp):
    """One angular caliche clast, 3-9px across: pale calcium steps, lit on
    its upper-left, its own unlit side a shade darker (form shading only)."""
    pts = {(cy, cx)}
    y, x = cy, cx
    for _ in range(size * 2):
        y = (y + rng.choice((-1, 0, 1))) % CELL
        x = (x + rng.choice((-1, 0, 1))) % CELL
        pts.add((y, x))
        if len(pts) >= size:
            break
    for (yy, xx) in pts:
        t[yy, xx] = calc_ramp[rng.randrange(1, len(calc_ramp))] * rng.uniform(0.94, 1.02)
    ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
    t[min(ys), min(xs)] = calc_ramp[-1]                       # sky-lit corner
    t[max(ys), max(xs)] = calc_ramp[0] * 0.90                 # unlit side
    return t

def scatter_caliche(t, rng, trough, calc_ramp, n_lo=4, n_hi=8, big_p=0.25):
    """A handful of clasts per cell, CLUSTERED in the troughs (motivated,
    irregular, never even) — the field is SPECKLED PALE, nowhere else is."""
    w = (trough + 0.12).flatten()
    w = w / w.sum()
    idx = np.arange(CELL * CELL)
    n = rng.randrange(n_lo, n_hi + 1)
    # clustered: half the clasts seed near a previous one
    placed = []
    for k in range(n):
        if placed and rng.random() < 0.5:
            cy, cx = placed[rng.randrange(len(placed))]
            cy = (cy + rng.randrange(-4, 5)) % CELL
            cx = (cx + rng.randrange(-4, 5)) % CELL
        else:
            pick = int(np.searchsorted(np.cumsum(w), rng.random()))
            pick = min(pick, CELL * CELL - 1)
            cy, cx = int(idx[pick] // CELL), int(idx[pick] % CELL)
        size = rng.randrange(5, 9) if rng.random() < big_p else rng.randrange(2, 5)
        t = put_clast(t, rng, cy, cx, size, calc_ramp)
        placed.append((cy, cx))
    return t

# ---------------------------------------------------------------- families
def cook_field(base_donors, calc_ramp, salt_col, straw, seed, mode='plain'):
    """The furrowed dead field. mode: plain | bald | windrow."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = dephase(tone_to_field(scrambled(base_donors, SEED + seed)))
    p, A, lit, trough = furrow_parts(rg)
    if mode == 'bald':
        bm = np.clip((torus_noise(rg, 11, 2) - 0.42) / 0.58, 0, 1) ** 1.5
        A = A * (1 - 0.88 * bm)
        t = t * (1 + 0.020 * bm)[..., None]       # fines stripped: pale lag
    t = t * (1 + REL * lit * A)[..., None]
    t = salt_wash(t, rg, trough, salt_col)
    t = scatter_caliche(t, rng, trough, calc_ramp,
                        n_lo=6 if mode == 'bald' else 4,
                        n_hi=10 if mode == 'bald' else 8)
    if mode == 'windrow':
        # stubble clumps raked into a row riding the grain (code-7's read):
        # clustered along a band offset from the crest, dead straw only
        band = np.clip((np.cos(p - 1.2) - 0.55) / 0.45, 0, 1)
        cn = torus_noise(rg, 3, 1)
        m = (band * (0.35 + 0.65 * cn)) > 0.42
        for (yy, xx) in np.argwhere(m):
            if rng.random() < 0.55:
                c = straw[rng.randrange(len(straw))]
                t[yy, xx] = c * rng.uniform(0.82, 1.0)
                if rng.random() < 0.4:            # a 1px stalk, never 3 (craft law)
                    t[(yy - 1) % CELL, xx] = c * rng.uniform(0.9, 1.05)
                if rng.random() < 0.25:
                    t[yy, (xx + 1) % CELL] = c * 0.78
    return np.clip(governor(t, seed=seed), 0, 255)

def cook_bare_plot(base_donors, dirt, calc_ramp, seed):
    """Bare graded plot, disked flat and never planted: NO grain — starter
    dirt blended with the flattened furrow soil, isotropic, near-quiet."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = 0.55 * tone_to_field(scrambled(base_donors, SEED + seed), 92.0) \
        + 0.45 * tone_to_field(scrambled([dirt], SEED + seed + 7), 92.0, 0.30)
    t = torus_blur(t, 3, 1) * 0.35 + t * 0.65        # disked: softened, flat
    # uniform faint salt speckle, no banding (there is no low ground to hold it)
    sn = torus_noise(rg, 3, 2)
    m = np.clip((sn - 0.72) / 0.28, 0, 1) * 0.18
    t = t * (1 - m[..., None]) + np.array([168, 164, 152])[None, None, :] * m[..., None]
    t = scatter_caliche(t, rng, np.full((CELL, CELL), 0.3), calc_ramp, 2, 4, 0.15)
    return np.clip(governor(t, seed=seed), 0, 255)

def cross_profile(rg, axis, c0=22.0, w0=5.2, bow=2.0):
    """A bowed band: centre and width wander along the run (torus-periodic)
    — the 45-law cross-section, never two parallel lines."""
    u = XS if axis == 0 else YS                    # along-run coordinate
    v = YS if axis == 0 else XS                    # across-run coordinate
    ph = rg.uniform(0, 2 * np.pi)
    cline = c0 + bow * np.sin(2 * np.pi * u / CELL + ph) \
        + 1.3 * noise1d(rg)[(u.astype(int)) % CELL]
    wline = w0 * (1 + 0.16 * np.sin(4 * np.pi * u / CELL + ph * 0.7))
    return v, cline, wline

def cook_berm(base_donors, calc_ramp, salt_col, seed, axis=0):
    """Irrigation berm (border-check levee) crossing the furrows: a bowed
    9-30px relief band, SKY-LIT top flank, SHADED lower-right flank; furrows
    die under it; salt sits at its toe, never on the crown. axis 0 = runs EW."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = dephase(tone_to_field(scrambled(base_donors, SEED + seed)))
    p, A, lit, trough = furrow_parts(rg)
    v, c, w = cross_profile(rg, axis)
    bh = np.exp(-((v - c) / w) ** 2)
    t = t * (1 + REL * lit * A * (1 - 0.95 * bh))[..., None]      # furrows stop
    shade = 0.115 * (-(v - c) / w) * bh            # + above/left, - below/right
    t = t * (1 + shade)[..., None]
    crown = np.clip(bh - 0.55, 0, 1) / 0.45
    t = t * (1 + 0.03 * crown)[..., None] * \
        (1 + 0.05 * crown[..., None] * np.array([0.6, 0.15, -0.8])[None, None, :])
    toe = np.clip(np.exp(-((np.abs(v - c) - 1.9 * w) / (0.8 * w)) ** 2), 0, 1)
    t = salt_wash(t, rg, toe * 0.8, salt_col, base=0.012, patch=0.22)
    t = scatter_caliche(t, rng, toe, calc_ramp, 2, 5, 0.15)
    return np.clip(governor(t, seed=seed), 0, 255)

def cook_ditch_earth(base_donors, calc_ramp, salt_col, seed, silted=True):
    """Dry earthen ditch: bowed trough — upper-left inner bank SHADED, lip
    catch lower-right, the silted bottom the PALEST ground in the family
    (salt + fines), fine drying hairlines."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = dephase(tone_to_field(scrambled(base_donors, SEED + seed), 92.0))
    p, A, lit, trough = furrow_parts(rg)
    v, c, w = cross_profile(rg, 0, w0=6.4, bow=1.7)
    d = np.exp(-((v - c) / w) ** 2)
    t = t * (1 + REL * lit * A * (1 - 0.97 * d))[..., None]
    shade = -0.105 * (-(v - c) / w) * d            # recess: inverse of the berm
    t = t * (1 + shade)[..., None]
    bot = np.clip((d - 0.55) / 0.45, 0, 1)
    silt = bot * (0.55 + 0.45 * torus_noise(rg, 5, 2))
    amt = 0.42 if silted else 0.26
    t = t * (1 - amt * silt[..., None]) + salt_col[None, None, :] * (amt * silt[..., None])
    # drying hairlines in the silt, 1px, sparse
    for _ in range(3 if silted else 2):
        x = rng.randrange(CELL); y = int(np.clip(c[0, 0] + rng.uniform(-2, 2), 1, CELL - 2))
        for k in range(rng.randrange(4, 9)):
            t[y % CELL, x % CELL] *= 0.86
            x += 1
            y += rng.choice((-1, 0, 0, 1))
    if not silted:
        t = scatter_caliche(t, rng, bot, calc_ramp, 3, 6, 0.2)
    return np.clip(governor(t, seed=seed), 0, 255)

def cook_ditch_conc(base_donors, concrete, calc_ramp, salt_col, seed, joint_x=None):
    """Concrete-lined ditch, thirty years on: the lining cracks at the JOINT
    first, the panel edge lifts (lit lip on the crack's upper-left side),
    and the ditch silts full from the ends — pale drifts over the slab."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = dephase(tone_to_field(scrambled(base_donors, SEED + seed), 92.0))
    p, A, lit, trough = furrow_parts(rg)
    v, c, w = cross_profile(rg, 0, w0=6.2, bow=1.4)
    d = np.exp(-((v - c) / w) ** 2)
    t = t * (1 + REL * lit * A * (1 - 0.97 * d))[..., None]
    t = t * (1 + (-0.10 * (-(v - c) / w) * d))[..., None]
    strip = np.clip((d - 0.38) / 0.14, 0, 1)                     # the lining
    conc = np.clip(desat(scrambled(concrete, SEED + seed + 3), 0.12) * 1.04, 0, 255)
    t = t * (1 - strip[..., None]) + conc * strip[..., None]
    # lining lip rows catch/shade where the slab meets the bank
    lipm = ((strip > 0.15) & (strip < 0.6))
    t[lipm & (v < c)] *= 0.92                                    # upper edge in shade
    t[lipm & (v > c)] *= 1.06                                    # lower edge catches
    if joint_x is not None:
        smask = strip > 0.5
        for yy in range(CELL):
            if smask[yy, joint_x]:
                t[yy, joint_x] *= 0.62                            # the open joint
                t[yy, (joint_x - 1) % CELL] = np.clip(
                    t[yy, (joint_x - 1) % CELL] * 1.14, 0, 255)   # lifted edge, lit
        # hairlines grow FROM the joint
        for sgn in (-1, 1):
            x, y = joint_x, int(c[0, 0] + rng.uniform(-2, 2))
            for k in range(rng.randrange(6, 12)):
                x = (x + sgn) % CELL
                y += rng.choice((-1, 0, 0, 1))
                if strip[int(np.clip(y, 0, CELL - 1)), x] > 0.4:
                    t[int(np.clip(y, 0, CELL - 1)), x] *= 0.78
    # silt drifts over the slab
    sn = torus_noise(rg, 5, 2)
    m = strip * np.clip((sn - 0.60) / 0.40, 0, 1) * 0.5
    t = t * (1 - m[..., None]) + salt_col[None, None, :] * m[..., None]
    return np.clip(governor(t, seed=seed), 0, 255)

# ---------------------------------------------------------------- WANG edge
def edge_masks(bits, rg, dep=9.5):
    """Desert margin mask for named edges; the hard line wavers +-2px."""
    D = np.zeros((CELL, CELL), bool)
    for b in bits:
        wav = dep + 2.2 * noise1d(rg)
        if b == 'N':
            D |= YS < wav[XS.astype(int) % CELL]
        elif b == 'S':
            D |= YS >= CELL - wav[XS.astype(int) % CELL]
        elif b == 'W':
            D |= XS < wav[YS.astype(int) % CELL]
        elif b == 'E':
            D |= XS >= CELL - wav[YS.astype(int) % CELL]
    return D

def corner_mask(corner, rg, r=13.0):
    """Concave notch: desert bites the named tile corner (inner corner)."""
    cyx = {'NE': (0.0, CELL - 1.0), 'SE': (CELL - 1.0, CELL - 1.0),
           'SW': (CELL - 1.0, 0.0), 'NW': (0.0, 0.0)}[corner]
    rr = r + 2.0 * noise1d(rg)[((XS + YS).astype(int)) % CELL]
    dist = np.sqrt((YS - cyx[0]) ** 2 + (XS - cyx[1]) ** 2)
    return dist < rr

def cook_edge(base_donors, desert_donors, calc_ramp, salt_col, seed,
              bits=None, corner=None):
    """Field/desert hard edge: field body (phase-locked), harvested corpus
    desert beyond a razor line, the field's border ridge standing lit on the
    field side. Inner corners are cooked FIRST (M12)."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = dephase(tone_to_field(scrambled(base_donors, SEED + seed)))
    p, A, lit, trough = furrow_parts(rg)
    t = t * (1 + REL * lit * A)[..., None]
    t = salt_wash(t, rg, trough, salt_col)
    t = scatter_caliche(t, rng, trough, calc_ramp, 3, 6)
    D = corner_mask(corner, rg) if corner else edge_masks(bits, rg)
    des = scrambled(desert_donors, SEED + seed + 13)
    t[D] = des[D]
    # the border ridge: the field caught thirty years of fines at its line
    rim = np.zeros_like(D)
    for ax in (0, 1):
        for sh in (-1, 1):
            rim |= np.roll(D, sh, axis=ax)
    rim &= ~D
    rim2 = np.zeros_like(D)
    for ax in (0, 1):
        for sh in (-1, 1):
            rim2 |= np.roll(rim | D, sh, axis=ax)
    rim2 &= ~(rim | D)
    t[rim] = np.clip(t[rim] * 1.09, 0, 255)                     # lit crown
    t[rim2] = t[rim2] * 0.95                                    # its short flank
    return np.clip(t, 0, 255)                                   # NO governor: the
    # hard step across the line IS the asset; smoothing it would erase the form

# ---------------------------------------------------------------- pivot track
R_IN, R_OUT = 13.5, 29.5
RUT_W = 2.6

def rut_mask(kind):
    if kind == 'NS':
        return (np.abs(XS - R_IN) <= RUT_W) | (np.abs(XS - R_OUT) <= RUT_W)
    if kind == 'EW':
        return (np.abs(YS - R_IN) <= RUT_W) | (np.abs(YS - R_OUT) <= RUT_W)
    ctr = {'NE': (-0.5, CELL - 0.5), 'NW': (-0.5, -0.5),
           'ES': (CELL - 0.5, CELL - 0.5), 'SW': (CELL - 0.5, -0.5)}[kind]
    dist = np.sqrt((YS - ctr[0]) ** 2 + (XS - ctr[1]) ** 2)
    return (np.abs(dist - R_IN) <= RUT_W) | (np.abs(dist - R_OUT) <= RUT_W)

def cook_track(base_donors, gravel, calc_ramp, salt_col, seed, kind):
    """Pivot wheel-track: a gravel-filled rut PAIR ground into the field —
    UP gravel in the rut only (scatter-vs-bed law), recessed (NW wall
    shaded, SE lip lit), salt-pale because the rut is the lowest ground.
    The machine that made it is TF-WORLD-014's, not here."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = dephase(tone_to_field(scrambled(base_donors, SEED + seed)))
    p, A, lit, trough = furrow_parts(rg)
    R = rut_mask(kind)
    t = t * (1 + REL * lit * A * (1 - 0.9 * R))[..., None]
    t = salt_wash(t, rg, trough * (1 - 0.8 * R), salt_col)
    g = np.clip(desat(scrambled(gravel, SEED + seed + 5), 0.25) * 1.06, 0, 255)
    g = g * (1 - 0.18 * (1 - torus_noise(rg, 3, 1)))[..., None]
    t[R] = 0.15 * t[R] + 0.85 * g[R]
    # salt tint in the rut (low ground)
    sn = torus_noise(rg, 5, 2)
    m = R * np.clip((sn - 0.5) / 0.5, 0, 1) * 0.22
    t = t * (1 - m[..., None]) + salt_col[None, None, :] * m[..., None]
    # recess form shading, orientation-free: wall whose NW neighbour is
    # outside the rut sits in shade; the lip SE of the rut catches the key
    nwout = R & ~np.roll(np.roll(R, 1, 0), 1, 1)
    lip = ~R & np.roll(np.roll(R, 1, 0), 1, 1)
    t[nwout] *= 0.88
    t[lip] = np.clip(t[lip] * 1.07, 0, 255)
    t = scatter_caliche(t, rng, trough * (1 - R), calc_ramp, 2, 4, 0.1)
    return np.clip(governor(t, seed=seed), 0, 255)

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

def inversion(tile):
    """trough mean lum minus ridge mean lum on the global phase bands:
    POSITIVE = the researched dry-salt inversion survived the cook."""
    L = lum(tile.astype(np.float64))
    ph = (XS + YS) % CELL
    tr = (ph >= 17) & (ph <= 27)
    ri = (ph <= 4) | (ph >= 40)
    return round(float(L[tr].mean() - L[ri].mean()), 2)

def run_seam(tiles_row):
    strip = np.concatenate(tiles_row, axis=1)
    L = lum(strip.astype(np.float64))
    W = tiles_row[0].shape[1]
    steps = np.abs(np.diff(L, axis=1))
    j_cols = [k * W - 1 for k in range(1, len(tiles_row))]
    j = float(np.mean([steps[:, c].mean() for c in j_cols]))
    internal = float(np.delete(steps, j_cols, axis=1).mean())
    return round(j, 3), round(internal, 3)

def run_seam_v(tiles_col):
    strip = np.concatenate(tiles_col, axis=0)
    L = lum(strip.astype(np.float64))
    H = tiles_col[0].shape[0]
    steps = np.abs(np.diff(L, axis=0))
    j_rows = [k * H - 1 for k in range(1, len(tiles_col))]
    j = float(np.mean([steps[r, :].mean() for r in j_rows]))
    internal = float(np.delete(steps, j_rows, axis=0).mean())
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

    tm = load_texture_match({'crop_furrow', 'stucco_bone', 'roof_tile_sand',
                             'dead_turf', 'metal_corrugate', 'adobe_red',
                             'wood_fence'})
    raw = [tm[f'crop_furrow_{i}'][0] for i in range(3)]
    assert all(tm[f'crop_furrow_{i}'][1] == 'PENDING PAOLO' for i in range(3))
    for i in range(3):
        assert tm[f'stucco_bone_{i}'][1].startswith('APPROVED')
        assert tm[f'roof_tile_sand_{i}'][1].startswith('APPROVED')
        assert tm[f'metal_corrugate_{i}'][1].startswith('APPROVED')

    # --- the harvest: de-green, flatten the baked corduroy, grey it down
    donor_pal = palette_of(*raw)
    f = donor_pal / 255.0
    hsvp = np.array([colorsys.rgb_to_hsv(*p) for p in f])
    huep = hsvp[:, 0] * 360
    soil_pal = donor_pal[~((huep >= 55) & (huep <= 175) & (hsvp[:, 1] > 0.15))]
    assert len(soil_pal) > 400, len(soil_pal)
    base_donors = [flatten_corduroy(degreen(a, soil_pal)) for a in raw]
    degreen_residue = [measure(tone_to_field(b))['green_pct'] for b in base_donors]

    # pale calcium accent ramp off APPROVED bone stucco + sand tile
    calc_src = palette_of(*[tm[f'stucco_bone_{i}'][0] for i in range(3)],
                          *[tm[f'roof_tile_sand_{i}'][0] for i in range(3)])
    pale = calc_src[lum(calc_src) > 138]
    pale = desat(pale, 0.40)
    pale = pale[np.argsort(lum(pale))]
    calc_ramp = np.stack([pale[int(k * (len(pale) - 1))] for k in (0.15, 0.55, 0.92)])
    salt_col = desat(calc_ramp[1:2], 0.25)[0] * 0.98

    # dead straw for stubble off dead_turf's own straw members
    turf_pal = palette_of(*[tm[f'dead_turf_{i}'][0] for i in range(3)])
    straw = turf_pal[(lum(turf_pal) > 95) & (lum(turf_pal) < 185)]
    r_, g_, b_ = straw[:, 0], straw[:, 1], straw[:, 2]
    straw = desat(straw[(r_ >= g_) & (g_ > b_)], 0.30)
    assert len(straw) > 20, len(straw)

    starter = load_starter(['dirt', 'concrete_0', 'concrete_1',
                            'yard_0', 'yard_1', 'yard_2'])
    dirt = starter['dirt']
    concrete = [starter['concrete_0'], starter['concrete_1']]
    yards = [starter['yard_0'], starter['yard_1'], starter['yard_2']]
    desert = load_desert_crops(4)
    gravel = load_gravel(4)

    tiles, sheets = [], {}
    def add(name, arr, kind, harvested, extra=None):
        m = measure(arr)
        # the style-target gauge binds FIELD TEXTURES; a boundary piece is
        # half harvested corpus desert and is judged on its field half + the
        # hard line, not on the mixed-material average
        applies = not name.startswith('edge_')
        e = dict(name=name, px=CELL, b64=png_b64(arr), metrics=m, kind=kind,
                 harvested_from=harvested, tolerance_applies=applies,
                 in_tolerance=in_tolerance(m))
        if extra:
            e.update(extra)
        tiles.append(e)
        sheets[name] = arr

    HARV_FIELD = ('soil: crop_furrow_0..2 (texture-match 8/1, PENDING, harvest '
                  'ordered by the form) de-greened + corduroy-flattened; calcium: '
                  'stucco_bone + roof_tile_sand pale members (APPROVED 8/1)')

    # ---- (1) furrowed field: plain x3, bald x2, windrow x2
    plains = [cook_field(base_donors, calc_ramp, salt_col, straw, 100 + i) for i in range(3)]
    for i, t in enumerate(plains):
        add(f'field_plain_{i}', t, 'furrowed dead field, one NE-SW furrow per cell',
            HARV_FIELD, dict(trough_minus_ridge=inversion(t)))
    balds = [cook_field(base_donors, calc_ramp, salt_col, straw, 120 + i, 'bald')
             for i in range(2)]
    for i, t in enumerate(balds):
        add(f'field_bald_{i}', t, 'wind-scoured bald patch, relief erased, caliche lag',
            HARV_FIELD, dict(trough_minus_ridge=inversion(t)))
    windrows = [cook_field(base_donors, calc_ramp, salt_col, straw, 140 + i, 'windrow')
                for i in range(2)]
    for i, t in enumerate(windrows):
        add(f'field_windrow_{i}', t, 'stubble-clump windrow riding the grain (code-7)',
            HARV_FIELD + '; stubble: dead_turf straw members',
            dict(trough_minus_ridge=inversion(t)))

    # ---- (2) bare graded plot
    plots = [cook_bare_plot(base_donors, dirt, calc_ramp, 160 + i) for i in range(2)]
    for i, t in enumerate(plots):
        add(f'bare_plot_{i}', t, 'bare graded plot, disked flat, NO grain',
            HARV_FIELD + '; canvas blend: starter dirt (APPROVED)')

    # ---- (3) berm crossings
    berms_ew = [cook_berm(base_donors, calc_ramp, salt_col, 200 + i, 0) for i in range(2)]
    berms_ns = [cook_berm(base_donors, calc_ramp, salt_col, 220 + i, 1) for i in range(2)]
    for i, t in enumerate(berms_ew):
        add(f'berm_ew_{i}', t, 'irrigation berm running EW, bowed, sky-lit top', HARV_FIELD)
    for i, t in enumerate(berms_ns):
        add(f'berm_ns_{i}', t, 'irrigation berm running NS, bowed, lit west flank', HARV_FIELD)

    # ---- (4) ditches
    d_earth = [cook_ditch_earth(base_donors, calc_ramp, salt_col, 240, True),
               cook_ditch_earth(base_donors, calc_ramp, salt_col, 241, False)]
    add('ditch_earth_silted', d_earth[0], 'dry earthen ditch, silted full, palest bottom',
        HARV_FIELD)
    add('ditch_earth_scoured', d_earth[1], 'dry earthen ditch, scoured, gravel-flecked bottom',
        HARV_FIELD)
    d_conc = [cook_ditch_conc(base_donors, concrete, calc_ramp, salt_col, 260, None),
              cook_ditch_conc(base_donors, concrete, calc_ramp, salt_col, 261, 15),
              cook_ditch_conc(base_donors, concrete, calc_ramp, salt_col, 262, 31)]
    add('ditch_conc_run', d_conc[0], 'concrete-lined ditch, plain run, silt drifts',
        HARV_FIELD + '; lining: starter concrete (APPROVED)')
    add('ditch_conc_joint_a', d_conc[1], 'concrete ditch at a JOINT: crack first, edge lifted',
        HARV_FIELD + '; lining: starter concrete (APPROVED)')
    add('ditch_conc_joint_b', d_conc[2], 'concrete ditch at a JOINT (offset variant)',
        HARV_FIELD + '; lining: starter concrete (APPROVED)')

    # ---- (5) WANG edge: INNER CORNERS FIRST (M12), then the 15 edge combos
    edges = {}
    for i, cnr in enumerate(INNER4):
        t = cook_edge(base_donors, desert, calc_ramp, salt_col, 300 + i, corner=cnr)
        edges['in_' + cnr] = t
        add(f'edge_in_{cnr}', t, f'INNER corner: desert bites the {cnr} corner',
            HARV_FIELD + '; desert: DESERT_POOLS corpus crops (harvested verbatim '
            'texture)', dict(wang='inner-' + cnr))
    for i, bits in enumerate(WANG15):
        t = cook_edge(base_donors, desert, calc_ramp, salt_col, 320 + i, bits=bits)
        edges[bits] = t
        add(f'edge_{bits}', t, 'field/desert hard edge piece',
            HARV_FIELD + '; desert: DESERT_POOLS corpus crops', dict(wang=bits))

    # ---- (6) pivot track 6-set
    track = {}
    for i, kind in enumerate(TRACK6):
        t = cook_track(base_donors, gravel, calc_ramp, salt_col, 400 + i, kind)
        track[kind] = t
        add(f'track_{kind}', t, 'pivot wheel-track rut pair (ground only; the '
            'machine is TF-WORLD-014)',
            HARV_FIELD + '; rut gravel: GROUND_POOL UP gravel (7/13 sweep)',
            dict(wang=kind))

    # ---------------------------------------------------------------- seams
    seam = {}
    seam['crop_furrow_donor_3x_baseline'] = run_seam([raw[k % 3] for k in range(9)])
    seam['flattened_donor_3x_baseline'] = run_seam(
        [tone_to_field(b) for b in base_donors] * 3)
    seam['field_plain_3x3_h'] = run_seam([plains[k % 3] for k in range(9)])
    seam['field_plain_3x3_v'] = run_seam_v([plains[k % 3] for k in range(9)])
    seam['field_long_run_16_h'] = run_seam([plains[(k * 2 + k // 3) % 3] for k in range(16)])
    seam['field_long_run_16_v'] = run_seam_v([plains[(k * 2 + k // 3) % 3] for k in range(16)])
    seam['field_mix_run_12'] = run_seam(
        [windrows[k % 2] if k % 3 == 2 else (balds[0] if k == 4 else plains[k % 3])
         for k in range(12)])
    seam['bare_plot_run'] = run_seam([plots[k % 2] for k in range(8)])
    seam['berm_ew_run'] = run_seam([berms_ew[k % 2] for k in range(8)])
    seam['berm_ns_run_v'] = run_seam_v([berms_ns[k % 2] for k in range(8)])
    seam['ditch_earth_run'] = run_seam([d_earth[k % 2] for k in range(8)])
    seam['ditch_conc_run'] = run_seam([d_conc[[0, 1, 0, 2][k % 4]] for k in range(8)])
    seam['edge_E_column_v'] = run_seam_v([edges['E'] for _ in range(6)])
    seam['track_EW_run'] = run_seam([track['EW'] for _ in range(6)])
    seam['track_NS_run_v'] = run_seam_v([track['NS'] for _ in range(6)])

    # structure separation (M14): farm structure band vs this ground family
    seps = {}
    struct = {}
    for mat in ('metal_corrugate', 'adobe_red', 'wood_fence'):
        struct[mat] = round(float(np.mean([lum(tm[f'{mat}_{i}'][0]).mean()
                                           for i in range(3)])), 1)
    fam_lum = {}
    for fam, arrs in (('field', plains + balds + windrows), ('bare_plot', plots),
                      ('berm', berms_ew + berms_ns), ('ditch_earth', d_earth),
                      ('ditch_conc', d_conc)):
        fl = round(float(np.mean([lum(a).mean() for a in arrs])), 1)
        fam_lum[fam] = fl
        seps[fam] = {m: round(abs(fl - sl), 1) for m, sl in struct.items()}
    des_lum = round(float(np.mean([lum(a).mean() for a in desert])), 1)
    des_sat = round(float(np.mean([measure(a)['sat'] for a in desert])), 3)

    # ---------------------------------------------------------------- proofs
    save(grid([[plains[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_field_plain.png', 3)
    save(grid([[windrows[(r + k) % 2] if r == 2 else plains[(r + k) % 3] for k in range(3)]
               for r in range(3)]), 'TILED_3x3_field_engine_mix.png', 3)
    save(grid([[plots[(r + k) % 2] for k in range(3)] for r in range(3)]),
         'TILED_3x3_bare_plot.png', 3)

    # LONG RUN: a directional grain only fails at length
    runh = [plains[(k * 2 + k // 3) % 3] for k in range(16)]
    runh[5] = balds[0]; runh[11] = balds[1]
    save(np.concatenate(runh, axis=1), 'LONG_RUN_16_horizontal.png', 2)
    runv = [plains[(k * 2 + k // 3) % 3] for k in range(16)]
    runv[4] = balds[1]; runv[10] = windrows[0]
    save(np.concatenate(runv, axis=0), 'LONG_RUN_16_vertical.png', 2)

    # berm + ditch crossing a field block
    rowsB = []
    for ry in range(7):
        row = []
        for rx in range(8):
            if ry == 2:
                row.append(berms_ew[rx % 2])
            elif ry == 4:
                row.append(d_conc[[0, 1, 0, 2, 0, 0, 1, 0][rx]])
            elif ry == 6:
                row.append(d_earth[rx % 2])
            else:
                row.append(windrows[rx % 2] if ry == 5 else plains[(rx + ry) % 3])
        rowsB.append(row)
    save(grid(rowsB), 'BERM_DITCH_CROSSINGS.png', 3)

    # WANG sheet, inner corners FIRST
    wang_entries = [('IN-' + c, edges['in_' + c]) for c in INNER4] + \
                   [('blank=field_plain_0', plains[0])] + \
                   [(b, edges[b]) for b in WANG15]
    labeled_sheet(wang_entries, 5).save(os.path.join(PROOF_DIR, 'WANG_SHEET_edge.png'))

    # the hard edge against desert: field island ringed by edge pieces,
    # desert pool crops beyond — THE ANCHOR PROOF
    D0, D1 = desert[0], desert[1]
    ring = [
        [D0, D1, D0, D1, D0, D1],
        [D1, edges['NW'], edges['N'], edges['N'], edges['NE'], D0],
        [D0, edges['W'], plains[0], plains[1], edges['E'], D1],
        [D1, edges['W'], plains[2], windrows[0], edges['E'], D0],
        [D0, edges['SW'], edges['S'], edges['S'], edges['ES'], D1],
        [D1, D0, D1, D0, D1, D0]]
    save(grid(ring), 'EDGE_RING_vs_desert.png', 3)

    # inner-corner L: desert bites the top-right, the notch turns the line
    rowsL = []
    for ry in range(5):
        row = []
        for rx in range(5):
            if ry <= 2 and rx >= 3:
                row.append(desert[(rx + ry) % 4])
            elif ry <= 2 and rx == 2:
                row.append(edges['E'])
            elif ry == 3 and rx >= 3:
                row.append(edges['N'])
            elif ry == 3 and rx == 2:
                row.append(edges['in_NE'])
            else:
                row.append(plains[(rx + ry) % 3])
        rowsL.append(row)
    save(grid(rowsL), 'EDGE_INNER_CORNER_L.png', 3)

    # track set + ring
    labeled_sheet([(k, track[k]) for k in TRACK6], 6).save(
        os.path.join(PROOF_DIR, 'TRACK_SET.png'))
    ringT = grid([[track['ES'], track['EW'], track['SW']],
                  [track['NS'], plains[0], track['NS']],
                  [track['NE'], track['EW'], track['NW']]])
    save(ringT, 'TRACK_RING_3x3.png', 3)

    # anchor composite: the form's G anchors beside the new family
    comp = [
        ('desert corpus 0', desert[0]), ('desert corpus 1', desert[1]),
        ('crop_furrow_0 DONOR', raw[0]), ('crop_furrow_1 DONOR', raw[1]),
        ('yard_0 APPROVED', yards[0]), ('starter dirt APPR', dirt),
        ('field_plain_0', plains[0]), ('field_plain_1', plains[1]),
        ('field_bald_0', balds[0]), ('field_windrow_0', windrows[0]),
        ('bare_plot_0', plots[0]), ('berm_ew_0', berms_ew[0]),
        ('ditch_earth_silted', d_earth[0]), ('ditch_conc_joint_a', d_conc[1]),
        ('edge_E', edges['E']), ('edge_in_NE', edges['in_NE']),
        ('track_NS', track['NS']), ('track_NE', track['NE']),
    ]
    labeled_sheet(comp, 6).save(os.path.join(PROOF_DIR, 'ANCHOR_COMPOSITE.png'))

    # contact sheet, every candidate
    labeled_sheet([(t['name'], sheets[t['name']]) for t in tiles], 8, scale=2) \
        .save(os.path.join(PROOF_DIR, 'CONTACT_SHEET_all.png'))

    # the farm block wearing it: field + berm + ditch + track arc + hard edge
    W, H = 30, 22
    canvas = np.zeros((H * CELL, W * CELL, 3))
    rngL = random.Random(SEED + 9999)
    def put(cx, cy, a):
        canvas[cy * CELL:(cy + 1) * CELL, cx * CELL:(cx + 1) * CELL] = a
    def field_pick(cx, cy):
        if cy % 3 == 2:
            return windrows[(cx * 5 + cy) % 2]         # code-7 every 3rd row
        if (cx * 7 + cy * 13) % 23 == 0:
            return balds[(cx + cy) % 2]
        return plains[(cx * 3 + cy * 5) % 20 % 3 if (cx + cy) % 5 else (cx + cy) % 3]
    for cy in range(H):
        for cx in range(W):
            if cx >= 28:
                put(cx, cy, desert[(cx + cy) % 4])
            elif cx == 27:
                put(cx, cy, edges['E'])
            else:
                put(cx, cy, field_pick(cx, cy))
    for cx in range(0, 8):                              # bare plot block, top-left
        for cy in range(0, 5):
            put(cx, cy, plots[(cx + cy) % 2])
    for cx in range(0, 27):                             # berm line
        put(cx, 6, berms_ew[cx % 2])
    for cx in range(0, 15):                             # concrete ditch, jointed
        put(cx, 13, d_conc[[0, 0, 1, 0, 0, 0, 2, 0][cx % 8]])
    for cx in range(15, 27):                            # earthen reach, silting in
        put(cx, 13, d_earth[cx % 2])
    tx0, ty0, tw, th = 17, 8, 8, 12                     # pivot track ring arc
    put(tx0, ty0, track['ES']); put(tx0 + tw - 1, ty0, track['SW'])
    put(tx0, ty0 + th - 1, track['NE']); put(tx0 + tw - 1, ty0 + th - 1, track['NW'])
    for cx in range(tx0 + 1, tx0 + tw - 1):
        if cx != 21:
            put(cx, ty0, track['EW']); put(cx, ty0 + th - 1, track['EW'])
    for cy in range(ty0 + 1, ty0 + th - 1):
        if cy != 13:
            put(tx0, cy, track['NS']); put(tx0 + tw - 1, cy, track['NS'])
    save(canvas, 'FARM_BLOCK_IN_PLACE_1x.png', 1)
    # squint at 1-tile map zoom: the field block + the hard edge + the arc
    sq = Image.new('RGB', (44 * 8 * 2 + 24, 44 * 8 + 40), (24, 24, 28))
    crops = ((('field+arc @1 tile'),
              canvas[6 * CELL:18 * CELL, 14 * CELL:26 * CELL]),
             (('hard edge @1 tile'),
              canvas[6 * CELL:18 * CELL, 21 * CELL:30 * CELL]))
    for i, (lab, region) in enumerate(crops):
        im = Image.fromarray(region.astype(np.uint8), 'RGB').resize((44, 44), Image.LANCZOS)
        im = im.resize((44 * 8, 44 * 8), Image.NEAREST)
        sq.paste(im, (8 + i * (44 * 8 + 8), 8))
        ImageDraw.Draw(sq).text((8 + i * (44 * 8 + 8), 44 * 8 + 14), lab,
                                fill=(225, 225, 225))
    sq.save(os.path.join(PROOF_DIR, 'SQUINT_1TILE_field_edge.png'))

    # ---------------------------------------------------------------- bank
    inv = {t['name']: t.get('trough_minus_ridge') for t in tiles
           if 'trough_minus_ridge' in t}
    bank = {
        'form': 'TF-ART-014',
        'cooked': '2026-08-09',
        'mode': 'MIXED',
        'note': 'Soil body of every tile = crop_furrow_0..2 (texture-match 8/1, '
                'PENDING PAOLO — the board form names them the furrowed base) '
                'harvested SURGICALLY: donors carried living green (8.1% on '
                'crop_furrow_1, dead-valley kill) and a baked 11px horizontal '
                'corduroy (4 furrows/tile, the exact midwest-corduroy failure '
                'the form forbids) — green quantized to the donors own soil '
                'palette, corduroy flattened, then the researched macro '
                're-imposed: ONE NE-SW furrow per cell (30in pitch = the 44px '
                'cell), ghost relief ~5-6 value step, salt-pale troughs '
                '(THE INVERSION, measured below), 3-9px caliche clasts '
                'clustered in low ground off APPROVED stucco_bone + '
                'roof_tile_sand pale members. Ditch lining = APPROVED starter '
                'concrete; bare plot blends APPROVED starter dirt; rut gravel '
                '= UP-only GROUND_POOL gravel; desert margins on every edge '
                'piece = DESERT_POOLS corpus crops. All field-family tiles '
                'share one global furrow phase ((x+y) mod 44) so ridges cross '
                'every seam unbroken; only the break/kink jitter differs per '
                'variant (no 44px metronome, no doubled or dropped ridge).',
        'boundaries': 'TF-WORLD-014 owns the pivot MACHINE (span/towers/dead '
                      'alfalfa circle) — this bank holds only ground + the '
                      'wheel-track rut. TF-ART-005 dead turf is a MAT — this '
                      'is bare soil with relief, palettes separable. '
                      'TF-RUN-002 owns gravel BEDS — caliche here is a '
                      'handful of clasts, gravel appears only inside the rut '
                      'mask. Russian-thistle drift belongs to the fence line, '
                      'not cooked here.',
        'engine_note': 'No engine change: furrow grain lives in the code-4 '
                       'field tile itself (field_plain/bald), code-7 becomes '
                       'the stubble-row variant (field_windrow) every 3rd '
                       'cell — see TILED_3x3_field_engine_mix.png.',
        'the_inversion': {'law': 'dry troughs LIGHTER than ridges (salt crust '
                                 '+ caliche collect in low ground); positive '
                                 'number = researched, dark trough = invented',
                          'trough_minus_ridge_lum': inv},
        'degreen_residue_green_pct': degreen_residue,
        'seam_contract': {'field/plot': 'SELF-SEAMLESS with a declared furrow '
                                        'phase ((x+y) mod 44, all variants)',
                          'berm/ditch/edge/track': 'SINGLE PLACEMENT, '
                                                   'field-phase margins',
                          'edge_set': 'WANG: 4 inner corners FIRST + 15 edge '
                                      'combos, blank = field_plain',
                          'measured_junction_vs_internal': seam},
        'separation_m14': {'structure_band_lum': struct,
                           'family_lum': fam_lum,
                           'abs_delta': seps},
        'desert_anchor': {'corpus_desert_lum': des_lum, 'corpus_desert_sat': des_sat,
                          'read': 'field is greyer + darker + flatter than the '
                                  'desert across the hard line; its only high '
                                  'value is the calcium speckle'},
        'harvest_sources': [
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt: crop_furrow_0..2 soil '
            '(PENDING, named by the form), stucco_bone + roof_tile_sand '
            'calcium ramp (APPROVED), dead_turf straw members (PENDING), '
            'metal_corrugate/adobe_red/wood_fence as separation refs only',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt: dirt + '
            'concrete canvases, yard anchors (APPROVED)',
            'banks/BOHEMIA_DESERT_POOLS_7_18_26.txt: corpus desert margins + anchors',
            'banks/BOHEMIA_GROUND_POOL_8_6_26.txt: UP gravel, rut fill only'],
        'consumers': ['TF-ART-014'],
        'tiles': tiles,
        'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    }
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f)
    print('tiles:', len(tiles))
    print('inversion (trough - ridge, + = researched):', json.dumps(inv, indent=1))
    print('degreen residue green%:', degreen_residue)
    print('seams:', json.dumps(seam, indent=1))
    print('separation:', json.dumps({'struct': struct, 'family': fam_lum}, indent=1))
    bad = [t['name'] for t in tiles if t['metrics']['purple_pct'] > 2.0]
    print('purple kills:', bad or 'none')
    grn = [(t['name'], t['metrics']['green_pct']) for t in tiles
           if t['metrics']['green_pct'] > 0.5]
    print('green residue >0.5%:', grn or 'none')
    out_tol = [(t['name'], t['metrics']) for t in tiles
               if t['tolerance_applies'] and not t['in_tolerance']]
    print('out of tolerance (field-texture gauge):', len(out_tol))
    for n, m in out_tol:
        print('  ', n, m)
    edge_note = [t['name'] for t in tiles if not t['tolerance_applies']
                 and not t['in_tolerance']]
    print('boundary pieces outside the field gauge (desert half, expected):',
          len(edge_note), edge_note)

if __name__ == '__main__':
    main()
