#!/usr/bin/env python3
"""BOHEMIA -- COOK GUNS [the six guns] (rule 337, ask line 344; Paolo 11/3: 'we don't have enough assets... weapons, armor,
the vibe'). COOK WEAPONS gave thirteen melee their own models in every man's hands and left THE SIX GUNS owed
(records/BOHEMIA_COOK_EVERY_WEAPON_ITS_OWN_MODEL_11_3_26.md, OWED): the zip gun, the snub revolver, the lever rifle, the
scoped deer rifle, the sawed-off and the pump shotgun were drawn as the class's pistol, rifle and shotgun.

MEASURED FIRST: a gun in a man's hands is drawn by FOUR picture systems, each per look: the fight's gun grid
(slices/fight_rig/<look>_guns.webp: Carry, CarryWalk, Aim, Hit, Swing), the held clips (slices/rig_hold: the pistol's low
ready, its walk, its one-hand aim, the knee in cover, the reload), the idles (slices/rig_idles: the gun on every carry idle)
and the shield arm's pistol (slices/rig_melee s1). The class model in each is COOK's 10/19 'A' gun (gun_pistol_a, gun_rifle_a,
gun_shotgun_a, the last a sawn-off double).

THE WAY (one renderer, the master rig; nothing drawn by hand):
  1. MODELS: lever rifle = gun_rifle_b (COOK 10/19, a lever carbine), pump shotgun = gun_shotgun_b (a pump), built; the zip
     gun, the snub revolver, the scoped deer rifle (gun_rifle_a with its glass) and the sawed-off (the class shotgun is
     already a sawn-off double with a short stock, so this one is cut further: the stock gone to a taped pistol grip, the
     barrels to the forend) are built here with COOK's gun kit (tools/bohemia_cook_model_guns.py: its helpers and build(),
     imported; the same five materials, every colour a palette step; the origin at the firing hand's grip, the muzzle +X).
  2. IN YOU'S HANDS, IN ALL FOUR SYSTEMS: each system's own render, called the way its own tool calls it: COMBAT's guns tool
     (tools/bohemia_combat_the_guns_in_their_hands.py) patched in memory the way ANIMATION's hold and idles tools already patch
     it (the gun list, the clip list, the folder; a gun's hold read from its class, '_KIND'; the hold tool's own PLACE for the
     held clips), and ANIMATION's melee render_props for the shield arm's pistol (its source given the gun's model in memory).
     YOU's bodies are rebuilt by each tool's own commands (COMBAT `bodies you`, the hold/melee and idles `pose`, a Stand
     render for the frame) and checked first: the class pistol re-rendered in the grid lands on the shipped cell.
  3. EVERY MAN: one set of renders, YOU's. Another man holds YOU's picture of the gun moved by where HIS class gun sits against
     YOU's class gun in the same cell (the median over the grid's 120 cells of the two guns' pixel centres, per look and gun
     class): his hands, not just his feet, so a 1.60 m woman and a 1.86 m Heavy hold it where their own pistol was.
  4. THE FIGHT: slices/fight_rig/own_guns.json (the row -> its model, the cells per system, each look's offset) and one sheet a
     gun (slices/fight_rig/own_guns/<gun>.webp, under 2048 x 1024); a marked block in slices/BOHEMIA_FIGHT.html draws the own
     gun in place of the class gun in all four systems, and only once its sheet is in (until then the class gun, as before).
  5. THE SHELF: the model's render on the bag's diagonal (slices/market_icons/own_<row>.png, COOK WEAPONS' shelf()).

    <bpy> tools/bohemia_cook_the_six_guns_11_3_26.py model [names]       reference/models/bohemia/gun_<model>.glb
    <bpy> tools/bohemia_cook_the_six_guns_11_3_26.py render <grid|hold|idle|shield|check> [guns]
    python3 tools/bohemia_cook_the_six_guns_11_3_26.py pack                 the sheets, the offsets, the index
    <bpy> tools/bohemia_cook_the_six_guns_11_3_26.py icon                   the shelf's render; then `shelf` (python3)

REUSE CHECK: COOK's gun kit and its three B guns; COMBAT's guns tool, ANIMATION's hold PLACE and melee render_props, patched
in memory as their own tools patch them, never edited; COOK WEAPONS' icon render and shelf; DIRECTION's master rig.
No bank opened: nothing in banks/ is a 3D model.
REFERENCE CHECK (the 9/4 standing law): each gun is judged in YOU's hands in the shipped fight's pixels beside the class gun
it replaces (the VOTE sheet, WAS beside NOW), and against the real thing's size: a half-inch pipe zip gun (21 mm pipe), a
J-frame snub (1.875 in barrel, 160 mm), a Model 336 carbine (980 mm), a bolt deer rifle with a 3-9x40 scope (1 in tube,
40 mm objective), a sawn-off side-by-side on a pistol grip (12 in barrels, 460 mm), an 870 with 18.5 in (990 mm).
Analog horror AH-01: scavenged, taped, worn. Battle Brothers draws every weapon its own sprite in the man's hand: the study.
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
OUTD = os.path.join(ROOT, 'records/target/cook_six_guns')
REND = 'records/target/cook_six_guns/renders'          # the renders (regenerated, .gitignore)
FIGHT_DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']

# the armory row -> its own model, the class it is held as (records/target/bb/weapons.json class -> DB.rig.guns.by_class)
SIX = {
    'zip_gun':           dict(model='gun_zip', kind='pistol', name='the zip gun',
                              say='a half-inch pipe on a pine 2x4 grip, two hose clamps, a nail for a striker pulled back on a rubber band'),
    'snub_revolver':     dict(model='gun_snub', kind='pistol', name='the snub revolver',
                              say='a blued two-inch revolver, five chambers, a bobbed hammer, a black rubber grip, white paint on the front sight'),
    'lever_rifle':       dict(model='gun_rifle_b', kind='rifle', name='the lever rifle',
                              say="COOK's lever carbine: the receiver bare steel, the forend wired to the barrel"),
    'scoped_deer_rifle': dict(model='gun_rifle_scoped', kind='rifle', name='the scoped deer rifle',
                              say='the bolt deer rifle with a 3-9x40 scope on two rings, the slipped front ring taped, the seatbelt sling'),
    'sawed_off':         dict(model='gun_shotgun_sawn', kind='shotgun', name='the sawed-off',
                              say='a side-by-side cut to the forend, the stock sawn to a pistol grip wound in tape, the cut ends filed bright'),
    'pump_shotgun':      dict(model='gun_shotgun_b', kind='shotgun', name='the pump shotgun',
                              say="COOK's pump gun: the ribbed wood slide, the cracked wrist held with two hose clamps"),
}
CLASS_MODEL = {'pistol': 'gun_pistol_a', 'rifle': 'gun_rifle_a', 'shotgun': 'gun_shotgun_a'}


# ------------------------------------------------------------------------------------------------ the models (bpy)
def zip_gun(bpy, mathutils):
    import bohemia_cook_model_guns as G
    M = G.mats(bpy); bl, st, wd, tp, pn = M['blued'], M['steel'], M['wood'], M['tape'], M['pine']
    G.xcyl(bpy, 'pipe', st, 0.0107, 0.0, 0.150, verts=16)                          # half-inch pipe, 21 mm across
    G.xcyl(bpy, 'bore', bl, 0.0070, 0.149, 0.1515, verts=12)                       # the bore, dark, at the muzzle
    G.xcyl(bpy, 'coupling', st, 0.0140, -0.032, 0.004, verts=16)                   # the breech: a coupling and its cap
    G.xcyl(bpy, 'cap', bl, 0.0128, -0.040, -0.030, verts=12)
    frame = [(-0.070, -0.008), (0.105, -0.008), (0.105, -0.034), (-0.030, -0.034), (-0.044, -0.040), (-0.070, -0.040)]
    G.slab(bpy, 'frame', pn, frame, 0.030, bevel=0.003)                            # a pine 2x4 offcut under the pipe
    G.tilted(bpy, 'grip', pn, (0.036, 0.032, 0.090), (-0.056, 0, -0.030), 16, bevel=0.005)
    for i, x in enumerate((0.022, 0.088)):                                         # two hose clamps round the pipe and the wood
        G.box(bpy, 'clamp_%d' % i, st, (0.009, 0.034, 0.050), (x, 0, -0.014), bevel=0.002)
        G.box(bpy, 'clamp_screw_%d' % i, st, (0.008, 0.008, 0.008), (x, -0.019, -0.002))
    G.rod(bpy, 'nail', st, (-0.040, 0, 0), (-0.068, 0, 0), 0.0022, verts=6)        # the striker: a nail through the cap
    G.cyl(bpy, 'nail_head', st, 0.0055, 0.002, (-0.069, 0, 0), rot=(0, math.pi / 2, 0), verts=10)
    for s in (-1, 1): G.rod(bpy, 'band_%d' % (s + 1), bl, (-0.068, s * 0.006, 0.001), (0.004, s * 0.016, -0.004), 0.0018, verts=6)   # the rubber band
    G.rod(bpy, 'trigger', st, (-0.034, 0, -0.040), (-0.038, 0, -0.056), 0.0022, verts=6)   # a bent screw-eye for a trigger
    for i, d in enumerate((0.034, 0.062)):                                          # grey tape twice round the grip
        G.tilted(bpy, 'tape_%d' % i, tp, (0.042, 0.037, 0.011), (-0.056 - 0.276 * d, 0, -0.030 - 0.961 * d), 16, bevel=0.002)
    G.to_grip(bpy, (-0.066, -0.066))


def snub_revolver(bpy, mathutils):
    import bohemia_cook_model_guns as G
    M = G.mats(bpy); bl, st, wd, tp, pn = M['blued'], M['steel'], M['wood'], M['tape'], M['pine']
    G.xcyl(bpy, 'barrel', bl, 0.0082, 0.026, 0.074)                                # 1.875 inches
    G.box(bpy, 'rib', bl, (0.046, 0.007, 0.005), (0.052, 0, 0.0090), bevel=0.0015)
    G.box(bpy, 'front_sight', bl, (0.012, 0.004, 0.008), (0.066, 0, 0.0135), rot=(0, math.radians(-14), 0))
    G.box(bpy, 'sight_paint', pn, (0.004, 0.0045, 0.004), (0.070, 0, 0.0150))     # the odd thing: white paint on the sight
    G.xcyl(bpy, 'muzzle', st, 0.0050, 0.073, 0.076, verts=10)                       # the crown worn bright
    cy = G.xcyl(bpy, 'cylinder', st, 0.0170, -0.012, 0.024, z=-0.012, verts=20)     # five rounds
    for k in range(5):
        a = math.radians(36 + 72 * k)
        G.cut(bpy, cy, (0.024, 0.006, 0.0040), (0.006, 0.0175 * math.sin(a), -0.012 + 0.0175 * math.cos(a)), (-a, 0, 0))
    G.box(bpy, 'top_strap', bl, (0.044, 0.015, 0.006), (0.006, 0, 0.0080), bevel=0.0015)
    G.box(bpy, 'frame_front', bl, (0.010, 0.019, 0.030), (0.028, 0, -0.008), bevel=0.002)
    G.box(bpy, 'recoil_shield', bl, (0.014, 0.022, 0.034), (-0.019, 0, -0.011), bevel=0.002)
    G.box(bpy, 'frame_bottom', bl, (0.048, 0.017, 0.008), (0.003, 0, -0.033), bevel=0.0015)
    G.box(bpy, 'hammer', bl, (0.009, 0.007, 0.010), (-0.027, 0, 0.006), rot=(0, math.radians(-35), 0), bevel=0.0015)   # bobbed
    G.tilted(bpy, 'grip', bl, (0.033, 0.031, 0.066), (-0.030, 0, -0.022), 20, bevel=0.011)   # a black rubber grip, round butt
    for i in range(4): G.tilted(bpy, 'finger_%d' % i, bl, (0.035, 0.0315, 0.004), (-0.026 - 0.006 * i, 0, -0.030 - 0.013 * i), 20, bevel=0.0015)
    G.guard(bpy, bl, (-0.022, -0.034), (-0.027, 0.011), (0.016, -0.036))
    G.box(bpy, 'trigger', st, (0.006, 0.006, 0.016), (-0.007, 0, -0.040), rot=(0, math.radians(15), 0), bevel=0.0015)
    G.to_grip(bpy, (-0.044, -0.052))


def scoped_deer_rifle(bpy, mathutils):
    import bohemia_cook_model_guns as G
    G.rifle_a(bpy, mathutils)                                                        # COOK's bolt deer rifle, as built
    gx, gz = G.GRIP['rifle_a']
    M = {m.name: m for m in bpy.data.materials}; bl, st, tp = M['gunmetal'], M['steel_worn'], M['tape']
    z = 0.052
    def at(x, zz): return (x - gx, 0, zz - gz)
    def xc(name, m, r, x0, x1, verts=16):
        o = G.xcyl(bpy, name, m, r, x0 - gx, x1 - gx, z=z - gz, verts=verts); return o
    xc('scope_tube', bl, 0.0127, -0.110, 0.180)                                       # a one-inch tube
    bpy.ops.mesh.primitive_cone_add(vertices=18, radius1=0.0127, radius2=0.0225, depth=0.050, location=at(0.205, z), rotation=(0, math.pi / 2, 0))
    G.put(bpy, bpy.context.active_object, 'objective_bell', bl)
    xc('objective', bl, 0.0225, 0.230, 0.272, verts=18)                               # 40 mm glass
    xc('objective_glass', st, 0.0190, 0.271, 0.274, verts=18)
    bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=0.0190, radius2=0.0127, depth=0.040, location=at(-0.130, z), rotation=(0, math.pi / 2, 0))
    G.put(bpy, bpy.context.active_object, 'eyepiece_bell', bl)
    xc('eyepiece', bl, 0.0190, -0.200, -0.150, verts=16)
    G.box(bpy, 'turret_top', bl, (0.022, 0.022, 0.020), at(0.030, z + 0.020), bevel=0.002)
    G.box(bpy, 'turret_side', bl, (0.022, 0.020, 0.022), (0.030 - gx, -0.020, z - gz), bevel=0.002)
    for i, x in enumerate((-0.070, 0.050)):                                           # two rings on their bases
        G.box(bpy, 'ring_%d' % i, st, (0.016, 0.031, 0.034), at(x, z), bevel=0.003)
        G.box(bpy, 'base_%d' % i, bl, (0.022, 0.016, 0.030), at(x, 0.025), bevel=0.002)
    G.ring(bpy, 'ring_tape', tp, 0.0142, 0.016, 0.050 - gx + 0.017, z=z - gz)         # the odd thing: the slipped front ring taped


def sawed_off(bpy, mathutils):
    import bohemia_cook_model_guns as G
    M = G.mats(bpy); bl, st, wd, tp, pn = M['blued'], M['steel'], M['wood'], M['tape'], M['pine']
    for s in (-1, 1):
        G.xcyl(bpy, 'barrel_%d' % (s + 1), bl, 0.0115, 0.0, 0.250, y=s * 0.0115, verts=20)
        G.xcyl(bpy, 'cut_%d' % (s + 1), st, 0.0116, 0.244, 0.251, y=s * 0.0115, verts=20)   # the hacksaw's ends, filed bright
    G.box(bpy, 'rib_top', st, (0.250, 0.008, 0.004), (0.125, 0, 0.0125))
    G.box(bpy, 'forend', wd, (0.150, 0.040, 0.022), (0.085, 0, -0.020), bevel=0.006)
    G.box(bpy, 'action', st, (0.090, 0.046, 0.050), (-0.045, 0, -0.008), bevel=0.004)
    G.box(bpy, 'top_lever', bl, (0.032, 0.010, 0.006), (-0.074, 0, 0.0195), rot=(0, 0, math.radians(25)), bevel=0.0015)
    for s in (-1, 1): G.box(bpy, 'hammer_%d' % (s + 1), bl, (0.010, 0.007, 0.022), (-0.083, s * 0.012, 0.016), rot=(0, math.radians(-30), 0), bevel=0.0015)
    for i, x in enumerate((-0.050, -0.035)): G.box(bpy, 'trigger_%d' % i, bl, (0.006, 0.005, 0.016), (x, 0, -0.042), bevel=0.0012)
    G.guard(bpy, bl, (-0.080, -0.033), (-0.072, -0.018), (-0.010, -0.033))
    grip = [(-0.088, 0.012), (-0.135, -0.004), (-0.168, -0.040), (-0.196, -0.104), (-0.212, -0.150), (-0.172, -0.162),
            (-0.150, -0.112), (-0.122, -0.062), (-0.088, -0.034)]
    G.slab(bpy, 'grip', wd, grip, 0.036)                                              # the stock sawn off to a pistol grip
    G.tilted(bpy, 'cut_end', pn, (0.044, 0.037, 0.004), (-0.192, 0, -0.156), -74)       # the saw's face, raw
    for i, d in enumerate((0.0, 0.022, 0.044)):                                       # black tape wound round the grip
        G.tilted(bpy, 'tape_%d' % i, tp, (0.050, 0.040, 0.014), (-0.150 - 0.42 * d, 0, -0.060 - 0.91 * d), 25, bevel=0.002)
    G.to_grip(bpy, (-0.152, -0.080))


BUILT = dict(gun_zip=zip_gun, gun_snub=snub_revolver, gun_rifle_scoped=scoped_deer_rifle, gun_shotgun_sawn=sawed_off)


def do_model(names):
    import bohemia_cook_model_guns as G
    for n in names:
        m = SIX[n]['model']
        if m not in BUILT: continue
        G.BUILDERS[m] = BUILT[m]
        print('MODEL', n, G.build(m, os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % m)), flush=True)


# ------------------------------------------------------------------------------------------------ in YOU's hands (bpy)
# each system: the folder whose rig.json gives YOU's frame (each tool's own Stand render), and how it is drawn
SYSTEMS = {'grid': 'records/target/combat/rig', 'hold': 'records/target/animation/hold', 'idle': 'records/target/animation/idles',
           'shield': 'records/target/animation/melee'}


def hold_src():
    import bohemia_animation_what_a_man_holds as H
    return H, H.source()


def idle_keys():
    import bohemia_animation_everybody_idles as I
    return len(I.source()['sets']['carry']['poses'])


def system_clips(system, kind):
    """(clip, keys) a gun of this class is rendered on in this system: the grid's five (COMBAT's guns tool), the held clips of
    its class (ANIMATION's hold source), the carry idles (ANIMATION's idles source)"""
    if system == 'grid': return [('Carry', 1), ('CarryWalk', 6), ('Aim', 3), ('Hit', 2), ('Swing', 3)]
    if system == 'idle': return [('IdleCarry', idle_keys())]
    if system == 'hold':
        H, D = hold_src(); keys = dict(H.clip_list(D))
        return [(c, keys[c]) for c in D['guns'][kind]]
    raise KeyError(system)


def out_dir(system, gun): return os.path.join(ROOT, REND, '%s_%s' % (system, gun), 'you')


def staged(system, gun):
    """the render folder for one gun in one system: YOU's rig.json from that system's own Stand render, copied"""
    d = out_dir(system, gun); os.makedirs(d, exist_ok=True)
    src = os.path.join(ROOT, SYSTEMS[system], 'you', 'rig.json')
    if not os.path.exists(src): raise SystemExit('YOU is not built for %s: %s (COMBAT bodies you, then each tool\'s pose and a Stand render)' % (system, src))
    open(os.path.join(d, 'rig.json'), 'w').write(open(src).read())
    gi = os.path.join(ROOT, REND, '.gitignore')
    if not os.path.exists(gi): open(gi, 'w').write('*\n!.gitignore\n')
    return d


def guns_prog(system, gun, model, kind):
    """COMBAT's guns tool, patched in memory the way ANIMATION's hold and idles tools patch it (never edited): this one gun,
    its class's hold ('_KIND'), this system's clips and folder, the hold tool's own PLACE for the held clips, one thread"""
    code = open(os.path.join(ROOT, 'tools/bohemia_combat_the_guns_in_their_hands.py')).read()
    a = "CLIPS = [('Carry', 1), ('CarryWalk', 6), ('Aim', 3), ('Hit', 2), ('Swing', 3)]"
    c = "RENDERS = 'records/target/combat/rig'"
    e = "GUNS = {'pistol': 'gun_pistol_a', 'rifle': 'gun_rifle_a', 'shotgun': 'gun_shotgun_a'}"
    b = "            if clip == 'Aim':"
    bi = "elif clip in ('Carry', 'CarryWalk'):"
    z = "        zs = rj['z_stretch']; root.scale = (k, k, k * zs)"
    t = "sc.cycles.samples = 24;"
    for s in (a, b, bi, c, e, z, t): assert code.count(s) == 1, 'COMBAT\'s guns tool changed: re-read it before patching in memory'
    assert code.count("gun == 'pistol'") == 4 and code.count("gun != 'pistol'") == 1, 'COMBAT\'s guns tool changed its holds'
    code = code.replace("gun == 'pistol'", "_KIND[gun] == 'pistol'").replace("gun != 'pistol'", "_KIND[gun] != 'pistol'")
    code = code.replace(a, "CLIPS = %r" % system_clips(system, kind))
    code = code.replace(c, "RENDERS = %r" % os.path.dirname(os.path.relpath(out_dir(system, gun), ROOT)))
    code = code.replace(e, "GUNS = {%r: %r}\n_KIND = {%r: %r}\n_ZS = 1.0\n" % (gun, model, gun, kind))
    code = code.replace(t, "sc.render.threads_mode = 'FIXED'; sc.render.threads = %d; " % int(os.environ.get('BOHEMIA_RIG_THREADS', '1')) + t)
    if system == 'idle': code = code.replace(bi, "elif clip in ('Carry', 'CarryWalk', 'IdleCarry'):")
    if system == 'hold':
        H, _ = hold_src()
        code = code.replace(z, "        zs = rj['z_stretch']; globals()['_ZS'] = zs; root.scale = (k, k, k * zs)")
        code = code.replace(b, "            _h = _hold_place(clip, gun, rw, lw, re, fwd, up)\n            if _h: grip, bar = _h\n            elif clip == 'Aim':")
        code = code.replace("_ZS = 1.0\n", "_ZS = 1.0\n" + H.PLACE, 1)
    code = code.replace("if __name__ == '__main__':", "if False:")
    return ('import sys; sys.argv = [%r]; __file__ = %r\n' % ('guns', os.path.join(ROOT, 'tools/bohemia_combat_the_guns_in_their_hands.py'))) + code + '\nrender(%r)\n' % 'you'


