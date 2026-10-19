#!/usr/bin/env python3
"""CHARACTER [way more hair and faces]: THE SHEETS for HAIR 2 and FACES 1 (three cards: the twelve new cuts; the twelve
face shapes; the facial hair and the marks).

Per piece, one row: the game's own picture today at 1:1 (HAIR 2: the nearest of the barber's eleven flat cuts, since the
game has never drawn these twelve; FACES 1: the starred face at the default dials, the one face every head wears today),
the model's eight facings at 1:1 (DIRECTION's rig, unedited), and the same head at the portrait's 128 (S and SE).

Run: python3 tools/bohemia_character_hair_two_sheet.py hair2|shapes|pieces
Out: records/target/character/CHARACTER_<NAME>.png and its first picture CHARACTER_<NAME>_FIRST.png/.json

REUSE CHECK: every head is the rig's render or buildFrame's, pasted whole; only the labels are drawn here (HAIR 1's sheet).
REFERENCE CHECK: the twin is the game's own flat cut or the game's own starred face, 1:1 and 128; no reference game.
"""
import json
import os
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_hair_two as H2  # noqa: E402
import bohemia_character_faces_one as F1  # noqa: E402

BASE = os.path.join(ROOT, 'records/target/character/barber')
FLAT = os.path.join(ROOT, 'records/target/character/barber_flat')
FAC = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
BG = (22, 21, 20); INK = (220, 214, 200); DIM = (150, 144, 130); HEAD = (200, 190, 120)
# the nearest of the barber's eleven flat cuts, the game's picture today beside a cut it has never drawn
NEAREST = {'RAZOR SKULL': 'deep_taper', 'HOME CLIPPERS': 'temple_taper', 'HORSESHOE': 'dry_taper', 'COMB OVER': 'dry_taper',
           'GREASE BACK': 'temple_taper', 'LONG DROP': 'layered_fall', 'SPRING CURLS': 'coil_crown', 'STATIC': 'shag',
           'HALF SHAVE': 'curtain_cut', 'BOX BRAIDS': 'rope_locks', 'FINGER WAVES': 'heavy_fringe', 'SCORCH': 'temple_taper'}
SHEETS = {
    'hair2': dict(out='CHARACTER_HAIR_TWO', names=lambda: H2.CARD_ORDER, spec=lambda n: H2.CUTS[n],
                  title="CHARACTER: HAIR 2, TWELVE NEW CUTS ON THE 3D HEAD, THE GRIMY CRASHBOX WAY. Clumps, locks, ropes and plaits (HAIR 1's method, his YES).",
                  first='SPRING CURLS'),
    'shapes': dict(out='CHARACTER_FACES_ONE_SHAPES', names=lambda: F1.SHAPE_ORDER, spec=lambda n: F1.CUTS[n],
                   title="CHARACTER: FACES 1, TWELVE FACE SHAPES ON THE 3D HEAD, from the face maker's fourteen dials (a face is a row of numbers).",
                   first='FACE LANTERN JAW'),
    'pieces': dict(out='CHARACTER_FACES_ONE_BEARDS_AND_MARKS', names=lambda: F1.PIECE_ORDER, spec=lambda n: F1.CUTS[n],
                   title="CHARACTER: FACES 1, ELEVEN KINDS OF FACIAL HAIR AND EIGHT MARKS ON THE 3D HEAD (seven beards and five marks new).",
                   first='BEARD LONG BEARD'),
}


def trim(im):
    bb = im.getbbox()
    return im.crop(bb) if bb else im


def load(p):
    return Image.open(p).convert('RGBA') if os.path.exists(p) else None


def row(kind, name, spec):
    d = os.path.join(BASE, spec['tag'])
    if kind == 'hair2':
        tw = load(os.path.join(FLAT, '%s_SE_k01.png' % NEAREST[name])); twin_label = 'GAME (nearest: %s)' % NEAREST[name].replace('_', ' ')
    else:
        tw = load(os.path.join(BASE, 'temple_taper', 'rig_portrait_S.png')); twin_label = 'THE ONE FACE TODAY'
    tw = trim(tw) if tw else Image.new('RGBA', (8, 8))
    st = [trim(s) for s in (load(os.path.join(d, 'rig_%s.png' % f)) for f in FAC) if s is not None]
    po = [p for p in (load(os.path.join(d, 'rig_portrait_%s.png' % f)) for f in ('S', 'SE')) if p is not None]
    h = max([tw.height] + [s.height for s in st] + [p.height for p in po]) + 26
    w = 190 + tw.width + 16 + sum(s.width + 4 for s in st) + 16 + sum(p.width + 6 for p in po) + 8
    im = Image.new('RGBA', (w, h), BG + (255,)); dr = ImageDraw.Draw(im)
    label = spec.get('label', name)
    dr.text((6, 6), label, fill=INK)
    sub = spec.get('made_by') or 'NEW, 10/19'
    dr.text((6, 20), sub[:30], fill=HEAD if 'CHARACTER' in sub or 'NEW' in sub else DIM)
    if kind == 'shapes':
        f = spec['face']; txt = ', '.join('%s %s' % (k.split('.')[-1], v) for k, v in f.items())
        for j in range(0, len(txt), 30): dr.text((6, 34 + 12 * (j // 30)), txt[j:j + 30], fill=DIM)
    else:
        dr.text((6, 34), ('worn: ' + spec.get('worn_by', ''))[:30], fill=DIM)
    x = 190
    im.alpha_composite(tw, (x, h - tw.height - 4)); dr.text((x, 4), twin_label, fill=DIM); x += max(tw.width, 60) + 16
    dr.text((x, 4), 'THE MODEL, 8 facings, 1:1', fill=DIM)
    for s in st:
        im.alpha_composite(s, (x, h - s.height - 4)); x += s.width + 4
    x += 16
    for p in po:
        im.alpha_composite(p, (x, h - p.height - 4)); x += p.width + 6
    return im


def main():
    kind = sys.argv[1]
    S = SHEETS[kind]
    names = S['names']()
    rows = [row(kind, n, S['spec'](n)) for n in names]
    W = max(r.width for r in rows) + 24
    H = 70 + sum(r.height + 6 for r in rows)
    out = Image.new('RGBA', (W, H), BG + (255,)); dr = ImageDraw.Draw(out)
    dr.text((12, 8), S['title'], fill=INK)
    dr.text((12, 24), "Each row: the game's own picture today, the model in eight facings (1:1), the same head at the portrait's 128. Draft: nothing is final.", fill=DIM)
    dr.text((12, 40), "57 px a metre, one pixel size | palette: the style palette (records/target/BOHEMIA_STYLE_PALETTE.json) | light: the rig's one sun, upper left", fill=DIM)
    y = 64; at = {}
    for n, r in zip(names, rows):
        out.alpha_composite(r, (12, y)); at[n] = [12, y, r.width, r.height]; y += r.height + 6
    p = os.path.join(ROOT, 'records/target/character/%s.png' % S['out'])
    out.convert('RGB').save(p, optimize=True)
    i = names.index(S['first'])
    rows[i].convert('RGB').save(p.replace('.png', '_FIRST.png'), optimize=True)
    json.dump({'firstAt': at[S['first']], 'rows': at}, open(p.replace('.png', '_FIRST.json'), 'w'), indent=1)
    print('wrote %s %dx%d' % (os.path.relpath(p, ROOT), W, H))


if __name__ == '__main__':
    main()
