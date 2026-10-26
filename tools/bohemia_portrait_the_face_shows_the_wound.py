#!/usr/bin/env python3
"""BOHEMIA -- PORTRAIT [the face shows the wound] (rule 234(c), Paolo 10/26: 'let's get creative with how it's gonna affect
their portrait... to be able to visually tell that like either an eye patch or a serious brain shit or like blood somewhere
like a band-aid there like the ear cut off there like the nose'; records/BOHEMIA_PAOLO_STRUCK_DOWN_HE_STILL_FIGHTS_AND_HIS_FACE_SHOWS_IT_10_26_26.md).

A man struck down who lives is still in the crew (rule 234(a)), and his face must show what happened. Every injury row of
records/target/bb/injuries.json (48 temporary, 11 permanent) has a MARK, and every mark is GEOMETRY ON THE MAN'S OWN HEAD,
rendered through DIRECTION's master rig under its one sun, the same model, the same camera and the same light as the face
he already wears (ONE ID, ONE WHOLE PERSON; rule 115(a); rule 121(e): a portrait is a render of the rig's own head, never a
painted thing beside it). Nothing here paints a pixel (rule 108a): an eye patch is a domed oval of black cloth on the
eyeball with a strap round the skull; the lost nose is the nose's own vertices smoothed flat with a hole in them; the lost
ear is the ear's own island shrunk to a stump and the hair round it pushed in.

HOW BATTLE BROTHERS DID IT (rule 33; the library, reference/library/grok/wiki/PAGES_ALL.tar.gz):
  * bb_all/0626_Developer Posts.txt: 'Most of these injuries will be visible on your Battle Brothers (so you can see that a
    guy really has an eye missing)'. bb_all/1415_News and Dev Blogs.txt, the temple: 'The bandages shown on your characters
    are even visibly replaced by clean ones.'
  * RECALL, marked as recall (the game's sprites are not in the library): a brother's bust is LAYERS, the head, then an
    injury layer drawn over it; a temporary injury shows a dirty bandage on the head or the body while it heals and goes when
    it heals; a few permanent ones change the head for life (the ear, the nose, the eye, a scar).
  * OURS, THE SAME SHAPE: a mark is a LAYER (a patch) drawn over the face he already wears, one per injury, stacking; a
    fresh wound's blood and its band-aid come off as it heals; a permanent mark stays for life.

THE MARKS (18; the table MARKS below; every injury row names one in ROW_MARK; rule 234(c)'s own list first):
  lost eye -> EYE PATCH; brain damage -> STITCHES on a shaved strip from the brow back; lost ear -> THE EAR GONE (a stump,
  the hair cut away round it); lost nose -> THE NOSE GONE (flat, a hole); a fresh wound -> BLOOD and a BAND-AID that come
  off as it heals; a broken arm -> a SLING; and the rest, in the same spirit: the head bandage, the eye pad, the nose taped,
  the ear bandaged, a stitched cheek, a burn, the neck wrapped, the surgeon's scar up the throat for a weak heart, the
  breathing hole's scar for a lung, the haunted stare and the white lock for a man who came back from the other side, and
  THE SURGEON'S TAG on a string round his neck for a wound his picture cannot see (a knee, a foot, a finger, his guts: the
  card says where; a toe tag on a man still standing, which is the analog horror of it).

THE PIPE (no Blender on the chats' box and no installs there: GitHub's free runner is the box, .github/workflows/portrait_wounds.yml):
  build   RUN TWO's person builder (tools/bohemia_run2_no_two_people_alike.py build-one, unedited), or PORTRAIT's crew
          build for YOU, the same model his face was rendered from
  render  DIRECTION's master rig (unedited on disk, patched in memory the way RUN TWO and COMBAT run it): the marks are
          added to the model right after it is imported, hidden from the ruler and from every base render, and shot one
          at a time, front-on, rest and the four speak-along mouths, with the base's own camera, ppm and light
  pack    (plain python) the rig's ring on each frame, the base's own crop box (its portrait.json) and hand-off window, BOX
          to 128 and 64 the way RUN TWO's faces() does; each mark kept only where it changes the face (a PATCH), packed
          into one atlas a person: records/target/portrait/wounds/<look>.png and .json
  data    records/target/portrait/wounds/BOHEMIA_WOUND_MARKS.json (every row's mark, the stages, the drawing order)
  sheet   the VOTE sheet: each man with each mark at 128 and 64, beside his face as he has it

Run:
    python3 tools/bohemia_portrait_the_face_shows_the_wound.py data
    <bpy python> tools/bohemia_portrait_the_face_shows_the_wound.py person <look>      (build, render, pack one man)
    <bpy python> tools/bohemia_portrait_the_face_shows_the_wound.py shard <i> <n>      (the runner's share of the request)
    python3 tools/bohemia_portrait_the_face_shows_the_wound.py pack <look>
    python3 tools/bohemia_portrait_the_face_shows_the_wound.py sheet
    BOHEMIA_BPY=<python with bpy 4.2>   (the runner sets it; bpy 4.2 needs Python 3.11)

REUSE CHECK: the bodies and heads are RUN TWO's and PORTRAIT's own builders, unedited; the render is DIRECTION's rig,
unedited on disk; the colours are steps of records/target/BOHEMIA_STYLE_PALETTE.json (gauze clay_bone, the band-aid and the
tag tape_masking, dried blood the blood role's dark step, the patch cloth_black, the staples chrome); nothing new is drawn.
REFERENCE CHECK (the 9/4 standing duty): the compare law: the twin is the man's own face as the game draws it today
(records/target/character/barber/<look>/face/, records/target/portrait/crew/you/), shown beside every mark on the sheet;
analog horror (laws/BOHEMIA_LAW_ANALOG_HORROR_FOR_EVERY_PIXEL_AND_EVERY_SOUND_9_20_26.md): dried, dark, old blood and
dirty dressings, never bright cartoon gore. No reference game beyond Battle Brothers in its own department (the company).
"""
import json, math, os, subprocess, sys, time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
OUT = 'records/target/portrait/wounds'            # what the screens fetch (Pages publishes records/target)
RAW = 'records/portrait/wounds/raw'               # the rig's raw frames (regenerated, never committed)
REQUEST = 'records/portrait/wounds/REQUEST.json'  # what the runner renders (a push of this file starts it)
LOGS = 'records/portrait/wounds/logs'             # each man's render log and each shard's (committed, not published)
DATA = OUT + '/BOHEMIA_WOUND_MARKS.json'
INJ = 'records/target/bb/injuries.json'
ROLL = 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json'
BARBER = 'records/target/character/barber'
MOUTH = ('A', 'E', 'O', 'M')
LIFE = ('_blink', '_look_l', '_look_r', '_wince')   # PORTRAIT [every face breathes]: frames of the base face, packed beside the marks
KEYS = ('rest',) + MOUTH
SAMPLES_PEOPLE = 24                               # RUN TWO's people (tools/bohemia_run2_no_two_people_alike.py SAMPLES)
STAMP = 'wounds-10-26'


def palette_step(role, i):
    h = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles'][role]['ramp'][i].lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


# ---- THE MARKS -------------------------------------------------------------------------------------------------------
# id: (the name on his card, what it is in a sentence, how long it stays, the keys it is shot at, the drawing layer)
# life: 'life' (a permanent row: for good), 'heals' (a temporary row: while its days run), 'fresh' (the fresh wound's days: the
# blood, then the band-aid). keys: 'rest' when nothing of it moves with the jaw (one patch serves all
# five mouths), 'all' when the jaw, the lips or the chin can cover it or move it. layer: lower is drawn first.
MARKS = {
    'eye_patch':      dict(name='EYE PATCH', life='life', keys='rest', layer=40,
                           what='a domed oval of black cloth over the eye, a strap round the skull above the ears'),
    'skull_stitches': dict(name='STITCHES', life='life', keys='rest', layer=20,
                           what='a horseshoe of stapled scar from the brow back over the skull, the hair shaved along it'),
    'ear_gone':       dict(name='THE EAR GONE', life='life', keys='rest', layer=10,
                           what='the ear cut to a ragged stump with the hole showing, the hair hacked away round it'),
    'nose_gone':      dict(name='THE NOSE GONE', life='life', keys='all', layer=10,
                           what='the nose cut flat to the face, a dark gaping hole with a ridge of healed scar round it'),
    'haunted':        dict(name='THE STARE', life='life', keys='rest', layer=5,
                           what='eyes sunk in dark rings and held too wide, a lock of hair gone white at the brow'),
    'heart_scar':     dict(name='THE SURGEON\'S SCAR', life='life', keys='all', layer=15,
                           what='a long stitched scar up out of the collar to the throat, the lips a dead grey-blue'),
    'trach_scar':     dict(name='THE BREATHING HOLE', life='life', keys='all', layer=15,
                           what='the puckered scar of a hole cut in the throat to let him breathe, and his mouth hanging open for air'),
    'sling':          dict(name='SLING', life='heals', keys='all', layer=30,
                           what='the strap of a dirty linen sling round his neck, knotted at the side, the arm in it below the picture'),
    'tag':            dict(name='THE SURGEON\'S TAG', life='heals', keys='rest', layer=35,
                           what='a yellow cattle tag punched through his ear, the surgeon\'s marker on it, for the wound his face cannot show'),
    'head_bandage':   dict(name='HEAD BANDAGE', life='heals', keys='rest', layer=50,
                           what='gauze wound twice round the head over the brow, an old brown seep at the temple'),
    'eye_pad':        dict(name='EYE PAD', life='heals', keys='rest', layer=45,
                           what='a square of gauze taped over the eye in an X, stained through'),
    'nose_tape':      dict(name='NOSE TAPED', life='heals', keys='all', layer=45,
                           what='two strips of tape crossed over a broken nose, dried blood under the nostrils'),
    'ear_bandage':    dict(name='EAR BANDAGED', life='heals', keys='rest', layer=45,
                           what='a gauze pad taped over the torn ear, stained through'),
    'face_stitches':  dict(name='STITCHED CHEEK', life='heals', keys='rest', layer=25,
                           what='a gash across the cheek, black thread crossing it, the edges swollen'),
    'burn':           dict(name='BURN', life='heals', keys='all', layer=25,
                           what='a raw wet patch of burn down the cheek and jaw, soot in the nostrils'),
    'neck_wrap':      dict(name='NECK WRAPPED', life='heals', keys='all', layer=30,
                           what='gauze wound round the throat, a brown seep through it'),
    'blood':          dict(name='BLOOD', life='fresh', keys='rest', layer=60,
                           what='dried blood run from a cut at the hairline down the temple and the cheek'),
    'bandaid':        dict(name='BAND-AID', life='fresh', keys='rest', layer=65,
                           what='a band-aid stuck over the cut at the hairline, its pad gone brown'),
}

# every injury row (records/target/bb/injuries.json) -> its mark. Where the wound is in the picture the mark is there; where
# it is not (the legs, the feet, a finger, the inside), the surgeon's tag says so and the card says where (rule 234(d)).
ROW_MARK = {
    # permanent (struck down, rule 234(b): the mark for life)
    'missing_eye': 'eye_patch', 'brain_damage': 'skull_stitches', 'missing_ear': 'ear_gone', 'missing_nose': 'nose_gone',
    'traumatized': 'haunted', 'weakened_heart': 'heart_scar', 'partly_collapsed_lung': 'trach_scar',
    'broken_elbow_joint': 'sling', 'broken_knee': 'tag', 'maimed_foot': 'tag', 'missing_finger': 'tag',
    # temporary, the head
    'broken_nose': 'nose_tape', 'split_nose': 'nose_tape', 'crushed_windpipe': 'neck_wrap', 'cut_neck_vein': 'neck_wrap',
    'grazed_neck': 'neck_wrap', 'fractured_skull': 'head_bandage', 'severe_concussion': 'head_bandage',
    'deep_face_cut': 'face_stitches', 'pierced_cheek': 'face_stitches', 'ripped_ear': 'ear_bandage',
    'grazed_eye_socket': 'eye_pad', 'burnt_face': 'burn', 'inhaled_flames': 'burn',
    # temporary, the arms, the shoulders and the hands (a sling)
    'broken_arm': 'sling', 'crushed_finger': 'sling', 'dislocated_shoulder': 'sling', 'fractured_elbow': 'sling',
    'fractured_hand': 'sling', 'smashed_hand': 'sling', 'cut_arm': 'sling', 'cut_arm_sinew': 'sling', 'split_hand': 'sling',
    'split_shoulder': 'sling', 'injured_shoulder': 'sling', 'pierced_arm_muscles': 'sling', 'pierced_hand': 'sling',
    'burnt_hands': 'sling',
    # temporary, what the head-only picture cannot see (the trunk, the legs, the blood, the sickness): the surgeon's tag
    'sick': 'tag', 'infected_wound': 'tag', 'broken_leg': 'tag', 'broken_ribs': 'tag', 'bruised_leg': 'tag',
    'fractured_ribs': 'tag', 'sprained_ankle': 'tag', 'cut_achilles_tendon': 'tag', 'cut_artery': 'tag',
    'cut_leg_muscles': 'tag', 'deep_abdominal_cut': 'tag', 'deep_chest_cut': 'tag', 'exposed_ribs': 'tag',
    'grazed_kidney': 'tag', 'injured_knee_cap': 'tag', 'pierced_chest': 'tag', 'pierced_leg_muscles': 'tag',
    'pierced_lung': 'tag', 'pierced_side': 'tag', 'stabbed_guts': 'tag', 'burnt_leg': 'tag',
}

