"""THE OUTSIDE WORLD HAS NO OBJECTS IN IT, AND HE ALREADY APPROVED 1,927 (8/5/26).

WHAT THIS FOUND, and it is the biggest reuse miss in the repo:

  banks/BOHEMIA_HD_TILE_REPO_part1..4  =  8,674 purchased HD tiles, 294 packs
  banks/BOHEMIA_ACT1_CONFIRMED_SET     =  Paolo's Great Sweep, 7/13, COMPLETE.
                                          "every act-1 asset individually judged
                                          in context ... THE act-1 art authority"
                                          2,604 judged -> 1,927 UP, 677 DOWN

  MEASURED, with a probe validated against a bank the gates already prove ships:
  ZERO of those 8,674 tiles has ever drawn a pixel in the game.

One lane crossed the Great Sweep with the masters and harvested the UP tiles that
belong INDOORS -- banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt, 465 tiles, and the run
puts them in rooms. That work was done right and it stopped at the front door.
NOBODY EVER HARVESTED THE ONES THAT BELONG OUTSIDE. So a house has clutter on its
floor and the street outside has a mailbox nowhere in the world, while he owns
mailboxes, street props, pipes and vents, crates, planters, trees and rocks that
he personally thumbed UP eighteen days ago.

That is why the world reads empty. Not texture. OBJECTS.

THIS NEEDS NO NEW VERDICT FROM HIM (NOTES ARE RULINGS, 7/19): he already said UP.
A DOWN tile cannot enter this file, exactly as the interior pool holds it.

THE BLOCKER EVERYONE ASSUMED WAS NEVER REAL. The masters are ~96px and the art
cell is 44px, and the no-resample law was read as "art must be cell-sized". It
does not say that. It says AN ART PIXEL IS A WHOLE NUMBER OF SCREEN PIXELS. A 96px
prop blitted at the run's own integer zoom step is perfectly legal -- it simply
spans about two cells, which is what an object the size of a market stall SHOULD
do. Nothing had to be re-cut. Nobody checked.

SIZE FLAGS ARE HIS TOO. The sweep carries too_big / too_small per tile ("BIG:
render smaller / SMALL: render bigger"). Those are rulings about scale and they
travel with the tile as a draw scale, so a thing he called too big comes in
smaller instead of being dropped or shipped wrong.

REUSE CHECK: cooks NO new pixels. It is a crossing of two files that already
exist -- his purchased masters and his own verdicts on them. banks/ opened in
code: BOHEMIA_HD_TILE_REPO_part1..4 (the images), BOHEMIA_ACT1_CONFIRMED_SET
(the verdicts), and BOHEMIA_INTERIOR_POOL (read to find out which UP tiles are
ALREADY spoken for indoors, so this does not duplicate them).

  python3 tools/bohemia_exterior_pool_cook.py
    -> banks/BOHEMIA_EXTERIOR_POOL_8_5_26.txt
"""
import base64
import io
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTERS = [os.path.join(ROOT, 'banks', 'BOHEMIA_HD_TILE_REPO_part%d.txt' % i) for i in (1, 2, 3, 4)]
VERDICTS = os.path.join(ROOT, 'banks', 'BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')
INTERIOR = os.path.join(ROOT, 'banks', 'BOHEMIA_INTERIOR_POOL_7_26_26.txt')
OUT = os.path.join(ROOT, 'banks', 'BOHEMIA_EXTERIOR_POOL_8_5_26.txt')

