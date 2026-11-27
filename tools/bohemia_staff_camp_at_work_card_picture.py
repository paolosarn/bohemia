#!/usr/bin/env python3
"""BOHEMIA -- STAFF 2 [the camp at its work] 11/27 (VAMILY rule 482): the VOTE card's picture, cut from the phone's own screenshots
(tools/bohemia_staff_at_work_on_the_phone.js, tools/bohemia_staff_at_his_place_on_the_phone.js). Nothing drawn: crops of the game's own
glass, scaled with nearest pixels, two panels a row, tall (the VOTE tab drags it):
  THE CAMP, on its side (the whole camp: the cook at her pot, the surgeon kneeling by the man lying hurt, the blacksmith at his hammer)
  THE CAMP, upright, close on the surgeon and the hurt man   |   HIS PLACE: the camera finds the blacksmith   |   HIS PLACE: the cook
    python3 tools/bohemia_staff_camp_at_work_card_picture.py <out.webp> [demo|alpha]
"""
import os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = (18, 14, 10)
D = os.path.join(ROOT, 'records/target/staff_cart')


def fit(im, w, h):
    k = min(w / im.size[0], h / im.size[1])
    out = im.resize((max(1, round(im.size[0] * k)), max(1, round(im.size[1] * k))), Image.NEAREST if k >= 1 else Image.LANCZOS)
    c = Image.new('RGB', (w, h), BG); c.paste(out, ((w - out.size[0]) // 2, (h - out.size[1]) // 2)); return c


def crop_frac(name, x0, y0, x1, y1):
    im = Image.open(os.path.join(D, name)).convert('RGB'); W, H = im.size
    return im.crop((round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H)))


def main(out, tag='demo'):
    panels = [
        crop_frac(tag + '_upright_the_camp_at_work.png', 0.18, 0.30, 0.82, 0.56),      # upright, close on the surgeon by the hurt man
        crop_frac(tag + '_upright_the_camp_at_work.png', 0.55, 0.18, 1.0, 0.36),       # upright, close on the cook at her pot
        crop_frac(tag + '_sideways_the_camp_at_work.png', 0.08, 0.30, 0.62, 0.92),     # on its side: the camp at its work
        crop_frac(tag + '_upright_his_place_3_cam3.png', 0.0, 0.10, 1.0, 0.62),        # his place: WALT  BLACKSMITH
        crop_frac(tag + '_upright_his_place_1_cam1.png', 0.0, 0.10, 1.0, 0.62),        # his place: RAUL  GRINDER, the surgeon by him
        crop_frac(tag + '_upright_his_place_4_cam1.png', 0.0, 0.10, 1.0, 0.62),        # his place: GRACIELA  COOK
    ]
    W, H, pad = 600, 900, 12
    cells = [fit(p, W, H) for p in panels]
    n = (len(cells) + 1) // 2
    canvas = Image.new('RGB', (W * 2 + pad * 3, H * n + pad * (n + 1)), BG)
    for i, p in enumerate(cells): canvas.paste(p, (pad + (i % 2) * (W + pad), pad + (i // 2) * (H + pad)))
    canvas.save(out, 'WEBP', quality=82, method=6)
    print('wrote', out, canvas.size, os.path.getsize(out) // 1024, 'KB', len(panels), 'panels')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else 'demo')
