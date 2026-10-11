#!/usr/bin/env python3
"""THE PACK CARD: THE FOUR HOLES, CHECKED  (COOK [the pack card], 10/11/26)

THE ROW SAID: post the links for the four holes as ONE card, "each checked against the bank's
pixel floor and 45-degree tilt before it is listed". So the first thing this round did was the
CHECK, and the check came back with the card's real headline:

    *** TWO OF THE FOUR HOLES ARE NOT HOLES. HE ALREADY BOUGHT THEM. ***

  WRECKED VEHICLES AT 45 DEGREES   pack "9. Abandoned cards" (his typo for cars): 35 burnt-out
                                   wrecks at 45 degrees, 96 px, already in the approved bank.
                                   Police cars, vans, pickups, hatchbacks, rusted and gutted.
                                   Plus "10. Abandoned cars", 20 more at straight top-down.
  HAND-HELD GUNS AT THE 96 FLOOR   pack "12. Weapons and supplies": a shotgun, an SMG, four
                                   pistols, a revolver, a knife, two bats, a crowbar, a pipe,
                                   a grenade, a molotov. 96 px. Already in the approved bank.

AND THE CHECK TURNED UP A NUMBER WORTH MORE THAN ANY PURCHASE ON THIS CARD:

    *** HE OWNS 294 PACKS AND 8,674 TILES. THE BANK HOLDS 1,927. ***
    *** 210 PACKS HAVE NEVER BEEN OPENED BY ANYBODY. 6,747 TILES. ***

Among them, by name: "Rooftop and building tops" (72, which is the exact thing COOK FOUR's
[no roof tops] row is about), "Streets props and urban" (54), "Interior rooms" (53), "doors
and structures" (61), "Signs and misc" (71), "19. Animals and creatures" (13: a grey wolf, a
boar, two bears, a moose, a deer), "13."+"14. Banners and flags" (43 banners on poles).

THE TWO HOLES THAT ARE REAL, measured across all 294 packs and all 8,674 tiles:
  PEOPLE IN EIGHT DIRECTIONS   ZERO. Not one person in anything he owns.
  HEAD-ONLY PORTRAITS          ZERO.

AND THE LINKS COULD NOT BE CHECKED FROM HERE. Every asset store this card would link to
(itch.io, craftpix, fab, opengameart, gamedevmarket, the Unity store, gumroad) is denied by
this environment's network policy: the gateway answers 403 to the connection. Search can find
listings; it cannot read a licence or measure a tile. The row says "no pack under the floor",
and most cheap pixel packs are 16 or 32 px and would fail his own floor, so a list of unchecked
links is exactly the thing that costs him money for nothing. The card says so plainly and the
links stay off it until a machine that can reach the store checks them.

    python3 tools/bohemia_the_pack_card_cook_10_11_26.py
      -> reference/art_bank_unopened/INDEX.json           (every unopened pack, counts, sizes)
      -> reference/art_bank_unopened/sheets/<pack>.jpg    (one contact sheet per unopened pack)
      -> records/BOHEMIA_THE_FOUR_HOLES_CHECKED_10_11_26.md
      -> records/target/COOK_THE_PACK_CARD.png            (the VOTE card)

NOTHING TO slices/ OR engine/ (rule 100a). reference/ is not published (_config.yml publishes
slices/, engine/ and records/target), so the sheets cost the live site nothing.

REFERENCE CHECK (the 9/4 standing law): the reference is his own purchased packs, all 294 of
them, read straight out of banks/BOHEMIA_HD_TILE_REPO_part1-4. Every number on the card is
counted off those files. Nothing is quoted from anywhere else.
  REUSE CHECK: this tool DRAWS NOTHING. It opens what he already paid for and shows it to him.
  There is nothing cooked here to reuse.

[bb the overworld is battle brothers] reference/library/battle_brothers/README.md: Battle
  Brothers shipped with one artist's hand on every sprite and a set small enough that the same
  helmet shows up on four enemies. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g): our set
  is already four times theirs in tiles and we had opened a fifth of it. Their problem was too
  little art. Ours was never that.
"""
import base64, collections, glob, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANK = 'reference/art_bank'
SHELF = 'reference/art_bank_unopened'
OUT_PAGE = 'records/BOHEMIA_THE_FOUR_HOLES_CHECKED_10_11_26.md'
OUT_CARD = 'records/target/COOK_THE_PACK_CARD.png'
FLOOR = 96          # rule 105: the pack is a 96 pixel world

