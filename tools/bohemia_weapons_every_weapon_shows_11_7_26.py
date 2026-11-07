#!/usr/bin/env python3
"""BOHEMIA -- WEAPONS [every weapon shows] and [more one-handers] (rule 424, ask lines 489 and 490; Paolo 11/7: 'some two handed
weapons aren't showing up... we need more one-handed weapons, I feel like there's not enough one-handed weapons').

MEASURED FIRST (records/BOHEMIA_WEAPONS_EVERY_WEAPON_SHOWS_11_7_26.md): of the 145 rows of records/target/bb/weapons.json, the
fight drew TWELVE two-handers from empty hands: the five two-handed swords (rhomphaia, warbrand, longsword, greatsword,
executioner's sword), the three two-handed flails (two-handed wooden flail, two-handed flail, berserk chain) and the four
two-handed cleavers (two-handed saif, rusty warblade, crypt cleaver, two-handed scimitar). THE ROOT CAUSE: the fight finds a
melee row's picture by its row, else its class (slices/rig_melee/rig_melee.json by_row / by_class for one hand, two_by_row /
two_by_class for two), and two_by_class named only hammer, axe, mace, polearm and spear: no two-handed blade, chain or cleaver
picture existed, so meleeProp() returned nothing and every one of the twelve, sold on every smith's shelf (the shelf rolls from
the whole list by price), swung from bare fists. And the crew screen drew a gun or nothing: every melee weapon, every bow and
every shield was missing on it.

THIS TOOL, COOK's recipe (tools/bohemia_cook_every_weapon_its_own_11_3_26.py, imported, its kit, render and pack reused):
  1. THREE TWO-HANDED FAMILY MODELS, one a class, so no two-handed row is ever without a picture again:
       sword   -> the gift-shop claymore  (a castle casino's gift-shop hand-and-a-half sword, one edge ground sharp)
       flail   -> the tow chain           (a grade 70 transport chain and its grab hook on a pipe handle, two hands)
       cleaver -> the ditch blade         (a public-works Kaiser blade: a curved double-edged brush blade on an ash handle)
  2. SIX NEW ONE-HANDERS, real things a man finds in a dead Bohemia, each an armory row (records/target/bb/armory.json, ARMORY's
     tool writes them into the files the game reads) and its own model:
       tire_iron   (mace)    the L-shaped lug wrench out of a dead car's trunk
       golf_club   (mace)    a seven iron off a dead golf course
       bowie_knife (sword)   a ten-inch clip-point hunting knife off a sporting-goods wall
       pipe_wrench (hammer)  an eighteen-inch iron pipe wrench off a plumber's truck
       tomahawk    (axe)     a sporting-goods tomahawk, the price tag still on the haft
       slot_handle (mace)    the pull arm torn off a slot machine, the red ball still on it
  3. IN HIS HANDS: ANIMATION's render_props on YOU, new layers m6/s6 (one hand, with and without a shield: the m2/s2 clips) and
     t5 (two hands: the t2 clips); every other man holds YOU's pictures moved by the difference of their feet (props_ref, the
     fight's laidCell), the way the thirteen armory weapons already are.

    <bpy> tools/bohemia_weapons_every_weapon_shows_11_7_26.py model [names|all|one|two]
    python3 tools/bohemia_weapons_every_weapon_shows_11_7_26.py wire [names]
    <bpy> tools/bohemia_weapons_every_weapon_shows_11_7_26.py render [names] [workers]
    python3 tools/bohemia_weapons_every_weapon_shows_11_7_26.py pack [names]
    <bpy> tools/bohemia_weapons_every_weapon_shows_11_7_26.py alone [names]      side-on render for the shelf
    <bpy> tools/bohemia_weapons_every_weapon_shows_11_7_26.py icon-render [names]
    python3 tools/bohemia_weapons_every_weapon_shows_11_7_26.py shelf [names]     slices/market_icons/own_<row>.png
    python3 tools/bohemia_weapons_every_weapon_shows_11_7_26.py manifest [names]  reference/models/bohemia/items.json

REUSE CHECK: COOK's every-weapon tool is imported and its WEAPONS table, kit (E()), hang_path/hang_tube, render workers,
alone, icon render, shelf and manifest are called as they are; only the layer names differ (m6, s6, t5: the m5 sheet is full
at 2048 x 1024, rule 173), so wire and pack are COOK's with the layers as a parameter. Nothing drawn by hand; no bank opened
(nothing in banks/ is a 3D model).
REFERENCE CHECK (the 9/4 standing law): each piece is judged in YOU's hands in the shipped fight beside the thug (body_thug_S,
the bar sheet's man, records/target/direction_bar), and against the real thing's size: a car-kit lug wrench 17 in with a
19 mm socket; a seven iron 37 in, head 3 in; a Bowie knife 10 in blade, 15 in overall; an 18 in pipe wrench, 2.4 kg; a
19 in tomahawk with a 3.5 in edge; a slot machine's pull arm about 14 in with a 2 in ball; a hand-and-a-half sword 47 in; a
3/8 in grade 70 chain with its grab hook; a Kaiser ditch blade 40 in with a 12 in blade (PROP-02 the real object, its real
length and weight). Analog horror AH-01: each one is ordinary, worn, and one thing on it is wrong (the nut still in the socket,
the dead grass in the grooves, the price tag, the tow hook's paint). Battle Brothers draws every weapon its own sprite in the
man's hand: that is the study, no other reference game.
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_cook_every_weapon_its_own_11_3_26 as C

SRC, RIGM, OUTD = C.SRC, C.RIGM, C.OUTD
ONE_LAYERS = ('m6', 's6')
TWO_LAYER = 't5'
MY_LAYERS = ('m6', 's6', 't5')

# name: its armory row (one-handers) or the class it draws (the two-handed families), how it is held, what it is
NEW = {
    # ---- the two-handed families (rule 424(a)): one picture a class, for every two-handed row of it
    'gift_shop_claymore': dict(cls='sword', row=None, was=None, hands=2, name='the gift-shop claymore', like='fire_axe', back=0.1, fore=1.1,
                               say="a castle casino's gift-shop hand-and-a-half sword: the cord-wrapped grip, the steel guard, one edge ground bright, the other still the shop's dull"),
    'tow_chain': dict(cls='flail', row=None, was=None, hands=2, name='the tow chain', like='fire_axe', hang=True, back=0.06, fore=0.55,
                      say='a gold grade 70 transport chain through a drilled pipe handle, the grab hook still on its end'),
    'ditch_blade': dict(cls='cleaver', row=None, was=None, hands=2, name='the ditch blade', like='fire_axe', back=0.06, fore=0.95,
                        say='a public-works Kaiser blade: a curved double-edged brush blade on a long ash handle, the tool room\'s yellow band'),
    # ---- the new one-handers (rule 424(b)), each an armory row
    'tire_iron': dict(cls='mace', row='tire_iron', was='pipe', hands=1, name='the tire iron', like='pipe', back=0.08, fore=0.4,
                      say="a car kit's L-shaped lug wrench, the socket bent toward the blow, the pry end flat, a lug nut still stuck in the socket"),
    'golf_club': dict(cls='mace', row='golf_club', was='club', hands=1, name='the golf club', like='pipe', back=0.08, fore=0.88,
                      say='a seven iron: the worn rubber grip, the steel shaft with a slight bend, the head with dead grass still in its grooves'),
    'bowie_knife': dict(cls='sword', row='bowie_knife', was='machete', hands=1, name='the Bowie knife', like='cleaver', back=0.07, fore=0.38,
                        say='a ten-inch clip-point hunting knife, the brass guard, the stag handle, an orange cord through the lanyard hole'),
    'pipe_wrench': dict(cls='hammer', row='pipe_wrench', was='sledge', hands=1, name='the pipe wrench', like='pipe', back=0.08, fore=0.38,
                        say='an eighteen-inch iron pipe wrench, the red I-beam handle chipped to iron, the hook jaw and the knurled nut, white thread tape wound on the grip'),
    'tomahawk': dict(cls='axe', row='tomahawk', was='hatchet', hands=1, name='the tomahawk', like='hatchet', back=0.08, fore=0.42,
                     say="a sporting-goods tomahawk: the hickory haft wrapped in black cord, the bearded head and its back spike, the store's price tag still on the haft"),
    'slot_handle': dict(cls='mace', row='slot_handle', was='pipe', hands=1, name='the slot machine handle', like='pipe', back=0.06, fore=0.34,
                        say="the pull arm torn off a slot machine: a chrome rod, the red ball on its end, the bent mount plate with its sheared bolts at the butt"),
}
GROUP = {'one': [n for n, w in NEW.items() if w['hands'] == 1], 'two': [n for n, w in NEW.items() if w['hands'] == 2]}


def names_of(args):
    out = []
    for a in args or ['all']:
        if a == 'all': out += list(NEW)
        elif a in GROUP: out += GROUP[a]
        else: out.append(a)
    return [n for i, n in enumerate(out) if n not in out[:i]]


def register():
    """COOK's table and module take the nine, so its kit, render, alone, icon and shelf know them"""
    for n, w in NEW.items():
        C.WEAPONS.setdefault(n, dict(w, row=w['row'] or n))
        setattr(C, 'b_' + n, globals()['b_' + n])
    return C


