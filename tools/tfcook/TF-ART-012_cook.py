#!/usr/bin/env python3
"""TF-ART-012 cook (MERGED: TF-ART-012 + TF-WORLD-007 + the COMMERCIAL half of
TF-CITY-002) — the COMMERCIAL FLAT ROOF family: dark asphalt built-up roof
(ART-012's corrected research supersedes WORLD-007's white membrane), the
WANG-16 parapet ring, and the dead rooftop kit.

KEPT FROM WORLD-007 (the HUE MANDATE): parapet-cap/membrane COLOURWAYS are the
game's primary district hue carrier — three colourways cooked (galv/commercial,
bone/civic, oxide/industrial) + three cap-sheet membrane tints; acceptance is
two districts wearing two colourways distinguishable at 1-tile map zoom
(proof P12).

PARTITIONED WITH TF-CITY-002 (not merged): the commercial RTU/hatch/duct kit
lives HERE; the residential swamp cooler / package unit stays in TF-CITY-002.
NO swamp cooler is cooked in this file — a swamp cooler on a warehouse reads
as a house.

PARAPET-CORNER RULING EXECUTED: the parapet ring corner (outside AND inside)
is cooked HERE inside this job's WANG-16 ring, required for ring closure, and
stays STRUCK from TF-ART-017. One form owns it, never both.

CIVIC_PARAPET RECONCILIATION (8/3 bank, PENDING — do not rival): opened in
code and measured. civic_parapet is a WALL-FACE overlay: the sun-struck outer
FASCIA cap (measured ~208-220 lum band at its top rows) that sits on the wall
tile below the roof line. This cook draws the ROOF-PLANE ring only: coping TOP
(a horizontal plane, 125-138 by the value plan) + the 6px outer-face sliver
(115-125) that the wall overlay's fascia then continues downward. They are
complementary surfaces of the same coping, not rivals. WIRING NOTE for later
(not solved here): a renderer stacking both must not double-cap — flagged in
the bank JSON.

GEOMETRY LOCKED (44px cell, CELL_M 0.75, ONE PIXEL = 17mm):
  Parapet bands: coping 14px on N/W/E, 12px on S (12-24px legal band; the
  bright coping lip IS the building outline at map zoom — SimCity 2000 read).
  Inner face 8px (95-105, in its own shadow). S edge: 2px step (the barely
  visible inner-face top edge), 12px coping, 6px OUTER face (115-125) with
  coping-fastener rust streaks bleeding DOWN the outer face. Value plan:
  field mean 78-88 (dark BUR — it genuinely runs 170F), >=18 pts off ground
  103.7 and wall 139.2. Hatch: Bilco-type 54x45px lid + 18px curb, low box
  seen from above-left, CLOSED (act-2 portal, deliberately not one here).
  RTU small 2x2 cells, large 3x2 (car-sized; a person is a head and
  shoulders above one) — drawn taller than their cells, OPENED-FOR-COPPER AS
  DEFAULT (panels pulled, coil gone — LVMPD-documented Vegas metal-theft
  economy), condenser grille an ELLIPSE never a flat disc (lamp-bank
  reference), fans FROZEN. Duct straight+elbow on sleepers (sleeper period 22
  = a 44 divisor). Ballast stone is 1.1px: NEVER drawn stone-by-stone,
  clusters only (the concrete_0 99.6%-orphan disaster). Alligator cells
  1.5-4px in clusters, only where the wind stripped the gravel. Blister
  lenses 6-35px, upper-left lit, lower-right shade, some burst. Lap splits
  STRAIGHT (real ~54px BUR lap rhythm DECLARED COMPRESSED to the 44px cell —
  44's divisors are the only legal periods; variants shuffle the lap y so no
  global 44px beat forms). Wind SW->NE: bald where the wind ran, drifts
  BANKED against the downwind (N/E) parapet — directional, never random.
  Ponding: dark stain inside a pale alkali tide ring (Vegas hard water),
  NEVER blue. Nothing spins, glows, or lights. No green, no purple, no
  keyline, no dither, no baked cast shadows. sat ~0.19 world discipline.

WANG-16 CONTRACT: the field is the all-neighbours-filled centre tile; the
ring is its 15 boundary cases: 4 outside corners, 4 runs (x2 wear variants so
a long run does not stamp at 44px), 4 INSIDE CORNERS (BUILT FIRST — the test,
not the afterthought: an L-footprint fails without them), 3 ends/stubs, +
overflow scupper (6px notch, its invert above the low point). Mitred coping
at the S inside/outside corners is a declared 1px band compromise (~10 lum)
where the outer-face sliver turns the corner. A mid-edge 1-cell bump-out
additionally needs a double-inside-corner tile: NAMED, not cooked (outside
the 16 set); the 1x2 capsule (end_openS over end_openN) closes completely
and is proved. end_openE needs a corridor mate and is contact-sheet only.

ENGINE PRECONDITIONS NAMED, NOT SOLVED: no roof-plane case in the runtime
shadow pass and no prop layer above roofs in the run. JUDGE WITH SHADOWS OFF.
Nothing here is wired; slices/engine/gates untouched.

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE.
    gravel_roof_0/1/2 (APPROVED 8/1, in tolerance): THE SPEC-NAMED HARVEST —
    "approved gravel_roof pixels are the Wang centre field base - do not
    repaint the flat gravel." Harvested as the whole gravel field family and
    as the base under every ring tile, duct, drain, pond and bald variant.
    TREATMENT, not repaint: a uniform luminance remap from their measured
    94-99 mean down into the spec's checkable 78-88 dark-BUR band (harvested
    AS-IS they sit 4.7-9.6 pts off ground 103.7 — the exact M14 defect this
    form exists to fix) + a haboob-dust film (single flat blend toward desert
    tan, the "nothing is black-and-grey" clause). Grain/edge re-measured
    after treatment and guarded back into the style-target band.
    roof_shingle_0..2 + roof_shingle_bn_0..2 (APPROVED 8/1): granule PIXEL
    POPULATION donor for the granulated cap-sheet field (rank-remap of torus
    noise onto his granule palette — synthesized FROM his pixels, never an
    invented ramp), then tinted per membrane colourway.
  banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt — OPENED IN CODE. civic_parapet
    (PENDING) measured for the reconciliation above; not rivalled, not
    duplicated: no wall-face fascia is cooked here.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (APPROVED 7/28+7/29)
    — OPENED IN CODE. roof_deck / roof_parapet: the FAILING INCUMBENT (deck
    measured 99.0 vs ground 103.7 = 4.7 pts, fails M14) — anchor composite
    members for the before/after, display-only. wall_0 + dirt: the wall/
    ground value calibration rows under the warehouse plate proof,
    display-only. Nothing from the frozen set is re-cooked (byte-frozen
    under the CBB verdict; a new family is the only legal route).
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — opened, asserted in code:
    street/wreck/trash/crate/dead/barrier/camp buckets only; no roof member.
  banks/BOHEMIA_PERIMETER_8_2_26.txt — opened: perim_* yard walls only.
  banks/BOHEMIA_OPENINGS_8_2_26.txt — opened: house wall openings only.
  banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt x HD masters — walked in the
    form's own 7/29 shopping check and re-asserted in code: the only UP roof
    pack is "5. Roof tiles" (36 UP) = residential PITCHED shingle, already
    baked for HOUSE FACTORY v2 (banks/BOHEMIA_ROOF_KIT_EXPANSION_7_14_26.txt)
    — a pitched shingle field on a warehouse is the "different object
    wearing a recolour" mistake; disqualified. No bought flat-roof, parapet,
    RTU, hatch or duct family exists. BOUGHT-BEATS-PAINTED satisfied.
  VERDICT: mode MIXED — the gravel field IS his approved pixels (treated,
  not repainted); the cap sheet is synthesized from his approved granule
  population; painted pixels are only the genuine gaps (parapet ring
  geometry, scupper, hatch, RTUs, ducts, drain, pond stains, wear).

TASTE CHECK:
  DEAD VALLEY: nothing green anywhere — measured per tile, reported. The
    only vegetation-adjacent mark is dead mineral staining.
  NO PURPLE: measured per tile, kill line 2%.
  SAT DISCIPLINE: world sits near 0.19; every band is grey-built then dust
    tinted; colourway hue rides at sat 0.05-0.24, tile means reported.
  45 LAW: parapet shows THREE planes (outer face, coping top, inner face) —
    the inner face is what proves the roof is a plate inside a wall, not a
    sticker on a box. RTU is a box with a sky-lit top and two faces; the
    condenser grille is an ELLIPSE (lamp-bank reference), never a disc.
    Nothing flat side-on.
  NO KEYLINE / NO DITHER: every turn is a value step; near-black fraction
    measured per tile against the constitution's 6% ceiling.
  8/2 STAMP BUG: every repeating member ships MULTIPLE VARIANTS (gravel x3,
    bald x3, capsheet 3 tints x2, ponded x3, runs x2 per side); coping wear
    pits are per-variant; lap y offsets shuffled; sleepers on the 22px
    divisor. No hero feature at 44px pitch.
  QUIET FIELD: the field is the quietest surface we own — the contrast
    budget is spent on the coping lip, the hatch mouth and the unit
    silhouettes (M3/M13). The roof is BACKGROUND.
  DEAD MACHINES: every RTU is opened for copper, panels pulled, coil gone;
    fans frozen; nothing hums. Intact equipment would be a lie about the
    world.
  VERIFY ON THE REAL SURFACE: 3x3s, offset-wrap, rectangle AND L ring
    closures, whole-building warehouse plate over the frozen wall/dirt rows,
    civic plate, anchor composite beside the approved gravel and the failing
    incumbent, map-zoom colourway squint — PNGs for eyes, looked at with the
    Read tool before banking.

Deterministic: SEED fixed, rerunnable.
Writes ONLY:
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-012/*.png
"""

import base64
import io
import json
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

SEED = 120120
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-012_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-012')

GROUND_MEAN = 103.7   # constitution ground band mean (the M14 opponent)
WALL_MEAN = 139.2     # measured wall face the spec names
FIELD_TARGET = {'gravel': 83.0, 'bald': 80.0, 'capsheet': 86.0, 'ponded': 82.0}

# parapet band geometry (px) — one place, every piece agrees
COP = 14              # N/W/E coping width
INN = 8               # inner face width
S_STEP0, S_STEP1 = 24, 26     # S: inner-face top edge (2px value step)
S_COP0, S_COP1 = 26, 38       # S coping (12px)
S_OUT0, S_OUT1 = 38, 44       # S outer face (6px)

