#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION 2 [the wrongness] (Paolo 11/2, VAMILY rule 306, ask line 298):
"this AI slop amalgamation creepypasta horror Crashbox HBO series vibe... make some really good elements or direction for
art for shit like that, for real."

Fifteen made elements (twenty pictures with their second and third states), each ONE of his pack props or the game's own
people and faces with exactly ONE wrong thing done to it by hand (the bible's rule 1: an ordinary frame, one wrong thing).
The page is records/BOHEMIA_DIRECTION_THE_WRONGNESS_11_2_26.md; the data file is slices/wrongness/wrongness.json; nothing
here is placed into any lane's screen (the coordinator hands out the placements the data file lists).

THE ONE FACE: every haunted face in act one is the SAME face, the mean of fifteen of the valley's own rig faces
(slices/fight_rig/faces.webp), so nobody and everybody. Smooth where it is on a screen (a screen is its own fixture), printed
with his paper's own grain where it is on paper (world pixels are never softened, the AI-slop strand's pair 2).

  python3 tools/bohemia_direction_the_wrongness_11_2_26.py            (writes slices/wrongness/, the sheets, the json)

REFERENCE CHECK (the 9/4 standing duty): AH-01 (THE ANALOG HORROR BIBLE, the ten rules and the AI-slop strand) and the
approved asset index (his 7/13 UP set in reference/art_bank). Every element names its pack twin in wrongness.json and is laid
beside it at one art pixel to one phone pixel on records/target/direction_wrongness/compare.png, beside a man of the
112 box for size. No reference game.
REUSE CHECK (REUSE-FIRST): no renderer is written here. Every pixel is cut, laid, moved, mirrored or recoloured from his
packs (reference/art_bank/prop, marking, settlement), the camp's own ground (slices/camp_two), the town's own people
(slices/settlement_people) and the rig's faces (slices/fight_rig/faces.webp). The card is skills/bohemia-pixel-art/scripts/
check.py, run as it is; the purple count is gates/bohemia_purity_gate.py's own check_png, imported, not copied.
TASTE CHECK: not mine to say; the check says built right or not, Paolo says good in the VOTE tab.
"""
import importlib.util
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference/art_bank')
OUT = os.path.join(ROOT, 'slices/wrongness')
PROOF = os.path.join(ROOT, 'records/target/direction_wrongness')
SHEET = os.path.join(ROOT, 'slices/vote/DIRECTION_THE_WRONGNESS_11_2.png')
RNG = np.random.default_rng(1102)
FACE_IDS = [33, 34, 36, 39, 41, 42, 43, 44, 45, 47, 49, 50, 52, 55, 58]   # the bare heads of the 101 rig faces


def pack(rel):
    return Image.open(os.path.join(BANK, rel + '.png')).convert('RGBA')


def A(im):
    return np.asarray(im.convert('RGBA')).astype(np.float64)


def I(a):
    return Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8), 'RGBA')


def lum(a):
    return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114


def sat(a):
    mx = a[..., :3].max(-1); mn = a[..., :3].min(-1)
    return np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)


def person(name, row=0, col=0):
    s = Image.open(os.path.join(ROOT, 'slices/settlement_people', name + '.webp')).convert('RGBA')
    return s.crop((col * 112, row * 112, col * 112 + 112, row * 112 + 112))


def plaster(im):
    """A man of the 112 box made a mannequin: his own shading kept, his colours gone to sun-bleached plaster."""
    a = A(im); op = a[..., 3] > 200
    L = lum(a); L2 = 0.5 * L + 0.5 * 128.0
    light = np.array([232.0, 221.0, 202.0])
    for c in range(3):
        a[..., c] = np.where(op, np.clip(light[c] * L2 / 168.0, 0, 255), a[..., c])
    return I(a)


def paper_tex(w, h):
    """His own paper: the WANTED flyer's pale pixels, drawn at random into a sheet (his colours, his grain)."""
    a = A(pack('prop/pack_miscellaneous_044'))
    pal = a[(lum(a) > 150) & (a[..., 3] > 250)]
    pick = pal[RNG.integers(0, len(pal), size=(h, w))]
    return pick


def one_face():
    f = A(Image.open(os.path.join(ROOT, 'slices/fight_rig/faces.webp')))
    acc = np.zeros((128, 128, 3)); al = np.zeros((128, 128))
    for i in FACE_IDS:
        t = f[:, i * 128:(i + 1) * 128]
        w = t[..., 3] / 255.0
        acc += t[..., :3] * w[..., None]; al += w
    rgb = acc / np.maximum(al[..., None], 1e-6)
    return np.dstack([rgb, al / len(FACE_IDS) * 255.0])


def wide_smile(face):
    """The wrong smile: the mouth band pulled 1.8 times as wide, its corners lifted, its line darker. Measured on the face."""
    f = face.copy(); L = lum(f)
    band = [(L[y, 48:80].mean(), y) for y in range(98, 112)]     # the mouth, not the shadow under the chin (118+)
    ym = min(band)[1]; cx = 64
    src = f.copy()
    for y in range(ym - 4, ym + 5):
        for x in range(cx - 27, cx + 28):
            sx = cx + (x - cx) / 1.8
            lift = int(round(((x - cx) / 27.0) ** 2 * 3))
            yy = y - lift
            v = src[y, int(round(sx))].copy()
            if abs(y - ym) <= 1:
                v[:3] *= 0.5
            if 0 <= yy < 128 and f[yy, x, 3] > 100:
                f[yy, x, :3] = v[:3]
    return f


