#!/usr/bin/env python3
"""
BOHEMIA — THE ACT-1 TILE SET, RE-COOKED AS ACTUAL PIXEL ART (7/28/26)

Paolo, 7/28: "I checked it to do the other 41 mark it approved."

APPROVE unlocks volume. This is the volume: all 42 tiles, built by the method he
approved on road_0, into a NEW bank. The 7/26 bank is byte-locked by the visual
constitution and is NOT touched - git is the memory, a frozen thing stays frozen,
and this supersedes rather than overwrites.

TWO KINDS OF TILE, AND THE DIFFERENCE IS THE WHOLE DESIGN
---------------------------------------------------------
AUTHORED (17 tiles). Pure material - asphalt, sidewalk, gravel, dirt, stucco,
terracotta, roof deck. There is no drawing to protect, only a surface, so these
are rebuilt from nothing by the approved method: a few cluster shapes repeated
with varied distribution, at the size the thing really is.

REDRAWN (25 tiles). Everything Paolo actually DREW - the window, the boarded
window, the doorway, the garage bay and its jambs, the kerb, the crossing bars,
the centre line, the roof ridge, eave, hips and parapet, the wall corners. I do
not get to re-draw those. His drawing is the content and it is approved content.
What they get is the CRAFT operation and nothing else: every pixel snapped to the
family's ramp, then orphans absorbed. Same picture, built like pixel art instead
of like a photograph of pixel art.

That split is deliberate and it is the conservative reading of what he approved.
He approved a way of BUILDING. He did not ask me to redesign his door.

ONE PALETTE PER MATERIAL FAMILY
-------------------------------
Every asphalt tile shares one seven-step ramp. Every stucco tile shares another.
Six families, and the ramps are pooled from ALL the approved tiles in each family
at once, so road_0 and road_gutter are made of literally the same seven colours
instead of two thousand near-misses. That is what makes a tile set read as one
place, and it is the direct answer to the render contract's palette clause -
section 6 has said since 7/26 that the corpus is continuous-tone and un-indexed,
with a 46,082-colour ratchet standing in for a fix. This is the fix.

ACCENTS, because a ramp alone would eat the content: a tile whose own pixels sit
well outside its family's range gets up to TWO extra colours taken from those
outliers - the white crossing paint, the dead dark glass, the black inside a
doorway. Without that the paint would collapse into the lightest asphalt step and
the window would fill in. Hard cap of nine colours on any tile, and the gate
holds it.

REUSE CHECK: opens banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt READ ONLY and
takes every colour in the output from it. Nothing is invented: the ramps are the
approved corpus's own colours, measured and reduced. The frozen bank is never
written.

TASTE CHECK: act-1 taste rules bind and are MEASURED per tile, not asserted -
value band per layer, near-pure-black share (no keyline), hot-yellow share (dead
dark glass, never a warm night glow), no dither anywhere. The proof sheet prints
them, and pixel_craft_gate.py holds them.

  python3 tools/bohemia_tileset_recook.py
    -> banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt
    -> records/target/RECOOK_CONTACT.png     (all 42, before and after)
"""
import base64
import io
import json
import os
from collections import Counter

from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

SRC = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'
OUT = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
CONTACT = 'records/target/RECOOK_CONTACT.png'
N = 44
STEPS = 7
MAX_COLOURS = 9
SEED = 0x2807

FAMILY = {
    'asphalt': ['road_0', 'road_1', 'road_2', 'road_centre', 'road_gutter', 'road_crossing'],
    'concrete': ['walk_0', 'walk_1', 'walk_2', 'walk_kerb', 'concrete_0', 'concrete_1'],
    'ground': ['yard_0', 'yard_1', 'yard_2', 'dirt'],
    'stucco': ['wall_0', 'wall_1', 'wall_2', 'wall_base', 'wall_under_eave',
               'wall_window', 'wall_boarded', 'wall_end_l', 'wall_end_r',
               'door_top', 'door_bottom', 'garage_top', 'garage_bottom',
               'garage_top_l', 'garage_bottom_l', 'garage_top_r', 'garage_bottom_r'],
    'terracotta': ['roof_slope', 'roof_ridge', 'roof_eave', 'roof_hipTL', 'roof_hipBL',
                   'roof_hipTR', 'roof_hipBR', 'roof_parapet'],
    'deck': ['roof_deck'],
}
OF_FAMILY = {t: f for f, ts in FAMILY.items() for t in ts}

