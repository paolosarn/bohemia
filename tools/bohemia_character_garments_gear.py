#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look], GEAR 1: THE 68 CANON BAGS, CAPES, MANTLES, PADS, PLATES,
HOLSTERS, BANDOLIERS, SCARVES, COWLS, BELTS, SASHES, GLOVES AND HAND WRAPS ON THE 3D MAN (the roll call's last five slots:
back, gear, neck, waist, hands; rule 115c: modelled at the source and rendered through DIRECTION's rig; rule 121(i):
'so many of the same hats and shit on the characters'; rule 121(l): 'all the 2D assets made into 3D assets now'; rule 123:
no card, straight into the people).

THE GAP, MEASURED (10/23, records/target/character/BOHEMIA_CHARACTER_STILL_FLAT.json): 60 of these 68 had no 3D model at
all; the eight that did (two mantles, three capes and drapes, two belts, a tool belt) were each one gang's own, built on
that gang's body by this lane's tool, so a person could wear a pack, a scarf or a pair of gloves only in the old flat art.

The alpha draws them with genBag (backpack, satchel, bedroll, quiver), genCape (cape, mantle, one shoulder), genGear
(kneepads, pauldron, spiked, chestrig, suspenders, shinguards, bracers, holster, bandolier, elbowpads, legwraps,
shoulderroll, chestplate, gorget, toolbelt) and genAcc (scarf with a long tail, cowl, belt, sash, wrapbelt, gloves,
handwrap), read off the bank, never edited. Each kind keeps what its generator's own comments say it is:
  a RUCK PACK is a box high on the back on two shoulder straps that hug the arms, a flap on top and a chest buckle;
  a SATCHEL a box on the hip on a strap from the opposite shoulder; a BEDROLL a thick woven roll strapped across the
  back; a QUIVER a capped tube high on the back, its mouth dark, three fletched arrows fanning past the shoulder;
  a ROAD CAPE hangs from the shoulders down the back, a SHOULDER MANTLE stops at the mid-back (this lane's own cape and
  mantle, the gangs'); the ONE-SHOULDER DRAPE covers one shoulder and crosses the body to the opposite hip;
  KNEEPADS and SHIN GUARDS are strapped plates; a PAULDRON one plate on the right shoulder with a strap lip, SPIKED a
  row of spikes on it, wide at the base and one point at the tip; a CHEST RIG pouches across the chest, the radio on the
  left; SUSPENDERS two straps from the waist buttons over the shoulders to a Y at the back; BRACERS forearm guards on
  both arms; a THIGH HOLSTER rides one leg on a hip strap; a BANDOLIER the diagonal strap from the right shoulder to the
  left hip, brass shells every third row and a pouch at the hip; ELBOW PADS; LEG WRAPS puttees wound up the shins; a
  SHOULDER ROLL the woven blanket roll on the OTHER diagonal, tied at the shoulder and the hip; a CHEST PLATE a scavenged
  plate over the chest with its lit collar edge and an X of straps behind; a GORGET the neck band with a lit top rim
  lapping onto the collar; a SCARF a wrapped bundle at the neck with its tail (TRAILING: to the waist); a COWL a draped
  ring of cloth round the neck and shoulders; a BELT the band and its buckle; a TOOL BELT the heavy belt with a pouch on
  each hip; a HIP SASH the wrapped band knotted on the hip with a hanging tail; a WAIST WRAP a wide wound band; GLOVES and
  HAND WRAPS on the man's own modelled hands.

Each kind is modelled ONCE as clay on the rig's man with BASE 1's toolkit (cloth cut finer and lifted, strips, bands,
rings) and this lane's tube and cape and mantle, in its own ramp at the source (BASE 1's SAT). A piece worn over a coat
stands off the coat, not the man.

