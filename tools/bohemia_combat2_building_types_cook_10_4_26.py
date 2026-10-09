#!/usr/bin/env python3
"""MANY MORE BUILDING TYPES  (COMBAT 2 [floor set] round fourteen, rule 67)

PAOLO, HIS SIXTH VOTES (10/2): 'we need so much more building types' -- the suburb house was the only
building on every board but the strip mall. The board names the list: strip stores, apartments, a
church, a school, a gas station, a motel, a warehouse, the casino back. All of them, at 45, this round.

ONE BUILDER, EIGHT BUILDINGS. A building is a footprint (width x depth in metres), a height, a roof and
a face, and the 45 camera does the rest exactly as it did for the house (round seven): the roof plane
is depth x cos45 tall, the face that looks at the camera is height x cos45, the shadow falls south-east.
Taller buildings stand UP INTO THE ROW BEHIND THEM, the way a 45 camera shows a tall thing (a sprite,
bottom on its own tile; the block composites back to front), so a three-storey block is three storeys
and not a squashed house.

  APARTMENTS    24 x 11 m, three storeys, flat roof with parapet and AC boxes, a grid of his windows
                (some boarded), an open stair, a door per stack.
  CHURCH        12 x 18 m, a steep gable whose triangular end faces the camera, a bell tower, the
                double door, two tall windows; stucco and his terracotta.
  SCHOOL        30 x 12 m, one long storey and a half, flat roof, a ribbon of classroom windows, the
                double doors, a bare flagpole.
  GAS STATION   the canopy on four posts over the pump islands (pumps drawn), the little store behind
                it, the asphalt apron; the price sign blank.
  MOTEL         30 x 9 m, one storey, a walkway along the face with a door and a window per room, the
                office at the end, the empty pool in front.
  WAREHOUSE     30 x 20 m, a low metal roof of corrugated steel, roll-up doors on the dock face.
  CASINO BACK   36 x 14 m, the blank service wall of a Strip casino: loading docks, ducts, a dumpster
                row, no windows; the side of the city tourists never saw.
  STRIP STORE   round eight's store front, now one of the set.

AND THE BLOCKS THAT USE THEM: MAIN STREET (gas station, motel, church across the street from the
school and the apartments) and THE WORKS (warehouses, the casino's back, a yard of containers). Both
fit the board's street rows, so they mix with the suburb blocks (round eleven) and the streets run
through (round twelve). Terrain: every footprint is 'blocked'; the flat roofs of the school and the
apartments are 'height' (rule 37g: high ground is a roof you can stand on).

WHAT IS PROVED, NOT CLAIMED (each refuses the run): every building's pixels are his (the 7/28 ramps and
tiles, the desert, water and sprite banks), no two buildings the same picture, each block passes round
three's guard (tile size, colours, placements, no stamped tile).

THE ANALOG HORROR LINE (rule 20): the church's door is the only one on main street that is not boarded.
Nobody in the valley will say who keeps it that way.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES: roof planes first, then the face -- the one rule every building here
        is built from.
  TG-04 THE STREET TILE: every block meets its street with the same walk and kerb.
  CGRD-01 INTO THE BREACH: each type has ONE silhouette you can name from the far zoom (the canopy, the
        gable and tower, the long ribbon of windows, the corrugated slab).
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east.
  REUSE CHECK: his 7/28 roof, wall, window, boarded, door and garage tiles, his deck, his ramps; the
  45 math, the lot, the drives, the walks and the guard from rounds two to twelve, imported.

[bb the battle map] reference/library/battle_brothers/02_COMBAT_RULES.md: a settlement fight in Battle
  Brothers is fought among buildings of several kinds, and the kinds are what make the board read. OURS:
  the kinds are a Vegas main street after the money stopped.

    python3 tools/bohemia_combat2_building_types_cook_10_4_26.py
      -> banks/BOHEMIA_THE_BUILDING_TYPES_10_4_26.txt
      -> slices/vote/COMBAT2_BUILDING_TYPES_10_4.png
"""
import importlib, json, os, sys
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
MX = importlib.import_module('bohemia_combat2_mixed_blocks_cook_10_2_26')
S8, H7, R5, R4, B, F, K, CV = MX.S8, MX.H7, MX.R5, MX.R4, MX.B, MX.F, MX.K, MX.CV
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_THE_BUILDING_TYPES_10_4_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_BUILDING_TYPES_10_4.png'
m, shade, die, TILE = K.m, K.shade, K.die, H7.TILE
A, C, T, ST, D = B.A, B.C, B.T, K.RAMPS['stucco'], K.RAMPS['deck']
PX, PY, N, ty, M = B.PX, B.PY, B.N, B.ty, B.M


