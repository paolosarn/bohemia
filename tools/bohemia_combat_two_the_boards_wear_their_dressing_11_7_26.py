#!/usr/bin/env python3
"""THE BOARDS WEAR THEIR DRESSING  (COMBAT TWO, 11/7/26; VAMILY rule 419, ask line 479)

Paolo 11/7: 'it feels like you got rid of the rest of the maps, we need more love and better shit.'
Rule 419: a board laid from the map (rule 407(g), 11/6h) keeps the map's layout tile for tile AND wears all of the old template
boards' dressing (their props, cover, blockers, roofs and high ground, the floor's effects, the district's set pieces), seeded so
no two are the same; no board poorer than the template the same spot dealt; and the street board's own kit grows where it is thin.

NOTHING IS DRAWN HERE (rule 108, rule 337). Two things are read and written for slices/bohemia_street_board.js dress():
  1. THE LIFT TABLE. Every block of the fight's library (slices/fight_ground/fight_ground.json blocks, the hand-made template
     blocks he said 'we're doing good on the combat maps' to, 11/4) is read tile by tile: how much of each 515 x 364 tile is
     asphalt (dark), its mean light, and the block's family (ground, paved, nature). The fight lifts a template tile WHOLE (its
     own picture, its baked props, its terrain, its cover entry, its lamp or drum) onto a laid tile of the same kind of ground,
     so the template's own art stands on the map's own layout. Nothing is copied: the board draws the tile from the block's
     own picture (a source rect), so the only new bytes are this table.
  2. THE KIT GROWS (rule 419(c)). The master rig's own renders of the approved models (records/target/master_rig/cook_*:
     tools/bohemia_direction_master_rig.py, 45 degrees, 57 px a metre, one sun, the source pass, their own contact shadow) are
     cut to the fight's ruler (42.9 px a metre) as standing pieces: the alleys (propane tank, drums and cones, tyres, a
     container), the yards' junk (tyres, a cart, bales, a rolled car), the burned blocks' rubble (the heap, the rubble pile,
     a dozer), the Strip's pieces (the barrier, sandbags, a patrol car, a wreck, a cart corral) and a casino's front (the
     dead motel and casino sign). A MASS (the container, the bales, the dozer, the heap, the sign) may also stand as a whole
     tile: a roof you climb (the container, the bales), a rise (the heap) or a blocker (all but the heap), the tile's terrain
     agreeing with the picture. Two facings each where the piece has a long side (S and E), so a car lies along its street.
     EVERY ONE IS A STAND-IN (rule 408(c)): none has DIRECTION's PASS against the bar yet. ONE golden candidate is named
     (the burned block's rubble pile, 0 of 8 out on the rig's own card): it goes to DIRECTION's eye first; the rest of the
     kit is remade from its recipe once he passes it.
Output: slices/fight_ground/street_board/dressing.json and slices/fight_ground/street_board/kit/*.webp.
Run: python3 tools/bohemia_combat_two_the_boards_wear_their_dressing_11_7_26.py     (about twenty seconds)

REFERENCE CHECK (the 9/4 duty): every piece is the master rig's render of an approved model at real size (the rig's own
proportions check, real_dims_m in each rig.json); the template tiles are the fight's own blocks; nothing new is drawn.
REUSE CHECK (REUSE-FIRST): no new renderer, no new picture of a block; the rig renders and the blocks are read where they lie.
[bb] Battle Brothers dresses every tactical map from its tile's own doodads (a settlement's carts, fences and barrels); ours
dresses the map's own street with the template boards' own props and the rig's.
[analog horror] a dead patrol car parked across the very lane the map showed a second ago, its door open, nobody near it.
"""
import json, os
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FG = os.path.join(ROOT, 'slices/fight_ground')
OUT = os.path.join(FG, 'street_board')
KIT = os.path.join(OUT, 'kit')
RIG = os.path.join(ROOT, 'records/target/master_rig')
G = json.load(open(os.path.join(FG, 'fight_ground.json')))
TPX, TM, BT, PPM = G['tile_px'], G['tile_metres'], G['block_tiles'], G['px_per_metre']
PYM = TPX[1] / TM

