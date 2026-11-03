#!/usr/bin/env python3
"""BOHEMIA -- COOK DEAD [the dead are everywhere] 11/3/26: THE CONTRACT AND THE ONE VOTE CARD (plain python; the models and
their pictures are tools/bohemia_cook_dead_the_dead_are_everywhere_11_3_26.py's, under Blender's python).

  python3 tools/bohemia_cook_dead_card_11_3_26.py manifest   -> records/target/dead/manifest.json
  python3 tools/bohemia_cook_dead_card_11_3_26.py card       -> records/target/dead/CARD_THE_DEAD.webp

THE CONTRACT has COOK PROPS' shape (records/target/fight_props/manifest.json: one entry a model, its picture and ground
pixel, its footprint in 12 m cells, storeys, cover / blocking / none, sees-through, the fight's own kind and tile), plus
what the dead need: who touched them last (moved, robbed, buried, nobody), the pits a board must cut (holes_m, a
rectangle each, centred on the model's own metres), the flies, what a facade stands against, and THE COUNT: how many
pieces this lane suggests per place, and the floor a gate holds (COMBAT MAPS 3 places them on the boards after its
roads; WORLD on the map).

THE CARD (one, the VOTE tab): the set laid on two REAL fight boards (slices/fight_ground's own pictures, the same camera
and the same 42.92 px a metre, so a picture's ground pixel lands on the board's ground) beside the fight's own man drawn
at the fight's size (MAN_ROWS = 1.8 rows of his ground, slices/BOHEMIA_FIGHT.html rigScale), each board also shown at a
phone's own device pixels at the fight's open zoom; then the thirteen alone at the board's pixels, and three of them at
the map's near stop (14.25 px a metre, COOK TWO's map joins).

REFERENCE CHECK (the 9/4 standing law, compare every piece of art to the world): the world here IS the comparison: the
pieces are laid on the game's own boards as they stand on main (slices/fight_ground/block_ruin_0, block_scrub_0), beside the
game's own man from slices/fight_rig at the size the fight draws him, and shown again at his phone's device pixels and at
the map's near stop; the scale numbers are the fight's own (MAN_ROWS, NEAR_TILE) and the map joins' 57/4. No reference game.
REUSE CHECK (REUSE-FIRST): the boards, the man's sheet and his ruler are read whole from slices/; the pictures are the
models tool's; COOK PROPS' manifest shape is kept key for key; the first picture is cut by RUN TWO's
tools/bohemia_run2_first_picture.py; nothing here draws a pixel of its own but the plate behind the set and the labels.
"""
import os, sys, json, math

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_dead_the_dead_are_everywhere_11_3_26 as D

OUT = D.OUT
PPM, CELL, STOREY = D.PPM, D.CELL, D.STOREY
MAP_PPM = 57 / 4.0          # the map's near stop: the native 57 px a metre reduced 4 to 1 (COOK TWO, the map joins)
MAN_ROWS, TILE_PX = 1.8, (515, 364)
OPEN_TILE_CSS, NEAR_TILE_CSS, DPR = 43.3, 121.0, 3      # a tile on his phone at the fight's open (9 tiles across 390 css px) and at the pinch's near stop

