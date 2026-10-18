#!/usr/bin/env python3
"""BOARDS BY SIZE: SMALL, MIDDLE AND LARGE, CUT FROM THE LEGO GRAMMAR  (COMBAT 2, OPEN row [boards by size])

PAOLO 10/9 (rule 79): 'the actual combat map doesn't need to be so big in Battle Brothers unless it's an endgame
battle or three raiding parties hit you at the same time... on the map I want to see it more zoomed in'.

Three sizes for every kind he named (street, suburb, lot, freeway, strip mall, the works), each laid by the
join rule of rule 77 (tools/bohemia_combat2_tiles_are_legos_cook_10_5_26.py, L.solve: a block goes in a cell
only where its typed edges meet its neighbours'), from the blocks slices/fight_ground already ships (nothing is
drawn):
  small   2 x 2 blocks (10 x 10 house tiles), opening WINDOW 9 x 7   a few against a few
  middle  3 x 2 blocks (15 x 10),              opening WINDOW 14 x 10
  large   4 x 3 blocks (20 x 15),              the whole board        the endgame, three parties at once
The window is the rectangle the fight opens on (COMBAT's [the board fits the party] crops to the parties; this
is the default cut where the lines meet): the kind's own blocks in it, both start columns open, the two lines
joined by open ground. The rest of the blocks is the city round it, drawn, there to pan into.

  fight_ground.json sized[kind][size] = {blocks, tiles:[w, h], window:[ox, oy, w, h], start_cols:[a, b],
                                         terrain (h x w), cover, lights}   (metres from the blocks' origin)

WHAT IS PROVED, NOT CLAIMED (each refuses the run): every sized board has zero broken seams by rule 77's reader;
every window holds its kind, joins its two start columns over open ground, and has both start columns open on
at least half their tiles; every block is one the manifest ships.

THE ANALOG HORROR LINE (rule 20): a small fight is a small place: one corner of a dead block, the rest of the
street there past the window, empty.

REFERENCE CHECK (the 9/4 standing law):
  CGRD-01 INTO THE BREACH: a small board reads at a glance; the kind is the shape you name.
  TG-04 THE STREET TILE: the same street runs through every size; a small board is a piece of the big one.
  AH-01 THE BIBLE: one register; every block is a shipped block.
  REUSE CHECK: every block, terrain tag, cover piece and light is the shipped board data, re-laid.

[bb the battle map] Battle Brothers' battle maps scale with the fight (its small skirmish maps against its large
  sieges); the lines start 5 tiles apart in every size. OURS: the same 5-tile gap, three sizes.

    python3 tools/bohemia_combat2_boards_by_size_cook_10_9_26.py
"""
import importlib, json, os, random, sys
from collections import deque

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
os.chdir(REPO)
L = importlib.import_module('bohemia_combat2_tiles_are_legos_cook_10_5_26')
MAN = 'slices/fight_ground/fight_ground.json'
SIZES = {'small': (2, 2, 9, 7), 'middle': (3, 2, 14, 10), 'large': (4, 3, 20, 15)}
GAP = 5
HOUSES = ['subs.0', 'subs.1', 'subs.2', 'subs.3', 'corner.0', 'corner.1', 'corner.2', 'lots.0']
TOWN = HOUSES + ['main.1', 'works.0']
# kind: (lead kinds that must stand in the window, palette rows by block row, fixed cells by size)
KINDS = {
    'street':  (('corner',), lambda R: [HOUSES] * R, {}),
    'suburb':  (('subs',), lambda R: [['subs.0', 'subs.1', 'subs.2', 'subs.3', 'corner.0', 'corner.1']] * R, {}),
    'lot':     (('lots',), lambda R: [HOUSES] * R, {}),
    'freeway': (('freeway', 'freewayo'), lambda R: [HOUSES, ['freeway.0', 'freewayo.0'], ['scrub.0', 'scrub.1', 'scrub.2', 'scrubroad.0', 'scrubroad.1']][-R:] if R == 3 else [HOUSES, ['freeway.0', 'freewayo.0']], {}),
    'strip':   (('strip',), lambda R: [['strip.0', 'strip.1'], TOWN, TOWN][:R], {}),
    'works':   (('works',), lambda R: [TOWN] * R, {}),
}


def die(msg): sys.exit('REFUSED: ' + msg)


