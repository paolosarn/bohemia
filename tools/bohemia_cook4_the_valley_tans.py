#!/usr/bin/env python3
"""COOK FOUR [a house a man can live in], round 6 (10/18): THE STRAIGHT-ROOF FAMILY IN THE VALLEY'S TANS.

HIS VOTE on the family (10/17, the thirteenth votes, UP): 'Bet, bro, I honestly should be able to color
the roof these roofs to make it more tan like they're looking bright, medieval, orange and like metal blue
and shit like bro.'  The coordinator's note: 'the family's roofs in the valley's tans from his own tiles,
nothing bright, one sheet.'  One asset this round (rule 101d): the SAME five houses, only the roofs change.

WHERE THE TANS COME FROM (rule 82a: his tiles are the source and the bar).  His pack has three roof sets:
the clay barrels (#26, bright orange, hue 17, sat .89), the slate (#27, metal blue-grey, hue 357, sat .04)
and a tan-hued set (#3, #8, #12, #16, #22, #24, #28, hue 32) which is THATCH: DIRECTION ruled 10/10 'clay and
slate only, no thatch', and no Las Vegas ranch has a straw roof.  So there is no tan roof tile to lay.
What the valley has: tan concrete S-tile on the pitched roofs and grey-tan gravel on the flat ones.  Both
tans exist in his tiles, on other surfaces:
  TAN A, the desert tan   Wall tiles (1) #7, his flat tan render (rgb 89 74 60, hue 30, sat .32, val .35)
  TAN B, the gravel tan   rocks and stones #53, his grey-tan flagstone strip (rgb 108 101 87, hue 40, sat .20)

HOW THE ROOF IS RECOLOURED, AND WHY IT IS NOT A SHADE() (rule 114, the fourth tell: a ramp that only darkens):
every pixel of his clay field keeps its own place in the field's light-to-dark order (so every barrel
tile keeps its highlight, its body and its shadow gap: the STRUCTURE is his, untouched) and takes its hue
and saturation from the pixel of the tan source that sits at the SAME place in that source's own order
(so the ramp is his tan tile's ramp, which shifts hue from the dark cracks to the light faces as a painted
ramp does, never one hue darkened), plus six tenths of the clay's own hue shift at that pixel (his clay
runs 10 to 21 degrees dark to light, so the tan runs warm at the highlights too).  The value is pulled
half way toward the source's value at that rank, so the clay's glare comes down ('nothing bright')
without flattening the tiles.  The wooden eave frame
under the tiles (brown, hue 25 to 45, sat .4 to .75) is left as he painted it; only the tile faces and
the slate faces are recoloured.  Numbers are printed every run and written to the palette file.

THE PALETTE FILE (rule 114c: a sheet names its palette): reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json
holds the two sources, the five-step ramp of each recoloured field (hex and hue per step, the hue shift
dark-to-light) and the mean colour before and after.  Native pixel size: his 96 px pieces at 1:1, the body's
57 px a metre.  Light: from above (+9.3 top over bottom, the study page).

The houses are the round-4 family, same code, same tiles, same man at the door: tools/bohemia_cook4_the_
straight_roof_family.py is imported and its roof tiles are redirected to the tan fields.  A placeholder is
never edited (rule 101c): the orange family's files stay; these are new files, COOK4_RANCH_TAN_*.png.

Output: reference/art_bank/settlement/COOK4_ROOF_TAN_FIELD.png, COOK4_ROOF_TAN_EAVE.png,
COOK4_ROOF_GRAVEL_FIELD.png, COOK4_ROOF_GRAVEL_EAVE.png (the recoloured fields, 1:1 with his),
COOK4_RANCH_TAN_{PLAIN,GARAGE,CARPORT,WING,PORCH}.png, COOK4_THE_VALLEY_TANS.json, and the sheet
records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png (rule 100: never slices/ or engine/).

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet; his clay field #26 and slate field #27
  beside their tan versions at 1:1; the two source tiles with their swatches; the orange plain ranch he
  voted on beside the tan one; and the real thing: the Las Vegas tract roof (tan or sand concrete S-tile
  on the pitched roofs, grey-tan gravel built-up roofs on the flat ones; never glazed orange, never slate).
  structure taken: every tile face keeps its own highlight, body and shadow in his order; the eave frame is
  his; the roof shape is the measured one (roof/wall 1.49, eave 14 percent, lean 6 percent).
  what changed: the colour only. Hue 17 / sat .89 (orange) becomes the tan of his render wall; hue 357 /
  sat .04 (blue-grey) becomes the grey-tan of his flagstones.  Nothing else on the five houses moved.
"""
import os
import json
import colorsys
from PIL import Image, ImageDraw

