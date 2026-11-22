#!/usr/bin/env python3
"""BOHEMIA -- STAFF [the staff fight too] 11/21: the VOTE card's picture, cut from the phone's own screenshots (tools/bohemia_staff_on_the_phone.js).
Left: the fight upright on the phone at the bell, his line and his camp behind it. Right: the same moment close, the camp's people (their
tents over their bars) cut round where they stand on the glass. Nothing drawn: two crops of one screenshot, scaled with nearest pixels.
    python3 tools/bohemia_staff_the_card_picture.py <staff_demo.json> <out.webp> [png_auto autoGlass]
    (STAFF 11/22, rule 470(a): the round-three picture of an AUTO fight and where everyone stood then, for THEY FIGHT LIKE STAFF)
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main(js, out, key='png_bell', glass='onGlass'):
    rows = json.load(open(js))
    up = next(r for r in rows if r.get('shape') == 'phone_portrait' and r.get(key))
    im = Image.open(os.path.join(ROOT, up[key])).convert('RGB')
    W, H = im.size
    vw, vh = up['view']
    k = W / vw                                   # the screenshot's pixels a point (3 on his phone)
    pts = [g for g in up.get(glass, []) if g.get('staff') and g.get('px') is not None]
    allp = [g for g in up.get(glass, []) if g.get('px') is not None and (g.get('side', 'you') == 'you')]
    left_h = 1600   # taller than any phone glass, so a finger always has room to drag it (the VOTE tab gate drags the top card)
    left = im.resize((round(W * left_h / H), left_h), Image.LANCZOS)
    if pts:
        xs = [g['px'] for g in allp]; ys = [g['py'] for g in allp]
        sx = [g['px'] for g in pts]; sy = [g['py'] for g in pts]
        cx = (min(sx) + max(sx)) / 2; cy = (min(sy) + max(sy)) / 2 + 40
        half_w = max(90, (max(xs) - min(xs)) / 2 + 40); half_h = half_w * 1.4
        box = [max(0, (cx - half_w) * k), max(0, (cy - half_h) * k), min(W, (cx + half_w) * k), min(H, (cy + half_h) * k)]
        close = im.crop(tuple(round(v) for v in box))
    else:
        close = im.crop((0, H // 4, W, H * 3 // 4))
    cz = left_h / close.size[1]
    close = close.resize((round(close.size[0] * cz), left_h), Image.NEAREST if cz >= 1 else Image.LANCZOS)
    pad = 16
    canvas = Image.new('RGB', (left.size[0] + close.size[0] + pad * 3, left_h + pad * 2), (18, 14, 10))
    canvas.paste(left, (pad, pad)); canvas.paste(close, (left.size[0] + pad * 2, pad))
    canvas.save(out, 'WEBP', quality=82, method=6)
    print('wrote', out, canvas.size, os.path.getsize(out) // 1024, 'KB')


def sideways(js, out, key='png_auto', glass='autoGlass'):
    """the phone on its side (the whole fight fits the glass there): the glass on top, the camp close under it, stacked"""
    rows = json.load(open(js))
    up = next(r for r in rows if r.get('shape') == 'phone_landscape' and r.get(key))
    im = Image.open(os.path.join(ROOT, up[key])).convert('RGB'); W, H = im.size; vw, vh = up['view']; k = W / vw
    pts = [g for g in up.get(glass, []) if g.get('staff') and g.get('px') is not None and g['px'] >= 0]
    top_w = 1600; top = im.resize((top_w, round(H * top_w / W)), Image.LANCZOS)
    sx = [g['px'] for g in pts]; sy = [g['py'] for g in pts]
    cx = (min(sx) + max(sx)) / 2 + 20; cy = (min(sy) + max(sy)) / 2 + 30; hw = max(70, (max(sx) - min(sx)) / 2 + 60); hh = hw * 0.45
    box = (round(max(0, (cx - hw) * k)), round(max(0, (cy - hh) * k)), round(min(W, (cx + hw) * k)), round(min(H, (cy + hh) * k)))
    close = im.crop(box); cz = top_w / close.size[0]; close = close.resize((top_w, round(close.size[1] * cz)), Image.NEAREST if cz >= 1 else Image.LANCZOS)
    pad = 16; canvas = Image.new('RGB', (top_w + pad * 2, top.size[1] + close.size[1] + pad * 3), (18, 14, 10))
    canvas.paste(top, (pad, pad)); canvas.paste(close, (pad, top.size[1] + pad * 2))
    canvas.save(out, 'WEBP', quality=82, method=6)
    print('wrote', out, canvas.size, os.path.getsize(out) // 1024, 'KB')


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--sideways': sideways(*sys.argv[2:6])
    else: main(*sys.argv[1:5])