# THE FRESH WOUND (rule 234(c): 'a fresh wound blood and a band-aid that come off as it heals'): while more than half of the
# fresh wound's days are left (CAMP's own reading, engine/bohemia_long_injury.js look(): 'blood' over half its share, 'bandage'
# under), the blood and the band-aid; then the band-aid alone; when the days run out both are gone (the gate's 'a healed fresh
# wound's band-aid is gone').
STAGES = [dict(stage='fresh', while_left_over=0.5, show=['blood', 'bandaid']),
          dict(stage='mending', while_left_over=0.0, show=['bandaid']),
          dict(stage='healed', while_left_over=None, show=[])]


def data():
    """the data file the engine and the gate read (MODS: every content kind in a data file a modder can edit)"""
    rows = json.load(open(os.path.join(ROOT, INJ)))['rows']
    missing = [r['id'] for r in rows if r['id'] not in ROW_MARK]
    if missing: raise SystemExit('rows with no mark: %s' % missing)
    D = dict(what="PORTRAIT [the face shows the wound] (rule 234(c)): every injury row's mark on the man's own face, drawn over it as "
                  "a patch rendered from his own model under the rig's sun; the fresh wound's blood and band-aid come off as it heals",
             tool='tools/bohemia_portrait_the_face_shows_the_wound.py', rule='234(c)', draft=True, stamp=STAMP,
             atlas=OUT + '/<look>.png and <look>.json (rows: mark -> key -> size -> [sx, sy, w, h, dx, dy] in the atlas and on the face)',
             keys=list(KEYS), sizes=[128, 64],
             marks={k: dict(v) for k, v in MARKS.items()},
             rows={r['id']: dict(name=r['name'], kind=r['kind'], mark=ROW_MARK[r['id']], heal_days=r.get('heal_days')) for r in rows},
             stages=STAGES, fresh=['blood', 'bandaid'],
             order=sorted(MARKS, key=lambda k: (MARKS[k]['layer'], k)),
             bb=dict(quote_visible="Most of these injuries will be visible on your Battle Brothers (so you can see that a guy really has an eye missing)",
                     source_visible='bb_all/0626_Developer Posts.txt',
                     quote_bandage='The bandages shown on your characters are even visibly replaced by clean ones.',
                     source_bandage='bb_all/1415_News and Dev Blogs.txt',
                     recall='RECALL (not in the library): the bust is layers, the head and an injury layer over it; a temporary injury a dirty bandage while it heals; a few permanent ones change the head for life'))
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    json.dump(D, open(os.path.join(ROOT, DATA), 'w'), indent=1)
    n = {}
    for r in D['rows'].values(): n[r['mark']] = n.get(r['mark'], 0) + 1
    print('rows %d -> marks %d; %s' % (len(D['rows']), len(n), ', '.join('%s %d' % kv for kv in sorted(n.items()))))


# ---- WHO GETS MARKS --------------------------------------------------------------------------------------------------
def people():
    """every face that can stand in his company: YOU and every rolled person (the origins' crews and the hires are rolled
    people, engine/bohemia_people_mix.js)"""
    roll = json.load(open(os.path.join(ROOT, ROLL)))
    return ['you'] + ['person_' + p['id'].lower() for p in roll]


def portrait_made(look):
    """YOU, the twelve cast looks and the thirteen gangs' speakers are PORTRAIT's own heads (the crew and faction hand-offs);
    everyone else is a rolled person (RUN TWO's)"""
    return look == 'you' or look.startswith(('cast_', 'faction_'))


def base_of(look):
    """the committed face and its render metadata: (portrait.json, the face folder)"""
    if portrait_made(look):
        return 'records/target/portrait/rig/crew/%s/portrait.json' % look, 'records/target/portrait/crew/%s' % look
    return '%s/%s/portrait.json' % (BARBER, look), '%s/%s/face' % (BARBER, look)


