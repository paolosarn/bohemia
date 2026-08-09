#!/usr/bin/env python3
"""TF-ART-008 cook (merged with TF-WORLD-008, same asset both lanes) — the
STOREFRONT family delta: mullion post, boarded bay, smashed/blown-out entrance
bay (THE PORTAL, 2 tiles tall), transom band, half-down/jammed security
grille, roll-down shutter dented and down, dead awning (4 faded colourways),
sign-band ghost / false-front fascia BLANK, party-wall pilaster, run end
posts.

DO-NOT-COOK STRIKE HONOURED: the plain glazed bay is ALREADY COOKED —
civic_storefront (banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt, PENDING PAOLO).
That bank is opened in code below and its bay is byte-copied wherever an
intact pane appears in this cook (grille base, tall-bay composite, proofs);
this script never re-synthesizes an intact glazed bay. An assert proves the
copied region is pixel-identical to the bank's tile.

GEOMETRY (measured off civic_storefront, matched exactly so every delta bay
interchanges with it in a run): opaque band rows 13-38 of the 44px cell —
header rail row 13 (lum ~140), header shadow row 14, glass rows 15-36
(lum ~21, the DEAD DARK value family of the approved starter wall_window),
base rail row 37, sill row 38. Mullion posts at x = 7/8, 18/19, 29/30, 40/41:
bright column then recess-shadow column (upper-left light, the 1-2px recess
IS the depth cue). Post pitch 11px — a divisor of 44, so a run of bays is
SELF-SEAMLESS at the mullion pitch and the tile seam falls mid-pane, which is
ART-008's edge contract (the one family where the seam is a feature).
WORLD-008's street-wall framing: the face is 3 tiles tall; the smashed
entrance bay is the door bay and fills the bottom 2 tiles (the approved DOOR
CLIPS' 2-tile proportion); the transom band + sign band are the third tile;
the awning projects 1.5 m = 2 cells over the walk (overhead layer).

REUSE CHECK:
  banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt (PENDING PAOLO) — OPENED IN CODE.
    civic_storefront: HARVESTED VERBATIM as the intact bay everywhere one is
    shown (do-not-cook strike); its frame rows (13/14/37/38), mullion column
    pixels and glass pixel population are the byte-source for every delta
    member's rails, posts and panes — the transom band is literally a
    re-slice of civic_storefront's own rows (head + 8 glass rows + base),
    zero new pixels. civic_parapet: display-only in the assembled run proof.
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE.
    storefront_alum_0..2 (PENDING, the form names it the frame material
    reference): aluminium pixel ramp HARVESTED for the shutter, grille,
    posts and awning frame metal. block_grey_0..2 (APPROVED 8/1): pilaster
    texture donor columns + the backing wall in every composite proof.
    stucco_tan_0..2 / stucco_bone_0..2 (APPROVED 8/1): sign-band fascia
    palette (bleached in code from his approved stucco, not guessed).
    roof_tile_terra_0..2 (APPROVED 8/1): rust-streak ramp + the faded oxide
    red awning colourway — the hue carrier comes out of Paolo's own approved
    terracotta, desaturated to world discipline.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (APPROVED 7/28+7/29)
    — OPENED IN CODE. wall_boarded: the approved plywood language HARVESTED
    VERBATIM — the boarded bay's fill is built from the donor's own plank and
    gap ROWS (rows 12-31 x cols 10-33), re-tiled commercial-width and
    quantized back to the donor palette (zero new colours in the boarding).
    wall_window: the approved DEAD DARK glass value measured and asserted
    against (glass rgb ~27 neutral; civic glass sits in the same family).
    walk_0..2 / walk_kerb / road_0: threshold strip donor + the street in the
    assembled run proof. door_top/door_bottom: the 2-tile door proportion
    anchor, shown beside the portal in the anchor composite. wall_0:
    residential anchor context.
  banks/BOHEMIA_OPENINGS_8_2_26.txt — checked: residential window/boarded/
    garage overlays, domestic proportion; the form itself names them the
    near-miss that does not cover a commercial bay. Nothing harvested.
  banks/BOHEMIA_PERIMETER_8_2_26.txt — checked: slump-block yard walls only.
    Nothing fit.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — checked (asserted in code):
    street/wreck/trash/crate/dead/barrier/camp props. No storefront member.
  banks/BOHEMIA_HD_TILE_REPO_part1..4 x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26 —
    pack list walked via BOHEMIA_HD_TYPE_SEED_7_10_26.txt AND the one
    shop-adjacent hit OPENED AND LOOKED AT: "Exterior Cafe Props (awnings,
    windows, potted plants and more)" (part4, 35 tiles). It does NOT cover
    this form and is machine-checked ineligible in code: (1) the pack has
    ZERO rows in the ACT1 confirmed set — never judged, so no UP verdict to
    harvest under (the law is UP tiles only); (2) its awnings are crisp,
    intact, saturated cafe fabric on rustic timber frames — the form's named
    anti-lesson (a bright living-city storefront), not a sun-shredded dead
    aluminium system; (3) the pack is carpeted in LIVING GREEN plants and
    readable text signs ("COFFEE", "Daily Special") — DEAD VALLEY and
    NO-TEXT kills. The remaining market packs are medieval stalls, a banned
    subject. Nothing eligible; BOUGHT-BEATS-PAINTED satisfied by inspection,
    not absence.
  VERDICT: mode MIXED — frames, rails, mullions, glass, planks, aluminium,
  fascia palette and the red colourway are HARVESTED; painted pixels are only
  the genuine gaps (board re-tiling, shard teeth, mesh, slats, dents, fabric,
  ghosts, pier shading).

TASTE CHECK:
  DEAD DARK GLASS IS LAW: every pane in this cook is civic_storefront's own
    glass population or darker (the smashed interior); hot-yellow measured
    per tile with the constitution's exact predicate (r>226,g>200,b<130),
    ceiling 2%; no reflections, no glow, day and night the same tile.
  MOSTLY INTACT AND FILTHY: the run proof shows one smashed bay in fourteen —
    entrance only, per the form ("most bays stay INTACT AND FILTHY, only
    entrance bays smashed - truer and more unsettling").
  NO TEXT EVER: sign bands are blank sun-bleached fields; the ghost is a
    geometric un-bleached shadow + mounting holes, never a letterform.
    Paolo authors all names (MECHANISM-MINE).
  45 LAW: front face + recess; posts carry a lit face and a shadow column
    (upper-left light); the pilaster and end posts carry a dark return
    sliver; the awning is a sky-lit top surface whose sag bands bow toward
    the viewer; nothing is flat side-on.
  NO KEYLINE, NO DITHER: edges are value steps (the named v2 hero kill);
    near-black fraction reported per tile against the constitution's 6%.
  SAT DISCIPLINE: the world sits near 0.19; the awning is the one deliberate
    hue carrier and still ships faded (tile-mean sat measured, target <=0.30,
    everything else <=0.22); sage colourway held under the green-detector
    saturation floor because DEAD VALLEY tolerates grey-green fabric dye,
    never living green.
  8/2 STAMP BUG: every repeating family ships 2-3 variants; periodic modules
    sit on 44's divisor grid (mullion pitch 11, mesh pitch 4, stripe pitch
    11, rib pitch 22).
  VERIFY ON THE REAL SURFACE: 3x3 tilings per family, an assembled 14-unit
    shop run (intact + boarded + grille + shutter + ONE smashed entrance +
    pilasters + awnings + sign bands over approved block/stucco walls, walk
    and road in front), and an anchor composite beside wall_window,
    wall_boarded, the door clips and civic_storefront — PNGs for eyes, not
    just numbers.

Deterministic: SEED fixed, rerunnable.
Writes ONLY:
  banks/tileforms/TF-ART-008_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-008/*.png
"""

