#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look], GARMENTS BASE: THE EIGHTY CANON TOPS ON THE BARBER'S MANNEQUIN
(the roll call's fourth batch, base first; rule 115c: modelled at the source and rendered through DIRECTION's rig).

The alpha's wardrobe draws its 80 base tops with two functions (genTop and genCoverall) and their options: the sleeve
(none, short, rolled, long), the neck (crew, henley, button, turtle, hood), the print (plaid, stripe), tatters, the
runway's two proportions (shoulder wide or arc, cut long or layered), the hoodie's pocket and hood, the coverall's bib and
short legs. Each OPTION is modelled here ONCE as clay on the rig's man, and each top wears its own ramp (mid for the cloth,
dk and lt for its trim, as the flat draws them), read off the alpha, never edited. THE NAME SAYS WHAT THE OLD OPTIONS
NEVER COULD: the first tops in the bank (RED SHIRT, GREEN FLANNEL, BONE HENLEY ...) predate the neck and print options and
are drawn as one long crew, so where a top carries no neck or print its name fills them in (a FLANNEL is a plaid button
shirt, a HENLEY a henley, a WORK SHIRT has chest pockets, a TEE is short); every option the alpha does carry wins.

    THE BODY OF THE TOP   the man's own skin from neck to hem, cut finer and lifted (THIS LANE's lift, at the fine level:
                          the neckline, the armholes and the sleeve's hem are cut on the subdivided cloth, not the man's
                          coarse faces), 5 to 12 mm off him by the cloth's weight
    NECKS                 crew: a rib band; henley: the rib and a three-button placket; button: a collar stand, two collar
                          points and a placket of six down to the tail; turtle: a ribbed tube up the neck to the jaw with a
                          roll at the top (on the portrait's neck, with the head); hood: the hood lying in a heap on the
                          upper back, the crossover band and two drawstrings (hood up: a shell over the head, framing the
                          face, falling to the shoulders)
    SLEEVES               short: cut half down the upper arm, standing off it, a hem band; long: a cuff; rolled: cut at
                          mid-forearm with a fat roll in the ramp's light
    HEMS                  a tee's band; a shirt's curved tail, longer front and back; a hoodie's ribbed waistband; the
                          runway's longline to mid-thigh and its layered cut (a longer under-layer in the ramp's dark);
                          the tattered hem torn and holed
    THE COVERALL          the top and the legs one colour, a collar, the zip and the waist in the dark, two chest pockets,
                          the cuffs; BIB OVERALLS the bib on two straps crossed at the back, the arms and the chest bare;
                          SHORTALLS cut at the knee
    PRINTS                THIS LANE's prints in metres (plaid 16 cm, stripes 6.4 cm, a shirt's stripe a chalk line),
                          mapped round the body on every piece the eye sees

Built per top through the barber (tools/bohemia_character_the_barber_on_the_skull.py build BASE1 | BASE1:<n,n>): the
body here (THIS LANE's tool with an extra() hook, LOOKS 'G_<tag>' in memory), then PORTRAIT's starred head on it in the
TEMPLE TAPER, then the rig, unedited. The twin: node tools/bohemia_character_the_barber_on_the_skull_flat.js with
CUTS=BASE:<name>,...

REUSE CHECK: the man, his lift, tube, section, prints and stand pose are THIS LANE's tool, imported whole; the head and
the cut are PORTRAIT's head and the barber's taper; the rings are the shemagh's wound cloth (HATS 1); the render is
DIRECTION's master rig; nothing is drawn by hand.
REFERENCE CHECK (the 9/4 standing duty): the twin is the game's own flat top as the body wears it today (buildFrame,
eight facings, 1:1); the runway names (Rick Owens, Balenciaga, Bottega Veneta) for the two proportions; analog horror
AH-01; no reference game.
"""
import json
import math
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
ROLL = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_ROLL_CALL.json')
RIG_DIR = os.path.join(ROOT, 'records/character/rig')
FAMS = ['head', 'neck', 'torso', 'upper', 'fore', 'hand', 'thigh', 'shin', 'foot']


def sstep(a, b, t):
    t = max(0.0, min(1.0, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)


def slug(n):
    return n.lower().replace(' ', '_')


def read_bank():
    """the 80 base tops in the roll call's order, each with its gen options and its ramp, off the alpha (read only)"""
    src = open(ALPHA).read()
    ramps = {}
    for m in re.finditer(r"\b([A-Z][A-Z0-9_]*)=\{dk:\[(\d+),(\d+),(\d+)\],mid:\[(\d+),(\d+),(\d+)\],lt:\[(\d+),(\d+),(\d+)\][,}]", src):
        v = [int(x) for x in m.groups()[1:]]
        ramps.setdefault(m.group(1), dict(dk=tuple(v[0:3]), mid=tuple(v[3:6]), lt=tuple(v[6:9])))
    names = [r['name'] for r in json.load(open(ROLL))['assets'] if r.get('batch') == 'garments: base']
    out = []
    for n in names:
        line = re.search(r"\{n:'" + re.escape(n) + r"'[^\n]*", src).group(0)
        g = re.search(r"(genTop|genCoverall)\(g,\{ramp:(\w+)([^}]*)\}", line)
        o = dict(re.findall(r"(\w+):('[^']*'|true|false|\w+)", g.group(3)))
        o = {k: (v.strip("'") if v.startswith("'") else v == 'true' if v in ('true', 'false') else v) for k, v in o.items()}
        sl = o.get('sleeves', True)
        sl = 'long' if sl is True else 'none' if sl is False else sl
        G = dict(name=n, tag='base_' + slug(n), fn=g.group(1), ramp=g.group(2), sleeves=sl, neck=o.get('neck'),
                 pattern=o.get('pattern'), tatter=bool(o.get('tatter')), shoulder=o.get('shoulder'), cut=o.get('cut'),
                 pocket=bool(o.get('pocket')), hood_up='hoodDefaultUp:true' in line, bib=bool(o.get('bib')), short=bool(o.get('short')),
                 **ramps[g.group(2)])
        # THE NAME SAYS WHAT THE OLD OPTIONS NEVER COULD (the docstring): only where the alpha carries no neck and no print
        w = set(re.split(r'[ -]', n))   # whole words (STEEL is not a TEE)
        if G['fn'] == 'genTop' and not G['neck'] and not G['pattern']:
            if w & {'FLANNEL', 'PLAID'}: G['neck'], G['pattern'] = 'button', 'plaid'
            elif 'HENLEY' in w: G['neck'] = 'henley'
            elif 'TEE' in w: G['neck'] = 'crew'; G['sleeves'] = 'short' if G['sleeves'] == 'long' else G['sleeves']
            elif 'SHIRT' in w and 'LONGSLEEVE' not in w: G['neck'] = 'button'
        G['neck'] = G['neck'] or 'crew'
        G['pockets'] = 'WORK' in w and 'SHIRT' in w
        G['shape'] = shape_of(G)
        out.append(G)
    return out


