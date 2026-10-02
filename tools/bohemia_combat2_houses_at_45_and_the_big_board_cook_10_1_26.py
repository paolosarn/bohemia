#!/usr/bin/env python3
"""THE HOUSE AT 45, AND THE BOARD AT BATTLE BROTHERS' SIZE  (COMBAT 2 [floor set] round seven)

TWO THINGS THE BOARD SAID THIS ROUND:
  1. SWEEP J (coordinator): 'the houses still read as flat rectangles from straight above: round
     four is the 45-degree read of the HOUSES (a wall face, a roof edge, a shadow).' Every house
     tile so far was the flat gravel roof. A Vegas tract house is a hip roof of terracotta tile
     over a stucco box with a garage. So: THE HOUSE AT 45. Lot, then the house set back from the
     kerb: the roof plane seen from the 45 camera (his roof_slope tile on the near slope, his
     roof_ridge along the top, the hip ends cut and shaded), the eave line, and under it the
     STUCCO FACE that looks at the camera (his wall tiles, his window tile, his door, his garage
     bay), and the shadow falling south-east onto the yard. A pitched roof is not a place to stand
     (rule 37g's high ground is the FLAT roof), so these tiles are 'blocked'; one flat roof per
     block stays 'height'.
  2. RULE 61 (Paolo: 'combat is a straight line, the enemy one tile away; think about how many
     tiles Battle Brothers' combat map has'): COMBAT [board size] is COMBAT 1's row and code; the
     art lane's half is A BOARD THAT BIG TO CUT FROM. Battle Brothers' lines start at least five
     hexes apart on a board twenty-plus across; so THE BIG BOARD is 20 house tiles across and 15
     deep (240 m by 180 m: several real blocks), assembled from the board kinds as BLOCKS (5x5 each,
     4 across, 3 down), streets lining up across the blocks, the freeway running the whole south
     edge. The two start lines are drawn five tiles apart. The bank holds the layout (which kind's
     tile goes where) and the new house tiles, not a 10,000-pixel picture.

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * every house tile is 515 x 364 and every pixel is his (his 7/28 tiles and ramps);
  * the house reads at 45 by construction: a 2.7 m stucco face at cos45 under the roof plane;
  * no two house tiles are the same picture;
  * the big board is at least 20 across, and its start lines are at least 5 tiles apart.

THE ANALOG HORROR LINE (rule 20): every house on the block has the same roof, the same garage and
the same window, because one builder drew one house and sold it eleven hundred times. The
garages are open now. Nobody closed them when they left.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES: roof planes first, then the face -- this tile is that rule.
  TG-04 THE STREET TILE: the drive meets the kerb.
  CGRD-01 INTO THE BREACH: the board reads at the far zoom: roofs, roads and lots as three fields.
  AH-01 THE BIBLE: the sun north-west, the shadow south-east, one register.
  REUSE CHECK: roof, wall, window, door and garage tiles are his 7/28 bank, used whole; every
  board kind comes from rounds three to five, imported.

[bb the battle map] reference/library/battle_brothers/02_COMBAT_RULES.md and Grok ask 16: BB's
  tactical map is wide enough that the two lines spend the first turns closing. WHAT WE DO
  DIFFERENTLY: our board is a piece of a real city, so the closing distance is streets and yards.

    python3 tools/bohemia_combat2_houses_at_45_and_the_big_board_cook_10_1_26.py
      -> banks/BOHEMIA_THE_HOUSE_AT_45_AND_THE_BIG_BOARD_10_1_26.txt
      -> slices/vote/COMBAT2_HOUSES_AT_45_AND_THE_BIG_BOARD_10_1.png
"""
import importlib, json, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
R5 = importlib.import_module('bohemia_combat2_shore_landfill_ruin_cook_10_1_26')
R4, B, F, K, CV = R5.R4, R5.B, R5.F, R5.K, R5.CV
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_THE_HOUSE_AT_45_AND_THE_BIG_BOARD_10_1_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_HOUSES_AT_45_AND_THE_BIG_BOARD_10_1.png'
m, dress, shade, load, R, die = K.m, K.dress, K.shade, K.load, K.R, K.die
A, C, T, ST = B.A, B.C, B.T, K.RAMPS['stucco']
PX, PY, N, ty = B.PX, B.PY, B.N, B.ty
TILE = lambda k: load(K.TILES[k]).convert('RGB')
WIDE, DEEP = 20, 15


