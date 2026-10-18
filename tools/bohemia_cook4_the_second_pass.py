#!/usr/bin/env python3
"""COOK FOUR [the second pass], round 13 (10/18): THE FIVE TAN HOUSES AS THEY SIT ON THE FIGHT BOARD, PASSED
AGAINST DIRECTION'S CARD (pixel density, palette, light, outline), BEFORE AND AFTER AT 1:1.

The row: 'DIRECTION's card for the one screen (pixel density, palette, light, outline) reads PASS on your house
kit as it sits on the fight board ... before and after at 1:1.  CONSTRAINT: his approved pack skins only.'
The kit on the board is the five tan ranches (reference/art_bank/settlement/COOK4_RANCH_TAN_*.png, his 'That's
way better holy shit' on the tans) that COMBAT TWO lays on its fight boards (his YES, the fourteenth votes).
They are placeholders and are never edited (rule 101c): the second pass is a NEW kit, the same five houses on
the same canvases with the same doors and wall feet, so COMBAT TWO's numbers for every kind still hold and its
board lays them without a change.

HOW THE PACK DID IT (rule 100c; DIRECTION's card, records/BOHEMIA_THE_CARD_OF_NUMBERS_10_10_26.md, rules 5, 6, 8):
  LIGHT   his settlement pieces are lit from above in 87%, the top half +8.8 over the bottom; 'a floor tile
          carries no corner shadow of its own; the scene lights it'.
  OUTLINE his buildings carry a dark brown 1 px line, 26 below the inside, in 84%; never black.  The ring's
          colour is READ here every run from his 318 building pieces (median about (17, 14, 11)).
  SEAMS   'none you can see': his wall tiles meet (the joint 0.44 of the inside); 'cut the border, make the
          edge meet'.
  And the style guide (records/target/BOHEMIA_STYLE_GUIDE.json): one sun, warm, with a cool sky fill so the
  shade is one step down and walks cool, never black (field 6, 7); the contact shadow black at alpha, at most
  42 percent, cast down and right (field 13); binary alpha on the body (field 9); no run of one tile over four,
  two variants (field 12).

WHAT THE FIRST PASS DID WRONG, MEASURED ON THE BOARD (the five houses as COMBAT TWO's small board lays them):
  1. EVERY ROOF TILE BROUGHT ITS OWN RIDGE.  The field (his clay #26 in the tan) was laid whole with its ridge-cap
     row, so every 64 px a light line of caps crossed the roof: a stack of little roofs, a grid.  The drawn ridge
     line (a painted light stroke) sat on top of that.
  2. EVERY WALL TILE BROUGHT ITS OWN SUN.  His plaster piece is lit inside itself; stacked, the wall banded in
     stripes a tile tall.  Two lights per tile is a light from nowhere.
  3. THE ROOF'S SIDES WERE LIT FROM THE RIGHT.  The left verge was shaded harder than the right (105 against 55)
     while the sun is upper left (the guide's cast shadow falls down and right).
  4. THE SHADE WAS A BROWN SHEET LAID OVER.  Every shade was (20,14,10) at alpha: straight darkening with no hue
     walk (the vibe-coded tell 6).
  5. THE SHADOW WAS NOT THE GUIDE'S.  The contact shadow ran to alpha 150 to 186 in a warm brown: 18,400 to 31,500
     pixels a house off the guide's black at most 42 percent (field 13), and the darkest of those counted as the
     building's body.
  6. BLACK ROOMS.  His broken windows' rooms were (0, 0, 0): the guide's field 7 says never black.
  On the card (the table on the sheet) that is 9 to 11 of 13 rows OK a house; the plain and the porch under the
  light row (-3.3, -2.8: the top darker than the bottom), the plain under the hue walk (6.4 degrees).

THE SECOND PASS (nothing drawn rectangle by rectangle, rule 108; his tiles cut and laid, never scaled):
  1. THE FIELD IS CUT TO MEET ITSELF.  The ridge-cap row and the eave are cut off the field; the shingle core is
     cut where the card's own seam number (the joint over the inside) is lowest, rows at a dark trough, three
     column cuts that meet each other, so three windows of different widths lay in any order with no seam; never
     the same window twice running, each row starting at its own place.  His ridge caps are laid ONCE, along the
     ridge.  The same for the grey-tan deck of the garage, the carport and the porch, and for the eave strips.
  2. THE TILE'S OWN LIGHT IS TAKEN OUT OF THE WALL.  His plaster piece is flattened (its row and column medians
     brought level, the cracks kept) and cut to meet; then the house gets ONE light.
  3. ONE SUN.  Upper left, warm; the sky cool (the guide's sun: 50 degrees up, 35 round from the wall's face).
     The eave throws ONE hard shadow down the wall: 0.6 m of eave at that sun is 0.87 m (49 px), its edge 2 px,
     where the first pass faded a brown sheet over 18 rows.  The left verge lit, the right verge, the back slope
     (half a step: by the guide's sun it faces the light nearly as much as the wall) and the gutter in the cool:
     one step down, the hue walking the short way toward the sky (a tan falls 8 to 12 degrees through the
     red-violet a tan's shade takes, never blue: his 'metal blue' NO); the ridge caps and the lit verge walk warm.
  4. HIS DIRT ON THE ROOF.  His yard dirt (2. Soil and dirt tiles #3, the board's most-laid soil, hue 32 against
     the roof's 29 to 32) settles in the shingle grooves, thicker toward the gutter, a little uneven along the roof,
     in the groove's own shade.  Sand in a groove lowers the shingles' contrast: the roof gets a rest area (once the
     seams were gone the field was the same detail everywhere, D5, 0.835 to 0.851 against his packs' 0.834), its top
     sits over its bottom with no sun laid on the slope (the search for the smallest sun on the slope stops at 0.0),
     and the house takes the colour of the ground it stands on (his 10/10: 'not organic with the map').
  5. THE OUTLINE IS HIS.  One pixel, the colour read off his own building pieces (the first pass ringed every roof
     twice: 2 px).
  6. THE SHADOW IS THE GUIDE'S, AND NOTHING IS BLACK.  Black at alpha, at most 42 percent, its edge 2 px, cast
     down and right; nothing on the body is half see-through.  The rooms behind his broken glass were (0, 0, 0) on
     3,000 pixels a house; field 7 says the darkest pixel inside the ring is at least 12: they are his ring's brown
     walked cool (the deepest shade), their own variation kept.
  PIXEL DENSITY and PALETTE do not move: his 96 px pieces at 1:1, 57 px a metre; the valley's tans
  (reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json), his tiles' own colours under one light.

THE BOARD: COMBAT TWO's small board (tools/bohemia_combat2_a_board_you_read_in_one_look_cook_10_18_26.py) is laid
TWICE by its own untouched code in this process, once with the first kit and once with this one (its kit path
pointed at the new files; nothing of COMBAT TWO's is written).  The proof that only the houses changed: the two
boards are equal pixel for pixel outside the houses' own boxes.

REUSE CHECK: the five kinds are the family's own functions (tools/bohemia_cook4_the_straight_roof_family.py) in the
round-6 tans (tools/bohemia_cook4_the_valley_tans.py); the card is DIRECTION's own measure (its one() and bands);
the cell check is the church's; the board is COMBAT TWO's.  New here: the cut that meets, the flattening, the one
light, the guide's shadow, the measuring and the sheet.

Output: reference/art_bank/settlement/COOK4_RANCH_PASS2_{PLAIN,GARAGE,CARPORT,WING,PORCH}.png, the sheet
records/target/COOK4_THE_SECOND_PASS.webp, the numbers records/target/COOK4_THE_SECOND_PASS.json (rule 100: never
slices/ or engine/).  Native pixel size: his 96 px pieces at 1:1, 57 px a metre.  Palette file: reference/art_bank/
settlement/COOK4_THE_VALLEY_TANS.json.  Light: one sun, upper left.

REFERENCE CHECK (9/4 compare law; rule 82a: the twin IS his pack):
  compared to: his pack house 5. Roof tiles #30 at 1:1 on the sheet (its roof, wall and ring measured beside ours),
  the man at 1:1 at a door, and the same houses before at the same spot of the same board.
  structure taken: his ring colour, his field and his caps, his wall; the card's numbers; the guide's sun and shadow.
  what changed: only light, seams, outline and shadow; no shape, no size, no colour family.

    python3 tools/bohemia_cook4_the_second_pass.py            (about a minute)
"""
import hashlib, json, os, re, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bohemia_cook4_one_house as oh
import bohemia_cook4_the_roof_measured as rm
import bohemia_cook4_the_straight_roof_family as fam
import bohemia_cook4_the_valley_tans as vt
from bohemia_cook4_the_church import cell_check

