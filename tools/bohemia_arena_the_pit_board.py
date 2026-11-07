#!/usr/bin/env python3
"""BOHEMIA -- ARENA 2: THE PIT'S OWN FIGHT BOARD (VAMILY rule 426(f), ask line 497; rule 408(b) the golden-piece recipe).

HIS WORDS, 11/6, on the VOTE card of the fight in the pit: YES to the rules and the crowd, and 'The arena map is so fucking ugly
bro'. MEASURED BEFORE (records/target/arena/board/before_*.png): the pit fight stood on a 9 x 5 window cut out of a random
Strip template (a boulevard's lamp posts, a bus shelter, two pool blocks cut in half, hard block seams), and nothing on it said
pit, arena, Mob or crowd. It was a street.

NOW THE BOARD IS THE PIT ITSELF, the place the town shows, at the fight's own ruler: a Strip resort's lagoon pool, drained since
the water stopped, the Mob's arena. THE POOL FLOOR IS THE BOARD and THE POOL'S WALLS ARE THE BOARD'S EDGES (no retreat is not
a rule you read, it is a wall you see). Round it, the dead resort as one real place: the north deck with a small crowd on
mismatched casino chairs behind the dead showroom's velvet ropes, the bookie's blackjack table and his chalkboard, the bulb
strings on two pairs of poles (most bulbs dead), the PA horn, the hand-painted sign; the cabanas and dead palms; the hotel
wing's balconies and the tower over it; the clone cages and the plywood ramp at the east end (where the Mob drives the clones
in), the generator they cannot always feed; the pool steps at the west end (where his men go down); the south deck's crowd,
the empty lifeguard chair, the fence, the garden and Las Vegas Boulevard with its stalled cars; a spa and a palapa bar, the
parking garage to the east.

ON THE FLOOR, each thing on its own tile and the tile's ground saying what it is (Battle Brothers' tiles, rule 59): the
swim-up blackjack bar (a real Strip pool thing) stands on one tile, BLOCKED; a heap of loungers the crowd threw in, DEBRIS;
the black water over the main drain, WATER (BB's swamp); wind-blown sand in two corners, ROUGH; everything else flat.

ANALOG HORROR AT THE SOURCE (records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md): the ordinary frame (a resort pool, by day) with
ONE wrong thing: four long gouges up the north wall's tile where something climbed out, the coping broken there, a dark drag
across the deck into the cabanas. And the grime is in the source, never over the picture: the rings the last water left as it
went down, the old water line on the tile, the crust round the drain, the cracks a pool gets when it is drained, the plaster
spalled to the concrete, the casino's starburst mosaic missing a tile in eight, the chalk tally of the dead on the wall.

HOW IT IS BUILT (the town pit's way, ONE SOURCE, tools/bohemia_arena_the_pit.py): one scene in metres through the master rig
(tools/bohemia_direction_master_rig.py): its camera (orthographic, 45 degrees, facing north, heights x 1.414), 42.9 px a metre
(the fight's tile_px 515 x 364 for a 12 m tile), its one sun and sky fill, its source pass on every material, its dent pass on
the props; DIRECTION's palette roles for every colour (the props modeller's mat()). The floor and the north wall carry a paint
map made here from the palette (the plaster, the mosaic, the rings, the cracks), never a pixel drawn over the render.
ONE SIZE: a 10 x 5 pool (five rows: his three with a tile above and below, a tournament's five in one column; a longer
line steps back a column, the fight's own place()). A 10 x 7 pool (M) is laid out and renders with --variant M, but is not
shipped: one place is one picture, and lighter (rule 418). The board region and a tile round it at the fight's full 42.9 px a metre; the ring (ten tiles, what the fight shows
round any board) at a quarter (the fight draws its ring at half size anyway). Cut into 5 x 5-tile pictures the fight already
reads ('picture.webp#col,row', COMBAT TWO's laid board), so the fight draws the pit with the code every board uses.

  <venv>/bin/python tools/bohemia_arena_the_pit_board.py [--quick] [--variant S|M] [--board-only|--ring-only] [--ship]
  -> records/target/arena/board/<V>_board.png, <V>_ring.png (the renders), <V>_floor.png, <V>_wall.png (the paint maps)
  -> slices/arena/pit/<V>_b<i><j>.webp, <V>_r<i><j>.webp, slices/arena/pit_board.json (the laid board the fight reads)

REFERENCE CHECK (the 9/4 standing duty; records/BOHEMIA_REFERENCE_LIBRARY_INDEX.json): BLDG-04 the Strip's three races (the
pool race: a Strip casino's pool deck is a small city of cabanas, bars, towers and a garage, the back of house behind it);
BLDG-05 the structural sanity list (a wall meets the coping, the steps reach the floor, a balcony sits on its slab); AH-01 the
analog horror bible (R1 one wrong thing, R4 every light has a source, R10 grime baked); AH-03 the vibe-coded tells (no straight
line at a grid border, no colour that ends abruptly: one picture, cut only where the fight's grid already is); TG-07 cover that
reads at 45 degrees; the bar piece: ground_one_real_street (records/target/direction_bar/THE_BAR.json, the floor bar), and the
town's own pit (slices/arena/pit_day.webp) for the same materials. The real thing: the Tropicana's and the Hard Rock's swim-up
blackjack, the Flamingo's lagoon pool and its palms, a drained pool's plaster (it cracks and spalls when the water goes),
Kool Deck round a Vegas pool. No reference game is added; Battle Brothers' arena is the floor only for the rules (a small
board, a crowd, no way out), which this file does not touch.
REUSE CHECK (REUSE-FIRST): the master rig's camera, sun, source and dent passes; the props modeller's mat, box, cyl, rod and
blotch; the town pit's mesh() and its hand-painted sign; the fight's own tile and block sizes (fight_ground.json); COMBAT
TWO's laid-board format and drawing. Nothing in banks/ is a 3D model and his packs hold no drained pool.
TASTE CHECK: his 'barely able to' (the Mob's duct tape: a small crowd, three bulbs of a dozen, a patched cage); never drained of
colour (rule 167(b)): the tile keeps its faded aqua and the casino's gold; the runway black on the crowd (his 9/4).
"""
import os, sys, json, math, random

import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_direction_master_rig as RIG
import bohemia_cook_model_props as P
import bohemia_arena_the_pit as PIT

FG = json.load(open(os.path.join(R, 'slices/fight_ground/fight_ground.json')))
TPX = FG['tile_px']                       # [515, 364]: a 12 m tile in the fight's camera
TM = float(FG['tile_metres'])             # 12
BT = int(FG['block_tiles'])               # 5: the fight cuts a picture into 5 x 5 tiles
PPM = TPX[0] / TM                         # 42.917 px a metre
TILT = float(RIG.G['tilt_deg'])           # 45
C = math.cos(math.radians(TILT))
ZS = 1.0 / C
ROWV = TPX[1] / PPM                       # the metres of 'up' (0.707 y + z) a tile row covers on the screen: 8.48
D = 2.2                                   # the deck stands this far over the pool floor (a Strip lagoon's deep side)
SOFF = D / C                              # the south wall stands this far south of the board, so its coping lies ON the board's edge
RING = 10                                 # the fight's ring round a laid board (SURROUND_BLOCKS 2 x block_tiles 5)
RS = 4                                    # the ring's pictures at a quarter of the fight's pixels
TX = 40                                   # texels a metre in the floor's and the wall's paint
BOARD_K = 2                               # the board ships at half the render's pixels (crisp sideways on his phone)
RING_SHIP_K = 5                           # the ring ships at a fifth (it is rendered at a quarter)
VARIANTS = {'S': (10, 5)}                 # ONE POOL: a line longer than five steps back a column (the fight's own place()); M (10 x 7) is kept in LAYOUT, rendered with --variant M, not shipped
# ON THE FLOOR, tile by tile (x across, y down from the north wall); the terrain says the same thing the picture does
LAYOUT = {
    'S': dict(bar=(5, 1), heap=(3, 3), puddle=(6, 3), sand=[(8, 0), (9, 0), (0, 4)]),
    'M': dict(bar=(5, 1), heap=(3, 5), puddle=(6, 4), sand=[(8, 0), (9, 0), (0, 6)]),
}
OUT = os.path.join(R, 'records/target/arena/board')
SHIP = os.path.join(R, 'slices/arena/pit')
SHIP_JSON = os.path.join(R, 'slices/arena/pit_board.json')


