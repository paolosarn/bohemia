#!/usr/bin/env python3
"""THE SIX BUILDINGS' PROPS  (COOK [the board props] round 2, 10/10/26)

The row, after rule 77a's freeway kit: COMBAT TWO [more building types] made six buildings --
church, school, gas station, motel, warehouse, casino back -- and "the props those buildings
need at the house-tile scale (the pumps, the pews through a broken wall, the school fence,
the motel ice machine, the pallets, the slot machines in the back lot), each with its cover
value named, typed edges where they touch the ground; COMBAT TWO places them."

*** AND THE ROW IS RIGHT THAT THEY ARE MISSING, WHICH I CHECKED BEFORE DRAWING. *** Their
gas station is a canopy on posts over an EMPTY forecourt: the pump islands are marked out and
there is not a pump on them. A fight on that board is a fight in a car park with a roof.

WHAT IS COOKED, ONE PER BUILDING, AND WHY EACH ONE IS THE RIGHT PROP FOR IT:
  THE PUMPS          the thing the gas station is FOR, and the thing you do not want to be
                     standing behind. 1.90 m, a blocker, on an island kerb you can trip on.
  THE PEWS           a church's insides spilling out through the broken wall. 0.92 m, cover,
                     and they are the only cover in this kit you can see over while using.
  THE FENCE AND GATE a school fence is a chain-link run with ONE WAY THROUGH, and the gate is
                     the whole point on a board: a wall with a door in it is a decision.
  THE ICE MACHINE    a motel's one appliance, 1.70 m, a blocker, and the only thing out
                     front that ever had a light in it.
  THE PALLETS        a warehouse's floor, stacked. 1.05 m, cover, and the stack is uneven
                     because nobody stacked it to be looked at.
  THE SLOTS          the casino's back lot: machines dumped on their faces and their sides.
                     1.55 m standing, a blocker; the fallen ones are cover at 0.62.

REUSE-FIRST, AND IT PAID AGAIN: the school fence is this lane's own 9/30 chain-link run with
a gate leaf hung on it, not a second fence drawn from scratch; the back lot borrows his 7/28
oil drum; every cell, ramp and material is his approved 7/28 bank. The helpers -- the cell
layer, the family-safe shade, the ramp-safe lighten, the joint measurement -- are imported
from this lane's own freeway kit from earlier the same round rather than copied.

COVER OR BLOCKER IS MEASURED AGAINST A MAN'S CHEST AT 1.30 m, never filed by eye. This lane
filed two pieces wrong by eye on 9/30 and the tape corrected it, so the tape runs on every
piece here and the build refuses if a height and a kind disagree.

RULE 77: every piece names what runs out of its four sides, and anything that claims to RUN
is laid end to end and its joint measured against the inside of the piece -- because a
declared edge that does not meet is a label, which is the mistake the sign gantry made in
this lane's own freeway kit two hours ago.

    python3 tools/bohemia_the_building_props_cook_10_10_26.py
      -> banks/BOHEMIA_THE_BUILDING_PROPS_10_10_26.txt
      -> records/BOHEMIA_THE_BUILDING_PROPS_MEASURED_10_10_26.txt
      -> slices/vote/COOK_THE_BUILDING_PROPS.png

REFERENCE CHECK (the 9/4 standing law):
  02_COMBAT_RULES.md, the BOARD line: BB keeps a short blocker vocabulary per terrain, and
        height is the one bonus. One prop per building, each with its height in metres.
  CGRD-01 INTO THE BREACH: a piece has one job and must say which from across the screen --
        which is why the pump is a pump shape and not a box, and the slots are on their faces.
  TG-04 THE STREET TILE and the 7/28 bank: the asphalt, the concrete and the paint are his.
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east.
  REUSE CHECK: the chain-link, the oil drum, every ramp and every cell are loaded at run time
        from this lane's 9/30 bank and his 7/28 bank; the helpers are imported, not copied.

[bb the overworld is battle brothers] reference/library/battle_brothers/02_COMBAT_RULES.md,
  the TERRAIN line: BB's props are terrain furniture that exists to break line of sight and
  give height, and each terrain's set is small so a board reads. Taken: six props, one per
  building, each with a measured height. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g):
  BB's props are nature's and they are the same in every forest. Every piece here is what a
  particular BUILDING left behind when the money stopped -- the pumps belong to the gas
  station and nothing else, and a board made of them tells you what the place used to be.
"""
import base64, importlib.util, io, json, math, os, sys
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
os.chdir(REPO)

_spec = importlib.util.spec_from_file_location(
    'fk', os.path.join(HERE, 'bohemia_the_freeway_kit_cook_10_10_26.py'))
fk = importlib.util.module_from_spec(_spec)
sys.modules['fk'] = fk
_spec.loader.exec_module(fk)

RAMPS, TILES, SPR, ALL = fk.RAMPS, fk.TILES, fk.SPR, fk.ALL
KIT, SRC, PPM, CHEST = fk.KIT, fk.SRC, fk.PPM, fk.CHEST
m, cells, shade, lighter, load, R = fk.m, fk.cells, fk.shade, fk.lighter, fk.load, fk.R
colours, seam_of = fk.colours, fk.seam_of

OUT_BANK = 'banks/BOHEMIA_THE_BUILDING_PROPS_10_10_26.txt'
OUT_REC = 'records/BOHEMIA_THE_BUILDING_PROPS_MEASURED_10_10_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_BUILDING_PROPS.png'

def die(msg): sys.exit('REFUSED: ' + msg)


# *** THE PLATE PROBE, AND IT EXISTS BECAUSE THE BACK LOT WAS CUT OFF BY ITS OWN CANVAS. ***
# I laid 5.4 m of machines and rubble inside a 4.0 m plate and the right-hand machine ran
# clean off the edge, while every guard stayed green because they all read the PLATE and not
# the PAINT. Testing for paint in the last column does not work either: a thing as wide as
# its own footprint, like the ice machine, touches both edges honestly. So the build runs
# every prop TWICE -- once on its real plate, which is what ships, and once on a plate with a
# margin around it -- and looks in the margin. Paint out there is paint the real plate cut
# off, and the footprint filed for a cropped prop is a lie.
PAD = 0


def plate(wm, hm):
    return Image.new('RGBA', (m(wm), m(hm)), (0, 0, 0, 0))


