#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [way more hair and faces], FACES 1: THE FACE MAKER ON THE 3D HEAD, AND MORE OF IT
(rule 121(i) and (k); his 10/19 on the 3D man: 'Need more way more facial customization'; 'we need to add so much
incredible amount more of customization to it'; 'give them hairstyles... the whole enchilada').

THREE KINDS OF FACE PIECE, all on PORTRAIT's starred head on the barber's mannequin (the head's tool imported, never
edited), all through DIRECTION's rig unedited, each a CUTS entry the barber's build() reads like a haircut:

  * THE FACE SHAPES (12): settings of the face maker's FOURTEEN dials that PORTRAIT put on the modelled skull (FACE_DIALS:
    length, cranium, forehead, cheeks, jaw, chin, the four heights, eye spacing, brow length, mouth and nose width). No
    new geometry: a face shape is a row of numbers, so RUN TWO can roll a face per person from the same table, and the
    player's barber shows the same dials. Each wears the barber's TEMPLE TAPER (his UP) in a different colour, so the
    face reads and the colour range shows.
  * THE FACIAL HAIR (11): PORTRAIT's three parts (FULL BEARD, MOUSTACHE, GOATEE) and its stubble, shown on the same man,
    and SEVEN NEW ONES built the same way (the skull's own faces where the hair grows, lifted in tufts of hashed noise
    at two sizes, never a lattice; every beard vertex remembers the skull vertex it came from, so it carries every
    shape key of the face and drops with the jaw when he talks): CHIN STRAP, MUTTON CHOPS, HORSESHOE MOUSTACHE, PENCIL
    MOUSTACHE, SOUL PATCH, PATCHY BEARD, and the LONG BEARD, whose mass hangs in locks to the chest.
  * THE MARKS (8): PORTRAIT's three scars (BROW, CHEEK, LIP) and FIVE NEW ONES, the grimy analog horror of a city with no
    doctors (rule 121(k)): a BROKEN NOSE set crooked, a CAULIFLOWER EAR, a STITCHED GASH across the brow with the thread
    still in, a CHEEK BURN healed waxy and mottled, a CLOUDED EYE gone milky. Every one is geometry or a material on
    the model; nothing is painted on a picture.