def library(m):
    """Per block: its terrain, cover and lights, read from the boards it stands in (as the fight's blockLibrary)."""
    bt, tm, lib = m['block_tiles'], m['tile_metres'], {}
    for B in m['boards'].values():
        for by, row in enumerate(B['blocks']):
            for bx, n in enumerate(row):
                if n in lib: continue
                x0, y0, x1, y1 = bx * bt * tm, by * bt * tm, (bx + 1) * bt * tm, (by + 1) * bt * tm
                lib[n] = dict(terrain=[r[bx * bt:(bx + 1) * bt] for r in B['terrain'][by * bt:(by + 1) * bt]],
                              cover=[dict(c, x_m=round(c['x_m'] - x0, 1), y_m=round(c['y_m'] - y0, 1)) for c in B['cover'] if x0 <= c['x_m'] < x1 and y0 <= c['y_m'] < y1],
                              lights=[dict(l, x_m=round(l['x_m'] - x0, 1), y_m=round(l['y_m'] - y0, 1)) for l in B.get('lights', []) if x0 <= l['x_m'] < x1 and y0 <= l['y_m'] < y1])
    return lib


def compose(lay, lib, bt, tm):
    R, C = len(lay), len(lay[0])
    terr = [[None] * (C * bt) for _ in range(R * bt)]
    cov, lit = [], []
    for by, row in enumerate(lay):
        for bx, n in enumerate(row):
            b = lib[n]
            for r in range(bt):
                for c in range(bt): terr[by * bt + r][bx * bt + c] = b['terrain'][r][c]
            for p in b['cover']: cov.append(dict(p, x_m=round(p['x_m'] + bx * bt * tm, 1), y_m=round(p['y_m'] + by * bt * tm, 1)))
            for l in b['lights']: lit.append(dict(l, x_m=round(l['x_m'] + bx * bt * tm, 1), y_m=round(l['y_m'] + by * bt * tm, 1), block=[by, bx]))
    return terr, cov, lit


