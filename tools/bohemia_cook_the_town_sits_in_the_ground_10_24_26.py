#!/usr/bin/env python3
"""BOHEMIA -- COOK [the cities sit in the ground] (10/24/26), NEVER-A-STICKER.
Rule 154 (Paolo 10/24: 'I asked you a long time ago to fix the settlements so they're part of the map instead of a sticker
on top; they still look like that'), folding COOK FOUR's [the place sits in the map] (his 10/10: 'the settlements all look
like dogshit and not organic with the map').

MEASURED FIRST. A settlement on the map is mapBaseDraw (slices/BOHEMIA_CITY_WORLD.html): its tier's district picture
(town, fort, trailer: MAP_TIER_HERO) drawn whole over the painting. Three things made it a sticker, all four of 154(b)'s:
  1. THE SLAB: each picture is the factory's block on its PLATE, a 2:1 diamond of its own ground with a 24 to 30 px dark
     side face at the front (measured on the 1,724 px masters: the plate's front edges run at exactly 0.500 px a px,
     the side face is the first 24 px up from the lowest opaque row, luminance 18 to 65 under ground at 103 to 128);
  2. THE FRAME: the map baked a dark silhouette edge all round the picture ('so it reads as a THING standing on the map
     and not more ground', 10/1), pale on his own;
  3. THE LIFT: a dark ellipse under it (0.5 alpha), pale on his own.
This tool fixes the first, in the picture (COOK's): the slab's side face is cut away and the plate's four edges DISSOLVE
into the map: a ragged band, the outer 14% of the plate, where the ground thins out in scrub- and rubble-sized blobs
(value noise at 18 px and 5 px on the master, about one and a quarter metres and a third of a metre), so what is left at
the edge is the town's own dirt and debris lying on the map's ground; what stands (the walls, the tower) is never cut,
only the ground it stands on thins at its feet. The second and third are RUN's code: one small marked block
(__THE_TOWN_SITS_IN_THE_GROUND__) and a NOTE on RUN's board.

    python3 tools/bohemia_cook_the_town_sits_in_the_ground_10_24_26.py [town fort trailer]
      reads records/target/cook_map_colour/masters/<d>.png (after the render's finish) and the render it was cropped from,
      and writes the MAP'S OWN town picture, slices/map_towns/BOHEMIA_TOWN_IN_GROUND_<d>.png, at 448 px wide (the map draws a
      town at most 74 CSS px, 222 device px): the district TILE in the bank stays whole, a cell edge to edge (the square
      icons gate, Paolo 8/11: 'nothing floats, the tile is its cell'); only the map's town wears the dissolve.

REFERENCE CHECK (the 9/4 standing duty): Battle Brothers' map (9/24): a town is drawn INTO the terrain, its walls and roofs
on the same grass and dirt as the field around it, no plate, no outline; the only thing over the ground is the banner.
Pocket City 2 (9/30): a lot's edge is the road or the next lot, never a cut-out. The real valley from the air: a town's
edge is lots, fences, scrub and rubble, never a line.
REUSE CHECK: the masters the render tool writes; no new picture.
"""
import os, sys, json, hashlib
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MASTERS = os.path.join(R, 'records/target/cook_map_colour/masters')
LEDGER = os.path.join(R, 'records/target/cook_map_colour/ledger.json')
SETTLE = ('town', 'fort', 'trailer')     # MAP_TIER_HERO: fortress -> fort, town -> town, camp -> trailer
FADE = 0.14                              # the outer share of the plate that thins out
OUT_DIR = os.path.join(R, 'slices/map_towns')
MAP_W = 448                              # twice the widest the map ever draws a town (74 CSS px x a 3x phone)


def vnoise(H, W, cell, seed):
    rng = np.random.RandomState(seed)
    gh, gw = H // cell + 2, W // cell + 2
    G = rng.rand(gh, gw)
    y = np.arange(H) / cell; x = np.arange(W) / cell
    y0 = np.floor(y).astype(int); x0 = np.floor(x).astype(int)
    fy = (y - y0)[:, None]; fx = (x - x0)[None, :]
    fy = fy * fy * (3 - 2 * fy); fx = fx * fx * (3 - 2 * fx)
    a = G[y0][:, x0]; b = G[y0][:, x0 + 1]; c = G[y0 + 1][:, x0]; d = G[y0 + 1][:, x0 + 1]
    return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy


