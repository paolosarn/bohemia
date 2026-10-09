#!/usr/bin/env python3
"""THE FREEWAY KIT  (COOK [the board props] round 1, 10/10/26)

Rule 77a, the coordinator's 10/9 line on this row: the FREEWAY KIT FIRST -- a Jersey barrier
run, a chain-link shoulder fence, a freeway lamp, a sign gantry, a stalled truck with its
trailer, a burned car -- at the house-tile scale, with typed edges, in the street kit's own
asphalt and paint. COMBAT TWO places them.

*** THE FIRST THING THIS ROUND DID WAS OPEN ITS OWN CUPBOARD, AND FOUR OF THE SIX WERE
ALREADY IN IT. *** REUSE-FIRST is a law, not a preference, and the 9/30 block war kit this
lane built already holds a Jersey barrier (3.0 m, 0.81 high), a chain-link run (6.0 m, 1.83
high) and a trailer (9.0 x 3.0, 2.80 high), all at the same 42.9 px a metre; his own 7/28
approved bank holds the wreck. So this round draws THREE new things, not six:

  REUSED   the barrier, laid as a RUN of four across a house tile, ends keyed so runs join
  REUSED   the chain-link, doubled into a 12 m shoulder fence
  REUSED   the trailer, with a NEW tractor unit in front of it
  REUSED   his approved wreck_road, BURNED (the paint gone, the glass gone, the shell)
  NEW      the freeway lamp: a 9 m mast with a cantilever head out over the carriageway
  NEW      the sign gantry: a truss on two legs spanning the lanes, its panels draft

AND THE EDGES ARE TYPED, WHICH IS THE POINT OF RULE 77. Paolo 10/5: "the tiles aren't
speaking to each other... these things should conjoin easily like Legos." A barrier run that
cannot be laid end to end is six barriers, not a run. So every piece declares what runs out
of each of its four sides, and the gate LAYS TWO OF EACH END TO END AND MEASURES THE SEAM
against the inside of the piece, because a declared edge that does not actually meet is a
label, not a joint.

COVER OR BLOCKER IS MEASURED, NOT FILED BY EYE (this lane's own 9/30 rule, and it corrected
me twice that round): a man's chest is 1.30 m, over it stops a shot and under it does not.
The barrier run is 0.81 and is COVER. The fence is 1.83 and is a BLOCKER you can see
through, which is its whole use on a board. The truck is 2.80 and stops everything.

*** AND ONE THING THIS KIT DOES THAT THE 9/30 KIT GOT WRONG. *** On 10/1 this lane filed its
own correction: the block war kit was drawn flat, straight on, while COMBAT TWO's board is
cut for a camera pitched forty-five degrees. A piece drawn at the wrong camera is a sticker.
Every piece here carries its FOOTPRINT (what it covers on the ground, flat) separately from
its FACE (what you see of its height), so COMBAT TWO can place it on a pitched board without
squashing a finished picture, which would resample every one of his pixels.

    python3 tools/bohemia_the_freeway_kit_cook_10_10_26.py
      -> banks/BOHEMIA_THE_FREEWAY_KIT_10_10_26.txt
      -> records/BOHEMIA_THE_FREEWAY_KIT_MEASURED_10_10_26.txt
      -> slices/vote/COOK_THE_FREEWAY_KIT.png

REFERENCE CHECK (the 9/4 standing law):
  02_COMBAT_RULES.md, the BOARD line: BB keeps a short blocker vocabulary per terrain on
        purpose, because a board reads when its vocabulary is short. Six pieces, no more.
  CGRD-01 INTO THE BREACH: a piece has one job and must say which from across the screen.
  TG-04 THE STREET TILE: the asphalt, the lane paint and the kerb are his, unchanged.
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east.
  REUSE CHECK: four of the six pieces are loaded FROM THIS LANE'S OWN 9/30 BANK and his
        7/28 approved bank at run time, not redrawn; the ramps and the tiles are his.

[bb the overworld is battle brothers] reference/library/battle_brothers/02_COMBAT_RULES.md,
  the TERRAIN and BOARD lines: BB scatters three to six blocker kinds per terrain with
  placement rules, and height is the one bonus. Taken: six pieces, each with its height
  named in metres so the board can rule on it. WHAT MOVES THAT THEIR PICTURE DOES NOT
  (rule 33g): BB's blockers are nature's -- trees, rocks -- and they are the same every
  fight. Every piece here is something people built for a road that no longer carries
  anyone, and the run of barriers is as long as the fight needs because its ends key.
"""
import base64, io, json, math, os, sys
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

