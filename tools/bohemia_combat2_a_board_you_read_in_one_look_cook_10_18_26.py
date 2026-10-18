#!/usr/bin/env python3
"""A BOARD YOU READ IN ONE LOOK  (COMBAT TWO, [a board you read in one look], 10/18; rule 117 on the board)

Paolo 10/18 on TUNING's card: 'I want you to be easier than Battle Brothers... like Nintendo simplified way kind of
vibes, like minimalist vibes... make the people feel that they're successfully doing it'. Rule 117(b): fewer things
shown, one clear next thing; the depth lives under the surface. His YES on the five houses (the fourteenth votes)
is kept: the same three boards, the same houses, house-sized.

WHAT THIS TOOL DOES, AND ONLY THIS: it lays round two's three boards again with round two's own code and its own
random draws (tools/bohemia_combat2_the_five_houses_on_the_board_cook_10_18_26.py over round one's dress), records
every piece the dress places and every decal it stamps, and then lets a piece stand only if it passes THE ONE-LOOK
RULES below. Nothing is drawn (rule 108): a piece is kept, cut, or swapped for another of his pack pieces. The
before board is round two bit for bit (proved in the run: the before raster is compared with a fresh round-two lay).

THE ONE-LOOK RULES (each one is a number in the record, before and after):
  1. NO WORDS ON THE GROUND: the STOP signs and the KEEP OUT sign go. A word on the board is a label, and the
     board has none (his 10/1 list of what was wrong under the fighters named 'words on the board').
  2. A THING STANDS ONLY IF IT IS A RULE: tufts, pallets and mail boxes have no fight fact; they go.
  3. ONE THING PER SPOT, NO SPECKS: loose rocks, bushes and junk in the yards are low cover the size of a fist at
     the opening frame; they go, except one junk pile or dumpster per back yard and two piles per vacant lot, which
     is how those tiles read ROUGH. One dead tree per lot at most (it is an obstacle).
  4. A CAR WHERE A CAR WOULD BE: in front of its own garage, under its carport, one wreck per stretch of street
     (no two within two house tiles, none in a crossing), and the vacant lot's wreck. A car parked on a front
     door path goes.
  5. LIGHT ONLY AT THE CROSSINGS: two lamps a crossing, on its north-west and south-east corners (rule 73: he loves
     the lamps lighting the block); a lamp already within a house tile of the corner stays, else a cut one is carried
     there; the ones down the middle of a block go; one fire barrel per board, with its scorch.
  6. THE LOUD LINES QUIETED: the cracks only along the kerb (DIRECTION 10/10: 'a real road cracks at the edges and
     the wheel paths'; the asphalt tile already carries its own), the barricade one material (his concrete jersey
     pieces in place of the red-and-white striped ones).
  7. KEPT WHOLE: every house, every wall and fence run along a street (they are the cover lines), the zebras, and
     the analog horror line of each board (rule 20: the clean police car, the ring of barrels, the same dead tree).

[bb the battle map] HOW BATTLE BROTHERS DID IT (recall, reference/library/battle_brothers/02_COMBAT_RULES.md: 'a
fight is generated from the map terrain where it happens (forest tiles block sight, hills give height, swamps cost
more AP')): every thing that stands on its board is a rule (a tree blocks the hex and the shot, a rock blocks the
hex); the small dressing (grass, flowers, pebbles) is painted into the ground at the ground's own brightness and
never reads as a thing. At the start of a turn the only lit marks are the active man's hex and, on hover, the path.
OURS: the same split, made easier (rule 117): a standing thing is cover, an obstacle, a fence, a house or a light,
and nothing else stands. Rogue Fable 4 (combat on the beat): 'most of the critical information presented in the
world and on the field of battle itself' (records/BOHEMIA_BB_STUDY_DAY_17_HOW_MUCH_DO_YOU_SHOW_8_28_26.md).

THE COUNT (the record's table), per board, before and after, at the start of a turn:
  LIT: things that give light (lamps, fire barrels).  LABELLED: words on the ground (signs).
  OUTLINED: hard lines laid on the ground (crack decals, chain-link pieces; the zebras are counted, kept).
  LOUD: warning paint (the striped barricades, the ring's road barrels).
  SPECKS: standing things under 10 phone pixels on their long side at the opening frame (the board whole on an
  upright phone, 1,170 px wide, the fight's far stop where both teams are on one screen, rule 104a).
  SPOTS: an independent pixel count at that same frame: blobs that stand off the ground around them, with the
  ground-only control beside it so the counter is proved pointed at the things, not the asphalt.
The rings, the lit reach tiles, the picked-tile box and the aim line are COMBAT's marks ([the marks on the board],
claimed by COMBAT 10/18); they are counted nowhere here and never touched.

REFERENCE CHECK (the 9/4 standing law; rule 82a: the twin IS his pack):
  compared to: round two's three boards (his YES, records/target/COMBAT2_THE_FIVE_HOUSES_ON_THE_BOARD_10_18.webp) at
  the same frame and at 1:1; his pack tiles as bought (the props on the sheet's twin row); the 112-px man (the ruler);
  a Las Vegas single-storey block from the air (the library's combat-ground index: at house scale the ground's
  alphabet is HOUSE / YARD / STREET / LOT and almost nothing else).
  structure taken: round two's plan, houses, drives and seeds, unchanged; what changed: which pieces stand.
  AH-01 THE BIBLE: one register, his palette, no outline on the ground; AH-03: one calm wrong thing per board, kept.
  REUSE CHECK: every pixel is round two's (COOK TWO's cells, COOK FOUR's houses, his pack tiles); this file adds none.

CANDIDATES ONLY (rule 100): reference/, records/target and the VOTE registry; nothing to slices/, engine/ or the demo.

    python3 tools/bohemia_combat2_a_board_you_read_in_one_look_cook_10_18_26.py        (about 5 minutes)
  Seeded end to end. The small after-board is committed; the middle and large regenerate bit for bit (.gitignore).
"""
import inspect, json, os, sys, time
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
os.chdir(R)
import bohemia_combat2_three_boards_from_the_whole_bank_cook_10_16_26 as R1   # round one: ground, props, dress
import bohemia_combat2_the_five_houses_on_the_board_cook_10_18_26 as R2      # round two: the five houses (patches R1)