def shape_of(G):
    if G['fn'] == 'genCoverall': return 'SHORTALLS' if G['short'] else 'BIB OVERALLS' if G['bib'] else 'COVERALLS'
    if G['shoulder'] or G['cut']: return 'THE RUNWAY CUTS'
    if G['tatter']: return 'TATTERED'
    if G['neck'] == 'hood': return 'HOOD UP' if G['hood_up'] else 'HOODIE'
    if G['neck'] == 'turtle': return 'TURTLENECK'
    if G['sleeves'] == 'rolled': return 'ROLLED SLEEVE'
    if G['neck'] == 'henley': return 'HENLEY'
    if G['neck'] == 'button': return 'FLANNEL' if G['pattern'] == 'plaid' else 'WORK SHIRT' if G['pockets'] else 'BUTTON SHIRT'
    if G['sleeves'] == 'none': return 'TANK'
    return 'TEE' if G['sleeves'] == 'short' else 'LONGSLEEVE'


SHAPES = ['TANK', 'TEE', 'LONGSLEEVE', 'HENLEY', 'BUTTON SHIRT', 'WORK SHIRT', 'FLANNEL', 'ROLLED SLEEVE', 'TURTLENECK', 'HOODIE',
          'HOOD UP', 'TATTERED', 'COVERALLS', 'BIB OVERALLS', 'SHORTALLS', 'THE RUNWAY CUTS']
BANK = read_bank()
BY = {G['name']: G for G in BANK}
CUTS = {}
for _G in BANK:
    CUTS['BASE ' + _G['name']] = dict(tag=_G['tag'], garment=_G['name'], body='records/character/rig/g_%s.glb' % slug(_G['name']),
                                      as_cut='TEMPLE TAPER', bank=dict(ramp='H_BLK', vol=0, side=0.40, front=0.16, fade=4),
                                      hair=('cloth_black', 0), zcap=0.3, worn_by='the roll call: ' + _G['name'])
ORDER = ['BASE ' + G['name'] for G in sorted(BANK, key=lambda G: (SHAPES.index(G['shape']), G['name']))]
# three cards, never one of eighty rows: the shirts, the collars, the heavy ones and the runway's two proportions
PARTS = [('THE SHIRTS', 'character-base-one-the-shirts-10-19', ['TANK', 'TEE', 'LONGSLEEVE', 'HENLEY']),
         ('THE COLLARS', 'character-base-one-the-collars-10-19', ['BUTTON SHIRT', 'WORK SHIRT', 'FLANNEL', 'ROLLED SLEEVE']),
         ('THE HEAVY ONES AND THE RUNWAY', 'character-base-one-the-heavy-and-the-runway-10-19',
          ['TURTLENECK', 'HOODIE', 'HOOD UP', 'TATTERED', 'COVERALLS', 'BIB OVERALLS', 'SHORTALLS', 'THE RUNWAY CUTS'])]


