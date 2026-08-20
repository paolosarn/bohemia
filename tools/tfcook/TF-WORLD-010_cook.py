#!/usr/bin/env python3
"""TF-WORLD-010 SIGNS & PYLONS — the tallest thing in every district.

THE JOB (form, 7/28, HIGH): every district gets its ONE TALL THING you can
see from the next cell. Kevin Lynch scored this valley ZERO on landmarks;
Vegas's landmarks ARE its signs. MEASURED 8/19 on the walked world: the
districts already NAME their sign cells and every one renders as a flat
generic brick mass —
  commercial 'pylon sign / pole' (pole + ~7x7 cabinet), swapmeet 'market
  pylon sign' (~11x4), school 'marquee sign' (19x2), drivein 'marquee sign'
  (4x5) + 'screen tower' (92x25, the face IS the screen), stadium
  'scoreboard / jumbotron' (15x4), downtown 'blade sign' (3x2 blobs,
  OVERHEAD layer, pass-under), policestation 'roof antenna / dish' (1x1
  whips on the roof grid + 2x2 dishes). Truckstop's 'pylon / price sign'
  wires through the same pylon branch when one generates.

WHAT A DEAD VEGAS SIGN IS (form section G, real-world grounding): the
acrylic FACE is the first casualty — UV yellows, crazes and BLOWS IT OUT,
leaving an EMPTY STEEL BOX on an intact pole with the internal fluorescent
tubes visible. Letter boards keep some letters' SHADOWS and lose the rest.
Steel survives. Nothing is lit, ever, in act 1.

45 LAW: cabinet TOPS are sky-lit bands bowing toward the viewer; FACES are
standing planes, dimmer, streaked downward; the pylon pole reads as an
ellipse cross-section, never a flat bar. NO readable text on any face
(MECHANISM-MINE / CONTENTS-PAOLO'S: letter shadows are plain rects, never
glyphs). NO purple.

REUSE CHECK:
  banks/tileforms/TF-ART-008_SIGNBAND_VOLUME_8_15_26.json — OPENED IN CODE.
    sb_ghost_0: the approved dead-retail ghost paint (DARKER than the face,
    the family's own sun-protection rule) tints the ghost bands here too.
    First render measured 8/19: the sb cans' DOMINANT pools are the dark
    fascia browns, so faces harvested from them read as brown boxes - the
    bleached-plastic pale comes from the pale pools below instead.
  banks/tileforms/TF-ART-018_CANDIDATES_8_16_26.json — OPENED IN CODE.
    kerb_return_ne: the approved bleached-concrete pale, lifted ~1.15 for
    sun-bleached plastic (a face bleaches past the pavement beside it).
  banks/tileforms/TF-ART-012_CANDIDATES_8_8_26.json — OPENED IN CODE.
    capsheet_tan_0: the yellowed warm cream for UV-aged patches;
    parapet_galv_run_n_a: approved galvanized steel for cap bands, frames
    and the pole barrel.
  banks/tileforms/TF-ART-010_CANDIDATES_8_8_26.json — OPENED IN CODE.
    rail_plate_0: approved rusted steel browns for lattice, brackets, rust
    bleed.
  Shopping check (form B): the approved index holds NO generic sign family —
  the reserved SIGN district is Paolo's one Welcome sign (out of scope), the
  lamps are lamps. Geometry cooked fresh, colours harvested.

TASTE CHECK: dead and unlit always (LIGHT=TERRITORY; a lit face needs
Paolo); bleached, crazed, blown out, never fresh; no readable glyphs; no
purple; steel intact, plastic gone — the desert's own wear order.

  python3 tools/tfcook/TF-WORLD-010_cook.py
    -> banks/tileforms/TF-WORLD-010_CANDIDATES_8_19_26.json
"""
import json, base64, io, os, random, math
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BK = os.path.join(REPO, 'banks/tileforms')
OUT = os.path.join(BK, 'TF-WORLD-010_CANDIDATES_8_19_26.json')
C = 44

def bank_tile(bank, name):
    d = json.load(open(os.path.join(BK, bank)))
    for t in d['tiles']:
        if t['name'] == name:
            return Image.open(io.BytesIO(base64.b64decode(t['b64'].split(',')[-1]))).convert('RGBA')
    raise SystemExit('missing harvest tile %s in %s' % (name, bank))

