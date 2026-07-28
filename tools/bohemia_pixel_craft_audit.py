#!/usr/bin/env python3
"""
BOHEMIA — THE PIXEL CRAFT AUDIT (7/27/26)

Paolo, 7/27: "i need you to stop being ass and be a great art direction guy...
learn the skillset of actual pixel shit pixel assets... go to school for me for a
couple turns and learn some laws brother."

So I went and learned the craft, and then I pointed it at OUR OWN ART, because a
lesson you cannot measure on your own corpus is a lesson you did not learn. The
laws and their sources are in laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md. This file
is the instrument for the six of them a machine can actually measure.

THE SIX MEASURES, and why each one is the one that matters:

  1. ORPHAN PIXELS. A lone pixel touching no pixel of its own colour. The craft
     is unanimous: "these one pixel clusters are also called orphan pixels and
     they usually are responsible for the image looking noisy and confusing"
     (Saint11 / Pedro Medeiros). Slynyrd says the same about texture. This is
     the single most diagnostic number for "looks like noise" and it is trivial
     to count.

  2. SINGLE-USE COLOURS. The share of colours in a tile used ONE time. This is
     THE tell that separates real pixel art from a shrunk painting: real pixel
     art is "a document of palette indices on a fixed-size grid"; the machine
     kind "generate[s] a normal image in a pixel-ish style and shrink[s] it
     down, which leaves you with blurry edges, stray colors" and "off-palette
     drift". A hand-placed pixel gets reused. A resampled one does not.

  3. MIXELS / THE PIXEL GRID. The largest N for which the tile is made of
     uniform NxN blocks. Art authored at 44px and drawn at 44px reports N=1.
     Art that was made small and blown up reports N=2,3,4 - and mixing pixel
     sizes in one scene is the flaw Paolo named himself on 7/26 ("zoomed in
     zoomed out pictures of windows"). Craft rule: keep pixel size consistent,
     scale by integer multiples only.

  4. PILLOW SHADING. The beginner sin: shading inward from the outline on every
     side so there is no light direction. Measured as the correlation between a
     pixel's brightness and its distance from the edge of the tile: a real
     directional key gives roughly zero correlation, a pillow gives a strong
     positive one. This one is measurable precisely because pillow shading is
     defined by having no direction.

  5. LIGHT DIRECTION. The brightness gradient across the tile, as an angle.
     Bohemia's contract pins the key to the upper LEFT. Craft rule: "decide
     where your light is coming from before you begin" and keep it constant
     across the whole scene. A tile whose gradient disagrees with the scene is
     the thing that makes a wall look pasted on.

  6. CLUSTER DENSITY. Distinct same-colour regions per 1000 px. Saint11: "my
     focus is to have as few clusters as I can". A texture should be "a few
     simple clusters repeated over and over but with varied distribution"
     (Slynyrd), not a different colour every pixel.

WHAT THIS IS NOT: a taste machine. None of these six say whether a tile looks
GOOD - that is Paolo's, forever, and the target-match gate already says so in its
own words. These say whether it was BUILT like pixel art. A thing can pass all
six and still be ugly. It cannot fail them and be pixel art.

REUSE CHECK: cooks no graphic pixels and opens no bank to draw from. It READS
banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt (byte-locked by the visual
constitution - this tool must never write to it) and any other registered bank,
and reports numbers.

  python3 tools/bohemia_pixel_craft_audit.py
    -> records/target/BOHEMIA_PIXEL_CRAFT_AUDIT.json
"""
import base64
import io
import json
import math
import os
from collections import Counter, deque

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANKS = [
    ('banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt', 'tiles',
     'THE FROZEN ACT-1 STARTER SET - Paolo verdicted the target CBB, so this is '
     'byte-locked. Measured to know where we stand, NEVER to re-cook.'),
    ('banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt', 'tiles',
     'THE RE-COOK. Paolo 7/28: "I checked it to do the other 41 mark it approved." '
     'Held to the REAL craft thresholds, not a ratchet - it was built to them on '
     'purpose, so there is no excuse for it to miss them.'),
]
OUT = 'records/target/BOHEMIA_PIXEL_CRAFT_AUDIT.json'