def classes(d, W, H):
    """the scene as the render saw it, rasterised from the camera's own numbers: 0 nothing, 1 ground (a face up at the
    plate's grade, the pools and the paving included), 2 what stands, 3 the plate's side face; and the plate's corners"""
    import math
    from PIL import ImageDraw
    sys.path.insert(0, os.path.join(R, 'tools'))
    import bohemia_cook_the_map_in_colour_10_24_26 as MC     # the same recolour (and the same dress) the render used
    MR = MC.MR
    sc = dict({s['district']: s for s in MC.load_scenes()}[d])
    faces, _info = MC.recolour(d, sc); sc['faces'] = faces
    k = MR.CELL_M / MR.plate_units(sc)
    s = sc['scale']; ox, oy = sc['origin']; ppu = s * math.sqrt(2) / k
    e, az = math.radians(30), math.radians(45)
    D = np.array([math.cos(e) * math.cos(az), math.cos(e) * math.sin(az), math.sin(e)])
    f = -D; Rt = np.cross(f, [0, 0, 1.0]); Rt /= np.linalg.norm(Rt); U = np.cross(Rt, f); U /= np.linalg.norm(U)
    def proj(verts):
        P = np.array([[p[1] * k, p[0] * k, p[2] * k * MR.ZC] for p in verts])
        return np.stack([ox + P @ Rt * ppu, oy - P @ U * ppu], 1), float((P @ D).mean())
    gr, sl, st = [], [], []
    for verts, n, m in faces:
        if m is None: continue
        zmax = max(p[2] for p in verts)
        nz = abs(n[2]) if n is not None else 0
        xy, dep = proj(verts)
        zmin = min(p[2] for p in verts)
        if zmax <= 0.2 and zmin < -0.1: sl.append((dep, xy))   # the plate's side face, down to -0.5
        elif zmax <= 0.2: gr.append(xy)                       # the plate at 0.05, a lot or a pool at 0.06 to 0.12, and their lips
        else: st.append((dep, xy))
    img = Image.new('L', (sc['w'], sc['h']), 0); dr = ImageDraw.Draw(img)
    for xy in gr: dr.polygon([tuple(p) for p in xy], fill=1)
    for _d, xy in sorted(sl, key=lambda t: t[0]): dr.polygon([tuple(p) for p in xy], fill=3)
    for _d, xy in sorted(st, key=lambda t: t[0]): dr.polygon([tuple(p) for p in xy], fill=2)
    # the plate: the ground's own extent at grade, its four corners on the glass
    xs = [p[0] for xy in [v for v, n, m in faces if m is not None and max(q[2] for q in v) <= 0.15] for p in xy]
    ys = [p[1] for xy in [v for v, n, m in faces if m is not None and max(q[2] for q in v) <= 0.15] for p in xy]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    C, _ = proj([(x0, y0, 0), (x1, y0, 0), (x1, y1, 0), (x0, y1, 0)])
    return np.asarray(img), C, sc


def register(render_alpha, master_alpha, bbox):
    """the crop finish() took (it moves the factory's box up to 4 px to lay the new picture on the old one's pixels)"""
    bh, bw = master_alpha.shape; best = None
    for dy in range(-5, 6):
        for dx in range(-5, 6):
            x0, y0 = bbox[0] + dx, bbox[1] + dy
            if x0 < 0 or y0 < 0 or x0 + bw > render_alpha.shape[1] or y0 + bh > render_alpha.shape[0]: continue
            w = render_alpha[y0:y0 + bh, x0:x0 + bw]
            q = (w == master_alpha).mean()
            if best is None or q > best[0]: best = (q, x0, y0)
    return best