import json, base64, io, os, colorsys, random

from PIL import Image, ImageDraw
import numpy as np

SEED = 80808
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-008_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-008')

BAND_TOP, GLASS_TOP, GLASS_BOT, BASE_RAIL, SILL = 13, 15, 36, 37, 38
MULLS = [7, 18, 29, 40]                     # bright col; shadow col is +1

# ---------------------------------------------------------------- bank openers
def load_civic():
    """REUSE in code: the 8/3 civic openings bank — civic_storefront is the
    do-not-cook plain glazed bay, byte-copied wherever an intact pane shows."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_CIVIC_OPENINGS_8_3_26.txt')))
    assert d['status'] == 'PENDING PAOLO', d['status']
    out = {}
    for t in d['tiles']:
        out[t['id']] = np.asarray(Image.open(io.BytesIO(base64.b64decode(t['b64'])))
                                  .convert('RGBA')).astype(np.float64)
    assert 'civic_storefront' in out and 'civic_parapet' in out
    return out

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
    """REUSE in code: frozen approved starter tiles (donors + anchors)."""
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
    """Shopping sweep honoured in code: pools checked, nothing fit."""
    ext = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')))
    assert set(ext['counts']) == {'street', 'wreck', 'trash', 'crate', 'dead',
                                  'barrier', 'camp'}, ext['counts']
    op = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_OPENINGS_8_2_26.txt')))
    ids = {t['id'] for t in op['tiles']}
    assert not any('storefront' in i for i in ids), ids   # residential only
    hd = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_HD_TYPE_SEED_7_10_26.txt')))
    packs = {k.split('|')[1] for k in hd['seeds']}
    cafe = [p for p in packs if 'awning' in p.lower() or 'storefront' in p.lower()]
    assert cafe == ['Exterior Cafe Props (awnings, windows, potted plants and more)'], cafe
    # the one bought awning pack was OPENED AND LOOKED AT (see REUSE CHECK):
    # ineligible — machine-check: zero rows in the confirmed set = no UP
    # verdict exists to harvest under (the HD law is UP tiles only).
    conf = json.load(open(os.path.join(ROOT, 'banks',
                                       'BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))
    assert not any(x['pack'] == cafe[0] for x in conf['verdicts']), \
        'cafe pack has verdicts now — re-run the reuse sweep before cooking'

# ---------------------------------------------------------------- helpers
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]

def desat(px, amt):
    g = lum(px)[..., None]
    return np.clip(px + amt * (g - px), 0, 255)

def torus_noise(rg, k=5, passes=2, shape=(CELL, CELL)):
    n = rg.standard_normal(shape)
    for _ in range(passes):
        for ax in (0, 1):
            m = np.zeros_like(n)
            for d in range(-(k // 2), k // 2 + 1):
                m += np.roll(n, d, axis=ax)
            n = m / k
    return (n - n.min()) / (n.max() - n.min() + 1e-9)

def quantize_to(pal, px):
    d = ((pal[None, :, :] - px[:, None, :]) ** 2).sum(axis=2)
    return pal[d.argmin(axis=1)]

def new_tile(h=CELL, w=CELL):
    return np.zeros((h, w, 4), np.float64)

def put_rgb(t, ys, xs, rgb):
    t[ys, xs, :3] = rgb
    t[ys, xs, 3] = 255

def over(bg, ov):
    """Composite RGBA overlay onto RGB background."""
    a = (ov[..., 3:4] / 255.0)
    return bg * (1 - a) + ov[..., :3] * a

# ---------------------------------------------------------------- harvest prep
def glass_sampler(CS):
    """The civic bay's own glass pixel population (dead dark, filthy)."""
    band = CS[GLASS_TOP:GLASS_BOT + 1]
    L = lum(band[..., :3])
    px = band[..., :3][(band[..., 3] > 128) & (L < 70)]
    px = px[np.argsort(lum(px))]
    return px

def fill_glass(rng, rg, h, w, glass_px, dark=1.0, sill_dust=False):
    """Pane fill drawn FROM the civic glass population: torus-smoothed rank
    field indexes the donor's own sorted pixels — same palette, same filth."""
    g = torus_noise(rg, 3, 2, (h, w)) * 0.72 + rg.random((h, w)) * 0.28
    if sill_dust:                       # dustier toward the sill (bottom rows)
        g += np.linspace(0, 0.35, h)[:, None]
    g = np.clip(g / max(g.max(), 1e-9), 0, 1)
    idx = (g * (len(glass_px) - 1)).astype(int)
    out = glass_px[idx] * dark
    return np.clip(out, 16, 255)

def draw_mullions(t, y0, y1, CS):
    """Posts byte-sampled from civic_storefront's own post columns."""
    for mx in MULLS:
        n = y1 - y0
        src_b = CS[GLASS_TOP:GLASS_BOT + 1, mx, :3]
        src_s = CS[GLASS_TOP:GLASS_BOT + 1, mx + 1, :3]
        ii = (np.linspace(0, len(src_b) - 1, n)).astype(int)
        put_rgb(t, slice(y0, y1), mx, src_b[ii])
        put_rgb(t, slice(y0, y1), mx + 1, src_s[ii])

# ---------------------------------------------------------------- members
def cook_transom(CS, k):
    """Transom band: a RE-SLICE of civic_storefront's own rows — head rail,
    8 of its glass rows, base rail. Zero new pixels; variant = 11px roll of
    the glass rows (post pitch preserved: 11 divides 44)."""
    rows = np.concatenate([CS[13:15], CS[15:23], CS[37:39]], axis=0).copy()
    if k:
        rows[2:10] = np.roll(rows[2:10], 11 * k, axis=1)
    t = new_tile()
    t[0:12] = rows
    return t

