#!/usr/bin/env python3
"""COOK TWO [the curb on the map] (10/18): the VOTE sheet. Reads the kit (tools/bohemia_cook2_the_curb_on_the_map_10_18_26.py)
and the three photographs of the committed demo from the map's own camera (tools/bohemia_cook2_the_curb_on_the_map_shot_10_18_26.js:
BEFORE as it ships, REGISTERED with every block picture on its own block, AFTER with the kit laid) and lays them on one
sheet with the twin (his slab, whose dark bottom band is a curb face, and the curb he voted up). Nothing is drawn: the
sheet is crops of those pictures, labelled.
  python3 tools/bohemia_cook2_the_curb_on_the_map_sheet_10_18_26.py  ->  records/target/COOK2_THE_CURB_ON_THE_MAP.webp

REUSE CHECK (REUSE-FIRST, 7/22): it makes no art; it crops the kit, the demo's own photographs and his slab (from the
approved set through the stretch-the-pack module) onto one sheet.

TASTE CHECK: the sheet shows the map from the game's camera (his second votes: show it from the game's camera), one
question, the twin beside it (82).

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set), the style guide's light and caption fields (rule 114c), AH-01 and AH-03. The
twin on the sheet is his own slab and the curb he voted up. No reference game.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook2_stretch_the_pack as S

K = os.path.join(R, 'records/target/cook2_map_curb'); SH = os.path.join(K, 'shots')
kit = json.load(open(os.path.join(K, 'COOK2_MAP_CURB_KIT.json')))
shots = json.load(open(os.path.join(SH, 'shots.json')))
shot = lambda z, m: Image.open(os.path.join(SH, '%s_%s.png' % (z, m))).convert('RGB')
TAN = (150, 140, 118)
def on_tan(p):
    a = Image.open(p).convert('RGBA'); bg = Image.new('RGBA', a.size, TAN + (255,)); bg.alpha_composite(a); return bg.convert('RGB')

W = 1840; PAD = 20
rows = []                                                         # (label, image) stacked
MAP = (0, 150, 1170, 2330)                                        # the phone's map, under the top bar, over the speed buttons
def triple(z, scale):
    ims = [shot(z, m).crop(MAP) for m in ('before', 'registered', 'after')]
    ims = [im.resize((im.width // scale, im.height // scale), Image.LANCZOS) for im in ims]
    out = Image.new('RGB', (sum(i.width for i in ims) + PAD * 2, ims[0].height), (14, 14, 14))
    x = 0
    for im in ims:
        out.paste(im, (x, 0)); x += im.width + PAD
    return out
t = shots
rows.append(('THE NEAR STOP (a block 256 px; on the phone, half size here). LEFT: the map as it ships. MIDDLE: every block picture drawn '
             'on its own block (RUN\'s fix, below). RIGHT: the middle with the kit laid: the arterial is his asphalt, his yellow line, '
             'and a curb where it meets a block (%d pieces; paint %d ms, was %d).'
             % (t['near_after']['pieces'], t['near_after']['ms'], t['near_before']['ms']), triple('near', 2)))
# 1:1 at the near stop, the same crop before and after, and the curb enlarged
CROP = (0, 1150, 840, 1730)                                       # the arterial by the church and the party
b, a = shot('near', 'before').crop(CROP), shot('near', 'after').crop(CROP)
pair = Image.new('RGB', (b.width * 2 + PAD, b.height), (14, 14, 14)); pair.paste(b, (0, 0)); pair.paste(a, (b.width + PAD, 0))
rows.append(('THE SAME CORNER AT THE PHONE\'S OWN PIXELS (1:1): before | after. The curb stands up off the road on every block edge: '
             'his lit lip, his slab\'s own face under it, the shadow on the road where the sun (the style guide\'s, from the left) is '
             'behind the curb.', pair))
ZOOM = (300, 1330, 480, 1420)                                     # the curb under the party's block, 4x
zb, za = [shot('near', m).crop(ZOOM) for m in ('before', 'after')]
zb, za = [im.resize((im.width * 4, im.height * 4), Image.NEAREST) for im in (zb, za)]
zz = Image.new('RGB', (zb.width * 2 + PAD, zb.height), (14, 14, 14)); zz.paste(zb, (0, 0)); zz.paste(za, (zb.width + PAD, 0))
rows.append(('THE CURB, 4x (the edge of the block the party stands on): before | after. Top to bottom on the right: the block, his '
             'slab\'s lit lip, the curb face (his slab\'s own south face rows), the road.', zz))
rows.append(('ONE STEP OUT (a block 128 px, half size here): before | registered | after.', triple('step', 2)))
# the kit at its own pixel: four BLOCK pieces and the laid grid
pcs = [on_tan(os.path.join(K, 'COOK2_MAP_CURB_BLOCK_256_M%02d.png' % m)) for m in (3, 12, 7, 15)]
laid = on_tan(os.path.join(K, 'COOK2_MAP_CURB_BLOCK_LAID_256.png')).crop((380, 0, 1160, 620))
kr = Image.new('RGB', (W - 2 * PAD, max(laid.height, pcs[0].height * 2 + PAD)), (14, 14, 14))
x = y = 0
for i, p in enumerate(pcs):
    kr.paste(p, (x, y)); x += p.width + PAD
    if i == 1: x, y = 0, p.height + PAD
kr.paste(laid, (2 * (pcs[0].width + PAD) + PAD, 0))
rows.append(('THE KIT AT ITS OWN PIXEL (1:1): four of the 16 BLOCK pieces (east-west, north-south, a tee, a crossing) and a grid of '
             'them laid as the map lays them (no line where two meet: 0 pixels painted twice, 0 pinholes). The BAND family is the '
             'same street at RUN\'s band width for the far zooms; both at 256, 128 and 64 px a block, two variants each.', kr))
# the twin: his slab (its dark bottom band IS a curb face), and the curb he voted up
slab = Image.fromarray(np.concatenate([S.pack(S.SIDEWALK, i)[-94:, :, :3] for i in (0, 1)], axis=1))   # the bottom 94 rows of each: the face is at the bottom
slab = slab.resize((slab.width * 2, slab.height * 2), Image.NEAREST)
voted = Image.open(os.path.join(R, 'records/target/COOK2_THE_CURB_CANDIDATE.png')).convert('RGB')
voted = voted.resize((voted.width * 300 // voted.height, 300), Image.NEAREST) if voted.height > 300 else voted
tw = Image.new('RGB', (slab.width + PAD + voted.width, max(slab.height, voted.height)), (14, 14, 14))
tw.paste(slab, (0, 0)); tw.paste(voted, (slab.width + PAD, 0))
rows.append(('THE TWIN: his slab at 2x (its dark bottom band is a curb face seen from above; the map\'s face is those rows, top to '
             'foot) | the curb you voted up (10/11) at 1:1.', tw))

H = 140 + sum(im.height + 60 for _, im in rows)
sheet = Image.new('RGB', (W, H), (14, 14, 14)); d = ImageDraw.Draw(sheet)
d.text((PAD, 10), 'THE CURB ON THE MAP: the map\'s streets from his tiles, with the curb\'s lip, face and shadow, at the map\'s own pixel. '
       'A candidate; nothing in the game changes until RUN lays it.', fill=(235, 235, 235))
d.text((PAD, 32), 'PIXEL SIZE the map\'s near stop, one art pixel to one device pixel (a block 256 px; kit levels 256, 128, 64), his tiles '
       'at every second pixel | PALETTE records/target/cook2_map_curb/COOK2_MAP_CURB_KIT.json (his road, slab, face and yellow; '
       '0 colours not his) | LIGHT the style guide\'s one light, screen 155 degrees, from the left', fill=(200, 220, 255))
d.text((PAD, 54), 'ONE QUESTION: does the street stand lower than the sidewalk now, on the map?', fill=(235, 200, 120))
y = 90
for lab, im in rows:
    words, line, lines = lab.split(' '), '', []
    for w_ in words:
        if len(line) + len(w_) > 230: lines.append(line); line = ''
        line += w_ + ' '
    lines.append(line)
    for i, l in enumerate(lines[:2]):
        d.text((PAD, y + i * 16), l, fill=(225, 225, 225))
    y += 40
    sheet.paste(im, (PAD, y)); y += im.height + 20
sheet = sheet.crop((0, 0, W, y))
out = os.path.join(R, 'records/target/COOK2_THE_CURB_ON_THE_MAP.webp')
sheet.save(out, quality=90, method=6)
print(out, sheet.size, os.path.getsize(out))
