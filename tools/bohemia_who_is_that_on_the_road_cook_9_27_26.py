#!/usr/bin/env python3
"""WHO IS THAT ON THE ROAD  (COOK [bb map art] round 3, 9/27/26)

RULE 33(a): "parties roam and leave tracks". Round 1 of this row drew YOU and four places.
Round 2 drew the land under them. This is everybody else: the thirteen factions, moving on
the map he now has to be able to read.

*** MEASURED FIRST, AND THE FINDING IS THAT YOU CANNOT TELL WHO IS COMING. *** The thirteen
faction colours are not mine and never will be -- COLOUR IS TERRITORY (8/26) says which hue a
faction owns is HIS, they are measured off his own shipped wardrobe, and faction_colour_gate
goes red if they drift. So I measured what they do as banners, and:

  CARTEL AND MOB ARE 3.6 APART on a scale whose widest pair is 373. They are the same colour.
  EIGHT MORE PAIRS SIT UNDER 50: Anarchists/Trades 38, Caravans/Trades 39, Mob/Remnants 39,
  Cartel/Remnants 42, Trades/Remnants 44, Anarchists/Remnants 47, Anarchists/Mob 48,
  Caravans/Church 49.
  AND AGAINST THE CITY GROUND -- value 86, where the parties actually are -- NINE OF THIRTEEN
  BANNERS SIT WITHIN 25 OF THE GROUND THEY STAND ON.

Eight of the thirteen are browns at hue 30 and four more are greys, because this is a valley
of working people in dust, which is right. It just means a banner cannot be the thing that
identifies a party.

*** SO THE SHAPE SAYS WHAT THEY ARE AND THE BANNER SAYS WHO, WHICH IS THE REFERENCE'S OWN
ANSWER. *** BB's map shows a company by its silhouette and a house by its banner. Four party
shapes, and the shape each faction takes is DERIVED FROM CANON, not picked by me: every
faction in engine/BOHEMIA_faction_graph.json carries an `align`, and that file's own header
says "All canon; nothing invented".

  military, predatory, territorial            -> A PATROL     two abreast, in step
  neutral (the trading factions)              -> A CARAVAN    a cart and someone leading it
  underground, nonprofit, community, evangelical -> A CROWD    four of them, no pole, a rag
  everything else                             -> ON FOOT      one figure with a banner

WHAT MOVES (rule 33g), one part each, and it is not the same part:
  ON FOOT   the banner stirs
  A PATROL  the rank steps, one man forward and one back
  A CARAVAN the wheels turn
  A CROWD   they shuffle, one body a beat

*** AND I TRIED TO SOLVE THE DARK-GROUND PROBLEM WITH CONTRAST TWICE BEFORE SEEING IT WAS THE
DRAWING. *** Anarchists measured 2% findable on the mountain, so I put a sun-side lip inside
the body the way the footprints do it: on a figure whose limbs are one and two pixels wide
EVERY pixel has open ground to its north, so the marker turned into a pale outline with two
dark holes and all four shapes came out as the same smudge. Then I put the lip OUTSIDE, and
got a pale halo filling every gap. Both times the measurement went green and the picture got
worse. THE FOUR SHAPES WERE FOUR GROUPS OF PEOPLE, AND AT FOURTEEN PIXELS A PERSON IS A
PERSON. Redrawn to differ on the OUTER SILHOUETTE -- tall and thin, wide and spiked, long and
wheeled, a low mass -- and each one now carries a REAL LIGHT THING it would actually own: a
staff, spear points, a canvas tilt, bedding over their heads. The light is an object, not a
rim, and it is what makes them findable on the dark ground. Same failure this lane named in
the footprints round, word for word: treating "it does not read" as a numbers problem when it
is a drawing problem.

*** AND ROUND 1'S GUARD IS AMENDED HERE, NOT LOOSENED. *** That round refused any marker whose
bottom third moved, because "a machine still running has a part that moves and feet that do
not". That is true of a pump and a fortress and it is nonsense for people: A PARTY IS PEOPLE
AND PEOPLE MOVE THEIR FEET. The feet rule stays on the PLACES, where it was earned, and the
rule here is the one that actually matters for a walking group: THE GROUP MUST NOT DRIFT --
its centre of ink may not wander between frames, or the marker slides around the map on its
own instead of walking on the spot.

THE TRACKS ARE NOT DRAWN HERE. Rule 33(a) says parties leave them and they already exist:
__WHOSE_FOOTPRINTS_ARE_THESE__ (9/12), a coloured thread at whole-valley zoom, passed by
DIRECTION 9/13. Round 1 of this row said the same thing and it still holds.

THE LIBRARY, READ FIRST (rule 33j): reference/library/battle_brothers/01_WORLDMAP.md.
"SCOUTING: parties within sight are named by size ('a small band', 'a large host') and
strength badges; you can see their banner and destination line. PATROLS: noble houses send
patrols on roads; caravans move..." So the reference itself separates WHAT a party is (its
size and kind, read from the sprite) from WHO it belongs to (its banner), and it gives the
player a name on inspection rather than asking the colour to carry everything. That is the
whole design of this round and it came from the volume, not from me.

REFERENCE CHECK (the 9/4 standing law):
  BBM-01 THE OVERWORLD PARTY MARKER: a party is a small figure found by silhouette plus one
         loud mark. Round 1 took that for YOU; here it is taken thirteen times over, and the
         measurement above is why the silhouette has to do the work.
  BBM-02 A PLACE IS A KIT, NOT AN ICON, taken across to parties: four shapes and one banner
         slot make thirteen markers, so a fourteenth faction is an arrangement and not a new
         drawing.
  BBM-04 ONE MOVING PART ON A STILL BODY, on the beat -- amended above for people.
  COLOUR IS TERRITORY (8/26, laws/BOHEMIA_LAW_COLOUR_IS_TERRITORY_8_26_26.md): the banner
         colours are read out of engine/BOHEMIA_faction_colours.json exactly as measured and
         not one of them is adjusted, which is the point of the finding.
  AH-01  R1 THE ORDINARY FRAME: a dust road, and four people on it you cannot name yet.
         R4 THE LIGHT WAS IN THE ROOM: north-west, as everywhere.
  REUSE CHECK: imports round 1's cook for its ink palette, its map grounds read out of the
  MAP tab, its frame builder and its renderer. The grounds come from round 2's measured
  values. Nothing is retyped and no colour is invented.

    python3 tools/bohemia_who_is_that_on_the_road_cook_9_27_26.py
      -> banks/BOHEMIA_THE_PARTIES_ON_THE_MAP_9_27_26.txt
      -> slices/vote/COOK_WHO_IS_THAT_ON_THE_ROAD.html   (they move)
      -> slices/vote/COOK_WHO_IS_THAT_ON_THE_ROAD.png
"""
import base64
import io
import itertools
import json
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
sys.path.insert(0, os.path.join(REPO, 'tools'))

