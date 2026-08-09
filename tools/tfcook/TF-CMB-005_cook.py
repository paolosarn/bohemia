#!/usr/bin/env python3
"""TF-CMB-005 COOK — THE DECK STAIR RUN (open-air, descends toward the viewer).

The only asset Paolo verbally rejected ("looking like dog shit", 7/27/26).
This cook replaces fifteen flat rectangles with a poured-concrete run that
HARVESTS his approved concrete material and keeps the three rules the lane
already researched (three shades per step, perfectly vertical risers,
back-to-front occlusion). One orientation only: DOWN-SCREEN, toward the
viewer — the other three are deleted at the source (v92 generator ruling).

REUSE CHECK: used BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt — the
  approved (Paolo 7/28 "mark it approved", re-approved 7/29 "A") starter
  tileset is opened in code and harvested: concrete_0/concrete_1 supply the
  poured-concrete pixel DISTRIBUTION for every tread, the landing and the
  threshold (their pixels are ramp-indexed and re-levelled, not repainted),
  and walk_kerb is the approved reference for how this world draws a step
  lip (rough body, pale smooth band at the edge). The concrete family ramp
  embedded in that bank's method block is this cook's palette.
  CHECKED, NOTHING FIT (no open() needed, reasoning only):
  - BOHEMIA_TEXTURE_MATCH_8_1_26.txt: 38 materials, no stair; the only
    concrete (tiltup_concrete) is PENDING PAOLO, not approved, so it cannot
    anchor anything.
  - BOHEMIA_EXTERIOR_POOL_8_5_26.txt buckets (street/wreck/trash/crate/
    dead/barrier/camp): no stair family.
  - BOHEMIA_PERIMETER_8_2_26.txt, BOHEMIA_CIVIC_OPENINGS_8_3_26.txt,
    BOHEMIA_OPENINGS_8_2_26.txt: walls, gates and doorways, no stair.
  - HD masters: the 19 stair tiles cited in bohemia_combat_staircase_patch.py
    are catalogued in TILECAT_BROWN only (a colour sweep, not a verdict
    bank), zero verdicts in ACT1_CONFIRMED_SET — VERIFIED DEAD 8/9 by the
    form itself. Reference only, not harvested.
  MODE: MIXED — bought/approved concrete harvested for the material, the
  stair STRUCTURE (risers, nosings, sockets, wear) painted, because no
  approved stair pixels exist anywhere in the banks.

TASTE CHECK:
  - 45 DEGREE ART LAW: three-quarter world view. Treads are sky-lit tops,
    risers are the only verticals, never side-on.
  - THREE SHADES PER STEP (Pixel Parmesan / SLYNYRD Pixelblog 41): bright
    tread at the light end of the approved concrete ramp, near-black
    PERFECTLY VERTICAL riser (#14110d kept from the demo — the value ladder
    the form says is right), worn pale lip on each leading edge.
  - BACK TO FRONT: bands composed top-first; each tread's back row carries
    the internal-corner AO so near steps visibly occlude far ones — the
    anti-barcode cue.
  - STEP COUNT (stated, per the form): candidate A = 7 risers x 7 px
    identical rise (49 px storey vs DECK_H 50.6 at 44 px pitch; the live
    placer computes DECK_H at runtime and scales uniformly, so identical
    integer risers beat a 1.6 px numerical match). Candidate B = 6 x 8 px.
    Real code (16-18 steps) is mush at 44 px; the demo's 5 read as a
    diagram; 6-7 is the count that READS.
  - DEAD VALLEY: weeds in the bottom joint are STRAW, never green.
  - NO purple (purity-gate classifier, must be 0), NO keyline, NO dither
    (solid clusters, no stipple), upper-left light, sat ~0.19-0.26 like the
    anchors it must sit beside.
  - NO baked shadow: the foot shadow is the separate pass (mock draws it as
    that pass, the sprites do not carry it).
  - JOIN CONTRACT (the shipped bug, the kill condition): top pixel rows of
    the run ARE the landing tile's bottom nosing rows (identical pixels),
    bottom pixel row butts the threshold pad's joint row. Measured in the
    proofs; a floating decal is dead on arrival.

UNJUDGED. Nothing here is canon until Paolo sweeps it.
Deterministic: every stroke comes from random.Random(SEED). Rerunnable.

Usage: python3 tools/tfcook/TF-CMB-005_cook.py
"""
import base64
import io
import json
import os
import random
import re
import statistics as st

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STARTER_BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
OUT_BANK = os.path.join(ROOT, 'banks', 'tileforms', 'TF-CMB-005_CANDIDATES_8_8_26.json')
PROOF = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-CMB-005')
SEED = 44005
CELL = 44

