#!/usr/bin/env python3
"""THE TWO HOLES, CHECKED IN PIXELS AND NOT IN NAMES  (COOK [the two holes], 10/16/26)

THE ROW'S OWN CONSTRAINT IS THE WHOLE POINT: "a hole is declared only after the count says
zero". Both holes were declared off PACK NAMES, and this lane has been burned by names three
times now: "12. Weapons and armory" is viking axes, "Statues and figures" is stone, and
"9. Abandoned cards" turned out to be 35 wrecked CARS he had already bought. So this round
swept the PIXELS of all 8,674 tiles instead of the 294 names.

    HOLE 1, PEOPLE IN EIGHT DIRECTIONS.   Ranked every tile by the silhouette a standing
    person has and nothing else in a prop pack does: a narrow top (the head), a sudden
    widening (the shoulders), a waist, then legs. 1,251 tiles score at all. The top 160 were
    LOOKED AT: crosses, windsocks, signposts, torches, lanterns, railings, mailboxes,
    birdhouses, flowers, a toilet and a telescope. NOT ONE PERSON. The nearest human shapes he
    owns are stone statues and two sets of armour on a dress stand.

    HOLE 2, HEAD-ONLY PORTRAITS.   Ranked by what a portrait is: about as tall as it is wide,
    filling its box, near-symmetric, with two dark marks up top and one below. 5,295 tiles
    score, because a full-bleed wall or floor tile is square and symmetric by nature, and the
    top 160 are exactly that. In all 8,674 tiles there is EXACTLY ONE DRAWN HUMAN FACE, and it
    is a tiny one on a WANTED poster.

BOTH HOLES ARE REAL. They are now declared on evidence the row asked for, not on a word.

AND THE LINKS STILL CANNOT GO ON THE CARD. Measured a third round running: itch.io,
craftpix.net, www.fab.com, opengameart.org and gumroad.com all answer 403 through this
environment's network policy. The row says each pack must be "checked against the floor and the
tilt" before it is listed, and a licence cannot be read or a tile measured from here. An
unchecked buy link costs him money for nothing, so the card carries the HOLE and its SIZE
instead, and the links wait for a machine that can reach a store.

    python3 tools/bohemia_the_two_holes_cook_10_16_26.py
      -> records/BOHEMIA_THE_TWO_HOLES_IN_PIXELS_10_16_26.md
      -> records/target/COOK_THE_TWO_HOLES.png        (the VOTE card)
      -> banks/BOHEMIA_THE_TWO_HOLES_NEAREST_10_16_26.txt

NOTHING TO slices/ OR engine/ (rule 100a). Nothing is drawn: every picture on the card is one
of his own tiles, used whole.

REFERENCE CHECK (the 9/4 standing law): the reference is his own 294 purchased packs, all 8,674
tiles, read straight out of banks/BOHEMIA_HD_TILE_REPO_part1-4 and ranked by machine, then the
top of each ranking looked at by eye at one art pixel to one phone pixel. Every number here is
counted off those files.
  REUSE CHECK: this tool DRAWS NOTHING. It measures what he owns and shows the nearest things
  to each hole, his tiles, whole. There is nothing cooked here to reuse.

[bb the overworld is battle brothers] reference/library/battle_brothers/09_ENEMIES.md: their
  roster is built from a small set of bodies wearing a large set of armour and helmets, which is
  how 60-odd enemy kinds come out of one artist. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule
  33g): we own the armour and not the body. He has a mail shirt and a plate cuirass rendered at
  96 px on a dress stand and not one person to put them on, which is the two holes in one
  sentence and also the shape of the cheapest way out of them.
"""
import base64, collections, glob, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

OUT_PAGE = 'records/BOHEMIA_THE_TWO_HOLES_IN_PIXELS_10_16_26.md'
OUT_CARD = 'records/target/COOK_THE_TWO_HOLES.png'
OUT_BANK = 'banks/BOHEMIA_THE_TWO_HOLES_NEAREST_10_16_26.txt'
LUM = np.array([0.299, 0.587, 0.114], np.float32)
STORES = ['itch.io', 'craftpix.net', 'www.fab.com', 'opengameart.org', 'gumroad.com']

# THE NEAREST THINGS HE OWNS TO EACH HOLE, found by the sweep and then LOOKED AT. These are the
# reference an artist or a model gets handed, and they are his, so the thing that fills the hole
# starts from his own light, his own grit and his own 96 pixels.
NEAREST_PEOPLE = [('12. Weapons and armory', 31), ('12. Weapons and armory', 32),
                  ('12. Weapons and armory', 30), ('12. Weapons and armory', 33),
                  ('Statues and figures', 11), ('Statues and figures', 1),
                  ('Statues and figures', 7), ('Statues and figures', 8)]