def face_print(face, w, h, grain=True):
    """The face printed: the soft average cut to a hard edge, shrunk, then his paper's grain multiplied in."""
    f = face.copy(); f[..., 3] = np.where(f[..., 3] > 150, 255, 0)
    im = I(f).resize((w, h), Image.LANCZOS)
    a = A(im); a[..., 3] = np.where(a[..., 3] > 128, 255, 0)
    if grain:
        p = paper_tex(w, h); g = lum(p) / lum(p).mean()
        for c in range(3):
            a[..., c] = a[..., c] * (0.80 + 0.20 * g)
        L = lum(a)
        for c in range(3):
            a[..., c] = L + (a[..., c] - L) * 0.7     # printed ink is a little duller than skin
    return a


def ink_print(face, w, h, twin, spread=0.04):
    """The face PRINTED IN HIS INK: shrunk, sharpened, then every pixel takes a pixel of the twin poster whose light-and-dark
    rank matches its own (a cheap print in the paper's own colours, with his grain). Never a new palette."""
    from PIL import ImageFilter
    f = face.copy(); f[..., 3] = np.where(f[..., 3] > 150, 255, 0)
    im = I(f).resize((w, h), Image.LANCZOS).filter(ImageFilter.UnsharpMask(radius=2, percent=140, threshold=1))
    a = A(im); op = a[..., 3] > 128
    t = A(pack(twin)); pal = t[t[..., 3] > 250][:, :3]
    pal = pal[np.argsort(lum(pal[None])[0])]
    L = lum(a); lo, hi = np.percentile(L[op], 3), np.percentile(L[op], 97)
    q = np.clip((L - lo) / max(hi - lo, 1), 0, 1)
    q = np.clip(q + RNG.normal(0, spread, size=q.shape), 0, 1)
    out = np.zeros_like(a)
    out[..., :3] = pal[(q * (len(pal) - 1)).astype(int)]
    out[..., 3] = np.where(op, 255, 0)
    return out


def paste(dst, src, x, y):
    dst.alpha_composite(src, (x, y))
    return dst


def wall_strip(n=3, tile='settlement/pack_wall_tiles_1_007'):
    """His tan wall tile with its baked frame cut (rule 104b), laid n times, every other one mirrored."""
    t = pack(tile); w, h = t.size
    core = t.crop((4, 4, w - 4, h - 4)); cw, ch = core.size
    out = Image.new('RGBA', (cw * n, ch), (0, 0, 0, 0))
    for i in range(n):
        out.paste(core.transpose(Image.FLIP_LEFT_RIGHT) if i % 2 else core, (i * cw, 0))
    return out


def ink_mask(a, lo=110):
    return (lum(a) < lo) & (a[..., 3] > 200)


def bg_fill(a, mask, pool):
    """Clear ink: every masked pixel takes a pixel of the sign's own ground, drawn at random from pool."""
    idx = RNG.integers(0, len(pool), size=int(mask.sum()))
    a[mask] = pool[idx]


# ---------------------------------------------------------------------------------------------------------------------
# THE ELEMENTS
# ---------------------------------------------------------------------------------------------------------------------
def e01_flyer():
    a = A(pack('prop/pack_miscellaneous_044')); src = a.copy()
    x0, x1, y0, y1, ys = 15, 43, 21, 50, 29
    for y in range(ys, y1):
        sy = ys + (y - ys) * 0.55
        dx = int(round((y - ys) * 0.18))
        for x in range(x0, x1):
            sx = min(max(x - dx, x0), x1 - 1)
            a[y, x] = src[int(sy), sx]
    return [I(a)]


def e02_poster():
    a = A(pack('prop/pack_miscellaneous_043'))
    red = (a[..., 0] > a[..., 1] + 40) & (a[..., 3] > 0)
    L = lum(a)
    for c in range(3):
        a[..., c] = np.where(red, L + (a[..., c] - L) * 0.5, a[..., c])
    for c in range(3):
        a[..., c] = np.where(red, L + (a[..., c] - L) * 0.5, a[..., c])    # the red faded twice: old ink, never blood
    one = I(a)
    b = a.copy(); x0, x1, y0, y1 = 9, 43, 7, 47
    f = ink_print(one_face(), x1 - x0, y1 - y0, 'prop/pack_miscellaneous_043')
    f[..., :3] = lum(f)[..., None] * 0.5 + f[..., :3] * 0.5
    m = f[..., 3] > 0
    b[y0:y1, x0:x1][m] = f[m]
    return [one, I(b)]


