#!/usr/bin/env python3
"""
TF-ART-003 -- PARKING LOT STRIPING (stalls, ends, corners, ADA, wheel stop)
Cook for the tileforms board. CANDIDATES ONLY -- nothing here is wired.

REUSE CHECK:
  banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt  -- OPENED IN CODE below.
      The 7/31 street-pool law names "parking stalls" as bank-held. It holds
      pools.stall_line_v (18) + pools.stall_line_h (18) + weathered siblings,
      APPROVED (REAL_VEGAS R2). This cook HARVESTS their paint geometry
      (line position cols/rows 20-22, dash breaks, 30yr wear pattern) as
      per-pixel alpha masks. NOT repainted. The bank's embedded rulings
      travel with the harvest: markings_30yr_law (wash 0.55 + 0.40),
      parking_geometry_law (lines every 3rd tile, SHARED dividers, interior
      2 tiles, row depth 4, aisle 4 -- used verbatim in the assembled proof),
      weather_rarity_law (88/12).
  banks/BOHEMIA_MARKING_BANK_7_17_26.txt -- OPENED IN CODE below. 84 items
      APPROVED ("I like all of them"). DO-NOT-COOK: aisle arrows come from
      here. arrow_thru_v paint is extracted and COMPOSITED onto the lot
      field for the assembled-row proof. Zero arrow pixels painted fresh.
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt -- OPENED IN CODE below.
      lot_asphalt_0/1/2 (in tolerance, PENDING PAOLO) is the FIELD under
      every striping tile. TF-WORLD-001 owns that field (boundary confirmed
      by triage); this job composites paint over it and repaints nothing.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt -- OPENED IN CODE
      below. road_crossing is the APPROVED ANCHOR: its measured paint ramp
      (full (176,159,137) lum 161 / worn (110,98,84) lum 100) IS this cook's
      paint colour. Same paint, new geometry, per the form's section G.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt, BOHEMIA_PERIMETER_8_2_26.txt,
      BOHEMIA_CIVIC_OPENINGS_8_3_26.txt, BOHEMIA_OPENINGS_8_2_26.txt --
      checked, no stall geometry, no ADA, no wheel stops (walls/openings).
  HD masters (BOHEMIA_HD_TILE_REPO part1..4 x ACT1_CONFIRMED) -- checked via
      records/BOHEMIA_APPROVED_ASSET_INDEX: streetscape rows carry no stall
      ends, no ADA hatch, no wheel stop. Genuine gaps, painted here in the
      harvested paint.
  WHAT IS GENUINELY NEW: end caps / corners / tees / cross (WANG-16 row
      ends + corners the pool does not hold), double divider pair, ADA
      symbol + hatch (desaturated blue, sat kept at world level), wheel stop
      prop. Every new stroke uses the anchor paint ramp and the bank's wear
      discipline.

TASTE CHECK:
  - DEAD VALLEY: no living green painted. Field green share reported per
    tile (the only green is the one weed tuft already in approved-band
    lot_asphalt_0).
  - NO PURPLE: ADA blue is slate (hue ~215, sat <= 0.35). purple_pct
    measured per tile, kill line 2%.
  - LINE COLOR LAW: WHITE only. Zero yellow strokes -- yellow is direction.
  - 30 YEARS, NO RESTRIPE: paint 30-70% gone, worst at the stall mouth and
    wheel tracks, best where cars shaded it. Nothing crisp.
  - 44 DIVISOR LAW: ADA hatch pitch 11px (44/4) so the hatch wraps; no
    other intra-tile period at all.
  - 45 LAW: ground paint is flat (no thickness); the wheel stop prop gets
    the sky-lit top + darker front face + down-right shadow.
  - SAT DISCIPLINE: everything sits on the measured lot field (sat ~0.20);
    paint is near-neutral bone; ADA blue desaturated. No apricot repeat.
  - STAMP-BUG CHECK (first render, LOOKED AT, killed): lot_asphalt_0 carries
    a green weed tuft; baked into a striping tile it repeats at 44px pitch
    and reads as a rendering fault (the 8/2 stamp bug) AND sprinkles green
    over a dead valley. Candidates therefore bake on lot_asphalt_1/2 only.
    FLAG FOR TF-WORLD-001: their field has the same property; the weed tile
    needs the desert-dominance treatment (rare, clustered), never a cycle.
"""
import json, base64, io, os
import numpy as np
from PIL import Image, ImageFilter

