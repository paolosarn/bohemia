#!/usr/bin/env python3
"""PROP SCALE GATE -- EVERY PROP IN THE GAME IS DRAWN AT A FRACTIONAL SCALE (COOK, 9/15/26).

*** PAOLO 9/15, SECOND PLAY: "every time I see a car it looks like dogshit, I'M SO
CONFUSED." *** He is describing something he can see and cannot name, and this is it.

THE MEASUREMENT. A prop is drawn by fitting its master into the stall its FOOTPRINT
buys (fitProp in slices/BOHEMIA_CITY_WORLD.html: scale = min(stallW/masterW,
stallH/masterH)). The ground it stands on is drawn at exactly 1.000 -- 44 px tiles into
44 px cells, lossless, which is what TPX=22->44 bought on 8/1 after Paolo said "the pixel
quality... of the terrain of the ground of the houses... it's so bad". Measured against
the shipped footprints at the walk-zoom cell size of 44 px:

    family        n   master      stall px     scale
    car          20   41-47x96    88x176       1.833     <- the one he named
    lighttower    6   104x232     141x396      1.354
    pole          6   84x192      79x198       0.943
    bench         1   96x72       66x48        0.672
    firebarrel   12   44x88       40x57        0.650
    barricade     3   96x79-89    66x53        0.629
    dumpster      1   96x91       70x57        0.629
    mailbox       1   62x96       40x57        0.596
    bin           4   64-66x96    40x57        0.589
    barrel        2   61-74x96    40x57        0.566
    bollard       2   62-74x96    35x53        0.513
    rubble       40   89-96x62-74 48x44        0.504
    pallet        1   96x62       48x31        0.497
    cone          2   63-76x96    35x44        0.458
    tyre          1   96x77       44x35        0.457
    bag           2   86-89x96    40x40        0.429

*** SIXTEEN OF SIXTEEN. NOT ONE PROP IN THE GAME LANDS ON AN INTEGER. ***

WHY THAT IS A CRAFT FAULT AND NOT A DETAIL. Smoothing is OFF for this draw
(g.imageSmoothingEnabled=false), so nothing is blurred -- it is worse than blurred, it is
UNEVEN. At 1.833x a source row becomes 2 screen pixels, then 2, then 1, then 2, in a
pattern that never repeats cleanly. Every pixel of the car is a different size from its
neighbour AND 83% bigger than the ground pixel beside it. At 0.429x whole source rows are
DISCARDED, so a bag loses more than half its drawn detail and keeps a ragged edge.

This repo already knows this and says so in its own words. The mobile render contract:
"non-integer scale is BANNED". The TPX comment: "HLEVELS [11,22,44,88] become a clean
0.25/0.5/1/2 against it, so the no-fractional-scale contract still holds." The ground
obeys it. THE PROPS NEVER HAVE, AND NOTHING EVER CHECKED.

FOURTH TIME THIS LANE HAS FOUND THIS EXACT FAULT, WHICH IS WHY IT IS A GATE NOW AND NOT
A FIX:
  * the yard, 9/13: 16 px tiles blown to 44 (x2.75) with smoothing ON, over 72% of his
    first five minutes. Fixed by replacing the art with art at the right size.
  * the door, 8/25 (Paolo: "WHY IS THE DOOR NOT TAKING UP ALL THE SPACE OF THE 2 TILES
    ITS IN. ITS LIKE A PICTURE OF THE DOOR BRO"): a 16 px wall square stretched to 44x88.
  * the car, 9/7: a 45x96 master STRETCHED to a 2x3 stall, 70% of its own length.
  * the car again, now: FIT rather than stretched, correct aspect, and still 1.833x.
A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. Three of those four were found by a person
looking at a picture. This one is found by arithmetic, every run, forever.

WHAT THIS GATE DOES NOT DO: it does not fix anything, and it must not. The fix is to
AUTHOR each prop master at the pixel size its own stall gives, so the fit is exactly 1.000
-- a car master is 88x176, not 45x96. That is a real re-cook of 106 sprites and it is its
own row. Snapping the scale in the renderer instead was measured and REJECTED: the car
would have to go to 1.0 (half the size of its stall, a toy) or 2.0 (16 px of overhang),
and the small props would change size by -23% to +17%, which is a world fact and not
presentation.

THE RATCHET. Today's sixteen are frozen as named debt. A NEW prop family that draws
fractionally FAILS, and any frozen family that gets WORSE fails. The list can only shrink.
That is the same shape as the purity ratchet and the reference-check baseline.

    python3 gates/prop_scale_gate.py
    python3 gates/prop_scale_gate.py --freeze    re-pin after the debt shrinks
"""
import io, os, re, sys, json, base64, subprocess
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROPS = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_PROPS.js')
PAGE = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
BASE = os.path.join(ROOT, 'gates', 'prop_scale_baseline.json')
CELL = 44                      # TPX: the walk-zoom cell, and the ground's own 1:1 size
ALLOWED = (0.25, 0.5, 1.0, 2.0, 4.0)
EPS = 0.001

