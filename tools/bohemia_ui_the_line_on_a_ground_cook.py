#!/usr/bin/env python3
"""BOHEMIA -- UI [the line on a ground]: THE COMPANY STANDS ON SOMETHING. THE PAINTER (10/18/26, ui-opus-f)

Rule 88 and the twin's difference 2 (records/BOHEMIA_THE_ROSTER_AND_THE_POSTS_LOOK_10_10_26.md): the company screen sat
on flat near-black where the opening screen he called awesome sits on the painted night valley. This paints the ground
the two lines stand on, and the hall's floor, as CANDIDATES (rule 100: nothing here is in slices/; the sheet tool lays
them over the real screens in the browser only).

WHERE EVERY PIXEL COMES FROM (rule 82a, rule 115):
  - THE GROUND is his purchased packs, cut from banks/BOHEMIA_HD_TILE_REPO_part*.txt by pack and index (the camp: '2. Soil
    and dirt tiles', the hall: '1. Cracked contrete tiles'); the interior of each tile is laid in a brick bond with two
    or more variants and no run over four (rule 114a); nothing of his is redrawn, only re-lit.
  - THE PROPS are the rig's own renders, at one art pixel to one css pixel, never pack props (rule 115a): DIRECTION's
    truck (records/target/master_rig/round2_truck), COOK's lamp, sandbags and tyres (records/target/master_rig/cook_*),
    each with the rig's own contact shadow (shadow_*.png).
  - THE NIGHT is a re-light, never a darkening (rule 114, the fourth tell): every pixel's luminance is read through one
    of two hue-shifted ramps, the moon's (cold blue darks to a warm dust grey, 40 degrees of hue) and the lamp's (red
    brown to sodium amber), and the lamp's light falls off in FIVE STEPPED RINGS with a 4x4 ordered dither where two
    rings meet: no gradient anywhere. The material's own colour survives in proportion to the light (15 percent in
    moonlight, 80 under the lamp), the way a night eye loses colour first.
  - ONE LIGHT (rule 114a): the lamp. The block still has power and nobody built the camp under it on purpose (the
    title's own wrong thing, bible R1).

    python3 tools/bohemia_ui_the_line_on_a_ground_cook.py      -> records/target/ui_line_on_a_ground/

Pure: PIL and numpy, no browser. The manifest names every tile and prop it laid, with the sha1 of the bank's bytes, so
the gate can prove the ground is his and not drawn.
"""
import base64, hashlib, io, json, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get('BM_OUT') or os.path.join(ROOT, 'records/target/ui_line_on_a_ground')
RIG = os.path.join(ROOT, 'records/target/master_rig')

CAMP_PACK = '2. Soil and dirt tiles'
CAMP_TILES = [0, 1, 20, 21, 22]          # the plain dirt of the pack (no flower border, no stones), the darker half
HALL_PACK = '1. Cracked contrete tiles'
HALL_TILES = [0, 1, 2, 6, 7]             # the plain cracked slabs (no weeds, no paint, no drain)
INSET = 8                                 # each soil tile's rim is about 4 px of irregular edge; the interior is laid

# the two ramps, dark to light; each step names its hue so the hue shift is a number, not a claim
MOON = [(5, 7, 13), (12, 14, 22), (22, 22, 30), (33, 31, 36), (44, 40, 38)]
LAMP = [(30, 15, 11), (68, 38, 22), (118, 74, 38), (176, 124, 66), (226, 182, 116)]
CHROMA = [0.15, 0.32, 0.5, 0.66, 0.8]    # how much of the material's own colour survives at each light level
MIX = [0.0, 0.25, 0.5, 0.75, 1.0]        # how far a level is from the moon's ramp to the lamp's
BODY = (18, 14, 10)                       # the company screen's own ground below the band (#120e0a)
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0


def bank():
    packs = {}
    for i in range(1, 5):
        d = json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_HD_TILE_REPO_part%d.txt' % i)))
        for k, v in d['packs'].items():
            if k in (CAMP_PACK, HALL_PACK):
                packs[k] = v
    return packs