COLOURWAYS = {
    'galv':  {'cop': (129, 132, 136), 'inner': (99, 101, 104), 'outer': (119, 121, 124),
              'district': 'commercial'},
    'bone':  {'cop': (141, 133, 116), 'inner': (106, 99, 86),  'outer': (128, 120, 104),
              'district': 'civic'},
    'oxide': {'cop': (144, 122, 107), 'inner': (110, 94, 83),  'outer': (134, 113, 99),
              'district': 'industrial'},
}
CAP_TINTS = {'grey': (0.99, 1.00, 1.02), 'tan': (1.035, 1.00, 0.935), 'oxide': (1.05, 0.975, 0.925)}


# ---------------------------------------------------------------- measurement
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def hsv_masks(a):
    mx = a.max(axis=-1)
    mn = a.min(axis=-1)
    c = mx - mn
    sat = np.where(mx > 0, c / np.maximum(mx, 1e-6), 0)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    hue = np.zeros(mx.shape)
    m = (c > 0) & (mx == r)
    hue[m] = (60 * ((g - b) / np.maximum(c, 1e-6)) % 360)[m]
    m = (c > 0) & (mx == g)
    hue[m] = (60 * ((b - r) / np.maximum(c, 1e-6)) + 120)[m]
    m = (c > 0) & (mx == b)
    hue[m] = (60 * ((r - g) / np.maximum(c, 1e-6)) + 240)[m]
    return hue, sat, mx


def measure(a, alpha=None):
    """Style-target metrics + world-truth shares. a: HxWx3 float 0..255."""
    if alpha is not None:
        keep = alpha > 10
    else:
        keep = np.ones(a.shape[:2], bool)
    L = lum(a)
    dx = np.abs(np.diff(L, axis=1))
    kx = keep[:, 1:] & keep[:, :-1]
    edge = float(dx[kx].mean()) if kx.any() else 0.0
    grain = float((dx[kx] > 8).mean() * 100) if kx.any() else 0.0
    hue, sat, val = hsv_masks(a)
    purple = float(((hue >= 260) & (hue < 330) & (sat > 0.15) & (val > 40) & keep).mean() * 100)
    green = float(((hue >= 70) & (hue < 170) & (sat > 0.15) & (val > 40) & keep).mean() * 100)
    cols = len(np.unique(np.round(a[keep]).astype(np.uint8).reshape(-1, 3), axis=0))
    return {
        'colours': cols,
        'edge': round(edge, 3),
        'grain': round(grain, 3),
        'sat': round(float(sat[keep].mean()), 3),
        'lum_mean': round(float(L[keep].mean()), 3),
        'lum_sd': round(float(L[keep].std()), 3),
        'purple_pct': round(purple, 3),
        'green_pct': round(green, 3),
        'near_black_frac': round(float(((L < 20) & keep).mean()), 4),
    }


TOL = None  # loaded from the style target


def in_tolerance(m):
    return (m['colours'] >= TOL['colours_min']
            and TOL['edge'][0] <= m['edge'] <= TOL['edge'][1]
            and TOL['grain'][0] <= m['grain'] <= TOL['grain'][1]
            and TOL['sat'][0] <= m['sat'] <= TOL['sat'][1]
            and TOL['lum_mean'][0] <= m['lum_mean'] <= TOL['lum_mean'][1]
            and TOL['lum_sd'][0] <= m['lum_sd'] <= TOL['lum_sd'][1])


def wrap_stats(a):
    """Seam contract: wrap step vs the tile's own internal step (M10)."""
    L = lum(a)
    internal = np.abs(np.diff(L, axis=1)).mean()
    wrap_x = np.abs(L[:, 0] - L[:, -1]).mean()
    wrap_y = np.abs(L[0, :] - L[-1, :]).mean()
    worst = max(np.abs(L[:, 0] - L[:, -1]).max(), np.abs(L[0, :] - L[-1, :]).max())
    return {'internal_step': round(float(internal), 3),
            'wrap_x': round(float(wrap_x), 3), 'wrap_y': round(float(wrap_y), 3),
            'wrap_worst_px': round(float(worst), 2),
            'ratio': round(float(max(wrap_x, wrap_y) / max(internal, 1e-6)), 3)}


# ---------------------------------------------------------------- bank openers
def load_texture_match():
    """REUSE in code: the approved gravel field (spec-named harvest) + the
    approved shingle granule population for the cap sheet."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_TEXTURE_MATCH_8_1_26.txt')))
    out = {}
    for t in d['tiles']:
        if t['material'] in ('gravel_roof', 'roof_shingle', 'roof_shingle_bn'):
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
            out[t['id']] = (np.asarray(im).astype(np.float64), t['verdict'])
    for i in range(3):
        assert out[f'gravel_roof_{i}'][1].startswith('APPROVED'), 'harvest base not approved'
        assert out[f'roof_shingle_{i}'][1].startswith('APPROVED')
    return out


def load_civic_parapet():
    """REUSE in code: measure the PENDING wall-face fascia overlay so the
    roof-plane ring reconciles with it instead of rivalling it."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_CIVIC_OPENINGS_8_3_26.txt')))
    for t in d['tiles']:
        if t['id'] == 'civic_parapet':
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
            a = np.asarray(im).astype(np.float64)
            op = a[..., 3] > 10
            cap_rows = op[:12].any(axis=1)
            cap = lum(a[:12][..., :3])[op[:12]].mean() if cap_rows.any() else 0
            return {'status': d['status'], 'fascia_cap_lum': round(float(cap), 1)}
    raise AssertionError('civic_parapet missing from the 8/3 bank')


def load_starter(names):
    """REUSE in code: frozen approved starter tiles (anchors, display-only)."""
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


def assert_nothing_bought_covers_flat_roof():
    """Shopping sweep honoured in code."""
    ext = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')))
    assert set(ext['counts']) == {'street', 'wreck', 'trash', 'crate', 'dead',
                                  'barrier', 'camp'}, ext['counts']
    per = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_PERIMETER_8_2_26.txt')))
    mats = {t.get('material', t.get('id', '')) for t in per['tiles']}
    assert all(m.startswith('perim_') for m in mats), sorted(mats)[:8]
    op = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_OPENINGS_8_2_26.txt')))
    assert not any('roof' in t['id'] or 'parapet' in t['id'] for t in op['tiles'])
    conf = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))
    up_packs = {v['pack'] for v in conf['verdicts'] if v['v'] == 'UP'}
    flat_hits = [p for p in up_packs if any(k in p.lower() for k in
                 ('parapet', 'hvac', 'flat roof', 'duct'))]
    assert not flat_hits, flat_hits  # the only roof pack is pitched-residential "5. Roof tiles"


# ---------------------------------------------------------------- noise tools
def fft_noise(rng, shape, sigma_px, aniso=None):
    """Torus-periodic noise, gaussian low-pass at sigma_px; aniso=(angle_deg,
    ratio) stretches blobs along the angle. Deterministic per rng."""
    h, w = shape
    white = rng.standard_normal(shape)
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    if aniso:
        ang = np.deg2rad(aniso[0])
        u = fx * np.cos(ang) + fy * np.sin(ang)
        v = -fx * np.sin(ang) + fy * np.cos(ang)
        r2 = (u * aniso[1]) ** 2 + v ** 2
    else:
        r2 = fx ** 2 + fy ** 2
    transfer = np.exp(-2 * (np.pi * sigma_px) ** 2 * r2)
    out = np.real(np.fft.ifft2(np.fft.fft2(white) * transfer))
    out -= out.mean()
    sd = out.std()
    return out / (sd if sd > 1e-9 else 1)


def rank_remap(field, pop, rng):
    """Map a scalar field onto a pixel population by rank — the synthesized
    tile is MADE OF the donor's palette at the donor's density."""
    h, w = field.shape
    n = h * w
    flat = pop.reshape(-1, 3)
    order_pop = np.argsort(lum(flat) + rng.uniform(-0.01, 0.01, len(flat)))
    sorted_pop = flat[order_pop]
    idx = np.clip((np.arange(n) * len(flat) / n).astype(int), 0, len(flat) - 1)
    out = np.empty((n, 3))
    order_field = np.argsort(field.ravel())
    out[order_field] = sorted_pop[idx]
    return out.reshape(h, w, 3)


def scale_to_mean(a, target):
    return np.clip(a * (target / max(lum(a).mean(), 1e-6)), 0, 255)


def green_to_straw(a):
    """DEAD VALLEY + SAT DISCIPLINE: any living-green OR loud yellow-olive
    pixel that rides in with a harvest is re-hued to straw, luminance kept
    (the lichen blob in gravel_roof_1 stamps at 44px pitch if left loud —
    seen in the first 3x3 proof, muted here). The only changes ever made to
    his pixels beyond the declared value remap."""
    hue, sat, val = hsv_masks(a)
    out = a.copy()
    m = (hue >= 70) & (hue < 170) & (sat > 0.15) & (val > 40)
    m |= (hue >= 45) & (hue < 170) & (sat > 0.28) & (val > 40)   # olive-yellow
    if m.any():
        L = lum(a)[m][:, None]
        straw = np.hstack([L * 1.14, L * 1.02, L * 0.72])
        out[m] = np.clip(a[m] * 0.25 + straw * 0.75, 0, 255)
    # world sits near sat 0.19: clamp any remaining loud chroma toward grey
    hue, sat, val = hsv_masks(out)
    loud = sat > 0.40
    if loud.any():
        L = lum(out)[loud][:, None]
        out[loud] = np.clip(out[loud] * 0.45 + np.hstack([L, L, L]) * 0.55, 0, 255)
    return out


def edge_guard(a, lo=14.8):
    """Style-target floor: if synthesis lands under the edge band, restore
    micro-contrast about the mean until it clears."""
    for _ in range(8):
        L = lum(a)
        if np.abs(np.diff(L, axis=1)).mean() >= lo:
            break
        m = L.mean()
        a = np.clip(m + (a - m) * 1.05, 0, 255)
    return a


def grain_guard(a, lo=56.0, keep_mean=True):
    """If treatment dropped detail density below the style floor, restore
    contrast about the mean until it lands (never touches structure)."""
    for _ in range(8):
        L = lum(a)
        dx = np.abs(np.diff(L, axis=1))
        if (dx > 8).mean() * 100 >= lo:
            break
        m = L.mean() if keep_mean else 0
        a = np.clip(m + (a - m) * 1.05, 0, 255)
    return a


def seam_soften(a, m=6):
    """Mirror-pair the outermost margins so wrap seams sit inside the tile's
    own internal step. Applied ONLY when the measured ratio demands it."""
    out = a.copy()
    h, w, _ = a.shape
    for d in range(m):
        t = 0.5 * (m - d) / m
        out[:, d] = (1 - t) * out[:, d] + t * a[:, w - 1 - d]
        out[:, w - 1 - d] = (1 - t) * out[:, w - 1 - d] + t * a[:, d]
    for d in range(m):
        t = 0.5 * (m - d) / m
        out[d, :] = (1 - t) * out[d, :] + t * out[h - 1 - d, :]
        out[h - 1 - d, :] = (1 - t) * out[h - 1 - d, :] + t * out[d, :]
    return out