def opaque(im):
    """The pixels that are actually drawn. A transparent corner is not art."""
    px = im.convert('RGBA').load()
    w, h = im.size
    return [(x, y) for y in range(h) for x in range(w) if px[x, y][3] > 8]


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def orphan_share(im):
    """A pixel of a colour that touches no 4-neighbour of the same colour."""
    px = im.convert('RGBA').load()
    w, h = im.size
    cells = opaque(im)
    if not cells:
        return 0.0, 0
    orphans = 0
    for x, y in cells:
        c = px[x, y][:3]
        alone = True
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] > 8 and px[nx, ny][:3] == c:
                alone = False
                break
        if alone:
            orphans += 1
    return orphans / float(len(cells)), orphans


def colour_stats(im):
    """How many colours, and how many of them are used exactly once.

    The single-use share is the resampling tell. A pixel artist reuses a colour;
    a downscaler invents a new one for every edge pixel it had to blend."""
    px = im.convert('RGBA').load()
    counts = Counter(px[x, y][:3] for x, y in opaque(im))
    if not counts:
        return 0, 0.0
    once = sum(1 for v in counts.values() if v == 1)
    return len(counts), once / float(len(counts))


def block_size(im):
    """Largest N such that the tile is made of uniform NxN blocks.

    N=1 means every pixel is its own decision, which is what authoring at the
    real cell size looks like. N>1 means the art was made smaller and blown up,
    and mixing N across a scene is the mixel flaw."""
    px = im.convert('RGBA').load()
    w, h = im.size
    best = 1
    for n in (2, 3, 4, 6, 8):
        if w % n or h % n:
            continue
        ok = True
        for by in range(0, h, n):
            for bx in range(0, w, n):
                first = px[bx, by]
                for y in range(by, by + n):
                    for x in range(bx, bx + n):
                        if px[x, y] != first:
                            ok = False
                            break
                    if not ok:
                        break
                if not ok:
                    break
            if not ok:
                break
        if ok:
            best = n
    return best


def pillow_score(im):
    """Correlation between brightness and distance from the drawn edge.

    Pillow shading is DEFINED by having no direction: it darkens toward the
    outline on every side at once, so brightness rises with depth into the
    shape. A real directional key has no such relationship. +1 is a perfect
    pillow; around 0 is directional or flat."""
    px = im.convert('RGBA').load()
    w, h = im.size
    cells = set(opaque(im))
    if len(cells) < 32:
        return None
    # chamfer distance to the nearest non-drawn pixel (or the tile border)
    dist = {}
    q = deque()
    for (x, y) in cells:
        edge = False
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (x + dx, y + dy)
            if not (0 <= n[0] < w and 0 <= n[1] < h) or n not in cells:
                edge = True
                break
        if edge:
            dist[(x, y)] = 0
            q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (x + dx, y + dy)
            if n in cells and n not in dist:
                dist[n] = dist[(x, y)] + 1
                q.append(n)
    if len(set(dist.values())) < 3:
        return None                       # nothing deep enough to pillow
    xs = [dist[c] for c in cells]
    ys = [lum(px[c[0], c[1]][:3]) for c in cells]
    n = float(len(xs))
    mx, my = sum(xs) / n, sum(ys) / n
    sxy = sum((a - mx) * (b - my) for a, b in zip(xs, ys))
    sxx = sum((a - mx) ** 2 for a in xs)
    syy = sum((b - my) ** 2 for b in ys)
    if sxx <= 0 or syy <= 0:
        return None
    return sxy / math.sqrt(sxx * syy)


