#!/usr/bin/env python3
"""THE WIDE BOARD: EVERY SCREEN SHOWS THE WHOLE BOARD, NEVER A BLACK BAR  (COMBAT 2, OPEN row [the wide board])

Rule 62 (four screen classes) and his sixth votes (fights run LEFT TO RIGHT: the board's long axis is the
glass's width): the board is 20 x 15 house tiles, aspect 1.89. A phone held sideways is 2.16, a tablet 1.33,
a computer 1.78, a phone upright 0.46. Fitting the whole board on each leaves bars of nothing at the sides
or top. Battle Brothers never shows the edge of the world: its map runs past the edge of the battlefield.

SO EVERY BOARD GETS AN APRON: a ring one block deep (5 house tiles) of the SAME city round it, cut from the
board's own kind (a suburb's apron is more suburb, a desert's more desert, the freeway runs on through the
apron left and right), marked NOT PLAYABLE. It costs no new pictures (the apron reuses the blocks already
shipped). And every board carries, per screen class, the FRAME the fight should open on: the smallest
rectangle of the aproned board, at that glass's aspect, that holds the whole playable board, clipped to the
apron. The fight opens on that frame and pinches in from there (rule 62's far stop); taller or wider glass
sees more apron, never more playable tiles.

  fight_ground.json boards[b].apron = {blocks: [[...7...] x 5 rows], playable: [col0, row0, col1, row1] in tiles}
  fight_ground.json boards[b].frames = {phone_portrait|phone_landscape|tablet|computer: [x0, y0, x1, y1] px in
                                        the aproned board, letterbox: the share of glass left for the HUD}

WHAT IS PROVED, NOT CLAIMED (each refuses the run): every frame contains the whole playable board; every
frame lies inside the aproned board; every apron block is a block the manifest ships; the landscape
classes (phone sideways, tablet, computer) need no letterbox at all.

THE ANALOG HORROR LINE (rule 20): the apron is the city going on past the fight, the streets nobody is
standing in. It is the part of the picture you cannot walk to.

REFERENCE CHECK (the 9/4 standing law):
  CGRD-01 INTO THE BREACH: the playable board reads first, the apron is the same city, quieter by distance.
  TG-04 THE STREET TILE: the apron's streets are the board's streets running on (the freeway, the town rows).
  AH-01 THE BIBLE: one register; the apron is the same light and the same sun.
  REUSE CHECK: every apron block is a block of slices/fight_ground; nothing is drawn.

[bb the battle map] Battle Brothers draws terrain past the playable hexes to the screen's edge; the player
  never sees the world end. OURS: the city never ends at the edge of the fight either.

    python3 tools/bohemia_combat2_the_wide_board_cook_10_5_26.py
      -> slices/fight_ground/fight_ground.json (apron + frames)
      -> slices/vote/COMBAT2_THE_WIDE_BOARD_10_5.png
"""
import json, os, random, sys
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(REPO)
DIR = 'slices/fight_ground'
MAN = DIR + '/fight_ground.json'
OUT_CARD = 'slices/vote/COMBAT2_THE_WIDE_BOARD_10_5.png'
CLASSES = {'phone_portrait': (390, 844), 'phone_landscape': (844, 390), 'tablet': (1366, 1024), 'computer': (1920, 1080)}


def die(msg): sys.exit('REFUSED: ' + msg)


def apron_for(name, lay, blocks):
    """One block of the board's own city all round: the edge blocks repeated outward, varied by variant
       so no apron block sits beside its twin; the freeway row runs straight on."""
    rng = random.Random('apron-' + name)
    rows, cols = len(lay), len(lay[0])
    def kin(bid):
        kind = bid.split('.')[0]
        vs = [b for b in blocks if b.split('.')[0] == kind]
        return vs or [bid]
    out = [[None] * (cols + 2) for _ in range(rows + 2)]
    for r in range(rows):
        for c in range(cols): out[r + 1][c + 1] = lay[r][c]
    for r in range(rows + 2):
        for c in range(cols + 2):
            if out[r][c] is not None: continue
            rr, cc = min(max(r - 1, 0), rows - 1), min(max(c - 1, 0), cols - 1)
            src = lay[rr][cc]
            if src.startswith('freeway') and r in range(1, rows + 1):
                out[r][c] = src; continue                     # the freeway runs on, lanes unbroken
            opts = kin(src)
            left = out[r][c - 1] if c else None
            up = out[r - 1][c] if r else None
            pick = [b for b in opts if b != left and b != up] or opts
            out[r][c] = rng.choice(pick)
    return out


def frame_for(cls, tile_px, bt, cols, rows):
    """The smallest glass-aspect rectangle holding the playable board, centred, clipped to the apron."""
    vw, vh = CLASSES[cls]
    asp = vw / vh
    PXw, PYh = tile_px
    AW, AH = (cols + 2) * bt * PXw, (rows + 2) * bt * PYh
    px0, py0 = bt * PXw, bt * PYh
    pw, ph = cols * bt * PXw, rows * bt * PYh
    if pw / ph >= asp: w, h = pw, pw / asp
    else: w, h = ph * asp, ph
    cx, cy = px0 + pw / 2, py0 + ph / 2
    x0, y0, x1, y1 = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
    lb = 0.0
    if x0 < 0 or x1 > AW: x0, x1 = 0, AW
    if y0 < 0 or y1 > AH:
        lb = round(1 - AH / h, 3); y0, y1 = 0, AH                 # what the glass shows past the apron: the HUD's band
    return [int(x0), int(y0), int(x1), int(y1)], lb


