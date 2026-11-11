#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [seven to nine, each his own] (11/11/26, the coordinator's round 'the next three from the ladder'; rules 337, 441).
Rule 337 (Paolo 11/3): no more content without its assets. So THE LOCKSMITH, THE CHARGE and THE MACHINIST (the ladder's #7 to #9,
records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md rows 82-84) are modelled FIRST, through the same pipe as #4 to #6.

THE METHOD, REUSE FIRST: BOSSES 4's tool (tools/bohemia_bosses_four_to_six_11_3_26.py) is imported and never edited; its patch, roll,
batch, pack, purple and cards run here with this file's three men, this file's pieces and this file's names put in its globals (so its
build-one subprocess runs THIS file). Its piece helpers are closures, so they are re-stated below verbatim (COOK ARMOUR's shapes, the
same weights). No new hat: the watch cap and the work cap are HATS 1's, the welding mask pushed up is CHARACTER's (WELDER UP).
HIS WEAPON IS PART OF HIS MODEL, on his hand's bone, so it swings in COMBAT's own clips; fight_rig.json marks his look own_kit.

  THE LOCKSMITH  every lock still working. A tall thin older man in a CHARCOAL TURTLENECK under a LEATHER VEST, black denim, a
                 charcoal watch cap; A RING OF KEYS on his belt (a steel ring the size of a plate, twelve keys on it), A HEAVY CHAIN
                 worn across his chest from his left shoulder with a BRASS PADLOCK hung off it at his hip, and THE BIKE-LOCK CHAIN in
                 his fist (a hardened chain in a black nylon sleeve, its brass padlock swinging at the end).
  THE CHARGE     who still has anything that goes off. A big man in a FIELD JACKET over an olive tee, a slate work cap; A BELT OF
                 CHARGES round his chest (ten tan sticks on a canvas web, red wire between them, a black receiver at his sternum),
                 A DEAD MAN'S SWITCH in his left fist (a black grip, a red button, its wire up his arm to the belt), and THE SLEDGE in
                 his right (a 90 cm hickory handle, an 8-pound steel head).
  THE MACHINIST  the pipe, the cap and the nail. A man in WORK COVERALLS under a SMITH'S APRON, the welding mask pushed up, soot
                 gloves and a shell bandolier; TWO GAS BOTTLES on his back (oxygen green, acetylene red) with a hose to his hip, and
                 HIS PIPE GUN in his fist (a steel water pipe, a hex end cap for a breech, a wood grip, a hose clamp, a nail striker).