def cook_boarded(CS, wb, seed):
    """Boarded bay: civic frame kept (head/base rails, byte-copied), panes and
    posts covered by plywood in the APPROVED wall_boarded language — the fill
    is the donor's own plank/gap rows re-tiled commercial-width, quantized to
    the donor palette (zero new colours in the boarding)."""
    rng = random.Random(SEED + seed)
    reg = wb[12:32, 10:34]                       # the approved board region
    pal = np.unique(reg.reshape(-1, 3).astype(np.uint8), axis=0).astype(np.float64)
    Lr = lum(reg)
    plank_rows = [reg[y] for y in range(reg.shape[0]) if Lr[y].mean() > 60]
    gap_rows = [reg[y] for y in range(reg.shape[0]) if Lr[y].mean() <= 40]
    t = new_tile()
    t[BAND_TOP:SILL + 1] = CS[BAND_TOP:SILL + 1]          # frame verbatim
    y = GLASS_TOP
    while y <= GLASS_BOT:
        kind = plank_rows if (y - GLASS_TOP) % 6 < 4 else gap_rows
        src = kind[rng.randrange(len(kind))]
        # PERIODIC AT 22 (a divisor of 44): drop 2 donor columns, tile x2 —
        # the row wraps exactly, so a boarded|boarded seam is just another
        # plank break, not a cut line (v1 measured junction 32.7 vs 16.5)
        keep = sorted(rng.sample(range(1, 23), 22))
        sq = src[keep]
        row = np.concatenate([sq, sq]).copy()
        row = np.roll(row, rng.randrange(CELL), axis=0)
        put_rgb(t, y, slice(0, CELL), quantize_to(pal, row))
        y += 1
    return t

def jamb(t, x0, bright, shadow, y0, y1):
    put_rgb(t, slice(y0, y1), x0, bright)
    put_rgb(t, slice(y0, y1), x0 + 1, shadow)

