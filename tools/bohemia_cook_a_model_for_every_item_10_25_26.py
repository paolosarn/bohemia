#!/usr/bin/env python3
"""BOHEMIA -- COOK [a model for every item] (rule 177(c), Paolo 10/25: 'I'm not seeing all the weapons, armour and off-hand
items in the actual combat; I gave everyone car door shields and I don't see that; can you just stop fucking with me?').
EVERY ITEM THE STASH CAN HOLD GETS A MODEL IN THE RIG'S FORMAT, so ANIMATION renders it as a layer on the same skeleton
([gear as layers on the rig]) and COMBAT draws it from each man's gear ([the fight draws what he wears]).

MEASURED FIRST (`list`): the stash holds the rows of records/target/bb/weapons.json (126) and armor.json (78 body, 87 head,
19 shields): 310 rows. A player meets them as 23 OBJECTS, the names the market, the loot and the crew screen give them
(RUN TWO's armourName and the weapon classes, mirrored word for word in slices/bohemia_ui_materials.js OBJ_CLASS), plus
the three melee shapes ANIMATION draws by row (the club, the nail bat, the hatchet) and the Heavy's crash-bar (the fight
draws his Heavy Metal Shield as it): 27 in all. Before this round 3 of the 27 had a model a tool can import (COOK's three
guns); 8 more lived only inside ANIMATION's melee tool as inline sketches (the car door, the crash bar among them), and the
armour and head gear had none. The table: records/target/cook_every_item/BOHEMIA_EVERY_ITEM_AND_ITS_MODEL.json; the
manifest a renderer reads: reference/models/bohemia/items.json.

THE RIG'S FORMAT (read off the tools that already import a held thing, never invented):
  HELD (a weapon)  reference/models/bohemia/item_<name>.glb at REAL SIZE in metres, the frame COMBAT's guns tool and
                   ANIMATION's place() put in a fist: the origin the middle of the right hand's grip, the haft or the
                   barrel along +X, the edge or the striking face toward +Z (COOK's guns already sit that way). A haft
                   is drawn 1.35 times its girth (ANIMATION's FAT: at 57 px a metre a real haft is one pixel). A two-hand
                   weapon names where its left hand goes ('left_x', metres along +X) in the manifest.
  SHIELD           the same glb at real size, the frame ANIMATION's build_shield and place_shield use: the face out along
                   +X (the side a blow lands on), the width along +Y, up +Z, the side against his forearm at x = 0 and
                   the forearm's middle at the origin; the forearm runs along Z behind it, through the elbow loop and
                   to the grip (their heights in the manifest).
  WORN (armour, head gear)  a glb carrying THE RIG'S MAN'S OWN SKELETON (CesiumMan's 19 bones: measured identical in
                   CesiumMan.glb, PORTRAIT's thug and COOK THREE's raider, every bone's rest head to the millimetre),
                   its meshes skinned to those bones by name, in the model's own units (the man is about 1.5 tall in the
                   file; the master rig scales him to 1.72 m), built over the thug's clothed body
                   (records/portrait/rig/thug_head.glb) so it clears a coat. A renderer binds the meshes to any look's
                   armature (the same bone names, the same rest) and calls fit() here, which pushes every vertex out
                   past that look's own body by the margin, so a bigger belly or a longcoat never pokes through.

THE PALETTE: act one (rule 159: faded, dirty, rare colour; fenced by 167(b): never drained to grey): every base colour a
step of records/target/BOHEMIA_STYLE_PALETTE.json through COOK's props modeller (tools/bohemia_cook_model_props.py
mat()), at most five materials a model (the style guide's prop cap), the detail modelled, never painted (a glb carries
no procedural texture). One colour per thing where colour belongs: the car door's sun-killed teal, the fire axe's
faded red, the plate's pale ground; the rest is steel, rust, rubber and wood.

    <venv>/bin/python tools/bohemia_cook_a_model_for_every_item_10_25_26.py model <name ...|all>   build the glb(s)
    <venv>/bin/python tools/bohemia_cook_a_model_for_every_item_10_25_26.py man <name>   the check scene: the thing on
        the thug (a shield on his left forearm, a weapon in his right fist, armour on his skeleton), as one glb, in his
        Stand still, then rendered by DIRECTION's master rig (imported and called, never edited)
    python3 tools/bohemia_cook_a_model_for_every_item_10_25_26.py list         the table and the manifest
    python3 tools/bohemia_cook_a_model_for_every_item_10_25_26.py sheet <name ...>   the compare sheet: the thing alone in
        eight facings and on the man in eight, over a crop of a real fight floor, beside YOU's own fight-sheet cell, at
        1:1 and x3 (records/target/cook_every_item/check_<name>.webp)

REUSE CHECK: the palette and mat/box/cyl/rod are COOK's props modeller's; lathe/loft/link are COOK's icons tool's; the
render is DIRECTION's master rig; the skeleton, the body and the weights are the rig's man's; CHARACTER's crash bar
(tools/bohemia_character_the_three_enemies.py) is the crash bar's spec, ANIMATION's sketches the car door's.
REFERENCE CHECK (the 9/4 standing duty, the compare law): every model is judged on the man, on a fight floor, beside a
man already in the game, at the fight's own pixels (the sheet). Real things at real sizes: a sedan's front door cut at
the beltline 0.92 x 0.62 m, a pickup's push bar 0.48 x 0.62 m in 1.25 in tube, a ballistic shield 0.52 x 0.9 m. Analog
horror AH-01: scavenged, shot, rusted, strapped on with a seatbelt. Battle Brothers draws a man from layers (body,
armour, helmet, weapon, shield): that is the study, no other reference game.
"""
import json, math, os, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
MODELS = os.path.join(ROOT, 'reference/models/bohemia')
MANIFEST = os.path.join(MODELS, 'items.json')
OUT = os.path.join(ROOT, 'records/target/cook_every_item')
TABLE = os.path.join(OUT, 'BOHEMIA_EVERY_ITEM_AND_ITS_MODEL.json')
MAN_SRC = os.path.join(ROOT, 'records/portrait/rig/thug_head.glb')   # a clothed man of the game on the rig's skeleton
MAN = os.path.join(ROOT, 'records/target/cook_every_item/check/thug_posed.glb')   # him with COMBAT's clips laid on (Stand first)
VENV = os.environ.get('BOHEMIA_BPY', '/tmp/v/bin/python')
FAT = 1.35        # ANIMATION's: a haft drawn 1.35 times its real girth so it is more than one pixel at 57 px a metre
HEAD_BONE, NECK_BONE = 'Skeleton_neck_joint_2', 'Skeleton_neck_joint_1'
VERSION = 'cook-every-item-10-25'

# ------------------------------------------------------------------------------------------------ the objects
# kind: held (a weapon), shield, worn_body, worn_head. 'glb' None = not built yet. 'made' = who modelled it.
OBJECTS = {
    # ---- the off hand
    'car_door':   dict(kind='shield', name='a car door', w=0.92, h=0.62,
                       say='a sedan\'s front door cut off at the beltline: the sun-killed teal skin with its crease, a dent filled and gone '
                           'pale, rust up the bottom seam, four bullet holes punched out bright, the handle, the mirror\'s black sail with '
                           'the mirror snapped off, the window channel with three teeth of glass still in it, the hinges torn off the front '
                           'edge; behind, the bare inner panel with its three holes and a seatbelt looped for the forearm'),
    'crash_bar':  dict(kind='shield', name='a crash-bar shield', w=0.48, h=0.62,
                       say='a pickup\'s push bar cut off and strapped on (CHARACTER\'s Heavy): two bent uprights of tube with their black '
                           'rubber push pads, three crossbars, a dented diamond plate welded behind, a dead Nevada plate riveted on, rust '
                           'at every weld; behind, two loops of webbing and a grip bar'),
    'riot_shield': dict(kind='shield', name='a riot shield', w=0.52, h=0.9,
                        say='a police ballistic shield gone grey-black in the sun: a curved slab with a thick rim, a scratched viewport, '
                            'POLICE in white letters half scraped off, gouges down to the bare fibre; behind, the arm cuff and the handle'),
    # ---- the main hand: COOK's guns (10/18), untouched
    'pistol':     dict(kind='held', name='pistol', glb='gun_pistol_a.glb', hands=1, made='COOK 10/18 (the rig\'s first guns)'),
    'shotgun':    dict(kind='held', name='shotgun', glb='gun_shotgun_a.glb', hands=2, made='COOK 10/18'),
    'rifle':      dict(kind='held', name='rifle', glb='gun_rifle_a.glb', hands=2, made='COOK 10/18'),
    # ---- the main hand: everything else the market names
    'pipe':       dict(kind='held', name='pipe', hands=1),
    'sledge':     dict(kind='held', name='sledge', hands=2),
    'bottles':    dict(kind='held', name='bottles', hands=1),
    'machete':    dict(kind='held', name='machete', hands=1),
    'fire_axe':   dict(kind='held', name='fire axe', hands=2),
    'rebar_spear': dict(kind='held', name='rebar spear', hands=2),
    'cleaver':    dict(kind='held', name='cleaver', hands=1),
    'chain':      dict(kind='held', name='chain', hands=1),
    'pole_hook':  dict(kind='held', name='pole hook', hands=2),
    'compound_bow': dict(kind='held', name='compound bow', hands=2),
    # ---- ANIMATION's by-row shapes (BOHEMIA_MELEE_AND_SHIELD.json by_row): the same stash rows drawn as what they are
    'club':       dict(kind='held', name='club (the wooden stick)', hands=1),
    'bat':        dict(kind='held', name='nail bat (the morning star)', hands=1),
    'hatchet':    dict(kind='held', name='hatchet (the hatchet, the handaxe)', hands=1),
    # ---- the body
    'work_jacket':      dict(kind='worn_body', name='a work jacket'),
    'padded_vest':      dict(kind='worn_body', name='a padded vest'),
    'plate_carrier':    dict(kind='worn_body', name='a plate carrier'),
    'full_riot_armour': dict(kind='worn_body', name='full riot armour'),
    # ---- the head
    'rag_hood':      dict(kind='worn_head', name='a rag hood'),
    'hard_hat':      dict(kind='worn_head', name='a hard hat'),
    'riot_helmet':   dict(kind='worn_head', name='a riot helmet'),
    'full_riot_helm': dict(kind='worn_head', name='a full riot helm'),
}
# the weapon classes as the market names them (RUN TWO's CLASSNAME, UI's OBJ_CLASS), and ANIMATION's by-row shapes
BY_CLASS = {'dagger': 'pistol', 'mace': 'pipe', 'hammer': 'sledge', 'crossbow': 'rifle', 'firearm': 'shotgun', 'throwing': 'bottles',
            'throwable_item': 'bottles', 'sword': 'machete', 'axe': 'fire_axe', 'spear': 'rebar_spear', 'cleaver': 'cleaver',
            'flail': 'chain', 'polearm': 'pole_hook', 'bow': 'compound_bow'}
BY_ROW = {'wooden_stick': 'club', 'morning_star': 'bat', 'hatchet': 'hatchet', 'handaxe': 'hatchet'}
SHIELD_BY_ROW = {'heavy_metal_shield': 'crash_bar'}     # the Heavy's: the fight draws it as his crash bar (COMBAT's THE HEAVY)


def armour_object(kind, dur):
    """RUN TWO's armourName, word for word (BOHEMIA_SETTLEMENT_SCREEN.html, engine/bohemia_roster.js)"""
    if kind == 'head': return 'rag_hood' if dur < 40 else 'hard_hat' if dur < 100 else 'riot_helmet' if dur < 180 else 'full_riot_helm'
    if kind == 'shields': return 'car_door' if dur < 40 else 'riot_shield'
    return 'work_jacket' if dur < 40 else 'padded_vest' if dur < 100 else 'plate_carrier' if dur < 180 else 'full_riot_armour'


def glb_of(name):
    o = OBJECTS[name]
    return o.get('glb') or 'item_%s.glb' % name


def built(name):
    return os.path.exists(os.path.join(MODELS, glb_of(name)))


# ------------------------------------------------------------------------------------------------ list (plain python)
def do_list():
    W = json.load(open(os.path.join(ROOT, 'records/target/bb/weapons.json')))
    A = json.load(open(os.path.join(ROOT, 'records/target/bb/armor.json')))
    anim = json.load(open(os.path.join(ROOT, 'records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json')))
    rows = []
    for r in W['rows']:
        ob = BY_ROW.get(r['id']) or BY_CLASS.get(r['class'], 'pipe')
        rows.append(dict(id=r['id'], kind='weapon', bb_name=r['name'], cls=r['class'], object=ob))
    for k in ('body', 'head', 'shields'):
        for r in A[k]:
            ob = SHIELD_BY_ROW.get(r['id']) if k == 'shields' else None
            rows.append(dict(id=r['id'], kind={'shields': 'shield'}.get(k, k), bb_name=r['name'], durability=r['durability'],
                             object=ob or armour_object(k, r['durability']), market_name=OBJECTS[armour_object(k, r['durability'])]['name']))
    by_obj = {}
    for r in rows: by_obj.setdefault(r['object'], []).append(r['id'])
    sketch = set(anim['props']) - {'pistol', 'sign'}
    objs = {}
    for n, o in OBJECTS.items():
        g = glb_of(n)
        objs[n] = dict(kind=o['kind'], name=o['name'], rows=len(by_obj.get(n, [])), glb='reference/models/bohemia/' + g,
                       built=built(n), checked=bool(o.get('glb')) or os.path.exists(os.path.join(OUT, 'check_%s.webp' % n)), before_this_round=('COOK\'s gun glb' if o.get('glb') else
                                                          'an inline sketch inside ANIMATION\'s melee tool, no file' if n in sketch else 'nothing'))
    before = sum(1 for v in objs.values() if v['before_this_round'] == 'COOK\'s gun glb')
    now = sum(1 for v in objs.values() if v['built'] and v['checked'])
    T = dict(version=VERSION, lane='cook', row='[a model for every item]', rule='177(c)',
             what='every row the stash can hold (records/target/bb/weapons.json, armor.json) -> the object a player meets it as -> its model',
             rows_total=len(rows), objects_total=len(objs), objects_with_a_model_before=before, objects_with_a_model_now=now,
             objects=objs, rows=rows,
             naming_note='heavy_metal_shield is drawn as the Heavy\'s crash bar in the fight, while the market names every shield of '
                         'durability 40 or more \'a riot shield\'; the model follows the fight (UI and RUN TWO may name it a crash-bar shield)')
    os.makedirs(OUT, exist_ok=True)
    json.dump(T, open(TABLE, 'w'), indent=1)
    write_manifest(by_obj)
    print('rows %d, objects %d, with a model before %d, now %d' % (len(rows), len(objs), before, now))
    for n, v in objs.items(): print('  %-17s %-10s rows %3d  %s  (%s)' % (n, v['kind'], v['rows'], 'MODEL' if v['built'] and v['checked'] else 'built' if v['built'] else 'none ', v['before_this_round']))


def write_manifest(by_obj):
    items = {}
    for n, o in OBJECTS.items():
        # a model joins the manifest the moment it is RIGHT: built AND compared on the man over a fight floor (its sheet);
        # COOK's guns of 10/18 were checked in their own round
        if not built(n) or not (o.get('glb') or os.path.exists(os.path.join(OUT, 'check_%s.webp' % n))): continue
        import hashlib
        e = dict(glb=glb_of(n), kind=o['kind'], name=o['name'], say=o.get('say', ''), made=o.get('made', 'COOK 10/25 (%s)' % os.path.basename(__file__)),
                 rows=by_obj.get(n, []), sha1=hashlib.sha1(open(os.path.join(MODELS, glb_of(n)), 'rb').read()).hexdigest())
        if o['kind'] == 'held': e['hands'] = o.get('hands', 1)
        if o['kind'] == 'shield': e.update(w=o['w'], h=o['h'])
        mp = os.path.join(OUT, 'measured_%s.json' % n)
        if os.path.exists(mp):
            e['measured'] = json.load(open(mp))
            for k in ('elbow_z', 'grip_z', 'left_x'):
                if k in e['measured']: e[k] = e['measured'][k]
        items[n] = e
    M = dict(version=VERSION, lane='cook', rule='177(b)(c)',
             frames=dict(
                 held='real metres; the origin the middle of the right hand\'s grip, the haft or barrel along +X, the edge or the striking '
                      'face toward +Z (COMBAT\'s guns tool and ANIMATION\'s place()); hafts drawn %.2f x their girth; left_x = where a '
                      'second hand grips, metres along +X' % FAT,
                 shield='real metres; the face out along +X, the width along +Y, up +Z; the forearm runs along Z at x = 0 behind it, its '
                        'middle at the origin; elbow_z and grip_z = the loop and the grip (ANIMATION\'s build_shield/place_shield frame)',
                 worn='the rig\'s man\'s skeleton (CesiumMan\'s 19 bones, the same rest as every look) in the file, the meshes skinned to '
                      'its bones by name, in the model\'s own units (the man about 1.5 tall); bind to a look\'s armature and call fit() in '
                      'tools/bohemia_cook_a_model_for_every_item_10_25_26.py to clear his own body by the margin'),
             items=items)
    json.dump(M, open(MANIFEST, 'w'), indent=1)




