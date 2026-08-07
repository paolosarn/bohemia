"""SEAMLESS GRAVEL EXISTS, IS APPROVED, AND HAS NEVER DRAWN (8/6/26).

YESTERDAY I PUT A DECISION ON HIS PLATE THAT WAS NOT HIS TO MAKE. I wrote "he
owns no seamless dirt -- buy or cook is his call" after opening ONE bank. That was
the same assume-instead-of-check error I had spent the whole day writing up, made
in the act of writing it up.

WHAT IS ACTUALLY IN banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt -- his own
seam pipeline, run library-wide, 1019 tiles. The ones with method='quilt' SHIP
REAL PIXELS: 44x44, exactly the art cell, 0.0% transparent, wrap error 7-10.
Crossed with his 7/13 verdicts:

    3. Stone paths ............ 10 quilt, 10 UP  <- SEAMLESS, APPROVED, NEVER DREW
    1. Cracked contrete tiles . 34 quilt, 33 UP  (already drawing)
    1. Cracked street tiles ... 20 quilt, 18 UP  (already drawing)
    2. Soil and dirt tiles ....  0 quilt         <- no seamless version exists
    1. Ground Tiles ...........  7 quilt,  0 UP  <- never judged

SO GRAVEL SHIPS AND SOIL STILL CANNOT. That is the honest split. The railyard's
ballast and the solar farm's gravel access road are 4,600 cells that have been
wearing the suburb's concrete and can stop today. The farm's field soil cannot,
because no seamless soil exists in the repo -- and the remaining ask is now SEVEN
TILES TO JUDGE ("1. Ground Tiles", quilt, never swept), not "buy a terrain set".

WHY THE FIRST ATTEMPT FAILED, and it is the same lesson one layer down: I sourced
the RAW HD MASTERS. Those are decorative patches -- ~96px, 10% transparent, meant
to sit ON ground -- so laid as terrain they tiled with a black gap between every
cell. banks/BOHEMIA_DESERT_POOLS_7_18_26 is the same trap: its "ground" pool is
9.5% transparent patches despite calling itself the Mojave floor. THE SEAM
PIPELINE'S QUILT OUTPUT IS THE ONLY THING IN THIS REPO THAT IS ACTUALLY GROUND.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md)
  NEVER ship art he rejected - UP-only, re-derived by the gate from his sweep.
  NEVER a bare undressed rectangle - this replaces the suburb's concrete on
    surfaces the world already names as gravel; it adds identity, never removes it.
  AND THE RULE ALL OF THIS WEEK'S FAILURES SHARE: a verdict is about the OBJECT,
    never about where or what-for. Gravel goes on ballast and access roads because
    the WORLD says those cells are gravel, not because a tile looked nice.

REUSE CHECK: cooks NO new pixels. Reads banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26
(his seam pipeline's own output) and banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26 (his
verdicts) and ships the intersection.

  python3 tools/bohemia_ground_pool_cook.py
    -> banks/BOHEMIA_GROUND_POOL_8_6_26.txt
"""
import base64, io, json, os, re, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEAMLESS = os.path.join(ROOT, 'banks', 'BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt')
VERDICTS = os.path.join(ROOT, 'banks', 'BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')
OUT = os.path.join(ROOT, 'banks', 'BOHEMIA_GROUND_POOL_8_6_26.txt')

# ONLY surfaces where the world already says "this is gravel" and the renderer is
# currently drawing the suburb's concrete instead. Nothing else. An unlisted pack
# is a silence, never a maybe.
BUCKETS = {'gravel': r'^3\. stone paths$'}
GOOD_TIERS = ('S', 'A', 'B')     # seam-readiness, his pipeline's own grading


def norm(p):
    return re.sub(r'^\d+\.\s*', '', str(p)).strip().lower()


def main():
    vd = json.load(open(VERDICTS))
    V = {}
    for e in vd['verdicts']:
        V[(norm(e['pack']), e['idx'])] = e.get('v')

    g = json.load(open(SEAMLESS))
    out = {b: [] for b in BUCKETS}
    seen = dropped = 0
    for t in g['tiles']:
        pack = t.get('pack', '')
        b = next((k for k, rx in BUCKETS.items() if re.match(rx, norm(pack) and pack.strip().lower())), None)
        if not b:
            continue
        seen += 1
        if t.get('method') != 'quilt' or not t.get('b64'):
            dropped += 1; continue          # a crop is a WINDOW, not pixels
        if t.get('tier') not in GOOD_TIERS:
            dropped += 1; continue
        if V.get((norm(pack), t.get('idx'))) != 'UP':
            dropped += 1; continue          # UNJUDGED IS NOT UP
        # AND IT MUST ACTUALLY BE GROUND: square, cell-sized, fully opaque.
        try:
            im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        except Exception:
            dropped += 1; continue
        w, h = im.size
        alpha = im.getchannel('A')
        if w != h or w != 44 or alpha.getextrema()[0] < 250:
            dropped += 1; continue          # a patch, not a floor
        out[b].append({'pack': pack, 'idx': t['idx'], 'tier': t.get('tier'), 'b64': t['b64']})

    doc = {
        'version': 'BOHEMIA_GROUND_POOL_v2',
        'law': ('UP-ONLY and SEAMLESS-ONLY. Every tile carries a Paolo UP verdict from the '
                '7/13 Great Sweep AND comes from his own seam pipeline\'s quilt output, which '
                'is the only thing in this repo that is actually GROUND: 44x44, square, fully '
                'opaque. The raw HD masters and the desert pools are DECORATIVE PATCHES '
                '(~96px, ~10% transparent) and laying them as terrain tiles them with a black '
                'gap between every cell -- that is exactly how the 8/6 first attempt failed.'),
        'source': {'seamless': 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt',
                   'verdicts': 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt'},
        'not_available': {'soil': 'no quilt tiles exist for "2. Soil and dirt tiles"; '
                                  '"1. Ground Tiles" has 7 quilt tiles but was NEVER JUDGED'},
        'counts': {b: len(v) for b, v in out.items()},
        'buckets': out,
    }
    json.dump(doc, open(OUT, 'w'))
    print('  considered %d, dropped %d' % (seen, dropped))
    for b, v in out.items():
        print('    %-8s %3d seamless UP tiles' % (b, len(v)))
    print('  %s  %.1f KB' % (os.path.relpath(OUT, ROOT), os.path.getsize(OUT) / 1024.0))
    return 0 if sum(len(v) for v in out.values()) else 1


if __name__ == '__main__':
    sys.exit(main())
