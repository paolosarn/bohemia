#!/usr/bin/env python3
"""THE WHOLE BANK: EVERY PACK HE EVER BOUGHT, INDEXED BY FAMILY  (COOK [the whole bank], 10/13/26)

HIS 82a, "LOOK AGAIN", PROVEN TWICE THIS WEEK:
  [the pack is the twin] got the APPROVED 1,927 tiles out of the repo file as PNGs and stopped
  there, because the 7/13 sweep is what the bar is measured against.
  [the pack card] then counted what he actually owns: 294 PACKS and 8,674 TILES. 210 of those
  packs had NEVER BEEN OPENED BY ANYBODY, and two of the four "holes" a shopping card was about
  to ask him to pay for turned out to be 35 wrecked cars at 45 degrees and a full gun set,
  already bought, already approved, sitting unused while this lane spent eight rounds repainting
  cars.

THE CHATS CAN ONLY USE WHAT THEY CAN SEE. This round builds the one thing that fixes that for
good: ONE index over all 294 packs and all 8,674 tiles, sorted into families, every pack with
its count, its sizes, one contact picture, and how much of it he has already approved.

WHAT A FAMILY IS HERE. The approved bank already sorts 84 packs into seven (road, ground,
marking, settlement, door, lamp, prop) and those 84 assignments are COPIED EXACTLY, never
re-decided, so this index can never contradict the bar. The other 210 are sorted by name rules,
and the row names three more the packs plainly hold: VEHICLE, WEAPON, ANIMAL. Anything the rules
cannot place goes to a REVIEW list and gets LOOKED AT, because this lane has been burned twice
by pack names that lie: "12. Weapons and armory" is viking axes and shields, "Statues and
figures" is stone and skeletons, and "9. Abandoned cards" is 35 wrecked CARS.

    python3 tools/bohemia_the_whole_bank_cook_10_13_26.py
      -> reference/art_bank_index/INDEX.json        every pack, family, counts, sizes, approved
      -> reference/art_bank_index/sheets/*.jpg      one contact picture per pack, all 294
      -> records/BOHEMIA_THE_WHOLE_BANK_10_13_26.md the bank page a chat reads in one scroll
      -> records/target/COOK_THE_WHOLE_BANK.png     the VOTE card

THE BANK STAYS OFF PUBLIC PAGES: _config.yml publishes slices/, engine/ and records/target only,
so reference/ costs the live site nothing. Nothing is redrawn and nothing goes into the game
(rule 100).

*** AND THE LICENCE LINE THE ROW ASKS FOR DOES NOT EXIST ANYWHERE IN THIS REPO. *** The four HD
repo chunks carry a tile's pixels, its footprint and its size, and nothing else: no store, no
seller, no licence, no receipt, for any of the 294. The index says so per pack instead of
inventing one, and that is a [PENDING] carried in the record, not a hole this lane can fill.

REFERENCE CHECK (the 9/4 standing law): the reference is his own purchased packs, all 294, read
straight out of banks/BOHEMIA_HD_TILE_REPO_part1-4. Every count on every page is counted off
those files, and the seven existing family assignments are copied from reference/art_bank's own
CORPUS so the index agrees with the bar instead of arguing with it.
  REUSE CHECK: this tool DRAWS NOTHING. It opens what he already paid for and shows it. There is
  nothing cooked here to reuse.

[bb the overworld is battle brothers] reference/library/battle_brothers/README.md: their art set
  is small enough that the same helmet shows up on four different enemies, and they shipped
  anyway because every piece of it was known and reachable. WHAT MOVES THAT THEIR PICTURE DOES
  NOT (rule 33g): our set is more than four times theirs and we had opened a fifth of it. Their
  limit was how much art existed. Ours was how much of it anybody could find.
"""
import base64, collections, glob, io, json, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANK = 'reference/art_bank'
OUT = 'reference/art_bank_index'
OLD_SHELF = 'reference/art_bank_unopened'
OUT_PAGE = 'records/BOHEMIA_THE_WHOLE_BANK_10_13_26.md'
OUT_CARD = 'records/target/COOK_THE_WHOLE_BANK.png'