# ------------------------------------------------------------------------------------------------ the builders (bpy)
class Kit:
    """the hands every model is built with: COOK's props modeller (mat, box, cyl, rod) and COOK's icons tool (lathe, loft,
    link), plus a skin grid for curved panels"""
    def __init__(self, bpy, tag):
        import mathutils
        import bohemia_cook_model_props as P
        import bohemia_cook_the_icons_through_the_rig_10_20_26 as CI
        self.bpy, self.P, self.CI, self.V, self.tag = bpy, P, CI, mathutils.Vector, tag
        self.mats = {}

    def m(self, role, step):
        k = (role, step)
        if k not in self.mats: self.mats[k] = self.P.mat(self.bpy, '%s_%s_%d' % (self.tag, role, step), role, step)
        return self.mats[k]

    # in a scene with the man imported, an add operator dropped its object at the origin whatever location it was given, and an
    # object's own turn came out of the export somewhere else (the hard hat's sticker landed over his head): so every part is
    # made at the origin, turned IN ITS MESH, and only then put in its place
    def _clear(self):
        for x in self.bpy.context.selected_objects: x.select_set(False)

    def _place(self, o, loc, R=None):
        import mathutils
        if R is not None: o.data.transform(R.to_4x4() if len(R) == 3 else R); o.data.update()
        o.rotation_euler = (0, 0, 0); o.location = tuple(loc)
        return o

    def box(self, name, mat, size, loc, rot=(0, 0, 0), bevel=0.0):
        import mathutils
        self._clear(); o = self.P.box(self.bpy, name, self.m(*mat), size, (0, 0, 0), (0, 0, 0), bevel)
        return self._place(o, loc, mathutils.Euler(rot).to_matrix() if any(rot) else None)

    def cyl(self, name, mat, r, depth, loc, rot=(0, 0, 0), verts=12, smooth=True):
        import mathutils
        self._clear(); o = self.P.cyl(self.bpy, name, self.m(*mat), r, depth, (0, 0, 0), (0, 0, 0), verts, smooth)
        return self._place(o, loc, mathutils.Euler(rot).to_matrix() if any(rot) else None)

    def rod(self, name, mat, p0, p1, r, verts=10):
        p0, p1 = self.V(p0), self.V(p1); d = p1 - p0
        self._clear(); o = self.P.cyl(self.bpy, name, self.m(*mat), r, d.length, (0, 0, 0), (0, 0, 0), verts)
        return self._place(o, (p0 + p1) / 2, self.V((0, 0, 1)).rotation_difference(d).to_matrix())

    def orient(self, o, d, frm=(0, -1, 0)):
        """turn a part (in its mesh, about its own place) so its frm axis points along d"""
        o.data.transform(self.V(frm).rotation_difference(self.V(d)).to_matrix().to_4x4()); o.data.update()
        return o

    def tube(self, name, mat, pts, r, verts=10):
        """a bent tube along a polyline: a rod per leg and a ball at every bend"""
        out = [self.rod('%s_%d' % (name, k), mat, a, b, r, verts) for k, (a, b) in enumerate(zip(pts, pts[1:]))]
        for k, p in enumerate(pts[1:-1]):
            self._clear(); self.bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=p, segments=verts, ring_count=max(4, verts // 2))
            ob = self.P.put(self.bpy, self.bpy.context.active_object, '%s_bend_%d' % (name, k), self.m(*mat)); ob.location = tuple(p)
            out.append(ob)
        return out

    def lathe(self, name, mat, prof, n=12, smooth=True):
        return self.CI.lathe(self.bpy, name, self.m(*mat), prof, n=n, smooth=smooth)

    def loft(self, name, mat, secs, axis='z'):
        return self.CI.loft(self.bpy, name, self.m(*mat), secs, axis=axis)

    def mesh(self, name, mat, verts, faces, smooth=True):
        return self.CI.mesh(self.bpy, name, verts, faces, self.m(*mat), smooth)

    def slab(self, name, mat, outer, inner, ys, zs, smooth=True):
        """a closed curved panel: outer(y, z) and inner(y, z) give x on a grid of ys by zs; the four edges closed"""
        V = []; nu, nv = len(ys), len(zs)
        for f in (outer, inner):
            for z in zs:
                for y in ys: V.append((f(y, z), y, z))
        o = lambda i, j: j * nu + i
        q = nu * nv
        F = []
        for j in range(nv - 1):
            for i in range(nu - 1):
                F.append((o(i, j), o(i + 1, j), o(i + 1, j + 1), o(i, j + 1)))
                F.append((q + o(i, j + 1), q + o(i + 1, j + 1), q + o(i + 1, j), q + o(i, j)))
        ring = [o(i, 0) for i in range(nu)] + [o(nu - 1, j) for j in range(1, nv)] + [o(i, nv - 1) for i in range(nu - 2, -1, -1)] + [o(0, j) for j in range(nv - 2, 0, -1)]
        for k in range(len(ring)):
            a, b = ring[k], ring[(k + 1) % len(ring)]
            F.append((b, a, q + a, q + b))
        ob = self.mesh(name, mat, V, F, smooth)
        self.recalc(ob)
        return ob

    def recalc(self, ob):
        import bmesh
        bm = bmesh.new(); bm.from_mesh(ob.data); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:]); bm.to_mesh(ob.data); bm.free()

    def disc(self, name, mat, r, at, normal, depth=0.004, verts=10):
        """a thin disc lying on a surface: a hole's dark, a rivet, a rim"""
        o = self.cyl(name, mat, r, depth, at, verts=verts)
        return self.orient(o, normal, (0, 0, 1))


def build(bpy, name):
    """build one object into the empty scene; returns the meshes"""
    import mathutils
    K = Kit(bpy, name)
    before = set(o.name for o in bpy.context.scene.objects)
    along_z = globals()['b_' + name](K, mathutils)
    parts = [o for o in bpy.context.scene.objects if o.name not in before and o.type == 'MESH']
    bpy.context.view_layer.update()
    if along_z:
        # a weapon is built standing up (the haft along +Z from the fist, the edge toward +X), the way the lathe and the loft
        # turn; here it is laid into the held frame (the haft along +X, the edge toward +Z): (x, y, z) -> (z, -y, x)
        B = mathutils.Matrix(((0, 0, 1), (0, -1, 0), (1, 0, 0))).to_4x4()
        for o in parts:
            o.matrix_world = B @ o.matrix_world
        bpy.context.view_layer.update()
    # every part's own place, turn and scale applied into its mesh: what is exported is the mesh, never an object transform
    for o in parts:
        if o.parent is not None:
            mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
        bpy.context.view_layer.objects.active = o
        for x in bpy.context.scene.objects: x.select_set(x is o)
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        K.recalc(o)
    bpy.context.view_layer.update()
    return parts


# ---- THE CAR DOOR ------------------------------------------------------------------------------------------------------
def b_car_door(K, mu):
    """the shield frame: face +X, width Y (the hinge edge at -Y, the latch edge at +Y), up +Z, the forearm at x = 0"""
    w, h = OBJECTS['car_door']['w'], OBJECTS['car_door']['h']
    PAINT, RUST, STEEL, RUB, BRIGHT = ('clay_teal', 2), ('clay_rust', 1), ('metal_painted', 1), ('rubber', 1), ('chrome', 1)
    W2, H2 = w / 2, h / 2
    crease = h * 0.16                                   # the body's character line, a third down from the beltline

    def skin(y, z):
        u, v = y / W2, z / H2
        x = 0.088 + 0.024 * (1 - u * u)                 # the door crowned side to side
        x -= 0.030 * max(0.0, (-0.45 - v) / 0.55) ** 2 * 1.0   # the rocker tucks under at the bottom
        x -= 0.010 * max(0.0, (z - crease) / (H2 - crease))    # above the crease the shoulder leans in toward the glass
        x += 0.006 * math.exp(-((z - crease) / 0.010) ** 2)    # the crease itself, a sharp ridge
        x -= 0.016 * math.exp(-(((y + 0.13) / 0.11) ** 2 + ((z + 0.07) / 0.09) ** 2))   # the dent somebody hammered half out
        return x

    def inner(y, z):
        v = z / H2
        return 0.016 + 0.020 * max(0.0, (-0.2 - v) / 0.8)       # the inner panel steps out at the bottom where the door is deepest

    ys = [W2 * (2 * i / 30 - 1) for i in range(31)]
    zs = [H2 * (2 * j / 24 - 1) for j in range(25)]
    K.slab('door_skin', PAINT, skin, inner, ys, zs)
    # the hem: the skin folded round the four edges, a little proud, in bare steel where the paint wore off the fold
    for nm, a, b in (('hem_bottom', (0, -W2, -H2), (0, W2, -H2)), ('hem_front', (0, -W2, -H2), (0, -W2, H2)), ('hem_rear', (0, W2, -H2), (0, W2, H2))):
        p0 = mu.Vector(a); p1 = mu.Vector(b)
        mid = (p0 + p1) / 2
        x = (skin(mid.y, mid.z) + inner(mid.y, mid.z)) / 2
        d = p1 - p0
        size = (skin(mid.y, mid.z) - inner(mid.y, mid.z) + 0.006, 0.012 if d.z else d.length + 0.006, d.length + 0.006 if d.z else 0.012)
        K.box(nm, STEEL, size, (x, mid.y, mid.z), bevel=0.003)
    # rust up the bottom seam and a blister by the rear corner: their own panels, lying on the skin
    for k in range(9):
        y = -W2 + 0.05 + k * (w - 0.1) / 8; zz = -H2 + 0.035 + 0.022 * math.sin(k * 2.3) + 0.012 * (k % 3)
        K.box('seam_rust_%d' % k, RUST, (0.006, 0.075 + 0.02 * (k % 2), 0.05 + 0.03 * ((k * 7) % 3) / 2), (skin(y, zz) + 0.001, y, zz), rot=(math.radians(8 * math.sin(k)), 0, 0))
    for k, (y, z, r) in enumerate(((0.33, -0.17, 0.035), (0.37, -0.12, 0.022), (0.29, -0.2, 0.02))):
        K.disc('blister_%d' % k, RUST, r, (skin(y, z) + 0.002, y, z), (1, 0, 0), depth=0.005)
    # four bullet holes punched out through the skin, their lips bright where the paint went with the lead
    for k, (y, z) in enumerate(((-0.24, 0.02), (0.05, -0.13), (0.11, 0.06), (0.21, -0.02))):
        x = skin(y, z)
        K.disc('hole_lip_%d' % k, BRIGHT, 0.016, (x + 0.002, y, z), (1, 0, 0), depth=0.004)
        K.disc('hole_%d' % k, RUB, 0.0095, (x + 0.004, y, z), (1, 0, 0), depth=0.004)
    # the handle: a pocket pressed into the skin under the beltline at the rear, the pull bar over it, the lock barrel
    hy, hz = W2 - 0.17, H2 - 0.1
    K.box('handle_pocket', RUB, (0.012, 0.14, 0.045), (skin(hy, hz) - 0.002, hy, hz), bevel=0.006)
    K.box('handle_bar', BRIGHT, (0.016, 0.125, 0.018), (skin(hy, hz) + 0.008, hy, hz + 0.004), bevel=0.006)
    K.disc('lock', BRIGHT, 0.009, (skin(hy + 0.1, hz) + 0.003, hy + 0.1, hz), (1, 0, 0), depth=0.01)
    # the beltline: the outer weatherstrip and the inner one, the channel between them open; three teeth of glass in it
    K.box('belt_outer', RUB, (0.012, w - 0.03, 0.022), (skin(0, H2) + 0.002, 0, H2 + 0.004), bevel=0.004)
    K.box('belt_inner', RUB, (0.012, w - 0.06, 0.018), (inner(0, H2) + 0.008, 0, H2 + 0.003), bevel=0.004)
    gx = (skin(0, H2) + inner(0, H2)) / 2
    for k, (y, top, wid) in enumerate(((-0.22, 0.13, 0.13), (0.02, 0.07, 0.09), (0.19, 0.16, 0.08))):
        K.mesh('glass_%d' % k, BRIGHT, [(gx - 0.003, y - wid / 2, H2 - 0.01), (gx - 0.003, y + wid / 2, H2 - 0.01), (gx - 0.003, y + wid * 0.15, H2 + top),
                                        (gx + 0.003, y - wid / 2, H2 - 0.01), (gx + 0.003, y + wid / 2, H2 - 0.01), (gx + 0.003, y + wid * 0.15, H2 + top)],
               [(0, 1, 2), (5, 4, 3), (0, 3, 4, 1), (1, 4, 5, 2), (2, 5, 3, 0)], smooth=False)
    # the mirror's black sail at the front top corner, the mirror itself snapped off and its stub left
    sy = -W2 + 0.06
    K.mesh('sail', RUB, [(skin(sy, H2) - 0.03, -W2 + 0.01, H2), (skin(sy, H2) + 0.01, -W2 + 0.01, H2), (skin(sy, H2) + 0.01, -W2 + 0.15, H2),
                         (skin(sy, H2) - 0.03, -W2 + 0.01, H2 + 0.12), (skin(sy, H2) + 0.01, -W2 + 0.01, H2 + 0.12), (skin(sy, H2) - 0.03, -W2 + 0.15, H2)],
           [(0, 2, 1), (3, 4, 2, 5), (0, 1, 4, 3), (1, 2, 4), (0, 3, 5), (0, 5, 2)], smooth=False)
    K.box('mirror_stub', RUB, (0.05, 0.035, 0.03), (skin(sy, H2) + 0.03, -W2 + 0.04, H2 + 0.06), rot=(0, math.radians(-20), 0), bevel=0.005)
    # the front edge: two hinge knuckles torn off the pillar, the check strap's stub between them
    for k, z in enumerate((H2 - 0.14, -H2 + 0.16)):
        K.box('hinge_%d' % k, STEEL, (0.05, 0.045, 0.07), (0.05, -W2 - 0.02, z), bevel=0.004)
        K.cyl('hinge_pin_%d' % k, BRIGHT, 0.008, 0.09, (0.05, -W2 - 0.04, z), verts=8)
    K.box('check_strap', STEEL, (0.02, 0.06, 0.025), (0.045, -W2 - 0.02, 0.0), bevel=0.003)
    # the rear edge: the latch plate
    K.box('latch', BRIGHT, (0.04, 0.008, 0.07), (0.055, W2 + 0.003, H2 - 0.16), bevel=0.002)
    # behind (toward him): the bare inner panel's three holes, the regulator rails, the armrest stub, the seatbelt loop
    for k, (y, z, r) in enumerate(((-0.2, 0.05, 0.075), (0.12, 0.08, 0.06), (0.2, -0.16, 0.05))):
        K.disc('panel_hole_%d' % k, RUB, r, (inner(y, z) - 0.002, y, z), (1, 0, 0), depth=0.004, verts=14)
    for k, y in enumerate((-0.05, 0.04)):
        K.box('rail_%d' % k, STEEL, (0.01, 0.02, h * 0.62), (inner(y, 0) - 0.006, y, 0.04), bevel=0.003)
    K.box('armrest', RUB, (0.05, 0.3, 0.05), (inner(0.1, -0.1) - 0.025, 0.1, -0.1), bevel=0.012)
    # the seatbelt loop round the forearm (the elbow end) and its buckle, the grip low (the old door pull)
    ez, gz = 0.13, -0.15
    belt = [mu.Vector((inner(0, ez) - 0.002, -0.07, ez)), mu.Vector((-0.06, -0.06, ez)), mu.Vector((-0.085, 0.0, ez)), mu.Vector((-0.06, 0.06, ez)), mu.Vector((inner(0, ez) - 0.002, 0.07, ez))]
    for k, (a, b) in enumerate(zip(belt, belt[1:])):
        d = b - a; c = (a + b) / 2
        o = K.box('belt_%d' % k, RUB, (0.006, d.length + 0.01, 0.045), c)
        o.rotation_euler = (0, 0, math.atan2(d.y, d.x) - math.pi / 2)
    K.box('buckle', BRIGHT, (0.012, 0.045, 0.05), (-0.088, 0.0, ez), bevel=0.004)
    K.rod('grip', STEEL, (-0.045, -0.06, gz), (-0.045, 0.06, gz), 0.016)
    K.rod('grip_post_a', STEEL, (inner(-0.06, gz), -0.06, gz), (-0.045, -0.06, gz), 0.012)
    K.rod('grip_post_b', STEEL, (inner(0.06, gz), 0.06, gz), (-0.045, 0.06, gz), 0.012)
    OBJECTS['car_door'].update(elbow_z=ez, grip_z=gz)