def hexrgb(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255.0


def pal(role, i):
    return hexrgb(P.PAL[role]['ramp'][i])


def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def vnoise(h, w, cell, rs):
    from PIL import Image
    cell = max(2.0, float(cell))
    gh, gw = int(math.ceil(h / cell)) + 3, int(math.ceil(w / cell)) + 3
    small = rs.rand(gh, gw).astype(np.float32)
    big = np.asarray(Image.fromarray(small, 'F').resize((int(gw * cell), int(gh * cell)), Image.BICUBIC))
    oy, ox = rs.randint(0, int(cell)), rs.randint(0, int(cell))
    return big[oy:oy + h, ox:ox + w]


def fbm(h, w, octaves, rs):
    acc = np.zeros((h, w), np.float32); tot = 0.0
    for cell, amp in octaves:
        acc += vnoise(h, w, cell, rs) * amp; tot += amp
    a = acc / tot
    return (a - a.min()) / max(1e-6, a.max() - a.min())


def lay(col, rgb, a):
    a = np.clip(a, 0, 1)[..., None]
    return col * (1 - a) + rgb[None, None, :] * a


def tile_xy(t):
    """the middle of a board tile in metres (x east, y north, the board's north-west corner at 0, 0)"""
    return (t[0] + 0.5) * TM, -(t[1] + 0.5) * TM


# ============================================================ THE PAINT (the floor and the north wall, from the palette)
def floor_paint(V, path):
    from PIL import Image, ImageDraw
    W, H = VARIANTS[V]; L = LAYOUT[V]; BW, BH = W * TM, H * TM
    XF0, XF1, YF1, YF0 = -2.0, BW + 2.0, 2.0, -(BH + SOFF + 2.0)
    w, h = int(round((XF1 - XF0) * TX)), int(round((YF1 - YF0) * TX))
    rs = np.random.RandomState(4261 if V == 'S' else 4267); rnd = random.Random(4261 if V == 'S' else 4267)
    X = (XF0 + (np.arange(w, dtype=np.float32) + 0.5) / TX)[None, :]
    Y = (YF1 - (np.arange(h, dtype=np.float32) + 0.5) / TX)[:, None]
    # 1. THE PLASTER: a pale aqua-white, sun-chalked, never one colour over a square metre
    big = fbm(h, w, [(14 * TX, 1.0), (5 * TX, 0.55), (1.6 * TX, 0.3), (0.45 * TX, 0.2)], rs)
    A = pal('tape_grey', 3) * 0.45 + pal('clay_teal', 4) * 0.55
    B = pal('tape_grey', 2) * 0.55 + pal('clay_teal', 3) * 0.45
    col = np.broadcast_to(A, (h, w, 3)).copy()
    col = lay(col, B, sstep(0.35, 0.8, big) * 0.75)
    alg = fbm(h, w, [(7 * TX, 1.0), (2.2 * TX, 0.6), (0.6 * TX, 0.3)], rs)          # the old algae, where the water sat last
    col = lay(col, pal('clay_teal', 2) * 0.6 + pal('tape_masking', 1) * 0.4, sstep(0.58, 0.85, alg) * 0.42)
    col = lay(col, pal('tape_grey', 4), sstep(0.62, 0.9, 1.0 - alg) * 0.2)             # and where the sun bleached it white
    wall_d = np.minimum(np.minimum(X - 0.0, BW - X), np.minimum(-Y, Y + BH + SOFF))     # metres to the nearest wall's foot
    col = lay(col, pal('tape_masking', 0) * 0.7 + pal('clay_teal', 1) * 0.3, sstep(0.9, 0.0, wall_d) * 0.38 * (0.6 + 0.4 * big))
    # 2. THE CASINO'S STARBURST, set in 30 cm tiles in the middle of the floor; one tile in eight popped out
    cx, cy = BW / 2.0, -BH / 2.0; cell = 0.3
    ci = np.floor((X - cx) / cell); cj = np.floor((Y - cy) / cell)
    ccx, ccy = (ci + 0.5) * cell, (cj + 0.5) * cell
    r = np.hypot(ccx, ccy); th = np.arctan2(ccy, ccx)
    tri = 1.0 - np.abs(((th / (2 * math.pi) * 8.0) % 1.0) * 2.0 - 1.0)
    rout, rin = (10.5, 4.2) if V == 'S' else (12.0, 4.6)
    star = r < (rin + (rout - rin) * tri ** 1.6)
    gold = ((r > rout + 1.0) & (r < rout + 2.1)) | (r < 1.9)
    hsh = np.modf(np.sin(ci * 12.9898 + cj * 78.233) * 43758.5453)[0]; hsh = np.abs(hsh)
    gone = hsh < 0.125
    fx = ((X - cx) / cell) % 1.0; fy = ((Y - cy) / cell) % 1.0
    grout = np.minimum(np.minimum(fx, 1 - fx), np.minimum(fy, 1 - fy)) < 0.07
    jit = (0.92 + 0.12 * hsh)[..., None]
    tealc = np.clip(pal('clay_teal', 1)[None, None, :] * jit * 1.05, 0, 1)
    goldc = np.clip((pal('clay_mustard', 2) * 0.7 + A * 0.3)[None, None, :] * jit, 0, 1)
    m_star = (star & ~gone & ~grout)[..., None]; m_gold = (gold & ~gone & ~grout)[..., None]
    col = np.where(m_star, tealc, col); col = np.where(m_gold, goldc, col)
    hole = ((star | gold) & gone)
    col = np.where(hole[..., None], col * 0.7 + pal('tape_grey', 1)[None, None, :] * 0.3, col)
    col = np.where(((star | gold) & grout & ~gone)[..., None], col * 0.78, col)
    # 3. THE RINGS THE LAST WATER LEFT round the drain as it went down, the crust inside, a white bloom of minerals outside
    px_, py_ = tile_xy(L['puddle'])
    warp = fbm(h, w, [(9 * TX, 1.0), (3 * TX, 0.5), (1.0 * TX, 0.25)], rs)
    rad = 21.0 if V == 'S' else 25.0
    d = np.hypot((X - px_) / 1.0, (Y - py_) / 0.78) / rad + (warp - 0.5) * 0.42
    crust = pal('tape_masking', 1) * 0.6 + pal('clay_teal', 2) * 0.4
    col = lay(col, crust, sstep(1.0, 0.82, d) * 0.28)
    col = lay(col, pal('clay_teal', 2) * 0.5 + pal('tape_masking', 0) * 0.5, sstep(0.42, 0.2, d) * 0.32)
    for lv, k in ((0.3, 0.42), (0.47, 0.35), (0.63, 0.33), (0.79, 0.3), (0.92, 0.38), (1.0, 0.5)):
        col = lay(col, crust * 0.8, np.exp(-((d - lv) / 0.0075) ** 2) * k)
    col = lay(col, pal('tape_grey', 4), sstep(1.0, 1.03, d) * sstep(1.12, 1.04, d) * 0.22)
    # 3b. THE TRICKLES: where the last rain ran across the floor to the drain, a darker track each
    tr = np.zeros((h, w), np.float32)
    for k in range(26):
        sx_, sy_ = rnd.uniform(1, BW - 1), rnd.uniform(-BH + 1, -1); ex_, ey_ = px_ + rnd.gauss(0, 1.2), py_ + rnd.gauss(0, 1.0)
        L_ = math.hypot(ex_ - sx_, ey_ - sy_)
        if L_ < 6: continue
        ux, uy = (ex_ - sx_) / L_, (ey_ - sy_) / L_
        t = (X - sx_) * ux + (Y - sy_) * uy; off = np.abs(-(X - sx_) * uy + (Y - sy_) * ux + (warp - 0.5) * 2.2)
        tr = np.maximum(tr, sstep(0.22, 0.04, off) * ((t > 0) & (t < L_)) * (0.35 + 0.65 * np.clip(t / L_, 0, 1)))
    col = lay(col, pal('clay_teal', 2) * 0.5 + pal('tape_masking', 1) * 0.5, tr * 0.35)
    # 4. THE CRACKS a pool gets when it is drained, and the plaster spalled to the concrete
    im = Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)); dr = ImageDraw.Draw(im)
    def P2(x, y): return ((x - XF0) * TX, (YF1 - y) * TX)
    crack_c = tuple(int(v * 255) for v in pal('tape_grey', 1) * 0.6 + pal('tape_masking', 0) * 0.4)
    for k in range(18 if V == 'S' else 24):
        x, y = rnd.uniform(1, BW - 1), rnd.uniform(-BH + 1, -1); a = rnd.uniform(0, 2 * math.pi); pts = [P2(x, y)]
        for s in range(rnd.randint(14, 46)):
            a += rnd.gauss(0, 0.35); x += 0.28 * math.cos(a); y += 0.28 * math.sin(a); pts.append(P2(x, y))
            if rnd.random() < 0.05:
                b, bx, by = a + rnd.choice((-1, 1)) * rnd.uniform(0.6, 1.2), x, y; q = [P2(bx, by)]
                for _ in range(rnd.randint(4, 12)): b += rnd.gauss(0, 0.3); bx += 0.25 * math.cos(b); by += 0.25 * math.sin(b); q.append(P2(bx, by))
                dr.line(q, fill=crack_c, width=1)
        dr.line(pts, fill=crack_c, width=2)
    col = np.asarray(im).astype(np.float32) / 255.0
    for k in range(7):
        x, y, rr = rnd.uniform(3, BW - 3), rnd.uniform(-BH + 3, -3), rnd.uniform(0.6, 1.5)
        n = vnoise(h, w, 0.5 * TX, rs)
        dd = np.hypot(X - x, (Y - y) * 1.2) / rr + (n - 0.5) * 0.7
        col = lay(col, pal('tape_grey', 2) * 0.8, sstep(1.0, 0.92, dd) * 0.85)
        col = lay(col, pal('tape_grey', 1), np.exp(-((dd - 1.0) / 0.05) ** 2) * 0.5)
    # 5. THE NIGHTS BEFORE: dried blood where men fell, two drags toward the east gate where the dead clones went out
    dried = pal('blood', 0) * 0.62 + pal('tape_masking', 0) * 0.38
    gx, gy = BW, -BH / 2.0
    for k in range(7):
        x, y, rr = rnd.uniform(BW * 0.22, BW * 0.82), rnd.uniform(-BH + 6, -6), rnd.uniform(0.45, 1.2)
        n = vnoise(h, w, 0.35 * TX, rs)
        dd = np.hypot(X - x, Y - y) / rr + (n - 0.5) * 0.9
        col = lay(col, dried, sstep(1.0, 0.75, dd) * 0.78)
        for _ in range(9):
            a, s = rnd.uniform(0, 2 * math.pi), rnd.uniform(1.2, 2.6) * rr
            col = lay(col, dried, sstep(1.0, 0.7, np.hypot(X - x - s * math.cos(a), Y - y - s * math.sin(a)) / rnd.uniform(0.05, 0.14)) * 0.7)
        if k < 2:
            # the drag: a smear from the stain to the gate, streaked along its way and fading
            L_ = math.hypot(gx - x, gy - y); ux, uy = (gx - x) / L_, (gy - y) / L_
            t = np.clip((X - x) * ux + (Y - y) * uy, 0, L_); off = np.abs(-(X - x) * uy + (Y - y) * ux)
            streak = 0.6 + 0.4 * np.sin(off * 41.0 + (warp - 0.5) * 6.0)
            brk = sstep(0.35, 0.6, vnoise(h, w, 0.8 * TX, rs))
            col = lay(col, dried, sstep(0.95, 0.35, off) * sstep(min(L_, 16.0), 0.0, t) * streak * brk * 0.55 * ((t > 0) & (t < L_)))
    # 6. THE WIND'S SAND in the corners and along the foot of the north wall, rippled
    sandc = pal('clay_bone', 2); sandl = pal('clay_bone', 3)
    rip = 0.5 + 0.5 * np.sin((X * 0.8 + Y * 0.6) * 2 * math.pi / 0.55 + (warp - 0.5) * 7.0)
    sm = sstep(1.6, 0.0, -Y) * 0.55 * (0.5 + 0.5 * vnoise(h, w, 2 * TX, rs))
    for t in L['sand']:
        x, y = tile_xy(t); n = vnoise(h, w, 1.5 * TX, rs)
        sm = np.maximum(sm, sstep(1.0, 0.55, np.hypot((X - x) / 6.6, (Y - y) / 5.6) + (n - 0.5) * 0.45))
    col = lay(col, sandc, sm * 0.9); col = lay(col, sandl, sm * rip * 0.35)
    # 7. THE DAMP round the black water, and its algae
    x, y = tile_xy(L['puddle']); n = vnoise(h, w, 1.2 * TX, rs)
    dd = np.hypot((X - x) / 5.6, (Y - y) / 4.2) + (n - 0.5) * 0.5
    col = lay(col, pal('clay_teal', 2) * 0.55 + pal('tape_masking', 0) * 0.45, sstep(1.35, 0.9, dd) * 0.45)
    col = lay(col, pal('clay_teal', 1), np.exp(-((dd - 1.12) / 0.05) ** 2) * 0.5)
    # 8. WHAT BLEW IN: dead palm fronds, paper, and the house's chips the last crowd threw
    im = Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)); dr = ImageDraw.Draw(im)
    frond = [tuple(int(v * 255) for v in pal('tape_masking', 1)), tuple(int(v * 255) for v in pal('clay_bone', 1))]
    for k in range(26):
        x, y, a, ln = rnd.uniform(1, BW - 1), rnd.uniform(-BH + 1, -1), rnd.uniform(0, 2 * math.pi), rnd.uniform(2.2, 4.0)
        c_ = rnd.choice(frond); pts = []
        for s in range(13):
            u = s / 12.0; pts.append(P2(x + ln * u * math.cos(a), y + ln * u * math.sin(a) + 0.25 * math.sin(u * 3)))
        dr.line(pts, fill=c_, width=2)
        for s in range(2, 13):
            u = s / 12.0; bx, by = x + ln * u * math.cos(a), y + ln * u * math.sin(a); l2 = 0.55 * (1.1 - u)
            for sg in (-1, 1):
                b = a + sg * 1.0
                dr.line([P2(bx, by), P2(bx + l2 * math.cos(b), by + l2 * math.sin(b))], fill=c_, width=1)
    leaf = [tuple(int(v * 255) for v in pal(*c)) for c in (('tape_masking', 1), ('clay_bone', 1), ('clay_rust', 1), ('tape_masking', 0))]
    for (cxl, cyl_, n_) in ((0.5, -0.5, 900), (BW - 0.5, -0.5, 700), (BW - 0.5, -BH - SOFF + 0.5, 600), (0.5, -BH - SOFF + 0.5, 500), (BW * 0.3, -0.4, 300)):
        for k in range(n_):
            r_ = abs(rnd.gauss(0, 2.2)); a = rnd.uniform(0, 2 * math.pi)
            x, y = cxl + r_ * math.cos(a), cyl_ + r_ * math.sin(a) * 0.8
            if not (0.05 < x < BW - 0.05 and -BH - SOFF + 0.05 < y < -0.05): continue
            u, v = P2(x, y); s_ = rnd.uniform(1.0, 2.6); dr.ellipse([u - s_, v - s_ * 0.6, u + s_, v + s_ * 0.6], fill=rnd.choice(leaf))
    paper = tuple(int(v * 255) for v in pal('tape_grey', 4))
    for k in range(40):
        x, y, s = rnd.uniform(0.5, BW - 0.5), rnd.uniform(-BH + 0.5, -0.5), rnd.uniform(0.12, 0.3)
        a = rnd.uniform(0, math.pi); q = [P2(x + s * math.cos(a + i * math.pi / 2) * (1 if i % 2 else 0.7), y + s * math.sin(a + i * math.pi / 2) * (1 if i % 2 else 0.7)) for i in range(4)]
        dr.polygon(q, fill=paper)
    chips = [tuple(int(v * 255) for v in pal(*c)) for c in (('clay_rust', 2), ('clay_mustard', 3), ('clay_teal', 2), ('cloth_black', 2))]
    for k in range(70):
        x, y = rnd.gauss(BW * 0.55, BW * 0.2), rnd.gauss(-BH / 2, BH * 0.25)
        if not (0.5 < x < BW - 0.5 and -BH + 0.5 < y < -0.5): continue
        u, v = P2(x, y); dr.ellipse([u - 2.4, v - 2.4, u + 2.4, v + 2.4], fill=rnd.choice(chips), outline=paper)
    # 9. THE WRONG THING'S MARKS on the floor: four scrapes running to the foot of the north wall where it climbed
    g0 = BW * 0.62
    scr = tuple(int(v * 255) for v in pal('tape_grey', 1))
    for i in range(4):
        dr.line([P2(g0 - 2.6 + i * 0.2, -4.2), P2(g0 + 0.25 + i * 0.18, -0.2)], fill=scr, width=2)
    im.save(path)
    return dict(path=path, px=[w, h], x0=XF0, x1=XF1, y0=YF0, y1=YF1)


DIG = {'0': ['111', '101', '101', '101', '111'], '2': ['111', '001', '111', '100', '111'], '4': ['101', '101', '111', '001', '001'],
       '6': ['111', '100', '111', '101', '111'], '8': ['111', '101', '111', '101', '111'], 'F': ['111', '100', '110', '100', '100'],
       'T': ['111', '010', '010', '010', '010'], ' ': ['000'] * 5}