def pick(arg):
    """BASE1:<name>,<name> (or tags, or shape names) -> the cuts"""
    want = [w.strip().upper() for w in arg.split(':', 1)[1].split(',')]
    return [c for c in ORDER if CUTS[c]['garment'] in want or CUTS[c]['tag'].upper() in want or BY[CUTS[c]['garment']]['shape'] in want]


def lum(c):
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


SAT = 1.4   # measured on the first top (RED SHIRT, S): the rig's dust and wear took the red's spread from 79 to 57 values


def src(c):
    """the cloth at the source, so the render lands on the flat's colour: the ramp's step pushed SAT times as far from its
    own grey (the rig's source pass desaturates every cloth toward its pale warm dust)"""
    g = lum(c)
    return tuple(int(max(0, min(255, round(g + (v - g) * SAT)))) for v in c)


def at_source(G):
    return dict(G, mid=src(G['mid']), dk=src(G['dk']), lt=src(G['lt']))


def prints(G):
    """THIS LANE's prints in metres, on every piece of the top the eye sees"""
    if G['pattern'] == 'plaid': spec = ('plaid', G['mid'], G['dk'], G['lt'])
    elif G['pattern'] == 'stripe':
        line = G['dk'] if lum(G['mid']) > 140 else G['lt']
        spec = ('pinstripe' if G['neck'] == 'button' else 'stripe', G['mid'], line)
    else: return {}
    return {k: spec for k in ('body:shirt', 'shirt', 'collar', 'tail', 'placket', 'pocket', 'sleeve_hem')}


def body(cut):
    """the mannequin in this top: THIS LANE's tool builds LOOKS 'G_<tag>' (in memory) to records/character/rig/g_<tag>.glb"""
    import sys
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_character_the_thirteen_through_the_rig as CH
    G = at_source(BY[CUTS[cut]['garment']])
    L = dict(CH.LOOKS['Body']); L = {k: (dict(v) if isinstance(v, dict) else v) for k, v in L.items()}
    L['worn'] = dict(L['worn'], base=G['name'], feet='WRAPPED BOOTS')
    L['shoes'] = dict(colour=(54, 52, 54), kind='boot', top=0.20)   # the barber's WRAPPED BOOTS (BARBER_BODY)
    L['hair'] = dict(style='taper', colour=CH.HAIR_DARK); L['order'] = 100
    L['shape'] = 'the barber\'s mannequin in %s (%s)' % (G['name'], G['shape'])
    L['shirt'] = dict(colour=G['mid'], sleeve={'none': 'none', 'short': 'short'}.get(G['sleeves'], 'long'))
    if G['fn'] == 'genCoverall':
        L['trousers'] = dict(colour=G['mid'], wide=0.014, crop=0.355 if G['short'] else 0.0)
    L['extra'] = lambda X, G=G: pieces(G, X)
    name = 'G_' + slug(G['name'])
    CH.LOOKS[name] = L
    CH.PRINTS[name] = prints(G)
    CH.build(name, RIG_DIR)