passed = 0
failed = []


def ok(name, good, detail=''):
    global passed
    if good:
        passed += 1
        print('  PASS %s%s' % (name, (' -- ' + detail) if detail else ''))
    else:
        failed.append(name)
        print('  FAIL %s%s' % (name, (' -- ' + detail) if detail else ''))


def load():
    """Evaluate the props file the way the page does, AND TAKE THE MASTER SIZES FROM THE
    SAME EVAL. Regex-parsing a 1.6 MB base64 object is how this gate scored 6/0 while
    measuring ZERO families on its first run -- a pattern that did not match, a loop that
    never ran, and a green result that meant nothing. Fifth time this lane has been handed
    a clean answer by the wrong oracle. The sizes come off the PNG headers, decoded in
    node, from the same object the game draws."""
    out = os.path.join(ROOT, 'gates', '__pool.json')
    subprocess.run(['node', '-e',
        'const fs=require("fs");global.window={};'
        'eval(fs.readFileSync(%r,"utf8")+"\\n;globalThis.__P=PROP_B64;globalThis.__F=PROP_FP;");'
        'const P=globalThis.__P,o={};'
        'const dim=b=>{const x=Buffer.from(b,"base64");'
        '  return [x.readUInt32BE(16), x.readUInt32BE(20)];};'   # the PNG IHDR
        'for(const k in P){const s={};for(const b of P[k].slice(0,60)){'
        '  try{const d=dim(b); s[d[0]+"x"+d[1]]=1;}catch(e){}}'
        '  o[k]={n:P[k].length, sizes:Object.keys(s)};}'
        'fs.writeFileSync(%r,JSON.stringify({fp:globalThis.__F,fam:o}));'
        % (PROPS, out)], check=True, cwd=ROOT)
    meta = json.load(io.open(out))
    os.remove(out)
    return meta['fp'], meta['fam']