AB, ROOT = oh.AB, oh.ROOT
A = vt.A_redirected
W3 = np.array([0.299, 0.587, 0.114])
KINDS = [k for k, _ in fam.KINDS]
FIRST = 'settlement/COOK4_RANCH_TAN_%s.png'
SECOND = 'settlement/COOK4_RANCH_PASS2_%s.png'
SHEET = os.path.join(ROOT, 'records/target/COOK4_THE_SECOND_PASS.webp')
NUMBERS = os.path.join(ROOT, 'records/target/COOK4_THE_SECOND_PASS.json')
GUIDE = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))
CARD = json.load(open(os.path.join(ROOT, 'records/target/DIRECTION_THE_CARD_OF_NUMBERS.json')))['families']['settlement']
TB_WANT = 0.0                                       # the top never under the bottom, every house (the card's floor is -2.1)


def gfield(key):
    return next(f for f in GUIDE['fields'] if f['key'] == key)['value']


# ---- DIRECTION's card, its own measure (the tool's functions, not its main, which rewrites the card) ------------
def _card_fns():
    path = os.path.join(ROOT, 'tools/bohemia_direction_the_card_of_numbers.py')
    src = open(path).read().split('import sys as _s')[0]
    g = {'__file__': path, '__name__': 'card'}; exec(src, g)
    return g


one = _card_fns()['one']

# ---- the guide's light and shadow ---------------------------------------------------------------------------
SKY = np.array(gfield('light')['fill']['rgb'])           # the cool sky fill, (0.55, 0.55, 0.6)
SHADE = 0.70 * (SKY / SKY.mean()) ** 0.5 * np.array([1.0, 0.95, 1.0])   # full shade: one step down (0.7); green
# pulled most, so a tan's hue walks 8 to 12 degrees the short way toward the sky's 245 (through the red-violet a tan's
# shade takes, never blue: his 'metal blue' NO)
# the faces by the guide's sun (rot 40, 0, -35; front and above, from the left): the front slope faces it most, the wall
# next, the back slope a little less than the wall (N.L 0.92, 0.53, 0.46); so the back slope is half a step down, not a
# dark sheet, and the slope takes the sun (searched in main)
BACK_SLOPE = 0.5
SUN = np.array([1.08, 1.10, 0.97])                       # full sun: up, the hue walking warm toward the guide's 50 degrees
# (it lights the ridge and the left verge; over a whole slope it reads gold, and thatch is banned, so the slope's
# lift is searched from 0 and taken only if the top would sit under the bottom)
DARK = 0.33                                              # how much a full shade takes off a tan (the first pass's sheet took its alpha)
CONTACT = gfield('contact')
SHADOW_MAX = int(round(CONTACT['alpha_max'] * 255))      # 107: the guide's 42 percent
SHADOW_EDGE = CONTACT['edge_px']                         # 2


def light(im, strength, tint):
    """multiply the opaque pixels by a light: strength is an array (h, w) of 0..1 or a number; tint the full
    multiplier.  The hue walks with it (warm up, cool down); nothing is laid over as a sheet."""
    a = np.asarray(im).astype(float)
    s = np.broadcast_to(np.asarray(strength, float), a.shape[:2])[..., None]
    a[..., :3] = np.clip(a[..., :3] * (1 + s * (np.asarray(tint) - 1)), 0, 255)
    return Image.fromarray(a.round().astype(np.uint8), 'RGBA')


def rows_fade(h, w, n, top=True, peak=1.0):
    """a strength that fades over n rows from the top (or the bottom)"""
    s = np.zeros((h, w))
    for i in range(min(n, h)):
        s[i if top else h - 1 - i] = peak * (1 - i / n)
    return s