def shard_teeth(t, rng, glass_px, xs, y_base, up, n, hmax):
    """Glass teeth clinging to a frame edge: pane colour, 1px cool fracture
    edge that catches the upper-left light."""
    bright = np.array([148., 152., 158.])
    for _ in range(n):
        x = rng.choice(xs)
        h = rng.randrange(2, hmax)
        for i in range(h):
            y = y_base + (i if up < 0 else -i) * -up
            w = max(1, int(round((h - i) / h * 2)))
            for dx in range(w):
                if 0 <= y < t.shape[0] and 0 <= x + dx < CELL:
                    put_rgb(t, y, x + dx, glass_px[rng.randrange(len(glass_px) // 3)])
        ytip = y_base + (h - 1) * (1 if up < 0 else -1) * -up * -1
        ytip = min(max(ytip, 0), t.shape[0] - 1)
        put_rgb(t, ytip, x, bright * rng.uniform(0.85, 1.0))

def cook_smashed(CS, walk, glass_px, seed):
    """THE PORTAL: 2-tile smashed entrance bay. Frame still holding — header
    and jambs survive with shard teeth at the edges; the interior is genuinely
    dark (deeper than the dead glass, matte, NOT solid — this is the way in);
    threshold strip harvested from the starter walk."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    b_col = CS[GLASS_TOP:GLASS_BOT + 1, MULLS[0], :3].mean(axis=0)
    s_col = CS[GLASS_TOP:GLASS_BOT + 1, MULLS[0] + 1, :3].mean(axis=0)

    def interior(h, y_off=0.0):
        n = torus_noise(rg, 5, 2, (h, CELL))
        base = 17 + 9 * n + y_off
        out = np.stack([base * 0.98, base, base * 1.04], axis=2)
        return np.clip(out, 16, 44)

    top = new_tile()
    top[0] = CS[13]; top[1] = CS[14]                       # header verbatim
    put_rgb(top, slice(2, CELL), slice(0, CELL), interior(42))
    jamb(top, 0, b_col * 0.94, s_col, 2, CELL)
    jamb(top, 42, b_col * 0.88, s_col * 0.9, 2, CELL)
    shard_teeth(top, rng, glass_px, list(range(3, 40, 4)), 2, -1, 5, 7)

    bot = new_tile()
    floor_hint = np.linspace(0, 7, 39)[:, None]
    put_rgb(bot, slice(0, 39), slice(0, CELL), interior(39, 0) + floor_hint[..., None] * 0)
    bot[0:39, :, :3] += floor_hint[..., None] * 0.9        # faint floor light
    jamb(bot, 0, b_col * 0.94, s_col, 0, 41)
    jamb(bot, 42, b_col * 0.88, s_col * 0.9, 0, 41)
    thr = np.concatenate([walk, walk])[:, :CELL]
    for i, y in enumerate(range(41, 44)):
        put_rgb(bot, y, slice(0, CELL), thr[10 + i, :CELL] * 0.82)
    put_rgb(bot, 40, slice(0, CELL), thr[9, :CELL] * 0.6)  # step shadow
    shard_teeth(bot, rng, glass_px, list(range(3, 40, 5)), 39, 1, 6, 6)
    for _ in range(10):                                    # sill debris glints
        x, y = rng.randrange(2, 42), rng.randrange(39, 43)
        c = rng.uniform(0.5, 1.0)
        put_rgb(bot, y, x, np.array([138., 142., 148.]) * c
                if rng.random() < 0.5 else np.array([30., 30., 32.]))
    return top, bot

def cook_grille(CS, alu, seed, jam_y, skew):
    """Half-down/jammed security grille OVER the verbatim civic bay: diamond
    mesh (pitch 4 — divisor of 44, wraps), one side jammed lower, bottom bar
    dented. Glass behind stays the bank's own pixels."""
    rng = random.Random(SEED + seed)
    t = CS.copy()
    mesh_c = alu * 0.78
    for y in range(GLASS_TOP, CELL):
        for x in range(CELL):
            yj = jam_y + (skew * x) // CELL
            if y > yj:
                continue
            if (x + y) % 4 == 0 or (x - y) % 4 == 0:
                a = 0.62 if t[y, x, 3] > 128 else 0.0
                if a:
                    t[y, x, :3] = t[y, x, :3] * (1 - a) + mesh_c * a
    for x in range(CELL):                                  # bottom bar, dented
        yj = jam_y + (skew * x) // CELL
        dent = 1 if 14 <= x <= 22 and skew else 0
        for dy in (0, 1):
            y = min(yj + dy + dent, CELL - 1)
            if t[y, x, 3] > 128:
                sh = 0.72 if (dy == 1 or dent) else 1.02
                t[y, x, :3] = alu * sh
    return t

def cook_shutter(CS, alu, terra, seed):
    """Roll-down shutter fully down, dented: housing box, slats at 3px pitch,
    guide rails at both edges (the seam reads as the unit joint), chalked
    aluminium off the storefront_alum ramp, rust weeping from the dents."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = new_tile()
    wob = rg.normal(0, 0.03, (CELL, CELL, 1))
    put_rgb(t, 13, slice(0, CELL), alu * 1.28)             # housing top, sky-lit
    put_rgb(t, 14, slice(0, CELL), alu * 0.98)
    put_rgb(t, 15, slice(0, CELL), alu * 0.74)             # housing underside
    for y in range(16, 36):
        ph = (y - 16) % 3
        sh = (1.16, 0.90, 0.70)[ph]                        # slat: lit lip, face, groove
        put_rgb(t, y, slice(0, CELL), alu * sh)
    put_rgb(t, 36, slice(0, CELL), alu * 0.64)
    put_rgb(t, 37, slice(0, CELL), alu * 1.0)              # bottom rail
    put_rgb(t, 38, slice(0, CELL), alu * 0.58)
    body = t[13:39, :, :3]
    body *= (1 + wob[13:39])
    dents = [(rng.randrange(6, 38), rng.randrange(20, 33),
              rng.randrange(3, 6)) for _ in range(rng.randrange(2, 4))]
    for cx, cy, r in dents:
        for y in range(cy - r, cy + r + 1):
            for x in range(cx - r, cx + r + 1):
                d2 = ((x - cx) / (r + 1.2)) ** 2 + ((y - cy) / r) ** 2
                if d2 <= 1 and 13 <= y <= 38 and 0 <= x < CELL:
                    f = 0.70 + 0.24 * d2
                    t[y, x, :3] *= f
        # crease rim below the dent catches the light (dent reads pushed IN)
        yr = cy + r
        if 13 <= yr <= 38:
            for x in range(max(cx - r + 1, 0), min(cx + r, CELL)):
                t[yr, x, :3] = np.clip(t[yr, x, :3] * 1.3, 0, 255)
        rl = terra[len(terra) // 2]
        y = cy + r
        x = cx + rng.randrange(-1, 2)
        for _ in range(rng.randrange(4, 9)):               # rust weep
            if y >= 39:
                break
            t[y, x, :3] = t[y, x, :3] * 0.55 + rl * 0.45
            y += 1
            x = min(max(x + rng.randrange(-1, 2), 0), CELL - 1)
    for x in (0, 1, 42, 43):                               # guide rails
        sh = 0.84 if x in (0, 42) else 0.68
        t[13:39, x, :3] = (alu * sh) * (1 + wob[13:39, x])
    t[13:39, :, :3] = np.clip(t[13:39, :, :3], 0, 255)
    return t

def cook_signband(stucco_pal, terra, seed, ghost):
    """False-front fascia / sign band: sun-bleached BLANK field off the
    approved stucco palette. ghost=None: blank run tile. Otherwise a
    geometric un-bleached shadow where the sign was + mounting holes and
    weep streaks. NEVER text — Paolo authors all names."""
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    ramp = stucco_pal[np.argsort(lum(stucco_pal))]
    ramp = np.clip(desat(ramp, 0.45) * 1.18 + 14, 0, 236)
    g = torus_noise(rg, 5, 2) * 0.6 + rg.random((CELL, CELL)) * 0.4
    idx = (np.clip(g * 0.5 + 0.45, 0, 1) * (len(ramp) - 1)).astype(int)
    t = new_tile()
    t[..., :3] = ramp[idx]
    t[..., 3] = 255
    t[0, :, :3] = np.clip(t[0, :, :3] * 1.16, 0, 245)      # raised band, top lit
    t[1, :, :3] = np.clip(t[1, :, :3] * 1.08, 0, 245)
    t[42, :, :3] *= 0.86
    t[43, :, :3] *= 0.72                                   # bottom reveal shadow
    if ghost:
        x0, y0, x1, y1 = ghost
        gh = t[y0:y1, x0:x1, :3]
        t[y0:y1, x0:x1, :3] = np.clip(desat(gh, -0.26) * 0.78, 0, 255)
        t[y0, x0:x1, :3] *= 0.88                           # sign shadow top edge
        holes = [(x0 + 2, y0 + 2), (x1 - 3, y0 + 2), (x0 + 2, y1 - 3),
                 (x1 - 3, y1 - 3)]
        for hx, hy in holes:
            put_rgb(t, hy, hx, np.array([44., 41., 38.]))
            wy, wx = hy + 1, hx
            for _ in range(rng.randrange(3, 7)):           # weep streak
                if wy >= CELL:
                    break
                t[wy, wx, :3] = t[wy, wx, :3] * 0.72 + terra[2] * 0.10
                wy += 1
    return np.clip(t, 0, 255)

def cook_pilaster(blocks, seed):
    """Party-wall pilaster: one full-height masonry pier between shop units,
    approved block_grey donor columns (circular rolls keep the vertical wrap),
    lit left arris, dark return sliver right (45 law)."""
    rng = random.Random(SEED + seed)
    donor = blocks[seed % len(blocks)]
    t = new_tile()
    x = 0
    while x < CELL:
        d = blocks[rng.randrange(len(blocks))]
        run = min(rng.randrange(4, 9), CELL - x)
        sx = rng.randrange(CELL - run + 1)
        roll = rng.randrange(CELL)
        for k in range(run):
            col = np.roll(d[:, sx + k], roll, axis=0)
            put_rgb(t, slice(0, CELL), x + k, col)
        x += run
    t[:, :, :3] *= 0.84                                    # pier PROUD of the wall:
    t[:, 0, :3] = np.clip(t[:, 0, :3] * 1.32, 0, 255)      # darker face + hard lit
    t[:, 1, :3] = np.clip(t[:, 1, :3] * 1.16, 0, 255)      # left arris separates it
    t[:, 41, :3] *= 0.80
    t[:, 42, :3] *= 0.58                                   # return sliver
    t[:, 43, :3] *= 0.44
    rg = np.random.default_rng(SEED + seed)
    streak = torus_noise(rg, 3, 1, (CELL, CELL))
    m = streak > 0.66
    t[..., :3][m] *= 0.84                                  # weather staining
    return np.clip(t, 0, 255)

def cook_post(CS, alu, side):
    """Heavy mullion post overlay for a bay junction: full-height storefront
    post at the tile edge, lit face left of shadow (the civic convention)."""
    t = new_tile()
    b_col = CS[GLASS_TOP:GLASS_BOT + 1, MULLS[0], :3]
    s_col = CS[GLASS_TOP:GLASS_BOT + 1, MULLS[0] + 1, :3]
    n = SILL + 1 - BAND_TOP
    ii = np.linspace(0, len(b_col) - 1, n).astype(int)
    xs = (0, 1, 2, 3) if side == 'l' else (40, 41, 42, 43)
    put_rgb(t, slice(BAND_TOP, SILL + 1), xs[0], b_col[ii] * 1.05)
    put_rgb(t, slice(BAND_TOP, SILL + 1), xs[1], b_col[ii] * 0.96)
    put_rgb(t, slice(BAND_TOP, SILL + 1), xs[2], s_col[ii])
    put_rgb(t, slice(BAND_TOP, SILL + 1), xs[3], s_col[ii] * 0.9)
    return t

def cook_end(CS, alu, side):
    """Run end post: the heavy post plus the dark return sliver the 45 view
    exposes where the street wall stops (ends double as the corner carriers)."""
    t = cook_post(CS, alu, side)
    edge = 0 if side == 'l' else 43
    inner = 1 if side == 'l' else 42
    t[BAND_TOP:SILL + 1, edge, :3] = alu * 0.42            # return sliver
    t[BAND_TOP:SILL + 1, inner, :3] = alu * (1.12 if side == 'l' else 0.7)
    return t

def cook_awning(alu, fabric_fn, seed, shred):
    """Dead awning, 1 cell wide x 2 cells projecting (overhead layer): frame
    bar at the wall, ribs at 22px pitch (divisor — a run of awnings seams at
    the ribs), sun-shredded fabric hanging off the surviving frame. Sky-lit
    top surface, sag bands bowing toward the viewer (45 law), bleached
    hardest at the street edge. No baked cast shadow (the shadow pass owns
    it)."""
    H = CELL * 2
    rng = random.Random(SEED + seed)
    rg = np.random.default_rng(SEED + seed)
    t = new_tile(H, CELL)
    edge_row = 60 + rng.randrange(-2, 3)                   # front frame bar row
    val_end = edge_row + 7                                 # valance hangs to here
    surv = torus_noise(rg, 5, 2, (H, CELL))
    for y in range(3, val_end + 1):
        for x in range(CELL):
            span_x = x % 22
            tt = span_x / 21.0
            sag = 3.0 * np.sin(np.pi * tt)                 # bows toward viewer
            yy = y - sag
            slope = y / edge_row
            if y <= edge_row:
                # sun-shredded: fabric dies from mid-slope outward, HEAVILY —
                # the frame is what survives thirty years, not the canvas
                die = (y - 14) / max(edge_row - 14, 1)
                if die > 0 and surv[y, x] < die * (0.62 + 0.14 * shred):
                    continue
                base = fabric_fn(yy, x)
                band = 1.0 - 0.11 * (0.5 + 0.5 * np.sin(2 * np.pi * yy / 8.0))
                mid = 1.0 - 0.12 * np.sin(np.pi * tt)      # dips darker mid-span
                lit = 1.14 - 0.34 * slope                  # sky-lit top: bright at
                c = np.array(base) * band * mid * lit      # the wall, dim at edge
                c = desat(c[None, :], 0.12 + 0.34 * slope)[0]
            else:
                # valance: the hanging front skirt, in its own shade
                keep = surv[y, x] > 0.30 + (y - edge_row) * 0.11 + 0.06 * shred
                if not keep:
                    continue
                c = desat(np.array(fabric_fn(y, x)) * 0.68, 0.3)[0]
            put_rgb(t, y, x, np.clip(c * 0.94, 0, 226))
    # hanging shredded strips below whatever survives
    for _ in range(7 + shred * 4):
        x = rng.randrange(1, CELL - 1)
        y = edge_row + rng.randrange(-10, 4)
        ln = rng.randrange(5, 14)
        for i in range(ln):
            if y + i > min(val_end + 10, H - 1):
                break
            if t[y + i, x, 3] == 0:
                c = np.clip(desat(np.array([fabric_fn(y + i, x)]), 0.4)[0]
                            * (0.72 - 0.025 * i), 0, 200)
                put_rgb(t, y + i, x, c)
    # frame: wall bar, ribs and the FRONT BAR survive where fabric is gone
    put_rgb(t, 0, slice(0, CELL), alu * 1.15)
    put_rgb(t, 1, slice(0, CELL), alu * 0.95)
    put_rgb(t, 2, slice(0, CELL), alu * 0.78)
    for xr in (0, 21, 43):
        for y in range(3, edge_row + 1):
            bare = t[y, xr, 3] == 0
            put_rgb(t, y, xr, alu * (1.04 if bare else 0.9) * (1 - 0.20 * (y / H)))
            if xr + 1 < CELL and t[y, xr + 1, 3] > 0:
                t[y, xr + 1, :3] *= 0.88                   # rib shadow (light UL)
    for x in range(CELL):                                  # front bar, full width
        bare = t[edge_row, x, 3] == 0 or t[max(edge_row - 1, 0), x, 3] == 0
        put_rgb(t, edge_row, x, alu * (0.92 if bare else 0.8))
        if t[edge_row + 1, x, 3] == 0:
            put_rgb(t, edge_row + 1, x, alu * 0.55)        # bar underside
    return np.clip(t, 0, 255)

# ---------------------------------------------------------------- metrics
def measure(tile):
    a = tile.astype(np.float64)
    if a.shape[2] == 4:
        m = a[..., 3] > 8
        px = a[..., :3][m]
        af = float(m.mean())
    else:
        px = a[..., :3].reshape(-1, 3)
        af = 1.0
    if len(px) == 0:
        return dict(empty=True)
    L = lum(px)
    colours = len(np.unique(px.astype(np.uint8), axis=0))
    if a.shape[2] == 4:
        La = np.where(a[..., 3] > 8, lum(a[..., :3]), np.nan)
    else:
        La = lum(a[..., :3])
    d = np.abs(np.diff(La, axis=1))
    d = d[~np.isnan(d)]
    edge = float(d.mean()) if len(d) else 0.0
    grain = float((d > 8).mean() * 100) if len(d) else 0.0
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
                lum_sd=round(float(L.std()), 3),
                purple_pct=round(purple, 3), green_pct=round(green, 3),
                hot_yellow_frac=round(hot, 5), near_black_frac=round(black, 4),
                alpha_frac=round(af, 3))

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
    mode = 'RGBA' if arr.shape[2] == 4 else 'RGB'
    im = Image.fromarray(arr.astype(np.uint8), mode)
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()

def save(arr, name, scale=1):
    mode = 'RGBA' if arr.shape[2] == 4 else 'RGB'
    im = Image.fromarray(arr.astype(np.uint8), mode)
    if scale > 1:
        im = im.resize((im.width * scale, im.height * scale), Image.NEAREST)
    im.save(os.path.join(PROOF_DIR, name))

def grid(rows):
    return np.concatenate([np.concatenate(r, axis=1) for r in rows], axis=0)

def labeled_sheet(entries, cols, scale=3, pad=8, label_h=14, bg=(24, 24, 28)):
    cw = CELL * scale + pad
    hmax = max(e[1].shape[0] for e in entries)
    chh = hmax * scale + label_h + pad
    rows = (len(entries) + cols - 1) // cols
    im = Image.new('RGB', (cols * cw + pad, rows * chh + pad), bg)
    dr = ImageDraw.Draw(im)
    for i, (lab, a) in enumerate(entries):
        x = pad + (i % cols) * cw
        y = pad + (i // cols) * chh
        mode = 'RGBA' if a.shape[2] == 4 else 'RGB'
        t = Image.fromarray(a.astype(np.uint8), mode).resize(
            (a.shape[1] * scale, a.shape[0] * scale), Image.NEAREST)
        if mode == 'RGBA':
            im.paste(t, (x, y), t)
        else:
            im.paste(t, (x, y))
        dr.text((x, y + a.shape[0] * scale + 2), lab[:22], fill=(225, 225, 225))
    return im

# ---------------------------------------------------------------- main
def main():
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)
    assert_pools_checked()

    civ = load_civic()
    CS = civ['civic_storefront']
    tm = load_texture_match({'storefront_alum', 'block_grey', 'stucco_tan',
                             'stucco_bone', 'roof_tile_terra'})
    for i in range(3):
        assert tm[f'block_grey_{i}'][1].startswith('APPROVED')
        assert tm[f'stucco_tan_{i}'][1].startswith('APPROVED')
        assert tm[f'stucco_bone_{i}'][1].startswith('APPROVED')
        assert tm[f'roof_tile_terra_{i}'][1].startswith('APPROVED')
    alum_tiles = [tm[f'storefront_alum_{i}'][0] for i in range(3)]
    apx = np.concatenate([a.reshape(-1, 3) for a in alum_tiles])
    alu = apx[lum(apx) > 85].mean(axis=0)                  # chalked anodised grey
    blocks = [tm[f'block_grey_{i}'][0] for i in range(3)]
    stucco_pal = np.unique(np.concatenate(
        [tm[f'stucco_tan_{i}'][0].reshape(-1, 3) for i in range(3)] +
        [tm[f'stucco_bone_{i}'][0].reshape(-1, 3) for i in range(3)]
    ).astype(np.uint8), axis=0).astype(np.float64)
    terra_pal = np.unique(np.concatenate(
        [tm[f'roof_tile_terra_{i}'][0].reshape(-1, 3) for i in range(3)]
    ).astype(np.uint8), axis=0).astype(np.float64)
    terra = desat(terra_pal[np.argsort(lum(terra_pal))], 0.3)

    st = load_starter(['wall_0', 'wall_window', 'wall_boarded', 'walk_0',
                       'walk_1', 'walk_2', 'walk_kerb', 'road_0',
                       'door_top', 'door_bottom'])
    ww_dark = st['wall_window'][lum(st['wall_window']) < 60]
    assert 20 <= ww_dark.mean() <= 40, 'wall_window dead-dark family moved'
    glass_px = glass_sampler(CS)
    assert abs(float(lum(glass_px).mean()) - 21.1) < 6, 'civic glass moved'

    tiles, sheets = [], {}

    def add(name, arr, kind, harvested, layer='structure', extra=None):
        m = measure(arr)
        e = dict(name=name, px=CELL, b64=png_b64(arr), metrics=m, kind=kind,
                 harvested_from=harvested, layer=layer)
        if arr.shape[0] != CELL:
            e['cells'] = [1, arr.shape[0] // CELL]
        if extra:
            e.update(extra)
        tiles.append(e)
        sheets[name] = arr

    # ---- transom band (pure re-slice of the civic bay)
    transoms = [cook_transom(CS, k) for k in range(2)]
    for k, t in enumerate(transoms):
        add(f'sf_transom_{k}', t, 'transom band above the storefront head',
            'civic_storefront rows 13-14/15-22/37-38 byte-copied (re-slice, '
            'zero new pixels); variant is an 11px roll (post pitch preserved)')

    # ---- tall bay convenience composite (transom + verbatim civic bay)
    tall = []
    for k in range(2):
        t = new_tile()
        t[0:12] = transoms[k][0:12]
        t[BAND_TOP:] = CS[BAND_TOP:]
        assert np.array_equal(t[BAND_TOP:], CS[BAND_TOP:]), 'civic bay not verbatim'
        tall.append(t)
        add(f'sf_bay_tall_{k}', t, 'full-height bay: transom over the INTACT civic bay',
            'civic_storefront VERBATIM (asserted byte-equal) + the transom re-slice')

    # ---- boarded bays
    boarded = [cook_boarded(CS, st['wall_boarded'], 10 + i) for i in range(3)]
    for i, t in enumerate(boarded):
        add(f'sf_boarded_{i}', t, 'boarded bay, approved plywood language commercial-width',
            'frame: civic_storefront verbatim; boards: wall_boarded plank/gap rows '
            're-tiled + quantized to the donor palette (zero new board colours)')

    # ---- smashed entrance bay (THE PORTAL, 2 tiles)
    smashed = [cook_smashed(CS, st[f'walk_{i}'], glass_px, 30 + i) for i in range(2)]
    for i, (tp, bt) in enumerate(smashed):
        add(f'sf_smashed_top_{i}', tp, 'blown-out entrance bay, upper tile (portal)',
            'header/jambs from civic_storefront columns; shards from its glass '
            'population; interior painted darker than the dead glass',
            extra=dict(solid=False, enter=True))
        add(f'sf_smashed_bot_{i}', bt, 'blown-out entrance bay, lower tile (portal)',
            'jambs from civic_storefront; threshold from starter walk; interior dark',
            extra=dict(solid=False, enter=True))

    # ---- security grille, half-down / jammed
    grilles = [cook_grille(CS, alu, 50, 25, 0), cook_grille(CS, alu, 51, 29, 3)]
    for i, t in enumerate(grilles):
        add(f'sf_grille_half_{i}', t, 'security grille half-down (variant 1 jammed skew)',
            'base: civic_storefront VERBATIM below the mesh; mesh/bar: '
            'storefront_alum aluminium ramp')

    # ---- roll-down shutter, down and dented
    shutters = [cook_shutter(CS, alu, terra, 60 + i) for i in range(2)]
    for i, t in enumerate(shutters):
        add(f'sf_shutter_down_{i}', t, 'roll-down shutter down, dented, rust weeps',
            'aluminium: storefront_alum ramp; rust: roof_tile_terra palette desaturated')

    # ---- sign band: blank + ghosts
    ghosts = [None, None, (6, 12, 30, 34), (14, 10, 40, 30), (4, 14, 24, 30)]
    for i, gh in enumerate(ghosts):
        nm = f'sf_signband_blank_{i}' if gh is None else f'sf_signband_ghost_{i - 2}'
        add(nm, cook_signband(stucco_pal, terra, 70 + i, gh),
            'false-front fascia, sun-bleached BLANK' if gh is None else
            'fascia with sign GHOST (geometric shadow + mounting holes, no text ever)',
            'field: approved stucco_tan/bone palette bleached in code; '
            'weeps: roof_tile_terra')

    # ---- party-wall pilaster
    pilasters = [cook_pilaster(blocks, 80 + i) for i in range(2)]
    for i, t in enumerate(pilasters):
        add(f'sf_pilaster_{i}', t, 'party-wall pilaster between shop units (full height)',
            'block_grey donor columns (approved), circular rolls keep vertical wrap')

    # ---- posts and ends
    add('sf_mullion_post_l', cook_post(CS, alu, 'l'), 'heavy junction post, left edge',
        'civic_storefront post columns + storefront_alum ramp')
    add('sf_mullion_post_r', cook_post(CS, alu, 'r'), 'heavy junction post, right edge',
        'civic_storefront post columns + storefront_alum ramp')
    add('sf_end_l', cook_end(CS, alu, 'l'), 'run end post + dark return sliver (corner carrier)',
        'civic_storefront post columns + storefront_alum ramp')
    add('sf_end_r', cook_end(CS, alu, 'r'), 'run end post + dark return sliver (corner carrier)',
        'civic_storefront post columns + storefront_alum ramp')

    # ---- dead awnings: 4 faded colourways x 2 shred levels (overhead)
    terra_mid = np.clip(desat(terra_pal[np.argsort(lum(terra_pal))], 0.42) * 1.24, 0, 236)
    t_lo, t_hi = terra_mid[len(terra_mid) // 4], terra_mid[3 * len(terra_mid) // 4]
    rgA = np.random.default_rng(SEED + 777)
    jitter = rgA.normal(0, 0.035, (CELL * 2 + 4, CELL))

    def jit(y, x):
        return 1.0 + jitter[int(y) % (CELL * 2), x % CELL]

    def fab_rust(y, x):
        f = 0.5 + 0.5 * np.sin(0.13 * x + 0.9)
        return (t_lo * f + t_hi * (1 - f)) * jit(y, x)

    def fab_teal(y, x):
        return np.array([88., 108., 106.]) * jit(y, x)

    def fab_sand_stripe(y, x):
        s = (x // 11) % 2
        return (np.array([174., 162., 142.]) if s else np.array([128., 116., 98.])) * jit(y, x)

    def fab_sage(y, x):
        return np.array([116., 121., 100.]) * jit(y, x)

    fabs = [('rust', fab_rust), ('teal', fab_teal),
            ('sand_stripe', fab_sand_stripe), ('sage', fab_sage)]
    awnings = {}
    for ci, (cn, fn) in enumerate(fabs):
        for sh in range(2):
            t = cook_awning(alu, fn, 90 + ci * 10 + sh, sh)
            awnings[f'{cn}_{sh}'] = t
            add(f'sf_awning_{cn}_{sh}', t,
                f'dead awning, faded {cn}, shred {sh} (projects 2 cells over the walk)',
                'frame: storefront_alum ramp; rust colourway: roof_tile_terra '
                'palette desaturated; other fabrics painted, bleached toward grey',
                layer='overhead')

    # ---------------------------------------------------------------- seams
    wallbg = blocks[0]
    def comp_run(ov_list):
        return [over(wallbg, o) if o.shape[2] == 4 else o for o in ov_list]

    seam = {}
    seam['civic_bay_baseline_6run'] = run_seam(comp_run([CS] * 6))
    seam['bay_tall_6run'] = run_seam(comp_run([tall[k % 2] for k in range(6)]))
    seam['boarded_6run_same'] = run_seam(comp_run([boarded[0]] * 6))
    seam['boarded_6run_mixed_info'] = run_seam(comp_run([boarded[k % 3] for k in range(6)]))
    seam['grille_6run_same'] = run_seam(comp_run([grilles[0]] * 6))
    seam['grille_6run_mixed_info'] = run_seam(comp_run([grilles[k % 2] for k in range(6)]))
    seam['shutter_6run'] = run_seam(comp_run([shutters[k % 2] for k in range(6)]))
    seam['transom_6run'] = run_seam(comp_run([transoms[k % 2] for k in range(6)]))
    seam['signband_6run'] = run_seam(
        [sheets[n] [..., :3] * (sheets[n][..., 3:4] / 255) +
         wallbg * (1 - sheets[n][..., 3:4] / 255)
         for n in ('sf_signband_blank_0', 'sf_signband_blank_1',
                   'sf_signband_ghost_0', 'sf_signband_blank_0',
                   'sf_signband_ghost_1', 'sf_signband_blank_1')])
    walkbg = np.concatenate([st['walk_0'], st['walk_1']], axis=0)
    seam['awning_pair'] = run_seam(
        [over(walkbg, awnings['rust_0']), over(walkbg, awnings['rust_1'])])
    seam['pilaster_vertical_wrap'] = run_seam(
        [np.swapaxes(over(wallbg, pilasters[0]), 0, 1)] * 3)

    # ---------------------------------------------------------------- proofs
    # (a) 3x3 tiled proofs per family, composited on the approved block wall
    fam3 = {
        'bay_tall': [tall[k % 2] for k in range(3)],
        'boarded': boarded,
        'grille': [grilles[k % 2] for k in range(3)],
        'shutter': [shutters[k % 2] for k in range(3)],
        'transom': [transoms[k % 2] for k in range(3)],
        'signband': [sheets['sf_signband_blank_0'], sheets['sf_signband_ghost_0'],
                     sheets['sf_signband_blank_1']],
        'pilaster': [pilasters[k % 2] for k in range(3)],
    }
    for fam, arrs in fam3.items():
        rows = [[over(wallbg, arrs[(r + k) % 3]) if arrs[(r + k) % 3].shape[2] == 4
                 else arrs[(r + k) % 3] for k in range(3)] for r in range(3)]
        save(grid(rows), f'TILED_3x3_{fam}.png', 3)
    aw_rows = [[over(walkbg, awnings[f'{cn}_{k % 2}'])[:CELL * 2]
                for k in range(3)] for cn in ('rust', 'sand_stripe', 'sage')]
    save(grid(aw_rows), 'TILED_3x3_awning_on_walk.png', 3)

    # (b) anchor composite — judged as the town main street block face
    door_stack = np.concatenate([st['door_top'], st['door_bottom']], axis=0)
    portal_stack = np.concatenate(
        [over(wallbg, smashed[0][0]), over(wallbg, smashed[0][1])], axis=0)
    comp = [
        ('wall_window ANCHOR', st['wall_window']),
        ('wall_boarded ANCHOR', st['wall_boarded']),
        ('door 2-tile ANCHOR', door_stack),
        ('civic_storefront 8/3', over(wallbg, CS)),
        ('storefront_alum ref', alum_tiles[0]),
        ('wall_0 ANCHOR', st['wall_0']),
        ('sf_bay_tall_0', over(wallbg, tall[0])),
        ('sf_boarded_0', over(wallbg, boarded[0])),
        ('PORTAL 2-tile', portal_stack),
        ('sf_grille_half_0', over(wallbg, grilles[0])),
        ('sf_shutter_down_0', over(wallbg, shutters[0])),
        ('sf_transom_0', over(wallbg, transoms[0])),
        ('sf_signband_ghost_0', over(wallbg, sheets['sf_signband_ghost_0'])),
        ('sf_pilaster_0', over(wallbg, pilasters[0])),
        ('sf_end_r', over(over(wallbg, CS), sheets['sf_end_r'])),
        ('awning rust', over(walkbg, awnings['rust_0'])),
        ('awning sand', over(walkbg, awnings['sand_stripe_0'])),
        ('awning sage', over(walkbg, awnings['sage_1'])),
    ]
    labeled_sheet(comp, 6).save(os.path.join(PROOF_DIR, 'ANCHOR_COMPOSITE.png'))

    # (c) contact sheet, every candidate
    labeled_sheet([(t['name'], sheets[t['name']]) for t in tiles], 7, scale=2) \
        .save(os.path.join(PROOF_DIR, 'CONTACT_SHEET_all.png'))

    # (d) the assembled shop run: 14 units of street wall, 3 tiles tall,
    # ONE smashed entrance, walk + kerb + road in front, awnings overhead
    Wn = 16
    cols = ['pilaster', 'bay', 'bay', 'grille0', 'bayA', 'bayA', 'pilaster',
            'boarded0', 'SMASH', 'bay', 'pilaster', 'shutter0', 'shutter1',
            'bayA', 'boarded1', 'pilaster']
    sign_cycle = ['sf_signband_blank_0', 'sf_signband_ghost_0', 'sf_signband_blank_1',
                  'sf_signband_ghost_1', 'sf_signband_blank_0', 'sf_signband_ghost_2']
    H_rows = 7
    canvas = np.zeros((H_rows * CELL, Wn * CELL, 3))
    for cx in range(Wn):
        wall_col = blocks[cx % 3] if cx % 7 else blocks[(cx + 1) % 3]
        canvas[0:CELL, cx * CELL:(cx + 1) * CELL] = over(wall_col, civ['civic_parapet'])
        kind = cols[cx]
        si = 0
        if kind == 'pilaster':
            p = pilasters[cx % 2]
            for r in (1, 2, 3):
                canvas[r * CELL:(r + 1) * CELL, cx * CELL:(cx + 1) * CELL] = over(wall_col, p)
        else:
            canvas[1 * CELL:2 * CELL, cx * CELL:(cx + 1) * CELL] = \
                over(wall_col, sheets[sign_cycle[cx % len(sign_cycle)]])
            if kind == 'SMASH':
                canvas[2 * CELL:3 * CELL, cx * CELL:(cx + 1) * CELL] = \
                    over(wall_col, smashed[0][0])
                canvas[3 * CELL:4 * CELL, cx * CELL:(cx + 1) * CELL] = \
                    over(wall_col, smashed[0][1])
            else:
                canvas[2 * CELL:3 * CELL, cx * CELL:(cx + 1) * CELL] = \
                    over(wall_col, transoms[cx % 2])
                ground = {'bay': CS, 'bayA': CS, 'grille0': grilles[0],
                          'boarded0': boarded[0], 'boarded1': boarded[1],
                          'shutter0': shutters[0], 'shutter1': shutters[1]}[kind]
                canvas[3 * CELL:4 * CELL, cx * CELL:(cx + 1) * CELL] = \
                    over(wall_col, ground)
        canvas[4 * CELL:5 * CELL, cx * CELL:(cx + 1) * CELL] = st[f'walk_{cx % 3}']
        canvas[5 * CELL:6 * CELL, cx * CELL:(cx + 1) * CELL] = st['walk_kerb']
        canvas[6 * CELL:7 * CELL, cx * CELL:(cx + 1) * CELL] = st['road_0']
    # end posts on the outermost bays
    canvas[3 * CELL:4 * CELL, 1 * CELL:2 * CELL] = over(
        canvas[3 * CELL:4 * CELL, 1 * CELL:2 * CELL], sheets['sf_end_l'])
    canvas[3 * CELL:4 * CELL, 14 * CELL:15 * CELL] = over(
        canvas[3 * CELL:4 * CELL, 14 * CELL:15 * CELL], sheets['sf_end_r'])
    # awnings overhead on the 'bayA' columns (project over walk + kerb) —
    # ONE colourway per shop unit, variants alternate along the unit
    unit_cw = {4: 'rust', 5: 'rust', 13: 'sand_stripe'}
    for cx in range(Wn):
        if cols[cx] == 'bayA':
            aw = awnings[f'{unit_cw[cx]}_{cx % 2}']
            reg = canvas[4 * CELL:6 * CELL, cx * CELL:(cx + 1) * CELL]
            canvas[4 * CELL:6 * CELL, cx * CELL:(cx + 1) * CELL] = over(reg, aw)
    save(canvas, 'SHOPRUN_IN_PLACE_2x.png', 2)
    # squint at 1-tile map zoom
    sq = Image.fromarray(canvas.astype(np.uint8), 'RGB').resize((Wn, H_rows), Image.LANCZOS)
    sq = sq.resize((Wn * 16, H_rows * 16), Image.NEAREST)
    sq.save(os.path.join(PROOF_DIR, 'SQUINT_1TILE_shoprun.png'))

    # ---------------------------------------------------------------- bank
    wall_band = (37.5, 167.6)
    band_warn = [t['name'] for t in tiles
                 if not (wall_band[0] - 26 <= t['metrics']['lum_mean'] <= wall_band[1] + 26)]
    bank = {
        'form': 'TF-ART-008',
        'merged_with': 'TF-WORLD-008 (same asset both lanes)',
        'cooked': '2026-08-09',
        'mode': 'MIXED',
        'do_not_cook_honoured': 'the plain glazed bay is civic_storefront '
            '(BOHEMIA_CIVIC_OPENINGS_8_3_26, PENDING PAOLO) — byte-copied, never '
            're-synthesized; sf_bay_tall asserts np.array_equal on the bay region.',
        'geometry': 'band rows 13-38, mullion posts at x=7/18/29/40 (+shadow col), '
            'pitch 11px (divisor of 44) — SELF-SEAMLESS at the mullion pitch, the '
            'seam is a feature. Face 3 tiles tall; the smashed entrance is the door '
            'bay and fills the bottom 2 tiles (door-clip proportion); awning '
            'projects 2 cells (overhead).',
        'residual_decision': 'WORLD-008 names WANG-16; a street-wall face only '
            'connects horizontally, so the run set ships as: interchangeable bays '
            '(run body), sf_end_l/r (ends, carrying the 45-view return sliver — '
            'they double as the corner carriers), heavy junction posts, and the '
            'smashed 2-tile door bay. N/S wang bits do not exist for a vertical '
            'face — same reduction ART-005 recorded for oval lane lines.',
        'act1_glass_law': 'every pane is civic_storefront glass population '
            '(lum ~21) or darker; hot-yellow measured per tile, ceiling 2%.',
        'seam_contract': {'bays': 'SELF-SEAMLESS horizontally at mullion pitch '
                                  '(junction step vs internal step measured, '
                                  'civic bay itself is the baseline)',
                          'measured': seam},
        'value_band_wall_check': {'band_lo_hi': wall_band, 'rule': 'mean within '
                                  'band +/-26', 'out_of_band': band_warn},
        'harvest_sources': [
            'banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt: civic_storefront verbatim '
            '(frames, posts, glass, transom re-slice); civic_parapet display-only',
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt: storefront_alum ramp (PENDING, '
            'named frame reference), block_grey pilaster+backing (APPROVED), '
            'stucco_tan/bone fascia palette (APPROVED), roof_tile_terra rust + red '
            'awning (APPROVED)',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt: wall_boarded '
            'plank rows verbatim, wall_window dead-dark assert, walk threshold, '
            'anchors'],
        'consumers': ['TF-ART-008', 'TF-WORLD-008'],
        'tiles': tiles,
        'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    }
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f)
    print('tiles:', len(tiles))
    print('seams:', json.dumps(seam, indent=1))
    print('wall-band warnings:', band_warn or 'none')
    kills = [(t['name'], t['metrics'].get('purple_pct'), t['metrics'].get('hot_yellow_frac'))
             for t in tiles if t['metrics'].get('purple_pct', 0) > 2.0
             or t['metrics'].get('hot_yellow_frac', 0) > 0.02]
    print('purple/hot kills:', kills or 'none')
    print('green>0:', [(t['name'], t['metrics']['green_pct']) for t in tiles
                       if t['metrics'].get('green_pct', 0) > 0.5] or 'none')
    print('near_black>6%:', [(t['name'], t['metrics']['near_black_frac']) for t in tiles
                             if t['metrics'].get('near_black_frac', 0) > 0.06] or 'none')
    for t in tiles:
        m = t['metrics']
        print(' %-24s lum%6.1f sat %.3f col%5d edge%6.2f hot %.4f blk %.3f' % (
            t['name'], m['lum_mean'], m['sat'], m['colours'], m['edge'],
            m['hot_yellow_frac'], m['near_black_frac']))

if __name__ == '__main__':
    main()
