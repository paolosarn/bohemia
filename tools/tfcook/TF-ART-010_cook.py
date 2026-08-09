#!/usr/bin/env python3
"""TF-ART-010 cook (MERGED with TF-WORLD-006 permanent-way + TF-RUN-002's
coarse-ballast overlap; RUN-002's FINE yard gravel is a separate job) — the
RAIL TRACK BED family, six shapes: (1) running corridor, a fixed 5-slice
stack (shoulder / rail-L / four-foot / rail-R / shoulder), SELF-SEAMLESS
along the running axis on a DECLARED 88px (2-cell) tie phase; (2) yard
ballast plate (continuous bed between tracks — no individual prisms, that is
what makes a yard a yard); (3) points/turnout, SINGLE 5x3 compressed, frozen
mid-throw, carrying exactly the four nameable pieces (switch blade against
stock rail, diverging rails, dark manganese frog, switch stand); (4) grade
crossing, SINGLE 5x3: concrete panels with joints PARALLEL to the rails,
3-4px dark flangeway slots gauge-side of each rail, road humping to top of
rail, alligatored asphalt ring at the panel joints — NO crossing bars, never
a zebra; (5) buffer stop, low wide heavy; (6) lifted-rail alignment (ties +
prism, steel gone).

GEOMETRY LOCKED (all measured, 44px cell, 1px = 1.70cm):
  gauge snapped to 2 cells — rail centrelines on the centres of stack rows 1
  and 3 (y 65.5 and 153.5, 88px apart). Ties 13 x 152px reaching into the
  shoulder cells (y 34-185), 3 per 2 cells = 88px period at declared offsets
  5/34/64 (the canonical 0/29/59 phase-shifted +5 so no tie edge ever lands
  on a cell boundary — the M10 heavy-border failure), 1px jitter on the
  middle tie IS the spec's declared jitter. Rail = 4px crown + 3px shaded
  web on the down-light side + 1px base flare (11px true height). The crown
  is the LIGHTEST value in the family: wheel-polished then rusted a lighter
  orange-tan — MATTE, per-pixel modulated, no specular, nothing gleams. Tie
  plates 21x12px with a rust halo = the ONLY saturated colour. Spikes 1px
  NEVER drawn (orphan pixels). Ballast 2-4px angular clusters, dark granite,
  NOT brown, >=18 lum points off the pale yard gravel (measured: ~60 off
  yard_0). Ties TWO values (silver-grey checked top / creosote-black sides)
  + one grain split each. Cribs silted level with tie tops; shoulders
  slumped/bowed (the slope is what makes it a railway). Value order dark to
  light: tie sides / ballast field / lit shoulder / rail crown.
  CANONICAL ORIENTATION: running axis HORIZONTAL (the railyard lays its
  code-6 lines as rows). The vertical mainline takes the same art through
  the kit's rotate-at-wiring practice (canonical-south law); noted in bank.
  The buffer stop is authored as the stub-end cell of a horizontal track
  (strike face west, toward the oncoming line): its beam spans the 2-cell
  gauge, so the piece is 1x3 cells — the "2 cells" of the spec is the beam's
  own span, and the compression call is NAMED here, not hidden.

DO-NOT-COOK STRIKES HONOURED: no seventh shape (no sun-kinked buckled rail —
[PENDING Paolo]); no motion of any kind on a dead line — static only.
NO road vocabulary anywhere on the bed (the recorded 7/27 error): no lanes,
no kerbs, no medians, and the crossing has flangeway slots, never bars.

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE.
    rail_ballast_0..2 (PENDING PAOLO, in tolerance; the spec NAMES them the
    flat ballast base): rail_ballast_1/2 HARVESTED VERBATIM as yard ballast
    plate members (measured green 0.00%, wrap ratio 0.76-1.24 ~ 1.0);
    rail_ballast_0 HARVESTED WITH TREATMENT — it carries 7.44% LIVING GREEN
    lichen, a DEAD VALLEY violation, so its green pixels are re-hued to
    straw in code (hue -> tan, sat crushed) before banking; the treatment is
    the only change. The corridor/turnout/crossing/buffer ballast fields are
    synthesized FROM the rail_ballast_1/2 pixel population (their palette,
    their density), never from an invented ramp.
    wood_fence_0/1 (PENDING): silver-grey checked plank population HARVESTED
    as the tie TOP face (sun-silvered creosote timber is exactly this wood).
    steel_rusted_0/1 (PENDING): rust pixel ramp sampled (desaturated in
    code) for the rail web/base steel.
    roof_tile_terra_0..2 (APPROVED 8/1): the rust-halo hue carrier at the
    tie plates — the family's only saturated colour comes out of Paolo's own
    approved terracotta, desaturated to world discipline.
    lot_asphalt/freeway_asphalt: checked, not used — the crossing's road
    approaches are STREET pixels and the streets law routes those to the
    harmonized pool, below.
  banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt (APPROVED, REAL_VEGAS
    R2) — OPENED IN CODE, per the STREETS-ARE-THE-HARMONIZED-POOL law (the
    grade crossing's asphalt approaches are roadway): pools.street rows
    HARVESTED VERBATIM into the crossing's approach bands (alligator ring
    and hump shading applied over his pixels); pools.desert HARVESTED
    display-only to flank the prism toe in the anchor proof.
    records/BOHEMIA_WHERE_THE_GOOD_STREET_PIXELS_ARE_7_31_26.md read first.
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (APPROVED 7/28+7/29)
    — OPENED IN CODE. yard_0/1/2: the named judge anchor (the bed must sit
    DARKER and COARSER; measured separation reported) — display + the fence
    line in proofs. dirt: the current all-dirt railyard render for the
    contrast panel + the silt fines tone (wind-blown dirt IS this dirt).
    concrete_0/1: crossing panel pixel population donor. road_0/road_crossing:
    display-only in the anchor sheet (the thing the crossing must NOT read
    as). None of these are re-cooked.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — checked (asserted in code):
    street/wreck/trash/crate/dead/barrier/camp props; no rail member.
  banks/BOHEMIA_PERIMETER_8_2_26.txt — checked: slump-block yard walls only.
  banks/BOHEMIA_OPENINGS_8_2_26.txt + BOHEMIA_CIVIC_OPENINGS_8_3_26.txt —
    checked: wall openings, nothing rail.
  banks/BOHEMIA_HD_TILE_REPO_part1..4 x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26
    — pack list walked via BOHEMIA_HD_TYPE_SEED_7_10_26.txt (294 packs): the
    only 'rail' hits are railings/space-station props, not railway; zero
    rail rows in the 2,604-verdict confirmed set (asserted in code). BOUGHT-
    BEATS-PAINTED satisfied by inspection: nothing bought covers a track.
  VERDICT: mode MIXED — ballast base fields, tie wood, rust hues, crossing
  asphalt and panel concrete are HARVESTED from his banks; painted pixels
  are only the genuine gaps (rail steel geometry, tie assembly, turnout
  ironwork, flangeways, buffer beam, silt fouling).

TASTE CHECK:
  DEAD VALLEY: measured green share reported per tile, rail_ballast_0's
    lichen re-hued to straw; no weeds drawn anywhere on the bed (ballast
    exists to kill plants and thirty years of silt is the wear story).
  NO PURPLE: measured per tile, kill line 2%.
  SAT DISCIPLINE: world sits near 0.19; every ramp is desaturated in code;
    the tie-plate rust halo is the ONLY saturated colour and it is budgeted
    (tile-mean sat measured and reported).
  45 LAW: ground plane with sky-lit tops — the rail is a real section (lit
    crown, shaded web, base flare), the prism shoulder is a bowed lit/shaded
    slope (bands bow along the axis on wrapped low-frequency wobble), tie
    tops are lit faces with creosote-dark sides, the buffer beam carries a
    lit strike edge and a dark down-light edge. Nothing flat side-on.
  NO KEYLINE, NO DITHER: edges are value steps; near-black fraction
    measured per tile against the constitution's 6% ceiling.
  8/2 STAMP BUG: every repeating member ships MULTIPLE VARIANTS (corridor
    x3 pairs, plate x3, lifted x2 pairs); the tie module sits on the 88px
    period (2 cells — 44's divisor arithmetic respected by construction)
    with the phase DECLARED; no hero feature at 44px pitch anywhere.
  QUIETER THAN WHAT STANDS ON IT: contrast lives in the two rail crowns
    (the Factorio lesson the form names); the field is his own bought-tile
    density, no louder.
  VERIFY ON THE REAL SURFACE: 3x3 / continuity / offset-at-88 / assembled
    turnout, crossing, buffer proofs + anchor composite beside yard_0,
    dirt, the all-dirt render and desert at the prism toe, with a freeway
    overpass cell proving the line does not sever — PNGs for eyes.

Deterministic: SEED fixed, rerunnable.
Writes ONLY:
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-010/*.png
"""

import base64
import colorsys
import io
import json
import os

import numpy as np
from PIL import Image, ImageDraw

