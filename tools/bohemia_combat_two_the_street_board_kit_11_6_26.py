#!/usr/bin/env python3
"""THE STREET BOARD KIT  (COMBAT TWO, 11/6/26, rule 407(g) step one; ask line 450)

Rule 407 (Paolo 11/4: 'imagine if you made a combat map whose street layout was exactly like the city... the sizing is
the same... use all the same assets, right now it's two different maps'). Step one: a fight's board is laid out from the
map's own block where the fight happens, tile for tile (slices/bohemia_street_board.js). This tool cuts the pieces that
board is laid from. NOTHING IS DRAWN HERE (rule 108): every pixel is an approved file at its own size or the fight's.

  1. THE STREETS: COOK TWO's street kit (slices/fight_ground/kit_street, 21 one-tile pieces with their joins) is read
     where it lies; the board names its pieces. Nothing copied.
  2. THE GROUND BETWEEN: one-tile cuts of the fight's own blocks (made from his packs), chosen by the machine, never by
     eye: a tile on a block's FLAT ground, with no cover piece on it, no building's outline over it (fight_stands.json)
     and the least texture energy of its kind. yard (the suburb's dirt), lot (the parking asphalt), desert, park,
     plaza (concrete), water, rubble ground, rail, apron (the airfield's concrete).
  3. THE HOUSES: the SAME FIVE RANCH MODELS the map stands up close (slices/map_houses/manifest.json names
     bld_ranch_plain/porch/wing/garage/carport.glb), as the master rig rendered them at the FIGHT'S camera (45 degrees,
     orthographic, south faces seen, records/target/master_rig/cook_bld_ranch_*), their own cast shadow under them,
     taken from the rig's 57 px a metre to the fight's 42.9.
  4. THE BUILDINGS of the map's works, shops, civic blocks, towers and casinos: the master rig's warehouse, pawn shop,
     gas station, motel, school, church, chapel, casino and tower casino, the same way.
Output: slices/fight_ground/street_board/*.webp and street_board.json (the piece list the board module reads).
Run: python3 tools/bohemia_combat_two_the_street_board_kit_11_6_26.py    (about half a minute)
"""
import json, os
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FG = os.path.join(ROOT, 'slices/fight_ground')
OUT = os.path.join(FG, 'street_board')
RIG = os.path.join(ROOT, 'records/target/master_rig')

G = json.load(open(os.path.join(FG, 'fight_ground.json')))
STANDS = json.load(open(os.path.join(FG, 'fight_stands.json')))['pictures']
TPX = G['tile_px']            # [515, 364]
TM = G['tile_metres']         # 12
BT = G['block_tiles']         # 5
PPM = G['px_per_metre']       # 42.9

# ---- the ground between: which blocks a kind is cut from (their own terrain says where the flat ground is) ----
GROUND = {
    'dirt':   ['scrub.0', 'scrub.1', 'scrub.2', 'desert.1', 'desert.2', 'desert.3'],
    'plaza':  ['strip.0', 'strip.1', 'fremont.10', 'fremont.11'],
    'water':  ['shore.0', 'shore.1', 'marina.0'],
    'rubble': ['landfill.0', 'landfill.1'],
    'apron':  ['apron.0', 'apron.1', 'apron.2', 'apron.3', 'apron.4', 'works.0'],
}
# MEASURED on the first cut (11/6): the least-energy flat tile of a suburb block is its STREET (smooth asphalt) or a yard
# with a roof's shadow and the yards' two-tone patches across it, of a golf
# block a path, of a ruin a parking lot; so each kind also has its colour: the dirt is tan (red over blue, mid value), the
# concrete pale and grey. The lot is COOK TWO's own plain asphalt piece (kit_street junction), the yard and the park are the desert's own dirt (the suburb blocks' yards are that dirt under baked shadows)
# (rule 341: no water, a dead lawn is dust), the rail bed is the rubble ground (the map's rail is a bank, not a track here).
def colour_ok(kind, a):
    m = a.reshape(-1, 3).mean(axis=0); lum = 0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]; warm = m[0] - m[2]
    if kind == 'dirt': return 95 <= lum <= 185 and warm >= 10
    if kind in ('plaza', 'apron'): return lum >= 120 and abs(warm) <= 30
    return True