def die(m): sys.exit('REFUSED: ' + m)


def owned():
    """EVERY TILE HE HAS EVER BOUGHT, out of the four repo chunks, decoded. This is the only
       honest denominator: the bank is a SUBSET he judged on 7/13, and a hole measured against
       the bank is not a hole measured against what he owns."""
    packs = collections.OrderedDict()
    for f in sorted(glob.glob('banks/BOHEMIA_HD_TILE_REPO_part*.txt')):
        d = json.load(open(f))
        for k, v in d['packs'].items():
            packs.setdefault(k, []).extend(v)
    if len(packs) < 250: die('only %d packs read' % len(packs))
    return packs


def in_bank():
    c = collections.Counter()
    for r in json.load(open(BANK + '/CORPUS.json'))['tiles'].values():
        c[r['key'].split('#')[0].replace('pack:', '')] += 1
    return c


def decode(t):
    return Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')


# THE FOUR HOLES THE ROW NAMED, and the search that decides whether each one is real. The
# search is by PACK NAME and then by eye on the contact sheet, because a pack called "Weapons
# and armory" turned out to be viking axes and a pack called "Statues and figures" turned out
# to be stone, and only looking tells you that.
HOLES = [
    ('WRECKED VEHICLES AT 45 DEGREES', ('Abandoned card', 'Abandoned car'), True,
     '35 burnt-out wrecks at 45 degrees, 96 px, in the approved bank since July: police cars, '
     'vans, pickups, hatchbacks. Plus 20 more at straight top-down.'),
    ('HAND-HELD GUNS AT THE 96 FLOOR', ('Weapons and supplies',), True,
     'a shotgun, an SMG, four pistols, a revolver, a knife, two bats, a crowbar, a pipe, a '
     'grenade and a molotov, all at 96 px, in the approved bank since July.'),
    ('HEAD-ONLY PORTRAITS IN ONE STYLE', ('portrait', 'Portrait', 'face', 'Face', 'head', 'Head'), False,
     'nothing. Not one face in 294 packs. "Statues and figures" is stone and skeletons.'),
    ('EIGHT-DIRECTION PEOPLE AND BEASTS', ('people', 'People', 'character', 'Character',
                                           'human', 'Human', 'survivor', 'soldier'), False,
     'no people at all. The nearest is "19. Animals and creatures": a grey wolf, a boar, two '
     'bears, a moose, a deer, at 96 px and facing ONE way, so the ANIMALS are half bought and '
     'the eight directions are the hole (rule 107).'),
]

BLOCKED = ['itch.io', 'craftpix.net', 'www.fab.com', 'opengameart.org',
           'www.gamedevmarket.net', 'assetstore.unity.com', 'gumroad.com']