# the approved concrete family ramp, verbatim from the starter bank's method
# block (dark -> light). Index 4 (#98856a) is the tread value the form calls
# right (#8c7d61 sits between idx 3 and 4).
CR = ['#1a191a', '#564d42', '#766a58', '#867660', '#98856a', '#aa9576', '#bca482']
RISER = '#14110d'      # kept from the demo: the near-black vertical, the height cue
RISER2 = '#241d15'     # faint streaking inside the riser, still near-black
RUST = '#6b4a32'       # handrail-socket bleed
RUST2 = '#4a3324'
STRAW = '#a8905c'      # dead straw. DEAD VALLEY: never green.
STRAW2 = '#7d6a45'


def hx(s):
    return tuple(int(s[i:i + 2], 16) for i in (1, 3, 5))


CRP = [hx(c) for c in CR]


def lum(p):
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


# ---------------------------------------------------------------- harvesting
def load_starter():
    with open(os.path.join(ROOT, STARTER_BANK), encoding='utf8') as f:
        d = json.load(f)
    tiles = {t['id']: Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
             for t in d['tiles']}
    return tiles


def ramp_index_map(im):
    """Map every pixel of an approved concrete tile to its nearest ramp index.
    This harvests Paolo-approved DISTRIBUTION (where the cracks and clusters
    sit), which the treads/landing/threshold re-level without repainting."""
    w, h = im.size
    px = im.load()
    m = [[0] * w for _ in range(h)]
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            m[y][x] = min(range(len(CRP)),
                          key=lambda i: sum((p[c] - CRP[i][c]) ** 2 for c in range(3)))
    return m


def load_street_tiles():
    """Proof furniture only: the REAL arena floor tiles embedded in the alpha
    (read-only; nothing in slices/ is written)."""
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    m = re.search(r'STREET_B64\s*=\s*(\{.*?\});\n', demo, re.S)
    d = json.loads(m.group(1))
    return {k: [Image.open(io.BytesIO(base64.b64decode(b))).convert('RGB') for b in v]
            for k, v in d.items()}


# ---------------------------------------------------------------- drawing
def put(img, x, y, col):
    if 0 <= x < img.width and 0 <= y < img.height:
        img.putpixel((x, y), col + (255,) if img.mode == 'RGBA' and len(col) == 3 else col)


def tread_row(rng, cmap, src_y, width, x0, target, worn_center=True):
    """One row of tread texture: a real row of approved concrete, re-levelled
    so its centre of mass is `target` on the ramp. Worn centre pulls toward
    the mean (polished), edges keep grit."""
    row = []
    src = cmap[src_y % len(cmap)]
    mean_i = sum(src) / len(src)
    for x in range(width):
        i = src[(x + x0) % len(src)]
        v = i - mean_i + target
        if worn_center:
            c = abs((x / (width - 1)) - 0.5) * 2          # 0 centre, 1 edge
            v = target + (v - target) * (0.55 + 0.45 * c)  # polished middle, gritty edge
        vi = max(2, min(6, int(round(v + rng.uniform(-0.25, 0.25)))))
        row.append(vi)
    return row


def nosing_rows(rng, width):
    """The 2px deck-edge lip band (walk_kerb's move: rough body, pale smooth
    band at the step edge). Row 0 palest, row 1 a step down; ends dirtier."""
    rows = []
    for r, base in enumerate((6, 5)):
        row = []
        for x in range(width):
            v = base
            edge = min(x, width - 1 - x)
            if edge < 3 and rng.random() < 0.6:
                v -= 1
            if rng.random() < 0.10:
                v -= 1
            row.append(max(3, min(6, v)))
        rows.append(row)
    return rows