WANT_TERRAIN = {'water': 'water', 'rubble': None}
VARIANTS = 3


def block_lib():
    lib = {}
    for bn, B in G['boards'].items():
        for by, row in enumerate(B['blocks']):
            for bx, name in enumerate(row):
                if name in lib:
                    continue
                T = [r[bx * BT:(bx + 1) * BT] for r in B['terrain'][by * BT:(by + 1) * BT]]
                x0, y0 = bx * BT * TM, by * BT * TM
                cov = [(c['x_m'] - x0, c['y_m'] - y0) for c in B.get('cover', [])
                       if x0 <= c['x_m'] < x0 + BT * TM and y0 <= c['y_m'] < y0 + BT * TM]
                lights = [(l['x_m'] - x0, l['y_m'] - y0) for l in B.get('lights', [])
                          if x0 <= l['x_m'] < x0 + BT * TM and y0 <= l['y_m'] < y0 + BT * TM]
                lib[name] = dict(terrain=T, cover=cov, lights=lights)
    return lib


def stands_tiles(src):
    """the tiles a building's outline (and the band under it to its wall's foot) covers, in the block's own tiles"""
    out = set()
    for q in STANDS.get(src, []):
        xs = [p[0] for p in q['poly']]; ys = [p[1] for p in q['poly']] + [q['line']]
        for tx in range(int(min(xs) // TPX[0]), int(max(xs) // TPX[0]) + 1):
            for ty in range(int(min(ys) // TPX[1]), int(max(ys) // TPX[1]) + 1):
                out.add((tx, ty))
    return out


def energy(a):
    g = a.astype(np.float32).mean(axis=2)
    return float(np.abs(np.diff(g, axis=0)).mean() + np.abs(np.diff(g, axis=1)).mean() + g.std() * 0.15)


def cut_ground(lib):
    picked = {}
    for kind, names in GROUND.items():
        cands = []
        for n in names:
            if n not in lib or n not in G['blocks']:
                continue
            src = G['blocks'][n]['src']
            path = os.path.join(FG, src)
            if not os.path.exists(path):
                continue
            L = lib[n]
            busy = stands_tiles(src)
            for c in L['cover'] + L['lights']:
                busy.add((int(c[0] // TM), int(c[1] // TM)))
            im = np.asarray(Image.open(path).convert('RGB'))
            for ty in range(BT):
                for tx in range(BT):
                    t = L['terrain'][ty][tx]
                    want = WANT_TERRAIN.get(kind, 'flat')
                    if want and t != want:
                        continue
                    if (tx, ty) in busy:
                        continue
                    # the tiles round it too: a shadow or a roof's lean reaches a tile past its own
                    if kind not in ('water', 'rubble', 'rail') and any((tx + dx, ty + dy) in busy for dx in (-1, 0, 1) for dy in (0, 1)):
                        continue
                    a = im[ty * TPX[1]:(ty + 1) * TPX[1], tx * TPX[0]:(tx + 1) * TPX[0]]
                    if not colour_ok(kind, a):
                        continue
                    cands.append((energy(a), n, tx, ty, a))
        cands.sort(key=lambda c: c[0])
        out, seen = [], set()
        for e, n, tx, ty, a in cands:
            if (n, ty) in seen and len(cands) > VARIANTS * 2:   # variants from different rows or blocks
                continue
            seen.add((n, ty))
            f = 'ground_%s_%d.webp' % (kind, len(out))
            Image.fromarray(a).save(os.path.join(OUT, f), quality=88, method=6)   # lossy at the blocks' own grain: a tile is ~40 KB
            out.append(dict(src=f, from_block=n, tile=[tx, ty], energy=round(e, 2)))
            if len(out) >= VARIANTS:
                break
        picked[kind] = out
        print('ground', kind, len(cands), 'candidates ->', [(o['from_block'], o['tile']) for o in out])
    return picked


def cut_rig(name, key, kind):
    d = os.path.join(RIG, 'cook_bld_' + name)
    meta = json.load(open(os.path.join(d, 'rig.json')))
    body = Image.open(os.path.join(d, 'rig_S.png')).convert('RGBA')
    shade = Image.open(os.path.join(d, 'shadow_S.png')).convert('RGBA')
    k = PPM / float(meta['ppm'])
    bb = body.split()[3].getbbox()                     # the building itself (the shadow is its own layer)
    sh = Image.new('RGBA', body.size, (0, 0, 0, 0)); sh.alpha_composite(shade); sh.alpha_composite(body)
    full = sh.getbbox()
    im = sh.crop(full)
    W, H = max(1, round(im.width * k)), max(1, round(im.height * k))
    im = im.resize((W, H), Image.LANCZOS)
    f = 'bld_%s.webp' % key
    im.save(os.path.join(OUT, f), quality=86, alpha_quality=90, method=6)
    # the wall's foot: the bottom of the building's own picture, centred on its body (where it meets the ground)
    foot = [round(((bb[0] + bb[2]) / 2 - full[0]) * k, 1), round((bb[3] - full[1]) * k, 1)]
    body_box = [round((bb[0] - full[0]) * k, 1), round((bb[1] - full[1]) * k, 1), round((bb[2] - full[0]) * k, 1), round((bb[3] - full[1]) * k, 1)]
    return dict(src=f, w=W, h=H, foot=foot, body=body_box, dims_m=meta['real_dims_m'], kind=kind,
                model=meta['model'], rig='records/target/master_rig/cook_bld_%s/rig_S.png' % name, ppm_from=meta['ppm'])


def main():
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.endswith('.webp'):
            os.remove(os.path.join(OUT, f))
    lib = block_lib()
    ground = cut_ground(lib)
    houses = {}
    man = json.load(open(os.path.join(ROOT, 'slices/map_houses/manifest.json')))['sprites']
    for h in ['ranch_plain', 'ranch_porch', 'ranch_wing', 'ranch_garage', 'ranch_carport']:
        houses[h] = cut_rig(h, h, 'house')
        # the map's own footprint of the same model at each turn, so the board fits a house to its lot by the map's own rule
        houses[h]['map_foot_m'] = {str(t): man['%s_%d' % (h, t)]['foot_m'] for t in (0, 90, 180, 270) if '%s_%d' % (h, t) in man}
    buildings = {}
    for b, kind in [('warehouse', 'works'), ('pawn_shop', 'shop'), ('gas_station', 'shop'), ('motel', 'shop'),
                    ('school', 'civic'), ('church', 'civic'), ('chapel', 'civic'), ('casino', 'casino')]:
        # (the tower casino stands 34 m and its picture covers five rows north of it: a downtown tower takes the casino or the
        # school until COOK makes a tower the fight can live beside; it is not cut, 0.9 MB the board never draws)
        buildings[b] = cut_rig(b, b, kind)
    kit = json.load(open(os.path.join(FG, 'kit_street/kit_street.json')))
    out = dict(
        version='street-board-11-6', lane='combat 2', rule='407(g) step one, ask line 450',
        made_by='tools/bohemia_combat_two_the_street_board_kit_11_6_26.py',
        tile_px=TPX, tile_metres=TM, px_per_metre=PPM,
        streets=dict(dir='kit_street/', pieces={k: dict(src=v['src'], edges=v['edges']) for k, v in kit['pieces'].items()},
                     note="COOK TWO's street kit, read where it lies"),
        ground=ground, houses=houses, buildings=buildings,
        house_from_map="the map's own model key (slices/bohemia_map_houses.js pick()), drawn from the same model through the rig at the fight's camera",
    )
    json.dump(out, open(os.path.join(OUT, 'street_board.json'), 'w'), indent=1)
    print('wrote', os.path.join(OUT, 'street_board.json'), sum(len(v) for v in ground.values()), 'ground tiles,', len(houses), 'houses,', len(buildings), 'buildings')


if __name__ == '__main__':
    main()