def E(): return C.E()


# ------------------------------------------------------------------------------------------------ the builders (bpy)
# COOK's frame: built standing up, the haft along +Z from the fist (z = 0 the middle of the grip), the edge toward +X.
def b_tire_iron(K, mu):
    """a car kit's L-shaped lug wrench: a black-oxide hex bar, the 19 mm socket on the short arm bent toward the blow, the long
    arm's end hammered flat to a pry tip for the hubcap; the odd thing: a rusted lug nut still jammed in the socket"""
    BAR, STEEL, RUST, WORN = ('metal_painted', 1), ('chrome', 1), ('clay_rust', 1), ('tape_grey', 2)
    back, fore = 0.08, 0.36; r = 0.009 * E().FAT
    K.lathe('bar', BAR, [(0, -back + 0.03), (r, -back + 0.03), (r, fore), (0, fore)], n=6, smooth=False)
    K.lathe('worn', WORN, [(0, -0.06), (r * 1.03, -0.06), (r * 1.03, 0.07), (0, 0.07)], n=6, smooth=False)
    K.loft('pry', BAR, [(-back + 0.035, -r, r, r, r), (-back + 0.0, -r * 1.5, r * 1.5, r * 0.45, r * 0.45), (-back - 0.02, -r * 1.7, r * 1.7, 0.0015, 0.0015)])
    K.tube('bend', BAR, [(0, 0, fore - 0.01), (0.02, 0, fore + 0.025), (0.06, 0, fore + 0.035), (0.1, 0, fore + 0.035)], r, verts=6)
    K.rod('socket', STEEL, (0.095, 0, fore + 0.035), (0.15, 0, fore + 0.035), 0.0165, 12)
    K.rod('nut', RUST, (0.148, 0, fore + 0.035), (0.162, 0, fore + 0.035), 0.0135, 6)
    return True


