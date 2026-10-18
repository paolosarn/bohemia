#!/usr/bin/env python3
"""THE FIVE HOUSES ON THE BOARD  (COMBAT TWO, [the houses on the board] round two, 10/18)

Round one (10/16, tools/bohemia_combat2_three_boards_from_the_whole_bank_cook_10_16_26.py) laid three suburb fight boards
from the whole bank with ONE house, COOK FOUR's measured ranch, flipped. Its NEXT line: 're-lay the round COOK FOUR's
kinds land'. They landed: the straight-roof family (five kinds, 10/17) and, from his own vote on it ('color these roofs
to make it more tan, they're looking bright medieval orange and metal blue'), the same five in the valley's tans (10/18,
reference/art_bank/settlement/COOK4_RANCH_TAN_*.png). This round lays THOSE, and fixes two of round one's WEAK lines:

  1. FIVE KINDS, NEVER ONE HOUSE COPIED: plain, garage, carport, wing, porch, dealt per lot by the seed, no kind twice
     in a row along a street, each flipped left-right or not. The tan files only (his newest word on the family).
  2. EVERY HOUSE'S OWN DOOR AND DRIVE: the door path runs to that kind's door, the drive to its garage or carport
     (measured from COOK FOUR's own code: tools/bohemia_cook4_the_straight_roof_family.py returns the door and the wall
     foot of each kind; the garage's and the carport's middles come from the same numbers); the plain, wing and porch
     ranches have no drive (a Vegas ranch without a garage parks on the street).
  3. THE CARPORT HOLDS A CAR: COOK FOUR's 'NOT DONE: the carport is empty'. His pack car at x2 is 3.4 m, the carport
     3.6 m: it fits under the roof on most carport lots.
  4. ONE YARD PER BLOCK: round one gave every lot its own soil tile, so the yards changed colour at every lot line
     (WEAK, round one). Now a block (the lots between two north-south streets on one house row) shares one of his soil
     tiles, the way a subdivision was graded in one pass; the next block may differ.

NOTHING HERE IS DRAWN (rule 108); every piece is round one's (COOK TWO's cells, his pack tiles) or COOK FOUR's file at 1:1.
CANDIDATES ONLY (rule 100): reference/, records/target and the VOTE registry; nothing to slices/, engine/ or the demo.
Rule 115(b): the ground and, until DIRECTION rules, the buildings stay on the packs; these boards are that.

THE ANALOG HORROR LINE (rule 20): round one's three calm wrong things stand (the clean police car, the ring of barrels,
the same dead tree); and one more, placement only (nothing is redrawn): on the large board the first carport holds
the SAME clean police car as the small board's driveway, parked straight, as if it followed you.

REFERENCE CHECK (the 9/4 standing law): compared to COOK FOUR's family sheet (records/target/COOK4_THE_STRAIGHT_ROOF_
FAMILY.png) and its tan twin, his pack house #30 and the 112-px man at 1:1, round one's small board at the same crop.
structure taken: COOK FOUR's five massings at 1:1, his doors; what changed: only where they stand.

[bb the battle map] Battle Brothers' village fights mix house footprints (long houses, huts, sheds) on one field so a
line has to bend around them; one footprint copied reads as a grid. OURS: five footprints from 658 to 1,294 px wide in
a 1,312-px lot, so the gaps between houses (the lanes a man walks) run 196 to 567 px (3.4 to 9.9 m), street by street.

    python3 tools/bohemia_combat2_the_five_houses_on_the_board_cook_10_18_26.py        (about 3 minutes)
  Seeded end to end. The small board is committed; the middle and large regenerate bit for bit (.gitignore there).
"""
import json, os, sys, time
import numpy as np
from PIL import Image, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
os.chdir(R)
import bohemia_combat2_three_boards_from_the_whole_bank_cook_10_16_26 as R1   # round one: ground, props, plan, dress