def dissolve(d, seed):
    fn = os.path.join(MASTERS, d + '.png'); rn = os.path.join(os.path.dirname(MASTERS), 'render', d + '.png')
    a = np.asarray(Image.open(fn).convert('RGBA')).astype(float)
    ra = np.asarray(Image.open(rn).convert('RGBA'))[..., 3]
    H, W = a.shape[:2]
    cls, C, sc = classes(d, *ra.shape[::-1])
    q, X0, Y0 = register(ra, a[..., 3].astype(np.uint8), sc['bbox'])
    cl = cls[Y0:Y0 + H, X0:X0 + W]
    C = C - [X0, Y0]
    # the plate in its own two directions: P = B + u (L - B) + v (R - B), B its corner nearest the camera (lowest on the glass)
    bi = int(np.argmax(C[:, 1])); B = C[bi]; Lc = C[(bi + 1) % 4]; Rc = C[(bi - 1) % 4]
    if Lc[0] > Rc[0]: Lc, Rc = Rc, Lc
    M = np.array([[Lc[0] - B[0], Rc[0] - B[0]], [Lc[1] - B[1], Rc[1] - B[1]]]); Mi = np.linalg.inv(M)
    Y, X = np.mgrid[0:H, 0:W].astype(float)
    u = Mi[0, 0] * (X - B[0]) + Mi[0, 1] * (Y - B[1]); v = Mi[1, 0] * (X - B[0]) + Mi[1, 1] * (Y - B[1])
    e = np.minimum(np.minimum(u, v), np.minimum(1 - u, 1 - v))
    n = 0.62 * vnoise(H, W, 18, seed) + 0.38 * vnoise(H, W, 5, seed + 1)
    keep = np.clip((e / FADE - 0.5) * 1.6 + (n - 0.5) * 1.9 + 0.5, 0, 1)
    keep = np.where(keep > 0.5, 1.0, 0.0)                    # in or out: the bank indexes a master with one clear entry
                                                             # (any ink is ink, tools/bohemia_cook_master_to_palette.py), and the
                                                             # map's own downsample softens the ragged line at the glass
    flat = (cl == 1) | (cl == 3)
    k = np.where(cl == 2, 1.0, np.where(flat & (e < 0), 0.0, np.where(flat, keep, 1.0)))
    k = np.where((cl == 0) & (a[..., 3] > 0), np.where(e < 0.02, 0.0, 1.0), k)   # a fringe pixel the raster missed
    a[..., 3] = a[..., 3] * k
    out = Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA')
    info = dict(register=round(float(q), 4), crop=[int(X0), int(Y0)], fade=FADE,
                ground=round(float((cl == 1).mean()), 4), stands=round(float((cl == 2).mean()), 4), slab=round(float((cl == 3).mean()), 4),
                kept=round(float((a[..., 3] > 0).sum()) / max(1, (np.asarray(Image.open(fn))[..., 3] > 0).sum()), 4))
    return out, info


def ledger_put(d, row):
    import fcntl
    with open(LEDGER + '.lock', 'w') as lk:
        fcntl.flock(lk, fcntl.LOCK_EX)
        L = json.load(open(LEDGER)) if os.path.exists(LEDGER) else {}
        L.setdefault(d, {}).update(row)
        json.dump(L, open(LEDGER, 'w'), indent=1, sort_keys=True)


def main():
    names = sys.argv[1:] or list(SETTLE)
    os.makedirs(OUT_DIR, exist_ok=True)
    for d in names:
        out, info = dissolve(d, sum(map(ord, d)) * 13 + 5)
        w = MAP_W; h = int(round(out.height * w / out.width))
        small = out.resize((w, h), Image.LANCZOS)
        fn = os.path.join(OUT_DIR, 'BOHEMIA_TOWN_IN_GROUND_%s.png' % d)
        small.save(fn, optimize=True)
        info.update(map_picture=os.path.relpath(fn, R), size=[w, h], bytes=os.path.getsize(fn))
        ledger_put(d, {'sits_in_the_ground': info})
        print('  %-8s %s' % (d, json.dumps(info)))


if __name__ == '__main__':
    main()
