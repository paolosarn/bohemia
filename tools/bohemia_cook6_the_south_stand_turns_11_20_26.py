"""COOK SIX (COOK FIVE's list, VAMILY rule 461): THE SOUTH STAND TURNS (11/20/26).

COMBAT FOUR's BUILD 11/20k, 'FOR COOK 1)': the stadium's south stand wore the north stand's seats picture, so its seats faced
SOUTH, away from the field. COMBAT FOUR gave its row its own letter and piece, st_seats_n ('like' st_seats until painted). This is
that picture: the same block of eleven rows of 23 fold-up seats, FACING NORTH to the field, so from the map's eye (the camera is
south of everything) you see THE BACKS of the seats, the way you see a stand from the row behind it. The same picture's size and
foot as st_seats (515 x 339, foot [257.5, 328]), so it lays where the old one laid.

ON this lane's stadium tool (and COOK FIVE's chain under it):
  python3 tools/bohemia_cook6_the_south_stand_turns_11_20_26.py render sn_pieces      (Blender: only the seats, turned)
  python3 tools/bohemia_cook6_the_south_stand_turns_11_20_26.py cut                   (st_seats_n.webp on st_seats' canvas; the kit entry)
"""
import json, os, sys
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook6_the_stadium_finished_11_20_26 as SD       # this lane's stadium tool (and TG, the master rig, through it)

TG = SD.TG; ROW_P = SD.ROW_P; SHIP = SD.SHIP


def seat_n(P, x, y, z, how, rng, m='seat'):
    """a fold-up bucket seat FACING NORTH (the field is north of the south stand): its back on the south side, so the map's eye sees
    the back; 'up' folded against the back as empty seats fold, 'down', or 'gone' (its bracket)"""
    P.box('steel', x - 0.03, x + 0.03, y + 0.02, y + 0.36, z, z + 0.42)                                  # the bracket
    if how == 'gone': return
    P.box(m, x - 0.22, x + 0.22, y + 0.0, y + 0.06, z + 0.4, z + 0.86)                                    # the back, toward the camera
    if how == 'up': P.box(m, x - 0.2, x + 0.2, y + 0.07, y + 0.13, z + 0.36, z + 0.78)                    # the pan, folded up behind it
    else: P.box(m, x - 0.21, x + 0.21, y + 0.06, y + 0.38, z + 0.4, z + 0.46)


def seats_n(P, ox, oy, rng):
    """the south stand's seats, a tile wide: eleven rows of 23, turned to the field. What the row behind sees: the backs, some torn
    out to their brackets, a coat left over one, a cardboard sign taped to another, bedding across four with the shoes under them"""
    for k in range(11):
        y = oy + k * ROW_P; beds = [] if rng.rand() < 0.55 else [int(rng.randint(2, 18))]
        for i in range(23):
            x = ox - 5.98 + 0.3 + i * 0.52; r_ = rng.rand()
            bed = any(b <= i < b + 4 for b in beds)
            how = 'down' if bed else ('gone' if r_ < 0.14 else ('down' if r_ < 0.24 else 'up'))
            seat_n(P, x, y, 0.0, how, rng, 'seat_g' if rng.rand() < 0.08 else 'seat')
            if how != 'gone' and not bed:
                q = rng.rand()
                if q < 0.035:                                    # a coat left over the back
                    P.box(('cloth', 'tan', 'blue')[rng.randint(3)], x - 0.24, x + 0.24, y - 0.05, y + 0.08, 0.6, 0.9)
                elif q < 0.05:                                   # a cardboard sign taped on it, its words in black marker
                    P.box('card', x - 0.17, x + 0.17, y - 0.012, y + 0.0, 0.5, 0.78); P.box('paint_k', x - 0.12, x + 0.12, y - 0.016, y - 0.012, 0.6, 0.66)
        for b in beds:                                          # bedding across four seats: a blanket, a pillow, the shoes under them
            x0 = ox - 5.98 + 0.3 + b * 0.52 - 0.22
            c_ = ('rug', 'blue', 'tan', 'cloth')[rng.randint(4)]
            P.box(c_, x0, x0 + 2.0, y + 0.0, y + 0.42, 0.46, 0.53); P.box('white', x0 + 1.5, x0 + 1.9, y + 0.06, y + 0.36, 0.53, 0.6)
            P.box(c_, x0 + 0.1, x0 + 1.3, y - 0.035, y + 0.065, 0.5, 0.9)   # the top blanket thrown over the backs, where the row behind sees it
            for s_ in range(2): P.box('black', x0 + 0.9 + s_ * 0.14, x0 + 1.0 + s_ * 0.14, y + 0.45, y + 0.7, 0.0, 0.09)
    for _ in range(10): x = ox + rng.uniform(-5.6, 5.6); y = oy + rng.uniform(0.0, 9.0); P.drum(('jug', 'paper', 'can')[rng.randint(3)], x, y, 0.0, 0.12, 0.045, 8)


