#!/usr/bin/env python3
"""THE HIT CHANCE LOOK, the sheet (UI [the hit chance look], rule 120(b), 10/19/26).

Lays the card's picture from the shots tools/bohemia_ui_the_hit_chance_look_shots.js took on his phone profile (three phone
pixels a css pixel). Every shot is brought down to ONE CSS PIXEL A PIXEL by taking each 3 x 3 block's middle pixel, which loses
nothing: every pixel on the fight's glass and on the slip is a whole block. Crops, never scaled. The labels are the game's own
faces (the casing, the ROM). The pack's paper twin (rule 82) sits at the foot beside the slip, both at the phone's three.

  python3 tools/bohemia_ui_the_hit_chance_look_sheet.py <shots dir>     # writes records/target/ui_hit_chance_look/
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records/target/ui_hit_chance_look')
SHOTS = sys.argv[1]
CASING = ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaCasing-Regular.ttf'), 20)
ROM = ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf'), 10)
BG, INK, DIM, GOLD = (13, 11, 9), (230, 217, 194), (156, 140, 116), (230, 196, 117)


def css(name):
    """the shot at one css pixel a pixel: each block's middle pixel"""
    im = Image.open(os.path.join(SHOTS, name + '.png')).convert('RGB')
    m = json.load(open(os.path.join(SHOTS, 'measures_' + name.split('_')[0] + '.json')))
    w = 390 if m['side'] == 'upright' else 844
    k = im.width / w
    h = round(im.height / k)
    out = Image.new('RGB', (w, h))
    px, op = im.load(), out.load()
    for y in range(h):
        sy = min(im.height - 1, int((y + 0.5) * k))
        for x in range(w):
            op[x, y] = px[min(im.width - 1, int((x + 0.5) * k)), sy]
    return out


def main():
    os.makedirs(OUT, exist_ok=True)
    up = json.load(open(os.path.join(SHOTS, 'measures_upright.json')))
    sw = json.load(open(os.path.join(SHOTS, 'measures_sideways.json')))
    by = {s['name']: s for s in up['shots'] + sw['shots']}

    def man_crop(name):
        """the slip on the man: from 40 above the slip to 30 under his feet, 300 tall at most"""
        l = by[name]['laid']
        top = max(0, min(l['box'][1], l['man'][1]) - 40)
        return (0, top, 390, min(844, top + 300))

    BOT = (0, 544, 390, 844)                  # the foot of the glass: the bar and what sits on it
    W = 24 + 390 + 30 + 390 + 24 + 30
    rows = [
        ('YOUR PISTOL ON A RAIDER IN PLATE', [('TODAY', 'upright_weak_today', BOT), ('A  ON THE MAN', 'upright_weak_A', man_crop('upright_weak_A'))]),
        (None, [('B  OUT OF THE BAR', 'upright_weak_B', BOT), ('C  IN THE BAR', 'upright_weak_C', BOT)]),
        ('ONE BEAT AFTER THE SHOT LANDS', [('A', 'upright_weak_A_after', man_crop('upright_weak_A_after')), ('B', 'upright_weak_B_after', BOT)]),
        (None, [('C', 'upright_weak_C_after', BOT), ('A RIFLE ON A THUG IN A JACKET, B', 'upright_good_B', BOT)]),
    ]
    side_rows = [('ON ITS SIDE', [('B  OUT OF THE BAR', 'sideways_weak_B', (0, 190, 844, 390))]),
                 (None, [('C  IN THE BAR', 'sideways_weak_C', (0, 190, 844, 390))])]
    H = 20
    for head, cells in rows:
        H += (38 if head else 0) + 22 + max(c[2][3] - c[2][1] for c in cells) + 22
    for head, cells in side_rows:
        H += (38 if head else 0) + 22 + 200 + 22
    twin = Image.open(os.path.join(ROOT, 'records/target/ui_one_screen/twin_19_27.png')).convert('RGBA')
    twin2 = Image.open(os.path.join(ROOT, 'records/target/ui_one_screen/twin_signage_09.png')).convert('RGBA')
    H += 38 + 22 + 3 * max(twin.height, twin2.height) + 18 + 3 * 82 + 40
    sheet = Image.new('RGB', (W, H), BG)
    g = ImageDraw.Draw(sheet)
    g.text((24, 14), 'THE HIT CHANCE UNDER YOUR FINGER', font=CASING, fill=GOLD)
    y = 20
    manifest = []

    def lay(label, name, box, x, y):
        im = css(name).crop(box)
        g.text((x, y), label, font=ROM, fill=INK)
        sheet.paste(im, (x, y + 18))
        g.rectangle((x - 1, y + 17, x + im.width, y + 18 + im.height), outline=(60, 50, 40))
        manifest.append({'cell': label, 'shot': name, 'crop': list(box), 'at': [x, y + 18]})
        return im.height

    for head, cells in rows + side_rows:
        if head:
            y += 38
            g.text((24, y - 4), head, font=CASING, fill=INK)
        hh = 0
        for i, (label, name, box) in enumerate(cells):
            hh = max(hh, lay(label, name, box, 24 + i * (390 + 30), y + 22))
        y += 22 + hh + 22
    y += 38
    g.text((24, y - 4), "HIS PACK'S PAPER, BESIDE THE SLIP (THE PHONE'S THREE PIXELS)", font=CASING, fill=INK)
    y += 22
    x = 24
    for t in (twin, twin2):
        big = t.resize((t.width * 3, t.height * 3), Image.NEAREST)
        sheet.paste(big, (x, y + 18), big)
        x += big.width + 24
    l = by['upright_weak_B']['laid']['box']
    slip = Image.open(os.path.join(SHOTS, 'upright_weak_B.png')).convert('RGB').crop((l[0] * 3, l[1] * 3, (l[0] + l[2]) * 3, (l[1] + l[3]) * 3))
    sheet.paste(slip, (24, y + 18 + 3 * max(twin.height, twin2.height) + 18))
    g.text((24, y), 'pack 19 #27 (a paper sign)     cafe menu board #9', font=ROM, fill=DIM)
    g.text((24, y + 3 * max(twin.height, twin2.height) + 22), 'the slip (B), as his phone draws it', font=ROM, fill=DIM)
    sheet.save(os.path.join(OUT, 'UI_THE_HIT_CHANCE_LOOK.png'), optimize=True)
    tw = twin.resize((twin.width * 3, twin.height * 3), Image.NEAREST)
    tw.save(os.path.join(OUT, 'twin_paper_sign.png'), optimize=True)
    for s in ('upright', 'sideways'):
        d = json.load(open(os.path.join(SHOTS, 'measures_' + s + '.json')))
        json.dump(d, open(os.path.join(OUT, 'measures_' + s + '.json'), 'w'), indent=1)
    json.dump({'sheet': 'records/target/ui_hit_chance_look/UI_THE_HIT_CHANCE_LOOK.png', 'size': [W, H], 'cells': manifest}, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('sheet', W, H, os.path.getsize(os.path.join(OUT, 'UI_THE_HIT_CHANCE_LOOK.png')))


if __name__ == '__main__':
    main()
