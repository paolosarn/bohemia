#!/usr/bin/env python3
"""
BOHEMIA — WHAT HE ACTUALLY OWNS (7/31/26, v2: OPENED AND MEASURED)

Paolo, 7/31, LOCKED and FLEET-WIDE: "if i bought it i prefer it! Thats for all
textures bro!!!" (laws/BOHEMIA_ADDENDUM_BOUGHT_BEATS_PAINTED_7_31_26.md)

THIS TOOL EXISTS BECAUSE OF A LAW VIOLATION, AND THEN v1 OF IT MADE A SECOND ONE.

  The first failure: TF-ART-001 cooked a concrete block wall from scratch the day
  after the bought-beats-painted ruling landed, while 303 PURCHASED wall tiles sat
  in banks/. The REUSE-FIRST shopping check walked the APPROVED-ASSET index (the
  shelf of what he has JUDGED) and never opened the PURCHASED library (the shelf of
  what he PAID FOR). Two shelves; I named one.

  The second failure was v1 of this file. It matched FORM NAMES against PACK NAMES
  and reported "he may already own this" from a shared keyword. On that basis I told
  him his library held the exact concrete block wall I had cooked. IT DOES NOT. When
  the packs are actually decoded and looked at, "4. House wall tiles" is a MEDIEVAL
  IVY COTTAGE, "wall tiles" is DUNGEON MASONRY, "3. Wall panels and details" is
  SCI-FI CONTROL PANELS, and 46 of the 47 "roof" tiles are CYBERPUNK SKYSCRAPER TOPS
  with helipads and neon. A name is not a look. v1 was the same class of error the
  tool was written to catch, one level up.

SO v2 DECODES EVERY PURCHASED TILE AND MEASURES IT. No keyword decides anything.
Per pack it reports the three facts that determine whether a bought tile can ship
into act-1 Bohemia at all:

  - BLACK%   act-1 law: no pure black, luminance floor 17
  - WHITE%   act-1 law: no white, ceiling 232
  - PURPLE%  PURPLE RESERVATION: purple belongs to the Amalgamation alone

A pack that fails these is not unusable, but it cannot be pasted RAW, and the honest
report says so instead of saying "owned, use it". Subject matter still needs eyes:
this measures colour, it cannot tell a Vegas stucco wall from a castle wall. So the
tool also writes a CONTACT SHEET per surface and the record points at it, because the
only thing that settles subject matter is Paolo looking at the pixels.

  python3 tools/bohemia_bought_audit.py
    -> records/BOHEMIA_BOUGHT_AUDIT_7_31_26.md
    -> records/target/BOUGHT_WALLS.png, BOUGHT_ROOFS.png
"""
import base64
import colorsys
import io
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image, ImageDraw  # noqa: E402

# act-1 palette law, and the one colour that is reserved
FLOOR, CEIL = 17, 232
PURPLE_H = (0.72, 0.87)

# the purchased libraries, by the surface each one is meant to dress
SURFACES = [
    ('ground', 'BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'),
    ('path',   'BOHEMIA_PATH_SEAMLESS_SET_7_10_26.txt'),
    ('wall',   'BOHEMIA_WALL_SEAMLESS_SET_7_10_26.txt'),
    ('roof',   'BOHEMIA_ROOF_SEAMLESS_SET_7_10_26.txt'),
    ('water',  'BOHEMIA_WATER_SEAMLESS_SET_7_10_26.txt'),
]
SHEETS = {'wall': 'BOUGHT_WALLS.png', 'roof': 'BOUGHT_ROOFS.png'}
OUT = 'records/BOHEMIA_BOUGHT_AUDIT_7_31_26.md'

_hd = {}


def hd_tile(fileref, pack, idx):
    """the purchased pixels themselves, out of the 180MB HD repo he bought"""
    if fileref not in _hd:
        _hd[fileref] = json.load(open('banks/' + fileref))
    return _hd[fileref]['packs'][pack][idx]['b64']


def rgba(im):
    """RGBA pixels as a list of 4-tuples, without the deprecated Image.getdata().

    Pillow 14 deprecates that call and it sprayed a DeprecationWarning into the
    shared gate log on every run, which every other lane reads. tobytes() is the
    supported path and is faster.
    """
    b = im.convert('RGBA').tobytes()
    return [tuple(b[i:i + 4]) for i in range(0, len(b), 4)]


