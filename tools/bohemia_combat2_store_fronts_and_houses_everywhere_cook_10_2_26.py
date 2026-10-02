#!/usr/bin/env python3
"""STORE FRONTS, AND THE HOUSE AT 45 ON EVERY BLOCK  (COMBAT 2 [floor set] round eight)

Round seven's own weak list, worked: (1) the strip mall's stores reused the house's flat roof
and had no face; (2) the cul-de-sac and the ruin still stood on round three's flat gravel roofs.

  STORE FRONT AT 45   a strip-mall bay from the 45 camera: the flat roof deck behind its
                      parapet (his deck and stucco), then the tall face that looks at the camera,
                      4.5 m at cos45: a sign band left blank (the letters came down when the
                      company did), the glass run gone dark, one bay boarded with his boarded
                      tile, his door, the walk in front. Five bays, no two alike. Stores are
                      'blocked' in a fight (no door is open), the one with the roof ladder stays
                      'height' (round four's rule).
  CUL-DE-SAC AT 45    round three's bulb with round seven's houses round it: the north houses
                      show their fronts (garage, door, window), the south houses their backs.
  RUIN AT 45          round five's burnt block with the 45 houses, burnt: soot over the stucco,
                      the roof broken through to the joists over black, 'blocked'.
  and the BIG BOARD re-drawn with all three in it.

WHAT IS PROVED, NOT CLAIMED (each refuses the run): every new tile 515 x 364, every pixel his,
no two the same picture (round seven's house guard on every one); round three's guard on every
re-dressed kind.

THE ANALOG HORROR LINE (rule 20): the sign bands are blank, but you can still read where the
letters were, a paler shape in the sun-bleached stucco. Nobody remembers what the stores sold.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE FROM 45 DEGREES: roof first, then the face, on the store as on the house.
  CGRD-01 INTO THE BREACH: the glass is the darkest thing on the face so the face reads as a store.
  AH-01 THE BIBLE: the sun north-west, the shadow south-east.
  REUSE CHECK: his deck, stucco, boarded, door and window tiles (7/28 bank); house45 and the big
  board from round seven; the kinds from rounds three to five.

[bb the battle map] reference/library/battle_brothers/02_COMBAT_RULES.md, the BOARD line: a
  settlement fight in BB is fought among the buildings' faces, not their roofs. Ours too: the
  face is what the camera sees and what the cover is.

    python3 tools/bohemia_combat2_store_fronts_and_houses_everywhere_cook_10_2_26.py
      -> banks/BOHEMIA_STORE_FRONTS_AND_HOUSES_EVERYWHERE_10_2_26.txt
      -> slices/vote/COMBAT2_STORE_FRONTS_AND_HOUSES_EVERYWHERE_10_2.png
"""
import importlib, json, os, sys
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
H7 = importlib.import_module('bohemia_combat2_houses_at_45_and_the_big_board_cook_10_1_26')
R5, R4, B, F, K, CV = H7.R5, H7.R4, H7.B, H7.F, H7.K, H7.CV
os.chdir(REPO)

OUT_BANK = 'banks/BOHEMIA_STORE_FRONTS_AND_HOUSES_EVERYWHERE_10_2_26.txt'
OUT_CARD = 'slices/vote/COMBAT2_STORE_FRONTS_AND_HOUSES_EVERYWHERE_10_2.png'
m, dress, shade, R, die = K.m, K.dress, K.shade, K.R, K.die
A, C, T, ST, D = B.A, B.C, B.T, K.RAMPS['stucco'], K.RAMPS['deck']
PX, PY, N, ty, TILE = B.PX, B.PY, B.N, B.ty, H7.TILE


def store45(seed):
    r = R(seed)
    im = Image.new('RGB', (PX, PY))
    face_h = ty(m(4.5))
    roof_h = PY - face_h - ty(m(1.2))                                  # the deck, then the face, then the walk
    im.paste(B.F.tilt(dress(['roof_deck'], PX, PX, seed)).crop((0, 0, PX, roof_h)), (0, 0))
    d = ImageDraw.Draw(im)
    pt = ty(m(0.4))
    d.rectangle([0, 0, PX, pt], fill=ST[4]); d.rectangle([0, roof_h - pt, PX, roof_h], fill=ST[3])
    shade(im, (0, pt, PX, pt + ty(m(0.9))), 0.80)
    face_top = roof_h
    im.paste(dress(['wall_0', 'wall_1', 'wall_2'], PX, face_h, seed + 1), (0, face_top))
    sign_h = ty(m(1.1))
    d.rectangle([0, face_top, PX, face_top + sign_h], fill=ST[2])       # the sign band
    gx = m(1.0 + r() * 2.0)                                            # where the letters were: a paler ghost
    for k in range(5 + r.i(4)):
        lw = m(0.5 + r() * 0.3)
        d.rectangle([gx, face_top + ty(m(0.3)), gx + lw, face_top + sign_h - ty(m(0.3))], fill=ST[3])
        gx += lw + m(0.25)
    d.line([(0, face_top + sign_h), (PX, face_top + sign_h)], fill=ST[0], width=3)
    gtop, gbot = face_top + sign_h + ty(m(0.4)), face_top + face_h - ty(m(0.3))
    d.rectangle([m(0.5), gtop, PX - m(0.5), gbot], fill=A[0])          # the glass run, dark
    for x in range(m(0.5), PX - m(0.5), m(2.4)):                        # the mullions
        d.rectangle([x, gtop, x + 4, gbot], fill=C[3])
    for k in range(3):                                                  # the last reflections
        x = m(1 + r() * 9)
        d.line([(x, gtop + 4), (x + m(0.6), gtop + ty(m(1.2)))], fill=A[3], width=2)
    bx = m(0.5) + m(2.4) * r.i(4)                                       # one bay boarded, his tile
    im.paste(TILE('wall_boarded').resize((m(2.4), gbot - gtop), Image.NEAREST), (bx, gtop))
    dx = PX - m(3.6)
    im.paste(TILE('door_top').resize((m(1.6), gbot - gtop), Image.NEAREST), (dx, gtop))
    shade(im, (0, face_top + sign_h, PX, face_top + sign_h + ty(m(0.5))), 0.78)
    walk = B.quiet_big(dress(['walk_0', 'walk_1', 'walk_2'], PX, PY - face_top - face_h, seed + 2))
    im.paste(walk, (0, face_top + face_h))
    shade(im, (0, face_top + face_h, PX, face_top + face_h + ty(m(0.8))), 0.74)   # the face's shadow on the walk
    return im


