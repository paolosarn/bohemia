#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS: CAN HE READ IT (lane 17, E2, 9/5/26)

THE DOM CANNOT ANSWER THIS AND THAT IS THE POINT. A page can dim its own dialogue
with a scrim drawn OVER the text: every style still says gold on black, and the
player sees a grey smudge. So the DOM says WHERE the words are and the finished
picture says WHAT THEY LOOK LIKE -- text rectangles in, contrast out.

The number is WCAG's contrast ratio, computed between the brightest and darkest
clusters inside the rectangle (the ink and the paper, whatever they turned out to
be). 4.5:1 is the readable floor for body text, 3:1 for large text. A game is not a
web page, but a line the player cannot read is a defect in any medium.

USAGE:  python3 tools/bohemia_eyes_readable.py PROBE.json SHOT_DIR
"""
import sys, json, os
import numpy as np
from PIL import Image


def lum(c):
    c = np.asarray(c, dtype=np.float64) / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    l1, l2 = lum(a), lum(b)
    hi, lo = max(l1, l2), min(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


GLASS_W, GLASS_H = 390, 844


def read_box(img, r, scale):
    """ONLY WHAT IS ON THE GLASS. A tab scrolled off the side of the bar still has a
    rectangle, and sampling it reads whatever happens to be at those coordinates --
    which is how the first run of this check reported nine tab labels at 1.00:1 that
    a player never sees. A rectangle is measured only if it lies inside the phone."""
    if r['x'] < -1 or r['y'] < -1 or r['x'] + r['w'] > GLASS_W + 1 or r['y'] + r['h'] > GLASS_H + 1:
        return None
    x, y, w, h = [int(v * scale) for v in (r['x'], r['y'], r['w'], r['h'])]
    if w < 4 or h < 4:
        return None
    crop = np.asarray(img.crop((x, y, x + w, y + h)).convert('RGB')).reshape(-1, 3)
    if len(crop) < 16:
        return None
    l = np.array([lum(c) for c in crop[::max(1, len(crop) // 400)]])
    if l.size < 8:
        return None
    ink = crop[::max(1, len(crop) // 400)][np.argsort(l)]
    dark = ink[:max(1, len(ink) // 10)].mean(axis=0)      # the darkest tenth
    light = ink[-max(1, len(ink) // 10):].mean(axis=0)    # the lightest tenth
    return round(float(ratio(dark, light)), 2)


def shot_name(label):
    """The same name the probe writes: every run of non-alphanumerics becomes one _."""
    out, prev = [], False
    for ch in label:
        if ch.isalnum():
            out.append(ch); prev = False
        elif not prev:
            out.append('_'); prev = True
    return ''.join(out) + '.png'


if __name__ == '__main__':
    probe = json.load(open(sys.argv[1]))
    shots = sys.argv[2]
    rows = []
    for surface in probe['surfaces']:
        for screen in surface['screens']:
            f = os.path.join(shots, shot_name(screen['where']))
            if not os.path.exists(f):
                continue
            img = Image.open(f)
            scale = img.size[0] / GLASS_W
            for r in screen.get('textRects', []):
                v = read_box(img, r, scale)
                if v is None:
                    continue
                floor = 3.0 if r['px'] >= 24 else 4.5
                if v < floor:
                    rows.append({'screen': screen['where'], 'contrast': v, 'floor': floor,
                                 'px': r['px'], 'el': r['el']})
    rows.sort(key=lambda x: x['contrast'])
    print('LINES THE FINISHED PICTURE SAYS HE CANNOT READ: %d' % len(rows))
    for r in rows[:14]:
        print('   %5.2f:1 (needs %.1f) %3dpx  %-24s %s' % (r['contrast'], r['floor'], r['px'], r['screen'], r['el'][:64]))
    json.dump(rows, open(os.path.join(shots, 'readable.json'), 'w'), indent=1)
