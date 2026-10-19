#!/usr/bin/env python3
"""COOK TWO [the fight floor he hates] (10/19): the VOTE sheet, laid for his phone (1,170 px wide, the glass's own width).
Reads the photographs tools/bohemia_cook2_the_fight_floor_shot_10_19_26.js took of the REAL fight (the same board, the same
seed, the same men, as it ships and with the floor re-laid) and lays them old | new, the opening frame at half size and
the close stop at the phone's own pixels, with the twin (his soil as bought and the ground he said YES to). Nothing is
drawn: crops of those pictures and of his tiles, labelled.
  python3 tools/bohemia_cook2_the_fight_floor_sheet_10_19_26.py <shots dir> <boards>
  -> records/target/COOK2_THE_FIGHT_FLOOR.webp

REUSE CHECK (REUSE-FIRST, 7/22): it makes no art; it crops the fight's own photographs, the kit's grounds and his tiles
(through the stretch-the-pack module) onto one sheet.

TASTE CHECK: shown from the game's camera (his second votes), old beside new on the real fight board (the row's end
state), one question, the twin beside it (82); the words at eighth-grade reading (his 8/24).

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set), the style guide's caption fields (rule 114c), AH-01 and AH-03. No reference game.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S

SH = sys.argv[1] if len(sys.argv) > 1 else os.path.join(R, 'records/target/cook2_fight_floor/shots')
BOARDS = (sys.argv[2] if len(sys.argv) > 2 else 'suburb,culdesac,strip,desert,ruin').split(',')
KIT = os.path.join(R, 'records/target/cook2_fight_floor')
NAMES = {'suburb': 'THE SUBURB', 'culdesac': 'THE CUL-DE-SAC', 'strip': 'THE STRIP MALL', 'desert': 'THE OPEN DESERT AND THE WASH',
         'ruin': 'THE RUINED BLOCK', 'freeway': 'THE FREEWAY', 'shore': 'THE SHORE', 'landfill': 'THE LANDFILL'}
W, PAD, BG = 1170, 18, (14, 13, 12)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f_title, f_head, f_body, f_small = ImageFont.truetype(FB, 46), ImageFont.truetype(FB, 34), ImageFont.truetype(FR, 28), ImageFont.truetype(FR, 22)
OPEN = (0, 150, 1170, 2160)          # the board between the crew bar and the bottom bar, the whole glass's width
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


blocks = []                                                       # (kind, payload)
blocks.append(('title', 'THE FIGHT FLOOR, REDONE FROM THE GROUND YOU SAID YES TO'))
blocks.append(('text', 'You hate the fight floor. These are real fights from the game, the same board, the same seed, the same men, '
               'on your phone. LEFT is the floor now. RIGHT is the new floor: the dirt, the sidewalk slab and the road of the street '
               'you said yes to. The camouflage blobs and the orange are gone. Houses, roads and cover did not move.'))
mid = (W - PAD) // 2
for b in BOARDS:
    if not os.path.exists(os.path.join(SH, '%s_old_open.png' % b)): continue
    blocks.append(('head', NAMES.get(b, b.upper())))
    o, n = shot(b, 'old', 'open').crop(OPEN), shot(b, 'new', 'open').crop(OPEN)
    o, n = [im.resize((mid, im.height * mid // im.width), Image.LANCZOS) for im in (o, n)]
    blocks.append(('img', pair(tag(o, 'NOW'), tag(n, 'NEW'))))
    oc, nc = shot(b, 'old', 'close'), shot(b, 'new', 'close')
    # the close crop goes where the floor is: the window (inside the board, clear of both bars) whose share of changed
    # pixels is nearest two thirds, so the new ground fills it and a house or a man still gives the scale
    ch = (np.asarray(oc).astype(int) != np.asarray(nc).astype(int)).any(2)
    best, box = 9, None
    for y0 in range(OPEN[1], 1900 - 660, 40):                 # clear of the hint card over the board's foot
        for x0 in range(0, oc.width - mid + 1, 40):
            s = abs(ch[y0:y0 + 660, x0:x0 + mid].mean() - 0.66)
            if s < best: best, box = s, (x0, y0, x0 + mid, y0 + 660)
    oc, nc = oc.crop(box), nc.crop(box)
    blocks.append(('small', 'Close in, at your phone\'s own pixels (one art pixel is one screen pixel): now | new.'))
    blocks.append(('img', pair(oc, nc)))
# the twin: his soil as bought | his soil in the valley's tan (the YES street's dirt) | his slab | his road, each one tile at 2x
tw = []
for fam, i, tint in (('2. Soil and dirt tiles', 2, None), ('2. Soil and dirt tiles', 2, '#9a8e78'), (S.SIDEWALK, 0, None), (S.ROAD, 0, None)):
    a = S.pack(fam, i)
    if tint: a = S.recolour(a, a[..., 3] > 0, tint, levels=6, shift_deg=10)
    im = Image.fromarray(a).convert('RGB'); tw.append(im.resize((im.width * 2, im.height * 2), Image.NEAREST))
row = Image.new('RGB', (W - 2 * PAD, max(t.height for t in tw)), BG); x = 0
for t in tw: row.paste(t, (x, 0)); x += t.width + PAD
blocks.append(('head', 'WHERE IT COMES FROM'))
blocks.append(('text', 'Your own tiles at 2x: your soil as you bought it | the same soil in the valley\'s grey tan (the dirt of the '
               'street you said yes to) | your sidewalk slab | your road. One soil per ground, no second soil laid through it.'))
blocks.append(('img', row))
blocks.append(('q', 'ONE QUESTION: is this a floor you can fight on?'))
blocks.append(('cap', 'PIXEL SIZE the fight\'s own, one art pixel to one device pixel at the close stop (a house tile 515 x 364, 42.9 px a metre, '
               'depth x cos45), his tiles at their own pixel | PALETTE records/target/cook2_fight_floor/COOK2_FIGHT_FLOOR_KIT.json (his soil '
               '#2, #21, #22 shade to shade onto the valley\'s tans, his slab and road as bought; 0 colours drawn) | LIGHT the board\'s '
               'own: every shadow its maker cast, darkened by the same amount, the hue walking cool into shadow (style guide field 4)'))

d0 = ImageDraw.Draw(Image.new('RGB', (10, 10)))
def height(k, v):
    if k == 'img': return v.height + PAD
    font = {'title': f_title, 'head': f_head, 'text': f_body, 'small': f_small, 'q': f_head, 'cap': f_small}[k]
    return len(wrap(d0, v, font, W - 2 * PAD)) * int(font.size * 1.3) + PAD
H = PAD + sum(height(k, v) for k, v in blocks)
sheet = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sheet); y = PAD
for k, v in blocks:
    if k == 'img':
        sheet.paste(v, (PAD if v.width < W else 0, y)); y += v.height + PAD; continue
    font = {'title': f_title, 'head': f_head, 'text': f_body, 'small': f_small, 'q': f_head, 'cap': f_small}[k]
    col = {'title': (240, 226, 196), 'head': (226, 170, 96), 'text': (226, 222, 214), 'small': (190, 186, 178), 'q': (240, 200, 120), 'cap': (170, 190, 220)}[k]
    for l in wrap(d, v, font, W - 2 * PAD):
        d.text((PAD, y), l, font=font, fill=col); y += int(font.size * 1.3)
    y += PAD
out = os.path.join(R, 'records/target/COOK2_THE_FIGHT_FLOOR.webp')
sheet.save(out, quality=84, method=6)
print(out, sheet.size, os.path.getsize(out))
