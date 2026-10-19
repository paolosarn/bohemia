#!/usr/bin/env python3
"""CHARACTER HAIR 1: THE SHEET (the roll call's first batch, his order: hair first).

Per cut, one row: the game's flat body wearing the cut today (buildFrame, SE, the passing key, 1:1), the model's eight
facings at 1:1 (DIRECTION's rig, unedited), and the same head at the portrait's 128 (S and SE). The barber's first three
cuts (his UP on character-the-barber-on-the-skull-10-18) head the sheet so the eight new ones sit beside them.

Run: python3 tools/bohemia_character_hair_one_sheet.py [<renders dir>]   (default records/target/character/barber)
Out: records/target/character/CHARACTER_HAIR_ONE.png and its first picture CHARACTER_HAIR_ONE_FIRST.png (one cut whole)

REUSE CHECK: every head is the rig's render or buildFrame's, pasted whole; only the labels are drawn here.
REFERENCE CHECK: the twin is the game's own flat cut as the body wears it today, 1:1; no reference game.
"""
import os
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_hair_one as H1  # noqa: E402

FLAT = os.path.join(ROOT, 'records/target/character/barber_flat')
OUT = os.path.join(ROOT, 'records/target/character/CHARACTER_HAIR_ONE.png')
FIRST = os.path.join(ROOT, 'records/target/character/CHARACTER_HAIR_ONE_FIRST.png')
FAC = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
OLD = [('TEMPLE TAPER', 'temple_taper'), ('COIL CROWN', 'coil_crown'), ('LAYERED FALL', 'layered_fall')]
BG = (22, 21, 20); INK = (220, 214, 200); DIM = (150, 144, 130); HEAD = (200, 190, 120)


def still(d, f):
    for n in ('rig_%s.png' % f, 'raw_%s.png' % f):
        p = os.path.join(d, n)
        if os.path.exists(p):
            return Image.open(p).convert('RGBA')
    return None


def portrait(d, f):
    for n in ('rig_portrait_%s.png' % f, 'raw_portrait_%s.png' % f):
        p = os.path.join(d, n)
        if os.path.exists(p):
            return Image.open(p).convert('RGBA')
    return None


def trim(im):
    bb = im.getbbox()
    return im.crop(bb) if bb else im


def row(name, tag, base):
    d = os.path.join(base, tag)
    flat = trim(Image.open(os.path.join(FLAT, '%s_SE_k01.png' % tag)).convert('RGBA'))
    st = [still(d, f) for f in FAC]
    st = [trim(s) for s in st if s is not None]
    po = [p for p in (portrait(d, 'S'), portrait(d, 'SE')) if p is not None]
    po = [p.resize((128, int(128 * p.height / p.width)), Image.LANCZOS) if p.width != 128 else p for p in po]
    h = max([flat.height] + [s.height for s in st] + [p.height for p in po]) + 24
    w = 160 + flat.width + 16 + sum(s.width + 4 for s in st) + 16 + sum(p.width + 6 for p in po) + 8
    im = Image.new('RGBA', (w, h), BG + (255,)); dr = ImageDraw.Draw(im)
    dr.text((6, 6), name, fill=INK)
    spec = H1.CUTS.get(name)
    dr.text((6, 20), 'NEW: clumps and locks' if spec else 'his UP, 10/18', fill=HEAD if spec else DIM)
    x = 160
    im.alpha_composite(flat, (x, h - flat.height - 4)); dr.text((x, 4), 'GAME', fill=DIM); x += flat.width + 16
    dr.text((x, 4), 'THE MODEL, 8 facings, 1:1', fill=DIM)
    for s in st:
        im.alpha_composite(s, (x, h - s.height - 4)); x += s.width + 4
    x += 16
    for p in po:
        im.alpha_composite(p, (x, h - p.height - 4)); x += p.width + 6
    return im


def main():
    base = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'records/target/character/barber')
    rows = [row(n, t, os.path.join(ROOT, 'records/target/character/barber')) for n, t in OLD]
    rows += [row(n, H1.CUTS[n]['tag'], base) for n in H1.ORDER]
    W = max(r.width for r in rows) + 24
    H = 70 + sum(r.height + 6 for r in rows)
    out = Image.new('RGBA', (W, H), BG + (255,)); dr = ImageDraw.Draw(out)
    dr.text((12, 8), 'CHARACTER: HAIR 1, THE BARBER\'S ELEVEN CUTS ON THE STARRED HEAD. The eight new ones are clumps, locks, ropes and braids, never a mesh.', fill=INK)
    dr.text((12, 24), 'Each row: the game\'s flat cut today (1:1), the model in eight facings (1:1), the same head at the portrait\'s 128. Draft: nothing is final.', fill=DIM)
    dr.text((12, 40), '57 px a metre, one pixel size | palette: the style palette (records/target/BOHEMIA_STYLE_PALETTE.json) | light: the rig\'s one sun, upper left', fill=DIM)
    y = 64
    for r in rows:
        out.alpha_composite(r, (12, y)); y += r.height + 6
    out.convert('RGB').save(OUT, optimize=True)
    # the first picture: the rope locks' row, the cut furthest from anything the game draws today
    i = 3 + H1.ORDER.index('ROPE LOCKS')
    rows[i].convert('RGB').save(FIRST, optimize=True)
    print('wrote %s %dx%d and its first picture %s' % (os.path.relpath(OUT, ROOT), W, H, os.path.relpath(FIRST, ROOT)))


if __name__ == '__main__':
    main()
