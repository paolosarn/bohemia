#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [the three bosses' map pieces, finished] (11/14/26; the coordinator's turn-up round, job 2, VAMILY rules
447 and 441: 'finished art where this round's VOTE cards still say STAND-IN and he will meet it first: the three new bosses'
map changes (the Locksmith's gates, the Charge's mines, the Machinist's nails)').

BOSSES built what these three do to the map and painted a first piece for each (tools/bohemia_bosses_seven_to_nine_places_11_11_26.py:
curfew, mine, nails), through the map's rig, and its three VOTE cards say STAND-IN. He voted YES on all three. This is the
production artist's pass on the SAME seven pictures, the same file names, the same frame, the same rig, the same two beat
frames: PICTURES ONLY. Nothing of BOSSES' code or rules is edited; its tool is imported for its capture, its render and its
colours, and slices/boss_places/boss_places.json keeps every key (only these seven entries' own measurements are rewritten,
the way BOSSES' finish() writes them).

WHAT A PIECE IS: one street block across on the map (a block is 116 picture pixels, about nine pixels a metre), so a thing
under a third of a metre is nothing. Every part here is drawn to be read at that size on a phone:
  CURFEW  THE LOCKSMITH's gate across a street.
          NIGHT: two framed chain-link panels shut kerb to kerb (a frame, a rail, a brace: a gate, not a grey card), razor
          wire along the top, concrete feet under the posts, his chain and a brass padlock a hand could not close on, his KEY
          painted on a board on the left panel, and a red lamp on the right post that is lit while the street is shut.
          DAY: the panels swung back along the kerbs, the chain hanging off the post with the padlock on it, the lamp dark.
          AFTER: one panel down flat on the street and bent, the chain in two pieces, the bolt cutters left where they did it,
          the lamp in the road.
  MINE    THE CHARGE's mine, once you know it is there.
          BEFORE: dug dirt (no square: three spade-loads), the mound over the can, clods, his stake with a red rag, a red wire
          out of the dirt to the kerb. AFTER: the hole and the ring of dirt thrown out of it, the spoil heap with the spade
          stood in it, the can out of the ground with its lid off and its wires cut, the stake thrown down.
  NAILS   THE MACHINIST's nails across a street.
          BEFORE: nails in bands kerb to kerb, his welded caltrops big enough to see (pale steel), a shredded tyre and a strip
          of it, a cart's wheel that came off here and a sack somebody dropped to run (small: the piece lies on every nailed
          block, and a whole cart was the same cart a dozen times on the map).
          AFTER: swept: two clean cart tracks, the swept heap at the kerb, the broom and the bucket of nails.

  python3 tools/bohemia_cook5_the_bosses_map_pieces_finished_11_14_26.py scenes
  BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_cook5_the_bosses_map_pieces_finished_11_14_26.py render   (about 20 s a piece)
  python3 tools/bohemia_cook5_the_bosses_map_pieces_finished_11_14_26.py finish        (the fourteen pictures and their seven entries)
  python3 tools/bohemia_cook5_the_bosses_map_pieces_finished_11_14_26.py sheet <before_dir>   (the VOTE card's picture)

REFERENCE CHECK (the 9/4 standing duty; compared to the world before calling it done): a construction site's chain-link swing
gate (a tube frame with a mid rail and a diagonal brace, mesh inside it, concertina wire on top, precast feet, a 13 mm chain and
a laminated padlock, a red battery hazard lamp on the post); a buried improvised charge as the men who clear them describe it
(disturbed soil of another colour, a marker stick, a command wire to the roadside; cleared: the hole, the spoil, the container
out and its wires cut); road caltrops welded from four points of rebar, the shredded carcass of a truck tyre, a market
handcart on bicycle wheels; a street swept by hand (a heap at the kerb, a push broom, a bucket). The twins are BOSSES' own
seven pieces at the same scale (the sheet shows them side by side) and THE CHECKPOINT (THE NEXT THREE's frame).
REUSE CHECK (REUSE-FIRST): BOSSES' capture for a piece on a street block (bohemia_bosses_the_next_three_11_10_26.capture), its
render through the map's rig (bohemia_bosses_seven_to_nine_places_11_11_26.render), its over() and blob() for the beat frames and
its colours are imported and used as they are; the scene builder is the district hero factory's (bohemia_iso3d.Scene). Only the
seven scenes and where their lights sit are new.
ANALOG HORROR: a red lamp that is only lit while the street is locked; a rag on a stick over dirt of the wrong colour; a wheel
and a dropped sack in a street of nails, and nobody.
No reference game.
"""
import os, sys, json, math, pickle
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_bosses_seven_to_nine_places_11_11_26 as ST      # BOSSES' (imported, never edited)

PB, NT = ST.PB, ST.NT
OUT = os.path.join(R, 'records/target/cook5_bosses')
DEST = ST.DEST
STEEL, STEEL_DK, CONC, CONC_DK = ST.STEEL, ST.STEEL_DK, ST.CONC, ST.CONC_DK
BRASS, CHAIN, RAG, STICK, WIRE, NAIL, TYRE = ST.BRASS, ST.CHAIN, ST.RAG, ST.STICK, ST.WIRE, ST.NAIL, ST.TYRE
DIRT, DIRT_DK, TIN, TIN_DK, CRATE, CRATE_DK = ST.DIRT, ST.DIRT_DK, ST.TIN, ST.TIN_DK, ST.CRATE, ST.CRATE_DK
BUCKET, BUCKET_DK, BROOM = ST.BUCKET, ST.BUCKET_DK, ST.BROOM
MESH, MESH_DK = (150, 152, 146), (118, 120, 116)             # the chain link: paler than its frame, so the frame reads
FRAME = (58, 60, 60)
RAZOR, RAZOR_DK = (176, 178, 172), (92, 94, 92)
BOARD, PAINT = (52, 46, 40), (224, 218, 204)
LAMP, LAMP_OFF = (150, 34, 26), (74, 30, 26)
GRIP = (170, 44, 34)
HOLE = (34, 28, 24)
DIRT_LT = (142, 126, 102)
MOUND_DK = (112, 98, 78)                                      # a heap's shaded side: near its top's tone, so a heap is a heap and not rings
CALTROP = (168, 170, 164)                                     # his welded points, pale so they are seen
SACK, SACK_DK = (156, 140, 108), (120, 106, 80)
TRACK, SWEPT = (50, 47, 43), (98, 94, 86)                      # swept asphalt a little paler than the street, never paint
C = lambda c: {'c': c}


# ---------------------------------------------------------------------------------------------------- the parts
def panel_x(s, x0, y, w, h=2.3, z=0.12, sign=False):
    """a framed chain-link gate panel across the street (its face the camera sees is +y): the mesh, the tube frame, a mid rail, a brace"""
    s.box((x0, y, z), (w, 0.06, h), C(MESH))
    for k in range(1, int(w / 0.6)): s.box((x0 + k * 0.6, y + 0.06, z), (0.05, 0.02, h), C(MESH_DK))          # the mesh's posts' shadow lines
    f = y + 0.06
    s.box((x0, f, z + h - 0.14), (w, 0.08, 0.14), C(FRAME)); s.box((x0, f, z), (w, 0.08, 0.14), C(FRAME))
    s.box((x0, f, z), (0.14, 0.08, h), C(FRAME)); s.box((x0 + w - 0.14, f, z), (0.14, 0.08, h), C(FRAME))
    s.box((x0, f, z + h * 0.5), (w, 0.08, 0.09), C(FRAME))
    s.quad((x0 + 0.1, f + 0.085, z + 0.1), (x0 + 0.3, f + 0.085, z + 0.1), (x0 + w - 0.1, f + 0.085, z + h - 0.1), (x0 + w - 0.3, f + 0.085, z + h - 0.1), C(FRAME), (0, 1, 0))
    if sign:                                                   # his key, painted on a board wired to the mesh
        bx, bz = x0 + 0.75, z + 0.75
        s.box((bx, f + 0.09, bz), (2.0, 0.06, 1.0), C(BOARD))
        g = f + 0.16
        s.box((bx + 0.7, g, bz + 0.42), (1.05, 0.02, 0.16), C(PAINT))                                        # the shaft
        s.box((bx + 1.45, g, bz + 0.2), (0.14, 0.02, 0.24), C(PAINT)); s.box((bx + 1.2, g, bz + 0.24), (0.14, 0.02, 0.2), C(PAINT))   # the bits
        for (dx, dz, w_, h_) in ((0.2, 0.26, 0.5, 0.12), (0.2, 0.62, 0.5, 0.12), (0.2, 0.26, 0.12, 0.48), (0.58, 0.26, 0.12, 0.48)):   # the bow, a ring
            s.box((bx + dx, g, bz + dz), (w_, 0.02, h_), C(PAINT))


def panel_y(s, x, y0, w, h=2.3, z=0.12, sign=False):
    """the same panel swung back along the kerb (its face the camera sees is +x)"""
    s.box((x, y0, z), (0.06, w, h), C(MESH))
    for k in range(1, int(w / 0.6)): s.box((x + 0.06, y0 + k * 0.6, z), (0.02, 0.05, h), C(MESH_DK))
    f = x + 0.06
    s.box((f, y0, z + h - 0.14), (0.08, w, 0.14), C(FRAME)); s.box((f, y0, z), (0.08, w, 0.14), C(FRAME))
    s.box((f, y0, z), (0.08, 0.14, h), C(FRAME)); s.box((f, y0 + w - 0.14, z), (0.08, 0.14, h), C(FRAME))
    s.box((f, y0, z + h * 0.5), (0.08, w, 0.09), C(FRAME))
    s.quad((f + 0.085, y0 + 0.3, z + 0.1), (f + 0.085, y0 + 0.1, z + 0.1), (f + 0.085, y0 + w - 0.3, z + h - 0.1), (f + 0.085, y0 + w - 0.1, z + h - 0.1), C(FRAME), (1, 0, 0))
    if sign:
        by, bz = y0 + 0.7, z + 0.75
        s.box((f + 0.09, by, bz), (0.06, 2.0, 1.0), C(BOARD))
        g = f + 0.16
        s.box((g, by + 0.25, bz + 0.42), (0.02, 1.05, 0.16), C(PAINT))
        s.box((g, by + 0.41, bz + 0.2), (0.02, 0.14, 0.24), C(PAINT)); s.box((g, by + 0.66, bz + 0.24), (0.02, 0.14, 0.2), C(PAINT))
        for (dy, dz, w_, h_) in ((1.3, 0.26, 0.5, 0.12), (1.3, 0.62, 0.5, 0.12), (1.3, 0.26, 0.12, 0.48), (1.68, 0.26, 0.12, 0.48)):
            s.box((g, by + dy, bz + dz), (0.02, w_, h_), C(PAINT))


def razor_x(s, x0, x1, y, z):
    k = 0; x = x0
    while x < x1 - 0.1:
        s.prism(x + 0.17, y + 0.04, z, 0.17, 0.26, 7, C(RAZOR if k % 2 else RAZOR_DK), C(RAZOR), inner=0.09); x += 0.36; k += 1


def razor_y(s, x, y0, y1, z):
    k = 0; y = y0
    while y < y1 - 0.1:
        s.prism(x + 0.04, y + 0.17, z, 0.17, 0.26, 7, C(RAZOR if k % 2 else RAZOR_DK), C(RAZOR), inner=0.09); y += 0.36; k += 1


def post(s, x, y, lamp):
    s.box((x - 0.3, y - 0.3, 0), (0.82, 0.82, 0.34), {'top': C(CONC), 'px': C(CONC_DK), 'py': C(CONC), 'nx': C(CONC_DK), 'ny': C(CONC_DK)})   # the precast foot
    s.box((x, y, 0), (0.22, 0.22, 2.75), C(STEEL_DK))
    if lamp is not None: s.box((x - 0.1, y - 0.1, 2.75), (0.42, 0.42, 0.42), C(LAMP if lamp else LAMP_OFF)); s.box((x - 0.04, y - 0.04, 3.17), (0.3, 0.3, 0.08), C(FRAME))


LAMP_AT = (8.71, 5.11, 2.98)                                   # the red lamp's middle (the beat frame lights it)
LOCK_AT = (4.98, 5.34, 0.74)


# ---------------------------------------------------------------------------------------------------- the seven scenes
def curfew(state):
    from bohemia_iso3d import Scene
    s = Scene()
    if state == 'night':
        post(s, 1.2, 5.0, None); post(s, 8.6, 5.0, True)
        panel_x(s, 1.42, 5.06, 3.58, sign=True); panel_x(s, 5.0, 5.06, 3.6)
        razor_x(s, 1.42, 8.6, 5.0, 2.44)
        for k in range(6): s.box((4.62 + 0.2 * (k % 2), 5.2, 0.86 + k * 0.17), (0.62, 0.16, 0.12), C(CHAIN))   # his chain round both stiles
        s.box((4.74, 5.26, 0.5), (0.5, 0.2, 0.46), C(BRASS)); s.box((4.84, 5.3, 0.94), (0.3, 0.1, 0.16), C(STEEL))   # his padlock, and its shackle
    elif state == 'day':
        post(s, 1.2, 5.0, None); post(s, 8.6, 5.0, False)
        panel_y(s, 1.36, 5.24, 3.58, sign=True); panel_y(s, 8.52, 5.24, 3.6)
        razor_y(s, 1.3, 5.24, 8.8, 2.44); razor_y(s, 8.46, 5.24, 8.84, 2.44)
        for k in range(6): s.box((8.86, 5.1 + 0.05 * (k % 2), 1.9 - k * 0.2), (0.14, 0.2, 0.2), C(CHAIN))       # the chain hanging off the post
        s.box((8.8, 5.04, 0.44), (0.24, 0.42, 0.44), C(BRASS))                                                 # and the padlock on its end
    else:
        post(s, 1.2, 5.0, None)
        s.box((8.3, 4.7, 0), (0.82, 0.82, 0.34), {'top': C(CONC), 'px': C(CONC_DK), 'py': C(CONC), 'nx': C(CONC_DK), 'ny': C(CONC_DK)}); s.box((8.6, 5.0, 0), (0.22, 0.22, 1.1), C(STEEL_DK))   # the other post, cut
        s.box((8.9, 5.5, 0), (0.22, 1.7, 0.2), C(STEEL_DK))                                                    # its top in the road
        s.box((8.95, 7.3, 0), (0.42, 0.42, 0.3), C(LAMP_OFF))                                                  # the lamp, out
        panel_y(s, 1.36, 5.24, 3.58, sign=True); razor_y(s, 1.3, 5.24, 8.8, 2.44)
        s.box((4.2, 3.6, 0.0), (3.6, 2.3, 0.07), C(MESH))                                                      # the other panel, down flat
        for (dx, dy, w_, d_) in ((0, 0, 3.6, 0.14), (0, 2.16, 3.6, 0.14), (0, 0, 0.14, 2.3), (3.46, 0, 0.14, 2.3), (0, 1.1, 3.6, 0.09)):
            s.box((4.2 + dx, 3.6 + dy, 0.07), (w_, d_, 0.07), C(FRAME))
        s.quad((4.3, 3.7, 0.15), (4.5, 3.7, 0.15), (7.7, 5.8, 0.15), (7.5, 5.8, 0.15), C(FRAME), (0, 0, 1))        # its brace
        s.quad((6.6, 3.6, 0.14), (7.8, 3.6, 0.5), (7.8, 4.4, 0.5), (6.6, 4.4, 0.14), C(MESH_DK), (0, 0, 1))        # a corner of it bent up
        for k in range(4): s.box((2.4 + k * 0.42, 7.5 + 0.08 * (k % 2), 0), (0.36, 0.22, 0.12), C(CHAIN))          # the chain, cut in two
        for k in range(3): s.box((5.2 + k * 0.42, 7.0 + 0.1 * (k % 2), 0), (0.36, 0.22, 0.12), C(CHAIN))
        s.box((6.6, 7.2, 0), (0.5, 0.44, 0.2), C(BRASS))
        s.quad((3.6, 6.2, 0.04), (3.76, 6.1, 0.04), (4.9, 6.9, 0.04), (4.74, 7.0, 0.04), C(GRIP), (0, 0, 1))       # the bolt cutters, where they did it
        s.quad((3.6, 6.8, 0.04), (3.7, 6.94, 0.04), (4.9, 6.5, 0.04), (4.8, 6.36, 0.04), C(GRIP), (0, 0, 1))
        s.box((4.86, 6.5, 0), (0.5, 0.34, 0.1), C(FRAME))
    return s


def dug(s, rng, cx, cy):
    for (dx, dy, r) in ((0.0, 0.0, 1.25), (0.85, 0.45, 0.95), (-0.5, 0.75, 0.9), (0.3, -0.7, 0.8)):
        s.prism(cx + dx, cy + dy, 0, r, 0.05, 9, C(DIRT_DK), C(DIRT_DK))
    for _ in range(9):                                         # clods
        a, d = rng.uniform(0, 6.283), rng.uniform(1.0, 1.9); z = rng.uniform(0.12, 0.24)
        s.box((cx + d * math.cos(a), cy + d * math.sin(a), 0), (z + 0.08, z + 0.04, z * 0.7), C(DIRT if rng.rand() < 0.6 else DIRT_DK))


RAG_AT = (7.2, 3.3, 1.75)


def mine(state):
    from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(8)
    dug(s, rng, 4.9, 5.1)
    if state == 'before':
        s.prism(4.85, 5.05, 0.05, 0.85, 0.12, 9, C(MOUND_DK), C(DIRT_LT)); s.prism(5.02, 5.2, 0.17, 0.52, 0.1, 7, C(MOUND_DK), C(DIRT_LT)); s.prism(4.7, 4.9, 0.17, 0.3, 0.08, 6, C(MOUND_DK), C(DIRT_LT))   # the mound over the can: paler, turned earth
        s.box((6.6, 3.2, 0), (0.15, 0.15, 2.1), C(STICK))                                                    # his stake
        s.box((6.75, 3.24, 1.5), (0.85, 0.07, 0.5), C(RAG)); s.box((6.75, 3.24, 1.16), (0.4, 0.07, 0.34), C(RAG))   # the red rag, torn
        for k in range(8): s.box((5.5 + k * 0.5, 5.5 + 0.12 * (k % 2) + 0.06 * k, 0.02), (0.46, 0.08, 0.06), C(WIRE))   # the wire, out of the dirt to the kerb
    else:
        s.prism(4.9, 5.1, 0.0, 1.3, 0.16, 11, C(MOUND_DK), C(DIRT_LT), inner=0.75)                             # the dirt thrown out of it
        for (dx, dy, r) in ((1.0, 0.3, 0.42), (-0.8, 0.7, 0.36), (0.2, -1.05, 0.4), (-0.9, -0.5, 0.3)): s.prism(4.9 + dx, 5.1 + dy, 0.16, r, 0.16, 7, C(MOUND_DK), C(DIRT_LT))
        s.prism(4.9, 5.1, 0.0, 0.76, 0.03, 11, C(HOLE), C(HOLE))                                               # the hole
        s.prism(3.1, 6.3, 0.0, 0.85, 0.3, 9, C(MOUND_DK), C(DIRT_LT)); s.prism(3.2, 6.4, 0.3, 0.55, 0.24, 7, C(MOUND_DK), C(DIRT_LT)); s.prism(2.7, 6.0, 0.0, 0.45, 0.2, 6, C(MOUND_DK), C(DIRT_LT))   # the spoil heap
        s.box((3.1, 6.3, 0.4), (0.12, 0.12, 1.7), C(STICK)); s.box((2.92, 6.26, 0.36), (0.48, 0.08, 0.5), C(STEEL)); s.box((2.98, 6.28, 2.06), (0.36, 0.1, 0.12), C(STICK))   # the spade stood in it
        s.prism(6.7, 6.3, 0, 0.42, 0.8, 12, C(TIN_DK), C(TIN), inner=0.34); s.prism(6.7, 6.3, 0.0, 0.34, 0.5, 10, C(HOLE), C(HOLE))   # the can, out of the ground, open
        s.prism(7.7, 6.9, 0, 0.42, 0.06, 12, C(TIN), C(TIN))                                                  # its lid
        for k in range(3): s.box((7.1 + k * 0.42, 5.7 - 0.1 * k, 0), (0.36, 0.08, 0.06), C(WIRE))              # its wires, cut
        s.box((7.9, 5.2, 0), (0.3, 0.08, 0.06), C(WIRE))
        s.box((2.2, 3.4, 0), (2.1, 0.15, 0.15), C(STICK)); s.box((1.7, 3.2, 0.0), (0.8, 0.5, 0.06), C(RAG))     # his stake, thrown down
    return s


CALTROPS = ((2.6, 3.1), (6.4, 4.4), (4.2, 6.2), (7.6, 7.4), (2.2, 5.6), (5.4, 8.0), (8.2, 2.8))


def nails(state):
    from bohemia_iso3d import Scene
    s = Scene(); rng = np.random.RandomState(9)
    if state == 'before':
        for band in (2.0, 4.6, 7.2):                           # the nails, in bands kerb to kerb
            for _ in range(46):
                x, y = 0.8 + rng.rand() * 8.4, band + rng.normal(0, 0.55)
                s.box((x, y, 0), (0.3, 0.07, 0.06) if rng.rand() < 0.5 else (0.07, 0.3, 0.06), C(NAIL))
        for (x, y) in CALTROPS:                                # his welded caltrops, four points, one always up
            s.box((x - 0.42, y - 0.06, 0), (0.84, 0.12, 0.12), C(CALTROP)); s.box((x - 0.06, y - 0.42, 0), (0.12, 0.84, 0.12), C(CALTROP))
            s.box((x - 0.06, y - 0.06, 0), (0.12, 0.12, 0.6), C(CALTROP))
        s.prism(1.9, 7.9, 0, 0.78, 0.26, 14, C(TYRE), C(TYRE), inner=0.42)                                     # a shredded tyre, and a strip of it
        for k in range(4): s.box((3.2 + k * 0.42, 8.3 - 0.16 * k, 0), (0.44, 0.24, 0.08), C(TYRE))
        s.prism(5.9, 2.9, 0, 0.5, 0.12, 12, C(TYRE), C(TYRE), inner=0.3)                                       # a cart's wheel that came off here, flat
        s.box((6.9, 2.2, 0), (0.8, 0.5, 0.3), {'top': C(SACK), 'px': C(SACK_DK), 'py': C(SACK), 'nx': C(SACK_DK), 'ny': C(SACK_DK)})   # and a sack somebody dropped to run
        # (11/14, seen on the map: the piece is laid on EVERY nailed block, so a whole handcart down on its axle was the same cart a dozen times.
        #  What is his and belongs on every block stays big: the caltrops. What happened once stays small.)
    else:
        for y in (3.3, 5.5):                                   # a cart's two tracks down a swept street
            s.box((0.6, y - 0.36, 0.0), (8.8, 0.94, 0.012), C(SWEPT)); s.box((0.6, y, 0.012), (8.8, 0.22, 0.014), C(TRACK))
        s.prism(7.6, 7.7, 0, 0.9, 0.22, 9, C(NAIL), C((84, 82, 78))); s.prism(7.75, 7.85, 0.22, 0.52, 0.2, 7, C(NAIL), C((84, 82, 78))); s.prism(7.1, 7.3, 0, 0.45, 0.16, 6, C(NAIL), C((84, 82, 78)))   # the swept heap at the kerb
        rng2 = np.random.RandomState(4)
        for _ in range(14):
            a, d = rng2.uniform(0, 6.283), rng2.uniform(0.9, 1.5); s.box((7.6 + d * math.cos(a), 7.7 + d * math.sin(a), 0), (0.26, 0.07, 0.06), C(NAIL))
        s.prism(5.6, 7.4, 0, 0.46, 0.76, 12, C(BUCKET_DK), C(BUCKET), inner=0.38); s.prism(5.6, 7.4, 0.0, 0.38, 0.6, 10, C(NAIL), C(NAIL))   # the bucket of nails
        s.box((4.4, 7.2, 0.0), (0.9, 0.34, 0.26), C((60, 50, 40)))                                            # the push broom, its head
        s.quad((4.8, 7.4, 0.26), (4.94, 7.4, 0.26), (5.5, 7.4, 2.2), (5.36, 7.4, 2.2), C(BROOM), (0, 1, 0))     # and its handle, leaning on the bucket
    return s


PIECES = [('curfew', curfew, ('night', 'day', 'after')), ('mine', mine, ('before', 'after')), ('nails', nails, ('before', 'after'))]


def scenes():
    os.makedirs(OUT, exist_ok=True)
    S = []
    for n, f, states in PIECES:
        for st in states:
            sc = NT.capture(n, (lambda _a, f=f, st=st: f(st)), st != states[0])
            sc['key'] = '%s_%s' % (n, st); sc['district'] = 'boss_%s_%s' % (n, st); sc['state'] = st; sc['piece'] = True; S.append(sc)
            print('  %-14s %dx%d, %d faces' % (sc['key'], sc['w'], sc['h'], len(sc['faces'])))
    pickle.dump(S, open(os.path.join(OUT, 'scenes.pkl'), 'wb'))
    print('captured', len(S), 'scenes')


def render():
    ST.OUT = OUT; os.makedirs(os.path.join(OUT, 'masters'), exist_ok=True)      # BOSSES' own render through the map's rig, into this lane's folder
    ST.render()


def moving(sc, frame):
    """what moves on the beat: the red lamp is lit while the street is shut, and his padlock glints; the rag on the mine's stake;
    his caltrops glint, one side then the other"""
    L = np.zeros((sc['h'], sc['w'], 4), np.float64); blob = PB.blob; PJ = lambda p: NT.P(sc, p); key = sc['key']
    if key == 'curfew_night':
        x, y = PJ(LAMP_AT); blob(L, x, y, 7.5, (236, 44, 30), 0.55 if frame else 0.22); blob(L, x, y, 3.4, (255, 62, 40), 1.0 if frame else 0.5)   # red, never pink (the gate's B5 found the first one pale)
        x, y = PJ(LOCK_AT); blob(L, x, y, 2.2, (255, 236, 160), 0.25 if frame else 0.75)
    elif key == 'mine_before':
        x, y = PJ(RAG_AT); blob(L, x + (2 if frame else 0), y, 2.4, RAG, 0.85)
    elif key == 'nails_before':
        for i, (a, b) in enumerate(CALTROPS):
            x, y = PJ((a, b, 0.6)); blob(L, x, y, 1.5, (236, 236, 226), 0.75 if (i % 2) == frame else 0.15)
    return L


def finish():
    from PIL import Image
    S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
    mp = os.path.join(DEST, 'boss_places.json'); man = json.load(open(mp))
    note = ' COOK FIVE 11/14 (rule 447, the production pass, tools/bohemia_cook5_the_bosses_map_pieces_finished_11_14_26.py): the CURFEW gate, the MINE and the NAILS redrawn as finished pieces, the same keys, frame and rig.'
    if 'COOK FIVE 11/14' not in man['about']: man['about'] += note
    box = {}                                                   # one frame per piece: every state into the biggest one's box, its block anchored the same
    for sc in S:
        b = box.setdefault(sc['name'], [0, 0, 0, 0])
        b[0] = max(b[0], sc['bx']); b[1] = max(b[1], sc['by']); b[2] = max(b[2], sc['w'] - sc['bx']); b[3] = max(b[3], sc['h'] - sc['by'])
    for sc in S:
        fn = os.path.join(OUT, 'masters', '%s.png' % sc['district'])
        if not os.path.exists(fn): raise SystemExit('not rendered: ' + sc['district'])
        base = np.asarray(Image.open(fn).convert('RGBA')).astype(np.float64); key = sc['key']; b = box[sc['name']]; W, Hh = b[0] + b[2], b[1] + b[3]
        for fr in (0, 1):
            im = Image.fromarray(PB.over(base, moving(sc, fr)).round().clip(0, 255).astype(np.uint8), 'RGBA')
            big = Image.new('RGBA', (W, Hh), (0, 0, 0, 0)); big.alpha_composite(im, (b[0] - sc['bx'], b[1] - sc['by']))
            big.save(os.path.join(DEST, '%s_%d.png' % (key, fr)), optimize=True)
        man['pictures'][key] = dict(w=W, h=Hh, bx=b[0], by=b[1], plate=sc['plate'], frames=['%s_0.png' % key, '%s_1.png' % key], through_the_rig=True, finished='cook 5, 11/14')
        print('  %-14s %dx%d anchor %d,%d' % (key, W, Hh, b[0], b[1]))
    json.dump(man, open(mp, 'w'), indent=1)


KEYS = ('curfew_night', 'curfew_day', 'curfew_after', 'mine_before', 'mine_after', 'nails_before', 'nails_after')
SAY = dict(curfew_night='THE GATE, SHUT (NIGHT)', curfew_day='OPEN (DAY)', curfew_after='AFTER HE FALLS', mine_before='THE MINE, SPOTTED', mine_after='DUG OUT',
           nails_before='THE NAILS', nails_after='SWEPT')


def sheet(before_dir, page=None):
    """records/target/COOK5_THE_BOSSES_MAP_PIECES_11_14.webp: the seven pieces as they were (BOSSES', from before_dir) over the
    seven as they are, on the map's own asphalt tone at four times the picture's pixels, and the page shot if one is given"""
    from PIL import Image, ImageDraw, ImageFont
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1290; INK, DIM, BG, ROAD = (232, 222, 196), (150, 140, 118), (16, 14, 12), (74, 70, 64); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    def strip(folder, keys, k=3):
        ims = [Image.open(os.path.join(folder, key + '_0.png')).convert('RGBA') for key in keys]
        cw = (WID - 10 * (len(keys) - 1)) // len(keys); ch = max(i.height for i in ims) * k + 30
        r = Image.new('RGB', (WID, ch), BG); d = ImageDraw.Draw(r); x = 0
        for key, im in zip(keys, ims):
            cell = Image.new('RGBA', (cw, ch - 26), ROAD + (255,)); big = im.resize((im.width * k, im.height * k), Image.NEAREST)
            cell.alpha_composite(big, ((cw - big.width) // 2, (ch - 26 - big.height) // 2)); r.paste(cell.convert('RGB'), (x, 26)); d.text((x + 4, 4), SAY[key], font=font(14), fill=INK); x += cw + 10
        rows.append(r)
    def strip2(keys, k=2):
        ims = [(SAY[key] + (', BEFORE' if folder == before_dir else ''), Image.open(os.path.join(folder, key + '_0.png')).convert('RGBA')) for folder in (before_dir, DEST) for key in keys]
        cw = (WID - 30) // 4; ch = max(i.height for _, i in ims) * k + 30; r = Image.new('RGB', (WID, ch), BG); d = ImageDraw.Draw(r); x = 0
        for lab, im in ims:
            cell = Image.new('RGBA', (cw, ch - 26), ROAD + (255,)); big = im.resize((im.width * k, im.height * k), Image.NEAREST)
            cell.alpha_composite(big, ((cw - big.width) // 2, (ch - 26 - big.height) // 2)); r.paste(cell.convert('RGB'), (x, 26)); d.text((x + 4, 4), lab, font=font(14), fill=INK); x += cw + 10
        rows.append(r)
    title('THE LOCKSMITH\'S GATE', 'top: the first one (BOSSES\'). bottom: finished. Three times the map\'s own pixels')
    strip(before_dir, KEYS[:3]); strip(DEST, KEYS[:3]); first_row = len(rows) - 1
    title('THE CHARGE\'S MINE', 'left pair: the first one. right pair: finished')
    strip2(KEYS[3:5])
    title('THE MACHINIST\'S NAILS', 'left pair: the first one. right pair: finished')
    strip2(KEYS[5:])
    if page and os.path.exists(page):
        title('ON THE MAP, ON HIS PHONE', 'top: while each of the three stands (the Locksmith, the Charge, the Machinist). bottom: after he falls. The game\'s own camera, 390 x 844')
        n = Image.open(page).convert('RGB'); rows.append(n.resize((WID, int(n.height * WID / n.width)), Image.LANCZOS))
    out = Image.new('RGB', (WID, sum(q.height + 8 for q in rows)), BG); y = 0; fy = 0
    for i, q in enumerate(rows):
        out.paste(q, (0, y))
        if i == first_row: fy = y
        y += q.height + 8
    dst = os.path.join(R, 'records/target/COOK5_THE_BOSSES_MAP_PIECES_11_14.webp'); out.save(dst, 'WEBP', quality=74, method=6)
    cw = (WID - 20) // 3; first = out.crop((0, fy + 26, cw, fy + rows[first_row].height))
    first.save(os.path.join(R, 'records/target/vote_first/cook5-the-bosses-map-pieces-11-14.webp'), 'WEBP', quality=80, method=6)
    print('sheet', out.size, os.path.getsize(dst), 'first at', (0, fy + 26, cw, rows[first_row].height - 26))


if __name__ == '__main__':
    a = sys.argv[1:]; cmd = a[0] if a else 'help'
    if cmd == 'scenes': scenes()
    elif cmd == 'render': render()
    elif cmd == 'finish': finish()
    elif cmd == 'sheet': sheet(a[1], a[2] if len(a) > 2 else None)
    else: print(__doc__)