def b_golf_club(K, mu):
    """a seven iron held like a hatchet: the worn rubber grip, the chrome shaft with a slight bend in its upper third, the black
    ferrule, the iron head with its toe toward the blow and its face grooves; the odd thing: dead grass still packed in the
    grooves of a course nobody has watered since"""
    GRIP, SHAFT, HEAD, GROOVE, GRASS = ('rubber', 2), ('chrome', 1), ('tape_grey', 3), ('rubber', 0), ('clay_bone', 2)
    back, fore = 0.08, 0.86; rr = lambda x: x * E().FAT
    K.lathe('grip', GRIP, [(0, -back), (rr(0.0145), -back), (rr(0.0145), -back + 0.012), (rr(0.0125), 0.12), (rr(0.0105), 0.18), (0, 0.18)], n=10)
    rs = rr(0.0072)
    K.rod('shaft_low', SHAFT, (0, 0, 0.17), (0, 0, 0.55), rs, 8)
    bend = 0.02   # the upper third bent off true, the way a club that hit something besides a ball is
    K.rod('shaft_high', SHAFT, (0, 0, 0.55), (bend, 0, fore - 0.03), rs * 0.92, 8)
    K.lathe('ferrule', GROOVE, [(0, fore - 0.05), (rs * 1.25, fore - 0.05), (rs * 1.25, fore - 0.035), (0, fore - 0.035)], n=8)
    sh = K.lathe('hosel', HEAD, [(0, fore - 0.04), (rs * 1.4, fore - 0.04), (rs * 1.6, fore), (0, fore + 0.004)], n=8)
    sh.location = (bend, 0, 0)
    # the head: toe out along +X (the way it lands held like a hatchet), its blade thin in Y, the sole on top
    K.box('head', HEAD, (0.078, 0.022, 0.046), (bend + 0.038, 0, fore + 0.012), rot=(0, 0.12, 0), bevel=0.006)
    for k in range(5): K.box('groove_%d' % k, GROOVE, (0.06, 0.003, 0.0022), (bend + 0.04, -0.0115, fore - 0.002 + k * 0.007), rot=(0, 0.12, 0))
    K.box('grass', GRASS, (0.022, 0.004, 0.012), (bend + 0.06, -0.012, fore + 0.006), rot=(0, 0.12, 0.2))
    return True


def b_bowie_knife(K, mu):
    """a ten-inch clip-point Bowie: the stag handle (an oval lathe), the brass crossguard, the broad blade with its clip dipping
    toward the point along the spine, the edge ground bright; the odd thing: an orange cord knotted through the lanyard hole.
    Drawn 1.15 over its real 0.38 m so the blade is more than a hairline at the fight's 57 px a metre (the box cutter's way)"""
    STAG, BRASS, STEEL, EDGE, CORD = ('clay_mustard', 1), ('clay_mustard', 3), ('tape_grey', 2), ('chrome', 1), ('sodium', 2)
    k = 1.15; back = 0.07 * k
    K.lathe('handle', STAG, [(0, -back), (0.015 * k, -back), (0.018 * k, -back + 0.02 * k), (0.016 * k, 0.03 * k), (0.018 * k, 0.07 * k), (0, 0.075 * k)], n=10)
    K.lathe('pommel', BRASS, [(0, -back - 0.012 * k), (0.016 * k, -back - 0.012 * k), (0.016 * k, -back + 0.002), (0, -back + 0.002)], n=10)
    K.box('guard', BRASS, (0.075 * k, 0.014 * k, 0.012 * k), (0.004 * k, 0, 0.081 * k), bevel=0.002)
    z0, L = 0.087 * k, 0.255 * k
    # sections: (z, spine x, edge x, half-thick at spine, half-thick at edge); the clip brings the spine down to the point
    K.loft('blade', STEEL, [(z0, -0.012 * k, 0.034 * k, 0.0032, 0.0012), (z0 + L * 0.55, -0.012 * k, 0.036 * k, 0.003, 0.0011),
                            (z0 + L * 0.72, -0.006 * k, 0.034 * k, 0.0026, 0.001), (z0 + L * 0.9, 0.006 * k, 0.026 * k, 0.0016, 0.0008),
                            (z0 + L, 0.016 * k, 0.018 * k, 0.0008, 0.0006)])
    K.loft('edge', EDGE, [(z0 + 0.01, 0.028 * k, 0.0355 * k, 0.0012, 0.0006), (z0 + L * 0.55, 0.03 * k, 0.0375 * k, 0.0011, 0.0005),
                          (z0 + L * 0.9, 0.021 * k, 0.027 * k, 0.0008, 0.0004)])
    K.loft('clip', EDGE, [(z0 + L * 0.72, -0.0065 * k, -0.004 * k, 0.0026, 0.0026), (z0 + L * 0.9, 0.0055 * k, 0.008 * k, 0.0016, 0.0016)])
    K.CI.link(K.bpy, 'loop', K.m(*CORD), (0, 0, -back - 0.03 * k), (0, 0, 1), False, major=0.016 * k, minor=0.0035)
    K.rod('tail', CORD, (0.004, 0, -back - 0.045 * k), (0.016, 0.004, -back - 0.085 * k), 0.0032, 5)
    return True


