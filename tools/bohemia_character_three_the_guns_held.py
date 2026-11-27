#!/usr/bin/env python3
"""CHARACTER 3, 11/27/26: THE NEW GUNS IN A MAN'S HANDS (VAMILY rule 489(b): 'we haven't even added automatic guns or more intense
guns, maybe even a rocket launcher'; ARMORY 3 built sixteen pieces, records/BOHEMIA_ARMORY_THREE_THE_GUNS_GROW_UP_AND_THE_DRONE_11_27_26.md,
whose OWED line is this lane's: 'in a man's hands every new gun is drawn as its family's gun (the pistols as the pistol, the rifles and
the belt as the rifle, the shotguns and the rockets as the shotgun)'. MEASURED on ARMORY 3's own card (records/target/armory/
armory3_hands.jpg): the Ranch AR, the Guard Carbine, the Kalash, the Night-Sight AR and the Belt-Fed SAW are one picture; the rocket
launcher is the shotgun.

WHAT A GUN NEEDS TO READ AT THE FIGHT'S SIZE (57 px a metre: a rifle is about 50 px long and 5 px tall): its SILHOUETTE, never its
detail. So each new gun's own model is built shape first, the parts that break the outline, at their real size (the real guns: an
AR-15 pattern carbine, an AK pattern rifle, a MAC-10 pattern box SMG, an M249 pattern belt-fed, an RPG-7 pattern launcher):
  AR       a straight box magazine down, a pistol grip, a thick handguard, a buffer-tube stock, an optic on the top rail; its
           furniture flat dark earth (the ranch's tan) so it is not the black of everything else
  KALASH   the curved magazine (a banana forward), wood furniture with the stock's drop, the gas tube over the barrel, a muzzle brake
  BOX SMG  short and square: the magazine down through the grip, a short barrel, a wire stock
  BELT-FED the olive ammo box under the receiver, the bipod's legs folded forward under the barrel, a carry handle, a long barrel
  ROCKET   a long tube, the warhead's cone out the front, the wooden heat guard round the middle, two grips under it
Conventions: COOK's (reference/models/bohemia/gun_rifle_a.glb): real size, the barrel along +X, up +Z, the grip at the origin; COOK's
material names (gunmetal, steel_worn, wood, tape) plus polymer, fde and olive, so the master rig's source pass wears them alike.

IN HIS HANDS: COMBAT's guns-in-hands render (tools/bohemia_combat_the_guns_in_their_hands.py, imported, never edited), its GUNS and
CLIPS swapped in memory, on a man posed by COMBAT's fight poses (tools/bohemia_combat_the_fight_poses.py) and rendered by DIRECTION's
master rig on the fight's clips (the Carry and the Aim): the same camera, light, box and hold every gun in the fight already has.

    <bpy> tools/bohemia_character_three_the_guns_held.py model                 reference/models/bohemia/gun_<id>_c3.glb
    BOHEMIA_BPY=<bpy> python3 tools/bohemia_character_three_the_guns_held.py pose  [look]   his fight poses and his body on them
    <bpy> tools/bohemia_character_three_the_guns_held.py guns [look] [gun ...]  each gun in his hands, frame for frame
    python3 tools/bohemia_character_three_the_guns_held.py card [look]
"""
import json, math, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
OUT = os.path.join(ROOT, 'records/target/character/the_guns_held')
RENDERS = 'records/target/character/the_guns_held/rig'          # the man's fight renders here, never COMBAT's folder
LOOK = 'enemy_powered_arm_1'
MODELS = {'ar': 'gun_ar_c3', 'kalash': 'gun_kalash_c3', 'smg': 'gun_smg_c3', 'saw': 'gun_saw_c3', 'rocket': 'gun_rocket_c3'}
FAMILY = {'ar': 'rifle', 'kalash': 'rifle', 'smg': 'pistol', 'saw': 'rifle', 'rocket': 'shotgun'}   # what the fight draws today
ROWS = {'ar': 'Ranch AR, Guard Carbine, Night-Sight AR', 'kalash': 'Kalash', 'smg': 'Box SMG, Pipe SMG', 'saw': 'Belt-Fed SAW',
        'rocket': 'Rocket Launcher, Throwaway Rocket'}
CLIPS = [('Carry', 1), ('Aim', 3)]

COL = dict(gunmetal=(0.035, 0.035, 0.038), steel_worn=(0.16, 0.155, 0.15), wood=(0.24, 0.12, 0.05), tape=(0.05, 0.05, 0.05),
           polymer=(0.018, 0.018, 0.02), fde=(0.34, 0.27, 0.17), olive=(0.13, 0.15, 0.07))


