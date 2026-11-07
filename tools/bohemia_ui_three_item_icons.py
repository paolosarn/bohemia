#!/usr/bin/env python3
"""THE ITEM CARD'S PICTURES (UI THREE, rows [the weapon card] and [the item box], 11/7/26; VAMILY rules 251(b), 224, 425(a);
ask lines 146, 178. Paolo 10/26: 'the way the weapon stats are displayed is dog shit, it's so ugly... there's so many numbers,
we don't need this many numbers, it should just be an icon, a green arrow up, a red arrow down and a number').

A weapon's card, an armour's and a shield's become a row of pictures, each with its bar or one number (rule 251(b)): damage
(the hole, drawn 10/26), what it does to armour, what goes straight through armour, the reach as tiles, the action cost as
the fight's own pips, the breath, the weight, the rounds, TWO HANDS, a head hit, and what armour holds. The eight stats and
damage already have their pictures (tools/bohemia_ui_stat_icons.py, tools/bohemia_ui_three_damage_icon.py); this file draws
the rest with UI's own renderer (render(): a solid with a height, bevelled round, lit by the kit's one sun, shaded per
pixel, outlined in the receipt's ink, dropped on a hard shadow; never a flat drawing, never a CSS gradient, rule 114),
without touching UI's tool or any of its files:

  armour          ARMOUR          a dead cop's plate carrier, navy, its plate pocket and three pouches: what a piece HOLDS
  vs_armour       VS ARMOUR       a sledge coming down on a rusted plate that has already cracked: what a blow does to armour
  through_armour  THROUGH ARMOUR  a round going clean through a plate seen edge on, the hole behind it: what ignores armour
  weight          WEIGHT          an anvil: what it costs his breath to carry
  two_hands       TWO HANDS       two fists on one haft: a weapon that takes both hands (rule 194(b): big, on the card)
  head            HEAD            a range target's paper man, the round through his head: a blow's chance at the head
  round           ROUNDS          one brass cartridge (drawn small, laid in a row: the magazine)
  pip, pip_off    ACTION          the fight's own action pip (its drawer's amber bar, BOHEMIA_FIGHT.html i.pips), lit and spent
  tile, tile_lit, tile_you        REACH  a paving slab dark, lit in the reach's amber, and his own slab with him on it

Battle Brothers' item tooltip lists a weapon's numbers each beside its own small picture; ours drops the words.
Writes slices/stat_icons/<name>.png (the big ones 72 x 72: 24 points on his phone; the pip 24 x 36, the tiles 36 x 36, the
round 24 x 48, so each is drawn one art pixel to one phone pixel at its size on the card) and
records/target/UI_THREE_THE_ITEM_CARD_PICTURES_11_7_26.png (every icon of the card side by side at 1:1 and 3x, on the
crew screen's ground). Seeded: the same file every run.
  python3 tools/bohemia_ui_three_item_icons.py           # draw them
  python3 tools/bohemia_ui_three_item_icons.py --check   # exit 1 unless every file is the tool's, and no pair of the card's
                                                         # big pictures with the nine is alike (UI's look-alike measure)
REFERENCE CHECK: UI's renderer and its materials (imported, never edited); the fight's pip and tile colours (BOHEMIA_FIGHT.html
#drawer i.pips: #a87a30 lit, #8a6c44 the tile). No reference game beyond Battle Brothers' tooltip (its department: the
company's things). REUSE CHECK: the nine stat pictures stay as they are; nothing here redraws one.
"""
import os, sys, math, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'slices', 'stat_icons')
SHEET = os.path.join(ROOT, 'records', 'target', 'UI_THREE_THE_ITEM_CARD_PICTURES_11_7_26.png')

def load(name, rel):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, rel))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

