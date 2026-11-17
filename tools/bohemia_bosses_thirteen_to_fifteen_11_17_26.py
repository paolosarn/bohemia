#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [thirteen to fifteen, each his own] (11/17/26, the coordinator's round 'BOSSES full sweep', rules 441, 453, 454(a)).
THE BARBER, THE INK and THE DOGS (the ladder's #13 to #15, records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md rows 88-90), modelled FIRST,
through the same pipe as #10 to #12 (tools/bohemia_bosses_ten_to_twelve_11_14_26.py: BOSSES 4's tool imported and never edited, its piece
helpers re-stated verbatim, his weapon on his hand's bone). No new hat, no new garment. Rule 454(a): these men are made with what they
carry and do, not with talk.

  THE BARBER  the chair, the blade, the bleach. A lean man in a white tee under a trades apron, crop trousers, his own razor lines cut
              in; A STRAIGHT RAZOR open in his fist, a LEATHER STROP at his hip and a BLEACH JUG on his belt.
  THE INK     the last needles and pigment. A big man in a black tank under a leather vest, black denim, a bare inked skull; INK SLEEVES
              down both arms, INK round his neck, and THE NEEDLE in his fist (BB's Spiked Impaler: a pole with a long needle point).
  THE DOGS    the last kennel in the valley. A keeper in an olive tee under a barn coat, khaki cargos, a field cap; THE WHIP in his
              fist (BB's Thorned Whip), THREE CHAIN LEASHES in his other hand and a DOG WHISTLE on a cord.

Run as the ten-to-twelve tool (roll | look | batch | pack | purple | cards), BOHEMIA_BPY = the bpy venv.
REFERENCE CHECK (the 9/4 standing duty): the twins are the twelve bosses at the same cell; the real things are a folding straight razor,
a leather strop, a gallon bleach jug; a sleeve tattoo, a spiked pole arm; a kennel keeper's coiled whip, chain leads, a dog whistle.
No reference game.
REUSE CHECK (REUSE-FIRST): the ten-to-twelve tool's way, BOSSES 4's tool and through it BOSSES', CHARACTER's tool, kit, barber, hats door
and wardrobe; DIRECTION's rig, COMBAT's poses, RUN TWO's render and faces. Nothing added to the wardrobe.
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_bosses_four_to_six_11_3_26 as F

TE, BT = F.TE, F.BT
ME = os.path.abspath(__file__)

BOSSES = {
    'Barber': dict(
        what="THE BARBER: the chair, the blade, the bleach; a white tee under a trades apron, crop trousers, razor lines cut in, an open straight razor, a strop, a bleach jug",
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.25, belly=-0.35, shoulders=-0.10, hips=-0.15)],
        look=dict(shirt=dict(colour=(214, 210, 200), sleeve='short'), coat=None,
                  trousers=dict(colour=(40, 40, 42), wide=0.012), shoes=dict(colour=(34, 32, 30), kind='boot', top=0.16), belt=None),
        tops=['WHITE TEE'], coats=['TRADES APRON'], legs=['CHARCOAL CROP TROUSER'], feet=['STACKED MID BOOT'],
        kit=[['LEATHER BELT']], hats=[None], eyewear=[None],
        pieces=['barber_razor', 'barber_strop', 'barber_bleach'], cuts=['RAZOR LINES', 'HALF SHAVE', 'FRENCH CROP']),
    'Ink': dict(
        what="THE INK: the last needles and pigment; a black tank under a leather vest, black denim, a bare skull, ink down both arms and round his neck, the needle",
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.35, belly=0.15, shoulders=0.85, hips=0.20)],
        look=dict(shirt=dict(colour=(26, 26, 28), sleeve='none'), coat=None,
                  trousers=dict(colour=(30, 32, 38), wide=0.016), shoes=dict(colour=(28, 26, 24), kind='boot', top=0.24), belt=None),
        tops=['BLACK TANK'], coats=['LEATHER VEST'], legs=['BLACK DENIM'], feet=['TALL MOTO BOOTS'],
        kit=[['LEATHER BELT']], hats=[None], eyewear=[None],
        pieces=['ink_sleeves', 'ink_neck', 'ink_needle'], cuts=['RAZOR SKULL', 'SALT SKULL', 'SCORCH']),
    'Dogs': dict(
        what="THE DOGS: the last kennel in the valley; an olive tee under a barn coat, khaki cargos, a field cap, the whip, three chain leashes, a dog whistle",
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.10, belly=0.20, shoulders=0.40, hips=0.10)],
        look=dict(shirt=dict(colour=(84, 86, 58), sleeve='long'), coat=None,
                  trousers=dict(colour=(120, 108, 80), wide=0.018), shoes=dict(colour=(56, 46, 34), kind='boot', top=0.20), belt=None),
        tops=['OLIVE DRAB TEE'], coats=['BARN COAT'], legs=['KHAKI CARGOS'], feet=['FIELD BOOTS'],
        kit=[['SCAV KNEEPADS', 'LEATHER GLOVES']], hats=['HAT OLIVE FIELD CAP'], eyewear=[None],
        pieces=['dogs_whip', 'dogs_leashes', 'dogs_whistle'], cuts=['HOME CLIPPERS', 'DRY TAPER', 'DEEP TAPER']),
}
ORDER = ['Barber', 'Ink', 'Dogs']
POOL = {'Barber': 'barber', 'Ink': 'ink', 'Dogs': 'dogs'}
NAMES = {'barber': 'THE BARBER', 'ink': 'THE INK', 'dogs': 'THE DOGS'}
MINE = tuple(p for t in ORDER for p in BOSSES[t]['pieces'])
CUT = {'Barber': 'RAZOR LINES', 'Ink': 'RAZOR SKULL', 'Dogs': 'HOME CLIPPERS'}

