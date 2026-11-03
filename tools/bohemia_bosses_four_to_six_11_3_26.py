#!/usr/bin/env python3
"""BOHEMIA -- BOSSES 4 [four to six, each his own] (11/3/26, VAMILY rules 330, 337, 338; ask lines 328, 345, 346).
Paolo 11/3, angry and right: 'you build the bosses like shit, we don't have enough assets, and you're not creating assets,
weapons, armor, the vibe, nothing.' Rule 337: no more content without its assets. So THE BURN, THE SURVEYOR and THE CLIMB
(the ladder's #4 to #6, records/BOHEMIA_THE_BOSS_LADDER_v7_8_7_26.md) are modelled FIRST, each through the same pipe COOK
ARMOUR dressed the first three with, before any word of their lead-up or verb ships.

THE METHOD, REUSE FIRST (the pipe, never edited): CHARACTER's tool for a new kind of man (tools/bohemia_character_the_three_enemies.py)
pointed at three bosses of one man each the way BOSSES' tool does (tools/bohemia_bosses_the_three_men.py: its pack, its face
strip, PORTRAIT's manifest); each boss's OWN pieces modelled on his body in CHARACTER's kit (the cloth lift, bands, rings,
strips, the man's own measured hands) the way COOK ARMOUR modelled the pot's lid and the valve wrench
(tools/bohemia_cook_the_bosses_dressed_11_3_26.py: its helpers are closures, so their shapes are re-stated here, its file is
never edited); his hat through HATS 1's door; the barber; DIRECTION's master rig; COMBAT's fight poses and six clips. HIS
WEAPON IS PART OF HIS MODEL, on his hand's bone, so it swings in COMBAT's own clips; fight_rig.json marks his look own_kit.

  THE BURN      who gets warm. A big man in a FIREFIGHTER'S TURNOUT COAT gone black with soot (tan duck, its reflective bands
                dulled lime and silver, the hem burnt ragged), a BLACK LEATHER FIRE HELMET (the long back brim, a brass front
                shield), a RED JERRYCAN on his back on a strap, a LIT ROAD FLARE in his belt, and THE FIRE AXE in his fist
                (90 cm, a yellow fibreglass handle, a red head with its pick, the edge bright).
  THE SURVEYOR  the last complete map. A thin older man in a HI-VIS VEST faded but still loud (two silver bands
                and the braces), a storm-grey button-up, a WHITE HARD HAT, A MAP TUBE slung across his back, a brass PLUMB BOB on a
                cord at his chest, and THE RANGE POLE in his fist (a red-and-white banded survey rod, a steel shoe for a point,
                its round bubble level by his hand).
  THE CLIMB     the last hoist that lifts. A wiry man in an OXBLOOD BELLHOP'S JACKET (two rows of brass buttons, gold braid at
                the cuffs) under an ORANGE CLIMBING HARNESS (the waist belt, the braces, three steel
                carabiners), a COIL OF ROPE over his shoulder, a BELLHOP'S PILLBOX CAP, and THE HOIST'S HOOK on a short chain
                in his fist (a safety-yellow crane hook with its eye and its latch).

Never purple (the Amalgamation's alone): the oxblood is red, measured below in pack().

Run (BOHEMIA_BPY = a python3.11 venv with bpy 4.2, the studio's way):
    python3 tools/bohemia_bosses_four_to_six_11_3_26.py roll
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_four_to_six_11_3_26.py look burn_0      the eight stills only
    BOHEMIA_BPY=<venv>/bin/python python3 tools/bohemia_bosses_four_to_six_11_3_26.py batch 3           the street and fight passes
    python3 tools/bohemia_bosses_four_to_six_11_3_26.py pack

REFERENCE CHECK (the 9/4 standing duty): the twins are the first three bosses at the same cell (slices/fight_rig boss_pot_0,
boss_tap_0, boss_filter_0) and the fight's own cast; the real things are a structural firefighter's turnout coat (tan,
3M-style lime and silver trim) and a traditional leather fire helmet with its front shield, a 20-litre steel jerrycan, a
road flare, a 36-inch fire axe with a pick head and a fibreglass handle; a class-2 hi-vis vest, a white hard hat, a map tube,
a brass plumb bob, a 2-metre range pole in 20 cm red and white bands with a circular bubble; a hotel bellhop's jacket and
pillbox cap, a rope-access sit harness with steel carabiners, a coil of kernmantle rope, a crane hook with a safety latch.
No reference game.
REUSE CHECK (REUSE-FIRST): BOSSES' tool and its pack, CHARACTER's tool, kit, barber, hats door and wardrobe (one colour of one
coat added in memory: TURNOUT COAT is the car coat in turnout tan), DIRECTION's rig, COMBAT's poses, RUN TWO's render and faces.
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_bosses_the_three_men as BT

TE = BT.TE
ME = os.path.abspath(__file__)
STAMP = 'bosses-4-6-11-3'
ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_BOSSES_FOUR_TO_SIX_ROLL.json')

# ---- the colours at the source (the grime is the rig's source pass) ---------------------------------------------------
TURN_LIME, TURN_SILVER, SOOT = (150, 150, 86), (172, 172, 164), (30, 28, 26)
HELMET, HELMET_SHIELD, HELMET_ROUND = (32, 30, 28), (158, 122, 60), (120, 34, 28)
CAN_RED, CAN_RED_DK, STEEL, STEEL_DK, EDGE = (136, 40, 32), (96, 30, 26), (104, 102, 98), (54, 52, 50), (206, 202, 190)
FLARE_RED, FLARE_LIT = (150, 38, 30), (252, 196, 132)
FIBRE_YEL, AXE_RED = (186, 156, 52), (150, 36, 28)
WEB_BLK = (36, 35, 33)
HIVIS, HIVIS_DK = (204, 198, 56), (150, 142, 40)
TUBE, TUBE_CAP = (34, 33, 32), (96, 94, 88)
BRASS = (160, 128, 64)
HARDHAT = (198, 194, 182)
POLE_RED, POLE_WHITE = (172, 40, 30), (196, 190, 176)
BELL_OX, BELL_GOLD = (112, 36, 32), (172, 140, 64)
HARNESS, HARNESS_DK = (178, 98, 44), (120, 66, 30)
ROPE, ROPE_TRACE = (164, 154, 132), (70, 84, 100)
HOOK_YEL, HOOK_DK = (196, 160, 44), (60, 56, 50)

BOSSES = {
    'Burn': dict(
        what="THE BURN: the man who decides who gets warm; a turnout coat black with soot, a leather fire helmet, a jerrycan on his back, a lit flare, the fire axe",
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.40, belly=0.30, shoulders=0.85, hips=0.20)],
        look=dict(shirt=dict(colour=(30, 30, 30), sleeve='long'), coat=None,
                  trousers=dict(colour=(46, 44, 40), wide=0.02), shoes=dict(colour=(34, 32, 30), kind='boot', top=0.22), belt=None),
        tops=['SOOT TANK'], coats=['TURNOUT COAT'], legs=['PATCHED WORK PANTS'], feet=['COAL MID BOOT'],
        kit=[['LEATHER GLOVES']], hats=['FIRE HELMET'], eyewear=[None],
        pieces=['burn_bands', 'burn_soot', 'burn_can', 'burn_flare', 'burn_axe'], cuts=['RAZOR SKULL', 'HOME CLIPPERS', 'DEEP TAPER']),
    'Surveyor': dict(
        what="THE SURVEYOR: the man with the last complete map; a faded hi-vis vest, a white hard hat, a map tube on his back, a plumb bob, the range pole",
        stand_in='Trades', cell='faction_trades',
        dials=[dict(height=0.35, belly=0.05, shoulders=-0.15, hips=-0.10)],
        look=dict(shirt=dict(colour=(84, 92, 100), sleeve='long'), coat=None,
                  trousers=dict(colour=(120, 106, 80), wide=0.02), shoes=dict(colour=(80, 60, 42), kind='boot', top=0.20), belt=None),
        tops=['STORM BUTTON-UP'], coats=[None], legs=['KHAKI CARGOS'], feet=['FIELD BOOTS'],
        kit=[['SCAV TOOL BELT']], hats=['HARD HAT'], eyewear=[None],
        pieces=['surv_vest', 'surv_tube', 'surv_plumb', 'surv_pole'], cuts=['HOME CLIPPERS', 'TEMPLE TAPER', 'DRY TAPER']),
    'Climb': dict(
        what="THE CLIMB: the man who decides who goes up; a bellhop's oxblood jacket under a climbing harness, a coil of rope, a pillbox cap, the hoist's hook on a chain",
        stand_in='Remnants', cell='faction_mob',
        dials=[dict(height=0.10, belly=-0.40, shoulders=0.60, hips=-0.20)],
        look=dict(shirt=dict(colour=(92, 48, 42), sleeve='long'), coat=None,
                  trousers=dict(colour=(40, 38, 38), wide=0.016), shoes=dict(colour=(30, 28, 26), kind='boot', top=0.18), belt=None),
        tops=['BLACK TANK'], coats=['OXBLOOD JACKET'], legs=['CHARCOAL CROP TROUSER'], feet=['COAL MID BOOT'],
        kit=[['LEATHER GLOVES']], hats=['BELLHOP CAP'], eyewear=[None],
        pieces=['climb_braid', 'climb_harness', 'climb_rope', 'climb_hook'], cuts=['DEEP TAPER', 'TEMPLE TAPER', 'RAZOR SKULL']),
}
ORDER = ['Burn', 'Surveyor', 'Climb']
POOL = {'Burn': 'burn', 'Surveyor': 'surveyor', 'Climb': 'climb'}
NAMES = {'burn': 'THE BURN', 'surveyor': 'THE SURVEYOR', 'climb': 'THE CLIMB'}
MINE = tuple(p for t in ORDER for p in BOSSES[t]['pieces'])
HATS_MINE = ('FIRE HELMET', 'HARD HAT', 'BELLHOP CAP')
CUT = {'Burn': 'RAZOR SKULL', 'Surveyor': 'HOME CLIPPERS', 'Climb': 'RAZOR SKULL'}


def garments():
    """one colour of one coat already made, in memory (the wardrobe's own cut, never a new garment)"""
    import bohemia_character_garments_outer as OUTER
    if 'TURNOUT COAT' not in OUTER.BY:
        OUTER.BY['TURNOUT COAT'] = dict(OUTER.BY['CAR COAT'], name='TURNOUT COAT', tag='outer_turnout_coat', words=['TURNOUT', 'COAT'],
                                        dk=(98, 82, 56), mid=(140, 120, 84), lt=(172, 152, 112))


def patch():
    """CHARACTER's tool, pointed at bosses four to six (in memory; its file and BOSSES' are never edited)"""
    TE.TYPES.clear(); TE.TYPES.update(BOSSES)
    TE.ORDER[:] = ORDER
    TE.POOL = dict(POOL)
    TE.COUNT = {t: 1 for t in ORDER}
    TE.ROLL = ROLL
    TE.OUT = 'records/target/character/bosses'
    TE.STOW = 'records/character/bosses'
    TE.SHEET_DIR = 'records/target/character/bosses_sheet'
    TE.STAMP = STAMP
    TE.look_of = lambda pid: 'boss_' + pid.lower()
    BT.BOSSES.update(BOSSES)          # BOSSES' pack reads each look's reference cell from its own table
    garments()

    def ensure_model(pid):
        glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % TE.tag_of(pid))
        if not os.path.exists(glb):
            if not TE.R2().run([TE.bpy_py(), ME, 'build-one', pid], glb): return None
        return glb
    TE.ensure_model = ensure_model

    def worker(w, n):
        left = [p['id'] for p in json.load(open(TE.ROLL)) if not (TE.made(p['id']) and TE.fought(p['id']))]
        for i, pid in enumerate(left):
            if i % n == w: TE.make(pid)
    TE.worker = worker
    orig = TE.body_pieces

    def body_pieces(names, X):
        return orig([n for n in names if n not in MINE], X) + boss_pieces([n for n in names if n in MINE], X)
    TE.body_pieces = body_pieces
    install_hats()