si = load('si', 'tools/bohemia_ui_stat_icons.py')
# the card's own materials, in act one's faded palette beside UI's (rule 159)
si.M.update({
    'carrier':   ((44, 58, 96), 0.30, 0.10),    # a dead cop's carrier, navy nylon gone dull (a green one read as the sandbags)
    'carrierdk': ((30, 40, 70), 0.22, 0.10),
    'plate':     ((112, 120, 108), 0.55, 0.08),  # the plate's pocket, a grey-green
    'iron':      ((52, 48, 46), 0.55, 0.10),     # black cast iron (a lighter iron read as the shield's steel at 18 px)
    'ironrust':  ((128, 70, 38), 0.22, 0.14),   # a plate that has been hit before: rust (a steel one read as the anvil and the carrier)
    'paper':     ((236, 234, 226), 0.25, 0.08),   # a steel range target's paper man, painted white (buff paper read as the sandbags)
    'socket':    ((40, 30, 22), 0.05, 0.03),
    'copper':    ((184, 104, 60), 0.80, 0.05),
    'amber':     ((168, 122, 48), 0.65, 0.05),   # the fight's pip, #a87a30
    'spent':     ((60, 50, 40), 0.15, 0.06),
    'slab':      ((112, 104, 92), 0.15, 0.14),   # a paving slab, dust
    'slablit':   ((178, 138, 70), 0.30, 0.10),   # the reach's amber on the slab (the fight's #8a6c44 tile, lit)
    'man':       ((30, 24, 20), 0.10, 0.04),
    'plateface': ((136, 142, 146), 0.75, 0.08),
})
C, P, R, U, S, CUT, OFF, E, RING = si.circle, si.poly, si.rbox, si.union, si.smooth, si.cut, si.offset, si.ellipse, si.ring

def armour():
    # wide in the body and cut deep at the arms: a narrower carrier sat inside the fist's own outline at 18 px
    hw = 0.8
    body = R(0, 0.22, hw, 0.66, 0.16)
    body = CUT(body, E(0, -0.5, 0.3, 0.34))                                       # the neck
    body = CUT(body, U(E(-hw - 0.06, -0.12, 0.3, 0.42), E(hw + 0.06, -0.12, 0.3, 0.42)))   # the arms
    straps = U(R(-0.36, -0.58, 0.12, 0.26, 0.05), R(0.36, -0.58, 0.12, 0.26, 0.05))
    pocket = R(0, 0.06, 0.34, 0.3, 0.06)
    pouches = U(*[R(x, 0.64, 0.15, 0.14, 0.04) for x in (-0.42, 0.0, 0.42)])
    return [(body, 'carrier', 0.26, 0.2, 0.0), (straps, 'carrierdk', 0.16, 0.06, 0.18), (pocket, 'plate', 0.14, 0.08, 0.2),
            (pouches, 'carrierdk', 0.16, 0.08, 0.22)]

def vs_armour():
    plate = R(-0.16, 0.26, 0.56, 0.5, 0.08, rot=0.22)
    cracks = U(P([(-0.2, 0.2), (-0.62, -0.06), (-0.6, -0.0)]), P([(-0.2, 0.2), (0.1, 0.72), (0.04, 0.72)]),
               P([(-0.2, 0.2), (-0.5, 0.62), (-0.45, 0.66)]), P([(-0.2, 0.2), (0.3, 0.04), (0.3, 0.1)]))
    dent = C(-0.2, 0.2, 0.17)
    rivets = U(*[C(x, y, 0.06) for x, y in ((-0.6, -0.14), (0.2, 0.06), (-0.5, 0.62), (0.32, 0.72))])
    rivets = CUT(rivets, OFF(dent, -0.02))
    head = R(0.46, -0.5, 0.36, 0.2, 0.05, rot=-0.7)           # the sledge's head, about to land on the dent
    haft = R(0.66, -0.28, 0.07, 0.48, 0.03, rot=-0.7 + math.pi / 2 - 0.04)
    return [(CUT(plate, U(cracks, dent)), 'ironrust', 0.2, 0.12, 0.0), (dent, 'hole', 0.06, 0.04, 0.0), (cracks, 'hole', 0.05, 0.02, 0.0),
            (rivets, 'brass', 0.26, 0.06, 0.12), (haft, 'wood', 0.2, 0.06, 0.28), (head, 'iron', 0.34, 0.12, 0.32)]