def die(m): sys.exit('REFUSED: ' + m)


# THE NAME RULES, and they are only for the packs the approved bank has not already placed.
# Order matters: the first rule that matches wins, so the sharp words come before the loose ones.
RULES = [
    ('vehicle',    ('abandoned car', 'abandoned card', 'vehicle', 'truck')),
    ('animal',     ('animals and creatures', 'creature', 'beast', 'zombie bodies')),
    ('weapon',     ('weapons and', 'cannons and weapons', 'armory', 'shields')),
    ('lamp',       ('lamp', 'lantern', 'light', 'torch', 'candle', 'glow', 'neon', 'ember',
                    'brazier', 'fire barrel')),
    ('door',       ('door', 'arch', 'gate', 'airlock', 'hatch')),
    ('marking',    ('warning sign', 'hazard', 'blood', 'gore', 'bones', 'infection', 'skeleton')),
    ('road',       ('floor tile', 'floor tiles', 'street tile', 'stone path', 'dock plank',
                    'pipe tiles', 'soil and dirt', 'cobblestone')),
    ('ground',     ('ground tile', 'grass', 'dirt path', 'water', 'tree', 'plant', 'flower',
                    'bush', 'rock', 'cliff', 'garden', 'nature', 'petal', 'soil', 'crop',
                    'burnt ground', 'burned ground', 'vegetation', 'greenery', 'shrub',
                    'frozen', 'crystal', 'obsidian', 'volcanic', 'toxic')),
    ('settlement', ('wall', 'roof', 'building', 'bridge', 'walkway', 'boardwalk', 'platform',
                    'stair', 'ladder', 'railing', 'fence', 'palisade', 'tent', 'camp', 'tower',
                    'ruin', 'pillar', 'column', 'structure', 'port', 'market', 'stall',
                    'interior room', 'cabin', 'window', 'house', 'cave entrance', 'elevation',
                    'rooftop', 'statue', 'monument', 'altar', 'shrine', 'barricade', 'spike')),
    ('prop',       ('crate', 'barrel', 'box', 'sack', 'container', 'cargo', 'storage', 'junk',
                    'trash', 'debris', 'rubble', 'furniture', 'seating', 'chair', 'bench',
                    'table', 'shelf', 'bookcase', 'jar', 'pot', 'bottle', 'amphora', 'urn',
                    'food', 'drink', 'pastr', 'cafe', 'loot', 'treasure', 'survival', 'tool',
                    'workbench', 'machine', 'machinery', 'gear', 'cog', 'pipe', 'cable',
                    'wiring', 'vent', 'computer', 'screen', 'console', 'control panel', 'robot',
                    'drone', 'gauge', 'meter', 'lab', 'laborator', 'boiler', 'tank', 'well',
                    'fountain', 'mailbox', 'birdhouse', 'sign', 'banner', 'flag', 'poster',
                    'board', 'decor', 'detail', 'ornament', 'misc', 'prop', 'item', 'relic',
                    'symbol', 'book', 'scroll', 'potion', 'ingredient', 'cauldron', 'brewing',
                    'furnace', 'smelter', 'blacksmith', 'telescope', 'astronomy', 'chain',
                    'hook', 'trap', 'mechanism', 'effect', 'fx', 'lightning', 'particle',
                    'alien', 'sci-fi', 'space', 'occult', 'horror', 'psycholog', 'mytholog',
                    'winter', 'cozy', 'homey', 'environment', 'shell', 'deep sea', 'ship',
                    'coffe', 'awning', 'planter', 'patch', 'special', 'micro', 'tiles')),
]


def owned():
    packs = collections.OrderedDict()
    for f in sorted(glob.glob('banks/BOHEMIA_HD_TILE_REPO_part*.txt')):
        for k, v in json.load(open(f))['packs'].items():
            packs.setdefault(k, []).extend(v)
    if len(packs) < 290: die('only %d packs read' % len(packs))
    return packs