# ---- INSIDE BLENDER --------------------------------------------------------------------------------------------------
class Wounds:
    """the marks, built on the imported model right after the rig imports it, and shot one at a time"""

    def __init__(self, only=None):
        self.only = only
        self.made = {}      # mark -> dict(objs=[...], keys=[(obj, key)], mats=[(obj, poly_ids, slot)], lids=bool)
        self.objs = []
        self.log = []
        self.M = None

    def prepare(self, sc):
        """measure the head and build every mark; a failure here leaves the base renders standing and says why"""
        try:
            self.measure(sc); self.build_all()
        except Exception as e:
            import traceback
            self.log.append(dict(prepare=False, error=repr(e), trace=traceback.format_exc()[-2000:]))
            for o in self.objs: o.hide_render = True
            self.made = {}

    def bvh_with(self, off):
        """the head's skin with a shape key's offsets applied (the surface a piece must lie on once the key is on)"""
        from mathutils import Vector
        from mathutils.bvhtree import BVHTree
        h = self.M['head']; hv = self.M['hv']
        vs = [hv[i] + off.get(i, Vector()) for i in range(len(hv))]
        return BVHTree.FromPolygons(vs, [tuple(p.vertices) for p in h.data.polygons])

    # -- measuring the head ------------------------------------------------------------------------------------------
    def measure(self, sc):
        import bpy
        from mathutils import Vector
        from mathutils.bvhtree import BVHTree
        objs = {o.name: o for o in sc.objects if o.type == 'MESH'}
        head = objs['portrait_head']; eyes = objs['portrait_head_eyes']; lids = objs.get('portrait_head_lids'); neck = objs.get('portrait_neck')
        W = lambda o: [o.matrix_world @ v.co for v in o.data.vertices]
        hv = W(head)
        # THE IMPORT SPLITS THE MESH AT EVERY HARD EDGE (glTF carries a vertex per normal: measured on the runner, the skull
        # came back as one island a face), so the vertices are welded by position first; every reading below is on the welds
        weld, wid = {}, []
        for p in hv:
            k = (round(p.x, 6), round(p.y, 6), round(p.z, 6)); wid.append(weld.setdefault(k, len(weld)))
        par = list(range(len(hv)))
        def root(i):
            while par[i] != i: par[i] = par[par[i]]; i = par[i]
            return i
        first = {}
        for i, w in enumerate(wid):
            if w in first:
                a_, b_ = root(i), root(first[w])
                if a_ != b_: par[a_] = b_
            else: first[w] = i
        for e in head.data.edges:
            a_, b_ = root(e.vertices[0]), root(e.vertices[1])
            if a_ != b_: par[a_] = b_
        adj = {}
        for e in head.data.edges:
            a_, b_ = wid[e.vertices[0]], wid[e.vertices[1]]
            if a_ != b_: adj.setdefault(a_, set()).add(b_); adj.setdefault(b_, set()).add(a_)
        size = {}
        for i in range(len(par)): size[root(i)] = size.get(root(i), 0) + 1
        skull = max(size, key=size.get)
        isl = {}
        for i in range(len(par)): isl.setdefault(root(i), []).append(i)
        ears = [v for k, v in isl.items() if k != skull and len(v) > 50]
        sk = [hv[i] for i in isl[skull]]
        C = sum(sk, Vector()) / len(sk)
        ev = W(eyes)
        L = [p for p in ev if p.x < C.x]; R = [p for p in ev if p.x >= C.x]
        eL = sum(L, Vector()) / len(L); eR = sum(R, Vector()) / len(R)
        er = max((p - eL).length for p in L)
        ez = (eL.z + eR.z) / 2
        front = [p for p in sk if abs(p.x - C.x) < 0.012 and ez - 0.10 < p.z < ez - 0.005]
        tip = min(front, key=lambda p: p.y)
        mz = [f.center for f in head.data.polygons if head.data.materials and head.data.materials[f.material_index] and head.data.materials[f.material_index].name.endswith('_mouth')]
        mouth_z = (sum((head.matrix_world @ c).z for c in mz) / len(mz)) if mz else ez - 0.093
        chin = min((p for p in sk if abs(p.x - C.x) < 0.02 and p.y < C.y), key=lambda p: p.z)
        top = max(sk, key=lambda p: p.z)
        ear = []
        for v in ears:
            pts = [hv[i] for i in v]; c = sum(pts, Vector()) / len(pts)
            ear.append(dict(idx=v, c=c, side=-1 if c.x < C.x else 1, inner=min(pts, key=lambda p: abs(p.x - C.x))))
        nv = W(neck) if neck else []
        hair, gear, body = [], [], []
        for n, o in objs.items():
            if o is head or o is eyes or o is lids or o is neck or n.startswith('wound_'): continue
            # (pilot 2, measured: the barber's hair pieces are named for the cut, 'barber_curtain_cut_cap' is HAIR shaped like a cap,
            # and its material is the person's hair; a hat is 'hat_<name>_*'. The material decides first, then the name)
            ms = ' '.join((m.name if m else '') for m in o.data.materials).lower(); nl = n.lower()
            if any(k in ms for k in ('_hair', '_fade', 'beard', 'stubble')) or nl.startswith(('barber_', 'h2_', 'portrait_hair', 'portrait_curls', 'portrait_beard')): hair.append(o)
            elif nl.startswith(('hat_', 'portrait_cap', 'portrait_hat', 'portrait_visor')) or any(k in nl for k in ('brim', 'visor', 'beanie', 'hood', 'helm', 'shemagh', 'bandana')): gear.append(o)
            else: body.append(o)

        def bvh(olist):
            vs, ps = [], []
            for o in olist:
                base = len(vs); M = o.matrix_world
                vs += [M @ v.co for v in o.data.vertices]
                ps += [tuple(base + i for i in p.vertices) for p in o.data.polygons]
            return BVHTree.FromPolygons(vs, ps) if ps else None
        # the torso near the head: the body's and the clothes' faces within 0.45 m under the chin (for the sling and the tag)
        def near_chin(o):   # (bpy's collections take no slice step: every n-th vertex by index)
            vs = o.data.vertices; st = max(1, len(vs) // 200)
            return any(chin.z - 0.45 < (o.matrix_world @ vs[k].co).z < chin.z + 0.02 for k in range(0, len(vs), st))
        torso = [o for o in body if near_chin(o)]
        self.M = dict(C=C, eL=eL, eR=eR, er=er, ez=ez, brow=ez + 0.030, tip=tip, mouth_z=mouth_z, chin=chin, top=top, ears=ear,
                      neck=nv, hair=hair, gear=gear, body=body, torso=torso, head=head, eyes=eyes, lids=lids, neckobj=neck,
                      skin_bvh=bvh([head]), face_bvh=bvh([head, eyes] + ([lids] if lids else [])),
                      outer_bvh=bvh([head] + hair + ([lids] if lids else []) + [eyes]), neck_bvh=bvh([neck] if neck else torso),
                      torso_bvh=bvh(torso + ([neck] if neck else [])), skinneck_bvh=bvh(([neck] if neck else []) + [o for o in torso if o.name.startswith('Cesium_Man')] + [o for o in torso if not o.name.startswith('Cesium_Man')]), skin_only_neck=bvh(([neck] if neck else []) + [o for o in body if o.name.startswith('Cesium_Man')]), hv=hv, wid=wid, adj=adj, wpos={w: hv[i] for w, i in first.items()})
        self.log.append(dict(measured=dict(C=list(map(lambda x: round(x, 4), C)), eyes=[[round(x, 4) for x in eL], [round(x, 4) for x in eR]],
                                           eye_r=round(er, 4), tip=[round(x, 4) for x in tip], mouth_z=round(mouth_z, 4), chin_z=round(chin.z, 4),
                                           top_z=round(top.z, 4), ears=len(ear), hair=[o.name for o in hair], gear=[o.name for o in gear],
                                           torso=[o.name for o in torso], body=[o.name for o in body][:20],
                                           head_matrix_identity=head.matrix_world.is_identity if hasattr(head.matrix_world, 'is_identity') else str(head.matrix_world),
                                           materials=sorted(set(m.name for o in objs.values() for m in o.data.materials if m))[:80])))
        return self.M

    # -- colours, the palette's own steps ----------------------------------------------------------------------------
    def mat(self, name, rgb, rough=0.95):
        import bpy
        m = bpy.data.materials.new('wound_' + name); m.use_nodes = True
        b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        f = lambda v: (v / 255.0) / 12.92 if v / 255.0 <= 0.04045 else ((v / 255.0 + 0.055) / 1.055) ** 2.4
        b.inputs['Base Color'].default_value = (f(rgb[0]), f(rgb[1]), f(rgb[2]), 1.0); b.inputs['Roughness'].default_value = rough
        return m

    def skin_rgb(self):
        h = self.M['head']
        for m in h.data.materials:
            if m and m.name.endswith('_skin'):
                b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
                c = b.inputs['Base Color'].default_value
                g = lambda v: 255 * (12.92 * v if v <= 0.0031308 else 1.055 * v ** (1 / 2.4) - 0.055)
                return tuple(int(round(g(x))) for x in c[:3])
        return palette_step('skin_mid', 2)

    def scar_rgb(self):
        """healed scar: the man's own skin pulled halfway to the palette's pale pink-rust, a step lighter (a seam heals paler)"""
        s = self.skin_rgb(); p = palette_step('clay_rust', 3)
        return tuple(int(min(255, 0.55 * a + 0.45 * b + 14)) for a, b in zip(s, p))

    # -- the shapes ---------------------------------------------------------------------------------------------------
    def obj(self, mark, name, bm, material, thick=0.0012, src=None):
        """a finished mark piece: solid, smooth, weighted to the bone(s) of the nearest vertex of src, hidden until shot"""
        import bpy, bmesh
        from mathutils.kdtree import KDTree
        # thick is kept in the calls as the piece's real thickness, for the record; nothing is solidified (pilot 5, above)
        bm.normal_update()
        me = bpy.data.meshes.new('wound_%s_%s' % (mark, name)); bm.to_mesh(me); bm.free()
        mats = material if isinstance(material, list) else [material]
        for m in mats: me.materials.append(m)
        for p in me.polygons: p.use_smooth = True
        o = bpy.data.objects.new('wound_%s_%s' % (mark, name), me)
        bpy.context.scene.collection.objects.link(o)
        src = src or self.M['head']
        arm = src.parent if (src.parent and src.parent.type == 'ARMATURE') else next(x for x in bpy.context.scene.objects if x.type == 'ARMATURE')
        mw = o.matrix_world.copy(); o.parent = arm; o.matrix_world = mw
        # THE WEIGHTS. A piece on the head rides the head bone whole, the way every piece of the head does (PM.build step 7:
        # 'every piece on the head bone'); a piece on the neck or the body takes the weights of the nearest vertex of what it
        # sits on (pilot 4: copying the head's nearest vertex left pieces over the eye scattered across the face)
        names = {g.index: g.name for g in src.vertex_groups}
        groups = {}
        if src is self.M['head']:
            tot = {}
            for v in src.data.vertices:
                for g in v.groups: tot[g.group] = tot.get(g.group, 0.0) + g.weight
            bone = names.get(max(tot, key=tot.get)) if tot else None
            if bone:
                groups[bone] = o.vertex_groups.new(name=bone); groups[bone].add(list(range(len(me.vertices))), 1.0, 'REPLACE')
        else:
            kd = KDTree(len(src.data.vertices)); SM = src.matrix_world
            for i, v in enumerate(src.data.vertices): kd.insert(SM @ v.co, i)
            kd.balance()
            for v in me.vertices:
                _, j, _ = kd.find(v.co)
                for g in src.data.vertices[j].groups:
                    if g.weight <= 0: continue
                    n = names.get(g.group)
                    if n is None: continue
                    if n not in groups: groups[n] = o.vertex_groups.new(name=n)
                    groups[n].add([v.index], g.weight, 'REPLACE')
        bare = sum(1 for v in me.vertices if not len(v.groups))
        self.log.append(dict(piece=o.name, verts=len(me.vertices), groups=sorted(groups), unweighted=bare, src=src.name))
        am = o.modifiers.new('Armature', 'ARMATURE'); am.object = arm
        o.hide_render = True
        self.made.setdefault(mark, dict(objs=[], keys=[], mats=[], lids=False))['objs'].append(o)
        self.objs.append(o)
        return o

    def hit(self, bvh, origin, direction):
        from mathutils import Vector
        d = Vector(direction).normalized()
        loc, nor, _, _ = bvh.ray_cast(Vector(origin), d, 2.0)
        if loc is None or any(c != c for c in loc): return None, None
        # (pilot 3, measured: a ray onto a zero-area triangle, the eyelids' poles, hands back a NaN normal, and every piece on
        # the eye flew off the head in shards; a bad normal is the ray's own direction back)
        if nor is None or any(c != c for c in nor) or nor.length < 0.5: nor = -d
        if nor.dot(d) > 0: nor = -nor
        return loc, nor.normalized()

    def front(self, x, z, bvh=None):
        """the face's surface at picture point (x, z), seen from in front"""
        C = self.M['C']
        return self.hit(bvh or self.M['outer_bvh'], (x, C.y - 1.0, z), (0, 1, 0))

    def ring(self, az, z, bvh=None, axis=None):
        """the outer surface round the head at an azimuth (0 = the front, + to the picture's right) and a height"""
        C = axis or self.M['C']
        d = (math.sin(az), -math.cos(az), 0.0)
        return self.hit(bvh or self.M['outer_bvh'], (C.x + d[0] * 0.6, C.y + d[1] * 0.6, z), (-d[0], -d[1], 0.0))

    def sphere(self, az, el, bvh=None):
        """the surface along a direction from the skull's centre (az round, el up)"""
        C = self.M['C']
        d = (math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el))
        o = (C.x + d[0] * 0.6, C.y + d[1] * 0.6, C.z + d[2] * 0.6)
        return self.hit(bvh or self.M['outer_bvh'], o, (-d[0], -d[1], -d[2]))

    # (pilot 5, measured at the rest pose: Blender's solidify throws a vertex far away wherever a piece crosses a cliff in the
    # surface, the eye socket's rim or a collar's edge, by its shell factor: the eye patch came out 0.43 m wide before any
    # pose. So nothing is solidified now, and every piece DRAPES: its depth along each ray is pulled toward its neighbours'
    # and never behind the surface, the way cloth or tape lies over a dent instead of into it, then lifted toward the eye.)
    def drape(self, D, nbrs, it=14):
        """D: key -> [origin, dir, t_hit, t]; t moves toward the mean of its neighbours' t, never past t_hit (behind the skin)"""
        for _ in range(it):
            new = {}
            for k, d in D.items():
                ns = [D[j][3] for j in nbrs(k) if j in D]
                if ns: new[k] = min(d[2], sum(ns) / len(ns))
            for k, t in new.items(): D[k][3] = t

    def ray(self, bvh, origin, direction):
        """origin, direction, the distance to the surface (None: a miss), the surface normal"""
        from mathutils import Vector
        o, d = Vector(origin), Vector(direction).normalized()
        p, n = self.hit(bvh, o, d)
        if p is None: return None
        return [o, d, (p - o).dot(d), (p - o).dot(d), n]

    def decal(self, cx, cz, w, h, ang=0.0, lift=0.0012, bulge=0.0, shape='round', bvh=None, n=16, rough_edge=0.0, seed=0, side=None, it=14):
        """a piece lying on the surface: a grid in the picture's plane (or the side's) cast onto the surface, draped over its
        dents, lifted toward the camera; shape 'oval', 'round' (a rounded rectangle) or 'rect'; bulge domes the middle"""
        import bmesh
        bm = bmesh.new(); D = {}; UV = {}
        nu, nv = n, max(4, int(n * h / max(w, 1e-6)))
        ca, sa = math.cos(ang), math.sin(ang)
        C = self.M['C']
        for i in range(nu + 1):
            for j in range(nv + 1):
                u, v = -1 + 2.0 * i / nu, -1 + 2.0 * j / nv
                if shape == 'oval': inside = u * u + v * v <= 1.0001
                elif shape == 'round':
                    r = 0.45; qu, qv = max(0.0, abs(u) - (1 - r)), max(0.0, abs(v) - (1 - r)); inside = qu * qu + qv * qv <= r * r + 1e-4
                else: inside = True
                if rough_edge and inside:
                    e = math.sqrt(u * u + v * v)
                    wob = 0.5 + 0.5 * math.sin(7.1 * math.atan2(v, u) + seed) * math.cos(3.3 * math.atan2(v, u) + 2 * seed)
                    inside = e <= 1.0 - rough_edge * wob
                if not inside: continue
                px, pz = u * w / 2, v * h / 2
                x, z = cx + px * ca - pz * sa, cz + px * sa + pz * ca
                if side is None: r_ = self.ray(bvh or self.M['outer_bvh'], (x, C.y - 1.0, z), (0, 1, 0))
                else: r_ = self.ray(bvh or self.M['outer_bvh'], (C.x + side * 0.6, x, z), (-side, 0, 0))   # x is the depth across the side
                if r_ is None: continue
                D[(i, j)] = r_; UV[(i, j)] = (u, v)
        self.drape(D, lambda k: [(k[0] + 1, k[1]), (k[0] - 1, k[1]), (k[0], k[1] + 1), (k[0], k[1] - 1)], it)
        grid = {}
        for k, (o, d, th, t, nrm) in D.items():
            u, v = UV[k]
            dome = bulge * max(0.0, (1 - u * u)) * max(0.0, (1 - v * v))
            grid[k] = bm.verts.new(o + d * (t - lift - dome))
        for i in range(nu):
            for j in range(nv):
                q = [grid.get((i, j)), grid.get((i + 1, j)), grid.get((i + 1, j + 1)), grid.get((i, j + 1))]
                if all(q): bm.faces.new(q)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        return bm

    def ribbon(self, pts, width, lift=0.0010, bvh=None, mode='front', taper=None, it=6):
        """a strip along a path on the surface: pts are picture points (x, z) for mode 'front', (az, z) for 'ring', (az, el)
        for 'sphere'; width in metres (a number, or a list one a point); taper scales the width to the end; draped along"""
        import bmesh
        from mathutils import Vector
        C = self.M['C']; D = {}
        bv = bvh or self.M['outer_bvh']
        for i, q in enumerate(pts):
            if mode == 'front': r_ = self.ray(bv, (q[0], C.y - 1.0, q[1]), (0, 1, 0))
            elif mode == 'ring':
                d = (math.sin(q[0]), -math.cos(q[0]), 0.0); r_ = self.ray(bv, (C.x + d[0] * 0.6, C.y + d[1] * 0.6, q[1]), (-d[0], -d[1], 0.0))
            else:
                az, el = q; d = (math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el))
                r_ = self.ray(bv, (C.x + d[0] * 0.6, C.y + d[1] * 0.6, C.z + d[2] * 0.6), (-d[0], -d[1], -d[2]))
            if r_ is not None: D[i] = r_
        self.drape(D, lambda k: [k - 1, k + 1], it)
        keys = sorted(D)
        P = [(D[k][0] + D[k][1] * (D[k][3] - lift), D[k][4], k) for k in keys]
        bm = bmesh.new()
        if len(P) < 2: return bm
        row = []
        for i, (p, n, k) in enumerate(P):
            a = P[max(0, i - 1)][0]; b = P[min(len(P) - 1, i + 1)][0]
            t = (b - a); t = t.normalized() if t.length > 1e-9 else Vector((1, 0, 0))
            s = n.cross(t); s = s.normalized() if s.length > 1e-9 else Vector((0, 0, 1))
            w = (width[k] if isinstance(width, (list, tuple)) else width) * (1.0 - (taper or 0.0) * i / max(1, len(P) - 1))
            row.append((bm.verts.new(p + s * w / 2), bm.verts.new(p - s * w / 2)))
        for i in range(len(row) - 1):
            bm.faces.new([row[i][0], row[i + 1][0], row[i + 1][1], row[i][1]])
        return bm

    def band(self, zf, zb, h, lift, bvh=None, n=120, rows=4, axis=None, zs=None, gap=None, it=10):
        """a strip wound round the head (or the neck): its middle at height zf at the front, zb at the back (or zs(az)),
        h tall; gap=(a0, a1) leaves an azimuth span out; draped round and up and down"""
        import bmesh
        C = axis or self.M['C']; bv = bvh or self.M['outer_bvh']
        bm = bmesh.new(); D = {}
        for i in range(n):
            az = -math.pi + 2 * math.pi * i / n
            if gap and gap[0] < az < gap[1]: continue
            zc = zs(az) if zs else zf + (zb - zf) * (1 - math.cos(az)) / 2
            for j in range(rows + 1):
                z = zc + (j / rows - 0.5) * h
                d = (math.sin(az), -math.cos(az), 0.0)
                r_ = self.ray(bv, (C.x + d[0] * 0.6, C.y + d[1] * 0.6, z), (-d[0], -d[1], 0.0))
                if r_ is not None: D[(i, j)] = r_
        self.drape(D, lambda k: [((k[0] + 1) % n, k[1]), ((k[0] - 1) % n, k[1]), (k[0], k[1] + 1), (k[0], k[1] - 1)], it)
        grid = {}
        for k, (o, d, th, t, nrm) in D.items():
            ripple = 0.0006 * math.sin(k[0] * 37.0 * 2 * math.pi / n + k[1] * 1.7)
            grid[k] = bm.verts.new(o + d * (t - lift - ripple))
        for i in range(n):
            k = (i + 1) % n
            for j in range(rows):
                q = [grid.get((i, j)), grid.get((k, j)), grid.get((k, j + 1)), grid.get((i, j + 1))]
                if all(q): bm.faces.new(q)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        return bm

    def loop_strip(self, loop, width, lift, it=8):
        """a strip draped over the head along a loop in a vertical plane across it (y fixed): th 0 is straight up, + to the
        picture's right; each point is cast from outside toward the skull's centre in that plane"""
        import bmesh
        from mathutils import Vector
        C = self.M['C']; bv = self.M['outer_bvh']; D = {}
        for i, (th, ys) in enumerate(loop):
            d = Vector((math.sin(th), 0.0, math.cos(th)))
            o = Vector((C.x, ys, C.z - 0.02)) + d * 0.6
            r_ = self.ray(bv, o, -d)
            if r_ is not None: D[i] = r_
        self.drape(D, lambda k: [k - 1, k + 1], it)
        keys = sorted(D); bm = bmesh.new(); row = []
        for k in keys:
            o, d, th_, t, n = D[k]; p = o + d * (t - lift)
            row.append((bm.verts.new(p + Vector((0, width / 2, 0))), bm.verts.new(p - Vector((0, width / 2, 0)))))
        for a, b in zip(row, row[1:]): bm.faces.new([a[0], b[0], b[1], a[1]])
        return bm

    def key_on(self, mark, o, name, offsets):
        """a shape key on an existing piece: offsets {vertex index: world-space Vector}"""
        if not offsets: return
        Minv = o.matrix_world.inverted().to_3x3()
        if not o.data.shape_keys: o.shape_key_add(name='Basis', from_mix=False)
        k = o.shape_key_add(name='wound_' + name, from_mix=False)
        basis = o.data.shape_keys.key_blocks[0]
        for i, d in offsets.items(): k.data[i].co = basis.data[i].co + Minv @ d
        k.value = 0.0
        self.made.setdefault(mark, dict(objs=[], keys=[], mats=[], lids=False))['keys'].append((o, 'wound_' + name))

    def hair_away(self, mark, near, r, depth=0.05):
        """the hair (and a cap's hem) within r of the points pushed into the skull: shaved, or hacked away round a wound"""
        from mathutils import Vector
        from mathutils.kdtree import KDTree
        C = self.M['C']
        kd = KDTree(len(near))
        for i, q in enumerate(near): kd.insert(q, i)
        kd.balance()
        for o in self.M['hair']:
            M = o.matrix_world; off = {}
            for i, v in enumerate(o.data.vertices):
                p = M @ v.co
                d = kd.find(p)[2]
                if d < r:
                    off[i] = (C - p).normalized() * depth * min(1.0, (r - d) / (0.25 * r) + 0.4)
            self.key_on(mark, o, '%s_%s' % (mark, o.name[:20]), off)

    # -- the eighteen ------------------------------------------------------------------------------------------------
    def build_life(self):
        """PORTRAIT [every face breathes] (rule 246), shot in the same pass so every man is built once: the blink (the lids' own
        Blink key), the eyes to each side (each eyeball turned 11 degrees about its own centre, a key on the eyes), and the
        wince a fresh wound gives (the face's own Angry key at 0.7, the lids narrowed): frames of the base face, never marked"""
        from mathutils import Vector, Matrix
        M = self.M; eyes = M['eyes']; Mw = eyes.matrix_world; ev = [Mw @ v.co for v in eyes.data.vertices]
        for side, ang in (('look_l', -11.0), ('look_r', 11.0)):
            off = {}
            for e in (M['eL'], M['eR']):
                R = Matrix.Rotation(math.radians(ang), 3, 'Z')
                for i, p in enumerate(ev):
                    if (p.x < M['C'].x) == (e.x < M['C'].x): off[i] = (R @ (p - e) + e) - p
            self.key_on('_' + side, eyes, side, off)
        # the full batch, measured: 13 men with their eyes in plain sight never blinked (no pixel moved). Their lids sit under
        # the skin of a heavy brow, so the lids' Blink closes behind it. So the blink also draws each eyeball back under his own
        # skin (three quarters of its radius, away from the camera): where the lids show, they cover the eye anyway
        self.key_on('_blink', eyes, 'blink_sink', {i: Vector((0.0, 0.75 * M['er'], 0.0)) for i in range(len(ev))})
        lk = M['lids'].data.shape_keys.key_blocks if M['lids'] is not None and M['lids'].data.shape_keys else {}
        self.log.append(dict(blink=dict(lids=M['lids'].name if M['lids'] is not None else None, keys=sorted(b.name for b in lk) if lk else [],
                                        lids_anim=bool(M['lids'] is not None and M['lids'].data.shape_keys and M['lids'].data.shape_keys.animation_data))))
        self.made.setdefault('_blink', dict(objs=[], keys=[], mats=[], lids=False))
        self.made.setdefault('_wince', dict(objs=[], keys=[], mats=[], lids=False))

    def build_all(self):
        M = self.M
        try:
            self.build_life(); self.log.append(dict(life=True))
        except Exception as e:
            import traceback
            self.log.append(dict(life=False, error=repr(e), trace=traceback.format_exc()[-1200:]))
        for k in MARKS:
            if self.only and k not in self.only: continue
            try:
                getattr(self, 'm_' + k)()
                self.log.append(dict(mark=k, ok=True, pieces=[o.name for o in self.made.get(k, {}).get('objs', [])],
                                     keys=[n for _, n in self.made.get(k, {}).get('keys', [])]))
            except Exception as e:   # one mark that cannot be built never stops the others; the log says why
                import traceback
                self.log.append(dict(mark=k, ok=False, error=repr(e), trace=traceback.format_exc()[-1200:]))
                self.made.pop(k, None)

    def m_eye_patch(self):
        M = self.M; e = M['eR']; C = M['C']
        cloth, strap = self.mat('patch_cloth', palette_step('cloth_black', 1)), self.mat('patch_strap', palette_step('cloth_black', 2))
        self.obj('eye_patch', 'patch', self.decal(e.x, e.z + 0.002, 0.044, 0.036, ang=-0.12, lift=0.0016, bulge=0.005, shape='oval', bvh=M['face_bvh'], n=22), cloth, thick=0.0025)
        # the strap: one loop round the skull, out of the patch's top across the brow to the far temple, back above the ears
        az_p = math.atan2(e.x - C.x, -(e.y - C.y))
        ez = M['ez']
        pts = [(az_p + 0.10, ez + 0.006), (az_p + 0.45, ez + 0.020), (math.pi / 2, ez + 0.052), (2.4, ez + 0.050), (math.pi, ez + 0.045),
               (-2.4, ez + 0.058), (-math.pi / 2, ez + 0.070), (-0.85, ez + 0.073), (-0.35, ez + 0.058), (az_p - 0.18, ez + 0.020)]
        def zs(az):   # a periodic smooth curve through the strap's points
            ps = sorted(pts); a = [p[0] for p in ps]; z = [p[1] for p in ps]
            for i in range(len(ps)):
                a0, a1 = a[i], a[(i + 1) % len(ps)] + (2 * math.pi if i == len(ps) - 1 else 0)
                x = az if az >= a0 else az + 2 * math.pi
                if a0 <= x <= a1:
                    t = (x - a0) / (a1 - a0); t = t * t * (3 - 2 * t)
                    return z[i] + (z[(i + 1) % len(ps)] - z[i]) * t
            return z[0]
        self.obj('eye_patch', 'strap', self.band(0, 0, 0.0075, 0.0018, rows=2, n=160, zs=zs, gap=(az_p - 0.12, az_p + 0.12)), strap, thick=0.0018)

    def m_eye_pad(self):
        M = self.M; e = M['eL']
        gauze, stain, tape = self.mat('pad_gauze', palette_step('clay_bone', 3)), self.mat('pad_stain', palette_step('clay_rust', 1)), self.mat('pad_tape', palette_step('tape_masking', 2))
        self.obj('eye_pad', 'gauze', self.decal(e.x, e.z + 0.002, 0.046, 0.040, ang=0.08, lift=0.0018, bulge=0.004, shape='round', bvh=M['face_bvh'], n=20), gauze, thick=0.003)
        self.obj('eye_pad', 'stain', self.decal(e.x + 0.004, e.z - 0.004, 0.020, 0.016, ang=0.4, lift=0.0055, bulge=0.004, shape='oval', bvh=M['face_bvh'], rough_edge=0.35, seed=2, n=14), stain, thick=0.0006)
        for a in (0.62, -0.62):
            self.obj('eye_pad', 'tape%+d' % int(a * 10), self.decal(e.x, e.z + 0.002, 0.070, 0.011, ang=a, lift=0.0058, bulge=0.004, shape='rect', bvh=M['face_bvh'], n=24), tape, thick=0.0008)

    def m_head_bandage(self):
        M = self.M; ez = M['ez']
        gauze, gauze2, stain = self.mat('band_gauze', palette_step('clay_bone', 3)), self.mat('band_gauze2', palette_step('clay_bone', 2)), self.mat('band_stain', palette_step('clay_rust', 1))
        # two turns: the first level across the brow and above the ears, the second tilted over it
        self.obj('head_bandage', 'turn1', self.band(ez + 0.062, ez + 0.052, 0.030, 0.0022, rows=5), gauze, thick=0.0024)
        self.obj('head_bandage', 'turn2', self.band(ez + 0.072, ez + 0.030, 0.024, 0.0048, rows=4,
                                                    zs=lambda az: ez + 0.068 + 0.014 * math.sin(az) - 0.020 * (1 - math.cos(az)) / 2), gauze2, thick=0.0022)
        # the seep: an old brown stain through both turns at the right temple
        bm = self.band(0, 0, 0.022, 0.0078, rows=3, n=120, zs=lambda az: ez + 0.064, gap=None)
        import bmesh
        keep = [f for f in bm.faces if not (0.55 < math.atan2(f.calc_center_median().x - M['C'].x, -(f.calc_center_median().y - M['C'].y)) < 1.05)]
        bmesh.ops.delete(bm, geom=keep, context='FACES'); bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        self.obj('head_bandage', 'seep', bm, stain, thick=0.0005)

    def m_skull_stitches(self):
        M = self.M; C = M['C']
        scar, staple = self.mat('skull_scar_skin', tuple(int(0.6 * a + 0.4 * b) for a, b in zip(self.scar_rgb(), palette_step('clay_rust', 1)))), self.mat('skull_staple', palette_step('chrome', 0))
        # the line: a question mark from just over the left brow up and back over the skull (az, el from the skull's centre)
        path = [(-0.10, 0.22), (-0.16, 0.32), (-0.24, 0.43), (-0.34, 0.54), (-0.47, 0.65), (-0.64, 0.75), (-0.88, 0.84), (-1.20, 0.90), (-1.60, 0.92), (-2.05, 0.86)]
        fine = []
        for (a0, e0), (a1, e1) in zip(path, path[1:]):
            for t in range(6): fine.append((a0 + (a1 - a0) * t / 6, e0 + (e1 - e0) * t / 6))
        fine.append(path[-1])
        self.obj('skull_stitches', 'scar', self.ribbon(fine, 0.0085, lift=0.0012, bvh=M['skin_bvh'], mode='sphere'), scar, thick=0.0016)
        # the staples, across the line every 11 mm
        import bmesh
        P = [self.sphere(a, e, M['skin_bvh']) for a, e in fine]
        P = [p for p in P if p[0] is not None]
        acc, last = 0.0, None
        for i in range(1, len(P) - 1):
            p, n = P[i]
            if last is not None: acc += (p - last).length
            last = p
            if acc < 0.011: continue
            acc = 0.0
            t = (P[i + 1][0] - P[i - 1][0]).normalized(); s = n.cross(t).normalized()
            bm = bmesh.new()
            a = [bm.verts.new(p + n * 0.0026 + s * 0.0090 + t * k) for k in (-0.0015, 0.0015)]
            b = [bm.verts.new(p + n * 0.0026 - s * 0.0090 + t * k) for k in (-0.0015, 0.0015)]
            bm.faces.new([a[0], a[1], b[1], b[0]])
            self.obj('skull_stitches', 'staple%02d' % i, bm, staple, thick=0.0012)
        # the hair shaved 16 mm each side of the line
        self.hair_away('skull_stitches', [p for p, _ in P], 0.019)

    def m_ear_gone(self):
        import bmesh
        from mathutils import Vector
        M = self.M; C = M['C']
        ear = next((e for e in M['ears'] if e['side'] < 0), None)
        if not ear: raise RuntimeError('no left ear island')
        hv = M['hv']; inner = ear['inner']
        # the ear's own vertices shrunk to a stump at its root, a little into the skull
        off = {}
        for i in ear['idx']:
            p = hv[i]; q = inner + (p - inner) * 0.18 + Vector((0.004, 0, 0))
            off[i] = q - p
        self.key_on('ear_gone', M['head'], 'ear', off)
        sb = self.bvh_with(off)
        scar, hole, raw = self.mat('ear_scar_skin', self.scar_rgb()), self.mat('ear_hole', palette_step('rubber', 0)), self.mat('ear_raw_skin', palette_step('blood', 0))
        c = ear['c']
        # (pilot 3: the stump on the side of the head was edge-on to the front camera and read as nothing; the wound comes
        # forward of where the ear was, a dark crust the front sees on the head's edge)
        self.obj('ear_gone', 'stump', self.decal(c.y - 0.020, c.z, 0.070, 0.060, ang=0.15, lift=0.0016, bulge=0.003, shape='oval', bvh=sb, side=-1, rough_edge=0.25, seed=5, n=20), scar, thick=0.0022)
        # (pilot 7: a front portrait sees the ear as three pixels; the crust of the cut reaches forward along the face's edge)
        self.obj('ear_gone', 'crust', self.decal(c.y - 0.030, c.z + 0.004, 0.030, 0.046, ang=0.25, lift=0.0026, bulge=0.002, shape='oval', bvh=sb, side=-1, rough_edge=0.45, seed=13, n=14), raw, thick=0.0008)
        self.obj('ear_gone', 'raw', self.decal(c.y - 0.004, c.z + 0.002, 0.030, 0.046, ang=0.15, lift=0.0040, bulge=0.0120, shape='oval', bvh=sb, side=-1, rough_edge=0.35, seed=8, n=14), raw, thick=0.0008)
        self.obj('ear_gone', 'hole', self.decal(c.y - 0.004, c.z - 0.002, 0.011, 0.013, lift=0.0168, shape='oval', bvh=sb, side=-1, n=8), hole, thick=0.0006)
        # the hair hacked away round it, so it shows on a long cut too
        self.hair_away('ear_gone', [c, inner, c + Vector((0, 0, 0.03)), c + Vector((0, 0.02, -0.02)), c + Vector((0, -0.025, 0)), c + Vector((0, -0.02, 0.025))], 0.048)

    def m_ear_bandage(self):
        M = self.M
        ear = next((e for e in M['ears'] if e['side'] < 0), None)
        if not ear: raise RuntimeError('no left ear island')
        c = ear['c']
        gauze, stain, tape = self.mat('earpad_gauze', palette_step('clay_bone', 3)), self.mat('earpad_stain', palette_step('clay_rust', 1)), self.mat('earpad_tape', palette_step('tape_masking', 2))
        self.obj('ear_bandage', 'gauze', self.decal(c.y - 0.024, c.z + 0.006, 0.090, 0.090, lift=0.010, bulge=0.012, shape='round', side=-1, n=20), gauze, thick=0.003)
        self.obj('ear_bandage', 'stain', self.decal(c.y - 0.010, c.z + 0.006, 0.030, 0.034, lift=0.0226, bulge=0.003, shape='oval', side=-1, rough_edge=0.4, seed=3, n=12), stain, thick=0.0006)
        self.obj('ear_bandage', 'tape', self.decal(c.y - 0.012, c.z + 0.002, 0.090, 0.013, ang=0.5, lift=0.0230, bulge=0.004, shape='rect', side=-1, n=20), tape, thick=0.0008)

    def m_nose_gone(self):
        import bmesh
        from mathutils import Vector
        M = self.M; C = M['C']; head = M['head']; hv = M['hv']
        tip, ez = M['tip'], M['ez']
        top_z, bot_z = ez - 0.012, tip.z - 0.020
        wpos, adj, wid = M['wpos'], M['adj'], M['wid']
        reg = set(w for w, p in wpos.items() if abs(p.x - C.x) < 0.030 and bot_z < p.z < top_z and p.y < C.y - 0.05)
        if not reg: raise RuntimeError('no nose vertices')
        pos = {w: wpos[w].copy() for w in reg}
        for _ in range(120):   # the nose smoothed into the face round it, its edge held where it is (on the welds)
            new = {}
            for w in reg:
                ns = [pos.get(j, wpos[j]) for j in adj.get(w, ())]
                if ns: new[w] = sum(ns, Vector()) / len(ns)
            for w, p in new.items(): pos[w] = Vector((wpos[w].x, p.y, wpos[w].z))
        woff = {}
        for w in reg:
            r = math.hypot((wpos[w].x - C.x) / 0.022, (wpos[w].z - (tip.z + 0.006)) / 0.030)
            dent = 0.009 * max(0.0, 1 - r) ** 1.1        # the middle sunk in where the bone was
            woff[w] = Vector((0, pos[w].y - wpos[w].y + dent, 0))
        off = {i: woff[w] for i, w in enumerate(wid) if w in woff}
        self.key_on('nose_gone', head, 'nose', off)
        # the hole and its rim, laid on the flattened face (the head with the key's offsets on)
        scar, hole, deep = self.mat('nose_scar_skin', self.scar_rgb()), self.mat('nose_hole', palette_step('blood', 0)), self.mat('nose_cave', palette_step('rubber', 0))
        fb = self.bvh_with(off)
        cz = tip.z + 0.002
        # (pilot 3: a filled oval of scar over the flattened nose read as a nose again; the scar is a ring now, the hole gaping)
        ring = [(C.x + 0.017 * math.cos(2 * math.pi * k / 40) * (1 + 0.10 * math.sin(7 * k)), cz + 0.004 + 0.022 * math.sin(2 * math.pi * k / 40)) for k in range(41)]
        self.obj('nose_gone', 'rim', self.ribbon(ring, 0.0055, lift=0.0012, bvh=fb), scar, thick=0.0020)
        self.obj('nose_gone', 'hole', self.decal(C.x, cz + 0.003, 0.030, 0.040, lift=0.0016, shape='oval', bvh=fb, rough_edge=0.22, seed=4, n=16), hole, thick=0.0008)
        for s in (-1, 1):
            self.obj('nose_gone', 'cave%+d' % s, self.decal(C.x + s * 0.0068, cz - 0.002, 0.010, 0.022, ang=s * 0.25, lift=0.0026, shape='oval', bvh=fb, n=10), deep, thick=0.0006)

    def m_nose_tape(self):
        M = self.M; C = M['C']; tip, ez = M['tip'], M['ez']
        tape, blood = self.mat('nosetape_tape', palette_step('tape_masking', 3)), self.mat('nosetape_blood_skin', palette_step('blood', 0))
        cz = (ez + tip.z) / 2 + 0.004
        for a in (0.55, -0.55):
            self.obj('nose_tape', 'tape%+d' % int(a * 10), self.decal(C.x, cz, 0.064, 0.012, ang=a, lift=0.0020 + (0.0012 if a < 0 else 0), shape='rect', bvh=M['face_bvh'], n=28), tape, thick=0.0008)
        mz = M['mouth_z']
        for s in (-1, 1):
            x0 = C.x + s * 0.008
            pts = [(x0, tip.z - 0.006), (x0 + s * 0.001, tip.z - 0.014), (x0 + s * 0.0015, (tip.z + mz) / 2), (x0 + s * 0.001, mz + 0.012)]
            self.obj('nose_tape', 'blood%+d' % s, self.ribbon(pts, 0.0042, lift=0.0009, bvh=M['skin_bvh'], taper=0.45), blood, thick=0.0006)

    def m_face_stitches(self):
        M = self.M; C = M['C']; ez = M['ez']
        scab, swell, thread = self.mat('cheek_scab_skin', palette_step('blood', 0)), self.mat('cheek_swell_skin', self.scar_rgb()), self.mat('cheek_thread', palette_step('cloth_black', 0))
        pts = [(C.x + 0.032 + 0.054 * t, ez - 0.024 - 0.050 * t + 0.010 * math.sin(math.pi * t)) for t in [i / 14 for i in range(15)]]
        self.obj('face_stitches', 'swell', self.ribbon(pts, 0.0130, lift=0.0006, bvh=M['skin_bvh']), swell, thick=0.0012)
        self.obj('face_stitches', 'scab', self.ribbon(pts, 0.0055, lift=0.0016, bvh=M['skin_bvh']), scab, thick=0.0008)
        import bmesh
        for i in range(1, len(pts) - 1, 2):
            p, n = self.front(*pts[i], M['skin_bvh'])
            if p is None: continue
            a, _ = self.front(*pts[i - 1], M['skin_bvh']); b, _ = self.front(*pts[i + 1], M['skin_bvh'])
            t = (b - a).normalized(); s = n.cross(t).normalized()
            bm = bmesh.new()
            v = [bm.verts.new(p + n * 0.0026 + s * 0.0068 + t * k) for k in (-0.0007, 0.0007)] + [bm.verts.new(p + n * 0.0026 - s * 0.0068 + t * k) for k in (0.0007, -0.0007)]
            bm.faces.new(v)
            self.obj('face_stitches', 'stitch%02d' % i, bm, thread, thick=0.0010)

    def m_burn(self):
        import bmesh
        M = self.M; C = M['C']; ez = M['ez']; tip = M['tip']
        raw, wax, soot = self.mat('burn_raw_skin', palette_step('clay_rust', 2), rough=0.6), self.mat('burn_wax_skin', self.scar_rgb(), rough=0.5), self.mat('burn_soot', palette_step('rubber', 1))
        bm = self.decal(C.x + 0.064, ez - 0.050, 0.070, 0.090, ang=-0.2, lift=0.0010, bulge=0.0012, shape='oval', bvh=M['skin_bvh'], rough_edge=0.30, seed=7, n=26)
        # blistered: the surface lumps a millimetre or two, the raw and the waxy skin in patches
        for v in bm.verts:
            v.co.y -= 0.0012 * (0.5 + 0.5 * math.sin(v.co.x * 410) * math.cos(v.co.z * 370))
        o = self.obj('burn', 'patch', bm, [raw, wax], thick=0.0010)
        for f in o.data.polygons:
            c = f.center
            f.material_index = 1 if (math.sin(c.x * 260 + 1.3) * math.cos(c.z * 230) + 0.25 * math.sin(c.z * 640)) > 0.15 else 0
        for s in (-1, 1):
            self.obj('burn', 'soot%+d' % s, self.decal(C.x + s * 0.0075, tip.z - 0.004, 0.012, 0.009, lift=0.0010, shape='oval', bvh=M['skin_bvh'], rough_edge=0.4, seed=s + 3, n=8), soot, thick=0.0005)

    def m_neck_wrap(self):
        M = self.M; C = M['C']
        if not M['neck']: raise RuntimeError('no neck')
        nz = sorted(p.z for p in M['neck'])
        z = M['chin'].z + 0.004   # (pilot 6: the frame sees the sides of the neck between the jaw's corner and the collar)
        ax = sum(M['neck'], type(C)()) / len(M['neck'])
        gauze, gauze2, stain = self.mat('neck_gauze', palette_step('clay_bone', 3)), self.mat('neck_gauze2', palette_step('clay_bone', 2)), self.mat('neck_stain', palette_step('clay_rust', 1))
        self.obj('neck_wrap', 'turn1', self.band(z - 0.006, z + 0.010, 0.040, 0.0026, bvh=M['skin_only_neck'], axis=ax, rows=4), gauze, thick=0.0024, src=M['neckobj'])
        self.obj('neck_wrap', 'turn2', self.band(z - 0.004, z + 0.010, 0.024, 0.0050, bvh=M['skin_only_neck'], axis=ax, rows=3,
                                                 zs=lambda az: z - 0.006 + 0.008 * math.sin(az)), gauze2, thick=0.0020, src=M['neckobj'])
        import bmesh
        bm = self.band(0, 0, 0.020, 0.0078, bvh=M['skin_only_neck'], axis=ax, rows=3, zs=lambda az: z + 0.002)
        keep = [f for f in bm.faces if not (0.35 < math.atan2(f.calc_center_median().x - ax.x, -(f.calc_center_median().y - ax.y)) < 0.95)]
        bmesh.ops.delete(bm, geom=keep, context='FACES'); bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        self.obj('neck_wrap', 'seep', bm, stain, thick=0.0005, src=M['neckobj'])
        # (pilot 7: the frame hardly sees the neck) the dressing is held by a strip of the same gauze up both sides of the face,
        # in front of the ears, over the crown: a loop in the plane of the ears, draped over the hair
        ys = sum(e['c'].y for e in M['ears']) / max(1, len(M['ears'])) - 0.026 if M['ears'] else C.y - 0.01
        loop = []
        for k in range(0, 61):
            th = -math.pi * 0.62 + 2 * math.pi * 0.62 * k / 60     # from under his left jaw over the crown to under his right
            loop.append((th, ys))
        bmv = self.loop_strip(loop, 0.026, 0.0040)
        self.obj('neck_wrap', 'over', bmv, gauze2, thick=0.002)

    def _throat(self):
        """(pilot 3: the sling, the tag and the wrap sat under the hand-off window's bottom, about 0.09 m under the chin)"""
        M = self.M
        return M['chin'].z - 0.012, M['chin'].z - 0.072

    def m_heart_scar(self):
        M = self.M; C = M['C']
        top, bot = self._throat()
        scar, thread = self.mat('heart_scar_skin', self.scar_rgb()), self.mat('heart_thread', palette_step('blood', 0))
        pts = [(C.x + 0.001 * math.sin(i), top - 0.030 - (top - 0.030 - (bot - 0.040)) * i / 12) for i in range(13)]
        bvh = M['neck_bvh']
        self.obj('heart_scar', 'scar', self.ribbon(pts, 0.0060, lift=0.0010, bvh=bvh), scar, thick=0.0016, src=M['neckobj'] or M['head'])
        import bmesh
        for i in range(1, 12, 2):
            p, n = self.front(*pts[i], bvh)
            if p is None: continue
            bm = bmesh.new()
            v = [bm.verts.new(p + n * 0.0022 + type(p)((dx, 0, dz))) for dx, dz in ((-0.0055, -0.0008), (0.0055, -0.0008), (0.0055, 0.0008), (-0.0055, 0.0008))]
            bm.faces.new(v)
            self.obj('heart_scar', 'mark%02d' % i, bm, thread, thick=0.0006, src=M['neckobj'] or M['head'])
        # the lips gone a dead grey-blue (the blood does not reach): the lips' own material, swapped while this mark is shot
        lips = next((i for i, m in enumerate(M['head'].data.materials) if m and m.name.endswith('_lips')), None)
        if lips is not None:
            s = self.skin_rgb(); t = palette_step('clay_teal', 2)
            blue = self.mat('heart_lips_skin', tuple(int(0.5 * a + 0.5 * b) for a, b in zip(s, t)))
            M['head'].data.materials.append(blue); slot = len(M['head'].data.materials) - 1
            polys = [p.index for p in M['head'].data.polygons if p.material_index == lips]
            self.made['heart_scar']['mats'].append((M['head'], polys, slot))

    def m_trach_scar(self):
        M = self.M; C = M['C']
        top, bot = self._throat()
        z = (top + bot) / 2 - 0.004
        scar, pit = self.mat('trach_scar_skin', self.scar_rgb()), self.mat('trach_pit_skin', palette_step('clay_rust', 1))
        bvh = M['neck_bvh']; src = M['neckobj'] or M['head']
        self.obj('trach_scar', 'ring', self.decal(C.x, z, 0.026, 0.020, lift=0.0010, bulge=0.0012, shape='oval', bvh=bvh, rough_edge=0.2, seed=9, n=16), scar, thick=0.0016, src=src)
        self.obj('trach_scar', 'pit', self.decal(C.x, z, 0.010, 0.0070, lift=0.0018, shape='oval', bvh=bvh, n=10), pit, thick=0.0006, src=src)
        import bmesh
        self.made['trach_scar']['face'] = {'portrait_head': {'A': 0.32}}   # the mouth hangs open: he cannot get the air through his nose
        for k in range(8):   # the pucker: creases out from the pit
            a = k * math.pi / 4 + 0.2
            pts = [(C.x + math.cos(a) * r, z + math.sin(a) * r * 0.75) for r in (0.0055, 0.0085, 0.0115)]
            self.obj('trach_scar', 'crease%d' % k, self.ribbon(pts, 0.0012, lift=0.0024, bvh=bvh), pit, thick=0.0004, src=src)

    def m_sling(self):
        """(pilot 6: the portrait's window ends about 0.045 m under the chin and the chin hides the throat, so a strap across the
        chest is never seen; a sling's strap goes round the neck, and the frame sees the SIDES of the neck between the jaw's
        corner and the collar: the strap is a wide band of dirty linen round the neck there, over the collar, high at the back)"""
        M = self.M; C = M['C']
        linen, knot = self.mat('sling_linen', palette_step('clay_bone', 3)), self.mat('sling_knot', palette_step('clay_bone', 2))
        bv = M['skinneck_bvh']
        if bv is None: raise RuntimeError('no neck')
        ax = sum(M['neck'], type(C)()) / len(M['neck']) if M['neck'] else C
        zc = M['chin'].z + 0.010
        self.obj('sling', 'strap', self.band(0, 0, 0.060, 0.007, bvh=bv, axis=ax, rows=5, n=96,
                                             zs=lambda az: zc - 0.022 + 0.036 * (1 - math.cos(az)) / 2 + 0.010 * math.sin(az)), linen, src=M['neckobj'] or M['head'])
        # the knot where the strap is tied, on his right at the side of the neck
        self.obj('sling', 'knot', self.decal(ax.y + 0.004, zc - 0.008, 0.030, 0.026, lift=0.012, bulge=0.010, shape='oval', bvh=bv, side=-1, rough_edge=0.2, seed=6, n=12), knot, src=M['neckobj'] or M['head'])

    def m_tag(self):
        """THE SURGEON'S TAG (pilot 6: a tag on a string at the throat is under the window's bottom edge): a yellow cattle tag
        punched through the lobe of his right ear, the surgeon's mark on it in marker, hanging at the side of his jaw, for the
        wound his picture cannot show; the hair round the lobe pushed back so it hangs clear"""
        import bmesh
        from mathutils import Vector
        M = self.M; C = M['C']
        ear = next((e for e in M['ears'] if e['side'] > 0), None)
        if not ear: raise RuntimeError('no right ear island')
        pts = [M['hv'][i] for i in ear['idx']]
        lobe = min(pts, key=lambda p: p.z); outer = max(pts, key=lambda p: p.x)
        plastic, ink, stud = self.mat('tag_plastic', palette_step('clay_mustard', 2), rough=0.7), self.mat('tag_ink', palette_step('cloth_black', 1)), self.mat('tag_stud', palette_step('chrome', 1))
        x0 = max(lobe.x, outer.x - 0.004) + 0.010; y0 = lobe.y - 0.010; z0 = lobe.z + 0.004
        # the plate hangs straight down from the stud, its face turned 35 degrees from the side toward the front
        an = math.radians(62); nrm = Vector((math.cos(an), -math.sin(an), 0.0)); u = Vector((math.sin(an), math.cos(an), 0.0))
        base = Vector((x0, y0, z0))
        def plate(w, h, dz, off):
            bm = bmesh.new()
            corners = [(-w / 2, 0.0), (w / 2, 0.0), (w / 2 * 0.86, -h), (-w / 2 * 0.86, -h)]
            bm.faces.new([bm.verts.new(base + u * cx_ + Vector((0, 0, dz + cz_)) + nrm * off) for cx_, cz_ in corners])
            return bm
        self.obj('tag', 'plate', plate(0.040, 0.050, -0.002, 0.0), plastic)
        self.obj('tag', 'ink', plate(0.026, 0.007, -0.020, 0.0008), ink)
        self.obj('tag', 'ink2', plate(0.018, 0.006, -0.033, 0.0008), ink)
        bm = bmesh.new()
        for k in range(10):
            t = 2 * math.pi * k / 10
            bm.verts.new(base + nrm * 0.0009 + u * (0.0035 * math.cos(t)) + Vector((0, 0, -0.004 + 0.0035 * math.sin(t))))
        bm.faces.new(bm.verts[:])
        self.obj('tag', 'stud', bm, stud)
        self.hair_away('tag', [lobe, lobe + Vector((0.004, 0, -0.02)), lobe + Vector((0.004, -0.01, -0.035))], 0.030)

    def m_haunted(self):
        from mathutils import Vector
        M = self.M; C = M['C']; head = M['head']; hv = M['hv']
        # the sockets sunk 3 mm round each eye (the head's own vertices), the lids held wide (their own Surprised key, half)
        off = {}
        for e in (M['eL'], M['eR']):
            for i, p in enumerate(hv):
                d = math.hypot((p.x - e.x) / 0.030, (p.z - e.z) / 0.024)
                if d < 1.0 and p.y < C.y - 0.04: off[i] = off.get(i, Vector()) + Vector((0, 0.005 * (1 - d) ** 1.3, 0))
        self.key_on('haunted', head, 'sockets', off)
        self.made['haunted']['lids'] = True
        # the dark rings: the lids in the man's own skin two steps down and toward the bruise
        lids = M['lids']
        if lids is not None:
            s = self.skin_rgb(); b = palette_step('clay_rust', 0)
            dark = self.mat('haunted_lids_skin', tuple(int(0.34 * a + 0.30 * c) for a, c in zip(s, b)))
            lids.data.materials.append(dark); slot = len(lids.data.materials) - 1
            self.made['haunted']['mats'].append((lids, [p.index for p in lids.data.polygons], slot))
        # the white lock: the hair's faces in a strip from the left of the brow back over the crown
        white = self.mat('haunted_white_hair', palette_step('clay_bone', 4))
        for o in M['hair']:
            Mw = o.matrix_world; polys = []
            for p in o.data.polygons:
                c = Mw @ p.center
                az = math.atan2(c.x - C.x, -(c.y - C.y))
                if -0.42 < az < -0.20 and c.z > M['ez'] + 0.03: polys.append(p.index)
                elif c.z > M['ez'] + 0.08 and -0.42 < az + 0.15 * (c.z - M['ez'] - 0.08) / 0.1 < -0.20: polys.append(p.index)
            if polys:
                o.data.materials.append(white); self.made['haunted']['mats'].append((o, polys, len(o.data.materials) - 1))

    def m_blood(self):
        M = self.M; C = M['C']; ez = M['ez']
        dried, clot = self.mat('blood_dried_skin', palette_step('blood', 0)), self.mat('blood_clot_skin', palette_step('clay_rust', 0))
        x0, z0 = C.x - 0.036, ez + 0.046
        pts = [(x0, z0), (x0 - 0.008, z0 - 0.012), (x0 - 0.018, z0 - 0.024), (x0 - 0.028, z0 - 0.038), (x0 - 0.034, z0 - 0.056),
               (x0 - 0.036, z0 - 0.076), (x0 - 0.034, z0 - 0.094), (x0 - 0.030, z0 - 0.110)]
        self.obj('blood', 'run', self.ribbon(pts, [0.011, 0.010, 0.009, 0.0085, 0.008, 0.007, 0.0058, 0.0044], lift=0.0008), dried, thick=0.0006)
        pts2 = [(x0 - 0.028, z0 - 0.038), (x0 - 0.022, z0 - 0.054), (x0 - 0.020, z0 - 0.070)]
        self.obj('blood', 'branch', self.ribbon(pts2, 0.0040, lift=0.0009, taper=0.5), dried, thick=0.0005)
        self.obj('blood', 'clot', self.decal(x0 + 0.001, z0 + 0.002, 0.024, 0.012, ang=0.5, lift=0.0014, bulge=0.0010, shape='oval', rough_edge=0.35, seed=1, n=12), clot, thick=0.0008)

    def m_bandaid(self):
        M = self.M; C = M['C']; ez = M['ez']
        strip, pad, spot = self.mat('bandaid_strip', palette_step('tape_masking', 2)), self.mat('bandaid_pad', palette_step('tape_masking', 1)), self.mat('bandaid_spot', palette_step('clay_rust', 1))
        x0, z0 = C.x - 0.036, ez + 0.046
        self.obj('bandaid', 'strip', self.decal(x0, z0, 0.066, 0.021, ang=0.35, lift=0.0026, shape='round', bvh=M['skin_bvh'], n=26), strip, thick=0.0008)
        self.obj('bandaid', 'pad', self.decal(x0, z0, 0.022, 0.0160, ang=0.35, lift=0.0036, bulge=0.0006, shape='round', bvh=M['skin_bvh'], n=10), pad, thick=0.0006)
        self.obj('bandaid', 'spot', self.decal(x0 + 0.001, z0, 0.013, 0.009, ang=0.7, lift=0.0044, shape='oval', bvh=M['skin_bvh'], rough_edge=0.35, seed=4, n=8), spot, thick=0.0003)

    # -- shooting ----------------------------------------------------------------------------------------------------
    def keys(self, mark, on):
        """the mark's shape keys (and the haunted lids), set after the mouth so a mouth never resets them"""
        w = self.made.get(mark)
        if not w: return
        for o, k in w['keys']: o.data.shape_keys.key_blocks[k].value = 1.0 if on else 0.0
        if w.get('lids') and self.M['lids'] is not None and self.M['lids'].data.shape_keys:
            kb = self.M['lids'].data.shape_keys.key_blocks
            if 'Surprised' in kb: kb['Surprised'].value = 0.5 if on else 0.0

    def set(self, mark, on):
        w = self.made.get(mark)
        if not w: return
        for o in w['objs']: o.hide_render = not on
        for o, polys, slot in w['mats']:
            key = '_wound_saved_%s' % mark
            if on:
                o[key] = [o.data.polygons[i].material_index for i in polys]
                for i in polys: o.data.polygons[i].material_index = slot
            elif key in o:
                for i, m in zip(polys, o[key]): o.data.polygons[i].material_index = m
                del o[key]
            o.data.update()

    def shoot(self, sc, objs, keyed, shot, FACINGS, out):
        """each mark on its own, front-on, rest and (for the marks the jaw can move or cover) the four mouths"""
        S = FACINGS.index('S')
        def mouth(e):
            for o in keyed:
                if not o.data.shape_keys: continue
                kb = o.data.shape_keys.key_blocks
                for b in kb:
                    if not b.name.startswith('wound_'): b.value = 0.0
                if e and e in kb: kb[e].value = 1.0
        try:
            import bpy
            dg = bpy.context.evaluated_depsgraph_get()
            for o in self.objs:
                rest = [o.matrix_world @ v.co for v in o.data.vertices]
                e = o.evaluated_get(dg); m = e.to_mesh(); pos = [e.matrix_world @ v.co for v in m.vertices]; e.to_mesh_clear()
                span = lambda P: [round(max(p[i] for p in P) - min(p[i] for p in P), 4) for i in range(3)] if P else None
                self.log.append(dict(posed=o.name, rest_span=span(rest), posed_span=span(pos)))
        except Exception as e_:
            self.log.append(dict(posed_error=repr(e_)))
        t0 = time.time(); n = 0
        LIFE = {'_blink': {'portrait_head_lids': {'Blink': 1.0}}, '_wince': {'portrait_head': {'Angry': 0.7}, 'portrait_head_lids': {'Angry': 0.7, 'Blink': 0.38}}}
        for life in ('_blink', '_look_l', '_look_r', '_wince'):
            if life not in self.made: continue
            mouth(None)
            for o in keyed:
                for nm, v in LIFE.get(life, {}).get(o.name, {}).items():
                    if o.data.shape_keys and nm in o.data.shape_keys.key_blocks: o.data.shape_keys.key_blocks[nm].value = v
            self.keys(life, True)
            shot(os.path.join(out, 'raw_life_%s.png' % life[1:]), S); n += 1
            self.keys(life, False); mouth(None)
        for mark in sorted(m for m in self.made if not m.startswith('_')):
            self.set(mark, True)
            for e in ((None,) + MOUTH if MARKS[mark]['keys'] == 'all' else (None,)):
                mouth(e); self.keys(mark, True)
                if e is None:   # a mark that changes the resting face (the lung's open mouth)
                    for o in keyed:
                        for nm, v in self.made[mark].get('face', {}).get(o.name, {}).items():
                            if o.data.shape_keys and nm in o.data.shape_keys.key_blocks: o.data.shape_keys.key_blocks[nm].value = v
                shot(os.path.join(out, 'raw_wound_%s_%s.png' % (mark, e or 'rest')), S); n += 1
            self.keys(mark, False); mouth(None)
            self.set(mark, False)
        self.log.append(dict(shots=n, seconds=round(time.time() - t0, 1)))


