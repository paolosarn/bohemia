#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the reference twin]: the twin sheets, ours beside the thing it should look like, at the same
pixels, three differences measured and named, and the one change that closes most of the gap (rule 82; rule 82a: for
tiles, props, cars and streets the twin IS his approved pack tile, sampled into reference/art_bank/ by
tools/bohemia_direction_art_bank.py). Round one: THE GROUND families, his pain order (rule 87: ground, people, places,
map): the road, the props, the fight board.

REFERENCE CHECK (the 9/4 standing duty): the compare law (laws/BOHEMIA_LAW_COMPARE_EVERY_PIECE_OF_ART_TO_THE_WORLD_9_4_26.md),
the approved asset index (the 7/27 shopping law), AH-01 and AH-03. The pack is the ruler here; no reference game.

usage: python3 tools/bohemia_direction_twin_sheets.py <our fight board screenshot (phone, 3x)> <out.png>
"""
import sys, os, json, glob, base64, io
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOARD, OUT = sys.argv[1], sys.argv[2]
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BANK = os.path.join(ROOT, 'reference/art_bank')
BG, INK, GOOD, BAD, DIM, TWIN = (13, 13, 18), (232, 224, 204), (199, 154, 63), (214, 110, 110), (150, 142, 128), (150, 190, 160)


def stats(im):
    """the four numbers a painter reads first, on the opaque pixels"""
    a = np.asarray(im.convert('RGBA')).astype(float); op = a[..., 3] > 8; rgb = a[..., :3]
    L = rgb @ [0.299, 0.587, 0.114]
    mx = rgb.max(-1); mn = rgb.min(-1); sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1), 0)
    gx = np.zeros_like(L); gx[:, 1:] = np.abs(np.diff(L, axis=1)); gy = np.zeros_like(L); gy[1:, :] = np.abs(np.diff(L, axis=0))
    edge = np.maximum(gx, gy)
    cols = len(np.unique(rgb[op].astype(int), axis=0))
    return dict(col_kpx=round(cols / max(op.sum() / 1000, 1e-6), 1),
                value_range=int(np.percentile(L[op], 95) - np.percentile(L[op], 5)),
                dark_line=round(float(((L < 45) & (edge > 30) & op).sum() / max(op.sum(), 1)), 3),
                detail=round(float(edge[op].mean()), 1), sat=round(float(sat[op].mean()), 2))


def grid(ims, cols, cell, bg=(30, 30, 34)):
    rows = (len(ims) + cols - 1) // cols
    s = Image.new('RGBA', (cols * cell, rows * cell), bg + (255,))
    for i, im in enumerate(ims):
        im = im.convert('RGBA'); im.thumbnail((cell - 4, cell - 4), Image.NEAREST)
        s.paste(im, ((i % cols) * cell + (cell - im.width) // 2, (i // cols) * cell + (cell - im.height) // 2), im)
    return s


bank = lambda fam, pref=None: [Image.open(f) for f in sorted(glob.glob(os.path.join(BANK, fam, 'pack_*.png'))) if not pref or os.path.basename(f).startswith(pref)]
kit = json.load(open(os.path.join(ROOT, 'banks/BOHEMIA_THE_BLOCK_WAR_KIT_9_30_26.txt')))['pieces']
kitim = lambda name: Image.open(io.BytesIO(base64.b64decode([p for p in kit if p['name'] == name][0]['b64'])))

# ROAD: ours = a 192 px stretch of the street block at its own pixels; twin = his approved cracked street/concrete tiles
corner = Image.open(os.path.join(ROOT, 'slices/fight_ground/block_corner_0.webp')).convert('RGB')
our_road = corner.crop((560, 820, 752, 1012))                   # plain carriageway west of the crossing, at 42.9 px/m
twin_road = grid(bank('road'), 4, 96)
# PROPS: ours = the fight's own cover pieces and COOK's kit; twin = his approved cars, bins, signs, barricades
ours_props = [Image.open(os.path.join(ROOT, 'slices/fight_ground/cover_jersey.webp')), Image.open(os.path.join(ROOT, 'slices/fight_ground/cover_trailer.webp'))]
for n in [p['name'] for p in kit][:6]:
    try: ours_props.append(kitim(n))
    except Exception: pass
our_props = grid(ours_props, 4, 96); twin_props = grid(bank('prop'), 6, 96)
# THE BOARD: ours = the fight as he sees it on a 3x phone (a 390 x 300 css crop); twin = the same area laid from pack tiles
board = Image.open(BOARD).convert('RGB'); our_board = board.crop((0, 600, 1170, 1500))
road = bank('road', 'pack_1_cracked_street'); props = bank('prop')
twin_board = Image.new('RGB', our_board.size, (40, 38, 34))
for y in range(0, twin_board.height, 96):
    for x in range(0, twin_board.width, 96):
        t = road[((x // 96) + (y // 96) * 3) % len(road)].convert('RGBA'); twin_board.paste(t, (x, y), t)
for k, (x, y) in enumerate([(120, 160), (560, 420), (880, 120), (300, 640), (760, 700)]):
    p = props[k % len(props)].convert('RGBA'); p = p.resize((p.width * 2, p.height * 2), Image.NEAREST); twin_board.paste(p, (x, y), p)

ROWS = [('THE ROAD', our_road, twin_road,
         ['ours is one flat stamp of grey speckle; theirs is slabs, cracks and seams you could step over',
          'ours has no dark line anywhere; every pack tile is drawn with a dark edge and a lit edge',
          'ours repeats the same square; no two of theirs are alike (a weed, a pothole, a patch)'],
         'cut the road from his cracked street tiles, placed and flipped, never stamped from one texture'),
        ('THE PROPS', our_props, twin_props,
         ['ours are flat blocks of 3 to 4 colours; theirs are painted objects with rust, dents and a shine',
          'ours have no outline; theirs sit on the ground inside a dark line with a shadow under them',
          'ours are generic shapes (a bar, a box); theirs are THINGS: a taxi, a dumpster, a stop sign'],
         'take the cars, bins, signs and barricades from the pack he already approved; cook only what it lacks'),
        ('THE FIGHT BOARD', our_board, twin_board,
         ['on the glass ours reads soft and flat; the pack laid at the same size reads sharp and busy',
          'ours is three tones (road, sand, roof); the pack ground carries cracks, grime and weeds in every tile',
          'ours looks drawn by a program; the pack looks painted by a hand, which is the whole of his complaint'],
         'lay the board from the pack tiles at their own pixels, then dress it: COMBAT TWO [the boards from the packs]')]

F_T, F_L, F_S = ImageFont.truetype(ROM, 26), ImageFont.truetype(ROM, 18), ImageFont.truetype(ROM, 15)
PW = 560; m_all = {}
blocks = []
for title, ours, twin, diffs, change in ROWS:
    a = ours.convert('RGB'); b = twin.convert('RGB')
    sa, sb = stats(ours), stats(twin); m_all[title] = {'ours': sa, 'twin': sb}
    sc = PW / max(a.width, b.width)
    a = a.resize((int(a.width * sc), int(a.height * sc)), Image.NEAREST); b = b.resize((int(b.width * sc), int(b.height * sc)), Image.NEAREST)
    blocks.append((title, a, b, sa, sb, diffs, change))
H = 30 + 50 + sum(46 + max(a.height, b.height) + 52 + 26 * 4 + 40 for _, a, b, *_ in blocks) + 20
W = 30 + 2 * PW + 40 + 30
sheet = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sheet)
d.text((30, 24), 'THE TWIN: THE GROUND. OURS LEFT, HIS PACK RIGHT', font=F_T, fill=INK)
y = 80
for title, a, b, sa, sb, diffs, change in blocks:
    d.text((30, y), title, font=F_L, fill=GOOD); d.text((30 + PW + 40, y), 'HIS PACK (the twin)', font=F_L, fill=TWIN); y += 34
    sheet.paste(a, (30, y)); sheet.paste(b, (30 + PW + 40, y)); y += max(a.height, b.height) + 10
    d.text((30, y), 'colours/1000px %.1f  detail %.1f  value range %d' % (sa['col_kpx'], sa['detail'], sa['value_range']), font=F_S, fill=DIM)
    d.text((30 + PW + 40, y), 'colours/1000px %.1f  detail %.1f  value range %d' % (sb['col_kpx'], sb['detail'], sb['value_range']), font=F_S, fill=DIM)
    y += 36
    for i, t in enumerate(diffs): d.text((30, y), '%d  %s' % (i + 1, t), font=F_S, fill=BAD); y += 26
    d.text((30, y), 'THE ONE CHANGE: ' + change, font=F_S, fill=GOOD); y += 26 + 40
sheet.save(OUT)
json.dump(m_all, open(OUT.replace('.png', '.json'), 'w'), indent=1)
print(json.dumps(m_all))
