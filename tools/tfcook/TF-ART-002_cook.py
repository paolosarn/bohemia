#!/usr/bin/env python3
"""TF-ART-002 cook (merged with TF-RUN-004, board collision C2) — CORRUGATED METAL
BUILDING SKIN, DELTA ONLY: the 4-course-stack members + storage roll-up openings.

THE JOB (records/tileforms/TF-ART-002_corrugated_metal.md merged with
TF-RUN-004_corrugated_metal_skin.md; RUN-004's ADMIN declares the duplicate):
The flat galvanised field course is APPROVED (metal_corrugate_0..2, texture-match
8/1, "Holy shit so fucking good") and is NEVER repainted here. This cook produces
only the DELTA the 4-course stack (base / field / field / under-eave, per
records/BOHEMIA_RUN_BUILDING_STACK_7_27_26.md, NO renderer change) still lacks:
  (1) metal_base_0..2        base course (drop-in for the wall_base slot)
  (2) metal_under_eave_0..2  under-eave course (wall_under_eave slot)
  (3) metal_end_l / _r       corner/end caps (wall_end_l / wall_end_r slots)
  (4) metal_rust_run_0..2    panel-with-rust-run field variant
  (5) metal_sprung_0         one sprung/damaged panel (vehicle-height dents)
  (6) metal_paint_*          2-3 Mojave heat-rejection colorways (off-white bone,
                             sand, pale blue-grey) on ONE shared R-panel geometry:
                             field x2 + base + under-eave per colorway
  (7) rollup_surround_110    roll-up door SURROUND, 110x88 RGBA, real jambs +
                             header, ALPHA hole (door-is-a-hole law)
  (8) rollup_pried_110       PRIED-OPEN roll-up PORTAL, 110x88 — the storage
                             district's signature: leaf crumpled at the bottom,
                             genuinely dark interior void, real jambs
STRUCK from this job (DO-NOT-COOK clauses honoured IN CODE below):
  - closed roll-up + steel man-door: banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt
    already holds civic_dock + civic_mandoor UNJUDGED — opened and asserted
    below; cooking them again would duplicate an unjudged roll-up.
  - residential garage door: TF-CITY-003's object at another scale. Not touched.
    (door_garage_wht_* in the texture-match bank is that lane's, left alone.)

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE below.
    metal_corrugate_0..2 APPROVED 8/1: HARVESTED as the flat field course (never
    repainted) AND as the base canvas + entire palette for every galvanised
    delta tile — painted pixels are quantized to the source tile's own colour
    set, zero new colours. stucco_bone_0..2 and stucco_tan_0..2 (also APPROVED
    8/1) are HARVESTED as the paint palettes for the off-white and sand
    colorways — Mojave heat-rejection paint out of Paolo's own approved ramp.
    The blue-grey colorway has no approved donor (stucco_blue_grey is PENDING
    PAOLO) and is the one genuinely painted palette; reported as such.
  banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt — OPENED IN CODE below: civic_dock +
    civic_mandoor exist UNJUDGED; the closed roll-up leaf and the man-door are
    therefore NOT cooked here (DO-NOT-COOK strike honoured by assertion).
  banks/BOHEMIA_OPENINGS_8_2_26.txt — checked: domestic window/boarded/garage
    jamb ALPHA overlays for the house wall; the starter garage bay construction
    (coil in header, genuinely dark hole, thin jambs) is the CONSTRUCTION
    anchor here, its residential material is not harvested.
  banks/BOHEMIA_PERIMETER_8_2_26.txt — checked: perim_* families are the
    freestanding suburb boundary wall (slump/splitface/stucco/precast/rose/cmu
    + gates), PENDING PAOLO, no metal skin, not a building face. Nothing fit.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — checked: buckets street/wreck/trash/
    crate/dead/barrier/camp — props, no wall course art. Nothing fit.
  banks/BOHEMIA_HD_TILE_REPO_part1..4 x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt —
    "11. Industrial doors and gates" (17 UP) and "4. Scrap wall and panels"
    (12 UP) rendered and LOOKED AT this cook: the doors are dark riveted
    bunker/sci-fi doors with hazard chevrons and greebles — the form's own
    anti-reference ("NOT sci-fi deck plating, no rivets/greebles, not dark");
    the scrap walls are fantasy wooden palisade panels. Off-genre, not
    harvested. "1. Metal floor tiles" / "2. Rusted metal floor tiles" are
    FLOORS seen from above (RUN-004's shopping check already rejected them).
  VERDICT: mode MIXED — approved field + palettes HARVESTED; painted pixels are
  only the genuine gaps (course grammar, caps, rust accents, R-panel colorways,
  the two 110px openings), in harvested palettes wherever a donor exists.

TASTE CHECK:
  45 LAW: light upper-left EVERYWHERE — this is the asset most likely to imply
    a second light, so every rib is a 2-value pair (lit lip LEFT of the rib,
    shadow RIGHT), the header lintel gets a sky-lit top face, end_l is the lit
    corner return and end_r the shadowed one (the starter wall_end_l/r grammar,
    measured: lit x1.19 left, dark x0.40 right). Never 4-value moire, no
    keyline per rib, ribs implied by value banding only. NO dither — the rib
    pattern is a REGULAR PATTERN, declared to the dither check in the bank.
  RIB GEOMETRY: colorway panels use a squared trapezoidal American R-panel at
    4px pitch — 44/4 = 11, clean wrap, phase continuous across any junction
    (the 8/2 stamp-bug law: a periodic module must use a divisor of 44). The
    approved galvanised field's own organic ~11px wave (measured off the tile:
    crests near x 1,12,23,34) is kept untouched on every harvested tile, and
    fastener/streak accents are placed ON that measured phase.
  MOJAVE TRUTH: Vegas bleaches, it does not rot — sun-chalked paint, galvanising
    gone flat chalky grey, NO specular, rust an ACCENT (1px blooms at fastener
    washers + bottom edge, 4-6px streaks down rib shadow valleys, clustered
    irregular), never a ramp step, never rust-belt rot-through. Dents at
    vehicle height on the loading side. DEAD VALLEY: no green, no purple
    (blue-grey held at hue ~215, sat ~0.10, measured against the 2% purple
    kill line). Act-1: the pried-open void is GENUINELY dark (~lum 26), no glow.
  8/2 STAMP BUG: three variants per repeating family, two per colorway field —
    never one hero tile.
  SEAM (highest seam-risk asset on the board): SELF-SEAMLESS horizontal with
    declared rib phase; wrap MEASURED across a 10-tile warehouse face and
    reported vs the internal neighbour step and vs the approved anchors' own
    baseline; no edge darkening. Doors are SINGLE PLACEMENT sized to their
    openings (storage roll-up 2.5 cells = 110px wide; man-door 2-cell law is
    civic_mandoor's business, struck).
  VERIFY ON THE REAL SURFACE: proofs are 3x3 tilings, a 10-tile 4-course
    warehouse face, a storage unit row IN PLACE beside the current stucco pass
    and beside an approved starter house face, and an anchor composite beside
    approved metal_corrugate_0 + the starter garage bay; the cook run ends by
    writing those PNGs for eyes, not just numbers.

Deterministic: SEED fixed, rerunnable, byte-identical output.
Writes ONLY:
  banks/tileforms/TF-ART-002_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-002/*.png
"""

