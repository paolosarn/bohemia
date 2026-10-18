#!/usr/bin/env python3
"""COOK TWO [the ground at night from the packs], round one (10/18).

The street kit's night in the pack's own palette (rule 73: night is a colour; rule 82a: his packs are the source).
Nothing is drawn. The same crossing window as [the same crossing before and after] (block_corner_0 at 1:1) is
taken to night by ONE colour map, and every colour the map lands on is a colour that already exists in his bought
road, ground and lamp tiles (snapped, nearest in Lab). The lamps are his own pack lamp (pack 18, 000) at its own
pixels, standing at the crossing's four corners; the pool shows the day's ground warmed toward his lamp's own
bulb colour, also snapped to his colours; the pool's edge is an ordered dither, never a soft alpha.

Beside it, for the judge: COMBAT's night as the fight draws it now (BOHEMIA_FIGHT.html nightPass: a third of the
way to grey, then the moonlight multiplied in), on the same window, so the difference is the only thing on the sheet.

Out: records/target/COOK2_THE_GROUND_AT_NIGHT.png (the sheet), COOK2_THE_GROUND_AT_NIGHT.json (the numbers),
COOK2_THE_GROUND_AT_NIGHT_PALETTE.json (the night palette, every entry a colour of his packs, with its source tile),
and the pieces the sheet shows: COOK2_THE_GROUND_AT_NIGHT_CROSSING.png (the night window) and
COOK2_THE_GROUND_AT_NIGHT_CELL_<n>.png (the night cut to his tile size, 88 px, the cells the cull reads).

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set: road, ground and lamp families), the card of numbers and
skills/bohemia-pixel-art, AH-01 and AH-03. The source is his own tiles, his lamp and the board as laid; the twin on
the sheet is the fight's own night pass; no reference game.
"""
import glob, json, os, colorsys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records', 'target')
BOARD = os.path.join(ROOT, 'slices', 'fight_ground', 'block_corner_0.webp')
LAMP = os.path.join(ROOT, 'reference', 'art_bank', 'lamp', 'pack_18_light_sources_and_fire_barrels_000.png')
WINDOW = json.load(open(os.path.join(OUT, 'COOK2_THE_SAME_CROSSING_BEFORE_AND_AFTER.json')))['window_px']
GROUND = json.load(open(os.path.join(ROOT, 'slices', 'fight_ground', 'fight_ground.json')))
PXM = GROUND['px_per_metre']            # 42.9 px a metre on the fight board
POOL_M = 7.0                            # a street lamp's pool, COMBAT TWO's lights (radius_m 7)
NIGHT_TINT, NIGHT_GREY = (185, 198, 240), 0.35   # COMBAT's night, copied from BOHEMIA_FIGHT.html to show it

# THE MAP (the only numbers that make the night; each with why)
LUM_KEEP = 0.60      # night luminance over day: the fight's floor is 'never under half' (rule 73, the sun school page)
SAT_KEEP = 0.50      # colour pulled down at night (the eye loses colour before it loses shape)
MOON_HUE = 222.0     # degrees: COMBAT's moon tint (185,198,240) is 222; his road shadows lean warm (measured, in the json)
HUE_MAX_DARK, HUE_MAX_LIGHT = 22.0, 9.0   # degrees moved toward the moon, capped: the darks lean harder than the lights
                                          # (a hue-shifting ramp, tell 6's 8 degrees), never round the wheel to magenta
POOL_CURVE = 2.4     # the lamp lifts the ground by 1-(1-c)^k: the darks rise most, the lights compress instead of clipping
BULB_SCREEN = 0.10   # how much of his bulb's own colour is screened into the pool
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0


def srgb_to_lab(rgb):
    c = rgb.astype(np.float64) / 255.0
    c = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
    xyz = c @ M.T / np.array([0.95047, 1.0, 1.08883])
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def luma(rgb):
    return (rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722) / 255.0


def pack_colours():
    """Every opaque colour in his road, ground and lamp tiles, with the tile it first came from."""
    seen = {}
    for fam in ('road', 'ground', 'lamp'):
        for p in sorted(glob.glob(os.path.join(ROOT, 'reference', 'art_bank', fam, 'pack_*.png'))):
            im = np.asarray(Image.open(p).convert('RGBA'))
            px = im[im[..., 3] == 255][:, :3]
            for c in np.unique(px, axis=0):
                seen.setdefault(tuple(int(v) for v in c), os.path.relpath(p, ROOT))
    cols = np.array(list(seen.keys()), dtype=np.uint8)
    # one real colour of his per 5-bit cell keeps the search small; every kept entry is still a colour he bought
    key = (cols[:, 0].astype(np.int32) >> 3 << 10) | (cols[:, 1].astype(np.int32) >> 3 << 5) | (cols[:, 2] >> 3)
    _, first = np.unique(key, return_index=True)
    cols = cols[first]
    return cols, [seen[tuple(int(v) for v in c)] for c in cols]