def roll():
    TE.roll()
    R = json.load(open(ROLL))
    for P in R:
        P['boss'] = NAMES[P['id'].split('_')[0]]
        P['hair_cut'] = CUT[P['gang']]          # short under his hat, his own (the dressed tool's way)
    json.dump(R, open(ROLL, 'w'), indent=1)


def batch(n=1):
    import subprocess
    left = [p['id'] for p in json.load(open(ROLL)) if not (TE.made(p['id']) and TE.fought(p['id']))]
    print('%d to make, %d workers' % (len(left), n), flush=True)
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 2) // n)))
    procs = [subprocess.Popen([sys.executable, ME, 'worker', str(w), str(n)], cwd=ROOT, env=env) for w in range(n)]
    for p in procs: p.wait()


# ---- THE HATS (through HATS 1's door, the welder's and the toque's way) -----------------------------------------------
def install_hats():
    import bohemia_character_hats_one as HATS
    if getattr(HATS, '_bosses_four_to_six', False): return
    old = HATS.build

    def build(cut, L):
        if cut in HATS_MINE: return hat(cut, L)
        return old(cut, L)
    HATS.build = build; HATS._bosses_four_to_six = True


def hat(cut, L):
    bmesh = L['bmesh']; Vector, BVHTree = L['Vector'], L['BVHTree']
    C, skull_bm, finish, mat = L['C'], L['skull_bm'], L['finish'], L['mat']
    bm_s = skull_bm(); bvh = BVHTree.FromBMesh(bm_s); bm_s.free()
    NA = 40

    def skull_r(az, z):
        d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z))
        hit = bvh.ray_cast(o, d, 0.5)
        return (hit[0] - o).length if hit[0] else 0.10

    def dirn(az): return Vector((math.sin(az), -math.cos(az), 0.0))
    back = lambda az: 0.5 - 0.5 * math.cos(az)            # 0 at the brow, 1 at the back of the head
    made = []

    def shell(name, colour, z_low, lift, height, nz=8, rough=0.9):
        """a hard dome over the skull: its lower edge z_low(az) above the head's centre, lift off the skull, up to height"""
        m = mat(name, colour, rough); bm = bmesh.new(); rows = []
        base_r = [skull_r(-math.pi + 2 * math.pi * i / NA, z_low(-math.pi + 2 * math.pi * i / NA) + 0.012) + lift for i in range(NA)]
        for j in range(nz + 1):
            t = j / nz; ph = t * math.pi / 2
            row = []
            for i in range(NA):
                az = -math.pi + 2 * math.pi * i / NA; z0 = z_low(az)
                top = 0.075 + height
                z = z0 + (top - z0) * math.sin(ph); r = base_r[i] * math.cos(ph) * (1.0 + 0.04 * math.sin(ph))
                row.append(bm.verts.new(C + dirn(az) * r + Vector((0, 0, z))))
            rows.append(row)
        for j in range(nz):
            for i in range(NA):
                bm.faces.new((rows[j][i], rows[j][(i + 1) % NA], rows[j + 1][(i + 1) % NA], rows[j + 1][i]))
        cz = sum((v.co for v in rows[-1]), Vector((0, 0, 0))) / NA
        c = bm.verts.new(cz + Vector((0, 0, 0.003)))
        for i in range(NA): bm.faces.new((rows[-1][i], rows[-1][(i + 1) % NA], c))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        made.append(finish(bm, name, m, 0.004))
        return base_r

    def brim(name, colour, z_low, base_r, width, drop, thick=0.006):
        """a brim out from the shell's edge, width(az) wide, falling drop(az) at its outer edge"""
        m = mat(name, colour, 0.9); bm = bmesh.new(); top, bot = [], []
        rings = []
        for s in (0.0, 0.5, 1.0):
            row = []
            for i in range(NA):
                az = -math.pi + 2 * math.pi * i / NA
                r = base_r[i] + width(az) * s; z = z_low(az) - drop(az) * s * s
                row.append(bm.verts.new(C + dirn(az) * r + Vector((0, 0, z))))
            rings.append(row)
        for j in range(2):
            for i in range(NA):
                bm.faces.new((rings[j][i], rings[j][(i + 1) % NA], rings[j + 1][(i + 1) % NA], rings[j + 1][i]))
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        made.append(finish(bm, name, m, thick))

    def plate(name, colour, pts, thick):
        m = mat(name, colour, 0.8); bm = bmesh.new()
        vs = [bm.verts.new(p) for p in pts]; bm.faces.new(vs)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        made.append(finish(bm, name, m, thick))

    if cut == 'FIRE HELMET':
        # the traditional leather fire helmet: a black dome sat low, the long back brim that sheds water off his neck, a short
        # front brim, eight ribs, and the brass front shield standing up over his brow
        z_low = lambda az: 0.062 - 0.050 * back(az)
        base_r = shell('fire_helmet', HELMET, z_low, 0.030, 0.092)
        brim('fire_helmet_brim', HELMET, z_low, base_r, lambda az: 0.030 + 0.105 * back(az) ** 1.6, lambda az: 0.006 + 0.050 * back(az) ** 2)
        m = mat('fire_helmet_rib', (44, 42, 38), 0.8)
        for k in range(8):
            az0 = -math.pi + 2 * math.pi * (k + 0.5) / 8; bm = bmesh.new(); pts = []
            for j in range(9):
                t = j / 8; ph = t * math.pi / 2 * 0.92; z0 = z_low(az0); top = 0.075 + 0.092
                r = (skull_r(az0, z0 + 0.012) + 0.034) * math.cos(ph); z = z0 + (top - z0) * math.sin(ph)
                pts.append(C + dirn(az0) * r + Vector((0, 0, z)))
            for a, b in zip(pts, pts[1:]):
                d = b - a; q = d.normalized().to_track_quat('Z', 'Y')
                res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=6, radius1=0.0045, radius2=0.0045, depth=d.length)
                for v in res['verts']: v.co = (a + b) * 0.5 + q @ v.co
            made.append(finish(bm, 'fire_helmet_rib_%d' % k, m, 0.0))
        # the front shield: a brass-and-leather shield on a bracket, 10 cm wide, rising from the front brim
        fy = -(base_r[NA // 2] + 0.010); z0 = z_low(0.0)
        P = lambda x, z: C + Vector((x, fy - 0.006 * (z - z0) / 0.12, z))
        plate('fire_helmet_shield', HELMET_SHIELD, [P(-0.050, z0 + 0.012), P(0.050, z0 + 0.012), P(0.056, z0 + 0.070), P(0.034, z0 + 0.118),
                                                   P(0.0, z0 + 0.130), P(-0.034, z0 + 0.118), P(-0.056, z0 + 0.070)], 0.006)
        bm = bmesh.new(); c0 = P(0.0, z0 + 0.068) + Vector((0, -0.006, 0))
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=16, radius1=0.026, radius2=0.026, depth=0.004)
        q = Vector((0, -1, 0)).to_track_quat('Z', 'Y')
        for v in res['verts']: v.co = c0 + q @ v.co
        made.append(finish(bm, 'fire_helmet_roundel', mat('fire_helmet_roundel', HELMET_ROUND, 0.7), 0.0))
    elif cut == 'HARD HAT':
        # a white cap-style hard hat: the shell, its centre ridge, the front peak; sat a touch back on his head
        z_low = lambda az: 0.084 - 0.030 * back(az)
        base_r = shell('hard_hat', HARDHAT, z_low, 0.032, 0.080)
        brim('hard_hat_peak', HARDHAT, z_low, base_r, lambda az: 0.006 + 0.050 * max(0.0, math.cos(az)) ** 2, lambda az: 0.010 * max(0.0, math.cos(az)))
        m = mat('hard_hat_ridge', HARDHAT, 0.85); bm = bmesh.new(); pts = []
        for j in range(11):
            az0 = 0.0 if j <= 5 else math.pi; t = (j if j <= 5 else 10 - j) / 5.0
            ph = (1.0 - t) * math.pi / 2 * 0.98 + 0.0; z0 = z_low(az0); top = 0.075 + 0.080
            r = (skull_r(az0, z0 + 0.012) + 0.032) * math.cos(ph); z = z0 + (top - z0) * math.sin(ph)
            pts.append(C + dirn(az0) * r + Vector((0, 0, z + 0.006)))
        for a, b in zip(pts, pts[1:]):
            d = b - a
            if d.length < 1e-4: continue
            q = d.normalized().to_track_quat('Z', 'Y')
            res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=6, radius1=0.009, radius2=0.009, depth=d.length)
            for v in res['verts']: v.co = (a + b) * 0.5 + q @ v.co
        made.append(finish(bm, 'hard_hat_ridge', m, 0.0))
    elif cut == 'BELLHOP CAP':
        # the bellhop's pillbox: a short straight cylinder sat on the crown, tipped toward his right, oxblood with a gold
        # band at its foot and a gold braid round its top
        z0 = 0.098; tilt = math.radians(9); tip = lambda p: Vector((p.x * math.cos(tilt) - p.z * math.sin(tilt), p.y, p.x * math.sin(tilt) + p.z * math.cos(tilt)))
        rr = [skull_r(-math.pi + 2 * math.pi * i / NA, z0) + 0.022 for i in range(NA)]   # over the hair (measured 11/3: at 0.8 cm the hair stood through)
        def ring(z, k=1.0):
            out = []
            for i in range(NA):
                az = -math.pi + 2 * math.pi * i / NA
                out.append(C + Vector((-0.010, 0.004, 0)) + tip(dirn(az) * (rr[i] * k) + Vector((0, 0, z - 0.002 * math.cos(az)))))
            return out
        for name, colour, zs in (('bellhop_cap', BELL_OX, (z0 - 0.006, z0 + 0.016, z0 + 0.042, z0 + 0.068)), ('bellhop_band', BELL_GOLD, (z0 - 0.008, z0 + 0.014))):
            bm = bmesh.new(); rows = [[bm.verts.new(p) for p in ring(z, 1.0 if name == 'bellhop_cap' else 1.025)] for z in zs]
            for j in range(len(rows) - 1):
                for i in range(NA):
                    bm.faces.new((rows[j][i], rows[j][(i + 1) % NA], rows[j + 1][(i + 1) % NA], rows[j + 1][i]))
            if name == 'bellhop_cap':
                c = bm.verts.new(sum((v.co for v in rows[-1]), Vector((0, 0, 0))) / NA)
                for i in range(NA): bm.faces.new((rows[-1][i], rows[-1][(i + 1) % NA], c))
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
            made.append(finish(bm, name, mat(name, colour, 0.85), 0.004))
        bm = bmesh.new(); top = ring(z0 + 0.068, 1.01)
        for a, b in zip(top, top[1:] + top[:1]):
            d = b - a; q = d.normalized().to_track_quat('Z', 'Y')
            res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=6, radius1=0.004, radius2=0.004, depth=d.length)
            for v in res['verts']: v.co = (a + b) * 0.5 + q @ v.co
        made.append(finish(bm, 'bellhop_braid', mat('bellhop_braid', BELL_GOLD, 0.6), 0.0))
    return [m for m in made if m is not None]


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
        # ---------------------------------------------------------------- THE BURN
        if nm == 'burn_bands':
            # the turnout coat's reflective trim: a lime band with a silver stripe through it round the chest and the hem, and
            # round each sleeve above the cuff; dulled by soot (the colour at the source, the rig's grime on top)
            for k, z in enumerate((0.985, 0.800)):
                made.append(weighted(band('burn_band_lime_%d' % k, [torso_ring(z, over + 0.014)], 0.060, 0.010, TURN_LIME), torso_w))
                made.append(weighted(band('burn_band_silver_%d' % k, [torso_ring(z, over + 0.020)], 0.020, 0.008, TURN_SILVER), torso_w))
            for side in ('L', 'R'):
                made.append(cuff_band('burn_cuff_lime_%s' % side, side, 0.72, 0.052, over * 0.5 + 0.022, TURN_LIME))
                made.append(cuff_band('burn_cuff_silver_%s' % side, side, 0.72, 0.018, over * 0.5 + 0.028, TURN_SILVER))
        elif nm == 'burn_soot':
            # soot on the tan: the hem burnt dark and ragged, the cuffs, a smear up his chest where he wipes the axe
            g = cloth('burn_soot', lambda fm, c: (fm == 'torso' and ((c.z < 0.84 and noise(c, 0.4) > 0.42) or (c.z < 1.02 and noise(c, 2.7) > 0.84))) or
                      (fm == 'fore' and noise(c, 1.3) > 0.62), lambda p: over + 0.012, SOOT, rim=0.0, levels=2, fams=('torso', 'fore'))
            if g: made.append(g)
        elif nm == 'burn_can':
            # THE JERRYCAN on his back: a 20-litre steel can (47 x 34 x 16.5 cm, the pressed X on its face), its three handles up,
            # the spout's cap at the corner, a strap round his chest; faded fuel red, the edges worn to the steel
            sh = section(0.98, ('torso',)); back = sh['cy'] + sh['back'] + over + 0.012
            c = V((0.0, back + 0.084, 0.930))
            bm = bmesh.new(); box(bm, c, V((0.150, 0, 0)), V((0, 0.072, 0)), V((0, 0, 0.205)))
            g = solid('burn_can', bm, CAN_RED, 'torso_joint_3', 0)
            paint(g, 'burn_can_x', CAN_RED_DK, lambda q, nn: nn.y > 0.7 and min(abs((q.x - c.x) - (q.z - c.z) * 0.73), abs((q.x - c.x) + (q.z - c.z) * 0.73)) < 0.016)
            paint(g, 'burn_can_worn', STEEL_DK, lambda q, nn: (abs(q.x - c.x) > 0.135 or abs(q.z - c.z) > 0.190) and noise(q, 3.3) > 0.55)
            made.append(weighted(g, torso_w))
            bm = bmesh.new()
            for x_ in (-0.070, 0.0, 0.070): pipe(bm, [c + V((x_ - 0.022, 0.0, 0.205)), c + V((x_ - 0.018, 0.0, 0.240)), c + V((x_ + 0.018, 0.0, 0.240)), c + V((x_ + 0.022, 0.0, 0.205))], 0.008, seg=8)
            cyl(bm, c + V((0.112, 0.0, 0.200)), c + V((0.130, 0.0, 0.250)), 0.022, 0.020, seg=12)
            made.append(weighted(solid('burn_can_handles', bm, CAN_RED_DK, 'torso_joint_3', 0), torso_w))
            made.append(weighted(band('burn_can_strap', [torso_ring(0.935, over + 0.012)], 0.040, 0.010, WEB_BLK), torso_w))
        elif nm == 'burn_flare':
            # a LIT ROAD FLARE tucked in his belt at his left hip, its cap off and its head burning: the light he carries
            s_ = section(0.92, ('torso',))
            p0 = V((s_['rx'] * 0.72 + over * 0.5, s_['cy'] - s_['front'] * 0.55 - over, 0.880)); p1 = p0 + V((0.040, -0.030, 0.190))
            bm = bmesh.new(); cyl(bm, p0, p1, 0.015, seg=10)
            made.append(weighted(solid('burn_flare', bm, FLARE_RED, 'Skeleton_torso_joint_1', 0), torso_w))
            bm = bmesh.new(); ball(bm, p1 + (p1 - p0).normalized() * 0.018, 0.022, seg=10, ring=6, sq=(1.0, 1.0, 1.4))
            made.append(weighted(solid('burn_flare_lit', bm, FLARE_LIT, 'Skeleton_torso_joint_1', 0), torso_w))
        elif nm == 'burn_axe':
            # THE FIRE AXE: 90 cm, a yellow fibreglass handle through his fist with a black grip, a red head at its end with a
            # bright edge one way and the pick the other; held forward like the valve wrench, so it swings in COMBAT's clips
            hb, fc, ax, wd, th = hand(True)
            Lh = 0.78
            bm = bmesh.new(); cyl(bm, fc - wd * 0.070, fc + wd * Lh, 0.017, 0.015, seg=10)
            g = solid('burn_axe_handle', bm, FIBRE_YEL, hb, 0)
            paint(g, 'burn_axe_grip', WEB_BLK, lambda q, nn: (q - fc).dot(wd) < 0.06)
            made.append(g)
            head = fc + wd * (Lh - 0.030)
            # the blade: a wedge from the handle out along +ax (the edge's way), 4 cm wide at the eye, 12 cm at the edge
            bm = bmesh.new(); NW_, NH_ = 1, 4; vs = []
            for s in (-1, 1):
                rows = []
                for j in range(NH_ + 1):
                    v = 0.020 + 0.150 * j / NH_; half = 0.022 + 0.040 * (j / NH_) ** 1.4; tk = 0.011 * (1 - 0.8 * j / NH_)
                    rows.append([bm.verts.new(head + ax * v + wd * (u * half) + th * (s * tk)) for u in (-1, 1)])
                vs.append(rows)
            for s in range(2):
                for j in range(NH_):
                    q = (vs[s][j][0], vs[s][j][1], vs[s][j + 1][1], vs[s][j + 1][0]); bm.faces.new(q if s else q[::-1])
            for j in range(NH_):
                for u in (0, 1): bm.faces.new((vs[0][j][u], vs[0][j + 1][u], vs[1][j + 1][u], vs[1][j][u]))
            bm.faces.new((vs[0][NH_][0], vs[0][NH_][1], vs[1][NH_][1], vs[1][NH_][0])); bm.faces.new((vs[0][0][0], vs[1][0][0], vs[1][0][1], vs[0][0][1]))
            g = solid('burn_axe_blade', bm, AXE_RED, hb, 0)
            paint(g, 'burn_axe_edge', EDGE, lambda q, nn: (q - head).dot(ax) > 0.150)
            made.append(g)
            bm = bmesh.new(); box(bm, head, wd * 0.030, ax * 0.026, th * 0.020)                       # the eye round the handle
            cyl(bm, head - ax * 0.020, head - ax * 0.150, 0.016, 0.003, seg=8)                         # the pick
            g = solid('burn_axe_eye', bm, AXE_RED, hb, 0)
            paint(g, 'burn_axe_pick', STEEL, lambda q, nn: (q - head).dot(ax) < -0.10)
            made.append(g)
        # ---------------------------------------------------------------- THE SURVEYOR
        elif nm == 'surv_vest':
            # the hi-vis vest, open down the front, faded to old mustard: two silver bands round him and the braces over the
            # shoulders, front and back (a class-2 vest's own layout)
            s0 = section(1.0, ('torso',)); cy0 = s0['cy']; rx0 = s0['rx']
            def keep(fm, c):
                if fm != 'torso' or c.z < 0.860 or c.z > 1.125: return False
                if c.z > 1.03 and abs(c.x) < 0.075 and c.y < cy0: return False                     # the V of the neck, front
                if c.y < cy0 and abs(c.x) < 0.012: return False                                       # open down the front
                if c.z > 1.08 and abs(c.x) < 0.060: return False
                if abs(c.x) > rx0 * 0.86 and c.z > 0.985: return False
                return True
            g = cloth('surv_vest', keep, lambda p: over + 0.032, HIVIS, rim=0.008, levels=2, fams=('torso',))   # over the shirt's own mesh (measured 11/3: at 1.4 cm it hid under it)
            if g:
                paint(g, 'surv_vest_edge', HIVIS_DK, lambda q, nn: q.z < 0.875)
                made.append(weighted(g, torso_w))
            for k, z in enumerate((0.905, 0.965)):
                made.append(weighted(band('surv_band_%d' % k, [torso_ring(z, over + 0.040)], 0.030, 0.008, TURN_SILVER), torso_w))
            for sx in (1, -1):
                for side in (-1, 1):
                    s1 = section(1.05, ('torso',))
                    path = [V((sx * 0.085, s1['cy'] + side * 0.2, z)) for z in (0.985, 1.020, 1.060, 1.100)]
                    made.append(weighted(strip('surv_brace_%d_%d' % (sx > 0, side > 0), [path], 0.028, over + 0.040, TURN_SILVER, across=3, rim=0.002), torso_w))
        elif nm == 'surv_tube':
            # THE MAP TUBE: a black tube 75 cm long slung across his back from his right hip to over his left shoulder, its grey
            # caps, the strap across his chest (the last complete map is in it)
            sh = section(0.98, ('torso',)); back = sh['cy'] + sh['back'] + over + 0.030
            p0 = V((-0.150, back + 0.050, 0.770)); p1 = V((0.170, back + 0.050, 1.260))
            bm = bmesh.new(); cyl(bm, p0, p1, 0.046, seg=16)
            made.append(weighted(solid('surv_tube', bm, TUBE, 'torso_joint_3', 0), torso_w))
            bm = bmesh.new(); d = (p1 - p0).normalized()
            cyl(bm, p0 - d * 0.012, p0 + d * 0.050, 0.050, seg=16); cyl(bm, p1 - d * 0.050, p1 + d * 0.012, 0.050, seg=16)
            made.append(weighted(solid('surv_tube_caps', bm, TUBE_CAP, 'torso_joint_3', 0), torso_w))
            o = V((0.0, -0.004, 0.900)); u = V((-0.24, 0.0, -0.44)).normalized()
            made.append(weighted(band('surv_tube_strap', [ring_pts(o, u, V((0, -1, 0)), n=56, off=over + 0.044)], 0.032, 0.010, WEB_BLK), torso_w))
        elif nm == 'surv_plumb':
            # a brass PLUMB BOB on a cord round his neck, hanging over the vest at his chest (he finds down with it)
            p = front(0.0, 1.000); c = p + V((0, -(over + 0.050), 0))
            bm = bmesh.new()
            cyl(bm, c + V((0, 0, 0.012)), c + V((0, 0, -0.030)), 0.014, 0.010, seg=12); cyl(bm, c + V((0, 0, -0.030)), c + V((0, 0, -0.056)), 0.010, 0.001, seg=12)
            cyl(bm, c + V((0, 0, 0.012)), c + V((0, 0, 0.020)), 0.006, seg=8)
            made.append(weighted(solid('surv_plumb', bm, BRASS, 'torso_joint_3', 1), chest_w))
            bm = bmesh.new()
            for sx in (1, -1): pipe(bm, [c + V((0, 0, 0.020)), c + V((sx * 0.030, 0.010, 0.080)), V((sx * 0.062, c.y + 0.040, 1.130))], 0.0022, seg=5)
            made.append(weighted(solid('surv_plumb_cord', bm, (60, 56, 50), 'torso_joint_3', 0), chest_w))
        elif nm == 'surv_pole':
            # THE RANGE POLE: a survey rod 1.24 m long in 20 cm red and white bands through his fist (carried level like a
            # spear, a third behind his hand), a steel shoe for its point, its round bubble level clipped by his hand
            hb, fc, ax, wd, th = hand(True)
            a0, a1 = fc - wd * 0.32, fc + wd * 0.92
            bm = bmesh.new(); cyl(bm, a0, a1, 0.017, seg=12)
            g = solid('surv_pole', bm, POLE_WHITE, hb, 0)
            paint(g, 'surv_pole_red', POLE_RED, lambda q, nn: int(math.floor(((q - a0).dot(wd)) / 0.20)) % 2 == 0)
            made.append(g)
            bm = bmesh.new(); cyl(bm, a1 - wd * 0.010, a1 + wd * 0.090, 0.018, 0.002, seg=10)
            made.append(solid('surv_pole_shoe', bm, STEEL, hb, 0))
            bm = bmesh.new(); cyl(bm, a0 + wd * 0.006, a0 - wd * 0.014, 0.019, seg=10)
            made.append(solid('surv_pole_cap', bm, (40, 40, 40), hb, 0))
            lv = fc + wd * 0.110 - ax * 0.030
            bm = bmesh.new(); cyl(bm, lv - ax * 0.010, lv - ax * 0.030, 0.020, seg=14)
            made.append(solid('surv_pole_level', bm, (60, 58, 52), hb, 0))
            bm = bmesh.new(); ball(bm, lv - ax * 0.032, 0.012, seg=10, ring=5, sq=(1, 1, 0.5))
            made.append(solid('surv_pole_bubble', bm, (150, 176, 120), hb, 0))
        # ---------------------------------------------------------------- THE CLIMB
        elif nm == 'climb_braid':
            # the bellhop's jacket made his: two rows of four brass buttons, gold braid round each cuff
            bm = bmesh.new()
            for sx in (1, -1):
                for k in range(4):
                    z = 0.905 + 0.052 * k; p = front(sx * (0.050 + 0.006 * k), z) + V((0, -(over + 0.018), 0))
                    ball(bm, p, 0.010, seg=8, ring=5, sq=(1, 0.6, 1))
            made.append(weighted(solid('climb_buttons', bm, BELL_GOLD, 'torso_joint_3', 0), torso_w))
            for side in ('L', 'R'):
                made.append(cuff_band('climb_cuff_%s' % side, side, 0.80, 0.022, over * 0.5 + 0.018, BELL_GOLD))
                made.append(cuff_band('climb_cuff2_%s' % side, side, 0.70, 0.010, over * 0.5 + 0.018, BELL_GOLD))
        elif nm == 'climb_harness':
            # the rope-access harness over the jacket: the orange waist belt with its buckle, braces up over his shoulders and
            # down his back, a chest strap, three steel carabiners on the belt's front
            made.append(weighted(band('climb_belt', [torso_ring(0.900, over + 0.016)], 0.064, 0.012, HARNESS), torso_w))
            for sx in (1, -1):
                s1 = section(1.0, ('torso',))
                # one strip a side, front, over the shoulder and down the back: the kit's strip lays each point on his surface
                path = ([V((sx * 0.070, s1['cy'] - 0.3, z)) for z in (0.905, 0.960, 1.020, 1.080)] + [V((sx * 0.100, s1['cy'] - 0.04, 1.20)), V((sx * 0.100, s1['cy'] + 0.04, 1.20))]
                        + [V((sx * 0.080, s1['cy'] + 0.3, z)) for z in (1.080, 1.020, 0.960, 0.905)])
                made.append(weighted(strip('climb_brace_%d' % (sx > 0), [path], 0.040, over + 0.022, HARNESS, across=3, rim=0.003), torso_w))
            made.append(weighted(band('climb_chest', [torso_ring(1.020, over + 0.022)], 0.026, 0.010, HARNESS_DK), torso_w))
            bm = bmesh.new()
            for k, x_ in enumerate((-0.060, 0.000, 0.060)):
                p = front(x_, 0.880) + V((0, -(over + 0.030), -0.030))
                torus(bm, p, V((1, 0, 0)), 0.026, 0.0045, n=16, seg=5, sx=0.6)
            p = front(0.0, 0.900) + V((0, -(over + 0.026), 0))
            box(bm, p, V((0.030, 0, 0)), V((0, 0.008, 0)), V((0, 0, 0.022)))
            made.append(weighted(solid('climb_steel', bm, STEEL, 'Skeleton_torso_joint_1', 0), torso_w))
        elif nm == 'climb_rope':
            # a COIL OF ROPE over his right shoulder and across to his left hip (kernmantle, faded tan with a blue tracer), two
            # turns so it reads as a coil
            for k, (dx, dy) in enumerate(((0.0, 0.0), (0.020, -0.012))):
                o = V((dx, -0.004 + dy, 0.950)); u = V((-0.26, 0.0, -0.44)).normalized()
                g = band('climb_rope_%d' % k, [ring_pts(o, u, V((0, -1, 0)), n=56, off=over + 0.036 + 0.018 * k)], 0.034, 0.030, ROPE, seg=8,
                         groove=lambda a: 0.004 * max(0.0, math.cos(40 * a)) ** 2)
                if g: paint(g, 'climb_rope_trace_%d' % k, ROPE_TRACE, lambda q, nn: math.sin(55 * q.z + 31 * q.x) > 0.86)
                made.append(weighted(g, torso_w))
        elif nm == 'climb_hook':
            # THE HOIST'S HOOK: the crane's own, safety yellow, its eye on a short chain wound once round his fist, its latch;
            # it hangs along his fingers and swings in COMBAT's clips with his hand
            hb, fc, ax, wd, th = hand(True)
            bm = bmesh.new()
            torus(bm, fc + wd * 0.010, wd, 0.040, 0.007, n=18, seg=6)                                   # the wrap round his fist
            for k in range(4):
                c = fc + ax * (0.075 + 0.060 * k); axis = th if k % 2 == 0 else wd
                torus(bm, c, axis, 0.030, 0.0075, n=16, seg=6, sx=1.6)
            made.append(solid('climb_chain', bm, STEEL_DK, hb, 0))
            top = fc + ax * 0.330
            bm = bmesh.new(); torus(bm, top, th, 0.032, 0.011, n=18, seg=8)                                # the hook's eye
            pts = [top + ax * 0.030]
            for k in range(13):                                                                            # the J: down, round, up
                t = k / 12.0
                if t < 0.35: pts.append(top + ax * (0.030 + 0.110 * t / 0.35) + wd * (0.010 * t))
                else:
                    a = math.pi * (t - 0.35) / 0.65 * 1.05
                    ctr = top + ax * 0.140 + wd * 0.060
                    pts.append(ctr + ax * (0.060 * math.sin(a)) - wd * (0.060 * math.cos(a)))
            pipe(bm, pts, 0.017, seg=10)
            g = solid('climb_hook', bm, HOOK_YEL, hb, 0)
            paint(g, 'climb_hook_worn', HOOK_DK, lambda q, nn: (q - top).dot(ax) > 0.17)
            made.append(g)
            bm = bmesh.new(); tip = pts[-1]
            box(bm, (tip + (top + ax * 0.080)) * 0.5, (tip - (top + ax * 0.080)) * 0.5, th * 0.004, (wd.cross(th)).normalized() * 0.006)
            made.append(solid('climb_hook_latch', bm, STEEL, hb, 0))
    return [m for m in made if m is not None]


