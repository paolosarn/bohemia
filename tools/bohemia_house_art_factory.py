#!/usr/bin/env python3
"""
BOHEMIA HOUSE SKIN FACTORY (7/21/26, overnight cook) - suburban house skins.

CANON as of 7/21/26: Paolo verdict all 30 UP (records/BOHEMIA_HOUSE_SKIN_
VERDICT_7_21_26.txt). Married into the canon suburb by tools/bohemia_city_
houseart_patch.py. Kept here for the record and re-run reproducibility
(seed-regen law): the original cook, per the craft laws learned the hard
way on the traffic signals:
  - PAINTED, NOT FILLED: every tile is built from a tone RAMP (5 steps) with
    a dithered highlight band, never flat fills with noise
  - SKY-LIT: roofs are the world's visible tops - lit ridge, darker eaves
    (the 45-degree law's expression for top-down surfaces)
  - TAN WALL 85/15: wall bodies live in the tan family; only accents leave it
  - DEAD WORLD: windows are dark or BOARDED (no lit rooms, no curtains),
    doors are weathered wood, everything carries 30-year wear as coherent
    BLOTCHES and streaks below edges - never confetti
  - ZERO PURPLE (the Amalgamation's alone), deterministic seeds throughout

Output: banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (b64 tiles + meta).

  python3 tools/bohemia_house_art_factory.py

REUSE CHECK: added retroactively 7/22 (laws/BOHEMIA_ADDENDUM_REUSE_FIRST_
LOCKED_7_22_26). This cook checked NOTHING against the corpus before
generating - the reuse-first law didn't exist yet the night this ran.
Honest gap, not a used-anyway justification. What SHOULD have been
checked, discovered afterward: banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt
was already Paolo-approved wall art sitting unused (found 7/21, married
into the city separately by tools/bohemia_city_perimeterwall_patch.py -
not by this file); banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt existed as
unjudged door-edge candidates (surfaced 7/21, composed into real doors by
tools/bohemia_suburb_walk.py - also not by this file). This factory's own
roof/wall/window/door pixels still ship as-is (Paolo verdicted the output,
not the process) - nothing here is being unwound. Standing order for any
FUTURE variant of this batch: read banks/BOHEMIA_ROOF_KIT_EXPANSION_7_14_26.txt
first (Paolo, roundup verdict 7/21: "i want you to emulate these for the
other tiles" - the technique to study before cooking more roof material).
"""
import base64
import io
import json
import os

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
OUT = os.environ.get('BOH_HOUSE_OUT') or 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
T = 44   # bank-native tile size (the street pools' size)


def rng(seed):
    s = seed & 0xffffffff or 1
    def r():
        nonlocal s
        s ^= (s << 13) & 0xffffffff
        s ^= s >> 17
        s ^= (s << 5) & 0xffffffff
        return s / 4294967296
    return r


def clamp(v):
    return max(0, min(255, int(v)))


def ramp(base, spread=1.0):
    """5-step painted ramp around a base color: deep shadow..highlight."""
    r0, g0, b0 = base
    return [tuple(clamp(c * f) for c in (r0, g0, b0))
            for f in (0.55, 0.75, 1.0, 1.18 * spread and 1.18, 1.34)]


def blotch(px, w, h, r, tone, n, size):
    """coherent wear blotches (never confetti): few seeds, grown regions."""
    for _ in range(n):
        cx, cy = int(r() * w), int(r() * h)
        rad = size + r() * size
        for y in range(max(0, int(cy - rad)), min(h, int(cy + rad))):
            for x in range(max(0, int(cx - rad)), min(w, int(cx + rad))):
                d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
                if d < rad and r() < 0.7 * (1 - d / rad):
                    o = px[x, y]
                    px[x, y] = tuple(clamp(o[i] * 0.72 + tone[i] * 0.28) for i in range(3))


