#!/usr/bin/env python3
"""
BOHEMIA — THE BOUGHT-TILE CONDITIONER (7/31/26)

REUSE CHECK: this tool cooks NO new graphic pixels. It is the opposite of a cook —
it consumes banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt and the other PURCHASED
libraries and returns HIS OWN ART, unchanged in subject, shape and detail, moved
into the act-1 palette. Nothing is drawn, invented or replaced. Under BOUGHT BEATS
PAINTED that is the point: the art stays his.

WHY THIS EXISTS
---------------
Two locked laws met and nobody noticed:

  Paolo 7/31, FLEET-WIDE: "if i bought it i prefer it! Thats for all textures bro!!!"
  Act-1 palette law:      no pure black (luminance floor 17), no white (ceiling 232)

His purchased library is an asset-store bundle drawn for high-contrast fantasy and
sci-fi, so it is FULL of pure black. Measured on the exact bytes the run ships today
(tier S/A, pure, 44x44), not on the HD source:

  sidewalk + driveway   20 tiles   mean 2.2% pure black, worst 8.4%,  16/20 over 1%
  road                  13 tiles   mean 5.0% pure black, worst 15.0%,  9/13 over 1%

So the street Paolo walks on right now breaks the act-1 palette law, because his
tiles were shipped RAW and nothing in the machine measured them. bought_beats_painted
_gate.js checks that his art SHIPS and ships FIRST, which is right and which passes;
it never checked what colour it is.

The wrong fixes, named so nobody reaches for them later: painting a replacement
(violates the ruling), or rejecting his tiles as illegal (same thing wearing a
lab coat). His art is not the problem. The BLACK POINT is.

WHAT IT DOES
------------
A monotone luminance remap, applied per pixel, which is why it cannot damage the art:

  bottom   L < KNEE_LO  ->  FLOOR + L * (KNEE_LO - FLOOR) / KNEE_LO
  top      L > KNEE_HI  ->  CEIL  - (255 - L) * (CEIL - KNEE_HI) / (255 - KNEE_HI)
  middle   untouched

Ordering is preserved (darker stays darker), so no detail is crushed and no band
appears; it is a compression of the illegal tails into legal range, not a clip.
RGB is scaled uniformly, so HUE AND SATURATION ARE UNTOUCHED — a bought tile keeps
its exact colour identity and only stops bottoming out at black.

Purple is NOT touched here. PURPLE RESERVATION is already enforced upstream by the
`pure` flag on every bank tile, and rotating a hue is a change to his art rather
than to its black point. Impure tiles are filtered, never repainted.

  python3 tools/bohemia_bought_conditioner.py
    -> banks/BOHEMIA_BOUGHT_CONDITIONED_7_31_26.txt
    -> records/target/BOUGHT_CONDITIONED.png   (before | after, his eyes decide)
"""
import base64
import io
import json
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image, ImageDraw  # noqa: E402

FLOOR, CEIL = 17, 232
KNEE_LO, KNEE_HI = 56, 216

LIB = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'
OUT = 'banks/BOHEMIA_BOUGHT_CONDITIONED_7_31_26.txt'
SHEET = 'records/target/BOUGHT_CONDITIONED.png'

# the surfaces the run actually draws his art on today, by the pack names it matches
SURFACES = [
    ('sidewalk + driveway', r'contrete|concrete'),
    ('road',                r'cracked street'),
    ('dirt',                r'soil and dirt'),
    ('stone path',          r'stone paths'),
]


def rgba(im):
    """RGBA pixels as a list of 4-tuples, without the deprecated Image.getdata().

    Pillow 14 deprecates that call and it sprayed a DeprecationWarning into the
    shared gate log on every run, which every other lane reads. tobytes() is the
    supported path and is faster.
    """
    b = im.convert('RGBA').tobytes()
    return [tuple(b[i:i + 4]) for i in range(0, len(b), 4)]


def lum(r, g, b):
    return 0.299 * r + 0.587 * g + 0.114 * b


def condition_px(r, g, b):
    """move one pixel into act-1 without moving its hue or saturation"""
    L = lum(r, g, b)
    if L < KNEE_LO:
        if L <= 0.5:                      # no hue to preserve: neutral floor grey
            return FLOOR, FLOOR, FLOOR
        target = FLOOR + L * (KNEE_LO - FLOOR) / KNEE_LO
    elif L > KNEE_HI:
        target = CEIL - (255.0 - L) * (CEIL - KNEE_HI) / (255.0 - KNEE_HI)
    else:
        return r, g, b
    k = target / L
    return (min(255, int(round(r * k))),
            min(255, int(round(g * k))),
            min(255, int(round(b * k))))