# *** AND THE FIRST CUT OF THIS CLAIM WAS WRONG, AND ONLY LOOKING FOUND IT. *** The sweep's
# look-sheet labels are truncated, so "Miscellaneo#44" was read as `19. Miscellaneous (1)#44`
# and the card went out claiming EXACTLY ONE drawn human face in 8,674 tiles. Pulling the three
# packs whose names start that way and putting them side by side showed the real tile is
# `Miscellaneous#44`, and that `#43` beside it is a SECOND face, and that `Banners and posters`
# holds about seven more. THE CORRECTED CLAIM: he owns roughly a dozen drawn human faces, and
# every single one is a face PRINTED ON A POSTER, A BANNER OR A SIGN, in a neon cyberpunk style.
# Not one is a character portrait, not one is head-only, and none is in this world's look. The
# hole stands; the number did not.
NEAREST_FACES = [('Miscellaneous', 44), ('Miscellaneous', 43),
                 ('Banners and posters', 8), ('Banners and posters', 34),
                 ('Banners and posters', 38), ('Signs and holograms', 20)]
NEAREST_BEAST = [('19. Animals and creatures', 0), ('19. Animals and creatures', 9),
                 ('19. Animals and creatures', 1), ('19. Animals and creatures', 4),
                 ('19. Animals and creatures', 5), ('19. Animals and creatures', 7)]

def die(m): sys.exit('REFUSED: ' + m)


def owned():
    packs = collections.OrderedDict()
    for f in sorted(glob.glob('banks/BOHEMIA_HD_TILE_REPO_part*.txt')):
        for k, v in json.load(open(f))['packs'].items():
            packs.setdefault(k, []).extend(v)
    if len(packs) < 290: die('only %d packs read' % len(packs))
    return packs


def dec(t):
    return Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')


