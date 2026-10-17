#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the master rig]: the proof sheet. Everything tools/bohemia_direction_master_rig.py rendered for
one model at one art pixel to one: the eight facings, every clip as a strip per facing (the drawn keys only), and the
portrait heads, beside the twin that is on disk: a 1.72 m man as a 98 px ruler (CHARACTER's measurement), his own car
for a vehicle, and the game's own dire wolf (engine/bohemia_quadruped.js, ANIMATION [four legs], the placeholder a
beast replaces) for a beast. So the true-size question and the beat question are on the page, not in a sentence.
ROUND THREE: --before <dir of round two's rig_*.png> puts last round's stills over this round's, so the look at the
source is a before-and-after on the page; the card's eight rows from rig.json are printed under the S still (the
numbers beside the picture, rule 90 round 8); the portrait's expressions make their own row (the face performs).

REFERENCE CHECK (the 9/4 standing duty): the compare law, the approved asset index, the card of numbers,
skills/bohemia-pixel-art, AH-01, AH-03. No reference game.

usage: python3 tools/bohemia_direction_master_rig_sheet.py <rig out dir> <sheet.png> [--wolf <dir of wolf_*.png>] [--car] [--before <dir>] [--title <text>]
"""
import os, sys, json, glob
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D, OUT = sys.argv[1], sys.argv[2]
opt = lambda k: sys.argv[sys.argv.index(k) + 1] if k in sys.argv else None
WOLF, BEFORE, TITLE = opt('--wolf'), opt('--before'), opt('--title')
CAR = '--car' in sys.argv
meta = json.load(open(os.path.join(D, 'rig.json')))
F = ImageFont.truetype(os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf'), 16)
INK, DIM, ORANGE, GREEN, RED, BG = (236, 230, 218), (146, 138, 126), (226, 162, 72), (150, 190, 160), (220, 110, 90), (22, 21, 20)
op = lambda f: Image.open(os.path.join(ROOT, f)).convert('RGBA')
MAN = 98

rows = []   # (title, [(label, image)], colour)
if BEFORE:
    b = [(f, Image.open(os.path.join(BEFORE, 'rig_%s.png' % f)).convert('RGBA')) for f in meta['facings'] if os.path.exists(os.path.join(BEFORE, 'rig_%s.png' % f))]
    if b: rows.append(('BEFORE: ROUND TWO\'S STILLS (the render as it came, a clean toy)', b, DIM))
rows.append(('THE EIGHT FACINGS, STILL (%s)%s' % (meta.get('still', 'frame %s' % meta.get('still_frame', 0)), ' -- AFTER: THE LOOK AT THE SOURCE' if BEFORE else ''),
             [(f, op(fn)) for f, fn in zip(meta['facings'], meta['files'])], ORANGE))
for name, c in meta.get('clips', {}).items():
    per = c['keys']
    for f in ('SE', 'S', 'E'):
        i = meta['facings'].index(f)
        rows.append(('CLIP %s, %s: %d DRAWN KEYS = %g BEATS AT 120 (nothing between two keys is rendered)' % (name.upper(), f, per, c['beats']),
                     [('k%d' % j, op(fn)) for j, fn in enumerate(c['files'][i * per:(i + 1) * per])], ORANGE))
port = None
if meta.get('portrait'):
    port = json.load(open(os.path.join(D, meta['portrait'])))
    rows.append(('THE SAME MODEL\'S HEAD AT %d PX (ONE ID, ONE WHOLE PERSON): S, SE, SW, camera tilt %g' % (port['head_px'], port['camera']['tilt_deg']),
                 [(f, op(fn)) for f, fn in zip(port['facings'], port['files'])], ORANGE))
    if port.get('expression_files'):
        rows.append(('THE FACE PERFORMS: the same head, front-on, one shape key each at full weight', [(e, op(fn)) for e, fn in port['expression_files'].items()], ORANGE))
twins = []
if WOLF:
    for clip, n in (('walk', 6), ('idle', 12)):
        ims = [Image.open(f).convert('RGBA') for f in sorted(glob.glob(os.path.join(WOLF, 'wolf_%s_SE_k*.png' % clip)))]
        if ims: twins.append(('THE GAME\'S OWN DIRE WOLF TODAY, SE, %s, %d keys at 112 (the placeholder this replaces)' % (clip, len(ims)), [('k%d' % j, im) for j, im in enumerate(ims)], GREEN))
if CAR: twins.append(('HIS CAR (the twin, 10. Abandoned cars #3, drawn 96 px long)', [('his car', op('reference/art_bank/prop/pack_10_abandoned_cars_003.png'))], GREEN))

card = meta.get('card') or {}
card_lines = ['THE CARD, on the S still against the %s band: %s' % (card.get('family', '?'), card.get('verdict', 'not run'))] + [r for r in card.get('rows', [])]
sp = meta.get('source_pass') or {}
src_lines = ['THE SOURCE PASS (wear %s): ' % sp.get('wear', 0) + '; '.join(sp.get('what', []))] if sp else ['no source pass (round two)']

GAP, PAD, HEAD = 10, 14, 26
def row_size(items): return sum(im.width for _, im in items) + GAP * (len(items) + 1), max(im.height for _, im in items) + HEAD + 22
allrows = rows + twins
head1 = TITLE or 'THE MASTER RIG, ROUND THREE: THE LOOK AT THE SOURCE. ONE CAMERA (tilt 45, never turned), %g PX A METRE, HEIGHT x%s, EIGHT FACINGS, 1:1' % (meta['ppm'], meta.get('z_stretch', 1))
head2 = 'model %s, real %s m, %d colours, pull %s toward the %s family%s; the green bar is a 1.72 m man at %d px (the ruler)' % (
    os.path.basename(meta['model']), meta['real_dims_m'], meta.get('colours', 0), (meta.get('snap') or {}).get('pull', 0), meta.get('family_palette'),
    ', a contact shadow' if meta.get('contact_shadow') else '', MAN)
src_lines = [t[i:i + 150] for t in src_lines for i in range(0, len(t), 150)]
tw = lambda t: ImageDraw.Draw(Image.new('RGB', (1, 1))).textlength(t, font=F)
W = int(max(max(row_size(it)[0] for _, it, _ in allrows) + PAD * 2 + 70, max(tw(t) for t in [head1, head2] + src_lines + card_lines) + PAD * 2))
H = 70 + sum(row_size(it)[1] + 12 for _, it, _ in allrows) + 22 * (len(card_lines) + len(src_lines)) + 30
s = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(s)
d.text((PAD, 6), head1, font=F, fill=INK)
d.text((PAD, 26), head2, font=F, fill=DIM)
y = 56
for title, items, col in allrows:
    rw, rh = row_size(items); base = y + rh - 22
    d.text((PAD, y + 4), title, font=F, fill=col)
    x = PAD + GAP
    for label, im in items:
        s.paste(im, (x, base - im.height), im); d.text((x, base + 2), label, font=F, fill=DIM); x += im.width + GAP
    if title.startswith('THE EIGHT'):
        d.rectangle([x + 10, base - MAN, x + 16, base], fill=GREEN); d.text((x, base + 2), '1.72 m', font=F, fill=GREEN)
    y += rh + 12
for t in src_lines:
    d.text((PAD, y), t, font=F, fill=DIM); y += 22
for i, t in enumerate(card_lines):
    d.text((PAD, y), t, font=F, fill=INK if i == 0 else (RED if t.startswith('OUT') else GREEN)); y += 22
s.save(OUT); print(OUT, s.size)