SEED = 20260808
R = np.random.RandomState(SEED)
ROOT = '/home/user/bohemia'
B = os.path.join(ROOT, 'banks')
OUT_BANK = os.path.join(B, 'tileforms', 'TF-ART-003_CANDIDATES_8_8_26.json')
PROOF = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-003')
os.makedirs(PROOF, exist_ok=True)
os.makedirs(os.path.dirname(OUT_BANK), exist_ok=True)

C = 44                      # the art cell
LINE = slice(20, 23)        # measured off the bank: paint lives in cols/rows 20-22
PAINT_FULL = np.array([176.0, 159.0, 137.0])   # road_crossing full paint, lum 161
PAINT_WORN = np.array([110.0, 98.0, 84.0])     # road_crossing worn paint, lum 100
ADA_BLUE      = np.array([58.0, 72.0, 92.0])   # slate blue, hue ~215, sat 0.37 raw,
ADA_BLUE_WORN = np.array([66.0, 74.0, 86.0])   # washes to world sat once composited

# ---------------------------------------------------------------- bank IO
def dec_rgb(b64):
    return np.asarray(Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGB'),
                      dtype=np.float64)

def enc(img):
    bio = io.BytesIO(); img.save(bio, 'PNG')
    return base64.b64encode(bio.getvalue()).decode('ascii')

def lum(a):
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]

