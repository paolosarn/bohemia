#!/usr/bin/env python3
"""COOK [the buildings through the rig] (10/19): the VOTE sheets, laid for his phone (1,170 px wide). For every building,
COOK FOUR's flat picture he said yes to (or '3d remodel otw' on) beside the model through the rig, both at the same pixels
a metre (57, the men's), on his caliche so the cast shadow shows; then the same model turned (SE and SW: the map and the
settlement can turn a house, DIRECTION's 'turn some'). Two sheets: the ranch family, and the Strip and the town.
  python3 tools/bohemia_cook_buildings_through_the_rig_sheet_10_19_26.py
  -> records/target/COOK_THE_RANCHES_THROUGH_THE_RIG.webp, records/target/COOK_THE_STRIP_AND_TOWN_THROUGH_THE_RIG.webp

REUSE CHECK (REUSE-FIRST, 7/22): no art is made here; the rig's renders and COOK FOUR's pictures, cropped and labelled.
TASTE CHECK: old beside new at the same size, one question a sheet, eighth-grade words (his 8/24).
REFERENCE CHECK (the 9/4 standing duty): the compare law; COOK FOUR's pictures are the twins; the style guide's caption
fields (rule 114c). No reference game.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, PAD, BG = 1170, 18, (14, 13, 12)
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
f_title, f_head, f_body, f_small = ImageFont.truetype(FB, 44), ImageFont.truetype(FB, 32), ImageFont.truetype(FR, 27), ImageFont.truetype(FR, 22)
GROUND = (168, 157, 136)          # his YES street's caliche, the floor's calibrated dirt
S4 = 'reference/art_bank/settlement/'; ST = 'reference/art_pipe/cook4/strip/'
RANCH = [('ranch_plain', 'THE PLAIN RANCH', S4 + 'COOK4_RANCH_TAN_PLAIN.png', 'a KEEP OUT sheet on the yard fence, the chimney with no smoke'),
         ('ranch_garage', 'THE RANCH WITH THE GARAGE', S4 + 'COOK4_RANCH_TAN_GARAGE.png', 'the garage door nailed shut with two planks'),
         ('ranch_carport', 'THE RANCH WITH THE CARPORT', S4 + 'COOK4_RANCH_TAN_CARPORT.png', 'the carport empty, an oil stain where the car stood; a window boarded'),
         ('ranch_wing', 'THE L RANCH, THE WING FORWARD', S4 + 'COOK4_RANCH_TAN_WING.png', 'the wing under its own lower roof'),
         ('ranch_porch', 'THE RANCH WITH THE PORCH', S4 + 'COOK4_RANCH_TAN_PORCH.png', 'the door in the porch\'s shade nailed shut, a window boarded')]
TOWN = [('casino', 'THE CASINO', S4 + 'COOK4_CASINO_STRAIGHT_ROOF.png', 'the middle pair of doors open on a black room; the sign blank'),
        ('tower_casino', 'THE TOWER CASINO', ST + 'COOK4_THE_TOWER_CASINO.png', 'the top floor shuttered and clean, the two under it boarded, five panes broken'),
        ('church', 'THE CHURCH', S4 + 'COOK4_CHURCH_STRAIGHT_ROOF.png', 'the six pews out on the forecourt, facing the road'),
        ('motel', 'THE MOTEL', S4 + 'COOK4_MOTEL_STRAIGHT_ROOF.png', 'room 4\'s door marked with a red cross, its window boarded'),
        ('motel_sign', 'THE MOTEL SIGN TOWER', ST + 'COOK4_THE_MOTEL_SIGN_TOWER.png', 'nothing lit, and the arrow points away from the motel, out at the desert'),
        ('pawn_shop', 'THE PAWN SHOP', ST + 'COOK4_THE_PAWN_SHOP.png', 'three rows of queue rails, the queue empty, the door shut'),
        ('chapel', 'THE WEDDING CHAPEL', ST + 'COOK4_THE_WEDDING_CHAPEL.png', 'the flowers in the boxes alive, red and gold'),
        ('gas_station', 'THE GAS STATION', S4 + 'COOK4_GAS_STATION_STRAIGHT_ROOF.png', 'bay two\'s roll-up stopped 0.7 m off the floor, dark under it'),
        ('warehouse', 'THE WAREHOUSE', S4 + 'COOK4_WAREHOUSE_STRAIGHT_ROOF.png', 'the office\'s barred window lit warm amber'),
        ('school', 'THE SCHOOL', S4 + 'COOK4_SCHOOL_STRAIGHT_ROOF.png', 'room three\'s window lit the cold blue of a television left on')]


def wrap(d, text, font, width):
    out, line = [], ''
    for w in text.split(' '):
        t = (line + ' ' + w).strip()
        if d.textlength(t, font=font) > width: out.append(line); line = w
        else: line = t
    return out + [line]


def grounded(name, f):
    """the rig's body over its own cast shadow, on his caliche"""
    d = os.path.join(R, 'records/target/master_rig/cook_bld_%s' % name)
    body = Image.open(os.path.join(d, 'rig_%s.png' % f)).convert('RGBA'); sh = Image.open(os.path.join(d, 'shadow_%s.png' % f)).convert('RGBA')
    g = Image.new('RGBA', body.size, GROUND + (255,)); g.alpha_composite(sh); g.alpha_composite(body)
    return g.convert('RGB')