def shield_prog(gun, model):
    """ANIMATION's melee render_props for the shield arm's pistol (layer s1, prop 'pistol'), its source given this gun's model
    and its folder pointed here, in memory; nothing of ANIMATION's edited"""
    return ('import sys, json; sys.path.insert(0, %r)\n' % os.path.join(ROOT, 'tools') +
            'import bohemia_animation_melee_in_hand as A\n'
            '_src = A.source\n'
            'def _mine():\n    S = _src(); S["props"]["pistol"] = dict(S["props"]["pistol"], model=%r); return S\n' % model +
            'A.source = _mine; A.RENDERS = %r\n' % os.path.dirname(os.path.relpath(out_dir('shield', gun), ROOT)) +
            'A.render_props("you", ["pistol"], layer="s1")\n')


def expected(system, gun, kind):
    """every picture one gun is rendered as in one system: (clip, key, facing, file)"""
    d = out_dir(system, gun)
    if system == 'shield':
        import bohemia_animation_melee_in_hand as A
        return [(c, k, f, os.path.join(d, 'props', fn)) for c, k, f, fn in A.prop_files('s1', 'pistol')]
    return [(c, k, f, os.path.join(d, 'guns', '%s_%s_%s_k%02d.png' % (gun, c, f, k))) for c, n in system_clips(system, kind) for f in FIGHT_DIRS for k in range(n)]