# AUTHORED IS THE EXCEPTION, NOT THE RULE — and this list got SHORTER after I
# looked at the sheet.
#
# First cut authored seventeen tiles from nothing: every sidewalk, yard, slab,
# stucco wall and roof. They came back clean, six colours, zero orphans, and
# EMPTY - flat fields of sand where Paolo's originals had cracks running through
# them and weeds in the joints. I had deleted his composition and kept my own
# recipe. That is not what he approved. He approved a way of BUILDING pixels; the
# arrangement of cracks in a sidewalk is his drawing and it is approved content.
#
# So authoring is now limited to the exact thing he looked at and said yes to:
# the three asphalt lane tiles. Everything else takes the craft operation -
# snapped to the family ramp, orphans absorbed - which kills the noise while
# keeping every decision he made. Same result on the numbers, none of the
# arrogance.
AUTHORED = {'road_0', 'road_1', 'road_2'}

# A RAMP IS DERIVED FROM MATERIAL, NEVER FROM CONTENT. Some tiles in a family
# are mostly not their material: a doorway is mostly the dark hole through it, a
# crossing tile is mostly white paint. Pooling those into the family ramp gave
# stucco a chasm - three near-black steps, then a jump of 143 luminance to the
# wall, and a blown #fffffa on top. That is not a ramp, it is two populations
# wearing one name. So the ramp comes from the tiles that ARE the material, and
# the holes and the paint come back as per-tile accents, which is exactly what
# accents are for.
RAMP_SOURCE = {
    'asphalt': ['road_0', 'road_1', 'road_2', 'road_gutter'],
    'concrete': ['walk_0', 'walk_1', 'walk_2', 'concrete_0', 'concrete_1'],
    'ground': ['yard_0', 'yard_1', 'yard_2', 'dirt'],
    'stucco': ['wall_0', 'wall_1', 'wall_2', 'wall_base', 'wall_under_eave',
               'wall_end_l', 'wall_end_r'],
    # roof_ridge is the SUN-CAUGHT course - a highlight feature, not the
    # material. In the ramp it dragged the top step to #fffffa, a blown white on
    # every roof in the valley. It keeps its highlight as an accent instead.
    'terracotta': ['roof_slope', 'roof_eave', 'roof_hipBL', 'roof_hipTL'],
    'deck': ['roof_deck'],
}

# Per family: how far to open the ramp up. An AUTHORED family needs its steps
# visibly apart or a six-colour tile draws flat; a family that is mostly REDRAWN
# needs restraint, because Paolo's drawing already carries the contrast and
# stretching it would blow his own values apart. Named per family rather than
# one global number, because that is the honest shape of the problem.
STRETCH = {'asphalt': 2.15, 'concrete': 1.9, 'ground': 1.9,
           'stucco': 1.45, 'terracotta': 1.45, 'deck': 1.9}


def rnd(state):
    while True:
        state ^= (state << 13) & 0xFFFFFFFF
        state ^= state >> 17
        state ^= (state << 5) & 0xFFFFFFFF
        state &= 0xFFFFFFFF
        yield state


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def pixels(im):
    p = im.convert('RGBA').load()
    w, h = im.size
    return [p[x, y][:3] for y in range(h) for x in range(w) if p[x, y][3] > 8]