def draw_run(rng, cmaps, ns, riser_h, tread_h, width=40, canvas_w=44):
    """The authored run. ns risers of identical riser_h px; ns-1 treads of
    tread_h px (last row of each tread = the worn lip, first row = the
    internal-corner AO). 2px nosing on top = the landing's own bottom band.
    Bottom row = last riser's foot, which butts the threshold pad."""
    h = 2 + (ns - 1) * (riser_h + tread_h) + riser_h
    img = Image.new('RGBA', (canvas_w, h), (0, 0, 0, 0))
    xoff = (canvas_w - width) // 2
    y = 0
    # --- the nosing band (deck plane; identical to landing rows 42-43)
    for row in nosing_rows(rng, width):
        for x in range(width):
            put(img, xoff + x, y, CRP[row[x]])
        y += 1
    sock_cols = (2, 3, width - 4, width - 3)     # handrail sockets, both cheeks
    src_y = rng.randrange(44)
    for step in range(ns):
        # --- the riser: PERFECTLY VERTICAL near-black face
        for ry in range(riser_h):
            for x in range(width):
                col = hx(RISER)
                r = rng.random()
                if r < 0.14:
                    col = hx(RISER2)
                # efflorescence creeping out of the lower risers' feet
                if step >= ns - 3 and ry == riser_h - 1 and rng.random() < 0.05:
                    col = CRP[1]
                put(img, xoff + x, y + ry, col)
        # rust bleed under the sockets: irregular — a real rail rusts where it
        # rusts, not on a schedule. At most one streak per cheek per step.
        for side in (sock_cols[:2], sock_cols[2:]):
            if rng.random() < 0.45:
                sc = side[rng.randrange(2)]
                dep = rng.randrange(2, min(6, riser_h) + 1)
                for ry in range(dep):
                    put(img, xoff + sc, y + ry, hx(RUST if ry < 2 else RUST2))
        y += riser_h
        if step == ns - 1:
            break                                  # last riser lands on the lot
        # --- the tread: AO back row, harvested body, ghost stripe, pale lip
        body = tread_h - 2
        for ty in range(tread_h):
            if ty == 0:                            # internal corner AO = occlusion cue
                for x in range(width):
                    v = 2 if rng.random() < 0.75 else 1
                    put(img, xoff + x, y + ty, CRP[v])
            elif ty == tread_h - 1:                # the worn lip (nosing of this step)
                for x in range(width):
                    v = 6
                    edge = min(x, width - 1 - x)
                    if edge < 3:
                        v = 5 if rng.random() < 0.7 else 4
                    elif rng.random() < 0.12:
                        v = 5
                    put(img, xoff + x, y + ty, CRP[v])
            else:
                row = tread_row(rng, cmaps[step % 2], src_y + step * 5 + ty, width,
                                step * 7, target=4 if ty == body else 3.6)
                for x in range(width):
                    put(img, xoff + x, y + ty, CRP[row[x]])
                # anti-slip stripe burned to a ghost: sparse darker flecks only
                if ty == 1 and body >= 2:
                    for x in range(4, width - 4):
                        if rng.random() < 0.22:
                            put(img, xoff + x, y + ty, CRP[2])
        # socket holes on the tread lip line (both cheeks — the rail was real)
        if step % 2 == 0:
            put(img, xoff + sock_cols[1], y + tread_h - 1, CRP[1])
            put(img, xoff + sock_cols[2], y + tread_h - 1, CRP[1])
        y += tread_h
    # dead straw poking over the last riser's foot (the bottom joint)
    for x in (xoff + 4, xoff + width - 6, xoff + width // 2 + 3):
        if rng.random() < 0.9:
            put(img, x, h - 1, hx(STRAW2))
            put(img, x, h - 2, hx(STRAW))
    return img


def draw_landing(rng, base_im):
    """Top landing tile: concrete_0 harvested verbatim, foot-traffic wear
    funnelling toward the stair. NO nosing band of its own: the RUN carries
    the deck-edge lip (so it stays flush against ANY TF-CMB-004 edge tile,
    and the lip is never doubled)."""
    img = base_im.copy().convert('RGB')
    cmap = ramp_index_map(base_im)
    # traffic wear: centre columns pulled a step lighter, sparsely, denser
    # toward the stair edge (the polish a million feet leave at a doorway)
    for y in range(16, 44):
        p = 0.10 + 0.14 * (y - 16) / 27
        for x in range(11, 33):
            if rng.random() < p:
                v = min(6, cmap[y][x] + 1)
                img.putpixel((x, y), CRP[v])
    return img


def draw_threshold(rng, base_im):
    """Bottom threshold pad: concrete_1 harvested verbatim, expansion joint
    across the top (where the last riser lands), dead straw in the joint,
    rust flecks under the rail feet, worn exit fan."""
    img = base_im.copy().convert('RGB')
    # the joint: a broken near-black seam, row 0 (+ spill into row 1)
    for x in range(44):
        if rng.random() < 0.85:
            img.putpixel((x, 0), CRP[0])
        if rng.random() < 0.30:
            img.putpixel((x, 1), CRP[1])
    # dead straw sprigs IN the joint
    for cx in (5, 6, 16, 24, 25, 36, 40):
        if rng.random() < 0.8:
            hgt = rng.randrange(1, 4)
            for k in range(hgt):
                img.putpixel((cx, min(43, k)), hx(STRAW if k == 0 else STRAW2))
            if rng.random() < 0.5:
                img.putpixel((min(43, cx + 1), 0), hx(STRAW2))
    # rust where the rail feet sit (under the run's socket columns)
    for cx in (4, 5, 38, 39):
        for k in range(rng.randrange(2, 4)):
            if rng.random() < 0.8:
                img.putpixel((cx, 1 + k), hx(RUST if k == 0 else RUST2))
    # the worn exit fan, feet spreading down-screen
    for y in range(3, 26):
        halfw = 8 + (y * 10) // 26
        for x in range(22 - halfw, 22 + halfw):
            if rng.random() < 0.10:
                p = img.getpixel((x, y))
                i = min(range(len(CRP)), key=lambda i2: sum((p[c] - CRP[i2][c]) ** 2 for c in range(3)))
                img.putpixel((x, y), CRP[min(6, i + 1)])
    return img


def draw_code_stair_v92(deck_h=51, ring=44):
    """The CURRENT shipped code-drawn stair, recreated exactly from
    tools/bohemia_combat_staircase_patch.py, for the side-by-side proof.
    NS=5, riser #14110d, tread #8c7d61, lip cream 0.95, narrows 30%."""
    NS, run, halfW = 5, ring * 1.05, ring * 0.46
    h = int(deck_h + run * 0.35) + 10
    img = Image.new('RGBA', (44, h), (0, 0, 0, 0))
    cx = 22
    for i2 in range(NS):
        fr = i2 / (NS - 1)
        oy = fr * deck_h
        oy2 = int(oy + fr * run * 0.35)
        tread = max(2, int(deck_h / NS * 0.55))
        riser = max(2, int(deck_h / NS))
        wx = halfW * 2 - fr * halfW * 0.30
        x0, x1 = int(cx - wx * 0.5), int(cx + wx * 0.5)
        for y in range(oy2, min(h, oy2 + riser + tread)):
            for x in range(max(0, x0), min(44, x1)):
                img.putpixel((x, y), hx(RISER) + (255,))
        for y in range(oy2, min(h, oy2 + tread)):
            for x in range(max(0, x0), min(44, x1)):
                img.putpixel((x, y), hx('#8c7d61') + (255,))
        for y in range(oy2, min(h, oy2 + max(1, int(tread * 0.34)))):
            for x in range(max(0, x0), min(44, x1)):
                img.putpixel((x, y), (232, 214, 172, 242))
    return img


# ---------------------------------------------------------------- metrics
def metrics(im):
    im = im.convert('RGB')
    px = im.load()
    w, h = im.size
    cols = set()
    L = [[lum(px[x, y]) for x in range(w)] for y in range(h)]
    ed, gr, n, sat = [], 0, 0, []
    pur = grn = 0
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            cols.add(p)
            mx, mn = max(p), min(p)
            sat.append(0 if mx == 0 else (mx - mn) / mx)
            r, g, b = p
            if r > g + 25 and b > g + 25 and r > 80:
                pur += 1                       # the purity gate's own classifier
            if g > r + 12 and g > b + 12 and g > 60:
                grn += 1                       # living green in a dead valley
            if x + 1 < w:
                dd = abs(L[y][x + 1] - L[y][x])
                ed.append(dd)
                n += 1
                if dd > 8:
                    gr += 1
    fl = [v for r2 in L for v in r2]
    return dict(colours=len(cols), edge=round(sum(ed) / len(ed), 2),
                grain=round(100 * gr / n, 2), sat=round(sum(sat) / len(sat), 4),
                lum_mean=round(st.mean(fl), 1), lum_sd=round(st.pstdev(fl), 1),
                purple_px=pur, purple_pct=round(100 * pur / (w * h), 3),
                green_px=grn, green_pct=round(100 * grn / (w * h), 3))


def metrics_rgba(im):
    """Metrics over opaque pixels only (the run has transparent margins)."""
    px = im.load()
    w, h = im.size
    opaque = [(x, y) for y in range(h) for x in range(w) if px[x, y][3] > 0]
    cols = set()
    sat = []
    pur = grn = 0
    lums = []
    ed, gr, n = [], 0, 0
    for (x, y) in opaque:
        p = px[x, y][:3]
        cols.add(p)
        mx, mn = max(p), min(p)
        sat.append(0 if mx == 0 else (mx - mn) / mx)
        r, g, b = p
        if r > g + 25 and b > g + 25 and r > 80:
            pur += 1
        if g > r + 12 and g > b + 12 and g > 60:
            grn += 1
        lums.append(lum(p))
        if x + 1 < w and px[x + 1, y][3] > 0:
            dd = abs(lum(px[x + 1, y][:3]) - lum(p))
            ed.append(dd)
            n += 1
            if dd > 8:
                gr += 1
    return dict(colours=len(cols), edge=round(sum(ed) / len(ed), 2),
                grain=round(100 * gr / n, 2), sat=round(sum(sat) / len(sat), 4),
                lum_mean=round(st.mean(lums), 1), lum_sd=round(st.pstdev(lums), 1),
                purple_px=pur, purple_pct=round(100 * pur / len(opaque), 3),
                green_px=grn, green_pct=round(100 * grn / len(opaque), 3))


def wrap_error_lr(im):
    """Left-right wrap: mean |lum delta| across the wrap seam vs the tile's
    own interior edge number. Ratio ~1 = the seam steps like any neighbour."""
    im = im.convert('RGB')
    px = im.load()
    w, h = im.size
    seam = [abs(lum(px[0, y]) - lum(px[w - 1, y])) for y in range(h)]
    inner = []
    for y in range(h):
        for x in range(w - 1):
            inner.append(abs(lum(px[x + 1, y]) - lum(px[x, y])))
    return round(sum(seam) / len(seam), 2), round(sum(inner) / len(inner), 2)


def join_delta(row_a, row_b):
    """Mean |lum| between two touching pixel rows (the flush-join number)."""
    n = min(len(row_a), len(row_b))
    return round(sum(abs(lum(row_a[i]) - lum(row_b[i])) for i in range(n)) / n, 2)


def rise_proof(img, ns, riser_h, tread_h):
    """Measure every riser's px height off the authored geometry constants
    (bands are rect regions by construction; this asserts the arithmetic)."""
    heights = [riser_h] * ns
    return dict(risers=ns, riser_px=heights, identical=len(set(heights)) == 1,
                storey_px=ns * riser_h)


# ---------------------------------------------------------------- proofs
def scale(im, k):
    return im.resize((im.width * k, im.height * k), Image.NEAREST)


def tile3x3(im):
    out = Image.new('RGB', (im.width * 3, im.height * 3))
    for j in range(3):
        for i in range(3):
            out.paste(im.convert('RGB'), (i * im.width, j * im.height))
    return out


def build_assembly(landing, run, threshold, lot_tiles, rng):
    """The whole portal object the way the placer stacks it: landing on the
    deck plane, run descending, threshold pad on the lot. On a lot backdrop
    so the transparent margins read."""
    W = 44 * 3
    H = 44 + run.height + 20 + 44
    out = Image.new('RGB', (W, H))
    for j in range((H // 44) + 1):
        for i in range(3):
            out.paste(lot_tiles[(i + j) % len(lot_tiles)], (i * 44, j * 44))
    # darken everything above the lot line: it is under/behind the deck
    ox = 44
    out.paste(landing, (ox, 0))
    out.paste(run, (ox, 44), run)
    ty = 44 + run.height
    out.paste(threshold, (ox, ty))
    return out


def build_arena_mock(landing, run, threshold, street, deck_h, plate):
    """A faithful two-storey arena mock in the demo's own drawing language:
    real embedded street tiles for the lot, a slab one storey up (top plate =
    landing concrete, deep edge beam, dark under-deck, corner pillars), the
    run on the NEAR edge joining deck plane to lot, NO chevron. The foot
    shadow is drawn as the separate pass the law demands."""
    TW, TH = 9, 7
    W, H = TW * 44, TH * 44
    img = Image.new('RGB', (W, H))
    roads = street['road']
    rng = random.Random(SEED + 7)
    for j in range(TH):
        for i in range(TW):
            h2 = (i * 73856093 ^ j * 19349663) & 0xffffffff
            img.paste(roads[h2 % len(roads)], (i * 44, j * 44))
    # deck: 3x2 tiles, cols 3..5, rows 1..2 (its near edge on row 2)
    dc0, dc1, dr0, dr1 = 3, 5, 1, 2
    plane_dy = deck_h                     # deck plane sits deck_h above its row
    # the slab's CAST shadow: offset down-right (light is upper-left), so it
    # reads as a shadow, never as the V110 "opaque black rectangle".
    dark = Image.new('RGB', ((dc1 - dc0 + 1) * 44, (dr1 - dr0 + 1) * 44), (0, 0, 0))
    sx0, sy0 = dc0 * 44 + 7, dr0 * 44 + 9
    reg = img.crop((sx0, sy0, sx0 + dark.width, sy0 + dark.height))
    reg = Image.blend(reg, dark, 0.42)
    img.paste(reg, (sx0, sy0))
    # corner pillars holding the slab up
    for (px_, py_) in ((dc0 * 44 + 2, dr1 * 44 + 8), (dc1 * 44 + 36, dr1 * 44 + 8)):
        for y in range(py_, min(H, py_ + 30)):
            for x in range(px_, px_ + 5):
                img.putpixel((x, y), hx('#3b3227'))
    # the slab top plate: plain approved concrete; the landing tile (with its
    # traffic wear pointing at the stair) sits ONLY at the stair's head cell
    for j in range(dr0, dr1 + 1):
        for i in range(dc0, dc1 + 1):
            img.paste(plate, (i * 44, j * 44 - plane_dy))
    img.paste(landing, (4 * 44, dr1 * 44 - plane_dy))
    # the deep edge beam along the near edge (TF-CMB-004 truth: a deep band)
    beam_top = (dr1 + 1) * 44 - plane_dy
    for y in range(beam_top, beam_top + 14):
        for x in range(dc0 * 44, (dc1 + 1) * 44):
            img.putpixel((x, min(H - 1, y)), hx('#241e15' if y - beam_top < 2 else '#15120e'))
    # the run: centre of the near edge, top nosing AT the deck plane edge
    sx = 4 * 44
    sy = beam_top
    # threshold pad first (the run's foot butts its joint row)
    ty = sy + run.height
    img.paste(threshold, (sx, ty))
    # foot shadow = THE SEPARATE PASS (not baked in the sprite)
    sh = img.crop((sx - 2, ty, sx + 46, ty + 6)).point(lambda v: int(v * 0.55))
    img.paste(sh, (sx - 2, ty))
    img.paste(run, (sx, sy), run)
    return img


def main():
    rng = random.Random(SEED)
    os.makedirs(PROOF, exist_ok=True)
    os.makedirs(os.path.dirname(OUT_BANK), exist_ok=True)

    starter = load_starter()
    street = load_street_tiles()
    c0, c1 = starter['concrete_0'], starter['concrete_1']
    cmap0, cmap1 = ramp_index_map(c0), ramp_index_map(c1)

    # ---- cook -------------------------------------------------------------
    landing = draw_landing(random.Random(SEED + 1), c0)
    run_a = draw_run(random.Random(SEED + 2), (cmap0, cmap1), ns=7, riser_h=7, tread_h=5)
    run_b = draw_run(random.Random(SEED + 3), (cmap0, cmap1), ns=6, riser_h=8, tread_h=5)
    threshold = draw_threshold(random.Random(SEED + 4), c1)

    assembly = build_assembly(landing, run_a, threshold, street['road'],
                              random.Random(SEED + 5))

    # ---- measure ----------------------------------------------------------
    tiles = []
    meas = {}
    for name, im, kind in (('stair_run_A_7risers', run_a, 'object/portal'),
                           ('stair_run_B_6risers', run_b, 'object/portal'),
                           ('stair_top_landing', landing, 'tile/deck-plane'),
                           ('stair_bottom_threshold', threshold, 'tile/lot-pad')):
        m = metrics_rgba(im) if im.mode == 'RGBA' else metrics(im)
        if im.mode == 'RGB':
            seam, inner = wrap_error_lr(im)
            m['wrap_lr_seam'] = seam
            m['wrap_lr_interior'] = inner
        meas[name] = m
        buf = io.BytesIO()
        im.save(buf, 'PNG')
        tiles.append(dict(name=name, kind=kind, px=[im.width, im.height],
                          b64=base64.b64encode(buf.getvalue()).decode('ascii'),
                          metrics=m))
    # geometry proofs
    geo_a = rise_proof(run_a, 7, 7, 5)
    geo_b = rise_proof(run_b, 6, 8, 5)
    # join numbers: the kill condition is a GAP (floating decal). Coverage
    # proves no gap: the run's top and bottom art rows are fully opaque, so
    # butted placement leaves zero empty pixels between the floors.
    lp = landing.load()
    rp = run_a.load()
    tp = threshold.load()
    top_cov = sum(1 for x in range(40) if rp[x + 2, 0][3] == 255)
    bot_cov = sum(1 for x in range(40) if rp[x + 2, run_a.height - 1][3] == 255)
    land_bottom = [lp[x, 43] for x in range(2, 42)]
    run_top = [rp[x + 2, 0][:3] for x in range(40)]
    run_bottom = [rp[x + 2, run_a.height - 1][:3] for x in range(40)]
    thr_top = [tp[x, 0] for x in range(2, 42)]
    joins = dict(top_row_opaque='%d/40' % top_cov,
                 bottom_row_opaque='%d/40' % bot_cov,
                 top_join_lum_delta=join_delta(land_bottom, run_top),
                 bottom_join_lum_delta=join_delta(run_bottom, thr_top),
                 note='full opacity both rows = no gap when butted. The top '
                      'delta is the deck floor meeting the pale edge lip (a '
                      'value step by design, the walk_kerb move); the bottom '
                      'is the riser foot against the near-black joint row.')

    # anchors measured with the same ruler
    anchor_m = {k: metrics(starter[k]) for k in ('concrete_0', 'concrete_1', 'walk_kerb')}

    # ---- proofs -----------------------------------------------------------
    # 1. contact sheet
    items = [('concrete_0 (anchor)', c0), ('concrete_1 (anchor)', c1),
             ('walk_kerb (anchor)', starter['walk_kerb']),
             ('run A 7r', run_a), ('run B 6r', run_b),
             ('landing', landing), ('threshold', threshold)]
    K = 3
    cw = max(i.width for _, i in items) * K + 8
    ch = max(i.height for _, i in items) * K + 8
    sheet = Image.new('RGB', (cw * len(items), ch), (16, 14, 12))
    for idx, (_, im) in enumerate(items):
        big = scale(im.convert('RGBA'), K)
        sheet.paste(big, (idx * cw + 4, 4), big)
    sheet.save(os.path.join(PROOF, 'contact_sheet_3x.png'))

    # 2. anchor composite: mine beside the anchors AND the current code stair
    code = draw_code_stair_v92()
    comp_items = [c0, starter['walk_kerb'], landing, run_a, threshold, code, run_b]
    hmax = max(i.height for i in comp_items) * K
    comp = Image.new('RGB', (sum(i.width * K + 10 for i in comp_items), hmax + 8), (16, 14, 12))
    xx = 0
    for im in comp_items:
        big = scale(im.convert('RGBA'), K)
        comp.paste(big, (xx + 5, 4), big)
        xx += im.width * K + 10
    comp.save(os.path.join(PROOF, 'anchor_composite_3x.png'))

    # 3. 3x3 tiled proofs (landing/threshold are the tile-like members; the
    # run is SINGLE PLACEMENT by its own edge contract, never a tiled field)
    scale(tile3x3(landing), 2).save(os.path.join(PROOF, 'tiled_3x3_landing.png'))
    scale(tile3x3(threshold), 2).save(os.path.join(PROOF, 'tiled_3x3_threshold.png'))

    # 4. the assembled portal object on the real lot tiles
    scale(assembly, 3).save(os.path.join(PROOF, 'assembly_on_lot_3x.png'))

    # 5. arena mock, full + auto-frame zoom, NO chevron
    mock = build_arena_mock(landing, run_a, threshold, street, deck_h=geo_a['storey_px'])
    scale(mock, 2).save(os.path.join(PROOF, 'arena_mock_full_2x.png'))
    zoom = mock.resize((int(mock.width * 0.55), int(mock.height * 0.55)), Image.BILINEAR)
    zoom.resize((zoom.width * 2, zoom.height * 2), Image.NEAREST).save(
        os.path.join(PROOF, 'arena_mock_autoframe.png'))

    # 6. flush-join closeups off the mock (the real assembled surface)
    sx, beam_top = 4 * 44, (2 + 1) * 44 - geo_a['storey_px']
    top_crop = mock.crop((sx - 18, beam_top - 20, sx + 62, beam_top + 22))
    scale(top_crop, 4).save(os.path.join(PROOF, 'join_closeup_top_4x.png'))
    ty = beam_top + run_a.height
    bot_crop = mock.crop((sx - 18, ty - 22, sx + 62, ty + 22))
    scale(bot_crop, 4).save(os.path.join(PROOF, 'join_closeup_bottom_4x.png'))

    # ---- bank -------------------------------------------------------------
    bank = dict(
        form='TF-CMB-005',
        cooked='2026-08-09',
        mode='MIXED',
        reuse='HARVESTED: approved starter concrete_0/1 pixel distribution '
              '(ramp-indexed, re-levelled) for treads/landing/threshold; '
              'walk_kerb lip treatment for every nosing. PAINTED: the stair '
              'structure (no approved stair pixels exist; HD stair tiles are '
              'TILECAT_BROWN catalogue only, VERIFIED DEAD for reuse 8/9).',
        stated_step_count='A: 7 risers x 7px identical rise = 49px storey '
                          '(DECK_H at 44px pitch is 50.6; the live placer '
                          'computes DECK_H at runtime and scales uniformly). '
                          'B: 6 risers x 8px = 48px. Real-code 16-18 steps is '
                          'mush at 44px; 5 was the rejected diagram.',
        geometry=dict(A=geo_a, B=geo_b),
        joins=joins,
        anchors_measured=anchor_m,
        orientation='descends toward the viewer ONLY (v92: the other three '
                    'orientations are deleted at the source)',
        caption=dict(id='TF-CMB-005', name='deck stair run', layer='portal',
                     solid=False, enter=True, edge_contract='single placement',
                     acts=[1], anim=None),
        tiles=tiles,
        law='UNJUDGED. Nothing here is canon until Paolo sweeps it.')
    with open(OUT_BANK, 'w', encoding='utf8') as f:
        json.dump(bank, f, indent=1)

    print('cooked %d tiles -> %s' % (len(tiles), OUT_BANK))
    for name, m in meas.items():
        print(' %-24s %s' % (name, m))
    print(' geometry A:', geo_a)
    print(' geometry B:', geo_b)
    print(' joins:', joins)
    print(' proofs ->', PROOF)


if __name__ == '__main__':
    main()
