#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look], HATS 1: THE TWENTY-ONE CANON HATS ON THE STARRED HEAD
(the roll call's second batch, his order: 'we still have to get the hair approved and the hats approved and the
sunglasses approved'; rule 115c: modelled at the source and rendered through DIRECTION's rig).

The alpha's wardrobe draws its 21 hats with seven shapes (genHat's beanie, beanie fit:'skull', beanie slouch, cap, cap
fit:'skull', brim, wrap; genAcc's shemagh and helm) in their own ramps. Each shape is modelled here ONCE as clay on the
head bone, and each hat wears its own ramp's mid as its cloth (the runway paint as the street wears it, the way the
thirteen gang bodies are coloured); short hair painted on the scalp under it (the barber's black), so a hat sits on a
man, not on a bald egg. Every piece follows the hair 1 rule: relief along the way the thing is made (knit ribs run
down a cap, straw runs down a cone, seams meet at a button), never one size of bump on a grid.

    KNIT CAP (6)      a rounded dome (never a pyramid: his 7/19), a folded cuff, ribs down it
    WATCH CAP (3)     the same knit, worn high on the skull, a deeper cuff
    SLOUCH BEANIE (3) the knit with its extra length slumped at the back
    WORK CAP (2)      six panels meeting at a button, a curved brim
    FIELD CAP (2)     a flat-topped crown, a short straight brim
    CONE HAT (1)      a wide straw cone on a headband
    HEAD WRAP (2)     four bands of cloth wound round the head, a knot at the back
    SHEMAGH (1)       cloth over the head and the ears, wound round the neck, a tail
    SCRAP HELM (1)    a dome of scrap plates, dented, riveted
"""
import json
import math
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HATS_JSON = os.path.join(ROOT, 'records/target/character/BOHEMIA_HATS_ONE.json')

# (name, shape, ramp mid, ramp dark) read off the alpha's wardrobe (genHat / genAcc kind and fit, the ramp's mid and dk)
HATS = [
    ('CHINESE RICE FARMER HAT', 'cone', (126, 110, 80)), ('CHARCOAL WATCH CAP', 'watch', (54, 52, 54)),
    ('RUST WATCH CAP', 'watch', (114, 72, 48)), ('OLIVE FIELD CAP', 'field', (74, 80, 54)),
    ('STORM KNIT CAP', 'knit', (70, 72, 78)), ('SAND KNIT CAP', 'knit', (128, 110, 80)),
    ('SLATE WORK CAP', 'work', (72, 78, 86)), ('OXBLOOD SLOUCH BEANIE', 'slouch', (92, 48, 42)),
    ('BONE KNIT CAP', 'knit', (162, 154, 134)), ('OLIVE KNIT CAP', 'knit', (74, 80, 54)),
    ('BRICK WATCH CAP', 'watch', (112, 58, 48)), ('PATINA FIELD CAP', 'field', (80, 110, 96)),
    ('DUST WORK CAP', 'work', (128, 110, 80)), ('STORM SLOUCH BEANIE', 'slouch', (70, 72, 78)),
    ('KHAKI SLOUCH BEANIE', 'slouch', (126, 110, 80)), ('DESERT SHEMAGH', 'shemagh', (128, 110, 80)),
    ('SCRAP HELM', 'helm', (74, 46, 32)),   # its ramp's DARK (cycle 1: the rust mid sat on the mannequin's tan at one value and read as a bald head with seams)
    ('ROSE KNIT CAP', 'knit', (220, 70, 85)),
    ('COBALT KNIT CAP', 'knit', (61, 109, 189)), ('BONE HEAD WRAP', 'wrap', (162, 154, 134)),
    ('SOOT HEAD WRAP', 'wrap', (54, 52, 54)),
]
SHAPE_NAME = {'knit': 'KNIT CAP', 'watch': 'WATCH CAP', 'slouch': 'SLOUCH BEANIE', 'work': 'WORK CAP', 'field': 'FIELD CAP',
              'cone': 'CONE HAT', 'wrap': 'HEAD WRAP', 'shemagh': 'SHEMAGH', 'helm': 'SCRAP HELM'}
CUTS = {}
for _n, _shape, _mid in HATS:
    _tag = 'hat_' + _n.lower().replace(' ', '_')
    CUTS['HAT ' + _n] = dict(tag=_tag, hat=_n, shape=_shape, cloth=_mid, bank=dict(ramp='H_BLK', vol=0, side=0.36, front=0.16),
                            hair=('cloth_black', 0), zcap=1.0, worn_by='the roll call: ' + _n)
ORDER = ['HAT ' + n for n, _, _ in HATS]


def sstep(a, b, t):
    t = max(0.0, min(1.0, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)


def interp(x, pts):
    if x <= pts[0][0]: return pts[0][1]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x <= x1: return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return pts[-1][1]


def hsh(i, salt=0):
    return (((i * 2654435761) ^ (salt * 40503)) & 0xffffffff) / 4294967296.0


LINES = {   # the hat's lower edge in metres above the head's centre, by azimuth from the front (0) to the back (pi)
    'knit':    [(0.0, 0.080), (0.6, 0.070), (1.3, 0.008), (2.2, -0.020), (math.pi, -0.030)],
    'slouch':  [(0.0, 0.082), (0.6, 0.072), (1.3, 0.010), (2.2, -0.018), (math.pi, -0.028)],
    'watch':   [(0.0, 0.098), (0.6, 0.090), (1.3, 0.046), (2.2, 0.022), (math.pi, 0.015)],
    'work':    [(0.0, 0.086), (0.6, 0.080), (1.3, 0.056), (2.2, 0.036), (math.pi, 0.030)],
    'field':   [(0.0, 0.088), (0.6, 0.082), (1.3, 0.058), (2.2, 0.040), (math.pi, 0.034)],
    'wrap':    [(0.0, 0.088), (0.6, 0.078), (1.3, 0.040), (2.2, 0.008), (math.pi, 0.000)],
    'helm':    [(0.0, 0.092), (0.6, 0.082), (1.3, 0.030), (2.2, -0.012), (math.pi, -0.020)],
    'shemagh': [(0.0, 0.092), (0.5, 0.060), (0.9, -0.060), (1.6, -0.110), (math.pi, -0.120)],
}


def build(cut, L):
    bpy, bmesh = L['bpy'], L['bmesh']
    Vector, BVHTree, PM = L['Vector'], L['BVHTree'], L['PM']
    C, sc, az_of = L['C'], L['sc'], L['az_of']
    skull_bm, finish, shell, paint_scalp, mat = L['skull_bm'], L['finish'], L['shell'], L['paint_scalp'], L['mat']
    spec = CUTS[cut]; shape = spec['shape']; tag = spec['tag']
    cloth = mat('%s_cloth' % tag, spec['cloth'], 0.95)
    made = []
    bm_s = skull_bm(); bvh_head = BVHTree.FromBMesh(bm_s); bm_s.free()

    def line(q):
        return interp(abs(az_of(q)), LINES[shape]) + 0.003 * math.sin(7.0 * az_of(q) + 1.1)

    def skull_r(az, z):
        d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z))
        hit = bvh_head.ray_cast(o, d, 0.5)
        return (hit[0] - o).length if hit[0] else None

    def dress(o):
        o.data.materials.clear(); o.data.materials.append(cloth)
        for f in o.data.polygons: f.material_index = 0
        return o

    def piece(bm, name, rim=0.0, subdiv=0):
        bm.normal_update()
        o = finish(bm, name, cloth, rim)
        if subdiv:
            ss = o.modifiers.new('ss', 'SUBSURF'); ss.levels = subdiv; ss.render_levels = subdiv
            bpy.context.view_layer.objects.active = o
            for x in sc.objects: x.select_set(x is o)
            bpy.ops.object.modifier_apply(modifier='ss')
        for f in o.data.polygons: f.use_smooth = True
        return o

    # short hair under every hat: the scalp painted the barber's black where hair grows (a buzz under the hat)
    def nape(ab): return interp(ab, [(0.0, 0.112), (0.55, 0.104), (0.82, 0.050), (1.3, 0.010), (1.9, -0.050), (math.pi, -0.070)])
    paint_scalp(lambda q: q.z > nape(abs(az_of(q))))

    def ribs(q, n=96, depth=0.0011):
        """knit ribs down the cap, the stitch pitch a little uneven round the head (a hand knit, not a print)"""
        a = az_of(q); a += 0.03 * math.sin(3 * a + 0.7)
        return depth * (0.5 + 0.5 * math.cos(n * a)) ** 3

    if shape in ('knit', 'slouch', 'watch'):
        cuff = 0.034 if shape != 'watch' else 0.042
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C; ab = abs(az_of(q)); above = q.z - line(q)
                t = 0.0075 + (0.010 if shape != 'watch' else 0.004) * sstep(0.08, 0.17, q.z)     # a rounded dome, never a point
                c = sstep(-0.001, 0.004, above) * (1.0 - sstep(cuff - 0.004, cuff, above))
                t += 0.0045 * c + 0.0012 * math.exp(-((above - cuff) / 0.003) ** 2)              # the fold, and its lip
                if shape == 'slouch':
                    t += 0.052 * math.exp(-((ab - math.pi) / 0.95) ** 2) * math.exp(-((q.z - 0.080) / 0.060) ** 2)   # the slumped length (cycle 1: 34 mm did not read from behind)
                t -= ribs(q) * (1.0 if above > cuff else 0.6)
                out.append(max(0.002, t))
            return out
        made.append(dress(shell('%s_cap' % tag, lambda q: q.z > line(q) - 0.002, thick, subdiv=2, rim=0.003)))

    elif shape in ('work', 'field'):
        flat = shape == 'field'
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C; a = az_of(q)
                t = 0.0060 + 0.0045 * sstep(0.09, 0.16, q.z)
                if not flat:
                    k = round(a / (math.pi / 3)) * (math.pi / 3)                                      # six panels
                    t -= 0.0016 * math.exp(-(((a - k) * max(0.02, math.hypot(q.x, q.y))) / 0.0025) ** 2) * sstep(0.09, 0.12, q.z)
                else:
                    # a patrol cap: the crown stands up in a column to a flat top (cycle 1: a thickness ramp on the dome
                    # read as a helmet); out to one radius at every height, then cut off flat at 0.176
                    # (cycle 2: one radius of 112 mm round the whole head stood out past the brow like an officer's cap;
                    # the column now follows the head's own section at the band, 7 mm off it)
                    rho = math.hypot(q.x, q.y); nh = math.hypot(n.x, n.y)
                    if q.z > 0.085 and nh > 0.25:
                        band = (skull_r(az_of(q), 0.090) or 0.11) + 0.007
                        t = max(t, min(0.030, (band - rho) / nh))
                    if n.z > 0.30:
                        t = min(max(t, (0.176 - q.z) / n.z), (0.176 - q.z) / n.z + 0.004) if q.z > 0.12 else t
                out.append(max(0.002, t))
            return out
        made.append(dress(shell('%s_crown' % tag, lambda q: q.z > line(q) - 0.002, thick, subdiv=2, rim=0.003)))
        bm = bmesh.new()
        NU, NV = 28, 6; span = 0.95; length = 0.050 if flat else 0.066
        rows = []
        for j in range(NV + 1):
            v = j / NV; row = []
            for i in range(NU + 1):
                u = -1 + 2 * i / NU; az = u * span
                z = interp(abs(az), LINES[shape]) + 0.002
                r = (skull_r(az, z) or 0.14) + 0.006
                d = Vector((math.sin(az), -math.cos(az), 0.0))
                ln = length * (1.0 - 0.45 * u * u) * v
                droop = (0.010 if not flat else 0.018) * v * v + (0.006 * (1 - u * u) * v if not flat else 0.0)   # the work cap's brim curves down at the sides
                p = C + Vector((0, 0, z)) + d * (r + ln) - Vector((0, 0, droop * (abs(u) if not flat else 1.0) + (0.0 if not flat else 0.0)))
                row.append(bm.verts.new(p))
            rows.append(row)
        for j in range(NV):
            for i in range(NU):
                bm.faces.new((rows[j][i], rows[j][i + 1], rows[j + 1][i + 1], rows[j + 1][i]))
        made.append(piece(bm, '%s_brim' % tag, rim=0.005))
        if not flat:   # the button where the panels meet
            bmb = bmesh.new()
            top = C + Vector((0, 0.004, 0.0))
            hit = bvh_head.ray_cast(top, Vector((0, 0, 1)), 0.5)
            ctr = (hit[0] if hit[0] else C + Vector((0, 0, 0.17))) + Vector((0, 0, 0.012))
            bmesh.ops.create_uvsphere(bmb, u_segments=10, v_segments=6, radius=0.007)
            for v_ in bmb.verts: v_.co = v_.co * Vector((1, 1, 0.55)) + ctr
            made.append(piece(bmb, '%s_button' % tag))

    elif shape == 'cone':
        bm = bmesh.new(); NA, NR = 64, 14
        apex = C + Vector((0, 0.010, 0.300)); base_z = 0.118; R0 = 0.255
        rings = [[None] * NA for _ in range(NR + 1)]
        for j in range(NR + 1):
            s = j / NR
            for i in range(NA):
                a = 2 * math.pi * i / NA
                straw = 0.0016 * (0.5 + 0.5 * math.cos(NA * 1.0 * a + 2.0 * hsh(i, 5))) * s                 # straw down the cone
                r = R0 * s + straw
                z = apex.z - C.z - (apex.z - C.z - base_z) * (s ** 0.92) - 0.006 * math.sin(math.pi * s)      # a little belly
                if s > 0.94: z -= 0.010 * (s - 0.94) / 0.06                                                    # the rim turns down
                rings[j][i] = bm.verts.new(Vector((C.x + math.sin(a) * r, apex.y - math.cos(a) * r, C.z + z)))
        tip = rings[0][0]
        for i in range(1, NA): bm.verts.remove(rings[0][i]); rings[0][i] = tip
        for j in range(NR):
            for i in range(NA):
                a_, b_, c_, d_ = rings[j][i], rings[j][(i + 1) % NA], rings[j + 1][(i + 1) % NA], rings[j + 1][i]
                vs = [a_, b_, c_, d_]
                uniq = []
                for v_ in vs:
                    if v_ not in uniq: uniq.append(v_)
                if len(uniq) >= 3: bm.faces.new(uniq)
        made.append(piece(bm, '%s_cone' % tag, rim=0.006))
        bmb = bmesh.new()   # the headband it sits on
        z = base_z + 0.020; rr = (skull_r(0.0, z) or 0.13)
        pts = []
        for i in range(40):
            a = 2 * math.pi * i / 40; r = (skull_r(a if a <= math.pi else a - 2 * math.pi, z) or rr) + 0.004
            pts.append(C + Vector((math.sin(a) * r, -math.cos(a) * r, z)))
        seg = 8; rings2 = []
        for i, p in enumerate(pts):
            t = (pts[(i + 1) % 40] - pts[i - 1]).normalized(); h = Vector((p.x - C.x, p.y - C.y, 0)).normalized()
            rings2.append([bmb.verts.new(p + (h * math.cos(2 * math.pi * k / seg) + Vector((0, 0, 1)) * math.sin(2 * math.pi * k / seg)) * 0.006) for k in range(seg)])
        for i in range(40):
            for k in range(seg):
                bmb.faces.new((rings2[i][k], rings2[i][(k + 1) % seg], rings2[(i + 1) % 40][(k + 1) % seg], rings2[(i + 1) % 40][k]))
        made.append(piece(bmb, '%s_band' % tag))

    elif shape == 'helm':
        rng = random.Random(77)
        lift = [0.002 * (rng.random() - 0.5) for _ in range(7)]
        def plate(q):
            a = az_of(q); return 6 if q.z > 0.135 else int(((a + math.pi) / (2 * math.pi)) * 6) % 6
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C; a = az_of(q); k = plate(q)
                t = 0.015 + 0.003 * sstep(0.10, 0.17, q.z) + lift[k]
                t += 0.004 * math.exp(-((q.z - line(q) - 0.004) / 0.004) ** 2)                            # a rolled lip at the edge
                edge = (a + math.pi) / (2 * math.pi) * 6; fe = abs(edge - round(edge)) * (2 * math.pi / 6) * max(0.03, math.hypot(q.x, q.y))
                g = math.exp(-(fe / 0.0025) ** 2) if q.z <= 0.14 else 0.0
                g = max(g, math.exp(-((q.z - 0.135) / 0.0025) ** 2))
                t -= 0.0065 * g
                # rivets: sparse, along the seams, a few centimetres apart (never a field of them)
                if q.z < 0.135 and fe < 0.010:
                    zz = (q.z - 0.02) / 0.032; d = abs(zz - round(zz)) * 0.032
                    t += 0.0035 * max(0.0, 1.0 - math.hypot(d, max(0.0, fe - 0.006)) / 0.0045)
                t += 0.0015 * math.sin(q.x * 90 + q.y * 70) * math.sin(q.z * 110)                        # dents
                out.append(max(0.004, t))
            return out
        made.append(dress(shell('%s_dome' % tag, lambda q: q.z > line(q) - 0.002, thick, subdiv=2, rim=0.004)))

    elif shape == 'wrap':
        def thick(pos, nor):
            return [0.004 + 0.002 * sstep(0.10, 0.16, (p - C).z) for p in pos]
        made.append(dress(shell('%s_under' % tag, lambda q: q.z > line(q) - 0.002, thick, subdiv=1, rim=0.002)))
        bm = bmesh.new(); seg = 10
        for k, (tilt, zc, w, th) in enumerate(((0.32, 0.085, 0.040, 0.011), (-0.22, 0.105, 0.042, 0.011), (0.12, 0.130, 0.040, 0.011), (-0.05, 0.150, 0.036, 0.010))):
            pts = []
            for i in range(48):
                a = 2 * math.pi * i / 48; aa = a if a <= math.pi else a - 2 * math.pi
                z = zc + tilt * 0.10 * math.cos(a) * (1 if k % 2 else -1)
                r = (skull_r(aa, z) or 0.13) + 0.010 + 0.004 * k
                pts.append(C + Vector((math.sin(a) * r, -math.cos(a) * r, z)))
            rings = []
            for i, p in enumerate(pts):
                t = (pts[(i + 1) % 48] - pts[i - 1]).normalized(); h = Vector((p.x - C.x, p.y - C.y, 0.0)).normalized()
                nn = (h - t * h.dot(t)).normalized(); bb = t.cross(nn).normalized()
                fold = 1.0 + 0.10 * math.sin(5 * i / 48 * 2 * math.pi + k)
                rings.append([bm.verts.new(p + bb * (0.5 * w * fold * math.cos(2 * math.pi * j / seg)) + nn * (0.5 * th * math.sin(2 * math.pi * j / seg))) for j in range(seg)])
            for i in range(48):
                for j in range(seg):
                    bm.faces.new((rings[i][j], rings[i][(j + 1) % seg], rings[(i + 1) % 48][(j + 1) % seg], rings[(i + 1) % 48][j]))
        knot = C + Vector((0.0, (skull_r(math.pi, 0.11) or 0.15) + 0.022, 0.110))
        res = bmesh.ops.create_uvsphere(bm, u_segments=12, v_segments=8, radius=0.022)
        for v_ in res['verts']: v_.co = Vector((v_.co.x * 1.2, v_.co.y * 0.7, v_.co.z)) + knot
        made.append(piece(bm, '%s_bands' % tag, subdiv=1))

    elif shape == 'shemagh':
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C; above = q.z - line(q)
                t = 0.010 + 0.006 * sstep(0.09, 0.17, q.z) + 0.004 * sstep(0.6, 1.4, abs(az_of(q))) * sstep(0.05, -0.08, q.z)
                t += 0.0030 * math.sin(28 * (q.z + 0.35 * az_of(q))) * sstep(0.0, 0.02, above)                  # loose diagonal folds
                out.append(max(0.003, t * (0.4 + 0.6 * sstep(0.0, 0.012, above))))
            return out
        def keep(q):
            ab = abs(az_of(q)); return q.z > line(q) - 0.002 and not (ab < 0.62 and q.z < 0.09)            # the face stays open
        made.append(dress(shell('%s_hood' % tag, keep, thick, subdiv=2, rim=0.003)))
        bm = bmesh.new(); seg = 10
        neck = [o for o in sc.objects if o.name == 'portrait_neck']
        bvh_n = None
        if neck:
            mw = neck[0].matrix_world
            bvh_n = BVHTree.FromPolygons([mw @ v.co for v in neck[0].data.vertices], [list(f.vertices) for f in neck[0].data.polygons])
        for k, (z, w, th) in enumerate(((-0.105, 0.040, 0.014), (-0.135, 0.044, 0.016), (-0.160, 0.040, 0.014))):
            pts = []
            for i in range(40):
                a = 2 * math.pi * i / 40; d = Vector((math.sin(a), -math.cos(a), 0.0)); o = C + Vector((0, 0.012, z))
                r = 0.060
                if bvh_n:
                    hit = bvh_n.ray_cast(o, d, 0.3)
                    if hit[0]: r = (hit[0] - o).length
                pts.append(o + d * (r + 0.010 + 0.005 * k + 0.003 * math.sin(3 * a + k)))
            rings = []
            for i, p in enumerate(pts):
                t = (pts[(i + 1) % 40] - pts[i - 1]).normalized(); h = Vector((p.x - C.x, p.y - C.y - 0.012, 0.0)).normalized()
                nn = (h - t * h.dot(t)).normalized(); bb = t.cross(nn).normalized()
                rings.append([bm.verts.new(p + bb * (0.5 * w * math.cos(2 * math.pi * j / seg)) + nn * (0.5 * th * math.sin(2 * math.pi * j / seg))) for j in range(seg)])
            for i in range(40):
                for j in range(seg):
                    bm.faces.new((rings[i][j], rings[i][(j + 1) % seg], rings[(i + 1) % 40][(j + 1) % seg], rings[(i + 1) % 40][j]))
        o = piece(bm, '%s_wound' % tag, subdiv=1)
        def neck_w(q):
            a = sstep(-0.10, -0.15, q.z)
            return {k: v for k, v in {PM.HEAD_BONE: 1.0 - a, PM.NECK_BONE: a}.items() if v > 1e-4}
        made.append(('weighted', o, neck_w))

    return made


def record():
    """the roll call's hats, as the file the sheet and the card read"""
    out = {'what': "CHARACTER hats 1: the 21 canon hats, seven shapes modelled once each on the starred head, each in its own ramp's mid",
           'hats': [dict(name=n, shape=SHAPE_NAME[s], cloth=list(c), tag='hat_' + n.lower().replace(' ', '_')) for n, s, c in HATS]}
    json.dump(out, open(HATS_JSON, 'w'), indent=1)


if __name__ == '__main__':
    record()
