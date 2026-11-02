#!/usr/bin/env python3
"""BOHEMIA -- COMBAT [the fight's layers] 11/2/26 (ask line 251, Paolo 10/27: 'a graphic system where it recognizes the overlays...
if I'm in the street during combat mode and there's a house one tile beneath me south of me... if that house is a one or two or
three story house then it would cover up like the legs of my character... the layers of this 45 degree combat model').

WHAT IT WRITES: slices/fight_ground/fight_stands.json, the silhouette of every building on the fight's blocks that stands up into
the tile north of it, read off the block pictures themselves, so the fight can lay that building back over a man standing behind
it (slices/BOHEMIA_FIGHT.html, THE LAYERS). A building is listed by the picture it is drawn in (present day and both futures),
in that picture's own pixels:
  line  the building's front on the ground, in art px (y): a man whose feet stand north of line - half a tile is behind it
  poly  its outline from the top, [[x, y], ...] left to right along the roof's top edge, closed down to the ground line

HOW A TOP IS READ. The town blocks' buildings were built in 3D by COOK (tools/bohemia_cook_the_town_blocks_through_the_rig_10_22_26.py)
from the measures in records/target/cook_floor_not_final/town.json: x0..x1 and the ground line, the wall's height h and the depth
D. On this camera (the 45 law, slices/fight_ground/fight_ground.json 'perspective') a height is 1:1 on the glass at 42.92 px a metre
and a depth is x0.7071, so the back eave stands at y1 - h*42.92 - D*0.7071*42.92 (a flat deck's parapet 0.6 m over it). That is
the guess; the top is then the strongest edge in the picture within a few pixels of it, read on the row means of the building's
middle columns (measured on main.0's shop: guessed 914.5, the picture's edge 916). Two shapes are not boxes and are traced by hand
off the picture (TRACED below): the church's gable and its tower, and the gas station's canopy, kiosk and garage. The suburb's
ranch houses (records/target/cook_floor_rig/blocks.json) sat inside their own tile until COMBAT 11/2 [a house covers his legs]:
now each stands at its real size with its back wing to the tile's back line (tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py
place_houses), and the rig renders the houses once more alone, one flat colour each, and writes each house's top edge off those
pixels into the ledger ('top', 33 columns). Those tops are listed here as they are (how: 'mask'), for the present day and both
futures (the same houses; the reclaimed panels lie on the slopes under the top edge).

  python3 tools/bohemia_combat_the_fight_layers_11_2_26.py            (writes the file and prints every top)
  python3 tools/bohemia_combat_the_fight_layers_11_2_26.py --sheet P  (and a contact sheet of every top read, to look at)

REFERENCE CHECK: the block pictures are the only source; nothing is drawn. [bb] Battle Brothers' tall pieces (trees, houses, walls)
are drawn after the men on the hexes behind them, so a brother behind a house is hidden by it to the height of the house.
REUSE CHECK (REUSE-FIRST): COOK's own measures (town.json, blocks.json), the shipped block pictures; no new picture.
"""
import os, sys, json
import numpy as np
from PIL import Image, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(R, 'slices/fight_ground')
TOWN = os.path.join(R, 'records/target/cook_floor_not_final/town.json')
RANCH = os.path.join(R, 'records/target/cook_floor_rig/blocks.json')
OUT = os.path.join(G, 'fight_stands.json')
PPM = 515 / 12.0          # the block's ruler: a 12 m house tile is 515 px
COS = 0.7071              # the 45 law: a depth on the glass
TILE_H = 364
PARAPET = 0.6             # COOK's flat_roof(parapet=0.6)
SNAP = (-35, 25)          # where the edge is looked for, round the guess (px)
SNAP_RIDGE = (-60, 25)    # a ridge roof's back slope stands a little over its back eave

# TRACED by hand off main.0's picture (main.1 is the same model): [x, y] along the top, left to right, art px
TRACED = {
    'church': {'match': lambda q: q.get('arch') == 'house' and q.get('D', 0) > 11, 'poly': [[8, 805], [190, 720], [197, 720], [372, 855], [548, 853]]},
    'gas': {'match': lambda q: q['kind'] == 'canopy', 'parts': [
        {'line': 526, 'poly': [[57, 307], [303, 307]]},          # the canopy's slab (its posts stand open under it)
        {'line': 526, 'poly': [[381, 257], [567, 257], [567, 233], [835, 233]]}]},   # the kiosk and its garage
}


def edge_at(im, x0, x1, lo, hi):
    """the strongest step in the row means of the middle columns, between lo and hi (art px)"""
    a, b = int(x0 + (x1 - x0) * .1), int(x1 - (x1 - x0) * .1)
    lo, hi = max(6, int(lo)), min(im.shape[0] - 6, int(hi))
    if hi <= lo or b <= a: return None, 0
    rows = im[lo - 6:hi + 6, a:b].mean(1)                    # (rows, 3)
    best, by = -1, None
    for y in range(lo, hi):
        i = y - (lo - 6)
        g = np.abs(rows[i + 1:i + 5].mean(0) - rows[i - 5:i - 1].mean(0)).sum()
        if g > best: best, by = g, y
    return by, float(best)


