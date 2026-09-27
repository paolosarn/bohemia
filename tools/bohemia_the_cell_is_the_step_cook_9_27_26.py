#!/usr/bin/env python3
"""THE CELL IS THE STEP  (COOK [cell tiles] round 1, 9/27/26)

RULE 34, PAOLO 9/27, LOCKED: TWO SCALES, ONE GAME. "your character stays tiny even as you
zoom out and you move one grid at a time... one house doesn't equal one tile, it's all fucked
up". Every cell is FLOOR, WALL, DOOR, COVER or PROP, a house is many cells with a door and an
inside, a car is more than one cell, and THE DRAWING AGREES CELL FOR CELL. This lane's first
line is the banks at that cell.

*** THE FIRST MEASUREMENT IS THE BEST NEWS ON THIS ROW: THE APPROVED BANK WAS ALREADY DRAWN
AT THE CELL, AND THE LAW'S OWN WORD IS "CUT". *** banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_
7_28_26.txt -- the 42 tiles Paolo approved on 7/28 ("I checked it to do the other 41 mark it
approved") -- declares cell_px 44 and, in its own method, "1 px = 1.7 cm, because CELL_M =
0.75". A cell is three quarters of a metre, which is a human step, which is what rule 34 asks
for. Nothing about the scale of his art was wrong. Only the glass size changes: 32, not 44.
And rule 34 section 6 says the banks are "CUT TO CELL SIZE". Cut, not re-cooked.

SO THE CELLS BELOW ARE HIS PIXELS. Nearest 44 -> 32, measured: every colour in every tile
survives the cut (the check is in this file and it runs every time). His weed cracks, his kerb
lip, his gravel speckle, his sun offset, all of it, at the new glass size. The bank splits its
own tiles into "authored" (pure material, rebuilt by the method) and "redrawn", where its own
authority line says PAOLO DREW THESE AND I DO NOT GET TO REDRAW THEM -- and walk, kerb, yard,
concrete, wall and door are all in the redrawn half. Round one's first cut re-authored them
from scratch. That was the violation, and this is the correction: nothing here is re-authored.

WHAT IS *DRAWN* AND WHY -- FIVE CELLS ONLY, AND EACH OUT OF HIS OWN MATERIAL. The 7/28 bank is
a STREET IN ELEVATION: a ground band you look across and a building band standing up behind
it. Rule 34's close grid looks DOWN. So his wall_0 is a wall's FACE and the close grid needs a
wall's CAP; there is no source for it, at any scale, because the camera changed what the cell
contains. Those cells take his MATERIAL (his stucco, his dirt, his door's own black and lit
threshold) cut to 32 and add only the edge the overhead view makes: cap lit on the north-west,
face shaded on the south-east. That is an honest re-draw, never a third style (DIRECTION 9/27,
records/BOHEMIA_TWO_SCALES_LOOK_CARD_9_27_26.md section 5), and the card says which is which.

WHAT THE MEASURING FOUND, AND IT IS NOT SMALL:
  1. THE DENSITY FLOOR WAS NOT SCALE-FREE AND I NEARLY SHIPPED UNDER IT. The ground ruler
     (DIRECTION 9/23) is 2.07 colours per thousand pixels for ground and 1.55 for wall. Those
     were measured on 44 px tiles: 2.07/kpx x 1936 px = FOUR distinct colours, 1.55 = THREE.
     A 32 px cell is 1024 px, so the same four colours read 3.91/kpx. Round one's first cut
     checked 32 px cells against the 44 px number and passed a three-colour cell as if it
     cleared a four-colour floor. THE RULER IS A COUNT, NOT A RATE, and it is a count here.
     (Instance eighteen of this lane's running fault: a clean number off the wrong oracle.)
  2. THE CAR IS ALREADY DRAWN, FROM ABOVE, AND IT IS NOT 2x1. wreck_road in the approved bank
     is 192x92 px of burnt-out sedan seen from directly overhead -- his art, already in the
     close grid's own camera. At 1.7 cm a pixel that is 3.26 m by 1.56 m, which is FOUR CELLS
     BY TWO. Rule 34d's default of 2x1 is 1.5 m by 0.75 m, which is a motorbike. A real sedan
     (4.5 x 1.8 m) is six by two. The car here is his own drawing at its own honest size and
     the card shows all three numbers, because section 5 puts the defaults in VOTE as his to
     knock down.
  3. A HOUSE AT 4x4 CELLS IS THREE METRES SQUARE. That is a shed, and its 2x2 inside is a
     1.5 m closet. A small Vegas tract house is about 11 x 13 m, which is 15 x 17 cells, and
     it does not fit on a phone that shows 11 cells across (section 5). The house drawn here
     is the law's 4x4 default so the block is the law's block, and the number is handed to
     WORLD + LIFE+CITY [honest grid], whose row owns it, with this measurement attached.
  4. HIS TILES ARE NOT EXACTLY ON THE FAMILY RAMP AND THAT IS THE SUN. road_0 is the asphalt
     ramp plus 2 on every channel, walk_0 is concrete plus 3, wall_0 is stucco minus 3. A lit
     tile and a shaded tile, one offset each. A guard that forces every pixel onto a bare ramp
     entry is STRICTER THAN HIS OWN APPROVED ART and flattens the street, so the check here is
     "on the family ramp, or on the family ramp under one shared offset per tile".

WHAT IS PROVED HERE, NOT CLAIMED (every one of these refuses the run):
  * THE CUT LOSES NOTHING -- every distinct colour of every source tile survives 44 -> 32;
  * EVERY PIXEL IS HIS -- a cut cell's colours are a subset of its source tile's; a drawn
    cell's colours are a subset of its source material's, plus its family ramp;
  * THE RULER AS A COUNT -- ground cells carry 4+ distinct 8-quantised colours, wall cells 3+,
    and the 44-to-count conversion is re-derived from the ruler at run time, never typed;
  * A WALL SHOWS ITSELF -- a wall cell differs from the floor beside it by a measured amount,
    so a press into it is never a dead pad (rule 34b's own words);
  * A DOOR SHOWS ITSELF -- it differs from the wall it sits in;
  * EVERY FLOOR REGION CONNECTS TO THE STREET -- the block is flood-filled from the road and
    every floor cell has to be reached. Wall the door up and the tool refuses (the mutation
    runs every time, so the guard is proved to bite and not just to pass);
  * NOTHING IS STAMPED -- DIRECTION 9/27: "per-cell damage with authorship, a cracked cell
    next to a whole one, never a repeated stamp". Every class with more than one cell on the
    block has to render more than one distinct picture.

THE ANALOG HORROR LINE (rule 20): the house has an inside now, and there is nobody in it. The
door stands open on a concrete slab, and the light on the wall cap is the same light that is
on the kerb outside. Nothing in the block moved, and the car in the road has been there long
enough that the road has healed around it.

REFERENCE CHECK (the 9/4 standing law):
  TG-02 THE HOUSE TILE FROM 45 DEGREES: "from above-at-an-angle a house is ROOF PLANES FIRST,
        then the front face". Taken and INVERTED on purpose, because rule 34 changed what a
        house is: at one cell per 0.75 m a house is no longer a tile with a roof on it, it is
        cells you walk inside. No roof is drawn here at all; what is drawn is the wall cap you
        see from above and the floor you stand on. The reference read at the new scale.
  TG-04 THE STREET TILE: the kerb line is the tile's strongest edge. At cell size the kerb
        becomes its own cell between road and walk, which is what makes a 3-wide street with
        1-cell sidewalks read (rule 34d). His own walk_kerb tile is that cell, cut.
  TG-01 A VEGAS LOT IS BARELY BIGGER THAN ITS HOUSE -- the measurement in finding 3 above.
  CGRD-01 INTO THE BREACH: "sacrifice cool ideas for the sake of clarity every time". At 32 px
        a cell is about a thousand pixels and five kinds must be told apart instantly; each is
        one clear read (flat, a line, a gap, a lens, a lump).
  AH-01 THE BIBLE, and DIRECTION's two-scale card 9/27: at cell size the tone moves off the
        body and onto the ROOM. R4 THE LIGHT WAS IN THE ROOM -- north-west on every cap, every
        mound and every prop, the same corner as every other pixel in this game.
  REUSE CHECK: the ramps, the method, the authority, the tiles, the car and the rubble are all
  read out of the 7/28 approved bank at run time. No ramp is typed here and no cell is invented
  that his bank already holds.

[bb the overworld is battle brothers] reference/library/battle_brothers/02_COMBAT_RULES.md,
  the TERRAIN section: "high ground +10% to hit and ranged range; low ground -10%; forest blocks
  line of sight; swamp costs AP" -- and the note that Paolo 9/24 keeps ONLY high ground for us.
  What that page teaches the DRAWING is that a BB board is read by looking: every tile is one
  thing and the picture never lies about it, which is rule 34b in another game's words. And
  COMBAT's measurement on the same page matters to the mound directly: our one terrain effect
  HAS NEVER FIRED in 160 street fights, because the slab the game built for it was 9.1 tiles
  across with its stair 6.3 tiles away. Under rule 34 the mound is ONE CELL, so it has to read
  as a lump you STEP ONTO in one press. That is why the cover cell is the ground swelling --
  his own dirt, his own ground ramp -- while the prop is a different material (concrete on
  dirt) sitting on top: you can tell what you can climb from what is in your way, by material.
  WHERE BB IS A STILL AND WE MOVE (rule 33g): BB's board is a flat field you place units on
  between turns, finished before anybody steps on it. Ours is a street the character WALKS, one
  cell per press, no turn boundary, no setup -- and the shadow of the house falls across the
  cell you are about to step into.

    python3 tools/bohemia_the_cell_is_the_step_cook_9_27_26.py
      -> banks/BOHEMIA_THE_CELL_TILES_9_27_26.txt
      -> slices/vote/COOK_THE_CELL_IS_THE_STEP.png
"""
import base64
import io
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
OUT_BANK = 'banks/BOHEMIA_THE_CELL_TILES_9_27_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_CELL_IS_THE_STEP.png'
CELL = 32                       # rule 34(d): about 32 px on the glass
ACROSS = 11                     # rule 34(5): a phone shows about 11 cells across
RULER_44 = {'ground': 2.07, 'wall': 1.55}     # DIRECTION 9/23, off his leanest approved art