def sn_parts(P, rng):
    seats_n(P, *SD.ST_AT['seats'], rng)


def stand_n(P, ox, oy, rng):
    """(11/21, COMBAT FOUR's st_stand_n) the SOUTH stand's step, turned to face the field (north): the north stand's own step (the
    stadium tool's stand) mirrored north to south. Its treads' nosings on their north edges (the edge you step down toward the field),
    the brackets where seats were torn out in the seats' own rows, its padding and dead ribbon board on the field's side (north, so the
    map's eye sees only their top), the cups and a blanket on the front walk along the field; toward the camera the stand's back: cast
    concrete, a drain's stain down it, the section's number painted, a door into the concourse chained"""
    LH = SD.LEVEL_H
    P.box('conc', ox - 6, ox + 6, oy, oy + 12, 0.0, LH - 0.02); P.box('st_tread', ox - 6, ox + 6, oy, oy + 12, LH - 0.02, LH)
    for k in range(14):                                         # the treads' nosings, mirrored (the same on every tile's edge)
        y = oy + (k + 1) * ROW_P
        P.box('under', ox - 6, ox + 6, y, y + 0.05, LH, LH + 0.004); P.box('st_nose', ox - 6, ox + 6, y - 0.06, y, LH, LH + 0.01)
    SD.deck_rows(P, ox, oy + SD.SEAT_Y0, rng, seat_n)            # (11/21) a run or two of seats nobody unbolted, the brackets of the rest
    P.box('ribbon', ox - 6, ox + 6, oy + 12, oy + 12.04, LH - 0.66, LH - 0.08); P.box('pad', ox - 6, ox + 6, oy + 12, oy + 12.03, 0.0, LH - 0.7)   # on the field's side
    P.box('conc', ox - 6, ox + 6, oy - 0.03, oy, 0.0, LH - 0.02)                                       # its back, toward the camera
    P.box('stain', ox + 2.3, ox + 2.8, oy - 0.034, oy - 0.03, 0.0, LH - 0.1)                            # where a drain ran down it
    for dx in (-0.9, -0.3, 0.3): P.box('white', ox + dx, ox + dx + 0.34, oy - 0.036, oy - 0.03, 0.55, 1.05)   # the section's number
    P.box('steel', ox - 4.4, ox - 3.4, oy - 0.05, oy - 0.03, 0.0, 1.3); P.bar('chrome', (ox - 4.3, oy - 0.07, 0.7), (ox - 3.5, oy - 0.07, 0.75), 0.02)   # a door, chained
    P.box('rug', ox + 1.6, ox + 3.4, oy + 10.5, oy + 11.6, LH, LH + 0.05); P.box('white', ox + 2.9, ox + 3.3, oy + 11.1, oy + 11.5, LH + 0.05, LH + 0.12)   # a blanket on the front walk
    for _ in range(12): x = ox + rng.uniform(-5.6, 5.6); y = oy + rng.uniform(9.9, 11.7); P.drum(('jug', 'paper', 'can')[rng.randint(3)], x, y, LH, LH + 0.12, 0.045, 8)


def st_n_parts(P, rng):
    stand_n(P, *SD.ST_AT['stand'], rng)


def sn_mats(bpy, NF, F, M, which):
    if which in ('sn_pieces', 'sn_stand'): SD.st_mats(bpy, NF, F, M, 'st_pieces')    # the stadium's own materials, the same seat black