# ---- THE CRASH-BAR SHIELD ----------------------------------------------------------------------------------------------
def b_crash_bar(K, mu):
    """CHARACTER's Heavy's crash bar, as a thing of its own: the push bar's uprights with their rubber pads, the crossbars,
    the diamond plate, the dead plate; the shield frame (face +X, width Y, up Z, the forearm at x = 0)"""
    w, h = OBJECTS['crash_bar']['w'], OBJECTS['crash_bar']['h']
    # five materials (the guide's prop cap): the bar's black paint, the tread plate's dull bare steel, rust, the pale dead plate
    # (and the bright cut ends and rivets), rubber (the pads, the plate's letters, the webbing). Round 2 of the loop: the plate in
    # the bar's own dark olive read as one black block on the asphalt at the fight's pixels; bare tread plate is what a push bar
    # is backed with and it puts the dark bars on a light ground, so the shape reads
    FRAME, PLATE_DK, RUST, PLATE, RUB = ('metal_painted', 1), ('tape_grey', 2), ('clay_rust', 1), ('clay_bone', 3), ('rubber', 1)
    W2, H2 = w / 2, h / 2
    R = 0.016 * FAT                                    # 1.25 in tube, drawn FAT
    xf = 0.075                                          # the bar's plane, in front of the plate
    # two uprights, bent forward at the bottom where the bar met the bumper, the cut ends at the top
    for s in (-1, 1):
        y = s * (W2 - 0.06)
        K.tube('upright_%d' % (s > 0), FRAME, [(xf, y, H2), (xf, y, -H2 + 0.12), (xf + 0.055, y, -H2 + 0.02)], R)
        K.disc('cut_%d' % (s > 0), PLATE, R * 0.95, (xf, y, H2 + 0.001), (0, 0, 1), depth=0.003)
        # the rubber push pad on the face of each upright
        K.box('pad_%d' % (s > 0), RUB, (0.03, 0.05, h * 0.6), (xf + R + 0.008, y, 0.02), bevel=0.008)
        for k in range(4): K.box('pad_rib_%d_%d' % (s > 0, k), RUB, (0.008, 0.052, 0.012), (xf + R + 0.026, y, -0.13 + k * 0.1))
    # three crossbars, the bottom one bent out with the uprights; the outer frame's corners wrap round
    for k, z in enumerate((H2 - 0.08, 0.02)):
        K.rod('cross_%d' % k, FRAME, (xf, -W2 + 0.02, z), (xf, W2 - 0.02, z), R * 0.85)
        for s in (-1, 1): K.tube('end_%d_%d' % (k, s > 0), FRAME, [(xf, s * (W2 - 0.02), z), (xf - 0.02, s * W2, z), (0.03, s * W2, z)], R * 0.85)
    K.rod('cross_low', FRAME, (xf + 0.055, -(W2 - 0.06), -H2 + 0.02), (xf + 0.055, W2 - 0.06, -H2 + 0.02), R)
    # the diamond plate behind the bars: bent, dented, with its tread as rows of raised diamonds, rust at its edges
    def plate_x(y, z): return 0.032 + 0.008 * math.cos(y / W2 * 1.4) - 0.01 * math.exp(-(((y - 0.07) / 0.07) ** 2 + ((z + 0.05) / 0.08) ** 2))
    ys = [(W2 - 0.03) * (2 * i / 16 - 1) for i in range(17)]; zs = [(H2 - 0.03) * (2 * j / 20 - 1) for j in range(21)]
    K.slab('plate', PLATE_DK, plate_x, lambda y, z: plate_x(y, z) - 0.006, ys, zs)
    for j in range(9):
        for i in range(6):
            y = -W2 + 0.07 + i * 0.068 + (0.034 if j % 2 else 0); z = -H2 + 0.07 + j * 0.06
            if abs(y) > W2 - 0.05: continue
            o = K.box('tread_%d_%d' % (j, i), PLATE_DK, (0.004, 0.012, 0.03), (plate_x(y, z) + 0.002, y, z), rot=(math.radians(45 if (i + j) % 2 else -45), 0, 0))
    for k, (y, z, a, b) in enumerate(((0, H2 - 0.035, w - 0.08, 0.035), (0, -H2 + 0.04, w - 0.08, 0.04), (-W2 + 0.04, 0, 0.035, h - 0.1), (W2 - 0.04, -0.06, 0.03, h * 0.5))):
        K.box('rust_%d' % k, RUST, (0.005, a, b), (plate_x(y, z) + 0.003, y, z))
    # the welds where the bars meet the plate: rust beads
    for s in (-1, 1):
        for z in (H2 - 0.08, 0.02):
            K.box('weld_%d_%d' % (s > 0, int(z * 100)), RUST, (xf - 0.03, 0.02, 0.02), ((xf + 0.035) / 2, s * (W2 - 0.06), z))
    # the dead Nevada plate riveted on below the middle bar: pale ground, the letters raised and gone grey-dark
    pz = -0.13
    K.box('nv_plate', PLATE, (0.006, 0.305 * 0.72, 0.152 * 0.72), (plate_x(0, pz) + 0.004, 0, pz), bevel=0.004)
    for k in range(6):
        K.box('nv_letter_%d' % k, RUB, (0.003, 0.018, 0.05), (plate_x(0, pz) + 0.008, -0.08 + k * 0.032, pz - 0.006))
    K.box('nv_band', RUB, (0.003, 0.2, 0.008), (plate_x(0, pz) + 0.008, 0, pz + 0.038))
    for s in (-1, 1): K.disc('rivet_%d' % (s > 0), PLATE, 0.008, (plate_x(0, pz) + 0.008, s * 0.09, pz), (1, 0, 0), depth=0.006)
    # behind: two loops of tan webbing round the forearm and the grip bar (CHARACTER's straps were woven leather)
    ez, gz = 0.12, -0.13
    for k, z in enumerate((ez, ez - 0.07)):
        pts = [mu.Vector((0.02, -0.06, z)), mu.Vector((-0.055, -0.055, z)), mu.Vector((-0.08, 0.0, z)), mu.Vector((-0.055, 0.055, z)), mu.Vector((0.02, 0.06, z))]
        for j, (a, b) in enumerate(zip(pts, pts[1:])):
            d = b - a; o = K.box('loop_%d_%d' % (k, j), RUB, (0.006, d.length + 0.01, 0.035), (a + b) / 2)
            o.rotation_euler = (0, 0, math.atan2(d.y, d.x) - math.pi / 2)
    K.rod('grip', FRAME, (-0.045, -0.065, gz), (-0.045, 0.065, gz), 0.015)
    for s in (-1, 1): K.rod('grip_post_%d' % (s > 0), FRAME, (0.03, s * 0.065, gz), (-0.045, s * 0.065, gz), 0.011)
    OBJECTS['crash_bar'].update(elbow_z=ez, grip_z=gz)


# ---- THE RIOT SHIELD ---------------------------------------------------------------------------------------------------
LETTERS = {   # a stencil's strokes in the letter's own box (y0, z0, y1, z1), 0..1 across and up
    'P': [(0, 0, 0.22, 1), (0, 0.82, 1, 1), (0, 0.42, 1, 0.6), (0.78, 0.42, 1, 1)],
    'O': [(0, 0, 0.22, 1), (0.78, 0, 1, 1), (0, 0.82, 1, 1), (0, 0, 1, 0.18)],
    'L': [(0, 0, 0.22, 1), (0, 0, 1, 0.18)],
    'I': [(0.39, 0, 0.61, 1)],
    'C': [(0, 0, 0.22, 1), (0, 0.82, 1, 1), (0, 0, 1, 0.18)],
    'E': [(0, 0, 0.22, 1), (0, 0.82, 1, 1), (0, 0.42, 0.8, 0.58), (0, 0, 1, 0.18)],
}


def stencil(K, name, mat, word, x_of, y0, z0, lw, lh, gap, scraped=()):
    """a word in raised stencil strokes on a face (x_of(y, z) the face), a stroke left off where it was scraped away"""
    for i, ch in enumerate(word):
        for j, (a, b, c, d) in enumerate(LETTERS[ch]):
            if (i, j) in scraped: continue
            ya, yb = y0 + i * (lw + gap) + a * lw, y0 + i * (lw + gap) + c * lw
            za, zb = z0 + b * lh, z0 + d * lh
            yc, zc = (ya + yb) / 2, (za + zb) / 2
            K.box('%s_%d_%d' % (name, i, j), mat, (0.003, yb - ya, zb - za), (x_of(yc, zc) + 0.0015, yc, zc))


def b_riot_shield(K, mu):
    """a police ballistic shield, the shield frame (face +X, width Y, up Z, the forearm at x = 0)"""
    w, h = OBJECTS['riot_shield']['w'], OBJECTS['riot_shield']['h']
    BODY, RIM, VIEW, LETTER, BARE = ('rubber', 2), ('rubber', 1), ('glass_eye', 1), ('clay_bone', 3), ('tape_grey', 1)
    W2, H2 = w / 2, h / 2
    def face(y, z):
        return 0.03 + 0.032 * (1 - (y / W2) ** 2) - 0.012 * max(0.0, (abs(z) - H2 * 0.7) / (H2 * 0.3)) ** 2
    def back(y, z): return face(y, z) - 0.014
    ys = [W2 * (2 * i / 20 - 1) for i in range(21)]; zs = [H2 * (2 * j / 30 - 1) for j in range(31)]
    K.slab('slab', BODY, face, back, ys, zs)
    # the rim: a thick rubber edge all round, its corners rounded
    rr = 0.05
    pts = []
    for cz, cy, a0 in ((H2 - rr, W2 - rr, 0), (-(H2 - rr), W2 - rr, 90), (-(H2 - rr), -(W2 - rr), 180), (H2 - rr, -(W2 - rr), 270)):
        for s in range(4):
            t = math.radians(a0 + 30 * s); y, z = cy + rr * math.sin(t), cz + rr * math.cos(t)
            pts.append((face(y, z) - 0.006, y, z))
    pts.append(pts[0])
    K.tube('rim', RIM, pts, 0.012, verts=8)
    # the viewport, high: a scratched dark window in a rubber frame
    vz = H2 - 0.17
    K.box('view', VIEW, (0.006, 0.25, 0.075), (face(0, vz) + 0.003, 0, vz), bevel=0.003)
    for k, (y, z, a, b) in enumerate(((0, vz + 0.045, 0.28, 0.016), (0, vz - 0.045, 0.28, 0.016), (-0.135, vz, 0.016, 0.1), (0.135, vz, 0.016, 0.1))):
        K.box('view_frame_%d' % k, RIM, (0.01, a, b), (face(y, z) + 0.004, y, z))
    # POLICE across the chest, white, half scraped off
    stencil(K, 'police', LETTER, 'POLICE', face, -0.215, 0.02, 0.06, 0.08, 0.012, scraped={(1, 2), (3, 0), (4, 1), (5, 2)})
    # gouges through the coating to the pale fibre underneath
    for k, (y, z, ln, a) in enumerate(((-0.12, -0.18, 0.16, 28), (0.08, -0.26, 0.11, -15), (0.15, 0.2, 0.09, 50), (-0.05, -0.08, 0.07, 75), (-0.18, 0.28, 0.08, -35))):
        K.box('gouge_%d' % k, BARE, (0.003, ln, 0.007), (face(y, z) + 0.0015, y, z), rot=(math.radians(a), 0, 0))
    # behind: the arm cuff (the forearm through it, the elbow end) and the handle across for the hand
    ez, gz = 0.12, -0.12
    for k, (a, b) in enumerate(zip([(back(0, ez), -0.065, ez), (-0.05, -0.06, ez), (-0.075, 0, ez), (-0.05, 0.06, ez), (back(0, ez), 0.065, ez)][:-1],
                                   [(-0.05, -0.06, ez), (-0.075, 0, ez), (-0.05, 0.06, ez), (back(0, ez), 0.065, ez)])):
        a, b = mu.Vector(a), mu.Vector(b); d = b - a
        o = K.box('cuff_%d' % k, RIM, (0.008, d.length + 0.01, 0.05), (a + b) / 2)
        o.rotation_euler = (0, 0, math.atan2(d.y, d.x) - math.pi / 2)
    K.rod('handle', BARE, (-0.045, -0.06, gz), (-0.045, 0.06, gz), 0.015)
    for s in (-1, 1): K.rod('handle_post_%d' % (s > 0), BARE, (back(s * 0.06, gz), s * 0.06, gz), (-0.045, s * 0.06, gz), 0.011)
    OBJECTS['riot_shield'].update(elbow_z=ez, grip_z=gz)


# ---- THE WEAPONS: each built standing up (the haft along +Z, the middle of the grip at z = 0, the edge toward +X) and laid
# into the held frame by build(); a haft drawn FAT times its girth
def tape_wrap(K, name, mat, r, z0, z1, n=6):
    """tape wound round a haft: a sleeve and the ridges of its turns"""
    K.lathe(name, mat, [(0, z0), (r, z0), (r, z1), (0, z1)], n=10)
    for k in range(n):
        z = z0 + (z1 - z0) * (k + 0.5) / n
        K.lathe('%s_turn_%d' % (name, k), mat, [(0, z - 0.004), (r * 1.06, z - 0.004), (r * 1.06, z + 0.004), (0, z + 0.004)], n=10)


def b_pipe(K, mu):
    """a length of galvanised water pipe with a cast tee screwed on the end (the head), a coupling at the butt, rust, the grip
    wound in black tape"""
    GALV, IRON, RUST, TAPE = ('tape_grey', 2), ('metal_painted', 0), ('clay_rust', 1), ('rubber', 1)
    back, fore = 0.09, 0.5; r = 0.0167 * FAT
    K.lathe('pipe', GALV, [(0, -back), (r, -back), (r, fore), (0, fore)], n=12)
    K.lathe('coupling', IRON, [(0, -back - 0.012), (r * 1.4, -back - 0.012), (r * 1.4, -back + 0.03), (0, -back + 0.03)], n=12)
    # the tee: its run in line with the pipe, the branch out toward the blow, a short nipple and a cap on it, a plug on top
    K.lathe('tee_run', IRON, [(0, fore - 0.025), (r * 1.55, fore - 0.025), (r * 1.62, fore - 0.012), (r * 1.55, fore + 0.07), (r * 1.62, fore + 0.082), (0, fore + 0.082)], n=12)
    tz = fore + 0.028
    K.rod('tee_branch', IRON, (0, 0, tz), (0.062, 0, tz), r * 1.5, 12)
    K.rod('nipple', GALV, (0.06, 0, tz), (0.1, 0, tz), r * 1.02, 12)
    K.rod('cap', IRON, (0.098, 0, tz), (0.13, 0, tz), r * 1.55, 12)
    K.lathe('plug', IRON, [(0, fore + 0.08), (r * 1.2, fore + 0.08), (r * 1.2, fore + 0.1), (0, fore + 0.1)], n=6, smooth=False)
    for k, (z, a) in enumerate(((0.16, 0.4), (0.3, 2.6), (0.41, 4.1), (fore + 0.04, 1.2))):
        rad = r * (1.57 if z > fore else 1.0)
        K.disc('rust_%d' % k, RUST, 0.018, (math.cos(a) * rad, math.sin(a) * rad, z), (math.cos(a), math.sin(a), 0), depth=0.004)
    tape_wrap(K, 'grip', TAPE, r * 1.14, -0.055, 0.085)
    return True


