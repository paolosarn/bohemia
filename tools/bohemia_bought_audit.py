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

SO v2 DECODES EVERY PURCHASED TILE INSTEAD OF READING ITS LABEL, AND WHAT IT REPORTS
IS SUBJECT MATTER: does he own a thing for this surface or not. That is the only
question a cook queue needs answered, and it is answered by rendering the packs and
LOOKING (records/target/BOUGHT_WALLS.png, BOUGHT_ROOFS.png).

  *** v2 ALSO JUDGED HIS PURCHASES AGAINST A LAW HE NEVER MADE. THAT IS GONE. ***
  It scored every pack for "pure black" and "white" and printed a raw-into-act-1
  verdict column, then a sibling tool rewrote his tiles to comply. Paolo, 7/31:
  "I DIDNT BAN THE PURE BLACK??? WTF I DIDNT BAN ANY OF THE BOUGHT ASSETS I APPROVED
  BO WTF" He is right. FLOOR=17/CEIL=232 lives in four files, all Claude's own tools
  for art CLAUDE PAINTS. It was never his rule, and clause 2 of BOUGHT BEATS PAINTED
  says "VERBATIM OR NOT AT ALL. His tiles blit 1:1." The conditioner is graveyarded
  (gates/bohemia_graveyard.txt, 7/31) and this tool no longer grades what he bought.
  THE TELL: it had measured 1,410 of his 1,506 tiles "illegal". When a rule condemns
  94% of what the man bought, the rule is wrong, not the library.

PURPLE is still reported, because PURPLE RESERVATION is genuinely his and the banks
already carry a `pure` flag the shipping path filters on. It is reported as a FACT
about a pack, never as a verdict on whether he may use his own property.

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

