#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the PC playtest: the bodies' part], the next line (rule 164 item 31; Paolo 10/24 on his PC: 'more and
better animations when people hold things'; the coordinator's order 10/25: (1) melee weapons held right in the hand: the
club, the bat, the pipe, the knife, the poacher's hatchet; idle, walk, the swing, the hit taken; (2) the shield arm; (3)
anything else a man holds that still reads as the wrong pose). MELEE WEAPONS IN THE HAND.

MEASURED FIRST (10/25, 16 real fights, seeds 1 to 8, strip and road): of 360 men, 225 hold a melee weapon or a thrown one
(the bludgeon 50, the two-handed mallet 34, the woodcutter's axe 30, the goedendag 14, the shortsword 12, the wooden stick 12,
the hatchet 11, the pitchfork 10, the flails 21, the throwing axes 16, the cleaver 6, the pickaxe 12, the spears 10, the
morning star 4, the handaxe 2) and every one of them was drawn with EMPTY HANDS: the fight draws only guns (rule 120(a)),
and a man with a pipe stood, walked and swung bare-fisted.

THE WAY (the guns' way, COMBAT's tool): the thing is MODELLED (real metres, palette steps, the master rig's source pass) and
rendered IN HIS RIGHT FIST frame for frame with his body as a holdout, so it sits in his hand and goes behind him where he is
in front of it; laid over his body cell. His BODY is the held clips this lane already rendered for every man (the pistol's
one-hand low ready is the same right arm a club is carried in: PIdle, PCarryWalk, PHit, and on one knee CoverPistol,
CoverHit) and COMBAT's own Swing on his fight sheet (the club over the shoulder, the blow, the follow through); the only new
body keys are the melee idle's own (MIdleX: the club tapped into his left palm, the club laid on his shoulder), so no key is
rendered twice. Which key of which clip the fight plays is records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json
('composite'); how the prop sits on each key is its 'hold'.

THE STEPS (Blender's Python for pose/render; plain python3 for pack):
    <venv>/bin/python tools/bohemia_animation_melee_in_hand.py look LOOK      a named look: its posed model (COMBAT's
        `bodies`, then the held clips and these keys laid on it), the new body keys rendered (Stand first, so the frame is
        the look's own), then every prop of every layer in his hand on every key it is held on
    <venv>/bin/python tools/bohemia_animation_melee_in_hand.py person TAG     a rolled man: his own body's new keys (his
        gang's props are his, packed from his gang's cell, the way his guns are)
    <venv>/bin/python tools/bohemia_animation_melee_in_hand.py all [workers]  everyone the fight draws, YOU first
    <venv>/bin/python tools/bohemia_animation_melee_in_hand.py preview LOOK PROP [CLIPS]  the prop on his body, enlarged
    python3 tools/bohemia_animation_melee_in_hand.py pack
        slices/rig_melee/<look>.webp (the new body keys), <look>_props.webp (the props on every key), <look>.json and
        slices/rig_melee/rig_melee.json; COMBAT's fight plays them in ANIMATION's marked block __WHAT_A_MAN_HOLDS__.

REUSE CHECK: the bodies are COMBAT's posed men with last round's held clips (tools/bohemia_animation_what_a_man_holds.py's
pose, imported and called); the render frame is the master rig's (COMBAT's render(), imported); the prop render is COMBAT's
guns tool's way (the same camera, sun, holdout and stretch); the turned and lofted shapes are COOK's icons tool's lathe and
loft and the props modeller's helpers, imported; the hatchet is COOK THREE's poacher's hatchet's shape; the pipe its thug's.
REFERENCE CHECK (the 9/4 standing duty): the compare law: the twin of every held key is the same man's own fight sheet cell
and the market icon of the same thing (slices/market_icons), side by side at the fight's pixels (the record); analog horror
AH-01; Battle Brothers' one-handed weapon held at the side is the study (its sprites carry the weapon in the hand on every
pose, never a bare fist).
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json')
POSED = 'records/animation/hold'                  # the posed models (regenerated, .gitignore): the hold tool's, with these keys too
RENDERS = 'records/target/animation/melee'        # the renders (regenerated)
OUT = 'slices/rig_melee'
FIGHT_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']   # the master rig's turntable order (45 degrees a step from 180)
SPECK = 8         # fewer opaque pixels than this in a prop's picture: the thing is behind him and a sliver shows past his outline
FAT = 1.35        # a haft at its real girth is one pixel at 57 px a metre; a man's own fist is three: drawn 1.35 times as thick
sys.path.insert(0, os.path.join(ROOT, 'tools'))


def source():
    return json.load(open(SRC))


def hold_tool():
    import bohemia_animation_what_a_man_holds as H
    return H


def merged():
    """the held clips' source with these parts and clips beside them: one pose lays every clip on the man"""
    H = hold_tool(); D = H.source(); M = source()
    D = json.loads(json.dumps(D))
    D['parts'].update(M['parts']); D['clips'].update(M['clips'])
    return D


def GROUP(clip):
    """which of his own sheets a new key goes on: m the melee idle's, s the shield arm's, t the two-hander's"""
    return 'm' if clip.startswith('M') else 's' if clip.startswith('S') else 't'


def layer_clips(S, ly):
    """this lane's own body clips a layer's melee clips draw"""
    out = set()
    for n, ks in S['composite'].items():
        if n == 'why' or not all(s_ in S['layers'][ly]['clips'] for s_, _ in ks): continue
        out |= set(s_ for s_, _ in ks if s_ in S['clips'])
    return out


def new_clips(ready_only=True):
    """the new body clips; by default only those a ready layer draws (a layer still being made renders nothing yet)"""
    S = source(); ready = S.get('layers_ready', list(S['layers']))
    used = set(src for n, ks in S['composite'].items() if n != 'why' for src, _ in ks
               if any(all(s_ in S['layers'][ly]['clips'] for s_, _ in ks) for ly in ready))
    return [(n, len(c['keys'])) for n, c in S['clips'].items() if not ready_only or n in used]


