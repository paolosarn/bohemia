#!/usr/bin/env python3
"""BOHEMIA -- COOK [every weapon its own] (rule 337, ask line 344; Paolo 11/3, angry and right: 'you build the bosses like
shit, we don't have enough assets, and you're not creating assets, weapons, armor, the vibe, nothing').

MEASURED FIRST: the two armory rounds (records/BOHEMIA_ARMORY_TWELVE_GUNS_AND_BLADES_AND_NINE_ARMOURS_11_2_26.md and
records/BOHEMIA_ARMORY_THE_WHIP_AND_THE_POOL_POLE_SPEAR_11_2_26.md) added 19 weapons as DATA only: in a man's hands each was
drawn as its family's model (slices/rig_melee by_row): the pool pole spear as the rebar spear, all four whips as the chain,
the crowbar as the pipe, the bike-lock chain as the chain, the box cutter as the cleaver, the framing hammer as the sledge,
the broom bayonet as the rebar spear, the katana as the machete (by its class), the maul as the fire axe, the halberd as the
pole hook. Both records say 'OWED: own 3D models'. This tool is that debt paid.

THE WAY (no second renderer, nothing drawn by hand):
  1. MODEL: each weapon is a glb at real size in the rig's held frame (reference/models/bohemia/item_<name>.glb: the origin
     the middle of the right hand's grip, the haft along +X, the edge toward +Z), built with COOK's every-item kit
     (tools/bohemia_cook_a_model_for_every_item_10_25_26.py Kit, build, tape_wrap, imported; its builders are added to that
     module so its model() writes the glb and the measured json exactly as it did for the first 24). Every base colour a
     step of records/target/BOHEMIA_STYLE_PALETTE.json, five materials at most. A whip's thong, a cord, a chain is built as
     'hang_' pieces ending in a 'hang_end' piece, so ANIMATION's prop render hangs it from the handle's end, trails it on
     the wind and throws it out on the blow, the way COOK's chain hangs (the source's 'hanging' list).
  2. IN HIS HANDS: ANIMATION's own tool renders it (tools/bohemia_animation_melee_in_hand.py render_props, imported and
     called, never edited for the picture): YOU's posed body, the master rig's camera, sun and stretch read back from his
     rig.json, his body a holdout, every key of every clip it is held on, eight facings. New layers in the source
     (records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json): 'm4' the one-handers (the m2 clips: the spears thrust),
     's4' the same with a shield on his arm (the s2 clips), 't4' the two-handers (the t2 clips).
  3. EVERY MAN: a named look that draws its own things gets props_ref 'you' (the fight's own fallback, meleeDraw: a thing off
     another man's sheet sits moved by the difference of their feet; 23 cast and faction looks already hold YOU's things
     past the first layer, measured by ANIMATION 10/25 at one pixel at the edges); a rolled man falls through his gang to
     YOU. So one set of renders, YOU's, puts each weapon in every hand the fight draws.
  4. THE ROW: slices/rig_melee by_row / two_by_row point the armory row at its own model, never its family's.

    <bpy> tools/bohemia_cook_every_weapon_its_own_11_3_26.py model <names|batch1|batch2|all>
    python3 tools/bohemia_cook_every_weapon_its_own_11_3_26.py wire <names|batch1|...>     the source's props, layers, rows
    <bpy> tools/bohemia_cook_every_weapon_its_own_11_3_26.py render <names|...> [workers]  in YOU's hands, every layer
    python3 tools/bohemia_cook_every_weapon_its_own_11_3_26.py pack <names|...>          YOU's sheets, the index, the refs
    <bpy> tools/bohemia_cook_every_weapon_its_own_11_3_26.py alone <names|...>           side-on and eight facings, for the
        sheet and the icon (records/target/cook_every_weapon/alone_<name>/)
    python3 tools/bohemia_cook_every_weapon_its_own_11_3_26.py sheet <names|...>         the compare sheet per weapon

REUSE CHECK: the kit, the palette, the measured json and the manifest are COOK's every-item tool's; the in-hand render and
its frame are ANIMATION's melee tool's and DIRECTION's master rig's; the pack's cut, palette snap and shelf are copied from
ANIMATION's pack() line for line (it rebuilds every look from renders that live only in the container that made them, so it
cannot be called for one look's new layer). No bank opened: nothing in banks/ is a 3D model.
REFERENCE CHECK (the 9/4 standing law): each weapon is judged on YOU in the fight's own pixels beside the family model it
replaces and his own fight-sheet cell (the sheet), and against the real thing's size: a pool skimmer pole 8 to 16 ft, a
16-gauge orange extension cord, an 18 V drill battery (11 x 8 x 6 cm), 12.5-gauge two-strand barbed wire with four-point
barbs every 5 in, an 8 ft bullwhip with a 10 in handle. Analog horror AH-01: scavenged, taped, rusted, mended. Battle
Brothers draws every weapon its own sprite in the man's hand: that is the study, no other reference game.
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
SRC = os.path.join(ROOT, 'records/target/animation/BOHEMIA_MELEE_AND_SHIELD.json')
OUTD = os.path.join(ROOT, 'records/target/cook_every_weapon')
RIGM = os.path.join(ROOT, 'slices/rig_melee')
FIGHT_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']

# name: the armory row it is (records/target/bb/armory.json), the model it was drawn as, how it is held
WEAPONS = {
    # ---- batch 1: the five newest (ARMORY 2, 11/2)
    'pool_pole_spear': dict(row='pool_pole_spear', was='rebar_spear', hands=1, name='the pool pole spear', like='rebar_spear',
                            back=0.62, fore=1.3, thrust=True,
                            say='a pool skimmer pole, its teal cam-lock collar, a kitchen knife taped into the clip end'),
    'extension_cord': dict(row='extension_cord', was='chain', hands=1, name='the extension cord', like='chain', hang=True, back=0.05, fore=0.12,
                           say='an orange garage cord wound round his fist, the rest hanging to its three-prong plug'),
    'live_wire': dict(row='live_wire', was='chain', hands=1, name='the live wire', like='chain', hang=True, back=0.16, fore=0.13,
                      say='a drill battery taped on a pipe stub for a handle, a switch, black cable to its stripped copper end'),
    'barbed_wire': dict(row='barbed_wire', was='chain', hands=1, name='the barbed wire', like='chain', hang=True, back=0.06, fore=0.2,
                        say='a taped broom stub, a rope tied on, two strands of rusted barbed wire twisted onto the rope'),
    'rodeo_bullwhip': dict(row='rodeo_bullwhip', was='chain', hands=1, name='the rodeo bullwhip', like='chain', hang=True, back=0.05, fore=0.22,
                           say='a plaited leather bullwhip, its wrist loop and brass ring, the thong down to the fall and the cracker'),
}
WEAPONS.update({
    # ---- batch 2: the melee of the last armory round (ARMORY 11/2)
    'crowbar': dict(row='crowbar', was='pipe', hands=1, name='the crowbar', like='pipe', back=0.12, fore=0.62,
                    say='a red wrecking bar gone to bare steel where it is held, the gooseneck claw, the flat chisel at the butt'),
    'bike_lock_chain': dict(row='bike_lock_chain', was='chain', hands=1, name='the bike-lock chain', like='chain', hang=True, back=0.06, fore=0.13,
                            say='a square-link bike chain in its torn black sleeve, bunched and taped for a grip, the lock barrel with its key'),
    'box_cutter': dict(row='box_cutter', was='cleaver', hands=1, name='the box cutter', like='cleaver', back=0.05, fore=0.15,
                       say='a yellow heavy-duty utility knife, the blade run all the way out, the body wound in black tape'),
    'framing_hammer': dict(row='framing_hammer', was='sledge', hands=1, name='the framing hammer', like='sledge', back=0.08, fore=0.38,
                           say='a hickory framing hammer, the milled face, the straight rip claw with a bent nail caught in it'),
    'broom_bayonet': dict(row='broom_bayonet', was='rebar_spear', hands=1, name='the broom bayonet', like='rebar_spear', back=0.5, fore=0.78, thrust=True,
                          say='a painted broom handle, an old bayonet hose-clamped to its end, the paint worn to wood at the grip'),
    'pawn_shop_katana': dict(row='pawn_katana', was='machete', hands=1, name='the pawn-shop katana', like='machete', back=0.1, fore=0.86,
                             say='a wall-hanger katana, its wrapped grip, the round guard, the pawn tag still tied on its string'),
    'splitting_maul': dict(row='splitting_maul', was='fire_axe', hands=2, name='the splitting maul', like='fire_axe', back=0.06, fore=0.8,
                           say='an eight-pound maul, the wedge ground bright, the sledge face behind it, the red paint mostly gone'),
    'sign_post_halberd': dict(row='sign_post_halberd', was='pole_hook', hands=2, name='the sign-post halberd', like='pole_hook', back=0.65, fore=1.2, thrust=True,
                              say='a punched steel sign post, a STOP sign cut into an axe blade and bolted on, the post cut to a spike'),
})
BATCH = {'batch1': ['pool_pole_spear', 'extension_cord', 'live_wire', 'barbed_wire', 'rodeo_bullwhip'],
         'batch2': ['crowbar', 'bike_lock_chain', 'box_cutter', 'framing_hammer', 'broom_bayonet', 'pawn_shop_katana', 'splitting_maul', 'sign_post_halberd']}


def names_of(args):
    out = []
    for a in args:
        if a == 'all': out += list(WEAPONS)
        elif a in BATCH: out += BATCH[a]
        else: out.append(a)
    return [n for i, n in enumerate(out) if n not in out[:i]]


def E():
    import bohemia_cook_a_model_for_every_item_10_25_26 as M
    for n, w in WEAPONS.items():
        M.OBJECTS.setdefault(n, dict(kind='held', name=w['name'], hands=w['hands'], say=w['say'],
                                     made='COOK 11/3 (tools/bohemia_cook_every_weapon_its_own_11_3_26.py)'))
        setattr(M, 'b_' + n, globals()['b_' + n])
    return M


# ------------------------------------------------------------------------------------------------ the builders (bpy)
# built standing up: the haft along +Z from the fist (z = 0 the middle of the grip), the edge toward +X; build() lays it
# into the held frame. 'hang_' pieces leave the handle at z = fore and run on up +Z; the last is 'hang_end'.
def hang_path(mu, z0, length, sway=0.06, n=10, curl=0.0):
    """a hanging line's points: leaving the handle's end along +Z, a gentle S across X (a cord or a thong never hangs dead
    straight), curl bends its last third over (a whip's fall)"""
    pts = []
    for i in range(n + 1):
        t = i / n
        x = sway * math.sin(t * math.pi * 1.6) * (0.4 + t) + curl * max(0.0, t - 0.66) ** 2 * 9
        pts.append(mu.Vector((x, 0.012 * math.sin(t * 7.0), z0 + length * t)))
    return pts


def hang_tube(K, mat, pts, r0, r1=None, verts=8, alt=None):
    """the line as rods named hang_<i> (alt: every other rod in a second material, a plait's bands)"""
    r1 = r0 if r1 is None else r1
    n = len(pts) - 1
    for i in range(n):
        r = r0 + (r1 - r0) * i / max(1, n - 1)
        K.rod('hang_%d' % i, alt if (alt and i % 2) else mat, tuple(pts[i]), tuple(pts[i + 1]), r, verts)
        if i:   # a ball at every bend, so the line never shows a gap where two rods meet
            K._clear(); K.bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=tuple(pts[i]), segments=verts, ring_count=max(4, verts // 2))
            o = K.P.put(K.bpy, K.bpy.context.active_object, 'hang_j_%d' % i, K.m(*mat)); o.location = tuple(pts[i])


def b_pool_pole_spear(K, mu):
    """a telescoping aluminium pool skimmer pole (the lower section thicker), the teal cam-lock collar where they meet, the
    grey end cap at the butt, and at the head the teal clip end with a kitchen knife's black handle pushed in and wound over
    in duct tape, the blade out along the pole, its edge ground bright; the odd thing: a second, older wrap of tape gone
    pale lower down, where the first knife sat"""
    ALU, TEAL, TAPE, STEEL, BLACK = ('tape_grey', 3), ('clay_teal', 3), ('tape_grey', 1), ('chrome', 1), ('rubber', 1)
    back, fore = 0.62, 1.22; rr = lambda x: x * E().FAT
    K.lathe('pole_low', ALU, [(0, -back), (rr(0.0165), -back), (rr(0.0165), 0.42), (0, 0.42)], n=12)
    K.lathe('pole_high', ALU, [(0, 0.40), (rr(0.0142), 0.40), (rr(0.0142), fore), (0, fore)], n=12)
    K.lathe('cap', BLACK, [(0, -back - 0.035), (rr(0.0185), -back - 0.035), (rr(0.0185), -back + 0.025), (0, -back + 0.025)], n=12)
    K.lathe('collar', TEAL, [(0, 0.38), (rr(0.022), 0.38), (rr(0.024), 0.41), (rr(0.02), 0.455), (0, 0.455)], n=12)
    K.box('cam', TEAL, (0.018, 0.012, 0.05), (rr(0.024), 0, 0.42), bevel=0.003)
    # the clip end: a flattened teal socket the knife's handle is jammed into
    K.lathe('clip', TEAL, [(0, fore - 0.03), (rr(0.0175), fore - 0.03), (rr(0.019), fore + 0.02), (rr(0.017), fore + 0.06), (0, fore + 0.06)], n=12)
    K.box('handle', BLACK, (0.024, 0.016, 0.12), (0, 0, fore + 0.09), bevel=0.004)
    E().tape_wrap(K, 'tape', TAPE, rr(0.0205), fore - 0.04, fore + 0.13, n=7)
    E().tape_wrap(K, 'old_tape', TAPE, rr(0.0172), fore - 0.26, fore - 0.17, n=3)
    # the chef's knife: spine on -X, belly and edge toward +X, to the point
    z0 = fore + 0.15; L = 0.21
    K.loft('blade', STEEL, [(z0, -0.012, 0.034, 0.003, 0.0012), (z0 + L * 0.55, -0.012, 0.03, 0.0026, 0.001),
                            (z0 + L * 0.85, -0.008, 0.016, 0.0018, 0.0008), (z0 + L, -0.002, 0.002, 0.0008, 0.0006)])
    K.loft('edge', ALU, [(z0, 0.03, 0.036, 0.0012, 0.0006), (z0 + L * 0.55, 0.026, 0.032, 0.001, 0.0005),
                                      (z0 + L * 0.85, 0.012, 0.018, 0.0008, 0.0004)])
    return True


def b_extension_cord(K, mu):
    """an orange garage extension cord: four turns of it wound round his fist (the grip), the socket end tucked out the back
    of his hand, the rest hanging in a loose S to the three-prong plug, its two flat brass blades and the round ground pin;
    the odd thing: a split in the jacket mended with grey tape near the plug"""
    CORD, PLUG, BRASS, TAPE = ('sodium', 2), ('sodium', 1), ('clay_mustard', 3), ('tape_grey', 2)
    fore = 0.12; r = 0.0095
    for k in range(4):   # the turns round his fist, round the grip's axis
        z = -0.03 + k * 0.045
        K.lathe('turn_%d' % k, CORD, [(0, z - r), (0.03, z - r), (0.034, z), (0.03, z + r), (0, z + r)], n=12)
    K.rod('wrap', CORD, (0.0, 0.0, -0.05), (0.0, 0.0, fore), r * 1.4, 8)
    K.box('socket', PLUG, (0.045, 0.034, 0.055), (0.0, 0.0, -0.085), bevel=0.008)
    for s in (-1, 1): K.box('slot_%d' % (s > 0), ('rubber', 0), (0.004, 0.012, 0.004), (s * 0.011, 0.0, -0.113))
    pts = hang_path(mu, fore, 0.74, sway=0.07, n=10)
    hang_tube(K, CORD, pts, r * 1.3)
    K.lathe('hang_mend', TAPE, [(0, 0.0), (r * 1.9, 0.0), (r * 1.9, 0.05), (0, 0.05)], n=10)
    mend = [o for o in K.bpy.context.scene.objects if o.name.startswith('hang_mend')][-1]
    mend.location = tuple(pts[7]); mend.rotation_euler = mu.Vector((0, 0, 1)).rotation_difference(pts[8] - pts[7]).to_euler()
    end = pts[-1]; d = (pts[-1] - pts[-2]).normalized()
    K.box('hang_end_plug', PLUG, (0.045, 0.034, 0.05), tuple(end + d * 0.03), bevel=0.008)
    for s in (-1, 1): K.box('hang_end_blade_%d' % (s > 0), BRASS, (0.004, 0.012, 0.03), tuple(end + d * 0.07 + mu.Vector((s * 0.011, 0, 0))))
    K.rod('hang_end_pin', BRASS, tuple(end + d * 0.05 + mu.Vector((0, 0.01, 0))), tuple(end + d * 0.085 + mu.Vector((0, 0.01, 0))), 0.0035, 6)
    return True


def b_live_wire(K, mu):
    """a cordless drill's battery pack for a pommel, taped onto a stub of pipe that is the grip, a toggle switch on a masking
    tape label, the heavy black cable out of the pipe's end through a red-taped joint and hanging to its stripped end, the
    copper strands splayed; the odd thing: a second battery's dead husk taped on the side for weight"""
    PIPE, YELLOW, BLACK, RED, COPPER = ('metal_painted', 1), ('clay_mustard', 3), ('rubber', 1), ('clay_rust', 2), ('clay_rust', 3)
    fore = 0.13; r = 0.0175
    K.lathe('grip', PIPE, [(0, -0.07), (r, -0.07), (r, fore), (r * 1.25, fore), (r * 1.25, fore + 0.02), (0, fore + 0.02)], n=12)
    E().tape_wrap(K, 'grip_tape', BLACK, r * 1.12, -0.05, 0.1, n=6)
    # the battery: its slide rail on the pipe, the pack behind his fist
    K.box('battery', YELLOW, (0.08, 0.06, 0.11), (0.0, 0.0, -0.13), bevel=0.01)
    K.box('battery_base', BLACK, (0.086, 0.066, 0.03), (0.0, 0.0, -0.195), bevel=0.006)
    K.box('husk', BLACK, (0.03, 0.05, 0.09), (-0.05, 0.0, -0.12), bevel=0.006)
    K.box('switch_plate', RED, (0.012, 0.03, 0.04), (r * 1.1, 0.0, 0.03), bevel=0.002)
    K.rod('switch', YELLOW, (r * 1.15, 0, 0.03), (r * 1.15 + 0.018, 0, 0.042), 0.0035, 6)
    K.lathe('joint', RED, [(0, fore + 0.015), (r * 0.95, fore + 0.015), (r * 0.8, fore + 0.07), (0, fore + 0.07)], n=10)
    pts = hang_path(mu, fore + 0.06, 0.72, sway=0.05, n=10)
    hang_tube(K, BLACK, pts, 0.0105)
    end = pts[-1]; d = (pts[-1] - pts[-2]).normalized()
    side = mu.Vector((1, 0, 0)) if abs(d.x) < 0.9 else mu.Vector((0, 1, 0))
    for k in range(5):   # the stripped end: copper strands splayed out of the jacket
        a = 2 * math.pi * k / 5; o = side * math.cos(a) * 0.012 + d.cross(side) * math.sin(a) * 0.012
        K.rod('hang_end_%d' % k, COPPER, tuple(end), tuple(end + d * 0.06 + o * 1.8), 0.0028, 5)
    return True


def b_barbed_wire(K, mu):
    """a stub of broom handle wound in black tape for the grip, a rope tied through a hole in its end, and two strands of
    rusted barbed wire twisted onto the rope's end, a four-point barb every 12 cm; the odd thing: the rope's tail frayed"""
    WOOD, TAPE, ROPE, WIRE, RUST = ('clay_mustard', 1), ('rubber', 1), ('tape_masking', 2), ('metal_painted', 1), ('clay_rust', 1)
    fore = 0.2; rr = lambda x: x * E().FAT
    K.lathe('stub', WOOD, [(0, -0.06), (rr(0.014), -0.06), (rr(0.014), fore), (rr(0.011), fore + 0.015), (0, fore + 0.015)], n=10)
    E().tape_wrap(K, 'grip', TAPE, rr(0.0155), -0.045, 0.11, n=6)
    pts = hang_path(mu, fore + 0.01, 0.78, sway=0.06, n=12)
    for i in range(3): K.rod('hang_%d' % i, ROPE, tuple(pts[i]), tuple(pts[i + 1]), 0.009, 7)   # the rope, a hand long
    K.rod('hang_fray', ROPE, tuple(pts[2]), tuple(pts[2] + mu.Vector((0.04, 0.0, -0.02))), 0.004, 5)
    for i in range(3, len(pts) - 1):   # two strands twisted round each other
        a, b = pts[i], pts[i + 1]
        for s in (0, 1):
            ph = i * 1.9 + s * math.pi
            o0 = mu.Vector((math.cos(ph), math.sin(ph), 0)) * 0.0045; o1 = mu.Vector((math.cos(ph + 1.9), math.sin(ph + 1.9), 0)) * 0.0045
            K.rod('hang_%d_%d' % (i, s), RUST if (i + s) % 3 == 0 else WIRE, tuple(a + o0), tuple(b + o1), 0.0032, 5)
        d = (b - a).normalized(); n1 = d.cross(mu.Vector((0, 1, 0))).normalized(); n2 = d.cross(n1).normalized()
        for k, nn in enumerate((n1, n2)):   # a barb: two short wires wound across, four points out
            K.rod('hang_barb_%d_%d' % (i, k), WIRE if k else RUST, tuple(a - nn * 0.022), tuple(a + nn * 0.022 + d * 0.006), 0.0024, 4)
    end = pts[-1]
    K.rod('hang_end_tip', RUST, tuple(end), tuple(end + (pts[-1] - pts[-2]).normalized() * 0.025 + mu.Vector((0.01, 0, 0))), 0.003, 4)
    return True


def b_rodeo_bullwhip(K, mu):
    """a plaited leather bullwhip: the handle in two tones of plait, a knot and a wrist loop at the butt, a brass ring where
    the thong leaves the handle, the thong tapering and plaited in bands down to the pale fall and the cracker"""
    DARK, TAN, BRASS, FALL = ('clay_rust', 1), ('clay_mustard', 1), ('clay_mustard', 3), ('clay_bone', 3)
    fore = 0.22
    K.lathe('handle', DARK, [(0, -0.05), (0.017, -0.05), (0.016, 0.0), (0.0145, fore), (0, fore)], n=12)
    for k in range(6):   # the plait's bands
        z = -0.03 + k * 0.042
        K.lathe('plait_%d' % k, TAN, [(0, z), (0.0168 - k * 0.0003, z), (0.0168 - k * 0.0003, z + 0.016), (0, z + 0.016)], n=12)
    K.lathe('knot', DARK, [(0, -0.09), (0.012, -0.09), (0.022, -0.075), (0.022, -0.055), (0.015, -0.045), (0, -0.045)], n=12)
    K.tube('loop', TAN, [(0, 0, -0.09), (0.02, 0, -0.12), (0.03, 0, -0.16), (0.0, 0, -0.18), (-0.02, 0, -0.15), (0, 0, -0.09)], 0.0035, 6)
    K.lathe('ring', BRASS, [(0, fore - 0.008), (0.0175, fore - 0.008), (0.0175, fore + 0.008), (0, fore + 0.008)], n=12)
    pts = hang_path(mu, fore + 0.008, 0.82, sway=0.08, n=12, curl=0.03)
    hang_tube(K, DARK, pts[:-2], 0.011, 0.006, alt=TAN)
    K.rod('hang_fall', FALL, tuple(pts[-3]), tuple(pts[-2]), 0.0045, 6)
    K.rod('hang_end_cracker', FALL, tuple(pts[-2]), tuple(pts[-1]), 0.0035, 5)
    K.rod('hang_end_tuft', FALL, tuple(pts[-1]), tuple(pts[-1] + mu.Vector((0.012, 0.0, 0.02))), 0.0045, 5)
    return True


def b_crowbar(K, mu):
    """a 30-inch wrecking bar, hexagonal, painted red and worn to bare steel where hands go, the gooseneck at the head with its
    split claw toward the blow, the flat chisel at the butt; the odd thing: black tape round the grip, one end of it lifting"""
    RED, STEEL, TAPE, RUST = ('clay_rust', 2), ('metal_painted', 1), ('rubber', 1), ('clay_rust', 1)
    back, fore = 0.12, 0.6; r = 0.0115 * E().FAT
    K.lathe('bar', RED, [(0, -back + 0.03), (r, -back + 0.03), (r, fore), (0, fore)], n=6, smooth=False)
    K.lathe('worn', STEEL, [(0, -0.07), (r * 1.02, -0.07), (r * 1.02, 0.1), (0, 0.1)], n=6, smooth=False)
    E().tape_wrap(K, 'grip', TAPE, r * 1.12, -0.05, 0.08, n=5)
    K.box('tape_end', TAPE, (0.004, 0.02, 0.03), (r * 1.3, 0.0, 0.09), rot=(0, 0.5, 0))
    hook = [(0, 0, fore - 0.01), (0.012, 0, fore + 0.05), (0.045, 0, fore + 0.085), (0.085, 0, fore + 0.08), (0.11, 0, fore + 0.05)]
    K.tube('neck', RED, hook, r * 0.95, verts=6)
    for sgn in (-1, 1): K.rod('claw_%d' % (sgn > 0), STEEL, (0.105, sgn * 0.006, fore + 0.055), (0.125, sgn * 0.01, fore + 0.02), r * 0.55, 5)
    K.loft('chisel', STEEL, [(-back + 0.035, -r, r, r, r), (-back - 0.02, -r * 1.2, r * 1.2, r * 0.5, r * 0.5), (-back - 0.04, -r * 1.3, r * 1.3, 0.002, 0.002)])
    for k, z in enumerate((0.22, 0.38, fore + 0.02)): K.disc('rust_%d' % k, RUST, 0.008, (r * 0.9, 0, z), (1, 0, 0), depth=0.003, verts=6)
    return True


def b_bike_lock_chain(K, mu):
    """a hardened square-link bike chain in its black nylon sleeve, the sleeve bunched in the fist and taped, torn open down the
    hanging length so the links show, the lock barrel at the end with the key still in it"""
    SLEEVE, STEEL, TAPE, BRASS, LOCK = ('cloth_black', 2), ('tape_grey', 2), ('rubber', 1), ('clay_mustard', 3), ('metal_painted', 1)
    fore = 0.13
    K.lathe('sleeve', SLEEVE, [(0, -0.06), (0.024, -0.06), (0.026, -0.03), (0.022, fore), (0, fore)], n=10)
    E().tape_wrap(K, 'grip', TAPE, 0.027, -0.045, 0.1, n=5)
    pts = hang_path(mu, fore + 0.01, 0.62, sway=0.05, n=14)
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        K.CI.link(K.bpy, 'hang_%d' % i, K.m(*STEEL), tuple((a + b) / 2), tuple(b - a), i % 2 == 1, major=0.021, minor=0.0068)
        if i < 4 or i in (7, 8):   # the sleeve over the links, torn open below
            K.rod('hang_sleeve_%d' % i, SLEEVE, tuple(a), tuple(b), 0.02, 8)
    end = pts[-1]; d = (pts[-1] - pts[-2]).normalized()
    K.rod('hang_end_lock', LOCK, tuple(end), tuple(end + d * 0.07), 0.021, 12)
    K.rod('hang_end_key', BRASS, tuple(end + d * 0.07), tuple(end + d * 0.1 + mu.Vector((0.005, 0, 0))), 0.004, 6)
    K.box('hang_end_bow', BRASS, (0.022, 0.004, 0.018), tuple(end + d * 0.11), bevel=0.002)
    return True


def b_box_cutter(K, mu):
    """a heavy-duty utility knife, the yellow body wound in black tape at the back, the grey slider pushed all the way out, the
    trapezoid blade bright at its edge"""
    BODY, SLIDE, BLADE, TAPE = ('clay_mustard', 3), ('tape_grey', 2), ('chrome', 1), ('rubber', 1)
    k = 1.3   # a box cutter at its real size is eight pixels long: drawn a third over, so the blade reads
    K.box('body', BODY, (0.03 * k, 0.019 * k, 0.16 * k), (0.0, 0.0, 0.03 * k), bevel=0.006)
    K.box('slider', SLIDE, (0.006, 0.012 * k, 0.05 * k), (-0.017 * k, 0.0, 0.06 * k), bevel=0.002)
    E().tape_wrap(K, 'tape', TAPE, 0.016 * k, -0.05 * k, 0.0, n=4)
    z0 = 0.11 * k
    K.loft('blade', BLADE, [(z0, -0.008 * k, 0.012 * k, 0.0016, 0.0016), (z0 + 0.03 * k, -0.008 * k, 0.012 * k, 0.0014, 0.0008), (z0 + 0.05 * k, -0.008 * k, -0.004 * k, 0.001, 0.0006)])
    return True


def b_framing_hammer(K, mu):
    """a 22-ounce framing hammer: a hickory handle, the steel head with its milled face toward the blow and the straight rip
    claw behind, the grip taped; the odd thing: a bent nail still caught in the claw"""
    WOOD, HEAD, FACE, TAPE = ('clay_mustard', 1), ('metal_painted', 1), ('chrome', 1), ('rubber', 1)
    back, fore = 0.08, 0.36; rr = lambda x: x * E().FAT
    K.lathe('handle', WOOD, [(0, -back), (rr(0.017), -back), (rr(0.0175), -back + 0.02), (rr(0.0135), 0.15), (rr(0.0145), fore), (0, fore + 0.01)], n=10)
    E().tape_wrap(K, 'grip', TAPE, rr(0.0185), -back + 0.005, 0.07, n=5)
    K.box('eye', HEAD, (0.05, 0.03, 0.045), (0.0, 0.0, fore), bevel=0.004)
    K.rod('neck', HEAD, (0.02, 0, fore), (0.075, 0, fore), 0.014, 10)
    K.rod('face', FACE, (0.072, 0, fore), (0.09, 0, fore), 0.018, 12)
    K.loft('claw', HEAD, [(-0.02, fore - 0.016, fore + 0.016, 0.015, 0.015), (-0.07, fore - 0.012, fore + 0.012, 0.012, 0.012), (-0.12, fore - 0.004, fore + 0.004, 0.006, 0.006)], axis='x')
    K.rod('nail', ('tape_grey', 2), (-0.1, 0.0, fore + 0.004), (-0.08, 0.0, fore + 0.05), 0.0025, 5)
    K.rod('nail_bend', ('tape_grey', 2), (-0.08, 0.0, fore + 0.05), (-0.055, 0.0, fore + 0.06), 0.0025, 5)
    return True


def b_broom_bayonet(K, mu):
    """a painted broom handle, the paint worn through to wood where it is held, an old bayonet laid along its end and hose-clamped
    on twice, its muzzle ring over the threaded tip; the odd thing: a rag tied under the clamps"""
    PAINT, WOOD, BLUED, BRIGHT, RAG = ('clay_teal', 2), ('clay_mustard', 1), ('metal_painted', 1), ('chrome', 1), ('clay_bone', 2)
    back, fore = 0.5, 0.78; rr = lambda x: x * E().FAT
    K.lathe('handle', PAINT, [(0, -back), (rr(0.0145), -back), (rr(0.0145), fore), (rr(0.011), fore + 0.04), (0, fore + 0.04)], n=10)
    K.lathe('worn', WOOD, [(0, -0.07), (rr(0.0148), -0.07), (rr(0.0148), 0.09), (0, 0.09)], n=10)
    for k, z in enumerate((fore - 0.09, fore - 0.02)):
        K.lathe('clamp_%d' % k, BRIGHT, [(0, z), (rr(0.019), z), (rr(0.019), z + 0.012), (0, z + 0.012)], n=10)
        K.box('screw_%d' % k, BRIGHT, (0.012, 0.01, 0.012), (rr(0.02), 0, z + 0.006))
    K.lathe('rag', RAG, [(0, fore - 0.15), (rr(0.0175), fore - 0.15), (rr(0.019), fore - 0.12), (rr(0.0165), fore - 0.1), (0, fore - 0.1)], n=8, smooth=False)
    K.rod('rag_tail', RAG, (rr(0.017), 0, fore - 0.13), (rr(0.017) + 0.03, 0.01, fore - 0.2), 0.006, 5)
    K.box('grip', BLUED, (0.014, 0.022, 0.12), (rr(0.016) + 0.006, 0.0, fore - 0.05), bevel=0.003)
    K.lathe('ring', BLUED, [(0, fore + 0.02), (rr(0.016), fore + 0.02), (rr(0.016), fore + 0.04), (0, fore + 0.04)], n=10)
    K.box('guard', BLUED, (0.05, 0.012, 0.012), (0.012, 0.0, fore + 0.045), bevel=0.002)
    z0 = fore + 0.05; L = 0.27
    K.loft('blade', BLUED, [(z0, -0.008, 0.016, 0.004, 0.0015), (z0 + L * 0.8, -0.008, 0.014, 0.0032, 0.0012), (z0 + L, -0.002, 0.002, 0.001, 0.001)])
    K.loft('edge', BRIGHT, [(z0 + 0.02, 0.014, 0.018, 0.0012, 0.0006), (z0 + L * 0.8, 0.012, 0.016, 0.001, 0.0005)])
    return True


def b_pawn_shop_katana(K, mu):
    """a wall-hanger katana off a pawn-shop wall: the black-wrapped grip with its pale diamonds, the round guard, the long blade
    curving back toward its spine, the edge bright; the odd thing: the shop's price tag still tied to the guard on its string"""
    WRAP, SILK, GUARD, EDGE, TAG = ('cloth_black', 2), ('clay_bone', 2), ('metal_painted', 1), ('chrome', 1), ('tape_masking', 3)
    back, fore = 0.1, 0.86
    K.lathe('grip', WRAP, [(0, -back), (0.017, -back), (0.0165, 0.14), (0, 0.14)], n=10)
    for k in range(7): K.box('diamond_%d' % k, SILK, (0.012, 0.035, 0.012), (0.0, 0.0, -0.07 + k * 0.03), rot=(0, 0, 0.785))
    K.lathe('pommel', GUARD, [(0, -back - 0.012), (0.018, -back - 0.012), (0.018, -back + 0.004), (0, -back + 0.004)], n=10)
    K.lathe('tsuba', GUARD, [(0, 0.14), (0.04, 0.14), (0.04, 0.15), (0, 0.15)], n=16)
    K.lathe('habaki', ('tape_masking', 3), [(0, 0.15), (0.016, 0.15), (0.015, 0.18), (0, 0.18)], n=8)
    secs = []; secs_e = []
    for i in range(7):
        t = i / 6.0; z = 0.18 + (fore - 0.18) * t; bend = -0.035 * t * t   # the sori: the blade bows back toward its spine
        w = 0.03 - 0.008 * t if i < 6 else 0.004
        secs.append((z, bend - 0.012, bend - 0.012 + w, 0.0035 * (1 - 0.5 * t), 0.0012))
        if i < 6: secs_e.append((z, bend - 0.012 + w - 0.005, bend - 0.012 + w + 0.0005, 0.0012, 0.0005))
    K.loft('blade', GUARD, secs); K.loft('edge', EDGE, secs_e)
    K.rod('string', TAG, (0.0, 0.03, 0.145), (0.02, 0.04, 0.09), 0.0015, 4)
    K.box('tag', TAG, (0.03, 0.002, 0.045), (0.024, 0.04, 0.065))
    return True


def b_splitting_maul(K, mu):
    """an eight-pound splitting maul: a long hickory handle, the head a wedge ground bright toward the blow and a sledge face
    behind it, the red paint mostly worn off, the grip taped; two hands"""
    WOOD, HEAD, EDGE, RED, TAPE = ('clay_mustard', 1), ('metal_painted', 1), ('chrome', 1), ('clay_rust', 2), ('rubber', 1)
    back, fore = 0.06, 0.8; rr = lambda x: x * E().FAT
    K.lathe('handle', WOOD, [(0, -back), (rr(0.021), -back), (rr(0.022), -back + 0.025), (rr(0.0165), 0.12), (rr(0.0155), 0.5),
                             (rr(0.019), fore - 0.04), (rr(0.02), fore + 0.05), (0, fore + 0.056)], n=10)
    E().tape_wrap(K, 'grip', TAPE, rr(0.0225), -back + 0.01, 0.1, n=5)
    K.box('eye', RED, (0.07, 0.06, 0.11), (0, 0, fore), bevel=0.008)
    K.loft('wedge', HEAD, [(0.03, fore - 0.05, fore + 0.05, 0.03, 0.03), (0.1, fore - 0.055, fore + 0.055, 0.016, 0.016), (0.15, fore - 0.06, fore + 0.06, 0.004, 0.004)], axis='x')
    K.loft('edge', EDGE, [(0.148, fore - 0.06, fore + 0.06, 0.0045, 0.0045), (0.165, fore - 0.062, fore + 0.062, 0.0012, 0.0012)], axis='x')
    K.box('poll', HEAD, (0.05, 0.058, 0.07), (-0.055, 0, fore), bevel=0.006)
    K.rod('face', EDGE, (-0.08, 0, fore), (-0.088, 0, fore), 0.027, 12)
    OBJECTS = E().OBJECTS; OBJECTS['splitting_maul']['left_x'] = 0.42
    return True


def b_sign_post_halberd(K, mu):
    """a punched U-channel sign post, its holes in a row; at the head a STOP sign cut into an axe blade and bolted through the
    post, a back spike bent from the sign's bracket, the post's end ground to a point; the grip taped; two hands"""
    POST, RED, WHITE, HOLE, BRIGHT = ('metal_painted', 2), ('clay_rust', 2), ('clay_bone', 4), ('rubber', 0), ('chrome', 1)
    back, fore = 0.65, 1.2; rr = lambda x: x * E().FAT
    K.box('post', POST, (rr(0.026), rr(0.022), back + fore), (0, 0, (fore - back) / 2), bevel=0.003)
    for k in range(14): K.disc('hole_%d' % k, HOLE, 0.0055, (rr(0.013) + 0.001, 0, -back + 0.1 + k * 0.125), (1, 0, 0), depth=0.003, verts=6)
    E().tape_wrap(K, 'grip', HOLE, rr(0.02), -0.06, 0.08, n=4)
    E().tape_wrap(K, 'grip_left', HOLE, rr(0.02), 0.5, 0.64, n=4)
    # the blade: a wedge of the octagon, its red face and the white border along its cut edge, bolted through the post
    z = fore - 0.06
    K.loft('blade', RED, [(0.015, z - 0.045, z + 0.045, 0.003, 0.003), (0.08, z - 0.06, z + 0.05, 0.0025, 0.0025), (0.13, z - 0.1, z + 0.075, 0.002, 0.002),
                          (0.15, z - 0.115, z + 0.085, 0.002, 0.002)], axis='x')
    K.loft('border', WHITE, [(0.15, z - 0.115, z + 0.085, 0.0024, 0.0024), (0.165, z - 0.118, z + 0.088, 0.0018, 0.0018)], axis='x')
    for k, dz in enumerate((-0.04, 0.04)): K.rod('bolt_%d' % k, BRIGHT, (0.0, -0.02, z + dz), (0.0, 0.02, z + dz), 0.006, 6)
    K.tube('spike_back', POST, [(0, 0, z), (-0.06, 0, z + 0.01), (-0.12, 0, z - 0.04)], 0.006, verts=6)
    K.lathe('point', BRIGHT, [(0, fore - 0.005), (rr(0.012), fore - 0.005), (0, fore + 0.18)], n=6, smooth=False)
    OBJECTS = E().OBJECTS; OBJECTS['sign_post_halberd']['left_x'] = 0.57
    return True


# ------------------------------------------------------------------------------------------------ model (bpy)
def do_model(names):
    M = E()
    M.model(names)


# ------------------------------------------------------------------------------------------------ wire (python3)
def do_wire(names):
    """the source: each weapon a prop (COOK's model), on its layer, held the way its family is held, its row pointed at it"""
    S = json.load(open(SRC))
    one = [n for n in names if WEAPONS[n]['hands'] == 1]; two = [n for n in names if WEAPONS[n]['hands'] == 2]
    for n in names:
        w = WEAPONS[n]; p = dict(say="COOK's %s (rule 337): %s" % (w['name'], w['say']), back=w['back'], fore=w['fore'])
        if w['hands'] == 2: p['two'] = True
        S['props'][n] = p
        like = w['like']
        if like in S.get('hold_by_prop', {}): S['hold_by_prop'][n] = dict(S['hold_by_prop'][like])
        if w.get('thrust') and n not in S['thrust']: S['thrust'].append(n)
        if w.get('hang'):
            S['hanging'] = sorted(set(S.get('hanging', ['chain'])) | {n})
        (S['two_by_row'] if w['hands'] == 2 else S['by_row'])[w['row']] = n
    S.setdefault('hanging', ['chain'])
    M2, S2, T2 = S['layers']['m2'], S['layers']['s2'], S['layers']['t2']
    if one:
        m4 = S['layers'].setdefault('m4', dict(props=[], clips=list(M2['clips']), keys=dict(M2['keys']), only={}))
        s4 = S['layers'].setdefault('s4', dict(props=[], clips=list(S2['clips']), keys=dict(S2['keys']), only={}))
        for n in one:
            if n not in m4['props']: m4['props'].append(n)
            if n not in s4['props']: s4['props'].append(n)
            thrust = WEAPONS[n].get('thrust')
            if not thrust: m4['only'][n] = [c for c in M2['clips'] if c != 'PAim']
            else: m4['only'].pop(n, None)
            s4['only'][n] = list(S2['only']['rebar_spear'] if thrust else S2['only']['chain'])
    if two:
        t4 = S['layers'].setdefault('t4', dict(props=[], clips=list(T2['clips']), keys=dict(T2['keys']), only={}))
        for n in two:
            if n not in t4['props']: t4['props'].append(n)
            if not WEAPONS[n].get('thrust'): t4['only'][n] = list(T2['only']['fire_axe'])
    for ly in ('m4', 's4', 't4'):
        if ly in S['layers'] and ly not in S['layers_ready']: S['layers_ready'].append(ly)
    S['every_weapon_its_own'] = ("COOK 11/3 (rule 337, ask line 344, tools/bohemia_cook_every_weapon_its_own_11_3_26.py): the armory's pieces "
                                 "were drawn as their family's model; each is its own model now, rendered in YOU's hands on the new layers "
                                 "m4 (one hand), s4 (one hand with a shield) and t4 (two hands), and every other man holds YOU's pictures "
                                 "moved by the difference of their feet (props_ref). 'hanging': the things whose cord, thong or chain "
                                 "hangs from the handle's end and trails the swing (build_prop).")
    json.dump(S, open(SRC, 'w'), indent=1)
    print('WIRED', names)


def layers_of(n, S=None):
    S = S or json.load(open(SRC))
    return [ly for ly in ('m4', 's4', 't4') if n in S['layers'].get(ly, {}).get('props', [])]


# ------------------------------------------------------------------------------------------------ render (bpy, ANIMATION's)
def do_render(names, workers=4):
    """every layer of every weapon in YOU's hands, a worker a (weapon, layer), ANIMATION's render_props in a fresh Blender"""
    import bohemia_animation_melee_in_hand as A
    jobs = [(n, ly) for n in names for ly in layers_of(n) if not A.props_done('you', ly, n)]
    py = sys.executable; procs = []
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // workers)))
    while jobs or procs:
        while jobs and len(procs) < workers:
            n, ly = jobs.pop(0)
            procs.append(((n, ly), subprocess.Popen([py, os.path.join(ROOT, 'tools/bohemia_animation_melee_in_hand.py'), '_props', 'you', n, '', '', ly],
                                                    cwd=ROOT, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)))
        import time; time.sleep(2)
        for j, p in list(procs):
            if p.poll() is not None:
                procs.remove((j, p))
                ok = A.props_done('you', j[1], j[0])
                print('RENDER', j, 'done' if ok else 'AGAIN', flush=True)
                if not ok: jobs.append(j)


# ------------------------------------------------------------------------------------------------ pack (python3)
def do_pack(names):
    """YOU's new layers into slices/rig_melee/you_props_<layer>.webp and you.json (ANIMATION's cut, palette and shelf, line
    for line), every named look that draws its own things pointed at YOU for the rest (props_ref), the index's rows"""
    import numpy as np
    from PIL import Image
    import bohemia_animation_melee_in_hand as A
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
    for ly in ('m4', 's4', 't4'):
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
                by.setdefault(prop, {}).setdefault(clip, dict(l=ly, k=[[None] * 8 for _ in range(nk)]))['k'][j][FIGHT_DIRS.index(f)] = ix
        pim, prects = shelf(pimgs, 2048)
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
    # every named look that draws its own things: YOU's for what it does not hold (the fight's meleeDraw falls through)
    I = json.load(open(os.path.join(RIGM, 'rig_melee.json')))
    refs = 0
    for look in I['looks']:
        if look == 'you' or look.startswith(('person_', 'enemy_')): continue
        lp = os.path.join(RIGM, look + '.json'); e = json.load(open(lp))
        if e.get('props') and not e.get('props_ref') and not e.get('ref'):
            e['props_ref'] = 'you'; json.dump(e, open(lp, 'w'), separators=(',', ':')); refs += 1
    live = [ly for ly in ('m4', 's4', 't4') if ly in Y['props']['sheets']]
    for ly in live:
        if ly not in I['layers_ready']: I['layers_ready'].append(ly)
    ready = set(p_ for ly in I['layers_ready'] for p_ in S['layers'][ly]['props'] if ly in S['layers'])
    ready = set(p_ for p_ in ready if p_ not in WEAPONS or p_ in Y['props']['by'])   # a row points at its own model only once YOU's pictures of it are packed
    I['props'] = sorted(set(I['props']) | ready)
    for k in ('by_row', 'two_by_row'):
        I[k] = {a_: b_ for a_, b_ in S.get(k, {}).items() if a_ != 'why' and b_ in ready}
    I['thrust'] = S['thrust']
    for k in ('every_weapon_its_own',): I[k] = S[k]
    json.dump(I, open(os.path.join(RIGM, 'rig_melee.json'), 'w'), separators=(',', ':'))
    print('INDEX live', I['layers_ready'], 'props_ref set on', refs, 'looks; rows', {r: I['by_row'].get(r) or I['two_by_row'].get(r) for r in [WEAPONS[n]['row'] for n in names]})


# ------------------------------------------------------------------------------------------------ alone (bpy): the sheet's and the icon's
def do_alone(names):
    """each weapon alone through the master rig's light, side-on (the icon's and the sheet's view: the camera square to its
    flat, the haft level), at 3 px a centimetre... and the fight's own 57 px a metre, eight facings lying on the ground"""
    import bpy, mathutils
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    for n in names:
        out = os.path.join(OUTD, 'alone_' + n); os.makedirs(out, exist_ok=True)
        bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
        before = set(o.name for o in sc.objects)
        bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'reference/models/bohemia/item_%s.glb' % n))
        parts = [o for o in sc.objects if o.name not in before and o.type == 'MESH']
        MR.source_pass(parts, float(MR.G['wear']), 1.0, 0)
        lo, hi = E().bounds(parts); size = hi - lo; c = (lo + hi) / 2
        for ppcm, tag in ((3.0, 'side'),):
            res_x = int(size.x * 100 * ppcm) + 24; res_y = int(size.z * 100 * ppcm) + 24
            cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = max(res_x, res_y) / (100 * ppcm)
            cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
            cam.rotation_euler = (math.radians(90), 0, 0); cam.location = (c.x, lo.y - 2.0, c.z)
            sc.render.resolution_x, sc.render.resolution_y = res_x, res_y
            MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg'])))
            sc.cycles.samples = 32; sc.render.film_transparent = True
            sc.render.filepath = os.path.join(out, '%s.png' % tag); bpy.ops.render.render(write_still=True)
        print('ALONE', n, out, flush=True)


