#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the beast in eight]: THE BAKE. From DIRECTION's rig render of the dire wolf (eight facings,
idle 12, step 6, bite 6; records/target/master_rig/dire_wolf/rig.json) to the thing he can watch:
  * slices/vote/ANIMATION_THE_BEAST_IN_EIGHT.webp (lossless): one row per facing, 24 cells (idle, step, bite), and
    a last row with the game's own wolf today (engine/bohemia_quadruped.js, SE only: it never had eight), plus the
    .json frame table the VOTE page reads (cell size, the ground pixel per row, the clip columns, the beats).
  * records/target/master_rig/ANIMATION_THE_BEAST_IN_EIGHT.png: the proof sheet at 1:1: the eight stills beside the
    1.72 m ruler, the pack's own grey wolf (from the index thumbnail: the tile is not in the repo, 0 of 13 approved)
    and the game's wolf; then every facing's idle, step and bite strips.
THE PALETTE: the rig keeps the render's colours for a family with no measured palette (--family none; the packs hold
no beast palette). The pack's animals are drawn in a handful of colours a tile, so every frame is reduced to ONE
16-colour palette measured from the wolf's own frames (median cut, no dither, the way Aseprite's indexed mode does
it), the outer ring kept one pixel and the darkest of the sixteen (THE BORDER IS ONE PIXEL). A palette reduction is
not a drawn pixel (rule 108: the pixels come from the render); the palette is written beside the sheet as a .gpl so a
later measured one can replace it.
REFERENCE CHECK (the 9/4 standing duty): the sheet puts the wolf at 1:1 beside the 1.72 m ruler, the pack's grey wolf (the index thumbnail; the tile is not in the repo) and the game's own wolf, so the size question and the look question are on the page, not in a sentence. No reference game.
Usage: python3 tools/bohemia_animation_the_beast_in_eight_bake.py [rig dir] [game wolf dir] [--name STEM] [--beside dir:label ...]
  --name the output stem under slices/vote (default ANIMATION_THE_BEAST_IN_EIGHT); --beside adds that rig's eight stills as
  a row on the proof sheet (the wolf redone, 10/18, sits beside the fox he named and the grey one he said NO to).