# ------------------------------------------------------------------------------------------------ the props (bpy)
def build_prop(bpy, name):
    """the prop at its real size (hafts FAT times their girth), built along +Z from the fist (z = 0 the middle of his
    grip), its edge or striking face toward +X; returned under one empty, turned so the haft is the empty's +X and the
    edge its +Z (the frame place() puts in his fist)"""
    import mathutils
    import bohemia_cook_model_props as P
    import bohemia_cook_the_icons_through_the_rig_10_20_26 as CI
    sc = bpy.context.scene
    before = set(o.name for o in sc.objects)
    S = source()['props'][name]; back, fore = S.get('back', 0), S.get('fore', 0)
    cook = cook_model(name)
    if cook:   # COOK's item model (rule 177(c)), built in this tool's frame: imported untouched, nothing turned
        bpy.ops.import_scene.gltf(filepath=cook)
        for o in [o for o in sc.objects if o.name not in before and o.type == 'MESH' and o.name.startswith('Icosphere') and len(o.data.vertices) == 42]:
            bpy.data.objects.remove(o, do_unlink=True)
        top = [o for o in sc.objects if o.name not in before and o.parent is None]
        root = bpy.data.objects.new('prop_' + name, None); sc.collection.objects.link(root)
        for o in top: o.parent = root
        return root, [o for o in sc.objects if o.name not in before and o.type == 'MESH']
    m = lambda n, role, step: P.mat(bpy, '%s_%s' % (name, n), role, step)
    tape = m('tape', 'rubber', 2)
    if name == 'pipe':   # the thug's pipe (COOK THREE: clay_rust 2, r 2.2 cm, a coupling near each end)
        r = 0.022 * FAT / 1.2; rust = m('pipe', 'clay_rust', 2)
        CI.lathe(bpy, 'pipe', rust, [(0, -back), (r, -back), (r, fore), (0, fore)], n=12)
        for z in (fore - 0.035, -back + 0.02):
            CI.lathe(bpy, 'coupling_%d' % int(z * 100), m('coupling', 'clay_rust', 1), [(0, z - 0.018), (r * 1.45, z - 0.018), (r * 1.45, z + 0.018), (0, z + 0.018)], n=12)
        CI.lathe(bpy, 'grip', tape, [(0, -0.05), (r * 1.12, -0.05), (r * 1.12, 0.08), (0, 0.08)], n=12)
    elif name == 'club':   # a table leg: turned square-ish (eight faces), thicker toward the far end, the grip taped
        wood = m('club', 'clay_mustard', 1)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'club', wood, [(0, -back), (rr(0.017), -back), (rr(0.015), 0.1), (rr(0.019), 0.2), (rr(0.026), 0.38), (rr(0.028), fore - 0.03), (rr(0.022), fore), (0, fore)], n=8, smooth=False)
        CI.lathe(bpy, 'grip', tape, [(0, -0.045), (rr(0.0175), -0.045), (rr(0.0175), 0.09), (0, 0.09)], n=8, smooth=False)
    elif name == 'bat':   # an ash bat, the knob, the handle, the barrel, nails through the barrel
        ash = m('bat', 'clay_bone', 2); steel = m('nail', 'tape_grey', 2)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'bat', ash, [(0, -back), (rr(0.022), -back), (rr(0.022), -back + 0.012), (rr(0.0125), -back + 0.03), (rr(0.0135), 0.22), (rr(0.022), 0.4),
                                   (rr(0.031), 0.55), (rr(0.033), fore - 0.06), (rr(0.03), fore - 0.01), (0, fore)], n=16)
        CI.lathe(bpy, 'grip', tape, [(0, -back + 0.03), (rr(0.0145), -back + 0.03), (rr(0.0145), 0.13), (0, 0.13)], n=12)
        for k in range(10):   # nails, all the way through, their points out on every side of the barrel
            z = 0.5 + 0.022 * k; a = k * 2.4 + 0.3
            d = mathutils.Vector((math.cos(a), math.sin(a), 0.0))
            P.rod(bpy, 'nail_%d' % k, steel, tuple(d * rr(0.025) + mathutils.Vector((0, 0, z))), tuple(d * (rr(0.033) + 0.035) + mathutils.Vector((0, 0, z + 0.01))), 0.0045, 6)
    elif name == 'cleaver':   # a wooden grip, a deep square blade on the edge side, the edge ground bright
        wood = m('grip', 'clay_mustard', 1); steel = m('blade', 'tape_grey', 2); edge = m('edge', 'chrome', 1)
        CI.lathe(bpy, 'grip', wood, [(0, -back), (0.016, -back), (0.017, 0.07), (0.013, 0.085), (0, 0.085)], n=10)
        CI.loft(bpy, 'blade', steel, [(0.085, -0.025, 0.07, 0.006, 0.004), (0.14, -0.025, 0.08, 0.006, 0.003), (fore, -0.022, 0.085, 0.005, 0.003)], axis='z')
        CI.loft(bpy, 'edge', edge, [(0.085, 0.07, 0.082, 0.004, 0.0015), (fore, 0.085, 0.097, 0.003, 0.001)], axis='z')
    elif name == 'machete':   # a black grip, the blade's spine in line with it, a belly toward the tip, a rust patch
        grip = m('grip', 'rubber', 1); steel = m('blade', 'tape_grey', 2); edge = m('edge', 'chrome', 1); rust = m('rust', 'clay_rust', 1)
        CI.lathe(bpy, 'grip', grip, [(0, -back), (0.017, -back), (0.016, 0.1), (0.02, 0.105), (0, 0.11)], n=10)
        CI.loft(bpy, 'blade', steel, [(0.11, -0.012, 0.03, 0.004, 0.002), (0.35, -0.012, 0.042, 0.004, 0.002), (fore - 0.08, -0.01, 0.05, 0.003, 0.0015), (fore, -0.01, -0.004, 0.002, 0.001)], axis='z')
        CI.loft(bpy, 'edge', edge, [(0.11, 0.03, 0.038, 0.002, 0.001), (0.35, 0.042, 0.05, 0.002, 0.001), (fore - 0.08, 0.05, 0.058, 0.0015, 0.0008), (fore, -0.004, 0.0, 0.001, 0.0005)], axis='z')
        CI.loft(bpy, 'rust', rust, [(0.24, -0.008, 0.03, 0.0045, 0.0025), (0.32, -0.008, 0.034, 0.0045, 0.0025)], axis='z')
    elif name == 'hatchet':   # the poacher's hatchet (COOK THREE): a short haft, a bearded wedge head, its edge ground bright
        wood = m('haft', 'clay_mustard', 1); iron = m('head', 'metal_painted', 1); edge = m('edge', 'chrome', 1)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'haft', wood, [(0, -back), (rr(0.019), -back), (rr(0.016), 0.0), (rr(0.014), 0.2), (rr(0.016), fore), (0, fore + 0.005)], n=10)
        CI.lathe(bpy, 'grip', tape, [(0, -0.04), (rr(0.0175), -0.04), (rr(0.0175), 0.08), (0, 0.08)], n=10)
        CI.loft(bpy, 'head', iron, [(fore - 0.075, -0.03, 0.035, 0.02, 0.016), (fore - 0.06, -0.035, 0.07, 0.022, 0.01), (fore + 0.0, -0.035, 0.1, 0.022, 0.006), (fore + 0.025, -0.03, 0.115, 0.018, 0.004)], axis='z')
        CI.loft(bpy, 'edge', edge, [(fore - 0.07, 0.1, 0.112, 0.006, 0.0015), (fore + 0.03, 0.115, 0.125, 0.004, 0.001)], axis='z')
    elif name == 'rebar_spear':   # a sign post's pipe, a leaf of spring steel lashed on with wire, a rag under it (COOK's market spear, at its real girth)
        post = m('shaft', 'metal_painted', 2); iron = m('blade', 'metal_painted', 1); edge = m('edge', 'chrome', 1); rag = m('rag', 'clay_rust', 2); steel = m('wire', 'tape_grey', 2)
        r = 0.017 * FAT; b0 = fore - 0.3
        CI.lathe(bpy, 'shaft', post, [(0, -back), (r, -back), (r, b0 + 0.04), (0, b0 + 0.04)], n=10)
        CI.lathe(bpy, 'grip', tape, [(0, -0.12), (r * 1.15, -0.12), (r * 1.15, 0.12), (0, 0.12)], n=10)
        CI.loft(bpy, 'blade', iron, [(b0, -0.016, 0.016, 0.011, 0.011), (b0 + 0.08, -0.04, 0.04, 0.009, 0.009), (b0 + 0.2, -0.03, 0.03, 0.006, 0.006), (fore, -0.002, 0.002, 0.002, 0.002)], axis='z')
        CI.loft(bpy, 'edge_a', edge, [(b0 + 0.08, 0.04, 0.05, 0.004, 0.0015), (b0 + 0.2, 0.03, 0.038, 0.003, 0.001), (fore, 0.0, 0.004, 0.0015, 0.0008)], axis='z')
        CI.loft(bpy, 'edge_b', edge, [(b0 + 0.08, -0.05, -0.04, 0.0015, 0.004), (b0 + 0.2, -0.038, -0.03, 0.001, 0.003), (fore, -0.004, 0.0, 0.0008, 0.0015)], axis='z')
        for k in range(5): CI.lathe(bpy, 'wire_%d' % k, steel, [(0, b0 - 0.01 + k * 0.018), (r * 1.3, b0 - 0.01 + k * 0.018), (r * 1.3, b0 + 0.002 + k * 0.018), (0, b0 + 0.002 + k * 0.018)], n=10)
        CI.loft(bpy, 'rag', rag, [(b0 - 0.02, 0.012, 0.07, 0.01, 0.007), (b0 - 0.1, 0.02, 0.09, 0.009, 0.005), (b0 - 0.2, 0.04, 0.09, 0.007, 0.004)], axis='z')
    elif name == 'chain':   # a turned handle and a capped head; the chain and the spiked ball are their own piece (they hang)
        wood = m('handle', 'clay_mustard', 1); steel = m('chain', 'tape_grey', 2); ball = m('ball', 'clay_rust', 1)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'handle', wood, [(0, -back), (rr(0.02), -back), (rr(0.017), 0.05), (rr(0.019), fore - 0.04), (rr(0.024), fore), (0, fore)], n=12)
        CI.lathe(bpy, 'grip', tape, [(0, -0.045), (rr(0.019), -0.045), (rr(0.019), 0.09), (0, 0.09)], n=12)
        CI.lathe(bpy, 'cap', steel, [(0, fore - 0.01), (rr(0.027), fore - 0.01), (rr(0.027), fore + 0.025), (0, fore + 0.025)], n=12)
    elif name == 'pick':   # a short haft; at its end a curved spike toward the edge side and a chisel the other way
        wood = m('haft', 'clay_mustard', 1); iron = m('head', 'metal_painted', 1); edge = m('edge', 'chrome', 1)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'haft', wood, [(0, -back), (rr(0.019), -back), (rr(0.016), 0.0), (rr(0.015), 0.3), (rr(0.018), fore + 0.02), (0, fore + 0.025)], n=10)
        CI.lathe(bpy, 'grip', tape, [(0, -0.04), (rr(0.0175), -0.04), (rr(0.0175), 0.08), (0, 0.08)], n=10)
        CI.loft(bpy, 'spike', iron, [(0.0, fore - 0.025, fore + 0.025, 0.018, 0.018), (0.12, fore - 0.012, fore + 0.022, 0.012, 0.012), (0.22, fore - 0.05, fore - 0.035, 0.004, 0.004)], axis='x')
        CI.loft(bpy, 'chisel', iron, [(0.0, fore - 0.025, fore + 0.025, 0.018, 0.018), (-0.1, fore - 0.022, fore + 0.022, 0.01, 0.01), (-0.15, fore - 0.03, fore + 0.03, 0.003, 0.003)], axis='x')
        CI.loft(bpy, 'point', edge, [(0.2, fore - 0.048, fore - 0.036, 0.005, 0.005), (0.23, fore - 0.055, fore - 0.045, 0.002, 0.002)], axis='x')
    elif name == 'bottles':   # COOK's Molotov (its own builder, at its real size), the fist round the middle of it
        CI.build('w_bottles', bpy, P)
        for o in [o for o in sc.objects if o.name not in before]: o.location.z -= 0.12
    elif name == 'sledge':   # a long taped haft, a steel head across its end with bright faces (COOK's market sledge at real size)
        wood = m('haft', 'clay_mustard', 1); iron = m('head', 'metal_painted', 1); face = m('face', 'chrome', 1)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'haft', wood, [(0, -back), (rr(0.022), -back), (rr(0.019), 0.1), (rr(0.017), 0.5), (rr(0.02), fore), (0, fore + 0.01)], n=12)
        CI.lathe(bpy, 'grip', tape, [(0, -back + 0.01), (rr(0.021), -back + 0.01), (rr(0.021), 0.2), (0, 0.2)], n=12)
        P.box(bpy, 'head', iron, (0.32, 0.13, 0.13), (0.0, 0, fore - 0.03), bevel=0.02)
        for s_ in (-1, 1): P.box(bpy, 'face_%d' % s_, face, (0.02, 0.115, 0.115), (s_ * 0.165, 0, fore - 0.03), bevel=0.01)
    elif name == 'fire_axe':   # a long haft, a bearded felling head, the bit ground bright
        wood = m('haft', 'clay_mustard', 1); iron = m('head', 'metal_painted', 1); edge = m('edge', 'chrome', 1)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'haft', wood, [(0, -back), (rr(0.022), -back), (rr(0.018), 0.1), (rr(0.016), 0.55), (rr(0.019), fore + 0.02), (0, fore + 0.03)], n=12)
        CI.lathe(bpy, 'grip', tape, [(0, -back + 0.01), (rr(0.02), -back + 0.01), (rr(0.02), 0.16), (0, 0.16)], n=12)
        CI.loft(bpy, 'head', iron, [(-0.06, fore - 0.05, fore + 0.03, 0.024, 0.024), (0.02, fore - 0.05, fore + 0.03, 0.022, 0.022), (0.12, fore - 0.1, fore + 0.04, 0.01, 0.01), (0.17, fore - 0.13, fore + 0.05, 0.004, 0.004)], axis='x')
        CI.loft(bpy, 'bit', edge, [(0.17, fore - 0.13, fore + 0.05, 0.004, 0.004), (0.195, fore - 0.14, fore + 0.055, 0.0015, 0.0015)], axis='x')
    elif name == 'goedendag':   # a fence post turned club: thicker to its end, two iron bands, a rail spike driven out of the end
        wood = m('post', 'clay_mustard', 1); iron = m('band', 'metal_painted', 1); spike = m('spike', 'clay_rust', 1)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'post', wood, [(0, -back), (rr(0.02), -back), (rr(0.018), 0.15), (rr(0.026), 0.5), (rr(0.036), fore - 0.05), (rr(0.034), fore), (0, fore)], n=8, smooth=False)
        CI.lathe(bpy, 'grip', tape, [(0, -back + 0.01), (rr(0.021), -back + 0.01), (rr(0.021), 0.25), (0, 0.25)], n=8, smooth=False)
        for z in (fore - 0.17, fore - 0.05): CI.lathe(bpy, 'band_%d' % int(z * 100), iron, [(0, z), (rr(0.039), z), (rr(0.039), z + 0.03), (0, z + 0.03)], n=8, smooth=False)
        bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.013, depth=0.14, location=(0, 0, fore + 0.06)); P.put(bpy, bpy.context.active_object, 'spike', spike, smooth=False)
    elif name == 'pole_hook':   # a long haft, a crossbar and three rusted tines
        wood = m('haft', 'clay_mustard', 1); steel = m('fork', 'clay_rust', 1)
        rr = lambda x: x * FAT
        CI.lathe(bpy, 'haft', wood, [(0, -back), (rr(0.018), -back), (rr(0.016), 0.6), (rr(0.017), fore - 0.05), (0, fore - 0.04)], n=10)
        P.rod(bpy, 'socket', steel, (0, 0, fore - 0.1), (0, 0, fore - 0.02), rr(0.02), 10)
        P.rod(bpy, 'bar', steel, (-0.11, 0, fore - 0.02), (0.11, 0, fore - 0.02), rr(0.008), 8)
        for x_ in (-0.1, 0.0, 0.1):
            P.rod(bpy, 'tine_%d' % int(x_ * 100), steel, (x_, 0, fore - 0.02), (x_ * 0.95, 0, fore + 0.26), rr(0.0065), 6)
    elif name == 'pistol':   # COOK's pistol, untouched (the barrel along +X, the grip at the origin, as COMBAT's guns tool reads it)
        bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % S['model']))
        for o in [o for o in sc.objects if o.name not in before and o.type == 'MESH' and o.name.startswith('Icosphere') and len(o.data.vertices) == 42]:
            bpy.data.objects.remove(o, do_unlink=True)
        top = [o for o in sc.objects if o.name not in before and o.parent is None]
        root = bpy.data.objects.new('prop_' + name, None); sc.collection.objects.link(root)
        for o in top: o.parent = root
        return root, [o for o in sc.objects if o.name not in before and o.type == 'MESH']
    elif S.get('shield'):
        return build_shield(bpy, name, S, before)
    else:
        raise KeyError(name)
    parts = [o for o in sc.objects if o.name not in before and o.type == 'MESH']
    root = bpy.data.objects.new('prop_' + name, None); sc.collection.objects.link(root)
    for o in parts: o.parent = root
    if name == 'chain' and 'chain' in S:   # the stand-in's chain and ball: their own piece, hung from the handle's end along +Z of its own empty (put() swings it)
        b4 = set(o.name for o in sc.objects)
        steel = m('chain', 'tape_grey', 2); ball = m('ball', 'clay_rust', 1); L_ = S['chain']; n_ = 6
        for k in range(n_):
            z0 = L_ * (k + 0.5) / n_
            CI.link(bpy, 'link_%d' % k, steel, (0, 0, z0), (0, 0, 1), k % 2, major=0.022, minor=0.007)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=14, ring_count=8, radius=0.055, location=(0, 0, L_ + 0.05)); P.put(bpy, bpy.context.active_object, 'ball', ball)
        import random
        rnd = random.Random(7)
        for k in range(10):
            th, ph = rnd.uniform(0, 2 * math.pi), math.acos(rnd.uniform(-0.9, 0.9)); dd = mathutils.Vector((math.sin(ph) * math.cos(th), math.sin(ph) * math.sin(th), math.cos(ph)))
            bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.013, depth=0.045, location=tuple(mathutils.Vector((0, 0, L_ + 0.05)) + dd * 0.07))
            o_ = bpy.context.active_object; o_.rotation_mode = 'QUATERNION'; o_.rotation_quaternion = mathutils.Vector((0, 0, 1)).rotation_difference(dd); P.put(bpy, o_, 'spike_%d' % k, steel, smooth=False)
        cparts = [o for o in sc.objects if o.name not in b4 and o.type == 'MESH']
        chain = bpy.data.objects.new('chain_' + name, None); sc.collection.objects.link(chain)
        for o in cparts: o.parent = chain
        root['chain'] = chain.name; parts = parts + cparts
    # the built frame (haft +Z, edge +X) turned into the placed frame (haft +X, edge +Z): a fixed basis change on the children
    B = mathutils.Matrix(((0, 0, 1), (0, -1, 0), (1, 0, 0))).to_4x4()   # (x, y, z) built -> (z, -y, x): haft z to x, edge x to z, right-handed
    for o in parts:
        if o.parent is root: o.matrix_parent_inverse = B
    return root, parts


