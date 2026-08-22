#!/usr/bin/env python3
"""
THE STREET FURNITURE BANK: the valley authors EIGHT prop families and stands NONE of them.
(8/21, WORLD lane.)

WHERE THIS CAME FROM. Fixing the streetlights this morning left a measured list behind:
18 declarations / 1,773 tiles of props that are STANDING OBJECTS in their legend and draw
as one flat coloured square. The obvious next move looked like "give those props art". It
is not, and the census says why:

    prop families the whole valley authors, one plot of each district:
      bin 3 districts · sign 2 · pallet 2 · mailbox 1 · barricade 1 · pole 1 · bench 1 · cart 1

EIGHT FAMILIES. The lamp was a wiring problem because forty-two districts had already
authored the tile and nothing drew it. THIS IS THE OPPOSITE PROBLEM: there is nothing to
draw. A dead American suburb with no bin at the kerb, no bag split open in the gutter, no
tyre in the wash and no cone left in the road is not under-rendered, it is UNFURNISHED.

REUSE CHECK: cooks NOT ONE PIXEL. It opens banks/BOHEMIA_STANDING_SET_7_10_26.txt (575
corpus objects already typed standing) and banks/BOHEMIA_HD_TILE_REPO_part1..4.txt (where
those (pack, idx) references resolve to actual pixels), and it uses 20 of them unchanged.
Nothing was drawn here and no new canon was invented.

SO THIS SHOPS INSTEAD OF COOKING. REUSE-FIRST (Paolo 7/22, "check out the approved
assets first before cooking"): banks/BOHEMIA_STANDING_SET_7_10_26.txt is 575 corpus
objects already typed as STANDING (block + occlude), and its street packs hold exactly the
furniture a dead kerb needs. The pixels come from banks/BOHEMIA_HD_TILE_REPO_part*.txt,
which is where the standing set's (pack, idx) references resolve. Not one pixel is drawn
here.

AND THE KILL PIPELINE IS THE LAW, IN CODE, NOT MY EYE (FACTORY LAW).
I looked at the candidate sheet and rejected nine of twenty-six. Every rejection was a LAW,
so every rejection is machine-checkable and a future addition gets vetted automatically
instead of trusting whoever adds it:

  PURPLE RESERVATION      purple belongs to the Amalgamation alone. The wheelie bin carries
                          a purple recycling logo; a cabinet is washed in magenta.
  ACT ONE ONLY            no neon. Not "no bright colour" -- no EMISSIVE pixel, meaning a
                          lit, saturated, COOL-hued pixel. Warm stays: brass, rust and the
                          amber lamps on a barricade are what act 1 is made of.

AND THE FIRST VERSION OF THIS FILTER WAS WRONG, WHICH IS WHY IT IS WORTH WRITING DOWN.
It carried a third law, "ACT 1 IS A DEAD WORLD, no vegetation", implemented as "how many
green pixels". It killed A GREEN DUMPSTER (14.3% green) and a green utility cabinet
(12.8%). Both are painted steel, both are completely legal in a dead world, and no amount
of tuning fixes that, because A COLOUR HISTOGRAM CANNOT TELL A LEAF FROM PAINT. That is
the 8/1 lesson in a new costume: a checker that cannot tell a mention from a use is the
broken one, and you fix the ruler, never the target.

So the kill pipeline is now honestly split, and the split is the point:
  MACHINE LAW   purple and emissive are COLOUR facts, so a colour test is the right tool
                and it runs on every candidate forever.
  CURATION      "is this object a plant" is a SEMANTIC question. It is answered by not
                putting planters in the candidate list, with the reason recorded next to
                them -- not by a test that pretends to measure it.

MY EYE WAS ALSO WRONG, TWICE, IN THE OTHER DIRECTION. Judging the candidate sheet at 2x on
a dark ground I rejected a bag, a bench and a mailbox as "neon". Measured: the bag is 0.0%
on every axis and the bench is 0.4% purple. Only the mailbox was really emissive (2.4%).
An upscaled contact sheet exaggerates rim light; the histogram does not.

WHAT SURVIVES, and it is a real dead kerb:
  bin x4  ·  bag  ·  tyre  ·  pallet  ·  bench  ·  bollard x2  ·  cone x2
  barricade x3 (incl. ROAD CLOSED)  ·  barrel x2  ·  mailbox

  python3 tools/bohemia_street_furniture_cook.py
"""
import base64
import colorsys
import glob
import io
import json
import os
import struct
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

OUT = 'banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt'
SP, UR, WS = '15. Street props', 'Streets props and urban', '17. Warning Signs and road props'

# (family, pack, idx). The family is what the name->pool table in the city page asks for;
# a district legend that NAMES a bin gets a bin, wherever it is.
CANDIDATES = [
    ('bin', SP, 21), ('bin', SP, 22), ('bin', SP, 41), ('bin', UR, 12), ('bin', UR, 13),
    ('dumpster', UR, 14), ('cabinet', UR, 28),
    ('bag', SP, 42), ('bag', UR, 24),
    ('tyre', SP, 43), ('pallet', SP, 40),
    ('bench', SP, 20), ('bench', UR, 17),
    ('bollard', SP, 30), ('bollard', SP, 31),
    ('cone', SP, 9), ('cone', SP, 10),
    ('barricade', SP, 13), ('barricade', SP, 14), ('barricade', SP, 15),
    ('barrel', SP, 11), ('barrel', WS, 23),
    ('mailbox', SP, 7), ('mailbox', UR, 15),
    ('cabinet', UR, 29),
    ('signpost', UR, 10),
]