STEEL, STEEL_DK, SCALES = (176, 178, 180), (70, 70, 72), (34, 30, 28)
STROP, STROP_DK, JUG, JUG_CAP = (112, 72, 42), (70, 44, 26), (226, 224, 214), (40, 88, 150)
INK, INK_RED, INK_DK = (34, 38, 44), (112, 32, 30), (18, 20, 24)
POLE, POLE_DK = (70, 56, 40), (44, 36, 28)
WHIP, WHIP_DK, CHAIN, WHISTLE, CORD = (66, 44, 30), (40, 26, 18), (92, 92, 90), (150, 152, 150), (50, 42, 34)


def boss_pieces(names, X):
    import bohemia_character_garments_base as BASE
    if not names: return []
    K_ = BASE.kit(X)
    V, M = K_['V'], K_['M']
    band, ring_pts, finish, new_obj, front, strip = K_['band'], K_['ring_pts'], K_['finish'], K_['new_obj'], K_['front'], K_['strip']
    arm_ring, weigh = K_['arm_ring'], K_['weigh']
    bmesh = X['bmesh']; arm = X['arm']; section = X['section']; L = X['L']; mat = X['mat']
    Aw = arm.matrix_world
    full = lambda bn: next(b.name for b in arm.data.bones if b.name.endswith(bn) or b.name == bn)
    over = (0.022 if (L.get('worn') or {}).get('outer') or isinstance(L.get('coat'), dict) else 0.0)
    made = []

    # COOK ARMOUR's helpers, re-stated (closures cannot be imported): the same shapes, the same weights
    def solid(key, bm, colour, bone, subdiv=1):
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        o = new_obj(bm, key)
        for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
        vg = o.vertex_groups.new(name=full(bone)); vg.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
        return finish(o, colour, key, subdiv, 0)

    def weighted(o, wfn):
        if o is None: return None
        for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
        groups = {}
        for v in o.data.vertices:
            for bn, w in wfn(M @ v.co).items():
                if w <= 1e-4: continue
                if bn not in groups: groups[bn] = o.vertex_groups.new(name=full(bn))
                groups[bn].add([v.index], w, 'REPLACE')
        return o

    def torso_w(p):
        a3 = BASE.sstep(0.90, 1.00, p.z); a1 = BASE.sstep(0.80, 0.70, p.z)
        return {'torso_joint_3': a3, 'Skeleton_torso_joint_1': a1, 'Skeleton_torso_joint_2': max(0.0, 1.0 - a3 - a1)}

    def paint(o, key, colour, pick):
        o.data.materials.append(mat(key, colour)); k = len(o.data.materials) - 1
        R3 = M.to_3x3()
        for f in o.data.polygons:
            if pick(M @ f.center, (R3 @ f.normal).normalized()): f.material_index = k
        return o

    def box(bm, c, ax, ay, az):
        r = bmesh.ops.create_cube(bm, size=2.0)
        for v in r['verts']:
            x, y, z = v.co; v.co = c + ax * x + ay * y + az * z

    def cyl(bm, p0, p1, r0, r1=None, seg=12):
        d = p1 - p0; q = d.normalized().to_track_quat('Z', 'Y')
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r0, radius2=r0 if r1 is None else r1, depth=d.length)
        for v in res['verts']: v.co = (p0 + p1) * 0.5 + q @ v.co

    def ball(bm, c, r, seg=10, ring=6, sq=(1, 1, 1)):
        res = bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=ring, radius=r)
        for v in res['verts']: v.co = c + V((v.co.x * sq[0], v.co.y * sq[1], v.co.z * sq[2]))

    def pipe(bm, pts, r, seg=10):
        for a, b in zip(pts, pts[1:]): cyl(bm, a, b, r, seg=seg)
        for p in pts[1:-1]: ball(bm, p, r, seg=seg, ring=5)

    def torus(bm, c, axis, R, r, n=24, seg=8, sx=1.0):
        axis = axis.normalized(); u = axis.orthogonal().normalized(); w = axis.cross(u).normalized()
        rings = []
        for i in range(n):
            a = 2 * math.pi * i / n; d = u * math.cos(a) * sx + w * math.sin(a); o = c + d * R
            dn = d.normalized()
            rings.append([bm.verts.new(o + (dn * math.cos(2 * math.pi * j / seg) + axis * math.sin(2 * math.pi * j / seg)) * r) for j in range(seg)])
        for i in range(n):
            for j in range(seg):
                bm.faces.new((rings[i][j], rings[i][(j + 1) % seg], rings[(i + 1) % n][(j + 1) % seg], rings[(i + 1) % n][j]))

    def hand(right=True):
        hb, wr, ax, wd, th, ln, width = next(h for h in X['hands'] if (h[1].x < 0) == right)
        return hb, wr + ax * (ln * 0.42), ax, wd, th

    def torso_ring(z, off):
        s = section(z, ('torso',)); return ring_pts(V((0.0, s['cy'], z)), V((1, 0, 0)), V((0, -1, 0)), n=56, off=off)

    def noise(c, s):
        return 0.5 + 0.5 * math.sin(23 * c.x + 9 * c.z + s) * math.cos(17 * c.y - 13 * c.z + 2.1 * c.x + s * 0.7)

    def hip(x, z, side=-1):
        """a point on his hip, out to the side of the belt line (x > 0 his left, x < 0 his right)"""
        s_ = section(z, ('torso',)); return V((x, s_['cy'] - 0.02, z))

    for nm in names:
        # ---------------------------------------------------------------- THE BARBER
        if nm == 'barber_razor':
            # A STRAIGHT RAZOR, open in his fist: the black scales (the folded handle) through his hand, the pivot at its end, the blade
            # swung out past it at a hand's angle, its edge down
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); box(bm, fc + wd * 0.020, wd * 0.068, th * 0.006, ax * 0.011)
            made.append(solid('barber_scales', bm, SCALES, hb, 0))
            piv = fc + wd * 0.088; out = (wd * 0.80 - ax * 0.60).normalized()
            bm = bmesh.new(); box(bm, piv + out * 0.044, out * 0.044, th * 0.0022, out.cross(th).normalized() * 0.010)
            g = solid('barber_blade', bm, STEEL, hb, 0)
            paint(g, 'barber_blade_back', STEEL_DK, lambda q, nn: (q - piv).dot(out.cross(th).normalized()) > 0.006)
            made.append(g)
            bm = bmesh.new(); ball(bm, piv, 0.006, seg=8, ring=4)
            made.append(solid('barber_pivot', bm, STEEL_DK, hb, 0))
        elif nm == 'barber_strop':
            # A LEATHER STROP at his right hip, hung off his belt by its ring: a long flat strap down the side of his thigh
            top = hip(-0.175, 0.93) + V((-0.012, 0, 0))
            bm = bmesh.new(); box(bm, top + V((0, 0, -0.105)), V((0.006, 0, 0)), V((0, 0.024, 0)), V((0, 0, 0.105)))
            g = solid('barber_strop', bm, STROP, 'Skeleton_torso_joint_1', 0)
            paint(g, 'barber_strop_worn', STROP_DK, lambda q, nn: noise(q, 2.3) > 0.70)
            made.append(g)
            bm = bmesh.new(); torus(bm, top + V((0, 0, 0.012)), V((1, 0, 0)), 0.012, 0.0028, n=14, seg=5)
            made.append(solid('barber_strop_ring', bm, STEEL_DK, 'Skeleton_torso_joint_1', 0))
        elif nm == 'barber_bleach':
            # A BLEACH JUG on his belt at his left hip: a white gallon jug, its blue cap, a strap through its handle
            c = hip(0.170, 0.90) + V((0.014, 0, 0))
            bm = bmesh.new(); box(bm, c, V((0.030, 0, 0)), V((0, 0.040, 0)), V((0, 0, 0.060)))
            g = solid('barber_jug', bm, JUG, 'Skeleton_torso_joint_1', 0)
            paint(g, 'barber_jug_label', (150, 40, 34), lambda q, nn: abs(q.z - c.z) < 0.018 and nn.x > 0.5)
            made.append(g)
            bm = bmesh.new(); cyl(bm, c + V((0, 0, 0.060)), c + V((0, 0, 0.080)), 0.012, seg=10)
            made.append(solid('barber_jug_cap', bm, JUG_CAP, 'Skeleton_torso_joint_1', 0))
        # ---------------------------------------------------------------- THE INK
        elif nm == 'ink_sleeves':
            # INK SLEEVES down both arms, shoulder to wrist: bands of ink laid on his skin, a red motif through the black
            for i, s in enumerate((0.30, 0.55, 0.80, 1.10, 1.35, 1.60, 1.85)):
                g = band('ink_sleeve_%d' % i, arm_ring(s, 0.0015), 0.110, 0.0025, INK, seg=6)
                if g is None: continue
                paint(g, 'ink_sleeve_red_%d' % i, INK_RED, lambda q, nn, i=i: noise(q, 1.3 + i) > 0.70)
                paint(g, 'ink_sleeve_dk_%d' % i, INK_DK, lambda q, nn, i=i: 0.40 < noise(q, 4.1 + i) < 0.48)
                weigh(g); made.append(g)
        elif nm == 'ink_neck':
            # INK round his neck: a collar of black work at the base of his throat, the same red through it
            g = band('ink_neck', [torso_ring(1.175, 0.0015)], 0.050, 0.0025, INK, seg=6)
            if g is not None:
                paint(g, 'ink_neck_red', INK_RED, lambda q, nn: noise(q, 0.6) > 0.68)
                made.append(weighted(g, torso_w))
        elif nm == 'ink_needle':
            # THE NEEDLE (BB's Spiked Impaler): a long pole through his fist, a steel needle a hand long at its top, four spikes round the
            # socket under it, wire wound below the spikes
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.42, fc + wd * 1.12, 0.017, 0.015, seg=10)
            g = solid('ink_pole', bm, POLE, hb, 0)
            paint(g, 'ink_pole_grip', POLE_DK, lambda q, nn: abs((q - fc).dot(wd)) < 0.10)
            made.append(g)
            head = fc + wd * 1.12
            bm = bmesh.new(); cyl(bm, head, head + wd * 0.26, 0.016, 0.0015, seg=10)
            for k in range(4):
                a = 2 * math.pi * k / 4; d = (ax * math.cos(a) + th * math.sin(a)).normalized()
                cyl(bm, head - wd * 0.02, head - wd * 0.02 + d * 0.075 + wd * 0.03, 0.007, 0.001, seg=6)
            made.append(solid('ink_needle', bm, STEEL, hb, 0))
            bm = bmesh.new(); cyl(bm, head - wd * 0.12, head - wd * 0.04, 0.020, seg=10)
            made.append(solid('ink_wire', bm, STEEL_DK, hb, 0))
        # ---------------------------------------------------------------- THE DOGS
        elif nm == 'dogs_whip':
            # THE WHIP (BB's Thorned Whip): a short braided handle through his fist, the lash coiled down from it in loops, thorns on it
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.06, fc + wd * 0.20, 0.015, 0.012, seg=10)
            made.append(solid('dogs_handle', bm, WHIP_DK, hb, 0))
            p0 = fc + wd * 0.20; pts = [p0]
            for k in range(1, 15):
                a = k * 0.95; pts.append(p0 + wd * (0.03 * math.cos(a)) + th * (0.06 * math.sin(a)) - ax * (0.030 * k))
            bm = bmesh.new(); pipe(bm, pts, 0.006, seg=6)
            g = solid('dogs_lash', bm, WHIP, hb, 0)
            made.append(g)
            bm = bmesh.new()
            for q in pts[2::2]: ball(bm, q + th * 0.007, 0.0045, seg=6, ring=3)
            made.append(solid('dogs_thorns', bm, STEEL_DK, hb, 0))
        elif nm == 'dogs_leashes':
            # THREE CHAIN LEASHES in his left fist, hanging down and forward to their empty collars at his knee
            hb, fc, ax, wd, th = hand(False)
            bm_c, bm_r = bmesh.new(), bmesh.new()
            for k, sp in enumerate((-0.05, 0.0, 0.05)):
                end = fc - ax * (0.42 + 0.04 * k) + th * sp + wd * 0.06
                mid = fc - ax * 0.20 + th * (sp * 0.6) + wd * 0.10
                pipe(bm_c, [fc, mid, end], 0.0045, seg=6)
                torus(bm_r, end - ax * 0.035, ax, 0.035, 0.005, n=16, seg=5)
            made.append(solid('dogs_chains', bm_c, CHAIN, hb, 0))
            made.append(solid('dogs_collars', bm_r, WHIP_DK, hb, 0))
        elif nm == 'dogs_whistle':
            # A DOG WHISTLE on a cord round his neck, the steel whistle hanging at his chest over the coat
            made.append(weighted(band('dogs_cord', [torso_ring(1.150, over + 0.012)], 0.006, 0.005, CORD), torso_w))
            p = front(0.0, 1.05) + V((0, -(over + 0.030), 0))
            bm = bmesh.new(); cyl(bm, p + V((-0.022, 0, 0)), p + V((0.022, 0, 0)), 0.0065, seg=10)
            made.append(weighted(solid('dogs_whistle', bm, WHISTLE, 'torso_joint_3', 0), torso_w))
    return [m for m in made if m is not None]


