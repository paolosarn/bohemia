#!/usr/bin/env python3
"""BOHEMIA -- EYES AND EARS: CAN YOU FIND THE ENEMY, THE MEASURING HALF (E10, 9/5/26)

The catching half (bohemia_eyes_find_the_enemy.js) walks the shipped game until a
hostile body is ON THE GLASS and writes down where the renderer put it. This half
answers the question on the finished picture:

  COULD A COLD PLAYER FIND THIS BODY IN ONE GLANCE?

  VALUE GAP    the body's median brightness against the ring of ground around it.
               A player finds a body by VALUE long before colour. Under about 15 of
               255 at a glance, on a phone, in daylight, a body is furniture.
  GREYSCALE    the same gap with the colour thrown away, which is what a colour-blind
               player and a dark room both see. If the colour gap is large and the
               grey gap is small, the body is being found by hue alone.
  COMING       the crew's own state from the module. The approach is the tell, so a
               body that is closing is easier to find than the same body standing.

It never says whether the body looks good. It says whether it can be found.

USAGE:  python3 tools/bohemia_eyes_find_the_enemy.py CAUGHT.json
"""
import sys, json
import numpy as np
from PIL import Image


def luma(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def main():
    d = json.load(open(sys.argv[1]))
    if not d.get('onGlass'):
        print('no body was on the glass in that run, so there is nothing to measure.')
        return
    im = Image.open(d['shot']).convert('RGB')
    scale = im.size[0] / 390.0
    cx, cy = d['canvas']['left'], d['canvas']['top']
    fx, fy = d['frame']['x'], d['frame']['y']
    a = np.asarray(im, dtype=np.float64)
    rows = []
    for i, r in enumerate(d['onGlass']):
        x = (r['x'] + cx + fx) * scale
        y = (r['y'] + cy + fy) * scale
        w, h = r['w'] * scale, r['h'] * scale
        x0, y0 = int(max(0, x)), int(max(0, y))
        x1, y1 = int(min(a.shape[1], x + w)), int(min(a.shape[0], y + h))
        if x1 - x0 < 8 or y1 - y0 < 8:
            continue
        body = a[y0:y1, x0:x1]
        pad = int(min(w, h) * 0.6)
        rx0, ry0 = max(0, x0 - pad), max(0, y0 - pad)
        rx1, ry1 = min(a.shape[1], x1 + pad), min(a.shape[0], y1 + pad)
        ring = a[ry0:ry1, rx0:rx1].copy()
        ring[y0 - ry0:y1 - ry0, x0 - rx0:x1 - rx0] = np.nan     # the ring is what is AROUND it
        bl, rl = luma(body), luma(ring)
        value_gap = float(np.nanmedian(bl) - np.nanmedian(rl))
        colour_gap = float(np.nanmedian(np.abs(np.nanmedian(body.reshape(-1, 3), axis=0)
                                               - np.nanmedian(ring.reshape(-1, 3), axis=0))))
        rows.append({'body': i + 1, 'value_gap': round(value_gap, 1),
                     'colour_gap': round(colour_gap, 1),
                     'found': abs(value_gap) >= 15,
                     'hue_only': abs(value_gap) < 15 <= colour_gap,
                     'box': [x0, y0, x1 - x0, y1 - y0]})
    print('CAN A COLD PLAYER FIND THEM? (%d bodies on the glass, crews %s)'
          % (len(rows), ', '.join(sorted({c.get('state') or '?' for c in d.get('crews', [])})) or 'unknown'))
    print('-' * 72)
    for r in rows:
        print('  body %d   value gap %+6.1f of 255   colour gap %5.1f   %s%s'
              % (r['body'], r['value_gap'], r['colour_gap'],
                 'FOUND' if r['found'] else 'NOT FOUND',
                 '   (found by HUE ONLY -- gone in greyscale)' if r['hue_only'] else ''))
    found = sum(1 for r in rows if r['found'])
    print('-' * 72)
    print('  %d of %d bodies clear the glance threshold (15 of 255 in value).' % (found, len(rows)))
    if rows and found == 0:
        print('  NOT ONE of them separates from the ground by value. On a phone, in daylight,')
        print('  they are furniture until they move.')
    json.dump(rows, open(sys.argv[1].replace('.json', '_verdict.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