# ---------------------------------------------------------------- field cooks
def to_bur(a, target, rng, dust=0.06):
    """The harvest treatment: approved gravel -> dark BUR band. A luminance
    remap + one flat dust blend. Structure untouched."""
    out = green_to_straw(a)
    out = scale_to_mean(out, target)
    dustcol = np.array([166.0, 148.0, 118.0])
    out = out * (1 - dust) + dustcol * dust
    out = scale_to_mean(out, target)
    out = grain_guard(out)
    ws = wrap_stats(out)
    if ws['ratio'] > 1.45:
        out = seam_soften(out)
    return np.clip(out, 0, 255)


def add_blisters(a, rng, n=None):
    """Heat blisters: 6-35px soft lenses, upper-left lit / lower-right shade,
    some burst into a dark torn ring. Interior only (torus-safe)."""
    h, w, _ = a.shape
    L = a.copy()
    for _ in range(n if n is not None else rng.integers(1, 3)):
        cx, cy = rng.uniform(10, w - 10), rng.uniform(10, h - 10)
        r = rng.uniform(3.5, 10)
        yy, xx = np.mgrid[0:h, 0:w]
        d_lit = np.hypot(xx - (cx - r * 0.35), yy - (cy - r * 0.35))
        d_sh = np.hypot(xx - (cx + r * 0.35), yy - (cy + r * 0.35))
        lens = np.clip(1 - d_lit / r, 0, 1) ** 1.5 * 9 - np.clip(1 - d_sh / r, 0, 1) ** 1.5 * 9
        L = L + lens[..., None]
        if rng.random() < 0.4:  # burst: dark torn ring arc, lower side
            d = np.hypot(xx - cx, yy - cy)
            ring = (np.abs(d - r * 0.55) < 0.9) & (yy > cy - r * 0.2)
            L[ring] *= 0.82
    return np.clip(L, 0, 255)


def cook_bald(base, rng, target):
    """Wind-scoured: gravel gone in DIRECTIONAL patches (SW->NE wind) showing
    black bitumen, alligatored in clusters (1.5-4px cells — the one honest
    fine pattern), straight lap splits, a lighter scour rim."""
    h, w, _ = base.shape
    blob = fft_noise(rng, (h, w), 7, aniso=(45, 2.6)) + 0.5 * fft_noise(rng, (h, w), 3)
    bald = blob > np.quantile(blob, 0.76)
    # bitumen: the gravel's own pixels, darkened and browned — no invented ramp
    bit_pop = base.reshape(-1, 3) * np.array([0.60, 0.57, 0.53])
    bit = rank_remap(fft_noise(rng, (h, w), 1.4), bit_pop, rng)
    out = base.copy()
    soft = np.clip(fft_noise(rng, (h, w), 1.0) * 0.15 + (bald.astype(float)), 0, 1)
    out = out * (1 - soft[..., None] * 0.92) + bit * (soft[..., None] * 0.92)
    # alligator cells inside the bald patches (torus cellular)
    k = 240
    pts = rng.uniform(0, [w, h], (k, 2))
    yy, xx = np.mgrid[0:h, 0:w]
    dx = np.abs(xx[..., None] - pts[:, 0])
    dy = np.abs(yy[..., None] - pts[:, 1])
    dx = np.minimum(dx, w - dx)
    dy = np.minimum(dy, h - dy)
    d = np.sqrt(dx ** 2 + dy ** 2)
    d.sort(axis=-1)
    crack = ((d[..., 1] - d[..., 0]) < 0.7) & bald
    out[crack] *= 0.80
    # straight lap splits through the bald zones (~54px rhythm compressed to cell)
    for y in rng.choice(np.arange(6, h - 6), size=rng.integers(1, 3), replace=False):
        row = bald[y]
        out[y, row] *= 0.78
    # scour rim: gravel piled 1px at the patch edge
    rim = bald & ~np.roll(bald, 1, axis=1) | bald & ~np.roll(bald, -1, axis=1)
    out[rim & ~crack] = np.clip(out[rim & ~crack] * 1.10, 0, 255)
    out = scale_to_mean(out, target)
    out = add_blisters(out, rng, n=1)
    ws = wrap_stats(out)
    if ws['ratio'] > 1.45:
        out = seam_soften(out)
    return np.clip(out, 0, 255)


def cook_capsheet(shingle_pop, tint, lap_y, rng, target):
    """Granulated cap sheet synthesized from the APPROVED shingle granule
    population; ONE straight lap per tile (declared 44px compression of the
    real ~54px rhythm), lost-granule scour specks, one blister."""
    h = w = CELL
    field = fft_noise(rng, (h, w), 0.8) + 0.45 * fft_noise(rng, (h, w), 2.2)
    out = rank_remap(field, shingle_pop, rng)
    out = out * np.array(tint)
    # lap: 1px sun-caught granule edge + 1px shadow in the lap
    out[lap_y % h] = np.clip(out[lap_y % h] * 1.14, 0, 255)
    out[(lap_y + 1) % h] *= 0.80
    # scoured spots where granules let go: small dark clusters
    spots = fft_noise(rng, (h, w), 2.0) > 1.45
    out[spots] *= 0.84
    out = scale_to_mean(out, target)
    out = grain_guard(out)
    out = add_blisters(out, rng, n=1)
    ws = wrap_stats(out)
    if ws['ratio'] > 1.45:
        out = seam_soften(out)
    out = edge_guard(out)          # after the soften, so the floor holds
    out = scale_to_mean(out, target)
    return np.clip(out, 0, 255)


def cook_ponded(base, rng, target):
    """Clogged-drain ponding, dried: dark stain inside a pale alkali tide
    ring (Vegas hard water). NEVER blue. Interior feature, torus-safe."""
    h, w, _ = base.shape
    out = base.copy()
    cx, cy = rng.uniform(16, w - 16), rng.uniform(16, h - 16)
    yy, xx = np.mgrid[0:h, 0:w]
    ang = np.arctan2(yy - cy, xx - cx)
    wob = 1 + 0.22 * np.sin(ang * 3 + rng.uniform(0, 6.28)) + 0.12 * np.sin(ang * 5 + rng.uniform(0, 6.28))
    d = np.hypot(xx - cx, yy - cy) / wob
    R = rng.uniform(8, 12)
    stain = d < R
    pale = np.array([214.0, 207.0, 188.0])
    # stain: darker, browner, a touch desaturated — dried silt, not water
    out[stain] = out[stain] * 0.80 + np.array([14.0, 11.0, 7.0])
    ring = (d >= R) & (d < R + 2.4)
    out[ring] = out[ring] * 0.45 + pale * 0.55
    if rng.random() < 0.6:  # second, older tide line
        ring2 = (d >= R * 0.62) & (d < R * 0.62 + 1.4)
        out[ring2] = out[ring2] * 0.68 + pale * 0.32
    out = scale_to_mean(out, target)
    ws = wrap_stats(out)
    if ws['ratio'] > 1.45:
        out = seam_soften(out)
    return np.clip(out, 0, 255)


def cook_drain(base, rng):
    """Roof drain sump: shallow depression, clogged strainer, alkali halo,
    silt streaks converging. Interior only."""
    h, w, _ = base.shape
    out = base.copy()
    cx, cy = 22.0, 24.0
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.hypot(xx - cx, yy - cy)
    out = out * (1 - np.clip(1 - d / 15, 0, 1)[..., None] * 0.20)
    halo = (d >= 12) & (d < 14.2)
    out[halo] = out[halo] * 0.55 + np.array([210.0, 203.0, 185.0]) * 0.45
    # silt streaks running to the drain
    for a0 in rng.uniform(0, 6.28, 4):
        for t in np.linspace(4, 13, 22):
            x, y = int(cx + np.cos(a0) * t), int(cy + np.sin(a0) * t)
            if 0 <= x < w and 0 <= y < h:
                out[y, x] = out[y, x] * 0.9 + np.array([180.0, 172.0, 152.0]) * 0.1
    # the sump: galvanized rim, dark clogged bowl (ellipse — 45 view)
    rim = (np.abs((xx - cx) / 5.0) ** 2 + np.abs((yy - cy) / 3.6) ** 2)
    out[(rim < 1.35) & (rim > 0.75)] = np.array([116.0, 118.0, 120.0])
    bowl = rim <= 0.75
    out[bowl] = np.array([52.0, 48.0, 42.0])
    # silt in the bowl
    out[(rim <= 0.4)] = np.array([88.0, 80.0, 66.0])
    # upper-left lit rim pixel row
    out[(rim < 1.35) & (rim > 0.75) & (yy < cy) & (xx < cx)] += 14
    return np.clip(out, 0, 255)


# ---------------------------------------------------------------- ring cook
def noise_fill(shape3, rgb, sd, rng):
    n = rng.standard_normal(shape3[:2])[..., None]
    return np.clip(np.array(rgb, dtype=float) + n * sd, 0, 255)