SEED = 101010
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
PERIOD = 88                      # 2 cells: the declared tie phase
STACK = 5 * CELL                 # the corridor is a fixed 5-slice stack
RAIL_N, RAIL_S = 65.5, 153.5     # rail centrelines: centres of rows 1 and 3
TIE_Y0, TIE_Y1 = 34, 186         # tie span: 152px centred on the stack
TIE_W = 13
TIE_OFFS = (5, 34, 64)           # 0/29/59 phase-shifted +5 (no tie edge on a cell edge)
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-010_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-010')


# ---------------------------------------------------------------- bank openers
def load_texture_match():
    """REUSE in code: rail_ballast base (spec-named), tie wood, rust steel,
    the approved terracotta rust-hue carrier."""
    d = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_TEXTURE_MATCH_8_1_26.txt')))
    want = {'rail_ballast', 'wood_fence', 'steel_rusted', 'roof_tile_terra'}
    out = {}
    for t in d['tiles']:
        if t['material'] in want:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
            out[t['id']] = (np.asarray(im).astype(np.float64), t['verdict'])
    for i in range(3):
        assert f'rail_ballast_{i}' in out, 'spec-named reuse base missing'
        assert out[f'roof_tile_terra_{i}'][1].startswith('APPROVED')
    return out


def load_street_pools():
    """REUSE in code: the harmonized street pool (the streets law) — roadway
    asphalt for the crossing approaches, desert for the prism-toe anchor."""
    d = json.load(open(os.path.join(ROOT, 'banks',
                                    'BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt')))
    dec = lambda b: np.asarray(Image.open(io.BytesIO(base64.b64decode(b)))
                               .convert('RGB')).astype(np.float64)
    return ([dec(b) for b in d['pools']['street'][:6]],
            [dec(b) for b in d['pools']['desert'][:4]])


def load_starter(names):
    """REUSE in code: frozen approved starter tiles (anchors + donors)."""
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


