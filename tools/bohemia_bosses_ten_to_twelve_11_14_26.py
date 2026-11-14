#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [ten to twelve, each his own] (11/14/26, the coordinator's round 'BOSSES turn up', rules 337, 441, 447).
THE PLATE, THE TOOTH and THE LENS (the ladder's #10 to #12, records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md rows 85-87), modelled FIRST,
through the same pipe as #7 to #9 (tools/bohemia_bosses_seven_to_nine_11_11_26.py: BOSSES 4's tool imported and never edited, its piece
helpers re-stated verbatim, his weapon on his hand's bone). No new hat, no new garment.

  THE PLATE   the last press brake. A big smith in a leather half apron over a soot tank, a scrap helm, a steel pauldron; A PRESSED STEEL
              CHEST PLATE riveted over his apron, and THE MALLET in his fist (a 90 cm handle, a steel-faced head).
  THE TOOTH   the only working dental kit. A thin man in a long bone duster over a bone button-up, black cargos; A STRING OF PULLED
              TEETH round his neck, a HEAD MIRROR's band, and THE FORCEPS in his fist (dental extraction forceps, steel).
  THE LENS    the last ground glass. A man in a slate cocoon coat, wraparound shades, a slouch beanie; A SASH OF GROUND LENSES across his
              chest, and THE CROSSBOW in his fist with a SCOPE on it (a tube of his own glass).

Run as the seven-to-nine tool (roll | look | batch | pack | purple | cards), BOHEMIA_BPY = the bpy venv.
REFERENCE CHECK (the 9/4 standing duty): the twins are the nine bosses at the same cell; the real things are a riveted mild-steel plate,
a blacksmith's mallet; dental extraction forceps, a head mirror, a string of teeth; a light crossbow with a scope tube, optical lenses
in a sash. No reference game.
REUSE CHECK (REUSE-FIRST): the seven-to-nine tool's way, BOSSES 4's tool and through it BOSSES', CHARACTER's tool, kit, barber, hats door
and wardrobe; DIRECTION's rig, COMBAT's poses, RUN TWO's render and faces. Nothing added to the wardrobe.
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_bosses_four_to_six_11_3_26 as F

TE, BT = F.TE, F.BT
ME = os.path.abspath(__file__)

BRASS, BRASS_DK, STEEL, STEEL_DK, CHAIN = (172, 140, 64), (120, 96, 40), (110, 108, 104), (56, 54, 52), (74, 74, 72)
SLEEVE = (30, 30, 32)
STICK, STICK_DK, WEB, WIRE_RED, RECV = (186, 150, 104), (140, 108, 70), (92, 90, 72), (168, 40, 32), (34, 34, 34)
HICKORY, SLEDGE = (150, 116, 74), (70, 70, 68)
OXY, ACET, HOSE = (60, 92, 66), (128, 40, 36), (34, 34, 32)
PIPE, PIPE_DK, GRIP = (118, 116, 110), (70, 68, 64), (112, 74, 44)

BOSSES = {
    'Plate': dict(
        what="THE PLATE: the last press brake; a leather half apron over a soot tank, a scrap helm, a steel pauldron, a riveted chest plate, the mallet",
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.30, belly=0.45, shoulders=1.0, hips=0.30)],
        look=dict(shirt=dict(colour=(36, 34, 32), sleeve='long'), coat=None,
                  trousers=dict(colour=(52, 48, 42), wide=0.02), shoes=dict(colour=(30, 28, 26), kind='boot', top=0.24), belt=None),
        tops=['SOOT TANK'], coats=['LEATHER HALF APRON'], legs=['PATCHED WORK PANTS'], feet=['TALL MOTO BOOTS'],
        kit=[['SOOT GLOVES', 'STEEL PAULDRON']], hats=['HAT SCRAP HELM'], eyewear=[None],
        pieces=['plate_chest', 'plate_mallet'], cuts=['RAZOR SKULL', 'HOME CLIPPERS', 'DEEP TAPER']),
    'Tooth': dict(
        what="THE TOOTH: the only working dental kit; a long bone duster over a bone button-up, a string of pulled teeth, a head mirror, the forceps",
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.45, belly=-0.45, shoulders=-0.35, hips=-0.20)],
        look=dict(shirt=dict(colour=(190, 184, 170), sleeve='long'), coat=None,
                  trousers=dict(colour=(34, 34, 36), wide=0.014), shoes=dict(colour=(36, 34, 32), kind='boot', top=0.18), belt=None),
        tops=['BONE BUTTON-UP'], coats=['BONE DUSTER'], legs=['BLACK CARGOS'], feet=['CHARCOAL BOOTS'],
        kit=[['LEATHER GLOVES']], hats=[None], eyewear=[None],
        pieces=['tooth_string', 'tooth_mirror', 'tooth_forceps'], cuts=['GREASE BACK', 'DRY TAPER', 'TEMPLE TAPER']),
    'Lens': dict(
        what="THE LENS: the last ground glass; a slate cocoon coat, wraparound shades, a slouch beanie, a sash of lenses, a crossbow with a scope",
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.15, belly=-0.15, shoulders=0.10, hips=-0.05)],
        look=dict(shirt=dict(colour=(66, 70, 76), sleeve='long'), coat=None,
                  trousers=dict(colour=(60, 64, 70), wide=0.016), shoes=dict(colour=(40, 38, 36), kind='boot', top=0.20), belt=None),
        tops=['STORM TURTLENECK'], coats=['SLATE COCOON COAT'], legs=['SLATE WORK PANTS'], feet=['STACKED MID BOOT'],
        kit=[['LEATHER BELT']], hats=['HAT STORM SLOUCH BEANIE'], eyewear=['FACE WRAPAROUND SHADES'],
        pieces=['lens_sash', 'lens_crossbow'], cuts=['TEMPLE TAPER', 'HOME CLIPPERS', 'DRY TAPER']),
}
ORDER = ['Plate', 'Tooth', 'Lens']
POOL = {'Plate': 'plate', 'Tooth': 'tooth', 'Lens': 'lens'}
NAMES = {'plate': 'THE PLATE', 'tooth': 'THE TOOTH', 'lens': 'THE LENS'}
MINE = tuple(p for t in ORDER for p in BOSSES[t]['pieces'])
CUT = {'Plate': 'RAZOR SKULL', 'Tooth': 'GREASE BACK', 'Lens': 'TEMPLE TAPER'}

