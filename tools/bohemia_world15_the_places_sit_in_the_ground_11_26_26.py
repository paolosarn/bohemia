#!/usr/bin/env python3
"""THE PLACES SIT IN THE GROUND (WORLD 15, 11/26/26; VAMILY rule 480(b) on the map's places as built, rule 479's lesson).

Measures every place picture (slices/place_pieces/place_pieces.json) from ITS OWN PIXELS: where its ground plate is (the
lowest opaque row is the plate's front corner; the plate's two side corners are where its lower edges, which climb half a
pixel a pixel on the map's own angle, stop) and how high its tallest part stands (the first opaque row). It writes:
  - bx, by, plate only where the stored ones are off the picture by more than TOL pixels (measured 11/26: THE GREENHOUSES'
    plate stood 11 px right and 7 px lower in its picture than its numbers said, so it was drawn 11 px left of its block and
    7 px up off the ground; THE BANK's plate is 136 px across, not 150, so it was drawn a tenth small and 4 px up). The 17
    others are within a pixel and a quarter (the rig's own rounding) and are left as they are.
  - top: the first opaque row over both frames (the place's tap box is the picture as drawn, slices/bohemia_real_places.js).
gates/the_places_sit_in_the_ground_gate.js measures the same way and refuses a picture whose numbers are off.

    python3 tools/bohemia_world15_the_places_sit_in_the_ground_11_26_26.py [--check] [--man another_manifest.json]
"""
import json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAN = os.path.join(ROOT, 'slices', 'place_pieces', 'place_pieces.json')
TOL = 2.0


def measure(path):
    im = Image.open(path).convert('RGBA'); W, H = im.size; a = im.load()
    op = lambda x, y: a[x, y][3] > 128
    B = max(y for y in range(H) for x in range(W) if op(x, y))
    row = [x for x in range(W) if op(x, B)]; X0 = sum(row) / len(row)
    low = {}
    for x in range(W):
        ys = [y for y in range(H) if op(x, y)]
        if ys: low[x] = max(ys)
    def corner(xs):
        best = None
        for x in xs:
            if x not in low: continue
            if abs(low[x] - (B - abs(X0 - x) * 0.5)) <= 2.5 and (best is None or abs(X0 - x) > abs(X0 - best)): best = x
        return best
    lv = corner(range(0, int(X0))); rv = corner(range(int(X0) + 1, W))
    plate = rv - lv + 1
    top = min(y for y in range(H) for x in range(W) if op(x, y))
    return {'bx': (lv + rv + 1) / 2, 'by': B - (plate - 1) / 4 - 0.5, 'plate': plate, 'top': top, 'w': W, 'h': H}


def main():
    check = '--check' in sys.argv
    path = sys.argv[sys.argv.index('--man') + 1] if '--man' in sys.argv else MAN
    man = json.load(open(path))
    bad = []
    for pid, P in man['pictures'].items():
        ms = [measure(os.path.join(ROOT, 'slices', 'place_pieces', f)) for f in P['frames']]
        m = ms[0]; top = min(x['top'] for x in ms)
        off = max(abs(m['bx'] - P['bx']), abs(m['by'] - P['by']), abs(m['plate'] - P['plate']))
        line = '%-28s stored %s/%s/%s measured %.1f/%.1f/%d top %d' % (pid, P['bx'], P['by'], P['plate'], m['bx'], m['by'], m['plate'], top)
        if off > TOL:
            bad.append(pid); line += '  OFF by %.1f px' % off
            if not check: P['bx'] = int(round(m['bx'])); P['by'] = int(round(m['by'])); P['plate'] = int(m['plate']); P['sits'] = 'measured from its pixels, WORLD 15 11/26'
        if not check: P['top'] = top
        print(line)
    if not check:
        man['sits_in_the_ground'] = ('WORLD 15 11/26 (VAMILY rule 480(b)): bx/by/plate are where the picture\'s own ground plate is, measured from its '
            'pixels (tools/bohemia_world15_the_places_sit_in_the_ground_11_26_26.py; two were off: THE GREENHOUSES and THE BANK); top is its first '
            'opaque row (the tap box is the picture as drawn). slices/bohemia_place_pieces.js draws each place in depth with the painted city, '
            'so what stands in front of it is drawn over it, never under it.')
        with open(path, 'w') as f: json.dump(man, f, indent=1, ensure_ascii=False); f.write('\n')
    print(('OFF: ' + ', '.join(bad)) if bad else 'every picture sits on its numbers')
    return 1 if (check and bad) else 0


if __name__ == '__main__':
    sys.exit(main())
