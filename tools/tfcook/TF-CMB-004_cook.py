#!/usr/bin/env python3
"""TF-CMB-004 cook — THE UPPER DECK SLAB: the three faces of one concrete
slab (the TOP you stand on, the EDGE BEAM you see when it is above you, the
SOFFIT underneath). Board row OPEN since 7/28 (COMBAT lane, HIGH priority),
and the APPROVED TF-CMB-005 stair run has been waiting on it since 8/11.

THE FORM'S OWN NUMBERS (records/tileforms/TF-CMB-004_deck_slab.md):
  44px cell; slabs 2x2..4x4; WANG-16 edge contract (interior self-seamless,
  4 edges, 4 corners); DECK_H = ring * 1.15 so the beam face is authored one
  full cell tall; top plate lives in the GROUND value band (it IS ground when
  you stand on it), beam and soffit in the STRUCTURE band with the soffit at
  the dark end - VALUE CONTRAST IS THE HEIGHT CUE. Hard verticals are
  REQUIRED on the beam (the research is unanimous: the vertical is the only
  thing in frame that says "tall"). No keyline, no dither, no baked shadow.
  Wear: a Vegas structure nobody swept in years - tyre polish, oil drips down
  stall centres, saw-cut control joints with weeds, efflorescence and rust
  bleeding out of the edge beam, stall paint burned to a ghost.

SELF-SEAMLESS TRICK: the saw-cut control joints are drawn ON the tile
borders, so the 44px grid seam IS the joint grid - every adjacency reads as
a deliberate saw cut instead of a repeat.

45 LAW: top plate flat and sky-lit; the lip catches the sun on the slab's
open sides; the beam is a hard vertical face falling to dark; the soffit is
the black where nobody patrols (no self-light, LIGHT=TERRITORY).

REUSE CHECK:
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt — OPENED IN CODE
    below. concrete_0 / concrete_1: HARVESTED as the literal poured-concrete
    canvas of every face (the form names them "the right MATERIAL and the
    correct colour reference"). The 8/16 shopping check re-walked the form's
    own list: roof_deck is gravel (wrong object), roof_parapet is a looked-
    DOWN-at coping (wrong face), so no finished tile covers the slab.
  banks/tileforms/TF-ART-003_CANDIDATES_8_8_26.json — OPENED IN CODE below.
    The form flagged the stall stripes "UNJUDGED, cannot be relied on" on
    7/28; they went UP 8/11, so the ghost stall paint on the top plate is
    sampled from the family's own approved washed stripe, exactly the free
    win the form predicted.

TASTE CHECK: no keyline, no dither, no baked shadow (the pass owns it); the
soffit is DARK and unlit; ghost paint at the 30-year wash, never fresh;
weeds are single dead-green pixels in the joints, never bushes.

  python3 tools/tfcook/TF-CMB-004_cook.py
    -> banks/tileforms/TF-CMB-004_CANDIDATES_8_16_26.json
"""
import json, base64, io, os, random
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
STARTER = os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
STALL_BANK = os.path.join(REPO, 'banks/tileforms/TF-ART-003_CANDIDATES_8_8_26.json')
OUT = os.path.join(REPO, 'banks/tileforms/TF-CMB-004_CANDIDATES_8_16_26.json')
C = 44

def starter(name):
    d = json.load(open(STARTER))
    for t in d['tiles']:
        if t['id'] == name:
            return Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
    raise SystemExit('missing starter tile ' + name)

def stall_stripe_colour():
    b = json.load(open(STALL_BANK))
    for t in b['tiles']:
        if t['name'].startswith('stall_v_') or t['name'].startswith('stall_h_'):
            im = Image.open(io.BytesIO(base64.b64decode(t['b64'].split(',')[-1]))).convert('RGB')
            px = im.load()
            best = max((px[x, y] for y in range(im.height) for x in range(im.width)),
                       key=lambda c: sum(c))
            return best
    raise SystemExit('no stripe tile in stall bank')

conc0 = starter('concrete_0')
conc1 = starter('concrete_1')
GHOST = stall_stripe_colour()