def paint_ring(base, sides=(), inside=None, cw='galv', rng=None, scupper=False,
               drift=None):
    """One WANG-16 boundary tile: canonical field base, parapet bands over it.
    sides: outside edges ('N','E','S','W'). inside: diagonal for the four
    inside corners. Coping painted LAST (the mitre wins)."""
    C = COLOURWAYS[cw]
    t = base.copy()
    h, w, _ = t.shape
    yy, xx = np.mgrid[0:h, 0:w]
    cop = np.zeros((h, w), bool)
    innm = np.zeros((h, w), bool)
    stepm = np.zeros((h, w), bool)
    outm = np.zeros((h, w), bool)

    if inside == 'NE':
        cop |= (yy < COP) & (xx >= w - COP)
        innm |= (yy < COP + INN) & (xx >= w - COP - INN) & ~cop
    elif inside == 'NW':
        cop |= (yy < COP) & (xx < COP)
        innm |= (yy < COP + INN) & (xx < COP + INN) & ~cop
    elif inside == 'SE':
        stepm |= (yy >= S_STEP0) & (yy < S_STEP1) & (xx >= w - COP - INN)
        innm |= (yy >= S_COP0) & (xx >= w - COP - INN) & (xx < w - COP)
        cop |= (yy >= S_COP0) & (xx >= w - COP)
        mit = (yy >= S_OUT0) & (xx >= w - COP) & ((w - 1 - xx) < (yy - S_OUT0))
        outm |= mit
        cop &= ~mit
    elif inside == 'SW':
        stepm |= (yy >= S_STEP0) & (yy < S_STEP1) & (xx < COP + INN)
        innm |= (yy >= S_COP0) & (xx >= COP) & (xx < COP + INN)
        cop |= (yy >= S_COP0) & (xx < COP)
        mit = (yy >= S_OUT0) & (xx < COP) & (xx < (yy - S_OUT0))
        outm |= mit
        cop &= ~mit

    if 'N' in sides:
        cop |= yy < COP
        innm |= (yy >= COP) & (yy < COP + INN) & ~cop
    if 'W' in sides:
        cop |= xx < COP
        innm |= (xx >= COP) & (xx < COP + INN) & ~cop
    if 'E' in sides:
        cop |= xx >= w - COP
        innm |= (xx >= w - COP - INN) & (xx < w - COP) & ~cop
    if 'S' in sides:
        limit_w = ('W' in sides)
        limit_e = ('E' in sides)
        srange = np.ones((h, w), bool)
        stepm |= (yy >= S_STEP0) & (yy < S_STEP1) & srange & ~cop
        scop = (yy >= S_COP0) & (yy < S_COP1)
        sout = (yy >= S_OUT0)
        if limit_w:   # the outer face wraps the SW corner under the W coping
            pass
        cop |= scop
        outm |= sout
        cop &= ~(sout & ~((xx < COP) & limit_w) & ~((xx >= w - COP) & limit_e))
        if limit_w or limit_e:
            # corner wrap: outer face continues to the tile edge at the bottom
            cop &= ~sout
            outm |= sout
    # coping over inner/step where they collide; outer stays under nothing
    innm &= ~cop & ~outm
    stepm &= ~cop & ~outm & ~innm

    # fills
    t[outm] = noise_fill(t.shape, C['outer'], 4.0, rng)[outm]
    t[stepm] = noise_fill(t.shape, (88, 86, 82), 3.0, rng)[stepm]
    t[innm] = noise_fill(t.shape, C['inner'], 4.0, rng)[innm]
    t[cop] = noise_fill(t.shape, C['cop'], 4.5, rng)[cop]
    # coping BEVEL: the cap is a plane, not a band — brighter toward its sky
    # lip, dimmer where it turns down to the inner face (45 law, value steps)
    bev = np.zeros((h, w))
    if 'N' in sides or inside in ('NE', 'NW'):
        bev = np.maximum(bev, np.where(cop & (yy < COP), (COP - 1 - yy) / (COP - 1), 0))
    if 'W' in sides or inside in ('NW',):
        bev = np.maximum(bev, np.where(cop & (xx < COP), (COP - 1 - xx) / (COP - 1), 0))
    if 'E' in sides or inside in ('NE',):
        bev = np.maximum(bev, np.where(cop & (xx >= w - COP), (xx - (w - COP)) / (COP - 1), 0))
    if 'S' in sides or inside in ('SE', 'SW'):
        sb = np.where(cop & (yy >= S_COP0) & (yy < S_COP1),
                      (yy - S_COP0) / (S_COP1 - 1 - S_COP0), 0)
        bev = np.maximum(bev, sb)
    if inside in ('SE',):
        bev = np.maximum(bev, np.where(cop & (xx >= w - COP), (xx - (w - COP)) / (COP - 1), 0))
    if inside in ('SW',):
        bev = np.maximum(bev, np.where(cop & (xx < COP), (COP - 1 - xx) / (COP - 1), 0))
    t[cop] = np.clip(t[cop] + ((bev[cop] - 0.45) * 16)[:, None], 0, 255)

    # value-step accents (no keyline): coping edge toward inner = -8, toward
    # the sky lip = +6; inner face gets a 1px dark seam under the coping
    for shift, axis in (((1, 0), 0), ((-1, 0), 0), ((0, 1), 1), ((0, -1), 1)):
        nb = np.roll(cop, shift, axis=(0, 1))
        lip = cop & ~nb
    inner_edge = cop & (np.roll(innm, (-1, 0), (0, 1)) | np.roll(innm, (1, 0), (0, 1)) |
                        np.roll(innm, (0, -1), (0, 1)) | np.roll(innm, (0, 1), (0, 1)))
    t[inner_edge] = np.clip(t[inner_edge] - 12, 0, 255)
    under_cap = innm & (np.roll(cop, (1, 0), (0, 1)) | np.roll(cop, (0, 1), (0, 1)))
    t[under_cap] = np.clip(t[under_cap] - 7, 0, 255)   # inner face in the cap's shade
    sky_edge = cop & ((yy == 0) | (xx == 0) | (xx == w - 1) | (yy == S_COP1 - 1))
    # only edges that actually face the outside are lips
    if 'N' in sides or inside in ('NE', 'NW'):
        t[cop & (yy == 0)] = np.clip(t[cop & (yy == 0)] + 6, 0, 255)
    if 'W' in sides:
        t[cop & (xx == 0)] = np.clip(t[cop & (xx == 0)] + 6, 0, 255)
    if 'E' in sides:
        t[cop & (xx == w - 1)] = np.clip(t[cop & (xx == w - 1)] + 6, 0, 255)
    if 'S' in sides or inside in ('SE', 'SW'):
        drip = cop & (yy == S_COP1 - 1)
        t[drip] = np.clip(t[drip] + 7, 0, 255)

    # coping wear pits (variant-owned, so runs do not stamp)
    for _ in range(rng.integers(2, 5)):
        py, px = rng.integers(0, h), rng.integers(0, w)
        if cop[py, px]:
            t[py, px] = np.clip(t[py, px] - 25 + np.array([8.0, -2.0, -8.0]), 0, 255)

    # rust streaks DOWN the outer face from coping fasteners
    if outm.any():
        cols = np.unique(rng.integers(2, w - 2, rng.integers(2, 4)))
        for cx in cols:
            colm = outm[:, cx]
            ys = np.where(colm)[0]
            for i, y in enumerate(ys):
                f = max(0.0, 1 - i / 9)
                t[y, cx] = np.clip(t[y, cx] * (1 - 0.3 * f)
                                   + np.array([124.0, 88.0, 62.0]) * (0.3 * f), 0, 255)
                if cx + 1 < w and outm[y, cx + 1] and i < 3:
                    t[y, cx + 1] = np.clip(t[y, cx + 1] * (1 - 0.15 * f)
                                           + np.array([124.0, 88.0, 62.0]) * (0.15 * f), 0, 255)

    if scupper:  # 6px overflow notch through the S coping, invert above the low point
        nx0 = 19
        notch = (xx >= nx0) & (xx < nx0 + 6) & (yy >= S_COP0) & (yy < S_COP1)
        t[notch] = noise_fill(t.shape, (62, 58, 52), 3.0, rng)[notch]
        t[(xx == nx0 - 1) & (yy >= S_COP0) & (yy < S_COP1)] *= 0.88
        t[(xx == nx0 + 6) & (yy >= S_COP0) & (yy < S_COP1)] *= 0.88
        # the stain fan on the field above, converging to the notch
        fan = (yy < S_STEP0) & (np.abs(xx - (nx0 + 2.5)) < (S_STEP0 - yy) * 0.5) & (yy > 6)
        t[fan] *= 0.90
        # mineral bleed down the outer face below the notch
        below = (yy >= S_OUT0) & (np.abs(xx - (nx0 + 2.5)) < 3)
        t[below] = np.clip(t[below] * 0.72 + np.array([170.0, 158.0, 132.0]) * 0.28, 0, 255)

    if drift == 'N':  # ballast banked against the downwind (N) parapet inner toe
        zone = (yy >= COP + INN) & (yy < COP + INN + 9)
        g = fft_noise(rng, (h, w), 1.1)
        wgt = np.clip((COP + INN + 9 - yy) / 9.0, 0, 1) * 0.75 * (0.7 + 0.3 * g)
        wgt = np.where(zone, np.clip(wgt, 0, 1), 0)
        pale = np.clip(base * 1.30 * 0.7 + 60, 0, 255)
        t = t * (1 - wgt[..., None]) + pale * wgt[..., None]
    if drift == 'E':
        zone = (xx >= w - COP - INN - 9) & (xx < w - COP - INN)
        g = fft_noise(rng, (h, w), 1.1)
        wgt = np.clip((xx - (w - COP - INN - 9)) / 9.0, 0, 1) * 0.75 * (0.7 + 0.3 * g)
        wgt = np.where(zone, np.clip(wgt, 0, 1), 0)
        pale = np.clip(base * 1.30 * 0.7 + 60, 0, 255)
        t = t * (1 - wgt[..., None]) + pale * wgt[..., None]

    return np.clip(t, 0, 255)


# ---------------------------------------------------------------- kit sprites
def sprite_canvas(w, h):
    rgb = np.zeros((h, w, 3))
    alpha = np.zeros((h, w))
    return rgb, alpha


def box_faces(rgb, alpha, x0, y0, w, top_d, face_h, top_rgb, face_rgb, side_rgb,
              rng, side_w=6):
    """A 45-view box: sky-lit TOP, south FACE, east side sliver. Value steps,
    no keyline."""
    n = rng.standard_normal(rgb.shape[:2])[..., None]
    yy, xx = np.mgrid[0:rgb.shape[0], 0:rgb.shape[1]]
    top = (yy >= y0) & (yy < y0 + top_d) & (xx >= x0) & (xx < x0 + w - side_w)
    side_t = (yy >= y0 + 2) & (yy < y0 + top_d) & (xx >= x0 + w - side_w) & (xx < x0 + w)
    face = (yy >= y0 + top_d) & (yy < y0 + top_d + face_h) & (xx >= x0) & (xx < x0 + w - side_w)
    side_f = (yy >= y0 + top_d) & (yy < y0 + top_d + face_h - 2) & (xx >= x0 + w - side_w) & (xx < x0 + w)
    for m, col, sd in ((top, top_rgb, 4.0), (side_t, side_rgb, 3.0),
                       (face, face_rgb, 3.5), (side_f, np.array(side_rgb) * 0.9, 3.0)):
        rgb[m] = np.clip(np.array(col, dtype=float) + n[m][:, 0, None] * sd, 0, 255)
        alpha[m] = 255
    # top's lit rim (upper-left light): N edge + W edge +6; face top lip -0 step
    rgb[top & (yy == y0)] = np.clip(rgb[top & (yy == y0)] + 8, 0, 255)
    rgb[top & (xx == x0)] = np.clip(rgb[top & (xx == x0)] + 6, 0, 255)
    rgb[face & (yy == y0 + top_d)] = np.clip(rgb[face & (yy == y0 + top_d)] - 10, 0, 255)
    return top, face


