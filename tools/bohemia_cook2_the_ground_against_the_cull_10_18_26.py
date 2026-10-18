#!/usr/bin/env python3
"""COOK TWO, 10/18: THE GROUND AGAINST THE CULL (reads only; draws nothing). The NOT VIBE CODED gate's N3 (rule 114b)
held the sheet [the same crossing before and after] out of VOTE: every kit_street piece fails D2, D3 or D4. Before
fixing the art, this measures whether the ruler holds HIS OWN TILES: the same held verdict (class tile, family ground,
the pack bands, DIRECTION's guide) on
  (1) every road and ground tile he bought (reference/art_bank/road, reference/art_bank/ground),
  (2) the 21 kit_street pieces whole (515 x 364, each laid from about sixteen pack tiles),
  (3) the same pieces cut into 88 px cells, his pack tile's own size, three cells a piece.
Writes records/target/COOK2_THE_GROUND_AGAINST_THE_CULL.json.
  python3 tools/bohemia_cook2_the_ground_against_the_cull_10_18_26.py

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set), the card of numbers and skills/bohemia-pixel-art, AH-01 and AH-03.
The source is his own tiles and the kit as laid; no reference game.

REUSE CHECK (REUSE-FIRST, 7/22, written 10/18): it makes no art; it measures his own tiles and the kit against the NOT VIBE CODED ruler.

TASTE CHECK (written 10/18): his rulings on the ground are the bar: his 10/10 "look again at the tiles we downloaded", his UP on the curb, the crossing and the 47, his NO on the Vegas block (composition); the sheet goes to DIRECTION, then the VOTE tab.
"""
import collections, contextlib, glob, io, json, os, sys, tempfile
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'gates')); sys.path.insert(0, os.path.join(R, 'tools'))
import not_vibe_coded_gate as G  # noqa: E402

N = G.N
FIVE = ('D1', 'D2', 'D3', 'D4', 'D5')
CELL = 88


def main():
    T = N.thresholds()
    with contextlib.redirect_stdout(io.StringIO()):
        bands = G.n2()
    fam, guide = G.KIND_FAMILY.get('tile', 'all'), N.guide()

    def fails(p):
        rep = N.sprite_report(p, 'tile', 'guide', None, T)
        v = G.held_verdict(rep, fam, bands, 'tile', p, guide)
        return [d for d in FIVE if v[d][0] is False]

    kit = [f for f in sorted(glob.glob(os.path.join(R, 'slices/fight_ground/kit_street/*.webp')))
           if os.path.basename(f) not in ('before_after.webp', 'sample_board.webp')]
    tmp = tempfile.mkdtemp()
    cells = []
    for f in kit:
        im = Image.open(f).convert('RGBA')
        for i, (x, y) in enumerate([(40, 40), (200, 140), (380, 240)]):
            c = os.path.join(tmp, '%s_%d.png' % (os.path.basename(f)[:-5], i))
            im.crop((x, y, x + CELL, y + CELL)).save(c); cells.append(c)
    groups = {'his road tiles': sorted(glob.glob(os.path.join(R, 'reference/art_bank/road/pack_*.png'))),
              'his ground tiles': sorted(glob.glob(os.path.join(R, 'reference/art_bank/ground/pack_*.png'))),
              'kit_street pieces whole': kit,
              'kit_street at his tile size (88 px cells)': cells}
    out = {'lane': 'cook 2', 'made': '10/18', 'family': fam, 'class': 'tile', 'groups': {}}
    for k, fs in groups.items():
        c, n = collections.Counter(), 0
        for f in fs:
            try:
                b = fails(f)
            except Exception:
                continue
            n += 1; c.update(b); c['all five pass'] += not b
        row = {'n': n}
        for d in FIVE + ('all five pass',):
            row[d] = '%d (%.0f%%)' % (c[d], 100.0 * c[d] / max(1, n))
        out['groups'][k] = row
        print('%-44s n=%-4d %s' % (k, n, '  '.join('%s %s' % (d, row[d]) for d in FIVE + ('all five pass',))))
    json.dump(out, open(os.path.join(R, 'records/target/COOK2_THE_GROUND_AGAINST_THE_CULL.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
