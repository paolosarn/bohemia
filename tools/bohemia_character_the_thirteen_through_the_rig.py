#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [the thirteen through the rig]: THE RUNWAY CLOTHES MODELLED ON THE BODY (rule 115c; his NO on
the texture set: 'the whole shit looked glitchy and fucked up'). Cutting flat garments into pieces for the rig is DEAD;
the clothes are MODELLED on the rig's man the way the robot and the truck were made, and rendered through DIRECTION's
master rig unedited, so the thirteen gang looks and the body under them come from one source.

THE METHOD. This tool builds one glTF per look from the rig's man (reference/models/khronos/CesiumMan.glb, the body
DIRECTION renders and COOK THREE's thug stands on) and every garment is GEOMETRY skinned to the man's own bones:
  * THE BODY IS SHAPED BY THE LOOK'S OWN DIALS (FACTION_LOOKS in the alpha, read, never edited): height becomes the
    real height handed to the rig (1.72 m x (1 + 0.05 x height); the ruler is CHARACTER's [the body in meters]),
    shoulders widen the yoke, belly fills the torso, hips the seat. Vertices move; the bones do not, so the skin keeps
    its weights.
  * A FITTED PIECE IS THE BODY'S OWN SKIN, LIFTED (COOK THREE's lift, reused): the faces of the body in the garment's
    region, picked by the BONE that owns them (not by a box in space), copied with their weights, pushed out along the
    normal, subdivided and hemmed. Coat bodies and sleeves, mantles, wide trousers, boots, caps, hair.
  * A HANGING PIECE IS A TUBE CUT TO A PATTERN: a coat's skirt, a duster, a cape. Rings round the body's own measured
    cross-section from the waist to the hem, a flare toward the hem, the slits of the pattern left open (a split tail
    at the back, the open front of a duster, a torn hem on the Anarchists, an asymmetric hem on the Remnants), and its
    weights BLENDED from the hips to each thigh by the side of the body it hangs on, so the skirt parts round the stride
    and swings with the legs. That is the trenchcoat action his NO asked for, in geometry, from all eight facings.
  * HATS ARE SOLIDS ON THE HEAD BONE (the rice farmer's cone, a work cap's visor) or lifted skin (knit caps, skull
    caps); a bare head wears its haircut as lifted skin, a long cut adds a fall down the back.
  * THE COLOURS are the runway paint as it stands on the street today (records/cook3/thirteen_repainted.png, row
    AFTER, sampled per region), so the twin and the model wear the same cloth; the rig's source pass puts the wear in.

Run with Blender's Python (bpy 4.2, python3.11; see tools/bohemia_direction_master_rig.py):
    <venv>/bin/python tools/bohemia_character_the_thirteen_through_the_rig.py build <LOOK|ALL> records/character/rig
then the rig per look (the --real-height comes from <look>.json, real_height_for_rig), then the sheet (plain python3):
    python3 tools/bohemia_character_the_thirteen_through_the_rig.py sheet records/target/character/rig \
        slices/vote/CHARACTER_THE_THIRTEEN_THROUGH_THE_RIG.png

REUSE CHECK: the body, its bones and its walk are the rig's man reused whole; the lift is COOK THREE's
(tools/bohemia_cook3_the_tiers_through_the_rig.py) generalised; the render is DIRECTION's master rig, unedited; the
looks and dials are FACTION_LOOKS; the colours are COOK THREE's runway paint as sampled; nothing is drawn by hand.

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twin is the game's own thirteen as last painted
(records/cook3/thirteen_repainted.png, row AFTER) and DIRECTION's rendered man; the card of numbers in rig.json
(skills/bohemia-pixel-art/scripts/check.py through the rig); the runway names (Rick Owens, Balenciaga, Bottega Veneta);
analog horror AH-01. No reference game.
"""
import os, sys, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BODY = os.path.join(ROOT, 'reference/models/khronos/CesiumMan.glb')
RULER_M = 1.72   # CHARACTER [the body in meters]: the formula's man, 98 px at 57 px a metre

SKIN = (150, 112, 88)       # the bare mannequin ('Body') only; a person wears his own (skin_for, below)
ONE_SKIN = os.path.join(ROOT, 'records/target/character/BOHEMIA_ONE_SKIN.json')


def skin_for(name):
    """CHARACTER [one skin, one person] (10/19, rule 120(d)): the skin a look's model wears, body and hands, is THE PERSON'S
    one skin (records/target/character/BOHEMIA_ONE_SKIN.json, people[id].rig_rgb), the same step PORTRAIT's head on this
    body reads, so a head and its own body cannot disagree. Every look wore the one constant above until 10/19: the
    thirteen gangs all one tan while their faces ran from porcelain to deep. A LOOKS entry may carry its own skin=(r,g,b)
    (an imported caller adding a person in memory); a name the file does not list keeps the mannequin's."""
    L = LOOKS.get(name) or {}
    if L.get('skin'):
        return tuple(L['skin'])
    try:
        P = json.load(open(ONE_SKIN))['people']
    except Exception:
        return SKIN
    t = str(name).lower()
    for k in (t, 'faction_' + t, 'cast_' + t):
        if k in P:
            return tuple(P[k]['rig_rgb'])
    return SKIN
BLACK = (28, 26, 26)
HAIR_DARK = (38, 28, 22)   # darker at the source: the rig's up-face dust lifts a crown toward grey (measured, cycle 1)

# coat lengths in the body's own metres (CesiumMan stands 1.507; the hip seam is 0.66, the knee 0.35, the ankle 0.09)
HIP, THIGH, KNEE, CALF, ANKLE = 0.58, 0.42, 0.33, 0.20, 0.12