def b_pipe_wrench(K, mu):
    """an eighteen-inch iron pipe wrench held by its handle: the red I-beam handle chipped to bare iron, its hanging hole; at the
    head the heel jaw with its teeth, the hook jaw over it on its threaded shank and the knurled nut between, the jaws open
    toward the blow; the odd thing: white thread-seal tape wound round the grip where a plumber's hand wore the paint off"""
    RED, IRON, TEETH, TAPE, HOLE = ('clay_rust', 2), ('metal_painted', 1), ('chrome', 1), ('clay_bone', 4), ('rubber', 0)
    back, fore = 0.08, 0.3
    K.box('handle', RED, (0.03, 0.017, back + fore), (0, 0, (fore - back) / 2), bevel=0.004)
    K.box('web', IRON, (0.012, 0.019, back + fore - 0.03), (0, 0, (fore - back) / 2), bevel=0.002)
    K.disc('hole', HOLE, 0.0065, (0, 0.0095, -back + 0.018), (0, 1, 0), depth=0.004, verts=10)
    for k_, z in enumerate((0.12, 0.2)): K.disc('chip_%d' % k_, IRON, 0.007, (0.0155, 0, z), (1, 0, 0), depth=0.002, verts=6)
    for k_ in range(6):
        z = -0.05 + k_ * 0.018
        K.box('tape_%d' % k_, TAPE, (0.034, 0.021, 0.012), (0, 0, z), bevel=0.003)
    # the head: the heel jaw out of the handle's top, the hook jaw's shank up its back, the nut, the hook over the heel
    K.box('heel', IRON, (0.07, 0.022, 0.03), (0.022, 0, fore + 0.012), bevel=0.004)
    for t in range(4): K.box('heel_tooth_%d' % t, TEETH, (0.006, 0.022, 0.006), (0.03 + t * 0.012, 0, fore + 0.029), rot=(0, 0.6, 0))
    K.rod('shank', IRON, (-0.008, 0, fore + 0.01), (-0.008, 0, fore + 0.13), 0.011, 8)
    nut = K.lathe('nut', IRON, [(0, fore + 0.04), (0.019, fore + 0.04), (0.02, fore + 0.055), (0.019, fore + 0.07), (0, fore + 0.07)], n=14)
    nut.location = (-0.008, 0, 0)
    for t in range(7): K.box('knurl_%d' % t, TEETH, (0.003, 0.03, 0.026), (-0.008 + 0.0195 * math.cos(t * 0.9), 0.0195 * math.sin(t * 0.9) * 0.5, fore + 0.055))
    K.box('hook', IRON, (0.078, 0.022, 0.028), (0.026, 0, fore + 0.118), bevel=0.004)
    K.box('hook_lip', IRON, (0.012, 0.022, 0.03), (0.06, 0, fore + 0.1), bevel=0.003)
    for t in range(4): K.box('hook_tooth_%d' % t, TEETH, (0.006, 0.022, 0.006), (0.024 + t * 0.012, 0, fore + 0.101), rot=(0, -0.6, 0))
    return True


def b_tomahawk(K, mu):
    """a sporting-goods tomahawk: a hickory haft with a swell at the butt, black cord wrapped over the grip, the narrow bearded
    head with its edge ground bright toward the blow and a short back spike; the odd thing: the store's orange price tag still
    stuck to the haft below the head"""
    WOOD, CORD, HEAD, EDGE, TAG = ('clay_mustard', 1), ('cloth_black', 2), ('metal_painted', 1), ('chrome', 1), ('sodium', 3)
    back, fore = 0.08, 0.4; rr = lambda x: x * E().FAT
    K.lathe('haft', WOOD, [(0, -back), (rr(0.019), -back), (rr(0.0185), -back + 0.03), (rr(0.0145), 0.1), (rr(0.0145), fore + 0.03), (0, fore + 0.035)], n=10)
    E().tape_wrap(K, 'cord', CORD, rr(0.0165), -back + 0.025, 0.11, n=7)
    K.box('eye', HEAD, (0.04, 0.03, 0.06), (0.002, 0, fore), bevel=0.005)
    # the bearded blade: narrow at the eye, the edge dropping below it in a beard
    K.loft('blade', HEAD, [(0.02, fore - 0.022, fore + 0.024, 0.011, 0.011), (0.06, fore - 0.03, fore + 0.022, 0.006, 0.006),
                           (0.095, fore - 0.06, fore + 0.03, 0.0032, 0.0032)], axis='x')
    K.loft('edge', EDGE, [(0.093, fore - 0.06, fore + 0.03, 0.0034, 0.0034), (0.108, fore - 0.064, fore + 0.033, 0.0011, 0.0011)], axis='x')
    pk = K.loft('spike', HEAD, [(-0.075, fore - 0.002, fore + 0.002, 0.002, 0.002), (-0.035, fore - 0.01, fore + 0.01, 0.008, 0.008),
                                (-0.012, fore - 0.018, fore + 0.018, 0.012, 0.012)], axis='x')
    K.recalc(pk)
    K.box('tag', TAG, (0.002, 0.026, 0.018), (rr(0.0148), 0, fore - 0.09), bevel=0.001)
    return True


def b_slot_handle(K, mu):
    """the pull arm off a slot machine, held near its butt: the chrome rod, the red ball on its end, the black collar, and at the
    butt the bent mount plate with two sheared bolts where it was wrenched off the cabinet; the odd thing: a ring of old
    masking tape round the rod where somebody taped a sign to it once"""
    ROD, BALL, COLLAR, PLATE, TAPE = ('chrome', 1), ('clay_rust', 2), ('rubber', 1), ('metal_painted', 1), ('tape_masking', 2)
    back, fore = 0.06, 0.3; r = 0.0105 * E().FAT
    K.lathe('rod', ROD, [(0, -back + 0.02), (r, -back + 0.02), (r, fore), (r * 0.8, fore + 0.012), (0, fore + 0.012)], n=10)
    K.lathe('collar', COLLAR, [(0, fore - 0.02), (r * 1.5, fore - 0.02), (r * 1.5, fore + 0.005), (0, fore + 0.005)], n=10)
    K._clear(); K.bpy.ops.mesh.primitive_uv_sphere_add(radius=0.029, location=(0, 0, 0), segments=16, ring_count=10)
    b = K.P.put(K.bpy, K.bpy.context.active_object, 'ball', K.m(*BALL)); b.location = (0, 0, fore + 0.035)
    K.lathe('tape', TAPE, [(0, 0.16), (r * 1.18, 0.16), (r * 1.18, 0.185), (0, 0.185)], n=10)
    K.box('plate', PLATE, (0.05, 0.03, 0.012), (0.0, 0.0, -back + 0.012), rot=(0, 0.25, 0), bevel=0.003)
    K.box('lug', PLATE, (0.028, 0.026, 0.03), (0.0, 0.0, -back + 0.03), bevel=0.004)
    for k_, x in enumerate((-0.017, 0.017)): K.rod('bolt_%d' % k_, ROD, (x, 0, -back + 0.003), (x * 1.1, 0, -back - 0.012), 0.0042, 6)
    return True


