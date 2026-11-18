#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [sixteen to eighteen, each his own] (11/18/26, the coordinator's round 'BOSSES next', rules 441, 453, 454(a)).
THE WARD, THE CISTERN and THE SMITH (the ladder's #16 to #18, records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md rows 91-93), modelled FIRST,
through the same pipe as #13 to #15 (tools/bohemia_bosses_thirteen_to_fifteen_11_17_26.py: BOSSES 4's tool imported and never edited,
its piece helpers re-stated verbatim, his weapon on his hand's bone). No new hat, no new garment. Rule 454(a): these men are made with
what they carry and do, not with talk.

  THE WARD     the last clinic, and what is left in it. A thin man in surgeon's green, a sage car coat over a green shirt, green
               trousers, white sneakers; A STETHOSCOPE round his neck, HIS MASK pulled down under his chin, and THE AMPUTATION KNIFE
               in his fist (a long straight blade, BB's Scramasax).
  THE CISTERN  every roof worth catching rain off. A heavy man in a storm poncho over a slate tank, slate work pants, ranch boots; THE
               WATER KEY in his fist (a curb-stop key, a long steel shaft with a T at the top, BB's Tire Iron), A FIVE-GALLON BLUE JUG
               by its handle in his other fist and A COILED HOSE on his hip.
  THE SMITH    the last forge that still lights. A big man in a smith's leather apron over a black tank, rust cargos, stacked boots;
               THE CROSS-PEEN HAMMER in his fist (BB's Warhammer), THE TONGS in his other fist and WELDING GOGGLES round his neck.

Run as the thirteen-to-fifteen tool (roll | look | batch | pack | purple | cards), BOHEMIA_BPY = the bpy venv.
REFERENCE CHECK (the 9/4 standing duty): the twins are the fifteen bosses at the same cell; the real things are a dual-head
stethoscope, a pleated surgical mask, a Liston amputation knife (a 20 to 30 cm straight blade); a curb-stop water key (a 1 m T-bar), a
five-gallon water jug, a garden hose; a 2 kg cross-peen hammer, blacksmith's flat tongs, round welding goggles. No reference game.
REUSE CHECK (REUSE-FIRST): the thirteen-to-fifteen tool's way, BOSSES 4's tool and through it BOSSES', CHARACTER's tool, kit, barber,
hats door and wardrobe; DIRECTION's rig, COMBAT's poses, RUN TWO's render and faces. Nothing added to the wardrobe.
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_bosses_four_to_six_11_3_26 as F

TE, BT = F.TE, F.BT
ME = os.path.abspath(__file__)

BOSSES = {
    'Ward': dict(
        what="THE WARD: the last clinic; surgeon's green, a sage car coat over a green shirt, green trousers, white sneakers, a stethoscope, his mask pulled down, the amputation knife",
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.30, belly=-0.30, shoulders=-0.20, hips=-0.10)],
        look=dict(shirt=dict(colour=(98, 124, 108), sleeve='short'), coat=None,
                  trousers=dict(colour=(90, 116, 100), wide=0.014), shoes=dict(colour=(206, 204, 196), kind='boot', top=0.10), belt=None),
        tops=['WHITE TEE'], coats=['SAGE CAR COAT'], legs=['SAGE TROUSERS'], feet=['WHITE SNEAKERS'],
        kit=[[]], hats=[None], eyewear=[None],
        pieces=['ward_knife', 'ward_scope', 'ward_mask'], cuts=['DRY TAPER', 'FRENCH CROP', 'HOME CLIPPERS']),
    'Cistern': dict(
        what="THE CISTERN: every roof worth catching rain off; a storm poncho over a slate tank, slate work pants, ranch boots, the water key, a five-gallon blue jug, a coiled hose",
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.05, belly=0.55, shoulders=0.30, hips=0.35)],
        look=dict(shirt=dict(colour=(64, 72, 80), sleeve='none'), coat=None,
                  trousers=dict(colour=(78, 84, 92), wide=0.018), shoes=dict(colour=(96, 66, 42), kind='boot', top=0.22), belt=None),
        tops=['SOOT TANK'], coats=['STORM PONCHO'], legs=['SLATE WORK PANTS'], feet=['RANCH BOOTS'],
        kit=[['LEATHER BELT']], hats=[None], eyewear=[None],
        pieces=['cistern_key', 'cistern_jug', 'cistern_hose'], cuts=['SALT SKULL', 'DEEP TAPER', 'HOME CLIPPERS']),
    'Smith': dict(
        what="THE SMITH: the last forge that still lights; a smith's leather apron over a black tank, rust cargos, stacked boots, the cross-peen hammer, the tongs, welding goggles",
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.20, belly=0.25, shoulders=1.00, hips=0.20)],
        look=dict(shirt=dict(colour=(28, 28, 30), sleeve='none'), coat=None,
                  trousers=dict(colour=(112, 70, 44), wide=0.018), shoes=dict(colour=(92, 52, 38), kind='boot', top=0.20), belt=None),
        tops=['BLACK TANK'], coats=["SMITH'S APRON"], legs=['RUST CARGOS'], feet=['BRICK STACK BOOT'],
        kit=[['LEATHER GLOVES']], hats=[None], eyewear=[None],
        pieces=['smith_hammer', 'smith_tongs', 'smith_goggles'], cuts=['SCORCH', 'RAZOR SKULL', 'DEEP TAPER']),
}
ORDER = ['Ward', 'Cistern', 'Smith']
POOL = {'Ward': 'ward', 'Cistern': 'cistern', 'Smith': 'smith'}
NAMES = {'ward': 'THE WARD', 'cistern': 'THE CISTERN', 'smith': 'THE SMITH'}
MINE = tuple(p for t in ORDER for p in BOSSES[t]['pieces'])
CUT = {'Ward': 'DRY TAPER', 'Cistern': 'SALT SKULL', 'Smith': 'SCORCH'}

