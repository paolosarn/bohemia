#!/usr/bin/env python3
"""COOK THREE: THE LOOP ON THE RIG'S MAN (rule 108 ROUND TWELVE (1), rule 110's swing, 10/17/26).

The Reds loop ran twelve looks on CHARACTER's code-drawn body and stopped at a wall: three shades a garment ramp in
the source, so no paint on top reached his packs' colours (skill lesson 7). DIRECTION's master rig round two
(564e1b1) now turns a 1.72 m man in eight facings with a walk at six keys. THIS TOOL CONTINUES THE SAME LOOP ON THAT
RENDERED BODY: it never draws a pixel; it reads the rig's render (records/target/master_rig/man/rig_*.png, a
mannequin, the pipe's proof and never the game's man), strips the mannequin's decal, and maps the render's own
shading through the Reds runway materials from engine/bohemia_cook3_runway_paint.json (an oxblood duster, a black
shirt, brick trousers and boots, bone light), with his pack tiles' grain laid in place as the cloth's texture. Every
knob is a number on the command line; every cycle's knobs are saved beside its picture; look.py judges.

REFERENCE CHECK (the 9/4 standing duty): the runway twin (reference/art_bank/character, photographs OWED), the
wardrobe laws, the card of numbers (records/BOHEMIA_THE_CARD_OF_NUMBERS_10_10_26.md), the body in metres
(records/BOHEMIA_THE_BODY_IN_METERS_10_13_26.md), the master rig (records/BOHEMIA_THE_MASTER_RIG_ROUND_TWO_THE_MODEL_MOVES_10_17_26.md),
AH-01 and AH-03. The twin on the sheet is the game's own Reds (the placeholder), because the packs hold no people.

    python3 tools/bohemia_cook3_the_loop_on_the_rigs_man.py --out records/cook3/loop/cook3_rigman_reds_13.png --set tex_amp=0.0
    python3 tools/bohemia_cook3_the_loop_on_the_rigs_man.py --knobs <saved.json> --all records/cook3/rigman   (eight facings + the S walk)
    python3 tools/bohemia_cook3_the_loop_on_the_rigs_man.py --knobs <saved.json> --sheet records/target/cook3/COOK3_THE_REDS_LOOP_ON_THE_RIGS_MAN.png

Paint data only. Nothing here is read by the game (rule 100); the pictures are a loop's log and a VOTE placeholder.
"""
import os, sys, json, glob
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
RIG = os.path.join(ROOT, 'records/target/master_rig/man')
PAINT = json.load(open(os.path.join(ROOT, 'engine/bohemia_cook3_runway_paint.json')))
TWIN = os.path.join(ROOT, 'records/cook3/loop/cook3_person_reds_11.png')   # the game's own Reds, the placeholder
W3 = np.array([0.299, 0.587, 0.114])

KNOBS = dict(
    decal_sat=0.12,     # a render pixel more saturated than this is the mannequin's decal, not shading
    white=0.86,         # the render's lit white, as a share of 255; shading is read against it
    black=0.0,          # the render's darkest shade worth reading; the read is stretched between black and white
    gamma=1.0,          # shading curve
    sun_y=0.0,          # extra light at the top (a share: 0.2 = the top is 10% brighter, the bottom 10% darker)
    sun_x=0.0,          # extra light at the left
    hi=0.35,            # how far the lit side blends toward bone (lesson 4)
    shade=0.30,         # how dark the shade side falls (a multiply toward the warm shadow)
    tex='reference/art_bank/ground/pack_2_dirt_path_tiles_001.png',   # his pixels, in place, as the cloth's grain
    tex_amp=0.0,        # how much of the tile's detail rides on the shading
    tex_skin=0.0,       # the same on skin (usually none)
    tex_rgb=0.0,        # the weave's colour: the tile's per-channel detail (its value detail taken out), times this
    skin_floor=0.0,     # skin's shade floor on the ramp (0.5 = skin never falls under the ramp's middle)
    skin_band=[0.03, 0.09],   # which rows of the twin (a share of its height) the skin colour is read from
    collar_front=0,     # 1 = the shirt shows only on the facings that show a chin
    hair_cap=1.0,       # hair's value ceiling on the ramp
    hand_mode=0,        # 0 = the hand is the arm's far reach in x; 1 = the arm's far end measured from the shoulder
    edge_k=1.0,         # the outline ring as a share of its inner neighbour (0.8 = 20% darker; 1 = untouched)
    head=0.15,          # the head's share of the height (bbox fractions)
    hair=0.045,         # the hair's share, from the top
    collar=0.20,        # the shirt shows between the head and here, inside the torso column
    coat=0.62,          # the duster ends here (mid coat)
    boot=0.92,          # the trousers end here
    hw=11,              # torso half width in px at this ruler (57 px a metre: 0.19 m)
    hand=5,             # the last N px of an arm's reach are the hand
    vib=None,           # vibrance down on the accent; None = the paint file's Reds value
    accent=None,        # the accent hex; None = the paint file's Reds value
    trouser_dark=0.80,  # trousers as a share of the coat's value
    boot_dark=0.55,
)


