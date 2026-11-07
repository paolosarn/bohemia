#!/usr/bin/env python3
"""BOHEMIA -- FREEWAY [the freeway fight] (VAMILY rule 432, ask lines 513 and 514; Paolo 11/7: 'why can't it be an underpass
or a large overpass towering over the rest of the city, you can't quite hop off it').

THE KIT THE FREEWAY BOARDS ARE DRAWN FROM (slices/bohemia_freeway_boards.js deal(); the layouts are data,
slices/fight_ground/freeway/freeway_boards.json). REUSE FIRST (rule 430: the art since the Crashbox turn is at the bar; a
lane changes layout and placement, never a finished piece he has not named):
  * the LANES are COMBAT TWO's street kit as it lies (slices/fight_ground/kit_street/road_ew, road_ew_arrow, road_ew_median,
    road_ns: ONE ROAD KIT, rule 77a), never redrawn;
  * the PARAPETS are the fight's own Jersey barrier picture (cover_jersey.webp) and the kit's barrier (sb_barrier_E) laid
    along the deck's edge, so the wall on the deck is the barrier he already has in the median;
  * the CITY BELOW and the SHADE UNDER THE DECK are the street board's own ground and street pieces, taken down in light
    and colour at the source (the night's cold, the deck's shadow), never a filter on the screen;
  * the FALLEN SIGN is COOK's gantry through the master rig (records/target/master_rig/cook_gantry, cooked 10/18, never
    used until now) and THE CAB is COOK's wreck in its south-east facing, both cut to the fight's 42.9 px a metre the way
    COMBAT TWO cut the kit;
  * NEW, on the master rig's light (sun upper left, the 45 degree camera, 30 px a vertical metre): the deck's face over the
    drop with its column, the broken end with its rebar, the slope of a ramp. EVERY NEW PICTURE IS A STAND-IN (rule
    408(c)); the golden candidate is the face with its column (fw_face_col), to DIRECTION's eye first.
Writes slices/fight_ground/freeway/*.webp and slices/fight_ground/freeway/freeway.json (the tiles a board picks from, the
pieces' sizes and feet, the freeway's own pieces).
    python3 tools/bohemia_freeway_kit_11_7_26.py
"""
import json, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
FG = os.path.join(ROOT, 'slices', 'fight_ground')
OUT = os.path.join(FG, 'freeway')
TW, TH = 515, 364
PXM, PYM = 42.9, 364 / 12.0
RIG_PPM = 57.0
Q = 76

def load(rel):
    return Image.open(os.path.join(FG, rel)).convert('RGBA')

def save(im, name):
    p = os.path.join(OUT, name)
    im.convert('RGB').save(p, 'WEBP', quality=Q, method=6)
    return 'freeway/' + name

def darken(im, k, cool=(0, 0, 0), desat=0.0):
    rgb = im.convert('RGB')
    if desat:
        rgb = ImageEnhance.Color(rgb).enhance(1 - desat)
    rgb = ImageEnhance.Brightness(rgb).enhance(k)
    if any(cool):
        r, g, b = rgb.split()
        r = r.point(lambda v: max(0, min(255, v + cool[0])))
        g = g.point(lambda v: max(0, min(255, v + cool[1])))
        b = b.point(lambda v: max(0, min(255, v + cool[2])))
        rgb = Image.merge('RGB', (r, g, b))
    return rgb.convert('RGBA')

def grain(im, amt, seed):
    """the grain of the recording, in the picture itself (analog horror at the source, rule 20)"""
    rnd = random.Random(seed)
    n = Image.effect_noise((im.width, im.height), 40).convert('L')
    n = n.point(lambda v: 128 + (v - 128) * amt)
    base = im.convert('RGB')
    out = ImageChops.add(base, Image.merge('RGB', (n, n, n)), 1.0, -128)
    return out.convert('RGBA')

def vgrad(w, h, top, bottom):
    g = Image.new('L', (1, h))
    for y in range(h):
        g.putpixel((0, y), int(top + (bottom - top) * y / max(1, h - 1)))
    return g.resize((w, h))

def hgrad(w, h, left, right):
    g = Image.new('L', (w, 1))
    for x in range(w):
        g.putpixel((x, 0), int(left + (right - left) * x / max(1, w - 1)))
    return g.resize((w, h))

def mul(im, mask):
    """multiply the picture by a 0..255 mask (255 = unchanged)"""
    rgb = im.convert('RGB')
    m = Image.merge('RGB', (mask, mask, mask))
    return ImageChops.multiply(rgb, m).convert('RGBA')

