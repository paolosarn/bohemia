#!/usr/bin/env python3
"""THE BOARDS AT NIGHT, AND LIGHT AS A TILE  (COMBAT 2 [floor set] round six, rule 59's night-lit row)

Rule 59's tile table ends with NIGHT: Battle Brothers cuts ranged hits and vision after dark, and
the school page's translation is 'the dead grid at night; a lit tile (a generator, a car's
headlights) restores it... plus light as a tile property.' The dollar died and so did the grid,
so most of the valley is black after sunset and the few lights left are the whole fight.

This round takes two of round four's boards (the SUBURB BLOCK and the STRIP LOT) to night:
  * every colour on the board is pulled down to a third of itself and snapped back onto his own
    palette (every pixel stays his: numpy nearest over the allowed set), cold;
  * the lights that still work are HIS sprites: the cast-iron street lamps of the 7/28 bank
    (one in three still lit; the rest are dark posts) and the oil drum with a fire in it, plus a
    dead car whose headlights somebody wired to a battery;
  * around each live light the ground keeps its day colour in a pool that falls off in rings
    (hard steps, not a blur: pixel art), warm;
  * every house tile gets a LIGHT tag (lit / dark) read off the drawn pools: a tile is 'lit' when
    40% of it is inside a pool, so the rule can never disagree with what he sees.

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * every pixel is his (the 7/28 bank, the desert and water banks, his sprites);
  * tiles 515 x 364, not stamped (round three's guard);
  * the light grid is read from the pools, and every 'lit' tile holds a live light's pool.

THE ANALOG HORROR LINE (rule 20): one lamp in three still works and nobody knows what is paying
for it. The pool under it is the only place on the block you can see a face.

REFERENCE CHECK (the 9/4 standing law):
  AH-01 THE BIBLE: night is not a filter laid over day; it is a different board, the light
        sources drawn and the dark kept on his ramps.
  CGRD-01 INTO THE BREACH: clarity over cool, so the lit pools are the brightest thing on the
        board and the men inside them read first.
  TG-04 THE STREET TILE: the kerb still reads in the pool.
  REUSE CHECK: the boards are round four's, the lamps and the drum are his 7/28 sprites, every
  helper from rounds three and four.

[bb every floor tile] records/BOHEMIA_BATTLE_BROTHERS_SCHOOL_EVERY_FLOOR_TILE_AND_ITS_TRANSLATION_10_1_26.md,
  the NIGHT row: BB's night is a global penalty. OURS (rule 39b): night is local, per tile,
  because the light is a thing on the board you can stand in, shoot out, or carry.

    python3 tools/bohemia_combat2_night_boards_cook_10_1_26.py
      -> banks/BOHEMIA_THE_FIGHT_BOARDS_AT_NIGHT_10_1_26.txt
      -> slices/vote/COMBAT2_NIGHT_BOARDS_10_1.png
"""
import importlib, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
R5 = importlib.import_module('bohemia_combat2_shore_landfill_ruin_cook_10_1_26')   # extends the allowed set
R4, B, F, K, CV = R5.R4, R5.B, R5.F, R5.K, R5.CV
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_THE_FIGHT_BOARDS_AT_NIGHT_10_1_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_NIGHT_BOARDS_10_1.png'
M, R, die = B.M, K.R, K.die
PX, PY, BP, N, ty = B.PX, B.PY, B.BP, B.N, B.ty
PAL = np.array(sorted(B.OK), dtype=np.int32)


def snap(arr):
    """Every colour onto his palette, nearest, in numpy (one decision per distinct colour)."""
    flat = arr.reshape(-1, 3).astype(np.int32)
    u, inv = np.unique(flat, axis=0, return_inverse=True)
    best = np.empty(len(u), dtype=np.int64)
    for i in range(0, len(u), 512):
        best[i:i + 512] = np.abs(u[i:i + 512, None, :] - PAL[None, :, :]).sum(-1).argmin(1)
    return PAL[best][inv.ravel()].reshape(arr.shape).astype(np.uint8)


def night(board, lights):
    """Day -> night: a third of itself, a little colder; then each live light's pool restored in
       hard rings, warm at the heart."""
    a = np.array(board.convert('RGB')).astype(np.float32)
    dark = a * np.array([0.30, 0.31, 0.38])
    H, W = a.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W]
    keep = np.zeros((H, W), np.float32)
    for (x, y, rad) in lights:
        d = np.sqrt(((xx - x) / 1.0) ** 2 + ((yy - y) / TILT_R) ** 2) / rad
        ring = np.where(d < 0.45, 1.0, np.where(d < 0.75, 0.72, np.where(d < 1.0, 0.45, 0.0)))   # hard steps
        keep = np.maximum(keep, ring)
    warm = a * np.array([1.0, 0.93, 0.80])
    out = dark * (1 - keep[..., None]) + warm * keep[..., None]
    return Image.fromarray(snap(np.clip(out, 0, 255))), keep


TILT_R = 0.7071                                        # the pools are ellipses: the 45 camera