def die(m): sys.exit('REFUSED: ' + m)


rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]

_B = json.load(open(BANK))
SRC_PX = _B.get('cell_px')
if SRC_PX != 44:
    die('the approved bank no longer says cell_px 44, so the scale argument in this tool\'s '
        'head is out of date and must be re-measured before anything is cut')
RAMPS = {k: [rgb(h) for h in v] for k, v in _B['method']['one_palette_per_family'].items()}
TILES = {t['id']: t for t in _B['tiles']}
SPRITES = {s['id']: s for s in _B['sprites']}

# THE RULER IS A COUNT, NOT A RATE (finding 1). Re-derived from his number every run.
NEED = {k: int(round(v * SRC_PX * SRC_PX / 1000.0)) for k, v in RULER_44.items()}


def load(rec):
    return Image.open(io.BytesIO(base64.b64decode(rec['b64'])))


def colours(im):
    return set(im.convert('RGB').getdata())


def quant(im):
    return set((p[0] >> 3, p[1] >> 3, p[2] >> 3) for p in im.convert('RGB').getdata())


def cut(tile_id, px=CELL):
    """THE LAW'S OWN WORD (rule 34 section 6): the banks CUT TO CELL SIZE. Nearest, because a
       smooth filter would invent colours he never approved and blur a hand-made mark. 44 -> 32
       drops eight of every eleven rows at a fixed phase; on chunky authored material that
       thins a crack and never breaks one, which the colour-survival check proves every run."""
    return load(TILES[tile_id]).convert('RGB').resize((px, px), Image.NEAREST)


def offset_ok(im, fam, slack=6):
    """HIS TILES ARE NOT EXACTLY ON THE RAMP AND THAT IS THE SUN (finding 4). A tile is legal
       if every pixel is a family ramp entry shifted by ONE offset shared across the tile."""
    ramp = RAMPS[fam]
    for d in range(-slack, slack + 1):
        allowed = set(tuple(max(0, min(255, c + d)) for c in e) for e in ramp)
        if colours(im) <= allowed:
            return d
    return None


def roll(im, dx, dy):
    """PER-CELL AUTHORSHIP WITHOUT INVENTING A PIXEL. DIRECTION 9/27: "per-cell damage with
       authorship - a cracked cell next to a whole one, never a repeated stamp". Where he
       drew three variants we use his three. Where he drew one, the cell is his tile with
       its distribution rolled around the torus, which is the bank's own method in its own
       words ("a few cluster shapes repeated with VARIED DISTRIBUTION") and which cannot add
       a colour or move the light, because a roll is a translation and material carries no
       gradient. A tile whose structure runs one way (his kerb's lip) is only rolled along
       the other, so the lip stays on the south and the sun stays north-west."""
    if not dx and not dy:
        return im
    out = Image.new('RGB', im.size)
    out.paste(im, (dx, dy)); out.paste(im, (dx - im.size[0], dy))
    out.paste(im, (dx, dy - im.size[1])); out.paste(im, (dx - im.size[0], dy - im.size[1]))
    return out


