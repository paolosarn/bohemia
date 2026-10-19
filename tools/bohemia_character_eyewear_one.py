#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look], EYEWEAR 1: THE FACE PIECES ON THE STARRED HEAD (the roll call's
third batch, his order: 'the hair approved and the hats approved and the sunglasses approved'; rule 115c).

The alpha's wardrobe draws 14 face pieces (layer face) with genAcc's six kinds, each in its own ramp; the paper doll adds
the player's shades. Each kind is modelled ONCE here as clay and cloth on the head bone of PORTRAIT's starred head (the
barber's mannequin), each piece in its own ramp's mid; the face under it is PORTRAIT's and is never touched. Cloth over
a face bridges the hollows (a mask stands off the nose and does not sink into the mouth): every cloth piece is laid on
the face's own radius, measured by rays from the head's axis, max-filtered across its neighbours and smoothed, then
pleated or folded the way that cloth folds. The dust mask's law (below the eyes, never over them) holds for the mask,
the bandana and the face wrap, as it does in the flat game.

    DUST MASK (5)     cloth over the nose and the mouth, three pleats, two straps round the head
    WRAPAROUNDS (2)   one dark lens band from temple to temple, standing off the brow, arms to the ears
    GAS MASK (1)      a rubber face from brow to chin, two round lenses in rings, a filter at the mouth, a strap
    BANDANA (2)       the outlaw triangle: over the nose, hanging to a point below the chin, a knot at the back
    VISOR (2)         a band over the eyes, a strap round the head
    FACE WRAP (2)     cloth wound round the lower face and the neck, three turns
"""
import math

PIECES = [
    ('BONE DUST MASK', 'mask', (162, 154, 134)), ('OXBLOOD DUST MASK', 'mask', (92, 48, 42)),
    ('WRAPAROUND SHADES', 'shades', (40, 38, 40)), ('CHARCOAL DUST MASK', 'mask', (54, 52, 54)),
    ('OLIVE DUST MASK', 'mask', (74, 80, 54)), ('RUST DUST MASK', 'mask', (114, 72, 48)),
    ('GREY WRAPAROUNDS', 'shades', (96, 96, 100)), ('RUBBER GAS MASK', 'gasmask', (54, 52, 54)),
    ('OUTLAW BANDANA', 'bandana', (64, 82, 110)), ('ROSE BANDANA', 'bandana', (220, 70, 85)),
    ('SHIELD VISOR', 'visor', (54, 52, 54)), ('ASH SHIELD', 'visor', (96, 96, 100)),
    ('FACE WRAP', 'facewrap', (54, 52, 54)), ('ASH FACE WRAP', 'facewrap', (96, 96, 100)),
]
SHAPE_NAME = {'mask': 'DUST MASK', 'shades': 'WRAPAROUNDS', 'gasmask': 'GAS MASK', 'bandana': 'BANDANA', 'visor': 'VISOR',
              'facewrap': 'FACE WRAP'}
CUTS = {}
for _n, _shape, _mid in PIECES:
    CUTS['FACE ' + _n] = dict(tag='face_' + _n.lower().replace(' ', '_'), piece=_n, shape=_shape, cloth=_mid,
                             bank=dict(ramp='H_BLK', vol=0, side=0.36, front=0.16), hair=('cloth_black', 0), zcap=1.0,
                             worn_by='the roll call: ' + _n)
ORDER = ['FACE ' + n for n, _, _ in PIECES]


def sstep(a, b, t):
    t = max(0.0, min(1.0, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)


def interp(x, pts):
    if x <= pts[0][0]: return pts[0][1]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x <= x1: return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return pts[-1][1]


def build(cut, L):
    bpy, bmesh = L['bpy'], L['bmesh']
    Vector, BVHTree, PM = L['Vector'], L['BVHTree'], L['PM']
    C, sc, az_of = L['C'], L['sc'], L['az_of']
    skull_bm, finish, paint_scalp, mat = L['skull_bm'], L['finish'], L['paint_scalp'], L['mat']
    spec = CUTS[cut]; shape = spec['shape']; tag = spec['tag']
    cloth = mat('%s_cloth' % tag, spec['cloth'], 0.95)
    lens_m = mat('%s_lens' % tag, (22, 22, 26), 0.9)
    made = []
    bm_s = skull_bm(); bvh_head = BVHTree.FromBMesh(bm_s); bm_s.free()
    neck = [o for o in sc.objects if o.name == 'portrait_neck']
    bvh_neck = None
    if neck:
        mw = neck[0].matrix_world
        bvh_neck = BVHTree.FromPolygons([mw @ v.co for v in neck[0].data.vertices], [list(f.vertices) for f in neck[0].data.polygons])

    def ray_r(az, z):
        d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z))
        best = None
        for bv in (bvh_head, bvh_neck):
            if bv is None: continue
            hit = bv.ray_cast(o, d, 0.5)
            if hit[0]:
                r = (hit[0] - o).length
                best = r if best is None else max(best, r)
        return best

    # short hair on the scalp, as under the hats (a face piece sits on a man, not on a bald egg)
    def nape(ab): return interp(ab, [(0.0, 0.112), (0.55, 0.104), (0.82, 0.050), (1.3, 0.010), (1.9, -0.050), (math.pi, -0.070)])
    paint_scalp(lambda q: q.z > nape(abs(az_of(q))))

    def sheet(az0, az1, z0, z1, NU, NV, off, fold=None, hang=None, bottom=None, mtl=None, rim=0.003, name='sheet'):
        """cloth laid on the face: the face's radius on a grid, max-filtered across neighbours so it bridges the hollows,
        smoothed, pushed out by off, folded by fold(u, v), hanging free below hang(az) (straight down off the face), cut at
        bottom(az)"""
        R = [[ray_r(az0 + (az1 - az0) * i / NU, z0 + (z1 - z0) * j / NV) for i in range(NU + 1)] for j in range(NV + 1)]
        for j in range(NV + 1):
            for i in range(NU + 1):
                if R[j][i] is None: R[j][i] = 0.10
        F = [[max(R[jj][ii] for jj in range(max(0, j - 2), min(NV, j + 2) + 1) for ii in range(max(0, i - 3), min(NU, i + 3) + 1))
              for i in range(NU + 1)] for j in range(NV + 1)]
        for _ in range(3):
            F = [[(F[j][max(0, i - 1)] + 2 * F[j][i] + F[j][min(NU, i + 1)] + F[max(0, j - 1)][i] + F[min(NV, j + 1)][i]) / 6.0
                  for i in range(NU + 1)] for j in range(NV + 1)]
        bm = bmesh.new(); vs = [[None] * (NU + 1) for _ in range(NV + 1)]
        for j in range(NV + 1):
            for i in range(NU + 1):
                u = i / NU; v = j / NV; az = az0 + (az1 - az0) * u; z = z0 + (z1 - z0) * v
                r = F[j][i] + off + (fold(u, v) if fold else 0.0)
                d = Vector((math.sin(az), -math.cos(az), 0.0))
                p = C + Vector((0, 0, z)) + d * r
                if hang is not None and z < hang(az):   # below the chin the cloth falls straight, it does not follow the throat
                    jj = j
                    while jj < NV and (z0 + (z1 - z0) * (jj / NV)) < hang(az): jj += 1
                    p = C + Vector((0, 0, z)) + d * (F[jj][i] + off + (fold(u, jj / NV) if fold else 0.0))
                vs[j][i] = bm.verts.new(p) if (bottom is None or z >= bottom(az) - 1e-6) else None
        for j in range(NV):
            for i in range(NU):
                q = [vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]]
                q = [x for x in q if x is not None]
                if len(q) >= 3: bm.faces.new(q)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        if sum(((f.calc_center_median() - C) * Vector((1, 1, 0))).dot(f.normal) for f in bm.faces) < 0: bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
        o = finish(bm, '%s_%s' % (tag, name), mtl or cloth, rim)
        ss = o.modifiers.new('ss', 'SUBSURF'); ss.levels = 1; ss.render_levels = 1   # a 4 to 5 mm grid, under a pixel at 128
        bpy.context.view_layer.objects.active = o
        for x in sc.objects: x.select_set(x is o)
        bpy.ops.object.modifier_apply(modifier='ss')
        for f in o.data.polygons: f.use_smooth = True
        return o

    def band(z, off, w, th, az0=-math.pi, az1=math.pi, N=40, name='strap'):
        """a strap or a turn of cloth round the head at height z (a flat lens in section)"""
        bm = bmesh.new(); seg = 8; pts = []
        closed = az1 - az0 > 6.0
        for i in range(N + (0 if closed else 1)):
            a = az0 + (az1 - az0) * i / N
            r = (ray_r(a, z) or 0.10) + off
            pts.append(C + Vector((math.sin(a) * r, -math.cos(a) * r, z)))
        rings = []
        n = len(pts)
        for i, p in enumerate(pts):
            t = (pts[(i + 1) % n] - pts[i - 1]).normalized() if closed else (pts[min(n - 1, i + 1)] - pts[max(0, i - 1)]).normalized()
            h = Vector((p.x - C.x, p.y - C.y, 0.0)).normalized(); nn = (h - t * h.dot(t)).normalized(); bb = t.cross(nn).normalized()
            rings.append([bm.verts.new(p + bb * (0.5 * w * math.cos(2 * math.pi * k / seg)) + nn * (0.5 * th * math.sin(2 * math.pi * k / seg))) for k in range(seg)])
        for i in range(n if closed else n - 1):
            for k in range(seg):
                bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[(i + 1) % n][(k + 1) % seg], rings[(i + 1) % n][k]))
        bm.normal_update()
        o = finish(bm, '%s_%s' % (tag, name), cloth, 0)
        for f in o.data.polygons: f.use_smooth = True
        return o

    if shape == 'mask':
        made.append(sheet(-0.95, 0.95, -0.122, -0.016, 40, 22, 0.006,
                          fold=lambda u, v: 0.0016 * math.sin(v * 3 * 2 * math.pi) * (1 - abs(2 * u - 1)) ** 0.5, name='mask'))
        made.append(band(-0.030, 0.004, 0.008, 0.003, 0.95, 2 * math.pi - 0.95, 36, 'strap_top'))
        made.append(band(-0.098, 0.004, 0.008, 0.003, 0.95, 2 * math.pi - 0.95, 36, 'strap_low'))

    elif shape == 'shades':
        made.append(sheet(-1.05, 1.05, -0.016, 0.020, 36, 6, 0.010, mtl=lens_m, rim=0.004, name='lens'))
        made.append(band(0.020, 0.012, 0.004, 0.004, -1.06, 1.06, 30, 'rim'))
        made.append(band(0.006, 0.006, 0.004, 0.003, 1.05, 1.65, 10, 'arm_l'))
        made.append(band(0.006, 0.006, 0.004, 0.003, -1.65, -1.05, 10, 'arm_r'))

    elif shape == 'gasmask':
        made.append(sheet(-1.0, 1.0, -0.132, 0.052, 40, 30, 0.008, name='face'))
        for sgn in (-1, 1):   # the lenses: a ring and a dark disc at each eye
            az = math.atan2(sgn * 0.047, 0.16)
            r = (ray_r(az, 0.004) or 0.15) + 0.016
            d = Vector((math.sin(az), -math.cos(az), 0.0)); ctr = C + Vector((0, 0, 0.004)) + d * r
            bm = bmesh.new()
            res = bmesh.ops.create_cone(bm, cap_ends=True, segments=20, radius1=0.022, radius2=0.021, depth=0.014)
            rot = d.to_track_quat('Z', 'Y')
            for v in res['verts']: v.co = rot @ v.co + ctr
            made.append(finish(bm, '%s_ring_%d' % (tag, sgn), cloth, 0))
            bm = bmesh.new()
            res = bmesh.ops.create_circle(bm, cap_ends=True, segments=20, radius=0.017)
            for v in res['verts']: v.co = rot @ v.co + ctr + d * 0.006
            made.append(finish(bm, '%s_lens_%d' % (tag, sgn), lens_m, 0.002))
        r = (ray_r(0.0, -0.095) or 0.15) + 0.030
        d = Vector((0.0, -1.0, -0.45)).normalized(); ctr = C + Vector((0, -r, -0.100))
        bm = bmesh.new()
        res = bmesh.ops.create_cone(bm, cap_ends=True, segments=18, radius1=0.028, radius2=0.026, depth=0.052)
        rot = d.to_track_quat('Z', 'Y')
        for v in res['verts']: v.co = rot @ v.co + ctr
        made.append(finish(bm, '%s_filter' % tag, cloth, 0))
        made.append(band(0.030, 0.004, 0.016, 0.004, 0.95, 2 * math.pi - 0.95, 36, 'strap'))

    elif shape == 'bandana':
        made.append(sheet(-1.0, 1.0, -0.215, -0.018, 40, 34, 0.007,
                          fold=lambda u, v: 0.004 * math.sin(6 * u * math.pi) * sstep(0.5, 0.0, v),
                          hang=lambda az: -0.112, bottom=lambda az: -0.112 - 0.100 * max(0.0, 1.0 - abs(az) / 0.95), name='triangle'))
        bm = bmesh.new()
        res = bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=8, radius=0.020)
        k = C + Vector((0, (ray_r(math.pi, -0.040) or 0.15) + 0.016, -0.040))
        for v in res['verts']: v.co = Vector((v.co.x * 1.3, v.co.y * 0.7, v.co.z)) + k
        made.append(finish(bm, '%s_knot' % tag, cloth, 0))
        made.append(band(-0.040, 0.004, 0.014, 0.004, 0.95, 2 * math.pi - 0.95, 36, 'tie'))

    elif shape == 'visor':
        made.append(sheet(-1.20, 1.20, -0.024, 0.032, 40, 8, 0.012, rim=0.006, name='band'))
        made.append(band(0.006, 0.005, 0.018, 0.004, 1.20, 2 * math.pi - 1.20, 30, 'strap'))

    elif shape == 'facewrap':
        for k, (z, w, th) in enumerate(((-0.068, 0.036, 0.012), (-0.100, 0.040, 0.014), (-0.132, 0.040, 0.014))):
            made.append(band(z, 0.008 + 0.004 * k, w, th, -math.pi, math.pi, 44, 'turn_%d' % k))

    def lower_w(q):
        a = sstep(-0.10, -0.15, q.z)
        return {kk: vv for kk, vv in {PM.HEAD_BONE: 1.0 - a, PM.NECK_BONE: a}.items() if vv > 1e-4}
    out = []
    for o in made:
        if shape in ('bandana', 'facewrap') and any(((o.matrix_world @ v.co) - C).z < -0.10 for v in o.data.vertices):
            out.append(('weighted', o, lower_w))
        else:
            out.append(o)
    return out