def through_armour():
    plate = R(0.06, 0.02, 0.13, 0.84, 0.04)                  # a plate seen edge on, its face to the left
    face = R(-0.08, 0.02, 0.05, 0.8, 0.02)
    hole = E(0.06, -0.06, 0.18, 0.13)
    tail = P([(-0.92, -0.1), (-0.46, -0.07), (-0.46, -0.03), (-0.92, -0.0)])   # where it came from
    case = U(R(0.56, -0.06, 0.22, 0.08, 0.02), C(0.82, -0.06, 0.09))          # the round, out the other side
    spall = U(*[C(x, y, r) for x, y, r in ((0.32, -0.32, 0.05), (0.42, 0.18, 0.045), (0.3, 0.3, 0.035), (0.48, -0.42, 0.03))])
    return [(CUT(plate, hole), 'plateface', 0.3, 0.1, 0.0), (CUT(face, hole), 'steeldk', 0.36, 0.04, 0.0), (hole, 'hole', 0.04, 0.02, 0.0),
            (tail, 'streak', 0.12, 0.04, 0.34), (case, 'brass', 0.22, 0.08, 0.4), (spall, 'steel', 0.18, 0.04, 0.34)]

def weight():
    # an anvil: the heaviest thing anybody knows by its outline (a kettlebell, round and compact, read as the fist at 72 px)
    face = R(0.08, -0.34, 0.62, 0.13, 0.03)
    horn = P([(-0.54, -0.47), (-0.98, -0.36), (-0.54, -0.2)])
    waist = P([(-0.3, -0.21), (0.46, -0.21), (0.3, 0.38), (-0.16, 0.38)])
    foot = P([(-0.5, 0.38), (0.64, 0.38), (0.78, 0.72), (-0.64, 0.72)])
    rust = U(R(0.3, 0.55, 0.3, 0.1, 0.03), R(-0.3, 0.6, 0.18, 0.08, 0.03))
    return [(U(horn, waist, foot), 'iron', 0.34, 0.14, 0.0), (face, 'steeldk', 0.24, 0.05, 0.3), (rust, 'ironrust', 0.04, 0.02, 0.34)]

def two_hands():
    haft = R(0.0, 0.0, 0.92, 0.075, 0.05, rot=-0.62)
    def fist(cx, cy):
        rot = -0.62
        c, s = math.cos(rot), math.sin(rot)
        at = lambda u, v: (cx + u * c - v * s, cy + u * s + v * c)
        knuck = U(*[R(*at(u, -0.12), 0.07, 0.11, 0.06, rot=rot) for u in (-0.15, -0.05, 0.05, 0.15)])
        palm = R(*at(0, 0.03), 0.22, 0.14, 0.08, rot=rot)
        thumb = R(*at(0.02, 0.14), 0.16, 0.06, 0.05, rot=rot)
        wrist = R(*at(0, 0.27), 0.17, 0.09, 0.03, rot=rot)
        return [(palm, 'skin', 0.3, 0.18, 0.18), (knuck, 'skin', 0.24, 0.1, 0.26), (thumb, 'skin', 0.2, 0.08, 0.42), (wrist, 'tape', 0.22, 0.06, 0.12)]
    return [(haft, 'wood', 0.18, 0.07, 0.0)] + fist(-0.42, 0.24) + fist(0.34, -0.3)

