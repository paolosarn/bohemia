#!/usr/bin/env python3
"""BOHEMIA -- STAFF 2 [the staff push a cart] 11/22: the VOTE card's picture, cut from the phone's own screenshots
(tools/bohemia_staff_cart_on_the_phone.js) and the carts' twins sheet (tools/bohemia_staff_the_cart.py sheet). Nothing drawn: crops of
the game's own glass, scaled with nearest pixels, laid side by side:
  top:    THE FIGHT, close (his camp at the bell, each with his cart)  |  THE THREE CARTS (the cook, the surgeon, the blacksmith, four turns)
  bottom: IT GOES OVER (the cook struck down, her cart on its side)    |  THE MAP (his camp walks behind him)  |  THE CAMP and THE FORGE
    python3 tools/bohemia_staff_cart_card_picture.py <cart_demo.json> <out.webp> [cart_demo_forge.json]
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = (18, 14, 10)


def fit(im, w, h, nearest=True):
    k = min(w / im.size[0], h / im.size[1])
    out = im.resize((max(1, round(im.size[0] * k)), max(1, round(im.size[1] * k))), Image.NEAREST if (nearest and k >= 1) else Image.LANCZOS)
    c = Image.new('RGB', (w, h), BG); c.paste(out, ((w - out.size[0]) // 2, (h - out.size[1]) // 2)); return c


def crop_frac(path, x0, y0, x1, y1):
    im = Image.open(os.path.join(ROOT, path)).convert('RGB'); W, H = im.size
    return im.crop((round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H)))


def crop_at(path, cx, cy, half_w, half_h, k):
    im = Image.open(os.path.join(ROOT, path)).convert('RGB'); W, H = im.size
    return im.crop((max(0, round((cx - half_w) * k)), max(0, round((cy - half_h) * k)), min(W, round((cx + half_w) * k)), min(H, round((cy + half_h) * k))))


def main(js, out, forge_js=None):
    rows = json.load(open(js))
    if forge_js:   # the forge's real tap, run on its own (--forge-only): its picture joins the walk's
        F = {r['shape']: r for r in json.load(open(forge_js))}
        for r in rows:
            if F.get(r['shape'], {}).get('png_forge'): r['png_forge'] = F[r['shape']]['png_forge']
    up = next(r for r in rows if r.get('shape') == 'phone_portrait')
    side = next((r for r in rows if r.get('shape') == 'phone_landscape'), up)
    k = Image.open(os.path.join(ROOT, up['png_bell'])).size[0] / up['view'][0]
    panels = []
    # THE FIGHT, close: the fight's own camera pinched in on his camp (the top half of the glass, under the bark)
    panels.append(crop_frac(up['png_close'], 0.18, 0.09, 1.0, 0.56))
    # THE THREE CARTS: the twins sheet's S, SE, E and W turns
    tw = Image.open(os.path.join(ROOT, 'records/target/staff_cart/the_carts_on_the_camp.png')).convert('RGB')
    cw, ch = tw.size[0] // 8, tw.size[1] // 3
    sheet = Image.new('RGB', (cw * 4, ch * 3), BG)
    for r in range(3):
        for i, c in enumerate((0, 1, 2, 6)):
            sheet.paste(tw.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)), (i * cw, r * ch))
    panels.append(sheet)
    # IT GOES OVER: round the cook where she fell
    ts = side.get('tipAt'); ks = Image.open(os.path.join(ROOT, side['png_tip'])).size[0] / side['view'][0]   # on its side the whole board is on the glass (upright the camp's west edge is off it)
    panels.append(crop_at(side['png_tip'], ts['x'] + 70, ts['y'] - 30, 130, 85, ks) if ts else crop_frac(side['png_tip'], 0.2, 0.3, 0.7, 0.8))
    # THE MAP: round his camp's file and him
    m = up.get('map') or {}
    pts = [(p[0], p[1]) for p in (m.get('at') or [])] + ([(m['you']['x'], m['you']['y'])] if m.get('you') else [])
    if pts:
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2 - 20
        panels.append(crop_at(up['png_map'], cx, cy, max(90, (max(xs) - min(xs)) / 2 + 60), max(80, (max(ys) - min(ys)) / 2 + 70), k))
    else:
        panels.append(crop_frac(up['png_map'], 0.1, 0.2, 0.9, 0.5))
    # THE CAMP by the fire (sideways: the whole camp) and THE FORGE's rows
    panels.append(crop_frac(up['png_camp'], 0.0, 0.12, 1.0, 0.57))   # upright, the camp by its fire (on its side the camp had ended itself before the picture)
    if up.get('png_forge'): panels.append(crop_frac(up['png_forge'], 0.0, 0.23, 1.0, 0.66))
    top = [fit(panels[0], 900, 800), fit(panels[1], 900, 800)]
    bot = [fit(p, 600, 800, nearest=True) for p in panels[2:5]]
    if len(panels) > 5: bot = [fit(panels[2], 450, 800), fit(panels[3], 450, 800), fit(panels[4], 450, 800), fit(panels[5], 450, 800)]
    pad = 12
    W = max(sum(p.size[0] for p in top) + pad * (len(top) + 1), sum(p.size[0] for p in bot) + pad * (len(bot) + 1))
    canvas = Image.new('RGB', (W, 800 * 2 + pad * 3), BG)
    x = pad
    for p in top: canvas.paste(p, (x, pad)); x += p.size[0] + pad
    x = pad
    for p in bot: canvas.paste(p, (x, 800 + pad * 2)); x += p.size[0] + pad
    canvas.save(out, 'WEBP', quality=82, method=6)
    print('wrote', out, canvas.size, os.path.getsize(out) // 1024, 'KB')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
