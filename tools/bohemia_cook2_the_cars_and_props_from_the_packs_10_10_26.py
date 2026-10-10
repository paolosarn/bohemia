#!/usr/bin/env python3
"""COOK TWO [the cars and the props from the packs] (Paolo 10/10: 'the cars is an asset we downloaded'; rule 82a).
The fight's cover pieces cut from his HD pack sprites (banks/BOHEMIA_HD_TILE_REPO_part1-4.txt), every one UP in
banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt, keyed (pack, idx) in kit_cover.json. Nothing is redrawn: the
sprite is scaled to its real size in metres (42.9 px a metre, the house tile's), nearest-neighbour, and given
one contact shadow (the board's south-seen light) so it sits on the ground instead of floating. Weathering is
the pack's own.
The cars: his '9. Abandoned cards' wrecks are drawn three-quarter, which the 45 DEGREE ART LAW wants; the old
cover cars were his top-down '10. Abandoned cars' squashed with a mirrored smear standing in for a side.
Analog horror: the pack's rust and burned glass, nothing added; the dread is a patrol car nobody came back for.
[bb cover] Battle Brothers' battlefield props are hand-painted three-quarter sprites with a baked contact shadow;
so are these, from his packs.
REFERENCE CHECK: the twin is the pack sheet itself (reference/art_bank/, COOK's), side by side in the VOTE picture.
  python3 tools/bohemia_cook2_the_cars_and_props_from_the_packs_10_10_26.py
"""
import json, base64, io, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(R, 'slices/fight_ground'); OUT = os.path.join(G, 'kit_cover')
PXM = 515 / 12.0
packs = {}
for i in (1, 2, 3, 4): packs.update(json.load(open(os.path.join(R, f'banks/BOHEMIA_HD_TILE_REPO_part{i}.txt')))['packs'])
UP = {(v['pack'], v['idx']) for v in json.load(open(os.path.join(R, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))['verdicts'] if v['v'] == 'UP'}
CARS, BAR, ST = '9. Abandoned cards', '3. Barricades and blockades', '15. Street props'
# key: (pack, idx, width in metres on screen, or minus the HEIGHT for a tall thing, what it is). The three car keys are COMBAT TWO's cover names.
PIECES = {
    'car_lane':  (CARS, 0, 4.6, 'DEAD CAR, IN THE LANE'),
    'car_kerb':  (CARS, 2, 4.6, 'DEAD CAR, AT THE KERB'),
    'car_drive': (CARS, 21, 4.8, 'DEAD PATROL CAR, ON THE DRIVE'),
    'car_suv':   (CARS, 9, 5.0, 'DEAD SUV'),
    'car_burned': (CARS, 30, 4.6, 'BURNED-OUT CAR'),
    'jersey':    (BAR, 4, 3.0, 'CONCRETE BARRIER'),
    'barricade': (BAR, 13, 2.0, 'ROAD BARRICADE'),
    'sandbags':  (BAR, 0, 1.8, 'SANDBAGS'),
    'barrel':    (BAR, 16, 1.3, 'OIL DRUMS'),
    'tyres':     (BAR, 5, 1.4, 'TYRE STACK'),
    'lamp':      (ST, 4, -6.0, 'STREET LAMP'),
    'pole':      (ST, 3, -6.0, 'DEAD LAMP POST'),
    'cone':      (ST, 9, 0.45, 'TRAFFIC CONE'),
    'bin':       (ST, 21, 0.7, 'TRASH CAN'),
    'pallet':    (ST, 40, 1.2, 'PALLET'),
    'tyre':      (ST, 43, 0.8, 'TYRE'),
}

def sprite(pack, idx):
    e = packs[pack][idx]
    return Image.open(io.BytesIO(base64.b64decode(e['b64'] if isinstance(e, dict) else e))).convert('RGBA')

def cut(pack, idx, w_m):
    assert (pack, idx) in UP, (pack, idx, 'is not UP in his confirmed set')
    im = sprite(pack, idx); im = im.crop(im.getbbox())
    if w_m < 0:   # a tall thing is sized by its HEIGHT in metres, seen at 45 degrees (x cos45)
        h = round(-w_m * 0.7071 * PXM); w = max(4, round(im.width * h / im.height))
    else:
        w = max(4, round(w_m * PXM)); h = max(4, round(im.height * w / im.width))
    im = im.resize((w, h), Image.NEAREST)
    # one contact shadow: the sprite's own footprint (its bottom third), flattened, dark, offset down a little
    pad = 8; out = Image.new('RGBA', (w + pad * 2, h + pad * 2), (0, 0, 0, 0))
    a = np.asarray(im)[..., 3]; foot = np.zeros_like(a); t = int(h * 0.55); foot[t:] = a[t:]
    sh = Image.fromarray((foot > 0).astype(np.uint8) * 110).filter(ImageFilter.GaussianBlur(2))
    out.paste((10, 9, 8, 255), (pad + 3, pad + 5), sh)
    out.alpha_composite(im, (pad, pad))
    return out

def main():
    os.makedirs(OUT, exist_ok=True)
    man = {'lane': 'cook 2', 'rule': '87 / 82a', 'px_per_metre': PXM, 'anchor': 'bottom-centre of the sprite is the ground point',
           'note': 'COMBAT TWO: point cover[car_lane|car_kerb|car_drive].src at kit_cover/; the rest are new pieces to place', 'pieces': {}}
    for k, (pack, idx, w_m, name) in PIECES.items():
        im = cut(pack, idx, w_m); im.save(os.path.join(OUT, 'cover_' + k + '.webp'), lossless=True)
        man['pieces']['cover_' + k] = dict(src='cover_' + k + '.webp', keys=[{'pack': pack, 'idx': idx}], width_m=w_m, name=name, size_px=list(im.size))
    man['pieces']['kit_cover_sheet'] = dict(src='kit_cover_sheet.webp', keys=[{'pack': p, 'idx': i} for p, i, _, _ in PIECES.values()],
                                            note='every piece on his street kit, for DIRECTION beside the pack sheet')
    json.dump(man, open(os.path.join(OUT, 'kit_cover.json'), 'w'), indent=1)
    # rule 89: the SAME place on the live fight block, the old cars against his cars, one art px to one phone px
    blk = Image.open(os.path.join(G, 'block_main_1.webp')).convert('RGBA')
    box = (1300, 600, 1885, 1060)
    def scene(cars):
        b = blk.copy()
        for name, x, y in (('car_lane', 1420, 870), ('car_kerb', 1700, 830)):
            s = cars[name]; b.alpha_composite(s, (x - s.width // 2, y - s.height))
        return b.crop(box)
    old = {k: Image.open(os.path.join(G, f'cover_{k}.webp')).convert('RGBA') for k in ('car_lane', 'car_kerb')}
    new = {k: Image.open(os.path.join(OUT, f'cover_{k}.webp')).convert('RGBA') for k in ('car_lane', 'car_kerb')}
    W = box[2] - box[0]; H = box[3] - box[1]
    sheet = Image.new('RGB', (W * 2 + 10, H + 40), (14, 14, 14))
    sheet.paste(scene(old).convert('RGB'), (0, 40)); sheet.paste(scene(new).convert('RGB'), (W + 10, 40))
    d = ImageDraw.Draw(sheet)
    d.text((8, 12), 'BEFORE  the cars in the fight now', fill=(235, 235, 235)); d.text((W + 18, 12), 'AFTER  his downloaded wrecks, same spot', fill=(235, 235, 235))
    sheet.save(os.path.join(R, 'slices/vote/COOK2_THE_CARS_BEFORE_AFTER.png'))
    # the whole kit on his asphalt, for DIRECTION beside the pack sheet
    ks = sorted(k for k in man['pieces'] if k != 'kit_cover_sheet'); bg = Image.open(os.path.join(G, 'kit_street/road_ew_both.webp')).convert('RGBA')
    sheet2 = Image.new('RGBA', (515 * 4, 364 * ((len(ks) + 3) // 4)))
    for i, k in enumerate(ks):
        t = bg.copy(); s = Image.open(os.path.join(OUT, k + '.webp')); t.alpha_composite(s, ((515 - s.width) // 2, max(0, 300 - s.height)))
        sheet2.paste(t, ((i % 4) * 515, (i // 4) * 364))
    sheet2.convert('RGB').save(os.path.join(OUT, 'kit_cover_sheet.webp'), lossless=True)
    print(len(PIECES), 'pieces')

if __name__ == '__main__':
    main()