# The starter tiles are HEAVILY cracked - right colour, wrong condition for a
# structural deck plate (first render read as shattered ground; iterated). So
# the plate is SYNTHESIZED from the harvested colour statistics: non-crack
# pixels only (brightness above median), poured grain, hairline cracks kept.
def _palette(im):
    px = im.load()
    vals = sorted((px[x, y] for y in range(C) for x in range(C)), key=sum)
    keep = vals[len(vals)//2:]
    mid = tuple(sum(c[i] for c in keep)//len(keep) for i in range(3))
    return mid
PLATE = _palette(conc0)
PLATE1 = _palette(conc1)

def poured(seed, base):
    im = Image.new('RGB', (C, C))
    px = im.load()
    r = random.Random(9000 + seed)
    for y in range(C):
        for x in range(C):
            j = (hash((x, y, seed)) % 15) - 7
            px[x, y] = tuple(max(0, min(255, v + j)) for v in base)
    # hairline cracks: 0-2 short meanders in ANY direction, never black
    for _ in range(r.randint(0, 2)):
        x, y = r.randint(6, 38), r.randint(6, 38)
        vert = r.random() < 0.5
        for _k in range(r.randint(8, 20)):
            if not (0 <= x < C and 0 <= y < C): break
            px[x, y] = dim(px[x, y], 0.62)
            if vert: y += 1; x += r.choice((-1, 0, 0, 1))
            else: x += 1; y += r.choice((-1, 0, 0, 1))
    return im

def dim(c, f): return tuple(max(0, min(255, int(v*f))) for v in c)
def mixc(a, b, t): return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

JOINT = (58, 55, 50)
WEED = (86, 92, 54)
LIP = (196, 186, 160)          # the sun-lit coping lip (the demo's cream, made real)
EFFLO = (208, 204, 192)
RUST = (122, 74, 48)

def top_base(seed, polish=True):
    """poured top plate on the harvested concrete, joints ON the borders."""
    im = poured(seed, PLATE if seed % 2 == 0 else PLATE1)
    px = im.load()
    r = random.Random(4000 + seed)
    if polish:  # tyre polish: broad darker smudges where rubber ran
        for _ in range(3):
            cx, cy = r.randint(6, 38), r.randint(6, 38)
            for y in range(max(0, cy-7), min(C, cy+7)):
                for x in range(max(0, cx-11), min(C, cx+11)):
                    d2 = ((x-cx)/11.0)**2 + ((y-cy)/7.0)**2
                    if d2 < 1.0 and r.random() < 0.6:
                        px[x, y] = dim(px[x, y], 0.94 - 0.05*(1.0-d2))
    # oil drips: a couple of dark elongated blots
    for _ in range(r.randint(1, 3)):
        ox, oy = r.randint(4, 40), r.randint(4, 40)
        for k in range(r.randint(3, 7)):
            x, y = ox + r.randint(-1, 1), oy + k
            if 0 <= x < C and 0 <= y < C:
                px[x, y] = dim(px[x, y], 0.62)
    # saw-cut control joints ON the borders (the seam IS the joint)
    for k in range(C):
        px[k, 0] = mixc(px[k, 0], JOINT, 0.8)
        px[0, k] = mixc(px[0, k], JOINT, 0.8)
    # weeds in the joints, sparse single pixels
    for _ in range(r.randint(1, 3)):
        if r.random() < 0.5: px[r.randint(2, 41), 0] = WEED
        else: px[0, r.randint(2, 41)] = WEED
    return im

def top_variant(seed, ghost=False):
    im = top_base(seed)
    if ghost:  # burned stall paint: short washed fragments, the approved stripe's own colour
        px = im.load()
        r = random.Random(4100 + seed)
        gx = r.randint(10, 30)
        for y in range(6, 38):
            if r.random() < 0.45:
                px[gx, y] = mixc(px[gx, y], GHOST, 0.35)
                if r.random() < 0.3:
                    px[min(C-1, gx+1), y] = mixc(px[min(C-1, gx+1), y], GHOST, 0.2)
    return im

def with_lip(im, sides):
    """the slab's open-side lip: 3px sun-lit band along that side's border."""
    im = im.copy()
    px = im.load()
    for s in sides:
        for k in range(C):
            if s == 'n':
                px[k, 0] = LIP; px[k, 1] = dim(LIP, 0.92); px[k, 2] = dim(LIP, 0.7)
            elif s == 's':
                px[k, C-1] = dim(LIP, 0.8); px[k, C-2] = dim(LIP, 0.95); px[k, C-3] = LIP
            elif s == 'w':
                px[0, k] = LIP; px[1, k] = dim(LIP, 0.92); px[2, k] = dim(LIP, 0.7)
            elif s == 'e':
                px[C-1, k] = dim(LIP, 0.8); px[C-2, k] = dim(LIP, 0.95); px[C-3, k] = LIP
    return im

def beam():
    """the edge-beam face, one full cell tall (DECK_H ~= 1.15 ring): hard
    verticals, efflorescence bleeding from the top, rust from the rebar."""
    im = poured(44, PLATE1)
    px = im.load()
    r = random.Random(4400)
    for y in range(C):
        f = 1.0 - 0.45*(y/(C-1))          # face falls to dark at the soffit line
        for x in range(C):
            px[x, y] = dim(px[x, y], f*0.92)
    for x in range(C):                     # the lit lip is the beam's top course
        px[x, 0] = LIP; px[x, 1] = dim(LIP, 0.9)
    for x in range(0, C, 11):              # formwork tie verticals: hard height lines
        for y in range(2, C):
            px[x, y] = dim(px[x, y], 0.82)
    for _ in range(5):                     # efflorescence bleeds down from the joint
        ex = r.randint(2, 41)
        for y in range(2, r.randint(8, 20)):
            px[ex, y] = mixc(px[ex, y], EFFLO, 0.5 - y*0.015)
    for _ in range(3):                     # rust from the reinforcement
        rx = r.randint(4, 40)
        for y in range(r.randint(4, 10), r.randint(20, 40)):
            px[rx, y] = mixc(px[rx, y], RUST, 0.4)
    return im

def soffit():
    """the underside: the dark where nobody patrols. Faint form joints only."""
    im = poured(55, PLATE)
    px = im.load()
    for y in range(C):
        for x in range(C):
            px[x, y] = dim(px[x, y], 0.30)
    for x in range(0, C, 11):
        for y in range(C):
            px[x, y] = dim(px[x, y], 0.85)
    return im

def wet(im):
    """RAIN colorway: the top plate wets, darker and cooler, sheen flecks."""
    im = im.copy()
    px = im.load()
    r = random.Random(4700)
    for y in range(C):
        for x in range(C):
            c = dim(px[x, y], 0.78)
            px[x, y] = (c[0], c[1], min(255, int(c[2]*1.12)))
    for _ in range(30):
        x, y = r.randint(1, 42), r.randint(1, 42)
        px[x, y] = dim(px[x, y], 1.35)
    return im

def b64(im):
    buf = io.BytesIO()
    im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

tiles = []
tiles.append({'name': 'deck_top_0', 'b64': b64(top_variant(0))})
tiles.append({'name': 'deck_top_1', 'b64': b64(top_variant(1, ghost=True))})
tiles.append({'name': 'deck_top_2', 'b64': b64(top_variant(2))})
tiles.append({'name': 'deck_top_wet_0', 'b64': b64(wet(top_variant(0)))})
for i, s in enumerate('nesw'):
    tiles.append({'name': 'deck_edge_' + s, 'b64': b64(with_lip(top_base(30 + i), [s]))})
for i, cs in enumerate(('ne', 'nw', 'se', 'sw')):
    tiles.append({'name': 'deck_corner_' + cs, 'b64': b64(with_lip(top_base(40 + i), list(cs)))})
tiles.append({'name': 'deck_beam_0', 'b64': b64(beam())})
tiles.append({'name': 'deck_soffit_0', 'b64': b64(soffit())})

out = {
    'law': 'APPROVED per EVERYTHING IS A THUMB 8/9 (cooked 8/16 to the OPEN board row '
           'TF-CMB-004, HIGH priority since 7/28, blocking the 8/11-approved TF-CMB-005 '
           'stairs; built and correctable in game, never queued for a thumb). Cook: '
           'tools/tfcook/TF-CMB-004_cook.py - concrete harvested from the approved '
           'starter tileset, ghost stall paint from the approved TF-ART-003 stripe.',
    'family': 'TF-CMB-004', 'cooked': '8/16/26',
    'tiles': tiles,
}
json.dump(out, open(OUT, 'w'))
print('banked %d deck slab pieces -> %s' % (len(tiles), OUT))