TWO WAYS IN (the same as LEGS AND FEET 1):
  * THE MANNEQUIN (the record): build KIT1 | KIT1:<names> through the barber (LOOKS 'K_<tag>' in memory).
  * A PERSON (the game, rule 123(c)): the barber's book rolls a person's kit (roll_kit(): its own random stream, none to
    three pieces, at most one a slot, inside his gang's colours) and the barber's person build dresses him (dress()).

REUSE CHECK: the man, his lift, tube, cape and mantle are THIS LANE's tool; the toolkit is BASE 1's; the head is
PORTRAIT's; the render is DIRECTION's master rig; nothing is drawn by hand.
REFERENCE CHECK (the 9/4 standing duty): the twin is the game's own flat piece as the body wears it today (buildFrame);
analog horror AH-01 (scavenged plates, a seatbelt for a strap, wire for a buckle); no reference game.
"""
import json
import math
import os
import random
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_garments_base as BASE  # noqa: E402
import bohemia_character_garments_legs as LEGS  # noqa: E402

ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
ROLL = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_ROLL_CALL.json')
RIG_DIR = os.path.join(ROOT, 'records/character/rig')
LABEL = 'GEAR 1'
SLOTS = ('back', 'gear', 'neck', 'waist', 'hands')
sstep, slug = BASE.sstep, BASE.slug


def read_bank():
    src = open(ALPHA).read()
    ramps = {}
    for m in re.finditer(r"\b([A-Z][A-Z0-9_]*)=\{dk:\[(\d+),(\d+),(\d+)\],mid:\[(\d+),(\d+),(\d+)\],lt:\[(\d+),(\d+),(\d+)\][,}]", src):
        v = [int(x) for x in m.groups()[1:]]
        ramps.setdefault(m.group(1), dict(dk=tuple(v[0:3]), mid=tuple(v[3:6]), lt=tuple(v[6:9])))
    rows = json.load(open(ROLL))['assets']
    out = []
    for r in rows:
        if r['kind'] != 'garment' or r.get('slot') not in SLOTS or r['old'] not in ('canon', 'cook'): continue
        n = r['name']
        line = re.search(r"\{n:['\"]" + re.escape(n) + r"['\"][^\n]*", src).group(0)
        g = re.search(r"(genBag|genCape|genGear|genAcc)\(g,\{ramp:(\w+)([^}]*)\}", line)
        o = dict(re.findall(r"(\w+):('[^']*'|true|false)", g.group(3)))
        o = {k: (v.strip("'") if v.startswith("'") else v == 'true') for k, v in o.items()}
        kind = o.get('kind') or ('mantle' if o.get('mantle') else 'drape' if o.get('oneShoulder') else 'cape' if g.group(1) == 'genCape' else 'backpack')
        if kind == 'scarf' and o.get('tail') == 'long': kind = 'trailing scarf'
        out.append(dict(name=n, slot=r['slot'], tag='kit_' + slug(n).replace("'", ''), fn=g.group(1), ramp=g.group(2), kind=kind,
                        words=sorted(set(re.split(r"[ \-']", n))), **ramps[g.group(2)]))
    return out


KINDS = ['backpack', 'satchel', 'bedroll', 'quiver', 'cape', 'mantle', 'drape',
         'kneepads', 'shinguards', 'elbowpads', 'bracers', 'legwraps', 'pauldron', 'spiked', 'chestrig', 'chestplate', 'gorget',
         'suspenders', 'holster', 'bandolier', 'shoulderroll',
         'scarf', 'trailing scarf', 'cowl', 'belt', 'toolbelt', 'sash', 'wrapbelt', 'gloves', 'handwrap']
BANK = read_bank()
BY = {G['name']: G for G in BANK}
HELD = {}   # a piece that failed this lane's own look at it on the 3D man stays out of the roll (name -> why)
TORSO_FRONT = ('chestrig', 'chestplate', 'bandolier', 'suspenders', 'shoulderroll', 'pauldron', 'spiked', 'satchel', 'drape')
CUTS = {}
for _G in BANK:
    CUTS['KIT ' + _G['name']] = dict(tag=_G['tag'], garment=_G['name'], body='records/character/rig/k_%s.glb' % _G['tag'], as_cut='TEMPLE TAPER',
                                     bank=dict(ramp='H_BLK', vol=0, side=0.40, front=0.16, fade=4), hair=LEGS.LEGS_HAIR, zcap=1.0,
                                     worn_by='the roll call: ' + _G['name'])
ORDER = ['KIT ' + G['name'] for G in sorted(BANK, key=lambda G: (KINDS.index(G['kind']), G['name']))]


def pick(arg):
    head, _, rest = arg.partition(':')
    if not rest: return list(ORDER)
    want = [w.strip().upper() for w in rest.split(',')]
    return [c for c in ORDER if CUTS[c]['garment'] in want or CUTS[c]['tag'].upper() in want or BY[CUTS[c]['garment']]['kind'].upper() in want]


def body(cut):
    """the mannequin wearing this piece over the man's black tank and cargos, in the barber's wrapped boots"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    G = BY[CUTS[cut]['garment']]
    L = dict(CH.LOOKS['Body']); L = {k: (dict(v) if isinstance(v, dict) else v) for k, v in L.items()}
    L['worn'] = dict(L['worn'], feet='WRAPPED BOOTS')
    L['shoes'] = dict(colour=(54, 52, 54), kind='boot', top=0.20)
    L['hair'] = dict(style='taper', colour=CH.HAIR_DARK); L['order'] = 103
    L['shape'] = "the barber's mannequin in %s (%s)" % (G['name'], G['kind'])
    dress(L, [G['name']])
    name = 'K_' + G['tag'].upper()
    CH.LOOKS[name] = L
    CH.build(name, RIG_DIR)


# ---- a person: the roll and the dress --------------------------------------------------------------------------------
# how often a person carries a piece of each slot (a crowd on a ruined street: a belt on many, a bag on some, armour rare)
P_SLOT = {'waist': 0.30, 'back': 0.22, 'neck': 0.16, 'gear': 0.18, 'hands': 0.16}


def roll_kit(gang, pid):
    """a person's kit: its own random stream (the rest of his roll untouched), at most one piece a slot, in his gang's
    colours (three times) or the work colours (once); a look that already wears a cape or a mantle takes no other back
    piece but a satchel, and no belt goes over a look's own belt"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    look = CH.LOOKS.get(gang) or CH.LOOKS['Body']
    own = [look[k]['colour'] for k in ('shirt', 'coat', 'mantle', 'cape', 'trousers', 'shoes') if isinstance(look.get(k), dict) and look[k].get('colour')]
    caped = any(isinstance(look.get(k), dict) for k in ('cape', 'mantle'))
    rng = random.Random('%s:%s:kit' % (gang, pid))
    kit = []
    for slot in ('waist', 'back', 'neck', 'gear', 'hands'):
        if rng.random() >= P_SLOT[slot]: continue
        pool = [G for G in BANK if G['slot'] == slot and G['name'] not in HELD]
        if slot == 'back' and caped: pool = [G for G in pool if G['kind'] == 'satchel']
        if slot == 'waist' and isinstance(look.get('belt'), dict): pool = []
        if slot == 'neck' and any(BY[n]['kind'] == 'gorget' for n in kit): pool = []
        items = [(G['name'], 3.0 if any(LEGS.near(G['mid'], c) for c in own) else 1.0 if LEGS.plain(G['mid']) else 0.3) for G in pool]
        if not items: continue
        tot = sum(w for _, w in items); x = rng.random() * tot
        for n, w in items:
            x -= w
            if x <= 0: kit.append(n); break
        else: kit.append(items[-1][0])
    if any(BY[n]['kind'] == 'gorget' for n in kit): kit = [n for n in kit if BY[n]['slot'] != 'neck']
    return kit


def dress(L, kit):
    """put a person's kit on a look (in memory): a cape or a mantle is this lane's own (the body tool builds it); every
    other piece rides the extra() hook after the top, the coat and the trousers"""
    kit = [n for n in (kit or []) if n in BY]
    if not kit: return L
    L['worn'] = dict(L.get('worn') or {})
    rest = []
    for n in kit:
        G = BASE.at_source(BY[n]); L['worn'][G['slot']] = n
        if G['kind'] == 'cape' and not isinstance(L.get('cape'), dict):
            L['cape'] = dict(colour=G['mid'], hem=0.29, top=1.12)                 # the gangs' road cape: to below the knee
        elif G['kind'] == 'mantle' and not isinstance(L.get('mantle'), dict):
            L['mantle'] = dict(colour=G['mid'], low=0.88)                         # stops at the mid-back
        else:
            rest.append(G)
    over = 0.022 if (L['worn'].get('outer') or isinstance(L.get('coat'), dict)) else 0.0
    over += 0.020 if isinstance(L.get('mantle'), dict) else 0.0
    old = L.get('extra')
    L['extra'] = lambda X, rest=rest, over=over, old=old: ((old(X) or []) if old else []) + pieces(rest, X, over)
    return L


# ---- the pieces on the man ---------------------------------------------------------------------------------------------
def pieces(GS, X, over=0.0):
    if not GS: return []
    K_ = BASE.kit(X)
    V, M, Mi, body, P, fam_v, ffam = K_['V'], K_['M'], K_['Mi'], K_['body'], K_['P'], K_['fam_v'], K_['ffam']
    cloth, strip, band, ring_pts, surf, new_obj, finish = K_['cloth'], K_['strip'], K_['band'], K_['ring_pts'], K_['surf'], K_['new_obj'], K_['finish']
    arm_ring, neck_ring, waist_ring, buttons, arm_s, front = K_['arm_ring'], K_['neck_ring'], K_['waist_ring'], K_['buttons'], K_['arm_s'], K_['front']
    bvh = K_['bvh']; bmesh = X['bmesh']; mathutils = X['mathutils']; sc = X['sc']; arm = X['arm']; mat = X['mat']; tag = X['tag']
    section = X['section']
    made = []
    full = lambda bn: next(b.name for b in arm.data.bones if b.name.endswith(bn) or b.name == bn)

    def solid(key, bm, colour, bone=None, subdiv=1):
        """a rigid piece: built in world space in bm, on one bone (or the man's nearest weights)"""
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        o = new_obj(bm, key)
        if bone:
            for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
            vg = o.vertex_groups.new(name=full(bone)); vg.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
        return finish(o, colour, key, subdiv, 0)

    def box(bm, c, ax, ay, az):
        r = bmesh.ops.create_cube(bm, size=2.0)
        for v in r['verts']:
            x, y, z = v.co; v.co = c + ax * x + ay * y + az * z

    def cyl(bm, p0, p1, r0, r1=None, seg=12):
        d = p1 - p0; L_ = d.length; q = d.normalized().to_track_quat('Z', 'Y')
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r0, radius2=r0 if r1 is None else r1, depth=L_)
        for v in res['verts']: v.co = (p0 + p1) * 0.5 + q @ v.co

    def leg_c(z, sx):
        pts = [p for p, fm in zip(P, fam_v) if fm in ('thigh', 'shin', 'foot') and p.x * sx > 0 and abs(p.z - z) < 0.03]
        if not pts: return V((sx * 0.08, -0.02, z))
        return V((sum(p.x for p in pts) / len(pts), sum(p.y for p in pts) / len(pts), z))

    def leg_rings(z, off, sides=(1, -1)):
        return [ring_pts(leg_c(z, sx), V((1, 0, 0)), V((0, -1, 0)), n=32, off=off) for sx in sides]

    def tilted(z_c, slope, off):
        """a ring round the torso on the plane through the front-back axis and the line from the right shoulder (slope -1)
        or the left shoulder (slope +1) to the opposite hip"""
        o = V((0.0, -0.004, z_c)); u = V((0.24 * slope, 0.0, -0.44)).normalized()
        return ring_pts(o, u, V((0, -1, 0)), n=56, off=off)

    def paint(g, colour, key, pred):
        if g is None: return g
        g.data.materials.append(mat(key, colour)); i = len(g.data.materials) - 1
        Mg = g.matrix_world
        for f in g.data.polygons:
            if pred(Mg @ f.center): f.material_index = i
        return g

    def torso_w(o):
        """a strap round the torso rides the torso alone (cycle 1, looking, BLANKET SHOULDER ROLL: on the man's nearest
        weights the roll's top took the arm's, and when the arm came down to stand it pulled the roll into a hoop)"""
        if o is None: return o
        for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
        g3, g2, g1 = (o.vertex_groups.new(name=full(b)) for b in ('torso_joint_3', 'Skeleton_torso_joint_2', 'Skeleton_torso_joint_1'))
        Mo = o.matrix_world
        for v in o.data.vertices:
            z = (Mo @ v.co).z; a3 = sstep(0.90, 1.00, z); a1 = sstep(0.80, 0.70, z)
            g3.add([v.index], a3, 'REPLACE'); g1.add([v.index], a1, 'REPLACE'); g2.add([v.index], max(0.0, 1.0 - a3 - a1), 'REPLACE')
        return o

    sec_hi = section(0.92, ('torso',)); back_y = sec_hi['cy'] + sec_hi['back']   # the back's surface at the shoulder blades
    sec_lo = section(0.72, ('torso',)); back_lo = sec_lo['cy'] + sec_lo['back']

    for G in GS:
        k = G['kind']; mid, dk, lt = G['mid'], G['dk'], G['lt']; key = G['tag'][4:]
        heavy = 'STEEL' in G['words'] or 'RUST' in G['words'] or 'SCRAP' in G['words']
        # ---- THE BACK ----
        if k == 'backpack':
            bm = bmesh.new(); c = V((0.0, back_y + over + 0.075, 0.905))
            box(bm, c, V((0.135, 0, 0)), V((0, 0.068, 0)), V((0, 0, 0.180)))
            made.append(solid(key + '_pack', bm, mid, 'torso_joint_3', 2))
            bm = bmesh.new(); box(bm, c + V((0, -0.004, 0.170)), V((0.140, 0, 0)), V((0, 0.074, 0)), V((0, 0, 0.026)))   # the flap
            made.append(solid(key + '_flap', bm, dk, 'torso_joint_3', 1))
            bm = bmesh.new(); box(bm, c + V((0, 0.070, -0.040)), V((0.085, 0, 0)), V((0, 0.020, 0)), V((0, 0, 0.070)))   # the outer pocket
            made.append(solid(key + '_pocket', bm, mid, 'torso_joint_3', 1))
            # the shoulder straps hug the arms: the front chest, over the shoulder, down the back to the pack's foot
            straps = [[front(sx * 0.082, 0.80), front(sx * 0.085, 0.95), front(sx * 0.080, 1.06), V((sx * 0.085, -0.01, 1.150)),
                       front(sx * 0.085, 1.06, 1)] for sx in (1, -1)]
            # cycle 1 (looking, OLIVE RUCK PACK): straps in the ramp's dark vanished on a black tank from the front; the webbing
            # is the bag's own cloth, its chest strap the dark
            made.append(strip(key + '_straps', straps, 0.032, over + 0.010, mid, across=4))
            made.append(strip(key + '_chest_strap', [[front(x, 0.985) for x in (-0.085, -0.04, 0.0, 0.04, 0.085)]], 0.016, over + 0.014, dk, across=3))
            made.append(buttons(key + '_buckle', [front(0.0, 0.985)], lt, r=0.010, lift_=over + 0.018))
        elif k == 'satchel':   # the bag on his left hip, the strap from his right shoulder
            bm = bmesh.new(); c = V((0.150 + over, -0.030, 0.640))
            box(bm, c, V((0.030, 0, 0)), V((0, 0.105, 0)), V((0, 0, 0.082)))
            made.append(solid(key + '_bag', bm, mid, 'Skeleton_torso_joint_1', 2))
            bm = bmesh.new(); box(bm, c + V((0.010, 0, 0.055)), V((0.026, 0, 0)), V((0, 0.108, 0)), V((0, 0, 0.032)))
            made.append(solid(key + '_flap', bm, lt, 'Skeleton_torso_joint_1', 1))
            made.append(torso_w(band(key + '_strap', [tilted(0.900, 1, over + 0.010)], 0.030, 0.008, dk)))
        elif k == 'bedroll':   # the woven roll strapped across the small of the back, two ties, the carry straps up
            bm = bmesh.new(); y = back_lo + over + 0.060
            cyl(bm, V((-0.20, y, 0.745)), V((0.20, y, 0.745)), 0.058, seg=16)
            g = solid(key + '_roll', bm, mid, 'Skeleton_torso_joint_2', 1)
            made.append(paint(g, dk, key + '_weave', lambda c: (int((c.x + 0.4) / 0.045) % 2 == 0) and abs(c.x) > 0.17))
            for sx in (1, -1):
                bm = bmesh.new(); cyl(bm, V((sx * 0.105, y, 0.745)), V((sx * 0.125, y, 0.745)), 0.062, seg=16)
                made.append(solid(key + '_tie_%d' % (sx > 0), bm, dk, 'Skeleton_torso_joint_2', 0))
            made.append(strip(key + '_carry', [[front(sx * 0.085, 0.82), V((sx * 0.085, -0.01, 1.150)), front(sx * 0.090, 0.95, 1), front(sx * 0.10, 0.80, 1)]
                                               for sx in (1, -1)], 0.024, over + 0.010, dk, across=4))
        elif k == 'quiver':   # a capped tube high on the back, slanting up to the left shoulder; three fletched arrows past it
            bm = bmesh.new(); y = back_y + over + 0.050
            p0, p1 = V((-0.100, y, 0.720)), V((0.110, y, 1.170))
            cyl(bm, p0, p1, 0.042, seg=14)
            g = solid(key + '_tube', bm, mid, 'torso_joint_3', 1)
            made.append(paint(g, dk, key + '_seam', lambda c: abs(c.y - y - 0.04) < 0.012))
            bm = bmesh.new(); cyl(bm, p1 - (p1 - p0).normalized() * 0.03, p1 + (p1 - p0).normalized() * 0.004, 0.046, seg=14)   # the dark mouth
            made.append(solid(key + '_mouth', bm, dk, 'torso_joint_3', 0))
            d = (p1 - p0).normalized()
            for i, fan in enumerate((-0.22, 0.0, 0.22)):
                e = (d + V((fan, 0.05 * i - 0.05, 0))).normalized(); a0 = p1 - d * 0.02; a1 = p1 + e * 0.17
                bm = bmesh.new(); cyl(bm, a0, a1, 0.005, seg=6)
                made.append(solid(key + '_arrow_%d' % i, bm, (120, 104, 80), 'torso_joint_3', 0))
                bm = bmesh.new(); cyl(bm, a1 - e * 0.055, a1, 0.018, 0.004, seg=3)   # the fletching: three vanes, a cone of three
                made.append(solid(key + '_fletch_%d' % i, bm, lt, 'torso_joint_3', 0))
            made.append(torso_w(band(key + '_strap', [tilted(0.930, -1, over + 0.010)], 0.026, 0.008, dk)))
        elif k == 'drape':   # one shoulder (his right) and across the body to the opposite hip, front and back
            a_ = V((-0.130, 1.100)); b_ = V((0.150, 0.640)); dd = (b_ - a_).normalized(); nn = V((dd.y, -dd.x))
            def keep_d(fm, c):
                if fm == 'upper': return c.x < 0 and arm_s(fm, c) < 0.55
                if fm not in ('torso', 'neck'): return False
                q = V((c.x, c.z)) - a_; along = q.dot(dd); acr = q.dot(nn)
                return -0.06 < along < (b_ - a_).length + 0.05 and abs(acr) < 0.105 + 0.012 * math.sin(31 * c.z + 7 * c.x)
            made.append(cloth(key, keep_d, lambda p: over + 0.016 + 0.010 * max(0.0, math.cos(2 * math.pi * (p.x + p.z) / 0.07)) ** 2, mid,
                              rim=0.006, fams=('torso', 'neck', 'upper')))
        # ---- THE GEAR ----
        elif k in ('kneepads', 'shinguards'):
            zc, half = (0.355, 0.055) if k == 'kneepads' else (0.215, 0.090)
            for sx in (1, -1):
                lc = leg_c(zc, sx)
                def keep_k(fm, c, lc=lc): return fm in ('thigh', 'shin') and c.y < lc.y - 0.005 and abs(c.z - zc) < half and abs(c.x - lc.x) < 0.050
                made.append(cloth('%s_%d' % (key, sx > 0), keep_k, lambda p, lc=lc: 0.020 + 0.012 * math.exp(-(((p.z - zc) / half) ** 2) * 2.0), mid,
                                  rim=0.006, fams=('thigh', 'shin')))
            for dz in ((-0.6, 0.6) if k == 'kneepads' else (-0.7, 0.0, 0.7)):
                made.append(band('%s_strap_%d' % (key, int(10 * dz)), leg_rings(zc + dz * half, 0.010), 0.014, 0.007, dk))
        elif k == 'elbowpads':
            def keep_e(fm, c): return fm in ('upper', 'fore') and abs(arm_s(fm, c) - 1.0) < 0.14
            made.append(cloth(key, keep_e, lambda p: over * 0.4 + 0.016, mid, rim=0.006, fams=('upper', 'fore')))
            made += [band(key + '_strap', arm_ring(s_, over * 0.4 + 0.012), 0.010, 0.006, dk) for s_ in (0.84, 1.16)]
        elif k == 'bracers':
            def keep_b(fm, c): return fm == 'fore' and 1.22 < arm_s(fm, c) < 1.86
            made.append(cloth(key, keep_b, lambda p: over * 0.4 + 0.011, mid, rim=0.005, fams=('fore',)))
            made += [band(key + '_lace', arm_ring(s_, over * 0.4 + 0.010), 0.008, 0.006, dk) for s_ in (1.32, 1.54, 1.76)]
        elif k == 'legwraps':   # puttees: a strip wound up each shin, the spiral's edges in the dark
            def keep_l(fm, c): return fm == 'shin' and 0.105 < c.z < 0.330
            g = cloth(key, keep_l, lambda p: 0.012 + 0.003 * max(0.0, math.cos(2 * math.pi * (p.z + 0.03 * math.atan2(p.y, p.x)) / 0.034)) ** 2,
                      mid, rim=0.005, fams=('shin',))
            made.append(paint(g, dk, key + '_edge', lambda c: ((c.z + 0.03 * math.atan2(c.y, c.x)) % 0.034) < 0.005))
        elif k in ('pauldron', 'spiked'):   # one plate on his right shoulder, a strap lip onto the torso under the left arm
            def keep_p(fm, c): return (fm == 'upper' and c.x < 0 and arm_s(fm, c) < 0.42) or (fm == 'torso' and c.x < -0.075 and c.z > 1.01)
            def thick_p(p):
                q = V((-p.x, p.y, p.z)); d = (q - K_['SH']).length
                return over + 0.020 + 0.022 * math.exp(-((d / 0.075) ** 2))
            g = cloth(key, keep_p, thick_p, mid, rim=0.008, fams=('torso', 'upper'))
            made.append(paint(g, dk, key + '_rim', lambda c: (c - V((-K_['SH'].x, K_['SH'].y, K_['SH'].z))).length > 0.085))
            made.append(torso_w(band(key + '_strap', [tilted(0.960, -1, over + 0.009)], 0.020, 0.007, dk)))
            if k == 'spiked':
                for i in range(3):
                    sp = V((-K_['SH'].x - 0.020 - 0.028 * i, K_['SH'].y + 0.010 - 0.012 * i, K_['SH'].z + 0.050 - 0.006 * i))
                    base, n_ = surf(sp); bm = bmesh.new(); cyl(bm, base + n_ * (over + 0.030), base + n_ * (over + 0.085), 0.016, 0.0015, seg=8)
                    made.append(solid('%s_spike_%d' % (key, i), bm, lt, 'Skeleton_arm_joint_R', 0))
        elif k == 'chestrig':   # the panel across the chest, three pouches and the radio on the left, an X of straps behind
            def keep_c(fm, c): return fm == 'torso' and c.y < -0.005 and 0.80 < c.z < 1.02 and abs(c.x) < 0.125
            # cycle 1 (looking, CHEST RIG): the panel in the ramp's dark vanished on a black tank; the webbing is the mid
            made.append(cloth(key, keep_c, lambda p: over + 0.010, mid, rim=0.005, fams=('torso',)))
            cs = [(-0.072, 0.880), (0.000, 0.875), (0.072, 0.880)]
            made.append(strip(key + '_pouches', [[front(x, z + 0.050 * (0.5 - t)) for t in (0.0, 0.33, 0.66, 1.0)] for x, z in cs], 0.058, over + 0.026, mid, across=5))
            made.append(strip(key + '_radio', [[front(0.098, z) for z in (1.02, 0.99, 0.96, 0.93)]], 0.034, over + 0.030, dk, across=4))
            made.append(strip(key + '_x', [[V((sx * 0.085, -0.01, 1.150)), front(sx * 0.07, 1.05, 1), front(-sx * 0.04, 0.88, 1), front(-sx * 0.09, 0.78, 1)]
                                           for sx in (1, -1)], 0.024, over + 0.008, dk, across=4))
        elif k == 'chestplate':
            def keep_c(fm, c): return fm == 'torso' and c.y < 0.0 and 0.80 < c.z < 1.085 and abs(c.x) < 0.118
            g = cloth(key, keep_c, lambda p: over + 0.016 + 0.010 * math.exp(-((p.x / 0.09) ** 2)), mid, rim=0.007, fams=('torso',))
            made.append(paint(g, lt, key + '_collar', lambda c: c.z > 1.060))
            made.append(paint(g, dk, key + '_rivets', lambda c: c.z < 0.83 or (abs(abs(c.x) - 0.09) < 0.008 and int(c.z / 0.03) % 2 == 0)))
            made.append(strip(key + '_x', [[V((sx * 0.085, -0.01, 1.150)), front(sx * 0.07, 1.05, 1), front(-sx * 0.04, 0.88, 1), front(-sx * 0.09, 0.80, 1)]
                                           for sx in (1, -1)], 0.026, over + 0.008, dk, across=4))
        elif k == 'gorget':
            made.append(band(key, [neck_ring(lambda c: 1.140, over * 0.5 + 0.016)], 0.060, 0.022, mid))
            made.append(band(key + '_rim', [neck_ring(lambda c: 1.168, over * 0.5 + 0.026)], 0.012, 0.010, lt))
        elif k == 'suspenders':   # the waist buttons in front, over the shoulders, a Y behind to one spine strap
            made.append(strip(key, [[front(sx * 0.068, 0.67), front(sx * 0.066, 0.85), front(sx * 0.064, 1.02), V((sx * 0.072, -0.01, 1.150)),
                                     front(sx * 0.050, 1.05, 1), front(sx * 0.012, 0.93, 1)] for sx in (1, -1)], 0.022, over + 0.006, mid, across=4))
            made.append(strip(key + '_spine', [[front(0.0, z, 1) for z in (0.93, 0.82, 0.70)]], 0.026, over + 0.006, mid, across=4))
            made.append(buttons(key + '_buttons', [front(sx * 0.068, 0.675) for sx in (1, -1)], lt, r=0.008, lift_=over + 0.010))
        elif k == 'holster':   # on his right thigh: the holster, two leg straps, the hip strap up to the belt line
            lc = leg_c(0.50, -1)
            bm = bmesh.new(); box(bm, V((lc.x - 0.060, lc.y - 0.012, 0.490)), V((0.018, 0, 0)), V((0, 0.040, 0)), V((0, 0, 0.075)))
            made.append(solid(key, bm, mid, 'leg_joint_R_1', 1))
            bm = bmesh.new(); box(bm, V((lc.x - 0.066, lc.y - 0.020, 0.585)), V((0.014, 0, 0)), V((0, 0.020, 0)), V((0, 0, 0.026)))   # the grip
            made.append(solid(key + '_grip', bm, (40, 36, 34), 'leg_joint_R_1', 0))
            made += [band('%s_leg_%d' % (key, i), leg_rings(z_, 0.010, sides=(-1,)), 0.016, 0.007, dk) for i, z_ in enumerate((0.43, 0.53))]
            hip = [bvh.ray_cast(V((-0.6, -0.01, z)), V((1, 0, 0)), 1.2)[0] or V((-0.12, -0.01, z)) for z in (0.66, 0.62, 0.58)]
            made.append(strip(key + '_hip', [hip], 0.020, 0.012, dk, across=3))
        elif k in ('bandolier', 'shoulderroll'):
            slope = -1 if k == 'bandolier' else 1   # the bandolier from the right shoulder; the roll on the OTHER diagonal
            # cycle 2 (looking, BLANKET SHOULDER ROLL): 3.4 cm off the man and 6 cm thick it stood off him like a hoop from the side;
            # a roll is worn snug, its inside on him
            ring = tilted(0.900, slope, over + (0.010 if k == 'bandolier' else 0.004))
            if k == 'bandolier':
                made.append(torso_w(band(key, [ring], 0.042, 0.010, mid)))
                shells = [p + d * 0.004 for i, (p, d) in enumerate(ring) if p.y < -0.02 and i % 2 == 0 and 0.70 < p.z < 1.10]
                made.append(torso_w(buttons(key + '_shells', shells, (176, 140, 70), r=0.009, lift_=over + 0.010)))
                bm = bmesh.new(); box(bm, V((0.140 + over, -0.050, 0.700)), V((0.026, 0, 0)), V((0, 0.050, 0)), V((0, 0, 0.040)))
                made.append(solid(key + '_pouch', bm, dk, 'Skeleton_torso_joint_1', 1))
            else:
                g = torso_w(band(key, [ring], 0.075, 0.050, mid, seg=12, groove=lambda a: 0.007 * max(0.0, math.cos(14 * a)) ** 4))
                made.append(paint(g, dk, key + '_ties', lambda c: (c.z > 1.06 and c.x > 0) or (c.z < 0.74 and c.x < 0)))   # tied at the shoulder and the hip
        # ---- THE NECK ----
        elif k in ('scarf', 'trailing scarf'):
            made.append(band(key, [neck_ring(lambda c: 1.120, over * 0.5 + 0.018), neck_ring(lambda c: 1.150, over * 0.5 + 0.014)], 0.040, 0.028, mid,
                             groove=lambda a: 0.004 * max(0.0, math.cos(5 * a + 1.0)) ** 2))
            tail_to = 0.70 if k == 'trailing scarf' else 0.93
            made.append(strip(key + '_tail', [[front(0.045, z) for z in [1.10 - (1.10 - tail_to) * t for t in (0.0, 0.25, 0.5, 0.75, 1.0)]]],
                              lambda t: 0.060 - 0.012 * t, over + 0.030, mid, across=5))
            made.append(strip(key + '_fringe', [[front(0.045, z) for z in (tail_to + 0.012, tail_to - 0.004)]], 0.050, over + 0.032, dk, across=5))
        elif k == 'cowl':   # a loose ring of cloth draped round the neck and over the shoulders, low in front
            def keep_w(fm, c):
                low = 0.97 if c.y < 0 else 1.03
                return (fm in ('torso', 'neck') and low < c.z < 1.165) or (fm == 'upper' and arm_s(fm, c) < 0.25)
            def thick_w(p):
                return over * 0.6 + 0.024 + 0.022 * sstep(1.12, 1.00, p.z) + 0.008 * max(0.0, math.cos(2 * math.pi * math.atan2(p.x, -p.y) * 7 / (2 * math.pi))) ** 3
            made.append(cloth(key, keep_w, thick_w, mid, rim=0.007, fams=('torso', 'neck', 'upper')))
        # ---- THE WAIST ----
        elif k == 'belt':
            made.append(band(key, [waist_ring(0.655, over * 0.3 + 0.010)], 0.034, 0.010, mid))
            made.append(buttons(key + '_buckle', [front(0.0, 0.655)], lt, r=0.014, lift_=over * 0.3 + 0.014))
        elif k == 'toolbelt':
            made.append(band(key, [waist_ring(0.650, over * 0.3 + 0.012)], 0.048, 0.012, dk))
            for sx in (1, -1):
                s_ = section(0.62, ('torso',))
                bm = bmesh.new(); box(bm, V((sx * (s_['rx'] + 0.020 + over * 0.3), s_['cy'] - 0.02, 0.600)), V((0.024, 0, 0)), V((0, 0.044, 0)), V((0, 0, 0.060)))
                made.append(solid('%s_pouch_%d' % (key, sx > 0), bm, mid, 'Skeleton_torso_joint_1', 1))
            made.append(buttons(key + '_buckle', [front(0.0, 0.650)], (150, 140, 120), r=0.015, lift_=over * 0.3 + 0.016))
        elif k == 'sash':   # wrapped at the hip, knotted on his left, the tail hanging and swaying
            made.append(band(key, [waist_ring(0.650, over * 0.3 + 0.012)], 0.060, 0.012, mid, groove=lambda a: 0.003 * max(0.0, math.sin(9 * a)) ** 2))
            kx = section(0.65, ('torso',))['rx'] + over * 0.3 + 0.010
            made.append(buttons(key + '_knot', [V((kx, -0.035, 0.650))], dk, r=0.022, lift_=0.006))
            made.append(strip(key + '_tail', [[V((kx + 0.012, -0.040, z)) for z in (0.640, 0.590, 0.540, 0.490)]], lambda t: 0.050 - 0.015 * t, 0.006, mid, across=4))
        elif k == 'wrapbelt':
            made.append(band(key, [waist_ring(0.665, over * 0.3 + 0.014)], 0.090, 0.018, mid, groove=lambda a: 0.004 * max(0.0, math.cos(3 * a)) ** 2))
            made.append(band(key + '_edge', [waist_ring(0.630, over * 0.3 + 0.020)], 0.014, 0.010, dk))
        # ---- THE HANDS: the man's own modelled hands, gloved or wrapped ----
        elif k in ('gloves', 'handwrap'):
            # cycle 1 (looking, DUST GLOVES): the body tool models the hands AFTER the extra() hook, so recolouring them found
            # nothing; the glove is its own shell, the hand's own shape (the body tool's hand_mesh) 3 mm out on the same bone
            for h in X['hands']:
                g = X['hand_mesh'](*h); side_ = g.name[-1]; g.name = '%s_%s_%s' % (tag, key, side_)   # the hand keeps its own name
                for v in g.data.vertices: v.co = v.co + v.normal * 0.003
                made.append(finish(g, mid, key, 0, 0))
            if k == 'gloves':
                made += [band(key + '_cuff', arm_ring(1.97, 0.010), 0.034, 0.010, dk)]
            else:
                made += [band('%s_wrap_%d' % (key, i), arm_ring(s_, 0.006), 0.012, 0.006, lt if i % 2 else dk) for i, s_ in enumerate((1.90, 1.94, 1.98))]
        # cape and mantle are the body tool's own (dress() sets them on the look)
    return [m for m in made if m is not None]


def record():
    out = dict(what='CHARACTER [every old asset into the new look], GEAR 1: the 68 canon bags, capes, pads, plates, holsters, scarves, belts and gloves, read off the alpha',
               kinds={k: [G['name'] for G in BANK if G['kind'] == k] for k in KINDS},
               pieces=[dict(name=G['name'], slot=G['slot'], tag=G['tag'], fn=G['fn'], ramp=G['ramp'], kind=G['kind']) for G in BANK])
    p = os.path.join(ROOT, 'records/target/character/BOHEMIA_GEAR_ONE.json')
    json.dump(out, open(p, 'w'), indent=1)
    print('wrote', os.path.relpath(p, ROOT), len(BANK), {k: len(v) for k, v in out['kinds'].items()})


if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == 'roll':
        for i in range(int(sys.argv[3]) if len(sys.argv) > 3 else 12): print(roll_kit(sys.argv[2], i))
    else:
        record()