def rig_code(look, glb, out, h, samples, still_clip, only=None):
    """DIRECTION's master rig, patched in memory (the file on disk is never written): the marks added right after the import,
    left out of the ruler, hidden from every base frame, shot after the base's own portrait; only the front portrait"""
    src = open(os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')).read()
    P = [("PORTRAIT_FACINGS = ['S', 'SE', 'SW']", "PORTRAIT_FACINGS = ['S']"),
         ("    objs = [o for o in sc.objects if o.type == 'MESH']\n",
          "    _W.prepare(sc)\n    objs = [o for o in sc.objects if o.type == 'MESH' and not o.name.startswith('wound_')]\n"),
         ("    source = source_pass(objs, A['wear'], k, A['seed']) if A['wear'] > 0 else None",
          "    source = source_pass(objs + _W.objs, A['wear'], k, A['seed']) if A['wear'] > 0 else None"),
         ("    if source and float(G['dent_m']) > 0: source['dents'] = dent_pass(objs, k)",
          "    if source and float(G['dent_m']) > 0: source['dents'] = dent_pass(objs + _W.objs, k)"),
         ("    stills = [shot(os.path.join(out, 'raw_%s.png' % f), i) for i, f in enumerate(FACINGS)]", "    stills = []"),
         ("        portrait = dict(head_px=head_px,", "        _W.shoot(sc, objs, keyed, shot, FACINGS, out)\n        portrait = dict(head_px=head_px,"),
         ("sc.render.engine = G['engine'];", "sc.render.use_persistent_data = True; " +
          ("sc.render.threads_mode = 'FIXED'; sc.render.threads = %d; " % int(os.environ['BOHEMIA_RIG_THREADS']) if os.environ.get('BOHEMIA_RIG_THREADS') else '') +
          "sc.render.engine = G['engine'];"),
         ("if __name__ == '__main__':\n    A = args()", "if False:\n    A = args()")]
    for a, b in P:
        assert src.count(a) == 1, 'the master rig changed (%r): re-read it before patching in memory' % a[:60]
        src = src.replace(a, b)
    argv = ['bohemia_direction_master_rig.py', glb, out, '--real-height', str(h), '--family', 'none', '--set', 'samples=%d' % samples,
            '--no-calibration', '--no-id-pass', '--portrait', '128', '--stills-only']
    if samples == SAMPLES_PEOPLE: argv += ['--set', 'dent_m=0']
    if still_clip: argv += ['--clip', still_clip]
    for e in MOUTH: argv += ['--expression', e]
    tail = '''
import json as _json
_A = args(); os.makedirs(_A['out'], exist_ok=True)
_meta, _st, _cl, _por = render(_A)
_por.pop('raw', None); _por.pop('raw_expressions', None)
_json.dump(dict(look=%r, stamp=%r, portrait=_por, log=_W.log, made=sorted(_W.made)), open(os.path.join(_A['out'], 'wounds_render.json'), 'w'), indent=1, default=str)
print('WOUNDS RENDERED', %r, sorted(_W.made))
''' % (look, STAMP, look)
    head = ('import sys; sys.argv = %r; __file__ = %r; sys.path.insert(0, %r)\n' % (argv, os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py'), os.path.join(ROOT, 'tools')) +
            'import bohemia_portrait_the_face_shows_the_wound as _WM\n_W = _WM.Wounds(%r)\n' % (only,))
    return head + src + tail


def bpy_python():
    return os.environ.get('BOHEMIA_BPY') or 'python3.11'


def run(cmd, out, tries=2):
    """bpy 4.2 headless dies now and then as Blender exits, after the file is written (COMBAT measured it 10/19)"""
    for i in range(tries):
        t0 = time.time()
        r = subprocess.call(cmd, cwd=ROOT)
        if r == 0 or (os.path.exists(out) and os.path.getmtime(out) >= t0 - 1): return True
    return False


def person(look, only=None):
    """build the man's model (the builder his face came from), render his marks, pack them"""
    py = bpy_python(); t0 = time.time()
    raw = os.path.join(ROOT, RAW, look); os.makedirs(raw, exist_ok=True)
    if portrait_made(look):
        who = look.upper()
        glb = os.path.join(ROOT, 'records/portrait/rig/crew/%s_head.glb' % look)
        if not os.path.exists(glb):
            if look.startswith('faction_'):
                g = look[len('faction_'):].capitalize()
                run([py, 'tools/bohemia_portrait_the_head_from_the_model.py', '--faction-body', g], os.path.join(ROOT, 'records/portrait/rig/crew/bodies/%s.glb' % g.lower()))
            else:
                run([py, 'tools/bohemia_portrait_the_head_from_the_model.py', '--crew-body', who], os.path.join(ROOT, 'records/portrait/rig/crew/bodies/crew_%s.glb' % look))
            run([py, 'tools/bohemia_portrait_the_head_from_the_model.py', who, glb], glb)
        h, samples, still = 1.72, 128, None
    else:
        pid = look[len('person_'):]
        glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % look)
        if not os.path.exists(glb):
            run([py, 'tools/bohemia_run2_no_two_people_alike.py', 'build-one', pid], glb)
        h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
        samples, still = SAMPLES_PEOPLE, 'Stand:1'
    if not os.path.exists(glb):
        print('NO MODEL', look); return False
    t1 = time.time()
    code = os.path.join(raw, '_rig_wounds.py')
    open(code, 'w').write(rig_code(look, glb, raw, h, samples, still, only))
    ok = run([py, code], os.path.join(raw, 'wounds_render.json'))
    t2 = time.time()
    if ok: pack(look)
    print('PERSON %s build %.0fs render %.0fs ok=%s' % (look, t1 - t0, t2 - t1, ok), flush=True)
    return ok


def shard(i, n):
    req = json.load(open(os.path.join(ROOT, REQUEST)))
    looks = req['people'] if req.get('people') != 'all' else people()
    life = [l for l in req.get('life_only') or [] if l not in looks]   # the speakers: the breathing frames only, no marks
    looks = looks + life
    mine = [l for k, l in enumerate(looks) if k % n == i]
    workers = int(os.environ.get('BOHEMIA_WOUND_WORKERS', '1'))
    print('shard %d of %d: %d people, %d at once' % (i, n, len(mine), workers), flush=True)
    only = lambda l: ['-'] if l in life else req.get('marks')
    if workers <= 1:
        for l in mine: person(l, only(l))
        return
    import concurrent.futures as cf
    with cf.ThreadPoolExecutor(workers) as ex:
        list(ex.map(lambda l: subprocess.call([sys.executable, os.path.abspath(__file__), 'person', l] + (['--only', ','.join(only(l))] if only(l) else []), cwd=ROOT), mine))


# ---- PACKING (plain python) ------------------------------------------------------------------------------------------
def ring_like_the_rig(a, ring=8.0, thr=127):
    """the rig's post() on one frame, as it runs on the base: binary alpha, the outer pixel ring darker by the ring value and
    moved to the nearest colour the inside already uses (tools/bohemia_direction_master_rig.py post(), the same steps)"""
    import numpy as np
    a = a.astype(float).copy()
    op = a[..., 3] > thr; a[..., 3] = np.where(op, 255, 0)
    p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    rg = op & ~inner
    a[..., :3] = np.round(a[..., :3])
    if rg.any() and inner.any():
        want = np.clip(a[..., :3][rg] - ring, 0, 255)
        pal = np.unique(a[..., :3][inner].reshape(-1, 3), axis=0)
        best = np.empty_like(want)
        for i in range(0, len(want), 256):
            d = ((want[i:i + 256, None, :] - pal[None, :, :]) ** 2).sum(2); best[i:i + 256] = pal[d.argmin(1)]
        a[..., :3][rg] = best
    return a.astype(np.uint8)


def dilate(m, it=1):
    import numpy as np
    for _ in range(it):
        p = np.pad(m, 1)
        m = p[1:-1, 1:-1] | p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:] | p[:-2, :-2] | p[2:, 2:] | p[:-2, 2:] | p[2:, :-2]
    return m


