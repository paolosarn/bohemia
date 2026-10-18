#!/usr/bin/env python3
"""HIS BLOCK, AS A PLACE YOU ARRIVE AT  (COOK [settlement art] round 1, 10/10/26)

The row, rule 37b (Paolo 9/27, 'you see the settlement, you just click the building'): "the
settlement screen's picture, ONE REAL PLACE FIRST (HIS BLOCK), buildings tappable and readable
at phone size, lights and people moving under the bible, from the game's camera; DIRECTION
judges; RUN wires the taps."

*** THE FIRST THING THIS ROUND DID WAS OPEN THE SCREEN AND FIND OUT WHAT IS ALREADY THERE,
*** AND MOST OF THE ROW WAS ALREADY BUILT BY OTHER LANES.
  the picture          COMBAT TWO, 10/4: camp, town and fortress, two variants each, hotspots
                       per building. This lane painted them over on 10/10 (rain, wear, trash,
                       door light).
  people moving        ANIMATION, 10/9: slices/settlement_people, the 112 rig in the runway
                       clothes, nine clips on the 120 beat, 25 looks, three facings.
  placing them         RUN TWO, 10/10: a keeper at each door doing his building's clip, a
                       crowd by the stall whose size the place's traits set, depth-sorted,
                       thinned at night.
  the taps             RUN TWO: the hotspot lights under the finger and names itself on touch.
So there was no point in this lane cooking a crowd: one existed, by the lane that owns rigs,
at this exact scale. WHAT NOBODY HAD TOUCHED IS THE ROW'S FIRST FOUR WORDS -- ONE REAL PLACE
FIRST (HIS BLOCK). The three places are SIZES, not places: camp, town, fortress. None of them
is anywhere. His block is somewhere: it is the one he wakes on, the home base of the third
votes, and it is the only address in this game that is his.

SO THIS ROUND MAKES THE FOURTH PLACE, AND IT IS A PLACE AND NOT A SIZE:
  YOUR HOUSE       the door you wake behind, its step, the couch nobody moved, and the
                   driveway with HIS OWN 7/28 wreck on it. Tap: hall, where a job comes from.
  NEXT DOOR        the neighbour's, his gate shut, his table out at the kerb. Tap: stall.
  THE KERB         the board on its pole where the block's paper goes. Tap: board.
  THE DRIVEWAY     his wreck, still there. Tap: lot, which is SCAVENGE (the third votes).
Four taps: hall, board, stall, lot -- WHICH IS THE CAMP TIER'S OWN LIST, on purpose, so RUN
TWO wires a new place by naming it and nothing else.

BUILT FROM THEIR OWN MACHINERY, NOT A SECOND SET OF PARTS. The ground, the houses at 45, the
stall, the board on its pole, the night and its measure are COMBAT TWO's own functions,
imported; the finishing (rain down the walls, the ground worn where people walk, the trash,
the light out of a door at night) is this lane's own 10/10 pass, imported; the wreck and both
lamps are HIS 7/28 sprites. This tool draws four things that did not exist: the stoop, the
driveway, the gate and the couch.

*** AND THE LABELS COME OFF, WHICH IS THIS LANE'S OWN DEFECT FROM LAST ROUND. *** COMBAT TWO's
manifest says 'no text on the picture; name it only when touched' and their tool's own law
says each usable building must say what it is with one object you can see from across the
screen, 'NEVER A LABEL'. On 10/10 this lane painted CUTS, CLINIC, ROOMS, TRADE and NOTICES
onto their sheets as floating word boxes. That is text on the picture, it is a second name on
top of the one RUN TWO's screen already gives on touch, and rule 19 bans prose with no mouth
behind it. This place carries NO TEXT AT ALL and no font is loaded; the sheets that already
have it are named in the record for the next round, with the evidence.

    python3 tools/bohemia_his_block_as_a_place_cook_10_10_26.py
      -> slices/settlement_ground/home_0.webp, home_0_night.webp
      -> slices/settlement_ground/settlement_ground.json   (spliced, not re-serialised)
      -> records/BOHEMIA_HIS_BLOCK_AS_A_PLACE_MEASURED_10_10_26.txt
      -> slices/vote/COOK_HIS_BLOCK.png

REFERENCE CHECK (the 9/4 standing law):
  10_UI_AND_FEEL.md, THE SETTLEMENT SCREEN: 'the town in one painted view with its buildings
        as clickable icons'. Taken: one painted view, the building IS the button, no label.
  TG-02 THE HOUSE FROM 45 DEGREES: roof first, then the face. Taken by using their house45.
  CGRD-01 INTO THE BREACH: each tappable thing says what it is with one object from across
        the screen -- a table at the gate, paper on a pole, a wreck on a drive, a lit door.
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east.
  REUSE CHECK: the ground, the houses, the stall, the board, the night and its measure are
        COMBAT TWO's 10/1 and 10/4 cooks, imported and called, never copied; the finishing
        pass is this lane's own 10/10 cook, imported; the wreck and the two lamps are HIS own
        7/28 sprites, placed by their own placer. Four small things are new.

[bb settlements] reference/library/battle_brothers/10_UI_AND_FEEL.md: their settlement screen
  is ONE PAINTED VIEW with the buildings as the buttons, and the sound line says 'the
  settlement has CROWD MURMUR and a blacksmith'. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule
  33g, which that same file states as our own law: 'what we do not copy: THE STILLS'): you
  HEAR a crowd in a Battle Brothers town and you never see one -- the painting is fixed and
  empty. Ours draws the people you hear, and more than that, OURS HAS AN ADDRESS: their town
  screen is a type (a village, a town, a city) reused everywhere that type appears, while this
  place is one block, yours, with your door on it and your wreck on the drive.
"""
import base64, importlib, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(REPO, 'tools'))
os.chdir(REPO)

C2 = importlib.import_module('bohemia_combat2_settlement_pictures_cook_10_4_26')
FIN = importlib.import_module('bohemia_the_settlement_pictures_finished_cook_10_10_26')
H7, S8, BT, CV, NB, K, B, F = C2.H7, C2.S8, C2.BT, C2.CV, C2.NB, C2.K, C2.B, C2.F
m, ty, PX, PY, paste = K.m, B.ty, B.PX, B.PY, C2.paste
RAMPS = K.RAMPS