def b_sledge(K, mu):
    """an eight-pound sledge: a hickory haft, the head a chamfered block with its striking faces bright, a wedge on top, a crack
    in the haft bound with wire, the grip taped; two hands (the left at left_x)"""
    WOOD, HEAD, BRIGHT, TAPE = ('clay_mustard', 1), ('metal_painted', 0), ('chrome', 0), ('rubber', 1)
    back, fore = 0.06, 0.8; rr = lambda x: x * FAT
    K.lathe('haft', WOOD, [(0, -back), (rr(0.02), -back), (rr(0.021), -back + 0.02), (rr(0.016), 0.12), (rr(0.0135), 0.45),
                           (rr(0.016), fore - 0.08), (rr(0.018), fore + 0.04), (0, fore + 0.045)], n=10)
    K.box('head', HEAD, (0.17, 0.066, 0.066), (0, 0, fore), bevel=0.01)
    for s in (-1, 1): K.disc('face_%d' % (s > 0), BRIGHT, 0.027, (s * 0.086, 0, fore), (s, 0, 0), depth=0.004, verts=12)
    K.box('wedge', BRIGHT, (0.022, 0.03, 0.006), (0, 0, fore + 0.035))
    for k in range(4): K.lathe('wire_%d' % k, HEAD, [(0, 0.55 + k * 0.012), (rr(0.0143), 0.55 + k * 0.012), (rr(0.0143), 0.556 + k * 0.012), (0, 0.556 + k * 0.012)], n=10)
    tape_wrap(K, 'grip', TAPE, rr(0.0215), -back + 0.01, 0.1, n=5)
    OBJECTS['sledge']['left_x'] = 0.34
    return True


def b_bottles(K, mu):
    """a firebomb: a green wine bottle, a strip of masking tape round it, a rag stuffed in the neck and hanging down its side, the
    rag's end scorched; held round the body (the origin), the neck along the throw"""
    GLASS, TAPE, RAG, SCORCH = ('clay_teal', 1), ('tape_masking', 2), ('clay_bone', 2), ('rubber', 0)
    k = 1.15   # a bottle at its real girth is four pixels: a little fat so the neck and the shoulder read
    K.lathe('bottle', GLASS, [(0, -0.12), (0.036 * k, -0.12), (0.038 * k, -0.11), (0.038 * k, 0.05), (0.033 * k, 0.085), (0.017 * k, 0.12),
                              (0.0145 * k, 0.165), (0.017 * k, 0.17), (0.017 * k, 0.18), (0, 0.18)], n=16)
    K.lathe('punt', SCORCH, [(0, -0.121), (0.02, -0.121), (0.02, -0.119), (0, -0.119)], n=12)
    K.lathe('label', TAPE, [(0, -0.03), (0.0392 * k, -0.03), (0.0392 * k, 0.015), (0, 0.015)], n=16)
    # the rag: up out of the neck, over the lip, down the side toward the blow, the last of it scorched
    path = [(0, 0, 0.16), (0.005, 0, 0.2), (0.02, 0, 0.215), (0.035, 0, 0.2), (0.05, 0, 0.16), (0.055, 0, 0.12), (0.06, 0, 0.085)]
    for i, (a, b) in enumerate(zip(path, path[1:])):
        K.rod('rag_%d' % i, SCORCH if i >= len(path) - 3 else RAG, a, b, 0.013 - 0.0012 * i, verts=7)
    return True


def b_machete(K, mu):
    """a machete: a black grip with three rivets, the blade's spine in line with it, a belly toward the clipped tip, the edge
    ground bright, a rust patch"""
    GRIP, STEEL, EDGE, RUST = ('rubber', 1), ('tape_grey', 1), ('chrome', 1), ('clay_rust', 1)
    back, fore = 0.05, 0.6
    K.lathe('grip', GRIP, [(0, -back), (0.017, -back), (0.019, -back + 0.012), (0.015, 0.05), (0.017, 0.098), (0.022, 0.104), (0, 0.11)], n=10)
    for j, z in enumerate((-0.015, 0.035, 0.08)):
        for s in (-1, 1): K.disc('rivet_%d_%d' % (j, s > 0), EDGE, 0.005, (0, s * 0.016, z), (0, s, 0), depth=0.004, verts=8)
    K.loft('blade', STEEL, [(0.104, -0.013, 0.027, 0.004, 0.0016), (0.3, -0.013, 0.037, 0.0035, 0.0013), (0.47, -0.011, 0.048, 0.003, 0.0011),
                            (0.55, -0.002, 0.043, 0.0024, 0.001), (fore, 0.012, 0.016, 0.0012, 0.0008)])
    K.loft('edge', EDGE, [(0.11, 0.021, 0.0285, 0.0018, 0.0009), (0.3, 0.031, 0.0385, 0.0016, 0.0008), (0.47, 0.042, 0.0495, 0.0014, 0.0007),
                          (0.55, 0.037, 0.0445, 0.0012, 0.0006), (fore - 0.004, 0.014, 0.017, 0.0009, 0.0005)])
    K.loft('rust', RUST, [(0.22, -0.009, 0.02, 0.0042, 0.0022), (0.29, -0.009, 0.026, 0.0042, 0.0022)])
    return True


def b_fire_axe(K, mu):
    """a pick-head fire axe: a hickory haft, the head in faded red with the blade ground bright and the pick behind; two hands"""
    WOOD, RED, EDGE, TAPE = ('clay_mustard', 1), ('clay_rust', 2), ('chrome', 1), ('rubber', 1)
    back, fore = 0.06, 0.78; rr = lambda x: x * FAT
    K.lathe('haft', WOOD, [(0, -back), (rr(0.021), -back), (rr(0.022), -back + 0.025), (rr(0.016), 0.12), (rr(0.0145), 0.45),
                           (rr(0.017), fore - 0.05), (rr(0.019), fore + 0.05), (0, fore + 0.056)], n=10)
    # the head, built across X (the blade toward +X, the pick toward -X), its thickness in Y
    K.box('eye', RED, (0.055, 0.048, 0.1), (0, 0, fore), bevel=0.006)
    K.loft('blade', RED, [(0.02, fore - 0.045, fore + 0.045, 0.022, 0.022), (0.08, fore - 0.058, fore + 0.055, 0.011, 0.011),
                          (0.142, fore - 0.088, fore + 0.072, 0.004, 0.004)], axis='x')
    K.loft('edge', EDGE, [(0.14, fore - 0.088, fore + 0.072, 0.0042, 0.0042), (0.165, fore - 0.097, fore + 0.079, 0.0012, 0.0012)], axis='x')
    pk = K.loft('pick', RED, [(-0.18, fore - 0.003, fore + 0.003, 0.002, 0.002), (-0.12, fore - 0.012, fore + 0.012, 0.008, 0.008),
                              (-0.02, fore - 0.04, fore + 0.04, 0.02, 0.02)], axis='x')
    K.recalc(pk)
    tape_wrap(K, 'grip', TAPE, rr(0.0225), -back + 0.01, 0.1, n=5)
    OBJECTS['fire_axe']['left_x'] = 0.4
    return True


def b_rebar_spear(K, mu):
    """a spear: a shovel's ash handle with a length of rusted rebar driven into its end, ground to a point, the end of the
    handle bound in wire; two hands, the right well back"""
    WOOD, REBAR, WIRE, TAPE = ('clay_mustard', 1), ('clay_rust', 1), ('tape_grey', 2), ('rubber', 1)
    back, fore = 0.55, 1.2; rr = lambda x: x * FAT
    K.lathe('pole', WOOD, [(0, -back), (rr(0.014), -back), (rr(0.0145), -back + 0.01), (rr(0.0145), fore - 0.02), (rr(0.013), fore), (0, fore)], n=10)
    r = rr(0.0079)
    K.lathe('rebar', REBAR, [(0, fore - 0.02), (r, fore - 0.02), (r, fore + 0.36), (r * 0.6, fore + 0.41), (0, fore + 0.45)], n=8, smooth=False)
    for k in range(12):
        z = fore + 0.01 + k * 0.03
        K.lathe('rib_%d' % k, REBAR, [(0, z), (r * 1.22, z), (r * 1.22, z + 0.006), (0, z + 0.006)], n=8, smooth=False)
    for k in range(10):
        z = fore - 0.2 + k * 0.018
        K.lathe('wire_%d' % k, WIRE, [(0, z), (rr(0.0154), z), (rr(0.0154), z + 0.006), (0, z + 0.006)], n=10)
    tape_wrap(K, 'grip', TAPE, rr(0.0155), -0.06, 0.08, n=4)
    tape_wrap(K, 'grip_left', TAPE, rr(0.0155), 0.42, 0.56, n=4)
    OBJECTS['rebar_spear']['left_x'] = 0.49
    return True


def b_cleaver(K, mu):
    """a butcher's cleaver: a wooden grip, three rivets, a deep square blade with its hanging hole, the edge ground bright"""
    WOOD, STEEL, EDGE, RUST, HOLE = ('clay_mustard', 1), ('tape_grey', 1), ('chrome', 1), ('clay_rust', 1), ('rubber', 0)
    back, fore = 0.05, 0.27
    K.lathe('grip', WOOD, [(0, -back), (0.017, -back), (0.018, 0.058), (0.014, 0.08), (0, 0.08)], n=10)
    for j, z in enumerate((-0.025, 0.015, 0.05)):
        for s in (-1, 1): K.disc('rivet_%d_%d' % (j, s > 0), EDGE, 0.005, (0, s * 0.0175, z), (0, s, 0), depth=0.004, verts=8)
    K.loft('blade', STEEL, [(0.078, -0.024, 0.074, 0.0042, 0.0016), (0.13, -0.026, 0.086, 0.0036, 0.0013), (fore, -0.026, 0.09, 0.003, 0.001)])
    K.loft('edge', EDGE, [(0.078, 0.066, 0.075, 0.0017, 0.0008), (0.13, 0.078, 0.087, 0.0014, 0.0007), (fore, 0.082, 0.091, 0.0012, 0.0006)])
    K.disc('hole', HOLE, 0.009, (-0.012, 0, fore - 0.022), (0, 1, 0), depth=0.01, verts=10)
    for k, (x, z) in enumerate(((0.01, 0.16), (0.04, 0.22), (0.0, 0.24))):
        K.disc('rust_%d' % k, RUST, 0.011, (x, 0.0035, z), (0, 1, 0), depth=0.003, verts=8)
    return True


def b_chain(K, mu):
    """a flail: a short pipe handle, the grip taped, an eye bolt in its end, a length of chain and a brass padlock on it"""
    HANDLE, STEEL, TAPE, BRASS, RUST = ('metal_painted', 1), ('tape_grey', 2), ('rubber', 1), ('clay_mustard', 2), ('clay_rust', 1)
    back, fore = 0.07, 0.25; r = 0.0145 * FAT
    K.lathe('handle', HANDLE, [(0, -back), (r * 1.1, -back), (r * 1.1, -back + 0.02), (r, -back + 0.02), (r, fore), (r * 1.15, fore), (r * 1.15, fore + 0.015), (0, fore + 0.015)], n=10)
    tape_wrap(K, 'grip', TAPE, r * 1.12, -0.05, 0.09, n=5)
    K.CI.link(K.bpy, 'eye', K.m(*STEEL), (0, 0, fore + 0.03), (0, 0, 1), False, major=0.016, minor=0.005)
    pts = []
    n = 9
    for i in range(n + 1):
        t = i / n; pts.append(mu.Vector((0.16 * t ** 1.7, 0.0, fore + 0.05 + 0.44 * t - 0.05 * t * t)))
    for i in range(n):
        a, b = pts[i], pts[i + 1]
        K.CI.link(K.bpy, 'link_%d' % i, K.m(*(RUST if i in (3, 6) else STEEL)), tuple((a + b) / 2), tuple(b - a), i % 2 == 1, major=0.02, minor=0.0058)
    end = pts[-1] + (pts[-1] - pts[-2]).normalized() * 0.02
    K.tube('shackle', STEEL, [end + mu.Vector((-0.012, 0, 0.0)), end + mu.Vector((-0.012, 0, 0.03)), end + mu.Vector((0.0, 0, 0.042)),
                              end + mu.Vector((0.012, 0, 0.03)), end + mu.Vector((0.012, 0, 0.0))], 0.005, verts=8)
    K.box('lock', BRASS, (0.05, 0.024, 0.055), tuple(end + mu.Vector((0, 0, -0.025))), bevel=0.006)
    K.disc('keyhole', TAPE, 0.004, tuple(end + mu.Vector((0, -0.0125, -0.03))), (0, -1, 0), depth=0.003, verts=8)
    return True


def b_pole_hook(K, mu):
    """a firefighter's pike pole: a faded fibreglass pole, a steel point and a hook bent back off its ferrule, a rubber butt; two hands"""
    POLE, STEEL, TAPE, RUST = ('clay_mustard', 2), ('metal_painted', 0), ('rubber', 1), ('clay_rust', 1)
    back, fore = 0.6, 1.25; rr = lambda x: x * FAT
    K.lathe('pole', POLE, [(0, -back), (rr(0.016), -back), (rr(0.016), fore), (0, fore)], n=10)
    K.lathe('butt', TAPE, [(0, -back - 0.04), (rr(0.019), -back - 0.04), (rr(0.019), -back + 0.04), (0, -back + 0.04)], n=10)
    K.lathe('ferrule', STEEL, [(0, fore - 0.09), (rr(0.019), fore - 0.09), (rr(0.019), fore + 0.02), (rr(0.012), fore + 0.04), (0, fore + 0.04)], n=10)
    K.lathe('point', STEEL, [(0, fore + 0.03), (rr(0.009), fore + 0.03), (rr(0.0085), fore + 0.17), (0, fore + 0.24)], n=8, smooth=False)
    hook = [(rr(0.018), 0, fore - 0.0), (0.05, 0, fore + 0.025), (0.085, 0, fore + 0.005), (0.095, 0, fore - 0.035), (0.083, 0, fore - 0.075), (0.066, 0, fore - 0.095)]
    for i, (a, b) in enumerate(zip(hook, hook[1:])): K.rod('hook_%d' % i, STEEL, a, b, rr(0.0085) * (1 - 0.13 * i), verts=8)
    K.disc('rust', RUST, 0.016, (rr(0.0195), 0, fore - 0.05), (1, 0, 0), depth=0.004)
    tape_wrap(K, 'grip', TAPE, rr(0.0172), -0.06, 0.08, n=4)
    tape_wrap(K, 'grip_left', TAPE, rr(0.0172), 0.5, 0.64, n=4)
    OBJECTS['pole_hook']['left_x'] = 0.57
    return True