def dominant(im, n=3, floor=40):
    px = im.load(); seen = {}
    for y in range(im.height):
        for x in range(im.width):
            c = px[x, y]
            if c[3] > 200 and c[0]+c[1]+c[2] > floor:
                k = (c[0]//14, c[1]//14, c[2]//14)
                seen.setdefault(k, []).append(c[:3])
    pools = sorted(seen.values(), key=len, reverse=True)[:n]
    return [tuple(sum(v[i] for v in p)//len(p) for i in range(3)) for p in pools]

def brightest(pools):
    return max(pools, key=lambda c: c[0]+c[1]+c[2])

# harvested palettes (see REUSE CHECK - pale from kerb concrete + capsheet,
# ghost paint from the signband cans, steel from galv parapet + rail plate)
SB_GHOST = dominant(bank_tile('TF-ART-008_SIGNBAND_VOLUME_8_15_26.json', 'sb_ghost_0'))
KERB     = dominant(bank_tile('TF-ART-018_CANDIDATES_8_16_26.json', 'kerb_return_ne'))
CAPTAN   = dominant(bank_tile('TF-ART-012_CANDIDATES_8_8_26.json', 'capsheet_tan_0'))
GALV     = dominant(bank_tile('TF-ART-012_CANDIDATES_8_8_26.json', 'parapet_galv_run_n_a'))
RUST     = dominant(bank_tile('TF-ART-010_CANDIDATES_8_8_26.json', 'rail_plate_0'))

def lift(c, f): return tuple(min(255, int(v*f)) for v in c)
FACE_WHITE = lift(brightest(KERB), 1.15)       # sun-bleached plastic pale
FACE_CREAM = lift(brightest(CAPTAN), 1.10)     # UV-yellowed warm cream
GHOST      = min(SB_GHOST, key=lambda c: c[0]+c[1]+c[2])   # ghost paint, DARK
STEEL      = brightest(GALV)                   # galvanized grey
STEEL_D    = tuple(int(v*0.62) for v in STEEL)
RUSTC      = RUST[0]

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def mix(a, b, t): return tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3))

def new(w=C, h=C): return Image.new('RGBA', (w, h), (0, 0, 0, 0))

def noise(c, r, amp=8):
    j = r.randint(-amp, amp)
    return tuple(max(0, min(255, v+j)) for v in c)

# ---------------------------------------------------------------- rect fams
def face_base(c0, seed, streak=0.5, craze=True):
    """a standing bleached plastic plane: dim vs a top, downward streaks."""
    im = new(); px = im.load(); r = random.Random(1010+seed)
    cols = {}
    for x in range(C):
        cols[x] = r.random() < 0.14 and streak > 0     # a streak column
    for y in range(C):
        for x in range(C):
            c = noise(dim(c0, 0.88), r, 6)             # faces sit below top brightness
            if cols[x]:
                c = dim(c, 0.9 - 0.08*streak)
            if craze and (hash((x//7, y//9, seed)) % 13 == 0) and (x+y) % 3 == 0:
                c = dim(c, 0.82)                        # crazing web
            px[x, y] = c + (255,)
    return im

def screen_face(v):
    """the drive-in screen: bleached panel field, seams, rain streaks."""
    im = face_base(FACE_WHITE, v, streak=1.0)
    px = im.load(); r = random.Random(2020+v)
    for y in range(C):
        for x in range(C):
            # panel seams at the tile pitch: one panel per cell reads as a
            # monolithic screen at distance (first render's 22/11 pitch read
            # as a tiled wall instead)
            if x % 44 == 43 or y % 22 == 21:
                px[x, y] = dim(px[x, y][:3], 0.80) + (255,)
    # a warm yellowed patch
    ox, oy = r.randint(0, 30), r.randint(0, 30)
    for y in range(oy, min(C, oy+14)):
        for x in range(ox, min(C, ox+16)):
            c = px[x, y][:3]
            px[x, y] = mix(c, FACE_CREAM, 0.35) + (255,)
    return im

def screen_torn(v):
    """a torn hole: the steel lattice behind shows through the face."""
    im = screen_face(v+7)
    px = im.load(); r = random.Random(3030+v)
    cx2, cy2 = r.randint(12, 30), r.randint(12, 30)
    rad = r.randint(9, 13)
    for y in range(C):
        for x in range(C):
            d = math.hypot(x-cx2, y-cy2) + r.uniform(-2.5, 2.5)
            if d < rad:
                dk = dim(STEEL_D, 0.5)                  # cabinet dark
                px[x, y] = dk + (255,)
                if (x+y) % 7 == 0 or (x-y) % 7 == 0:    # truss diagonals
                    px[x, y] = noise(RUSTC, r, 10) + (255,)
            elif d < rad+1.6:
                px[x, y] = dim(FACE_WHITE, 1.05) + (255,)   # curled bright lip
    return im

def board_face(v):
    """the dead scoreboard matrix: charcoal panels, dead bulb dots."""
    im = new(); px = im.load(); r = random.Random(4040+v)
    dark = (38, 36, 34)
    for y in range(C):
        for x in range(C):
            c = noise(dark, r, 4)
            if x % 11 == 10 or y % 11 == 10:
                c = dim(STEEL_D, 0.8)                   # panel seams
            elif x % 4 == 1 and y % 4 == 1:
                c = noise((58, 54, 50), r, 6)           # a dead bulb, never lit
            px[x, y] = c + (255,)
    return im

def board_blown():
    """one matrix panel gone: pale cabinet interior, hanging element."""
    im = board_face(9)
    px = im.load(); r = random.Random(4141)
    x0, y0 = 6, 6
    for y in range(y0, y0+22):
        for x in range(x0, x0+22):
            px[x, y] = noise(dim(FACE_CREAM, 0.7), r, 8) + (255,)
    for y in range(y0+2, y0+16):                        # the dangling element
        px[x0+9, y] = dim(RUSTC, 0.9) + (255,)
    return im

def marq_face(v):
    """the letter board: crazed white, letter rails, letter SHADOWS (rects,
    never glyphs) where the plastic kept its colour under the gone letters."""
    im = face_base(FACE_WHITE, 20+v, streak=0.4)
    px = im.load(); r = random.Random(5050+v)
    for y in range(C):
        if y % 9 == 8:
            for x in range(C):
                px[x, y] = dim(px[x, y][:3], 0.66) + (255,)  # letter rail
    for row in range(4):                                 # sparse letter shadows
        y0 = row*9 + 2
        x = r.randint(0, 6)
        while x < C-4:
            if r.random() < 0.34:
                w = r.choice((2, 3, 3, 4))
                for yy in range(y0, min(C, y0+5)):
                    for xx in range(x, min(C, x+w)):
                        c2 = mix(px[xx, yy][:3], FACE_CREAM, 0.6)
                        px[xx, yy] = mix(c2, GHOST, 0.22) + (255,)
                x += w + r.randint(2, 5)
            else:
                x += r.randint(3, 7)
    return im

def pyl_face(v):
    """the pylon cabinet, face still in: yellowed, crazed, ghost band."""
    im = face_base(mix(FACE_WHITE, FACE_CREAM, 0.45), 40+v, streak=0.7)
    px = im.load(); r = random.Random(6060+v)
    y0 = 10 + 8*v
    for y in range(y0, min(C, y0+9)):                    # one ghost colour band
        for x in range(C):
            px[x, y] = mix(px[x, y][:3], GHOST, 0.30) + (255,)
    return im

def pyl_blown(v):
    """the empty steel box: face gone, fluorescent tubes visible, dead."""
    im = new(); px = im.load(); r = random.Random(7070+v)
    box = dim(STEEL_D, 0.55)
    for y in range(C):
        for x in range(C):
            px[x, y] = noise(box, r, 5) + (255,)
    step = 7 if v == 0 else 9
    for x in range(3+v*2, C, step):                      # the dead tubes
        for y in range(C):
            px[x, y] = noise((132, 130, 120), r, 7) + (255,)
            if x+1 < C:
                px[x+1, y] = noise((96, 94, 86), r, 6) + (255,)
    for x in range(0, C):                                # a shard still in the frame
        if x < 9:
            for y in range(0, 6-x//2):
                px[x, y] = dim(FACE_CREAM, 0.95) + (255,)
    return im

def top_band(base_face, cap_col):
    """top edge row: sky-lit cap band bowing toward the viewer, face below."""
    im = base_face.copy(); px = im.load(); r = random.Random(8080)
    H = 12
    for y in range(H):
        for x in range(C):
            # the bow: the band's lower edge dips at the ends (ellipse hint)
            dip = int(2.2 * (1 - math.sin(math.pi * (x+0.5)/C)))
            if y < H - dip:
                f = 1.28 if y < 3 else 1.12 if y < 7 else 0.95
                px[x, y] = noise(dim(cap_col, f), r, 6) + (255,)
    for x in range(C):                                    # the crest line
        px[x, 0] = dim(cap_col, 1.4) + (255,)
    return im

def foot_band(base_face, fam):
    """bottom edge row: the dark under-shadow band. The pylon pole is a
    SEPARATE overlay now - the first render repeated a baked-in pole in
    every foot cell and a 7-wide cabinet stood on a colonnade."""
    im = base_face.copy(); px = im.load()
    H = 10
    for y in range(C-H, C):
        t = (y-(C-H))/float(H)
        for x in range(C):
            px[x, y] = dim(px[x, y][:3], 0.85 - 0.45*t) + (255,)
    return im

def pyl_pole():
    """RGBA overlay: ONE pole leg - a round barrel with an ellipse cross-
    section per the 45 law, placed by the wiring at the cabinet's real leg
    columns only."""
    im = new(); px = im.load(); r = random.Random(9191)
    H = 10
    for y in range(C-H, C):
        for x in range(16, 28):
            t = abs(x-21.5)/6.0
            f = 1.15 - 0.55*t*t
            px[x, y] = noise(dim(STEEL, f), r, 5) + (255,)
    for x in range(14, 30):                               # the foot ellipse
        dy = int(2.5*math.sqrt(max(0.0, 1-((x-21.5)/8.0)**2)))
        yy = C-2-dy
        if 0 <= yy < C:
            px[x, yy] = dim(STEEL_D, 0.7) + (255,)
    return im

def edge_col(side, fam):
    """RGBA frame column overlay for the w/e outer edge."""
    im = new(); px = im.load(); r = random.Random(1111 + (0 if side == 'w' else 1))
    W = 7
    col = STEEL if fam in ('screen', 'pyl') else STEEL_D
    for y in range(C):
        for k in range(W):
            x = k if side == 'w' else C-1-k
            f = 1.15 - 0.09*k if side == 'w' else 0.75 + 0.07*k
            c = noise(dim(col, f), r, 6)
            if y % 13 == 6 and k >= W-2:
                c = dim(RUSTC, 0.9)                      # a rust weep at a bolt
            px[x, y] = c + (255,)
    return im

# ---------------------------------------------------------------- props
def blade(arm, v):
    """downtown blade sign, 3x2 cells (132x88 RGBA), seen mostly as its
    sky-lit TOP plane jutting from the facade; you pass under it."""
    W, H = 132, 88
    im = new(W, H); px = im.load(); r = random.Random(1212 + v + (0 if arm == 'w' else 50))
    x0 = 6 if arm == 'w' else 26
    x1 = W-26 if arm == 'w' else W-6
    y0, y1 = 18, 62
    for y in range(y0, y1):
        for x in range(x0, x1):
            edge = min(x-x0, x1-1-x, y-y0, y1-1-y)
            if edge < 2:
                c = dim(STEEL_D, 0.8)                    # cabinet rim
            else:
                t = (y-y0)/float(y1-y0)
                c = noise(dim(mix(FACE_WHITE, FACE_CREAM, 0.3), 1.15-0.35*t), r, 7)
            px[x, y] = c + (255,)
    # blown corner: the face panel gone, dark box shows
    bx = x1-16 if v == 0 else x0+2
    for y in range(y0+4, y0+18):
        for x in range(bx, bx+13):
            if x0 <= x < x1:
                px[x, y] = noise(dim(STEEL_D, 0.5), r, 5) + (255,)
    # a ghost band along the length, letters long gone
    for y in range(y0+26, y0+36):
        for x in range(x0+4, x1-4):
            if px[x, y][3]:
                px[x, y] = mix(px[x, y][:3], GHOST, 0.25) + (255,)
    # the mounting arm into the facade + a hanger chain pair
    ax = range(0, x0) if arm == 'w' else range(x1, W)
    for x in ax:
        for y in range(36, 42):
            px[x, y] = noise(dim(STEEL_D, 0.9), r, 5) + (255,)
    for cx2 in (x0+14, x1-14):
        for y in range(6, y0):
            if y % 3 != 2:
                px[cx2, y] = dim(STEEL_D, 0.75) + (255,)
    # the dark shade line under the south edge (you walk under this)
    for x in range(x0, x1):
        for y in range(y1, min(H, y1+5)):
            px[x, y] = (14, 12, 10, 90)
    return im

def ant_whip():
    """rooftop whip mast, 1x2 cells tall (44x88 RGBA), mostly air."""
    W, H = C, 88
    im = new(W, H); px = im.load(); r = random.Random(1313)
    cx2 = 21
    for y in range(4, H-4):                              # the lattice mast
        w = 1 if y < 30 else 2
        for k in range(-w, w+1):
            if (y % 3 == 0 and abs(k) == w) or k == 0:
                px[cx2+k, y] = noise(dim(STEEL_D, 0.9 if y % 2 else 0.75), r, 6) + (255,)
    for y in range(4, 26):                               # the whip
        px[cx2, y] = dim(STEEL, 0.95) + (255,)
    px[cx2, 4] = dim(STEEL, 1.3) + (255,)
    for s in (-1, 1):                                    # guy stubs
        for k in range(10):
            x = cx2 + s*(3+k)
            y = H-10 + k//2
            if 0 <= x < W and 0 <= y < H:
                px[x, y] = dim(STEEL_D, 0.6) + (200,)
    for x in range(cx2-6, cx2+7):                        # the roof foot plate
        px[x, H-5] = dim(STEEL_D, 0.7) + (255,)
        px[x, H-4] = dim(RUSTC, 0.8) + (255,)
    return im

def ant_dish():
    """rooftop dish, 2x2 cells (88x88 RGBA): the bowl is an ellipse at the
    45 view, dead, still pointed at something."""
    W = H = 88
    im = new(W, H); px = im.load(); r = random.Random(1414)
    cx2, cy2, rx, ry = 46, 38, 27, 17
    for y in range(H):
        for x in range(W):
            dx, dy = (x-cx2)/float(rx), (y-cy2)/float(ry)
            d = dx*dx + dy*dy
            if d <= 1.0:
                f = 0.72 + 0.5*(-dx*0.5 - dy*0.5)        # bowl shading, one light
                c = noise(dim(STEEL, max(0.45, min(1.25, f))), r, 6)
                if d > 0.86:
                    c = dim(STEEL, 1.2)                  # the lit rim
                px[x, y] = c + (255,)
    for k in range(16):                                  # the feed arm
        x, y = cx2-2+k//4, cy2-2-k
        if 0 <= y < H:
            px[x, y] = dim(STEEL_D, 0.9) + (255,)
    for y in range(cy2+ry-2, H-6):                       # the pedestal
        for x in range(cx2-3, cx2+4):
            px[x, y] = noise(dim(STEEL_D, 0.7), r, 5) + (255,)
    for x in range(cx2-10, cx2+11):                      # foot plate + rust
        px[x, H-6] = dim(STEEL_D, 0.75) + (255,)
        px[x, H-5] = dim(RUSTC, 0.85) + (255,)
    return im

def b64(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
def put(name, im): tiles.append({'name': name, 'b64': b64(im)})

# screen
for v in range(3): put('sign_screen_face_%d' % v, screen_face(v))
for v in range(2): put('sign_screen_torn_%d' % v, screen_torn(v))
put('sign_screen_top',  top_band(screen_face(5), STEEL))
put('sign_screen_foot', foot_band(screen_face(6), 'screen'))
put('sign_screen_edge_w', edge_col('w', 'screen'))
put('sign_screen_edge_e', edge_col('e', 'screen'))
# board
for v in range(2): put('sign_board_face_%d' % v, board_face(v))
put('sign_board_blown', board_blown())
put('sign_board_top',  top_band(board_face(5), STEEL_D))
put('sign_board_foot', foot_band(board_face(6), 'board'))
put('sign_board_edge_w', edge_col('w', 'board'))
put('sign_board_edge_e', edge_col('e', 'board'))
# marquee
for v in range(2): put('sign_marq_face_%d' % v, marq_face(v))
put('sign_marq_top',  top_band(marq_face(5), mix(STEEL, FACE_CREAM, 0.35)))
put('sign_marq_foot', foot_band(marq_face(6), 'marq'))
put('sign_marq_edge_w', edge_col('w', 'marq'))
put('sign_marq_edge_e', edge_col('e', 'marq'))
# pylon
for v in range(2): put('sign_pyl_face_%d' % v, pyl_face(v))
for v in range(2): put('sign_pyl_blown_%d' % v, pyl_blown(v))
put('sign_pyl_top',  top_band(pyl_face(5), STEEL))
put('sign_pyl_foot', foot_band(pyl_face(6), 'pyl'))
put('sign_pyl_pole', pyl_pole())
put('sign_pyl_edge_w', edge_col('w', 'pyl'))
put('sign_pyl_edge_e', edge_col('e', 'pyl'))
# props
for arm in ('w', 'e'):
    for v in range(2): put('sign_blade_%s_%d' % (arm, v), blade(arm, v))
put('sign_ant_whip', ant_whip())
put('sign_ant_dish', ant_dish())

out = {
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 under form TF-WORLD-010 '
           '(board row 39, HIGH, 7/28): the district-named sign cells measured '
           '8/19 all render as flat masses. Faces harvested from the approved '
           'signband plastics, steel from the approved galv parapet + rail '
           'plate. Dead, unlit, no text, no purple. '
           'tools/tfcook/TF-WORLD-010_cook.py',
    'family': 'TF-WORLD-010', 'cooked': '8/19/26',
    'tiles': tiles,
}
json.dump(out, open(OUT, 'w'))
print('banked %d sign pieces -> %s' % (len(tiles), OUT))
for t in tiles: print(' ', t['name'])
