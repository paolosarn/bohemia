#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [hair three]: TWELVE MORE CUTS ON THE STARRED HEAD, BATTLE BROTHERS' RANGE, THE CRASHBOX WAY
(the coordinator's 11/3 brief from his votes: 'need more, way more facial customization, hair options as well'; 'we need way
more hairstyles and head shapes, look how Battle Brothers does it'; 'can we make more hairstyles that I can approve of,
immediately'; 'what's up with the Chinese hats and the weird hats on these people, give them hairstyles'; 'make sure shit
doesn't clip'; 'the bright colours not so bright').

[bb Battle Brothers keeps a brother's head as three layers from one long list each: the hair, the beard, the head; its hair list
runs short, long, shaved, receding, curly, braided and bald, and age moves a man along it (grey, then receding, then bald). So
this round fills the holes in that range on our 3D head: RECEDING (WIDOW'S PEAK), AGE (SALT SKULL, HERMIT), the CHURCH's ring
(TONSURE), LONG AND BIG (WILD MANE), LONG AND SLICK (SLICK DRAPE), BRAIDS THAT ARE NOT A TIE (TEMPLE BRAIDS), the HOME CUT
(BOWL), CURLY AND SHORT (CROPPED CURLS), and three crops that read as a person (FRENCH CROP, RAZOR LINES, MANGE).]

HAIR 1's method and HAIR 2's hands, unchanged: hair is CLUMPS of three sizes combed one way, LOCKS that hang and rest, ROPES and
PLAITS, never one size of bump on a pitch (his chain-mail note); every cut on PORTRAIT's starred head on the barber's
mannequin, through DIRECTION's master rig unedited, so the walk at 1:1 and the portrait at 128 are the same head wearing the
same cut (ONE ID, ONE WHOLE PERSON; THE PORTRAIT WEARS THE HAIRCUT THE BODY IS WEARING).

    WIDOW'S PEAK   receding: the temples gone back in a deep M, a point left in the middle, short and combed back, the
                   receded corners thinning to a few hairs over skin
    TONSURE        the Church's ring: the crown shaved to a disc of skin, everything else cut short, a blunt fringe across
                   the forehead (well above the brows)
    HERMIT         bald on top, and what is left on the sides and the back grown long and thin, grey strings to the
                   shoulders, nobody to cut it for him
    WILD MANE      long, thick and wavy, standing off the head, past the shoulders, combed back off the face by hand
    BOWL CUT       a home cut round a bowl: a dome with one straight hem all the way round, across the forehead and over
                   the tops of the ears, clippered under it at the back
    CROPPED CURLS  short sides, a top of tight short curls, a few falling forward at the brow
    MANGE          a home buzz with bald patches where it fell out (stress, hunger): pale coin-sized skin through the stubble
    SALT SKULL     bald, the crown bare, grey stubble left round the sides and the back, two age spots
    TEMPLE BRAIDS  shoulder-length hair combed back loose, and two thin plaits from the temples hanging in front of the
                   shoulders (no tie: nothing is gathered, the dead tail and knot stay dead)
    SLICK DRAPE    long, wet and combed straight back from the brow, tucked behind the ears, hanging flat to the shoulders
    FRENCH CROP    clipped sides, a short textured top combed forward to a blunt straight fringe high on the forehead
    RAZOR LINES    shaved sides and back, a short crop on top cut off hard above the temples, three lines shaved over the
                   right ear

THE GRAVEYARD (A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME): no crest, no tie (ponytail, braided tail, top knot, low bun),
no mullet, no side part, no flat top, no pompadour, no chin bob, no afro by volume, no cornrows, no fade made of holes. The
temple braids are two plaits hanging free from the temples with the rest loose; nothing is gathered behind the head. The bowl
stops above the ears and is short at the back (a chin bob is a curtain to the jaw all round). The French crop's fringe is the
top combed forward, never a lifted front (the pompadour) and never a flat plane (the flat top).

THE COLOURS are steps of the style palette at the barber's rule (a dark step under the flat mid; the rig's sun and dust lift
it), MUTED (his 'not so bright'): black cloth_black 0/1, brown clay_mustard 0/1, grey tape_grey 1, sand tape_masking 1, bleach
clay_bone 2; nothing glows.