def cook_model(name):
    """COOK's model of this thing, when it is in the folder (records/target/cook_every_item): its path, else None"""
    if name == 'pistol': return None   # COOK's gun, imported by its own name
    C = source().get('cook_models', {}); fn = os.path.join(ROOT, C.get('dir', 'reference/models/bohemia'), C.get('pattern', 'item_%s.glb') % name)
    return fn if os.path.exists(fn) else None


def model_sig(name):
    """what this thing is rendered from: COOK's model by its bytes, or this tool's stand-in"""
    import hashlib
    fn = cook_model(name)
    return ('cook:' + hashlib.sha1(open(fn, 'rb').read()).hexdigest()[:12]) if fn else 'stand-in'


def shield_dims(name):
    """(half its height below the forearm's middle, its width) in metres: COOK's measured box, else the stand-in's"""
    m = os.path.join(ROOT, 'records/target/cook_every_item/measured_%s.json' % name)
    if cook_model(name) and os.path.exists(m):
        M = json.load(open(m)); return -M['lo'][2], M['size_m'][1]
    S = source()['props'][name]; return S['h'] / 2, S['w']


def build_shield(bpy, name, S, before):
    """a shield in its placed frame: its face out along +X (the side a blow lands on), its width along +Y, up +Z; the side
    against his forearm at x = 0, its middle on the forearm's middle"""
    import mathutils
    import bohemia_cook_model_props as P
    sc = bpy.context.scene
    m = lambda n, role, step: P.mat(bpy, '%s_%s' % (name, n), role, step)
    w, h = S['w'], S['h']
    if name == 'car_door':
        # the door skin cut off at the window line: the faded paint, the crease, the handle, the window channel's stubs,
        # rust along the bottom seam, a dent's bullet holes; the inside bare steel with a strap across it
        paint = m('paint', 'clay_teal', 2); crease = m('crease', 'clay_teal', 3); rust = m('rust', 'clay_rust', 1)
        steel = m('inside', 'tape_grey', 1); chrome = m('handle', 'chrome', 1); hole = m('hole', 'rubber', 0); seal = m('seal', 'rubber', 1)
        P.box(bpy, 'skin', paint, (0.035, w, h), (0.045, 0, 0), bevel=0.012)
        P.box(bpy, 'inside', steel, (0.03, w - 0.06, h - 0.06), (0.012, 0, -0.01))
        P.box(bpy, 'crease', crease, (0.008, w - 0.04, 0.03), (0.066, 0, h * 0.18))
        P.box(bpy, 'seam_rust', rust, (0.008, w - 0.02, 0.07), (0.064, 0, -h / 2 + 0.05))
        P.box(bpy, 'rust_patch', rust, (0.008, 0.16, 0.12), (0.065, -w * 0.28, -h * 0.12))
        P.box(bpy, 'handle', chrome, (0.02, 0.13, 0.03), (0.07, w * 0.3, h * 0.3), bevel=0.006)
        P.box(bpy, 'seal', seal, (0.03, w - 0.03, 0.02), (0.045, 0, h / 2 + 0.005))
        for s_ in (-1, 1): P.box(bpy, 'stub_%d' % s_, paint, (0.03, 0.035, 0.13), (0.045, s_ * (w / 2 - 0.05), h / 2 + 0.06))
        for k, (y_, z_) in enumerate(((-0.12, 0.05), (-0.06, -0.08), (0.1, 0.12), (0.2, -0.03))):
            P.cyl(bpy, 'hole_%d' % k, hole, 0.011, 0.012, (0.066, y_, z_), (0, math.radians(90), 0), verts=8)
        P.box(bpy, 'strap', seal, (0.02, 0.05, h * 0.7), (-0.01, -0.06, 0))
    elif name == 'crash_bar':
        # CHARACTER's crash bar (tools/bohemia_character_the_three_enemies.py 'crashbar'): a rounded rectangle of 3.6 cm tube,
        # two uprights and a crossbar, the bent push bar standing off it, a diamond-plate panel behind, a dead plate riveted on
        steel = m('frame', 'metal_painted', 1); dk = m('panel', 'metal_painted', 0); rust = m('rust', 'clay_rust', 1); plate = m('plate', 'clay_bone', 3)
        H, W, rr = h / 2, w / 2, 0.05
        pts = []
        for cu, cw, a0 in ((H - rr, W - rr, 0), (-(H - rr), W - rr, 90), (-(H - rr), -(W - rr), 180), (H - rr, -(W - rr), 270)):
            for s_ in range(5):
                a_ = math.radians(a0 + 22.5 * s_); pts.append((0.06, cw + rr * math.sin(a_), cu + rr * math.cos(a_)))
        pts.append(pts[0])
        for k in range(len(pts) - 1): P.rod(bpy, 'frame_%d' % k, steel, pts[k], pts[k + 1], 0.018, 10)
        for y_ in (-0.09, 0.09): P.rod(bpy, 'upright_%d' % int(y_ * 100), steel, (0.06, y_, H - 0.01), (0.06, y_, -(H - 0.01)), 0.014, 10)
        P.rod(bpy, 'cross', steel, (0.06, -(W - 0.01), 0.10), (0.06, W - 0.01, 0.10), 0.014, 10)
        pb = [(0.06, -W + 0.05, -H + 0.02), (0.12, -W + 0.08, -H + 0.06), (0.12, W - 0.08, -H + 0.06), (0.06, W - 0.05, -H + 0.02)]
        for k in range(3): P.rod(bpy, 'push_%d' % k, steel, pb[k], pb[k + 1], 0.016, 10)
        P.box(bpy, 'panel', dk, (0.012, w - 0.06, h - 0.1), (0.04, 0, -0.05))
        for z_ in (H - 0.08, -H + 0.12): P.box(bpy, 'rust_%d' % int(z_ * 100), rust, (0.006, w - 0.08, 0.05), (0.048, 0, z_))
        P.box(bpy, 'plate', plate, (0.008, 0.21, 0.11), (0.05, 0, -0.13))
        P.box(bpy, 'strap', m('strap', 'rubber', 1), (0.02, 0.05, h * 0.6), (0.0, 0, 0))
    elif name == 'sign':
        # the stop sign's face off its post (reference/models/bohemia/stop_sign.glb, untouched): the octagon, its border,
        # the letters and the shot holes, turned to face out and stood so its letters run level
        bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'reference/models/bohemia/stop_sign.glb'))
        new = [o for o in sc.objects if o.name not in before]
        keep = lambda nm: nm.startswith(('octagon', 'letter_', 'shot_'))   # the face only: never the post, its foot, the bent bracket or the street-name blades
        for o in [o for o in new if o.type == 'MESH' and not keep(o.name.split('.')[0])]:
            new.remove(o); bpy.data.objects.remove(o, do_unlink=True)
        bpy.context.view_layer.update()
        mesh = {o.name.split('.')[0]: o for o in new if o.type == 'MESH'}
        oc = mesh['octagon']; M = oc.matrix_world
        n = (M.to_3x3() @ max(oc.data.polygons, key=lambda f: f.area).normal).normalized()
        c = sum((M @ v.co for v in oc.data.vertices), mathutils.Vector()) / len(oc.data.vertices)
        if (sum((mesh['letter_3'].matrix_world @ v.co for v in mesh['letter_3'].data.vertices), mathutils.Vector()) / len(mesh['letter_3'].data.vertices) - c).dot(n) < 0: n = -n   # the letters' side is the face
        cen = lambda o: o.matrix_world @ (sum((v.co for v in o.data.vertices), mathutils.Vector()) / len(o.data.vertices))
        row = cen(mesh['letter_4']) - cen(mesh['letter_2']); row = (row - n * row.dot(n)).normalized()
        R = mathutils.Matrix((n, row, n.cross(row))).to_4x4()   # rows: the face to +X, the letters' row to +Y, the up to +Z
        k = (w / 0.76)
        for o in [o for o in new if o.type == 'MESH']:
            o.parent = None; o.matrix_world = mathutils.Matrix.Scale(k, 4) @ R @ mathutils.Matrix.Translation(-c) @ o.matrix_world
            o.matrix_world = mathutils.Matrix.Translation((0.03, 0, 0)) @ o.matrix_world
        for o in [o for o in new if o.type != 'MESH']: bpy.data.objects.remove(o, do_unlink=True)
        P.box(bpy, 'strap', m('strap', 'rubber', 1), (0.02, 0.05, 0.4), (0.0, 0, 0))
    parts = [o for o in sc.objects if o.name not in before and o.type == 'MESH']
    root = bpy.data.objects.new('prop_' + name, None); sc.collection.objects.link(root)
    for o in parts:
        mw = o.matrix_world.copy(); o.parent = root; o.matrix_parent_inverse = mathutils.Matrix(); o.matrix_world = mw
    return root, parts


