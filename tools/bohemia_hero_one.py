#!/usr/bin/env python3
"""BOHEMIA HERO ONE (8/19/26, WORLD lane) — bake ONE hero in a second, not eighty-five
minutes, so a question about geometry costs a second to answer.

WHY THIS EXISTS. `tools/bohemia_district_hero_factory.py` bakes all 69 districts onto one
1724 px square and takes ~85 MINUTES. That is the right cost for shipping a bank. It is a
catastrophic cost for ASKING A QUESTION -- and on 8/19 three district icons had been
failing hue_gate for three weeks with three DIFFERENT causes, none of which could be
found by reading the builders, all of which were obvious the moment anyone looked at a
render:

    basin          nested solid boxes, so the "hole" in its own docstring never existed
    stadium        field at z=0.02..0.08 straddling the ground pad's top face at z=0.05
    policestation  its only colour painted on the -y face, which this camera cannot see

I spent one full 85-minute bake on a fix reasoned out of the source, and it was wrong on
two of the three. Then this harness took the guessing out: render, look, change, render.

IT IS FAITHFUL, AND THAT IS CHECKABLE. Run the pre-8/19 radio through it and it reports
1% top-half ink -- the same number gates/squint_gate.py reported off the real 1724 px
bank. Same builder, same _draw_ground/_thicken/_dress/_fat_and_tall pass order, same
projection; only the scale and the supersample are smaller. A harness you cannot check
against the real surface is just a second thing that can lie (VERIFY ON THE REAL SURFACE,
7/18), so check it before you trust a number off it.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks NO new graphic pixels and invents no colour.
  opened tools/bohemia_district_hero_factory.py -> HEROES, _load_pal, and the exact
    dressing pass order main() uses, so what this draws is what the bank would draw.
  opened tools/bohemia_iso3d.py -> bake(), unchanged, same renderer as the real bank.
  opened nothing else. Every colour is the district's own engine palette entry.

  python3 tools/bohemia_hero_one.py stadium basin radio
    -> records/target/BOHEMIA_HERO_ONE.png     the sheet, side by side
    -> per-district families / chromatic / top-half ink, the same two measurements
       gates/hue_gate.py and gates/squint_gate.py make, so you know BEFORE the 85
       minutes whether the real bake will come back green.
"""
import colorsys
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
sys.path.insert(0, 'tools')
from PIL import Image

import bohemia_district_hero_factory as F
from bohemia_iso3d import bake

OUT = 'records/target/BOHEMIA_HERO_ONE.png'
SHRINK = 0.9    # of the real bake's scale. Big enough that the two gates' measurements
                # track the real bank; small enough that five heroes cost about a second.
SS = 3          # the real bake uses 4. Silhouette and hue are both stable at 3.

# The gates' own floors, restated here ONLY to label the output. The gates remain the
# authority -- this prints an early warning, it never grants a pass.
FLOOR_FAMILIES = 2
MIN_INK, MAX_INK = 0.10, 0.92


def render(d):
    """Build + dress + bake one hero, in main()'s exact pass order."""
    scene, scale = F.HEROES[d](F._load_pal()[d])
    F._draw_ground(scene)
    F._thicken(scene, d)
    F._strip_enclosures(scene)
    F._dress_walls(scene, d)
    F._dress_roofs(scene, d)
    F._fat_and_tall(scene)
    scale = scale * 1.55 * SHRINK
    xs, ys = [], []
    for verts, _uv, _n, _m in scene.faces:
        for (x, y, z) in verts:
            xs.append((x - y) * scale)
            ys.append((x + y) * scale * 0.5 - z * scale)
    w = int(max(xs) - min(xs)) + 24
    h = int(max(ys) - min(ys)) + 24
    arr = bake(scene, out_w=w, out_h=h, origin=(-min(xs) + 12, -min(ys) + 12),
               scale=scale, ss=SS, shadow=False)
    return Image.fromarray(arr, 'RGBA'), len(scene.faces)


def _pixels(im):
    """Pillow renamed getdata() out from under this in 14; take whichever exists."""
    return (im.get_flattened_data() if hasattr(im, 'get_flattened_data') else im.getdata())


def measure(im):
    """The same two questions hue_gate.py and squint_gate.py ask, on the same terms."""
    fams, chroma, total = set(), 0, 0
    for (R, G, B, A) in _pixels(im):
        if A < 128:
            continue
        total += 1
        mx, mn = max(R, G, B), min(R, G, B)
        if mx < 40 or (mx - mn) / float(mx) < 0.18:
            continue
        fams.add(int(colorsys.rgb_to_hsv(R / 255., G / 255., B / 255.)[0] * 12) % 12)
        chroma += 1
    # MEASURE THE TOP HALF, exactly as squint_gate does: every hero sits on the same
    # ground plate, so a full-icon silhouette is mostly plate and barely discriminates.
    n = 16
    top = im.crop((0, 0, im.size[0], im.size[1] // 2)).resize((n, n // 2), Image.BILINEAR)
    ink = sum(1 for px in _pixels(top) if px[3] >= 128) / float(n * n // 2)
    return len(fams), sorted(fams), (100.0 * chroma / total if total else 0.0), ink


def main():
    want = [a for a in sys.argv[1:] if not a.startswith('-')]
    if not want:
        print(__doc__.strip().splitlines()[-1])
        print('  districts: ' + ', '.join(sorted(F.HEROES)))
        return 2
    ims, bad = [], 0
    for d in want:
        if d not in F.HEROES:
            print('  no hero builder for %s' % d)
            bad += 1
            continue
        im, nf = render(d)
        fams, which, chroma, ink = measure(im)
        flags = []
        if fams < FLOOR_FAMILIES:
            flags.append('MONOCHROME (hue_gate floor %d)' % FLOOR_FAMILIES)
        if ink < MIN_INK:
            flags.append('NO SHAPE at map zoom (squint floor %.0f%%)' % (MIN_INK * 100))
        if ink > MAX_INK:
            flags.append('FILLED BOX (squint cap %.0f%%)' % (MAX_INK * 100))
        bad += len(flags)
        print('  %-14s %4d faces  families=%d %-16s chromatic=%5.1f%%  top-half ink=%3.0f%%%s'
              % (d, nf, fams, str(which), chroma, ink * 100,
                 ('   <-- ' + '; '.join(flags)) if flags else ''))
        ims.append((d, im))
    if ims:
        gap = 12
        w = sum(i.size[0] for _, i in ims) + gap * (len(ims) + 1)
        h = max(i.size[1] for _, i in ims) + gap * 2
        sheet = Image.new('RGB', (w, h), (30, 30, 34))
        x = gap
        for _d, i in ims:
            sheet.paste(i, (x, gap), i)
            x += i.size[0] + gap
        os.makedirs(os.path.dirname(OUT), exist_ok=True)
        sheet.save(OUT)
        print('  sheet -> %s  (%s)' % (OUT, ' '.join(d for d, _ in ims)))
    # This is an EARLY WARNING, not a gate. It cannot pass anything; the real bank and
    # gates/hue_gate.py + gates/squint_gate.py remain the only authority.
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