Run (Blender's Python, bpy 4.2): <venv>/bin/python tools/bohemia_character_the_barber_on_the_skull.py build HAIR3
"""
import math
import random

import bohemia_character_hair_one as H1
import bohemia_character_hair_two as H2

sstep, interp, hsh = H1.sstep, H1.interp, H1.hsh
grow_line = H2.grow_line


def _c(tag, ramp, side, front, shape, hair, worn_by, vol=0, short=False, balding=False):
    return dict(tag=tag, bank=dict(ramp=ramp, vol=vol, side=side, front=front, shape=shape), hair=hair, zcap=1.0,
                worn_by=worn_by, short=short, balding=balding)


CUTS = {
    "WIDOW'S PEAK": _c('widows_peak', 'H_BLK', 0.40, 0.10, 'receding, combed back', ('cloth_black', 1),
                       'Mob, Network, Trades; men past forty', short=True, balding=True),
    'TONSURE': _c('tonsure', 'H_BRN', 0.45, 0.30, 'shaved crown, a ring and a fringe', ('clay_mustard', 0),
                  'Church; the ones who still pray', short=True, balding=True),
    'HERMIT': _c('hermit', 'H_GRY', 1.30, 0.0, 'bald top, long thin sides', ('tape_grey', 1),
                 'Homeless, Church, Caravans; the old', balding=True),
    'WILD MANE': _c('wild_mane', 'H_BRN', 1.80, 0.20, 'long, thick, wavy', ('clay_mustard', 1),
                    'Caravans, Anarchists, Colorful, Homeless', vol=2),
    'BOWL CUT': _c('bowl_cut', 'H_SND', 0.50, 0.40, 'a home bowl cut', ('tape_masking', 1),
                   'Trades, Volunteers, Homeless; the young', vol=1, short=True),
    'CROPPED CURLS': _c('cropped_curls', 'H_BLK', 0.40, 0.18, 'short sides, curly top', ('cloth_black', 0),
                        'Reds, Blues, Cartel, Volunteers', vol=1, short=True),
    'MANGE': _c('mange', 'H_BRN', 0.40, 0.14, 'a buzz with bald patches', ('clay_mustard', 0),
                'Homeless, Remnants, Anarchists; the hungry', short=True),
    'SALT SKULL': _c('salt_skull', 'H_GRY', 0.40, 0.0, 'bald, grey stubble ring', ('tape_grey', 1),
                     'Mob, Trades, Remnants, Church; the old', short=True, balding=True),
    'TEMPLE BRAIDS': _c('temple_braids', 'H_SND', 1.40, 0.20, 'loose, two temple plaits', ('tape_masking', 1),
                        'Caravans, Colorful, Volunteers, Reds'),
    'SLICK DRAPE': _c('slick_drape', 'H_BLK', 1.40, 0.12, 'long, wet, combed back', ('cloth_black', 0),
                      'Cartel, Network, Colorful, Mob; the runway'),
    'FRENCH CROP': _c('french_crop', 'H_BLE', 0.40, 0.30, 'crop, a blunt high fringe', ('clay_bone', 2),
                      'Colorful, Network, Anarchists; the runway', short=True),
    'RAZOR LINES': _c('razor_lines', 'H_BLK', 0.40, 0.14, 'shaved sides, lines, a short top', ('cloth_black', 0),
                      'Blues, Reds, Mob, Cartel; the young', short=True),
}
ORDER = ["WIDOW'S PEAK", 'TONSURE', 'HERMIT', 'WILD MANE', 'BOWL CUT', 'CROPPED CURLS', 'MANGE', 'SALT SKULL',
         'TEMPLE BRAIDS', 'SLICK DRAPE', 'FRENCH CROP', 'RAZOR LINES']
HELD = {}   # filled from the renders' own look (all eight facings and the portrait), never by hand
CARD_ORDER = [n for n in ORDER if n not in HELD]


def build(cut, L):
    """the cut's pieces, built into the barber's live scene; returns the barber's `made` items"""
    bpy, bmesh = L['bpy'], L['bmesh']
    Vector, PM = L['Vector'], L['PM']
    C, sc, az_of = L['C'], L['sc'], L['az_of']
    skull_bm, finish, shell, paint_scalp, hair_mat, mat = L['skull_bm'], L['finish'], L['shell'], L['paint_scalp'], L['hair_mat'], L['mat']
    head, EAR = L['head'], L['EAR']
    hair_rgb, skin_rgb = L['hair_rgb'], L['skin_rgb']
    spec = CUTS[cut]; tag = spec['tag']
    made = []
    k = H1.kit(L, stretch=(3.0, 1.6) if cut in ('SLICK DRAPE', "WIDOW'S PEAK") else (1.6, 1.2))
    bvh_head, darts, three, drape, frame, lens, rope, ellipsoid, piece, hang_w, tangent, from_crown, front_to_back = (k[n] for n in (
        'bvh_head', 'darts', 'three', 'drape', 'frame', 'lens', 'rope', 'ellipsoid', 'piece', 'hang_w', 'tangent', 'from_crown', 'front_to_back'))
    step = PM.palette_step

    # ---- HAIR 2's small hands, the same code (its closures cannot be imported) --------------------------------------
    def grows(q): return q.z > grow_line(abs(az_of(q)))

    def direction(az, el): return Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))

    def on_skull(az, el, off):
        d = direction(az, el); hit = bvh_head.ray_cast(C, d, 0.5)
        return (hit[0] + d * off) if hit[0] else C + d * (0.17 + off)

    def stubble(name, zone, band, rgb, subdiv=2, lift=0.0006, mixes=(55, 38, 22)):
        """HAIR 2's stubble: the zone's faces cut finer, lifted 0.6 mm, each small face a dithered band of hair over skin"""
        mats = [mat('h3_%s_%s_hair_%d' % (tag, name, m_), tuple(round(h * m_ / 100 + s * (1 - m_ / 100)) for h, s in zip(rgb, skin_rgb)))
                for m_ in mixes]
        bm = skull_bm(); bm.verts.ensure_lookup_table()
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index in EAR or not zone(f.calc_center_median() - C)], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
        for _ in range(subdiv): bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
        bm.normal_update()
        for v in bm.verts: v.co = v.co + v.normal * lift
        bm.faces.ensure_lookup_table()
        bands = [band(f.calc_center_median() - C, f.index) for f in bm.faces]
        me = bpy.data.meshes.new('h3_%s_%s' % (tag, name)); bm.to_mesh(me); bm.free()
        for m_ in mats: me.materials.append(m_)
        me.materials.append(head.data.materials[0])
        for f, b_ in zip(me.polygons, bands): f.material_index = b_; f.use_smooth = True
        o = bpy.data.objects.new('h3_%s_%s' % (tag, name), me); sc.collection.objects.link(o)
        return o

    def flat_lens(bm, path, w0, th0, seg=10, taper=0.8):
        n_ = len(path)
        if n_ < 3: return
        rings = []
        for i, p in enumerate(path):
            t = (path[min(n_ - 1, i + 1)] - path[max(0, i - 1)]).normalized()
            r_ = (p - C).normalized(); nn = (r_ - t * r_.dot(t)).normalized(); bb = t.cross(nn).normalized()
            s_ = i / (n_ - 1)
            w = w0 * (0.75 + 0.25 * sstep(0.0, 0.12, s_)) * (1.0 - taper * sstep(0.55, 1.0, s_))
            th = th0 * (1.0 - 0.5 * sstep(0.5, 1.0, s_))
            rings.append([bm.verts.new(p + bb * (0.5 * w * math.cos(2 * math.pi * k_ / seg)) + nn * (0.5 * th * math.sin(2 * math.pi * k_ / seg)))
                          for k_ in range(seg)])
        for i in range(n_ - 1):
            for k_ in range(seg):
                bm.faces.new((rings[i][k_], rings[i][(k_ + 1) % seg], rings[i + 1][(k_ + 1) % seg], rings[i + 1][k_]))
        for ring, p in ((rings[0], path[0]), (rings[-1], path[-1])):
            c = bm.verts.new(p)
            for k_ in range(seg): bm.faces.new((ring[k_], ring[(k_ + 1) % seg], c))

    def arc(az0, el0, az1, el1, off, n=24, lift=0.0):
        d0, d1 = direction(az0, el0), direction(az1, el1)
        out = []
        for i in range(n + 1):
            t = i / n; d = d0.slerp(d1, t) if d0.angle(d1) > 1e-4 else d0
            hit = bvh_head.ray_cast(C, d.normalized(), 0.5)
            p = hit[0] if hit[0] else C + d * 0.17
            out.append(p + d.normalized() * (off + lift * math.sin(math.pi * t)))
        return out

    def spots(where, name, rgb, size=(0.0035, 0.0022)):
        """small raised blots on the skin (an age spot, a scab), each its own oval"""
        bm = bmesh.new()
        for az, el, s in where:
            p = on_skull(az, el, 0.0007); n = (p - C).normalized()
            ax = tangent(Vector((0, 0, 1)), n); ay = n.cross(ax).normalized()
            ellipsoid(bm, p, ax, ay, n, size[0] * s, size[1] * s, 0.0010, nu=8, nv=4)
        bm.normal_update()
        return finish(bm, 'h3_%s_%s' % (tag, name), mat('h3_%s_%s_skin' % (tag, name), rgb, 0.95), 0)

    def tuft_path(R, dirv, length, bend, n=7):
        return [R - dirv * 0.004 + dirv * (length * i / (n - 1)) + bend * (length * (i / (n - 1)) ** 2) for i in range(n)]

    def scalp_points(keep):
        bm_s = skull_bm()
        pts = [v.co.copy() for v in bm_s.verts if v.index not in EAR and keep(v.co - C)]
        bm_s.free()
        return pts

    def wave(path, amp, pitch, ph, grow=0.05):
        """a lock that waves as it falls: pushed side to side (across the lock) by a sine of its own length, from nothing at the
        root to full amplitude after `grow` metres, so the scalp end stays on the head"""
        out = []; s_len = 0.0
        for i, p in enumerate(path):
            if i: s_len += (path[i] - path[i - 1]).length
            t, nn, bb = frame(path, i)
            out.append(p + bb * (amp * sstep(0.0, grow, s_len) * math.sin(2 * math.pi * s_len / pitch + ph)))
        return out

    def plait(bm, path, size):
        """a plait you can count (BOX BRAIDS' segments): lens beads alternating side to side along the path"""
        res = [path[0]]; acc = 0.0
        for a_, b_ in zip(path, path[1:]):
            acc += (b_ - a_).length
            if acc >= 0.0085 * size: res.append(b_); acc = 0.0
        for j in range(len(res)):
            t, nn, bb = frame(res, j); sgn2 = 1 if j % 2 else -1
            s_ = j / max(1, len(res) - 1); sc_ = size * (1.0 - 0.35 * sstep(0.80, 1.0, s_))
            ax = (t + bb * (0.45 * sgn2)).normalized(); ay = nn.cross(ax).normalized()
            ellipsoid(bm, res[j] + bb * (0.0024 * sgn2 * size), ax, ay, nn, 0.0072 * sc_, 0.0046 * sc_, 0.0040 * sc_, nu=6, nv=4)

    def short_shell(name, keep, base, top=0.0, salt=7, comb=None, rim=0.0012, edge=0.010, floor=0.0008):
        """a short cut's shell: `base` thick, `top` more on the crown, clumped along `comb`, thinning over `edge` at its line"""
        line_of = keep
        def thick(pos, nor):
            rel = three(pos, nor, comb or from_crown, salt)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - grow_line(abs(az_of(q)))
                t = (base + top * sstep(0.05, 0.16, q.z)) * (0.45 + 0.55 * sstep(0.0, edge, above))
                out.append(max(floor, t + 0.0016 * c - 0.0006))
            return out
        return shell('barber_%s_%s' % (tag, name), line_of, thick, subdiv=2, rim=rim)

    # ================================================================== WIDOW'S PEAK
    if cut == "WIDOW'S PEAK":
        def line(q):   # the M: a point in the middle, the temples gone deep back, the corners above the ears where they were
            ab = abs(az_of(q))
            hi = interp(ab, [(0.0, 0.112), (0.10, 0.118), (0.22, 0.134), (0.38, 0.146), (0.55, 0.142), (0.70, 0.118), (0.82, 0.060)])
            return max(grow_line(ab), hi) if ab < 0.82 else grow_line(ab)
        def keep(q): return q.z > line(q)
        paint_scalp(keep)
        def back_and_down(q, n): return front_to_back(q, n) if q.z > 0.06 else tangent(Vector((0.0, 1.0, -0.35)), n)
        def thick(pos, nor):
            rel = three(pos, nor, back_and_down, 211)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                t = (0.0040 + 0.0030 * sstep(0.04, 0.15, q.z)) * (0.25 + 0.75 * sstep(0.0, 0.012, above))
                out.append(max(0.0008, t + 0.0024 * c - 0.0008))
            return out
        made.append(shell('barber_%s' % tag, keep, thick, subdiv=2, rim=0.0010))
        # the receded corners: a few hairs over the skin where the hairline used to be
        def thin_zone(q):
            ab = abs(az_of(q)); return 0.12 < ab < 0.80 and grows(q) and line(q) - 0.020 < q.z <= line(q)
        def thin_band(q, i):
            u = (line(q) - q.z) / 0.020; h = hsh(i, 213)
            return 1 if h < 0.35 * (1 - u) else (2 if h < 0.75 * (1 - u) else 3)
        made.append(stubble('thin', thin_zone, thin_band, hair_rgb))

    # ================================================================== TONSURE
    elif cut == 'TONSURE':
        CROWN = direction(math.pi, math.radians(62)).normalized()   # the crown's disc sits behind the top, where a crown turns
        def bare(q): return q.normalized().dot(CROWN) > math.cos(0.42)
        def line(q):   # the fringe: the front hairline brought down across the forehead, above the brows; the rest the head's own
            ab = abs(az_of(q)); return grow_line(ab) - 0.026 * sstep(0.78, 0.30, ab)
        def keep(q): return q.z > line(q) and not bare(q)
        paint_scalp(lambda q: keep(q) or bare(q))
        def thick(pos, nor):
            rel = three(pos, nor, from_crown, 221)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q); edge = q.normalized().dot(CROWN) - math.cos(0.42)
                t = 0.0055 * (0.70 + 0.30 * sstep(0.0, 0.006, above)) * sstep(0.0, -0.05, edge) ** 0.5
                out.append(max(0.0008, t + 0.0020 * c - 0.0006))
            return out
        made.append(shell('barber_%s' % tag, keep, thick, subdiv=2, rim=0.0016))
        made.append(stubble('disc', lambda q: bare(q), lambda q, i: 2 if hsh(i, 223) < 0.25 else 3, hair_rgb, mixes=(45, 30, 18)))

    # ================================================================== HERMIT
    elif cut == 'HERMIT':
        def top(q):   # the ring's upper edge (HAIR 2's HORSESHOE, a little lower: an older man)
            a = az_of(q); ab = abs(a)
            return interp(ab, [(0.62, 0.024), (0.95, 0.044), (1.40, 0.068), (2.10, 0.086), (2.70, 0.096), (math.pi, 0.100)]) + 0.006 * (hsh(int((a + 4) * 15), 231) - 0.5)
        def ring(q): return abs(az_of(q)) > 0.62 and grows(q) and q.z < top(q)
        paint_scalp(ring)
        def down_back(q, n): return tangent(Vector((0.0, 0.5, -1.0)), n)
        def thick(pos, nor):
            rel = three(pos, nor, down_back, 233)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; below = top(q) - q.z
                out.append(max(0.0008, 0.0045 * sstep(0.0, 0.014, below) + 0.0022 * c - 0.0008))
            return out
        made.append(shell('barber_%s_ring' % tag, ring, thick, subdiv=2, rim=0.0012))
        def thin_zone(q): return abs(az_of(q)) > 0.55 and top(q) - 0.002 <= q.z < top(q) + 0.026 and grows(q)
        def thin_band(q, i):
            u = (q.z - top(q)) / 0.026; h = hsh(i, 237)
            return 1 if h < 0.40 * (1 - u) else (2 if h < 0.80 * (1 - u) else 3)
        made.append(stubble('thin', thin_zone, thin_band, hair_rgb))
        # the long strings: thin locks rooted in the ring, hanging to the shoulders, a few straying forward over the shoulder
        bm = bmesh.new(); rng = random.Random(239)
        roots = darts(scalp_points(lambda q: ring(q) and q.z > -0.02), 0.016, 241)
        for R in roots:
            q = R - C; az = az_of(q); ab = abs(az)
            z_end = interp(ab, [(0.6, -0.17), (1.4, -0.22), (math.pi, -0.27)]) + 0.05 * (rng.random() - 0.5)
            path = drape(az, q.z, z_end, 0.007 + 0.004 * rng.random())
            if len(path) < 4: continue
            path = wave(path, 0.004, 0.08 + 0.04 * rng.random(), 6.28 * rng.random())
            lens(bm, path, 0.010 + 0.008 * rng.random(), 0.0040)
        made.append(('weighted', piece(bm, 'barber_%s_strings' % tag, subdiv=1), hang_w))

    # ================================================================== WILD MANE
    elif cut == 'WILD MANE':
        def line(q):
            ab = abs(az_of(q)); return grow_line(ab) + 0.004 * math.sin(9 * az_of(q))
        def keep(q): return q.z > line(q) - 0.004
        paint_scalp(keep)
        def back_by_hand(q, n): return tangent(Vector((0.4 if q.x >= 0 else -0.4, 1.0, -0.20)), n)
        def thick(pos, nor):
            rel = three(pos, nor, back_by_hand, 251)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                t = (0.0100 + 0.0060 * sstep(0.0, 0.16, q.z)) * (0.30 + 0.70 * sstep(0.0, 0.025, above))
                out.append(max(0.0015, t + 0.0045 * c - 0.0012))
            return out
        made.append(shell('barber_%s_cap' % tag, keep, thick, subdiv=2, rim=0.002))
        # the mane: wide wavy locks from the crown's edge and the sides, standing well off the head, past the shoulders
        bm = bmesh.new(); rng = random.Random(253)
        # cycle 2: rooted from 0.55 rad the side locks hung onto the cheeks in the portrait; from 0.90 they fall behind the cheek line
        roots = darts(scalp_points(lambda q: q.z > line(q) + 0.012 and abs(az_of(q)) > 0.90 and q.z < 0.15), 0.022, 257)
        for R in roots:
            q = R - C; az = az_of(q); ab = abs(az)
            z_end = interp(ab, [(0.55, -0.20), (1.3, -0.27), (math.pi, -0.34)]) + 0.05 * (rng.random() - 0.5)
            path = drape(az, q.z, z_end, 0.022 + 0.012 * rng.random(), dz=0.007)
            if len(path) < 4: continue
            path = wave(path, 0.010 + 0.004 * rng.random(), 0.09 + 0.03 * rng.random(), 6.28 * rng.random())
            lens(bm, path, 0.036 + 0.012 * rng.random(), 0.0090, 0.010 * rng.random())
        # the front, pushed back off the face by hand: locks from the hairline over the top and back, never over the eyes
        for i in range(9):
            u = (i + 0.5) / 9; az0 = -0.55 + 1.10 * u + 0.05 * (rng.random() - 0.5)
            p_ = arc(az0, math.radians(30), az0 * 1.6 + (0.4 if az0 >= 0 else -0.4), math.radians(55), 0.016, n=16, lift=0.010)
            lens(bm, p_, 0.032 + 0.010 * rng.random(), 0.0085)
        made.append(('weighted', piece(bm, 'barber_%s_mane' % tag, subdiv=1), hang_w))

    # ================================================================== BOWL CUT
    elif cut == 'BOWL CUT':
        def hem(q):   # one straight cut round the bowl: across the forehead, over the tops of the ears, high at the back
            ab = abs(az_of(q)); return interp(ab, [(0.0, 0.074), (0.6, 0.066), (1.2, 0.040), (1.7, 0.030), (math.pi, 0.022)])
        def bowl(q): return q.z > hem(q) and (q.z > grow_line(abs(az_of(q))) or abs(az_of(q)) < 0.80)
        def under(q): return grows(q) and q.z <= hem(q)
        paint_scalp(lambda q: bowl(q) or under(q))
        def thick(pos, nor):
            rel = three(pos, nor, from_crown, 261)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - hem(q)
                t = 0.0080 + 0.0040 * sstep(0.06, 0.16, q.z)          # a full dome, as thick at its hem (a blunt cut, not a taper)
                t *= 0.80 + 0.20 * sstep(0.0, 0.004, above)
                out.append(max(0.0020, t + 0.0026 * c - 0.0008))
            return out
        made.append(shell('barber_%s' % tag, bowl, thick, subdiv=2, rim=0.0060))
        made.append(stubble('under', under, lambda q, i: 1 if hsh(i, 263) < 0.45 else 2, hair_rgb))

    # ================================================================== CROPPED CURLS
    elif cut == 'CROPPED CURLS':
        TOP = 0.088
        paint_scalp(grows)
        def thick(pos, nor):
            rel = three(pos, nor, from_crown, 271)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - grow_line(abs(az_of(q)))
                t = (0.0030 + 0.0040 * sstep(TOP - 0.03, TOP + 0.02, q.z)) * (0.45 + 0.55 * sstep(0.0, 0.010, above))
                out.append(max(0.0008, t + 0.0018 * c - 0.0006))
            return out
        made.append(shell('barber_%s' % tag, grows, thick, subdiv=2, rim=0.0012))
        # the curls: short springs on the top, seeded at random (no rows), standing up and leaning back; the front ones fall forward
        roots = darts(scalp_points(lambda q: q.z > TOP and grows(q)), 0.014, 273)
        bm = bmesh.new(); rng = random.Random(277)
        for R in roots:
            q = R - C; n = (R - C).normalized()
            front_ = q.y < -0.05 and q.z < 0.15
            lean = tangent(Vector((0.0, -1.0, -0.6) if front_ else (0.0, 0.6, 0.3)), n)
            dirv = (n * (0.55 if front_ else 0.85) + lean * (0.75 if front_ else 0.35)).normalized()
            L_ = 0.016 + 0.010 * rng.random()
            base = [R - dirv * 0.003 + dirv * (L_ * i / 8) for i in range(9)]
            ph = 6.28 * rng.random(); rad = 0.0030 + 0.0010 * rng.random(); pitch = 0.009 + 0.003 * rng.random()
            hel = []; s_len = 0.0
            for i, p in enumerate(base):
                if i: s_len += (base[i] - base[i - 1]).length
                t, nn, bb = frame(base, i)
                a = 2 * math.pi * s_len / pitch + ph
                hel.append(p + (nn * math.cos(a) + bb * math.sin(a)) * rad * sstep(0.0, 0.006, s_len))
            rope(bm, hel, 0.0034 * (0.9 + 0.2 * rng.random()), 0.5, ph, seg=6)
        made.append(piece(bm, 'barber_%s_curls' % tag))

    # ================================================================== MANGE
    elif cut == 'MANGE':
        rng = random.Random(281)
        PATCH = []   # coin-sized patches where it fell out, never on the front hairline (a person still looks at himself)
        for az, el, r in ((2.4, 0.95, 0.20), (-1.9, 0.55, 0.16), (1.35, 0.35, 0.13), (-2.75, 0.30, 0.15), (0.55, 1.15, 0.11), (-0.9, 1.00, 0.12)):
            PATCH.append((direction(az + 0.1 * (rng.random() - 0.5), el).normalized(), r))
        def patch(q):
            u = q.normalized(); return any(u.dot(d) > math.cos(r) for d, r in PATCH)
        def hair_here(q): return grows(q) and not patch(q)
        paint_scalp(hair_here)
        made.append(short_shell('buzz', hair_here, 0.0028, 0.0006, salt=283, comb=front_to_back))
        def ring_zone(q):
            u = q.normalized(); return grows(q) and any(math.cos(r + 0.05) < u.dot(d) <= math.cos(r) for d, r in PATCH)
        made.append(stubble('patch_edges', ring_zone, lambda q, i: 1 if hsh(i, 287) < 0.30 else (2 if hsh(i, 287) < 0.70 else 3), hair_rgb))

    # ================================================================== SALT SKULL
    elif cut == 'SALT SKULL':
        def top(q):
            ab = abs(az_of(q)); return interp(ab, [(0.62, 0.030), (1.0, 0.050), (1.6, 0.075), (2.4, 0.092), (math.pi, 0.098)])
        def ring(q): return abs(az_of(q)) > 0.62 and grows(q) and q.z < top(q)
        paint_scalp(lambda q: False)
        def band(q, i):
            u = (top(q) - q.z) / 0.020; h = hsh(i, 291)
            if u < 1.0 and h > 0.75 * u: return 3
            return 0 if h < 0.30 else (1 if h < 0.75 else 2)
        made.append(stubble('salt', ring, band, hair_rgb, mixes=(70, 50, 30)))
        made.append(spots([(0.35, 1.05, 1.2), (-0.60, 0.85, 0.8), (2.6, 1.15, 1.0)], 'spots', step('clay_mustard', 1)))

    # ================================================================== TEMPLE BRAIDS
    elif cut == 'TEMPLE BRAIDS':
        def line(q):
            ab = abs(az_of(q)); return grow_line(ab) + 0.003 * math.sin(8 * az_of(q))
        def keep(q): return q.z > line(q) - 0.004
        paint_scalp(keep)
        def back(q, n): return tangent(Vector((0.25 if q.x >= 0 else -0.25, 1.0, -0.35)), n)
        def thick(pos, nor):
            rel = three(pos, nor, back, 301)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                t = (0.0060 + 0.0035 * sstep(0.0, 0.16, q.z)) * (0.30 + 0.70 * sstep(0.0, 0.025, above))
                out.append(max(0.0015, t + 0.0025 * c - 0.0008))
            return out
        made.append(shell('barber_%s_cap' % tag, keep, thick, subdiv=2, rim=0.002))
        # the loose hair: locks round the sides and the back to the shoulders (behind the ears, the plaits own the front)
        bm = bmesh.new(); rng = random.Random(303)
        roots = darts(scalp_points(lambda q: q.z > line(q) + 0.012 and abs(az_of(q)) > 1.05 and q.z < 0.13), 0.020, 307)
        for R in roots:
            q = R - C; az = az_of(q); ab = abs(az)
            z_end = interp(ab, [(1.0, -0.17), (1.6, -0.20), (math.pi, -0.25)]) + 0.03 * (rng.random() - 0.5)
            path = drape(az, q.z, z_end, 0.012 + 0.006 * rng.random())
            if len(path) < 4: continue
            lens(bm, wave(path, 0.004, 0.10, 6.28 * rng.random()), 0.034 + 0.010 * rng.random(), 0.0080, 0.004)
        made.append(('weighted', piece(bm, 'barber_%s_loose' % tag, subdiv=1), hang_w))
        # the two plaits: from each temple, down in front of the ear, over the collarbone
        bp = bmesh.new()
        for sgn in (-1, 1):
            drift = (lambda z, s=sgn: s * interp(z, [(-0.26, 1.02), (-0.05, 1.00), (0.04, 0.88), (0.08, 0.78)]))
            path = drape(sgn * 0.78, 0.075, -0.255, 0.010, drift, dz=0.006)
            plait(bp, path, 1.35)
        made.append(('weighted', piece(bp, 'barber_%s_plaits' % tag), hang_w))

    # ================================================================== SLICK DRAPE
    elif cut == 'SLICK DRAPE':
        def keep(q): return q.z > grow_line(abs(az_of(q))) - 0.002
        def back_and_down(q, n): return front_to_back(q, n) if q.z > 0.04 else tangent(Vector((0.0, 1.0, -0.5)), n)
        paint_scalp(keep)
        def thick(pos, nor):
            rel = three(pos, nor, back_and_down, 311)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - grow_line(abs(az_of(q)))
                t = (0.0035 + 0.0040 * sstep(-0.05, 0.10, q.z)) * (0.30 + 0.70 * sstep(0.0, 0.012, above))
                if q.z > 0.06: u = (q.x + 0.005 * math.sin(q.y / 0.04)) / 0.011      # the comb's grooves, front to back, uneven
                else: u = (az_of(q) * 0.16 + 0.5 * q.z) / 0.011
                g_ = max(0.0, math.cos(2 * math.pi * u)) ** 4
                out.append(max(0.0008, t - 0.0022 * g_ * sstep(0.0, 0.010, above) + 0.0022 * c - 0.0008))
            return out
        made.append(shell('barber_%s' % tag, keep, thick, subdiv=2, rim=0.0010))
        # the drape: flat wet locks from the back of the head and behind the ears, lying down the nape onto the shoulders
        bm = bmesh.new(); rng = random.Random(313)
        NL = 15
        for i in range(NL):
            u = (i + 0.5) / NL; az = 1.45 + u * (2 * math.pi - 2.90); az = az if az <= math.pi else az - 2 * math.pi
            ab = abs(az); z0 = interp(ab, [(1.4, 0.060), (2.2, 0.090), (math.pi, 0.110)])
            z_end = interp(ab, [(1.4, -0.19), (2.3, -0.22), (math.pi, -0.25)]) + 0.02 * (rng.random() - 0.5)
            path = drape(az, z0, z_end, 0.006 + 0.002 * rng.random())
            if len(path) < 4: continue
            lens(bm, path, 0.044 + 0.010 * rng.random(), 0.0065)
        made.append(('weighted', piece(bm, 'barber_%s_drape' % tag, subdiv=1), hang_w))

    # ================================================================== FRENCH CROP
    elif cut == 'FRENCH CROP':
        FR = 0.121   # the blunt fringe's line, straight across the forehead, high
        def keep(q):
            ab = abs(az_of(q)); return grows(q) and not (ab < 0.62 and q.z < FR)
        paint_scalp(keep)
        def forward(q, n): return tangent(Vector((0.0, -1.0, -0.15)), n) if q.z > 0.06 else tangent(Vector((0, 0, -1)), n)
        def thick(pos, nor):
            rel = three(pos, nor, forward, 321)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - grow_line(abs(az_of(q)))
                t = 0.0025 + 0.0070 * sstep(0.060, 0.110, q.z)              # clipped sides, the top full
                t += 0.0035 * sstep(-0.02, -0.12, q.y) * sstep(0.08, 0.12, q.z)   # the top combed forward gathers at the fringe
                t *= 0.45 + 0.55 * sstep(0.0, 0.010, above)
                out.append(max(0.0008, t + 0.0026 * c - 0.0008))
            return out
        # cycle 2: eleven forward tufts on the fringe read, lit from above, as a row of dark stitches across the brow; the
        # shell's own blunt edge (its rim) is the fringe, the clumps combed forward its texture
        made.append(shell('barber_%s' % tag, keep, thick, subdiv=2, rim=0.0030))

    # ================================================================== RAZOR LINES
    elif cut == 'RAZOR LINES':
        HARD = 0.090   # the top cut off hard above the temples
        def top(q): return grows(q) and q.z > HARD + 0.010 * sstep(1.2, 2.6, abs(az_of(q)))
        def lines_(q):   # three lines shaved through the stubble over the right ear, sweeping back and up
            if q.x >= 0.0: return False
            for j in range(3):
                u = q.z - (0.010 + 0.020 * j) - 0.22 * (q.y - 0.0)
                if abs(u) < 0.0022 and -0.06 < q.y < 0.07: return True
            return False
        def sides(q): return grows(q) and not top(q) and not lines_(q)
        paint_scalp(lambda q: grows(q))
        # cycle 2: an even 7 mm top with a hard rim over pale sides read as a knit cap; the top now thins to its line and the
        # clumps show, and the shave is darker (fresh clipper shadow), so it reads as one head of hair cut two lengths
        def thick(pos, nor):
            rel = three(pos, nor, front_to_back, 331)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; edge = q.z - (HARD + 0.010 * sstep(1.2, 2.6, abs(az_of(q))))
                t = (0.0015 + 0.0045 * sstep(0.0, 0.030, edge)) + 0.0032 * c - 0.0010
                out.append(max(0.0008, t))
            return out
        made.append(shell('barber_%s_top' % tag, top, thick, subdiv=2, rim=0.0010))
        made.append(stubble('sides', sides, lambda q, i: 0 if hsh(i, 333) < 0.45 else (1 if hsh(i, 333) < 0.90 else 2), hair_rgb, mixes=(72, 58, 44)))

    return made