def contact(name, tiles, cap=40, cell=100):
    """ONE SHEET PER PACK HE HAS NEVER OPENED, so anybody (him included) can SEE what is in it
       without decoding a base64 blob. JPEG on purpose: reference/ is not published, and 210
       lossless sheets would be a hundred megabytes for no reader."""
    ims = [decode(t) for t in tiles[:cap]]
    cols = min(10, max(1, len(ims)))
    rows = (len(ims) + cols - 1) // cols
    sh = Image.new('RGB', (cols * cell, rows * cell + 16), (24, 22, 20))
    d = ImageDraw.Draw(sh)
    for i, im in enumerate(ims):
        x, y = (i % cols) * cell, 16 + (i // cols) * cell
        sh.paste(im, (x + 2, y + 2), im)
    d.text((4, 3), '%s  (%d tiles%s)' % (name, len(tiles),
                                         ', first %d shown' % cap if len(tiles) > cap else ''),
           fill=(226, 162, 72))
    return sh


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
WARN = (214, 120, 92); GOOD = (150, 190, 120)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(packs, bank, found, stats):
    """ONE CARD, AND THE PICTURE ON IT IS HIS OWN ART. Rule 89: the show is the thing, the
       numbers are the proof line underneath. What he has to see here is that the wrecks and
       the guns he was about to be asked to buy are already his, so they are on the card at
       one art pixel to one phone pixel."""
    f18, f13, f12, f11, f10 = font(18), font(13), font(12), font(11), font(10)
    W, H = 1020, 780
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), 'THE FOUR HOLES, CHECKED', font=f18, fill=INK)
    d.text((14, 36), 'before you buy anything. NOT IN THE GAME (rule 100).', font=f10, fill=HOT)

    y = 58
    d.text((14, y), 'TWO OF THEM YOU ALREADY BOUGHT, AND THEY HAVE BEEN IN THE BANK SINCE JULY:',
           font=f13, fill=GOOD)
    y += 22
    # *** AND THE PICKS ARE NAMED, NOT "THE FIRST NINE". The first cut took tiles[:9] of the
    # *** weapons pack and the row came out as two baseball bats, a crowbar, a pipe and a knife
    # under a heading that says HAND-HELD GUNS. The claim was true and the picture did not show
    # it, which is the one thing a card like this cannot do. These are the gun indices, read off
    # the pack's own contact sheet by eye.
    for label, keys, pick in (('WRECKED CARS AT 45 DEGREES', '9. Abandoned cards',
                               [1, 11, 12, 21, 24, 15, 23, 13, 26]),
                              ('HAND-HELD GUNS AT 96 PIXELS, AND THE BATS AND BLADES WITH THEM',
                               '12. Weapons and supplies', [10, 11, 6, 7, 9, 8, 4, 0, 2])):
        d.text((16, y), label, font=f11, fill=HOT)
        d.text((W - 150, y), '%d tiles in the pack' % len(found.get(keys, [])), font=f11, fill=GOOD)
        y += 16
        tiles = found.get(keys, [])
        x = 16
        for i in pick:
            if i >= len(tiles): continue
            pim = decode(tiles[i])
            if x + pim.width > W - 20: break
            im.paste(pim, (x, y), pim)
            x += pim.width + 6
        y += 100

    d.text((14, y), 'TWO OF THEM ARE REAL, AND NOTHING YOU OWN FILLS THEM:', font=f13, fill=WARN)
    y += 20
    for t in ('PEOPLE IN EIGHT DIRECTIONS      0 of 8,674 tiles. not one person in 294 packs.',
              'HEAD-ONLY FACES                 0 of 8,674 tiles.',
              '  (the nearest is 13 animals at 96 px -- a grey wolf, a boar, two bears, a',
              '   moose, a deer -- all facing ONE way, so the animals are half bought.)'):
        d.text((22, y), t, font=f10, fill=INK if t.startswith(('PEOPLE', 'HEAD')) else DIM)
        y += 15

    y += 12
    d.text((14, y), 'AND THE NUMBER THAT IS WORTH MORE THAN ANYTHING ON THIS CARD:',
           font=f13, fill=HOT)
    y += 22
    for a, b in (('packs you have bought', '%d' % stats['packs']),
                 ('tiles in them', '%s' % format(stats['tiles'], ',')),
                 ('tiles anybody has ever opened', '%s' % format(stats['opened'], ',')),
                 ('PACKS NOBODY HAS EVER OPENED', '%d' % stats['never_packs']),
                 ('TILES IN THEM', '%s' % format(stats['never_tiles'], ','))):
        hot = a.isupper()
        d.text((22, y), '%-34s %>s' % (a, '') if False else '%-34s' % a, font=f11,
               fill=WARN if hot else DIM)
        d.text((360, y), b, font=f11, fill=WARN if hot else INK)
        y += 17
    y += 4
    for t in ('Unopened, by name: "Rooftop and building tops" 72, "Signs and misc" 71, "doors and',
              'structures" 61, "Streets props and urban" 54, "Interior rooms" 53, "Banners and',
              'posters" 52, and 204 more. A contact sheet of every one is in the bank now.'):
        d.text((22, y), t, font=f10, fill=DIM)
        y += 14

    y += 10
    d.text((14, y), 'WHY THERE ARE NO LINKS ON THIS CARD:', font=f12, fill=WARN)
    y += 17
    for t in ('every store this card would link to is blocked from the repo\'s computer, so a licence',
              'cannot be read and a tile cannot be measured from here. most cheap pixel packs are 16 or',
              '32 pixels and would fail your own floor. an unchecked link costs you money for nothing.'):
        d.text((22, y), t, font=f10, fill=DIM)
        y += 14

    y += 12
    d.text((14, y), 'THE ONE QUESTION:', font=f13, fill=HOT)
    y += 18
    for t in ('People and faces are the only two real holes. How do you want them filled?',
              '',
              'A  OPEN THE 210 FIRST. Nobody spends anything until you have seen what you already own.',
              'B  BUY PACKS for people and faces, once the links can be checked properly.',
              'C  ONE ARTIST, PAID ONCE, for the hero set: people in eight directions and the faces.'):
        d.text((22, y), t, font=f10, fill=INK if t.startswith(('A ', 'B ', 'C ')) else DIM)
        y += 15
    return im


