#!/usr/bin/env python3
"""THE SHEETS ARE PACKED (RUN 10/25/26, row [the crash before the fight], rule 173(c)).

Paolo 10/25: 'the game keeps crashing at random times, usually right before a fight loads up; maybe it's because of
the amount of people on the screen.' He was right about the people. MEASURED (tools/bohemia_run_the_fight_weight.js,
his phone's profile, the biggest fight the game rolls, twelve of his against thirteen): every man in a fight brings
his look's sheet (25 drawn keys x 8 facings, 144 x 161 a cell: 17.7 MB decoded) and his gun's (three gun classes x 8
facings x 15 keys: 33 MB decoded), and the figures fill 18 to 21 percent of a body sheet and 2 PERCENT of a gun sheet.
A gun sheet is 57 KB on the wire and 34 MB in the phone's memory, nearly all of it empty glass. Twenty-five men took
the tab from 1.09 GB on the map to 2.07 GB at the end screen.

THE FIX AT THE SOURCE: the picture the size it is drawn. Every cell of every look and gun sheet is cut to the box its
pixels fill and laid edge to edge (two empty pixels between) in one atlas; a table says where each cell went. The
fight draws the same cell into the same box from the atlas (its drawImage reads the table, so every caller, the night
copy, the machine's chip, the red flash, ANIMATION's tear, draws exactly as before): THE SAME PIXELS, a fifth of the
memory. Nobody's art is touched: the sources stay where they are and every render tool keeps writing them.

AND IT CAN NEVER SHOW OLD ART. The table carries the byte size of the sheet it was cut from; the fight asks the server
for the sheet's size (a HEAD request, nothing downloaded) and uses the atlas only when the two agree. A sheet another
lane re-rendered since the last pack is drawn from its own new file, whole, until this runs again (the demo's cut runs
it; gates/the_sheets_are_packed_gate.js names any sheet that is stale).

  python3 tools/bohemia_run_the_sheets_packed.py            # pack what changed
  python3 tools/bohemia_run_the_sheets_packed.py --check    # exit 1 if any pack is stale or missing (no writes)
  python3 tools/bohemia_run_the_sheets_packed.py --all      # repack everything
"""
import base64, json, os, struct, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RIG = os.path.join(ROOT, 'slices', 'fight_rig')
OUT = os.path.join(RIG, 'packed')
PAD = 2          # empty pixels between two cells in the atlas (a smoothed draw never borrows a neighbour)
MAX_SIDE = 4096  # a phone's largest texture


def sheets():
    """every look's body sheet and gun sheet, with its cell box (fight_rig.json's looks)"""
    j = json.load(open(os.path.join(RIG, 'fight_rig.json')))
    out = {}
    for k, L in j['looks'].items():
        for f in (L.get('file'), L.get('guns')):
            if f and f not in out:
                out[f] = (int(L['w']), int(L['h']))
    return out


def cells_of(a, cw, ch):
    """per cell, the box its pixels fill: (tx, ty, tw, th), (0,0,0,0) when empty"""
    H, W = a.shape
    rows, cols = H // ch, W // cw
    out = []
    for r in range(rows):
        band = a[r * ch:(r + 1) * ch]
        for c in range(cols):
            m = band[:, c * cw:(c + 1) * cw]
            ys = np.flatnonzero(m.any(axis=1))
            if ys.size == 0:
                out.append((0, 0, 0, 0)); continue
            xs = np.flatnonzero(m.any(axis=0))
            out.append((int(xs[0]), int(ys[0]), int(xs[-1] - xs[0] + 1), int(ys[-1] - ys[0] + 1)))
    return rows, cols, out


def shelf(boxes, width):
    """tallest first, left to right, a new shelf when a row is full; returns positions and the atlas height"""
    order = sorted(range(len(boxes)), key=lambda i: (-boxes[i][3], -boxes[i][2]))
    pos = [None] * len(boxes)
    x = y = shelf_h = 0
    for i in order:
        tw, th = boxes[i][2], boxes[i][3]
        if not tw:
            pos[i] = (0, 0); continue
        if x + tw > width:
            x, y, shelf_h = 0, y + shelf_h + PAD, 0
        pos[i] = (x, y)
        x += tw + PAD
        shelf_h = max(shelf_h, th)
    return pos, y + shelf_h


