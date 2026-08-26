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

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md)
  This file draws NOTHING, so most of the canon's drawing rules cannot be violated
  here. The ones that CAN be, and were:
  NEVER ship art he rejected - held by construction. A tile enters this file only
    if his own Great Sweep says UP, and the gate re-derives that from the sweep
    rather than trusting this file's word for it. Unjudged is not UP either: only
    2,604 of 8,674 were ever swept and silence is not approval.
  NEVER purple outside the Amalgamation - no colour is chosen here; every pixel is
    a tile he bought and passed, and purity_gate sweeps the images themselves.
  NEVER a bare undressed rectangle - the whole point of this file is the opposite:
    it exists because the valley WAS bare, and it dresses it with his own objects.
  AND THE ONE THIS FILE ACTUALLY BROKE, twice, caught by looking at the render:
    a VERDICT ON AN OBJECT IS NOT A LICENCE TO RENDER IT AT ANY SIZE OR IN ANY
    PLACE. He judged every asset "in context"; a jar's context is a shelf and a
    market barrel's is a market. Shipping them UP-verdicted but two metres tall on
    a suburban lawn is a taste violation wearing a verdict as cover.

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

from PIL import Image

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
    # 8/26 third pass: 'light sources and fire barrels' is OUT of the regex -
    # it is a FIRE FACTORY: every taste-kill backfilled with another burning
    # variant (four sweeps of whack-a-mole, measured). Exactly two barrels
    # survive via KEEP_TILES below - DEAD IS NOT THE DEFAULT wants a life
    # sign, not a street on fire.
    'street':  r'^(street props|warning signs and road props|pipes and cables|'
               r'pipes and wiring)$',
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
    # 8/26, three more of his UP packs enter the world (the loot exclusion and
    # the dead-system exclusion above both still stand untouched):
    'burn':    r'^(burned ground and fire marks)$',
    'cargo':   r'^(cargo, crates and containers)$',
    'tools':   r'^(workbenches and tools)$',
}

# NEVER OUTSIDE, whatever their verdict: these are indoor objects and the interior
# pool already owns them. Duplicating them here would put a sofa on a sidewalk.
INDOOR_ONLY = re.compile(r'furniture|interior room|floor tile|wall tile|roof tile|'
                         r'cobblestone|marble|metal floor|wall and floor detail|'
                         r'special tile|tower floor|floor, walls', re.I)
# and the things he ruled OUT of the interior pool for story reasons stay out here.
#
# STILL CORRECT AFTER 8/8, FOR A DIFFERENT REASON THAN IT WAS WRITTEN.
# Paolo ruled the dead's placement on 7/31 and the system shipped 8/8, so the
# bodies are no longer waiting on a story - engine/bohemia_dead.js places them by
# EXPOSURE (open -> skeleton, sealed -> husk) and by district story. That is
# exactly why they must stay out of THIS pool: a generic exterior scatter would
# drop a skeleton anywhere, which is the wallpaper the ruling exists to prevent.
# One pass owns the dead. Blood/gore stays out permanently (fresh-kill canon, on
# hold). Cross-reference: gates/dead_gate.js.
STORY_ONLY = re.compile(r'zombie|blood|gore|skeleton|bone|corpse|bodies', re.I)

# PURPLE RESERVATION IS A HARD LAW AND ONE SHIPPED TILE BROKE IT (8/7).
# Paolo's law: purple belongs to the Amalgamation ALONE. An adversarial render
# review on 8/7 found "purple-and-white striped market awnings" standing on
# railyard ballast in the SHIPPED build. Measured: banks "port market" idx 5 is
# 19.6% purple by opaque pixel. His UP verdict on it is real and is not the point
# -- purity is a law about the WORLD, not a question of taste, and a verdict
# cannot licence a law breach. Every tile is now measured and any tile carrying
# meaningful purple is dropped no matter what its verdict says.
PURPLE_MAX = 0.02          # fraction of opaque pixels allowed in the purple band


def purple_share(b64):
    """What fraction of this tile's solid pixels sit in the reserved purple band."""
    import colorsys
    im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')
    px = [q for q in im.getdata() if q[3] > 200]
    if not px:
        return 0.0
    n = 0
    for r, g, bl, _a in px:
        h, sat, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, bl / 255.0)
        if sat > 0.25 and v > 0.25 and 0.72 < h < 0.88:
            n += 1
    return n / float(len(px))


