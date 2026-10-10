#!/usr/bin/env python3
"""COOK FOUR [the settlement from the packs] -- rule 82a, rule 87 (Paolo 10/10).

The camp, the town and the fortress rebuilt OUT OF HIS APPROVED PACK TILES
(banks/BOHEMIA_HD_TILE_REPO_part1-4 keyed by banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26:
a tile not marked UP there is refused at load, so nothing here is cooked fresh).
Our own paint is only weather (contact shadow, dust at the wall foot) and light
(the night grade and the pools under lamps, fires and lit doors).

The hotspot boxes are COPIED from slices/settlement_ground/settlement_ground.json
to the pixel: each usable building is built INSIDE its box, so RUN TWO's screen
swaps a folder and nothing else.  Output: slices/settlement_ground_packs/ (the
current pictures stay live until DIRECTION passes these, rule 87).

  python3 tools/bohemia_cook4_settlement_from_packs.py

REFERENCE CHECK (9/4 compare law; rule 82 / 82a: for settlements the twin IS his pack):
  compared to: his approved pack tiles themselves (5. Roof tiles, Wall tiles (1), 14. Camp and
  tents, 8. Market Stalls, 7. Fences and palisades, the street and dirt pools), his thirty house
  skins (banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26, 30 of 30 UP 7/21), DIRECTION's settlement
  family in reference/art_bank/, and a Battle Brothers town screen as the library describes it
  (one still picture, the buildings you use read at a glance, the ground worn between them).
  structure taken: the pack's own pixel density (every source pixel lands as 2x2 screen pixels,
  the 44 px skins and the 96 px pack tiles alike, so no two densities sit side by side); a
  Vegas block is stucco and clay-tile roofs (the skins), not the pack's medieval thatch.
  what changed: round 1 built flat facade strips of repeats; round 2 builds the town from the
  skins with alleys between houses and one house fallen in, and the night light falls forward
  on to the ground in front of the lamp instead of a disc round it.
"""
import base64, io, json, os, random, collections
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'slices/settlement_ground/settlement_ground.json')
OUT = os.path.join(ROOT, 'slices/settlement_ground_packs')
W, H = 2060, 1092

# ---- the corpus, UP only -------------------------------------------------
_P, _UP = {}, collections.defaultdict(set)
def _load():
    for i in range(1, 5):
        d = json.load(open(os.path.join(ROOT, f'banks/BOHEMIA_HD_TILE_REPO_part{i}.txt')))
        for k, v in d['packs'].items():
            _P.setdefault(k, v)          # first chunk wins: the confirmed set's index space
    c = json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt')))
    for x in c['verdicts']:
        if x['v'] == 'UP':
            _UP[x['pack']].add(x['idx'])
_cache = {}
USED = collections.Counter()
def tile(pack, idx):
    if idx not in _UP[pack]:
        raise SystemExit(f'REFUSED: {pack}#{idx} is not in his approved set')
    k = (pack, idx)
    if k not in _cache:
        _cache[k] = Image.open(io.BytesIO(base64.b64decode(_P[pack][idx]['b64']))).convert('RGBA')
    USED[k] += 1
    return _cache[k]
def ups(pack):
    return sorted(_UP[pack])

def scaled(im, s):
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.NEAREST)
def fit(im, w, h):
    s = min(w / im.width, h / im.height)
    return scaled(im, s)

# ---- weather and light: the only paint of our own --------------------------
def shadow(canvas, x, y, w, h, a=110):
    sh = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).ellipse([x - w * 0.05, y - h * 0.5, x + w * 1.05, y + h * 0.5], fill=(20, 14, 10, a))
    canvas.alpha_composite(sh.filter(ImageFilter.GaussianBlur(9)))

def place(canvas, im, cx, by, sh=True):
    """bottom-centre anchored, with its contact shadow"""
    x, y = int(cx - im.width / 2), int(by - im.height)
    if sh:
        shadow(canvas, x, by - 2, im.width, max(10, im.height * 0.12))
    canvas.alpha_composite(im, (x, y))
    return (x, y, x + im.width, by)