def place(board, sid, x_m, y_m):
    sp = F.load(F.SPR[sid]).convert('RGBA')
    hard = sp.getchannel('A').point(lambda a: 255 if a > 127 else 0)
    x, y = M(x_m), ty(M(y_m)) - sp.size[1]
    board.paste(sp.convert('RGB'), (x, y), hard)
    return x + sp.size[0] // 2, y + sp.size[1]


def make(kind_fn, lamp_row_y, seed):
    board, pieces, surf, grid = kind_fn()
    day = B.composed(board, pieces, {k: fn() for k, fn in CV.PIECES}).convert('RGB')
    r = R(seed)
    lights, dead = [], []
    for k, x_m in enumerate(range(5, 60, 12)):                        # a lamp every 12 m on the walk
        for y_m in lamp_row_y:
            live = r() < 0.36
            fx, fy = place(day, 'lamp_house_side' if y_m < 30 else 'lamp_your_side', x_m, y_m)
            (lights if live else dead).append((fx, fy, M(7.0)))
    for (x_m, y_m) in [(27.0, 9.0), (8.0, 52.0)]:                      # the drums people keep burning
        fx, fy = place(day, 'oil_drum', x_m, y_m)
        lights.append((fx, fy, M(5.0)))
    nb, keep = night(day, lights)
    light_grid = []
    for rr in range(N):
        row = []
        for cc in range(N):
            m_ = keep[rr * PY:(rr + 1) * PY, cc * PX:(cc + 1) * PX]
            row.append('lit' if (m_ > 0.4).mean() >= 0.40 else 'dark')
        light_grid.append(row)
    return nb, grid, light_grid, len(lights), len(dead)


def guard(name, board, light_grid):
    bad = K.colours(board) - B.OK
    if bad: die('%s has %d colours off his banks' % (name, len(bad)))
    seen = set()
    for row in B.cut(board):
        for t in row:
            if t.size != (PX, PY): die('%s tile size %s' % (name, t.size))
            if t.tobytes() in seen: die('%s stamped tile' % name)
            seen.add(t.tobytes())
    if not any('lit' in r for r in light_grid): die('%s: no tile is lit; a night board with no light is a black screen' % name)


def card(results):
    sc = 0.2
    you = F.load(F.SPR['you']).convert('RGBA'); nb = F.load(F.SPR['the_neighbour']).convert('RGBA')
    panels = []
    for name, (board, grid, lg, nl, nd) in results.items():
        b = board.convert('RGBA').resize((int(board.size[0] * sc), int(board.size[1] * sc)), Image.NEAREST)
        for sp, fx, fy in [(you, 0.47, 0.6), (nb, 0.2, 0.55), (nb, 0.76, 0.4)]:
            b.alpha_composite(sp.resize((int(sp.size[0] * 0.8), int(sp.size[1] * 0.8)), Image.NEAREST), (int(b.size[0] * fx), int(b.size[1] * fy)))
        d = ImageDraw.Draw(b); tw, th = b.size[0] / N, b.size[1] / N
        for r in range(N):
            for c in range(N):
                if lg[r][c] == 'lit': d.text((int(c * tw) + 3, int(r * th) + 2), 'L', font=K.font(11), fill=(255, 236, 160))
        panels.append(('%s AT NIGHT  (%d lights still on, %d dead)' % (name.upper().replace('_', ' '), nl, nd), b))
    w, h = panels[0][1].size
    out = Image.new('RGB', (w * 2 + 60, h + 110), (8, 8, 9))
    d = ImageDraw.Draw(out)
    for i, (t, b) in enumerate(panels):
        x = 20 + i * (w + 20)
        d.text((x, 18), t, font=K.font(14), fill=(222, 181, 118)); out.paste(b.convert('RGB'), (x, 50))
    d.text((20, h + 62), 'L = a lit tile: shoot and see as by day.', font=K.font(14), fill=(190, 160, 110))
    d.text((20, h + 84), 'Every other tile is dark: ranged and sight cut (the Battle Brothers night rule, per tile).', font=K.font(14), fill=(190, 160, 110))
    return out


def main():
    results = {'suburb_block': make(R4.suburb, (24.4, 36.0), 131), 'strip_lot': make(R4.strip, (14.4, 46.0), 137)}
    for name, (board, grid, lg, nl, nd) in results.items(): guard(name, board, lg)
    out = dict(version='night-boards-10-1', built='10/1/26', lane='combat 2', row='[floor set] round six (rule 59, night-lit)',
               px_per_metre=K.PPM, tile_px=[PX, PY], grid=[N, N], of_bank=R4.OUT_BANK,
               light_key={'lit': 'as by day', 'dark': 'ranged and vision cut (numbers: TUNING/COMBAT)'}, kinds=[])
    for name, (board, grid, lg, nl, nd) in results.items():
        out['kinds'].append(dict(id=name + '_night', terrain=grid, light=lg, lights_live=nl, lights_dead=nd,
                                 cover_baked=True, tiles=[[F.b64(t) for t in row] for row in B.cut(board)]))
    json.dump(out, open(OUT_BANK, 'w'), indent=1)
    card(results).save(OUT_CARD, optimize=True)
    print('ok: %d night boards -> %s, %s' % (len(results), OUT_BANK, OUT_CARD))