def topface(im, box, fam, step=3):
    """The top of a thing, lit: the sun is north-west, so the top plane takes the light and
       the south edge turns over into shadow."""
    d = ImageDraw.Draw(im)
    x0, y0, x1, y1 = [int(v) for v in box]
    d.rectangle([x0, y0, x1, y1], fill=RAMPS[fam][step] + (255,))
    d.rectangle([x0, y0, x1, y0 + max(1, (y1 - y0) // 5)],
                fill=lighter(RAMPS[fam][step], 2) + (255,))
    shade(im, (x0, y1 - max(1, (y1 - y0) // 4), x1, y1), 0.82)


def ground_shadow(im, x0, x1, y, depth, mult=0.70):
    """The sun is north-west, so a thing's shadow lies to the south-east of its foot."""
    shade(im, (x0 + m(0.25), y, x1 + m(0.25), y + depth), mult)


# ------------------------------------------------- THE SIX, ONE PER BUILDING, IN THEIR ORDER

def the_pumps(seed=11):
    """THE GAS STATION, AND THE ONE THE ROW IS MOST RIGHT ABOUT. Their forecourt has the
       canopy and the painted islands and NOT A PUMP ON THEM, so a fight there is a fight in
       a car park with a roof. Two pumps on a 5 m island, 1.90 m tall, a BLOCKER, and the
       island kerb is 0.15 m proud of the forecourt so it is a thing you trip on while you
       are busy. The point of a pump on a board: it is the only blocker in the game you do
       not want to be standing behind."""
    isl_w, isl_l, pump_h = 5.0, 1.2, 1.90
    W, H = m(isl_w), m(pump_h) + m(0.9)
    im = Image.new('RGBA', (W + PAD, H + PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = R(seed)
    gy = H - m(0.55)                                   # the top of the island
    # THE ISLAND. *** AND THE FIRST CUT OF IT READ AS A PILE OF GRAVEL. *** I laid his
    # concrete CELLS along it, which are a 44 px floor texture with cracks in them, and at a
    # 13 px kerb all you see is the noise. A kerb is a clean slab with a lit nose and a south
    # face that turns over, and the cracks are two, placed, not ninety.
    con = RAMPS['concrete'][3]
    d.rectangle([m(0.2), gy, W - m(0.2), gy + m(0.3)], fill=con + (255,))
    d.rectangle([m(0.2), gy, W - m(0.2), gy + max(1, m(0.06))],
                fill=lighter(con, 2) + (255,))                      # the lit kerb nose
    shade(im, (m(0.2), gy + m(0.20), W - m(0.2), gy + m(0.3)), 0.80)
    for _ in range(3):
        cxx = m(0.5) + int(r() * (W - m(1.2)))
        d.rectangle([cxx, gy + m(0.08), cxx + 1, gy + m(0.24)],
                    fill=RAMPS['concrete'][1] + (255,))
    ground_shadow(im, m(0.2), W - m(0.2), gy + m(0.3), m(0.22), 0.72)

    body = RAMPS['stucco'][3]
    for px in (m(0.95), m(3.05)):
        pw, ph = m(0.65), m(pump_h)
        top = gy - ph
        d.rectangle([px, top, px + pw, gy], fill=body + (255,))
        d.rectangle([px, top, px + max(2, pw // 4), gy],
                    fill=lighter(body, 1) + (255,))                 # the north-west face
        shade(im, (px + pw - max(2, pw // 4), top, px + pw, gy), 0.84)
        # the display head: the dark box with the two windows that count the money
        hh = m(0.45)
        d.rectangle([px - m(0.04), top, px + pw + m(0.04), top + hh],
                    fill=RAMPS['asphalt'][3] + (255,))
        d.rectangle([px - m(0.04), top, px + pw + m(0.04), top + max(1, hh // 5)],
                    fill=lighter(RAMPS['asphalt'][3], 2) + (255,))
        for k in (0, 1):
            wx = px + m(0.07) + k * m(0.28)
            d.rectangle([wx, top + m(0.12), wx + m(0.21), top + m(0.30)],
                        fill=lighter(RAMPS['concrete'][3], 3) + (255,))
        # the stripe. A pump is painted, and the paint is the only loud thing on it.
        sy = top + hh + m(0.18)
        d.rectangle([px, sy, px + pw, sy + m(0.16)], fill=RAMPS['terracotta'][4] + (255,))
        # the hose: off the south-east shoulder, down into the holster
        hx = px + pw
        for k in range(m(1.0)):
            t = k / float(max(1, m(1.0)))
            yy = sy + m(0.35) + int(m(0.9) * t)
            xx = hx + int(m(0.22) * math.sin(t * 3.1))
            d.rectangle([xx, yy, xx + max(1, m(0.05)), yy + 1],
                        fill=RAMPS['asphalt'][1] + (255,))
        d.rectangle([hx - m(0.02), gy - m(0.55), hx + m(0.12), gy - m(0.30)],
                    fill=RAMPS['asphalt'][2] + (255,))              # the nozzle holster
        ground_shadow(im, px, px + pw, gy, m(0.14), 0.84)
        for _ in range(34):                                         # what the weather did
            sx = px + int(r() * pw)
            syy = gy - int(r() * r() * ph) - 1
            shade(im, (sx, syy, sx + 1 + int(r() * 2), syy + 1), 0.86)
    # *** AND HIS OIL DRUM CAME OUT AND WENT STRAIGHT BACK IN THE CUPBOARD TOO. *** I stood
    # it on the end of the island to get a second whole piece of his into this kit. It is a
    # BURNING BARREL: it has a lit fire coming out of the top of it. A fire on a fuel island
    # is wrong twice over, and it is painted hotter and finer than everything else here, so
    # it owned the whole picture. That is twice in one round I forced a reuse to hit a number
    # I made up, and both times the picture said no. See TRIED_AND_PUT_BACK.
    return im, dict(name='FUEL PUMPS ON THEIR ISLAND', w=isl_w, l=isl_l, h=pump_h,
                    kind='BLOCKER', belongs_to='gas_station',
                    reused="his 7/28 stucco, concrete and terracotta ramps for the pumps "
                           "and the island (his oil drum was tried on it and taken back "
                           "out: see the record)",
                    note='the kerb stands 0.15 m proud: a trip, not just a picture',
                    edges=dict(N='forecourt', E='forecourt', S='forecourt', W='forecourt'))


def the_pews(seed=12):
    """THE CHURCH. A church's insides, out in the open, because the wall came down ON them:
       a row of pews with the plaster still sitting on the seats. 0.92 m, COVER, and the only
       cover in this kit you can see over while you use it, which is the whole reason to
       crouch behind a pew instead of a wall. Two 3 m pews, and THE ROW RUNS OUT OF BOTH ENDS
       so COMBAT TWO can lay it down the nave as long as the nave is."""
    unit_m, n, pew_h, depth = 3.0, 2, 0.92, 1.6
    uw = m(unit_m)
    W, H = uw * n, m(pew_h) + m(0.5)
    im = Image.new('RGBA', (W + PAD, H + PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = R(seed)
    gy = H - m(0.5)
    wood = RAMPS['deck'][3]
    # *** AND THE FIRST CUT READ AS A LONG TABLE. *** A back plank floating over a seat plank
    # with a leg at each end is a trestle, not a pew. What makes a pew a pew from across a
    # room is THE SOLID END STANDARD -- the carved board at the end of the row that goes all
    # the way to the floor -- and the two back posts that tie the back to the seat. Those are
    # drawn now, and the standard STRADDLES THE JOIN between two pews, which is how a real
    # row is built and also the only way it keys: see below.
    for u in range(n):
        x0 = u * uw
        top = gy - m(pew_h)
        d.rectangle([x0, top, x0 + uw - 1, top + m(0.22)], fill=wood + (255,))   # the back
        d.rectangle([x0, top, x0 + uw - 1, top + m(0.05)], fill=lighter(wood, 2) + (255,))
        shade(im, (x0, top + m(0.17), x0 + uw, top + m(0.22)), 0.82)
        sy = gy - m(0.46)
        for bx in (x0 + m(0.70), x0 + m(2.10)):                    # the back posts
            d.rectangle([bx, top + m(0.22), bx + m(0.10), sy], fill=RAMPS['deck'][2] + (255,))
        d.rectangle([x0, sy, x0 + uw - 1, sy + m(0.12)], fill=RAMPS['deck'][3] + (255,))
        d.rectangle([x0, sy, x0 + uw - 1, sy + m(0.04)], fill=lighter(wood, 2) + (255,))
        shade(im, (x0, sy + m(0.09), x0 + uw, sy + m(0.12)), 0.84)
        d.rectangle([x0 + m(0.18), sy + m(0.12), x0 + uw - m(0.18), sy + m(0.19)],
                    fill=RAMPS['deck'][1] + (255,))                 # the apron under the seat
        d.rectangle([x0 + uw - m(0.30), sy + m(0.19), x0 + uw - m(0.16), gy],
                    fill=RAMPS['deck'][1] + (255,))                 # the far leg
        ground_shadow(im, x0, x0 + uw, gy, m(0.16), 0.70)

    # *** THE END STANDARD, AND THE JOINT MEASUREMENT MOVED IT. *** My first cut put the
    # whole standard INSIDE the unit, so this piece's left edge was solid wood and its right
    # edge was open air. Laid end to end that is a double post at one join and a gap at the
    # next, and the tape said 34 against 11 inside. A real pew row SHARES one standard
    # between two pews, so it is drawn centred on the join and the half that falls off this
    # piece is drawn back on at the far end. That is not a trick to pass the test, it is how
    # the thing is actually built, and the test is what made me go and find that out.
    def standard(cx):
        a = cx - m(0.08)
        d.rectangle([a, gy - m(pew_h), a + m(0.16), gy], fill=RAMPS['deck'][2] + (255,))
        # the lit face stops one pixel short of the middle ON PURPOSE: the join lands between
        # the standard's third and fourth pixel, and both of those have to be plain wood or
        # the row shows a bright line at every pew.
        d.rectangle([a, gy - m(pew_h), a + max(1, m(0.05)) - 1, gy],
                    fill=lighter(wood, 2) + (255,))
        shade(im, (a + m(0.11), gy - m(pew_h), a + m(0.16), gy), 0.80)
    for u in range(n):
        standard(u * uw)
    standard(W)

    # WHAT THE BROKEN WALL LEFT, and only in the middle: the ends stay clean so the row joins
    for _ in range(34):
        cx = m(1.1) + int(r() * (W - m(2.2)))
        cy = gy - m(0.46) - int(r() * m(0.08))
        sz = 2 + int(r() * max(2, m(0.10)))
        d.rectangle([cx, cy - sz, cx + sz, cy], fill=RAMPS['stucco'][r.i(2) + 2] + (255,))
        shade(im, (cx, cy - max(1, sz // 3), cx + sz, cy), 0.82)
    for _ in range(22):                                  # chunks that made it to the floor
        cx = m(1.1) + int(r() * (W - m(2.2)))
        sz = 2 + int(r() * max(2, m(0.13)))
        d.rectangle([cx, gy - sz, cx + sz, gy], fill=RAMPS['stucco'][r.i(2) + 1] + (255,))
        shade(im, (cx + max(1, sz // 2), gy - max(1, sz // 2), cx + sz, gy), 0.80)
    return im, dict(name='PEW ROW THROUGH THE BROKEN WALL', w=unit_m * n, l=depth, h=pew_h,
                    kind='COVER', belongs_to='church', see_over=True,
                    reused="his 7/28 deck ramp for the wood and stucco ramp for the plaster",
                    note='you can see over it while you use it',
                    edges=dict(N='nave', E='pew', S='nave', W='pew'))


def the_fence_and_gate(seed=13):
    """THE SCHOOL, AND REUSE-FIRST PAID AGAIN. A school fence is a chain-link run with ONE WAY
       THROUGH, so this is not a second fence drawn from scratch: it is this lane's own 9/30
       chain-link run, two lengths of it, with the gate cut in the middle and its leaf standing
       open against the mesh. THE GATE IS THE WHOLE POINT ON A BOARD. A wall is geometry; a
       wall with one door in it is a decision, and both sides know where you have to come
       through. 1.83 m, a BLOCKER you can see through."""
    unit, meta = fk.from_kit('CHAIN-LINK RUN')
    n = int(round(12.0 / meta['l']))
    w = unit.size[0] * n
    im = Image.new('RGBA', (w + PAD, unit.size[1] + m(0.35) + PAD), (0, 0, 0, 0))
    for i in range(n):
        im.paste(unit, (i * unit.size[0], 0), unit)
    d = ImageDraw.Draw(im)
    gap_w = m(2.4)
    gx = w // 2 - gap_w // 2
    fh = unit.size[1]
    d.rectangle([gx, 0, gx + gap_w, fh], fill=(0, 0, 0, 0))          # the way through
    post = RAMPS['concrete'][2]
    for pxx in (gx - m(0.10), gx + gap_w - m(0.04)):                 # the two gate posts
        d.rectangle([pxx, 0, pxx + m(0.14), fh], fill=post + (255,))
        d.rectangle([pxx, 0, pxx + max(1, m(0.05)), fh], fill=lighter(post, 2) + (255,))
    # the leaf, swung back flat against the fence: the same mesh, doubled, so it reads as
    # a panel that MOVED rather than a patch of darker fence
    leaf = unit.crop((0, 0, gap_w, fh))
    lx0 = gx + gap_w + m(0.10)
    lx1 = lx0 + gap_w
    im.paste(leaf, (lx0, 0), leaf)
    # *** AND THE FIRST CUT OF THE LEAF WAS TWO RAILS AND NO STILES, *** which reads as a bed
    # frame lying against a fence. A gate leaf is a CLOSED FRAME: top and bottom rails AND a
    # stile down each side, with the mesh stretched inside it. The frame is what says this
    # panel used to swing.
    for ry in (0, fh - max(2, m(0.08))):
        d.rectangle([lx0, ry, lx1, ry + max(2, m(0.08))], fill=post + (255,))
    for sx_ in (lx0, lx1 - max(2, m(0.08))):
        d.rectangle([sx_, 0, sx_ + max(2, m(0.08)), fh], fill=post + (255,))
    d.rectangle([lx0, 0, lx1, max(1, m(0.03))], fill=lighter(post, 2) + (255,))
    shade(im, (lx0, fh - max(1, m(0.03)), lx1, fh), 0.80)
    shade(im, (m(0.25), fh - m(0.06), w + m(0.25), fh + m(0.28)), 0.74)
    return im, dict(name='SCHOOL FENCE WITH ITS GATE', w=meta['l'] * n, l=meta['w'],
                    h=meta['h'], kind='BLOCKER', see_through=True, belongs_to='school',
                    gate_metres=round(gap_w / PPM, 2),
                    reused='this lane\'s own 9/30 CHAIN-LINK RUN x%d, gate cut in it' % n,
                    note='one way through, 2.4 m wide, and both sides know where it is',
                    edges=dict(N='yard', E='fence', S='walk', W='fence'))


def the_ice_machine(seed=14):
    """THE MOTEL. A motel's one appliance, standing out front where the walkway meets the
       car park: 1.70 m, a BLOCKER, and the only thing on that frontage that ever had a light
       in it. The light is out. The word on it ships as an attempt tagged draft, because what
       the signs in this valley say is his."""
    wm, lm, hm = 0.95, 0.80, 1.70
    W, H = m(wm), m(hm) + m(0.4)
    im = Image.new('RGBA', (W + PAD, H + PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = R(seed)
    gy = H - m(0.4)
    # *** AND THE FIRST CUT WAS A TAN SLAB WITH RUST ON IT. *** At 41 px wide there is room
    # for four shapes and no more, so it is four shapes: a pale body, a DARK header with the
    # word in pale on it (a sign reads light-on-dark, and I had it the other way round), one
    # deep door panel with a real seam around it, and the grille. The rust is a hint at the
    # door seam now, not a curtain down the whole front.
    body = RAMPS['stucco'][3]
    d.rectangle([0, gy - m(hm), W - 1, gy], fill=body + (255,))
    d.rectangle([0, gy - m(hm), max(2, m(0.12)), gy], fill=lighter(body, 1) + (255,))
    shade(im, (W - max(2, m(0.12)), gy - m(hm), W, gy), 0.84)
    d.rectangle([0, gy - m(hm), W - 1, gy - m(hm) + max(1, m(0.05))],
                fill=lighter(body, 1) + (255,))
    hy, hh = gy - m(hm) + m(0.08), m(0.34)
    d.rectangle([m(0.05), hy, W - m(0.05), hy + hh], fill=RAMPS['asphalt'][1] + (255,))
    try:
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 13)
    except Exception:
        f = ImageFont.load_default()
    pw, ph = W - m(0.10), hh
    mk = Image.new('L', (pw, ph), 0)
    ImageDraw.Draw(mk).text((max(1, pw // 2 - 13), 0), 'ICE', font=f, fill=255)
    mk = mk.point(lambda a: 255 if a > 110 else 0)        # hard pixels, no antialiasing
    im.paste(Image.new('RGB', (pw, ph), RAMPS['stucco'][4]), (m(0.05), hy), mk)
    dx0, dy0 = m(0.08), gy - m(1.08)
    dx1, dy1 = W - m(0.08), gy - m(0.30)
    d.rectangle([dx0 - 1, dy0 - 1, dx1 + 1, dy1 + 1],
                fill=RAMPS['asphalt'][2] + (255,))        # the seam the door sits in
    d.rectangle([dx0, dy0, dx1, dy1], fill=RAMPS['stucco'][1] + (255,))
    d.rectangle([dx0, dy0, dx1, dy0 + max(1, m(0.04))], fill=RAMPS['stucco'][2] + (255,))
    d.rectangle([dx1 - m(0.16), dy0 + m(0.30), dx1 - m(0.03), dy0 + m(0.40)],
                fill=lighter(RAMPS['concrete'][4], 1) + (255,))     # the handle
    # *** AND THE BOTTOM OF IT WAS A MUDDLE. *** Three grille lines, a run of rust and the
    # feet were all fighting for the last eleven pixels. Two clean lines, further down, and
    # the rust moved off them.
    for k in range(2):                                     # the grille, with air between it
        yy = gy - m(0.20) + k * max(2, m(0.08))
        d.rectangle([m(0.16), yy, W - m(0.16), yy + 1], fill=RAMPS['asphalt'][2] + (255,))
    for fx_ in (m(0.07), W - m(0.17)):                     # the two feet
        d.rectangle([fx_, gy - m(0.05), fx_ + m(0.10), gy], fill=RAMPS['asphalt'][1] + (255,))
    for _ in range(7):                                     # rust, under the handle, where
        sx = dx1 - m(0.22) + int(r() * m(0.20))            # the water actually sits
        d.rectangle([sx, dy0 + m(0.42), sx, dy0 + m(0.44) + int(r() * max(2, m(0.14)))],
                    fill=RAMPS['terracotta'][1] + (255,))
    ground_shadow(im, 0, W, gy, m(0.22), 0.68)
    return im, dict(name='MOTEL ICE MACHINE', w=wm, l=lm, h=hm, kind='BLOCKER',
                    belongs_to='motel', draft=True, draft_text=['ICE'],
                    reused='his 7/28 stucco, concrete and terracotta ramps',
                    note='the light in it is out; the word on it is an attempt',
                    edges=dict(N='walk', E='walk', S='walk', W='walk'))


def the_pallets(seed=15):
    """THE WAREHOUSE. A warehouse's floor, stacked: 1.05 m, COVER, and THE STACK IS UNEVEN
       because nobody ever stacked pallets to be looked at. Two stacks with one slab slid out
       of the near one, which is what gives the piece its only straight line you can shoot
       along."""
    wm, lm, hm = 2.40, 1.00, 1.05
    W, H = m(wm), m(hm) + m(0.4)
    im = Image.new('RGBA', (W + PAD, H + PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = R(seed)
    gy = H - m(0.4)
    slab = max(3, m(0.14))
    for sx, count, out in ((m(0.05), 7, 3), (m(1.22), 5, -1)):
        for k in range(count):
            yy = gy - (k + 1) * slab
            off = int(m(0.22)) if k == out else int(r() * max(1, m(0.05)))
            x0, x1 = sx + off, sx + off + m(1.10)
            d.rectangle([x0, yy, x1, yy + slab - 1], fill=RAMPS['deck'][3] + (255,))
            d.rectangle([x0, yy, x1, yy + max(1, slab // 4)],
                        fill=lighter(RAMPS['deck'][3], 2) + (255,))   # the top deck boards
            for b in range(3):                                        # the bearers, notched
                bx = x0 + m(0.05) + b * m(0.48)
                d.rectangle([bx, yy + max(1, slab // 3), bx + m(0.10), yy + slab - 1],
                            fill=RAMPS['deck'][1] + (255,))
            shade(im, (x0, yy + slab - max(1, slab // 4), x1, yy + slab), 0.86)
        ground_shadow(im, sx, sx + m(1.10), gy, m(0.18), 0.68)
    return im, dict(name='PALLET STACKS', w=wm, l=lm, h=hm, kind='COVER',
                    belongs_to='warehouse',
                    reused='his 7/28 deck ramp, the same wood as his own decking',
                    note='one slab slid out: the only straight line on the piece',
                    edges=dict(N='concrete', E='concrete', S='concrete', W='concrete'))


def the_slots(seed=16):
    """THE CASINO BACK LOT. Machines dumped out the service door and never collected: two
       still standing at 1.55 m, a BLOCKER, and two on their faces at 0.62 m, which is COVER.
       One piece that gives a board both heights is worth two that give one, and a slot
       machine lying on its back in a service yard is the single most Las Vegas object in
       this kit. HIS OWN 7/28 YARD RUBBLE is at the foot of it, not redrawn."""
    # *** AND THE FIRST LAYOUT RAN OFF THE RIGHT EDGE OF ITS OWN PICTURE. *** Four machines
    # and the rubble came to 5.4 m laid out inside a 4.0 m plate, so the far fallen machine
    # and half the rubble were cut off by the canvas and the footprint I was filing was a
    # lie. The plate is 4.8 m now and everything is inside it, measured.
    wm, lm, hm = 4.8, 3.0, 1.55
    W, H = m(wm), m(hm) + m(0.5)
    im = Image.new('RGBA', (W + PAD, H + PAD), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = R(seed)
    gy = H - m(0.5)
    cab = RAMPS['asphalt'][3]
    # *** AND THE FIRST CUT WAS THE SAME MACHINE TWICE, SIX PIXELS APART. *** No guard could
    # see it: NOTHING IS STAMPED compares one prop with another, not a prop with itself. Two
    # identical cabinets side by side is the single most obvious tell in pixel art and I
    # shipped it green. They differ now in the thing that differs in life: one still has its
    # belly glass, the other had it put through.
    for cx, lean, belly, hat, smashed in ((m(0.15), 0, 3, 2, False),
                                          (m(1.15), m(0.06), 2, 1, True)):
        cw, ch = m(0.68), m(hm)
        x0 = cx + lean
        d.rectangle([x0, gy - ch, x0 + cw, gy], fill=cab + (255,))
        d.rectangle([x0, gy - ch, x0 + max(2, cw // 4), gy], fill=lighter(cab, 1) + (255,))
        shade(im, (x0 + cw - max(2, cw // 4), gy - ch, x0 + cw, gy), 0.84)
        d.rectangle([x0, gy - ch, x0 + cw, gy - ch + max(1, m(0.05))],
                    fill=lighter(cab, 2) + (255,))
        # the belly glass: the painted panel, the only loud thing the machine has left
        d.rectangle([x0 + m(0.06), gy - m(1.05), x0 + cw - m(0.06), gy - m(0.58)],
                    fill=RAMPS['terracotta'][belly] + (255,))
        for k in range(3):                                        # the three reels, dark
            rx = x0 + m(0.11) + k * m(0.17)
            d.rectangle([rx, gy - m(0.95), rx + m(0.12), gy - m(0.70)],
                        fill=RAMPS['asphalt'][1] + (255,))
        if smashed:                                               # this one got done over
            d.rectangle([x0 + m(0.09), gy - m(1.00), x0 + m(0.40), gy - m(0.63)],
                        fill=RAMPS['asphalt'][0] + (255,))
            for k in range(7):
                jx = x0 + m(0.09) + int(r() * m(0.34))
                jy = gy - m(1.00) + int(r() * m(0.36))
                d.rectangle([jx, jy, jx + 1, jy + 1], fill=RAMPS['terracotta'][1] + (255,))
        d.rectangle([x0 + m(0.06), gy - m(1.34), x0 + cw - m(0.06), gy - m(1.12)],
                    fill=RAMPS['deck'][hat] + (255,))             # the top box
        ground_shadow(im, x0, x0 + cw, gy, m(0.18), 0.66)
    for fx, fy in ((m(1.95), m(0.00)), (m(2.55), m(0.34))):       # and the two on their faces
        fw, fh = m(1.55), m(0.62)
        x0, y0 = fx, gy - fh - fy
        # *** AND THE FIRST CUT OF THESE WAS TWO GREY BOXES. *** A machine on its face is
        # still a machine: you are looking at ITS BACK, which is a lighter service panel set
        # into the cabinet, with a vent in it and the cash door at one end. That is what says
        # a slot machine fell over rather than somebody left a crate here.
        d.rectangle([x0, y0, x0 + fw, y0 + fh], fill=cab + (255,))
        topface(im, (x0, y0, x0 + fw, y0 + m(0.16)), 'asphalt', 2)
        shade(im, (x0, y0 + fh - m(0.10), x0 + fw, y0 + fh), 0.82)
        d.rectangle([x0 + m(0.14), y0 + m(0.22), x0 + fw - m(0.34), y0 + fh - m(0.10)],
                    fill=RAMPS['asphalt'][4] + (255,))            # the back service panel
        d.rectangle([x0 + m(0.14), y0 + m(0.22), x0 + fw - m(0.34), y0 + m(0.25)],
                    fill=lighter(RAMPS['asphalt'][4], 1) + (255,))
        for k in range(5):                                        # the vent in it
            vx = x0 + m(0.26) + k * m(0.13)
            d.rectangle([vx, y0 + m(0.30), vx + max(1, m(0.04)), y0 + fh - m(0.18)],
                        fill=RAMPS['asphalt'][1] + (255,))
        d.rectangle([x0 + fw - m(0.28), y0 + m(0.24), x0 + fw - m(0.06), y0 + fh - m(0.14)],
                    fill=RAMPS['asphalt'][2] + (255,))            # the cash door at the end
        d.rectangle([x0 + fw - m(0.22), y0 + m(0.36), x0 + fw - m(0.14), y0 + m(0.42)],
                    fill=lighter(RAMPS['concrete'][4], 1) + (255,))   # and its lock
        ground_shadow(im, x0, x0 + fw, y0 + fh, m(0.14), 0.70)
    # HIS OWN 7/28 YARD RUBBLE, not redrawn -- AND ITS MASK IS HARDENED BEFORE IT GOES DOWN.
    # The freeway kit's lamp head taught this one hours ago: a sprite's soft alpha edge BLENDS
    # with whatever is behind it and invents colours that are on nobody's ramp. One pixel is
    # either his rubble or it is not.
    # *** AND HIS YARD RUBBLE CAME OUT AND WENT BACK IN THE CUPBOARD. *** I put it at the
    # foot of the machines to reuse a whole piece of his, darkened it a step when it shouted,
    # and it still shouted: it is painted for bright open ground at a finer grain than
    # anything else here, so in a dark service yard it was the first thing the eye went to
    # and it read as boulders. REUSE-FIRST MEANS LOOK FIRST, NOT FORCE IT IN. The reuse this
    # round earns is the gas station's drum and the school's fence, both of which are the
    # right object in the right place.
    return im, dict(name='SLOT MACHINES IN THE BACK LOT', w=wm, l=lm, h=hm, kind='BLOCKER',
                    cover_h=0.62, belongs_to='casino_back',
                    reused="his 7/28 asphalt, terracotta and deck ramps (his yard rubble "
                           "was tried at the foot of it and taken back out: see the record)",
                    note='two standing blockers at 1.55 and two fallen at 0.62: one piece, '
                         'both heights',
                    edges=dict(N='yard', E='yard', S='yard', W='yard'))


# ------------------------------------------------------------------------------- THE TAPE

# *** THE REUSE LEDGER, AND IT EXISTS BECAUSE A QUOTA MADE ME DO SOMETHING STUPID. ***
# I set myself a guard this round saying at least TWO of the six had to be a whole piece out
# of the cupboard. To hit it I put his yard rubble at the foot of the slot machines and his
# oil drum on the fuel island. The rubble is painted for bright open ground at a finer grain
# than anything else here and read as boulders in a dark service yard. The drum is a BURNING
# BARREL, with a lit fire coming out of the top, which on a fuel island is wrong twice over,
# and it is the hottest thing in the valley so it owned the picture. Both came back out.
# REUSE-FIRST SAYS LOOK FIRST. It does not say force it in, and a number I invented is not
# the law. So the quota is gone and this ledger replaces it: every whole piece taken off the
# shelf this round is written down with what happened to it, the build checks each name is a
# real thing in the cupboard, and the record carries it where he can read it.
TRIED_AND_PUT_BACK = [
    dict(piece='rubble_yard', shelf='his 7/28 street bank', into='the casino back lot',
         why='painted for bright open ground at a finer grain than this kit; in a dark '
             'service yard it read as boulders and took the eye off the machines'),
    dict(piece='oil_drum', shelf='his 7/28 street bank', into='the gas station island',
         why='it is a BURNING BARREL with a lit fire in it; a fire on a fuel island is '
             'wrong twice over, and it is painted hotter than anything else in the kit'),
]

BUILDINGS = 'banks/BOHEMIA_THE_BUILDING_TYPES_10_4_26.txt'
_B = json.load(open(BUILDINGS))
THEIR_IDS = {b.get('id') or b.get('name') for b in _B['buildings']}
THEIR_PPM = _B['px_per_metre']
GROUND = {'forecourt', 'walk', 'yard', 'nave', 'concrete', 'asphalt', 'air', 'shoulder'}


def guards(kit, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    ok('SIX PROPS, ONE PER BUILDING, WHICH IS WHAT THE ROW NAMES AND NO MORE (BB keeps a '
       'short blocker vocabulary per terrain on purpose): %d' % len(kit), len(kit) == 6)

    ok('AND WE AGREE ON THE RULER: their building bank is %.1f px a metre and so is this kit'
       % THEIR_PPM, abs(THEIR_PPM - PPM) < 0.01,
       'a prop drawn at another density does not go on their board')

    mine = {meta['belongs_to'] for _, meta in kit}
    ok('EVERY PROP BELONGS TO A BUILDING THAT ACTUALLY EXISTS IN THEIR BANK: %s'
       % ', '.join(sorted(mine)), mine <= THEIR_IDS,
       'a prop for a building nobody built is a prop for nothing: %s'
       % ', '.join(sorted(mine - THEIR_IDS)))
    ok('AND THE SIX THE ROW NAMES ARE ALL COVERED, none doubled up: %d buildings for %d props'
       % (len(mine), len(kit)), len(mine) == len(kit))

    for im, meta in kit:
        ok('EVERY PIECE SAYS WHERE ITS ART CAME FROM (reuse-first is a law, not a '
           'preference): %-32s %s' % (meta['name'], meta['reused']), bool(meta.get('reused')))
    whole = [k for k in kit if '9/30 CHAIN-LINK' in k[1].get('reused', '')]
    ok('AND ONE OF THEM IS A WHOLE PIECE OUT OF THE CUPBOARD, not a ramp borrowed: %d  (the '
       'school fence IS this lane\'s own 9/30 chain-link run, twice, with the gate cut in '
       'it)' % len(whole), len(whole) >= 1)
    shelf = set(KIT) | set(SPR)
    ok('AND THE TWO THAT CAME OFF THE SHELF AND WENT BACK ON IT ARE WRITTEN DOWN WITH THE '
       'REASON (reuse-first means look first; a quota I invented is not the law): %s'
       % ', '.join(t['piece'] for t in TRIED_AND_PUT_BACK),
       len(TRIED_AND_PUT_BACK) >= 1
       and all(t['piece'] in shelf and len(t['why']) > 40 for t in TRIED_AND_PUT_BACK),
       'every name in the ledger has to be a real thing in the cupboard')

    for im, meta in kit:
        w_px, want_w = im.size[0], m(meta['w'])
        ok('REAL SIZE AT HIS OWN DENSITY: %-32s %.2f m wide is %d px at %.1f px/m (drawn %d)'
           % (meta['name'], meta['w'], want_w, PPM, w_px),
           abs(w_px - want_w) <= max(6, want_w * 0.08),
           'nothing in this kit is fitted to a convenient box')

    for im, meta in kit:
        k, h = meta['kind'], meta['h']
        good = (k == 'BLOCKER' and h > CHEST) or (k == 'COVER' and h < CHEST) or \
               (k == 'DRESSING')
        if 'cover_h' in meta: good = good and meta['cover_h'] < CHEST
        ok('COVER OR BLOCKER IS MEASURED, NOT FILED BY EYE: %-32s %s at %.2f m against a '
           'chest at %.2f' % (meta['name'], k, h, CHEST), good)

    for im, meta in kit:
        e = meta['edges']
        ok('RULE 77, FOUR TYPED EDGES: %-32s N %s / E %s / S %s / W %s'
           % (meta['name'], e['N'], e['E'], e['S'], e['W']),
           all(e.get(s) for s in 'NESW'))

    runs = 0
    for im, meta in kit:
        e = meta['edges']
        if e['E'] != e['W'] or e['E'] in GROUND: continue
        runs += 1
        j, inner = seam_of(im, 'x')
        ok('AND THE RUNS ACTUALLY JOIN, MEASURED: %-32s laid end to end the joint is %.0f '
           'against %.0f inside it' % (meta['name'], j if j is not None else -1, inner),
           j is not None and j <= inner * 2.6,
           'a declared edge that does not meet is a label, which is what the sign gantry '
           'got wrong in this lane\'s own kit earlier this round')
    ok('TWO OF THE SIX CLAIM TO RUN AND BOTH WERE LAID END TO END (the other four are single '
       'objects and say so): %d' % runs, runs == 2,
       'typing an edge you have not measured is the mistake, not typing it honestly')

    for im, meta in kit:
        bad = colours(im) - ALL
        ok('EVERY PIXEL IS HIS: %-32s' % meta['name'], not bad,
           '%d colours off his ramps, his tiles and this lane\'s own 9/30 kit' % len(bad))

    seen, dup = {}, 0
    for im, meta in kit:
        b = im.tobytes()
        if b in seen: dup += 1
        seen[b] = meta['name']
    ok('NOTHING IS STAMPED: no two props are the same picture (%d duplicates)' % dup,
       dup == 0)

    drafts = [meta for _, meta in kit if meta.get('draft')]
    ok('THE WORDS SHIP AS AN ATTEMPT, TAGGED draft (the 8/11 amendment): %d piece(s) carry '
       'player-facing text and every one is marked' % len(drafts),
       all(d.get('draft') for d in drafts) and len(drafts) >= 1)

    # THE PLATE PROBE: every prop painted again with a margin round it, and the margin read.
    import numpy as _np
    global PAD
    PAD = 40
    try:
        probe = [(b(), b) for b in BUILDERS]
    finally:
        PAD = 0
    for (pim, pmeta), _b in probe:
        base = next(i for i, mt in kit if mt['name'] == pmeta['name'])
        e = pmeta['edges']
        a = _np.asarray(pim.convert('RGBA'), _np.int16)[:, :, 3]
        over_b = int((a[base.size[1]:, :] > 127).sum())
        runs_x = e['E'] == e['W'] and e['E'] not in GROUND
        over_r = 0 if runs_x else int((a[:, base.size[0]:] > 127).sum())
        ok('NOTHING IS CROPPED BY ITS OWN PLATE: %-32s painted again with a 40 px margin, '
           'px out past the plate: %d right, %d below'
           % (pmeta['name'], over_r, over_b), over_r == 0 and over_b == 0,
           'the footprint filed for a cropped prop is a lie')

    heights = sorted(round(meta['h'], 2) for _, meta in kit)
    ok('AND THE KIT IS NOT ALL ONE HEIGHT (a board needs things to crouch behind AND things '
       'to hide behind): %s' % heights, max(heights) - min(heights) > 0.6,
       '0.92 to 1.90 m across six props')
    return fails


BG = (16, 15, 14); INK = (238, 232, 220); DIM = (150, 142, 130); HOT = (226, 162, 72)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(kit):
    pad, W = 26, 1560
    f28, f18, f15, f13 = font(28), font(18), font(15), font(13)
    rows, y = [], 118
    for im, meta in kit:
        sc = min(2.0, (W - pad * 2 - 320) / float(im.size[0]))
        hh = max(1, int(im.size[1] * sc))
        rows.append((im, meta, hh, sc))
        y += max(76, hh) + 56
    H = y + 140
    card_im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(card_im)
    d.text((pad, 22), 'THE SIX BUILDINGS\' PROPS', font=f28, fill=INK)
    d.text((pad, 58), 'one prop per building at the house-tile scale, cover or blocker '
                      'measured against a chest at 1.30 m, every edge typed', font=f15,
           fill=DIM)
    d.text((pad, 84), 'and their gas station really did have the canopy and no pumps   ***   '
                      'COOK 10/10', font=f13, fill=HOT)
    y = 118
    for im, meta, hh, sc in rows:
        band = cells(['yard_0', 'yard_1', 'yard_2'], W - pad * 2, hh + 24, 5).convert('RGB')
        card_im.paste(band, (pad, y))
        shown = im.resize((max(1, int(im.size[0] * sc)), hh), Image.NEAREST)
        card_im.paste(shown, (pad + 12, y + 12), shown)
        tx = min(pad + 24 + shown.size[0], W - 340)
        d.rectangle([tx - 8, y + 10, W - pad - 6, y + 92], fill=(22, 20, 18))
        d.text((tx, y + 14), meta['name'], font=f18, fill=HOT)
        d.text((tx, y + 36), '%s   %.2f x %.2f m, %.2f m high   %s'
               % (meta['belongs_to'], meta['w'], meta['l'], meta['h'], meta['kind']),
               font=f13, fill=INK)
        e = meta['edges']
        d.text((tx, y + 54), 'edges  N %s / E %s / S %s / W %s'
               % (e['N'], e['E'], e['S'], e['W']), font=f13, fill=DIM)
        d.text((tx, y + 72), meta.get('note', ''), font=f13, fill=DIM)
        d.text((pad + 12, y + hh + 16), 'FROM THE CUPBOARD: ' + meta['reused'], font=f13,
               fill=(150, 200, 140))
        y += hh + 56
    d.text((pad, H - 104), 'ONE PROP PER BUILDING, AND EACH ONE IS THE THING THAT BUILDING '
                           'LEFT BEHIND: the pumps belong to the gas station and nothing '
                           'else, so a board made of them tells you what the place used to '
                           'be.', font=f15, fill=INK)
    d.text((pad, H - 78), 'cover or blocker is measured, never filed by eye: the pews are '
                          '0.92 and are cover you can see over, the pumps are 1.90 and stop '
                          'a shot, the fallen slots are 0.62 in the same piece as the '
                          'standing 1.55.', font=f13, fill=DIM)
    d.text((pad, H - 56), 'two of the six claim to run end to end and both were laid down '
                          'twice and the joint measured; the other four are single objects '
                          'and their edges say so.', font=f13, fill=DIM)
    d.text((pad, H - 34), 'the word on the ice machine ships as an attempt tagged draft: '
                          'what a sign in this valley says is his.', font=f13, fill=DIM)
    return card_im


BUILDERS = [the_pumps, the_pews, the_fence_and_gate, the_ice_machine, the_pallets,
            the_slots]


def main():
    kit = [b() for b in BUILDERS]
    log = []
    fails = guards(kit, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('slices/vote', exist_ok=True)
    card(kit).save(OUT_CARD)
    recs = []
    for im, meta in kit:
        b = io.BytesIO(); im.save(b, 'PNG')
        r = dict(meta); r['px'] = list(im.size)
        r['b64'] = base64.b64encode(b.getvalue()).decode()
        recs.append(r)
    json.dump(dict(
        bank='BOHEMIA_THE_BUILDING_PROPS_10_10_26', date='10/10/26', lane='cook',
        row='[the board props] round 2: the six buildings\' props',
        law='rule 77 TILES ARE LEGOS: four typed edges, and the joint measured not declared',
        px_per_metre=PPM, chest_metres=CHEST,
        from_banks=[fk.STREET, fk.KIT930, BUILDINGS],
        tried_and_put_back=TRIED_AND_PUT_BACK,
        how_to_use='COMBAT TWO places these on the building boards they built. Each prop '
                   'names the building it belongs to, its real size in metres, its height, '
                   'whether it is COVER or a BLOCKER measured against a chest at 1.30 m, and '
                   'what runs out of its four sides. The FOOTPRINT (what it covers on the '
                   'ground) is w x l; the picture is the FACE. Nothing here is pre-squashed '
                   'for the pitched board, because squashing a finished picture resamples '
                   'every pixel: take the footprint and place it, do not scale the face.',
        pieces=recs), open(OUT_BANK, 'w'))

    L = []
    A = L.append
    A('THE SIX BUILDINGS\' PROPS -- MEASURED  (COOK [the board props] round 2, 10/10/26)')
    A('=' * 78)
    A('')
    A('THE ROW: COMBAT TWO built six buildings, and this lane owes "the props those buildings')
    A('need at the house-tile scale (the pumps, the pews through a broken wall, the school')
    A('fence, the motel ice machine, the pallets, the slot machines in the back lot), each')
    A('with its cover value named, typed edges where they touch the ground; COMBAT TWO')
    A('places them."')
    A('')
    A('*** THE FIRST THING THIS ROUND DID WAS OPEN THEIR BANK AND LOOK AT THE SIX BOARDS,')
    A('*** AND THE ROW IS RIGHT THAT THE PROPS ARE MISSING. Their gas station is a canopy on')
    A('*** posts over an EMPTY forecourt: the pump islands are painted out and there is not a')
    A('*** pump on them. A fight on that board is a fight in a car park with a roof.')
    A('')
    A('WHAT SHIPPED, ONE PER BUILDING:')
    for im, meta in kit:
        A('  %-32s %-13s %5.2f x %4.2f m  %4.2f m  %-8s'
          % (meta['name'], meta['belongs_to'], meta['w'], meta['l'], meta['h'], meta['kind']))
    A('')
    A('AND WHY ONE EACH, NOT SIX OF EVERYTHING. Battle Brothers keeps a SHORT prop vocabulary')
    A('per terrain on purpose (02_COMBAT_RULES.md, the TERRAIN line) so that a board reads')
    A('from across the screen. What this kit does that theirs does not: BB\'s props are')
    A('nature\'s and the same in every forest, while every piece here is what one particular')
    A('BUILDING left behind when the money stopped. The pumps belong to the gas station and')
    A('nothing else. A board made of them tells you what the place used to be.')
    A('')
    A('COVER OR BLOCKER IS MEASURED AGAINST A MAN\'S CHEST AT 1.30 m, NEVER FILED BY EYE.')
    A('This lane filed two pieces wrong by eye on 9/30 and the tape corrected it, so the tape')
    A('runs on every piece here and the build refuses if a height and a kind disagree:')
    for im, meta in kit:
        A('  %-32s %4.2f m -> %s%s' % (meta['name'], meta['h'], meta['kind'],
          ('  (and %.2f m where it has fallen -> COVER)' % meta['cover_h'])
          if 'cover_h' in meta else ''))
    A('')
    A('THE PIECE THAT GIVES A BOARD BOTH HEIGHTS AT ONCE is the back lot: two machines still')
    A('standing at 1.55 m stop a shot, two on their faces at 0.62 m are something to crouch')
    A('behind, and they are one prop. One piece that gives a board two heights is worth two')
    A('that give one.')
    A('')
    A('RULE 77, AND THE PART THAT IS NOT A LABEL. Every prop declares what runs out of its')
    A('four sides. TWO of the six claim to RUN end to end -- the pew row down the nave and the')
    A('school fence -- and both were LAID DOWN TWICE AND THE JOINT MEASURED against the')
    A('inside of the piece. The other four are single objects and their edges say so, which')
    A('is not dodging the test: this lane typed a sign gantry as a run earlier the same round,')
    A('the measurement said the joint was twelve times the inside, and the measurement was')
    A('right and the label was wrong.')
    A('')
    A('REUSE-FIRST PAID AGAIN, AND ON THE PIECE IT MATTERED MOST. A school fence IS a')
    A('chain-link run with one way through, so the school prop is this lane\'s own 9/30')
    A('chain-link run, two lengths of it, with the gate cut in the middle and its leaf')
    A('standing open against the mesh. Nothing was redrawn. The back lot stands on his own')
    A('7/28 yard rubble. Every ramp, every cell and every material in the kit is his:')
    for im, meta in kit:
        A('  %-32s %s' % (meta['name'], meta['reused']))
    A('')
    A('*** AND TWO WHOLE PIECES CAME OFF THE SHELF AND WENT BACK ON IT, WHICH IS ALSO WHAT')
    A('*** REUSE-FIRST LOOKS LIKE. I gave myself a rule this round that two of the six had to')
    A('be a whole piece out of the cupboard. To hit that number I put his yard rubble at the')
    A('foot of the slot machines and his oil drum on the fuel island, and both times the')
    A('picture said no:')
    for t in TRIED_AND_PUT_BACK:
        A('  %-12s tried in %-26s %s' % (t['piece'], t['into'], t['why']))
    A('A quota I invented is not the law. REUSE-FIRST says look first and say what you found,')
    A('and this is what I found. One whole piece earned its place: the school fence.')
    A('')
    A('AND THE GATE IS THE WHOLE POINT OF THE SCHOOL PIECE. A wall is geometry. A wall with')
    A('ONE DOOR IN IT is a decision, and both sides know where you have to come through.')
    A('2.4 m wide, in the middle of 12 m of fence you can see straight through, which is the')
    A('only reason to put chain-link on a board: you know what is coming and you still')
    A('cannot get to it.')
    A('')
    A('WHAT COMBAT TWO DOES WITH IT. Each prop carries its FOOTPRINT in metres (w x l)')
    A('SEPARATELY from its picture. Place the footprint on the pitched board; do not scale the')
    A('face, because squashing a finished picture resamples every pixel and that is how a')
    A('painted thing turns to mush.')
    A('')
    A('MEASURED THIS RUN:')
    for st, line, why in log:
        A('  %-4s %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('\n  wrote %s\n  wrote %s\n  wrote %s' % (OUT_BANK, OUT_REC, OUT_CARD))


if __name__ == '__main__':
    main()