def hex_rgb(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], float)


def desat(c, k):
    l = c @ W3; return l + (c - l) * (1 - k)


def materials(K):
    R = PAINT['factions']['Reds']
    acc = hex_rgb(K['accent'] or R['accentHex']); vib = R['vibranceDown'] if K['vib'] is None else float(K['vib'])
    coat = desat(acc, vib)
    bone = np.array(PAINT['neutrals']['warm'][-1], float); black = np.array(PAINT['neutrals']['cool'][0], float)
    skin = np.array([196., 160., 128.]); hair = np.array([74., 52., 36.])
    t = Image.open(TWIN).convert('RGBA'); a = np.asarray(t).astype(float); op = a[..., 3] > 127
    ys = np.nonzero(op)[0]; h0 = ys.min(); hh = ys.max() - h0
    b0, b1 = K.get('skin_band', [0.03, 0.09])   # L30: the twin's face rows (its hair is 0 to 0.08; the sample used to hit the brow)
    face = op.copy(); face[int(h0 + b1 * hh):, :] = False; face[:int(h0 + b0 * hh), :] = False
    if face.sum() > 10: skin = np.median(a[face][:, :3], 0)          # his own Reds' skin, in place
    return dict(coat=coat, shirt=black, trousers=coat * K['trouser_dark'], boots=coat * K['boot_dark'], skin=skin, hair=hair,
                bone=bone, shadow=np.array(PAINT['neutrals']['warm'][1], float))


def regions(op, K, facing='S'):
    """0 none 1 hair 2 skin(head) 3 shirt 4 coat 5 trousers 6 boots 7 hand(skin); bands of the bbox, arms by the torso column"""
    H, Wd = op.shape; ys, xs = np.nonzero(op); y0, y1 = ys.min(), ys.max(); hh = y1 - y0 + 1
    f = (np.arange(H)[:, None] - y0) / float(hh)
    tor = op & (f > 0.25) & (f < 0.5); cx = np.median(np.nonzero(tor)[1]) if tor.any() else np.median(xs)
    dx = np.broadcast_to(np.abs(np.arange(Wd)[None, :] - cx), op.shape)
    f = np.broadcast_to(f, op.shape)
    r = np.zeros(op.shape, np.uint8)
    r[op] = 4
    r[op & (f >= K['coat'])] = 5
    r[op & (f >= K['boot'])] = 6
    r[op & (f < K['head'])] = 2
    r[op & (f < K['hair'])] = 1
    # L32: the shirt shows under the chin, so only on the facings that show a chin (S, SE, SW, E, W); the back of a neck is coat
    if not (K.get('collar_front', 0) and facing in ('N', 'NE', 'NW')):
        r[op & (f >= K['head']) & (f < K['collar']) & (dx <= K['hw'] * 0.45)] = 3
    arm = op & (f >= K['head']) & (f < K['coat']) & (dx > K['hw'])
    for side in (-1, 1):
        s = arm & ((np.arange(Wd)[None, :] - cx) * side > 0)
        if not s.any(): continue
        if K.get('hand_mode', 0) >= 1:
            # L33: the hand is the far end of the arm FROM THE SHOULDER, whichever way the arm points (an arm that
            # hangs has no reach in x, and the old rule read its whole forearm as skin on the N frame)
            sy, sx = y0 + 0.22 * hh, cx + side * K['hw']
            yy, xx = np.nonzero(s); dist = np.hypot(yy - sy, xx - sx); far = dist.max()
            pick = dist > far - K['hand']; r[yy[pick], xx[pick]] = 7
        else:
            reach = dx[s].max()
            r[s & (dx > reach - K['hand'])] = 7
    return r, (y0, hh, cx)