# ---- THE PACK: BOSSES' own (kind 'boss', his face on the strip and in PORTRAIT's manifest), then each look own_kit -----
def pack():
    BT.pack()
    ip = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'); I = json.load(open(ip))
    for p in json.load(open(ROLL)):
        lk = TE.look_of(p['id'])
        if lk in I['looks']:
            I['looks'][lk]['own_kit'] = True
            I['looks'][lk]['dressed'] = "BOSSES 4 [four to six] 11/3: his own pieces on his model (tools/bohemia_bosses_four_to_six_11_3_26.py)"
    I['bosses'] = ("BOSSES 11/2 and 11/3: THE POT, THE TAP, THE FILTER (tools/bohemia_bosses_the_three_men.py, dressed by "
                   "tools/bohemia_cook_the_bosses_dressed_11_3_26.py), THE BURN, THE SURVEYOR, THE CLIMB (tools/bohemia_bosses_four_to_six_11_3_26.py), "
                   "kind 'boss', each in a reference gang's cell; records/target/bb/boss_act_one.json names each")
    with open(ip, 'w') as f: f.write(json.dumps(I, indent=1))
    print('own_kit on', [TE.look_of(p['id']) for p in json.load(open(ROLL))])


def purple():
    """never purple (the Amalgamation's alone): every opaque pixel of each new sheet, its hue and saturation"""
    import colorsys
    import numpy as np
    from PIL import Image
    out = {}
    for p in json.load(open(ROLL)):
        lk = TE.look_of(p['id']); fn = os.path.join(ROOT, 'slices/fight_rig', lk + '.webp')
        if not os.path.exists(fn): continue
        a = np.asarray(Image.open(fn).convert('RGBA')).reshape(-1, 4); a = a[a[:, 3] > 0][:, :3] / 255.0
        h = np.array([colorsys.rgb_to_hsv(*c) for c in a[:: max(1, len(a) // 40000)]])
        pur = ((h[:, 0] > 0.70) & (h[:, 0] < 0.90) & (h[:, 1] > 0.30) & (h[:, 2] > 0.15)).mean()
        out[lk] = round(float(pur) * 100, 3)
    print('purple share %', out)
    return out


# ---- THE VOTE CARDS: each boss moving, from the game's own camera (his fight sheet, his face, his place, his thing) ----
CARDS = os.path.join(ROOT, 'records/target/bosses_four_to_six')
PAINT = {'burn': ('depot', 'barrel', 'hand_burn.png', 'HIS FUEL'), 'surveyor': ('office', 'stake', 'hand_survey.png', 'HIS MAP'),
         'climb': ('hoist', 'rope', 'hand_climb.png', 'HIS HOOK')}
HELD = {'burn': 'THE FIRE AXE', 'surveyor': 'THE RANGE POLE', 'climb': "THE HOIST'S HOOK"}   # his weapon by its own name (the fight's numbers are its BB row)


def cards():
    """one moving card a boss (an animated webp, the VOTE tab plays it): THE MAN in the fight's own sheet, turning through his
    eight facings, walking, swinging his weapon, hit; HIS FACE talking on its four mouths; HIS PLACE on the map's own pictures,
    BEFORE on the beat, the tape tracking in, AFTER on the beat; THE THING HE HANDS YOU and the mark his verb leaves"""
    from PIL import Image, ImageDraw, ImageFont
    os.makedirs(CARDS, exist_ok=True)
    I = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'))); cols = I['cols']; DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
    D = json.load(open(os.path.join(ROOT, 'records/target/bb/boss_act_one.json')))
    font = lambda f, n: ImageFont.truetype(os.path.join(ROOT, 'slices/fonts', f), n)
    CAS, ROM, ROMs = font('BohemiaCasing-Regular.ttf', 22), font('BohemiaROM-Regular.ttf', 13), font('BohemiaROM-Regular.ttf', 11)
    PL = json.load(open(os.path.join(ROOT, 'slices/boss_places/boss_places.json')))['pictures']
    out = {}
    for p in json.load(open(ROLL)):
        key = p['id'].split('_')[0]; lk = TE.look_of(p['id']); L = I['looks'].get(lk)
        if not L: print('not packed', lk); continue
        row = next(b for b in D['bosses'] if b['n'] == p['boss'])
        sheet = Image.open(os.path.join(ROOT, 'slices/fight_rig', L['file'])).convert('RGBA'); w, h = L['w'], L['h']
        cell = lambda c, d: sheet.crop((cols.index(c) * w, DIRS.index(d) * h, cols.index(c) * w + w, DIRS.index(d) * h + h))
        seq = [('stand', d) for d in DIRS for _ in (0, 1)] + [('walk@%d' % k, 'SE') for _ in (0, 1) for k in range(6)] + \
              [('swing@%d' % k, 'SE') for k in (0, 1, 2, 2)] + [('stand', 'SE')] * 2 + [('swing@%d' % k, 'SW') for k in (0, 1, 2, 2)] + [('hit@0', 'SE'), ('hit@1', 'SE'), ('hit@1', 'SE'), ('stand', 'SE')]
        fd = os.path.join(ROOT, TE.OUT, lk, 'face'); faces = {m: Image.open(os.path.join(fd, '%s_128.png' % m)).convert('RGBA') for m in ('rest', 'A', 'E', 'O', 'M')}
        mouth = ['rest', 'A', 'rest', 'E', 'O', 'rest', 'M', 'A', 'rest', 'rest']
        place, mark, hand, hname = PAINT[key]
        pic = lambda k, b: Image.open(os.path.join(ROOT, 'slices/boss_places', PL[k]['frames'][b % 2])).convert('RGBA')
        B0, A0 = [pic(place + '_before', b) for b in (0, 1)], [pic(place + '_after', b) for b in (0, 1)]
        item = Image.open(os.path.join(ROOT, 'slices/boss_places', hand)).convert('RGBA'); mk = [pic(mark, b) for b in (0, 1)]
        N = len(seq); frames = []
        W, H = 720, 560
        for i in range(N):
            im = Image.new('RGBA', (W, H), (20, 18, 16, 255)); g = ImageDraw.Draw(im)
            g.text((16, 12), row['n'], font=CAS, fill=(242, 228, 198)); g.text((16, 40), str(row['boss'].get('title', '')).upper(), font=ROM, fill=(205, 185, 142))
            # THE MAN, in the fight's own sheet (the game's camera), at three times
            g.rectangle((12, 66, 352, 548), fill=(32, 28, 24)); g.text((22, 72), 'IN THE FIGHT', font=ROMs, fill=(226, 180, 90))
            c, d = seq[i]; m = cell(c, d).resize((w * 3, h * 3), Image.NEAREST)
            im.alpha_composite(m, (182 - L['foot'][0] * 3, 500 - L['foot'][1] * 3))
            g.text((22, 526), '%s  ·  %s' % (HELD[key], c.split('@')[0].upper()), font=ROMs, fill=(160, 150, 130))
            # HIS FACE, talking
            g.rectangle((364, 66, 516, 238), fill=(32, 28, 24)); g.text((372, 72), 'HIS FACE', font=ROMs, fill=(226, 180, 90))
            im.alpha_composite(faces[mouth[i % len(mouth)]], (376, 96))
            # THE THING HE HANDS YOU, and the mark his verb leaves on a block
            g.rectangle((528, 66, 708, 238), fill=(32, 28, 24)); g.text((536, 72), hname + ' IS YOURS', font=ROMs, fill=(226, 180, 90))
            im.alpha_composite(item, (540, 92)); mm = mk[(i // 4) % 2]; s_ = min(1.0, 92 / mm.height); mm2 = mm.resize((int(mm.width * s_), int(mm.height * s_)), Image.NEAREST)
            im.alpha_composite(mm2, (650 - mm2.width // 2, 196 - mm2.height))
            g.text((536, 214), row['verb']['button'], font=ROMs, fill=(236, 223, 194))
            # HIS PLACE on the map: before on the beat, the tape tracking in, after on the beat
            g.rectangle((364, 250, 708, 548), fill=(32, 28, 24)); g.text((372, 256), 'HIS PLACE: ' + row['place']['name'], font=ROMs, fill=(226, 180, 90))
            beat = (i // 4) % 2; u = max(0.0, min(1.0, (i - 16) / 8.0))
            b_, a_ = B0[beat], A0[beat]; sc = min(330 / b_.width, 262 / b_.height); bw, bh = int(b_.width * sc), int(b_.height * sc)
            bi, ai = b_.resize((bw, bh), Image.NEAREST), a_.resize((bw, bh), Image.NEAREST); x0, y0 = 536 - bw // 2, 540 - bh
            if u <= 0: im.alpha_composite(bi, (x0, y0)); tag = 'BEFORE: HE HOLDS IT'
            elif u >= 1: im.alpha_composite(ai, (x0, y0)); tag = 'AFTER HE FALLS'
            else:
                cut = int(bh * u); im.alpha_composite(bi, (x0, y0))
                if cut > 0: im.alpha_composite(ai.crop((0, 0, bw, cut)), (x0, y0))
                band = ai.crop((0, min(bh - 4, cut), bw, min(bh, cut + 4))); im.alpha_composite(band, (x0 + (3 if i % 2 else -3), y0 + cut))
                tag = 'HE FALLS'   # the tracking line is the after picture's own rows slipped sideways (no line drawn by number: rule 108)
            g.text((372, 526), tag, font=ROMs, fill=(160, 150, 130))
            frames.append(im.convert('RGB'))
        fn = os.path.join(CARDS, 'VOTE_BOSS_%s.webp' % key.upper())
        frames[0].save(fn, save_all=True, append_images=frames[1:], duration=[140] * N, loop=0, quality=80, method=6)
        frames[N - 3].save(os.path.join(CARDS, 'VOTE_BOSS_%s_FIRST.png' % key.upper()), optimize=True)
        out[key] = (fn, N, os.path.getsize(fn) // 1024); print('card', key, N, 'frames', os.path.getsize(fn) // 1024, 'KB')
    return out


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
    elif cmd == 'batch': batch(int(a[1]) if len(a) > 1 else 1)
    elif cmd == 'worker': TE.worker(int(a[1]), int(a[2]))
    elif cmd == 'make':
        for pid in a[1:]: TE.make(pid)
    elif cmd == 'pack': pack()
    elif cmd == 'purple': purple()
    elif cmd == 'cards': cards()