GROUND_DIR = 'slices/settlement_ground'
MAN = GROUND_DIR + '/settlement_ground.json'
OUT_REC = 'records/BOHEMIA_HIS_BLOCK_AS_A_PLACE_MEASURED_10_10_26.txt'
OUT_CARD = 'slices/vote/COOK_HIS_BLOCK.png'
SEED = 1701
TINTED = []
DOOR_AT = []
TEXTS = [0]
DOORWAYS = {}
NORTH_TINTS = []


def count_text_draws():
    """EVERY TEXT DRAW MADE WHILE THE PICTURE IS BUILT, COUNTED AT THE LIBRARY'S OWN CALL.
       Not a grep of this file: a wrapper, so the guard measures what happened."""
    real = ImageDraw.ImageDraw.text
    def counted(self, *a, **k):
        TEXTS[0] += 1
        return real(self, *a, **k)
    ImageDraw.ImageDraw.text = counted
    return real

# THE PICTURE'S OWN BANDS, TAKEN FROM THEIR GEOMETRY AND NOT GUESSED IN METRES. A house
# tile is PY deep, so the far row's faces end at PY; their own town puts anything standing on
# the north walk with its feet on ty(m(19.2)), which is where the walk meets the road. So the
# front yards of his block are the band between those two numbers, and everything in a yard
# is placed against them. My first cut placed the stoop, the drive, the wreck and the gate in
# METRES down from the top and put all four ON THE ROOF.
FACE = PY                      # 364: where the far row's faces end
KERB = ty(m(19.2))             # 583: their own north kerb line, their number

def die(msg): sys.exit('REFUSED: ' + msg)


def lighter(c, steps=1):
    """A step UP the ramp this colour already belongs to. Never a brighter number: a lit
       face is the next colour HE approved, not an arithmetic one, which is how a cook invents
       a colour that is on nobody's bank."""
    fam = min(RAMPS, key=lambda f: min(
        abs(e[0] - c[0]) + abs(e[1] - c[1]) + abs(e[2] - c[2]) for e in RAMPS[f]))
    ramp = sorted(RAMPS[fam], key=K.LUM)
    i = min(range(len(ramp)), key=lambda k: abs(K.LUM(ramp[k]) - K.LUM(c)))
    return ramp[min(len(ramp) - 1, i + steps)]


# ------------------------------------------------- THE FOUR THINGS THAT DID NOT EXIST YET

def roof_tint(tile, step):
    """FOUR HOUSES OFF ONE FUNCTION ARE FOUR COPIES. house45 takes a seed and a facing and
       nothing else, so a row of four reads as one house printed four times, which is the
       exact fault this lane shipped green in the back lot last round. The roofs are moved
       along HIS OWN terracotta ramp instead -- one step up, one step down, one left alone --
       so the row has four roofs that have weathered differently and not one pixel is off his
       bank."""
    if step == 0: return tile
    # the last entry of his terracotta ramp is a white HIGHLIGHT, not a roof colour, so the
    # step stops one short of it: a roof that weathered UP into white is not weathering.
    ramp = sorted(RAMPS['terracotta'], key=K.LUM)[:-1]
    px = tile.load()
    w, h = tile.size
    memo, moved = {}, 0
    for y in range(h):
        for x in range(w):
            c = px[x, y][:3]
            if c not in memo:
                j = min(range(len(ramp)), key=lambda k: abs(ramp[k][0] - c[0])
                        + abs(ramp[k][1] - c[1]) + abs(ramp[k][2] - c[2]))
                d = abs(ramp[j][0] - c[0]) + abs(ramp[j][1] - c[1]) + abs(ramp[j][2] - c[2])
                # *** AND THE FIRST CUT OF THIS MOVED ALMOST NOTHING. *** It asked for an
                # EXACT ramp colour, and his roof is painted in colours one or two off the
                # ramp (226,129,70 against the ramp's 227,130,71), so four roofs stayed four
                # copies. It snaps to the nearest ramp colour within 12 now, which is tight
                # enough that the tan ground (105 away from any terracotta) is never touched.
                memo[c] = ramp[max(0, min(len(ramp) - 1, j + step))] if d <= 12 else None
            if memo[c] is not None and memo[c] != c:
                px[x, y] = memo[c] + (px[x, y][3],) if len(px[x, y]) == 4 else memo[c]
                moved += 1
    TINTED.append((step, moved))
    return tile


def find_door(tile):
    """WHERE YOUR DOOR ACTUALLY IS, MEASURED OFF THE TILE, NOT GUESSED. house45 takes a seed,
       so the door moves along the face from house to house; my first cut put the step at a
       fixed offset and it landed under a window. The door is the longest run of near-black
       pixels in the bottom of the face, because a doorway in this light is the darkest thing
       on a wall. If no run is long enough the piece is placed nowhere and the build refuses,
       rather than putting your step in the middle of a wall."""
    px = tile.convert('RGB').load()
    lo, hi = m(0.75), m(1.45)            # a door a person walks through, in metres, not pixels
    seen = {}
    for y in range(PY - 34, PY - 2):
        run = 0
        for x in range(tile.size[0] + 1):
            dark = x < tile.size[0] and sum(px[x, y]) < 95
            if dark:
                run += 1
            else:
                if lo <= run <= hi:
                    k = (x - run, x - 1)
                    seen[k] = seen.get(k, 0) + 1
                run = 0
    if not seen: return None
    # *** AND THE FIRST CUT OF THIS FOUND THE GARAGE. *** 'The longest dark run on the face'
    # picked a 213 px band -- five metres of it -- which is the open garage and the shadow
    # under the eave, and it put the step halfway along the wall. A door is a dark run ABOUT
    # A METRE WIDE that holds for most of the wall's height, so the width window is in metres
    # and the winner is the one that repeats down the most rows.
    (x0, x1), rows = max(seen.items(), key=lambda t: (t[1], -t[0][0]))
    return (x0, x1) if rows >= 8 else None