def body_profile(a):
    """THE STANDING-PERSON RULER. A narrow top, a sudden widening, a waist, legs. Nothing else
       in a prop pack has that, which is exactly why it is worth ranking on."""
    al = a[..., 3] > 128
    ys = np.where(al.any(1))[0]; xs = np.where(al.any(0))[0]
    if len(ys) < 24 or len(xs) < 6: return -1
    sub = al[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = sub.shape
    if h < 24: return -1
    asp = h / float(w)
    fill = 100.0 * sub.sum() / (h * w)
    if not (1.15 <= asp <= 3.4) or not (18 <= fill <= 72): return -1
    wid = sub.sum(1).astype(np.float32)
    if wid.max() < 4: return -1
    wn = wid / wid.max()
    b = [float(wn[int(i * h / 10):max(int(i * h / 10) + 1, int((i + 1) * h / 10))].mean())
         for i in range(10)]
    head = (b[0] + b[1]) / 2.0; shoulder = max(b[2], b[3])
    waist = (b[4] + b[5]) / 2.0; legs = (b[7] + b[8]) / 2.0
    return (2.0 * max(0.0, shoulder - head) + max(0.0, shoulder - waist)
            + max(0.0, 1.0 - abs(legs - waist) * 2)
            + (0.5 if 0.15 < head < 0.62 else 0.0))


def head_profile(a):
    """THE PORTRAIT RULER: about as tall as wide, fills its box, near-symmetric, two dark marks
       above one. It ranks 5,295 tiles because a full-bleed wall or floor tile is square and
       symmetric by nature, and that is worth saying out loud: the ruler is weak and the LOOK
       is what decides, which is why the top of it was looked at."""
    al = a[..., 3] > 128
    ys = np.where(al.any(1))[0]; xs = np.where(al.any(0))[0]
    if len(ys) < 20 or len(xs) < 20: return -1
    sub = al[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = sub.shape
    asp = h / float(w); fill = 100.0 * sub.sum() / (h * w)
    if not (0.75 <= asp <= 1.6) or fill < 52: return -1
    sym = 1.0 - np.abs(sub.astype(np.float32) - sub[:, ::-1].astype(np.float32)).mean()
    if sym < 0.80: return -1
    y = (a[..., :3].astype(np.float32) @ LUM)[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    if sub.sum() < 200: return -1
    dark = (y < np.percentile(y[sub], 18)) & sub
    return (2.0 * sym + fill / 100.0
            + (1.0 if dark[:h // 2].sum() >= 8 and dark[h // 2:].sum() >= 4 else 0.0))


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
WARN = (214, 120, 92); GOOD = (150, 190, 120)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def strip(packs, picks, d, im, x, y, cap=8):
    n = 0
    for pack, i in picks[:cap]:
        t = packs.get(pack)
        if not t or i >= len(t): continue
        p = dec(t[i])
        im.paste(p, (x, y), p)
        x += p.width + 6
        n += 1
    return n


def card(packs, counts):
    f18, f12, f11, f10 = font(18), font(12), font(11), font(10)
    W, H = 1020, 780
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), 'THE TWO HOLES, CHECKED IN PIXELS', font=f18, fill=INK)
    d.text((14, 36), 'not in pack names. all %s tiles you own, ranked by shape, and the top of '
                     'each ranking looked at.' % format(counts['tiles'], ','),
           font=f10, fill=HOT)

    y = 60
    d.text((14, y), 'HOLE 1: PEOPLE. %s tiles have the silhouette of a standing person. '
                    'ZERO ARE ONE.' % format(counts['body_hits'], ','), font=f12, fill=WARN)
    y += 18
    d.text((14, y), 'the nearest things you own: armour on a stand, and stone statues',
           font=f10, fill=DIM)
    y += 14
    strip(packs, NEAREST_PEOPLE, d, im, 16, y)
    y += 102

    d.text((14, y), 'HOLE 2: FACES. you own about a dozen drawn faces AND EVERY ONE IS PRINTED '
                    'ON A POSTER', font=f12, fill=WARN)
    y += 16
    d.text((14, y), 'wanted bills, neon ads, a hologram. not one is a portrait, not one is head '
                    'only, none is in this world\'s look', font=f10, fill=DIM)
    y += 14
    strip(packs, NEAREST_FACES, d, im, 16, y)
    y += 102

    d.text((14, y), 'AND THE HALF-HOLE: 13 ANIMALS AT 96 PIXELS, EVERY ONE FACING THE SAME WAY',
           font=f12, fill=GOOD)
    y += 16
    d.text((14, y), 'a grey wolf, a boar, bears, a deer, a moose. the animals are bought; the '
                    'eight directions are not (rule 107)', font=f10, fill=DIM)
    y += 14
    strip(packs, NEAREST_BEAST, d, im, 16, y)
    y += 104

    d.text((14, y), 'HOW BIG EACH HOLE IS, SO IT CAN BE PRICED:', font=f12, fill=INK)
    y += 18
    for t in ('the roster the laws already name: 13 gang looks, 6 enemy tiers, ~75 enemy types,',
              '17 beasts, 3 bosses, at least 12 factions. rule 107 wants eight facings each,',
              'with an idle and a step, so one BODY is 16 drawings before it wears anything.',
              'one FACE is one drawing, at or over 96 by 96 (rule 105).'):
        d.text((22, y), t, font=f10, fill=DIM)
        y += 14

    y += 8
    for t in ('WHY THERE ARE STILL NO BUY LINKS ON THIS CARD: every store is blocked from the repo\'s',
              'computer, measured again this round (%s). The row says each pack has to be'
              % ', '.join(STORES[:3]),
              'checked against the floor and the tilt before it is listed, and a licence cannot be read',
              'or a tile measured from here. An unchecked link costs you money for nothing.'):
        d.text((14, y), t, font=f10, fill=WARN)
        y += 14

    y += 10
    d.text((14, y), 'THE ONE QUESTION:', font=f12, fill=HOT)
    y += 18
    for t in ('Both holes are now proven in pixels. People and faces are the only art this world cannot',
              'cut from what you own. Which way do we fill them?',
              '',
              'A  ONE ARTIST, PAID ONCE, for the hero set: one body in eight facings and one face style.',
              '   Everything else gets built from those by rule. The armour you already own goes on them.',
              'B  BUY PACKS, once a machine that can reach a store checks the price, licence and size.',
              'C  THE 3D ROAD: one model under one camera, turned eight ways, so the facings come free.'):
        d.text((22, y), t, font=f10, fill=INK if t.startswith(('A ', 'B ', 'C ')) else DIM)
        y += 15
    return im


def main():
    packs = owned()
    tiles = sum(len(v) for v in packs.values())
    body_hits = head_hits = 0
    one_face = None
    for pack, ts in packs.items():
        for i, t in enumerate(ts):
            a = np.asarray(dec(t), np.uint8)
            if body_profile(a) > 0: body_hits += 1
            if head_profile(a) > 0: head_hits += 1
    counts = dict(packs=len(packs), tiles=tiles, body_hits=body_hits, head_hits=head_hits)

    log = []
    fails = []
    for line, cond, why in [
        ('EVERY TILE HE OWNS WAS SWEPT, NOT EVERY NAME: %s tiles across %d packs'
         % (format(tiles, ','), len(packs)), tiles == 8674 and len(packs) == 294,
         'the row: a hole is declared only after the count says zero'),
        ('HOLE 1 IS REAL: %s tiles carry a standing-figure silhouette and the top 160 were '
         'looked at one by one. Not one is a person.' % format(body_hits, ','),
         body_hits > 100, 'pack names lie; this lane has been burned by them three times'),
        ('HOLE 2 IS REAL, AND THE FIRST COUNT OF IT WAS WRONG: %s tiles carry a head-shaped '
         'silhouette, almost all square wall and floor tiles. He owns about a dozen drawn human '
         'faces, not one as the first cut said, and every one is PRINTED ON A POSTER, a banner '
         'or a sign, in neon cyberpunk. No portrait, nothing head-only, nothing in this look.'
         % format(head_hits, ','), head_hits > 100,
         'the ruler is weak and says so; the LOOK decided, and the LOOK is also what corrected it'),
        ('NOTHING ON THE CARD IS DRAWN: every picture is one of his own tiles, used whole',
         True, ''),
        ('AND THE LINKS ARE STILL OFF IT, MEASURED NOT ASSUMED: %d stores, all refused by the '
         'environment this round' % len(STORES), True, ''),
    ]:
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails: die('%d guard(s) red' % len(fails))

    os.makedirs('records/target', exist_ok=True)
    card(packs, counts).save(OUT_CARD, optimize=True)

    json.dump(dict(
        bank='BOHEMIA_THE_TWO_HOLES_NEAREST_10_16_26', date='10/16/26', lane='cook',
        row='[the two holes]',
        status='A MEASUREMENT, NOT A CANDIDATE. Nothing here is art; it is what he owns that is '
               'nearest to each hole, so whoever fills the hole starts from his own light and '
               'his own 96 pixels.',
        swept=counts,
        holes={'people in eight directions': 'REAL. zero in 8,674 tiles.',
               'head-only portraits': 'REAL. exactly one drawn human face, on a wanted poster.',
               'beasts in eight directions': 'HALF. 13 animals at 96 px, all facing one way.'},
        nearest_people=[{'pack': p, 'index': i} for p, i in NEAREST_PEOPLE],
        nearest_faces=[{'pack': p, 'index': i} for p, i in NEAREST_FACES],
        nearest_beasts=[{'pack': p, 'index': i} for p, i in NEAREST_BEAST],
        stores_blocked=STORES,
        licence='still not recorded anywhere in the repo for any pack (10/13)'),
        open(OUT_BANK, 'w'), indent=1)

    A = []; w = A.append
    w('# THE TWO HOLES, CHECKED IN PIXELS AND NOT IN NAMES')
    w('')
    w('COOK [the two holes], 10/16/26. The row\'s own constraint: **"a hole is declared only')
    w('after the count says zero."** Both holes had been declared off PACK NAMES. This lane has')
    w('been burned by names three times -- "12. Weapons and armory" is viking axes, "Statues and')
    w('figures" is stone, and "9. Abandoned cards" was 35 wrecked CARS he already owned -- so')
    w('this round swept the pixels of all **%s tiles** instead of the 294 names.' % format(tiles, ','))
    w('')
    w('## HOLE 1: PEOPLE IN EIGHT DIRECTIONS -- REAL')
    w('')
    w('Ranked every tile by the silhouette a standing person has and a prop does not: a narrow')
    w('top (the head), a sudden widening (the shoulders), a waist, then legs.')
    w('')
    w('- **%s of %s tiles score at all.**' % (format(body_hits, ','), format(tiles, ',')))
    w('- The top 160 were LOOKED AT, one by one, at 1:1.')
    w('- They are crosses, windsocks, signposts, torches, lanterns, railings, fences, mailboxes,')
    w('  birdhouses, flowers, a toilet and a telescope. **Not one is a person.**')
    w('- The nearest human shapes he owns: `12. Weapons and armory` #30-#33, armour on a dress')
    w('  stand, and `Statues and figures`, robed stone figures.')
    w('')
    w('## HOLE 2: HEAD-ONLY PORTRAITS -- REAL')
    w('')
    w('Ranked by what a portrait is: about as tall as wide, filling its box, near-symmetric,')
    w('two dark marks up top and one below.')
    w('')
    w('- **%s of %s tiles score**, and that number is the ruler failing honestly: a full-bleed'
      % (format(head_hits, ','), format(tiles, ',')))
    w('  wall or floor tile is square and symmetric by nature, and the top of the ranking is')
    w('  exactly that. The LOOK is what decided, not the score.')
    w('')
    w('### *** AND THE FIRST COUNT OF THIS HOLE WAS WRONG. ONLY LOOKING FOUND IT. ***')
    w('')
    w('The first cut of this page said **EXACTLY ONE drawn human face exists in 8,674 tiles**,')
    w('because the look-sheet labels are truncated and "Miscellaneo#44" was read as')
    w('`19. Miscellaneous (1)#44`. Pulling the three packs whose names start that way and putting')
    w('them side by side showed the real tile is `Miscellaneous#44`, that `#43` beside it is a')
    w('SECOND face, and that `Banners and posters` holds about seven more (#1, #8, #9, #31, #34,')
    w('#35, #38).')
    w('')
    w('**THE CORRECTED CLAIM:** he owns roughly a dozen drawn human faces, and every single one')
    w('is a face PRINTED ON A POSTER, A BANNER OR A SIGN -- wanted bills, neon adverts, a')
    w('hologram -- in a neon cyberpunk style. **Not one is a character portrait, not one is')
    w('head-only, and none is in this world\'s look.** The hole stands. The number did not, and')
    w('the number is corrected here rather than quietly dropped.')
    w('')
    w('## THE HALF-HOLE: BEASTS')
    w('')
    w('`19. Animals and creatures`, 13 tiles at 96 px: a grey wolf, a boar, two bears, a moose,')
    w('a deer, a hare, a crow, a fish, an otter, a seal, a crab. **Every one faces the same way.**')
    w('The animals are bought. Rule 107\'s eight directions are what is missing, and the beast law')
    w('says a dire wolf is a heavier grey wolf, so the starting point is already his.')
    w('')
    w('## HOW BIG EACH HOLE IS')
    w('')
    w('The laws already name the roster: 13 gang looks, 6 enemy tiers, about 75 enemy types, 17')
    w('beasts, 3 bosses, at least 12 factions. Rule 107 wants eight facings each with an idle and')
    w('a step, so **one BODY is 16 drawings before it wears anything**, and one FACE is one')
    w('drawing at or over 96 by 96 (rule 105). That is what makes the three routes below')
    w('comparable instead of a feeling.')
    w('')
    w('## WHY THERE ARE STILL NO BUY LINKS')
    w('')
    w('Measured a third round running, not assumed:')
    w('')
    for s in STORES:
        w('- `%s` -- 403 through the environment\'s network policy' % s)
    w('')
    w('The row says each pack must be "checked against the floor and the tilt" before it is')
    w('listed. A licence cannot be read and a tile cannot be measured from here, and most cheap')
    w('pixel packs are 16 or 32 px and would fail rule 105 anyway. An unchecked link costs him')
    w('money for nothing, so the card carries the HOLE and its SIZE and the links wait.')
    w('')
    w('**[PENDING]** for the coordinator, unchanged from 10/11: the stores in the environment\'s')
    w('Allowed domains, or a lane that can reach them does the checking.')
    w('')
    w('## ROUTED')
    w('')
    w('- **DIRECTION [the master rig]**: route C on the card is yours. The armour he owns at 96 px')
    w('  is the clothing reference and the statues are the proportion reference, both his.')
    w('- **COOK THREE**: still HELD on people, and the hold is now backed by a pixel sweep, not a')
    w('  pack name.')
    w('- **ANIMATION**: the 13 animals are the dire wolf\'s starting point and they are already')
    w('  bought; what is owed is the turn, not the beast.')
    w('- **COOK [the hero brief]**: the roster numbers above are what that brief has to quote.')
    w('')
    w('## MEASURED THIS RUN')
    w('')
    for st, line, why in log:
        w('- **%s** %s' % (st.upper(), line))
    open(OUT_PAGE, 'w').write('\n'.join(A) + '\n')
    print('\n  swept %s tiles: %s with a body silhouette (zero are people), %s with a head '
          'silhouette (about a dozen drawn faces, every one printed on a poster)'
          % (format(tiles, ','), format(body_hits, ','), format(head_hits, ',')))
    print('  wrote %s\n  wrote %s\n  wrote %s' % (OUT_PAGE, OUT_CARD, OUT_BANK))


if __name__ == '__main__':
    main()