def jobs_of(guns, systems):
    out = []
    for s in systems:
        for g in guns:
            if g == 'check':
                if s == 'grid': out.append((s, g, 'gun_pistol_a', 'pistol'))
                continue
            kind = SIX[g]['kind']
            if s == 'shield' and kind != 'pistol': continue   # the shield arm holds a one-hand gun only (rig_melee s1)
            out.append((s, g, SIX[g]['model'], kind))
    return out


def do_render(guns, systems, workers=4):
    """every (system, gun) a worker, a fresh Blender each (bpy 4.2 dies at exit now and then, after the frames are written:
    a job whose pictures are not all in runs again, three times at most)"""
    import time
    jobs = [j for j in jobs_of(guns, systems) if not all(os.path.exists(x[3]) for x in expected(j[0], j[1], j[3]))]
    tries = {}; procs = []; py = sys.executable
    env = dict(os.environ, BOHEMIA_RIG_THREADS=str(max(1, (os.cpu_count() or 4) // workers)))
    t0 = time.time()
    while jobs or procs:
        while jobs and len(procs) < workers:
            j = jobs.pop(0); s, g, m, k = j; staged(s, g); tries[j] = tries.get(j, 0) + 1
            prog = shield_prog(g, m) if s == 'shield' else guns_prog(s, g, m, k)
            procs.append((j, subprocess.Popen([py, '-c', prog], cwd=ROOT, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)))
        time.sleep(2)
        for j, p in list(procs):
            if p.poll() is None: continue
            procs.remove((j, p)); ok = all(os.path.exists(x[3]) for x in expected(j[0], j[1], j[3]))
            print('RENDER', j[0], j[1], 'done' if ok else 'AGAIN', round(time.time() - t0), flush=True)
            if not ok:
                if tries[j] >= 3: raise SystemExit('RENDER FAILED %s %s: %s' % (j[0], j[1], (p.stderr.read() or '')[-800:]))
                jobs.append(j)


# ------------------------------------------------------------------------------------------------ the pack (python3)
GRID_CLIPS = {'Carry': 'carry', 'CarryWalk': 'carrywalk', 'Aim': 'aim', 'Hit': 'hit', 'Swing': 'swing'}   # the master rig's -> the fight's


def do_pack():
    """each gun's pictures from all four systems on one sheet (the guns tool's cut: the guide's alpha threshold, the dark day
    rim), each cell [x, y, w, h, dx, dy] from YOU's fight-cell origin (his feet are the one point every system knows); each
    look's shift per class: his feet against YOU's, plus where his own class gun sits against YOU's (the median over the grid)"""
    import numpy as np
    from PIL import Image
    G = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')))['rig']; thr = G['alpha_threshold']
    FR = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'))); RIM = tuple(FR['rim']); Y = FR['looks']['you']
    def cut(a):   # ANIMATION's melee pack cut, line for line: the gun's pixels, the rim round them, cropped
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
        for i, (a_, _, _) in enumerate(items): im.paste(Image.fromarray(a_, 'RGBA'), (rects[i][0], rects[i][1]))
        return im, rects
    od = os.path.join(ROOT, 'slices/fight_rig/own_guns'); os.makedirs(od, exist_ok=True)
    idx = dict(version='own-guns-11-3', lane='cook (COOK GUNS)', rule='337 (ask line 344)', record='records/BOHEMIA_COOK_THE_SIX_GUNS_11_3_26.md',
               src='each gun its own model (reference/models/bohemia/<model>.glb) rendered in YOU\'s hands in all four systems by each '
                   'system\'s own render (tools/bohemia_cook_the_six_guns_11_3_26.py); another man holds YOU\'s picture moved by his shift',
               cell="[x, y, w, h, dx, dy]: the cell on the gun's sheet and where its top left sits from YOU's fight-cell origin",
               dirs=FIGHT_DIRS, from_look='you', by_row={r: r for r in SIX}, kind={r: SIX[r]['kind'] for r in SIX},
               model={r: SIX[r]['model'] for r in SIX}, guns={}, shift={})
    H, HD = hold_src()
    idle_names = list(__import__('bohemia_animation_everybody_idles').source()['sets']['carry']['poses'])
    for gun, g in SIX.items():
        items, maps = [], {}
        for system in SYSTEMS:
            if system == 'shield' and g['kind'] != 'pistol': continue
            rj = json.load(open(os.path.join(out_dir(system, gun), 'rig.json'))); cx0, cy0 = rj['crop_box_px'][:2]
            fx0, fy0 = cx0 + rj['ground_px'][0] - Y['foot'][0], cy0 + rj['ground_px'][1] - Y['foot'][1]
            ex = expected(system, gun, g['kind'])
            if not all(os.path.exists(x[3]) for x in ex): raise SystemExit('NOT RENDERED %s %s' % (system, gun))
            M = maps.setdefault(system, {})
            for clip, k, f, fn in ex:
                r = cut(np.asarray(Image.open(fn).convert('RGBA')))
                ix = None
                if r is not None: ix = len(items); items.append((r[0], r[1] - fx0, r[2] - fy0))
                if system == 'grid': key = GRID_CLIPS[clip]
                elif system == 'idle': key = None
                else: key = clip
                if system == 'idle': M.setdefault(idle_names[k], [None] * 8)[FIGHT_DIRS.index(f)] = ix
                else:
                    n = max(k_ for c_, k_, _, _ in ex if c_ == clip) + 1
                    M.setdefault(key, [[None] * 8 for _ in range(n)])[k][FIGHT_DIRS.index(f)] = ix
        im, rects = shelf(items, 1024)
        if im.size[1] > 1024: im, rects = shelf(items, 2048)
        assert im.size[0] <= 2048 and im.size[1] <= 1024, ('rule 173: no sheet over 2048 x 1024', gun, im.size)
        fn = os.path.join(od, gun + '.webp'); im.save(fn, 'WEBP', lossless=True, quality=100, method=6)
        idx['guns'][gun] = dict(file='own_guns/%s.webp' % gun, size=list(im.size), cells=rects, **maps)
        print('PACKED', gun, im.size, os.path.getsize(fn), 'cells', len(rects), flush=True)
    # each look's shift: where HIS class gun sits against YOU's in the same picture (the same system, clip, key and facing),
    # the median over the keys, per (system, clip, facing); his feet against YOU's are added in the fight (L.foot - YOU's)
    shifts, tables, residual = {}, [], []
    you_c = {kind: centres_of(np, Image, 'you', Y, kind, FR) for kind in FR['guns']['order']}
    for look, L in sorted(FR['looks'].items()):
        if not L.get('guns'): continue
        sh = {}
        for kind in FR['guns']['order']:
            mine = you_c[kind] if look == 'you' else centres_of(np, Image, look, L, kind, FR)
            T, res = shift_table(np, mine, you_c[kind]); residual += res
            key = json.dumps(T, sort_keys=True)
            if key not in shifts: shifts[key] = len(tables); tables.append(T)
            sh[kind] = shifts[key]
        idx['shift'][look] = sh
    idx['shift_tables'] = tables
    idx['shift_about'] = ("shift[look][class] -> a table: g (the grid: clip -> 8 facings), h (the held clips), i (the idles: 8 facings), "
                          "a (his whole median): [dx, dy] px of where his class gun sits against YOU's in the same picture; the fight adds "
                          "his feet against YOU's (L.foot - you.foot). The shield arm's pistol is YOU's, moved by the feet only.")
    json.dump(idx, open(os.path.join(ROOT, 'slices/fight_rig/own_guns.json'), 'w'), separators=(',', ':'))
    print('INDEX', len(idx['guns']), 'guns', len(idx['shift']), 'looks', len(tables), 'tables',
          os.path.getsize(os.path.join(ROOT, 'slices/fight_rig/own_guns.json')), 'residual p50 %.2f p90 %.2f px' % (np.percentile(residual, 50), np.percentile(residual, 90)))
    json.dump(dict(residual_p50=float(np.percentile(residual, 50)), residual_p90=float(np.percentile(residual, 90)), pictures=len(residual)),
              open(os.path.join(OUTD, 'shift_fit.json'), 'w'))


def centres_of(np, Image, look, L, kind, FR):
    """the pixel centre, from his feet, of his CLASS gun in every picture of the three per-look systems:
    {('g'|'h'|'i', clip, key, facing): (x, y)}; the grid off fight_rig, the held clips off rig_hold, the idles off rig_idles"""
    out = {}; S = {}
    def img(p):
        if p not in S: S[p] = np.asarray(Image.open(p).convert('RGBA'))[..., 3] == 255
        return S[p]
    kr = FR['guns']['order'].index(kind)
    a = img(os.path.join(ROOT, 'slices/fight_rig', L['guns']))
    for clip, cols in FR['guns']['clips'].items():
        for k, c in enumerate(cols):
            for f in range(8):
                ys, xs = np.nonzero(a[(kr * 8 + f) * L['h']:(kr * 8 + f + 1) * L['h'], c * L['w']:(c + 1) * L['w']])
                if len(xs) > 3: out[('g', clip, k, f)] = (xs.mean() - L['foot'][0], ys.mean() - L['foot'][1])
    def cells(tag, js, dirn, table):
        p = os.path.join(ROOT, dirn, js)
        if not os.path.exists(p): return
        G = json.load(open(p)).get('guns') or {}
        if not G.get('file') or not os.path.exists(os.path.join(ROOT, dirn, G['file'])): return
        a_ = img(os.path.join(ROOT, dirn, G['file']))
        for clip, keys in table(G).items():
            for k, row in enumerate(keys):
                for f, ix in enumerate(row):
                    if ix is None: continue
                    x, y, w, h, dx, dy = G['cells'][ix]
                    ys, xs = np.nonzero(a_[y:y + h, x:x + w])
                    if len(xs) > 3: out[(tag, clip, k, f)] = (xs.mean() + dx - L['foot'][0], ys.mean() + dy - L['foot'][1])
    cells('h', look + '.json', 'slices/rig_hold', lambda G: G.get('clips', {}).get(kind, {}))
    ij = 'fight_%s.json' % look if os.path.exists(os.path.join(ROOT, 'slices/rig_idles', 'fight_%s.json' % look)) else look + '.json'
    cells('i', ij, 'slices/rig_idles', lambda G: {'IdleCarry': list(G.get('poses', {}).get(kind, {}).values())})
    return out


def shift_table(np, mine, you):
    """the median of his class gun against YOU's per (system, clip, facing) (the idles per facing), his whole median where a
    group has no picture in both; and how far each picture sits from its group's median (the fit, for the record)"""
    both = [k for k in mine if k in you]
    d = {k: (mine[k][0] - you[k][0], mine[k][1] - you[k][1]) for k in both}
    med = lambda v: [int(round(float(np.median([x[0] for x in v])))), int(round(float(np.median([x[1] for x in v]))))]
    T = dict(a=med(list(d.values())) if d else [0, 0], g={}, h={}, i=[None] * 8); res = []
    groups = {}
    for (s, clip, k, f), v in d.items(): groups.setdefault((s, clip if s != 'i' else None, f), []).append(v)
    for (s, clip, f), v in groups.items():
        m = med(v); res += [float(np.hypot(x[0] - m[0], x[1] - m[1])) for x in v]
        if s == 'i': T['i'][f] = m
        else: T[s].setdefault(clip, [None] * 8)[f] = m
    return T, res


def do_manifest(names):
    """reference/models/bohemia/items.json: each gun its own entry (its glb, its sha1, 'was' the class it was drawn as), its row
    moved off the class entry (COOK WEAPONS' manifest step: a weapon modelled as its own owns its row)"""
    import hashlib
    mp = os.path.join(ROOT, 'reference/models/bohemia/items.json'); M = json.load(open(mp))
    for n in names:
        g = SIX[n]; fn = os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % g['model'])
        for k, e in M['items'].items():
            if k != n and n in e.get('rows', []): e['rows'] = [r for r in e['rows'] if r != n]
        M['items'][n] = dict(glb=g['model'] + '.glb', kind='held', name=g['name'].replace('the ', ''), say=g['say'],
                             made='COOK GUNS 11/3 (tools/bohemia_cook_the_six_guns_11_3_26.py)' if g['model'] in BUILT else 'COOK 10/19 (tools/bohemia_cook_model_guns.py), its own row 11/3',
                             rows=[n], sha1=hashlib.sha1(open(fn, 'rb').read()).hexdigest(), hands=1 if g['kind'] == 'pistol' else 2, was=g['kind'])
    json.dump(M, open(mp, 'w'), indent=1)
    print('MANIFEST', len(M['items']), 'items')


def do_sheet():
    """the proof's frames (the shipped fight, his phone) into one moving sheet: a row a gun, WAS (the class gun it was drawn as)
    beside NOW (its own), every row in step: he turns through the eight facings holding it (300 ms a facing), then the shot,
    six keys on one beat at 120 BPM (83 ms a key), held (COOK WEAPONS' sheet, its layout)"""
    from PIL import Image, ImageDraw
    P = json.load(open(os.path.join(OUTD, 'proof.json'))); D = os.path.join(OUTD, 'proof')
    k = 0.3; dpr = 3; names = [n for n in SIX if n in P]
    def frames(n, mode):
        r = P[n][mode]; bx, me = r['box'], r['me']; W, H = bx['width'] * dpr, bx['height'] * dpr
        out = []
        for f in range(8):
            c = Image.new('RGB', (W, H), (24, 22, 20)); im = Image.open(os.path.join(D, '%s_%s_turn%d.png' % (n, mode, f))).convert('RGB')
            c.paste(im, ((me['x'] - bx['x']) * dpr, (me['y'] - bx['y']) * dpr)); out.append(c)
        for b in range(6): out.append(Image.open(os.path.join(D, '%s_%s_shot%d.png' % (n, mode, b))).convert('RGB'))
        return [im.resize((int(im.width * k), int(im.height * k)), Image.BOX) for im in out]
    cells = [(n, frames(n, 'before'), frames(n, 'after')) for n in names]
    cw = max(c[1][0].width for c in cells); ch = max(c[1][0].height for c in cells); lab = 18; gap = 6
    W = cw * 2 + gap * 3; H = (ch + lab + gap) * len(cells) + gap
    seq = []
    for f in range(14):
        S = Image.new('RGB', (W, H), (24, 22, 20)); d = ImageDraw.Draw(S)
        for i, (n, bf, af) in enumerate(cells):
            y = gap + i * (ch + lab + gap)
            d.text((gap, y + 3), '%s  WAS: drawn as the %s' % (SIX[n]['name'].upper(), SIX[n]['kind']), fill=(200, 190, 170))
            d.text((gap * 2 + cw, y + 3), 'NOW: ITS OWN MODEL', fill=(240, 200, 120))
            S.paste(bf[f].resize((cw, ch)) if bf[f].size != (cw, ch) else bf[f], (gap, y + lab)); S.paste(af[f].resize((cw, ch)) if af[f].size != (cw, ch) else af[f], (gap * 2 + cw, y + lab))
        seq.append(S)
    dur = [300] * 8 + [83] * 5 + [600]
    sp = os.path.join(OUTD, 'sheet.webp'); seq[0].save(sp, 'WEBP', save_all=True, append_images=seq[1:], duration=dur, loop=0, quality=78, method=6)
    fa = [gap * 2 + cw, gap + lab, cw, ch]
    first = [im.crop((fa[0], fa[1], fa[0] + fa[2], fa[1] + fa[3])) for im in seq]
    fp = os.path.join(OUTD, 'first.webp'); first[0].save(fp, 'WEBP', save_all=True, append_images=first[1:], duration=dur, loop=0, quality=80, method=6)
    seq[13].save(os.path.join(OUTD, 'sheet_still.png'))
    print('SHEET', sp, seq[0].size, os.path.getsize(sp), 'first', fp, fa)
    return sp, fp, fa


def do_vote(sha):
    """the card in the VOTE tab (records/target/BOHEMIA_VOTE_REGISTRY.json), appended as text (other rows byte for byte)"""
    sp, fp, fa = do_sheet()
    rp = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'); R = json.load(open(rp))
    iid = 'cook-the-six-guns-11-3'
    if any(x.get('id') == iid for x in R['items']): print('VOTE', iid, 'already registered: left as it is'); return
    it = dict(id=iid, kind='animation', lane='cook', sha=sha, made='11/3',
              title='THE SIX GUNS: ZIP GUN, SNUB, LEVER RIFLE, SCOPED DEER RIFLE, SAWED-OFF, PUMP, EACH ITS OWN 3D MODEL IN HIS HANDS',
              said="you build the bosses like shit, we don't have enough assets, and you're not creating assets, weapons, armor, the vibe, nothing",
              why=('These six were drawn in his hands as the plain pistol, rifle and shotgun; now each is its own model made the clay way, held in '
                   'all eight facings and fired on the beat, by him and by the man across from him. Old one left, new one right. Same in every '
                   'fight and on the shop shelf.'),
              options=['A, yes, these are the guns', 'B, close, push the look further', 'C, no, not like this'],
              show=dict(how='image', src='../' + os.path.relpath(sp, ROOT), first='../' + os.path.relpath(fp, ROOT), firstAt=fa),
              twin=dict(src='slices/fight_rig/you_guns.webp',
                        diffs=['METHOD: the twin is the sheet the fight drew these from until now (the class pistol, rifle and shotgun on every key of '
                               'YOU); mine is each gun\'s own glb through the same master rig, the same body, camera and sun, in all four of a gun\'s pictures.',
                               'SIZE: true size at the rig\'s 57 px a metre, one ruler with the man: the snub is 0.14 m against the class pistol\'s 0.23, '
                               'the sawed-off 0.46 m against the class shotgun\'s 0.65, the scoped rifle carries 40 mm of glass on top.',
                               'LOOK: COOK\'s five gun materials, every one a palette step; the zip gun is raw pine and galvanised pipe, the snub blued with '
                               'a black rubber grip, the sawed-off\'s cut ends filed bright.']),
              before_after=dict(before='each gun drawn as its class model in his hand (the pistol, the rifle, the shotgun)',
                                after='each its own glb through the master rig, in YOU\'s hands on every key; every man holds those pictures at his own hands',
                                scale='his phone, 390 x 844 at 3x, the fight zoomed on the man'),
              draft=True)
    txt = open(rp).read(); anchor = '\n ],\n "verdicts"'
    blk = '\n'.join('  ' + l for l in json.dumps(it, indent=1).split('\n'))
    i = txt.index(anchor); txt = txt[:i] + ',\n' + blk + txt[i:]
    assert json.loads(txt)['items'][-1]['id'] == iid
    open(rp, 'w').write(txt)
    print('VOTE', iid)


def do_shelf(names):
    """the shop's tile wears the model: its icon render halved with a box filter into slices/market_icons/own_<row>.png; the
    settlement screen's own-model block is COOK WEAPONS' shelf() run again (it lists every own_<row>.png), never a second block"""
    from PIL import Image
    import bohemia_cook_every_weapon_its_own_11_3_26 as CW
    for n in names:
        im = Image.open(os.path.join(OUTD, 'alone_' + n, 'icon.png')).convert('RGBA')
        im = im.crop(im.getbbox()); im = im.resize((max(1, im.width // 2), max(1, im.height // 2)), Image.BOX)
        im.putalpha(im.split()[3].point(lambda v: 255 if v > 96 else 0))
        im.save(os.path.join(ROOT, 'slices/market_icons/own_%s.png' % n), optimize=True)
    p = os.path.join(ROOT, 'slices/market_icons/SOURCES.txt'); t = open(p).read()
    for n in names:
        if ('own_%s (11/3' % n) not in t:
            t = t.rstrip('\n') + '\nown_%s (11/3, COOK GUNS [the six guns], rule 337): not a pack tile; reference/models/bohemia/%s.glb through the master rig on the bag\'s diagonal (tools/bohemia_cook_the_six_guns_11_3_26.py shelf)\n' % (n, SIX[n]['model'])
    open(p, 'w').write(t)
    CW.do_shelf([])


def do_alone(names, icon=False):
    """each gun alone through the master rig's light (COOK WEAPONS' alone and icon renders, the same camera and light, read
    from a gun glb): side-on at 3 px a centimetre for the sheet; icon, on the bag's diagonal, 176 px"""
    import bpy, mathutils
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    for n in names:
        out = os.path.join(OUTD, 'alone_' + n); os.makedirs(out, exist_ok=True)
        bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
        before = set(o.name for o in sc.objects)
        bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % SIX[n]['model']))
        for o in [o for o in sc.objects if o.name not in before and o.type == 'MESH' and o.name.startswith('Icosphere') and len(o.data.vertices) == 42]:
            bpy.data.objects.remove(o, do_unlink=True)
        parts = [o for o in sc.objects if o.name not in before and o.type == 'MESH']
        if icon:
            top = [o for o in sc.objects if o.name not in before and o.parent is None]
            root = bpy.data.objects.new('turn', None); sc.collection.objects.link(root)
            for o in top: o.parent = root
            root.rotation_euler = (0, math.radians(-35), 0)   # true girth: a gun's body is its read, never a hairline at 88 px
        bpy.context.view_layer.update()
        MR.source_pass(parts, float(MR.G['wear']), 1.0, 0)
        vs = [o.matrix_world @ v.co for o in parts for v in o.data.vertices]
        lo = mathutils.Vector([min(v[i] for v in vs) for i in range(3)]); hi = mathutils.Vector([max(v[i] for v in vs) for i in range(3)])
        c = (lo + hi) / 2
        cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
        cam.rotation_euler = (math.radians(90), 0, 0); cam.location = (c.x, lo.y - 2.0, c.z)
        if icon:
            cd.ortho_scale = max(hi.x - lo.x, hi.z - lo.z) * 22.0 / 20.0; sc.render.resolution_x = sc.render.resolution_y = 176
        else:
            rx, ry = int((hi.x - lo.x) * 300) + 24, int((hi.z - lo.z) * 300) + 24
            cd.ortho_scale = max(rx, ry) / 300.0; sc.render.resolution_x, sc.render.resolution_y = rx, ry
        MR.light_and_film(sc, dict(sun_rot=list(MR.G['sun_rot_deg'])))
        sc.cycles.samples = 32; sc.render.film_transparent = True
        sc.render.filepath = os.path.join(out, 'icon.png' if icon else 'side.png'); bpy.ops.render.render(write_still=True)
        print('ALONE', n, 'icon' if icon else 'side', flush=True)


if __name__ == '__main__':
    cmd, a = sys.argv[1], sys.argv[2:]
    names = [x for x in (a or list(SIX)) if x in SIX] or list(SIX)
    if cmd == 'model': do_model(names)
    elif cmd == 'alone': do_alone(names)
    elif cmd == 'icon': do_alone(names, icon=True)
    elif cmd == 'render':
        systems = [x for x in a if x in SYSTEMS] or list(SYSTEMS)
        guns = [x for x in a if x in SIX or x == 'check'] or list(SIX)
        do_render(guns, systems, int(os.environ.get('BOHEMIA_WORKERS', '4')))
    elif cmd == 'pack': do_pack()
    elif cmd == 'shelf': do_shelf(names)
    elif cmd == 'manifest': do_manifest(names)
    elif cmd == 'sheet': do_sheet()
    elif cmd == 'vote': do_vote(a[0])
    else: sys.exit('model | alone | icon | render | pack | shelf')
