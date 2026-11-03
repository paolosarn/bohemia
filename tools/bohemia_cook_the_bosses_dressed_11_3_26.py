#!/usr/bin/env python3
"""BOHEMIA -- COOK [the bosses dressed] (11/3/26, VAMILY rule 337, ask line 345). Paolo, angry and right: 'you build the
bosses like shit, we don't have enough assets, and you're not creating assets, weapons, armor, the vibe, nothing.'

MEASURED FIRST (records/target/character/bosses/, 11/2): THE POT, THE TAP and THE FILTER stood in the fight as three thin men
in wardrobe pieces any rolled man wears (a bone shirt and a head wrap, a field shirt under a utility vest, olive coveralls
and a gas mask). Nothing on any of them said WHICH man he was; the cleaver, the lid and the wrench were not on them at all
(their looks have no held sheets, so the fight drew whatever their stand-in gang holds, or nothing).

THE METHOD, REUSE FIRST. BOSSES' own tool (tools/bohemia_bosses_the_three_men.py, imported, never edited) pointed CHARACTER's
tool for a new kind of man (tools/bohemia_character_the_three_enemies.py) at the three; this tool runs that same pipe with
each boss's OWN pieces modelled on his body (the body tool's extra() hook, after his garments, CHARACTER's kit: its cloth
lift, bands, rings, sections and the man's own hands) and one hat through HATS 1's door (the welder's way), then the barber,
DIRECTION's master rig (stand, the walk in eight, the portrait and its four mouths), COMBAT's fight poses and the six fight
clips, and BOSSES' own pack (kind 'boss', his face on the strip and in PORTRAIT's manifest). HIS WEAPON AND HIS SHIELD ARE
PART OF HIS MODEL, on his hand's bone and his forearm's, so they swing in COMBAT's own clips; fight_rig.json marks his look
own_kit and the fight draws no second thing over him (the rule the Heavy's crash bar already lives by).

  THE POT     the kitchen's captain: a big man in STAINED CHEF'S WHITES (the whites a value up from the old bone shirt,
              old grease and blood laid on as their own cloth), a black riot vest CUT DOWN to his chest with a knife (the
              hem ragged, his belly out under it, the trauma plate and the side straps kept), a red neckerchief, a leather
              butcher's apron, a crushed chef's toque, THE COPPER POT'S LID on his left forearm (a 44 cm stockpot lid, its
              loop handle out, tarnished at the rim, strapped on), THE BUTCHER'S CLEAVER in his right fist (a broad
              rectangular blade, the hang hole, a bright edge, a riveted wooden handle).
  THE TAP     the pump-house boss: OIL-BLACK COVERALLS, a fire hose's canvas run across him like a sash, a RED VALVE
              HANDWHEEL bolted to his chest for a badge (five spokes, a hub, chipped red over cast iron), a brass ring of
              valve keys on his hip, tan gloves, the work cap and wraparound shades, and THE VALVE WRENCH: a 55 cm pipe
              wrench, red handle, hook jaw, knurled nut, carried like a hammer.
  THE FILTER  the mechanic who keeps the plant: olive coveralls and his rubber respirator, A FILTER PACK on his back (two
              filter-yellow canisters on a frame, black bands) and TWO RIBBED HOSES over his shoulders to his mask's chin,
              HIS ROBOTS' PARTS ON HIM (a robot's forearm plating strapped on his left arm, a robot's shoulder shell, a
              robot's camera eye on his chest strap with its amber lens, the Mechanic's cables), and A CLEAVER of his own
              (a heavy chopper cut from a robot's panel, riveted, its handle taped).

Run (BOHEMIA_BPY = a python3.11 venv with bpy 4.2, the studio's way):
    python3 tools/bohemia_cook_the_bosses_dressed_11_3_26.py roll            the roll: his face and body kept, his clothes and pieces his own
    BOHEMIA_BPY=/tmp/v/bin/python python3 tools/bohemia_cook_the_bosses_dressed_11_3_26.py look pot_0     the eight stills only
    BOHEMIA_BPY=/tmp/v/bin/python python3 tools/bohemia_cook_the_bosses_dressed_11_3_26.py make pot_0     the street and fight pass
    python3 tools/bohemia_cook_the_bosses_dressed_11_3_26.py pack            BOSSES' pack, then own_kit on each look
    python3 tools/bohemia_cook_the_bosses_dressed_11_3_26.py sheet           the VOTE sheets and the reference twins

REFERENCE CHECK (the 9/4 standing duty): the twins are the old three (11/2's renders, kept side by side on the sheet) and the
fight's own cast at the same cell; the real things are a line cook's double-breasted whites, toque and neckerchief, a patrol
riot vest, a 40-quart stockpot's lid, a butcher's cleaver; a water utility's red gate-valve handwheel, valve keys and an
18-to-24 inch pipe wrench; a twin-canister respirator on a hose (a supplied-air rig) and a hobby robot's plating and camera.
No reference game.
REUSE CHECK (REUSE-FIRST): BOSSES' tool and its pack, CHARACTER's tool, kit, barber, hats door and wardrobe (two colours of
two garments added in memory: CHEF WHITES is the bone button-up a value up, OIL COVERALLS the work coveralls in oil black),
the Mechanic's cables, DIRECTION's rig, COMBAT's poses, RUN TWO's render and faces.
"""
import json, math, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_bosses_the_three_men as BT

TE = BT.TE
ME = os.path.abspath(__file__)
STAMP = 'bosses-dressed-11-3'
ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_BOSSES_DRESSED_ROLL.json')
OLD_ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_BOSSES_ROLL.json')
PROOF = os.path.join(ROOT, 'records/target/cook_bosses_dressed')