def b_compound_bow(K, mu):
    """a hunter's compound bow, held in the LEFT hand: built straight in the held frame (the grip at the origin, the arrow flies
    along +X, the limbs up and down along Z, the string behind toward -X): the reflexed riser, split limbs, the two cams, the
    string and its crossed cables, the sight"""
    RISER, LIMB, CAM, STRING = ('metal_painted', 1), ('cloth_black', 2), ('chrome', 0), ('tape_masking', 2)
    R = 0.014 * FAT
    K.tube('riser', RISER, [(0.035, 0, -0.36), (0.045, 0, -0.16), (0.0, 0, -0.06), (0.0, 0, 0.06), (0.045, 0, 0.16), (0.035, 0, 0.36)], R)
    K.lathe('grip', LIMB, [(0, -0.055), (R * 1.25, -0.055), (R * 1.25, 0.055), (0, 0.055)], n=10)
    tip = {}
    for s in (-1, 1):
        for yy in (-0.016, 0.016):
            K.rod('limb_%d_%d' % (s > 0, yy > 0), LIMB, (0.035, yy, s * 0.35), (-0.075, yy, s * 0.52), 0.0085 * FAT, verts=8)
        tip[s] = mu.Vector((-0.08, 0, s * 0.53))
        K.disc('cam_%d' % (s > 0), CAM, 0.036, tuple(tip[s] + mu.Vector((0, 0, -s * 0.005))), (0, 1, 0), depth=0.014, verts=14)
        K.rod('axle_%d' % (s > 0), RISER, tuple(tip[s] + mu.Vector((0, -0.024, 0))), tuple(tip[s] + mu.Vector((0, 0.024, 0))), 0.006, verts=6)
    K.rod('string', STRING, (-0.115, 0, 0.53), (-0.115, 0, -0.53), 0.0032 * FAT, verts=6)
    for s, yy in ((1, 0.009), (-1, -0.009)):
        K.rod('cable_%d' % (s > 0), STRING, (-0.06, yy, s * 0.55), (-0.045, yy * 2.5, -s * 0.5), 0.0022 * FAT, verts=5)
    K.rod('cable_guard', RISER, (0.02, 0, -0.1), (-0.05, 0.03, -0.1), 0.005, verts=6)
    K.box('sight', RISER, (0.03, 0.012, 0.05), (0.04, 0.02, 0.1), bevel=0.003)
    for k in range(3): K.rod('pin_%d' % k, CAM, (0.04, 0.026, 0.085 + k * 0.012), (0.04, 0.045, 0.085 + k * 0.012), 0.0018, verts=5)
    return False


def b_club(K, mu):
    """a table leg turned into a club (ANIMATION's sketch's shape): eight faces, heavier at the far end, the grip taped, two
    bent nails left in it"""
    WOOD, TAPE, NAIL = ('clay_mustard', 1), ('rubber', 1), ('tape_grey', 2)
    back, fore = 0.06, 0.5; rr = lambda x: x * FAT
    K.lathe('club', WOOD, [(0, -back), (rr(0.017), -back), (rr(0.015), 0.1), (rr(0.019), 0.2), (rr(0.026), 0.38), (rr(0.028), fore - 0.03),
                           (rr(0.022), fore), (0, fore)], n=8, smooth=False)
    tape_wrap(K, 'grip', TAPE, rr(0.0178), -0.045, 0.09, n=5)
    for k, (z, a) in enumerate(((0.42, 0.3), (0.46, 2.0))):
        d = mu.Vector((math.cos(a), math.sin(a), 0)); base = d * rr(0.027) + mu.Vector((0, 0, z))
        K.rod('nail_%d' % k, NAIL, tuple(base), tuple(base + d * 0.025 + mu.Vector((0, 0, 0.015))), 0.003, verts=6)
    return True


def b_bat(K, mu):
    """an ash bat with nails driven through the barrel (Battle Brothers' morning star in the valley's hands), the grip taped"""
    ASH, NAIL, TAPE, RUST = ('clay_bone', 2), ('tape_grey', 2), ('rubber', 1), ('clay_rust', 1)
    back, fore = 0.07, 0.78; rr = lambda x: x * FAT
    K.lathe('bat', ASH, [(0, -back), (rr(0.022), -back), (rr(0.022), -back + 0.012), (rr(0.0125), -back + 0.03), (rr(0.0135), 0.22), (rr(0.022), 0.4),
                         (rr(0.031), 0.55), (rr(0.033), fore - 0.06), (rr(0.03), fore - 0.01), (0, fore)], n=16)
    tape_wrap(K, 'grip', TAPE, rr(0.0145), -back + 0.03, 0.13, n=6)
    for k in range(12):
        z = 0.5 + 0.02 * k; a = k * 2.4 + 0.3
        d = mu.Vector((math.cos(a), math.sin(a), 0.0))
        K.rod('nail_%d' % k, RUST if k % 4 == 1 else NAIL, tuple(d * rr(0.025) + mu.Vector((0, 0, z))), tuple(d * (rr(0.033) + 0.035) + mu.Vector((0, 0, z + 0.01))), 0.0045, 6)
    return True


def b_hatchet(K, mu):
    """the poacher's hatchet (COOK THREE's): a short haft, a bearded steel head, its edge ground bright"""
    WOOD, IRON, EDGE, TAPE = ('clay_mustard', 1), ('metal_painted', 1), ('chrome', 1), ('rubber', 1)
    back, fore = 0.05, 0.36; rr = lambda x: x * FAT
    K.lathe('haft', WOOD, [(0, -back), (rr(0.019), -back), (rr(0.016), 0.0), (rr(0.014), 0.2), (rr(0.016), fore), (0, fore + 0.005)], n=10)
    tape_wrap(K, 'grip', TAPE, rr(0.0178), -0.04, 0.08, n=4)
    K.loft('head', IRON, [(fore - 0.075, -0.03, 0.035, 0.02, 0.016), (fore - 0.06, -0.035, 0.07, 0.022, 0.01), (fore + 0.0, -0.035, 0.1, 0.022, 0.006), (fore + 0.025, -0.03, 0.115, 0.018, 0.004)])
    K.loft('edge', EDGE, [(fore - 0.07, 0.1, 0.112, 0.006, 0.0015), (fore + 0.03, 0.115, 0.125, 0.004, 0.001)])
    return True


# ---- THE WORN THINGS: built on the rig's man in his rest pose (the thug, clothed), skinned to his bones by name ----------
TORSO_BONES = ('Skeleton_torso_joint_1', 'Skeleton_torso_joint_2', 'torso_joint_3', 'Skeleton_neck_joint_1')
ARM_L = ('Skeleton_arm_joint_L__4_', 'Skeleton_arm_joint_L__3_', 'Skeleton_arm_joint_L__2_')   # shoulder, elbow, wrist joints
ARM_R = ('Skeleton_arm_joint_R', 'Skeleton_arm_joint_R__2_', 'Skeleton_arm_joint_R__3_')
NOT_BODY = ('Icosphere', 'item_', 'worn_', 'thug_pipe', '_pipe', '_machete', '_shield', '_sling', '_hatchet')


class Body:
    """the man the worn thing is built over (or fitted to): his armature, his meshes (clothes included, never a held thing),
    every vertex's bone weights, and his outermost surface by family, cast from outside in"""
    def __init__(self, bpy):
        import mathutils
        from mathutils.bvhtree import BVHTree
        from mathutils.kdtree import KDTree
        self.V, self.BVH = mathutils.Vector, BVHTree
        sc = bpy.context.scene
        self.arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
        self.meshes = [o for o in sc.objects if o.type == 'MESH' and not any(t in o.name for t in NOT_BODY)]
        self.P, self.F, self.W, self.fb = [], [], [], []
        for o in self.meshes:
            names = {g.index: g.name for g in o.vertex_groups}; off = len(self.P); M = o.matrix_world
            self.P += [M @ v.co for v in o.data.vertices]
            ws = [{names[g.group]: g.weight for g in v.groups if g.group in names and g.weight > 1e-4} for v in o.data.vertices]
            self.W += ws
            for f in o.data.polygons:
                acc = {}
                for i in f.vertices:
                    for b, w in ws[i].items(): acc[b] = acc.get(b, 0) + w
                self.F.append([off + i for i in f.vertices]); self.fb.append(max(acc, key=acc.get) if acc else '')
        self.kd = KDTree(len(self.P))
        for i, p in enumerate(self.P): self.kd.insert(p, i)
        self.kd.balance()
        self._bvh = {}
        B = self.arm.data.bones; Aw = self.arm.matrix_world
        self.j = lambda n: Aw @ B[n].head_local
        self.t = lambda n: Aw @ B[n].tail_local

    def bvh(self, bones=None):
        k = tuple(sorted(bones)) if bones else 'all'
        if k not in self._bvh:
            F = [f for f, b in zip(self.F, self.fb) if bones is None or b in bones]
            self._bvh[k] = self.BVH.FromPolygons(self.P, F)
        return self._bvh[k]

    def out(self, o, d, bones=None, far=0.45, last=None):
        """the distance from o along d to his outermost surface (cast from far outside back toward o)"""
        hit = self.bvh(bones).ray_cast(o + d * far, -d, far)
        return (hit[0] - o).length if hit[0] else last

    def weights(self, p, bones=None):
        """the weights of his nearest vertex (of the given bones' families when given)"""
        if bones:
            best = None
            for (co, i, dist) in self.kd.find_n(p, 24):
                if any(b in bones for b in self.W[i]): best = i; break
            i = best if best is not None else self.kd.find(p)[1]
        else:
            i = self.kd.find(p)[1]
        return self.W[i]

    def head(self):
        """the head's centre and radius (the head and whatever he wears on it: cap, hair), measured off the meshes the head
        bone carries above the jaw"""
        pts = [p for p, w in zip(self.P, self.W) if w.get(HEAD_BONE, 0) > 0.5]
        zs = sorted(p.z for p in pts); top = zs[-1]
        hi = [p for p in pts if p.z > top - 0.2]
        cx = (min(p.x for p in hi) + max(p.x for p in hi)) / 2; cy = (min(p.y for p in hi) + max(p.y for p in hi)) / 2
        C = self.V((cx, cy, top - 0.18))
        return C, top


def sheet_mesh(K, name, mat, rows, closed=True, thick=0.008, centre=None, smooth=True, solid=True):
    """a surface through rows of points (each row the same count; closed = each row a ring), turned to face away from centre,
    then given thickness outward"""
    import bmesh
    n = len(rows[0]); V = [tuple(p) for r in rows for p in r]; F = []
    for j in range(len(rows) - 1):
        for i in range(n if closed else n - 1):
            a, b = j * n + i, j * n + (i + 1) % n
            F.append((a, b, b + n, a + n))
    o = K.mesh(name, mat, V, F, smooth)
    if centre is not None:
        M = o.matrix_world; out = 0
        for f in o.data.polygons:
            out += 1 if f.normal.dot(f.center - K.V(centre)) > 0 else -1
        if out < 0:
            for f in o.data.polygons: f.flip()
            o.data.update()
    if solid and thick:
        md = o.modifiers.new('solid', 'SOLIDIFY'); md.thickness = thick; md.offset = 1.0; md.use_even_offset = True
        K.bpy.context.view_layer.objects.active = o
        for x in K.bpy.context.scene.objects: x.select_set(x is o)
        K.bpy.ops.object.modifier_apply(modifier='solid')
    return o


def skin(o, fn):
    """vertex weights: fn(world point) -> {bone: weight}"""
    for vg in list(o.vertex_groups): o.vertex_groups.remove(vg)
    groups = {}
    M = o.matrix_world
    for v in o.data.vertices:
        ws = fn(M @ v.co); tot = sum(ws.values()) or 1.0
        for b, w in ws.items():
            if w / tot < 1e-3: continue
            if b not in groups: groups[b] = o.vertex_groups.new(name=b)
            groups[b].add([v.index], w / tot, 'REPLACE')
    return o


def dome(C, R, az_n, el_lo, el_hi=89.0, el_n=14, warp=None):
    """rows of points over a head from the rim up to the crown: az 0 = his front (-Y), turning toward his left (+X);
    R(az, el) the radius, el_lo(az) the rim's elevation in degrees, warp(az, el, p) a last nudge"""
    import mathutils
    rows = []
    for j in range(el_n + 1):
        row = []
        for i in range(az_n):
            az = 2 * math.pi * i / az_n
            e = math.radians(el_lo(az) + (el_hi - el_lo(az)) * j / el_n)
            d = mathutils.Vector((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e)))
            p = C + d * R(az, e)
            if warp: p = warp(az, e, p)
            row.append(p)
        rows.append(row)
    return rows


def head_frame(K):
    B = Body(K.bpy); C, top = B.head()
    rad = lambda az, e, extra=0.0: (B.out(C, K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e))), [HEAD_BONE], 0.4) or 0.17) + extra
    return B, C, top, rad


def head_w(B):
    return lambda p: {HEAD_BONE: 1.0}


def b_hard_hat(K, mu):
    """a builder's hard hat gone chalky in the sun: the shell, its three ridges, the peak over the brow and a narrow rim all
    round, a sticker half peeled, the suspension's strap at the nape"""
    # round 2 of the loop: the first shell (2 cm off the skull, its rim at the brow, a 7.5 cm peak dropping) sat on him like a
    # mushroom over the whole face from the camera's 45 degrees, and its mustard came out of the sun tan, a pith helmet: the
    # shell is snug now (it replaces whatever he wore on his head), the rim rides high over the brow, the peak is short and
    # level, and the plastic is the lighter yellow step so it reads as a builder's hat
    SHELL, RUB, STICK = ('clay_mustard', 3), ('rubber', 1), ('tape_masking', 3)
    B, C, top, rad = head_frame(K)
    R0 = max(rad(a, math.radians(e)) for a in (0, 1.57, 3.14, 4.71) for e in (10, 40, 70)) + 0.006
    R = lambda az, e: R0 * (1.0 + 0.05 * math.cos(az) ** 2) * (1.0 + 0.03 * math.sin(e))
    rim = lambda az: 26 * math.cos(az) ** 2 + 6 if math.cos(az) > 0 else 6 - 4 * math.cos(az) ** 2
    parts = [sheet_mesh(K, 'worn_hat_shell', SHELL, dome(C, R, 48, rim, el_n=12), thick=0.012, centre=C)]
    # the peak: out and a little down over the brow; the rim: a narrow lip all round
    rows = []
    for k, (ext, drop) in enumerate(((0.0, 0.0), (0.025, 0.004), (0.045, 0.01))):
        row = []
        for i in range(25):
            az = math.radians(-75 + 150 * i / 24); e = math.radians(rim(az))
            d = K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e)))
            h = K.V((math.sin(az), -math.cos(az), 0.0))
            fall = max(0.0, math.cos(az)) ** 1.5
            row.append(C + d * R(az, e) + h * ext * fall - K.V((0, 0, drop * fall)) + h * 0.012)
        rows.append(row)
    parts.append(sheet_mesh(K, 'worn_hat_peak', SHELL, rows, closed=False, thick=0.008, centre=C))
    rows = []
    for ext in (0.0, 0.016):
        rows.append([C + K.V((math.sin(az) * math.cos(math.radians(rim(az))), -math.cos(az) * math.cos(math.radians(rim(az))), math.sin(math.radians(rim(az))))) * R(az, math.radians(rim(az)))
                     + K.V((math.sin(az), -math.cos(az), 0)) * ext for az in [2 * math.pi * i / 48 for i in range(48)]])
    parts.append(sheet_mesh(K, 'worn_hat_rim', SHELL, rows, thick=0.006, centre=C))
    # three ridges front to back over the crown
    for k, a0 in enumerate((-0.32, 0.0, 0.32)):
        pts = []
        for j in range(13):
            e = math.radians(rim(0) + 4 + (176 - 2 * rim(0)) * j / 12)
            d = K.V((math.sin(a0) * math.cos(e) * (1 if e < math.pi / 2 else 1), -math.cos(a0) * math.cos(e), math.sin(e)))
            pts.append(C + d * (R(a0 if math.cos(e) >= 0 else a0 + math.pi, min(e, math.pi - e)) + 0.008))
        parts += K.tube('worn_hat_ridge_%d' % k, SHELL, pts[1:-1], 0.011 if k == 1 else 0.008, verts=8)
    # the sticker: a pale square half peeled off the left side
    a = math.radians(70); e = math.radians(25)
    d = K.V((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    parts.append(K.orient(K.box('worn_hat_sticker', STICK, (0.05, 0.004, 0.04), C + d * (R(a, e) + 0.014)), d))
    # the suspension's strap across the nape
    pts = [C + K.V((math.sin(az) * 0.165, -math.cos(az) * 0.165, -0.04 - 0.03 * math.cos(az - math.pi) ** 2)) for az in [math.radians(110 + 140 * i / 8) for i in range(9)]]
    parts += K.tube('worn_hat_strap', RUB, pts, 0.008, verts=6)
    for o in parts: skin(o, head_w(B))


def b_riot_helmet(K, mu):
    """a police riot helmet: a black shell low over the ears, the visor flipped up on its two pivots, the rubber neck guard
    hanging at the back, the chin strap"""
    SHELL, VIS, RUB, PIV = ('cloth_black', 2), ('glass_eye', 1), ('rubber', 1), ('metal_painted', 0)
    B, C, top, rad = head_frame(K)
    # round 2: snug (it read as a bucket over the face), the front rim over the brow
    R0 = max(rad(a, math.radians(e)) for a in (0, 1.57, 3.14, 4.71) for e in (10, 40, 70)) + 0.01
    R = lambda az, e: R0 * (1.0 + 0.04 * math.cos(az) ** 2)
    rim = lambda az: 20 * max(0.0, math.cos(az)) ** 2 - 30 * (1 - max(0.0, math.cos(az))) ** 1.2
    parts = [sheet_mesh(K, 'worn_riot_shell', SHELL, dome(C, R, 48, rim, el_n=14), thick=0.014, centre=C)]
    # the visor, flipped up over the brow and the crown's front
    rows = []
    for j in range(7):
        e = math.radians(18 + 34 * j / 6)
        rows.append([C + K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e))) * (R(az, e) + 0.03) for az in [math.radians(-85 + 170 * i / 24) for i in range(25)]])
    parts.append(sheet_mesh(K, 'worn_riot_visor', VIS, rows, closed=False, thick=0.006, centre=C))
    for s in (-1, 1):
        a = s * math.pi / 2; d = K.V((math.sin(a), 0, 0.12)).normalized()
        parts.append(K.disc('worn_riot_pivot_%d' % (s > 0), PIV, 0.03, C + d * (R(a, 0) + 0.025), (s, 0, 0), depth=0.02, verts=12))
    # the neck guard: a rubber flap from the back rim down to the collar, flaring out
    rows = []
    for j in range(6):
        drop = 0.02 + 0.13 * j / 5
        row = []
        for i in range(17):
            az = math.radians(115 + 130 * i / 16); e = math.radians(rim(az))
            d = K.V((math.sin(az), -math.cos(az), 0.0))
            p = C + K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e))) * R(az, e)
            row.append(p + d * (0.012 + 0.06 * j / 5) - K.V((0, 0, drop)))
        rows.append(row)
    parts.append(sheet_mesh(K, 'worn_riot_neck', RUB, rows, closed=False, thick=0.008, centre=C))
    pts = [C + K.V((math.sin(az) * 0.15, -math.cos(az) * 0.15, -0.2 + 0.08 * abs(math.sin(az)))) for az in [math.radians(-95 + 190 * i / 10) for i in range(11)]]
    parts += K.tube('worn_riot_chin', RUB, pts, 0.007, verts=6)
    # the one pale thing (rule 167(b): never all black): the unit's stripe round the back and its number, half worn off
    ID = ('clay_bone', 3)
    for i in range(14):
        az = math.radians(100 + 160 * i / 13)
        if i in (5, 6): continue                                  # scraped through
        e = math.radians(24); d = K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e)))
        parts.append(K.orient(K.box('worn_riot_stripe_%d' % i, ID, (0.038, 0.004, 0.022), C + d * (R(az, e) + 0.016)), d))
    for k, az in enumerate((math.radians(170), math.radians(190))):
        e = math.radians(5); d = K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e)))
        parts.append(K.orient(K.box('worn_riot_number_%d' % k, ID, (0.022, 0.004, 0.04), C + d * (R(az, e) + 0.016)), d))
    for o in parts:
        skin(o, (lambda p: {HEAD_BONE: 1.0 - max(0.0, min(1.0, (C.z - 0.16 - p.z) / 0.08)), NECK_BONE: max(0.0, min(1.0, (C.z - 0.16 - p.z) / 0.08))})
             if o.name.startswith('worn_riot_neck') else head_w(B))