# ---- the ring, read off his building pieces every run ---------------------------------------------------------
def his_ring():
    corpus = json.load(open(os.path.join(AB, 'CORPUS.json')))['tiles'].values()
    rings = []
    for r in corpus:
        if r['family'] != 'settlement': continue
        f = os.path.join(AB, 'settlement', r['file'])
        if not os.path.exists(f): continue
        a = np.asarray(Image.open(f).convert('RGBA')).astype(float); op = a[..., 3] > 127
        p = np.pad(op, 1); edge = op & ~(p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:])
        if edge.sum() >= 20: rings.append(a[..., :3][edge].mean(0))
    return tuple(int(v) for v in np.median(np.array(rings), 0).round()) + (255,), len(rings)


RING, RING_N = his_ring()


def outline2(im, col=None):
    return oh.outline(im, col or RING)


# ---- the cut that meets: the card's seam number (rule 8), searched -------------------------------------------
def _inside(a, axis):
    return float(np.abs(np.diff(a, axis=axis)).sum(-1).mean())


def find_cut(t, ylo, yhi, minh, xlo, xhi, minw):
    """rows [y0, y1) whose last row meets the first best; then three columns k1 < k2 < k3 where every window
    [k1,k2), [k2,k3), [k1,k3) meets every other laid after it.  Returns ((y0, y1), windows, numbers)."""
    a = np.asarray(t).astype(float)[..., :3]
    ins_y = _inside(a[ylo:yhi, xlo:xhi], 0)
    best = None
    for y0 in range(ylo, yhi - minh + 1):
        for y1 in range(y0 + minh, yhi + 1):
            j = np.abs(a[y1 - 1, xlo:xhi] - a[y0, xlo:xhi]).sum(-1).mean() / ins_y
            if best is None or j < best[0]: best = (j, y0, y1)
    jy, y0, y1 = best
    core = a[y0:y1]
    ins_x = _inside(core[:, xlo:xhi], 1)
    xs = np.arange(xlo + 1, xhi)                          # a cut c: a window ends at c (last column c-1) or starts at c
    E = core[:, xs - 1]; S = core[:, xs]
    D = np.abs(E[:, :, None] - S[:, None, :]).sum(-1).mean(0) / ins_x      # D[e, s]: a window ending at e, the next starting at s
    n = len(xs); best = None
    for i in range(n):
        for j in range(i + minw, n):
            for k in range(j + minw, n):
                worst = max(D[j, i], D[k, i], D[k, j])
                if best is None or worst < best[0]: best = (worst, i, j, k)
    jx, i, j, k = best
    k1, k2, k3 = (int(xs[i]), int(xs[j]), int(xs[k]))
    return (y0, y1), [(k1, k2), (k2, k3), (k1, k3)], dict(joint_rows=round(jy, 2), joint_cols=round(float(jx), 2))


CUTS = {}


def cut_of(t, key, **kw):
    if key not in CUTS: CUTS[key] = find_cut(t, **kw)
    return CUTS[key]


def lay_meet(t, cut, w, h, seed, record=None):
    """his piece laid in rows from the three windows that meet: never one window twice running, each row from
    its own start, the rows meeting at the dark trough"""
    (y0, y1), wins, _ = cut
    rng = np.random.RandomState(seed)
    pieces = [t.crop((x0, y0, x1, y1)) for x0, x1 in wins]
    out = Image.new('RGBA', (w, h)); y = 0; joints = ([], [])
    while y < h:
        x = -int(rng.randint(0, pieces[2].width)); last = None
        while x < w:
            k = rng.choice([i for i in range(3) if i != last]); last = k
            out.alpha_composite(pieces[k], (x, y)); x += pieces[k].width
            if 0 < x < w: joints[0].append((x, y, min(y + (y1 - y0), h)))
        y += y1 - y0
        if y < h: joints[1].append(y)
    if record is not None: record.append(joints)
    return out


def seams(im, joints):
    """the card's seam number on a laid field: the step across every joint over the step inside"""
    a = np.asarray(im).astype(float)[..., :3]
    ins_x, ins_y = _inside(a, 1), _inside(a, 0)
    vx = [np.abs(a[ya:yb, x] - a[ya:yb, x - 1]).sum(-1).mean() for x, ya, yb in joints[0]]
    vy = [np.abs(a[y] - a[y - 1]).sum(-1).mean() for y in joints[1]]
    return round(float(np.mean(vx)) / ins_x if vx else 0, 2), round(float(np.mean(vy)) / ins_y if vy else 0, 2)


