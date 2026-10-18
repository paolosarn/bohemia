#!/usr/bin/env python3
"""BOHEMIA -- COOK [props through the rig]: THE VOTE SHEET. The lamp, the gun and the wreck that came off DIRECTION's
master rig (tools/bohemia_cook_model_props.py), each beside HIS OWN pack tile at 1:1, standing on his cracked street
tile (style guide field 19, step 3), with all eight facings in a row (step 2) and the truck maquette beside the wreck
(step 6: does it look like it came from the same table?). The quartermaster's line opens every row, read from the
index by tools/bohemia_quartermaster_line.py, never typed. Every picture is at one art pixel to one sheet pixel and
the whole sheet is then doubled with nearest neighbour, so there is ONE pixel size on it (no mixels, guide field 2).

    python3 tools/bohemia_cook_props_through_the_rig_sheet.py  ->  records/target/COOK_PROPS_THROUGH_THE_RIG.png

REFERENCE CHECK: the twins are his approved tiles named in each row; the cards are the rig's own (rig.json).
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records/target/COOK_PROPS_THROUGH_THE_RIG.png')
BANK = os.path.join(ROOT, 'reference/art_bank')
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
GROUND = 'pack:1. Cracked street tiles#0'
ROWS = [
    ('lamp', 'THE LAMP POST, 3.2 m', 'a lamp post', ['--words', 'lamp', 'light', '--nearest', '18. Light sources and fire barrels#3'], 'pack:18. Light sources and fire barrels#3', None),
    ('gun', 'THE HEAVY MACHINE GUN ON ITS TRIPOD, 1.75 m', 'a gun', ['--packs', '12. Weapons and supplies', '--nearest', '12. Weapons and supplies#11'], 'pack:12. Weapons and supplies#11', None),
    ('wreck', 'THE WRECK, A 4.7 m SEDAN', 'a wrecked car', ['--words', 'car', 'cars', '--nearest', '9. Abandoned cards#0'], 'pack:9. Abandoned cards#0', 'records/target/direction_rig_round_five/truck/rig_S.png'),
]
BG, INK, DIM = (34, 33, 31, 255), (226, 218, 198, 255), (150, 144, 130, 255)


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def his(key):
    for r in json.load(open(os.path.join(BANK, 'CORPUS.json')))['tiles'].values():
        if r['key'] == key: return Image.open(os.path.join(BANK, r['family'], r['file'])).convert('RGBA')
    sys.exit('%s is not in the corpus' % key)


def qm(what, args):
    r = subprocess.run([sys.executable, os.path.join(ROOT, 'tools/bohemia_quartermaster_line.py'), what] + args +
                       ['--verdict', 'COMPOSE BESIDE IT (his tile is the score; the model is the source, rule 115a)'], capture_output=True, text=True)
    if r.returncode: sys.exit('the quartermaster line did not come: ' + r.stderr[:300])
    return r.stdout.strip()


def on_ground(sprite, tile):
    """the sprite standing on his street tile, the tile repeated under it at 1:1"""
    w, h = sprite.width + 16, sprite.height + 16
    g = Image.new('RGBA', (w, h))
    for y in range(0, h, tile.height):
        for x in range(0, w, tile.width): g.alpha_composite(tile, (x, y))
    g.alpha_composite(sprite, (8, 8))
    return g


def wrap(d, text, f, width):
    words, lines, cur = text.split(' '), [], ''
    for wd in words:
        t = (cur + ' ' + wd).strip()
        if d.textlength(t, font=f) > width and cur: lines.append(cur); cur = wd
        else: cur = t
    return lines + [cur]


def main():
    tile = his(GROUND)
    blocks, W = [], 0
    for name, title, what, qargs, twin_key, maquette in ROWS:
        d = 'records/target/master_rig/cook_%s' % name
        rig = json.load(open(os.path.join(ROOT, d, 'rig.json')))
        twin = his(twin_key)
        s = Image.open(os.path.join(ROOT, d, 'rig_S.png')).convert('RGBA')
        pics = [('HIS', twin), ('MINE', on_ground(s, tile))]
        if maquette: pics.append(('MAQUETTE', Image.open(os.path.join(ROOT, maquette)).convert('RGBA')))
        eight = [Image.open(os.path.join(ROOT, d, 'rig_%s.png' % f)).convert('RGBA') for f in FACINGS]
        blocks.append((title, qm(what, qargs), rig, pics, eight))
        W = max(W, sum(p.width for _, p in pics) + 16 * len(pics), sum(e.width for e in eight) + 6 * 8)
    W = max(W, 900) + 24
    f1, f2, f3 = font(14), font(9), font(10)
    probe = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    hs = []
    for title, line, rig, pics, eight in blocks:
        n = len(wrap(probe, line, f2, W - 24)) + 3
        hs.append(24 + n * 12 + max(p.height for _, p in pics) + 20 + max(e.height for e in eight) + 30)
    head = 74
    sheet = Image.new('RGBA', (W, head + sum(hs)), BG); dr = ImageDraw.Draw(sheet)
    dr.text((12, 10), 'COOK [props through the rig] 10/18: THREE PROPS MODELLED AT THE SOURCE, RENDERED THROUGH THE MASTER RIG', font=f1, fill=INK)
    for i, t in enumerate(wrap(dr, 'Pixel size: 57 px a metre, true size, one pixel size on the sheet (all at 1:1, the sheet doubled). Palette: records/target/BOHEMIA_STYLE_PALETTE.json, five materials a prop, eight a vehicle. Light: one sun from the upper left, the rig\'s own. Nothing is final before his moodboard (rule 108).', f2, W - 24)):
        dr.text((12, 32 + i * 12), t, font=f2, fill=DIM)
    y = head
    for (title, line, rig, pics, eight), h in zip(blocks, hs):
        dr.line((12, y, W - 12, y), fill=(70, 66, 60, 255))
        dr.text((12, y + 6), title + '   card: ' + rig['card']['verdict'], font=f1, fill=INK); yy = y + 24
        for t in wrap(dr, line, f2, W - 24): dr.text((12, yy), t, font=f2, fill=DIM); yy += 12
        outs = [r for r in rig['card']['rows'] if r.startswith('OUT')]
        dr.text((12, yy), 'out: ' + ('; '.join(o[5:].strip() for o in outs) or 'none'), font=f2, fill=DIM); yy += 24
        x, ph = 12, max(p.height for _, p in pics)
        for cap, p in pics:
            dr.text((x, yy - 11), cap, font=f2, fill=INK)
            sheet.alpha_composite(p, (x, yy + ph - p.height)); x += p.width + 16
        yy += ph + 20; x = 12; eh = max(e.height for e in eight)
        for f, e in zip(FACINGS, eight):
            dr.text((x, yy - 11), f, font=f2, fill=DIM)
            sheet.alpha_composite(e, (x, yy + eh - e.height)); x += e.width + 6
        y += h
    sheet = sheet.resize((sheet.width * 2, sheet.height * 2), Image.NEAREST)
    sheet.save(OUT, optimize=True)
    print(OUT, sheet.size)


if __name__ == '__main__':
    main()