def head():
    # a range target's paper man, the round through his head (a skull, round and compact, read as the fist and the shield)
    # a big head on a narrow chest, standing on its post: a wide low bust read as the sandbag wall at 18 px
    skull = C(0, -0.5, 0.34); neck = R(0, -0.1, 0.13, 0.12, 0.04)
    chest = CUT(E(0, 0.36, 0.6, 0.4), R(0, 0.96, 2, 0.2))
    post = R(0, 0.84, 0.07, 0.12, 0.02)
    hole = C(0.06, -0.54, 0.11)
    return [(CUT(U(skull, neck, chest), hole), 'paper', 0.2, 0.08, 0.0), (post, 'steeldk', 0.14, 0.04, 0.0), (hole, 'red', 0.06, 0.03, 0.0)]

def round_():
    case = R(0, 0.26, 0.42, 0.62, 0.06)
    rim = R(0, 0.86, 0.46, 0.06, 0.02)
    tip = U(E(0, -0.42, 0.4, 0.5), R(0, -0.36, 0.4, 0.06))
    return [(case, 'brass', 0.4, 0.3, 0.0), (rim, 'brass', 0.3, 0.06, 0.0), (CUT(tip, R(0, 0.2, 1, 0.5)), 'copper', 0.44, 0.34, 0.0)]

def pip(lit):
    return [(R(0, 0, 0.52, 0.86, 0.12), 'amber' if lit else 'spent', 0.3 if lit else 0.1, 0.2, 0.0)]

def tile(kind):
    slab = R(0, 0.04, 0.82, 0.78, 0.08)
    parts = [(slab, 'slablit' if kind == 'lit' else 'slab', 0.22, 0.1, 0.0)]
    if kind == 'you':   # his own slab: a small dark man standing on it
        man = U(C(0, -0.42, 0.18), R(0, 0.08, 0.2, 0.34, 0.1))
        parts.append((man, 'man', 0.4, 0.12, 0.22))
    return parts

# name, label, parts, the art's size (w, h): one art pixel to one phone pixel where it is shown on the card
ICONS = [
    ('armour', 'ARMOUR', armour, (72, 72)), ('vs_armour', 'VS ARMOUR', vs_armour, (72, 72)),
    ('through_armour', 'THROUGH ARMOUR', through_armour, (72, 72)), ('weight', 'WEIGHT', weight, (72, 72)),
    ('two_hands', 'TWO HANDS', two_hands, (72, 72)), ('head', 'HEAD', head, (72, 72)),
    ('round', 'A ROUND', round_, (24, 48)), ('pip', 'ACTION', lambda: pip(True), (24, 36)), ('pip_off', 'SPENT', lambda: pip(False), (24, 36)),
    ('tile', 'OUT OF REACH', lambda: tile('dark'), (36, 36)), ('tile_lit', 'IN REACH', lambda: tile('lit'), (36, 36)), ('tile_you', 'HE STANDS', lambda: tile('you'), (36, 36)),
]
BIG = [k for k, _, _, wh in ICONS if wh == (72, 72)]

def draw(i, fn, wh):
    """UI's render() is square at si.N; a tall piece is drawn square at its height and its middle cut out (the margins it
    leaves are transparent, the outline and the shadow inside them)."""
    w, h = wh; n = max(w, h)
    keep = si.N
    try:
        si.N = n
        im = si.render(fn(), 2000 + i)
    finally:
        si.N = keep
    if w != h:
        x0 = (n - w) // 2; im = im.crop((x0, 0, x0 + w, h))
    return im

def all_icons():
    ims = {k: draw(i, fn, wh) for i, (k, _, fn, wh) in enumerate(ICONS)}
    # the spent pip is the lit one's ghost: a third of its ink, so nine in a row read as how many are left at a glance
    a = np.asarray(ims['pip_off']).copy(); a[..., 3] = (a[..., 3].astype(float) * 0.35).astype(np.uint8); ims['pip_off'] = Image.fromarray(a, 'RGBA')
    return ims