TG.PARTS['sn_pieces'] = sn_parts
TG.PARTS['sn_stand'] = st_n_parts
TG.MAT_HOOKS.append(sn_mats)


def cut_stand():
    """st_stand_n.webp: cut as st_stand was cut, laid on st_stand's own canvas (the same size and foot)"""
    im = Image.open(os.path.join(SD.REND, 'sn_stand.png')).convert('RGBA'); x, y = SD.ST_AT['stand']; hh = SD.LEVEL_H * SD.PPM / SD.PYM
    v = TG.cut_piece(im, (x, y), (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 12.0 + hh + 0.6), 'st_stand_n', 'stadium', 1.0)
    p = os.path.join(SHIP, 'stadium_art.json'); art = json.load(open(p)); old = art['kit']['st_stand']
    fn = os.path.join(SHIP, 'st_stand_n.webp'); q = Image.open(fn).convert('RGBA')
    o = Image.new('RGBA', (old['w'], old['h_px']), (0, 0, 0, 0))
    dx = int(round(old['foot'][0] - v['foot'][0])); dy = int(round(old['foot'][1] - v['foot'][1]))
    o.alpha_composite(q.crop((max(0, -dx), max(0, -dy), q.width, q.height)), (max(0, dx), max(0, dy)))
    o.save(fn, 'WEBP', quality=76, method=6)   # (76: the stadium's folder went over its budget at 86)
    e = dict(old); e.update(src='stadium/st_stand_n.webp', name='THE STANDS, THE SOUTH STAND',
                            why="COMBAT FOUR's st_stand_n (BUILD 11/20w): the south stand's step turned to face the field, its padding and ribbon board on the field's side, its back toward the map's eye; st_stand's size and foot")
    art['kit']['st_stand_n'] = e
    json.dump(art, open(p, 'w'), indent=1)
    sp = os.path.join(SHIP, 'sizes.json'); sz = json.load(open(sp))
    sz['stand_n'] = dict(w=o.width, h=o.height, foot=list(old['foot']), piece='stand_n', src='stadium/st_stand_n.webp', facing='N')
    json.dump(sz, open(sp, 'w'), indent=1)
    print('st_stand_n', o.size, 'foot', old['foot'], 'shift', (dx, dy), os.path.getsize(fn), 'bytes')


def cut():
    """st_seats_n.webp: cut as st_seats was cut, then laid on st_seats' own canvas so the size and the foot are the same"""
    im = Image.open(os.path.join(SD.REND, 'sn_pieces.png')).convert('RGBA'); x, y = SD.ST_AT['seats']
    v = TG.cut_piece(im, (x, y), (x - 6.0, x + 6.0 + 0.01, y - 0.4, y + 9.4 + 0.95 * 1.45), 'st_seats_n', 'stadium', 1.0)
    p = os.path.join(SHIP, 'stadium_art.json'); art = json.load(open(p)); old = art['kit']['st_seats']
    fn = os.path.join(SHIP, 'st_seats_n.webp'); q = Image.open(fn).convert('RGBA')
    o = Image.new('RGBA', (old['w'], old['h_px']), (0, 0, 0, 0))
    dx = int(round(old['foot'][0] - v['foot'][0])); dy = int(round(old['foot'][1] - v['foot'][1]))
    o.alpha_composite(q.crop((max(0, -dx), max(0, -dy), q.width, q.height)), (max(0, dx), max(0, dy)))
    o.save(fn, 'WEBP', quality=76, method=6)   # (76: the stadium's folder went over its budget at 86)
    e = dict(old); e.update(src='stadium/st_seats_n.webp', name="THE STANDS' SEATS, THE SOUTH STAND",
                            why="COMBAT FOUR's st_seats_n (BUILD 11/20k): the south stand's seats facing NORTH to the field, so the map's eye sees their backs; st_seats' size and foot")
    art['kit']['st_seats_n'] = e
    json.dump(art, open(p, 'w'), indent=1)
    sp = os.path.join(SHIP, 'sizes.json'); sz = json.load(open(sp))
    sz['seats_n'] = dict(w=o.width, h=o.height, foot=list(old['foot']), piece='seats_n', src='stadium/st_seats_n.webp', facing='N')
    json.dump(sz, open(sp, 'w'), indent=1)
    print('st_seats_n', o.size, 'foot', old['foot'], 'shift', (dx, dy), os.path.getsize(fn), 'bytes')


