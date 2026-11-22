#!/usr/bin/env python3
"""THE DEAD ON THE MAP: the pictures (WORLD 15, 11/21; VAMILY rule 360 and its amendment the same round, ask rows 384 and 394).

PAOLO 11/3: 'we don't see enough corpses even throughout the world or in the combat map... make things as realistic as possible...
billions of people have died'. AMENDED THE SAME ROUND: 'keep the bodies lore friendly... if it's a busy civilized settlement or part
of the town, obviously they don't have [corpses], but the gameplay should be very simplified'.

COOK DEAD made the thirteen dead as real models through the master rig (records/target/dead/, 11/3: the fight's camera, 42.9 px a
metre, about 117 KB a picture). The map needs them small: up close the map draws a metre at about 15 CSS px (the house models'
own scale, slices/bohemia_map_houses.js), so this copies each picture to 16 px a metre (the house sprites' own ppm), lossless WebP,
and tones it to the map's light the way the houses are toned at load (a third of the way to grey, then the map's warm dim), so the
dead and the houses are one light. Nothing is redrawn: the models are COOK DEAD's (REUSE-FIRST).

    python3 tools/bohemia_world15_the_dead_on_the_map.py          write slices/map_dead/ (13 pictures and pieces.json)
    python3 tools/bohemia_world15_the_dead_on_the_map.py --check  exit 1 if a picture or the list would change
"""
import io, json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/dead/manifest.json')
OUT = os.path.join(ROOT, 'slices/map_dead')
PPM = 16.0                      # the map's house sprites' own px a metre (slices/map_houses/manifest.json ppm)
GREY, TONE = 0.3, (0.70, 0.67, 0.62)   # slices/bohemia_map_houses.js H.grey and H.tone: the map's own light


def tone(im):
    im = im.convert('RGBA'); px = im.load(); w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not a: continue
            l = 0.299 * r + 0.587 * g + 0.114 * b
            px[x, y] = tuple(int(round((c + (l - c) * GREY) * t)) for c, t in zip((r, g, b), TONE)) + (a,)
    return im


def build():
    man = json.load(open(SRC)); src_ppm = man['px_per_metre']; k = PPM / src_ppm
    pieces, files = {}, {}
    for m in man['models']:
        pid = m['id'].split('.', 1)[1]
        im = Image.open(os.path.join(ROOT, m['picture']))
        w, h = max(1, round(im.width * k)), max(1, round(im.height * k))
        small = tone(im.resize((w, h), Image.LANCZOS))
        buf = io.BytesIO(); small.save(buf, 'WEBP', lossless=True, method=6); files[pid + '.webp'] = buf.getvalue()
        pieces[pid] = {'file': pid + '.webp', 'w': w, 'h': h, 'anchor_px': [round(m['anchor_px'][0] * k, 2), round(m['anchor_px'][1] * k, 2)],
                       'size_m': m['size_m'], 'grave': m['id'] in man['graves'], 'name': m['name'], 'from': m['picture']}
    listing = {'about': 'THE DEAD ON THE MAP (WORLD 15 11/21, rule 360): COOK DEAD\'s thirteen dead (records/target/dead/) at the map\'s '
                        '16 px a metre, toned to the map\'s light; written by tools/bohemia_world15_the_dead_on_the_map.py. Where they lie is '
                        'slices/map_dead/rules.json (the one file a modder edits).', 'ppm': PPM, 'pieces': pieces}
    files['pieces.json'] = (json.dumps(listing, indent=1) + '\n').encode()
    return files


if __name__ == '__main__':
    files = build()
    if '--check' in sys.argv:
        bad = [f for f, b in files.items() if not os.path.exists(os.path.join(OUT, f)) or open(os.path.join(OUT, f), 'rb').read() != b]
        print('in step' if not bad else 'OUT OF STEP: ' + ', '.join(bad)); sys.exit(1 if bad else 0)
    os.makedirs(OUT, exist_ok=True)
    for f, b in files.items(): open(os.path.join(OUT, f), 'wb').write(b)
    print('wrote %d pictures, %d bytes in all' % (len(files) - 1, sum(len(b) for f, b in files.items() if f.endswith('.webp'))))
