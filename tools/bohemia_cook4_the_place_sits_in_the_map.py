#!/usr/bin/env python3
"""COOK FOUR [the place sits in the map], round 14 (10/19): CHURCH, THE DEMO'S FIRST TOWN, ON ITS OWN MAP GROUND.

The row (PAOLO 10/10, 'the settlements all look like dogshit and not organic with the map'; rule 86): 'The settlement
picture's edges meet the map's ground it stands on (the desert wash, the suburb grid, the strip's spine): the same
dirt, the same road running in and out, no slab, no frame; a sheet per ground; RUN draws the join at the near stop.'
This round is the first ground, THE SUBURB GRID, on the place he taps first in the demo: CHURCH (a town, the map's
chapel block 47,50, two blocks from where the party stands at the door).

WHAT THE MAP HOLDS THERE (read off the demo by tools/bohemia_cook4_the_place_sits_in_the_map_read.js, the map's own
fine grid, 128 cells a block, and its near stop as he sees it):
  the chapel block (the church, its forecourt, its car park); THE ARTERIAL along its north side (four lanes, the walks
  in grey); THE SUBURB east and south of it (tan yards, tan houses); THE STRIP'S RESORTS west of it.  The map's own
  colours: the suburb's dirt #8a7a5e, the asphalt #33333c, the arterial's walk #8a8a92, the chapel's forecourt #a09a8a;
  on his glass at the near stop each comes through the day's light and the district's cast at about 0.9 (measured
  here every run from the shot: the screen's dirt and asphalt against the plan's).
WHAT WAS WRONG, MEASURED (the picture Church opens on today is this lane's own round-3 pack town,
  slices/settlement_ground_packs/town_0.webp, a placeholder, never edited, rule 101c): its dirt is his pack soil as
  bought, ORANGE (the bank holds no dirt in the map's tan: all 24 of his soil tiles sit 15 to 34 off the map's
  dirt in Lab, measured over the whole bank, 2,021 floor pieces, the nearest dirt 15.5); its road is a cobble band
  from nowhere; its houses are slate cottages that are not the map's.  Zoomed in from the map, a tan and grey city
  becomes an orange village: the slab.
HOW BATTLE BROTHERS DOES IT (rule 41; the library's 10_UI_AND_FEEL and 03_WORLD_MAP): a town screen is a painted
  view whose BACKDROP IS THE TERRAIN THE TOWN STANDS ON on the world map (steppe, snow, forest, swamp, desert), so
  the town you enter is the place you saw; the fight by a town stands in the town's own buildings.  OURS: the picture
  is the map's own block, seen close: the map's dirt, the map's road, the map's neighbours on each side.
THE PICTURE (nothing drawn rectangle by rectangle, rule 108; his tiles cut and laid at their own pixels, never scaled;
the buildings this lane's own files at 1:1):
  * THE SEEING: from the arterial, the church's doors facing it as the map's plan has them (its forecourt is on the
    north side); so the road is in front, running in at the left edge and out at the right, the suburb's houses on
    the left (east) and the Strip's casino on the right (west), as the map has them round the chapel block.
  * THE SAME DIRT: his yard soil (2. Soil and dirt tiles #0, a second variant #18 in patches, his pale sand #3 where
    feet wore a path) cut to meet itself (the second pass's cut, the card's seam number) and laid to every edge, then
    WHITE-BALANCED TO THE MAP: each channel's gain takes his tile's median to the map's dirt as he sees it, so every
    grain and crack of his tile stays and the colour is the map's (his roofs took the valley's tans the same way).
  * THE SAME ROAD: COOK TWO's cells (his asphalt, his sidewalk slabs, his slab's own south face as the kerb, the curb
    he voted UP), his worn double yellow (1. Cracked street tiles #18 to #22) as the centre line, white-balanced to the
    map's asphalt and walk; it runs off both side edges and the bottom edge (the far lanes are past the frame).
  * NO SLAB, NO FRAME: nothing changes at an edge: houses are cut by the frame (a garage ranch at the left, the
    casino at the right), the back row of the suburb runs on behind its chain link, the road leaves both sides.
  * THE TOWN: the clinic is the church (in Battle Brothers the temple is where the wounded are treated; the church
    here is that place), the barber is the porch ranch, the stall is his market stall on the walk, the posts his
    post-and-rail at the barber's yard, the board his chalk easel at the tower door.
  * ONE SCENE, ONE LIGHT: one sun from the upper left; every building laid with the style guide's shadow (black, at
    most 42 percent) and nothing black inside (the second pass's rules, applied as each building is laid, the files
    untouched); every prop on its own contact shadow.
  * ONE WRONG THING (analog horror, rule 20): the church's pews stand out on the forecourt in rows, facing the road you
    came in on, not the doors.
REFERENCE CHECK (9/4 compare law; rule 82: the twin is the world it lands in): compared to the map itself at its
  closest zoom, centred on Church (his glass, the shot on the sheet), the map's own plan of the 25 blocks round it, the
  picture Church opens on today, his pack house #30 and the man at 1:1.  structure taken: the map's dirt, asphalt,
  walk and forecourt colours, the road on the church's door side, the suburb east and the Strip west; what changed:
  the colour of his ground tiles (a white balance), nothing else of his.
REUSE CHECK: the read is COMBAT TWO's map-cell reader's way (tools/bohemia_combat2_read_the_map_cell_10_18_26.js);
  the road, walk and kerb are COOK TWO's cells and face (tools/bohemia_cook2_stretch_the_pack_47_10_13_26.py); the cut
  that meets and the light rules are the second pass's; the cell check is the church's; the buildings are this lane's
  files (pass-two houses, the church, the casino) at 1:1.  New here: the white balance to the map, the composition,
  the measures and the sheet.
OUTPUT (rule 100: candidates only, nothing to slices/, engine/ or the demo):
  reference/art_pipe/cook4/place_in_the_map/COOK4_TOWN_CHURCH_ON_THE_SUBURB_GRID.webp (the picture, a drop-in for
  RUN TWO's settlement screen when he says so) and .json (its hotspots in the screen's own schema, its ground, its
  scale); the palette file COOK4_THE_MAP_GROUND.json (rule 114c); the sheet records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP.webp;
  the numbers records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP.json.
Native pixel size: his 96 px pieces at 1:1, 57 px a metre across, 40 a metre of ground depth (the family's 0.7).
Palette file: reference/art_pipe/cook4/place_in_the_map/COOK4_THE_MAP_GROUND.json.  Light: one sun, upper left.

    node tools/bohemia_cook4_the_place_sits_in_the_map_read.js Church     (the map, once; about two minutes)
    python3 tools/bohemia_cook4_the_place_sits_in_the_map.py               (about a minute)
"""
import io, base64, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)
import bohemia_cook2_stretch_the_pack as S                    # his packs, UP only (pack() refuses the rest)
import bohemia_cook2_stretch_the_pack_47_10_13_26 as B        # COOK TWO's cells and the kerb face
import bohemia_cook4_the_second_pass as sp                    # the cut that meets, the guide's shadow, never black
import bohemia_cook4_the_church as chm
import bohemia_cook4_the_casino as cam
from bohemia_cook4_the_church import cell_check
import bohemia_direction_floor_bar as FB                       # DIRECTION's floor bar: his YES street as numbers