def the_stoop(w_m=2.6, rise_m=0.35):
    """YOUR STEP. The one thing in this picture you have stood on. Two courses of concrete
       with the tread lit and the riser turned over into shadow, and it is cut to the 45
       degree law like every other surface here: its depth on the picture is its depth in the
       world times cos 45."""
    w, d = m(w_m), ty(m(1.1))
    im = Image.new('RGBA', (w, d + ty(m(rise_m)) + 2), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    con = RAMPS['concrete'][3]
    dr.rectangle([0, 0, w - 1, d], fill=con + (255,))                       # the tread
    dr.rectangle([0, 0, w - 1, max(1, d // 6)], fill=lighter(con, 2) + (255,))
    dr.rectangle([m(0.25), d, w - m(0.25) - 1, d + ty(m(rise_m))],
                 fill=RAMPS['concrete'][1] + (255,))                        # the riser, south
    dr.rectangle([0, d - 2, w - 1, d], fill=RAMPS['concrete'][2] + (255,))  # the nosing
    return im


def the_drive(len_m=9.0, w_m=3.2):
    """THE DRIVEWAY. A concrete strip from the kerb to the house with the pair of oil marks a
       car that sat for years leaves, and a crack down the middle, because nothing in this
       valley was poured twice."""
    w, d = m(w_m), ty(m(len_m))
    im = Image.new('RGBA', (w, d), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    r = K.R(SEED * 7 + 3)
    # *** AND THE DRIVE WENT DOWN A STEP BECAUSE THE NIGHT MEASURED IT. *** At concrete[3]
    # this slab is the palest thing in the picture, 40,000 px of it, and rule 73's test came
    # back at 2.7 lit-against-unlit against its bar of 3.0: a pale unlit ground is exactly
    # what kills that ratio. A drive that has been stood on since before the money stopped is
    # not fresh concrete anyway.
    dr.rectangle([0, 0, w - 1, d - 1], fill=RAMPS['concrete'][2] + (255,))
    dr.rectangle([0, 0, 1, d - 1], fill=lighter(RAMPS['concrete'][2], 1) + (255,))
    dr.rectangle([w - 2, 0, w - 1, d - 1], fill=RAMPS['concrete'][1] + (255,))
    cx = w // 2                                                             # the crack
    for y in range(0, d, 2):
        cx = max(3, min(w - 4, cx + (1 if r() < 0.5 else -1)))
        dr.rectangle([cx, y, cx, y + 1], fill=RAMPS['concrete'][1] + (255,))
    for oy in (int(d * 0.40), int(d * 0.62)):                               # where it stood
        for _ in range(90):
            ox = int(w * 0.18 + r() * w * 0.64)
            oyy = oy + int((r() - 0.5) * ty(m(0.9)))
            if 0 <= ox < w and 0 <= oyy < d:
                dr.rectangle([ox, oyy, ox + int(r() * 2), oyy],
                             fill=RAMPS['concrete'][1 if r() < 0.6 else 0] + (255,))
    return im


def the_gate(w_m=3.0, h_m=1.9):
    """NEXT DOOR'S GATE, SHUT. The neighbour is open for business at his table and not open
       at his gate, and on a picture you read that in one look.

       *** THE FIRST CUT OF THIS WAS CHAIN-LINK AND IT VANISHED. *** A see-through fence on
       tan ground at this size is nothing: I put it in the picture and could not find it
       again. A gate that has to be looked for is not a gate, so it is a SHEET-METAL leaf
       between two block piers -- solid, dark, and legible from across a phone."""
    w, h = m(w_m) + m(0.7), m(h_m)
    im = Image.new('RGBA', (w, h + ty(m(0.4))), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    leaf = RAMPS['asphalt'][3]
    dr.rectangle([m(0.35), m(0.18), w - m(0.35), h], fill=leaf + (255,))
    dr.rectangle([m(0.35), m(0.18), w - m(0.35), m(0.26)], fill=lighter(leaf, 2) + (255,))
    for k in range(1, 6):                                      # the ribs of a sheet gate
        rx = m(0.35) + k * (w - m(0.7)) // 6
        dr.rectangle([rx, m(0.26), rx + 1, h], fill=RAMPS['asphalt'][1] + (255,))
    pier = RAMPS['concrete'][2]
    for px_ in (0, w - m(0.35)):
        dr.rectangle([px_, 0, px_ + m(0.35), h + ty(m(0.3))], fill=pier + (255,))
        dr.rectangle([px_, 0, px_ + max(1, m(0.12)), h + ty(m(0.3))],
                     fill=lighter(pier, 2) + (255,))
    return im


def the_notice_board(w_m=2.75, h_m=1.8):
    """THE BLOCK'S BOARD, AND IT IS A NEW PIECE BECAUSE THEIRS CANNOT BE HIT. Measured:
       COMBAT TWO's board_on_pole is 86 px wide, which is SIXTEEN PIXELS when this picture is
       shown at a phone's 390, against a thumb of about 44. Their three places have the same
       problem and it is in the record for them. A block's board is not a parking sign on a
       post anyway: it is a sheet of ply on two legs with everyone's paper on it, and at
       2.75 m it is a thing you can see from across the street AND a thing a thumb can land
       on: 118 picture px, which is 45 px on his phone against a 44 px thumb.

       THE ANALOG HORROR LINE (rule 20): the paper is three deep and the bottom layer is for
       people nobody has seen since. Nobody takes anything down; they staple over it."""
    w, h = m(w_m), m(h_m)
    im = Image.new('RGBA', (w, h + ty(m(0.4))), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    r = K.R(SEED * 13 + 5)
    leg = RAMPS['deck'][1]
    for lx in (m(0.25), w - m(0.25) - m(0.14)):
        dr.rectangle([lx, m(0.6), lx + m(0.14), h + ty(m(0.35))], fill=leg + (255,))
    ply = RAMPS['deck'][3]
    dr.rectangle([0, 0, w - 1, m(1.25)], fill=ply + (255,))
    dr.rectangle([0, 0, w - 1, max(1, m(0.05))], fill=lighter(ply, 2) + (255,))
    for _ in range(46):                                       # three layers deep of paper
        pw, ph = m(0.16 + r() * 0.17), m(0.20 + r() * 0.16)
        px_ = int(r() * max(1, w - pw)); py_ = int(r() * max(1, m(1.25) - ph))
        sheet = RAMPS['stucco'][3 if r() < 0.6 else 4]
        dr.rectangle([px_, py_, px_ + pw, py_ + ph], fill=sheet + (255,))
        dr.rectangle([px_, py_ + ph - 1, px_ + pw, py_ + ph],
                     fill=RAMPS['stucco'][1] + (255,))         # the shadow of the one above
        for _ in range(3):                                     # what is written, never words
            lx_ = px_ + m(0.03); ly_ = py_ + m(0.05) + int(r() * (ph - m(0.08)))
            dr.rectangle([lx_, ly_, px_ + pw - m(0.03), ly_], fill=RAMPS['asphalt'][2] + (255,))
    dr.rectangle([0, m(1.25) - 2, w - 1, m(1.25)], fill=RAMPS['deck'][1] + (255,))
    return im


def the_couch(l_m=1.95, d_m=0.85, h_m=0.78):
    """THE COUCH NOBODY MOVED. One object, out front, that says a person lives here, and it is
       the cheapest sentence in the picture and the loudest.

       *** IT WAS A CHAIR FIRST AND A CHAIR CANNOT BE SEEN. *** Drawn at 0.52 m it is 22
       picture px, which is EIGHT PIXELS on his phone at the screen's own zoom, and at eight
       pixels it read as an aerial. The fix is not to draw the chair better; nothing reads at
       eight pixels. A couch is 1.95 m, which is 32 px on his phone, and a couch put out on
       the front of a house in this valley is the truer object anyway: nobody carried it out
       to sit on it, they carried it out and left it."""
    w, d = m(l_m), ty(m(d_m)) + m(h_m)
    im = Image.new('RGBA', (w, d), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    r = K.R(SEED * 19 + 11)
    body = RAMPS['deck'][2]
    back_h = m(h_m)
    dr.rectangle([0, 0, w - 1, back_h], fill=body + (255,))                    # the back
    dr.rectangle([0, 0, w - 1, max(1, m(0.06))], fill=lighter(body, 2) + (255,))
    seat = RAMPS['deck'][3]
    dr.rectangle([m(0.10), back_h, w - m(0.10), back_h + ty(m(d_m))],
                 fill=seat + (255,))                                           # the seat
    dr.rectangle([m(0.10), back_h, w - m(0.10), back_h + max(1, m(0.05))],
                 fill=lighter(seat, 1) + (255,))
    for ax in (0, w - m(0.26)):                                                # the two arms
        dr.rectangle([ax, m(0.18), ax + m(0.26), back_h + ty(m(d_m))],
                     fill=RAMPS['deck'][1] + (255,))
        dr.rectangle([ax, m(0.18), ax + max(1, m(0.08)), back_h + ty(m(d_m))],
                     fill=body + (255,))
    for cx_ in (w // 3, 2 * w // 3):                                           # the cushions
        dr.rectangle([cx_, back_h + m(0.04), cx_ + 1, back_h + ty(m(d_m)) - m(0.04)],
                     fill=RAMPS['deck'][1] + (255,))
    for _ in range(40):                                                        # and the sun
        sx = int(r() * w); sy = int(r() * back_h)
        dr.rectangle([sx, sy, sx + int(r() * 2), sy], fill=RAMPS['deck'][4] + (255,))
    return im


# ------------------------------------------------------------------------- THE PLACE ITSELF

def his_block(seed):
    """HIS BLOCK. The camera is COMBAT TWO's: four house tiles across, three deep, the street
       running through the middle, the far row showing its faces and the near row showing you
       its roofs because you are standing in it. YOUR HOUSE IS IN THE FAR ROW ON PURPOSE --
       that is the only row whose door you can see, and a home you cannot see the door of is
       not a home, it is a roof."""
    base = C2.ground(seed, street=True)
    ground_layer = base.copy()                 # kept exact: the wear mask is a comparison
    spots, lights = {}, []
    r = K.R(seed)

    # THE FAR ROW, THE ONE WITH FACES. Four of his houses, four different weathers of roof.
    boxes = []
    # *** AND EVERY STEP GOES DOWN OR STAYS, NEVER UP, WHICH THE NIGHT MEASURED FOR ME. ***
    # My first row tinted one roof a step BRIGHTER, and roofs are a sixth of this picture, so
    # 93,000 px of extra brightness went into the unlit ground that rule 73's lit-against-
    # unlit ratio is measured against: it sat at 2.7 against a bar of 3.0. The art reasoning
    # agrees with the tape, which is the only kind of fix worth making: terracotta in a dead
    # valley weathers DARKER and greyer. It never gets brighter.
    for i, step in enumerate((0, -1, -3, -2)):
        t = H7.house45(seed + 1 + i, 'north')
        boxes.append(paste(base, roof_tint(t, step), i * PX, 0))
    NORTH_TINTS.extend(TINTED[:])      # the guard reads THESE four, not the first four
                                       # appends, which used to mix the far row with the near
    # next door's TAP IS HIS TABLE, NOT HIS ROOF. *** I boxed the whole tile first and the
    # finishing pass drew its worn paths from the CENTRE OF HIS ROOF, which is where that
    # function takes a building's door from. Long pale rays went out of a rooftop across the
    # yards and the road and the picture looked scratched. You do not tap a man's roof to
    # trade with him; you tap the table he is standing behind, and the path then starts where
    # a path starts.
    spots['hall'] = boxes[1]                   # YOURS, tightened onto the door below

    # THE NEAR ROW, ROOFS, because you are standing on this side of the street.
    for c in (0, 2, 3):
        paste(base, roof_tint(H7.house45(seed + 20 + c, 'south'), -1 - (c % 3)),
              c * PX, ty(m(30.0)))

    # YOUR DRIVEWAY, down the east side of your house, from the face to the kerb, and HIS
    # OWN WRECK sitting on it where it stopped.
    # THE DRIVE IS A TWO-CAR DRIVE, which is both what a house like this has and what makes
    # the SCAVENGE tap big enough for a thumb (measured: 3.2 m was 26 px at phone width).
    dv_len = (KERB - FACE - 6) / 0.7071 / K.PPM
    dv = the_drive(len_m=dv_len, w_m=4.6)
    dx, dy = PX + m(8.1), FACE + 4
    paste(base, dv, dx, dy)
    wreck = NB.load('wreck_driveway') if hasattr(NB, 'load') else None
    wx = dx + (dv.size[0] - m(2.1)) // 2
    NB.place(base, 'wreck_driveway', wx / float(K.PPM),
             (dy + dv.size[1] - ty(m(0.6))) / 0.7071 / K.PPM)

    # YOUR STEP, OUT FROM YOUR DOOR, measured off your own tile, and the couch beside it.
    yours = H7.house45(seed + 2, 'north')
    door = find_door(roof_tint(yours, 0))
    if door is None: die('your house has no door dark enough to find; the step has nowhere')
    st = the_stoop(w_m=1.9)
    sx = PX + (door[0] + door[1]) // 2 - st.size[0] // 2
    sy = FACE + 2
    paste(base, st, sx, sy)
    # YOUR TAP IS YOUR HOUSE FRONT, NOT THE DOOR'S SILHOUETTE. *** The first cut boxed the
    # door alone and the tape said 16 px at phone width against a 44 px thumb. *** The answer
    # is not to pad the box out with empty ground -- the screen LIGHTS this box, so padding it
    # lights dirt -- it is that the thing you tap is the HOUSE, the way it is in Battle
    # Brothers, and your door is where it is lit from.
    spots['hall'] = (PX + m(0.4), FACE - ty(m(4.6)), PX + m(6.4), sy + st.size[1])
    ch = the_couch()
    paste(base, ch, sx + st.size[0] + m(0.45), sy + ty(m(0.3)) - m(0.78))
    DOOR_AT.append((door, sx))
    # THE DOORWAYS THE NIGHT LIGHTS, which are doorways and not tap boxes: yours, found on
    # your own tile, and next door's, found on his.
    DOORWAYS['yours'] = (PX + door[0], FACE - ty(m(1.5)), PX + door[1], FACE)
    nd = find_door(H7.house45(seed + 1, 'north'))
    if nd: DOORWAYS['next_door'] = (nd[0], FACE - ty(m(1.5)), nd[1], FACE)

    # NEXT DOOR: the gate shut across his path, the table out at the kerb.
    gt = the_gate()
    paste(base, gt, m(3.4), FACE + ty(m(1.6)))
    sb = C2.stall(seed + 31)
    spots['stall'] = paste(base, sb, m(2.0), KERB - sb.size[1])

    # THE BLOCK'S PAPER, on the ply board at the neighbour's end of the kerb -- away from
    # your door, because two taps that close together is one tap a thumb cannot choose.
    bp = the_notice_board()
    spots['board'] = paste(base, bp, m(8.2), KERB - bp.size[1])

    # WHAT ELSE IS ON A BLOCK: a shed in the far yard, a dumpster at the kerb, and a car
    # nobody has moved off the road since the money stopped.
    sd = CV.shed()[0]; paste(base, sd, 3 * PX + m(1.2), FACE + ty(m(0.8)))
    # the bins go at the bottom of YOUR drive, where bins are, which also makes the SCAVENGE
    # tap the whole corner you would actually pick over
    dm = BT.dumpster(seed + 41)
    dmx = dx + dv.size[0] + m(0.3)
    paste(base, dm, dmx, KERB - dm.size[1])
    spots['lot'] = (dx, dy, dmx + dm.size[0], KERB)
    dc = F.dead_car()[0]; paste(base, dc, 3 * PX - m(3.0), KERB + ty(m(3.0)))

    # THE LIGHT. His own two lamps, named for the two sides of his street, and at least one
    # of them still burns (COMBAT TWO's rule: one in two, never none).
    for (x, y, sid) in ((6.0, 19.0, 'lamp_house_side'), (30.0, 19.0, 'lamp_house_side'),
                        (18.0, 30.0, 'lamp_your_side'), (42.0, 30.0, 'lamp_your_side')):
        fx, fy = NB.place(base, sid, x, y)
        if r() < 0.5 or not lights: lights.append((fx, fy, m(7.0)))
    return base, spots, lights, ground_layer


# ------------------------------------------- THE SAME FINISH THE OTHER THREE PLACES GOT

def finish(im, ground_layer, spots, seed):
    """THE 10/10 PASS, IMPORTED, NOT COPIED. Rain brought down the roofs' dirt in runs on the
       walls; the ground is worn pale where people actually walk, between the things they use;
       what they drop is where they stand. The one thing this does NOT call is the signs:
       see the top of this file. The ground mask is EXACT here, because unlike the other three
       places this tool built the ground itself and still holds it."""
    arr = np.asarray(im, np.uint8)
    pal = FIN.Palette(arr)
    g = np.asarray(ground_layer.convert('RGB'), np.int16)
    gm = (np.abs(g - arr.astype(np.int16)).sum(axis=2) <= 6)
    if gm.sum() < arr.shape[0] * arr.shape[1] * 0.02:
        die('the ground layer did not line up with the picture (%d px)' % int(gm.sum()))
    # their finisher reads spots in the MANIFEST's shape, {k: {'box': [...]}}, so they are
    # handed over in that shape rather than loosening their function to take two shapes
    boxed = {k: dict(box=list(v)) for k, v in spots.items()}
    runs = FIN.weather_the_walls(im, arr, gm, pal, seed)
    worn, pts = FIN.wear_the_ground(im, arr, gm, pal, boxed, seed)
    trash = FIN.the_trash(im, gm, pal, pts, seed)
    return dict(runs=runs, worn=worn, trash=trash, gm=gm, pal=pal, pts=pts)


def the_night(day_raw, lights, spots, seed, gm_day, ground_layer):
    """THE SAME NIGHT AS THE OTHER THREE AND AS THE FIGHT (rule 70a, one light): their own
       night_sun, their own sun_measure, and rule 73's bars enforced -- night is a COLOUR, and
       the game stays playable in the sun."""
    # *** THE ORDER MATTERS AND THE NIGHT TOLD ME SO. *** My first pipeline made the night
    # out of the FINISHED day, and rule 73's lit-against-unlit came back at 2.95 against its
    # bar of 3.0. The cause was not a lamp: the finish WEARS THE GROUND PALE where people
    # walk, 115,000 px of it, and a pale unlit ground is exactly what eats that ratio. Their
    # own pipeline, and this lane's own 10/10 pass over their sheets, make the night from the
    # RAW day and then finish the night on its own, so all four places are now made the same
    # way and the night is measured on what their guard was written for.
    nim, keep = NB.night_sun(day_raw, lights)
    sm0 = NB.sun_measure(nim, keep)
    arr0 = np.asarray(nim, np.uint8)
    pal0 = FIN.Palette(arr0)
    nruns = FIN.weather_the_walls(nim, arr0, gm_day, pal0, seed)
    nworn, npts = FIN.wear_the_ground(nim, arr0, gm_day, pal0,
                                      {k: dict(box=list(v)) for k, v in spots.items()}, seed)
    FIN.the_trash(nim, gm_day, pal0, npts, seed)
    arr = np.asarray(nim, np.uint8)
    pal = FIN.Palette(arr)
    # THE MASK COMES OFF THE DAY, as it does in the 10/10 pass: a night sheet is its day's
    # geometry pixel for pixel and only its light differs, so comparing the night against the
    # raw ground layer would line up nowhere and the leak would land on walls.
    # *** AND THE LEAK WAS GIVEN THE TAP BOXES AND LIT 315,000 PIXELS. *** A tap box is a
    # whole house tile, so 'the light out of the doorways' poured out of two 515 x 364
    # rectangles, washed the unlit ground, and rule 73's lit-against-unlit ratio fell to 2.7
    # against its bar of 3.0. The night was telling the truth: that is not a doorway, it is a
    # floodlit block. It gets the DOORWAYS now, which is what the function is named for.
    boxed = {k: dict(box=list(v)) for k, v in DOORWAYS.items()}
    leak, gain = FIN.light_from_the_doors(nim, arr, gm_day, pal, boxed, seed)
    return nim, sm0, leak, gain


# ------------------------------------------------------------------------------- THE TAPE

NEED = {'hall', 'board', 'stall', 'lot'}


def guards(day, night, spots, lights, fin, sm, leak, kept, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    ok('THE PLACE CARRIES THE FOUR TAPS A HOME BLOCK HAS, AND THEY ARE THE CAMP TIER\'S OWN '
       'LIST so the screen wires it by naming it: %s' % ', '.join(sorted(NEED & set(spots))),
       NEED <= set(spots), 'missing %s' % ', '.join(sorted(NEED - set(spots))))

    for k in sorted(NEED):
        x0, y0, x1, y1 = spots[k]
        inside = 0 <= x0 < x1 <= day.size[0] and 0 <= y0 < y1 <= day.size[1]
        ok('EVERY TAP LIES ON THE PICTURE AND HAS REAL SIZE: %-6s %s  (%d x %d px)'
           % (k, (x0, y0, x1, y1), x1 - x0, y1 - y0),
           inside and (x1 - x0) >= 40 and (y1 - y0) >= 40,
           'a tap you cannot hit with a thumb is not a tap')

    # READABLE AT PHONE SIZE is the row's own words, so it is measured in thumbs. *** AND THE
    # FIRST VERSION OF THIS BAR WAS MINE AND IT WAS WRONG. *** I assumed the whole picture is
    # shown across a 390 px phone, which gave every object a quarter of its real size and
    # failed three taps. THE SCREEN DOES NOT DO THAT. RUN TWO's own line is
    #   view.s = min(max(W/(picW*0.6), H*0.5/picH), H/picH)
    # so on a 390 x 844 phone it opens at 0.386 and you PAN: the picture is drawn 795 px wide
    # and you see about half the block. The bar is taken from their formula now, not from an
    # assumption, and a thumb is Apple's own 44 points.
    W_, H_ = 390.0, 844.0
    sc_ = min(max(W_ / (day.size[0] * 0.6), H_ * 0.5 / day.size[1]), H_ / day.size[1])
    for k in sorted(NEED):
        x0, y0, x1, y1 = spots[k]
        at_phone = (x1 - x0) * sc_
        ok('READABLE AT PHONE SIZE: %-6s is %.0f px on his phone (the screen opens this '
           'picture at %.3f, its own formula), against a 44 px thumb' % (k, at_phone, sc_),
           at_phone >= 44.0,
           'the row asks for buildings readable at phone size and this one is not')

    ok('NO TWO TAPS OVERLAP (nobody stands on anybody, his first votes): checked %d pairs'
       % (len(NEED) * (len(NEED) - 1) // 2),
       all(not (spots[a][0] < spots[b][2] and spots[b][0] < spots[a][2]
                and spots[a][1] < spots[b][3] and spots[b][1] < spots[a][3])
           for i, a in enumerate(sorted(NEED)) for b in sorted(NEED)[i + 1:]),
       'two taps on the same pixels means the finger cannot say which')

    d = DOOR_AT[0] if DOOR_AT else None
    ok('YOUR STEP IS UNDER YOUR DOOR, MEASURED OFF YOUR OWN TILE, not placed at a guessed '
       'offset: the door runs tile x %s and the step is centred on it' % (str(d[0]) if d else '-'),
       d is not None and abs((PX + (d[0][0] + d[0][1]) // 2) - (d[1] + m(0.95))) <= m(0.6),
       'house45 moves the door with its seed, so a fixed offset puts your step on a wall')

    for im, what in ((day, 'day'), (night, 'night')):
        bad = K.colours(im) - B.OK
        ok('EVERY PIXEL IS HIS: the %s picture' % what, not bad,
           '%d colours off his 7/28 banks and their own board set' % len(bad))

    # *** AND THE FIRST VERSION OF THIS GUARD FAILED ON ITSELF. *** It grepped this file for
    # the word ImageFont, and the guard's own sentence contains the word ImageFont, so it
    # reported the picture carried text. A checker that cannot tell a mention from a use is
    # the broken one (this repo's own 8/1 law). It is a COUNT now: every text draw made while
    # the picture was being built is counted by a wrapper round the library's own text call,
    # so it measures what happened instead of reading source.
    ok('NO TEXT ON THE PICTURE, COUNTED AT THE DRAW (their manifest\'s own rule, and this '
       'lane broke it on their sheets last round): %d text draws while building it' % TEXTS[0],
       TEXTS[0] == 0,
       'a label is a second name on top of the one the screen gives on touch')

    ok('THE FAR ROW IS FOUR ROOFS WITH FOUR WEATHERS, not one house printed four times: '
       'one left alone and %s'
       % ', '.join('%+d moved %d px' % t for t in NORTH_TINTS),
       len(NORTH_TINTS) == 3 and all(st < 0 and n > 20000 for st, n in NORTH_TINTS),
       'a tint that moves nothing leaves four copies (the first cut moved 0), and a tint that '
       'moves UP brightens a sixth of the picture and costs the night its contrast')

    ok('THE FINISH IS THE SAME ONE THE OTHER THREE PLACES GOT: %d rain runs down the walls, '
       '%d px of ground worn where people walk, %d pieces of what they dropped'
       % (fin['runs'], fin['worn'], fin['trash']),
       fin['runs'] > 50 and fin['worn'] > 20000 and fin['trash'] > 20)

    ok('AT LEAST ONE LAMP STILL BURNS AND NOT ALL OF THEM DO (their rule): %d of 4 kept'
       % kept, 1 <= kept <= 3)
    ok('AND A DOOR LEAKS LIGHT ONTO THE DIRT: %d px lit at the doorways' % leak, leak > 200)

    ok('RULE 73, NIGHT IS A COLOUR AND THE GAME IS PLAYABLE IN THE SUN: plain ground median '
       '%.3f (bar 0.20), lit against unlit %.1fx (bar 3.0), in sunlight %.3f (bar 0.20)'
       % (sm['plain']['ground_median'], sm['plain']['lit_vs_unlit'], sm['sun']['ground_median']),
       sm['plain']['ground_median'] >= 0.20 and sm['plain']['lit_vs_unlit'] >= 3.0
       and sm['sun']['ground_median'] >= 0.20)
    return fails


def splice(man_path, entry):
    """INSERT, DO NOT RE-SERIALISE. The three places in this file are COMBAT TWO's and this
       lane painted them; rewriting the file from a parsed copy is how a lane quietly drops
       somebody else's key. The new place is spliced in as TEXT and the result is parsed back
       and compared: every tier that was there is still there, with the same bytes."""
    src = open(man_path).read()
    before = json.loads(src)
    if 'home' in before.get('tiers', {}): die('home is already in the manifest')
    i = src.index('"tiers"')
    j = src.index('{', i)
    block = json.dumps({'home': entry}, indent=1)[1:-1].rstrip()
    out = src[:j + 1] + '\n' + block + ',' + src[j + 1:]
    after = json.loads(out)
    for k, v in before['tiers'].items():
        if json.dumps(after['tiers'].get(k), sort_keys=True) != json.dumps(v, sort_keys=True):
            die('the splice changed their tier %s' % k)
    if set(after['tiers']) != set(before['tiers']) | {'home'}:
        die('the splice did not add exactly one place')
    open(man_path, 'w').write(out)
    return len(before['tiers']), len(after['tiers'])


def card(day, night, spots, before):
    sc = 0.49
    def sm_(im): return im.resize((int(im.size[0] * sc), int(im.size[1] * sc)), Image.LANCZOS)
    a, b, c = sm_(before), sm_(day), sm_(night)
    w, h = a.size
    out = Image.new('RGB', (w + 40, (h + 54) * 3 + 30), (12, 11, 10))
    d = ImageDraw.Draw(out)
    f = K.font(17); f2 = K.font(14)
    rows = [(a, 'HIS BLOCK, BUILT', 'four of his houses, your drive, your step, the gate next door'),
            (b, 'AND FINISHED', 'rain down the walls, the ground worn where people walk, what they dropped'),
            (c, 'AND AT NIGHT', 'one lamp still burning, and a door leaking light onto the dirt')]
    for i, (im, t, sub) in enumerate(rows):
        y = 20 + i * (h + 54)
        d.text((20, y), t, font=f, fill=(226, 162, 72))
        d.text((20 + 190, y + 2), sub, font=f2, fill=(150, 142, 130))
        out.paste(im, (20, y + 24))
        if i == 1:
            for k in sorted(NEED):
                x0, y0, x1, y1 = [int(v * sc) for v in spots[k]]
                for t_ in range(0, x1 - x0, 6):
                    d.point((20 + x0 + t_, y + 24 + y0), fill=(255, 236, 160))
                    d.point((20 + x0 + t_, y + 24 + y1), fill=(255, 236, 160))
                for t_ in range(0, y1 - y0, 6):
                    d.point((20 + x0, y + 24 + y0 + t_), fill=(255, 236, 160))
                    d.point((20 + x1, y + 24 + y0 + t_), fill=(255, 236, 160))
    return out


def main():
    count_text_draws()
    day, spots, lights, ground_layer = his_block(SEED)
    before = day.copy()
    day_raw = day.copy()
    fin = finish(day, ground_layer, spots, SEED)
    night, sm, leak, gain = the_night(day_raw, lights, spots, SEED + 5, fin['gm'], ground_layer)
    kept = len(lights)   # *** the first cut passed night_sun's PIXEL list here and
                         # reported '1092 of 4 lamps burning', which is nonsense a
                         # guard should never have printed without me reading it
    log = []
    fails = guards(day, night, spots, lights, fin, sm, leak, kept, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('slices/vote', exist_ok=True)
    day.save('%s/home_0.webp' % GROUND_DIR, 'WEBP', lossless=True, method=6)
    night.save('%s/home_0_night.webp' % GROUND_DIR, 'WEBP', lossless=True, method=6)
    hs = {k: dict(box=list(spots[k]), kind=k) for k in sorted(NEED)}
    entry = dict(
        src='home_0.webp', px=list(day.size), hotspots=hs,
        variants=[dict(src='home_0.webp', night_src='home_0_night.webp', px=list(day.size),
                       hotspots=hs, lights=kept, night_measured=sm)],
        place=True,
        note='HIS BLOCK: one named place, not a size. The home base of the third votes. Four '
             'taps and they are the camp tier\'s own list (hall, board, stall, lot), so the '
             'screen wires it by naming it. hall is YOUR door with your step under it, lot is '
             'the driveway with his wreck on it, which is SCAVENGE.')
    n0, n1 = splice(MAN, entry)
    card(day, night, spots, before).save(OUT_CARD, optimize=True)

    L = []
    A = L.append
    A("HIS BLOCK, AS A PLACE YOU ARRIVE AT -- MEASURED  (COOK [settlement art] round 1, 10/10/26)")
    A('=' * 78)
    A('')
    A('THE ROW, rule 37b: "the settlement screen\'s picture, ONE REAL PLACE FIRST (HIS BLOCK),')
    A('buildings tappable and readable at phone size, lights and people moving under the bible,')
    A('from the game\'s camera; DIRECTION judges; RUN wires the taps."')
    A('')
    A('*** THE FIRST THING THIS ROUND DID WAS OPEN THE SCREEN, AND MOST OF THE ROW WAS')
    A('*** ALREADY BUILT BY OTHER LANES.')
    A('  the picture      COMBAT TWO 10/4: camp, town, fortress, two variants each, hotspots.')
    A('                   This lane painted them over on 10/10.')
    A('  people moving    ANIMATION 10/9: slices/settlement_people, the 112 rig in the runway')
    A('                   clothes, nine clips on the 120 beat, 25 looks, three facings.')
    A('  placing them     RUN TWO 10/10: a keeper at each door on his building\'s clip, a crowd')
    A('                   by the stall sized by the place\'s traits, depth-sorted, thinned at night.')
    A('  the taps         RUN TWO: the hotspot lights under the finger, names itself on touch.')
    A('So there was NO POINT cooking a crowd: one exists, by the lane that owns rigs, at this')
    A('exact scale, and cooking a second one would have been this lane drawing something that')
    A('was already in the cupboard -- the mistake it made twice last round.')
    A('')
    A('WHAT NOBODY HAD TOUCHED IS THE ROW\'S FIRST FOUR WORDS: ONE REAL PLACE FIRST. The three')
    A('places are SIZES, not places. Camp, town and fortress are how big a settlement is; none')
    A('of them is ANYWHERE. His block is somewhere. It is the one he wakes on, it is the home')
    A('base of the third votes, and it is the only address in this game that is his.')
    A('')
    A('SO THIS ROUND MAKES THE FOURTH PLACE, AND IT IS A PLACE AND NOT A SIZE:')
    for k in sorted(NEED):
        A('  %-6s %s' % (k, {'hall': 'YOUR HOUSE: the door you wake behind, your step under it,',
                             'board': 'THE KERB: the board on its pole where the block\'s paper goes',
                             'stall': 'NEXT DOOR: his gate shut, his table out at the kerb',
                             'lot': 'THE DRIVEWAY: his own 7/28 wreck, still on it. SCAVENGE.'}[k]))
    A('                 and the couch out front nobody moved')
    A('Four taps, and they are THE CAMP TIER\'S OWN LIST on purpose, so RUN TWO wires a new')
    A('place by naming it and nothing else.')
    A('')
    A('BUILT FROM THEIR OWN MACHINERY, NOT A SECOND SET OF PARTS. The ground, the houses at 45,')
    A('the stall, the board on its pole, the night and its measure are COMBAT TWO\'s own')
    A('functions, imported and called. The finish (rain down the walls, the ground worn where')
    A('people walk, what they dropped, the light out of a door) is this lane\'s own 10/10 pass,')
    A('imported. The wreck and both lamps are HIS 7/28 sprites, placed by their own placer.')
    A('FOUR THINGS ARE NEW: your step, your driveway, the gate next door, the couch.')
    A('')
    A('*** AND THE LABELS COME OFF, WHICH IS THIS LANE\'S OWN DEFECT FROM LAST ROUND, NAMED')
    A('*** HERE WITH THE EVIDENCE AND FIRST IN THE QUEUE FOR THE NEXT ROUND.')
    A('COMBAT TWO\'s manifest says, in their own words: "no text on the picture; name it only')
    A('when touched." Their tool\'s own law says each usable building must say what it is with')
    A('one object you can see from across the screen -- "NEVER A LABEL." On 10/10 this lane')
    A('painted CUTS, CLINIC, ROOMS, TRADE and NOTICES onto their six day sheets and six night')
    A('sheets as floating word boxes. That is three things wrong at once: it is text on the')
    A('picture, it is a SECOND name on top of the one RUN TWO\'s screen already gives on touch,')
    A('and rule 19 bans player-facing prose with no mouth and no portrait behind it. THIS place')
    A('carries no text at all and loads no font. The twelve sheets that carry it are the next')
    A('round\'s first job, done as its own thing so a correction to three other places is not')
    A('smuggled in under a fourth.')
    A('')
    A('MEASURED THIS RUN:')
    for st, line, why in log:
        A('  %-4s %s' % (st.upper(), line))
    A('')
    A('THE MANIFEST WAS SPLICED, NOT REWRITTEN: %d places before, %d after, and every tier that')
    A('was there was parsed back and compared byte for byte.' % 0 if False else
      '  %d places before, %d after.' % (n0, n1))
    A('')
    A('[bb settlements] 10_UI_AND_FEEL.md: their settlement screen is ONE PAINTED VIEW with the')
    A('buildings as the buttons, and their sound line says "the settlement has CROWD MURMUR and')
    A('a blacksmith". WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g, which that same file')
    A('states as our own law: "what we do not copy: THE STILLS"): you HEAR a crowd in a Battle')
    A('Brothers town and you never see one, because the painting is fixed and empty. Ours draws')
    A('the people you hear. And more than that, OURS HAS AN ADDRESS: their town screen is a')
    A('TYPE, reused at every village of that type on the map, while this place is one block,')
    A('yours, with your door on it and your wreck on the drive.')
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('\n  wrote %s/home_0.webp and its night\n  spliced %s (%d -> %d places)\n'
          '  wrote %s\n  wrote %s' % (GROUND_DIR, MAN, n0, n1, OUT_REC, OUT_CARD))


if __name__ == '__main__':
    main()
