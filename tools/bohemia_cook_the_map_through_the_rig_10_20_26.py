#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D], THE MAP, STEP TWO: EVERY DISTRICT PICTURE THROUGH THE RIG (10/20/26).
Rule 121(l) (Paolo 10/19: 'we need all the 2D assets made into 3D assets now'); 121(j) ('even the floor tiles and
building tiles and all accessories have to get remade with this analog horror Crashbox style. Everything.'); rule 123
(Paolo 10/20: '...revamping all the 2-D assets into these 3-D sprites... analog horror Crashbox vibes, go crazy'): no card.

WHAT THE MAP DRAWS: HERO_SRC, one picture per district, laid on every cell of the valley (measured: the mountain alone
is the biggest flat thing on the map's screen). They come out of the district hero factory as clean toy plastic: a numpy
renderer's flat colour times one lamp, no wear, no grain, no dirt. Step one
(tools/bohemia_cook_the_map_capture_10_20_26.py) kept every scene the factory builds, face by face; this renders the
SAME GEOMETRY in Blender through the master rig's look (tools/bohemia_direction_master_rig.py, imported, never edited):
its source pass (the matte, the old paint bleached on what faces the sun, the crevice grime, the dust, the drift, the
grain, the chipped edges), its dents, its one sun and cool fill, then this lane's grime across every object
(tools/bohemia_cook_the_floor_not_final_10_20_26.py: the dirt where things meet, the streaks down every wall, the damp,
the roofs' wear), snapped toward his colours the way the rig snaps every prop.

REGISTERED TO THE PIXEL: iso3d projects screen_x = (x - y) s, screen_y = (x + y) s / 2 - z s. An orthographic camera
30 degrees above the ground, turned 45, gives exactly that when the geometry is mirrored across x = y and its height
scaled by 0.8165 (cos 30 x 0.8165 = 0.7071): the same canvas, the same origin, the same scale, cropped with the factory's
own box, so every picture is the same size with the same anchor (bx, by) and the same plate; the wire
(tools/bohemia_city_hero_wire_patch.py, untouched) resamples the bank to the map's 256 px as before.
The rig's sun is bolted to its own camera's frame (upper left on the screen): here it is turned with the camera.

  python3 tools/bohemia_cook_the_map_capture_10_20_26.py                      (step one, the scenes)
  <venv>/bin/python tools/bohemia_cook_the_map_through_the_rig_10_20_26.py render [district ...]   (masters/<d>.png)
  python3 tools/bohemia_cook_the_map_through_the_rig_10_20_26.py bank [district ...]   (into the bank, then run the wire)

REFERENCE CHECK (the 9/4 standing duty): the factory's own pictures are the twins (same geometry, same frame); Machine
Party's grime (records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md 3.1). No reference game.
REUSE CHECK (REUSE-FIRST): the factory's scenes, the master rig's passes and light, the floor tool's grime, the rig's
population snap, the factory's own pad sampler; the wire tool for the map copy.
TASTE CHECK: his 'the rig is the look' (rule 115) and 'grimy Crashbox analog horror machine party' (121(k)).
"""
import os, sys, json, math, pickle, base64, io
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
OUT = os.path.join(R, 'records/target/cook_map_rig')
MASTERS = os.path.join(OUT, 'masters')
BANK = os.path.join(R, 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt')
CELL_M = 96.0                     # a district cell is 96 m a side (the factory's own comment)
ZC = 0.8165                       # iso3d's height against a true 30-degree orthographic camera
SAMPLES = 24
WEAR = 0.3                        # the guide's 0.6 dusts every flat top, and a district picture is mostly flat tops: at 0.6 the
                                  # mountain's plate went from his brown to a pale grey (measured 10/20), the whole valley would shift; the
                                  # floor tool's ground runs 0.25 for the same reason


def srgb_lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lin3(rgb): return tuple(srgb_lin(float(v)) for v in rgb[:3])


def plate_units(sc):
    xs = [v[0] for verts, n, m in sc['faces'] if max(p[2] for p in verts) <= 0.15 for v in verts]
    ys = [v[1] for verts, n, m in sc['faces'] if max(p[2] for p in verts) <= 0.15 for v in verts]
    return max(max(xs) - min(xs), max(ys) - min(ys)) if xs else 1.0


def material_for(bpy, m, cache):
    key = json.dumps(m, sort_keys=True, default=str)
    if key in cache: return cache[key]
    mat = bpy.data.materials.new('map_%d' % len(cache)); mat.use_nodes = True
    nt = mat.node_tree; N = nt.nodes; L = nt.links
    b = N['Principled BSDF']; b.inputs['Roughness'].default_value = 1.0; b.inputs['Specular IOR Level'].default_value = 0.0; b.inputs['Metallic'].default_value = 0.0
    t = m.get('t')
    if t in ('win', 'lot'):
        uv = N.new('ShaderNodeUVMap'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(uv.outputs['UV'], sep.inputs[0])
        def math_(op, a, c=None):
            n = N.new('ShaderNodeMath'); n.operation = op
            for i, v in enumerate((a, c)):
                if v is None: continue
                if isinstance(v, (int, float)): n.inputs[i].default_value = v
                else: L.new(v, n.inputs[i])
            return n.outputs[0]
        def rgb(c):
            n = N.new('ShaderNodeRGB'); n.outputs[0].default_value = lin3(c) + (1,); return n.outputs[0]
        def mix(fac, a, c):
            n = N.new('ShaderNodeMixRGB'); n.blend_type = 'MIX'; L.new(fac, n.inputs['Fac']); L.new(a, n.inputs['Color1']); L.new(c, n.inputs['Color2']); return n.outputs['Color']
        def between(x, lo, hi): return math_('MULTIPLY', math_('GREATER_THAN', x, lo), math_('LESS_THAN', x, hi))
        u, v = sep.outputs['X'], sep.outputs['Y']
        if t == 'win':
            u0, u1, v0, v1 = m.get('u0', 0.06), m.get('u1', 0.94), m.get('v0', 0.05), m.get('v1', 0.95)
            cols, rows = m.get('cols', 4), m.get('rows', 4)
            inwin = math_('MULTIPLY', between(u, u0, u1), between(v, v0, v1))
            cu = math_('MULTIPLY', math_('DIVIDE', math_('SUBTRACT', u, u0), u1 - u0), cols)
            cv = math_('MULTIPLY', math_('DIVIDE', math_('SUBTRACT', v, v0), v1 - v0), rows)
            fu, fv = math_('FRACT', cu), math_('FRACT', cv)
            if m.get('punch'):
                gl = math_('MULTIPLY', inwin, math_('MULTIPLY', between(fu, 0.3, 0.7), between(fv, 0.28, 0.72)))
                fr = math_('SUBTRACT', math_('MULTIPLY', inwin, math_('MULTIPLY', between(fu, 0.2, 0.8), between(fv, 0.18, 0.82))), gl)
            else:
                pane = math_('MULTIPLY', between(fu, 0.13, 0.87), between(fv, 0.1, 0.9))
                gl = math_('MULTIPLY', inwin, pane); fr = math_('SUBTRACT', inwin, gl)
            col = mix(fr, rgb(m['wall']), rgb(m['frame']))
            glass = rgb(m['glass'])
            if 'dead' in m:                                     # the dead world: broken and boarded panes, per cell
                snap = N.new('ShaderNodeCombineXYZ'); L.new(math_('FLOOR', cu), snap.inputs['X']); L.new(math_('FLOOR', cv), snap.inputs['Y']); snap.inputs['Z'].default_value = float(m.get('deadseed', 1))
                wn = N.new('ShaderNodeTexWhiteNoise'); wn.noise_dimensions = '3D'; L.new(snap.outputs[0], wn.inputs['Vector'])
                hf = wn.outputs['Value']; dead = float(m['dead'])
                broke = math_('LESS_THAN', hf, dead * 0.5); board = math_('MULTIPLY', math_('LESS_THAN', hf, dead), math_('SUBTRACT', 1.0, broke))
                glass = mix(broke, glass, rgb(m.get('breakc', (10, 12, 14))))
                glass = mix(board, glass, rgb(m.get('boardc', m['wall'])))
            col = mix(gl, col, glass)
        else:
            cols = m.get('cols', 4)
            fu = math_('FRACT', math_('MULTIPLY', u, cols))
            stall = math_('MAXIMUM', math_('LESS_THAN', fu, 0.06), math_('GREATER_THAN', fu, 0.94))
            aisle = between(v, 0.42, 0.58)
            stripe = math_('MULTIPLY', stall, math_('SUBTRACT', 1.0, aisle))
            col = mix(stripe, rgb(m['asphalt']), rgb(m['stripe']))
        L.new(col, b.inputs['Base Color'])
    else:
        b.inputs['Base Color'].default_value = lin3(m['c']) + (1,)
    cache[key] = mat
    return mat


def build(bpy, sc):
    """the factory's faces as Blender meshes in metres: Blender X = y, Y = x (the mirror), Z = z x 0.8165"""
    k = CELL_M / plate_units(sc)
    groups = {}
    cache = {}
    for verts, n, m in sc['faces']:
        if m is None: continue
        mat = material_for(bpy, m, cache)
        groups.setdefault(mat.name, (mat, []))[1].append(verts)
    objs = []
    for name, (mat, quads) in groups.items():
        v = np.array([[p[1] * k, p[0] * k, p[2] * k * ZC] for q in quads for p in q], np.float32)
        f = np.arange(len(v), dtype=np.int32).reshape(-1, 4)
        f = f[:, ::-1].copy()                                  # the mirror flips the winding: reverse it so normals face out
        me = bpy.data.meshes.new('m_' + name); me.vertices.add(len(v)); me.vertices.foreach_set('co', v.ravel())
        me.loops.add(f.size); me.loops.foreach_set('vertex_index', f.ravel()); me.polygons.add(len(f)); me.polygons.foreach_set('loop_start', np.arange(0, f.size, 4))
        me.update(calc_edges=True)
        uvl = me.uv_layers.new(name='UVMap')
        quv = np.array([(0, 0), (1, 0), (1, 1), (0, 1)], np.float32)[::-1]
        uvl.data.foreach_set('uv', np.tile(quv, (len(f), 1)).ravel())
        me.materials.append(mat)
        o = bpy.data.objects.new('o_' + name, me); bpy.context.scene.collection.objects.link(o); objs.append(o)
    return objs, k


def camera(bpy, sc_, sc, k):
    """the iso3d frame: origin (ox, oy) in final pixels is the world origin; scale s final px a factory unit"""
    import mathutils
    s = sc['scale']; W, H = sc['w'], sc['h']; ox, oy = sc['origin']
    ppu = s * math.sqrt(2) / k                                 # final px a metre along the screen
    e, a = math.radians(30), math.radians(45)
    D = mathutils.Vector((math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)))
    f = -D; Rt = f.cross(mathutils.Vector((0, 0, 1))).normalized(); U = Rt.cross(f).normalized()
    centre = Rt * ((W / 2 - ox) / ppu) + U * ((oy - H / 2) / ppu)
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'HORIZONTAL'; cd.ortho_scale = W / ppu; cd.clip_end = 2000
    cam = bpy.data.objects.new('cam', cd); sc_.collection.objects.link(cam); sc_.camera = cam
    cam.location = centre + D * 600
    cam.rotation_euler = f.to_track_quat('-Z', 'Y').to_euler()
    sc_.render.resolution_x, sc_.render.resolution_y = W, H
    return cam


def render(d, sc):
    import bpy
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    bpy.ops.wm.read_factory_settings(use_empty=True)
    s_ = bpy.context.scene
    objs, k = build(bpy, sc)
    RIG.source_pass(objs, WEAR, 1.0, sum(map(ord, d)) % 7)
    RIG.dent_pass(objs, 1.0)
    NF.ZS = ZC                                                 # the grime reads heights through this camera's squash
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=sum(map(ord, d)) % 97, bid=d)
    A = dict(sun_rot=list(RIG.G['sun_rot_deg']))
    sun = RIG.light_and_film(s_, A)                           # (the floor tool's wrap lays the grime first)
    import mathutils
    sun.rotation_euler.rotate(mathutils.Euler((0, 0, math.radians(135))))   # the rig's sun, turned with this camera
    camera(bpy, s_, sc, k)
    s_.render.film_transparent = True
    s_.cycles.samples = SAMPLES; s_.cycles.use_adaptive_sampling = True; s_.cycles.adaptive_threshold = 0.03
    s_.cycles.max_bounces = 3; s_.cycles.diffuse_bounces = 1; s_.cycles.glossy_bounces = 0; s_.cycles.transmission_bounces = 0
    for m in bpy.data.materials:
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    os.makedirs(os.path.join(OUT, 'render'), exist_ok=True)
    fn = os.path.join(OUT, 'render', '%s.png' % d); s_.render.filepath = fn
    bpy.ops.render.render(write_still=True)
    return fn


def finish(d, sc, fn):
    """the factory's own crop box, then the rig's population snap toward his colours"""
    from PIL import Image
    import bohemia_direction_master_rig as RIG
    a = np.asarray(Image.open(fn).convert('RGBA')).astype(float)
    op = a[..., 3] > 0
    pop, _b, _n = RIG.population('prop')
    px = a[..., :3][op]; bins = np.clip((px // 8).astype(int), 0, 31)
    a[..., :3][op] = px + (pop[bins[:, 0], bins[:, 1], bins[:, 2]] - px) * 0.35
    im = Image.fromarray(a.round().clip(0, 255).astype(np.uint8), 'RGBA').crop(sc['bbox'])
    assert im.size == (sc['bank_w'], sc['bank_h']), (im.size, sc['bank_w'], sc['bank_h'])
    os.makedirs(MASTERS, exist_ok=True)
    out = os.path.join(MASTERS, '%s.png' % d); im.save(out, optimize=True)
    return out


def to_bank(names=None):
    """the masters into the bank, same size and anchor; the pad colour re-measured with the factory's own sampler"""
    from PIL import Image
    import bohemia_district_hero_factory as HF
    bank = json.load(open(BANK))
    done = []
    for h in bank['heroes']:
        d = h['district']; p = os.path.join(MASTERS, '%s.png' % d)
        if (names and d not in names) or not os.path.exists(p): continue
        im = Image.open(p).convert('RGBA')
        assert im.size == (h['w'], h['h']), (d, im.size, h['w'], h['h'])
        buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
        h['b64'] = base64.b64encode(buf.getvalue()).decode()
        r, g, b, _a = HF._pad_colour(im); h['pad'] = '#%02x%02x%02x' % (r, g, b)
        h['through_the_rig'] = '10/20 COOK [every 2D asset into 3D]: the factory\'s scene rendered through the master rig (tools/bohemia_cook_the_map_through_the_rig_10_20_26.py)'
        done.append(d)
    json.dump(bank, open(BANK, 'w'))
    print('  into the bank:', len(done), done, flush=True)
    return done


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd, names = a[0], a[1:]
    if cmd == 'render':
        S = pickle.load(open(os.path.join(OUT, 'scenes.pkl'), 'rb'))
        for sc in S:
            if names and sc['district'] not in names: continue
            fn = render(sc['district'], sc)
            print('  master', sc['district'], finish(sc['district'], sc, fn), flush=True)
    elif cmd == 'bank':
        to_bank(names or None)
    sys.stdout.flush(); os._exit(0)