def b_full_riot_helm(K, mu):
    """a full riot helm: an olive shell, the visor down over the whole face, a rubber seal round it, a filter canister at the
    chin, a dead headlamp on the left, a curtain hanging to the shoulders"""
    SHELL, VIS, RUB, CAN, RUST = ('metal_painted', 1), ('glass_eye', 1), ('rubber', 1), ('metal_painted', 0), ('clay_rust', 1)
    B, C, top, rad = head_frame(K)
    R0 = max(rad(a, math.radians(e)) for a in (0, 1.57, 3.14, 4.71) for e in (10, 40, 70)) + 0.014
    R = lambda az, e: R0 * (1.0 + 0.04 * math.cos(az) ** 2)
    rim = lambda az: 14 * max(0.0, math.cos(az)) ** 2 - 34 * (1 - max(0.0, math.cos(az))) ** 1.2
    parts = [sheet_mesh(K, 'worn_full_shell', SHELL, dome(C, R, 48, rim, el_n=14), thick=0.015, centre=C)]
    # the visor down: from the brow to under the chin, round to the ears
    rows = []
    for j in range(9):
        e = math.radians(14 - 62 * j / 8)
        rows.append([C + K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e))) * (R(az, max(e, 0)) + 0.028 - 0.01 * j / 8) for az in [math.radians(-82 + 164 * i / 24) for i in range(25)]])
    parts.append(sheet_mesh(K, 'worn_full_visor', VIS, rows, closed=False, thick=0.006, centre=C))
    for k, e in enumerate((15, -49)):
        e = math.radians(e)
        pts = [C + K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e))) * (R(az, max(e, 0)) + 0.03) for az in [math.radians(-84 + 168 * i / 16) for i in range(17)]]
        parts += K.tube('worn_full_seal_%d' % k, RUB, pts, 0.011, verts=6)
    # the filter canister at the chin, pointing forward and down
    e = math.radians(-40); d = K.V((0, -math.cos(e), math.sin(e)))
    base = C + d * (R(0, 0) + 0.03)
    can = K.rod('worn_full_filter', CAN, tuple(base), tuple(base + K.V((0, -0.06, -0.03))), 0.04, verts=12); parts.append(can)
    parts.append(K.rod('worn_full_filter_band', RUST, tuple(base + K.V((0, -0.035, -0.0175))), tuple(base + K.V((0, -0.045, -0.0225))), 0.042, verts=12))
    # the dead headlamp on the left of the shell
    a = math.radians(55); e = math.radians(22)
    d = K.V((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    parts.append(K.rod('worn_full_lamp', CAN, tuple(C + d * (R(a, e) + 0.005)), tuple(C + d * (R(a, e) + 0.03) + K.V((0, -0.05, 0))), 0.022, verts=10))
    # the curtain: heavy cloth from the rim at the back and sides down to the shoulders
    rows = []
    for j in range(7):
        row = []
        for i in range(21):
            az = math.radians(80 + 200 * i / 20); e = math.radians(rim(az))
            d = K.V((math.sin(az), -math.cos(az), 0.0))
            p = C + K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e))) * R(az, e)
            row.append(p + d * (0.012 + 0.07 * j / 6 + 0.006 * math.sin(i * 1.7)) - K.V((0, 0, 0.02 + 0.16 * j / 6)))
        rows.append(row)
    parts.append(sheet_mesh(K, 'worn_full_curtain', RUB, rows, closed=False, thick=0.007, centre=C))
    for o in parts:
        skin(o, (lambda p: {HEAD_BONE: 1.0 - max(0.0, min(1.0, (C.z - 0.16 - p.z) / 0.1)), NECK_BONE: max(0.0, min(1.0, (C.z - 0.16 - p.z) / 0.1))})
             if 'curtain' in o.name else head_w(B))