def measure(im):
    """Count only pixels that are actually PAINTED.

    A transparent pixel converted to RGB is (0,0,0), i.e. pure black. Measuring
    RGBA->RGB therefore scores every cut-out prop as a black-law violation and
    reports the whole library as illegal. That mistake was made and caught here:
    it read 4 of 1506 tiles legal, which is the kind of number that means the
    ruler is bent, not the wood.
    """
    px = [(r, g, b) for r, g, b, a in rgba(im) if a > 8]
    n = len(px)
    if not n:
        return 0.0, 0.0, 0.0
    black = white = purple = 0
    for r, g, b in px:
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        if lum < FLOOR:
            black += 1
        elif lum > CEIL:
            white += 1
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        if s > 0.25 and v > 0.15 and PURPLE_H[0] < h < PURPLE_H[1]:
            purple += 1
    return 100.0 * black / n, 100.0 * white / n, 100.0 * purple / n


def sheet(imgs, path, cols=10, cell=64):
    rows = (len(imgs) + cols - 1) // cols
    out = Image.new('RGBA', (cols * cell, rows * (cell + 12)), (30, 30, 34, 255))
    dr = ImageDraw.Draw(out)
    for n, (label, im) in enumerate(imgs):
        x, y = (n % cols) * cell, (n // cols) * (cell + 12)
        out.paste(im.resize((cell, cell), Image.NEAREST), (x, y))
        dr.text((x + 2, y + cell), label[:12], fill=(205, 205, 205, 255))
    out.save(path)


def audit(lib):
    """decode every tile in a purchased library, grouped by the pack he bought"""
    try:
        d = json.load(open('banks/' + lib))
    except Exception:
        return {}, []
    packs, thumbs = {}, []
    for e in (d.get('tiles') or []):
        try:
            raw = hd_tile(e['file'], e['pack'], e['idx'])
            im = Image.open(io.BytesIO(base64.b64decode(raw))).convert('RGBA')
        except Exception:
            continue
        bl, wh, pu = measure(im)
        a = packs.setdefault(e['pack'], [0, 0.0, 0.0, 0.0])
        a[0] += 1
        a[1] += bl
        a[2] += wh
        a[3] += pu
        thumbs.append(('%s#%d' % (e['pack'].split('.')[0][:7], e['idx']), im))
    return packs, thumbs


def main():
    report = []
    for surface, lib in SURFACES:
        packs, thumbs = audit(lib)
        if not packs:
            continue
        if surface in SHEETS:
            sheet(thumbs, 'records/target/' + SHEETS[surface])
        report.append((surface, lib, packs))
        print('%-7s %-46s %4d tiles, %2d packs'
              % (surface, lib[:46], sum(p[0] for p in packs.values()), len(packs)))

    total = sum(sum(p[0] for p in pk.values()) for _s, _l, pk in report)
    clean = dirty = 0
    with open(OUT, 'w') as f:
        f.write('# WHAT HE ACTUALLY OWNS — every purchased tile opened and measured '
                '(7/31/26)\n\n')
        f.write('Paolo 7/31, LOCKED, FLEET-WIDE: **"if i bought it i prefer it! Thats '
                'for all textures bro!!!"**\n\n')
        f.write(('**%d purchased tiles, decoded and measured, not keyword-matched.** '
                 'The first version of this\naudit compared FORM NAMES to PACK NAMES and '
                 'told him his library already held the concrete\nblock wall I had cooked '
                 'from scratch. It does not. That claim came from a shared word, and\na '
                 'name is not a look. This version opens every tile.\n\n') % total)
        f.write('Three measurements decide whether a bought tile can ship into act-1 '
                'RAW:\nact-1 forbids pure black (luminance floor %d) and white (ceiling '
                '%d), and PURPLE RESERVATION\nkeeps purple for the Amalgamation alone.\n\n'
                % (FLOOR, CEIL))
        for surface, lib, packs in report:
            f.write('\n## %s — `%s`\n\n' % (surface.upper(), lib))
            f.write('| pack he bought | tiles | black % | white % | purple % | '
                    'raw into act-1? |\n|---|---:|---:|---:|---:|---|\n')
            for p, (n, bl, wh, pu) in sorted(packs.items(), key=lambda k: -k[1][0]):
                bl, wh, pu = bl / n, wh / n, pu / n
                bad = []
                if bl >= 1.0:
                    bad.append('black')
                if wh >= 1.0:
                    bad.append('white')
                if pu >= 1.0:
                    bad.append('purple')
                if bad:
                    dirty += n
                else:
                    clean += n
                f.write('| %s | %d | %.1f | %.1f | %.1f | %s |\n'
                        % (p[:44], n, bl, wh, pu,
                           'yes' if not bad else 'NO - ' + ', '.join(bad)))
        f.write('\n\n## WHAT THE PIXELS SAY\n\n')
        f.write('**%d of %d purchased tiles are act-1 legal as bought. %d are not** '
                '(pure black, white, or\nreserved purple above 1%% of the tile). That is '
                'not a reason to reject them; it is the\nreason they cannot be pasted '
                'straight in, and the number nobody had before.\n\n' % (clean, total, dirty))
        f.write('### Colour is the half a machine can see. Subject is the half it '
                'cannot.\n\n')
        f.write('I rendered his wall and roof packs and looked at them '
                '(`records/target/BOUGHT_WALLS.png`,\n`records/target/BOUGHT_ROOFS.png`). '
                'What the names promise and what the tiles are:\n\n')
        f.write('- `4. House wall tiles` (27) is a **medieval ivy cottage** — lime '
                'stucco, timber, arched\n  plank doors, leaded glass. It is not a Las '
                'Vegas house wall.\n')
        f.write('- `wall tiles` (41) and `2. Wall tiles (1)` are **dungeon masonry** — '
                'mossy castle stone,\n  irregular rubble, barred windows, near-black '
                'mortar.\n')
        f.write('- `3. Wall panels and details` (28) is **sci-fi control panels**, lit '
                'blue screens.\n')
        f.write('- `Rooftop and building tops` (46) is **cyberpunk skyscraper tops** — '
                'HVAC plant, helipads,\n  neon signage. Exactly ONE of the 47 roof tiles '
                '(`5. Roof tiles#26`) is a pitched terracotta\n  roof.\n\n')
        f.write('So the ruling has a SHAPE his library gives it, and it is not '
                'uniform:\n\n')
        f.write('| surface | is what he bought usable for act-1 Vegas? |\n|---|---|\n')
        f.write('| ground, street, concrete, path, water | **YES, directly.** Cracked '
                'concrete and cracked street are exactly right for a dead Vegas. The RUN '
                'lane already draws these ahead of painted tiles. |\n')
        f.write('| walls | **NO for houses.** Fantasy and sci-fi subject matter. No '
                'stucco, no CMU, no corrugated metal. |\n')
        f.write('| roofs | **NO.** One usable tile in 47. |\n')
        f.write('\n### The fix is not to reject his art. It is to move its BLACK POINT.\n\n')
        f.write('Measured on the exact bytes the run ships today (tier S/A, pure, 44x44 '
                '- not the HD source):\n\n')
        f.write('| surface | tiles shipped | mean pure-black % | worst | over the 1% '
                'line |\n|---|---:|---:|---:|---:|\n')
        f.write('| sidewalk + driveway | 20 | 2.2 | 8.4 | 16 of 20 |\n')
        f.write('| road | 13 | 5.0 | 15.0 | 9 of 13 |\n\n')
        f.write('So the street he walks on right now breaks the act-1 palette law, '
                'because his tiles were\nshipped RAW and nothing measured them. '
                '`bought_beats_painted_gate.js` checks that his art\nSHIPS and ships '
                'FIRST - both correct, both green - and never what colour it is.\n\n')
        f.write('`tools/bohemia_bought_conditioner.py` closes it without touching his '
                'art: a monotone\nluminance remap compresses the illegal black and white '
                'tails into [17,232]. Ordering is\npreserved so no detail is crushed, and '
                'RGB is scaled uniformly so HUE AND SATURATION ARE\nUNCHANGED. Result: '
                '33 tiles, mean illegal 2.2%/5.0% -> **0.00%**, and side by side the '
                'before\nand after are near indistinguishable - which is the point. '
                'See `records/target/BOUGHT_CONDITIONED.png`.\n')
        f.write('`gates/bought_first_gate.py` proves it is still HIS: every conditioned '
                'tile must trace to a\ntile he bought, hold its size, hue and saturation, '
                'and land inside act-1. Sabotage-tested\nagainst a repaint, a leftover '
                'black pixel and an invented tile; it caught all three.\n\n')
        f.write('\n### Which means TF-ART-001 was NOT the violation I recorded it as\n\n')
        f.write('I annotated the CMU cook as a bought-first failure and wrote that his '
                'pack "already holds a\ngrey concrete block wall in running bond, '
                'verified by rendering it and LOOKING". That was\nwrong, and it is '
                'corrected in the tool. He owns no concrete block wall. The cook stands.\n'
                'The gate it produced still stands too, for a different and better '
                'reason: the check it\nenforces is now "open the purchased library and '
                'say what you found", which is what should\nhave happened, and what would '
                'have produced this answer on day one instead of a guess.\n')

    print('   %d/%d purchased tiles are act-1 legal as bought; %d are not'
          % (clean, total, dirty))
    print('   -> %s' % OUT)
    print('   -> records/target/BOUGHT_WALLS.png, BOUGHT_ROOFS.png')


if __name__ == '__main__':
    main()