THE COLOURS: steps of the style palette (records/target/BOHEMIA_STYLE_PALETTE.json), the hair at the barber's dark step
(the rig's sun and dust lift it); a beard is its head's hair colour. Material names carry 'hair', 'skin' or 'eye' so the
rig's wear_by_material reads them as hair, skin and eyes, not paint (HAIR 2's first render: unnamed stubble took the
paint's full dust and blotched).

Run (Blender's Python, bpy 4.2): <venv>/bin/python tools/bohemia_character_the_barber_on_the_skull.py build FACES1
"""
import math
import random

import bohemia_character_hair_one as H1

sstep, interp, hsh = H1.sstep, H1.interp, H1.hsh
HAIRS = [('cloth_black', 0), ('clay_mustard', 0), ('tape_grey', 1), ('tape_masking', 1), ('clay_rust', 1), ('clay_bone', 2)]

SHAPES = [
    ('LONG AND NARROW', {'face.len': 39, 'face.cheekW': 27, 'face.jawW': 23, 'face.chinW': 9, 'face.foreheadW': 23, 'nose.w': 2, 'face.craniumH': 12}),
    ('BROAD AND SQUARE', {'face.len': 30, 'face.cheekW': 36, 'face.jawW': 34, 'face.chinW': 18, 'face.foreheadW': 28, 'brows.len': 10, 'mouth.w': 11}),
    ('ROUND', {'face.len': 29, 'face.cheekW': 37, 'face.jawW': 30, 'face.chinW': 13, 'face.foreheadW': 27, 'face.craniumH': 11, 'nose.w': 4}),
    ('HEART', {'face.foreheadW': 30, 'face.cheekW': 33, 'face.jawW': 21, 'face.chinW': 8, 'eyes.gap': 7, 'mouth.w': 7}),
    ('GAUNT', {'face.len': 37, 'face.cheekW': 26, 'face.jawW': 24, 'face.chinW': 12, 'face.foreheadW': 22, 'face.eyeY': -1, 'mouth.w': 7}),
    ('HEAVY BROW', {'face.browY': 2, 'brows.len': 11, 'face.eyeY': 1, 'face.jawW': 30, 'face.chinW': 15, 'face.craniumH': 8, 'nose.w': 4}),
    ('HIGH DOME', {'face.craniumH': 15, 'face.len': 31, 'face.foreheadW': 28, 'face.cheekW': 31}),
    ('WIDE SET', {'eyes.gap': 10, 'nose.w': 4, 'mouth.w': 12, 'face.cheekW': 34, 'face.len': 31}),
    ('HAWK', {'eyes.gap': 3, 'nose.w': 2, 'face.noseY': -1, 'face.len': 37, 'face.chinW': 15, 'face.jawW': 24, 'face.cheekW': 28}),
    ('SMALL FEATURES', {'mouth.w': 6, 'nose.w': 2, 'eyes.gap': 5, 'face.chinW': 9, 'face.len': 30, 'brows.len': 5}),
    ('LANTERN JAW', {'face.jawW': 33, 'face.chinW': 20, 'face.len': 38, 'face.cheekW': 34, 'face.mouthY': 1}),
    ('FLAT AND LOW', {'face.craniumH': 7, 'face.browY': 2, 'face.len': 34, 'nose.w': 5, 'face.noseY': 1, 'mouth.w': 13, 'face.foreheadW': 26}),
]
BEARDS = [   # (name, PORTRAIT's part or None, this module's kind or None, stubble, hair colour)
    ('STUBBLE', None, None, True, ('cloth_black', 0)),
    ('FULL BEARD', 'full', None, False, ('clay_mustard', 0)),
    ('MOUSTACHE', 'moustache', None, False, ('cloth_black', 0)),
    ('GOATEE', 'goatee', None, False, ('tape_masking', 1)),
    ('CHIN STRAP', None, 'chin_strap', False, ('cloth_black', 0)),
    ('MUTTON CHOPS', None, 'mutton_chops', False, ('clay_rust', 1)),
    ('HORSESHOE MOUSTACHE', None, 'horseshoe', False, ('tape_grey', 1)),
    ('PENCIL MOUSTACHE', None, 'pencil', False, ('cloth_black', 0)),
    ('SOUL PATCH', None, 'soul_patch', False, ('clay_mustard', 0)),
    ('PATCHY BEARD', None, 'patchy', True, ('clay_mustard', 0)),
    ('LONG BEARD', None, 'long', False, ('tape_grey', 1)),
]
MARKS = [   # (name, PORTRAIT's scar or None, this module's mark or None)
    ('BROW SCAR', 'brow', None), ('CHEEK SCAR', 'cheek', None), ('LIP SCAR', 'lip', None),
    ('BROKEN NOSE', None, 'broken_nose'), ('CAULIFLOWER EAR', None, 'cauliflower_ear'), ('STITCHED GASH', None, 'stitched_gash'),
    ('CHEEK BURN', None, 'cheek_burn'), ('CLOUDED EYE', None, 'clouded_eye'),
]
NEW_BEARDS = [n for n, p, k, s, c in BEARDS if k]
NEW_MARKS = [n for n, p, k in MARKS if k]


def _slug(n): return n.lower().replace(' ', '_')


CUTS = {}
for _i, (_n, _f) in enumerate(SHAPES):
    _h = HAIRS[_i % len(HAIRS)]
    if _n == 'HIGH DOME': _h = ('cloth_black', 1)   # cycle 2: at cloth_black 0 the guide's light row read W lit from below by 2.9 (HAIR 2's FINGER WAVES case)
    CUTS['FACE ' + _n] = dict(tag='face_' + _slug(_n), bank=dict(ramp='face', kind='face shape', face=_f), hair=_h, zcap=0.3,
                              as_cut='TEMPLE TAPER', face=_f, group='shape', label=_n, worn_by='anyone: a face is rolled per person')
for _n, _p, _k, _s, _c in BEARDS:
    CUTS['BEARD ' + _n] = dict(tag='beard_' + _slug(_n), bank=dict(ramp='beard', kind='facial hair', part=_p or _k), hair=_c, zcap=0.3,
                               as_cut='TEMPLE TAPER', beard=_p, new_beard=_k, stubble=_s, group='beard', label=_n,
                               made_by='PORTRAIT (its part, shown on the barber\'s man)' if _p or (_s and not _k) else 'CHARACTER (new, 10/19)',
                               worn_by='men of any gang')
for _n, _p, _k in MARKS:
    CUTS['MARK ' + _n] = dict(tag='mark_' + _slug(_n), bank=dict(ramp='mark', kind='mark', part=_p or _k), hair=('cloth_black', 0), zcap=0.3,
                              as_cut='TEMPLE TAPER', scar=_p, mark=_k, group='mark', label=_n,
                              made_by='PORTRAIT (its scar, shown on the barber\'s man)' if _p else 'CHARACTER (new, 10/19)',
                              worn_by='anyone the city has hurt')
ORDER = list(CUTS)
SHAPE_ORDER = [n for n in ORDER if CUTS[n]['group'] == 'shape']
PIECE_ORDER = [n for n in ORDER if CUTS[n]['group'] != 'shape']


def build(cut, L):
    """the new facial hair and marks, built into the barber's live scene after the cut; returns the barber's `made`"""
    spec = CUTS.get(cut) or L['spec']   # a FACES 1 entry, or a PERSON who wears one (the barber's people())
    if not (spec.get('new_beard') or spec.get('mark')): return []
    bpy, bmesh = L['bpy'], L['bmesh']
    Vector, PM = L['Vector'], L['PM']
    C, sc, mat, finish = L['C'], L['sc'], L['mat'], L['finish']
    head, EAR, hm = L['head'], L['EAR'], L['hm']
    hair_rgb, skin_rgb, tag = L['hair_rgb'], L['skin_rgb'], spec['tag']
    k = H1.kit(L)
    bvh_head, bvh_body, lens, ellipsoid, hang_w, tangent = (k[n] for n in ('bvh_head', 'bvh_body', 'lens', 'ellipsoid', 'hang_w', 'tangent'))
    step = PM.palette_step
    RY = PM.FD['RY'] if PM.FD else 0.165
    MH = PM.MOUTH_HALF
    MZ = PM.MOUTH_Z
    hmi = hm.inverted(); r3 = hm.to_3x3(); r3i = r3.inverted()
    made = []

    def front(q): return q.y < -RY * 0.45
    def cheek_line(q): return -0.058 + 0.04 * max(0.0, min(1.0, (q.y + 0.05) / 0.07))
    def lips(q): return front(q) and abs(q.x) < MH + 0.008 and -0.110 < q.z < -0.072
    def must(q): return front(q) and abs(q.x) < MH + 0.012 and -0.078 < q.z < -0.059
    def full(q): return q.y < 0.03 and ((q.z < cheek_line(q) and not (abs(q.x) < 0.03 and q.z > -0.072)) or must(q))

    def patch(name, region, lift, mats, pick=None, cuts=2):
        """the skull's own faces where region(q) holds, lifted by lift(q) along their normal, and every vertex carrying
        every shape key of the face (PORTRAIT's beard method), so it drops with the jaw when he talks. The skull's faces
        are about 8 mm, so the patch is cut finer first (cycle 1: a pencil moustache was six blocks): the region and two
        rings round it are kept, cut `cuts` times with the shape keys carried through the cut, then trimmed to the region
        on the fine faces"""
        bm = bmesh.new(); bm.from_mesh(head.data)
        layers = [(kb.name, bm.verts.layers.shape.get(kb.name)) for kb in (head.data.shape_keys.key_blocks[1:] if head.data.shape_keys else [])]
        bm.verts.ensure_lookup_table(); bm.faces.ensure_lookup_table()
        keep = set(f for f in bm.faces if f.verts[0].index not in EAR and region(hm @ f.calc_center_median() - C))
        for _ in range(2):
            keep |= set(g for f in list(keep) for v in f.verts for g in v.link_faces if g.verts[0].index not in EAR)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f not in keep], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        if cuts: bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=cuts, use_grid_fill=True)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if not region(hm @ f.calc_center_median() - C)], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update(); bm.verts.ensure_lookup_table()
        keyco = {n: [] for n, _ in layers}
        for v in bm.verts:
            q = hm @ v.co - C; d = v.normal * lift(q)
            for n, l in layers: keyco[n].append(v[l] + d)
            v.co = v.co + d
        bm.faces.ensure_lookup_table()
        picks = [pick(hm @ f.calc_center_median() - C) for f in bm.faces] if pick else None
        for _, l in layers: bm.verts.layers.shape.remove(l)
        for l in list(bm.verts.layers.shape): bm.verts.layers.shape.remove(l)
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        me.materials.clear()
        for m_ in mats: me.materials.append(m_)
        for i, f in enumerate(me.polygons): f.material_index = picks[i] if picks else 0; f.use_smooth = True
        o = bpy.data.objects.new(name, me); sc.collection.objects.link(o); o.matrix_world = hm
        if layers:
            o.shape_key_add(name='Basis')
            for n, _ in layers:
                k2 = o.shape_key_add(name=n, from_mix=False)
                for i, co in enumerate(keyco[n]): k2.data[i].co = co
        return o

    def tufts(q, base, amp):
        """tufts of hashed noise at 12 and 6 mm, never a lattice (PORTRAIT's beard, his chain-mail note)"""
        lump = 0.65 * PM.vnoise(q.x / 0.012, q.y / 0.012, q.z / 0.016, 11) + 0.35 * PM.vnoise(q.x / 0.006, q.y / 0.006, q.z / 0.008, 12)
        return base + amp * lump ** 1.2

    def move_head(delta):
        """move the head's own vertices (the basis and every shape key alike) by delta(q, index) in metres"""
        V = head.data.vertices
        blocks = head.data.shape_keys.key_blocks if head.data.shape_keys else []
        for i, v in enumerate(V):
            q = hm @ v.co - C; d = delta(q, i)
            if d is None: continue
            dl = r3i @ d
            v.co = v.co + dl
            for kb in blocks: kb.data[i].co = kb.data[i].co + dl
        head.data.update()

    beard_mat = lambda: mat('f1_%s_beard_hair' % tag, hair_rgb, 0.95)
    kind = spec.get('new_beard')
    # ================================================================== THE NEW FACIAL HAIR
    if kind == 'chin_strap':
        reg = lambda q: full(q) and not lips(q) and q.z < -0.120 + 0.065 * sstep(-0.12, 0.0, q.y)
        made.append(patch('f1_%s' % tag, reg, lambda q: tufts(q, 0.0045, 0.0035), [beard_mat()]))
    elif kind == 'mutton_chops':
        reg = lambda q: full(q) and not lips(q) and abs(q.x) > 0.052
        made.append(patch('f1_%s' % tag, reg, lambda q: tufts(q, 0.0070, 0.0050) + 0.0025 * sstep(-0.03, -0.09, q.z), [beard_mat()]))
    elif kind == 'horseshoe':
        bars = lambda q: front(q) and MH - 0.002 < abs(q.x) < MH + 0.013 and -0.135 < q.z < -0.059
        reg = lambda q: (must(q) or bars(q)) and not (lips(q) and abs(q.x) < MH - 0.002)
        made.append(patch('f1_%s' % tag, reg, lambda q: tufts(q, 0.0065, 0.0045), [beard_mat()]))
    elif kind == 'pencil':
        reg = lambda q: front(q) and abs(q.x) < MH + 0.002 and -0.0715 < q.z < -0.0630 and abs(q.x) > 0.0035
        made.append(patch('f1_%s' % tag, reg, lambda q: 0.0026, [beard_mat()]))
    elif kind == 'soul_patch':
        reg = lambda q: front(q) and abs(q.x) < 0.0095 and -0.128 < q.z < -0.111
        made.append(patch('f1_%s' % tag, reg, lambda q: tufts(q, 0.0040, 0.0030), [beard_mat()]))
    elif kind == 'patchy':
        reg = lambda q: full(q) and not lips(q) and PM.vnoise(q.x / 0.020, q.y / 0.020, q.z / 0.020, 31) > 0.50
        made.append(patch('f1_%s' % tag, reg, lambda q: tufts(q, 0.0035, 0.0030), [beard_mat()]))
    elif kind == 'long':
        reg = lambda q: full(q) and not lips(q)
        def lift(q):
            t = tufts(q, 0.0090, 0.0060) + 0.0040 * sstep(-0.10, -0.15, q.z)
            return t * (1.0 - 0.60 * PM.g2(q.x, q.z, 0.0, MZ, 0.050, 0.026))
        made.append(patch('f1_%s_beard' % tag, reg, lift, [beard_mat()]))
        # the mass hangs in locks from under the jaw to the chest, held off the body, combed down, the ends ragged
        bm = bmesh.new(); rng = random.Random(211)
        for i in range(11):
            u = (i + 0.5) / 11 - 0.5
            d = Vector((1.6 * u * 0.10, -0.10 + 0.05 * abs(u), -0.15)).normalized()
            hit = bvh_head.ray_cast(C, d, 0.5)
            if not hit[0]: continue
            R = hit[0] + d * 0.006; path = []; p = R.copy()
            z_end = -0.31 + 0.05 * abs(u) + 0.03 * (rng.random() - 0.5)
            while (p - C).z > z_end:
                path.append(p.copy())
                p = p + Vector((0.004 * u, -0.0016 * sstep(-0.16, -0.22, (p - C).z), -0.008))
                loc, nrm, _, _ = bvh_body.find_nearest(p)
                if loc is not None and (p - loc).dot(nrm) < 0.012: p = loc + nrm * 0.012
            if len(path) > 3: lens(bm, path, 0.030 + 0.008 * rng.random(), 0.012, 0.0)
        bm.normal_update()
        lo = finish(bm, 'f1_%s_locks' % tag, made[0].data.materials[0], 0)
        ss = lo.modifiers.new('ss', 'SUBSURF'); ss.levels = 1; ss.render_levels = 1
        bpy.context.view_layer.objects.active = lo
        for x in sc.objects: x.select_set(x is lo)
        bpy.ops.object.modifier_apply(modifier='ss')
        for f in lo.data.polygons: f.use_smooth = True
        made.append(('weighted', lo, hang_w))

    mark = spec.get('mark')
    # ================================================================== THE NEW MARKS
    if mark == 'broken_nose':
        # set crooked: the bridge kinked 3 mm forward, the lower nose pushed 7 mm to one side
        def delta(q, i):
            if i in EAR or q.y > -0.08: return None
            w = PM.g2(q.x, q.z, 0.0, -0.022, 0.026, 0.040) * sstep(-0.10, -0.15, q.y)
            if w < 1e-4: return None
            return Vector((0.0070 * w * sstep(0.015, -0.035, q.z), -0.0030 * PM.g2(q.x, q.z, 0.0, 0.004, 0.012, 0.010) * sstep(-0.10, -0.15, q.y), 0.0))
        move_head(delta)
    elif mark == 'cauliflower_ear':
        ear = [i for i in EAR if (hm @ head.data.vertices[i].co - C).x > 0]
        ec = sum(((hm @ head.data.vertices[i].co) for i in ear), Vector()) / max(1, len(ear))
        def delta(q, i):
            if i not in EAR or q.x <= 0: return None
            p = q + C; d = (p - ec); d = d.normalized() if d.length > 1e-6 else Vector((1, 0, 0))
            n = 0.5 + PM.vnoise(q.x / 0.007, q.y / 0.007, q.z / 0.007, 41)
            return d * (0.0042 * n) + Vector((0.0025, 0.0, 0.0))
        move_head(delta)
    elif mark == 'stitched_gash':
        # a fresh cut across the brow, raised and angry, the thread still in it: seven stitches across the seam
        a0, a1 = Vector((-0.050, 0.0, 0.082)), Vector((0.032, 0.0, 0.044))
        def on_face(x, z, off):
            o_ = C + Vector((x, -0.40, z)); hit = bvh_head.ray_cast(o_, Vector((0, 1, 0)), 0.6)
            return (hit[0] + Vector((0, -1, 0)) * off) if hit[0] else C + Vector((x, -0.17 - off, z))
        seam = [on_face(a0.x + (a1.x - a0.x) * t, a0.z + (a1.z - a0.z) * t + 0.004 * math.sin(9 * t), 0.0012) for t in [i / 24 for i in range(25)]]
        angry = mat('f1_%s_skin_seam' % tag, tuple(round(0.5 * s + 0.5 * r) for s, r in zip(skin_rgb, step('clay_rust', 2))), 0.8)
        bm = bmesh.new(); lens(bm, seam, 0.0060, 0.0030, 0.0, seg=8); bm.normal_update()
        made.append(finish(bm, 'f1_%s_seam' % tag, angry, 0))
        thread = mat('f1_%s_skin_thread' % tag, step('cloth_black', 1), 0.9)
        bm = bmesh.new(); dv = (a1 - a0).normalized()
        for j in range(7):
            t = (j + 0.75) / 8.0; x = a0.x + (a1.x - a0.x) * t; z = a0.z + (a1.z - a0.z) * t + 0.004 * math.sin(9 * t)
            px, pz = -dv.z, dv.x
            p0 = on_face(x + px * 0.0055, z + pz * 0.0055, 0.0020); p1 = on_face(x - px * 0.0055, z - pz * 0.0055, 0.0020)
            mid = (p0 + p1) / 2 + Vector((0, -0.0012, 0)); ax = (p1 - p0).normalized(); ay = ax.cross(Vector((0, -1, 0))).normalized()
            ellipsoid(bm, mid, ax, ay, ax.cross(ay).normalized(), (p1 - p0).length * 0.55, 0.0008, 0.0008, nu=6, nv=4)
        bm.normal_update()
        made.append(finish(bm, 'f1_%s_stitches' % tag, thread, 0))
    elif mark == 'cheek_burn':
        def burn_r(q):
            ang = math.atan2(q.z + 0.030, q.x + 0.070); wob = 1.0 + 0.20 * math.sin(3 * ang + 0.9) + 0.10 * math.sin(7 * ang + 0.3)
            return math.hypot((q.x + 0.070) / 0.036, (q.z + 0.030) / 0.046) / wob
        reg = lambda q: q.y < -0.06 and burn_r(q) < 1.0
        def lift(q):
            ridge = 0.5 + 0.5 * math.sin(q.z / 0.005 + 2.0 * math.sin(q.x / 0.011))
            return (0.0006 + 0.0016 * ridge * PM.vnoise(q.x / 0.008, q.y / 0.008, q.z / 0.008, 7)) * sstep(1.0, 0.7, burn_r(q))
        pale = mat('f1_%s_skin_pale' % tag, tuple(min(255, round(s * 1.18 + 14)) for s in skin_rgb), 0.85)
        angry = mat('f1_%s_skin_angry' % tag, tuple(round(0.55 * s + 0.45 * r) for s, r in zip(skin_rgb, step('clay_rust', 2))), 0.9)
        made.append(patch('f1_%s' % tag, reg, lift, [pale, angry], pick=lambda q: 1 if PM.vnoise(q.x / 0.010, q.y / 0.010, q.z / 0.010, 9) > 0.56 else 0))
    elif mark == 'clouded_eye':
        eo = sc.objects['portrait_head_eyes']; em = eo.matrix_world
        milk = mat('f1_%s_eye_milk' % tag, tuple(round(0.70 * a + 0.30 * b) for a, b in zip(step('clay_bone', 3), step('clay_teal', 3))), 0.6)
        eo.data.materials.append(milk); mi = len(eo.data.materials) - 1
        for f in eo.data.polygons:
            if (em @ f.center - C).x > 0 and f.material_index in (1, 2): f.material_index = mi
    return made