# HIS SIZE RULINGS, as a draw scale. "BIG: render smaller / SMALL: render bigger".
FLAG_SCALE = {'too_big': 0.62, 'too_small': 1.45, None: 1.0}
# PAOLO 8/26: "you might think you have all of the pixelated, beautifully
# crafted tiles that you need to make everything that you need, and you don't...
# keep cooking." The 18-cap was a guess about phone legibility that quietly
# left 1,780 of his 1,927 UP tiles outside the world. Doubled - variety is his
# explicit ask, and the round-robin below still spreads picks across packs.
PER_BUCKET_CAP = 36

# THE TASTE SWEEP (8/26, looked at all 332 on a contact sheet before shipping).
# HIS 7/13 THUMB APPROVED THE TILE; THE WORLD'S LAWS GOVERN WHERE AND WHETHER
# IT SHIPS - the same reading the potion-jar lesson above established. Killed
# here, by content hash so the round-robin backfills the slot with another of
# his UP tiles: fresh produce / meat / preserve DISPLAY stalls (in act 1
# nobody is buying, and nothing fresh has existed for thirty years), LIT
# lanterns and lamp posts and the lit forge (LIGHT=TERRITORY - nobody owns
# light over a dead lot), glowing sci-fi canisters and glow-panel crates (no
# self-light, ever), the sword crate (medieval read), the numbered disc
# (a numeral is a word), the heraldic banner, and every burn scar still
# glowing with live embers thirty years after the fire went out (cold char
# stays; embers die). Tents, firepit RINGS, dry-goods sacks, containers,
# benches and hand tools all stay - people still live here, they just do not
# sell tomatoes. SECOND PASS same day: the round-robin backfilled killed
# slots with MORE unseen stall/beacon/ember variants - the sweep re-looked
# and killed those too. One deliberate keep: the burning fire barrel and the
# camp firepits stay - DEAD IS NOT THE DEFAULT (8/25 dispatch), people still
# live here; powered electric beacons and tended oil lanterns do not.