def b_gift_shop_claymore(K, mu):
    """a castle casino's gift-shop hand-and-a-half sword, held in both hands: the right low on the cord-wrapped grip by the
    pommel, the left up by the guard; the wide crossguard with its turned-down ends, the long straight blade with a shallow
    fuller; one edge (+X) ground bright by whoever took it off the wall, the other still the shop's rounded dull; the odd
    thing: the gift shop's hang tag still looped on the guard"""
    WRAP, GUARD, STEEL, EDGE, TAG = ('rubber', 2), ('metal_painted', 1), ('tape_grey', 2), ('chrome', 1), ('tape_masking', 3)
    back, fore = 0.1, 1.1
    K.lathe('grip', WRAP, [(0, -back + 0.02), (0.017, -back + 0.02), (0.0175, 0.1), (0.0165, 0.24), (0, 0.24)], n=10)
    for k_ in range(9): K.lathe('cord_%d' % k_, WRAP, [(0, -0.06 + k_ * 0.034), (0.019, -0.06 + k_ * 0.034), (0.019, -0.05 + k_ * 0.034), (0, -0.05 + k_ * 0.034)], n=10)
    K.lathe('pommel', GUARD, [(0, -back - 0.03), (0.022, -back - 0.03), (0.028, -back - 0.005), (0.02, -back + 0.02), (0, -back + 0.02)], n=12)
    K.box('guard', GUARD, (0.25, 0.024, 0.022), (0, 0, 0.255), bevel=0.004)
    for s in (-1, 1): K.rod('quillon_%d' % (s > 0), GUARD, (s * 0.125, 0, 0.255), (s * 0.14, 0, 0.225), 0.011, 8)
    K.box('ricasso', STEEL, (0.05, 0.008, 0.04), (0, 0, 0.285), bevel=0.002)
    z0 = 0.3
    K.loft('blade', STEEL, [(z0, -0.026, 0.026, 0.0045, 0.0018), (z0 + 0.5, -0.023, 0.023, 0.004, 0.0016), (fore - 0.08, -0.018, 0.018, 0.0034, 0.0013),
                            (fore, -0.002, 0.002, 0.001, 0.001)])
    K.loft('edge', EDGE, [(z0 + 0.02, 0.02, 0.0275, 0.0018, 0.0008), (z0 + 0.5, 0.0175, 0.0245, 0.0016, 0.0007), (fore - 0.08, 0.013, 0.0195, 0.0013, 0.0006)])
    K.loft('fuller', WRAP, [(z0 + 0.03, -0.005, 0.005, 0.0047, 0.0047), (z0 + 0.45, -0.004, 0.004, 0.0042, 0.0042)])
    K.rod('string', TAG, (0.07, 0.013, 0.255), (0.085, 0.02, 0.2), 0.0015, 4)
    K.box('tag', TAG, (0.03, 0.002, 0.045), (0.09, 0.022, 0.17))
    E().OBJECTS['gift_shop_claymore']['left_x'] = 0.2
    return True


def b_tow_chain(K, mu):
    """a two-handed flail out of a tow truck's chain: a steel pipe handle with both grips taped, a hole drilled through its head
    and the first link through it, a length of gold grade 70 transport chain hanging, the grab hook still on its end"""
    PIPE, CHAIN, TAPE, HOOK, RUST = ('metal_painted', 1), ('clay_mustard', 3), ('rubber', 1), ('metal_painted', 2), ('clay_rust', 1)
    back, fore = 0.06, 0.55; r = 0.016 * E().FAT
    K.lathe('handle', PIPE, [(0, -back), (r * 1.1, -back), (r * 1.1, -back + 0.02), (r, -back + 0.02), (r, fore), (r * 1.1, fore), (r * 1.1, fore + 0.02), (0, fore + 0.02)], n=10)
    E().tape_wrap(K, 'grip', TAPE, r * 1.12, -0.05, 0.1, n=5)
    E().tape_wrap(K, 'grip_left', TAPE, r * 1.12, 0.28, 0.42, n=5)
    pts = C.hang_path(mu, fore + 0.02, 0.72, sway=0.05, n=12)
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        K.CI.link(K.bpy, 'hang_%d' % i, K.m(*(RUST if i in (4, 9) else CHAIN)), tuple((a + b) / 2), tuple(b - a), i % 2 == 1, major=0.03, minor=0.0085)
    end = pts[-1]; d = (pts[-1] - pts[-2]).normalized(); side = mu.Vector((1, 0, 0))
    K.rod('hang_end_eye', HOOK, tuple(end), tuple(end + d * 0.03), 0.012, 8)
    hook = [end + d * 0.03, end + d * 0.08, end + d * 0.105 + side * 0.02, end + d * 0.09 + side * 0.045, end + d * 0.06 + side * 0.045]
    K.tube('hang_end_hook', HOOK, [tuple(p) for p in hook], 0.009, verts=6)
    E().OBJECTS['tow_chain']['left_x'] = 0.35
    return True


def b_ditch_blade(K, mu):
    """a Kaiser ditch blade off a public works yard: a long ash handle, its steel ferrule, the double-edged blade curving toward
    the blow like a brush hook, painted black and ground bright on both edges; the odd thing: the tool room's band of yellow
    paint round the handle, and a county number scratched beside it"""
    WOOD, FERRULE, BLADE, EDGE, BAND = ('clay_mustard', 1), ('metal_painted', 0), ('metal_painted', 0), ('chrome', 1), ('clay_mustard', 3)
    back, fore = 0.06, 0.82; rr = lambda x: x * E().FAT
    K.lathe('handle', WOOD, [(0, -back), (rr(0.019), -back), (rr(0.0185), -back + 0.03), (rr(0.016), 0.2), (rr(0.0165), fore), (0, fore)], n=10)
    K.lathe('band', BAND, [(0, 0.55), (rr(0.0172), 0.55), (rr(0.0172), 0.6), (0, 0.6)], n=10)
    E().tape_wrap(K, 'grip', ('rubber', 1), rr(0.018), -0.045, 0.09, n=4)
    K.lathe('ferrule', FERRULE, [(0, fore - 0.06), (rr(0.019), fore - 0.06), (rr(0.02), fore + 0.04), (0.012, fore + 0.07), (0, fore + 0.07)], n=10)
    # the blade: 0.3 m, curving toward +X, double-edged; sections along z with the curve as an x offset
    secs, e1, e2 = [], [], []
    for i in range(7):
        t = i / 6.0; z = fore + 0.06 + 0.3 * t; c = 0.09 * t * t; w = 0.036 * (1 - 0.15 * t) if i < 6 else 0.003
        secs.append((z, c - w, c + w, 0.003, 0.0012))
        if 0 < i < 6:
            e1.append((z, c + w - 0.006, c + w + 0.0006, 0.0012, 0.0005)); e2.append((z, c - w - 0.0006, c - w + 0.006, 0.0005, 0.0012))
    K.loft('blade', BLADE, secs); K.loft('edge', EDGE, e1); K.loft('edge_back', EDGE, e2)
    E().OBJECTS['ditch_blade']['left_x'] = 0.45
    return True