def old(path):
    a = Image.open(os.path.join(R, path)).convert('RGBA')
    g = Image.new('RGBA', a.size, GROUND + (255,)); g.alpha_composite(a); return g.convert('RGB')


def fit_pair(a, b, width):
    k = min(1.0, (width - PAD) / (a.width + b.width), 900 / max(a.height, b.height))
    if k < 1:
        a = a.resize((max(1, int(a.width * k)), max(1, int(a.height * k))), Image.LANCZOS); b = b.resize((max(1, int(b.width * k)), max(1, int(b.height * k))), Image.LANCZOS)
    im = Image.new('RGB', (a.width + PAD + b.width, max(a.height, b.height)), BG)
    im.paste(a, (0, im.height - a.height)); im.paste(b, (a.width + PAD, im.height - b.height))
    return im, k


def tag(im, text):
    d = ImageDraw.Draw(im); d.text((10, 6), text, font=f_small, fill=(240, 226, 196), stroke_width=3, stroke_fill=(14, 13, 12)); return im


def sheet(rows, title, intro, question, out):
    blocks = [('title', title), ('text', intro)]
    for name, label, twin, odd in rows:
        rj = os.path.join(R, 'records/target/master_rig/cook_bld_%s/rig.json' % name)
        if not os.path.exists(rj): continue
        meta = json.load(open(rj)); dims = meta['real_dims_m']
        blocks.append(('head', label))
        pr, k = fit_pair(tag(old(twin), 'NOW (COOK FOUR, FLAT)'), tag(grounded(name, 'S'), 'NEW (3D, THROUGH THE RIG)'), W - 2 * PAD)
        blocks.append(('small', '%s. %.1f x %.1f m, %.1f m to the top. The one wrong thing: %s.%s' % (
            label.title(), dims[0], dims[1], dims[2], odd, '' if k >= 0.999 else ' Both at %d%% to fit your phone.' % round(k * 100))))
        blocks.append(('img', pr))
        if 'SE' in meta.get('facings', []):
            t1, k2 = fit_pair(grounded(name, 'SE'), grounded(name, 'SW'), W - 2 * PAD)
            blocks.append(('small', 'The same house turned (the map can turn one): SE | SW%s.' % ('' if k2 >= 0.999 else ', at %d%%' % round(k2 * 100))))
            blocks.append(('img', t1))
    blocks.append(('q', question))
    blocks.append(('cap', 'PIXEL SIZE 57 px a metre, the men\'s (a 1.72 m man is 98 px), COOK FOUR\'s pictures at their own 57 | PALETTE '
                          'records/target/BOHEMIA_STYLE_PALETTE.json (clay bone, tape masking, tape grey, metal painted, clay teal, '
                          'clay rust, glass eye, sodium), snapped toward his settlement family at 0.6 | LIGHT the rig\'s one sun, upper '
                          'left, the cast shadow its own layer on his caliche'))
    d0 = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    FONT = {'title': f_title, 'head': f_head, 'text': f_body, 'small': f_small, 'q': f_head, 'cap': f_small}
    def hgt(k, v):
        if k == 'img': return v.height + PAD
        return len(wrap(d0, v, FONT[k], W - 2 * PAD)) * int(FONT[k].size * 1.3) + PAD
    H = PAD + sum(hgt(k, v) for k, v in blocks)
    sh = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sh); y = PAD; first = None
    for k, v in blocks:
        if k == 'img':
            if first is None: first = [0, max(0, y - 70), W, v.height + 70]      # the first NOW | NEW pair: the card's first picture
            sh.paste(v, (PAD, y)); y += v.height + PAD; continue
        col = {'title': (240, 226, 196), 'head': (226, 170, 96), 'text': (226, 222, 214), 'small': (190, 186, 178), 'q': (240, 200, 120), 'cap': (170, 190, 220)}[k]
        for l in wrap(d, v, FONT[k], W - 2 * PAD): d.text((PAD, y), l, font=FONT[k], fill=col); y += int(FONT[k].size * 1.3)
        y += PAD
    sh.save(os.path.join(R, out), quality=84, method=6); print(out, sh.size, os.path.getsize(os.path.join(R, out)), 'FIRST', *first)


if __name__ == '__main__':
    sheet(RANCH, 'THE RANCH HOUSES, MODELLED IN 3D LIKE THE TRUCK',
          'The five ranch houses COOK FOUR drew flat in the valley\'s tans, now built in 3D at the same size and lit by the same lamp and '
          'camera as the robot, the truck and the people: real roofs with their ridge along the front, chipped stucco, boarded windows, '
          'the yard fence. LEFT is the flat one you saw, RIGHT is the 3D one.',
          'ONE QUESTION: are these the houses? (YES, or NO and what is wrong)', 'records/target/COOK_THE_RANCHES_THROUGH_THE_RIG.webp')
    sheet(TOWN, 'THE STRIP AND THE TOWN, MODELLED IN 3D',
          'Every building on the Strip and in town you said "3d remodel otw" to: the casino, the tower casino, the church, the motel and '
          'its sign, the pawn shop, the wedding chapel, the gas station, the warehouse and the school, each built in 3D at the size COOK '
          'FOUR measured, weathered, with its one wrong thing kept. LEFT is the flat one, RIGHT is the 3D one.',
          'ONE QUESTION: is this the town? (YES, or NO and which one)', 'records/target/COOK_THE_STRIP_AND_TOWN_THROUGH_THE_RIG.webp')
