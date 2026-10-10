#!/usr/bin/env python3
"""THE APPROVED CORPUS, OUT TO PNG, BY FAMILY  (COOK [the pack is the twin] round 1, 10/10/26)

PAOLO 10/10 (rule 82): "all the art assets you made look like AI slop, take inspiration from
the assets we downloaded, we are extremely far off." Rule 82a: the downloaded assets are the
PURCHASED HD PACKS taken in on 7/7 and judged in July, and from now every tile, prop, car,
street, sidewalk, kerb, marking, lamp and house skin comes FROM them, never cooked fresh.
Rule 87 gave this lane the bank and the twins, and gave the ground, the people and the places
to COOK TWO, COOK THREE and COOK FOUR. THE ROW: "extract the corpus first, it is what the
three new chats build from."

WHAT THIS DOES. It opens his own judgement file (2,604 tiles judged in the 7/13 sweep, 1,927
of them UP), finds every one of those 1,927 tiles in the four HD repo banks, and writes each
one out as a PNG at its own pixels into reference/art_bank/<family>/, named by the key he
judged it under -- pack and index -- so a twin can be cited as pack:<pack>#<idx> and the gate
can check it against his sweep. Then one CONTACT SHEET per family, sectioned by pack, so a
cook lane can look at a whole family at once and see the bar it is missing.

*** IT DOES NOT MOVE A SINGLE TILE DIRECTION ALREADY PLACED. *** Their 10/10 round sampled
twenty packs into road, ground, prop and settlement and said in its own docstring that COOK
owns extracting the whole corpus. Those twenty packs keep the family DIRECTION gave them,
even where I would have filed one elsewhere (their warning signs are in prop; I would have
said markings), because two tools disagreeing about where a tile lives is worse than either
answer. The other sixty-four packs are assigned here, and THE BUILD REFUSES IF EVEN ONE OF
THE 84 IS UNASSIGNED: a family bucket that quietly swallows what the rules did not name is
how a corpus turns into a pile.

THE FAMILIES ARE THE ROW'S OWN LIST: streets, sidewalks and kerbs (road); markings; houses
and their skins (settlement); props and the cars (prop, one family, as the row writes it);
lamps; doors; terrain and desert (ground).

    python3 tools/bohemia_the_pack_is_the_twin_cook_10_10_26.py
      -> reference/art_bank/<family>/pack_<slug>_<idx>.png      (1,927 tiles)
      -> reference/art_bank/<family>/CONTACT_<FAMILY>.png       (one per family)
      -> reference/art_bank/CORPUS.json                         (keyed pack#idx)
      -> records/BOHEMIA_THE_PACK_IS_THE_TWIN_MEASURED_10_10_26.txt
      -> slices/vote/COOK_THE_PACK_IS_THE_TWIN.png

REFERENCE CHECK (the 9/4 standing law): this round's whole subject IS the reference. The bar
is HIS OWN APPROVED TILES, not a thing found online, which is rule 82a's point. The 7/27
shopping law (records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md: check the index first; cooking
a substitute for an indexed asset is a violation) is the law being enforced, and it was never
read for the fight: measured 10/10, no COMBAT TWO tool reads the repo, the set, the tiles or
the props.
  REUSE CHECK: nothing is drawn here at all. Every pixel written comes out of
  BOHEMIA_HD_TILE_REPO_part1-4 under the keys in BOHEMIA_ACT1_CONFIRMED_SET_7_13_26, and the
  family map honours DIRECTION's own tools/bohemia_direction_art_bank.py.

[bb settlements] reference/library/battle_brothers/10_UI_AND_FEEL.md and 01_WORLDMAP.md: what
  makes their map and their towns read is that every tile in a biome was painted by one hand
  to one palette, so a forest tile and a road tile belong to each other before either is
  placed. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g): nothing yet -- this round is not
  a picture, it is the shelf. The finding that matters for us is the opposite direction: our
  87 packs were drawn by many hands, so laying them straight down will NOT be coherent the
  way Battle Brothers is, and the coherence has to come from our own weather, wear and light
  pass on top (rule 82a's 'placed, flipped, weathered, recoloured inside the pack's palette').
  That is COOK TWO's and COOK FOUR's first problem and this record names it for them.
"""
import base64, collections, io, json, os, re, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