SKIPPED = []
MASTERS = {'': 'records/target/cook_floor_not_final', '_reclaimed': 'records/target/cook_floor_futures/reclaimed',
           '_raided': 'records/target/cook_floor_futures/raided'}


def sha1(path):
    import hashlib
    return hashlib.sha1(open(path, 'rb').read()).hexdigest()


def drawn_with_new_houses(bid, d, srcs):
    """COMBAT 11/2: which of a suburb block's pictures (present day, both futures) are drawn with the houses whose tops the
    ledger holds: where the rig's lossless render of that picture is on this disk, the shipped file must match it (mean
    difference under 4 of 255: it is that render, saved for the game) and its sha1 is written into the ledger
    ('new_pictures'); anywhere else the ledger's sha1 must still be the file's. A picture not re-rendered yet keeps the old
    house and gets no outline (a cover with nothing drawn there would lay ground over his legs)."""
    have = dict(d.get('new_pictures', {}))
    for src in srcs:
        f = os.path.join(G, src); stem = src[len('block_'):-len('.webp')]
        tail = '_reclaimed' if stem.endswith('_reclaimed') else '_raided' if stem.endswith('_raided') else ''
        m = os.path.join(R, MASTERS[tail], 'block_%s.webp' % stem[:len(stem) - len(tail)])
        if os.path.exists(m):
            a_ = np.asarray(Image.open(f).convert('RGB'), np.int16); b_ = np.asarray(Image.open(m).convert('RGB'), np.int16)
            if a_.shape == b_.shape and np.abs(a_ - b_).mean() < 4: have[src] = sha1(f)
            else: have.pop(src, None)
    d['new_pictures'] = have
    return {src for src in srcs if have.get(src) == sha1(os.path.join(G, src))}


MAN_TILES, FEET = 1.8, 0.9      # slices/BOHEMIA_FIGHT.html: MAN_ROWS, and layAt()'s feet at 0.9 of his tile
TILE_W = 515


def cover(poly, line):
    """the share of a man in the tile right behind a building that it covers: at his middle, the mean across his legs (the
    middle 0.14 of a tile), and at the outline's highest point over him; poly its top (art px), line its front"""
    feet = (round(line / TILE_H) - 2 + FEET) * TILE_H; tall = MAN_TILES * TILE_H
    xs = np.array([p[0] for p in poly], float); ys = np.array([p[1] for p in poly], float)
    xc = (np.floor(((xs.min() + xs.max()) / 2) / TILE_W) + .5) * TILE_W
    at = lambda x: float(np.interp(x, xs, ys))
    legs = [at(x) for x in np.linspace(xc - .07 * TILE_W, xc + .07 * TILE_W, 15)]
    over = [at(x) for x in np.linspace(xc - .2 * TILE_W, xc + .2 * TILE_W, 41)]
    f = lambda y: max(0.0, (feet - y) / tall * 100)
    return f(at(xc)), float(np.mean([f(y) for y in legs])), f(min(over))