# ------------------------------------------------------------------------------------------------ the posed man (bpy, via the hold tool)
def pose(src, out):
    H = hold_tool(); D = merged()
    H.source = lambda: D
    H.pose(src, out)


# ------------------------------------------------------------------------------------------------ render the props (bpy)
def place_fn(mathutils):
    def place(hold, rw, lw, re, fwd, up, left, length=0.5):
        """where the prop sits in his right fist on this key, in the unstretched world: (the middle of his grip, the haft's
        line); the edge goes the way the blow goes (left x haft: up when the haft is forward, forward when it is up)"""
        fore = rw - re; fore = fore.normalized() if fore.length > 1e-4 else -up
        fist = rw + fore * 0.055
        if hold == 'rest':                     # along his forearm at the one-hand low ready, the head up and forward
            bar = fore * 0.45 + fwd * 0.7 + up * 0.35
        elif hold in ('tap', 'tap_lift'):       # across him to his left palm, or lifted a hand off it
            bar = lw - fist
            if bar.length < 1e-4: bar = left
            bar = bar.normalized()
            if hold == 'tap_lift': bar = bar + up * 0.5
        elif hold == 'shoulder_half':          # on its way up to the shoulder
            bar = up * 0.8 + fwd * 0.25 - left * 0.1
        elif hold == 'shoulder':               # laid back over the right shoulder
            bar = up * 0.6 - fwd * 0.75 - left * 0.15
        elif hold == 'shoulder_up':            # a short blade held up beside his head, out to his right
            bar = up * 0.85 + fwd * 0.2 - left * 0.45
        elif hold == 'wind':                   # cocked back behind his head
            bar = fore * 0.4 + up * 0.5 - fwd * 0.6
        elif hold in ('blow', 'follow'):       # in line with the forearm: the blow lands
            bar = fore + fwd * 0.15
        elif hold == 'hit':                    # kept in the fist as the blow rocks him
            bar = fore * 0.7 + fwd * 0.45
        elif hold == 'port':                   # up before his chest, on one knee
            bar = up * 0.85 + fwd * 0.45
        elif hold == 'upright':                # a spear stood up in his fist, its butt toward the ground
            bar = up * 0.9 + fwd * 0.25 - left * 0.08
        elif hold == 'thrust':                 # out along his straight arm, level (the spear's thrust)
            bar = fore.copy() if fore.dot(fwd) > 0.3 else fwd.copy(); bar.z *= 0.3
        elif hold in ('two', 'two_up', 'lean', 'lean_half'):   # both hands on the haft
            if hold == 'two':                  # the long gun's low ready: the rear hand his right, the haft out through his left
                bar = lw - fist
                if bar.length < 1e-4 or bar.normalized().dot(fwd) < 0.2: bar = fwd - up * 0.2
            elif hold == 'two_up':             # the two-handed blow: his left hand at the haft's end, the haft up through his right
                fist = lw + (lw - rw).normalized() * 0.05; bar = rw - lw
            else:                              # the lean: both hands on the haft's end, its head set down on the ground before him
                fist = (rw + lw) / 2; h_ = max(0.05, fist.z)
                if hold == 'lean_half': bar = fwd * 0.6 - up * 0.8
                else:
                    reach = math.sqrt(max(0.0, length * length - h_ * h_)); bar = fwd * reach - up * h_ if length > h_ else -up
        elif hold == 'bottle':                 # a bottle stood upright in his fist
            bar = up * 0.9 + fwd * 0.2
        elif hold == 'bottle_up':
            bar = up * 0.95 + fwd * 0.1
        elif hold == 'bottle_wind':            # cocked back over his shoulder to throw
            bar = up * 0.5 - fwd * 0.7
        elif hold == 'bottle_blow':            # flung forward
            bar = fwd * 0.8 + up * 0.45
        else:
            raise KeyError(hold)
        return fist, bar.normalized()
    return place