# the block kinds whose height and blocked tiles are LAND (a bank, a rise, a boulder field), not a building's mass
NATURE = {'desert', 'scrub', 'scrubroad', 'canyon', 'pass', 'wash', 'basin', 'lakebed', 'shore', 'marina', 'golf', 'dump', 'landfill'}
# the block kinds whose open ground is paved (a boulevard's walks, a plaza, the airfield's slab), not dirt
PAVED = {'blvd', 'strip', 'stripe', 'stripw', 'fremont', 'main', 'casino', 'apron', 'freeway', 'freewayo'}


def b_src(b_name):
    return G['blocks'][b_name]['src']


def lift_table():
    out = {}
    for name, b in sorted(G['blocks'].items()):
        im = np.asarray(Image.open(os.path.join(FG, b['src'])).convert('RGB')).astype(np.float32)
        H, W = im.shape[:2]
        tw, th = W / BT, H / BT
        lum = 0.299 * im[..., 0] + 0.587 * im[..., 1] + 0.114 * im[..., 2]
        dark, mean, edge = [], [], []
        for ty in range(BT):
            for tx in range(BT):
                t = lum[int(round(ty * th)):int(round((ty + 1) * th)), int(round(tx * tw)):int(round((tx + 1) * tw))]
                dark.append(int(round(100 * float((t < 85).mean()))))
                mean.append(int(round(float(t.mean()))))
                # its border, 16 px in: a tile whose border is its place's bare ground holds its thing inside it (a pool, a
                # boulder, a wall's end) and may stand anywhere; a tile whose border is a pattern running on (a wash, a road,
                # a row of shops) only where it lay
                b = np.concatenate([t[:16].ravel(), t[-16:].ravel(), t[:, :16].ravel(), t[:, -16:].ravel()])
                edge.append(int(round(float(np.median(b)))))
        kind = name.split('.')[0]
        out[name] = dict(src=b_src(b_name=name), fam='nature' if kind in NATURE else 'paved' if kind in PAVED else 'ground', dark=dark, lum=mean, edge=edge)
    return out


# name, rig folder, kind, height (m), flags, where it stands (the board's context), facings
PIECES = [
    ('sb_tyres', 'cook_tyres', 'LOW_COVER', 0.8, {}, ['alley', 'yard'], ['S', 'E']),
    ('sb_cart', 'cook_cart', 'LOW_COVER', 1.1, {}, ['yard', 'lot', 'plaza', 'walk'], ['S', 'E']),
    ('sb_propane', 'cook_propane', 'COVER', 1.27, {}, ['alley', 'yard'], ['S', 'E']),
    ('sb_drums', 'cook_drums', 'LOW_COVER', 1.06, {}, ['street', 'alley', 'walk'], ['S', 'E']),
    ('sb_heap', 'cook_heap', 'COVER', 2.1, {'mass': ['rise']}, ['ruin', 'yard', 'works', 'lot'], ['S', 'E']),
    ('sb_rubble', 'cook_rubble', 'COVER', 1.37, {}, ['ruin', 'walk', 'yard'], ['S', 'E']),
    ('sb_barrier', 'cook_barrier', 'LOW_COVER', 0.85, {}, ['street', 'plaza', 'walk'], ['S', 'E']),
    ('sb_sandbags', 'cook_sandbags', 'LOW_COVER', 0.84, {}, ['plaza', 'walk', 'alley'], ['S', 'E']),
    ('sb_container', 'cook_container', 'COVER', 2.57, {'mass': ['roof', 'block']}, ['works', 'lot', 'front'], ['S', 'E']),
    ('sb_bales', 'cook_bales', 'COVER', 2.25, {'mass': ['roof', 'block']}, ['works', 'yard', 'lot'], ['S']),
    ('sb_rolled', 'cook_rolled', 'COVER', 1.78, {}, ['street', 'yard', 'lot'], ['S', 'E']),
    ('sb_corral', 'cook_corral', 'LOW_COVER', 2.0, {'see_through': True}, ['lot', 'plaza'], ['S']),
    ('sb_dozer', 'cook_dozer', 'COVER', 3.26, {'mass': ['block']}, ['works', 'ruin', 'lot'], ['S']),
    ('sb_wreck', 'cook_wreck', 'COVER', 1.43, {}, ['street', 'lot'], ['S', 'E']),
    ('sb_patrol', 'cook_patrol', 'COVER', 1.55, {}, ['street', 'plaza'], ['S', 'E']),
    ('sb_sign', 'cook_bld_motel_sign', 'SIGN', 10.35, {'mass': ['block'], 'mass_only': True}, ['plaza', 'front'], ['S']),
]
GOLDEN = 'sb_rubble_S'   # the one golden candidate (0 of 8 out on the rig's own card): to DIRECTION's eye first