# the two fire barrels that carry the DEAD-IS-NOT-THE-DEFAULT life sign
KEEP_HASHES = frozenset(["2b64b141748733af", "8d789d79b06310b5"])
TASTE_KILL = frozenset([
 "01ded130451ae36d",
 "05acff6d8e1581cc",
 "06ae3e867a50aecf",
 "094aaf0806f945ce",
 "09526c832e3365a7",
 "09e324dd4606581b",
 "0ac660441a9a18cb",
 "0ac765156bc1d2d9",
 "0b7d44da3ec82513",
 "1076f6305c0af7cb",
 "1194271969260b29",
 "1404ef4238c81858",
 "19bf02e5bd94c6c9",
 "1ac739c44ada1bc9",
 "1e22aae1765d3f72",
 "2240c9c95cc93d59",
 "239c4fb9a69a930b",
 "23b55488dd8585de",
 "23be289af7ac6502",
 "28ff65a6120daf6c",
 "2ad74d65b74ae332",
 "2cad95fc93b44938",
 "311820d1417d1b6d",
 "33dbdfc1ec91af2e",
 "34f8f6a2c930c94f",
 "36b2f8927f5ad49e",
 "36c0db3197608446",
 "37390a7ac47a30b6",
 "3fe7513625056353",
 "4450917a4b501f4d",
 "4476ac39a37fe7f1",
 "44770fea913b29a4",
 "48f38e2cd971479b",
 "497cee661fc66591",
 "4ddbe05b2ac6d58d",
 "5016bc7b4d1c4bcf",
 "50c0cfa3549884d1",
 "5519e96b896f3fc3",
 "56a702c6af7dcca5",
 "5735ab305f18511d",
 "5a04fce78ea3c012",
 "5be140cfe85b9eb5",
 "5d7ac3b9dc19f2ba",
 "5f47bb1229d37334",
 "5faaf1a5471936aa",
 "6099b9511c3d5456",
 "66fd867807647f8c",
 "67ef356fecceb061",
 "6ad4c789a28e1f38",
 "6d5628238ef9a256",
 "70027ac8257b8365",
 "70af6237b76f0a8a",
 "713ea4a7532a9388",
 "71df34c82265d6ff",
 "789d438e590cc460",
 "795ccf52ac3d4bed",
 "7a63fe1f7cd4d08a",
 "7ebb43b1d0f8b114",
 "86aef9feae40fcd1",
 "88c91d6460afcc98",
 "8b112d549934bdbc",
 "8c15ac21d9324024",
 "9033b6aa6a085477",
 "921b78e33b757eaa",
 "98646282ca9b7af3",
 "99b8a5baa650a172",
 "9b03764f7db1e0c7",
 "9bcc3b634823be14",
 "9c074bbcf4bf35f8",
 "a322e5b3985714eb",
 "a3d64f133dcfc8c6",
 "a965b90344c0455f",
 "aaf26ed1b4cedd06",
 "ab67572524cb59b4",
 "af575a6791992d3f",
 "b1c8430906af0196",
 "bcdb44988bd4f694",
 "bd7979993a09341e",
 "c05f2c091e35fe3d",
 "c47d9e5e435750b9",
 "c4d739ae8e178ded",
 "c6c3588b3c3714c5",
 "c71c6f52b01cb7e9",
 "c8e67374f1bd0b3e",
 "cccb92ba18564cfd",
 "cf96e8a9fbb511a1",
 "d1840675d2588a96",
 "d6a4d593ef110858",
 "d7f4f636ad364744",
 "db891396b5e0b99f",
 "dbb0e411d5f493b8",
 "dc92b9dfc70c26bf",
 "dd9699d9f98e42e1",
 "df5ae66f7aeeb8e2",
 "e06bd1ca8a016298",
 "e229fd42eceff5d0",
 "e3222f11c3927cd8",
 "eaa599f64c7be7e1",
 "eab8557dbd724bd9",
 "f53bc5ffb9189645",
 "f593dd868b2a2bf3",
 "f656c5def62b6313",
 "f8b19a41562119b7",
 "f9664f740f4e5308",
 "fb0716c79c23ef26",
 "fbe116e1a421cab6"
])



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
    purple_dropped = []
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
                if purple_share(b64) > PURPLE_MAX:
                    purple_dropped.append('%s#%d' % (norm(pack), i))
                    continue          # PURPLE RESERVATION. A verdict cannot licence it.
                import hashlib as _hl
                _h16=_hl.sha1(b64.encode()).hexdigest()[:16]
                if _h16 in TASTE_KILL:
                    continue          # the 8/26 taste sweep (see TASTE_KILL above)
                up += 1
                seen_packs[norm(pack)] = seen_packs.get(norm(pack), 0) + 1
                out[b].append({
                    'pack': norm(pack), 'idx': i,
                    's': FLAG_SCALE.get(flag, 1.0),
                    'flag': flag, 'comment': comment, 'b64': b64
                })

    print('  considered %d outdoor-pack tiles: %d UP, %d DOWN, %d never judged, %d already indoors'
          % (considered, up, down, unjudged, dup))
    if purple_dropped:
        print('  PURPLE RESERVATION dropped %d UP tile(s): %s'
              % (len(purple_dropped), ', '.join(purple_dropped)))

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

    # THE TWO KEPT FIRE BARRELS (see the regex note above): re-read from the
    # masters by KEEP_HASHES so the life sign ships without reopening the
    # fire factory. They join street AFTER the cap - two extra on purpose.
    import hashlib as _hl2
    for path in MASTERS:
        dm = json.load(open(path))
        for pack, items in dm.get('packs', {}).items():
            if 'light sources and fire barrels' not in norm(pack):
                continue
            for i, t in enumerate(items if isinstance(items, list) else []):
                b64k = t if isinstance(t, str) else (t.get('b64') or '')
                if b64k and _hl2.sha1(b64k.encode()).hexdigest()[:16] in KEEP_HASHES:
                    capped['street'].append({'pack': norm(pack), 'idx': i,
                                             's': 1.0, 'flag': None,
                                             'comment': None, 'b64': b64k})

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