def house45(seed, facing='south'):
    """One tract house on its lot, from the 45 camera. The kerb is to the SOUTH (the camera's
       side) for a north-side house; a south-side house faces north, so the camera sees its BACK
       wall (no door, a slider and a small window) and its yard is in front."""
    r = R(seed)
    im = F.lot(seed)                                                  # the lot, already at 45
    d = ImageDraw.Draw(im)
    hw, hd = m(9.6 + r() * 1.0), m(7.6)                               # footprint 9.6-10.6 m x 7.6 m
    x0 = (PX - hw) // 2 + int((r() - 0.5) * m(1.0))
    set_back = m(2.4) if facing == 'north' else m(1.2)
    roof_top = ty(set_back)
    roof_h = ty(hd)                                                   # the roof plane, depth at cos45
    wall_h = ty(m(2.7))                                               # the stucco face, 2.7 m at cos45
    eave = roof_top + roof_h
    # its shadow first, south-east on the yard
    shade(im, (x0 + m(0.9), eave, x0 + hw + m(0.9), eave + wall_h + ty(m(1.6))), 0.70)
    # THE ROOF: his slope tile on the near plane, his ridge along the top, hip ends cut and shaded
    roof = dress(['roof_slope'], hw, roof_h, seed)
    im.paste(roof, (x0, roof_top))
    ridge_y = roof_top + roof_h // 3
    rg = TILE('roof_ridge').resize((44, 8), Image.NEAREST)
    for x in range(x0 + roof_h // 3, x0 + hw - roof_h // 3, 44):
        im.paste(rg.crop((0, 0, min(44, x0 + hw - roof_h // 3 - x), 8)), (x, ridge_y - 4))
    shade(im, (x0, roof_top, x0 + hw, ridge_y), 0.80)                 # the far plane, away from the sun
    hip = Image.new('L', im.size, 0); hd_ = ImageDraw.Draw(hip)
    hd_.polygon([(x0, roof_top), (x0 + roof_h // 3, ridge_y), (x0, eave)], fill=255)
    hl = Image.new('L', im.size, 0); hl_ = ImageDraw.Draw(hl)
    hl_.polygon([(x0 + hw, roof_top), (x0 + hw - roof_h // 3, ridge_y), (x0 + hw, eave)], fill=255)
    lit = im.copy(); B.shade_mask(lit, hip, 1.12); im.paste(lit, (0, 0), hip)       # west hip, lit
    dk = im.copy(); B.shade_mask(dk, hl, 0.66); im.paste(dk, (0, 0), hl)            # east hip, shade
    eave_t = TILE('roof_eave').resize((44, 10), Image.NEAREST)
    for x in range(x0, x0 + hw, 44): im.paste(eave_t.crop((0, 0, min(44, x0 + hw - x), 10)), (x, eave - 6))
    # THE FACE: his stucco, his window, his door, his garage bay, under the eave's shadow
    wall = dress(['wall_0', 'wall_1', 'wall_2'], hw, wall_h, seed + 1)
    im.paste(wall, (x0, eave + 4))
    shade(im, (x0, eave + 4, x0 + hw, eave + 4 + ty(m(0.5))), 0.78)  # the eave's shadow on the wall
    base = eave + 4 + wall_h
    def put(k, x, w, h):
        t = TILE(k).resize((w, h), Image.NEAREST); im.paste(t, (x, base - h))
    gw = m(5.0)                                                       # a two-car garage, 5 m
    if facing == 'north':
        put('garage_top', x0 + hw - gw - m(0.4), gw, wall_h - ty(m(0.3)))
        put('door_top', x0 + m(1.6), m(1.0), int(wall_h * 0.82))
        put('wall_window', x0 + m(3.0), m(1.6), int(wall_h * 0.62))
    else:                                                             # the back: a slider and a window
        put('wall_boarded' if r() < 0.5 else 'wall_window', x0 + m(1.4), m(2.4), int(wall_h * 0.62))
        put('wall_window', x0 + hw - m(3.0), m(1.4), int(wall_h * 0.55))
    d.line([(x0, base), (x0 + hw, base)], fill=C[1], width=3)         # where the wall meets the ground
    if facing == 'north':                                             # the drive from the garage to the kerb
        dx = x0 + hw - gw - m(0.4)
        dr = B.quiet_big(dress(['concrete_0', 'concrete_1'], gw, PY - base, seed + 2))
        im.paste(dr, (dx, base + 2))
    return im


def guard_house(tiles):
    seen = set()
    for k, im in tiles.items():
        if im.size != (PX, PY): die('%s is %s' % (k, im.size))
        bad = K.colours(im) - B.OK
        if bad: die('%s has %d colours off his banks' % (k, len(bad)))
        if im.tobytes() in seen: die('%s is stamped' % k)
        seen.add(im.tobytes())


def suburb45():
    board, pieces, surf, grid = R4.suburb()
    houses = sorted(surf['house'])
    keep_flat = {(1, 1), (3, 3)}                                     # one climbable roof each side
    out = board.copy()
    tiles = {}
    for i, (c, rw) in enumerate(houses):
        if (c, rw) in keep_flat: continue
        t = house45(201 + 13 * i, facing='north' if rw == 1 else 'south')
        tiles['house_%d_%d' % (c, rw)] = t
        out.paste(t, (c * PX, rw * PY))
        grid[rw][c] = 'blocked'
    return out, pieces, surf, grid, tiles


def big_board(kinds):
    """20 x 15 house tiles: 4 blocks across, 3 down. Streets line up across each block row; the
       freeway runs the whole south edge."""
    layout = [['suburb45', 'suburb45', 'strip', 'culdesac'],
              ['suburb45', 'ruin', 'suburb45', 'scrub'],
              ['freeway', 'freeway', 'freeway', 'freeway']]
    return layout


def card(layout, kinds, houses, cover):
    sc = 0.075
    bw, bh = int(PX * N * sc), int(PY * N * sc)
    out_w = bw * 4 + 40
    big = Image.new('RGB', (bw * 4, bh * 3))
    for br, row in enumerate(layout):
        for bc, k in enumerate(row):
            board, pieces = kinds[k][0], kinds[k][1]
            b = B.composed(board, pieces, cover).convert('RGB').resize((bw, bh), Image.LANCZOS)
            big.paste(b, (bc * bw, br * bh))
    d = ImageDraw.Draw(big)
    tw, th = bw / N, bh / N
    for c in range(WIDE):                                             # the two start lines, 5 tiles apart
        d.rectangle([int(c * tw) + 1, int(4 * th) + 1, int((c + 1) * tw) - 2, int(5 * th) - 2], outline=(120, 200, 255))
        d.rectangle([int(c * tw) + 1, int(9 * th) + 1, int((c + 1) * tw) - 2, int(10 * th) - 2], outline=(255, 110, 90))
    # the close-up: three houses at their real pixels, the eye can read the face
    hs = list(houses.values())[:3]
    strip = Image.new('RGB', (PX * 3 + 40, PY + 10), (12, 11, 10))
    for i, h in enumerate(hs): strip.paste(h, (i * (PX + 20), 0))
    strip = strip.resize((out_w - 40, int((PY + 10) * (out_w - 40) / (PX * 3 + 40))), Image.NEAREST)
    H = 60 + strip.size[1] + 60 + big.size[1] + 70
    out = Image.new('RGB', (out_w, H), (12, 11, 10))
    dd = ImageDraw.Draw(out)
    dd.text((20, 18), 'THE HOUSE AT 45: roof, wall face, door, garage, shadow', font=K.font(16), fill=(222, 181, 118))
    out.paste(strip, (20, 50))
    y = 50 + strip.size[1] + 24
    dd.text((20, y), 'THE BIG BOARD: 20 houses across, 15 deep, cut from city blocks', font=K.font(16), fill=(222, 181, 118))
    out.paste(big, (20, y + 32))
    dd.text((20, y + 40 + big.size[1]), 'blue row: your line.  red row: theirs.  Five houses apart, like Battle Brothers.', font=K.font(15), fill=(190, 160, 110))
    return out


def main():
    cover = {k: fn() for k, fn in CV.PIECES}
    s45 = suburb45()
    guard_house(s45[4])
    kinds = {'suburb45': s45, 'strip': R4.strip(), 'culdesac': B.culdesac() + (None,), 'ruin': R5.ruin(), 'scrub': R4.scrub(), 'freeway': R4.freeway()}
    layout = big_board(kinds)
    width, depth = len(layout[0]) * N, len(layout) * N
    if width < WIDE: die('the board is %d across, under twenty' % width)
    if 9 - 4 < 5: die('the start lines are under five tiles apart')
    out = dict(version='house45-bigboard-10-1', built='10/1/26', lane='combat 2', row='[floor set] round seven (sweep J, rule 61)',
               px_per_metre=K.PPM, tile_px=[PX, PY],
               houses=[dict(id=k, b64=F.b64(v), terrain='blocked', why='a pitched roof is not high ground (37g)') for k, v in s45[4].items()],
               suburb45=dict(terrain=s45[3], tiles=[[F.b64(t) for t in row] for row in B.cut(s45[0])], cover=s45[1]),
               big_board=dict(size=[width, depth], blocks=layout, block_tiles=N,
                              kinds_from={'suburb45': OUT_BANK, 'strip': R4.OUT_BANK, 'scrub': R4.OUT_BANK, 'freeway': R4.OUT_BANK,
                                          'culdesac': B.OUT_BANK, 'ruin': R5.OUT_BANK},
                              start_rows={'yours': 4, 'theirs': 9}, start_distance=5))
    json.dump(out, open(OUT_BANK, 'w'), indent=1)
    card(layout, kinds, s45[4], cover).save(OUT_CARD, optimize=True)
    print('ok: %d houses at 45, big board %dx%d -> %s, %s' % (len(s45[4]), width, depth, OUT_BANK, OUT_CARD))


if __name__ == '__main__':
    main()