def pack(look):
    """raw frames -> the man's patches: the base's crop box and window, BOX to 128 and 64, each mark kept where it changes the
    face (ADD: the marked pixels drawn over his face; CUT: what of his face the mark takes away, drawn as a clear), one atlas
    and one index a man; and how far this run's base is from the face he wears today"""
    import numpy as np
    from PIL import Image
    import bohemia_portrait_the_head_from_the_model as PM
    raw = os.path.join(ROOT, RAW, look)
    pj_path, face_dir = base_of(look)
    pj = json.load(open(os.path.join(ROOT, pj_path)))
    box = pj['crop_box_px']
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    def frame(fn):
        a = np.asarray(Image.open(fn).convert('RGBA'))
        return Image.fromarray(ring_like_the_rig(a, float(G['ring']), int(G['alpha_threshold'])), 'RGBA').crop(tuple(box))
    base = {}
    for k in KEYS:
        fn = os.path.join(raw, 'raw_portrait_S.png' if k == 'rest' else 'raw_portrait_S_%s.png' % k)
        if os.path.exists(fn): base[k] = frame(fn)
    if 'rest' not in base: raise SystemExit('no base frame for %s' % look)
    win = PM.hand_off_window(base['rest'], pj['head_px'])
    sq = lambda im, n: im.crop(win).resize((n, n), Image.BOX)
    B = {k: {n: np.asarray(sq(im, n)).astype(int) for n in (128, 64)} for k, im in base.items()}
    drift = {}
    for n in (128, 64):   # this run's base against the face he wears: the patches go over THAT face
        fn = os.path.join(ROOT, face_dir, 'rest_%d.png' % n)
        if os.path.exists(fn):
            a = np.asarray(Image.open(fn).convert('RGBA')).astype(int); b = B['rest'][n]
            op = (a[..., 3] > 0) | (b[..., 3] > 0); d = np.abs(a - b)[op].max(1)
            drift[n] = dict(mean=round(float(d.mean()), 2), p95=round(float(np.percentile(d, 95)), 1), over16=round(float((d > 16).mean()), 4))
    patches = []   # (mark, key, size, kind, image, (dx, dy))
    for mark in sorted(MARKS) + list(LIFE):
        for k in (KEYS if mark in MARKS and MARKS[mark]['keys'] == 'all' else ('rest',)):
            fn = os.path.join(raw, ('raw_wound_%s_%s.png' % (mark, k)) if mark in MARKS else ('raw_life_%s.png' % mark[1:]))
            if not os.path.exists(fn): continue
            full = frame(fn)
            for n in (128, 64):
                m_ = np.asarray(sq(full, n)).astype(int); b_ = B[k if k in B else 'rest'][n]
                changed = np.abs(m_ - b_).max(2) > ((6 if n == 128 else 5) if mark in MARKS else (3 if n == 128 else 2))   # a blink at 64 is a pixel or two
                if not changed.any(): continue
                mask = dilate(changed, 1)
                add = np.zeros_like(m_); sel = mask & (m_[..., 3] > 0)
                add[sel] = m_[sel]
                cut = np.zeros_like(m_); gone = mask & (b_[..., 3] > m_[..., 3])
                cut[gone, 3] = (b_[gone, 3] - m_[gone, 3]).clip(0, 255)
                for kind, im in (('add', add), ('cut', cut)):
                    ys, xs = np.nonzero(im[..., 3] > 0)
                    if not len(ys): continue
                    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
                    patches.append((mark, k, n, kind, Image.fromarray(im[y0:y1, x0:x1].astype(np.uint8), 'RGBA'), (int(x0), int(y0))))
    W, x, y, sh = 512, 0, 0, 0; place = []   # one atlas: shelves, the 128s first
    for p in sorted(patches, key=lambda p: (-p[2], -p[4].height, p[0], p[1], p[3])):
        im = p[4]
        if x + im.width > W: x, y, sh = 0, y + sh + 1, 0
        place.append((p, (x, y))); x += im.width + 1; sh = max(sh, im.height)
    H = y + sh + 1
    atlas = Image.new('RGBA', (W, max(1, H)), (0, 0, 0, 0))
    rows = {}
    for (mark, k, n, kind, im, (dx, dy)), (ax, ay) in place:
        atlas.paste(im, (ax, ay))
        rows.setdefault(mark, {}).setdefault(k, {}).setdefault(str(n), {})[kind] = [ax, ay, im.width, im.height, dx, dy]
    od = os.path.join(ROOT, OUT); os.makedirs(od, exist_ok=True)
    atlas.save(os.path.join(od, '%s.png' % look), optimize=True)
    rjp = os.path.join(raw, 'wounds_render.json')
    rj = json.load(open(rjp)) if os.path.exists(rjp) else {}
    idx = dict(look=look, stamp=STAMP, atlas='%s/%s.png' % (OUT, look), w=W, h=H, window=list(win), crop_box=box,
               base=dict(portrait=pj_path, faces=face_dir, drift_from_this_run=drift), rows=rows, marks=sorted(rows),
               failed=[l['mark'] for l in rj.get('log', []) if l.get('mark') and not l.get('ok')])
    json.dump(idx, open(os.path.join(od, '%s.json' % look), 'w'), separators=(',', ':'))
    os.makedirs(os.path.join(ROOT, LOGS), exist_ok=True)   # the runner's log: committed, never published (records/target is)
    json.dump(rj, open(os.path.join(ROOT, LOGS, '%s.json' % look), 'w'), indent=1, default=str)
    print('PACK %s: %d patches, atlas %dx%d, marks %d, drift %s, failed %s' % (look, len(patches), W, H, len(rows), drift, idx['failed']))