def assert_nothing_bought_covers_rail():
    """Shopping sweep honoured in code: no rail family anywhere bought."""
    ext = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')))
    assert set(ext['counts']) == {'street', 'wreck', 'trash', 'crate', 'dead',
                                  'barrier', 'camp'}, ext['counts']
    hd = json.load(open(os.path.join(ROOT, 'banks', 'BOHEMIA_HD_TYPE_SEED_7_10_26.txt')))
    packs = {k.split('|')[1] for k in hd['seeds']}
    railish = {p for p in packs if 'rail' in p.lower() or 'train' in p.lower()
               or 'track' in p.lower()}
    assert railish <= {'18. Space station props', '6. Cauldrons and brewing stations',
                       'Bridges and railings', 'Stairs, ladders and Railings'}, railish
    conf = json.load(open(os.path.join(ROOT, 'banks',
                                       'BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))
    assert not any('rail' in str(v.get('pack', '')).lower() and
                   'railing' not in str(v.get('pack', '')).lower()
                   for v in conf['verdicts']), \
        'a rail pack has verdicts now — re-run the reuse sweep before cooking'


# ---------------------------------------------------------------- helpers
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def desat(px, amt):
    g = lum(px)[..., None]
    return np.clip(px + amt * (g - px), 0, 255)


def torus_noise(rg, shape, k=5, passes=2):
    """Wrapped smooth noise: periodic in BOTH axes of shape (np.roll wraps),
    so an 88px-wide field is seamless at the 88px tie period by build."""
    n = rg.standard_normal(shape)
    for _ in range(passes):
        for ax in (0, 1):
            m = np.zeros_like(n)
            for d in range(-(k // 2), k // 2 + 1):
                m += np.roll(n, d, axis=ax)
            n = m / k
    return (n - n.min()) / (n.max() - n.min() + 1e-9)


def degreen_to_straw(a):
    """DEAD VALLEY treatment for rail_ballast_0: the lichen dies COMPLETELY.
    v1 only re-hued the green, which left the lichen SHAPES as strobing
    yellow-khaki clumps (seen in the v1 proof, called wrong). v2 INPAINTS:
    every lichen pixel is replaced by a non-green pixel sampled from its own
    wrapped neighbourhood, so the stone texture grows over the shape and
    nothing of the plant survives. Deterministic."""
    out = a.copy()
    h, w, _ = out.shape
    flat = out.reshape(-1, 3) / 255.0
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in flat])
    hue = hsv[:, 0] * 360
    green = ((hue >= 55) & (hue <= 175) & (hsv[:, 1] > 0.14) &
             (hsv[:, 2] > 0.18)).reshape(h, w)
    # dilate one step: lichen edge px are half-green and keep the outline
    gd = green.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            gd |= np.roll(np.roll(green, dy, 0), dx, 1)
    rg = np.random.default_rng(SEED + 41)
    ys, xs = np.where(gd)
    order = np.argsort(lum(out[ys, xs]))          # darkest first (shadow core)
    for i in order:
        y, x = int(ys[i]), int(xs[i])
        for _ in range(40):
            dy, dx = int(rg.integers(-4, 5)), int(rg.integers(-4, 5))
            sy, sx = (y + dy) % h, (x + dx) % w
            if not gd[sy, sx]:
                out[y, x] = out[sy, sx]
                break
        else:
            out[y, x] = np.array([118., 112., 100.])
    return out


# ---------------------------------------------------------------- fields
def ballast_field(rg, h, w, pop, dark=1.0):
    """Ballast synthesized FROM the rail_ballast_1/2 pixel population: a
    wrapped rank field indexes his own sorted pixels (same palette, same
    density), then 2-4px ANGULAR CLUSTERS (never single-pixel noise, never
    countable boulders) with sky-lit top pixels and shaded down-right feet."""
    g = (torus_noise(rg, (h, w), 3, 2) * 0.27 +
         torus_noise(rg, (h, w), 9, 2) * 0.11 + rg.random((h, w)) * 0.64)
    g = (g - g.min()) / (g.max() - g.min() + 1e-9)
    idx = (g * (len(pop) - 1)).astype(int)
    out = pop[idx] * dark
    out = out * (0.88 + 0.24 * rg.random((h, w)))[..., None]  # stone facet jitter
    n_cl = (h * w) // 18
    lo_q, hi_q = pop[:len(pop) // 4], pop[3 * len(pop) // 4:]
    for _ in range(n_cl):
        cy, cx = int(rg.integers(h)), int(rg.integers(w))
        src = lo_q if rg.random() < 0.55 else hi_q
        col = src[int(rg.integers(len(src)))] * dark * rg.uniform(0.94, 1.06)
        size = int(rg.integers(3, 8))
        py, px_ = cy, cx
        pts = []
        for _ in range(size):
            pts.append((py % h, px_ % w))
            py += int(rg.integers(-1, 2))
            px_ += int(rg.integers(-1, 2))
        for j, (yy, xx) in enumerate(pts):
            f = 1.10 if j == 0 else (0.86 if j == len(pts) - 1 else 1.0)
            out[yy, xx] = np.clip(col * f, 0, 255)
    return np.clip(out, 0, 255)


def silt_blend(rg, field, mask_gain, silt_col):
    """Wind-blown fines: blend the field toward the dirt-toned silt where the
    wrapped mask says the sand drifted (cribs level with tie tops)."""
    h, w, _ = field.shape
    m = torus_noise(rg, (h, w), 7, 2)
    m = np.clip((m - 0.35) * 1.6, 0, 1) * mask_gain
    sj = (0.90 + 0.20 * rg.random((h, w)))[..., None]   # fines are grainy too
    return field * (1 - m[..., None]) + (silt_col[None, None, :] * sj) * m[..., None]


# ---------------------------------------------------------------- the corridor
def draw_tie(rg, canvas, x0, wood_pop, plate_col, terra_mid, y0=TIE_Y0, y1=TIE_Y1,
             weather=1.0, ghost_plates=False, skew=0, rails=(RAIL_N, RAIL_S)):
    """One tie: silver-grey checked top from the wood_fence population, ONE
    grain split, end checks, 2px creosote-black down-light side. Tie plates
    21x12 under each rail with the family's only saturated rust halo.
    ghost_plates=True is the lifted-alignment state (plate gone, stain left).
    skew shifts the south end sideways (a lifted-yard tie kicked loose)."""
    h, w, _ = canvas.shape
    n = y1 - y0
    # LONGITUDINAL grain: smoothed along the tie's length, near-independent
    # across it — wood, not static (and the straddling tie stops shouting on
    # the seam column it deliberately crosses)
    n0 = rg.standard_normal((n, TIE_W - 2))
    for _ in range(2):
        n0 = (np.roll(n0, 1, 0) + n0 + np.roll(n0, -1, 0)) / 3
    n0 = (np.roll(n0, 1, 1) + 2 * n0 + np.roll(n0, -1, 1)) / 4
    g = (n0 - n0.min()) / (n0.max() - n0.min() + 1e-9)
    g = g * 0.70 + rg.random((n, TIE_W - 2)) * 0.30
    idx = (np.clip(g, 0, 1) * (len(wood_pop) - 1)).astype(int)
    top = wood_pop[idx] * weather
    split_x = int(rg.integers(3, 8))
    sy = 0
    while sy < n:                                   # ONE broken grain split
        seg = int(rg.integers(14, 30))
        if rg.random() < 0.75:
            jx = split_x + int(rg.integers(-1, 2))
            top[sy:sy + seg, jx % (TIE_W - 2)] *= 0.62
        sy += seg + int(rg.integers(3, 9))
    for ey in (1, 2, n - 3, n - 2):                 # end checks
        if rg.random() < 0.8:
            ex = int(rg.integers(1, TIE_W - 4))
            top[ey, ex:ex + 2] *= 0.66
    top[:, 0] = np.clip(top[:, 0] * 1.08, 0, 255)   # lit west arris (UL light)
    side_mod = rg.random(n)
    for _ in range(2):
        side_mod = (np.roll(side_mod, 1) + side_mod + np.roll(side_mod, -1)) / 3
    silt_break = rg.random(n)
    for yy in range(n):
        xs = x0 + (skew * (yy - n // 2)) // max(n, 1)
        for xx in range(TIE_W - 2):
            canvas[y0 + yy, (xs + xx) % w] = top[yy, xx]
        # creosote side, BROKEN not ruled: value wanders, silt interrupts —
        # never a straight drawn border (craft law 8)
        sv = (0.80 + 0.55 * side_mod[yy]) * weather
        c1 = np.array([54., 48., 42.]) * sv
        c2 = np.array([40., 36., 32.]) * sv
        if silt_break[yy] > 0.87:                   # crib silt laps over the side
            old1 = canvas[y0 + yy, (xs + TIE_W - 2) % w]
            old2 = canvas[y0 + yy, (xs + TIE_W - 1) % w]
            canvas[y0 + yy, (xs + TIE_W - 2) % w] = old1 * 0.55 + c1 * 0.45
            canvas[y0 + yy, (xs + TIE_W - 1) % w] = old2 * 0.7 + c2 * 0.3
        else:
            canvas[y0 + yy, (xs + TIE_W - 2) % w] = c1
            canvas[y0 + yy, (xs + TIE_W - 1) % w] = c2
    canvas[y1 - 1, x0 % w:(x0 + TIE_W - 2) % w if (x0 + TIE_W - 2) % w > x0 % w else w] *= 0.7
    for rail_c in rails:                            # tie plates (or their ghosts)
        py0, py1 = int(rail_c) - 10, int(rail_c) + 11
        px0, px1 = x0, x0 + TIE_W - 1
        if ghost_plates:
            for yy in range(py0, py1):
                for xx in range(px0, px1):
                    st = terra_mid * 0.55 + canvas[yy, xx % w] * 0.45
                    canvas[yy, xx % w] = canvas[yy, xx % w] * 0.72 + st * 0.28
            continue
        for yy in range(py0, py1):
            for xx in range(px0, px1):
                f = 1.18 if yy == py0 else (0.76 if yy == py1 - 1 else 1.0)
                canvas[yy, xx % w] = plate_col * rg.uniform(0.90, 1.10) * f
        halo = terra_mid                              # the ONLY saturated colour
        for yy in range(py0 - 3, py1 + 3):
            for xx in range(px0 - 3, px1 + 3):
                inside = py0 <= yy < py1 and px0 <= xx < px1
                if inside:
                    continue
                d = max(py0 - yy, yy - py1 + 1, px0 - xx, xx - px1 + 1, 0)
                pr = (0.55, 0.3, 0.14)[min(d, 2)] if d <= 2 else 0
                if rg.random() < pr:
                    c = canvas[yy % h, xx % w]
                    canvas[yy % h, xx % w] = c * 0.55 + halo * 0.45
        for _ in range(2):                            # down-grain streaks
            sx = int(rg.integers(px0, px1))
            for k in range(int(rg.integers(3, 7))):
                yy = py1 + k
                if yy >= y1:
                    break
                c = canvas[yy, sx % w]
                canvas[yy, sx % w] = c * 0.7 + halo * 0.3 * (1 - k * 0.15)


def draw_rail(rg, canvas, rail_c, crown_col, web_cols, w, x0=0):
    """The rail: 4px matte crown (lightest in the family), 3px shaded web on
    the down-light side, 1px base flare, 1px contact shading up-light. v2:
    the crown carries LONG-WAVE rust mottling plus short facet grit and
    occasional darker rust patch runs — a thirty-year matte bar, never tape,
    never a gleam. The web is genuinely dark so the 11px of true height
    reads as a section, not an underline."""
    c0 = int(rail_c) - 2                        # crown rows: c0..c0+3
    slow = torus_noise(rg, (1, w), 13, 3)[0]    # rust weather, long wave
    fast = torus_noise(rg, (1, w), 3, 1)[0]     # facet grit
    patch = np.ones(w)
    n_pat = max(1, w // 44)
    for _ in range(n_pat):                      # darker rust patch runs
        px0 = int(rg.integers(w))
        ln = int(rg.integers(6, 15))
        for k in range(ln):
            patch[(px0 + k) % w] = 0.82 + 0.06 * np.sin(np.pi * k / ln)
    for xx in range(x0, w):
        m = (0.86 + 0.20 * slow[xx] + 0.08 * (fast[xx] - 0.5)) * patch[xx]
        canvas[c0 - 2, xx] = canvas[c0 - 2, xx] * 0.55 + crown_col * 0.24 * m  # flare N
        canvas[c0 - 1, xx] *= 0.72                                            # contact
        canvas[c0 + 0, xx] = crown_col * 1.00 * m
        canvas[c0 + 1, xx] = crown_col * 1.06 * m
        canvas[c0 + 2, xx] = crown_col * 0.94 * m
        canvas[c0 + 3, xx] = crown_col * 0.80 * m           # head shade to the web
        canvas[c0 + 4, xx] = web_cols[0] * (0.72 + 0.16 * fast[xx])            # web
        canvas[c0 + 5, xx] = web_cols[0] * (0.86 + 0.14 * slow[xx])
        canvas[c0 + 6, xx] = web_cols[1] * (0.92 + 0.14 * fast[xx])
        canvas[c0 + 7, xx] = canvas[c0 + 7, xx] * 0.52 + web_cols[2] * 0.48    # base flare


def shoulder_shade(rg, canvas, w, silt_col):
    """The prism: lit north slope, shaded south slope, slumped bowed toes
    fading to silt (45 law: the slope is a surface, boundaries bow on wrapped
    low-frequency wobble; upper-left light)."""
    bow = torus_noise(rg, (1, w), 11, 3)[0] * 6 - 3
    for xx in range(w):
        b = bow[xx]
        for yy in range(STACK):
            if yy < 8 + b:                        # north toe: silted fade
                f = np.clip((8 + b - yy) / 8.0, 0, 1)
                canvas[yy, xx] = canvas[yy, xx] * (1 - 0.55 * f) + silt_col * (0.55 * f)
            elif yy < 26 + b:                     # north slope: LIT
                canvas[yy, xx] = np.clip(canvas[yy, xx] * 1.16, 0, 255)
            elif yy >= STACK - 8 + b:             # south toe: silted fade
                f = np.clip((yy - (STACK - 8 + b)) / 8.0, 0, 1)
                canvas[yy, xx] = canvas[yy, xx] * (1 - 0.55 * f) + silt_col * (0.55 * f)
            elif yy >= STACK - 26 + b:            # south slope: SHADED
                canvas[yy, xx] = canvas[yy, xx] * 0.86


def cook_corridor_unit(seed, pop, wood_pop, plate_col, terra_mid, crown_col,
                       web_cols, silt_col, lifted=False, yard=False):
    """One 88x220 corridor unit (2 cells of the declared tie phase) — split
    into phase tiles A|B by the caller. lifted=True: steel gone, ties stay,
    plate ghosts, heavier silt, the pale ghost line where the rail sat.
    yard=True: NO PRISM — the yard-vs-mainline distinction the form makes
    (in a yard the tracks share one continuous ballast plate, no shoulders),
    so the stack's outer rows stay flat plate and the unit sits seamlessly
    in the plate field."""
    rg = np.random.default_rng(SEED + seed)
    canvas = ballast_field(rg, STACK, PERIOD, pop)
    canvas = silt_blend(rg, canvas, 0.65 if lifted else (0.40 if yard else 0.45),
                        silt_col)
    ties = []
    for i, off in enumerate(TIE_OFFS):
        # the declared 1px jitter (29/30 gaps) — only +1, never -1, so the
        # middle tie's dark creosote side column can never land on the cell
        # boundary column (a dark edge ON the seam is the M10 border failure)
        jit = int(rg.integers(0, 2)) if i == 1 else 0
        ties.append(off + jit)
    drop = int(rg.integers(0, 6)) if lifted else -1       # a lifted yard loses a tie
    for i, x0 in enumerate(ties):
        if lifted and i == drop % 3:
            rg2 = np.random.default_rng(SEED + seed + 91 + i)
            m = torus_noise(rg2, (TIE_Y1 - TIE_Y0, TIE_W), 3, 1)
            for yy in range(TIE_Y0, TIE_Y1):               # bed print of the gone tie
                for xx in range(x0, x0 + TIE_W):
                    f = 0.10 + 0.10 * m[yy - TIE_Y0, xx - x0]
                    canvas[yy, xx % PERIOD] = canvas[yy, xx % PERIOD] * (1 - f) + \
                        silt_col * f
            continue
        draw_tie(rg, canvas, x0, wood_pop, plate_col, terra_mid,
                 weather=rg.uniform(0.93, 1.06),
                 ghost_plates=lifted, skew=int(rg.integers(-2, 3)) if lifted else 0)
    if lifted:
        for rail_c in (RAIL_N, RAIL_S):                    # ghost of the rail line
            c0 = int(rail_c) - 2
            for yy in range(c0 - 1, c0 + 6):
                canvas[yy, :] = canvas[yy, :] * 0.88 + silt_col[None, :] * 0.12
    else:
        for rail_c in (RAIL_N, RAIL_S):
            draw_rail(rg, canvas, rail_c, crown_col, web_cols, PERIOD)
    if not yard:
        shoulder_shade(rg, canvas, PERIOD, silt_col)
    return np.clip(canvas, 0, 255)


# ---------------------------------------------------------------- specials
def cook_turnout(seed, pop, wood_pop, plate_col, terra_mid, crown_col,
                 web_cols, silt_col):
    """Points, SINGLE 5x3, frozen mid-throw: the four nameable pieces only —
    (1) tapered switch blades lying inside the stock rails, one seated, one
    ajar (mid-throw); (2) the diverging pair peeling to the bottom-right
    exit (a real No.8 is 33 cells — the compression to 3 is NAMED, and the
    apparent diverging gauge compresses with it); (3) the dark manganese
    FROG casting where the diverging rail crosses the south stock rail,
    interrupting its crown; (4) the switch stand on the north shoulder.
    Yard context: continuous ballast plate, no shoulders."""
    W = 3 * CELL
    rg = np.random.default_rng(SEED + seed)
    canvas = ballast_field(rg, STACK, W, pop)
    canvas = silt_blend(rg, canvas, 0.4, silt_col)
    xs = [5, 34, 64, 93, 122]                     # tie run continues through
    for i, x0 in enumerate(xs):
        y1 = TIE_Y1 if x0 < 60 else min(TIE_Y1 + 18, STACK - 6)   # switch timbers
        draw_tie(rg, canvas, x0, wood_pop, plate_col, terra_mid,
                 y1=y1, weather=rg.uniform(0.93, 1.05))
    for rail_c in (RAIL_N, RAIL_S):               # straight stock rails
        draw_rail(rg, canvas, rail_c, crown_col, web_cols, W)

    slow = torus_noise(rg, (1, 4 * W), 13, 3)[0]

    def rail_seg(path, taper_from=None):
        """A CONTINUOUS diverging rail: 2px matte crown + 1-2px web shadow
        below, vertical gaps between steps filled (v1's dotted scratch was
        called wrong in its own proof). taper_from: blade mode — width goes
        1px and darker toward the tip end."""
        for i, (xx, yv) in enumerate(path):
            if not (0 <= xx < W):
                continue
            yi = int(round(yv))
            y_next = int(round(path[i + 1][1])) if i + 1 < len(path) else yi
            m = 0.80 + 0.18 * slow[(xx * 2) % (4 * W)]
            tip = 1.0
            thin = False
            if taper_from is not None:
                t = i / max(len(path) - 1, 1)
                tip = 0.66 + 0.34 * t
                thin = t < 0.45
            lo, hi = sorted((yi, y_next))
            for yy in range(lo, hi + 1):
                if 0 <= yy < STACK - 1:
                    canvas[yy, xx] = np.clip(crown_col * 1.02 * m * tip, 0, 255)
                    if not thin:
                        canvas[yy + 1, xx] = np.clip(crown_col * 0.82 * m * tip, 0, 255)
                        if yy + 2 < STACK:
                            canvas[yy + 2, xx] = web_cols[0] * (0.85 + 0.1 * m)

    def curve(x0, y0, x1, y1, bend=0.35):
        pts = []
        for xx in range(x0, x1 + 1):
            t = (xx - x0) / max(x1 - x0, 1)
            tt = (1 - bend) * t + bend * t * t          # eases into the diverge
            pts.append((xx, y0 + (y1 - y0) * tt))
        return pts

    fx = 104                                      # frog x on the south stock rail
    # (2) the diverging pair, CONTINUOUS, easing to the bottom-right exit
    rail_seg(curve(46, 71, W - 4, 196))           # inner: crosses at the frog
    rail_seg(curve(46, 149, 100, 219))            # outer: exits the bottom edge
    # (1) the switch blades: tapered points INSIDE the gauge. North blade
    # SEATED against its stock rail; south blade AJAR 3px — frozen mid-throw
    rail_seg([(xx, 71 - min(2, (xx - 10) // 8)) for xx in range(10, 47)],
             taper_from=10)
    rail_seg([(xx, 145 + min(4, (xx - 10) // 6)) for xx in range(10, 47)],
             taper_from=10)
    for xx in range(12, 40):                      # the ajar gap reads as shadow
        canvas[143, xx] = canvas[143, xx] * 0.66
    # (3) the FROG: dark manganese wedge where the diverging rail crosses the
    # stock rail — crown interrupted, flangeway gaps through the casting,
    # sky-lit top edge so it reads as a solid block, not a smudge
    for yy in range(int(RAIL_S) - 5, int(RAIL_S) + 7):
        for xx in range(fx - 8, fx + 9):
            dx, dy = abs(xx - fx), abs(yy - int(RAIL_S) - 1)
            if dx + dy * 2 < 13:
                mg = np.array([62., 60., 63.]) * (0.92 + 0.16 * rg.random())
                canvas[yy, xx] = mg
    for xx in range(fx - 8, fx + 9):
        canvas[int(RAIL_S) - 5, xx] = np.array([88., 86., 90.])   # lit top edge
        canvas[int(RAIL_S) - 2, xx] = np.array([34., 33., 36.])   # flangeway gaps
        canvas[int(RAIL_S) + 3, xx] = np.array([34., 33., 36.])
    # (4) the switch stand on the north shoulder + its throw rod to the blades
    sx, sy = 20, 8
    for yy in range(sy + 10, 68):                 # throw rod: broken dark dashes
        if yy % 3 != 0:
            canvas[yy, sx + 2] = web_cols[1] * 0.9
    for yy in range(sy, sy + 10):                 # the stand: a squat post with
        for xx in range(sx, sx + 6):              # mass, lit cap, dark east side
            f = 1.0 - 0.05 * (yy - sy)
            canvas[yy, xx] = np.array([70., 63., 56.]) * f * rg.uniform(0.92, 1.08)
        canvas[yy, sx + 5] = np.array([44., 40., 36.]) * (1.0 - 0.04 * (yy - sy))
    canvas[sy, sx:sx + 6] = np.array([138., 122., 102.])          # sky-lit cap
    canvas[sy + 1, sx:sx + 6] = np.array([108., 96., 82.])
    for yy in range(sy + 2, sy + 5):              # the faded target, rust-dull
        for xx in range(sx + 1, sx + 4):
            canvas[yy, xx] = terra_mid * 0.92
    canvas[sy + 10, sx:sx + 6] = canvas[sy + 10, sx:sx + 6] * 0.72   # foot shadow
    return np.clip(canvas, 0, 255)


def cook_crossing(seed, pop, conc_pop, street_tiles, wood_pop, plate_col,
                  terra_mid, crown_col, web_cols, silt_col):
    """Grade crossing, SINGLE 5x3 (road runs across the corridor): concrete
    panels with joints PARALLEL to the rails, 3-4px DARK FLANGEWAY SLOTS on
    the gauge side of each rail (the one detail a zebra can never have — NO
    crossing bars), the road humping to top of rail (north approach lit as
    it rises, south approach shaded as it falls away), and an alligatored
    asphalt ring at the panel joints. Approaches are HIS street pixels."""
    W = 3 * CELL
    rg = np.random.default_rng(SEED + seed)
    canvas = ballast_field(rg, STACK, W, pop)
    # asphalt approaches: harvested street rows (the harmonized pool)
    top_ap = np.concatenate([street_tiles[i % len(street_tiles)] for i in range(3)], axis=1)
    bot_ap = np.concatenate([street_tiles[(i + 3) % len(street_tiles)] for i in range(3)], axis=1)
    canvas[0:40] = top_ap[4:44, :W]
    canvas[180:STACK] = bot_ap[0:40, :W]
    # the hump: north approach rises toward the light, south falls away
    for yy in range(0, 40):
        canvas[yy] = np.clip(canvas[yy] * (1.0 + 0.13 * (yy / 39.0)), 0, 255)
    for yy in range(180, STACK):
        canvas[yy] = np.clip(canvas[yy] * (1.10 - 0.13 * ((yy - 180) / 39.0)), 0, 255)
    # concrete panel field (his concrete population), joints parallel to rails
    g = torus_noise(rg, (140, W), 5, 2) * 0.45 + rg.random((140, W)) * 0.55
    g = (g - g.min()) / (g.max() - g.min() + 1e-9)
    # rank clamped to the concrete's mid band + light desat: grey panels,
    # not tan (v1 read warm-bright against the bed)
    panel = conc_pop[((0.06 + g * 0.80) * (len(conc_pop) - 1)).astype(int)]
    panel = desat(panel, 0.16) * (0.89 + 0.22 * rg.random((140, W)))[..., None]
    canvas[40:180] = panel
    for jy in (40, 100, 179):                     # panel joints, PARALLEL to rails
        canvas[jy, :] *= 0.62
        if jy + 1 < 180:
            canvas[jy + 1, :] = np.clip(canvas[jy + 1, :] * 1.08, 0, 255)
    for yy in range(41, 179):                     # panel edges at the road edge
        canvas[yy, 0] *= 0.8
        canvas[yy, W - 1] *= 0.8
    # rails through the panels: crown + flangeway slot gauge-side only
    for rail_c, gauge_dir in ((RAIL_N, +1), (RAIL_S, -1)):
        c0 = int(rail_c) - 2
        mod = torus_noise(rg, (1, W), 5, 2)[0]
        for xx in range(W):
            m = 0.94 + 0.12 * mod[xx]
            canvas[c0 - 1, xx] *= 0.75            # 1px shadow seam, non-gauge side
            canvas[c0 + 0, xx] = crown_col * 1.04 * m
            canvas[c0 + 1, xx] = crown_col * 1.00 * m
            canvas[c0 + 2, xx] = crown_col * 0.96 * m
            canvas[c0 + 3, xx] = crown_col * 0.88 * m
            fy0 = c0 + 4 if gauge_dir > 0 else c0 - 5
            for k in range(4):                    # THE flangeway: 4px dark slot
                canvas[fy0 + k, xx] = np.array([36., 35., 34.]) * (0.9 + 0.2 * rg.random())
    # alligatored asphalt ring where the pavement fails at the panel joint
    for band, sink in (((32, 40), 0.90), ((180, 188), 0.90)):
        for yy in range(*band):
            canvas[yy] = np.clip(canvas[yy] * sink, 0, 255)
        for _ in range(46):
            cx, cy = int(rg.integers(W)), int(rg.integers(*band))
            for _ in range(int(rg.integers(3, 8))):
                canvas[cy % STACK, cx % W] *= 0.62
                cx += int(rg.integers(-1, 2))
                cy += int(rg.integers(-1, 2))
                cy = min(max(cy, band[0]), band[1] - 1)
    return np.clip(canvas, 0, 255)


def cook_buffer(seed, pop, wood_pop, plate_col, terra_mid, crown_col,
                web_cols, silt_col):
    """Buffer stop: the stub-end cell (1x3 cells, opaque). Low, wide, heavy:
    a steel beam bolted across both rails — the beam spans the 2-cell gauge
    (the spec's '2 cells'), strike face west toward the oncoming line and
    catching the upper-left light, dark down-light east edge, two raked
    rail braces behind, silted ballast mound past the end. Knee-to-waist
    high: it reads as a mass on the bed, never a gate."""
    W, H = CELL, 3 * CELL
    rg = np.random.default_rng(SEED + seed)
    canvas = ballast_field(rg, H, W, pop)
    canvas = silt_blend(rg, canvas, 0.5, silt_col)
    rail_ys = (int(RAIL_N) - CELL, int(RAIL_S) - CELL)        # local: 21, 109
    tie_x = 2
    rg2 = np.random.default_rng(SEED + seed + 7)
    draw_tie(rg2, canvas, tie_x, wood_pop, plate_col, terra_mid,
             y0=4, y1=H - 4, weather=1.0,
             rails=(rail_ys[0] + 0.5, rail_ys[1] + 0.5))
    bx = 15                                                    # beam column
    for rail_y in rail_ys:                                     # rails run in, stop
        draw_rail(rg, canvas, rail_y + 0.5, crown_col, web_cols, bx - 2, x0=0)
    by0, by1 = rail_ys[0] - 11, rail_ys[1] + 12                # beam spans the gauge
    beam = np.array([84., 68., 56.])                           # rusted heavy steel
    wob_n = torus_noise(rg, (by1 - by0 + 2, 1), 5, 2)[:, 0]
    for yy in range(by0, by1):
        wob = 0.88 + 0.24 * wob_n[yy - by0]
        canvas[yy, bx - 3] = np.clip(beam * 1.55 * wob, 0, 255)    # lit strike edge
        canvas[yy, bx - 2] = np.clip(beam * 1.30 * wob, 0, 255)
        canvas[yy, bx - 1] = beam * 1.06 * wob
        canvas[yy, bx + 0] = beam * 0.98 * wob
        canvas[yy, bx + 1] = beam * 0.92 * wob
        canvas[yy, bx + 2] = beam * 0.84 * wob
        canvas[yy, bx + 3] = beam * 0.70 * wob
        canvas[yy, bx + 4] = beam * 0.52 * wob                     # down-light edge
    canvas[by0 - 1, bx - 3:bx + 5] = np.clip(beam * 1.6, 0, 255)   # sky-lit top cap
    canvas[by0, bx - 3:bx + 5] = np.clip(beam * 1.35, 0, 255)
    canvas[by1, bx - 3:bx + 5] = beam * 0.5                        # ground shadow foot
    for rail_y, drift in ((rail_ys[0], -1), (rail_ys[1], 1)):      # raked rail braces
        for k in range(0, 20):                                     # behind the beam
            xx = bx + 5 + k
            yy = rail_y + drift * (k // 2)
            if 0 <= xx < W and 1 <= yy < H - 1:
                canvas[yy, xx] = web_cols[1] * 1.15
                canvas[yy + (1 if drift > 0 else -1), xx] = web_cols[0] * 0.9
                canvas[yy - drift, xx] = np.clip(crown_col * 0.72, 0, 255)  # lit top
    for rail_y in rail_ys:                                     # rust bleed at bolts
        for yy in range(rail_y - 2, rail_y + 3):
            for xx in range(bx - 2, bx + 4):
                if rg.random() < 0.4:
                    canvas[yy, xx] = canvas[yy, xx] * 0.6 + terra_mid * 0.4
    mnd = torus_noise(rg, (H, W), 9, 2)                        # silted mound behind
    for yy in range(by0 - 4, by1 + 5):
        for xx in range(bx + 5, W):
            f = np.clip((xx - bx - 5) / float(W - bx - 5), 0, 1) * 0.5 * mnd[yy % H, xx]
            canvas[yy, xx] = canvas[yy, xx] * (1 - f) + silt_col * f
    return np.clip(canvas, 0, 255)


# ---------------------------------------------------------------- metrics
def measure(tile):
    a = tile.astype(np.float64)
    px = a[..., :3].reshape(-1, 3)
    L = lum(px)
    colours = len(np.unique(px.astype(np.uint8), axis=0))
    La = lum(a[..., :3])
    d = np.abs(np.diff(La, axis=1))
    edge = float(d.mean())
    grain = float((d > 8).mean() * 100)
    flat = px / 255.0
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in flat])
    sat = float(hsv[:, 1].mean())
    hue = hsv[:, 0] * 360
    purple = float(((hue >= 260) & (hue <= 320) & (hsv[:, 1] > 0.15)).mean() * 100)
    green = float(((hue >= 70) & (hue <= 170) & (hsv[:, 1] > 0.25)
                   & (hsv[:, 2] > 0.25)).mean() * 100)
    black = float((px.max(axis=1) < 14).mean())
    return dict(colours=colours, edge=round(edge, 3), grain=round(grain, 3),
                sat=round(sat, 3), lum_mean=round(float(L.mean()), 3),
                lum_sd=round(float(L.std()), 3), purple_pct=round(purple, 3),
                green_pct=round(green, 3), near_black_frac=round(black, 4))


def run_seam(tiles_row):
    strip = np.concatenate(tiles_row, axis=1)
    L = lum(strip.astype(np.float64))
    W = tiles_row[0].shape[1]
    steps = np.abs(np.diff(L, axis=1))
    j_cols = [k * W - 1 for k in range(1, len(tiles_row))]
    j = float(np.mean([steps[:, c].mean() for c in j_cols]))
    internal = float(np.delete(steps, j_cols, axis=1).mean())
    return round(j, 3), round(internal, 3)


def wrap_seam(tile):
    L = lum(tile.astype(np.float64))
    wrap = float(np.abs(L[:, 0] - L[:, -1]).mean())
    internal = float(np.abs(np.diff(L, axis=1)).mean())
    return round(wrap, 3), round(internal, 3)


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


def labeled_sheet(entries, cols, scale=2, pad=8, label_h=14, bg=(24, 24, 28)):
    cw = max(e[1].shape[1] for e in entries) * scale + pad
    hmax = max(e[1].shape[0] for e in entries)
    chh = hmax * scale + label_h + pad
    rows = (len(entries) + cols - 1) // cols
    im = Image.new('RGB', (cols * cw + pad, rows * chh + pad), bg)
    dr = ImageDraw.Draw(im)
    for i, (lab, a) in enumerate(entries):
        x = pad + (i % cols) * cw
        y = pad + (i // cols) * chh
        t = Image.fromarray(a.astype(np.uint8), 'RGB').resize(
            (a.shape[1] * scale, a.shape[0] * scale), Image.NEAREST)
        im.paste(t, (x, y))
        dr.text((x, y + a.shape[0] * scale + 2), lab[:30], fill=(225, 225, 225))
    return im


# ---------------------------------------------------------------- main
def main():
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)
    for f in os.listdir(PROOF_DIR):               # no stale proofs survive a rerun
        if f.endswith('.png'):
            os.remove(os.path.join(PROOF_DIR, f))
    assert_nothing_bought_covers_rail()

    tm = load_texture_match()
    street_tiles, desert_tiles = load_street_pools()
    st = load_starter(['yard_0', 'yard_1', 'yard_2', 'dirt', 'concrete_0',
                       'concrete_1', 'road_0', 'road_crossing'])

    # HARVEST: the ballast pixel population, HIS palette, sorted by value
    bal_px = np.concatenate([tm['rail_ballast_1'][0].reshape(-1, 3),
                             tm['rail_ballast_2'][0].reshape(-1, 3)])
    bal_pop = bal_px[np.argsort(lum(bal_px))]
    # HARVEST: tie-top wood — the silver-grey band of his fence planks
    wood_px = np.concatenate([tm['wood_fence_0'][0].reshape(-1, 3),
                              tm['wood_fence_1'][0].reshape(-1, 3)])
    wL = lum(wood_px)
    wood_pop = wood_px[(wL > 70) & (wL < 170)]
    wood_pop = desat(wood_pop[np.argsort(lum(wood_pop))], 0.35)
    # HARVEST: rust steel ramp for web/base, desaturated to world discipline
    steel_px_all = np.concatenate([tm['steel_rusted_0'][0].reshape(-1, 3),
                                   tm['steel_rusted_1'][0].reshape(-1, 3)])
    steel_srt = desat(steel_px_all[np.argsort(lum(steel_px_all))], 0.45)
    web_cols = (steel_srt[int(len(steel_srt) * 0.10)],
                steel_srt[int(len(steel_srt) * 0.22)],
                steel_srt[int(len(steel_srt) * 0.38)])
    plate_col = steel_srt[int(len(steel_srt) * 0.30)]
    # HARVEST: terracotta rust hue (approved) — the only saturated colour
    terra_px = np.concatenate([tm[f'roof_tile_terra_{i}'][0].reshape(-1, 3)
                               for i in range(3)])
    terra_srt = terra_px[np.argsort(lum(terra_px))]
    terra_mid = desat(terra_srt[int(len(terra_srt) * 0.72)][None, :], 0.18)[0]
    # crown: matte light orange-tan, the family's ONLY high value
    crown_col = np.array([172., 148., 122.])
    # silt: wind-blown fines toned off the approved starter dirt
    silt_col = desat((st['dirt'].reshape(-1, 3).mean(axis=0) * 0.86)[None, :], 0.25)[0]
    # concrete panel population from the approved starter concrete
    conc_px = np.concatenate([st['concrete_0'].reshape(-1, 3),
                              st['concrete_1'].reshape(-1, 3)])
    conc_pop = conc_px[np.argsort(lum(conc_px))]

    tiles, sheets = [], {}

    def add(name, arr, kind, harvested, extra=None):
        e = dict(name=name, px=CELL, b64=png_b64(arr), metrics=measure(arr),
                 kind=kind, harvested_from=harvested, layer='ground')
        if arr.shape[0] != CELL or arr.shape[1] != CELL:
            e['cells'] = [arr.shape[1] // CELL, arr.shape[0] // CELL]
        if extra:
            e.update(extra)
        tiles.append(e)
        sheets[name] = arr

    # ---- (2) yard ballast plate: the spec-named reuse base
    plate_arrs = []
    for i in range(3):
        a = tm[f'rail_ballast_{i}'][0]
        note = 'rail_ballast_%d HARVESTED VERBATIM (texture-match 8/1, PENDING)' % i
        if i == 0:
            a = degreen_to_straw(a)
            note = ('rail_ballast_0 HARVESTED + DEAD-VALLEY TREATMENT: its 7.44% '
                    'living green lichen re-hued to straw in code (only change)')
        plate_arrs.append(a)
        add(f'rail_plate_{i}', a, 'yard ballast plate — continuous bed between '
            'tracks (no individual prisms: that is what makes a yard a yard)', note)

    # ---- (1) running corridor: 3 variants x 2 phases of the 88px tie period
    corridor_units = [cook_corridor_unit(100 + v, bal_pop, wood_pop, plate_col,
                                         terra_mid, crown_col, web_cols, silt_col)
                      for v in range(3)]
    for v, unit in enumerate(corridor_units):
        for p, ph in enumerate('AB'):
            t = unit[:, p * CELL:(p + 1) * CELL]
            add(f'rail_corridor_{v}{ph}', t,
                'running corridor, fixed 5-slice stack (shoulder/rail/four-foot/'
                f'rail/shoulder), phase {ph} of the DECLARED 88px tie period '
                '(ties at 5/34/64, 3 per 2 cells)',
                'ballast: rail_ballast_1/2 pixel population; tie tops: wood_fence '
                'silver band; steel: steel_rusted ramp desaturated; rust halo: '
                'approved roof_tile_terra')

    # ---- (1b) YARD corridor: same track, NO PRISM — the yard-vs-mainline
    # read the form demands (yard tracks share one continuous plate; the v1
    # proof showed prism shoulders stranded on the plate and it was wrong)
    yardcor_units = [cook_corridor_unit(150 + v, bal_pop, wood_pop, plate_col,
                                        terra_mid, crown_col, web_cols, silt_col,
                                        yard=True) for v in range(3)]
    for v, unit in enumerate(yardcor_units):
        for p, ph in enumerate('AB'):
            t = unit[:, p * CELL:(p + 1) * CELL]
            add(f'rail_yard_corridor_{v}{ph}', t,
                f'YARD corridor, phase {ph}: the same 5-slice track with NO '
                'prism — flat plate to both outer edges, so classification '
                'tracks sit in one continuous bed (that is what makes a yard '
                'a yard)',
                'same harvest set as the running corridor')

    # ---- (6) lifted-rail alignment: 2 variants x 2 phases
    lifted_units = [cook_corridor_unit(200 + v, bal_pop, wood_pop, plate_col,
                                       terra_mid, crown_col, web_cols, silt_col,
                                       lifted=True) for v in range(2)]
    for v, unit in enumerate(lifted_units):
        for p, ph in enumerate('AB'):
            t = unit[:, p * CELL:(p + 1) * CELL]
            add(f'rail_lifted_{v}{ph}', t,
                f'lifted-rail alignment, phase {ph}: ties and prism intact, steel '
                'gone — plate rust ghosts, one tie robbed per period, the pale '
                'ghost line where the rail sat',
                'same harvest set as the corridor; the Blue Diamond branch / '
                'T&T lifted-roadbed reference')

    # ---- (3) points / turnout
    turnout = cook_turnout(300, bal_pop, wood_pop, plate_col, terra_mid,
                           crown_col, web_cols, silt_col)
    add('rail_turnout', turnout,
        'points/turnout, SINGLE 5x3 COMPRESSED (a real No.8 is 33 cells — '
        'compression NAMED): switch blades frozen mid-throw (south blade ajar), '
        'diverging pair, dark manganese frog interrupting the stock-rail crown, '
        'switch stand with throw rod', 'same harvest set; frog painted (manganese '
        'grey has no donor)', extra=dict(placement='single'))

    # ---- (4) grade crossing
    crossing = cook_crossing(400, bal_pop, conc_pop, street_tiles, wood_pop,
                             plate_col, terra_mid, crown_col, web_cols, silt_col)
    add('rail_crossing', crossing,
        'grade crossing, SINGLE 5x3: concrete panels, joints PARALLEL to rails, '
        '4px dark flangeway slots gauge-side of each rail, road humping to top '
        'of rail (north approach lit, south shaded), alligatored asphalt ring — '
        'NO bars, never a zebra',
        'approaches: pools.street HARVESTED VERBATIM (harmonized pool, streets '
        'law); panels: starter concrete_0/1 population; rails: family steel',
        extra=dict(placement='single'))

    # ---- (5) buffer stop
    buffer_stop = cook_buffer(500, bal_pop, wood_pop, plate_col, terra_mid,
                              crown_col, web_cols, silt_col)
    add('rail_buffer_stop', buffer_stop,
        'buffer stop, the stub-end cell (1x3): low wide heavy steel beam spanning '
        'the 2-cell gauge, lit strike edge west, raked rail braces, silted mound '
        'past the end — knee-to-waist mass, not a gate',
        'ballast/silt/steel/rust: the family harvest set; beam painted',
        extra=dict(placement='single'))

    # ---------------------------------------------------------------- measures
    seam = {}
    for i in range(3):
        seam[f'plate_{i}_wrap'] = wrap_seam(plate_arrs[i])
    seam['plate_mixed_run'] = run_seam([plate_arrs[i % 3] for i in range(6)])
    unit = corridor_units[0]
    seam['corridor_same_unit_3periods'] = run_seam(
        [unit[:, 0:CELL], unit[:, CELL:PERIOD]] * 3)
    # the two junction classes, separated: the 88px PERIOD WRAP (the real
    # seam contract) vs the within-unit cell boundary (which the straddling
    # tie deliberately crosses — A|B is a slice of one authored unit, so any
    # step there is the tie's own texture, not a discontinuity)
    strip = np.concatenate([unit[:, 0:CELL], unit[:, CELL:PERIOD]] * 3, axis=1)
    Ls = lum(strip)
    steps = np.abs(np.diff(Ls, axis=1))
    wrap_cols = [k * PERIOD - 1 for k in range(1, 3)]
    mid_cols = [k * CELL - 1 for k in range(1, 6) if (k * CELL) % PERIOD]
    seam['corridor_88px_period_wrap'] = (
        round(float(np.mean([steps[:, c].mean() for c in wrap_cols])), 3),
        round(float(np.delete(steps, wrap_cols + mid_cols, axis=1).mean()), 3))
    seam['corridor_within_unit_tie_column_info'] = round(
        float(np.mean([steps[:, c].mean() for c in mid_cols])), 3)
    seam['corridor_mixed_variants'] = run_seam(
        [corridor_units[v][:, p * CELL:(p + 1) * CELL]
         for v, p in ((0, 0), (0, 1), (1, 0), (1, 1), (2, 0), (2, 1))])
    seam['corridor_BROKEN_phase_for_contrast'] = run_seam(
        [unit[:, 0:CELL]] * 6)                     # A|A|A: the phase law violated
    yunit = yardcor_units[0]
    stripY = np.concatenate([yunit, yardcor_units[1]], axis=1)
    LsY = lum(stripY)
    stepsY = np.abs(np.diff(LsY, axis=1))
    seam['yard_corridor_cross_unit_wrap'] = (
        round(float(stepsY[:, PERIOD - 1].mean()), 3),
        round(float(np.delete(stepsY, [CELL - 1, PERIOD - 1,
                                       PERIOD + CELL - 1], axis=1).mean()), 3))
    seam['yard_corridor_vs_plate_edge'] = run_seam(
        [np.swapaxes(plate_arrs[1], 0, 1),
         np.swapaxes(yunit[:, 0:CELL], 0, 1)[0:CELL]])
    seam['lifted_mixed'] = run_seam(
        [lifted_units[v][:, p * CELL:(p + 1) * CELL]
         for v, p in ((0, 0), (0, 1), (1, 0), (1, 1))])
    # same split for lifted: the only REAL junction in [0A,0B,1A,1B] is the
    # cross-unit wrap at col 88 — cols 44/132 are inside authored units
    # (skewed ties deliberately cross them; a slice has no seam)
    stripL = np.concatenate([lifted_units[0], lifted_units[1]], axis=1)
    LsL = lum(stripL)
    stepsL = np.abs(np.diff(LsL, axis=1))
    seam['lifted_cross_unit_wrap'] = (
        round(float(stepsL[:, PERIOD - 1].mean()), 3),
        round(float(np.delete(stepsL, [CELL - 1, PERIOD - 1,
                                       PERIOD + CELL - 1], axis=1).mean()), 3))
    seam['corridor_into_turnout'] = run_seam([unit[:, 0:CELL], unit[:, CELL:PERIOD],
                                              turnout])
    seam['corridor_into_crossing'] = run_seam([unit[:, 0:CELL], unit[:, CELL:PERIOD],
                                               crossing])

    # value order + separation, measured off the cooked corridor
    field_rows = unit[100:130]                     # four-foot ballast, no rail rows
    crown_rows = np.concatenate([unit[63:67], unit[151:155]])
    lit_shoulder = unit[10:24]
    tie_side_samples = []
    for x0 in TIE_OFFS:
        tie_side_samples.append(unit[TIE_Y0 + 20:TIE_Y1 - 20,
                                     (x0 + TIE_W - 2) % PERIOD])
    tie_sides = np.concatenate(tie_side_samples)
    yard_mean = float(lum(st['yard_0']).mean())
    value_order = dict(
        tie_sides=round(float(lum(tie_sides).mean()), 1),
        ballast_field=round(float(lum(field_rows).mean()), 1),
        lit_shoulder=round(float(lum(lit_shoulder).mean()), 1),
        rail_crown=round(float(lum(crown_rows).mean()), 1),
        yard_gravel_anchor=round(yard_mean, 1),
        ballast_vs_yard_separation=round(
            yard_mean - float(lum(field_rows).mean()), 1))

    # ---------------------------------------------------------------- proofs
    # (a) 3x3 tiled proof: the yard plate family
    rows = [[plate_arrs[(r + k) % 3] for k in range(3)] for r in range(3)]
    save(np.concatenate([np.concatenate(r, axis=1) for r in rows], axis=0),
         'TILED_3x3_yard_plate.png', 4)

    # corridor + lifted tiled runs bedded in the yard plate
    def plate_row(n, y_off=0):
        return np.concatenate([plate_arrs[(i + y_off) % 3] for i in range(n)], axis=1)

    ycor6 = np.concatenate(yardcor_units, axis=1)
    bed = np.concatenate([plate_row(6), ycor6, plate_row(6, 1)], axis=0)
    save(bed, 'TILED_RUN_yard_corridor_on_plate.png', 3)
    des6 = np.concatenate([desert_tiles[i % len(desert_tiles)]
                           for i in range(6)], axis=1)
    cor6 = np.concatenate(corridor_units, axis=1)
    save(np.concatenate([des6, cor6, des6], axis=0),
         'TILED_RUN_mainline_in_desert.png', 3)
    lif4 = np.concatenate([lifted_units[0], lifted_units[1]], axis=1)
    bedl = np.concatenate([plate_row(4), lif4, plate_row(4, 1)], axis=0)
    save(bedl, 'TILED_RUN_lifted_2periods_on_plate.png', 3)

    # (b) 20-cell continuity, variants alternated, freeway overpass at cell 14
    rg = np.random.default_rng(SEED + 900)
    order = [corridor_units[int(rg.integers(3))] for _ in range(10)]
    run20 = np.concatenate(order, axis=1)[:, :20 * CELL]
    deck = np.zeros((STACK, 2 * CELL, 3))
    g = torus_noise(np.random.default_rng(SEED + 901), (STACK, 2 * CELL), 5, 2)
    deck[:] = conc_pop[((g * 0.35 + 0.28) * (len(conc_pop) - 1)).astype(int)] * 0.92
    deck[:, 0] *= 0.6
    deck[:, 1] = np.clip(deck[:, 1] * 1.25, 0, 255)          # lit west arris
    deck[:, -2] *= 0.75
    deck[:, -1] *= 0.5                                        # dark east edge
    x_dk = 14 * CELL
    shadow_w = 10
    run20[:, x_dk - shadow_w:x_dk] *= np.linspace(0.9, 0.55, shadow_w)[None, :, None]
    run20[:, x_dk + 2 * CELL:x_dk + 2 * CELL + 16] *= \
        np.linspace(0.55, 0.95, 16)[None, :, None]
    run20[:, x_dk:x_dk + 2 * CELL] = deck                     # the deck covers; the
    save(run20, 'CONTINUITY_20CELL_with_freeway.png', 2)      # line resumes beyond
    sq = Image.fromarray(run20.astype(np.uint8)).resize((20 * 8, 5 * 8), Image.LANCZOS)
    sq.resize((20 * 24, 5 * 24), Image.NEAREST).save(
        os.path.join(PROOF_DIR, 'SQUINT_MAPZOOM_20cell.png'))

    # (c) the offset test at the 88px period: declared phase vs broken phase
    ok = np.concatenate([unit[:, 0:CELL], unit[:, CELL:PERIOD]] * 3, axis=1)
    broken = np.concatenate([unit[:, 0:CELL]] * 6, axis=1)
    pad = np.full((8, ok.shape[1], 3), 24.0)
    save(np.concatenate([ok, pad, broken], axis=0), 'OFFSET_TEST_88px.png', 3)

    # (d) assembled specials
    tp = np.concatenate([yunit[:, 0:CELL], yunit[:, CELL:PERIOD], turnout,
                         yardcor_units[1][:, 0:CELL],
                         yardcor_units[1][:, CELL:PERIOD]], axis=1)
    tp = np.concatenate([plate_row(7), tp, plate_row(7, 1)], axis=0)
    save(tp, 'TURNOUT_ASSEMBLED.png', 3)
    cr = np.concatenate([unit[:, 0:CELL], unit[:, CELL:PERIOD], crossing,
                         corridor_units[2][:, 0:CELL],
                         corridor_units[2][:, CELL:PERIOD]], axis=1)
    road_ctx_top = np.concatenate(
        [st['road_0']] * 2 + [street_tiles[i % len(street_tiles)] for i in range(3)]
        + [st['road_0']] * 2, axis=1)[:, :cr.shape[1]]
    ctx_top = np.concatenate([plate_arrs[i % 3] for i in range(7)], axis=1)
    ctx_top[:, 2 * CELL:5 * CELL] = np.concatenate(
        [street_tiles[i % len(street_tiles)] for i in range(3)], axis=1)
    ctx_bot = np.concatenate([plate_arrs[(i + 1) % 3] for i in range(7)], axis=1)
    ctx_bot[:, 2 * CELL:5 * CELL] = np.concatenate(
        [street_tiles[(i + 3) % len(street_tiles)] for i in range(3)], axis=1)
    save(np.concatenate([ctx_top, cr, ctx_bot], axis=0), 'CROSSING_ASSEMBLED.png', 3)
    bf = np.concatenate([yunit[:, 0:CELL], yunit[:, CELL:PERIOD],
                         yardcor_units[1][:, 0:CELL]], axis=1)
    stub = np.zeros((STACK, CELL, 3))
    stub[0:CELL] = plate_arrs[0]
    stub[CELL:4 * CELL] = buffer_stop
    stub[4 * CELL:] = plate_arrs[1]
    bf = np.concatenate([bf, stub,
                         np.concatenate([plate_arrs[i % 3] for i in range(5)],
                                        axis=0).reshape(5 * CELL, CELL, 3)[:STACK]],
                        axis=1)
    save(bf, 'BUFFER_ASSEMBLED.png', 3)

    # (e) ANCHOR COMPOSITE: yard_0 / dirt / desert flank + all-dirt contrast
    n_w = 12
    dirt_panel = np.concatenate(
        [np.concatenate([st['dirt']] * n_w, axis=1)] * 5, axis=0)
    dressed = np.concatenate([plate_row(n_w),
                              np.concatenate([yardcor_units[i % 3] for i in
                                              range((n_w + 1) // 2)], axis=1)[:, :n_w * CELL],
                              plate_row(n_w, 1)], axis=0)
    yard_strip = np.concatenate([st[f'yard_{i % 3}'] for i in range(n_w)], axis=1)
    desert_strip = np.concatenate([desert_tiles[i % len(desert_tiles)]
                                   for i in range(n_w)], axis=1)
    mainline = np.concatenate([desert_strip,
                               np.concatenate([corridor_units[i % 3] for i in
                                               range((n_w + 1) // 2)], axis=1)[:, :n_w * CELL],
                               desert_strip], axis=0)
    gap = np.full((10, n_w * CELL, 3), 24.0)
    comp = np.concatenate([
        dirt_panel, gap,                       # today: the all-dirt railyard floor
        dressed, gap,                          # the same ground wearing this cook
        yard_strip, gap,                       # the fence-line anchor: yard gravel
        mainline], axis=0)                     # mainline between approved desert
    save(comp, 'ANCHOR_COMPOSITE.png', 2)

    labeled = [
        ('yard_0 ANCHOR', st['yard_0']), ('dirt ANCHOR', st['dirt']),
        ('concrete_0 ANCHOR', st['concrete_0']),
        ('road_crossing (NOT this)', st['road_crossing']),
        ('desert (pool)', desert_tiles[0]), ('street (pool)', street_tiles[0]),
        ('rail_plate_0 degreened', plate_arrs[0]),
        ('rail_plate_1 verbatim', plate_arrs[1]),
        ('rail_plate_2 verbatim', plate_arrs[2]),
        ('corridor_0A mainline', sheets['rail_corridor_0A']),
        ('corridor_0B mainline', sheets['rail_corridor_0B']),
        ('yard_corridor_0A', sheets['rail_yard_corridor_0A']),
        ('yard_corridor_0B', sheets['rail_yard_corridor_0B']),
        ('lifted_0A', sheets['rail_lifted_0A']),
        ('turnout 3x5', turnout), ('crossing 3x5', crossing),
        ('buffer 1x3', buffer_stop),
    ]
    labeled_sheet(labeled, 5, scale=2).save(
        os.path.join(PROOF_DIR, 'CONTACT_SHEET_all.png'))

    # ---------------------------------------------------------------- bank
    ground_band = (49.3, 152.2)
    band_warn = [t['name'] for t in tiles
                 if not (ground_band[0] - 26 <= t['metrics']['lum_mean']
                         <= ground_band[1] + 26)]
    tol = dict(edge=(14.2733, 31.0407), grain=(54.8203, 77.5264),
               sat=(0.0358, 0.5228), colours_min=600)
    style_check = {}
    for t in tiles:
        m = t['metrics']
        style_check[t['name']] = dict(
            edge_ok=tol['edge'][0] <= m['edge'] <= tol['edge'][1],
            grain_ok=tol['grain'][0] <= m['grain'] <= tol['grain'][1],
            sat_ok=tol['sat'][0] <= m['sat'] <= tol['sat'][1],
            colours_ok=m['colours'] >= tol['colours_min'])
    bank = {
        'form': 'TF-ART-010',
        'merged_with': 'TF-WORLD-006 (permanent way, continuity clause kept) + '
                       'TF-RUN-002 coarse-ballast member only (its FINE yard '
                       'gravel is a separate job)',
        'cooked': '2026-08-09',
        'mode': 'MIXED',
        'geometry': 'canonical orientation HORIZONTAL (railyard rows); vertical '
            'mainline via rotate-at-wiring (kit canonical-south practice). Gauge '
            '2 cells (88px, rails on row-1/row-3 centres). Ties 13x152px, 3 per '
            '2 cells at DECLARED offsets 5/34/64 (0/29/59 +5 so no tie edge sits '
            'on a cell boundary), 1px jitter on the middle tie. Rail 4px crown + '
            '3px web + 1px flare. Tie plates 21x12 with the only saturated rust. '
            'Corridor = fixed 5-slice stack, banked as 1x5 columns per phase. '
            'Buffer stop is 1x3 (the beam must span the 2-cell gauge; the spec '
            'phrase "2 cells" is the beam span — named, not hidden).',
        'phase_contract': 'SELF-SEAMLESS along the axis at the 88px period: lay '
            'A then B, any variants, never A|A (the OFFSET_TEST proof shows the '
            'broken phase for contrast). Across the axis the stack is fixed, '
            'not a tiling.',
        'continuity_clause': 'TF-WORLD-006 kept: the 20-cell proof runs one '
            'unbroken line over a freeway deck cell — the corridor tiles under '
            'the deck are unchanged, so rail_gate\'s 12,288-row walk never loses '
            'rail underfoot; only the drawing is covered for 2 cells.',
        'value_order_measured': value_order,
        'seam_contract_measured': seam,
        'style_target_check': style_check,
        'ground_band_check': {'band_lo_hi': ground_band,
                              'rule': 'mean within band +/-26',
                              'out_of_band': band_warn},
        'harvest_sources': [
            'banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt: rail_ballast_1/2 verbatim '
            '(spec-named base, PENDING), rail_ballast_0 + dead-valley degreen, '
            'wood_fence tie tops (PENDING), steel_rusted rail steel (PENDING), '
            'roof_tile_terra rust halo (APPROVED)',
            'banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt: pools.street '
            'verbatim in the crossing approaches (streets law), pools.desert '
            'display-only at the prism toe',
            'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt: concrete_0/1 '
            'panel population, dirt silt tone, yard_0/1/2 + dirt + road_crossing '
            'anchors (display)'],
        'do_not_cook_honoured': 'no buckled-rail seventh shape; no motion; no '
            'road vocabulary on the bed; no zebra (flangeway slots instead)',
        'consumers': ['TF-ART-010', 'TF-WORLD-006', 'TF-RUN-002 (coarse ballast '
                      'member only)'],
        'tiles': tiles,
        'law': 'UNJUDGED. Nothing here is canon until Paolo sweeps it.',
    }
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f)

    print('tiles:', len(tiles))
    print('value order:', json.dumps(value_order))
    print('seams:', json.dumps(seam, indent=1))
    print('ground-band warnings:', band_warn or 'none')
    fails = {k: v for k, v in style_check.items() if not all(v.values())}
    print('style-target misses:', json.dumps(fails, indent=1) if fails else 'none')
    for t in tiles:
        m = t['metrics']
        print(' %-18s lum%7.1f sat %.3f col%5d edge%6.2f grain%6.2f grn%5.2f '
              'pur%5.2f blk %.3f' % (t['name'], m['lum_mean'], m['sat'],
                                     m['colours'], m['edge'], m['grain'],
                                     m['green_pct'], m['purple_pct'],
                                     m['near_black_frac']))


if __name__ == '__main__':
    main()
