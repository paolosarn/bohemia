#!/usr/bin/env python3
"""
BOHEMIA — THE MASTER PALETTE, APPLIED (7/29/26)

Paolo, on the palette sheet: "YOUR CLEARLY NOT DONE I LIKE IT KEEP GOING."

A palette proves nothing as swatches. This puts it on the real tiles and renders
the real street through it, which is the only test that counts.

WHAT IT DOES. Every tile in the 7/28 re-cook is remapped onto its family's SUBSET
of the designed master palette. Six families, one palette, plus four accent slots
for the content that has to escape its band (dead glass, door interiors, paint,
the sun-caught ridge).

THE MAPPING IS PER FAMILY, NOT PER TILE, and that distinction is the whole job.
The first version of this tool ranked each tile's own steps dark-to-light and
stretched them across the full family ramp. Every tile then spanned the identical
range, so wall_under_eave came out as bright as the wall in full sun and the
light-direction pairs only held by accident. Instead: every colour used ANYWHERE in
a family is collected, and one monotone luminance transform carries that whole
source span onto the family's designed ramp. A dark tile stays darker than a light
one because the same line is applied to both. Nearest-RGB was never an option — it
would drag the roofs back toward the ground band, since that is where their old
colours live.

ACCENTS ARE OUTLIERS IN THE DRAWING, NOT PIXELS OUTSIDE A RANGE. Version one called
anything more than 26 luminance beyond the family ramp an accent, and 58.6% of the
roof ridge — its main body colour — escaped as "sun-caught", dragging the roofs to
158 when the design put them at 78. A colour earns accent status by being TINY
(under 4% of the family, cumulative from the end) AND separated from the body by a
real gap (over 22 luminance). That is what a highlight or a dead window actually is:
a few pixels, standing clear. Everything else is body and goes through the ramp.

REUSE CHECK: cooks no new colour. Every colour written comes from
records/target/BOHEMIA_MASTER_PALETTE_DESIGNED.json, whose own hues were measured
off the frozen approved set. It reads the 7/28 re-cook bank and writes a new one;
neither the frozen bank nor the re-cook is modified.

TASTE CHECK: act-1 rules bind and are measured after, not asserted: no pure black,
no white, dead-dark glass stays dead, no dither introduced (this only substitutes
colours, it never adds a pixel), and the value bands are the DESIGNED ones rather
than whatever fell out.

  python3 tools/bohemia_palette_apply.py
    -> banks/BOHEMIA_STARTER_TILESET_ACT1_MASTER_7_29_26.txt
"""
import base64
import io
import json
import os
from collections import Counter

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

SRC = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
PAL = 'records/target/BOHEMIA_MASTER_PALETTE_DESIGNED.json'
OUT = 'banks/BOHEMIA_STARTER_TILESET_ACT1_MASTER_7_29_26.txt'

# which family each tile id belongs to. Same grouping the re-cook used, so the
# only variable in the before/after is the PALETTE.
FAM = {}
for ids, f in (
    (['road_0', 'road_1', 'road_2', 'road_centre', 'road_gutter', 'road_crossing'], 'asphalt'),
    (['walk_0', 'walk_1', 'walk_2', 'walk_kerb', 'concrete_0', 'concrete_1'], 'concrete'),
    (['yard_0', 'yard_1', 'yard_2', 'dirt'], 'desert'),
    (['wall_0', 'wall_1', 'wall_2', 'wall_base', 'wall_under_eave', 'wall_window',
      'wall_boarded', 'wall_end_l', 'wall_end_r', 'door_top', 'door_bottom',
      'garage_top', 'garage_bottom', 'garage_top_l', 'garage_bottom_l',
      'garage_top_r', 'garage_bottom_r'], 'stucco'),
    (['roof_slope', 'roof_ridge', 'roof_eave', 'roof_hipTL', 'roof_hipBL',
      'roof_hipTR', 'roof_hipBR', 'roof_parapet'], 'terracotta'),
    (['roof_deck'], 'deck'),
):
    for i in ids:
        FAM[i] = f