def first_lay_seams(t, w, h, crop, dy=0):
    """the first pass's lay (rm.lay) on the same field, its joints where rm.lay put them, the same number"""
    im = rm.lay(t, w, h, crop=crop, dy=dy); p = t.crop(crop) if crop else t
    jx, jy = [], []; y = 0; r = 0
    while y < h:
        x = -(p.width // 2) * (r % 2)
        while x < w:
            x += p.width
            if 0 < x < w: jx.append((x, y, min(y + p.height - dy, h)))
        y += p.height - dy; r += 1
        if y < h: jy.append(y)
    return seams(im, (jx, jy))


# ---- the field, the wall: his pieces made to meet -----------------------------------------------------------
def field_cut(field):
    """the shingle core of a roof field: below the ridge-cap row, above the eave; the columns inside his lean"""
    a = np.asarray(field); op = a[..., 3] > 127
    L = a[..., :3].astype(float) @ W3
    prof = np.array([L[y, 20:-20].mean() for y in range(a.shape[0])])
    cap_end = 4 + int(np.argmin(prof[4:18]))              # the dark line under his ridge caps
    rows = range(cap_end + 1, a.shape[0] - 22)
    xlo = max(int(np.nonzero(op[y])[0][0]) for y in rows) + 3
    xhi = min(int(np.nonzero(op[y])[0][-1]) for y in rows) - 2
    key = 'field ' + hashlib.md5(field.tobytes()).hexdigest()[:8]
    return cut_of(field, key, ylo=cap_end + 1, yhi=a.shape[0] - 22, minh=30, xlo=xlo, xhi=xhi, minw=20), cap_end


def caps_cut(field, cap_end):
    """his ridge caps: the top row of the field, cut to meet end to end"""
    a = np.asarray(field); op = a[..., 3] > 127
    rows = range(1, cap_end)
    xlo = max(int(np.nonzero(op[y])[0][0]) for y in rows if op[y].any()) + 1
    xhi = min(int(np.nonzero(op[y])[0][-1]) for y in rows if op[y].any()) - 1
    key = 'caps ' + hashlib.md5(field.tobytes()).hexdigest()[:8]
    if key not in CUTS:
        (_, _), wins, nums = find_cut(field, ylo=0, yhi=cap_end, minh=cap_end, xlo=xlo, xhi=xhi, minw=12)
        CUTS[key] = ((0, cap_end), wins, nums)
    return CUTS[key]


def flat(piece):
    """take the tile's own light out: its row and column medians brought level (a window of 9), the cracks kept"""
    a = np.asarray(piece).astype(float); L = a[..., :3] @ W3
    g = np.median(L)
    def level(prof):
        k = np.ones(9) / 9; p = np.convolve(np.pad(prof, 4, mode='edge'), k, mode='valid')
        return np.clip(g / np.maximum(p, 1), 0.82, 1.22)
    a[..., :3] *= level(np.median(L, 1))[:, None, None]
    L2 = a[..., :3] @ W3
    a[..., :3] *= level(np.median(L2, 0))[None, :, None]
    return Image.fromarray(np.clip(a, 0, 255).round().astype(np.uint8), 'RGBA')


def wall_piece(kind):
    t = A(fam.PLASTER[kind]); fl = flat(t.crop((5, 5, t.width - 5, t.height - 5)))
    key = 'wall ' + kind
    return fl, cut_of(fl, key, ylo=0, yhi=fl.height, minh=int(fl.height * .7), xlo=0, xhi=fl.width, minw=16)   # whole courses kept


SEEDS = iter(range(1300, 100000))
FIELD_JOINTS = {}


def wall2(kind, w, h=fam.WALL_H):
    fl, cut = wall_piece(kind); rec = []
    out = lay_meet(fl, cut, w, h, next(SEEDS), rec)
    FIELD_JOINTS.setdefault('wall ' + kind, []).append(seams(out, rec[0]))
    return out


SUN_EL = 90 - gfield('light')['sun']['rot_x_deg']           # the guide's sun stands 50 degrees up
SUN_AZ = abs(gfield('light')['sun']['rot_z_deg'])           # and 35 degrees round from the wall's face
EAVE_M = 0.6                                                # a Vegas ranch's eave: 0.6 m out from the wall
EAVE_SHADOW = int(round(rm.M(EAVE_M) * np.tan(np.radians(SUN_EL)) / np.cos(np.radians(SUN_AZ))))


def shade_top2(im, n=18, a=120):
    """the eave's shadow on the wall, from the guide's sun: 0.6 m of eave at 50 degrees up and 35 round throws a
    band 0.87 m down the wall (about 50 px), hard, its edge 2 px (field 13), in the cool (the first pass faded a
    brown sheet over 18 rows)"""
    s = np.zeros((im.height, im.width))
    s[:EAVE_SHADOW] = 1.0
    for i in range(SHADOW_EDGE): s[EAVE_SHADOW + i] = 1 - (i + 1) / (SHADOW_EDGE + 1)
    return light(im, s, SHADE)


SUN_S = [0.0]                                             # the sun on the slope: searched in main
SOIL = 'road/pack_2_soil_and_dirt_tiles_003.png'          # the board's yard dirt, weighted 4 of 14 (COMBAT TWO's YARD_W)
DUST_K = 0.6                                              # the deepest groove at the gutter: 60 percent dirt


def _soil():
    a = np.asarray(Image.open(os.path.join(AB, SOIL)).convert('RGBA')).reshape(-1, 4)
    return np.median(a[a[:, 3] > 127][:, :3], 0)


DUST = _soil()


def dust(im, seed, low=0.25):
    """the desert on the roof: his yard dirt caught in the grooves between the shingles (the pixels darker than
    their neighbours), thicker toward the gutter where it settles, a little uneven along the roof.  Sand in a groove
    lowers the shingles' contrast, so a roof gets the rest a painter leaves (D5), and it takes the colour of the
    ground it stands on, in the shade a groove is in (so the dark end of the roof's ramp keeps its cool walk).  Weather paint only: nothing is drawn."""
    w, h = im.size; rng = np.random.RandomState(seed)
    a = np.asarray(im).astype(float); L = a[..., :3] @ W3
    local = np.asarray(Image.fromarray(L.clip(0, 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(6))).astype(float)
    groove = np.clip((local - L) / 40, 0, 1)
    g = rng.rand(3, max(2, w // 120 + 2))
    uneven = 0.6 + 0.4 * np.asarray(Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(float) / 255
    k = (DUST_K * groove * np.linspace(low, 1.0, h)[:, None] * uneven)[..., None]
    a[..., :3] = a[..., :3] * (1 - k) + DUST * SHADE * k        # the sand down a groove lies in the shingle's shadow
    return Image.fromarray(a.round().astype(np.uint8), 'RGBA')


def roof2(w, h, field, inset):
    """the front slope: his shingle core laid to meet, the trapezoid, his eave strip at the foot cut to meet;
    the verges by the one light: the left in the sun, the right in the cool"""
    (cut, cap_end) = field_cut(field); rec = []
    body = lay_meet(field, cut, w, h, next(SEEDS), rec)
    FIELD_JOINTS.setdefault('roof field', []).append(seams(body, rec[0]))
    body = dust(body, next(SEEDS))
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).polygon([(inset, 0), (w - inset, 0), (w - 1, h - 1), (0, h - 1)], fill=255)
    out = Image.new('RGBA', (w, h)); out.paste(body, (0, 0), m)
    e = A('settlement/pack_5_roof_tiles_014.png').crop((0, 8, 96, 38))
    ecut = cut_of(e, 'eave tan', ylo=0, yhi=30, minh=30, xlo=0, xhi=96, minw=16)
    erec = []; eave = lay_meet(e, ecut, w, 30, next(SEEDS), erec)
    FIELD_JOINTS.setdefault('eave', []).append(seams(eave, erec[0]))
    em = Image.new('L', (w, 30), 0); ImageDraw.Draw(em).polygon([(14, 0), (w - 14, 0), (w - 1, 29), (0, 29)], fill=255)
    out.paste(eave, (0, h - 30), em)
    left = Image.new('L', (w, h), 0); ImageDraw.Draw(left).polygon([(0, h - 1), (inset, 0), (int(inset * 1.25), 0), (int(inset * .35), h - 1)], fill=255)
    right = Image.new('L', (w, h), 0); ImageDraw.Draw(right).polygon([(w - 1, h - 1), (w - inset, 0), (w - int(inset * 1.25), 0), (w - int(inset * .35), h - 1)], fill=255)
    out = light(out, np.asarray(left) / 255 * 0.8, SUN)                       # the first pass shaded this side 105
    out = light(out, np.asarray(right) / 255 * min(1.0, 105 / 255 / DARK), SHADE)  # and this one 55: the sun is upper left
    return outline2(out)


def straight_roof2(w, h, field):
    """the straight gable: the front slope in the sun, his caps laid once along the ridge, the back slope a sliver
    in the cool, the cool over the gutter"""
    full = roof2(w, h, field, int(w * rm.LEAN))
    back = int(h * .14)
    s = np.zeros((h, w)); s[back:h - 30] = SUN_S[0]
    full = light(full, s, SUN)
    sh = np.zeros((h, w)); sh[:back] = BACK_SLOPE                 # the back slope, half a step down
    for i in range(10): sh[h - 30 - 10 + i] = 6 * i / 255 / DARK   # the cool over the gutter, the first pass's ramp
    full = light(full, sh, SHADE)
    (cut, cap_end) = field_cut(field)
    cc = caps_cut(field, cap_end)
    cap = lay_meet(field, cc, w, cap_end, next(SEEDS))
    inset = int(w * rm.LEAN); top_w = w - 2 * int(inset * (1 - back / h))
    cm = Image.new('L', (w, cap_end), 0); ImageDraw.Draw(cm).rectangle([(w - top_w) // 2 + 2, 0, (w + top_w) // 2 - 2, cap_end], fill=255)
    ridge = Image.new('RGBA', (w, cap_end)); ridge.paste(cap, (0, 0), cm)
    full.alpha_composite(light(ridge, 0.5, SUN), (0, max(0, back - cap_end // 2)))
    return full                                           # roof2 drew the one ring; a second is the first pass's 2 px line


def shed_roof2(w, h, field, eave):
    """the flat deck from above: his core laid to meet, his eave strip cut to meet, the far edge in the cool, the
    sun on the deck (a flat roof faces the sun less than the slope: half of the slope's lift)"""
    f = A(field); (cut, cap_end) = field_cut(f); rec = []
    body = lay_meet(f, cut, w, h, next(SEEDS), rec)
    FIELD_JOINTS.setdefault('deck field', []).append(seams(body, rec[0]))
    body = dust(body, next(SEEDS), low=0.5)
    e = A(eave).crop((0, 8, 96, 34))
    ecut = cut_of(e, 'eave ' + os.path.basename(eave), ylo=0, yhi=26, minh=26, xlo=0, xhi=96, minw=16)
    body.alpha_composite(lay_meet(e, ecut, w, 26, next(SEEDS)), (0, h - 26))
    body = light(body, SUN_S[0] * 0.5, SUN)
    body = light(body, rows_fade(h, w, 12, peak=min(1.0, 150 / 255 / DARK)), SHADE)
    return outline2(body)


def grounded2(parts, pad=14):
    """the family's grounding, by the guide: black at alpha, at most 42 percent, its edge 2 px, cast down and right"""
    W = max(x + im.width for im, x, y, fp in parts) + pad
    H = max(y + im.height for im, x, y, fp in parts) + pad + 26
    c = Image.new('RGBA', (W, H))
    sh = Image.new('RGBA', (W, H)); d = ImageDraw.Draw(sh)
    for im, x, y, fp in parts:
        if not fp: continue
        x0, x1, by = fp
        d.rectangle([x0 - 6, by - 4, x1 + 26, by + 12], fill=(0, 0, 0, SHADOW_MAX))
        d.polygon([(x1, by - fam.WALL_H // 3), (x1 + 44, by + 4), (x1 + 44, by + 16), (x1, by + 16)], fill=(0, 0, 0, SHADOW_MAX * 2 // 3))
    c.alpha_composite(sh.filter(ImageFilter.GaussianBlur(SHADOW_EDGE)))
    for im, x, y, fp in parts: c.alpha_composite(im, (x, y))
    return c


DARKEST = gfield('shading')['shadow_never_black']            # 'at least 12 of 255 outside the ring and the contact shadow'
FLOOR = int(re.search(r'at least (\d+)', DARKEST).group(1))
DEEP = np.array(RING[:3]) * SHADE / 0.70                      # the deepest shade: his ring's brown, in the shade's walk


def silhouette_ring(op):
    p = np.pad(op, 1)
    return op & ~(p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:])


def never_black(im):
    """the room behind his broken glass is the deepest shade, not black (field 7): every body pixel under the floor
    is lifted to his ring's brown walked cool, its own little variation kept on top; the silhouette's ring is his"""
    a = np.asarray(im).astype(float); op = a[..., 3] == 255
    L = a[..., :3] @ W3; low = op & (L < FLOOR) & ~silhouette_ring(op)
    a[low, :3] = np.minimum(DEEP + a[low, :3], 255)
    return Image.fromarray(a.round().astype(np.uint8), 'RGBA')


def guide_alpha(im):
    """binary on the body; anything half see-through is shadow: black, at most 42 percent (field 9, 13)"""
    a = np.asarray(im).copy(); part = a[..., 3] < 255
    a[part, :3] = 0; a[..., 3] = np.where(part, np.minimum(a[..., 3], SHADOW_MAX), 255)
    return Image.fromarray(a, 'RGBA')


def second_kit():
    """the five kinds by the family's own functions, with the five fixes swapped in"""
    saved = dict(wall=fam.wall, shade_top=fam.shade_top, straight_roof=fam.straight_roof, shed_roof=fam.shed_roof,
                 outline=fam.outline, grounded=fam.grounded, rm_outline=rm.outline, A=fam.A, rmA=rm.A)
    fam.A = A; rm.A = A
    fam.wall, fam.shade_top, fam.straight_roof, fam.shed_roof = wall2, shade_top2, straight_roof2, shed_roof2
    fam.outline, fam.grounded, rm.outline = outline2, grounded2, outline2
    try:
        global SEEDS
        SEEDS = iter(range(1300, 100000)); FIELD_JOINTS.clear()
        out = {}
        for name, fn in fam.KINDS:
            im, foot, label = fn(); out[name] = (never_black(guide_alpha(im)), foot, label)
        return out
    finally:
        fam.wall, fam.shade_top, fam.straight_roof, fam.shed_roof = saved['wall'], saved['shade_top'], saved['straight_roof'], saved['shed_roof']
        fam.outline, fam.grounded, rm.outline, fam.A, rm.A = saved['outline'], saved['grounded'], saved['rm_outline'], saved['A'], saved['rmA']


# ---- THE CARD FOR THE ONE SCREEN: the four, as numbers --------------------------------------------------------
def card_rows(im):
    """DIRECTION's card on one house, the four the row names, plus the guide's shadow and the hue walk"""
    sys.path.insert(0, os.path.join(ROOT, 'gates'))
    import bohemia_not_vibe_coded as N
    T = N.thresholds()
    a = np.asarray(im.convert('RGBA')).astype(np.int16)
    m = one(a); B = CARD['band']
    rep = N.sprite_report(im, 'building', 'upper-left', None, T)
    al = a[..., 3]; part = (al > 0) & (al < 255)
    bad_shadow = int((part & ((al > SHADOW_MAX) | (a[..., :3].max(-1) > 0))).sum())
    red = cell_check(im)
    op = al == 255; Lb = a[..., :3].astype(float) @ W3
    inner = op & ~silhouette_ring(op)
    darkest = int(Lb[inner].min()) if inner.any() else 0
    d4 = rep['D4']['value'].get('median_shift', 0)
    return [
        ('PIXEL', 'one pixel size (D1)', rep['D1']['value']['native'] == 1, 'native %d' % rep['D1']['value']['native']),
        ('PIXEL', 'long side >= %d' % CARD['long_side_p10'], max(a.shape[:2]) >= CARD['long_side_p10'], '%d' % max(a.shape[:2])),
        ('PALETTE', 'colours >= %d' % B['colours'][0], m['colours'] >= B['colours'][0], '%d' % m['colours']),
        ('PALETTE', 'top 8 carry <= %.0f%%' % B['top8'][1], m['top8'] <= B['top8'][1], '%.1f%%' % m['top8']),
        ('PALETTE', 'saturation <= %.2f' % B['sat'][1], m['sat'] <= B['sat'][1], '%.2f' % m['sat']),
        ('PALETTE', 'value span >= %.0f' % B['span'][0], m['span'] >= B['span'][0], '%.0f' % m['span']),
        ('PALETTE', 'no red 96 px cell (D2, D5)', not red, '%d red' % len(red)),
        ('LIGHT', 'top over bottom >= %+.1f' % B['tb'][0], m['tb'] >= B['tb'][0], '%+.1f' % m['tb']),
        ('LIGHT', 'the shade walks its hue (D4)', rep['D4']['ok'] is True, '%.1f deg' % d4),
        ('LIGHT', "shadow black, <= 42% (guide 13)", bad_shadow == 0, '%d px off' % bad_shadow),
        ('LIGHT', 'nothing black (guide 7: >= %d)' % FLOOR, darkest >= FLOOR, '%d' % darkest),
        ('OUTLINE', 'edge between %+.0f and %+.0f' % tuple(B['step']), B['step'][0] <= m['step'] <= B['step'][1], '%+.1f' % m['step']),
        ('OUTLINE', 'grain <= %.2f px a run' % B['run'][1], m['run'] <= B['run'][1], '%.2f' % m['run']),
    ], dict(tb=round(m['tb'], 1), lr=round(m['lr'], 1), edge=round(m['step'], 1), colours=m['colours'], sat=round(m['sat'], 3),
            mean_value=round(m['mean_L'], 1), shadow_off=bad_shadow, red_cells=len(red),
            d3_off=rep['D3']['value'].get('angle_off'), d4=rep['D4']['value'])


# ---- the board: COMBAT TWO's own code, laid twice -----------------------------------------------------------
def board(kit):
    import bohemia_combat2_a_board_you_read_in_one_look_cook_10_18_26 as L3
    R1, R2 = L3.R1, L3.R2
    R2.SET = kit; R2.IMG.clear()
    G = R1.Ground(1016)
    P, ground, PR, decals, n_cp = L3.lay('small', G)
    keep, dk, swaps, why, moves = L3.one_look(P, PR, decals, 'small')
    for n, to in swaps.items(): L3.swap_item(PR, n, to)
    for r in PR.rec:
        if r['n'] in moves: L3.move_item(PR, r, moves[r['n']])
    kept = {r['n'] for r in PR.rec if keep[r['n']]}; rec = {r['n'] for r in PR.rec}
    items = [it for i, it in enumerate(PR.items) if i in kept or i not in rec]
    b = L3.composite(L3.stamp(ground, decals, dk), items).convert('RGB')
    houses = [(x, y, im.width, im.height, im) for foot, x, y, im, k in items if k == 'house']
    return b, houses


def font(sz):
    return ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf'), sz)


def wrap(d, text, f, width):
    words, lines, cur = text.split(), [], ''
    for w_ in words:
        t = (cur + ' ' + w_).strip()
        if d.textlength(t, font=f) > width and cur: lines.append(cur); cur = w_
        else: cur = t
    return lines + ([cur] if cur else [])


def sheet(first, second, cards, before_b, after_b, houses, field_numbers):
    Wd, pad = 2720, 30
    F, f, s = font(30), font(22), font(18)
    INK, DIM, HOT, OK_, OUT_ = (236, 230, 218), (176, 168, 152), (226, 162, 72), (150, 200, 120), (230, 110, 90)
    rows = []
    def text(t, ft=f, col=INK): rows.append(('t', t, ft, col))
    def img(im, cap): rows.append(('i', im, cap))
    text('THE SECOND PASS: YOUR FIVE TAN HOUSES ON THE FIGHT BOARD, ONE SUN, NO SEAMS, YOUR OUTLINE, THE GUIDE\'S SHADOW. BEFORE AND AFTER AT 1:1. A PLACEHOLDER UNTIL YOUR MOODBOARD.', F, HOT)
    text('Native pixel size: your 96 px pieces at 1:1, 57 px a metre (unchanged).  Palette file: reference/art_bank/settlement/COOK4_THE_VALLEY_TANS.json (unchanged).  Light: one sun, upper left; the shadow falls down and right.', s, DIM)
    # 1. the same spot of COMBAT TWO's small board, before and after, the phone's width each
    def cut(b, cx, cy, w=1300, h=760):
        x0 = int(min(max(0, cx - w / 2), b.width - w)); y0 = int(min(max(0, cy - h / 2), b.height - h))
        return b.crop((x0, y0, x0 + w, y0 + h))
    def side(a_, b_):
        im = Image.new('RGB', (a_.width + b_.width + pad, max(a_.height, b_.height)), (14, 13, 12)); im.paste(a_, (0, 0)); im.paste(b_, (a_.width + pad, 0)); return im
    seen, picks = set(), []
    for hh in houses:                                      # two different kinds, the first of each
        if hh[2] not in seen: seen.add(hh[2]); picks.append(hh)
    for x, y, w, h, _ in picks[:3:2]:
        cx, cy = x + w / 2, y + h / 2 + 60
        img(side(cut(before_b, cx, cy), cut(after_b, cx, cy)), 'THE SAME SPOT OF COMBAT TWO\'S SMALL BOARD AT 1:1: BEFORE (left, the first pass) and AFTER (right, the second). Only the houses changed; the board is laid by COMBAT TWO\'s own code both times.')
    # 2. the whole board as the fight opens on the phone (1170 px wide, the far stop)
    sc = 1170 / before_b.width                             # the upright phone's 1170 px: the fight's far stop (rule 104a)
    sm = lambda b: b.resize((int(b.width * sc), int(b.height * sc)), Image.LANCZOS)
    img(side(sm(before_b), sm(after_b)), 'THE WHOLE SMALL BOARD AT 1170 PX WIDE, THE PHONE\'S OWN PIXELS AS THE FIGHT OPENS (%d%%): before (left), after (right)' % round(sc * 100))
    # 3. each house, before over after, at 1:1, with its card
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    for k in KINDS:
        b_, a_ = first[k], second[k][0]; foot = second[k][1]
        pair = Image.new('RGBA', (b_.width + a_.width + pad, max(b_.height, a_.height)), (40, 36, 30, 255))
        pair.alpha_composite(b_, (0, 0)); pair.alpha_composite(a_, (b_.width + pad, 0))
        pair.alpha_composite(man, (b_.width + pad + foot[0] + 30 - 56, foot[1] - 107))
        rb, ra = cards[k]['before_rows'], cards[k]['after_rows']
        img(pair.convert('RGB'), '%s, AT 1:1 ON A NEUTRAL GROUND: first pass (left), second pass (right), the man at the door. The card: %d of %d rows OK before, %d of %d after.' % (
            k.upper(), sum(r[2] for r in rb), len(rb), sum(r[2] for r in ra), len(ra)))
    # 4. the twin: his pack house and ring
    twin = A('settlement/pack_5_roof_tiles_030.png')
    tw = Image.new('RGB', (Wd - 2 * pad, 330), (14, 13, 12)); d = ImageDraw.Draw(tw)
    tw.paste(twin, (10, 40), twin); tw.paste(twin.resize((288, 288), Image.NEAREST), (130, 30), twin.resize((288, 288), Image.NEAREST))
    tw.paste(man, (440, 40 + 96 - 107), man)
    d.rectangle([600, 60, 660, 120], fill=RING[:3])
    d.text((680, 60), 'his ring: (%d, %d, %d), the median of %d of his building pieces; the one pixel line round every part of the second pass' % (RING[:3] + (RING_N,)), font=s, fill=INK)
    d.text((680, 100), 'his pack house #30 at 1:1 and 3x, the man at 1:1: the twin', font=s, fill=DIM)
    img(tw, 'THE TWIN')
    # 5. the card, every row before -> after
    tab = Image.new('RGB', (Wd - 2 * pad, 64 + 26 * len(cards[KINDS[0]]['after_rows']) + 30), (14, 13, 12)); d = ImageDraw.Draw(tab)
    d.text((10, 8), 'DIRECTION\'S CARD, THE FOUR THE ROW NAMES (pixel, palette, light, outline), each house: first pass -> second pass', font=f, fill=HOT)
    cw = (Wd - 2 * pad - 520) // len(KINDS)
    for i, k in enumerate(KINDS): d.text((520 + i * cw, 40), k.upper(), font=s, fill=INK)
    for r, row in enumerate(cards[KINDS[0]]['after_rows']):
        y = 64 + r * 26
        d.text((10, y), row[0], font=s, fill=DIM)
        d.text((110, y), row[1], font=s, fill=DIM)
        for i, k in enumerate(KINDS):
            b_, a_ = cards[k]['before_rows'][r], cards[k]['after_rows'][r]
            d.text((520 + i * cw, y), ('OK' if b_[2] else 'OUT'), font=s, fill=OK_ if b_[2] else OUT_)
            d.text((520 + i * cw + 46, y), '->', font=s, fill=DIM)
            d.text((520 + i * cw + 80, y), ('OK' if a_[2] else 'OUT'), font=s, fill=OK_ if a_[2] else OUT_)
            d.text((520 + i * cw + 130, y), '%s -> %s' % (b_[3], a_[3]), font=s, fill=DIM)
    img(tab, 'THE CARD')
    text('THE SEAMS, the card\'s own number (rule 8: the step across a joint over the step inside; his walls 0.44, his roads 2.0): ' + '; '.join('%s %s' % (k, v) for k, v in field_numbers.items()), s, INK)
    text('THE THREE BIGGEST DIFFERENCES: (1) THE ROOF IS ONE ROOF: the ridge caps of every tile are gone from the slope and laid once along the ridge, the shingles cut to meet, so no light line crosses it every 64 px; (2) ONE SUN AND YOUR DIRT: the wall no longer bands a tile tall; the eave throws one hard shadow down the wall (0.87 m, from the guide\'s sun); the left verge is lit and the right in shade; your yard dirt (soil #3, the board\'s own) lies in the shingle grooves, thicker toward the gutter, so the roof is a sun-bleached desert roof, its top over its bottom, and it takes the ground\'s colour; (3) YOUR OUTLINE, THE GUIDE\'S SHADOW, NOTHING BLACK: the line is the colour read off your own building pieces, the shadow is black at most 42 percent so the soil shows through it, and the dark rooms behind the broken glass are the deepest shade, not black.', f, INK)
    # lay out
    probe = ImageDraw.Draw(Image.new('RGB', (10, 10)))
    H = pad
    for r in rows:
        if r[0] == 't': H += len(wrap(probe, r[1], r[2], Wd - 2 * pad)) * (r[2].size + 10) + 12
        else: H += r[1].height + 46
    S_ = Image.new('RGB', (Wd, H + pad), (14, 13, 12)); d = ImageDraw.Draw(S_); y = pad
    for r in rows:
        if r[0] == 't':
            for ln in wrap(d, r[1], r[2], Wd - 2 * pad): d.text((pad, y), ln, font=r[2], fill=r[3]); y += r[2].size + 10
            y += 12
        else:
            S_.paste(r[1], (pad, y)); y += r[1].height + 6
            d.text((pad, y), r[2], font=s, fill=DIM); y += 40
    return S_


def main():
    first = {k: A(FIRST % k.upper()) for k in KINDS}
    # the sun on the slope: the smallest lift (in tenths) that puts every house's top over its bottom by TB_WANT
    for s_ in [i / 10 for i in range(0, 11)]:
        SUN_S[0] = s_
        second = second_kit()
        tbs = {k: one(np.asarray(second[k][0]).astype(np.int16))['tb'] for k in KINDS}
        print('sun %.1f: top over bottom %s' % (s_, ', '.join('%s %+.1f' % (k, v) for k, v in tbs.items())), flush=True)
        if min(tbs.values()) >= TB_WANT: break
    assert min(tbs.values()) >= TB_WANT, 'no sun under full lifts every top over its bottom: fix the part, never the ruler'
    for k in KINDS:
        assert second[k][0].size == first[k].size, '%s: the canvas must be the first pass\'s, so COMBAT TWO\'s numbers hold' % k
    # the seams, first lay against second, on the same fields
    tf = A(fam.CLAY); gf = A(fam.SLATE)
    field_numbers = {}
    for name, t, crop, dy in (('roof field', tf, (4, 4, tf.width - 4, tf.height - 22), 6), ('deck field', gf, (4, 4, gf.width - 4, gf.height - 22), 6)):
        b_ = first_lay_seams(t, 640, 260, crop, dy)
        a_ = tuple(np.round(np.mean([v for v in FIELD_JOINTS[name]], 0), 2))
        field_numbers[name] = 'across/down %.2f/%.2f -> %.2f/%.2f' % (b_ + a_)
    for kind in ('cracked', 'flat', 'stone'):
        t = A(fam.PLASTER[kind]); b_ = first_lay_seams(t, 640, fam.WALL_H, (7, 10, t.width - 7, t.height - 10))
        if 'wall ' + kind in FIELD_JOINTS:
            a_ = tuple(np.round(np.mean(FIELD_JOINTS['wall ' + kind], 0), 2))
            field_numbers['wall ' + kind] = 'across/down %.2f/%.2f -> %.2f/%.2f' % (b_ + a_)
    cards = {}
    for k in KINDS:
        rb, nb = card_rows(first[k]); ra, na = card_rows(second[k][0])
        cards[k] = dict(before_rows=rb, after_rows=ra, before=nb, after=na)
        print('%-8s before %d/%d  after %d/%d  %s' % (k, sum(r[2] for r in rb), len(rb), sum(r[2] for r in ra), len(ra),
              '; '.join('%s %s' % (r[1], r[3]) for r in ra if not r[2])), flush=True)
    for k in KINDS:
        second[k][0].save(os.path.join(AB, SECOND % k.upper()))
    before_b, houses = board(os.path.join(ROOT, 'reference/art_bank', FIRST))
    after_b, houses2 = board(os.path.join(ROOT, 'reference/art_bank', SECOND))
    assert [h[:4] for h in houses] == [h[:4] for h in houses2], 'the board laid the second kit somewhere else'
    diff = np.abs(np.asarray(before_b).astype(int) - np.asarray(after_b).astype(int)).sum(-1) > 0
    inside = np.zeros_like(diff)
    for x, y, w, h, _ in houses: inside[max(0, y):y + h, max(0, x):x + w] = True
    outside_changed = int((diff & ~inside).sum())
    print('board: %d px changed, %d of them outside the houses\' boxes' % (int(diff.sum()), outside_changed), flush=True)
    assert outside_changed == 0, 'something but the houses changed on the board'
    S_ = sheet(first, second, cards, before_b, after_b, houses, field_numbers)
    S_.save(SHEET, quality=92, method=6)
    print('sheet', S_.size, os.path.getsize(SHEET) // 1024, 'KB')
    passed = all(all(r[2] for r in cards[k]['after_rows']) for k in KINDS)
    json.dump(dict(lane='cook 4', row='[the second pass]', date='10/18/26', sun_on_the_slope=SUN_S[0], tb_wanted=TB_WANT,
                   ring=list(RING[:3]), ring_from_pieces=RING_N, cuts={k: dict(rows=v[0], windows=v[1], **v[2]) for k, v in CUTS.items()},
                   seams=field_numbers,
                   board=dict(changed_px=int(diff.sum()), changed_outside_houses=outside_changed, houses=len(houses)),
                   card={k: dict(before=dict(cards[k]['before'], rows={r[0] + ' ' + r[1]: [r[2], r[3]] for r in cards[k]['before_rows']}),
                                 after=dict(cards[k]['after'], rows={r[0] + ' ' + r[1]: [r[2], r[3]] for r in cards[k]['after_rows']})) for k in KINDS},
                   card_reads=('PASS' if passed else 'BACK')), open(NUMBERS, 'w'), indent=1, default=str)
    print('THE CARD READS', 'PASS' if passed else 'BACK')


if __name__ == '__main__':
    main()