def main(sheet=None):
    town = json.load(open(TOWN))
    fg = json.load(open(os.path.join(G, 'fight_ground.json')))
    srcs = {}                                                # block id -> [pictures]
    for bid, d in fg['blocks'].items(): srcs.setdefault(bid, []).append(d['src'])
    for st in fg.get('futures', {}).values():
        for bid, s in st.get('blocks', {}).items(): srcs.setdefault(bid, []).append(s)
    out, crops = {}, []
    for bid, blds in town.items():
        for src in srcs.get(bid, []):
            im = np.asarray(Image.open(os.path.join(G, src)).convert('RGB')).astype(float)
            stands = []
            for q in blds:
                tr = [t for t in TRACED.values() if t['match'](q)]
                if tr:
                    t = tr[0]
                    for p in t.get('parts', [{'line': q['y1'], 'poly': t.get('poly')}]):
                        stands.append({'line': p['line'], 'poly': p['poly'], 'how': 'traced'})
                    continue
                X0, X1, y1 = q['x0'] * PPM, q['x1'] * PPM, q['y1']
                r = round(y1 / TILE_H) - 1                       # the building's own tile row
                # a small ridge house (the ruin's) is drawn inside its own tile (COOK's box: its top under the tile's top edge);
                # an edge read above it is the sand or the walk, never its roof (seen on the sheet, 11/2)
                if q.get('arch') == 'house' and q['box'][1] >= r * TILE_H: continue
                guess = y1 - (q['h'] + (PARAPET if q.get('roof') == 'flat' else 0)) * PPM - q['D'] * COS * PPM
                s = SNAP_RIDGE if q.get('roof') == 'ridge' else SNAP
                top, g = edge_at(im, X0, X1, guess + s[0], guess + s[1])
                if top is None: continue
                top = max(0, top)
                if top >= r * TILE_H - 2: continue               # stands up into nobody's tile
                stands.append({'line': int(y1), 'poly': [[int(round(X0)), int(top)], [int(round(X1)), int(top)]], 'how': 'read',
                               'guess': round(guess, 1), 'edge': round(g, 1)})
                if sheet and src == fg['blocks'][bid]['src']:
                    crops.append((src, int(X0), int(X1), int(top), int(guess)))
            if stands: out[src] = stands
            print(src, [(s['poly'][0][1], s['line'], s['how']) for s in stands])
    # the ranch houses (COMBAT 11/2): their tops off the rig's own mask, where the ledger has them
    ranch = json.load(open(RANCH)); worst = 1.0
    for bid, d in ranch.items():
        new = drawn_with_new_houses(bid, d, srcs.get(bid, [])) if any(h.get('top') for h in d.get('houses', [])) else set()
        for src in srcs.get(bid, []):
            if src not in new and any(h.get('top') for h in d.get('houses', [])): SKIPPED.append(src)
        for h in d.get('houses', []):
            x0, y0, x1, y1 = h['old_px']; r = round(y1 / TILE_H) - 1
            top = min([p[1] for p in h.get('top', [])] or [y0])
            worst = min(worst, (top - r * TILE_H) / TILE_H)
            if len(h.get('top', [])) < 2: continue
            for src in srcs.get(bid, []):
                if src in new: out.setdefault(src, []).append({'line': int(y1), 'poly': h['top'], 'how': 'mask'})
    import re                                                 # the pictures each block's houses are drawn in ('new_pictures')
    txt = json.dumps(ranch, indent=1)
    open(RANCH, 'w').write(re.sub(r'\[\s+(-?\d+),\s+(-?\d+)\s+\]', r'[\1, \2]', txt))   # a point on one line
    if SKIPPED: print('ranch outlines NOT listed, that picture still shows the old houses:', sorted(SKIPPED))
    print('ranch houses: the highest top stands %.2f of a tile %s its own tile\'s top edge' % (abs(worst), 'below' if worst >= 0 else 'above'))
    for bid in sorted(ranch):
        if any(h.get('top') for h in ranch[bid].get('houses', [])):
            print(' ', bid, [(h['kind'], min(p[1] for p in h['top']), h['old_px'][3]) for h in ranch[bid]['houses'] if h.get('top')])
    # how much of a man standing in the tile right behind each one it covers (the fight's own numbers: his feet at 0.9 of
    # his tile, he is MAN_ROWS 1.8 tiles tall, he stands at his tile's middle; his legs are the middle 0.14 of a tile)
    print('covered of a man in the tile behind (at his middle | across his legs | the highest point):')
    for bid in sorted(ranch):
        for h in ranch[bid].get('houses', []):
            if len(h.get('top', [])) < 2: continue
            print('  %-14s %-12s %s' % (bid, h['kind'], ' | '.join('%4.1f%%' % v for v in cover(h['top'], h['old_px'][3]))))
    doc = {'version': 'fight-stands-11-2', 'lane': 'combat', 'for_file': 'slices/BOHEMIA_FIGHT.html (THE LAYERS)',
           'made_by': 'tools/bohemia_combat_the_fight_layers_11_2_26.py',
           'key': {'line': "the building's front on the ground (art px, y): a man is behind it when his feet stand north of line - half a tile",
                   'poly': "its top edge, left to right (art px); the outline closes straight down to the line"},
           'ranch_top_below_tile_edge': round(worst, 3), 'pictures': out}
    json.dump(doc, open(OUT, 'w'), separators=(',', ':'))
    print('wrote', os.path.relpath(OUT, R), sum(len(v) for v in out.values()), 'standing pieces on', len(out), 'pictures')
    if sheet and crops:
        tiles = []
        for src, X0, X1, top, guess in crops:
            im = Image.open(os.path.join(G, src)).convert('RGB')
            y0 = max(0, top - 90); c = im.crop((max(0, X0 - 20), y0, min(im.width, X1 + 20), min(im.height, top + 90)))
            dr = ImageDraw.Draw(c); dr.line([(20, top - y0), (c.width - 20, top - y0)], fill=(255, 0, 255), width=2)
            dr.line([(20, guess - y0), (60, guess - y0)], fill=(0, 255, 255), width=2); dr.text((4, 4), src, fill=(255, 255, 0))
            c.thumbnail((640, 180)); tiles.append(c)
        S = Image.new('RGB', (1280, 180 * ((len(tiles) + 1) // 2)), (20, 20, 20))
        for i, t in enumerate(tiles): S.paste(t, ((i % 2) * 640, (i // 2) * 180))
        S.save(sheet); print('sheet', sheet)


if __name__ == '__main__':
    a = sys.argv[1:]
    main(a[a.index('--sheet') + 1] if '--sheet' in a else None)