def wear(face, J, A, mark, key, n):
    """one mark on a face image (PIL RGBA, n px): the cut cleared, then the add drawn, the way the engine draws it"""
    import numpy as np
    from PIL import Image
    r = J['rows'].get(mark, {})
    q = r.get(key) or r.get('rest') or {}
    q = q.get(str(n)) or {}
    if 'cut' in q:
        sx, sy, w, h, dx, dy = q['cut']
        f = np.asarray(face).astype(int).copy(); c = np.asarray(A.crop((sx, sy, sx + w, sy + h))).astype(int)
        f[dy:dy + h, dx:dx + w, 3] = (f[dy:dy + h, dx:dx + w, 3] * (255 - c[..., 3]) // 255)
        face = Image.fromarray(f.astype(np.uint8), 'RGBA')
    if 'add' in q:
        sx, sy, w, h, dx, dy = q['add']
        face = face.copy(); face.alpha_composite(A.crop((sx, sy, sx + w, sy + h)), (dx, dy))
    return face


# ---- THE VOTE SHEET --------------------------------------------------------------------------------------------------
def sheet(out='slices/vote/PORTRAIT_THE_FACE_SHOWS_THE_WOUND.webp', looks=None):
    """THE STAGES first (a man struck down today, past half his days, healed, at 128 and the 64 thumb), then every man with
    every mark at 128 and 64, his face today in the first column (the twin), the mark's name under each"""
    from PIL import Image, ImageDraw
    od = os.path.join(ROOT, OUT)
    if not looks:   # YOU and the starting company (records/target/bb/ours.json people_looks.crew): the men he meets first
        o = json.load(open(os.path.join(ROOT, 'records/target/bb/ours.json'))); pl = o['people_looks'].get('value', o['people_looks'])
        looks = [l for l in dict.fromkeys(['you'] + list(pl['crew'])) if os.path.exists(os.path.join(od, l + '.json'))]
    order = sorted(MARKS, key=lambda k: (MARKS[k]['layer'], k))
    INK, DIM, BG, CELL = (226, 214, 190), (150, 142, 128), (24, 22, 20), (52, 48, 44, 255)
    cw, ch = 136, 128 + 64 + 34
    def load(look):
        J = json.load(open(os.path.join(od, look + '.json')))
        return J, Image.open(os.path.join(ROOT, J['atlas'])).convert('RGBA'), {n: Image.open(os.path.join(ROOT, J['base']['faces'], 'rest_%d.png' % n)).convert('RGBA') for n in (128, 64)}
    has = lambda J, m, n: bool(J['rows'].get(m, {}).get('rest', {}).get(str(n)))
    def face(J, A, base, marks, n):   # the engine's way: a mark his gear covers is the surgeon's tag instead (COVERED)
        im = base[n].copy()
        use = list(dict.fromkeys(m if has(J, m, n) else 'tag' for m in marks if has(J, m, n) or has(J, 'tag', n)))
        for m in sorted(use, key=lambda k: (MARKS[k]['layer'], k)): im = wear(im, J, A, m, 'rest', n)
        bg = Image.new('RGBA', im.size, CELL); bg.alpha_composite(im); return bg.convert('RGB')
    STAGE_MEN = [(l, m) for l, m in (('person_town_0', 'eye_patch'), ('person_town_5', 'nose_gone'), ('person_town_14', 'skull_stitches')) if l in looks]
    stw = 12 + 3 * (256 + 64 + 24)
    W = max(12 + 120 + cw * (len(order) + 1), stw)
    H = 64 + 300 * len(STAGE_MEN) + 40 + ch * len(looks)
    S = Image.new('RGB', (W, H), BG); dr = ImageDraw.Draw(S)
    dr.text((12, 8), "PORTRAIT: THE FACE SHOWS THE WOUND (rule 234(c)). Each mark is geometry on the man's own model, rendered under the rig's one sun, drawn over the face he wears.", fill=INK)
    dr.text((12, 24), "128 px (shown at 2x) and 64 px 1:1 | palette: records/target/BOHEMIA_STYLE_PALETTE.json | ONE light: the rig's sun, upper left | the twin: his face today", fill=DIM)
    dr.text((12, 40), 'HIS FACE AS THE DAYS PASS: struck down today (the mark for life, the blood, the band-aid), past half his days (the band-aid), healed (the mark alone)', fill=INK)
    y = 64
    for look, mark in STAGE_MEN:
        J, A, base = load(look)
        for c, (lab, ms) in enumerate((('STRUCK DOWN TODAY', [mark, 'blood', 'bandaid']), ('PAST HALF HIS DAYS', [mark, 'bandaid']), ('HEALED: ' + MARKS[mark]['name'], [mark]))):
            x = 12 + c * (256 + 64 + 24)
            S.paste(face(J, A, base, ms, 128).resize((256, 256), Image.NEAREST), (x, y)); S.paste(face(J, A, base, ms, 64), (x + 262, y + 192))
            dr.text((x, y + 262), lab, fill=INK)
        y += 300
    dr.text((12, y + 8), 'EVERY MARK ON YOU AND YOUR STARTING CREW, 1:1 (the first column is his face today; GEAR HIDES IT: his collar or hood covers that mark, so the surgeon\'s tag in his ear shows instead)', fill=INK)
    y += 40
    for r, look in enumerate(looks):
        J, A, base = load(look)
        yy = y + r * ch
        dr.text((12, yy + 4), look.replace('person_', ''), fill=INK)
        for c, mark in enumerate([None] + order):
            x = 12 + 120 + c * cw
            S.paste(face(J, A, base, [mark] if mark else [], 128), (x, yy)); S.paste(face(J, A, base, [mark] if mark else [], 64), (x, yy + 132))
            cov = mark and not has(J, mark, 128)
            dr.text((x, yy + 132 + 68), ('GEAR HIDES IT: TAG' if cov else (MARKS[mark]['name'] if mark else 'TODAY'))[:21], fill=(200, 170, 90) if cov else INK)
    S.save(os.path.join(ROOT, out), quality=92)
    print('sheet', out, S.size, 'first', [12, 64, 3 * (256 + 64 + 24) - 24, 280])


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    only = sys.argv[sys.argv.index('--only') + 1].split(',') if '--only' in sys.argv else None
    if cmd == 'data': data()
    elif cmd == 'person': person(sys.argv[2], only)
    elif cmd == 'shard': shard(int(sys.argv[2]), int(sys.argv[3]))
    elif cmd == 'pack': pack(sys.argv[2])
    elif cmd == 'sheet': sheet(*sys.argv[2:3])
    elif cmd == 'people': print('\n'.join(people()))
    else: print(__doc__)