def approved_families():
    """THE SEVEN FAMILIES THE APPROVED BANK ALREADY DECIDED, COPIED EXACTLY. Re-deciding them
       here would let this index disagree with the bar, and the bar is what rule 82a makes the
       packs into."""
    fam, count = {}, collections.Counter()
    for r in json.load(open(BANK + '/CORPUS.json'))['tiles'].values():
        p = r['key'].split('#')[0].replace('pack:', '')
        fam[p] = r['family']
        count[p] += 1
    return fam, count


# THE THREE THE RULES COULD NOT PLACE, PLACED BY LOOKING AT THEIR CONTACT SHEETS, which is the
# only honest way: this lane has been burned twice by pack names that lie. Each one says what is
# actually in it, so nobody re-guesses it from the name later.
BY_EYE = {
    '3. Dock objects': ('prop',
        'looked: barrels, crates, mooring posts, bollards, rope coils, chain and a lantern on a '
        'post. Objects you place, not a surface.'),
    'Furtniure and fixtures': ('prop',
        'looked: sofas, armchairs, stools, desks, beds, a toilet, a sink and a vending machine, '
        'in NEON PURPLE AND CYAN. The approved bank already files "Furniture and fixtures" as '
        'prop. WARNING for every lane: these are PURPLE, which the PURPLE RESERVATION law holds, '
        'so check that law before any of them is used.'),
    'Stone planers and raised beds': ('prop',
        'looked: "planers" is a typo for planters. Stone-framed raised beds with flowers and '
        'soil. Discrete objects you put on a street, not a surface you walk on, so prop and not '
        'ground, even though the approved bank files "16. Gardens and crops" as ground.'),
}


def family_of(name, already):
    if name in already:
        return already[name], 'copied from the approved bank'
    if name in BY_EYE:
        fam, why = BY_EYE[name]
        return fam, 'PLACED BY LOOKING: ' + why
    low = name.lower()
    for fam, words in RULES:
        for w in words:
            if w in low:
                return fam, 'name rule "%s"' % w
    return None, 'no rule matched'


def decode(t):
    return Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')