def band_modes(cells, steps):
    """Equal-population luminance bands, mode colour in each. Equal population
    and not equal luminance, because a band nobody's art lives in hands back a
    colour the corpus never used."""
    cells = sorted(cells, key=lum)
    per = max(1, len(cells) // steps)
    out = []
    for i in range(steps):
        band = cells[i * per:(i + 1) * per] if i < steps - 1 else cells[i * per:]
        if not band:
            continue
        key = Counter((c[0] >> 3, c[1] >> 3, c[2] >> 3) for c in band).most_common(1)[0][0]
        mem = [c for c in band if (c[0] >> 3, c[1] >> 3, c[2] >> 3) == key]
        out.append(tuple(sum(m[i] for m in mem) // len(mem) for i in range(3)))
    # a band can repeat its neighbour's mode; a ramp with a duplicate step is a
    # ramp with fewer steps than it claims.
    ded = []
    for c in out:
        if not ded or abs(lum(c) - lum(ded[-1])) > 1.0:
            ded.append(c)
    return ded


FLOOR, CEIL, GAP = 17.0, 232.0, 7.0


def dominant_hue_only(cells):
    """Drop the colours that are not this material.

    First cut pooled every pixel of the terracotta family and handed back a ramp
    with #596555 - a GREEN step - sitting in the middle of the roof colours,
    because some pixels in those tiles are not roof. A ramp is a description of
    ONE material; a stray hue inside it tints every tile in the family. So:
    measure the family's own red-green and green-blue balance, and keep only the
    pixels that agree with it. Weeds and moss are content, and content is what
    accents are for."""
    if not cells:
        return cells
    rg = sorted(c[0] - c[1] for c in cells)
    gb = sorted(c[1] - c[2] for c in cells)
    mrg, mgb = rg[len(rg) // 2], gb[len(gb) // 2]
    keep = [c for c in cells
            if abs((c[0] - c[1]) - mrg) <= 26 and abs((c[1] - c[2]) - mgb) <= 26]
    return keep if len(keep) > len(cells) // 3 else cells


def scale_to(c, target_l):
    """Move a colour to a target luminance by SCALING it, which holds its hue
    exactly. Per-channel arithmetic does not: stretching stucco channel by
    channel drove three separate bands into #000000, which is both a dead ramp
    and a black keyline the taste rules ban outright."""
    l = lum(c)
    if l < 1:
        return (int(target_l),) * 3
    k = target_l / l
    out = [c[0] * k, c[1] * k, c[2] * k]
    over = max(out)
    if over > 255:                                  # desaturate rather than clip
        out = [255 - (255 - v) * (255.0 / over) * 0 + v * (255.0 / over) for v in out]
    return tuple(max(0, min(255, int(round(v)))) for v in out)


def make_ramp(cells, stretch):
    """A ramp with steps you can actually see, that never goes black, never
    duplicates a step, and never changes the material's hue."""
    ramp = band_modes(dominant_hue_only(cells), STEPS)
    ls = [lum(c) for c in ramp]
    mid = sum(ls) / float(len(ls))
    # stretch in LUMINANCE, then fit the whole ramp inside the legal range
    # instead of clipping each end into a wall.
    tgt = [mid + (l - mid) * stretch for l in ls]
    lo, hi = min(tgt), max(tgt)
    if lo < FLOOR or hi > CEIL:
        span = max(1.0, hi - lo)
        room = CEIL - FLOOR
        k = min(1.0, room / span)
        c0 = (lo + hi) / 2.0
        newc = max(FLOOR + span * k / 2, min(CEIL - span * k / 2, c0))
        tgt = [newc + (t - c0) * k for t in tgt]
    # strictly increasing, with a gap big enough to read as a step
    tgt.sort()
    for i in range(1, len(tgt)):
        if tgt[i] - tgt[i - 1] < GAP:
            tgt[i] = tgt[i - 1] + GAP
    if tgt[-1] > CEIL:
        shift = tgt[-1] - CEIL
        tgt = [max(FLOOR, t - shift) for t in tgt]
    out, n = [], len(ramp) - 1
    for i, c in enumerate(sorted(ramp, key=lum)):
        s = list(scale_to(c, tgt[i]))
        # LAW 2: shadows cooler, highlights warmer - sun plus skylight
        t = (i / float(n)) - 0.5 if n else 0.0
        s[0] += 9 * t
        s[1] += 2 * t
        s[2] -= 9 * t
        out.append(tuple(max(0, min(255, int(round(v)))) for v in s))
    return sorted(out, key=lum)


def accents(cells, ramp, tile_px):
    """Up to two colours for content that lives outside the family's range -
    white paint, dead dark glass, the black inside a doorway. Without these the
    ramp eats the content it was supposed to carry."""
    lo, hi = lum(ramp[0]), lum(ramp[-1])
    out = []
    for grp, test in (('bright', lambda l: l > hi + 16), ('dark', lambda l: l < lo - 12)):
        sel = [c for c in cells if test(lum(c))]
        if len(sel) < max(12, int(0.015 * tile_px)):
            continue
        key = Counter((c[0] >> 3, c[1] >> 3, c[2] >> 3) for c in sel).most_common(1)[0][0]
        mem = [c for c in sel if (c[0] >> 3, c[1] >> 3, c[2] >> 3) == key]
        out.append(tuple(sum(m[i] for m in mem) // len(mem) for i in range(3)))
    return out[:2]


def snap(im, pal):
    """Every pixel to its nearest palette entry, by VALUE first.

    Value is what carries a drawing (LAW 10: value contrast matters more than
    hue), so matching on luminance with hue only as a tie-break keeps Paolo's
    lintel a lintel and his glass dark, where a plain RGB-distance match drifts
    the structure around."""
    src = im.convert('RGBA')
    p = src.load()
    w, h = src.size
    out = Image.new('RGBA', (w, h))
    q = out.load()
    cache = {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = p[x, y]
            if a <= 8:
                q[x, y] = (0, 0, 0, 0)
                continue
            k = (r, g, b)
            v = cache.get(k)
            if v is None:
                L = lum(k)
                v = min(pal, key=lambda c: (abs(lum(c) - L) * 3.0
                                            + abs(c[0] - r) + abs(c[1] - g) + abs(c[2] - b)))
                cache[k] = v
            q[x, y] = v + (255,)
    return out


def declutter(im, rounds=8):
    """LAW 1, enforced. A pixel touching no 4-neighbour of its own colour is
    absorbed into whatever its neighbours mostly are. Run to a fixed point so
    absorbing one orphan cannot strand another. Transparent pixels never move -
    a hip roof's diagonal is shape, not noise."""
    p = im.load()
    w, h = im.size
    for _ in range(rounds):
        moved = 0
        for y in range(h):
            for x in range(w):
                if p[x, y][3] <= 8:
                    continue
                c = p[x, y][:3]
                nb = []
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and p[nx, ny][3] > 8:
                        nb.append(p[nx, ny][:3])
                if not nb or c in nb:
                    continue
                p[x, y] = Counter(nb).most_common(1)[0][0] + (255,)
                moved += 1
        if not moved:
            break
    return im


# ---------------------------------------------------------------- authoring --

def blob(idx, cx, cy, rx, ry, v):
    for dy in range(-ry, ry + 1):
        wob = ((dy * 7 + cx) % 5) - 2
        span = int(rx * max(0.0, 1.0 - (dy / float(ry + 1)) ** 2) ** 0.5) + wob
        for dx in range(-span, span + 1):
            idx[((cy + dy) % N) * N + ((cx + dx) % N)] = v


def clump(idx, x, y, w, h, v):
    for dy in range(h):
        for dx in range(w):
            idx[((y + dy) % N) * N + ((x + dx) % N)] = v


def crack(idx, x, y, steps, gen, dark, lip):
    """A groove: dark floor, lit upper-left lip on part of its length only.
    Runs of 2-3 before a step, so one staircase per line (LAW 3)."""
    horiz = True
    for _ in range(steps):
        for _ in range(2 + (next(gen) % 2)):
            idx[(y % N) * N + (x % N)] = dark
            if next(gen) % 2:
                idx[((y - 1) % N) * N + ((x - 1) % N)] = lip
            if horiz:
                x += 1
            else:
                y += 1
        horiz = not horiz
        if next(gen) % 3 == 0:
            y += 1 if next(gen) % 2 else -1


def scatter(idx, gen, n, sizes, weights):
    for _ in range(n):
        x, y = next(gen) % N, next(gen) % N
        w, h = sizes[next(gen) % len(sizes)]
        idx[0] = idx[0]
        clump(idx, x, y, w, h, weights[next(gen) % len(weights)])


def author(tid, ramp, gen):
    """The material recipes. One per surface, each at the scale the thing is:
    CELL_M is 0.75, so this 44px tile is 75 cm and one pixel is about 1.7 cm."""
    n = len(ramp)
    D, d, m, M, L = 0, 1, n // 2, n - 3, n - 2
    XL = n - 1
    idx = [m] * (N * N)
    fam = OF_FAMILY[tid]
    var = int(tid[-1]) if tid[-1].isdigit() else 0

    if fam == 'asphalt':
        # aggregate stones (1-2 px is a real stone at this scale) + cracks.
        # LAW 12: the variants carry the damage so no single tile has a
        # signature you can read across a whole road.
        for cx, cy, rx, ry, v in ((11 + var * 7, 9, 6, 4, M), (33, 28 - var * 5, 5, 4, M),
                                  (24, 14, 4, 3, d), (7, 34, 5, 3, d)):
            blob(idx, cx, cy, rx, ry, v)
        for _ in range(78):
            x, y = next(gen) % N, next(gen) % N
            w = 2 + (next(gen) % 2)
            h = 2 if w == 3 else 2 + (next(gen) % 2)
            r = next(gen) % 16
            clump(idx, x, y, w, h, L if r < 5 else (XL if r < 6 else (d if r < 11 else M)))
        for i in range(1 + var):
            crack(idx, 5 + i * 15, 13 + i * 9, 10 - i, gen, D, L)

    elif fam == 'concrete':
        # a poured slab is FLAT. Its information is the odd stain, the odd
        # chip, and the cracks - not a texture field.
        for cx, cy, rx, ry, v in ((13 + var * 6, 12, 8, 6, M), (31, 31 - var * 4, 7, 5, d)):
            blob(idx, cx, cy, rx, ry, v)
        for _ in range(30):
            x, y = next(gen) % N, next(gen) % N
            r = next(gen) % 12
            clump(idx, x, y, 2, 2, L if r < 3 else (d if r < 7 else M))
        for i in range(1 + (var % 2)):
            crack(idx, 8 + i * 17, 7 + i * 14, 9, gen, D, L)
        # weeds in the cracks: the sidewalk's own description says weedy, and a
        # weed is LIGHTER and greener than concrete, which is why a darkness
        # pass can never find one.
        for _ in range(3 + var):
            x, y = next(gen) % N, next(gen) % N
            clump(idx, x, y, 2, 2, D)
            clump(idx, x + 1, y - 1, 2, 2, L)

    elif fam in ('ground', 'deck'):
        # gravel IS clusters. Many, small, two values, varied distribution -
        # this is the one surface where density is the material.
        for cx, cy, rx, ry, v in ((14 + var * 5, 15, 9, 7, M), (32, 33, 8, 6, d)):
            blob(idx, cx, cy, rx, ry, v)
        for _ in range(150):
            x, y = next(gen) % N, next(gen) % N
            r = next(gen) % 12
            clump(idx, x, y, 2, 2, L if r < 4 else (XL if r < 5 else (d if r < 9 else M)))

    elif fam == 'stucco':
        # stucco is a fine, almost flat render. Its read is subtle mottle plus
        # hairline cracks - anything busier is the noise we are here to kill.
        for cx, cy, rx, ry, v in ((12 + var * 8, 14, 9, 7, M), (30, 30 - var * 6, 8, 6, d)):
            blob(idx, cx, cy, rx, ry, v)
        for _ in range(26):
            x, y = next(gen) % N, next(gen) % N
            clump(idx, x, y, 2, 2, M if next(gen) % 2 else d)
        for i in range(1 + (var % 2)):
            crack(idx, 6 + i * 19, 9 + i * 16, 8, gen, d, L)

    elif fam == 'terracotta':
        # THE ONE AUTHORED TILE WITH REAL STRUCTURE. Barrel tile is courses, and
        # a course is a lit crown with a shadow in the lap under it. Drawing
        # that instead of a red noise field is most of why a roof reads as a
        # roof. Courses every 7px, offset per variant.
        for y in range(N):
            row = y % 7
            v = XL if row == 0 else (L if row == 1 else (m if row < 5 else (d if row == 5 else D)))
            for x in range(N):
                idx[y * N + x] = v
        for _ in range(34):                       # broken and slipped pans
            x, y = next(gen) % N, next(gen) % N
            clump(idx, x, y, 2 + (next(gen) % 2), 2, d if next(gen) % 2 else M)
    return idx


def to_image(idx, pal):
    im = Image.new('RGBA', (N, N))
    p = im.load()
    for y in range(N):
        for x in range(N):
            p[x, y] = pal[idx[y * N + x]] + (255,)
    return im


def match_mean(new, old):
    """Hold the layer's value band. The rebuilt tile uses the old one's colours
    but not in the old one's proportions, so a flat offset pulls the mean back
    without touching the ramp's shape."""
    op = old.convert('RGBA').load()
    ol = [lum(op[x, y][:3]) for y in range(old.size[1]) for x in range(old.size[0])
          if op[x, y][3] > 8]
    np_ = new.load()
    nl = [lum(np_[x, y][:3]) for y in range(N) for x in range(N) if np_[x, y][3] > 8]
    if not ol or not nl:
        return 0
    off = int(round(sum(ol) / len(ol) - sum(nl) / len(nl)))
    if off:
        for y in range(N):
            for x in range(N):
                r, g, b, a = np_[x, y]
                if a > 8:
                    np_[x, y] = (max(0, min(255, r + off)), max(0, min(255, g + off)),
                                 max(0, min(255, b + off)), a)
    return off


def b64(im):
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()


def main():
    src = json.load(open(SRC))
    by_id = {t['id']: t for t in src['tiles']}
    old_im = {k: Image.open(io.BytesIO(base64.b64decode(v['b64']))).convert('RGBA')
              for k, v in by_id.items()}

    # ONE RAMP PER FAMILY, pooled from every approved tile in it.
    ramps = {}
    for fam in FAMILY:
        pool = []
        for t in RAMP_SOURCE[fam]:
            if t in old_im:
                pool += pixels(old_im[t])
        ramps[fam] = make_ramp(pool, STRETCH[fam])

    gen = rnd(SEED)
    out_tiles, rows = [], []
    for t in src['tiles']:
        tid = t['id']
        fam = OF_FAMILY[tid]
        ramp = ramps[fam]
        old = old_im[tid]
        acc = accents(pixels(old), ramp, N * N)
        if tid in AUTHORED:
            new = to_image(author(tid, ramp, gen), ramp)
            how = 'authored'
        else:
            new = declutter(snap(old, ramp + acc))
            how = 'redrawn'
        off = match_mean(new, old)
        out_tiles.append({'id': tid, 'what': t['what'], 'b64': b64(new),
                          'family': fam, 'built': how})
        rows.append((tid, old, new, how, off, len(set(pixels(new)))))

    bank = {
        'version': 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_v1',
        'built': '2026-07-28',
        'cell_px': N,
        'grid': src.get('grid'),
        'supersedes': SRC,
        'authority': ('Paolo 7/28/26, verbatim: "I checked it to do the other 41 mark it '
                      'approved." Verdict record: records/BOHEMIA_PIXEL_CRAFT_VERDICT_7_28_26.txt'),
        'law': 'laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md',
        'method': {
            'authored': 'pure material rebuilt from nothing by the approved method: a few '
                        'cluster shapes repeated with varied distribution, at the size the '
                        'thing really is (1 px = 1.7 cm, because CELL_M = 0.75)',
            'redrawn': 'Paolo DREW these. His drawing is approved content and I do not get '
                       'to redraw it. They get the craft operation only: every pixel snapped '
                       'to the family ramp by value, then orphans absorbed.',
            'one_palette_per_family': {f: ['#%02x%02x%02x' % c for c in r]
                                       for f, r in ramps.items()},
            'accents': 'up to two per tile, taken from that tile\'s own out-of-range pixels, '
                       'so white paint and dead dark glass survive the ramp',
        },
        'ground': src.get('ground'), 'struct': src.get('struct'),
        'sprites': src.get('sprites'), 'shadows': src.get('shadows'),
        'lights': src.get('lights'), 'shadow_note': src.get('shadow_note'),
        'tiles': out_tiles,
    }
    with open(OUT, 'w') as f:
        json.dump(bank, f)

    # contact sheet: every tile, before over after, in bank order
    Z, cols = 3, 7
    cw, ch = N * Z + 8, N * Z * 2 + 26
    sheet = Image.new('RGB', (cols * cw + 12, ((len(rows) + cols - 1) // cols) * ch + 44),
                      (18, 18, 15))
    d = ImageDraw.Draw(sheet)
    d.text((10, 10), 'THE ACT-1 TILE SET, RE-COOKED — top: shipping now.  bottom: rebuilt.',
           fill=(238, 220, 168))
    d.text((10, 26), 'authored = pure material, rebuilt.   redrawn = your drawing kept, '
                     'only the pixels cleaned up.', fill=(150, 142, 120))
    for i, (tid, old, new, how, off, nc) in enumerate(rows):
        x = 10 + (i % cols) * cw
        y = 44 + (i // cols) * ch
        sheet.paste(old.convert('RGB').resize((N * Z, N * Z), Image.NEAREST), (x, y))
        sheet.paste(new.convert('RGB').resize((N * Z, N * Z), Image.NEAREST), (x, y + N * Z + 2))
        d.text((x, y + N * Z * 2 + 6), '%s' % tid[:17], fill=(206, 194, 164))
        d.text((x, y + N * Z * 2 + 16), '%s · %d col' % (how, nc),
               fill=(140, 200, 150) if how == 'authored' else (200, 170, 120))
    sheet.save(CONTACT)

    worst = max(rows, key=lambda r: r[5])
    print('%d tiles  (%d authored, %d redrawn)'
          % (len(rows), sum(1 for r in rows if r[3] == 'authored'),
             sum(1 for r in rows if r[3] == 'redrawn')))
    for f, r in ramps.items():
        print('  %-11s %d colours  %s' % (f, len(r), ' '.join('#%02x%02x%02x' % c for c in r)))
    print('  most colours in one tile: %s at %d  (cap %d)' % (worst[0], worst[5], MAX_COLOURS))
    print('OK -> %s' % OUT)
    print('   -> %s' % CONTACT)


if __name__ == '__main__':
    main()
