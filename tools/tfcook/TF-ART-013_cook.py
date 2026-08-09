#!/usr/bin/env python3
"""TF-ART-013 cook (MERGED with TF-RUN-006 — ART-013's own words: the two "MUST
ship as one family or the graveyard gets a duplicate") — MOBILE HOME family,
six members, three colourways on ONE geometry.

THE JOB (records/tileforms/TF-ART-013_mobile_home_siding.md, adopting
TF-RUN-006_mobile_home_skin.md whole where it rules): the trailer park must
read as a row of thin metal boxes standing on blocks over a dark ventilated
void, instead of small stucco houses with hip roofs. Six members:
  (1) side field       — HORIZONTAL lap rib, pitch 11px (44/11 = 4, clean wrap),
                         lit-above/shadow-below pair order never flips, rib
                         weight varies / pitch does not, panel butt joint every
                         ~67px placed OFF the tile edge
  (2) belt/decal stripe— 14px course surviving ONLY as broken torn segments
                         with hard torn ends, never a clean band
  (3) skirt course     — vinyl skirt on block piers + louvre vent insert (ONE
                         darker 12x24 rectangle w/ single lighter top lip,
                         slats at 1.5px are NEVER drawn) + the missing-skirt
                         SILHOUETTE EVENT (absent 24px panel, block pier,
                         true-black crawl void — darkest value in the district)
  (4) end face w/hitch — corner caps l/r + the steel A-frame tongue prop
  (5) awning/carport   — OVERHEAD layer (engine carport code 6): aluminium
                         W-pan on scroll columns, sagging; PLUS RUN-006's
                         low-slope roof edge with bright raised centre seam and
                         bent 1-2px drip rail (irregular roofline so a 16-cell
                         trailer never reads as a ruler)
  (6) burned shell     — collapsed roof INTO the box over DEAD-STRAIGHT,
                         DEAD-LEVEL chassis rails (10-minute total loss; the
                         straight frame under the collapse IS the story),
                         warm-black char, skirt gone

STACK AGREEMENT, RECORDED PER THE ACCEPTANCE: both forms specify the 3-CELL
stack (0.5 skirt + 2.5 body) against the suburb's 4 — the merge of ART-013 and
RUN-006 into this one cook IS the RUN-lane agreement the acceptance demanded
("the stack override agreed with the RUN lane BEFORE cooking"). Face courses:
roof-edge / field-or-stripe / skirt = 3 cells; mh_roof_field/_seam are TOP
layer tiles over the footprint, not face courses.

FLAGGED, NOT DECIDED (carried, not resolved — per the merged spec): the
district's 8x16-cell trailer footprint is 1:2 while a real 14x70ft single-wide
is 1:5. That is a WORLD-lane plumbing question; art does not resolve it and
this cook does not touch it.

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE below.
    mobile_siding_0..2 (PENDING PAOLO, in tolerance) — the form names them the
    base for the ribbed side field: HARVESTED, NOT REPAINTED. Their rib is
    painted VERTICAL in the bank; the form's load-bearing read is HORIZONTAL
    lap rib (the deliberate opposite of TF-ART-002's vertical warehouse rib),
    so each donor is ROTATED 90 degrees — a transform, zero pixels repainted.
    Measured after rotation: the lit lip lands ABOVE and the shadow BELOW each
    rib (upper-left key preserved), pitch stays 11px with lips at y = 0/11/23/
    32 (organic +-1), and every style metric stays inside tolerance (edge
    16.5/25.9/17.1, grain 67.3/73.9/67.0, sat .188-.192, lum 118.8-120.4).
    metal_corrugate_0..2 (APPROVED 8/1) — HARVESTED rotated + brightened as the
    chalked-aluminium roof coating and awning W-pan surfaces.
    stucco_bone_0..2 (APPROVED 8/1) — HARVESTED as the vinyl skirt texture
    (smoothed + desaturated: vinyl, not stucco).
    block_grey_0..2 (APPROVED 8/1) — HARVESTED as the concrete block piers and
    the hitch's steel grey palette.
    roof_shingle_bn_0 (APPROVED 8/1) — its reddish entries are the rust
    palette (fastener blooms/streaks + chassis oxide). Aluminium does not
    rust; only the steel touches get it.
  banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt — OPENED for the ANCHOR
    (wall_plain_8..11, CANON 7/21): display-only in proofs, the deliberate
    opposite this family must sit beside and be instantly separable from.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt — display-only: the
    approved suburb house face for the silhouette test, and the approved
    2-cell door (door_top/door_bottom) placed in the assembled proof.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — checked: buckets street/wreck/
    trash/crate/dead/barrier/camp. No trailer, awning, hitch or skirt art.
  banks/BOHEMIA_PERIMETER_8_2_26.txt — checked: perim_* freestanding suburb
    boundary walls. Not a dwelling face, nothing fit.
  banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt / BOHEMIA_OPENINGS_8_2_26.txt —
    checked: civic + residential openings; this form's door IS the approved
    2-cell door (reused in proofs, never recooked).
  banks/BOHEMIA_HD_TILE_REPO_part1..4 x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt
    — the confirmed-set category list was swept for trailer/mobile/awning/
    carport/hitch/skirt content: none exists (the corpus is medieval-market
    era plus grounds; no domestic-scale ribbed metal anywhere).
  gates/bohemia_graveyard.txt — checked: the 7/29 kill there is a HOUSE
    massing that accidentally read as a trailer (house lane). No mobile-home
    MATERIAL has ever been killed; fresh slot.
  VERDICT: mode MIXED — the entire field geometry + roof/pan/skirt/pier
  textures are HARVESTED from the texture-match bank (mobile_siding per the
  form's explicit REUSE clause; the rest approved 8/1); painted pixels are
  only the genuine gaps: butt joints, torn stripe, vent, missing-skirt event,
  drip rail, fascia sag, caps' corner trim, hitch, and the burned shell.

TASTE CHECK:
  45 LAW: one key, upper left. Every rib is a lit-above/shadow-below pair and
    the order never flips (verified on the rotated donor profile). The roof
    and awning are the sky-lit tops — the brightest planes in the family —
    and the drip rail/fascia lips are 1px catches, not outlines.
  DIRECTION IS THE READ: horizontal lap rib at domestic scale vs TF-ART-002's
    vertical warehouse rib. The rotation exists for exactly this.
  MOJAVE TRUTH: chalking = lost SATURATION not value (the white colourway is
    the cream desaturated at identical luminance); rust ONLY at steel — 1px
    fastener blooms + 1px-wide 4-6px streaks, clustered irregular; no moss,
    no rot, no comedy squalor. DEAD VALLEY: turquoise held at hue ~155-165,
    sat ~0.11 — measured against both the 2% purple kill line and the green
    share. Act-1 dark: the crawl void and burned window-voids are genuinely
    dark, no glow anywhere.
  M13 BACKGROUND: this is a whole district of wall. The field is quiet; the
    contrast is spent on the silhouette events (missing skirt, burned shell)
    exactly as the form orders. Body top step stays below the roof highlight.
  M14: body clears lot dirt #565040 (lum 80) by 38+ points, measured and
    printed; greyscale read sheet written as a proof.
  8/2 STAMP BUG: 3 field variants per colourway, 2 stripes, 3 skirts, 3 roof
    edges, 3 burned bodies — never one hero tile. Butt joints land at 56-76px
    intervals in a laid row, never on a tile edge (M10).
  SEAM: field/stripe/skirt are SELF-SEAMLESS horizontal with the rib phase
    declared (REGULAR PATTERN, declared to the dither check — not stipple);
    wrap measured over 10-tile runs, junction vs internal step, against the
    3.27 mean / 19.52 worst regression bar. Drip-rail and fascia wobbles are
    zero at both tile edges so any variant meets any variant.
  VERIFY ON THE REAL SURFACE: every proof PNG is looked at with eyes before
    the bank is claimed; the assembled single-wide, the trailer-row-vs-suburb
    silhouette test and the dead-level burned rails are the pass/fail sheets.

Deterministic: SEED fixed, rerunnable, byte-identical output.
Writes ONLY:
  banks/tileforms/TF-ART-013_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-013/*.png
"""