JERSEY = load('cover_jersey.webp')
BARRIER_E = load('street_board/kit/sb_barrier_E.webp')
KITSTREET = 'kit_street/'

def wall_n(im, dy=0):
    for x in range(-40, TW, JERSEY.width - 2):
        im.alpha_composite(JERSEY, (x, max(0, dy)))
    sh = Image.new('RGBA', (TW, 10), (0, 0, 0, 60))
    im.alpha_composite(sh, (0, JERSEY.height + max(0, dy) - 2))
    return im

def wall_s(im, dy=0):
    y = TH - JERSEY.height + dy
    sh = Image.new('RGBA', (TW, 8), (0, 0, 0, 55))
    im.alpha_composite(sh, (0, y - 6))
    for x in range(-90, TW, JERSEY.width - 2):
        im.alpha_composite(JERSEY, (x, y))
    return im

def wall_e(im):
    for y in range(-20, TH, BARRIER_E.height - 6):
        im.alpha_composite(BARRIER_E, (TW - BARRIER_E.width, y))
    return im

def wall_w(im):
    for y in range(-20, TH, BARRIER_E.height - 6):
        im.alpha_composite(BARRIER_E, (0, y))
    return im

def lane(base, walls):
    im = load(base).copy()
    if 'n' in walls: wall_n(im)
    if 'e' in walls: wall_e(im)
    if 'w' in walls: wall_w(im)
    if 's' in walls: wall_s(im)
    return im

def slope(up, walls):
    """a ramp tile rising toward 'up' (e or w): the low end darker (it is further down in the valley's dusk), its walls
    stepping up with it"""
    im = load(KITSTREET + 'road_ew.webp').copy()
    g = hgrad(TW, TH, 185, 255) if up == 'e' else hgrad(TW, TH, 255, 185)
    im = mul(im, g)
    # the walls rise with the road: drawn in four steps, each a little higher toward the high end
    steps = 4
    for i in range(steps):
        x0, x1 = TW * i // steps, TW * (i + 1) // steps
        k = (i + 0.5) / steps if up == 'e' else 1 - (i + 0.5) / steps
        dy = int(round((1 - k) * 16))
        part = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
        if 'n' in walls: wall_n(part, dy)
        if 's' in walls: wall_s(part, -int(round(k * 10)))
        im.alpha_composite(part.crop((x0, 0, x1, TH)), (x0, 0))
    return im

def street_ground(kind):
    K = json.load(open(os.path.join(FG, 'street_board', 'street_board.json')))
    return ['street_board/' + v['src'] for v in K['ground'][kind]]

def below(src, seed, fire=False):
    im = load(src)
    im = darken(im, 0.40, cool=(-6, -2, 8), desat=0.55)
    im = im.filter(ImageFilter.GaussianBlur(1.2))
    im = mul(im, vgrad(TW, TH, 215, 255))
    if fire:
        glow = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
        d = ImageDraw.Draw(glow)
        rnd = random.Random(seed)
        cx, cy = rnd.randint(120, 400), rnd.randint(110, 280)
        for r, a in ((70, 26), (42, 44), (20, 80), (7, 190)):
            d.ellipse((cx - r, cy - r * 0.7, cx + r, cy + r * 0.7), fill=(255, 120, 40, a))
        glow = glow.filter(ImageFilter.GaussianBlur(6))
        im.alpha_composite(glow)
        d2 = ImageDraw.Draw(im)
        d2.rectangle((cx - 2, cy - 2, cx + 2, cy + 1), fill=(255, 214, 140, 255))
    return grain(im, 0.22, seed)