def model():
    import bpy, bmesh, mathutils
    V = mathutils.Vector
    mats = {}

    def mat(n):
        if n not in mats:
            m = bpy.data.materials.new(n); m.use_nodes = True
            b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = COL[n] + (1,); b.inputs['Roughness'].default_value = 0.9
            mats[n] = m
        return mats[n]

    def box(name, m, x0, x1, z0, z1, w, y=0.0, shear=0.0):
        """a block from x0 to x1 along the barrel, z0 to z1 up, w wide; shear leans its bottom forward (a magazine's cant)"""
        bm = bmesh.new(); r = bmesh.ops.create_cube(bm, size=1.0)
        for v in r['verts']:
            x, yy, z = v.co
            zz = z0 + (z + 0.5) * (z1 - z0); xx = x0 + (x + 0.5) * (x1 - x0) + shear * (z1 - zz)
            v.co = V((xx, y + yy * w, zz))
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(mat(m)); return o

    def tube(name, m, p0, p1, r0, r1=None, seg=12):
        bm = bmesh.new(); d = V(p1) - V(p0); q = d.normalized().to_track_quat('Z', 'Y')
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=seg, radius1=r0, radius2=r0 if r1 is None else r1, depth=d.length)
        for v in res['verts']: v.co = (V(p0) + V(p1)) * 0.5 + q @ v.co
        me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
        o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); me.materials.append(mat(m)); return o

    def grip(name, m, x, z0=-0.11, rake=0.035):
        return box(name, m, x - 0.016, x + 0.016, z0, 0.0, 0.03, shear=rake / 0.11)

    def save(gid):
        p = os.path.join(ROOT, 'reference/models/bohemia/%s.glb' % MODELS[gid])
        bpy.ops.export_scene.gltf(filepath=p, export_format='GLB', use_selection=False, export_apply=True)
        print('MODEL', gid, os.path.relpath(p, ROOT))

    def fresh():
        bpy.ops.wm.read_factory_settings(use_empty=True); mats.clear()

    # ---- AR (an AR-15 pattern carbine; the Ranch AR's flat dark earth furniture) -----------------------------------------
    fresh()
    box('receiver', 'gunmetal', -0.09, 0.17, -0.005, 0.062, 0.030)
    box('rail', 'gunmetal', -0.07, 0.40, 0.062, 0.074, 0.022)
    box('optic', 'polymer', 0.00, 0.10, 0.074, 0.118, 0.034)
    box('handguard', 'fde', 0.17, 0.42, -0.002, 0.060, 0.044)
    tube('barrel', 'gunmetal', (0.42, 0, 0.030), (0.58, 0, 0.030), 0.0085)
    tube('muzzle', 'gunmetal', (0.58, 0, 0.030), (0.62, 0, 0.030), 0.012)
    box('magazine', 'polymer', 0.035, 0.085, -0.190, -0.005, 0.024, shear=0.12)
    grip('grip', 'fde', -0.025)
    tube('buffer', 'gunmetal', (-0.09, 0, 0.040), (-0.24, 0, 0.040), 0.016)
    box('stock', 'fde', -0.33, -0.17, -0.040, 0.062, 0.036)
    save('ar')
    # ---- KALASH (an AK pattern rifle: the banana magazine, wood, the gas tube, the brake) --------------------------------
    fresh()
    box('receiver', 'steel_worn', -0.07, 0.20, -0.005, 0.060, 0.032)
    box('cover', 'steel_worn', -0.07, 0.20, 0.060, 0.072, 0.028)
    box('handguard', 'wood', 0.20, 0.42, -0.008, 0.050, 0.040)
    tube('gastube', 'steel_worn', (0.20, 0, 0.062), (0.46, 0, 0.062), 0.010)
    tube('barrel', 'gunmetal', (0.42, 0, 0.026), (0.62, 0, 0.026), 0.009)
    box('brake', 'gunmetal', 0.62, 0.67, 0.010, 0.042, 0.022)
    for i, (z0, z1, sh) in enumerate(((-0.075, -0.005, 0.10), (-0.150, -0.075, 0.40), (-0.215, -0.150, 0.85))):   # the curve
        dx = (0.0, 0.010, 0.040)[i]
        box('magazine_%d' % i, 'steel_worn' if i else 'gunmetal', 0.035 + dx, 0.085 + dx, z0, z1, 0.026, shear=sh)
    grip('grip', 'wood', -0.020)
    box('stock', 'wood', -0.36, -0.07, -0.075, 0.050, 0.036, shear=-0.18)
    save('kalash')
    # ---- BOX SMG (a MAC-10 pattern: short and square, the magazine down the grip, a wire stock) --------------------------
    fresh()
    box('receiver', 'gunmetal', -0.10, 0.17, -0.010, 0.065, 0.040)
    tube('barrel', 'gunmetal', (0.17, 0, 0.040), (0.24, 0, 0.040), 0.010)
    tube('can', 'polymer', (0.24, 0, 0.040), (0.36, 0, 0.040), 0.020)
    box('grip_mag', 'polymer', -0.030, 0.012, -0.210, -0.010, 0.030, shear=0.05)
    box('magbase', 'gunmetal', -0.034, 0.016, -0.225, -0.205, 0.034)
    box('tape', 'tape', -0.032, 0.014, -0.140, -0.110, 0.034)
    tube('wire_top', 'steel_worn', (-0.10, 0, 0.055), (-0.30, 0, 0.055), 0.005, seg=6)
    tube('wire_bot', 'steel_worn', (-0.10, 0, 0.000), (-0.30, 0, 0.010), 0.005, seg=6)
    box('butt', 'steel_worn', -0.31, -0.29, -0.010, 0.070, 0.030)
    save('smg')
    # ---- BELT-FED (an M249 pattern: the olive ammo box, the bipod, the carry handle, the long barrel) --------------------
    fresh()
    box('receiver', 'gunmetal', -0.12, 0.24, -0.010, 0.080, 0.050)
    box('feedcover', 'gunmetal', -0.05, 0.16, 0.080, 0.100, 0.046)
    box('handle', 'polymer', 0.18, 0.30, 0.100, 0.118, 0.016)
    box('handguard', 'polymer', 0.24, 0.42, 0.000, 0.060, 0.050)
    tube('barrel', 'gunmetal', (0.42, 0, 0.030), (0.80, 0, 0.030), 0.011)
    box('flash', 'gunmetal', 0.80, 0.85, 0.016, 0.044, 0.026)
    box('ammobox', 'olive', -0.03, 0.12, -0.150, -0.010, 0.085, y=-0.012)
    box('belt', 'steel_worn', 0.06, 0.11, -0.012, 0.040, 0.030, y=-0.045)
    for s in (-1, 1):   # the bipod folded forward under the barrel, its feet down a little
        tube('bipod_%d' % (s > 0), 'gunmetal', (0.66, s * 0.014, 0.012), (0.48, s * 0.030, -0.040), 0.007, seg=6)
    grip('grip', 'polymer', -0.030)
    box('stock', 'polymer', -0.40, -0.12, -0.060, 0.075, 0.042)
    save('saw')
    # ---- ROCKET (an RPG-7 pattern: the tube, the warhead's cone, the wooden heat guard, two grips) -----------------------
    fresh()
    tube('tube', 'olive', (-0.45, 0, 0.070), (0.50, 0, 0.070), 0.032)
    tube('flare', 'olive', (-0.62, 0, 0.070), (-0.45, 0, 0.070), 0.050, 0.032)
    tube('guard', 'wood', (-0.20, 0, 0.070), (0.10, 0, 0.070), 0.040)
    tube('neck', 'olive', (0.50, 0, 0.070), (0.64, 0, 0.070), 0.022, 0.030)
    tube('warhead', 'olive', (0.64, 0, 0.070), (0.80, 0, 0.070), 0.048)
    tube('cone', 'olive', (0.80, 0, 0.070), (0.96, 0, 0.070), 0.048, 0.010)
    tube('fuse', 'gunmetal', (0.96, 0, 0.070), (1.00, 0, 0.070), 0.008)
    box('optic', 'gunmetal', -0.12, -0.04, 0.102, 0.140, 0.030, y=-0.030)
    grip('grip', 'wood', 0.0, z0=-0.10, rake=0.025)
    box('foregrip', 'wood', 0.17, 0.20, -0.06, 0.04, 0.028, shear=-0.2)
    box('tape', 'tape', 0.40, 0.45, 0.034, 0.106, 0.070)
    save('rocket')