import json, base64, io, os, colorsys, random

from PIL import Image
import numpy as np

SEED = 80802
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
RIB_PITCH = 4                    # colorway R-panel pitch: 44/4 = 11 modules, clean wrap
CREST_COLS = (1, 12, 23, 34)     # measured crests of the APPROVED field's ~11px wave
VALLEY_COLS = (6, 17, 28, 39)    # measured shadow valleys of the approved field
DOOR_W, DOOR_H = 110, 88         # storage roll-up: ~2.5 cells wide, 2 courses tall
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-002_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-002')

# ---------------------------------------------------------------- reuse: open the banks
def load_texture_match(materials):
    """REUSE in code: open the texture-match bank, pull tiles for the named materials.
    Returns {id: float array}, plus the per-tile verdict so approval is checked."""
    p = os.path.join(ROOT, 'banks', 'BOHEMIA_TEXTURE_MATCH_8_1_26.txt')
    d = json.load(open(p))
    out = {}
    for t in d['tiles']:
        if t['material'] in materials:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
            out[t['id']] = (np.asarray(im).astype(np.float64), t['verdict'])
    return out

def assert_do_not_cook_civic():
    """DO-NOT-COOK strike, honoured in code: the closed roll-up and the steel
    man-door already exist UNJUDGED in the civic openings bank. Assert they are
    really there, so this cook provably ships neither."""
    p = os.path.join(ROOT, 'banks', 'BOHEMIA_CIVIC_OPENINGS_8_3_26.txt')
    d = json.load(open(p))
    ids = {t['id'] for t in d['tiles']}
    assert 'civic_dock' in ids and 'civic_mandoor' in ids, ids
    return sorted(ids)

