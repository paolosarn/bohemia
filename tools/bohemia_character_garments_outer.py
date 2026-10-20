#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look], GARMENTS OUTER: THE 74 CANON COATS ON THE BARBER'S MANNEQUIN
(the roll call's fifth batch, the outer slot; rule 115c: modelled at the source and rendered through DIRECTION's rig; rule
121(l), his 10/19: 'we need all the 2D assets made into 3D assets now').

The alpha draws its 74 outer garments with three functions and their options (read off the bank, never edited):
genCoat (len, the hem as a share of the leg; vest; jacket; split; and the runway's wrap, asym, cocoon and comma, 9/5),
genPoncho (hood) and genApron (bibless). genCoat's own rules, read off its code, are what each shape keeps:
  * a COAT is closed at the collar and open below it down the front (front views only), with a tall closed collar in
    the ramp's dark, a dark inner edge to each lapel, and an A-line skirt flaring from the hip to the hem;
  * SPLIT: a vent up the back from 35 per cent of the skirt, widening to the hem;
  * a VEST has no sleeves and no skirt and hangs fully open (Paolo 7/19: no strap across the chest);
  * a JACKET has sleeves and the open front and stops at the waist on a ribbed band (7/19: a real different garment);
  * WRAP: no opening; one panel crosses the body on a diagonal and a belt holds it;
  * ASYM: the hem on a slant, one side long; COCOON: widest round the body, narrowing to the hem; COMMA: the cocoon's
    hem longer behind than in front, so the profile reads as a comma.
THE NAME SAYS WHAT THE OPTIONS CANNOT (BASE 1's rule): a TRENCH is belted with a double row of buttons, a DUSTER hangs open
with a capelet over the shoulders, a FIELD, CHORE, BARN or WORK coat has patch pockets (a barn coat a dark collar), a
TACTICAL vest carries pouches, a QUILTED vest is stitched in channels, DENIM has chest pockets, LEATHER a zip edge.

    SHAPES (15)   TRENCH, DUSTER, LONGCOAT, SPLIT TAIL | CAR COAT, CHORE COAT, JACKET, VEST | COCOON COAT, COMMA COAT,
                  WRAP COAT, ASYMMETRIC COAT, PONCHO, HOODED PONCHO, APRON, HALF APRON

Each SHAPE is modelled ONCE as clay on the rig's man with THIS LANE's toolkit (tools/bohemia_character_garments_base.py
kit(): cloth cut finer and lifted, ribbons, rings, bands, buttons) and its tube (the coat skirt cut to a pattern, hanging,
never back in, weighted onto each thigh so it parts on the stride); each coat wears its own ramp at the source (BASE 1's
SAT: the rig's dust takes the colour's spread). Built per coat through the barber (build OUTER1 | OUTER1:<names>): the
body here (LOOKS 'O_<tag>' in memory), then PORTRAIT's starred head in the TEMPLE TAPER (a hooded poncho's hood up over
it, BASE 1's hood), then the rig, unedited, standing. The twin: the barber's flat tool with CUTS=OUTER:<name>,...

REUSE CHECK: the man, his lift and tube are THIS LANE's tool; the toolkit and the hood are BASE 1's; the head and the cut
are PORTRAIT's head and the barber's taper; the render is DIRECTION's master rig; nothing is drawn by hand.
REFERENCE CHECK (the 9/4 standing duty): the twin is the game's own flat coat as the body wears it today (buildFrame, eight
facings, 1:1); the runway names (Rick Owens, Balenciaga, Bottega Veneta) for the four runway cuts; analog horror AH-01;
no reference game.
"""
import json
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_garments_base as BASE  # noqa: E402

ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
ROLL = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_ROLL_CALL.json')
RIG_DIR = os.path.join(ROOT, 'records/character/rig')
sstep, slug = BASE.sstep, BASE.slug
HIP_Z, ANKLE_Z = 0.66, 0.09   # the man's hip seam and ankle (this lane's tool): genCoat's len is a share of the leg between


def read_bank():
    """the 74 outer garments in the roll call's order, each with its gen and options and its ramp, off the alpha"""
    src = open(ALPHA).read()
    ramps = {}
    for m in re.finditer(r"\b([A-Z][A-Z0-9_]*)=\{dk:\[(\d+),(\d+),(\d+)\],mid:\[(\d+),(\d+),(\d+)\],lt:\[(\d+),(\d+),(\d+)\][,}]", src):
        v = [int(x) for x in m.groups()[1:]]
        ramps.setdefault(m.group(1), dict(dk=tuple(v[0:3]), mid=tuple(v[3:6]), lt=tuple(v[6:9])))
    names = [r['name'] for r in json.load(open(ROLL))['assets'] if r['kind'] == 'garment' and r.get('slot') == 'outer']
    out = []
    for n in names:
        line = re.search(r"\{n:['\"]" + re.escape(n) + r"['\"][^\n]*", src).group(0)
        g = re.search(r"(genCoat|genPoncho|genApron)\(g,\{ramp:(\w+)([^}]*)\}", line)
        o = dict(re.findall(r"(\w+):('[^']*'|true|false|[\w.]+)", g.group(3)))
        o = {k: (v.strip("'") if v.startswith("'") else (v == 'true') if v in ('true', 'false') else v) for k, v in o.items()}
        G = dict(name=n, tag='outer_' + slug(n).replace("'", ''), fn=g.group(1), ramp=g.group(2),
                 len=float(o.get('len', 0.86)), vest=bool(o.get('vest')), jacket=bool(o.get('jacket')), split=bool(o.get('split')),
                 wrap=bool(o.get('wrap')), asym=bool(o.get('asym')), cocoon=bool(o.get('cocoon')), comma=bool(o.get('comma')),
                 hood=bool(o.get('hood')), bibless=bool(o.get('bibless')), **ramps[g.group(2)])
        w = set(re.split(r"[ \-']", n))
        G['words'] = sorted(w)
        G['shape'] = shape_of(G, w)
        out.append(G)
    return out


def shape_of(G, w):
    if G['fn'] == 'genPoncho': return 'HOODED PONCHO' if G['hood'] else 'PONCHO'
    if G['fn'] == 'genApron': return 'HALF APRON' if G['bibless'] else 'APRON'
    if G['vest']: return 'VEST'
    if G['jacket']: return 'JACKET'
    if G['comma']: return 'COMMA COAT'
    if G['cocoon']: return 'COCOON COAT'
    if G['wrap']: return 'WRAP COAT'
    if G['asym']: return 'ASYMMETRIC COAT'
    if G['split']: return 'SPLIT TAIL'
    if G['len'] <= 0.40: return 'CHORE COAT'
    if G['len'] <= 0.62: return 'CAR COAT'
    if 'TRENCH' in w: return 'TRENCH'
    if 'DUSTER' in w: return 'DUSTER'
    return 'LONGCOAT'


SHAPES = ['TRENCH', 'DUSTER', 'LONGCOAT', 'SPLIT TAIL', 'CAR COAT', 'CHORE COAT', 'JACKET', 'VEST', 'COCOON COAT', 'COMMA COAT',
          'WRAP COAT', 'ASYMMETRIC COAT', 'PONCHO', 'HOODED PONCHO', 'APRON', 'HALF APRON']
BANK = read_bank()
BY = {G['name']: G for G in BANK}
CUTS = {}
for _G in BANK:
    CUTS['OUTER ' + _G['name']] = dict(tag=_G['tag'], garment=_G['name'], body='records/character/rig/o_%s.glb' % _G['tag'][6:],
                                       as_cut='TEMPLE TAPER', bank=dict(ramp='H_BLK', vol=0, side=0.40, front=0.16, fade=4),
                                       hair=('cloth_black', 0), zcap=0.3, worn_by='the roll call: ' + _G['name'])
ORDER = ['OUTER ' + G['name'] for G in sorted(BANK, key=lambda G: (SHAPES.index(G['shape']), G['name']))]
PARTS = [('THE LONG COATS', 'character-outer-one-the-long-coats-10-20', ['TRENCH', 'DUSTER', 'LONGCOAT', 'SPLIT TAIL']),
         ('THE SHORT ONES', 'character-outer-one-the-short-ones-10-20', ['CAR COAT', 'CHORE COAT', 'JACKET', 'VEST']),
         ('THE RUNWAY AND THE WORK CLOTHES', 'character-outer-one-the-runway-and-the-work-clothes-10-20',
          ['COCOON COAT', 'COMMA COAT', 'WRAP COAT', 'ASYMMETRIC COAT', 'PONCHO', 'HOODED PONCHO', 'APRON', 'HALF APRON'])]


def pick(arg):
    """OUTER1:<name>,<name> (or tags, or shape names) -> the cuts"""
    want = [w.strip().upper() for w in arg.split(':', 1)[1].split(',')]
    return [c for c in ORDER if CUTS[c]['garment'] in want or CUTS[c]['tag'].upper() in want or BY[CUTS[c]['garment']]['shape'] in want]


def hem_z(G):
    """genCoat's hem: len is a share of the leg from the hip down to the ankle"""
    return HIP_Z - G['len'] * (HIP_Z - ANKLE_Z)


def body(cut):
    """the mannequin in this coat: THIS LANE's tool builds LOOKS 'O_<tag>' (in memory) to records/character/rig/o_<tag>.glb"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    G = BASE.at_source(BY[CUTS[cut]['garment']])
    L = dict(CH.LOOKS['Body']); L = {k: (dict(v) if isinstance(v, dict) else v) for k, v in L.items()}
    L['worn'] = dict(L['worn'], outer=G['name'], feet='WRAPPED BOOTS')
    L['shoes'] = dict(colour=(54, 52, 54), kind='boot', top=0.20)   # the barber's WRAPPED BOOTS (BARBER_BODY)
    L['hair'] = dict(style='taper', colour=CH.HAIR_DARK); L['order'] = 101
    L['shape'] = 'the barber\'s mannequin in %s (%s)' % (G['name'], G['shape'])
    L.pop('coat', None)
    L['extra'] = lambda X, G=G: pieces(G, X)
    name = 'O_' + G['tag'][6:]
    CH.LOOKS[name] = L
    CH.build(name, RIG_DIR)


def pieces(G, X):
    """the coat on the man (called inside THIS LANE's build with its locals), on BASE 1's toolkit; returns the pieces"""
    K_ = BASE.kit(X)
    V, M, Mi, body, sc, tag = K_['V'], K_['M'], K_['Mi'], K_['body'], K_['sc'], K_['tag']
    arm_s, cloth, strip, band, buttons, front, surf = K_['arm_s'], K_['cloth'], K_['strip'], K_['band'], K_['buttons'], K_['front'], K_['surf']
    neck_ring, waist_ring, arm_ring, new_obj, finish = K_['neck_ring'], K_['waist_ring'], K_['arm_ring'], K_['new_obj'], K_['finish']
    tube, section, mat, bmesh = X['tube'], X['section'], X['mat'], X['bmesh']
    mid, dk, lt = G['mid'], G['dk'], G['lt']
    S = G['shape']; w = set(G['words'])
    made = []

    vest = S == 'VEST'; jacket = S == 'JACKET'; poncho = S in ('PONCHO', 'HOODED PONCHO'); apron = S in ('APRON', 'HALF APRON')
    runway = S in ('COCOON COAT', 'COMMA COAT', 'WRAP COAT', 'ASYMMETRIC COAT')
    skirt = not (vest or jacket or poncho or apron)
    closed = S == 'WRAP COAT'
    hem = hem_z(G)
    weight = 0.016 if ('QUILTED' in w or S in ('COCOON COAT', 'COMMA COAT')) else 0.010 if 'LEATHER' in w else 0.013
    # the opening's half width down the front: a coat's narrow slit, a duster hanging open, a vest fully open
    ohw = 0.060 if S == 'DUSTER' else 0.050 if vest else 0.042 if jacket else 0.036
    collar_z = 1.115 if vest else 1.040   # the coat is closed above this (genCoat: three rows at the collar), a vest never
    cy_f = section(1.0, ('torso',))['cy']

    def opening(c):
        return (not closed) and c.y < cy_f and abs(c.x) < ohw * (1.0 + 0.35 * sstep(1.04, 0.70, c.z)) and c.z < collar_z

    # 1. THE COAT'S BODY AND SLEEVES, cut finer and lifted by the cloth's weight
    if not (poncho or apron):
        def keep(fm, c):
            if fm == 'neck': return (not vest) and c.z < 1.150
            if fm in ('upper', 'fore'): return (not vest) and arm_s(fm, c) <= 1.93
            if fm != 'torso': return False
            if vest and abs(c.x) > 0.085 and c.z > 0.94: return False                       # the armholes
            if opening(c): return False
            return c.z > (0.665 if jacket else 0.62)
        def thick(p):
            t = weight
            q = V((abs(p.x), p.y, p.z))
            if S in ('COCOON COAT', 'COMMA COAT'):   # the cocoon's dome: one curve from the neck over the shoulder, widest at the top
                sp = (q - K_['SH']).dot((K_['EL'] - K_['SH']).normalized()) / (K_['EL'] - K_['SH']).length
                t += 0.030 * math.exp(-((sp - 0.10) / 0.45) ** 2) * sstep(0.04, 0.10, q.x) * sstep(0.88, 1.02, p.z)
                t += 0.022 * sstep(0.70, 0.95, p.z) * sstep(1.08, 0.98, p.z)                     # the body blown out round the chest
            if 'QUILTED' in w:   # stitched channels across the body, 7 cm apart
                t -= 0.004 * max(0.0, math.cos(2 * math.pi * p.z / 0.07)) ** 6
            return t
        made.append(cloth('coat', keep, thick, mid, rim=0.006))

    # 2. THE SKIRT: the man's measured section from the hip down to the hem, offset by the cloth and its flare, cut to the
    # pattern (the open front, the vent, the slant, the comma), hanging
    if skirt:
        # cycle 2 (looking, SOOT TRENCH): 6 cm of flare on a coat to the calf read as a bell from the back; a trench falls straight
        flare = 0.070 if S == 'DUSTER' else 0.035 if hem < 0.25 else 0.030 if hem < 0.40 else 0.022
        def hem_a(a):
            h = hem
            if S == 'ASYMMETRIC COAT': h += 0.16 * sstep(-0.6, 0.6, math.cos(a))                # long on his right, high on his left
            if S == 'COMMA COAT': h -= 0.12 * (0.5 + 0.5 * math.sin(a))                         # longer behind than in front
            if S == 'DUSTER': h += 0.008 * math.sin(11 * a + 0.4) * math.cos(4 * a)             # the hem worn ragged
            return h
        fo = {'DUSTER': 0.80, 'TRENCH': 0.30, 'LONGCOAT': 0.36, 'SPLIT TAIL': 0.40, 'CAR COAT': 0.34, 'CHORE COAT': 0.34,
              'COCOON COAT': 0.30, 'COMMA COAT': 0.30, 'ASYMMETRIC COAT': 0.34}.get(S, 0.0)
        vent_z = 0.72 - 0.35 * (0.72 - hem) if S == 'SPLIT TAIL' else -1.0
        def ok(a, z):
            if fo and abs(a - 1.5 * math.pi) < fo * 0.5: return False                          # the open front
            if z < vent_z and abs(a - 0.5 * math.pi) < 0.035 + 0.30 * sstep(vent_z, hem, z): return False   # the vent
            return True
        def off(z):
            if S in ('COCOON COAT', 'COMMA COAT'):   # widest at the hip, narrowing to the hem: the A-line turned over
                return weight + 0.040 - 0.032 * sstep(0.70, hem, z)
            return weight + 0.010 + flare * sstep(0.68, hem, z)
        made.append(tube('coat_skirt', 0.72, hem_a, off, mid, ang_ok=ok, thick=0.012))

    # 3. THE COLLAR AND THE LAPELS
    if not (vest or poncho or apron):
        tall = 0.034 if S in ('LONGCOAT', 'TRENCH', 'DUSTER', 'SPLIT TAIL', 'CAR COAT') else 0.024
        made.append(band('collar', [neck_ring(lambda c: 1.150 + 0.012 * (c.y > -0.02), weight + 0.004)], tall, 0.011,
                         dk if (S == 'CHORE COAT' and 'BARN' in w) or not runway else mid))
    if not (closed or poncho or apron):
        edge = [[front(sx * ohw * (1.0 + 0.35 * sstep(1.04, 0.70, z)), z) for z in (collar_z, 0.98, 0.90, 0.82, 0.74, 0.67)] for sx in (-1, 1)]
        made.append(strip('lapels', edge, 0.016 if not vest else 0.012, weight + 0.004, dk))
    if 'LEATHER' in w and (jacket or vest):   # the zip's two dark teeth down the opening's edges
        made.append(strip('zip', [[front(sx * (ohw - 0.004), z) for z in (collar_z, 0.95, 0.85, 0.75, 0.68)] for sx in (-1, 1)], 0.006, weight + 0.007, dk))

    # 4. THE JACKET'S BAND AND CUFFS, THE TRENCH'S BELT AND BUTTONS, THE WRAP'S DIAGONAL AND BELT
    if jacket:
        made.append(band('waistband', [waist_ring(0.690, weight + 0.006)], 0.045, 0.010, dk, groove=lambda a: 0.0012 * max(0.0, math.cos(80 * a)) ** 2))
    if jacket or S in ('CHORE COAT', 'CAR COAT', 'TRENCH'):
        made += [band('cuffs', arm_ring(1.90, weight + 0.004), 0.030, 0.008, dk)]
    if S in ('TRENCH', 'WRAP COAT'):
        made.append(band('belt', [waist_ring(0.700, weight + 0.008)], 0.038, 0.010, dk))
    if S == 'TRENCH':
        made.append(buttons('buttons', [front(sx * 0.058, z) for sx in (-1, 1) for z in (1.01, 0.93, 0.85)], dk, r=0.0065, lift_=weight + 0.008))
    if S == 'WRAP COAT':   # the crossing panel's edge, the left shoulder to the right hip, and the tie's knot at the side
        made.append(strip('wrap_edge', [[front(0.065 - 0.15 * t, 1.10 - 0.40 * t) for t in (0.0, 0.2, 0.4, 0.6, 0.8, 1.0)]], 0.020, weight + 0.006, dk))
        made.append(buttons('knot', [front(-0.105, 0.70), front(-0.118, 0.67)], dk, r=0.014, lift_=weight + 0.012))

    # 5. POCKETS, POUCHES AND THE DUSTER'S CAPELET (what the name says)
    def patch(key, centres, wd, ht, colour, th):
        """rectangular patches laid on the man: each a ribbon of height ht centred at (x, z), wd across"""
        return strip(key, [[front(x, z + ht * (0.5 - t)) for t in (0.0, 0.33, 0.66, 1.0)] for x, z in centres], wd, th, colour)
    if S in ('CHORE COAT', 'CAR COAT', 'LONGCOAT', 'SPLIT TAIL') or 'FIELD' in w or 'WORK' in w:
        made.append(patch('pockets', [(sx * 0.105, 0.73) for sx in (-1, 1)], 0.085, 0.080, mid, weight + 0.010))
        made.append(patch('pocket_flaps', [(sx * 0.105, 0.775) for sx in (-1, 1)], 0.090, 0.022, dk, weight + 0.014))
    if 'FIELD' in w or 'DENIM' in w:   # two chest pockets with flaps
        made.append(patch('chest_pockets', [(sx * 0.080, 0.985) for sx in (-1, 1)], 0.060, 0.065, mid, weight + 0.008))
        made.append(patch('chest_flaps', [(sx * 0.080, 1.020) for sx in (-1, 1)], 0.064, 0.018, dk, weight + 0.012))
    if 'TACTICAL' in w:   # three pouches across the chest, the radio on the left
        made.append(patch('pouches', [(-0.090, 0.900), (-0.032, 0.895), (0.040, 0.900), (0.092, 0.98)], 0.050, 0.070, dk, weight + 0.022))
    if S == 'DUSTER':   # the capelet over the shoulders, its edge free and thicker
        def keepc(fm, c): return (fm in ('torso', 'upper') and c.z > 0.935) and not (c.y < cy_f and abs(c.x) < ohw * 0.7)
        made.append(cloth('capelet', keepc, lambda p: weight + 0.020 + 0.022 * sstep(1.08, 0.94, p.z), mid, rim=0.006, fams=('torso', 'upper')))

    # 6. THE PONCHO: one blanket hung from the shoulders over the arms to the hip, a neck hole, the hem fringed, two bands.
    # Cycle 2 (looking, DUST PONCHO): cut as the skirt's tube, its section took in the hanging arms and the hang rule never
    # let it narrow, so it read as a cake 1 m across. It is cut here to its own pattern: a ring at the neck hole, out over the
    # shoulders to just past the arms, then falling straight (a square of cloth, fuller at the corners), rigid on the chest.
    if poncho:
        bm = bmesh.new(); segs = 64
        s_sh = section(1.02, ('torso', 'upper')); sh = s_sh['rx'] + 0.035
        cyc = section(1.00, ('torso',))['cy']
        # cycle 3 (looking): a level hem and a 10 cm shoulder read as a box; the game's poncho hangs to a point in front, so
        # the hem falls to a point front and back (a diamond of cloth), and the shoulder slopes from the neck to past the arm
        hem_p = lambda a: 0.640 + 0.010 * math.sin(17 * a) - 0.120 * abs(math.sin(a)) ** 2.5
        zs = [1.125 - 0.012 * i for i in range(70)]
        rows = []
        for z in zs:
            row = []
            for i in range(segs):
                a = 2 * math.pi * i / segs; hz = hem_p(a); zz = max(z, hz)
                sec = section(max(zz, 0.70), ('torso',)) or s_sh
                t = sstep(1.115, 0.930, zz) ** 0.7               # 0 at the neck hole, 1 once over the shoulders: a slope, not a ledge
                X_ = 0.078 + (sh - 0.078) * t + 0.035 * sstep(1.0, 0.62, zz)
                F_ = 0.078 + (max(sec['front'], 0.11) + 0.040 - 0.078) * t
                B_ = 0.078 + (max(sec['back'], 0.10) + 0.040 - 0.078) * t
                ca, sa = math.cos(a), math.sin(a)
                ex = 2.0 / 3.0                                     # a superellipse: a square of cloth, fuller at the corners
                xx = X_ * math.copysign(abs(ca) ** ex, ca); yy = (B_ if sa > 0 else F_) * math.copysign(abs(sa) ** ex, sa)
                row.append(bm.verts.new(V((xx, cyc + yy, zz))))
            rows.append(row)
        for j in range(len(rows) - 1):
            for i in range(segs):
                bm.faces.new((rows[j][i], rows[j][(i + 1) % segs], rows[j + 1][(i + 1) % segs], rows[j + 1][i]))
        bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.calc_area() < 1e-9], context='FACES')
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
        for v in bm.verts: v.co = Mi @ v.co
        me = X['bpy'].data.meshes.new('%s_poncho' % tag); bm.to_mesh(me); bm.free()
        g = X['bpy'].data.objects.new('%s_poncho' % tag, me); sc.collection.objects.link(g)
        g.parent = body.parent; g.matrix_world = M
        arm_ = X['arm']; full = lambda bn: next(b.name for b in arm_.data.bones if b.name.endswith(bn) or b.name == bn)
        vg_up = g.vertex_groups.new(name=full('torso_joint_3')); vg_lo = g.vertex_groups.new(name=full('Skeleton_torso_joint_2'))
        for v in me.vertices:
            t = sstep(0.80, 1.00, (M @ v.co).z); vg_up.add([v.index], t, 'REPLACE'); vg_lo.add([v.index], 1.0 - t, 'REPLACE')
        g = X['finish'](g, mid, 'poncho', 1, 0.012)
        # the woven bands: two stripes of the ramp's light, painted on the blanket's own faces above the hem
        g.data.materials.append(mat('poncho_band', lt)); bi = len(g.data.materials) - 1
        for f in g.data.polygons:
            z = (M @ f.center).z
            if 0.665 < z < 0.690 or 0.710 < z < 0.722: f.material_index = bi
        made.append(g)
        made.append(band('poncho_neck', [neck_ring(lambda c: 1.118, 0.016)], 0.024, 0.012, dk))

    # 7. THE APRON: a panel down the front on a strap round the neck and ties at the waist (a smith's is heavy leather, riveted)
    if apron:
        heavy = 'SMITH' in w or 'LEATHER' in w
        top_z = 0.72 if S == 'HALF APRON' else 1.07
        def ap_ok(a, z):
            half = 0.62 if z > 0.74 else 1.05
            return abs(a - 1.5 * math.pi) < half
        def apw(z, a):
            if z > 0.80: return {'torso_joint_3': 1.0}
            legs = sstep(0.70, 0.50, z); return {'Skeleton_torso_joint_1': 1 - legs, 'leg_joint_L_1': legs * 0.5, 'leg_joint_R_1': legs * 0.5}
        made.append(tube('apron', top_z, lambda a: 0.36, lambda z: 0.010 + 0.006 * heavy + 0.015 * sstep(0.68, 0.36, z), mid,
                         ang_ok=ap_ok, fams=('torso', 'thigh'), thick=0.010 if heavy else 0.006, wfn=apw))
        made.append(band('apron_ties', [waist_ring(0.700, 0.016)], 0.016, 0.005, dk))
        if S == 'APRON':
            made.append(band('apron_strap', [neck_ring(lambda c: 1.105, 0.012)], 0.016, 0.005, dk))
            if heavy: made.append(buttons('rivets', [front(sx * 0.072, z) for sx in (-1, 1) for z in (1.04, 0.71)], lt, r=0.0045, lift_=0.028))
    return made


def record():
    out = dict(what='CHARACTER [every old asset into the new look], GARMENTS OUTER: the 74 canon coats, the options read off the alpha',
               shapes={s: [G['name'] for G in BANK if G['shape'] == s] for s in SHAPES},
               coats=[dict(name=G['name'], tag=G['tag'], fn=G['fn'], ramp=G['ramp'], shape=G['shape'], len=G['len'], hem_z=round(hem_z(G), 3),
                           options=[k for k in ('vest', 'jacket', 'split', 'wrap', 'asym', 'cocoon', 'comma', 'hood', 'bibless') if G[k]])
                      for G in BANK])
    p = os.path.join(ROOT, 'records/target/character/BOHEMIA_GARMENTS_OUTER_ONE.json')
    json.dump(out, open(p, 'w'), indent=1)
    print('wrote', os.path.relpath(p, ROOT), {s: len(v) for s, v in out['shapes'].items()})


if __name__ == '__main__':
    record()