def pose(look=LOOK):
    """his fight poses (COMBAT's) and his body on the Carry and the Aim (DIRECTION's master rig, RUN TWO's call)"""
    import bohemia_run2_no_two_people_alike as R
    py = os.environ.get('BOHEMIA_BPY') or 'python3.11'
    pid = look.replace('enemy_', '')
    glb = os.path.join(ROOT, 'records/character/rig/barber_person_%s.glb' % pid)
    posed = os.path.join(ROOT, 'records/combat/rig/%s.glb' % look); os.makedirs(os.path.dirname(posed), exist_ok=True)
    if not os.path.exists(posed):
        subprocess.call([py, os.path.join(ROOT, 'tools/bohemia_combat_the_fight_poses.py'), glb, posed], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    fd = os.path.join(ROOT, RENDERS, look)
    with open(os.path.join(OUT, 'pose_%s.log' % look), 'w') as lf:
        subprocess.call([py, '-c', R.render_code(posed, fd, h, CLIPS)], cwd=ROOT, stdout=lf, stderr=subprocess.STDOUT)
    print('POSED', look, os.path.exists(os.path.join(fd, 'rig.json')))


def guns(look=LOOK, which=None):
    import bohemia_combat_the_guns_in_their_hands as GH
    GH.RENDERS = RENDERS; GH.CLIPS = CLIPS
    GH.GUNS = {k: v for k, v in MODELS.items() if not which or k in which}
    GH.render(look)


def card(look=LOOK):
    """each gun in his hands at the fight's own size and three times it, beside what the fight draws for it today"""
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
    rj = json.load(open(os.path.join(ROOT, RENDERS, look, 'rig.json')))
    box = rj['crop_box_px']
    fdir = os.path.join(ROOT, RENDERS, look); gdir = os.path.join(fdir, 'guns')
    F = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono%s.ttf' % ('-Bold' if b else ''), s)

    def frame(gun, clip, face, k):
        body = Image.open(os.path.join(fdir, 'rig_%s_%s_k%02d.png' % (clip, face, k))).convert('RGBA')
        g = Image.open(os.path.join(gdir, '%s_%s_%s_k%02d.png' % (gun, clip, face, k))).convert('RGBA').crop(tuple(box))
        a = np.asarray(g).copy(); a[..., 3] = np.where(a[..., 3] > 127, 255, 0); g = Image.fromarray(a, 'RGBA')
        out = body.copy(); out.alpha_composite(g); return out

    views = [('Aim', 'SE', 1), ('Aim', 'S', 1), ('Aim', 'E', 1), ('Carry', 'SW', 0)]
    W, row_h = 1000, 260
    c = Image.new('RGB', (W, 120 + row_h * len(MODELS)), (24, 21, 18)); g = ImageDraw.Draw(c)
    g.text((20, 16), 'THE NEW GUNS IN HIS HANDS', font=F(32, True), fill=(226, 214, 190))
    g.text((20, 60), 'Each its own shape, at the fight\'s size and three times it. Today the fight draws', font=F(17), fill=(150, 138, 116))
    g.text((20, 84), 'every rifle as one rifle, the belt-fed as that rifle and the rocket as the shotgun.', font=F(17), fill=(150, 138, 116))
    y = 120
    for gun in MODELS:
        g.text((20, y + 6), gun.upper().replace('SAW', 'BELT-FED').replace('SMG', 'BOX SMG'), font=F(18, True), fill=(226, 214, 190))
        g.text((20, y + 30), ROWS[gun], font=F(13), fill=(150, 138, 116))
        g.text((20, y + 48), 'today: the ' + FAMILY[gun] + '\'s picture', font=F(13), fill=(150, 138, 116))
        x = 250
        for clip, face, k in views:
            im = frame(gun, clip, face, k)
            big = im.resize((im.size[0] * 3, im.size[1] * 3), Image.NEAREST)
            bg = Image.new('RGBA', big.size, (74, 66, 54, 255)); bg.alpha_composite(big)
            c.paste(bg.convert('RGB').crop((0, 0, big.size[0], min(240, big.size[1]))), (x, y + 10)); x += big.size[0] + 8   # head to hips: where the gun is
        one = frame(gun, 'Aim', 'SE', 1); bg = Image.new('RGBA', one.size, (74, 66, 54, 255)); bg.alpha_composite(one)
        c.paste(bg.convert('RGB'), (W - one.size[0] - 30, y + 10 + 240 - one.size[1]))
        y += row_h
    os.makedirs(OUT, exist_ok=True)
    c.save(os.path.join(OUT, 'CHARACTER_THREE_THE_NEW_GUNS_IN_HIS_HANDS.webp'), 'WEBP', quality=90)
    first = os.path.join(ROOT, 'records/target/vote_first/character3-the-new-guns-in-his-hands-11-27.webp')
    c.crop((0, 0, W, 120 + row_h * 2)).resize((480, int((120 + row_h * 2) * 0.48)), Image.LANCZOS).save(first, 'WEBP', quality=86)
    print('card', c.size)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == 'model': model()
    elif a[0] == 'pose': pose(*(a[1:2] or [LOOK]))
    elif a[0] == 'guns': guns(a[1] if len(a) > 1 else LOOK, a[2:] or None)
    elif a[0] == 'card': card(*(a[1:2] or [LOOK]))
