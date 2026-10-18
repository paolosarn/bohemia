#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the look bible]: THE FIRST PROP MODELLED HERE, FROM THE SOURCE PALETTE (rule 115a: every prop
is modelled at the source and rendered through the master rig; style guide field 4: every base colour is a step of
one role's ramp).

A 55-gallon oil drum at its real size (0.584 m across, 0.88 m tall), the burning-drum of COMBAT's night pools and the
Vegas lot's one constant prop. Built like a puppet, not a CAD body: a slightly squashed cylinder, two rolling hoops,
a lid rim and a bung, one dent pressed into the side, and ONE asymmetric thing (the guide's silhouette rule): an X of
grey duct tape over a split, on the side the camera sees in the S facing. Materials, each a palette role's anchor:
painted metal (clay_teal), rust on the lid and the hoops (clay_rust), the tape (tape_grey), the open fill hole
(rubber, its darkest step) and a band of rust grime round the base (clay_rust, its darkest step); roughness 1, specular 0
(the rig's source pass puts the wear on top).

Run with the rig's Blender python:
    <venv>/bin/python tools/bohemia_direction_model_drum.py [--seed 1] [--out reference/models/bohemia/oil_drum.glb]
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAL = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']


def lin(h):
    """a palette hex to Blender's linear colour"""
    def c(v):
        v = int(h[v:v + 2], 16) / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (c(1), c(3), c(5), 1.0)


def mat(bpy, name, role, step=2):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = lin(PAL[role]['ramp'][step])
    b.inputs['Roughness'].default_value = 1.0; b.inputs['Metallic'].default_value = 0.0
    for sp in ('Specular IOR Level', 'Specular'):
        if sp in b.inputs: b.inputs[sp].default_value = 0.0
    m['palette_role'] = role; m['palette_step'] = step
    return m


def build(out, seed=1):
    import bpy, bmesh, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True)
    R, H = 0.292, 0.88
    paint, rust, tape = mat(bpy, 'paint_teal', 'clay_teal'), mat(bpy, 'rust', 'clay_rust'), mat(bpy, 'tape', 'tape_grey')
    # the body: 32 sides (a puppet's turned can, not a CAD cylinder), a little barrel bulge, one dent
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=R, depth=H, location=(0, 0, H / 2))
    body = bpy.context.active_object; body.name = 'drum_body'; body.data.materials.append(paint)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.subdivide(number_cuts=6); bpy.ops.object.mode_set(mode='OBJECT')
    dent = mathutils.Vector((math.cos(math.radians(-60)), math.sin(math.radians(-60)), 0)) * R
    for v in body.data.vertices:
        r = math.hypot(v.co.x, v.co.y)
        if r > R * 0.9:
            bulge = 1.0 + 0.025 * math.sin(math.pi * v.co.z / H)
            v.co.x *= bulge; v.co.y *= bulge
            d = (mathutils.Vector((v.co.x, v.co.y, 0)) - dent).length + abs(v.co.z - H * 0.38) * 0.8
            if d < 0.16:   # a dent pressed in by a thumb the size of a boot
                push = (0.16 - d) / 0.16 * 0.045
                v.co.x -= v.co.x / r * push; v.co.y -= v.co.y / r * push
    bpy.ops.object.shade_smooth()
    # the two rolling hoops and the lid rim, rust
    for z, name in ((H * 0.33, 'hoop_low'), (H * 0.67, 'hoop_high'), (H - 0.012, 'rim_top'), (0.012, 'rim_bottom')):
        bpy.ops.mesh.primitive_torus_add(major_radius=R * 1.03, minor_radius=0.014, major_segments=32, minor_segments=6, location=(0, 0, z))
        t = bpy.context.active_object; t.name = name; t.data.materials.append(rust); bpy.ops.object.shade_smooth()
    # the lid: a sun-bleached disc and the bung
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=R * 0.97, depth=0.01, location=(0, 0, H - 0.004))
    lid = bpy.context.active_object; lid.name = 'lid'; lid.data.materials.append(mat(bpy, 'lid_bleached', 'clay_bone', 3))   # the top has sat in the sun: bleached bone, the rust is the wear's
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.03, depth=0.03, location=(R * 0.55, R * 0.25, H + 0.01))
    bung = bpy.context.active_object; bung.name = 'bung'; bung.data.materials.append(paint)
    # round two (the card said value span 101, the bar 118): the drum needs a real dark. The open fill hole is rubber's
    # darkest step (never black) and the bottom 9 cm is rust-grimed where it sat in water: shapes that are dark, not a
    # darker lamp
    hole = mat(bpy, 'hole', 'rubber', 0)
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=0.042, depth=0.012, location=(-R * 0.5, -R * 0.3, H + 0.001))
    h = bpy.context.active_object; h.name = 'fill_hole'; h.data.materials.append(hole)
    grime = mat(bpy, 'rust_grime', 'clay_rust', 0)
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=R * 1.012, depth=0.09, location=(0, 0, 0.045))
    g = bpy.context.active_object; g.name = 'base_grime'; g.data.materials.append(grime); bpy.ops.object.shade_smooth()
    # THE ONE ASYMMETRIC THING: an X of duct tape over a split, facing the S camera (glTF front is -Y)
    ang = math.radians(-100)
    for rot in (32, -28):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(math.cos(ang) * (R * 1.035), math.sin(ang) * (R * 1.035), H * 0.52))
        s = bpy.context.active_object; s.name = 'tape_%d' % rot; s.data.materials.append(tape)
        s.scale = (0.055, 0.006, 0.3); s.rotation_euler = (0, math.radians(rot), ang + math.pi / 2)
    for o in bpy.context.scene.objects: o.select_set(True)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=False)
    return out


if __name__ == '__main__':
    a = sys.argv[1:]
    out = a[a.index('--out') + 1] if '--out' in a else os.path.join(ROOT, 'reference/models/bohemia/oil_drum.glb')
    print(build(out, int(a[a.index('--seed') + 1]) if '--seed' in a else 1))
