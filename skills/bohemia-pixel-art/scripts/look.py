#!/usr/bin/env python3
"""BOHEMIA PIXEL ART -- SEE WHILE YOU DRAW: one cycle of the render-look-fix loop (rule 108 ROUND TWELVE (1)(2)(3)).

A chat that renders once and ships has drawn blind. Every cycle of making an asset runs this, then OPENS THE LOOK
SHEET IT WROTE (the Read tool on the .look.png) and writes what it sees in words before changing anything:

    python3 skills/bohemia-pixel-art/scripts/look.py <candidate.png> <family> --log <asset>.loop.jsonl \
        --twin <pack tile.png> [--ground <his ground tile.png>] --saw "<the faults I see, in words>" --fix "<what I change next>"
    (step one of each cycle: the same call with --sheet-only, which writes the sheet and logs nothing; open it; then
     the logged call with what you saw)
    python3 skills/bohemia-pixel-art/scripts/look.py --summary <asset>.loop.jsonl      (the table for the result card)

THE LOOK SHEET (<candidate>.look.png), one strip, every view at one art pixel to one screen pixel or a whole multiple:
  1x | 4x whole | 8x crop of the busiest corner | shrunk to 16 x 16 then shown at 6x (does it still read?) | the silhouette in
  one value at 1x | the values only (grey) at 1x | the pack twin at 1x | the twin's values at 1x.
THE STAGES, in order (the build order in SKILL.md); the cycle reports the FIRST stage that fails, and that is the
only stage to work on next:
  1 SILHOUETTE      at 16 x 16 the shape still covers itself (fill 25 to 90% of its box) and is one piece
  2 SHAPES + LIGHT  light from above (the card's light row and the craft light row)
  3 RAMPS           colours, top eight, value span, saturation, banding (the card + the craft)
  4 DETAIL          grain and stray pixels at 8 steps (the card + the craft)
  5 EDGE            the family's outline band and one pixel size (the card + the craft)
A cycle with no --saw is refused: the words are the look. The log line keeps cycle, stage, the numbers, saw, fix.
DONE is never declared by this tool: twenty or more cycles, all five stages passing, and DIRECTION's eye.

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index (his 7/13 UP set), the card of
numbers (records/BOHEMIA_THE_CARD_OF_NUMBERS_10_10_26.md), the craft laws (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md),
AH-01, AH-03. The twin is his own tile. No reference game.
"""
import os, sys, json, re, subprocess, importlib.util, datetime
import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
BG = (22, 21, 20)


def _mod(path, name):
    s = importlib.util.spec_from_file_location(name, path); m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m


def silhouette_ok(im):
    a = np.asarray(im.convert('RGBA'))[..., 3] > 127
    ys, xs = np.nonzero(a)
    if not len(ys): return False, 'nothing opaque'
    box = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    small = np.asarray(Image.fromarray((box * 255).astype(np.uint8)).resize((16, 16), Image.BOX)) > 127
    fill = small.mean()
    # one piece: flood from the first filled cell
    seen = np.zeros_like(small); st = [tuple(np.argwhere(small)[0])] if small.any() else []
    while st:
        y, x = st.pop()
        if 0 <= y < 16 and 0 <= x < 16 and small[y, x] and not seen[y, x]:
            seen[y, x] = True; st += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
    pieces_ok = seen.sum() >= 0.9 * small.sum()
    ok = 0.25 <= fill <= 0.90 and pieces_ok
    return ok, 'fill %.0f%% of its box at 16x16, %s' % (100 * fill, 'one piece' if pieces_ok else 'falls apart')


def measure(png, fam):
    r = subprocess.run([sys.executable, os.path.join(HERE, 'check.py'), png, fam], capture_output=True, text=True)
    out = {}
    for line in r.stdout.splitlines():
        m = re.match(r'(OK|OUT)\s+(.*?):\s*(.*)$', line)
        if m: out[m.group(2)] = (m.group(1) == 'OK', m.group(3))
    return out, r.stdout


STAGE_KEYS = [('2 SHAPES + LIGHT', ['light']), ('3 RAMPS', ['colours', 'top 8', 'value span', 'saturation', 'banding']),
              ('4 DETAIL', ['grain', 'stray']), ('5 EDGE', ['edge', 'pixel size', 'long side'])]


def stages(im, rows, twin_rows=None):
    """a row his own twin also misses is the family's spread, not this piece's fault (cycle 17)"""
    twin_rows = twin_rows or {}
    res = []
    ok, why = silhouette_ok(im); res.append(('1 SILHOUETTE', bool(ok), why))
    for name, keys in STAGE_KEYS:
        hit = [(k, v) for k, v in rows.items() if any(s in k for s in keys)]
        bad = [k + ' ' + v[1] for k, v in hit if not v[0] and not (k in twin_rows and not twin_rows[k][0])]
        res.append((name, bool(not bad), '; '.join(bad) if bad else 'ok'))
    return res