# THE THIRTEEN (FACTION_LOOKS, slices/BOHEMIA_ALPHA_0_9.html, in its order) and the body under them. Each garment is the
# look's own slot; the colours are sampled from the runway paint's AFTER row (median of the region).
LOOKS = {
    'Body': dict(order=0, shape='the man under every look: no faction', dials=dict(height=0.0, belly=0.0, shoulders=0.0, hips=0.0),
                 worn=dict(hair='TEMPLE TAPER', base='BLACK TANK', legs='BLACK CARGOS', feet='WHITE SNEAKERS'),
                 hair=dict(style='taper', colour=HAIR_DARK), shirt=dict(colour=BLACK, sleeve='none'),
                 trousers=dict(colour=(40, 38, 38), wide=0.012), shoes=dict(colour=(186, 182, 172), kind='sneaker')),
    'Caravans': dict(order=1, shape='broad / mantle / wide brim', dials=dict(height=-0.30, belly=0.55, shoulders=0.60, hips=0.15),
                     worn=dict(hair='COIL CROWN', base='DUST PLAID SHIRT', outer='SAND COCOON COAT', back='OLIVE SHOULDER MANTLE', head='CHINESE RICE FARMER HAT', legs='DUST TROUSERS', feet='SANDWALKERS'),
                     hair=dict(style='crop', colour=HAIR_DARK), shirt=dict(colour=(118, 100, 74), sleeve='long'),
                     coat=dict(colour=(102, 88, 70), hem=THIGH, flare=0.06, thick=0.024, front_open=0.0),
                     mantle=dict(colour=(88, 78, 58), low=0.86),
                     hat=dict(kind='cone', colour=(126, 110, 80)),
                     trousers=dict(colour=(84, 71, 62), wide=0.01), shoes=dict(colour=(90, 83, 75), kind='sandal')),
    'Colorful': dict(order=2, shape='small / long coat / knit cap / long hem', dials=dict(height=-0.60, belly=-0.30, shoulders=-0.40, hips=0.25),
                     worn=dict(hair='SHAG', base='TEAL STRIPED TEE', outer='GRASS CAR COAT', head='ROSE KNIT CAP', legs='GRASS DROP TROUSER', feet='GRASS BOOTS'),
                     hair=dict(style='shag', colour=(70, 46, 34)), shirt=dict(colour=(64, 112, 108), sleeve='short'),
                     coat=dict(colour=(116, 150, 92), hem=CALF, flare=0.035, thick=0.016, v=0.04, front_open=0.35),
                     hat=dict(kind='knit', colour=(196, 70, 84)),
                     trousers=dict(colour=(110, 105, 92), wide=0.016), shoes=dict(colour=(128, 123, 112), kind='boot', top=0.20)),
    'Anarchists': dict(order=3, shape='lanky / split-tail / knit cap', dials=dict(height=0.45, belly=-0.45, shoulders=-0.25, hips=-0.25),
                       worn=dict(hair='LAYERED FALL', base='BLACK TANK', outer='LEATHER WRAP COAT', head='CHARCOAL WATCH CAP', legs='LEATHER STACK PANT', feet='LEATHER STACK BOOT'),
                       hair=dict(style='fall', colour=(40, 32, 28)), shirt=dict(colour=BLACK, sleeve='none'),
                       coat=dict(colour=(99, 52, 88), hem=CALF + 0.03, flare=0.03, thick=0.014, v=0.05, front_open=0.25, back_slit=0.50, torn=0.07),
                       hat=dict(kind='watch', colour=(54, 52, 54)),
                       trousers=dict(colour=(62, 40, 54), wide=0.0), shoes=dict(colour=(20, 18, 18), kind='boot', top=0.26)),
    'Blues': dict(order=4, shape='broad / mid coat / bare head', dials=dict(height=-0.30, belly=0.55, shoulders=0.60, hips=0.15),
                  worn=dict(hair='DRY TAPER', base='COBALT SHIRT', outer='COBALT CHORE COAT', back='COBALT SHOULDER MANTLE', legs='COBALT WIDE TROUSER', feet='COBALT STACK BOOT'),
                  hair=dict(style='taper', colour=HAIR_DARK), shirt=dict(colour=(66, 90, 130), sleeve='long'),
                  coat=dict(colour=(75, 103, 150), hem=HIP, flare=0.015, thick=0.018, front_open=0.0),
                  mantle=dict(colour=(70, 94, 134), low=0.90),
                  trousers=dict(colour=(91, 90, 92), wide=0.03), shoes=dict(colour=(58, 57, 60), kind='boot', top=0.22)),
    'Homeless': dict(order=5, shape='small / mantle / bare head / long hem', dials=dict(height=-0.60, belly=-0.30, shoulders=-0.40, hips=0.25),
                     worn=dict(hair='LAYERED FALL', base='TATTERED TEE', back='SHOULDER MANTLE', legs='STACKED JERSEY PANT', feet='SLOUCH BOOT'),
                     hair=dict(style='fall', colour=(150, 120, 80)), shirt=dict(colour=(141, 139, 134), sleeve='short'),
                     mantle=dict(colour=(150, 146, 136), low=0.66, thick=0.045, torn=0.05),
                     trousers=dict(colour=(30, 28, 28), wide=0.018), shoes=dict(colour=(62, 54, 44), kind='boot', top=0.24)),
    'Church': dict(order=6, shape='tall / mantle / skull cap', dials=dict(height=0.75, belly=-0.25, shoulders=0.25, hips=-0.10),
                   worn=dict(hair='COIL CROWN', base='VESTMENT GOLD SHIRT', back='GOLD SHOULDER MANTLE', head='BONE KNIT CAP', legs='GOLD DROP TROUSER', feet='BROWN BOOTS'),
                   hair=dict(style='crop', colour=HAIR_DARK), shirt=dict(colour=(206, 184, 120), sleeve='long', long_hem=KNEE + 0.04),
                   mantle=dict(colour=(190, 170, 116), low=0.84),
                   hat=dict(kind='skull', colour=(162, 154, 134)),
                   trousers=dict(colour=(190, 182, 164), wide=0.02), shoes=dict(colour=(65, 49, 45), kind='boot', top=0.16)),
    'Reds': dict(order=7, shape='tall / mid coat / bare head', dials=dict(height=0.75, belly=-0.25, shoulders=0.25, hips=-0.10),
                 worn=dict(hair='DRY TAPER', base='SIGNAL RED SHIRT', outer='BRICK SPLIT-TAIL DUSTER', legs='BRICK WIDE TROUSER', feet='BRICK STACK BOOT'),
                 hair=dict(style='taper', colour=HAIR_DARK), shirt=dict(colour=(150, 48, 40), sleeve='long'),
                 coat=dict(colour=(101, 59, 55), hem=ANKLE + 0.02, flare=0.05, thick=0.016, v=0.07, front_open=0.55, back_slit=0.45),
                 trousers=dict(colour=(84, 50, 48), wide=0.02), shoes=dict(colour=(20, 18, 18), kind='boot', top=0.22)),
    'Cartel': dict(order=8, shape='small / cape / knit cap', dials=dict(height=-0.60, belly=-0.30, shoulders=-0.40, hips=0.25),
                   worn=dict(hair='DRY TAPER', base='FADED BLACK LONGSLEEVE', back='STEEL ROAD CAPE', head='CHARCOAL WATCH CAP', legs='DUST TROUSERS', feet='STACKED SOLE BOOT'),
                   hair=dict(style='taper', colour=HAIR_DARK), shirt=dict(colour=(42, 40, 42), sleeve='long'),
                   cape=dict(colour=(66, 65, 68), hem=KNEE - 0.04, top=1.12),
                   hat=dict(kind='watch', colour=(54, 52, 54)),
                   trousers=dict(colour=(69, 69, 71), wide=0.01), shoes=dict(colour=(20, 18, 18), kind='boot', top=0.20)),
    'Trades': dict(order=9, shape='broad / no coat / work cap', dials=dict(height=-0.30, belly=0.55, shoulders=0.60, hips=0.15),
                   worn=dict(hair='TEMPLE TAPER', base='SCAVENGER FLANNEL', outer='LEATHER SPLIT-TAIL COAT', head='DUST WORK CAP', legs='DUST TROUSERS', feet='STACKED SOLE BOOT', waist='SOOT TOOL BELT'),
                   hair=dict(style='taper', colour=HAIR_DARK), shirt=dict(colour=(150, 86, 40), sleeve='long'),
                   coat=dict(colour=(85, 66, 49), hem=THIGH, flare=0.02, thick=0.016, v=0.05, front_open=0.45, back_slit=0.55),
                   hat=dict(kind='work', colour=(128, 110, 80)),
                   belt=dict(colour=(40, 36, 34), pouches=True),
                   trousers=dict(colour=(71, 57, 52), wide=0.012), shoes=dict(colour=(34, 24, 23), kind='boot', top=0.20)),
    'Mob': dict(order=10, shape='lanky / cape / bare head / long hem', dials=dict(height=0.45, belly=-0.45, shoulders=-0.25, hips=-0.25),
                worn=dict(hair='DRY TAPER', base='MOB PINSTRIPE SHIRT', back='CHARCOAL SHOULDER MANTLE', legs='CHARCOAL CROP TROUSER', feet='STACKED SOLE BOOT', waist='LEATHER BELT'),
                hair=dict(style='slick', colour=(30, 26, 24)), shirt=dict(colour=(119, 106, 74), sleeve='long'),
                mantle=dict(colour=(50, 48, 50), low=0.88),
                cape=dict(colour=(50, 48, 50), hem=CALF, top=1.08),
                belt=dict(colour=(60, 40, 30)),
                trousers=dict(colour=(52, 42, 40), wide=0.0, crop=0.16), shoes=dict(colour=(34, 25, 24), kind='boot', top=0.12)),
    'Network': dict(order=11, shape='tall / nothing / nothing', dials=dict(height=0.75, belly=-0.25, shoulders=0.25, hips=-0.10),
                    worn=dict(hair='TEMPLE TAPER', base='TEAL WORK SHIRT', outer='TEAL COCOON COAT', legs='STACKED JERSEY PANT', feet='SLOUCH BOOT'),
                    hair=dict(style='taper', colour=HAIR_DARK), shirt=dict(colour=(79, 100, 92), sleeve='long'),
                    coat=dict(colour=(86, 148, 135), hem=THIGH + 0.02, flare=0.06, thick=0.026, front_open=0.0),
                    trousers=dict(colour=(71, 71, 72), wide=0.018), shoes=dict(colour=(20, 18, 18), kind='boot', top=0.18)),
    'Volunteers': dict(order=12, shape='small / nothing / nothing', dials=dict(height=-0.60, belly=-0.30, shoulders=-0.40, hips=0.25),
                       worn=dict(hair='HEAVY FRINGE', base='WHITE TEE', outer='BONE COCOON COAT', legs='STACKED JERSEY PANT', feet='COLUMN PANT-BOOT'),
                       hair=dict(style='fringe', colour=(18, 16, 14)), shirt=dict(colour=(196, 192, 182), sleeve='short'),
                       coat=dict(colour=(141, 139, 134), hem=THIGH + 0.03, flare=0.05, thick=0.024, v=0.04, front_open=0.3),
                       trousers=dict(colour=(69, 69, 71), wide=0.02), shoes=dict(colour=(64, 55, 48), kind='boot', top=0.30)),
    'Remnants': dict(order=13, shape='broad / thigh coat / field cap', dials=dict(height=-0.18, belly=0.85, shoulders=0.80, hips=0.30),
                     worn=dict(hair='TEMPLE TAPER', base='OLIVE DRAB TEE', outer='OLIVE ASYM COAT', head='STORM KNIT CAP', legs='OLIVE WIDE TROUSER', feet='OLIVE STACK BOOT'),
                     hair=dict(style='taper', colour=HAIR_DARK), shirt=dict(colour=(84, 88, 60), sleeve='short'),
                     coat=dict(colour=(73, 78, 54), hem=THIGH, flare=0.03, thick=0.022, front_open=0.2, asym=0.12),
                     hat=dict(kind='knit', colour=(70, 72, 78)),
                     trousers=dict(colour=(66, 66, 68), wide=0.03), shoes=dict(colour=(56, 56, 56), kind='boot', top=0.24)),
}
ORDER = sorted(LOOKS, key=lambda k: LOOKS[k]['order'])
# A LOOK DRESSED AT BUILD (GARMENTS LEGS AND FEET, 10/23): name -> fn(L), called once on the look as its build starts, so a
# person's trousers and shoes reach whichever caller made his look (the barber registers them; nothing else changes)
DRESS = {}

