#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look], GARMENTS LEGS AND FEET: THE 45 CANON TROUSERS AND THE 40 CANON
SHOES ON THE 3D MAN (the roll call's sixth and seventh batches; rule 115c: modelled at the source and rendered through
DIRECTION's rig; rule 121(i): 'so many of the same hats and shit on the characters... the clay people have like 2 options';
rule 121(l): 'we need all the 2D assets made into 3D assets now'; rule 123: no card, straight into the game).

THE GAP, MEASURED (10/23): RUN TWO [no two people alike] rolls each person's cut, hair, face, beard, mark, hat, face piece,
top and coat from this lane's book, but every man of a gang still stood in his gang's ONE pair of trousers and ONE pair
of shoes, because the game's 45 trousers and 40 shoes were drawn flat (genPants, genShoes) and nothing on the 3D man.

The alpha draws its legs with genPants and its options, and its feet with genShoes (and genPants' column, which sits in
the feet slot), read off the bank, never edited. genPants' own rules, read off its code, are what each cut keeps:
  * the plain leg ends on a ROLLED HEM in the ramp's light;
  * SHORT ends at 0.42 of the leg (above the knee), a dark hem, bare shins below;
  * SKIRT is one wrapped panel over both legs to mid-shin (0.72 of the leg), the gap between the legs closed, a diagonal
    overlap fold across the front on a 6-pixel pitch; LONGSKIRT falls to the ankle;
  * DROP: one yoke over both legs from the waist to 0.58 of the leg, then the legs come back narrow, the ankle closed;
  * WIDE: high-waisted, the leg opening all the way to the floor, pleated on a 4-pixel pitch;
  * STACK: cut longer than the leg, pooling over the boot, hard fold bands in the bottom third, past the ankle at the sides;
  * CROP: a straight tube that stops at 0.68 of the leg with a two-cell turn-up, a band of shin over the shoe;
  * COLUMN (the feet slot): one constant-width mass per leg from the thigh over the foot, no ankle break, the inner seam kept.