STEEL, STEEL_DK, GRIP = (176, 178, 180), (70, 70, 72), (40, 36, 32)
TUBE, SCOPE, MASK = (30, 32, 34), (168, 170, 172), (150, 184, 200)
KEY, KEY_DK, JUG, JUG_DK, CAP, HOSE, HOSE_DK = (96, 96, 92), (54, 54, 52), (70, 130, 186), (44, 92, 140), (34, 60, 110), (52, 112, 58), (30, 70, 36)
IRON, IRON_DK, HAFT, HAFT_DK, GLASS, STRAP = (78, 76, 74), (40, 38, 36), (120, 88, 52), (78, 56, 32), (22, 40, 30), (46, 40, 34)


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
        # ---------------------------------------------------------------- THE WARD
        if nm == 'ward_knife':
            # THE AMPUTATION KNIFE (BB's Scramasax): a black grip through his fist, a short steel guard, a long straight narrow blade out
            # past it, its back thick and its edge down
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.05, fc + wd * 0.11, 0.014, 0.013, seg=10)
            made.append(solid('ward_grip', bm, GRIP, hb, 0))
            g0 = fc + wd * 0.115
            bm = bmesh.new(); box(bm, g0, wd * 0.006, th * 0.030, ax * 0.012)
            made.append(solid('ward_guard', bm, STEEL_DK, hb, 0))
            bm = bmesh.new(); box(bm, g0 + wd * 0.150, wd * 0.145, th * 0.0035, ax * 0.013)
            g = solid('ward_blade', bm, STEEL, hb, 0)
            paint(g, 'ward_blade_back', STEEL_DK, lambda q, nn: (q - g0).dot(ax) < -0.007)
            made.append(g)
        elif nm == 'ward_scope':
            # A STETHOSCOPE round his neck: the black tube round the back of his collar, both ends down his chest, the steel chest piece
            # hanging at the end of one and the ear tips at the other
            made.append(weighted(band('ward_tube', [torso_ring(1.150, over + 0.010)], 0.009, 0.006, TUBE), torso_w))
            bm = bmesh.new(); bm2 = bmesh.new()
            for sx, z1 in ((-0.075, 1.02), (0.075, 1.08)):
                p0 = front(sx * 0.9, 1.145) + V((0, -(over + 0.016), 0)); p1 = front(sx, z1) + V((0, -(over + 0.026), 0))
                pipe(bm, [p0, p0.lerp(p1, 0.5) + V((0, -0.006, 0)), p1], 0.0055, seg=8)
                if sx < 0: cyl(bm2, p1 + V((0, 0, -0.004)), p1 + V((0, -0.010, -0.004)), 0.022, seg=14)   # the chest piece
                else: ball(bm2, p1, 0.008, seg=8, ring=4)                                                  # the ear tips
            made.append(weighted(solid('ward_tubes', bm, TUBE, 'torso_joint_3', 0), torso_w))
            made.append(weighted(solid('ward_chestpiece', bm2, SCOPE, 'torso_joint_3', 0), torso_w))
        elif nm == 'ward_mask':
            # HIS MASK pulled down under his chin: a pale blue pleated band round the front of his neck, its ear loops behind
            g = band('ward_mask', [torso_ring(1.172, over + 0.004)], 0.030, 0.004, MASK, seg=6)
            if g is not None:
                paint(g, 'ward_mask_pleat', (124, 160, 178), lambda q, nn: abs(math.sin(q.z * 420)) > 0.86)
                made.append(weighted(g, torso_w))
        # ---------------------------------------------------------------- THE CISTERN
        elif nm == 'cistern_key':
            # THE WATER KEY (a curb-stop key; BB's Tire Iron): the T bar through his fist, the long steel shaft down from it, the square
            # socket at its foot that turns a street's water on and off
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); cyl(bm, fc - th * 0.13, fc + th * 0.13, 0.011, seg=10)
            made.append(solid('cistern_tbar', bm, KEY_DK, hb, 0))
            bm = bmesh.new(); cyl(bm, fc, fc + wd * 0.80, 0.011, seg=10)
            made.append(solid('cistern_shaft', bm, KEY, hb, 0))
            bm = bmesh.new(); box(bm, fc + wd * 0.83, wd * 0.035, th * 0.022, ax * 0.022)
            made.append(solid('cistern_socket', bm, KEY_DK, hb, 0))
        elif nm == 'cistern_jug':
            # A FIVE-GALLON BLUE JUG by its handle in his left fist, hanging at his knee: the drum, its shoulders, the neck and the cap
            hb, fc, ax, wd, th = hand(False)
            c = fc - ax * 0.20
            bm = bmesh.new(); cyl(bm, c - ax * 0.17, c + ax * 0.10, 0.130, seg=18)
            g = solid('cistern_drum', bm, JUG, hb, 0)
            paint(g, 'cistern_drum_rib', JUG_DK, lambda q, nn: abs((q - c).dot(ax) + 0.03) < 0.012 or abs((q - c).dot(ax) - 0.06) < 0.010)
            made.append(g)
            bm = bmesh.new(); cyl(bm, c + ax * 0.10, c + ax * 0.15, 0.130, 0.040, seg=18); cyl(bm, c + ax * 0.15, c + ax * 0.19, 0.030, seg=12)
            made.append(solid('cistern_neck', bm, JUG, hb, 0))
            bm = bmesh.new(); cyl(bm, c + ax * 0.19, c + ax * 0.21, 0.034, seg=12)
            made.append(solid('cistern_cap', bm, CAP, hb, 0))
            bm = bmesh.new(); pipe(bm, [c + ax * 0.13 - th * 0.07, fc - th * 0.02, fc + th * 0.02, c + ax * 0.13 + th * 0.07], 0.009, seg=8)
            made.append(solid('cistern_handle', bm, JUG_DK, hb, 0))
        elif nm == 'cistern_hose':
            # A COILED HOSE on his right hip, hung off his belt: three green loops, the brass nozzle end hanging out of them
            c = hip(-0.180, 0.92) + V((-0.020, 0, -0.04))
            bm = bmesh.new()
            for k in range(3): torus(bm, c + V((-0.006 * k, 0, -0.008 * k)), V((1, 0, 0)), 0.085 - 0.006 * k, 0.010, n=22, seg=6)
            g = solid('cistern_hose', bm, HOSE, 'Skeleton_torso_joint_1', 0)
            paint(g, 'cistern_hose_dk', HOSE_DK, lambda q, nn: noise(q, 3.1) > 0.72)
            made.append(g)
            bm = bmesh.new(); cyl(bm, c + V((-0.010, 0.0, -0.085)), c + V((-0.010, 0.0, -0.140)), 0.012, 0.009, seg=8)
            made.append(solid('cistern_nozzle', bm, (176, 146, 70), 'Skeleton_torso_joint_1', 0))
        # ---------------------------------------------------------------- THE SMITH
        elif nm == 'smith_hammer':
            # THE CROSS-PEEN HAMMER (BB's Warhammer): a hickory handle through his fist, the steel head across its end, flat face one
            # side and the peen's wedge the other
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.06, fc + wd * 0.36, 0.015, 0.013, seg=10)
            g = solid('smith_handle', bm, HAFT, hb, 0)
            paint(g, 'smith_handle_dk', HAFT_DK, lambda q, nn: noise(q, 1.7) > 0.74)
            made.append(g)
            hd = fc + wd * 0.38
            bm = bmesh.new(); box(bm, hd + th * 0.020, wd * 0.028, th * 0.055, ax * 0.026)
            made.append(solid('smith_head', bm, IRON, hb, 0))
            bm = bmesh.new(); box(bm, hd - th * 0.055, wd * 0.030, th * 0.022, ax * 0.008)
            made.append(solid('smith_peen', bm, IRON_DK, hb, 0))
        elif nm == 'smith_tongs':
            # THE TONGS in his left fist, hanging down past his knee: two long black reins from his grip to the rivet, the flat jaws past it
            hb, fc, ax, wd, th = hand(False)
            bm = bmesh.new()
            for s_ in (-1, 1):
                pipe(bm, [fc + th * (0.010 * s_), fc - ax * 0.24 + th * (0.018 * s_), fc - ax * 0.42 + th * (0.006 * s_)], 0.006, seg=6)
            made.append(solid('smith_reins', bm, IRON_DK, hb, 0))
            bm = bmesh.new(); ball(bm, fc - ax * 0.42, 0.010, seg=8, ring=4)
            for s_ in (-1, 1): box(bm, fc - ax * 0.48 + th * (0.008 * s_), ax * 0.055, th * 0.004, wd * 0.014)
            made.append(solid('smith_jaws', bm, IRON, hb, 0))
        elif nm == 'smith_goggles':
            # WELDING GOGGLES round his neck, at the top of his apron: the strap round his collar, two round dark lenses in steel rims
            made.append(weighted(band('smith_strap', [torso_ring(1.150, over + 0.012)], 0.012, 0.005, STRAP), torso_w))
            bm = bmesh.new(); bm2 = bmesh.new()
            for sx in (-0.036, 0.036):
                p = front(sx, 1.10) + V((0, -(over + 0.030), 0))
                cyl(bm, p, p + V((0, -0.018, 0)), 0.026, seg=14)
                cyl(bm2, p + V((0, -0.018, 0)), p + V((0, -0.020, 0)), 0.020, seg=14)
            made.append(weighted(solid('smith_rims', bm, STEEL_DK, 'torso_joint_3', 0), torso_w))
            made.append(weighted(solid('smith_lenses', bm2, GLASS, 'torso_joint_3', 0), torso_w))
    return [m for m in made if m is not None]