def place_pistol(hold, rw, lw, re, fwd, up, left):
    """COOK's pistol in his right hand, the way the held clips hold it (tools/bohemia_animation_what_a_man_holds.py PLACE):
    the grip at the wrist; low, the muzzle forward and down; out at the eye, along the arm and level; up at the chest on
    the knee, the muzzle up; rocked, COMBAT's blow"""
    fore = rw - re; fore = fore.normalized() if fore.length > 1e-4 else -up
    if hold == 'rest': bar = fwd * 0.75 + fore * 0.35 - up * 0.55
    elif hold == 'aim':
        bar = fore if fore.dot(fwd) > 0.3 else fwd; bar = bar.copy(); bar.z *= 0.3
    elif hold == 'port': bar = up * 0.85 + fwd * 0.45
    elif hold in ('hit', 'wind', 'blow', 'follow'): bar = fwd * 0.9 + fore * 0.5 - up * 0.25
    else: raise KeyError(hold)
    return rw, bar.normalized()


def place_shield(hold, lw, le, fwd, up, left, half_h):
    """the shield on his left forearm (in metres, unstretched): (its middle, its face's way); carry and guard, across his
    front turned a little to his left flank; block, square before him; low, planted on the ground before him"""
    import mathutils
    if hold in ('carry', 'guard'):   # on the forearm, its middle a hand toward his left and up at the belly (his right hand and its weapon stay beside it, as a shield man's do)
        face = (fwd * math.cos(math.radians(22)) + left * math.sin(math.radians(22))).normalized(); c = le.lerp(lw, 0.5) + face * 0.05 + left * 0.1 + up * 0.07
    elif hold == 'block':   # square before his face, its middle by his raised hand
        face = fwd.copy(); c = le.lerp(lw, 0.7) + face * 0.06 + up * 0.1
    elif hold == 'low':
        face = (fwd * math.cos(math.radians(12)) + left * math.sin(math.radians(12))).normalized(); c = lw + face * 0.05
        c = mathutils.Vector((c.x, c.y, max(c.z, half_h - 0.01)))
    else: raise KeyError(hold)
    return c, face


def prop_files(layer, prop, D=None):
    """every picture a prop of a layer is rendered as: (clip, key, facing, file name)"""
    S = D or source(); L = S['layers'][layer]; out = []
    only = L.get('only', {}).get(prop, 'all')
    for clip in L['clips']:
        if only != 'all' and clip not in only: continue
        for j in L['keys'].get(clip, list(range(len(S['hold'][clip])))):
            for f in FACINGS: out.append((clip, j, f, '%s_%s_%s_k%02d.png' % (prop, clip, f, j)))
    return out


def props_from(look, layer, S=None):
    """the named look whose things this look holds on this layer (itself, or YOU for a cast look past the first layer)"""
    S = S or source(); P = S.get('props_from', {})
    if layer in P.get('layers', []): return P.get('looks', {}).get(look, look)
    return look


def props_done(look, layer, prop, any_model=False):
    """every picture of this thing on this layer is rendered, from the model it is made of now (a COOK model that landed or
    changed since is rendered again); any_model, the pack's question: drawn at all, from whatever model (a model that lands
    mid-round never holds back a man's other layers: his old pictures stand, marked with what they were drawn from, until
    the new ones are in)"""
    d = os.path.join(ROOT, RENDERS, look, 'props')
    sigs = json.load(open(os.path.join(d, 'models.json'))) if os.path.exists(os.path.join(d, 'models.json')) else {}
    if not any_model and sigs.get(prop, 'stand-in') != model_sig(prop): return False
    return all(os.path.exists(os.path.join(d, fn)) for _, _, _, fn in prop_files(layer, prop))


def mark_model(look, prop):
    d = os.path.join(ROOT, RENDERS, look, 'props'); os.makedirs(d, exist_ok=True); fp = os.path.join(d, 'models.json')
    sigs = json.load(open(fp)) if os.path.exists(fp) else {}
    sigs[prop] = model_sig(prop); json.dump(sigs, open(fp, 'w'), indent=0)