def tile(packs, pack, idx):
    raw = base64.b64decode(packs[pack][idx]['b64'])
    return Image.open(io.BytesIO(raw)).convert('RGBA'), hashlib.sha1(raw).hexdigest()


def ramp(stops, t):
    """t in [0,1] -> colour, linear between the five stops (the ramp is the stops; between them is the texture)"""
    s = np.asarray(stops, float)
    x = np.clip(t, 0, 1) * (len(s) - 1)
    i = np.minimum(np.floor(x).astype(int), len(s) - 2)
    f = (x - i)[..., None]
    return s[i] * (1 - f) + s[i + 1] * f


def relight(rgb, level, lo=0.25, hi=0.95):
    """rgb HxWx3 floats 0..255, level HxW ints 0..4 -> the night colour. Luminance picks the place on the ramp; the
    level picks the ramp; the material's chroma survives by CHROMA[level]."""
    L = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]) / 255.0
    t = (L - lo) / (hi - lo)
    out = np.zeros_like(rgb)
    grey = L[..., None] * 255.0
    for k in range(5):
        m = level == k
        if not m.any():
            continue
        c = ramp(MOON, t[m]) * (1 - MIX[k]) + ramp(LAMP, t[m]) * MIX[k]
        out[m] = np.clip(c + CHROMA[k] * (rgb[m] - grey[m]) * (0.35 + 0.65 * MIX[k]), 0, 255)
    return out


def rings(W, H, cx, cy, radii, squash=0.5):
    """five stepped light levels round the lamp's foot, an ellipse on the ground (the art is three-quarter, so the
    pool is flatter than it is wide), with a 4x4 ordered dither where two rings meet: never a gradient"""
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.hypot((xx - cx), (yy - cy) / squash)
    lev = np.zeros((H, W), int)
    band = 7.0
    for k, r in enumerate(radii):            # radii from the outside in: level 1 .. 4
        inside = d < r - band / 2
        edge = (d >= r - band / 2) & (d < r + band / 2)
        frac = (r + band / 2 - d) / band       # 1 at the inner side of the edge, 0 at the outer
        dith = frac > BAYER[yy % 4, xx % 4]
        lev[inside | (edge & dith)] = k + 1
    return lev