# ------------------------------------------------------------------------------------------------ model (bpy)
def do_model(names):
    register(); C.do_model(names)


# ------------------------------------------------------------------------------------------------ wire (python3): COOK's, on m6/s6/t5
def do_wire(names):
    """the source: each a prop (its model), on its layer, held the way its like is held; a one-hander's row pointed at it, a
    two-handed family named for its class (two_by_class), so every two-handed row of the class draws it"""
    register()
    S = json.load(open(SRC))
    one = [n for n in names if NEW[n]['hands'] == 1]; two = [n for n in names if NEW[n]['hands'] == 2]
    for n in names:
        w = NEW[n]; p = dict(say="WEAPONS' %s (rule 424): %s" % (w['name'], w['say']), back=w['back'], fore=w['fore'])
        if w['hands'] == 2: p['two'] = True
        S['props'][n] = p
        like = w['like']
        if like in S.get('hold_by_prop', {}): S['hold_by_prop'][n] = dict(S['hold_by_prop'][like])
        if w.get('hang'): S['hanging'] = sorted(set(S.get('hanging', ['chain'])) | {n})
        if w['row']: S['by_row'][w['row']] = n
        else: S['two_by_class'][w['cls']] = n
    M2, S2, T2 = S['layers']['m2'], S['layers']['s2'], S['layers']['t2']
    if one:
        m6 = S['layers'].setdefault('m6', dict(props=[], clips=list(M2['clips']), keys=dict(M2['keys']), only={}))
        s6 = S['layers'].setdefault('s6', dict(props=[], clips=list(S2['clips']), keys=dict(S2['keys']), only={}))
        for n in one:
            if n not in m6['props']: m6['props'].append(n)
            if n not in s6['props']: s6['props'].append(n)
            m6['only'][n] = [c for c in M2['clips'] if c != 'PAim']
            s6['only'][n] = list(S2['only']['chain'])
    if two:
        t5 = S['layers'].setdefault('t5', dict(props=[], clips=list(T2['clips']), keys=dict(T2['keys']), only={}))
        for n in two:
            if n not in t5['props']: t5['props'].append(n)
            t5['only'][n] = list(T2['only']['fire_axe'])
    for ly in MY_LAYERS:
        if ly in S['layers'] and ly not in S['layers_ready']: S['layers_ready'].append(ly)
    S['every_weapon_shows'] = ("WEAPONS 11/7 (rule 424, ask lines 489 and 490, tools/bohemia_weapons_every_weapon_shows_11_7_26.py): the two-handed "
                               "sword, flail and cleaver had no picture, so their twelve rows swung from empty hands; each class has its own "
                               "model now (two_by_class), and six new one-handers are their own models; YOU's renders on layers m6, s6 and t5, "
                               "every other man holding them moved by the difference of their feet.")
    json.dump(S, open(SRC, 'w'), indent=1)
    print('WIRED', names)


def layers_of(n, S=None):
    S = S or json.load(open(SRC))
    return [ly for ly in MY_LAYERS if n in S['layers'].get(ly, {}).get('props', [])]


# ------------------------------------------------------------------------------------------------ render (bpy, ANIMATION's)
def do_render(names, workers=4):
    import bohemia_animation_melee_in_hand as A
    import time
    jobs = [(n, ly) for n in names for ly in layers_of(n) if not A.props_done('you', ly, n)]
    py = sys.executable; procs = []; tries = {}
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // workers)))
    while jobs or procs:
        while jobs and len(procs) < workers:
            n, ly = jobs.pop(0)
            procs.append(((n, ly), subprocess.Popen([py, os.path.join(ROOT, 'tools/bohemia_animation_melee_in_hand.py'), '_props', 'you', n, '', '', ly],
                                                    cwd=ROOT, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)))
        time.sleep(2)
        for j, p in list(procs):
            if p.poll() is not None:
                procs.remove((j, p))
                ok = A.props_done('you', j[1], j[0]); tries[j] = tries.get(j, 0) + 1
                print('RENDER', j, 'done' if ok else 'AGAIN', flush=True)
                if not ok and tries[j] < 4: jobs.append(j)


