#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the rig round five]: THE TRUCK REPAINTED FROM THE SOURCE PALETTE (rule 115a; style guide field 4:
every base colour is a step of one role's ramp; the row's CONSTRAINT: fix in the model or the rig, never in the pixels).

WHY: on 10/18 the truck read as FROSTED. Measured this round: the frost is not the dust. Kenney's truck (CC0) paints its
chassis, bumpers, bed and glass a pale lavender grey from one shared colour map, and the rig's dust and grain on a
pale base can only read as frost. No number in the rig fixes a base colour that is not ours. So the truck's faces are
repainted at the source: each face samples Kenney's colour map at its own UV centre, is classed by what it is, and gets
ONE palette step as its own flat material (roughness 1, specular 0; the rig's source pass puts the wear on top):
  paint (the saturated yellow)        clay_mustard[3]  the body stays the yellow he loved
  lamps (orange, small)               sodium[3]
  tail lights (red)                   blood[1]
  chassis, bumpers, bed (pale grey)   clay_teal[1]     dark teal metal, the colour of his own abandoned car (the twin)
  glass (pale, cool)                  glass_eye[1]     dark glass, never a white pane
  tyres and shadow parts (dark)       rubber[2]
The shape is Kenney's, untouched; the result is ours: reference/models/bohemia/truck.glb (CC0 in, CC0 out).

Run with the rig's Blender python:
    <venv>/bin/python tools/bohemia_direction_model_truck.py [--out reference/models/bohemia/truck.glb]
"""
import colorsys, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAL = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles']
SRC = os.path.join(ROOT, 'reference/models/kenney/vehicle-truck-yellow.glb')
CLASSES = [('paint', 'clay_mustard', 3), ('lamp', 'sodium', 3), ('tail', 'blood', 1), ('metal', 'clay_teal', 1),
           ('glass', 'glass_eye', 1), ('rubber', 'rubber', 2)]


def lin(h):
    """a palette hex to Blender's linear colour"""
    def c(v):
        v = int(h[v:v + 2], 16) / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (c(1), c(3), c(5), 1.0)


def classify(rgb, blue_lean):
    """what a face is, from Kenney's colour at its UV centre (sRGB 0..1)"""
    h, s, v = colorsys.rgb_to_hsv(*rgb)
    if v < 0.35: return 'rubber'
    if s > 0.45 and (h < 0.03 or h > 0.95): return 'tail'
    if s > 0.45 and h < 0.09: return 'lamp'
    if s > 0.35: return 'paint'
    return 'glass' if blue_lean and v > 0.85 else 'metal'


def main():
    import bpy
    out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else os.path.join(ROOT, 'reference/models/bohemia/truck.glb')
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=SRC)
    img = bpy.data.images['colormap']; W, H = img.size; px = list(img.pixels)
    def sample(u, v):
        x = min(W - 1, max(0, int((u % 1.0) * W))); y = min(H - 1, max(0, int((v % 1.0) * H))); i = (y * W + x) * 4
        return tuple(px[i:i + 3])   # an 8-bit PNG's pixels come back as its stored sRGB values
    mats = {}
    for name, role, step in CLASSES:
        m = bpy.data.materials.new('bohemia_' + name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = lin(PAL[role]['ramp'][step]); b.inputs['Roughness'].default_value = 1.0
        for sp in ('Specular IOR Level', 'Specular'):
            if sp in b.inputs: b.inputs[sp].default_value = 0.0
        mats[name] = m
    count = {}
    for o in [o for o in bpy.context.scene.objects if o.type == 'MESH']:
        me = o.data; uv = me.uv_layers.active.data
        me.materials.clear()
        for name, _, _ in CLASSES: me.materials.append(mats[name])
        for p in me.polygons:
            us = [uv[i].uv for i in p.loop_indices]; u = sum(t.x for t in us) / len(us); v = sum(t.y for t in us) / len(us)
            rgb = sample(u, v)
            name = classify(rgb, rgb[2] > rgb[0] + 0.02 and p.normal.z < 0.9 and 'body' in o.name)
            p.material_index = [c[0] for c in CLASSES].index(name); count[name] = count.get(name, 0) + 1
    for m in list(bpy.data.materials):
        if m.name == 'colormap': bpy.data.materials.remove(m)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_animations=False)
    print(json.dumps(dict(out=os.path.relpath(out, ROOT), faces=count, palette={n: PAL[r]['ramp'][s] for n, r, s in CLASSES})))


if __name__ == '__main__':
    main()