# ------------------------------------------------------------------------------------------------ the icon (bpy, then python3)
ICON_OBJ = {'pool_pole_spear': 'pool pole spear', 'extension_cord': 'extension cord', 'live_wire': 'live wire', 'barbed_wire': 'barbed wire',
            'rodeo_bullwhip': 'bullwhip', 'crowbar': 'crowbar', 'bike_lock_chain': 'bike-lock chain', 'box_cutter': 'box cutter',
            'framing_hammer': 'framing hammer', 'broom_bayonet': 'broom bayonet', 'pawn_shop_katana': 'katana', 'splitting_maul': 'splitting maul',
            'sign_post_halberd': 'halberd'}   # the word the bag, the shop and the crew screen name it by (bohemia_ui_materials.js OBJECTS)
ICON_CODE = dict(steel='s', dsteel='d', rust='r', wood='w', red='e', yellow='y', black='k', olive='o', khaki='h', glass='g', tape='t',
                 rag='a', leather='l', green='n', flame='f', white='i', brass='b')


def do_icon_render(names):
    """the model laid on the inventory's diagonal (the grip bottom left, the business end top right, the way every icon in the
    bag lies), lit by the master rig's sun, square to its flat, 176 px for the 22 cells"""
    import bpy, mathutils
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    for n in names:
        out = os.path.join(OUTD, 'alone_' + n); os.makedirs(out, exist_ok=True)
        bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
        before = set(o.name for o in sc.objects)
        bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'reference/models/bohemia/item_%s.glb' % n))
        parts = [o for o in sc.objects if o.name not in before and o.type == 'MESH']
        top = [o for o in sc.objects if o.name not in before and o.parent is None]
        root = bpy.data.objects.new('turn', None); sc.collection.objects.link(root)
        for o in top: o.parent = root
        root.scale = (1.0, 2.4, 2.4)   # an icon's shaft is two cells, never a hairline: the girth (and a cord's sway) drawn 2.4 times
        root.rotation_euler = (0, math.radians(-45), 0); bpy.context.view_layer.update()
        MR.source_pass(parts, float(MR.G['wear']), 1.0, 0)
        vs = [o.matrix_world @ v.co for o in parts for v in o.data.vertices]
        lo = mathutils.Vector([min(v[i] for v in vs) for i in range(3)]); hi = mathutils.Vector([max(v[i] for v in vs) for i in range(3)])
        c = (lo + hi) / 2; ext = max(hi.x - lo.x, hi.z - lo.z)
        cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.ortho_scale = ext * 22.0 / 20.0
        cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
        cam.rotation_euler = (math.radians(90), 0, 0); cam.location = (c.x, lo.y - 2.0, c.z)
        sc.render.resolution_x = sc.render.resolution_y = 176
        MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg'])))
        sc.cycles.samples = 32; sc.render.film_transparent = True
        sc.render.filepath = os.path.join(out, 'icon.png'); bpy.ops.render.render(write_still=True)
        print('ICON', n, flush=True)