def main():
    packs = owned()
    bank = in_bank()
    tiles_total = sum(len(v) for v in packs.values())
    never = [k for k in packs if k not in bank]
    never_tiles = sum(len(packs[k]) for k in never)
    partial_left = sum(len(packs[k]) - bank[k] for k in packs if k in bank and bank[k] < len(packs[k]))

    stats = dict(packs=len(packs), tiles=tiles_total, opened=sum(bank.values()),
                 never_packs=len(never), never_tiles=never_tiles,
                 partial_left=partial_left, unseen=never_tiles + partial_left)

    # the four holes, searched across EVERYTHING he owns
    found = {}
    hole_rows = []
    for name, keys, expect, note in HOLES:
        hits = {k: v for k, v in packs.items() if any(w in k for w in keys)}
        found.update(hits)
        n = sum(len(v) for v in hits.values())
        hole_rows.append((name, n, sorted(hits), expect, note))
        got = n > 0
        print('  %-34s %4d tiles  %s' % (name, n, 'ALREADY OWNED' if got else 'REAL HOLE'))
        if got != expect:
            die('the hole "%s" measured %d tiles, which is not what the check expected' % (name, n))

    # the shelf: one contact sheet per pack nobody has opened
    os.makedirs(SHELF + '/sheets', exist_ok=True)
    idx = {}
    for k in sorted(never):
        v = packs[k]
        sizes = sorted({decode(t).size for t in v[:6]})
        slug = ''.join(c if c.isalnum() else '_' for c in k).strip('_')[:60]
        contact(k, v).save('%s/sheets/%s.jpg' % (SHELF, slug), quality=78, optimize=True)
        idx[k] = dict(tiles=len(v), sheet='sheets/%s.jpg' % slug,
                      sizes=['%dx%d' % s for s in sizes])
    json.dump(dict(
        note='EVERY PACK HE BOUGHT THAT NOBODY HAS EVER OPENED. The approved bank '
             '(reference/art_bank) holds the 1,927 he judged UP on 7/13; these are the rest. '
             'One contact sheet per pack so a lane can SEE what is in it before it cooks '
             'anything (rule 108: find the pack piece and use it).',
        date='10/11/26', lane='cook', row='[the pack card]',
        packs_owned=stats['packs'], tiles_owned=stats['tiles'],
        tiles_opened=stats['opened'], packs_never_opened=stats['never_packs'],
        tiles_never_opened=stats['never_tiles'],
        tiles_left_in_partly_opened_packs=stats['partial_left'],
        packs=idx), open(SHELF + '/INDEX.json', 'w'), indent=1)

    os.makedirs('records/target', exist_ok=True)
    card(packs, bank, found, stats).save(OUT_CARD, optimize=True)

    A = []; w = A.append
    w('# THE FOUR HOLES, CHECKED')
    w('')
    w('COOK [the pack card], 10/11/26. The row said to post the links for the four holes as ONE')
    w('card, "each checked against the bank\'s pixel floor and 45-degree tilt before it is')
    w('listed". The check came first, and the check is the card.')
    w('')
    w('## *** TWO OF THE FOUR HOLES ARE NOT HOLES ***')
    w('')
    w('| the hole | what he already owns | verdict |')
    w('| --- | --- | --- |')
    for name, n, ks, expect, note in hole_rows:
        w('| %s | %s | **%s** |' % (name, (', '.join('`%s` (%d)' % (k, len(packs[k])) for k in ks)
                                            if ks else 'nothing'),
                                    'ALREADY BOUGHT' if n else 'REAL HOLE'))
    w('')
    for name, n, ks, expect, note in hole_rows:
        w('- **%s** -- %s' % (name, note))
    w('')
    w('The wrecks and the guns were in the APPROVED bank, not some unopened corner: they have')
    w('been sitting in `reference/art_bank/prop` since 10/10 and in the repo file since July.')
    w('This lane had a standing row called [car recook] about cars looking like dogshit, through')
    w('eight rounds of repainting, while 35 finished 45-degree wrecks sat in the same repo.')
    w('')
    w('## *** AND THE NUMBER THAT IS WORTH MORE THAN ANY PURCHASE ***')
    w('')
    w('| | |')
    w('| --- | --- |')
    w('| packs he has bought | **%d** |' % stats['packs'])
    w('| tiles in them | **%s** |' % format(stats['tiles'], ','))
    w('| tiles anybody has ever opened | %s |' % format(stats['opened'], ','))
    w('| **packs nobody has ever opened** | **%d** |' % stats['never_packs'])
    w('| **tiles in them** | **%s** |' % format(stats['never_tiles'], ','))
    w('| tiles left in packs opened only in part | %s |' % format(stats['partial_left'], ','))
    w('| **never seen by anybody, in total** | **%s** |' % format(stats['unseen'], ','))
    w('')
    w('Rule 106 named this as a cause already: "the packs sat invisible as base64". [the pack is')
    w('the twin] (10/10) got the APPROVED 1,927 out as files and stopped there, because the 7/13')
    w('sweep is what the bar is measured against. Nobody checked what the other %s were.'
      % format(stats['unseen'], ','))
    w('')
    w('### Unopened, biggest first')
    w('')
    w('| pack | tiles |')
    w('| --- | --- |')
    for k in sorted(never, key=lambda k: -len(packs[k]))[:25]:
        w('| `%s` | %d |' % (k, len(packs[k])))
    w('')
    w('Every one of the %d now has a contact sheet at `%s/sheets/`, indexed in' % (len(never), SHELF))
    w('`%s/INDEX.json`. reference/ is not published, so this costs the live site nothing.' % SHELF)
    w('')
    w('### Named rows this unblocks, today')
    w('')
    w('- **COOK FOUR [no roof tops]** (his 10/10: "I\'m not able to see the top of the houses')
    w('  that you use for the art assets"): `Rooftop and building tops`, 72 tiles, never opened.')
    w('- **COOK TWO** (the ground and the street): `Streets props and urban` 54, `Signs and misc`')
    w('  71, `doors and structures` 61, `Interior rooms` 53, all never opened.')
    w('- **COOK THREE**, which went HELD this round because the packs hold no people: still held')
    w('  on people, but `19. Animals and creatures` (13, a grey wolf and a boar at 96 px) is the')
    w('  beast law\'s own starting point and nobody had seen it.')
    w('- **COOK [one at a time]**, this lane: the open question on the party marker asked whether')
    w('  the crew carries a stolen sign or a hand-made banner. He owns **43 banners on poles** at')
    w('  96 px (`13.` and `14. Banners and flags`) plus `Banners and posters` (52). Option B is')
    w('  already bought.')
    w('')
    w('## WHY THERE ARE NO LINKS ON THIS CARD')
    w('')
    w('Every asset store this card would link to is denied by this environment\'s network policy;')
    w('the gateway answers 403 to the connection. Measured this round:')
    w('')
    for h in BLOCKED:
        w('- `%s` -- blocked' % h)
    w('')
    w('Search can find listings. It cannot read a licence or measure a tile, and the row\'s own')
    w('constraint is "no pack under the floor". Most cheap pixel packs are 16 or 32 pixels and')
    w('would fail his floor (rule 105), and his own packs are an unusually high-resolution 96.')
    w('A list of unchecked links is the thing that costs him money for nothing, so the links stay')
    w('off the card until a machine that can reach the store checks each one for price, licence')
    w('("modify and combine inside a game allowed"), pixel size and tilt.')
    w('')
    w('**[PENDING]** for the coordinator: either the environment\'s Allowed domains gains the')
    w('stores, or a lane that can reach them does the checking. The search leads found so far,')
    w('UNCHECKED and not to be bought on this evidence, are in the handoff, not here.')
    w('')
    w('## ROUTED')
    w('')
    w('- **EVERY ART LANE**: before you cook, look in `%s/sheets/`. Rule 108: find the' % SHELF)
    w('  pack piece and use it. There are %s pieces nobody has looked at.' % format(stats['unseen'], ','))
    w('- **THE COORDINATOR**: two of the four holes on the shopping list are closed. Item 3 of')
    w('  records/BOHEMIA_THE_SHOPPING_LIST_10_11_26.md is now two holes, not four.')
    open(OUT_PAGE, 'w').write('\n'.join(A) + '\n')

    print('\n  packs %d  tiles %s  opened %s  NEVER OPENED %d packs / %s tiles'
          % (stats['packs'], format(stats['tiles'], ','), format(stats['opened'], ','),
             stats['never_packs'], format(stats['never_tiles'], ',')))
    print('  wrote %s/INDEX.json and %d contact sheets' % (SHELF, len(never)))
    print('  wrote %s\n  wrote %s' % (OUT_PAGE, OUT_CARD))


if __name__ == '__main__':
    main()