# [the print and the hands] (10/18): THE PRINT IS A MATERIAL ON THE GARMENT, never painted on the pixels. Each print is a
# tile in METRES, made as an image the rig reads as the cloth's own colour (its source pass keeps a linked Base Color and
# puts the wear on top), mapped round the body in metres so a stripe is as wide on every look. Sizes are the real cloth's
# pushed to what reads at 57 px a metre: a 1 cm pinstripe is half a pixel and vanishes, so the chalk line is 2 cm on an
# 8 cm repeat (a banker's chalk stripe, the widest a suit wears); the plaid's bands are 6 and 1.5 cm on a 16 cm repeat (a
# blanket plaid); the tee's bands 3 cm. THE PRINT GOES ON THE PIECE THE EYE SEES: the Mob's pinstripe shirt sits under a
# mantle and a cape, so the suit is the mantle, the cape and the trousers (the twin wears its bands on the mantle); the
# Caravans' plaid shirt sits under a closed cocoon coat, so the plaid is the shoulder mantle, a blanket over the coat, and
# the shirt shows in a V; the Colorful striped tee shows down the open car coat, its V widened to the twin's panel.
PRINTS = {
    'Mob': {'mantle': ('pinstripe', (50, 48, 50), (150, 140, 118)), 'cape': ('pinstripe', (50, 48, 50), (150, 140, 118)),
            'trouser': ('pinstripe', (52, 42, 40), (132, 118, 98)), 'body:trousers': ('pinstripe', (52, 42, 40), (132, 118, 98))},
    'Caravans': {'mantle': ('plaid', (88, 78, 58), (60, 54, 40), (128, 82, 58)), 'body:shirt': ('plaid', (118, 100, 74), (82, 70, 52), (150, 92, 60))},
    'Colorful': {'body:shirt': ('stripe', (64, 112, 108), (190, 184, 164))},
}
PRINT_V = {'Caravans': 0.06, 'Colorful': 0.085}   # the coat's V opened so the print under it shows
TILE_M, TILE_PX = 0.32, 128   # one print tile is 32 cm of cloth at 400 px a metre


def print_tile(spec, path):
    """the print as an image tile in metres (TILE_M square), repeated round the body"""
    from PIL import Image
    import numpy as np
    kind = spec[0]; ppm = TILE_PX / TILE_M
    yy, xx = np.mgrid[0:TILE_PX, 0:TILE_PX] / ppm   # metres
    a = np.zeros((TILE_PX, TILE_PX, 3)); a[:] = spec[1]
    if kind == 'pinstripe':   # vertical chalk lines, 2 cm on a 7 cm repeat: 0.32 / 0.08 = 4 repeats, so the tile wraps clean
        a[(xx % 0.08) < 0.02] = spec[2]
    elif kind == 'stripe':    # horizontal bands, 3 cm on 6
        a[(yy % 0.064) < 0.032] = spec[2]
    elif kind == 'plaid':     # a blanket plaid: wide dark bands both ways (they cross darker), a thin coloured line between
        bx = (xx % 0.16) < 0.06; by = (yy % 0.16) < 0.06
        g = np.array(spec[1], float); d = np.array(spec[2], float)
        a[bx ^ by] = d; a[bx & by] = d * 0.8
        tl = (np.abs((xx % 0.16) - 0.11) < 0.0075) | (np.abs((yy % 0.16) - 0.11) < 0.0075)
        a[tl] = spec[3]
    Image.fromarray(a.astype('uint8'), 'RGB').save(path)
    return path


def lin(c):
    f = lambda v: (v / 255.0) / 12.92 if v / 255.0 <= 0.04045 else ((v / 255.0 + 0.055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), 1.0)