def b_rag_hood(K, mu):
    """a hood sewn out of rags: loose over the skull and down to the shoulders, the face left open, the hem torn, a patch
    stitched on, a strip of black rag tied across the mouth"""
    CLOTH, BAND, PATCH = ('clay_bone', 1), ('cloth_black', 2), ('clay_rust', 1)
    B, C, top, rad = head_frame(K)
    def R(az, e):
        return rad(az, e, 0.016) + 0.006 * math.sin(5 * az + 3 * e) + 0.01 * max(0.0, -math.sin(e))
    # the face opening: in front between the brow and the chin the hood is cut away (its rows start below and wrap round)
    rows = []
    n = 40
    for j in range(16):
        e = math.radians(-62 + (86 + 62) * j / 15)
        row = []
        for i in range(n):
            az = 2 * math.pi * i / n
            d = K.V((math.sin(az) * math.cos(e), -math.cos(az) * math.cos(e), math.sin(e)))
            p = C + d * R(az, e)
            # below the jaw the hood falls as a drape, flaring out over the shoulders
            if e < math.radians(-30):
                t = (math.radians(-30) - e) / math.radians(32)
                h = K.V((math.sin(az), -math.cos(az), 0.0))
                p = p + h * (0.05 * t * t) + K.V((0, 0, -0.03 * t))
            row.append(p)
        rows.append(row)
    o = sheet_mesh(K, 'worn_hood', CLOTH, rows, thick=0.008, centre=C, solid=False)
    import bmesh
    bm = bmesh.new(); bm.from_mesh(o.data); bm.faces.ensure_lookup_table()
    cut = []
    for f in bm.faces:
        c = f.calc_center_median() - C
        az = math.atan2(c.x, -c.y); el = math.degrees(math.asin(max(-1, min(1, c.z / max(1e-6, c.length)))))
        if abs(az) < math.radians(48) and -38 < el < 16: cut.append(f)                     # the face
        elif el < -50 + 9 * math.sin(az * 7) + 5 * math.sin(az * 13): cut.append(f)        # the torn hem
    bmesh.ops.delete(bm, geom=cut, context='FACES'); bm.to_mesh(o.data); bm.free()
    md = o.modifiers.new('solid', 'SOLIDIFY'); md.thickness = 0.008; md.offset = 1.0
    K.bpy.context.view_layer.objects.active = o
    for x in K.bpy.context.scene.objects: x.select_set(x is o)
    K.bpy.ops.object.modifier_apply(modifier='solid')
    parts = [o]
    # the rolled edge round the face
    pts = []
    for i in range(25):
        t = 2 * math.pi * i / 24
        az = math.radians(48) * math.cos(t); el = math.radians(-11 + 27 * math.sin(t))
        d = K.V((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
        pts.append(C + d * (R(az, el) + 0.004))
    parts += K.tube('worn_hood_edge', CLOTH, pts, 0.012, verts=6)
    # the black rag tied across the mouth, its knot and tails at the back
    pts = []
    for i in range(25):
        az = 2 * math.pi * i / 24; el = math.radians(-24 - 6 * math.cos(az))
        d = K.V((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
        pts.append(C + d * (R(az, el) + 0.012))
    parts += K.tube('worn_hood_band', BAND, pts, 0.018, verts=6)
    back = C + K.V((0, R(math.pi, math.radians(-24)) + 0.03, -0.07))
    parts.append(K.rod('worn_hood_tail_a', BAND, tuple(back), tuple(back + K.V((0.02, 0.03, -0.12))), 0.012, verts=6))
    parts.append(K.rod('worn_hood_tail_b', BAND, tuple(back), tuple(back + K.V((-0.03, 0.025, -0.09))), 0.011, verts=6))
    # a patch stitched on the crown's right side
    a = math.radians(-60); e = math.radians(35)
    d = K.V((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    parts.append(K.orient(K.box('worn_hood_patch', PATCH, (0.07, 0.006, 0.06), C + d * (R(a, e) + 0.01)), d))
    def w(p):
        t = max(0.0, min(1.0, (C.z - 0.15 - p.z) / 0.1))
        return {HEAD_BONE: 1.0 - t, NECK_BONE: t * 0.6, 'torso_joint_3': t * 0.4}
    for o in parts: skin(o, w)


# ---- THE BODY: rings round his torso cast from outside in (his clothes included), sleeves round his arms ---------------
def torso_rings(B, z0, z1, nz, n=40, off=0.02, r_fn=None):
    rows = []
    cx = B.j('Skeleton_torso_joint_1').x
    for j in range(nz + 1):
        z = z0 + (z1 - z0) * j / max(1, nz)
        cy = 0.0
        row = []; last = 0.13
        for i in range(n):
            a = 2 * math.pi * i / n; d = B.V((math.sin(a), -math.cos(a), 0.0))
            o = B.V((cx, cy, z)); r = B.out(o, d, TORSO_BONES, 0.32, last) or last; last = r
            r = r + (r_fn(a, z) if r_fn else 0.0) + off
            row.append(o + d * r)
        rows.append(row)
    # smooth each ring a little so the shell is cloth over him, not every fold of the shirt under it
    for row in rows:
        for _ in range(2):
            c = [p.copy() for p in row]
            for i in range(len(row)): row[i] = (c[i - 1] + c[i] * 2 + c[(i + 1) % len(row)]) / 4
    return rows


def arm_rings(B, side, s0, s1, ns, n=16, off=0.02, r_add=None):
    """rings round one arm, s from 0 (the shoulder) to 1 (the elbow) to 2 (the wrist)"""
    J = ARM_L if side > 0 else ARM_R
    sh, el, wr = B.j(J[0]), B.j(J[1]), B.j(J[2])
    bones = set(J)
    rows = []
    for k in range(ns + 1):
        s = s0 + (s1 - s0) * k / ns
        a, b = (sh, el) if s <= 1 else (el, wr); t = s if s <= 1 else s - 1
        o = a.lerp(b, t); ax = (b - a).normalized()
        u = ax.cross(B.V((0, 0, 1))).normalized(); w = ax.cross(u).normalized()
        row = []; last = 0.05
        for i in range(n):
            g = 2 * math.pi * i / n; d = (u * math.cos(g) + w * math.sin(g)).normalized()
            r = B.out(o, d, bones, 0.2, last) or last; last = r
            row.append(o + d * (r + off + (r_add(s) if r_add else 0.0)))
        rows.append(row)
    return rows


def soft_w(B, bones=None):
    """his nearest vertex's weights; with bones given, ONLY those bones' share of them (round 2 of the loop: the padded vest's
    stuffing took a vertex of his that the right arm also carried, and in the walk a pale sliver stretched from his side to his
    swinging hand and on to the floor)"""
    if not bones: return lambda p: B.weights(p)
    def w(p):
        ws = {b: v for b, v in B.weights(p, bones).items() if b in bones}
        return ws or {'Skeleton_torso_joint_2': 1.0}
    return w


def b_work_jacket(K, mu):
    """a canvas work jacket, sun-faded brown duck to the hip: the body, the sleeves to the wrist, a dark corduroy collar and
    cuffs, the zip down the front, two chest pockets with their flaps, a rip on the left sleeve"""
    DUCK, CORD, ZIP, RIP = ('clay_mustard', 1), ('rubber', 2), ('tape_grey', 1), ('cloth_black', 1)
    B = Body(K.bpy)
    rows = torso_rings(B, 0.6, 1.1, 14, off=0.014)
    parts = [sheet_mesh(K, 'worn_jacket_body', DUCK, rows, thick=0.01, centre=B.j('Skeleton_torso_joint_2'))]
    # the shoulders: the top ring drawn in to the collar (a yoke)
    yoke = []
    for k, (z, sq) in enumerate(((1.1, 1.0), (1.13, 0.82), (1.15, 0.62))):
        ring = torso_rings(B, z, z, 0, off=0.014)[0]
        c = B.V((B.j('Skeleton_neck_joint_1').x, -0.01, z))
        yoke.append([c + (p - c) * sq for p in ring])
    yoke.insert(0, rows[-1])
    parts.append(sheet_mesh(K, 'worn_jacket_yoke', DUCK, yoke, thick=0.01, centre=B.j('torso_joint_3')))
    for side in (1, -1):
        sl = arm_rings(B, side, 0.05, 1.92, 12, off=0.014)
        parts.append(sheet_mesh(K, 'worn_jacket_sleeve_%d' % (side > 0), DUCK, sl, thick=0.008, centre=B.j(ARM_L[1] if side > 0 else ARM_R[1])))
        cuff = arm_rings(B, side, 1.84, 1.95, 2, off=0.024)
        parts.append(sheet_mesh(K, 'worn_jacket_cuff_%d' % (side > 0), CORD, cuff, thick=0.008, centre=B.j(ARM_L[2] if side > 0 else ARM_R[2])))
    collar = [yoke[-1], [B.V((p.x, p.y, p.z + 0.045)) + (p - B.V((0, -0.01, p.z))) * 0.08 for p in yoke[-1]]]
    parts.append(sheet_mesh(K, 'worn_jacket_collar', CORD, collar, thick=0.012, centre=B.j('Skeleton_neck_joint_1')))
    hem = torso_rings(B, 0.6, 0.64, 1, off=0.022)
    parts.append(sheet_mesh(K, 'worn_jacket_hem', DUCK, hem, thick=0.01, centre=B.j('Skeleton_torso_joint_1')))
    # the zip down the front, the pockets with their flaps, a rip
    front = [r[0] for r in rows]
    parts += K.tube('worn_jacket_zip', ZIP, [p + B.V((0, -0.012, 0)) for p in front[1:]], 0.006, verts=6)
    for s in (-1, 1):
        i = int(len(rows[0]) * (0.06 if s > 0 else 0.94)); p = rows[10][i]
        pk = K.box('worn_jacket_pocket_%d' % (s > 0), DUCK, (0.085, 0.012, 0.1), p + B.V((0, -0.008, -0.01)), bevel=0.004); parts.append(pk)
        fl = K.box('worn_jacket_flap_%d' % (s > 0), CORD if s > 0 else DUCK, (0.09, 0.016, 0.03), p + B.V((0, -0.016, 0.04)), bevel=0.004); parts.append(fl)
    sl = arm_rings(B, 1, 0.55, 0.62, 1, off=0.024)
    parts.append(sheet_mesh(K, 'worn_jacket_rip', RIP, [sl[0][2:6], sl[1][2:6]], closed=False, thick=0.004))
    for o in parts: skin(o, soft_w(B))


def b_padded_vest(K, mu):
    """a quilted vest with no sleeves, faded olive, its channels sewn across, the armholes and the collar bound in black, a
    zip, one of the channels split with its stuffing out"""
    QUILT, BIND, ZIP, STUFF = ('metal_painted', 2), ('rubber', 1), ('tape_grey', 1), ('clay_bone', 3)
    B = Body(K.bpy)
    quilt = lambda a, z: 0.012 * abs(math.sin((z - 0.6) / 0.065 * math.pi))
    rows = torso_rings(B, 0.62, 1.04, 22, off=0.02, r_fn=quilt)
    parts = [sheet_mesh(K, 'worn_vest_body', QUILT, rows, thick=0.012, centre=B.j('Skeleton_torso_joint_2'))]
    # above the armholes: the front and back panels go up to the shoulders, the sides stay open for his arms
    top = torso_rings(B, 1.04, 1.13, 4, n=40, off=0.02)
    n = len(top[0])
    for nm, idx in (('front', [i % n for i in range(-7, 8)]), ('back', list(range(13, 28)))):
        parts.append(sheet_mesh(K, 'worn_vest_%s' % nm, QUILT, [[r[i] for i in idx] for r in [rows[-1]] + top], closed=False, thick=0.012, centre=B.j('torso_joint_3')))
    for s in (1, -1):   # over each shoulder, front to back
        ia, ib = (5, 15) if s > 0 else (n - 5, 25)
        pts = [top[-1][ia], (top[-1][ia] + top[-1][ib]) / 2 + B.V((0, 0, 0.03)), top[-1][ib]]
        parts += K.tube('worn_vest_strap_%d' % (s > 0), QUILT, pts, 0.026, verts=8)
    for k, row in enumerate((rows[0], top[-1])):
        parts += K.tube('worn_vest_bind_%d' % k, BIND, (row + [row[0]]) if k == 0 else [row[i % n] for i in range(-7, 8)], 0.009, verts=6)
    front = [r[0] for r in rows] + [r[0] for r in top]
    parts += K.tube('worn_vest_zip', ZIP, [p + B.V((0, -0.016, 0)) for p in front], 0.006, verts=6)
    p = rows[8][int(n * 0.85)]
    parts.append(K.box('worn_vest_stuffing', STUFF, (0.06, 0.03, 0.025), p + B.V((0, -0.01, 0)), bevel=0.01))
    for o in parts: skin(o, soft_w(B, set(TORSO_BONES)))


def b_plate_carrier(K, mu):
    """a plate carrier: the front and back plate bags, the cummerbund round his sides, padded shoulder straps, three magazine
    pouches and a radio on the front, a drag handle at the back; faded ranger green webbing, one coyote patch"""
    NYLON, BUCK, PATCH, RADIO = ('metal_painted', 2), ('rubber', 1), ('clay_bone', 1), ('metal_painted', 0)
    B = Body(K.bpy)
    n = 40
    base = torso_rings(B, 0.8, 1.08, 8, n=n, off=0.03)
    ctr = B.j('Skeleton_torso_joint_2')
    def bag(nm, idx, z_lo, z_hi):
        rws = [r for k, r in enumerate(base) if z_lo <= 0.8 + 0.035 * k <= z_hi]
        outer = [[r[i] + (r[i] - B.V((ctr.x, ctr.y, r[i].z))).normalized() * 0.018 for i in idx] for r in rws]
        return sheet_mesh(K, nm, NYLON, outer, closed=False, thick=0.03, centre=ctr)
    parts = [bag('worn_pc_front', [i % n for i in range(-7, 8)], 0.8, 1.08), bag('worn_pc_back', list(range(13, 28)), 0.8, 1.08)]
    cb = torso_rings(B, 0.8, 0.93, 3, n=n, off=0.034)
    parts.append(sheet_mesh(K, 'worn_pc_cummerbund', NYLON, [[r[i] for i in range(5, 16)] for r in cb], closed=False, thick=0.012, centre=ctr))
    parts.append(sheet_mesh(K, 'worn_pc_cummerbund_r', NYLON, [[r[i] for i in range(25, 36)] for r in cb], closed=False, thick=0.012, centre=ctr))
    top = base[-1]
    for s in (1, -1):
        ia, ib = (4, 16) if s > 0 else (n - 4, 24)
        pts = [top[ia], (top[ia] + top[ib]) / 2 + B.V((0, 0, 0.05)), top[ib]]
        parts += K.tube('worn_pc_strap_%d' % (s > 0), NYLON, pts, 0.024, verts=8)
        parts.append(K.box('worn_pc_buckle_%d' % (s > 0), BUCK, (0.03, 0.02, 0.02), top[ia] + B.V((0, -0.035, -0.02)), bevel=0.003))
    # three magazine pouches across the belly, the radio on his left chest, the patch on his right
    for k in range(3):
        p = base[1][[38, 0, 2][k]]
        parts.append(K.box('worn_pc_mag_%d' % k, NYLON, (0.06, 0.05, 0.1), p + B.V((0, -0.065, 0.02)), bevel=0.008))
        parts.append(K.box('worn_pc_mag_flap_%d' % k, BUCK, (0.062, 0.054, 0.02), p + B.V((0, -0.067, 0.075)), bevel=0.005))
    p = base[6][3]
    parts.append(K.box('worn_pc_radio', RADIO, (0.05, 0.04, 0.1), p + B.V((0.0, -0.06, 0.0)), bevel=0.006))
    parts.append(K.rod('worn_pc_antenna', BUCK, tuple(p + B.V((0.015, -0.06, 0.05))), tuple(p + B.V((0.03, -0.05, 0.22))), 0.004, verts=5))
    q = base[6][37]
    parts.append(K.box('worn_pc_patch', PATCH, (0.07, 0.01, 0.045), q + B.V((0, -0.05, 0.0)), bevel=0.002))
    parts += K.tube('worn_pc_handle', BUCK, [base[-1][20] + B.V((-0.04, 0.03, -0.01)), base[-1][20] + B.V((0, 0.06, 0.02)), base[-1][20] + B.V((0.04, 0.03, -0.01))], 0.01, verts=6)
    for o in parts: skin(o, soft_w(B, set(TORSO_BONES)))


def b_full_riot_armour(K, mu):
    """full riot armour: the hard black chest and back shells over a padded coyote suit, shoulder caps, forearm guards, a
    groin flap, knee and shin guards, all strapped on; a cracked shell taped over"""
    # the suit under the shells in faded coyote brown (rule 167(b): black shells on a grey suit read as one dark lump, all grey)
    SHELL, SUIT, STRAP, TAPE = ('cloth_black', 2), ('clay_bone', 1), ('rubber', 1), ('tape_grey', 2)
    B = Body(K.bpy)
    n = 40
    ctr = B.j('Skeleton_torso_joint_2')
    suit = torso_rings(B, 0.66, 1.1, 12, n=n, off=0.018)
    parts = [sheet_mesh(K, 'worn_ra_suit', SUIT, suit, thick=0.012, centre=ctr)]
    shell = torso_rings(B, 0.74, 1.1, 10, n=n, off=0.045, r_fn=lambda a, z: 0.012 * math.cos(a) ** 2)
    parts.append(sheet_mesh(K, 'worn_ra_chest', SHELL, [[r[i % n] for i in range(-9, 10)] for r in shell], closed=False, thick=0.014, centre=ctr))
    parts.append(sheet_mesh(K, 'worn_ra_back', SHELL, [[r[i] for i in range(11, 30)] for r in shell], closed=False, thick=0.014, centre=ctr))
    # the chest's ribs (moulded ridges) and the tape over a crack
    for k in range(4):
        r = shell[2 + 2 * k]; parts += K.tube('worn_ra_rib_%d' % k, SHELL, [r[i % n] + (r[i % n] - B.V((ctr.x, ctr.y, r[i % n].z))).normalized() * 0.016 for i in range(-6, 7)], 0.007, verts=6)
    p = shell[6][3]
    parts.append(K.box('worn_ra_tape', TAPE, (0.09, 0.012, 0.025), p + B.V((0, -0.02, 0)), rot=(0, math.radians(25), 0)))
    # groin flap
    g = torso_rings(B, 0.56, 0.7, 3, n=n, off=0.04)
    parts.append(sheet_mesh(K, 'worn_ra_groin', SHELL, [[r[i % n] for i in range(-5, 6)] for r in g], closed=False, thick=0.012, centre=ctr))
    # shoulder caps over each upper arm, forearm guards, straps
    for side in (1, -1):
        J = ARM_L if side > 0 else ARM_R
        cap = arm_rings(B, side, 0.0, 0.5, 4, n=16, off=0.035, r_add=lambda s: 0.03 * (1 - s / 0.5))
        parts.append(sheet_mesh(K, 'worn_ra_cap_%d' % (side > 0), SHELL, [[r[i] for i in range(4, 13)] for r in cap], closed=False, thick=0.012, centre=B.j(J[1])))
        fg = arm_rings(B, side, 1.12, 1.85, 4, n=16, off=0.03)
        parts.append(sheet_mesh(K, 'worn_ra_forearm_%d' % (side > 0), SHELL, [[r[i] for i in range(2, 11)] for r in fg], closed=False, thick=0.01, centre=B.j(J[2])))
        for s in (1.3, 1.7):
            parts.append(sheet_mesh(K, 'worn_ra_fstrap_%d_%d' % (side > 0, int(s * 10)), STRAP, arm_rings(B, side, s, s + 0.06, 1, n=16, off=0.034), thick=0.005))
    # knee and shin guards on each leg
    for side in (1, -1):
        L = 'L' if side > 0 else 'R'
        kn, an = B.j('leg_joint_%s_2' % L), B.j('leg_joint_%s_3' % L)
        bones = {'leg_joint_%s_1' % L, 'leg_joint_%s_2' % L}
        rows = []
        for k in range(6):
            t = -0.15 + 0.85 * k / 5; o = kn.lerp(an, t); ax = (an - kn).normalized()
            u = ax.cross(B.V((1, 0, 0))).normalized(); w = ax.cross(u).normalized()
            row = []
            for i in range(9):
                gang = math.radians(-70 + 140 * i / 8); d = (u * math.cos(gang) + w * math.sin(gang)).normalized()
                if d.y > 0: d = -d
                r = B.out(o, d, bones, 0.2, 0.06) or 0.06
                row.append(o + d * (r + 0.03 + (0.02 if k == 0 else 0)))
            rows.append(row)
        parts.append(sheet_mesh(K, 'worn_ra_shin_%d' % (side > 0), SHELL, rows, closed=False, thick=0.012, centre=kn))
    for o in parts:
        nm = o.name
        if '_cap_' in nm or '_forearm_' in nm or '_fstrap_' in nm:
            side = 1 if ('_cap_1' in nm or '_forearm_1' in nm or '_fstrap_1' in nm) else -1
            J = ARM_L if side > 0 else ARM_R
            skin(o, (lambda J: (lambda p: {J[0] if '_cap_' in nm else J[1]: 1.0}))(J))
        elif '_shin_' in nm:
            L = 'L' if nm.endswith('_1') else 'R'
            skin(o, lambda p, L=L: {'leg_joint_%s_2' % L: 1.0})
        else:
            skin(o, soft_w(B, set(TORSO_BONES) | {'leg_joint_L_1', 'leg_joint_R_1'}))


def fit(bpy, worn, body_meshes=None, margin=0.01, rigid_head=False):
    """fit worn meshes (already bound to a look's armature, in the rest pose) to that look (margin in model units).
    A HEAD PIECE is rigid: it is scaled as one about his head's centre until its inside clears every point of his head (and
    whatever his look wears on it) by the margin, larger or smaller than the thug's head it was built on, never bent.
    ANYTHING ELSE is cloth over him: every vertex inside his body or nearer than the margin is pushed out along his surface,
    and each vertex takes the largest push of its neighbours within 3 cm, so a padded layer moves as one and keeps its
    thickness (a bigger belly, a longcoat). Returns how many vertices moved."""
    import mathutils
    from mathutils.bvhtree import BVHTree
    from mathutils.kdtree import KDTree
    sc = bpy.context.scene
    body = body_meshes or [o for o in sc.objects if o.type == 'MESH' and o not in worn and not any(t in o.name for t in NOT_BODY)]
    P, F, H = [], [], []
    for o in body:
        off = len(P); M = o.matrix_world; names = {g.index: g.name for g in o.vertex_groups}
        for v in o.data.vertices:
            p = M @ v.co; P.append(p)
            if any(names.get(g.group) == HEAD_BONE and g.weight > 0.5 for g in v.groups): H.append(p)
        F += [[off + i for i in f.vertices] for f in o.data.polygons]
    if rigid_head and H:
        top = max(p.z for p in H); hi = [p for p in H if p.z > top - 0.2]
        C = mathutils.Vector(((min(p.x for p in hi) + max(p.x for p in hi)) / 2, (min(p.y for p in hi) + max(p.y for p in hi)) / 2, top - 0.18))
        WP, WF = [], []
        for o in worn:
            off = len(WP); WP += [o.matrix_world @ v.co for v in o.data.vertices]; WF += [[off + i for i in f.vertices] for f in o.data.polygons]
        wb = BVHTree.FromPolygons(WP, WF)
        need = []
        for p in H[::7]:
            d = p - C
            if d.length < 1e-4 or d.z < -0.06: continue          # the face and the jaw are under the rim, not inside the shell
            hit = wb.ray_cast(C, d.normalized(), 1.0)
            if hit[0] is not None: need.append((d.length + margin) / (hit[0] - C).length)
        k = max(0.9, max(need)) if need else 1.0
        S = mathutils.Matrix.Translation(C) @ mathutils.Matrix.Scale(k, 4) @ mathutils.Matrix.Translation(-C)
        for o in worn:
            Mi = o.matrix_world.inverted(); o.data.transform(Mi @ S @ o.matrix_world); o.data.update()
        return sum(len(o.data.vertices) for o in worn) if abs(k - 1) > 1e-3 else 0
    bvh = BVHTree.FromPolygons(P, F)
    moved = 0
    for o in worn:
        M = o.matrix_world; Mi = M.inverted()
        pts = [M @ v.co for v in o.data.vertices]
        push = []
        for p in pts:
            loc, n, _, dist = bvh.find_nearest(p)
            if loc is None: push.append(mathutils.Vector()); continue
            sd = (p - loc).dot(n)
            push.append(n * (margin - sd) if sd < margin else mathutils.Vector())
        kd = KDTree(len(pts))
        for i, p in enumerate(pts): kd.insert(p, i)
        kd.balance()
        for i, p in enumerate(pts):
            best = max((push[j] for (_, j, _) in kd.find_range(p, 0.03)), key=lambda v: v.length, default=push[i])
            if best.length > 1e-6:
                o.data.vertices[i].co = Mi @ (p + best); moved += 1
        o.data.update()
    return moved


def wear(bpy, name, arm=None, margin=0.01):
    """the renderer's one call for a worn thing: with a look already imported in the scene (his armature and his meshes), the
    model is imported, its meshes moved onto HIS armature (the same 19 bones, the same rest: the bind holds), the model's own
    armature dropped, and fit() run in the rest pose; returns the worn meshes, skinned and following his every pose"""
    sc = bpy.context.scene
    arm = arm or [o for o in sc.objects if o.type == 'ARMATURE'][0]
    pose_was = arm.data.pose_position; arm.data.pose_position = 'REST'; bpy.context.view_layer.update()
    before = set(o.name for o in sc.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(MODELS, glb_of(name)))
    new = [o for o in sc.objects if o.name not in before]
    meshes = [o for o in new if o.type == 'MESH' and not (o.name.startswith('Icosphere') and len(o.data.vertices) == 42)]
    for o in meshes:
        mw = o.matrix_world.copy()
        for md in [m for m in o.modifiers if m.type == 'ARMATURE']: o.modifiers.remove(md)
        o.parent = arm; o.matrix_world = mw
        md = o.modifiers.new('arm', 'ARMATURE'); md.object = arm
    for o in [o for o in new if o not in meshes]: bpy.data.objects.remove(o, do_unlink=True)
    bpy.context.view_layer.update()
    body = [o for o in sc.objects if o.type == 'MESH' and o not in meshes and not any(t in o.name for t in NOT_BODY)]
    print('FIT', name, 'moved', fit(bpy, meshes, body, margin, rigid_head=OBJECTS[name]['kind'] == 'worn_head'), 'of', sum(len(o.data.vertices) for o in meshes), flush=True)
    arm.data.pose_position = pose_was
    return meshes


# ------------------------------------------------------------------------------------------------ model (bpy): the glb
def load_man(bpy, path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=path)
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42: bpy.data.objects.remove(o, do_unlink=True)
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    arm.data.pose_position = 'REST'
    bpy.context.view_layer.update()
    return arm


def bind(bpy, parts, arm):
    """the worn meshes onto the armature: an Armature modifier and the armature as parent (their world place kept)"""
    bpy.context.view_layer.update()
    for o in parts:
        mw = o.matrix_world.copy()
        md = o.modifiers.new('arm', 'ARMATURE'); md.object = arm
        o.parent = arm; o.matrix_world = mw


def model(names):
    import bpy
    os.makedirs(OUT, exist_ok=True)
    for n in names:
        worn = OBJECTS[n]['kind'].startswith('worn')
        if worn:
            # built over the thug in his rest pose; the file keeps the skeleton and the worn meshes, never his body
            arm = load_man(bpy, MAN_SRC)
            parts = build(bpy, n)
            bind(bpy, parts, arm)
            for o in [o for o in bpy.context.scene.objects if o.type == 'MESH' and o not in parts]: bpy.data.objects.remove(o, do_unlink=True)
            if arm.animation_data:
                arm.animation_data.action = None
                for t in list(arm.animation_data.nla_tracks): arm.animation_data.nla_tracks.remove(t)
            for a in list(bpy.data.actions): bpy.data.actions.remove(a)
        else:
            bpy.ops.wm.read_factory_settings(use_empty=True)
            parts = build(bpy, n)
            root = bpy.data.objects.new('item_' + n, None); bpy.context.scene.collection.objects.link(root)
            for o in parts:
                mw = o.matrix_world.copy(); o.parent = root; o.matrix_parent_inverse = root.matrix_world.inverted(); o.matrix_world = mw
        out = os.path.join(MODELS, glb_of(n))
        bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False, export_animations=False)
        mats = sorted({(m['palette_role'], m['palette_step']) for o in parts for m in o.data.materials})
        lo, hi = bounds(parts)
        meas = dict(size_m=[round(v, 3) for v in (hi - lo)], lo=[round(v, 3) for v in lo], hi=[round(v, 3) for v in hi],
                    materials=['%s %d' % m for m in mats], verts=sum(len(o.data.vertices) for o in parts), parts=len(parts))
        if worn:
            meas['units'] = 'the model\'s own (the man about 1.5 tall; the master rig scales him to 1.72 m)'
            meas['bones'] = sorted({g.name for o in parts for g in o.vertex_groups})
        for k in ('elbow_z', 'grip_z', 'left_x'):
            if k in OBJECTS[n]: meas[k] = OBJECTS[n][k]
        json.dump(meas, open(os.path.join(OUT, 'measured_%s.json' % n), 'w'), indent=1)
        print('MODEL', n, out, json.dumps(meas), flush=True)


def bounds(objs):
    import mathutils
    lo = mathutils.Vector((1e9,) * 3); hi = -lo
    for o in objs:
        for v in o.data.vertices:
            p = o.matrix_world @ v.co
            lo = mathutils.Vector(map(min, lo, p)); hi = mathutils.Vector(map(max, hi, p))
    return lo, hi


# ------------------------------------------------------------------------------------------------ man (bpy): the check scene
def man(name):
    """the thing on the thug in his Stand still, exported as one glb for the master rig: a shield on his left forearm (the
    forearm's middle, its face out and forward), a weapon in his right fist (ANIMATION's rest hold), worn gear on his bones"""
    import bpy, mathutils
    V = mathutils.Vector
    arm = load_man(bpy, MAN)
    sc = bpy.context.scene
    body = [o for o in sc.objects if o.type == 'MESH']
    for o in [o for o in body if any(t in o.name for t in ('_pipe', '_machete', '_shield'))]: bpy.data.objects.remove(o, do_unlink=True)   # his own pipe out of his hand
    body = [o for o in sc.objects if o.type == 'MESH']
    hb = lambda n: arm.matrix_world @ arm.data.bones[n].head_local
    lo, hi = bounds(body); man_h = hi.z - lo.z; unit = man_h / 1.72          # model units per metre
    kind = OBJECTS[name]['kind']
    if kind.startswith('worn'):
        new = build(bpy, name)
        if '--fit' in sys.argv: print('FIT moved', fit(bpy, new, body), flush=True)
        bind(bpy, new, arm)
    else:
        before = set(o.name for o in sc.objects)
        bpy.ops.import_scene.gltf(filepath=os.path.join(MODELS, glb_of(name)))
        new = [o for o in sc.objects if o.name not in before]
        for o in [o for o in new if o.type == 'MESH' and o.name.startswith('Icosphere') and len(o.data.vertices) == 42]: new.remove(o); bpy.data.objects.remove(o, do_unlink=True)
        top = [o for o in new if o.parent is None]
        g = bpy.data.objects.new('placed', None); sc.collection.objects.link(g)
        for o in top: o.parent = g
        if kind == 'shield':
            E, Wr = hb('Skeleton_arm_joint_L__3_'), hb('Skeleton_arm_joint_L__2_')
            a = (Wr - E).normalized(); up = -a
            out = V((1, 0, 0)); out = (out - a * out.dot(a)).normalized()
            fwd = V((0, -1, 0)); fwd = (fwd - a * fwd.dot(a)).normalized()
            face = (out * math.cos(math.radians(50)) + fwd * math.sin(math.radians(50))).normalized()
            Y = up.cross(face).normalized(); Z = face.cross(Y).normalized()
            M = mathutils.Matrix((face, Y, Z)).transposed().to_4x4()
            g.matrix_world = mathutils.Matrix.Translation(E.lerp(Wr, 0.5) + face * 0.035 * unit) @ M @ mathutils.Matrix.Scale(unit, 4)
            bone = 'Skeleton_arm_joint_L__3_'
        else:
            E, Wr = hb('Skeleton_arm_joint_R__2_'), hb('Skeleton_arm_joint_R__3_')
            fore = (Wr - E).normalized(); fwd = V((0, -1, 0)); up = V((0, 0, 1)); left = V((1, 0, 0))
            bar = (fore * 0.45 + fwd * 0.7 + up * 0.35).normalized()
            zx = left.cross(bar).normalized(); yx = zx.cross(bar).normalized()
            M = mathutils.Matrix((bar, yx, zx)).transposed().to_4x4()
            g.matrix_world = mathutils.Matrix.Translation(Wr + fore * 0.055 * unit) @ M @ mathutils.Matrix.Scale(unit, 4)
            bone = 'Skeleton_arm_joint_R__3_'
        bpy.context.view_layer.update()
        meshes = [o for o in new if o.type == 'MESH']
        for o in meshes:
            mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
            bpy.context.view_layer.objects.active = o
            for x in sc.objects: x.select_set(x is o)
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
            vg = o.vertex_groups.new(name=bone); vg.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
        bind(bpy, meshes, arm)
        bpy.data.objects.remove(g, do_unlink=True)
        for o in [o for o in new if o.type == 'EMPTY' and o.name in sc.objects]: bpy.data.objects.remove(o, do_unlink=True)   # the item's own root only: never the importer's Z_UP that stands him up
        new = meshes
    arm.data.pose_position = 'POSE'
    lo2, hi2 = bounds([o for o in sc.objects if o.type == 'MESH'])
    os.makedirs(os.path.join(OUT, 'check'), exist_ok=True)
    out = os.path.join(OUT, 'check', '%s_on_man.glb' % name)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False, export_animations=True)
    json.dump(dict(man_h=man_h, total_h=hi2.z - lo2.z, real_height=round(1.72 * (hi2.z - lo2.z) / man_h, 4)), open(out[:-4] + '.json', 'w'))
    print('MAN', out, flush=True)


def render_man(name):
    """the master rig on the man with the thing (his Stand still, eight facings, real height 1.72), and on the thing alone"""
    d = os.path.join(OUT, 'check')
    if not os.path.exists(MAN):   # COMBAT's poses tool, unedited: the thug with Stand (his arms hanging) and the fight's clips
        subprocess.call([VENV, os.path.join(ROOT, 'tools/bohemia_combat_the_fight_poses.py'), MAN_SRC, MAN], cwd=ROOT)
    if not os.path.exists(os.path.join(d, '%s_on_man.glb' % name)) or '--again' in sys.argv:
        subprocess.call([VENV, os.path.abspath(__file__), '_man', name], cwd=ROOT)
    MR = os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')
    meas = json.load(open(os.path.join(OUT, 'measured_%s.json' % name)))
    rh = json.load(open(os.path.join(d, '%s_on_man.json' % name)))['real_height']   # the man stays 1.72 m with a long thing in his hand
    jobs = [([VENV, MR, os.path.join(d, '%s_on_man.glb' % name), os.path.join(d, 'man_' + name), '--real-height', str(rh), '--clip', 'Stand:1', '--family', 'none', '--judge', 'prop'], 'man_' + name)]
    sz = meas['size_m']
    if not OBJECTS[name]['kind'].startswith('worn'):
        jobs.append(([VENV, MR, os.path.join(MODELS, glb_of(name)), os.path.join(d, 'alone_' + name), '--real-height', str(sz[2]), '--family', 'prop', '--judge', 'prop'], 'alone_' + name))
    for cmd, tag in jobs:
        if os.path.exists(os.path.join(d, tag, 'rig.json')) and ('--again' not in sys.argv or tag.startswith('alone_')): continue
        if os.path.isdir(os.path.join(d, tag)): shutil.rmtree(os.path.join(d, tag))
        r = subprocess.run(cmd, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        print(tag, 'exit', r.returncode, r.stdout[-600:] if r.returncode else '', flush=True)


# ------------------------------------------------------------------------------------------------ sheet (plain python)
def sheet(names):
    """the compare: the thing alone in eight, the man with it in eight, over a crop of a real fight floor at 1:1 and x3,
    beside YOU's own fight-sheet stand cell (a man already in the game)"""
    from PIL import Image, ImageDraw
    FD = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
    floor = Image.open(os.path.join(ROOT, 'slices/fight_ground/block_subs_0.webp')).convert('RGBA')
    you = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))['looks']['you']
    ys = Image.open(os.path.join(ROOT, 'slices/fight_rig', you['file'])).convert('RGBA')
    cell = ys.crop((0, 0, you['w'], you['h']))
    for n in names:
        d = os.path.join(OUT, 'check')
        def stills(tag):
            out = []
            for f in FD:
                for fn in ('rig_Stand_%s_k00.png' % f, 'rig_%s.png' % f):
                    q = os.path.join(d, tag, fn)
                    if os.path.exists(q): out.append(Image.open(q).convert('RGBA')); break
                else: out.append(Image.new('RGBA', (8, 8)))
            return out
        man_s, alone_s = stills('man_' + n), stills('alone_' + n) if os.path.isdir(os.path.join(d, 'alone_' + n)) else []
        def trim(im):
            bb = im.getbbox() or (0, 0, 1, 1); return im.crop(bb)
        man_s = [trim(i) for i in man_s]; alone_s = [trim(i) for i in alone_s]; cellt = trim(cell)
        cw = max(max(i.width for i in man_s), cellt.width) + 10; ch = max(max(i.height for i in man_s), cellt.height) + 10
        aw = max([i.width for i in alone_s] or [0]) + 10; ah = max([i.height for i in alone_s] or [0]) + 10
        row1 = Image.new('RGBA', (cw * 9, ch)); row2 = Image.new('RGBA', (max(aw * 8, cw * 9), ah))
        fx, fy = 900, 700
        row1.paste(floor.crop((fx, fy, fx + row1.width, fy + ch)), (0, 0)); row2.paste(floor.crop((fx, fy + ch, fx + row2.width, fy + ch + ah)), (0, 0))
        row1.alpha_composite(cellt, (5 + (cw - 10 - cellt.width) // 2, ch - 5 - cellt.height))
        for k, im in enumerate(man_s): row1.alpha_composite(im, (cw * (k + 1) + 5 + (cw - 10 - im.width) // 2, ch - 5 - im.height))
        for k, im in enumerate(alone_s): row2.alpha_composite(im, (aw * k + 5 + (aw - 10 - im.width) // 2, ah - 5 - im.height))
        one = Image.new('RGBA', (max(row1.width, row2.width), row1.height + row2.height + 18), (24, 22, 20, 255))
        one.paste(row1, (0, 0)); one.paste(row2, (0, row1.height + 18))
        big = one.resize((one.width * 3, one.height * 3), Image.NEAREST)
        S = Image.new('RGBA', (big.width, one.height + big.height + 60), (24, 22, 20, 255))
        S.paste(one, (0, 30)); S.paste(big, (0, one.height + 60))
        dr = ImageDraw.Draw(S)
        dr.text((6, 8), '%s -- 1:1 at the fight\'s pixels: YOU (the game, first) then the thug carrying it in S SE E NE N NW W SW; below, the thing alone; then x3' % OBJECTS[n]['name'].upper(), fill=(230, 220, 200, 255))
        p = os.path.join(OUT, 'check_%s.webp' % n); S.convert('RGB').save(p, 'WEBP', quality=82, method=6)
        print('SHEET', p, S.size)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'list'
    args = [a for a in sys.argv[2:] if not a.startswith('--')]
    if args == ['all']: args = [n for n in OBJECTS if 'b_' + n in globals()]
    if cmd == 'list': do_list()
    elif cmd == 'model':
        model(args); os._exit(0)
    elif cmd == '_man':
        man(args[0]); os._exit(0)
    elif cmd == '_wear':   # the fit test: <look glb> <worn names...>, how many vertices fit() moved on another man
        import bpy
        load_man(bpy, os.path.join(ROOT, args[0]))
        for n in args[1:]:
            ms = wear(bpy, n); print('WEAR', n, 'on', args[0], 'meshes', len(ms), flush=True)
        os._exit(0)
    elif cmd == 'man':
        for n in args: render_man(n)
    elif cmd == 'sheet': sheet(args)
    else: sys.exit(__doc__)