def shading(a, op, K):
    rgb = a[..., :3]; L = (rgb @ W3) / 255.0
    mx, mn = rgb.max(2), rgb.min(2); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    decal = op & (sat > K['decal_sat'])
    good = op & ~decal; Lf = L.copy()
    H, Wd = op.shape
    for y in range(H):
        gx = np.nonzero(good[y])[0]; bx = np.nonzero(decal[y])[0]
        if not len(bx): continue
        if len(gx): Lf[y, bx] = np.interp(bx, gx, L[y, gx])
        else: Lf[y, bx] = np.nan
    # a decal row with no good pixel: take it from the nearest good row
    for x in range(Wd):
        col = Lf[:, x]; bad = np.isnan(col) & op[:, x]
        if bad.any():
            gy = np.nonzero(op[:, x] & ~np.isnan(col))[0]
            col[bad] = np.interp(np.nonzero(bad)[0], gy, col[gy]) if len(gy) else 0.8
    blk = K.get('black', 0.0)   # the render's darkest shade worth reading (L17): the compressed render is stretched black..white
    Lf = np.clip((Lf - blk) / max(1e-6, K['white'] - blk), 0, 1) ** K['gamma']
    return Lf


def texture(shape, K, anchor):
    if not K['tex'] or K['tex_amp'] <= 0 and K['tex_skin'] <= 0: return np.zeros(shape)
    t = np.asarray(Image.open(os.path.join(ROOT, K['tex'])).convert('RGB')).astype(float) @ W3 / 255.0
    th, tw = t.shape; p = np.pad(t, 1, mode='wrap')
    blur = sum(p[dy:dy + th, dx:dx + tw] for dy in range(3) for dx in range(3)) / 9.0
    d = t - blur                                   # his tile's detail, the fill taken out
    H, Wd = shape; y0, _, cx = anchor
    yy = (np.arange(H)[:, None] - int(y0)) % th; xx = (np.arange(Wd)[None, :] - int(cx)) % tw
    return d[yy, xx]