TPX, TPY, TW, TH, CELLS = R1.TPX, R1.TPY, R1.TW, R1.TH, R1.CELLS
OUT = R1.OUT
PHONE_W = 1170                      # the upright phone's glass, device px (390 pt at 3x)
SPECK_PX = 10                       # under this on its long side at the opening frame, a thing is a speck

# ---------------------------------------------------------------- which part of the dress placed a piece
# round one's dress is one function; its own comments mark its parts. A piece's part is the last mark above the
# line that placed it (read from the caller's frame), so the dress runs untouched and every draw is the same.
_LINES, _FIRST = inspect.getsourcelines(R1.dress)
_MARKS = [("# back yards:", 'fence'), ("if L['vacant']:", 'vacant'), ('# front yard', 'front'),
          ('# the wreck in the drive', 'drive'), ('# back yard:', 'back'), ('# the street:', 'street'),
          ('n_wreck =', 'wreck'), ('# one barricade line', 'barricade'), ("for i in range({'small': 2", 'fire'),
          ('# the cracks', 'crack'), ('# THE ANALOG HORROR LINE', 'horror')]
PARTS = []
for text, part in _MARKS:
    n = next(i for i, ln in enumerate(_LINES) if text in ln)
    PARTS.append((_FIRST + n, part))
PARTS.sort()
LOT_PARTS = ('vacant', 'front', 'drive', 'back', 'horror')

def part_of(frame):
    if frame.f_code is R1.dress.__code__:
        p = 'dress'
        for ln, part in PARTS:
            if frame.f_lineno >= ln: p = part
        return p
    return frame.f_code.co_name                      # 'carports' (round two's car under the carport)

_PUT = R1.Props.put
def put(self, kind, fam, cx, foot, idx=None, flip=False, cover=True):
    f = sys._getframe(1); nc = len(self.cover)
    im = _PUT(self, kind, fam, cx, foot, idx=idx, flip=flip, cover=cover)
    part = part_of(f)
    self.__dict__.setdefault('rec', []).append(dict(
        n=len(self.items) - 1, kind=kind, part=part, cx=cx, foot=foot,
        cover=self.cover[-1] if len(self.cover) > nc else None,
        lot=f.f_locals.get('L') if part in LOT_PARTS else None))
    return im
R1.Props.put = put

DECALS = []
_DECAL = R1.decal_at
def decal_rec(img, src, y, x, strength=0.8, thresh_pct=12):
    DECALS.append(dict(part=part_of(sys._getframe(1)), src=src, y=y, x=x, s=strength, t=thresh_pct))
