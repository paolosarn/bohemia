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
    # *** MEASURE THE LETTERS, NOT THE BOX (UI lane, 9/6, [eyes: faint chips]). ***
    #
    # THE OLD METHOD WAS THE DARKEST TENTH AGAINST THE LIGHTEST TENTH, and a tenth is
    # only "the ink" if the ink really is a tenth of the box. MEASURED on the real
    # screen: the MUSIC chip is 10px text inside a 44px thumb, so the letters are
    # TWO PER CENT of its pixels -- the top tenth is therefore still background, and
    # the box scored 1.21:1, "the ink and the paper are the same brightness", about a
    # label a person reads without effort. The two-cluster answer for the same chip is
    # 6.17:1. OUTFIT: 1.21 against 5.77. PHONE, which is dark text on gold, is the same
    # error inverted: 3.24 against 6.29.
    #
    # AND IT FAILED THE OTHER WAY TOO, WHICH IS WORSE. The eight walk-pad arrows --
    # the single control that makes the game advance -- measured 4.9 to 5.1 and passed,
    # while the letters are really 4.31 to 4.46 and DO NOT clear the floor. A ruler
    # that clears the most important control in the game and condemns a chip anybody
    # can read is not strict or lenient, it is unrelated to the thing it names.
    #
    # WORST OF ALL, IT PUNISHED THE FIX: the bigger a control's tap target, the smaller
    # the share of it that is letters, so making a button MORE accessible (the 44px
    # thumb this lane shipped on 9/6) made its contrast score WORSE.
    #
    # SO: split the box at the midpoint of its own range and average each side. That is
    # ink and paper as a reader sees them, and it does not care what fraction of the
    # rectangle the letters happen to occupy.
    sample = crop[::max(1, len(crop) // 400)]
    l = np.array([lum(c) for c in sample])
    if l.size < 8:
        return None
    lo, hi = float(l.min()), float(l.max())
    mid = (lo + hi) / 2.0
    below, above = sample[l < mid], sample[l >= mid]
    if len(below) == 0 or len(above) == 0:
        return round(float(ratio(sample[int(np.argmin(l))], sample[int(np.argmax(l))])), 2)
    dark = below.mean(axis=0)
    light = above.mean(axis=0)
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