PLATE_STEEL, RIVET, HAFT, MALLET = (128, 126, 120), (70, 68, 64), (128, 96, 62), (82, 80, 76)
TOOTH_W, TOOTH_Y, CORD, MIRROR, MIRROR_RIM = (214, 206, 186), (188, 170, 120), (60, 50, 40), (200, 204, 206), (60, 60, 62)
GLASS, GLASS_RIM, SASH, BOW_WOOD, BOW_STEEL, SCOPE = (150, 176, 186), (120, 98, 54), (58, 48, 40), (110, 78, 48), (84, 82, 78), (34, 34, 36)


def boss_pieces(names, X):
    import bohemia_character_garments_base as BASE
    if not names: return []
    K_ = BASE.kit(X)
    V, M = K_['V'], K_['M']
    band, ring_pts, finish, new_obj, front, cloth, strip = K_['band'], K_['ring_pts'], K_['finish'], K_['new_obj'], K_['front'], K_['cloth'], K_['strip']
    bvh = K_['bvh']; bmesh = X['bmesh']; arm = X['arm']; section = X['section']; L = X['L']; mat = X['mat']
    Aw = arm.matrix_world
    full = lambda bn: next(b.name for b in arm.data.bones if b.name.endswith(bn) or b.name == bn)
    joint = lambda bn: Aw @ arm.data.bones[full(bn)].head_local
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
    chest_w = lambda q: {'torso_joint_3': 1.0}

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

    def forearm(side):
        """elbow, wrist, the forearm's bone (the bone whose head is at the elbow)"""
        if side == 'L': return joint('Skeleton_arm_joint_L__3_'), joint('Skeleton_arm_joint_L__2_'), 'Skeleton_arm_joint_L__3_'
        return joint('Skeleton_arm_joint_R__2_'), joint('Skeleton_arm_joint_R__3_'), 'Skeleton_arm_joint_R__2_'

    def cuff_band(key, side, s_a, wid, th, colour):
        E0, W0, bone = forearm(side); a = (W0 - E0).normalized(); c = E0.lerp(W0, s_a)
        u = a.orthogonal().normalized(); w = a.cross(u).normalized()
        return weighted(band(key, [ring_pts(c, u, w, n=24, off=th)], wid, 0.008, colour), lambda p, bone=bone: {bone: 1.0})

    def torso_ring(z, off):
        s = section(z, ('torso',)); return ring_pts(V((0.0, s['cy'], z)), V((1, 0, 0)), V((0, -1, 0)), n=56, off=off)

    def noise(c, s):
        return 0.5 + 0.5 * math.sin(23 * c.x + 9 * c.z + s) * math.cos(17 * c.y - 13 * c.z + 2.1 * c.x + s * 0.7)

    for nm in names:
        # ---------------------------------------------------------------- THE PLATE
        if nm == 'plate_chest':
            # A PRESSED STEEL CHEST PLATE riveted over his apron: a plate across the front of his chest, a rivet at each corner and two
            # down the middle, a strap round his back to hold it
            p = front(0.0, 1.02) + V((0, -(over + 0.030), 0))
            bm = bmesh.new(); box(bm, p, V((0.150, 0, 0)), V((0, 0.012, 0)), V((0, 0, 0.130)))
            g = solid('plate_chest', bm, PLATE_STEEL, 'torso_joint_3', 0)
            paint(g, 'plate_chest_dent', RIVET, lambda q, nn: noise(q, 1.7) > 0.83)
            made.append(weighted(g, torso_w))
            bm = bmesh.new()
            for (x_, z_) in ((-0.13, 0.12), (0.13, 0.12), (-0.13, -0.11), (0.13, -0.11), (0.0, 0.05), (0.0, -0.05)):
                ball(bm, p + V((x_, -0.014, z_)), 0.009, seg=8, ring=4)
            made.append(weighted(solid('plate_rivets', bm, RIVET, 'torso_joint_3', 0), torso_w))
            made.append(weighted(band('plate_strap', [torso_ring(1.000, over + 0.016)], 0.030, 0.010, CORD), torso_w))
        elif nm == 'plate_mallet':
            # THE MALLET (BB's Two-Handed Mallet): a 90 cm hickory handle through his fist, a heavy head across its end faced with steel
            hb, fc, ax, wd, th = hand(True)
            Lh = 0.78
            bm = bmesh.new(); cyl(bm, fc - wd * 0.080, fc + wd * Lh, 0.019, 0.017, seg=10)
            made.append(solid('plate_mallet_handle', bm, HAFT, hb, 0))
            head = fc + wd * (Lh + 0.020)
            bm = bmesh.new(); cyl(bm, head - ax * 0.110, head + ax * 0.110, 0.060, seg=14)
            g = solid('plate_mallet_head', bm, MALLET, hb, 0)
            paint(g, 'plate_mallet_faces', PLATE_STEEL, lambda q, nn: abs((q - head).dot(ax)) > 0.100)
            made.append(g)
        # ---------------------------------------------------------------- THE TOOTH
        elif nm == 'tooth_string':
            # A STRING OF PULLED TEETH round his neck: a cord at the collar, eighteen teeth hung off it, yellowed
            ring = [q[0] for q in torso_ring(1.150, over + 0.016)]
            made.append(weighted(band('tooth_cord', [torso_ring(1.150, over + 0.012)], 0.008, 0.006, CORD), torso_w))
            s_ = section(1.150, ('torso',)); cy = s_['cy']
            fr_ = [p for p in ring if p.y < cy - 0.01]; fr_.sort(key=lambda p: p.x)
            bm = bmesh.new()
            for i in range(18):
                p = fr_[int(round(i * (len(fr_) - 1) / 17.0))]
                box(bm, p + V((0, -0.004, -0.020)), V((0.006, 0, 0)), V((0, 0.005, 0)), V((0, 0, 0.012)))
            g = solid('tooth_teeth', bm, TOOTH_W, 'torso_joint_3', 0)
            paint(g, 'tooth_teeth_old', TOOTH_Y, lambda q, nn: noise(q, 0.9) > 0.55)
            made.append(weighted(g, torso_w))
        elif nm == 'tooth_mirror':
            # A HEAD MIRROR's band worn down round his neck under the teeth: the round mirror with its hole, on its strap
            p = front(-0.040, 1.090) + V((0, -(over + 0.036), 0))
            bm = bmesh.new(); res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=16, radius1=0.036, radius2=0.036, depth=0.004)
            q_ = V((0, -1, 0)).to_track_quat('Z', 'Y')
            for v in res['verts']: v.co = p + q_ @ v.co
            made.append(weighted(solid('tooth_mirror', bm, MIRROR, 'torso_joint_3', 0), torso_w))
            bm = bmesh.new(); torus(bm, p, V((0, 1, 0)), 0.036, 0.004, n=18, seg=5)
            made.append(weighted(solid('tooth_mirror_rim', bm, MIRROR_RIM, 'torso_joint_3', 0), torso_w))
        elif nm == 'tooth_forceps':
            # THE FORCEPS: dental extraction forceps, two handles through his fist, the hinge, the beaks bent down at their end
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new()
            for s in (-1, 1):
                pipe(bm, [fc - wd * 0.060 + th * (0.010 * s), fc + wd * 0.090 + th * (0.006 * s), fc + wd * 0.150, fc + wd * 0.210 + ax * 0.030 + th * (0.004 * s)], 0.006, seg=6)
            ball(bm, fc + wd * 0.150, 0.011, seg=8, ring=5)
            made.append(solid('tooth_forceps', bm, PLATE_STEEL, hb, 0))
        # ---------------------------------------------------------------- THE LENS
        elif nm == 'lens_sash':
            # A SASH OF GROUND LENSES across his chest, right shoulder to left hip: a leather strap, eight round lenses in brass rims
            s1 = section(1.0, ('torso',))
            path = [V((-0.090 + 0.235 * t, s1['cy'] - 0.3, 1.08 - 0.22 * t)) for t in (0.0, 0.25, 0.5, 0.75, 1.0)]
            made.append(weighted(strip('lens_sash', [path], 0.044, over + 0.020, SASH, across=3, rim=0.003), torso_w))
            bm_g, bm_r = bmesh.new(), bmesh.new()
            for k in range(8):
                t = (k + 0.5) / 8.0; p = front(-0.090 + 0.235 * t, 1.08 - 0.22 * t) + V((0, -(over + 0.034), 0))
                res = bmesh.ops.create_cone(bm_g, cap_ends=True, cap_tris=False, segments=12, radius1=0.016, radius2=0.016, depth=0.004)
                q_ = V((0, -1, 0)).to_track_quat('Z', 'Y')
                for v in res['verts']: v.co = p + q_ @ v.co
                torus(bm_r, p, V((0, 1, 0)), 0.016, 0.003, n=14, seg=4)
            made.append(weighted(solid('lens_glass', bm_g, GLASS, 'torso_joint_3', 0), torso_w))
            made.append(weighted(solid('lens_rims', bm_r, GLASS_RIM, 'torso_joint_3', 0), torso_w))
        elif nm == 'lens_crossbow':
            # THE CROSSBOW (BB's Light Crossbow) with HIS SCOPE: a wood stock through his fist, the steel prod across its front, the
            # string, a tube of his own glass along its top
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); box(bm, fc + wd * 0.180, wd * 0.300, th * 0.016, ax * 0.024)
            made.append(solid('lens_stock', bm, BOW_WOOD, hb, 0))
            nose = fc + wd * 0.460
            bm = bmesh.new(); pipe(bm, [nose - th * 0.300 - wd * 0.060, nose - th * 0.150, nose, nose + th * 0.150, nose + th * 0.300 - wd * 0.060], 0.008, seg=6)
            made.append(solid('lens_prod', bm, BOW_STEEL, hb, 0))
            bm = bmesh.new(); cyl(bm, fc + wd * 0.060 - ax * 0.040, fc + wd * 0.300 - ax * 0.040, 0.014, seg=10)
            made.append(solid('lens_scope', bm, SCOPE, hb, 0))
            bm = bmesh.new(); res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=10, radius1=0.013, radius2=0.013, depth=0.003)
            q_ = wd.to_track_quat('Z', 'Y')
            for v in res['verts']: v.co = fc + wd * 0.302 - ax * 0.040 + q_ @ v.co
            made.append(solid('lens_scope_glass', bm, GLASS, hb, 0))
    return [m for m in made if m is not None]