R1.decal_at = decal_rec

# ---------------------------------------------------------------- the one-look rules
def junction_tiles(P):
    return {(r, c) for r in P['ew'] for c in P['ns']}

def one_look(P, PR, decals, size):
    """returns (keep flags per recorded piece, keep flags per decal, swaps {item n: new item}, why {n: rule})"""
    cls, ns, J = P['cls'], P['ns'], junction_tiles(P)
    keep, why, swaps = {}, {}, {}
    trees, junk, cars = {}, {}, {}
    wrecks = []
    fires = [r for r in PR.rec if r['part'] == 'fire']
    for r in PR.rec:
        n, k, part = r['n'], r['kind'], r['part']
        lot = id(r['lot']) if r['lot'] is not None else None
        if part == 'horror' or part == 'carports' or part == 'fence':
            keep[n] = True; why[n] = 7 if part != 'carports' else 4; continue
        if k == 'sign':
            keep[n] = False; why[n] = 1; continue
        if k in ('tuft', 'pallet', 'mailbox'):
            keep[n] = False; why[n] = 2; continue
        if k == 'tree':
            trees[lot] = trees.get(lot, 0) + 1
            keep[n] = trees[lot] == 1; why[n] = 3; continue
        if part == 'vacant':
            if k == 'car':                                            # the vacant lot's one wreck
                cars[lot] = cars.get(lot, 0) + 1; keep[n] = cars[lot] == 1; why[n] = 4; continue
            if k in ('junk', 'tyres'):
                junk[lot] = junk.get(lot, 0) + 1; keep[n] = junk[lot] <= 2; why[n] = 3; continue
            keep[n] = False; why[n] = 3; continue                     # rocks
        if part == 'front':
            keep[n] = False; why[n] = 3; continue                     # rocks, bushes (trees handled above)
        if part == 'drive':
            if k == 'car':
                keep[n] = r['lot'].get('kind') == 'garage'; why[n] = 4; continue
            keep[n] = False; why[n] = 3; continue                     # the side junk pile
        if part == 'back':
            if k in ('junk', 'dumpster'):                             # one rough marker per back yard
                junk[lot] = junk.get(lot, 0) + 1; keep[n] = junk[lot] <= 1; why[n] = 3; continue
            keep[n] = False; why[n] = 3; continue                     # rocks
        if part == 'street' and k == 'lamp':
            keep[n] = False; why[n] = 5; continue                     # decided per crossing, below
        if part == 'wreck':
            y, x = int(r['foot'] // TH) - 1, int(r['cx'] // TW)
            t = (y // CELLS, x // CELLS)
            near_zebra = (cls[max(0, y - 1):y + 2, max(0, x - 1):x + 2] == R1.ZEBRA).any()
            ok = t not in J and not near_zebra and all(max(abs(y - a), abs(x - b)) >= 2 * CELLS for a, b in wrecks)
            if ok: wrecks.append((y, x))
            keep[n] = ok; why[n] = 4; continue
        if part == 'barricade':
            keep[n] = True; why[n] = 6
            if k == 'striped': swaps[n] = 'jersey'
            continue
        if part == 'fire':
            keep[n] = r is fires[0]; why[n] = 5; continue
        keep[n] = True; why[n] = 0                                    # anything unnamed stands (none, measured)
    # rule 5: two lamps per crossing, on its north-west and south-east corners: a lamp already standing within one house
    # tile of the corner stays where it is; else the nearest lamp that was cut moves to the corner's walk cell
    moves = {}
    lamps = [r for r in PR.rec if r['part'] == 'street' and r['kind'] == 'lamp']
    H, W = cls.shape
    for rt, ct in sorted(J):
        for y, x in ((rt * CELLS - 1, ct * CELLS - 1), ((rt + 1) * CELLS, (ct + 1) * CELLS)):
            if not (0 <= y < H and 0 <= x < W) or cls[y, x] != R1.WALK: continue
            d = lambda r: max(abs(r['cx'] / TW - (x + 0.5)), abs(r['foot'] / TH - (y + 1)))
            near = [r for r in lamps if d(r) <= CELLS and r['n'] not in moves]
            if near:
                keep[min(near, key=d)['n']] = True; continue
            spare = [r for r in lamps if not keep[r['n']]]
            if spare:
                r = min(spare, key=d); keep[r['n']] = True; moves[r['n']] = ((x + 0.5) * TW, (y + 1) * TH - 2)
    # decals: the scorch rides with its barrel (the k-th scorch is stamped just before the k-th barrel);
    # a crack stays only on a road cell beside a walk (the kerb lane)
    dk = []
    k_fire = 0
    for d in decals:
        if d['part'] == 'fire':
            dk.append(k_fire == 0); k_fire += 1
        elif d['part'] == 'crack':
            y, x = d['y'] // TH, d['x'] // TW
            win = cls[max(0, y - 1):y + 2, max(0, x - 1):x + 2]
            dk.append(bool(np.isin(win, (R1.WALK, R1.DRIVE)).any()))
        else:
            dk.append(True)
    return keep, dk, swaps, why, moves

def move_item(PR, rec, to):
    """a lamp carried to a crossing's corner: the same piece, its foot and middle set there"""
    foot, x, y, im, kind = PR.items[rec['n']]
    cx, nf = to
    PR.items[rec['n']] = (nf, int(cx - im.width / 2), int(nf - im.height), im, kind)
    rec['cx'], rec['foot'] = cx, nf

def swap_item(PR, n, to):
    """his concrete jersey piece in place of a striped barricade, standing on the same foot and middle"""
    foot, x, y, im, kind = PR.items[n]
    j, key = PR.tile(R1.JERSEY, R1.KIND['jersey']['k'], idx=R1.JERSEY[1][0])
    cx = x + im.width / 2
    PR.items[n] = (foot, int(cx - j.width / 2), int(foot - j.height), j, 'jersey')
    return key

# ---------------------------------------------------------------- the counts
def alpha_box(im):
    a = np.asarray(im)[..., 3] > 127
    ys, xs = np.nonzero(a)
    return (0, 0) if len(xs) == 0 else (xs.max() - xs.min() + 1, ys.max() - ys.min() + 1)

def count(P, PR, recs_keep, decals, dk, board_w, swaps):
    sc = PHONE_W / board_w
    standing = [r for r in PR.rec if recs_keep[r['n']]]
    kinds = {}
    for r in standing:
        k = swaps.get(r['n'], r['kind']); kinds[k] = kinds.get(k, 0) + 1
    specks = 0
    for r in standing:
        if r['part'] == 'fence': continue                             # a fence run reads as one line, not its pieces
        w, h = alpha_box(PR.items[r['n']][3])
        if max(w, h) * sc < SPECK_PX: specks += 1
    per_tile = {}
    for r in standing:
        if r['part'] == 'fence': continue
        t = (int((r['foot'] - 1) // TPY), int(r['cx'] // TPX)); per_tile[t] = per_tile.get(t, 0) + 1
    no_fact = sum(1 for r in standing if R1.KIND[r['kind']]['cover'] is None and r['kind'] != 'lamp')
    zebras = int((P['cls'] == R1.ZEBRA).sum() // (2 * CELLS))
    cracks = sum(1 for d, k in zip(decals, dk) if k and d['part'] == 'crack')
    houses = sum(1 for it in PR.items if it[4] == 'house')
    return dict(
        houses=houses, standing=len(standing), kinds=dict(sorted(kinds.items())),
        with_a_fight_fact=len(standing) - no_fact - kinds.get('lamp', 0), no_fight_fact=no_fact,
        lit=kinds.get('lamp', 0) + kinds.get('barrel', 0),
        labelled=kinds.get('sign', 0),
        outlined=dict(cracks=cracks, chain_link=kinds.get('chain', 0), zebras_kept=zebras),
        loud=kinds.get('striped', 0) + kinds.get('roadbarrel', 0),
        specks=specks, most_things_on_one_house_tile=max(per_tile.values()) if per_tile else 0,
        cover_pieces=sum(1 for r in standing if r['cover'] is not None))

def label_blobs(mask):
    """connected blobs (8-neighbour) of a small boolean picture; returns (size, long side) per blob"""
    H, W = mask.shape; seen = np.zeros_like(mask); out = []
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys, xs):
        if seen[y0, x0]: continue
        stack = [(y0, x0)]; seen[y0, x0] = True; n = 0; y1 = y2 = y0; x1 = x2 = x0
        while stack:
            y, x = stack.pop(); n += 1
            y1, y2, x1, x2 = min(y1, y), max(y2, y), min(x1, x), max(x2, x)
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = y + dy, x + dx
                    if 0 <= yy < H and 0 <= xx < W and mask[yy, xx] and not seen[yy, xx]:
                        seen[yy, xx] = True; stack.append((yy, xx))
        out.append((n, max(y2 - y1, x2 - x1) + 1))
    return out

def opening_frame(board):
    sc = PHONE_W / board.width
    return board.resize((PHONE_W, int(round(board.height * sc))), Image.LANCZOS)

def spots(frame, bare):
    """THE EYE'S COUNT at the opening frame: the board against its own ground with nothing standing, both shrunk the
    same way; a pixel that moved more than 24 levels on any channel is a standing thing's, and each joined blob of
    them (parts within 2 px joined, more than one pixel) is one thing the eye counts. A blob under SPECK_PX on its long side is a speck. The ground's
    own texture cannot count here (it is in both pictures); the planted control in main() proves it counts things."""
    d = np.abs(np.asarray(frame, int) - np.asarray(bare, int)).max(2) > 24
    near = np.asarray(Image.fromarray(d.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(3))) > 0   # parts 2 px apart are one thing
    blobs = [b for b in label_blobs(near) if b[0] >= 12]                 # a lone changed pixel grows to 9: not a thing
    return dict(spots=len(blobs), specks=sum(1 for n, l in blobs if l - 2 < SPECK_PX), share=round(float(d.mean()), 4))

def planted_control(bare_full):
    """twelve of his cars at x2 pasted far apart on the after-board's bare ground: the eye's count must read 12"""
    im = Image.fromarray(bare_full).convert('RGBA'); n = 0; used = dict(R1.USED)
    for i in range(12):
        car = R1.nearest(R1.bank(R1.CARS[0], i), 2)
        x = 400 + (i % 4) * (im.width - 800) // 3; y = 400 + (i // 4) * (im.height - 800) // 2
        im.paste(car, (x - car.width // 2, y - car.height // 2), car); n += 1
    R1.USED.clear(); R1.USED.update(used)              # the control's cars are not on any board
    return n, spots(opening_frame(im.convert('RGB')), opening_frame(Image.fromarray(bare_full)))['spots']

# ---------------------------------------------------------------- one board, before and after
def lay(size, G):
    seed = {'small': 101, 'middle': 202, 'large': 303}[size]
    P = R2.plan(size, seed)
    ground = R1.lay_ground(P, G, seed)
    PR = R1.Props(P, seed)
    DECALS.clear()
    R1.dress(P, G, ground, PR, size, seed)                 # decals recorded, not stamped
    n_cp = R2.carports(P, PR, size)
    return P, ground, PR, list(DECALS), n_cp

def stamp(ground, decals, flags):
    img = ground.copy()
    for d, k in zip(decals, flags):
        if k: _DECAL(img, d['src'], d['y'], d['x'], d['s'], d['t'])
    return img

def composite(img, items):
    out = Image.fromarray(img)
    for foot, x, y, im, kind in sorted(items, key=lambda t: t[0]):
        out.paste(im, (x, y), im)
    return out

def lights_of(PR, keep):
    out = []
    for r in PR.rec:
        if not keep[r['n']] or r['kind'] not in ('lamp', 'barrel'): continue
        out.append(dict(kind='lamp' if r['kind'] == 'lamp' else 'fire barrel', power='grid' if r['kind'] == 'lamp' else 'fire',
                        x_m=round(r['cx'] / R1.PPM, 2), y_m=round(r['foot'] / R1.PPM, 2)))
    return out

def prove_before(before):
    """the before board IS round two: the small board laid again by round two's own path, nothing recorded or deferred,
    compared pixel for pixel"""
    used = dict(R1.USED)
    R1.decal_at, R1.Props.put = _DECAL, _PUT
    try:
        G = R1.Ground(1016); P = R2.plan('small', 101); img = R1.lay_ground(P, G, 101)
        PR = R1.Props(P, 101); R1.dress(P, G, img, PR, 'small', 101); R2.carports(P, PR, 'small')
        same = bool(np.array_equal(np.asarray(R1.composite(img, PR)), np.asarray(before)))
    finally:
        R1.decal_at, R1.Props.put = decal_rec, put
        R1.USED.clear(); R1.USED.update(used)
    print('the before board is round two, pixel for pixel:', same, flush=True)
    return same

def main(sizes=('small', 'middle', 'large')):
    t0 = time.time()
    G = R1.Ground(1016)
    res, facts = {}, {}
    last = max(('small', 'middle', 'large').index(s) for s in sizes)
    for size in ('small', 'middle', 'large')[:last + 1]:
        P, ground, PR, decals, n_cp = lay(size, G)          # laid in round two's order, so the shared Ground draws are round two's
        if size not in sizes: continue
        keep, dk, swaps, why, moves = one_look(P, PR, decals, size)
        gb, ga = stamp(ground, decals, [True] * len(decals)), stamp(ground, decals, dk)
        before = composite(gb, PR.items)
        cb = count(P, PR, {r['n']: True for r in PR.rec}, decals, [True] * len(decals), before.width, {})
        if size == 'small': facts['before_is_round_two'] = prove_before(before)
        swapped = {}
        for n, to in swaps.items(): swapped[n] = swap_item(PR, n, to)
        for r in PR.rec:
            if r['n'] in moves: move_item(PR, r, moves[r['n']])
        kept_n = {r['n'] for r in PR.rec if keep[r['n']]}
        rec_n = {r['n'] for r in PR.rec}
        items = [it for i, it in enumerate(PR.items) if i in kept_n or i not in rec_n]   # houses are not recorded: kept
        after = composite(ga, items)
        ca = count(P, PR, keep, decals, dk, after.width, swaps)
        fb, fa = opening_frame(before), opening_frame(after)
        sb, sa = spots(fb, opening_frame(Image.fromarray(gb))), spots(fa, opening_frame(Image.fromarray(ga)))
        planted = planted_control(ga) if size == 'small' else None
        del gb, ga
        cut = {}
        for r in PR.rec:
            if not keep[r['n']]: cut.setdefault('rule %d' % why[r['n']], {}).setdefault(r['kind'], 0); cut['rule %d' % why[r['n']]][r['kind']] += 1
        cover_after = [dict(r['cover'], tile=list(swapped.get(r['n'], r['cover']['tile'])), kind=swaps.get(r['n'], r['cover']['kind']))
                       for r in PR.rec if keep[r['n']] and r['cover'] is not None]
        facts[size] = dict(tiles_across=P['C'], tiles_down=P['T'], px=[after.width, after.height],
                           opening_frame_scale=round(PHONE_W / after.width, 4),
                           before=dict(cb, **{'spots_at_the_opening_frame': sb}),
                           after=dict(ca, **{'spots_at_the_opening_frame': sa}),
                           eye_count_control=None if planted is None else dict(planted=planted[0], counted=planted[1]),
                           cut_by_rule=cut, lamps_moved_to_a_crossing=len(moves), unnamed_pieces=sum(1 for r in PR.rec if why[r['n']] == 0),
                           parts={p: sum(1 for r in PR.rec if r['part'] == p) for p in sorted({r['part'] for r in PR.rec})},
                           decals=dict(before=len(decals), after=int(sum(dk))),
                           cover=cover_after, lights=lights_of(PR, keep), terrain=R2.terrain(P),
                           colours_per_96px=dict(before=R1.density(np.asarray(before)), after=R1.density(np.asarray(after))),
                           elapsed_s=round(time.time() - t0, 1))
        after.save(os.path.join(OUT, 'COMBAT2_ONE_LOOK_%s_10_18.webp' % size.upper()), quality=84, method=4)
        res[size] = dict(before=before, after=after, fb=fb, fa=fa, P=P)
        print(size, 'standing', cb['standing'], '->', ca['standing'], 'lit', cb['lit'], '->', ca['lit'], 'words', cb['labelled'],
              '->', ca['labelled'], 'specks', cb['specks'], '->', ca['specks'], 'spots', sb['spots'], '->', sa['spots'],
              'planted', planted, round(time.time() - t0), 's', flush=True)
    if len(res) < 3:
        return res, facts
    keys = sorted(R1.USED.items(), key=lambda kv: (-kv[1], kv[0]))
    man = dict(lane='combat 2', row='[a board you read in one look]',
               rule='117 easier than Battle Brothers; 100 candidates only; 108 nothing drawn; 115b the ground and the buildings stay on the packs',
               ruler='57 px a metre; a cell 82 x 81 px = 1.44 m; a house tile 656 x 648 px = 11.5 m',
               the_one_look_rules=['1 no words on the ground', '2 a thing stands only if it is a rule', '3 one thing per spot, no specks',
                                   '4 a car where a car would be', '5 light only at the crossings', '6 the loud lines quieted',
                                   '7 kept whole: houses, the fence and wall runs, the zebras, the analog horror line'],
               opening_frame='the board whole on an upright phone, %d device px wide (the fight\'s far stop, rule 104a)' % PHONE_W,
               pieces={('COMBAT2_ONE_LOOK_%s_10_18' % s.upper()): dict(src='COMBAT2_ONE_LOOK_%s_10_18.webp' % s.upper(),
                        keys=[{'pack': k[0], 'idx': k[1]} for k, n in keys]) for s in res},
               keys_used=[[k[0], k[1], n, 'UP' if R1.up(*k) else 'never judged'] for k, n in keys],
               boards=facts)
    json.dump(man, open(os.path.join(OUT, 'COMBAT2_ONE_LOOK_10_18.json'), 'w'), indent=1)
    sheet(res, facts)
    print('total', round(time.time() - t0), 's')
    return res, facts

# ---------------------------------------------------------------- the sheet
def sheet(res, facts):
    pad = 24; Wd = 2 * PHONE_W + 3 * pad; F = R1.font(30); f = R1.font(24); fs = R1.font(20)
    rows = []
    def label(t, big=False): rows.append(('text', t, big))
    def side(a, b):
        im = Image.new('RGB', (a.width + b.width + pad, max(a.height, b.height)), (14, 14, 14)); im.paste(a, (0, 0)); im.paste(b, (a.width + pad, 0)); return im
    label('COMBAT TWO: THE SAME THREE FIGHT BOARDS (YOUR YES ON THE FIVE HOUSES), WITH EVERYTHING THAT IS NOT A RULE TAKEN OFF. LEFT BEFORE, RIGHT AFTER. CANDIDATES, NOT IN THE GAME.', True)
    label('Each pair is the board whole at the phone\'s own pixels, the way the fight opens with both teams on one screen: the thing to read in one look. What stays is cover, a tree, a fence, a house, or a light at a crossing; nothing else stands.')
    for size in ('large', 'middle', 'small'):
        b, a = facts[size]['before'], facts[size]['after']
        rows.append(('img', side(res[size]['fb'], res[size]['fa']),
                     '%s %d x %d: things standing %d -> %d, lit %d -> %d, words %d -> %d, specks %d -> %d, things the eye counts %d -> %d, of them specks %d -> %d' % (
                         size.upper(), facts[size]['tiles_across'], facts[size]['tiles_down'], b['standing'], a['standing'], b['lit'], a['lit'],
                         b['labelled'], a['labelled'], b['specks'], a['specks'], b['spots_at_the_opening_frame']['spots'],
                         a['spots_at_the_opening_frame']['spots'], b['spots_at_the_opening_frame']['specks'], a['spots_at_the_opening_frame']['specks'])))
    # the man's stop at 1:1: the small board's crossing, the same three men standing on the same spots in both
    P = res['small']['P']; cxx, cyy = (P['ns'][0] + 0.5) * TPX, (P['ew'][0] + 0.5) * TPY
    w, h = PHONE_W, 1300
    x0, y0 = int(cxx - w / 2), int(cyy - h / 2)
    man = Image.open(R1.MAN).convert('RGBA').crop((0, 0, 112, 112))
    spotsm = [(x0 + 300, y0 + 560), (x0 + 820, y0 + 610), (x0 + 560, y0 + 980)]
    def crop_men(bd):
        c = bd.crop((x0, y0, x0 + w, y0 + h)).convert('RGBA')
        for mx, my in spotsm: c.paste(man, (mx - x0 - 56, my - y0 - 112), man)
        return c.convert('RGB')
    rows.append(('img', side(crop_men(res['small']['before']), crop_men(res['small']['after'])),
                 'AT 1:1, one art pixel to one phone pixel, the man at 112 (the ruler): the small board\'s crossing, before and after, three men on the same spots'))
    # the twin: his pieces as bought that were taken off, beside the man
    tw = Image.new('RGB', (Wd - 2 * pad, 230), (14, 14, 14)); d = ImageDraw.Draw(tw)
    d.text((10, 6), 'THE TWIN, his tiles as bought at 1:1: what was taken off the ground (left) and what stays (right), beside the man', font=f, fill=(235, 235, 235))
    off = [('15. Street props', 0, 'STOP: a word'), ('17. Warning Signs and road props', 1, 'KEEP OUT: a word'), ('16. Dead trees and plants', 21, 'tuft: no rule'),
           ('15. Street props', 7, 'mail box: no rule'), ('15. Street props', 40, 'pallet: no rule'), ('Rocks and stones', 49, 'rocks: a loose speck'),
           ('3. Barricades and blockades', 9, 'striped: loud')]
    on = [('9. Abandoned cards', 19, 'car: cover'), ('16. Dead trees and plants', 6, 'tree: obstacle'), ('2. Broken building walls', 0, 'wall: cover'),
          ('6. Chain link fences', 0, 'chain link: fence'), ('3. Barricades and blockades', 4, 'jersey: low cover'), ('18. Light sources and fire barrels', 2, 'lamp: light')]
    x = 10
    for group, col in ((off, (220, 150, 130)), (on, (170, 210, 160))):
        for name, i, lab in group:
            t = R1.bank(name, i); tw.paste(t, (x, 60), t)
            for j, ln in enumerate(lab.split(': ')): d.text((x, 168 + 22 * j), ln + (':' if j == 0 else ''), font=R1.font(17), fill=col)
            x += 155
        x += 40
    tw.paste(man, (x, 60 + 96 - 112), man); d.text((x, 168), 'the man, 112', font=R1.font(17), fill=(200, 190, 170))
    rows.append(('img', tw, ''))
    s, m, l = facts['small'], facts['middle'], facts['large']
    label('THE THREE BIGGEST DIFFERENCES: (1) NO WORDS AND NOTHING WITHOUT A RULE: the stop signs, the keep-out sign, tufts, pallets and mail boxes are off; '
          '(2) NO SPECKS: loose rocks, bushes and junk are off the yards, one junk pile marks a rough back yard, one tree a lot, one wreck per stretch of street; '
          '(3) LIGHT ONLY AT THE CROSSINGS, one fire barrel a board, the cracks only along the kerb, the barricade all concrete. Every house, wall, fence run and zebra is kept.')
    label('Numbers (the proof line): things standing small %d -> %d, middle %d -> %d, large %d -> %d; spots at the opening frame small %d -> %d, middle %d -> %d, large %d -> %d. '
          'Pixel size: his 96-px tiles at 1:1, cars, trees, lamps and chain link at x2 (unchanged). Light: from above, the pack\'s.' % (
              s['before']['standing'], s['after']['standing'], m['before']['standing'], m['after']['standing'], l['before']['standing'], l['after']['standing'],
              s['before']['spots_at_the_opening_frame']['spots'], s['after']['spots_at_the_opening_frame']['spots'],
              m['before']['spots_at_the_opening_frame']['spots'], m['after']['spots_at_the_opening_frame']['spots'],
              l['before']['spots_at_the_opening_frame']['spots'], l['after']['spots_at_the_opening_frame']['spots']))
    Hs = 0; measured = []
    for kind, a, b in rows:
        if kind == 'text':
            lines = R1.wrap(a, F if b else f, Wd - 2 * pad); measured.append(lines); Hs += len(lines) * (40 if b else 32) + 14
        else:
            lines = R1.wrap(b, fs, Wd - 2 * pad) if b else []; measured.append(lines); Hs += a.height + 12 + 28 * len(lines) + 16
    S_ = Image.new('RGB', (Wd, Hs + pad), (14, 14, 14)); d = ImageDraw.Draw(S_); y = pad // 2
    for (kind, a, b), m_ in zip(rows, measured):
        if kind == 'text':
            for ln in m_: d.text((pad, y), ln, font=F if b else f, fill=(235, 220, 190) if b else (225, 225, 225)); y += 40 if b else 32
            y += 14
        else:
            S_.paste(a, (pad, y)); y += a.height + 8
            for ln in m_: d.text((pad, y), ln, font=fs, fill=(200, 190, 170)); y += 28
            y += 16
    S_.save('records/target/COMBAT2_A_BOARD_YOU_READ_IN_ONE_LOOK_10_18.webp', quality=86, method=4)
    print('sheet', S_.size)

if __name__ == '__main__':
    only = [a for a in sys.argv[1:] if a in ('small', 'middle', 'large')]
    main(tuple(only) if only else ('small', 'middle', 'large'))