def do_icon_pack(names):
    """the render cut into the bag's 22 cells (a cell is the thing where a fifth of it is covered), each cell's colour the
    model's own (snapped to the style palette's ramps of the materials it is built from, hue weighed apart, as ANIMATION's
    pack snaps a thing in his hand), written into bohemia_ui_materials.js MODEL_ICONS; the kit's own light and form, scratches
    and outline go over it like every icon"""
    import numpy as np
    from PIL import Image
    PALR = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
    def ycc(x):
        Y = 0.299 * x[..., 0] + 0.587 * x[..., 1] + 0.114 * x[..., 2]
        return np.stack([Y, (x[..., 2] - Y) * 0.564, (x[..., 0] - Y) * 0.713], -1)
    tp = os.path.join(OUTD, 'icons.json'); T = json.load(open(tp)) if os.path.exists(tp) else {}
    B36 = '0123456789abcdefghijklmnopqrstuvwxyz'
    for n in names:
        roles = [m.split()[0] for m in json.load(open(os.path.join(ROOT, 'records/target/cook_every_item/measured_%s.json' % n)))['materials']]
        P = np.array(sorted(set(tuple(int(h.lstrip('#')[k:k + 2], 16) for k in (0, 2, 4)) for r in roles for h in PALR[r]['ramp'])), np.float64)
        a = np.asarray(Image.open(os.path.join(OUTD, 'alone_' + n, 'icon.png')).convert('RGBA')).astype(np.float64)
        used, rows = [], []
        for y in range(22):
            r = ''
            for x in range(22):
                b = a[y * 8:(y + 1) * 8, x * 8:(x + 1) * 8]; al = b[..., 3] / 255.0
                if al.mean() < 0.2 or x in (0, 21) or y in (0, 21): r += '.'; continue
                rgb = (b[..., :3] * al[..., None]).sum((0, 1)) / max(1e-6, al.sum())
                rgb = np.minimum(255, rgb * 1.45)   # the kit lights and shades each cell itself: the rig's sun and dust taken back off
                c = tuple(int(v) for v in P[int((((ycc(P) - ycc(rgb[None, :])) ** 2) * np.array([1.0, 3.0, 3.0])).sum(1).argmin())])
                if c not in used: used.append(c)
                r += B36[used.index(c)]
            rows.append(r)
        T[ICON_OBJ[n]] = dict(model='reference/models/bohemia/item_%s.glb' % n, rows=rows, pal=[list(c) for c in used])
        print('ICON', n, len(used), 'colours'); print('\n'.join(rows[2:20]))
    json.dump(T, open(tp, 'w'), indent=1)
    blk = ('  /* __MODEL_ICONS__ (COOK [every weapon its own], rule 337, ask line 344): a weapon of the valley\'s own drawn from its own 3D model, '
           'not cut by hand: its rig render laid on the bag\'s diagonal, cut into these 22 cells in the model\'s own colours '
           '(records/target/cook_every_weapon/icons.json, tools/bohemia_cook_every_weapon_its_own_11_3_26.py icon); the kit\'s own '
           'light and form, scratches and outline go over it as over every icon */\n'
           '  var MODEL_ICONS = ' + json.dumps({k: dict(rows=v['rows'], pal=v['pal']) for k, v in sorted(T.items())}, separators=(',', ':')) + ';\n'
           '  /* ==== end __MODEL_ICONS__ ==== */\n')
    p = os.path.join(ROOT, 'slices/bohemia_ui_materials.js'); s = open(p).read()
    if '__MODEL_ICONS__ (COOK' in s:
        i = s.index('  /* __MODEL_ICONS__ (COOK'); e = '  /* ==== end __MODEL_ICONS__ ==== */\n'; j = s.index(e) + len(e)
        s = s[:i] + blk + s[j:]
    else:
        s = s.replace('  var ICON_CACHE = {};\n', blk + '  var ICON_CACHE = {};\n', 1)
    a_ = '    switch (obj) {\n'
    b_ = ('    if (MODEL_ICONS[obj]) { var MI = MODEL_ICONS[obj]; MI.pal.forEach(function (c, k) { MAT[\'m\' + k + \'@\' + obj] = c; });   /* __MODEL_ICONS__: the model\'s own cells */\n'
          '      MI.rows.forEach(function (row, yy) { for (var xx = 0; xx < N; xx++) { var ch = row.charAt(xx); if (ch !== \'.\') G[yy * N + xx] = \'m\' + parseInt(ch, 36) + \'@\' + obj; } }); }\n'
          '    switch (MODEL_ICONS[obj] ? \'\' : obj) {\n')
    if b_ not in s:
        assert s.count(a_) == 1, 'the icon switch moved: re-read itemIcon'
        s = s.replace(a_, b_)
    open(p, 'w').write(s)
    print('KIT', len(T), 'model icons')


