#!/usr/bin/env python3
"""BOHEMIA -- STAFF 2 [the staff as built] 11/26 (VAMILY rule 482): the VOTE card's picture, cut from the phone's own screenshots
(tools/bohemia_staff_cart_on_the_phone.js, tools/bohemia_staff_hire_reads.js) and the carts' twins sheet (tools/bohemia_staff_the_cart.py
sheet). Nothing drawn: crops of the game's own glass, scaled with nearest pixels, two panels a row, tall (the VOTE tab drags it):
  THE THREE CARTS (the wire cart, the yellow utility cart, the red wagon; each on a camp person's own fight cell)  |  THE FIGHT, close
  THE SCARED RUN (the fight's own canvas, mid-walk, round the camp person getting away)                          |  THE END SCREEN (the cook mourned)
  THE HALL (the cook's trade says your last one fell; someone new)
    python3 tools/bohemia_staff_as_built_card_picture.py <cart_demo.json> <hire_demo.json> <out.webp>
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = (18, 14, 10)


def fit(im, w, h):
    k = min(w / im.size[0], h / im.size[1])
    out = im.resize((max(1, round(im.size[0] * k)), max(1, round(im.size[1] * k))), Image.NEAREST if k >= 1 else Image.LANCZOS)
    c = Image.new('RGB', (w, h), BG); c.paste(out, ((w - out.size[0]) // 2, (h - out.size[1]) // 2)); return c


def crop_frac(path, x0, y0, x1, y1):
    im = Image.open(os.path.join(ROOT, path)).convert('RGB'); W, H = im.size
    return im.crop((round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H)))


def main(cart_js, hire_js, out):
    up = next(r for r in json.load(open(cart_js)) if r.get('shape') == 'phone_portrait')
    hall = next((r for r in json.load(open(hire_js)) if r.get('shape') == 'phone_portrait'), None)
    panels = []
    # THE THREE CARTS: the twins sheet's SE turn of each (the wire cart, the yellow utility cart, the red wagon), side by side
    tw = Image.open(os.path.join(ROOT, 'records/target/staff_cart/the_carts_on_the_camp.png')).convert('RGB')
    cw, ch = tw.size[0] // 8, tw.size[1] // 3
    bg = tw.getpixel((2, 2)); cells_ = []
    for r in range(3):
        c = tw.crop((1 * cw, r * ch, 2 * cw, (r + 1) * ch))
        diff = Image.eval(Image.merge('RGB', [Image.eval(ch_, lambda v, k=k: 255 if abs(v - bg[k]) > 10 else 0) for k, ch_ in enumerate(c.split())]).convert('L'), lambda v: 255 if v else 0)
        bb = diff.getbbox() or (0, 0, c.size[0], c.size[1]); cells_.append(c.crop((max(0, bb[0] - 8), max(0, bb[1] - 8), min(c.size[0], bb[2] + 8), min(c.size[1], bb[3] + 8))))
    hh = max(x.size[1] for x in cells_); three = Image.new('RGB', (sum(x.size[0] for x in cells_) + 24, hh), bg); xo = 0
    for x in cells_: three.paste(x, (xo, hh - x.size[1])); xo += x.size[0] + 12
    panels.append(three)   # wire, yellow, red: tight round each cart and its camp person
    panels.append(crop_frac(up['png_close'], 0.0, 0.09, 1.0, 0.56))
    # THE SCARED RUN: the fight's canvas at the middle of the walk, round him (two tiles each way)
    fs_ = up.get('fear') and up['fear'].get('shot')
    if up.get('png_fear') and fs_ and fs_.get('x') is not None:
        im = Image.open(os.path.join(ROOT, up['png_fear'])).convert('RGB'); t = max(40, fs_.get('tile') or 120)
        panels.append(im.crop((max(0, int(fs_['x'] - 1.8 * t)), max(0, int(fs_['y'] - 3.0 * t)), min(im.size[0], int(fs_['x'] + 1.6 * t)), min(im.size[1], int(fs_['y'] + 0.8 * t)))))
    if up.get('png_mourn'): panels.append(crop_frac(up['png_mourn'], 0.0, 0.25, 1.0, 0.75))
    if hall and hall.get('png'): panels.append(crop_frac(hall['png'], 0.0, 0.40, 1.0, 0.95))
    W, H, pad = 600, 900, 12
    cells = [fit(p, W, H) for p in panels]
    n = (len(cells) + 1) // 2
    canvas = Image.new('RGB', (W * 2 + pad * 3, H * n + pad * (n + 1)), BG)
    for i, p in enumerate(cells): canvas.paste(p, (pad + (i % 2) * (W + pad), pad + (i // 2) * (H + pad)))
    canvas.save(out, 'WEBP', quality=82, method=6)
    print('wrote', out, canvas.size, os.path.getsize(out) // 1024, 'KB', len(panels), 'panels')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3])
