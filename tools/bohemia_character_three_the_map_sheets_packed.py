#!/usr/bin/env python3
"""THE MAP'S PEOPLE ARE PACKED (CHARACTER 3, 11/27/26; ask row 769, VAMILY rule 484(a) amended, rule 480(c), rule 482(c)).

Paolo 11/27: 'combat keeps crashing, like when I get into combat and then when I finish it, it's insane'. His answer A: the page
goes white or reloads, Safari on an iPhone killing the tab for memory. PLUMBER 8 measured the iPhone's way (ask row 769): THE MAP
HOLDS 233 MB OF BITMAPS THE WHOLE SESSION, UNDER THE FIGHT TOO, and its people sheets are the most of it (151 MB in 10).

MEASURED BY THIS LANE (the demo upright, the map after the town, nothing collected): the map held 166 MB of people sheets in 11
bitmaps (BOHEMIA_RIG_CAST 29.5, BOHEMIA_RIG_PEOPLE 21.0, rig_mix/town 23.0, town_2 15.2, town_3 11.0, town_4 11.0, town_5 6.6, three
gangs 15 each, BOHEMIA_RIG_YOU 3.0). A rig_mix sheet is one cell a person a facing a key (68 to 78 x 113 to 143), and a man fills 23
percent of it: town_2, town_3 and town_4 are 5 to 7 percent full (their people stand, so six of every seven cells are empty glass).

THE FIX AT THE SOURCE, the fight's own way (tools/bohemia_run_the_sheets_packed.py, RUN 10/25, rule 173): every cell is cut to the box
its pixels fill and laid edge to edge (two empty pixels between) in one atlas, and a table says where each cell went. The map's frame
is already a rectangle on its sheet with an offset in its 112-wide box (__THE_MAP_DRAWS_FROM_THE_SHEET__, RigFrame), so a packed frame
is the same frame: the cell's rectangle on the atlas, its offset moved by the trim. THE SAME PIXELS IN THE SAME PLACE (proved below
cell by cell, and on the page by the gate), about two fifths of the memory. Nobody's art is touched: the sheets stay where they are,
every render tool keeps writing them, and the gates and the VOTE cards that read a whole sheet read it as before.

AND IT CAN NEVER SHOW OLD ART: the table carries the byte size of the sheet it was cut from; the map asks the server for the sheet's
size (a HEAD request, nothing downloaded) and uses the atlas only when the two agree. A sheet another lane re-rendered since the last
pack is drawn whole until this runs again (the demo's cut runs it; gates/the_maps_people_are_packed_gate.js names a stale one).

BOHEMIA_RIG_YOU stays whole: 3 MB, and THE MAIN GUY LEADS THE WALK reads its every frame against the fight's sheet.

  python3 tools/bohemia_character_three_the_map_sheets_packed.py            # pack what changed
  python3 tools/bohemia_character_three_the_map_sheets_packed.py --check    # exit 1 if any pack is stale or missing (no writes)
  python3 tools/bohemia_character_three_the_map_sheets_packed.py --all      # repack everything
  python3 tools/bohemia_character_three_the_map_sheets_packed.py --prove    # every cell of every atlas against its sheet (exit 1 on any)
"""
import base64, json, os, struct, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SL = os.path.join(ROOT, 'slices')
OUT = os.path.join(SL, 'rig_mix_packed')
PAD = 2          # empty pixels between two cells in the atlas (a smoothed draw never borrows a neighbour)
MAX_SIDE = 4096  # a phone's largest texture
WIDTHS = (512, 1024, 2048)
WHOLE = ('BOHEMIA_RIG_CAST', 'BOHEMIA_RIG_PEOPLE')   # the map's two whole-cast sheets (BOHEMIA_RIG_YOU stays whole, see above)


def sheets():
    """every people sheet the map cuts with rigSheetSet: the name the map fetches (no extension) -> its stem here"""
    out = {n: n for n in WHOLE}
    ix = json.load(open(os.path.join(SL, 'rig_mix', 'index.json')))
    for pool in ix.get('pools', {}).values():
        for n in pool:
            out['rig_mix/' + n] = n
    return {k: v for k, v in out.items() if os.path.exists(os.path.join(SL, k + '.png')) and os.path.exists(os.path.join(SL, k + '.json'))}