# ------------------------------------------------------------------------------------------------ the shelf (python3)
def do_shelf(names):
    """the shop's shelf shows the model: its rig render on the inventory's diagonal (the icon render) halved with a box filter
    into slices/market_icons/own_<row>.png, and the settlement screen's tile wears it (a picture on a tile wins over the kit's
    drawn icon, RUN TWO 10/11), so a piece of the valley's own sits on the shelf as the thing it is, never a glyph"""
    from PIL import Image
    shipped = []
    for n in names:
        im = Image.open(os.path.join(OUTD, 'alone_' + n, 'icon.png')).convert('RGBA')
        im = im.crop(im.getbbox()); im = im.resize((max(1, im.width // 2), max(1, im.height // 2)), Image.BOX)
        a = im.split()[3].point(lambda v: 255 if v > 96 else 0); im.putalpha(a)
        row = WEAPONS[n]['row']; im.save(os.path.join(ROOT, 'slices/market_icons/own_%s.png' % row), optimize=True); shipped.append(row)
    p = os.path.join(ROOT, 'slices/market_icons/SOURCES.txt'); t = open(p).read()
    for r in shipped:
        line = 'own_%s (11/3, COOK [every weapon its own], rule 337): not a pack tile; reference/models/bohemia/item_%s.glb through the master rig on the bag\'s diagonal (tools/bohemia_cook_every_weapon_its_own_11_3_26.py shelf)\n' % (r, r)
        if ('own_%s (11/3' % r) not in t: t = t.rstrip('\n') + '\n' + line
    open(p, 'w').write(t)
    h = os.path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'); s = open(h).read()
    have = sorted(f[4:-4] for f in os.listdir(os.path.join(ROOT, 'slices/market_icons')) if f.startswith('own_') and f.endswith('.png'))
    blk = ('/* __EVERY_WEAPON_ITS_OWN__ (COOK, rule 337, ask line 344): a piece of the valley\'s own on the shelf as its own 3D model, rendered '
           'through the master rig (slices/market_icons/own_<row>.png); a piece with none yet keeps the kit\'s drawn icon */\n'
           'var OWN_MODEL = ' + json.dumps({r: 1 for r in have}, separators=(',', ':')) + ';\n'
           'function ownIcon(id){ if(!OWN_MODEL[id]) return null; var im = document.createElement(\'img\'); im.className = \'pk\'; im.alt = \'\'; im.src = \'market_icons/own_\' + id + \'.png\'; return im; }\n'
           '/* ==== end __EVERY_WEAPON_ITS_OWN__ ==== */\n')
    if '__EVERY_WEAPON_ITS_OWN__ (COOK' in s:
        i = s.index('/* __EVERY_WEAPON_ITS_OWN__ (COOK'); e = '/* ==== end __EVERY_WEAPON_ITS_OWN__ ==== */\n'; s = s[:i] + blk + s[s.index(e) + len(e):]
    else:
        a = 'function iconTile(it, onTap, sub, money){\n'; assert s.count(a) == 1; s = s.replace(a, blk + a)
    a = "    var pk = it.kind === 'weapon' && !it.own ? packIcon(it.cls) : null;"
    b = "    var pk = it.kind === 'weapon' && !it.own ? packIcon(it.cls) : it.kind === 'weapon' ? ownIcon(it.id) : null;"
    if b not in s: assert s.count(a) == 1; s = s.replace(a, b)
    open(h, 'w').write(s)
    print('SHELF', shipped, 'of', len(have))


# ------------------------------------------------------------------------------------------------ the manifest (python3)
def do_manifest(names):
    """reference/models/bohemia/items.json: each weapon its own entry (its glb, its sha1, its measure), its armory row moved off
    the family entry it was listed under (the model that draws it today is its own)"""
    import hashlib
    mp = os.path.join(ROOT, 'reference/models/bohemia/items.json'); M = json.load(open(mp))
    for n in names:
        w = WEAPONS[n]; g = os.path.join(ROOT, 'reference/models/bohemia/item_%s.glb' % n)
        if not os.path.exists(g): continue
        for k, e in M['items'].items():
            if k != n and w['row'] in e.get('rows', []): e['rows'] = [r for r in e['rows'] if r != w['row']]
        meas = json.load(open(os.path.join(ROOT, 'records/target/cook_every_item/measured_%s.json' % n)))
        e = dict(glb='item_%s.glb' % n, kind='held', name=w['name'].replace('the ', ''), say=w['say'],
                 made='COOK 11/3 (tools/bohemia_cook_every_weapon_its_own_11_3_26.py)', rows=[w['row']],
                 sha1=hashlib.sha1(open(g, 'rb').read()).hexdigest(), hands=w['hands'], measured=meas, was=w['was'])
        if 'left_x' in meas: e['left_x'] = meas['left_x']
        M['items'][n] = e
    json.dump(M, open(mp, 'w'), indent=1)
    print('MANIFEST', len(M['items']), 'items')


# ------------------------------------------------------------------------------------------------ the VOTE card (python3)
def do_sheet(names, tag):
    """the proof's frames (the shipped fight, his phone) into one moving sheet: a row a weapon, WAS (the family model it was drawn
    as) beside NOW (its own), every row in step: he turns through the eight facings holding it (300 ms a facing), then the blow
    or the lash, six keys on one beat at 120 BPM (83 ms a key), held; and the card's first picture, the first row's NOW alone"""
    from PIL import Image, ImageDraw
    P = json.load(open(os.path.join(OUTD, 'proof.json'))); D = os.path.join(OUTD, 'proof')
    k = 0.3; dpr = 3
    def frames(n, mode):
        r = P[n][mode]; bx, me = r['box'], r['me']; W, H = bx['width'] * dpr, bx['height'] * dpr
        out = []
        for f in range(8):
            c = Image.new('RGB', (W, H), (24, 22, 20)); im = Image.open(os.path.join(D, '%s_%s_turn%d.png' % (n, mode, f))).convert('RGB')
            c.paste(im, ((me['x'] - bx['x']) * dpr, (me['y'] - bx['y']) * dpr)); out.append(c)
        for b in range(6): out.append(Image.open(os.path.join(D, '%s_%s_blow%d.png' % (n, mode, b))).convert('RGB'))
        return [im.resize((int(im.width * k), int(im.height * k)), Image.BOX) for im in out]
    cells = [(n, frames(n, 'before'), frames(n, 'after')) for n in names]
    cw = max(c[1][0].width for c in cells); ch = max(c[1][0].height for c in cells); lab = 18; gap = 6
    W = cw * 2 + gap * 3; H = (ch + lab + gap) * len(cells) + gap
    seq = []
    for f in range(14):
        S = Image.new('RGB', (W, H), (24, 22, 20)); d = ImageDraw.Draw(S)
        for i, (n, bf, af) in enumerate(cells):
            y = gap + i * (ch + lab + gap)
            d.text((gap, y + 3), ('%s  WAS: drawn as the %s' % (WEAPONS[n]['name'].upper(), WEAPONS[n]['was'].replace('_', ' '))), fill=(200, 190, 170))
            d.text((gap * 2 + cw, y + 3), 'NOW: ITS OWN MODEL', fill=(240, 200, 120))
            S.paste(bf[f], (gap, y + lab)); S.paste(af[f], (gap * 2 + cw, y + lab))
        seq.append(S)
    dur = [300] * 8 + [83] * 5 + [600]
    sp = os.path.join(OUTD, 'sheet_%s.webp' % tag); seq[0].save(sp, 'WEBP', save_all=True, append_images=seq[1:], duration=dur, loop=0, quality=78, method=6)
    fa = [gap * 2 + cw, gap + lab, cw, ch]
    first = [im.crop((fa[0], fa[1], fa[0] + fa[2], fa[1] + fa[3])) for im in seq]
    fp = os.path.join(OUTD, 'first_%s.webp' % tag); first[0].save(fp, 'WEBP', save_all=True, append_images=first[1:], duration=dur, loop=0, quality=80, method=6)
    print('SHEET', sp, seq[0].size, os.path.getsize(sp), 'first', fp, fa)
    return sp, fp, fa


def do_vote(names, tag, sha, n_):
    """the card in the VOTE tab (records/target/BOHEMIA_VOTE_REGISTRY.json), a recent card's shape"""
    sp, fp, fa = do_sheet(names, tag)
    rp = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'); R = json.load(open(rp))
    iid = 'cook-every-weapon-its-own-%s-11-3' % tag
    words = ', '.join(WEAPONS[n]['name'].replace('the ', '') for n in names)
    it = dict(id=iid, kind='animation', lane='cook', sha=sha, made='11/3',
              title='EVERY WEAPON ITS OWN %d: %s, EACH ITS OWN 3D MODEL IN HIS HANDS' % (n_, words.upper()),
              said="you build the bosses like shit, we don't have enough assets, and you're not creating assets, weapons, armor, the vibe, nothing",
              why=('These %d were drawn in his hands as another weapon (%s); now each is its own model made the clay way, held in all eight '
                   'facings and swung or lashed on the beat. You see it here, the old one left and the new one right, and in every fight and on '
                   'the shop shelf.') % (len(names), ', '.join(sorted(set(WEAPONS[n]['was'].replace('_', ' ') for n in names)))),
              options=['A, yes, these are the weapons', 'B, close, push the look further', 'C, no, not like this'],
              show=dict(how='image', src='../' + os.path.relpath(sp, ROOT), first='../' + os.path.relpath(fp, ROOT), firstAt=fa),
              twin=dict(src='slices/rig_melee/you_props_m2.webp',
                        diffs=['METHOD: the twin is the sheet the fight drew these from until now, the rebar spear and the chain (his family models) on every key of '
                               'YOU; mine is each weapon\'s own glb made the clay way through the same master rig, the same body, camera and sun.',
                               'SIZE: true size at the rig\'s 57 px a metre, one ruler with the man: the pool pole is 2.24 m against the rebar spear\'s 2.2, the '
                               'cords and the whips hang 0.7 to 0.8 m from the fist to his knee where the chain hung 0.5.',
                               'LOOK: each keeps five materials of the style palette at most; the family stand-in was one look for five weapons, now the orange '
                               'cord, the yellow battery, the rusted barbs and the plaited leather each read as their own at the fight\'s pixels.']),
              before_after=dict(before='each weapon drawn as its family\'s model in his hand (the rebar spear, the chain, the pipe...)',
                                after='each its own glb through the master rig, in YOU\'s hands on every key, every man borrows those pictures',
                                scale='his phone, 390 x 844 at 3x, the fight zoomed on the man'),
              draft=True)
    # appended as text, the file's own layout kept byte for byte (a whole-file dump re-indents other lanes' rows: 17c4b71d)
    txt = open(rp).read(); anchor = '\n ],\n "verdicts"'
    if any(x.get('id') == iid for x in R['items']): print('VOTE', iid, 'already registered: left as it is'); return
    blk = '\n'.join('  ' + l for l in json.dumps(it, indent=1).split('\n'))
    i = txt.index(anchor); txt = txt[:i] + ',\n' + blk + txt[i:]
    assert json.loads(txt)['items'][-1]['id'] == iid
    open(rp, 'w').write(txt)
    print('VOTE', iid)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    args = [a for a in sys.argv[2:] if not (cmd == 'render' and a.isdigit())]   # a worker count only for render (a short sha can be all digits)
    num = [int(a) for a in sys.argv[2:] if cmd == 'render' and a.isdigit()]
    if cmd == 'model': do_model(names_of(args)); os._exit(0)
    elif cmd == 'wire': do_wire(names_of(args))
    elif cmd == 'render': do_render(names_of(args), num[0] if num else 4)
    elif cmd == 'pack': do_pack(names_of(args))
    elif cmd == 'alone': do_alone(names_of(args)); os._exit(0)
    elif cmd == 'icon-render': do_icon_render(names_of(args)); os._exit(0)
    elif cmd == 'icon': do_icon_pack(names_of(args))
    elif cmd == 'shelf': do_shelf(names_of(args))
    elif cmd == 'manifest': do_manifest(names_of(args))
    elif cmd == 'vote': do_vote(names_of(args[2:] or [args[0]]), args[0], args[1], int(args[0][-1]))
    else: sys.exit(__doc__)
