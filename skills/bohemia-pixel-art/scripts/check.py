#!/usr/bin/env python3
"""BOHEMIA PIXEL ART -- THE ONE CHECK a cook runs on a candidate before it goes to DIRECTION.

    python3 skills/bohemia-pixel-art/scripts/check.py <candidate.png> <family>
    family: road | ground | marking | settlement | door | lamp | prop

It runs, in one go, every measure the repo already owns, with the limits measured on HIS PACKS (references/faults.md):
  1. THE CARD (tools/bohemia_direction_the_card_of_numbers.py --judge): size floor, colours, top eight, value span,
     saturation, light, edge, grain, on the family's own tenth/ninetieth bands.
  2. STRAY PIXELS AT 8 VALUE STEPS: a pixel whose light-and-dark step no 4-neighbour shares. His tiles: 6 to 12%
     (median), never over 19% (ninetieth). Exact-colour orphans are NOT a fault here: his tiles hold thousands of
     colours, so nearly every pixel is a unique colour, and the 7/27 audit would fail his own pack.
  3. ONE PIXEL SIZE: the 7/27 audit's block size must be 1 (no mixels, never scaled by a non-integer).
  4. BANDING: the eyes tool's banding share must be 0 (his tiles: 0 in every family).
  5. LIGHT FROM ABOVE: the 7/27 audit's light angle, brighter toward the top (his tiles: 240 to 266 degrees, where
     270 is straight up and 180 is left); a flat tile makes no claim and passes.
BACK = the card says BACK (three of its eight out) or two craft rows out. Calibrated on his own tiles (see
references/faults.md). Exit 0 = to DIRECTION's eye, 1 = BACK. It never says 'looks good' (rule 108 ROUND TEN): it says built right or not.

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (his 7/13 UP set in
reference/art_bank), the card of numbers (records/BOHEMIA_THE_CARD_OF_NUMBERS_10_10_26.md), AH-01, AH-03. No reference game.
"""
import os, sys, subprocess, importlib.util
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
ORPHAN8_P90 = {'road': 0.128, 'ground': 0.153, 'settlement': 0.188, 'door': 0.071, 'lamp': 0.178, 'prop': 0.141, 'marking': 0.113}


def mod(rel):
    s = importlib.util.spec_from_file_location(os.path.basename(rel)[:-3], os.path.join(ROOT, rel))
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m


def orphan8(im):
    a = np.asarray(im.convert('RGBA')).astype(float); op = a[..., 3] > 127
    q = ((a[..., :3] @ [0.299, 0.587, 0.114]) / 32).astype(int); q[~op] = -1
    p = np.pad(q, 1, constant_values=-2)
    same = (p[:-2, 1:-1] == q) | (p[2:, 1:-1] == q) | (p[1:-1, :-2] == q) | (p[1:-1, 2:] == q)
    return float(((~same) & op).sum() / max(1, op.sum()))


def main():
    if len(sys.argv) < 3 or sys.argv[2] not in ORPHAN8_P90:
        sys.exit(__doc__)
    png, fam = sys.argv[1], sys.argv[2]
    im = Image.open(png).convert('RGBA'); bad = 0
    print('== THE CARD')
    r = subprocess.run([sys.executable, os.path.join(ROOT, 'tools/bohemia_direction_the_card_of_numbers.py'), '--judge', png, fam],
                       capture_output=True, text=True)
    print(r.stdout.strip()); card_back = r.returncode != 0
    A = mod('tools/bohemia_pixel_craft_audit.py'); E = mod('tools/bohemia_eyes_pixel_tells.py')
    a = A.audit_tile(im); e = E.look(im)
    o = orphan8(im)
    rows = [('stray pixels at 8 steps <= %.0f%%' % (100 * ORPHAN8_P90[fam]), '%.1f%%' % (100 * o), o <= ORPHAN8_P90[fam]),
            ('one pixel size (block 1)', a['block_size'], a['block_size'] == 1),
            ('no banding', e.get('banding_pct'), not e.get('banding_pct')),
            ('light from above (180 to 360 degrees, or flat)', a['light_deg'], a['light_deg'] is None or 180 <= a['light_deg'] <= 360)]
    print('== THE CRAFT')
    for t, v, ok in rows:
        print(('OK   ' if ok else 'OUT  ') + t + ': ' + str(v)); bad += not ok
    back = card_back or bad >= 2   # one craft row out is allowed: one in ten of his own tiles sits outside each row
    print('-> ' + ('BACK: fix the OUT rows first' if back else 'built right; to DIRECTION (%d craft row out)' % bad))
    sys.exit(1 if back else 0)


if __name__ == '__main__':
    main()