# THE COUNT: how many of each piece a place's board carries. More in the poor blocks and the old camps, fewer where people
# live and bury (there the dead are graves). The floor is what the gate holds a board of that place to.
PLACES = {
    # COMBAT MAPS 3's fifteen places
    'downtown': dict(why='Fremont, the oldest camps: the doorways and the sidewalks', count=dict(doorway=3, sidewalk=2, cart=2, tarp=2, bench=1, coat_fence=1)),
    'wash':     dict(why='the flood channels, the tunnel camps', count=dict(cart=2, tarp=2, bones=1, sidewalk=1)),
    'trailer':  dict(why='the poorest park in the valley', count=dict(tarp=2, sidewalk=1, cart=1, grave_cross=2, car_driver=1, coat_fence=1)),
    'strip':    dict(why='the casinos were the morgues; the tourists never left (where a faction holds a casino, its door is swept: graves only)', count=dict(sidewalk=1, doorway=1, bench=1, bag_row=1)),
    'works':    dict(why='the rail yard\'s camps along the tracks', count=dict(tarp=1, car_driver=1, bones=1, sidewalk=1, coat_fence=1)),
    'pass':     dict(why='the road out: the exodus died in its cars', count=dict(car_driver=2, desert_skeleton=1, bones=1, tarp=1)),
    'landfill': dict(why='where the trucks took them', count=dict(mass_grave=1, tarp=2, cart=1)),
    'lab':      dict(why='the staff who stayed with the animals', count=dict(bag_row=1, tarp=2, sidewalk=1)),
    'airport':  dict(why='the last flights that never came; the terminal was a clinic', count=dict(bag_row=1, car_driver=1, tarp=2)),
    'desert':   dict(why='the ones who walked out', count=dict(desert_skeleton=1, bones=2, grave_cross=1)),
    'shore':    dict(why='the falling lake gives up its dead (it did, in 2022)', count=dict(bones=2, tarp=1, grave_cross=1)),
    'marina':   dict(why='the boats people lived on', count=dict(bones=1, car_driver=1, tarp=1)),
    'redrock':  dict(why='the scenic loop, its cars still parked', count=dict(bones=1, desert_skeleton=1, grave_cross=1)),
    'golf':     dict(why='where they bury: the fairways became the cemetery; graves only', count=dict(grave_row=1, grave_cross=2)),
    'suburbs':  dict(why='where people still live: they buried their own in the yards; graves only, and the coat', count=dict(grave_cross=2, coat_fence=1)),
    # the city's boards (fight_ground block kinds)
    'ruin':     dict(why='a dead street, nobody left to bury', count=dict(tarp=3, sidewalk=2, cart=1, doorway=1, car_driver=1)),
    'main':     dict(why='a town\'s main street: a clinic, a bench', count=dict(doorway=2, sidewalk=1, bench=1, bag_row=1)),
    'corner':   dict(why='a corner shop and its stop', count=dict(doorway=1, sidewalk=1, bench=1, tarp=1)),
    'freeway':  dict(why='the jam that never moved', count=dict(car_driver=3, tarp=1, desert_skeleton=1)),
    'casino':   dict(why='a casino\'s doors and its curb', count=dict(bag_row=1, sidewalk=1, doorway=1)),
    'scrub':    dict(why='the city\'s edge, the overflow', count=dict(bones=2, desert_skeleton=1, grave_cross=1, grave_row=1)),
    'subs':     dict(why='where people live and bury (subs, culdesac, suburb_stem): graves only, and the coat', count=dict(grave_cross=2, coat_fence=1)),
    'lots':     dict(why='a stadium\'s lots and the big aprons: the pit', count=dict(mass_grave=1, grave_row=1, tarp=1)),
}
LIVED_IN = ('RULE 360 AMENDED (Paolo 11/3, lore-friendly): where people live and keep order, NO BODIES: a home base, a settlement '
            'screen\'s own block, a faction town, any board whose future is reclaimed. There the dead are graves only (grave_cross, '
            'grave_row; the pit stays, fenced). The counts above are for the boards nobody holds: the empty blocks, the old camps, '
            'the roads between, the desert, the fallen towns.')
# WHERE A PIECE LIES (the coordinator's note on rule 360 amended, 11/3): the dead lie where nobody is left to move them; one or
# more of the seven kinds of ground per piece. Graves are the living burying their dead, so they alone may also stand where
# people live (graves_where_people_live below); a body never does.
WHERE_KINDS = ('empty_block', 'road', 'desert', 'camp_ruin', 'fallen_town', 'clinic_overrun', 'never_lived_in')
WHERE = {
    'dead.tarp': ['empty_block', 'camp_ruin', 'fallen_town', 'road'], 'dead.doorway': ['empty_block', 'camp_ruin', 'fallen_town'],
    'dead.bag_row': ['clinic_overrun'], 'dead.car_driver': ['road', 'empty_block'], 'dead.desert_skeleton': ['desert', 'road'],
    'dead.bones': ['desert', 'never_lived_in'], 'dead.grave_cross': ['desert', 'fallen_town', 'never_lived_in'],
    'dead.grave_row': ['fallen_town', 'never_lived_in', 'clinic_overrun'], 'dead.sidewalk': ['empty_block', 'fallen_town'],
    'dead.cart': ['camp_ruin', 'empty_block', 'road'], 'dead.mass_grave': ['never_lived_in', 'fallen_town'],
    'dead.coat_fence': ['empty_block', 'fallen_town', 'road'], 'dead.bench': ['empty_block', 'fallen_town']}