def sheet(ims):
    nine = [('hp', 'HITPOINTS'), ('fatigue', 'FATIGUE'), ('resolve', 'RESOLVE'), ('initiative', 'INITIATIVE'), ('melee_skill', 'MELEE'),
            ('ranged_skill', 'RANGED'), ('melee_defense', 'MELEE DEF'), ('ranged_defense', 'RANGED DEF'), ('damage', 'DAMAGE')]
    old = [(k, n, Image.open(os.path.join(OUT, k + '.png')).convert('RGBA')) for k, n in nine]
    new = [(k, n, ims[k]) for k, n, _, _ in ICONS]
    W, H = max(len(old), len(new)) * 120 + 40, 560
    sh = Image.new('RGBA', (W, H), (24, 18, 13, 255)); dr = ImageDraw.Draw(sh)
    try: font = ImageFont.truetype(os.path.join(ROOT, 'slices', 'fonts', 'BohemiaCasing-Regular.ttf'), 13)
    except Exception: font = ImageFont.load_default()
    dr.text((20, 8), "THE ITEM CARD'S PICTURES (UI THREE, 11/7): UI'S RENDERER, THE KIT'S ONE SUN. TOP: THE NINE THEY STAND BESIDE. BOTTOM: THE NEW ONES, 1:1 AND 3X", fill=(226, 189, 106), font=font)
    for row, tiles in ((0, old), (1, new)):
        y = 34 + row * 260
        for i, (k, name, t) in enumerate(tiles):
            x = 20 + i * 120
            sh.alpha_composite(t, (x + (72 - t.width) // 2, y))
            big = t.resize((t.width * 3 if t.width < 72 else 108, t.height * 3 if t.width < 72 else 108), Image.NEAREST)
            if big.height > 150: big = big.resize((int(big.width * 150 / big.height), 150), Image.NEAREST)
            sh.alpha_composite(big, (x, y + 80))
            dr.text((x, y + 236), name, fill=(239, 227, 200), font=font)
    sh.save(SHEET)

def check():
    good = True
    ims = all_icons()
    for k, _, _, wh in ICONS:
        p = os.path.join(OUT, k + '.png')
        same = os.path.exists(p) and np.array_equal(np.asarray(ims[k]), np.asarray(Image.open(p).convert('RGBA')))
        good &= same
        if not same: print('  FAIL slices/stat_icons/%s.png is not the tool\'s' % k)
    print(('  ok   ' if good else '  FAIL ') + 'every picture of the card (%d) is the tool\'s, byte for byte' % len(ICONS))
    g = load('glance', 'gates/the_stat_icons_read_at_a_glance_gate.py')
    nine = g.ICONS + ['damage']
    g.ICONS = nine + BIG
    icons = {k: Image.open(os.path.join(OUT, k + '.png')).convert('RGBA') for k in g.ICONS}
    bad, worst, wrong = g.measure(icons)
    mine = [b for b in bad if any(k in b for k in BIG)]; mw = [w for w in wrong if any(k in w for k in BIG)]
    print(('  ok   ' if not mine else '  FAIL ') + 'no picture of the card is alike with any of the nine or each other at 72, 54 or 18 px (UI\'s look-alike measure)'
          + (' [' + '; '.join(mine[:4]) + ']' if mine else ' [nearest of all: %.3f %s]' % worst))
    print(('  ok   ' if not mw else '  FAIL ') + 'a stranger names each, and nothing is named one of them, from the picture alone (%d glances each)' % g.GLANCES
          + (' [' + '; '.join(mw[:4]) + ']' if mw else ''))
    return good and not mine and not mw

if __name__ == '__main__':
    if '--check' in sys.argv:
        sys.exit(0 if check() else 1)
    ims = all_icons()
    for k, im in ims.items(): im.save(os.path.join(OUT, k + '.png'))
    sheet(ims)
    print('wrote %d pictures to slices/stat_icons/ and %s' % (len(ims), os.path.relpath(SHEET, ROOT)))
