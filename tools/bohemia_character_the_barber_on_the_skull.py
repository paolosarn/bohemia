#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the barber on the skull]: THE BARBER'S CUTS AS SCULPTED HAIR ON THE MODEL (rule 115c: the
character models remade through the rig; rule 115h, his FIRST STAR: the face from the same model is every face's method;
his 10/18 'we can customise that shit?' on the starred face; rule 37i, Paolo 9/27: customisation at the barber).

THE GAP. The fourteen models each wore one cap of lifted skin for hair; the barber's bank (the eleven canon cuts in the
alpha's wardrobe, A HAIRCUT READS FROM EVERY ANGLE) did not exist on the model, so the barber could not dress a rig body,
and the starred face could not change its hair.

THE METHOD. One person, one skull, many cuts:
  * THE BODY is the man under every look (CHARACTER's own tool, tools/bohemia_character_the_thirteen_through_the_rig.py,
    LOOKS['Body']: black tank, black cargos) in the bank's wrapped boots (BARBER_BODY, below: the white sneakers read as a
    light from below on the guide's light row), so only the hair changes from cut to cut.
  * THE HEAD is PORTRAIT's starred head (tools/bohemia_portrait_the_head_from_the_model.py, imported and NEVER edited: a
    PEOPLE entry is added in memory with a bare scalp, its build() runs, and the cut is added to the live scene after),
    on the same head bone, so the walk at 1:1 and the portrait at 128 are the same head wearing the same cut (ONE ID,
    ONE WHOLE PERSON). The face, its shape keys and its eyes are PORTRAIT's and are not touched.
  * EACH CUT IS GEOMETRY ON THE SKULL BONE, sculpted the clay way, read off the flat cut's own dials in the bank
    (vol = lift on the crown, side = how far down the head the hair runs, front = the hairline, fade, flare), and made to
    read at the two sizes the game shows a head: at 1:1 (a head is about 21 px, a pixel about 15 mm of clay) the cut is
    its SILHOUETTE and its big masses (clumps of 25 to 40 mm); at the portrait's 128 (a pixel about 3 mm) the fine work
    shows (strands 5 mm deep on a 12 mm pitch, PORTRAIT's measured groove; coils 12 mm).
      TEMPLE TAPER  a short crown with a forward lift and four front tufts, a crisp line-up with the temple corners cut,
                    and THE FADE: the shell thins to nothing at the taper line, and below it a stubble skin cut to 2 mm
                    faces carries three bands (75, 50, 25 per cent hair) whose edges dither face by face, the way
                    clippers leave it and the way a pixel artist draws it: stubble at 128, one gradient at 1:1.
      COIL CROWN    a rounded mass (vol 2: 44 mm on the crown with the flat cut's peak, the sides flared low and covering
                    the ears to the jaw) built of coils on random seeds (no rings, PORTRAIT's cycle 2) at three sizes:
                    34 mm clumps that scallop the outline at 1:1, 16 mm and 8 mm coils inside them for the portrait.
                    Under the dead afro's lift and not its outline (the graveyard: 'a volume dial is not an afro').
      LAYERED FALL  a centre-parted cap, the hairline an arch falling away to the temples like curtains, combed out from
                    the part; the fall's mass ONE CURTAIN cut to a pattern (this lane's coat skirts): columns round the
                    back from temple to temple that follow the skull, hang (never back in, the flare 0.12), rest on the
                    shoulders, and end in a hem cut in eleven rounded points; over it THE LAYER, seven locks rooted at
                    the crown, shorter, flipped out at the tips. Side 1.42 head-heights, short of the dead 1.60.
  * THE COLOURS are steps of the style palette (records/target/BOHEMIA_STYLE_PALETTE.json) nearest the flat cut's own ramp
    (H_BLK -> cloth_black 0, H_SND -> clay_mustard 2; the rig's sun, dust and old-paint pass lift and chalk them toward the flat ramp's mid); the skin skin_deep 3, the body's own skin; strand normals on dark
    hair (this lane's 8b, reused by PORTRAIT) so the rig's dust does not grey a black crown.

Run with Blender's Python (bpy 4.2, python3.11; see tools/bohemia_direction_master_rig.py):
    <venv>/bin/python tools/bohemia_character_the_barber_on_the_skull.py build <CUT|ALL>     (the mannequin first, then the cuts)
then the rig per cut, unedited (the --real-height is in records/character/rig/barber_<cut>.json, real_height_for_rig):
    <venv>/bin/python tools/bohemia_direction_master_rig.py records/character/rig/barber_<cut>.glb \
        records/target/character/barber/<cut> --real-height <h> --family none --clip Stand:1 --clip Anim_0:6 --portrait 128
the twin (node tools/bohemia_character_the_barber_on_the_skull_flat.js), then the sheet and the VOTE page (plain python3):
    python3 tools/bohemia_character_the_barber_on_the_skull.py sheet

REUSE CHECK: the body and its walk are the rig's man through this lane's tool; the head, the face and the skull's
materials are PORTRAIT's tool, imported whole; the groove pitch and the seeded coils are PORTRAIT's measured lessons;
the hang rule is this lane's skirt (tube(): cloth never narrows back onto the legs); strand normals are this lane's 8b;
the render is DIRECTION's master rig, unedited; the play page is [the walk of every look]'s.

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twin is the game's own flat body wearing the same cut,
read live off buildFrame in all eight facings (tools/bohemia_character_the_barber_on_the_skull_flat.js); the starred
face (PORTRAIT's poacher recipe); the card of numbers in rig.json; analog horror AH-01. No reference game.
"""
import os, sys, json, math, random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
RIG_DIR = os.path.join(ROOT, 'records/character/rig')
OUT_DIR = os.path.join(ROOT, 'records/target/character/barber')
FLAT_DIR = os.path.join(ROOT, 'records/target/character/barber_flat')
BODY_TOP = 1.5283   # records/character/rig/body.json body_top_m: the man is 1.72 m to here, whatever his hair adds

# THE BARBER'S MANNEQUIN: the man under every look (LOOKS['Body']) in the bank's WRAPPED BOOTS instead of white sneakers,
# on the model and on the flat twin alike. Measured (cycle 7): the guide's light row (top half minus bottom half) read
# the white sneakers as a light from below; on the bare body they alone moved it 16 to 23 values on the side-on facings
# (E +0.9 -> +17.7, W -4.1 -> +18.1 with the sneakers' pixels set dark), so the bare body already failed W, and every
# black cut failed with it. The cut is what this sheet shows; the boots keep the ruler reading the light, not the shoes.
BARBER_BODY = 'BarberBody'
WRAPPED_BOOTS = (54, 52, 54)   # the bank's WRAPPED BOOTS, CHARCLOTH mid


def barber_body():
    """this lane's tool builds the mannequin (its LOOKS gains the entry in memory; its file is never written)"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    L = json.loads(json.dumps(CH.LOOKS['Body'], default=list))
    L['shoes'] = dict(colour=WRAPPED_BOOTS, kind='boot', top=0.20); L['worn']['feet'] = 'WRAPPED BOOTS'
    L['hair'] = dict(style='taper', colour=CH.HAIR_DARK); L['order'] = 99; L['shape'] = "the barber's mannequin: the body in wrapped boots"
    CH.LOOKS[BARBER_BODY] = L
    CH.build(BARBER_BODY, RIG_DIR)

# THE BARBER'S FIRST CUTS (the row's END STATE). bank = the flat cut's own dials in the alpha's wardrobe (read, never
# edited); hair = a step of the style palette nearest the flat cut's ramp mid.
CUTS = {
    'TEMPLE TAPER': dict(tag='temple_taper', bank=dict(ramp='H_BLK', vol=0, side=0.40, front=0.16, fade=4),
                         hair=('cloth_black', 0), zcap=0.3, worn_by='Body, Trades, Network, Remnants'),
    'COIL CROWN': dict(tag='coil_crown', bank=dict(ramp='H_BLK', vol=2, side=0.72, front=0.24, flare=0.20),
                       hair=('cloth_black', 0), zcap=0.5, worn_by='Caravans, Church'),   # the coils take more sun: at 1:1 they read only when lit (cycle 7)
    'LAYERED FALL': dict(tag='layered_fall', bank=dict(ramp='H_SND', vol=1, side=1.42, front=0.26, flare=0.12),
                         hair=('clay_mustard', 2), zcap=1.0, worn_by='Anarchists, Homeless'),
}
ORDER = ['TEMPLE TAPER', 'COIL CROWN', 'LAYERED FALL']
# HAIR 1 (the roll call, 10/19): the other eight canon cuts, as strands and clumps, never a mesh (his chain-mail note);
# their geometry lives in tools/bohemia_character_hair_one.py, the eight branches build() calls; the three above are untouched
import bohemia_character_hair_one as HAIR_ONE  # noqa: E402
import bohemia_character_hair_two as HAIR_TWO  # noqa: E402   (HAIR 2: twelve new cuts, the whole enchilada, 10/19)
import bohemia_character_faces_one as FACES_ONE  # noqa: E402   (FACES 1: face shapes, facial hair and marks on the same head, 10/19)
import bohemia_character_hats_one as HATS_ONE  # noqa: E402   (HATS 1: the 21 canon hats on the same head)
import bohemia_character_eyewear_one as EYE_ONE  # noqa: E402   (EYEWEAR 1: the 14 face pieces on the same head)
import bohemia_character_garments_base as BASE_ONE  # noqa: E402   (GARMENTS BASE: the 80 tops, each on its own body)
import bohemia_character_garments_outer as OUTER_ONE  # noqa: E402   (GARMENTS OUTER: the 74 coats, each on its own body, 10/20)
import bohemia_character_garments_legs as LEGS_ONE  # noqa: E402   (GARMENTS LEGS AND FEET: the 45 trousers and 40 shoes, 10/23)
import bohemia_character_garments_gear as GEAR_ONE  # noqa: E402   (GEAR 1: the 68 bags, capes, pads, scarves, belts and gloves, 10/23)
import bohemia_character_the_first_look as FIRST  # noqa: E402   (THE FIRST LOOK: the player's paper doll in 3D, 10/23)
import bohemia_character_the_outfit as OUTFIT  # noqa: E402   (THE OUTFIT: a person's layers that show, 10/23)
CUTS.update(HAIR_ONE.CUTS)
CUTS.update(HAIR_TWO.CUTS)
CUTS.update(FACES_ONE.CUTS)
CUTS.update(HATS_ONE.CUTS)
CUTS.update(EYE_ONE.CUTS)
CUTS.update(BASE_ONE.CUTS)
CUTS.update(OUTER_ONE.CUTS)
CUTS.update(LEGS_ONE.CUTS)
CUTS.update(GEAR_ONE.CUTS)
CUTS.update(FIRST.CUTS)
ALL = ORDER + HAIR_ONE.ORDER + HAIR_TWO.ORDER + FACES_ONE.ORDER + HATS_ONE.ORDER + EYE_ONE.ORDER + BASE_ONE.ORDER + OUTER_ONE.ORDER + LEGS_ONE.ORDER + GEAR_ONE.ORDER + FIRST.ORDER


def sstep(a, b, t):
    t = max(0.0, min(1.0, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)


def interp(x, pts):
    if x <= pts[0][0]: return pts[0][1]
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        if x <= x1: return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return pts[-1][1]


def hsh(i, salt=0):
    """a fixed number in 0..1 from an index: the same cut is the same on every render"""
    return (((i * 2654435761) ^ (salt * 40503)) & 0xffffffff) / 4294967296.0


def person_body(spec):
    """A PERSON's body (RUN TWO [no two people alike], rule 121(i)): his gang's look from this lane's tool (LOOKS[gang],
    voted up, copied in memory, its file never written) in HIS OWN skin step, built to records/character/rig/<tag>.glb"""
    import bohemia_character_the_thirteen_through_the_rig as CH
    import bohemia_portrait_the_head_from_the_model as PM
    L = json.loads(json.dumps(CH.LOOKS[spec['gang']], default=list))
    for k_, v_ in CH.LOOKS[spec['gang']].items():
        if callable(v_): L[k_] = v_
    L['skin'] = PM.palette_step(*spec['skin']); L['order'] = 200
    L['shape'] = '%s: a person of the %s, his own skin %s %d' % (spec['tag'], spec['gang'], spec['skin'][0], spec['skin'][1])
    name = spec['tag'].upper()
    CH.LOOKS[name] = L
    if spec['gang'] in getattr(CH, 'PRINTS', {}): CH.PRINTS[name] = CH.PRINTS[spec['gang']]
    CH.build(name, RIG_DIR)
    spec['body'] = 'records/character/rig/%s.glb' % name.lower()


def people(path):
    """A ROLL FILE (a JSON list of persons, each {id, gang, skin: [role, i], hair_cut, hair: [role, i], face: {dials},
    beard, stubble, new_beard, scar, mark, hat, eyewear}) registered as cuts named PERSON <id>: the barber builds each the
    way it builds a cut. records/target/character/BOHEMIA_THE_BARBERS_BOOK.json says what every name means."""
    names = []
    for P in json.load(open(path)):
        tag = 'person_' + str(P['id']).lower()
        dark = PM_lum(P['hair']) < 0.12
        e = dict(P, tag=tag, bank=dict(kind='person', gang=P['gang']), zcap=0.3 if dark else 1.0,
                 worn_by='%s, rolled' % P['gang'])
        e['hair'] = tuple(P['hair']); e['skin'] = tuple(P['skin'])
        CUTS['PERSON ' + str(P['id'])] = e; names.append('PERSON ' + str(P['id']))
    return names


def PM_lum(step):
    import bohemia_portrait_the_head_from_the_model as PM
    r, g, b = PM.palette_step(*step) if isinstance(step[0], str) else step
    f = lambda v: (v / 255.0) / 12.92 if v / 255.0 <= 0.04045 else ((v / 255.0 + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def build(cut):
    import bpy, bmesh, mathutils
    from mathutils import Vector, Matrix
    from mathutils.bvhtree import BVHTree
    from mathutils.kdtree import KDTree
    import bohemia_portrait_the_head_from_the_model as PM
    spec = dict(CUTS[cut]); tag = spec['tag']
    if os.environ.get('BARBER_HAIR'):   # a measuring knob (the cycles below): another palette step for the hair
        r_, i_ = os.environ['BARBER_HAIR'].split(':'); spec['hair'] = (r_, int(i_))
    ZCAP = float(os.environ.get('BARBER_ZCAP', spec['zcap']))
    key = 'BARBER_' + tag.upper()
    # a garment is worn on its own body (the mannequin in that top, GARMENTS BASE), built first; a cut on the mannequin
    if cut in BASE_ONE.CUTS: BASE_ONE.body(cut)
    if cut in OUTER_ONE.CUTS: OUTER_ONE.body(cut)
    if cut in LEGS_ONE.CUTS: LEGS_ONE.body(cut)
    if cut in GEAR_ONE.CUTS: GEAR_ONE.body(cut)
    if cut in FIRST.CUTS: FIRST.body(cut)
    if spec.get('gang'):
        # HIS TROUSERS AND SHOES (GARMENTS LEGS AND FEET, 10/23, rule 123(c)): the roll's own pair, or the same draw made now off
        # his id for a roll written before the book carried them; the body tool dresses the look whoever builds it (THIS
        # LANE's person_body, or a caller's in its place), after the look's top and coat
        import bohemia_character_the_thirteen_through_the_rig as CH
        wear = dict(legs=spec.get('legs'), feet=spec.get('feet')) if (spec.get('legs') or spec.get('feet')) else \
            LEGS_ONE.roll_wear(spec['gang'], str(spec.get('id', tag)).rsplit('_', 1)[-1])
        pid_ = str(spec.get('id', tag)).rsplit('_', 1)[-1]
        kit = spec['kit'] if 'kit' in spec else GEAR_ONE.roll_kit(spec['gang'], pid_)   # GEAR 1: his bag, scarf, belt, gloves...
        # THE OUTFIT (CHARACTER [the clothes look real], 10/23): his top and coat as layers that show; the top or the coat a
        # caller rolled may come back in another colour of the same cut so the two read apart, and the build (a caller's
        # person_body too) wears what the outfit says; the mid top and how each layer sits ride the DRESS hook
        O = OUTFIT.outfit(spec)
        if O: spec['top'], spec['coat'] = O['base'], O['outer']
        CH.DRESS[tag.upper()] = lambda L, wear=wear, kit=kit, O=O, nm=tag.upper(): OUTFIT.dress(GEAR_ONE.dress(LEGS_ONE.dress(L, **wear), kit), O, nm)
        person_body(spec)   # A PERSON (RUN TWO [no two people alike]): his gang's look in his own skin
    body_glb = spec.get('body', 'records/character/rig/barberbody.glb'); btag = os.path.basename(body_glb)[:-4]
    sk = tuple(spec.get('skin', ('skin_deep', 3)))   # the barber's mannequin is skin_deep 3; a person wears his own step
    # PORTRAIT's head on the bare body: a bare scalp (no hair object), no gear, no stubble; the skin is the body's own
    PM.PEOPLE[key] = dict(body=body_glb,
                          drop=tuple('%s_%s' % (btag, x) for x in ('hair', 'hair_fall', 'hat', 'hat_brim', 'visor')),
                          cut_z=1.165, centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
                          gear=None, hair='bare', stubble=bool(spec.get('stubble')), look='barber_' + tag, crew=True,
                          face=spec.get('face'), beard=spec.get('beard'), scar=spec.get('scar'),   # FACES 1: the face maker's dials and PORTRAIT's parts
                          colours=dict(skin=sk, lips=(sk[0], max(0, sk[1] - 1)), hair=spec['hair'], gear=spec['hair'],
                                       iris=('skin_deep', 1), stubble=(sk[0], max(0, sk[1] - 1))))
    tmp = os.path.join(RIG_DIR, '_barber_head_%s.glb' % tag)
    PM.build(key, tmp)
    os.remove(tmp); os.remove(tmp.replace('.glb', '.json'))   # PORTRAIT's build writes its stats beside its glb
    sc = bpy.context.scene
    arm = next(o for o in sc.objects if o.type == 'ARMATURE')
    head = sc.objects['portrait_head']
    C = Vector(PM.PEOPLE[key]['centre']); RX, RY, RZ = PM.PEOPLE[key]['radii']
    # THE EARS ARE THE TWO SMALL ISLANDS of the head's mesh (cycle 3, measured: the vertex order is not the skull then
    # the ears; vertex 12674 sits on the back of the skull, so an index test cut one meridian out of every shell and left
    # a seam down the back of the head; PORTRAIT's own paint loop makes the same test, the line down the crew's backs)
    par = list(range(len(head.data.vertices)))
    def root(i):
        while par[i] != i: par[i] = par[par[i]]; i = par[i]
        return i
    for e in head.data.edges:
        a_, b_ = root(e.vertices[0]), root(e.vertices[1])
        if a_ != b_: par[a_] = b_
    sizes = {}
    for i in range(len(par)): sizes[root(i)] = sizes.get(root(i), 0) + 1
    skull_root = max(sizes, key=sizes.get)
    EAR = set(i for i in range(len(par)) if root(i) != skull_root)
    K = PM.colours(PM.PEOPLE[key])
    hair_rgb = K['hair']; skin_rgb = K['skin']
    hm = head.matrix_world.copy()

    def mat(name, rgb, rough=0.92):
        m = bpy.data.materials.new(name); m.use_nodes = True
        b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        b.inputs['Base Color'].default_value = PM.lin(rgb); b.inputs['Roughness'].default_value = rough
        return m
    hair_mat = mat('barber_%s_hair' % tag, hair_rgb)

    def az_of(q): return math.atan2(q.x, -q.y)   # 0 at the front (-y), +-pi at the back

    def skull_bm():
        bm = bmesh.new(); bm.from_mesh(head.data)
        for l in list(bm.verts.layers.shape): bm.verts.layers.shape.remove(l)
        for v in bm.verts: v.co = hm @ v.co
        return bm

    def finish(bm, name, material, rim, smooth=True):
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        me.materials.clear(); me.materials.append(material)
        for f in me.polygons: f.material_index = 0; f.use_smooth = smooth
        o = bpy.data.objects.new(name, me); sc.collection.objects.link(o)
        bpy.context.view_layer.objects.active = o
        for x in sc.objects: x.select_set(x is o)
        if rim:
            sd = o.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = rim; sd.offset = -1; sd.use_rim = True
            bpy.ops.object.modifier_apply(modifier='rim')
        return o

    def shell(name, keep, thick, subdiv=2, rim=0.004):
        """the skull's own scalp faces kept by keep(q), cut finer, pushed out along the normal by thick(q, n, i)"""
        bm = skull_bm(); bm.verts.ensure_lookup_table()
        kill = [f for f in bm.faces if f.verts[0].index in EAR or not keep(f.calc_center_median() - C)]
        bmesh.ops.delete(bm, geom=kill, context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        # the sphere's seam welded on this lane's copy, so no shell can split along it when it is pushed out
        bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
        for _ in range(subdiv): bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
        bm.normal_update(); bm.verts.ensure_lookup_table()
        pos = [v.co.copy() for v in bm.verts]; nor = [v.normal.copy() for v in bm.verts]
        d = thick(pos, nor)
        for v, p, n, t in zip(bm.verts, pos, nor, d): v.co = p + n * t
        return finish(bm, name, hair_mat, rim)

    def seeds(pts, r, salt):
        """random seeds at least r apart over the scalp (dart throwing on a grid hash): coils with no rows to them"""
        rng = random.Random(salt); idx = list(range(len(pts))); rng.shuffle(idx)
        grid = {}; out = []
        for i in idx:
            p = pts[i]; c = (int(p.x // r), int(p.y // r), int(p.z // r)); ok = True
            for dx in (-1, 0, 1):
                for dy in (-1, 0, 1):
                    for dz in (-1, 0, 1):
                        for s in grid.get((c[0] + dx, c[1] + dy, c[2] + dz), ()):
                            if (s - p).length < r: ok = False; break
                        if not ok: break
                    if not ok: break
                if not ok: break
            if ok: grid.setdefault(c, []).append(p); out.append(p)
        kd = KDTree(len(out))
        for i, s in enumerate(out): kd.insert(s, i)
        kd.balance()
        return kd

    def bumps(kd, p, rad, n=3):
        b = 0.0
        for _, _, d in kd.find_n(p, n):
            u = d / rad
            if u < 1.0: b = max(b, math.sqrt(1.0 - u * u))
        return b

    def skin_to(o, wfn=None):
        """every piece on the head bone (a long fall blends down onto the neck and the shoulders)"""
        bones = {b.name for b in arm.data.bones}
        def full(bn): return next(b for b in bones if b == bn or b.endswith(bn))
        groups = {}
        for v in o.data.vertices:
            p = o.matrix_world @ v.co
            for bn, w in (wfn(p - C) if wfn else {PM.HEAD_BONE: 1.0}).items():
                g = full(bn)
                if g not in groups: groups[g] = o.vertex_groups.new(name=g)
                groups[g].add([v.index], w, 'REPLACE')
        mw = o.matrix_world.copy(); o.parent = arm; o.matrix_world = mw
        am = o.modifiers.new('Armature', 'ARMATURE'); am.object = arm
        return o

    def strand_normals(o):
        """this lane's 8b: on a dark head a strand's normal lies across the head, never straight up"""
        bc = hair_mat.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value
        if 0.2126 * bc[0] + 0.7152 * bc[1] + 0.0722 * bc[2] > 0.12 or o.data.materials[0] is not hair_mat or ZCAP >= 1.0: return
        mw = o.matrix_world; mr = mw.to_3x3().normalized(); mri = mr.inverted(); ns = []
        for v in o.data.vertices:
            p = mw @ v.co; n = (mr @ v.normal).normalized()
            r = Vector((p.x - C.x, p.y - C.y, 0.0)); r = r.normalized() if r.length > 1e-4 else Vector((0, 1, 0))
            # z held under 0.3, not 8b's 0.5 (cycle 3, measured: at 0.5 the dust still took a black crown to a mean of 47,
            # half again the flat cut's mid of 32, and it read grey; 8b's floor of 0.35 was set by pale coats under the
            # crown, and the barber's body wears a black tank)
            t = max(0.0, n.z - ZCAP) / (1.0 - ZCAP)
            m = n.lerp(r, t); m.z = min(m.z, ZCAP); m.normalize(); ns.append(tuple((mri @ m).normalized()))
        o.data.normals_split_custom_set_from_vertices(ns)

    # the skull's own faces: skin where no hair grows, the hair colour under the hair; the fade's stubble bands are their
    # own fine skin (fade_skin, below)
    FADE_MATS = [mat('barber_%s_fade_%d' % (tag, k), tuple(round(h * k / 100 + s * (1 - k / 100)) for h, s in zip(hair_rgb, skin_rgb)))
                 for k in (75, 50, 25)]

    def paint_scalp(under):
        for f in head.data.polygons:
            if f.vertices[0] in EAR or f.material_index not in (0, 4): continue
            f.material_index = 4 if under(hm @ f.center - C) else 0

    def fade_skin(name, zone, band, subdiv=2, lift=0.0006):
        """THE FADE AS STUBBLE (cycle 4: banded on the skull's own 6 to 8 mm faces, the dither stepped into a blocky dirty
        stripe at the portrait's 128): the zone's faces cut four times finer (2 mm, under a pixel at 128), lifted 0.6 mm,
        and every small face takes the band its dithered depth lands in, so the portrait sees clipper stubble and 1:1
        sees one gradient"""
        bm = skull_bm(); bm.verts.ensure_lookup_table()
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index in EAR or not zone(f.calc_center_median() - C)], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-5)
        for _ in range(subdiv): bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
        bm.normal_update()
        for v in bm.verts: v.co = v.co + v.normal * lift
        bm.faces.ensure_lookup_table()
        bands = [band(f.calc_center_median() - C, f.index) for f in bm.faces]
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        for m_ in FADE_MATS: me.materials.append(m_)
        me.materials.append(head.data.materials[0])   # past the fade: the face's own skin
        for f, k in zip(me.polygons, bands): f.material_index = k; f.use_smooth = True
        o = bpy.data.objects.new(name, me); sc.collection.objects.link(o)
        return o

    made = []
    b = spec['bank']
    # UNDER A HOOD UP (10/23): a person whose top or coat has its hood up wears no hat, and a cut bigger than a short one goes
    # under the hood as the taper (looking: a coil crown swallowed the hood whole)
    hood_up_ = (spec.get('top') in BASE_ONE.BY and BASE_ONE.BY[spec['top']]['hood_up']) or \
        (spec.get('coat') in OUTER_ONE.BY and OUTER_ONE.BY[spec['coat']]['hood'])
    if hood_up_ and spec.get('hair_cut'):
        import bohemia_character_the_barbers_book as BOOK
        if spec['hair_cut'] not in BOOK.SHORT: spec['hair_cut'] = 'TEMPLE TAPER'
    hc = spec.get('hair_cut')        # A PERSON names his cut; every other entry is its own cut
    cut_ = hc if hc in ORDER else spec.get('as_cut', cut)   # a garment's head wears one of the three cuts (TEMPLE TAPER) under it

    if cut_ == 'TEMPLE TAPER':
        # THE LINE: straight across the brow (front 0.16 of the head down from the crown), the temple corners cut back,
        # down past the temple to the taper line over the ear (side 0.40), lowest at the back
        def line(q):
            ab = abs(az_of(q))
            j = 0.004 * math.sin(7.0 * az_of(q) + 0.8) * math.cos(3.0 * az_of(q))   # never a ruler line
            return interp(ab, [(0.0, 0.112), (0.50, 0.112), (0.62, 0.104), (0.82, 0.050), (1.6, 0.042), (2.4, 0.034), (math.pi, 0.030)]) + j
        # THE FADE (fade 4 rows on the flat cut, about 95 mm of clay here): three stubble bands under the line on the
        # sides and the back, each small face's depth moved by up to 8 mm so the bands dither into each other
        def zone(q): return abs(az_of(q)) >= 0.64 and line(q) - 0.100 < q.z < line(q) + 0.003
        def band(q, i):
            dz = line(q) - q.z + 0.016 * (hsh(i, 3) - 0.5)
            return 0 if dz < 0.030 else (1 if dz < 0.062 else (2 if dz < 0.094 else 3))
        paint_scalp(lambda q: q.z > line(q) - 0.002)
        made.append(fade_skin('barber_temple_taper_fade', zone, band))
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C; L = line(q); above = q.z - L
                t = 0.0006 + 0.0064 * sstep(0.0, 0.040, above) + 0.004 * sstep(0.10, 0.17, q.z)   # nothing at the taper line, fuller on the crown
                fw = sstep(-0.04, -0.13, q.y) * sstep(0.085, 0.135, q.z)                        # the front lift
                t += 0.012 * fw
                t += 0.010 * fw * max(0.0, math.cos(2 * math.pi * q.x / 0.036)) ** 2 * sstep(0.03, 0.0, above - 0.012)   # four front tufts, forward at the line
                if q.z > 0.09:   # combed front to back over the crown: 5 mm grooves on a 12 mm pitch (PORTRAIT's measure)
                    t -= 0.0035 * max(0.0, math.cos(2 * math.pi * (q.x + 0.004 * math.sin(q.y / 0.03)) / 0.012)) ** 3 * sstep(0.09, 0.12, q.z)
                else:            # the sides combed back and down
                    t -= 0.0020 * max(0.0, math.cos(2 * math.pi * (100 * az_of(q) / (2 * math.pi) + 30 * q.z))) ** 3   # 100 grooves round, about 10 mm apart
                out.append(max(0.0004, t))
            return out
        made.append(shell('barber_temple_taper', lambda q: q.z > line(q) - 0.002, thick, subdiv=2, rim=0.0012))

    elif cut_ == 'COIL CROWN':
        # THE LINE: the hairline 0.24 down at the brow; the sides down over the ears to the jaw behind them (side 0.72);
        # the nape at the mouth's level
        def line(q):
            ab = abs(az_of(q)); j = 0.005 * math.sin(9.0 * az_of(q) + 0.3)
            return interp(ab, [(0.0, 0.094), (0.45, 0.092), (0.80, 0.040), (1.10, -0.040), (1.55, -0.072), (math.pi, -0.085)]) + j
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        def thick(pos, nor):
            # three sizes of coil on random seeds (cycle 1: 26 mm clumps left the outline a smooth dome at 1:1, a grey
            # helmet; a pixel there is 15 mm, so the clumps that scallop the outline are 34 mm with 11 mm of relief)
            big = seeds(pos, 0.034, 11); mid = seeds(pos, 0.016, 23); small = seeds(pos, 0.008, 37)
            out = []
            for p, n in zip(pos, nor):
                q = p - C; ab = abs(az_of(q)); above = q.z - line(q)
                T = 0.014 + 0.030 * sstep(-0.03, 0.16, q.z)                                         # vol 2: 44 mm on the crown
                T += 0.018 * sstep(0.55, 1.30, ab) * math.exp(-((q.z + 0.012) / 0.070) ** 2)       # flare 0.20: the sides puff low
                T += 0.016 * math.exp(-((q.x / 0.045) ** 2 + ((q.y - 0.030) / 0.050) ** 2 + ((q.z - 0.170) / 0.035) ** 2))   # the crown's own peak (the flat cut's tuft)
                T *= 0.40 + 0.60 * sstep(0.0, 0.035, above)                                         # a rolled edge at the line
                c = 0.011 * bumps(big, p, 0.026) + 0.005 * bumps(mid, p, 0.0105) + 0.0025 * bumps(small, p, 0.0052)
                out.append(T * 0.80 + c)
            return out
        made.append(shell('barber_coil_crown', lambda q: q.z > line(q) - 0.004, thick, subdiv=2, rim=0.004))

    elif cut_ == 'LAYERED FALL':
        def line(q):
            ab = abs(az_of(q)); j = 0.004 * math.sin(8.0 * az_of(q) + 1.1)
            return interp(ab, [(0.0, 0.106), (0.28, 0.096), (0.55, 0.068), (0.85, 0.028), (1.20, -0.050), (1.60, -0.100), (math.pi, -0.120)]) + j
        def cap_t(q):
            ab = abs(az_of(q))
            t = 0.014 + 0.010 * sstep(0.0, 0.16, q.z) + 0.006 * sstep(0.6, 1.4, ab) * sstep(0.08, -0.04, q.z)   # vol 1, a flare low on the sides
            return t * (0.25 + 0.75 * sstep(0.0, 0.030, q.z - line(q)))   # the hairline melts into the brow (cycle 6: a 4 mm rim on a 45 per cent edge drew a dark line round the face)
        paint_scalp(lambda q: q.z > line(q) - 0.004)
        def thick(pos, nor):
            out = []
            for p, n in zip(pos, nor):
                q = p - C; t = cap_t(q); ab = abs(az_of(q))
                part = math.exp(-(q.x / 0.0045) ** 2) * sstep(0.04, -0.02, q.y) * sstep(0.08, 0.12, q.z)   # the centre part
                t -= 0.009 * part
                # combed OUT from the part over the top (the grooves run across it), down the sides and the back
                top = sstep(0.06, 0.12, q.z) * sstep(1.6, 0.9, ab)
                g_top = max(0.0, math.cos(2 * math.pi * (q.y + 0.25 * abs(q.x)) / 0.013)) ** 3
                g_side = max(0.0, math.cos(82 * az_of(q))) ** 3   # 82 strands round, about 13 mm apart, meeting at the back
                t -= 0.0035 * (top * g_top + (1 - top) * g_side)
                out.append(max(0.002, t))
            return out
        made.append(shell('barber_layered_fall_cap', lambda q: q.z > line(q) - 0.004, thick, subdiv=2, rim=0.002))

        # THE LOCKS. The skull is measured by rays from its own axis; a lock runs down it at its offset, then HANGS: below
        # its widest the path never comes back in (the skirt's rule), it flares 12 per cent of what it drops (flare 0.12),
        # waves, is pushed out of the shoulders by the body's own surface, and flips out at the tip.
        bm_s = skull_bm(); bvh_head = BVHTree.FromBMesh(bm_s); bm_s.free()
        body = next(o for o in sc.objects if o.type == 'MESH' and o.name.startswith('Cesium_Man'))
        pts, polys = [], []
        for o in [body, sc.objects['portrait_neck']] + [o for o in sc.objects if o.type == 'MESH' and o.name.startswith('barberbody_') and 'shoe' not in o.name]:
            base = len(pts); mw = o.matrix_world
            pts += [mw @ v.co for v in o.data.vertices]; polys += [[base + i for i in f.vertices] for f in o.data.polygons]
        bvh_body = BVHTree.FromPolygons(pts, polys)

        def skull_r(az, z):
            d = Vector((math.sin(az), -math.cos(az), 0.0)); o = C + Vector((0, 0, z))
            hit = bvh_head.ray_cast(o, d, 0.5)
            return (hit[0] - o).length if hit[0] else None

        def lock_path(az, z0, z_end, off, wave_ph, flip):
            d = Vector((math.sin(az), -math.cos(az), 0.0)); side = Vector((math.cos(az), math.sin(az), 0.0))
            path = []; r_max = 0.0; z = z0; z_wide = None; m = 0.012
            while z > z_end - 1e-6:
                r = skull_r(az, z)
                r = (r + off) if r else r_max
                if r >= r_max: r_max = r
                else:
                    if z_wide is None: z_wide = z
                    r = r_max + 0.12 * 0.35 * 0.008; r_max = r     # hangs, flaring 0.12 of what it drops, gently
                s = len(path) * 0.008
                p = (C + Vector((0, 0, z)) + d * (r + 0.003 * math.sin(2 * math.pi * s / 0.11 + 1.7 * wave_ph))
                     + side * 0.007 * math.sin(2 * math.pi * s / 0.12 + wave_ph))
                # a lock that reaches the shoulder RESTS there and ends (cycle 1: pushed out along the shoulder's
                # surface, the side locks splayed out like wings and the fall read as straw)
                if z < -0.13 and len(path) > 6:
                    loc, nrm, _, _ = bvh_body.find_nearest(p)
                    if loc is not None and (p - loc).dot(nrm) < m: break
                path.append(p); z -= 0.008
            for _ in range(2):   # a clay lock has no kinks
                path = [path[0]] + [(path[i - 1] + path[i] * 2 + path[i + 1]) / 4 for i in range(1, len(path) - 1)] + [path[-1]]
            n = len(path)
            for i in range(n):   # the top tier's tips flip out; the lower tier's turn under
                u = max(0.0, (i / max(1, n - 1) - 0.75) / 0.25)
                h = Vector((path[i].x - C.x, path[i].y - C.y, 0.0)); h = h.normalized() if h.length > 1e-6 else d
                path[i] = path[i] + h * ((0.006 if flip else -0.005) * u * u) + Vector((0, 0, (0.003 if flip else 0.0) * u ** 3))
            return path

        bm = bmesh.new(); SEG = 12
        def lock_mesh(path, w0, th0, grooves):
            """a clay lock: a flat lens, wide at the root, pointed at the tip, three strands pressed along its face"""
            n = len(path); rings = []
            for i, p in enumerate(path):
                t = (path[min(n - 1, i + 1)] - path[max(0, i - 1)]).normalized()
                h = Vector((p.x - C.x, p.y - C.y, 0.0)).normalized()
                nn = (h - t * h.dot(t)).normalized(); bb = t.cross(nn).normalized()
                s = i / max(1, n - 1)
                w = w0 * (0.75 + 0.25 * sstep(0.0, 0.12, s)) * (1.0 - 0.78 * sstep(0.50, 1.0, s))
                th = th0 * (1.0 - 0.55 * sstep(0.4, 1.0, s))
                ring = []
                for k in range(SEG):
                    a = 2 * math.pi * k / SEG; out_face = math.sin(a) > 0.05
                    groove = 0.80 if (grooves and k == 3) else 1.0   # one soft crease down the layer's locks (cycle 4: a crease every 14 mm aliased to stripes at 1:1)
                    ring.append(bm.verts.new(p + bb * (0.5 * w * math.cos(a)) + nn * (0.5 * th * math.sin(a) * groove)))
                rings.append(ring)
            for i in range(n - 1):
                for k in range(SEG):
                    bm.faces.new((rings[i][k], rings[i][(k + 1) % SEG], rings[i + 1][(k + 1) % SEG], rings[i + 1][k]))
            for ring, p in ((rings[0], path[0]), (rings[-1], path[-1])):
                c = bm.verts.new(p)
                for k in range(SEG): bm.faces.new((ring[k], ring[(k + 1) % SEG], c))

        def length_at(ab): return interp(ab, [(0.90, -0.160), (1.25, -0.220), (1.90, -0.270), (math.pi, -0.305)])
        # THE FALL'S MASS IS ONE CURTAIN (cycle 5: locks of any width, laid side by side, left a dark slit at every overlap
        # and striped the fall at 1:1; the flat cut reads as one mass with a few waves in it). Cut to a pattern the way
        # this lane's coat skirts are: columns round the back arc from one temple to the other, each walking down the
        # skull at its offset and then hanging (never back in, the flare 0.12 of the drop), resting where it meets the
        # shoulder, ending at a hem that is longest at the back and is cut in eleven rounded points (the layered ends).
        # Broad waves run down it (ridges about 6 cm apart, a ripple every 10 cm of fall), never a strand every pixel.
        NCOL, DZ = 72, 0.008
        cols = []
        for j in range(NCOL + 1):
            u = j / NCOL; az = 0.95 + u * (2 * math.pi - 1.90); azs = az if az <= math.pi else az - 2 * math.pi
            ab = abs(azs); d = Vector((math.sin(az), -math.cos(az), 0.0))
            hem = length_at(ab) - 0.022 * (0.5 + 0.5 * math.cos(2 * math.pi * u * 11)) + 0.012 * (hsh(j // 6, 41) - 0.5)
            col = []; r_max = 0.0; z = 0.062 - 0.03 * sstep(1.4, 0.95, ab); hung = False
            while z > hem - 1e-6:
                r = skull_r(azs, z); top = sstep(0.062, 0.010, z)   # buried in the cap at its top, standing off it below
                r = (r + 0.008 + 0.016 * top) if r else r_max
                if r >= r_max and not hung: r_max = r
                else: hung = True; r_max = r = r_max + 0.12 * 0.35 * DZ
                ridge = 0.006 * math.cos(2 * math.pi * u * 14) + 0.004 * math.sin(2 * math.pi * (z / 0.10) + 9.0 * u) * sstep(0.0, -0.10, z)
                p = C + Vector((0, 0, z)) + d * (r + ridge)
                if z < -0.13 and len(col) > 6:
                    loc, nrm, _, _ = bvh_body.find_nearest(p)
                    if loc is not None and (p - loc).dot(nrm) < 0.012: break   # it rests on the shoulder and ends
                col.append(p); z -= DZ
            cols.append(col)
        for j in range(NCOL + 1):   # the last 3 cm of every column turns under, the layered end
            n = len(cols[j])
            for i in range(n):
                uu = max(0.0, (i - (n - 5)) / 4.0)
                h = Vector((cols[j][i].x - C.x, cols[j][i].y - C.y, 0.0)).normalized()
                cols[j][i] = cols[j][i] - h * (0.006 * uu * uu)
        cb = bmesh.new(); vs = [[cb.verts.new(p) for p in col] for col in cols]
        for j in range(NCOL):
            n = min(len(vs[j]), len(vs[j + 1]))
            for i in range(n - 1): cb.faces.new((vs[j][i], vs[j][i + 1], vs[j + 1][i + 1], vs[j + 1][i]))
        bmesh.ops.delete(cb, geom=[v for v in cb.verts if not v.link_faces], context='VERTS')
        bmesh.ops.recalc_face_normals(cb, faces=cb.faces[:])
        if sum(((f.calc_center_median() - C) * Vector((1, 1, 0))).dot(f.normal) for f in cb.faces) < 0: bmesh.ops.reverse_faces(cb, faces=cb.faces[:])
        curtain = finish(cb, 'barber_layered_fall_curtain', hair_mat, 0.010)
        ss = curtain.modifiers.new('ss', 'SUBSURF'); ss.levels = 1; ss.render_levels = 1
        bpy.context.view_layer.objects.active = curtain
        for x in sc.objects: x.select_set(x is curtain)
        bpy.ops.object.modifier_apply(modifier='ss')
        for f in curtain.data.polygons: f.use_smooth = True
        # THE LAYER: locks rooted at the crown, flowing over the cap and the curtain, shorter by 5 to 8 cm, the tips
        # flipped out; round enough in section to throw a shadow on the mass, so the layer reads as a layer
        n2 = 7
        for i in range(n2):
            u = (i + 0.5) / n2; az = 1.02 + u * (2 * math.pi - 2.04); az = az if az <= math.pi else az - 2 * math.pi
            ab = abs(az); jit = 0.02 * (hsh(i, 15) - 0.5)
            z0 = interp(ab, [(1.0, 0.125), (1.4, 0.140), (math.pi, 0.150)])   # rooted at the crown, so each layer flows from the top over the cap (cycle 4: rooted at the ear, the side locks read as pigtails)
            lock_mesh(lock_path(az, z0, length_at(ab) + 0.050 + 0.030 * hsh(i, 17) + jit, 0.034, 6.28 * hsh(i, 19), True), 0.090, 0.016, True)
        bm.normal_update()
        lo = finish(bm, 'barber_layered_fall_locks', hair_mat, 0)
        ss = lo.modifiers.new('ss', 'SUBSURF'); ss.levels = 1; ss.render_levels = 1
        bpy.ops.object.modifier_apply(modifier='ss')
        for f in lo.data.polygons: f.use_smooth = True
        def fall_w(q):   # the head carries the fall; below the jaw it blends onto the neck, at the shoulders onto the torso
            a = sstep(-0.12, -0.19, q.z); c = sstep(-0.20, -0.28, q.z)
            w = {PM.HEAD_BONE: 1.0 - a, PM.NECK_BONE: a * (1.0 - c), 'torso_joint_3': a * c}
            return {k: v for k, v in w.items() if v > 1e-4}
        made.append(('weighted', curtain, fall_w))
        made.append(('weighted', lo, fall_w))

    elif (hc or cut) in HAIR_ONE.CUTS:
        made += HAIR_ONE.build(hc or cut, locals())
    elif (hc or cut) in HAIR_TWO.CUTS:
        made += HAIR_TWO.build(hc or cut, locals())
    elif cut in HATS_ONE.CUTS:
        made += HATS_ONE.build(cut, locals())
    elif cut in EYE_ONE.CUTS:
        made += EYE_ONE.build(cut, locals())
    if spec.get('hat') and not hood_up_: made += HATS_ONE.build(spec['hat'], locals())   # a person's hat over his cut (a short cut only; never under his hood)
    if spec.get('eyewear'): made += EYE_ONE.build(spec['eyewear'], locals())   # and his face piece
    if cut in FACES_ONE.CUTS or spec.get('new_beard') or spec.get('mark'):     # FACES 1: the new facial hair and marks, after the cut
        made += FACES_ONE.build(cut, locals())
    if cut in BASE_ONE.CUTS:   # a top's pieces that sit on the head and the portrait's neck (a turtleneck's roll, a hood up)
        made += BASE_ONE.head(cut, locals())
    if cut in OUTER_ONE.CUTS and OUTER_ONE.BY[spec['garment']]['hood']:   # a hooded poncho's hood up over the head (BASE 1's hood)
        _G = OUTER_ONE.BY[spec['garment']]
        made += BASE_ONE.head(cut, locals(), G=dict(neck='hood', hood_up=True, mid=_G['mid']))
    # A PERSON's top and coat that ride the head (10/23): his turtleneck's roll up the neck, his hood up, a hooded poncho's hood;
    # the barber built them only for its own cards, so RUN TWO's roll left those tops and coats out of the crowd
    if spec.get('top') in BASE_ONE.BY:
        made += BASE_ONE.head(cut, locals(), G=BASE_ONE.BY[spec['top']])
    if spec.get('coat') in OUTER_ONE.BY and OUTER_ONE.BY[spec['coat']]['hood']:
        made += BASE_ONE.head(cut, locals(), G=dict(neck='hood', hood_up=True, mid=OUTER_ONE.BY[spec['coat']]['mid']))

    for m in made:
        if isinstance(m, tuple): skin_to(m[1], m[2]); strand_normals(m[1])
        else: skin_to(m); strand_normals(m)

    out = os.path.join(RIG_DIR, 'barber_%s.glb' % tag)
    for o in sc.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_skins=True, export_animations=True, export_morph=True,
                              export_morph_normal=False, export_apply=False, use_selection=False)
    model_top = max((o.matrix_world @ v.co).z for o in sc.objects if o.type == 'MESH' for v in o.data.vertices)
    stats = dict(cut=cut, tag=tag, bank=spec['bank'], worn_by=spec['worn_by'], model=os.path.relpath(out, ROOT),
                 body=body_glb + (" (LOOKS Body in the bank's WRAPPED BOOTS)" if btag == 'barberbody' else ' (the mannequin in %s)' % spec.get('garment')), zcap=ZCAP, head="PORTRAIT's starred head (tools/bohemia_portrait_the_head_from_the_model.py, imported)",
                 bone=PM.HEAD_BONE, hair_palette=list(spec['hair']), hair_rgb=list(hair_rgb), skin_rgb=list(skin_rgb),
                 model_top_m=round(model_top, 4), body_top_m=BODY_TOP, real_height_for_rig=round(1.72 * model_top / BODY_TOP, 4),
                 pieces={(m[1] if isinstance(m, tuple) else m).name: len((m[1] if isinstance(m, tuple) else m).data.vertices) for m in made})
    json.dump(stats, open(out.replace('.glb', '.json'), 'w'), indent=1)
    print('BUILT', cut, stats['real_height_for_rig'], stats['pieces'])


FAC = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
KEYS = 6
BG = (22, 21, 20); GROUND = (118, 106, 88); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)


def sheet():
    """the atlas the VOTE page plays, its table, the still sheet. Every picture is the rig's (the model) or buildFrame's
    (the flat twin), pasted whole; each set cut with ONE box so nothing jitters"""
    from PIL import Image, ImageDraw
    def trim(ims):
        bb = [im.getbbox() for im in ims]
        box = (min(b[0] for b in bb), min(b[1] for b in bb), max(b[2] for b in bb), max(b[3] for b in bb))
        return [im.crop(box) for im in ims]
    M, T, P, R = {}, {}, {}, {}
    for cut in ORDER:
        tag = CUTS[cut]['tag']; d = os.path.join(OUT_DIR, tag)
        R[cut] = json.load(open(os.path.join(d, 'rig.json')))
        M[cut] = {f: [Image.open(os.path.join(d, 'rig_Anim_0_%s_k%02d.png' % (f, k))).convert('RGBA') for k in range(KEYS)] for f in FAC}
        M[cut]['still'] = [Image.open(os.path.join(d, 'rig_%s.png' % f)).convert('RGBA') for f in FAC]
        flat = trim([Image.open(os.path.join(FLAT_DIR, '%s_%s_k%02d.png' % (tag, f, k))).convert('RGBA') for f in FAC for k in range(KEYS)])
        T[cut] = {f: flat[i * KEYS:(i + 1) * KEYS] for i, f in enumerate(FAC)}
        P[cut] = [Image.open(os.path.join(d, 'rig_portrait_%s.png' % f)).convert('RGBA') for f in ('S', 'SE', 'SW')]
    every = [im for c in ORDER for f in FAC for im in M[c][f] + T[c][f]] + [im for c in ORDER for im in M[c]['still']]
    cw = max(im.width for im in every) + 4; ch = max(im.height for im in every) + 4

    # THE ATLAS: per cut, eight model rows and eight flat rows of six keys; the portraits under them
    rows = {}; r = 0
    for c in ORDER:
        for f in FAC: rows['%s:%s' % (CUTS[c]['tag'], f)] = r; r += 1
        for f in FAC: rows['%s:flat:%s' % (CUTS[c]['tag'], f)] = r; r += 1
    GROUPS = 3; per = -(-r // GROUPS)
    at = {k: [(i // per) * cw * KEYS, (i % per) * ch] for k, i in rows.items()}
    pw = max(im.width for c in ORDER for im in P[c]); ph = max(im.height for c in ORDER for im in P[c])
    A = Image.new('RGBA', (max(cw * KEYS * GROUPS, pw * 9), ch * per + ph), (0, 0, 0, 0))
    def put(img, im, x, y, w, h): img.paste(im, (x + (w - im.width) // 2, y + h - im.height - 2), im)
    for c in ORDER:
        t = CUTS[c]['tag']
        for f in FAC:
            x0, y0 = at['%s:%s' % (t, f)]
            for k, im in enumerate(M[c][f]): put(A, im, x0 + k * cw, y0, cw, ch)
            x0, y0 = at['%s:flat:%s' % (t, f)]
            for k, im in enumerate(T[c][f]): put(A, im, x0 + k * cw, y0, cw, ch)
    port = {}
    for i, c in enumerate(ORDER):
        for j, im in enumerate(P[c]):
            x, y = (i * 3 + j) * pw, ch * per; A.paste(im, (x + (pw - im.width) // 2, y + (ph - im.height) // 2), im)
            port['%s:%s' % (CUTS[c]['tag'], ('S', 'SE', 'SW')[j])] = [x, y]
    A.save(os.path.join(ROOT, 'slices/vote/CHARACTER_THE_BARBER_ON_THE_SKULL.png'), optimize=True)
    tab = dict(cell=[cw, ch], keys=KEYS, beats=2, bpm=120, facings=FAC, at=at, portrait_cell=[pw, ph], portrait_at=port,
               cuts=[dict(name=c, tag=CUTS[c]['tag'], worn_by=CUTS[c]['worn_by'], bank=CUTS[c]['bank']) for c in ORDER],
               ppm=57, light="the rig's sun, upper left", palette='records/target/BOHEMIA_STYLE_PALETTE.json')
    with open(os.path.join(ROOT, 'slices/vote/CHARACTER_THE_BARBER_ON_THE_SKULL_TABLE.js'), 'w') as fh:
        fh.write('/* CHARACTER [the barber on the skull]: written by tools/bohemia_character_the_barber_on_the_skull.py sheet */\n')
        fh.write('window.BARBER_TABLE = ' + json.dumps(tab) + ';\n')

    # THE STILL SHEET: per cut, the flat cut's eight facings over the model's eight (the passing key), and its portraits
    lw = 110
    Wd = 12 + lw + 8 * (cw + 4) + 12 + 3 * (pw + 4)
    H = 64 + len(ORDER) * (2 * (ch + 4) + 30) + 30
    S = Image.new('RGB', (Wd, H), BG); dr = ImageDraw.Draw(S)
    def cell(im, x, y):
        S.paste(GROUND, (x, y, x + cw, y + ch)); S.paste(im, (x + (cw - im.width) // 2, y + ch - im.height - 2), im)
    dr.text((12, 8), "CHARACTER: THE BARBER'S CUTS AS SCULPTED HAIR ON THE STARRED HEAD, BESIDE THE GAME'S FLAT CUT, 1:1. CANDIDATES: nothing is final before the moodboard.", fill=INK)
    dr.text((12, 24), "57 px a metre (1.72 m = 98 px), one pixel size | palette: records/target/BOHEMIA_STYLE_PALETTE.json (hair cloth_black 0 / clay_mustard 2, skin skin_deep 3) | ONE light: the rig's sun, upper left", fill=DIM)
    dr.text((12, 38), "one body, one skull, three cuts: the body is the man under every look, the head is PORTRAIT's starred head on the same bone; only the hair changes", fill=DIM)
    y = 58
    for c in ORDER:
        t = CUTS[c]['tag']
        dr.text((12, y), c, fill=HEAD); dr.text((12 + lw, y), 'worn today by %s | the bank: %s' % (CUTS[c]['worn_by'], ', '.join('%s %s' % kv for kv in CUTS[c]['bank'].items())), fill=DIM); y += 14
        dr.text((12, y + ch // 2), 'THE GAME TODAY', fill=DIM); x = 12 + lw
        for i, f in enumerate(FAC): cell(T[c][f][1], x, y); x += cw + 4
        y0 = y; y += ch + 4
        dr.text((12, y + ch // 2), 'THE MODEL', fill=INK); x = 12 + lw
        for i, f in enumerate(FAC): cell(M[c][f][1], x, y); x += cw + 4
        dr.text((12, y + ch // 2 + 14), 'card %d of 8 out' % R[c]['card_guide']['out'], fill=DIM)
        x += 12
        for im in P[c]:
            S.paste(GROUND, (x, y0, x + pw, y0 + min(ph, 2 * ch + 4)))
            pi = im if im.height <= 2 * ch + 4 else im.crop((0, 0, im.width, 2 * ch + 4))
            S.paste(pi, (x + (pw - pi.width) // 2, y0), pi); x += pw + 4
        y += ch + 26
    dr.text((12, y), 'the facings in each row: ' + ' '.join(FAC) + ' | the portraits: S, SE, SW at 128 (the same model, the same cut)', fill=(120, 116, 108))
    out = os.path.join(ROOT, 'records/target/character/CHARACTER_THE_BARBER_ON_THE_SKULL.png')
    S.save(out); print('sheet', out, S.size, 'atlas', A.size, 'cell', cw, ch)


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'build':
        barber_body()
        names = (ORDER if sys.argv[2].upper() == 'ALL' else HAIR_ONE.ORDER if sys.argv[2].upper() == 'HAIR1'
                 else HAIR_TWO.ORDER if sys.argv[2].upper() == 'HAIR2'
                 else FACES_ONE.ORDER if sys.argv[2].upper() == 'FACES1'
                 else people(sys.argv[2][7:]) if sys.argv[2].upper().startswith('PEOPLE:')
                 else HATS_ONE.ORDER if sys.argv[2].upper() == 'HATS1' else EYE_ONE.ORDER if sys.argv[2].upper() == 'EYE1'
                 else BASE_ONE.ORDER if sys.argv[2].upper() == 'BASE1' else BASE_ONE.pick(sys.argv[2]) if sys.argv[2].upper().startswith('BASE1:')
                 else OUTER_ONE.ORDER if sys.argv[2].upper() == 'OUTER1' else OUTER_ONE.pick(sys.argv[2]) if sys.argv[2].upper().startswith('OUTER1:')
                 else LEGS_ONE.pick(sys.argv[2]) if sys.argv[2].upper().split(':')[0] in ('LEGS1', 'FEET1')
                 else GEAR_ONE.pick(sys.argv[2]) if sys.argv[2].upper().split(':')[0] == 'KIT1'
                 else FIRST.ORDER if sys.argv[2].upper() == 'FIRST'
                 else [n for n in ALL if CUTS[n]['tag'] == sys.argv[2].lower() or n == sys.argv[2].upper()])
        for n in names: build(n)
    elif cmd == 'sheet':
        sheet()
