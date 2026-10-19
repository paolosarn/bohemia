#!/usr/bin/env python3
"""BOHEMIA -- THE FACE IS THE BODY'S, MEASURED (PEOPLE, 10/19/26, row [ask the crowd], rule 120(d)).

Paolo 10/18, LOCKED: 'the portraits don't even look alike, Black people looking like white people'. Rule 120(d):
every portrait matches its body's skin tone, hair and build. The coordinator's reading for this lane: a name, a face
and a body are one person, so hand PORTRAIT and CHARACTER any person whose name, face and skin disagree.

This reads the skin of every look three ways, from the files the game really draws:
  body       the 112 body the settlement screen stands in the picture (slices/settlement_people/<look>.webp, the S row's
             first frame; YOU from slices/fight_people/you.webp), the commonest skin-coloured pixel on the cheeks
  sheetface  the 64 face at the right edge of the fight sheet (slices/fight_people/<look>.webp), the face a speaker
             shows when PORTRAIT has not made a fresh one; the commonest skin-coloured pixel on the cheeks
  portrait   PORTRAIT's fresh portrait (records/target/portrait/crew/<look>/rest_128.png), a lit render, so the median
             of the brightest third of the skin-coloured pixels in the face box
and gives each its ITA, the angle dermatology reads skin by: ITA = atan((L* - 50) / b*) in degrees (Chardon 1991),
banded as Del Bino and Bernerd 2013 band it: over 55 very light, 41-55 light, 28-41 intermediate, 10-28 tan,
-30-10 brown, under -30 dark. Skin-coloured means red leads green leads blue, as skin does at every tone.

Writes records/people/THE_FACE_IS_THE_BODYS.json and the contact sheet records/people/THE_FACE_IS_THE_BODYS.png
(each look: the body's head at 6x, the sheet face, the fresh portrait, and the three swatches with their bands).

  python3 tools/bohemia_people_skin_measure.py
"""
import json
import math
import os
from collections import Counter
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_JSON = os.path.join(ROOT, 'records/people/THE_FACE_IS_THE_BODYS.json')
OUT_PNG = os.path.join(ROOT, 'records/people/THE_FACE_IS_THE_BODYS.png')
BOXES = {'body': (48, 19, 65, 23), 'sheetface': (18, 26, 46, 50), 'portrait': (30, 50, 98, 100)}
BANDS = [(55, 'very light'), (41, 'light'), (28, 'intermediate'), (10, 'tan'), (-30, 'brown')]
ORDER = ['very light', 'light', 'intermediate', 'tan', 'brown', 'dark']


def lab(rgb):
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = [lin(c) for c in rgb]
    x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    return 116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))


def ita(rgb):
    L, _a, b = lab(rgb)
    return math.degrees(math.atan2(L - 50, b))


def band(t):
    for lo, name in BANDS:
        if t > lo:
            return name
    return 'dark'


def skinlike(r, g, b):
    return r >= g >= b - 4 and r - b >= 4 and r + g + b >= 50


def pixels(im, box):
    out = []
    for y in range(box[1], box[3]):
        for x in range(box[0], box[2]):
            r, g, b, a = im.getpixel((x, y))
            if a > 200 and skinlike(r, g, b):
                out.append((r, g, b))
    return out


def flat_skin(im, box):
    px = pixels(im, box)
    if not px:
        return None
    col, n = Counter(px).most_common(1)[0]
    return col, n