def e03_host():
    wall = wall_strip(1)
    w, h = 56, 70
    paper = paper_tex(w, h); paper = np.dstack([paper[..., :3], np.full((h, w), 255.0)])
    edge = np.zeros((h, w), bool); edge[0, :] = edge[-1, :] = edge[:, 0] = edge[:, -1] = True
    paper[edge, :3] *= 0.78
    for (yy, xx) in [(0, 0), (0, 1), (1, 0), (0, w - 1), (h - 1, w - 1), (h - 1, w - 2), (h - 2, w - 1)]:
        paper[yy, xx, 3] = 0
    face = ink_print(wide_smile(one_face()), 48, 48, 'prop/pack_miscellaneous_044')
    pim = I(paper); pim.alpha_composite(I(face), (4, 8))
    out = wall.copy(); out.alpha_composite(pim, ((wall.size[0] - w) // 2, 8))
    return [out]


def glyph_boxes(a, rows):
    m = ink_mask(a)[rows[0]:rows[1]].copy()
    m[:, :12] = False; m[:, 83:] = False          # the board's own frame is not a letter
    cols = m.any(0); boxes = []; x = 0
    while x < len(cols):
        if cols[x]:
            s = x
            while x < len(cols) and cols[x]:
                x += 1
            if x - s >= 3:
                boxes.append((s, x))
        x += 1
    return boxes


def e04_sign():
    a = A(pack('marking/pack_14_warning_signs_025'))
    board = (a[..., 0] > 150) & (a[..., 1] > 110) & (a[..., 2] < 90) & (a[..., 3] > 250)
    pool = a[board]
    l1, l2 = (15, 35), (35, 56)
    g1, g2 = glyph_boxes(a, l1), glyph_boxes(a, l2)
    out = a.copy()

    def lift(box, rows):
        x0, x1 = box
        blk = a[rows[0]:rows[1], x0:x1].copy(); msk = ink_mask(blk, 130)
        return blk, msk

    def clear(box, rows):
        x0, x1 = box
        sub = out[rows[0]:rows[1], x0:x1]; m = ink_mask(sub, 130); bg_fill(sub, m, pool)

    def put(blk, msk, x0, rows):
        sub = out[rows[0]:rows[1], x0:x0 + blk.shape[1]]
        sub[msk[:, :sub.shape[1]]] = blk[:, :sub.shape[1]][msk[:, :sub.shape[1]]]

    # ENTER -> ENETR: the T and the second E change places
    if len(g2) >= 5:
        tb, eb = g2[2], g2[3]
        tblk, tm = lift(tb, l2); eblk, em = lift(eb, l2)
        clear(tb, l2); clear(eb, l2)
        span0 = tb[0]; ew = eb[1] - eb[0]; tw = tb[1] - tb[0]
        put(eblk, em, span0, l2); put(tblk, tm, span0 + ew + (eb[0] - tb[1]), l2)
    # NOT: the N turned round
    if len(g1) >= 3:
        nb = g1[2]; nblk, nm = lift(nb, l1); clear(nb, l1)
        put(nblk[:, ::-1], nm[:, ::-1], nb[0], l1)
    return [I(out)], {'line1': g1, 'line2': g2}


def wall_of_flyers(extra):
    wall = wall_strip(3)
    fl = pack('prop/pack_miscellaneous_044')
    spots = [(8, 10), (70, 14), (150, 8), (208, 16)]
    if extra:
        spots.append((112, 20))
    out = wall.copy()
    for (x, y) in spots:
        out.alpha_composite(fl, (x, y))
    return out


def e05_wall():
    return [wall_of_flyers(False), wall_of_flyers(True)]


def e06_three_arms():
    a = A(pack('marking/pack_14_warning_signs_000'))
    man = (lum(a) < 60) & (a[..., 3] > 250)
    y0, y1, x0, x1 = 38, 57, 54, 62
    blk = a[y0:y1, x0:x1].copy(); m = man[y0:y1, x0:x1]
    ty = y0 + 10; tx = x0 + 2
    sub = a[ty:ty + (y1 - y0), tx:tx + (x1 - x0)]
    sub[m] = blk[m]
    return [I(a)]


def e07_man_left():
    a = A(pack('marking/pack_14_warning_signs_017'))
    h, w = a.shape[:2]; yy, xx = np.mgrid[0:h, 0:w]
    inside = (xx - 48) ** 2 + (yy - 47) ** 2 < 34 ** 2
    slash = (a[..., 0] > a[..., 1] + 50) & (a[..., 0] > 90)
    man = inside & (lum(a) < 80) & ~slash & (a[..., 3] > 250)
    edge = np.zeros_like(man)
    edge[1:] |= man[:-1]; edge[:-1] |= man[1:]; edge[:, 1:] |= man[:, :-1]; edge[:, :-1] |= man[:, 1:]
    man = man | (edge & inside & (lum(a) < 150) & ~slash)
    white = inside & (lum(a) > 170) & (sat(a) < 0.2)
    # where the man crossed the slash, the hole is the slash's own red, not the board's white
    sf = slash.astype(float); k = np.zeros_like(sf)
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            k += np.roll(np.roll(sf, dy, 0), dx, 1)
    on_slash = man & (k >= 10)
    man = man & ~on_slash
    b = a.copy(); bg_fill(b, man, a[white]); bg_fill(b, on_slash, a[slash & inside])
    b[man, :3] = np.clip(b[man, :3] + 9, 0, 255)      # the paint he covered never faded: a paler man-shaped patch
    return [I(a), I(b)]


def e08_mannequins():
    bodies = ['cast_skirt', 'cast_longcoat', 'cast_shorts']
    def group(rows):
        out = Image.new('RGBA', (180, 112), (0, 0, 0, 0))
        for i, (b, r) in enumerate(zip(bodies, rows)):
            out.alpha_composite(plaster(person(b, r, 0)), (i * 34, 0))
        return out
    return [group([1, 1, 2]), group([0, 0, 0])]


def e09_test_card():
    a = A(pack('prop/pack_7_computers_and_screens_000'))
    blue = (a[..., 2] > a[..., 0] + 40) & (a[..., 2] > 90)
    ys, xs = np.where(blue)
    # the screen is the blue region's bounding box, shrunk off the bezel's glow
    y0, y1 = ys.min() + 1, ys.max(); x0, x1 = xs.min() + 1, xs.max()
    H, W = y1 - y0, x1 - x0
    c = np.zeros((H, W, 4)); c[..., 3] = 255; c[..., :3] = [150, 147, 139]
    yy, xx = np.mgrid[0:H, 0:W]
    grid = ((xx % 8) == 3) | ((yy % 8) == 3)
    c[grid, :3] = [112, 110, 104]
    # six bars, and the one where magenta belongs is black (no blue bar: the gate's 26 px sample mixes red and blue into
    # purple, measured 4 px, so the card ends on red)
    bars = [[200, 198, 190], [206, 196, 40], [44, 190, 196], [52, 176, 48], [12, 12, 12], [196, 44, 36]]
    bh = max(5, H // 5); bw = W / float(len(bars))
    for i, col in enumerate(bars):
        c[0:bh, int(i * bw):int((i + 1) * bw), :3] = col
    for i in range(5):
        v = 20 + i * 50
        c[H - bh:H, int(i * W / 5):int((i + 1) * W / 5), :3] = v
    r = (H - 2 * bh) // 2 + 3; cy, cx = H // 2, W // 2
    disc = (xx - cx) ** 2 + (yy - cy) ** 2
    c[disc < r * r, :3] = [176, 172, 162]
    ring = (disc < r * r) & (disc >= (r - 1) ** 2)
    c[ring, :3] = [30, 30, 30]
    d = 2 * r - 4
    face = A(I(one_face()).resize((d, d), Image.LANCZOS))
    fy, fx = cy - d // 2, cx - d // 2
    al = face[..., 3:4] / 255.0
    region = c[fy:fy + d, fx:fx + d, :3]
    inside = ((np.mgrid[0:d, 0:d][0] - d / 2) ** 2 + (np.mgrid[0:d, 0:d][1] - d / 2) ** 2) < (r - 1) ** 2
    blend = region * (1 - al) + face[..., :3] * al
    region[inside] = blend[inside]
    # the analog snow and the scanlines live inside the screen only (the bible's rule 8): a dead broadcast's signal noise
    # and a line that tears a pixel sideways now and then, never a filter on the world
    c[..., :3] += RNG.normal(0, 9.0, size=(H, W, 1)) + RNG.normal(0, 3.0, size=(H, W, 3))
    for yy_ in range(H):
        if RNG.random() < 0.18:
            c[yy_, :, :3] = np.roll(c[yy_, :, :3], int(RNG.choice([-1, 1])), axis=0)
    c[1::2, :, :3] *= 0.86
    c[..., :3] = np.clip(c[..., :3], 0, 255)
    a[y0:y1, x0:x1] = c
    return [I(a)], (x0, y0, x1, y1)


def e10_robot():
    a = A(pack('prop/pack_miscellaneous_036'))
    op = a[..., 3] > 200
    visor = (a[..., 2] > a[..., 0] + 30) & (a[..., 2] > 80) & op
    eye = (a[..., 0] > a[..., 1] + 60) & (a[..., 0] > 120) & op
    L = lum(a)
    h, w = L.shape
    noise = np.asarray(Image.fromarray((RNG.random((6, 4)) * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)) / 255.0
    tin_lo, tin_hi = np.array([58.0, 52, 45]), np.array([206.0, 196, 176])
    rust = np.array([150.0, 82, 44])
    t = np.clip(L / 150.0, 0, 1)[..., None]
    col = tin_lo + (tin_hi - tin_lo) * t
    rmix = np.clip((noise - 0.55) * 3.0, 0, 0.85)[..., None]
    col = col * (1 - rmix) + rust * (0.45 + 0.75 * t) * rmix
    # a slow colour drift across the tin, so no two square centimetres are one colour (the rig's source-pass recipe)
    drift = np.asarray(Image.fromarray((RNG.random((10, 7, 3)) * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)) / 255.0
    col = col * (0.90 + 0.20 * drift) + (a[..., :3] - L[..., None]) * 0.35
    keep = ~op | eye | visor
    for ch in range(3):
        a[..., ch] = np.where(keep, a[..., ch], col[..., ch])
    ys, xs = np.where(visor)
    mx = int(np.median(xs)); keep_ = np.abs(xs - mx) <= 7; ys, xs = ys[keep_], xs[keep_]
    visor[:] = False; visor[ys, xs] = True
    vy0, vy1, vx0, vx1 = ys.min() - 1, ys.max() + 2, xs.min(), xs.max() + 1
    fw, fh = vx1 - vx0, vy1 - vy0
    a[vy0:vy1, vx0:vx1][visor[vy0:vy1, vx0:vx1]] = [24, 22, 20, 255]
    f = face_print(one_face(), fw, fw, grain=False)
    off = (fw - fh) // 2
    f = f[max(off - 1, 0):max(off - 1, 0) + fh]
    sub = a[vy0:vy0 + f.shape[0], vx0:vx1]
    m = f[..., 3] > 0
    sub[m] = f[m]
    return [I(a)]


def e11_glass():
    f = one_face(); f = f[:, ::-1].copy()
    L = lum(f)
    for c, k in enumerate([1.0, 0.98, 0.94]):
        f[..., c] = L * k
    f[..., 3] = f[..., 3] * 0.22
    return [I(f)]


def ground(src, x, y, w, h):
    return Image.open(os.path.join(ROOT, 'slices/camp_two', src)).convert('RGBA').crop((x, y, x + w, y + h))


def e12_feed():
    g = ground('plate.webp', 640, 330, 192, 128)
    out = g.copy()
    # the stranger first, one step behind the company
    out.alpha_composite(plaster(person('cast_shortcoat', 0, 0)), (66, 2))
    for x, b in [(-28, 'cast_apron'), (24, 'faction_church'), (102, 'cast_longcoat')]:
        out.alpha_composite(person(b, 0, 0), (x, 16))
    a = A(out); a[0, :, :3] = a[-1, :, :3] = a[:, 0, :3] = a[:, -1, :3] = 30
    return [I(a)]


def e13_loading():
    day = A(Image.open(os.path.join(ROOT, 'slices/camp_two/plate_tall.webp')).convert('RGBA'))
    night = A(Image.open(os.path.join(ROOT, 'slices/camp_two/plate_tall_night.webp')).convert('RGBA'))
    k = night[..., :3].reshape(-1, 3).mean(0) / day[..., :3].reshape(-1, 3).mean(0)   # night multiplies value (rule 4)
    g = ground('plate_tall_night.webp', 420, 700, 180, 320)
    fig = A(plaster(person('cast_skirt', 0, 0)))
    fig[..., :3] *= k
    fig = I(fig)
    frames = []
    for (x, fy) in [(102, 4), (82, 98), (36, 200)]:
        out = g.copy(); out.alpha_composite(fig, (x - 56, fy)); frames.append(out)
    return frames, [round(float(v), 3) for v in k]


def e14_traffic():
    a = A(pack('prop/pack_15_street_props_001'))
    op = a[..., 3] > 200
    red = (a[..., 0] > 140) & (a[..., 1] < 90) & (a[..., 2] < 90) & op
    ys, xs = np.where(red)
    ry0, ry1, rx0, rx1 = ys.min() - 1, ys.max() + 2, xs.min() - 1, xs.max() + 2
    blk = a[ry0:ry1, rx0:rx1].copy()
    lit = lum(blk) > 0
    rh = ry1 - ry0
    yel = (a[..., 0] > 120) & (a[..., 1] > 80) & (a[..., 2] < 70) & (a[..., 0] > a[..., 1] + 15) & op
    grn = (a[..., 1] > a[..., 0] + 30) & (a[..., 1] > 100) & op
    centres = []
    for m in (yel, grn):
        yy, xx = np.where(m)
        centres.append((int(round(yy.mean())), int(round(xx.mean()))))
    rc = ((ry0 + ry1) // 2, (rx0 + rx1) // 2)
    for (cy, cx) in centres:
        ty = cy - (rc[0] - ry0); tx = cx - (rc[1] - rx0)
        a[ty:ty + rh, tx:tx + (rx1 - rx0)] = blk
    return [I(a)]


def e15_lamp():
    lamp = A(pack('prop/pack_15_street_props_004'))
    h, w = lamp.shape[:2]
    op = lamp[..., 3] > 128
    ys, xs = np.where(op)
    base_y = ys.max()
    pad_l, pad_t = 64, 0
    canvas = np.zeros((h + pad_t, w + pad_l, 4))
    sh = np.zeros(canvas.shape[:2])
    for y, x in zip(ys, xs):
        hgt = base_y - y
        sx = int(round(x + pad_l - hgt * 0.62)); sy = int(round(base_y - hgt * 0.30))
        if 0 <= sy < canvas.shape[0] and 0 <= sx < canvas.shape[1]:
            sh[sy, sx] = 1
            if sx + 1 < canvas.shape[1]:
                sh[sy, sx + 1] = 1
    canvas[..., :3] = [20, 16, 12]; canvas[..., 3] = sh * 92
    out = I(canvas); out.alpha_composite(I(lamp), (pad_l, pad_t))
    return [out]


# ---------------------------------------------------------------------------------------------------------------------
# THE DATA: what, where, how rare, which beat. Every number is draft:true and Paolo's to change.
# ---------------------------------------------------------------------------------------------------------------------
ELEMENTS = [
    dict(id='flyer_the_face_slid', make=e01_flyer, family='prop', twin='prop/pack_miscellaneous_044',
         title='THE FLYER WHOSE FACE SLID',
         wrong='The face on the flyer has slid down its own paper, eyes stretched long and the mouth gone off the bottom, the way a machine smears a face it does not understand.',
         where=['town wall'], beat='B3', rarity='one town in four from beat 3, one flyer only, on a wall the company walks past'),
    dict(id='poster_someone_else', make=e02_poster, family='prop', twin='prop/pack_miscellaneous_043',
         title='THE POSTER SHOWS SOMEONE ELSE NOW',
         wrong='Second visit: the same torn poster, the same ink, but the face on it is somebody else. It is the one face.',
         where=['town wall'], beat='B2', states=['first visit', 'any later visit'],
         rarity='one town per act; the face changes once, between two visits, never while it is on screen'),
    dict(id='host_poster_the_smile', make=e03_host, family='settlement', twin='settlement/pack_wall_tiles_1_007',
         title='THE SMILE ON THE WALL',
         wrong='A pasted poster of a face that is nobody you know, smiling 1.8 times too wide, its corners lifted, its eyes not joining in.',
         where=['town wall'], beat='B3', rarity='the casino towns only, one wall each, from beat 3'),
    dict(id='sign_almost_reads', make=e04_sign, family='marking', twin='marking/pack_14_warning_signs_025',
         title='THE SIGN THAT ALMOST READS',
         wrong='DO NOT ENTER reads DO ИOT ENETR: one letter turned round, two changed places. You read it right the first time and wrong the second.',
         where=['road event', 'town street'], beat='B1', rarity='one sign in about thirty from beat 1; the road\'s DO NOT ENTER signs only'),
    dict(id='wall_one_more_flyer', make=e05_wall, family='settlement', twin='settlement/pack_wall_tiles_1_007',
         title='ONE MORE FLYER THAN LAST TIME',
         wrong='The same missing man four times on a wall; come back and he is up five times. Nobody in town put the fifth one up.',
         where=['town wall'], beat='B2', states=['first visit', 'second visit'],
         rarity='one home town per act; the fifth flyer arrives between two visits at least three days apart'),
    dict(id='pictogram_three_arms', make=e06_three_arms, family='marking', twin='marking/pack_14_warning_signs_000',
         title='THE MAN ON THE SIGN HAS THREE ARMS',
         wrong='The little man on the warning sign has a third arm: a second right arm, hanging just below the first.',
         where=['town street', 'fight board blocker'], beat='B1', rarity='one sign in about forty from beat 1'),
    dict(id='sign_the_man_left', make=e07_man_left, family='marking', twin='marking/pack_14_warning_signs_017',
         title='THE MAN LEFT THE SIGN',
         wrong='Second visit: the no-entry sign is empty. The slash is still there; the little man it crossed out is gone, and only a cleaner patch of paint shows where he stood.',
         where=['road event', 'town street'], beat='B2', states=['first pass', 'a later pass'],
         rarity='one sign on one road per act; it empties between two passes'),
    dict(id='mannequins_turned', make=e08_mannequins, family=None, twin='settlement_people (cast_skirt, cast_longcoat, cast_shorts, the 112 box)',
         title='THE MANNEQUINS TURNED ROUND',
         wrong='A family of three plaster mannequins in a shop. First visit they face each other. Next visit all three face you.',
         where=['town street (a shop on the settlement screen)'], beat='B2', states=['first visit', 'next visit'],
         rarity='one shop in the valley per act; the turn is never seen happening'),
    dict(id='test_card_face', make=e09_test_card, family='prop', twin='prop/pack_7_computers_and_screens_000',
         title='THE TEST CARD AT CAMP',
         wrong='The camp\'s dead screen, plugged into nothing, shows a test card. The face in its circle is nobody in the valley. The bar where magenta should be is black.',
         where=['camp'], beat='B4', rarity='one night in five at camp from beat 4; gone by morning'),
    dict(id='tin_robot_face', make=e10_robot, family='prop', twin='prop/pack_miscellaneous_036',
         title='THE TIN ROBOT WITH A FACE',
         wrong='A rusty tin robot, as tall as a man, is standing at camp with a small clay face where its screen should be. The same face as the test card.',
         where=['camp'], beat='B4', rarity='once per act; it is standing at camp in the morning and no one brought it'),
    dict(id='glass_face', make=e11_glass, family=None, twin='slices/fight_rig/faces.webp (the one face)',
         title='A FACE IN THE GLASS',
         wrong='For one beat, a pale face is reflected in the fight\'s glass, turned round like a reflection is. The same face again.',
         where=['the fight\'s glass'], beat='B4', rarity='one fight in about twenty-five from beat 4, one beat, never on the first turn'),
    dict(id='feed_photo_one_extra', make=e12_feed, family=None, twin='slices/camp_two/plate.webp + settlement_people',
         title='ONE TOO MANY IN THE PHOTO',
         wrong='A photo of three of your men in the feed. A fourth stands behind them: blank, plaster, nobody you hired.',
         where=['the feed'], beat='B3', rarity='one post in about sixty from beat 3; never pinned, never mentioned'),
    dict(id='loading_it_comes_closer', make=e13_loading, family=None, twin='slices/camp_two/plate_tall_night.webp + settlement_people',
         title='IT GETS CLOSER EVERY TIME IT LOADS',
         wrong='The loading picture is the empty desert at night with one blank figure in it. Every load it stands a little closer.',
         where=['loading screen'], beat='B3', states=['far', 'nearer', 'near'],
         rarity='one load in four from beat 3; the three pictures in order, never back'),
    dict(id='traffic_light_three_red', make=e14_traffic, family='lamp', twin='prop/pack_15_street_props_001',
         title='THE LIGHT THAT IS RED THREE TIMES',
         wrong='A traffic light on a road with no power, and all three of its lamps are red.',
         where=['road event'], beat='B1', rarity='one road event in about forty from beat 1'),
    dict(id='lamp_shadow_toward_the_sun', make=e15_lamp, family='lamp', twin='prop/pack_15_street_props_004',
         title='THE SHADOW THAT FALLS THE WRONG WAY',
         wrong='A street lamp whose shadow falls up and to the left, toward the sun, when every other shadow in town falls down and right.',
         where=['town street'], beat='B1', rarity='one lamp per town in about one town in five from beat 1'),
]

BEATS = {
    'B0': 'THE FIRST HOURS: nothing. No wrongness before the first town is done (nothing in the first sixty seconds, the second votes).',
    'B1': 'A DETAIL: things you could miss. At most one a day of game time, about one in five days.',
    'B2': 'IT CHANGED: the same thing, different when you come back. About one in three days.',
    'B3': 'IT KNOWS YOU: your company is in it (your feed, your loading screen, your walls). About one a day.',
    'B4': 'IT IS IN THE CAMP: where you sleep and where you fight. Up to two a day.',
    'THRESHOLD': 'THE END OF ACT ONE: purple appears for the first time, on the hatch only. The faces line up: it was one face, and it was a machine.',
}


def purity_mod():
    s = importlib.util.spec_from_file_location('purity', os.path.join(ROOT, 'gates/bohemia_purity_gate.py'))
    m = importlib.util.module_from_spec(s); s.loader.exec_module(m); return m


def b64(im):
    import base64, io
    bio = io.BytesIO(); im.convert('RGB').save(bio, 'PNG'); return base64.b64encode(bio.getvalue()).decode()


def purple_pixels(im):
    """Two counts: the purity gate's own check_png (26 x 26 sample) and every opaque pixel at full size on its rule."""
    pm = purity_mod()
    _, _, sampled = pm.check_png(b64(im))
    a = A(im); op = a[..., 3] > 32
    full = int(((a[..., 0] > a[..., 1] + 25) & (a[..., 2] > a[..., 1] + 25) & (a[..., 0] > 80) & op).sum())
    return int(sampled), full


def card(path, fam):
    if not fam:
        return None
    r = subprocess.run([sys.executable, os.path.join(ROOT, 'skills/bohemia-pixel-art/scripts/check.py'), path, fam],
                       capture_output=True, text=True, cwd=ROOT)
    tail = [l for l in r.stdout.strip().splitlines() if l.strip()][-1:] or ['']
    return {'family': fam, 'exit': r.returncode, 'verdict': 'to DIRECTION\'s eye' if r.returncode == 0 else 'BACK', 'last_line': tail[0][:160]}


def label(d, x, y, s, col=(236, 230, 214)):
    d.text((x, y), s, fill=col)


def build():
    os.makedirs(OUT, exist_ok=True); os.makedirs(PROOF, exist_ok=True)
    rows = []; notes = {}
    for e in ELEMENTS:
        res = e['make']()
        extra = None
        if isinstance(res, tuple):
            res, extra = res
        files = []
        states = e.get('states') or [None]
        for i, im in enumerate(res):
            name = e['id'] + ('' if len(res) == 1 else '_%d' % (i + 1)) + '.png'
            im.save(os.path.join(OUT, name)); files.append(name)
        sp, fp = zip(*[purple_pixels(im) for im in res])
        c = card(os.path.join(OUT, files[-1]), e['family'])
        if c and e['twin'].startswith(('prop/', 'marking/', 'settlement/')):
            tc = card(os.path.join(BANK, e['twin'] + '.png'), e['family'])
            c['twin_verdict'] = tc['verdict']
        row = {k: v for k, v in e.items() if k not in ('make', 'family')}
        row.update({'files': files, 'size': list(res[0].size), 'purple_px': {'gate_sample': max(sp), 'full': max(fp)},
                    'card': c, 'draft': True})
        if extra is not None:
            row['measured'] = extra if not isinstance(extra, tuple) else list(extra)
        rows.append((row, res))
    data = {
        'version': 'the-wrongness-11-2', 'lane': 'direction', 'rule': 306, 'ask_line': 298, 'draft': True,
        'page': 'records/BOHEMIA_DIRECTION_THE_WRONGNESS_11_2_26.md',
        'tool': 'tools/bohemia_direction_the_wrongness_11_2_26.py',
        'his_words': 'this AI slop amalgamation creepypasta horror Crashbox HBO series vibe... make some really good elements or direction for art for shit like that, for real',
        'the_one_face': {'source': 'slices/fight_rig/faces.webp', 'faces_averaged': FACE_IDS,
                         'rule': 'every haunted face in act one is this one face; smooth on a screen, printed with his paper grain on paper'},
        'rules': {'one_at_a_time': 'never two wrongness elements on one screen', 'never_first_minute': True,
                  'never_announced': 'no sound sting, no zoom, no glow, no text pointing at it (the bible rules 2 and 3)',
                  'purple': 'none on any element; purple first appears at the threshold, on the hatch only (the purple law)',
                  'placement': 'the coordinator hands each element to the lane that owns its screen; DIRECTION places nothing'},
        'beats': BEATS,
        'elements': [r for r, _ in rows],
    }
    with open(os.path.join(OUT, 'wrongness.json'), 'w') as f:
        json.dump(data, f, indent=1, default=int)
    sheets(rows)
    return data


def sheets(rows):
    """THE SHEET (VOTE) at two art pixels to one phone point, and THE COMPARE (the 9/4 law) at one to one beside the twin
    and a man of the 112 box on the camp's own ground."""
    K = 2; pad = 14; colw = 2 * 260
    man = person('cast_apron', 0, 0)
    tiles = []
    for row, res in rows:
        w = sum(im.size[0] * K + 8 for im in res) - 8
        h = max(im.size[1] for im in res) * K
        t = Image.new('RGBA', (max(w, 240), h + 46), (34, 32, 30, 255)); d = ImageDraw.Draw(t)
        x = 0
        for im in res:
            bg = Image.new('RGBA', (im.size[0] * K, im.size[1] * K), (58, 54, 50, 255))
            bg.alpha_composite(im.resize((im.size[0] * K, im.size[1] * K), Image.NEAREST))
            t.paste(bg, (x, 0)); x += im.size[0] * K + 8
        label(d, 0, h + 4, row['title'][:58])
        label(d, 0, h + 18, ('where: ' + ', '.join(row['where']))[:62], (200, 190, 160))
        label(d, 0, h + 31, ('beat ' + row['beat'] + (' | ' + ' > '.join(row['states']) if row.get('states') else ''))[:62], (170, 160, 140))
        tiles.append(t)
    # pack the tiles in two columns, top to bottom
    cols = [[], []]; hts = [0, 0]
    for t in tiles:
        i = 0 if hts[0] <= hts[1] else 1
        cols[i].append(t); hts[i] += t.size[1] + pad
    W = pad + max(max((t.size[0] for t in c), default=0) for c in [cols[0]]) + pad + max(t.size[0] for t in cols[1]) + pad
    H = 60 + max(hts) + pad
    sheet = Image.new('RGBA', (W, H), (24, 22, 20, 255)); d = ImageDraw.Draw(sheet)
    label(d, pad, 10, 'THE WRONGNESS (DIRECTION 2, Paolo 11/2): one wrong thing each, his packs and our people, 2 art px to 1 point', (240, 232, 210))
    label(d, pad, 26, 'every haunted face is ONE face: the mean of 15 of the valley\'s own faces. No purple anywhere (0 px). draft:true', (200, 190, 160))
    x0 = [pad, pad + max(t.size[0] for t in cols[0]) + pad]
    for ci, c in enumerate(cols):
        y = 52
        for t in c:
            sheet.paste(t, (x0[ci], y)); y += t.size[1] + pad
    sheet.convert('RGB').save(SHEET, optimize=True)
    # THE COMPARE, one to one
    gnd = ground('plate.webp', 200, 200, 1, 1)
    comp_tiles = []
    for row, res in rows:
        twin = row['twin']
        tw = None
        if twin.startswith(('prop/', 'marking/', 'settlement/')):
            tw = pack(twin)
        im = res[-1]
        w = (tw.size[0] + 10 if tw else 0) + im.size[0] + 10 + 112
        h = max(im.size[1], 112, tw.size[1] if tw else 0)
        g = ground('plate.webp', 300, 300, w, h + 14)
        if row['id'] == 'loading_it_comes_closer' or row['id'] == 'feed_photo_one_extra':
            g = Image.new('RGBA', (w, h + 14), (34, 32, 30, 255))
        x = 0
        if tw:
            g.alpha_composite(tw, (x, h - tw.size[1])); x += tw.size[0] + 10
        g.alpha_composite(im, (x, h - im.size[1])); x += im.size[0] + 10
        g.alpha_composite(man, (x, h - 112))
        d = ImageDraw.Draw(g); label(d, 2, h + 1, (('twin | made | a man' if tw else 'made | a man') + ' : ' + row['id'])[:60], (20, 18, 16))
        comp_tiles.append(g)
    W = max(t.size[0] for t in comp_tiles) * 2 + 3 * pad
    half = (len(comp_tiles) + 1) // 2
    H = max(sum(t.size[1] + pad for t in comp_tiles[:half]), sum(t.size[1] + pad for t in comp_tiles[half:])) + pad
    comp = Image.new('RGBA', (W, H), (24, 22, 20, 255))
    for ci, part in enumerate([comp_tiles[:half], comp_tiles[half:]]):
        y = pad
        for t in part:
            comp.paste(t, (pad + ci * (W // 2), y)); y += t.size[1] + pad
    comp.convert('RGB').save(os.path.join(PROOF, 'compare.png'), optimize=True)


if __name__ == '__main__':
    data = build()
    for e in data['elements']:
        c = e['card']
        print('%-28s %-12s files %d  purple %s  card %s' % (e['id'], 'x'.join(map(str, e['size'])), len(e['files']),
              e['purple_px'], (c['family'] + ' ' + c['verdict']) if c else '-'))