LIVED_IN_KINDS = ['a home base', 'a settlement screen\'s own block', 'a faction town', 'a busy, civilized part of town', 'any board on its reclaimed future']
BODIES = ('dead.tarp', 'dead.doorway', 'dead.bag_row', 'dead.car_driver', 'dead.desert_skeleton', 'dead.bones', 'dead.sidewalk', 'dead.cart', 'dead.bench')
FUTURES = ('raided: half again (round up), the bodies uncovered (a tarp becomes a sidewalk body); reclaimed: every body becomes '
           'a grave (grave_cross, or the grave_row where there are three or more), the mass grave stays and is fenced; the game '
           'starts in the ruin and the future gets better (his second votes)')
MAP = ('WORLD on the map: at the near stop (14.25 px a metre) a body is about 26 px long, the bag row 130 px, the trench 400 px. '
       'The pit at each stadium (the big lots) and the landfill, the grave rows on the parks, the golf courses and the school fields, '
       'a clinic\'s bag row at the hospitals; the single bodies on the blocks the counts above name.')


def manifest():
    L = json.load(open(os.path.join(OUT, 'ledger.json')))
    out = dict(about='COOK DEAD 11/3 (rule 360 THE DEAD ARE EVERYWHERE, rule 337): the dead as real models through the master rig, for '
                     'COMBAT MAPS 3 to place on its boards after its roads and WORLD on the map. '
                     'tools/bohemia_cook_dead_the_dead_are_everywhere_11_3_26.py (models), tools/bohemia_cook_dead_card_11_3_26.py (this file, the card)',
               px_per_metre=round(PPM, 3), cell_m=CELL, storey_m=STOREY,
               camera='orthographic, tilted 45 from straight down, facing north, never turned; heights drawn full (x 1/cos45); one sun upper left',
               front='every model faces -Y (south, the camera); turn it on a board in quarters; its origin is its ground centre, metres, z up',
               anchor='anchor_px is the model\'s ground centre (its origin) in its picture, from the top-left pixel',
               role_key=dict(cover='stops a shot, a man stands behind it', blocking='nobody walks through it', none='stands there, the fight walks past it'),
               tile_key={'#': 'blocked (BB impassable)', 'H': 'height (+1 level)', 'r': 'rough (3 AP)', '.': 'flat; the thing is a piece on it'},
               who_key=dict(moved='the living carried, wrapped or laid them', robbed='the living took from them and left them',
                            buried='the living buried them', nobody='nobody has touched them since'),
               holes_key='holes_m: rectangles [cx, cy, half_x, half_y] in the model\'s own metres; the board cuts its ground inside each, the '
                         'model carries the pit\'s walls and floor below z 0 (depth_m)',
               scale_on_his_phone=dict(body_m=1.8, at_open_css_px=round(1.8 * OPEN_TILE_CSS / CELL, 1), at_near_stop_css_px=round(1.8 * NEAR_TILE_CSS / CELL, 1),
                                       the_fights_man_rows=MAN_ROWS,
                                       note='the board is drawn at the world\'s size (a 12 m house a tile) and the fight\'s men at 1.8 rows; a body on the '
                                            'ground is the world\'s size, about a sixth of a tile; the clusters (the bag row, the graves, the pit) carry a place'),
               places=[dict(id=p, why=v['why'], count=v['count'], pieces=sum(v['count'].values()),
                            floor=max(2, int(round(0.7 * sum(v['count'].values()))))) for p, v in PLACES.items()],
               lived_in=LIVED_IN, bodies=list(BODIES), graves=['dead.grave_cross', 'dead.grave_row', 'dead.mass_grave'],
               where_key=dict(empty_block='a block nobody is left on', road='the roads between', desert='the open desert',
                              camp_ruin='an old camp', fallen_town='a town that fell', clinic_overrun='a clinic that could not keep up',
                              never_lived_in='ground nobody ever lived on (a lot, a field, the lake bed)'),
               lived_in_places=dict(kinds=LIVED_IN_KINDS, bodies=0, graves_where_people_live=['dead.grave_cross', 'dead.grave_row'],
                                    about='ZERO bodies where people live and keep order: the living bury their dead'),
               simple='rule 360 amended (b): every piece is scenery, at most what the board already does with a thing on a tile (cover, a blocker); no new system, no interaction (interaction is null on every piece)',
               futures=FUTURES, map=MAP,
               models=[])
    for pid in D.ORDER:
        if pid not in L: continue
        P, l = D.DEAD[pid], L[pid]; sx, sy, sz = l['size_m']
        out['models'].append(dict(
            id=pid, name=P['name'], landmark=P['landmark'], model=l['model'], picture=l['picture'], picture_px=l['picture_px'],
            anchor_px=l['anchor_px'], size_m=l['size_m'], footprint_cells=[max(1, math.ceil(sx / CELL - 0.08)), max(1, math.ceil(sy / CELL - 0.08))],
            fills_cell=round(min(1.0, sx * sy / CELL ** 2), 3), height_m=l['bounds_m'][1][2], height_storeys=round(l['bounds_m'][1][2] / STOREY, 2),
            role=P['role'], sees_through=bool(P['see']),
            fight=dict(kind=P['kind'], tile=P['tile'], blocks_move=P['role'] == 'blocking' or P['tile'] == '#', blocks_sight=bool(P['sight']),
                       see_through=bool(P['see']), burns=False),
            who=P['who'], where=WHERE[pid], interaction=None, what=P['what'], tells=P['tells'], wrong=P['wrong'] or None, flies=bool(P['flies']),
            against=P['against'], verts=l['verts'], glb_kb=l['glb_kb'],
            **({'holes_m': [list(h) for h in P['holes']], 'depth_m': l.get('depth_m', 0.0)} if P['holes'] else {})))
    fn = os.path.join(OUT, 'manifest.json'); json.dump(out, open(fn, 'w'), indent=1)
    print('  manifest:', len(out['models']), 'models,', len(out['places']), 'places ->', os.path.relpath(fn, R))
    return out