def paint(src, K):
    im = Image.open(src).convert('RGBA'); a = np.asarray(im).astype(float)
    op = a[..., 3] > 127
    import re as _re
    m = _re.search(r'_(N|NE|E|SE|S|SW|W|NW)(?:_k\d+)?\.png$', os.path.basename(src)); facing = m.group(1) if m else 'S'
    r, anchor = regions(op, K, facing)
    L = shading(a, op, K)
    H, Wd = op.shape; y0, hh, cx = anchor
    fy = (np.arange(H)[:, None] - y0) / float(hh); fx = (np.arange(Wd)[None, :] - cx) / float(max(1, K['hw'] * 2))
    L = L * (1 + K['sun_y'] * (0.5 - fy)) * (1 + K['sun_x'] * (-fx) * 0.5)
    d = texture(op.shape, K, anchor)
    skinish = (r == 2) | (r == 7)
    L = L + d * np.where(skinish, K['tex_skin'], K['tex_amp'])
    L = np.clip(L, 0, 1)
    sf = K.get('skin_floor', 0.0)   # L29: skin is matte and light; its shade never falls as deep as wool's
    if sf > 0: L = np.where(skinish, sf + (1 - sf) * L, L)
    hc = K.get('hair_cap', 1.0)     # L33: hair is the top of the render's light and bleached to bone; cap its value
    if hc < 1: L = np.where(r == 1, L * hc, L)
    M = materials(K)
    base = np.zeros(a.shape[:2] + (3,))
    for code, name in ((1, 'hair'), (2, 'skin'), (3, 'shirt'), (4, 'coat'), (5, 'trousers'), (6, 'boots'), (7, 'skin')):
        base[r == code] = M[name]
    # lesson 4: the lit side blends TOWARD the light's colour (bone), the shade side multiplies toward the warm shadow
    lit = np.clip((L - 0.5) / 0.5, 0, 1)[..., None]; shd = np.clip(L / 0.5, 0, 1)[..., None]
    dark = base * (K['shade'] + (1 - K['shade']) * (M['shadow'] / 255.0))
    out = np.where(L[..., None] >= 0.5, base + (M['bone'] - base) * lit * K['hi'], dark + (base - dark) * shd)
    # L24: the weave's COLOUR, not only its value: his tile's per-channel detail minus its value detail, on the cloth
    if K.get('tex_rgb', 0) > 0 and K['tex']:
        t3 = np.asarray(Image.open(os.path.join(ROOT, K['tex'])).convert('RGB')).astype(float) / 255.0
        th, tw = t3.shape[:2]; p3 = np.pad(t3, ((1, 1), (1, 1), (0, 0)), mode='wrap')
        b3 = sum(p3[dy:dy + th, dx:dx + tw] for dy in range(3) for dx in range(3)) / 9.0
        d3 = (t3 - b3); d3 = d3 - (d3 @ W3)[..., None]
        yy = (np.arange(H)[:, None] - int(y0)) % th; xx = (np.arange(Wd)[None, :] - int(cx)) % tw
        chroma = d3[yy, xx] * 255.0 * K['tex_amp'] * K['tex_rgb']
        cloth = op & ~skinish
        out[cloth] = out[cloth] + chroma[cloth]
    # the edge ring: its inner neighbour's value times edge_k
    pad = np.pad(op, 1); nb = pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:]
    edge = op & ~nb
    if K['edge_k'] != 1.0 and edge.any():
        inner = out.copy(); inner[~nb] = 0; cnt = nb.astype(float)
        pp = np.pad(inner, ((1, 1), (1, 1), (0, 0))); pc = np.pad(cnt, 1)
        s = sum(pp[dy:dy + H, dx:dx + Wd] for dy in range(3) for dx in range(3)); c = sum(pc[dy:dy + H, dx:dx + Wd] for dy in range(3) for dx in range(3))
        m = s / np.maximum(c, 1)[..., None]
        out[edge & (c > 0)] = m[edge & (c > 0)] * K['edge_k']
    res = a.copy(); res[..., :3] = np.clip(out, 0, 255); res[~op] = 0
    return Image.fromarray(res.astype(np.uint8), 'RGBA'), r


def knobs_from_argv(argv):
    K = dict(KNOBS)
    if '--knobs' in argv: K.update(json.load(open(argv[argv.index('--knobs') + 1])))
    for i, s in enumerate(argv):
        if s == '--set':
            for kv in argv[i + 1].split(','):
                k, v = kv.split('=')
                K[k] = None if v == 'none' else (v if k in ('tex', 'accent') else ([float(x) for x in v.split(':')] if ':' in v else float(v)))
    return K