"""
import os, sys, json, glob
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_args, NAME, BESIDE = [], 'ANIMATION_THE_BEAST_IN_EIGHT', []
_it = iter(sys.argv[1:])
for _a in _it:
    if _a == '--name': NAME = next(_it)
    elif _a == '--beside': BESIDE.append(next(_it).split(':', 1))
    else: _args.append(_a)
D = _args[0] if len(_args) > 0 else os.path.join(ROOT, 'records/target/master_rig/dire_wolf')
GW = _args[1] if len(_args) > 1 else os.path.join(ROOT, 'records/target/master_rig/game_wolf')
OUT_WEBP = os.path.join(ROOT, 'slices/vote/%s.webp' % NAME)
OUT_JSON = os.path.join(ROOT, 'slices/vote/%s.json' % NAME)
OUT_PACK = os.path.join(ROOT, 'slices/vote/%s_PACK.png' % NAME)
OUT_SHEET = os.path.join(ROOT, 'records/target/master_rig/%s.png' % NAME)
OUT_GPL = os.path.join(D, 'palette_16.gpl')
CLIPS = [('idle', 'Survey', 12, 4), ('step', 'Walk', 6, 2), ('bite', 'Bite', 6, 2)]   # (name on the page, the clip in the rig, keys, beats)
COLOURS = 16

meta = json.load(open(os.path.join(D, 'rig.json')))
FACINGS = meta['facings']
op = lambda f: Image.open(os.path.join(ROOT, f)).convert('RGBA')


def frames_of(clip, facing):
    c = meta['clips'][clip]; i = FACINGS.index(facing); k = c['keys']
    return [op(f) for f in c['files'][i * k:(i + 1) * k]]


# 1. every wolf frame, and ONE palette from all of them
all_frames = {(f, clip): frames_of(clip, f) for f in FACINGS for _, clip, _, _ in CLIPS}
stills = [op(f) for f in meta['files']]
opaque = np.concatenate([np.asarray(im)[np.asarray(im)[..., 3] > 0][:, :3] for ims in all_frames.values() for im in ims])
pal_img = Image.fromarray(opaque.reshape(1, -1, 3).astype(np.uint8), 'RGB').quantize(colors=COLOURS, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
pal = np.array(pal_img.getpalette()[:COLOURS * 3]).reshape(-1, 3)
darkest = int(np.argmin(pal.sum(1)))
before_colours = len(set(map(tuple, opaque.tolist())))


def snap(im):
    a = np.asarray(im).copy(); alpha = a[..., 3] > 0
    q = Image.fromarray(a[..., :3], 'RGB').quantize(palette=pal_img, dither=Image.Dither.NONE)
    idx = np.asarray(q)
    rgb = pal[idx]
    p = np.pad(alpha, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    ring = alpha & ~inner
    rgb[ring] = pal[darkest]
    out = np.dstack([rgb, np.where(alpha, 255, 0)]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


snapped = {k: [snap(im) for im in ims] for k, ims in all_frames.items()}
stills_s = [snap(im) for im in stills]
after_colours = len(set(map(tuple, np.concatenate([np.asarray(im)[np.asarray(im)[..., 3] > 0][:, :3] for ims in snapped.values() for im in ims]).tolist())))

# 2. the sprite sheet: cell = the rig's one crop box (every frame already shares it) or the game wolf's 112
W, H = stills[0].size
gw = {clip: [Image.open(f).convert('RGBA') for f in sorted(glob.glob(os.path.join(GW, 'wolf_%s_SE_k*.png' % clip)))] for clip in ('idle', 'walk')}
CW, CH = max(W, 112), max(H, 112)
cols = sum(k for _, _, k, _ in CLIPS)
rows = len(FACINGS) + 1
sheet = Image.new('RGBA', (CW * cols, CH * rows), (0, 0, 0, 0))
for r, f in enumerate(FACINGS):
    x = 0
    for name, clip, k, beats in CLIPS:
        for im in snapped[(f, clip)]:
            sheet.paste(im, (x * CW, r * CH), im); x += 1
x = 0
for clip in ('idle', 'walk'):
    for im in gw[clip]:
        sheet.paste(im, (x * CW, (rows - 1) * CH), im); x += 1
os.makedirs(os.path.dirname(OUT_WEBP), exist_ok=True)
sheet.save(OUT_WEBP, lossless=True, quality=100, method=6)
gx, gy = meta['ground_px']
table = dict(cell=[CW, CH], facings=FACINGS, rows={f: r for r, f in enumerate(FACINGS)}, ground_y=int(gy), ground_x=int(gx),
             clips=[dict(name=n, rig_clip=c, col=sum(k2 for _, _, k2, _ in CLIPS[:i]), keys=k, beats=b) for i, (n, c, k, b) in enumerate(CLIPS)],
             game_wolf=dict(row=rows - 1, ground_y=102, clips=[dict(name='idle', col=0, keys=len(gw['idle']), beats=4), dict(name='step', col=len(gw['idle']), keys=len(gw['walk']), beats=2)]),
             bpm=meta['bpm'], keys_per_beat=meta['keys_per_beat'], ppm=meta['ppm'], real_length_m=meta['real_dims_m'][1], model=meta['model'],
             palette=COLOURS, colours_before=before_colours, colours_after=after_colours, sprite_px=[W, H])
json.dump(table, open(OUT_JSON, 'w'), indent=1)
open(OUT_JSON.replace('.json', '_TABLE.js'), 'w').write('window.BEAST_TABLE = ' + json.dumps(table) + ';\n')   # the page reads it as a script: fetch() is refused on file:// where the gates film it
with open(OUT_GPL, 'w') as g:
    g.write('GIMP Palette\nName: dire wolf, 16 from the wolf\'s own frames (median cut), not yet measured from a pack\n#\n')
    for c in pal: g.write('%3d %3d %3d\n' % tuple(c))

# 3. the pack's wolf, from the index thumbnail (the tile is not in the repo)
pack = Image.open(os.path.join(ROOT, 'reference/art_bank_index/sheets/19__Animals_and_creatures.jpg')).convert('RGBA').crop((2, 14, 52, 110))
pack.save(OUT_PACK)

# 4. the proof sheet at 1:1
F = ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf'), 16)
INK, DIM, ORANGE, GREEN, BG = (236, 230, 218), (146, 138, 126), (226, 162, 72), (150, 190, 160), (22, 21, 20)
MAN = 98
rrows = [('THE DIRE WOLF, EIGHT FACINGS, STILL (%s)' % ('the walk\'s passing pose' if meta.get('still_frame') else 'the idle\'s first key') + ', 16 colours; the 1.72 m man; the pack\'s wolf (index thumbnail, 96 tall); the game\'s wolf today',
          [(f, im) for f, im in zip(FACINGS, stills_s)] + [('1.72 m', Image.new('RGBA', (7, MAN), GREEN + (255,))), ('', Image.new('RGBA', (50, 1), (0, 0, 0, 0))), ('the pack', pack), ('', Image.new('RGBA', (30, 1), (0, 0, 0, 0))), ('today', gw['walk'][0])])]
for bdir, blabel in BESIDE:
    bm = json.load(open(os.path.join(ROOT, bdir, 'rig.json')))
    rrows.append((blabel, [(f, op(fp)) for f, fp in zip(bm['facings'], bm['files'])]))
for f in FACINGS:
    for name, clip, k, beats in CLIPS:
        rrows.append(('%s  %s: %d drawn keys = %d beats at 120 (nothing between two keys is rendered)' % (f, name.upper(), k, beats), [('k%d' % j, im) for j, im in enumerate(snapped[(f, clip)])]))
GAP, PAD, HEAD = 8, 14, 24
def row_size(items): return sum(im.width for _, im in items) + GAP * (len(items) + 1), max(im.height for _, im in items) + HEAD + 20
SW = max(row_size(it)[0] for _, it in rrows) + PAD * 2
SH = 66 + sum(row_size(it)[1] + 8 for _, it in rrows)
s = Image.new('RGB', (SW, SH), BG); d = ImageDraw.Draw(s)
d.text((PAD, 6), '%s (ANIMATION, PLACEHOLDER): THE DIRE WOLF THROUGH DIRECTION\'S RIG, IDLE, STEP AND BITE, N NE E SE S SW W NW, 1:1' % NAME.replace('ANIMATION_', '').replace('_', ' '), font=F, fill=INK)
d.text((PAD, 26), 'model %s at %.1f m nose to tail, %d px a metre, the one camera; %d render colours -> %d in one 16-colour palette; sprite %dx%d px' % (
    os.path.basename(meta['model']), meta['real_dims_m'][1], meta['ppm'], before_colours, after_colours, W, H), font=F, fill=DIM)
y = 50
for title, items in rrows:
    rw, rh = row_size(items); base = y + rh - 20
    d.text((PAD, y + 2), title, font=F, fill=ORANGE if title.startswith('THE DIRE') else GREEN)
    x = PAD + GAP
    for label, im in items:
        s.paste(im, (x, base - im.height), im); d.text((x, base + 2), label, font=F, fill=DIM); x += im.width + GAP
    y += rh + 8
s.save(OUT_SHEET)
print(json.dumps(dict(webp=os.path.relpath(OUT_WEBP, ROOT), sheet=os.path.relpath(OUT_SHEET, ROOT), cell=[CW, CH], sprite=[W, H], colours=[before_colours, after_colours], rows=rows, cols=cols)))