Never purple (the Amalgamation's alone), measured in purple().

Run (BOHEMIA_BPY = a python3.11 venv with bpy 4.2, the studio's way):
    python3 tools/bohemia_bosses_seven_to_nine_11_11_26.py roll
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_seven_to_nine_11_11_26.py look locksmith_0     the eight stills only
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_seven_to_nine_11_11_26.py batch 3              the street and fight passes
    python3 tools/bohemia_bosses_seven_to_nine_11_11_26.py pack | purple | cards

REFERENCE CHECK (the 9/4 standing duty): the twins are the six bosses at the same cell (slices/fight_rig boss_pot_0 ... boss_climb_0);
the real things are a 13 mm hardened bike-lock chain in a nylon sleeve with a laminated padlock, a locksmith's key ring; a stick of
dynamite (32 x 200 mm), a canvas web belt, a dead man's switch grip; an 8-pound sledgehammer on a 36-inch hickory handle; welding
cylinders (oxygen green, acetylene maroon) on a back frame, a crude slam-fire pipe gun (a 3/4-inch steel pipe, an end cap, a nail).
No reference game.
REUSE CHECK (REUSE-FIRST): BOSSES 4's tool and through it BOSSES' tool, CHARACTER's tool, kit, barber, hats door and wardrobe; DIRECTION's
rig, COMBAT's poses, RUN TWO's render and faces. Nothing added to the wardrobe.
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
    'Locksmith': dict(
        what="THE LOCKSMITH: every lock still working; a charcoal turtleneck under a leather vest, a watch cap, a ring of keys, a chain across his chest with a padlock, the bike-lock chain in his fist",
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.35, belly=-0.25, shoulders=-0.20, hips=-0.10)],
        look=dict(shirt=dict(colour=(48, 48, 50), sleeve='long'), coat=None,
                  trousers=dict(colour=(34, 34, 36), wide=0.014), shoes=dict(colour=(36, 34, 32), kind='boot', top=0.18), belt=None),
        tops=['CHARCOAL TURTLENECK'], coats=['LEATHER VEST'], legs=['BLACK DENIM'], feet=['CHARCOAL BOOTS'],
        kit=[['LEATHER BELT', 'LEATHER GLOVES']], hats=['HAT CHARCOAL WATCH CAP'], eyewear=[None],
        pieces=['lock_ring', 'lock_chain', 'lock_bikechain'], cuts=['DRY TAPER', 'HOME CLIPPERS', 'TEMPLE TAPER']),
    'Charge': dict(
        what="THE CHARGE: who still has anything that goes off; a field jacket, a slate work cap, a belt of charges round his chest, a dead man's switch in his left fist, the sledge in his right",
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.25, belly=0.35, shoulders=0.90, hips=0.25)],
        look=dict(shirt=dict(colour=(70, 74, 56), sleeve='long'), coat=None,
                  trousers=dict(colour=(44, 42, 38), wide=0.02), shoes=dict(colour=(32, 30, 28), kind='boot', top=0.24), belt=None),
        tops=['OLIVE DRAB TEE'], coats=['FIELD JACKET'], legs=['SOOT CARGOS'], feet=['TALL MOTO BOOTS'],
        kit=[['SCAV KNEEPADS', 'LEATHER GLOVES']], hats=['HAT SLATE WORK CAP'], eyewear=[None],
        pieces=['charge_vest', 'charge_switch', 'charge_sledge'], cuts=['RAZOR SKULL', 'HOME CLIPPERS', 'DEEP TAPER']),
    'Machinist': dict(
        what="THE MACHINIST: the pipe, the cap and the nail; coveralls under a smith's apron, the welding mask pushed up, two gas bottles on his back, his pipe gun",
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.0, belly=0.20, shoulders=0.45, hips=0.05)],
        look=dict(shirt=dict(colour=(66, 70, 60), sleeve='long'), coat=None,
                  trousers=dict(colour=(44, 42, 38), wide=0.018), shoes=dict(colour=(80, 60, 42), kind='boot', top=0.20), belt=None),
        tops=['WORK COVERALLS'], coats=["SMITH'S APRON"], legs=['SOOT CARGOS'], feet=['FIELD BOOTS'],
        kit=[['SOOT GLOVES', 'SHELL BANDOLIER']], hats=['WELDER UP'], eyewear=[None],
        pieces=['mach_bottles', 'mach_pipegun'], cuts=['GREASE BACK', 'TEMPLE TAPER', 'DEEP TAPER']),
}
ORDER = ['Locksmith', 'Charge', 'Machinist']
POOL = {'Locksmith': 'locksmith', 'Charge': 'charge', 'Machinist': 'machinist'}
NAMES = {'locksmith': 'THE LOCKSMITH', 'charge': 'THE CHARGE', 'machinist': 'THE MACHINIST'}
MINE = tuple(p for t in ORDER for p in BOSSES[t]['pieces'])
CUT = {'Locksmith': 'DRY TAPER', 'Charge': 'RAZOR SKULL', 'Machinist': 'TEMPLE TAPER'}


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
        # ---------------------------------------------------------------- THE LOCKSMITH
        if nm == 'lock_ring':
            # A RING OF KEYS on his belt at his right hip: a steel ring the size of a saucer, twelve keys hung off it, brass and steel
            s_ = section(0.88, ('torso',))
            c = V((-(s_['rx'] * 0.92 + over * 0.5 + 0.012), s_['cy'] - s_['front'] * 0.15, 0.835))
            bm = bmesh.new(); torus(bm, c, V((1, 0, 0)), 0.042, 0.004, n=22, seg=6)
            made.append(weighted(solid('lock_ring', bm, STEEL, 'Skeleton_torso_joint_1', 0), torso_w))
            bm = bmesh.new()
            for k in range(12):
                a = -math.pi * 0.85 + math.pi * 0.7 * k / 11.0
                p = c + V((0, 0.042 * math.cos(a), 0.042 * math.sin(a) - 0.02))
                box(bm, p + V((0.004 * (k % 2), 0, -0.030)), V((0.003, 0, 0)), V((0, 0.007 if k % 3 else 0.009, 0)), V((0, 0, 0.032)))
            g = solid('lock_keys', bm, BRASS, 'Skeleton_torso_joint_1', 0)
            paint(g, 'lock_keys_steel', STEEL, lambda q, nn: math.sin(61 * q.y + 13 * q.z) > 0.2)
            made.append(weighted(g, torso_w))
        elif nm == 'lock_chain':
            # A HEAVY CHAIN worn across him: over his left shoulder, down across his chest to his right hip, round his back; the
            # links stand on the front, a dark strap carries it round the back; HIS PADLOCK hangs off it at the hip
            s1 = section(1.0, ('torso',))
            path = ([V((0.090, s1['cy'] + 0.3, 1.08)), V((0.105, s1['cy'] + 0.04, 1.20)), V((0.105, s1['cy'] - 0.04, 1.20))] +
                    [V((0.090 - 0.235 * t, s1['cy'] - 0.3, 1.08 - 0.22 * t)) for t in (0.0, 0.25, 0.5, 0.75, 1.0)])
            made.append(weighted(strip('lock_strap', [path], 0.030, over + 0.018, CHAIN, across=3, rim=0.003), torso_w))
            bm = bmesh.new()
            for k in range(13):
                t = k / 12.0; x_, z_ = 0.090 - 0.235 * t, 1.08 - 0.22 * t
                p = front(x_, z_) + V((0, -(over + 0.030), 0))
                torus(bm, p, V((0.73, 0, 0.68)) if k % 2 else V((0, 1, 0)), 0.016, 0.0055, n=12, seg=5, sx=1.5)
            made.append(weighted(solid('lock_chain', bm, CHAIN, 'torso_joint_3', 0), torso_w))
            p = front(-0.150, 0.835) + V((0, -(over + 0.040), 0))
            bm = bmesh.new(); box(bm, p, V((0.030, 0, 0)), V((0, 0.014, 0)), V((0, 0, 0.026)))
            g = solid('lock_padlock', bm, BRASS, 'Skeleton_torso_joint_1', 0)
            made.append(weighted(g, torso_w))
            bm = bmesh.new(); pipe(bm, [p + V((-0.016, 0, 0.026)), p + V((-0.016, 0, 0.058)), p + V((0.016, 0, 0.058)), p + V((0.016, 0, 0.026))], 0.005, seg=6)
            made.append(weighted(solid('lock_shackle', bm, STEEL, 'Skeleton_torso_joint_1', 0), torso_w))
        elif nm == 'lock_bikechain':
            # THE BIKE-LOCK CHAIN (its BB row): a hardened chain in a black nylon sleeve wound once round his fist, hanging along his
            # fingers 50 cm, its brass padlock swinging at the end; it swings in COMBAT's clips with his hand
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); torus(bm, fc + wd * 0.010, wd, 0.040, 0.010, n=18, seg=6)
            pts = [fc + ax * (0.04 + 0.46 * t) + wd * (0.05 * math.sin(math.pi * t)) for t in (0.0, 0.2, 0.4, 0.6, 0.8, 1.0)]
            pipe(bm, pts, 0.017, seg=10)
            g = solid('lock_bikechain', bm, SLEEVE, hb, 0)
            paint(g, 'lock_bikechain_links', CHAIN, lambda q, nn: math.sin(140 * (q - fc).dot(ax)) > 0.82)
            made.append(g)
            end = pts[-1] + ax * 0.040
            bm = bmesh.new(); box(bm, end + ax * 0.030, th * 0.032, wd * 0.014, ax * 0.030)
            made.append(solid('lock_bikechain_padlock', bm, BRASS, hb, 0))
            bm = bmesh.new(); torus(bm, end - ax * 0.004, th, 0.018, 0.006, n=14, seg=6)
            made.append(solid('lock_bikechain_shackle', bm, STEEL, hb, 0))
        # ---------------------------------------------------------------- THE CHARGE
        elif nm == 'charge_vest':
            # A BELT OF CHARGES round his chest: a canvas web, ten tan sticks stood on it round the front and sides, a red wire
            # stitched from cap to cap, a black receiver box at his sternum with its stub aerial
            made.append(weighted(band('charge_web', [torso_ring(0.960, over + 0.012)], 0.070, 0.012, WEB), torso_w))
            ring = [q[0] for q in torso_ring(0.960, over + 0.034)]; s_ = section(0.960, ('torso',)); cy = s_['cy']   # (point, its way out)
            front_pts = [p for p in ring if p.y < cy + 0.01]
            front_pts.sort(key=lambda p: math.atan2(p.x, -(p.y - cy)))
            pick = [front_pts[int(round(i * (len(front_pts) - 1) / 9.0))] for i in range(10)]
            bm = bmesh.new(); tops = []
            for i, p in enumerate(pick):
                if abs(p.x) < 0.035: continue                                                              # the receiver sits there
                cyl(bm, p + V((0, 0, -0.085)), p + V((0, 0, 0.085)), 0.0165, seg=10); tops.append(p + V((0, 0, 0.092)))
            g = solid('charge_sticks', bm, STICK, 'torso_joint_3', 0)
            paint(g, 'charge_sticks_print', STICK_DK, lambda q, nn: abs(q.z - 0.960) < 0.012)
            made.append(weighted(g, torso_w))
            bm = bmesh.new(); pipe(bm, sorted(tops, key=lambda p: p.x), 0.0035, seg=6)
            made.append(weighted(solid('charge_wire', bm, WIRE_RED, 'torso_joint_3', 0), torso_w))
            p = front(0.0, 0.985) + V((0, -(over + 0.040), 0))
            bm = bmesh.new(); box(bm, p, V((0.034, 0, 0)), V((0, 0.018, 0)), V((0, 0, 0.040))); cyl(bm, p + V((0.024, 0, 0.040)), p + V((0.028, 0, 0.110)), 0.003, seg=6)
            made.append(weighted(solid('charge_receiver', bm, RECV, 'torso_joint_3', 0), torso_w))
        elif nm == 'charge_switch':
            # A DEAD MAN'S SWITCH in his left fist: a black grip with a red button under his thumb, its red wire up his forearm
            hb, fc, ax, wd, th = hand(False)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.050, fc + wd * 0.060, 0.016, seg=10)
            made.append(solid('charge_switch', bm, RECV, hb, 0))
            bm = bmesh.new(); cyl(bm, fc + wd * 0.060, fc + wd * 0.075, 0.010, seg=10)
            made.append(solid('charge_switch_button', bm, WIRE_RED, hb, 0))
            E0, W0, bone = forearm('L'); n_ = (W0 - E0).normalized().orthogonal().normalized()
            bm = bmesh.new(); pipe(bm, [fc - wd * 0.050, W0 + n_ * 0.040, E0.lerp(W0, 0.5) + n_ * 0.045, E0 + n_ * 0.045], 0.004, seg=6)
            made.append(weighted(solid('charge_switch_wire', bm, WIRE_RED, bone, 0), lambda q, bone=bone: {bone: 1.0}))
        elif nm == 'charge_sledge':
            # THE SLEDGE (BB's Two-Handed Hammer): a 90 cm hickory handle through his fist, a black grip of tape, an 8-pound steel
            # head across its end, the faces worn bright; held forward like the fire axe so it swings in COMBAT's clips
            hb, fc, ax, wd, th = hand(True)
            Lh = 0.80
            bm = bmesh.new(); cyl(bm, fc - wd * 0.080, fc + wd * Lh, 0.018, 0.016, seg=10)
            g = solid('charge_sledge_handle', bm, HICKORY, hb, 0)
            paint(g, 'charge_sledge_tape', RECV, lambda q, nn: (q - fc).dot(wd) < 0.05)
            made.append(g)
            head = fc + wd * (Lh + 0.010)
            bm = bmesh.new(); box(bm, head, ax * 0.090, th * 0.036, wd * 0.036)
            g = solid('charge_sledge_head', bm, SLEDGE, hb, 0)
            paint(g, 'charge_sledge_faces', (150, 148, 140), lambda q, nn: abs((q - head).dot(ax)) > 0.086)
            made.append(g)
        # ---------------------------------------------------------------- THE MACHINIST
        elif nm == 'mach_bottles':
            # TWO GAS BOTTLES on his back on a frame: oxygen green and acetylene maroon, 46 cm tall, their regulators up, a black
            # hose from them over his right side to his hip
            sh = section(0.98, ('torso',)); back = sh['cy'] + sh['back'] + over + 0.010
            bm_o, bm_a, bm_h = bmesh.new(), bmesh.new(), bmesh.new()
            for k, (x_, bm_) in enumerate(((0.062, bm_o), (-0.062, bm_a))):
                c = V((x_, back + 0.060, 0.930))
                cyl(bm_, c + V((0, 0, -0.230)), c + V((0, 0, 0.190)), 0.056, seg=14); ball(bm_, c + V((0, 0, 0.190)), 0.056, seg=14, ring=6, sq=(1, 1, 0.6))
                cyl(bm_h, c + V((0, 0, 0.220)), c + V((0, 0, 0.270)), 0.014, seg=8); box(bm_h, c + V((0, 0, 0.285)), V((0.024, 0, 0)), V((0, 0.016, 0)), V((0, 0, 0.016)))
            made.append(weighted(solid('mach_oxygen', bm_o, OXY, 'torso_joint_3', 0), torso_w))
            made.append(weighted(solid('mach_acetylene', bm_a, ACET, 'torso_joint_3', 0), torso_w))
            s2 = section(0.880, ('torso',))
            pipe(bm_h, [V((-0.062, back + 0.060, 1.220)), V((-0.130, back + 0.020, 1.160)), V((-(s2['rx'] + over + 0.020), s2['cy'], 1.000)), V((-(s2['rx'] + over + 0.018), s2['cy'] - 0.030, 0.880))], 0.008, seg=6)
            made.append(weighted(solid('mach_hose', bm_h, HOSE, 'torso_joint_3', 0), torso_w))
        elif nm == 'mach_pipegun':
            # HIS PIPE GUN (BB's Handgonne): a 3/4-inch steel water pipe through his fist and 45 cm out, a hex end cap for a breech
            # behind it, a wood grip under the cap, a hose clamp, a nail on a band of inner tube for a striker; crude, his
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.090, fc + wd * 0.470, 0.022, seg=12)   # read at the fight's size (measured 11/11: at real 3/4-inch it was one pixel)
            g = solid('mach_pipe', bm, PIPE, hb, 0)
            paint(g, 'mach_pipe_weld', PIPE_DK, lambda q, nn: abs((q - fc).dot(wd) - 0.200) < 0.012)
            made.append(g)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.150, fc - wd * 0.085, 0.031, seg=6)
            made.append(solid('mach_cap', bm, PIPE_DK, hb, 0))
            bm = bmesh.new(); box(bm, fc - wd * 0.130 + ax * 0.070, wd * 0.022, th * 0.016, ax * 0.060)
            made.append(solid('mach_grip', bm, GRIP, hb, 0))
            bm = bmesh.new(); torus(bm, fc + wd * 0.200, wd, 0.020, 0.004, n=14, seg=5)
            cyl(bm, fc - wd * 0.165, fc - wd * 0.150 - ax * 0.030, 0.003, seg=5)
            made.append(solid('mach_clamp', bm, STEEL_DK, hb, 0))
    return [m for m in made if m is not None]