import bohemia_the_map_has_markers_cook_9_24_26 as R1

OUT_BANK = 'banks/BOHEMIA_THE_PARTIES_ON_THE_MAP_9_27_26.txt'
OUT_HTML = 'slices/vote/COOK_WHO_IS_THAT_ON_THE_ROAD.html'
OUT_PNG = 'slices/vote/COOK_WHO_IS_THAT_ON_THE_ROAD.png'

INK = dict(R1.INK)
GROUND = dict(R1.GROUND)
rgb = R1.rgb
LUM = R1.LUM


def die(m): sys.exit('REFUSED: ' + m)


def factions():
    col = json.load(open('engine/BOHEMIA_faction_colours.json'))['factions']
    gra = json.load(open('engine/BOHEMIA_faction_graph.json'))['factions']
    out = {}
    for name, c in col.items():
        g = gra.get(name)
        if not g: die('%s has a measured colour and no entry in the faction graph' % name)
        out[name] = {'hex': c['hex'], 'align': g.get('align'), 'power': g.get('act1_power')}
    return out


F = factions()

# THE SHAPE COMES FROM `align`, WHICH IS CANON ("All canon; nothing invented" is that file's
# own header). It is not a taste list; it is a reading of data the game already holds.
SHAPE_OF = {
    'military': 'PATROL', 'predatory': 'PATROL', 'territorial': 'PATROL',
    'neutral': 'CARAVAN',
    'underground': 'CROWD', 'nonprofit': 'CROWD', 'community': 'CROWD',
    'evangelical': 'CROWD',
}


def shape_for(align):
    return SHAPE_OF.get(align, 'ON FOOT')