TW, TH, CELLS, TPX, TPY = R1.TW, R1.TH, R1.CELLS, R1.TPX, R1.TPY
OUT = R1.OUT
SET = 'reference/art_bank/settlement/COOK4_RANCH_TAN_%s.png'
# per kind, measured from COOK FOUR's own code (the kind's function returns the door's left x and the wall foot row;
# the door is 56 to 64 px wide, so its middle is +30): door middle, wall foot, the drive's middle (None = no drive),
# the drive's width in cells (a 6 m garage = 4 cells, a 3.6 m carport = 3)
KINDS = {
    'plain':   dict(door=432, foot=399, drive=None, dw=0),
    'garage':  dict(door=375, foot=399, drive=1065, dw=4),
    'carport': dict(door=165, foot=399, drive=722, dw=3),
    'wing':    dict(door=173, foot=399, drive=None, dw=0),
    'porch':   dict(door=326, foot=399, drive=None, dw=0),
}
ORDER = list(KINDS)
POLICE = 19                     # round one's clean police car, his '9. Abandoned cards' #19

IMG = {}
def house_img(kind, flip):
    k = (kind, flip)
    if k not in IMG:
        im = Image.open(SET % kind.upper()).convert('RGBA')
        IMG[k] = im.transpose(Image.FLIP_LEFT_RIGHT) if flip else im
    return IMG[k]

def x_in(kind, flip, x):
    """a measured x of the unflipped house, in the (maybe flipped) image"""
    w = house_img(kind, False).width
    return w - x if flip else x