# ---- this file's three men, put in BOSSES 4's globals (its functions read them at call time; its file is never edited) ----
F.BOSSES = BOSSES; F.ORDER = ORDER; F.POOL = POOL; F.NAMES = NAMES; F.MINE = MINE; F.CUT = CUT
F.HATS_MINE = ()
F.ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_BOSSES_TEN_TO_TWELVE_ROLL.json')
F.STAMP = 'bosses-10-12-11-14'
F.ME = ME
F.boss_pieces = boss_pieces
F.garments = lambda: None
F.CARDS = os.path.join(ROOT, 'records/target/bosses_ten_to_twelve')
F.PAINT = {'plate': ('press', 'pressplate', 'hand_press.png', 'HIS MALLET'), 'tooth': ('chair', 'pulled', 'hand_fix.png', 'HIS FORCEPS'),
           'lens': ('optician', 'spyglass', 'hand_look.png', 'HIS SPYGLASS')}
F.HELD = {'plate': 'THE MALLET', 'tooth': 'THE FORCEPS', 'lens': 'THE CROSSBOW'}


def pack():
    F.pack()
    ip = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'); I = json.load(open(ip))
    for p in json.load(open(F.ROLL)):
        lk = TE.look_of(p['id'])
        if lk in I['looks']: I['looks'][lk]['dressed'] = "BOSSES [ten to twelve] 11/14: his own pieces on his model (tools/bohemia_bosses_ten_to_twelve_11_14_26.py)"
    if 'THE PLATE' not in I['bosses']:
        I['bosses'] = I['bosses'].replace(', kind', ', THE PLATE, THE TOOTH, THE LENS (tools/bohemia_bosses_ten_to_twelve_11_14_26.py), kind', 1)
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))


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