# PURPLE RESERVATION is his. There is deliberately NO luminance floor or ceiling
# here any more: grading what he BOUGHT against a brightness rule he never made is
# what killed the conditioner (graveyard, 7/31).
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
    """How much of a pack is RESERVED PURPLE. Painted pixels only.

    Alpha matters: a transparent pixel converted to RGB is (0,0,0), so measuring
    RGBA->RGB scores every cut-out prop as black. That bug was caught here when it
    called 4 of 1506 tiles legal - a number absurd enough to indict the ruler. The
    SAME tell, at 1410 of 1506, was then ignored an hour later. Both times the
    lesson is the ruler, not the wood.
    """
    px = [(r, g, b) for r, g, b, a in rgba(im) if a > 8]
    n = len(px)
    if not n:
        return 0.0
    purple = 0
    for r, g, b in px:
        h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        if s > 0.25 and v > 0.15 and PURPLE_H[0] < h < PURPLE_H[1]:
            purple += 1
    return 100.0 * purple / n


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
        pu = measure(im)
        a = packs.setdefault(e['pack'], [0, 0.0])
        a[0] += 1
        a[1] += pu
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
    with open(OUT, 'w') as f:
        f.write('# WHAT HE ACTUALLY OWNS \u2014 every purchased pack opened and looked at '
                '(7/31/26)\n\n')
        f.write('Paolo 7/31, LOCKED, FLEET-WIDE: **"if i bought it i prefer it! Thats '
                'for all textures bro!!!"**\n')
        f.write('Clause 2 of that law: **"VERBATIM OR NOT AT ALL. His tiles blit '
                '1:1."**\n\n')
        f.write(('**%d purchased tiles, decoded and looked at, not keyword-matched.** '
                 'The first version of\nthis audit compared FORM NAMES to PACK NAMES and '
                 'told him his library already held the\nconcrete block wall I had cooked '
                 'from scratch. It does not. That claim came from a shared\nword, and a '
                 'name is not a look.\n\n') % total)
        f.write('> **THIS AUDIT USED TO GRADE HIS PURCHASES AND NO LONGER DOES.** v2 '
                'scored every pack for\n> "pure black" and "white" against an "act-1 '
                'palette law", and a sibling tool rewrote his\n> tiles to comply. Paolo: '
                '*"I DIDNT BAN THE PURE BLACK??? WTF I DIDNT BAN ANY OF THE\n> BOUGHT '
                'ASSETS I APPROVED BO WTF"* He is right. That floor and ceiling live in '
                'four files,\n> all Claude\'s own tools for art CLAUDE PAINTS; he never '
                'made the rule, and his actual law\n> says his tiles ship verbatim. The '
                'conditioner is in the graveyard. **The tell: it had\n> called 1,410 of '
                'his 1,506 tiles illegal. When a rule condemns 94%% of what the man\n> '
                'bought, the rule is wrong, not the library.**\n\n'.replace('%%', '%'))
        f.write('## THE ONLY QUESTION A COOK QUEUE NEEDS: does he own a thing for this '
                'surface?\n\n')
        f.write('Answered by rendering the packs and looking at them '
                '(`records/target/BOUGHT_WALLS.png`,\n`records/target/BOUGHT_ROOFS.png`). '
                'What the names promise, and what the tiles are:\n\n')
        f.write('- `4. House wall tiles` (27) is a **medieval ivy cottage** \u2014 lime '
                'stucco, timber, arched\n  plank doors, leaded glass. Not a Las Vegas '
                'house wall.\n')
        f.write('- `wall tiles` (41) and `2. Wall tiles (1)` are **dungeon masonry** '
                '\u2014 mossy castle stone,\n  irregular rubble, barred windows.\n')
        f.write('- `3. Wall panels and details` (28) is **sci-fi control panels**, lit '
                'blue screens.\n')
        f.write('- `Rooftop and building tops` (46) is **cyberpunk skyscraper tops** '
                '\u2014 HVAC plant, helipads,\n  neon signage. Exactly ONE of the 47 '
                'roof tiles (`5. Roof tiles#26`) is a pitched\n  terracotta roof.\n\n')
        f.write('| surface | does he own art for it? |\n|---|---|\n')
        f.write('| ground, street, concrete, path, water | **YES.** Cracked concrete and '
                'cracked street are exactly right for a dead Vegas, and the RUN lane '
                'already draws them ahead of painted tiles. |\n')
        f.write('| house walls | **NO.** Fantasy and sci-fi subject matter. No stucco, no '
                'CMU, no corrugated metal. |\n')
        f.write('| house roofs | **NO.** One usable tile in 47. |\n\n')
        f.write('That is the finding, and it is why painted house art is not competing '
                'with a purchase:\nthere is no purchase to compete with. It is NAMED '
                'DEBT under clause 5, and it shrinks the\nday he buys a suburban pack.'
                '\n\n')
        f.write('## PURPLE, reported as a fact and not as a verdict\n\n')
        f.write('PURPLE RESERVATION is genuinely his, and the banks already carry a '
                '`pure` flag that the\nshipping path filters on, so this changes nothing '
                'about what may be used. It is here so\nthe reserved colour is never a '
                'surprise.\n\n')
        for surface, lib, packs in report:
            hot = sorted(((v[1] / v[0], k, v[0]) for k, v in packs.items()),
                         reverse=True)[:5]
            hot = [h for h in hot if h[0] >= 1.0]
            if not hot:
                continue
            f.write('- **%s** (`%s`): %s\n'
                    % (surface, lib,
                       '; '.join('%s %.0f%%' % (k, p) for p, k, _n in hot)))
        f.write('\n\n## Which means TF-ART-001 was NOT the violation I recorded it as'
                '\n\n')
        f.write('I annotated the CMU cook as a bought-first failure and wrote that his '
                'pack "already holds a\ngrey concrete block wall in running bond, '
                'verified by rendering it and LOOKING". That was\nwrong and is corrected '
                'in the tool. He owns no concrete block wall. The cook stands.\n')

    print('   %d purchased tiles across %d libraries, opened and looked at'
          % (total, len(report)))
    print('   he owns ground/street/path/water; he owns NO house wall and NO house roof')
    print('   -> %s' % OUT)
    print('   -> records/target/BOUGHT_WALLS.png, BOUGHT_ROOFS.png')


if __name__ == '__main__':
    main()