def lay(packs, pack, ids, W, H, seed, inset, bond=True):
    """the pack's tiles laid in a brick bond, two or more variants, never the same tile beside or above itself, no run
    over four; returns the RGBA ground and the placements"""
    rng = np.random.RandomState(seed)
    srcs = {i: tile(packs, pack, i) for i in ids}
    crops = {}
    for i, (im, sha) in srcs.items():
        w, h = im.size
        crops[i] = im.crop((inset, inset, w - inset, h - inset))
    cw = min(c.width for c in crops.values())
    ch = min(c.height for c in crops.values())
    crops = {i: c.crop((0, 0, cw, ch)) for i, c in crops.items()}
    # every tile brought to the set's own middle brightness before it is laid, so the bond does not read as patches
    # (the pack's plain dirt runs 0.66 to 0.71 in value tile to tile); the night ramps then do the lighting
    def lum(c):
        a = np.asarray(c).astype(float)
        return (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2])[a[..., 3] > 200].mean()
    target = float(np.median([lum(c) for c in crops.values()]))
    for i, c in list(crops.items()):
        a = np.asarray(c).astype(float)
        a[..., :3] = np.clip(a[..., :3] * (target / lum(c)), 0, 255)
        crops[i] = Image.fromarray(a.astype(np.uint8), 'RGBA')
    canvas = Image.new('RGBA', (W, H), BODY + (255,))
    placed, grid = [], {}
    for r in range(-1, H // ch + 2):
        off = (cw // 2) * (r % 2) if bond else 0
        for c in range(-1, W // cw + 2):
            x, y = c * cw - off, r * ch
            if x >= W or y >= H or x + cw <= 0 or y + ch <= 0:
                continue
            bad = {grid.get((r, c - 1)), grid.get((r - 1, c)), grid.get((r - 1, c + (1 if r % 2 else -1)))}
            pick = [i for i in ids if i not in bad] or ids
            i = pick[rng.randint(len(pick))]
            grid[(r, c)] = i
            flip = bool(rng.randint(2))         # left-right only: the pack's light is from the top, a vertical flip would turn it
            im = crops[i].transpose(Image.FLIP_LEFT_RIGHT) if flip else crops[i]
            canvas.alpha_composite(im, (x, y)) if x >= 0 and y >= 0 else canvas.paste(im, (x, y), im)
            placed.append({'pack': pack, 'idx': i, 'sha1': srcs[i][1], 'x': x, 'y': y, 'flip': flip, 'crop': [inset, inset, cw, ch]})
    return canvas, placed


def prop(name, facing):
    im = Image.open(os.path.join(RIG, name, 'rig_%s.png' % facing)).convert('RGBA')
    sp = os.path.join(RIG, name, 'shadow_%s.png' % facing)
    sh = Image.open(sp).convert('RGBA') if os.path.exists(sp) else None
    return im, sh


def foot(im):
    """the lowest inked row's middle: where the prop meets the ground"""
    a = np.asarray(im)[..., 3]
    ys, xs = np.nonzero(a > 8)
    yb = ys.max()
    return int(xs[ys >= yb - 2].mean()), int(yb)


# the scene, per screen: (name, facing, foot x, foot y) in the band's own pixels; the lamp first (its foot is the pool)
SCENES = {
    # upright 390 wide: the line covers the band edge to edge, so the camp is the lamp at the right end of the back row
    # and the tyres under it; the faces sit on the quiet dark (the rest area, rule 114's fifth tell)
    'upright': {'W': 390, 'H': 264, 'lamp': (352, 196), 'radii': [150, 112, 78, 48],
                'props': [('cook_lamp', 'SW', 352, 196), ('cook_tyres', 'SW', 300, 238)]},
    # sideways 844 wide: the line ends at x 476 and the right of the band was empty; the truck is parked there under the
    # lamp, the sandbags against its nose, the tyres behind the line's end
    'sideways': {'W': 844, 'H': 264, 'lamp': (612, 206), 'radii': [230, 170, 118, 72],
                 'props': [('cook_lamp', 'SW', 612, 206), ('round2_truck', 'SE', 812, 236), ('cook_sandbags', 'SW', 560, 252),
                           ('cook_tyres', 'SW', 516, 200)]},
}


def camp(packs, view, props=True):
    S = SCENES[view]
    W, H = S['W'], S['H']
    ground, placed = lay(packs, CAMP_PACK, CAMP_TILES, W, H, 1018 + W, INSET)
    g = np.asarray(ground).astype(float)
    cx, cy = S['lamp']
    lev = rings(W, H, cx, cy, S['radii'])
    # the rig's contact shadows take the ground two levels down where they fall (the contact line, rule 114a)
    stand = []
    if props:
        for name, facing, fx, fy in S['props']:
            im, sh = prop(name, facing)
            px, py = foot(im)
            ox, oy = fx - px, fy - py
            stand.append((name, facing, im, ox, oy))
            if sh is not None:
                a = np.zeros((H, W))
                tmp = Image.new('RGBA', (W, H), (0, 0, 0, 0))
                tmp.paste(sh, (ox, oy), sh)
                a = np.asarray(tmp)[..., 3] / 255.0
                yy, xx = np.mgrid[0:H, 0:W]
                drop = a > BAYER[yy % 4, xx % 4] * 0.9 + 0.05
                lev = np.where(drop, np.maximum(lev - 2, 0), lev)
    out = relight(g[..., :3], lev)
    canvas = Image.fromarray(np.dstack([out, np.full((H, W), 255.0)]).astype(np.uint8), 'RGBA')
    # the props stand on it, re-lit by the same two ramps at the level their foot stands in, the head of the lamp lit
    laid = []
    for name, facing, im, ox, oy in sorted(stand, key=lambda s: s[4] + s[2].height):
        a = np.asarray(im).astype(float)
        fx, fy = foot(im)
        k = int(lev[min(H - 1, max(0, oy + fy)), min(W - 1, max(0, ox + fx))])
        kk = np.full(a.shape[:2], max(1, k) if name != 'cook_lamp' else 4)
        # the side of a prop that faces the lamp gets one level more: one light, one direction (rule 114a)
        if name != 'cook_lamp':
            xs = np.arange(a.shape[1])[None, :] + ox
            toward = (xs < cx) if ox + a.shape[1] / 2 > cx else (xs > cx)
            kk = np.where(np.broadcast_to(toward, kk.shape), np.minimum(kk + 1, 4), kk)
        lit = relight(a[..., :3], kk)
        pim = Image.fromarray(np.dstack([lit, a[..., 3]]).astype(np.uint8), 'RGBA')
        canvas.paste(pim, (ox, oy), pim)
        laid.append({'rig': name, 'facing': facing, 'x': ox, 'y': oy, 'w': im.width, 'h': im.height, 'level': k,
                     'sha1': hashlib.sha1(open(os.path.join(RIG, name, 'rig_%s.png' % facing), 'rb').read()).hexdigest()})
    # the lamp's own head is the only thing at full light: its glass is one 4 x 3 block of the ramp's top step
    if props:
        for L in laid:
            if L['rig'] == 'cook_lamp':
                im, _ = prop('cook_lamp', 'SW')
                a = np.asarray(im)[..., 3]
                ys, xs = np.nonzero(a > 8)
                # the lantern hangs off the arm: the lowest inked pixels of the top fifth that are not the pole
                top = ys < ys.min() + (ys.max() - ys.min()) * 0.25
                hx = int(np.percentile(xs[top], 90)); hy = int(ys[top].max())
                arr = np.asarray(canvas).copy()
                for dy in range(-1, 2):
                    for dx in range(-2, 2):
                        X, Y = L['x'] + hx + dx, L['y'] + hy + dy
                        if 0 <= X < W and 0 <= Y < H and a[min(a.shape[0] - 1, hy + dy), min(a.shape[1] - 1, max(0, hx + dx))] > 8:
                            arr[Y, X, :3] = LAMP[4]
                canvas = Image.fromarray(arr, 'RGBA')
    # the band's foot: sixteen ordered steps into the screen's own ground, never a fade (the title's own band)
    arr = np.asarray(canvas).copy()
    foot_h = 32
    yy, xx = np.mgrid[0:foot_h, 0:W]
    keep = (1 - (yy + 0.5) / foot_h) > BAYER[(yy + H - foot_h) % 4, xx % 4]
    sub = arr[H - foot_h:]
    sub[~keep] = BODY + (255,)
    arr[H - foot_h:] = sub
    return Image.fromarray(arr, 'RGBA'), {'view': view, 'w': W, 'h': H, 'lamp': [cx, cy], 'radii': S['radii'],
                                          'tiles': placed, 'props': laid, 'levels': np.bincount(lev.ravel(), minlength=5).tolist()}


def hall(packs, W=390, H=1200):
    """the hall's floor: his cracked slabs as they are laid (no bond; a slab grid is a sidewalk), under a roof, so the
    moon's ramp only and read low (the hall's speaker sits on it: his name in amber must keep 4.5 to 1 in the sun, which
    a lit band under it broke, 2.81, measured on the first lay)"""
    ground, placed = lay(packs, HALL_PACK, HALL_TILES, W, H, 1018, 0, bond=False)
    g = np.asarray(ground).astype(float)
    yy, xx = np.mgrid[0:H, 0:W]
    lev = np.zeros((H, W), int)
    out = relight(g[..., :3], lev, lo=0.3, hi=1.6)
    a = g[..., 3:4]
    out = out * (a / 255.0) + np.asarray(BODY, float) * (1 - a / 255.0)   # the slabs' own gaps stay the screen's ground
    im = Image.fromarray(np.dstack([out, np.full((H, W), 255.0)]).astype(np.uint8), 'RGBA')
    return im, {'view': 'hall', 'w': W, 'h': H, 'tiles': placed, 'levels': np.bincount(lev.ravel(), minlength=5).tolist()}


def shadow_mark():
    """the contact line under a man in the line: a 36 x 5 ellipse of the moon's darkest step, its edge dithered"""
    W, H = 36, 5
    yy, xx = np.mgrid[0:H, 0:W]
    d = np.hypot((xx + 0.5 - W / 2) / (W / 2), (yy + 0.5 - H / 2) / (H / 2))
    on = (1 - d) * 3 > BAYER[yy % 4, xx % 4]
    arr = np.zeros((H, W, 4), np.uint8)
    arr[on] = MOON[0] + (255,)
    return Image.fromarray(arr, 'RGBA')


def hue(c):
    import colorsys
    return round(colorsys.rgb_to_hsv(*(np.asarray(c) / 255.0))[0] * 360)


def main():
    os.makedirs(OUT, exist_ok=True)
    packs = bank()
    man = {'row': '[the line on a ground]', 'lane': 'ui', 'made': '10/18', 'pixel': '1 art px = 1 css px (3 on his phone)',
           'light': 'one: the rig lamp (the moon fills, never lights)', 'moon': MOON, 'lamp': LAMP,
           'moon_hues': [hue(c) for c in MOON], 'lamp_hues': [hue(c) for c in LAMP], 'chroma': CHROMA, 'out': {}}
    for view in ('upright', 'sideways'):
        for tag, props in (('camp', True), ('ground', False)):
            im, m = camp(packs, view, props)
            f = '%s_%s.png' % (tag, view)
            im.save(os.path.join(OUT, f))
            man['out'][f] = m
            print('  wrote %s  %dx%d  levels %s  props %d' % (f, im.width, im.height, m['levels'], len(m['props'])))
    im, m = hall(packs)
    im.save(os.path.join(OUT, 'hall_floor.png'))
    man['out']['hall_floor.png'] = m
    print('  wrote hall_floor.png  %dx%d  levels %s' % (im.width, im.height, m['levels']))
    shadow_mark().save(os.path.join(OUT, 'contact_line.png'))
    # the sheet's last row: his tiles as they are, the same at night (the moon above, the lamp below), the rig's props
    srcs = [tile(packs, CAMP_PACK, i)[0] for i in CAMP_TILES] + [tile(packs, HALL_PACK, i)[0] for i in HALL_TILES]
    row = Image.new('RGBA', (sum(s.width + 6 for s in srcs), 96), (20, 18, 16, 255))
    night = Image.new('RGBA', (row.width, 196), (20, 18, 16, 255))
    x = 0
    for s in srcs:
        row.alpha_composite(s, (x, 96 - s.height))
        a = np.asarray(s).astype(float)
        for k, y in ((0, 0), (4, 100)):
            lit = relight(a[..., :3], np.full(a.shape[:2], k))
            im = Image.fromarray(np.dstack([lit, a[..., 3]]).astype(np.uint8), 'RGBA')
            night.alpha_composite(im, (x, y + 96 - s.height))
        x += s.width + 6
    row.save(os.path.join(OUT, 'src_tiles.png'))
    night.save(os.path.join(OUT, 'src_night.png'))
    ps = [prop(n, f)[0] for n, f in (('cook_lamp', 'SW'), ('round2_truck', 'SE'), ('cook_sandbags', 'SW'), ('cook_tyres', 'SW'))]
    pr = Image.new('RGBA', (sum(p.width + 6 for p in ps), max(p.height for p in ps)), (20, 18, 16, 255))
    x = 0
    for p in ps:
        pr.alpha_composite(p, (x, pr.height - p.height)); x += p.width + 6
    pr.save(os.path.join(OUT, 'src_props.png'))
    json.dump(man, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=1)
    print('  manifest: records/target/ui_line_on_a_ground/manifest.json')


if __name__ == '__main__':
    main()