def smooth(e0, e1, x):
    t = min(1.0, max(0.0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t)


# the bone that owns a face, by family (CesiumMan's joint names)
FAMILY = {
    'Skeleton_neck_joint_2': 'head', 'Skeleton_neck_joint_1': 'neck',
    'Skeleton_torso_joint_1': 'torso', 'Skeleton_torso_joint_2': 'torso', 'torso_joint_3': 'torso',
    'Skeleton_arm_joint_L__4_': 'upper', 'Skeleton_arm_joint_R': 'upper',
    'Skeleton_arm_joint_L__3_': 'fore', 'Skeleton_arm_joint_R__2_': 'fore',
    'Skeleton_arm_joint_L__2_': 'hand', 'Skeleton_arm_joint_R__3_': 'hand',
    'leg_joint_L_1': 'thigh', 'leg_joint_R_1': 'thigh', 'leg_joint_L_2': 'shin', 'leg_joint_R_2': 'shin',
    'leg_joint_L_3': 'foot', 'leg_joint_R_3': 'foot', 'leg_joint_L_5': 'foot', 'leg_joint_R_5': 'foot',
}


def build(name, outdir):
    import bpy, bmesh, mathutils
    V = mathutils.Vector
    L = LOOKS[name]; tag = name.lower()
    if name in DRESS: DRESS.pop(name)(L)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=BODY)
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None: bpy.data.objects.remove(o, do_unlink=True)
    body = next(o for o in sc.objects if o.type == 'MESH')
    arm = next(o for o in sc.objects if o.type == 'ARMATURE')
    M = body.matrix_world.copy(); Mi = M.inverted(); R = M.to_3x3().normalized()
    gname = {g.index: g.name for g in body.vertex_groups}

    def vfam(v):
        best = max(v.groups, key=lambda g: g.weight, default=None)
        return FAMILY.get(gname[best.group], 'torso') if best else 'torso'
    fam_v = [vfam(v) for v in body.data.vertices]

    def ffam(f):   # the family most of a face's vertices belong to
        c = {}
        for i in f.vertices: c[fam_v[i]] = c.get(fam_v[i], 0) + 1
        return max(c, key=c.get)

    # 1. THE BODY BY THE LOOK'S DIALS, and the head 1.2x wide (COOK THREE's read of the rig page: tiers are told apart at 18)
    D = L['dials']
    neck = arm.matrix_world @ arm.data.bones['Skeleton_neck_joint_2'].head_local
    hg = next(g.index for g in body.vertex_groups if g.name == 'Skeleton_neck_joint_2')
    for v, fm in zip(body.data.vertices, fam_v):
        p = M @ v.co
        w = next((g.weight for g in v.groups if g.group == hg), 0.0)
        if w > 0:
            s = 1.0 + 0.2 * w; d = p - neck; p = neck + V((d.x * s, d.y * s, d.z * (1 + 0.05 * w)))
        if fm not in ('head',):
            # shoulders: the yoke and everything hung from it moves out
            p.x += math.copysign(0.028 * D['shoulders'] * smooth(0.92, 1.06, p.z), p.x) if abs(p.x) > 0.02 else 0
            # belly: the torso fills about its axis, most at the navel
            if fm in ('torso', 'neck'):
                b = 1.0 + 0.10 * D['belly'] * math.exp(-((p.z - 0.80) / 0.13) ** 2)
                p.x *= b; p.y = (p.y + 0.02) * (1.0 + (0.16 * D['belly'] * math.exp(-((p.z - 0.82) / 0.12) ** 2)) if p.y < -0.02 else 1.0) - 0.02
            # hips: the seat widens
            if fm in ('torso', 'thigh'):
                p.x *= 1.0 + 0.06 * D['hips'] * math.exp(-((p.z - 0.64) / 0.08) ** 2)
        v.co = Mi @ p
    body.data.update()
    # THE SKULL (COOK THREE's finding routed to this lane, 10/18: 'the head is the test body's head mesh, a box; a person
    # model with a skull and a jaw is what fixes it'): the head's vertices are pulled 75% of the way onto an egg, the
    # crown round, the jaw narrower than the brow, by their weight on the head bone so the neck still blends
    hv = [(v, next((g.weight for g in v.groups if g.group == hg), 0.0)) for v in body.data.vertices]
    hp = [M @ v.co for v, w in hv if w > 0.5]
    hz0, hz1 = min(p.z for p in hp), max(p.z for p in hp)
    hy0, hy1 = min(p.y for p in hp), max(p.y for p in hp)
    hx = max(abs(p.x) for p in hp)
    cen = V((0.0, (hy0 + hy1) / 2, hz0 + (hz1 - hz0) * 0.52)); rad = V((hx, (hy1 - hy0) / 2, (hz1 - hz0) * 0.52))
    for v, w in hv:
        if w <= 0: continue
        p = M @ v.co; d = p - cen
        e = V((d.x / rad.x, d.y / rad.y, d.z / rad.z))
        if e.length < 1e-6: continue
        e.normalize()
        jaw = 1.0 - 0.18 * smooth(0.1, -0.9, e.z)   # the jaw narrows under the cheekbones
        q = cen + V((e.x * rad.x * jaw, e.y * rad.y * (1.0 - 0.06 * smooth(0.1, -0.9, e.z)), e.z * rad.z))
        k = 0.75 * smooth(0.5, 1.0, w) * smooth(-1.05, -0.75, e.z)   # the underside of the jaw stays on the neck
        v.co = Mi @ (p.lerp(q, k))
    body.data.update()
    P = [M @ v.co for v in body.data.vertices]
    head_pts = [p for p, fm in zip(P, fam_v) if fm == 'head']
    top = max(p.z for p in head_pts); body_top = max(p.z for p in P)
    hfront = min(p.y for p in head_pts if p.z > top - 0.2); hback = max(p.y for p in head_pts)
    hcy = (hfront + hback) / 2; hw = max(abs(p.x) for p in head_pts)
    brow = top - 0.075

    mats = {}
    def mat(key, rgb, rough=0.95):
        if key in mats: return mats[key]
        m = bpy.data.materials.new('%s_%s' % (tag, key)); m.use_nodes = True
        b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        b.inputs['Base Color'].default_value = lin(rgb); b.inputs['Roughness'].default_value = rough
        mats[key] = m; return m

    def select_only(o):
        bpy.context.view_layer.objects.active = o
        for x in sc.objects: x.select_set(x is o)

    def finish(g, colour, key, subdiv, rim):
        g.data.materials.clear(); g.data.materials.append(mat(key, colour))
        for f in g.data.polygons: f.material_index = 0
        select_only(g)
        if subdiv:
            ss = g.modifiers.new('ss', 'SUBSURF'); ss.levels = subdiv; ss.render_levels = subdiv
            bpy.ops.object.modifier_apply(modifier='ss')
        if rim:
            so = g.modifiers.new('rim', 'SOLIDIFY'); so.thickness = rim; so.offset = -1; so.use_rim = True
            bpy.ops.object.modifier_apply(modifier='rim')
        bpy.ops.object.shade_smooth()
        am = g.modifiers.new('Armature', 'ARMATURE'); am.object = arm
        return g

    # 1b. THE HANDS ([the print and the hands], 10/18): the rig's man has mitts, one lump per hand. Each mitt is measured
    # in its own frame (from the wrist joint: its long axis to the farthest point, its thin axis the back of the hand, the
    # third the width), folded into the palm (its vertices pulled 60% to the wrist, so the indices and the weights stand),
    # and a hand is MODELLED in that frame on the same bone: a palm, four fingers of two joints each curled toward the
    # palm, a thumb set off the palm on the side toward the body's midline (palm down, as the mitt holds it; the Stand
    # pose swings it to hang). Pixel-art hands are drawn big and the thumb is what reads: the fingers are 12% fatter than
    # life and the thumb stands off the palm by its own width, so at 1:1 the hand is a palm, a thumb and a fist's edge.
    import numpy as np
    hands = []
    for hb in ('Skeleton_arm_joint_L__2_', 'Skeleton_arm_joint_R__3_'):
        gi = next(g.index for g in body.vertex_groups if g.name == hb)
        wr = arm.matrix_world @ arm.data.bones[hb].head_local
        idx = [i for i, fm in enumerate(fam_v) if fm == 'hand' and max(body.data.vertices[i].groups, key=lambda g: g.weight).group == gi]
        pts = np.array([tuple(M @ body.data.vertices[i].co) for i in idx]); d = pts - np.array(wr)
        far = d[np.argmax(np.linalg.norm(d, axis=1))]; ln = float(np.linalg.norm(far)); ax = V(tuple(far / ln))
        c = pts.mean(0); _, _, Vt = np.linalg.svd(pts - c)
        th = V(tuple(Vt[2])); th = (th - ax * th.dot(ax)).normalized()
        if th.z > 0: th = -th                                           # the palm faces down, as the mitt holds it
        wd = ax.cross(th).normalized()
        if wd.x * math.copysign(1, wr.x) > 0: wd = -wd                  # the thumb toward the midline
        dd = [V(tuple(x)) for x in d]
        width = max(p.dot(wd) for p in dd) - min(p.dot(wd) for p in dd)
        for i in idx:
            p = M @ body.data.vertices[i].co; body.data.vertices[i].co = Mi @ (wr + (p - wr) * 0.4)
        hands.append((hb, wr, ax, wd, th, ln, width))
    body.data.update()

    def hand_mesh(hb, wr, ax, wd, th, ln, width):
        bm = bmesh.new()
        def ell(cen, a, b, c, seg=10, ring=6):
            r = bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=ring, radius=1.0)
            for v in r['verts']:
                x, y, z = v.co; v.co = cen + a * x + b * y + c * z
        def bend(v, about, deg):
            return (mathutils.Matrix.Rotation(math.radians(deg), 3, about) @ v).normalized()
        L0 = ln * 0.92; hw = min(width, L0 * 0.55) * 0.5
        # the palm: a flattened egg from the wrist to the knuckles
        ell(wr + ax * (L0 * 0.24), ax * (L0 * 0.25), wd * hw, th * (hw * 0.42))
        # four fingers, index (thumb side) to little, two joints each, curled toward the palm (+th)
        for k, (off, flen) in enumerate(((0.72, 0.42), (0.24, 0.46), (-0.24, 0.43), (-0.70, 0.34))):
            rr = hw * 0.30 * 1.12
            base = wr + ax * (L0 * 0.47) + wd * (hw * off) + th * (rr * 0.1)
            d1 = bend(ax, wd, -22); seg1 = L0 * flen * 0.55
            ell(base + d1 * (seg1 * 0.5), d1 * (seg1 * 0.6), wd * rr, th * (rr * 0.9), seg=8, ring=5)
            d2 = bend(d1, wd, -34); b2 = base + d1 * seg1; seg2 = L0 * flen * 0.45
            ell(b2 + d2 * (seg2 * 0.5), d2 * (seg2 * 0.6), wd * (rr * 0.92), th * (rr * 0.85), seg=8, ring=5)
        # the thumb: off the palm's thumb edge, out and forward, standing off by its own width
        tr = hw * 0.36
        tb = wr + ax * (L0 * 0.12) + wd * (hw * 0.95) + th * (tr * 0.3)
        # cycle 1: at 0.75 out the thumb splayed like a claw from the front
        t1 = (ax * 0.65 + wd * 0.55 + th * 0.4).normalized(); s1 = L0 * 0.24
        ell(tb + t1 * (s1 * 0.5), t1 * (s1 * 0.6), wd.cross(t1).normalized() * tr, th * (tr * 0.85), seg=8, ring=5)
        t2 = (ax * 0.85 + wd * 0.35 + th * 0.4).normalized(); s2 = L0 * 0.2; b2 = tb + t1 * s1
        ell(b2 + t2 * (s2 * 0.5), t2 * (s2 * 0.6), wd.cross(t2).normalized() * (tr * 0.9), th * (tr * 0.8), seg=8, ring=5)
        for v in bm.verts: v.co = Mi @ v.co
        me = bpy.data.meshes.new('%s_hand' % tag); bm.to_mesh(me); bm.free()
        g = bpy.data.objects.new('%s_hand_%s' % (tag, 'L' if wr.x > 0 else 'R'), me); sc.collection.objects.link(g)
        g.parent = body.parent; g.matrix_world = M
        vg = g.vertex_groups.new(name=hb); vg.add(list(range(len(me.vertices))), 1.0, 'REPLACE')
        return g

    # 2. THE BODY'S OWN SURFACE: skin, the shirt by its sleeve, the trousers, the shoe
    S = L['shirt']; T = L['trousers']; F = L['shoes']
    body.data.materials.clear()
    SK = skin_for(name)
    for k, rgb in (('skin', SK), ('shirt', S['colour']), ('trousers', T['colour']), ('shoes', F['colour']), ('eyes', (40, 26, 22))):
        body.data.materials.append(mat(k, rgb))
    sleeve_to = {'none': (), 'short': ('upper',), 'long': ('upper', 'fore')}[S['sleeve']]
    for f in body.data.polygons:
        fm = ffam(f); c = M @ f.center
        if fm in ('head', 'hand'): i = 0
        elif fm == 'neck': i = 0 if S['sleeve'] != 'long' else (1 if c.z < 1.15 else 0)
        elif fm == 'torso': i = 1
        elif fm in ('upper', 'fore'):
            i = 1 if fm in sleeve_to else 0
            if fm == 'upper' and S['sleeve'] == 'short' and abs(c.x) > 0.24: i = 0
        elif fm in ('thigh', 'shin'): i = 2
        else: i = 3
        if T.get('crop') and fm == 'shin' and c.z < T['crop']: i = 0
        if fm == 'foot' and c.z > 0.07 and F['kind'] == 'sandal': i = 0
        # the eyes: two sockets in the brow's shadow
        if fm == 'head' and brow - 0.07 <= c.z <= brow - 0.025 and c.y < hfront + 0.045 and 0.012 < abs(c.x) < 0.07: i = 4
        f.material_index = i

    def lift(key, keep, thick, colour, rim=0.012, subdiv=2, groove=None):
        """a fitted piece: the body's faces kept by keep(family, world centre), copied with their weights, pushed out
        along the normal by thick(world point), subdivided, hemmed; skinned to the same armature"""
        g = body.copy(); g.data = body.data.copy(); g.name = '%s_%s' % (tag, key); sc.collection.objects.link(g)
        for md in list(g.modifiers): g.modifiers.remove(md)
        bm = bmesh.new(); bm.from_mesh(g.data)
        famf = {f.index: ffam(f) for f in body.data.polygons}
        bm.faces.ensure_lookup_table()
        kill = [f for f in bm.faces if not keep(famf[f.index], M @ f.calc_center_median())]
        bmesh.ops.delete(bm, geom=kill, context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = M @ v.co; n = (R @ v.normal).normalized()
            v.co = Mi @ (p + n * thick(p))
        bm.to_mesh(g.data); bm.free()
        if not len(g.data.polygons): bpy.data.objects.remove(g, do_unlink=True); return None
        finish(g, colour, key, subdiv, 0)
        if groove:
            g.data.update()
            for v in g.data.vertices:
                p = M @ v.co; d = groove(p)
                if d: v.co = Mi @ (p - (R @ v.normal).normalized() * d)
        if rim:
            select_only(g); g.modifiers.remove(g.modifiers['Armature'])
            so = g.modifiers.new('rim', 'SOLIDIFY'); so.thickness = rim; so.offset = -1; so.use_rim = True
            bpy.ops.object.modifier_apply(modifier='rim')
            am = g.modifiers.new('Armature', 'ARMATURE'); am.object = arm
        return g

    def section(z, fams):
        """the body's measured cross-section at height z: centre y, half-width, front and back depth"""
        pts = [p for p, fm in zip(P, fam_v) if fm in fams and abs(p.z - z) < 0.035]
        if not pts: return None
        cy = sum(p.y for p in pts) / len(pts)
        return dict(cy=cy, rx=max(abs(p.x) for p in pts), front=max(cy - p.y for p in pts), back=max(p.y - cy for p in pts))

    def weights_at(z, ang):
        """the skirt's weights: the torso above the hip seam, then blended by side onto each thigh (x > 0 is his left)"""
        w = {}
        if z > 0.95: w['torso_joint_3'] = 1.0
        elif z > 0.76: t = smooth(0.76, 0.95, z); w['torso_joint_3'] = t; w['Skeleton_torso_joint_2'] = 1 - t
        else:
            legs = smooth(0.70, 0.52, z)
            side = smooth(-0.40, 0.40, math.cos(ang))
            w['Skeleton_torso_joint_1'] = 1 - legs
            w['leg_joint_L_1'] = legs * side; w['leg_joint_R_1'] = legs * (1 - side)
        return {k: v for k, v in w.items() if v > 1e-4}

    def tube(key, z_top, hem, off, colour, ang_ok=lambda a, z: True, segs=56, ring_dz=0.03, fams=('torso', 'thigh', 'shin', 'neck'),
             thick=0.012, hang=True, wfn=None):
        """a hanging piece cut to a pattern: rings round the body's measured section from z_top down to hem(angle), offset
        off(z) out from the body, the quads the pattern leaves open (ang_ok false) cut away; weights blended hip to thigh"""
        zs = []; z = z_top
        lo = min(hem(2 * math.pi * i / segs) for i in range(segs))
        while z > lo - 1e-6: zs.append(z); z -= ring_dz
        if zs[-1] > lo: zs.append(lo)
        secs = []; carry = None
        for z in zs:
            s = section(z, fams) or carry
            if hang and carry:   # cloth hangs: below its widest point it never narrows back onto the legs
                s = dict(cy=s['cy'], rx=max(s['rx'], carry['rx']), front=max(s['front'], carry['front']), back=max(s['back'], carry['back']))
            secs.append(s); carry = s
        bm = bmesh.new(); grid = []
        for ri, (z, s) in enumerate(zip(zs, secs)):
            row = []
            for si in range(segs):
                a = 2 * math.pi * si / segs
                h = hem(a); zz = max(z, h) if ri < len(zs) - 1 else h
                o = off(zz)
                ry = (s['back'] if math.sin(a) > 0 else s['front']) + o
                p = V(((s['rx'] + o) * math.cos(a), s['cy'] + ry * math.sin(a), zz))
                row.append(bm.verts.new(Mi @ p))
            grid.append(row)
        for ri in range(len(zs) - 1):
            for si in range(segs):
                a = 2 * math.pi * (si + 0.5) / segs
                if not ang_ok(a, zs[ri + 1]): continue
                bm.faces.new((grid[ri][si], grid[ri][(si + 1) % segs], grid[ri + 1][(si + 1) % segs], grid[ri + 1][si]))
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new('%s_%s' % (tag, key)); bm.to_mesh(me); bm.free()
        g = bpy.data.objects.new('%s_%s' % (tag, key), me); sc.collection.objects.link(g)
        g.parent = body.parent; g.matrix_world = M
        groups = {}
        for v in me.vertices:
            p = M @ v.co; a = math.atan2(p.y - (secs[0]['cy']), p.x)
            for bn, wt in (wfn or weights_at)(p.z, a).items():
                full = next(b.name for b in arm.data.bones if b.name.endswith(bn) or b.name == bn)
                if full not in groups: groups[full] = g.vertex_groups.new(name=full)
                groups[full].add([v.index], wt, 'REPLACE')
        return finish(g, colour, key, 1, thick)

    made = []
    # 3. THE TROUSERS' VOLUME and THE SHOES (a wide leg flares to the hem; a boot is a shell over the foot and the shin)
    if T.get('wide'):
        wd = T['wide']; crop = T.get('crop', 0.0)
        made.append(lift('trouser', lambda fm, c: fm in ('thigh', 'shin') and c.z > max(crop, 0.10) and c.z < 0.66,
                         lambda p: 0.006 + wd * smooth(0.60, 0.15, p.z), T['colour'], rim=0.008, subdiv=1))
    top_ = F.get('top', 0.07)
    made.append(lift('shoe', lambda fm, c: (fm == 'foot' or (fm == 'shin' and c.z < top_)) and not (F['kind'] == 'sandal' and c.z > 0.05),
                     lambda p: 0.012 if F['kind'] != 'sandal' else 0.006, F['colour'], rim=0.008, subdiv=1))
    # a long shirt hem (the Church's vestment) is a short skirt
    if S.get('long_hem'):
        made.append(tube('vestment', 0.74, lambda a: S['long_hem'], lambda z: 0.012 + 0.03 * smooth(0.70, S['long_hem'], z), S['colour'],
                         ang_ok=lambda a, z: not (abs(a - 1.5 * math.pi) < 0.22 and z < 0.55), thick=0.008))

    # 4. THE COAT: the body and sleeves lifted, the skirt a tube cut to the pattern
    C = L.get('coat')
    if C:
        vneck = PRINT_V.get(name, C.get('v', 0.0)); cy0 = section(0.95, ('torso',))['cy']
        def keepc(fm, c, vneck=vneck, cy0=cy0):
            if vneck and fm in ('torso', 'neck') and c.y < cy0 and abs(c.x) < vneck * smooth(0.80, 1.12, c.z): return False   # the open neck shows the shirt
            return (fm in ('torso', 'upper', 'fore') and c.z > 0.66) or (fm == 'neck' and c.z < 1.16)
        made.append(lift('coat', keepc,
                         lambda p: C['thick'], C['colour'], rim=0.012, subdiv=2))
        torn = C.get('torn', 0.0); asym = C.get('asym', 0.0)
        def hem(a, C=C):
            h = C['hem']
            if torn: h += torn * (0.5 + 0.5 * math.sin(7 * a) * math.cos(3 * a + 1.3))   # the only torn hem in the valley
            if asym: h += asym * smooth(-0.6, 0.6, math.cos(a))   # longer on his right, cut high on his left
            return h
        fo = C.get('front_open', 0.0); bs = C.get('back_slit')
        def ok(a, z, fo=fo, bs=bs):
            front = abs(a - 1.5 * math.pi)   # -y is the front: 270 degrees
            back = abs(a - 0.5 * math.pi)
            if fo and front < fo * 0.5 and z < 0.66: return False            # the coat hangs open below the belt
            if bs and back < 0.10 and z < bs: return False                    # the split tail
            return True
        made.append(tube('coat_skirt', 0.72, hem, lambda z, C=C: C['thick'] + 0.012 + C['flare'] * smooth(0.66, C['hem'], z), C['colour'], ang_ok=ok, thick=0.012))
        # the open front shows the shirt under it: the body's own shirt colour already is
    # 5. THE MANTLE: a drape over the shoulders and the upper arms, thicker toward its edge, its hem free
    Mn = L.get('mantle')
    if Mn:
        low = Mn['low']; mt = Mn.get('thick', 0.03); torn = Mn.get('torn', 0.0)
        # a person in an OUTFIT (CHARACTER [the clothes look real], 10/23) wears it as a capelet: fastened at the throat, open
        # down the front and off the forearms, so the coat and the shirt under it show (wrapped round the chest and to the
        # wrists it hid every layer on five gangs); the fourteen looks above keep theirs as voted
        lay_m = bool(L.get('layers')); cyf_m = section(1.0, ('torso',))['cy']
        def keepm(fm, c, low=low, torn=torn):
            lim = low + (torn * (0.5 + 0.5 * math.sin(9 * math.atan2(c.y, c.x))) if torn else 0)
            if lay_m and (fm == 'fore' or (c.y < cyf_m and c.z < 1.13 and abs(c.x) < 0.085 * (1.0 + 0.4 * smooth(1.10, low, c.z)))):
                return False
            return (fm in ('torso', 'neck', 'upper') or (fm == 'fore' and low < 0.9)) and lim <= c.z < 1.17
        made.append(lift('mantle', keepm, lambda p, low=low, mt=mt: mt + 0.03 * smooth(1.10, low, p.z) + (C['thick'] if C else 0), Mn['colour'], rim=0.016, subdiv=2))
    # 6. THE CAPE: hung from the shoulders down the back
    Cp = L.get('cape')
    if Cp:
        def capew(z, a):
            if z > 0.95: return {'torso_joint_3': 1.0}
            t = smooth(0.70, 0.95, z); return {'torso_joint_3': t, 'Skeleton_torso_joint_1': 1 - t}
        # cycle 2: measured off the torso alone and capped at the shoulders' half-width (with the arms in the section the
        # cape stood out past them like wings from the front), the edges kept behind the arms
        sh = section(1.02, ('torso',))['rx'] + 0.02
        def capeoff(z): return 0.03 + 0.025 * smooth(1.0, Cp['hem'], z) + (Mn and 0.02 or 0)
        g = tube('cape', Cp['top'], lambda a: Cp['hem'], capeoff, Cp['colour'],
                 ang_ok=lambda a, z: 0.16 * math.pi < a < 0.84 * math.pi, fams=('torso', 'neck', 'thigh'), thick=0.010, wfn=capew)
        for v in g.data.vertices:   # no wider than the shoulders anywhere down its fall
            p = M @ v.co
            if abs(p.x) > sh: p.x = math.copysign(sh, p.x); v.co = Mi @ p
        made.append(g)
    # 7. THE BELT
    B = L.get('belt')
    if B:
        made.append(lift('belt', lambda fm, c: fm == 'torso' and 0.64 <= c.z <= 0.70, lambda p: 0.022 + (C['thick'] if C and False else 0), B['colour'], rim=0.01, subdiv=1))
        if B.get('pouches'):
            for sx in (-1, 1):
                bpy.ops.mesh.primitive_cube_add(size=1)
                q = bpy.context.active_object; q.name = '%s_pouch' % tag
                sec = section(0.64, ('torso',))
                q.scale = (0.05, 0.035, 0.07); q.location = (sx * (sec['rx'] + 0.01), sec['cy'] - sec['front'] * 0.3, 0.62)
                bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
                bv = bpy.ops.object.modifier_add(type='BEVEL'); q.modifiers['Bevel'].width = 0.008; bpy.ops.object.modifier_apply(modifier='Bevel')
                q.data.materials.append(mat('belt', B['colour']))
                mw = q.matrix_world.copy(); q.parent = arm; q.matrix_world = mw
                vg = q.vertex_groups.new(name='Skeleton_torso_joint_1'); vg.add(list(range(len(q.data.vertices))), 1.0, 'REPLACE')
                am = q.modifiers.new('Armature', 'ARMATURE'); am.object = arm; made.append(q)

    # 7b. AN IMPORTED CALLER'S OWN PIECES (GARMENTS BASE, 10/19): a LOOKS entry added in memory may carry extra(ctx), called
    # with this build's locals after the body is shaped and painted, returning more pieces (a top's collar, placket, cuffs,
    # hem, hood, pockets); it may repaint the body's faces. Nothing here changes for the fourteen looks above.
    if L.get('extra'):
        made += [o for o in L['extra'](locals()) if o is not None]

    # 8. THE HEAD: the haircut, then the hat
    Hh = L['hair']; H = L.get('hat')
    style = Hh['style']
    hair_line = {'taper': top - 0.05, 'crop': top - 0.06, 'slick': top - 0.06, 'shag': brow - 0.03, 'fall': brow - 0.02, 'fringe': brow - 0.045}[style]
    hair_t = {'taper': 0.008, 'crop': 0.016, 'slick': 0.010, 'shag': 0.022, 'fall': 0.018, 'fringe': 0.02}[style]
    def keeph(fm, c):
        if fm != 'head': return False
        face = c.y < hfront + 0.05 and abs(c.x) < hw * 0.75
        if style == 'fringe': return c.z >= hair_line and not (face and c.z < brow - 0.045)
        if face: return c.z >= brow + (0.0 if style in ('shag', 'fall') else 0.01)
        sides = top - 0.13 if style in ('taper', 'slick', 'crop') else top - 0.20   # the back of a short cut ends at the nape
        return c.z >= sides
    # the cut is sculpted, the clay way: combed grooves front to back over the crown, 1.6 cm apart, 4 mm deep, so the hair
    # reads as hair by its own light (a smooth shell read as a felt cap, cycle 1)
    comb = lambda p: 0.004 * max(0.0, math.cos(2 * math.pi * p.x / 0.016)) ** 4 if p.z > top - 0.08 else 0.0
    made.append(lift('hair', keeph, lambda p: hair_t * (1.0 if p.z > top - 0.06 else 0.6), Hh['colour'], rim=0.006, subdiv=2, groove=comb))
    if style in ('fall', 'shag'):   # a long cut falls down the back to the shoulders
        def hw_(z, a):
            t = smooth(1.12, 1.24, z); return {'Skeleton_neck_joint_2': t, 'Skeleton_neck_joint_1': 1 - t}
        made.append(tube('hair_fall', top - 0.10, lambda a: 1.06 if style == 'fall' else 1.12, lambda z: 0.012, Hh['colour'],
                         ang_ok=lambda a, z: 0.08 * math.pi < a < 0.92 * math.pi, fams=('head', 'neck'), thick=0.012, hang=True, wfn=hw_))
    if H:
        k = H['kind']
        if k in ('knit', 'watch', 'skull', 'work'):
            down = {'knit': 0.09, 'watch': 0.075, 'skull': 0.045, 'work': 0.07}[k]
            cz = top - down
            made.append(lift('hat', lambda fm, c: fm == 'head' and c.z >= cz - 0.02 * (c.y > hcy), lambda p: 0.014 + 0.012 * (k == 'knit') * smooth(top - 0.02, top, p.z) + hair_t * 0.5, H['colour'], rim=0.01, subdiv=1))
            if k in ('knit', 'watch'):   # the folded brim
                made.append(lift('hat_brim', lambda fm, c: fm == 'head' and cz - 0.02 * (c.y > hcy) <= c.z <= cz + 0.03 - 0.02 * (c.y > hcy), lambda p: 0.026 + hair_t * 0.5, H['colour'], rim=0.012, subdiv=1))
            if k == 'work':   # the visor, a solid on the head bone
                bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=1.0, depth=1.0)
                q = bpy.context.active_object; q.name = '%s_visor' % tag
                q.scale = (hw * 0.6, 0.05, 0.008); q.location = (0, hfront - 0.03, cz + 0.004)   # cycles 2-3: wider or further back, it poked out of the skull as ears
                bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
                q.data.materials.append(mat('hat', H['colour']))
                mw = q.matrix_world.copy(); q.parent = arm; q.matrix_world = mw
                vg = q.vertex_groups.new(name='Skeleton_neck_joint_2'); vg.add(list(range(len(q.data.vertices))), 1.0, 'REPLACE')
                am = q.modifiers.new('Armature', 'ARMATURE'); am.object = arm; made.append(q)
        if k == 'cone':   # the rice farmer's hat: a shallow cone, wider than the shoulders' half, its point over the crown
            bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=0.25, radius2=0.012, depth=0.13)
            q = bpy.context.active_object; q.name = '%s_hat' % tag
            q.location = (0, hcy, top - 0.03 + 0.065)
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
            so = q.modifiers.new('rim', 'SOLIDIFY'); so.thickness = 0.012; bpy.ops.object.modifier_apply(modifier='rim')
            # the weave: rings pressed into the straw every 3.5 cm of radius
            for v in q.data.vertices:
                r = math.hypot(v.co.x, v.co.y - hcy)
                if v.co.z > top - 0.03: v.co.z -= 0.004 * max(0.0, math.cos(2 * math.pi * r / 0.035)) ** 6
            q.data.materials.append(mat('hat', H['colour']))
            mw = q.matrix_world.copy(); q.parent = arm; q.matrix_world = mw
            vg = q.vertex_groups.new(name='Skeleton_neck_joint_2'); vg.add(list(range(len(q.data.vertices))), 1.0, 'REPLACE')
            am = q.modifiers.new('Armature', 'ARMATURE'); am.object = arm; made.append(q)

    # 8b. STRAND NORMALS ON A DARK HEAD (cycle 3, measured): the rig's source pass dusts every up-facing surface (1.1 x
    # wear, toward a pale warm dust), so a near-black crown (26,20,17) rendered as a grey felt cap and a charcoal watch cap
    # read the same grey as hair: every dark head in the thirteen looked old. Hair is shaded as combed strands, the stylised
    # way (a strand's normal lies across the head, never straight up): the dark head pieces get custom normals tilted
    # out from the skull's axis, z held under 0.5 (cycle 4: under 0.35 the crown went so dark the card read the light from below on three pale coats), so the crown takes the dust and the sun as hair does, not as a lid.
    # The real fix is the rig's (a per-material wear weight, COOK THREE asked first); routed again in the handoff.
    for o in [o for o in sc.objects if o.type == 'MESH' and any(o.name.endswith(x) for x in ('_hair', '_hair_fall', '_hat', '_hat_brim'))]:
        m0 = o.data.materials[0] if o.data.materials else None
        if not m0: continue
        c = next(n for n in m0.node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value
        if 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] > 0.12: continue   # light hair and pale hats keep their own normals
        mw = o.matrix_world; mr = mw.to_3x3().normalized(); mri = mr.inverted()
        ns = []
        for v in o.data.vertices:
            p = mw @ v.co; n = (mr @ v.normal).normalized()
            r = V((p.x, p.y - hcy, 0.0))
            r = r.normalized() if r.length > 1e-4 else V((0, 1, 0))
            t = max(0.0, n.z - 0.5) / 0.5
            m = (n.lerp(r, t)); m.z = min(m.z, 0.5); m.normalize()
            ns.append(tuple((mri @ m).normalized()))
        o.data.normals_split_custom_set_from_vertices(ns)

    # 8c. THE HANDS (1b), on the hand bones, in skin
    for h in hands:
        made.append(finish(hand_mesh(*h), SK, 'skin', 0, 0))

    # 8d. THE PRINT (PRINTS, above): the cloth's colour becomes a tile mapped in METRES round the body: the side of a
    # piece by its angle round the torso (or round its own leg below the hip, so a trouser stripe keeps its width on the
    # leg's side) and its height; a face that looks up (a mantle's shoulders) by its plan. The seam is at the back.
    import tempfile
    real_k = RULER_M * (1 + 0.05 * D['height']) / body_top   # model units to the real metres the rig scales to
    cy_t = section(0.95, ('torso',))['cy']
    def apply_print(o, spec, key, slot=None):
        path = print_tile(spec, os.path.join(tempfile.gettempdir(), 'bohemia_print_%s_%s.png' % (tag, key.replace(':', '_'))))
        m = bpy.data.materials.new('%s_%s_print' % (tag, key.replace('body:', ''))); m.use_nodes = True
        nt = m.node_tree; b = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED'); b.inputs['Roughness'].default_value = 0.95
        tx = nt.nodes.new('ShaderNodeTexImage'); tx.image = bpy.data.images.load(path); tx.image.pack(); tx.extension = 'REPEAT'
        nt.links.new(tx.outputs['Color'], b.inputs['Base Color'])
        me = o.data
        while me.uv_layers: me.uv_layers.remove(me.uv_layers[0])
        uv = me.uv_layers.new(name='UVMap')
        mw = o.matrix_world; mr = mw.to_3x3().normalized()
        for f in me.polygons:
            n = (mr @ f.normal).normalized(); pts = [mw @ me.vertices[me.loops[li].vertex_index].co for li in f.loop_indices]
            if abs(n.z) > 0.7:
                uvs = [(p.x * real_k / TILE_M, p.y * real_k / TILE_M) for p in pts]
            else:
                cz = sum(p.z for p in pts) / len(pts); leg = cz < 0.62 and key in ('trouser', 'body:trousers')
                cx = math.copysign(0.085, sum(p.x for p in pts)) if leg else 0.0; r0 = 0.07 if leg else 0.16
                th = [math.atan2(p.x - cx, -(p.y - cy_t)) for p in pts]
                if max(th) - min(th) > math.pi: th = [t + 2 * math.pi if t < 0 else t for t in th]
                uvs = [(t * r0 * real_k / TILE_M, p.z * real_k / TILE_M) for t, p in zip(th, pts)]
            for li, q in zip(f.loop_indices, uvs): uv.data[li].uv = q
        if slot is None:
            me.materials.clear(); me.materials.append(m)
            for f in me.polygons: f.material_index = 0
        else:
            me.materials[slot] = m
    for key, spec in PRINTS.get(name, {}).items():
        if key.startswith('body:'):
            want = '%s_%s' % (tag, key[5:])
            apply_print(body, spec, key, slot=next(i for i, mm in enumerate(body.data.materials) if mm.name == want))
        else:
            for o in [o for o in made if o is not None and o.name == '%s_%s' % (tag, key)]: apply_print(o, spec, key)

    # 9. A STANDING POSE (COOK THREE's finding, 10/18: 'the passing pose on this body lands mid-stride; an idle clip would
    # give the standing still the sheets want'): an action 'Stand', the legs at rest (feet under the hips), the upper arms
    # swung down from the rest pose's 27-degree droop to hang a hand's width off the coat, the elbows a little bent
    stand_action(arm, bpy, mathutils, D)

    out = os.path.join(outdir, '%s.glb' % tag)
    os.makedirs(outdir, exist_ok=True)
    for o in sc.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_skins=True, export_animations=True, export_apply=False, use_selection=False)
    model_top = max((o.matrix_world @ v.co).z for o in sc.objects if o.type == 'MESH' for v in o.data.vertices)
    real_h = RULER_M * (1 + 0.05 * D['height'])
    stats = dict(look=name, shape=L['shape'], worn=L['worn'], dials=D, **({'layers': L['layers']} if L.get('layers') else {}), model=os.path.relpath(out, ROOT), from_body=os.path.relpath(BODY, ROOT),
                 body_top_m=round(body_top, 4), model_top_m=round(model_top, 4), real_height_m=round(real_h, 4),
                 real_height_for_rig=round(real_h * model_top / body_top, 4),
                 meshes={o.name: len(o.data.vertices) for o in sc.objects if o.type == 'MESH'},
                 materials={m.name: [round(x, 4) for x in next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value[:3]] for m in bpy.data.materials if m.use_nodes})
    json.dump(stats, open(out.replace('.glb', '.json'), 'w'), indent=1)
    print('BUILT', name, stats['real_height_for_rig'], len(stats['meshes']))