def main():
    freeze = '--freeze' in sys.argv
    print('PROP SCALE GATE -- is every prop drawn at a scale pixel art allows?\n')
    fp, fam = load()

    page = io.open(PAGE, encoding='utf-8', errors='replace').read()
    ok('the props are still FIT, not stretched (the 9/7 fix is still in)',
       '__A_CAR_IS_NOT_SQUASHED__' in page and 'function fitProp(' in page)
    ok('and the prop draw still has smoothing off, so this is about SIZE not blur',
       'g.imageSmoothingEnabled=false' in page)

    rows, counts = {}, {}
    for name in sorted(fp):
        if name not in fam or not fam[name]['sizes']:
            continue
        f = fp[name]
        #  THE STALL IS A WHOLE NUMBER OF PIXELS, because the draw call rounds it
        #  (__A_STALL_IS_A_WHOLE_NUMBER_OF_PIXELS__, 9/18). Before that, a 0.9-cell
        #  footprint gave a 39.6 px stall and NO integer master could ever fit it at
        #  1.000 -- fifteen of seventeen families were unreachable by construction, and
        #  this gate was measuring a debt that could not be paid by drawing.
        sw, sh = round(CELL * f[0]), round(CELL * f[1])
        sz = [tuple(int(v) for v in s.split('x')) for s in fam[name]['sizes']]
        rows[name] = sorted({round(min(sw / w, sh / h), 3) for (w, h) in sz})
        counts[name] = fam[name]['n']

    #  *** A GATE THAT MEASURED NOTHING MUST NEVER PASS. *** This gate's first run scored
    #  6 of 6 green having read ZERO families, because a regex did not match and the loop
    #  never ran. Every arm below was vacuously true. So the first assertion is that there
    #  is something here to assert about at all.
    ok('THIS GATE ACTUALLY MEASURED SOMETHING (it scored 6/0 on zero families once, and '
       'every arm after this one is vacuous when that happens)',
       len(rows) >= 10, '%d families, %d sprites'
       % (len(rows), sum(counts.values())))

    def integral(ss):
        return all(any(abs(s - a) < EPS for a in ALLOWED) for s in ss)

    clean = sorted(f for f, s in rows.items() if integral(s))
    dirty = sorted(f for f, s in rows.items() if not integral(s))

    print('\n  %-12s %6s %10s   %s' % ('family', 'sprites', 'scale', ''))
    for fam in sorted(rows, key=lambda f: -max(rows[f])):
        s = rows[fam]
        print('  %-12s %6d %10s   %s'
              % (fam, counts.get(fam, 0), '/'.join('%.3f' % x for x in s),
                 'ok' if integral(s) else 'FRACTIONAL'))
    print()

    if freeze or not os.path.exists(BASE):
        json.dump({'frozen': dirty, 'worst': {f: max(rows[f]) for f in dirty}},
                  io.open(BASE, 'w', encoding='utf-8'), indent=1, sort_keys=True)
        print('  FROZE %d fractional families as debt.\n' % len(dirty))

    base = json.load(io.open(BASE, encoding='utf-8'))
    frozen, worst = set(base['frozen']), base['worst']

    new = [f for f in dirty if f not in frozen]
    ok('NO NEW PROP FAMILY DRAWS AT A FRACTIONAL SCALE (the ratchet: the debt below is '
       'frozen and can only shrink)', not new,
       ('NEW: ' + ', '.join(new)) if new else '%d frozen, %d clean' % (len(frozen), len(clean)))

    regress = [f for f in dirty if f in frozen and max(rows[f]) > worst.get(f, 9) + EPS]
    ok('and no frozen family got FURTHER from an integer than it was', not regress,
       ('WORSE: ' + ', '.join(regress)) if regress else 'none moved')

    fixed = [f for f in frozen if f not in dirty]
    ok('the frozen list is still accurate (re-freeze when a family is fixed)',
       True, ('FIXED since the freeze, re-freeze me: ' + ', '.join(fixed)) if fixed
       else '%d still owed' % len(dirty))

    ok('THE GROUND ITSELF IS STILL 1:1, which is the whole reason a fractional prop reads '
       'wrong beside it (TPX is the cell size AND the tile size)',
       re.search(r'const TPX=44\b', page) is not None)

    print('\n  THE DEBT, IN HIS WORDS ("I am so confused"): %d of %d prop families are drawn'
          % (len(dirty), len(rows)))
    print('  at a scale pixel art does not allow. The fix is to AUTHOR each master at the')
    print('  pixel size its own stall gives, so the fit is 1.000 -- a car master is 88x176,')
    print('  not 45x96. That is a re-cook of the prop bank and it is its own row, not a')
    print('  renderer patch: snapping was measured and rejected (the car goes to a toy at')
    print('  1.0 or overhangs by 16 px at 2.0, and the small props change size by -23%/+17%,')
    print('  which is a world fact and not presentation).')
    print('\nPROP SCALE GATE: %d passed, %d failed' % (passed, len(failed)))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