def window(lay, terr, cov_solid, lead, w, h, bt):
    """The best w x h window: the lead kind in it, the two start columns open, joined over open ground."""
    H, W = len(terr), len(terr[0])
    a = 1 + (w - (GAP + 2)) // 2 if w < 20 else 7
    cols = (a, a + GAP)
    best, bs = None, -1e9
    for oy in range(0, H - h + 1):
        for ox in range(0, W - w + 1):
            op = lambda x, y: terr[oy + y][ox + x] not in ('blocked',) and (ox + x, oy + y) not in cov_solid
            kinds = {lay[(oy + y) // bt][(ox + x) // bt].split('.')[0] for y in range(h) for x in range(w)}
            if not kinds & set(lead): continue
            room = [sum(op(c, y) for y in range(h)) for c in cols]
            if min(room) < h / 2: continue
            seen = {(cols[0], y) for y in range(h) if op(cols[0], y)}; q = deque(seen); ok = False
            while q:
                x, y = q.popleft()
                if x == cols[1]: ok = True; break
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in seen and op(nx, ny): seen.add((nx, ny)); q.append((nx, ny))
            if not ok: continue
            lead_tiles = sum(lay[(oy + y) // bt][(ox + x) // bt].split('.')[0] in lead for y in range(h) for x in range(w))
            sc = lead_tiles + 2 * sum(room) - abs(oy + h / 2 - H / 2) - abs(ox + w / 2 - W / 2)
            if sc > bs: bs, best = sc, [ox, oy, w, h]
    return best, list(cols)


def main():
    m = json.load(open(MAN))
    bt, tm = m['block_tiles'], m['tile_metres']
    edges = L.read_all(m)
    lib = library(m)
    solid = {k for k, v in list(m['cover'].items()) + list(m['cover_extra'].items()) if v.get('blocks_move')}
    out = {}
    for kind, (lead, pal_of, _) in KINDS.items():
        out[kind] = {}
        for size, (C, R, w, h) in SIZES.items():
            pal = [list(r) for r in pal_of(R)]
            pal = [[b for b in row if b in lib] for row in pal]
            got = None
            for k in range(200):
                lay = L.solve(pal, edges, random.Random('size-%s-%s-%d' % (kind, size, k)), twins=kind != 'freeway', tries=6000, cols=C)
                if not lay or not any(b.split('.')[0] in lead for row in lay for b in row): continue
                terr, cov, lit = compose(lay, lib, bt, tm)
                cs = {(int(c['x_m'] // tm), int(c['y_m'] // tm)) for c in cov if c['piece'] in solid}
                win, cols = window(lay, terr, cs, lead, w, h, bt)
                if win: got = (lay, terr, cov, lit, win, cols); break
            if not got: die('%s %s: no board meets the join rule with a window that joins the lines' % (kind, size))
            lay, terr, cov, lit, win, cols = got
            faults = L.board_faults(lay, edges)
            if faults: die('%s %s has broken seams: %s' % (kind, size, faults[:2]))
            out[kind][size] = dict(blocks=lay, tiles=[C * bt, R * bt], window=win, start_cols=cols, terrain=terr, cover=cov, lights=lit)
            print('  %-8s %-6s %s window %s cols %s' % (kind, size, lay, win, cols))
    m['sized'] = out
    m['sized_key'] = {'sizes': {k: dict(blocks=[v[0], v[1]], window=[v[2], v[3]]) for k, v in SIZES.items()},
                      'window': '[ox, oy, w, h] in house tiles: the default opening cut, where the two lines meet; the rest of the blocks is the city round it',
                      'start_cols': 'the two lines inside the window, five tiles apart (Battle Brothers)',
                      'rule': 'rule 79: small for a few against a few, middle for a dozen a side, large for the endgame or three parties'}
    json.dump(m, open(MAN, 'w'), indent=1)
    print('ok: %d kinds x 3 sizes, every one joined by rule 77' % len(out))




def sheets(shots_dir):
    """One VOTE sheet per kind: the three sizes from above (the window marked) and the small one in the fight."""
    from PIL import Image, ImageDraw, ImageFont
    m = json.load(open(MAN)); bt, tp = m['block_tiles'], m['tile_px']
    f = lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', n)
    sc = 0.05; bw, bh = int(bt * tp[0] * sc), int(bt * tp[1] * sc); cache = {}
    outs = []
    for kind, sizes in m['sized'].items():
        panels = []
        for size in ('small', 'middle', 'large'):
            sb = sizes[size]; lay = sb['blocks']
            im = Image.new('RGB', (bw * len(lay[0]), bh * len(lay)))
            for r, row in enumerate(lay):
                for c, n in enumerate(row):
                    if n not in cache: cache[n] = Image.open('slices/fight_ground/' + m['blocks'][n]['src']).convert('RGB').resize((bw, bh), Image.LANCZOS)
                    im.paste(cache[n], (c * bw, r * bh))
            dark = Image.blend(im, Image.new('RGB', im.size, (10, 9, 8)), 0.45)
            ox, oy, w, h = sb['window']; tx, ty = bw / bt, bh / bt
            box = (int(ox * tx), int(oy * ty), int((ox + w) * tx), int((oy + h) * ty))
            dark.paste(im.crop(box), box[:2])
            d = ImageDraw.Draw(dark); d.rectangle(box, outline=(255, 236, 160), width=2)
            for c in sb['start_cols']:
                x = int((ox + c + 0.5) * tx); d.line([(x, box[1]), (x, box[3])], fill=(120, 200, 255) if c == sb['start_cols'][0] else (255, 110, 90), width=2)
            panels.append((size, sb, dark))
        phone = Image.open('%s/size_%s_small.png' % (shots_dir, kind)).convert('RGB').resize((300, 649), Image.LANCZOS)
        W = 20 + sum(p[2].size[0] + 20 for p in panels) + 320
        H = 70 + max(649, max(p[2].size[1] for p in panels) + 40) + 60
        out = Image.new('RGB', (W, H), (12, 11, 10)); d = ImageDraw.Draw(out)
        d.text((20, 14), '%s: SMALL, MIDDLE, LARGE  (rule 79: the board fits the party)' % kind.upper(), font=f(20), fill=(222, 181, 118))
        x = 20
        for size, sb, im in panels:
            d.text((x, 46), '%s  %d x %d, opens on %d x %d' % (size.upper(), sb['tiles'][0], sb['tiles'][1], sb['window'][2], sb['window'][3]), font=f(13), fill=(255, 236, 160))
            out.paste(im, (x, 70)); x += im.size[0] + 20
        d.text((x, 46), 'SMALL, IN THE FIGHT', font=f(13), fill=(255, 236, 160)); out.paste(phone, (x, 70))
        d.text((20, H - 44), 'Yellow box: where the fight opens. Blue: your line. Red: theirs, five tiles apart. Outside the box: the same city, there to pan into. Every edge joins (rule 77).', font=f(13), fill=(200, 170, 120))
        p = 'slices/vote/COMBAT2_BOARDS_BY_SIZE_%s_10_9.png' % kind.upper()
        out.save(p, optimize=True); outs.append(p)
    return outs


if __name__ == '__main__':
    main()
    if len(sys.argv) > 1: print(sheets(sys.argv[1]))