def wall_paint(V, path):
    """the north wall's face: 15 cm aqua tile, the dark trim row and its depth marks in tile, the rings where the water stood for
    years, the chalk tally of the dead, and the four gouges"""
    from PIL import Image, ImageDraw
    W, H = VARIANTS[V]; BW = W * TM
    w, h = int(round(BW * TX)), int(round(D * TX))
    rs = np.random.RandomState(4262); rnd = random.Random(4262)
    X = ((np.arange(w, dtype=np.float32) + 0.5) / TX)[None, :]
    Z = (D - (np.arange(h, dtype=np.float32) + 0.5) / TX)[:, None]
    tile = 0.15
    ti, tj = np.floor(X / tile), np.floor(Z / tile)
    hsh = np.abs(np.modf(np.sin(ti * 12.9898 + tj * 78.233) * 43758.5453)[0])
    base = pal('clay_teal', 3) * 0.72 + pal('tape_grey', 3) * 0.28
    col = np.broadcast_to(base, (h, w, 3)) * (0.93 + 0.1 * hsh)[..., None]
    trim = Z > D - 0.3
    col = np.where(trim[..., None], pal('clay_teal', 1)[None, None, :] * (0.95 + 0.1 * hsh)[..., None], col)
    fx, fz = (X / tile) % 1.0, (Z / tile) % 1.0
    gr = (np.minimum(np.minimum(fx, 1 - fx), np.minimum(fz, 1 - fz)) < 0.09)
    col = np.where(gr[..., None], col * 0.55 + pal('tape_grey', 2)[None, None, :] * 0.45, col)
    big = fbm(h, w, [(3 * TX, 1.0), (0.8 * TX, 0.5)], rs)
    # the rings where the water stood: the oldest, highest, darkest; streaks running down from each
    for zl, k in ((D - 0.62, 0.55), (D - 1.15, 0.32), (D - 1.55, 0.22)):
        band = np.exp(-((Z - zl - (big - 0.5) * 0.05) / 0.035) ** 2)
        col = lay(col, pal('tape_masking', 1), band * k)
        streak = (np.sin(X * 37.0 + big * 9.0) > 0.86) & (Z < zl) & (Z > zl - 0.5 * (0.3 + big))
        col = lay(col, pal('tape_masking', 1), streak * k * 0.45)
    col = lay(col, pal('tape_masking', 0), sstep(0.6, 0.0, Z) * 0.35 * big)       # the foot of the wall, darkest
    im = Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)); dr = ImageDraw.Draw(im)
    def P2(x, z): return (x * TX, (D - z) * TX)
    # the depth marks set in the trim row in pale tile, the way a pool spells them
    pale = tuple(int(v * 255) for v in pal('tape_grey', 4))
    for x0, word in ((0.06 * BW, '4 FT'), (0.5 * BW, '8 FT'), (0.93 * BW, '4 FT')):
        cx = x0 - len(word) * 0.2
        for ch in word:
            for rr, row in enumerate(DIG.get(ch, DIG[' '])):
                for cc, on in enumerate(row):
                    if on == '1':
                        u, v = P2(cx + cc * 0.05, D - 0.04 - rr * 0.045)
                        dr.rectangle([u, v, u + 1.6, v + 1.5], fill=pale)
            cx += 0.2
    # THE CHALK TALLY: the Mob counts its dead on the deep wall, four strokes and a bar, row under row
    chalk = tuple(int(v * 255) for v in pal('tape_grey', 4))
    groups = 41
    for g in range(groups):
        row, k = divmod(g, 12); x0 = 0.035 * BW + k * 0.62 + rnd.uniform(-0.04, 0.04); z0 = D - 0.55 - row * 0.42
        n = 5 if g < groups - 1 else 3
        for s in range(min(4, n)):
            x = x0 + s * 0.1; dr.line([P2(x + rnd.uniform(-0.02, 0.02), z0), P2(x + rnd.uniform(-0.03, 0.03), z0 - 0.3)], fill=chalk, width=2)
        if n == 5: dr.line([P2(x0 - 0.05, z0 - 0.26), P2(x0 + 0.38, z0 - 0.04)], fill=chalk, width=2)
    # THE ONE WRONG THING: four gouges up the tile from the floor to the coping, the tile broken off round them
    g0 = 0.62 * BW; conc = tuple(int(v * 255) for v in pal('tape_grey', 2)); deep = tuple(int(v * 255) for v in pal('rubber', 1))
    for i in range(4):
        a, b = P2(g0 + 0.25 + i * 0.18, 0.15), P2(g0 + 0.75 + i * 0.2, D)
        dr.line([a, b], fill=conc, width=7); dr.line([a, b], fill=deep, width=3)
    for k in range(30):
        x, z = g0 + rnd.uniform(0.1, 1.6), rnd.uniform(0.4, D - 0.1)
        u, v = P2(math.floor(x / tile) * tile, math.floor(z / tile) * tile + tile)
        dr.rectangle([u, v, u + tile * TX - 1, v + tile * TX - 1], fill=conc)
    im.save(path)
    return dict(path=path, px=[w, h])


def chalkboard(path):
    """the bookie's board: tonight's odds in chalk on a casino's menu board"""
    from PIL import Image, ImageDraw, ImageFont
    w, h = 512, 384; rnd = random.Random(375)
    im = Image.new('RGB', (w, h), tuple(int(v * 255) for v in pal('cloth_black', 3))); d = ImageDraw.Draw(im)
    fp = os.path.join(R, 'slices/fonts/BohemiaCasing-Regular.ttf')
    try: f1, f2 = ImageFont.truetype(fp, 58), ImageFont.truetype(fp, 44)
    except Exception: f1 = f2 = ImageFont.load_default()
    ch = tuple(int(v * 255) for v in pal('tape_grey', 4))
    d.text((34, 20), 'TONIGHT', fill=ch, font=f1)
    for i, s in enumerate(('BULL   3-1', 'HOUSE  EVEN', 'NO REFUNDS')):
        d.text((40, 110 + i * 82), s, fill=ch, font=f2)
    for k in range(400):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h); d.point((x, y), fill=tuple(int(v * 255) for v in pal('cloth_black', 4)))
    im.save(path); return path


# ============================================================ THE SCENE (metres; x east, y north, the board's north-west corner at 0, 0)
class Scene:
    """the geometry is gathered into one mesh per material (bmesh, no operator calls): a scene of thousands of small pieces
    builds in seconds, and the rig's passes see the same materials"""
    def __init__(s, bpy, V):
        s.bpy = bpy; s.V = V; s.W, s.H = VARIANTS[V]; s.BW, s.BH = s.W * TM, s.H * TM
        s.ys = -s.BH - SOFF                               # the south wall
        s.objs = {'props': [], 'arch': [], 'crowd': []}
        s.rnd = random.Random(4260 if V == 'S' else 4266)
        s.M = {}; s.B = {}

    def m(s, key, role, step, glow=0.0):
        k = (key, role, step, glow)
        if k not in s.M: s.M[k] = P.mat(s.bpy, key, role, step, glow=glow)
        return s.M[k]

    def _bm(s, mat, kind):
        import bmesh
        k = (mat.name, kind)
        if k not in s.B: s.B[k] = [bmesh.new(), mat, kind]
        return s.B[k][0]

    @staticmethod
    def _M(loc, rot=(0, 0, 0), scale=(1, 1, 1)):
        import mathutils
        return (mathutils.Matrix.Translation(loc) @ mathutils.Euler(rot, 'XYZ').to_matrix().to_4x4()
                @ mathutils.Matrix.Diagonal((scale[0], scale[1], scale[2], 1.0)))

    @staticmethod
    def _smooth(verts):
        for f in {f for v in verts for f in v.link_faces}: f.smooth = True

    def box(s, name, mat, size, loc, rot=(0, 0, 0), bevel=0.0, kind='props'):
        import bmesh
        bm = s._bm(mat, kind)
        r = bmesh.ops.create_cube(bm, size=1.0, matrix=s._M(loc, rot, size))
        if bevel and min(size) > 2.5 * bevel:
            try:
                edges = list({e for v in r['verts'] for e in v.link_edges})
                bmesh.ops.bevel(bm, geom=edges, offset=bevel, segments=2, profile=0.5, affect='EDGES')
            except Exception:
                pass

    def cone(s, name, mat, r1, r2, depth, loc, rot=(0, 0, 0), verts=16, kind='props', scale=(1, 1, 1), smooth=True):
        import bmesh
        bm = s._bm(mat, kind)
        r = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts, radius1=r1, radius2=r2, depth=depth, matrix=s._M(loc, rot, scale))
        if smooth: s._smooth(r['verts'])

    def cyl(s, name, mat, r, depth, loc, rot=(0, 0, 0), verts=16, kind='props', scale=(1, 1, 1)):
        s.cone(name, mat, r, r, depth, loc, rot, verts, kind, scale)

    def sphere(s, name, mat, r, loc, scale=(1, 1, 1), seg=12, rings=6, kind='props'):
        import bmesh
        bm = s._bm(mat, kind)
        q = bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=rings, radius=r, matrix=s._M(loc, (0, 0, 0), scale))
        s._smooth(q['verts'])

    def rod(s, name, mat, a, b, r, verts=8, kind='props'):
        import bmesh, mathutils
        a, b = mathutils.Vector(a), mathutils.Vector(b); d = b - a
        if d.length < 1e-6: return
        M = mathutils.Matrix.Translation((a + b) / 2) @ mathutils.Vector((0, 0, 1)).rotation_difference(d).to_matrix().to_4x4()
        q = bmesh.ops.create_cone(s._bm(mat, kind), cap_ends=True, cap_tris=False, segments=verts, radius1=r, radius2=r, depth=d.length, matrix=M)
        s._smooth(q['verts'])

    def disc(s, name, mat, loc, rx, ry, wobble, seed, verts=40, kind='props'):
        """a flat blob on the ground (a stain, a pool of black water), its edge never a circle"""
        import bmesh
        q = bmesh.ops.create_circle(s._bm(mat, kind), cap_ends=True, cap_tris=False, segments=verts, radius=1.0, matrix=s._M(loc))
        rr = random.Random(seed); ph = [rr.uniform(0, 6.28) for _ in range(3)]
        for v in q['verts']:
            dx, dy = v.co.x - loc[0], v.co.y - loc[1]; a = math.atan2(dy, dx)
            k = 1 + wobble * (0.6 * math.sin(3 * a + ph[0]) + 0.4 * math.sin(7 * a + ph[1]) + 0.25 * math.sin(11 * a + ph[2]))
            v.co.x = loc[0] + dx * rx * k; v.co.y = loc[1] + dy * ry * k

    def ring(s, name, mat, loc, R_, r, n=18, sx=1.0, sy=1.0, kind='props'):
        pts = [(loc[0] + R_ * sx * math.cos(2 * math.pi * i / n), loc[1] + R_ * sy * math.sin(2 * math.pi * i / n), loc[2]) for i in range(n + 1)]
        for a, b in zip(pts[:-1], pts[1:]): s.rod(name, mat, a, b, r, verts=8, kind=kind)

    def add(s, o, kind='arch'):
        s.objs[kind].append(o); return o

    def finish(s):
        for (mn, kind), (bm, mat, k) in s.B.items():
            me = s.bpy.data.meshes.new(mn + '_' + kind); bm.to_mesh(me); bm.free()
            o = s.bpy.data.objects.new(mn + '_' + kind, me); s.bpy.context.scene.collection.objects.link(o); o.data.materials.append(mat)
            s.objs[kind].append(o)
        s.B = {}


def proc_mat(bpy, name, kind, c1, c2, c3=None, scale=1.0):
    """a ground or a wall material read in WORLD metres (so joints run on across boxes): kool deck, asphalt, dirt, stucco,
    concrete; colours are palette hexes"""
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = 1.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    geo = nt.nodes.new('ShaderNodeNewGeometry')
    nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.9 * scale; nz.inputs['Detail'].default_value = 6.0
    nt.links.new(geo.outputs['Position'], nz.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = 0.38; ramp.color_ramp.elements[1].position = 0.66
    ramp.color_ramp.elements[0].color = P.lin(c1); ramp.color_ramp.elements[1].color = P.lin(c2)
    nt.links.new(nz.outputs['Fac'], ramp.inputs['Fac'])
    out = ramp.outputs['Color']
    if kind in ('deck', 'stucco', 'conc'):
        br = nt.nodes.new('ShaderNodeTexBrick'); br.offset = 0.0 if kind != 'stucco' else 0.5; br.squash = 1.0
        size = {'deck': 3.0, 'stucco': 1.5, 'conc': 1.5}[kind]
        br.inputs['Scale'].default_value = 1.0 / size; br.inputs['Brick Width'].default_value = 1.0; br.inputs['Row Height'].default_value = 1.0
        br.inputs['Mortar Size'].default_value = 0.012 if kind == 'deck' else 0.006
        br.inputs['Mortar'].default_value = P.lin(c3 or c1)
        nt.links.new(geo.outputs['Position'], br.inputs['Vector'])
        nt.links.new(out, br.inputs['Color1']); nt.links.new(out, br.inputs['Color2']); out = br.outputs['Color']
    if kind == 'deck':                                     # Kool Deck's spatter
        sp = nt.nodes.new('ShaderNodeTexNoise'); sp.inputs['Scale'].default_value = 9.0; sp.inputs['Detail'].default_value = 2.0
        nt.links.new(geo.outputs['Position'], sp.inputs['Vector'])
        mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0.5; mr.inputs['From Max'].default_value = 0.58; mr.clamp = True
        nt.links.new(sp.outputs['Fac'], mr.inputs['Value'])
        mx = nt.nodes.new('ShaderNodeMixRGB'); mx.inputs['Color2'].default_value = P.lin(c3 or c1)
        nt.links.new(out, mx.inputs['Color1']); mx.inputs['Fac'].default_value = 0.3
        ml = nt.nodes.new('ShaderNodeMath'); ml.operation = 'MULTIPLY'; ml.inputs[1].default_value = 0.6     # the spatter is the grit (floor bar B4)
        nt.links.new(mr.outputs['Result'], ml.inputs[0]); nt.links.new(ml.outputs[0], mx.inputs['Fac'])
        out = mx.outputs['Color']
    nt.links.new(out, b.inputs['Base Color'])
    return m


def img_mat(bpy, name, path):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree
    b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = 1.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(path); tx.interpolation = 'Linear'; tx.extension = 'EXTEND'
    nt.links.new(tx.outputs['Color'], b.inputs['Base Color'])
    return m


def quad(bpy, name, pts, uvs, mat):
    me = bpy.data.meshes.new(name); me.from_pydata(pts, [], [(0, 1, 2, 3)]); me.update()
    uv = me.uv_layers.new(name='UVMap')
    for i, l in enumerate(me.loops): uv.data[i].uv = uvs[l.vertex_index]
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); o.data.materials.append(mat)
    return o


def person(sc, x, y, z, rnd, face=0.0):
    """one of the small crowd: legs, a coat or a shirt, a head; the runway black mostly (his 9/4), a few colours"""
    bpy = sc.bpy
    cloth = rnd.choice([('cloth_black', 2), ('cloth_black', 3), ('cloth_black', 2), ('clay_rust', 1), ('metal_painted', 1),
                        ('clay_mustard', 1), ('clay_teal', 1), ('tape_masking', 2), ('cloth_black', 1), ('tape_grey', 1)])
    skin = rnd.choice([('skin_light', 2), ('skin_mid', 2), ('skin_deep', 2), ('skin_mid', 3)])
    tall = rnd.uniform(0.92, 1.08)
    leg = sc.m('legs_black', 'cloth_black', 2) if rnd.random() < 0.7 else sc.m('legs_denim', 'metal_painted', 1)
    body = sc.m('coat_%s%d' % cloth, cloth[0], cloth[1])
    head = sc.m('skin_%s%d' % skin, skin[0], skin[1])
    sc.box('p_legs', leg, (0.34, 0.22, 0.82 * tall), (x, y, z + 0.41 * tall), rot=(0, 0, face), kind='crowd')
    sc.cyl('p_body', body, 0.23, 0.66 * tall, (x, y, z + (0.82 + 0.33) * tall), rot=(0, 0, face), verts=8, kind='crowd')
    sc.sphere('p_head', head, 0.12, (x, y, z + 1.6 * tall), seg=8, rings=5, kind='crowd')
    if rnd.random() < 0.25:   # a hood, a cap
        sc.cyl('p_hat', sc.m('hat', 'cloth_black', 1), 0.13, 0.08, (x, y, z + 1.72 * tall), verts=8, kind='crowd')