def render_props(look, props, clips=None, facings=None, layer='m1'):
    """each prop alone in his hand, frame for frame with his body (the same posed model, still, box, camera, sun and stretch as
    the master rig gave his body, read back from rig.json in RENDERS/<look>), his body a holdout; one full frame per key"""
    import bpy, mathutils
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    S = source(); place = place_fn(mathutils)
    d = os.path.join(ROOT, RENDERS, look); rj = json.load(open(os.path.join(d, 'rig.json')))
    th = int(os.environ.get('BOHEMIA_RIG_THREADS', '0'))
    for prop in props:
        if not clips and not facings and props_done(look, layer, prop): continue
        out = os.path.join(d, 'props'); os.makedirs(out, exist_ok=True)
        fp = os.path.join(out, 'models.json'); sigs = json.load(open(fp)) if os.path.exists(fp) else {}
        if not clips and not facings and sigs.get(prop, 'stand-in') != model_sig(prop):   # its model changed: every picture of it again, on every layer
            for f_ in [f_ for f_ in os.listdir(out) if f_.startswith(prop + '_') and f_.endswith('.png') and f_[len(prop) + 1].isupper()]: os.remove(os.path.join(out, f_))
            sigs[prop] = model_sig(prop); json.dump(sigs, open(fp, 'w'), indent=0)
        bpy.ops.wm.read_factory_settings(use_empty=True)
        sc = bpy.context.scene
        bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, rj['model']))
        for o in list(sc.objects):
            if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None and len(o.data.vertices) == 42: bpy.data.objects.remove(o, do_unlink=True)
        body = [o for o in sc.objects if o.type == 'MESH']
        arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
        MR.clip_actions(sc, 'Stand'); still = rj['still_frame']
        sc.frame_set(int(math.floor(still)), subframe=still - math.floor(still))
        root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
        lo, hi = MR.bounds(sc, body); size = hi - lo; k = rj['scale_from_model']
        centre = mathutils.Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
        for o in list(sc.objects):
            if o.parent is None and o is not root: o.parent = root; o.location -= centre
        zs = rj['z_stretch']; root.scale = (k, k, k * zs)
        g, parts = build_prop(bpy, prop)
        chain = bpy.data.objects[g['chain']] if 'chain' in g.keys() else None
        # THE STRETCH AS A PARENT (an object's own loc/rot/scale cannot hold a shear: a tilted haft under the 3/4 stretch set as
        # one matrix lost it): the prop sits unstretched under an empty that carries only the stretch, exactly his body's
        stretch = bpy.data.objects.new('stretch', None); sc.collection.objects.link(stretch); stretch.scale = (1, 1, zs)
        for o_ in [g] + ([chain] if chain is not None else []): o_.parent = stretch; o_.matrix_parent_inverse = mathutils.Matrix()
        LEGACY = os.environ.get('BOHEMIA_MELEE_LEGACY_STRETCH') == '1'
        MR.source_pass(parts, float(MR.G['wear']), 1.0, 0)
        for o in body: o.is_holdout = True
        res = rj['res']; ppm = rj['ppm']
        cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = res / ppm
        cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
        t = math.radians(rj['camera']['tilt_deg']); cam.rotation_euler = (t, 0, 0)
        look_at = mathutils.Vector((0, 0, size.z * k * zs / 2)); dv = mathutils.Vector((0, math.sin(t), -math.cos(t)))
        cam.location = look_at - dv * 30; sc.render.resolution_x = sc.render.resolution_y = res
        MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg'])))
        sc.cycles.samples = 24; sc.render.use_persistent_data = True; sc.render.film_transparent = True
        if th: sc.render.threads_mode = 'FIXED'; sc.render.threads = th
        R = arm.pose.bones
        U = lambda v: mathutils.Vector((v.x, v.y, v.z / zs))   # the stretched world back to metres (the ground is z 0)
        shield = bool(S['props'][prop].get('shield')); pistol = prop == 'pistol'
        def put(hold):
            bpy.context.view_layer.update()
            W = arm.matrix_world
            rw, lw, re, le = (U(W @ R[b].head) for b in ('Skeleton_arm_joint_R__3_', 'Skeleton_arm_joint_L__2_', 'Skeleton_arm_joint_R__2_', 'Skeleton_arm_joint_L__3_'))
            fwd = (root.matrix_world.to_3x3() @ mathutils.Vector((0, -1, 0))); fwd.z = 0; fwd.normalize()
            up = mathutils.Vector((0, 0, 1)); left = up.cross(fwd).normalized()
            if shield:   # its face out, its width level, up up
                c, x = place_shield(hold, lw, le, fwd, up, left, shield_dims(prop)[0])
                y = up.cross(x).normalized(); z = x.cross(y).normalized()
                M = mathutils.Matrix((x, y, z)).transposed().to_4x4(); M.translation = c
            else:
                fist, x = place_pistol(hold, rw, lw, re, fwd, up, left) if pistol else place(hold, rw, lw, re, fwd, up, left, S['props'][prop].get('fore', 0.5))
                z = left.cross(x)
                if z.length < 1e-4: z = fwd.copy()
                z.normalize(); y = z.cross(x).normalized(); z = x.cross(y).normalized()
                M = mathutils.Matrix((x, y, z)).transposed().to_4x4(); M.translation = fist
            if LEGACY: g.parent = None; g.matrix_world = mathutils.Matrix.Diagonal((1, 1, zs, 1)) @ M   # the first pass's way (m1), kept to measure against
            else: g.matrix_basis = M   # under the stretch: stretched as his body is, so it stays in his fist
            if chain is not None:   # the flail's chain hangs from the handle's end, trails the wind, flies out on the blow
                tip = fist + x * S['props'][prop]['fore']
                dd = {'wind': -fwd * 0.7 - up * 0.5, 'blow': fwd * 0.9 - up * 0.3, 'follow': fwd * 0.3 - up * 0.95}.get(hold, -up).normalized()
                Mc = mathutils.Vector((0, 0, 1)).rotation_difference(dd).to_matrix().to_4x4(); Mc.translation = tip
                chain.matrix_basis = Mc
            # only the prop's own patch of the frame is rendered (the rest is empty film): its box on the camera, padded
            bpy.context.view_layer.update()
            dg = bpy.context.evaluated_depsgraph_get()
            from bpy_extras.object_utils import world_to_camera_view
            xs, ys = [], []
            for o in parts:
                e = o.evaluated_get(dg)
                for c in e.bound_box:
                    p = world_to_camera_view(sc, cam, e.matrix_world @ mathutils.Vector(c)); xs.append(p.x); ys.append(p.y)
            pad = 6.0 / res
            sc.render.use_border = True; sc.render.use_crop_to_border = False
            sc.render.border_min_x, sc.render.border_max_x = max(0.0, min(xs) - pad), min(1.0, max(xs) + pad)
            sc.render.border_min_y, sc.render.border_max_y = max(0.0, min(ys) - pad), min(1.0, max(ys) + pad)
        n = 0
        only = S['layers'][layer].get('only', {}).get(prop, 'all')
        for clip in (clips or S['layers'][layer]['clips']):
            if only != 'all' and clip not in only: continue
            holds = (S['shield_hold'] if shield else S['hold'])[clip]
            keys = S['layers'][layer]['keys'].get(clip, list(range(len(holds))))
            a0, a1 = MR.clip_actions(sc, clip)
            nk = int(round((a1 - a0) / 2))   # a clip of N held keys spans [0, 2N], key k at frame 2k + 1 (the poses tool's and the hold tool's)
            frames = [a0 + (a1 - a0) * (i + 0.5) / nk for i in range(nk)]
            for fi, f in enumerate(FACINGS):
                if facings and f not in facings: continue
                root.rotation_euler = (0, 0, math.radians(180 - 45 * fi))
                for j in keys:
                    fr = frames[j]
                    sc.frame_set(int(math.floor(fr)), subframe=fr - math.floor(fr))
                    put(S.get('hold_by_prop', {}).get(prop, {}).get(holds[j], holds[j]))
                    sc.render.filepath = os.path.join(out, '%s_%s_%s_k%02d.png' % (prop, clip, f, j))
                    bpy.ops.render.render(write_still=True); n += 1
        print('PROPS', look, prop, n, flush=True)


# ------------------------------------------------------------------------------------------------ everyone the fight draws
def combat():
    import bohemia_combat_the_fight_wears_the_rig as CF
    return CF


def idles():
    import bohemia_animation_everybody_idles as I
    return I


PASSES = ['', '_s', '_t', '_u', '_v', '_w', '_x']   # a man's body passes: the first, then a pass for the clips made after it (the shield's, ...)


def clip_dir(name, clip):
    """the folder of his passes that holds this clip (each pass its own crop of the same full frame: Stand first)"""
    for sfx in PASSES:
        d = os.path.join(ROOT, RENDERS, name + sfx)
        if os.path.exists(os.path.join(d, 'rig.json')) and os.path.exists(os.path.join(d, 'rig_%s_S_k00.png' % clip)): return d
    return None


def missing_clips(name):
    return [(c, k) for c, k in new_clips() if not clip_dir(name, c)]


def next_pass(name):
    return next(sfx for sfx in PASSES if not os.path.exists(os.path.join(ROOT, RENDERS, name + sfx, 'rig.json')))


def body_done(name):
    return os.path.exists(os.path.join(ROOT, RENDERS, name, 'rig.json')) and not missing_clips(name)