# ---------------------------------------------------------------- the four parties
# 'b' is the banner: it is painted in the faction's own measured colour and nothing else is.
# *** I TRIED TO FIX THIS WITH CONTRAST TWICE AND BOTH TIMES THE PROBLEM WAS THE DRAWING. ***
# The first four shapes were four groups of PEOPLE, and at fourteen pixels with one and two
# pixel limbs, a person is a person: ON FOOT, PATROL and CROWD all came out as the same dark
# smudge, and the two rims I put on them to make them findable on dark ground ate the figures
# instead (inside: every pixel of a thin limb has open ground to its north, so the whole
# marker turned to outline; outside: a pale halo in every gap). This is the same failure this
# lane named in the footprints round, word for word: TREATING "IT DOES NOT READ" AS A NUMBERS
# PROBLEM WHEN IT IS A DRAWING PROBLEM.
#
# So the rim is gone and the four are redrawn to differ where it counts, ON THE OUTER
# SILHOUETTE, and each one carries a REAL LIGHT THING -- a staff, spear points, a canvas
# tilt, a rag -- instead of a lip painted round the edge. The light is an object they own,
# which is also what makes them findable on the dark ground.
#
#   ON FOOT   TALL AND THIN, with a flag over it
#   PATROL    WIDE AND LOW, with a row of points above it
#   CARAVAN   LONG AND HORIZONTAL, a canvas on wheels
#   CROWD     A MASS, wider than tall, no straight edge and no points
FOOT_BODY = [
    "..w....",
    "..w....",
    "..w....",
    "..w....",
    "..w....",
    "..w....",
    "..kk...",
    ".kddk..",
    ".kdwk..",
    "..kk...",
    ".kkkk..",
    ".kkkk..",
    "..k.k..",
    ".sk.ks.",
    "..s.s..",
]
FOOT_PART = [
    [(3, 0, ["bbbb", "bbbb", "bbb.", "bb.."])],
    [(3, 0, ["bbbb", "bbb.", "bbbb", "bb.."])],
    [(3, 0, ["bbb.", "bbbb", "bbbb", "b..."])],
    [(3, 0, ["bbbb", "bbbb", "bb..", "bb.."])],
]

PATROL_BODY = [
    ".w...w...w...w",
    ".w...w...w...w",
    ".w...w...w...w",
    "kkk.kkk.kkk.kk",
    "kdk.kdk.kdk.kd",
    "kkk.kkk.kkk.kk",
    "kkk.kkk.kkk.kk",
    ".k...k...k...k",
    ".k...k...k...k",
    "skk.skk.skk.sk",
    ".ss..ss..ss..s",
    "..............",
]
PATROL_PART = [                                   # the rank steps, and the banner leads it
    [(0, 0, ["b"]), (1, 7, ["k"]), (9, 8, ["k"])],
    [(0, 0, ["b"]), (1, 8, ["k"]), (9, 7, ["k"])],
    [(0, 0, ["b"]), (1, 7, ["k"]), (9, 8, ["k"])],
    [(0, 0, ["b"]), (1, 8, ["k"]), (9, 7, ["k"])],
]

CARAVAN_BODY = [
    "................",
    "....wwwwwwww....",
    "...wwwwwwwwww...",
    "..kwwwwwwwwwwk..",
    "..kkkkkkkkkkkk..",
    "..kddddddddddk..",
    ".kkkkkkkkkkkkkk.",
    "..kk........kk..",
    "..kk........kk..",
    ".skks......skks.",
    "..ss........ss..",
    "................",
]
CARAVAN_PART = [                                  # the wheels turn and a pennant sits up front
    [(2, 0, ["bb"]), (2, 7, ["kw"]), (12, 7, ["kw"])],
    [(2, 0, ["bb"]), (2, 7, ["wk"]), (12, 7, ["wk"])],
    [(2, 0, ["bb"]), (2, 8, ["kw"]), (12, 8, ["kw"])],
    [(2, 0, ["b."]), (2, 8, ["wk"]), (12, 8, ["wk"])],
]