AB = os.path.join(ROOT, 'reference/art_bank')
PLACE = 'CHURCH'
DIR = os.path.join(ROOT, 'reference/art_pipe/cook4/place_in_the_map')   # a cook folder: his pack bank holds his packs only (PLUMBER 10/19)
READ = os.path.join(DIR, 'COOK4_PLACE_%s.json' % PLACE)
PIC = os.path.join(DIR, 'COOK4_TOWN_CHURCH_ON_THE_SUBURB_GRID.webp')
PIC_JSON = os.path.join(DIR, 'COOK4_TOWN_CHURCH_ON_THE_SUBURB_GRID.json')
PALETTE = os.path.join(DIR, 'COOK4_THE_MAP_GROUND.json')
SHEET = os.path.join(ROOT, 'records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP.webp')
NUMBERS = os.path.join(ROOT, 'records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP.json')
BEFORE = os.path.join(ROOT, 'slices/settlement_ground_packs/town_0.webp')   # what Church opens on today
PPM = 100 / 1.75                     # the body's ruler: 57 px a metre across
DEPTH = 0.7                          # the family's ground depth at 45 degrees: 40 px a metre front to back
def M(m): return int(round(m * PPM))
def D(m): return int(round(m * PPM * DEPTH))

W, H = 4224, 1728                    # 74 m across, 43 m of ground front to back
ROAD_TOP = H - D(7.0)                # the near lane, the centre line and the start of the far lane; the rest is past the frame
LINE_Y = ROAD_TOP + D(3.6)           # one 3.6 m lane from the kerb to the centre line
WALK_TOP = ROAD_TOP - D(2.0)         # the arterial's walk, 2 m
NAVE_FOOT = WALK_TOP - D(6.8)        # the church's forecourt holds its three rows of pews (6.2 m out)
HOUSE_FOOT = WALK_TOP - D(4.5)       # a 4.5 m front yard
LOT_LINE = HOUSE_FOOT - D(10.0) - D(5.0)   # the house's 10 m of depth, then a 5 m back yard to the chain link
BACK_FOOT = LOT_LINE - D(0.6)        # the back row of the suburb, behind the chain link
CASINO_FOOT = WALK_TOP - D(5.0)      # the casino's paved apron
SOIL, SOIL2, SAND = ('2. Soil and dirt tiles', 0), ('2. Soil and dirt tiles', 18), ('2. Soil and dirt tiles', 3)
LINES = (18, 19, 20, 21, 22)         # his worn double yellow
SEED = 1419


def his(name, idx):
    return Image.fromarray(S.pack(name, idx), 'RGBA')


