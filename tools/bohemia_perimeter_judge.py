#!/usr/bin/env python3
"""
BOHEMIA — THE COMMUNITY WALL JUDGE PAGE (8/2/26)

REUSE CHECK: cooks NOTHING. Every pixel comes out of banks/BOHEMIA_PERIMETER_8_2_26.txt,
which tools/bohemia_perimeter_cook.py drew. This file only ARRANGES them, and the whole
point is that it arranges them the way the RUN does.

*** THE CARD MUST SHOW WHAT THE GAME SHOWS. ***
This exists because a scratch script built the first two rounds of this page and got it
wrong twice, both times in ways that cost Paolo a verdict:

  ROUND 1  To fit both gate kinds in one strip I put the STEEL LEAF on the coping row
           and the OPEN MOUTH on the row below. One opening, barred across the top and
           empty underneath. The game never does that - the kind is seeded per plot, so
           a neighbourhood is all-steel or all-open. He thumbed all three gate cards
           down and wrote "the gate assembly stuff actually looks decent" in the same
           breath. The card had invented the defect.
  ROUND 2  The strips drew the same gate overlay on both courses of a two-cell wall,
           which is what the run was doing too - so this one was honest, and he caught
           the real bug through it: "why is there a middle brick part of it".

So the arrangement rules live HERE, in the repo, where gates/perimeter_gate.py can read
them, instead of in a throwaway script nobody can check:

  FACES     shuffled by the SAME 2D cell hash the run uses (perimVar), so the page
            cannot show a calmer wall than the game draws
  PILLARS   every fourth cell, the run's own rhythm
  ROWS      upper course = cap/face, lower course = base. Two rows, because that is how
            thick the perimeter is where it runs along a block.
  GATE      the upper course gets the `_top` piece and the lower gets `_bottom`, never
            the same piece twice, and ONE KIND PER STRIP.

  python3 tools/bohemia_perimeter_judge.py
    -> slices/BOHEMIA_PERIMETER_JUDGE_8_2_26.html   (carded on the LIFE hub)
"""
import base64
import io
import json
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image  # noqa: E402

CELL = 44
BANK = 'banks/BOHEMIA_PERIMETER_8_2_26.txt'
PAGE = 'slices/BOHEMIA_PERIMETER_JUDGE_8_2_26.html'
VARIANTS = 8

MATERIALS = [
    ('perim_slump', 'tan slump block'),
    ('perim_cmu', 'bare grey CMU'),
    ('perim_stucco', 'stucco over block'),
    ('perim_precast', 'precast concrete panel'),
    ('perim_rose', 'desert rose stucco'),
    ('perim_splitface', 'grey split-face block'),
]
NAME = dict(MATERIALS)


def cell_hash(x, y, n):
    """THE RUN'S OWN perimVar, ported exactly. If this drifts, the page is showing a
    different wall from the one in the game, which is the whole failure mode above."""
    h = ((x * 2654435761) ^ (y * 2246822519) ^ 0x9E3779B9) & 0xFFFFFFFF
    h ^= h >> 15
    h = (h * 2246822519) & 0xFFFFFFFF
    h ^= h >> 13
    return (h % n) if n else 0


def main():
    bank = json.load(open(BANK))
    T = {t['id']: t['b64'] for t in bank['tiles']}

    def img(b):
        return Image.open(io.BytesIO(base64.b64decode(b))).convert('RGBA')

    def b64(im):
        b = io.BytesIO()
        im.save(b, 'PNG')
        return base64.b64encode(b.getvalue()).decode()

    def strip(mid, k, n=12, gate=None):
        """one run of wall, TWO COURSES, exactly as the renderer lays it."""
        faces = [T['%s_face_%d_%d' % (mid, v, k)] for v in range(VARIANTS)]
        bases = [T['%s_base_%d_%d' % (mid, v, k)] for v in range(VARIANTS)]
        pillar = T['%s_pillar_%d' % (mid, k)]
        sh = Image.new('RGBA', (CELL * n, CELL * 2), (0, 0, 0, 255))
        for i in range(n):
            top = img(pillar) if i % 4 == 0 else img(faces[cell_hash(i, 0, VARIANTS)])
            bot = img(bases[cell_hash(i, 1, VARIANTS)])
            if gate and gate[0] <= i <= gate[1]:
                end = 'l' if i == gate[0] else 'r' if i == gate[1] else 'm'
                kind = gate[2]
                # TOP on the upper course, BOTTOM on the lower. Never the same piece
                # twice: that is the brick band he circled.
                c = top.copy()
                c.alpha_composite(img(T['perim_gate_%s_%s_top' % (kind, end)]))
                top = c
                c = bot.copy()
                c.alpha_composite(img(T['perim_gate_%s_%s_bottom' % (kind, end)]))
                bot = c
            sh.paste(top, (i * CELL, 0))
            sh.paste(bot, (i * CELL, CELL))
        return sh

    cards = []
    for mid, nm in MATERIALS:
        for k in range(3):
            cards.append(dict(id='%s_%d' % (mid, k), side='live',
                              name='%s #%d' % (nm, k + 1), b64=b64(strip(mid, k))))
    # ONE KIND PER STRIP. Two strips, not one strip with both.
    for kind, label in (('steel', 'still hung'), ('open', 'standing open')):
        for mid in ('perim_slump', 'perim_rose', 'perim_cmu'):
            cards.append(dict(id='gate_%s_%s' % (kind, mid), side='gate',
                              name='the gate %s, in %s' % (label, NAME[mid]),
                              b64=b64(strip(mid, 0, 12, gate=(4, 7, kind)))))

    src = open(PAGE, encoding='utf8').read()
    # GUARD ON THE MATCH, NOT ON THE CHANGE. The first version refused when the output
    # came out identical to the input - which is what a correct re-run of a deterministic
    # cook looks like. "Nothing changed" is not "nothing was found"; refusing on it turns
    # every idempotent rebuild into a failure.
    if not re.search(r'const CARDS=\[.*?\];\n', src, re.S):
        raise SystemExit('REFUSING: could not find the CARDS array in ' + PAGE)
    out = re.sub(r'const CARDS=\[.*?\];\n',
                 'const CARDS=' + json.dumps(cards).replace('\\', '\\\\') + ';\n',
                 src, count=1, flags=re.S)
    open(PAGE, 'w', encoding='utf8').write(out)
    print('%d cards -> %s' % (len(cards), PAGE))
    print('  %d wall designs, %d gate strips (ONE KIND EACH)'
          % (sum(1 for c in cards if c['side'] == 'live'),
             sum(1 for c in cards if c['side'] == 'gate')))


if __name__ == '__main__':
    main()
