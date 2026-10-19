#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look], HAIR 1: THE EIGHT CANON CUTS NOT YET ON THE STARRED SKULL,
AS STRANDS AND CLUMPS, NEVER A MESH (rule 115c; the roll call, records/target/character/BOHEMIA_THE_ROLL_CALL.json).

His words, 10/18, on PORTRAIT's crew faces: 'it looks like you made some hair look like it was like a medieval link mesh
armor... we still have to get the hair approved.' A chain-mail read is what a surface gets when its relief is one size
of round bump on a regular pitch (or random seeds all the same size): links. Hair reads as hair when its relief is
ELONGATED along the way it is combed and comes in clumps of DIFFERENT sizes with gaps between them, and when the long
cuts are made of separate pieces (locks, ropes, braids) that throw shadows on each other. So every cut here is built
from three things, nothing else:
  * CLUMPS on a shell: seeded at three sizes, each clump an ellipse 1.6 to 2.8 times longer than it is wide, laid along
    the comb (front to back on a taper's crown, down on a fringe, away from the part on a curtain), its own depth;
  * LOCKS: a flat lens of clay rooted on the skull, walked down the head at its own azimuth and then HANGING (never back
    in), resting where it meets the shoulder (the barber's LAYERED FALL rule, the coat skirt's);
  * ROPES and BRAIDS: tubes with a twist pressed into them (two strands round a rope) or a plait of alternating lenses.
Each cut reads its silhouette off the flat cut's own dials in the alpha's wardrobe (vol, side, front, fade, flare, tex;
read, never edited), in the same metres the barber's first three use (the head's centre C, the hairline in metres above
it), and goes on PORTRAIT's starred head on the barber's mannequin through the barber tool's build() (this module is the
eight branches it calls; the first three cuts are untouched).

    DRY TAPER     vol 1, side 0.36, front 0.16, fade 6 (H_BRN)   a taper with a fuller crown and a longer fade
    DEEP TAPER    vol 1, side 0.32, front 0.14, fade 9 (H_BLK)   the highest taper line and the longest fade
    SHAG          vol 1, side 0.82, front 0.30, flare 0.10       choppy layers: a short crown layer, a jaw layer, a fringe
    CURTAIN CUT   vol 0, side 0.78, front 0.42                   a centre part, a curtain to the jaw, two front curtains
    HEAVY FRINGE  vol 1, side 0.64, front 0.46                   a heavy blunt fringe to the brows, the sides over the ears
    ROPE LOCKS    vol 1, side 1.50, front 0.20, locs             ropes from sections of the scalp to the shoulders
    SHORT ROPES   vol 0, side 0.62, front 0.18, locs             short twisted ropes standing off the head
    DUST WEAVE    vol 0, side 0.95, front 0.22, braid            cornrows front to back, short braids hanging at the nape

