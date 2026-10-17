#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the master rig]: the proof sheet. Everything tools/bohemia_direction_master_rig.py rendered for
one model at one art pixel to one: the eight facings, every clip as a strip per facing (the drawn keys only), and the
portrait heads, beside the twin that is on disk: a 1.72 m man as a 98 px ruler (CHARACTER's measurement), his own car
for a vehicle, and the game's own dire wolf (engine/bohemia_quadruped.js, ANIMATION [four legs], the placeholder a
beast replaces) for a beast. So the true-size question and the beat question are on the page, not in a sentence.

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index, the card of numbers,
skills/bohemia-pixel-art, AH-01, AH-03. No reference game.

usage: python3 tools/bohemia_direction_master_rig_sheet.py <rig out dir> <sheet.png> [--wolf <dir of wolf_*.png>] [--car]
"""
import os, sys, json, glob
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D, OUT = sys.argv[1], sys.argv[2]
WOLF = sys.argv[sys.argv.index('--wolf') + 1] if '--wolf' in sys.argv else None
CAR = '--car' in sys.argv
meta = json.load(open(os.path.join(D, 'rig.json')))
F = ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf'), 16)
INK, DIM, ORANGE, GREEN, BG = (236, 230, 218), (146, 138, 126), (226, 162, 72), (150, 190, 160), (22, 21, 20)
op = lambda f: Image.open(os.path.join(ROOT, f)).convert('RGBA')
MAN = 98

rows = []   # (title, [(label, image)])
rows.append(('THE EIGHT FACINGS, STILL (frame %s)' % meta.get('still_frame', 0), [(f, op(fn)) for f, fn in zip(meta['facings'], meta['files'])]))
for name, c in meta.get('clips', {}).items():
    per = c['keys']
    for f in ('SE', 'S', 'E'):
        i = meta['facings'].index(f)
        rows.append(('CLIP %s, %s: %d DRAWN KEYS = %g BEATS AT 120 (nothing between two keys is rendered)' % (name.upper(), f, per, c['beats']),
                     [('k%d' % j, op(fn)) for j, fn in enumerate(c['files'][i * per:(i + 1) * per])]))
port = None
if meta.get('portrait'):
    port = json.load(open(os.path.join(D, meta['portrait'])))
    rows.append(('THE SAME MODEL\'S HEAD AT %d PX (ONE ID, ONE WHOLE PERSON): S, SE, SW, camera tilt %g' % (port['head_px'], port['camera']['tilt_deg']),
                 [(f, op(fn)) for f, fn in zip(port['facings'], port['files'])]))
twins = []
if WOLF:
    for clip, n in (('walk', 6), ('idle', 12)):
        ims = [Image.open(f).convert('RGBA') for f in sorted(glob.glob(os.path.join(WOLF, 'wolf_%s_SE_k*.png' % clip)))]
        if ims: twins.append(('THE GAME\'S OWN DIRE WOLF TODAY, SE, %s, %d keys at 112 (the placeholder this replaces)' % (clip, len(ims)), [('k%d' % j, im) for j, im in enumerate(ims)]))
if CAR: twins.append(('HIS CAR (the twin, 10. Abandoned cars #3, drawn 96 px long)', [('his car', op('reference/art_bank/prop/pack_10_abandoned_cars_003.png'))]))

GAP, PAD, HEAD = 10, 14, 26
def row_size(items): return sum(im.width for _, im in items) + GAP * (len(items) + 1), max(im.height for _, im in items) + HEAD + 22
allrows = rows + twins
W = max(row_size(it)[0] for _, it in allrows) + PAD * 2 + 70
H = 70 + sum(row_size(it)[1] + 12 for _, it in allrows)
s = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(s)
d.text((PAD, 6), 'THE MASTER RIG, ROUND TWO: ONE CAMERA (tilt 45, never turned), %g PX A METRE, HEIGHT x%s, EIGHT FACINGS, THE MODEL MOVES, 1:1' % (meta['ppm'], meta.get('z_stretch', 1)), font=F, fill=INK)
d.text((PAD, 26), 'model %s, real %s m, %d colours, palette %s; the green bar is a 1.72 m man at %d px (the ruler)' % (os.path.basename(meta['model']), meta['real_dims_m'], meta.get('colours', 0), meta.get('family_palette'), MAN), font=F, fill=DIM)
y = 56
for title, items in allrows:
    rw, rh = row_size(items); base = y + rh - 22
    d.text((PAD, y + 4), title, font=F, fill=ORANGE if (title, items) in rows else GREEN)
    x = PAD + GAP
    for label, im in items:
        s.paste(im, (x, base - im.height), im); d.text((x, base + 2), label, font=F, fill=DIM); x += im.width + GAP
    if title.startswith('THE EIGHT'):
        d.rectangle([x + 10, base - MAN, x + 16, base], fill=GREEN); d.text((x, base + 2), '1.72 m', font=F, fill=GREEN)
    y += rh + 12
s.save(OUT); print(OUT, s.size)