def vary(name, x, y):
    """The cell at (x, y): his variant if he drew variants, rolled either way."""
    if name in VARIANTS:
        t = cut(VARIANTS[name][(x * 7 + y * 13) % len(VARIANTS[name])])
    elif name == 'inside':
        t = cut(['concrete_0', 'concrete_1'][(x + y) % 2])
    else:
        t = cut(SOURCE[name])
    dx = (x * 11 + y * 5) % CELL
    dy = 0 if name == 'kerb' else (x * 13 + y * 23) % CELL
    return roll(t, dx, dy)


class R:
    """One seeded stream, so a cell is the same cell every run."""
    def __init__(self, seed): self.s = seed & 0x7fffffff
    def __call__(self):
        self.s = (1103515245 * self.s + 12345) & 0x7fffffff
        return self.s / float(0x7fffffff)
    def i(self, n): return int(self() * n) % n


# ------------------------------------------------------------ the five drawn cells
def wall_cap(variant, nbr=(False, False, False, False), opening=None):
    """A WALL CELL IS HIS STUCCO SEEN FROM ABOVE: the CAP, plus a FACE wherever the wall ends.
    Which faces those are depends on its neighbours, so there is no horizontal tile and no
    vertical tile, there is one rule. The sun is north-west, so a face on the SOUTH or EAST is
    in shadow and the edge on the NORTH or WEST catches it. nbr is (north, east, south, west),
    True where the neighbour is also wall. The material is wall_0/1/2 cut; only the edge is
    drawn, because his bank has no cap at any scale (the camera changed, not the art)."""
    im = roll(cut('wall_%d' % (variant % 3)), variant % CELL, (variant * 7) % CELL).copy()
    px = im.load()
    ramp = RAMPS['stucco']
    lit, dark, black = ramp[len(ramp) - 1], ramp[1], ramp[0]
    n, e, sth, w = nbr
    FACE = max(4, CELL // 4)
    if not w:
        for y in range(CELL):
            for x in range(2): px[x, y] = lit
    if not n:
        for x in range(CELL):
            for y in range(2): px[x, y] = lit
    if not e:
        for y in range(CELL):
            for x in range(CELL - FACE, CELL):
                px[x, y] = dark if x < CELL - 2 else black
    if not sth:
        for x in range(CELL):
            for y in range(CELL - FACE, CELL):
                px[x, y] = dark if y < CELL - 2 else black
    if opening:
        # HIS OWN DOOR'S COLOURS: the dark of the gap and the lit threshold, lifted off
        # door_bottom by value rather than borrowed from another family.
        dc = sorted(colours(cut('door_bottom')), key=LUM)
        gap, sill = dc[0], dc[-1]
        x0, x1 = opening
        for y in range(int(CELL * 0.30), CELL - 4):
            for x in range(x0, x1): px[x, y] = gap
        for x in range(x0, x1):
            for y in range(CELL - 4, CELL): px[x, y] = sill
    return im


def mound_cell(seed):
    """COVER. Rule 33(d) makes the mound the only terrain effect in the whole fight, so it has
       to be unmistakable at 32 px: a lens of his own graded dirt, lit north-west, dark
       south-east, throwing its own shadow. The material is his dirt tile, cut.

       THE FIRST TRY BUILT THE DOME OUT OF DIRT'S OWN FOUR TONES AND IT CAME OUT A SMUDGE.
       His dirt tile is flat ground, so it carries no range to model a lump with. The dome
       is shaded on the GROUND FAMILY RAMP instead, which is the same approved palette his
       dirt is drawn from, seven tones wide instead of four."""
    im = roll(cut('dirt'), seed % CELL, (seed // CELL) % CELL).copy()
    px = im.load()
    ramp = sorted(set(RAMPS['ground']) | colours(im), key=LUM)
    cx = cy = CELL / 2.0
    rr = CELL * 0.40
    for y in range(CELL):
        for x in range(CELL):
            dx, dy = (x - cx) / rr, (y - cy) / rr
            d = dx * dx + dy * dy
            if d > 1.0:
                if 1.0 < d < 1.45 and (dx + dy) > 0.4:
                    px[x, y] = ramp[0]
                continue
            lit = (-dx - dy) / 1.6
            step = int(round((len(ramp) - 1) * (0.45 + lit * 0.45)))
            px[x, y] = ramp[max(1, min(len(ramp) - 1, step))]
    return im


def rubble_cell(which, ground):
    """PROP: a thing in the way that is not a wall. HIS OWN HEAP -- rubble_yard / rubble_road,
       broken masonry off a wall that fell, already drawn. At 1.7 cm a pixel his heap is about
       0.9 m across, which is one cell, so it is cut by the same 44 -> 32 rule as everything
       else and set on the ground cell it is standing on."""
    s = SPRITES[which]
    sp = load(s).convert('RGBA')
    w = max(1, int(round(sp.size[0] * CELL / float(SRC_PX))))
    h = max(1, int(round(sp.size[1] * CELL / float(SRC_PX))))
    sp = sp.resize((w, h), Image.NEAREST)
    sp = snap(sp, 'concrete')
    im = ground.copy()
    im.paste(sp, ((CELL - w) // 2, (CELL - h) // 2 + 2), sp)
    return im


def snap(sp, fam, accents=2):
    """THE BANK'S OWN CRAFT OPERATION, in its own two lines: "every pixel snapped to the
       family ramp by value, then orphans absorbed", and "accents: up to two per tile, taken
       from that tile's own out-of-range pixels, so white paint and dead dark glass survive
       the ramp". So this is not a desaturate. It is his snap, accents and all.

       IT IS NEEDED BECAUSE A FULL-COLOUR SPRITE IS A STICKER AT CELL SIZE. His rubble heap
       arrived carrying 203 distinct colours against the five to eight every cell around it
       carries, and his burnt car arrived saturated rust in a muted block: both read as
       something pasted on top of the world rather than lying in it. Snapped with accents
       kept, they are the same drawings in the world's register."""
    ramp = sorted(RAMPS[fam], key=LUM)
    px = sp.load()
    keep = set()
    if accents:
        # the tile's own out-of-range pixels, the ones furthest from the ramp, by how much
        # of the tile they cover -- so a big pane of dead glass survives and a stray does not
        far = {}
        for y in range(sp.size[1]):
            for x in range(sp.size[0]):
                r, g, b, a = px[x, y]
                if a < 128: continue
                c = (r, g, b)
                d = min(abs(LUM(e) - LUM(c)) + sum(abs(e[i] - c[i]) for i in range(3)) / 3.0
                        for e in ramp)
                if d > 40: far[c] = far.get(c, 0) + 1
            
        keep = set(sorted(far, key=lambda c: -far[c])[:accents])
    out = sp.copy()
    px = out.load()
    for y in range(out.size[1]):
        for x in range(out.size[0]):
            r, g, b, a = px[x, y]
            if a < 128:
                px[x, y] = (0, 0, 0, 0); continue
            # ALPHA IS ON OR OFF. A half-transparent edge pixel blends with whatever it
            # lands on and invents a colour nobody approved -- thirteen of them, measured,
            # off one heap. The cut has no gradients anywhere else either.
            if (r, g, b) in keep:
                px[x, y] = (r, g, b, 255); continue
            v = LUM((r, g, b))
            best = min(ramp, key=lambda c: abs(LUM(c) - v))
            px[x, y] = (best[0], best[1], best[2], 255)
    return out


def car_cells():
    """THE CAR IS ALREADY DRAWN AND IT IS ALREADY FROM ABOVE (finding 2). wreck_road, 192x92,
       his own burnt-out sedan seen from overhead. Cut by the same rule: 192 px at 1.7 cm is
       3.26 m, so the car is FOUR cells long and TWO wide, not rule 34d's 2x1."""
    s = SPRITES['wreck_road']
    sp = load(s).convert('RGBA')
    cw = int(round(sp.size[0] / float(SRC_PX)))        # 4 cells
    ch = int(round(sp.size[1] / float(SRC_PX)))        # 2 cells
    sp = sp.resize((cw * CELL, ch * CELL), Image.NEAREST)
    return snap(sp, 'asphalt'), cw, ch


# ---------------------------------------------------------------- the cells
VARIANTS = {'road': ['road_0', 'road_1', 'road_2'],
            'walk': ['walk_0', 'walk_1', 'walk_2'],
            'yard': ['yard_0', 'yard_1', 'yard_2']}
SOURCE = {'road': 'road_0', 'walk': 'walk_0', 'kerb': 'walk_kerb', 'yard': 'yard_0',
          'inside': 'concrete_0', 'wall': 'wall_0', 'door': 'door_bottom',
          'mound': 'dirt', 'rubble': 'rubble_yard'}
KIND = {'road': 'FLOOR', 'walk': 'FLOOR', 'kerb': 'FLOOR', 'yard': 'FLOOR',
        'inside': 'FLOOR', 'wall': 'WALL', 'door': 'DOOR', 'mound': 'COVER',
        'rubble': 'PROP'}
FAMILY = {'road': 'asphalt', 'walk': 'concrete', 'kerb': 'concrete', 'yard': 'ground',
          'inside': 'concrete', 'wall': 'stucco', 'door': 'stucco', 'mound': 'ground',
          'rubble': 'concrete'}
HOW = {'road': 'CUT', 'walk': 'CUT', 'kerb': 'CUT', 'yard': 'CUT', 'inside': 'CUT',
       'wall': 'DRAWN', 'door': 'DRAWN', 'mound': 'DRAWN', 'rubble': 'CUT'}


def build():
    C = {}
    for name in ('road', 'walk', 'kerb', 'yard', 'inside'):
        C[name] = cut(SOURCE[name])
    C['wall'] = wall_cap(0)
    C['door'] = wall_cap(1, nbr=(False, True, False, True),
                         opening=(int(CELL * 0.28), int(CELL * 0.72)))
    C['mound'] = mound_cell(0x8b8)
    C['rubble'] = rubble_cell('rubble_yard', C['yard'])
    return C


def block():
    """ONE BLOCK WHOLE, AT THE PHONE'S OWN WIDTH (DIRECTION 9/27: "the block is the new unit of
       judging", rule 34 section 5: about 11 cells across). North lot with the law's 4x4 house,
       the street 3 wide with a kerb and a sidewalk each side, the south lot with the cover and
       a prop. The car sits on it as its own object, four cells by two."""
    g = [['yard'] * ACROSS for _ in range(16)]
    for y in range(1, 5):                                     # the house, rule 34d's 4x4
        for x in range(1, 5): g[y][x] = 'wall'
    for y in (2, 3):
        for x in (2, 3): g[y][x] = 'inside'
    g[4][2] = 'door'                                          # facing the street
    g[7][3] = 'rubble'
    g[7][8] = 'mound'
    for x in range(ACROSS): g[8][x] = 'walk'
    for x in range(ACROSS): g[9][x] = 'kerb'
    for y in (10, 11, 12):
        for x in range(ACROSS): g[y][x] = 'road'
    for x in range(ACROSS): g[13][x] = 'kerb'
    for x in range(ACROSS): g[14][x] = 'walk'
    g[15][6] = 'mound'
    return g


def render(grid, C, cars=((11, 3),)):
    h, w = len(grid), len(grid[0])
    im = Image.new('RGB', (w * CELL, h * CELL))
    isw = lambda y, x: (0 <= y < h and 0 <= x < w and grid[y][x] in ('wall', 'door'))
    tiles = {}
    for y in range(h):
        for x in range(w):
            name = grid[y][x]
            # PER-CELL AUTHORSHIP, NEVER A STAMP (DIRECTION 9/27). His own three variants,
            # picked by where the cell IS, so the same block is the same block every run.
            if name in ('wall', 'door'):
                nbr = (isw(y - 1, x), isw(y, x + 1), isw(y + 1, x), isw(y, x - 1))
                op = (int(CELL * 0.28), int(CELL * 0.72)) if name == 'door' else None
                t = wall_cap((x * 5 + y * 3) % 96, nbr=nbr, opening=op)
            elif name == 'rubble':
                t = rubble_cell('rubble_yard' if y < 8 else 'rubble_road', vary('yard', x, y))
            elif name == 'mound':
                t = mound_cell(0x8b8 ^ (x * 131 + y * 17))
            else:
                t = vary(name, x, y)
            im.paste(t, (x * CELL, y * CELL))
            tiles.setdefault(name, []).append(t.tobytes())
    # ---- THE HOUSE THROWS A SHADOW ON THE GROUND, AND WITHOUT ONE IT WAS PAINTED ON.
    # The first block read as a pale tan ring lying flat on a pale tan yard. The temptation
    # was to push the wall's contrast, and this lane has learned twice over that "it does
    # not read" is almost never a contrast problem. It was a DRAWING problem: every other
    # object in this game throws a shadow (the mound does, the heap does, his own car has
    # one baked in) and the house threw none, so nothing said it was standing up. The sun
    # is north-west, so the whole footprint casts south-east, one third of a cell, onto
    # whatever floor is there. A shadow never changes what a cell IS -- shadowed floor is
    # still floor you walk on -- so the grid stays honest (rule 34b).
    OFF = int(CELL * 0.34)
    solid = set()
    for y in range(h):
        for x in range(w):
            if grid[y][x] in ('wall', 'door'):
                for yy in range(y * CELL, (y + 1) * CELL):
                    for xx in range(x * CELL, (x + 1) * CELL):
                        solid.add((xx + OFF, yy + OFF))
    px = im.load()
    for y in range(h):
        for x in range(w):
            if grid[y][x] in ('wall', 'door'): continue
            ramp = sorted(RAMPS[FAMILY.get(grid[y][x], 'ground')], key=LUM)
            for yy in range(y * CELL, (y + 1) * CELL):
                for xx in range(x * CELL, (x + 1) * CELL):
                    if (xx, yy) not in solid: continue
                    v = LUM(px[xx, yy]) * 0.68
                    px[xx, yy] = min(ramp, key=lambda c: abs(LUM(c) - v))

    sp, cw, ch = car_cells()
    for (cy, cx) in cars:
        im.paste(sp, (cx * CELL, cy * CELL), sp)
    return im, tiles, (cw, ch)


def cpk(im):
    return 1000.0 * len(quant(im)) / (im.size[0] * im.size[1])


# ---------------------------------------------------------------------- the card
def text(d, xy, s, fill, font):
    d.text(xy, s, fill=fill, font=font)


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(C, blk, tiles, carcells, notes):
    INK, PAPER, DIM = (238, 230, 214), (26, 23, 20), (150, 138, 120)
    HOT = (222, 181, 118)
    Z = 3
    W = 1180
    f, fs, fb = font(15), font(12), font(22)
    im = Image.new('RGB', (W, 1820), PAPER)
    d = ImageDraw.Draw(im)
    y = 26
    text(d, (30, y), 'THE CELL IS THE STEP', INK, fb); y += 30
    text(d, (30, y), 'COOK [cell tiles] round 1  9/27  rule 34: the banks CUT to cell size',
         HOT, f); y += 22
    text(d, (30, y), 'His 7/28 bank was already drawn at 0.75 m a cell. Only the glass size '
         'changes: 32 px, not 44. These are HIS pixels.', DIM, fs); y += 28

    # ---- the nine cells, each beside the 7/28 tile it came from (DIRECTION 9/27 s5)
    text(d, (30, y), 'EVERY CELL BESIDE THE 7/28 ART IT CAME FROM', INK, f); y += 20
    text(d, (30, y), 'left = his approved 44 px tile    right = the 32 px cell', DIM, fs)
    y += 22
    x = 30
    top = y
    for i, name in enumerate(['road', 'walk', 'kerb', 'yard', 'inside',
                              'wall', 'door', 'mound', 'rubble']):
        if i == 5:
            x = 30; top = y + CELL * Z + 46
        cx = x
        src = load(TILES[SOURCE[name]]).convert('RGB') if SOURCE[name] in TILES else None
        if src is None:
            sp = load(SPRITES[SOURCE[name]]).convert('RGBA')
            src = Image.new('RGB', (SRC_PX, SRC_PX), sorted(colours(cut('yard_0')), key=LUM)[3])
            src.paste(sp, ((SRC_PX - sp.size[0]) // 2, (SRC_PX - sp.size[1]) // 2), sp)
        s2 = src.resize((CELL * Z, CELL * Z), Image.NEAREST)
        im.paste(s2, (cx, top))
        im.paste(C[name].resize((CELL * Z, CELL * Z), Image.NEAREST), (cx + CELL * Z + 6, top))
        lab = '%s  %s' % (name.upper(), KIND[name])
        text(d, (cx, top + CELL * Z + 4), lab, INK, fs)
        text(d, (cx, top + CELL * Z + 18), '%s %s' % (HOW[name], SOURCE[name]),
             HOT if HOW[name] == 'DRAWN' else DIM, fs)
        x += CELL * Z * 2 + 32
    y = top + CELL * Z + 44
    text(d, (30, y), 'DRAWN means the overhead camera has no source: his wall is a FACE, the '
         'close grid needs a CAP. Material still his.', DIM, fs); y += 26

    # ---- one block whole, the phone's own width
    text(d, (30, y), 'ONE BLOCK WHOLE, AT THE PHONE\'S OWN WIDTH (11 cells across)', INK, f)
    y += 20
    bz = 2
    bw, bh = blk.size[0] * bz, blk.size[1] * bz
    im.paste(blk.resize((bw, bh), Image.NEAREST), (30, y))
    text(d, (30, y + bh + 4), 'twice size, so you can see the cells', DIM, fs)
    bx = 30 + bw + 28
    im.paste(blk, (bx, y))
    text(d, (bx, y + blk.size[1] + 4), 'GAME SIZE, on the glass, 11 cells across', INK, fs)
    ly = y + blk.size[1] + 28
    for line in ['ONE CELL = 0.75 m = ONE STEP',
                 'one pixel = 2.3 cm',
                 '11 cells across = 8.25 m',
                 '',
                 'HOW BIG IS A CELL, REALLY?',
                 'the law gives six numbers and they',
                 'do not agree. each one, and the',
                 'cell size it forces:',
                 '',
                 '  one cell per step     0.75 m',
                 '  your 7/28 tile bank   0.75 m',
                 '  your drawn car 4x2    0.80 m',
                 '  - - - - - - - - - - - - - -',
                 '  a car at 2x1          2.25 m',
                 '  a house at 4x4        2.90 m',
                 '',
                 'YOUR OWN SENTENCE AND YOUR OWN',
                 'TWO DRAWINGS ALL SAY 0.75.',
                 'the two round numbers say 3.',
                 '',
                 'AND AT 3 m A CELL YOUR WHOLE 7/28',
                 'BANK IS AT THE WRONG SIZE BY FOUR',
                 'AND HAS TO BE DRAWN AGAIN. at 0.75',
                 'it cuts straight across, which is',
                 'what this whole page is.',
                 '',
                 'LOOK AT THE CAR AND THE HOUSE:',
                 'the car is as long as the house.',
                 'that is the 4x4 being wrong,',
                 'not the car.']:
        hot = line.startswith(('HOW', 'YOUR', 'AND AT', 'BANK', 'LOOK', '  one', '  your',
                               '  a car', '  a house', 'the car', 'that is', 'BAND'))
        text(d, (bx, ly), line, HOT if hot else (INK if line[:1].isupper() else DIM), fs)
        ly += 16
    y += bh + 30

    for line in notes:
        text(d, (30, y), line, INK if line and line[0] != ' ' else DIM, fs); y += 16
    return im.crop((0, 0, W, min(1820, y + 24)))


def main():
    pad = lambda s, n: (s + ' ' * n)[:n]
    print('THE BANK WAS ALREADY AT THE CELL: it declares cell_px %d and "1 px = 1.7 cm, '
          'because CELL_M = 0.75". Only the glass changes: %d, not %d.'
          % (SRC_PX, CELL, SRC_PX))
    print('THE RULER IS A COUNT, NOT A RATE: %.2f/kpx on a %d px tile is %d colours (ground), '
          '%.2f is %d (wall). At %d px the same counts read %.2f and %.2f per kpx.'
          % (RULER_44['ground'], SRC_PX, NEED['ground'], RULER_44['wall'], NEED['wall'], CELL,
             1000.0 * NEED['ground'] / (CELL * CELL), 1000.0 * NEED['wall'] / (CELL * CELL)))
    print()

    # ---- THE CUT LOSES NOTHING
    lost = []
    for tid in sorted(set(list(SOURCE.values()) + sum(VARIANTS.values(), []) + ['wall_1', 'wall_2'])):
        if tid not in TILES: continue
        a = colours(load(TILES[tid]).convert('RGB'))
        b = colours(cut(tid))
        if not b <= a:
            die('%s: the cut invented %d colours he never approved' % (tid, len(b - a)))
        if b != a:
            lost.append((tid, len(a), len(b)))
    if lost:
        for tid, a, b in lost:
            print('  cut lost colour: %s %d -> %d' % (tid, a, b))
        die('the 44 -> 32 cut dropped a colour from %d of his tiles, so it is not a clean cut '
            'and the cells would not be his art any more' % len(lost))
    print('THE CUT LOSES NOTHING: every distinct colour of every source tile survives 44 -> 32.')
    print()

    C = build()
    print(pad('cell', 9) + pad('kind', 7) + pad('how', 6) + pad('7/28 source', 14)
          + pad('colours', 9) + pad('floor', 7) + 'sun offset off the family ramp')
    rows = []
    for name in ('road', 'walk', 'kerb', 'yard', 'inside', 'wall', 'door', 'mound', 'rubble'):
        im = C[name]
        n = len(quant(im))
        need = NEED['wall'] if KIND[name] in ('WALL', 'DOOR') else NEED['ground']
        off = offset_ok(im, FAMILY[name])
        print(pad(name, 9) + pad(KIND[name], 7) + pad(HOW[name], 6) + pad(SOURCE[name], 14)
              + pad(str(n), 9) + pad(str(need), 7)
              + ('ramp %+d' % off if off is not None
                 else 'his drawing, ramp plus its own ink'))
        if n < need:
            die('%s carries %d distinct colours against a floor of %d. THE RULER IS A COUNT: '
                'DIRECTION\'s %.2f per kpx was measured on a %d px tile and means %d colours, '
                'and a %d px cell has to carry the same %d.'
                % (name, n, need, RULER_44['ground'], SRC_PX, need, CELL, need))
        rows.append((name, KIND[name], HOW[name], SOURCE[name], n, need))
    print()

    # ---- EVERY PIXEL IS HIS
    for name in ('road', 'walk', 'kerb', 'yard', 'inside'):
        if not colours(C[name]) <= colours(load(TILES[SOURCE[name]]).convert('RGB')):
            die('%s is a CUT cell but carries a colour its source tile does not' % name)
    stucco = colours(cut('wall_0')) | colours(cut('wall_1')) | colours(cut('wall_2')) \
        | colours(cut('door_bottom')) | set(RAMPS['stucco'])
    for name in ('wall', 'door'):
        extra = colours(C[name]) - stucco
        if extra:
            die('%s carries %d colours that are neither his stucco tiles nor the stucco ramp'
                % (name, len(extra)))
    if not colours(C['mound']) <= (colours(cut('dirt')) | set(RAMPS['ground'])):
        die('the mound carries a colour that is neither his dirt tile nor the ground ramp')
    acc = colours(C['rubble']) - (colours(cut('yard_0')) | set(RAMPS['concrete']))
    if len(acc) > 2:
        die('the rubble carries %d colours off the concrete ramp. The bank allows "up to two '
            'per tile, taken from that tile\'s own out-of-range pixels", and this is %d'
            % (len(acc), len(acc)))
    if not acc <= colours(load(SPRITES['rubble_yard']).convert('RGB')):
        die('the rubble\'s accents are not off its own drawing')
    print('EVERY PIXEL IS HIS: the cut cells are subsets of their source tiles; the drawn '
          'cells are subsets of his own material plus its family ramp; the snapped heap is '
          'the concrete ramp, which is the bank\'s own craft operation.')

    # ---- A WALL SHOWS ITSELF, AND SO DOES A DOOR (rule 34b)
    def rowlum(im, y):
        p = im.load()
        return sum(LUM(p[x, y]) for x in range(im.size[0])) / float(im.size[0])

    def dark_edge(im):
        """WHAT MAKES A WALL LOOK UNPRESSABLE IS A FULL EDGE THAT IS DARK, and it took three
           tries to measure that instead of something that correlates with it. The first
           guard compared the wall's bottom row to the YARD's top row and called two
           different floor MATERIALS an edge. The second took the biggest row-to-row jump
           inside one cell, and his cracked concrete beat the wall 95 to 86, because a black
           weed crack is a bigger jump than a stucco face. The third counted the SHARE of
           lines across an edge that step, and his KERB came in at 66% -- because a kerb
           really does have a full edge, that is the whole reason rule 34 gives it its own
           cell. The thing no floor has is a full edge that is DARK: the sun is north-west,
           so a wall's south and east faces are in shadow and a kerb's lip is LIT. Returns
           (share of that edge's lines that step, the mean signed step), darkest edge."""
        FACE = max(4, CELL // 4)
        p = im.load()
        best = (0.0, 0.0)
        for edge in range(4):
            hits, steps = 0, []
            for i in range(CELL):
                if edge == 0:                                   # south face
                    out = [p[i, y] for y in range(CELL - FACE, CELL)]
                    inn = [p[i, y] for y in range(CELL - 2 * FACE, CELL - FACE)]
                elif edge == 1:                                 # east face
                    out = [p[x, i] for x in range(CELL - FACE, CELL)]
                    inn = [p[x, i] for x in range(CELL - 2 * FACE, CELL - FACE)]
                elif edge == 2:                                 # north edge
                    out = [p[i, y] for y in range(0, FACE)]
                    inn = [p[i, y] for y in range(FACE, 2 * FACE)]
                else:                                           # west edge
                    out = [p[x, i] for x in range(0, FACE)]
                    inn = [p[x, i] for x in range(FACE, 2 * FACE)]
                a = sum(LUM(c) for c in out) / float(len(out))
                b = sum(LUM(c) for c in inn) / float(len(inn))
                steps.append(a - b)
                if abs(a - b) >= 15: hits += 1
            m = sum(steps) / float(len(steps))
            if m <= -12 and (hits / float(CELL)) > best[0]:
                best = (hits / float(CELL), m)
        return best
    share, step = dark_edge(C['wall'])
    if share < 0.9 or step > -12:
        die('a wall does not show itself: its darkest full edge is %.0f%% of a line at %+.1f '
            'value, and a wall needs a whole edge in shadow' % (100 * share, step))
    for n in ('road', 'walk', 'kerb', 'yard', 'inside'):
        fs, fm = dark_edge(C[n])
        if fs >= 0.9 and fm <= -12:
            die('%s is a FLOOR cell and it carries a full dark edge like a wall does, so the '
                'eye cannot tell them apart' % n)
    print('A WALL SHOWS ITSELF: its south face is a whole edge in shadow, %.0f%% of the line '
          'at %+.1f value, and no floor cell carries one. The kerb has a full edge too and it '
          'is LIT, because the sun is north-west: a lip you step off, never a face you stop '
          'at.' % (100 * share, step))
    wp, dp = C['wall'].load(), C['door'].load()
    diff = sum(1 for y in range(CELL) for x in range(CELL) if wp[x, y] != dp[x, y])
    pct = 100.0 * diff / (CELL * CELL)
    if pct < 25:
        die('a door does not show itself: only %.0f%% of it differs from the wall' % pct)
    print('A DOOR SHOWS ITSELF: %.0f%% of its pixels differ from the wall it sits in.' % pct)

    # ---- YOU CAN TELL WHAT YOU CAN CLIMB FROM WHAT IS IN YOUR WAY, BY MATERIAL.
    # COMBAT measured that the one terrain effect in this game has never fired in 160 street
    # fights (02_COMBAT_RULES.md, the terrain section), and rule 34 shrinks it to ONE CELL, so
    # the cover cell has to read as a lump you STEP ONTO in one press. It does that by being
    # the GROUND SWELLING -- his own dirt, his own ground ramp -- while the prop is a foreign
    # material sitting on the ground. Same rule as BB's board: a tile is one thing and the
    # drawing never lies about it.
    if FAMILY['mound'] != FAMILY['yard']:
        die('COVER is not the same material as the floor it sits on, so it reads as a thing in '
            'the way instead of ground you can step onto')
    if FAMILY['rubble'] == FAMILY['yard']:
        die('PROP is the same material as the floor it sits on, so nothing says it stops you')
    mv = sum(LUM(c) for c in colours(C['mound'])) / float(len(colours(C['mound'])))
    rv = sum(LUM(c) for c in colours(C['rubble'])) / float(len(colours(C['rubble'])))
    print('COVER AND PROP DO NOT READ THE SAME: the mound is the ground swelling, %s on %s at '
          '%.0f value; the heap is %s on %s at %.0f. You can tell what you can climb from what '
          'is in your way, by material.'
          % (FAMILY['mound'], FAMILY['yard'], mv, FAMILY['rubble'], FAMILY['yard'], rv))

    # ---- the block, and the checks that only a whole block can carry
    g = block()
    blk, tiles, carcells = render(g, C)

    def reaches(grid):
        h, w = len(grid), len(grid[0])
        walk = lambda n: n in ('road', 'walk', 'kerb', 'yard', 'inside', 'door')
        seen, stack = set(), [(10, 0)]
        while stack:
            y, x = stack.pop()
            if (y, x) in seen or not (0 <= y < h and 0 <= x < w): continue
            if not walk(grid[y][x]): continue
            seen.add((y, x))
            stack += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
        missed = [(y, x) for y in range(h) for x in range(w)
                  if walk(grid[y][x]) and (y, x) not in seen]
        return seen, missed
    seen, missed = reaches(g)
    if missed:
        die('%d floor cells cannot be reached from the road, the first at %r. Rule 34b: every '
            'floor region connects to the street.' % (len(missed), missed[0]))
    print('EVERY FLOOR REGION CONNECTS TO THE STREET: %d floor cells, all reached from the '
          'road, the house\'s inside only through its door.' % len(seen))
    sealed = [r[:] for r in g]
    sealed[4][2] = 'wall'
    if not reaches(sealed)[1]:
        die('the connection guard does not bite: walling the door up left everything reachable')
    print('AND THE GUARD BITES: walling that door up strands %d cells, so the check is proved '
          'and not just passed.' % len(reaches(sealed)[1]))

    # ---- NOTHING IS STAMPED (DIRECTION 9/27)
    stamped = []
    for name, ts in sorted(tiles.items()):
        if len(ts) > 1 and len(set(ts)) == 1:
            stamped.append(name)
        print('  %s: %d cells, %d distinct pictures' % (pad(name, 7), len(ts), len(set(ts))))
    if stamped:
        die('%s render as ONE repeated stamp. DIRECTION 9/27: per-cell damage with authorship, '
            'a cracked cell next to a whole one, never a repeated stamp.' % ', '.join(stamped))
    print('NOTHING IS STAMPED: every class with more than one cell renders more than one '
          'picture, out of his own variants and the derived edges.')

    # ---- AND NOTHING DRUMS. Counting distinct pictures is the weak form of the no-stamp
    # rule: twenty-two different cells can still beat like a drum if the same mark lands on
    # the same beat. This lane learned that on an arterial grid and it is measurable, so it
    # is a gate here. Across each band, correlate the column brightness with itself at every
    # lag; if the cell period is where the strongest echo sits, the street has a pulse in it.
    bp = blk.load()
    for y0, label in ((8 * CELL, 'walk'), (9 * CELL, 'kerb'), (10 * CELL, 'road'),
                      (0, 'yard')):
        cols = [sum(LUM(bp[x, yy]) for yy in range(y0, y0 + CELL)) / float(CELL)
                for x in range(blk.size[0])]
        mu = sum(cols) / len(cols)
        v = [c - mu for c in cols]
        den = sum(a * a for a in v) or 1.0
        ac = {lag: sum(v[i] * v[i + lag] for i in range(len(v) - lag)) / den
              for lag in range(1, 2 * CELL + 1)}
        beat = max(ac[CELL], ac[2 * CELL])
        loud = max(ac.values())
        if beat >= loud - 1e-9:
            die('the %s band drums: its strongest echo is at the cell period, so the street '
                'has a pulse in it even though every cell is a different picture' % label)
        print('  %s band: echo at the cell is %+.2f, the loudest echo anywhere is %+.2f'
              % (pad(label, 5), beat, loud))
    print('AND NOTHING DRUMS: on every band the cell period is not where the echo sits, so '
          'the repeat is invisible and not just absent from a count.')

    # ---- the card
    notes = [
        'WHAT THE MEASURING FOUND',
        ' 1  the density floor was not scale-free. %.2f per kpx is FOUR colours on a 44 px '
        'tile and %.2f per kpx on a 32 px one.' % (RULER_44['ground'],
                                                   1000.0 * NEED['ground'] / (CELL * CELL)),
        '    checking a 32 cell against the 44 number passes art one colour leaner than his. '
        'the ruler is a count now.',
        ' 2  the car was already drawn, from above, in his own bank, and it measures %d by %d '
        'cells. the law\'s default says 2 by 1.' % carcells,
        ' 3  a house at 4 by 4 cells is 3 m square, and its inside is a 1.5 m room. a small '
        'Vegas house is about 15 by 17 cells.',
        ' 3b THE LAW\'S SIX NUMBERS IMPLY THREE DIFFERENT CELL SIZES. one cell per step says '
        '0.75 m, his own tile bank says 0.75, his own',
        '    drawn car says 0.80; a car at 2x1 says 2.25 and a house at 4x4 says 2.90. this '
        'cut takes the step, because it is the sentence',
        '    he actually said and because his own two drawings agree with it. COMBAT shipped '
        '3 m this same round, off the house number.',
        '    ONE OF US IS DRAWING AT THE WRONG SIZE and it is a number for him, not for a '
        'lane. at 3 m the whole 7/28 bank is redrawn.',
        '    the block above is drawn to the law\'s default so it is the law\'s block. the '
        'number belongs to the honest grid row.',
        ' 4  his tiles sit a little off the family ramp and that is the sun: road +2, walk +3, '
        'wall -3. one offset per tile.',
    ]
    im = card(C, blk, tiles, carcells, notes)
    im.save(OUT_CARD)

    def b64(im):
        buf = io.BytesIO()
        im.save(buf, 'PNG')
        return base64.b64encode(buf.getvalue()).decode('ascii')

    out = {
        'bank': 'THE CELL TILES', 'date': '9/27/26', 'law': 'rule 34',
        'cut_from': BANK, 'authority': _B.get('authority'),
        'cell_px': CELL, 'cell_m': 0.75, 'src_cell_px': SRC_PX,
        'phone_cells_across': ACROSS,
        'ruler': {'measured_at_px': SRC_PX, 'per_kpx': RULER_44, 'as_counts': NEED,
                  'why': 'colours per kpx is not scale free; the ruler is a count of distinct '
                         '8-quantised colours per cell'},
        'cells': [{'id': n, 'kind': k, 'how': h, 'source': s, 'colours': c, 'floor': f,
                   'b64': b64(C[n])} for n, k, h, s, c, f in rows],
        'block': {'across': ACROSS, 'down': len(g), 'kinds': KIND, 'map': g,
                  'car_at': [[11, 3]], 'b64': b64(blk),
                  'note': 'ONE BLOCK WHOLE (DIRECTION 9/27): the drawing and this map agree '
                          'cell for cell, every floor cell is reachable from the road, and '
                          'the house casts south-east because the sun is north-west'},
        'variants': VARIANTS,
        'house': {'cells': [4, 4], 'metres': [3.0, 3.0], 'inside': [2, 2],
                  'note': 'rule 34d default, drawn as the law says; a real small house is '
                          'about 15x17 cells and is WORLD [honest grid]\'s number'},
        'car': {'cells': list(carcells), 'metres': [carcells[0] * 0.75, carcells[1] * 0.75],
                'source': 'wreck_road', 'law_default': [2, 1],
                'note': 'his own overhead drawing, cut by the same rule'},
        'street': {'road': 3, 'kerb': 1, 'walk': 1},
        # RULE 34'S FIVE KINDS AGAINST THE ENGINE'S OWN TABLE, so this bank binds to what is
        # already wired instead of running beside it. KIND_LAYER in engine/bohemia_district_kit.js
        # (the table LIFE+CITY gated on 9/27) maps a legend kind to {layer, solid}. Four of the
        # five kinds are already in it. COVER IS NOT IN THE TABLE AT ALL -- there is no kind and
        # no encoding for the one terrain effect this game keeps, which is COMBAT's and WORLD's
        # to name, not the art's. Checked against that file, not remembered.
        'kinds_against_the_engine': {
            'FLOOR': {'kinds': ['ground', 'drive', 'walk', 'marking', 'turf-dead',
                                'water-dead', 'water', 'court', 'play'],
                      'engine': {'layer': 'ground', 'solid': False}},
            'WALL': {'kinds': ['building', 'structure', 'fence', 'panel'],
                     'engine': {'layer': 'structure', 'solid': True}},
            'DOOR': {'kinds': ['gate', 'portal'],
                     'engine': {'layer': 'portal', 'solid': False}},
            'PROP': {'kinds': ['prop', 'vehicle', 'tree-dead'],
                     'engine': {'layer': 'prop', 'solid': True}},
            'COVER': {'kinds': [], 'engine': None,
                      'note': 'NOT IN KIND_LAYER. The mound is drawn and it is the only '
                              'terrain effect rule 33d keeps, and the engine has no kind for '
                              'it. COMBAT [fight on the grid] and WORLD [honest grid] name it; '
                              'the art is ready either way.'},
        },
        'method': {
            'cut': 'nearest 44 -> 32, which drops rows and never blurs; every distinct '
                   'colour of every source tile survives it, checked each run',
            'per_cell': 'his own variants where he drew them, and a torus roll of his own '
                        'tile where he did not, so no cell is a stamp and no band drums',
            'snap': 'the bank\'s own craft operation for a full-colour sprite in the cell '
                    'grid: every pixel to the family ramp by value, up to two accents kept '
                    'off the sprite\'s own out-of-range pixels, alpha on or off never '
                    'between (a half-transparent edge invents colours: 13 measured)',
            'shadow': 'a wall casts south-east one third of a cell onto whatever floor is '
                      'there, because the sun is north-west; a shadowed floor cell is still '
                      'floor, so the grid stays honest',
        },
        'proved': ['the cut loses no colour of any source tile',
                   'every cut cell is a subset of its source tile',
                   'every drawn cell is a subset of his material plus its family ramp',
                   'the ruler as a count, ground %d, wall %d' % (NEED['ground'], NEED['wall']),
                   'a wall shows itself against the floor beside it',
                   'a door shows itself against the wall it sits in',
                   'every floor region connects to the street, and the guard bites',
                   'nothing is stamped: every repeated class renders more than one picture',
                   'nothing drums: on no band is the cell period where the echo sits',
                   'cover is the floor\'s own material swelling, the prop is not'],
    }
    open(OUT_BANK, 'w').write(json.dumps(out, indent=1))
    print()
    print('wrote %s  (%d KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) // 1024))
    print('wrote %s  (%d KB)' % (OUT_CARD, os.path.getsize(OUT_CARD) // 1024))


if __name__ == '__main__':
    main()