# ---- this file's three men, put in BOSSES 4's globals (its functions read them at call time; its file is never edited) ----
F.BOSSES = BOSSES; F.ORDER = ORDER; F.POOL = POOL; F.NAMES = NAMES; F.MINE = MINE; F.CUT = CUT
F.HATS_MINE = ()
F.ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_BOSSES_SIXTEEN_TO_EIGHTEEN_ROLL.json')
F.STAMP = 'bosses-16-18-11-18'
F.ME = ME
F.boss_pieces = boss_pieces
F.garments = lambda: None
F.CARDS = os.path.join(ROOT, 'records/target/bosses_sixteen_to_eighteen')
F.PAINT = {'ward': ('clinic', 'bandage', 'hand_treat.png', 'HIS NURSE'), 'cistern': ('rooftanks', 'raintarp', 'hand_catch.png', 'HIS KEEPER'),
           'smith': ('forge', 'ingot', 'hand_smelt.png', 'HIS APPRENTICE')}
F.HELD = {'ward': 'THE KNIFE', 'cistern': 'THE WATER KEY', 'smith': 'THE HAMMER'}


def pack():
    """BOSSES 4's pack, with the faces on the strip of the thirteen-to-fifteen tool's (faces_bosses.webp, fight_rig.json faces.more):
    the fight's first face strip is one row and full at the WebP limit (measured 11/17), so these three go on the bosses' strip after
    THE BARBER, THE INK and THE DOGS"""
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
        fz = dict(faces0); keep = [m for m in (fz.get('more') or []) if m.get('file') == STRIP]
        more = [m for m in (fz.get('more') or []) if m.get('file') != STRIP]
        by = keep[0].get('by') if keep else 'BOSSES 11/17, tools/bohemia_bosses_thirteen_to_fifteen_11_17_26.py pack (the first strip stops at the WebP limit)'
        more.append(dict(file=STRIP, order=tmp.get('order', order0) if tmp.get('file') == STRIP else order0,
                         by=by + '; BOSSES 11/18 adds THE WARD, THE CISTERN, THE SMITH (tools/bohemia_bosses_sixteen_to_eighteen_11_18_26.py)'))
        fz['more'] = more; I['faces'] = fz
        I['bosses'] = bosses0 if 'THE WARD' in bosses0 else bosses0.replace(', kind', ', THE WARD, THE CISTERN, THE SMITH (tools/bohemia_bosses_sixteen_to_eighteen_11_18_26.py), kind', 1)
        for p in json.load(open(F.ROLL)):
            lk = TE.look_of(p['id'])
            if lk in I['looks']: I['looks'][lk]['dressed'] = "BOSSES [sixteen to eighteen] 11/18: his own pieces on his model (tools/bohemia_bosses_sixteen_to_eighteen_11_18_26.py)"
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