# ======================================================================================================================
# THE CARD
# ======================================================================================================================
BOARD_A = ('block_ruin_0', [('dead.doorway', 1400, 600), ('dead.bench', 1090, 748), ('dead.sidewalk', 2060, 760), ('dead.car_driver', 700, 905),
                            ('dead.cart', 950, 1040), ('dead.tarp', 560, 1580), ('dead.bag_row', 1250, 1640), ('dead.coat_fence', 2150, 1560)],
           [('you', 0, 2430, 1010)])
BOARD_B = ('block_scrub_0', [('dead.mass_grave', 1180, 330), ('dead.grave_row', 700, 1020), ('dead.grave_cross', 1500, 1080), ('dead.grave_cross', 1640, 1130),
                             ('dead.bones', 2250, 760), ('dead.desert_skeleton', 1950, 1500), ('dead.tarp', 760, 1560)],
           [('you', 0, 200, 1480)])
CLOSE = (330, 430, 2440, 1150)      # the dead street at 1:1: the card's first picture (show.first)
FIRST = []
SHORT = {'dead.tarp': 'under a tarp', 'dead.doorway': 'in a doorway, in a sleeping bag', 'dead.bag_row': 'body bags at a clinic',
         'dead.car_driver': 'slumped out of his car', 'dead.desert_skeleton': 'bones by a dead car', 'dead.bones': 'bones in the sand',
         'dead.grave_cross': 'a grave, a rebar cross', 'dead.grave_row': 'fresh graves, one dug and empty', 'dead.sidewalk': 'face down, one shoe off',
         'dead.cart': 'in a shopping cart', 'dead.mass_grave': 'the pit', 'dead.coat_fence': 'a coat on a fence', 'dead.bench': 'on a bus bench'}