def sheet(before_dir, page_dir):
    """records/target/COOK6_THE_SOUTH_STAND_11_20.webp: the south stand close in on the fight page (tools/bohemia_a_big_inside_on_
    the_page_11_17_26.js, its 'south_stand' spot), before (the north stand's picture, facing away) and now, upright; now on its side;
    then the two pictures at their own pixels"""
    from PIL import ImageDraw, ImageFont
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub):
        im = Image.new('RGB', (WID, 64), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK); d.text((10, 38), sub, font=font(14), fill=DIM); rows.append(im)
    def strip(items, hgt):
        ims = [(lab, n.convert('RGB')) for lab, n in items]; ims = [(lab, n.resize((max(1, int(n.width * hgt / n.height)), hgt), Image.LANCZOS)) for lab, n in ims]
        r = Image.new('RGB', (WID, hgt + 26), BG); d = ImageDraw.Draw(r); x = 0; at = []
        for lab, n in ims: d.text((x + 4, 4), lab, font=font(14), fill=INK); r.paste(n, (x, 26)); at.append([x, 26, n.width, n.height]); x += n.width + 10
        rows.append(r); return at
    up = lambda fn: (lambda n: n.crop((0, 420, n.width, 1180)))(Image.open(fn))
    title('THE SOUTH STAND TURNS TO THE FIELD', "on his phone, close in on the stadium's south stand: before its seats faced away from the field; now you see their backs")
    at = strip((('BEFORE: THE SEATS FACE AWAY', up(os.path.join(before_dir, 'stadium_upright_south_stand_close.png'))),
                ('NOW: THEIR BACKS, AS FROM THE ROW BEHIND', up(os.path.join(page_dir, 'stadium_upright_south_stand_close.png')))), 560)
    first_row = len(rows) - 1; first = at[1]
    sd = Image.open(os.path.join(page_dir, 'stadium_sideways_south_stand_close.png')); sd = sd.crop((0, 120, sd.width, 500))
    title('NOW, THE PHONE ON ITS SIDE', 'the same stand: the backs of eleven rows of seats, a blanket thrown over four, a coat left on one, a cardboard sign taped to another')
    strip((('ON ITS SIDE', sd),), 300)
    def piece(k):
        im = Image.open(os.path.join(SHIP, k + '.webp')).convert('RGBA'); o = Image.new('RGBA', im.size, (150, 146, 132, 255)); o.alpha_composite(im); return o
    title('THE TWO PICTURES AT THEIR OWN PIXELS', "the north stand's seats (facing the field, south) and the south stand's (facing the field, north)")
    strip((("THE NORTH STAND'S", piece('st_seats')), ("THE SOUTH STAND'S", piece('st_seats_n'))), 370)
    out = Image.new('RGB', (WID, sum(r.height for r in rows) + 6 * len(rows)), BG); y = 0; first_at = None
    for i, r in enumerate(rows):
        if i == first_row: first_at = [first[0], y + first[1], first[2], first[3]]
        out.paste(r, (0, y)); y += r.height + 6
    fn = os.path.join(R, 'records/target/COOK6_THE_SOUTH_STAND_11_20.webp'); out.save(fn, 'WEBP', quality=76, method=6)
    x, y0, w, h = first_at; fst = out.crop((x, y0, x + w, y0 + h)); f2 = os.path.join(R, 'records/target/vote_first/cook6-the-south-stand-11-20.webp'); fst.save(f2, 'WEBP', quality=78, method=6)
    print('sheet', out.size, os.path.getsize(fn), 'first', fst.size, os.path.getsize(f2), 'firstAt', first_at)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for n in [x for x in a[1:] if not x.startswith('--')]: print('  rendered', n, TG.scene_pieces(n, '--quick' in a), flush=True)
    elif a and a[0] == 'cut': cut()
    elif a and a[0] == 'cut_stand': cut_stand()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
