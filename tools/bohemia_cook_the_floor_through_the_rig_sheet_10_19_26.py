#!/usr/bin/env python3
"""COOK [the floor through the rig] (10/19): the VOTE sheet, laid for his phone (1,170 px wide, the glass's own width).
Reads the photographs tools/bohemia_cook_the_floor_through_the_rig_shot_10_19_26.js took of the REAL fight (the same board,
the same seed, the same men, as it ships and with the 3D floor answered in) and lays them old | new: the opening frame
at half size and the close stop at the phone's own pixels; then one block's new floor at 1:1 beside the same window as it
ships. Nothing is drawn: crops of those pictures, labelled. COOK TWO's sheet's layout (tools/bohemia_cook2_the_fight_
floor_sheet_10_19_26.py), its words changed.
  python3 tools/bohemia_cook_the_floor_through_the_rig_sheet_10_19_26.py <shots dir> <boards>
  -> records/target/COOK_THE_FLOOR_THROUGH_THE_RIG.webp

REUSE CHECK (REUSE-FIRST, 7/22): it makes no art; it crops the fight's own photographs and the blocks onto one sheet, in
COOK TWO's layout.
TASTE CHECK: shown from the game's camera (his second votes), old beside new on the real fight board (the row's end
state), one question; the words at eighth-grade reading (his 8/24).
REFERENCE CHECK (the 9/4 standing duty): the compare law, the style guide's caption fields (rule 114c), AH-01 and AH-03.
No reference game.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SH = sys.argv[1] if len(sys.argv) > 1 else os.path.join(R, 'records/target/cook_floor_rig/shots')
BOARDS = (sys.argv[2] if len(sys.argv) > 2 else 'suburb,culdesac,strip,desert,ruin').split(',')
OUT_DIR = os.path.join(R, 'records/target/cook_floor_rig')
NAMES = {'suburb': 'THE SUBURB', 'culdesac': 'THE CUL-DE-SAC', 'strip': 'THE STRIP MALL', 'desert': 'THE OPEN DESERT AND THE WASH',
         'ruin': 'THE RUINED BLOCK', 'freeway': 'THE FREEWAY'}
W, PAD, BG = 1170, 18, (14, 13, 12)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f_title, f_head, f_body, f_small = ImageFont.truetype(FB, 46), ImageFont.truetype(FB, 34), ImageFont.truetype(FR, 28), ImageFont.truetype(FR, 22)
OPEN = (0, 150, 1170, 2160)
shot = lambda b, f, z: Image.open(os.path.join(SH, '%s_%s_%s.png' % (b, f, z))).convert('RGB')


def wrap(d, text, font, width):
    out, line = [], ''
    for w in text.split(' '):
        t = (line + ' ' + w).strip()
        if d.textlength(t, font=font) > width: out.append(line); line = w
        else: line = t
    return out + [line]


def pair(a, b, gap=PAD):
    im = Image.new('RGB', (a.width + gap + b.width, max(a.height, b.height)), BG); im.paste(a, (0, 0)); im.paste(b, (a.width + gap, 0)); return im


def tag(im, text):
    d = ImageDraw.Draw(im)
    d.text((12, 7), text, font=f_head, fill=(240, 226, 196), stroke_width=4, stroke_fill=(14, 13, 12)); return im


blocks = [('title', 'THE FIGHT FLOOR, MODELLED IN 3D LIKE THE ROBOT AND THE TRUCK'),
          ('text', 'You said no to the fight floor twice. Now the ground is built in 3D and lit by the same lamp and camera as the '
                   'robot, the truck and the people: a real curb 15 cm tall, sidewalk slabs that heave, cracked asphalt with '
                   'potholes and sand in the gutter, and real stones lying on the dirt. These are real fights from the game on '
                   'your phone, the same board and men. LEFT is now, RIGHT is the 3D floor. On the suburb blocks the orange '
                   'houses are gone and 3D ranch houses stand in their place, in the same light. The cover the fight draws on top '
                   '(the shed, the cars, the walls) is still the old pictures here; their 3D versions are on the accessories cards.')]
mid = (W - PAD) // 2
for b in BOARDS:
    if not os.path.exists(os.path.join(SH, '%s_old_open.png' % b)): continue
    blocks.append(('head', NAMES.get(b, b.upper())))
    o, n = shot(b, 'old', 'open').crop(OPEN), shot(b, 'new', 'open').crop(OPEN)
    o, n = [im.resize((mid, im.height * mid // im.width), Image.LANCZOS) for im in (o, n)]
    blocks.append(('img', pair(tag(o, 'NOW'), tag(n, 'NEW'))))
    oc, nc = shot(b, 'old', 'close'), shot(b, 'new', 'close')
    ch = (np.asarray(oc).astype(int) != np.asarray(nc).astype(int)).any(2)
    best, box = 9, None
    for y0 in range(OPEN[1], 1900 - 660, 40):
        for x0 in range(0, oc.width - mid + 1, 40):
            s = abs(ch[y0:y0 + 660, x0:x0 + mid].mean() - 0.66)
            if s < best: best, box = s, (x0, y0, x0 + mid, y0 + 660)
    blocks.append(('small', 'Close in, at your phone\'s own pixels (one art pixel is one screen pixel): now | new.'))
    blocks.append(('img', pair(oc.crop(box), nc.crop(box))))
# one block at 1:1, the curb and the slabs where they meet the road
for bid, win in (('corner_1', (1130, 680, 1130 + mid, 680 + 520)),):
    f = os.path.join(OUT_DIR, 'block_%s.webp' % bid)
    if os.path.exists(f):
        a = Image.open(os.path.join(R, 'slices/fight_ground/block_%s.webp' % bid)).convert('RGB').crop(win)
        b = Image.open(f).convert('RGB').crop(win)
        blocks.append(('head', 'THE CORNER, ONE ART PIXEL TO ONE PIXEL'))
        blocks.append(('small', 'The block picture itself, the crossing at the middle of the suburb: as it ships | in 3D. The curb has a lit lip '
                                'and a shadow side, the joints are cut, the gutter holds sand and gravel.'))
        blocks.append(('img', pair(tag(a, 'NOW'), tag(b, 'NEW'))))
blocks.append(('q', 'ONE QUESTION: is this the floor? (YES, or NO and what is wrong)'))
blocks.append(('cap', 'PIXEL SIZE the fight\'s own: a house tile 515 x 364, 42.9 px a metre, the rig\'s 45 degree camera (depth x cos45, heights '
                      'x 1.414), one art pixel to one device pixel at the close stop | PALETTE records/target/BOHEMIA_STYLE_PALETTE.json (rubber, '
                      'tape grey, clay bone, tape masking, metal painted, clay rust), each base calibrated to his YES street '
                      '(records/target/cook_floor_rig/ground_calibration.json) | LIGHT the rig\'s one sun, upper left, 155 deg on the screen '
                      '(records/target/cook_floor_rig/calibration/calibration.json); the old houses keep their maker\'s shadows'))

d0 = ImageDraw.Draw(Image.new('RGB', (10, 10)))
FONT = {'title': f_title, 'head': f_head, 'text': f_body, 'small': f_small, 'q': f_head, 'cap': f_small}
def height(k, v):
    if k == 'img': return v.height + PAD
    return len(wrap(d0, v, FONT[k], W - 2 * PAD)) * int(FONT[k].size * 1.3) + PAD
H = PAD + sum(height(k, v) for k, v in blocks)
sheet = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sheet); y = PAD
for k, v in blocks:
    if k == 'img':
        sheet.paste(v, (PAD if v.width < W else 0, y)); y += v.height + PAD; continue
    col = {'title': (240, 226, 196), 'head': (226, 170, 96), 'text': (226, 222, 214), 'small': (190, 186, 178), 'q': (240, 200, 120), 'cap': (170, 190, 220)}[k]
    for l in wrap(d, v, FONT[k], W - 2 * PAD):
        d.text((PAD, y), l, font=FONT[k], fill=col); y += int(FONT[k].size * 1.3)
    y += PAD
out = os.path.join(R, 'records/target/COOK_THE_FLOOR_THROUGH_THE_RIG.webp')
sheet.save(out, quality=84, method=6)
print(out, sheet.size, os.path.getsize(out))