def below_house(src, house, seed):
    """a lot far below with its house on it: the street board's own ranch house (the map's model through the rig), in the
    dark, one window in four still lit"""
    im = below(src, seed)
    h = Image.open(os.path.join(FG, 'street_board', house + '.webp')).convert('RGBA')
    k = min(TW * 0.86 / h.width, TH * 0.95 / h.height)
    h = h.resize((max(1, int(h.width * k)), max(1, int(h.height * k))), Image.LANCZOS)
    h = darken(h, 0.36, cool=(-6, -2, 8), desat=0.55)
    im.alpha_composite(h, ((TW - h.width) // 2, TH - h.height - 8))
    rnd = random.Random(seed)
    if rnd.random() < 0.5:
        d = ImageDraw.Draw(im)
        x, y = rnd.randint(TW // 3, TW * 2 // 3), rnd.randint(TH // 2, TH - 60)
        d.rectangle((x, y, x + 7, y + 9), fill=(196, 150, 82, 255))
    return grain(im, 0.2, seed)

def concrete_band(w, h, seed, shade=0.78):
    """the deck's face: the Jersey picture's own concrete, stretched along the girder, the stains kept"""
    src = JERSEY.crop((0, 18, JERSEY.width, JERSEY.height - 6)).convert('RGBA')
    band = Image.new('RGBA', (w, h))
    tile = src.resize((src.width, h))
    for x in range(-30, w, tile.width - 4):
        band.alpha_composite(tile, (x, 0))
    band = darken(band, shade, desat=0.25)
    band = mul(band, vgrad(w, h, 255, 170))
    return band

def face(seed, column):
    rnd = random.Random(seed)
    base = below(street_ground('dirt')[seed % 3], seed + 5)
    base = mul(base, vgrad(TW, TH, 80, 205))
    gh = 54
    if column:
        cx = rnd.randint(160, 350)
        colw = 58
        col = Image.new('RGBA', (colw, TH - gh), (0, 0, 0, 0))
        cband = concrete_band(colw, TH - gh, seed + 9, shade=0.9)
        cband = mul(cband, hgrad(colw, TH - gh, 255, 150))
        cband = mul(cband, vgrad(colw, TH - gh, 255, 120))
        col.alpha_composite(cband)
        base.alpha_composite(col, (cx - colw // 2, gh))
        sh = Image.new('RGBA', (34, TH - gh), (0, 0, 0, 70))
        base.alpha_composite(sh, (cx + colw // 2, gh))
    band = concrete_band(TW, gh, seed)
    base.alpha_composite(band, (0, 0))
    d = ImageDraw.Draw(base)
    d.line((0, gh, TW, gh), fill=(20, 18, 16, 255), width=3)
    for i in range(3):   # rust weeping from the deck joints
        x = rnd.randint(20, TW - 20)
        d.line((x, 6, x + rnd.randint(-3, 3), gh - 4), fill=(96, 58, 36, 140), width=2)
    return grain(base, 0.18, seed)

def broken(side, seed):
    """the deck's broken end: the lane on its side, a jagged edge, rebar over the drop, the city below"""
    rnd = random.Random(seed)
    im = below(street_ground('rubble')[seed % 3], seed + 3)
    deck = load(KITSTREET + 'road_ew.webp').copy()
    wall_n(deck); wall_s(deck)
    mask = Image.new('L', (TW, TH), 0)
    d = ImageDraw.Draw(mask)
    pts = [(0, 0)]
    x = 190
    for y in range(0, TH + 1, 26):
        pts.append((x + rnd.randint(-38, 30), y))
    pts += [(0, TH)]
    d.polygon(pts, fill=255)
    edge = Image.new('RGBA', (TW, TH), (0, 0, 0, 0))
    ed = ImageDraw.Draw(edge)
    for (a, b) in zip(pts[1:-2], pts[2:-1]):   # the slab's broken thickness, seen below its edge
        ed.polygon([a, b, (b[0], b[1] + 22), (a[0], a[1] + 22)], fill=(118, 112, 104, 255))
    for i in range(14):   # the rebar
        p = pts[1 + rnd.randint(0, len(pts) - 4)]
        ln = rnd.randint(30, 78)
        ed.line((p[0] - 4, p[1] + 8, p[0] + ln, p[1] + 8 + rnd.randint(-14, 22)), fill=(78, 44, 30, 255), width=3)
    im.alpha_composite(edge)
    im.paste(deck, (0, 0), mask)
    if side == 'e':
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return grain(im, 0.16, seed)

def shade(src, seed):
    im = darken(load(src), 0.52, cool=(-4, -1, 6), desat=0.3)
    return grain(im, 0.16, seed)

def shade_lip(src, side, seed):
    """a tile at the deck's edge from below: the street's light spilling in on the open side, the deck's edge a hard line"""
    lit = load(src)
    sh = shade(src, seed)
    m = hgrad(TW, TH, 255, 0) if side == 'w' else hgrad(TW, TH, 0, 255)
    m = m.point(lambda v: int(255 * (v / 255.0) ** 2.2))
    out = Image.composite(lit.convert('RGB'), sh.convert('RGB'), m).convert('RGBA')
    d = ImageDraw.Draw(out)
    x = 6 if side == 'w' else TW - 7
    d.line((x, 0, x, TH), fill=(24, 22, 20, 200), width=4)
    return grain(out, 0.14, seed)

def bent():
    """a bent of the deck: the fight's own pillar picture at the freeway's column size (3 m across, the deck 9 m up)"""
    im = load('cover_pillar.webp')
    k = 1.7
    im = im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
    im.save(os.path.join(OUT, 'fw_bent.webp'), 'WEBP', quality=86, method=6)
    return 'freeway/fw_bent.webp', im.size

def rig_piece(folder, facing, name):
    im = Image.open(os.path.join(ROOT, 'records', 'target', 'master_rig', folder, 'rig_%s.png' % facing)).convert('RGBA')
    im = im.crop(im.getbbox())
    k = PXM / RIG_PPM
    im = im.resize((max(1, round(im.width * k)), max(1, round(im.height * k))), Image.LANCZOS)
    im.save(os.path.join(OUT, name), 'WEBP', quality=88, method=6)
    return 'freeway/' + name, im.size

def main():
    os.makedirs(OUT, exist_ok=True)
    tiles = {}
    tiles['lane'] = [KITSTREET + 'road_ew.webp']
    tiles['median'] = [KITSTREET + 'road_ew_median.webp']
    combos = []
    for n in range(1, 16):
        w = ''.join(c for i, c in enumerate('nesw') if n & (1 << i))
        combos.append(w)
    for w in combos:
        tiles['lane_' + w] = [save(lane(KITSTREET + 'road_ew.webp', w), 'fw_lane_%s.webp' % w)]
    for w in ('e', 'w', 'ew'):
        tiles['lane_ns_' + w] = [save(lane(KITSTREET + 'road_ns.webp', w), 'fw_lane_ns_%s.webp' % w)]
    for up in ('e', 'w'):
        for w in ('', 'n', 's', 'ns'):
            tiles['slope_' + up + ('_' + w if w else '')] = [save(slope(up, w), 'fw_slope_%s%s.webp' % (up, '_' + w if w else ''))]
    tiles['face'] = [save(face(11, True), 'fw_face_col.webp'), save(face(12, False), 'fw_face.webp'), save(face(13, False), 'fw_face_b.webp')]
    dirt = street_ground('dirt')
    # THE CITY BELOW: a street grid of the map's own 36 m blocks, the houses on their lots, far down and in the dark
    tiles['below'] = [save(below(dirt[0], 21), 'fw_below_0.webp'), save(below(dirt[1], 22), 'fw_below_1.webp')]
    tiles['below_road_ew'] = [save(below(KITSTREET + 'road_ew.webp', 23), 'fw_below_road_ew.webp')]
    tiles['below_road_ns'] = [save(below(KITSTREET + 'road_ns.webp', 24), 'fw_below_road_ns.webp')]
    tiles['below_junction'] = [save(below(KITSTREET + 'junction.webp', 27), 'fw_below_junction.webp')]
    tiles['below_house'] = [save(below_house(dirt[i % 3], h, 50 + i), 'fw_below_house_%d.webp' % i) for i, h in enumerate(('bld_ranch_plain', 'bld_ranch_porch', 'bld_ranch_garage'))]
    tiles['below_fire'] = [save(below(dirt[0], 26, fire=True), 'fw_below_fire.webp')]
    tiles['broken_w'] = [save(broken('w', 31), 'fw_broken_w.webp')]
    tiles['broken_e'] = [save(broken('e', 32), 'fw_broken_e.webp')]
    tiles['shade_dirt'] = [save(shade(dirt[0], 41), 'fw_shade_dirt_0.webp'), save(shade(dirt[1], 42), 'fw_shade_dirt_1.webp')]
    tiles['shade_road_ew'] = [save(shade(KITSTREET + 'road_ew.webp', 43), 'fw_shade_road_ew.webp')]
    tiles['shade_road_ns'] = [save(shade(KITSTREET + 'road_ns.webp', 44), 'fw_shade_road_ns.webp')]
    tiles['shade_walk'] = [save(shade(KITSTREET + 'walk.webp', 45), 'fw_shade_walk.webp')]
    tiles['shade_junction'] = [save(shade(KITSTREET + 'junction.webp', 46), 'fw_shade_junction.webp')]
    tiles['shade_rubble'] = [save(shade(street_ground('rubble')[1], 47), 'fw_shade_rubble.webp')]
    for base, src in (('dirt', dirt[0]), ('walk', KITSTREET + 'walk.webp'), ('road_ew', KITSTREET + 'road_ew.webp')):
        for side in ('w', 'e'):
            tiles['shade_%s_lip%s' % (base, side)] = [save(shade_lip(src, side, 60 + len(tiles)), 'fw_shade_%s_lip%s.webp' % (base, side))]
    tiles['dirt'] = dirt
    tiles['plaza'] = street_ground('plaza')
    tiles['rubble'] = street_ground('rubble')
    tiles['walk'] = [KITSTREET + 'walk.webp']
    tiles['road_ew'] = [KITSTREET + 'road_ew.webp']
    tiles['road_ns'] = [KITSTREET + 'road_ns.webp']
    tiles['junction'] = [KITSTREET + 'junction.webp']
    gsrc, gsz = rig_piece('cook_gantry', 'S', 'fw_gantry.webp')
    csrc, csz = rig_piece('cook_wreck', 'SE', 'fw_cab.webp')
    bsrc, bsz = bent()
    G = json.load(open(os.path.join(FG, 'fight_ground.json')))
    D = json.load(open(os.path.join(FG, 'street_board', 'dressing.json')))
    sizes, srcs = {}, {}
    for p in ('trailer', 'jersey', 'pillar', 'car_lane', 'car_kerb', 'fence', 'dumpster'):
        d = G['cover'].get(p) or G['cover_extra'].get(p)
        im = Image.open(os.path.join(FG, d['src']))
        sizes[p] = [im.width, im.height, round(im.width / 2, 1), round(im.height * 0.9, 1)]
    for p, d in D['kit'].items():
        sizes[p] = [d['w'], d['h'], d['foot'][0], d['foot'][1]]
        srcs[p] = d['src']
    sizes['fw_gantry'] = [gsz[0], gsz[1], round(gsz[0] / 2, 1), round(gsz[1] * 0.86, 1)]
    sizes['fw_bent'] = [bsz[0], bsz[1], round(bsz[0] / 2, 1), round(bsz[1] * 0.95, 1)]
    sizes['fw_cab'] = [csz[0], csz[1], round(csz[0] / 2, 1), round(csz[1] * 0.84, 1)]
    kit = {
        'fw_drop': {'kind': 'DROP', 'blocks_move': True, 'baked': True, 'name': 'THE DROP', 'stage': 'stand_in',
                    'why': 'the city 10 m down past the wall: nobody stands here and nothing here stops a shot (a solid piece, never an obstacle tile)'},
        'fw_broken': {'kind': 'DROP', 'blocks_move': True, 'baked': True, 'name': 'THE BROKEN END', 'stage': 'stand_in'},
        'fw_parapet': {'kind': 'LOW_COVER', 'h': 0.8, 'baked': True, 'name': 'THE PARAPET', 'stage': 'stand_in',
                       'why': "the deck's edge wall: a man crouched behind it is in cover, the way the median's Jersey barrier is"},
        'fw_gantry': {'src': gsrc, 'kind': 'COVER', 'h': 1.4, 'name': 'THE FALLEN SIGN', 'stage': 'stand_in', 'from': 'records/target/master_rig/cook_gantry (COOK 10/18)'},
        'fw_bent': {'src': bsrc, 'kind': 'COVER', 'h': 9.0, 'blocks_move': True, 'name': 'A BENT OF THE DECK', 'stage': 'stand_in', 'from': 'cover_pillar.webp at 1.7'},
        'fw_cab': {'src': csrc, 'kind': 'COVER', 'h': 1.5, 'name': "THE SEMI'S CAB", 'stage': 'stand_in', 'from': 'records/target/master_rig/cook_wreck rig_SE'}
    }
    out = {'version': 'freeway-kit-11-7', 'lane': 'freeway', 'rule': 'VAMILY 432, 430 (reuse first), 408(c) (every new picture a stand-in)',
           'made_by': 'tools/bohemia_freeway_kit_11_7_26.py', 'tile_px': [TW, TH], 'golden_candidate': 'freeway/fw_face_col.webp',
           'tiles': tiles, 'sizes': sizes, 'srcs': srcs, 'kit': kit}
    json.dump(out, open(os.path.join(OUT, 'freeway.json'), 'w'), indent=1)
    made = [f for f in os.listdir(OUT) if f.endswith('.webp')]
    print('tiles', len(tiles), 'pictures made', len(made), 'bytes', sum(os.path.getsize(os.path.join(OUT, f)) for f in made))

if __name__ == '__main__':
    main()