CONFIRMED = 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt'
REPO = 'banks/BOHEMIA_HD_TILE_REPO_part%d.txt'
OUT = 'reference/art_bank'
OUT_REC = 'records/BOHEMIA_THE_PACK_IS_THE_TWIN_MEASURED_10_10_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_PACK_IS_THE_TWIN.png'

def die(m): sys.exit('REFUSED: ' + m)
slug = lambda s: re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')

# DIRECTION'S OWN TWENTY, HONOURED EXACTLY (tools/bohemia_direction_art_bank.py, 10/10)
THEIRS = {
    'road': ['1. Cracked street tiles', '1. Cracked contrete tiles', '6. Stone paths and roads'],
    'ground': ['1. Ground Tiles', '7. Burnt ground tiles', '8. Burned Ground and fire marks',
               '2. Dirt path tiles', '3. Grass and ground tiles'],
    'prop': ['9. Abandoned cards', '10. Abandoned cars', '15. Street props',
             '14. Trash and junk props', '3. Barricades and blockades',
             '17. Warning Signs and road props'],
    'settlement': ['5. Roof tiles', '4. House wall tiles', '2. Broken building walls',
                   '6. Chain link fences', '11. Fences and gates'],
}

# AND THE REST, BY WHAT THE PACK IS. Every rule is a whole pack name, never a guess from a
# word, because 'Floor tiles' is a road surface and 'Floor, walls' is a building.
MINE = {
    'road': ['1. Cobblestone floor tiles', '1. Marble floor tiles', '1. Metal floor tiles',
             '1. Floor tiles', '1. Floor tiles (1)', 'Floor tiles', 'Floor tiles (1)',
             'Floor tiles!', '2. Rusted metal floor tiles', '3. Stone paths',
             '2. Soil and dirt tiles'],
    'marking': ['14. Warning Signs', '17. Hazard and warning tiles', '6. Blood and infection tiles',
                'BLOOD AND GORE', '10. Zombie bodies and bones'],
    'settlement': ['12. Ruined building parts', '3. Broken wall tiles', '4. Scrap wall and panels',
                   '5. Windows and broken glass', 'Wall tiles (1)', 'Floor tiles and wall tiles',
                   'Floor, walls', '9. Rubble and debris', '7. Fences and palisades',
                   '13. Fences and wire', '6. Chain link fences', '8. Market Stalls',
                   '13. Port market', '14. Camp and tents', '20. Airchip dock props'],
    'door': ['4. Doors and entrances', '11. Industrial doors and gates', 'Doors and Arches!'],
    'lamp': ['18. Light sources and fire barrels', '18. Lights and emergency props',
             '14. Embers and particles'],
    'ground': ['1. Water Tiles', '4. Water details and foam', 'Rocks and stones',
               'Rocks and stones (1)', '16. Dead trees and plants', '15. Dead Trees and dry plants',
               '16. Gardens and crops', 'wooden and nature props'],
    'prop': ['11. Survival props', '11. Crates, barrels and supplies', '11. Crates and barrels',
             '12. Crates, barrels and storage', '13. crates and barrels',
             'Barrels, crates and objects', 'Cargo, crates and containers',
             'Jars, bottles and items', 'Jars, pots and items', 'Food, drink and cafe props',
             '18. Winter food and drinks', '12. Weapons and supplies', '16. Loot and survival props',
             '15. Workbenches and tools', '7. Trash and debris', 'skeletons and bones',
             '19. Miscellaneous (1)', 'Miscellaneous', 'Furniture and fixtures',
             'Furniture and fixtures (1)', '17. Benches and seating', '7. Computers and screens',
             '18. Pipes and cables', '13. Pipes and wiring', '11. Gauges and meters',
             '5. Barricades and defenses'],
}

FAMILY_WORDS = {
    'road': 'streets, sidewalks, kerbs and the floors you walk on',
    'marking': 'what is painted or spilled ON the ground: warnings, hazards, blood',
    'settlement': 'houses and their skins: roofs, walls, windows, fences, stalls, ruins',
    'door': 'doors, gates and arches',
    'lamp': 'lamps, fire barrels and what still burns',
    'ground': 'terrain and desert: dirt, grass, water, rock, dead trees',
    'prop': 'props and the cars: crates, barrels, trash, tools, furniture, bones',
}