def main():
    m = json.load(open(MAN))
    bt, tile = m['block_tiles'], m['tile_px']
    blocks = list(m['blocks'])
    for name, b in m['boards'].items():
        lay = b['blocks']
        ap = apron_for(name, lay, blocks)
        for row in ap:
            for bid in row:
                if bid not in m['blocks']: die('%s apron uses %s, which is not shipped' % (name, bid))
        rows, cols = len(lay), len(lay[0])
        b['apron'] = dict(blocks=ap, playable=[bt, bt, bt * (cols + 1), bt * (rows + 1)],
                          note='one block of the same city round the board, NOT playable; draw it, never walk it')
        frames = {}
        for cls in CLASSES:
            fr, lb = frame_for(cls, tile, bt, cols, rows)
            px = [bt * tile[0], bt * tile[1], bt * tile[0] * (cols + 1), bt * tile[1] * (rows + 1)]
            if not (fr[0] <= px[0] and fr[1] <= px[1] and fr[2] >= px[2] and fr[3] >= px[3]): die('%s %s frame misses the board' % (name, cls))
            if cls != 'phone_portrait' and lb > 0: die('%s %s needs a letterbox' % (name, cls))
            frames[cls] = dict(rect=fr, letterbox=lb)
        b['frames'] = frames
    m['frames_key'] = {'rect': '[x0, y0, x1, y1] px in the aproned board (apron origin top-left): the fight opens on it',
                       'letterbox': "share of the glass past the apron (upright phone only): the HUD's band",
                       'classes': {k: list(v) for k, v in CLASSES.items()}}
    json.dump(m, open(MAN, 'w'), indent=1)
    card(m, 'culdesac')
    print('ok: apron and four frames on %d boards' % len(m['boards']))


def card(m, name):
    b = m['boards'][name]; ap = b['apron']['blocks']; bt, tile = m['block_tiles'], m['tile_px']
    sc = 0.02
    bw, bh = int(bt * tile[0] * sc), int(bt * tile[1] * sc)
    cache = {}
    big = Image.new('RGB', (bw * len(ap[0]), bh * len(ap)))
    for r, row in enumerate(ap):
        for c, bid in enumerate(row):
            if bid not in cache: cache[bid] = Image.open(os.path.join(DIR, m['blocks'][bid]['src'])).convert('RGB').resize((bw, bh), Image.LANCZOS)
            im = cache[bid]
            if not (1 <= r <= len(ap) - 2 and 1 <= c <= len(row) - 2):
                im = Image.blend(im, Image.new('RGB', im.size, (20, 18, 16)), 0.35)   # the apron, quieter on this sheet only
            big.paste(im, (c * bw, r * bh))
    d = ImageDraw.Draw(big)
    d.rectangle([bw, bh, bw * (len(ap[0]) - 1), bh * (len(ap) - 1)], outline=(255, 236, 160), width=2)
    panels = []
    for cls, (vw, vh) in CLASSES.items():
        x0, y0, x1, y1 = [int(v * sc) for v in b['frames'][cls]['rect']]
        crop = big.crop((x0, y0, x1, y1))
        s = 300 / max(vw, vh)
        gw, gh = int(vw * s), int(vh * s)
        glass = Image.new('RGB', (gw, gh), (8, 8, 9))
        f = min(gw / crop.size[0], gh / crop.size[1])
        cr = crop.resize((max(1, int(crop.size[0] * f)), max(1, int(crop.size[1] * f))), Image.LANCZOS)
        glass.paste(cr, ((gw - cr.size[0]) // 2, (gh - cr.size[1]) // 2))
        panels.append((cls, glass))
    W = sum(p.size[0] for _, p in panels) + 20 * (len(panels) + 1)
    out = Image.new('RGB', (max(W, big.size[0] + 40), 60 + max(p.size[1] for _, p in panels) + 60 + big.size[1] + 30), (12, 11, 10))
    dd = ImageDraw.Draw(out)
    dd.text((20, 16), 'THE SAME BOARD ON FOUR SCREENS: the whole fight fits, the city runs on past it', font=None, fill=(222, 181, 118))
    x = 20
    for cls, p in panels:
        dd.text((x, 36), cls.replace('_', ' ').upper(), fill=(222, 181, 118)); out.paste(p, (x, 52)); x += p.size[0] + 20
    y = 60 + max(p.size[1] for _, p in panels) + 30
    dd.text((20, y), 'the board (yellow line) and its apron: one block of the same city round it, drawn, never walked', fill=(200, 170, 120))
    out.paste(big, (20, y + 20))
    out.save(OUT_CARD, optimize=True)


if __name__ == '__main__':
    main()