def nearest(rgb_list, pal, pal_lab):
    """Nearest of his colours in Lab, chunked (no scipy in the container)."""
    q = srgb_to_lab(rgb_list)
    out = np.empty(len(q), dtype=np.int64)
    for i in range(0, len(q), 64):
        d = ((q[i:i + 64, None, :] - pal_lab[None, :, :]) ** 2).sum(-1)
        out[i:i + 64] = d.argmin(1)
    return out


def snap(img, pal, pal_lab, cache):
    """Snap every pixel to his nearest colour; a 6-bit key per channel keeps the search to the colours in use."""
    key = (img[..., 0].astype(np.int32) >> 2 << 12) | (img[..., 1].astype(np.int32) >> 2 << 6) | (img[..., 2] >> 2)
    uk, inv = np.unique(key.ravel(), return_inverse=True)
    todo = [k for k in uk if k not in cache]
    if todo:
        t = np.array(todo)
        rgb = np.stack([(t >> 12 & 63) << 2 | 2, (t >> 6 & 63) << 2 | 2, (t & 63) << 2 | 2], -1).astype(np.uint8)
        for k, n in zip(todo, nearest(rgb, pal, pal_lab)):
            cache[int(k)] = int(n)
    idx = np.array([cache[int(k)] for k in uk])[inv].reshape(key.shape)
    return pal[idx], idx


def night_map(rgb):
    """The night as a colour: luminance kept to 0.6, colour down, the hue leaning to the moon, harder in the darks."""
    f = rgb.reshape(-1, 3).astype(np.float64) / 255.0
    out = np.empty_like(f)
    for i, (r, g, b) in enumerate(f):
        h, l, s = colorsys.rgb_to_hls(r, g, b)
        cap = (HUE_MAX_LIGHT + (HUE_MAX_DARK - HUE_MAX_LIGHT) * (1 - l)) / 360.0
        hd = (MOON_HUE / 360.0 - h + 0.5) % 1.0 - 0.5
        # a grey has no hue to pull: give it the moon's at a quiet saturation instead
        h2 = (h + max(-cap, min(cap, hd))) % 1.0 if s > 0.04 else MOON_HUE / 360.0
        s2 = s * SAT_KEEP if s > 0.04 else 0.10 + 0.08 * (1 - l)
        out[i] = colorsys.hls_to_rgb(h2, l * LUM_KEEP, min(1.0, s2))
    return (out * 255).round().clip(0, 255).astype(np.uint8).reshape(rgb.shape)


def lut_map(img, fn):
    key = (img[..., 0].astype(np.int32) >> 2 << 12) | (img[..., 1].astype(np.int32) >> 2 << 6) | (img[..., 2] >> 2)
    uk, inv = np.unique(key.ravel(), return_inverse=True)
    rgb = np.stack([(uk >> 12 & 63) << 2 | 2, (uk >> 6 & 63) << 2 | 2, (uk & 63) << 2 | 2], -1).astype(np.uint8)
    return fn(rgb[None])[0][inv].reshape(img.shape)


def combat_night(img):
    """BOHEMIA_FIGHT.html nightPass at brightness 0: saturation toward grey 0.35, then multiply by the moon tint."""
    f = img.astype(np.float64) / 255.0
    y = (f * np.array([0.3, 0.59, 0.11])).sum(-1, keepdims=True)
    f = f * (1 - NIGHT_GREY) + y * NIGHT_GREY
    return (f * np.array(NIGHT_TINT) / 255.0 * 255).round().clip(0, 255).astype(np.uint8)