def light_angle(im):
    """Direction the tile gets brighter in, in degrees.

    0 = brighter to the right, 90 = brighter downward. The contract keys from
    the upper LEFT, so a tile that agrees reads around 135-225 (brighter toward
    the upper-left half). Returns None for a tile with no gradient at all,
    which is legal: a flat material tile has no direction to disagree with."""
    px = im.convert('RGBA').load()
    w, h = im.size
    cells = opaque(im)
    if len(cells) < 32:
        return None, 0.0
    mx = sum(x for x, _ in cells) / float(len(cells))
    my = sum(y for _, y in cells) / float(len(cells))
    ml = sum(lum(px[x, y][:3]) for x, y in cells) / float(len(cells))
    gx = sum((x - mx) * (lum(px[x, y][:3]) - ml) for x, y in cells)
    gy = sum((y - my) * (lum(px[x, y][:3]) - ml) for x, y in cells)
    norm = sum((x - mx) ** 2 + (y - my) ** 2 for x, y in cells) or 1.0
    strength = math.hypot(gx, gy) / norm
    if strength < 0.02:
        return None, strength             # genuinely flat, no claim made
    return (math.degrees(math.atan2(gy, gx)) + 360) % 360, strength


def clusters_per_kpx(im):
    """Distinct same-colour regions per 1000 drawn pixels."""
    px = im.convert('RGBA').load()
    w, h = im.size
    cells = set(opaque(im))
    if not cells:
        return 0.0, 0
    seen, n = set(), 0
    for c in cells:
        if c in seen:
            continue
        n += 1
        col = px[c[0], c[1]][:3]
        q = deque([c])
        seen.add(c)
        while q:
            x, y = q.popleft()
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nb = (x + dx, y + dy)
                if nb in cells and nb not in seen and px[nb[0], nb[1]][:3] == col:
                    seen.add(nb)
                    q.append(nb)
    return 1000.0 * n / len(cells), n


def _opaque_colours(im):
    px = im.convert('RGBA').load()
    return [px[x, y][:3] for (x, y) in opaque(im)]


def offset_seam(im):
    """THE OFFSET TEST — the professional way to find a seam, and the one we have
    failed twice.

    Shift the tile 50% in both axes with wrap. The tile's original edges now meet
    in a CROSS through the middle, and any discontinuity there is exactly what a
    player sees as a grid when the tile repeats. Measured as the mean absolute
    luminance step ACROSS that cross, divided by the tile's own normal
    neighbour-to-neighbour step. 1.0 means the seam is as quiet as the material's
    own texture - invisible. Anything much above 1 is a visible grid.

    This is the measurement that would have caught the 7/26 black grid and the
    desert-pool edge darkening before either shipped."""
    px = im.convert('RGBA').load()
    w, h = im.size
    if w < 8 or h < 8:
        return None
    def L(x, y):
        c = px[x % w, y % h]
        return None if c[3] <= 8 else lum(c[:3])
    steps, seam = [], []
    for y in range(h):
        for x in range(w):
            a, b = L(x, y), L(x + 1, y)
            if a is not None and b is not None:
                (seam if x == w - 1 else steps).append(abs(a - b))
            a, b = L(x, y), L(x, y + 1)
            if a is not None and b is not None:
                (seam if y == h - 1 else steps).append(abs(a - b))
    if not steps or not seam:
        return None
    base = sum(steps) / len(steps)
    return round((sum(seam) / len(seam)) / base, 2) if base > 0.5 else None


