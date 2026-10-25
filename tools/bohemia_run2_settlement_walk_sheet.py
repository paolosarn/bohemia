#!/usr/bin/env python3
"""RUN TWO [the walk-up, on the ground] (rule 169(d)): draw slices/settlement_walk.json's blocks over every settlement picture,
so a block can be checked against the art it says a person cannot stand on (red: the block as traced; orange: grown by half a
body sideways and a step at the foot, what the screen keeps the lead off). Writes records/target/settlement_walk/<pic>.png.
  python3 tools/bohemia_run2_settlement_walk_sheet.py"""
import json, os
from PIL import Image, ImageDraw
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = json.load(open(os.path.join(R, 'slices/settlement_walk.json')))
OUT = os.path.join(R, 'records/target/settlement_walk'); os.makedirs(OUT, exist_ok=True)
for src, d in W['pictures'].items():
    p = os.path.join(R, 'slices/settlement_ground_packs', src)
    if not os.path.exists(p): p = os.path.join(R, 'slices/settlement_ground', src)
    im = Image.open(p).convert('RGBA'); ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); g = ImageDraw.Draw(ov)
    for b in d['blocks']:
        g.rectangle([b[0] - 24, b[1], b[2] + 24, b[3] + 6], fill=(255, 140, 0, 50))
        g.rectangle(b, fill=(255, 0, 0, 70), outline=(255, 0, 0, 255), width=3)
    out = Image.alpha_composite(im, ov).convert('RGB').resize((im.width // 2, im.height // 2))
    out.save(os.path.join(OUT, src.replace('.webp', '.png')))
    print(src, len(d['blocks']), 'blocks')