def cells_of(a, cw, ch):
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
    pos = [(0, 0)] * len(boxes)
    x = y = shelf_h = 0
    for i in order:
        tw, th = boxes[i][2], boxes[i][3]
        if not tw:
            continue
        if x + tw > width:
            x, y, shelf_h = 0, y + shelf_h + PAD, 0
        pos[i] = (x, y)
        x += tw + PAD
        shelf_h = max(shelf_h, th)
    return pos, y + shelf_h


def pack(name, stem):
    src = os.path.join(SL, name + '.png')
    meta = json.load(open(os.path.join(SL, name + '.json')))
    cw, ch = int(meta['w']), int(meta['h'])
    im0 = Image.open(src)
    px = np.asarray(im0.convert('RGBA'))
    H, W = px.shape[:2]
    if W % cw or H % ch:
        return None   # not a grid of this cell: left whole
    rows, cols, boxes = cells_of(px[:, :, 3] > 0, cw, ch)
    best = None
    for width in WIDTHS:   # the smallest atlas of the widths a phone draws well, no side past MAX_SIDE
        pos, ah = shelf(boxes, width)
        uw = max([pos[i][0] + b[2] for i, b in enumerate(boxes) if b[2]] + [1])
        if ah <= MAX_SIDE and (best is None or uw * ah < best[0]):
            best = (uw * ah, pos, uw, ah)
    if best is None:
        return None
    _, pos, uw, ah = best
    # THE SAME FILE KIND AS THE SHEET: a palette sheet's atlas is a palette PNG on the sheet's own palette, the same indices, so the
    # browser unpacks it through the same decoder to the same values (a WebP atlas was off by one level on 5 to 11 percent of the
    # half-clear edge pixels, measured on the page: the two decoders round the clear pixels' colour differently)
    pal = im0.mode == 'P'
    if pal:
        idx = np.asarray(im0)
        tr = im0.info.get('transparency')
        if isinstance(tr, (bytes, bytearray)):
            clear = next((k for k, a in enumerate(tr) if a == 0), None)
        else:
            clear = tr
        if clear is None:
            pal = False
    atlas = np.zeros((max(1, ah), uw) + (() if pal else (4,)), dtype=np.uint8)
    if pal:
        atlas[:] = clear
    table = []
    for i, (tx, ty, tw, th) in enumerate(boxes):
        r, c = divmod(i, cols)
        ax, ay = pos[i]
        if tw:
            atlas[ay:ay + th, ax:ax + tw] = (idx if pal else px)[r * ch + ty:r * ch + ty + th, c * cw + tx:c * cw + tx + tw]
        table += [ax, ay, tx, ty, tw, th]
    out = os.path.join(OUT, stem + '.png')
    if pal:
        a_im = Image.fromarray(atlas, 'P'); a_im.putpalette(im0.getpalette())
        a_im.save(out, 'PNG', optimize=True, transparency=im0.info.get('transparency'))
    else:
        Image.fromarray(atlas, 'RGBA').save(out, 'PNG', optimize=True)
    for old in (os.path.join(OUT, stem + '.webp'),):
        if os.path.exists(old): os.remove(old)
    pk = {'src': name + '.png', 'bytes': os.path.getsize(src), 'w': W, 'h': H, 'cw': cw, 'ch': ch, 'cols': cols, 'rows': rows,
          'aw': uw, 'ah': int(atlas.shape[0]), 'atlas': stem + '.png',
          'cells': base64.b64encode(struct.pack('<%dH' % len(table), *table)).decode('ascii')}
    json.dump(pk, open(os.path.join(OUT, stem + '.json'), 'w'), separators=(',', ':'))
    return {'stem': stem, 'bytes': pk['bytes'], 'cw': cw, 'ch': ch, 'cols': cols, 'rows': rows, 'aw': uw, 'ah': pk['ah'],
            'decodedMB': round(W * H * 4 / 1048576, 2), 'packedMB': round(uw * pk['ah'] * 4 / 1048576, 2),
            'fileKB': round(os.path.getsize(out) / 1024.0, 1), 'sheetKB': round(os.path.getsize(src) / 1024.0, 1)}