def load_starter(names):
    """Anchor context: frozen starter tiles (never edited, display only)."""
    p = os.path.join(ROOT, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
    d = json.load(open(p))
    out = {}
    for t in d['tiles']:
        if t['id'] in names:
            out[t['id']] = np.asarray(
                Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')).astype(np.float64)
    missing = set(names) - set(out)
    assert not missing, missing
    return out

# ---------------------------------------------------------------- helpers
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]

def palette_of(*tiles):
    px = np.concatenate([t.reshape(-1, 3) for t in tiles])
    return np.unique(px.astype(np.uint8), axis=0).astype(np.float64)

def quantize_to(pal, px):
    """Snap painted pixels to a harvested palette (zero new colours vs the donor)."""
    d = ((pal[None, :, :] - px[:, None, :]) ** 2).sum(axis=2)
    return pal[d.argmin(axis=1)]

def q_region(t, pal, ys, xs, px):
    t[np.ix_(ys, xs)] = quantize_to(pal, px.reshape(-1, 3)).reshape(len(ys), len(xs), 3)

def scaled(px, f):
    return np.clip(px * f, 0, 255)

def rust_palette(pal):
    """The donor tile's own rust: reddish colours already inside the approved ramp."""
    r, g, b = pal[:, 0], pal[:, 1], pal[:, 2]
    m = (r - g > 18) & (r > 80) & (r - b > 30)
    rp = pal[m]
    if len(rp) < 6:                     # fall back to the reddest decile
        rp = pal[np.argsort((r - (g + b) / 2))][-max(6, len(pal) // 10):]
    return rp

def dark_palette(pal, frac=10):
    return pal[np.argsort(lum(pal))][:max(4, len(pal) // frac)]

def wash_row(src, sy, rng, f=1.0):
    """A flat-trim row: median-of-3 (wrapping) kills the rib structure but keeps
    grain; per-pixel jitter keeps the bought-tile detail density."""
    row = src[sy]
    L = lum(row)
    out = np.empty_like(row)
    n = row.shape[0]
    for x in range(n):
        idx = [(x + k) % n for k in (-1, 0, 1)]
        out[x] = row[idx[int(np.argsort(L[idx])[1])]]
    jit = np.array([1.0 + rng.uniform(-0.06, 0.06) for _ in range(n)])[:, None]
    return np.clip(out * jit * f, 0, 255)

# ---------------------------------------------------------------- galvanised deltas
def paint_metal_base(b, rng):
    """Base course (wall_base slot). Starter grammar measured: dark base band
    x0.40 on the bottom 3 rows. Metal truth: a flat steel base-angle closure
    (ribs washed out), rust blooming along the bottom 6 inches above it."""
    t = b.copy()
    pal = palette_of(b)
    rust = rust_palette(pal)
    # bottom-6-inches rust: blooms + short up-streaks in the measured shadow valleys
    for vx in rng.sample(list(VALLEY_COLS), 3):
        x = int(np.clip(vx + rng.randrange(-1, 2), 1, CELL - 3))
        ln = rng.randrange(3, 6)
        w = 1 if rng.random() < 0.6 else 2
        col = rust[rng.randrange(len(rust))]
        for k in range(ln):
            y = 40 - k
            a = 0.55 * (1.0 - k / ln)
            for xx in range(x, min(x + w, CELL - 1)):
                t[y, xx] = quantize_to(pal, (t[y, xx] * (1 - a) + col * a)[None, :])[0]
        # 1px bloom seed at the bottom of the streak
        t[40, x] = quantize_to(pal, (col * 0.85)[None, :])[0]
    # splash-line grime just above the base angle
    for _ in range(3):
        x0 = rng.randrange(0, CELL)
        w = rng.randrange(5, 11)
        xs = [(x0 + k) % CELL for k in range(w)]
        y = rng.randrange(38, 40)
        t[y, xs] = quantize_to(pal, scaled(t[y, xs], 0.90))
    # transition shadow, then the flat dark base channel (ribs washed out)
    t[40] = quantize_to(pal, wash_row(t, 40, rng, 0.74))
    for y in (41, 42, 43):
        t[y] = quantize_to(pal, wash_row(b, 42, random.Random(rng.randrange(1 << 30)), 0.40))
    return t

def paint_metal_eave(b, rng):
    """Under-eave course (wall_under_eave slot). Starter grammar measured: hard
    eave shadow x0.36 rows 0-3, half-step row 4. Rib texture stays faintly
    alive inside the shadow. Fastener line on the measured crest phase."""
    t = b.copy()
    pal = palette_of(b)
    rust = rust_palette(pal)
    for y, f in ((0, 0.36), (1, 0.36), (2, 0.36), (3, 0.38), (4, 0.62)):
        t[y] = quantize_to(pal, scaled(b[y], f))
    # fastener washers on the rib crests, one course below the shadow
    fy = 7
    rusted = rng.sample(range(4), 2)
    streak_i = rng.randrange(4)
    for i, cx in enumerate(CREST_COLS):
        x = int(np.clip(cx + rng.randrange(0, 2), 1, CELL - 2))
        t[fy, x] = quantize_to(pal, scaled(t[fy, x], 0.58)[None, :])[0]
        if i in rusted:  # 1px rust bloom at the washer
            t[fy + 1, x] = quantize_to(pal, (rust[rng.randrange(len(rust))] * 0.9)[None, :])[0]
        if i == streak_i:  # one 4-6px streak dropping into the nearest valley
            vx = VALLEY_COLS[i]
            col = rust[rng.randrange(len(rust))]
            ln = rng.randrange(4, 7)
            for k in range(ln):
                a = 0.5 * (1.0 - k / ln)
                y = fy + 2 + k
                t[y, vx] = quantize_to(pal, (t[y, vx] * (1 - a) + col * a)[None, :])[0]
    return t

def paint_metal_end(b, side, rng):
    """Corner/end caps (wall_end_l / wall_end_r slots). Starter corner grammar
    measured off the frozen set: end_l = lit corner return (x1.19, 3px),
    end_r = shadowed return (x0.40, 4px). Metal reads it as flat corner trim —
    ribs washed out on the trim, cut-edge rust flecks along the seam."""
    t = b.copy()
    pal = palette_of(b)
    rust = rust_palette(pal)
    if side == 'l':
        for x in range(3):
            col = wash_row(b.transpose(1, 0, 2), x, rng, 1.0).reshape(CELL, 3)
            t[:, x] = quantize_to(pal, scaled(col, 1.16))
        t[:, 3] = quantize_to(pal, scaled(t[:, 3], 0.82))       # J-trim return shadow
        seam_x = 3
    else:
        t[:, 39] = quantize_to(pal, scaled(t[:, 39], 0.78))
        for x in range(40, 44):
            col = wash_row(b.transpose(1, 0, 2), x, rng, 1.0).reshape(CELL, 3)
            t[:, x] = quantize_to(pal, scaled(col, 0.45))
        seam_x = 39
    # cut-edge rust: sparse clustered flecks down the trim seam (cut edges rust first)
    for _ in range(2):
        y0 = rng.randrange(6, 34)
        for k in range(rng.randrange(2, 4)):
            y = y0 + k
            col = rust[rng.randrange(len(rust))]
            t[y, seam_x] = quantize_to(pal, (t[y, seam_x] * 0.5 + col * 0.5)[None, :])[0]
    return t

def paint_rust_run(b, rng):
    """Panel-with-rust-run field variant: washer lines on the measured crest
    phase, 4-6px streaks down the rib shadow valleys, clustered irregular.
    Rust stays an accent — the field is still a chalky bleached panel."""
    t = b.copy()
    pal = palette_of(b)
    rust = rust_palette(pal)
    for fy in (9, 26):
        jy = fy + rng.randrange(-1, 2)
        rusted = rng.sample(range(4), rng.randrange(2, 4))
        for i, cx in enumerate(CREST_COLS):
            x = int(np.clip(cx + rng.randrange(0, 2), 1, CELL - 2))
            t[jy, x] = quantize_to(pal, scaled(t[jy, x], 0.58)[None, :])[0]
            if i in rusted:
                t[jy + 1, x] = quantize_to(pal, (rust[rng.randrange(len(rust))] * 0.9)[None, :])[0]
                # streak down the neighbouring valley: strong enough to read
                # as a rust run beside the plain approved field, still an accent
                vx = VALLEY_COLS[i]
                col = rust[rng.randrange(len(rust))]
                ln = rng.randrange(5, 9)
                w = 1 if rng.random() < 0.5 else 2
                for k in range(ln):
                    a = 0.75 * (1.0 - k / (ln + 1))
                    y = jy + 2 + k
                    if y >= CELL:
                        break
                    for xx in range(vx, min(vx + w, CELL - 1)):
                        t[y, xx] = quantize_to(pal, (t[y, xx] * (1 - a) + col * a)[None, :])[0]
    # bottom-edge blooms (water sat here once)
    for vx in rng.sample(list(VALLEY_COLS), 2):
        col = rust[rng.randrange(len(rust))]
        t[43, vx] = quantize_to(pal, (col * 0.8)[None, :])[0]
        t[42, vx] = quantize_to(pal, (t[42, vx] * 0.5 + col * 0.5)[None, :])[0]
    return t

def paint_sprung(b, rng):
    """One sprung/damaged panel: a panel module sagged 2px with a dark gap
    sliver at its upstand, lifted lip catching the light, peeled bottom corner
    showing genuinely dark interior, two vehicle-height dents that flatten the
    rib read (a dent kills the value banding — that IS what a dent looks like)."""
    t = b.copy()
    pal = palette_of(b)
    dark = dark_palette(pal)
    x0, x1 = 24, 34                       # one panel module between measured valleys
    region = t[:, x0:x1].copy()
    t[2:, x0:x1] = region[:-2]            # sagged: dropped 2px
    t[0:2, x0:x1] = quantize_to(pal, scaled(region[0:2], 0.7).reshape(-1, 3)).reshape(2, x1 - x0, 3)
    t[:, x0 - 1] = quantize_to(pal, scaled(t[:, x0 - 1], 0.38))     # the sprung gap
    t[:, x1] = quantize_to(pal, scaled(t[:, x1], 1.18))             # lifted lip, lit
    # peeled bottom corner: dark triangle + bright bent lip on the fold
    for k in range(8):
        y = 36 + k
        w = k + 1
        for xx in range(x0, min(x0 + w, x1)):
            t[y, xx] = dark[rng.randrange(len(dark))]
        lip = min(x0 + w, x1 - 1)
        t[y, lip] = quantize_to(pal, scaled(b[y, lip], 1.22)[None, :])[0]
    # two vehicle-height dents on the loading side: rib contrast collapsed
    for cx, cy, rx, ry in ((10, 27, 6, 5), (37, 30, 4, 4)):
        cy += rng.randrange(-2, 3)
        ys = np.arange(CELL)[:, None]
        xs = np.arange(CELL)[None, :]
        m = (((xs - cx) / rx) ** 2 + ((ys - cy) / ry) ** 2) <= 1.0
        mean = t[m].mean(axis=0)
        t[m] = quantize_to(pal, t[m] * 0.4 + mean * 0.6)
        # faint bright rim upper-left of the dent (the one light)
        rim = (((xs - cx + 1.5) / rx) ** 2 + ((ys - cy + 1.5) / ry) ** 2 <= 1.0) & ~m
        t[rim] = quantize_to(pal, scaled(t[rim], 1.10))
    return t

# ---------------------------------------------------------------- colorway painter
def scrambled_donor(donors, seed, lum_target=None, tint=None):
    """HARVEST the donor texture itself, not just its palette: output COLUMNS
    are real columns of the APPROVED donor tiles, copied in 2-4 column runs
    with a random circular y-roll per run. Columns, not rows, ON PURPOSE: the
    first pass scrambled rows and the donors' horizontal features (mortar
    beds, crack runs) survived as horizontal structure that read as woven
    fabric fighting the VERTICAL rib direction — and the direction is the
    read. Verticalised, the donor features become chalk-fade streaks running
    down the panel, which is exactly what thirty Mojave years do to painted
    metal. Grain, colour count and saturation stay at the donor's approved
    density; column means are partially equalised so a run boundary reads as
    a paint-fade edge, never a stripe — and because every run boundary is a
    vertical value step just like the tile edge, the wrap seam hides inside
    the material's own pattern."""
    rng = random.Random(seed)
    cols = []
    x = 0
    while x < CELL:
        d = donors[rng.randrange(len(donors))]
        run = min(rng.randrange(2, 5), CELL - x)
        sx = rng.randrange(CELL - run)
        roll = rng.randrange(CELL)
        for k in range(run):
            cols.append(np.roll(d[:, sx + k], roll, axis=0))
        x += run
    tex = np.stack(cols, axis=1).astype(np.float64)
    L = lum(tex)
    gm = L.mean() if lum_target is None else lum_target
    colm = L.mean(axis=0, keepdims=True)
    tex = tex * (0.55 * (gm / np.maximum(colm, 1)) + 0.45)[..., None]  # tame, not flatten
    if lum_target is not None:
        m = lum(tex).mean()
        tex = tex * (lum_target / max(m, 1))
    if tint is not None:
        tex = tex * np.array(tint)[None, None, :]
    # micro-contrast trim: the rib pair rides ON the donor grain, so shave a
    # little horizontal micro-contrast first or the sum busts the grain ceiling
    tex = 0.83 * tex + 0.17 * (np.roll(tex, 1, axis=1) + tex + np.roll(tex, -1, axis=1)) / 3.0
    # wrap insurance: donor columns do not necessarily wrap vertically —
    # cross-fade the outer rows toward rolled interior content (the horizontal
    # wrap needs only a light touch: its boundary is a run boundary like any
    # other inside the tile)
    for axis, span, depth in ((0, 5, 0.5), (1, 4, 0.35)):
        n = tex.shape[axis]
        rolled = np.roll(tex, n // 2, axis=axis)
        idx = np.arange(n)
        w = np.clip((span - np.minimum(idx, n - 1 - idx)) / span * depth, 0, depth)
        wsh = w[:, None, None] if axis == 0 else w[None, :, None]
        tex = tex * (1 - wsh) + rolled * wsh
    return np.clip(tex, 0, 255)

def paint_colorway_field(donors, seed, quant_pal, lum_target, tint=None):
    """R-panel colorway field on harvested donor texture: 4px pitch, squared
    trapezoidal, each rib a 2-value pair (lit lip LEFT, shadow RIGHT — the
    upper-left key). ONE geometry across colorways (profile fixed by law, not
    by seed); the paint is the donor's own approved pixels."""
    tex = scrambled_donor(donors, seed, lum_target=lum_target, tint=tint)
    xs = np.arange(CELL)
    prof = np.ones(CELL)
    prof[xs % RIB_PITCH == 1] = 1.12
    prof[xs % RIB_PITCH == 2] = 0.875
    prof[xs % RIB_PITCH == 3] = 0.99
    t = np.clip(tex * prof[None, :, None], 0, 255)
    # grain governor: rib pair + donor grain must land INSIDE the measured
    # tolerance band [54.82, 77.53] — trim deterministically until it does
    # (a hot donor like stucco_bone otherwise sits ~1 point over the ceiling)
    for _ in range(3):
        g = (np.abs(np.diff(lum(t), axis=1)) > 8).mean() * 100
        if g <= 76.5:
            break
        t = 0.85 * t + 0.15 * (np.roll(t, 1, axis=1) + t + np.roll(t, -1, axis=1)) / 3.0
    if quant_pal is not None:
        t = quantize_to(quant_pal, t.reshape(-1, 3)).reshape(CELL, CELL, 3)
    return t

# ---------------------------------------------------------------- door pieces (110x88)
def steel_greys(pal):
    """Mid-grey steel colours out of the harvested corrugate palette."""
    L = lum(pal)
    sat = pal.max(axis=1) - pal.min(axis=1)
    m = (L > 90) & (L < 170) & (sat < 45)
    g = pal[m]
    return g if len(g) >= 8 else pal[np.argsort(np.abs(L - 130))][:20]

def smooth_wave(rng, n, lo, hi, step=0.35):
    """A slow horizontal drift: smooth metal varies gently along its length."""
    v = rng.uniform(lo, hi)
    out = []
    for _ in range(n):
        v = float(np.clip(v + rng.uniform(-step, step) * (hi - lo), lo, hi))
        out.append(v)
    k = np.ones(7) / 7
    return np.convolve(np.array(out), k, mode='same')

def door_frame(rng, pal):
    """Header + jambs shared by surround and pried: RGBA canvas, opening empty.
    Header: lintel with a sky-lit top face (45 law) over the coil box; jambs:
    flat steel channels, inner reveal in shadow, cut-edge rust at the feet.
    Steel is SMOOTH ALONG ITS LENGTH: value drifts, it does not speckle —
    per-pixel noise here read as masonry in the first pass and was killed."""
    rgb = np.zeros((DOOR_H, DOOR_W, 3))
    a = np.zeros((DOOR_H, DOOR_W))
    greys = steel_greys(pal)
    rust = rust_palette(pal)
    base = greys[np.argsort(lum(greys))][len(greys) // 2]
    HEAD, JW = 14, 8
    drift = smooth_wave(rng, DOOR_W, 0.94, 1.06)
    # header band rows 0..13: sky-lit top 3px, coil-drum roll, shadow throw at the soffit
    for y in range(HEAD):
        if y < 3:
            f = 1.16 - 0.02 * y                       # sky-lit top face
        elif y == 3:
            f = 0.88                                  # arris seam under the top face
        elif y < 10:
            f = 1.00 - 0.06 * (y - 4)                 # drum rolling away from the sky
        else:
            f = 0.52 - 0.06 * (y - 10)                # soffit shadow over the opening
        row = np.clip(base[None, :] * (f * drift)[:, None], 0, 255)
        rgb[y] = quantize_to(pal, row)
        a[y] = 255
    # weep streaks off the header: 2 faint vertical runs where water left the lintel
    for _ in range(2):
        x = rng.randrange(12, DOOR_W - 12)
        for k in range(rng.randrange(3, 6)):
            y = 4 + k
            rgb[y, x] = np.clip(rgb[y, x] * 0.86, 0, 255)
    # jambs: lit face, 2px inner reveal in shadow (a door is a HOLE in a wall)
    vdrift = smooth_wave(rng, DOOR_H, 0.95, 1.05)
    for y in range(HEAD, DOOR_H):
        for x in range(JW):
            f = 1.10 if x < 2 else (1.0 if x < 6 else 0.62)
            rgb[y, x] = np.clip(base * f * vdrift[y], 0, 255)
            f2 = 1.04 if x < 2 else (0.94 if x < 6 else 0.70)
            rgb[y, DOOR_W - 1 - x] = np.clip(base * f2 * vdrift[(y + 31) % DOOR_H], 0, 255)
        a[y, :JW] = 255
        a[y, DOOR_W - JW:] = 255
    rgb[HEAD:, :JW] = quantize_to(pal, rgb[HEAD:, :JW].reshape(-1, 3)).reshape(DOOR_H - HEAD, JW, 3)
    rgb[HEAD:, DOOR_W - JW:] = quantize_to(pal, rgb[HEAD:, DOOR_W - JW:].reshape(-1, 3)).reshape(DOOR_H - HEAD, JW, 3)
    # cut-edge rust at the jamb feet (bottom 6 inches) + a fleck run up one edge
    for xs in (range(0, JW), range(DOOR_W - JW, DOOR_W)):
        for x in xs:
            for y in range(DOOR_H - 5, DOOR_H):
                if rng.random() < 0.4:
                    c = rust[rng.randrange(len(rust))]
                    rgb[y, x] = quantize_to(pal, (rgb[y, x] * 0.5 + c * 0.5)[None, :])[0]
    for k in range(rng.randrange(3, 5)):
        y = DOOR_H - 8 - k * 2
        x = rng.choice([5, DOOR_W - 6])
        c = rust[rng.randrange(len(rust))]
        rgb[y, x] = quantize_to(pal, (rgb[y, x] * 0.55 + c * 0.45)[None, :])[0]
    return rgb, a, HEAD, JW

def paint_surround(rng, pal):
    """Roll-up door SURROUND: real jambs + header, ALPHA hole for whatever leaf
    or void the placement puts in it. SINGLE PLACEMENT, sized to the opening."""
    rgb, a, HEAD, JW = door_frame(rng, pal)
    return np.dstack([rgb, a[..., None]])

def paint_pried(rng, pal):
    """PRIED-OPEN roll-up, the storage district's signature PORTAL: the leaf
    shoved half up, its bottom edge crumpled where the bar went in, a genuinely
    dark unit void under it, the slab edge just catching light at the back."""
    rgb, a, HEAD, JW = door_frame(rng, pal)
    greys = steel_greys(pal)
    dark = dark_palette(pal, 14)
    rust = rust_palette(pal)
    x0, x1 = JW, DOOR_W - JW
    base = greys[np.argsort(lum(greys))][len(greys) // 2]
    # crumpled bottom edge of the leaf: slow buckle + the pry-point kink
    leaf_bot = np.zeros(DOOR_W, dtype=int)
    ph = rng.uniform(0, 6.28)
    pry_x = rng.randrange(x0 + 8, x0 + 30)
    for x in range(x0, x1):
        wob = 2.2 * np.sin(x * 0.13 + ph)
        kink = -6.0 * np.exp(-((x - pry_x) / 7.0) ** 2)     # bent UP where pried
        leaf_bot[x] = int(np.clip(46 + wob + kink, 36, 51))
    # smooth the buckle so it reads as bent sheet, not torn paper
    lb = leaf_bot.astype(float)
    lb[x0:x1] = np.convolve(lb[x0:x1], np.ones(3) / 3, mode='same')
    leaf_bot[x0 + 1:x1 - 1] = lb[x0 + 1:x1 - 1].astype(int)
    leaf_bot[x0] = leaf_bot[x0 + 1]
    leaf_bot[x1 - 1] = leaf_bot[x1 - 2]
    # the leaf: horizontal slats, 3px pitch — SMOOTH along their length (metal,
    # not masonry): one value per slat line, drifting gently, no per-pixel picks
    drift = smooth_wave(rng, DOOR_W, 0.95, 1.05)
    for y in range(HEAD, int(leaf_bot.max())):
        ph3 = (y - HEAD) % 3
        f = 1.10 if ph3 == 0 else (0.97 if ph3 == 1 else 0.80)
        row = np.clip(base[None, :] * (f * drift)[:, None] * (1 + 0.012 * ((y * 7) % 3 - 1)), 0, 255)
        row = quantize_to(pal, row)
        for x in range(x0, x1):
            if y < leaf_bot[x]:
                rgb[y, x] = row[x]
                a[y, x] = 255
    # buckle shading: the crumple zone bows toward the light — bright bent lip
    # along the whole mangled edge, dark fold creases in short runs above it
    for x in range(x0, x1):
        yb = leaf_bot[x] - 1
        if yb > HEAD:
            rgb[yb, x] = quantize_to(pal, np.clip(rgb[yb, x] * 1.28, 0, 255)[None, :])[0]
        if yb - 1 > HEAD:
            rgb[yb - 1, x] = quantize_to(pal, np.clip(rgb[yb - 1, x] * 1.10, 0, 255)[None, :])[0]
    for _ in range(5):  # dark fold creases, clustered near the pry point
        cx = int(np.clip(pry_x + rng.randrange(-14, 15), x0 + 1, x1 - 6))
        ln = rng.randrange(3, 6)
        yb = leaf_bot[cx] - rng.randrange(3, 6)
        if yb > HEAD + 2:
            for k in range(ln):
                x = cx + k
                y = int(np.clip(yb + (k % 2), HEAD + 1, leaf_bot[x] - 2))
                rgb[y, x] = quantize_to(pal, np.clip(rgb[y, x] * 0.62, 0, 255)[None, :])[0]
    # pry gouges: bare bright metal where the bar chewed the edge
    for k in range(3):
        x = pry_x + rng.randrange(-3, 4)
        y = leaf_bot[x] - rng.randrange(1, 3)
        rgb[y, x] = quantize_to(pal, np.array([[208.0, 204.0, 196.0]]))[0]
    # thirty-year weathering on the leaf: dust streaks running the slats'
    # full drop, a couple of scuffs and one shallow dent — the clean first
    # pass read as plastic beside the grainy approved wall
    for _ in range(4):
        x = rng.randrange(x0 + 3, x1 - 4)
        wf = rng.uniform(0.90, 0.94)
        for y in range(HEAD + 1, int(leaf_bot[x]) - 1):
            for xx in range(x, x + rng.randrange(1, 3)):
                rgb[y, xx] = np.clip(rgb[y, xx] * wf, 0, 255)
    for _ in range(3):  # scuffs: short horizontal bright/dark dashes
        x = rng.randrange(x0 + 2, x1 - 8)
        y = rng.randrange(HEAD + 4, int(leaf_bot[x0:x1].min()) - 2)
        f = rng.choice((0.8, 1.16))
        for k in range(rng.randrange(3, 6)):
            rgb[y, x + k] = np.clip(rgb[y, x + k] * f, 0, 255)
    # one shallow dent mid-leaf: rib/slat contrast collapses, faint lit rim
    cx, cy = rng.randrange(x0 + 16, x1 - 16), HEAD + 12
    ys, xs2 = np.arange(DOOR_H)[:, None], np.arange(DOOR_W)[None, :]
    dm = (((xs2 - cx) / 7.0) ** 2 + ((ys - cy) / 4.0) ** 2) <= 1.0
    dm &= (a > 0)[..., ] if a.ndim == 2 else dm
    mean = rgb[dm].mean(axis=0)
    rgb[dm] = rgb[dm] * 0.45 + mean * 0.55
    rim = ((((xs2 - cx + 1.5) / 7.0) ** 2 + ((ys - cy + 1.5) / 4.0) ** 2) <= 1.0) & ~dm & (a > 0)
    rgb[rim] = np.clip(rgb[rim] * 1.08, 0, 255)
    # the void: genuinely dark and NEAR-FLAT (act-1 black glass rule: dark is
    # dark, it does not sparkle) — the first pass's per-pixel dark picks read
    # as gravel and were killed
    vjit = np.clip(np.random.default_rng(SEED + 77).normal(0, 2.2, (DOOR_H, DOOR_W)), -5, 5)
    for x in range(x0, x1):
        for y in range(leaf_bot[x], DOOR_H):
            v = np.array([26.0, 26.5, 28.0]) + vjit[y, x]
            rgb[y, x] = np.clip(v, 16, 42)
            a[y, x] = 255
    # leaf drop shadow into the void: the hole is deeper right under the leaf
    for x in range(x0, x1):
        for k in range(3):
            y = leaf_bot[x] + k
            if y < DOOR_H:
                rgb[y, x] = np.clip(rgb[y, x] * (0.55 + 0.15 * k), 12, 42)
    # slab edge at the back of the unit floor, just catching ambient
    floor = np.clip(base * 0.34, 0, 255)
    for x in range(x0, x1):
        rgb[DOOR_H - 3, x] = np.clip(floor * 0.8 * drift[x], 0, 255)
        rgb[DOOR_H - 2, x] = np.clip(floor * drift[x], 0, 255)
        rgb[DOOR_H - 1, x] = np.clip(floor * 0.9 * drift[x], 0, 255)
    # inner reveal shadow ring against both jambs (door-is-a-hole)
    for y in range(HEAD, DOOR_H):
        for x in (x0, x1 - 1):
            rgb[y, x] = np.clip(rgb[y, x] * 0.6, 0, 255)
    return np.dstack([rgb, a[..., None]])

# ---------------------------------------------------------------- metrics
def measure(tile):
    """Style-target metrics + world-truth shares + seam numbers. RGBA tiles are
    measured on their opaque pixels; wrap only where the contract demands it."""
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
        hwrap = vwrap = edge_dark = None
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
    """Measure the wrap across a laid run: junction step (last col of tile k vs
    first col of tile k+1) against the internal neighbour step."""
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
    if arr.shape[2] == 4:
        im = Image.fromarray(arr.astype(np.uint8), 'RGBA')
    else:
        im = Image.fromarray(arr.astype(np.uint8), 'RGB')
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()

def save(arr, name, scale=1):
    arr = arr.astype(np.uint8)
    im = Image.fromarray(arr, 'RGBA' if arr.shape[2] == 4 else 'RGB')
    if scale > 1:
        im = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    im.save(os.path.join(PROOF_DIR, name))

def grid(rows):
    return np.concatenate([np.concatenate(r, axis=1) for r in rows], axis=0)

def paste_rgba(canvas, piece, y, x):
    rgb, al = piece[..., :3], piece[..., 3:] / 255.0
    h, w = rgb.shape[:2]
    canvas[y:y + h, x:x + w] = canvas[y:y + h, x:x + w] * (1 - al) + rgb * al

# ---------------------------------------------------------------- main
def main():
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)

    civic_ids = assert_do_not_cook_civic()

    tm = load_texture_match({'metal_corrugate', 'stucco_bone', 'stucco_tan', 'block_grey'})
    for tid, (_, v) in tm.items():
        assert v.startswith('APPROVED'), (tid, v)
    corr = [tm[f'metal_corrugate_{i}'][0] for i in range(3)]
    bone = [tm[f'stucco_bone_{i}'][0] for i in range(3)]
    tan = [tm[f'stucco_tan_{i}'][0] for i in range(3)]
    bgrey = [tm[f'block_grey_{i}'][0] for i in range(3)]
    bone_pal = palette_of(*bone)
    tan_pal = palette_of(*tan)
    corr_pal = palette_of(*corr)

    starter = load_starter(['wall_0', 'wall_1', 'wall_2', 'wall_base', 'wall_under_eave',
                            'wall_end_l', 'wall_end_r', 'wall_window', 'door_top',
                            'door_bottom', 'garage_top', 'garage_bottom', 'garage_top_l',
                            'garage_bottom_l', 'garage_top_r', 'garage_bottom_r',
                            'roof_ridge', 'roof_slope', 'roof_eave'])

    # ---- galvanised harvested family
    bases = [paint_metal_base(corr[i], random.Random(SEED + 10 + i)) for i in range(3)]
    eaves = [paint_metal_eave(corr[i], random.Random(SEED + 20 + i)) for i in range(3)]
    end_l = paint_metal_end(corr[1], 'l', random.Random(SEED + 31))
    end_r = paint_metal_end(corr[2], 'r', random.Random(SEED + 32))
    rusts = [paint_rust_run(corr[i], random.Random(SEED + 40 + i)) for i in range(3)]
    sprung = paint_sprung(corr[0], random.Random(SEED + 50))

    # ---- colorways: ONE geometry (same rib profile + same scramble seeds for
    # every colorway), three Mojave heat-rejection paints on harvested donors
    cw_defs = [
        ('offwhite', bone, bone_pal, 114.0, None,
         'stucco_bone_0..2 (APPROVED 8/1) — texture rows + palette'),
        ('sand', tan, tan_pal, 110.0, None,
         'stucco_tan_0..2 (APPROVED 8/1) — texture rows + palette'),
        ('bluegrey', bgrey, None, 103.0, (0.95, 1.0, 1.09),
         'block_grey_0..2 (APPROVED 8/1) — texture rows, blue-tinted (no approved blue-grey donor; stucco_blue_grey is PENDING)'),
    ]
    cw = {}
    for name, donors, pal, lt, tint, src in cw_defs:
        f0 = paint_colorway_field(donors, SEED + 60, pal, lt, tint)   # same geometry
        f1 = paint_colorway_field(donors, SEED + 61, pal, lt, tint)   # seeds for all
        cb = paint_metal_base(f0, random.Random(SEED + 62))
        ce = paint_metal_eave(f1, random.Random(SEED + 63))
        cw[name] = dict(fields=[f0, f1], base=cb, eave=ce, src=src)

    # ---- doors
    surround = paint_surround(random.Random(SEED + 70), corr_pal)
    pried = paint_pried(random.Random(SEED + 71), corr_pal)

    # ---- bank tiles
    tiles = []
    def add(name, arr, kind, harvested):
        e = dict(name=name, px=(list(arr.shape[:2][::-1]) if arr.shape[0] != CELL or
                 arr.shape[1] != CELL else CELL), b64=png_b64(arr),
                 metrics=measure(arr), kind=kind, harvested_from=harvested)
        tiles.append(e)

    for i in range(3):
        add(f'metal_base_{i}', bases[i], 'base course (wall_base slot)',
            f'metal_corrugate_{i} (APPROVED 8/1) canvas + palette')
        add(f'metal_under_eave_{i}', eaves[i], 'under-eave course (wall_under_eave slot)',
            f'metal_corrugate_{i} (APPROVED 8/1) canvas + palette')
    add('metal_end_l', end_l, 'lit corner cap (wall_end_l slot)',
        'metal_corrugate_1 (APPROVED 8/1) canvas + palette')
    add('metal_end_r', end_r, 'shadow corner cap (wall_end_r slot)',
        'metal_corrugate_2 (APPROVED 8/1) canvas + palette')
    for i in range(3):
        add(f'metal_rust_run_{i}', rusts[i], 'field variant, rust runs at fasteners',
            f'metal_corrugate_{i} (APPROVED 8/1) canvas + palette')
    add('metal_sprung_0', sprung, 'sprung/damaged panel, vehicle-height dents',
        'metal_corrugate_0 (APPROVED 8/1) canvas + palette')
    for name in ('offwhite', 'sand', 'bluegrey'):
        c = cw[name]
        for k, f in enumerate(c['fields']):
            add(f'metal_paint_{name}_{k}', f, f'{name} colorway field (R-panel, 4px pitch)', c['src'])
        add(f'metal_paint_{name}_base', c['base'], f'{name} colorway base course', c['src'])
        add(f'metal_paint_{name}_eave', c['eave'], f'{name} colorway under-eave course', c['src'])
    add('rollup_surround_110', surround,
        'roll-up SURROUND 110x88 RGBA, alpha hole, SINGLE PLACEMENT',
        'metal_corrugate palette (APPROVED 8/1); construction per starter garage bay')
    add('rollup_pried_110', pried,
        'PRIED-OPEN roll-up PORTAL 110x88, dark unit void, SINGLE PLACEMENT',
        'metal_corrugate palette (APPROVED 8/1); construction per starter garage bay')

    # zero-new-colours audit for every galvanised harvest tile
    union = set(map(tuple, corr_pal.astype(int).tolist()))
    audit = {'metal_base': bases, 'metal_under_eave': eaves,
             'metal_rust_run': rusts}
    for t in tiles:
        arr = None
        for fam, arrs in audit.items():
            if t['name'].startswith(fam):
                arr = arrs[int(t['name'].rsplit('_', 1)[1])]
        if t['name'] == 'metal_end_l': arr = end_l
        if t['name'] == 'metal_end_r': arr = end_r
        if t['name'] == 'metal_sprung_0': arr = sprung
        if arr is not None:
            cols = set(map(tuple, arr.reshape(-1, 3).astype(int).tolist()))
            t['new_colours_vs_approved_ramp'] = len(cols - union)

    # ---- seam measurement on laid runs (the acceptance number)
    seam = {}
    field_run = [corr[k % 3] for k in range(10)]
    seam['approved_field_10run'] = run_seam(field_run)
    seam['base_10run'] = run_seam([bases[k % 3] for k in range(10)])
    seam['eave_10run'] = run_seam([eaves[k % 3] for k in range(10)])
    seam['rust_10run'] = run_seam([rusts[k % 3] for k in range(10)])
    for name in ('offwhite', 'sand', 'bluegrey'):
        seam[f'paint_{name}_10run'] = run_seam(
            [cw[name]['fields'][k % 2] for k in range(10)])

    # ---- proofs
    # (a) 3x3 tiled proofs per seamless family
    for name in ('offwhite', 'sand', 'bluegrey'):
        f = cw[name]['fields']
        save(grid([[f[(r + k) % 2] for k in range(3)] for r in range(3)]),
             f'TILED_3x3_paint_{name}.png', 3)
    save(grid([[rusts[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_rust_run.png', 3)
    save(grid([[bases[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_base.png', 3)
    save(grid([[eaves[(r + k) % 3] for k in range(3)] for r in range(3)]),
         'TILED_3x3_under_eave.png', 3)

    # (b) 10-tile warehouse face: the real 4-course stack, ends capped
    def face_row(mk, n):
        return [mk(k) for k in range(n)]
    wf = grid([
        face_row(lambda k: eaves[k % 3], 10),
        face_row(lambda k: corr[k % 3], 10),
        face_row(lambda k: corr[(k + 1) % 3], 10),
        face_row(lambda k: bases[k % 3], 10)])
    wf[:, :CELL] = grid([[paint_metal_eave(end_l, random.Random(SEED + 80))],
                         [end_l], [end_l], [paint_metal_base(end_l, random.Random(SEED + 81))]])[:, :CELL]
    wf[:, -CELL:] = grid([[paint_metal_eave(end_r, random.Random(SEED + 82))],
                          [end_r], [end_r], [paint_metal_base(end_r, random.Random(SEED + 83))]])[:, :CELL]
    save(wf, 'WAREHOUSE_FACE_10TILE_4COURSE.png', 3)

    # sprung + colorway stacks beside it
    stack_sheet = []
    for name in ('offwhite', 'sand', 'bluegrey'):
        c = cw[name]
        stack_sheet.append([c['eave'], c['fields'][0], c['fields'][1], c['base']])
    stack_sheet.append([eaves[0], rusts[0], sprung, bases[0]])
    save(grid([[col[r] for col in stack_sheet] for r in range(4)]),
         'COLORWAY_STACKS_4COURSE.png', 3)

    # (c) storage unit row IN PLACE beside the current stucco pass and an approved house
    def storage_row_metal(width_cells=10):
        H, W = 3 * CELL, width_cells * CELL
        c = np.zeros((H, W, 3))
        for k in range(width_cells):
            c[0:CELL, k * CELL:(k + 1) * CELL] = eaves[k % 3]
            c[CELL:2 * CELL, k * CELL:(k + 1) * CELL] = corr[k % 3]
            c[2 * CELL:, k * CELL:(k + 1) * CELL] = bases[k % 3]
        c[CELL:, :CELL] = np.concatenate([end_l, paint_metal_base(end_l, random.Random(SEED + 84))])
        c[CELL:, -CELL:] = np.concatenate([end_r, paint_metal_base(end_r, random.Random(SEED + 85))])
        paste_rgba(c, pried, CELL, int(1.2 * CELL))
        void = np.dstack([np.zeros((DOOR_H, DOOR_W, 3)) + 26.0,
                          np.full((DOOR_H, DOOR_W, 1), 255.0)])
        rngv = np.random.default_rng(SEED + 86)
        void[..., :3] *= (1 + rngv.uniform(-0.15, 0.15, (DOOR_H, DOOR_W)))[..., None]
        void[-3:, :, :3] = 52
        paste_rgba(c, void, CELL, int(5.6 * CELL))
        paste_rgba(c, surround, CELL, int(5.6 * CELL))
        return c

    def stucco_pass_row(width_cells=6):
        H, W = 3 * CELL, width_cells * CELL
        c = np.zeros((H, W, 3))
        for k in range(width_cells):
            c[0:CELL, k * CELL:(k + 1) * CELL] = starter['wall_under_eave']
            c[CELL:2 * CELL, k * CELL:(k + 1) * CELL] = starter[f'wall_{k % 3}']
            c[2 * CELL:, k * CELL:(k + 1) * CELL] = starter['wall_base']
        # today's "roll-up": the residential garage bay in stucco (the defect)
        c[CELL:2 * CELL, CELL:2 * CELL] = starter['garage_top_l']
        c[CELL:2 * CELL, 2 * CELL:3 * CELL] = starter['garage_top']
        c[CELL:2 * CELL, 3 * CELL:4 * CELL] = starter['garage_top_r']
        c[2 * CELL:, CELL:2 * CELL] = starter['garage_bottom_l']
        c[2 * CELL:, 2 * CELL:3 * CELL] = starter['garage_bottom']
        c[2 * CELL:, 3 * CELL:4 * CELL] = starter['garage_bottom_r']
        return c

    def house_face(width_cells=5):
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

    sm = storage_row_metal()
    sp = stucco_pass_row()
    hf = house_face()
    H = max(sm.shape[0], sp.shape[0], hf.shape[0])
    gap = np.full((H, 10, 3), 24.0)
    def vpad(x):
        if x.shape[0] == H:
            return x
        p = np.full((H - x.shape[0], x.shape[1], 3), 24.0)
        return np.concatenate([p, x], axis=0)
    save(np.concatenate([vpad(sm), gap, vpad(sp), gap, vpad(hf)], axis=1),
         'STORAGE_ROW_vs_STUCCO_PASS_vs_HOUSE.png', 2)

    # doors close-up over a metal backdrop (the real placement look)
    def door_panel(piece, closed_void=False):
        c = np.zeros((3 * CELL, 4 * CELL, 3))
        for k in range(4):
            c[0:CELL, k * CELL:(k + 1) * CELL] = eaves[k % 3]
            c[CELL:2 * CELL, k * CELL:(k + 1) * CELL] = corr[k % 3]
            c[2 * CELL:, k * CELL:(k + 1) * CELL] = bases[k % 3]
        x = (4 * CELL - DOOR_W) // 2
        if closed_void:
            void = np.dstack([np.zeros((DOOR_H, DOOR_W, 3)) + 26.0,
                              np.full((DOOR_H, DOOR_W, 1), 255.0)])
            rngv = np.random.default_rng(SEED + 87)
            void[..., :3] *= (1 + rngv.uniform(-0.15, 0.15, (DOOR_H, DOOR_W)))[..., None]
            void[-3:, :, :3] = 52
            paste_rgba(c, void, CELL, x)
        paste_rgba(c, piece, CELL, x)
        return c
    gapd = np.full((3 * CELL, 10, 3), 24.0)
    save(np.concatenate([door_panel(pried), gapd, door_panel(surround, True)], axis=1),
         'DOORS_pried_and_surround_in_wall.png', 3)

    # anchor composite: ours beside approved corrugate + starter garage bay + wall_base
    pad = np.full((CELL, 6, 3), 24.0)
    bay = np.concatenate([starter['garage_top'], starter['garage_bottom']], axis=0)
    row1 = np.concatenate([corr[0], pad, bases[0], pad, eaves[0], pad, end_l, pad,
                           end_r, pad, rusts[0], pad, sprung], axis=1)
    row2 = np.concatenate([cw['offwhite']['fields'][0], pad, cw['sand']['fields'][0],
                           pad, cw['bluegrey']['fields'][0], pad,
                           starter['wall_base'], pad, starter['wall_0'], pad,
                           corr[1], pad, corr[2]], axis=1)
    hpad = np.full((6, row1.shape[1], 3), 24.0)
    comp = np.concatenate([row1, hpad, row2], axis=0)
    bpad = np.full((bay.shape[0], 6, 3), 24.0)
    bay_strip = np.concatenate([bay, bpad,
                                np.concatenate([eaves[1], bases[1]], axis=0), bpad,
                                np.concatenate([corr[1], corr[2]], axis=0)], axis=1)
    wpad = np.full((6, max(comp.shape[1], bay_strip.shape[1]), 3), 24.0)
    def rpad(x, W):
        if x.shape[1] == W:
            return x
        return np.concatenate([x, np.full((x.shape[0], W - x.shape[1], 3), 24.0)], axis=1)
    W = wpad.shape[1]
    save(np.concatenate([rpad(comp, W), wpad, rpad(bay_strip, W)], axis=0),
         'ANCHOR_COMPOSITE_beside_approved_corrugate_and_garage_bay.png', 3)

    # contact sheet of every candidate
    cells = [t for t in tiles if t['px'] == CELL]
    arrs = {t['name']: None for t in cells}
    lookup = dict()
    for i in range(3):
        lookup[f'metal_base_{i}'] = bases[i]
        lookup[f'metal_under_eave_{i}'] = eaves[i]
        lookup[f'metal_rust_run_{i}'] = rusts[i]
    lookup['metal_end_l'] = end_l; lookup['metal_end_r'] = end_r
    lookup['metal_sprung_0'] = sprung
    for name in ('offwhite', 'sand', 'bluegrey'):
        c = cw[name]
        lookup[f'metal_paint_{name}_0'] = c['fields'][0]
        lookup[f'metal_paint_{name}_1'] = c['fields'][1]
        lookup[f'metal_paint_{name}_base'] = c['base']
        lookup[f'metal_paint_{name}_eave'] = c['eave']
    names = [t['name'] for t in cells]
    rows = []
    for r in range(0, len(names), 6):
        row = [lookup[n] for n in names[r:r + 6]]
        while len(row) < 6:
            row.append(np.full((CELL, CELL, 3), 24.0))
        rows.append(row)
    save(grid(rows), 'CONTACT_SHEET_all_variants.png', 4)

    # ---- bank
    bank = dict(
        form='TF-ART-002',
        merged_with='TF-RUN-004 (board collision C2: RUN-004 ADMIN declares the duplicate; one cook, two consumers)',
        cooked='2026-08-08',
        mode='MIXED',
        note=('DELTA ONLY: the flat galvanised field course is APPROVED '
              '(metal_corrugate_0..2, 8/1) and was NOT repainted. Galvanised course '
              'members harvest an approved corrugate tile as canvas + palette '
              '(painted pixels quantized to the donor colour set - see '
              'new_colours_vs_approved_ramp per tile). Colorways: off-white quantized '
              'to approved stucco_bone, sand to approved stucco_tan; blue-grey is the '
              'one painted palette (no approved donor). DO-NOT-COOK honoured in code: '
              f'civic openings bank holds {", ".join(civic_ids)} - the closed roll-up '
              'and steel man-door were NOT cooked. Residential garage door '
              '(TF-CITY-003) untouched. 4-course drop-in: base/field/field/under-eave '
              'name the starter stack slots (wall_base / wall / wall_under_eave / '
              'wall_end_l/r); NO renderer change needed.'),
        regular_pattern_declaration=('The rib pattern is a REGULAR PATTERN, declared to the dither '
                                     'check: colorway R-panel at 4px pitch (44/4=11, wraps clean); '
                                     'harvested tiles keep the approved field\'s own ~11px wave '
                                     '(crests measured at x = 1, 12, 23, 34). Not stipple.'),
        seam_contract=dict(
            axis='SELF-SEAMLESS horizontal; COURSED vertical (base/field/field/under-eave)',
            rib_phase=('colorways: pitch 4px, phase 1 (lit lip) / 2 (shadow), continuous across any '
                       'junction because 4 divides 44; galvanised: the approved field\'s own phase, untouched'),
            doors='SINGLE PLACEMENT sized to the opening: storage roll-up 110x88 (2.5 cells x 2 courses)',
            measured_10tile_runs={k: dict(junction_step=v[0], internal_step=v[1])
                                  for k, v in seam.items()},
            baseline='approved_field_10run is the anchor baseline; junction steps at or under it are the field\'s own wrap'),
        harvest_sources=[
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt metal_corrugate_0..2 (APPROVED 8/1) - field course + canvas + palette',
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt stucco_bone_0..2, stucco_tan_0..2 (APPROVED 8/1) - colorway paint palettes',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt garage bay - opening CONSTRUCTION anchor (display only, no pixels harvested)'],
        do_not_cook_honoured=dict(
            civic_openings_bank_opened=True, ids_found=civic_ids,
            skipped=['closed roll-up (civic_dock)', 'steel man-door (civic_mandoor)',
                     'residential garage door (TF-CITY-003)']),
        consumers=['TF-ART-002', 'TF-RUN-004'],
        tiles=tiles,
        law='UNJUDGED. Nothing here is canon until Paolo sweeps it.')
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f, indent=1)
    print('bank ->', BANK_OUT, f'({len(tiles)} tiles)')
    for k, v in seam.items():
        print(f'seam {k}: junction {v[0]} vs internal {v[1]}')
    for t in tiles:
        extra = f" new_colours:{t['new_colours_vs_approved_ramp']}" if 'new_colours_vs_approved_ramp' in t else ''
        print(t['name'], t['metrics'], extra)

if __name__ == '__main__':
    main()