# ---- ground ----------------------------------------------------------------
def ground(rng, pack, picks, s=2.0):
    g = Image.new('RGBA', (W, H))
    t0 = tile(pack, picks[0]); cw = int(min(t0.width, t0.height) * .74)  # inner cut: the pack's tile rims would draw a grid
    step = int(cw * s)
    for y in range(0, H, step):
        for x in range(0, W, step):
            t = tile(pack, rng.choice(picks))
            l, u = (t.width - cw) // 2, (t.height - cw) // 2
            c = t.crop((l, u, l + cw, u + cw))
            if rng.random() < .5: c = c.transpose(Image.FLIP_LEFT_RIGHT)
            g.alpha_composite(scaled(c, s).convert('RGBA'), (x, y))
    return g

def band(g, rng, pack, picks, y0, y1, s=2.0):
    """a road band across the picture, from the street pack"""
    t0 = tile(pack, picks[0]); cw = int(min(t0.width, t0.height) - 6); step = int(cw * s)
    y = y0
    while y < y1:
        if y + step > y1: y = y1 - step
        for x in range(0, W, step):
            t = tile(pack, rng.choice(picks))
            l, u = (t.width - cw) // 2, (t.height - cw) // 2
            g.alpha_composite(scaled(t.crop((l, u, l + cw, u + cw)), s), (x, y))
        if y + step >= y1: break
        y += step
    return g