CROWD_BODY = [
    # A CROWD ON THE MOVE CARRIES WHAT IT HAS, and that is also what lets it be seen: the
    # pale band across the top is bedding and sheets over their heads, not a rim. Measured:
    # without it Church stood 6% clear of the mountain, which is invisible.
    "..w..........",
    "..w.wwww.ww..",
    ".kkkwkkkwkk..",
    "kkkkkkkkkkkk.",
    "kkkkkkkkkkkkk",
    "kkkkkkkkkkkkk",
    ".kkkkkkkkkkk.",
    "..kkkkkkkkk..",
    "..k.k.k.k.k..",
    ".sk.k.k.k.ks.",
    "..s.s.s.s.s..",
]
CROWD_PART = [                                    # they shuffle, and the rag hangs off the pole
    [(3, 0, ["bb", "b."]), (2, 8, ["k"]), (8, 8, ["k"])],
    [(3, 0, ["bb", ".b"]), (2, 8, ["."]), (8, 8, ["k"])],
    [(3, 0, ["b.", "bb"]), (2, 8, ["k"]), (8, 8, ["."])],
    [(3, 0, ["bb", "b."]), (2, 8, ["k"]), (8, 8, ["k"])],
]

SHAPES = {
    'ON FOOT': (FOOT_BODY, FOOT_PART, 'the banner stirs'),
    'PATROL': (PATROL_BODY, PATROL_PART, 'the two of them alternate stride'),
    'CARAVAN': (CARAVAN_BODY, CARAVAN_PART, 'the wheel turns'),
    'CROWD': (CROWD_BODY, CROWD_PART, 'they shuffle, one body a beat'),
}


def check(body, name):
    """Round 1's check is imported for everything else, but it validates against ITS palette
       and this round adds one slot it does not have: 'b', the banner, which is painted in the
       faction's own measured colour at draw time. So the check is local and 'b' is the only
       thing it adds."""
    w = len(body[0])
    for i, r in enumerate(body):
        if len(r) != w: die('%s row %d is %d wide, not %d' % (name, i, len(r), w))
        bad = set(r) - set(INK) - {'.', 'b'}
        if bad: die('%s row %d uses %s, which is not in the palette' % (name, i, sorted(bad)))
    return w, len(body)


def paint(f, banner, ground, mag=1):
    w, h = len(f[0]), len(f)
    im = Image.new('RGB', (w, h), rgb(ground))
    px = im.load()
    for y, r in enumerate(f):
        for x, c in enumerate(r):
            if c == '.': continue
            px[x, y] = rgb(banner) if c == 'b' else rgb(INK[c])
    return im.resize((w * mag, h * mag), Image.NEAREST) if mag > 1 else im


def dist(a, b):
    """A cheap perceptual distance, enough to say whether two banners tell apart."""
    r = (a[0] + b[0]) / 2.0
    dr, dg, db = a[0] - b[0], a[1] - b[1], a[2] - b[2]
    return math.sqrt((2 + r / 256) * dr * dr + 4 * dg * dg + (2 + (255 - r) / 256) * db * db)