def fan_ellipse(rgb, cx, cy, rx, ry, rng, grille=True):
    """The condenser: an ELLIPSE, never a flat disc. Frozen. Shroud rim lit
    upper-left, cavity dark, blades dim, hub a dot."""
    yy, xx = np.mgrid[0:rgb.shape[0], 0:rgb.shape[1]]
    e = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    rim = (e < 1.0) & (e > 0.68)
    rgb[rim] = np.array([118.0, 120.0, 122.0])
    lit = rim & (yy < cy) & (xx < cx + rx * 0.3)
    rgb[lit] = np.clip(rgb[lit] + 16, 0, 255)
    dark = rim & (yy > cy) & (xx > cx - rx * 0.2)
    rgb[dark] = np.clip(rgb[dark] - 14, 0, 255)
    cav = e <= 0.68
    rgb[cav] = np.array([46.0, 44.0, 42.0])
    if grille:
        sl = cav & (np.mod(yy - int(cy), 3) == 0)
        rgb[sl] = np.array([84.0, 86.0, 88.0])
    else:
        # grille stolen too: one dropped blade catches light across the cavity
        bl = cav & (np.abs((yy - cy) - 0.45 * (xx - cx)) < 1.0)
        rgb[bl] = np.array([96.0, 94.0, 90.0])
    # blades under the grille, dim
    bl2 = cav & (np.abs((xx - cx) * 0.55 + (yy - cy)) < 1.1)
    rgb[bl2] = np.clip(rgb[bl2] + 22, 0, 255)
    hub = e < 0.045
    rgb[hub] = np.array([92.0, 92.0, 92.0])


def rust_bleed(rgb, alpha, xs, y0, depth, rng):
    for cx in xs:
        for i in range(depth):
            y = y0 + i
            if 0 <= y < rgb.shape[0] and alpha[y, cx] > 0:
                f = max(0.0, 1 - i / depth)
                rgb[y, cx] = np.clip(rgb[y, cx] * (1 - 0.35 * f)
                                     + np.array([120.0, 84.0, 58.0]) * (0.35 * f), 0, 255)