def roof_shingle(seed, base):
    im = Image.new('RGB', (T, T))
    px = im.load()
    r = rng(seed)
    R = ramp(base)
    row_h = 5
    for y in range(T):
        row = y // row_h
        in_row = y % row_h
        for x in range(T):
            stagger = (row * 7 + (x // 6) * 3) % 4
            edge = in_row == row_h - 1
            t = 3 if in_row == 0 else 2          # lit top course of each row
            if edge:
                t = 0                            # shadow line between courses
            if (x + stagger) % 6 == 0 and not edge:
                t = 1                            # shingle seam
            c = R[t]
            j = (r() - 0.5) * 10                 # calm grain (10%, the craft law)
            px[x, y] = tuple(clamp(v + j) for v in c)
    blotch(px, T, T, rng(seed ^ 0xAA), (96, 78, 60), 3, 6)   # weather stains
    return im


def roof_stile(seed, blend):
    """concrete S-tile (the REAL Vegas roof, per the 7/21 45-degree research):
    vertical barrel ribs down the slope (crest lit, trough in deep shadow),
    soft course steps, mottled multi-tone desert blend, lit ridge-cap band."""
    im = Image.new('RGB', (T, T))
    px = im.load()
    r = rng(seed)
    ramps = [ramp(b) for b in blend]
    RIB, COURSE = 8, 7
    for y in range(T):
        cy = y % COURSE
        for x in range(T):
            seg = (x // RIB) * 31 + (y // COURSE) * 17 + (seed & 7)
            R = ramps[(seg * 2654435761 >> 8) % len(ramps)]   # mottle per tile
            phase = (x % RIB) / RIB
            if phase < 0.15:
                t = 1                          # barrel rising off the trough
            elif phase < 0.3:
                t = 2                          # shoulder
            elif phase < 0.55:
                t = 3                          # sun on the crest
            elif phase < 0.8:
                t = 2                          # falling side
            else:
                t = 0                          # deep trough shadow between barrels
            if cy == COURSE - 1:
                t = max(0, t - 1)              # course overlap step shadow
            if y < 3:
                t = 4 if phase < 0.6 else 3    # sky-lit ridge caps
            c = R[t]
            j = (r() - 0.5) * 8
            px[x, y] = tuple(clamp(v + j) for v in c)
    blotch(px, T, T, rng(seed ^ 0xAB), (92, 76, 60), 2, 5)
    return im


def yard_gravel(seed, base):
    """decomposed-granite yard (Vegas front yards are ROCK, lawns banned):
    a calm speckled tone field with sparse pebbles, coherent drift, no confetti."""
    im = Image.new('RGB', (T, T))
    px = im.load()
    r = rng(seed)
    R = ramp(base)
    for y in range(T):
        for x in range(T):
            c = R[2]
            j = (r() - 0.5) * 16               # fine DG speckle, low contrast
            px[x, y] = tuple(clamp(v + j) for v in c)
    for _ in range(26):                        # sparse larger pebbles
        gx, gy = int(r() * (T - 2)), int(r() * (T - 2))
        t = 1 if r() < 0.6 else 3
        for dy in range(2):
            for dx in range(2):
                px[gx + dx, gy + dy] = R[t]
    blotch(px, T, T, rng(seed ^ 0xCD), (128, 110, 84), 2, 8)   # tone drift
    return im


def roof_gravel(seed, base):
    im = Image.new('RGB', (T, T))
    px = im.load()
    r = rng(seed)
    R = ramp(base)
    for y in range(T):
        for x in range(T):
            t = 2
            if y < 3:
                t = 3                            # sky-lit parapet edge
            if y > T - 3:
                t = 1
            c = R[t]
            g = (r() - 0.5) * 14
            px[x, y] = tuple(clamp(v + g) for v in c)
    blotch(px, T, T, rng(seed ^ 0xBB), (70, 64, 54), 4, 5)
    return im


def wall(seed, base, feature=None):
    """tan stucco face; feature: None | 'window' | 'boarded' | 'door'"""
    im = Image.new('RGB', (T, T))
    px = im.load()
    r = rng(seed)
    R = ramp(base)
    for y in range(T):
        for x in range(T):
            t = 2
            if y < 2:
                t = 3                            # sun catches the top of the face
            if y > T - 4:
                t = 1                            # ground shadow at the footing
            c = R[t]
            j = (r() - 0.5) * 8
            px[x, y] = tuple(clamp(v + j) for v in c)
    # hairline cracks from the top plate (dead-world age)
    for _ in range(2):
        cx = int(6 + r() * (T - 12))
        y = 0
        while y < 10 + r() * 14:
            px[clamp(cx), int(y)] = R[0]
            cx += -1 if r() < 0.4 else (1 if r() < 0.5 else 0)
            cx = max(1, min(T - 2, cx))
            y += 1
    if feature in ('window', 'boarded'):
        wx, wy, ww, wh = 10, 12, 24, 18
        for y in range(wy, wy + wh):
            for x in range(wx, wx + ww):
                px[x, y] = (26, 28, 32)          # dead dark glass
        for x in range(wx - 1, wx + ww + 1):     # frame
            px[x, wy - 1] = R[3]
            px[x, wy + wh] = R[0]
        for y in range(wy - 1, wy + wh + 1):
            px[wx - 1, y] = R[1]
            px[wx + ww, y] = R[1]
        for x in range(wx, wx + ww):             # sill shadow
            px[x, wy + wh + 1] = R[0]
        if feature == 'boarded':
            wood = (118, 96, 66)
            rr = rng(seed ^ 0xCC)
            for i, by in enumerate(range(wy + 2, wy + wh - 1, 6)):
                for x in range(wx - 2, wx + ww + 2):
                    yy = by + (x // 9 + i) % 2
                    for dy in range(3):
                        if wy <= yy + dy < wy + wh + 2:
                            j = (rr() - 0.5) * 16
                            px[x, yy + dy] = tuple(clamp(v + j) for v in wood)
    if feature == 'door':
        dx, dy_, dw, dh = 14, 10, 16, 32
        wood = ramp((116, 88, 58))
        rr = rng(seed ^ 0xDD)
        for y in range(dy_, dy_ + dh):
            for x in range(dx, dx + dw):
                t = 2
                if (x - dx) % 5 == 0:
                    t = 1                        # plank seams
                if y < dy_ + 2:
                    t = 3
                j = (rr() - 0.5) * 12
                px[x, y] = tuple(clamp(v + j) for v in wood[t])
        for y in range(dy_ - 1, dy_ + dh):       # frame
            px[dx - 1, y] = R[3]
            px[dx + dw, y] = R[0]
        for x in range(dx - 1, dx + dw + 1):
            px[x, dy_ - 1] = R[3]
        px[dx + dw - 4, dy_ + dh // 2] = (180, 168, 140)   # knob catches light
        for x in range(dx - 2, dx + dw + 2):     # step shadow
            if 0 <= x < T:
                px[x, min(T - 1, dy_ + dh)] = R[0]
    blotch(px, T, T, rng(seed ^ 0xEE), (110, 94, 72), 2, 5)
    return im


def enc(im):
    out = io.BytesIO()
    im.save(out, 'PNG', optimize=True)
    return base64.b64encode(out.getvalue()).decode('ascii')


ROOF_BASES = [(146, 88, 66), (128, 96, 70), (110, 84, 62)]     # terracotta..dust brown
GRAVEL_BASES = [(104, 98, 88), (92, 88, 80)]
WALL_BASES = [(196, 172, 132), (182, 160, 126), (172, 148, 112),
              (160, 140, 110)]                                  # the tan family (85/15)

bank = {'version': 'BOHEMIA_HOUSE_SKIN_CANDIDATES_v1', 'built': '7/21/26',
        'status': 'CANON (Paolo verdict 7/21/26, all 30 UP - records/BOHEMIA_HOUSE_SKIN_VERDICT_7_21_26.txt)',
        'law': 'CANON house skins - painted ramps, sky-lit tops, tan 85/15, '
               'dead-world windows, zero purple, deterministic',
        'tiles': []}
i = 0
for b in ROOF_BASES:
    for v in range(2):
        bank['tiles'].append({'id': 'roof_shingle_%d' % i, 'cls': 'roof',
                              'b64': enc(roof_shingle(9000 + i, b))}); i += 1
for b in GRAVEL_BASES:
    bank['tiles'].append({'id': 'roof_gravel_%d' % i, 'cls': 'roof',
                          'b64': enc(roof_gravel(9000 + i, b))}); i += 1
for b in WALL_BASES:
    bank['tiles'].append({'id': 'wall_plain_%d' % i, 'cls': 'wall',
                          'b64': enc(wall(9100 + i, b))}); i += 1
for b in WALL_BASES[:3]:
    bank['tiles'].append({'id': 'wall_window_%d' % i, 'cls': 'window',
                          'b64': enc(wall(9200 + i, b, 'window'))}); i += 1
for b in WALL_BASES[:3]:
    bank['tiles'].append({'id': 'wall_boarded_%d' % i, 'cls': 'window',
                          'b64': enc(wall(9300 + i, b, 'boarded'))}); i += 1
for b in WALL_BASES[:3]:
    bank['tiles'].append({'id': 'wall_door_%d' % i, 'cls': 'door',
                          'b64': enc(wall(9400 + i, b, 'door'))}); i += 1

# 7/21 45-degree research additions (records/BOHEMIA_DESERT_HOUSE_45_RESEARCH):
# the REAL Vegas roof is concrete S-tile in mottled desert blends; the real
# yard is decomposed granite. v1 shingles stay in the judge for the kill call.
STILE_BLENDS = [
    ('terracotta', [(168, 96, 64), (148, 84, 58), (178, 110, 74)]),
    ('desertbrown', [(134, 100, 72), (118, 88, 64), (150, 114, 82)]),
    ('graybrown', [(122, 104, 88), (106, 92, 78), (134, 116, 98)]),
]
YARD_BASES = [('deserttan', (186, 160, 120)), ('mojavegold', (190, 156, 96)),
              ('rebelred', (158, 104, 78))]
for name, blend in STILE_BLENDS:
    for v in range(2):
        bank['tiles'].append({'id': 'roof_stile_%s_%d' % (name, i), 'cls': 'roof',
                              'b64': enc(roof_stile(9500 + i, blend))}); i += 1
for name, b in YARD_BASES:
    bank['tiles'].append({'id': 'yard_%s_%d' % (name, i), 'cls': 'yard',
                          'b64': enc(yard_gravel(9600 + i, b))}); i += 1

json.dump(bank, open(OUT, 'w'), indent=0)
cls = {}
for t in bank['tiles']:
    cls[t['cls']] = cls.get(t['cls'], 0) + 1
print('house skins cooked -> %s: %d candidates %s' % (OUT, len(bank['tiles']), cls))