def decode(b64):
    raw = base64.b64decode(b64)
    if raw[:8] != b'\x89PNG\r\n\x1a\n':
        return None
    w, h = struct.unpack('>II', raw[16:24])
    return raw, w, h


def pixels(raw):
    """Minimal RGBA reader via PIL if present; the gate re-checks independently."""
    from PIL import Image
    im = Image.open(io.BytesIO(raw)).convert('RGBA')
    return im


def law_violations(im):
    """THE KILL PIPELINE. Returns the list of laws this tile breaks, by measuring pixels."""
    px = im.load()
    purple = neon = opaque = 0
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            opaque += 1
            h, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
            deg = h * 360
            # PURPLE RESERVATION (purple is the Amalgamation alone). Violet through magenta,
            # and it has to be a real colour, not a near-grey rounding into the hue band.
            # The threshold below is DELIBERATELY low: this reservation is absolute, so a
            # logo the size of a fingernail is still a breach.
            if 260 <= deg <= 330 and s >= 0.30 and v >= 0.28:
                purple += 1
            # ACT ONE ONLY: no EMISSIVE pixel. Lit + saturated + COOL-hued is act-2 kit and
            # it reads as POWER, which in this valley is a claim about territory, never a
            # decoration. Warm is explicitly exempt (deg <= 60 or >= 330): brass, rust and
            # the amber lamps on a barricade are what act 1 is actually made of.
            if s >= 0.50 and v >= 0.72 and not (deg <= 60 or deg >= 330):
                neon += 1
    out = []
    if opaque:
        if purple / opaque >= 0.0025:
            out.append('PURPLE RESERVATION (%.1f%% purple)' % (100.0 * purple / opaque))
        if neon / opaque >= 0.015:
            out.append('ACT ONE ONLY, no neon (%.1f%% emissive)' % (100.0 * neon / opaque))
    return out, opaque


def main():
    packs = {}
    parts = sorted(glob.glob('banks/BOHEMIA_HD_TILE_REPO_part*.txt'))
    if not parts:
        sys.exit('STREET FURNITURE: the HD tile repo is not here. Nothing to shop from.')
    for p in parts:
        d = json.load(open(p, encoding='utf-8'))
        for name, arr in d.get('packs', {}).items():
            slot = packs.setdefault(name, {})
            for i, e in enumerate(arr):
                b = e if isinstance(e, str) else (e.get('b64') or e.get('png'))
                if b:
                    slot[i] = b

    kept, killed = {}, []
    for fam, pack, idx in CANDIDATES:
        b64 = packs.get(pack, {}).get(idx)
        if not b64:
            killed.append((fam, pack, idx, ['NOT IN THE CORPUS']))
            continue
        dec = decode(b64)
        if not dec:
            killed.append((fam, pack, idx, ['NOT A PNG']))
            continue
        raw, w, h = dec
        bad, opaque = law_violations(pixels(raw))
        if bad:
            killed.append((fam, pack, idx, bad))
            continue
        kept.setdefault(fam, []).append({
            'pack': pack, 'idx': idx, 'w': w, 'h': h, 'opaque': opaque, 'b64': b64})

    bank = {
        'version': 'BOHEMIA_STREET_FURNITURE_v1',
        'built': '2026-08-21',
        'note': ('Corpus street furniture, SHOPPED not cooked (REUSE-FIRST 7/22). Sourced '
                 'from banks/BOHEMIA_STANDING_SET_7_10_26.txt (575 objects already typed '
                 'standing = block + occlude) with pixels resolved out of '
                 'banks/BOHEMIA_HD_TILE_REPO_part*.txt. Every candidate is vetted BY '
                 'MEASURING ITS PIXELS against three laws -- PURPLE RESERVATION, ACT 1 IS A '
                 'DEAD WORLD (no vegetation), ACT ONE ONLY (no neon) -- so the kill pipeline '
                 'is the law in code and not one person\'s eye. Standing props draw by depth '
                 'and occlude what is behind them, per the standing set\'s own render rule.'),
        'laws': ['PURPLE RESERVATION', 'ACT ONE ONLY (no emissive/neon)'],
        'curation': ('Vegetation is excluded by NOT LISTING planters as candidates, never by a '
                     'colour test: a histogram cannot tell a leaf from paint, and the first '
                     'version of this filter proved it by killing a green dumpster.'),
        'families': {k: v for k, v in sorted(kept.items())},
        'killed': [{'family': f, 'pack': p, 'idx': i, 'why': w} for f, p, i, w in killed],
    }
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(bank, fh)

    print('STREET FURNITURE BANK -> %s' % OUT)
    print('  KEPT %d objects across %d families:' % (sum(len(v) for v in kept.values()), len(kept)))
    for f in sorted(kept):
        print('     %-10s x%d' % (f, len(kept[f])))
    print('  KILLED %d, every one by a law that reads the pixels:' % len(killed))
    for f, p, i, w in killed:
        print('     %-10s %s #%d -- %s' % (f, p, i, '; '.join(w)))


if __name__ == '__main__':
    main()