def sheet(im, twin, out, ground=None):
    im = im.convert('RGBA'); views = []
    a = np.asarray(im); L = (a[..., :3] @ [0.299, 0.587, 0.114]).astype(np.uint8)
    # the busiest 16 x 16 corner, at 8x
    g = np.abs(np.diff(L.astype(int), axis=1)); best, by, bx = -1, 0, 0
    for y in range(0, max(1, im.height - 16), 4):
        for x in range(0, max(1, im.width - 16), 4):
            v = g[y:y + 16, x:x + 15].sum()
            if v > best: best, by, bx = v, y, x
    views.append(('1x', im))
    views.append(('4x whole', im.resize((im.width * 4, im.height * 4), Image.NEAREST)))
    views.append(('8x busiest', im.crop((bx, by, bx + 16, by + 16)).resize((128, 128), Image.NEAREST)))
    views.append(('16x16 at 6x', im.resize((16, 16), Image.BOX).resize((96, 96), Image.NEAREST)))
    if ground:   # SEAT IT: on his ground tile(s), with nothing added, at 2x
        gt = Image.open(ground).convert('RGBA'); bg = Image.new('RGBA', (im.width + 24, im.height + 24))
        for y in range(0, bg.height, gt.height):
            for x in range(0, bg.width, gt.width): bg.alpha_composite(gt, (x, y))
        bg.alpha_composite(im, (12, 12)); views.append(('seated 2x', bg.resize((bg.width * 2, bg.height * 2), Image.NEAREST)))
    sil = np.zeros_like(a); sil[a[..., 3] > 127] = (230, 224, 210, 255); views.append(('silhouette', Image.fromarray(sil)))
    gv = np.dstack([L, L, L, a[..., 3]]); views.append(('values', Image.fromarray(gv)))
    if twin:
        t = Image.open(twin).convert('RGBA'); ta = np.asarray(t); tl = (ta[..., :3] @ [0.299, 0.587, 0.114]).astype(np.uint8)
        views.append(('his twin', t)); views.append(('twin values', Image.fromarray(np.dstack([tl, tl, tl, ta[..., 3]]))))
    W = sum(v.width for _, v in views) + 12 * (len(views) + 1); H = max(v.height for _, v in views) + 34
    s = Image.new('RGBA', (W, H), BG + (255,)); d = ImageDraw.Draw(s); x = 12
    for name, v in views:
        s.alpha_composite(v, (x, 26)); d.text((x, 6), name, fill=(220, 214, 200)); x += v.width + 12
    s.convert('RGB').save(out)


def summary(log):
    rows = [json.loads(l) for l in open(log) if l.strip()]
    print('| cycle | first failing stage | saw | fix |'); print('|---|---|---|---|')
    for r in rows: print('| %d | %s | %s | %s |' % (r['cycle'], r['first_fail'] or 'all five pass', r['saw'], r['fix']))
    print('\n%d cycles; %s' % (len(rows), 'the last passes all five stages' if rows and not rows[-1]['first_fail'] else 'not passing yet'))


def main():
    if '--summary' in sys.argv:
        return summary(sys.argv[sys.argv.index('--summary') + 1])
    if len(sys.argv) < 3: sys.exit(__doc__)
    png, fam = sys.argv[1], sys.argv[2]
    opt = lambda k: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else None
    log, twin, saw, fix, ground = opt('--log'), opt('--twin'), opt('--saw'), opt('--fix'), opt('--ground')
    if '--sheet-only' in sys.argv:   # step one of a cycle: make the sheet and the stages, log nothing, then LOOK
        im = Image.open(png); rows, _ = measure(png, fam); look = os.path.splitext(png)[0] + '.look.png'; sheet(im, twin, look, ground)
        for k, ok, why in stages(im, rows, measure(twin, fam)[0] if twin else None): print(('PASS ' if ok else 'FAIL ') + k + ': ' + why)
        print('look sheet %s -- open it, write what you see, then run again with --log and --saw' % look); return
    if not log or not saw: sys.exit('REFUSED: a cycle needs --log and --saw (the faults you see, in words). Open the look sheet first.')
    im = Image.open(png)
    rows, raw = measure(png, fam)
    st = stages(im, rows, measure(twin, fam)[0] if twin else None)
    first = next((n for n, ok, _ in st if not ok), None)
    look = os.path.splitext(png)[0] + '.look.png'; sheet(im, twin, look, ground)
    n = sum(1 for _ in open(log)) + 1 if os.path.exists(log) else 1
    rec = dict(cycle=n, when=datetime.datetime.utcnow().strftime('%m/%d %H:%M'), asset=os.path.relpath(png, ROOT),
               stages={k: [ok, why] for k, ok, why in st}, first_fail=first, saw=saw, fix=fix or '', look=os.path.relpath(look, ROOT))
    open(log, 'a').write(json.dumps(rec) + '\n')
    for k, ok, why in st: print(('PASS ' if ok else 'FAIL ') + k + ': ' + why)
    print('cycle %d -> %s; look sheet %s (open it)' % (n, 'work on ' + first if first else 'all five stages pass', look))


if __name__ == '__main__':
    main()
