#!/usr/bin/env python3
"""THE FIGHT KEEPS ITS COLOUR (COOK, 10/25/26, rule 167(b)).

PAOLO 10/25: 'the combat map like went completely like almost like black and white... I was like how it was previously...
I don't know why you did that.' COOK 9cae20af had graded the fight's 121 pictures to chroma x 0.3 reading rule 159 ('no
rainbow') as 'take the colour out'; every number it was checked against passed. Rule 167(b) fenced 159: act one is faded,
dirty, rare colour, never drained toward black and white, and A GRADE THAT CUTS COLOUR BY MORE THAN HALF GOES TO HIM FIRST.
A rule with no machine gate is not enforced, so this is that gate for the fight board.

LEGS
  K1 the remembered colour is here: gates/the_fight_keeps_its_colour.json holds every fight picture's median CIELAB chroma
     (opaque pixels, read at a quarter size) as he knew it (9cae20af's parent, put back by COOK [the fight board's colour back])
  K2 *** NO FIGHT PICTURE HAS LOST MORE THAN HALF ITS COLOUR *** : every block, raided future and cover piece in
     slices/fight_ground/ that the file remembers measures at least HALF its remembered chroma today (a missing picture fails)
  K3 the 35 present-day blocks together keep at least half of theirs (the board, not one picture)
  K4 the grey grade cannot be written into the game again (tools/bohemia_cook_the_fight_floor_in_act_one_10_25_26.py
     grade --write is refused, rule 167)
  K5 IT BITES: the 9cae20af grade (that tool's own grade_px, chroma x 0.3, cap 7) run in memory on one block reads as a fail
     on K2's own test; a control (the picture as it is) reads as a pass
WHEN HE RULES A NEW LOOK (his words, a note is a ruling): re-measure with --remember and say so in the commit; never to green.
  python3 gates/the_fight_keeps_its_colour_gate.py [--remember]
"""
import glob
import importlib.util
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FLOOR = os.path.join(ROOT, 'slices', 'fight_ground')
MEM = os.path.join(ROOT, 'gates', 'the_fight_keeps_its_colour.json')
TOOL = os.path.join(ROOT, 'tools', 'bohemia_cook_the_fight_floor_in_act_one_10_25_26.py')
HALF = 0.5   # rule 167(b): more than half of the colour gone is a new look, his call

M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
WP = np.array([0.95047, 1.0, 1.08883])


def chroma_of(rgba):
    a = rgba.reshape(-1, 4)
    a = a[a[:, 3] > 128][::3, :3].astype(np.float64) / 255.0
    if not len(a):
        return 0.0
    lin = np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
    xyz = (lin @ M.T) / WP
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return float(np.median(np.hypot(500 * (f[:, 0] - f[:, 1]), 200 * (f[:, 1] - f[:, 2]))))


def picture(path):
    im = Image.open(path).convert('RGBA')
    return np.asarray(im.reduce(4) if min(im.size) > 400 else im)


def pictures():
    out = {}
    for f in sorted(glob.glob(os.path.join(FLOOR, 'block_*.webp')) + glob.glob(os.path.join(FLOOR, 'cover_*.webp'))):
        name = os.path.basename(f)[:-5]
        if name.endswith('_reclaimed'):
            continue   # act three's colour (159d), never graded; its own act
        out[name] = f
    return out


passed, failed = 0, 0


def ok(label, cond, detail=''):
    global passed, failed
    if cond:
        passed += 1
        print('  ok   ' + label + ('  [' + detail + ']' if detail else ''))
    else:
        failed += 1
        print('  FAIL ' + label + ('  [' + detail + ']' if detail else ''))


def main():
    pics = pictures()
    if '--remember' in sys.argv:
        mem = {n: round(chroma_of(picture(f)), 2) for n, f in pics.items()}
        json.dump({'why': 'rule 167: every fight picture\'s median CIELAB chroma (opaque, quarter size) as he knew it; '
                          're-measured only when he rules a new look', 'chroma': mem}, open(MEM, 'w'), indent=1)
        print('remembered %d pictures' % len(mem))
        return
    try:
        mem = json.load(open(MEM))['chroma']
    except Exception:
        mem = {}
    ok('K1 the remembered colour is here', len(mem) >= 100, '%d pictures remembered' % len(mem))
    now, low, gone = {}, [], []
    for n, c0 in mem.items():
        if n not in pics:
            gone.append(n)
            continue
        now[n] = chroma_of(picture(pics[n]))
        if c0 > 1.0 and now[n] < HALF * c0:
            low.append('%s %.1f of %.1f' % (n, now[n], c0))
    ok('*** K2 NO FIGHT PICTURE HAS LOST MORE THAN HALF ITS COLOUR ***', not low and not gone,
       ('%d of %d below half: %s' % (len(low), len(mem), ', '.join(low[:6]))) if low else
       ('missing: ' + ', '.join(gone[:6])) if gone else '%d pictures, the lowest kept %.0f%%' % (
           len(now), 100 * min((now[n] / mem[n]) for n in now if mem[n] > 1.0)))
    blocks = [n for n in mem if n.startswith('block_') and not n.endswith('_raided')]
    b0 = float(np.median([mem[n] for n in blocks])) if blocks else 0
    b1 = float(np.median([now.get(n, 0) for n in blocks])) if blocks else 0
    ok('K3 the 35 present-day blocks together keep at least half', len(blocks) >= 35 and b1 >= HALF * b0,
       '%d blocks, median chroma %.1f against %.1f remembered' % (len(blocks), b1, b0))
    r = subprocess.run([sys.executable, TOOL, 'grade', 'no_such_block', '--write'], capture_output=True, text=True, timeout=60)
    ok('K4 the grey grade cannot be written into the game again', r.returncode != 0 and 'REFUSED' in (r.stderr + r.stdout),
       (r.stderr or r.stdout).strip()[:90])
    spec = importlib.util.spec_from_file_location('grade_tool', TOOL)
    tool = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(tool)
    probe = 'block_suburb_stem_0' if 'block_suburb_stem_0' in pics and 'block_suburb_stem_0' in mem else blocks[0]
    px = picture(pics[probe])
    graded = chroma_of(tool.grade_px(px))
    control = chroma_of(px)
    ok('K5 IT BITES: the 9cae20af grade on %s reads as a fail, the picture as it is as a pass' % probe,
       graded < HALF * mem[probe] <= control,
       'graded %.1f, as it is %.1f, remembered %.1f, the bar %.1f' % (graded, control, mem[probe], HALF * mem[probe]))
    print('THE FIGHT KEEPS ITS COLOUR: %d passed, %d failed' % (passed, failed))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