def plan(size, seed):
    """round one's plan, then: a kind per lot, one yard per block, and the drives and door paths re-laid per kind"""
    P = R1.plan(size, seed)
    rng = np.random.RandomState(seed + 5)
    cls, H, T, C = P['cls'], P['H'], P['T'], P['C']
    cls[cls == R1.DRIVE] = R1.YARD                           # round one's drives were for the one house; re-laid below
    # one yard family per block (lots on one house row between the same two north-south streets)
    cuts = [-1] + P['ns'] + [C]
    block_fam = {}
    for L in P['lots']:
        b = (L['r'], next(i for i in range(len(cuts) - 1) if cuts[i] < L['c'] < cuts[i + 1]))
        if b not in block_fam:
            block_fam[b] = R1.YARD_FAMS[rng.choice(len(R1.YARD_FAMS), p=np.array(R1.YARD_W) / sum(R1.YARD_W))]
        L['fam'] = block_fam[b]; L['block'] = b
    fam_of = {}
    for L in P['lots']:
        w = 1 if L.get('narrow') else 2
        for dr in (-1, 0, 1):
            for dc in range(w):
                rr, cc = L['r'] + dr, L['c'] + dc
                if 0 <= rr < T and 0 <= cc < C and P['role'][rr, cc] != 'street': fam_of[(rr, cc)] = L['fam']
    P['fam_of'] = fam_of
    # a kind per lot, never the same kind twice running along a street
    last = None
    for L in P['lots']:
        if L['vacant']: last = None; continue
        pick = [k for k in ORDER if k != last]
        L['kind'] = pick[rng.randint(len(pick))]; last = L['kind']
        im = house_img(L['kind'], L['flip'])
        L['ox'] = L['c'] * TPX + (2 * TPX - im.width) // 2  # the house centred on its two-tile lot
    # drives and door paths, per kind
    for L in P['lots']:
        if L['vacant']: continue
        fy = (L['r'] + 1) * CELLS
        if fy >= H: continue
        K = KINDS[L['kind']]
        lot0, lot1 = L['c'] * CELLS, (L['c'] + 2) * CELLS
        if K['drive'] is not None:
            gx = L['ox'] + x_in(L['kind'], L['flip'], K['drive'])
            c0 = int(round(gx / TW - K['dw'] / 2))
            for cc in range(max(lot0, c0), min(lot1, c0 + K['dw'])):
                for rr in range(fy, min(H, fy + CELLS)):
                    if cls[rr, cc] == R1.YARD: cls[rr, cc] = R1.DRIVE
            L['drive_cells'] = (max(lot0, c0), min(lot1, c0 + K['dw']))
        cc = int((L['ox'] + x_in(L['kind'], L['flip'], K['door'])) // TW)
        for rr in range(fy, min(H, fy + CELLS)):
            if lot0 <= cc < lot1 and cls[rr, cc] == R1.YARD: cls[rr, cc] = R1.DRIVE
    return P

def house_at(self, L):
    """COOK FOUR's kind on its lot, the wall foot ten px inside the bottom of the house tile row (round one's rule)"""
    K = KINDS[L['kind']]; im = house_img(L['kind'], L['flip'])
    foot = (L['r'] + 1) * TPY - 10
    sort_foot = foot + (im.height - 445 if L['kind'] == 'wing' else 0)   # the wing stands 3 m forward of the wall
    self.items.append((sort_foot, L['ox'], foot - K['foot'], im, 'house'))

R1.Props.house_at = house_at

def carports(P, PR, size):
    """the car under every carport (COOK FOUR's 'the carport is empty'): his pack car at x2 (3.4 m) in a 3.6 m carport,
    standing just in front of the wall foot; the large board's first carport holds the clean police car (the line)"""
    n = 0; police = size == 'large'
    for L in P['lots']:
        if L['vacant'] or L.get('kind') != 'carport': continue
        if not police and PR.rng.rand() < 0.2: continue                 # one in five is empty: the car is gone
        cx = L['ox'] + x_in('carport', L['flip'], KINDS['carport']['drive'])
        foot = (L['r'] + 1) * TPY + 6
        PR.put('car', R1.CARS, cx, foot, idx=POLICE if police else None, flip=L['flip'])
        police = False; n += 1
    return n

def terrain(P):
    """round one's per-tile terrain; the wing's forward room also blocks the front-yard tile it stands on"""
    t = R1.terrain(P, None)
    for L in P['lots']:
        if L['vacant'] or L.get('kind') != 'wing' or L['r'] + 1 >= P['T']: continue
        im = house_img('wing', L['flip']); wx = L['ox'] + im.width // 2
        t[L['r'] + 1][int(wx // TPX)] = 'part blocked (the wing, 1.9 m into the yard)'
    return t

def main():
    t0 = time.time()
    boards, facts = {}, {}
    G = R1.Ground(1016)
    for size in ('small', 'middle', 'large'):
        seed = {'small': 101, 'middle': 202, 'large': 303}[size]
        P = plan(size, seed)
        img = R1.lay_ground(P, G, seed)
        PR = R1.Props(P, seed)
        R1.dress(P, G, img, PR, size, seed)
        n_cp = carports(P, PR, size)
        board = R1.composite(img, PR)
        boards[size] = board
        houses = [L for L in P['lots'] if not L['vacant']]
        kinds = {k: sum(1 for L in houses if L['kind'] == k) for k in ORDER}
        gaps = []
        for a, b in zip(houses, houses[1:]):
            if a['r'] == b['r'] and a.get('block') == b.get('block'):
                gaps.append(b['ox'] - (a['ox'] + house_img(a['kind'], a['flip']).width))
        facts[size] = dict(tiles_across=P['C'], tiles_down=P['T'], px=[board.width, board.height], lots=len(P['lots']),
                           houses=len(houses), vacant=len(P['lots']) - len(houses), kinds=kinds,
                           cars_in_carports=n_cp, gaps_between_houses_px=[min(gaps), max(gaps)] if gaps else None,
                           yard_blocks=len({L['block'] for L in P['lots']}),
                           props=len(PR.items) - len(houses), cover=PR.cover, lights=PR.lights, terrain=terrain(P),
                           lots_detail=[dict(r=L['r'], c=L['c'], kind=L.get('kind'), flip=L['flip'], vacant=L['vacant'],
                                             yard=list(L['fam'][0:1]) + [L['fam'][1][0]]) for L in P['lots']],
                           first_house=[houses[0]['r'], houses[0]['c']],
                           colours_per_96px=R1.density(np.asarray(board)), elapsed_s=round(time.time() - t0, 1))
        board.save(os.path.join(OUT, 'COMBAT2_FIVE_HOUSES_%s_10_18.webp' % size.upper()), quality=84, method=4)
        print(size, board.size, kinds, 'carport cars', n_cp, 'gaps', facts[size]['gaps_between_houses_px'],
              'density', facts[size]['colours_per_96px'], round(time.time() - t0), 's', flush=True)
    keys = sorted(R1.USED.items(), key=lambda kv: (-kv[1], kv[0]))
    man = dict(lane='combat 2', row='[the houses on the board] round two',
               rule='100 candidates only; 108 nothing drawn; 115b the ground and the buildings stay on the packs',
               ruler='57 px a metre; a cell 82 x 81 px = 1.44 m; a house tile 656 x 648 px = 11.5 m',
               houses={k: dict(src=SET % k.upper(), **v) for k, v in KINDS.items()},
               pieces={('COMBAT2_FIVE_HOUSES_%s_10_18' % s.upper()): dict(src='COMBAT2_FIVE_HOUSES_%s_10_18.webp' % s.upper(),
                        keys=[{'pack': k[0], 'idx': k[1]} for k, n in keys]) for s in boards},
               keys_used=[[k[0], k[1], n, 'UP' if R1.up(*k) else 'never judged'] for k, n in keys],
               boards=facts)
    json.dump(man, open(os.path.join(OUT, 'COMBAT2_FIVE_HOUSES_10_18.json'), 'w'), indent=1)
    sheet(boards, facts)
    print('keys', len(keys), 'total', round(time.time() - t0), 's')

def sheet(boards, facts):
    """one sheet (rules 82, 89): the boards whole, the SAME CROP before (round one, one house) and after (five kinds) at
    1:1, two more 1:1 cuts, and the twin: COOK FOUR's five tan houses as made, his pack house and the man at 1:1"""
    Wd = 2400; pad = 24; F = R1.font(30); f = R1.font(24)
    rows = []
    def label(t, big=False): rows.append(('text', t, big))
    label('COMBAT TWO, ROUND TWO: THE SAME THREE FIGHT BOARDS, NOW WITH ALL FIVE OF COOK FOUR\'S HOUSES IN YOUR TANS, A CAR IN THE CARPORTS, ONE YARD PER BLOCK. CANDIDATES, NOT IN THE GAME.', True)
    label('Top: the whole large board, shrunk. Then the same spot BEFORE (round one: one house copied) and AFTER at 1:1, one art pixel to one phone pixel, the phone\'s width.')
    big = boards['large']; sc = (Wd - 2 * pad) / big.width
    rows.append(('img', big.resize((int(big.width * sc), int(big.height * sc)), Image.LANCZOS),
                 'LARGE 20 x 15 house tiles, shrunk to %d%%: %s' % (round(sc * 100), ', '.join('%d %s' % (n, k) for k, n in facts['large']['kinds'].items()))))
    sm, md = boards['small'], boards['middle']; sc2 = (Wd - 3 * pad) / (sm.width + md.width)
    pair = Image.new('RGB', (Wd - 2 * pad, int(md.height * sc2)), (14, 14, 14))
    pair.paste(sm.resize((int(sm.width * sc2), int(sm.height * sc2)), Image.LANCZOS), (0, 0))
    pair.paste(md.resize((int(md.width * sc2), int(md.height * sc2)), Image.LANCZOS), (int(sm.width * sc2) + pad, 0))
    rows.append(('img', pair, 'SMALL 9 x 7 (left) and MIDDLE 14 x 10 (right), shrunk to %d%%' % round(sc2 * 100)))
    def cut(b, cx, cy, w=1170, h=1000):
        x0 = int(min(max(0, cx - w / 2), b.width - w)); y0 = int(min(max(0, cy - h / 2), b.height - h))
        return b.crop((x0, y0, x0 + w, y0 + h))
    def side(a, b):
        im = Image.new('RGB', (a.width + b.width + pad, max(a.height, b.height)), (14, 14, 14)); im.paste(a, (0, 0)); im.paste(b, (a.width + pad, 0)); return im
    before = Image.open(os.path.join(OUT, 'COMBAT2_BOARD_SMALL_10_16.webp')).convert('RGB')
    L0 = facts['small']['first_house']                     # the same lot in both rounds (same plan seed): its house
    at = ((L0[1] + 1) * TPX, (L0[0] + 1) * TPY + 80)
    rows.append(('img', side(cut(before, *at), cut(sm, *at)), 'BEFORE (left, round one: COOK FOUR\'s one orange ranch, flipped) and AFTER (right, the same spot of the small board: his five kinds in the tans), 1:1'))
    rows.append(('img', side(cut(md, 7.5 * TPX, 2.2 * TPY), cut(big, 13.5 * TPX, 6.2 * TPY)), 'AT 1:1: the MIDDLE board along its north street (left), the LARGE board at a crossing (right)'))
    # the twin
    man = Image.open(R1.MAN).convert('RGBA').crop((0, 0, 112, 112))
    tw = Image.new('RGB', (Wd - 2 * pad, 330), (14, 14, 14)); d = ImageDraw.Draw(tw)
    d.text((10, 6), 'THE TWIN: his pack house #30 and the man (the ruler) at 1:1, and COOK FOUR\'s five houses in the tans exactly as made, shrunk to fit', font=f, fill=(235, 235, 235))
    t = R1.bank('5. Roof tiles', 30); tw.paste(t, (10, 190), t); tw.paste(man, (120, 190 + 96 - 107), man)
    x = 250; s3 = (Wd - 2 * pad - x - 5 * 24) / sum(house_img(k, False).width for k in ORDER)
    for k in ORDER:
        im = house_img(k, False); h2 = im.resize((int(im.width * s3), int(im.height * s3)), Image.LANCZOS)
        tw.paste(h2, (x, 300 - h2.height), h2); d.text((x, 305), '%s (shown at %d%%)' % (k, round(s3 * 100)), font=R1.font(18), fill=(200, 190, 170)); x += h2.width + 24
    rows.append(('img', tw, ''))
    gl = facts['large']['gaps_between_houses_px']
    label('THE THREE BIGGEST DIFFERENCES FROM ROUND ONE: (1) FIVE HOUSE SHAPES, never the same one twice running, so the lanes between houses run from %d to %d px wide and a line has to bend; (2) the drive goes to that house\'s own garage or carport, and the carports hold a car (his pack car doubled, 3.4 m in a 3.6 m carport); (3) one yard per block, so the dirt no longer changes colour at every lot line.' % (gl[0], gl[1]) if gl else '')
    label('Numbers (the proof line): colours per 96 px window, small %d / middle %d / large %d (the pack\'s ground 4,140). Pixel size: his 96-px tiles at 1:1, cars and lamps at x2. Light: from above, the pack\'s.' % (facts['small']['colours_per_96px'], facts['middle']['colours_per_96px'], facts['large']['colours_per_96px']))
    Hs = 0; measured = []
    for kind, a, b in rows:
        if kind == 'text':
            lines = R1.wrap(a, F if b else f, Wd - 2 * pad); measured.append(lines); Hs += len(lines) * (40 if b else 32) + 14
        else: measured.append(None); Hs += a.height + 44
    S_ = Image.new('RGB', (Wd, Hs + pad), (14, 14, 14)); d = ImageDraw.Draw(S_); y = pad // 2
    for (kind, a, b), m in zip(rows, measured):
        if kind == 'text':
            for ln in m: d.text((pad, y), ln, font=F if b else f, fill=(235, 220, 190) if b else (225, 225, 225)); y += 40 if b else 32
            y += 14
        else:
            S_.paste(a, (pad, y)); y += a.height + 4
            d.text((pad, y), b, font=f, fill=(200, 190, 170)); y += 40
    S_.save('records/target/COMBAT2_THE_FIVE_HOUSES_ON_THE_BOARD_10_18.webp', quality=86, method=4)
    print('sheet', S_.size)

if __name__ == '__main__':
    main()