# ---- the colours at the source (the grime is the rig's source pass) ---------------------------------------------------
RIOT, RIOT_PLATE, RIOT_STRAP = (30, 30, 32), (40, 40, 43), (58, 52, 44)
STAIN_OLD, STAIN_GREASE = (104, 66, 44), (150, 128, 82)
KERCHIEF = (150, 42, 34)
COPPER, COPPER_DK, COPPER_TARN = (176, 104, 60), (120, 70, 42), (92, 82, 58)
STEEL, STEEL_DK, EDGE = (104, 102, 98), (54, 52, 50), (206, 202, 190)
WOOD, RIVET = (86, 58, 38), (170, 160, 130)
LEATHER = (96, 62, 38)
VALVE_RED, VALVE_RED_DK, IRON = (156, 40, 30), (110, 30, 24), (56, 54, 50)
BRASS = (160, 128, 64)
HOSE_CANVAS = (172, 150, 104)
FILTER_YEL, BAND_BLK, RUBBER = (184, 152, 60), (32, 31, 30), (36, 35, 33)
ROBOT, ROBOT_DK, ROBOT_STRIPE, LENS_AMBER = (126, 122, 112), (70, 68, 64), (176, 96, 40), (230, 158, 56)
TAPE = (40, 40, 40)
TOQUE, TOQUE_BAND = (214, 210, 198), (128, 118, 96)

LOOKS = {
    'Pot': dict(tops=['CHEF WHITES'], coats=['LEATHER HALF APRON'], legs=['CHARCOAL CROP TROUSER'], feet=['COAL MID BOOT'],
                kit=[['LEATHER BELT']], hats=['CHEF TOQUE'], eyewear=[None], cut='RAZOR SKULL',
                pieces=['pot_stains', 'pot_vest', 'pot_kerchief', 'pot_lid', 'pot_cleaver'],
                what="THE POT: the kitchen's captain; stained chef's whites under a riot vest cut down to his chest, a toque, the copper pot's lid on his arm, the butcher's cleaver"),
    'Tap': dict(tops=['OIL COVERALLS'], coats=[None], legs=['KHAKI CARGOS'], feet=['RUST BOOTS'],
                kit=[['SCAV TOOL BELT', 'LEATHER GLOVES']], hats=['HAT DUST WORK CAP'], eyewear=['FACE WRAPAROUND SHADES'], cut='DEEP TAPER',
                pieces=['tap_hose', 'tap_wheel', 'tap_keys', 'tap_wrench'],
                what='THE TAP: the pump-house boss; oil-black coveralls, a red valve handwheel for a badge, a fire hose across him, the valve wrench'),
    'Filter': dict(tops=['WORK COVERALLS'], coats=[None], legs=['PATCHED WORK PANTS'], feet=['FIELD BOOTS'],
                   kit=[['SOOT TOOL BELT', 'SOOT GLOVES']], hats=['HAT OLIVE FIELD CAP'], eyewear=['FACE RUBBER GAS MASK'], cut='HOME CLIPPERS',
                   pieces=['cables', 'filter_pack', 'filter_hoses', 'filter_robot', 'filter_eye', 'filter_cleaver'],
                   what="THE FILTER: the mechanic; a respirator on two hoses to a filter pack, his robots' parts strapped on him, a chopper cut from a robot's panel"),
}
MINE = ('pot_stains', 'pot_vest', 'pot_kerchief', 'pot_lid', 'pot_cleaver', 'tap_hose', 'tap_wheel', 'tap_keys', 'tap_wrench',
        'filter_pack', 'filter_hoses', 'filter_robot', 'filter_eye', 'filter_cleaver')


def garments():
    """two colours of two garments already made, in memory (the wardrobe's own cuts, never a new garment)"""
    import bohemia_character_garments_base as B
    if 'CHEF WHITES' not in B.BY:
        B.BY['CHEF WHITES'] = dict(B.BY['BONE BUTTON-UP'], name='CHEF WHITES', tag='base_chef_whites',
                                   dk=(168, 162, 146), mid=(208, 204, 192), lt=(232, 230, 222))
        B.BY['OIL COVERALLS'] = dict(B.BY['WORK COVERALLS'], name='OIL COVERALLS', tag='base_oil_coveralls',
                                     dk=(24, 23, 22), mid=(42, 40, 37), lt=(70, 66, 58))


def patch():
    BT.patch()
    garments()
    for t, L in LOOKS.items():
        T = TE.TYPES[t]
        for k in ('tops', 'coats', 'legs', 'feet', 'kit', 'hats', 'eyewear', 'pieces', 'what'): T[k] = L[k]
    TE.STAMP = STAMP
    TE.ROLL = ROLL

    def ensure_model(pid):
        glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % TE.tag_of(pid))
        if not os.path.exists(glb):
            if not TE.R2().run([TE.bpy_py(), ME, 'build-one', pid], glb): return None
        return glb
    TE.ensure_model = ensure_model
    orig = TE.body_pieces

    def body_pieces(names, X):
        return orig([n for n in names if n not in MINE], X) + boss_pieces([n for n in names if n in MINE], X)
    TE.body_pieces = body_pieces
    install_hat()


def roll():
    """his face, skin, body and name kept from BOSSES' roll; his clothes, hat, cut and pieces his own"""
    R = json.load(open(OLD_ROLL))
    for P in R:
        L = LOOKS[P['gang']]
        P['top'] = L['tops'][0]
        if L['coats'][0]: P['coat'] = L['coats'][0]
        else: P.pop('coat', None)
        P['legs'], P['feet'], P['kit'] = L['legs'][0], L['feet'][0], list(L['kit'][0])
        P.pop('hat', None); P.pop('eyewear', None)
        if L['hats'][0]: P['hat'] = L['hats'][0]
        if L['eyewear'][0]: P['eyewear'] = L['eyewear'][0]
        P['hair_cut'] = L['cut']; P['pieces'] = list(L['pieces'])
    json.dump(R, open(ROLL, 'w'), indent=1)
    print('rolled', len(R), '->', os.path.relpath(ROLL, ROOT))