def chair(sc, x, y, rot, mat):
    sc.box('seat', mat, (0.48, 0.46, 0.1), (x, y, D + 0.46), rot=(0, 0, rot), bevel=0.02)
    sc.box('back', mat, (0.48, 0.09, 0.55), (x - 0.22 * math.sin(rot), y + 0.22 * math.cos(rot), D + 0.8), rot=(0, 0, rot), bevel=0.02)   # the back on the side away from the pit
    leg = sc.m('chrome', 'chrome', 1)
    for lx, ly in ((-0.19, -0.17), (0.19, -0.17), (-0.19, 0.17), (0.19, 0.17)):
        ca, sa = math.cos(rot), math.sin(rot)
        sc.rod('leg', leg, (x + lx * ca - ly * sa, y + lx * sa + ly * ca, D), (x + lx * ca - ly * sa, y + lx * sa + ly * ca, D + 0.42), 0.016, verts=5)


def palm(sc, x, y, z, rnd, h=None):
    """a dead Washingtonia (the Strip's palm): a straight grey trunk, a brown skirt of dead fronds hanging under a crown gone grey"""
    bpy = sc.bpy; h = h or rnd.uniform(8.0, 11.0); lean = rnd.uniform(-0.25, 0.25)
    trunk = sc.m('palm_trunk', 'tape_grey', 1)
    sc.cone('palm_trunk', trunk, 0.33, 0.22, h, (x + lean / 2, y, z + h / 2), rot=(0, lean / h, 0), verts=10)
    tx, tz = x + lean, z + h
    skirt = sc.m('palm_skirt', 'tape_masking', 1)
    sc.cone('palm_skirt', skirt, 0.75, 0.35, 1.9, (tx, y, tz - 0.9), verts=12)
    dead = [sc.m('frond_dead', 'clay_bone', 1), sc.m('frond_grey', 'tape_grey', 2), sc.m('frond_brown', 'tape_masking', 2)]
    for k in range(11):
        a = k * 2 * math.pi / 11 + rnd.uniform(-0.2, 0.2); droop = rnd.uniform(0.3, 1.2); ln = rnd.uniform(2.4, 3.4)
        mx, my, mz = tx + math.cos(a) * ln / 2 * math.cos(droop), y + math.sin(a) * ln / 2 * math.cos(droop), tz - math.sin(droop) * ln / 2
        sc.box('frond', rnd.choice(dead), (ln, 0.55, 0.04), (mx, my, mz), rot=(0, droop, a))


# ------------------------------------------------------------ the pool and its decks
def build(bpy, V, paint):
    sc = Scene(bpy, V); W, H, BW, BH, ys, rnd = sc.W, sc.H, sc.BW, sc.BH, sc.ys, sc.rnd
    fl = paint['floor']
    floor_m = img_mat(bpy, 'pool_floor', fl['path'])
    fx0, fx1, fy0, fy1 = fl['x0'], fl['x1'], fl['y0'], fl['y1']
    sc.add(quad(bpy, 'pool_floor', [(fx0, fy0, 0), (fx1, fy0, 0), (fx1, fy1, 0), (fx0, fy1, 0)], [(0, 0), (1, 0), (1, 1), (0, 1)], floor_m))
    wall_m = img_mat(bpy, 'pool_wall', paint['wall']['path'])
    sc.add(quad(bpy, 'wall_n', [(0, -0.012, 0), (BW, -0.012, 0), (BW, -0.012, D), (0, -0.012, D)], [(0, 0), (1, 0), (1, 1), (0, 1)], wall_m))
    side = PIT.tiles(bpy, 'pool_tile_side', '#7ea499', '#a4a39b', 6.66)
    for (a, b) in (((0.012, ys, 0), (0.012, 0, 0)), ((BW - 0.012, 0, 0), (BW - 0.012, ys, 0)), ((BW, ys + 0.012, 0), (0, ys + 0.012, 0))):
        sc.add(PIT.mesh(bpy, 'wall', [a, b, (b[0], b[1], D), (a[0], a[1], D)], [(0, 1, 2, 3)], side))
    # THE DECKS: Kool Deck round a Vegas pool, sawn every three metres; solid to the floor so the pool's edge is a wall
    deck = proc_mat(bpy, 'kool_deck', 'deck', '#d6cca7', '#b8a886', '#726451')     # the floor bar (DIRECTION 10/19): bone, never orange
    E = 280.0
    SX, SY = -BH / 2.0, 3.0                                  # the pool steps (west) and the clones' ramp (east), both at mid-pool
    for (x0, x1, y0, y1) in ((-E, BW + E, 0, E), (-E, BW + E, ys - E, ys),
                             (-E, -4.6, ys, 0), (-4.6, 0, SX + SY, 0), (-4.6, 0, ys, SX - SY),
                             (BW + 6.4, BW + E, ys, 0), (BW, BW + 6.4, SX + 2.2, 0), (BW, BW + 6.4, ys, SX - 2.2)):
        sc.box('deck', deck, (x1 - x0, y1 - y0, D), ((x0 + x1) / 2, (y0 + y1) / 2, D / 2), kind='arch')
    # the coping: a bullnose of pale concrete round the lip, chipped; broken where the thing went over it
    cop = sc.m('coping', 'tape_grey', 3)
    g0 = BW * 0.62
    for (x0, x1, y0, y1) in ((-0.42, g0 + 0.2, 0, 0.42), (g0 + 1.9, BW + 0.42, 0, 0.42), (-0.42, BW + 0.42, ys - 0.42, ys),
                             (-0.42, 0, SX + SY, 0), (-0.42, 0, ys, SX - SY), (BW, BW + 0.42, SX + 2.2, 0), (BW, BW + 0.42, ys, SX - 2.2)):
        sc.box('coping', cop, (x1 - x0, y1 - y0, 0.09), ((x0 + x1) / 2, (y0 + y1) / 2, D + 0.045), bevel=0.03)
    for k in range(4):
        sc.box('coping_chunk', cop, (rnd.uniform(0.2, 0.45), rnd.uniform(0.2, 0.35), 0.09), (g0 + 0.4 + k * 0.42, rnd.uniform(0.6, 2.2), D + 0.05), rot=(rnd.uniform(-0.3, 0.3), rnd.uniform(-0.2, 0.2), rnd.uniform(0, 3)))
    # the drag from the broken coping into the cabanas (the wrong thing went this way)
    dried = sc.m('dried', 'blood', 0)
    for k in range(9):
        r_ = rnd.uniform(0.35, 0.6); sc.disc('drag', dried, (g0 + 1.0 + k * 0.25 + rnd.uniform(-0.2, 0.2), 1.2 + k * 1.6, D + 0.006), r_ * 1.4, r_, 0.35, 4260 + k)
    # THE STEPS at the west end, where his men go down: four treads, two chrome rails
    tread = sc.m('step', 'tape_grey', 3); chrome = sc.m('chrome', 'chrome', 1)
    for i in range(4):                                       # each tread a block from the floor up to its own step, the top one at the deck
        top = D - i * D / 4.0
        sc.box('tread', tread, (1.15, 2 * SY, top), (-4.6 + 1.15 * (i + 0.5), SX, top / 2.0), kind='arch')
    for yy in (SX - SY + 0.3, SX + SY - 0.3):
        sc.rod('rail', chrome, (-4.4, yy, D + 0.9), (-1.2, yy, 0.9), 0.03); sc.rod('rail_post', chrome, (-4.4, yy, D), (-4.4, yy, D + 0.9), 0.03)
        sc.rod('rail_post', chrome, (-1.2, yy, 0), (-1.2, yy, 0.9), 0.03)
    # THE CLONES' WAY IN at the east end: a ramp of plywood sheets over a scaffold, down from the deck to the floor, a chain-link gate
    ply = sc.m('ply', 'tape_masking', 2); rust = sc.m('rust', 'clay_rust', 2); steel = sc.m('steel', 'metal_painted', 1)
    ang = math.atan2(D, 6.4); ln = math.hypot(D, 6.4)
    sc.box('ramp', ply, (ln, 4.0, 0.08), (BW + 3.2, SX, D / 2), rot=(0, -ang, 0))
    for k in range(4):
        sc.box('cleat', sc.m('cleat', 'tape_masking', 1), (0.08, 3.9, 0.06), (BW + 1.2 + k * 1.4, SX, (1.2 + k * 1.4) * D / 6.4 + 0.07), rot=(0, -ang, 0))
    for yy in (SX - 2.1, SX + 2.1):
        sc.rod('gate_post', steel, (BW + 6.6, yy, D), (BW + 6.6, yy, D + 2.4), 0.05)
    sc.rod('gate_top', steel, (BW + 6.6, SX - 2.1, D + 2.4), (BW + 6.6, SX + 2.1, D + 2.4), 0.04)
    mesh_m = sc.m('chainlink', 'tape_grey', 1)
    sc.box('gate_mesh', mesh_m, (0.02, 1.9, 2.2), (BW + 6.75, SX + 1.05, D + 1.15), rot=(0, 0, 0.6))   # one leaf swung open
    sc.box('gate_mesh', mesh_m, (0.02, 2.0, 2.2), (BW + 6.62, SX - 1.05, D + 1.15))
    # THE LADDER on the north wall, bent outward by something that climbed it (the town's pit has it too)
    lx = BW * 0.3
    for dx in (-0.3, 0.3):
        x = lx + dx; s_ = 1 if dx > 0 else -1
        pts = [(x, 0.3, D + 0.05), (x, 0.1, D + 0.6), (x, -0.15, D + 0.3), (x + 0.05 * s_, -0.3, D - 0.7), (x + 0.2 * s_, -0.42, 0.6)]
        for a, b in zip(pts[:-1], pts[1:]): sc.rod('ladder', chrome, a, b, 0.03)
    for z in (D - 0.6, D - 1.2):
        sc.rod('rung', chrome, (lx - 0.3, -0.24, z), (lx + 0.3, -0.24, z), 0.025)
    return sc


def on_floor(sc, V, L):
    """the things standing on the board's own tiles, each inside its tile"""
    bpy, rnd = sc.bpy, sc.rnd
    # THE SWIM-UP BLACKJACK BAR (a real Strip pool thing): a tiled island, a granite top, the felt rotted, concrete stools round it
    x, y = tile_xy(L['bar'])
    isl = PIT.tiles(bpy, 'bar_tile', '#4f6f6a', '#a4a39b', 6.66)
    sc.cyl('bar_island', isl, 1.0, 1.15, (x, y + 0.6, 0.575), verts=32, scale=(3.4, 2.0, 1.0))
    sc.cyl('bar_top', sc.m('granite', 'tape_grey', 2), 1.0, 0.12, (x, y + 0.6, 1.21), verts=32, scale=(3.75, 2.3, 1.0))
    for k in range(3):
        sc.box('felt', sc.m('felt', 'clay_teal', 2), (1.3, 0.75, 0.02), (x - 1.8 + k * 1.8, y - 0.55, 1.28), rot=(0, 0, rnd.uniform(-0.1, 0.1)))
    for k in range(11):
        a = (k + 0.5) * 2 * math.pi / 11
        sc.cyl('stool', sc.m('stool', 'tape_grey', 3), 0.3, 0.72, (x + 4.35 * math.cos(a), y + 0.6 + 2.85 * math.sin(a), 0.36), verts=12)
        sc.cyl('stool_top', sc.m('stool_top', 'clay_teal', 3), 0.33, 0.06, (x + 4.35 * math.cos(a), y + 0.6 + 2.85 * math.sin(a), 0.75), verts=12)
    sc.rod('umbrella_stub', sc.m('rust', 'clay_rust', 2), (x + 0.4, y + 0.9, 1.27), (x + 0.4, y + 0.9, 3.1), 0.05)
    # THE LOUNGERS THE CROWD THREW IN, a heap of white plastic, and a beach umbrella on its side
    x, y = tile_xy(L['heap']); white = sc.m('lounger', 'tape_grey', 4); stripe = sc.m('umbrella', 'clay_mustard', 3)
    for k in range(40):
        a = rnd.uniform(0, math.pi); dx, dy = rnd.gauss(0, 2.2), rnd.gauss(0, 1.6); z = 0.15 + max(0.0, 1.6 - math.hypot(dx, dy) * 0.4) * rnd.uniform(0.3, 1.0)
        sc.box('lounger', white, (1.95, 0.68, 0.07), (x + dx, y + dy, z), rot=(rnd.uniform(-0.5, 0.5), rnd.uniform(-0.4, 0.4), a))
        sc.box('lounger_back', white, (0.7, 0.66, 0.06), (x + dx + 0.8 * math.cos(a), y + dy + 0.8 * math.sin(a), z + 0.25), rot=(0, 0.9, a))
    sc.cone('umbrella', stripe, 1.4, 0.05, 0.7, (x + 2.4, y - 1.6, 0.7), rot=(1.3, 0, 0.6), verts=12)
    sc.cone('umbrella', sc.m('umbrella_b', 'clay_rust', 3), 1.3, 0.05, 0.6, (x - 2.6, y + 1.2, 1.1), rot=(-1.1, 0.3, 2.2), verts=12)
    # a dead palm the wind put in the pool, lying across the tile with its crown
    pa, pl = rnd.uniform(0.35, 0.6), 10.0
    x0p, y0p = x - pl / 2 * math.cos(pa), y - pl / 2 * math.sin(pa)
    sc.rod('fallen_trunk', sc.m('palm_trunk', 'tape_grey', 1), (x0p, y0p, 0.3), (x0p + pl * math.cos(pa), y0p + pl * math.sin(pa), 0.25), 0.3, verts=10)
    for k in range(9):
        b = pa + rnd.uniform(-1.4, 1.4); ln = rnd.uniform(2.2, 3.2); ex, ey = x0p + pl * math.cos(pa), y0p + pl * math.sin(pa)
        sc.box('frond', sc.m('frond_dead', 'clay_bone', 1), (ln, 0.5, 0.04), (ex + ln / 2 * math.cos(b), ey + ln / 2 * math.sin(b), 0.2 + rnd.uniform(0, 0.4)), rot=(rnd.uniform(-0.3, 0.3), rnd.uniform(-0.2, 0.2), b))
    # THE BLACK WATER over the main drain (rain, a broken main: nobody knows), trash floating in it
    x, y = tile_xy(L['puddle'])
    sc.disc('black_water', sc.m('black_water', 'clay_teal', 0), (x, y, 0.012), 4.3, 3.2, 0.2, 4263)
    for k in range(6):
        sc.box('flotsam', sc.m('lounger', 'tape_grey', 4) if k % 2 else sc.m('cup', 'clay_rust', 2), (0.25, 0.18, 0.03), (x + rnd.uniform(-2.5, 2.5), y + rnd.uniform(-1.6, 1.6), 0.03), rot=(0, 0, rnd.uniform(0, 3)))
    for k in range(2):
        sc.box('drain_grate', sc.m('grate', 'rubber', 1), (0.7, 0.7, 0.03), (x - 2.0 + k * 4.0, y + 3.0, 0.015))
    hx, hy = TM * 1.6, -TM * 0.7; pts = []
    for i in range(60):
        u = i / 59.0; pts.append((hx + u * TM * 3.4, hy - u * TM * 2.2 + 1.8 * math.sin(u * 9.0), 0.08))
    for a_, b_ in zip(pts[:-1], pts[1:]): sc.rod('hose', sc.m('hose', 'clay_teal', 3), a_, b_, 0.08, verts=6)
    sc.box('cleaner', sc.m('cleaner', 'tape_grey', 4), (0.7, 0.5, 0.35), (pts[-1][0] + 0.4, pts[-1][1], 0.18), rot=(0, 0, 0.6), bevel=0.06)
    # THE SAND, a low drift with the wind's ripples painted under it
    for t in L['sand']:
        x, y = tile_xy(t)
        for k in range(5):
            sc.sphere('sand', sc.m('sand', 'clay_bone', 2), 1.0, (x + rnd.uniform(-2.5, 2.5), y + rnd.uniform(-2, 2), 0.0), scale=(rnd.uniform(1.8, 3.4), rnd.uniform(1.4, 2.6), rnd.uniform(0.1, 0.2)), seg=16, rings=8)