# ---- this file's three men, put in BOSSES 4's globals (its functions read them at call time; its file is never edited) ----
F.BOSSES = BOSSES; F.ORDER = ORDER; F.POOL = POOL; F.NAMES = NAMES; F.MINE = MINE; F.CUT = CUT
F.HATS_MINE = ()                     # no new hat: every cut here is HATS 1's or CHARACTER's own
F.ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_BOSSES_SEVEN_TO_NINE_ROLL.json')
F.STAMP = 'bosses-7-9-11-11'
F.ME = ME
F.boss_pieces = boss_pieces
F.garments = lambda: None
F.CARDS = os.path.join(ROOT, 'records/target/bosses_seven_to_nine')
F.PAINT = {'locksmith': ('lockshop', 'cutlock', 'hand_pick.png', 'HIS PICK SET'), 'charge': ('powderyard', 'rubble', 'hand_blow.png', 'HIS POWDER'),
           'machinist': ('pipeshop', 'weldbench', 'hand_weld.png', 'HIS PIPE GUN')}
F.HELD = {'locksmith': 'THE BIKE-LOCK CHAIN', 'charge': 'THE SLEDGE', 'machinist': 'THE PIPE GUN'}


def pack():
    """BOSSES 4's pack (own_kit on each look), then the line in fight_rig.json that names every boss"""
    F.pack()
    ip = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'); I = json.load(open(ip))
    for p in json.load(open(F.ROLL)):
        lk = TE.look_of(p['id'])
        if lk in I['looks']: I['looks'][lk]['dressed'] = "BOSSES [seven to nine] 11/11: his own pieces on his model (tools/bohemia_bosses_seven_to_nine_11_11_26.py)"
    if 'THE LOCKSMITH' not in I['bosses']:
        I['bosses'] = I['bosses'].replace(', kind', ', THE LOCKSMITH, THE CHARGE, THE MACHINIST (tools/bohemia_bosses_seven_to_nine_11_11_26.py), kind', 1)
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))


if __name__ == '__main__':
    F.patch()
    a = sys.argv[1:]
    cmd = a[0] if a else 'roll'
    if cmd == 'roll': F.roll()
    elif cmd == 'build-one': TE.build_one(a[1])
    elif cmd == 'look':
        for pid in a[1:]:
            g = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % TE.tag_of(pid))
            if os.path.exists(g) and '--keep' not in a: os.remove(g)
            TE.look(pid)
    elif cmd == 'batch': F.batch(int(a[1]) if len(a) > 1 else 1)
    elif cmd == 'worker': TE.worker(int(a[1]), int(a[2]))
    elif cmd == 'make':
        for pid in a[1:]: TE.make(pid)
    elif cmd == 'pack': pack()
    elif cmd == 'purple': F.purple()
    elif cmd == 'cards': F.cards()
