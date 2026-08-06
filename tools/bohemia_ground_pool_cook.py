"""EVERY DISTRICT DRAWS THE SUBURB'S DIRT, AND HE OWNS THE REAL GROUND (8/6/26).

THE FINDING, and it is the third instance of one bug this week:

  The world model KNOWS what every surface is. The dossier names are specific and
  correct -- "field soil", "crop rows", "ballast / gravel", "gravel access road",
  "station yard", "tank pad", "dead field turf", "concourse". Measured across the
  built valley, ALL OF THEM COLLAPSE TO ONE BUCKET:

    FARM       field soil 2116, crop rows 691   ->  yard x3480
    RAILYARD   ballast / gravel 1243            ->  yard x2013
    SOLAR      gravel access road 1836          ->  yard x2292
    DATAFORT   data hall 985                    ->  yard x1689

  boughtForTile() only ever answers road / walk / yard, so forty named surfaces
  are thrown away and every district gets the SUBURB'S dirt. That is why a farm
  has no field and a railyard has no track: they are the suburb wearing props.

  Ground is most of every frame, so this is the biggest of the three:
    8/3  buildings were flat starter tile until materials were mapped
    8/5  the valley had zero objects until the exterior pool was built
    8/6  the GROUND is one tile because nobody asked the world what it is

HE ALREADY APPROVED THE REAL GROUND, on 7/13, and none of it has ever drawn:
    soil and dirt tiles ....... 24 UP,  0 DOWN
    dirt path tiles ........... 46 UP,  2 DOWN
    stone paths ............... 24 UP,  0 DOWN
    cracked contrete tiles .... 42 UP,  3 DOWN

NO GRASS BUCKET, DELIBERATELY. "grass and ground tiles" is 47 UP and it is being
left out on purpose: this is a dead valley by his own ruling (living trees 0 UP /
23 DOWN), and I have already put one green thing in it today by reading a verdict
without reading the world. Dead field turf takes SOIL, not grass. If he wants
green he can say so.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md)
  NEVER ship art he rejected - held by construction and re-derived by the gate
    from his sweep, never trusted from this file.
  NEVER purple outside the Amalgamation - no colour is chosen here.
  AND THE ONE THIS CLASS OF FILE KEEPS BREAKING: a verdict on a tile is not a
    licence to put it anywhere. A green lawn tile is UP and still wrong in a dead
    valley, which is why there is no grass bucket.

REUSE CHECK: cooks NO new pixels. Crosses two files that already exist -- his
purchased masters (banks/BOHEMIA_HD_TILE_REPO_part1..4) and his own verdicts on
them (banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt).

  python3 tools/bohemia_ground_pool_cook.py
    -> banks/BOHEMIA_GROUND_POOL_8_6_26.txt
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
OUT = os.path.join(ROOT, 'banks', 'BOHEMIA_GROUND_POOL_8_6_26.txt')

# WHAT BELONGS OUTSIDE, and nothing else. Every bucket is a thing you can point at
# on a real street in this valley. A pack that is not named here does not ship --
# an unlisted pack is a silence, never a maybe.
BUCKETS = {
    'soil':     r'^(soil and dirt tiles)$',
    'dirt':     r'^(dirt path tiles)$',
    'gravel':   r'^(stone paths)$',
    'concrete': r'^(cracked contrete tiles)$',
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
PER_BUCKET_CAP = 12          # a phone carries this, and past ~18 nobody can tell them apart


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
        'version': 'BOHEMIA_GROUND_POOL_v1',
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