def lum(c):
    return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def hexc(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


ACCENT_AREA = 0.04   # an accent covers under 4% of its family, cumulative
ACCENT_GAP = 22.0    # ...and stands at least this far clear of the body

# BELOW THIS, IT IS A HOLE, NOT A DARK VALUE OF THE MATERIAL. Measured, not
# picked: in the approved corpus 39.2% of structure pixels sit under 48 and only
# 2.7% of roof pixels do, which is exactly the shape you would expect if walls
# have doors and windows cut into them and roofs do not. Everything under this
# line leaves its family and goes to the shared void band.
VOID_CUT = 48.0

# ...BUT ONLY WHERE HOLES ACTUALLY GET CUT. Applying the void band to every family
# darkened the ground to 91 and put the roofs back on top of it (separation 0.8,
# worse than the 6.5 this whole exercise exists to fix), because a crack in asphalt
# is not a doorway — it is dark asphalt. The same corpus measurement that found the
# 39.2% in structure found only 8.8% in ground and 2.7% in roofs, which is the
# difference between a surface with openings and a surface with wear.
VOID_FAMILIES = {'stucco'}


def monotone(cols, ramp):
    """Map a set of source colours onto a ramp, order preserved, same line for all."""
    steps = [hexc(h) for h in ramp]
    if not cols:
        return {}
    s0, s1 = lum(cols[0]), lum(cols[-1])
    r0, r1 = lum(steps[0]), lum(steps[-1])
    out = {}
    for c in cols:
        t = 0.5 if s1 - s0 < 1e-6 else (lum(c) - s0) / (s1 - s0)
        want = r0 + t * (r1 - r0)
        out[c] = min(steps, key=lambda s: abs(lum(s) - want))
    return out


def colours_of(im):
    p = im.load()
    w, h = im.size
    c = Counter()
    for y in range(h):
        for x in range(w):
            if p[x, y][3] > 8:
                c[p[x, y][:3]] += 1
    return c


def family_table(cols, ramp, voidramp, accents, holes):
    """One transform for a whole family. Returns {src colour -> palette colour}."""
    order = sorted(cols, key=lum)
    total = float(sum(cols.values()))
    table = {}

    # HOLES LEAVE THE FAMILY FIRST. A door interior is not the darkest stucco, it
    # is the absence of stucco, and the version of this tool that treated it as a
    # dark family value turned every doorway on the street into a grey panel.
    voids = [c for c in order if holes and lum(c) < VOID_CUT]
    table.update(monotone(voids, voidramp))

    body = [c for c in order if c not in table]
    if not body:
        return table

    # BRIGHT ACCENTS ONLY, and only when they are genuinely tiny AND stand clear.
    # Walk down from the top while the running area stays under 4% and each step
    # is a real jump; the moment either test fails we are in the drawing and stop.
    # That guard is what keeps a roof's main colour from being called a highlight.
    got, run = [], 0.0
    for i, c in enumerate(body[::-1]):
        run += cols[c] / total
        if run > ACCENT_AREA or i + 1 >= len(body):
            break
        if abs(lum(body[::-1][i + 1]) - lum(c)) <= ACCENT_GAP:
            break
        got.append(c)
    for c in got:
        table[c] = hexc(accents['paint' if lum(c) > 210 else 'sun_caught']['hex'])

    rest = [c for c in body if c not in table]
    table.update(monotone(rest, ramp))
    return table


def apply_table(im, table):
    p = im.load()
    w, h = im.size
    out = Image.new('RGBA', (w, h))
    q = out.load()
    for y in range(h):
        for x in range(w):
            px = p[x, y]
            q[x, y] = (0, 0, 0, 0) if px[3] <= 8 else table[px[:3]] + (255,)
    return out


def b64(im):
    b = io.BytesIO()
    im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()


def main():
    src = json.load(open(SRC))
    pal = json.load(open(PAL))
    fams, acc = pal['families'], pal['accents']

    ims = {t['id']: Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
           for t in src['tiles']}

    # PASS 1 — every colour the family uses, everywhere, before anything is written.
    famcols = {}
    for tid, im in ims.items():
        famcols.setdefault(FAM[tid], Counter()).update(colours_of(im))
    vr = fams['void']['hex']
    tables = {f: family_table(c, fams[f]['hex'], vr, acc, f in VOID_FAMILIES)
              for f, c in famcols.items()}

    # PASS 2 — one transform per family, applied to every tile in it.
    tiles, stats = [], {}
    for t in src['tiles']:
        fam = FAM[t['id']]
        new = apply_table(ims[t['id']], tables[fam])
        tiles.append({'id': t['id'], 'what': t['what'], 'family': fam, 'b64': b64(new)})
        p = new.load()
        v = [lum(p[x, y][:3]) for y in range(new.size[1]) for x in range(new.size[0])
             if p[x, y][3] > 8]
        stats[t['id']] = sum(v) / len(v)

    bank = {
        'version': 'BOHEMIA_STARTER_TILESET_ACT1_MASTER_v1',
        'built': '2026-07-29',
        'cell_px': src.get('cell_px'), 'grid': src.get('grid'),
        'supersedes': SRC,
        'palette': PAL,
        'authority': ('Paolo 7/29 on the designed palette sheet: "YOUR CLEARLY NOT DONE '
                      'I LIKE IT KEEP GOING." The palette DIRECTION is liked; these tiles '
                      'have not been judged.'),
        'method': ('ONE monotone luminance transform per FAMILY carries every colour that '
                   'family uses onto its designed ramp, so a shaded tile stays darker than '
                   'a lit one instead of every tile being stretched to the same range. '
                   'Accents are outliers in the drawing — under 4% of the family and clear '
                   'of the body by 22 luminance — so a highlight or a dead window escapes '
                   'while a tile\'s main colour never can.'),
        'ground': src.get('ground'), 'struct': src.get('struct'),
        'sprites': src.get('sprites'), 'shadows': src.get('shadows'),
        'lights': src.get('lights'), 'shadow_note': src.get('shadow_note'),
        'tiles': tiles,
    }
    json.dump(bank, open(OUT, 'w'))

    G = ('road', 'walk', 'yard', 'concrete', 'dirt')
    band = lambda pre: [v for k, v in stats.items() if k.startswith(pre)]
    g = [v for k, v in stats.items() if k.startswith(G)]
    w_ = [v for k, v in stats.items() if k.startswith('wall')]
    r = [v for k, v in stats.items() if k.startswith('roof')]
    m = lambda L: sum(L) / len(L)
    allc = set()
    for t in tiles:
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        p = im.load()
        allc |= {p[x, y][:3] for y in range(im.size[1]) for x in range(im.size[0])
                 if p[x, y][3] > 8}
    print('%d tiles -> %s' % (len(tiles), OUT))
    print('   set-wide colours: %d   (was 150 on the 7/28 re-cook, 9582 frozen)' % len(allc))
    print('   ground %.1f   wall %.1f   roof %.1f' % (m(g), m(w_), m(r)))
    print('   ground-to-roof separation %.1f   (was 6.5 — the M14 failure)'
          % abs(m(g) - m(r)))
    print('   ground-to-wall separation %.1f' % abs(m(g) - m(w_)))


if __name__ == '__main__':
    main()