def stand_action(arm, bpy, mathutils, D):
    walk = arm.animation_data.action if arm.animation_data else None
    if not arm.animation_data: arm.animation_data_create()
    act = bpy.data.actions.new('Stand'); arm.animation_data.action = act
    A = arm.matrix_world.copy(); Ai = A.inverted()
    for pb in arm.pose.bones:
        pb.rotation_mode = 'QUATERNION'; pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0); pb.scale = (1, 1, 1)
    bpy.context.view_layer.update()
    swing = 56.0 - 6.0 * max(0.0, D.get('belly', 0) + D.get('shoulders', 0)) / 2   # a heavier body holds its arms off its sides
    def turn(name, deg):
        pb = arm.pose.bones[name]
        head = A @ pb.bone.head_local
        Rw = mathutils.Matrix.Translation(head) @ mathutils.Matrix.Rotation(math.radians(deg), 4, 'Y') @ mathutils.Matrix.Translation(-head)
        pb.matrix = Ai @ Rw @ A @ pb.matrix
        bpy.context.view_layer.update()
    turn('Skeleton_arm_joint_L__4_', swing); turn('Skeleton_arm_joint_R', -swing)
    turn('Skeleton_arm_joint_L__3_', -8); turn('Skeleton_arm_joint_R__2_', 8)
    for f in (1, 2):
        for pb in arm.pose.bones:
            pb.keyframe_insert('rotation_quaternion', frame=f); pb.keyframe_insert('location', frame=f)
    if walk:   # both clips leave on the model: the walk stays its own action
        tr = arm.animation_data.nla_tracks.new(); tr.name = 'Stand'; tr.strips.new('Stand', 1, act)
        tr2 = arm.animation_data.nla_tracks.new(); tr2.name = walk.name; tr2.strips.new(walk.name, 1, walk)
        arm.animation_data.action = None
        for pb in arm.pose.bones: pb.rotation_quaternion = (1, 0, 0, 0)