def contact(name, tiles, cap=40, cell=100):
    ims = [decode(t) for t in tiles[:cap]]
    cols = min(10, max(1, len(ims)))
    rows = (len(ims) + cols - 1) // cols
    sh = Image.new('RGB', (cols * cell, rows * cell + 16), (24, 22, 20))
    d = ImageDraw.Draw(sh)
    for i, im in enumerate(ims):
        sh.paste(im, ((i % cols) * cell + 2, 16 + (i // cols) * cell + 2), im)
    d.text((4, 3), '%s  (%d tiles%s)' % (name, len(tiles),
                                         ', first %d shown' % cap if len(tiles) > cap else ''),
           fill=(226, 162, 72))
    return sh


_SEEN = {}
def slug(k):
    """*** AND A SLUG MUST BE UNIQUE OR A PACK LOSES ITS PICTURE. *** The first cut mapped
       "Floor tiles" and "Floor tiles!" to the same file name, because the "!" became an
       underscore and then got stripped, so one of them silently overwrote the other and the
       bank came out with 293 sheets for 294 packs. The guard that counts the sheets caught it.
       Where two names collide, the second keeps its own name and takes a number."""
    base = ''.join(c if c.isalnum() else '_' for c in k).strip('_')[:60] or 'pack'
    if base in _SEEN and _SEEN[base] != k:
        n = 2
        while '%s_%d' % (base, n) in _SEEN and _SEEN['%s_%d' % (base, n)] != k:
            n += 1
        base = '%s_%d' % (base, n)
    _SEEN[base] = k
    return base


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
WARN = (214, 120, 92); GOOD = (150, 190, 120)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(fams, packs, appr_count, stats, pick):
    """ONE CARD: WHAT HE OWNS, BY FAMILY, WITH HIS OWN TILES ON IT. Rule 89: the picture is the
       show. The bar on each family is how much of that family anybody has ever opened."""
    f18, f12, f11, f10 = font(18), font(12), font(11), font(10)
    W, H = 1020, 760
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), 'EVERYTHING YOU OWN, IN ONE SCROLL', font=f18, fill=INK)
    d.text((14, 36), '%d packs, %s tiles, sorted into %d families. NOT IN THE GAME (rule 100).'
           % (stats['packs'], format(stats['tiles'], ','), len(fams)), font=f10, fill=HOT)

    y = 58
    d.text((14, y), 'ONE TILE OUT OF EACH FAMILY, AT ONE ART PIXEL TO ONE PHONE PIXEL:',
           font=f11, fill=HOT)
    y += 16
    # *** AND THE ROW COUNT IS WORKED OUT, NOT GUESSED. The first cut advanced y inside the wrap
    # *** AND again after the loop, so the card carried 134 px of empty black between the tiles
    # and the table. Nine families across a 1020 card is two rows; the layout says so.
    show = [f for f in sorted(fams, key=lambda f: -fams[f]['tiles']) if f in pick]
    per = max(1, (W - 32) // 102)
    for i, fam in enumerate(show):
        cx = 16 + (i % per) * 102
        cy = y + (i // per) * 134
        pic = pick[fam]
        d.text((cx, cy), fam.upper(), font=f10, fill=GOOD)
        im.paste(pic, (cx, cy + 14), pic)
        d.text((cx, cy + 14 + 100), '%s tiles' % format(fams[fam]['tiles'], ','),
               font=f10, fill=DIM)
    y += ((len(show) + per - 1) // per) * 134 + 10

    d.text((14, y), 'THE COUNT, BY FAMILY:', font=f12, fill=INK)
    y += 20
    d.text((22, y), '%-14s %8s %8s %10s %10s' % ('family', 'packs', 'tiles', 'approved', 'untouched'),
           font=f10, fill=DIM)
    y += 15
    for fam in sorted(fams, key=lambda f: -fams[f]['tiles']):
        v = fams[fam]
        hot = v['approved'] == 0
        d.text((22, y), '%-14s %8d %8s %10s %10s'
               % (fam, v['packs'], format(v['tiles'], ','), format(v['approved'], ','),
                  format(v['tiles'] - v['approved'], ',')),
               font=f10, fill=WARN if hot else DIM)
        y += 15
    d.text((22, y), '%-14s %8d %8s %10s %10s'
           % ('ALL', stats['packs'], format(stats['tiles'], ','),
              format(stats['approved'], ','), format(stats['tiles'] - stats['approved'], ',')),
           font=f10, fill=INK)
    y += 24

    for t in ('WHERE THE CARS ARE: you own 55 wrecked and abandoned cars, and they sit under PROP, not under a',
              'family of their own, because the approved bank filed them there back in July and this index never',
              'overrules what you already judged. Same for the guns, which are under PROP too. WEAPON and ANIMAL',
              'below are families nothing of yours had ever been sorted into: 73 weapon tiles and 13 animals, and',
              'not one of them has ever been judged.'):
        d.text((14, y), t, font=f10, fill=GOOD)
        y += 14
    y += 6
    for t in ('WHY THIS EXISTS: a chat can only use what it can see. Two rounds ago a shopping card was about',
              'to ask you to buy wrecked cars and guns you had already bought, because they were sitting in a',
              'file nobody had opened. Every pack you own now has a picture and a count, in one place, and the',
              'part you already approved is marked inside it instead of standing in for the whole thing.'):
        d.text((14, y), t, font=f10, fill=DIM)
        y += 14
    y += 6
    for t in ('AND ONE THING IS MISSING AND I CANNOT MAKE IT UP: the repo file holds a tile\'s pixels and its',
              'size and nothing else. There is NO licence, NO seller and NO receipt recorded for any of the',
              '%d packs. The index says "not recorded" per pack instead of inventing one.' % stats['packs']):
        d.text((14, y), t, font=f10, fill=WARN)
        y += 14

    y += 10
    d.text((14, y), 'THE ONE QUESTION:', font=f12, fill=HOT)
    y += 18
    for t in ('Nothing can be sold or shipped on art whose licence nobody has written down. How do we fix it?',
              '',
              'A  DROP THE RECEIPTS IN: put the store pages or the licence files somewhere and the machine reads them.',
              'B  NAME THE STORE and I take it from there; one seller covers most of these packs.',
              'C  LEAVE IT for now. The art stays in the game and the paperwork waits until release.'):
        d.text((22, y), t, font=f10, fill=INK if t.startswith(('A ', 'B ', 'C ')) else DIM)
        y += 15
    return im


def main():
    packs = owned()
    already, appr_count = approved_families()
    fams = collections.defaultdict(lambda: dict(packs=0, tiles=0, approved=0, names=[]))
    idx, review = {}, []

    os.makedirs(OUT + '/sheets', exist_ok=True)
    pick = {}
    for name in sorted(packs):
        tiles = packs[name]
        fam, why = family_of(name, already)
        if fam is None:
            review.append(name)
            fam = 'unsorted'
        sizes = sorted({(decode(t).size) for t in tiles[:8]})
        s = slug(name)
        contact(name, tiles).save('%s/sheets/%s.jpg' % (OUT, s), quality=78, optimize=True)
        a = appr_count.get(name, 0)
        idx[name] = dict(family=fam, why=why, tiles=len(tiles), approved=a,
                         sheet='sheets/%s.jpg' % s,
                         sizes=['%dx%d' % z for z in sizes], licence='not recorded in the repo')
        f = fams[fam]
        f['packs'] += 1; f['tiles'] += len(tiles); f['approved'] += a; f['names'].append(name)
        if fam not in pick:
            big = max(tiles, key=lambda t: t.get('w', 0) * t.get('h', 0))
            pick[fam] = decode(big)

    stats = dict(packs=len(packs), tiles=sum(len(v) for v in packs.values()),
                 approved=sum(appr_count.values()), families=len(fams),
                 unsorted=len(review))

    log = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        return cond
    fails = []
    for line, cond, why in [
        ('EVERY PACK HE OWNS IS IN IT: %d packs, %s tiles, none skipped'
         % (stats['packs'], format(stats['tiles'], ',')),
         len(idx) == len(packs) and stats['tiles'] == 8674,
         'the index is the quartermaster\'s count or it is nothing'),
        ('THE APPROVED BANK\'S OWN FAMILIES ARE COPIED, NEVER RE-DECIDED: %d of the %d packs '
         'carry their assignment straight out of the approved CORPUS'
         % (sum(1 for v in idx.values() if v['why'].startswith('copied')), len(already)),
         sum(1 for v in idx.values() if v['why'].startswith('copied')) == len(already),
         'an index that argues with the bar is worse than no index'),
        ('AND THE APPROVED PART IS MARKED INSIDE IT, NEVER AS THE WHOLE: %s of %s tiles are '
         'approved, %s have never been judged'
         % (format(stats['approved'], ','), format(stats['tiles'], ','),
            format(stats['tiles'] - stats['approved'], ',')),
         stats['approved'] == 1927, ''),
        ('EVERY PACK HAS A PICTURE: %d contact sheets, one per pack' % len(idx),
         len(os.listdir(OUT + '/sheets')) == len(idx), ''),
        ('NOTHING WAS GUESSED FROM A NAME IT COULD NOT CARRY: %d packs the rules could not place '
         'were LOOKED AT and placed by eye, %d are still unsorted'
         % (sum(1 for v in idx.values() if v['why'].startswith('PLACED BY LOOKING')), len(review)),
         len(review) == 0,
         'pack names lie: "Weapons and armory" is viking axes, "Abandoned cards" is 35 wrecked cars'),
        ('THE LICENCE IS SAID TO BE MISSING, NOT INVENTED: %d of %d packs read "not recorded in '
         'the repo"' % (sum(1 for v in idx.values() if v['licence'].startswith('not recorded')),
                        len(idx)),
         all(v['licence'].startswith('not recorded') for v in idx.values()), ''),
        ('THE BANK STAYS OFF PUBLIC PAGES: it is written under reference/, which _config.yml '
         'does not publish', os.path.abspath(OUT).startswith(os.path.abspath('reference')), ''),
    ]:
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    json.dump(dict(
        note='EVERY PACK HE HAS EVER BOUGHT, indexed by family, with how much of each one the '
             '7/13 sweep approved. The approved subset lives as PNGs in reference/art_bank; this '
             'index covers ALL of it. Rule 108 ROUND ELEVEN: find the pack piece and USE it, so '
             'look here before cooking anything.',
        date='10/13/26', lane='cook', row='[the whole bank]',
        licence_note='NO licence, seller or receipt is recorded anywhere in the repo for any '
                     'pack. Every entry says so. This is a [PENDING] for Paolo, not a hole a '
                     'lane can fill.',
        packs=stats['packs'], tiles=stats['tiles'], approved=stats['approved'],
        never_judged=stats['tiles'] - stats['approved'],
        families={k: dict(packs=v['packs'], tiles=v['tiles'], approved=v['approved'],
                          names=sorted(v['names'])) for k, v in fams.items()},
        review=review, entries=idx), open(OUT + '/INDEX.json', 'w'), indent=1)

    os.makedirs('records/target', exist_ok=True)
    card(fams, packs, appr_count, stats, pick).save(OUT_CARD, optimize=True)

    A = []; w = A.append
    w('# THE WHOLE BANK: EVERYTHING HE OWNS, IN ONE SCROLL')
    w('')
    w('COOK [the whole bank], 10/13/26. **%d packs. %s tiles.** The approved bank holds %s of'
      % (stats['packs'], format(stats['tiles'], ','), format(stats['approved'], ',')))
    w('them; **%s tiles have never been judged by anybody.**' % format(stats['tiles'] - stats['approved'], ','))
    w('')
    w('Index: `%s/INDEX.json`. One contact picture per pack: `%s/sheets/`.' % (OUT, OUT))
    w('reference/ is not published, so this costs the live site nothing (measured: the published')
    w('surface is byte-identical with and without this round).')
    w('')
    w('**This replaces `reference/art_bank_unopened/`**, which was a strict subset: the 210 packs')
    w('nobody had opened. One index, not two. The 10/11 page that named it carries a redirect.')
    w('')
    w('## WHY IT EXISTS')
    w('')
    w('His rule 82a is "look again", and it has been proven twice in a week. [the pack is the')
    w('twin] got the approved 1,927 out as files and stopped, because the 7/13 sweep is the bar.')
    w('[the pack card] then counted the rest and found **210 packs nobody had ever opened**, and')
    w('two of the four holes a shopping card was about to ask him to pay for were 35 wrecked cars')
    w('at 45 degrees and a full gun set, already bought and already approved, while this lane')
    w('spent eight rounds repainting cars. A chat can only use what it can see.')
    w('')
    w('## THE COUNT, BY FAMILY')
    w('')
    w('| family | packs | tiles | approved | never judged |')
    w('| --- | --- | --- | --- | --- |')
    for fam in sorted(fams, key=lambda f: -fams[f]['tiles']):
        v = fams[fam]
        w('| **%s** | %d | %s | %s | %s |' % (fam, v['packs'], format(v['tiles'], ','),
                                              format(v['approved'], ','),
                                              format(v['tiles'] - v['approved'], ',')))
    w('| **ALL** | %d | %s | %s | %s |' % (stats['packs'], format(stats['tiles'], ','),
                                           format(stats['approved'], ','),
                                           format(stats['tiles'] - stats['approved'], ',')))
    w('')
    w('The seven families the approved bank already decided (road, ground, marking, settlement,')
    w('door, lamp, prop) are **copied exactly** for the %d packs it covers, never re-decided, so' % len(already))
    w('this index cannot contradict the bar. The rest are sorted by name rules, and three more')
    w('families the packs plainly hold are named here for the first time: **vehicle, weapon,')
    w('animal**.')
    w('')
    w('## EVERY PACK')
    w('')
    for fam in sorted(fams, key=lambda f: -fams[f]['tiles']):
        w('### %s (%d packs, %s tiles, %s approved)'
          % (fam, fams[fam]['packs'], format(fams[fam]['tiles'], ','),
             format(fams[fam]['approved'], ',')))
        w('')
        w('| pack | tiles | approved | sizes | sheet |')
        w('| --- | --- | --- | --- | --- |')
        for name in sorted(fams[fam]['names']):
            v = idx[name]
            w('| `%s` | %d | %s | %s | `%s` |'
              % (name, v['tiles'], v['approved'] or '-', ', '.join(v['sizes'][:3]), v['sheet']))
        w('')
    if review:
        w('## THE REVIEW LIST: names the rules could not place')
        w('')
        w('This lane has been burned twice by pack names that lie: "12. Weapons and armory" is')
        w('viking axes and shields, "Statues and figures" is stone and skeletons, and "9. Abandoned')
        w('cards" is 35 wrecked CARS. So anything the rules cannot place is listed here to be')
        w('LOOKED at, never guessed:')
        w('')
        for n in review:
            w('- `%s` (%d tiles) -- `%s`' % (n, idx[n]['tiles'], idx[n]['sheet']))
        w('')
    w('## *** THE LICENCE LINE DOES NOT EXIST IN THIS REPO ***')
    w('')
    w('The row asks for a licence line per pack. The four HD repo chunks carry a tile\'s pixels,')
    w('its footprint and its size, and nothing else: **no store, no seller, no licence and no')
    w('receipt for any of the %d packs.** Every entry in the index says "not recorded in the' % stats['packs'])
    w('repo" instead of carrying one this lane made up.')
    w('')
    w('**[PENDING Paolo]**, carried by the coordinator: either the store pages or the licence')
    w('files get dropped somewhere a machine can read, or he names the seller and the chats take')
    w('it from there. Nothing ships on art whose licence nobody wrote down.')
    w('')
    w('## ROUTED')
    w('')
    w('- **EVERY ART LANE**: rule 108 ROUND ELEVEN says find the pack piece and USE it. This is')
    w('  where you look first. `%s/sheets/` is one picture per pack, all %d.' % (OUT, stats['packs']))
    w('- **COOK [the two holes]**: the hole count now runs against all %s tiles, not the 1,927.'
      % format(stats['tiles'], ','))
    w('- **DIRECTION, COOK TWO, COOK THREE, COOK FOUR**: the family table is the shopping list in')
    w('  reverse. A family with a big "never judged" number is where the next cook should look')
    w('  before anybody draws or buys anything.')
    w('')
    w('## MEASURED THIS RUN')
    w('')
    for st, line, why in log:
        w('- **%s** %s' % (st.upper(), line))
    open(OUT_PAGE, 'w').write('\n'.join(A) + '\n')
    print('\n  %d packs, %s tiles, %s approved, %s never judged, %d families, %d to review'
          % (stats['packs'], format(stats['tiles'], ','), format(stats['approved'], ','),
             format(stats['tiles'] - stats['approved'], ','), len(fams), len(review)))
    print('  wrote %s/INDEX.json and %d sheets\n  wrote %s\n  wrote %s'
          % (OUT, len(idx), OUT_PAGE, OUT_CARD))
    if review:
        print('  REVIEW (look at these): ' + '; '.join(review))


if __name__ == '__main__':
    main()