STREET = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
KIT930 = 'banks/BOHEMIA_THE_BLOCK_WAR_KIT_9_30_26.txt'
OUT_BANK = 'banks/BOHEMIA_THE_FREEWAY_KIT_10_10_26.txt'
OUT_REC = 'records/BOHEMIA_THE_FREEWAY_KIT_MEASURED_10_10_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_FREEWAY_KIT.png'

PPM = 42.9
TILE_M = 12.0
CHEST = 1.3

def die(m): sys.exit('REFUSED: ' + m)

rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
def load(rec): return Image.open(io.BytesIO(base64.b64decode(rec['b64'])))

_S = json.load(open(STREET))
RAMPS = {k: [rgb(h) for h in v] for k, v in _S['method']['one_palette_per_family'].items()}
TILES = {t['id']: t for t in _S['tiles']}
SPR = {s['id']: s for s in _S['sprites']}
SRC = _S['cell_px']
# his ramps AND his tiles: a check against the bare ramps alone is stricter than his approved
# art, and this lane has written that guard too tight three times
ALL = {c for r in RAMPS.values() for c in r}
for _t in _S['tiles']:
    ALL |= {p[:3] for p in load(_t).convert('RGB').getdata()}
for _s in _S['sprites']:
    ALL |= {p[:3] for p in load(_s).convert('RGBA').getdata() if p[3] > 127}

_K = json.load(open(KIT930))
KIT = {p['name']: p for p in _K['pieces']}
for _p in _K['pieces']:
    ALL |= {q[:3] for q in load(_p).convert('RGBA').getdata() if q[3] > 127}


class R:
    def __init__(self, s): self.s = s & 0x7fffffff
    def __call__(self):
        self.s = (1103515245 * self.s + 12345) & 0x7fffffff
        return self.s / float(0x7fffffff)
    def i(self, n): return int(self() * n) % n


def m(metres): return max(1, int(round(metres * PPM)))


def fam_of(c):
    best, who = 1 << 30, 'ground'
    for f, ramp in RAMPS.items():
        for e in ramp:
            d = abs(e[0]-c[0]) + abs(e[1]-c[1]) + abs(e[2]-c[2])
            if d < best: best, who = d, f
    return who


_FAM = {}
def fam(c):
    if c not in _FAM: _FAM[c] = fam_of(c)
    return _FAM[c]


def shade(im, box, mult):
    """A shadow darkens WITHIN ITS OWN FAMILY, and never lightens when it is darkening --
       this lane has written both of those wrong before."""
    x0, y0, x1, y1 = [int(v) for v in box]
    p = im.load()
    byf = {k: sorted(v, key=LUM) for k, v in RAMPS.items()}
    memo = {}
    for y in range(max(0, y0), min(im.size[1], y1)):
        for x in range(max(0, x0), min(im.size[0], x1)):
            c = p[x, y][:3]
            if len(p[x, y]) == 4 and p[x, y][3] < 128: continue
            if c not in memo:
                ramp = byf[fam(c)]
                here = [e for e in ramp if LUM(e) <= LUM(c) + 0.5] if mult < 1.0 else \
                       [e for e in ramp if LUM(e) >= LUM(c) - 0.5]
                here = here or ramp
                v = LUM(c) * mult
                memo[c] = min(here, key=lambda e: abs(LUM(e) - v))
            p[x, y] = memo[c] + ((p[x, y][3],) if len(p[x, y]) == 4 else ())
    return im


def lighter(c, steps=1):
    ramp = sorted(RAMPS[fam(tuple(c))], key=LUM)
    i = min(range(len(ramp)), key=lambda k: abs(LUM(ramp[k]) - LUM(c)))
    return ramp[min(len(ramp) - 1, i + steps)]


def roll(im, dx, dy):
    if not dx and not dy: return im
    out = Image.new('RGB', im.size)
    for ox in (dx, dx - im.size[0]):
        for oy in (dy, dy - im.size[1]):
            out.paste(im, (ox, oy))
    return out


def cells(ids, w, h, seed, rot=False):
    ts = []
    for i in ids:
        t = load(TILES[i]).convert('RGB')
        ts.append(t.transpose(Image.ROTATE_90) if rot else t)
    im = Image.new('RGB', (max(1, w), max(1, h)))
    for yy in range(0, h, SRC):
        for xx in range(0, w, SRC):
            cx, cy = xx // SRC, yy // SRC
            k = ts[(cx * 7 + cy * 13 + seed) % len(ts)]
            im.paste(roll(k, (cx * 11 + seed) % SRC, (cy * 23 + seed * 3) % SRC), (xx, yy))
    return im


# --------------------------------------------------------- THE FOUR THIS LANE ALREADY HAD