def lit_skin(im, box):
    px = pixels(im, box)
    if not px:
        return None
    px.sort(key=sum)
    top = px[2 * len(px) // 3:]
    return top[len(top) // 2], len(px)


def reading(found):
    if not found:
        return None
    col, n = found
    t = ita(col)
    return {'rgb': list(col), 'ita': round(t, 1), 'band': band(t), 'pixels': n}


def measure():
    """read only: the measurement, from the files as they are (the gate calls this and writes nothing)"""
    people = json.load(open(os.path.join(ROOT, 'slices/settlement_people/settlement_people.json')))
    looks = ['you'] + list(people['looks'])
    res = {}
    for look in looks:
        r = {}
        body = os.path.join(ROOT, 'slices/settlement_people/%s.webp' % look)
        fight = os.path.join(ROOT, 'slices/fight_people/%s.webp' % look)
        port = os.path.join(ROOT, 'records/target/portrait/crew/%s/rest_128.png' % look)
        if os.path.exists(body):
            r['body'] = reading(flat_skin(Image.open(body).convert('RGBA'), BOXES['body']))
        elif os.path.exists(fight):
            r['body'] = reading(flat_skin(Image.open(fight).convert('RGBA'), BOXES['body']))
        if os.path.exists(fight):
            im = Image.open(fight).convert('RGBA')
            r['sheetface'] = reading(flat_skin(im.crop((im.width - 64, 0, im.width, 64)), BOXES['sheetface']))
        if os.path.exists(port):
            r['portrait'] = reading(lit_skin(Image.open(port).convert('RGBA'), BOXES['portrait']))
        shown = r.get('portrait') or r.get('sheetface')
        r['shown'] = 'portrait' if r.get('portrait') else 'sheetface'
        # agrees: the face's band is the body's or the next one over (a render's light and a sprite's flat colour
        # never land on one number; four bands apart is a different person)
        r['bands_apart'] = abs(ORDER.index(shown['band']) - ORDER.index(r['body']['band'])) if shown and r.get('body') else None
        r['face_agrees_with_body'] = r['bands_apart'] is not None and r['bands_apart'] <= 1
        res[look] = r
    body_tones = Counter(tuple(v['body']['rgb']) for v in res.values() if v.get('body'))
    out = {
        'made': '10/19/26', 'lane': 'people', 'rule': '120(d)', 'draft': True,
        'method': 'ITA = atan((L*-50)/b*) in degrees (Chardon 1991); bands as Del Bino and Bernerd 2013: >55 very light, '
                  '41-55 light, 28-41 intermediate, 10-28 tan, -30-10 brown, <-30 dark. Flat sprites: the commonest '
                  'skin-coloured pixel in the cheek box; a lit render: the median of the brightest third.',
        'boxes': BOXES,
        'counted': {
            'looks': len(res),
            'bodies_with_one_skin': '%d of %d' % (body_tones.most_common(1)[0][1], sum(body_tones.values())),
            'the_one_body_skin': list(body_tones.most_common(1)[0][0]),
            'faces_agree_with_body': '%d of %d' % (sum(1 for v in res.values() if v['face_agrees_with_body']), len(res)),
            'fresh_portraits_by_band': dict(Counter(v['portrait']['band'] for v in res.values() if v.get('portrait'))),
            'sheet_faces_by_band': dict(Counter(v['sheetface']['band'] for v in res.values() if v.get('sheetface'))),
        },
        'looks': res,
    }
    return out


def main():
    out = measure()
    res = out['looks']
    looks = list(res)
    os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)
    with open(OUT_JSON, 'w') as f:
        json.dump(out, f, indent=1)
        f.write('\n')

    # the contact sheet: one row a look
    S, rowh = 6, 150
    sheet = Image.new('RGB', (900, 30 + rowh * len(looks)), (22, 17, 12))
    d = ImageDraw.Draw(sheet)
    d.text((10, 8), "THE FACE IS THE BODY'S (rule 120(d)): body head x6 | sheet face | fresh portrait | the three skins, ITA and band",
           fill=(233, 220, 196))
    for n, look in enumerate(looks):
        oy = 30 + n * rowh
        r = res[look]
        d.text((10, oy + 2), look, fill=(217, 168, 90))
        src = os.path.join(ROOT, 'slices/settlement_people/%s.webp' % look)
        if not os.path.exists(src):
            src = os.path.join(ROOT, 'slices/fight_people/%s.webp' % look)
        im = Image.open(src).convert('RGBA').crop((40, 4, 72, 26)).resize((32 * 4, 22 * 4), Image.NEAREST)
        bg = Image.new('RGBA', im.size, (60, 60, 70, 255)); bg.alpha_composite(im)
        sheet.paste(bg.convert('RGB'), (10, oy + 18))
        fight = os.path.join(ROOT, 'slices/fight_people/%s.webp' % look)
        if os.path.exists(fight):
            f = Image.open(fight).convert('RGBA')
            f = f.crop((f.width - 64, 0, f.width, 64)).resize((128, 128), Image.NEAREST)
            bg = Image.new('RGBA', f.size, (60, 60, 70, 255)); bg.alpha_composite(f)
            sheet.paste(bg.convert('RGB'), (150, oy + 18))
        port = os.path.join(ROOT, 'records/target/portrait/crew/%s/rest_128.png' % look)
        if os.path.exists(port):
            f = Image.open(port).convert('RGBA')
            bg = Image.new('RGBA', f.size, (60, 60, 70, 255)); bg.alpha_composite(f)
            sheet.paste(bg.convert('RGB'), (290, oy + 18))
        else:
            d.text((300, oy + 70), 'no fresh portrait yet', fill=(168, 151, 124))
        for k, key in enumerate(['body', 'sheetface', 'portrait']):
            v = r.get(key)
            x = 440 + k * 150
            if not v:
                continue
            d.rectangle((x, oy + 18, x + 140, oy + 98), fill=tuple(v['rgb']))
            d.text((x, oy + 102), '%s %.0f %s' % (key, v['ita'], v['band']), fill=(233, 220, 196))
        d.text((440, oy + 122), 'FACE AGREES WITH BODY' if r['face_agrees_with_body'] else 'FACE AND BODY DISAGREE',
               fill=(140, 200, 120) if r['face_agrees_with_body'] else (230, 110, 90))
    sheet.save(OUT_PNG)
    print(json.dumps(out['counted'], indent=1))
    for look, r in res.items():
        print(look.ljust(20), '  '.join('%s %6.1f %-12s' % (k, r[k]['ita'], r[k]['band']) for k in ('body', 'sheetface', 'portrait') if r.get(k)))


if __name__ == '__main__':
    main()
