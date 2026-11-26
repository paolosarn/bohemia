#!/usr/bin/env python3
"""THE DUST RANCHER HAT (CHARACTER 2, 11/26, rule 470(f): Paolo on a homework card, 'why are people wearing chinese rice
farmer hats btw wtf???'). The conical straw hat is graveyarded (records/BOHEMIA_CLOTHING_GRAVEYARD.txt) and this is what the
Caravans wear in its place, decided 11/22 (records/BOHEMIA_CHARACTER_THE_CONE_HAT_IS_DEAD_11_22_26.md): a wide-brim felt
cattleman's hat in the Caravans' own dust felt with a leather band. It keeps the Caravans' outline ('broad / mantle / wide
brim': a brim against the sun, STRUCTURE NOT COLOR) and it is what a Nevada trader really wears: the valley's ranch country,
the Strip's own western money (Binion's Horseshoe, the Golden Nugget).

ONE SHAPE, THREE BUILDERS. The gang's one-piece look (tools/bohemia_character_the_thirteen_through_the_rig.py, hat kind
'rancher'), the speakers' HD faces (tools/bohemia_portrait_the_head_from_the_model.py, gear 'rancher hat') and the barber's
book (tools/bohemia_character_hats_one.py, shape 'rancher') each call shape() with their own head's centre and size, so the
hat on the map, in the fight and on the face is one hat. Pure geometry: no bpy here, the callers make the mesh.

THE SHAPE, from the gambler's hat he voted YES on with the hired guns (tools/bohemia_character_the_nine_enemies.py, GAMBLER):
  the crown   an oval wall (a head is longer than it is wide), a little narrower at the top, pinched at the two front sides
              and pressed down the middle front to back (the cattleman's crease), so from the game's camera it reads as a
              western hat and never as a bucket (the gambler's loop 1) or a cone;
  the band    a leather strip round the crown's foot;
  the brim    flat at the front and the back and rolled up at the sides (the gambler's loop 1 lesson: a brim drooping at the
              front hid the whole face from the game's camera), a touch wider at the sides than at the front.
The man faces -y; azimuth 0 is his front, +x his left.
"""
import math


def sstep(a, b, t):
    t = max(0.0, min(1.0, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)


def shape(cx, cy, zb, rx, ry, crown_h, brim, roll, na=72, nz=7, nr=6, crease=0.15, pinch=0.15, tilt=0.0):
    """the hat round a head: (verts, faces, part) where verts are (x, y, z), faces index verts, and part[f] is 'crown',
    'band' or 'brim'. cx, cy: the head's centre in plan; zb: the band's foot; rx, ry: the crown's half width and half depth
    at the band; crown_h: the crown's height; brim: the brim's width at the front; roll: how far the sides roll up; tilt:
    metres the whole hat rises per metre toward the back (worn pushed back, so the face shows)"""
    V, F, P = [], [], []

    def ring(az, k, z):
        return (cx + math.sin(az) * rx * k, cy - math.cos(az) * ry * k, z)

    def tz(p):   # worn pushed back: the back of the hat a little higher than the front
        return (p[0], p[1], p[2] + tilt * (p[1] - cy))

    def crease_dz(x, u):   # the cattleman's crease: pressed down the middle, front to back, on the top
        # loop 2: 0.26 deep and 0.42 wide read as a black pit from the game's camera (the rig's sun leaves a narrow
        # valley in shadow); a wide shallow crease takes the light the way pressed felt does
        return -crease * crown_h * math.exp(-(x / (0.62 * rx)) ** 2) * sstep(0.55, 1.0, u)

    def pinch_k(az, u):   # the two front pinches, up near the top
        a = abs(az)
        return 1.0 - pinch * sstep(0.45, 1.0, u) * math.exp(-((a - 0.62) / 0.32) ** 2)

    rows = []
    for j in range(nz + 1):   # the wall
        u = j / nz; row = []
        for i in range(na):
            az = -math.pi + 2 * math.pi * i / na
            k = (1.0 - 0.05 * u) * pinch_k(az, u)
            x, y, z = ring(az, k, zb + crown_h * 0.90 * u)
            row.append((x, y, z + crease_dz(x - cx, u * 0.9)))
        rows.append(row)
    # the shoulder, then the top drawn in as a low dome (a dip at the middle caught the rig's shadow as a black pit, loop 1)
    for f, dz in ((0.86, 0.055), (0.66, 0.085), (0.42, 0.098), (0.18, 0.104)):
        row = []
        for i in range(na):
            az = -math.pi + 2 * math.pi * i / na
            k = 0.95 * f * pinch_k(az, 1.0)
            x, y, _ = ring(az, k, 0)
            z = zb + crown_h * (0.90 + dz) + crease_dz(x - cx, 1.0)
            row.append((x, y, z))
        rows.append(row)
    base = len(V)
    for row in rows: V.extend(tz(p) for p in row)
    for j in range(len(rows) - 1):
        for i in range(na):
            a = base + j * na + i; b = base + j * na + (i + 1) % na
            F.append((a, b, b + na, a + na))
            P.append('band' if j <= 1 else 'crown')   # two rows of the wall: a band you can see over the brim (loop 1)
    mid = len(V); V.append(tz((cx, cy, zb + crown_h * 1.006 + crease_dz(0.0, 1.0))))
    last = base + (len(rows) - 1) * na
    for i in range(na):
        F.append((last + i, last + (i + 1) % na, mid)); P.append('crown')
    # the brim: out from just inside the crown's foot, flat front and back, the sides rolled up
    base = len(V)
    for j in range(nr + 1):
        u = j / nr
        for i in range(na):
            az = -math.pi + 2 * math.pi * i / na; a = abs(az)
            side = sstep(0.85, 1.45, a) * (1.0 - sstep(2.05, 2.75, a))
            w = brim * (1.0 + 0.14 * side)
            rr_x = rx * 0.985 + w * u
            rr_y = ry * 0.985 + w * u
            x = cx + math.sin(az) * rr_x; y = cy - math.cos(az) * rr_y
            z = zb + roll * (u ** 2.2) * side - 0.10 * roll * u * (1.0 - side)
            V.append(tz((x, y, z)))
    for j in range(nr):
        for i in range(na):
            a = base + j * na + i; b = base + j * na + (i + 1) % na
            F.append((a, a + na, b + na, b)); P.append('brim')
    return V, F, P


DUST_FELT = (128, 110, 80)     # the Caravans' own dust (the record's felt)
BAND_LEATHER = (66, 48, 34)    # an oiled saddle-leather band