def audit_tile(im):
    osh, ocount = orphan_share(im)
    ncol, once = colour_stats(im)
    cpk, ncl = clusters_per_kpx(im)
    ang, strength = light_angle(im)
    cells = [c for c in _opaque_colours(im)]
    return {
        'mean_value': round(sum(lum(c) for c in cells) / len(cells), 1) if cells else None,
        'orphan_share': round(osh, 4), 'orphans': ocount,
        'colours': ncol, 'single_use_colour_share': round(once, 4),
        'block_size': block_size(im),
        'pillow': (lambda p: None if p is None else round(p, 3))(pillow_score(im)),
        'light_deg': None if ang is None else round(ang, 1),
        'light_strength': round(strength, 4),
        'clusters_per_1000px': round(cpk, 1), 'clusters': ncl,
        # the tile's actual colours, so the gate can add up a SET-WIDE palette.
        # A per-tile cap alone would pass 42 tiles of 8 unrelated colours each.
        'palette': sorted(set(_opaque_colours(im))),
        # 1.0 = the wrap seam is as quiet as the material itself
        'seam_ratio': offset_seam(im),
    }


def main():
    out = {
        'version': 'BOHEMIA_PIXEL_CRAFT_AUDIT_v1',
        'measured': '2026-07-27',
        'law': 'laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md',
        'NOT_A_TASTE_MACHINE': (
            'These six measure whether art was BUILT like pixel art, never whether it '
            'looks good. Looking good is Paolo\'s, forever.'),
        'banks': [],
    }
    for path, key, note in BANKS:
        if not os.path.exists(path):
            continue
        bank = json.load(open(path))
        rows = []
        for t in bank[key]:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
            r = audit_tile(im)
            r['id'] = t['id']
            r['size'] = list(im.size)
            rows.append(r)
        def avg(f, only=None):
            v = [f(r) for r in rows if f(r) is not None and (only is None or only(r))]
            return round(sum(v) / len(v), 4) if v else None
        lit = [r for r in rows if r['light_deg'] is not None]
        # the contract keys from the upper LEFT: brighter toward the upper-left
        # half of the compass, i.e. gx<0 (leftward) is the agreeing sign.
        agree = [r for r in lit if 90 < r['light_deg'] < 270]
        out['banks'].append({
            'bank': path, 'note': note, 'tiles': len(rows),
            'worst_orphan_share': max(r['orphan_share'] for r in rows),
            'mean_orphan_share': avg(lambda r: r['orphan_share']),
            'mean_single_use_colour_share': avg(lambda r: r['single_use_colour_share']),
            'worst_single_use_colour_share': max(r['single_use_colour_share'] for r in rows),
            'max_colours_in_one_tile': max(r['colours'] for r in rows),
            'block_sizes': sorted(set(r['block_size'] for r in rows)),
            'worst_pillow': max([r['pillow'] for r in rows if r['pillow'] is not None] or [None]),
            'mean_clusters_per_1000px': avg(lambda r: r['clusters_per_1000px']),
            'tiles_with_a_light_direction': len(lit),
            'tiles_agreeing_with_upper_left_key': len(agree),
            'rows': rows,
        })
    with open(OUT, 'w') as f:
        json.dump(out, f, indent=1)
    for b in out['banks']:
        print('%s  (%d tiles)' % (b['bank'], b['tiles']))
        print('  orphan pixels      mean %.2f%%   worst %.2f%%'
              % (100 * b['mean_orphan_share'], 100 * b['worst_orphan_share']))
        print('  single-use colours mean %.1f%%   worst %.1f%%'
              % (100 * b['mean_single_use_colour_share'],
                 100 * b['worst_single_use_colour_share']))
        print('  colours in one tile, most: %d' % b['max_colours_in_one_tile'])
        print('  pixel block sizes present: %s   (1 = authored at the real cell)'
              % b['block_sizes'])
        print('  worst pillow score: %s   (+1 = pure pillow shading)' % b['worst_pillow'])
        print('  clusters per 1000px, mean: %.1f' % b['mean_clusters_per_1000px'])
        print('  light direction: %d/%d tiles have one, %d agree with the upper-left key'
              % (b['tiles_with_a_light_direction'], b['tiles'],
                 b['tiles_agreeing_with_upper_left_key']))
    print('OK -> %s' % OUT)


if __name__ == '__main__':
    main()