sp   = json.load(open(os.path.join(B, 'BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt')))
mb   = json.load(open(os.path.join(B, 'BOHEMIA_MARKING_BANK_7_17_26.txt')))
tm   = json.load(open(os.path.join(B, 'BOHEMIA_TEXTURE_MATCH_8_1_26.txt')))
star = json.load(open(os.path.join(B, 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')))

LOTS = [dec_rgb(t['b64']) for t in tm['tiles'] if t['material'] == 'lot_asphalt']
ROAD_CROSSING = dec_rgb([t['b64'] for t in star['tiles'] if t['id'] == 'road_crossing'][0])
ROAD_0 = dec_rgb([t['b64'] for t in star['tiles'] if t['id'] == 'road_0'][0])

# ------------------------------------------------- harvest the paint masks
def harvest_mask(tile, axis):
    """Per-pixel paintness [0,1] from a harmonized stall_line tile.
    axis 'v': paint in cols 20-22; 'h': rows 20-22. Zone is clamped +-1 so
    crack highlights outside the line are never mistaken for paint."""
    L = lum(tile)
    med = np.median(L)
    peak = L[:, LINE].max() if axis == 'v' else L[LINE, :].max()
    a = np.clip((L - (med + 6.0)) / max(peak - med - 6.0, 1.0), 0.0, 1.0)
    zone = np.zeros_like(a)
    if axis == 'v':
        zone[:, 19:24] = 1.0
    else:
        zone[19:24, :] = 1.0
    return a * zone

GAIN = 1.45   # first render LOOKED too faint beside the bold anchor bars;
              # gain keeps the dash gaps (0 stays 0) but lets surviving paint hit
MASK_V = [np.clip(harvest_mask(dec_rgb(b), 'v') * GAIN, 0, 1)
          for b in sp['pools']['stall_line_v'][:6]]
MASK_H = [np.clip(harvest_mask(dec_rgb(b), 'h') * GAIN, 0, 1)
          for b in sp['pools']['stall_line_h'][:6]]

# family edge harmonization for the paint (the bank's own trick): a canonical
# median edge signature stamped over the 3 rows/cols nearest each edge, so a
# divider NEVER restarts mid-row when variants stack.
def edge_stamp(masks, axis):
    stack = np.stack(masks)
    canon = np.median(stack, axis=0)
    out = []
    for m in masks:
        m = m.copy()
        for d in range(3):                       # weight 1.0 at the edge -> 0.25
            w = 1.0 - d * 0.375
            if axis == 'v':
                m[d, :]        = m[d, :] * (1 - w) + canon[d, :] * w
                m[C - 1 - d, :] = m[C - 1 - d, :] * (1 - w) + canon[C - 1 - d, :] * w
            else:
                m[:, d]        = m[:, d] * (1 - w) + canon[:, d] * w
                m[:, C - 1 - d] = m[:, C - 1 - d] * (1 - w) + canon[:, C - 1 - d] * w
        out.append(m)
    return out

MASK_V = edge_stamp(MASK_V, 'v')
MASK_H = edge_stamp(MASK_H, 'h')

# ----------------------------------------------------------- paint engine
def wear_field(shape, keep=0.55, scale=9, rng=None):
    """Smooth value-noise wear multiplier: ~keep fraction survives."""
    rng = rng or R
    small = rng.rand(shape[0] // scale + 2, shape[1] // scale + 2)
    img = Image.fromarray((small * 255).astype(np.uint8)).resize(
        (shape[1], shape[0]), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.2))
    n = np.asarray(img, dtype=np.float64) / 255.0
    lo = np.quantile(n, 1.0 - keep)
    return np.clip((n - lo) / max(1e-6, n.max() - lo) * 1.4, 0.0, 1.0)

def composite(base, mask, tint_full=None, tint_worn=None, wash=0.88):
    """Worn paint over asphalt. Paint colour slides worn->full with mask
    strength (the bank's two-pass wash left exactly that structure)."""
    tf = PAINT_FULL if tint_full is None else tint_full
    tw = PAINT_WORN if tint_worn is None else tint_worn
    a = np.clip(mask, 0, 1)[..., None] * wash
    t = np.clip((mask - 0.45) / 0.55, 0, 1)[..., None]
    col = tw + (tf - tw) * t
    jit = R.randn(*base.shape) * 3.0
    return np.clip(base * (1 - a) + (col + jit) * a, 0, 255)

def to_img(a):
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB')

# ------------------------------------------------------- geometry builders
def mask_end(mask, axis, stop, mouth_fade=8):
    """Line enters from one edge and STOPS -- worn hardest at the stop (the
    stall mouth per the form's wear brief). stop>0: keep [0..stop) of the run
    axis; stop<0: keep the far side."""
    m = mask.copy()
    ramp = np.ones(C)
    if stop >= 0:
        ramp[stop:] = 0.0
        ramp[max(0, stop - mouth_fade):stop] = np.linspace(0.9, 0.08,
            min(mouth_fade, stop - max(0, stop - mouth_fade)))
    else:
        s = C + stop
        ramp[:s] = 0.0
        ramp[s:min(C, s + mouth_fade)] = np.linspace(0.08, 0.9,
            min(mouth_fade, C - s))
    if axis == 'v':
        m *= ramp[:, None]
    else:
        m *= ramp[None, :]
    return m

def mask_corner(mv, mh, v_side, h_side):
    """L piece: vertical run toward v_side edge + horizontal run toward
    h_side edge, meeting at the 20-22 junction."""
    v = mask_end(mv, 'v', 23 if v_side == 'N' else -21, mouth_fade=2)
    h = mask_end(mh, 'h', 23 if h_side == 'W' else -21, mouth_fade=2)
    return np.maximum(v, h)

def mask_tee(mv, mh, branch):
    v = mask_end(mv, 'v', -21 if branch == 'S' else 23, mouth_fade=2)
    return np.maximum(mh, v)

def mask_double(axis, idx):
    """Double divider: two 2px lines, centres 8px apart (~27cm), built by
    sliding harvested single-line wear onto the pair columns."""
    src = (MASK_V if axis == 'v' else MASK_H)
    m1 = src[idx % 6]; m2 = src[(idx + 3) % 6]
    out = np.zeros((C, C))
    if axis == 'v':
        out[:, 17:19] = m1[:, 20:22]
        out[:, 25:27] = m2[:, 21:23]
    else:
        out[17:19, :] = m1[20:22, :]
        out[25:27, :] = m2[21:23, :]
    return out

def mask_hatch(idx):
    """ADA access-aisle hatch: 45-degree 2px diagonals at 11px pitch (a 44
    divisor, so the hatch wraps). NO boundary lines baked in -- a first
    render LOOKED wrong tiled 2-wide (false interior line pairs); the aisle
    boundary is the stall_v divider family's job, not this tile's."""
    m = np.zeros((C, C))
    yy, xx = np.mgrid[0:C, 0:C]
    d = (xx + yy) % 11
    m[(d == 0) | (d == 1)] = 0.9
    return m * wear_field((C, C), keep=0.52 + 0.06 * idx, scale=7)

def ada_symbol_mask():
    """ISA glyph, chunky at tile scale. First render LOOKED like a crescent
    moon + blob; redrawn SOLID: full wheel ring, fat strokes, clear head."""
    m = np.zeros((C, C))
    yy, xx = np.mgrid[0:C, 0:C]
    # rear wheel: FULL circle, centre (17,27), r 8.5, 2.5px stroke
    rr = np.sqrt((xx - 17.0) ** 2 + (yy - 27.0) ** 2)
    m[np.abs(rr - 8.5) <= 1.3] = 1.0
    m[8:12, 17:21] = 1.0                         # head, separated from torso
    m[13:22, 17:20] = 1.0                        # torso, upright-ish
    m[19:22, 20:29] = 1.0                        # thigh forward
    m[22:29, 26:29] = 1.0                        # shin down
    m[29:32, 26:34] = 1.0                        # footrest
    m[14:17, 20:27] = 1.0                        # arm
    return np.clip(m, 0, 1)

def ada_field_mask(idx):
    """The faded blue stall field: blotchy, 30 years of tires. Per-pixel
    jitter keeps the lot grain alive under the wash (first render measured
    too smooth: edge 13.4 / grain 52 on symbol_0, out of tolerance)."""
    m = wear_field((C, C), keep=0.62, scale=6) * 0.5 + \
        wear_field((C, C), keep=0.5, scale=13) * 0.15
    return m * (0.7 + 0.6 * R.rand(C, C))

# --------------------------------------------------------------- the cook
tiles = []          # bank entries
IMGS = {}           # name -> np array (for proofs)

def add(name, arr, kind, harvested, px=44):
    IMGS[name] = arr
    tiles.append({'name': name, 'px': px, 'arr': arr, 'kind': kind,
                  'harvested_from': harvested})

# candidates bake on the weed-free bases ONLY (see the stamp-bug taste check)
CAND_LOTS = [LOTS[1], LOTS[2]]
lot = lambda i: CAND_LOTS[i % 2]

# 1. single stall line, the SHARED divider (pure harvest onto the lot field)
for i in range(6):
    add('stall_v_%d' % i, composite(lot(i), MASK_V[i]),
        'single stall divider, N-S run', 'street_pools stall_line_v[%d] + lot_asphalt_%d' % (i, 1 + i % 2))
for i in range(6):
    add('stall_h_%d' % i, composite(lot(i + 1), MASK_H[i]),
        'single stall divider, E-W run', 'street_pools stall_line_h[%d] + lot_asphalt_%d' % (i, 1 + (i + 1) % 2))

# 2. double line between stalls (pair geometry is the only new part)
for i in range(3):
    add('stall_double_v_%d' % i, composite(lot(i), mask_double('v', i)),
        'double divider pair, N-S', 'wear slid off stall_line_v; anchor paint')
for i in range(3):
    add('stall_double_h_%d' % i, composite(lot(i + 2), mask_double('h', i)),
        'double divider pair, E-W', 'wear slid off stall_line_h; anchor paint')

# 3. stall ends (the mouth: line stops, worn hardest right at the stop)
for i in range(3):
    add('stall_v_endS_%d' % i, composite(lot(i), mask_end(MASK_V[i], 'v', 31 + (i % 2) * 3)),
        'divider end cap, run from N stops (stall mouth)', 'stall_line_v[%d] worn out' % i)
    add('stall_v_endN_%d' % i, composite(lot(i + 1), mask_end(MASK_V[i + 3], 'v', -(31 + (i % 2) * 3))),
        'divider end cap, run from S stops', 'stall_line_v[%d] worn out' % (i + 3))
for i in range(2):
    add('stall_h_endE_%d' % i, composite(lot(i), mask_end(MASK_H[i], 'h', -(31 + i * 3))),
        'divider end cap, run from W stops', 'stall_line_h[%d] worn out' % i)
    add('stall_h_endW_%d' % i, composite(lot(i + 2), mask_end(MASK_H[i + 2], 'h', 31 + i * 3)),
        'divider end cap, run from E stops', 'stall_line_h[%d] worn out' % (i + 2))

# 4. corners + tees + cross (WANG-16 row ends and corners)
for j, (vs, hs) in enumerate((('N', 'W'), ('N', 'E'), ('S', 'W'), ('S', 'E'))):
    for i in range(2):
        add('stall_corner_%s%s_%d' % (vs, hs, i),
            composite(lot(i + j), mask_corner(MASK_V[(i + j) % 6], MASK_H[(i + j + 2) % 6], vs, hs)),
            'row corner, line exits %s and %s' % (vs, hs), 'stall_line v+h joined')
for i in range(2):
    add('stall_tee_S_%d' % i, composite(lot(i), mask_tee(MASK_V[i + 1], MASK_H[i + 4], 'S')),
        'head-line tee, divider drops S', 'stall_line v+h joined')
    add('stall_tee_N_%d' % i, composite(lot(i + 1), mask_tee(MASK_V[i + 2], MASK_H[i], 'N')),
        'head-line tee, divider rises N', 'stall_line v+h joined')
add('stall_cross_0', composite(lot(2), np.maximum(MASK_V[4], MASK_H[5])),
    'back-to-back rows crossing', 'stall_line v+h joined')

# 5. ADA stall + hatch (blue desaturated to the world, never cadmium)
for i in range(2):
    base = composite(lot(i), ada_field_mask(i), tint_full=ADA_BLUE,
                     tint_worn=ADA_BLUE_WORN, wash=0.6)
    # glyph keeps a 0.28 alpha floor: worn everywhere, GONE nowhere, so the
    # figure still reads (cars shaded the symbol; the form's wear brief)
    sym = np.clip(ada_symbol_mask() * (wear_field((C, C), keep=0.8, scale=8) * 1.05 + 0.28), 0, 1)
    add('ada_symbol_%d' % i, composite(base, sym),
        'ADA stall: faded blue field + ISA glyph', 'new geometry, anchor paint + slate blue')
for i in range(3):
    hb = composite(lot(i), ada_field_mask(i + 1) * 0.5, tint_full=ADA_BLUE,
                   tint_worn=ADA_BLUE_WORN, wash=0.5)
    add('ada_hatch_%d' % i, composite(hb, mask_hatch(i)),
        'ADA access aisle hatch, 11px pitch', 'new geometry, anchor paint')

# 6. wheel stop (PROP layer, alpha, 45-view: sky-lit top, front face, shadow)
def wheel_stop(i):
    W, H = 30, 8
    rgba = np.zeros((H, W, 4))
    x0, y0 = 2, 1
    body_w, top_h, face_h = 26, 2, 3
    conc_top = 158 - i * 6
    conc_face = 106 - i * 5
    for y in range(top_h):
        rgba[y0 + y, x0:x0 + body_w, :3] = conc_top - y * 8 + R.randn(body_w, 1) * 5
    for y in range(face_h):
        rgba[y0 + top_h + y, x0:x0 + body_w, :3] = conc_face - y * 7 + R.randn(body_w, 1) * 5
    rgba[y0:y0 + top_h + face_h, x0:x0 + body_w, :3] += np.array([6.0, 2.0, -4.0])  # warm concrete
    rgba[y0:y0 + top_h + face_h, x0, :3] *= 0.72                    # shaded W end
    rgba[y0:y0 + top_h + face_h, x0 + body_w - 1, :3] *= 0.8
    for tx in (x0 + 6 + i, x0 + 18 - i):                            # tire scuff + rust
        rgba[y0:y0 + top_h + face_h, tx:tx + 2, :3] *= 0.78
        rgba[y0 + top_h:y0 + top_h + 2, tx:tx + 2, :3] = [96, 70, 52]
    rgba[y0:y0 + top_h + face_h, x0:x0 + body_w, 3] = 255
    ch = R.rand(body_w) < 0.12                                      # chipped crest
    rgba[y0, x0:x0 + body_w, 3][ch] = 0
    sy = y0 + top_h + face_h
    rgba[sy, x0 + 1:x0 + body_w + 1, :3] = 20
    rgba[sy, x0 + 1:x0 + body_w + 1, 3] = 110                       # down-right shadow
    return rgba

for i in range(3):
    ws = wheel_stop(i)
    IMGS['wheel_stop_%d' % i] = ws
    tiles.append({'name': 'wheel_stop_%d' % i, 'px': '30x8', 'arr': ws,
                  'kind': 'wheel stop PROP, alpha, 45-view sky-lit top',
                  'harvested_from': 'new prop, concrete band values'})

# ------------------------------------------------- marking-bank arrow (reuse)
# two LOOK passes happened here: (1) index-0 pick read as random speckle;
# (2) a most-paint-mass heuristic picked a variant whose surviving paint
# reads as a scribble, and the whole arrow_thru_h class is too small to
# survive its own wear. CHOSEN BY EYE off the class contact sheets:
# arrow_thru_v[2], a solid shaft + head that still reads as an arrow.
ARROW_IDX = 2
ARROW_RAW = dec_rgb(mb['classes']['arrow_thru_v'][ARROW_IDX])
_aL = lum(ARROW_RAW)
_am = (_aL > np.median(_aL) + 18).astype(np.float64)
_grown = np.asarray(Image.fromarray((_am * 255).astype(np.uint8))
                    .filter(ImageFilter.MaxFilter(3)), dtype=np.float64) / 255.0
_soft = np.clip((_aL - (np.median(_aL) + 8.0)) / 60.0, 0, 1)
ARROW_MASK = np.clip(_soft * _grown * 1.5, 0, 1)
ARROW_ON_LOT = composite(LOTS[1], ARROW_MASK)        # composited, never repainted

# ------------------------------------------------------------- metrics
def rgb_to_sat(a):
    mx = a.max(axis=2); mn = a.min(axis=2)
    return np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-9), 0)

def hue_deg(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(axis=2); mn = a.min(axis=2); d = np.maximum(mx - mn, 1e-9)
    h = np.zeros_like(mx)
    m = mx == r; h[m] = (60 * ((g - b) / d) % 360)[m]
    m = mx == g; h[m] = (60 * ((b - r) / d) + 120)[m]
    m = mx == b; h[m] = (60 * ((r - g) / d) + 240)[m]
    return h % 360

def metrics(a, rgba=False):
    if rgba:
        vis = a[a[..., 3] > 0][:, :3]
        if len(vis) == 0: return {}
        sat = rgb_to_sat(vis.reshape(-1, 1, 3)).mean()
        return {'lum_mean': round(float(lum(vis.reshape(-1, 1, 3)).mean()), 1),
                'sat': round(float(sat), 3), 'purple_pct': 0.0, 'green_pct': 0.0,
                'colours': int(len(np.unique(vis.astype(np.uint8), axis=0)))}
    L = lum(a)
    dif = np.abs(np.diff(L, axis=1))
    sat = rgb_to_sat(a); h = hue_deg(a); v = a.max(axis=2)
    purple = float(((h > 265) & (h < 330) & (sat > 0.25) & (v > 40)).mean() * 100)
    green = float(((h > 70) & (h < 170) & (sat > 0.18) & (v > 50)).mean() * 100)
    wrapH = float(np.abs(L[:, 0] - L[:, -1]).mean())
    wrapV = float(np.abs(L[0, :] - L[-1, :]).mean())
    return {'colours': int(len(np.unique(a.reshape(-1, 3).astype(np.uint8), axis=0))),
            'edge': round(float(dif.mean()), 2),
            'grain': round(float((dif > 8).mean() * 100), 1),
            'sat': round(float(sat.mean()), 3),
            'lum_mean': round(float(L.mean()), 1),
            'lum_sd': round(float(L.std()), 1),
            'purple_pct': round(purple, 2), 'green_pct': round(green, 2),
            'wrapH': round(wrapH, 1), 'wrapV': round(wrapV, 1)}

TOL = json.load(open(os.path.join(ROOT, 'records', 'BOHEMIA_STYLE_TARGET_8_1_26.json')))['TOLERANCE']
def in_tol(m):
    return (m['colours'] >= TOL['colours_min'] and
            TOL['edge'][0] <= m['edge'] <= TOL['edge'][1] and
            TOL['grain'][0] <= m['grain'] <= TOL['grain'][1] and
            TOL['sat'][0] <= m['sat'] <= TOL['sat'][1] and
            TOL['lum_mean'][0] <= m['lum_mean'] <= TOL['lum_mean'][1])

for t in tiles:
    rgba = t['px'] != 44 and t['px'] != '44'
    m = metrics(t['arr'], rgba=rgba)
    t['metrics'] = m
    if not rgba:
        t['metrics']['in_tolerance'] = in_tol(m)

# paint value vs the anchor (the form's acceptance line)
allpaint = []
for nm in ('stall_v_0', 'stall_v_1', 'stall_h_0', 'stall_h_1'):
    a = IMGS[nm]; L = lum(a)
    zone = L[:, LINE] if 'v' in nm else L[LINE, :]
    allpaint.append(zone[zone > np.median(L) + 20])
paint_lum = float(np.concatenate(allpaint).mean())

# ---------------------------------------------------------------- proofs
def sheet(cells, cols, z=3, pad=4, bg=(28, 28, 32), labels=None):
    rows = (len(cells) + cols - 1) // cols
    cw = C * z + pad
    img = Image.new('RGB', (cols * cw + pad, rows * (cw + (12 if labels else 0)) + pad), bg)
    from PIL import ImageDraw
    dr = ImageDraw.Draw(img)
    for i, a in enumerate(cells):
        r, c = divmod(i, cols)
        if a.shape[2] == 4:
            im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')
            im = im.resize((im.width * z, im.height * z), Image.NEAREST)
            cell = Image.new('RGB', (C * z, C * z), (45, 45, 50))
            cell.paste(im, ((C * z - im.width) // 2, (C * z - im.height) // 2), im)
        else:
            cell = to_img(a).resize((C * z, C * z), Image.NEAREST)
        y = pad + r * (cw + (12 if labels else 0))
        img.paste(cell, (pad + c * cw, y))
        if labels:
            dr.text((pad + c * cw, y + C * z + 1), labels[i], fill=(200, 200, 200))
    return img

# (a) 3x3 tiled proofs, variants mixed so no 44px stamp repeats
def tiled9(names, fn):
    picks = [IMGS[names[i % len(names)]] for i in range(9)]
    g = np.vstack([np.hstack(picks[r * 3:(r + 1) * 3]) for r in range(3)])
    to_img(g).resize((g.shape[1] * 2, g.shape[0] * 2), Image.NEAREST).save(os.path.join(PROOF, fn))

tiled9(['stall_v_%d' % i for i in range(6)], 'TILED_3x3_stall_v.png')
tiled9(['stall_h_%d' % i for i in range(6)], 'TILED_3x3_stall_h.png')
tiled9(['stall_double_v_%d' % i for i in range(3)], 'TILED_3x3_double_v.png')
tiled9(['ada_hatch_%d' % i for i in range(3)], 'TILED_3x3_ada_hatch.png')

# (b) anchor composite: road_crossing + raw bank arrow + my tiles, 3x NN
anch = [ROAD_CROSSING, ROAD_0, ARROW_RAW, ARROW_ON_LOT, LOTS[0],
        IMGS['stall_v_0'], IMGS['stall_v_endS_0'], IMGS['stall_double_v_0'],
        IMGS['stall_corner_SE_0'], IMGS['ada_symbol_0'], IMGS['ada_hatch_0'],
        IMGS['stall_tee_S_0']]
lab = ['road_crossing*', 'road_0*', 'bank arrow*', 'arrow on lot', 'lot_asphalt*',
       'stall_v', 'end cap', 'double', 'corner', 'ADA', 'hatch', 'tee']
sheet(anch, 6, z=3, labels=lab).save(os.path.join(PROOF, 'ANCHOR_COMPOSITE_beside_road_crossing.png'))

# (c) contact sheet, everything
sheet([t['arr'] for t in tiles], 8, z=2,
      labels=[t['name'] for t in tiles]).save(os.path.join(PROOF, 'CONTACT_SHEET_all_variants.png'))

# (d) the assembled stall row, bank geometry law verbatim:
# dividers every 3rd tile, interior 2 (car 2 wide), row depth 4, aisle 4.
# The open field obeys desert_dominance_law: ONE dominant tile (~85%),
# accents in coherent clusters, the weed tile exactly twice in frame --
# never a per-cell shuffle (banned in the bank's own ruling).
COLS, ROWS = 12, 9
RF = np.random.RandomState(41)
_n = RF.rand(3, 4)
_noise = np.asarray(Image.fromarray((_n * 255).astype(np.uint8)).resize(
    (COLS, ROWS), Image.BILINEAR), dtype=np.float64) / 255.0
ACCENT = _noise > np.quantile(_noise, 0.85)
WEED_CELLS = {(5, 2), (7, 9)}
def field(r, c):
    # plain field cells quarter-turn per cell (the documented street-pixels
    # trick that kills the 44px wallpaper; the lot tile is non-directional
    # ground, so rotation is legal -- kerbs/gutters would not be)
    if (r, c) in WEED_CELLS: return LOTS[0]
    t = LOTS[2] if ACCENT[r, c] else LOTS[1]
    return np.rot90(t, k=(r * 7 + c * 3) % 4).copy()
grid = np.zeros((ROWS * C, COLS * C, 3))
def put(r, c, a): grid[r * C:(r + 1) * C, c * C:(c + 1) * C] = a[..., :3] if a.shape[2] == 4 else a
div_cols = [0, 3, 6, 9]
for c in range(COLS):
    # row 0: head line with tees at dividers, corners at the frame ends
    if c == 0:   put(0, c, IMGS['stall_corner_SE_0'])
    elif c in div_cols: put(0, c, IMGS['stall_tee_S_%d' % (c % 2)])
    elif c == COLS - 1: put(0, c, IMGS['stall_h_endE_0'])
    else: put(0, c, IMGS['stall_h_%d' % (c % 6)])
    for r in (1, 2):
        put(r, c, IMGS['stall_v_%d' % ((r * 5 + c) % 6)] if c in div_cols else field(r, c))
    put(3, c, IMGS['stall_v_endS_%d' % (c // 3 % 3)] if c in div_cols else field(3, c))
    for r in (4, 5, 6, 7, 8):
        put(r, c, field(r, c))
# ADA stall: interior cols 7-8 -> symbol at (2,7), hatch access aisle cols 10-11
put(2, 7, IMGS['ada_symbol_0'])
put(1, 10, IMGS['ada_hatch_0']); put(2, 10, IMGS['ada_hatch_1']); put(3, 10, IMGS['ada_hatch_2'])
put(1, 11, IMGS['ada_hatch_1']); put(2, 11, IMGS['ada_hatch_2']); put(3, 11, IMGS['ada_hatch_0'])
# aisle arrow from the MARKING BANK, composited on the lot field (row 6, col 4)
put(6, 4, ARROW_ON_LOT)
# wheel stops: near the stall head, one per stall, straddling the interior pair
for stall_c in (1, 4, 7):
    ws = IMGS['wheel_stop_%d' % (stall_c % 3)]
    y = 1 * C + 8 + (stall_c % 2) * 2
    x = stall_c * C + C - 15
    h, w = ws.shape[:2]
    a = ws[..., 3:4] / 255.0
    grid[y:y + h, x:x + w] = grid[y:y + h, x:x + w] * (1 - a) + ws[..., :3] * a
row_img = to_img(grid).resize((grid.shape[1] * 2, grid.shape[0] * 2), Image.NEAREST)
row_img.save(os.path.join(PROOF, 'ASSEMBLED_STALL_ROW_with_bank_arrow.png'))

# (e) rain readability, palette state only (spec: RAIN is a palette state)
wet = grid * np.array([0.52, 0.54, 0.60])
L = lum(grid); paintish = (L > 95)[..., None]
wet = np.where(paintish, grid * np.array([0.82, 0.83, 0.86]), wet)
to_img(wet).resize((grid.shape[1] * 2, grid.shape[0] * 2), Image.NEAREST).save(
    os.path.join(PROOF, 'RAIN_STATE_same_row_palette_only.png'))

# ------------------------------------------------------------- the bank
out = {
    'form': 'TF-ART-003',
    'cooked': '2026-08-08',
    'mode': 'MIXED',
    'note': ('DELTA ONLY vs TF-WORLD-001: the lot-asphalt FIELD belongs to WORLD-001 '
             '(here: approved-band texture-match lot_asphalt_0..2, repainted NOWHERE). '
             'Single stall lines are HARVESTED from the approved harmonized street pool '
             '(paint geometry + 30yr wear), recoloured to the road_crossing anchor ramp '
             '(full lum 161 / worn lum 100) so the paint is the same paint Paolo approved '
             'on the crossing. Aisle arrows NOT cooked: marking-bank arrow_thru_v '
             'composited per the DO-NOT-COOK strike. New geometry only where no bank '
             'holds it: end caps, corners/tees/cross (WANG-16 row ends), double pair, '
             'ADA (slate blue, hue ~215), wheel stop prop.'),
    'rulings_carried': {
        'markings_30yr_law': sp['markings_30yr_law'],
        'parking_geometry_law': sp['parking_geometry_law'],
        'weather_rarity_law': sp['weather_rarity_law'],
    },
    'paint_lum_measured': round(paint_lum, 1),
    'paint_anchor': 'road_crossing full 161 / worn 100',
    'harvest_sources': [
        'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt pools.stall_line_v[0..5], stall_line_h[0..5]',
        'banks/BOHEMIA_MARKING_BANK_7_17_26.txt classes.arrow_thru_v[0] (composited, proof only)',
        'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt lot_asphalt_0..2 (the WORLD-001 field)',
        'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt road_crossing (paint ramp)',
    ],
    'tiles': [],
    'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
}
for t in tiles:
    a = t['arr']
    if a.shape[2] == 4:
        img = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')
    else:
        img = to_img(a)
    out['tiles'].append({'name': t['name'], 'px': t['px'], 'b64': enc(img),
                         'metrics': t['metrics'], 'kind': t['kind'],
                         'harvested_from': t['harvested_from']})
json.dump(out, open(OUT_BANK, 'w'), indent=1)

# ------------------------------------------------------------- report
n_tol = sum(1 for t in tiles if t['metrics'].get('in_tolerance'))
n44 = sum(1 for t in tiles if t['px'] in (44, '44'))
print('cooked %d tiles (%d ground @44px, %d props)' % (len(tiles), n44, len(tiles) - n44))
print('style tolerance: %d/%d ground tiles inside' % (n_tol, n44))
print('paint lum measured %.1f (anchor: 100 worn / 161 full)' % paint_lum)
worstP = max(t['metrics'].get('purple_pct', 0) for t in tiles)
worstG = max(t['metrics'].get('green_pct', 0) for t in tiles)
print('worst purple %.2f%%  worst green %.2f%%' % (worstP, worstG))
ws = [(t['name'], t['metrics'].get('wrapH'), t['metrics'].get('wrapV'))
      for t in tiles if 'wrapH' in t['metrics']]
wa = np.array([[w[1], w[2]] for w in ws])
print('wrap error mean H %.1f V %.1f (field inner-edge step is 15-18)' % (wa[:, 0].mean(), wa[:, 1].mean()))
for t in tiles:
    print(' ', t['name'], t['metrics'])