# WHAT BELONGS OUTSIDE, and nothing else. Every bucket is a thing you can point at
# on a real street in this valley. A pack that is not named here does not ship --
# an unlisted pack is a silence, never a maybe.
BUCKETS = {
    # HIS OWN PACK NAMES, not my guesses. The first cut of this file invented
    # regexes like "plants and greenery" and matched almost nothing, which would
    # have shipped an empty pool and called it a result. These are the packs the
    # Great Sweep actually judged, and the UP/DOWN split in them IS the design:
    #   trees and nature .......  0 UP / 23 DOWN   no living trees
    #   dead trees and plants .. 39 UP /  1 DOWN   dead ones, yes
    #   rocks and stones ....... 100 UP /  0 DOWN  the desert, unanimous
    #   market and outdoor props  0 UP / 23 DOWN   a whole pack he killed
    # He designed this world's outdoor vocabulary with his thumb on 7/13 and
    # nobody ever built it.
    'street':  r'^(street props|warning signs and road props|pipes and cables|'
               r'pipes and wiring|light sources and fire barrels)$',
    'wreck':   r'^(abandoned cars|abandoned cards|ruined building parts|'
               r'broken building walls|rubble and debris|scrap wall and panels)$',
    # SCENERY ONLY, and this line is the one that took a render-and-look to get
    # right. The first cut also took 'jars, bottles and items', 'survival props'
    # and 'loot and survival props' because they were UP 47/49/33 -- and put a
    # CAR-SIZED GLOWING POTION JAR and a two-metre backpack on a suburban lawn.
    # HIS VERDICT WAS NOT WRONG, MY READING OF IT WAS. The sweep says every asset
    # was "individually judged IN CONTEXT", and the context for a jar is a shelf
    # and for a backpack is a pickup. A verdict on an object is not a licence to
    # render it at any size. Those are LOOT, a different system, and they stay out
    # of the scenery pool until something picks things up.
    # SPLIT, after a render-and-look. Bags and debris belong on any surface in a
    # collapsed city. Crates and barrels are MARKET GOODS and read medieval on a
    # Las Vegas front lawn -- they are right in a lot or a swap meet and wrong
    # outside a bungalow, so they get their own bucket and the placement map keeps
    # them off residential ground. Same tiles, same verdicts, different WHERE.
    'trash':   r'^(trash and debris|trash and junk props)$',
    'crate':   r'^(crates, barrels and supplies|barrels, crates and objects)$',
    'dead':    r'^(dead trees and plants|dead trees and dry plants|'
               r'rocks and stones|rocks and stones \(1\)|wooden and nature props)$',
    'barrier': r'^(barricades and blockades|barricades and defenses|'
               r'fences and wire|chain link fences)$',
    'camp':    r'^(market stalls|port market|camp and tents)$',
}

# NEVER OUTSIDE, whatever their verdict: these are indoor objects and the interior
# pool already owns them. Duplicating them here would put a sofa on a sidewalk.
INDOOR_ONLY = re.compile(r'furniture|interior room|floor tile|wall tile|roof tile|'
                         r'cobblestone|marble|metal floor|wall and floor detail|'
                         r'special tile|tower floor|floor, walls', re.I)
# and the things he ruled OUT of the interior pool for story reasons stay out here
STORY_ONLY = re.compile(r'zombie|blood|gore|skeleton|bone|corpse|bodies', re.I)

# HIS SIZE RULINGS, as a draw scale. "BIG: render smaller / SMALL: render bigger".
FLAG_SCALE = {'too_big': 0.62, 'too_small': 1.45, None: 1.0}
PER_BUCKET_CAP = 18          # a phone carries this, and past ~18 nobody can tell them apart


def norm(p):
    return re.sub(r'^\d+\.\s*', '', str(p)).strip().lower()


def bucket_of(pack):
    n = norm(pack)
    if STORY_ONLY.search(n) or INDOOR_ONLY.search(n):
        return None
    for b, rx in BUCKETS.items():
        if re.match(rx, n):
            return b
    return None