def north(sc):
    """the north deck (the bookie's side): the ropes, the crowd on casino chairs, the poles and the bulbs, the sign, the board; the
    cabanas and the palms; the hotel wing's balconies; the tower"""
    bpy, rnd, BW = sc.bpy, sc.rnd, sc.BW
    brass = sc.m('stand_brass', 'clay_mustard', 1); rope = sc.m('velvet', 'clay_rust', 1); tape = sc.m('duct_tape', 'tape_grey', 2)
    def ropes(x0, x1, y, gap=None, broken=()):
        xs = [x0 + (x1 - x0) * i / max(1, int((x1 - x0) / 2.6)) for i in range(int((x1 - x0) / 2.6) + 1)]
        for i, x in enumerate(xs):
            if gap and gap[0] < x < gap[1]: continue
            sc.cyl('stand_base', brass, 0.17, 0.05, (x, y, D + 0.025), verts=12); sc.rod('stand_post', brass, (x, y, D + 0.05), (x + rnd.uniform(-0.06, 0.06), y, D + 0.98), 0.028)
        for i, (a, b) in enumerate(zip(xs[:-1], xs[1:])):
            if gap and (gap[0] < a < gap[1] or gap[0] < b < gap[1]): continue
            n = 5; pts = [(a + (b - a) * j / n, y, D + 0.9 - 0.2 * math.sin(math.pi * j / n)) for j in range(n + 1)]
            if i in broken: pts = pts[:3] + [(pts[2][0] + 0.06, y - 0.05, D + 0.12)]
            for p, q in zip(pts[:-1], pts[1:]): sc.rod('rope', rope, p, q, 0.032, verts=6)
            if rnd.random() < 0.35: sc.cyl('tape_wrap', tape, 0.05, 0.14, pts[len(pts) // 2], rot=(0, math.pi / 2, 0), verts=8)
    sc.ropes = ropes
    g0 = BW * 0.62
    ropes(-1.0, BW + 1.0, 1.5, gap=(g0 - 0.4, g0 + 2.6), broken=(5, 17))
    chair_ms = [sc.m('chair_red', 'clay_rust', 2), sc.m('chair_gold', 'clay_mustard', 2), sc.m('chair_teal', 'clay_teal', 2), sc.m('chair_black', 'cloth_black', 3)]
    # the small crowd: a few clusters on chairs in two rows, others standing behind; gaps where nobody comes any more
    for cl in range(9):
        cx = rnd.uniform(4, BW - 4)
        if abs(cx - (g0 + 1)) < 6: continue
        for k in range(rnd.randint(3, 8)):
            x = cx + rnd.uniform(-5, 5); row = rnd.choice((0, 0, 1)); y = 3.0 + row * 1.5 + rnd.uniform(-0.15, 0.15)
            rot = rnd.uniform(-0.3, 0.3)
            chair(sc, x, y, rot, rnd.choice(chair_ms))
            if rnd.random() < 0.8: person(sc, x, y - 0.05, D + 0.42, rnd)
        for k in range(rnd.randint(2, 7)):
            person(sc, cx + rnd.uniform(-6, 6), rnd.uniform(6.5, 10.5), D, rnd)
    # THE BOOKIE: a blackjack table off the casino floor, his chalkboard on an easel, a cashbox; he is in the town, not here
    bx, by = BW * 0.1, 11.5
    sc.cyl('bj_felt', sc.m('felt', 'clay_teal', 2), 1.6, 0.08, (bx, by, D + 0.9), verts=24, scale=(1.0, 0.6, 1.0))
    sc.box('bj_base', sc.m('bj_wood', 'clay_rust', 1), (2.6, 1.0, 0.86), (bx, by + 0.15, D + 0.43))
    sc.box('cashbox', sc.m('steel', 'metal_painted', 1), (0.4, 0.3, 0.2), (bx + 0.6, by, D + 1.04))
    cb = img_mat(bpy, 'chalkboard', chalkboard(os.path.join(OUT, 'chalkboard.png')))
    cx_, cy_, cz_ = bx + 3.0, by - 0.1, D + 1.55
    sc.add(quad(bpy, 'board_face', [(cx_ - 0.8, cy_ - 0.1, cz_ - 0.6), (cx_ + 0.8, cy_ - 0.1, cz_ - 0.6), (cx_ + 0.8, cy_ + 0.1, cz_ + 0.6), (cx_ - 0.8, cy_ + 0.1, cz_ + 0.6)], [(0, 0), (1, 0), (1, 1), (0, 1)], cb), 'props')
    for dx in (-0.7, 0.7): sc.rod('easel', sc.m('post_wood', 'clay_bone', 1), (bx + 3.0 + dx, by - 0.4, D), (bx + 3.0 + dx * 0.8, by, D + 2.2), 0.04)
    # THE POLES, the bulb strings along the north rim (three bulbs of a dozen alive), the PA horn, the breaker box and its belt
    pole_m = sc.m('pole_wood', 'clay_bone', 1); wire = sc.m('wire', 'tape_grey', 0)
    glass_dead = sc.m('bulb_dead', 'tape_grey', 1); glass_live = sc.m('bulb_live', 'sodium', 4, glow=0.6)
    poles = [(BW * f, 0.9) for f in (0.04, 0.36, 0.68, 0.98)]
    PH = 7.0
    for k, (x, y) in enumerate(poles):
        sc.cyl('pole', pole_m, 0.14, PH, (x, y, D + PH / 2), verts=10); sc.box('cross', sc.m('steel', 'metal_painted', 1), (1.4, 0.1, 0.1), (x, y, D + PH - 0.3))
        if k in (1, 3):
            sc.cone('pa_horn', sc.m('horn', 'tape_grey', 2), 0.35, 0.08, 0.6, (x + 0.3, y - 0.2, D + PH - 0.1), rot=(math.radians(70), 0, math.radians(-25)), verts=12)
        if k == 0:
            sc.box('breaker', sc.m('panel', 'metal_painted', 2), (0.5, 0.18, 0.7), (x, y - 0.2, D + 1.5), bevel=0.01)
            for z in (1.32, 1.68): sc.box('belt', sc.m('belt', 'cloth_black', 3), (0.6, 0.24, 0.06), (x, y - 0.16, D + z))
    live_at = {(0, 3), (1, 7), (2, 2)}
    for k, (a, b) in enumerate(zip(poles[:-1], poles[1:])):
        A = (a[0] + 0.6, a[1], D + PH - 0.3); B = (b[0] - 0.6, b[1], D + PH - 0.3); n = 12
        pts = [(A[0] + (B[0] - A[0]) * i / n, A[1] - 0.6 * math.sin(math.pi * i / n), A[2] - 1.4 * math.sin(math.pi * i / n)) for i in range(n + 1)]
        for p, q in zip(pts[:-1], pts[1:]): sc.rod('bulb_wire', wire, p, q, 0.018, verts=5)
        for i, p in enumerate(pts[1:-1], 1):
            sc.sphere('bulb', glass_live if (k, i) in live_at else glass_dead, 0.11, (p[0], p[1], p[2] - 0.14), seg=10, rings=6)
    # the scoreboard on the second pole, half its digits dead
    x, y = poles[1]
    sc.box('scoreboard', sc.m('scoreboard', 'cloth_black', 1), (2.0, 0.14, 0.95), (x + 1.2, y - 0.1, D + 4.4), bevel=0.02)
    for i, on in enumerate((1, 0, 1, 1, 0, 0, 1, 1)):
        if on: sc.box('digit', sc.m('digits', 'blood', 1, glow=1.2), (0.14, 0.03, 0.42), (x + 0.45 + i * 0.22, y - 0.18, D + 4.4))
    # the sign, painted by hand on a sheet of ply: THE PIT
    sm = img_mat(bpy, 'sign_paint', PIT.sign_texture(os.path.join(OUT, 'pit_sign.png')))
    sx = BW * 0.52
    for dx in (-2.2, 2.2): sc.rod('sign_post', pole_m, (sx + dx, 12.5, D), (sx + dx, 12.5, D + 3.6), 0.07)
    sc.add(quad(bpy, 'sign', [(sx - 2.3, 12.38, D + 1.45), (sx + 2.3, 12.4, D + 1.45), (sx + 2.3, 12.44, D + 3.75), (sx - 2.3, 12.42, D + 3.75)], [(0, 0), (1, 0), (1, 1), (0, 1)], sm), 'props')
    sc.box('sign_back', sc.m('ply', 'tape_masking', 2), (4.7, 0.04, 2.4), (sx, 12.46, D + 2.6))
    # THE CABANAS (canvas gone to rags, one fallen) and the dead palms between them
    canv = [sc.m('canvas_a', 'clay_mustard', 3), sc.m('canvas_b', 'clay_rust', 3), sc.m('canvas_c', 'tape_masking', 3)]
    post = sc.m('cabana_post', 'tape_grey', 3)
    for k in range(int((BW + 60) / 9)):
        x = -30 + k * 9 + rnd.uniform(-0.5, 0.5); y = 19.0
        fallen = rnd.random() < 0.18
        for (dx, dy) in ((-2, -2), (2, -2), (-2, 2), (2, 2)):
            sc.rod('cab_post', post, (x + dx, y + dy, D), (x + dx + (0.6 if fallen else 0), y + dy, D + (1.4 if fallen else 3.0)), 0.07, verts=6)
        if fallen:
            sc.box('canvas', rnd.choice(canv), (4.4, 4.2, 0.05), (x + 0.6, y, D + 1.2), rot=(0.08, 0.5, rnd.uniform(-0.1, 0.1)))
        else:
            sc.box('canvas', rnd.choice(canv), (4.3, 4.3 * rnd.uniform(0.55, 1.0), 0.05), (x, y + rnd.uniform(-0.6, 0.6), D + 3.05), rot=(rnd.uniform(-0.06, 0.06), rnd.uniform(-0.06, 0.06), 0))
            if rnd.random() < 0.6:
                sc.box('lounger', sc.m('lounger', 'tape_grey', 4), (1.95, 0.68, 0.07), (x, y - 0.6, D + 0.35), rot=(0, 0, rnd.uniform(-0.2, 0.2)))
        if k % 2 == 0: palm(sc, x + 4.5, 15.5, D, rnd)
    # THE HOTEL WING: four floors of rooms with balconies over the pool; a door open, a towel still on a rail
    stucco = proc_mat(bpy, 'stucco', 'stucco', '#e0b58a', '#cfa47c', '#9a4f2c')
    wy0, wy1, wh = 28.0, 42.0, 13.5
    sc.box('wing', stucco, (BW + 200, wy1 - wy0, wh), (BW / 2, (wy0 + wy1) / 2, D + wh / 2), kind='arch')
    sc.box('wing_roof', sc.m('roof', 'tape_grey', 2), (BW + 200, wy1 - wy0, 0.3), (BW / 2, (wy0 + wy1) / 2, D + wh + 0.15), kind='arch')
    door = sc.m('glass_dark', 'glass_eye', 1); slab = sc.m('slab', 'tape_grey', 3); rail = sc.m('rail', 'metal_painted', 2)
    towel = [sc.m('towel_a', 'clay_teal', 3), sc.m('towel_b', 'clay_mustard', 3), sc.m('towel_c', 'tape_grey', 4)]
    for fl in range(4):
        z = D + 0.4 + fl * 3.2
        for k in range(int((BW + 160) / 4.2)):
            x = -80 + k * 4.2
            sc.box('door', door, (2.2, 0.1, 2.3), (x, wy0 - 0.03, z + 1.25), kind='arch')
            if fl > 0:
                sc.box('balcony', slab, (3.6, 1.5, 0.18), (x, wy0 - 0.75, z), kind='arch')
                sc.box('balcony_rail', rail, (3.6, 0.06, 1.0), (x, wy0 - 1.48, z + 0.55), kind='arch')
                if rnd.random() < 0.06: sc.box('towel', rnd.choice(towel), (0.9, 0.05, 0.7), (x + rnd.uniform(-1, 1), wy0 - 1.53, z + 0.75))
    # THE TOWER over it all, its windows in bands, one curtain hanging out of a broken one
    tz = 70.0; ty0, ty1 = 64.0, 86.0
    sc.box('tower', stucco, (BW + 40, ty1 - ty0, tz), (BW / 2, (ty0 + ty1) / 2, D + tz / 2), kind='arch')
    for fl in range(int(tz / 3.1)):
        sc.box('band', door, (BW + 40.2, 0.2, 1.5), (BW / 2, ty0 - 0.05, D + 2.2 + fl * 3.1), kind='arch')
    for k in range(int((BW + 40) / 6) + 1):
        sc.box('fin', stucco, (0.5, 0.6, tz), (BW / 2 - (BW + 40) / 2 + k * 6, ty0 - 0.3, D + tz / 2), kind='arch')
    sc.box('curtain', sc.m('curtain', 'clay_rust', 3), (1.2, 0.05, 4.5), (BW * 0.71, ty0 - 0.4, D + 2.2 + 9 * 3.1 - 1.6), rot=(0.1, 0, 0.05))
    rustm, ply_t = sc.m('rust_run', 'clay_rust', 1), sc.m('ply', 'tape_masking', 2)
    for k in range(60):                                       # a window here and there boarded, a panel gone to the dark behind it
        x = BW / 2 - (BW + 40) / 2 + rnd.uniform(1, BW + 39); fl = rnd.randint(0, int(tz / 3.1) - 1)
        sc.box('boarded', ply_t if k % 3 else sc.m('hole', 'cloth_black', 0), (rnd.uniform(1.5, 4.5), 0.25, 1.4), (x, ty0 - 0.2, D + 2.2 + fl * 3.1), kind='arch')
    for k in range(22):                                       # rust run down from the ledges
        x = BW / 2 - (BW + 40) / 2 + rnd.uniform(1, BW + 39); z0 = rnd.uniform(10, tz)
        sc.box('rust_run', rustm, (rnd.uniform(0.4, 1.2), 0.08, rnd.uniform(4, 14)), (x, ty0 - 0.12, D + z0 - 4), kind='arch')
    # behind the wing: the guests' lot, asphalt to the edge of the picture, the cars where they were left; a second, older tower
    asph = proc_mat(bpy, 'asphalt_n', 'dirt', '#3e3c3a', '#4a4845')
    sc.box('lot', asph, (BW + 560, 260.0, 0.05), (BW / 2, wy1 + 1 + 130.0, D + 0.025), kind='arch')
    sc.box('lawn', proc_mat(bpy, 'dirt', 'dirt', '#786348', '#a08a64'), (BW + 60, ty0 - wy1 - 1, 0.07), (BW / 2, (wy1 + ty0) / 2, D + 0.035), kind='arch')
    lane = sc.m('lane_paint', 'tape_grey', 3)
    car_ms = [sc.m('car_%d' % i, r_, s_) for i, (r_, s_) in enumerate((('metal_painted', 2), ('clay_teal', 2), ('clay_rust', 2), ('tape_grey', 3), ('clay_mustard', 2), ('cloth_black', 3), ('tape_grey', 2)))]
    for row in range(6):
        yy = wy1 + 6 + row * 7.0
        for k in range(46):
            x = -150 + k * 3.0
            if -32 < x < BW + 32 and yy > ty0 - 4: continue
            sc.box('stall', lane, (0.12, 5.0, 0.01), (x, yy, D + 0.055), kind='arch')
            if rnd.random() < 0.3: sc.box('car', rnd.choice(car_ms), (1.85, 4.6, 0.75), (x + 1.5, yy, D + 0.6), rot=(0, 0, rnd.uniform(-0.08, 0.08)), bevel=0.08)
    old = proc_mat(bpy, 'stucco_old', 'stucco', '#d6cca7', '#c4b996', '#726451')
    sc.box('tower_old', old, (34.0, 20.0, 46.0), (-78.0, 76.0, D + 23.0), kind='arch')
    for fl in range(14):
        sc.box('band_old', door, (34.2, 0.2, 1.3), (-78.0, 65.95, D + 2.0 + fl * 3.2), kind='arch')


def south(sc):
    """the south deck (the crowd's side): the ropes, the chairs facing north, the standing crowd, the empty lifeguard chair, the
    poles far enough back that they never stand over the board; the fence, the dead garden, the Boulevard and its stalled cars"""
    bpy, rnd, BW, ys = sc.bpy, sc.rnd, sc.BW, sc.ys
    sc.ropes(-1.0, BW + 1.0, ys - 1.6, broken=(9,))
    chair_ms = [sc.m('chair_red', 'clay_rust', 2), sc.m('chair_gold', 'clay_mustard', 2), sc.m('chair_teal', 'clay_teal', 2), sc.m('chair_black', 'cloth_black', 3)]
    for cl in range(10):
        cx = rnd.uniform(3, BW - 3)
        for k in range(rnd.randint(3, 9)):
            x = cx + rnd.uniform(-5, 5); row = rnd.choice((0, 0, 1)); y = ys - 3.2 - row * 1.5 + rnd.uniform(-0.15, 0.15)
            rot = math.pi + rnd.uniform(-0.3, 0.3)
            chair(sc, x, y, rot, rnd.choice(chair_ms))
            if rnd.random() < 0.8: person(sc, x, y + 0.05, D + 0.42, rnd)
            elif row == 1: person(sc, x, y, D + 0.46 + 0.4, rnd)                 # standing on his chair to see, in the back row only
        for k in range(rnd.randint(3, 8)):
            person(sc, cx + rnd.uniform(-6, 6), ys - rnd.uniform(6.2, 10.5), D, rnd)
    # the lifeguard chair, empty, its rescue tube still on the hook
    lx, ly = BW * 0.86, ys - 7.5; white = sc.m('lounger', 'tape_grey', 4)
    for dx in (-0.6, 0.6):
        sc.rod('lg_leg', white, (lx + dx, ly - 0.6, D), (lx + dx * 0.6, ly, D + 2.4), 0.06); sc.rod('lg_leg', white, (lx + dx, ly + 0.6, D), (lx + dx * 0.6, ly, D + 2.4), 0.06)
    sc.box('lg_seat', white, (1.0, 0.7, 0.12), (lx, ly, D + 2.45)); sc.box('lg_back', white, (1.0, 0.1, 0.8), (lx, ly - 0.35, D + 2.9))
    sc.box('lg_tube', sc.m('tube', 'clay_rust', 3), (0.15, 0.12, 1.0), (lx + 0.55, ly + 0.1, D + 1.8), rot=(0, 0.2, 0))
    # the south poles, 11 m back (a pole nearer than that would stand over his men in the bottom row)
    pole_m = sc.m('pole_wood', 'clay_bone', 1); wire = sc.m('wire', 'tape_grey', 0)
    glass_dead = sc.m('bulb_dead', 'tape_grey', 1)
    for x in (BW * 0.15, BW * 0.85):
        sc.cyl('pole', pole_m, 0.14, 7.0, (x, ys - 11.5, D + 3.5), verts=10)
    # THE GENERATOR they cannot always feed, at the deck's south-east corner, its jerrycans and the cable along the deck
    gx, gy = BW + 9.0, ys - 4.5
    sc.box('generator', sc.m('generator', 'clay_mustard', 1), (1.8, 1.0, 1.1), (gx, gy, D + 0.6), bevel=0.04)
    sc.box('gen_frame', sc.m('steel', 'metal_painted', 1), (1.9, 1.1, 0.1), (gx, gy, D + 1.2))
    for k in range(4):
        sc.box('jerrycan', sc.m('jerry', 'clay_rust', 2), (0.2, 0.38, 0.46), (gx - 1.3 + k * 0.28, gy + 0.9, D + 0.23), rot=(0, 0, rnd.uniform(-0.3, 0.3)), bevel=0.02)
    for i in range(10):
        a = (gx - 1.0 - i * 2.4, gy + 0.3 + math.sin(i) * 0.4, D + 0.02); b = (gx - 1.0 - (i + 1) * 2.4, gy + 0.3 + math.sin(i + 1) * 0.4, D + 0.02)
        sc.rod('cable', sc.m('cable', 'rubber', 0), a, b, 0.03, verts=5)
    # THE FENCE, the dead garden, the sidewalk, THE BOULEVARD (six lanes, a median of dead palms, the cars where they stopped)
    fy = ys - 17.0; iron = sc.m('iron', 'cloth_black', 2)
    sc.box('fence_rail', iron, (BW + 200, 0.06, 0.06), (BW / 2, fy, D + 1.5), kind='arch'); sc.box('fence_rail', iron, (BW + 200, 0.06, 0.06), (BW / 2, fy, D + 0.15), kind='arch')
    for k in range(int((BW + 200) / 0.9)):
        if rnd.random() < 0.04: continue
        sc.box('picket', iron, (0.04, 0.04, 1.5), (-100 + k * 0.9, fy, D + 0.8), kind='arch')
    dirt = proc_mat(bpy, 'dirt', 'dirt', '#786348', '#a08a64')
    sc.box('garden', dirt, (BW + 200, 13.0, 0.06), (BW / 2, fy - 7.5, D + 0.03), kind='arch')
    for k in range(int((BW + 160) / 11)):
        palm(sc, -80 + k * 11 + rnd.uniform(-1.5, 1.5), fy - rnd.uniform(4, 10), D, rnd)
        if rnd.random() < 0.6:
            sc.sphere('shrub', sc.m('shrub', 'clay_bone', 1), 1.0, (-80 + k * 11 + 5, fy - rnd.uniform(3, 11), D + 0.3), scale=(rnd.uniform(0.8, 1.6), rnd.uniform(0.7, 1.3), 0.6), seg=10, rings=6)
    walk = proc_mat(bpy, 'sidewalk', 'conc', '#a4a39b', '#b4b2a9', '#666360')
    sy0 = fy - 14.0
    sc.box('sidewalk', walk, (BW + 300, 5.0, 0.15), (BW / 2, sy0 - 2.5, D + 0.075), kind='arch')
    asph = proc_mat(bpy, 'asphalt', 'dirt', '#3e3c3a', '#4a4845')
    ry1, ry0 = sy0 - 5.0, sy0 - 45.0
    sc.box('boulevard', asph, (BW + 300, ry1 - ry0, 0.05), (BW / 2, (ry0 + ry1) / 2, D + 0.025), kind='arch')
    lane = sc.m('lane_paint', 'tape_grey', 3); yel = sc.m('lane_yellow', 'clay_mustard', 2)
    mid = (ry0 + ry1) / 2
    sc.box('median', sc.m('curb', 'tape_grey', 2), (BW + 300, 4.0, 0.25), (BW / 2, mid, D + 0.12), kind='arch')
    for k in range(int((BW + 280) / 14)):
        palm(sc, -120 + k * 14 + rnd.uniform(-1, 1), mid, D + 0.25, rnd, h=rnd.uniform(9, 12))
    for ly in (ry1 - 6.7, ry1 - 13.3, mid + 6.6, mid - 6.6, ry0 + 13.3, ry0 + 6.7):
        for k in range(int((BW + 280) / 9)):
            if rnd.random() < 0.3: continue
            sc.box('dash', lane, (3.0, 0.15, 0.01), (-120 + k * 9, ly, D + 0.055), kind='arch')
    for yy in (mid + 2.2, mid - 2.2): sc.box('yellow', yel, (BW + 280, 0.15, 0.01), (BW / 2, yy, D + 0.055), kind='arch')
    car_ms = [sc.m('car_%d' % i, r_, s_) for i, (r_, s_) in enumerate((('metal_painted', 2), ('clay_teal', 2), ('clay_rust', 2), ('tape_grey', 3), ('clay_mustard', 2), ('cloth_black', 3), ('tape_grey', 2)))]
    glass = sc.m('glass_dark', 'glass_eye', 1)
    for k in range(26):
        x = rnd.uniform(-100, BW + 100); lane_y = rnd.choice((ry1 - 3.3, ry1 - 10, ry1 - 16.7, mid - 3.3 - 3.3, mid - 10, ry0 + 3.3))
        a = rnd.uniform(-0.25, 0.25) + (0 if rnd.random() < 0.5 else math.pi)
        m_ = rnd.choice(car_ms)
        sc.box('car', m_, (4.6, 1.85, 0.75), (x, lane_y, D + 0.6), rot=(0, 0, a), bevel=0.08)
        sc.box('cabin', glass if rnd.random() < 0.5 else m_, (2.3, 1.6, 0.55), (x - 0.2 * math.cos(a), lane_y - 0.2 * math.sin(a), D + 1.22), rot=(0, 0, a), bevel=0.06)
    # THE MARQUEE by the Boulevard: the resort's sign on its pylon, dark, its letters gone, one panel hanging
    mx_, my_ = -26.0, sy0 - 2.5
    sc.box('pylon', sc.m('pylon', 'tape_grey', 2), (2.6, 2.6, 34.0), (mx_, my_, D + 17.0), kind='arch')
    sc.box('marquee', sc.m('marquee', 'clay_mustard', 2), (16.0, 2.2, 8.0), (mx_, my_ - 0.2, D + 30.0), bevel=0.2)
    sc.box('marquee_face', sc.m('marquee_dark', 'cloth_black', 2), (14.6, 0.2, 6.4), (mx_, my_ - 1.35, D + 30.0))
    for k in range(9):
        if rnd.random() < 0.55: sc.box('bulb_row', sc.m('bulb_dead', 'tape_grey', 1), (0.25, 0.15, 0.25), (mx_ - 7.4 + k * 1.85, my_ - 1.4, D + 33.6))
    sc.box('board_hanging', sc.m('marquee_dark', 'cloth_black', 2), (5.0, 0.2, 2.2), (mx_ + 3.0, my_ - 1.6, D + 23.0), rot=(0, 0.35, 0))
    sc.box('reader', sc.m('reader', 'tape_grey', 4), (12.0, 0.6, 3.0), (mx_, my_ - 0.2, D + 21.5))
    # a bus slewed across two lanes where it ran dry
    sc.box('bus', sc.m('bus', 'tape_grey', 4), (12.0, 2.6, 2.9), (BW * 0.3, ry1 - 12.0, D + 1.8), rot=(0, 0, 0.35), bevel=0.1)
    sc.box('bus_band', sc.m('bus_band', 'clay_teal', 2), (12.05, 2.62, 0.5), (BW * 0.3, ry1 - 12.0, D + 2.4), rot=(0, 0, 0.35))
    # across the Boulevard: the next resort's porte-cochere and its podium roof
    walk2 = proc_mat(bpy, 'sidewalk2', 'conc', '#a4a39b', '#b4b2a9', '#666360')
    sc.box('sidewalk', walk2, (BW + 300, 5.0, 0.15), (BW / 2, ry0 - 2.5, D + 0.075), kind='arch')
    pod = proc_mat(bpy, 'podium', 'conc', '#cac9c1', '#b8b6ad', '#8a8880')
    sc.box('podium', pod, (BW + 300, 60.0, 9.0), (BW / 2, ry0 - 5.0 - 30.0, D + 4.5), kind='arch')
    panel, frame, shard = sc.m('solar', 'glass_eye', 1), sc.m('solar_frame', 'tape_grey', 2), sc.m('solar_shard', 'tape_grey', 3)
    py0 = ry0 - 12.0
    for row in range(7):
        for k in range(int((BW + 160) / 2.4)):
            x = -80 + k * 2.4; y = py0 - row * 5.5
            r_ = rnd.random()
            if r_ < 0.22: continue                                                       # gone: only its legs
            sc.box('solar_leg', frame, (0.08, 0.08, 1.0), (x, y + 0.5, D + 9.5))
            if r_ < 0.42:
                sc.box('solar_broken', shard, (2.1, 1.6, 0.04), (x, y, D + 9.6), rot=(rnd.uniform(-0.5, 0.5), rnd.uniform(-0.3, 0.3), rnd.uniform(-0.4, 0.4)))
            else:
                sc.box('solar', panel, (2.2, 1.9, 0.05), (x, y, D + 10.1), rot=(0.45, 0, 0))
    for k in range(14):
        sc.box('hvac', sc.m('hvac', 'tape_grey', 2), (rnd.uniform(2, 5), rnd.uniform(2, 4), rnd.uniform(1, 2)), (rnd.uniform(-100, BW + 100), ry0 - rnd.uniform(15, 60), D + 9.5), kind='arch')


def east_west(sc):
    """east: the clones' cages beside their ramp, the spa, the pump house, the parking garage; west: our men's bench, the palapa
    bar, the loungers in rows, the west wing"""
    bpy, rnd, BW, BH, ys = sc.bpy, sc.rnd, sc.BW, sc.BH, sc.ys
    rust = sc.m('rust', 'clay_rust', 2); ply = sc.m('ply', 'tape_masking', 2); tarp = sc.m('tarp', 'clay_teal', 1)
    SX = -BH / 2.0
    # THE CAGES: rebar boxes on the east deck, chain-link patched with a tarp and a sheet of ply; one door hangs open, empty
    for k, cy in enumerate((SX + 9.0, SX + 4.6, SX - 4.6, SX - 9.0)):
        if not (ys + 2 < cy < -2): continue
        x = BW + 9.5; w, d, h = 3.2, 3.6, 2.4
        for (ex, ey) in ((-w / 2, -d / 2), (w / 2, -d / 2), (-w / 2, d / 2), (w / 2, d / 2)):
            sc.rod('cage_post', rust, (x + ex, cy + ey, D), (x + ex, cy + ey, D + h), 0.05, verts=6)
        for z in (D + 0.08, D + h):
            for (a, b) in (((-w / 2, -d / 2), (w / 2, -d / 2)), ((w / 2, -d / 2), (w / 2, d / 2)), ((w / 2, d / 2), (-w / 2, d / 2)), ((-w / 2, d / 2), (-w / 2, -d / 2))):
                sc.rod('cage_rail', rust, (x + a[0], cy + a[1], z), (x + b[0], cy + b[1], z), 0.04, verts=6)
        for i in range(1, 9):
            yy = cy - d / 2 + d * i / 9
            if k == 2 and 3 < i < 7: continue                                  # the open one
            sc.rod('bar', rust, (x - w / 2, yy, D + 0.08), (x - w / 2, yy, D + h), 0.022, verts=5)
        sc.box('cage_floor', sc.m('cage_dark', 'rubber', 1), (w, d, 0.04), (x, cy, D + 0.02))
        sc.box('cage_roof', ply if k % 2 else tarp, (w * 0.7, d * 0.65, 0.04), (x + 0.2, cy + 0.3, D + h + 0.04), rot=(0.04, -0.05, 0.1))
        if k == 0:   # something in this one: a hulk lying down, a lab clone, too big for the cage
            sc.sphere('clone', sc.m('clone_hide', 'tape_masking', 1), 1.0, (x + 0.1, cy, D + 0.65), scale=(1.3, 1.6, 0.62), seg=16, rings=8)
            sc.sphere('clone_head', sc.m('clone_hide', 'tape_masking', 1), 0.45, (x - 0.5, cy - 1.55, D + 0.75), seg=12, rings=6)
    # the spa (drained, round, raised) and the pump house
    sc.cyl('spa_wall', PIT.tiles(bpy, 'spa_tile', '#7ea499', '#a4a39b', 6.66), 3.4, 0.55, (BW + 26, -8.0, D + 0.275), verts=32)
    sc.cyl('spa_floor', sc.m('spa_floor', 'tape_masking', 1), 3.0, 0.04, (BW + 26, -8.0, D + 0.57), verts=32)
    cmu = proc_mat(bpy, 'cmu', 'conc', '#a4a39b', '#9a988f', '#666360')
    sc.box('pump_house', cmu, (7.0, 5.0, 3.2), (BW + 26, ys + 4.0, D + 1.6), kind='arch')
    sc.box('pump_roof', sc.m('roof', 'tape_grey', 2), (7.4, 5.4, 0.2), (BW + 26, ys + 4.0, D + 3.3), kind='arch')
    for k in range(3): palm(sc, BW + 17 + k * 7, ys + 14 + k * 9, D, rnd)
    # THE PARKING GARAGE: four open decks, its columns, cars left on the roof
    gx0, gx1, gy0, gy1 = BW + 42, BW + 170, ys - 30, 40
    conc = proc_mat(bpy, 'garage', 'conc', '#a4a39b', '#9a988f', '#666360')
    for lv in range(4):
        z = D + lv * 3.3
        sc.box('g_slab', conc, (gx1 - gx0, gy1 - gy0, 0.35), ((gx0 + gx1) / 2, (gy0 + gy1) / 2, z + 0.17), kind='arch')
        sc.box('g_parapet', conc, (gx1 - gx0, 0.3, 1.0), ((gx0 + gx1) / 2, gy0 + 0.15, z + 0.85), kind='arch')
        sc.box('g_parapet', conc, (0.3, gy1 - gy0, 1.0), (gx0 + 0.15, (gy0 + gy1) / 2, z + 0.85), kind='arch')
    for i in range(int((gx1 - gx0) / 9)):
        for j in range(int((gy1 - gy0) / 9)):
            sc.box('g_col', conc, (0.6, 0.6, 3.3 * 3), (gx0 + 4.5 + i * 9, gy0 + 4.5 + j * 9, D + 3.3 * 1.5), kind='arch')
    car_ms = [sc.m('car_%d' % i, r_, s_) for i, (r_, s_) in enumerate((('metal_painted', 2), ('clay_teal', 2), ('clay_rust', 2), ('tape_grey', 3), ('clay_mustard', 2), ('cloth_black', 3), ('tape_grey', 2)))]
    for k in range(18):
        x, y = rnd.uniform(gx0 + 4, gx1 - 4), rnd.uniform(gy0 + 4, gy1 - 4); a = rnd.choice((math.pi / 2, -math.pi / 2)) + rnd.uniform(-0.2, 0.2)
        sc.box('car', rnd.choice(car_ms), (4.6, 1.85, 0.75), (x, y, D + 9.9 + 0.6), rot=(0, 0, a), bevel=0.08)
    # WEST: our men's bench and water barrel by the steps; the loungers in rows; the palapa bar; the west wing
    sc.box('bench', sc.m('bench_wood', 'tape_masking', 2), (0.5, 3.0, 0.08), (-7.0, SX + 6.0, D + 0.45))
    for dy in (-1.2, 1.2): sc.box('bench_leg', sc.m('steel', 'metal_painted', 1), (0.4, 0.08, 0.45), (-7.0, SX + 6.0 + dy, D + 0.22))
    sc.cyl('barrel', sc.m('barrel', 'clay_teal', 2), 0.32, 0.9, (-7.2, SX + 8.2, D + 0.45), verts=14)
    for k in range(3): person(sc, -9.0 - k * 1.2, SX - 6 + k * 0.8, D, rnd)
    white = sc.m('lounger', 'tape_grey', 4)
    for row in range(3):
        for k in range(10):
            if rnd.random() < 0.3: continue
            x, y = -14.0 - row * 3.2, ys + 6 + k * 5.4
            if y > -2: continue
            a = math.pi / 2 + rnd.uniform(-0.15, 0.15) + (rnd.uniform(-1.4, 1.4) if rnd.random() < 0.15 else 0)
            sc.box('lounger', white, (1.95, 0.68, 0.07), (x, y, D + 0.35), rot=(0, 0, a)); sc.box('lounger_back', white, (0.7, 0.66, 0.06), (x - 0.8 * math.cos(a), y - 0.8 * math.sin(a), D + 0.6), rot=(0, -0.9, a))
    px, py = -34.0, SX - 4.0
    sc.cone('thatch', sc.m('thatch', 'clay_bone', 2), 7.0, 0.3, 3.2, (px, py, D + 5.0), verts=14)
    for k in range(6):
        a = k * math.pi / 3; sc.rod('palapa_post', sc.m('post_wood', 'clay_bone', 1), (px + 4.5 * math.cos(a), py + 4.5 * math.sin(a), D), (px + 4.5 * math.cos(a), py + 4.5 * math.sin(a), D + 3.6), 0.14)
    sc.ring('bar_ring', sc.m('bj_wood', 'clay_rust', 1), (px, py, D + 1.1), 3.0, 0.4)
    for k in range(4): palm(sc, -24 - k * 9, 10 - k * 6, D, rnd)
    stucco = bpy.data.materials.get('stucco') or proc_mat(bpy, 'stucco', 'stucco', '#e0b58a', '#cfa47c', '#9a4f2c')
    sc.box('west_wing', stucco, (16.0, 120.0, 13.5), (-70.0, ys + 20.0, D + 6.75), kind='arch')
    sc.box('west_roof', sc.m('roof', 'tape_grey', 2), (16.2, 120.2, 0.3), (-70.0, ys + 20.0, D + 13.6), kind='arch')
    for k in range(10):
        sc.box('hvac', sc.m('hvac', 'tape_grey', 2), (rnd.uniform(1.5, 3), rnd.uniform(1.5, 3), rnd.uniform(0.8, 1.6)), (-70 + rnd.uniform(-5, 5), ys + rnd.uniform(-35, 75), D + 14.2), kind='arch')


# ============================================================ THE RENDER
def region(V, which):
    """the picture's ground, in metres, and its size in pixels: the board and a tile round it at the fight's pixels, or the whole
    ring (ten tiles round) at a quarter of them"""
    W, H = VARIANTS[V]
    if which == 'board':
        cols, rows, ax0, ay0, k = W + 2, H + 2, -1, -1, 1
    else:
        AW, AH = W + 2 * RING, H + 2 * RING
        cols, rows = int(math.ceil(AW / BT)) * BT, int(math.ceil(AH / BT)) * BT
        ax0, ay0, k = -RING, -RING, RS
    X0 = ax0 * TM; X1 = X0 + cols * TM
    V1 = -ay0 * ROWV; V0 = V1 - rows * ROWV
    return dict(X0=X0, X1=X1, V0=V0, V1=V1, cols=cols, rows=rows, wpx=int(round(cols * TPX[0] / k)), hpx=int(round(rows * TPX[1] / k)), k=k, ax0=ax0, ay0=ay0)


def render(V, which, quick=False):
    import bpy, mathutils
    os.makedirs(OUT, exist_ok=True)
    paint = dict(floor=floor_paint(V, os.path.join(OUT, '%s_floor.png' % V)), wall=wall_paint(V, os.path.join(OUT, '%s_wall.png' % V)))
    bpy.ops.wm.read_factory_settings(use_empty=True); sc_ = bpy.context.scene
    sc = build(bpy, V, paint); on_floor(sc, V, LAYOUT[V]); north(sc); south(sc); east_west(sc)
    sc.finish()
    allm = [o for k in ('props', 'arch', 'crowd') for o in sc.objs[k] if o.type == 'MESH']
    RIG.source_pass(allm, float(RIG.G['wear']), 1.0, 3)
    RIG.dent_pass([o for o in sc.objs['props'] if o.type == 'MESH'], 1.0)
    print('scene: %d objects, %d props meshes, %d faces' % (len(allm), len(sc.objs['props']), sum(len(o.data.polygons) for o in allm)))
    stretch = bpy.data.objects.new('stretch', None); sc_.collection.objects.link(stretch); stretch.scale = (1, 1, ZS)
    for o in list(sc_.objects):
        if o.parent is None and o is not stretch and o.type in ('MESH', 'EMPTY'): o.parent = stretch
    RIG.light_and_film(sc_, dict(sun_rot=list(RIG.G['sun_rot_deg'])))
    sc_.render.film_transparent = False
    g = region(V, which)
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = g['X1'] - g['X0']
    cam = bpy.data.objects.new('cam', cd); sc_.collection.objects.link(cam); sc_.camera = cam
    t = math.radians(TILT); cam.rotation_euler = (t, 0, 0)
    vc = (g['V0'] + g['V1']) / 2
    look = mathutils.Vector(((g['X0'] + g['X1']) / 2, vc / C, 0)); dvec = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    cam.location = look - dvec * 500; cd.clip_start = 1.0; cd.clip_end = 1500
    sc_.render.resolution_x, sc_.render.resolution_y = g['wpx'], g['hpx']; sc_.render.resolution_percentage = 25 if quick else 100
    sc_.cycles.samples = 6 if quick else (40 if which == 'board' else 32); sc_.cycles.use_adaptive_sampling = True; sc_.cycles.adaptive_threshold = 0.03
    sc_.cycles.max_bounces = 3; sc_.cycles.diffuse_bounces = 1; sc_.cycles.glossy_bounces = 0; sc_.cycles.transmission_bounces = 0
    sc_.cycles.threads = os.cpu_count() or 4
    for m in bpy.data.materials:
        if m.use_nodes:
            for nd in m.node_tree.nodes:
                if nd.type in ('AMBIENT_OCCLUSION', 'BEVEL'): nd.samples = 1
    crop = CROP.get('box')
    if crop:                                               # a piece at full size, to look at (never shipped)
        sc_.render.resolution_percentage = 100; sc_.render.use_border = True; sc_.render.use_crop_to_border = True
        sc_.render.border_min_x, sc_.render.border_min_y, sc_.render.border_max_x, sc_.render.border_max_y = crop
    fn = os.path.join(OUT, '%s_%s%s.png' % (V, which, '_crop' if crop else '_quick' if quick else ''))
    sc_.render.filepath = fn; bpy.ops.render.render(write_still=True)
    return fn, g


# ============================================================ THE CUT: 5 x 5-tile pictures and the laid board the fight reads
def ship(V):
    from PIL import Image
    W, H = VARIANTS[V]; AW, AH = W + 2 * RING, H + 2 * RING
    os.makedirs(SHIP, exist_ok=True)
    for f in os.listdir(SHIP):
        if f.startswith(V + '_'): os.remove(os.path.join(SHIP, f))
    gb, gr = region(V, 'board'), region(V, 'ring')
    board = Image.open(os.path.join(OUT, '%s_board.png' % V)).convert('RGB')
    ring = Image.open(os.path.join(OUT, '%s_ring.png' % V)).convert('RGB')
    assert board.size == (gb['wpx'], gb['hpx']), (board.size, gb)
    # WHAT SHIPS (rule 418, light as a flash game): the fight shows the pit upright at
    # about a quarter of the render's pixels (a 515 px tile on 117 device px) and sideways at about a half (on 240), so the board
    # and the tile round it ship at HALF (one picture pixel to a device pixel sideways) and the ring at a FIFTH (the fight dims it
    # and bakes it at half its glass size anyway); every piece cut on the render's own tile lines, then resized
    def cut(img, tw, th, cols, rows, k, q, name):
        n = 0
        for j in range(int(math.ceil(rows / BT))):
            for i in range(int(math.ceil(cols / BT))):
                box = (int(round(i * BT * tw)), int(round(j * BT * th)), int(round((i + 1) * BT * tw)), int(round((j + 1) * BT * th)))
                full = Image.new('RGB', (box[2] - box[0], box[3] - box[1]), (0, 0, 0))
                full.paste(img.crop((box[0], box[1], min(img.width, box[2]), min(img.height, box[3]))), (0, 0))
                blk = full.resize((int(round(BT * TPX[0] / k)), int(round(BT * TPX[1] / k))), Image.LANCZOS)
                p = os.path.join(SHIP, '%s_%s%d%d.webp' % (V, name, i, j)); blk.save(p, 'WEBP', quality=q, method=6); n += os.path.getsize(p)
        return n
    b0 = RING - 1   # the board's pictures start one tile north-west of the board (area tile RING-1, RING-1)
    sizes = cut(board, TPX[0], TPX[1], gb['cols'], gb['rows'], BOARD_K, 74, 'b')
    sizes += cut(ring, TPX[0] / RS, TPX[1] / RS, gr['cols'], gr['rows'], RING_SHIP_K, 70, 'r')
    ground = []
    for ay in range(AH):
        for ax in range(AW):
            bx, by = ax - b0, ay - b0
            if 0 <= bx < W + 2 and 0 <= by < H + 2:
                ground.append('../arena/pit/%s_b%d%d.webp#%d,%d' % (V, bx // BT, by // BT, bx % BT, by % BT))   # read from slices/fight_ground/
            else:
                ground.append('../arena/pit/%s_r%d%d.webp#%d,%d' % (V, ax // BT, ay // BT, ax % BT, ay % BT))
    L = LAYOUT[V]
    terrain = [['flat'] * W for _ in range(H)]
    terrain[L['bar'][1]][L['bar'][0]] = 'blocked'; terrain[L['heap'][1]][L['heap'][0]] = 'debris'
    terrain[L['puddle'][1]][L['puddle'][0]] = 'water'
    for t in L['sand']: terrain[t[1]][t[0]] = 'rough'
    return dict(W=W, H=H, ring=RING, AW=AW, AH=AH, terrain=terrain, ground=ground, lights=[], bytes=sizes,
                things={'bar': L['bar'], 'heap': L['heap'], 'puddle': L['puddle'], 'sand': L['sand']})


def write_json(vs):
    meta = dict(_what='THE PIT\'S OWN BOARD (ARENA 2, VAMILY rule 426(f), ask line 497; Paolo 11/6: \'The arena map is so fucking ugly bro\'). '
                     'A laid board (COMBAT TWO\'s format: ground[ay * AW + ax] = picture#col,row, the board at area tile ring, ring), one per '
                     'pool size; the fight picks the smallest that holds both lines (slices/BOHEMIA_FIGHT.html __THE_ARENA__ arenaPit). '
                     'The pictures are one render of one scene (tools/bohemia_arena_the_pit_board.py): the pool floor is the board, its walls '
                     'are the edges; the terrain says what the picture shows (the swim-up bar BLOCKED, the loungers DEBRIS, the black water '
                     'WATER, the sand ROUGH).',
                source='tools/bohemia_arena_the_pit_board.py', tile_px=TPX, ring=RING, deck_m=D, draft=True, variants=vs)
    json.dump(meta, open(SHIP_JSON, 'w'), separators=(',', ':'))
    print('wrote', SHIP_JSON, {k: (v['W'], v['H'], v['bytes']) for k, v in vs.items()})


def check():
    """the arena gate's leg G (gates/the_arena_gate.js): the shipped board is whole. Prints 'ok' and its numbers, or every fault."""
    import base64, io
    from PIL import Image
    sys.path.insert(0, os.path.join(R, 'gates'))
    import bohemia_purity_gate as PUR
    bad, says = [], []
    try: J = json.load(open(SHIP_JSON))
    except Exception as e: print('NO FILE', e); return 1
    vs = J.get('variants', {})
    if sorted(vs) != sorted(VARIANTS): bad.append('pools %s, want %s' % (sorted(vs), sorted(VARIANTS)))
    for V, v in sorted(vs.items()):
        W, H = VARIANTS.get(V, (0, 0))
        if (v['W'], v['H'], v['AW'], v['AH'], v['ring']) != (W, H, W + 2 * RING, H + 2 * RING, RING): bad.append(V + ' size')
        if len(v['ground']) != v['AW'] * v['AH']: bad.append(V + ' ground %d of %d' % (len(v['ground']), v['AW'] * v['AH']))
        pics = sorted({g.split('#')[0] for g in v['ground']})
        at = lambda q: os.path.normpath(os.path.join(R, 'slices/fight_ground', q))     # the fight reads a ground picture from its ground folder
        miss = [q for q in pics if not os.path.exists(at(q))]
        if miss: bad.append(V + ' missing ' + ', '.join(miss[:3]))
        t = v['terrain']; kinds = {k for r in t for k in r}
        if len(t) != H or any(len(r) != W for r in t): bad.append(V + ' terrain shape')
        if not kinds <= {'flat', 'rough', 'debris', 'water', 'blocked'}: bad.append(V + ' terrain kinds %s' % sorted(kinds))
        th = v.get('things', {})
        for k_, want in (('bar', 'blocked'), ('heap', 'debris'), ('puddle', 'water')):
            x, y = th.get(k_, (-1, -1))
            if not (0 <= y < H and 0 <= x < W and t[y][x] == want): bad.append('%s %s is not %s' % (V, k_, want))
        # no blocked tile on a line's column, whatever the card (the columns the fight sets: rule 79's cut, centred)
        for cd in (1, 2):
            for ed in (1, 2):
                span = cd + 5 + ed - 1; cf = max(0, (W - span) // 2) + cd - 1
                for col in range(cf - cd + 1, cf + 1): bad += ['%s blocked on his line col %d' % (V, col)] if any(t[y][col] == 'blocked' for y in range(H)) else []
                for col in range(cf + 5, cf + 5 + ed): bad += ['%s blocked on their line col %d' % (V, col)] if any(t[y][col] == 'blocked' for y in range(H)) else []
        # ONE PICTURE: the board laid tile for tile the way the fight lays it (every ground entry's piece of its picture) is the
        # one render it was cut from; a seam would be a line where the laid board and the render part company. Measured as the
        # mean difference along every line the fight cuts on (every 5 tiles), over the median along all the other tile lines
        ring_src = Image.open(os.path.join(OUT, '%s_ring.png' % V)).convert('RGB') if os.path.exists(os.path.join(OUT, '%s_ring.png' % V)) else None
        cache, tw4, th4 = {}, 128, 91
        comp = Image.new('RGB', (v['AW'] * tw4, v['AH'] * th4))
        for ay in range(v['AH']):
            for ax in range(v['AW']):
                g = v['ground'][ay * v['AW'] + ax]; q, cr = g.split('#'); c_, r_ = (int(z) for z in cr.split(','))
                if q not in cache: cache[q] = Image.open(at(q)).convert('RGB')
                im = cache[q]; sw, sh = im.width / BT, im.height / BT
                comp.paste(im.crop((int(round(c_ * sw)), int(round(r_ * sh)), int(round((c_ + 1) * sw)), int(round((r_ + 1) * sh)))).resize((tw4, th4), Image.BILINEAR), (ax * tw4, ay * th4))
        # a seam is a step across a cut line that the pixels either side of it do not have; the pool's own walls lie on lines
        # by design (the board's edges, RING and RING + W across, RING and RING + H down) and are real edges, so they are left out
        A = np.asarray(comp).astype(np.float32)
        def ratio(axis, n, step, walls):
            out = []
            for k in range(1, n):
                if not (k % BT == 0 or (k - (RING - 1)) % BT == 0) or k in walls: continue
                x = k * step
                sl = (lambda a, b: np.abs(A[:, a] - A[:, b]).mean()) if axis == 1 else (lambda a, b: np.abs(A[a] - A[b]).mean())
                out.append((sl(x - 1, x) / max(2.0, (sl(x - 2, x - 1) + sl(x, x + 1)) / 2.0), k))   # under two levels a step is the encoder, not a seam
            return out
        seams = [r_[0] for r_ in ratio(1, v['AW'], tw4, {RING, RING + W}) + ratio(0, v['AH'], th4, {RING, RING + H})]
        if ring_src is not None:
            ref = np.asarray(ring_src.crop((0, 0, int(round(v['AW'] * TPX[0] / RS)), int(round(v['AH'] * TPX[1] / RS)))).resize(comp.size, Image.BILINEAR)).astype(np.float32)
            says.append('%s the laid board against the render it was cut from: mean difference %.1f levels' % (V, float(np.abs(A - ref).mean())))
        for q in pics:
            buf = io.BytesIO(); cache.get(q, Image.open(at(q)).convert('RGB')).save(buf, 'PNG')
            strict, suspect, pur = PUR.check_png(base64.b64encode(buf.getvalue()))
            if strict > 0 or pur > 0: bad.append('%s purple %d lava %d' % (q, pur, strict))
        worst = max(seams) if seams else 0.0
        if worst > 2.5: bad.append('%s a seam where the picture is cut: %.2f x the other tile lines' % (V, worst))
        # the board is the pool: the floor's tiles read aqua (green and blue over red), the ring round it does not
        b00 = np.asarray(Image.open(at('../arena/pit/%s_b00.webp' % V)).convert('RGB')).astype(np.float32)
        tw_, th_ = b00.shape[1] / BT, b00.shape[0] / BT                       # a tile in the shipped picture
        fl = b00[int(th_ * 1.1):int(th_ * 2), int(tw_ * 1.1):int(tw_ * 3)].reshape(-1, 3).mean(0)
        if not (fl[1] > fl[0] and fl[2] > fl[0]): bad.append('%s the floor is not the pool (%s)' % (V, fl.round()))
        says.append('%s %dx%d: %d pictures, %.1f MB, seams worst %.2f x, floor rgb %s, terrain %s' % (V, W, H, len(pics), v.get('bytes', 0) / 1e6, worst, fl.round().astype(int).tolist(),
                                                                                                    {k: sum(r.count(k) for r in t) for k in sorted(kinds)}))
    print('\n'.join(says))
    print('ok' if not bad else 'BAD: ' + ' | '.join(bad))
    return 0 if not bad else 1


CROP = {}
if __name__ == '__main__':
    if '--check' in sys.argv: sys.exit(check())
    a = sys.argv[1:]
    if '--crop' in a: CROP['box'] = tuple(float(v) for v in a[a.index('--crop') + 1].split(','))
    quick = '--quick' in a
    vs = [a[a.index('--variant') + 1]] if '--variant' in a else list(VARIANTS)
    whiches = ['board'] if '--board-only' in a else ['ring'] if '--ring-only' in a else ['board', 'ring']
    if '--ship-only' not in a:
        for V in vs:
            for wh in whiches:
                print(render(V, wh, quick))
    if '--ship' in a or '--ship-only' in a:
        out = {}
        if os.path.exists(SHIP_JSON):
            try: out = json.load(open(SHIP_JSON)).get('variants', {})
            except Exception: out = {}
        for V in vs: out[V] = ship(V)
        write_json(out)
