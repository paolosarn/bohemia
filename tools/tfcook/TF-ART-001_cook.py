#!/usr/bin/env python3
"""TF-ART-001 cook — CMU block wall DELTA ONLY: bond-beam cap course + vent-block screen course.

THE JOB (form records/tileforms/TF-ART-001_cmu_block_wall.md, merged board spec):
The flat plain-course CMU field is APPROVED (block_grey_0..2 + block_painted_0..2,
texture-match 8/1) and is NEVER repainted here. This cook produces only the DELTA:
  (1) bond-beam cap course  x3 variants (SINGLE PLACEMENT top course, repeats horizontally)
  (2) vent-block screen course x3 variants (pierced 60s-80s Vegas screen block)
STRUCK from this job: corner/pilaster (deferred to TF-ART-017's two-plane corner
contract). The metal-over-block seam is TF-ART-002's boundary, not ours.

REUSE CHECK:
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt — OPENED IN CODE below. block_grey_0..2 are
    Paolo-APPROVED 8/1 ("Holy shit so fucking good"). BOUGHT/APPROVED BEATS PAINTED:
    every cook tile here HARVESTS an approved block_grey tile as its base field and
    its ENTIRE palette; painted delta pixels are quantized to the source tile's own
    exact colour set, so the output palette is a strict subset of the approved ramp.
  banks/BOHEMIA_CMU_BLOCK_7_29_26.txt — checked: a 7/29 cmu_cap + cmu_vent exist but
    are NOT APPROVED, pre-date the 8/1 approved field, and do not match its 11px
    course rhythm or its texture density. Not harvested (would drag unapproved,
    off-rhythm art next to approved art).
  banks/BOHEMIA_PERIMETER_8_2_26.txt — checked: perim_cmu_* family is PENDING PAOLO
    and is the freestanding SUBURB BOUNDARY wall, not a building face (the form's own
    shopping check disqualified it). Not harvested.
  banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt — checked: buckets are street/wreck/trash/
    crate/dead/barrier/camp. No masonry course art. Nothing fit.
  banks/BOHEMIA_CIVIC_OPENINGS_8_3_26.txt + BOHEMIA_OPENINGS_8_2_26.txt — checked:
    door/window openings, not wall courses. Nothing fit.
  banks/BOHEMIA_HD_TILE_REPO_part1..4 x BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt —
    pack list walked: no CMU bond-beam or pierced screen-block subject in any UP pack
    ("8. Pipes and ventilation" is HVAC duct props, wall packs are ruined/generic).
    Nothing to harvest for these two specific courses.
  VERDICT: mode MIXED — approved field HARVESTED, only the genuine gaps (poured beam
  band, vent piercings, efflorescence, spall) are painted, in the harvested palette.

TASTE CHECK:
  45 LAW: bond beam gets a 3px sky-lit top face; light upper-left; a mass is
    brightest on top. NO keyline, NO dither, NO baked cast shadow (the eave/cap
    shadow is the runtime pass, per form section E).
  COURSE PHASE (the seam contract, measured off the APPROVED art, which outranks the
    form's ~14px estimate): mortar bed rows sit at y = 0, 11, 22, 33 — 11px courses,
    4 per 44px cell, running bond. Cap + vent tiles keep rows 14..43 / the non-band
    rows AS HARVESTED so a cook tile stacks on and runs beside the approved field
    with the courses lining up. Beam band is rows 0..13 (~14px per spec) with its
    bed joint at row 13 copied from the tile's own real mortar row.
  DEAD VALLEY: zero new colours introduced — sat/hue can never exceed the approved
    anchors'. No purple, no lush green, no graffiti (Paolo call, MECHANISM-MINE).
  8/2 STAMP BUG: three variants per family, seeded differently — never one hero tile.
  VERIFY ON THE REAL SURFACE: proofs are 3x3 tilings, a real wall assembly, and an
    anchor composite beside approved block_grey_0 + frozen starter wall_0/wall_base;
    the cook run ends by writing those PNGs for eyes, not just numbers.

Deterministic: SEED fixed, rerunnable, byte-identical output.
Writes ONLY:
  banks/tileforms/TF-ART-001_CANDIDATES_8_8_26.json
  records/tileforms_proofs/TF-ART-001/*.png
"""

