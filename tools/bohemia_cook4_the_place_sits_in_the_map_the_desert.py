#!/usr/bin/env python3
"""COOK FOUR [the place sits in the map], round 20 (10/19): GROUND THREE, THE DESERT OUT IN THE REGION: GOODSPRINGS, A
CAMP ON THE MAP'S OWN GROUND.

The row (PAOLO 10/10, 'the settlements all look like dogshit and not organic with the map'; rule 86): 'the settlement
picture's edges meet the map's ground it stands on (the desert wash, the suburb grid, the strip's spine): the same dirt,
the same road running in and out, no slab, no frame; a sheet per ground'.  Round one was the suburb grid (Church), round
two the Strip's spine (the Mob).  This is the third ground, the open desert past the valley, on a place that stands in it:
GOODSPRINGS (WORLD's real land, engine/BOHEMIA_REGION_LAND.json: a camp, a trailer-park block in the Goodsprings Valley,
41 km from the Strip, 'the Pioneer Saloon, 1913; a lead and zinc camp that never quite died'), read off the demo by
tools/bohemia_cook4_the_place_sits_in_the_map_read.js Goodsprings.
WHAT THE MAP HOLDS THERE: the region's land codes round the block (11 x 11): open desert south, hills north, a state route
(NV-161) through the camp east to west, a dirt track north out of it into the hills.  On his glass at the near stop the
desert is the region painter's flat tans (one tan on 84 percent of the ground, a pale and a dark on about 6 each), the road
a warm dark asphalt edged with a pale casing.
WHAT WAS WRONG, MEASURED: the picture a camp opens on today is this lane's round-3 pack camp
(slices/settlement_ground_packs/camp_0.webp, a placeholder, never edited): his soil as bought, orange, tents round a fire,
no road; its numbers against the map are on the sheet.
HOW BATTLE BROTHERS DOES IT (rule 41): a town screen's backdrop is the terrain its world tile has (steppe, desert, snow),
so the place you enter is the place you saw; a small place reads small: a few huts and a fire.  OURS: the region's
desert and its road, the camp a trailer-park town gone to tents.
THE PICTURE (4224 x 1728, 74 m across, 43 m of ground; nothing drawn, his tiles cut and laid at their own pixels; every
building this lane's file at 1:1, laid under the scene's one shadow rule, the files untouched):
  * THE GROUND: his yard soil (#0, #18 in patches) cut to meet and toned to the map's desert tan by brightness (round two's
    way: each pixel the map's colour times its own brightness over his median's), his sand #3 in the map's pale tone where
    the camp's feet and wheels wore it (the track north, round the fire); his dry brush (16. Dead trees and plants) and his
    stones (Rocks and stones) scattered over it, more of them toward the hills at the top.
  * THE ROAD: COOK TWO's asphalt cells balanced to the map's asphalt, his worn double yellow, no kerb and no walk (a state
    route in the desert): his sand in the map's casing colour as the shoulder, drifted over the asphalt's edge; it runs off
    both sides and the bottom.  The track leaves the road and runs out of the top edge, as the map's dirt track does.
  * THE CAMP: the round-5 corner shop as the general store = STALL, his post and rail in front of it = POSTS, his chalk
    easel by its door = BOARD; the pass-two porch ranch = BARBER; the pass-two plain ranch = CLINIC; the pass-two wing and
    garage ranches cut by the frame at the back; his tents (14. Camp and tents #2, #3) round one fire ring (#15).
  * ONE WRONG THING: his drying rack (14. #6) hung with fish, in a camp 60 km from any water.
REFERENCE CHECK (9/4 compare law; rule 82: the twin is the world it lands in): compared to the map itself at its closest
zoom, centred on Goodsprings (his glass, on the sheet), the region's own land codes round it, the picture a camp opens on
today, his pack house #30 and the man at 1:1.  structure taken: the map's desert, pale, asphalt and casing colours, the
road through and the track north; what changed: the colour of his ground tiles (a toning), nothing else of his.
REUSE CHECK (REUSE-FIRST, 7/22): round one's tool (tools/bohemia_cook4_the_place_sits_in_the_map.py) for the field that
meets, the patch mask, COOK TWO's cells, the building and prop laying, the measures; round two's
(tools/bohemia_cook4_the_place_sits_in_the_map_the_strip.py) for the toning by brightness and the footing (imported, not
copied); the buildings are this lane's files; the floor bar DIRECTION's; the cell check the church's.  New here: the
region read of the glass (clusters, not plan colours: the region has no fine grid), the shoulder, the track, the scatter,
the composition, the sheet.
OUTPUT (rule 100: candidates only): reference/art_pipe/cook4/place_in_the_map/COOK4_CAMP_GOODSPRINGS_ON_THE_DESERT.webp and
.json (the screen's camp schema), the sheet records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_DESERT.webp, the numbers
records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_DESERT.json.  Native pixel size: his 96 px pieces at 1:1, 57 px a metre
across, 40 deep.  Palette file: reference/art_pipe/cook4/place_in_the_map/COOK4_THE_MAP_GROUND_THE_DESERT.json.  Light: one
sun, upper left.

    node tools/bohemia_cook4_the_place_sits_in_the_map_read.js Goodsprings     (the map, once)
    python3 tools/bohemia_cook4_the_place_sits_in_the_map_the_desert.py         (a few minutes)
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)
import bohemia_cook4_the_place_sits_in_the_map as p1          # round one: the field, the balance, the laying, the measures
import bohemia_cook4_the_place_sits_in_the_map_the_strip as p2  # round two: the toning by brightness, the footing
S, B, sp, FB, cell_check = p1.S, p1.B, p1.sp, p1.FB, p1.cell_check
M, D, dE = p1.M, p1.D, p1.dE

DIR = p1.DIR
READ = os.path.join(DIR, 'COOK4_PLACE_GOODSPRINGS.json')
PIC = os.path.join(DIR, 'COOK4_CAMP_GOODSPRINGS_ON_THE_DESERT.webp')
PIC_JSON = os.path.join(DIR, 'COOK4_CAMP_GOODSPRINGS_ON_THE_DESERT.json')
PALETTE = os.path.join(DIR, 'COOK4_THE_MAP_GROUND_THE_DESERT.json')
SHEET = os.path.join(ROOT, 'records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_DESERT.webp')
NUMBERS = os.path.join(ROOT, 'records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_DESERT.json')
BEFORE = os.path.join(ROOT, 'slices/settlement_ground_packs/camp_0.webp')
W, H = 4224, 1728
p1.W, p1.H = W, H                                             # round one's laying reads the canvas size from its module
ROAD_TOP = H - D(7.0)                                         # the near lane, the centre line, the start of the far lane
LINE_Y = ROAD_TOP + D(3.6)
SHOULDER = ROAD_TOP - D(1.2)                                  # a 1.2 m gravel shoulder, no kerb, no walk
STORE_FOOT = SHOULDER - D(6.0)                                # the store's 6 m of dirt to pull a truck onto
BARBER_FOOT = SHOULDER - D(8.0)
CLINIC_FOOT = SHOULDER - D(9.5)
CAMP_FOOT = SHOULDER - D(15.0)                                # the tents' front row, behind the buildings
BACK_FOOT = SHOULDER - D(22.0)
TRACK = (2240, 2470)                                          # the dirt track north: at the road, at the top edge
SEED = 2020
BRUSH = [('16. Dead trees and plants', i) for i in (19, 20, 21, 22, 23, 39)]          # not #38: it carries its own square of dark ground
STONES = [('Rocks and stones', i) for i in (47, 48, 49, 59, 60, 61, 63, 64, 7, 20)]
BIG = [('Rocks and stones', i) for i in (1, 2, 11, 13, 14)]
TENTS = [('14. Camp and tents', 2), ('14. Camp and tents', 3)]
UI_OUT = [(678, 54, 1170, 1080), (24, 60, 160, 190), (465, 1025, 700, 1240), (0, 2160, 1170, 2382)]   # the phone, the gear, the token, the pad


def the_map():
    """the region has no fine grid (cellAt is the valley's), so his glass is read by what it shows: the ground under the
    phone and over the pad (the phone, the gear button, the place's token and the pad left out) in six clusters; the
    asphalt is the dark the road draws, the casing the ring round it, the desert tan the biggest cluster with its near
    neighbours (the painter's gentle light across the glass), the pale and the dark the two others with a real share"""
    rd = json.load(open(READ))
    shot = np.asarray(Image.open(os.path.join(ROOT, rd['shot'])).convert('RGB')).astype(float)
    keep = np.zeros(shot.shape[:2], bool); keep[200:2160] = True
    for x0, y0, x1, y1 in UI_OUT: keep[y0:y1, x0:x1] = False
    L = shot @ np.array([.299, .587, .114])
    road = keep & (L < 62)
    ring = np.asarray(Image.fromarray(road.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(13))).astype(bool) & ~road & keep
    rng = np.random.RandomState(1)
    X = shot[keep & ~road]; X = X[rng.choice(len(X), min(80000, len(X)), replace=False)]
    C, lb = p1.kmeans(X, 6); share = np.bincount(lb, minlength=6) / len(X)
    big = int(np.argmax(share)); near = [i for i in range(6) if dE(C[i], C[big]) <= 8]
    main = np.median(X[np.isin(lb, near)], 0)
    Lc = C @ np.array([.299, .587, .114]); Lm = main @ np.array([.299, .587, .114])
    rest = [i for i in range(6) if i not in near and share[i] >= 0.02]
    pale = max((i for i in rest if Lc[i] > Lm + 12), key=lambda i: share[i])
    dark = max((i for i in rest if Lc[i] < Lm - 20), key=lambda i: share[i])
    Rp = shot[ring]; Cr, lr = p1.kmeans(Rp[rng.choice(len(Rp), min(20000, len(Rp)), replace=False)], 4)
    casing = Cr[int(np.argmax(np.bincount(lr, minlength=4)))]
    seen = {'dirt': main, 'pale': C[pale], 'dark': C[dark], 'asphalt': np.median(shot[road], 0), 'shoulder': casing}
    shares = {'dirt': round(float(share[near].sum()), 3), 'pale': round(float(share[pale]), 3), 'dark': round(float(share[dark]), 3),
              'asphalt': round(float(road.sum() / keep.sum()), 3)}
    return rd, shot, seen, shares, [{'rgb': [int(v) for v in C[i]], 'share': round(float(share[i]), 3)} for i in np.argsort(-share)]


def field_noise(w, h, cells, seed):
    g = np.random.RandomState(seed).rand(cells[1], cells[0])
    return np.asarray(Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(float) / 255


def wobble(n, amp, seed, cells=24):
    """a smooth wandering offset along a line (n samples), amp px each way, plus a fine jitter: an edge nobody ruled"""
    r = np.random.RandomState(seed)
    k = np.interp(np.arange(n), np.linspace(0, n - 1, cells), r.uniform(-1, 1, cells))
    return (k * amp + r.uniform(-1, 1, n) * amp * 0.25).round().astype(int)


def ground(seen, contrast, worn, ruts):
    """his soil to every edge toned to the map's desert tan; his sand where feet and wheels wore it (round one's worn
    paths, a shade over the dirt) with his darker soil in the wheel ruts; the road, his double yellow; the shoulder his sand
    in the map's casing colour, its edge wandering and drifted over the asphalt's edge"""
    rng = np.random.RandomState(SEED)
    cls = np.zeros((H, W), np.uint8)                       # 0 dirt, 2 asphalt, 3 line, 6 shoulder, 7 worn
    jo = []
    base, cut0 = p1.field(p1.SOIL, 'soil0', W, H, SEED, jo)
    alt, _ = p1.field(p1.SOIL2, 'soil18', W, H, SEED + 1)
    sand, _ = p1.field(p1.SAND, 'soil3', W, H, SEED + 2)
    bl = p2.balance_lum
    g = bl(np.asarray(base.convert('RGB')), seen['dirt'], contrast)
    g2 = bl(np.asarray(alt.convert('RGB')), seen['dirt'], contrast)
    g = np.where(p1.noise_mask(W, H, (52, 20), SEED + 3, 0.74)[..., None], g2, g)
    land = np.zeros((H, W), bool); land[:SHOULDER] = True
    wm = worn & land
    g = np.where(wm[..., None], bl(np.asarray(sand.convert('RGB')), seen['dirt'] * 1.07, contrast), g); cls[wm] = 7
    rm = ruts & land
    g = np.where(rm[..., None], bl(np.asarray(alt.convert('RGB')), seen['dirt'] * 0.93, contrast), g); cls[rm] = 7
    road = p1.grid_cells(W, H - ROAD_TOP, S.ROAD, B.ROADS).astype(float)
    lt = S.pad(S.cut_frame(S.pack(S.ROAD, p1.LINES[0]), S.ROAD), B.TW, B.TH)[..., :3]
    rows = np.where(lt[..., 0].astype(int) - lt[..., 2] > 40)[0]
    l0, l1 = int(rows.min()) - 3, int(rows.max()) + 4
    bh = l1 - l0; ly = LINE_Y - ROAD_TOP - bh // 2
    x = -int(rng.randint(0, B.TW)); last = None
    while x < W:
        k = rng.choice([i for i in p1.LINES if i != last]); last = k
        c = S.pad(S.cut_frame(S.pack(S.ROAD, k), S.ROAD), B.TW, B.TH)[l0:l1, :, :3]
        xs, xe = max(x, 0), min(x + B.TW, W); road[ly:ly + bh, xs:xe] = c[:, xs - x:xe - x]; x += B.TW
    road = p1.balance(road, np.ones(road.shape[:2], bool), seen['asphalt'], 1.0)
    paint = np.zeros(road.shape[:2], bool); paint[ly:ly + bh] = True; paint &= road[..., 0] - road[..., 2] > 18
    g[ROAD_TOP:] = road; cls[ROAD_TOP:] = 2; cls[ROAD_TOP:][paint] = 3
    top = SHOULDER + wobble(W, 14, SEED + 9); low = ROAD_TOP + 2 + np.abs(wobble(W, 9, SEED + 10, 60))
    yy = np.arange(H)[:, None]
    sh = (yy >= top[None, :]) & (yy < low[None, :])
    g = np.where(sh[..., None], bl(np.asarray(sand.convert('RGB')), seen['shoulder'], contrast), g); cls[sh] = 6
    img = Image.fromarray(g.round().clip(0, 255).astype(np.uint8)).convert('RGBA')
    return img, cls, dict(cut_soil=cut0[2], seams=sp.seams(base, jo[0]))


def track_mask():
    """the dirt track north: 3 m of wheel-worn ground from the shoulder to the top edge in a slow bend, its edges
    wandering; two wheel ruts 1.6 m apart in it"""
    m = np.zeros((H, W), bool); r = np.zeros((H, W), bool); yy = np.arange(SHOULDER + 8)
    t = 1 - yy / max(SHOULDER - 1, 1)
    cx = TRACK[0] + (TRACK[1] - TRACK[0]) * t + 60 * np.sin(t * 2.6)
    el, er = wobble(len(yy), 12, SEED + 12), wobble(len(yy), 12, SEED + 13)
    half, rh = M(1.5), M(0.8)
    for y, c, a, b in zip(yy, cx, el, er):
        m[y, max(0, int(c - half + a)):int(c + half + b)] = True
        for s_ in (-1, 1):
            q = int(c + s_ * rh); r[y, max(0, q - 7):q + 7] = True
    return m, r


def blob(m, cx, cy, rx, ry, seed):
    """trodden ground round a place feet keep going: an ellipse whose rim wanders"""
    yy, xx = np.ogrid[:H, :W]
    ang = np.arctan2((yy - cy) / ry, (xx - cx) / rx)
    wob = 1 + 0.18 * np.sin(3 * ang + seed) + 0.1 * np.sin(7 * ang + 2 * seed)
    m |= ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 <= wob ** 2
    return m


def compose(seen, contrast):
    store, st_foot = p2.footed(os.path.join(p1.AB, 'settlement/COOK4_CORNER_SHOP_STRAIGHT_ROOF.png'))
    porch, po_foot = p2.footed(os.path.join(p1.AB, 'settlement/COOK4_RANCH_PASS2_PORCH.png'))
    plain, pl_foot = p2.footed(os.path.join(p1.AB, 'settlement/COOK4_RANCH_PASS2_PLAIN.png'))
    wing, wi_foot = p2.footed(os.path.join(p1.AB, 'settlement/COOK4_RANCH_PASS2_WING.png'))
    garage, ga_foot = p2.footed(os.path.join(p1.AB, 'settlement/COOK4_RANCH_PASS2_GARAGE.png'))
    xs = {'wing': -260, 'clinic': 330, 'store': 1360, 'barber': 2760, 'garage': W - 820}
    fire = (1800, CAMP_FOOT - D(9.0))                                   # in the open ground behind the store
    worn, ruts = track_mask()
    worn = blob(worn, fire[0] + 48, fire[1] - 20, M(5.2), D(4.2), 1)                    # round the fire
    worn = blob(worn, xs['store'] + store.width // 2, STORE_FOOT + D(3.0), M(3.4), D(2.6), 2)   # the store's front
    canvas, cls, info = ground(seen, contrast, worn, ruts)
    ground_img = canvas.copy()
    hot = {}
    lb = p1.lay_building
    items = []                                            # (foot, order, callable): laid far to near
    items.append((BACK_FOOT, 0, lambda: lb(canvas, wing, xs['wing'], BACK_FOOT - wi_foot)))
    items.append((BACK_FOOT - D(3.0), 0, lambda: lb(canvas, garage, xs['garage'], BACK_FOOT - D(3.0) - ga_foot)))
    items.append((CLINIC_FOOT, 0, lambda: lb(canvas, plain, xs['clinic'], CLINIC_FOOT - pl_foot, hot, 'clinic')))
    items.append((STORE_FOOT, 0, lambda: lb(canvas, store, xs['store'], STORE_FOOT - st_foot, hot, 'stall')))
    items.append((BARBER_FOOT, 0, lambda: lb(canvas, porch, xs['barber'], BARBER_FOOT - po_foot, hot, 'barber')))
    # the camp: his tents in a loose ring round the one fire (where the trailers stood), the rack by the fire
    rng = np.random.RandomState(SEED + 11)
    tents = []
    for k, a in enumerate(np.linspace(0.3, 2 * np.pi + 0.3, 10, endpoint=False)):
        rx, ry = M(6.4) + rng.randint(-30, 30), D(5.0) + rng.randint(-14, 14)
        tx, tf = int(fire[0] + 48 + rx * np.cos(a) - 44), int(fire[1] + ry * np.sin(a))
        if abs(tx + 44 - (TRACK[0] + (TRACK[1] - TRACK[0]) * (1 - tf / SHOULDER))) < M(2.6): continue   # not on the track
        tents.append((tx, tf))
    for k, (tx, tf) in enumerate(tents):
        items.append((tf, 1, (lambda tx=tx, tf=tf, k=k: p1.lay_prop(canvas, TENTS[k % 2], tx, tf, flip=bool(k % 3 == 1)))))
    items.append((fire[1], 1, lambda: p1.lay_prop(canvas, ('14. Camp and tents', 15), fire[0], fire[1])))
    items.append((fire[1] - D(1.6), 1, lambda: p1.lay_prop(canvas, ('14. Camp and tents', 6), fire[0] + 150, fire[1] - D(1.6))))
    items.append((fire[1] + D(1.2), 1, lambda: p1.lay_prop(canvas, ('14. Camp and tents', 23), fire[0] - 70, fire[1] + D(1.2))))
    items.append((fire[1] + D(1.6), 1, lambda: p1.lay_prop(canvas, ('14. Camp and tents', 27), fire[0] + 120, fire[1] + D(1.6))))
    # the store's front: his post and rail three long (the hitching rail) and his chalk easel by the door
    rail_y = STORE_FOOT + D(3.4)
    for k in range(3):
        items.append((rail_y, 2, (lambda k=k: p1.lay_prop(canvas, ('7. Fences and palisades', 2), xs['store'] - 40 + k * 92, rail_y, hot, 'posts'))))
    items.append((STORE_FOOT + D(1.2), 2, lambda: p1.lay_prop(canvas, ('13. Port market', 30), xs['store'] + store.width - 40, STORE_FOOT + D(1.2), hot, 'board')))
    # the scatter: his brush and his stones over the open desert, more toward the hills at the top; never on a building,
    # the track, the camp's trodden ground or the road
    boxes = [(xs['wing'], BACK_FOOT - wing.height, xs['wing'] + wing.width, BACK_FOOT + 30),
             (xs['garage'], BACK_FOOT - D(3.0) - garage.height, W, BACK_FOOT - D(3.0) + 30),
             (xs['clinic'] - 30, CLINIC_FOOT - plain.height, xs['clinic'] + plain.width + 30, CLINIC_FOOT + 40),
             (xs['store'] - 80, STORE_FOOT - store.height, xs['store'] + store.width + 80, rail_y + 40),
             (xs['barber'] - 30, BARBER_FOOT - porch.height, xs['barber'] + porch.width + 30, BARBER_FOOT + 40),
             (fire[0] - 420, fire[1] - D(5.0) - 130, fire[0] + 520, fire[1] + D(5.0) + 30)]
    def free(x, y, w):
        if y > SHOULDER - 20 or y < 40: return False
        if worn[max(0, y - 30):y, max(0, x):min(W, x + w)].any(): return False
        return not any(x + w > b[0] and x < b[2] and y > b[1] and y - 90 < b[3] for b in boxes)
    # the creosote grows in clumps (a patch noise says where), the stones lie where the hills shed them (toward the top)
    clump = field_noise(W, H, (30, 12), SEED + 14)
    placed = 0; tries = 0
    while placed < 95 and tries < 8000:
        tries += 1
        y = int(rng.triangular(40, 40, SHOULDER - 20)); x = int(rng.randint(-40, W - 40))
        if clump[min(H - 1, y), min(W - 1, max(0, x + 48))] < 0.5 and rng.rand() < 0.8: continue
        top = y < D(12)
        pool = (BIG if rng.rand() < 0.2 else STONES) if (top and rng.rand() < 0.45) else (BRUSH if rng.rand() < 0.8 else STONES)
        tile = pool[rng.randint(len(pool))]
        if not free(x, y, 96): continue
        items.append((y, 3, (lambda tile=tile, x=x, y=y, f=bool(rng.rand() < 0.5): p1.lay_prop(canvas, tile, x, y, flip=f))))
        boxes.append((x - 20, y - 70, x + 116, y + 10)); placed += 1
    for k, (tx, ty) in enumerate(((560, SHOULDER - D(3.0)), (3600, BARBER_FOOT + D(2.4)))):
        items.append((ty, 3, (lambda tx=tx, ty=ty, k=k: p1.lay_prop(canvas, ('16. Dead trees and plants', (3, 9)[k]), tx, ty))))
    for foot, _, f in sorted(items, key=lambda t: (t[0], t[1])): f()
    return canvas, ground_img, cls, hot, info, xs, placed


def medians(img, cls):
    a = np.asarray(img.convert('RGB')).astype(float)
    return {k: (np.median(a[cls == v], 0) if (cls == v).any() else None)
            for k, v in (('dirt', 0), ('asphalt', 2), ('shoulder', 6), ('worn', 7))}


def main():
    rd, shot, seen, shares, clusters = the_map()
    FBAR = FB.bar()
    print('the map seen:', {k: v.round().tolist() for k, v in seen.items()}, shares)
    # MEASURED (the first run of this round, said in the record): the map's own pale and dark laid as patches at the map's
    # own shares (6 and 5 percent) read as a camouflage print, DIRECTION's B3 at 23 to 27 against 9; the map draws them as
    # its painter's flat diamonds, not as ground.  So the dirt is one tone, his sand only where feet and wheels wore it.
    glass = FB.measure(shot[200:2160, 0:460].astype(np.uint8), FBAR)               # the map's own ground, the same bar
    print('the map\'s own glass on the bar', glass['tests'], glass['ground'])
    best = None
    for contrast in (1.0, 0.9, 0.8, 0.7):
        pic, gimg, cls, hot, info, xs, placed = compose(seen, contrast)
        fb = FB.measure(np.asarray(pic.convert('RGB')), FBAR)
        print('contrast', contrast, fb['tests'], fb['ground'])
        # B1 and B3 are the map's own (its desert's strength; its road casing on the shoulder, a second tone 32 brighter):
        # the land alone, the shoulder and the road cut off, is measured too
        land = FB.measure(np.asarray(gimg.convert('RGB'))[:SHOULDER - 24], FBAR)
        print('  the land alone', land['tests'], land['ground'])
        others = {k: v for k, v in fb['tests'].items() if k not in ('B1', 'B3')}
        if not all(others.values()) and contrast > 0.7: continue
        red = cell_check(gimg); print('  ground red', len(red))
        best = (pic, gimg, cls, hot, info, xs, red, contrast, fb, placed, land)
        if not red: break
    pic, gimg, cls, hot, info, xs, red, contrast, fb, placed, land = best
    whole = cell_check(pic); print('whole picture red', len(whole), [r[:3] for r in whole])
    after = medians(gimg, cls)
    before = np.asarray(Image.open(BEFORE).convert('RGB')).astype(float)
    Xb = before.reshape(-1, 3)[np.random.RandomState(2).choice(before.shape[0] * before.shape[1], 60000, replace=False)]
    Cb, lbb = p1.kmeans(Xb, 10); shb = np.bincount(lbb, minlength=10) / len(Xb)
    bm = {'dirt': Cb[int(np.argmax(shb))]}
    fb_before = FB.measure(before.astype(np.uint8), FBAR)
    edges = p1.edge_bands(gimg, cls, seen)
    pic.convert('RGB').save(PIC, lossless=True, method=6)
    json.dump({'tier': 'camp', 'ground': 'desert', 'place': 'GOODSPRINGS', 'src': os.path.basename(PIC), 'px': [W, H],
               'px_per_metre': round(p1.PPM, 2), 'depth': p1.DEPTH, 'hotspots': {k: {'box': v, 'kind': k} for k, v in hot.items()},
               'night_src': None, 'placeholder': True,
               'note': 'COOK FOUR [the place sits in the map] round 20: the camp picture for a place out in the region on open desert '
                       '(Goodsprings first). A candidate (rule 100): RUN TWO picks it by the place\'s ground when he says so; shown at one '
                       'picture pixel to one device pixel and panned.'}, open(PIC_JSON, 'w'), indent=1)
    json.dump({'what': 'the map\'s ground as his glass shows it at the near stop round Goodsprings (the region: clusters of the glass, '
                       'it has no fine grid), and the picture\'s ground read back',
               'seen': {k: [int(round(x)) for x in v] for k, v in seen.items()}, 'shares_of_the_glass': shares, 'clusters': clusters,
               'laid': {'contrast': contrast, 'pale_and_dark_as_patches': False}, 'the_map_on_the_bar': glass, 'the_land_alone_on_the_bar': land,
               'picture': {k: ([int(round(x)) for x in v] if v is not None else None) for k, v in after.items()}}, open(PALETTE, 'w'), indent=1)
    sh, first = sheet(pic, before, shot, rd, seen, after, bm, edges, fb, fb_before, hot, red, whole, glass, land)
    sh.convert('RGB').save(SHEET, quality=90, method=6)
    nums = {'place': rd['name'], 'tier': rd['tier'], 'kind': rd['district'], 'district': rd.get('realDistrict'), 'block': [rd['x'], rd['y']],
            'land': rd.get('land'), 'picture': [W, H], 'contrast_kept': contrast, 'the_map_on_the_bar': glass, 'the_land_alone_on_the_bar': land,
            'dE': {k: {'before': dE(bm[k], seen[k]) if k in bm else None, 'after': dE(after[k], seen[k]) if after[k] is not None else None}
                   for k in ('dirt', 'asphalt', 'shoulder')},
            'edges': edges, 'hotspots': hot, 'scatter_laid': placed,
            'floor_bar_after': fb, 'floor_bar_before': fb_before, 'cell_check_ground_red': len(red),
            'cell_check_whole_picture': [[r[0], r[1], r[2], r[3]] for r in whole], 'first_picture_at': first, 'lay': info, 'x': xs}
    json.dump(nums, open(NUMBERS, 'w'), indent=1, default=lambda o: o.tolist() if hasattr(o, 'tolist') else str(o))
    print(json.dumps(nums['dE']), 'first', first, 'hot', hot)


def plan_image(rd, seen):
    """the region's land codes round the place, one square a block in the colour his glass shows for its kind"""
    kind = {'.': seen['dirt'], 'h': seen['dark'], 't': seen['pale']}
    rows = [r.split(' ') for r in rd['land']]; n = len(rows)
    a = np.zeros((n, n, 3))
    for j, r in enumerate(rows):
        for i, c in enumerate(r):
            a[j, i] = kind.get(c[0], seen['dirt'])
            if c[1] in '123': a[j, i] = seen['asphalt'] if c[1] != '3' else seen['shoulder']
    im = Image.fromarray(a.round().astype(np.uint8)).resize((n * 100, n * 100), Image.NEAREST); d = ImageDraw.Draw(im)
    c = n // 2; d.rectangle([c * 100, c * 100, c * 100 + 99, c * 100 + 99], outline=(226, 162, 72), width=4)
    return im


def sheet(pic, before, shot, rd, seen, after, bm, edges, fb, fb_before, hot, red, whole, glass, land):
    F, f, s = sp.font(34), sp.font(23), sp.font(19)
    INK, DIM, HOT, OK_ = (236, 230, 218), (176, 168, 152), (226, 162, 72), (150, 200, 120)
    Wd, pad = 2700, 30
    rows = []
    def text_block(lines, fnt, col):
        tmp = Image.new('RGB', (10, 10)); d = ImageDraw.Draw(tmp); out = []
        for ln in lines: out += [(l, fnt, col) for l in sp.wrap(d, ln, fnt, Wd - 2 * pad)]
        h = sum(fn.size + 6 for _, fn, _ in out) + 8
        im = Image.new('RGB', (Wd, h), (14, 13, 12)); d = ImageDraw.Draw(im); y = 4
        for l, fn, c in out: d.text((pad, y), l, font=fn, fill=c); y += fn.size + 6
        return im
    rows.append(text_block(['PLACEHOLDER: GOODSPRINGS, A CAMP OUT IN THE DESERT, ON THE MAP\'S OWN GROUND'], F, HOT))
    rows.append(text_block(['The picture Goodsprings opens on, cut from what the map has there: the region\'s desert tan (your soil, '
                            'every grain kept, in the map\'s colour), the state road through it running out at both sides with its pale '
                            'shoulder, the dirt track north out of the top, the camp your tan houses and a general store with tents round '
                            'one fire. Top: the map at its closest zoom and the region\'s own blocks round it. Then the picture a camp opens '
                            'on today, then the new one. Bottom: the colours, the seam, the numbers.'], f, INK))
    shi = Image.fromarray(shot.astype(np.uint8))
    crop = shi.crop((0, 600, 1100, 1700))
    plan_im = plan_image(rd, seen)
    r = Image.new('RGB', (Wd, 1150), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(crop, (pad, 40)); r.paste(plan_im, (Wd - pad - plan_im.width, 40))
    d.text((pad, 6), 'THE MAP AT ITS CLOSEST ZOOM ROUND GOODSPRINGS (his glass, 1:1)', font=s, fill=DIM)
    d.text((Wd - pad - plan_im.width, 6), 'THE REGION\'S OWN 11 x 11 BLOCKS ROUND IT (tan desert, dark hills, pale the camp, the roads; the box: its block)', font=s, fill=DIM)
    rows.append(r)
    bi = Image.fromarray(before.astype(np.uint8))
    r = Image.new('RGB', (Wd, bi.height + 50), (14, 13, 12)); d = ImageDraw.Draw(r); r.paste(bi, (pad, 40))
    d.text((pad, 6), 'BEFORE: THE PICTURE A CAMP OPENS ON TODAY (one of its two, 1:1): his orange soil as bought, tents, no road', font=s, fill=DIM)
    rows.append(r)
    y_first = sum(x.height for x in rows) + 40
    half = pic.convert('RGB').resize((W // 2, H // 2), Image.NEAREST)
    hp = half.copy(); dh = ImageDraw.Draw(hp)
    for k, b in hot.items():
        bb = [v // 2 for v in b]; dh.rectangle(bb, outline=HOT, width=2); dh.text((bb[0] + 4, bb[1] + 2), k.upper(), font=s, fill=HOT)
    r = Image.new('RGB', (Wd, half.height * 2 + 100), (14, 13, 12)); d = ImageDraw.Draw(r)
    d.text((pad, 6), 'AFTER: THE NEW PICTURE, WHOLE, AT HALF SIZE (nearest neighbour; the road leaves both sides, the track the top)', font=s, fill=DIM)
    r.paste(half, (pad, 40))
    d.text((pad, half.height + 56), 'THE SAME, WITH THE FIVE THINGS YOU TAP', font=s, fill=DIM)
    r.paste(hp, (pad, half.height + 90))
    rows.append(r)
    first = [pad, y_first, half.width, half.height]
    c1 = pic.convert('RGB').crop((1500, H - 1300, 2800, H))
    c2 = pic.convert('RGB').crop((0, H - 1300, 1300, H))
    r = Image.new('RGB', (Wd, 1350), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(c2, (pad, 40)); r.paste(c1, (Wd - pad - 1300, 40))
    d.text((pad, 6), 'AT 1:1: THE LEFT EDGE (the clinic, the desert running out, the road and its shoulder)', font=s, fill=DIM)
    d.text((Wd - pad - 1300, 6), 'AT 1:1: THE STORE, THE TRACK NORTH, THE TENTS AND THE FIRE', font=s, fill=DIM)
    rows.append(r)
    mwin = shi.crop((60, 1500, 660, 2100)); pwin = pic.convert('RGB').crop((0, H - 600, 600, H))
    r = Image.new('RGB', (Wd, 650), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(mwin, (pad, 40)); r.paste(pwin, (pad + 600, 40))
    d.text((pad, 6), 'THE SEAM: the map on his glass (left) butted against the picture\'s edge (right), nothing between', font=s, fill=DIM)
    rows.append(r)
    r = Image.new('RGB', (Wd, 520), (14, 13, 12)); d = ImageDraw.Draw(r)
    d.text((pad, 6), 'THE COLOURS (Lab distance from what the map shows; under 5 reads as the same colour)', font=f, fill=INK)
    y = 50
    for k in ('dirt', 'pale', 'dark', 'asphalt', 'shoulder'):
        d.text((pad, y + 14), k.upper(), font=f, fill=DIM)
        for j, (lbl, c) in enumerate((('THE MAP', seen[k]), ('BEFORE', bm.get(k)), ('AFTER', after.get(k)))):
            x = pad + 200 + j * 700
            if c is None:
                d.text((x, y + 14), lbl + (': none (the old picture has no ' + k + ')' if j == 1 else ': not laid as patches (they read as a camouflage print, B3)'), font=s, fill=DIM); continue
            r.paste(Image.new('RGB', (120, 60), tuple(int(v) for v in c)), (x, y))
            dd = '' if j == 0 else '   %.1f off' % dE(c, seen[k])
            d.text((x + 136, y + 18), '%s  (%d, %d, %d)%s' % (lbl, c[0], c[1], c[2], dd), font=s, fill=OK_ if j == 2 else DIM)
        y += 86
    rows.append(r)
    man = Image.open(os.path.join(ROOT, 'slices/settlement_people/cast_shortcoat.webp')).convert('RGBA').crop((0, 0, 112, 112))
    twin = Image.open(os.path.join(p1.AB, 'settlement/pack_5_roof_tiles_030.png')).convert('RGBA')
    r = Image.new('RGBA', (Wd, 190), (14, 13, 12, 255)); d = ImageDraw.Draw(r)
    d.text((pad, 6), 'THE TWIN AND THE RULER AT 1:1: his pack house #30, and the man', font=s, fill=DIM)
    r.alpha_composite(twin, (pad, 40)); r.alpha_composite(man, (pad + twin.width + 40, 40 + twin.height - 112))
    rows.append(r.convert('RGB'))
    e = edges
    lines = ['THE THREE BIGGEST DIFFERENCES FROM WHAT A CAMP OPENS ON TODAY: (1) THE GROUND: his soil as bought, orange (%.1f off the '
             'map\'s desert); now his soil toned to it (%.1f off). (2) THE ROAD: none; now the state road the map runs through Goodsprings, '
             'its asphalt %.1f off the map\'s, its shoulder in the map\'s casing, leaving both sides, and the dirt track north out of the top. '
             '(3) THE PLACE: tents on a bare field; now the camp in what the trailer-park town left: the store, two ranches, the tents.'
             % (dE(bm['dirt'], seen['dirt']), dE(after['dirt'], seen['dirt']), dE(after['asphalt'], seen['asphalt'])),
             'HIS YES STREET AS NUMBERS (DIRECTION\'s floor bar, B1 to B6): a camp today passes %d of %d, the new picture %d of %d. '
             'B1 (THE DIRT IS PALE, at most 0.28) reads %.3f: that is the map\'s own desert (the region painter\'s tan is %.3f on his glass; '
             'the map\'s own ground on the same bar: B1 %s at %.3f), kept so the picture meets the map; the bar and the map disagree here, '
             'and it is the map\'s colour that would move. B3 (NO CAMOUFLAGE, at most 9) reads %.1f: the second tone is the shoulder, '
             'his sand in the map\'s own road casing (32 brighter than the desert; the map\'s own ground reads %.1f); the land alone, the '
             'shoulder and the road cut off, reads %.1f.'
             % (sum(fb_before['tests'].values()), len(fb_before['tests']), sum(fb['tests'].values()), len(fb['tests']),
                fb['ground']['sat'] if fb.get('ground') else -1, (seen['dirt'].max() - seen['dirt'].min()) / seen['dirt'].max(),
                'passes' if glass['tests'].get('B1') else 'fails', glass['ground']['sat'] if glass.get('ground') else -1,
                fb['ground']['split'], glass['ground']['split'], land['ground']['split']),
             'NO SLAB, NO FRAME: the dirt in a 64 px band at each edge against the map: left %s, right %s, top %s; the road through both side '
             'edges: %s and %s.' % (e['left']['dirt_dE_to_map'], e['right']['dirt_dE_to_map'], e['top']['dirt_dE_to_map'],
                                     'yes' if e['left']['road_runs_through'] else 'NO', 'yes' if e['right']['road_runs_through'] else 'NO'),
             'Native pixel size: his 96 px pieces at 1:1, 57 px a metre across and 40 deep. Palette file: '
             'reference/art_pipe/cook4/place_in_the_map/COOK4_THE_MAP_GROUND_THE_DESERT.json. Light: one sun, upper left. The picture '
             '%d x %d; the map\'s pale and dark diamonds (6 and 5 percent of its ground) not laid as patches: laid so they read as a '
             'camouflage print (B3 23 to 27, the bar 9); cell check: the ground %d red, the whole picture %d red of %d, named in the record.'
             % (W, H, len(red), len(whole), (W // 96) * (H // 96)),
             'A PLACEHOLDER (rule 101): nothing in the game changes until you say so.']
    rows.append(text_block(lines, s, INK))
    Ht = sum(x.height for x in rows) + pad
    out = Image.new('RGB', (Wd, Ht), (14, 13, 12)); y = 0
    for x in rows: out.paste(x, (0, y)); y += x.height
    return out, first


if __name__ == '__main__':
    main()