def main():
    pad = lambda s, n: (s + ' ' * n)[:n]
    # ---- THE FINDING, FIRST, BECAUSE IT IS WHY THE ROUND IS SHAPED THIS WAY
    names = list(F)
    pairs = sorted((dist(rgb(F[a]['hex']), rgb(F[b]['hex'])), a, b)
                   for a, b in itertools.combinations(names, 2))
    widest = pairs[-1][0]
    print('THIRTEEN FACTIONS, AND YOU CANNOT TELL WHO IS COMING BY COLOUR. The banners are '
          'his, measured off his own wardrobe, and COLOUR IS TERRITORY says they stay:')
    for d, a, b in pairs[:6]:
        print('   %-12s and %-12s are %5.1f apart on a scale whose widest pair is %.0f'
              % (a, b, d, widest))
    same = [p for p in pairs if p[0] < 10]
    if not same:
        die('the closest faction pair is now %.1f apart. The finding this round is built on '
            'has gone away and the round needs rewriting, not shipping.' % pairs[0][0])
    print('   *** %s AND %s ARE %.1f APART. THEY ARE THE SAME COLOUR. ***'
          % (same[0][1].upper(), same[0][2].upper(), same[0][0]))

    city = 86
    near = [n for n in names if abs(LUM(rgb(F[n]['hex'])) - city) <= 25]
    print('   AND ON THE CITY GROUND (value %d, where the parties are), %d OF %d BANNERS SIT '
          'WITHIN 25 OF THE GROUND THEY STAND ON.' % (city, len(near), len(names)))
    print()

    # ---- THE SHAPES, FROM CANON
    print(pad('faction', 13) + pad('align', 19) + pad('shape', 10) + 'banner')
    used = {}
    for n in sorted(names):
        sh = shape_for(F[n]['align'])
        used.setdefault(sh, []).append(n)
        print(pad(n, 13) + pad(str(F[n]['align']), 19) + pad(sh, 10) + F[n]['hex'])
    missing = [s for s in SHAPES if s not in used]
    if missing:
        die('nothing in the game takes the %s shape, so it is a drawing nobody asked for: %s'
            % (missing[0], missing))
    print()

    # ---- the frames, and the guards
    sheets = {}
    print(pad('shape', 10) + pad('size', 9) + pad('frames', 8) + pad('ink', 7)
          + pad('moves', 8) + 'what moves')
    for sh, (body, parts, moves) in SHAPES.items():
        w, h = check(body, sh)
        frames = [R1.frame(body, p) for p in parts]
        ink = sum(1 for r in body for c in r if c != '.')
        moving = set()
        for f in frames:
            for y in range(h):
                for x in range(w):
                    if f[y][x] != body[y][x]: moving.add((x, y))
        print(pad(sh, 10) + pad('%dx%d' % (w, h), 9) + pad(str(len(frames)), 8)
              + pad(str(ink), 7) + pad('%.0f%%' % (100.0 * len(moving) / ink), 8) + moves)
        sheets[sh] = frames

        # *** THE GUARD ROUND 1 EARNED DOES NOT APPLY HERE, AND THE RIGHT ONE IS THIS. ***
        # A pump's feet must not move. A party's feet are the only thing that should. What
        # would be wrong is the GROUP DRIFTING: if the centre of the ink wanders between
        # frames the marker slides around the map instead of walking on the spot.
        cen = []
        for f in frames:
            pts = [(x, y) for y in range(h) for x in range(w) if f[y][x] != '.']
            cen.append((sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)))
        dx = max(c[0] for c in cen) - min(c[0] for c in cen)
        dy = max(c[1] for c in cen) - min(c[1] for c in cen)
        if max(dx, dy) > 0.9:
            die('%s drifts %.2f px between frames. It is walking across the map on its own.'
                % (sh, max(dx, dy)))

    # ---- THE SHAPES MUST TELL APART WITH THE COLOUR THROWN AWAY, because that is the whole
    #      reason they exist.
    sig = {}
    for sh, (body, parts, moves) in SHAPES.items():
        sil = [[c not in ('.', 's') for c in r] for r in body]
        h, w = len(sil), len(sil[0])
        cols = [sum(1 for y in range(h) if sil[y][x]) for x in range(w)]
        rows_ = [sum(1 for x in range(w) if sil[y][x]) for y in range(h)]
        groups = 0
        run = False
        for c in cols:
            if c and not run: groups += 1
            run = bool(c)
        sig[sh] = (max(cols), max(rows_), sum(cols), groups)
    print()
    print(pad('shape', 10) + pad('tallest', 9) + pad('widest', 8) + pad('body', 7)
          + 'bodies across')
    for sh in SHAPES:
        t, wd, ink, g = sig[sh]
        print(pad(sh, 10) + pad('%d px' % t, 9) + pad('%d px' % wd, 8) + pad('%d px' % ink, 7)
              + str(g))
    if len(set(sig.values())) != len(sig):
        die('two party shapes have the same silhouette signature. The shape is carrying the '
            'identification this round, so they cannot look alike.')
    print('all four signatures differ, so what a party IS reads with the colour gone.')

    # ---- AND EVERY BANNER MUST STILL BE FINDABLE, on the four grounds round 2 measured
    G2 = {'mountain': 44, 'city': 86, 'ground': 143, 'route': 124}
    print()
    print(pad('faction', 13) + ''.join(pad('on ' + g, 12) for g in G2))
    worst = None
    for n in sorted(names):
        sh = shape_for(F[n]['align'])
        frames = sheets[sh]
        ink = [c for f in frames for r in f for c in r if c != '.']
        line = pad(n, 13)
        for g, gl in G2.items():
            clear = 0
            for c in ink:
                col = rgb(F[n]['hex']) if c == 'b' else rgb(INK[c])
                if abs(LUM(col) - gl) >= 40: clear += 1
            share = 100.0 * clear / len(ink)
            line += pad('%.0f%%' % share, 12)
            if worst is None or share < worst[0]: worst = (share, n, g)
            if share < 12:
                die('%s is only %.0f%% findable on %s. Nobody could see them coming.'
                    % (n, share, g))
        print(line)
    print('(the share of the marker standing at least 40 of 255 clear of that ground. The '
          'worst in the whole set is %s on %s at %.0f%%.)' % (worst[1], worst[2], worst[0]))

    # ---- the still sheet
    def fnt(sz, bold=False):
        p = '/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else '')
        try: return ImageFont.truetype(p, sz)
        except Exception: return ImageFont.load_default()
    F_T, F_S, F_B = fnt(31, True), fnt(16), fnt(15)
    MAG, PAD, GAP = 5, 22, 14
    rowimgs = []
    for n in sorted(names):
        sh = shape_for(F[n]['align'])
        im = paint(sheets[sh][0], F[n]['hex'], GROUND['desert'], MAG)
        rowimgs.append((n, sh, im))
    d0 = ImageDraw.Draw(Image.new('RGB', (8, 8)))
    wide = lambda s, f: d0.textbbox((0, 0), s, font=f)[2]
    lab_w = max(wide(n + '   ' + shape_for(F[n]['align']), F_B) for n in names) + 18
    cellw = max(i.size[0] for _, _, i in rowimgs) + lab_w + GAP
    cols = 3
    rowh = max(i.size[1] for _, _, i in rowimgs) + GAP
    foot = ['The thirteen banner colours are yours, measured off your own clothes, and they '
            'stay. But CARTEL AND MOB ARE THE SAME COLOUR (3.6 apart on a scale that goes to '
            '373),',
            'eight more pairs are under 50, and nine of thirteen are the same brightness as '
            'the city ground they stand on. A banner cannot be what tells you who is coming.',
            'So the SHAPE says what they are and the banner says who. The shape comes from '
            'each faction\'s own canon alignment, not from me. They all move.']
    CW = max(cols * cellw, wide('WHO IS THAT ON THE ROAD', F_T),
             max(wide(s, F_B) for s in foot)) + PAD * 2
    card = Image.new('RGB', (CW, 4000), (17, 16, 15))
    d = ImageDraw.Draw(card)
    y = PAD
    d.text((PAD, y), 'WHO IS THAT ON THE ROAD', fill=(236, 231, 222), font=F_T); y += 40
    d.text((PAD, y), 'all thirteen, on the map\'s own ground. they move on the page.',
           fill=(150, 142, 130), font=F_S); y += 26
    for i, (n, sh, im) in enumerate(rowimgs):
        cx = PAD + (i % cols) * cellw
        cy = y + (i // cols) * rowh
        d.text((cx, cy + 4), n, fill=(214, 208, 198), font=F_B)
        d.text((cx, cy + 22), sh, fill=(150, 142, 130), font=F_B)
        card.paste(im, (cx + lab_w, cy))
    y += ((len(rowimgs) + cols - 1) // cols) * rowh + GAP
    for line in foot:
        d.text((PAD, y), line, fill=(176, 154, 114), font=F_B); y += 22
    card = card.crop((0, 0, CW, y + PAD))
    os.makedirs(os.path.dirname(OUT_PNG), exist_ok=True)
    card.save(OUT_PNG)

    # ---- the page where they move (rule 25, rule 33g)
    def b64(im):
        b = io.BytesIO(); im.save(b, 'PNG'); return base64.b64encode(b.getvalue()).decode()
    blocks = []
    for n in sorted(names):
        sh = shape_for(F[n]['align'])
        blocks.append({'name': n, 'shape': sh, 'moves': SHAPES[sh][2],
                       'frames': [b64(paint(f, F[n]['hex'], GROUND['desert'], 7))
                                  for f in sheets[sh]]})
    html = ('<!doctype html><meta name=viewport content="width=device-width,initial-scale=1">'
            '<title>WHO IS THAT ON THE ROAD</title><style>'
            'body{margin:0;background:#11100f;color:#cec8be;'
            'font:15px/1.5 system-ui,-apple-system,sans-serif}.wrap{padding:20px}'
            'h1{font-size:26px;margin:0 0 4px;color:#ece7de}.sub{color:#968e82;margin:0 0 18px}'
            '.p{display:flex;align-items:center;gap:14px;margin:0 0 10px}'
            '.nm{min-width:150px}.sh{color:#968e82;font-size:13px}'
            'canvas{image-rendering:pixelated;background:' + GROUND['desert'] + '}'
            '.foot{color:#b09a72;margin-top:20px}</style>'
            '<div class=wrap><h1>WHO IS THAT ON THE ROAD</h1>'
            '<p class=sub>thirteen factions, four shapes, one banner each. on the 120 beat.</p>'
            '<div id=out></div><p class=foot>Cartel and Mob are the same colour. '
            'Nine of thirteen are the same brightness as the city they stand on. '
            'The shape is what tells you who is coming.</p></div>'
            '<script>const M=' + json.dumps(blocks) + ';'
            'const out=document.getElementById("out");'
            'M.forEach(m=>{const row=document.createElement("div");row.className="p";'
            'const nm=document.createElement("div");nm.className="nm";'
            'nm.innerHTML=m.name+"<div class=sh>"+m.shape+" &middot; "+m.moves+"</div>";'
            'row.appendChild(nm);out.appendChild(row);'
            'const ims=m.frames.map(f=>{const i=new Image();i.src="data:image/png;base64,"+f;return i;});'
            'const c=document.createElement("canvas");row.appendChild(c);'
            'const x=c.getContext("2d");let n=0;'
            'setInterval(()=>{if(!ims[0].width)return;'
            'if(!c.width){c.width=ims[0].width;c.height=ims[0].height;}'
            'x.imageSmoothingEnabled=false;x.fillStyle="' + GROUND['desert'] + '";'
            'x.fillRect(0,0,c.width,c.height);x.drawImage(ims[n],0,0);'
            'n=(n+1)%ims.length;},500);});</script>')
    with open(OUT_HTML, 'w') as f: f.write(html)

    doc = {
        'version': 'BOHEMIA_THE_PARTIES_ON_THE_MAP_v1', 'built': '2026-09-27',
        'lane': 'COOK [bb map art] round 3',
        'the_finding': {
            'closest_pair': [same[0][1], same[0][2], round(same[0][0], 1)],
            'widest_pair': round(widest),
            'pairs_under_50': sum(1 for p in pairs if p[0] < 50),
            'banners_within_25_of_the_city_ground': len(near),
            'why_it_cannot_be_fixed_with_colour': 'COLOUR IS TERRITORY (8/26): which hue a '
                'faction owns is his, measured off his own wardrobe, and faction_colour_gate '
                'holds it. So the shape carries the identification instead.',
        },
        'shape_source': 'engine/BOHEMIA_faction_graph.json `align`, whose own header says '
                        '"All canon; nothing invented"',
        'shape_of_align': SHAPE_OF,
        'parties': {n: {'shape': shape_for(F[n]['align']), 'align': F[n]['align'],
                        'banner': F[n]['hex']} for n in sorted(names)},
        'shapes': {s: {'body': b, 'part': p, 'moves': mv} for s, (b, p, mv) in SHAPES.items()},
        'guard_amended': "round 1 refused any marker whose bottom third moved, because a "
                         "machine still running has feet that do not. A party is people and "
                         "people move their feet. The feet rule stays on the places; the rule "
                         "here is that the GROUP MUST NOT DRIFT -- the centre of ink may not "
                         "wander between frames.",
        'library_cited': 'reference/library/battle_brothers/01_WORLDMAP.md (rule 33j): '
                         'parties are named by size and strength badges, "you can see their '
                         'banner and destination line" -- so the reference separates WHAT a '
                         'party is from WHO it belongs to, and gives the name on inspection.',
        'not_drawn': 'the tracks parties leave already exist '
                     '(__WHOSE_FOOTPRINTS_ARE_THESE__, 9/12, passed by DIRECTION 9/13).',
        'not_shipped': 'rule 18: a bank and a VOTE candidate.',
    }
    with open(OUT_BANK, 'w') as f: json.dump(doc, f, indent=1)
    if len(json.load(open(OUT_BANK))['parties']) != len(names): die('read-back failed')
    print()
    print('wrote %s  (%.0f KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) / 1024))
    print('wrote %s  (%.0f KB)  <- they move here' % (OUT_HTML, os.path.getsize(OUT_HTML) / 1024))
    print('wrote %s  (%.0f KB)' % (OUT_PNG, os.path.getsize(OUT_PNG) / 1024))


if __name__ == '__main__':
    main()
