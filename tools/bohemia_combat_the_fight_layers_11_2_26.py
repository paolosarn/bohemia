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
ranch houses (records/target/cook_floor_rig/blocks.json) all sit inside their own tile (their tops 0 to 0.21 of a tile below the
tile's top edge): they stand up into nobody's tile, so none is listed (measured below, printed).

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
    # the ranch houses: where their tops stand in their tiles (none stands up into the tile north)
    ranch = json.load(open(RANCH)); worst = 1.0
    for bid, d in ranch.items():
        for h in d.get('houses', []):
            x0, y0, x1, y1 = h['old_px']; r = round(y1 / TILE_H) - 1
            worst = min(worst, (y0 - r * TILE_H) / TILE_H)
    print('ranch houses: the highest top stands %.2f of a tile below its own tile\'s top edge' % worst)
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