The colours: H_BLK is cloth_black 0 (the barber's: 0.6 of the flat mid, the rig's sun and dust lift it back), H_BRN is
clay_mustard 0, the warm step at 0.6 of its flat mid (82, 58, 38).
"""
import math
import random

H_BLK = ('cloth_black', 0)
H_BRN = ('clay_mustard', 0)   # cycle 1: tape_masking 0 sat on the mannequin's tan skin at one value; the barber's black is 0.6 of its flat mid, so is this
CUTS = {
    'DRY TAPER': dict(tag='dry_taper', bank=dict(ramp='H_BRN', vol=1, side=0.36, front=0.16, fade=6), hair=H_BRN, zcap=1.0,
                      worn_by='Blues, Reds, Cartel, Mob; the pack, the satchel'),
    'DEEP TAPER': dict(tag='deep_taper', bank=dict(ramp='H_BLK', vol=1, side=0.32, front=0.14, fade=9), hair=H_BLK, zcap=0.3,
                       worn_by='the wide brim, the apron'),
    'SHAG': dict(tag='shag', bank=dict(ramp='H_BRN', vol=1, side=0.82, front=0.30, flare=0.10), hair=H_BRN, zcap=1.0,
                 worn_by='Colorful; the cape'),
    'CURTAIN CUT': dict(tag='curtain_cut', bank=dict(ramp='H_BRN', vol=0, side=0.78, front=0.42), hair=H_BRN, zcap=1.0,
                        worn_by='the skirt, the poncho'),
    # cycle 2 (the guide's light row, D3): the two biggest black masses read lit from below on 2 and 6 of their 8 facings
    # (the top half 3 to 20 values under the bottom); a step off near-black, the flat cut's own mid (32, 30, 27), and the
    # crown lit by the sun (no strand normals: cycle 3 with them capped at 0.5 still read 5 to 12 values under)
    'HEAVY FRINGE': dict(tag='heavy_fringe', bank=dict(ramp='H_BLK', vol=1, side=0.64, front=0.46), hair=('cloth_black', 1), zcap=1.0,
                         worn_by='Volunteers'),
    'ROPE LOCKS': dict(tag='rope_locks', bank=dict(ramp='H_BLK', vol=1, side=1.50, front=0.20, tex='locs'), hair=('cloth_black', 1), zcap=1.0,
                       worn_by='nobody yet (the crowd draws it)'),
    'SHORT ROPES': dict(tag='short_ropes', bank=dict(ramp='H_BRN', vol=0, side=0.62, front=0.18, tex='locs'), hair=H_BRN, zcap=1.0,
                        worn_by='nobody yet (the crowd draws it)'),
    'DUST WEAVE': dict(tag='dust_weave', bank=dict(ramp='H_BRN', vol=0, side=0.95, front=0.22, tex='braid'), hair=H_BRN, zcap=1.0,
                       worn_by='nobody yet (the crowd draws it)'),
}
ORDER = ['DRY TAPER', 'DEEP TAPER', 'SHAG', 'CURTAIN CUT', 'HEAVY FRINGE', 'ROPE LOCKS', 'SHORT ROPES', 'DUST WEAVE']
# HELD OFF THE CARD (10/19, rule 114b: a sheet that fails the guide's first five never reaches the tab). The two biggest
# black masses read 'lit from below' on the guide's light row (D3) on the barber's mannequin: ROPE LOCKS on 5 of 8 facings
# (the top half 8.6 to 14.4 values under the bottom: black ropes over the upper back), HEAVY FRINGE on 1 (W, 3.2), after
# three cycles (near-black lifted a step, strand normals capped then off). The bare mannequin already reads W -4.1 on this
# row (the barber's measure), so the row sits near its own threshold under any dark head. A fourth version is the tell
# (STOP PRODUCING): they stay built and named, routed to DIRECTION, and ride a card when the row and the head agree.
HELD = {'ROPE LOCKS': 'D3 on 5 of 8 facings (8.6 to 14.4 values)', 'HEAVY FRINGE': 'D3 on W (3.2 values)'}
CARD_ORDER = [n for n in ORDER if n not in HELD]


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


def kit(L, stretch=(1.6, 1.2)):
    """THE KIT every cut is built from (the skull measured by rays, the body to rest on, darts, CLUMPS, three sizes, the
    combs, drape, frame, lens, rope, ellipsoid, piece, hang_w, nape), as one dict, so HAIR 2 builds from the same hands;
    stretch is how long a clump is along the comb (1.6 to 2.8 times its size, HAIR 1's; a slicked cut asks for longer)"""
    bpy, bmesh = L['bpy'], L['bmesh']
    Vector, BVHTree, KDTree, PM = L['Vector'], L['BVHTree'], L['KDTree'], L['PM']
    C, sc, az_of = L['C'], L['sc'], L['az_of']
    skull_bm, finish, hair_mat = L['skull_bm'], L['finish'], L['hair_mat']
    # ---- the kit: the skull measured by rays from its own axis, the body to rest on --------------------------------
    bm_s = skull_bm(); bvh_head = BVHTree.FromBMesh(bm_s); bm_s.free()
    body = next(o for o in sc.objects if o.type == 'MESH' and o.name.startswith('Cesium_Man'))
    pts_, polys_ = [], []
    for o in [body, sc.objects['portrait_neck']] + [o for o in sc.objects if o.type == 'MESH' and o.name.startswith('barberbody_') and 'shoe' not in o.name]:
        base = len(pts_); mw = o.matrix_world
        pts_ += [mw @ v.co for v in o.data.vertices]; polys_ += [[base + i for i in f.vertices] for f in o.data.polygons]
    bvh_body = BVHTree.FromPolygons(pts_, polys_)

    def skull_r(az, z):
        d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z))
        hit = bvh_head.ray_cast(o, d, 0.5)
        return (hit[0] - o).length if hit[0] else None

    def tangent(v, n):
        t = v - n * v.dot(n)
        return t.normalized() if t.length > 1e-6 else Vector((0, 0, -1))

    def darts(pts, r, salt):
        """random points at least r apart over the given points (no rows, no rings)"""
        rng = random.Random(salt); idx = list(range(len(pts))); rng.shuffle(idx)
        grid = {}; out = []
        for i in idx:
            p = pts[i]; c = (int(p.x // r), int(p.y // r), int(p.z // r)); ok = True
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    for dz in (-1, 0, 1):
                        for s_ in grid.get((c[0] + dx, c[1] + dy, c[2] + dz), ()):
                            if (s_ - p).length < r: ok = False; break
                        if not ok: break
                    if not ok: break
                if not ok: break
            if ok: grid.setdefault(c, []).append(p); out.append(p)
        return out

    def clumps(pts, nor, along, r, salt):
        """CLUMPS, NOT LINKS: seeds r apart, each an ellipse (1.6 to 2.8 r long along the comb, 0.55 to 0.9 r wide), its
        own depth (0.55 to 1); the relief at a point is the deepest clump it sits in, 0 in the gaps between them"""
        sd = darts(pts, r, salt)
        kd = KDTree(len(sd))
        for i, s_ in enumerate(sd): kd.insert(s_, i)
        kd.balance()
        at = [(r * (stretch[0] + stretch[1] * hsh(i, salt + 1)), r * (0.55 + 0.35 * hsh(i, salt + 2)), 0.55 + 0.45 * hsh(i, salt + 3)) for i in range(len(sd))]
        out = []
        for p, n in zip(pts, nor):
            a = along(p - C, n); b_ = 0.0
            for co, i, d in kd.find_n(p, 6):
                if d > 3.0 * r: continue
                l, w, dep = at[i]
                dv = p - co; da = dv.dot(a); dw = (dv - a * da).length
                u = (da / l) ** 2 + (dw / w) ** 2
                if u < 1.0: b_ = max(b_, dep * math.sqrt(1.0 - u))
            out.append(b_)
        return out

    def three(pts, nor, along, salt):
        """three sizes, the way a head of hair is: big clumps the outline reads at 1:1, smaller ones inside for 128"""
        big = clumps(pts, nor, along, 0.020, salt); mid = clumps(pts, nor, along, 0.011, salt + 7); sm = clumps(pts, nor, along, 0.006, salt + 13)
        return [0.55 * a + 0.30 * b + 0.15 * c for a, b, c in zip(big, mid, sm)]

    K = Vector((0.0, 0.035, 0.168))   # the crown, where a head's hair turns (behind the top)

    def from_crown(q, n): return tangent(q - K, n)
    def front_to_back(q, n): return tangent(Vector((0, 1, -0.35 * sstep(0.10, 0.02, q.z))), n) if q.z > 0.07 else tangent(Vector((0, 0.5, -1)), n)
    def down(q, n): return tangent(Vector((0, 0, -1)), n)

    def drape(az, z0, z_end, off, drift=None, dz=0.008):
        """a lock's path: down the skull at its offset, then hanging (never back in, a flare of 0.12 of the drop), resting
        where it meets the shoulder; drift(z) moves its azimuth as it falls (a front lock swept to the side)"""
        path = []; r_max = 0.0; z = z0
        while z > z_end - 1e-6:
            a_ = drift(z) if drift else az
            r = skull_r(a_, z)
            r = (r + off) if r else r_max
            if r >= r_max: r_max = r
            else: r = r_max + 0.12 * 0.35 * dz; r_max = r
            d = Vector((math.sin(a_), -math.cos(a_), 0.0))
            p = C + Vector((0, 0, z)) + d * r
            if z < -0.13 and len(path) > 6:
                loc, nrm, _, _ = bvh_body.find_nearest(p)
                if loc is not None and (p - loc).dot(nrm) < 0.012: break
            path.append(p); z -= dz
        for _ in range(2):
            if len(path) > 2: path = [path[0]] + [(path[i - 1] + path[i] * 2 + path[i + 1]) / 4 for i in range(1, len(path) - 1)] + [path[-1]]
        return path

    def frame(path, i):
        n_ = len(path)
        t = (path[min(n_ - 1, i + 1)] - path[max(0, i - 1)])
        t = t.normalized() if t.length > 1e-9 else Vector((0, 0, -1))
        h = Vector((path[i].x - C.x, path[i].y - C.y, 0.0)); h = h.normalized() if h.length > 1e-6 else Vector((0, 1, 0))
        nn = (h - t * h.dot(t)); nn = nn.normalized() if nn.length > 1e-6 else Vector((1, 0, 0))
        return t, nn, t.cross(nn).normalized()

    def lens(bm, path, w0, th0, flip=0.0, seg=10):
        """a lock: a flat lens of clay, wide at the root, a point at the tip, one soft crease down its face"""
        n_ = len(path)
        if n_ < 3: return
        if flip:
            for i in range(n_):
                u = max(0.0, (i / (n_ - 1) - 0.72) / 0.28)
                h = Vector((path[i].x - C.x, path[i].y - C.y, 0.0)); h = h.normalized() if h.length > 1e-6 else Vector((0, 1, 0))
                path[i] = path[i] + h * (flip * u * u)
        rings = []
        for i, p in enumerate(path):
            t, nn, bb = frame(path, i); s_ = i / (n_ - 1)
            w = w0 * (0.75 + 0.25 * sstep(0.0, 0.12, s_)) * (1.0 - 0.80 * sstep(0.45, 1.0, s_))
            th = th0 * (1.0 - 0.55 * sstep(0.4, 1.0, s_))
            ring = []
            for k in range(seg):
                a = 2 * math.pi * k / seg
                g = 0.82 if k == 3 else 1.0
                ring.append(bm.verts.new(p + bb * (0.5 * w * math.cos(a)) + nn * (0.5 * th * math.sin(a) * g)))
            rings.append(ring)
        for i in range(n_ - 1):
            for k in range(seg):
                bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
        for ring, p in ((rings[0], path[0]), (rings[-1], path[-1])):
            c = bm.verts.new(p)
            for k in range(seg): bm.faces.new((ring[k], ring[(k + 1) % seg], c))

    def rope(bm, path, r0, pitch, ph, seg=8):
        """a loc: a tube with two strands twisted round it (a groove on a helix), thinning at the tip, a round end"""
        n_ = len(path)
        if n_ < 3: return
        rings = []; s_len = 0.0
        for i, p in enumerate(path):
            if i: s_len += (path[i] - path[i - 1]).length
            t, nn, bb = frame(path, i); s_ = i / (n_ - 1)
            r = r0 * (1.0 - 0.45 * sstep(0.70, 1.0, s_)) * (0.92 + 0.16 * math.sin(7.0 * s_ + ph))
            ring = []
            for k in range(seg):
                a = 2 * math.pi * k / seg
                tw = 1.0 - 0.24 * (0.5 + 0.5 * math.cos(2 * a - 2 * math.pi * s_len / pitch + ph))
                ring.append(bm.verts.new(p + (nn * math.cos(a) + bb * math.sin(a)) * r * tw))
            rings.append(ring)
        for i in range(n_ - 1):
            for k in range(seg):
                bm.faces.new((rings[i][k], rings[i][(k + 1) % seg], rings[i + 1][(k + 1) % seg], rings[i + 1][k]))
        for ring, p, sgn in ((rings[0], path[0], -1), (rings[-1], path[-1], 1)):
            t, _, _ = frame(path, 0 if sgn < 0 else n_ - 1)
            c = bm.verts.new(p + t * sgn * r0 * 0.5)
            for k in range(seg): bm.faces.new((ring[k], ring[(k + 1) % seg], c))

    def ellipsoid(bm, centre, ax, ay, az_, ra, rb, rc, nu=8, nv=6):
        """one plait segment: a small lens of clay on its own axes"""
        vs = []
        for j in range(1, nv):
            v = math.pi * j / nv
            row = []
            for i in range(nu):
                u = 2 * math.pi * i / nu
                row.append(bm.verts.new(centre + ax * (ra * math.cos(v)) + ay * (rb * math.sin(v) * math.cos(u)) + az_ * (rc * math.sin(v) * math.sin(u))))
            vs.append(row)
        top = bm.verts.new(centre + ax * ra); bot = bm.verts.new(centre - ax * ra)
        for i in range(nu):
            bm.faces.new((top, vs[0][(i + 1) % nu], vs[0][i]))
            bm.faces.new((bot, vs[-1][i], vs[-1][(i + 1) % nu]))
        for j in range(len(vs) - 1):
            for i in range(nu):
                bm.faces.new((vs[j][i], vs[j][(i + 1) % nu], vs[j + 1][(i + 1) % nu], vs[j + 1][i]))

    def piece(bm, name, subdiv=0):
        bm.normal_update()
        o = finish(bm, name, hair_mat, 0)
        if subdiv:
            ss = o.modifiers.new('ss', 'SUBSURF'); ss.levels = subdiv; ss.render_levels = subdiv
            bpy.context.view_layer.objects.active = o
            for x in sc.objects: x.select_set(x is o)
            bpy.ops.object.modifier_apply(modifier='ss')
        for f in o.data.polygons: f.use_smooth = True
        return o

    def hang_w(q):   # the head carries a cut; below the jaw it blends onto the neck, at the shoulders onto the torso
        a = sstep(-0.12, -0.19, q.z); c = sstep(-0.20, -0.28, q.z)
        w = {PM.HEAD_BONE: 1.0 - a, PM.NECK_BONE: a * (1.0 - c), 'torso_joint_3': a * c}
        return {k: v for k, v in w.items() if v > 1e-4}

    def nape(ab):   # where the hair grows to, low on the sides and the back (the skull's own hairline)
        return interp(ab, [(0.64, 0.010), (1.2, -0.035), (1.9, -0.070), (math.pi, -0.085)])

    return dict((k, v) for k, v in locals().items() if k != 'L')


def build(cut, L):
    """the cut's pieces, built into the barber's live scene; returns the barber's `made` items"""
    bpy, bmesh = L['bpy'], L['bmesh']
    Vector, BVHTree, KDTree, PM = L['Vector'], L['BVHTree'], L['KDTree'], L['PM']
    C, sc, az_of = L['C'], L['sc'], L['az_of']
    skull_bm, finish, shell, paint_scalp, fade_skin, hair_mat = L['skull_bm'], L['finish'], L['shell'], L['paint_scalp'], L['fade_skin'], L['hair_mat']
    spec = CUTS[cut]; tag = spec['tag']; B = spec['bank']
    made = []

    k = kit(L)
    bvh_head, bvh_body, skull_r, tangent, darts, clumps, three, K = (k[n] for n in ('bvh_head', 'bvh_body', 'skull_r', 'tangent', 'darts', 'clumps', 'three', 'K'))
    from_crown, front_to_back, down, drape, frame, lens, rope, ellipsoid, piece, hang_w, nape = (k[n] for n in (
        'from_crown', 'front_to_back', 'down', 'drape', 'frame', 'lens', 'rope', 'ellipsoid', 'piece', 'hang_w', 'nape'))

    # ================================================================== THE TAPERS
    if cut in ('DRY TAPER', 'DEEP TAPER'):
        lift = (0.40 - B['side']) * 0.20; fr = 0.112 + (0.16 - B['front']) * 0.30
        depth = 0.100 + (B['fade'] - 4) * 0.010
        salt = 5 if cut == 'DRY TAPER' else 9
        def line(q):
            ab = abs(az_of(q)); j = 0.004 * math.sin(7.0 * az_of(q) + 0.8 + salt) * math.cos(3.0 * az_of(q))
            return interp(ab, [(0.0, fr), (0.50, fr), (0.62, fr - 0.008), (0.82, 0.050 + lift), (1.6, 0.042 + lift), (2.4, 0.034 + lift), (math.pi, 0.030 + lift)]) + j
        def zone(q):
            ab = abs(az_of(q)); return ab >= 0.64 and max(line(q) - depth, nape(ab)) < q.z < line(q) + 0.003
        def band(q, i):
            dz = (line(q) - q.z + 0.016 * (hsh(i, salt) - 0.5)) / depth
            return 0 if dz < 0.30 else (1 if dz < 0.62 else (2 if dz < 0.94 else 3))
        paint_scalp(lambda q: q.z > line(q) - 0.002)
        made.append(fade_skin('barber_%s_fade' % tag, zone, band))
        def thick(pos, nor):
            rel = three(pos, nor, front_to_back, salt)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                t = 0.0006 + (0.0064 + 0.0055 * B['vol']) * sstep(0.0, 0.040, above) + 0.004 * sstep(0.10, 0.17, q.z)
                fw = sstep(-0.04, -0.13, q.y) * sstep(0.085, 0.135, q.z)
                t += 0.010 * fw
                t += (0.0045 * c - 0.0018) * sstep(0.0, 0.020, above)   # clumps up, gaps down, nothing at the line
                out.append(max(0.0004, t))
            return out
        made.append(shell('barber_%s' % tag, lambda q: q.z > line(q) - 0.002, thick, subdiv=2, rim=0.0012))

    # ================================================================== THE HEAVY FRINGE
    elif cut == 'HEAVY FRINGE':
        def line(q):
            ab = abs(az_of(q))
            notch = 0.006 * (hsh(int((az_of(q) + 4) * 34), 3) - 0.5) * sstep(0.9, 0.3, ab)   # a blunt edge, cut with scissors
            return interp(ab, [(0.0, 0.050), (0.45, 0.052), (0.70, 0.040), (1.05, -0.005), (1.5, -0.025), (2.2, -0.055), (math.pi, -0.065)]) + notch
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        def thick(pos, nor):
            rel_top = three(pos, nor, from_crown, 21); rel_dn = three(pos, nor, down, 27)
            out = []
            for p, n, a_, d_ in zip(pos, nor, rel_top, rel_dn):
                q = p - C; ab = abs(az_of(q)); above = q.z - line(q)
                t = 0.014 + 0.012 * sstep(0.0, 0.16, q.z)                       # vol 1
                t += 0.004 * sstep(0.08, 0.02, q.z) * sstep(0.9, 0.3, ab)         # the fringe's weight sits at its edge
                t *= (0.55 + 0.45 * sstep(0.0, 0.006, above)) if ab < 0.9 else (0.30 + 0.70 * sstep(0.0, 0.030, above))   # blunt at the front, tapered round the ears
                cr = d_ if q.z < 0.09 else a_
                t += 0.0080 * cr - 0.0030   # cycle 1: 4.5 mm of relief under black hair read as a smooth helmet
                out.append(max(0.002, t))
            return out
        made.append(shell('barber_heavy_fringe', lambda q: q.z > line(q) - 0.004, thick, subdiv=2, rim=0.004))
        # the fringe's edge in pieces: short locks over the brow, pointed, so the bang is hair and not a brim
        bm = bmesh.new(); rng = random.Random(29)
        for i in range(11):
            az = -0.85 + 1.7 * (i + 0.5) / 11 + 0.05 * (rng.random() - 0.5)
            lens(bm, drape(az, 0.105, 0.040 + 0.012 * rng.random() + 0.020 * sstep(0.5, 0.85, abs(az)), 0.022), 0.024 + 0.008 * rng.random(), 0.009, 0.0)
        for i in range(8):   # and over the ears
            u = (i + 0.5) / 8; az = (1.0 + 0.6 * u) * (1 if i % 2 else -1)
            lens(bm, drape(az, 0.060, -0.030 - 0.012 * rng.random(), 0.024), 0.030, 0.009, 0.0)
        made.append(piece(bm, 'barber_heavy_fringe_edge', subdiv=1))

    # ================================================================== THE SHAG
    elif cut == 'SHAG':
        def line(q):
            ab = abs(az_of(q)); j = 0.004 * math.sin(9.0 * az_of(q) + 0.5)
            return interp(ab, [(0.0, 0.090), (0.45, 0.088), (0.80, 0.050), (1.15, 0.000), (1.6, -0.040), (math.pi, -0.070)]) + j
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        def thick(pos, nor):
            rel = three(pos, nor, from_crown, 31)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                # a thin scalp of hair under the locks (cycle 1: a 10 to 18 mm cap buried locks set 12 mm off the skull, and
                # the shag read as a helmet); the locks carry the volume
                t = (0.0045 + 0.0025 * sstep(0.0, 0.16, q.z)) * (0.35 + 0.65 * sstep(0.0, 0.025, above))
                out.append(max(0.0015, t + 0.0025 * c - 0.001))
            return out
        made.append(shell('barber_shag_cap', lambda q: q.z > line(q) - 0.004, thick, subdiv=2, rim=0.002))
        bm = bmesh.new(); rng = random.Random(41)
        # the crown layer: short, all round, flipped out
        for i in range(11):
            az = -math.pi + 2 * math.pi * (i + 0.5) / 11 + 0.15 * (rng.random() - 0.5); ab = abs(az)
            z_end = interp(ab, [(0.0, 0.085), (0.8, 0.040), (math.pi, 0.010)]) + 0.020 * (rng.random() - 0.5)
            lens(bm, drape(az, 0.160, z_end, 0.026), 0.040 + 0.010 * rng.random(), 0.012, 0.008)
        # the jaw layer: round the sides and the back, longer, choppy, flipped out (flare 0.10)
        for i in range(15):
            u = (i + 0.5) / 15; az = 0.75 + u * (2 * math.pi - 1.5); az = az if az <= math.pi else az - 2 * math.pi; ab = abs(az)
            z_end = interp(ab, [(0.75, -0.020), (1.4, -0.050), (math.pi, -0.075)]) + 0.025 * (rng.random() - 0.5)
            lens(bm, drape(az, 0.128 + 0.012 * rng.random(), z_end, 0.016), 0.036 + 0.012 * rng.random(), 0.011, 0.010)
        # the fringe: choppy, to the middle of the brow
        for i in range(7):
            az = -0.50 + 1.0 * (i + 0.5) / 7 + 0.06 * (rng.random() - 0.5)
            lens(bm, drape(az, 0.140, 0.064 + 0.020 * rng.random(), 0.013), 0.030 + 0.008 * rng.random(), 0.010, 0.0)
        made.append(piece(bm, 'barber_shag_locks', subdiv=1))

    # ================================================================== THE CURTAIN CUT
    elif cut == 'CURTAIN CUT':
        def line(q):
            ab = abs(az_of(q)); j = 0.004 * math.sin(8.0 * az_of(q) + 2.1)
            return interp(ab, [(0.0, 0.100), (0.30, 0.094), (0.60, 0.064), (0.90, 0.020), (1.25, -0.045), (1.70, -0.085), (math.pi, -0.100)]) + j
        def away_from_part(q, n): return tangent(Vector((1.0 if q.x >= 0 else -1.0, 0.15, -0.45)), n)
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        def thick(pos, nor):
            rel = three(pos, nor, away_from_part, 51)
            out = []
            for p, n, c in zip(pos, nor, rel):
                q = p - C; above = q.z - line(q)
                t = (0.0050 + 0.0030 * sstep(0.0, 0.16, q.z)) * (0.25 + 0.75 * sstep(0.0, 0.030, above))   # a scalp under the locks
                part = math.exp(-(q.x / 0.0045) ** 2) * sstep(0.04, -0.03, q.y) * sstep(0.08, 0.12, q.z)
                out.append(max(0.0015, t - 0.004 * part + 0.0025 * c - 0.001))
            return out
        made.append(shell('barber_curtain_cut_cap', lambda q: q.z > line(q) - 0.004, thick, subdiv=2, rim=0.002))
        bm = bmesh.new(); rng = random.Random(53)
        # the mass: wide locks round the sides and the back to the jaw, overlapping, never one sheet with slits
        for i in range(18):
            u = (i + 0.5) / 18; az = 0.95 + u * (2 * math.pi - 1.9); az = az if az <= math.pi else az - 2 * math.pi; ab = abs(az)
            z_end = interp(ab, [(0.95, -0.065), (1.6, -0.085), (math.pi, -0.100)]) + 0.012 * (rng.random() - 0.5)
            lens(bm, drape(az, 0.130 + 0.020 * sstep(1.6, math.pi, ab), z_end, 0.015 + 0.004 * (i % 2)), 0.058 + 0.010 * rng.random(), 0.012, -0.004)
        # the two front curtains: from the part, swept out over the temples to the cheekbone
        for sgn in (-1, 1):
            for k, (to, ze, w) in enumerate(((0.95, -0.010, 0.050), (1.15, -0.030, 0.046))):
                drift = (lambda z, s=sgn, to=to: s * interp(z, [(-0.05, to), (0.06, to * 0.85), (0.12, 0.10), (0.15, 0.04)]))
                lens(bm, drape(sgn * 0.04, 0.146 - 0.006 * k, ze, 0.019 + 0.004 * k, drift), w, 0.012, -0.003)
        made.append(('weighted', piece(bm, 'barber_curtain_cut_locks', subdiv=1), hang_w))

    # ================================================================== THE ROPES (locs)
    elif cut in ('ROPE LOCKS', 'SHORT ROPES'):
        long_ = cut == 'ROPE LOCKS'
        def line(q):
            ab = abs(az_of(q)); j = 0.004 * math.sin(6.0 * az_of(q) + 1.3)
            fr = 0.110 if long_ else 0.106
            return interp(ab, [(0.0, fr), (0.45, fr - 0.004), (0.80, 0.050), (1.10, 0.000), (1.55, -0.045), (math.pi, -0.075)]) + j
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        made.append(shell('barber_%s_scalp' % tag, lambda q: q.z > line(q) - 0.004, lambda pos, nor: [0.0025] * len(pos), subdiv=1, rim=0.0015))
        # the sections: roots on random seeds over the scalp, a rope each
        bm_s = skull_bm(); roots_all = [v.co.copy() for v in bm_s.verts if v.index not in L['EAR'] and (v.co - C).z > line(v.co - C) + 0.008]; bm_s.free()
        roots = darts(roots_all, 0.029 if long_ else 0.025, 61)   # cycle 1: 24 mm sections and 12 mm ropes read as long straight hair at 128; a loc is a fat rope
        bm = bmesh.new(); rng = random.Random(67)
        for i, R in enumerate(roots):
            q = R - C; az = az_of(q); ab = abs(az); z0 = q.z
            if long_:
                z_end = interp(ab, [(0.0, -0.20), (1.2, -0.26), (math.pi, -0.34)]) + 0.04 * (rng.random() - 0.5)
                to = max(ab, 1.15)
            else:
                z_end = max(z0 - 0.10, interp(ab, [(0.0, 0.050), (0.9, -0.020), (math.pi, -0.070)])) + 0.02 * (rng.random() - 0.5)
                to = max(ab, 0.75)
            sgn = 1.0 if az >= 0 else -1.0
            drift = (lambda z, a0=az, s=sgn, to=to, z0=z0: a0 + (s * to - a0) * sstep(z0, z0 - 0.08, z)) if ab < to else None
            path = drape(az, z0, min(z_end, z0 - 0.03), (0.010 if long_ else 0.013) + 0.004 * rng.random(), drift)
            rope(bm, path, (0.0078 if long_ else 0.0070) * (0.85 + 0.30 * rng.random()), 0.030 + 0.008 * rng.random(), 6.28 * rng.random())
        o = piece(bm, 'barber_%s_ropes' % tag)
        made.append(('weighted', o, hang_w) if long_ else o)

    # ================================================================== THE DUST WEAVE (cornrows)
    elif cut == 'DUST WEAVE':
        def line(q):
            ab = abs(az_of(q)); return interp(ab, [(0.0, 0.104), (0.45, 0.100), (0.80, 0.050), (1.10, 0.005), (1.55, -0.040), (math.pi, -0.070)])
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        bm = bmesh.new()
        rows = [-0.130 + 0.026 * k for k in range(11)]   # cycle 1: seven rows over the top left the temples bare; cornrows wrap the sides
        for k, x in enumerate(rows):
            O = C + Vector((x, 0.0, 0.0)); path = []
            for step in range(0, 241):
                ph = math.radians(10 + step * 0.9)   # from the front, over the top, down the back
                d = Vector((0.0, -math.cos(ph), math.sin(ph)))
                hit = bvh_head.ray_cast(O, d, 0.5)
                if not hit[0]: continue
                p = hit[0]; q = p - C
                if q.z < line(q) - 0.002 and q.y < 0: continue        # not yet past the hairline at the front
                if q.y > 0 and q.z < nape(abs(az_of(q))) + 0.010: break   # reached the nape
                path.append(p + hit[1] * 0.0035)
            if len(path) < 4: continue
            # resample every 9 mm
            res = [path[0]]; acc = 0.0
            for a_, b_ in zip(path, path[1:]):
                acc += (b_ - a_).length
                if acc >= 0.009: res.append(b_); acc = 0.0
            # the hanging tail from the nape, straight down the neck to side 0.95
            tail = drape(az_of(res[-1] - C), res[-1].z - C.z - 0.009, -0.150 - 0.015 * hsh(k, 7), 0.008)
            res += tail[1:]
            for i in range(len(res)):
                t, nn, bb = frame(res, i)
                sgn = 1 if i % 2 else -1
                s_ = i / max(1, len(res) - 1)
                sc_ = 1.0 - 0.35 * sstep(0.75, 1.0, s_)
                ax = (t + bb * (0.45 * sgn)).normalized()      # each strand of the plait crosses at an angle: the chevron
                ay = nn.cross(ax).normalized()
                ellipsoid(bm, res[i] + bb * (0.0026 * sgn), ax, ay, nn, 0.0078 * sc_, 0.0050 * sc_, 0.0042 * sc_)
        made.append(('weighted', piece(bm, 'barber_dust_weave_braids'), hang_w))
        made.append(shell('barber_dust_weave_scalp', lambda q: q.z > line(q) - 0.004, lambda pos, nor: [0.0008] * len(pos), subdiv=1, rim=0.0))

    return made
