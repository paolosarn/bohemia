#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [way more hair and faces], HAIR 2: TWELVE NEW CUTS ON THE STARRED HEAD, THE GRIMY CRASHBOX WAY
(rule 121(i) and (k); his 10/19: 'need way more facial customization, hair options as well'; 'give them hairstyles...
the whole enchilada'; 'what's up with the Chinese hats and the weird hats on these people'; hair before hats).

HAIR 1 (his YES, character-hair-one-clumps-not-links-10-19) proved the method: hair is CLUMPS of three sizes combed one
way, LOCKS that hang and rest, ROPES and PLAITS, never one size of bump on a pitch (his chain-mail note). Every cut here
is built from HAIR 1's own kit (tools/bohemia_character_hair_one.py kit(), the same hands), on PORTRAIT's starred head on
the barber's mannequin, through DIRECTION's rig unedited. What is new is the SILHOUETTE: twelve heads the game has never
drawn, picked for a city after the money died, where a haircut is what you can do with what you have:

    RAZOR SKULL    shaved to the skin, a stubble shadow, two shaving nicks scabbed over
    HOME CLIPPERS  a buzz done at home in a cracked mirror: a blunt neckline, one gouge too close, tufts missed at the back
    HORSESHOE      the crown gone bald, a grey ring left round the sides and the back, thinning at its top edge
    COMB OVER      the horseshoe dyed black, nine long strands combed across the bald crown from a low part, skin between
    GREASE BACK    combed straight back from the brow in long wet ridges, the ends flicked at the nape
    LONG DROP      straight hair parted in the middle, hanging past the shoulders to the shoulder blades, two face curtains
    SPRING CURLS   auburn ringlets, each a spiral of clay, hanging to the jaw and the collar, a curl over the brow
    STATIC         bed head: short tufts standing every way, flattened on the side he sleeps on, dust in it
    HALF SHAVE     one side clippered to dark roots, the rest bleached and swept over the top to the jaw
    BOX BRAIDS     fifty-odd braids from parted sections, each a plait you can count, hanging past the shoulders
    FINGER WAVES   pressed S-waves from a side part, a flat pin curl at each temple (the runway's)
    SCORCH         a short crop with a burn scar over one ear where nothing grows back, waxy and mottled

THE GRAVEYARD (A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME): no crest (mohawk, liberty spikes, high top), no tie
(ponytail, braided tail, top knot, low bun), no mullet, no side part, no flat top, no pompadour, no chin bob: every
permanent kill stays dead. The four round-4 slots these touch (BUZZ CUT, SLICK BACK, LONG LOOSE, the curl slot) were
killed for one render defect, the east and west facings, and the records say a fresh cook answers them once those
facings render true; the rig renders all eight from one model, so these are fresh cooks under fresh names.

THE COLOURS are steps of the style palette, at the barber's rule (a dark step under the flat mid; the rig's sun and dust
lift it): black cloth_black 0/1, brown clay_mustard 0/1, grey tape_grey 1, sand tape_masking 1, auburn clay_rust 1,
bleach clay_bone 2. The scars and scabs are skin and rust steps of the same palette. Nothing glows.