# ---- buildings, assembled from pack parts -----------------------------------
def house(box, roof, wall, door, wins, rng):
    """facade of wall tiles, a door, windows, a roof of pack roof tiles; fills its hotspot box"""
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    b = Image.new('RGBA', (w, h))
    wall_h = int(h * .46); roof_h = h - wall_h
    wt = wall.crop((4, 4, wall.width - 4, wall.height - 4)); ws = wall_h / wt.height / 1.0
    wt = scaled(wt, ws)
    for x in range(0, w, wt.width):
        b.alpha_composite(wt, (x, roof_h))
    rt = roof.crop((2, 2, roof.width - 2, roof.height - 8))
    rt = rt.resize((rt.width * roof_h // rt.height, roof_h), Image.NEAREST)
    x = 0
    while x < w:
        b.alpha_composite(rt, (x, 0)); x += rt.width - 2
    d = fit(door, w, wall_h * .82)
    dx = rng.randint(int(w * .2), int(w * .8) - d.width)
    b.alpha_composite(d, (dx, h - d.height))
    for k in range(rng.randint(2, 3)):
        wi = fit(rng.choice(wins), w, wall_h * .5)
        wx = rng.randint(0, w - wi.width)
        if abs(wx + wi.width / 2 - dx - d.width / 2) < (wi.width + d.width) / 2 + 6:
            continue
        b.alpha_composite(wi, (wx, roof_h + int(wall_h * .18)))
    # weather: the wall foot darkens where the dust and the rain splash sit
    fo = Image.new('RGBA', (w, h)); dr = ImageDraw.Draw(fo)
    for i in range(14):
        dr.rectangle([0, h - 14 + i, w, h - 13 + i], fill=(40, 28, 18, 6 * i))
    b = _over(b, fo)
    return b, (x0 + dx, y1 - d.height, x0 + dx + d.width, y1)

def _over(b, fo):
    m = b.split()[3]; fo.putalpha(ImageChops.multiply(fo.split()[3], m)); return Image.alpha_composite(b, fo)

_SK = None
def skin(i):
    """one of his thirty approved house skins (all UP 7/21), 44 px -> 88 px, the pack's pixel size"""
    global _SK
    if _SK is None:
        _SK = json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt')))['tiles']
    USED[('house skin', _SK[i]['id'])] += 1
    return scaled(Image.open(io.BytesIO(base64.b64decode(_SK[i]['b64']))).convert('RGBA'), 2)

def skin_house(box, rng, roof=None, door_at=None):
    """a Vegas stucco house from the skins: clay-tile roof rows over stucco wall rows,
    the door cell on the ground row; fills its box from the bottom"""
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    b = Image.new('RGBA', (w, h)); C = 88
    cols = max(2, -(-w // C)); wall_rows = 2 if h < 300 else 2; roof_rows = max(1, (h - wall_rows * C) // C + 1)
    roof = roof if roof is not None else rng.choice([21, 22, 23, 24, 25, 26])
    wall = rng.choice([8, 9, 10, 11]); door_col = door_at if door_at is not None else rng.randint(1, max(1, cols - 2))
    top = h - (wall_rows + roof_rows) * C
    # the roof: the pack's clay or slate rows (5. Roof tiles), the skin's density was flat beside the props
    rt = tile('5. Roof tiles', {21: 26, 22: 26, 23: 29, 24: 29, 25: 27, 26: 27}[roof])
    rt = rt.crop((2, 2, rt.width - 2, rt.height - 8)); rh = h - wall_rows * C - top
    rt = scaled(rt, 2); x = 0
    while x < w:
        y = top
        while y < top + rh:
            b.alpha_composite(rt, (x, y)); y += rt.height - 24
        x += rt.width - 4
    eave = Image.new('RGBA', (w, 10), (30, 20, 14, 90)); b.alpha_composite(eave, (0, h - wall_rows * C))
    door = None
    for r in range(wall_rows):
        for k in range(cols):
            ground_row = r == wall_rows - 1
            b.alpha_composite(skin(wall), (k * C, h - (wall_rows - r) * C))
            if ground_row and k == door_col:
                d = fit(tile('4. Doors and entrances', rng.choice([2, 3, 6, 7])), C, C * 1.6)
                dx = k * C + (C - d.width) // 2; b.alpha_composite(d, (dx, h - d.height))
                door = (x0 + dx, y1 - d.height, x0 + dx + d.width, y1)
            elif rng.random() < .5 and not (ground_row and abs(k - door_col) < 1):
                wi = fit(tile('5. Windows and broken glass', rng.choice([0, 1, 2, 3, 4, 5, 6, 8])), C * .8, C * .8)
                b.alpha_composite(wi, (k * C + (C - wi.width) // 2, h - (wall_rows - r) * C + 6))
    fo = Image.new('RGBA', (w, h)); dr = ImageDraw.Draw(fo)
    for i in range(14):
        dr.rectangle([0, h - 14 + i, w, h - 13 + i], fill=(40, 28, 18, 6 * i))
    return _over(b, fo), door

def in_any(x, y, rects, pad=30):
    return any(r[0] - pad < x < r[2] + pad and r[1] - pad < y < r[3] + pad for r in rects)

# ---- the three tiers --------------------------------------------------------
def build(tier, var, hs, rng):
    S_DIRT, S_SOIL, S_ST, S_CON = '2. Dirt path tiles', '2. Soil and dirt tiles', '1. Cracked street tiles', '1. Cracked contrete tiles'
    lights, doors_lit, blocks = [], [], [h['box'] for h in hs.values()]
    if tier == 'camp':
        g = ground(rng, S_DIRT, [1, 2, 3, 4, 33, 34, 35, 36])
        road = None
    elif tier == 'town':
        g = ground(rng, S_SOIL, [x for x in ups(S_SOIL)[:8]])
        road = (380, 600); band(g, rng, S_ST, [0, 1, 2, 3, 8, 9, 10], *road)
    else:
        g = ground(rng, S_CON, ups(S_CON)[:6] + ups(S_CON)[18:24])
        road = None
    c = g
    # the usable buildings, each INSIDE its own hotspot box
    WIN = [tile('5. Windows and broken glass', i) for i in (0, 1, 2, 3, 4, 5, 6, 8)]
    DOOR = [tile('4. Doors and entrances', i) for i in (2, 3, 7, 6)]
    for name, h in hs.items():
        bx = h['box']; bw, bh = bx[2] - bx[0], bx[3] - bx[1]; cx, by = (bx[0] + bx[2]) / 2, bx[3]
        if name in ('clinic', 'barber') and (bw > 400 or tier != 'camp'):
            if tier == 'town':
                b, door = skin_house(bx, rng, roof=21 if name == 'barber' else 25)
            else:
                roof = tile('5. Roof tiles', {'camp': 28, 'fortress': 27}[tier])
                b, door = house(bx, roof, tile('Wall tiles (1)', 5), rng.choice(DOOR), WIN, rng)
            shadow(c, bx[0], by, bw, 26, 120); c.alpha_composite(b, (bx[0], bx[1]))
            doors_lit.append(door)
        elif name in ('clinic', 'barber'):
            t = tile('14. Camp and tents', 2 if name == 'clinic' else 3)
            place(c, fit(t, bw, bh), cx, by); doors_lit.append((cx - 25, by - 60, cx + 25, by))
        elif name == 'stall':
            t = tile('8. Market Stalls', rng.choice([1, 2, 4, 5, 6, 7]))
            place(c, fit(t, bw, bh), cx, by); lights.append((cx, by - bh * .6, 150))
        elif name == 'board':
            place(c, fit(tile('13. Port market', 30), bw, bh), cx, by)
        elif name == 'posts':
            ft = fit(tile('7. Fences and palisades', 2), 999, bh)
            x = bx[0]
            while x + ft.width <= bx[2] + 4:
                c.alpha_composite(ft, (int(x), by - ft.height)); x += ft.width - 2
    # the place around them: unusable houses, perimeter, props, lamps, fires, cars
    if tier == 'town':
        # the other houses: a row with alleys between them, and one fallen in
        lots = [[0, 0, 440, 364], [1600, 0, 2060, 364], [0, 720, 380, 1092], [470, 760, 700, 1092],
                [1040, 720, 1400, 1092], [1500, 760, 1760, 1092], [1830, 720, 2060, 1092]]
        lots = [bx for bx in lots if not any(in_any((bx[0] + bx[2]) / 2, (bx[1] + bx[3]) / 2, [hb], 0) for hb in blocks)]
        fallen = rng.randrange(len(lots))
        for i, bx in enumerate(lots):
            if i == fallen:
                for k in range(3):
                    place(c, scaled(tile('12. Ruined building parts', rng.choice(ups('12. Ruined building parts'))), 2.0),
                          bx[0] + (k + .5) * (bx[2] - bx[0]) / 3, bx[3] - rng.randint(0, 40))
            else:
                b, _ = skin_house(bx, rng); shadow(c, bx[0], bx[3], bx[2] - bx[0], 26, 120)
                c.alpha_composite(b, (bx[0], bx[1]))
            blocks.append(bx)
        for x in range(120, W, 520):
            for y in (378, 640):
                if not in_any(x, y, blocks, 10):
                    place(c, fit(tile('18. Light sources and fire barrels', 1), 999, 170), x, y); lights.append((x, y - 150, 190))
        cars = ups('9. Abandoned cards')
        for x in (rng.randint(200, 700), rng.randint(1350, 1850)):
            place(c, scaled(tile('9. Abandoned cards', rng.choice(cars)), 2.2), x, rng.choice([520, 580]))
    if tier == 'camp':
        fire = tile('14. Camp and tents', 15)
        place(c, scaled(fire, 1.9), 900, 640); lights.append((900, 590, 260))
        for _ in range(5):
            x, y = rng.randint(80, W - 80), rng.randint(200, 1060)
            if not in_any(x, y, blocks, 60):
                place(c, fit(tile('14. Camp and tents', rng.choice([2, 3])), 260, 210), x, y); blocks.append((x - 130, y - 210, x + 130, y))
    if tier == 'fortress':
        # the wall around it: palisade along the top and the sides, an industrial gate at the bottom
        pal = fit(tile('7. Fences and palisades', 6), 999, 150)
        for x in range(0, W, pal.width - 2):
            if not in_any(x + pal.width / 2, 60, blocks, 0):
                c.alpha_composite(pal, (x, 0))
        ruins = ups('12. Ruined building parts')
        for _ in range(4):
            x, y = rng.randint(100, W - 100), rng.randint(260, 1060)
            if not in_any(x, y, blocks, 80):
                place(c, scaled(tile('12. Ruined building parts', rng.choice(ruins)), 2.2), x, y); blocks.append((x - 100, y - 200, x + 100, y))
        gate = fit(tile('11. Industrial doors and gates', 0), 999, 200)
        place(c, gate, 1900, 1092)
    # scatter: barrels, crates, trash, dead trees, fire barrels (the pack's own)
    SC = [('11. Crates and barrels', 1.6), ('16. Dead trees and plants', 2.0), ('14. Trash and junk props', 1.6),
          ('7. Trash and debris', 1.6), ('3. Barricades and blockades', 1.6), ('11. Survival props', 1.2)]
    fires = [i for i in ups('18. Light sources and fire barrels') if 16 <= i <= 31]
    n = {'camp': 26, 'town': 12, 'fortress': 34}[tier]
    tries = 0
    while n and tries < 900:
        tries += 1
        x, y = rng.randint(30, W - 30), rng.randint(140, H - 10)
        if in_any(x, y, blocks, 40) or (road and road[0] - 10 < y < road[1] + 130):
            continue
        if rng.random() < .16:
            place(c, scaled(tile('18. Light sources and fire barrels', rng.choice(fires)), 1.7), x, y); lights.append((x, y - 60, 170))
        else:
            p, s = rng.choice(SC); place(c, scaled(tile(p, rng.choice(ups(p))), s), x, y)
        blocks.append((x - 40, y - 60, x + 40, y)); n -= 1
    return c, lights, doors_lit

def grade(day):
    """the dead world's grade: vibrance down, warm dust in the shadows (analog horror at the source)"""
    rgb = day.convert('RGB'); gray = rgb.convert('L').convert('RGB')
    rgb = Image.blend(rgb, gray, .28)
    dust = Image.new('RGB', rgb.size, (150, 120, 88))
    return Image.blend(rgb, ImageChops.multiply(rgb, dust).point(lambda v: min(255, v * 1.7)), .25)

def night(day, lights, doors):
    d = day.convert('RGB')
    base = ImageChops.multiply(d, Image.new('RGB', d.size, (78, 86, 118)))
    glow = Image.new('L', d.size, 0); dr = ImageDraw.Draw(glow)
    for x, y, r in lights:
        # the light falls forward on to the ground in front of the lamp (the camera looks north)
        g0 = y + r * .75
        dr.polygon([(x - r * .18, y + 10), (x + r * .18, y + 10), (x + r * .95, g0 + r * .3), (x - r * .95, g0 + r * .3)], fill=150)
        dr.ellipse([x - r, g0 - r * .35, x + r, g0 + r * .45], fill=235)
        dr.ellipse([x - r * .25, y - r * .25, x + r * .25, y + r * .25], fill=255)
    for (x0, y0, x1, y1) in doors:
        dr.polygon([(x0, y1), (x1, y1), (x1 + 60, y1 + 120), (x0 - 60, y1 + 120)], fill=200)
        dr.rectangle([x0 + 4, y0 + 4, x1 - 4, y1], fill=255)
    glow = glow.filter(ImageFilter.GaussianBlur(28))
    warm = ImageChops.multiply(d, Image.new('RGB', d.size, (255, 196, 130)))
    return Image.composite(warm, base, glow)

def main():
    _load()
    src = json.load(open(SRC)); out = json.loads(json.dumps(src))
    out.update(version='settlement-ground-packs-10-10', built='10/10/26', lane='cook 4',
               note=src['note'] + '; COOK FOUR: rebuilt from his approved pack tiles (rule 82a), hotspots copied to the pixel; NOT LIVE until DIRECTION passes it (rule 87)')
    os.makedirs(OUT, exist_ok=True)
    for tier, t in src['tiers'].items():
        if tier not in ('camp', 'town', 'fortress'):
            continue          # 'home' (his block) is COOK's own place, b46a874; not this lane's sheet
        for vi, var in enumerate(t['variants']):
            rng = random.Random(f'{tier}{vi}cook4')
            day, lights, doors = build(tier, var, var['hotspots'], rng)
            day = grade(day)
            day.save(os.path.join(OUT, var['src']), quality=88)
            night(day, lights, doors).save(os.path.join(OUT, var['night_src']), quality=88)
            print(tier, vi, 'lights', len(lights), 'doors', len(doors))
    json.dump(out, open(os.path.join(OUT, 'settlement_ground.json'), 'w'), indent=1)
    used = sorted(f'{p}#{i}' for p, i in USED)
    open(os.path.join(OUT, 'PACK_TILES_USED.txt'), 'w').write(
        f'{len(used)} distinct approved pack tiles, every one UP in the 7/13 confirmed set\n' + '\n'.join(used) + '\n')
    print(len(used), 'pack tiles used')

if __name__ == '__main__':
    main()