def main():
    pal, src = pack_colours()
    pal_lab = srgb_to_lab(pal)
    # his road packs' own shadow hue: the hue of the darkest quarter of his road pixels that carry any colour
    roads = np.concatenate([np.asarray(Image.open(p).convert('RGB')).reshape(-1, 3)
                            for p in sorted(glob.glob(os.path.join(ROOT, 'reference/art_bank/road/pack_*.png')))])
    L = luma(roads)
    dark = roads[L < np.quantile(L, 0.25)].astype(np.float64) / 255
    hls = np.array([colorsys.rgb_to_hls(*c) for c in dark[::37]])
    tinted = hls[hls[:, 2] > 0.06]
    ang = np.angle(np.exp(2j * np.pi * tinted[:, 0]).mean()) / (2 * np.pi) * 360 % 360

    board = np.asarray(Image.open(BOARD).convert('RGB'))
    x0, y0, x1, y1 = WINDOW
    day = board[y0:y1, x0:x1].copy()
    H, W = day.shape[:2]
    cache = {}
    night_raw = lut_map(day, night_map)
    night, idx = snap(night_raw, pal, pal_lab, cache)

    # the lamps: his pack lamp, at its own pixels, foot on each corner of the crossing's walks
    lamp = np.asarray(Image.open(LAMP).convert('RGBA'))
    bulb = lamp[(lamp[..., 3] == 255) & (luma(lamp[..., :3]) > 0.72)][:, :3]
    bulb_rgb = np.median(bulb, 0)
    rx0, rx1 = 1032 - x0, 1544 - x0            # the north-south road band in the window (the before/after json)
    ry0, ry1 = 728 - y0, 1091 - y0
    feet = [(rx0 - 20, ry0 - 6), (rx1 + 20, ry0 - 6), (rx0 - 20, ry1 + 22), (rx1 + 20, ry1 + 22)]
    R = POOL_M * PXM
    yy, xx = np.mgrid[0:H, 0:W]
    lit = np.zeros((H, W), bool)
    for fx, fy in feet:
        d = np.hypot((xx - fx), (yy - fy) / 0.7071)   # the pool on the 45 degree ground is an ellipse, south faces seen
        t = BAYER[yy % 4, xx % 4]
        lit |= (d < 0.75 * R) | ((d < R) & (t > (d / R - 0.75) / 0.25))
    warm = day.astype(np.float64) / 255.0
    warm = 1 - (1 - (1 - (1 - warm) ** POOL_CURVE)) * (1 - bulb_rgb / 255.0 * BULB_SCREEN)   # the ground lifted, his bulb screened in
    warm, widx = snap((warm * 255).round().clip(0, 255).astype(np.uint8), pal, pal_lab, cache)
    out = night.copy()
    out[lit] = warm[lit]
    used = np.concatenate([idx[~lit], widx[lit]])

    # his lamp itself at night: the body to his night colours, the glass kept (the light comes from somewhere)
    lb = lamp[..., :3]
    glass = (lamp[..., 3] == 255) & (luma(lb) > 0.55)
    lnight, _ = snap(lut_map(lb.copy(), night_map), pal, pal_lab, cache)
    lnight[glass] = lb[glass]
    lh, lw = lamp.shape[:2]
    shown = out.copy()
    for fx, fy in sorted(feet, key=lambda f: f[1]):
        ox, oy = fx - lw // 2, fy - lh
        a = lamp[..., 3] == 255
        reg = shown[oy:oy + lh, ox:ox + lw]
        reg[a] = lnight[a]
    combat = combat_night(day)

    # the cells the cull reads: the night cut to his tile size (88 px), across the crossing, lamps off the cells
    cells = []
    for cy in range(ry0 - 88, ry1 + 88, 88):
        for cx in range(rx0 - 88, rx1 + 88, 88):
            if 0 <= cx and cx + 88 <= W and 0 <= cy and cy + 88 <= H:
                cells.append((cx, cy))

    def nums(a, b):
        return {'luminance_night_over_day': round(float(luma(a).mean() / luma(b).mean()), 3)}

    lum_dark, lum_lit = float(luma(out[~lit]).mean()), float(luma(out[lit]).mean())
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(shown).save(os.path.join(OUT, 'COOK2_THE_GROUND_AT_NIGHT_CROSSING.png'))
    cell_files = []
    for i, (cx, cy) in enumerate(cells):
        f = os.path.join(OUT, 'COOK2_THE_GROUND_AT_NIGHT_CELL_%02d.png' % i)
        Image.fromarray(out[cy:cy + 88, cx:cx + 88]).save(f)
        cell_files.append(os.path.relpath(f, ROOT))

    # the night palette file: every colour the night uses, each one a colour of his packs, with its tile
    uniq, counts = np.unique(used, return_counts=True)
    palette = {'lane': 'cook 2', 'row': 'the ground at night from the packs', 'made': '10/18',
               'what': 'every colour the night crossing uses; each is a colour that already exists in his bought road, '
                       'ground or lamp tiles, with the first tile it was found in',
               'count': int(len(uniq)),
               'colours': [{'rgb': '#%02x%02x%02x' % tuple(int(v) for v in pal[u]), 'px': int(c), 'from': src[u]}
                           for u, c in sorted(zip(uniq, counts), key=lambda t: -t[1])]}
    json.dump(palette, open(os.path.join(OUT, 'COOK2_THE_GROUND_AT_NIGHT_PALETTE.json'), 'w'), indent=1)

    # THE SHEET: COMBAT's night now | the pack-palette night, 1:1, his lamp and a road tile of his beside
    pad, top = 24, 92
    sheet = Image.new('RGB', (W * 2 + pad * 3, H + top + 300), (14, 14, 16))
    sheet.paste(Image.fromarray(combat), (pad, top))
    sheet.paste(Image.fromarray(shown), (W + pad * 2, top))
    dr = ImageDraw.Draw(sheet)
    try:
        fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 22)
        sm = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 16)
    except OSError:
        fnt = sm = ImageFont.load_default()
    dr.text((pad, 14), 'THE GROUND AT NIGHT, FROM HIS PACKS  (the same crossing, 1:1)', fill=(232, 170, 80), font=fnt)
    dr.text((pad, 46), 'px 1 (his tiles at their own pixels) | palette records/target/COOK2_THE_GROUND_AT_NIGHT_PALETTE.json '
            '(%d colours, all his) | light: the moon from above + his lamp, pack 18 no. 000' % len(uniq),
            fill=(190, 190, 190), font=sm)
    dr.text((pad, top - 22), 'LEFT: the night the fight draws now (grey + blue multiplied over the day)', fill=(200, 200, 200), font=sm)
    dr.text((W + pad * 2, top - 22), 'RIGHT: the night in his own colours, his lamps lighting his ground', fill=(200, 200, 200), font=sm)
    yb = top + H + 40
    dr.text((pad, yb - 26), 'THE TWINS AS BOUGHT, at their own pixels: his lamp, his road tile by day, the same tile by this night',
            fill=(200, 200, 200), font=sm)
    sheet.paste(Image.fromarray(lamp[..., :3]), (pad, yb), Image.fromarray(((lamp[..., 3] == 255) * 255).astype(np.uint8)))
    rt = sorted(glob.glob(os.path.join(ROOT, 'reference/art_bank/road/pack_*.png')))[0]
    rti = np.asarray(Image.open(rt).convert('RGB'))
    sheet.paste(Image.fromarray(rti), (pad + 90, yb))
    rtn, _ = snap(lut_map(rti.copy(), night_map), pal, pal_lab, cache)
    sheet.paste(Image.fromarray(rtn), (pad + 110 + rti.shape[1], yb))
    dr.text((pad + 140 + rti.shape[1] * 2, yb + 4), os.path.relpath(rt, ROOT), fill=(150, 150, 150), font=sm)
    sheet.save(os.path.join(OUT, 'COOK2_THE_GROUND_AT_NIGHT.png'))

    rep = {'lane': 'cook 2', 'row': 'the ground at night from the packs', 'round': 1, 'made': '10/18',
           'board': os.path.relpath(BOARD, ROOT), 'window_px': WINDOW, 'scale': '1:1',
           'his_colours_in_the_three_families': int(len(pal)),
           'his_road_shadow_hue_deg': round(float(ang), 1), 'moon_hue_used_deg': MOON_HUE,
           'night_colours_used': int(len(uniq)), 'night_colours_not_his': 0,
           'pack_palette_night': nums(out[~lit], day[~lit]),
           'combat_night_now': nums(combat, day),
           'pool_over_dark': round(lum_lit / lum_dark, 2), 'pool_floor': 3.0,
           'lamps': {'tile': os.path.relpath(LAMP, ROOT), 'feet_px_in_window': feet, 'pool_m': POOL_M,
                     'bulb_rgb': [int(v) for v in bulb_rgb], 'at_own_pixels': [int(lw), int(lh)]},
           'pool_edge': 'ordered 4x4 dither over the outer quarter; zero half-transparent pixels',
           'cells': cell_files,
           'map': {'lum_keep': LUM_KEEP, 'sat_keep': SAT_KEEP, 'hue_max_dark_deg': HUE_MAX_DARK,
                   'hue_max_light_deg': HUE_MAX_LIGHT, 'pool_curve': POOL_CURVE, 'bulb_screen': BULB_SCREEN}}
    json.dump(rep, open(os.path.join(OUT, 'COOK2_THE_GROUND_AT_NIGHT.json'), 'w'), indent=1)
    print(json.dumps({k: rep[k] for k in ('his_road_shadow_hue_deg', 'night_colours_used', 'pack_palette_night',
                                          'combat_night_now', 'pool_over_dark')}, indent=1), len(cells), 'cells')


if __name__ == '__main__':
    main()