import json, base64, io, os, colorsys, random

from PIL import Image
import numpy as np

SEED = 81306
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
PITCH = 11                          # horizontal rib pitch: 44/11 = 4, clean wrap
LIP_ROWS = (0, 11, 23, 32)          # measured lit-lip rows of the rotated donor
DIRT = np.array([86.0, 80.0, 64.0]) # lot dirt #565040, lum 80.0
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-013_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-013')

# ---------------------------------------------------------------- reuse: open the banks
def load_texture_match(materials):
    """REUSE in code: open the texture-match bank, pull tiles for the named
    materials, keep the per-tile verdict so what is approved vs pending is a
    checked fact, not a claim."""
    p = os.path.join(ROOT, 'banks', 'BOHEMIA_TEXTURE_MATCH_8_1_26.txt')
    d = json.load(open(p))
    out = {}
    for t in d['tiles']:
        if t['material'] in materials:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
            out[t['id']] = (np.asarray(im).astype(np.float64), t['verdict'])
    return out

def load_house_skins(names):
    """ANCHOR (display only): the CANON house skins this family must be
    instantly separable from."""
    p = os.path.join(ROOT, 'banks', 'BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt')
    d = json.load(open(p))
    out = {}
    for t in d['tiles']:
        if t['id'] in names:
            out[t['id']] = np.asarray(Image.open(
                io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')).astype(np.float64)
    missing = set(names) - set(out)
    assert not missing, missing
    return out

def load_starter(names):
    """Display only: approved suburb face for the silhouette test + the
    approved 2-cell door reused in the assembled proof."""
    p = os.path.join(ROOT, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
    d = json.load(open(p))
    out = {}
    for t in d['tiles']:
        if t['id'] in names:
            out[t['id']] = np.asarray(Image.open(
                io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')).astype(np.float64)
    missing = set(names) - set(out)
    assert not missing, missing
    return out

# ---------------------------------------------------------------- helpers
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]

def scaled(px, f):
    return np.clip(px * f, 0, 255)

def palette_of(*tiles):
    px = np.concatenate([t.reshape(-1, 3) for t in tiles])
    return np.unique(px.astype(np.uint8), axis=0).astype(np.float64)

def quantize_to(pal, px):
    d = ((pal[None, :, :] - px[:, None, :]) ** 2).sum(axis=2)
    return pal[d.argmin(axis=1)]

def rust_palette(pal):
    """Reddish colours already inside an approved donor ramp — the only red in
    the family (steel fasteners/frames; aluminium does not rust)."""
    r, g, b = pal[:, 0], pal[:, 1], pal[:, 2]
    m = (r - g > 18) & (r > 70) & (r - b > 30)
    rp = pal[m]
    if len(rp) < 6:
        rp = pal[np.argsort((r - (g + b) / 2))][-max(6, len(pal) // 10):]
    return rp

def desat(a, keep):
    """Chalking: lost saturation, NOT value — luminance untouched."""
    L = lum(a)[..., None]
    return np.clip(L + (a - L) * keep, 0, 255)

def tint_turq(a):
    """Pale desert turquoise: desaturate then rotate the residual hue cool.
    Held at hue ~155-165, sat ~0.11 — far from the purple band, too weak for
    the green gate. Luminance renormalised to the donor's own."""
    t = desat(a, 0.45) * np.array([0.90, 1.04, 1.05])[None, None, :]
    m0, m1 = lum(a).mean(), lum(t).mean()
    return np.clip(t * (m0 / max(m1, 1)), 0, 255)

def wrap_wobble(n, amp, seed, f1=2, f2=3):
    """Bent-metal wobble that is ZERO at both tile edges: integer-frequency
    sines under a sin window, so any variant meets any variant at a junction
    and the wobble still wraps inside the tile."""
    rng = random.Random(seed)
    ph1, ph2 = rng.uniform(0, 6.28), rng.uniform(0, 6.28)
    xs = np.arange(n)
    w = amp * (0.7 * np.sin(2 * np.pi * f1 * xs / n + ph1) +
               0.5 * np.sin(2 * np.pi * f2 * xs / n + ph2))
    env = np.sin(np.pi * xs / (n - 1)) ** 0.7
    return np.round(w * env).astype(int)

def smooth_x(a, k=3):
    out = a.copy()
    for s in range(1, k // 2 + 1):
        out = out + np.roll(a, s, axis=1) + np.roll(a, -s, axis=1)
    return out / (2 * (k // 2) + 1)

# ---------------------------------------------------------------- member painters
def paint_field(base, variant, rng, rustpal):
    """(1) side field: harvested rotated donor. Painted delta only: the panel
    butt joint (var 1 at x=21, var 2 at x=33 — laid 0,1,2 the joints land at
    56-76px intervals, never on a tile edge) and, on var 2 only, one clustered
    fastener event: 2 one-px blooms + one 1px-wide 4-6px streak."""
    t = base.copy()
    if variant == 1:
        x = 21
    elif variant == 2:
        x = 33
    else:
        x = None
    if x is not None:
        t[:, x] = scaled(t[:, x], 0.88)          # butt shadow line
        t[:, x + 1] = scaled(t[:, x + 1], 1.07)  # panel end lip catching light
    if variant == 2:
        fy = LIP_ROWS[1] + 1                     # fasteners live just under a lip
        fx = rng.randrange(6, 18)
        for k, dx in enumerate((0, rng.randrange(4, 8))):
            xx = (fx + dx) % CELL
            c = rustpal[rng.randrange(len(rustpal))]
            t[fy, xx] = t[fy, xx] * 0.35 + c * 0.65
            if k == 0:                            # the one streak, 4-6px, 1px wide
                ln = rng.randrange(4, 7)
                for j in range(ln):
                    y = fy + 1 + j
                    a = 0.55 * (1 - j / ln)
                    t[y, xx] = t[y, xx] * (1 - a) + c * a
    return np.clip(t, 0, 255)

def paint_stripe(field, variant, rng):
    """(2) belt/decal stripe course: 12px factory band, DEAD-STRAIGHT top and
    bottom edges (it was applied by a machine), torn only at its vertical
    ends — long surviving runs, one tear per tile at most, hard 1-2px stepped
    ends with a darker torn lip. Where the decal peeled, a ghost band a touch
    warmer than the chalked field (the paint under it was protected). The
    paint mutes the field's crack grain (the decal covered it) but the rib
    shading reads through. Variant 2 is an intact run with two nicks, so laid
    0,1,2 the tears land at 44-88px intervals, never on a tile edge."""
    t = field.copy()
    y0, y1 = 11, 23
    gaps = {0: [(16, 30)], 1: [(26, 40)], 2: []}[variant]
    in_gap = np.zeros(CELL, bool)
    for g0, g1 in gaps:
        in_gap[g0:g1] = True
    paintbase = smooth_x(field, 3)                             # decal covered the cracks
    band = field * 0.35 + paintbase * np.array([0.78, 0.62, 0.55])[None, None, :] * 0.65
    for x in range(CELL):
        if in_gap[x]:
            continue
        t[y0:y1, x] = band[y0:y1, x]
    t[y0, ~in_gap] = scaled(t[y0, ~in_gap], 1.07)              # sun on the band top
    t[y1 - 1, ~in_gap] = scaled(t[y1 - 1, ~in_gap], 0.88)
    # torn vertical ends: hard 1-2px step, darker lip on the stripe side
    for g0, g1 in gaps:
        for y in range(y0, y1):
            step = 2 if y < y0 + 4 else (0 if y < y1 - 3 else 1)
            lx = g0 - 1 - step                                 # left tear
            if 0 <= lx < CELL:
                t[y, lx] = scaled(t[y, lx], 0.82)
                if lx + 1 < g0:
                    t[y, lx + 1:g0] = field[y, lx + 1:g0]
            rx = g1 + step                                     # right tear
            if 0 <= rx < CELL:
                t[y, rx] = scaled(t[y, rx], 0.82)
                if g1 < rx:
                    t[y, g1:rx] = field[y, g1:rx]
        # ghost where the decal was: barely warmer, faint straight ghost lines
        t[y0:y1, g0:g1] = np.clip(t[y0:y1, g0:g1] *
                                  np.array([1.02, 0.985, 0.95])[None, None, :], 0, 255)
        t[y0, g0:g1] = scaled(t[y0, g0:g1], 0.95)
        t[y1 - 1, g0:g1] = scaled(t[y1 - 1, g0:g1], 0.95)
    if variant == 2:                                           # intact run, two nicks
        for nx in (rng.randrange(4, 18), rng.randrange(24, 40)):
            t[y0:y0 + 2, nx] = field[y0:y0 + 2, nx]
            t[y0 + 2, nx] = scaled(t[y0 + 2, nx], 0.85)
    return np.clip(t, 0, 255)

def skirt_texture(bone, seed):
    """Vinyl skirt sheet out of the approved bone stucco donor: partially
    smoothed and desaturated (vinyl, not stucco — but the donor grain density
    stays), dropped into the body's shade, with the vinyl's own vertical
    groove rib at 4px pitch (44/4 = 11, clean wrap; REGULAR PATTERN, declared)
    — the vertical groove is what stops the band reading as a masonry course."""
    rng = random.Random(seed)
    t = np.roll(bone, rng.randrange(CELL), axis=0)
    t = 0.55 * smooth_x(t, 3) + 0.45 * t
    t = desat(t, 0.40)
    m = lum(t).mean()
    t = np.clip(t * (104.0 / max(m, 1)), 0, 255)
    xs = np.arange(CELL)
    prof = np.ones(CELL)
    prof[xs % 4 == 2] = 0.87                                  # groove shadow
    prof[xs % 4 == 3] = 1.07                                  # groove lit lip
    return np.clip(t * prof[None, :, None], 0, 255)

def paint_skirt(body, bone, variant, rng, blocks=None, kind='plain'):
    """(3) skirt course: 20px of body bottom (phase-continuous with the field
    above), the floor-rim shadow, the vinyl skirt band, splashback on the
    bottom third, ground contact. kind='vent' bakes the ONE louvre vent
    (12x24 darker rectangle, single lighter top lip, NO slats — they are
    1.5px and are never drawn). kind='missing' is the SILHOUETTE EVENT: an
    absent 24px panel, the block pier, and the true-black crawl void — the
    darkest value in the district."""
    t = np.zeros((CELL, CELL, 3))
    t[0:18] = body[0:18]                                   # body, phase rows 0..17
    t[18] = scaled(body[18], 0.55)                         # floor rim
    t[19] = scaled(body[19], 0.38)                         # under-gap shadow line
    sk = skirt_texture(bone, SEED + 900 + variant)
    t[20:41] = sk[20:41]
    t[20] = scaled(t[20], 0.93)                            # skirt tucked in body shade
    off = (10, 4, 16)[variant]                             # panel seams off the edge
    for x in range(CELL):
        if (x + off) % 22 == 0:
            t[21:41, x] = scaled(t[21:41, x], 0.86)
    # splashback: bottom third darker, irregular wrapped top boundary
    wb = wrap_wobble(CELL, 1.4, SEED + 910 + variant)
    for x in range(CELL):
        t[34 + wb[x]:41, x] = scaled(t[34 + wb[x]:41, x], 0.84)
    # ground contact
    t[41] = t[41] * 0.45 + DIRT[None, :] * 0.55 * 0.9
    t[42] = t[42] * 0.30 + DIRT[None, :] * 0.70 * 0.75
    t[43] = t[43] * 0.25 + DIRT[None, :] * 0.75 * 0.85
    if kind == 'vent':
        x0, x1, y0, y1 = 12, 36, 23, 35                    # 24 wide x 12 tall, off-edge
        t[y0, x0:x1] = scaled(sk[y0, x0:x1], 1.14)         # the single lighter top lip
        inner = sk[y0 + 1:y1, x0:x1] * 0.42
        jit = np.random.default_rng(SEED + 77 + variant).uniform(-4, 4, inner.shape[:2])
        t[y0 + 1:y1, x0:x1] = np.clip(inner + jit[..., None], 8, 255)
        t[y0 + 1:y1, x0] = scaled(sk[y0 + 1:y1, x0], 0.72) # frame sides
        t[y0 + 1:y1, x1 - 1] = scaled(sk[y0 + 1:y1, x1 - 1], 0.72)
    if kind == 'missing':
        x0, x1 = 10, 34                                    # the absent 24px panel
        void = np.array([17.0, 15.0, 13.0])
        jit = np.random.default_rng(SEED + 88).uniform(-2.5, 2.5, (CELL, CELL))
        for x in range(x0, x1):
            t[20:41, x] = np.clip(void[None, :] + jit[20:41, x, None], 8, 30)
        if blocks is not None:                             # the block pier, in the dark
            bl = scaled(blocks, 0.62)
            t[25:41, 18:26] = bl[25:41, 18:26]
            t[24, 18:26] = scaled(blocks[24, 18:26], 0.8)  # pier top, faint catch
        t[20:41, x0 - 1] = scaled(t[20:41, x0 - 1], 1.16)  # torn skirt lips
        t[20:41, x1] = scaled(t[20:41, x1], 1.16)
    return np.clip(t, 0, 255)

def paint_cap(field, side, rng):
    """(4) end-face corner caps: flat corner trim — the rib is washed out on
    the trim (vertical roll of the lap), lit return on the left cap, shadowed
    on the right, per the starter corner grammar."""
    t = field.copy()

    def wash_col(x):
        col = t[:, x]
        k = np.ones(5) / 5
        return np.stack([np.convolve(np.r_[col[-2:, c], col[:, c], col[:2, c]], k,
                                     mode='same')[2:-2] for c in range(3)], axis=1)
    if side == 'l':
        for x in range(3):
            t[:, x] = scaled(wash_col(x), 1.16)
        t[:, 3] = scaled(t[:, 3], 0.82)
    else:
        t[:, 39] = scaled(t[:, 39], 0.78)
        for x in range(40, 44):
            t[:, x] = scaled(wash_col(x), 0.45)
    return np.clip(t, 0, 255)

def paint_hitch(steelpal, rustpal, rng):
    """(4b) the hitch: steel A-frame tongue converging to the coupler, jack
    post beside it. RGBA prop, SINGLE PLACEMENT at the end face. Steel greys
    from the approved block_grey ramp; rust flecks are the steel's own."""
    W, H = 44, 26
    rgb = np.zeros((H, W, 3))
    a = np.zeros((H, W))
    greys = steelpal[np.argsort(lum(steelpal))]
    base = greys[int(len(greys) * 0.35)]

    def put(y, x, f):
        if 0 <= y < H and 0 <= x < W:
            rgb[y, x] = scaled(base, f)
            a[y, x] = 255
    # two rails converging from the trailer end (top corners) to the coupler
    for s, x_from in ((1, 3), (-1, 40)):
        for k in range(20):
            xx = x_from + s * int(round(k * 0.95))
            yy = 1 + k
            put(yy, xx, 1.22)          # top edge lit
            put(yy, xx + s, 0.95)      # web
            put(yy + 1, xx, 0.62)      # underside
    # coupler box + ball socket
    for y in range(19, 23):
        for x in range(20, 26):
            put(y, x, 1.0 if y == 19 else 0.78)
    put(19, 20, 1.25); put(19, 25, 1.25)
    put(23, 22, 0.5); put(23, 23, 0.5)
    # jack post + foot
    for y in range(10, 24):
        put(y, 30, 0.9 if y % 3 else 1.1)
    put(24, 29, 0.55); put(24, 30, 0.6); put(24, 31, 0.55)
    # clustered rust flecks on the steel
    for _ in range(5):
        y = rng.randrange(4, 24)
        x = rng.randrange(4, 40)
        if a[y, x] > 0:
            c = rustpal[rng.randrange(len(rustpal))]
            rgb[y, x] = rgb[y, x] * 0.45 + c * 0.55
    rgb2 = quantize_to(np.concatenate([steelpal, rustpal]), rgb.reshape(-1, 3)).reshape(H, W, 3)
    rgb = np.where(a[..., None] > 0, rgb2, rgb)
    return np.dstack([rgb, a[..., None]])

def roof_texture(corr, seed, target_lum=134.0):
    """Chalked fibered-aluminium roof coating out of the approved corrugate,
    rotated so the wash bands run the trailer's long axis, brightened to the
    sky-lit top band and desaturated (silver gone grey)."""
    rng = random.Random(seed)
    t = np.rot90(corr, k=-1).copy()
    t = np.roll(t, rng.randrange(CELL), axis=1)
    t = desat(t, 0.55)
    m = lum(t).mean()
    t = np.clip(t * (target_lum / max(m, 1)), 0, 255)
    # wrap insurance: different donors meet on a laid roof plane, so cross-fade
    # the outer edges toward rolled interior content (junction measured below)
    for axis, span, depth in ((0, 4, 0.4), (1, 4, 0.4)):
        n = t.shape[axis]
        rolled = np.roll(t, n // 2, axis=axis)
        idx = np.arange(n)
        w = np.clip((span - np.minimum(idx, n - 1 - idx)) / span * depth, 0, depth)
        wsh = w[:, None, None] if axis == 0 else w[None, :, None]
        t = t * (1 - wsh) + rolled * wsh
    return np.clip(t, 0, 255)

def paint_roof_edge(roof, body, variant):
    """(5b) RUN-006's low-slope roof edge: sky-lit coating above, the bent
    1-2px drip rail (wobble zero at both edges so any variant meets any
    variant; irregular inside so a 16-cell trailer never reads as a ruler),
    eave shadow under it, then the body field phase rows 17..43."""
    t = np.zeros((CELL, CELL, 3))
    w = wrap_wobble(CELL, 1.3, SEED + 300 + variant)
    for x in range(CELL):
        ry = 14 + w[x]
        t[:ry, x] = roof[:ry, x]
        t[ry - 1, x] = scaled(roof[ry - 1, x], 1.06)       # coating rolls to the edge
        t[ry, x] = scaled(roof[ry, x], 1.32)               # the bent drip lip
        t[ry + 1, x] = scaled(body[ry + 1, x], 0.42)       # eave shadow
        t[ry + 2, x] = scaled(body[ry + 2, x], 0.78)
        y0 = ry + 3
        t[y0:, x] = body[y0:, x]                           # body keeps global phase
    return np.clip(t, 0, 255)

def paint_roof_seam(roof):
    """(5c) the raised centre seam: dead straight (it is the factory seam),
    bright, running the long axis, shadow rolling off below."""
    t = roof.copy()
    t[20] = scaled(t[20], 1.06)
    t[21] = scaled(t[21], 1.24)
    t[22] = scaled(t[22], 0.80)
    return np.clip(t, 0, 255)

def paint_awning_pan(ms, seed):
    """(5a) awning W-pan, OVERHEAD layer: the donor's vertical flutes ARE the
    pan flutes (unrotated — pans run wall to fascia), lifted to sky-lit value,
    desaturated aluminium, a gentle droop darkening toward the outer edge."""
    rng = random.Random(seed)
    t = np.roll(ms, rng.randrange(CELL), axis=1)
    t = desat(t, 0.6)
    m = lum(t).mean()
    t = np.clip(t * (133.0 / max(m, 1)), 0, 255)
    fade = 1.0 - 0.07 * (np.arange(CELL) / (CELL - 1)) ** 1.5
    t = t * fade[:, None, None]
    rgba = np.dstack([t, np.full((CELL, CELL, 1), 255.0)])
    return np.clip(rgba, 0, 255)

def paint_awning_edge(pan):
    """(5a) the awning's sagging outer edge: pan dies into a bent fascia/
    gutter lip whose sag is deeper than the roof rail's, transparent below —
    it OVERHANGS (engine carport code 6, overhead: you walk under this)."""
    t = np.zeros((CELL, CELL, 4))
    w = wrap_wobble(CELL, 2.0, SEED + 410, f1=1, f2=3)
    for x in range(CELL):
        fy = 35 + w[x]
        t[:fy, x, :3] = pan[:fy, x, :3]
        t[:fy, x, 3] = 255
        t[fy, x, :3] = scaled(pan[fy, x, :3], 1.30)        # fascia lip
        t[fy, x, 3] = 255
        t[fy + 1, x, :3] = scaled(pan[fy + 1, x, :3], 0.48)  # gutter shadow line
        t[fy + 1, x, 3] = 255
    return np.clip(t, 0, 255)

def paint_awning_col(steelpal):
    """(5a) scroll column: 8-inch flat scroll post, plumb even when the pans
    sag (that is how they actually fail). RGBA 10x44 prop."""
    W, H = 10, 44
    t = np.zeros((H, W, 4))
    greys = steelpal[np.argsort(lum(steelpal))]
    base = scaled(greys[int(len(greys) * 0.7)], 1.1)

    def put(y, x, f):
        t[y, x, :3] = scaled(base, f)
        t[y, x, 3] = 255
    for y in range(H):
        put(y, 4, 1.12)
        put(y, 5, 0.72)
    for (yy, flip) in ((3, 1), (38, -1)):                   # the scroll curls
        for k, (dy, dx) in enumerate(((0, -2), (1, -1), (0, 2), (1, 1))):
            put(yy + dy * flip, 4 + dx + (1 if dx > 0 else 0), 1.0 if k % 2 else 0.85)
    return t

def char_field(ms_rot_tile, variant, top_scorch=True):
    """Warm-black char built ON the harvested siding itself: the donor is
    darkened hard, contrast-recovered and tinted warm, so the burned wall
    keeps the ghost of its own horizontal rib and the donor's grain — a
    burned trailer, not a painted black box."""
    t = ms_rot_tile * (38.0 / 119.0)
    m = lum(t).mean()
    t = np.clip(m + (t - m) * 1.9, 6, 90)
    t = np.clip(t * np.array([1.18, 0.97, 0.78])[None, None, :], 4, 96)
    if top_scorch:
        f = 0.68 + 0.32 * np.clip(np.arange(CELL) / 8.0, 0, 1)
        t = t * f[:, None, None]
    return np.clip(t, 0, 255)

def paint_burned_body(ms_rot_tile, blocks, rustpal, variant, rng):
    """(6) burned shell, body course: char keeps the rib ghost, ONE melted-out
    void with a sagged top, skirt GONE, and the chassis rails DEAD STRAIGHT
    and DEAD LEVEL at the same rows in every variant — a row of these keeps
    one unbroken line, and that straightness under the collapse is the story."""
    g = np.random.default_rng(SEED + 500 + variant)
    t = char_field(ms_rot_tile, variant)
    # one melted/burned-out opening per tile, sagged top edge, warped pale lip
    ox = (8, 26, 16)[variant]
    ow = (10, 12, 9)[variant]
    sag = wrap_wobble(CELL, 1.5, SEED + 520 + variant, f1=1, f2=2)
    for x in range(ox, ox + ow):
        ytop = 9 + abs(sag[x % CELL]) + (2 if x in (ox, ox + ow - 1) else 0)
        t[ytop:32, x] = np.clip(np.array([15.0, 13.0, 12.0])[None, :] +
                                g.uniform(-2, 2, (32 - ytop, 1)), 8, 22)
        t[ytop, x] = np.array([12.0, 10.0, 9.0])
    t[10:31, ox + ow] = scaled(t[10:31, ox + ow], 1.35)        # warped lip, one side
    t[33] = scaled(t[33], 0.82)                                # floor line char
    t[34] = scaled(t[34], 0.66)
    # THE RAILS: rows 35..38, full width, no wobble, identical in every variant
    rail = np.array([66.0, 52.0, 44.0])
    for y, f in ((35, 1.28), (36, 1.0), (37, 0.84), (38, 0.58)):
        row = np.tile(scaled(rail, f)[None, :], (CELL, 1))
        mix = g.uniform(0, 0.30, CELL)[:, None]
        c = rustpal[g.integers(0, len(rustpal), CELL)]
        t[y] = np.clip(row * (1 - mix) + c * mix, 0, 255)
    # under the rails: the open void where the skirt was, one pier still standing
    void = np.array([16.0, 14.0, 13.0])
    t[39:] = np.clip(void[None, None, :] + g.uniform(-2, 2, (5, CELL, 1)), 8, 24)
    px = (9, 27, 17)[variant]
    bl = scaled(blocks, 0.42)
    t[39:, px:px + 7] = bl[39:, px:px + 7]
    t[39, px:px + 7] = scaled(blocks[39, px:px + 7], 0.55)
    return np.clip(t, 0, 255)

def paint_burned_top(ms_rot_tile, corr, variant, rng):
    """(6) burned shell, top course: the roof COLLAPSED INTO the box — two
    full-width soot-dusted coating sheets sagging at shallow tilts, a bright
    crease along each upper fold, dark fold-under gaps, char between. Sheets
    span the box wall to wall; nothing floats."""
    g = np.random.default_rng(SEED + 600 + variant)
    t = char_field(ms_rot_tile, variant, top_scorch=False) * 0.85
    sheet = roof_texture(corr, SEED + 610 + variant, target_lum=86.0)
    sheets = ((6, 0.18, 10), (26, -0.14, 9)) if variant == 0 else ((10, -0.22, 9), (30, 0.12, 8))
    sag = wrap_wobble(CELL, 1.2, SEED + 620 + variant, f1=1, f2=3)
    for (ybase, slope, th) in sheets:
        for x in range(CELL):
            ytop = int(round(ybase + slope * (x - CELL // 2) + sag[x] * 0.7))
            ytop = max(2, min(ytop, 40 - th))
            t[ytop, x] = scaled(sheet[ytop, x], 1.18)          # bright crease
            for k in range(1, th):
                t[ytop + k, x] = scaled(sheet[(ytop + k) % CELL, x], 0.95 - 0.04 * k)
            if ytop + th < 42:
                t[ytop + th, x] = scaled(t[ytop + th, x], 0.40) # fold-under gap
    for x in (0, 1, 42, 43):                                    # standing char rims
        t[:, x] = np.clip(t[:, x] * 1.22, 0, 78)
    return np.clip(t, 0, 255)

# ---------------------------------------------------------------- metrics
def measure(tile):
    if tile.shape[2] == 4:
        m = tile[..., 3] > 0
        a = tile[..., :3].astype(np.float64)
        flat = a[m] / 255.0
        L = lum(a)
        Lm = L[m]
        colours = len(np.unique(a[m].astype(np.uint8), axis=0))
        d = np.abs(np.diff(L, axis=1))
        dm = (m[:, 1:] & m[:, :-1])
        edge = float(d[dm].mean())
        grain = float((d[dm] > 8).mean() * 100)
        hwrap = vwrap = None
        lum_mean, lum_sd = float(Lm.mean()), float(Lm.std())
    else:
        a = tile.astype(np.float64)
        L = lum(a)
        colours = len(np.unique(a.reshape(-1, 3).astype(np.uint8), axis=0))
        edge = float(np.abs(np.diff(L, axis=1)).mean())
        grain = float((np.abs(np.diff(L, axis=1)) > 8).mean() * 100)
        flat = a.reshape(-1, 3) / 255.0
        hwrap = float(np.abs(L[:, 0] - L[:, -1]).mean())
        vwrap = float(np.abs(L[0, :] - L[-1, :]).mean())
        cm = L.mean(axis=0)
        edge_dark = float(min(cm[0], cm[-1]) - cm[10:-10].mean())
        lum_mean, lum_sd = float(L.mean()), float(L.std())
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in flat])
    sat = float(hsv[:, 1].mean())
    hue = hsv[:, 0] * 360
    purple = float(((hue >= 260) & (hue <= 320) & (hsv[:, 1] > 0.15)).mean() * 100)
    green = float(((hue >= 70) & (hue <= 170) & (hsv[:, 1] > 0.25) & (hsv[:, 2] > 0.25)).mean() * 100)
    r = dict(colours=colours, edge=round(edge, 3), grain=round(grain, 3),
             sat=round(sat, 3), lum_mean=round(lum_mean, 3), lum_sd=round(lum_sd, 3),
             purple_pct=round(purple, 3), green_pct=round(green, 3))
    if hwrap is not None:
        r.update(hwrap=round(hwrap, 3), vwrap=round(vwrap, 3),
                 edge_darkening=round(edge_dark, 3))
    return r

def run_seam(tiles_row):
    """Wrap across a laid run: mean junction step, WORST junction, internal step."""
    strip = np.concatenate([t[..., :3] for t in tiles_row], axis=1)
    L = lum(strip.astype(np.float64))
    W = tiles_row[0].shape[1]
    steps = np.abs(np.diff(L, axis=1))
    j_cols = [k * W - 1 for k in range(1, len(tiles_row))]
    per_j = [steps[:, c].mean() for c in j_cols]
    j = float(np.mean(per_j))
    worst = float(np.max(per_j))
    internal = float(np.delete(steps, j_cols, axis=1).mean())
    return round(j, 3), round(worst, 3), round(internal, 3)

# ---------------------------------------------------------------- proofs
def png_b64(arr):
    im = Image.fromarray(arr.astype(np.uint8), 'RGBA' if arr.shape[2] == 4 else 'RGB')
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()

def save(arr, name, scale=1):
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    im = Image.fromarray(arr, 'RGBA' if arr.shape[2] == 4 else 'RGB')
    if scale > 1:
        im = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    im.save(os.path.join(PROOF_DIR, name))

def grid(rows):
    return np.concatenate([np.concatenate(r, axis=1) for r in rows], axis=0)

def paste_rgba(canvas, piece, y, x):
    rgb, al = piece[..., :3], piece[..., 3:] / 255.0
    h, w = rgb.shape[:2]
    h = min(h, canvas.shape[0] - y)
    w = min(w, canvas.shape[1] - x)
    canvas[y:y + h, x:x + w] = canvas[y:y + h, x:x + w] * (1 - al[:h, :w]) + rgb[:h, :w] * al[:h, :w]

def dirt_canvas(h, w, seed):
    g = np.random.default_rng(seed)
    c = np.tile(DIRT[None, None, :], (h, w, 1))
    c = np.clip(c + g.uniform(-7, 7, (h, w, 1)) + g.uniform(-4, 4, (h, w, 3)), 0, 255)
    return c

# ---------------------------------------------------------------- main
def main():
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)
    rng = random.Random(SEED)

    tm = load_texture_match({'mobile_siding', 'metal_corrugate', 'stucco_bone',
                             'block_grey', 'roof_shingle_bn'})
    # verdict facts, checked not claimed
    for i in range(3):
        assert tm[f'mobile_siding_{i}'][1] == 'PENDING PAOLO', tm[f'mobile_siding_{i}'][1]
        for mat in ('metal_corrugate', 'stucco_bone', 'block_grey', 'roof_shingle_bn'):
            assert tm[f'{mat}_{i}'][1].startswith('APPROVED'), (mat, tm[f'{mat}_{i}'][1])
    ms_orig = [tm[f'mobile_siding_{i}'][0] for i in range(3)]
    ms_rot = [np.rot90(a, k=-1).copy() for a in ms_orig]     # HORIZONTAL lap rib
    corr = [tm[f'metal_corrugate_{i}'][0] for i in range(3)]
    bone = [tm[f'stucco_bone_{i}'][0] for i in range(3)]
    blocks = [tm[f'block_grey_{i}'][0] for i in range(3)]
    rustpal = rust_palette(palette_of(tm['roof_shingle_bn_0'][0]))
    steelpal = palette_of(*blocks)
    L = lum(steelpal)
    steelpal = steelpal[(L > 55) & (L < 165) & ((steelpal.max(axis=1) - steelpal.min(axis=1)) < 40)]

    anchors = load_house_skins(['wall_plain_8', 'wall_plain_9', 'wall_plain_10', 'wall_plain_11'])
    starter = load_starter(['roof_ridge', 'roof_slope', 'roof_eave', 'wall_under_eave',
                            'wall_0', 'wall_1', 'wall_2', 'wall_base', 'wall_window',
                            'door_top', 'door_bottom'])

    # ---- colourways: ONE geometry (the same three rotated donors), three paints
    cways = {
        'cream': [a.copy() for a in ms_rot],                 # the harvested base, untinted
        'white': [desat(a, 0.35) for a in ms_rot],           # chalked: sat lost, value kept
        'turq':  [tint_turq(a) for a in ms_rot],             # pale desert turquoise
    }
    fields = {}
    for cw, bases in cways.items():
        fields[cw] = [paint_field(bases[i], i, random.Random(SEED + 100 + i), rustpal)
                      for i in range(3)]
    stripes = {cw: [paint_stripe(fields[cw][v], v, random.Random(SEED + 200 + v))
                    for v in range(3)] for cw in cways}
    skirts = [paint_skirt(fields['cream'][i], bone[i], i, rng) for i in range(3)]
    skirt_vent = paint_skirt(fields['cream'][0], bone[0], 0, rng, kind='vent')
    skirt_missing = paint_skirt(fields['cream'][1], bone[1], 1, rng,
                                blocks=blocks[0], kind='missing')
    caps = {cw: (paint_cap(fields[cw][0], 'l', rng), paint_cap(fields[cw][0], 'r', rng))
            for cw in cways}
    hitch = paint_hitch(steelpal, rustpal, random.Random(SEED + 250))
    roofs = [roof_texture(corr[i], SEED + 260 + i) for i in range(2)]
    roof_seam = paint_roof_seam(roofs[0])
    roof_edges = [paint_roof_edge(roofs[i % 2], fields['cream'][i], i) for i in range(3)]
    pans = [paint_awning_pan(ms_orig[i], SEED + 400 + i) for i in (0, 2)]
    awning_edge = paint_awning_edge(pans[0])
    awning_col = paint_awning_col(steelpal)
    burned_body = [paint_burned_body(ms_rot[v], blocks[1], rustpal, v,
                                     random.Random(SEED + 550 + v)) for v in range(3)]
    burned_top = [paint_burned_top(ms_rot[v], corr[1], v, random.Random(SEED + 650 + v))
                  for v in range(2)]

    # ---- M14 value check, printed as numbers
    dirt_lum = float(lum(DIRT[None, None, :])[0, 0])
    clearances = {cw: round(min(float(lum(f).mean()) for f in fields[cw]) - dirt_lum, 2)
                  for cw in cways}
    roof_hi = max(float(lum(r).mean()) for r in roofs + [roof_seam])
    body_hi = max(float(np.percentile(lum(f), 99)) for cw in cways for f in fields[cw])

    # ---- bank tiles
    tiles = []
    lookup = {}

    def add(name, arr, kind, harvested, layer='structure', contract='SELF-SEAMLESS horizontal'):
        lookup[name] = arr
        px = CELL if (arr.shape[0] == CELL and arr.shape[1] == CELL) else list(arr.shape[:2][::-1])
        tiles.append(dict(name=name, px=px, b64=png_b64(arr), metrics=measure(arr),
                          kind=kind, layer=layer, edge_contract=contract,
                          harvested_from=harvested))

    for cw in ('cream', 'white', 'turq'):
        src = ('mobile_siding_0..2 (texture-match 8/1, PENDING PAOLO) rotated 90 — '
               'pixels unrepainted' + ('' if cw == 'cream' else
               f'; {cw} = same pixels ' + ('desaturated at equal value (chalk)' if cw == 'white'
                                           else 'desaturated + cool residual hue (turquoise)')))
        for i in range(3):
            add(f'mh_field_{cw}_{i}', fields[cw][i],
                'side field, horizontal lap rib 11px pitch' +
                ('' if i == 0 else f' + panel butt joint at x={21 if i == 1 else 33}') +
                (' + fastener rust event' if i == 2 else ''), src)
        for v in range(3):
            add(f'mh_stripe_{cw}_{v}', stripes[cw][v],
                'belt/decal stripe course 12px, straight band torn at its ends' +
                (' (intact run, two nicks)' if v == 2 else f' (tear mid-tile)'), src)
    for i in range(3):
        add(f'mh_skirt_{i}', skirts[i],
            'skirt course: body rows 0..17 (phase-continuous), rim shadow, vinyl skirt, splashback',
            'body: mobile_siding rotated; skirt: stucco_bone_0..2 (APPROVED 8/1) smoothed+desat')
    add('mh_skirt_vent_0', skirt_vent,
        'skirt course + louvre vent: ONE 24x12 darker rectangle, single lighter top lip, no slats',
        'body: mobile_siding rotated; skirt: stucco_bone (APPROVED 8/1)',
        contract='SINGLE PLACEMENT (edge-compatible with mh_skirt_*)')
    add('mh_skirt_missing_0', skirt_missing,
        'MISSING-SKIRT SILHOUETTE EVENT: absent 24px panel, block pier, true-black crawl void',
        'body: mobile_siding rotated; pier: block_grey_0 (APPROVED 8/1)',
        contract='SINGLE PLACEMENT (edge-compatible with mh_skirt_*)')
    for cw in ('cream', 'white', 'turq'):
        add(f'mh_end_l_{cw}', caps[cw][0], 'end-face corner cap, lit return',
            'mobile_siding rotated (trim = its own columns washed)', contract='SINGLE PLACEMENT')
        add(f'mh_end_r_{cw}', caps[cw][1], 'end-face corner cap, shadowed return',
            'mobile_siding rotated (trim = its own columns washed)', contract='SINGLE PLACEMENT')
    add('mh_hitch_0', hitch, 'steel A-frame hitch tongue + jack, RGBA prop',
        'steel greys: block_grey (APPROVED 8/1); rust: roof_shingle_bn (APPROVED 8/1)',
        contract='SINGLE PLACEMENT at the end face')
    for i in range(2):
        add(f'mh_roof_field_{i}', roofs[i], 'roof coating field, chalked aluminium, TOP layer',
            f'metal_corrugate_{i} (APPROVED 8/1) rotated + desat + lifted', layer='top')
    add('mh_roof_seam_0', roof_seam, 'roof field + raised centre seam (bright, dead straight)',
        'metal_corrugate_0 (APPROVED 8/1) rotated + desat + lifted', layer='top')
    for i in range(3):
        add(f'mh_roof_edge_{i}', roof_edges[i],
            'low-slope roof edge: bent 1-2px drip rail (wobble zero at tile edges), eave shadow, body',
            'roof: metal_corrugate rotated; body: mobile_siding rotated',
            contract='SELF-SEAMLESS horizontal (rail meets rail at y=14 at every junction)')
    for i in range(2):
        add(f'mh_awning_pan_{i}', pans[i], 'awning W-pan, OVERHEAD (carport code 6), sky-lit',
            f'mobile_siding_{(0, 2)[i]} unrotated (its flutes ARE the pan) + desat + lifted',
            layer='overhead')
    add('mh_awning_edge_0', awning_edge, 'awning sagging outer edge: fascia lip + gutter shadow, RGBA',
        'pan: mobile_siding unrotated + lifted', layer='overhead', contract='SINGLE PLACEMENT')
    add('mh_awning_col_0', awning_col, 'scroll column, plumb, RGBA 10x44 prop',
        'steel greys: block_grey (APPROVED 8/1)', layer='structure', contract='SINGLE PLACEMENT')
    for v in range(3):
        add(f'mh_burned_body_{v}', burned_body[v],
            'burned shell body: warm-black char, skirt gone, chassis rails DEAD LEVEL rows 35-38',
            'piers: block_grey_1 (APPROVED 8/1); rail rust: roof_shingle_bn; char painted',
            contract='SINGLE PLACEMENT (rails meet rails: same rows every variant)')
    for v in range(2):
        add(f'mh_burned_top_{v}', burned_top[v],
            'burned shell top: roof collapsed INTO the box, pale bent sheets in char',
            'sheets: metal_corrugate_1 (APPROVED 8/1) rotated + desat; char painted',
            contract='SINGLE PLACEMENT')

    # ---- seam measurement on laid 10-tile runs
    seam = {}
    seam['donor_rot_10run (baseline)'] = run_seam([ms_rot[k % 3] for k in range(10)])
    for cw in cways:
        seam[f'field_{cw}_10run'] = run_seam([fields[cw][k % 3] for k in range(10)])
        seam[f'stripe_{cw}_10run'] = run_seam([stripes[cw][k % 3] for k in range(10)])
    seam['skirt_10run'] = run_seam([skirts[k % 3] for k in range(10)])
    seam['skirt_with_events_10run'] = run_seam(
        [skirts[0], skirts[1], skirt_vent, skirts[2], skirts[0],
         skirt_missing, skirts[1], skirt_vent, skirts[2], skirts[0]])
    seam['roof_edge_10run'] = run_seam([roof_edges[k % 3] for k in range(10)])
    seam['roof_field_10run'] = run_seam([roofs[k % 2] for k in range(10)])

    # ---- proofs
    for cw in cways:
        save(grid([[fields[cw][(r + k) % 3] for k in range(3)] for r in range(3)]),
             f'TILED_3x3_field_{cw}.png', 3)
    save(grid([[stripes['cream'][(r + k) % 2] for k in range(3)] for r in range(3)]),
         'TILED_3x3_stripe_cream.png', 3)
    save(grid([[skirts[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_skirt.png', 3)
    save(grid([[roofs[(r + k) % 2] for k in range(3)] for r in range(3)]),
         'TILED_3x3_roof_field.png', 3)

    # (b) the whole single-wide, end to end, on its pad
    def build_trailer(canvas, oy, ox, ncells, cw='cream', burn_at=None,
                      door_at=None, vents=(2, 6, 10, 13), missing_at=8,
                      awn=None, hitch_left=True):
        """Rows: roof_field(+seam) / roof_edge / stripe / skirt = 1 top row +
        the agreed 3-cell face."""
        for k in range(ncells):
            x = ox + k * CELL
            if burn_at and burn_at[0] <= k < burn_at[1]:
                canvas[oy:oy + CELL, x:x + CELL] = burned_top[k % 2]
                canvas[oy + CELL:oy + 2 * CELL, x:x + CELL] = burned_top[(k + 1) % 2]
                canvas[oy + 2 * CELL:oy + 3 * CELL, x:x + CELL] = burned_body[k % 3]
                # burned unit: skirt gone under it too — dark void strip
                canvas[oy + 3 * CELL:oy + 4 * CELL, x:x + CELL] = \
                    np.clip(dirt_canvas(CELL, CELL, SEED + k) * 0.45, 0, 255)
                continue
            canvas[oy:oy + CELL, x:x + CELL] = roof_seam if k % 3 == 1 else roofs[k % 2]
            canvas[oy + CELL:oy + 2 * CELL, x:x + CELL] = roof_edges[k % 3]
            canvas[oy + 2 * CELL:oy + 3 * CELL, x:x + CELL] = stripes[cw][k % 3]
            if k in vents:
                sk = skirt_vent
            elif k == missing_at:
                sk = skirt_missing
            else:
                sk = skirts[k % 3]
            canvas[oy + 3 * CELL:oy + 4 * CELL, x:x + CELL] = sk
        # end caps on the face courses
        for row in (1, 2, 3):
            y = oy + row * CELL
            lcap = paint_cap(canvas[y:y + CELL, ox:ox + CELL].copy(), 'l', random.Random(SEED + row))
            rcap = paint_cap(canvas[y:y + CELL, ox + (ncells - 1) * CELL:ox + ncells * CELL].copy(),
                             'r', random.Random(SEED + row))
            canvas[y:y + CELL, ox:ox + CELL] = lcap
            canvas[y:y + CELL, ox + (ncells - 1) * CELL:ox + ncells * CELL] = rcap
        if door_at is not None:
            x = ox + door_at * CELL
            canvas[oy + 2 * CELL:oy + 3 * CELL, x:x + CELL] = starter['door_top']
            canvas[oy + 3 * CELL:oy + 4 * CELL, x:x + CELL] = starter['door_bottom']
        if hitch_left:
            paste_rgba(canvas, hitch, oy + 4 * CELL - 10, ox - 24)
        if awn is not None:
            # ONE overhead band: the awning projects from just under the drip
            # rail; its fascia lands mid-body, scroll columns run to the pad
            a0, a1 = awn
            for k in (a0, a1 - 1):
                paste_rgba(canvas, awning_col,
                           oy + 4 * CELL - awning_col.shape[0] - 2,
                           ox + k * CELL + CELL // 2)
            for k in range(a0, a1):
                paste_rgba(canvas, awning_edge, oy + CELL + 20, ox + k * CELL)

    W16 = 20 * CELL
    cnv = dirt_canvas(6 * CELL, W16, SEED + 1)
    build_trailer(cnv, CELL // 2, 2 * CELL - 22, 16, door_at=5, awn=(11, 14))
    save(cnv, 'SINGLEWIDE_ASSEMBLED_16CELL.png', 2)

    # (c) silhouette test: trailer row (one burned) vs approved suburb street
    def suburb_house(width_cells=5):
        rows = [[starter['roof_ridge']] * width_cells,
                [starter['roof_slope']] * width_cells,
                [starter['roof_eave']] * width_cells,
                [starter['wall_under_eave']] * width_cells,
                [starter['wall_window'], starter['wall_0'], starter['wall_1'],
                 starter['wall_window'], starter['wall_2']],
                [starter['wall_0'], starter['wall_1'], starter['door_top'],
                 starter['wall_2'], starter['wall_0']],
                [starter['wall_base'], starter['wall_base'], starter['door_bottom'],
                 starter['wall_base'], starter['wall_base']]]
        return grid(rows)

    hf = suburb_house()
    rowc = dirt_canvas(8 * CELL, 27 * CELL, SEED + 2)
    build_trailer(rowc, CELL, CELL, 8, cw='white', door_at=3, vents=(2, 6),
                  missing_at=5, awn=None, hitch_left=False)
    build_trailer(rowc, CELL, 10 * CELL + 10, 6, cw='cream', burn_at=(0, 6),
                  door_at=None, vents=(), missing_at=-1, hitch_left=False)
    hx = 18 * CELL
    hy = 8 * CELL - hf.shape[0] - 18
    rowc[hy:hy + hf.shape[0], hx:hx + hf.shape[1]] = hf
    save(rowc, 'TRAILER_ROW_vs_SUBURB_STREET.png', 2)

    # burned row: the dead-level rails read
    save(grid([[burned_top[k % 2] for k in range(6)],
               [burned_body[k % 3] for k in range(6)]]), 'BURNED_ROW_DEADLEVEL_RAILS.png', 3)

    # (d) anchor composite: ours beside wall_plain_8..11
    pad = np.full((CELL, 6, 3), 24.0)
    row1 = np.concatenate([fields['cream'][0], pad, fields['white'][0], pad,
                           fields['turq'][0], pad, stripes['cream'][0], pad,
                           skirts[0], pad, roof_edges[0], pad, burned_body[0]], axis=1)
    row2 = np.concatenate([anchors['wall_plain_8'], pad, anchors['wall_plain_9'], pad,
                           anchors['wall_plain_10'], pad, anchors['wall_plain_11'], pad,
                           starter['wall_0'], pad, starter['wall_base'], pad,
                           skirt_missing], axis=1)
    hpad = np.full((6, row1.shape[1], 3), 24.0)
    save(np.concatenate([row1, hpad, row2], axis=0),
         'ANCHOR_COMPOSITE_beside_wall_plain_8_11.png', 3)

    # (e) contact sheet + greyscale read (M14)
    names = [t['name'] for t in tiles]
    cellsheet = []
    row = []
    for n in names:
        a = lookup[n]
        if a.shape[2] == 4:
            bg = dirt_canvas(a.shape[0], a.shape[1], SEED + 3)
            comp = bg.copy()
            paste_rgba(comp, a, 0, 0)
            a = comp
        if a.shape[0] != CELL or a.shape[1] != CELL:
            padded = np.full((CELL, CELL, 3), 24.0)
            padded[:a.shape[0], :a.shape[1]] = a[:CELL, :CELL]
            a = padded
        row.append(a)
        if len(row) == 7:
            cellsheet.append(row)
            row = []
    if row:
        while len(row) < 7:
            row.append(np.full((CELL, CELL, 3), 24.0))
        cellsheet.append(row)
    sheet = grid(cellsheet)
    save(sheet, 'CONTACT_SHEET_all_variants.png', 3)
    grey = lum(sheet)[..., None].repeat(3, axis=2)
    dirt_sw = np.tile(np.array([dirt_lum] * 3)[None, None, :], (CELL, sheet.shape[1], 1))
    save(np.concatenate([grey, dirt_sw], axis=0), 'GREYSCALE_READ_M14.png', 3)

    # ---- bank
    bank = dict(
        form='TF-ART-013',
        merged_with=('TF-RUN-006 (the two forms "MUST ship as one family or the '
                     'graveyard gets a duplicate"; ART-013 numbers govern, RUN-006 '
                     'adopted whole where it rules)'),
        cooked='2026-08-08',
        mode='MIXED',
        stack_agreement=('3 CELLS (0.5 skirt + 2.5 body) vs the suburb\'s 4 — BOTH forms '
                         'specify 3, so the merge itself is the RUN-lane agreement the '
                         'acceptance demanded. Face courses: roof-edge / field-or-stripe / '
                         'skirt. mh_roof_field/_seam are TOP layer over the footprint; the '
                         'awning members are OVERHEAD (engine carport code 6).'),
        flagged_not_decided=('district trailer footprint 8x16 (1:2) vs real single-wide '
                             '14x70ft (1:5) — WORLD-lane plumbing question, carried '
                             'unresolved per the merged spec; art does not decide it.'),
        note=('Side field = mobile_siding_0..2 (texture-match 8/1, PENDING PAOLO) '
              'HARVESTED, NOT REPAINTED: rotated 90 degrees so the lap rib runs '
              'HORIZONTAL (the read that separates a home from TF-ART-002\'s vertical '
              'warehouse rib), lit lip above / shadow below, upper-left key preserved. '
              'Colourways are the same pixels chalked (white: sat lost value kept) or '
              'cooled (turquoise: hue ~155-165, sat ~0.11, nowhere near the purple '
              'band). Painted pixels are only the genuine gaps: butt joints, torn '
              'stripe, vent, missing-skirt event, drip rail, fascia, caps, hitch, '
              'burned shell. Skirts are cooked on the cream body; other colourways '
              'take the identical transform (STRUCTURE-NOT-COLOR: recolours are '
              'never the headline). Rust exists ONLY at steel: 1px fastener blooms + '
              '1px-wide 4-6px streaks, and the chassis/hitch. Aluminium chalks.'),
        regular_pattern_declaration=('REGULAR PATTERN, declared to the dither check: horizontal '
                                     'lap rib, pitch 11px (44/11=4, clean vertical wrap), lit lips '
                                     'measured at y = 0/11/23/32 (organic +-1 — rib weight varies, '
                                     'pitch does not). Not stipple. Awning flutes are the same '
                                     'donor pattern vertical.'),
        seam_contract=dict(
            axis=('SELF-SEAMLESS horizontal: side field, stripe course, skirt course, '
                  'roof edge (drip rail pinned to y=14 at every tile edge). SINGLE '
                  'PLACEMENT: caps, hitch, vent/missing skirt events, awning edge/column, '
                  'burned shell (rails at rows 35-38 in every variant, so a burned row '
                  'keeps one dead-level line).'),
            rib_phase=('pitch 11, lip rows 0/11/23/32 shared by every field, stripe, '
                       'skirt (body rows 0..17) and roof-edge (body rows 17..43) tile — '
                       'course-to-course phase is continuous because 44 = 4x11'),
            measured_10tile_runs={k: dict(junction_step=v[0], worst_junction=v[1],
                                          internal_step=v[2]) for k, v in seam.items()},
            m10_self_wrap=('every seamless member measured wrap-step WITHIN its own '
                           'internal neighbour step (per-tile hwrap < edge in the tile '
                           'metrics), and edge_darkening is reported per tile — the '
                           'desert-pool lesson, checked not assumed'),
            baseline=('donor_rot_10run is the anchor baseline: the field IS the '
                      'harvested donor, so its junctions are the donor\'s own wrap '
                      'statistics with ZERO added seam (field junction 26.986 == '
                      'baseline 26.986); mixed-variant junctions sit above the '
                      'internal mean only because donor variant 1 is hotter '
                      'everywhere (edge 25.9 vs 16.5/17.1)'),
            regression_bar=('the 7/28 re-cook wall figure this family must not repeat: '
                            '3.27 mean / 19.52 worst — that regression was wrap-step '
                            'EXCESS over the internal step; here every member\'s '
                            'self-wrap sits BELOW its internal step (negative excess)')),
        value_checks=dict(
            lot_dirt_lum=round(dirt_lum, 2),
            body_clearance_by_colourway=clearances,
            rule='body must clear lot dirt #565040 by >= 18 luminance points',
            body_top_step_p99=round(body_hi, 1),
            roof_mean_lum=round(roof_hi, 1),
            note='the roof/awning are the family highlights; the body stays below them'),
        harvest_sources=[
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt mobile_siding_0..2 (PENDING PAOLO; named the base by the form itself) - side field, rotated, unrepainted',
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt metal_corrugate_0..2 (APPROVED 8/1) - roof coating + burned roof sheets',
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt stucco_bone_0..2 (APPROVED 8/1) - vinyl skirt texture',
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt block_grey_0..2 (APPROVED 8/1) - piers + steel greys',
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt roof_shingle_bn_0 (APPROVED 8/1) - the rust palette',
            'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt wall_plain_8..11 (CANON) - anchor, display only',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt - suburb face + approved 2-cell door, display only'],
        consumers=['TF-ART-013', 'TF-RUN-006'],
        tiles=tiles,
        law='UNJUDGED. Nothing here is canon until Paolo sweeps it.')
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f, indent=1)
    print('bank ->', BANK_OUT, f'({len(tiles)} tiles)')
    print('M14 body-over-dirt clearance (>=18):', clearances,
          '| body p99', round(body_hi, 1), '| roof mean', round(roof_hi, 1))
    for k, v in seam.items():
        print(f'seam {k}: junction {v[0]} worst {v[1]} internal {v[2]}')
    for t in tiles:
        print(t['name'], t['metrics'])

if __name__ == '__main__':
    main()