def from_kit(name):
    p = KIT[name]
    return load(p).convert('RGBA'), p


def barrier_run(seed=1):
    """REUSED: the 9/30 Jersey barrier, laid as a RUN of four across a house tile. A run is
       the point -- one barrier is a prop, four end to end is a lane you cannot cross -- and
       the ENDS ARE KEYED so two runs laid together carry on instead of showing a joint."""
    unit, meta = from_kit('JERSEY BARRIER')
    n = int(round(TILE_M / meta['l']))
    w = unit.size[0] * n
    im = Image.new('RGBA', (w, unit.size[1] + m(0.35)), (0, 0, 0, 0))
    for i in range(n):
        u = unit if i % 2 == 0 else unit.transpose(Image.FLIP_LEFT_RIGHT)
        im.paste(u, (i * unit.size[0], 0), u)
    shade(im, (m(0.30), unit.size[1] - m(0.10), w + m(0.30), unit.size[1] + m(0.30)), 0.70)
    return im, dict(name='JERSEY BARRIER RUN', w=meta['l'] * n, l=meta['w'], h=meta['h'],
                    kind='COVER', reused='9/30 JERSEY BARRIER x%d' % n,
                    edges=dict(N='asphalt', E='barrier', S='asphalt', W='barrier'))


def shoulder_fence(seed=2):
    """REUSED: the 9/30 chain-link run, doubled into a 12 m shoulder fence. It is a BLOCKER
       at 1.83 m and you can SEE THROUGH IT, which is the only reason to put one on a board:
       you know what is coming and you still cannot get to it."""
    unit, meta = from_kit('CHAIN-LINK RUN')
    n = int(round(TILE_M / meta['l']))
    w = unit.size[0] * n
    im = Image.new('RGBA', (w, unit.size[1] + m(0.3)), (0, 0, 0, 0))
    for i in range(n):
        im.paste(unit, (i * unit.size[0], 0), unit)
    shade(im, (m(0.25), unit.size[1] - m(0.06), w + m(0.25), unit.size[1] + m(0.24)), 0.74)
    return im, dict(name='CHAIN-LINK SHOULDER FENCE', w=meta['l'] * n, l=meta['w'],
                    h=meta['h'], kind='BLOCKER', see_through=True,
                    reused='9/30 CHAIN-LINK RUN x%d' % n,
                    edges=dict(N='shoulder', E='fence', S='asphalt', W='fence'))