# ---- THE CHEF'S TOQUE (a hat through HATS 1's door, the welder's way) ------------------------------------------------
def install_hat():
    import bohemia_character_hats_one as HATS
    if getattr(HATS, '_bosses_dressed', False): return
    old = HATS.build

    def build(cut, L):
        if cut == 'CHEF TOQUE': return toque(L)
        return old(cut, L)
    HATS.build = build; HATS._bosses_dressed = True


def toque(L):
    bmesh = L['bmesh']; Vector, BVHTree = L['Vector'], L['BVHTree']
    C, skull_bm, finish, mat = L['C'], L['skull_bm'], L['finish'], L['mat']
    bm_s = skull_bm(); bvh = BVHTree.FromBMesh(bm_s); bm_s.free()

    def skull_r(az, z):
        d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z))
        hit = bvh.ray_cast(o, d, 0.5)
        return (hit[0] - o).length if hit[0] else 0.11
    m_cloth = mat('toque_cloth', TOQUE, 0.95); m_band = mat('toque_band', TOQUE_BAND, 0.95)
    NA = 36
    # the band: a stiff 5 cm ring round the brow, 9 mm off the skull, sitting a little low at the back (worn, not placed)
    band_r = [skull_r(-math.pi + 2 * math.pi * i / NA, 0.055) + 0.010 for i in range(NA)]
    z_of = lambda az, z: z - 0.010 * (0.5 - 0.5 * math.cos(az))   # 1 cm lower at the back
    bm = bmesh.new(); rings = []
    for z in (0.020, 0.045, 0.072):
        row = []
        for i in range(NA):
            az = -math.pi + 2 * math.pi * i / NA; r = band_r[i]
            row.append(bm.verts.new(C + Vector((math.sin(az) * r, -math.cos(az) * r, z_of(az, z)))))
        rings.append(row)
    for j in range(len(rings) - 1):
        for i in range(NA):
            bm.faces.new((rings[j][i], rings[j][(i + 1) % NA], rings[j + 1][(i + 1) % NA], rings[j + 1][i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    made = [finish(bm, 'toque_band', m_band, 0.005)]
    # the crown: a tall cylinder of stiff cotton, crisp vertical pleats (a hat that reads from across a kitchen: a white
    # column, then the puff), flaring a little and puffed over at the top, leant a touch to his right and back
    bm = bmesh.new(); rows = []; NZ = 10
    for j in range(NZ + 1):
        t = j / NZ; z = 0.066 + 0.200 * t
        lean = Vector((-0.016 * t * t, 0.012 * t * t, 0.0))
        puff = 1.0 + 0.10 * t + 0.10 * max(0.0, (t - 0.70) / 0.30) ** 0.7
        row = []
        for i in range(NA):
            az = -math.pi + 2 * math.pi * i / NA
            pleat = 0.016 * (1.0 if (i % 3) == 0 else -0.35)
            r = band_r[i] * puff * (1.0 + pleat) - 0.002
            row.append(bm.verts.new(C + lean + Vector((math.sin(az) * r, -math.cos(az) * r, z_of(az, z)))))
        rows.append(row)
    for j in range(NZ):
        for i in range(NA):
            bm.faces.new((rows[j][i], rows[j][(i + 1) % NA], rows[j + 1][(i + 1) % NA], rows[j + 1][i]))
    top = rows[-1]; cz = sum((v.co for v in top), Vector((0, 0, 0))) / NA
    # the top: two rings in to a centre that has sunk (the slump), never a flat lid
    prev = top
    for k, (f, dz) in enumerate(((0.62, 0.022), (0.25, 0.012))):
        ring = [bm.verts.new(cz + (v.co - cz) * f + Vector((0, 0, dz))) for v in top]
        for i in range(NA): bm.faces.new((prev[i], prev[(i + 1) % NA], ring[(i + 1) % NA], ring[i]))
        prev = ring
    c = bm.verts.new(cz + Vector((0, 0, 0.004)))
    for i in range(NA): bm.faces.new((prev[i], prev[(i + 1) % NA], c))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    made.append(finish(bm, 'toque_crown', m_cloth, 0.004))
    return made


# ---- THE BOSSES' OWN PIECES (inside the body tool's build, after his garments, with its locals) ----------------------
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

    def solid(key, bm, colour, bone, subdiv=1):
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        o = new_obj(bm, key)
        for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
        if isinstance(bone, dict):
            for bn, w in bone.items():
                vg = o.vertex_groups.new(name=full(bn)); vg.add(list(range(len(o.data.vertices))), w, 'REPLACE')
        else:
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
        """a second colour on the faces pick(centre, normal) chooses (the rust at a rim, a band, an edge)"""
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

    def torus(bm, c, axis, R, r, n=24, seg=8):
        axis = axis.normalized(); u = axis.orthogonal().normalized(); w = axis.cross(u).normalized()
        rings = []
        for i in range(n):
            a = 2 * math.pi * i / n; d = u * math.cos(a) + w * math.sin(a); o = c + d * R
            rings.append([bm.verts.new(o + (d * math.cos(2 * math.pi * j / seg) + axis * math.sin(2 * math.pi * j / seg)) * r) for j in range(seg)])
        for i in range(n):
            for j in range(seg):
                bm.faces.new((rings[i][j], rings[i][(j + 1) % seg], rings[(i + 1) % n][(j + 1) % seg], rings[(i + 1) % n][j]))

    def hand(right=True):
        """his fist's frame from the body tool's own measured hand: the fist's middle, the handle's line through it (across
        the knuckles, +wd toward the thumb: forward when the arm hangs), the blade's way (+ax, down the fingers), its flat"""
        hb, wr, ax, wd, th, ln, width = next(h for h in X['hands'] if (h[1].x < 0) == right)
        return hb, wr + ax * (ln * 0.42), ax, wd, th

    def forearm_plate(side):
        """the frame the Heavy's crash bar is laid in: along the forearm, out and forward, the plate's two axes"""
        E0, W0 = (joint('Skeleton_arm_joint_L__3_'), joint('Skeleton_arm_joint_L__2_')) if side == 'L' else \
                 (joint('Skeleton_arm_joint_R__2_'), joint('Skeleton_arm_joint_R__3_'))
        a = (W0 - E0).normalized()
        up = (V((0, 0, 1)) - a * a.z).normalized()
        n = (up * math.cos(math.radians(50)) + V((0, -1, 0)) * math.sin(math.radians(50))).normalized()
        n = (n - a * n.dot(a)).normalized(); b = n.cross(a).normalized()
        return E0, W0, a, n, b

    def chest(z):
        s = section(z, ('torso',)); return s

    for nm in names:
        # ---------------------------------------------------------------- THE POT
        if nm == 'pot_stains':
            # old blood and grease on the whites, as their own cloth a hair over the shirt: the belly, the cuffs, a wipe
            # down the right thigh of the apron's line where he dries his hands
            def spot(c, s):
                return (0.5 + 0.5 * math.sin(23 * c.x + 9 * c.z + s) * math.cos(17 * c.y - 13 * c.z + 2.1 * c.x + s * 0.7))
            g = cloth('pot_stain_old', lambda fm, c: (fm == 'torso' and c.z > 0.74 and c.y < 0.0 and spot(c, 0.3) > 0.80) or
                      (fm == 'fore' and spot(c, 1.9) > 0.74), lambda p: 0.0105, STAIN_OLD, rim=0.0, levels=2, fams=('torso', 'fore'))
            if g: made.append(g)
            g = cloth('pot_stain_grease', lambda fm, c: (fm == 'torso' and c.z > 0.74 and spot(c, 4.1) > 0.83) or
                      (fm == 'upper' and spot(c, 5.3) > 0.82), lambda p: 0.0100, STAIN_GREASE, rim=0.0, levels=2, fams=('torso', 'upper'))
            if g: made.append(g)
        elif nm == 'pot_vest':
            # the riot vest he took off a guard, CUT DOWN TO HIS CHEST with a knife because it would not close over the belly:
            # the hem ragged, the belly out under it in the whites, the trauma plate proud on the front, the side straps
            s0 = chest(1.0); cy0 = s0['cy']; rx0 = s0['rx']
            hem = lambda c: 0.905 + 0.016 * math.sin(41 * c.x + 3.0) + 0.010 * math.sin(97 * c.x)
            def keep(fm, c):
                if fm != 'torso' or c.z < hem(c) or c.z > 1.125: return False
                if c.z > 1.05 and abs(c.x) < 0.070 and c.y < cy0: return False                  # the neck's scoop, front
                if c.z > 1.08 and abs(c.x) < 0.060: return False                                 # and back
                if abs(c.x) > rx0 * 0.86 and c.z > 0.985: return False                           # the armholes
                return True
            g = cloth('pot_vest', keep, lambda p: over + 0.026, RIOT, rim=0.010, levels=2, fams=('torso',))
            if g: made.append(weighted(g, torso_w))
            g = cloth('pot_vest_plate', lambda fm, c: fm == 'torso' and c.y < cy0 - 0.02 and abs(c.x) < 0.095 and 0.94 < c.z < 1.06,
                      lambda p: over + 0.044, RIOT_PLATE, rim=0.012, levels=2, fams=('torso',))
            if g: made.append(weighted(g, torso_w))
            # the side straps (the cummerbund's velcro tabs), tan webbing, two a side, and the shoulder straps' buckles
            for sx in (1, -1):
                for k, z in enumerate((0.955, 1.010)):
                    s = section(z, ('torso',))
                    p0 = V((sx * s['rx'] * 0.70, s['cy'] - s['front'] * 0.70, z)); p1 = V((sx * s['rx'] * 1.0, s['cy'], z - 0.004)); p2 = V((sx * s['rx'] * 0.70, s['cy'] + s['back'] * 0.70, z))
                    made.append(weighted(strip('pot_vest_tab_%d_%d' % (sx > 0, k), [[p0, p1, p2]], 0.026, over + 0.034, RIOT_STRAP, across=3, rim=0.003), torso_w))
                bk = front(sx * 0.090, 1.075) + V((0, -(over + 0.040), 0))
                bm = bmesh.new(); box(bm, bk, V((0.016, 0, 0)), V((0, 0.006, 0)), V((0, 0, 0.012)))
                made.append(weighted(solid('pot_vest_buckle_%d' % (sx > 0), bm, STEEL, 'torso_joint_3', 0), torso_w))
        elif nm == 'pot_kerchief':
            s = section(1.13, ('neck', 'torso')) or dict(cy=-0.02)
            ring = ring_pts(V((0.0, -0.02, 1.128)), V((1, 0, 0)), V((0, -1, 0)), n=40, off=0.012)
            made.append(weighted(band('pot_kerchief', [ring], 0.034, 0.014, KERCHIEF, seg=8), lambda p: {'torso_joint_3': 1.0}))
            fr = min(ring, key=lambda pd: pd[0].y)[0]
            bm = bmesh.new(); ball(bm, fr + V((0.012, -0.012, -0.012)), 0.020, seg=10, ring=7, sq=(1.0, 0.7, 0.9))
            pipe(bm, [fr + V((0.012, -0.014, -0.020)), fr + V((0.030, -0.018, -0.060)), fr + V((0.036, -0.016, -0.085))], 0.010, seg=8)
            made.append(solid('pot_kerchief_knot', bm, KERCHIEF, 'torso_joint_3', 1))
        elif nm == 'pot_lid':
            # THE COPPER POT'S LID: a 40-quart stockpot's, 44 cm across, a shallow dome with a rolled rim, its loop handle out
            # (his grip is the straps behind it), tarnished brown at the rim, green-black where the steam sat, one dent
            E0, W0, a, n, b = forearm_plate('L')
            mid = E0.lerp(W0, 0.55)
            hit = bvh.ray_cast(mid + n * 0.4, -n, 0.8); base_p = hit[0] if hit[0] else mid + n * 0.05
            O = base_p + n * (0.050 + over * 0.5)
            R0, DOME = 0.22, 0.045
            bm = bmesh.new(); NR, NA = 7, 40; rings = []
            for j in range(NR + 1):
                rr = R0 * (1 - j / NR) if j < NR else 0.0
                h = DOME * (1 - (rr / R0) ** 2)
                dent = -0.012 * math.exp(-((rr - 0.12) ** 2) / 0.0012)
                if j == NR: rings.append([bm.verts.new(O + n * h)]); break
                row = []
                for i in range(NA):
                    t = 2 * math.pi * i / NA; dd = (dent if abs(t - 2.2) < 0.5 else 0.0)
                    row.append(bm.verts.new(O + a * (rr * math.cos(t)) + b * (rr * math.sin(t)) + n * (h + dd)))
                rings.append(row)
            for j in range(NR - 1):
                for i in range(NA):
                    bm.faces.new((rings[j][i], rings[j][(i + 1) % NA], rings[j + 1][(i + 1) % NA], rings[j + 1][i]))
            for i in range(NA): bm.faces.new((rings[NR - 1][i], rings[NR - 1][(i + 1) % NA], rings[NR][0]))
            g = solid('pot_lid', bm, COPPER, 'Skeleton_arm_joint_L__3_', 1)
            for vg in list(g.vertex_groups): pass
            so = g.modifiers.new('wall', 'SOLIDIFY'); so.thickness = 0.006; so.offset = -1
            X['bpy'].context.view_layer.objects.active = g; X['bpy'].ops.object.modifier_apply(modifier='wall')
            paint(g, 'pot_lid_tarnish', COPPER_DK, lambda p, nn: (p - O).length > R0 * 0.80)
            paint(g, 'pot_lid_steam', COPPER_TARN, lambda p, nn: 0.30 * R0 < (p - O).length < 0.46 * R0 and math.sin(9 * (p - O).dot(a) + 5 * (p - O).dot(b)) > 0.55)
            made.append(g)
            bm = bmesh.new(); torus(bm, O, n, R0, 0.008, n=48, seg=8)                                         # the rolled rim
            made.append(solid('pot_lid_rim', bm, COPPER_DK, 'Skeleton_arm_joint_L__3_', 0))
            hc = O + n * (DOME + 0.004)
            bm = bmesh.new(); pipe(bm, [hc - b * 0.055, hc - b * 0.050 + n * 0.035, hc + b * 0.050 + n * 0.035, hc + b * 0.055], 0.009, seg=8)
            for s_ in (-1, 1): cyl(bm, hc + b * (0.055 * s_) - n * 0.006, hc + b * (0.055 * s_) + n * 0.006, 0.016, seg=10)   # the riveted feet
            made.append(solid('pot_lid_handle', bm, STEEL, 'Skeleton_arm_joint_L__3_', 0))
            for s_a in (0.25, 0.75):
                c = E0.lerp(W0, s_a); u = a.orthogonal().normalized(); w = a.cross(u).normalized()
                made.append(weighted(band('pot_lid_strap_%d' % int(s_a * 100), [ring_pts(c, u, w, n=24, off=0.012)], 0.030, 0.010, LEATHER),
                                     lambda p: {'Skeleton_arm_joint_L__3_': 1.0}))
        elif nm == 'pot_cleaver':
            # THE BUTCHER'S CLEAVER: a broad 24 x 11 cm blade, the spine thick and the edge bright, the hang hole, a riveted
            # wooden handle through his fist
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.075, fc + wd * 0.055, 0.016, 0.018, seg=10)
            g = solid('pot_cleaver_handle', bm, WOOD, hb, 0)
            made.append(g)
            bm = bmesh.new()
            for u in (-0.040, 0.0, 0.034): cyl(bm, fc + wd * u - th * 0.020, fc + wd * u + th * 0.020, 0.0045, seg=6)
            made.append(solid('pot_cleaver_rivets', bm, RIVET, hb, 0))
            B0 = fc + wd * 0.050 - ax * 0.026          # the blade's top corner at the handle (big, the boss's, Battle Brothers size)
            bw, bh, bt = 0.300, 0.150, 0.008
            bm = bmesh.new(); box(bm, B0 + wd * (bw * 0.5) + ax * (bh * 0.5), wd * (bw * 0.5), ax * (bh * 0.5), th * bt)
            g = solid('pot_cleaver_blade', bm, STEEL, hb, 1)
            paint(g, 'pot_cleaver_edge', EDGE, lambda p, nn: (p - B0).dot(ax) > bh * 0.80)
            paint(g, 'pot_cleaver_spine', STEEL_DK, lambda p, nn: (p - B0).dot(ax) < bh * 0.10)
            made.append(g)
            bm = bmesh.new(); hp = B0 + wd * (bw - 0.030) + ax * 0.026; cyl(bm, hp - th * 0.009, hp + th * 0.009, 0.010, seg=10)
            made.append(solid('pot_cleaver_hole', bm, (20, 20, 20), hb, 0))
        # ---------------------------------------------------------------- THE TAP
        elif nm == 'tap_hose':
            # a fire hose's canvas run across him from his left shoulder to his right hip, flat, 5 cm, its brass coupling
            # at the hip (the pump house's own; tan on the oil black reads at the fight's size)
            o = V((0.0, -0.004, 0.890)); u = V((0.24, 0.0, -0.44)).normalized()
            ring = ring_pts(o, u, V((0, -1, 0)), n=56, off=over + 0.016)
            made.append(weighted(band('tap_hose', [ring], 0.052, 0.012, HOSE_CANVAS, seg=8,
                                      groove=lambda a: 0.002 * max(0.0, math.cos(30 * a)) ** 2), torso_w))
            lo = min(ring, key=lambda pd: pd[0].z)[0]
            bm = bmesh.new(); cyl(bm, lo + V((0, 0, 0.010)), lo + V((0, 0, -0.060)), 0.030, seg=14)
            for z_ in (-0.004, -0.044): torus(bm, lo + V((0, 0, z_)), V((0, 0, 1)), 0.031, 0.006, n=20, seg=6)
            made.append(solid('tap_hose_coupling', bm, BRASS, 'Skeleton_torso_joint_1', 0))
        elif nm == 'tap_wheel':
            # THE BADGE: a red gate-valve handwheel off the main he shut, 18 cm, bolted through his chest strap over his
            # heart (his left): the rim, five spokes, the hub and its square nut; chipped to the iron at the rim
            p = front(0.060, 1.000); n = V((0, -1, 0.0))
            c = p + n * (over + 0.034)
            Rw = 0.085
            bm = bmesh.new(); torus(bm, c, n, Rw, 0.012, n=36, seg=8)
            for k in range(5):
                t = 2 * math.pi * k / 5 + 0.3; d = V((math.cos(t), 0, math.sin(t)))
                cyl(bm, c + d * 0.016, c + d * (Rw - 0.006), 0.0075, seg=8)
            cyl(bm, c - n * 0.010, c + n * 0.022, 0.022, seg=12)
            g = solid('tap_wheel', bm, VALVE_RED, 'torso_joint_3', 0)
            paint(g, 'tap_wheel_chip', IRON, lambda q, nn: (q - c).length > Rw - 0.002 and math.sin(23 * q.x + 31 * q.z) > 0.55)
            made.append(weighted(g, lambda q: {'torso_joint_3': 1.0}))
            bm = bmesh.new(); box(bm, c + n * 0.026, V((0.011, 0, 0)), V((0, 0.006, 0)), V((0, 0, 0.011)))
            made.append(weighted(solid('tap_wheel_nut', bm, IRON, 'torso_joint_3', 0), lambda q: {'torso_joint_3': 1.0}))
            # the leather patch it is bolted through
            bm = bmesh.new(); box(bm, c - n * 0.016, V((0.040, 0, 0)), V((0, 0.006, 0)), V((0, 0, 0.040)))
            made.append(weighted(solid('tap_wheel_patch', bm, LEATHER, 'torso_joint_3', 1), lambda q: {'torso_joint_3': 1.0}))
        elif nm == 'tap_keys':
            # the valve keys on a ring at his right hip: four big brass keys and a curb key's T
            s_ = section(0.66, ('torso',))
            cc = V((-(s_['rx'] + 0.030 + over * 0.5), s_['cy'] - 0.030, 0.640))
            bm = bmesh.new(); torus(bm, cc, V((1, 0, 0)), 0.032, 0.005, n=20, seg=6)
            for k, (dy, dz) in enumerate(((-0.020, -0.050), (0.0, -0.060), (0.020, -0.052), (0.034, -0.038))):
                kc = cc + V((0, dy, dz))
                box(bm, kc, V((0.004, 0, 0)), V((0, 0.009, 0)), V((0, 0, 0.030)))
                cyl(bm, kc + V((-0.004, 0, 0.032)), kc + V((0.004, 0, 0.032)), 0.012, seg=10)
            made.append(solid('tap_keys', bm, BRASS, 'Skeleton_torso_joint_1', 0))
        elif nm == 'tap_wrench':
            # THE VALVE WRENCH, his hammer: a 55 cm pipe wrench, the handle an I-beam painted red and chipped, the hook jaw
            # and the heel jaw in black iron, the knurled nut between them; he holds it by the handle's end like a hammer
            hb, fc, ax, wd, th = hand(True)
            Lh = 0.46
            p0 = fc - wd * 0.060; p1 = fc + wd * Lh
            bm = bmesh.new(); box(bm, (p0 + p1) * 0.5, wd * ((Lh + 0.060) * 0.5), ax * 0.020, th * 0.014)
            box(bm, (p0 + p1) * 0.5 - ax * 0.018, wd * ((Lh + 0.060) * 0.5), ax * 0.004, th * 0.022)
            box(bm, (p0 + p1) * 0.5 + ax * 0.018, wd * ((Lh + 0.060) * 0.5), ax * 0.004, th * 0.022)
            g = solid('tap_wrench_handle', bm, VALVE_RED, hb, 0)
            paint(g, 'tap_wrench_chip', STEEL_DK, lambda q, nn: math.sin(61 * (q - fc).dot(wd)) > 0.80)
            made.append(g)
            bm = bmesh.new()
            head = fc + wd * (Lh + 0.010)
            box(bm, head - ax * 0.010, wd * 0.040, ax * 0.038, th * 0.022)                       # the heel jaw on the handle
            box(bm, head + wd * 0.020 - ax * 0.074, wd * 0.016, ax * 0.040, th * 0.020)             # the hook jaw's shank, up
            box(bm, head + wd * 0.004 - ax * 0.112, wd * 0.040, ax * 0.016, th * 0.022)             # the hook jaw over the gap
            cyl(bm, head + wd * 0.020 - ax * 0.046 - th * 0.026, head + wd * 0.020 - ax * 0.046 + th * 0.026, 0.020, seg=12)   # the nut
            made.append(solid('tap_wrench_head', bm, IRON, hb, 0))
            bm = bmesh.new()
            for k in range(4): box(bm, head - wd * (0.030 - 0.020 * k) - ax * 0.050, wd * 0.004, ax * 0.006, th * 0.024)   # the teeth
            made.append(solid('tap_wrench_teeth', bm, STEEL, hb, 0))
        # ---------------------------------------------------------------- THE FILTER
        elif nm == 'filter_pack':
            # THE FILTER PACK on his back: a steel frame, two canisters a hand across and 26 cm tall in filter yellow with
            # black bands, their caps up (the hoses' ends), a strap round his chest
            sh = section(0.98, ('torso',)); back = sh['cy'] + sh['back'] + over + 0.020
            bm = bmesh.new(); box(bm, V((0, back + 0.006, 0.96)), V((0.110, 0, 0)), V((0, 0.006, 0)), V((0, 0, 0.150)))
            made.append(weighted(solid('filter_frame', bm, STEEL_DK, 'torso_joint_3', 0), torso_w))
            for sx in (1, -1):
                c0 = V((sx * 0.060, back + 0.068, 0.84)); c1 = c0 + V((0, 0, 0.260))
                bm = bmesh.new(); cyl(bm, c0, c1, 0.056, seg=16)
                g = solid('filter_can_%d' % (sx > 0), bm, FILTER_YEL, 'torso_joint_3', 0)
                paint(g, 'filter_can_band_%d' % (sx > 0), BAND_BLK, lambda q, nn, c0=c0: any(abs(q.z - (c0.z + z_)) < 0.016 for z_ in (0.050, 0.205)) and abs(nn.z) < 0.7)
                made.append(weighted(g, torso_w))
                bm = bmesh.new(); cyl(bm, c1, c1 + V((0, 0, 0.030)), 0.030, 0.022, seg=12)
                made.append(weighted(solid('filter_can_cap_%d' % (sx > 0), bm, RUBBER, 'torso_joint_3', 0), torso_w))
            made.append(weighted(band('filter_chest_strap', [ring_pts(V((0.0, section(0.93, ('torso',))['cy'], 0.93)), V((1, 0, 0)), V((0, -1, 0)), n=56, off=over + 0.012)],
                                      0.036, 0.010, (52, 48, 42)), torso_w))
        elif nm == 'filter_hoses':
            # TWO RIBBED HOSES from the canisters' caps over his shoulders to his mask's chin (the rubber gas mask's
            # canister sits there): corrugated, a rib every 2.5 cm
            sh = section(0.98, ('torso',)); back = sh['cy'] + sh['back'] + over + 0.020
            for sx in (1, -1):
                hit = bvh.ray_cast(V((sx * 0.110, sh['cy'], 1.30)), V((0, 0, -1)), 0.5)
                top = (hit[0] if hit[0] else V((sx * 0.110, sh['cy'], 1.12))) + V((0, 0, over + 0.034))
                f1 = front(sx * 0.075, 1.06) + V((0, -(over + 0.040), 0))
                pts = [V((sx * 0.060, back + 0.068, 1.130)), V((sx * 0.070, back + 0.040, 1.180)), top + V((0, 0.040, 0)), top + V((0, -0.030, 0)),
                       f1 + V((0, 0, 0.060)), V((sx * 0.030, f1.y - 0.030, 1.150)), V((sx * 0.012, f1.y - 0.050, 1.185))]
                # the spline through them, then beads on it (the corrugation)
                path = []
                for i in range(len(pts) - 1):
                    for k in range(6):
                        t = k / 6.0; path.append(pts[i].lerp(pts[i + 1], t))
                path.append(pts[-1])
                bm = bmesh.new(); pipe(bm, path, 0.018, seg=10)
                L_ = 0.0
                for a_, b_ in zip(path, path[1:]):
                    d = (b_ - a_); ln = d.length; s_ = 0.0
                    while s_ < ln:
                        if (L_ + s_) % 0.025 < 0.0125: torus(bm, a_ + d * (s_ / ln), d, 0.019, 0.004, n=10, seg=5)
                        s_ += 0.0125
                    L_ += ln
                made.append(weighted(solid('filter_hose_%d' % (sx > 0), bm, RUBBER, 'torso_joint_3', 0),
                                     lambda q: {'torso_joint_3': 1.0}))
        elif nm == 'filter_robot':
            # HIS ROBOTS' PARTS ON HIM: a robot's forearm plating strapped round his left forearm (grey, an orange stripe,
            # four bolts) and a robot's shoulder shell on his left shoulder
            g = cloth('filter_robot_fore', lambda fm, c: fm == 'fore' and c.x > 0, lambda p: 0.022, ROBOT, rim=0.008, levels=1, fams=('fore',))
            if g:
                E0, W0, a, n, b = forearm_plate('L')
                paint(g, 'filter_robot_stripe', ROBOT_STRIPE, lambda q, nn: abs((q - E0).dot(a) - 0.5 * (W0 - E0).length) < 0.018)
                made.append(g)
            g = cloth('filter_robot_shoulder', lambda fm, c: (fm == 'upper' and c.x > 0 and c.z > 1.04) or (fm == 'torso' and c.x > 0.10 and c.z > 1.05),
                      lambda p: 0.030, ROBOT, rim=0.010, levels=1, fams=('upper', 'torso'))
            if g:
                paint(g, 'filter_robot_shoulder_dk', ROBOT_DK, lambda q, nn: nn.z < 0.2)
                made.append(g)
            SHj = joint('Skeleton_arm_joint_L__4_')
            bm = bmesh.new()
            for k in range(3):
                p = SHj + V((0.020 + 0.022 * k, -0.050, 0.075))
                cyl(bm, p, p + V((0, -0.010, 0.006)), 0.008, seg=8)
            made.append(weighted(solid('filter_robot_bolts', bm, RIVET, 'torso_joint_3', 0), lambda q: {'torso_joint_3': 1.0}))
        elif nm == 'filter_eye':
            # a robot's camera eye clipped to his chest strap, his right side: the housing, the amber lens, a red tally dot
            p = front(-0.075, 0.935); c = p + V((0, -(over + 0.030), 0))
            bm = bmesh.new(); box(bm, c, V((0.034, 0, 0)), V((0, 0.020, 0)), V((0, 0, 0.026)))
            made.append(weighted(solid('filter_eye_housing', bm, ROBOT_DK, 'torso_joint_3', 1), torso_w))
            bm = bmesh.new(); cyl(bm, c - V((0, 0.018, 0)), c - V((0, 0.034, 0)), 0.019, 0.016, seg=14)
            made.append(weighted(solid('filter_eye_lens', bm, LENS_AMBER, 'torso_joint_3', 0), torso_w))
            bm = bmesh.new(); ball(bm, c + V((0.024, -0.022, 0.016)), 0.005, seg=6, ring=4)
            made.append(weighted(solid('filter_eye_tally', bm, (200, 50, 40), 'torso_joint_3', 0), torso_w))
        elif nm == 'filter_cleaver':
            # HIS CLEAVER: a heavy chopper cut from a robot's panel (30 x 12 cm, its corner clipped, a grey stripe of the
            # robot's paint left on it, four rivets), the handle wrapped in black tape
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new(); cyl(bm, fc - wd * 0.080, fc + wd * 0.060, 0.017, seg=10)
            made.append(solid('filter_cleaver_handle', bm, TAPE, hb, 0))
            bm = bmesh.new()
            for k in range(5): torus(bm, fc + wd * (-0.065 + 0.030 * k), wd, 0.018, 0.0035, n=12, seg=5)
            made.append(solid('filter_cleaver_tape', bm, (58, 56, 52), hb, 0))
            B0 = fc + wd * 0.055 - ax * 0.024
            bw, bh = 0.330, 0.150
            bm = bmesh.new(); NW_, NH_ = 6, 3; grid = []
            for i in range(NW_ + 1):
                row = []
                for j in range(NH_ + 1):
                    u, v = bw * i / NW_, bh * j / NH_
                    if i == NW_ and j == 0: u -= 0.040                                           # the clipped corner
                    v += 0.012 * (u / bw) ** 2                                                    # the edge's belly
                    row.append(B0 + wd * u + ax * v)
                grid.append(row)
            vs = [[[bm.verts.new(p + th * (0.005 * s)) for p in row] for row in grid] for s in (-1, 1)]
            for s in range(2):
                for i in range(NW_):
                    for j in range(NH_):
                        q = (vs[s][i][j], vs[s][i + 1][j], vs[s][i + 1][j + 1], vs[s][i][j + 1]); bm.faces.new(q if s else q[::-1])
            for i in range(NW_):
                for j in (0, NH_):
                    bm.faces.new((vs[0][i][j], vs[0][i + 1][j], vs[1][i + 1][j], vs[1][i][j]))
            for j in range(NH_):
                for i in (0, NW_):
                    bm.faces.new((vs[0][i][j], vs[0][i][j + 1], vs[1][i][j + 1], vs[1][i][j]))
            g = solid('filter_cleaver_blade', bm, ROBOT, hb, 0)
            paint(g, 'filter_cleaver_edge', EDGE, lambda q, nn: (q - B0).dot(ax) > bh * 0.84)
            paint(g, 'filter_cleaver_paint', ROBOT_STRIPE, lambda q, nn: 0.30 * bh < (q - B0).dot(ax) < 0.48 * bh and (q - B0).dot(wd) > 0.10)
            made.append(g)
            bm = bmesh.new()
            for u, v in ((0.020, 0.030), (0.020, 0.090), (0.140, 0.025), (0.250, 0.030)):
                p = B0 + wd * u + ax * v; cyl(bm, p - th * 0.008, p + th * 0.008, 0.0055, seg=6)
            made.append(solid('filter_cleaver_rivets', bm, RIVET, hb, 0))
    return [m for m in made if m is not None]


# ---- THE PACK: BOSSES' own, then each look marked own_kit (his weapon and his shield are his model's) -------------------
def pack():
    BT.pack()
    ip = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'); I = json.load(open(ip))
    for p in json.load(open(ROLL)):
        lk = TE.look_of(p['id'])
        if lk in I['looks']:
            I['looks'][lk]['own_kit'] = True
            I['looks'][lk]['dressed'] = "COOK [the bosses dressed] 11/3: his own pieces on his model (tools/bohemia_cook_the_bosses_dressed_11_3_26.py)"
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
    print('own_kit on', [TE.look_of(p['id']) for p in json.load(open(ROLL))])


if __name__ == '__main__':
    patch()
    a = sys.argv[1:]
    cmd = a[0] if a else 'roll'
    if cmd == 'roll': roll()
    elif cmd == 'build-one': TE.build_one(a[1])
    elif cmd == 'look':
        for pid in a[1:]:
            g = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % TE.tag_of(pid))
            if os.path.exists(g) and '--keep' not in a: os.remove(g)
            TE.look(pid)
    elif cmd == 'make':
        for pid in a[1:]: TE.make(pid)
    elif cmd == 'pack': pack()