Run (Blender's Python, bpy 4.2): <venv>/bin/python tools/bohemia_character_the_barber_on_the_skull.py build HAIR2
"""
import math
import random

import bohemia_character_hair_one as H1

H_BLK = ('cloth_black', 0)
CUTS = {
    'RAZOR SKULL': dict(tag='razor_skull', bank=dict(ramp='H_BLK', vol=0, side=0.0, front=0.0, shape='shaved'), hair=H_BLK, zcap=1.0,
                        worn_by='Mob, Remnants, Network; the cooks and the guards'),
    'HOME CLIPPERS': dict(tag='home_clippers', bank=dict(ramp='H_BRN', vol=0, side=0.40, front=0.14, shape='buzz, home cut'), hair=('clay_mustard', 0), zcap=1.0,
                          worn_by='Trades, Homeless, Volunteers; the young'),
    'HORSESHOE': dict(tag='horseshoe', bank=dict(ramp='H_GRY', vol=0, side=0.60, front=0.0, shape='bald crown, a ring'), hair=('tape_grey', 1), zcap=1.0,
                      worn_by='Trades, Church, Caravans; the old'),
    'COMB OVER': dict(tag='comb_over', bank=dict(ramp='H_BLK', vol=0, side=0.60, front=0.0, shape='bald crown, strands across'), hair=('cloth_black', 1), zcap=1.0,
                      worn_by='Network, Church; the old who still try'),
    'GREASE BACK': dict(tag='grease_back', bank=dict(ramp='H_BLK', vol=1, side=0.70, front=0.12, shape='combed back'), hair=('cloth_black', 1), zcap=0.3,
                        worn_by='Mob, Cartel, Network'),
    'LONG DROP': dict(tag='long_drop', bank=dict(ramp='H_BRN', vol=0, side=2.10, front=0.26, shape='long, centre part'), hair=('clay_mustard', 1), zcap=1.0,
                      worn_by='Colorful, Anarchists, Caravans, Church'),
    'SPRING CURLS': dict(tag='spring_curls', bank=dict(ramp='H_AUB', vol=1, side=1.10, front=0.22, shape='ringlets'), hair=('clay_rust', 1), zcap=1.0,
                         worn_by='Colorful, Caravans, Reds'),
    'STATIC': dict(tag='static', bank=dict(ramp='H_SND', vol=1, side=0.55, front=0.20, shape='bed head'), hair=('tape_masking', 1), zcap=1.0,
                   worn_by='Homeless, Anarchists, Volunteers'),
    'HALF SHAVE': dict(tag='half_shave', bank=dict(ramp='H_BLE', vol=1, side=1.00, front=0.22, shape='one side shaved'), hair=('clay_bone', 2), zcap=1.0,
                       worn_by='Anarchists, Colorful, Blues'),
    'BOX BRAIDS': dict(tag='box_braids', bank=dict(ramp='H_BRN', vol=0, side=1.90, front=0.20, shape='braids'), hair=('clay_mustard', 1), zcap=1.0,
                       worn_by='Reds, Blues, Caravans, Colorful'),
    'FINGER WAVES': dict(tag='finger_waves', bank=dict(ramp='H_BLK', vol=0, side=0.70, front=0.30, shape='pressed waves'), hair=H_BLK, zcap=0.3,
                         worn_by='Colorful, Cartel, Network; the runway'),
    'SCORCH': dict(tag='scorch', bank=dict(ramp='H_BRN', vol=0, side=0.45, front=0.16, shape='crop, a burn scar'), hair=('clay_mustard', 0), zcap=1.0,
                   worn_by='Remnants, Mob, Trades; anyone the fire caught'),
}
ORDER = ['RAZOR SKULL', 'HOME CLIPPERS', 'HORSESHOE', 'COMB OVER', 'GREASE BACK', 'LONG DROP', 'SPRING CURLS', 'STATIC',
         'HALF SHAVE', 'BOX BRAIDS', 'FINGER WAVES', 'SCORCH']
HELD = {}   # filled from the guide's first five after the renders (rule 114b), never by hand
CARD_ORDER = [n for n in ORDER if n not in HELD]

sstep, interp, hsh = H1.sstep, H1.interp, H1.hsh


def grow_line(ab):
    """where hair grows on this skull, by azimuth from the front (0) to the back (pi): the brow, the temple corner, the
    sideburn in front of the ear, behind the ear, the nape (the barber's tapers and HAIR 1's nape, joined)"""
    return interp(ab, [(0.0, 0.106), (0.45, 0.102), (0.62, 0.080), (0.70, 0.040), (0.80, 0.008), (1.2, -0.035),
                       (1.9, -0.070), (math.pi, -0.085)])


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
    k = H1.kit(L, stretch=(3.0, 1.6) if cut == 'GREASE BACK' else (1.6, 1.2))
    bvh_head, darts, three, drape, frame, lens, rope, ellipsoid, piece, hang_w, nape, tangent, from_crown, front_to_back = (k[n] for n in (
        'bvh_head', 'darts', 'three', 'drape', 'frame', 'lens', 'rope', 'ellipsoid', 'piece', 'hang_w', 'nape', 'tangent', 'from_crown', 'front_to_back'))
    step = PM.palette_step

    def grows(q): return q.z > grow_line(abs(az_of(q)))

    def direction(az, el): return Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))

    def on_skull(az, el, off):
        """the skull's surface seen from its centre at (azimuth, elevation), stood off it by off along the same ray"""
        d = direction(az, el); hit = bvh_head.ray_cast(C, d, 0.5)
        return (hit[0] + d * off) if hit[0] else C + d * (0.17 + off)

    def el_of(q): return math.atan2(q.z, math.hypot(q.x, q.y))

    def stubble(name, zone, band, rgb, subdiv=2, lift=0.0006, mixes=(55, 38, 22)):
        """THE BARBER'S FADE AS STUBBLE (fade_skin), with its own stubble colour (a bleached head grows dark roots): the
        zone's faces cut four times finer and lifted 0.6 mm, every small face the band its dithered depth lands in, the
        last band the face's own skin"""
        mats = [mat('h2_%s_%s_hair_%d' % (tag, name, m_),   # 'hair' in the name: the rig's wear_by_material reads it as hair, not paint
                 tuple(round(h * m_ / 100 + s * (1 - m_ / 100)) for h, s in zip(rgb, skin_rgb))) for m_ in mixes]
        bm = skull_bm(); bm.verts.ensure_lookup_table()
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index in EAR or not zone(f.calc_center_median() - C)], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
        for _ in range(subdiv): bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
        bm.normal_update()
        for v in bm.verts: v.co = v.co + v.normal * lift
        bm.faces.ensure_lookup_table()
        bands = [band(f.calc_center_median() - C, f.index) for f in bm.faces]
        me = bpy.data.meshes.new('h2_%s_%s' % (tag, name)); bm.to_mesh(me); bm.free()
        for m_ in mats: me.materials.append(m_)
        me.materials.append(head.data.materials[0])
        for f, b_ in zip(me.polygons, bands): f.material_index = b_; f.use_smooth = True
        o = bpy.data.objects.new('h2_%s_%s' % (tag, name), me); sc.collection.objects.link(o)
        return o

    def flat_lens(bm, path, w0, th0, seg=10, taper=0.8):
        """a strand lying ON the skull: a flat lens whose thin side faces out from the head's centre (HAIR 1's lens stands
        its width up the head; a strand combed over the crown lies down)"""
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
        """a path over the skull from one point to another along the great circle between them, stood off it"""
        d0, d1 = direction(az0, el0), direction(az1, el1)
        out = []
        for i in range(n + 1):
            t = i / n; d = d0.slerp(d1, t) if d0.angle(d1) > 1e-4 else d0
            hit = bvh_head.ray_cast(C, d.normalized(), 0.5)
            p = hit[0] if hit[0] else C + d * 0.17
            out.append(p + d.normalized() * (off + lift * math.sin(math.pi * t)))
        return out

    def scabs(spots, name='scabs'):
        """a shaving nick, scabbed: a small raised blot of dried blood (clay_rust 0) on the skin"""
        bm = bmesh.new()
        for az, el, a, b in spots:
            p = on_skull(az, el, 0.0007); n = (p - C).normalized()
            ax = tangent(Vector((0, 0, 1)), n); ay = n.cross(ax).normalized()
            ellipsoid(bm, p, ax, ay, n, a, b, 0.0012, nu=8, nv=4)
        bm.normal_update()
        return finish(bm, 'h2_%s_%s' % (tag, name), mat('h2_%s_skin_scab' % tag, step('clay_rust', 0), 0.95), 0)

    def tuft_path(R, dirv, length, bend, n=7):
        """a short tuft: from 4 mm inside the scalp along dirv, bending by bend (a vector) toward its tip"""
        return [R - dirv * 0.004 + dirv * (length * i / (n - 1)) + bend * (length * (i / (n - 1)) ** 2) for i in range(n)]

    def scalp_points(keep, inset=0.006):
        bm_s = skull_bm()
        pts = [v.co.copy() for v in bm_s.verts if v.index not in EAR and keep(v.co - C)]
        bm_s.free()
        return pts

    # ================================================================== RAZOR SKULL
    if cut == 'RAZOR SKULL':
        paint_scalp(lambda q: False)   # the skin is the head's own; the hair is only its shadow
        def zone(q): return grows(q)
        def band(q, i):
            edge = q.z - grow_line(abs(az_of(q)))
            h = hsh(i, 71)
            if edge < 0.012 and h < 0.55 * (1 - edge / 0.012): return 3        # the shadow thins out at its edge
            return 1 if h < 0.22 else (2 if h < 0.80 else 3)                     # a 1 mm shadow, dithered, never one flat grey
        made.append(stubble('shadow', zone, band, hair_rgb, mixes=(48, 34, 20)))
        made.append(scabs([(0.55, 0.95, 0.0035, 0.0022), (-2.2, 0.55, 0.0030, 0.0020), (-1.35, 0.30, 0.0040, 0.0018)]))

    # ================================================================== HOME CLIPPERS
    elif cut == 'HOME CLIPPERS':
        def ragged(q):   # a blunt neckline cut by feel, never a line
            a = az_of(q); return grow_line(abs(a)) + 0.005 * (hsh(int((a + 4) * 22), 81) - 0.5) + 0.010 * sstep(1.6, 2.6, abs(a))
        def gouge(q):    # one pass too close on the right side, from the temple back and down
            if q.x <= 0.0: return False
            u = q.y + 0.55 * (q.z - 0.06)
            return abs(u - 0.010) < 0.007 and q.z > ragged(q) and q.z < 0.12
        def hair_here(q): return q.z > ragged(q) and not gouge(q)
        paint_scalp(hair_here)
        def thick(pos, nor):
            rel = three(pos, nor, front_to_back, 83)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - ragged(q)
                t = (0.0030 + 0.0012 * sstep(0.04, 0.15, q.z)) * (0.55 + 0.45 * sstep(0.0, 0.006, above))
                out.append(max(0.0008, t + 0.0016 * c - 0.0006))
            return out
        made.append(shell('barber_%s' % tag, hair_here, thick, subdiv=2, rim=0.0010))
        made.append(stubble('gouge', lambda q: gouge(q) or (q.x > 0 and abs(q.y + 0.55 * (q.z - 0.06) - 0.010) < 0.010 and grows(q) and q.z < 0.12 and not hair_here(q)),
                            lambda q, i: 1 if hsh(i, 87) < 0.5 else 2, hair_rgb))
        # the tufts he missed at the back, where nobody sees themselves in a mirror
        bm = bmesh.new(); rng = random.Random(89)
        for az, el, L_ in ((2.55, 0.62, 0.024), (-2.85, 0.42, 0.020), (2.15, 0.30, 0.017), (-2.35, 0.78, 0.026), (2.9, 0.15, 0.015)):
            R = on_skull(az, el, 0.0); n = (R - C).normalized()
            side = tangent(Vector((rng.random() - 0.5, rng.random() - 0.5, -0.4)), n)
            lens(bm, tuft_path(R, (n * 0.75 + side * 0.65).normalized(), L_, side * 0.25 - n * 0.10), 0.010 + 0.004 * rng.random(), 0.0040)
        made.append(piece(bm, 'barber_%s_missed' % tag, subdiv=1))
        made.append(scabs([(1.05, 0.35, 0.0030, 0.0018)]))

    # ================================================================== HORSESHOE and COMB OVER
    elif cut in ('HORSESHOE', 'COMB OVER'):
        over = cut == 'COMB OVER'
        def top(q):   # the ring's upper edge: low at the temples, highest at the back of the crown, ragged where it thins
            a = az_of(q); ab = abs(a)
            return interp(ab, [(0.62, 0.030), (0.95, 0.052), (1.40, 0.078), (2.10, 0.096), (2.70, 0.106), (math.pi, 0.110)]) + 0.006 * (hsh(int((a + 4) * 15), 91) - 0.5)
        def ring(q): return abs(az_of(q)) > 0.62 and grows(q) and q.z < top(q)
        paint_scalp(ring)
        def down_back(q, n): return tangent(Vector((0.0, 0.6, -1.0)), n)
        def thick(pos, nor):
            rel = three(pos, nor, down_back, 93)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; below = top(q) - q.z; above = q.z - grow_line(abs(az_of(q)))
                t = (0.0050 + (0.0025 if over else 0.0)) * sstep(0.0, 0.016, below) * (0.45 + 0.55 * sstep(0.0, 0.010, above))
                out.append(max(0.0008, t + 0.0024 * c - 0.0008))
            return out
        made.append(shell('barber_%s_ring' % tag, ring, thick, subdiv=2, rim=0.0012))
        # where it thins: sparse hairs over the skin above the ring's edge
        def thin_zone(q): return abs(az_of(q)) > 0.55 and top(q) - 0.002 <= q.z < top(q) + 0.024 and grows(q)
        def thin_band(q, i):
            u = (q.z - top(q)) / 0.024; h = hsh(i, 97)
            return 1 if h < 0.45 * (1 - u) else (2 if h < 0.85 * (1 - u) else 3)
        made.append(stubble('thin', thin_zone, thin_band, hair_rgb))
        if over:
            # seven long strands combed from a low part over the left ear across the bald crown toward the right side, lying
            # flat with skin between them: uneven widths, uneven gaps, two that fall short (cycle 1: nine even strands on an
            # even pitch read as a striped cap, the one-size-on-a-pitch tell his chain-mail note names)
            bm = bmesh.new(); rng = random.Random(103)
            gaps = [0.0, 0.21, 0.36, 0.60, 0.74, 0.97, 1.15]
            for i, g_ in enumerate(gaps):
                az0 = -1.20 - g_ + 0.04 * (rng.random() - 0.5); el0 = math.radians(16 + 9 * g_ + 3 * rng.random())
                short = i in (2, 5)
                az1 = (0.35 + 0.25 * rng.random()) if short else (1.05 + 0.35 * g_ + 0.10 * rng.random())
                el1 = math.radians((55 if short else 22) + 6 * (rng.random() - 0.5))
                path = arc(az0, el0, az1, el1, 0.0024, n=28, lift=0.0020)
                flat_lens(bm, path, 0.0060 + 0.0050 * rng.random(), 0.0022, taper=0.85)
            made.append(piece(bm, 'barber_%s_strands' % tag, subdiv=1))

    # ================================================================== GREASE BACK
    elif cut == 'GREASE BACK':
        # cycle 2: on the natural hairline with an even 4 to 10 mm shell it read as a black helmet with a fringe; a slick
        # back sits HIGH (the temples receded, the brow bare) and shows the comb: grooves front to back, uneven, deep
        def line(q):
            ab = abs(az_of(q)); hi = interp(ab, [(0.0, 0.118), (0.30, 0.114), (0.52, 0.096), (0.64, 0.090), (0.74, 0.040)]) if ab < 0.74 else -1.0
            return max(grow_line(ab), hi)
        def back_and_down(q, n): return front_to_back(q, n) if q.z > 0.06 else tangent(Vector((0.0, 1.0, -0.25)), n)
        paint_scalp(lambda q: q.z > line(q))
        def thick(pos, nor):
            rel = three(pos, nor, back_and_down, 111)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q); ab = abs(az_of(q))
                t = 0.0035 + 0.0055 * sstep(0.02, 0.15, q.z) + 0.0030 * sstep(1.2, 2.6, ab) * sstep(-0.08, 0.04, q.z)   # flat on top, full at the back
                t += 0.0040 * sstep(-0.05, -0.13, q.y) * sstep(0.090, 0.130, q.z)   # the brow swept up and back, low (a lift, never a pompadour)
                t *= 0.15 + 0.85 * sstep(0.0, 0.014, above)
                # THE COMB: grooves running front to back (on the top across x, on the sides round the head), 9 to 15 mm
                # apart by a slow wobble, each its own depth along its length, so no two read alike
                if q.z > 0.07: u = (q.x + 0.006 * math.sin(q.y / 0.035)) / (0.012 + 0.003 * math.sin(q.y / 0.05 + 1.0))
                else: u = (az_of(q) * 0.16 + 0.5 * q.z) / 0.012
                dep = 0.0030 * (0.5 + PM.vnoise(round(u), q.y / 0.04, q.z / 0.04, 17))
                g_ = max(0.0, math.cos(2 * math.pi * u)) ** 4
                out.append(max(0.0008, t - dep * g_ * sstep(0.0, 0.010, above) + 0.0030 * c - 0.0012))
            return out
        made.append(shell('barber_%s' % tag, lambda q: q.z > line(q), thick, subdiv=2, rim=0.0010))
        bm = bmesh.new(); rng = random.Random(113)
        for i in range(9):   # the ends flick out at the nape
            az = 2.05 + (2 * math.pi - 4.1) * (i + 0.5) / 9; az = az if az <= math.pi else az - 2 * math.pi
            z0 = grow_line(abs(az)) + 0.030
            lens(bm, drape(az, z0, z0 - 0.034 - 0.010 * rng.random(), 0.006), 0.024 + 0.006 * rng.random(), 0.0060, 0.006)
        made.append(piece(bm, 'barber_%s_ends' % tag, subdiv=1))

    # ================================================================== LONG DROP
    elif cut == 'LONG DROP':
        def line(q):
            ab = abs(az_of(q)); j = 0.003 * math.sin(8.0 * az_of(q) + 0.4)
            return interp(ab, [(0.0, 0.102), (0.30, 0.096), (0.60, 0.066), (0.90, 0.022), (1.25, -0.045), (1.70, -0.085), (math.pi, -0.100)]) + j
        def away_from_part(q, n): return tangent(Vector((1.0 if q.x >= 0 else -1.0, 0.12, -0.55)), n)
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        def thick(pos, nor):
            rel = three(pos, nor, away_from_part, 121)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                t = (0.0060 + 0.0035 * sstep(0.0, 0.16, q.z)) * (0.25 + 0.75 * sstep(0.0, 0.030, above))
                part = math.exp(-(q.x / 0.0040) ** 2) * sstep(0.05, -0.03, q.y) * sstep(0.08, 0.12, q.z)
                out.append(max(0.0015, t - 0.0045 * part + 0.0022 * c - 0.0008))
            return out
        made.append(shell('barber_%s_cap' % tag, lambda q: q.z > line(q) - 0.004, thick, subdiv=2, rim=0.002))
        # THE DROP, ONE CURTAIN cut to a pattern (the barber's LAYERED FALL rule): columns round the back from temple to
        # temple, down the skull at their offset, then hanging, never back in; at the sides they rest on the shoulder and
        # end, at the back they fall over the upper back (held off it) to the shoulder blades, a straight blunt hem
        bvh_body = k['bvh_body']; skull_r = k['skull_r']
        def hem_at(ab): return interp(ab, [(0.90, -0.200), (1.40, -0.250), (2.10, -0.360), (math.pi, -0.420)])
        NCOL, DZ = 76, 0.008
        cols = []
        for j in range(NCOL + 1):
            u = j / NCOL; az = 0.92 + u * (2 * math.pi - 1.84); azs = az if az <= math.pi else az - 2 * math.pi
            ab = abs(azs); d = Vector((math.sin(az), -math.cos(az), 0.0))
            hem = hem_at(ab) + 0.010 * (hsh(j, 123) - 0.5)
            col = []; r_max = 0.0; z = 0.060 - 0.03 * sstep(1.4, 0.92, ab); hung = False
            while z > hem - 1e-6:
                r = skull_r(azs, z); top_ = sstep(0.060, 0.010, z)
                r = (r + 0.007 + 0.014 * top_) if r else r_max
                if r >= r_max and not hung: r_max = r
                else: hung = True; r_max = r = r_max + 0.06 * 0.35 * DZ
                ridge = 0.0035 * math.cos(2 * math.pi * u * 17 + 0.7) + 0.0020 * math.sin(2 * math.pi * (z / 0.13) + 7.0 * u) * sstep(0.0, -0.10, z)
                p = C + Vector((0, 0, z)) + d * (r + ridge)
                if z < -0.12 and len(col) > 6:
                    loc, nrm, _, _ = bvh_body.find_nearest(p)
                    if loc is not None and (p - loc).dot(nrm) < 0.014:
                        if ab < 2.0: break                                   # it rests on the shoulder and ends
                        p = loc + nrm * 0.014                                # it falls over the back, held off it
                        rr = Vector((p.x - C.x, p.y - C.y, 0.0)).length; r_max = max(r_max, rr)
                col.append(p); z -= DZ
            cols.append(col)
        for j in range(NCOL + 1):   # the blunt hem turns under 1 cm
            n_ = len(cols[j])
            for i in range(n_):
                uu = max(0.0, (i - (n_ - 3)) / 2.0)
                h = Vector((cols[j][i].x - C.x, cols[j][i].y - C.y, 0.0)).normalized()
                cols[j][i] = cols[j][i] - h * (0.004 * uu * uu)
        cb = bmesh.new(); vs = [[cb.verts.new(p) for p in col] for col in cols]
        for j in range(NCOL):
            n_ = min(len(vs[j]), len(vs[j + 1]))
            for i in range(n_ - 1): cb.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
        bmesh.ops.delete(cb, geom=[v for v in cb.verts if not v.link_faces], context='VERTS')
        bmesh.ops.recalc_face_normals(cb, faces=cb.faces[:])
        if sum(((f.calc_center_median() - C) * Vector((1, 1, 0))).dot(f.normal) for f in cb.faces) < 0: bmesh.ops.reverse_faces(cb, faces=cb.faces[:])
        curtain = finish(cb, 'barber_%s_curtain' % tag, hair_mat, 0.009)
        ss = curtain.modifiers.new('ss', 'SUBSURF'); ss.levels = 1; ss.render_levels = 1
        bpy.context.view_layer.objects.active = curtain
        for x in sc.objects: x.select_set(x is curtain)
        bpy.ops.object.modifier_apply(modifier='ss')
        for f in curtain.data.polygons: f.use_smooth = True
        made.append(('weighted', curtain, hang_w))
        # the face's two curtains each side: from the part, over the temple, down in front of the ear to the collar
        bm = bmesh.new()
        for sgn in (-1, 1):
            for kk, (to, ze, w) in enumerate(((0.92, -0.170, 0.046), (1.10, -0.205, 0.050))):
                drift = (lambda z, s=sgn, to=to: s * interp(z, [(-0.20, to), (0.05, to * 0.92), (0.12, 0.12), (0.15, 0.04)]))
                lens(bm, drape(sgn * 0.04, 0.148 - 0.006 * kk, ze, 0.016 + 0.004 * kk, drift), w, 0.011, -0.002)
        made.append(('weighted', piece(bm, 'barber_%s_front' % tag, subdiv=1), hang_w))

    # ================================================================== SPRING CURLS
    elif cut == 'SPRING CURLS':
        def line(q):
            ab = abs(az_of(q)); return interp(ab, [(0.0, 0.100), (0.45, 0.096), (0.75, 0.045), (1.10, -0.010), (1.6, -0.050), (math.pi, -0.075)])
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        def thick(pos, nor):
            rel = three(pos, nor, from_crown, 131)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                t = (0.0060 + 0.0060 * sstep(0.0, 0.16, q.z)) * (0.35 + 0.65 * sstep(0.0, 0.020, above))
                out.append(max(0.0015, t + 0.0030 * c - 0.0010))
            return out
        made.append(shell('barber_%s_cap' % tag, lambda q: q.z > line(q) - 0.004, thick, subdiv=2, rim=0.002))
        roots = darts(scalp_points(lambda q: q.z > line(q) + 0.010), 0.024, 133)
        bm = bmesh.new(); rng = random.Random(137)
        for R in roots:
            q = R - C; az = az_of(q); ab = abs(az); z0 = q.z
            if ab < 0.7 and z0 > 0.07: z_end = z0 - 0.040 - 0.020 * rng.random()                 # a curl over the brow
            else: z_end = interp(ab, [(0.7, -0.060), (1.3, -0.120), (math.pi, -0.180)]) + 0.040 * (rng.random() - 0.5)
            sgn = 1.0 if az >= 0 else -1.0; to = max(ab, 0.9)
            drift = (lambda z, a0=az, s=sgn, to=to, z0=z0: a0 + (s * to - a0) * sstep(z0, z0 - 0.07, z)) if ab < to and z_end < 0.0 else None
            base = drape(az, z0, min(z_end, z0 - 0.03), 0.014 + 0.006 * rng.random(), drift, dz=0.004)
            if len(base) < 4: continue
            ph = 6.28 * rng.random(); pitch = 0.017 + 0.006 * rng.random(); rad = 0.0050 + 0.0015 * rng.random()
            hel = []; s_len = 0.0
            for i, p in enumerate(base):
                if i: s_len += (base[i] - base[i - 1]).length
                t, nn, bb = frame(base, i); grow_ = sstep(0.0, 0.03, s_len)
                a = 2 * math.pi * s_len / pitch + ph
                hel.append(p + (nn * math.cos(a) + bb * math.sin(a)) * rad * grow_)
            rope(bm, hel, 0.0040 * (0.9 + 0.2 * rng.random()), 0.5, ph, seg=7)
        made.append(('weighted', piece(bm, 'barber_%s_ringlets' % tag), hang_w))

    # ================================================================== STATIC
    elif cut == 'STATIC':
        def line(q):
            ab = abs(az_of(q)); return grow_line(ab) + 0.010 * sstep(0.5, 0.0, ab) + 0.004 * math.sin(11 * az_of(q))
        paint_scalp(lambda q: q.z > line(q) - 0.003)
        def thick(pos, nor):
            rel = three(pos, nor, from_crown, 141)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                t = (0.0060 + 0.0040 * sstep(0.0, 0.15, q.z)) * (0.40 + 0.60 * sstep(0.0, 0.015, above))
                t *= 1.0 - 0.45 * sstep(-0.02, -0.10, q.x)   # flattened on the side he sleeps on
                out.append(max(0.0012, t + 0.0035 * c - 0.0012))
            return out
        made.append(shell('barber_%s_cap' % tag, lambda q: q.z > line(q) - 0.003, thick, subdiv=2, rim=0.0015))
        # cycle 2: 18 to 38 mm tufts 20 mm apart read at 1:1 as a fuzzy cap, not bed head; fewer, longer, wider, wilder
        roots = darts(scalp_points(lambda q: q.z > line(q) + 0.012), 0.027, 143)
        bm = bmesh.new(); rng = random.Random(149)
        for R in roots:
            q = R - C; n = (R - C).normalized()
            flat = sstep(-0.02, -0.10, q.x)                                  # the slept-on side lies down, up and back
            t1 = tangent(Vector((rng.random() - 0.5, rng.random() - 0.5, rng.random() - 0.5)), n)
            lie = tangent(Vector((0.3, 0.7, 0.8)), n)
            dirv = (n * (0.75 - 0.55 * flat) + t1 * (0.70 - 0.3 * flat) + lie * (1.2 * flat)).normalized()
            L_ = (0.030 + 0.028 * rng.random()) * (1.0 - 0.35 * flat) * (0.70 if q.y < -0.06 else 1.0)
            bend = (tangent(Vector((0, 0, -1)), dirv) * 0.30 + t1 * (0.35 * (rng.random() - 0.5)))
            lens(bm, tuft_path(R, dirv, L_, bend), 0.016 + 0.008 * rng.random(), 0.0060)
        made.append(piece(bm, 'barber_%s_tufts' % tag, subdiv=1))

    # ================================================================== HALF SHAVE
    elif cut == 'HALF SHAVE':
        XP = -0.040   # the hard line, 4 cm off the middle on the person's right
        def shaved(q): return q.x < XP and grows(q)
        def long_(q): return q.x >= XP and grows(q)
        paint_scalp(long_)
        made.append(stubble('roots', shaved, lambda q, i: 1 if hsh(i, 151) < 0.35 else (2 if hsh(i, 151) < 0.85 else 3), step('cloth_black', 1)))
        def over(q, n): return tangent(Vector((1.0, 0.25, -0.45)), n)
        def thick(pos, nor):
            rel = three(pos, nor, over, 153)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - grow_line(abs(az_of(q)))
                t = 0.0050 + 0.0070 * sstep(0.02, 0.15, q.z) + 0.0040 * sstep(XP, XP + 0.03, q.x) * sstep(0.04, 0.13, q.z)
                t *= (0.45 + 0.55 * sstep(0.0, 0.015, above)) * sstep(XP - 0.001, XP + 0.004, q.x)   # a hard line at the shave
                out.append(max(0.0012, t + 0.0030 * c - 0.0010))
            return out
        made.append(shell('barber_%s_cap' % tag, lambda q: long_(q) and q.x > XP + 0.0005, thick, subdiv=2, rim=0.0020))
        # the sweep: locks rooted along the hard line, over the top, falling down the far side to the jaw
        bm = bmesh.new(); rng = random.Random(157)
        for i in range(13):
            u = (i + 0.5) / 13; psi = math.radians(25 + 125 * u)   # roots along the hard line, from the brow over the top to the crown
            d0 = Vector((XP / 0.16, -math.cos(psi), math.sin(psi))).normalized()
            hit = bvh_head.ray_cast(C, d0, 0.5); R = hit[0] if hit[0] else C + d0 * 0.17
            q0 = R - C; az_side = 1.25 + 0.9 * u + 0.15 * (rng.random() - 0.5)
            top_ = arc(az_of(q0), el_of(q0), az_side, math.radians(10 + 8 * rng.random()), 0.012 + 0.006 * rng.random(), n=18, lift=0.008)
            q1 = top_[-1] - C
            fall = drape(az_side, q1.z, -0.085 - 0.035 * rng.random() - 0.04 * u, 0.014 + 0.006 * rng.random())
            path = top_ + fall[1:]
            for _ in range(2):
                path = [path[0]] + [(path[j - 1] + path[j] * 2 + path[j + 1]) / 4 for j in range(1, len(path) - 1)] + [path[-1]]
            flat_lens(bm, path, 0.034 + 0.010 * rng.random(), 0.010)
        made.append(('weighted', piece(bm, 'barber_%s_sweep' % tag, subdiv=1), hang_w))

    # ================================================================== BOX BRAIDS
    elif cut == 'BOX BRAIDS':
        def line(q):
            ab = abs(az_of(q)); return interp(ab, [(0.0, 0.106), (0.45, 0.102), (0.80, 0.050), (1.10, 0.002), (1.55, -0.042), (math.pi, -0.072)])
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        made.append(shell('barber_%s_scalp' % tag, lambda q: q.z > line(q) - 0.004, lambda pos, nor: [0.0022] * len(pos), subdiv=1, rim=0.0012))
        roots = darts(scalp_points(lambda q: q.z > line(q) + 0.007), 0.026, 161)
        bm = bmesh.new(); rng = random.Random(163)
        for i, R in enumerate(roots):
            q = R - C; az = az_of(q); ab = abs(az); z0 = q.z
            z_end = interp(ab, [(0.0, -0.22), (1.2, -0.27), (math.pi, -0.36)]) + 0.04 * (rng.random() - 0.5)
            to = max(ab, 1.20); sgn = 1.0 if az >= 0 else -1.0
            drift = (lambda z, a0=az, s=sgn, to=to, z0=z0: a0 + (s * to - a0) * sstep(z0, z0 - 0.07, z)) if ab < to else None
            path = drape(az, z0, min(z_end, z0 - 0.03), 0.009 + 0.004 * rng.random(), drift)
            res = [path[0]]; acc = 0.0
            for a_, b_ in zip(path, path[1:]):
                acc += (b_ - a_).length
                if acc >= 0.0085: res.append(b_); acc = 0.0
            sz = 0.95 + 0.15 * rng.random()
            for j in range(len(res)):
                t, nn, bb = frame(res, j); sgn2 = 1 if j % 2 else -1
                s_ = j / max(1, len(res) - 1); sc_ = sz * (1.0 - 0.30 * sstep(0.80, 1.0, s_))
                ax = (t + bb * (0.45 * sgn2)).normalized(); ay = nn.cross(ax).normalized()
                ellipsoid(bm, res[j] + bb * (0.0024 * sgn2), ax, ay, nn, 0.0072 * sc_, 0.0046 * sc_, 0.0040 * sc_, nu=6, nv=4)
        made.append(('weighted', piece(bm, 'barber_%s_braids' % tag), hang_w))

    # ================================================================== FINGER WAVES
    elif cut == 'FINGER WAVES':
        XP = -0.045   # the side part
        def line(q):
            ab = abs(az_of(q)); return interp(ab, [(0.0, 0.104), (0.45, 0.100), (0.75, 0.050), (1.10, 0.000), (1.6, -0.050), (math.pi, -0.072)])
        paint_scalp(lambda q: q.z > line(q) - 0.003)
        def thick(pos, nor):
            rel = three(pos, nor, lambda q, n: tangent(Vector((0.0, 1.0, 0.0)), n), 171)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                theta = math.atan2(q.x - XP, q.z + 0.02)                      # round the head from the part, down each side
                s_ = abs(theta) * 0.15 + 0.010 * math.sin(q.y / 0.028 + 0.8)   # the ridges run front to back in an S
                wv = 0.5 + 0.5 * math.cos(2 * math.pi * s_ / 0.036)
                t = (0.0045 + 0.0045 * wv ** 2) * (0.40 + 0.60 * sstep(0.0, 0.010, above))
                part = math.exp(-((q.x - XP) / 0.0035) ** 2) * sstep(0.06, -0.02, q.y) * sstep(0.08, 0.12, q.z)
                out.append(max(0.0012, t - 0.0035 * part + 0.0012 * c - 0.0004))
            return out
        made.append(shell('barber_%s' % tag, lambda q: q.z > line(q) - 0.003, thick, subdiv=2, rim=0.0015))
        # a flat pin curl pressed on each temple: a coil of clay laid on the skin, a turn and a half
        bm = bmesh.new()
        for sgn in (-1, 1):
            az_c, el_c = sgn * 1.02, 0.05   # at the sideburn, in front of the ear
            Pc = on_skull(az_c, el_c, 0.0); n = (Pc - C).normalized()
            ax = tangent(Vector((0, 0, 1)), n); ay = n.cross(ax).normalized()
            path = []
            for i in range(30):
                a = 2 * math.pi * 1.5 * i / 29 * sgn; r = 0.003 + 0.012 * i / 29
                p = Pc + ax * (r * math.cos(a)) + ay * (r * math.sin(a))
                hit = bvh_head.ray_cast(C, (p - C).normalized(), 0.5)
                path.append((hit[0] if hit[0] else p) + (p - C).normalized() * 0.0028)
            rope(bm, path[::-1], 0.0028, 0.5, 0.0, seg=7)
        made.append(piece(bm, 'barber_%s_pin_curls' % tag))

    # ================================================================== SCORCH
    elif cut == 'SCORCH':
        AZC, ZC = 1.30, 0.045   # the burn, over the right ear and into the temple
        def burn_r(q):
            a = az_of(q); d_az = (a - AZC) * 0.165; d_z = q.z - ZC
            ang = math.atan2(d_z, d_az); wob = 1.0 + 0.22 * math.sin(3 * ang + 0.7) + 0.12 * math.sin(7 * ang + 2.1)
            return math.hypot(d_az / 0.050, d_z / 0.040) / wob
        def burned(q): return burn_r(q) < 1.0 and q.z > -0.06
        def hair_here(q): return grows(q) and burn_r(q) > 1.18
        paint_scalp(hair_here)
        def thick(pos, nor):
            rel = three(pos, nor, front_to_back, 181)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - grow_line(abs(az_of(q)))
                t = (0.0040 + 0.0035 * sstep(0.04, 0.15, q.z)) * (0.45 + 0.55 * sstep(0.0, 0.008, above)) * sstep(1.18, 1.45, burn_r(q))
                out.append(max(0.0008, t + 0.0022 * c - 0.0008))
            return out
        made.append(shell('barber_%s' % tag, hair_here, thick, subdiv=2, rim=0.0010))
        made.append(stubble('edge', lambda q: grows(q) and 1.0 <= burn_r(q) <= 1.18, lambda q, i: 2 if hsh(i, 183) < 0.5 else 3, hair_rgb))
        # THE SCAR: the skull's own faces in the burn cut finer and raised in waxy ridges, mottled two ways (a pale healed
        # skin and an angry rust), the way a burn heals with nobody to graft it
        pale = mat('h2_scorch_skin_pale', tuple(min(255, round(s * 1.18 + 14)) for s in skin_rgb), 0.85)
        angry = mat('h2_scorch_skin_angry', tuple(round(0.55 * s + 0.45 * r) for s, r in zip(skin_rgb, step('clay_rust', 2))), 0.9)
        bm = skull_bm(); bm.verts.ensure_lookup_table()
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index in EAR or not burned(f.calc_center_median() - C)], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
        for _ in range(2): bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
        bm.normal_update()
        for v in bm.verts:
            q = v.co - C; r = burn_r(q)
            ridge = 0.5 + 0.5 * math.sin(q.z / 0.006 + 2.0 * math.sin(az_of(q) * 9.0))
            v.co = v.co + v.normal * ((0.0008 + 0.0018 * ridge * PM.vnoise(q.x / 0.010, q.y / 0.010, q.z / 0.010, 7)) * sstep(1.0, 0.75, r))
        bm.faces.ensure_lookup_table()
        pick = [1 if PM.vnoise(*((f.calc_center_median() - C) / 0.014), 9) > 0.58 else 0 for f in bm.faces]
        me = bpy.data.meshes.new('h2_scorch_scar'); bm.to_mesh(me); bm.free()
        me.materials.append(pale); me.materials.append(angry)
        for f, m_ in zip(me.polygons, pick): f.material_index = m_; f.use_smooth = True
        o = bpy.data.objects.new('h2_scorch_scar', me); sc.collection.objects.link(o)
        made.append(o)

    return made