def burnt45(seed, facing):
    im = H7.house45(seed, facing)
    B.shade_mask(im, Image.new('L', im.size, 255), 0.62)               # soot over everything
    d = ImageDraw.Draw(im); r = R(seed)
    x0, y0 = m(3.0 + r() * 2), ty(m(2.5 + r() * 1.5))
    x1, y1 = x0 + m(4.5 + r() * 2), y0 + ty(m(3.5))
    d.polygon([(x0, y0 + 8), (x0 + 24, y0), (x1, y0 + 6), (x1 - 10, y1), (x0 + 6, y1 - 3)], fill=A[0])
    for x in range(x0, x1, m(0.6)): d.line([(x, y0 + 3), (x, y1 - 3)], fill=A[2], width=3)
    return im


def strip45():
    board, pieces, surf, grid = R4.strip()
    tiles = {}
    for c in range(N):
        if (c, 0) == (1, 0): continue                                   # the ladder roof stays flat
        t = store45(301 + 11 * c); tiles['store_%d' % c] = t
        board.paste(t, (c * PX, 0))
    return board, pieces, surf, grid, tiles


def culdesac45():
    board, pieces, surf = B.culdesac()
    tiles = {}
    grid = R4.terrain([('blocked', set(surf['house']), 0)])
    for i, (c, rw) in enumerate(sorted(surf['house'])):
        t = H7.house45(401 + 13 * i, facing='north' if rw <= 1 else 'south')
        tiles['cds_house_%d_%d' % (c, rw)] = t
        board.paste(t, (c * PX, rw * PY))
    return board, pieces, surf, grid, tiles


def ruin45():
    board, pieces, surf, grid = R5.ruin()
    tiles = {}
    burnt = {(1, 1), (3, 1), (2, 3), (4, 3)}
    for i, (c, rw) in enumerate(sorted(surf['house'])):
        if (c, rw) in burnt:
            t = burnt45(501 + 13 * i, 'north' if rw == 1 else 'south')
        elif (c, rw) in {(0, 1), (3, 3)}:
            continue                                                    # a flat roof each side, high ground
        else:
            t = H7.house45(501 + 13 * i, 'north' if rw == 1 else 'south'); grid[rw][c] = 'blocked'
        tiles['ruin_house_%d_%d' % (c, rw)] = t
        board.paste(t, (c * PX, rw * PY))
    return board, pieces, surf, grid, tiles


def card(new, kinds, layout, cover):
    """Round seven's card, its close-up row now a store front, a cul-de-sac house and a burnt one."""
    shots = {'store': new['strip'][4]['store_0'], 'cds': list(new['culdesac'][4].values())[0],
             'burnt': list(new['ruin'][4].values())[1]}
    return H7.card(layout, kinds, shots, cover)


def main():
    cover = {k: fn() for k, fn in CV.PIECES}
    new = {'strip': strip45(), 'culdesac': culdesac45(), 'ruin': ruin45()}
    alltiles = {}
    for v in new.values(): alltiles.update(v[4])
    H7.guard_house(alltiles)
    B.guard({k: v[:3] for k, v in new.items()}, cover)
    s45 = H7.suburb45()
    kinds = {'suburb45': s45, 'strip': new['strip'], 'culdesac': new['culdesac'], 'ruin': new['ruin'], 'scrub': R4.scrub(), 'freeway': R4.freeway()}
    layout = H7.big_board(kinds)
    out = dict(version='store-fronts-houses-everywhere-10-2', built='10/2/26', lane='combat 2', row='[floor set] round eight',
               px_per_metre=K.PPM, tile_px=[PX, PY],
               new_tiles=[dict(id=k, b64=F.b64(v), terrain='blocked') for k, v in alltiles.items()],
               kinds=[dict(id=k + '45', terrain=v[3], tiles=[[F.b64(t) for t in row] for row in B.cut(v[0])], cover=v[1]) for k, v in new.items()],
               big_board=dict(blocks=layout, size=[20, 15], note='same layout as round seven, these three kinds now at 45'))
    json.dump(out, open(OUT_BANK, 'w'), indent=1)
    card(new, kinds, layout, cover).save(OUT_CARD, optimize=True)
    print('ok: %d new tiles, 3 kinds at 45 -> %s, %s' % (len(alltiles), OUT_BANK, OUT_CARD))


if __name__ == '__main__':
    main()