def prove(name, stem):
    """every cell of the atlas, laid back at its place, equals the sheet's cell, pixel for pixel (alpha 0 counted as one colour)"""
    pk = json.load(open(os.path.join(OUT, stem + '.json')))
    px = np.asarray(Image.open(os.path.join(SL, name + '.png')).convert('RGBA'))
    at = np.asarray(Image.open(os.path.join(OUT, pk['atlas'])).convert('RGBA'))   # a palette atlas read through its palette, as the sheet is
    t = struct.unpack('<%dH' % (len(base64.b64decode(pk['cells'])) // 2), base64.b64decode(pk['cells']))
    cw, ch, cols = pk['cw'], pk['ch'], pk['cols']
    bad = 0
    for i in range(len(t) // 6):
        ax, ay, tx, ty, tw, th = t[i * 6:i * 6 + 6]
        r, c = divmod(i, cols)
        cell = np.zeros((ch, cw, 4), dtype=np.uint8)
        if tw:
            cell[ty:ty + th, tx:tx + tw] = at[ay:ay + th, ax:ax + tw]
        want = px[r * ch:(r + 1) * ch, c * cw:(c + 1) * cw].copy()
        if not np.array_equal(cell, want):   # every channel, the clear pixels' colour included (the palette makes them the same)
            bad += 1
    return len(t) // 6, bad


def main():
    check, every, proving = '--check' in sys.argv, '--all' in sys.argv, '--prove' in sys.argv
    os.makedirs(OUT, exist_ok=True)
    ipath = os.path.join(OUT, 'index.json')
    index = json.load(open(ipath)) if os.path.exists(ipath) else {'sheets': {}}
    want = sheets()
    if proving:
        cells = bad = 0
        for n in sorted(want):
            if n not in index['sheets']:
                continue
            k, b = prove(n, want[n]); cells += k; bad += b
            if b: print('  OFF  %s: %d of %d cells differ' % (n, b, k))
        print('THE MAP\'S PEOPLE ARE PACKED, PROVED: %d sheets, %d cells, %d differ' % (len(index['sheets']), cells, bad))
        sys.exit(1 if bad else 0)
    stale = [n for n in sorted(want) if every or (index['sheets'].get(n) or {}).get('bytes') != os.path.getsize(os.path.join(SL, n + '.png'))
             or not os.path.exists(os.path.join(OUT, want[n] + '.png')) or not os.path.exists(os.path.join(OUT, want[n] + '.json'))]
    gone = [n for n in index['sheets'] if n not in want]
    if check:
        print('THE MAP\'S PEOPLE ARE PACKED: %d sheets, %d stale or missing%s, %d no longer drawn' % (len(want), len(stale), (': ' + ' '.join(stale[:12])) if stale else '', len(gone)))
        sys.exit(1 if (stale or gone) else 0)
    for n in gone:
        e = index['sheets'].pop(n, None) or {}
        for ext in ('.png', '.webp', '.json'):
            p = os.path.join(OUT, (e.get('stem') or os.path.basename(n)) + ext)
            if os.path.exists(p): os.remove(p)
    from multiprocessing import Pool
    with Pool(max(1, min(4, (os.cpu_count() or 2) - 1))) as pool:
        done = pool.starmap(pack, [(n, want[n]) for n in stale])
    for n, r in zip(stale, done):
        if r: index['sheets'][n] = r
        else: index['sheets'].pop(n, None)
    index['about'] = ('CHARACTER 3 11/27 __THE_MAPS_PEOPLE_ARE_PACKED__ (ask row 769): every map people sheet cut to the box its pixels fill; '
                      'the map uses an atlas only when the sheet\'s bytes on the server equal "bytes" here. tools/bohemia_character_three_the_map_sheets_packed.py')
    S = index['sheets']
    index['totals'] = {'sheets': len(S), 'decodedMB': round(sum(v['decodedMB'] for v in S.values()), 1),
                       'packedMB': round(sum(v['packedMB'] for v in S.values()), 1)}
    json.dump(index, open(ipath, 'w'), indent=0, sort_keys=True)
    print('packed %d, removed %d; all %d map people sheets: %.0f MB decoded -> %.0f MB packed' % (len(stale), len(gone), len(S), index['totals']['decodedMB'], index['totals']['packedMB']))


if __name__ == '__main__':
    main()
