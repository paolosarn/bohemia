#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the moodboard and the taste session], part (b): THE TASTE SESSION. Twenty pairs, each one
scene laid from his own purchased tiles (reference/art_bank, the material, rule 108 ROUND ELEVEN: use the packs, do
not imitate them) shown twice with ONE choice changed between the two: outline weight, colour count, light hardness,
grit, how broken, saturation, how dark, warmth (rule 108 ROUND TWELVE (5): 'twenty pairs, each pair separating one
choice that matters'). Nothing is drawn: the scenes are his tiles placed, and the change is one measured operation on
that one variable, so his tap is about the variable and nothing else. His twenty taps become twenty rules in the skill
file the round they land.

The VOTE tab asks thumbs up or down, so a pair reads THUMBS UP = LEFT, THUMBS DOWN = RIGHT. Which side carries the
change is seeded (not always the right), so a lean toward one side cannot pass for a taste; the answer key is in the
JSON beside the pictures.

Each pair is 1080 px wide so it lands at one art pixel to one phone pixel on his phone (rule 89).

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (his 7/13 UP set in reference/art_bank), AH-01 (R4 the light was in the room, R10 grime baked)
and AH-03; the card of numbers (records/BOHEMIA_THE_CARD_OF_NUMBERS_10_10_26.md) sets each pair's base. No reference game.

usage: python3 tools/bohemia_direction_taste_session.py
out:   records/target/taste/DIRECTION_TASTE_01.webp .. _20.webp (lossless, every pixel exact) and records/target/taste/DIRECTION_TASTE_KEY.json
"""
import os, json, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'reference/art_bank')
OUT = os.path.join(ROOT, 'records/target/taste')
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
SW, SH = 528, 384                                   # one scene; two plus a gap make 1080 wide
P = lambda fam, name, i: os.path.join(BANK, fam, '%s_%03d.png' % (name, i))
img = lambda f: Image.open(f).convert('RGBA')

STREET = ('road', 'pack_1_cracked_street_tiles'); SOIL = ('road', 'pack_2_soil_and_dirt_tiles')
CAR = ('prop', 'pack_10_abandoned_cars'); SP = ('prop', 'pack_15_street_props'); BAR = ('prop', 'pack_3_barricades_and_blockades')
RUB = ('settlement', 'pack_9_rubble_and_debris'); ROOF = ('settlement', 'pack_5_roof_tiles')
LAMP = ('lamp', 'pack_18_light_sources_and_fire_barrels'); TRASH = ('prop', 'pack_7_trash_and_debris')
BURNT = sorted(f for f in os.listdir(os.path.join(BANK, 'ground')) if f.startswith('pack_7_burnt_ground_tiles'))

SCENES = {   # ground tiles (family, indices, a lane row), then objects (family, index, x, y)
    'street': dict(ground=(STREET, [0, 1, 2, 3, 4, 5, 6, 7, 8, 26, 27, 28, 29, 30]), lane=(STREET, [18, 19, 20, 21], 1),
                   objs=[(CAR, 3, 40, 150), (CAR, 16, 330, 40), (LAMP, 1, 250, 230), (SP, 0, 440, 250), (BAR, 4, 120, 290),
                         (SP, 9, 400, 150), (TRASH, 0, 20, 30)],
                   broken=[(CAR, 11, 180, 150), (RUB, 2, 300, 250), (TRASH, 3, 410, 60), (RUB, 9, 60, 300)]),
    'yard': dict(ground=(SOIL, [0, 1]), lane=None,
                 objs=[(ROOF, 30, 40, 20), (ROOF, 32, 300, 10), (LAMP, 24, 230, 200), (BAR, 5, 60, 260), (SP, 24, 380, 250),
                       (BAR, 19, 420, 160)],
                 broken=[(RUB, 0, 170, 120), (RUB, 5, 330, 280), (TRASH, 6, 120, 200), (TRASH, 12, 420, 300)]),
    'ruin': dict(ground=(STREET, [26, 27, 28, 29, 30, 31, 32, 33]), lane=None,
                 objs=[(RUB, 0, 30, 40), (RUB, 9, 360, 30), (BAR, 0, 180, 200), (BAR, 14, 400, 220), (CAR, 11, 40, 230),
                       (LAMP, 40, 270, 90)],
                 broken=[(RUB, 5, 200, 30), (RUB, 12, 300, 300), (TRASH, 9, 120, 160), (TRASH, 14, 470, 120)]),
}


def cut(t):
    """rule 104b, no borders: his floor tiles carry a baked dark frame (and transparent corners); cut each side until
       the row or column is the tile's own surface, measured per tile, so laid edge to edge no grid shows"""
    a = np.asarray(t).astype(float); L = a[..., :3] @ [0.299, 0.587, 0.114]; op = a[..., 3] > 200
    med = np.median(L[op]); good = lambda v, o: o.mean() > 0.85 and v[o].mean() > 0.72 * med
    t0, b0, l0, r0 = 0, L.shape[0], 0, L.shape[1]
    while t0 < 12 and not good(L[t0], op[t0]): t0 += 1
    while b0 > L.shape[0] - 12 and not good(L[b0 - 1], op[b0 - 1]): b0 -= 1
    while l0 < 12 and not good(L[:, l0], op[:, l0]): l0 += 1
    while r0 > L.shape[1] - 12 and not good(L[:, r0 - 1], op[:, r0 - 1]): r0 -= 1
    return t.crop((l0 + 1, t0 + 1, r0 - 1, b0 - 1))   # and the frame's one lit inner pixel


def ground(sc, rng):
    """his floor tiles, frames cut, laid edge to edge at the smallest cut size among them, never scaled"""
    (fam, name), idx = sc['ground']
    T = {i: cut(img(P(fam, name, i))) for i in idx}
    base = tuple(int(v) for v in np.median(np.concatenate([np.asarray(t)[np.asarray(t)[..., 3] > 200][:, :3] for t in T.values()]), 0))
    g = Image.new('RGBA', (SW, SH), base + (255,))   # under his tiles' own ragged alpha: their own median, never black
    pitch = min(min(t.size) for t in T.values())
    for y in range(0, SH, pitch):
        for x in range(0, SW, pitch):
            g.alpha_composite(T[rng.choice(idx)].crop((0, 0, pitch, pitch)), (x, y))
    if sc['lane']:
        (fam, name), lidx, row = sc['lane']
        L = [cut(img(P(fam, name, i))) for i in lidx]; lp = min(min(t.size) for t in L)
        for x in range(0, SW, lp):
            g.alpha_composite(L[(x // lp) % len(L)].crop((0, 0, lp, lp)), (x, row * pitch + pitch // 2))
    return g


def render(name, outline=0, colours=None, shadow='soft', grit=0.0, broken=False, sat=1.0, value=1.0, warm=0.0, seed=7):
    """one scene from his tiles with one variable set; every default is the pack's own manner (the card)"""
    sc = SCENES[name]; rng = random.Random(seed)
    g = ground(sc, rng)
    if grit > 0:   # grime baked in (R10): stains where water and oil sat, from his burnt ground, and his small debris
        stain = np.zeros((SH, SW)); yy, xx = np.mgrid[0:SH, 0:SW]
        for _ in range(int(14 * grit)):
            cx, cy, r = rng.uniform(0, SW), rng.uniform(0, SH), rng.uniform(14, 46)
            stain = np.maximum(stain, np.clip(1 - np.hypot((xx - cx) / r, (yy - cy) / (r * 0.6)), 0, 1))
        b = Image.new('L', (SW, SH))
        for y in range(0, SH, 96):
            for x in range(0, SW, 96):
                b.paste(img(os.path.join(BANK, 'ground', rng.choice(BURNT))).convert('L').resize((96, 96), Image.NEAREST), (x, y))
        tex = np.asarray(b).astype(float) / 255.0
        a = np.asarray(g).astype(float); k = (stain * (0.55 + 0.45 * tex) * 0.55)[..., None]
        a[..., :3] = a[..., :3] * (1 - k) + np.array([34, 28, 20]) * k
        g = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')
        for _ in range(int(6 * grit)):
            t = img(P(TRASH[0], TRASH[1], rng.choice([7, 8, 9, 10, 11, 13])))
            g.alpha_composite(t, (int(rng.uniform(0, SW - t.width)), int(rng.uniform(0, SH - t.height))))
    objs = list(sc['objs']) + (list(sc['broken']) if broken else [])
    if broken and name == 'street': objs = [o for o in objs if not (o[0] == CAR and o[1] == 3)]
    layer = Image.new('RGBA', (SW, SH), (0, 0, 0, 0))
    for (fam, nm), i, x, y in objs: layer.alpha_composite(img(P(fam, nm, i)), (x, y))
    A = np.asarray(layer)[..., 3] > 127
    if shadow != 'none':   # light from the top-left (the card): the shadow sits down-right of its object
        sh = Image.fromarray((A * 255).astype(np.uint8), 'L').transform((SW, SH), Image.AFFINE, (1, 0, -7, 0, 1, -6))
        if shadow == 'soft': sh = sh.filter(ImageFilter.GaussianBlur(4))
        dark = Image.new('RGBA', (SW, SH), (10, 8, 6, 0)); dark.putalpha(sh.point(lambda v: int(v * (0.5 if shadow == 'soft' else 0.62))))
        g.alpha_composite(dark)
    if outline:
        m = Image.fromarray((A * 255).astype(np.uint8), 'L').filter(ImageFilter.MaxFilter(2 * outline + 1))
        ring = (np.asarray(m) > 127) & ~A
        o = np.zeros((SH, SW, 4), np.uint8); o[ring] = (38, 26, 18, 255)
        g.alpha_composite(Image.fromarray(o, 'RGBA'))
    g.alpha_composite(layer)
    out = g.convert('RGB')
    if sat != 1.0: out = ImageEnhance.Color(out).enhance(sat)
    if value != 1.0: out = Image.fromarray(np.clip(np.asarray(out).astype(float) * value, 0, 255).astype(np.uint8))
    if warm:
        a = np.asarray(out).astype(float); a[..., 0] *= 1 + warm; a[..., 2] *= 1 - warm
        out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    if colours: out = out.quantize(colors=colours, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
    return out


PAIRS = [  # scene, the one question, the two settings (name, kwargs) -- the first is the card's default where one exists
    ('street', 'A LINE ROUND THINGS?', ('no line, the pack as bought', {}), ('a 1-pixel dark line round every object', {'outline': 1})),
    ('yard', 'HOW THICK A LINE?', ('a 1-pixel line', {'outline': 1}), ('a 2-pixel line', {'outline': 2})),
    ('ruin', 'A LINE ROUND THE RUIN?', ('no line', {}), ('a 1-pixel dark line', {'outline': 1})),
    ('street', 'HOW MANY COLOURS?', ('every colour the pack has', {}), ('cut to 24 colours', {'colours': 24})),
    ('yard', 'HOW MANY COLOURS?', ('every colour', {}), ('cut to 64 colours', {'colours': 64})),
    ('ruin', 'HOW MANY COLOURS?', ('64 colours', {'colours': 64}), ('16 colours', {'colours': 16})),
    ('street', 'SOFT OR HARD SHADOWS?', ('soft shadows', {}), ('hard shadows', {'shadow': 'hard'})),
    ('yard', 'SHADOWS OR NONE?', ('no shadows', {'shadow': 'none'}), ('hard shadows', {'shadow': 'hard'})),
    ('ruin', 'SOFT OR HARD SHADOWS?', ('soft shadows', {}), ('hard shadows', {'shadow': 'hard'})),
    ('street', 'HOW DIRTY?', ('clean, as bought', {}), ('grime baked into the ground', {'grit': 0.6})),
    ('yard', 'HOW DIRTY?', ('a little grime', {'grit': 0.3}), ('heavy grime', {'grit': 0.8})),
    ('ruin', 'HOW DIRTY?', ('clean', {}), ('heavy grime', {'grit': 0.8})),
    ('street', 'HOW BROKEN?', ('a street still in use', {}), ('wrecked: rubble, trash, a burnt car', {'broken': True})),
    ('yard', 'HOW BROKEN?', ('a yard kept tidy', {}), ('a yard falling apart', {'broken': True})),
    ('street', 'HOW STRONG THE COLOUR?', ('the pack\'s colour', {}), ('the colour at 55%', {'sat': 0.55})),
    ('yard', 'HOW STRONG THE COLOUR?', ('the pack\'s colour', {}), ('the colour at 60%', {'sat': 0.6})),
    ('ruin', 'HOW STRONG THE COLOUR?', ('the colour at 80%', {'sat': 0.8}), ('the colour at 45%', {'sat': 0.45})),
    ('street', 'HOW DARK?', ('as bright as the pack', {}), ('70% as bright', {'value': 0.7})),
    ('yard', 'HOW DARK?', ('as bright as the pack', {}), ('60% as bright', {'value': 0.6})),
    ('ruin', 'WARM OR COLD LIGHT?', ('warm, a desert afternoon', {'warm': 0.08}), ('cold, a grey dawn', {'warm': -0.08})),
]


def main():
    os.makedirs(OUT, exist_ok=True)
    F_Q, F_L = ImageFont.truetype(ROM, 26), ImageFont.truetype(ROM, 20)
    flip = random.Random(20261011); key = []
    for n, (scene, q, a, b) in enumerate(PAIRS, 1):
        left, right = (a, b) if flip.random() < 0.5 else (b, a)
        L, R = render(scene, **left[1]), render(scene, **right[1])
        sheet = Image.new('RGB', (1080, 64 + SH + 44), (14, 13, 12)); d = ImageDraw.Draw(sheet)
        d.text((12, 16), '%d OF 20  %s' % (n, q), font=F_Q, fill=(236, 230, 218))
        sheet.paste(L, (0, 64)); sheet.paste(R, (SW + 24, 64))
        d.text((12, 64 + SH + 10), 'UP: ' + left[0], font=F_L, fill=(226, 162, 72))
        d.text((SW + 36, 64 + SH + 10), 'DOWN: ' + right[0], font=F_L, fill=(150, 190, 160))
        f = os.path.join(OUT, 'DIRECTION_TASTE_%02d.webp' % n); sheet.save(f, lossless=True, method=6)
        key.append(dict(n=n, scene=scene, question=q, up=dict(label=left[0], set=left[1]), down=dict(label=right[0], set=right[1]),
                        file=os.path.relpath(f, ROOT)))
        print(n, q, '| UP', left[0], '| DOWN', right[0])
    json.dump(dict(session='THE TASTE SESSION', lane='direction', date='10/11/26', rule='108 ROUND TWELVE (5)',
                   read='thumbs up = the left picture, thumbs down = the right; one variable changes per pair',
                   pairs=key), open(os.path.join(OUT, 'DIRECTION_TASTE_KEY.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