import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_roof_measured as rm
from bohemia_cook4_one_house import A as A_PACK, AB, ROOT

VALUE_PULL = 0.5                      # how far a pixel's value moves toward the source's value at its rank
HUE_KEEP = {'clay': 0.6, 'slate': 0.0}  # how much of his field's own dark-to-light hue shift rides on top of the
                                        # source's hue (the clay shifts 10 to 21 degrees dark to light, so the
                                        # tan does too; the slate's hue is noise at sat .04 and keeps none)

SOURCES = {
    'tan':    ('settlement/pack_wall_tiles_1_007.png', 'Wall tiles (1) #7, his flat tan render'),
    'gravel': ('ground/pack_rocks_and_stones_053.png', 'rocks and stones #53, his grey-tan flagstones'),
}
FIELDS = [   # (his tile, the tan it takes, the mask that says which pixels are roof face, the output name)
    ('settlement/pack_5_roof_tiles_026.png', 'tan',    'clay',  'COOK4_ROOF_TAN_FIELD.png'),
    ('settlement/pack_5_roof_tiles_014.png', 'tan',    'clay',  'COOK4_ROOF_TAN_EAVE.png'),
    ('settlement/pack_5_roof_tiles_027.png', 'gravel', 'slate', 'COOK4_ROOF_GRAVEL_FIELD.png'),
    ('settlement/pack_5_roof_tiles_015.png', 'gravel', 'slate', 'COOK4_ROOF_GRAVEL_EAVE.png'),
]
REDIRECT = {his: 'settlement/' + out for his, _, _, out in FIELDS}


def hsv(p): return colorsys.rgb_to_hsv(p[0] / 255, p[1] / 255, p[2] / 255)
def lum(p): return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def is_face(p, kind):
    """which pixels are the roof's face (recoloured) and which are the wooden frame he painted (kept)"""
    h, s, v = hsv(p); h *= 360
    if kind == 'clay':   return h < 28 or s > 0.75 or v < 0.2       # the orange barrels and their shadow gaps
    return s < 0.30 or v < 0.2                                     # the grey slates; the brown frame stays


def ranked(pixels):
    """the source's pixels in light-to-dark order, with their HSV, so a rank can be looked up"""
    px = sorted(pixels, key=lum)
    return [hsv(p) for p in px]


