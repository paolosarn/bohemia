#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the shadow line and the choppy fall] (10/18): pack the party film
(tools/bohemia_animation_the_shadow_line_film.js) into one lossless strip per walk the VOTE page plays:
slices/vote/ANIMATION_THE_SHADOW_LINE_<WALK>.webp, 48 pictures in four rows of twelve, each 160 x 110 map px at the
phone's 3x (rule 89). REFERENCE CHECK (the 9/4 standing duty): the frames are the map's own, packed, never redrawn.
usage: python3 tools/bohemia_animation_the_shadow_line_film.py <frames dir>
"""
import os, sys, json
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = sys.argv[1]
out = {}
for walk in ('across', 'back'):
    fs = sorted(f for f in os.listdir(D) if f.startswith('party_%s_' % walk))
    if not fs: continue
    W, H = Image.open(os.path.join(D, fs[0])).size
    sheet = Image.new('RGB', (W * 12, H * ((len(fs) + 11) // 12)))
    for i, f in enumerate(fs):
        sheet.paste(Image.open(os.path.join(D, f)).convert('RGB'), ((i % 12) * W, (i // 12) * H))
    p = os.path.join(ROOT, 'slices/vote/ANIMATION_THE_SHADOW_LINE_%s.webp' % walk.upper())
    sheet.save(p, lossless=True, quality=100, method=6)
    out[walk] = dict(webp=os.path.relpath(p, ROOT), pictures=len(fs), cell=[W, H], bytes=os.path.getsize(p))
print(json.dumps(out))
