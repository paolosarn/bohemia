#!/usr/bin/env python3
"""COOK FOUR [the place sits in the map], round 19 (10/19): GROUND TWO, THE STRIP'S SPINE: THE MOB'S FORTRESS ON THE
MAP'S OWN GROUND.

The row (PAOLO 10/10, 'the settlements all look like dogshit and not organic with the map'; rule 86): 'the settlement
picture's edges meet the map's ground it stands on (the desert wash, the suburb grid, the strip's spine): the same dirt,
the same road running in and out, no slab, no frame; a sheet per ground'.  Round one was the suburb grid (Church).  This
is the Strip's spine, on the place that stands there: the MOB, a FORTRESS on the resort block 41,29, two blocks off the
Strip's boulevard (read off the demo by tools/bohemia_cook4_the_place_sits_in_the_map_read.js Mob).
WHAT THE MAP HOLDS THERE: the resort block's yards in a grey-tan (#8a8478, greyer than the suburb's #8a7a5e), its parking
in a dark asphalt; the Strip's boulevard two blocks east (asphalt #33333c, walks #8a8a92, a dead median); the arterial to
the north; the suburb to the west; on his glass at the near stop the Strip is towers and sign gates.
WHAT WAS WRONG, MEASURED: the picture Mob opens on today is this lane's round-3 pack fortress
(slices/settlement_ground_packs/fortress_0.webp, a placeholder, never edited): cracked concrete in his tiles' own colour
and a palisade, nothing of the Strip; its numbers against the map are on the sheet.
HOW BATTLE BROTHERS DOES IT (rule 41): a town screen's backdrop is the terrain its world tile has, and a big place reads
big by its buildings (a city's walls and keep).  OURS: the Strip's ground and road, and the Strip's own buildings the
row made this session as the fortress: the tower casino is the keep.
THE PICTURE (5280 x 2880, 92 m across, 72 m of ground; nothing drawn, his tiles cut and laid at their own pixels; every
building this lane's file at 1:1, laid under the scene's one shadow rule, the files untouched):
  * THE GROUND: his yard soil (#0, #18 in patches) cut to meet and laid in the resort block's grey-tan on his glass by
    brightness (each pixel the map's colour times its own brightness over his median's: round one's per-channel gain turned
    his light grains blue this far from his orange), its hue onto his YES street's band (DIRECTION's floor bar) if outside; the Strip's road in front
    (COOK TWO's asphalt, slabs and kerb balanced to the map's asphalt and walk, his worn double yellow), running off both
    sides and the bottom; the kerb's lit lip is the walk's own lightest pixels (no colour by number).
  * THE FORTRESS: a line of his concrete barriers (5. Barricades and defenses #13 #14 #15) along the walk's top with
    sandbags (3. #0, #19) and razor wire (3. #18) in it, the gate open in front of the keep's doors;
  * THE BUILDINGS, left to right: the round-7 motel cut by the left edge; at the road end the motel sign tower (round
    18), its arrow pointing away; the wedding chapel (round 17) = CLINIC; the pawn shop (round 16) with its empty queue =
    STALL; the tower casino (round 15) = the keep, BARBER; the round-8 gas station cut by the right edge.  Behind them the
    Strip goes on, as the map's resort blocks are built up: the round-12 casino and the round-5 corner shop a row back,
    the round-9 warehouse a row behind that; the dirt over them is the rest a painter leaves.
  * THE TOWN'S TAPS (the screen's fortress schema): clinic, barber, stall; POSTS = the two barriers either side of the
    gate; BOARD = his chalk easel inside the gate.
  * Each building keeps its own one wrong thing (the top floor whole, the empty queue, the living flowers, the arrow
    pointing away); the place adds none.
REFERENCE CHECK (9/4 compare law; rule 82: the twin is the world it lands in): compared to the map itself at its closest
zoom, centred on the Mob (his glass, on the sheet), the map's own plan of the 25 blocks round it, the picture Mob opens on
today, his pack house #30 and the man at 1:1.  structure taken: the map's resort ground, asphalt and walk colours, the
Strip's road; what changed: the colour of his ground tiles (a white balance), nothing else of his.
REUSE CHECK (REUSE-FIRST, 7/22): round one's tool (tools/bohemia_cook4_the_place_sits_in_the_map.py) for the read, the
field that meets, the balance, the patch mask, COOK TWO's cells, the building and prop laying and the measures (imported,
not copied); its ground recipe is generalized here to the Strip's lines; the buildings are this lane's files; the floor bar
DIRECTION's; the cell check the church's.  New here: the barrier line, the composition, the sheet.
OUTPUT (rule 100: candidates only): reference/art_pipe/cook4/place_in_the_map/COOK4_FORTRESS_MOB_ON_THE_STRIP.webp and .json
(the screen's fortress schema), the sheet records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_STRIP.webp, the numbers
records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_STRIP.json.  Native pixel size: his 96 px pieces at 1:1, 57 px a metre
across, 40 deep.  Palette file: reference/art_pipe/cook4/place_in_the_map/COOK4_THE_MAP_GROUND_THE_STRIP.json.  Light: one
sun, upper left.

    node tools/bohemia_cook4_the_place_sits_in_the_map_read.js Mob        (the map, once)
    python3 tools/bohemia_cook4_the_place_sits_in_the_map_the_strip.py     (a few minutes)
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)
import bohemia_cook4_the_place_sits_in_the_map as p1          # round one: the read, the field, the balance, the laying
import bohemia_cook4_the_tower_casino as tc
import bohemia_cook4_the_pawn_shop as pw
import bohemia_cook4_the_wedding_chapel as wc
import bohemia_cook4_the_motel_sign_tower as st
S, B, sp, FB, cell_check = p1.S, p1.B, p1.sp, p1.FB, p1.cell_check
M, D, dE, hx = p1.M, p1.D, p1.dE, p1.hx

DIR = p1.DIR
READ = os.path.join(DIR, 'COOK4_PLACE_MOB.json')
PIC = os.path.join(DIR, 'COOK4_FORTRESS_MOB_ON_THE_STRIP.webp')
PIC_JSON = os.path.join(DIR, 'COOK4_FORTRESS_MOB_ON_THE_STRIP.json')
PALETTE = os.path.join(DIR, 'COOK4_THE_MAP_GROUND_THE_STRIP.json')
SHEET = os.path.join(ROOT, 'records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_STRIP.webp')
NUMBERS = os.path.join(ROOT, 'records/target/COOK4_THE_PLACE_SITS_IN_THE_MAP_THE_STRIP.json')
BEFORE = os.path.join(ROOT, 'slices/settlement_ground_packs/fortress_0.webp')
PLAN = {'dirt': hx('#8a8478'), 'asphalt': hx('#33333c'), 'walk': hx('#8a8a92'), 'forecourt': hx('#a09a8a')}
W, H = 5280, 2880
p1.W, p1.H = W, H                                             # round one's laying reads the canvas size from its module
ROAD_TOP = H - D(7.0)
LINE_Y = ROAD_TOP + D(3.6)
WALK_TOP = ROAD_TOP - D(2.0)
BARRIER_FOOT = WALK_TOP + 2
TOWER_FOOT = WALK_TOP - D(6.0)
PAWN_FOOT = WALK_TOP - D(6.6)                                 # its queue's last row stays behind the barriers
CHAPEL_FOOT = WALK_TOP - D(4.0)
SIGN_FOOT = ROAD_TOP - 8                                      # the sign stands on the walk at the road
BACK1_FOOT = CHAPEL_FOOT - D(16.0)                            # the second row of the Strip
BACK2_FOOT = BACK1_FOOT - D(16.0)                             # the third
SEED = 1919
BARRIERS = [('5. Barricades and defenses', 13), ('5. Barricades and defenses', 14), ('5. Barricades and defenses', 15)]
SANDBAGS = [('3. Barricades and blockades', 0), ('3. Barricades and blockades', 19)]
WIRE = ('3. Barricades and blockades', 18)


def the_map():
    """round one's read of his glass for this place: the most-drawn colour within reach of each plan colour under the
    screen's light (that light read off the dirt and the asphalt)"""
    rd = json.load(open(READ))
    shot = np.asarray(Image.open(os.path.join(ROOT, rd['shot'])).convert('RGB')).astype(float)
    cvh = shot.shape[0]
    reg = shot[int(cvh * 0.5):int(cvh * 0.97)].reshape(-1, 3).astype(int)
    cols, cnt = np.unique(reg, axis=0, return_counts=True)
    o = np.argsort(-cnt); cols, cnt = cols[o][:400].astype(float), cnt[o][:400]; share = cnt / len(reg)
    def most_drawn(target, reach):
        ok = [i for i in range(len(cols)) if dE(cols[i], target) <= reach]
        return (cols[max(ok, key=lambda i: cnt[i])], float(share[max(ok, key=lambda i: cnt[i])])) if ok else (None, 0.0)
    # the screen's light is the one round one read at Church (the same day, the same cast): a plan colour on his glass is
    # the plan under that light.  MEASURED: with a 12 reach the resort's grey-tan took the suburb's tan, the most-drawn colour
    # round the Mob (the suburb's houses fill the glass west of it), 8 off the resort's own; so each thing is found within 5
    # of its own plan colour under the light, the asphalt within 12 (it is the darkest thing on the glass)
    gain = np.array(json.load(open(p1.PALETTE))['light_gain'])
    seen, how = {}, {}
    for k, reach in (('dirt', 5), ('asphalt', 12)):
        c, s_ = most_drawn(PLAN[k] * gain, reach)
        seen[k], how[k] = (c, 'drawn %.1f%% of the glass' % (100 * s_)) if c is not None else (PLAN[k] * gain, 'the plan under the light (not drawn on this glass)')
    for k in ('walk', 'forecourt'):
        c, s_ = most_drawn(PLAN[k] * gain, 8)
        seen[k], how[k] = (c, 'drawn %.1f%% of the glass' % (100 * s_)) if c is not None else (PLAN[k] * gain, 'the plan under the light (not drawn on this glass)')
    return rd, shot, seen, gain, how