# the game's own flat thirteen as last painted (records/cook3/thirteen_repainted.png, row AFTER): column spans measured
TWIN_X = {'Caravans': (78, 169), 'Colorful': (324, 391), 'Anarchists': (554, 629), 'Blues': (780, 871), 'Homeless': (1022, 1097),
          'Church': (1254, 1333), 'Reds': (1492, 1563), 'Cartel': (1724, 1799), 'Trades': (1954, 2037), 'Mob': (2188, 2271),
          'Network': (2424, 2503), 'Volunteers': (2660, 2735), 'Remnants': (2886, 2977)}


def twin(name):
    from PIL import Image
    import numpy as np
    if name not in TWIN_X: return None
    x0, x1 = TWIN_X[name]
    a = np.asarray(Image.open(os.path.join(ROOT, 'records/cook3/thirteen_repainted.png')).convert('RGBA').crop((x0 - 4, 280, x1 + 5, 500))).copy()
    bg = np.array([43, 40, 36]); a[np.abs(a[..., :3].astype(int) - bg).sum(2) <= 30, 3] = 0
    im = Image.fromarray(a, 'RGBA'); im = im.crop(im.getbbox())
    # that sheet draws the 112 rig at 2x (its figures stand ~200 px): halved by nearest to stand at 1:1 beside ours
    return im.resize((im.width // 2, im.height // 2), Image.NEAREST)


def sheet(frames_root, out):
    """the thirteen and the body as models: the S still of each beside the game's own flat look at 1:1, the eight
    facings of every look, and the walk of the coats; the caption names the pixel size, the palette and the light.
    Every picture sits bottom-centre in one cell size (the looks' crop boxes differ: a walk widens its own box)"""
    from PIL import Image, ImageDraw
    BG = (22, 21, 20); GROUND = (118, 106, 88); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)
    fac = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    looks = [n for n in ORDER if os.path.exists(os.path.join(frames_root, n.lower(), 'rig.json'))]
    rigs = {n: json.load(open(os.path.join(frames_root, n.lower(), 'rig.json'))) for n in looks}
    def crop(im): return im.crop(im.getbbox())
    st = {n: {f: crop(Image.open(os.path.join(frames_root, n.lower(), 'rig_%s.png' % f))) for f in fac} for n in looks}
    walkers = [n for n in ('Reds', 'Anarchists', 'Trades', 'Cartel') if n in looks and os.path.exists(os.path.join(frames_root, n.lower(), 'rig_Anim_0_SE_k00.png'))]
    wk = {n: [crop(Image.open(os.path.join(frames_root, n.lower(), 'rig_Anim_0_SE_k%02d.png' % k))) for k in range(6)] for n in walkers}
    tw = {n: twin(n) for n in looks}
    allim = [im for n in looks for im in st[n].values()] + [im for v in wk.values() for im in v] + [t for t in tw.values() if t]
    cw = max(im.width for im in allim) + 4; ch = max(im.height for im in allim) + 4
    def cell(im, x, y):
        Sh.paste(GROUND, (x, y, x + cw, y + ch))
        if im: Sh.paste(im, (x + (cw - im.width) // 2, y + ch - im.height - 2), im)
    Wd = max(24 + len(looks) * (cw + 6), 24 + 8 * (cw + 4) + 300, 1000)
    H = 76 + 2 * (ch + 36) + 20 + len(looks) * (ch + 6) + 40 + len(walkers) * (ch + 6) + 60
    Sh = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(Sh)
    d.text((12, 8), 'CHARACTER: THE THIRTEEN AND THE BODY, THE RUNWAY CLOTHES MODELLED ON THE RIG\'S MAN (rule 115c), 1:1. CANDIDATES: nothing is final before the moodboard.', fill=INK)
    d.text((12, 24), '57 px a metre (1.72 m = 98 px; each look\'s height from its own dial), one pixel size, block 1 | palette: the runway paint as the street wears it (records/cook3/thirteen_repainted.png, AFTER) | ONE light: the rig\'s sun, upper left', fill=DIM)
    d.text((12, 38), 'every garment is geometry on the man\'s bones: coats hang as cut skirts weighted onto each thigh (they part on the stride), split tails and open fronts cut, mantles drape, hats are solids', fill=DIM)
    y = 58; d.text((12, y), 'OURS: THE MODEL, S, standing', fill=HEAD); y += 14
    for i, n in enumerate(looks):
        x = 12 + i * (cw + 6); cell(st[n]['S'], x, y); d.text((x, y + ch + 2), n.upper()[:9], fill=DIM)
    y += ch + 22; d.text((12, y), 'HIS TWIN TODAY: the same look as the street wears it now (the flat sprite, runway paint), 1:1', fill=HEAD); y += 14
    for i, n in enumerate(looks):
        x = 12 + i * (cw + 6); cell(tw[n], x, y)
        if not tw[n]: d.text((x + 2, y + ch // 2), 'none', fill=DIM)
    y += ch + 22; d.text((12, y), 'EIGHT FACINGS EACH (N NE E SE S SW W NW): the coat reads as a coat from every side', fill=HEAD); y += 14
    for n in looks:
        x = 12
        for f in fac: cell(st[n][f], x, y); x += cw + 4
        g = rigs[n]['card_guide']
        d.text((x + 6, y + ch // 2 - 12), n.upper(), fill=INK)
        d.text((x + 6, y + ch // 2 + 2), LOOKS[n]['shape'], fill=DIM)
        d.text((x + 6, y + ch // 2 + 16), 'person card: %d of 8 out' % g['out'], fill=DIM)
        y += ch + 6
    if walkers:
        y += 10; d.text((12, y), 'THE WALK, SE, 6 DRAWN KEYS = 2 BEATS AT 120: the skirts part round the stride (the trenchcoat action, in geometry)', fill=HEAD); y += 14
        for n in walkers:
            x = 12
            for im in wk[n]: cell(im, x, y); x += cw + 4
            d.text((x + 6, y + ch // 2), n.upper(), fill=INK); y += ch + 6
    y += 10
    d.text((12, y), 'the cards are in each rig.json (skills/bohemia-pixel-art through the rig, the person class); models records/character/rig/<look>.glb', fill=(120, 116, 108))
    os.makedirs(os.path.dirname(out), exist_ok=True); Sh.save(out); print('sheet', out, Sh.size)


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'build':
        names = ORDER if sys.argv[2].upper() == 'ALL' else [n for n in ORDER if n.lower() == sys.argv[2].lower()]
        for n in names: build(n, os.path.abspath(sys.argv[3]))
    elif cmd == 'sheet':
        sheet(sys.argv[2], sys.argv[3])