def sheet(K, out, frames_dir):
    """eight facings and the S walk at 1:1, the painted S beside the game's own Reds at 1:1 and 4x"""
    BG = (22, 21, 20); fac = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    row1 = [Image.open(os.path.join(frames_dir, 'rig_%s.png' % f)) for f in fac]
    row2 = [Image.open(os.path.join(frames_dir, 'rig_Anim_0_S_k%02d.png' % k)) for k in range(6)]
    tw = Image.open(TWIN).convert('RGBA'); s1 = row1[4]
    Wd = max(sum(i.width + 10 for i in row1), 760) + 24
    H = 60 + 150 + 30 + 150 + 30 + 4 * max(s1.height, tw.height) + 80
    S = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), 'COOK THREE: THE REDS LOOK ON THE RIG\'S MAN, 1:1 (a placeholder: the mannequin is the pipe\'s proof, the look is the loop\'s)', fill=(220, 214, 200))
    d.text((12, 24), 'the master rig (57 px a metre, 1.72 m = 98 px) dressed by the Reds paint; left: the eight facings; then the S walk at six keys; then beside the game\'s own Reds today', fill=(160, 154, 140))
    x = 12; y = 50
    d.text((x, y), 'EIGHT FACINGS, STILL', fill=(200, 190, 120)); y += 16
    for f, im in zip(fac, row1): S.paste(im, (x, y), im); d.text((x, y + 136), f, fill=(160, 154, 140)); x += im.width + 10
    y += 150 + 14; x = 12
    d.text((x, y), 'THE WALK, S, 6 DRAWN KEYS = 2 BEATS AT 120', fill=(200, 190, 120)); y += 16
    for k, im in enumerate(row2): S.paste(im, (x, y), im); d.text((x, y + 136), 'k%d' % k, fill=(160, 154, 140)); x += im.width + 10
    y += 150 + 14; x = 12
    d.text((x, y), 'OURS (the rig\'s man, painted)  |  HIS TWIN TODAY: the game\'s own code-drawn Reds (the placeholder)   at 1:1 then 4x', fill=(200, 190, 120)); y += 16
    S.paste(s1, (x, y), s1); S.paste(tw, (x + s1.width + 20, y), tw)
    x4 = x + s1.width + tw.width + 60
    b1 = s1.resize((s1.width * 4, s1.height * 4), Image.NEAREST); b2 = tw.resize((tw.width * 4, tw.height * 4), Image.NEAREST)
    S.paste(b1, (x4, y), b1); S.paste(b2, (x4 + b1.width + 20, y), b2)
    y += 4 * max(s1.height, tw.height) + 10
    d.text((12, y), 'knobs: ' + ', '.join('%s=%s' % (k, v) for k, v in K.items() if k not in ('tex',)), fill=(120, 116, 108))
    d.text((12, y + 14), 'grain from his tile ' + str(K['tex']) + ' laid in place; the mannequin\'s decal stripped before the shading is read', fill=(120, 116, 108))
    os.makedirs(os.path.dirname(out), exist_ok=True); S.save(out); print('sheet', out)


def main():
    argv = sys.argv[1:]
    K = knobs_from_argv(argv)
    opt = lambda k: argv[argv.index(k) + 1] if k in argv else None
    if opt('--all'):
        d = opt('--all'); os.makedirs(d, exist_ok=True)
        files = [os.path.join(RIG, 'rig_%s.png' % f) for f in ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']] + \
                [os.path.join(RIG, 'rig_Anim_0_S_k%02d.png' % k) for k in range(6)]
        for f in files:
            im, _ = paint(f, K); im.save(os.path.join(d, os.path.basename(f)))
        json.dump(K, open(os.path.join(d, 'knobs.json'), 'w'), indent=1); print('painted', len(files), 'frames into', d); return
    if opt('--sheet'):
        return sheet(K, opt('--sheet'), opt('--frames') or os.path.join(ROOT, 'records/cook3/rigman'))
    src = opt('--src') or os.path.join(RIG, 'rig_S.png'); out = opt('--out')
    if not out: sys.exit(__doc__)
    im, r = paint(src, K); os.makedirs(os.path.dirname(out), exist_ok=True); im.save(out)
    json.dump(K, open(os.path.splitext(out)[0] + '.knobs.json', 'w'), indent=1)
    if '--regions' in argv:
        pal = {0: (0, 0, 0, 0), 1: (90, 60, 30, 255), 2: (230, 190, 150, 255), 3: (30, 30, 30, 255), 4: (170, 60, 50, 255), 5: (120, 50, 40, 255), 6: (60, 30, 25, 255), 7: (250, 220, 180, 255)}
        rg = np.zeros(r.shape + (4,), np.uint8)
        for c, v in pal.items(): rg[r == c] = v
        Image.fromarray(rg, 'RGBA').resize((r.shape[1] * 4, r.shape[0] * 4), Image.NEAREST).save(os.path.splitext(out)[0] + '.regions.png')
    print('wrote', out)


if __name__ == '__main__':
    main()