def lab(rgb):
    a = np.asarray(rgb, float) / 255
    a = np.where(a > 0.04045, ((a + 0.055) / 1.055) ** 2.4, a / 12.92)
    M3 = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = a @ M3.T / np.array([0.95047, 1, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def dE(a, b): return round(float(np.linalg.norm(lab(a) - lab(b))), 1)
def hx(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float)


# ---- 1. THE MAP'S GROUND AS HE SEES IT -----------------------------------------------------------------------
def kmeans(X, K, seed=0, it=30):
    rng = np.random.RandomState(seed); C = X[rng.choice(len(X), K, replace=False)]
    for _ in range(it):
        lb = ((X[:, None] - C[None]) ** 2).sum(-1).argmin(1)
        C = np.array([X[lb == k].mean(0) if (lb == k).any() else C[k] for k in range(K)])
    return C, lb


def the_map():
    """the map's own colours (its plan) and what his glass shows of them at the near stop round the place.  The map
    is drawn flat-shaded, so each thing on the glass is a few exact colours: for each, the most-drawn colour within
    reach of the plan's colour under the screen's light (that light read off the dirt and the asphalt, one gain a
    channel)"""
    rd = json.load(open(READ))
    shot = np.asarray(Image.open(os.path.join(ROOT, rd['shot'])).convert('RGB')).astype(float)
    cvh = shot.shape[0]
    reg = shot[int(cvh * 0.5):int(cvh * 0.97)].reshape(-1, 3).astype(int)    # under the phone's feed, over the speed pad
    cols, cnt = np.unique(reg, axis=0, return_counts=True)
    order = np.argsort(-cnt); cols, cnt = cols[order][:400].astype(float), cnt[order][:400]
    share = cnt / len(reg)
    plan = {'dirt': hx('#8a7a5e'), 'asphalt': hx('#33333c'), 'walk': hx('#8a8a92'), 'forecourt': hx('#a09a8a')}
    def most_drawn(target, reach):
        ok = [i for i in range(len(cols)) if dE(cols[i], target) <= reach]
        return (cols[max(ok, key=lambda i: cnt[i])], float(share[max(ok, key=lambda i: cnt[i])])) if ok else (None, 0.0)
    seen, how = {}, {}
    for k in ('dirt', 'asphalt'):
        seen[k], sh = most_drawn(plan[k], 12); how[k] = 'drawn %.1f%% of the glass' % (100 * sh)
    gain = (seen['dirt'] + seen['asphalt']) / (plan['dirt'] + plan['asphalt'])
    for k in ('walk', 'forecourt'):
        c, sh = most_drawn(plan[k] * gain, 8)
        if c is None: seen[k], how[k] = plan[k] * gain, 'the plan under the light (not drawn on this glass)'
        else: seen[k], how[k] = c, 'drawn %.1f%% of the glass' % (100 * sh)
    clusters = [{'rgb': [int(v) for v in cols[i]], 'share': round(float(share[i]), 3)} for i in range(12)]
    return rd, shot, plan, seen, gain, clusters, how


# ---- 2. HIS GROUND, LAID TO EVERY EDGE AND WHITE-BALANCED TO THE MAP -------------------------------------------
def field(tile, key, w, h, seed, joints=None):
    t = his(*tile)
    cut = sp.cut_of(t, key, ylo=7, yhi=t.height - 7, minh=46, xlo=7, xhi=t.width - 7, minw=18)
    return sp.lay_meet(t, cut, w, h, seed, joints), cut


def balance(a, mask, target, contrast=1.0):
    """his pixels, each channel's gain taking his median to the target: his grain kept, the map's colour"""
    a = a.astype(float); med = np.median(a[mask][:, :3], 0)
    out = a.copy()
    out[..., :3] = target * (1 + contrast * (a[..., :3] / np.maximum(med, 1) - 1))
    return np.where(mask[..., None], out, a).clip(0, 255)


def noise_mask(w, h, cells, seed, thresh):
    """a hard-edged organic patch mask (smooth noise, one threshold): clusters, never a speckle"""
    g = np.random.RandomState(seed).rand(cells[1], cells[0])
    n = np.asarray(Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(float) / 255
    return n > thresh


def grid_cells(w, h, fam, ids):
    """COOK TWO's cells laid on their own 82 x 81 grid (each his tile, its frame cut, mirrored or not at random)"""
    out = np.zeros((h, w, 3), np.uint8)
    for y in range(0, h, B.TH):
        for x in range(0, w, B.TW):
            c = B.cell(fam, ids); ye, xe = min(y + B.TH, h), min(x + B.TW, w)
            out[y:ye, x:xe] = c[:ye - y, :xe - x]
    return out


# ---- 3. THE PLACE ----------------------------------------------------------------------------------------------
def lay_building(canvas, im, x0, y0, hot=None, name=None):
    """a building laid at 1:1 under the scene's one shadow rule (black, at most 42 percent) with nothing black
    inside; the file is never touched"""
    im = sp.never_black(sp.guide_alpha(im))
    canvas.alpha_composite(im, (x0, y0)) if x0 >= 0 and y0 >= 0 else _paste(canvas, im, x0, y0)
    if hot is not None:
        a = np.asarray(im)[..., 3] == 255; ys, xs = np.where(a)
        box = [max(0, x0 + xs.min()), max(0, y0 + ys.min()), min(W, x0 + xs.max() + 1), min(H, y0 + ys.max() + 1)]
        hot[name] = [int(v) for v in box]
    return im


def _paste(canvas, im, x0, y0):
    cx0, cy0 = max(0, -x0), max(0, -y0)
    piece = im.crop((cx0, cy0, min(im.width, W - x0), min(im.height, H - y0)))
    canvas.alpha_composite(piece, (max(0, x0), max(0, y0)))


def contact(canvas, t, x0, foot):
    """a prop's own contact shadow: its own silhouette's foot squashed flat under it, black at the guide's alpha
    (at most 42 percent), its edge 2 px, a little down and to the right (the sun is upper left)"""
    a = np.asarray(t)[..., 3] > 127
    foot_rows = a[int(a.shape[0] * 0.7):]
    band = np.asarray(Image.fromarray(foot_rows.astype(np.uint8) * 255).resize((t.width + 8, 12), Image.BILINEAR)).astype(float) / 255
    band = np.pad(band, ((6, 6), (6, 6)))
    al = np.asarray(Image.fromarray((band * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(sp.SHADOW_EDGE))).astype(float) / 255
    sh = np.zeros(al.shape + (4,), np.uint8); sh[..., 3] = (al * sp.SHADOW_MAX).round().astype(np.uint8)
    _paste(canvas, Image.fromarray(sh, 'RGBA'), x0 - 6, foot - 14)


def lay_prop(canvas, tile, x, foot, hot=None, name=None, flip=False):
    t = his(*tile)
    if flip: t = t.transpose(Image.FLIP_LEFT_RIGHT)
    a = np.asarray(t)[..., 3]; ys, xs = np.where(a > 127)
    t = t.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    contact(canvas, t, x, foot)
    t = sp.guide_alpha(t)
    _paste(canvas, t, x, foot - t.height)
    if hot is not None:
        b = [x, foot - t.height, x + t.width, foot]
        if name in hot: o = hot[name]; b = [min(o[0], b[0]), min(o[1], b[1]), max(o[2], b[2]), max(o[3], b[3])]
        hot[name] = [int(v) for v in b]
    return t


def place(seen, contrast):
    rng = np.random.RandomState(SEED)
    cls = np.zeros((H, W), np.uint8)          # 0 dirt, 1 walk, 2 asphalt, 3 line, 4 kerb, 5 forecourt, drive, apron
    # the dirt: his soil #0 to every edge, #18 in patches, his sand where feet wore a path
    jo = []
    base, cut0 = field(SOIL, 'soil0', W, H, SEED, jo)
    alt, cut1 = field(SOIL2, 'soil18', W, H, SEED + 1)
    sand, cut2 = field(SAND, 'soil3', W, H, SEED + 2)
    yard = np.ones((H, W), bool)
    g = balance(np.asarray(base.convert('RGB')).astype(float), yard, seen['dirt'], contrast)     # each tile its own balance:
    g2 = balance(np.asarray(alt.convert('RGB')).astype(float), yard, seen['dirt'], contrast)   # the variant differs in grain only
    patch = noise_mask(W, H, (44, 18), SEED + 3, 0.74)
    g = np.where(patch[..., None], g2, g)
    s = balance(np.asarray(sand.convert('RGB')).astype(float), yard, seen['dirt'] * 1.07, contrast)
    # the worn paths: from the barber's door, the tower doors and the garage to the walk; sand where feet went
    worn = np.zeros((H, W), bool)
    paths = [(PORCH_X + 326, HOUSE_FOOT, PORCH_X + 300, WALK_TOP), (CH_X + 107, NAVE_FOOT + chm.T_FWD, CH_X + 60, WALK_TOP)]
    for x0, y0, x1, y1 in paths:
        for k in range(60):
            t = k / 59; x = x0 + (x1 - x0) * t + rng.randint(-6, 7); y = int(y0 + (y1 - y0) * t)
            r = 26 + rng.randint(0, 14)
            worn[max(0, y - 10):y + 10, max(0, int(x - r)):int(x + r)] = True
    worn &= noise_mask(W, H, (60, 30), SEED + 4, 0.35)
    g = np.where(worn[..., None], s, g)
    # the walk, the forecourt, the drive and the casino's apron: COOK TWO's slabs on their own grid
    slab = grid_cells(W, H, S.SIDEWALK, B.WALKS)
    pave = np.zeros((H, W), bool)
    pave[WALK_TOP:ROAD_TOP] = True
    pave[NAVE_FOOT - 8:WALK_TOP, CH_X + CH_XT:CH_X + CH_XH + chm.HALL] = True             # the church's forecourt
    pave[HOUSE_FOOT - 6:WALK_TOP, GAR_X + 1065 - M(1.6):GAR_X + 1065 + M(1.6)] = True       # the garage's drive
    pave[CASINO_FOOT - 8:WALK_TOP, CAS_X - M(0.6):W] = True                                 # the Strip's apron
    walk_t = seen['walk']; fore_t = seen['forecourt']
    slab_w = balance(slab, pave, walk_t, 1.0)
    slab_f = balance(slab, pave, fore_t, 1.0)
    walkrow = np.zeros((H, W), bool); walkrow[WALK_TOP:ROAD_TOP] = True
    sl = np.where(walkrow[..., None], slab_w, slab_f)
    # sand drifted over a slab's edge where it meets the dirt (weather): the slab's border, broken by the noise
    edge = pave & ~np.asarray(Image.fromarray(pave.astype(np.uint8) * 255).filter(ImageFilter.MinFilter(15))).astype(bool)
    edge[ROAD_TOP - 10:ROAD_TOP + 1] = False                                                # the kerb stays clean
    drift = edge & noise_mask(W, H, (140, 60), SEED + 5, 0.45)
    pave_vis = pave & ~drift
    g = np.where(pave_vis[..., None], sl, g); cls[pave_vis] = 5; cls[pave_vis & walkrow] = 1
    # the road: COOK TWO's asphalt cells, his worn double yellow along the centre, the kerb his slab's own face
    road = grid_cells(W, H - ROAD_TOP, S.ROAD, B.ROADS).astype(float)
    lt = S.pad(S.cut_frame(S.pack(S.ROAD, LINES[0]), S.ROAD), B.TW, B.TH)[..., :3]
    line_rows = np.where((np.abs(lt.astype(float) - lt.mean((0, 1))).sum(-1) > 0) &
                         (lt[..., 0].astype(int) - lt[..., 2] > 40))[0]
    l0, l1 = int(line_rows.min()) - 3, int(line_rows.max()) + 4
    band_h = l1 - l0; ly = LINE_Y - ROAD_TOP - band_h // 2
    x = -int(rng.randint(0, B.TW)); last = None
    while x < W:
        k = rng.choice([i for i in LINES if i != last]); last = k
        c = S.pad(S.cut_frame(S.pack(S.ROAD, k), S.ROAD), B.TW, B.TH)[l0:l1, :, :3]
        xs, xe = max(x, 0), min(x + B.TW, W)
        road[ly:ly + band_h, xs:xe] = c[:, xs - x:xe - x]
        x += B.TW
    rmask = np.ones(road.shape[:2], bool)
    road = balance(road, rmask, seen['asphalt'], 1.0)
    paint = np.zeros(road.shape[:2], bool); paint[ly:ly + band_h] = True
    paint &= (road[..., 0] - road[..., 2] > 18)
    g[ROAD_TOP:] = road; cls[ROAD_TOP:] = 2; cls[ROAD_TOP:][paint] = 3
    face = np.concatenate([B.FACE] * (W // B.FACE.shape[1] + 1), axis=1)[:, :W]
    fm = np.ones(face.shape[:2], bool)
    face = balance(face, fm, walk_t * 0.82, 1.0)
    g[ROAD_TOP:ROAD_TOP + B.FH] = face; cls[ROAD_TOP:ROAD_TOP + B.FH] = 4
    g[ROAD_TOP + B.FH:ROAD_TOP + B.FH + 3] *= 0.55                                          # the kerb's shadow on the road
    g[ROAD_TOP - 1] = g[ROAD_TOP - 1] * 0.35 + np.array([214, 200, 176]) * 0.65             # the lit lip (COOK TWO)
    canvas = Image.fromarray(g.round().clip(0, 255).astype(np.uint8)).convert('RGBA')
    ground = canvas.copy()
    hot = {}
    # the back row of the suburb, behind its chain link
    chain = his('6. Chain link fences', 0)
    for x in range(-int(rng.randint(0, chain.width)), CH_X - 40, chain.width - 2):
        _paste(canvas, sp.guide_alpha(chain), x, LOT_LINE - chain.height)
    for kind, x0, flip in (('PLAIN', -260, False), ('WING', 760, True)):
        im = Image.open(os.path.join(AB, 'settlement/COOK4_RANCH_PASS2_%s.png' % kind)).convert('RGBA')
        if flip: im = im.transpose(Image.FLIP_LEFT_RIGHT)
        foot = 399 if kind != 'WING' else 399 + (im.height - 439)
        lay_building(canvas, im, x0, BACK_FOOT - foot)
    lay_prop(canvas, ('16. Dead trees and plants', 2), 470, LOT_LINE + D(2.0))
    lay_prop(canvas, ('16. Dead trees and plants', 8), CH_X - 120, LOT_LINE + D(3.2))
    # the front row: a garage ranch cut by the left edge, the porch ranch (the barber)
    gar = Image.open(os.path.join(AB, 'settlement/COOK4_RANCH_PASS2_GARAGE.png')).convert('RGBA')
    lay_building(canvas, gar, GAR_X, HOUSE_FOOT - 399)
    por = Image.open(os.path.join(AB, 'settlement/COOK4_RANCH_PASS2_PORCH.png')).convert('RGBA')
    lay_building(canvas, por, PORCH_X, HOUSE_FOOT - 399, hot, 'barber')
    # the Strip begins: a motel behind, the casino in front, both cut by the right edge
    mot = Image.open(os.path.join(AB, 'settlement/COOK4_MOTEL_STRAIGHT_ROOF.png')).convert('RGBA')
    lay_building(canvas, mot, MOTEL_X, MOTEL_FOOT - MOT_FOOT)
    lay_building(canvas, CASINO, CAS_X, CASINO_FOOT - CAS_FOOT)
    # the church (the clinic), its pews out on the forecourt facing the road
    lay_building(canvas, CHURCH, CH_X, NAVE_FOOT - CH_NAVE_FOOT, hot, 'clinic')
    # the town's things: the barber's posts, the stall on the walk, the board at the tower doors, life at the doors
    for k in range(3):
        lay_prop(canvas, ('7. Fences and palisades', 2), PORCH_X - 60 + k * 94, WALK_TOP - 2, hot, 'posts', flip=bool(k % 2))
    lay_prop(canvas, ('8. Market Stalls', 4), PORCH_X + 600, HOUSE_FOOT + D(3.4), hot, 'stall')   # out in the barber's yard by the walk
    lay_prop(canvas, ('13. Port market', 30), CH_X + 107 - 150, NAVE_FOOT + chm.T_FWD + D(1.4), hot, 'board')
    lay_prop(canvas, ('15. Street props', 40), PORCH_X + 560, HOUSE_FOOT + D(1.8))         # a pallet at the barber's door
    lay_prop(canvas, ('14. Trash and junk props', 3), CAS_X + 40, CASINO_FOOT + D(0.6))     # the casino's dumpster
    return canvas, ground, cls, hot, dict(cut_soil=cut0[2], cut_soil18=cut1[2], cut_sand=cut2[2], seams=sp.seams(base, jo[0]),
                                          road_band=[ROAD_TOP, H], line_y=LINE_Y, walk=[WALK_TOP, ROAD_TOP])


CHURCH, (CH_DOOR, CH_TBASE), CH_LABEL = chm.church()
CH_NAVE_FOOT = CH_TBASE - chm.T_FWD
CH_XT = 10 + chm.T_EAVE                               # the church's own layout (chm.church(), the same lines)
CH_XN = CH_XT + chm.TW - chm.M(0.6)
CH_XH = CH_XN + chm.NAVE
assert np.array_equal(np.asarray(CHURCH), np.asarray(Image.open(os.path.join(AB, 'settlement/COOK4_CHURCH_STRAIGHT_ROOF.png')).convert('RGBA'))), 'the church file and its code agree'
CASINO, (CAS_DOOR, CAS_FOOT), CAS_LABEL = cam.casino()
assert np.array_equal(np.asarray(CASINO), np.asarray(Image.open(os.path.join(AB, 'settlement/COOK4_CASINO_STRAIGHT_ROOF.png')).convert('RGBA'))), 'the casino file and its code agree'
GAR_X = -700                         # its garage door and drive on the glass, its front door past the frame
PORCH_X = 640
CH_X = 1530
CAS_X = W - 640                      # the gaming hall's end wall and its open doors at the frame
MOTEL_X = W - 1180                   # the Strip's motel behind it, its office and four rooms on the glass
MOTEL_FOOT = CASINO_FOOT - D(14.0)
def _foot(im):
    a = np.asarray(im)[..., 3] == 255; cov = a.mean(1)
    return int(np.where(cov >= 0.5 * cov.max())[0].max()) + 1     # the last row the wall still covers
MOT_FOOT = _foot(Image.open(os.path.join(AB, 'settlement/COOK4_MOTEL_STRAIGHT_ROOF.png')).convert('RGBA'))


# ---- 4. THE MEASURES ---------------------------------------------------------------------------------------------
def medians(img, cls):
    a = np.asarray(img.convert('RGB')).astype(float)
    return {k: np.median(a[cls == v], 0) for k, v in (('dirt', 0), ('walk', 1), ('asphalt', 2), ('forecourt', 5))}


def before_measure(seen):
    """the picture Church opens on today: its ground's colours by cluster, nearest the map's dirt and asphalt"""
    b = np.asarray(Image.open(BEFORE).convert('RGB')).astype(float)
    X = b.reshape(-1, 3)[np.random.RandomState(2).choice(b.shape[0] * b.shape[1], 60000, replace=False)]
    C, lb = kmeans(X, 10); share = np.bincount(lb, minlength=10) / len(X)
    dirt = C[int(np.argmax(share))]
    asph = min(C, key=lambda c: dE(c, seen['asphalt']))
    return {'dirt': dirt, 'asphalt': asph}, b


def edge_bands(img, cls, seen, n=64):
    a = np.asarray(img.convert('RGB')).astype(float); out = {}
    for side, sl in (('left', (slice(None), slice(0, n))), ('right', (slice(None), slice(W - n, W))),
                     ('top', (slice(0, n), slice(None))), ('bottom', (slice(H - n, H), slice(None)))):
        m = cls[sl] == 0; px = a[sl][m]
        out[side] = {'dirt_share': round(float(m.mean()), 2), 'dirt_dE_to_map': dE(np.median(px, 0), seen['dirt']) if len(px) else None,
                     'road_runs_through': bool((cls[sl] == 2).any())}
    inside = a[n:H - n, n:W - n][cls[n:H - n, n:W - n] == 0]
    out['inside_dirt_dE_to_map'] = dE(np.median(inside, 0), seen['dirt'])
    return out


WHOLE_RED = [0]


# ---- 5. THE SHEET ------------------------------------------------------------------------------------------------
def sheet(pic, before, shot, rd, plan, seen, gain, meas, hot, red_cells):
    F, f, s = sp.font(34), sp.font(23), sp.font(19)
    INK, DIM, HOT, OK_ = (236, 230, 218), (176, 168, 152), (226, 162, 72), (150, 200, 120)
    Wd, pad = 2400, 30
    rows = []
    def text_block(lines, fnt, col, width=Wd - 2 * pad, gap=6):
        tmp = Image.new('RGB', (10, 10)); d = ImageDraw.Draw(tmp); out = []
        for ln in lines: out += [(l, fnt, col) for l in sp.wrap(d, ln, fnt, width)]
        h = sum(fnt.size + gap for _, fnt, _ in out) + 8
        im = Image.new('RGB', (Wd, h), (14, 13, 12)); d = ImageDraw.Draw(im); y = 4
        for l, fn, c in out: d.text((pad, y), l, font=fn, fill=c); y += fn.size + gap
        return im
    rows.append(text_block(['PLACEHOLDER: CHURCH, THE FIRST TOWN YOU TAP, NOW STANDS ON THE MAP\'S OWN GROUND'], F, HOT))
    rows.append(text_block(['The picture Church opens on is cut from what the map has there: the map\'s tan dirt, the map\'s '
                            'big road in front running in at one side and out the other, the suburb\'s tan houses on one side '
                            'and the Strip\'s casino on the other. Nothing stops at an edge. Top: the map as you see it at its '
                            'closest zoom and the map\'s own plan. Middle: the picture Church opens on today, then the new '
                            'one. Bottom: the colours side by side, and pieces at 1:1.'], f, INK))
    # the map at the near stop, centred on Church, and the plan
    cw = 1100; sh = Image.fromarray(shot.astype(np.uint8))
    cy = sh.height // 2; crop = sh.crop((35, cy - 640, 35 + cw, cy + 460))
    plan_im = plan_image(rd).resize((1100, 1100), Image.NEAREST)
    r = Image.new('RGB', (Wd, 1100 + 50), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(crop, (pad, 40)); r.paste(plan_im, (Wd - pad - 1100, 40))
    d.text((pad, 6), 'THE MAP AT ITS CLOSEST ZOOM, CENTRED ON CHURCH (his glass, 1:1)', font=s, fill=DIM)
    d.text((Wd - pad - 1100, 6), 'THE MAP\'S OWN PLAN OF THE 25 BLOCKS ROUND IT (the box: Church)', font=s, fill=DIM)
    rows.append(r)
    # before, at its own pixels across the sheet
    bi = Image.fromarray(before.astype(np.uint8))
    r = Image.new('RGB', (Wd, bi.height + 50), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(bi, (pad, 40))
    d.text((pad, 6), 'BEFORE: THE PICTURE CHURCH OPENS ON TODAY (one of its two, 1:1): his orange soil as bought, a cobble band, slate cottages', font=s, fill=DIM)
    rows.append(r)
    # after, at half size (nearest), then two crops at 1:1
    half = pic.convert('RGB').resize((W // 2, H // 2), Image.NEAREST)
    hp = half.copy(); dh = ImageDraw.Draw(hp)
    for k, b in hot.items():
        bb = [v // 2 for v in b]; dh.rectangle(bb, outline=(226, 162, 72), width=2); dh.text((bb[0] + 4, bb[1] + 2), k.upper(), font=s, fill=(226, 162, 72))
    r = Image.new('RGB', (Wd, half.height * 2 + 100), (14, 13, 12)); d = ImageDraw.Draw(r)
    d.text((pad, 6), 'AFTER: THE NEW PICTURE, WHOLE, AT HALF SIZE (nearest neighbour; the frame cuts the houses, the road leaves both sides)', font=s, fill=DIM)
    r.paste(half.crop((0, 0, min(half.width, Wd - 2 * pad), half.height)), (pad, 40))
    d.text((pad, half.height + 56), 'THE SAME, WITH THE FIVE THINGS YOU TAP (the town\'s buildings, the screen lights the one under your finger)', font=s, fill=DIM)
    r.paste(hp.crop((0, 0, min(half.width, Wd - 2 * pad), half.height)), (pad, half.height + 90))
    rows.append(r)
    c1 = pic.convert('RGB').crop((CH_X - 200, NAVE_FOOT - 520, CH_X - 200 + 1150, H))
    c2 = pic.convert('RGB').crop((0, HOUSE_FOOT - 520, 1150, H))
    hgt = max(c1.height, c2.height)
    r = Image.new('RGB', (Wd, hgt + 50), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(c2, (pad, 40)); r.paste(c1, (Wd - pad - c1.width, 40))
    d.text((pad, 6), 'AT 1:1: THE LEFT EDGE (the garage cut by the frame, the barber, the road running out)', font=s, fill=DIM)
    d.text((Wd - pad - c1.width, 6), 'AT 1:1: THE TOWER DOORS, THE BOARD, THE PEWS FACING THE ROAD', font=s, fill=DIM)
    rows.append(r)
    # the seam: the map's own ground on his glass butted against the picture's left edge, no gap
    mwin = sh.crop((250, 1150, 850, 1750)); pwin = pic.convert('RGB').crop((0, H - 600, 600, H))
    r = Image.new('RGB', (Wd, 600 + 50), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(mwin, (pad, 40)); r.paste(pwin, (pad + 600, 40))
    d.text((pad, 6), 'THE SEAM: the map on his glass (left) butted against the picture\'s edge (right), nothing between: the same tan, the same grey walk, the same asphalt', font=s, fill=DIM)
    rows.append(r)
    # the colours: the map, before, after
    r = Image.new('RGB', (Wd, 420), (14, 13, 12)); d = ImageDraw.Draw(r)
    d.text((pad, 6), 'THE COLOURS (Lab distance from what the map shows; under 5 reads as the same colour)', font=f, fill=INK)
    y = 50
    for k in ('dirt', 'asphalt', 'walk', 'forecourt'):
        d.text((pad, y + 14), k.upper(), font=f, fill=DIM)
        for j, (lbl, c) in enumerate((('THE MAP', seen[k]), ('BEFORE', meas['before'].get(k)), ('AFTER', meas['after'][k]))):
            x = pad + 200 + j * 620
            if c is None: d.text((x, y + 14), lbl + ': none (the old picture has no ' + k + ')', font=s, fill=DIM); continue
            r.paste(Image.new('RGB', (120, 60), tuple(int(v) for v in c)), (x, y))      # a swatch is the colour itself
            dd = '' if j == 0 else '   %.1f off' % dE(c, seen[k])
            d.text((x + 136, y + 18), '%s  (%d, %d, %d)%s' % (lbl, c[0], c[1], c[2], dd), font=s, fill=OK_ if j == 2 else DIM)
        y += 86
    rows.append(r)
    # the twin and the ruler, the caption (rule 114c), the three differences, the numbers
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = Image.open(os.path.join(AB, 'settlement/pack_5_roof_tiles_030.png')).convert('RGBA')
    r = Image.new('RGBA', (Wd, 190), (14, 13, 12, 255)); d = ImageDraw.Draw(r)
    d.text((pad, 6), 'THE TWIN AND THE RULER AT 1:1: his pack house #30, and the man (the screen draws its people a door tall)', font=s, fill=DIM)
    r.alpha_composite(twin, (pad, 40)); r.alpha_composite(man, (pad + twin.width + 40, 40 + twin.height - 112))
    rows.append(r.convert('RGB'))
    e = meas['edges']
    lines = [
        'THE THREE BIGGEST DIFFERENCES FROM WHAT CHURCH OPENS ON TODAY: (1) THE DIRT: his orange soil as bought sat %.1f off the '
        'map\'s dirt; now his same soil tiles, every grain kept, are balanced to the map\'s light and sit %.1f off. (2) THE ROAD: a '
        'cobble band from nowhere; now the map\'s big road is in front, its asphalt %.1f off the map\'s, his worn double yellow, his '
        'kerb, and it leaves both side edges and the bottom. (3) THE NEIGHBOURS: a row of slate cottages; now the suburb\'s tan houses '
        '(your YES) behind their chain link on one side and the Strip\'s casino on the other, as the map has them round the block.'
        % (dE(meas['before']['dirt'], seen['dirt']), dE(meas['after']['dirt'], seen['dirt']), dE(meas['after']['asphalt'], seen['asphalt'])),
        'NO SLAB, NO FRAME, MEASURED: the dirt in a 64 px band at each edge against the map: left %s, right %s, top %s, bottom %s '
        '(the bottom is the road); the road runs through the left and the right edges: %s and %s.'
        % (e['left']['dirt_dE_to_map'], e['right']['dirt_dE_to_map'], e['top']['dirt_dE_to_map'], 'no dirt',
           'yes' if e['left']['road_runs_through'] else 'NO', 'yes' if e['right']['road_runs_through'] else 'NO'),
        'HIS YES STREET AS NUMBERS (DIRECTION\'s floor bar, B1 to B6: pale, desert not orange, no camouflage, grit, a road '
        'that never repeats, no bright orange roof): Church today passes %d of %d, the new picture %d of %d. The map\'s dirt is '
        'a hair more orange than his YES (hue %.1f against the bar\'s 36 to 50), so the dirt is laid on his YES bar, %.1f off the map: '
        'the same dirt to the eye, his street\'s hue.' % (sum(meas['floor_bar_before']['tests'].values()), len(meas['floor_bar_before']['tests']),
        sum(meas['floor_bar']['tests'].values()), len(meas['floor_bar']['tests']), __import__('colorsys').rgb_to_hsv(*(seen['dirt'] / 255))[0] * 360,
        dE(seen['dirt'], meas['laid_dirt'])),
        'ONE WRONG THING: the church\'s pews stand out on the forecourt in rows, facing the road you came in on, not the doors.',
        'Native pixel size: his 96 px pieces at 1:1, 57 px a metre across and 40 a metre front to back. Palette file: '
        'reference/art_pipe/cook4/place_in_the_map/COOK4_THE_MAP_GROUND.json (the map\'s ground as his glass shows it). Light: one '
        'sun, upper left. The picture %d x %d; cell check (the not-vibe-coded ruler on every 96 px cell): the ground %d red; '
        'the whole picture %d red of %d, named in the record.' % (W, H, len(red_cells), WHOLE_RED[0], (W // 96) * (H // 96)),
        'A PLACEHOLDER (rule 101): nothing in the game changes until you say so; then the settlement screen opens Church on this picture '
        'and the map\'s other grounds (the desert wash, the Strip\'s spine) get theirs, one a round.']
    rows.append(text_block(lines, s, INK))
    Ht = sum(x.height for x in rows) + pad
    out = Image.new('RGB', (Wd, Ht), (14, 13, 12)); y = 0
    for x in rows: out.paste(x, (0, y)); y += x.height
    return out


def plan_image(rd):
    S_, g = rd['S'], np.array(rd['grid']).reshape(rd['S'], rd['S'])
    cols = []
    for c in rd['codes']:
        if c == 'null': cols.append((0, 0, 0)); continue
        q = c.split('|'); col = hx(q[1]) if q[1] else hx(q[0])
        if q[4] == '1': col = np.array([255, 240, 120.])
        cols.append(tuple(int(v) for v in col))
    im = Image.fromarray(np.array(cols, np.uint8)[g]); d = ImageDraw.Draw(im)
    fn = rd['FN']; R_ = rd['R']
    d.rectangle([R_ * fn, R_ * fn, (R_ + 1) * fn - 1, (R_ + 1) * fn - 1], outline=(226, 162, 72), width=3)
    return im


def onto_the_bar(c, B):
    """the map's dirt with its hue moved the shortest way into his YES street's band (DIRECTION's B2, with two
    degrees of margin); its saturation and value kept, so it stays the map's dirt to the eye"""
    import colorsys
    h, s_, v = colorsys.rgb_to_hsv(*(np.asarray(c, float) / 255)); lo, hi = B['tests']['B2_hue']
    h = min(max(h * 360, lo + 2), hi - 2) / 360
    return np.array(colorsys.hsv_to_rgb(h, s_, v)) * 255


def main():
    rd, shot, plan, seen, gain, clusters, how = the_map()
    print('the map seen:', {k: (v.round().tolist(), how[k]) for k, v in seen.items()}, 'gain', gain.round(3))
    FBAR = FB.bar()
    target = dict(seen); target['dirt'] = onto_the_bar(seen['dirt'], FBAR)
    print('the dirt laid: the map\'s', seen['dirt'].round().tolist(), 'on his YES bar', target['dirt'].round().tolist(), dE(seen['dirt'], target['dirt']), 'off')
    best = None
    for contrast in (1.0, 0.92, 0.85, 0.78, 0.7):        # his grain kept whole unless his YES bar or the cell check says otherwise
        pic, ground, cls, hot, info = place(target, contrast)
        fb = FB.measure(np.asarray(pic.convert('RGB')), FBAR)
        print('contrast', contrast, 'floor bar', fb['tests'], fb['ground'])
        if not fb['pass']:
            if best is None: best = (pic, ground, cls, hot, info, None, contrast, fb)
            continue
        red = cell_check(ground)
        print('  red ground cells', len(red))
        best = (pic, ground, cls, hot, info, red, contrast, fb)
        if not red: break
    pic, ground, cls, hot, info, red, contrast, fb = best
    red = red if red is not None else cell_check(ground)
    fb_before = FB.measure(np.asarray(Image.open(BEFORE).convert('RGB')), FBAR)
    whole = cell_check(pic)                              # the whole picture, every laid piece in it: said, not hidden
    print('the whole picture: %d red cells' % len(whole), [r[:3] for r in whole])
    after = medians(ground, cls)
    bm, before = before_measure(seen)
    edges = edge_bands(ground, cls, seen)
    meas = {'after': after, 'before': bm, 'edges': edges, 'floor_bar': fb, 'floor_bar_before': fb_before, 'laid_dirt': target['dirt']}
    pic.convert('RGB').save(PIC, lossless=True, method=6)
    rd_tier = {'tier': 'town', 'ground': 'suburb', 'place': 'Church', 'src': os.path.basename(PIC), 'px': [W, H],
               'px_per_metre': round(PPM, 2), 'depth': DEPTH, 'hotspots': {k: {'box': v, 'kind': k} for k, v in hot.items()},
               'night_src': None, 'placeholder': True,
               'note': 'COOK FOUR [the place sits in the map] round 14: the town picture for a town whose block stands on the suburb grid by the '
                       'arterial (Church first). A candidate (rule 100): RUN TWO picks it by the place\'s ground when he says so. At 1:1 on a 3x '
                       'phone the picture is 73 percent of the glass tall and 3.6 phone-widths wide; the screen pans it.'}
    json.dump(rd_tier, open(PIC_JSON, 'w'), indent=1)
    ramp = lambda k: [int(v) for v in np.percentile(np.asarray(ground.convert('RGB')).astype(float)[cls == k] @ np.array([.299, .587, .114]), [10, 30, 50, 70, 90])]
    pal = {'what': 'the map\'s ground as his glass shows it at the near stop round Church, and the picture\'s ground read back',
           'plan': {k: [int(x) for x in v] for k, v in plan.items()}, 'seen': {k: [int(round(x)) for x in v] for k, v in seen.items()},
           'light_gain': [round(float(x), 3) for x in gain], 'how_read': how, 'most_drawn_on_the_glass': clusters,
           'picture': {k: [int(round(x)) for x in v] for k, v in after.items()},
           'picture_value_ramp': {'dirt': ramp(0), 'walk': ramp(1), 'asphalt': ramp(2), 'forecourt': ramp(5)}}
    json.dump(pal, open(PALETTE, 'w'), indent=1)
    WHOLE_RED[0] = len(whole)
    sh = sheet(pic, before, shot, rd, plan, seen, gain, meas, hot, red)
    sh.save(SHEET, quality=90, method=6)
    nums = {'place': rd['name'], 'tier': rd['tier'], 'district': rd['district'], 'block': [rd['x'], rd['y']],
            'neighbours': [(b['dx'], b['dy'], b['district']) for b in rd['blocks']], 'picture': [W, H], 'contrast_kept': contrast,
            'dE': {k: {'before': dE(bm[k], seen[k]) if k in bm else None, 'after': dE(after[k], seen[k])} for k in ('dirt', 'asphalt', 'walk', 'forecourt')},
            'edges': edges, 'hotspots': hot, 'floor_bar_after': fb, 'floor_bar_before': fb_before,
            'dirt_laid_on_his_bar': [int(round(x)) for x in target['dirt']], 'dirt_laid_dE_to_the_map': dE(seen['dirt'], target['dirt']), 'cell_check_red': len(red), 'cell_check': [r[:3] for r in red][:40],
            'cell_check_whole_picture': [[r[0], r[1], r[2], r[3]] for r in whole], 'lay': info}
    json.dump(nums, open(NUMBERS, 'w'), indent=1, default=lambda o: o.tolist() if hasattr(o, 'tolist') else str(o))
    print(json.dumps(nums['dE']), 'edges', json.dumps({k: v for k, v in edges.items()}))
    print('picture', PIC, pic.size, 'sheet', SHEET, sh.size, 'hotspots', hot)


if __name__ == '__main__':
    main()