def main():
    # ---- his verdicts, keyed the way the sweep recorded them
    vd = json.load(open(VERDICTS))
    verdict = {}
    for e in vd['verdicts']:
        verdict[(norm(e['pack']), e['idx'])] = (e.get('v'), e.get('flag'), e.get('comment'))
    print('  his Great Sweep: %d judged, %d UP, %d DOWN'
          % (vd['counts']['total'], vd['counts']['up'], vd['counts']['down']))

    # ---- what the interior pool already took, so nothing is shipped twice
    already = set()
    try:
        ip = json.load(open(INTERIOR))
        for b in ip.get('buckets', {}).values():
            for e in b:
                if e.get('b64'):
                    already.add(e['b64'][:96])
    except Exception:
        pass
    print('  already spoken for indoors: %d tiles' % len(already))

    # ---- the masters, crossed against both
    out = {b: [] for b in BUCKETS}
    seen_packs = {}
    considered = up = down = unjudged = dup = 0
    for path in MASTERS:
        d = json.load(open(path))
        for pack, items in d.get('packs', {}).items():
            if not isinstance(items, list):
                continue
            b = bucket_of(pack)
            if not b:
                continue
            for i, t in enumerate(items):
                b64 = t.get('b64') if isinstance(t, dict) else None
                if not b64:
                    continue
                considered += 1
                v, flag, comment = verdict.get((norm(pack), i), (None, None, None))
                if v is None:
                    unjudged += 1
                    continue          # UNJUDGED IS NOT UP. It stays out.
                if v != 'UP':
                    down += 1
                    continue
                if b64[:96] in already:
                    dup += 1
                    continue
                up += 1
                seen_packs[norm(pack)] = seen_packs.get(norm(pack), 0) + 1
                out[b].append({
                    'pack': norm(pack), 'idx': i,
                    's': FLAG_SCALE.get(flag, 1.0),
                    'flag': flag, 'comment': comment, 'b64': b64
                })

    print('  considered %d outdoor-pack tiles: %d UP, %d DOWN, %d never judged, %d already indoors'
          % (considered, up, down, unjudged, dup))

    # ---- cap per bucket, spreading across packs so one pack cannot own a bucket
    capped = {}
    for b, lst in out.items():
        by_pack = {}
        for e in lst:
            by_pack.setdefault(e['pack'], []).append(e)
        order, i = [], 0
        while len(order) < min(PER_BUCKET_CAP, len(lst)):
            added = False
            for p in sorted(by_pack):
                if i < len(by_pack[p]) and len(order) < PER_BUCKET_CAP:
                    order.append(by_pack[p][i]); added = True
            if not added:
                break
            i += 1
        capped[b] = order

    doc = {
        'version': 'BOHEMIA_EXTERIOR_POOL_v1',
        'law': ('UP-ONLY. Every tile here carries a Paolo UP verdict from the Great Sweep '
                '(banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt, "THE act-1 art authority"). '
                'A DOWN tile cannot be in this file and neither can an UNJUDGED one. '
                'Size flags are his rulings too and travel as a draw scale. '
                'Indoor packs are excluded on purpose -- the interior pool owns those, and a '
                'sofa does not belong on a sidewalk. Zombie/blood/bone packs are excluded '
                'for the same reason the interior pool excluded them: bodies are a story '
                'Paolo places, not decoration.'),
        'source': {'verdicts': 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt',
                   'masters': [os.path.relpath(m, ROOT) for m in MASTERS],
                   'deduped_against': 'banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt'},
        'counts': {b: len(v) for b, v in capped.items()},
        'eligible': {b: len(out[b]) for b in out},
        'buckets': capped,
    }
    with open(OUT, 'w') as f:
        json.dump(doc, f)
    print('  %s' % os.path.relpath(OUT, ROOT))
    for b in sorted(capped):
        print('    %-8s %3d shipped of %4d eligible UP' % (b, len(capped[b]), len(out[b])))
    tot = sum(len(v) for v in capped.values())
    print('  TOTAL %d tiles, %.1f KB' % (tot, os.path.getsize(OUT) / 1024.0))
    if not tot:
        print('  NOTHING SHIPPED -- that is a bug, not a result')
        return 1
    return 0


if __name__ == '__main__':
    sys.exit(main())