def pack(name, cw, ch):
    src = os.path.join(RIG, name)
    im = Image.open(src).convert('RGBA')
    px = np.asarray(im)
    W, H = im.size
    if W % cw or H % ch:
        return None   # not a grid of this cell: left whole
    rows, cols, boxes = cells_of(px[:, :, 3] > 0, cw, ch)
    area = sum(b[2] * b[3] for b in boxes)
    width = 256
    while True:   # the narrowest power-of-two-ish width whose atlas is no taller than it is wide (and fits a phone)
        pos, ah = shelf(boxes, width)
        if ah <= width * 1.5 or width >= MAX_SIDE:
            break
        width *= 2
    used_w = max([pos[i][0] + b[2] for i, b in enumerate(boxes) if b[2]] + [1])
    if ah > MAX_SIDE:
        return None
    atlas = np.zeros((max(1, ah), used_w, 4), dtype=np.uint8)
    table = []
    for i, (tx, ty, tw, th) in enumerate(boxes):
        r, c = divmod(i, cols)
        ax, ay = pos[i]
        if tw:
            atlas[ay:ay + th, ax:ax + tw] = px[r * ch + ty:r * ch + ty + th, c * cw + tx:c * cw + tx + tw]
        table += [ax, ay, tx, ty, tw, th]
    stem = os.path.splitext(name)[0]
    Image.fromarray(atlas, 'RGBA').save(os.path.join(OUT, stem + '.webp'), 'WEBP', lossless=True, quality=100, method=4, exact=True)
    meta = {'src': name, 'bytes': os.path.getsize(src), 'w': W, 'h': H, 'cw': cw, 'ch': ch, 'cols': cols, 'rows': rows,
            'aw': used_w, 'ah': int(atlas.shape[0]), 'atlas': stem + '.webp',
            'cells': base64.b64encode(struct.pack('<%dH' % len(table), *table)).decode('ascii')}
    json.dump(meta, open(os.path.join(OUT, stem + '.json'), 'w'), separators=(',', ':'))
    return {'bytes': meta['bytes'], 'decodedMB': round(W * H * 4 / 1048576, 2), 'packedMB': round(used_w * meta['ah'] * 4 / 1048576, 2),
            'fill': round(area / float(W * H), 3)}


def main():
    check = '--check' in sys.argv
    every = '--all' in sys.argv
    os.makedirs(OUT, exist_ok=True)
    ipath = os.path.join(OUT, 'index.json')
    index = json.load(open(ipath)) if os.path.exists(ipath) else {'sheets': {}}
    want = sheets()
    stale = [n for n in sorted(want) if os.path.exists(os.path.join(RIG, n)) and (every or
             (index['sheets'].get(n) or {}).get('bytes') != os.path.getsize(os.path.join(RIG, n))
             or not os.path.exists(os.path.join(OUT, os.path.splitext(n)[0] + '.webp')))]
    gone = [n for n in index['sheets'] if n not in want or not os.path.exists(os.path.join(RIG, n))]
    if check:
        print('THE SHEETS ARE PACKED: %d sheets, %d stale or missing%s, %d no longer drawn' % (len(want), len(stale), (': ' + ' '.join(stale[:12])) if stale else '', len(gone)))
        sys.exit(1 if (stale or gone) else 0)
    for n in gone:
        index['sheets'].pop(n, None)
        for ext in ('.webp', '.json'):
            p = os.path.join(OUT, os.path.splitext(n)[0] + ext)
            if os.path.exists(p): os.remove(p)
    from multiprocessing import Pool
    with Pool(max(1, (os.cpu_count() or 2) - 1)) as pool:
        done = pool.starmap(pack, [(n,) + want[n] for n in stale])
    for n, r in zip(stale, done):
        if r: index['sheets'][n] = r
        else: index['sheets'].pop(n, None)
    index['about'] = ('RUN 10/25 __THE_SHEETS_ARE_PACKED__ (rule 173): every fight look and gun sheet cut to the box its pixels fill; '
                      'the fight uses an atlas only when the sheet\'s bytes on the server equal "bytes" here. tools/bohemia_run_the_sheets_packed.py')
    S = index['sheets']
    index['totals'] = {'sheets': len(S), 'decodedMB': round(sum(v['decodedMB'] for v in S.values()), 1),
                       'packedMB': round(sum(v['packedMB'] for v in S.values()), 1)}
    json.dump(index, open(ipath, 'w'), indent=0, sort_keys=True)
    print('packed %d (%d stale), removed %d; all %d sheets: %.0f MB decoded -> %.0f MB packed' % (len(stale), len(stale), len(gone), len(S), index['totals']['decodedMB'], index['totals']['packedMB']))


if __name__ == '__main__':
    main()
