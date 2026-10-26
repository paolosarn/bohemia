#!/usr/bin/env python3
"""THE DAMAGE ICON (UI THREE, row [a damage icon], 10/26/26; VAMILY rule 275(b), Paolo 10/26: 'damage doesn't have its own
icon, you should make that too, in the shop and everywhere').

Damage gets its own picture the way the eight stats have theirs (rule 224: a lone number becomes a picture first), drawn by
UI's own renderer (tools/bohemia_ui_stat_icons.py render(): a solid with a height, bevelled round, lit by the kit's one sun,
shaded per pixel, outlined in the receipt's ink, dropped on a hard shadow; never a flat drawing, never a CSS gradient). This
file adds the ninth without touching UI's tool or its eight files:

  damage   DAMAGE   a hit: a bullet hole and the blood flung out of it, most of the spray where the round went on, dark and wet

Battle Brothers draws a weapon's damage with its own small picture beside the numbers on the tooltip; in a gun world a hit is
a hole and what comes out of it. The shape is the only spiky one of the nine (the heart is round, the bolt a zigzag), and the
red is the dark of old blood, not the heart's enamel, so the two reds never read as one.

Writes slices/stat_icons/damage.png (72 x 72, 24 points on his phone) and records/target/UI_THREE_THE_DAMAGE_ICON_10_26_26.png
(the nine side by side at 1:1 and at 3x). Seeded: the same file every run.
  python3 tools/bohemia_ui_three_damage_icon.py           # draw it
  python3 tools/bohemia_ui_three_damage_icon.py --check   # exit 1 unless the file is the tool's, and no pair of the NINE is
                                                          # alike (UI's look-alike gate's own measure, with damage added)
"""
import os, sys, math, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'slices', 'stat_icons', 'damage.png')
SHEET = os.path.join(ROOT, 'records', 'target', 'UI_THREE_THE_DAMAGE_ICON_10_26_26.png')
SEED = 1008   # the ninth after UI's eight (1000 + 0..7)

def load(name, rel):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, rel))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

si = load('si', 'tools/bohemia_ui_stat_icons.py')
si.M['blood'] = ((124, 20, 18), 0.62, 0.05)   # old blood, wet: a hard shine, little grain

def damage():
    core = si.union(si.circle(-0.12, 0.12, 0.31), si.circle(-0.28, 0.0, 0.2), si.circle(0.04, 0.26, 0.2))
    spikes, drops = [], []
    # the spray flung out of the wound, most of it up and to the right where the round went on: uneven streaks, a drop
    # where the throw ran out on some of them only (angles in screen degrees, y down; x, y the wound's centre)
    cx, cy = -0.12, 0.12
    for deg, L, w, r in ((-62, 0.92, 0.13, 0.10), (-34, 1.0, 0.10, 0.0), (-10, 0.86, 0.12, 0.08), (-82, 0.66, 0.09, 0.0),
                         (18, 0.62, 0.10, 0.0), (150, 0.42, 0.10, 0.07), (205, 0.46, 0.09, 0.0), (100, 0.40, 0.09, 0.06)):
        a = math.radians(deg); c, s = math.cos(a), math.sin(a)
        px, py = -s, c
        spikes.append(si.poly([(cx + px * w, cy + py * w), (cx + c * L, cy + s * L), (cx - px * w, cy - py * w)]))
        if r: drops.append(si.circle(cx + c * (L + 0.03), cy + s * (L + 0.03), r))
    splash = si.smooth(core, si.union(*spikes), 0.11)
    splash = si.union(splash, *drops, si.circle(0.74, -0.42, 0.07), si.circle(0.56, -0.74, 0.05), si.circle(0.82, -0.1, 0.045))
    hole = si.circle(-0.12, 0.12, 0.12)
    return [(si.cut(splash, hole), 'blood', 0.22, 0.2, 0.0), (hole, 'hole', 0.04, 0.02, 0.0)]

def draw():
    return si.render(damage(), SEED)

def sheet(im):
    tiles = [(k, n, Image.open(os.path.join(ROOT, 'slices', 'stat_icons', k + '.png')).convert('RGBA')) for k, n, _ in si.ICONS]
    tiles.append(('damage', 'DAMAGE', im))
    W, H = len(tiles) * 150 + 40, 320
    sh = Image.new('RGBA', (W, H), (24, 18, 13, 255)); dr = ImageDraw.Draw(sh)
    try: font = ImageFont.truetype(os.path.join(ROOT, 'slices', 'fonts', 'BohemiaCasing-Regular.ttf'), 14)
    except Exception: font = ImageFont.load_default()
    dr.text((20, 10), "THE DAMAGE ICON (UI THREE, 10/26): THE NINTH, UI'S OWN RENDERER, THE KIT'S ONE SUN; 72 PX = 24 POINTS, 1:1 AND 3X", fill=(226, 189, 106), font=font)
    for i, (k, name, t) in enumerate(tiles):
        x = 20 + i * 150
        sh.alpha_composite(t, (x + 39, 40)); sh.alpha_composite(t.resize((144, 144), Image.NEAREST), (x, 130))
        dr.text((x, 290), name, fill=(239, 227, 200), font=font)
    sh.save(SHEET)

def check():
    im = draw()
    here = Image.open(OUT).convert('RGBA')
    same = np.array_equal(np.asarray(im), np.asarray(here))
    print(('  ok   ' if same else '  FAIL ') + 'slices/stat_icons/damage.png is the tool\'s, byte for byte')
    g = load('glance', 'gates/the_stat_icons_read_at_a_glance_gate.py')
    nine = g.ICONS + ['damage']
    g.ICONS = nine
    icons = {k: Image.open(os.path.join(ROOT, 'slices', 'stat_icons', k + '.png')).convert('RGBA') for k in nine}
    bad, worst, wrong = g.measure(icons)
    mine = [b for b in bad if 'damage' in b]; mw = [w for w in wrong if 'damage' in w]
    print(('  ok   ' if not mine else '  FAIL ') + 'no icon of the nine is alike with damage at 72, 54 or 18 px (UI\'s look-alike measure)' + (' [' + '; '.join(mine[:3]) + ']' if mine else ' [nearest of all: %.3f %s]' % worst))
    print(('  ok   ' if not mw else '  FAIL ') + 'a stranger names damage, and nothing is named damage, from the picture alone (%d glances each)' % g.GLANCES + (' [' + '; '.join(mw[:3]) + ']' if mw else ''))
    return same and not mine and not mw

if __name__ == '__main__':
    if '--check' in sys.argv:
        sys.exit(0 if check() else 1)
    im = draw(); im.save(OUT); sheet(im)
    print('wrote slices/stat_icons/damage.png and ' + os.path.relpath(SHEET, ROOT))