def cut(rig, face):
    d = os.path.join(RIG, rig)
    meta = json.load(open(os.path.join(d, 'rig.json')))
    body = Image.open(os.path.join(d, 'rig_%s.png' % face)).convert('RGBA')
    sp = os.path.join(d, 'shadow_%s.png' % face)
    k = PPM / float(meta['ppm'])
    bb = body.split()[3].getbbox()
    sh = Image.new('RGBA', body.size, (0, 0, 0, 0))
    if os.path.exists(sp):
        sh.alpha_composite(Image.open(sp).convert('RGBA'))
    sh.alpha_composite(body)
    full = sh.getbbox()
    im = sh.crop(full)
    W, H = max(1, round(im.width * k)), max(1, round(im.height * k))
    im = im.resize((W, H), Image.LANCZOS)
    foot = [round(((bb[0] + bb[2]) / 2 - full[0]) * k, 1), round((bb[3] - full[1]) * k, 1)]
    card = meta.get('card')
    out = str(card)[str(card).find("'out': ") + 7:][:1] if card else '?'
    return im, dict(w=W, h=H, foot=foot, dims_m=meta['real_dims_m'], model=meta['model'], rig='records/target/master_rig/%s/rig_%s.png' % (rig, face),
                    rig_card_out=out)


def main():
    os.makedirs(KIT, exist_ok=True)
    for f in os.listdir(KIT):
        if f.endswith('.webp'):
            os.remove(os.path.join(KIT, f))
    lift = lift_table()
    kit = {}
    for name, rig, kind, h, flags, ctx, faces in PIECES:
        for face in faces:
            key = '%s_%s' % (name, face)
            im, meta = cut(rig, face)
            f = '%s.webp' % key
            im.save(os.path.join(KIT, f), quality=86, alpha_quality=90, method=6)
            d = dict(src='street_board/kit/' + f, kind=kind, h=h, ctx=ctx, along='ew' if face in ('S', 'N') else 'ns',
                     stage='golden_candidate' if key == GOLDEN else 'stand_in', name=name.replace('sb_', '').upper())
            d.update(flags)
            d.update(meta)
            kit[key] = d
    out = dict(version='street-board-dressing-11-7', lane='combat 2', rule='419 (ask line 479)',
               made_by='tools/bohemia_combat_two_the_boards_wear_their_dressing_11_7_26.py',
               tile_px=TPX, tile_metres=TM, block_tiles=BT,
               lift=lift, kit=kit, golden_candidate=GOLDEN,
               note='lift: per block, per tile (row major) its asphalt share (dark, %) and mean light; fam: ground / paved / nature. '
                    'kit: standing pieces cut from the master rig at the fight\'s ruler; stage stand_in until DIRECTION\'s PASS (408(c)).')
    json.dump(out, open(os.path.join(OUT, 'dressing.json'), 'w'), separators=(',', ':'))
    size = sum(os.path.getsize(os.path.join(KIT, f)) for f in os.listdir(KIT))
    print('lift table', len(lift), 'blocks; kit', len(kit), 'pieces,', round(size / 1024), 'KB; golden candidate', GOLDEN)


if __name__ == '__main__':
    main()