def dress(v, w, h, seed): return K.dress(v, max(1, w), max(1, h), seed)


def put(im, key, x, y, w, h):
    t = TILE(key).resize((max(1, w), max(1, h)), Image.NEAREST); im.paste(t, (x, y))


def shell(w_m, d_m, h_m, roof, seed):
    """The 45 box: roof plane d_m x cos45, then the face h_m x cos45. Returns the RGBA sprite and the
       face rectangle (x0, top, x1, base) so each type draws its own face."""
    W, rh, fh = m(w_m), ty(m(d_m)), ty(m(h_m))
    extra = ty(m(4.0)) if roof in ('gable', 'tower') else 0
    sh = m(1.4)
    im = Image.new('RGBA', (W + sh, extra + rh + fh + sh), (0, 0, 0, 0))
    top = extra
    d = ImageDraw.Draw(im)
    d.polygon([(sh // 2, top + rh + fh), (W, top + rh + fh), (W + sh, top + rh + fh + sh), (sh, top + rh + fh + sh)], fill=A[2] + (255,))
    d.polygon([(W, top + sh // 3), (W + sh, top + sh), (W + sh, top + rh + fh + sh), (W, top + rh + fh)], fill=A[2] + (255,))
    if roof == 'flat':
        im.paste(dress(['roof_deck'], W, rh, seed).convert('RGBA'), (0, top))
        pt = max(3, ty(m(0.4)))
        d.rectangle([0, top, W, top + pt], fill=ST[4] + (255,)); d.rectangle([0, top + rh - pt, W, top + rh], fill=ST[3] + (255,))
        d.rectangle([0, top, m(0.4), top + rh], fill=ST[4] + (255,)); d.rectangle([W - m(0.4), top, W, top + rh], fill=ST[3] + (255,))
        shade(im, (m(0.4), top + pt, W - m(0.4), top + pt + ty(m(0.8))), 0.8)
    elif roof == 'metal':
        d.rectangle([0, top, W, top + rh], fill=C[4] + (255,))
        for x in range(0, W, m(0.3)):
            d.line([(x, top), (x, top + rh)], fill=C[2] + (255,)); d.line([(x + 1, top), (x + 1, top + rh)], fill=C[6] + (255,))
        shade(im, (0, top, W, top + rh // 2), 0.86)
        r = K.R(seed)
        for _ in range(int(w_m * 2)):
            rx, ry = r.i(W), top + r.i(rh)
            d.rectangle([rx, ry, rx + m(0.4), ry + m(0.15)], fill=T[1 + r.i(2)] + (255,))
    elif roof in ('hip', 'gable', 'tower'):
        im.paste(dress(['roof_slope'], W, rh, seed).convert('RGBA'), (0, top))
        shade(im, (0, top, W, top + rh // 3), 0.80)
    face_top = top + rh
    im.paste(dress(['wall_0', 'wall_1', 'wall_2'], W, fh, seed + 1).convert('RGBA'), (0, face_top))
    shade(im, (0, face_top, W, face_top + ty(m(0.5))), 0.8)
    d.line([(0, face_top + fh - 1), (W, face_top + fh - 1)], fill=C[1] + (255,), width=3)
    return im, (0, face_top, W, face_top + fh), top


def windows(im, box, rows, cols, seed, boarded=0.25, wh=(1.4, 1.3), margin=1.0):
    x0, ft, x1, fb = box
    r = K.R(seed)
    fh = fb - ft
    for rr in range(rows):
        y = ft + int(fh * (rr + 0.25) / rows)
        for c in range(cols):
            x = x0 + m(margin) + int((x1 - x0 - 2 * m(margin)) * c / max(1, cols))
            put(im, 'wall_boarded' if r() < boarded else 'wall_window', x, y, m(wh[0]), max(6, int(fh / rows * 0.55)))


def apartments(seed):
    im, box, _ = shell(24, 11, 9.0, 'flat', seed)
    windows(im, box, 3, 10, seed + 2)
    d = ImageDraw.Draw(im); x0, ft, x1, fb = box
    sx = x0 + m(11.0)                                                  # the open stair
    d.rectangle([sx, ft, sx + m(2.0), fb], fill=A[1] + (255,))
    for k in range(9): d.line([(sx, fb - k * (fb - ft) // 9), (sx + m(2.0), fb - k * (fb - ft) // 9 - 6)], fill=C[4] + (255,), width=2)
    for rr in range(1, 3): d.rectangle([x0, ft + rr * (fb - ft) // 3 - 3, x1, ft + rr * (fb - ft) // 3], fill=C[5] + (255,))   # the walkways
    for ax in (m(4), m(16)): d.rectangle([ax, ty(m(3)), ax + m(1.2), ty(m(3)) + ty(m(1.0))], fill=C[5] + (255,))           # AC boxes
    return im


def church(seed):
    im, box, top = shell(12, 18, 6.0, 'gable', seed)
    d = ImageDraw.Draw(im); x0, ft, x1, fb = box
    W = x1 - x0
    gh = ty(m(5.0))                                                    # the gable end, facing the camera
    d.polygon([(x0, ft), (x0 + W // 2, ft - gh), (x1, ft)], fill=ST[3] + (255,))
    d.line([(x0, ft), (x0 + W // 2, ft - gh), (x1, ft)], fill=T[1] + (255,), width=4)
    tx = x1 - m(3.2)                                                   # the bell tower
    d.rectangle([tx, ft - gh - ty(m(3.5)), tx + m(2.6), fb], fill=ST[2] + (255,))
    d.polygon([(tx - 4, ft - gh - ty(m(3.5))), (tx + m(1.3), ft - gh - ty(m(7.0))), (tx + m(2.6) + 4, ft - gh - ty(m(3.5)))], fill=T[2] + (255,))
    d.rectangle([tx + m(0.7), ft - gh - ty(m(2.6)), tx + m(1.9), ft - gh - ty(m(1.2))], fill=A[0] + (255,))   # the empty belfry
    shade(im, (tx + m(1.3), ft - gh - ty(m(3.5)), tx + m(2.6), fb), 0.82)
    put(im, 'door_top', x0 + W // 2 - m(1.3), fb - int((fb - ft) * 0.7), m(2.6), int((fb - ft) * 0.7))
    for wx in (x0 + m(1.2), x0 + W // 2 + m(2.0)):
        if wx + m(1.0) < tx: d.rectangle([wx, ft + m(0.4), wx + m(1.0), fb - m(0.8)], fill=A[1] + (255,))
    return im


def school(seed):
    im, box, _ = shell(30, 12, 4.5, 'flat', seed)
    windows(im, box, 1, 14, seed + 3, boarded=0.35, margin=1.4)
    d = ImageDraw.Draw(im); x0, ft, x1, fb = box
    put(im, 'door_top', x0 + m(14.0), fb - int((fb - ft) * 0.8), m(2.4), int((fb - ft) * 0.8))
    fx = x1 - m(1.0)                                                   # the bare flagpole
    d.line([(fx, ft - ty(m(7))), (fx, fb)], fill=C[5] + (255,), width=3)
    return im


def gas_station(seed):
    W, rh, fh = m(20), ty(m(10)), ty(m(4.5))
    sh = m(1.4)
    im = Image.new('RGBA', (W + sh, rh + fh + ty(m(8)) + sh), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    store, _, _ = shell(12, 7, 3.2, 'flat', seed)                      # the little store, behind
    im.paste(store, (m(4), 0), store)
    cy = ty(m(6.0))                                                    # the canopy, on four posts, in front
    ch = ty(m(8)); cf = ty(m(0.9))
    d.rectangle([0, cy, W, cy + ch], fill=C[5] + (255,))
    d.rectangle([0, cy + ch, W, cy + ch + cf], fill=T[3] + (255,))     # the fascia, his terracotta, faded
    d.line([(0, cy), (W, cy)], fill=C[6] + (255,), width=3)
    post_b = cy + ch + cf + ty(m(4.0))
    for px_ in (m(2), m(8), m(12), m(18)):
        d.rectangle([px_, cy + ch + cf, px_ + m(0.35), post_b], fill=C[3] + (255,))
    for px_ in (m(4.5), m(14.5)):                                      # the pump islands
        d.rectangle([px_, post_b - ty(m(1.8)), px_ + m(1.2), post_b], fill=A[3] + (255,))
        d.rectangle([px_, post_b - ty(m(1.8)), px_ + m(1.2), post_b - ty(m(1.8)) + 4], fill=C[6] + (255,))
    shade(im, (m(1), post_b, W + m(1), post_b + ty(m(1.2))), 0.7)
    return im


def motel(seed):
    im, box, _ = shell(30, 9, 3.2, 'hip', seed)
    d = ImageDraw.Draw(im); x0, ft, x1, fb = box
    r = K.R(seed)
    for k in range(8):                                                 # a door and a window per room
        x = x0 + m(1.0) + k * m(3.4)
        put(im, 'door_top', x, fb - int((fb - ft) * 0.82), m(1.0), int((fb - ft) * 0.82))
        put(im, 'wall_boarded' if r() < 0.4 else 'wall_window', x + m(1.5), ft + (fb - ft) // 4, m(1.4), (fb - ft) // 2)
    d.rectangle([x1 - m(3.0), ft, x1, fb], fill=ST[4] + (255,))          # the office, a paler box
    put(im, 'wall_window', x1 - m(2.6), ft + (fb - ft) // 4, m(2.2), (fb - ft) // 2)
    return im


def warehouse(seed):
    im, box, _ = shell(30, 8, 5.5, 'metal', seed)               # 8 m deep, 5.5 m tall: at 45 a taller, deeper box on the south row hides the street behind it
    d = ImageDraw.Draw(im); x0, ft, x1, fb = box
    d.rectangle([x0, ft, x1, fb], fill=C[3] + (255,))
    for x in range(x0, x1, m(0.5)): d.line([(x, ft), (x, fb)], fill=C[2] + (255,))
    for k in range(4):                                                 # roll-up doors on the dock face
        x = x0 + m(2.0) + k * m(7.0)
        put(im, 'garage_top', x, fb - int((fb - ft) * 0.7), m(4.0), int((fb - ft) * 0.7))
    d.rectangle([x0, fb - ty(m(1.2)), x1, fb], fill=C[4] + (255,))      # the dock
    return im


def casino_back(seed):
    im, box, _ = shell(36, 14, 12.0, 'flat', seed)
    d = ImageDraw.Draw(im); x0, ft, x1, fb = box
    d.rectangle([x0, ft, x1, fb], fill=ST[1] + (255,))
    for y in range(ft, fb, ty(m(3.0))): d.line([(x0, y), (x1, y)], fill=ST[0] + (255,))   # the tilt-up panels
    for x in range(x0, x1, m(6.0)): d.line([(x, ft), (x, fb)], fill=ST[0] + (255,))
    for k in range(3):                                                 # the loading docks
        x = x0 + m(4.0) + k * m(10.0)
        put(im, 'garage_top', x, fb - ty(m(4.0)), m(4.0), ty(m(4.0)))
    for k in range(2):                                                 # the ducts
        dx = x0 + m(2.0) + k * m(26.0)
        d.rectangle([dx, ft - ty(m(2.0)), dx + m(1.6), ft + ty(m(6.0))], fill=C[4] + (255,))
        shade(im, (dx + m(0.8), ft - ty(m(2.0)), dx + m(1.6), ft + ty(m(6.0))), 0.8)
    return im


TYPES = [('apartments', apartments, 'height'), ('church', church, 'blocked'), ('school', school, 'height'),
         ('gas_station', gas_station, 'blocked'), ('motel', motel, 'blocked'), ('warehouse', warehouse, 'blocked'),
         ('casino_back', casino_back, 'blocked')]


def place(board, grid, sprite, col, row_tile, cols, kind, north=True):
    """Bottom of the sprite on the bottom of its tile row; it may stand up into the row behind."""
    x = col * PX + (cols * PX - sprite.size[0]) // 2
    y = (row_tile + 1) * PY - sprite.size[1] - (ty(m(1.2)) if north else 0)
    if y < 0: sprite = sprite.crop((0, -y, sprite.size[0], sprite.size[1])); y = 0   # the top of the board clips it
    hard = sprite.getchannel('A').point(lambda a: 255 if a > 127 else 0)
    board.paste(sprite.convert('RGB'), (x, y), hard)
    for c in range(col, min(N, col + cols)):
        grid[row_tile][c] = kind


def town_base(seed, lot_kind='yards'):
    plan = R4.yards(seed)
    road = MX._street(plan, seed + 5)
    board = plan.resize((B.BP, PY * N), Image.NEAREST)
    B.faces(board, road.resize((B.BP, PY * N), Image.NEAREST), C[2], 0.15)
    return board, road, R4.terrain([])


# ---------------------------------------------------------------------------------------------
# ROUND TWENTY (10/5, OPEN row [more building types], rule 59): EVERY BUILDING CHANGES THE FIGHT ON ITS
# TILES. The buildings stood as walls; now each brings what Battle Brothers would give it: the church's
# steps (low cover), the school's fence (cover you see through), the gas station's pumps (cover that
# BURNS: a hit can set it alight), the motel's walkway (high ground: you stand on it), the warehouse's
# dock (high ground, a loading platform), the casino's back lot (dumpsters: cover). Each piece is drawn
# at 45 like the rest and carries its fight facts in FURN_META.
# ---------------------------------------------------------------------------------------------
def _box45(w_m, d_m, h_m, top, face, seed, ribs=None):
    W, dp, fh = m(w_m), ty(m(d_m)), ty(m(h_m))
    im = Image.new('RGBA', (W + m(0.6), dp + fh + ty(m(0.6))), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    d.polygon([(m(0.3), dp + fh), (W, dp + fh), (W + m(0.6), dp + fh + ty(m(0.6))), (m(0.6), dp + fh + ty(m(0.6)))], fill=A[2] + (255,))
    d.rectangle([0, 0, W, dp], fill=top + (255,)); d.line([(0, 0), (W, 0)], fill=C[6] + (255,))
    d.rectangle([0, dp, W, dp + fh], fill=face + (255,)); d.line([(0, dp), (W, dp)], fill=A[1] + (255,))
    if ribs:
        for x in range(0, W, m(ribs)): d.line([(x, dp), (x, dp + fh)], fill=A[1] + (255,))
    return im


def pump(seed):
    im = _box45(1.0, 0.6, 1.8, C[5], T[3], seed)
    d = ImageDraw.Draw(im); dp = ty(m(0.6))
    d.rectangle([m(0.2), dp + 6, m(0.8), dp + ty(m(0.6))], fill=A[0] + (255,))     # the dead display
    d.line([(m(0.9), dp + ty(m(0.8))), (m(1.2), dp + ty(m(1.6)))], fill=A[0] + (255,), width=3)   # the hose
    return im


def dumpster(seed):
    im = _box45(2.0, 1.4, 1.4, A[4], [A[3], T[1], B.G[0]][K.R(seed).i(3)], seed, ribs=0.5)
    return im


def fence_run(seed, length=6.0):
    W, fh = m(length), ty(m(1.8))
    im = Image.new('RGBA', (W + 4, fh + 8), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for x in range(0, W + 1, m(3.0)): d.rectangle([x, 0, x + 3, fh], fill=A[2] + (255,))
    for y in range(4, fh, 6):                                             # the chain-link, a diagonal weave you see through
        for x in range(0, W, 6): d.point((x + (y // 6) % 2 * 3, y), fill=C[4] + (255,))
    d.line([(0, 2), (W, 2)], fill=C[5] + (255,), width=2)
    return im


def steps(seed):
    im = _box45(4.0, 1.6, 0.6, ST[4], ST[2], seed)
    d = ImageDraw.Draw(im); dp = ty(m(1.6))
    for k in range(1, 3): d.line([(0, k * dp // 3), (m(4.0), k * dp // 3)], fill=ST[1] + (255,), width=2)
    return im


def dock(seed):
    return _box45(10.0, 3.0, 1.2, C[4], C[2], seed, ribs=2.0)


def _grain(im, region, seed, tones, n):
    """His texture at the house-tile scale: n specks of the given tones inside region, only on opaque pixels."""
    r = K.R(seed); d = ImageDraw.Draw(im); x0, y0, x1, y1 = region; px = im.load()
    for _ in range(n):
        x, y = x0 + r.i(max(1, x1 - x0)), y0 + r.i(max(1, y1 - y0))
        if px[x, y][3] == 0: continue
        w = 1 + r.i(3); d.rectangle([x, y, x + w, y + (1 if r() < 0.6 else 2)], fill=tones[r.i(len(tones))] + (255,))


def jersey(seed):
    """rule 77a, round two (DIRECTION 22: 'a flat three-tan box'): cast concrete, a 6 m segment; the top lit, the
       sloped south face seen, form lines, chipped corners, tar stains and the lifting holes."""
    im = BT_box = _box45(5.8, 0.6, 0.8, C[5], C[4], seed)
    d = ImageDraw.Draw(im); dp, fh, W = ty(m(0.6)), ty(m(0.8)), m(5.8)
    d.rectangle([0, dp, W, dp + fh // 3], fill=C[4] + (255,)); d.rectangle([0, dp + fh // 3, W, dp + fh], fill=C[3] + (255,))   # the slope then the foot
    d.line([(0, dp + fh // 3), (W, dp + fh // 3)], fill=C[2] + (255,), width=1)
    _grain(im, (0, 0, W, dp), seed, [C[4], C[6], ST[3] if len(ST) > 3 else C[6], C[3]], 900)       # the top's aggregate
    _grain(im, (0, dp, W, dp + fh), seed + 1, [C[2], C[3], C[5], A[3]], 1100)                      # the face's
    r = K.R(seed + 2)
    for _ in range(5):                                                    # tar and oil, from the traffic that stopped
        x = r.i(W - m(0.8)); y = dp + r.i(max(1, fh - 8))
        d.ellipse([x, y, x + m(0.3 + r() * 0.6), y + 4 + r.i(8)], fill=[A[1], A[2], A[3]][r.i(3)] + (255,))
    for x in (2, W - 7):                                                  # the chipped corners
        d.polygon([(x, 0), (x + 6, 0), (x, 6)], fill=A[2] + (255,))
    for x in (m(0.4), m(2.9), m(5.4)): d.line([(x, dp + 3), (x, dp + fh - 2)], fill=C[1] + (255,), width=2)   # the joints
    for x in (m(1.4), m(4.4)): d.rectangle([x, dp + fh // 2, x + 6, dp + fh // 2 + 4], fill=A[0] + (255,))  # the lifting holes
    return im


def trailer(seed):
    """rule 77a, round two (DIRECTION 22: 'a four-colour box'): a truck's van trailer left in the lane: ribbed
       side panels, the rear doors and their bars, rust streaks from the rivet lines, the chassis and the wheels."""
    r = K.R(seed)
    body = [C[6], C[5], T[2]][r.i(3)]
    im = _box45(12.0, 2.5, 3.0, C[6], body, seed, ribs=0.6)
    W, dp, fh = m(12.0), ty(m(2.5)), ty(m(3.0))
    big = Image.new('RGBA', (im.size[0], im.size[1] + ty(m(1.1))), (0, 0, 0, 0)); big.paste(im, (0, 0))
    d = ImageDraw.Draw(big)
    d.rectangle([m(0.4), dp + fh, W - m(0.4), dp + fh + ty(m(0.35))], fill=A[1] + (255,))            # the chassis rail
    for x in (m(1.0), m(2.2), m(8.6), m(9.8)):                                                         # the wheels
        d.ellipse([x, dp + fh - 4, x + m(1.0), dp + fh + ty(m(1.0))], fill=A[0] + (255,)); d.ellipse([x + m(0.3), dp + fh + 4, x + m(0.7), dp + fh + ty(m(0.6))], fill=A[3] + (255,))
    d.rectangle([W - m(1.6), dp + 3, W - 2, dp + fh - 2], outline=A[2] + (255,), width=2)               # the rear doors
    for y in (dp + fh // 4, dp + 3 * fh // 4): d.line([(W - m(1.5), y), (W - 4, y)], fill=A[3] + (255,), width=3)
    d.line([(W - m(0.8), dp + 3), (W - m(0.8), dp + fh - 2)], fill=A[2] + (255,), width=2)
    for x in range(0, W - m(1.6), m(0.6)):                                                             # rust from the rivet lines
        if r() < 0.45: d.line([(x + 2, dp + 6), (x + 2, dp + 6 + r.i(fh - 10))], fill=[T[0], T[1], T[2], A[4]][r.i(4)] + (255,), width=2)
    _grain(big, (0, 0, W, dp), seed + 3, [C[5], C[4], A[4], C[6]], 1400)                               # the roof's grime
    _grain(big, (0, dp, W - m(1.6), dp + fh), seed + 4, [C[4], T[1], A[4], body], 1600)
    d.rectangle([m(2.0), dp + fh // 2 - 6, m(5.5), dp + fh // 2 + 6], fill=A[2] + (255,))             # the old fleet name, painted out
    return big


FURN_MAKERS = {'pump': pump, 'jersey': jersey, 'trailer': trailer, 'dumpster': dumpster, 'fence': fence_run, 'steps': steps, 'dock': dock}
FURN_META = {'pump': dict(h=1.8, kind='COVER', burns=True), 'jersey': dict(h=0.8, kind='LOW_COVER'), 'trailer': dict(h=3.6, kind='COVER', blocks_sight=True), 'dumpster': dict(h=1.4, kind='COVER'),
             'fence': dict(h=1.8, kind='COVER', see_through=True), 'steps': dict(h=0.6, kind='LOW_COVER'),
             'dock': dict(h=1.2, kind='HEIGHT')}
FURNITURE = {k: fn(2000 + i) for i, (k, fn) in enumerate(FURN_MAKERS.items())}
_pi = B.piece_img
B.piece_img = lambda pid, cover: FURNITURE[pid] if pid in FURNITURE else _pi(pid, cover)
for _k, _im in FURNITURE.items(): B.OK |= K.colours(_im)


def main_street(seed):
    board, road, grid = town_base(seed)
    sp = {k: fn(seed + 11 * i) for i, (k, fn, _) in enumerate(TYPES)}
    place(board, grid, sp['gas_station'], 0, 1, 2, 'blocked')
    place(board, grid, sp['motel'], 2, 1, 3, 'blocked')
    place(board, grid, sp['church'], 0, 3, 1, 'blocked', north=False)
    place(board, grid, sp['school'], 1, 3, 3, 'height', north=False)
    grid[1][2] = grid[1][3] = grid[1][4] = 'height'                     # the motel's walkway: high ground you stand on
    grid[1][0] = grid[1][1] = 'flat'                                    # under the canopy is open ground; the pumps are the cover, the store is behind
    pieces = [dict(piece='car_kerb', x_m=round(40 + K.R(seed)() * 12, 1), y_m=26.0), dict(piece='wall_broken', x_m=50.0, y_m=50.0),   # the car clear of the church
              dict(piece='pump', x_m=6.0, y_m=21.0), dict(piece='pump', x_m=16.0, y_m=21.0),          # under the canopy: cover that burns
              dict(piece='steps', x_m=4.0, y_m=48.6),          # at the church's face (south rows face the camera)                                                 # the church's steps
              dict(piece='fence', x_m=13.0, y_m=49.0), dict(piece='fence', x_m=20.0, y_m=49.0), dict(piece='fence', x_m=27.0, y_m=49.0)]   # the school's fence
    return board, pieces, dict(road=road), grid, sp


def the_works(seed):
    board, road, grid = town_base(seed)
    sp = {k: fn(seed + 11 * i) for i, (k, fn, _) in enumerate(TYPES)}
    place(board, grid, sp['casino_back'], 0, 1, 3, 'blocked')
    place(board, grid, sp['apartments'], 3, 1, 2, 'height')
    place(board, grid, sp['warehouse'], 0, 3, 3, 'blocked', north=False)
    pieces = [dict(piece='car_lane', x_m=40.0, y_m=27.0), dict(piece='wall', x_m=40.0, y_m=50.0), dict(piece='shed', x_m=50.0, y_m=40.0),
              dict(piece='dumpster', x_m=4.0, y_m=24.4), dict(piece='dumpster', x_m=14.0, y_m=24.4), dict(piece='dumpster', x_m=26.0, y_m=24.4),   # the casino's back lot
              dict(piece='dock', x_m=10.0, y_m=48.4)]                                                 # the warehouse's dock, on its face (south): high ground
    grid[4][1] = 'height'
    return board, pieces, dict(road=road), grid, sp


def card(sprites, blocks, cover):
    gap = 20
    sc = 0.5
    row = [(k, im.resize((int(im.size[0] * sc), int(im.size[1] * sc)), Image.NEAREST)) for k, im in sprites.items()]
    W = 1600
    out = Image.new('RGB', (W, 2400), (12, 11, 10))
    d = ImageDraw.Draw(out)
    d.text((20, 14), 'MANY MORE BUILDING TYPES, AT 45', font=K.font(20), fill=(222, 181, 118))
    x, y, rh = 20, 50, 0
    for k, im in row:
        if x + im.size[0] > W - 20: x = 20; y += rh + 40; rh = 0
        bg = Image.new('RGB', im.size, (60, 52, 42)); bg.paste(im, (0, 0), im)
        out.paste(bg, (x, y + 22)); d.text((x, y), k.replace('_', ' ').upper(), font=K.font(14), fill=(222, 181, 118))
        x += im.size[0] + gap; rh = max(rh, im.size[1] + 22)
    y += rh + 40
    d.text((20, y), 'MAIN STREET and THE WORKS, as fight blocks (5 x 5 houses each)', font=K.font(16), fill=(222, 181, 118))
    bx = 20
    for name, (board, pieces, *_r) in blocks.items():
        b = B.composed(board, pieces, cover).convert('RGB')
        b = b.resize((int(b.size[0] * 0.29), int(b.size[1] * 0.29)), Image.LANCZOS)
        out.paste(b, (bx, y + 30)); bx += b.size[0] + 20
    return out.crop((0, 0, W, y + 30 + 560))


def main():
    cover = {k: fn() for k, fn in CV.PIECES}
    sprites = {k: fn(900 + 17 * i) for i, (k, fn, _) in enumerate(TYPES)}
    seen = set()
    for k, im in sprites.items():
        bad = K.colours(im) - B.OK
        if bad: die('%s has %d colours off his banks, e.g. %s' % (k, len(bad), list(bad)[:3]))
        if im.tobytes() in seen: die('%s is stamped' % k)
        seen.add(im.tobytes())
    blocks = {'main_street': main_street(911), 'the_works': the_works(933)}
    B.guard({k: v[:3] for k, v in blocks.items()}, cover)
    json.dump(dict(version='building-types-10-4', built='10/4/26', lane='combat 2', row='[floor set] round fourteen (rule 67)',
                   px_per_metre=K.PPM, buildings=[dict(id=k, px=list(im.size), b64=F.b64(im), terrain=t) for (k, _, t), im in zip(TYPES, sprites.values())],
                   blocks=[dict(id=k, terrain=v[3], cover=v[1]) for k, v in blocks.items()]), open(OUT_BANK, 'w'), indent=1)
    card(sprites, blocks, cover).save(OUT_CARD, optimize=True)
    print('ok: %d building types, 2 blocks -> %s, %s' % (len(sprites), OUT_BANK, OUT_CARD))


if __name__ == '__main__':
    main()