def cook_rtu(size, rng, grille=True):
    """Packaged rooftop unit, OPENED FOR COPPER (the default state, not the
    exception): access panel gone, coil cavity empty, one panel leaning."""
    if size == 'small':
        W, TOP_D, FACE_H = 88, 52, 26
    else:
        W, TOP_D, FACE_H = 132, 54, 28
    H = TOP_D + FACE_H + 8
    rgb, alpha = sprite_canvas(W, H)
    top, face = box_faces(rgb, alpha, 0, 4, W, TOP_D, FACE_H,
                          (137, 131, 119), (105, 99, 88), (78, 74, 66), rng)
    yy, xx = np.mgrid[0:H, 0:W]
    # top panel seams (value steps)
    for sx in ((W // 3, 2 * W // 3) if size == 'large' else (W // 2,)):
        m = top & (xx == sx)
        rgb[m] = np.clip(rgb[m] - 9, 0, 255)
    # condenser fans: ellipses on the sky-lit top
    if size == 'small':
        fan_ellipse(rgb, W * 0.62, 4 + TOP_D * 0.42, 15, 9.5, rng, grille=grille)
    else:
        fan_ellipse(rgb, W * 0.70, 4 + TOP_D * 0.40, 15, 9.5, rng, grille=grille)
        fan_ellipse(rgb, W * 0.40, 4 + TOP_D * 0.44, 14, 9, rng, grille=not grille)
    # the copper theft: panel opening in the south face, coil GONE
    ox0 = int(W * 0.10)
    ow = int(W * 0.34)
    om = face & (xx >= ox0) & (xx < ox0 + ow) & (yy >= 4 + TOP_D + 3) & (yy < 4 + TOP_D + FACE_H - 3)
    rgb[om] = np.clip(np.array([40.0, 38.0, 36.0])
                      + rng.standard_normal(rgb.shape[:2])[..., None][om][:, 0, None] * 3, 0, 255)
    top_lip = om & (yy == 4 + TOP_D + 3)
    rgb[top_lip] = np.array([118.0, 112.0, 100.0])
    # hanging wires (dead, cut)
    for wx in (ox0 + 4, ox0 + ow - 7):
        for i in range(6):
            y = 4 + TOP_D + 4 + i
            x = wx + (i % 2)
            if om[y, x]:
                rgb[y, x] = np.array([70.0, 58.0, 44.0])
    # the pulled panel leaning against the base
    px0 = ox0 + ow + int(W * 0.08)
    pm = (yy >= 4 + TOP_D + FACE_H - 14) & (yy < 4 + TOP_D + FACE_H + 4) & \
         (xx >= px0) & (xx < px0 + 16)
    lean = pm & ((xx - px0) > (4 + TOP_D + FACE_H + 4 - yy) * 0.8 - 2)
    rgb[lean] = np.clip(np.array([120.0, 114.0, 103.0])
                        + rng.standard_normal(rgb.shape[:2])[..., None][lean][:, 0, None] * 3, 0, 255)
    alpha[lean] = 255
    # chalk streaks + rust
    ch = face & (np.mod(xx * 7 + 3, 13) < 2) & ~om
    rgb[ch] = np.clip(rgb[ch] + 8, 0, 255)
    rust_bleed(rgb, alpha, [2, W - 8], 4 + TOP_D, 8, rng)
    # base rail
    base = (yy >= 4 + TOP_D + FACE_H) & (yy < 4 + TOP_D + FACE_H + 3) & (xx > 1) & (xx < W - 7)
    rgb[base] = np.array([62.0, 58.0, 52.0])
    alpha[base] = 255
    return np.clip(rgb, 0, 255), alpha


def cook_hatch(rng):
    """Curb-mounted roof hatch, CLOSED and padlocked: 54x45px lid on an 18px
    curb, a low box seen from above-left. The act-2 portal, sealed."""
    W, H = 54, 52
    rgb, alpha = sprite_canvas(W, H)
    yy, xx = np.mgrid[0:H, 0:W]
    # curb (the 12in box under the lid): south face + east sliver
    curb_f = (yy >= 36) & (yy < 47) & (xx >= 3) & (xx < W - 6)
    curb_s = (yy >= 34) & (yy < 45) & (xx >= W - 6) & (xx < W - 1)
    n = rng.standard_normal((H, W))[..., None]
    rgb[curb_f] = np.clip(np.array([101.0, 97.0, 90.0]) + n[curb_f][:, 0, None] * 3.5, 0, 255)
    rgb[curb_s] = np.clip(np.array([74.0, 71.0, 65.0]) + n[curb_s][:, 0, None] * 3, 0, 255)
    alpha[curb_f | curb_s] = 255
    # lid: sky-lit galvanized top, slight overhang, 1px shade under the lip
    lid = (yy >= 4) & (yy < 36) & (xx >= 0) & (xx < W)
    rr = ((xx < 2) & (yy < 8)) | ((xx >= W - 2) & (yy < 8))  # soft corners
    lid &= ~rr
    rgb[lid] = np.clip(np.array([129.0, 131.0, 134.0]) + n[lid][:, 0, None] * 4, 0, 255)
    alpha[lid] = 255
    rgb[lid & (yy == 4)] = np.clip(rgb[lid & (yy == 4)] + 8, 0, 255)
    rgb[lid & (xx == 0)] = np.clip(rgb[lid & (xx == 0)] + 5, 0, 255)
    rgb[lid & (yy == 35)] = np.clip(rgb[lid & (yy == 35)] + 9, 0, 255)  # drip lip
    sh = (yy == 36) & (xx >= 3) & (xx < W - 6)
    rgb[sh] = np.clip(rgb[sh] * 0.72, 0, 255)
    # hinge line at the north edge
    rgb[lid & (yy == 6)] = np.clip(rgb[lid & (yy == 6)] - 10, 0, 255)
    # hasp + padlock, dead centre of the south lip
    hx = W // 2 - 1
    hm = (yy >= 33) & (yy < 40) & (xx >= hx) & (xx < hx + 3)
    rgb[hm] = np.array([58.0, 56.0, 54.0])
    alpha[hm] = 255
    # rust streaks down the curb from the lid fasteners
    rust_bleed(rgb, alpha, [8, 20, 34, 46], 37, 9, rng)
    # dust drift banked at the curb toe (downwind side) — quieter than the lid
    toe = (yy >= 45) & (yy < 48) & (xx >= 14) & (xx < W - 8)
    rgb[toe] = np.clip(np.array([128.0, 118.0, 100.0]) + n[toe][:, 0, None] * 4, 0, 255)
    alpha[toe] = 255
    return np.clip(rgb, 0, 255), alpha


def cook_panel(rng):
    """An access panel lying where the scrapper dropped it."""
    W, H = 22, 15
    rgb, alpha = sprite_canvas(W, H)
    yy, xx = np.mgrid[0:H, 0:W]
    n = rng.standard_normal((H, W))[..., None]
    m = (xx + yy * 0.3 >= 2) & (xx + yy * 0.3 < W - 1) & (yy >= 1) & (yy < H - 2)
    rgb[m] = np.clip(np.array([122.0, 116.0, 105.0]) + n[m][:, 0, None] * 4, 0, 255)
    alpha[m] = 255
    rgb[m & (yy == 1)] = np.clip(rgb[m & (yy == 1)] + 10, 0, 255)
    edge = m & (yy >= H - 4)
    rgb[edge] = np.clip(rgb[edge] * 0.85, 0, 255)
    return np.clip(rgb, 0, 255), alpha


def cook_duct_straight(base, rng, variant=0):
    """Galvanized duct on sleepers, running E-W, seamless along x. Sleeper
    period 22px (a 44 divisor). Dead line — dents, popped seams, no shine."""
    t = base.copy()
    h, w, _ = t.shape
    yy, xx = np.mgrid[0:h, 0:w]
    n = rng.standard_normal((h, w))[..., None]
    # sleepers first (under the duct): two per cell on the 22px divisor
    for sx in (8, 30):
        sm = (yy >= 30) & (yy < 36) & (xx >= sx) & (xx < sx + 6)
        t[sm] = np.clip(np.array([86.0, 76.0, 62.0]) + n[sm][:, 0, None] * 3, 0, 255)
    top = (yy >= 10) & (yy < 21)
    face = (yy >= 21) & (yy < 30)
    t[top] = np.clip(np.array([119.0, 121.0, 123.0]) + n[top][:, 0, None] * 4, 0, 255)
    t[face] = np.clip(np.array([94.0, 96.0, 98.0]) + n[face][:, 0, None] * 3.5, 0, 255)
    t[yy == 10] = np.clip(t[yy == 10] + 8, 0, 255)      # lit top edge
    t[yy == 20] = np.clip(t[yy == 20] - 8, 0, 255)      # roll to face
    us = (yy >= 30) & (yy < 32) & ~((xx >= 8) & (xx < 14)) & ~((xx >= 30) & (xx < 36))
    t[us] = np.clip(t[us] * 0.78, 0, 255)               # under-gap value step
    if variant == 1:
        # dented panel + popped transverse seam, interior so the wrap holds
        dm = (yy >= 13) & (yy < 19) & (xx >= 24) & (xx < 33)
        t[dm] = np.clip(t[dm] - 12, 0, 255)
        t[(yy >= 11) & (yy < 30) & (xx == 17)] = np.clip(
            t[(yy >= 11) & (yy < 30) & (xx == 17)] - 14, 0, 255)
    # dust film on the windward top
    t[top] = np.clip(t[top] * 0.92 + np.array([160.0, 146.0, 118.0]) * 0.08, 0, 255)
    return np.clip(t, 0, 255)


def cook_duct_elbow(base, rng):
    """Duct elbow: enters from the W as the straight, turns S on a mitred
    corner box. W edge matches duct_straight; exits into the unit below."""
    t = base.copy()
    h, w, _ = t.shape
    yy, xx = np.mgrid[0:h, 0:w]
    n = rng.standard_normal((h, w))[..., None]
    for sx in (8,):
        sm = (yy >= 30) & (yy < 36) & (xx >= sx) & (xx < sx + 6)
        t[sm] = np.clip(np.array([86.0, 76.0, 62.0]) + n[sm][:, 0, None] * 3, 0, 255)
    # horizontal run only to the elbow box
    top = (yy >= 10) & (yy < 21) & (xx < 30)
    face = (yy >= 21) & (yy < 30) & (xx < 30)
    t[top] = np.clip(np.array([119.0, 121.0, 123.0]) + n[top][:, 0, None] * 4, 0, 255)
    t[face] = np.clip(np.array([94.0, 96.0, 98.0]) + n[face][:, 0, None] * 3.5, 0, 255)
    t[(yy == 10) & (xx < 30)] = np.clip(t[(yy == 10) & (xx < 30)] + 8, 0, 255)
    t[(yy == 20) & (xx < 30)] = np.clip(t[(yy == 20) & (xx < 30)] - 8, 0, 255)
    us = (yy >= 30) & (yy < 32) & (xx < 30) & ~((xx >= 8) & (xx < 14))
    t[us] = np.clip(t[us] * 0.78, 0, 255)
    # the elbow box: slightly taller, mitre seam on the diagonal
    bx = (yy >= 8) & (yy < 32) & (xx >= 28) & (xx < 44)
    t[bx] = np.clip(np.array([116.0, 118.0, 121.0]) + n[bx][:, 0, None] * 4, 0, 255)
    mit = bx & (np.abs((xx - 28) - (yy - 8) * 0.66) < 0.8)
    t[mit] = np.clip(t[mit] - 10, 0, 255)
    t[bx & (yy == 8)] = np.clip(t[bx & (yy == 8)] + 8, 0, 255)
    t[bx & (yy >= 24) & (yy < 32)] = np.clip(t[bx & (yy >= 24) & (yy < 32)] - 18, 0, 255)
    # the vertical leg running S out of the box
    leg_top = (yy >= 32) & (xx >= 30) & (xx < 41)
    t[leg_top] = np.clip(np.array([114.0, 116.0, 119.0]) + n[leg_top][:, 0, None] * 4, 0, 255)
    side = (yy >= 32) & (xx >= 41) & (xx < 44)
    t[side] = np.clip(np.array([90.0, 92.0, 95.0]) + n[side][:, 0, None] * 3, 0, 255)
    t[(yy >= 32) & (xx == 30)] = np.clip(t[(yy >= 32) & (xx == 30)] + 6, 0, 255)
    return np.clip(t, 0, 255)


# ---------------------------------------------------------------- assembly
def classify_cell(mask, r, c):
    rows, cols = mask.shape

    def roof(rr, cc):
        return 0 <= rr < rows and 0 <= cc < cols and mask[rr, cc]
    sides = set()
    if not roof(r - 1, c):
        sides.add('N')
    if not roof(r + 1, c):
        sides.add('S')
    if not roof(r, c - 1):
        sides.add('W')
    if not roof(r, c + 1):
        sides.add('E')
    inside = None
    if not sides:
        if not roof(r - 1, c + 1):
            inside = 'NE'
        elif not roof(r - 1, c - 1):
            inside = 'NW'
        elif not roof(r + 1, c + 1):
            inside = 'SE'
        elif not roof(r + 1, c - 1):
            inside = 'SW'
    return sides, inside


def build_plate(mask, cw, ring, fields, field_seq, specials=None):
    """Assemble a roof plate from the cooked bank pieces. specials maps
    (r,c) -> tile array (scupper, drift runs, ponded, bald, drain...)."""
    rows, cols = mask.shape
    img = np.full((rows * CELL, cols * CELL, 3), 46.0)
    k = 0
    specials = specials or {}
    for r in range(rows):
        for c in range(cols):
            if not mask[r, c]:
                continue
            if (r, c) in specials:
                tile = specials[(r, c)]
            else:
                sides, inside = classify_cell(mask, r, c)
                if sides or inside:
                    key = (frozenset(sides), inside)
                    variants = ring[key]
                    tile = variants[(r * 5 + c * 3) % len(variants)]
                else:
                    # hash pick, not cycle: a cycle aligned with the row width
                    # lays variants in vertical stripes (seen in proof v1)
                    tile = fields[field_seq[(r * 7 + c * 13 + (r * c) % 5) % len(field_seq)]]
            img[r * CELL:(r + 1) * CELL, c * CELL:(c + 1) * CELL] = tile
            k += 1
    return img


def paste_sprite(img, rgb, alpha, x, y):
    h, w = alpha.shape
    H, W, _ = img.shape
    y0, x0 = max(0, y), max(0, x)
    y1, x1 = min(H, y + h), min(W, x + w)
    if y1 <= y0 or x1 <= x0:
        return
    sy0, sx0 = y0 - y, x0 - x
    a = (alpha[sy0:sy0 + y1 - y0, sx0:sx0 + x1 - x0] / 255.0)[..., None]
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - a) + rgb[sy0:sy0 + y1 - y0, sx0:sx0 + x1 - x0] * a


def to_png_b64(a, alpha=None):
    if alpha is not None:
        im = Image.fromarray(np.dstack([np.round(a).astype(np.uint8),
                                        np.round(alpha).astype(np.uint8)]), 'RGBA')
    else:
        im = Image.fromarray(np.round(a).astype(np.uint8), 'RGB')
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def save_proof(a, name, scale=2, alpha=None):
    if alpha is not None:
        im = Image.fromarray(np.dstack([np.round(a).astype(np.uint8),
                                        np.round(np.clip(alpha, 0, 255)).astype(np.uint8)]), 'RGBA')
    else:
        im = Image.fromarray(np.round(np.clip(a, 0, 255)).astype(np.uint8), 'RGB')
    if scale != 1:
        im = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    im.save(os.path.join(PROOF_DIR, name))
    return im


def label_strip(width, text, height=14):
    im = Image.new('RGB', (width, height), (24, 24, 26))
    d = ImageDraw.Draw(im)
    d.text((3, 2), text, fill=(200, 198, 192), font=ImageFont.load_default())
    return np.asarray(im).astype(float)


def stack_labelled(panels, pad=6, bg=30.0):
    """panels: list of (array, label). Vertical stack with label strips."""
    width = max(p.shape[1] for p, _ in panels) + pad * 2
    parts = []
    for p, lab in panels:
        strip = label_strip(width, lab)
        canvas = np.full((p.shape[0] + pad, width, 3), bg)
        x = (width - p.shape[1]) // 2
        canvas[:p.shape[0], x:x + p.shape[1]] = p
        parts.append(np.vstack([strip, canvas]))
    return np.vstack(parts)


# ---------------------------------------------------------------- main cook
def main():
    global TOL
    os.makedirs(PROOF_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    style = json.load(open(os.path.join(ROOT, 'records', 'BOHEMIA_STYLE_TARGET_8_1_26.json')))
    TOL = style['TOLERANCE']
    const = json.load(open(os.path.join(ROOT, 'records', 'target',
                                        'BOHEMIA_VISUAL_CONSTITUTION.json')))
    assert const['proxies']['light']['key'] == 'upper left'

    assert_nothing_bought_covers_flat_roof()
    tm = load_texture_match()
    civic = load_civic_parapet()
    starter = load_starter(['roof_deck', 'roof_parapet', 'wall_0', 'dirt'])
    rng = np.random.default_rng(SEED)

    tiles = []          # bank rows
    fields = {}         # name -> array (for assembly)

    def bank(name, arr, kind, layer, harvested, alpha=None, px=None):
        m = measure(arr, alpha)
        tiles.append({'name': name, 'px': px or CELL, 'b64': to_png_b64(arr, alpha),
                      'metrics': m, 'kind': kind, 'layer': layer,
                      'harvested_from': harvested})
        return m

    # ---- FIELDS -----------------------------------------------------------
    grav_note = ('gravel_roof_%d APPROVED 8/1 HARVESTED: uniform value remap into the '
                 'spec 78-88 dark-BUR band + one flat haboob-dust blend; structure untouched')
    field_metrics = {}
    for i in range(3):
        arr = to_bur(tm[f'gravel_roof_{i}'][0], FIELD_TARGET['gravel'], rng)
        fields[f'bur_gravel_{i}'] = arr
        m = bank(f'bur_gravel_{i}', arr, 'built-up gravel field (the Wang centre)',
                 'structure', grav_note % i)
        m['in_tolerance'] = in_tolerance(m)
        m['wrap'] = wrap_stats(arr)
        field_metrics[f'bur_gravel_{i}'] = m
    CANON = fields['bur_gravel_0']    # canonical field under every ring tile

    for i in range(3):
        arr = cook_bald(fields[f'bur_gravel_{i}'], np.random.default_rng(SEED + 40 + i),
                        FIELD_TARGET['bald'])
        fields[f'bur_bald_{i}'] = arr
        m = bank(f'bur_bald_{i}', arr,
                 'wind-scoured bald + alligatored (SW->NE directional; bitumen shows)',
                 'structure', 'bald bitumen synthesized from the treated gravel_roof pixels')
        m['in_tolerance'] = in_tolerance(m)
        m['wrap'] = wrap_stats(arr)
        field_metrics[f'bur_bald_{i}'] = m

    shingle_pop = np.vstack([tm[f'roof_shingle_{i}'][0].reshape(-1, 3) for i in range(3)]
                            + [tm[f'roof_shingle_bn_{i}'][0].reshape(-1, 3) for i in range(3)])
    lap_ys = {'grey': (9, 31), 'tan': (17, 39), 'oxide': (25, 3)}
    for tint_name, tint in CAP_TINTS.items():
        for j in range(2):
            arr = cook_capsheet(shingle_pop, tint, lap_ys[tint_name][j],
                                np.random.default_rng(SEED + 60 + j * 7 + hash(tint_name) % 50),
                                FIELD_TARGET['capsheet'])
            fields[f'capsheet_{tint_name}_{j}'] = arr
            m = bank(f'capsheet_{tint_name}_{j}', arr,
                     f'granulated cap sheet, {tint_name} membrane colourway (hue carrier)',
                     'structure',
                     'synthesized by rank-remap from APPROVED roof_shingle/_bn granule population')
            m['in_tolerance'] = in_tolerance(m)
            m['wrap'] = wrap_stats(arr)
            field_metrics[f'capsheet_{tint_name}_{j}'] = m

    for i in range(3):
        arr = cook_ponded(fields[f'bur_gravel_{(i + 1) % 3}'],
                          np.random.default_rng(SEED + 80 + i), FIELD_TARGET['ponded'])
        fields[f'ponded_{i}'] = arr
        m = bank(f'ponded_{i}', arr,
                 'ponded/mineral-stained: dark silt stain in a pale alkali tide ring, never blue',
                 'structure', 'treated gravel_roof base + interior stain (torus-safe)')
        m['in_tolerance'] = in_tolerance(m)
        m['wrap'] = wrap_stats(arr)
        field_metrics[f'ponded_{i}'] = m

    drain = cook_drain(fields['bur_gravel_1'], np.random.default_rng(SEED + 90))
    fields['drain_sump_0'] = drain
    bank('drain_sump_0', drain, 'roof drain sump, clogged, alkali halo', 'structure',
         'treated gravel_roof base + sump')

    # ---- WANG-16 RING (inside corners BUILT FIRST) ------------------------
    ring_specs = []
    for d in ('NE', 'NW', 'SE', 'SW'):                       # THE TEST, FIRST
        ring_specs.append((f'in_{d.lower()}', frozenset(), d))
    for s in ('N', 'E', 'S', 'W'):
        ring_specs.append((f'run_{s.lower()}', frozenset([s]), None))
    for pair, nm in ((('N', 'W'), 'out_nw'), (('N', 'E'), 'out_ne'),
                     (('S', 'E'), 'out_se'), (('S', 'W'), 'out_sw')):
        ring_specs.append((nm, frozenset(pair), None))
    for tri, nm in ((('N', 'E', 'W'), 'end_opens'), (('S', 'E', 'W'), 'end_openn'),
                    (('N', 'W', 'S'), 'end_opene')):
        ring_specs.append((nm, frozenset(tri), None))

    rings = {}   # colourway -> {(sides, inside): [variants]}
    for cw in COLOURWAYS:
        rings[cw] = {}
        for nm, sides, inside in ring_specs:
            nvar = 2 if nm.startswith('run_') else 1
            variants = []
            for v in range(nvar):
                rr = np.random.default_rng(SEED + 200 + (hash((cw, nm)) % 999) * 7 + v)
                arr = paint_ring(CANON, sides=sides, inside=inside, cw=cw, rng=rr)
                variants.append(arr)
                suffix = f'_{chr(97 + v)}' if nvar > 1 else ''
                kindbits = {'in': 'parapet INSIDE corner (ring closure for L/notched footprints)',
                            'ru': 'parapet straight run', 'ou': 'parapet outside corner',
                            'en': 'parapet end/stub (1-cell bump-out or capsule)'}[nm[:2]]
                bank(f'parapet_{cw}_{nm}{suffix}', arr,
                     f'{kindbits} — {cw} coping colourway ({COLOURWAYS[cw]["district"]})',
                     'structure', 'field portion = canonical treated gravel_roof_0')
            rings[cw][(sides, inside)] = variants
        # scupper: an S-run variant, and the drifted downwind runs
        rs = np.random.default_rng(SEED + 300 + hash(cw) % 99)
        scup = paint_ring(CANON, sides=frozenset(['S']), cw=cw, rng=rs, scupper=True)
        bank(f'parapet_{cw}_scupper', scup,
             'overflow scupper: 6px notch, stain fan above, mineral bleed below',
             'structure', 'field portion = canonical treated gravel_roof_0')
        rings[cw]['scupper'] = scup
    for dr, nm in (('N', 'run_n_drift'), ('E', 'run_e_drift')):
        rd = np.random.default_rng(SEED + 350 + ord(dr))
        arr = paint_ring(CANON, sides=frozenset([dr]), cw='galv', rng=rd, drift=dr)
        bank(f'parapet_galv_{nm}', arr,
             'downwind run with ballast drift banked against the parapet toe (SW->NE wind)',
             'structure', 'drift = the treated gravel pixels, paled — wind moved HIS ballast')
        rings['galv'][f'drift_{dr}'] = arr

    # ---- KIT --------------------------------------------------------------
    kit = {}
    r1 = np.random.default_rng(SEED + 400)
    rtu_s0, a_s0 = cook_rtu('small', r1, grille=True)
    rtu_s1, a_s1 = cook_rtu('small', np.random.default_rng(SEED + 401), grille=False)
    rtu_l0, a_l0 = cook_rtu('large', np.random.default_rng(SEED + 402), grille=True)
    hatch, a_h = cook_hatch(np.random.default_rng(SEED + 403))
    panel, a_p = cook_panel(np.random.default_rng(SEED + 404))
    kit['rtu_small_0'] = (rtu_s0, a_s0)
    kit['rtu_small_1'] = (rtu_s1, a_s1)
    kit['rtu_large_0'] = (rtu_l0, a_l0)
    kit['hatch_0'] = (hatch, a_h)
    kit['panel_pulled_0'] = (panel, a_p)
    bank('rtu_small_0', rtu_s0, 'packaged RTU small 2x2 cells, OPENED FOR COPPER, fan frozen',
         'structure', 'painted gap (no bought RTU exists)', alpha=a_s0, px=[88, 82])
    bank('rtu_small_1', rtu_s1, 'packaged RTU small, grille stolen too, one dropped blade',
         'structure', 'painted gap', alpha=a_s1, px=[88, 82])
    bank('rtu_large_0', rtu_l0, 'packaged RTU large 3x2 cells, two fans, coil cavity empty',
         'structure', 'painted gap', alpha=a_l0, px=[132, 90])
    bank('hatch_0', hatch, 'roof hatch CLOSED on its curb, padlocked (act-2 portal, sealed)',
         'structure', 'painted gap', alpha=a_h, px=[54, 52])
    bank('panel_pulled_0', panel, 'the pulled access panel, dropped', 'prop',
         'painted gap', alpha=a_p, px=[22, 15])

    duct0 = cook_duct_straight(fields['bur_gravel_2'], np.random.default_rng(SEED + 405), 0)
    duct1 = cook_duct_straight(fields['bur_gravel_2'], np.random.default_rng(SEED + 406), 1)
    elbow = cook_duct_elbow(fields['bur_gravel_2'], np.random.default_rng(SEED + 407))
    fields['duct_straight_0'] = duct0
    fields['duct_straight_1'] = duct1
    fields['duct_elbow_0'] = elbow
    bank('duct_straight_0', duct0, 'duct run on sleepers, E-W, seamless along x', 'structure',
         'field = treated gravel_roof_2; duct painted')
    bank('duct_straight_1', duct1, 'duct run, dented + popped seam variant', 'structure',
         'field = treated gravel_roof_2; duct painted')
    bank('duct_elbow_0', elbow, 'duct elbow, turns S into a unit collar', 'structure',
         'field = treated gravel_roof_2; duct painted')

    # ---- PROOFS -----------------------------------------------------------
    def tile3x3(names):
        g = np.zeros((3 * CELL, 3 * CELL, 3))
        for i in range(3):
            for j in range(3):
                g[i * CELL:(i + 1) * CELL, j * CELL:(j + 1) * CELL] = fields[names[(i * 3 + j) % len(names)]]
        return g

    save_proof(tile3x3(['bur_gravel_0', 'bur_gravel_1', 'bur_gravel_2']),
               'P01_3x3_bur_gravel.png')
    save_proof(tile3x3(['bur_bald_0', 'bur_bald_1', 'bur_bald_2']),
               'P02_3x3_bur_bald.png')
    save_proof(tile3x3(['capsheet_grey_0', 'capsheet_grey_1', 'capsheet_tan_0',
                        'capsheet_tan_1', 'capsheet_oxide_0', 'capsheet_oxide_1']),
               'P03_3x3_capsheet.png')
    save_proof(tile3x3(['ponded_0', 'bur_gravel_1', 'ponded_1', 'bur_gravel_2',
                        'ponded_2', 'bur_gravel_0']), 'P04_3x3_ponded.png')
    # offset wrap: 2x2 of the canon centre cropped at +22,+22 — the seam cross
    two = np.tile(CANON, (2, 2, 1))
    save_proof(two[22:22 + 2 * CELL, 22:22 + 2 * CELL], 'P05_offset22_bur_gravel.png')

    # rectangle closure, galv
    mask = np.ones((4, 6), bool)
    rect = build_plate(mask, 'galv', rings['galv'], fields,
                       ['bur_gravel_0', 'bur_gravel_1', 'bur_gravel_2'])
    save_proof(rect, 'P06_ring_rect_galv.png')

    # L closure, oxide, with scupper + drift on the downwind side
    maskL = np.ones((6, 8), bool)
    maskL[0:2, 5:8] = False
    specials = {(5, 3): rings['oxide']['scupper']}
    lplate = build_plate(maskL, 'oxide', rings['oxide'], fields,
                         ['bur_gravel_1', 'bur_bald_0', 'bur_gravel_2', 'bur_gravel_0'],
                         specials)
    save_proof(lplate, 'P07_ring_L_oxide.png')

    # the WHOLE-BUILDING warehouse plate (galv), over the frozen wall+dirt rows
    specials = {
        (5, 3): rings['galv']['scupper'],
        (3, 7): rings['galv']['drift_E'],
        (2, 6): rings['galv']['drift_N'],
        (4, 2): fields['bur_bald_1'],
        (4, 4): fields['ponded_0'],
        (4, 3): fields['drain_sump_0'],
        (1, 1): fields['duct_straight_0'],
        (1, 2): fields['duct_straight_1'],
        (1, 3): fields['duct_elbow_0'],
        (3, 4): fields['duct_straight_0'],
    }
    ware = build_plate(maskL, 'galv', rings['galv'], fields,
                       ['bur_gravel_0', 'bur_gravel_2', 'bur_gravel_1'], specials)
    paste_sprite(ware, rtu_l0, a_l0, 1 * CELL, 4 * CELL - rtu_l0.shape[0])
    paste_sprite(ware, rtu_s0, a_s0, 5 * CELL, 5 * CELL - rtu_s0.shape[0])
    paste_sprite(ware, hatch, a_h, 1 * CELL - 5, 5 * CELL - hatch.shape[0])
    paste_sprite(ware, panel, a_p, 2 * CELL + 8, 4 * CELL + 20)
    # pump-house capsule (ends prove a closed 1x2) floated beside
    cap_mask = np.ones((2, 1), bool)
    cap = build_plate(cap_mask, 'galv', rings['galv'], fields, ['bur_gravel_0'])
    W_ware = ware.shape[1]
    canvas = np.full((ware.shape[0] + 2 * CELL + 12, W_ware + cap.shape[1] + 24, 3), 46.0)
    canvas[:ware.shape[0], :W_ware] = ware
    canvas[CELL:CELL + cap.shape[0], W_ware + 16:W_ware + 16 + cap.shape[1]] = cap
    # frozen wall + dirt rows below the S parapet (display-only calibration)
    for c in range(maskL.shape[1]):
        canvas[ware.shape[0]:ware.shape[0] + CELL, c * CELL:(c + 1) * CELL] = starter['wall_0']
        canvas[ware.shape[0] + CELL:ware.shape[0] + 2 * CELL,
               c * CELL:(c + 1) * CELL] = starter['dirt']
    save_proof(canvas, 'P08_warehouse_plate_galv.png')

    # civic plate (bone ring, tan cap-sheet membrane; kit sparse so the
    # membrane itself is on show — the hue-carrier acceptance)
    maskC = np.ones((5, 6), bool)
    civ = build_plate(maskC, 'bone', rings['bone'], fields,
                      ['capsheet_tan_0', 'capsheet_tan_1'])
    paste_sprite(civ, rtu_s1, a_s1, 3 * CELL, 3 * CELL - rtu_s1.shape[0])
    paste_sprite(civ, hatch, a_h, 1 * CELL + 4, 2 * CELL - hatch.shape[0] + 14)
    save_proof(civ, 'P09_civic_plate_bone.png')

    # anchor composite, 3x nearest
    def big(a, s=3):
        return np.asarray(Image.fromarray(np.round(a).astype(np.uint8)).resize(
            (a.shape[1] * s, a.shape[0] * s), Image.NEAREST)).astype(float)

    row1 = np.hstack([big(tm['gravel_roof_0'][0]), np.full((132, 8, 3), 30.0),
                      big(fields['bur_gravel_0']), np.full((132, 8, 3), 30.0),
                      big(starter['roof_deck'])])
    row2 = np.hstack([big(starter['roof_parapet']), np.full((132, 8, 3), 30.0),
                      big(rings['galv'][(frozenset(['S']), None)][0]), np.full((132, 8, 3), 30.0),
                      big(rings['galv'][(frozenset(['N']), None)][0])])
    row3 = np.hstack([big(starter['wall_0']), np.full((132, 8, 3), 30.0),
                      big(starter['dirt']), np.full((132, 8, 3), 30.0),
                      big(tm['roof_shingle_0'][0])])
    comp = stack_labelled([
        (row1, 'APPROVED gravel_roof_0 (94.1) | MINE bur_gravel_0 (dark BUR) | INCUMBENT roof_deck (99.0 = the 4.4pt M14 fail)'),
        (row2, 'INCUMBENT roof_parapet | MINE parapet S run (coping+outer, galv) | MINE parapet N run (coping+inner)'),
        (row3, 'FROZEN wall_0 (139) | FROZEN dirt/ground (132) | APPROVED house shingle (world calibration)'),
    ])
    save_proof(comp, 'P10_anchor_composite.png', scale=1)

    # contact sheet
    cols_n = 8
    cellw = CELL * 2 + 8
    entries = [(t['name'], t) for t in tiles]
    rows_n = (len(entries) + cols_n - 1) // cols_n
    sheet = np.full((rows_n * (CELL * 2 + 26), cols_n * cellw, 3), 30.0)
    for i, (nm, t) in enumerate(entries):
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        rgba = np.asarray(im).astype(float)
        a_ = (rgba[..., 3:] / 255.0)
        arr = rgba[..., :3] * a_ + 30.0 * (1 - a_)   # composite over sheet bg
        arr2 = big(arr, 2) if max(arr.shape[:2]) <= 66 else big(arr, 1)
        r, c = divmod(i, cols_n)
        y0, x0 = r * (CELL * 2 + 26), c * cellw
        h, w = arr2.shape[:2]
        sheet[y0 + 14:y0 + 14 + min(h, CELL * 2), x0 + 2:x0 + 2 + min(w, cellw - 4)] = \
            arr2[:min(h, CELL * 2), :min(w, cellw - 4)]
        sheet[y0:y0 + 14, x0:x0 + cellw] = label_strip(cellw, nm[:22])[:, :cellw]
    save_proof(sheet, 'P11_contact_sheet.png', scale=1)

    # map-zoom squint: two districts, two colourways, 1-tile-ish
    def zoom(a, target_w=48):
        im = Image.fromarray(np.round(a).astype(np.uint8))
        s = target_w / im.width
        small = im.resize((target_w, max(1, int(im.height * s))), Image.BILINEAR)
        return np.asarray(small.resize((small.width * 6, small.height * 6),
                                       Image.NEAREST)).astype(float)
    zc = zoom(ware)
    zv = zoom(civ)
    hh = max(zc.shape[0], zv.shape[0])
    zpad = np.full((hh, zc.shape[1] + zv.shape[1] + 24, 3), 46.0)
    zpad[:zc.shape[0], :zc.shape[1]] = zc
    zpad[:zv.shape[0], zc.shape[1] + 24:] = zv
    mz = stack_labelled([(zpad, 'MAP ZOOM: commercial galv/gravel vs civic bone/tan-capsheet '
                                '— two districts, two colourways, one squint')])
    save_proof(mz, 'P12_mapzoom_colourways.png', scale=1)

    # ---- SUMMARY NUMBERS ---------------------------------------------------
    field_names = [n for n in field_metrics]
    value_plan = {
        'field_means': {n: field_metrics[n]['lum_mean'] for n in field_names},
        'ground_mean': GROUND_MEAN, 'wall_mean': WALL_MEAN,
        'min_sep_ground': round(min(abs(field_metrics[n]['lum_mean'] - GROUND_MEAN)
                                    for n in field_names if not n.startswith('capsheet')), 2),
        'min_sep_wall': round(min(abs(field_metrics[n]['lum_mean'] - WALL_MEAN)
                                  for n in field_names), 2),
        'incumbent_roof_deck_sep_was': 4.7,
        'coping_lum_by_colourway': {},
        'inner_lum': {}, 'outer_lum': {},
    }
    for cw in COLOURWAYS:
        n_run = rings[cw][(frozenset(['N']), None)][0]
        s_run = rings[cw][(frozenset(['S']), None)][0]
        value_plan['coping_lum_by_colourway'][cw] = round(float(lum(n_run[:COP]).mean()), 1)
        value_plan['inner_lum'][cw] = round(float(lum(n_run[COP:COP + INN]).mean()), 1)
        value_plan['outer_lum'][cw] = round(float(lum(s_run[S_OUT0:]).mean()), 1)
    seam = {n: field_metrics[n]['wrap'] for n in field_names}

    bank_doc = {
        'form': 'TF-ART-012',
        'merged_with': ['TF-WORLD-007 (superseded where they disagree: dark asphalt BUR, '
                        'WANG-16; its HUE MANDATE kept — colourways are the district hue carrier)',
                        'TF-CITY-002 COMMERCIAL members only (RTU/hatch/duct live here; the '
                        'residential swamp cooler stays in TF-CITY-002 — none cooked here)'],
        'parapet_corner_ruling': 'ring corners (outside AND inside) cooked HERE inside the '
                                 'WANG-16 ring; STRUCK from TF-ART-017. One form owns them.',
        'civic_parapet_reconciliation': {
            'bank': 'banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt', 'status': civic['status'],
            'measured_fascia_cap_lum': civic['fascia_cap_lum'],
            'ruling_honoured': 'civic_parapet is the WALL-FACE fascia overlay; this ring is the '
                               'ROOF-PLANE coping top (125-138) + 6px outer sliver (115-125) that '
                               'its fascia continues. Complementary, not rival. WIRING NOTE: a '
                               'renderer stacking both must not double-cap.'},
        'cooked': '2026-08-09',
        'mode': 'MIXED',
        'wang16': {'contract': 'field = all-neighbours-filled centre; ring = 4 outside corners, '
                               '4 runs x2 wear variants, 4 INSIDE corners (built first), 3 ends, '
                               '+ scupper. Closes a rectangle AND an L (proofs P06/P07).',
                   'named_not_cooked': 'double-inside-corner tile (mid-edge 1-cell bump-out '
                                       'needs it; outside the 16 set). end_opene needs a '
                                       'corridor mate — contact sheet only.',
                   'mitre_compromise': '1px band (~10 lum) where the S outer sliver turns the '
                                       'inside/outside S corners — declared, not hidden.'},
        'value_plan_measured': value_plan,
        'seam_contract_measured': seam,
        'style_target_check': {n: {'in_tolerance': field_metrics[n]['in_tolerance']}
                               for n in field_names},
        'engine_preconditions_named_not_solved': [
            'no roof-plane case in the runtime shadow pass — judge with shadows OFF',
            'no prop layer above roofs in the run'],
        'harvest_sources': {
            'gravel_roof_0..2': 'APPROVED 8/1 — the Wang centre field base (spec-named). '
                                'Treated (value remap to 78-88 + dust film), never repainted.',
            'roof_shingle_0..2 + roof_shingle_bn_0..2': 'APPROVED 8/1 — granule population '
                                'donor for the cap sheet (rank-remap synthesis).',
            'starter roof_deck/roof_parapet/wall_0/dirt': 'FROZEN — anchors/calibration, '
                                'display-only in proofs, never re-cooked.'},
        'consumers': ['TF-ART-012', 'TF-WORLD-007', 'TF-CITY-002 (commercial AC/hatch/duct '
                      'members only)', 'TF-ART-017 (parapet_corner resolution — cooked here, '
                      'struck there)'],
        'tiles': tiles,
        'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    }
    with open(BANK_OUT, 'w') as f:
        json.dump(bank_doc, f, indent=1)

    print(json.dumps({'tiles': len(tiles), 'value_plan': value_plan,
                      'seam': {k: v['ratio'] for k, v in seam.items()},
                      'tolerance': {n: field_metrics[n]['in_tolerance'] for n in field_names},
                      'purple_max': max(t['metrics']['purple_pct'] for t in tiles),
                      'green_max': max(t['metrics']['green_pct'] for t in tiles),
                      'near_black_max': max(t['metrics']['near_black_frac'] for t in tiles)},
                     indent=1))


if __name__ == '__main__':
    main()