if __name__ == '__main__':
    main()


# ---------------------------------------------------------------------------------------------
# ROUND NINETEEN (10/4, rule 73: NIGHT IS A COLOUR, NOT A DARKNESS; THE GAME IS PLAYABLE IN THE SUN).
# The round-six night above multiplied sRGB by 0.30, which is about 0.07 in linear light: mud on a
# sunlit glass. The floor (records/BOHEMIA_SCHOOL_PLAYABLE_IN_THE_SUN_10_4_26.md): luminance lowered by
# no more than about half (multiplier >= 0.55, in LINEAR light), the walkable ground's median luminance
# >= 0.20 of white, a lit tile against an unlit one >= 3:1, and all of it still true with a flat 25%
# white laid over (the sun test). night_sun() is that night, and sun_measure() reads the four numbers
# off the picture itself.
# ---------------------------------------------------------------------------------------------
def _lin(a): a = a / 255.0; return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)
def _srgb(l): l = np.clip(l, 0, 1); return np.where(l <= 0.0031308, l * 12.92, 1.055 * l ** (1 / 2.4) - 0.055) * 255.0
def _Y(a): l = _lin(a.astype(np.float32)); return 0.2126 * l[..., 0] + 0.7152 * l[..., 1] + 0.0722 * l[..., 2]


NIGHT_MULT = 0.58                      # linear-light multiplier on the unlit ground (floor: >= 0.55)
NIGHT_TINT = np.array([0.86, 0.94, 1.18])   # the colour of the hour: cool, a little blue; luminance kept by the mult


def night_sun(board, lights, pool_lift=5.0, floor=0.235):   # 0.235: the palette snap and the cool tint lose a little; the floor is 0.20 after both
    """Night you can read in the sun: the unlit ground at NIGHT_MULT of its linear luminance and cooled;
       each live light's pool lifted toward warm white in hard rings (pixel art, no blur), so a lit tile
       stands at least 3:1 over the dark around it. Snapped to his palette like round six."""
    a = np.array(board.convert('RGB')).astype(np.float32)
    lin = _lin(a)
    # MEASURED 10/4: our DAY pictures sit at 0.15-0.30 of white (the town 0.149, already under the night
    # floor). So the multiplier is adaptive: as dark as the floor allows and never darker than 0.58; a
    # picture already under the floor gets night as COLOUR only (rule 73's own words).
    day_med = float(np.median(_Y(a)))
    mult = min(1.35, max(NIGHT_MULT, floor / max(day_med, 1e-3)))   # a picture darker than the floor by day is lifted to it (up to 1.35x): the floor binds
    dark = lin * mult * NIGHT_TINT
    H, W = a.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W]
    keep = np.zeros((H, W), np.float32)
    for (x, y, rad) in lights:
        d = np.sqrt((xx - x) ** 2 + ((yy - y) / TILT_R) ** 2) / rad
        keep = np.maximum(keep, np.where(d < 0.45, 1.0, np.where(d < 0.75, 0.75, np.where(d < 1.0, 0.5, 0.0))))
    # the pool lifts until a lit tile stands 3:1 over the dark round it (measured, before the snap), up to 12x
    Yd = 0.2126 * dark[..., 0] + 0.7152 * dark[..., 1] + 0.0722 * dark[..., 2]
    unlit_med = float(np.median(Yd[keep == 0])) if (keep == 0).any() else float(np.median(Yd))
    for lift in (pool_lift, 6.5, 8.0, 10.0, 12.0):
        warm = np.clip(lin * lift * np.array([1.0, 0.92, 0.72]), 0, 1)
        Yw = 0.2126 * warm[..., 0] + 0.7152 * warm[..., 1] + 0.0722 * warm[..., 2]
        lit = Yw[keep >= 0.75]
        if not lit.size or (float(np.median(lit)) + 0.05) / (unlit_med + 0.05) >= 3.3: break
    out = dark * (1 - keep[..., None]) + warm * keep[..., None]
    return Image.fromarray(snap(np.clip(_srgb(out), 0, 255))), keep


def sun_measure(img, keep):
    """The four numbers of rule 73, read off the picture, plain and with a flat 25% white over it."""
    res = {}
    for tag, glare in (('plain', 0.0), ('sun', 0.25)):
        a = np.array(img.convert('RGB')).astype(np.float32)
        a = a + (255 - a) * glare
        Y = _Y(a)
        unlit, lit = Y[keep == 0], Y[keep >= 0.75]
        med_u = float(np.median(unlit)) if unlit.size else 0.0
        med_l = float(np.median(lit)) if lit.size else 0.0
        res[tag] = dict(ground_median=round(float(np.median(Y)), 3), unlit_median=round(med_u, 3),
                        lit_median=round(med_l, 3), lit_vs_unlit=round((med_l + 0.05) / (med_u + 0.05), 2))
    return res