genShoes: a dark sole, a light midsole, laces on the tongue (low shoes only, a boot is smooth leather), a heel counter and
one seam behind; SHAFT 'mid' four rows of shin, 'tall' seven, 'slouch' a tall shaft collapsed in creases and cut higher
on one side; SOLE 'stack' a thick sole that lifts the shoe and overhangs the foot.
THE NAME SAYS WHAT THE OPTIONS CANNOT (BASE 1's rule): JEANS and DENIM carry a fly, the front pockets and two on the seat;
CARGOS a bellows pocket with a flap on each outer thigh; SWEATS a gathered ribbed cuff; WORK PANTS a double knee and a
hammer loop, PATCHED ones patches; TROUSERS a pressed crease; a PLEAT trouser deeper pleats; SNEAKERS are low and laced
on a white midsole; SANDWALKERS are sandals on straps (the Caravans' own, voted up on the thirteen).

Each SHAPE is modelled once as clay on the rig's man with BASE 1's toolkit (kit(): cloth cut finer and lifted, strips,
bands, rings) and this lane's tube (the skirt and the yoke), each piece in its own ramp at the source (BASE 1's SAT).

TWO WAYS IN:
  * THE MANNEQUIN (the record): build LEGS1 | FEET1 | LEGS1:<names> | FEET1:<names> through the barber, the body here
    (LOOKS 'P_<tag>' in memory), PORTRAIT's starred head in the taper, the rig unedited, standing.
  * A PERSON (the game, rule 123(c)): the barber's book rolls a pair of trousers and a pair of shoes for every person
    inside his gang's colours (roll_wear(), its own random stream, so every other draw of a roll is unchanged), and the
    barber's person build dresses him in them (dress(): this lane's body tool reads the look's trousers and shoes, then
    this file's pieces ride its extra() hook after the top and the coat). RUN TWO's roll and build read both, unedited.

REUSE CHECK: the man, his lift, tube, section and stand pose are THIS LANE's tool; the toolkit is BASE 1's; the head is
PORTRAIT's; the render is DIRECTION's master rig; nothing is drawn by hand.
REFERENCE CHECK (the 9/4 standing duty): the twin is the game's own flat trouser and shoe as the body wears them today
(buildFrame); the runway names (Rick Owens, Balenciaga, Bottega Veneta) for the drop, the stack, the column and the slouch;
analog horror AH-01; no reference game.
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

ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
ROLL = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_ROLL_CALL.json')
RIG_DIR = os.path.join(ROOT, 'records/character/rig')
sstep, slug = BASE.sstep, BASE.slug
# the man's leg, measured off the rig's body (10/23): the hip seam 0.66, the knee joint 0.352, the ankle joint 0.086, the
# sole 0.0, the toe at y -0.178 and the heel at +0.080; genPants measures every cut as a share of the leg from hip to ankle
HIP_Z, KNEE_Z, ANKLE_Z = 0.66, 0.352, 0.09
LEG = HIP_Z - ANKLE_Z


def at_leg(t):
    """genPants' share of the leg (0 at the hip, 1 at the ankle) as a height in metres"""
    return HIP_Z - t * LEG


def read_bank(slot):
    """the canon garments of one slot in the roll call's order, each with its gen and options and its ramp, off the alpha"""
    src = open(ALPHA).read()
    ramps = {}
    for m in re.finditer(r"\b([A-Z][A-Z0-9_]*)=\{dk:\[(\d+),(\d+),(\d+)\],mid:\[(\d+),(\d+),(\d+)\],lt:\[(\d+),(\d+),(\d+)\]"
                         r"(?:,sole:\[(\d+),(\d+),(\d+)\])?[,}]", src):
        v = [int(x) if x else None for x in m.groups()[1:]]
        ramps.setdefault(m.group(1), dict(dk=tuple(v[0:3]), mid=tuple(v[3:6]), lt=tuple(v[6:9]),
                                          sole=tuple(v[9:12]) if v[9] is not None else None))
    names = [r['name'] for r in json.load(open(ROLL))['assets']
             if r['kind'] == 'garment' and r.get('slot') == slot and r.get('old') == 'canon']
    out = []
    for n in names:
        line = re.search(r"\{n:['\"]" + re.escape(n) + r"['\"][^\n]*", src).group(0)
        g = re.search(r"(genPants|genShoes)\(g,\{ramp:(\w+)([^}]*)\}", line)
        o = dict(re.findall(r"(\w+):'([^']*)'", g.group(3)))
        R = dict(ramps[g.group(2)])
        if not R['sole']: R['sole'] = R['dk']   # genShoes' own fallback: soleC = r.sole || r.dk
        G = dict(name=n, slot=slot, tag='%s_%s' % (slot, slug(n).replace("'", '')), fn=g.group(1), ramp=g.group(2),
                 cut=o.get('cut'), shaft=o.get('shaft'), sole_kind=o.get('sole'), **R)
        G['words'] = sorted(set(re.split(r"[ \-']", n)))
        G['shape'] = legs_shape(G) if slot == 'legs' else feet_shape(G)
        out.append(G)
    return out


def legs_shape(G):
    c, w = G['cut'], set(G['words'])
    if c == 'short': return 'SHORTS'
    if c == 'skirt': return 'WRAP SKIRT'
    if c == 'longskirt': return 'ANKLE SKIRT'
    if c in ('drop', 'wide', 'stack', 'crop'): return {'drop': 'DROP RISE', 'wide': 'WIDE LEG', 'stack': 'STACKED', 'crop': 'CROPPED'}[c]
    if w & {'JEANS', 'DENIM'}: return 'JEANS'
    if 'CARGOS' in w: return 'CARGOS'
    if 'SWEATS' in w: return 'SWEATS'
    if 'WORK' in w: return 'WORK PANTS'
    return 'TROUSERS'


def feet_shape(G):
    w = set(G['words'])
    if G['fn'] == 'genPants': return 'COLUMN'
    if 'SANDWALKERS' in w: return 'SANDALS'
    if 'SNEAKERS' in w: return 'SNEAKERS'
    if G['shaft'] == 'slouch': return 'SLOUCH BOOT'
    if G['shaft'] == 'tall': return 'TALL BOOT'
    if G['shaft'] == 'mid': return 'STACKED MID BOOT' if G['sole_kind'] == 'stack' else 'MID BOOT'
    if G['sole_kind'] == 'stack': return 'STACK BOOT'
    return 'BOOT'


LEG_SHAPES = ['TROUSERS', 'JEANS', 'CARGOS', 'WORK PANTS', 'SWEATS', 'SHORTS', 'CROPPED', 'WIDE LEG', 'DROP RISE', 'STACKED',
              'WRAP SKIRT', 'ANKLE SKIRT']
FEET_SHAPES = ['SNEAKERS', 'BOOT', 'MID BOOT', 'TALL BOOT', 'SLOUCH BOOT', 'STACK BOOT', 'STACKED MID BOOT', 'SANDALS', 'COLUMN']
LEGS = read_bank('legs')
FEET = read_bank('feet')
BY = {G['name']: G for G in LEGS + FEET}
SKIRTS = ('WRAP SKIRT', 'ANKLE SKIRT')
# a piece that failed this lane's own look at it on the 3D man stays out of the roll until it is fixed (name -> why)
HELD = {}
# THE SHOE THE BODY TOOL MAKES (its lift over the foot and the shin below `top`): the kind and the shaft's top in metres.
# genShoes' rows read on the 3D man: an ankle shoe two rows (to 0.11, the ankle's top), a boot's collar 0.16, a mid shaft
# four rows (0.22), a tall shaft seven (0.38, just past the knee joint's 0.352 as a knee boot stands), a stacked sole two
# rows more (+0.03)
SHOE = {'SNEAKERS': ('sneaker', 0.11), 'BOOT': ('boot', 0.16), 'MID BOOT': ('boot', 0.22), 'TALL BOOT': ('boot', 0.38),
        'SLOUCH BOOT': ('boot', 0.34), 'STACK BOOT': ('boot', 0.19), 'STACKED MID BOOT': ('boot', 0.25), 'SANDALS': ('sandal', 0.07),
        'COLUMN': ('boot', 0.0)}
# the trouser's hem and the shin it leaves bare (the body tool's crop paints the shin under it skin)
HEM = {'SHORTS': at_leg(0.42), 'CROPPED': at_leg(0.68), 'WRAP SKIRT': at_leg(0.72), 'ANKLE SKIRT': 0.105}


# ---- the mannequin (the record) -----------------------------------------------------------------------------------
LEGS_HAIR = ('tape_masking', 1)   # OUTER 1's sand taper (its measured finding: the guide's light row reads the garment, not
# PORTRAIT's black crown); the top half is the man's black tank, as on every garment card
CUTS = {}
for _G in LEGS + FEET:
    CUTS[('LEGS ' if _G['slot'] == 'legs' else 'FEET ') + _G['name']] = dict(
        tag=_G['tag'], garment=_G['name'], body='records/character/rig/p_%s.glb' % _G['tag'], as_cut='TEMPLE TAPER',
        bank=dict(ramp='H_BLK', vol=0, side=0.40, front=0.16, fade=4), hair=LEGS_HAIR, zcap=1.0, worn_by='the roll call: ' + _G['name'])
ORDER = (['LEGS ' + G['name'] for G in sorted(LEGS, key=lambda G: (LEG_SHAPES.index(G['shape']), G['name']))] +
         ['FEET ' + G['name'] for G in sorted(FEET, key=lambda G: (FEET_SHAPES.index(G['shape']), G['name']))])


def pick(arg):
    """LEGS1:<name>,<name> | FEET1:... (names, tags or shape names) -> the cuts; LEGS1 | FEET1 alone -> the slot"""
    head, _, rest = arg.partition(':')
    pre = 'LEGS ' if head.upper().startswith('LEGS') else 'FEET '
    if not rest: return [c for c in ORDER if c.startswith(pre)]
    want = [w.strip().upper() for w in rest.split(',')]
    return [c for c in ORDER if c.startswith(pre) and (CUTS[c]['garment'] in want or CUTS[c]['tag'].upper() in want or
                                                        BY[CUTS[c]['garment']]['shape'] in want)]


def body(cut):
    """the mannequin in this garment: THIS LANE's body tool builds LOOKS 'P_<tag>' (in memory) to records/character/rig/p_<tag>.glb;
    a pair of trousers is shown over the barber's wrapped boots, a pair of shoes under the man's black cargos"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    G = BY[CUTS[cut]['garment']]
    L = dict(CH.LOOKS['Body']); L = {k: (dict(v) if isinstance(v, dict) else v) for k, v in L.items()}
    L['worn'] = dict(L['worn'], feet='WRAPPED BOOTS')
    L['shoes'] = dict(colour=(54, 52, 54), kind='boot', top=0.20)   # the barber's WRAPPED BOOTS (BARBER_BODY)
    L['hair'] = dict(style='taper', colour=CH.HAIR_DARK); L['order'] = 102
    L['shape'] = "the barber's mannequin in %s (%s)" % (G['name'], G['shape'])
    if G['slot'] == 'legs': dress(L, legs=G['name'])
    else: dress(L, legs='BLACK CARGOS', feet=G['name'])
    name = 'P_' + G['tag'].upper()
    CH.LOOKS[name] = L
    CH.build(name, RIG_DIR)


# ---- a person: the roll and the dress --------------------------------------------------------------------------------
def hsv(c):
    import colorsys
    return colorsys.rgb_to_hsv(*[v / 255.0 for v in c])


def near(a, b):
    """two cloths read as one colour on the street (RUN TWO's own test, the same numbers)"""
    ha, sa, va = hsv(a); hb, sb, vb = hsv(b)
    if sa < 0.2 or sb < 0.2:
        return sa < 0.2 and sb < 0.2 and abs(va - vb) < 0.22
    dh = min(abs(ha - hb), 1 - abs(ha - hb))
    return dh < 0.07 and abs(va - vb) < 0.45


def plain(c):
    """a work colour: black, grey, brown, sand, olive, denim, every gang may wear it (most trousers on a real street)"""
    h, s, v = hsv(c)
    return s < 0.30 or (0.05 < h < 0.20 and s < 0.55 and v < 0.62) or (0.55 < h < 0.66 and s < 0.50 and v < 0.62)


def wardrobe_legs(look):
    """the trousers and shoes a man of this look may roll, each with its weight: his gang's own pair and its colours three
    times, the work colours once; a skirt is a runway piece (the Anarchists, the Colorful, the Church) at a third"""
    own = [look[k]['colour'] for k in ('shirt', 'coat', 'mantle', 'cape', 'trousers', 'shoes') if isinstance(look.get(k), dict) and look[k].get('colour')]
    worn = look.get('worn') or {}
    def pool(bank, own_name):
        out = []
        for G in [G for G in bank if G['name'] not in HELD]:
            w = 3.0 if (G['name'] == own_name or any(near(G['mid'], c) for c in own)) else 1.0 if plain(G['mid']) else 0.0
            out.append((G['name'], w))
        return [(n, w) for n, w in out if w > 0]
    legs = pool(LEGS, worn.get('legs')); feet = pool(FEET, worn.get('feet'))
    runway = look.get('runway', False)
    legs = [(n, w * (0.35 if runway else 0.0) if BY[n]['shape'] in SKIRTS else w) for n, w in legs]
    return [x for x in legs if x[1] > 0], feet


RUNWAY_GANGS = ('Anarchists', 'Colorful', 'Church')


def roll_wear(gang, pid):
    """a person's trousers and shoes: their own random stream (the rest of his roll is untouched), his gang's look"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    look = dict(CH.LOOKS.get(gang) or CH.LOOKS['Body'], runway=gang in RUNWAY_GANGS)
    rng = random.Random('%s:%s:legs and feet' % (gang, pid))
    legs, feet = wardrobe_legs(look)
    def draw(items):
        tot = sum(w for _, w in items); x = rng.random() * tot
        for n, w in items:
            x -= w
            if x <= 0: return n
        return items[-1][0]
    lg = draw(legs); ft = draw(feet)
    if BY[lg]['shape'] in SKIRTS and BY[ft]['shape'] == 'COLUMN': ft = draw([x for x in feet if BY[x[0]]['shape'] != 'COLUMN'])
    return dict(legs=lg, feet=ft)


def dress(L, legs=None, feet=None):
    """put a pair of trousers and a pair of shoes on a look (in memory): its trousers and shoes for the body tool, the worn
    names, and this file's pieces after whatever extra() the look already carries (a top's, a coat's)"""
    Gl = BASE.at_source(BY[legs]) if legs else None
    Gf = BASE.at_source(BY[feet]) if feet else None
    L['worn'] = dict(L.get('worn') or {})
    base = L['worn'].get('base')
    if base and base in BASE.BY and BASE.BY[base]['fn'] == 'genCoverall': Gl = None   # a coverall is its own trousers
    if Gf and Gf['shape'] == 'COLUMN': Gl = None   # the column is the leg (the feet slot covers it on its way up)
    if Gl:
        L['trousers'] = dict(colour=Gl['mid'], wide=0.0, crop=HEM.get(Gl['shape'], 0.0)); L['worn']['legs'] = Gl['name']
    if Gf:
        kind, top = SHOE[Gf['shape']]
        L['shoes'] = dict(colour=Gf['mid'], kind=kind, top=top); L['worn']['feet'] = Gf['name']
        if Gf['shape'] == 'COLUMN':
            L['trousers'] = dict(colour=Gf['mid'], wide=0.0, crop=0.0); L['worn'].pop('legs', None)
    old = L.get('extra')
    L['extra'] = lambda X, Gl=Gl, Gf=Gf, old=old: ((old(X) or []) if old else []) + pieces(Gl, Gf, X)
    return L


# ---- the pieces on the man (inside THIS LANE's body build, with its locals) ---------------------------------------------
def pieces(Gl, Gf, X):
    if not (Gl or Gf): return []
    K_ = BASE.kit(X)
    V, M, body, P, fam_v, ffam = K_['V'], K_['M'], K_['body'], K_['P'], K_['fam_v'], K_['ffam']
    cloth, strip, band, ring_pts, surf, new_obj, finish = K_['cloth'], K_['strip'], K_['band'], K_['ring_pts'], K_['surf'], K_['new_obj'], K_['finish']
    bvh = K_['bvh']; bmesh = X['bmesh']; tube, section, mat = X['tube'], X['section'], X['mat']
    made = []

    def leg_c(z, sx):
        """the centre of his left (sx +1) or right leg at height z, off the man's own vertices"""
        pts = [p for p, fm in zip(P, fam_v) if fm in ('thigh', 'shin', 'foot') and p.x * sx > 0 and abs(p.z - z) < 0.03]
        if not pts: return V((sx * 0.08, -0.02, z))
        return V((sum(p.x for p in pts) / len(pts), sum(p.y for p in pts) / len(pts), z))

    def leg_rings(z, off):
        return [ring_pts(leg_c(z, sx), V((1, 0, 0)), V((0, -1, 0)), n=32, off=off) for sx in (1, -1)]

    def side(sx, y, z):
        """his outer thigh: the surface met coming in from his left (sx +1) or right"""
        hit = bvh.ray_cast(V((sx * 0.6, y, z)), V((-sx, 0, 0)), 1.2)
        return hit[0] if hit[0] else V((sx * 0.12, y, z))

    def front(x, z, s=-1):
        return K_['front'](x, z, s)

    def paint(g, colour, key, pred):
        """a second colour on a piece's own faces (a fold, a band): the faces whose world centre passes pred"""
        if g is None: return g
        g.data.materials.append(mat(key, colour)); i = len(g.data.materials) - 1
        Mg = g.matrix_world
        for f in g.data.polygons:
            if pred(Mg @ f.center): f.material_index = i
        return g

    def patch(key, centres, wd, ht, colour, th, s=-1):
        return strip(key, [[front(x, z + ht * (0.5 - t), s) for t in (0.0, 0.33, 0.66, 1.0)] for x, z in centres], wd, th, colour)

    # ---- 1. THE TROUSERS ------------------------------------------------------------------------------------------------
    if Gl:
        S = Gl['shape']; w = set(Gl['words']); mid, dk, lt = Gl['mid'], Gl['dk'], Gl['lt']
        hem = HEM.get(S, ANKLE_Z + 0.025)
        weight = {'SWEATS': 0.011, 'WIDE LEG': 0.009, 'DROP RISE': 0.009, 'STACKED': 0.010}.get(S, 0.008 if w & {'JEANS', 'DENIM', 'CARGOS', 'WORK'} else 0.007)
        # THE MAN'S OWN LEGS REPAINTED: the trouser where it covers him, skin under a short hem (the body tool's crop
        # reaches only the shin; shorts end on the thigh), the seat the trouser's colour under a short top
        for f in body.data.polygons:
            fm = ffam(f); c = M @ f.center
            if fm in ('thigh', 'shin'): f.material_index = 2 if c.z >= hem or S not in HEM else 0
            if fm == 'torso' and c.z < 0.615 and f.material_index == 1: f.material_index = 2
        body.data.update()
        frayed = 'CUTOFF' in w
        def hem_at(c):
            return hem + (0.010 * (0.5 + 0.5 * math.sin(41 * c.x + 3.0) * math.cos(37 * c.y)) if frayed else 0.0)
        def keep(fm, c):
            if fm == 'torso': return c.z < 0.665
            if fm in ('thigh', 'shin'): return c.z > hem_at(c)
            return False
        def thick(p):
            # thin at the waist so the top's hem lies over it (a top's cloth stands 5 to 11 mm off him)
            t = weight * (0.45 + 0.55 * sstep(0.655, 0.600, p.z))
            if S == 'WIDE LEG':   # opens from the hip all the way to the floor; pleats down the front
                t += 0.034 * sstep(0.58, 0.10, p.z)
                if p.y < -0.03: t -= (0.006 if 'PLEAT' in w else 0.004) * max(0.0, math.cos(2 * math.pi * (abs(p.x) - 0.078) / 0.038)) ** 6
            elif S == 'DROP RISE':   # the legs come back narrow under the yoke and close at the ankle
                t -= 0.003 * sstep(0.30, 0.12, p.z)
            elif S == 'STACKED':     # the pool over the boot: fuller, and hard fold bands every 4 cm in the bottom third
                t += 0.016 * sstep(0.30, 0.10, p.z) + 0.006 * sstep(0.30, 0.20, p.z) * max(0.0, math.cos(2 * math.pi * p.z / 0.040)) ** 2
            elif S == 'SWEATS':      # loose over the shin, gathered into the cuff
                t += 0.008 * sstep(0.40, 0.20, p.z) * sstep(0.105, 0.15, p.z)
            elif S == 'CROPPED':     # a straight tube, not tapered
                t += 0.004 * sstep(0.45, 0.30, p.z)
            elif S == 'SHORTS':
                t += 0.004 * sstep(0.55, hem, p.z)
            return t
        def shift(p):
            # the wide leg and the stack fall past the ankle over the shoe; the plain leg breaks on the shoe's top
            if S in ('WIDE LEG', 'STACKED'): return V((0, 0, -0.050 * sstep(0.22, 0.09, p.z)))
            if S not in HEM: return V((0, 0, -0.012 * sstep(0.16, 0.09, p.z)))
            return V((0, 0, 0))
        if S not in SKIRTS:
            g = cloth('trouser', keep, thick, mid, rim=0.005, levels=2, fams=('torso', 'thigh', 'shin'), shift=shift)
            if S == 'STACKED':   # the pooled folds in the ramp's dark, two cells each (genPants' looking fix)
                g = paint(g, dk, 'trouser_folds', lambda c: c.z < 0.28 and (int((0.28 - c.z) / 0.024) % 2 == 1))
            made.append(g)
        # THE YOKE (the drop rise): one panel over both legs from the waist to 0.58 of the leg, the gap closed, draped
        if S == 'DROP RISE':
            low = at_leg(0.58)
            def yoke_ok(a, z): return True
            g = tube('drop_yoke', 0.660, lambda a: low + 0.012 * math.sin(3 * a), lambda z: weight + 0.006 + 0.016 * sstep(0.62, low + 0.05, z),
                     mid, ang_ok=yoke_ok, fams=('torso', 'thigh'), thick=0.010)
            made.append(paint(g, dk, 'yoke_drape', lambda c: c.y < -0.02 and ((((c.x + 0.4) % 0.070) / 0.070) < 0.18) and c.z < 0.60))
            made.append(band('ankle', leg_rings(0.118, weight - 0.002), 0.030, 0.008, dk))   # the tapered cuff
        # THE SKIRTS: one wrapped panel over both legs, hanging, a diagonal overlap fold across the front
        if S in SKIRTS:
            # cycle 1 (looking, WRAP SKIRT): at 2.8 cm of flare over both legs' section the panel read as a sack; a wrap hangs close
            def off(z): return weight + 0.004 + (0.014 if S == 'WRAP SKIRT' else 0.022) * sstep(0.62, hem, z)
            g = tube('skirt', 0.660, lambda a: hem + 0.010 * math.sin(5 * a + 1.0), off, mid, fams=('torso', 'thigh', 'shin'), thick=0.010)
            g = paint(g, dk, 'skirt_fold', lambda c: c.y < -0.03 and ((c.x - (c.z - 0.62) * 0.9 + 0.5) % 0.17) < 0.022)
            # the overlap's own edge: the left hip down to the right of the hem, the strongest line on the skirt
            made.append(paint(g, dk, 'skirt_edge', lambda c: c.y < -0.03 and abs(c.x - (0.10 - 0.42 * (0.62 - c.z) / (0.62 - hem))) < 0.012))
            made.append(band('skirt_tie', [K_['waist_ring'](0.640, weight + 0.006)], 0.022, 0.008, dk))
        # THE HEMS
        if S in ('TROUSERS', 'JEANS', 'CARGOS', 'WORK PANTS'):   # the rolled hem, in the light
            made.append(band('rolled_hem', leg_rings(0.112, weight + 0.001), 0.022, 0.007, lt))
        if S == 'SWEATS':   # the ribbed cuff, gathered tight on the ankle
            made.append(band('cuff', leg_rings(0.118, weight - 0.002), 0.040, 0.009, mid, groove=lambda a: 0.0016 * max(0.0, math.cos(26 * a)) ** 2))
        if S == 'SHORTS' and not frayed:
            made.append(band('shorts_hem', leg_rings(hem + 0.012, thick(V((0, 0, hem + 0.012))) + 0.001), 0.022, 0.006, dk))
        if S == 'CROPPED':   # the turn-up: a lit face with a dark edge under it, two cells
            made.append(band('turn_up', leg_rings(hem + 0.022, thick(V((0, 0, hem + 0.022))) + 0.002), 0.040, 0.012, lt))
            made.append(band('turn_up_edge', leg_rings(hem + 0.003, thick(V((0, 0, hem + 0.003))) + 0.004), 0.008, 0.010, dk))
        # WHAT THE NAME SAYS
        lift_ = lambda z: thick(V((0.08, -0.05, z)))
        if S == 'JEANS' or (w & {'JEANS', 'DENIM'}):
            made.append(strip('fly', [[front(0.006, z) for z in (0.640, 0.610, 0.580, 0.555)]], 0.016, lift_(0.6) + 0.002, dk, across=3))
            made.append(strip('front_pockets', [[front(sx * 0.050, 0.648), front(sx * 0.072, 0.618), front(sx * 0.098, 0.598)] for sx in (1, -1)],
                              0.007, lift_(0.62) + 0.002, dk, across=3))
            made.append(patch('seat_pockets', [(sx * 0.058, 0.575) for sx in (1, -1)], 0.060, 0.062, mid, lift_(0.58) + 0.004, s=1))
            made.append(patch('seat_seams', [(sx * 0.058, 0.605) for sx in (1, -1)], 0.062, 0.006, lt, lift_(0.60) + 0.007, s=1))
        if S == 'CARGOS' or 'CARGOS' in w:   # a bellows pocket with a flap on each outer thigh
            pk = [[side(sx, -0.015, z) for z in (0.505, 0.475, 0.445, 0.415)] for sx in (1, -1)]
            made.append(strip('cargo_pockets', pk, 0.070, lift_(0.46) + 0.010, mid, across=5))
            made.append(strip('cargo_flaps', [[side(sx, -0.015, z) for z in (0.515, 0.495)] for sx in (1, -1)], 0.074, lift_(0.50) + 0.015, dk, across=5))
        if S == 'WORK PANTS':   # a double knee; a hammer loop on his right thigh; patches when the name says so
            made.append(patch('double_knee', [(sx * 0.080, 0.375) for sx in (1, -1)], 0.075, 0.120, dk if 'PATCHED' in w else mid, lift_(0.38) + 0.004))
            made.append(strip('hammer_loop', [[side(-1, -0.010, z) for z in (0.560, 0.530, 0.500)]], 0.016, lift_(0.53) + 0.006, dk, across=3))
            if 'PATCHED' in w:
                made.append(patch('patches', [(0.095, 0.50), (-0.060, 0.22)], 0.050, 0.045, lt, lift_(0.40) + 0.006))
        if S == 'TROUSERS':   # the pressed crease down the front of each leg
            made.append(strip('crease', [[front(sx * 0.080, z) for z in (0.58, 0.46, 0.34, 0.22, 0.13)] for sx in (1, -1)], 0.006, lift_(0.3) + 0.002, mid, across=3))

    # ---- 2. THE SHOES -----------------------------------------------------------------------------------------------------
    if Gf:
        S = Gf['shape']; mid, dk, lt, sole = Gf['mid'], Gf['dk'], Gf['lt'], Gf['sole']
        kind, top = SHOE[S]
        shell = 0.012 if kind != 'sandal' else 0.006   # the body tool's shoe stands this far off the foot
        foot = {sx: [p for p, fm in zip(P, fam_v) if fm == 'foot' and p.x * sx > 0] for sx in (1, -1)}

        def outline(sx, z0, z1, grow, n=40):
            """the foot's outline seen from below between z0 and z1, as a ring of world points, grown outward"""
            pts = [p for p in foot[sx] if z0 <= p.z <= z1] or foot[sx]
            cx = sum(p.x for p in pts) / len(pts); cy = sum(p.y for p in pts) / len(pts)
            ring = []
            for i in range(n):
                a = 2 * math.pi * i / n; d = (math.cos(a), math.sin(a))
                near_ = [p for p in pts if abs((math.atan2(p.y - cy, p.x - cx) - a + math.pi) % (2 * math.pi) - math.pi) < 0.45]
                r = max([(p.x - cx) * d[0] + (p.y - cy) * d[1] for p in near_] or [0.03])
                ring.append((cx + d[0] * (r + grow), cy + d[1] * (r + grow)))
            return ring

        def slab(key, sx, z0, z1, grow, colour):
            """a sole: the foot's outline grown by `grow`, from z0 to z1, capped"""
            bm = bmesh.new(); ring = outline(sx, 0.0, 0.03, grow)
            lo = [bm.verts.new(V((x, y, z0))) for x, y in ring]; hi = [bm.verts.new(V((x, y, z1))) for x, y in ring]
            n = len(ring)
            for i in range(n):
                bm.faces.new((lo[i], lo[(i + 1) % n], hi[(i + 1) % n], hi[i]))
            bm.faces.new(list(reversed(lo))); bm.faces.new(hi)
            bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
            return finish(new_obj(bm, key), colour, key, 1, 0)

        if S == 'COLUMN':   # one mass per leg from the thigh over the foot, no ankle break, the sole one dark line
            for f in body.data.polygons:
                if ffam(f) in ('thigh', 'shin', 'foot'): f.material_index = 2 if ffam(f) != 'foot' else 3
            body.data.update()
            def keep_c(fm, c): return (fm == 'torso' and c.z < 0.665) or fm in ('thigh', 'shin') or (fm == 'foot' and c.z > 0.012)
            def thick_c(p): return 0.010 * (0.45 + 0.55 * sstep(0.655, 0.600, p.z)) + 0.012 * sstep(0.62, 0.40, p.z) + 0.004 * sstep(0.12, 0.05, p.z)
            made.append(cloth('column', keep_c, thick_c, mid, rim=0.005, levels=2, fams=('torso', 'thigh', 'shin', 'foot')))
            for sx in (1, -1): made.append(slab('column_sole_%d' % (sx > 0), sx, -0.001, 0.014, 0.026, sole))
        else:
            stack = S in ('STACK BOOT', 'STACKED MID BOOT')
            grow = shell + (0.014 if stack else 0.004)
            sole_h = 0.034 if stack else 0.016 if kind != 'sandal' else 0.014
            for sx in (1, -1):
                made.append(slab('sole_%d' % (sx > 0), sx, -0.001, sole_h, grow, sole))
                if kind != 'sandal':   # the midsole stripe: a sneaker's white foam, a boot's welt in the light
                    made.append(slab('midsole_%d' % (sx > 0), sx, sole_h, sole_h + (0.012 if kind == 'sneaker' else 0.006), grow - 0.002,
                                     lt if kind == 'sneaker' else dk))
            if kind == 'sneaker':   # laces up the tongue, the heel counter behind
                for sx in (1, -1):
                    c0 = leg_c(0.05, sx)
                    tongue = [surf(V((c0.x, y, z)))[0] for y, z in ((-0.115, 0.060), (-0.085, 0.078), (-0.055, 0.094), (-0.035, 0.108))]
                    made.append(strip('tongue_%d' % (sx > 0), [tongue], 0.030, shell + 0.002, Gf['mid'], across=4))
                    bars = [[surf(V((c0.x + u, y, z)))[0] for u in (-0.016, 0.0, 0.016)] for y, z in ((-0.110, 0.064), (-0.090, 0.076), (-0.068, 0.088), (-0.048, 0.100))]
                    made.append(strip('laces_%d' % (sx > 0), bars, 0.006, shell + 0.005, lt if BASE.lum(mid) < 150 else dk, across=3))
                    heel = [surf(V((c0.x, 0.10, z)))[0] for z in (0.020, 0.045, 0.075)]
                    made.append(strip('heel_%d' % (sx > 0), [heel], 0.050, shell + 0.002, dk, across=5))
            elif kind == 'boot':
                # the collar: the top of the shaft in the light, a dark line under it (genShoes' _boot rows)
                if S != 'SLOUCH BOOT':
                    made.append(band('boot_collar', leg_rings(top - 0.010, shell + 0.001), 0.020, 0.006, lt))
                    made.append(band('boot_collar_line', leg_rings(top - 0.026, shell + 0.002), 0.008, 0.005, dk))
                    if S == 'BOOT':   # an ankle boot's pull tab and its eyelets up the front
                        for sx in (1, -1):
                            c0 = leg_c(0.10, sx)
                            made.append(strip('eyelets_%d' % (sx > 0), [[surf(V((c0.x + u, -0.06 + 0.012 * k, 0.07 + 0.022 * k)))[0] for u in (-0.012, 0.012)] for k in range(4)],
                                              0.007, shell + 0.004, dk, across=3))
                else:   # SLOUCH: leather that has given up: wider than the leg, creased every 3 cells, the top cut higher outside
                    def keep_s(fm, c):
                        topz = top - 0.030 + 0.030 * sstep(-0.02, 0.06, abs(c.x) - 0.08)   # higher on the outer side
                        return fm == 'shin' and c.z < topz
                    def thick_s(p): return shell + 0.010 + 0.006 * max(0.0, math.cos(2 * math.pi * p.z / 0.050)) ** 2
                    made.append(cloth('slouch', keep_s, thick_s, mid, rim=0.005, levels=2, fams=('shin',)))
                if S == 'TALL BOOT':   # a knee boot's strap and buckle at the top
                    made.append(band('boot_strap', leg_rings(top - 0.060, shell + 0.002), 0.014, 0.007, dk))
            elif kind == 'sandal':   # straps over the bare foot, round the ankle, a toe loop
                for sx in (1, -1):
                    c0 = leg_c(0.04, sx)
                    for k, (y, z) in enumerate(((-0.120, 0.040), (-0.060, 0.062))):
                        made.append(strip('strap_%d_%d' % (sx > 0, k), [[surf(V((c0.x + u, y, z)))[0] for u in (-0.05, -0.025, 0.0, 0.025, 0.05)]],
                                          0.016, shell + 0.002, mid, across=3))
                made.append(band('ankle_strap', leg_rings(0.095, 0.004), 0.014, 0.006, dk))
    return [m for m in made if m is not None]


def record():
    out = dict(what='CHARACTER [every old asset into the new look], GARMENTS LEGS AND FEET: the 45 canon trousers and the 40 canon shoes, the options read off the alpha',
               legs={s: [G['name'] for G in LEGS if G['shape'] == s] for s in LEG_SHAPES},
               feet={s: [G['name'] for G in FEET if G['shape'] == s] for s in FEET_SHAPES},
               pieces=[dict(name=G['name'], slot=G['slot'], tag=G['tag'], fn=G['fn'], ramp=G['ramp'], shape=G['shape'],
                            options=dict((k, G[k]) for k in ('cut', 'shaft', 'sole_kind') if G[k])) for G in LEGS + FEET])
    p = os.path.join(ROOT, 'records/target/character/BOHEMIA_GARMENTS_LEGS_AND_FEET_ONE.json')
    json.dump(out, open(p, 'w'), indent=1)
    print('wrote', os.path.relpath(p, ROOT), {s: len(v) for s, v in out['legs'].items()}, {s: len(v) for s, v in out['feet'].items()})


if __name__ == '__main__':
    if len(sys.argv) > 2 and sys.argv[1] == 'roll':   # a look at what a gang rolls
        for i in range(int(sys.argv[3]) if len(sys.argv) > 3 else 12): print(roll_wear(sys.argv[2], i))
    else:
        record()