def _font(px, kind='Casing'):
    from PIL import ImageFont
    for f in (os.path.join(R, 'slices/fonts/Bohemia%s-Regular.ttf' % kind), '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        try: return ImageFont.truetype(f, px)
        except Exception: pass
    return ImageFont.load_default()


def _man(look, facing):
    """the fight's own man, its stand frame, at the fight's size: MAN_ROWS rows of his ground (board pixels)"""
    from PIL import Image
    Rg = json.load(open(os.path.join(R, 'slices/fight_rig/fight_rig.json')))
    Lk = Rg['looks'][look]; sheet = Image.open(os.path.join(R, 'slices/fight_rig', Lk['file'])).convert('RGBA')
    cell = sheet.crop((0, facing * Lk['h'], Lk['w'], (facing + 1) * Lk['h']))
    k = MAN_ROWS * TILE_PX[1] / Rg['ruler']['px']
    big = cell.resize((round(Lk['w'] * k), round(Lk['h'] * k)), Image.NEAREST)
    return big, (Lk['foot'][0] * k, Lk['foot'][1] * k)


def board(spec):
    from PIL import Image
    name, things, men = spec
    L = json.load(open(os.path.join(OUT, 'ledger.json')))
    img = Image.open(os.path.join(R, 'slices/fight_ground', name + '.webp')).convert('RGBA')
    for pid, x, y in sorted(things, key=lambda t: t[2]):
        l = L[pid]; p = Image.open(os.path.join(R, l['picture'])).convert('RGBA')
        img.alpha_composite(p, (int(round(x - l['anchor_px'][0])), int(round(y - l['anchor_px'][1]))))
    for look, facing, x, y in sorted(men, key=lambda t: t[3]):
        m, (fx, fy) = _man(look, facing)
        img.alpha_composite(m, (int(round(x - fx)), int(round(y - fy))))
    return img


def card():
    from PIL import Image, ImageDraw
    L = json.load(open(os.path.join(OUT, 'ledger.json')))
    BG, INK, DIM, PLATE = (20, 19, 19, 255), (214, 204, 167), (150, 140, 120), (126, 116, 102, 255)
    A, Bd = board(BOARD_A), board(BOARD_B)
    k = 0.56
    a_s = A.resize((round(A.size[0] * k), round(A.size[1] * k)), Image.LANCZOS)
    b_s = Bd.resize((round(Bd.size[0] * k), round(Bd.size[1] * k)), Image.LANCZOS)
    ph = OPEN_TILE_CSS * DPR / TILE_PX[0]                                   # the board at his phone's device pixels, at the fight's open
    a_p = A.resize((round(A.size[0] * ph), round(A.size[1] * ph)), Image.LANCZOS)
    b_p = Bd.resize((round(Bd.size[0] * ph), round(Bd.size[1] * ph)), Image.LANCZOS)
    pad, gut = 28, 24
    right_w = max(a_p.size[0], b_p.size[0])
    W = pad * 2 + a_s.size[0] + gut + right_w
    up = 1.5                                                                # the set at half again the board's pixels
    pics = [(pid, Image.open(os.path.join(R, L[pid]['picture'])).convert('RGBA')) for pid in [p for p in D.ORDER if p != 'dead.mass_grave'] + ['dead.mass_grave']]
    pics = [(pid, p.resize((round(p.size[0] * up), round(p.size[1] * up)), Image.LANCZOS)) for pid, p in pics]
    rows, row, x = [], [], 0
    for pid, p in pics:
        if x + p.size[0] > W - 2 * pad - 40 and row: rows.append(row); row, x = [], 0
        row.append((pid, p)); x += p.size[0] + 30
    rows.append(row)
    set_h = sum(max(p.size[1] for _, p in r) + 70 for r in rows)
    mapk = MAP_PPM / PPM
    maps = [(pid, Image.open(os.path.join(R, L[pid]['picture'])).convert('RGBA')) for pid in ('dead.mass_grave', 'dead.grave_row', 'dead.bag_row', 'dead.sidewalk')]
    maps = [(pid, p.resize((max(1, round(p.size[0] * mapk)), max(1, round(p.size[1] * mapk))), Image.LANCZOS)) for pid, p in maps]
    map_h = max(p.size[1] for _, p in maps) + 40
    close = A.crop(CLOSE)
    H = pad + 44 + close.size[1] + gut + 44 + a_s.size[1] + gut + 44 + b_s.size[1] + gut + 44 + set_h + 30 + 44 + map_h + pad
    C = Image.new('RGBA', (W, H), BG); d = ImageDraw.Draw(C)
    f1, f2, f3, f4 = _font(30), _font(22), _font(18, 'Body'), _font(26)
    y = pad
    d.text((pad, y), 'CLOSE, AT THE BOARD\'S OWN PIXELS: A BENCH, A DOORWAY, A CAR, A CART, THE SIDEWALK, AND THE FIGHT\'S MAN\'S FEET', font=f1, fill=INK); y += 44
    C.alpha_composite(close, (pad, y)); FIRST[:] = [pad, y, close.size[0], close.size[1]]; y += close.size[1] + gut
    d.text((pad, y), 'THE WHOLE BOARD: A DEAD STREET, BESIDE THE FIGHT\'S OWN MAN', font=f1, fill=INK)
    d.text((pad + a_s.size[0] + gut, y + 6), 'ON HIS PHONE, THE FIGHT\'S OPEN ZOOM', font=f2, fill=INK); y += 44
    C.alpha_composite(a_s, (pad, y)); C.alpha_composite(a_p, (pad + a_s.size[0] + gut, y))
    tx, ty = pad + a_s.size[0] + gut, y + a_p.size[1] + 10
    for line in ('one pixel here is one pixel of his screen', 'a body lying down: %d px; the man: %d px tall' % (round(1.8 * OPEN_TILE_CSS / CELL * DPR), round(MAN_ROWS * OPEN_TILE_CSS * TILE_PX[1] / TILE_PX[0] * DPR)),
                 'pinched in to the near stop: a body %d px' % round(1.8 * NEAR_TILE_CSS / CELL * DPR), '', 'the board is the world\'s size (a house a tile);',
                 'the fight draws its men 1.8 rows tall;', 'the dead lie at the world\'s size, like its cars'):
        d.text((tx, ty), line, font=f3, fill=DIM); ty += 24
    y += a_s.size[1] + gut
    d.text((pad, y), 'THE CITY\'S EDGE: THE PIT, THE GRAVES, THE ONES WHO WALKED OUT', font=f1, fill=INK); y += 44
    C.alpha_composite(b_s, (pad, y)); C.alpha_composite(b_p, (pad + a_s.size[0] + gut, y))
    y += b_s.size[1] + gut
    d.text((pad, y), 'THE THIRTEEN, ALONE (HALF AGAIN THE BOARD\'S PIXELS)', font=f1, fill=INK); y += 44
    d.rectangle((pad - 8, y - 8, W - pad + 8, y + set_h - 8), fill=PLATE)
    n = 1
    for r in rows:
        x = pad; hmax = max(p.size[1] for _, p in r)
        for pid, p in r:
            C.alpha_composite(p, (x, y + hmax - p.size[1]))
            lab = '%d %s' % (D.ORDER.index(pid) + 1, SHORT[pid])
            d.text((x, y + hmax + 8), lab, font=f3, fill=(36, 33, 30))
            d.text((x, y + hmax + 32), D.DEAD[pid]['who'], font=f3, fill=(70, 60, 50))
            x += max(p.size[0], int(d.textlength(lab, font=f3))) + 30; n += 1
        y += hmax + 70
    y += 30
    d.text((pad, y), 'ON THE MAP\'S NEAR STOP (14 PX A METRE): THE PIT, THE GRAVE ROW, THE BAG ROW, ONE BODY', font=f1, fill=INK); y += 44
    x = pad; hmax = max(p.size[1] for _, p in maps)
    d.rectangle((pad - 8, y - 8, pad + sum(p.size[0] + 40 for _, p in maps), y + hmax + 8), fill=PLATE)
    for pid, p in maps:
        C.alpha_composite(p, (x, y + hmax - p.size[1])); x += p.size[0] + 40
    fn = os.path.join(OUT, 'CARD_THE_DEAD.webp')
    C.convert('RGB').save(fn, quality=86, method=6)
    print('  card', C.size, '->', os.path.relpath(fn, R), ' first (the close street):', FIRST)
    return fn


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'manifest': manifest()
    elif a[0] == 'card': card()