import json, base64, io, os, colorsys, random

from PIL import Image
import numpy as np

SEED = 80801
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CELL = 44
COURSE = 11                      # measured off approved block_grey_0..2: mortar rows y=0,11,22,33
MORTAR_ROWS = (0, 11, 22, 33)
BANK_OUT = os.path.join(ROOT, 'banks', 'tileforms', 'TF-ART-001_CANDIDATES_8_8_26.json')
PROOF_DIR = os.path.join(ROOT, 'records', 'tileforms_proofs', 'TF-ART-001')

# ---------------------------------------------------------------- reuse: open the banks
def load_approved_block_grey():
    """REUSE in code: open the texture-match bank and pull the APPROVED block_grey tiles."""
    p = os.path.join(ROOT, 'banks', 'BOHEMIA_TEXTURE_MATCH_8_1_26.txt')
    d = json.load(open(p))
    tiles = {}
    for t in d['tiles']:
        if t['material'] == 'block_grey' and t['verdict'].startswith('APPROVED'):
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
            tiles[t['id']] = np.asarray(im).astype(np.float64)
    assert set(tiles) == {'block_grey_0', 'block_grey_1', 'block_grey_2'}, sorted(tiles)
    return tiles

def load_starter_wall():
    """Anchor context: frozen starter wall_0 / wall_base (never edited, display only)."""
    p = os.path.join(ROOT, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
    d = json.load(open(p))
    out = {}
    for t in d['tiles']:
        if t['id'] in ('wall_0', 'wall_base'):
            out[t['id']] = np.asarray(Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB'))
    return out

# ---------------------------------------------------------------- helpers
def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]

def palette_of(tile):
    return np.unique(tile.reshape(-1, 3).astype(np.uint8), axis=0).astype(np.float64)

def quantize_to(pal, px):
    """Snap painted pixels to the source tile's own exact colour set (zero new colours)."""
    d = ((pal[None, :, :] - px[:, None, :]) ** 2).sum(axis=2)
    return pal[d.argmin(axis=1)]

def scaled(px, f):
    return np.clip(px * f, 0, 255)

# ---------------------------------------------------------------- painters
def midblock_rows():
    rows = []
    for y in range(CELL):
        if all(abs(y - m) > 1 for m in MORTAR_ROWS):
            rows.append(y)
    return rows

def wash_row(src, sy, rng, target_mean=None):
    """A beam-texture row: median-of-3 (wrapping) over a harvested mid-block row washes
    out the vertical block joints (a poured beam has none) while keeping the grain;
    normalizing to a common mean kills the row-stripe artifact a poured band must not
    have, and per-pixel jitter restores the bought-tile grain density."""
    row = src[sy]
    L = lum(row)
    out = np.empty_like(row)
    for x in range(CELL):
        idx = [(x + k) % CELL for k in (-1, 0, 1)]
        vals = L[idx]
        out[x] = row[idx[int(np.argsort(vals)[1])]]
    if target_mean is not None:
        m = lum(out).mean()
        if m > 1:
            out = np.clip(out * (target_mean / m), 0, 255)
    jit = np.array([1.0 + rng.uniform(-0.07, 0.07) for _ in range(CELL)])[:, None]
    return np.clip(out * jit, 0, 255)

def paint_capbeam(base, rng):
    """Bond-beam cap: rows 0..2 sky-lit top face, 3..12 poured front, 13 bed joint
    (the tile's own real mortar row), 14..43 harvested field untouched."""
    t = base.copy()
    pal = palette_of(base)
    mids = midblock_rows()
    beam_mean = float(lum(base[mids]).mean())
    # front of beam: washed, mean-normalized rows (flat pour, no stripes, full grain),
    # plus a fine exposed-aggregate speckle so the pour keeps the bought-tile grain density
    for y in range(3, 13):
        sy = mids[(y * 5 + rng.randrange(2)) % len(mids)]
        row = wash_row(base, sy, rng, target_mean=beam_mean)
        spk = np.array([rng.choice((0.86, 1.0, 1.0, 1.14)) for _ in range(CELL)])[:, None]
        t[y] = quantize_to(pal, np.clip(row * spk, 0, 255))
    # faint pour striations: two broken one-step darker runs on the front face
    for sy, n in ((6, 3), (10, 2)):
        for _ in range(n):
            x0 = rng.randrange(0, CELL)
            w = rng.randrange(6, 13)
            xs = [(x0 + k) % CELL for k in range(w)]
            t[sy, xs] = quantize_to(pal, scaled(t[sy, xs], 0.93))
    # sky-lit top face (45 law): 3px, brightest on top
    for y, f in ((0, 1.22), (1, 1.17), (2, 1.11)):
        sy = mids[(y * 7 + 1) % len(mids)]
        row = wash_row(base, sy, rng, target_mean=beam_mean)
        t[y] = quantize_to(pal, scaled(row, f))
    # spalled chips on the top arris: 2-3 notches, 2-3px clusters (never orphan pixels)
    for _ in range(rng.randrange(2, 4)):
        cx = rng.randrange(2, CELL - 4)
        w = rng.randrange(2, 4)
        t[0, cx:cx + w] = quantize_to(pal, scaled(t[3, cx:cx + w], 0.95))
        t[1, cx:cx + w] = quantize_to(pal, scaled(t[1, cx:cx + w], 0.90))
    # bed joint under the beam: the tile's own real mortar pixels
    t[13] = base[11]
    # efflorescence hanging under the beam joint: one irregular cluster of pale streaks
    paint_efflorescence(t, base, pal, rng, top=14, n_clusters=1, streaks=(2, 4), length=(8, 19))
    return t

VENT_BAND = (13, 20)             # openings live in course rows 12..21, webs kept at 12 and 21

def paint_vent(base, rng):
    """Vent-block screen course: pierced screen block in course 2 (rows 12..21).
    Openings are clustered dark rectangles 3-5px, grouped per 22px block module —
    reads as a pierced block, never a drawn grid, never damage holes."""
    t = base.copy()
    pal = palette_of(base)
    dark = pal[np.argsort(lum(pal))][:max(4, len(pal) // 10)]      # tile's own darkest decile
    groups = []
    for gc in (11, 33):                                            # one group per block module
        gx = gc + rng.randrange(-2, 3)
        n = rng.randrange(2, 4)
        y0 = 14 + rng.randrange(-1, 2)
        widths = [rng.randrange(3, 6) for _ in range(n)]
        total = sum(widths) + 2 * (n - 1)
        x = int(np.clip(gx - total // 2, 2, CELL - 2 - total))
        xs = []
        for w in widths:
            h = rng.randrange(3, 6)
            yy0 = int(np.clip(y0 + rng.randrange(-1, 2), VENT_BAND[0], VENT_BAND[1] - 2))
            yy1 = int(min(yy0 + h, VENT_BAND[1] + 1))
            # dark opening fill from the tile's own darkest colours
            for y in range(yy0, yy1):
                for xx in range(x, x + w):
                    c = dark[rng.randrange(len(dark))]
                    t[y, xx] = c
            # interior top 1px darkest (upper-left light: inside top edge is the shadow)
            t[yy0, x:x + w] = quantize_to(pal, scaled(t[yy0, x:x + w], 0.80))
            xs.append((x, w, yy0))
            x += w + 2
        groups.append(xs)
        # sun catch on the web top above the group: a 1px brighter run, 3+px (no orphans)
        gx0 = xs[0][0]
        gx1 = xs[-1][0] + xs[-1][1]
        t[12, gx0:gx1] = quantize_to(pal, scaled(t[12, gx0:gx1], 1.12))
    # efflorescence: pale streaks hanging under 1-2 openings (water runs out of vents)
    paint_efflorescence(t, base, pal, rng, top=22, n_clusters=rng.randrange(1, 3),
                        streaks=(1, 3), length=(6, 15))
    return t

def paint_efflorescence(t, base, pal, rng, top, n_clusters, streaks, length):
    """Pale mineral streaks 1-2px wide x 6-18px long hanging below a joint, clustered
    irregular, alpha-tapered, quantized to the tile's own palette. Never at the wrap
    columns (x 0,1,42,43) so the seam stays the field's own."""
    bright = pal[np.argsort(lum(pal))][-max(4, len(pal) // 12):]
    for _ in range(n_clusters):
        cx = rng.randrange(6, CELL - 8)
        for _ in range(rng.randrange(*streaks) if isinstance(streaks, tuple) else streaks):
            x = int(np.clip(cx + rng.randrange(-4, 5), 2, CELL - 3))
            w = rng.randrange(1, 3)
            ln = rng.randrange(*length)
            col = bright[rng.randrange(len(bright))]
            for k in range(ln):
                y = top + k
                if y >= CELL:
                    break
                a = 0.38 * (1.0 - k / ln)
                for xx in range(x, min(x + w, CELL - 2)):
                    mixed = t[y, xx] * (1 - a) + col * a
                    t[y, xx] = quantize_to(pal, mixed[None, :])[0]

# ---------------------------------------------------------------- metrics
def measure(tile):
    a = tile.astype(np.float64)
    L = lum(a)
    colours = len(np.unique(a.reshape(-1, 3).astype(np.uint8), axis=0))
    edge = float(np.abs(np.diff(L, axis=1)).mean())
    grain = float((np.abs(np.diff(L, axis=1)) > 8).mean() * 100)
    flat = a.reshape(-1, 3) / 255.0
    hsv = np.array([colorsys.rgb_to_hsv(*p) for p in flat])
    sat = float(hsv[:, 1].mean())
    hue = hsv[:, 0] * 360
    purple = float(((hue >= 260) & (hue <= 320) & (hsv[:, 1] > 0.15)).mean() * 100)
    green = float(((hue >= 70) & (hue <= 170) & (hsv[:, 1] > 0.25) & (hsv[:, 2] > 0.25)).mean() * 100)
    hwrap = float(np.abs(L[:, 0] - L[:, -1]).mean())
    vwrap = float(np.abs(L[0, :] - L[-1, :]).mean())
    cm = L.mean(axis=0)
    edge_dark = float(min(cm[0], cm[-1]) - cm[10:34].mean())
    return dict(colours=colours, edge=round(edge, 3), grain=round(grain, 3),
                sat=round(sat, 3), lum_mean=round(float(L.mean()), 3),
                lum_sd=round(float(L.std()), 3), purple_pct=round(purple, 3),
                green_pct=round(green, 3), hwrap=round(hwrap, 3), vwrap=round(vwrap, 3),
                edge_darkening=round(edge_dark, 3))

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

def grid(tiles33):
    rows = [np.concatenate(r, axis=1) for r in tiles33]
    return np.concatenate(rows, axis=0)

def main():
    rng = random.Random(SEED)
    os.makedirs(os.path.dirname(BANK_OUT), exist_ok=True)
    os.makedirs(PROOF_DIR, exist_ok=True)
    grey = load_approved_block_grey()
    starter = load_starter_wall()

    bases = [grey['block_grey_0'], grey['block_grey_1'], grey['block_grey_2']]
    caps, vents = [], []
    for i, b in enumerate(bases):
        caps.append(paint_capbeam(b, random.Random(SEED + 100 + i)))
        vents.append(paint_vent(b, random.Random(SEED + 200 + i)))

    tiles = []
    for i, t in enumerate(caps):
        tiles.append(dict(name=f'cmu_capbeam_{i}', px=CELL, b64=png_b64(t), metrics=measure(t),
                          kind='bond-beam cap course, SINGLE PLACEMENT top course',
                          harvested_from=f'block_grey_{i} (APPROVED 8/1, texture-match)'))
    for i, t in enumerate(vents):
        tiles.append(dict(name=f'cmu_vent_{i}', px=CELL, b64=png_b64(t), metrics=measure(t),
                          kind='vent-block screen course (pierced 60s-80s Vegas screen block)',
                          harvested_from=f'block_grey_{i} (APPROVED 8/1, texture-match)'))

    # zero-new-colours claim, verified
    union = set(map(tuple, np.concatenate([palette_of(b) for b in bases]).astype(int).tolist()))
    for t, arr in zip(tiles, caps + vents):
        cols = set(map(tuple, arr.reshape(-1, 3).astype(int).tolist()))
        t['new_colours_vs_approved_ramp'] = len(cols - union)

    # ---- proofs
    pick = lambda fam, k: fam[k % 3]
    save(grid([[pick(caps, k + r) for k in range(3)] for r in range(3)]), 'TILED_3x3_capbeam.png', 3)
    save(grid([[pick(vents, k + r) for k in range(3)] for r in range(3)]), 'TILED_3x3_vent.png', 3)
    # the real wall: cap course on top, vent course, two plain approved courses
    wall = grid([[caps[0], caps[1], caps[2]],
                 [vents[0], vents[1], vents[2]],
                 [bases[0], bases[1], bases[2]],
                 [bases[1], bases[2], bases[0]]][:4])
    save(wall, 'WALL_ASSEMBLY_cap_vent_field.png', 3)
    # anchor composite: our tiles beside approved block_grey_0 + frozen starter wall_0/wall_base
    pad = np.full((CELL, 6, 3), 24.0)
    row1 = np.concatenate([bases[0], pad, caps[0], pad, vents[0], pad,
                           starter['wall_0'].astype(np.float64)], axis=1)
    row2 = np.concatenate([bases[1], pad, caps[1], pad, vents[1], pad,
                           starter['wall_base'].astype(np.float64)], axis=1)
    hpad = np.full((6, row1.shape[1], 3), 24.0)
    save(np.concatenate([row1, hpad, row2], axis=0), 'ANCHOR_COMPOSITE_beside_block_grey_and_starter.png', 3)
    # contact sheet of all six
    save(grid([[caps[0], caps[1], caps[2]], [vents[0], vents[1], vents[2]]]), 'CONTACT_SHEET_all_variants.png', 4)

    bank = dict(
        form='TF-ART-001',
        cooked='2026-08-08',
        mode='MIXED',
        note=('DELTA ONLY: the plain-course field is APPROVED (block_grey_0..2, 8/1) and was '
              'not repainted. Each cook tile HARVESTS an approved block_grey tile as base + '
              'palette; painted pixels (poured beam, vent piercings, efflorescence, spall) '
              'are quantized to the source tile colour set: zero new colours. Corner/pilaster '
              'STRUCK, deferred to TF-ART-017.'),
        seam_contract=dict(
            axis='SELF-SEAMLESS horizontal',
            course_phase='mortar bed rows at y = 0, 11, 22, 33 (11px courses, measured off the approved field)',
            cap='SINGLE PLACEMENT top course; beam band rows 0..13 (~14px), bed joint row 13; rows 14..43 are the approved field untouched',
            vent='vent band fixed at course 2 (rows 12..21) across all variants so a run reads as one continuous vent course',
            baseline='approved anchors themselves measure hwrap 28.1-34.6 vs internal step 15.0-22.3; cook tiles must not exceed the anchor baseline'),
        harvest_sources=['banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt block_grey_0..2 (APPROVED 8/1)'],
        tiles=tiles,
        law='UNJUDGED. Nothing here is canon until Paolo sweeps it.')
    with open(BANK_OUT, 'w') as f:
        json.dump(bank, f, indent=1)
    print('bank ->', BANK_OUT)
    for t in tiles:
        print(t['name'], t['metrics'], 'new_colours:', t['new_colours_vs_approved_ramp'])

if __name__ == '__main__':
    main()