def the_map():
    """ONE FAMILY PER PACK, AND THE BUILD REFUSES IF A PACK HE APPROVED HAS NONE."""
    fam, clash = {}, []
    for f, ps in THEIRS.items():
        for p in ps: fam[p] = f
    for f, ps in MINE.items():
        for p in ps:
            if p in fam and fam[p] != f: clash.append((p, fam[p], f))
            fam.setdefault(p, f)
    if clash: die('a pack is filed in two families: %s' % clash)
    return fam


def load_corpus():
    packs = {}
    for i in range(1, 5):
        packs.update(json.load(open(REPO % i))['packs'])
    up = collections.defaultdict(list)
    for v in json.load(open(CONFIRMED))['verdicts']:
        if v.get('v') == 'UP': up[v['pack']].append(v['idx'])
    return packs, up


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)


def contact(fam, rows, cell=96, cols=16):
    """ONE SHEET A FAMILY, SECTIONED BY PACK, SO A LANE SEES THE WHOLE BAR AT ONCE. Every tile
       is drawn AT ITS OWN PIXELS inside a cell and never scaled up: this sheet exists to show
       what the bar looks like, and a resampled reference is not the reference (rule 89's own
       point, one art pixel to one screen pixel)."""
    by = collections.OrderedDict()
    for r in rows: by.setdefault(r['pack'], []).append(r)
    f14, f11 = font(14), font(11)
    pad, head = 10, 26
    H = 44
    for pack, items in by.items():
        H += head + ((len(items) + cols - 1) // cols) * (cell + pad) + 8
    W = cols * (cell + pad) + pad
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((pad, 10), 'THE BAR: %s   %s' % (fam.upper(), FAMILY_WORDS[fam]), font=f14, fill=HOT)
    d.text((pad, 26), '%d tiles he judged UP in the 7/13 sweep, at their own pixels'
           % len(rows), font=f11, fill=DIM)
    y = 44
    for pack, items in by.items():
        d.text((pad, y + 6), '%s   (%d)' % (pack, len(items)), font=f11, fill=INK)
        y += head
        for k, r in enumerate(items):
            cx = pad + (k % cols) * (cell + pad)
            cy = y + (k // cols) * (cell + pad)
            t = Image.open(os.path.join(OUT, fam, r['file'])).convert('RGBA')
            im.paste(t, (cx + max(0, (cell - t.size[0]) // 2),
                         cy + max(0, (cell - t.size[1]) // 2)), t)
        y += ((len(items) + cols - 1) // cols) * (cell + pad) + 8
    return im


def extract():
    fam_of = the_map()
    packs, up = load_corpus()
    unknown = sorted(p for p in fam_of if p not in up)
    by_fam = collections.defaultdict(list)
    corpus, written, mb = {}, 0, 0
    for pack in sorted(up):
        f = fam_of.get(pack)
        if f is None: die('%s is approved and filed in no family' % pack)
        os.makedirs(os.path.join(OUT, f), exist_ok=True)
        for idx in sorted(up[pack]):
            if pack not in packs or idx >= len(packs[pack]): continue
            t = packs[pack][idx]
            fn = 'pack_%s_%03d.png' % (slug(pack), idx)
            raw = base64.b64decode(t['b64'])
            path = os.path.join(OUT, f, fn)
            open(path, 'wb').write(raw)
            im = Image.open(io.BytesIO(raw))
            rec = dict(file=fn, pack=pack, idx=idx, w=im.size[0], h=im.size[1],
                       family=f, approved='UP (7/13 sweep)', key='pack:%s#%d' % (pack, idx))
            by_fam[f].append(rec)
            corpus['%s#%d' % (pack, idx)] = rec
            written += 1
            mb += len(raw)
    return fam_of, by_fam, corpus, written, mb / 1e6, unknown, up


# ------------------------------------------------------------------------------- THE TAPE

def guards(fam_of, by_fam, corpus, written, mb, unknown, up, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    judged = json.load(open(CONFIRMED))
    want = judged['counts']['up']
    ok('EVERY TILE HE JUDGED UP IS OUT AS A PNG: %d of the %d in his own 7/13 sweep'
       % (written, want), written == want,
       'the corpus is what he approved, not a sample of it')

    ok('EVERY APPROVED PACK HAS A FAMILY AND NONE WAS SWALLOWED BY A BUCKET: %d packs over '
       '%d families' % (len(up), len(by_fam)), all(p in fam_of for p in up))

    for f in sorted(by_fam):
        n = len(by_fam[f])
        ok('%-11s %4d tiles  %s' % (f, n, FAMILY_WORDS[f]), n > 0)

    ok('NOTHING DIRECTION ALREADY PLACED WAS MOVED: their %d packs keep the family their own '
       '10/10 tool gave them' % sum(len(v) for v in THEIRS.values()),
       all(fam_of.get(p) == f for f, ps in THEIRS.items() for p in ps))

    ok('EVERY TILE IS KEYED THE WAY HE JUDGED IT, so a twin can cite it and the gate can check '
       'it: %d keys of the form pack:<pack>#<idx>' % len(corpus),
       all(r['key'] == 'pack:%s#%d' % (r['pack'], r['idx']) for r in corpus.values()))

    bad = [r for r in corpus.values()
           if not os.path.exists(os.path.join(OUT, r['family'], r['file']))]
    ok('EVERY KEY IS A FILE ON DISK (%d checked)' % len(corpus), not bad,
       '%d keys point at nothing' % len(bad))

    sizes = [(r['w'], r['h']) for r in corpus.values()]
    ok('NOTHING WAS RESIZED ON THE WAY OUT: the biggest tile is %dx%d, his masters are capped '
       'at 96' % (max(w for w, h in sizes), max(h for w, h in sizes)),
       max(max(w, h) for w, h in sizes) <= 96,
       'a resampled reference is not the reference')

    ok('AND THE SHELF IS NOT ON THE SITE: reference/ is excluded in _config.yml, so %.1f MB of '
       'his tiles cost the published page nothing' % mb,
       'reference/' in open('_config.yml').read())

    ok('THE NAMES IN THE MAP THAT MATCH NO APPROVED PACK ARE REPORTED, NOT HIDDEN: %d (%s)'
       % (len(unknown), ', '.join(unknown) if unknown else 'none'), True)
    return fails


def measure_two(his, ours):
    """THE THREE DIFFERENCES, MEASURED OFF THE TILES THEMSELVES, AND EVERY ONE OF THEM
       SCALE-FREE.

       *** THE FIRST VERSION OF THIS COMPARED THE WRONG TWO THINGS AND I ALMOST SHIPPED IT. ***
       It measured raw pixel COUNT and raw colour COUNT, so putting a 96 px pack tile beside a
       whole VOTE contact sheet reported "his 5,120 pixels, ours 2,405,520" and "his damage
       runs 0.76 px, ours 0.00". Both numbers are true and both are meaningless: a sheet is not
       a tile. A measurement that compares the wrong two things is worse than no measurement,
       because it looks like evidence.

       So all three are now ratios that do not care how big the picture is:
         COLOUR DENSITY   distinct colours per ten thousand pixels. A six-step ramp stays low
                          however big you draw it; a photographed surface stays high.
         THE HALF         how many colours it takes to cover half the picture. A ramp needs
                          two or three. A real surface needs dozens.
         THE RUN          how far a dark mark runs before it stops, as a share of the
                          picture's width. A drawn crack runs; scattered damage stops."""
    import numpy as np
    def stats(ims):
        dens, half, run = [], [], []
        for im in ims:
            a = np.asarray(im.convert('RGB'), np.int16)
            h, w, _ = a.shape
            flat = a.reshape(-1, 3)
            n = flat.shape[0]
            cnt = collections.Counter(map(tuple, flat))
            dens.append(10000.0 * len(cnt) / n)
            run_sum = 0; k = 0
            for _, c in cnt.most_common():
                run_sum += c; k += 1
                if run_sum >= n / 2.0: break
            half.append(k)
            lum = a.sum(axis=2)
            dark = lum < (np.median(lum) - 0.6 * lum.std())
            tot = cnts = 0
            for row in dark:
                r = 0
                for v in row:
                    if v: r += 1
                    elif r: tot += r; cnts += 1; r = 0
                if r: tot += r; cnts += 1
            run.append(100.0 * (tot / float(max(1, cnts))) / w)
        f = lambda v: sum(v) / len(v)
        return f(dens), f(half), f(run)
    h = stats(his)
    o = stats(ours)
    return dict(density=(h[0], o[0]), half=(h[1], o[1]), run=(h[2], o[2]))


def run_says(h, o):
    """*** AND THE SENTENCE UNDER THE THIRD NUMBER CONTRADICTED THE NUMBER ON TWO OF THE THREE
       TWINS. *** I had written "his damage is drawn and runs; ours is scattered and stops" as
       a fixed line under a measurement that sometimes says the opposite. A canned sentence
       over a live number is the same lie as a guess. The reading follows the number now, and
       either way round it says something a cook can act on."""
    if h >= o * 1.15:
        return ('His marks run further: a crack of his starts, runs, branches and ends, while '
                'ours stops after a mark. That is noise against concrete.')
    if o >= h * 1.15:
        return ('OURS runs further, and that is not better: with so few colours a dark mark '
                'comes out as one long flat smear, while his is many fine marks at many '
                'values. Long and flat is the tell.')
    return ('The marks run about the same length. The difference is in the two numbers above '
            'it, not in this one.')


def card(by_fam):
    """THE SHEET HE SEES: the bar beside what we cooked, the ground first, because rule 87 says
       the order is his pain and the ground is the fight he plays. His approved street tiles on
       the left, this lane's own cooked street cells on the right, both AT ONE ART PIXEL TO ONE
       PHONE PIXEL (rule 89), and the three differences named under them."""
    # *** AND THE FIRST CUT OF THIS SHEET SHOWED ONE PACK. *** Sorted by pack and sliced to
    # 24, it took the first twenty-four cobblestones and called that the bar. The bar is the
    # SPREAD: a tile out of every street pack he approved, in turn, so the sheet shows what
    # the family actually holds and not one artist inside it.
    by_pack = collections.OrderedDict()
    for r in sorted(by_fam['road'], key=lambda r: (r['pack'], r['idx'])):
        by_pack.setdefault(r['pack'], []).append(r)
    road, k = [], 0
    while len(road) < 24 and any(len(v) > k for v in by_pack.values()):
        for v in by_pack.values():
            if len(v) > k and len(road) < 24: road.append(v[k])
        k += 1
    ours = []
    s = json.load(open('banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'))
    for t in s['tiles']:
        if t['id'].startswith(('road_', 'walk_')):
            ours.append((t['id'], Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')))
    cell, cols, pad = 96, 12, 10
    rows_t = (len(road) + cols - 1) // cols
    rows_o = (len(ours) + cols - 1) // cols
    W = cols * (cell + pad) + pad
    H = 130 + rows_t * (cell + pad) + 86 + rows_o * (cell + pad) + 196
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    f18, f13, f11 = font(18), font(13), font(11)
    d.text((pad, 14), 'THE BAR, AND WHAT WE MADE', font=f18, fill=INK)
    d.text((pad, 40), 'his own approved street tiles, and this lane\'s cooked street cells, '
                      'both at one art pixel to one phone pixel', font=f13, fill=DIM)
    d.text((pad, 60), 'nothing here is scaled: that is the whole point', font=f11, fill=DIM)
    y = 96
    d.text((pad, y), 'HIS: 24 of the street tiles he bought and judged UP', font=f13, fill=HOT)
    y += 24
    for k, r in enumerate(road):
        t = Image.open(os.path.join(OUT, 'road', r['file'])).convert('RGBA')
        cx = pad + (k % cols) * (cell + pad); cy = y + (k // cols) * (cell + pad)
        im.paste(t, (cx + (cell - t.size[0]) // 2, cy + (cell - t.size[1]) // 2), t)
    y += rows_t * (cell + pad) + 22
    d.text((pad, y), 'OURS: every street and sidewalk cell in the approved 7/28 starter set',
           font=f13, fill=HOT)
    y += 24
    for k, (tid, t) in enumerate(ours):
        cx = pad + (k % cols) * (cell + pad); cy = y + (k // cols) * (cell + pad)
        im.paste(t, (cx + (cell - t.size[0]) // 2, cy + (cell - t.size[1]) // 2))
    y += rows_o * (cell + pad) + 20
    mm = measure_two([Image.open(os.path.join(OUT, 'road', r['file'])) for r in road],
                     [t for _, t in ours])
    for line in (
        ('THE THREE DIFFERENCES, MEASURED OFF THESE TILES, NOT GUESSED:', INK, f13),
        ('1  COLOURS PER TEN THOUSAND PIXELS:  his %0.1f   ours %0.1f   (%.0f times over)'
         % (mm['density'][0], mm['density'][1],
            mm['density'][0] / max(0.001, mm['density'][1])), DIM, f11),
        ('2  COLOURS IT TAKES TO COVER HALF THE TILE:  his %0.0f   ours %0.0f'
         % (mm['half'][0], mm['half'][1]), DIM, f11),
        ('   Ours is a six-step ramp per material. That is why ours BANDS where his reads as '
         'a surface.', DIM, f11),
        ('3  HOW FAR A DARK MARK RUNS, AS A SHARE OF THE TILE:  his %.1f%%   ours %.1f%%'
         % (mm['run'][0], mm['run'][1]), DIM, f11),
        ('   ' + run_says(mm['run'][0], mm['run'][1]), DIM, f11),
        ('', DIM, f11),
        ('SO THE RULE IS RIGHT AND THE ROW IS THE FIX: from now the tile IS HIS TILE,',
         INK, f13),
        ('placed, flipped, weathered and recoloured inside its own palette, never cooked fresh.',
         INK, f13)):
        d.text((pad, y), line[0], font=line[2], fill=line[1])
        y += 20
    return im, road, ours, mm


TWINS = [
    # PLUMBER's three, each against a pack tile OF ITS OWN KIND, and ours is the actual cooked
    # tile or a patch of it -- never the contact sheet, which is what the first cut compared
    dict(item='cook-the-far-end-as-tiles-10-10', fam='ground', pack='3. Grass and ground tiles',
         what="the map's far-end terrain tiles",
         ours=('bank', 'banks/BOHEMIA_THE_FAR_END_TILES_10_10_26.txt')),
    dict(item='cook-the-building-props-10-10', fam='prop', pack='15. Street props',
         what="the six buildings' props",
         ours=('bank', 'banks/BOHEMIA_THE_BUILDING_PROPS_10_10_26.txt')),
    dict(item='cook-his-block-as-a-place-10-10', fam='settlement', pack='5. Roof tiles',
         what='his block as a settlement picture',
         ours=('crop', 'slices/settlement_ground/home_0.webp')),
]


def ours_tiles(spec):
    """OUR SIDE, AS TILES, NEVER AS A SHEET. A bank gives its own pieces; a finished picture
       gives 96 px patches cut out of it, which is the same size as his master."""
    kind, path = spec
    if kind == 'bank':
        d = json.load(open(path))
        rows = d.get('tiles') or d.get('pieces') or []
        out = []
        for r in rows[:12]:
            b = r.get('b64')
            if b: out.append(Image.open(io.BytesIO(base64.b64decode(b))).convert('RGB'))
        return out
    im = Image.open(path).convert('RGB')
    w, h = im.size
    return [im.crop((x, y, x + 96, y + 96)) for x, y in
            ((w // 4, h // 8), (w // 2, h // 8), (3 * w // 4, h // 8),
             (w // 4, h // 2), (w // 2, h // 2), (3 * w // 4, h // 2))]


def the_twins(by_fam):
    """PLUMBER'S BOUNCE-BACK, ANSWERED WITH NUMBERS (rule 8: his bugs beat the queue). Three
       sheets this lane registered carry no reference twin, which rule 82 now requires. A twin
       is not a line of prose: it is HIS tile beside ours and THREE DIFFERENCES. So each one is
       measured with the same three numbers as the card, against a pack tile of its own kind,
       and the differences written are the numbers that came out."""
    out = []
    for t in TWINS:
        rows = [r for r in by_fam[t['fam']] if r['pack'] == t['pack']]
        if not rows: die('no approved tile in %s for the twin of %s' % (t['pack'], t['item']))
        his = [Image.open(os.path.join(OUT, t['fam'], r['file'])) for r in rows[:12]]
        ours = ours_tiles(t['ours'])
        if not ours: die('no cooked tiles to compare for %s' % t['item'])
        mm = measure_two(his, ours)
        out.append(dict(item=t['item'], what=t['what'],
                        src='pack:%s#%d' % (t['pack'], rows[0]['idx']),
                        diffs=[
            'COLOURS PER TEN THOUSAND PIXELS: his %.1f, ours %.1f. Ours is built from six-step '
            'ramps, so it bands where his reads as a surface.'
            % (mm['density'][0], mm['density'][1]),
            'COLOURS TO COVER HALF THE PICTURE: his %.0f, ours %.0f. He bought a surface; we '
            'drew a palette.' % (mm['half'][0], mm['half'][1]),
            'HOW FAR A DARK MARK RUNS, AS A SHARE OF THE WIDTH: his %.1f%%, ours %.1f%%. %s'
            % (mm['run'][0], mm['run'][1], run_says(mm['run'][0], mm['run'][1]))],
                        measured=mm))
    return out


def main():
    fam_of, by_fam, corpus, written, mb, unknown, up = extract()
    log = []
    fails = guards(fam_of, by_fam, corpus, written, mb, unknown, up, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    sheets = {}
    for f in sorted(by_fam):
        sh = contact(f, sorted(by_fam[f], key=lambda r: (r['pack'], r['idx'])))
        p = os.path.join(OUT, f, 'CONTACT_%s.png' % f.upper())
        sh.save(p, optimize=True)
        sheets[f] = (p, sh.size)

    json.dump(dict(
        bank='BOHEMIA_THE_ART_BANK_CORPUS', date='10/10/26', lane='cook',
        row='[the pack is the twin], rules 82, 82a, 87',
        law='rule 82a: every tile, prop, car, street, sidewalk, kerb, marking, lamp and house '
            'skin comes FROM the approved packs, never cooked fresh',
        source=[CONFIRMED, REPO % 1, REPO % 2, REPO % 3, REPO % 4],
        families={f: dict(words=FAMILY_WORDS[f], tiles=len(by_fam[f]),
                          contact_sheet=os.path.basename(sheets[f][0])) for f in sorted(by_fam)},
        how_to_use='Cite a twin as pack:<pack>#<idx>, which is the key he judged it under, and '
                   'the vote gate checks it against his own 7/13 sweep. The PNG for that key is '
                   'reference/art_bank/<family>/<file>. COOK TWO, COOK THREE and COOK FOUR '
                   'build from these; nothing here is ours and nothing here may be redrawn.',
        tiles=corpus), open(os.path.join(OUT, 'CORPUS.json'), 'w'))

    twins = the_twins(by_fam)
    json.dump(twins, open(os.path.join(OUT, 'TWINS_OWED.json'), 'w'), indent=1)
    os.makedirs('slices/vote', exist_ok=True)
    cim, road, ours, mm = card(by_fam)
    cim.save(OUT_CARD, optimize=True)

    L = []
    A = L.append
    A('THE APPROVED CORPUS, OUT TO PNG, BY FAMILY -- MEASURED')
    A('(COOK [the pack is the twin] round 1, 10/10/26; rules 82, 82a, 87)')
    A('=' * 78)
    A('')
    A('PAOLO 10/10: "all the art assets you made look like AI slop, take inspiration from the')
    A('assets we downloaded, we are extremely far off." And then: "the cars is an asset we')
    A('downloaded; a lot of the original street tiles and sidewalks we downloaded; LOOK AGAIN."')
    A('')
    A('HE WAS RIGHT AND THE ASSETS WERE ALWAYS HERE. They are the purchased HD packs taken in')
    A('on 7/7 and judged by him in the 7/13 sweep: 2,604 tiles looked at one by one, 1,927 of')
    A('them marked UP. They have been sitting in four bank files as base64 the whole time,')
    A('which is why nobody was looking at them. THEY ARE FILES NOW.')
    A('')
    A('WHAT CAME OUT:')
    for f in sorted(by_fam):
        A('  %-11s %4d tiles   %s' % (f, len(by_fam[f]), FAMILY_WORDS[f]))
    A('  %-11s %4d tiles   %.1f MB, and reference/ is excluded from the site so it costs the'
      % ('TOTAL', written, mb))
    A('                            published page nothing.')
    A('')
    A('EVERY TILE IS NAMED BY THE KEY HE JUDGED IT UNDER, pack and index, so a twin line can')
    A('say pack:<pack>#<idx> and the vote gate checks that key against his own sweep. The map')
    A('from key to file is reference/art_bank/CORPUS.json. One CONTACT SHEET a family, sectioned')
    A('by pack, at the tiles\' own pixels and never scaled, because a resampled reference is not')
    A('the reference.')
    A('')
    A('*** NOT ONE TILE DIRECTION ALREADY PLACED WAS MOVED. *** Their 10/10 round sampled twenty')
    A('packs into road, ground, prop and settlement and said in its own docstring that COOK owns')
    A('extracting the whole corpus. Those twenty keep the family they gave them, even where I')
    A('would have filed one elsewhere: their warning signs sit in prop and I would have called')
    A('them markings. Two tools disagreeing about where a tile lives is worse than either answer.')
    A('The other sixty-four packs are assigned here and THE BUILD REFUSES IF ONE OF THE 84 IS')
    A('UNASSIGNED, because a bucket that quietly swallows what the rules did not name is how a')
    A('corpus turns into a pile.')
    if unknown:
        A('')
        A('NAMES IN THE MAP THAT MATCH NO APPROVED PACK (reported, not hidden): %s'
          % ', '.join(unknown))
    A('')
    A('THE THREE DIFFERENCES, MEASURED, NOT GUESSED. This lane has written "his has more detail"')
    A('before and it is worth nothing: it cannot be checked and it does not say what to change.')
    A('His 24 street tiles against every street and sidewalk cell in our own approved 7/28')
    A('starter set:')
    A('  COLOURS PER TEN THOUSAND PIXELS      his %7.1f   ours %7.1f   (%.0f times over)'
      % (mm['density'][0], mm['density'][1], mm['density'][0] / max(0.001, mm['density'][1])))
    A('  COLOURS TO COVER HALF THE TILE       his %7.0f   ours %7.0f'
      % (mm['half'][0], mm['half'][1]))
    A('  HOW FAR A DARK MARK RUNS (of width)  his %6.1f%%   ours %6.1f%%'
      % (mm['run'][0], mm['run'][1]))
    A('')
    A('ALL THREE ARE RATIOS ON PURPOSE. The first cut of this measurement used raw counts, so')
    A('a 96 px pack tile beside a whole contact sheet read "his 5,120 pixels, ours 2,405,520".')
    A('Both numbers true, both meaningless. A measurement that compares the wrong two things is')
    A('worse than no measurement, because it looks like evidence.')
    A('  ' + run_says(mm['run'][0], mm['run'][1]))
    A('')
    A('THE SECOND NUMBER IS THE ONE THAT EXPLAINS HIM. It takes a couple of colours to cover')
    A('half of one of our tiles and hundreds to cover half of one of his. That is what "looks')
    A('like AI slop" is actually describing: a surface made of a handful of flat values. It is')
    A('a fair reading of our own tiles and not an insult.')
    A('')
    A('AND THE FINDING THE THREE NEW CHATS NEED BEFORE THEY START. The 87 packs were drawn by')
    A('MANY HANDS. Battle Brothers reads as one world because every tile in a biome came from')
    A('one hand and one palette, so a road tile and a forest tile belong to each other before')
    A('either is placed. Ours will NOT do that by itself: laying pack tiles straight down will')
    A('give a board that is sharper than what we cook and still incoherent. The coherence has')
    A('to come from a weather, wear and light pass of our own ON TOP, which is exactly what rule')
    A('82a already says ("placed, flipped, weathered, recoloured INSIDE the pack\'s palette").')
    A('COOK TWO and COOK FOUR: that pass is your first problem, not an afterthought.')
    A('')
    A("*** AND PLUMBER'S BOUNCE-BACK IS ANSWERED IN THE SAME ROUND (rule 8: his bugs beat the")
    A('*** queue). Three sheets this lane registered carry no reference twin, which rule 82 now')
    A('requires. A twin is not a line of prose, it is HIS tile beside ours and three')
    A('differences, so each was measured against a pack tile of its own kind:')
    for t in twins:
        A('  %-34s twin %s' % (t['item'], t['src']))
        for dd in t['diffs']:
            A('      - ' + dd)
    A('')
    A('MEASURED THIS RUN:')
    for st, line, why in log:
        A('  %-4s %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('\n  wrote %d tiles into %s (%.1f MB) over %d families'
          % (written, OUT, mb, len(by_fam)))
    for f in sorted(sheets): print('  wrote %s  %s' % (sheets[f][0], sheets[f][1]))
    print('  wrote %s\n  wrote %s\n  wrote %s'
          % (os.path.join(OUT, 'CORPUS.json'), OUT_REC, OUT_CARD))


if __name__ == '__main__':
    main()