# ---- this file's three men, put in BOSSES 4's globals (its functions read them at call time; its file is never edited) ----
F.BOSSES = BOSSES; F.ORDER = ORDER; F.POOL = POOL; F.NAMES = NAMES; F.MINE = MINE; F.CUT = CUT
F.HATS_MINE = ()
F.ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_BOSSES_THIRTEEN_TO_FIFTEEN_ROLL.json')
F.STAMP = 'bosses-13-15-11-17'
F.ME = ME
F.boss_pieces = boss_pieces
F.garments = lambda: None
F.CARDS = os.path.join(ROOT, 'records/target/bosses_thirteen_to_fifteen')
F.PAINT = {'barber': ('barbershop', 'fadepole', 'hand_fade.png', 'HIS RAZOR'), 'ink': ('parlor', 'inkmark', 'hand_mark.png', 'HIS NEEDLES'),
           'dogs': ('kennel', 'pawprints', 'hand_track.png', 'HIS DOG')}
F.HELD = {'barber': 'THE RAZOR', 'ink': 'THE NEEDLE', 'dogs': 'THE WHIP'}


def pack():
    """BOSSES 4's pack, with the faces on a strip of this file's own: the fight's first face strip is one row and stops at the WebP limit
    (measured 11/17: 127 faces, 16,256 px of 16,383; three more failed the save and left it empty, restored from git). The fight reads
    more strips the same way (fight_rig.json faces.more, CHARACTER's faces_more.webp is one); this file's is faces_bosses.webp."""
    from PIL import Image
    ip = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'); I0 = json.load(open(ip))
    faces0, bosses0 = I0['faces'], I0['bosses']
    STRIP = 'faces_bosses.webp'
    mine = [m for m in (faces0.get('more') or []) if m.get('file') == STRIP]
    order0 = list(mine[0]['order']) if mine else []
    fn = os.path.join(ROOT, 'slices/fight_rig', STRIP)
    if not os.path.exists(fn): order0 = []; Image.new('RGBA', (faces0['size'], faces0['size']), (0, 0, 0, 0)).save(fn, 'WEBP', lossless=True)
    I0['faces'] = dict(file=STRIP, size=faces0['size'], order=order0)
    with open(ip, 'w') as f: f.write(json.dumps(I0, indent=1))
    try:
        F.pack()
    finally:
        I = json.load(open(ip)); tmp = I['faces']
        fz = dict(faces0); more = [m for m in (fz.get('more') or []) if m.get('file') != STRIP]
        more.append(dict(file=STRIP, order=tmp.get('order', order0) if tmp.get('file') == STRIP else order0,
                         by='BOSSES 11/17, tools/bohemia_bosses_thirteen_to_fifteen_11_17_26.py pack (the first strip stops at the WebP limit)'))
        fz['more'] = more; I['faces'] = fz
        I['bosses'] = bosses0 if 'THE BARBER' in bosses0 else bosses0.replace(', kind', ', THE BARBER, THE INK, THE DOGS (tools/bohemia_bosses_thirteen_to_fifteen_11_17_26.py), kind', 1)
        for p in json.load(open(F.ROLL)):
            lk = TE.look_of(p['id'])
            if lk in I['looks']: I['looks'][lk]['dressed'] = "BOSSES [thirteen to fifteen] 11/17: his own pieces on his model (tools/bohemia_bosses_thirteen_to_fifteen_11_17_26.py)"
        with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
        print('faces on', STRIP, fz['more'][-1]['order'])


if __name__ == '__main__':
    F.patch()
    a = [x for x in sys.argv[1:] if x != '--keep']
    cmd = a[0] if a else 'roll'
    if cmd == 'roll': F.roll()
    elif cmd == 'build-one': TE.build_one(a[1])
    elif cmd == 'look':
        for pid in a[1:]:
            g = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % TE.tag_of(pid))
            if os.path.exists(g) and '--keep' not in sys.argv: os.remove(g)
            TE.look(pid)
    elif cmd == 'batch': F.batch(int(a[1]) if len(a) > 1 else 1)
    elif cmd == 'worker': TE.worker(int(a[1]), int(a[2]))
    elif cmd == 'pack': pack()
    elif cmd == 'purple': F.purple()
    elif cmd == 'cards': F.cards()