def stalled_truck(seed=3):
    """REUSED: the 9/30 trailer, with a NEW tractor unit in front of it. A trailer alone is a
       box; a truck is a thing that stopped, and the cab is what says so."""
    tr, meta = from_kit('TRAILER')
    cab_l, cab_w, cab_h = 6.0, 2.5, 3.2
    cw, ch = m(cab_l), m(cab_w)
    im = Image.new('RGBA', (tr.size[0] + cw + m(0.9), max(tr.size[1], ch) + m(0.5)),
                   (0, 0, 0, 0))
    # *** AND THE FIRST CUT READ AS ONE LONG TAN BOX. *** The cab was dressed in the same
    # wall cells as the trailer, so fifteen metres of identical tan came out as a shipping
    # container, not a truck. A tractor unit is PAINTED METAL, not a wall: it goes on the
    # asphalt ramp, it is shorter than it is tall from above, and the things that say truck
    # are the windscreen across its nose, the exhaust stacks either side of it, and the GAP
    # at the fifth wheel where the cab ends and the trailer begins.
    d = ImageDraw.Draw(im)
    oy = (im.size[1] - m(0.5) - ch) // 2
    d.rectangle([0, oy, cw, oy + ch], fill=RAMPS['asphalt'][3] + (255,))
    d.rectangle([0, oy, cw, oy + max(2, m(0.14))], fill=lighter(RAMPS['asphalt'][3], 2) + (255,))
    for k in range(5):                                   # the body's panel lines
        xx = m(0.7) + k * m(1.0)
        if xx < cw: d.line([(xx, oy + m(0.1)), (xx, oy + ch - m(0.1))],
                           fill=RAMPS['asphalt'][1] + (255,))
    glass = RAMPS['asphalt'][0] + (255,)
    d.rectangle([cw - m(1.35), oy + m(0.30), cw - m(0.28), oy + ch - m(0.30)], fill=glass)
    d.rectangle([cw - m(1.35), oy + m(0.30), cw - m(1.20), oy + ch - m(0.30)],
                fill=lighter(RAMPS['asphalt'][0], 2) + (255,))     # the glass catching the sky
    for sy in (oy + m(0.18), oy + ch - m(0.30)):         # the stacks, either side of the nose
        d.rectangle([cw - m(2.1), sy, cw - m(1.8), sy + m(0.12)],
                    fill=lighter(RAMPS['concrete'][2], 1) + (255,))
    for k in range(3):                                   # wheels
        d.rectangle([m(0.5) + k * m(2.0), oy + ch - m(0.16), m(1.4) + k * m(2.0),
                     oy + ch + m(0.14)], fill=RAMPS['asphalt'][1] + (255,))
        d.rectangle([m(0.5) + k * m(2.0), oy - m(0.14), m(1.4) + k * m(2.0),
                     oy + m(0.16)], fill=RAMPS['asphalt'][1] + (255,))
    shade(im, (0, oy + ch * 2 // 3, cw, oy + ch), 0.84)
    GAP = m(0.9)                                         # the fifth wheel, so it reads as two
    im.paste(tr, (cw + GAP, (im.size[1] - m(0.5) - tr.size[1]) // 2), tr)
    shade(im, (cw, oy, cw + GAP, oy + ch), 0.72)
    shade(im, (m(0.3), im.size[1] - m(0.5), im.size[0] + m(0.3), im.size[1]), 0.70)
    return im, dict(name='STALLED TRUCK AND TRAILER', w=meta['l'] + cab_l + 0.9, l=meta['w'],
                    h=meta['h'], kind='BLOCKER',
                    reused='9/30 TRAILER + a new tractor unit',
                    edges=dict(N='asphalt', E='asphalt', S='asphalt', W='asphalt'))


def burned_car(seed=4):
    """REUSED: HIS approved wreck_road, burned. The paint is gone, the glass is gone, what is
       left is the shell, and it is still the shape he approved -- nothing is redrawn, the
       colours are walked down their own ramps until only the metal is left."""
    car = load(SPR['wreck_road']).convert('RGBA')
    im = Image.new('RGBA', (car.size[0], car.size[1] + m(0.4)), (0, 0, 0, 0))
    im.paste(car, (0, 0), car)
    shade(im, (0, 0, car.size[0], car.size[1]), 0.52)        # the burn, within each family
    p = im.load(); r = R(seed)
    for y in range(car.size[1]):
        for x in range(car.size[0]):
            if p[x, y][3] < 128: continue
            if r() < 0.10:                                   # the soot, patchy
                p[x, y] = tuple(RAMPS['asphalt'][0]) + (255,)
            elif r() < 0.05:                                 # and what the fire polished
                p[x, y] = lighter(p[x, y][:3], 1) + (255,)
    shade(im, (m(0.3), car.size[1] - m(0.1), car.size[0] + m(0.3), car.size[1] + m(0.3)), 0.68)
    return im, dict(name='BURNED CAR', w=round(SPR['wreck_road']['w'] * SRC / PPM, 2),
                    l=round(SPR['wreck_road']['h'] * SRC / PPM, 2), h=1.45, kind='BLOCKER',
                    cover_h=1.10, reused="his own 7/28 wreck_road, burned, not redrawn",
                    edges=dict(N='asphalt', E='asphalt', S='asphalt', W='asphalt'))


# ------------------------------------------------------------- THE TWO THAT ARE GENUINELY NEW

def freeway_lamp(seed=5):
    """NEW. A street lamp is 3 m on a pole; a FREEWAY lamp is a 9 m mast with a cantilever
       arm that reaches out over the carriageway, which is why the light lands in the lane
       and not on the shoulder. Built off his own approved lamp sprite so the head and the
       colour are his; only the mast and the arm are drawn."""
    base = load(SPR['lamp_your_side']).convert('RGBA')
    mast_h, arm = 9.0, 3.0
    W, H = m(arm + 0.8), m(mast_h) + m(0.5)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    col = RAMPS['concrete'][2] + (255,)
    lit = lighter(RAMPS['concrete'][2], 2) + (255,)
    tw = max(2, m(0.18))
    x0 = m(0.3)
    d.rectangle([x0, m(0.5), x0 + tw, H - m(0.5)], fill=col)
    d.rectangle([x0, m(0.5), x0 + max(1, tw // 3), H - m(0.5)], fill=lit)   # sun north-west
    d.rectangle([x0 - m(0.25), H - m(0.5), x0 + tw + m(0.25), H - m(0.2)],
                fill=RAMPS['concrete'][1] + (255,))                          # the base plate
    ay = m(0.5)
    for k in range(m(arm)):                                   # the arm, curving over
        t = k / float(max(1, m(arm)))
        yy = ay + int(m(0.7) * (1 - math.cos(t * 1.5)))
        d.rectangle([x0 + tw + k, yy, x0 + tw + k + 1, yy + max(2, tw - 1)], fill=col)
    # *** AND THE HEAD WAS A BLOB. *** The first cut cropped the top third of his street lamp
    # and hung it on the arm, and from above it read as a bird on a wire. A freeway luminaire
    # is a cobra head: a flat elongated box lying along the arm, lit on its top where the sun
    # catches it, with a pale lens on the underside, which is the bit that says lamp.
    hx = x0 + tw + m(arm) - m(0.45)
    hy = ay + m(0.55)
    hw, hh = m(1.5), m(0.55)
    d.rectangle([hx - hw, hy, hx + m(0.2), hy + hh], fill=RAMPS['concrete'][2] + (255,))
    d.rectangle([hx - hw, hy, hx + m(0.2), hy + max(1, hh // 3)],
                fill=lighter(RAMPS['concrete'][2], 2) + (255,))
    lens = lighter(RAMPS['concrete'][3], 3) + (255,)
    d.rectangle([hx - hw + m(0.12), hy + hh - max(2, hh // 3), hx - m(0.05), hy + hh],
                fill=lens)
    shade(im, (hx - hw, hy + hh, hx + m(0.2), hy + hh + m(0.12)), 0.70)
    shade(im, (x0 - m(0.2), H - m(0.3), x0 + tw + m(1.2), H), 0.70)
    return im, dict(name='FREEWAY LAMP', w=round(arm + 0.8, 2), l=0.4, h=mast_h,
                    kind='DRESSING', reused="his 7/28 lamp head; the mast and arm are new",
                    edges=dict(N='air', E='air', S='asphalt', W='air'))


def sign_gantry(seed=6):
    """NEW. A truss on two legs spanning the lanes. THE PANELS SHIP AS AN ATTEMPT TAGGED
       draft (the 8/11 amendment: tables ship empty, but player-facing words ship as a real
       attempt marked draft) -- what a sign in this valley actually says is his."""
    span, legh = 12.0, 6.5
    W, H = m(span), m(legh) + m(0.6)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    steel = RAMPS['concrete'][2] + (255,)
    lit = lighter(RAMPS['concrete'][2], 2) + (255,)
    ty = m(0.6); th = max(3, m(0.55))
    d.rectangle([0, ty, W, ty + th], fill=steel)
    d.rectangle([0, ty, W, ty + max(1, th // 3)], fill=lit)
    for x in range(0, W, m(0.9)):                              # the truss zigzag
        d.line([(x, ty + th), (min(W - 1, x + m(0.45)), ty)], fill=lit, width=1)
        d.line([(min(W - 1, x + m(0.45)), ty), (min(W - 1, x + m(0.9)), ty + th)],
               fill=lit, width=1)
    lw = max(2, m(0.22))
    for lx in (m(0.5), W - m(0.5) - lw):
        d.rectangle([lx, ty, lx + lw, H - m(0.4)], fill=steel)
        d.rectangle([lx, ty, lx + max(1, lw // 3), H - m(0.4)], fill=lit)
        d.rectangle([lx - m(0.25), H - m(0.4), lx + lw + m(0.25), H - m(0.15)],
                    fill=RAMPS['concrete'][1] + (255,))
    face = RAMPS['deck'][1] + (255,) if 'deck' in RAMPS else RAMPS['concrete'][1] + (255,)
    ink = lighter(RAMPS['concrete'][3], 2) + (255,)
    try:
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 13)
    except Exception:
        f = ImageFont.load_default()
    panels = [('NORTH  I-15', m(1.2)), ('DOWNTOWN', m(6.6))]
    for word, px_ in panels:
        pw, ph = m(4.0), m(1.35)
        d.rectangle([px_, ty + th, px_ + pw, ty + th + ph], fill=face, outline=steel)
        mk = Image.new('L', (pw, ph), 0)
        ImageDraw.Draw(mk).text((8, 5), word, font=f, fill=255)
        mk = mk.point(lambda a: 255 if a > 110 else 0)       # hard pixels, no antialiasing
        im.paste(Image.new('RGB', (pw, ph), ink[:3]), (px_, ty + th), mk)
        shade(im, (px_, ty + th + ph - m(0.2), px_ + pw, ty + th + ph), 0.82)
    shade(im, (m(0.3), H - m(0.3), W + m(0.3), H), 0.70)
    return im, dict(name='SIGN GANTRY', w=span, l=0.6, h=legh, kind='DRESSING', draft=True,
                    draft_text=[p[0] for p in panels],
                    reused='the street kit\'s own steel and paint; the truss is new',
                    # *** AND THESE EDGES WERE A WRONG LABEL, CAUGHT BY THE JOINT TEST. ***
                    # I typed E and W 'gantry', which claims a gantry RUNS end to end, and
                    # the measurement said the joint was twelve times the inside. It was
                    # right and the label was wrong: a sign gantry is ONE SPAN over the
                    # lanes, not a run. Its legs stand on the shoulders and nothing keys to
                    # it. Naming it 'air' is not dodging the test, it is the piece telling
                    # the truth about itself.
                    edges=dict(N='air', E='air', S='asphalt', W='air'))


def colours(im):
    return {(p[0], p[1], p[2]) for p in im.convert('RGBA').getdata() if p[3] > 127}


def seam_of(im, axis):
    """RULE 77 MEASURED, NOT DECLARED. Lay two of the piece end to end and compare the joint
       with the inside of the piece. A declared edge that does not actually meet is a label."""
    import numpy as np
    a = np.asarray(im.convert('RGB'), np.int16)
    if axis == 'x':
        joint = np.abs(a[:, 0, :].astype(np.int16) - a[:, -1, :].astype(np.int16)).sum(axis=1)
        inner = np.abs(a[:, 1:, :] - a[:, :-1, :]).sum(axis=2)
    else:
        joint = np.abs(a[0, :, :].astype(np.int16) - a[-1, :, :].astype(np.int16)).sum(axis=1)
        inner = np.abs(a[1:, :, :] - a[:-1, :, :]).sum(axis=2)
    al = np.asarray(im.convert('RGBA'), np.int16)[:, :, 3]
    keep = (al[:, 0] > 127) & (al[:, -1] > 127) if axis == 'x' else \
           (al[0, :] > 127) & (al[-1, :] > 127)
    if keep.sum() < 4: return None, float(inner.mean())
    return float(joint[keep].mean()), float(inner.mean())


def guards(kit, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    ok('SIX PIECES, WHICH IS THE WHOLE FREEWAY KIT RULE 77a NAMES, AND NO MORE (BB keeps a '
       'short blocker vocabulary per terrain on purpose): %d' % len(kit), len(kit) == 6)

    reused = [k for k in kit if k[1].get('reused')]
    ok('REUSE-FIRST IS A LAW, NOT A PREFERENCE: %d of the 6 are built from art this lane or '
       'he already had, and each says which' % len(reused), len(reused) >= 4,
       'four were already in the 9/30 kit and his 7/28 bank')

    for im, meta in kit:
        w_px, h_px = im.size
        want_w = m(meta['w'])
        ok('REAL SIZE AT HIS OWN DENSITY: %-26s %.2f m wide is %d px at %.1f px/m (drawn %d)'
           % (meta['name'], meta['w'], want_w, PPM, w_px),
           abs(w_px - want_w) <= max(6, want_w * 0.08),
           'nothing in this kit is fitted to a convenient box')

    for im, meta in kit:
        k, h = meta['kind'], meta['h']
        good = (k == 'BLOCKER' and h > CHEST) or (k == 'COVER' and h < CHEST) or \
               (k == 'DRESSING')
        if 'cover_h' in meta: good = good and meta['cover_h'] < CHEST
        ok('COVER OR BLOCKER IS MEASURED, NOT FILED BY EYE: %-26s %s at %.2f m against a '
           'chest at %.2f' % (meta['name'], k, h, CHEST), good)

    for im, meta in kit:
        e = meta['edges']
        ok('RULE 77, FOUR TYPED EDGES: %-26s N %s / E %s / S %s / W %s'
           % (meta['name'], e['N'], e['E'], e['S'], e['W']),
           all(e.get(s) for s in 'NESW'))

    for im, meta in kit:
        e = meta['edges']
        if e['E'] != e['W'] or e['E'] in ('asphalt', 'air'): continue
        j, inner = seam_of(im, 'x')
        ok('AND THE RUNS ACTUALLY JOIN, MEASURED: %-26s laid end to end the joint is %.0f '
           'against %.0f inside it' % (meta['name'], j if j is not None else -1, inner),
           j is not None and j <= inner * 2.6,
           'a run whose ends do not meet is six props, not a run')

    for im, meta in kit:
        bad = colours(im) - ALL
        ok('EVERY PIXEL IS HIS: %-26s' % meta['name'], not bad,
           '%d colours off his ramps, his tiles and this lane\'s own 9/30 kit' % len(bad))

    seen = {}
    dup = 0
    for im, meta in kit:
        b = im.tobytes()
        if b in seen: dup += 1
        seen[b] = meta['name']
    ok('NOTHING IS STAMPED: no two pieces of the kit are the same picture (%d duplicates)'
       % dup, dup == 0)

    drafts = [meta for _, meta in kit if meta.get('draft')]
    ok('THE WORDS SHIP AS AN ATTEMPT, TAGGED draft (the 8/11 amendment): %d piece(s) carry '
       'player-facing text and every one is marked' % len(drafts),
       all(d.get('draft') for d in drafts))
    return fails


BG=(16,15,14); INK=(238,232,220); DIM=(150,142,130); HOT=(226,162,72)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(kit):
    pad = 26
    W = 1560
    f28, f18, f15, f13 = font(28), font(18), font(15), font(13)
    rows, y = [], 110
    road = cells(['road_0', 'road_1', 'road_2'], W - pad * 2, 1, 1)
    for im, meta in kit:
        sc = min(2.0, (W - pad * 2 - 300) / float(im.size[0]))
        rows.append((im, meta, max(1, int(im.size[1] * sc)), sc))
        y += max(70, int(im.size[1] * sc)) + 54
    H = y + 150
    card_im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(card_im)
    d.text((pad, 24), 'THE FREEWAY KIT', font=f28, fill=INK)
    d.text((pad, 60), 'six pieces at the house-tile scale, four of them already in this '
                      'lane\'s cupboard, every edge typed   ***   COOK 10/10',
           font=f15, fill=DIM)
    y = 110
    for im, meta, hh, sc in rows:
        band = cells(['road_0', 'road_1', 'road_2'], W - pad * 2, hh + 24, 3).convert('RGB')
        card_im.paste(band, (pad, y))
        shown = im.resize((max(1, int(im.size[0] * sc)), hh), Image.NEAREST)
        card_im.paste(shown, (pad + 12, y + 12), shown)
        tx = pad + 24 + shown.size[0]
        if tx > W - 320: tx = W - 320
        d.rectangle([tx - 8, y + 10, W - pad - 6, y + 74], fill=(22, 20, 18))
        d.text((tx, y + 14), meta['name'], font=f18, fill=HOT)
        d.text((tx, y + 36), '%.1f x %.1f m, %.2f m high   %s'
               % (meta['w'], meta['l'], meta['h'], meta['kind']), font=f13, fill=DIM)
        e = meta['edges']
        d.text((tx, y + 54), 'edges  N %s / E %s / S %s / W %s'
               % (e['N'], e['E'], e['S'], e['W']), font=f13, fill=DIM)
        d.text((pad + 12, y + hh + 16), ('REUSED: ' + meta['reused']) if meta.get('reused')
               else 'NEW', font=f13, fill=(150, 200, 140) if meta.get('reused') else HOT)
        y += hh + 54
    d.text((pad, H - 108), 'FOUR OF THE SIX WERE ALREADY IN THE CUPBOARD: the barrier, the '
                           'chain-link and the trailer are this lane\'s own 9/30 kit, and the '
                           'burned car is HIS approved wreck, burned, not redrawn.',
           font=f15, fill=INK)
    d.text((pad, H - 80), 'rule 77: every piece declares what runs out of its four sides, and '
                          'the runs are LAID END TO END AND THE JOINT MEASURED, because a '
                          'declared edge that does not meet is a label.', font=f13, fill=DIM)
    d.text((pad, H - 58), 'cover or blocker is measured against a man\'s chest at 1.30 m, not '
                          'filed by eye: the barrier run is 0.81 and is cover, the fence is '
                          '1.83 and is a blocker you can see through.', font=f13, fill=DIM)
    d.text((pad, H - 36), 'the sign\'s words ship as an attempt tagged draft: what a sign in '
                          'this valley says is his.', font=f13, fill=DIM)
    return card_im


def main():
    kit = [barrier_run(), shoulder_fence(), freeway_lamp(), sign_gantry(),
           stalled_truck(), burned_car()]
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
        bank='BOHEMIA_THE_FREEWAY_KIT_10_10_26', date='10/10/26',
        lane='cook', row='[the board props] round 1, rule 77a',
        law='rule 77 TILES ARE LEGOS: four typed edges, and the joint measured not declared',
        px_per_metre=PPM, tile_metres=TILE_M, chest_metres=CHEST,
        from_banks=[STREET, KIT930],
        how_to_use='COMBAT TWO places these. Each piece carries its four edge types, its real '
                   'size in metres and its height, so the board can rule on cover and lay the '
                   'runs end to end. The FOOTPRINT (what it covers on the ground) is w x l; '
                   'the picture is the FACE. Nothing here is pre-squashed for a pitched '
                   'camera, because squashing a finished picture resamples every pixel.',
        pieces=recs), open(OUT_BANK, 'w'))

    L = []
    L.append('THE FREEWAY KIT -- MEASURED  (COOK [the board props] round 1, 10/10/26, rule 77a)')
    L.append('=' * 78)
    L.append('')
    L.append('THE ROW, rule 77a: the FREEWAY KIT FIRST -- a Jersey barrier run, a chain-link')
    L.append('shoulder fence, a freeway lamp, a sign gantry, a stalled truck with its trailer,')
    L.append('a burned car -- at the house-tile scale, typed edges, in the street kit\'s own')
    L.append('asphalt and paint. COMBAT TWO places them.')
    L.append('')
    L.append('*** THE FIRST THING THIS ROUND DID WAS OPEN ITS OWN CUPBOARD, AND FOUR OF THE')
    L.append('*** SIX WERE ALREADY IN IT.')
    L.append('REUSE-FIRST is a law, not a preference. The 9/30 block war kit this lane built')
    L.append('already holds a Jersey barrier, a chain-link run and a trailer, all at the same')
    L.append('42.9 px a metre; his own 7/28 bank holds the wreck. So this round drew THREE new')
    L.append('things, not six, and every reused piece names what it came from:')
    for im, meta in kit:
        L.append('  %-26s %5.1f x %4.1f m  %4.2f m  %-8s  %s'
                 % (meta['name'], meta['w'], meta['l'], meta['h'], meta['kind'],
                    ('REUSED: ' + meta['reused']) if meta.get('reused') else 'NEW'))
    L.append('')
    L.append('RULE 77, AND THE PART THAT IS NOT A LABEL. Paolo 10/5: "the tiles aren\'t')
    L.append('speaking to each other... these things should conjoin easily like Legos." Every')
    L.append('piece declares what runs out of its four sides. THEN THE GATE LAYS TWO OF EACH')
    L.append('RUN END TO END AND MEASURES THE JOINT against the inside of the piece, because a')
    L.append('declared edge that does not actually meet is a label and not a joint. A barrier')
    L.append('run that cannot be laid end to end is six barriers, not a run.')
    L.append('')
    L.append('COVER OR BLOCKER IS MEASURED, NOT FILED BY EYE. A man\'s chest is 1.30 m: over it')
    L.append('stops a shot, under it does not. This lane\'s own 9/30 round filed two pieces')
    L.append('wrong by eye and the tape corrected it, so the tape runs here too. The barrier')
    L.append('run is 0.81 and is COVER. The fence is 1.83 and is a BLOCKER YOU CAN SEE THROUGH,')
    L.append('which is the only reason to put one on a board: you know what is coming and you')
    L.append('still cannot get to it. The truck is 2.80 and stops everything.')
    L.append('')
    L.append('AND ONE THING THIS KIT DOES THAT THE 9/30 KIT GOT WRONG. On 10/1 this lane filed')
    L.append('its own correction: the block war kit was drawn flat, straight on, while COMBAT')
    L.append('TWO\'s board is cut for a camera pitched forty-five degrees, so those pieces do')
    L.append('not sit on it. Every piece here carries its FOOTPRINT (w x l, what it covers on')
    L.append('the ground) separately from its FACE (the picture), so COMBAT TWO can place it on')
    L.append('a pitched board without squashing a finished picture -- which would resample')
    L.append('every one of his pixels, the exact fault the far-end round was about.')
    L.append('')
    L.append('THE SIGN\'S WORDS SHIP AS AN ATTEMPT TAGGED draft (the 8/11 amendment: tables')
    L.append('ship empty, player-facing words ship as a real attempt marked draft). What a')
    L.append('sign in this valley actually says is his.')
    L.append('')
    L.append('THE GUARDS, EVERY ONE RUN, EVERY ONE ABLE TO REFUSE THE BUILD:')
    for st, line, why in log:
        L.append('  %-4s %s' % (st.upper(), line))
    L.append('')
    L.append('[bb the overworld is battle brothers] reference/library/battle_brothers/')
    L.append('  02_COMBAT_RULES.md, the TERRAIN and BOARD lines: BB scatters three to six')
    L.append('  blocker kinds per terrain and keeps the vocabulary short on purpose, because a')
    L.append('  board reads when its vocabulary is short; height is the one bonus. Taken: six')
    L.append('  pieces, each with its height in metres so the board can rule on it. WHAT MOVES')
    L.append('  THAT THEIR PICTURE DOES NOT: BB\'s blockers are nature\'s, trees and rocks, the')
    L.append('  same every fight. Every piece here is something people built for a road that no')
    L.append('  longer carries anyone, and the run of barriers is as long as the fight needs')
    L.append('  because its ends key.')
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('')
    for p in (OUT_CARD, OUT_BANK, OUT_REC):
        print('  wrote %s  (%d KB)' % (p, os.path.getsize(p) // 1024))


if __name__ == '__main__':
    main()