# ------------------------------------------------------------------------------------------------ pack (python3): COOK's pack on m6/s6/t5
def do_pack(names):
    """COOK's pack (ANIMATION's cut, palette and shelf, line for line), the layers named here; then the index: a one-hander's row
    and a two-handed family's class point at the model only once YOU's pictures of it are packed"""
    import numpy as np
    from PIL import Image
    import bohemia_animation_melee_in_hand as A
    register()
    S = json.load(open(SRC))
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']
    PAL = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'))); RIM = tuple(FR['rim'])
    thr = int(G['alpha_threshold'])
    d = os.path.join(ROOT, A.RENDERS, 'you'); fl = FR['looks']['you']
    rj = json.load(open(os.path.join(d, 'rig.json'))); cx0, cy0 = rj['crop_box_px'][:2]
    fx0, fy0 = cx0 + rj['ground_px'][0] - fl['foot'][0], cy0 + rj['ground_px'][1] - fl['foot'][1]

    def to_pal(a, P, hue=4.0):
        u, inv = np.unique(a[..., :3].reshape(-1, 3), axis=0, return_inverse=True)
        def ycc(x):
            x = x.astype(np.float64); Y = 0.299 * x[..., 0] + 0.587 * x[..., 1] + 0.114 * x[..., 2]
            return np.stack([Y, (x[..., 2] - Y) * 0.564, (x[..., 0] - Y) * 0.713], -1)
        dd = (((ycc(u)[:, None, :] - ycc(P)[None, :, :]) ** 2) * np.array([1.0, hue, hue])).sum(2)
        a[..., :3] = P[dd.argmin(1)][inv.reshape(-1)].reshape(a.shape[:2] + (3,)).astype(np.uint8); return a

    def ppal_of(prop):
        mj = os.path.join(ROOT, 'records/target/cook_every_item/measured_%s.json' % prop)
        roles = [m.split()[0] for m in json.load(open(mj)).get('materials', []) if m.split()[0] in PAL]
        return np.array(sorted(set(tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4)) for r in roles for h in PAL[r]['ramp'])), np.int32)

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

    yp = os.path.join(RIGM, 'you.json'); Y = json.load(open(yp))
    sigs = json.load(open(os.path.join(d, 'props', 'models.json')))
    for ly in MY_LAYERS:
        if ly not in S['layers']: continue
        props = [p_ for p_ in S['layers'][ly]['props'] if A.props_done('you', ly, p_)]
        if not props: continue
        pimgs = []; by = {}
        for prop in props:
            P_ = ppal_of(prop)
            for clip, j, f, fn in A.prop_files(ly, prop, S):
                a_ = np.asarray(Image.open(os.path.join(d, 'props', fn)).convert('RGBA'))
                r = cut(a_) if (a_[..., 3] > thr).sum() >= A.SPECK else None
                ix = None
                if r is not None: ix = len(pimgs); pimgs.append((to_pal(r[0], P_), r[1] - fx0, r[2] - fy0))
                nk = len(S['hold'][clip])
                by.setdefault(prop, {}).setdefault(clip, dict(l=ly, k=[[None] * 8 for _ in range(nk)]))['k'][j][C.FIGHT_DIRS.index(f)] = ix
        pim, prects = shelf(pimgs, 2048)
        assert pim.size[1] <= 1024, 'layer %s packs to %s: over 2048 x 1024 (rule 173), split it' % (ly, pim.size)
        fn_ = 'you_props_%s.webp' % ly; pim.save(os.path.join(RIGM, fn_), 'WEBP', lossless=True, quality=100, method=6)
        Y['props']['sheets'][ly] = dict(file=fn_, size=list(pim.size), cells=prects)
        for prop, cl in by.items():
            old = Y['props']['by'].get(prop, {})
            old = {c_: v_ for c_, v_ in old.items() if v_['l'] != ly}
            old.update(cl); Y['props']['by'][prop] = old
            Y['props']['models']['%s@%s' % (prop, ly)] = A.sig_of(sigs, prop, ly)
        if ly not in Y['layers']: Y['layers'].append(ly)
        print('PACKED you', ly, pim.size, len(pimgs), 'cells', props, flush=True)
    json.dump(Y, open(yp, 'w'), separators=(',', ':'))
    I = json.load(open(os.path.join(RIGM, 'rig_melee.json')))
    live = [ly for ly in MY_LAYERS if ly in Y['props']['sheets']]
    for ly in live:
        if ly not in I['layers_ready']: I['layers_ready'].append(ly)
    ready = set(p_ for p_ in NEW if p_ in Y['props']['by'])
    I['props'] = sorted(set(I['props']) | ready)
    for n in ready:
        w = NEW[n]
        if w['row']: I['by_row'][w['row']] = n
        else: I['two_by_class'][w['cls']] = n
    I['thrust'] = S['thrust']
    I['every_weapon_shows'] = S.get('every_weapon_shows')
    json.dump(I, open(os.path.join(RIGM, 'rig_melee.json'), 'w'), separators=(',', ':'))
    print('INDEX live', I['layers_ready'], 'ready', sorted(ready), 'two_by_class', I['two_by_class'])


def do_manifest(names):
    """reference/models/bohemia/items.json: each its own entry; a family names every two-handed row of its class"""
    register()
    import hashlib
    mp = os.path.join(ROOT, 'reference/models/bohemia/items.json'); M = json.load(open(mp))
    W = json.load(open(os.path.join(ROOT, 'records/target/bb/weapons.json')))['rows']
    for n in names:
        w = NEW[n]; g = os.path.join(ROOT, 'reference/models/bohemia/item_%s.glb' % n)
        if not os.path.exists(g): continue
        rows = [w['row']] if w['row'] else [r['id'] for r in W if r['class'] == w['cls'] and r.get('hands') == 2]
        for k, e in M['items'].items():
            if k != n: e['rows'] = [r for r in e.get('rows', []) if r not in rows]
        meas = json.load(open(os.path.join(ROOT, 'records/target/cook_every_item/measured_%s.json' % n)))
        e = dict(glb='item_%s.glb' % n, kind='held', name=w['name'].replace('the ', ''), say=w['say'],
                 made='WEAPONS 11/7 (tools/bohemia_weapons_every_weapon_shows_11_7_26.py)', rows=rows,
                 sha1=hashlib.sha1(open(g, 'rb').read()).hexdigest(), hands=w['hands'], measured=meas, was=w['was'] or 'nothing (empty hands)')
        if 'left_x' in meas: e['left_x'] = meas['left_x']
        M['items'][n] = e
    json.dump(M, open(mp, 'w'), indent=1)
    print('MANIFEST', len(M['items']), 'items')