def condition(im):
    im = im.convert('RGBA')
    px = rgba(im)
    out, cache = [], {}
    for r, g, b, a in px:
        key = (r, g, b)
        v = cache.get(key)
        if v is None:
            v = cache[key] = condition_px(r, g, b)
        out.append((v[0], v[1], v[2], a))
    new = Image.new('RGBA', im.size)
    new.putdata(out)
    return new


def illegal(im):
    """percent of PAINTED pixels outside act-1 (alpha-aware: a cut-out is not black)"""
    px = [(r, g, b) for r, g, b, a in rgba(im) if a > 8]
    if not px:
        return 0.0
    bad = sum(1 for r, g, b in px if lum(r, g, b) < FLOOR or lum(r, g, b) > CEIL)
    return 100.0 * bad / len(px)


def png(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG')
    return base64.b64encode(buf.getvalue()).decode()


def main():
    bank = json.load(open(LIB))
    tiles, rows, pairs = [], [], []
    for name, pat in SURFACES:
        sel = [t for t in bank['tiles']
               if re.search(pat, str(t.get('pack', '')).lower())
               and t.get('tier') in ('S', 'A') and t.get('pure') is True and t.get('b64')]
        before = after = 0.0
        worst_b = worst_a = 0.0
        for t in sel:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64'])))
            b = illegal(im)
            new = condition(im)
            a = illegal(new)
            before += b
            after += a
            worst_b = max(worst_b, b)
            worst_a = max(worst_a, a)
            tiles.append(dict(surface=name, pack=t['pack'], idx=t['idx'],
                              tier=t['tier'], pure=True, b64=png(new)))
            if len(pairs) < 24 and b > 1.0:
                pairs.append((t['pack'], im.convert('RGBA'), new))
        if sel:
            rows.append((name, len(sel), before / len(sel), after / len(sel),
                         worst_b, worst_a))

    if not tiles:
        print('CONDITIONER REFUSES: no purchased tiles matched'); return 1

    # before | after, because a number is not a look
    C, S = 6, 96
    n = len(pairs)
    r = (n + C - 1) // C
    sheet = Image.new('RGBA', (C * (S * 2 + 8), r * (S + 14)), (30, 30, 34, 255))
    dr = ImageDraw.Draw(sheet)
    for i, (pk, b, a) in enumerate(pairs):
        x, y = (i % C) * (S * 2 + 8), (i // C) * (S + 14)
        sheet.paste(b.resize((S, S), Image.NEAREST), (x, y))
        sheet.paste(a.resize((S, S), Image.NEAREST), (x + S + 4, y))
        dr.text((x + 2, y + S), 'BOUGHT | act-1  %s' % pk[:22], fill=(205, 205, 205, 255))
    sheet.save(SHEET)

    json.dump({
        'version': 'BOHEMIA_BOUGHT_CONDITIONED_v1',
        'date': '2026-07-31',
        'note': 'HIS PURCHASED TILES, moved into act-1. Subject, shape, detail, hue and '
                'saturation are untouched; only the illegal black and white tails are '
                'compressed into [%d,%d] by a monotone remap. Source: %s. This is not '
                'new art and must never be treated as a painted alternative to his '
                'library - it IS his library, legal.' % (FLOOR, CEIL, LIB),
        'ruling': 'Paolo 7/31 FLEET-WIDE: "if i bought it i prefer it! Thats for all '
                  'textures bro!!!" + act-1 palette law (no pure black, no white)',
        'transform': dict(floor=FLOOR, ceil=CEIL, knee_lo=KNEE_LO, knee_hi=KNEE_HI),
        'counts': {name: n for name, n, _b, _a, _wb, _wa in rows},
        'tiles': tiles,
    }, open(OUT, 'w'))

    print('CONDITIONED %d purchased tiles (his art, act-1 legal)' % len(tiles))
    print('   %-22s %5s  %-16s %-16s' % ('surface', 'tiles', 'illegal% before', 'after'))
    for name, n, b, a, wb, wa in rows:
        print('   %-22s %5d  mean %5.2f worst %5.2f  ->  mean %5.2f worst %5.2f'
              % (name, n, b, wb, a, wa))
    print('   -> %s' % OUT)
    print('   -> %s' % SHEET)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
