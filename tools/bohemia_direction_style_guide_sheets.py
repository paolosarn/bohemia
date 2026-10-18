#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the style guide] and [the look bible]: THE THREE SHEETS (rules 114a and 115d, 10/18/26).

  1. EVERYTHING THE SAME (the look bible's sheet, his 'just make sure everything's looking the same'): the robot, the
     truck, a man, a beast (the fox at a dire wolf's 1.9 m; the grey wolf is not shown again, his NO) and a prop (the
     oil drum, modelled here from the source palette) through ONE rig, same sun, same camera, same 57 px a metre,
     side by side at 1:1 on dark grey, again at 1:1 on his own ground tile, and at 2x the way a phone shows them.
  2. DO AND DON'T (field 16): one pair per field 2 to 15, the DO left, the DON'T right, each DON'T made by turning ONE
     setting the wrong way (a rig render with that one break, or one post step), so he sees what each number buys.
  3. THE HAND-FINISH (research round two, Section E): the robot's eight facings, the rig's raw output above, the
     finished below, and the pixels the finish moved in red, with the counts from finish.json.
Every sheet is drawn in the project's own font (slices/fonts/BohemiaROM-Regular.ttf), never a system font.

    python3 tools/bohemia_direction_style_guide_sheets.py
"""
import glob, json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'records/target/direction_style_guide')
G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))
PAL = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
FONT = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, DIM, RED, GREEN = (24, 23, 22, 255), (226, 214, 190, 255), (150, 140, 124, 255), (214, 74, 60, 255), (126, 178, 120, 255)
GROUND = os.path.join(ROOT, 'reference/art_bank/ground')


def font(n): return ImageFont.truetype(FONT, n)


def im(path): return Image.open(path).convert('RGBA')


def x2(i, k=2): return i.resize((i.width * k, i.height * k), Image.NEAREST)


BOARD = os.path.join(ROOT, 'reference/art_bank/fight_board/COMBAT2_BOARD_SMALL_10_16.webp')
_board = None


def ground_tile():
    """his own ground: COMBAT TWO's small board, his pack tiles laid at 1:1 (82 px = 1.44 m, the rig's 57 px a metre),
    the crossroads and its crossing (his pack pieces are shaped, never a full square, so a single tile cannot be tiled)"""
    return BOARD if os.path.exists(BOARD) else None


def tiled(tile, w, h, at=(1640, 1860)):
    global _board
    if _board is None: _board = im(tile)
    x0, y0 = at
    return _board.crop((x0, y0, x0 + w, y0 + h))


def label(dr, xy, text, size=14, fill=INK): dr.text(xy, text, font=font(size), fill=fill)


def rig(name): return json.load(open(os.path.join(D, name, 'rig.json')))


def still(name, facing='S', fin=False):
    return im(os.path.join(D, name, ('fin_%s.png' if fin else 'rig_%s.png') % facing))


def sheet_everything():
    names = [('robot', 'THE ROBOT (his maquette)'), ('truck', 'THE TRUCK (his maquette)'), ('man', 'A MAN, 1.72 M'), ('fox', 'A BEAST, 1.9 M'), ('drum', 'A PROP, 0.88 M (made here)')]
    rows = [[still(n, f) for n, _ in names] for f in ('S', 'SE')]
    tile = ground_tile()
    gap = 24; colw = [max(170, max(r[i].width for r in rows)) for i in range(len(names))]
    W = 40 + sum(colw) + gap * (len(names) - 1) + 40
    H1 = max(i.height for i in rows[0]) + max(i.height for i in rows[1]) + 30
    H = 150 + H1 + 60 + H1 + 60 + 2 * sum(i.height for i in rows[0]) + 400
    c = Image.new('RGBA', (W, H), BG); dr = ImageDraw.Draw(c)
    label(dr, (40, 24), 'THE LOOK BIBLE: EVERYTHING FROM ONE TABLE', 26)
    rg = G['rig']
    label(dr, (40, 62), 'one rig, one sun (screen %s deg), one camera (ortho, tilt %d), %d px a metre, wear %.1f, ring %d, the contact shadow; all five at 1:1, true size' % (rg['calibration']['screen_light_deg'], rg['tilt_deg'], rg['ppm'], rg['wear'], rg['ring']), 14, DIM)
    label(dr, (40, 84), 'numbers from records/target/BOHEMIA_STYLE_GUIDE.json; every render reads them; style_guide_gate.py diffs them', 14, DIM)
    y = 120
    def put_rows(y, on_ground):
        if on_ground and tile:
            c.alpha_composite(tiled(tile, W - 80, H1 + 10), (40, y - 5))
        x = 40
        for i, (n, t) in enumerate(names):
            yy = y
            for r in rows:
                c.alpha_composite(r[i], (x + (colw[i] - r[i].width) // 2, yy)); yy += max(q.height for q in r) + 30
            x += colw[i] + gap
        return y + H1
    y = put_rows(y, False)
    x = 40
    for i, (n, t) in enumerate(names):
        m = rig(n); cg = m['card_guide']
        label(dr, (x, y + 4), t, 12); label(dr, (x, y + 20), '%s col., card %d/8 out' % (format(cg['colours'], ','), cg['out']), 11, DIM)
        x += colw[i] + gap
    y += 56
    label(dr, (40, y), 'THE SAME, AT 1:1 ON HIS OWN GROUND (his pack tiles as COMBAT TWO laid them, 1:1)', 16); y += 30
    y = put_rows(y, True) + 40
    label(dr, (40, y), 'AT 2X, THE WAY HIS PHONE SHOWS THEM (whole-number scale only)', 16); y += 30
    x = 40; rowh = 0
    for i, (n, t) in enumerate(names):
        s = x2(rows[0][i])
        if x + s.width > W - 40: x = 40; y += rowh + gap; rowh = 0
        c.alpha_composite(s, (x, y)); x += s.width + gap; rowh = max(rowh, s.height)
    c = c.crop((0, 0, W, y + rowh + 30))
    out = os.path.join(ROOT, G['sheets']['everything_the_same']); c.convert('RGB').save(out); return out


def quantise(a, n):
    """a straight posterise per material in luminance steps: what the toon ramp would have done (field 7's DON'T)"""
    b = a.copy(); op = b[..., 3] == 255
    v = b[..., :3].astype(float).mean(-1, keepdims=True); q = np.floor(v / 256 * n) / (n - 1) * 255
    b[..., :3] = np.where(op[..., None], np.clip(b[..., :3] * (q / np.maximum(v, 1)), 0, 255), b[..., :3]); return b.astype(np.uint8)


def sheet_do_and_dont():
    robot = np.asarray(still('robot')); tile = ground_tile(); tl = im(tile) if tile else None
    def on_ground(a, w=None, h=None):
        s = Image.fromarray(a) if isinstance(a, np.ndarray) else a
        w = w or max(s.width + 20, 120); h = h or s.height + 20
        g = tiled(tile, w, h) if tile else Image.new('RGBA', (w, h), (90, 80, 70, 255)); g.alpha_composite(s, ((w - s.width) // 2, (h - s.height) // 2)); return g
    pairs = []
    # 2 pixel size
    small = still('robot'); big = x2(small)
    pairs.append((2, on_ground(small, 260, 330), on_ground(big, 260, 330), 'one pixel size: the robot at 1:1 on his 1:1 tile', 'the robot at 2x on a 1x tile: mixels'))
    # 3 camera: W rendered vs E mirrored
    pairs.append((3, on_ground(still('robot', 'W')), on_ground(still('robot', 'E').transpose(Image.FLIP_LEFT_RIGHT)), 'W rendered: the light stays on the left', 'W made by mirroring E: the light jumps sides'))
    # 4 palette: a hue-shifted ramp vs straight darkening
    def swatches(hexes):
        s = Image.new('RGBA', (5 * 36, 60), BG); d = ImageDraw.Draw(s)
        for i, h in enumerate(hexes): d.rectangle([i * 36, 0, i * 36 + 34, 58], fill=h)
        return s
    r = PAL['clay_mustard']['ramp']; a = np.array([int(r[2][i:i + 2], 16) for i in (1, 3, 5)], float)
    straight = ['#%02x%02x%02x' % tuple(int(min(255, x)) for x in a * k) for k in (0.38, 0.62, 1.0, 1.2, 1.35)]
    pairs.append((4, swatches(r), swatches(straight), 'clay_mustard: shadow walks red-brown, light walks yellow', 'the same base multiplied: no hue shift'))
    # 5 colour budget: as rendered vs snapped to 16 colours
    q16 = Image.fromarray(robot).convert('RGB').quantize(16, dither=Image.Dither.NONE).convert('RGBA'); q = np.asarray(q16).copy(); q[..., 3] = robot[..., 3]
    pairs.append((5, on_ground(robot), on_ground(q), '%s colours: the clay as rendered' % format(rig('robot')['card_guide']['colours'], ','), 'snapped to 16 colours: a toy again'))
    # 6 light
    pairs.append((6, on_ground(still('robot')), on_ground(still('dont_light_from_below')), 'one sun, upper left (155 deg on screen)', 'the sun from below (248 deg): a light from elsewhere'))
    # 7 shading: smooth clay vs a 4-step ramp
    pairs.append((7, on_ground(robot), on_ground(quantise(robot, 4)), 'smooth clay under one hard sun', 'a 4-step toon ramp: banded, cel, turned down'))
    # 8 outline: ring 8 vs a black ring
    blk = robot.copy(); op = blk[..., 3] == 255; p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    blk[op & ~inner, :3] = (12, 10, 10)
    pairs.append((8, on_ground(robot), on_ground(blk), 'the ring 8 darker: in his packs\' band', 'a black outline: a sticker'))
    # 9 alpha: binary vs the render's soft fringe
    raw = os.path.join(D, 'robot', 'raw_S.png')
    if os.path.exists(raw):
        rr = im(raw); box = rig('robot')['crop_box_px']; soft = rr.crop(tuple(box))
    else: soft = still('robot')
    pairs.append((9, x2(on_ground(robot), 3).crop((60, 60, 360, 300)), x2(on_ground(soft), 3).crop((60, 60, 360, 300)), 'a hard edge, alpha 0 or 255 (3x)', 'the render\'s half-alpha fringe kept (3x)'))
    # 10 proportions: the 8x8 silhouette reads vs a filled box
    def sil(a):
        s = Image.fromarray(((a[..., 3] == 255) * 255).astype(np.uint8)).resize((8, 8), Image.BOX).point(lambda v: 255 if v > 96 else 0)
        return x2(Image.merge('RGBA', (s, s, s, Image.new('L', (8, 8), 255))), 16)
    box8 = np.zeros_like(robot); box8[10:-10, 15:-15] = 255
    pairs.append((10, sil(robot), sil(box8), 'the robot at 8x8: head, arms, legs', 'a figure with no feature: a filled box'))
    # 11 detail: dirt in patches vs even grain everywhere
    rng = np.random.default_rng(7); lep = robot.astype(int).copy(); op = lep[..., 3] == 255
    lep[..., :3][op] = np.clip(lep[..., :3][op] + rng.integers(-22, 23, size=(op.sum(), 1)), 0, 255)
    pairs.append((11, on_ground(robot), on_ground(lep.astype(np.uint8)), 'dirt in patches, a clean panel between', 'even grain everywhere: a leopard print'))
    # 12 variation
    d1, d2 = still('drum'), (still('drum_seed2') if os.path.exists(os.path.join(D, 'drum_seed2', 'rig_S.png')) else still('drum', 'SE'))
    def row(ims):
        w = sum(i.width for i in ims) + 8 * (len(ims) - 1); s = Image.new('RGBA', (w, max(i.height for i in ims)), (0, 0, 0, 0)); x = 0
        for i in ims: s.alpha_composite(i, (x, 0)); x += i.width + 8
        return s
    pairs.append((12, on_ground(row([d1, d2, d1.transpose(Image.FLIP_LEFT_RIGHT) if False else still('drum', 'SW')])), on_ground(row([d1] * 5)), 'one drum, two wear seeds and a turn', 'the same drum stamped five times'))
    # 13 contact: shadow vs floating
    fl = robot.copy(); sh = (fl[..., 3] < 255) & (fl[..., :3].sum(-1) == 0); fl[sh, 3] = 0
    pairs.append((13, on_ground(robot), on_ground(fl), 'standing on its own shadow', 'no shadow: it floats on his ground'))
    # 14 UI
    def ui(good):
        s = Image.new('RGBA', (240, 90), BG); d = ImageDraw.Draw(s)
        if good:
            d.rectangle([20, 20, 220, 70], fill=(205, 190, 158)); d.line([20, 70, 220, 70], fill=(120, 104, 80), width=2)
            d.text((40, 34), 'END TURN', font=font(20), fill=(40, 34, 28))
        else:
            for y in range(20, 71):
                t = (y - 20) / 50; d.line([30, y, 210, y], fill=(int(130 - 50 * t), int(60 + 10 * t), int(220 - 40 * t)))
            d.rounded_rectangle([20, 20, 220, 70], radius=14, outline=(200, 160, 255), width=2)
            d.text((60, 34), 'End turn', font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18), fill=(255, 255, 255))
        return s
    pairs.append((14, ui(True), ui(False), 'receipt paper, square corners, BohemiaROM', 'a purple gradient, round corners, a system font'))
    # 15 animation: drawn keys vs a blended in-between
    keys = sorted(glob.glob(os.path.join(D, 'robot', 'rig_Idle_S_k*.png')))[:4]
    if keys:
        ks = [im(k) for k in keys]
        blend = [Image.blend(ks[i], ks[i + 1], 0.5) for i in range(3)]
        mixed = [ks[0], blend[0], ks[1], blend[1], ks[2]]
        pairs.append((15, row([x for x in ks]), row(mixed), 'only the drawn keys, nothing between', 'blended in-betweens: a smooth move, a ghost'))
    # lay out
    pairs = [(n, x2(d1), x2(d2), dt + ' (2x)', nt + ' (2x)') if n in (3, 5, 6, 7, 8, 11, 12, 13, 15) else (n, d1, d2, dt, nt) for n, d1, d2, dt, nt in pairs]
    fields = {f['n']: f for f in G['fields']}
    cw = max(max(p[1].width, p[2].width) for p in pairs); W = 40 + 2 * cw + 60 + 40
    H = 120 + sum(max(p[1].height, p[2].height) + 70 for p in pairs) + 20
    c = Image.new('RGBA', (W, H), BG); dr = ImageDraw.Draw(c)
    label(dr, (40, 24), 'THE STYLE GUIDE: DO AND DON\'T, ONE PAIR A FIELD', 26)
    label(dr, (40, 62), 'left: what the guide says. right: the same thing with ONE number turned the wrong way. records/target/BOHEMIA_STYLE_GUIDE.json', 14, DIM)
    y = 110
    for n, do, dont, dt, nt in pairs:
        label(dr, (40, y), '%d. %s' % (n, fields[n]['field'].upper()), 16)
        hh = max(do.height, dont.height)
        c.alpha_composite(do, (40, y + 24)); c.alpha_composite(dont, (40 + cw + 60, y + 24))
        label(dr, (40, y + 30 + hh), 'DO: ' + dt, 12, GREEN); label(dr, (40 + cw + 60, y + 30 + hh), 'DON\'T: ' + nt, 12, RED)
        y += hh + 70
    out = os.path.join(ROOT, G['sheets']['do_and_dont']); c.crop((0, 0, W, y + 10)).convert('RGB').save(out); return out


def sheet_hand_finish():
    f = json.load(open(os.path.join(D, 'robot', 'finish.json'))); fs = f['facings']
    raw = [still('robot', x['facing']) for x in fs]; fin = [still('robot', x['facing'], True) for x in fs]
    diffs = []
    for a, b in zip(raw, fin):
        A, B = np.asarray(a).astype(int), np.asarray(b).astype(int); ch = np.abs(A - B).sum(-1) > 0
        d = np.asarray(a.convert('LA').convert('RGBA')).copy(); d[..., :3] = (d[..., :3] * 0.45).astype(np.uint8); d[ch, :3] = RED[:3]; d[ch, 3] = 255
        diffs.append(Image.fromarray(d))
    cw = max(i.width for i in raw); gap = 18; W = 40 + 8 * (cw + gap) + 40
    rh = max(i.height for i in raw)
    H = 120 + 3 * (rh + 40) + 2 * (3 * rh + 50) + 200
    c = Image.new('RGBA', (W, H), BG); dr = ImageDraw.Draw(c)
    label(dr, (40, 24), 'THE HAND-FINISH, AS BIG AS IT REALLY IS', 26)
    t = f['total']
    label(dr, (40, 62), 'the robot\'s eight facings: the rig\'s output, the finished, and the pixels moved (red): %s of %s body pixels, %s%%' % (format(t['pixels_changed'], ','), format(t['body_pixels'], ','), t['changed_share_pct']), 14, DIM)
    label(dr, (40, 84), 'B5 fireflies out, B6 the ring lit on the light side and darker on the shadow side, B8 three clay highlights, B9 one glint on each eye. B3/B4 skipped: the clay keeps its smooth light.', 12, DIM)
    y = 120
    for name, ims in (('RAW (the rig)', raw), ('FINISHED', fin), ('MOVED', diffs)):
        label(dr, (40, y), name, 14); x = 40
        for i in ims: c.alpha_composite(i, (x, y + 22)); x += cw + gap
        y += rh + 40
    label(dr, (40, y), 'THE FRONT AND THE THREE-QUARTER AT 3X: RAW, FINISHED', 14); y += 22; x = 40
    for k in ('S', 'SE'):
        i = [q['facing'] for q in fs].index(k)
        for s in (raw[i], fin[i]): s3 = x2(s, 3); c.alpha_composite(s3, (x, y)); x += s3.width + gap
    y += 3 * rh + 30
    for k in ('S', 'SE', 'SW', 'E'):
        r = next(q for q in fs if q['facing'] == k)
        label(dr, (40, y), '%-2s  fireflies %d, ring lit %d / darker %d of %d, highlights %d px, eye glints %d, staircases flagged %d, moved %d px (%s%%)' % (k, r['B5_fireflies'], r['B6_ring_lit'], r['B6_ring_darker'], r['B6_ring'], r['B8_highlight_px'], r['B9_eye_glints'], r['B7_staircase_flags_left_edge'], r['pixels_changed'], r['changed_share_pct']), 12, DIM); y += 20
    out = os.path.join(ROOT, G['sheets']['hand_finish']); c.crop((0, 0, W, y + 20)).convert('RGB').save(out); return out


if __name__ == '__main__':
    for fn in (sheet_everything, sheet_do_and_dont, sheet_hand_finish):
        o = fn(); print(os.path.relpath(o, ROOT), Image.open(o).size)