def balance_lum(a, target, contrast=1.0):
    """his grain in the map's colour, for a target far from his tile's own: each pixel the target times its own
    brightness over his median's (contrast keeps or softens the grain).  MEASURED: round one's per-channel gain, from his
    orange soil to the resort's grey-tan, multiplies blue by 1.85, so his light grains came out blue (hue past 60) and
    DIRECTION's floor bar could read only 122 cells of the ground as dirt; by brightness every grain keeps the dirt's hue"""
    a = a.astype(float); L = a[..., :3] @ np.array([.299, .587, .114]); med = np.median(L)
    k = 1 + contrast * (L / max(med, 1) - 1)
    return (np.asarray(target, float)[None, None, :] * k[..., None]).clip(0, 255)


def ground(seen, contrast, aprons):
    """round one's ground generalized: his soil to every edge balanced to the map's dirt, his slabs on the walk and the
    aprons balanced to the map's walk and forecourt, the road, his double yellow, his kerb; the lit lip is the walk's own
    lightest pixels"""
    rng = np.random.RandomState(SEED)
    cls = np.zeros((H, W), np.uint8)
    jo = []
    base, cut0 = p1.field(p1.SOIL, 'soil0', W, H, SEED, jo)
    alt, _ = p1.field(p1.SOIL2, 'soil18', W, H, SEED + 1)
    yard = np.ones((H, W), bool)
    g = balance_lum(np.asarray(base.convert('RGB')), seen['dirt'], contrast)
    g2 = balance_lum(np.asarray(alt.convert('RGB')), seen['dirt'], contrast)
    g = np.where(p1.noise_mask(W, H, (52, 20), SEED + 3, 0.74)[..., None], g2, g)
    slab = p1.grid_cells(W, H, S.SIDEWALK, B.WALKS)
    pave = np.zeros((H, W), bool); pave[WALK_TOP:ROAD_TOP] = True
    for (x0, y0, x1, y1) in aprons: pave[max(0, y0):y1, max(0, x0):min(W, x1)] = True
    walkrow = np.zeros((H, W), bool); walkrow[WALK_TOP:ROAD_TOP] = True
    sl = np.where(walkrow[..., None], p1.balance(slab, pave, seen['walk'], 1.0), p1.balance(slab, pave, seen['forecourt'], 1.0))
    edge = pave & ~np.asarray(Image.fromarray(pave.astype(np.uint8) * 255).filter(ImageFilter.MinFilter(15))).astype(bool)
    edge[ROAD_TOP - 10:ROAD_TOP + 1] = False
    vis = pave & ~(edge & p1.noise_mask(W, H, (160, 70), SEED + 5, 0.45))
    g = np.where(vis[..., None], sl, g); cls[vis] = 5; cls[vis & walkrow] = 1
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
    face = np.concatenate([B.FACE] * (W // B.FACE.shape[1] + 1), axis=1)[:, :W]
    face = p1.balance(face, np.ones(face.shape[:2], bool), seen['walk'] * 0.82, 1.0)
    g[ROAD_TOP:ROAD_TOP + B.FH] = face; cls[ROAD_TOP:ROAD_TOP + B.FH] = 4
    g[ROAD_TOP + B.FH:ROAD_TOP + B.FH + 3] *= 0.55
    walk_px = g[WALK_TOP:ROAD_TOP].reshape(-1, 3)
    lip = walk_px[np.argsort(walk_px @ np.array([.299, .587, .114]))[int(len(walk_px) * 0.97)]]   # the walk's own lit pixel
    g[ROAD_TOP - 1] = g[ROAD_TOP - 1] * 0.35 + lip * 0.65
    img = Image.fromarray(g.round().clip(0, 255).astype(np.uint8)).convert('RGBA')
    return img, cls, dict(cut_soil=cut0[2], seams=sp.seams(base, jo[0]))


def footed(path_or_im):
    im = path_or_im if isinstance(path_or_im, Image.Image) else Image.open(path_or_im).convert('RGBA')
    return im, p1._foot(im)


def compose(seen, contrast):
    # the buildings as their files are (never rebuilt here: a file is the placeholder he sees, rule 101c)
    tower, t_base = footed(tc.ASSET); t_door = tower.width // 2
    pawn, p_base = footed(pw.ASSET)
    chap, c_base = footed(wc.ASSET)
    sign = Image.open(st.ASSET).convert('RGBA')
    sa = np.asarray(sign)[..., 3] == 255; s_base = int(np.where(sa.any(1))[0].max()) + 1      # the legs' feet
    motel, m_foot = footed(os.path.join(p1.AB, 'settlement/COOK4_MOTEL_STRAIGHT_ROOF.png'))
    casino = p1.CASINO
    gas, g_foot = footed(os.path.join(p1.AB, 'settlement/COOK4_GAS_STATION_STRAIGHT_ROOF.png'))
    shop, sh_foot = footed(os.path.join(p1.AB, 'settlement/COOK4_CORNER_SHOP_STRAIGHT_ROOF.png'))
    ware, w_foot = footed(os.path.join(p1.AB, 'settlement/COOK4_WAREHOUSE_STRAIGHT_ROOF.png'))
    xs = {}
    xs['motel'] = -(motel.width - 600)
    xs['sign'] = 620
    xs['chapel'] = xs['sign'] + sign.width + 40
    xs['pawn'] = xs['chapel'] + chap.width + 50
    xs['tower'] = xs['pawn'] + pawn.width + 50
    xs['gas'] = xs['tower'] + tower.width + 40                                           # cut by the right edge
    gate_x = xs['tower'] + t_door
    aprons = [(xs['tower'] + 40, TOWER_FOOT - 8, xs['tower'] + tower.width - 40, WALK_TOP),            # the keep's forecourt
              (xs['gas'] - M(0.6), WALK_TOP - D(5.0) - 8, W, WALK_TOP)]                             # the gas station's apron
    canvas, cls, info = ground(seen, contrast, aprons)
    ground_img = canvas.copy()
    hot = {}
    lb = p1.lay_building
    # the Strip behind the front row, two rows back (the map's resort blocks are built up): far, the warehouse; then the
    # first casino and the corner shop; the tower stands in front of them all
    lb(canvas, ware, 400, BACK2_FOOT - w_foot)
    lb(canvas, casino, 60, BACK1_FOOT - p1.CAS_FOOT)
    lb(canvas, shop, 1900, BACK1_FOOT - sh_foot)
    lb(canvas, motel, xs['motel'], CHAPEL_FOOT - D(8.0) - m_foot)                              # the motel behind, at the left
    lb(canvas, gas, xs['gas'], WALK_TOP - D(5.0) - g_foot)
    lb(canvas, tower, xs['tower'], TOWER_FOOT - t_base, hot, 'barber')
    lb(canvas, pawn, xs['pawn'], PAWN_FOOT - p_base, hot, 'stall')
    lb(canvas, chap, xs['chapel'], CHAPEL_FOOT - c_base, hot, 'clinic')
    # the barrier line along the walk's top, the gate open in front of the keep's doors
    rng = np.random.RandomState(SEED + 9)
    x = -int(rng.randint(0, 60)); k = 0
    gate = (gate_x - M(2.4), gate_x + M(2.4))
    while x < W:
        if gate[0] - 96 < x < gate[1]:
            x = gate[1]; continue
        if xs['sign'] - 40 < x < xs['sign'] + sign.width:                                        # the sign stands in the line
            x = xs['sign'] + sign.width; continue
        kind = rng.rand()
        tile = SANDBAGS[rng.randint(2)] if kind < 0.18 else (WIRE if kind < 0.28 else BARRIERS[rng.randint(3)])
        t = p1.lay_prop(canvas, tile, x, BARRIER_FOOT, flip=bool(rng.rand() < 0.5))
        x += t.width - 4; k += 1
    for side, gx in (('l', gate[0] - 96), ('r', gate[1])):
        p1.lay_prop(canvas, BARRIERS[0], gx, BARRIER_FOOT + 4, hot, 'posts')                   # the gate's two posts
    p1.lay_prop(canvas, ('13. Port market', 30), gate[1] + M(0.6), TOWER_FOOT + D(2.4), hot, 'board')
    lb(canvas, sign, xs['sign'], SIGN_FOOT - s_base)
    p1.lay_prop(canvas, ('14. Trash and junk props', 3), xs['gas'] + 40, WALK_TOP - D(4.4))
    return canvas, ground_img, cls, hot, info, xs


def main():
    rd, shot, seen, gain, how = the_map()
    FBAR = FB.bar()
    target = dict(seen); target['dirt'] = p1.onto_the_bar(seen['dirt'], FBAR)
    print('the map seen:', {k: (v.round().tolist(), how[k]) for k, v in seen.items()}, 'dirt laid', target['dirt'].round().tolist(), dE(seen['dirt'], target['dirt']))
    best = None
    for contrast in (1.0, 0.9, 0.8, 0.7):
        pic, gimg, cls, hot, info, xs = compose(target, contrast)
        fb = FB.measure(np.asarray(pic.convert('RGB')), FBAR)
        print('contrast', contrast, fb['tests'], fb['ground'])
        if not fb['pass'] and contrast > 0.7: continue
        red = cell_check(gimg); print('  ground red', len(red))
        best = (pic, gimg, cls, hot, info, xs, red, contrast, fb)
        if not red: break
    pic, gimg, cls, hot, info, xs, red, contrast, fb = best
    whole = cell_check(pic); print('whole picture red', len(whole), [r[:3] for r in whole])
    after = p1.medians(gimg, cls)
    before = np.asarray(Image.open(BEFORE).convert('RGB')).astype(float)
    Xb = before.reshape(-1, 3)[np.random.RandomState(2).choice(before.shape[0] * before.shape[1], 60000, replace=False)]
    Cb, lbb = p1.kmeans(Xb, 10); shb = np.bincount(lbb, minlength=10) / len(Xb)
    bm = {'dirt': Cb[int(np.argmax(shb))]}
    fb_before = FB.measure(before.astype(np.uint8), FBAR)
    edges = p1.edge_bands(gimg, cls, seen)
    pic.convert('RGB').save(PIC, lossless=True, method=6)
    json.dump({'tier': 'fortress', 'ground': 'strip', 'place': 'Mob', 'src': os.path.basename(PIC), 'px': [W, H],
               'px_per_metre': round(p1.PPM, 2), 'depth': p1.DEPTH, 'hotspots': {k: {'box': v, 'kind': k} for k, v in hot.items()},
               'night_src': None, 'placeholder': True,
               'note': 'COOK FOUR [the place sits in the map] round 19: the fortress picture for a place whose block stands on the Strip '
                       '(the Mob first). A candidate (rule 100): RUN TWO picks it by the place\'s ground when he says so; shown at one picture '
                       'pixel to one device pixel and panned.'}, open(PIC_JSON, 'w'), indent=1)
    json.dump({'what': 'the map\'s ground as his glass shows it at the near stop round the Mob, and the picture\'s ground read back',
               'plan': {k: [int(x) for x in v] for k, v in PLAN.items()}, 'seen': {k: [int(round(x)) for x in v] for k, v in seen.items()},
               'how_read': how, 'light_gain': [round(float(x), 3) for x in gain], 'dirt_laid': [int(round(x)) for x in target['dirt']],
               'picture': {k: [int(round(x)) for x in v] for k, v in after.items()}}, open(PALETTE, 'w'), indent=1)
    sh, first = sheet(pic, before, shot, rd, seen, target, after, bm, edges, fb, fb_before, hot, red, whole)
    sh.convert('RGB').save(SHEET, quality=90, method=6)
    nums = {'place': rd['name'], 'tier': rd['tier'], 'district': rd['district'], 'block': [rd['x'], rd['y']], 'picture': [W, H],
            'contrast_kept': contrast, 'dE': {k: {'before': dE(bm[k], seen[k]) if k in bm else None, 'after': dE(after[k], seen[k])} for k in ('dirt', 'asphalt', 'walk', 'forecourt')},
            'dirt_laid_dE_to_the_map': dE(seen['dirt'], target['dirt']), 'edges': edges, 'hotspots': hot,
            'floor_bar_after': fb, 'floor_bar_before': fb_before, 'cell_check_ground_red': len(red),
            'cell_check_whole_picture': [[r[0], r[1], r[2], r[3]] for r in whole], 'first_picture_at': first, 'lay': info, 'x': xs}
    json.dump(nums, open(NUMBERS, 'w'), indent=1, default=lambda o: o.tolist() if hasattr(o, 'tolist') else str(o))
    print(json.dumps(nums['dE']), 'first', first, 'hot', hot)


def sheet(pic, before, shot, rd, seen, target, after, bm, edges, fb, fb_before, hot, red, whole):
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
    rows.append(text_block(['PLACEHOLDER: THE MOB\'S FORTRESS, ON THE STRIP\'S OWN GROUND'], F, HOT))
    rows.append(text_block(['The picture the Mob\'s fortress opens on, cut from what the map has there: the resort block\'s grey-tan dirt, the '
                            'Strip\'s road in front running out at both sides, a line of your concrete barriers with the gate open, and the '
                            'Strip\'s buildings you got this round as the fortress: the tower is the keep. Top: the map at its closest zoom and '
                            'its plan. Then the picture the Mob opens on today, then the new one. Bottom: the colours, the seam, the numbers.'], f, INK))
    shi = Image.fromarray(shot.astype(np.uint8)); cy = shi.height // 2
    crop = shi.crop((35, cy - 640, 35 + 1100, cy + 460))
    plan_im = p1.plan_image(rd).resize((1100, 1100), Image.NEAREST)
    r = Image.new('RGB', (Wd, 1150), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(crop, (pad, 40)); r.paste(plan_im, (Wd - pad - 1100, 40))
    d.text((pad, 6), 'THE MAP AT ITS CLOSEST ZOOM, CENTRED ON THE MOB (his glass, 1:1)', font=s, fill=DIM)
    d.text((Wd - pad - 1100, 6), 'THE MAP\'S OWN PLAN OF THE 25 BLOCKS ROUND IT (the box: the Mob\'s block)', font=s, fill=DIM)
    rows.append(r)
    bi = Image.fromarray(before.astype(np.uint8))
    r = Image.new('RGB', (Wd, bi.height + 50), (14, 13, 12)); d = ImageDraw.Draw(r); r.paste(bi, (pad, 40))
    d.text((pad, 6), 'BEFORE: THE PICTURE THE MOB OPENS ON TODAY (one of its two, 1:1): his concrete and palisade, nothing of the Strip', font=s, fill=DIM)
    rows.append(r)
    y_first = sum(x.height for x in rows) + 40
    half = pic.convert('RGB').resize((W // 2, H // 2), Image.NEAREST)
    hp = half.copy(); dh = ImageDraw.Draw(hp)
    for k, b in hot.items():
        bb = [v // 2 for v in b]; dh.rectangle(bb, outline=(226, 162, 72), width=2); dh.text((bb[0] + 4, bb[1] + 2), k.upper(), font=s, fill=(226, 162, 72))
    r = Image.new('RGB', (Wd, half.height * 2 + 100), (14, 13, 12)); d = ImageDraw.Draw(r)
    d.text((pad, 6), 'AFTER: THE NEW PICTURE, WHOLE, AT HALF SIZE (nearest neighbour; the frame cuts the motel and the gas station, the road leaves both sides)', font=s, fill=DIM)
    r.paste(half, (pad, 40))
    d.text((pad, half.height + 56), 'THE SAME, WITH THE FIVE THINGS YOU TAP', font=s, fill=DIM)
    r.paste(hp, (pad, half.height + 90))
    rows.append(r)
    first = [pad, y_first, half.width, half.height]
    gx = hot['posts'][0]
    c1 = pic.convert('RGB').crop((max(0, gx - 300), H - 1300, max(0, gx - 300) + 1300, H))
    c2 = pic.convert('RGB').crop((0, H - 1300, 1300, H))
    r = Image.new('RGB', (Wd, 1350), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(c2, (pad, 40)); r.paste(c1, (Wd - pad - 1300, 40))
    d.text((pad, 6), 'AT 1:1: THE LEFT EDGE (the motel cut by the frame, its sign at the road, the chapel)', font=s, fill=DIM)
    d.text((Wd - pad - 1300, 6), 'AT 1:1: THE GATE IN THE BARRIERS, THE KEEP\'S DOORS', font=s, fill=DIM)
    rows.append(r)
    mwin = shi.crop((250, 1150, 850, 1750)); pwin = pic.convert('RGB').crop((0, H - 600, 600, H))
    r = Image.new('RGB', (Wd, 650), (14, 13, 12)); d = ImageDraw.Draw(r)
    r.paste(mwin, (pad, 40)); r.paste(pwin, (pad + 600, 40))
    d.text((pad, 6), 'THE SEAM: the map on his glass (left) butted against the picture\'s edge (right), nothing between', font=s, fill=DIM)
    rows.append(r)
    r = Image.new('RGB', (Wd, 420), (14, 13, 12)); d = ImageDraw.Draw(r)
    d.text((pad, 6), 'THE COLOURS (Lab distance from what the map shows; under 5 reads as the same colour)', font=f, fill=INK)
    y = 50
    for k in ('dirt', 'asphalt', 'walk', 'forecourt'):
        d.text((pad, y + 14), k.upper(), font=f, fill=DIM)
        for j, (lbl, c) in enumerate((('THE MAP', seen[k]), ('BEFORE', bm.get(k)), ('AFTER', after[k]))):
            x = pad + 200 + j * 700
            if c is None: d.text((x, y + 14), lbl + ': none (the old picture has no ' + k + ')', font=s, fill=DIM); continue
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
    lines = ['THE THREE BIGGEST DIFFERENCES FROM WHAT THE MOB OPENS ON TODAY: (1) THE GROUND: his concrete in its own colour (%.1f off the '
             'map\'s resort ground); now his soil balanced to it (%.1f off). (2) THE ROAD: none; now the Strip\'s road in front, its asphalt '
             '%.1f off the map\'s, his kerb and walk, his worn double yellow, leaving both sides. (3) THE PLACE: a palisade round cottages; now '
             'the Strip\'s own buildings behind a line of his concrete barriers, the tower as the keep.'
             % (dE(bm['dirt'], seen['dirt']), dE(after['dirt'], seen['dirt']), dE(after['asphalt'], seen['asphalt'])),
             'HIS YES STREET AS NUMBERS (DIRECTION\'s floor bar, B1 to B6): the Mob today passes %d of %d, the new picture %d of %d.'
             % (sum(fb_before['tests'].values()), len(fb_before['tests']), sum(fb['tests'].values()), len(fb['tests'])),
             'NO SLAB, NO FRAME: the dirt in a 64 px band at each edge against the map: left %s, right %s, top %s; the road through both side '
             'edges: %s and %s.' % (e['left']['dirt_dE_to_map'], e['right']['dirt_dE_to_map'], e['top']['dirt_dE_to_map'],
                                     'yes' if e['left']['road_runs_through'] else 'NO', 'yes' if e['right']['road_runs_through'] else 'NO'),
             'Native pixel size: his 96 px pieces at 1:1, 57 px a metre across and 40 deep. Palette file: '
             'reference/art_pipe/cook4/place_in_the_map/COOK4_THE_MAP_GROUND_THE_STRIP.json. Light: one sun, upper left. The picture '
             '%d x %d; cell check: the ground %d red, the whole picture %d red of %d, named in the record.' % (W, H, len(red), len(whole), (W // 96) * (H // 96)),
             'A PLACEHOLDER (rule 101): nothing in the game changes until you say so.']
    rows.append(text_block(lines, s, INK))
    Ht = sum(x.height for x in rows) + pad
    out = Image.new('RGB', (Wd, Ht), (14, 13, 12)); y = 0
    for x in rows: out.paste(x, (0, y)); y += x.height
    return out, first


if __name__ == '__main__':
    main()