def pieces(G, X):
    """the top on the man (called inside THIS LANE's build with its locals): repaint the body, return the pieces"""
    bpy, bmesh, V = X['bpy'], X['bmesh'], X['V']
    from mathutils.bvhtree import BVHTree
    from mathutils.kdtree import KDTree
    body, arm, M, Mi, R, P = X['body'], X['arm'], X['M'], X['Mi'], X['R'], X['P']
    fam_v, ffam, finish, tube, sc, tag = X['fam_v'], X['ffam'], X['finish'], X['tube'], X['sc'], X['tag']
    mid, dk, lt = G['mid'], G['dk'], G['lt']
    coverall, bib = G['fn'] == 'genCoverall', G['bib']
    sleeves = 'long' if coverall and not bib else ('none' if bib else G['sleeves'])
    neck = 'button' if coverall and not bib else G['neck']
    bvh = BVHTree.FromPolygons([V(p) for p in P], [list(f.vertices) for f in body.data.polygons])
    kd = KDTree(len(P))
    for i, p in enumerate(P): kd.insert(p, i)
    kd.balance()
    gname = {g.index: g.name for g in body.vertex_groups}
    vw = [[(gname[g.group], g.weight) for g in v.groups] for v in body.data.vertices]
    B = arm.data.bones; Aw = arm.matrix_world
    SH, EL, WR = (Aw @ B[b].head_local for b in ('Skeleton_arm_joint_L__4_', 'Skeleton_arm_joint_L__3_', 'Skeleton_arm_joint_L__2_'))
    cy_n = -0.02   # the neck's axis, front to back (the neck spans y -0.10 .. 0.045 with the jaw's underside)

    def arm_s(fm, c):
        """0 at the shoulder, 1 at the elbow, 2 at the wrist (the left arm's joints, mirrored)"""
        q = V((abs(c.x), c.y, c.z))
        if fm == 'upper': a, b, k = SH, EL, 0.0
        elif fm == 'fore': a, b, k = EL, WR, 1.0
        else: return -1.0
        d = b - a; return k + max(0.0, min(1.0, (q - a).dot(d) / d.length_squared))

    sleeve_end = {'none': -1.0, 'short': 0.52, 'rolled': 1.45, 'long': 1.93}[sleeves]

    def neck_z(c):
        """the neckline's height round the neck: front (-y) to back"""
        a = math.atan2(c.x, -(c.y - cy_n)); f = 0.5 + 0.5 * math.cos(a)   # 1 at the front, 0 at the back
        return {'crew': 1.135 - 0.018 * f, 'henley': 1.135 - 0.018 * f, 'button': 1.150 - 0.030 * f, 'turtle': 1.160,
                'hood': 1.140 - 0.024 * f}[neck]

    def tank_bare(c):
        if c.z > 1.025: return not (0.036 < abs(c.x) < 0.082)                                          # the straps
        if c.y < -0.02 and abs(c.x) < 0.050 and c.z > 0.985: return True                               # the scoop
        return abs(c.x) > 0.088 and c.z > 0.95                                                         # the armholes

    def bib_covers(c):
        return c.z < 0.725 or (c.y < 0.0 and abs(c.x) < 0.078 and c.z < 1.005)

    # cycle 2 (looking, TATTERED FLANNEL): pin holes over a body painted in the same plaid did not read; holes 3 to 4 cm across,
    # and under a torn top the man is skin above the belt, so a hole shows him
    hole = lambda c: G['tatter'] and (0.5 + 0.5 * math.sin(19 * c.x + 7 * c.z + 0.4) * math.cos(15 * c.y - 11 * c.z + 1.7 * c.x)) > 0.86

    def covered(fm, c):
        """the top covers this point of the man"""
        if fm == 'torso':
            if sleeves == 'none' and not coverall and tank_bare(c): return False
            if bib: return bib_covers(c)
            if G['tatter'] and 0.66 < c.z < 1.06: return False
            return c.z < neck_z(c) + 0.004
        if fm == 'neck': return neck in ('turtle',) or c.z < neck_z(c)
        if fm in ('upper', 'fore'): return arm_s(fm, c) <= sleeve_end
        return False

    # 1. THE MAN'S OWN SURFACE REPAINTED: the shirt where the top covers him, skin where it does not
    for f in body.data.polygons:
        fm = ffam(f); c = M @ f.center
        if fm in ('torso', 'neck', 'upper', 'fore'): f.material_index = 1 if covered(fm, c) else 0
    body.data.update()

    made = []

    def weigh(o):
        """every vertex takes the weights of the man's nearest vertex"""
        groups = {}
        for v in o.data.vertices:
            _, i, _ = kd.find(M @ v.co)
            for nm, w in vw[i]:
                if nm not in groups: groups[nm] = o.vertex_groups.new(name=nm)
                groups[nm].add([v.index], w, 'REPLACE')
        return o

    def new_obj(bm, key):
        for v in bm.verts: v.co = Mi @ v.co
        me = bpy.data.meshes.new('%s_%s' % (tag, key)); bm.to_mesh(me); bm.free()
        g = bpy.data.objects.new('%s_%s' % (tag, key), me); sc.collection.objects.link(g)
        g.parent = body.parent; g.matrix_world = M
        return weigh(g)

    def cloth(key, keep, thick, colour, rim=0.005, levels=2, fams=('torso', 'neck', 'upper', 'fore')):
        """THIS LANE's lift at the fine level: the man's faces in fams, cut finer, kept by keep(family, point), lifted"""
        g = body.copy(); g.data = body.data.copy(); g.name = '%s_%s' % (tag, key); sc.collection.objects.link(g)
        for md in list(g.modifiers): g.modifiers.remove(md)
        bm = bmesh.new(); bm.from_mesh(g.data); bm.faces.ensure_lookup_table()
        fl = bm.faces.layers.int.new('fam')
        for f in bm.faces: f[fl] = FAMS.index(ffam(body.data.polygons[f.index]))
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if FAMS[f[fl]] not in fams], context='FACES')
        for _ in range(levels): bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if not keep(FAMS[f[fl]], M @ f.calc_center_median())], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = M @ v.co; n = (R @ v.normal).normalized(); v.co = Mi @ (p + n * thick(p))
        bm.to_mesh(g.data); bm.free()
        if not len(g.data.polygons): bpy.data.objects.remove(g, do_unlink=True); return None
        return finish(g, colour, key, 1, rim)

    def surf(p):
        loc, n, _, _ = bvh.find_nearest(p); return loc, n

    def front(x, z, side=-1):
        """the man's surface straight in front of (side -1) or behind (+1) the point (x, z)"""
        hit = bvh.ray_cast(V((x, side * 0.6, z)), V((0, -side, 0)), 1.2)
        return hit[0] if hit[0] else V((x, side * 0.1, z))

    def strip(key, path, width, th, colour, across=5, rim=0.004, subdiv=1):
        """a ribbon laid on the man along path (world points, projected), width(t) across, th off his skin; one object for
        every path in the list (pockets, straps, a placket)"""
        bm = bmesh.new()
        for pts in path:
            Q = [surf(p) for p in pts]; m = len(Q); rows = []
            for j, (q, n) in enumerate(Q):
                t = (Q[min(m - 1, j + 1)][0] - Q[max(0, j - 1)][0]).normalized(); cr = n.cross(t).normalized()
                w = width(j / max(1, m - 1)) if callable(width) else width
                row = []
                for k in range(across):
                    u = (k / (across - 1) - 0.5) * w
                    loc, nn = surf(q + cr * u); row.append(bm.verts.new(loc + nn * th))
                rows.append(row)
            for j in range(m - 1):
                for k in range(across - 1):
                    bm.faces.new((rows[j][k], rows[j][k + 1], rows[j + 1][k + 1], rows[j + 1][k]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        return finish(new_obj(bm, key), colour, key, subdiv, rim)

    def ring_pts(o, u, w, n=48, off=0.0, r_fn=None):
        """points round an axis (o, u x w plane) on the man's surface, off it by off(angle)"""
        pts = []; last = 0.05
        for i in range(n):
            a = 2 * math.pi * i / n; d = (u * math.cos(a) + w * math.sin(a)).normalized()
            hit = bvh.ray_cast(o, d, 0.4)
            r = (hit[0] - o).length if hit[0] else last; last = r
            if r_fn: r = r_fn(a, r)
            pts.append((o + d * (r + (off(a) if callable(off) else off)), d))
        return pts

    def band(key, rings, wid, th, colour, seg=8, subdiv=1, groove=None):
        """a band of cloth round the man along each ring (the shemagh's wound cloth): wid along the axis, th out"""
        bm = bmesh.new()
        for pts in rings:
            n = len(pts); R_ = []
            for i, (p, d) in enumerate(pts):
                t = (pts[(i + 1) % n][0] - pts[i - 1][0]).normalized(); nn = (d - t * d.dot(t)).normalized(); bb = t.cross(nn).normalized()
                gr = groove(2 * math.pi * i / n) if groove else 0.0
                R_.append([bm.verts.new(p + bb * (0.5 * wid * math.cos(2 * math.pi * j / seg)) + nn * ((0.5 + 0.5 * math.sin(2 * math.pi * j / seg)) * (th - gr)))
                           for j in range(seg)])
            for i in range(n):
                for j in range(seg):
                    bm.faces.new((R_[i][j], R_[i][(j + 1) % seg], R_[(i + 1) % n][(j + 1) % seg], R_[(i + 1) % n][j]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        return finish(new_obj(bm, key), colour, key, subdiv, 0)

    def arm_ring(s, off=0.0):
        """the rings round both arms at arm parameter s (0 shoulder, 1 elbow, 2 wrist)"""
        out = []
        for sx in (1, -1):
            a, b = (SH, EL) if s <= 1 else (EL, WR); t = s if s <= 1 else s - 1
            m = lambda p: V((p.x * sx, p.y, p.z))
            o = m(a).lerp(m(b), t); ax = (m(b) - m(a)).normalized()
            u = ax.cross(V((0, 0, 1))).normalized(); w = ax.cross(u).normalized()
            out.append(ring_pts(o, u, w, n=32, off=off))
        return out

    def neck_ring(z_of, off):
        """the neckline: a ring round the neck's axis at the height z_of(point) gives"""
        pts = []; last = 0.06
        for i in range(48):
            a = 2 * math.pi * i / 48; d = V((math.sin(a), -math.cos(a), 0.0))
            z = z_of(V((math.sin(a) * 0.05, cy_n - math.cos(a) * 0.05, 1.13)))
            o = V((0.0, cy_n, z)); hit = bvh.ray_cast(o, d, 0.4)
            r = (hit[0] - o).length if hit[0] else last; last = r
            pts.append((o + d * (r + (off(a) if callable(off) else off)), d))
        return pts

    def waist_ring(z, off):
        o = V((0.0, X['section'](z, ('torso',))['cy'], z))
        return ring_pts(o, V((1, 0, 0)), V((0, -1, 0)), n=56, off=off)

    def buttons(key, at, colour, r=0.0052, lift_=0.006):
        bm = bmesh.new()
        for p in at:
            loc, n = surf(p)
            res = bmesh.ops.create_uvsphere(bm, u_segments=8, v_segments=5, radius=r)
            for v in res['verts']: v.co = loc + n * (lift_ + r * 0.3) + V((v.co.x, v.co.y, v.co.z * 0.6))
        return finish(new_obj(bm, key), colour, key, 0, 0)

    # 2. THE BODY OF THE TOP, cut finer and lifted by the cloth's weight
    weight = 0.011 if neck == 'hood' else 0.009 if coverall else 0.005 if sleeves == 'none' else 0.007
    def keep_top(fm, c):
        if fm not in ('torso', 'neck', 'upper', 'fore'): return False
        if hole(c) and fm == 'torso' and c.z < 1.06: return False
        if fm in ('upper', 'fore'):
            s = arm_s(fm, c)
            if G['tatter']: s += 0.10 * (abs(((7 * math.atan2(c.y, c.z - 1.0) + 31 * c.x) % 2.0) - 1.0) - 0.5)   # torn cuffs, in points
            return s <= sleeve_end
        if fm == 'neck': return neck == 'turtle' and c.z < 1.166
        if sleeves == 'none' and not coverall and tank_bare(c): return False
        if bib: return False
        return c.z < neck_z(c) and c.z > 0.615
    def thick_top(p):
        t = weight
        q = V((abs(p.x), p.y, p.z))
        if sleeves == 'short': t += 0.007 * sstep(0.12, 0.26, q.x) * sstep(1.12, 0.98, p.z)              # a tee's sleeve stands off the arm
        if G['shoulder'] == 'wide':   # the square pad: the line runs past the arm, then drops
            t += 0.030 * sstep(0.06, 0.13, q.x) * sstep(0.22, 0.17, q.x) * sstep(0.99, 1.06, p.z)
        if G['shoulder'] == 'arc':    # the cocoon dome: one curve neck to elbow, no point
            sp = (q - SH).dot((EL - SH).normalized()) / (EL - SH).length
            t += 0.032 * math.exp(-((sp - 0.15) / 0.42) ** 2) * sstep(0.04, 0.10, q.x) * sstep(0.90, 1.02, p.z)
        return t
    if not bib:
        made.append(cloth('shirt', keep_top, thick_top, mid, rim=0.004))

    # 3. THE NECK
    nz = lambda c: neck_z(c) - 0.004
    if neck in ('crew', 'henley') and sleeves != 'none':
        made.append(band('collar', [neck_ring(nz, weight + 0.001)], 0.013, 0.006, mid, groove=lambda a: 0.0012 * max(0.0, math.cos(70 * a)) ** 2))
    if neck == 'henley':
        top_z = neck_z(V((0, -0.1, 1.13)))
        made.append(strip('placket', [[front(0.0, z) for z in (top_z - 0.004, 1.08, 1.04, 1.005)]], 0.024, weight + 0.003, mid))
        made.append(buttons('buttons', [front(0.0, z) for z in (1.098, 1.066, 1.034)], lt, lift_=weight + 0.006))
    if neck == 'button':
        # the stand round the neck, two collar points falling onto the chest, the placket down to the tail, six buttons
        made.append(band('collar', [neck_ring(lambda c: neck_z(c) + 0.004, weight + 0.002)], 0.022, 0.007, mid))
        pts = []
        for sx in (1, -1):
            pts.append([front(sx * 0.052, 1.145), front(sx * 0.044, 1.118), front(sx * 0.030, 1.086)])
        made.append(strip('collar_points', pts, lambda t: 0.034 * (1.0 - 0.75 * t), weight + 0.010, mid, across=5))
        zs = [1.105 - k * 0.075 for k in range(6)] if not coverall else []
        made.append(strip('placket', [[front(0.0, z) for z in (1.118, 1.0, 0.85, 0.70, 0.62)]], 0.026 if not coverall else 0.012,
                          weight + 0.003, mid if not coverall else dk))
        if zs: made.append(buttons('buttons', [front(0.0, z) for z in zs], dk if lum(mid) > 120 else lt, lift_=weight + 0.006))
    if neck == 'hood':
        made.append(band('collar', [neck_ring(nz, weight + 0.003)], 0.020, 0.010, mid))
        if not G['hood_up']:   # the hood lies in a heap on the upper back
            # cycle 2 (looking, OLIVE HOODIE): a 40 mm heap read at 1:1 as a pale fur collar (its top takes the rig's dust);
            # 55 mm, rounder and higher, it rises to the base of the skull as a folded hood does
            def keep_h(fm, c): return fm in ('torso', 'neck') and c.y > -0.005 and abs(c.x) < 0.115 and 0.99 < c.z < 1.175
            def thick_h(p):
                return weight + 0.006 + 0.055 * math.exp(-((p.x / 0.085) ** 2)) * math.exp(-(((p.z - 1.115) / 0.065) ** 2))
            made.append(cloth('hood', keep_h, thick_h, mid, rim=0.006, fams=('torso', 'neck')))
        cords = [[front(sx * 0.024, 1.116), front(sx * 0.026, 1.07), front(sx * 0.027, 1.035)] for sx in (1, -1)]
        made.append(strip('drawstrings', cords, 0.0065, weight + 0.006, lt, across=3, rim=0.003))
        if G['pocket']:
            made.append(strip('pocket', [[front(0.0, z) for z in (0.815, 0.77, 0.72, 0.675)]], lambda t: 0.120 + 0.050 * t, weight + 0.004, mid, across=7))
        made.append(band('waistband', [waist_ring(0.640, weight + 0.001)], 0.040, 0.007, mid, groove=lambda a: 0.0012 * max(0.0, math.cos(90 * a)) ** 2))

    # 4. THE SLEEVES' ENDS
    if sleeves == 'short':
        made.append(band('sleeve_hem', arm_ring(0.50, weight + 0.012), 0.014, 0.005, mid))
    if sleeves == 'long' or (coverall and not bib):
        made.append(band('cuffs', arm_ring(1.86, weight + 0.001), 0.030 if neck == 'hood' else 0.024, 0.006, dk if coverall else mid,
                         groove=(lambda a: 0.0010 * max(0.0, math.cos(24 * a)) ** 2) if neck == 'hood' else None))
    if sleeves == 'rolled':
        made.append(band('roll', arm_ring(1.40, weight + 0.002), 0.034, 0.013, lt))

    # 5. THE HEM
    sec = X['section']
    if neck == 'button' and not coverall:   # the shirt's curved tail, longer at the front and the back
        made.append(tube('tail', 0.70, lambda a: 0.588 + 0.036 * abs(math.cos(a)) ** 2, lambda z: weight + 0.008 + 0.004 * sstep(0.66, 0.59, z), mid, thick=0.005))
    elif G['tatter']:
        rag = lambda a: 0.565 + 0.055 * abs(((9 * a / math.pi + 0.3 * math.sin(3 * a)) % 2.0) - 1.0)   # torn in points, 5.5 cm deep
        made.append(tube('tail', 0.70, rag, lambda z: weight + 0.008, mid, thick=0.005,
                         ang_ok=lambda a, z: (0.5 + 0.5 * math.sin(13 * a) * math.cos(40 * z + 2 * a)) < 0.93))
    elif sleeves != 'none' and neck in ('crew', 'henley', 'turtle') and not G['cut']:
        made.append(band('hem', [waist_ring(0.628, weight + 0.001)], 0.012, 0.005, mid))
    if G['cut'] == 'long':      # longline: the hem carries past the hip to mid-thigh, one mass over the legs
        made.append(tube('longline', 0.70, lambda a: 0.445, lambda z: weight + 0.008 + 0.026 * sstep(0.66, 0.445, z), mid, thick=0.006))
    if G['cut'] == 'layered':   # two hems: a longer, narrower under-layer in the dark, the top layer stopping past the waist
        made.append(tube('under', 0.70, lambda a: 0.478, lambda z: weight + 0.006 + 0.012 * sstep(0.66, 0.478, z), dk, thick=0.005))
        made.append(tube('over', 0.72, lambda a: 0.575, lambda z: weight + 0.022 + 0.014 * sstep(0.70, 0.575, z), mid, thick=0.006))

    # 6. POCKETS
    if G['pockets'] or (coverall and not bib):
        pk = []; flap = []
        for sx in (1, -1):
            pk.append([front(sx * 0.052, z) for z in (1.030, 1.0, 0.965)])
            flap.append([front(sx * 0.052, z) for z in (1.036, 1.020)])
        made.append(strip('pocket', pk, 0.046, weight + 0.004, dk if coverall else mid, across=5))
        made.append(strip('flap', flap, 0.050, weight + 0.009, dk if coverall else mid, across=5))

    # 7. THE COVERALL'S BELT, THE BIB AND ITS STRAPS
    if coverall:
        made.append(band('belt', [waist_ring(0.665, weight + (0.001 if not bib else 0.004))], 0.030, 0.007, dk))
    if bib:
        def keep_b(fm, c): return fm == 'torso' and bib_covers(c) and c.z > 0.615
        made.append(cloth('bib', keep_b, lambda p: 0.008, mid, rim=0.005, fams=('torso',)))
        straps = []
        for sx in (1, -1):
            straps.append([front(sx * 0.060, 0.995), front(sx * 0.062, 1.07), V((sx * 0.066, 0.0, 1.150)), front(sx * 0.062, 1.07, 1),
                           front(sx * 0.030, 0.95, 1), front(-sx * 0.020, 0.80, 1), front(-sx * 0.045, 0.725, 1)])
        made.append(strip('straps', straps, 0.024, 0.011, dk, across=4))
        made.append(buttons('buttons', [front(sx * 0.060, 0.985) for sx in (1, -1)], lt, r=0.0065, lift_=0.016))
        made.append(strip('pocket', [[front(0.0, z) for z in (0.975, 0.93, 0.885)]], 0.070, 0.012, mid, across=5))
    return made


def head(cut, Lb):
    """the pieces of a top that sit with the head (inside the barber's build, with its locals): a turtleneck's tube up the
    portrait's neck, a hood up over the head"""
    G = BY[CUTS[cut]['garment']]
    if G['neck'] != 'turtle' and not G['hood_up']:
        return []
    bpy, bmesh, Vector, BVHTree, PM = Lb['bpy'], Lb['bmesh'], Lb['Vector'], Lb['BVHTree'], Lb['PM']
    C, sc, az_of, finish, shell, mat = Lb['C'], Lb['sc'], Lb['az_of'], Lb['finish'], Lb['shell'], Lb['mat']
    tag = CUTS[cut]['tag']
    cloth = mat('%s_cloth' % tag, src(G['mid']), 0.95)
    tris, verts = [], []
    for o in [o for o in sc.objects if o.type == 'MESH' and (o.name == 'portrait_neck' or o.name.startswith('Cesium_Man'))]:
        mw = o.matrix_world; k = len(verts)
        verts += [mw @ v.co for v in o.data.vertices]; tris += [[k + i for i in f.vertices] for f in o.data.polygons]
    bvh = BVHTree.FromPolygons(verts, tris)
    made = []

    def tube_up(name, z0, z1, off):
        """rings round the neck from z0 to z1 (relative to the head's centre), off(a, z) beyond the neck"""
        bm = bmesh.new(); n = 48; rows = []; z = z0; zs = []
        while z <= z1 + 1e-6: zs.append(z); z += 0.006
        last = 0.06
        for z in zs:
            yc = C.y + 0.012 * sstep(-0.24, -0.17, z) - 0.026 * (1 - sstep(-0.24, -0.17, z))
            o = Vector((C.x, yc, C.z + z)); row = []
            for i in range(n):
                a = 2 * math.pi * i / n; d = Vector((math.sin(a), -math.cos(a), 0.0))
                hit = bvh.ray_cast(o, d, 0.3); r = (hit[0] - o).length if hit[0] else last; last = r
                row.append(bm.verts.new(o + d * (r + off(a, z))))
            rows.append(row)
        for j in range(len(rows) - 1):
            for i in range(n):
                bm.faces.new((rows[j][i], rows[j][(i + 1) % n], rows[j + 1][(i + 1) % n], rows[j + 1][i]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        bm.normal_update()
        o = finish(bm, name, cloth, 0.006)
        ss = o.modifiers.new('ss', 'SUBSURF'); ss.levels = 1; ss.render_levels = 1
        bpy.context.view_layer.objects.active = o
        for x in sc.objects: x.select_set(x is o)
        bpy.ops.object.modifier_apply(modifier='ss')
        for f in o.data.polygons: f.use_smooth = True
        return o

    def neck_w(q):
        t = sstep(-0.24, -0.17, q.z)
        return {k: v for k, v in {'torso_joint_3': 1.0 - t, PM.NECK_BONE: t}.items() if v > 1e-4}

    if G['neck'] == 'turtle':   # the knit up the neck to the jaw, ribs down it, the top rolled over
        rib = lambda a: 0.0012 * max(0.0, math.cos(64 * a)) ** 2
        o = tube_up('%s_turtle' % tag, -0.250, -0.150,
                    lambda a, z: 0.011 - rib(a) + 0.009 * sstep(-0.172, -0.158, z) * (1 - sstep(-0.152, -0.146, z)))
        made.append(('weighted', o, neck_w))
    if G['hood_up']:   # the hood over the head, the face open in it, its lip, falling at the nape onto the shoulders
        # cycle 2 (looking, HOOD-UP ASH HOODIE): a smooth ball with a square face hole read as a diving helmet; the opening
        # is an oval now, the crown slimmer with the slight point a hood has at the back, a seam down the middle, soft folds
        def opening(q):   # under 1 inside the face's oval
            return (abs(az_of(q)) / 1.0) ** 2 + ((q.z + 0.025) / 0.132) ** 2
        def keep(q):
            return q.z > -0.15 and opening(q) > 1.0
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C; az = az_of(q); ab = abs(az)
                t = 0.015 + 0.006 * sstep(0.05, 0.17, q.z) + 0.016 * sstep(1.9, 3.0, ab) * sstep(0.12, -0.06, q.z)
                t += 0.010 * sstep(2.3, 3.0, ab) * math.exp(-((q.z - 0.10) / 0.04) ** 2)                     # the point at the back
                t += 0.0030 * math.exp(-(q.x / 0.0035) ** 2) * sstep(-0.02, 0.05, q.z) * (ab > 0.9)          # the centre seam
                t += 0.0028 * math.sin(22 * (q.z - 0.30 * az)) * sstep(0.6, 1.6, ab)                          # soft folds to the back
                o = opening(q); t += 0.006 * math.exp(-((o - 1.0) / 0.10) ** 2)                               # the lip
                out.append(max(0.008, t))
            return out
        hood = shell('%s_hood' % tag, keep, thick, subdiv=2, rim=0.004)
        hood.data.materials.clear(); hood.data.materials.append(cloth)
        made.append(hood)
        o = tube_up('%s_hood_fall' % tag, -0.245, -0.150, lambda a, z: 0.012 + 0.030 * (0.5 - 0.5 * math.cos(a)) * sstep(-0.245, -0.20, z))
        made.append(('weighted', o, neck_w))
    return made


def record():
    return [dict(name=G['name'], shape=G['shape'], ramp=G['ramp'], mid=G['mid'], sleeves=G['sleeves'], neck=G['neck'],
                 pattern=G['pattern'], tatter=G['tatter'], shoulder=G['shoulder'], cut=G['cut'], pocket=G['pocket'],
                 hood_up=G['hood_up'], bib=G['bib'], short=G['short'], fn=G['fn']) for G in BANK]


if __name__ == '__main__':
    from collections import Counter
    print(len(BANK), Counter(G['shape'] for G in BANK))