def look_one(name):
    """a named look: COMBAT's own build (rebuilt by its `bodies` when missing), every held clip and these keys laid on it, the
    new keys rendered with Stand first (so the frame is the look's own), then every prop of every layer in his hand"""
    H = hold_tool()
    if not H.claimed('melee_' + name): print('SKIP', name, 'another worker has him', flush=True); return
    CF = combat(); I = idles(); py = sys.executable
    src = os.path.join(ROOT, H.COMBAT_POSED, name + '.glb')
    if not os.path.exists(src): I.run([py, 'tools/bohemia_combat_the_fight_wears_the_rig.py', 'bodies', name], src)
    glb = os.path.join(ROOT, POSED, name + '.glb')
    miss = missing_clips(name)
    if miss or not os.path.exists(glb):   # every clip laid on him again (the pose is cheap), then only what no pass of his holds
        I.run([py, os.path.abspath(__file__), 'pose', src, glb], glb)
    if miss:
        CF.POSED, CF.RENDERS = POSED, RENDERS
        CF.render(name, clips=[('Stand', 1)] + miss, suffix=next_pass(name))
    S = source()
    for layer, L in S['layers'].items():
        if layer not in S.get('layers_ready', S['layers']) or props_from(name, layer, S) != name: continue   # a cast look holds YOU's things there
        for prop in L['props']:
            for i in range(3):   # bpy 4.2 dies at exit now and then, after the frames are written
                if props_done(name, layer, prop): break
                subprocess.call([py, os.path.abspath(__file__), '_props', name, prop, '', '', layer], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if not props_done(name, layer, prop): raise SystemExit('PROPS FAILED %s %s' % (name, prop))
    print('MELEE', name, flush=True)


def person_one(tag):
    """a rolled man (RUN TWO's people, CHARACTER's enemies): his own build (its tool run, its committed records kept), every held
    clip and these keys laid on it, the new keys rendered at the street's settings the way his fight sheet was; his props are
    his gang's (packed from its cell, the way his guns are)"""
    H = hold_tool()
    if not H.claimed('melee_' + tag): print('SKIP', tag, 'another worker has him', flush=True); return
    miss = missing_clips(tag)
    if not miss: return
    I = idles(); py = sys.executable
    if tag.startswith('enemy_'):
        pid = next(p['id'] for p in json.load(open(os.path.join(ROOT, H.ENEMY_ROLL))) if 'enemy_' + p['id'].lower() == tag)
        glb = os.path.join(ROOT, H.PEOPLE_MODELS, 'barber_person_%s.glb' % pid.lower())
        build = [py, 'tools/bohemia_character_the_three_enemies.py', 'build-one', pid]
    else:
        pid = next(p['id'] for p in json.load(open(os.path.join(ROOT, H.PEOPLE_ROLL))) if 'person_' + p['id'].lower() == tag)
        glb = os.path.join(ROOT, H.PEOPLE_MODELS, 'barber_%s.glb' % tag)
        build = [py, 'tools/bohemia_run2_no_two_people_alike.py', 'build-one', pid]
    gj = glb.replace('.glb', '.json')
    if not os.path.exists(glb):
        bj = os.path.join(ROOT, H.PEOPLE_MODELS, tag + '.json')
        kept = {f_: open(f_).read() for f_ in (gj, bj) if os.path.exists(f_)}
        I.run(build, glb)
        for f_, txt in kept.items():   # the build's committed records stand as they are
            with open(f_, 'w') as fh: fh.write(txt)
    h = json.load(open(gj))['real_height_for_rig']
    posed = os.path.join(ROOT, POSED, tag + '.glb')
    I.run([py, os.path.abspath(__file__), 'pose', glb, posed], posed)
    out = os.path.join(ROOT, RENDERS, tag + next_pass(tag))
    I.render_model(posed, out, h, [('Stand', 1)] + miss)
    for f in os.listdir(out):
        if f.startswith(('raw_', 'shadow_')): os.remove(os.path.join(out, f))
    print('MELEE person', tag, flush=True)


def queue():
    """the named looks first (their props are every man's: a rolled man holds his gang's), in the order the fight meets them,
    then the rolled men (their own tap and shoulder keys)"""
    q = hold_tool().queue()
    return [t for t in q if not is_person(t)] + [t for t in q if is_person(t)]


def is_person(t): return t.startswith(('person_', 'enemy_'))


def done(t):
    if is_person(t): return body_done(t)
    S = source()
    return body_done(t) and all(props_done(t, ly, p) for ly, L in S['layers'].items() if ly in S.get('layers_ready', S['layers']) and props_from(t, ly, S) == t for p in L['props'])


def all_(workers=4, only=None):
    todo = [t for t in (only or queue()) if not done(t)]
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // workers)))
    procs = []
    for w in range(workers):
        mine = todo[w::workers]
        if not mine: continue
        sh = ' ; '.join('%s %s %s %s' % (sys.executable, os.path.abspath(__file__), 'person' if is_person(x) else 'look', x) for x in mine)
        procs.append(subprocess.Popen(['bash', '-c', sh], cwd=ROOT, env=env))
    for p in procs: p.wait()


def export(names=None):
    """every thing this lane holds in a man's hand, alone at its real size, as a glb for COOK's item models and icons (rule
    177(c)): reference/models/bohemia/held_<name>.glb; a haft along +X from the middle of the grip, the edge +Z; a shield's
    face out along +X, its width +Y, up +Z, the strap side at x = 0"""
    import bpy
    S = source()
    for name in (names or [n for n in S['props'] if n != 'pistol']):
        bpy.ops.wm.read_factory_settings(use_empty=True)
        g, parts = build_prop(bpy, name)
        out = os.path.join(ROOT, 'reference/models/bohemia/held_%s.glb' % name)
        bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
        print('EXPORTED', os.path.relpath(out, ROOT), flush=True)


# ------------------------------------------------------------------------------------------------ pack (python3)
def pack(only=None):
    """slices/rig_melee/<look>.webp (the new body keys, each cell cut to what is drawn, shelf-packed), <look>_props.webp (every
    prop on every key it is held on, a named look's), <look>.json (each cell placed from the look's fight-sheet cell by his
    feet, as the held sheets are), and slices/rig_melee/rig_melee.json. The body's colours are his own fight sheet's; a prop's
    are the style palette's ramps (its wood, rust and steel are the guide's steps, never his coat's). The index is never
    rebuilt from nothing (the renders live only in the container that made them)."""
    import numpy as np
    from PIL import Image
    H = hold_tool(); S = source()
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    PAL = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
    ppal = np.array(sorted(set(tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)) for r in PAL.values() for h in r['ramp'])), np.int32)
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'))); RIM = tuple(FR['rim'])
    thr = int(G['alpha_threshold'])
    os.makedirs(os.path.join(ROOT, OUT), exist_ok=True)
    ip = os.path.join(ROOT, OUT, 'rig_melee.json')
    index = json.load(open(ip)) if os.path.exists(ip) else None
    if not index:
        index = dict(version='rig-melee-10-25', lane='animation', row="[the PC playtest: the bodies' part], the next line", rule='164 (item 31), 128',
                     source='records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json, laid on COMBAT\'s posed men with the held clips by '
                            'tools/bohemia_animation_melee_in_hand.py, rendered by DIRECTION\'s master rig the way COMBAT renders the fight',
                     dirs=FIGHT_DIRS, keys_per_beat=3,
                     cell='[x, y, w, h, dx, dy]: the cell on the sheet and where its top left sits from the look\'s fight-sheet cell origin', looks={})
    for k in ('thrust', 'thrown'): index[k] = S.get(k, [])
    index['props'] = sorted(set(p_ for L in S['layers'].values() for p_ in L['props']))
    index['clips'] = {n: len(c['keys']) for n, c in S['clips'].items()}

    def to_pal(a, P, hue=0):
        u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
        if hue:   # a thing: its brightness and its hue weighed apart, so a faded teal door in the fight's light stays teal, never chrome grey
            def ycc(x):
                x = x.astype(np.float64); Y = 0.299 * x[..., 0] + 0.587 * x[..., 1] + 0.114 * x[..., 2]
                return np.stack([Y, (x[..., 2] - Y) * 0.564, (x[..., 0] - Y) * 0.713], -1)
            dd = (((ycc(u)[:, None, :] - ycc(P)[None, :, :]) ** 2) * np.array([1.0, hue, hue])).sum(2)
        else: dd = ((u.astype(np.int32)[:, None, :] - P[None, :, :]) ** 2).sum(2)
        a[..., :3] = P[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8); return a

    PPAL = {}

    def ppal_of(prop, sig):
        """the colours a thing snaps to: drawn from COOK's model, the ramps of the materials COOK built it from
        (records/target/cook_every_item/measured_<thing>.json), so its paint is never pulled to another material's step; drawn
        from this tool's stand-in, the whole style palette"""
        key = (prop, sig.startswith('cook:'))
        if key not in PPAL:
            mj = os.path.join(ROOT, 'records/target/cook_every_item/measured_%s.json' % prop); roles = []
            if key[1] and os.path.exists(mj): roles = [m.split()[0] for m in json.load(open(mj)).get('materials', []) if m.split()[0] in PAL]
            PPAL[key] = np.array(sorted(set(tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)) for r in roles for h in PAL[r]['ramp'])), np.int32) if roles else ppal
        return PPAL[key]

    def cut(a):
        op = a[..., 3] > thr; a = a.copy(); a[..., 3] = np.where(op, 255, 0); a[~op] = 0
        ys, xs = np.nonzero(op)
        if not len(xs): return None
        y0, y1, x0, x1 = ys.min() - 1, ys.max() + 2, xs.min() - 1, xs.max() + 2
        a = np.pad(a, ((1, 1), (1, 1), (0, 0)))[y0 + 1:y1 + 1, x0 + 1:x1 + 1].copy(); op = a[..., 3] > 0
        near = np.zeros_like(op)
        near[1:, :] |= op[:-1, :]; near[:-1, :] |= op[1:, :]; near[:, 1:] |= op[:, :-1]; near[:, :-1] |= op[:, 1:]
        a[near & ~op] = RIM
        return a, x0, y0

    def shelf(items, width):
        order = sorted(range(len(items)), key=lambda i: -items[i][0].shape[0]); x = y = sh = 0; rects = [None] * len(items)
        for i in order:
            h, w = items[i][0].shape[:2]
            if x + w > width: x = 0; y += sh; sh = 0
            rects[i] = [x, y, w, h, int(items[i][1]), int(items[i][2])]; x += w; sh = max(sh, h)
        im = Image.new('RGBA', (width, max(1, y + sh)), (0, 0, 0, 0))
        for i, (a, _, _) in enumerate(items): im.paste(Image.fromarray(a, 'RGBA'), (rects[i][0], rects[i][1]))
        return im, rects

    looks = sorted([k for k in os.listdir(os.path.join(ROOT, RENDERS)) if not any(k.endswith(s_) for s_ in PASSES[1:])], key=lambda k: (is_person(k), k))
    for look in looks:
        if only and look not in only: continue
        d = os.path.join(ROOT, RENDERS, look)
        if look not in FR['looks'] or not os.path.exists(os.path.join(d, 'rig.json')) or not clip_dir(look, 'MIdleX'): continue
        person = is_person(look); fl = FR['looks'][look]
        ready = [ly for ly in S['layers'] if ly in S.get('layers_ready', S['layers']) and (person or all(props_done(props_from(look, ly, S), ly, p_, any_model=True) for p_ in S['layers'][ly]['props']))]
        if not person and 'm1' not in ready:
            print('SKIP', look, 'not every prop is rendered yet'); continue
        if person and fl.get('ref') not in index['looks']:
            print('SKIP', look, 'his gang\'s props are not packed yet'); continue
        sp = np.asarray(Image.open(os.path.join(ROOT, 'slices/fight_rig', fl['file'])).convert('RGBA'))
        bpal = np.array(sorted(set(map(tuple, sp[sp[..., 3] > 0][:, :3].tolist()))), np.int32)
        FRAME = {}
        def frame(dd):   # a pass's crop of the full frame, and where the look's fight cell sits in it (his feet are the one point both know)
            if dd not in FRAME:
                rj = json.load(open(os.path.join(dd, 'rig.json'))); cx0, cy0, cx1, cy1 = rj['crop_box_px']
                FRAME[dd] = (rj, cx0 + rj['ground_px'][0] - fl['foot'][0], cy0 + rj['ground_px'][1] - fl['foot'][1])
            return FRAME[dd]
        def full(fn, rj):
            a = np.asarray(Image.open(fn).convert('RGBA')).copy()
            if a.shape[0] != rj['res'] or a.shape[1] != rj['res']:
                cx0, cy0, cx1, cy1 = rj['crop_box_px']; z = np.zeros((rj['res'], rj['res'], 4), np.uint8); z[cy0:cy1, cx0:cx1] = a; a = z
            return a
        # ONE SHEET A GROUP, NEVER ONE FOR EVERYTHING (rule 173, no crash before a fight): his own keys split by what they are for
        # (m the melee idle's, s the shield arm's, t the two-hander's) and a named look's things by layer, so a man with a pipe
        # and no shield decodes the melee keys and the pipe's sheet and nothing of the shield or the sledge
        groups, own = {}, set()
        for clip, n in new_clips(False):
            dd = clip_dir(look, clip)
            if not dd or not all(os.path.exists(os.path.join(dd, 'rig_%s_%s_k%02d.png' % (clip, f, k))) for f in FIGHT_DIRS for k in range(n)): continue   # not rendered yet: the next pass
            rj, fx0, fy0 = frame(dd)
            own |= set(k_ for c_ in rj.get('clips', {}).values() for f_ in c_.get('motion_px', {}) for key in c_['motion_px'][f_] for k_ in key)
            gi = GROUP(clip); G_ = groups.setdefault(gi, dict(imgs=[], clips={}))
            for k in range(n):
                for row, f in enumerate(FIGHT_DIRS):
                    r = cut(full(os.path.join(dd, 'rig_%s_%s_k%02d.png' % (clip, f, k)), rj))
                    ix = None
                    if r is not None: ix = len(G_['imgs']); G_['imgs'].append((to_pal(r[0], bpal), r[1] - fx0, r[2] - fy0))
                    G_['clips'].setdefault(clip, [[None] * 8 for _ in range(n)])[k][row] = ix
        for old in [f_ for f_ in os.listdir(os.path.join(ROOT, OUT)) if f_.startswith(look + '_') or f_ == look + '.webp']:
            if old.endswith('.webp') and (old == look + '.webp' or old[len(look) + 1:].split('.')[0] in ('m', 's', 't', 'props') or old[len(look) + 1:].startswith('props')):
                os.remove(os.path.join(ROOT, OUT, old))   # the last pack's sheets (a sheet left behind is weight on the site)
        sheets, cells = {}, {}
        for gi, G_ in sorted(groups.items()):
            im_, rects_ = shelf(G_['imgs'], 1024)
            fn_ = '%s_%s.webp' % (look, gi); im_.save(os.path.join(ROOT, OUT, fn_), 'WEBP', lossless=True, quality=100, method=6)
            sheets[gi] = dict(file=fn_, size=list(im_.size), cells=rects_)
            for c_, k_ in G_['clips'].items(): cells[c_] = dict(g=gi, k=k_)
        entry = dict(fight=fl['file'], foot=fl['foot'], sheets=sheets, clips=cells)
        hp = os.path.join(ROOT, 'slices/rig_hold', look + '.json')
        if os.path.exists(hp) and json.load(open(hp)).get('held'): entry['held'] = json.load(open(hp))['held']   # his own modelled weapon (the thug's pipe, the poacher's hatchet)
        if any('crashbar' in p_.lower() for p_ in own): entry['own_shield'] = sorted(p_ for p_ in own if 'crashbar' in p_.lower())   # the Heavy's own crash bar on his model: never a second shield
        rj, fx0, fy0 = frame(d)
        if person:
            entry['ref'] = fl['ref']
        else:
            psheets, by = {}, {}
            if any(props_from(look, ly, S) != look for ly in ready): entry['props_ref'] = next(props_from(look, ly, S) for ly in ready if props_from(look, ly, S) != look)
            mf = os.path.join(d, 'props', 'models.json'); sigs = json.load(open(mf)) if os.path.exists(mf) else {}
            for ly in [l_ for l_ in ready if props_from(look, l_, S) == look]:
                pimgs = []
                for prop in S['layers'][ly]['props']:
                    for clip, j, f, fn in prop_files(ly, prop):
                        a_ = np.asarray(Image.open(os.path.join(d, "props", fn)).convert("RGBA"))   # a full frame
                        r = cut(a_) if (a_[..., 3] > thr).sum() >= SPECK else None   # a speck past his collar or his hat is no prop: hidden behind him
                        ix = None
                        if r is not None: ix = len(pimgs); pimgs.append((to_pal(r[0], ppal_of(prop, sigs.get(prop, 'stand-in')), 4.0), r[1] - fx0, r[2] - fy0))
                        nk = len(S['hold'][clip])
                        by.setdefault(prop, {}).setdefault(clip, dict(l=ly, k=[[None] * 8 for _ in range(nk)]))['k'][j][FIGHT_DIRS.index(f)] = ix
                pim, prects = shelf(pimgs, 2048)
                fn_ = '%s_props_%s.webp' % (look, ly); pim.save(os.path.join(ROOT, OUT, fn_), 'WEBP', lossless=True, quality=100, method=6)
                psheets[ly] = dict(file=fn_, size=list(pim.size), cells=prects)
            entry['props'] = dict(sheets=psheets, by=by, models={p_: sigs.get(p_, 'stand-in') for p_ in by})   # what each thing was drawn from

        entry['layers'] = [ly for ly in ready if all(c_ in cells for c_ in layer_clips(S, ly))]   # the layers whose own keys (and, a named look's, things) are on these sheets
        json.dump(entry, open(os.path.join(ROOT, OUT, look + '.json'), 'w'), separators=(',', ':'))
        index['looks'][look] = dict(json=look + '.json')
        print('PACKED', look, {g_: s_['size'] for g_, s_ in sheets.items()}, 'things', {l_: s_['size'] for l_, s_ in entry['props']['sheets'].items()} if 'props' in entry else 'his gang\'s (%s)' % entry.get('ref'), flush=True)
    # a layer is live once a named look's own things for it are packed (the source's layers_ready says what is being rendered;
    # this says what the fight may draw), and a row maps to a thing only once that thing is in a live layer: never a man the
    # fight thinks is armed while the sheet is not
    live = set()
    for look in index['looks']:
        if is_person(look) or not os.path.exists(os.path.join(ROOT, OUT, look + '.json')): continue
        e_ = json.load(open(os.path.join(ROOT, OUT, look + '.json')))
        live |= set(ly for ly in e_.get('layers', []) if ly in e_.get('props', {}).get('sheets', {}))
    index['layers_ready'] = [ly for ly in S.get('layers_ready', list(S['layers'])) if ly in live]
    ready_props = set(p_ for ly in index['layers_ready'] for p_ in S['layers'][ly]['props'])
    for k in ('composite', 'timelines', 'by_row', 'by_class', 'shield_by_row', 'shield_over', 'two_by_row', 'two_by_class'):
        index[k] = {a_: b_ for a_, b_ in S.get(k, {}).items() if a_ != 'why' and (k not in ('by_row', 'by_class', 'shield_by_row', 'two_by_row', 'two_by_class') or b_ in ready_props)}
    json.dump(index, open(ip, 'w'), separators=(',', ':'))
    print('INDEX', ip, len(index['looks']), 'looks, live layers', index['layers_ready'])


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    a = sys.argv[2:]
    if cmd == 'pose': pose(a[0], a[1])
    elif cmd == '_props': render_props(a[0], a[1].split(','), a[2].split(',') if len(a) > 2 and a[2] else None, a[3].split(',') if len(a) > 3 and a[3] else None, a[4] if len(a) > 4 else 'm1')
    elif cmd == 'look': look_one(a[0])
    elif cmd == 'person': person_one(a[0])
    elif cmd == 'all': all_(int(a[0]) if a else 4, a[1:] or None)
    elif cmd == 'pack': pack(a or None)
    elif cmd == 'export': export(a or None)
    else: sys.exit(__doc__)