# ------------------------------------------------------------------------------------------------ fold (python3): rule 424(c)
FOLD = {   # rule 424(c), Paolo 11/7: 'a one-handed variation, a two-handed variation... a pretty cheap escape route'
    'one': {'pickaxe': 'framing_hammer', 'military_pick': 'framing_hammer', 'warhammer': 'framing_hammer'},
    'one_class': {'hammer': 'framing_hammer'},
    'two': {'two_handed_spiked_mace': 'sledge', 'two_handed_mace': 'sledge', 'two_handed_flanged_mace': 'sledge', 'polemace': 'sledge', 'goedendag': 'sledge'},
    'two_class': {'mace': 'sledge'},
}


def do_fold():
    """424(c) NO CHEAP ROUTE: a picture held both one-handed and two-handed is one object at two sizes. MEASURED: two such pairs,
    the pipe (every one-handed mace, and the five two-handed maces swung in both fists) and the sledge (the three one-handed
    picks and war hammer swung in one fist, and every two-handed hammer). Folded each to the real object it is: the pipe stays
    the one-handed club, the sledgehammer the two-handed one (a two-handed mace is a sledge in a dead city); a one-handed hammer
    or pick is the framing hammer, a real one-handed hammer. The index and the source both."""
    S = json.load(open(SRC)); I = json.load(open(os.path.join(RIGM, 'rig_melee.json')))
    for D in (S, I):
        D['by_row'].update(FOLD['one']); D['by_class'].update(FOLD['one_class'])
        D['two_by_row'].update(FOLD['two']); D['two_by_class'].update(FOLD['two_class'])
        D['no_cheap_route'] = ("WEAPONS 11/7 (rule 424(c), ask line 515): no picture is held both one-handed and two-handed; the pipe is one-handed "
                               "only, the sledge two-handed only, a one-handed hammer or pick the framing hammer, a two-handed mace the sledge")
    json.dump(S, open(SRC, 'w'), indent=1)
    json.dump(I, open(os.path.join(RIGM, 'rig_melee.json'), 'w'), separators=(',', ':'))
    one = set(I['by_row'].values()) | set(v for k, v in I['by_class'].items() if k != 'why') | set(I.get('sling_by_row', {}).values())
    two = set(I['two_by_row'].values()) | set(v for k, v in I['two_by_class'].items() if k != 'why')
    print('FOLDED; pictures held both ways now:', sorted(one & two) or 'none')


# ------------------------------------------------------------------------------------------------ the VOTE card (python3)
PROOF = os.path.join(ROOT, 'records/target/weapons_every_weapon_shows')


def do_sheet(names):
    """the proof's turns (the shipped fight, his phone, YOU turned through the eight facings standing with it) into one moving
    sheet: a row a weapon, BEFORE left (a two-handed family: empty hands; a new one-hander: the family picture its row would have
    fallen to) and NOW right, every row in step, 300 ms a facing; and the card's first picture"""
    from PIL import Image, ImageDraw
    D = os.path.join(PROOF, 'proof'); k = 0.34
    def turns(n, mode):
        ims = [Image.open(os.path.join(D, '%s_%s_turn%d.png' % (n, mode, f))).convert('RGB') for f in range(8)]
        return [im.resize((int(im.width * k), int(im.height * k)), Image.BOX) for im in ims]
    cells = [(n, turns(n, 'before'), turns(n, 'after')) for n in names]
    cw = max(max(i.width for i in b + a) for _, b, a in cells); ch = max(max(i.height for i in b + a) for _, b, a in cells)
    lab, gap = 16, 6
    cols = 3; W = cols * (cw * 2 + gap * 3); rows_ = -(-len(cells) // cols); H = rows_ * (ch + lab + gap) + gap
    seq = []
    for f in range(8):
        S = Image.new('RGB', (W, H), (24, 22, 20)); d = ImageDraw.Draw(S)
        for i, (n, bf, af) in enumerate(cells):
            x0 = (i % cols) * (cw * 2 + gap * 3); y = gap + (i // cols) * (ch + lab + gap); w = NEW[n]
            was = 'EMPTY HANDS' if not w['row'] else 'AS THE ' + w['was'].replace('_', ' ').upper()
            d.text((x0 + gap, y + 2), '%s  WAS: %s' % (w['name'].replace('the ', '').upper(), was), fill=(200, 190, 170))
            d.text((x0 + gap * 2 + cw, y + 2) if False else (x0 + gap * 2 + cw, y + 2), 'NOW', fill=(240, 200, 120))
            for im, xo in ((bf[f], x0 + gap), (af[f], x0 + gap * 2 + cw)):
                S.paste(im, (xo + (cw - im.width) // 2, y + lab + ch - im.height))
        seq.append(S)
    sp = os.path.join(PROOF, 'sheet.webp'); seq[0].save(sp, 'WEBP', save_all=True, append_images=seq[1:], duration=[300] * 8, loop=0, quality=80, method=6)
    print('SHEET', sp, seq[0].size, os.path.getsize(sp))
    return sp


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    args = [a for a in sys.argv[2:] if not (cmd == 'render' and a.isdigit())]
    num = [int(a) for a in sys.argv[2:] if cmd == 'render' and a.isdigit()]
    if cmd == 'model': do_model(names_of(args)); os._exit(0)
    elif cmd == 'wire': do_wire(names_of(args))
    elif cmd == 'render': do_render(names_of(args), num[0] if num else 4)
    elif cmd == 'pack': do_pack(names_of(args))
    elif cmd == 'alone': register(); C.do_alone(names_of(args)); os._exit(0)
    elif cmd == 'icon-render': register(); C.do_icon_render(names_of(args)); os._exit(0)
    elif cmd == 'shelf': register(); C.do_shelf([n for n in names_of(args) if NEW[n]['row']])
    elif cmd == 'manifest': do_manifest(names_of(args))
    elif cmd == 'sheet': do_sheet(names_of(args))
    elif cmd == 'fold': do_fold()
    else: sys.exit(__doc__)