def recolour(tile, source, kind):
    """every face pixel keeps its rank in the tile's own light order and takes the hue and saturation of
    the source pixel at the same rank in the source's order (his ramp, not a darkened hue)"""
    src = ranked([p[:3] for p in source.getdata() if p[3] > 200])
    data = list(tile.getdata())
    face = [i for i, p in enumerate(data) if p[3] > 0 and is_face(p, kind)]
    order = sorted(face, key=lambda i: lum(data[i]))
    n = len(order); m = len(src)
    hues = sorted(hsv(data[i])[0] for i in face); h_mid = hues[len(hues) // 2]
    out = data[:]
    for r, i in enumerate(order):
        q = r / max(n - 1, 1)
        j0, j1 = int(q * (m - 1)) - m // 50, int(q * (m - 1)) + m // 50          # a 4 percent window: no speckle
        win = src[max(j0, 0):min(j1, m - 1) + 1]
        sh = sum(w[0] for w in win) / len(win); ss = sum(w[1] for w in win) / len(win); sv = sum(w[2] for w in win) / len(win)
        h, s, v = hsv(data[i])
        v = v + (sv - v) * VALUE_PULL
        dh = ((h - h_mid + 0.5) % 1.0) - 0.5                                   # his own hue shift at this pixel
        sh = (sh + dh * HUE_KEEP[kind]) % 1.0
        rr, gg, bb = colorsys.hsv_to_rgb(sh, ss, v)
        out[i] = (int(rr * 255), int(gg * 255), int(bb * 255), data[i][3])
    im = Image.new('RGBA', tile.size); im.putdata(out)
    return im


def ramp(im, steps=(0.1, 0.3, 0.5, 0.7, 0.9)):
    """the field's five-step ramp read back: the colour at five ranks of its light order (the 10th to the
    90th; the bottom 5 percent is near-black outline, where a hue means nothing)"""
    px = sorted([p[:3] for p in im.getdata() if p[3] > 200], key=lum)
    out = []
    for q in steps:
        j = int(q * (len(px) - 1)); win = px[max(j - len(px) // 50, 0):j + len(px) // 50 + 1]
        c = tuple(int(sum(w[k] for w in win) / len(win)) for k in range(3))
        h, s, v = hsv(c)
        out.append({'rank': q, 'hex': '#%02x%02x%02x' % c, 'hue': round(h * 360), 'sat': round(s, 2), 'val': round(v, 2)})
    return out


def mean(im):
    px = [p[:3] for p in im.getdata() if p[3] > 200]
    c = tuple(int(sum(p[k] for p in px) / len(px)) for k in range(3)); h, s, v = hsv(c)
    return {'rgb': c, 'hue': round(h * 360), 'sat': round(s, 2), 'val': round(v, 2)}


def make_fields():
    pal = {'_what': 'COOK FOUR, the valley tans (10/18): the roof fields of his pack recoloured onto tans sampled from his own tiles; '
                    'rule 114c names this file in the sheet caption. Native pixel size 96 px pieces at 1:1, 57 px a metre; light from above.',
           'method': 'each face pixel keeps its rank in the field\'s light order and takes hue and saturation from the source pixel at the '
                     'same rank; value pulled %.0f percent toward the source; the wooden eave frame is untouched' % (VALUE_PULL * 100),
           'sources': {k: {'tile': v[0], 'what': v[1], 'mean': mean(A_PACK(v[0]))} for k, v in SOURCES.items()},
           'fields': {}}
    for his, tan, kind, out in FIELDS:
        t = A_PACK(his); src = A_PACK(SOURCES[tan][0])
        im = recolour(t, src, kind)
        im.save(os.path.join(AB, 'settlement', out))
        r = ramp(im)
        pal['fields'][out] = {'from': his, 'takes': tan, 'before': mean(t), 'after': mean(im), 'ramp': r,
                              'hue_shift_30_to_90': r[-1]['hue'] - r[1]['hue']}   # the 10th rank is near-black on the slate: no hue there
        a = pal['fields'][out]
        print('%-28s hue %3d -> %3d  sat %.2f -> %.2f  val %.2f -> %.2f  ramp hue shift %+d' % (
            out, a['before']['hue'], a['after']['hue'], a['before']['sat'], a['after']['sat'], a['before']['val'], a['after']['val'],
            a['hue_shift_30_to_90']))
        assert 20 <= a['after']['hue'] <= 48 and a['after']['sat'] < 0.5, 'the roof must come out tan, not bright'
    with open(os.path.join(AB, 'settlement/COOK4_THE_VALLEY_TANS.json'), 'w') as f:
        json.dump(pal, f, indent=1)
    return pal


def A_redirected(p):
    return A_PACK(REDIRECT.get(p, p))


def make_houses():
    """the round-4 family, same code and tiles, its roof tiles redirected to the tan fields"""
    fam.A = A_redirected; rm.A = A_redirected
    out = []
    for name, fn in fam.KINDS:
        im, foot, label = fn()
        im.save(os.path.join(AB, 'settlement/COOK4_RANCH_TAN_%s.png' % name.upper()))
        assert foot[1] - (fam.ROOF_H - 26) == fam.WALL_H and fam.WALL_H >= 170, 'the wall must be 1.7 people tall'
        out.append((im, foot, label)); print(name, im.size)
    return out


def swatch(d, x, y, c, w=40, h=20):
    d.rectangle([x, y, x + w, y + h], fill=tuple(c) + (255,), outline=(28, 18, 14, 255))


def sheet(houses, pal):
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = A_PACK('settlement/pack_5_roof_tiles_030.png')
    before = A_PACK('settlement/COOK4_RANCH_PLAIN.png')
    GAP = 40
    rows = [[0, 1], [2, 3], [4]]
    rw = max(sum(houses[i][0].width for i in row) + GAP * (len(row) + 1) for row in rows)
    rh = [max(houses[i][0].height for i in row) + 44 for row in rows]
    rh[-1] = max(rh[-1], before.height + 44)
    W = max(rw, 1700, houses[4][0].width + before.width + GAP * 3); H = 330 + sum(rh)
    S = Image.new('RGBA', (W, H), (22, 19, 16, 255)); d = ImageDraw.Draw(S)
    d.text((16, 12), 'ALL AT 1:1.  THE STRAIGHT-ROOF FAMILY IN THE VALLEY\'S TANS: the same five houses you said yes to, only the roofs change.  Your words: "color these roofs to make it more tan, they\'re looking bright medieval orange and metal blue."', fill=(230, 220, 200))
    d.text((16, 28), 'The tans are sampled from your own tiles: the tile roofs take the tan of your flat render wall (Wall tiles 1 #7), the flat roofs take the grey-tan of your flagstones (rocks and stones #53).  Every tile keeps its own highlight and shadow; only the colour moved.', fill=(200, 190, 170))
    d.text((16, 44), 'Native pixel size: your 96 px pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json.  Light: from above.  A placeholder until your moodboard.', fill=(200, 190, 170))
    S.alpha_composite(twin, (30, 70)); d.text((30, 172), 'his pack #30', fill=(200, 190, 170))
    S.alpha_composite(man, (150, 70 + 96 - 107))
    x = 300
    for his, tan, kind, out in FIELDS:
        if 'EAVE' in out: continue
        t = A_PACK(his); n = A_PACK('settlement/' + out); src = A_PACK(SOURCES[tan][0])
        S.alpha_composite(t, (x, 70)); S.alpha_composite(n, (x + t.width + 16, 70))
        S.alpha_composite(src, (x + t.width + n.width + 56, 70))
        f = pal['fields'][out]
        d.text((x, 172), 'his %s' % ('clay #26' if kind == 'clay' else 'slate #27'), fill=(200, 190, 170))
        d.text((x + t.width + 16, 172), 'in the %s tan' % ('desert' if tan == 'tan' else 'gravel'), fill=(230, 220, 200))
        d.text((x + t.width + n.width + 56, 172), 'the source: %s' % SOURCES[tan][1], fill=(200, 190, 170))
        for k, st in enumerate(f['ramp']):
            c = tuple(int(st['hex'][i:i + 2], 16) for i in (1, 3, 5))
            swatch(d, x + t.width + 16 + k * 22, 190, c, w=20, h=16)
        d.text((x + t.width + 16, 210), 'ramp hue %d to %d, sat %.2f' % (f['ramp'][1]['hue'], f['ramp'][-1]['hue'], f['after']['sat']), fill=(200, 190, 170))
        x += t.width + n.width + src.width + 300
    y = 300
    for ri, (row, h) in enumerate(zip(rows, rh)):
        x = GAP
        for i in row:
            im, foot, label = houses[i]
            S.alpha_composite(im, (x, y + h - 44 - im.height))
            S.alpha_composite(man, (x + foot[0] + A_PACK(fam.DOOR['wood']).width + 44 - 56, y + h - 44 - im.height + foot[1] - 107))
            d.text((x + 6, y + h - 36), '%d  %s' % (i + 1, label), fill=(230, 220, 200))
            x += im.width + GAP
        if ri == len(rows) - 1:
            S.alpha_composite(before, (x, y + h - 44 - before.height))
            d.text((x + 6, y + h - 36), 'BEFORE, for the eye: the plain ranch as you voted on it, the orange clay and the blue slate', fill=(200, 190, 170))
        y += h
    return S


if __name__ == '__main__':
    pal = make_fields()
    houses = make_houses()
    S = sheet(houses, pal)
    S.save(os.path.join(ROOT, 'records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png'))
    print('sheet', S.size)
