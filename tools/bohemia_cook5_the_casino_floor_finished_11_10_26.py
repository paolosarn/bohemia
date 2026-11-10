#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [casino finished] 11/10/26: THE CASINO FLOOR'S CARPET THROUGH THE RIG.
VAMILY rule 443(g) (finished art where a stand-in stands: the four freeway boards, then the casino floor), rule 416 (the
big interiors), rule 441(a) (no stand-in where finished art is owed), rule 430 (a piece is improved, never thrown away).
His vote on the floor (combat2-the-casino-floor-11-8): YES, 'Work in progress'.

WHAT IT IS. COMBAT TWO owns the casino floor's rules and layout (slices/bohemia_casino_floor.js, casino_floor.json); this
tool touches PICTURES ONLY. Nine tenths of what he sees on that board is the carpet, and the carpet was the one thing on it
that never went through the rig: block_casino_* is the flat 10/9 picture (his YES on its design: a burgundy field under a
gold diamond lattice), ruler-straight and the same everywhere. Here the SAME carpet is built as a surface and rendered the
way every fight ground has been since 10/19: the field and the lattice as material in metres (the lattice his own square diamond, eleven
to a tile, so it joins tile to tile whichever tile the floor picks), the pile and its nap, the lattice worn off
where forty years of feet went, threadbare to the backing in patches, the spills, the burns, the carpet come loose and
rucked in long ridges that catch the light, the ceiling tiles that came down, the paper; then the master rig's source pass,
one sun and film, the not-final tool's grime, the rig's camera at the fight's 42.92 px a metre.
One 60 m sheet of 25 tiles (the floor picks any tile of it for any place): slices/fight_ground/casino/casino_carpet_0.webp.

  <venv>/bin/python tools/bohemia_cook5_the_casino_floor_finished_11_10_26.py render [--quick]   (about 5 min)
  python3 tools/bohemia_cook5_the_casino_floor_finished_11_10_26.py cut                          (the sheet, the json's two lines)

ANALOG HORROR (rule 20), at the source: the lattice is worn off exactly where people stood longest, so the floor still
shows where the crowd was the night it stopped.
REFERENCE CHECK (the 9/4 standing duty): his own 10/9 carpet (slices/fight_ground/block_casino_0.webp) is the twin: the
field 88,51,44 and the lattice 145,112,85 are read off it and matched; real Strip carpet (woven Axminster, a small repeat
under a loud field, replaced every five to seven years because the aisles wear through to the jute); the closed Strip
casinos' photographs after 2008 and 2020 (fallen ceiling tiles on the gaming floor, carpet rucked where machines were
dragged out). No reference game.
REUSE CHECK (REUSE-FIRST): the freeway tool's rig(), finish(), shoot() and debris (imported); the floor tool's material
helper NT, its grid and camera; the master rig's source pass; the not-final tool's grime and instances; his carpet's design.
TASTE CHECK: his YES on the carpet's design stays (rule 430): nothing of the design changes, only what forty years and one
collapse did to it.
"""
import os, sys, json, math
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_freeway_finished_11_10_26 as FW

SHIP = os.path.join(R, 'slices', 'fight_ground', 'casino')
OUT = os.path.join(R, 'records', 'target', 'cook5_casino')
FIELD, LATTICE, BACKING = (88, 51, 44), (145, 112, 85), (132, 118, 96)
LATTICE_SRC = (166, 126, 62)       # what goes INTO the rig for his lattice to come out near 145,112,85 (the rig drains a gold: 145,112,85 in came out 128,83,70)


def lin(rgb):
    return tuple(((c / 255.0) / 12.92 if c <= 10 else ((c / 255.0 + 0.055) / 1.055) ** 2.4) for c in rgb)


def carpet_material(bpy, F, cal=(1.0, 1.0, 1.0), lcal=None):
    m = bpy.data.materials.new('ground_carpet'); m.use_nodes = True
    T = F.NT(m); b = T.n['Principled BSDF']
    b.inputs['Roughness'].default_value = 1.0; b.inputs['Metallic'].default_value = 0.0; b.inputs['Specular IOR Level'].default_value = 0.0
    sep = T.new('ShaderNodeSeparateXYZ'); T.link(T.coords(1.0), sep.inputs[0])
    # the lattice: HIS diamond, square on the ground and 45 degrees to the walls (measured on block_casino_0: 48.5 px across and
    # 34.3 px up the picture, which is 1.13 m both ways on the ground under the 45 camera); here eleven to a 12 m tile (1.09 m),
    # so any tile of the sheet meets any other line for line (his 10.6 to a tile never did); its yarn a little off the line
    # everywhere (woven, never ruled)
    wob = T.math('MULTIPLY', T.math('SUBTRACT', T.noise(7.0, 2, 0.5, (3, 1, 0)), 0.5), 0.035)
    K = 11.0 / 12.0
    xs = T.math('MULTIPLY', sep.outputs['X'], K); ys = T.math('MULTIPLY', sep.outputs['Y'], K)
    du = T.math('PINGPONG', T.math('ADD', T.math('ADD', xs, ys), 1100.0), 0.5)
    dv = T.math('PINGPONG', T.math('ADD', T.math('SUBTRACT', xs, ys), 1100.0), 0.5)
    d = T.math('ADD', T.math('MINIMUM', du, dv), wob)
    line = T.ramp(d, 0.046, 0.03)                                               # his yarn is about 5 cm on the ground (3 px of the picture)
    inner = T.ramp(T.math('MINIMUM', du, dv), 0.33, 0.37)                       # tone on tone: the heart of each diamond a shade deeper
    # where the feet went: the pile flattened and the lattice worn off; and worn through to the backing in the worst of it
    # THE FLOOR PICKS ANY TILE OF THIS SHEET FOR ANY PLACE (COMBAT TWO's carpet()), so nothing big may cross a tile's edge
    # (measured on the page 11/10: wear nine metres across came out as dark and light squares): every worn place is a
    # few metres across and fades out within 1.6 m of the 12 m tile's edge, and the field between is one tone everywhere
    edge = T.math('MULTIPLY', T.ramp(T.math('PINGPONG', T.math('ADD', sep.outputs['X'], 1200.0), 6.0), 0.15, 1.75), T.ramp(T.math('PINGPONG', T.math('ADD', sep.outputs['Y'], 1200.0), 6.0), 0.15, 1.75))
    walk = T.math('MULTIPLY', T.ramp(T.noise(0.3, 3, 0.55, (9, 4, 0)), 0.5, 0.64), edge)
    bare = T.math('MULTIPLY', T.ramp(T.noise(0.42, 4, 0.6, (2, 7, 5)), 0.63, 0.69), edge)
    field = lin(tuple(min(255.0, c * k) for c, k in zip(FIELD, cal))); gold = lin(LATTICE_SRC); back = lin(tuple(min(255.0, c * k) for c, k in zip(BACKING, cal)))
    deep = tuple(c * 0.8 for c in field)
    col = T.mix(T.math('MULTIPLY', inner, 0.5), field, deep)
    keep = T.math('SUBTRACT', 1.0, T.math('MULTIPLY', walk, T.ramp(T.noise(5.0, 2, 0.6, (1, 1, 8)), 0.25, 0.7)))
    col = T.mix(T.math('MULTIPLY', line, keep), col, gold)
    # the pile: a value step a few pixels wide, and the nap lying in long east-west strokes where a machine last ran over it
    pile = T.ramp(T.noise(38.0, 2, 0.6, (4, 4, 4)), 0.3, 0.7, 0.9, 1.1)
    nap = T.new('ShaderNodeTexNoise', Scale=1.0); mp = T.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (0.35, 5.0, 1.0)
    T.link(T.coords(1.0, (5, 2, 0)), mp.inputs['Vector']); T.link(mp.outputs['Vector'], nap.inputs['Vector'])
    napv = T.ramp(nap.outputs['Fac'], 0.35, 0.65, 0.93, 1.07)
    flat = T.ramp(walk, 0.0, 1.0, 1.0, 0.84)                                     # forty years of shoes: the walked pile is flat and the dirt is in it
    val = T.math('MULTIPLY', T.math('MULTIPLY', pile, napv), flat)
    # the backing where it is worn through: jute, its weave a grid of a centimetre
    wv = T.new('ShaderNodeTexChecker', Scale=1.0); T.link(T.coords(45.0), wv.inputs['Vector'])
    jute = T.mix(T.math('MULTIPLY', wv.outputs['Fac'], 0.25), back, tuple(c * 0.7 for c in back))
    col = T.mix(T.math('MULTIPLY', bare, 0.9), col, jute)
    # the spills (dark, soft) and the burns (small, black, a pale ring)
    spill = T.math('MULTIPLY', T.ramp(T.noise(0.6, 3, 0.6, (7, 7, 1)), 0.64, 0.71), edge)
    vor = T.new('ShaderNodeTexVoronoi', Scale=1.0); T.link(T.coords(0.9, (3, 3, 3)), vor.inputs['Vector'])
    burn = T.ramp(vor.outputs['Distance'], 0.05, 0.03)
    dark = T.math('MULTIPLY', T.math('SUBTRACT', 1.0, T.math('MULTIPLY', spill, 0.5)), T.math('SUBTRACT', 1.0, T.math('MULTIPLY', burn, 0.85)))
    val = T.math('MULTIPLY', val, dark)
    vv = T.new('ShaderNodeCombineColor'); [T.link(val, vv.inputs[i]) for i in range(3)]
    col = T.mix(1.0, col, vv.outputs['Color'], 'MULTIPLY')
    T.link(col, b.inputs['Base Color'])
    height = T.math('SUBTRACT', T.math('MULTIPLY', T.noise(38.0, 2, 0.5), 0.4), T.math('ADD', T.math('MULTIPLY', bare, 1.0), T.math('MULTIPLY', line, -0.25)))
    bump = T.new('ShaderNodeBump', Strength=0.5, Distance=0.006); T.link(height, bump.inputs['Height']); T.link(bump.outputs['Normal'], b.inputs['Normal'])
    m['palette_role'] = 'clay_rust'; m['palette_step'] = 1
    return m


def rucks(rng, n=30):
    """where the carpet came off its tack strip and rode up: low ridges a few metres long, each a line with a start and an end"""
    out = []
    for _ in range(n):
        x, y = rng.uniform(0, 60), rng.uniform(0, 60); a = rng.uniform(0, math.pi); L = rng.uniform(2.5, 9.0)
        out.append(((x, y), (x + math.cos(a) * L, y + math.sin(a) * L), rng.uniform(0.035, 0.075), rng.uniform(0.12, 0.22)))
    return out


def carpet_mesh(bpy, mat, rng):
    st = 0.08; n = int(62.0 / st) + 1
    xs = np.arange(n, dtype=np.float32) * st - 1.0; ys = 61.0 - np.arange(n, dtype=np.float32) * st
    X, Y = np.meshgrid(xs, ys); Z = np.zeros_like(X)
    for (a, b, h, w) in rucks(rng):
        ax, ay = a; bx, by = b; dx, dy = bx - ax, by - ay; L2 = dx * dx + dy * dy
        t = np.clip(((X - ax) * dx + (Y - ay) * dy) / L2, 0, 1)
        dist = np.sqrt((X - ax - t * dx) ** 2 + (Y - ay - t * dy) ** 2)
        taper = np.clip(np.minimum(t, 1 - t) * 6, 0, 1) if h < 0.085 else 1.0
        Z = np.maximum(Z, h * np.exp(-(dist / w) ** 2) * taper)
    ex = np.clip((np.minimum((X + 1200.0) % 12.0, 12.0 - (X + 1200.0) % 12.0) - 0.15) / 1.6, 0, 1); ey = np.clip((np.minimum((Y + 1200.0) % 12.0, 12.0 - (Y + 1200.0) % 12.0) - 0.15) / 1.6, 0, 1)
    Z *= ex * ey                                                # a ruck dies out before the tile's edge (any tile meets any tile)
    Z += FW.vnoise(Z.shape, 40, rng) * 0.006
    co = np.stack([X, Y, Z], -1).reshape(-1, 3)
    me = bpy.data.meshes.new('carpet'); me.vertices.add(len(co)); me.vertices.foreach_set('co', co.ravel())
    i = np.arange(n * n).reshape(n, n)
    q = np.stack([i[1:, :-1], i[1:, 1:], i[:-1, 1:], i[:-1, :-1]], -1).reshape(-1, 4)
    me.loops.add(q.size); me.loops.foreach_set('vertex_index', q.ravel()); me.polygons.add(len(q)); me.polygons.foreach_set('loop_start', np.arange(0, q.size, 4))
    me.update(calc_edges=True); me.polygons.foreach_set('use_smooth', np.ones(len(q), bool)); me.materials.append(mat)
    o = bpy.data.objects.new('carpet', me); bpy.context.scene.collection.objects.link(o); return o


def scene_carpet(quick=False):
    import bpy
    NF, F, RIG = FW.rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    CAL = json.load(open(os.path.join(OUT, 'calibration.json'))) if os.path.exists(os.path.join(OUT, 'calibration.json')) else {}
    cal = CAL.get('mul', [1.0, 1.0, 1.0]); lcal = CAL.get('lattice_mul', cal)
    rng = np.random.RandomState(416)
    ground = carpet_mesh(bpy, carpet_material(bpy, F, cal, lcal), rng)
    M = FW.things_mats(bpy, NF); M['tile'] = NF.material(bpy, 'cs_ceiling_tile', 'clay_bone', 3, 0.9)
    box = (NF.CUBE_V, NF.CUBE_F); tiles, bits = [], []
    for _ in range(34):                                         # the ceiling's tiles, down: 0.6 m squares, most of them broken
        x, y = rng.uniform(0, 60), rng.uniform(0, 60); rz = rng.uniform(0, 6.3)
        if rng.rand() < 0.4: tiles.append((x, y, 0.0, 0.6, 0.6, 0.02, rz, 0.0))
        else:
            for k in range(rng.randint(2, 5)):
                bits.append((x + rng.uniform(-0.4, 0.4), y + rng.uniform(-0.4, 0.4), 0.0, rng.uniform(0.12, 0.38), rng.uniform(0.1, 0.3), 0.02, rng.uniform(0, 6.3), 0.0))
    things = [o for o in (NF.instances(bpy, 'cs_tiles', box, tiles, M['tile'], 0.0, rng), NF.instances(bpy, 'cs_tile_bits', box, bits, M['tile'], 0.3, rng)) if o is not None]
    things += FW.debris(bpy, NF, {'rubber': M['paper'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r: (r.uniform(0, 60), r.uniform(0, 60)), 60)
    # a carpet indoors takes a share of the dust the rig lays on what faces up (the road's own mechanism, wear_by_material):
    # at the full dose his burgundy went grey (measured: 92,76,70 against his 88,51,44 whatever the source colour)
    RIG.G['wear_by_material'] = dict(RIG.G['wear_by_material'], carpet=0.12)
    src = RIG.source_pass([ground], 0.2, 1.0, 0)
    if things: RIG.source_pass(things, float(RIG.G['wear']), 1.0, 3)
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    for o in [ground] + things: o.scale = (1, 1, zs)
    NF.grime_pass(bpy, [], 4)
    for m in bpy.data.materials:
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    FW.REND = os.path.join(OUT, 'render')
    return FW.shoot(bpy, F, RIG, 'carpet', quick)


STAGE_AT, STEPS_AT = (18.0, 30.0), (42.0, 30.0)


def scene_stage(quick=False):
    """THE LOUNGE STAGE and ITS FRONT (COMBAT TWO's two pieces, the same canvas and the same foot): the riser came out of the
    rig a bare beige slab, its carpet dusted grey like the floor's was. Here it is what a lounge stage is: plywood sheets
    painted black and walked back to the wood along every seam, a taped cable run, spike marks; its front a black skirt
    under the brass nosing, two carpeted steps, the fallen mic, an amp"""
    import bpy
    NF, F, RIG = FW.rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    rng = np.random.RandomState(417)
    M = dict(board=NF.material(bpy, 'cs_stage_board', 'cloth_black', 2, 1.0), board_b=NF.material(bpy, 'cs_stage_board_b', 'cloth_black', 1, 1.15),
             wood=NF.material(bpy, 'cs_stage_wood', 'tape_masking', 1, 0.9), skirt=NF.material(bpy, 'cs_stage_skirt', 'cloth_black', 1, 1.0),
             brass=NF.material(bpy, 'cs_brass', 'clay_mustard', 2, 0.9), tape=NF.material(bpy, 'cs_tape', 'tape_masking', 3, 0.9),
             steel=NF.material(bpy, 'cs_steel', 'tape_grey', 1, 1.0), dark=NF.material(bpy, 'cs_dark', 'rubber', 0, 1.0),
             carpet=NF.srgb_mat(bpy, 'cs_step_carpet', FIELD, 'clay_rust'))
    P = FW.Parts(); ox, oy = STAGE_AT
    # the riser's body and its deck of 1.2 by 2.4 m sheets (ten by five to a tile), a bare-wood line where two sheets meet
    P.box('skirt', ox - 6, ox + 6, oy - 6, oy + 6, 0.0, 0.96)
    P.box('wood', ox - 6, ox + 6, oy - 6, oy + 6, 0.96, 0.985)
    for i in range(5):
        for j in range(10):
            x0 = ox - 6 + i * 2.4; y0 = oy - 6 + j * 1.2; g = 0.018
            P.box('board' if rng.rand() < 0.6 else 'board_b', x0 + g, x0 + 2.4 - g, y0 + g, y0 + 1.2 - g, 0.985, 1.0 + rng.uniform(0, 0.006))
    P.box('tape', ox - 6, ox + 6, oy - 0.9, oy - 0.82, 1.006, 1.009)                                          # the cable run, taped down the whole stage
    P.box('dark', ox - 6, ox + 6, oy - 0.875, oy - 0.845, 1.009, 1.03)
    for (sx, sy) in ((-3.1, 2.2), (2.6, -3.4)):                                                              # two spike marks
        P.box('tape', ox + sx - 0.2, ox + sx + 0.2, oy + sy - 0.03, oy + sy + 0.03, 1.006, 1.009); P.box('tape', ox + sx - 0.03, ox + sx + 0.03, oy + sy - 0.2, oy + sy + 0.2, 1.006, 1.009)
    # its front (the origin is the face's foot line): the skirt, the nosing, two steps, the mic, the amp
    ox, oy = STEPS_AT
    P.box('skirt', ox - 6, ox + 6, oy, oy + 0.4, 0.0, 1.0); P.box('board', ox - 6, ox + 6, oy + 0.4, oy + 2.2, 0.985, 1.0)
    P.box('brass', ox - 6, ox + 6, oy - 0.05, oy + 0.05, 0.96, 1.04)
    for k in range(2): P.box('carpet', ox - 1.5, ox + 1.5, oy - 1.0 + k * 0.5, oy - 0.5 + k * 0.5, 0.0, 0.33 * (k + 1))
    P.bar('steel', (ox + 2.0, oy + 1.2, 1.02), (ox + 3.3, oy + 0.8, 1.08), 0.02); P.drum('steel', ox + 3.3, oy + 0.8, 1.0, 1.02, 0.16, 12)
    P.box('dark', ox - 4.45, ox - 3.55, oy + 1.15, oy + 1.65, 1.0, 1.7); P.box('steel', ox - 4.4, ox - 3.6, oy + 1.14, oy + 1.15, 1.08, 1.6)
    things = P.build(bpy, 'stage', M)
    RIG.G['wear_by_material'] = dict(RIG.G['wear_by_material'], carpet=0.12, cs_stage=0.18)
    RIG.source_pass(things, float(RIG.G['wear']), 1.0, 6); RIG.dent_pass(things, 1.0)
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    for o in things: o.scale = (1, 1, zs)
    NF.grime_pass(bpy, [], 6)
    for m in bpy.data.materials:
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    FW.REND = os.path.join(OUT, 'render')
    return FW.shoot(bpy, F, RIG, 'stage', quick, samples=64, transparent=True)


def cut_stage():
    im = Image.open(os.path.join(OUT, 'render', 'stage.png')).convert('RGBA')
    px = lambda xm: xm * FW.PPM; py = lambda ym: (60.0 - ym) / 60.0 * FW.H
    sz = json.load(open(os.path.join(SHIP, 'sizes.json')))
    # the riser tile: the canvas COMBAT TWO's piece has (516 x 407), its bottom the riser's south foot line
    w, h = sz['stage']['w'], sz['stage']['h']; cx = px(STAGE_AT[0]); bot = py(STAGE_AT[1] - 6.0)
    a = im.crop((int(round(cx - w / 2)), int(round(bot - h)), int(round(cx - w / 2)) + w, int(round(bot - h)) + h)); a.save(os.path.join(SHIP, 'casino_stage.webp'), 'WEBP', quality=88, method=6)
    # its front: 516 x 154, the bottom the first step's south foot (1 m south of the face)
    w, h = sz['stage_steps']['w'], sz['stage_steps']['h']; cx = px(STEPS_AT[0]); bot = py(STEPS_AT[1] - 1.0)
    b = im.crop((int(round(cx - w / 2)), int(round(bot - h)), int(round(cx - w / 2)) + w, int(round(bot - h)) + h)); b.save(os.path.join(SHIP, 'casino_stage_steps.webp'), 'WEBP', quality=88, method=6)
    print('stage', a.size, a.getbbox(), 'steps', b.size, b.getbbox())


def calibrate():
    """the field's colour after the rig's light, dust and old-paint pass against his carpet's (88,51,44): a multiplier a
    channel on the source colour (the rig drains and dusts everything that faces up; the carpet's burgundy is his YES),
    kept in the record"""
    fn = os.path.join(OUT, 'render', 'carpet_quick.png')
    a = np.asarray(Image.open(fn).convert('RGB'), np.float32).reshape(-1, 3)
    med = np.median(a, 0)                                       # the field is three quarters of the picture
    cp = os.path.join(OUT, 'calibration.json'); old = json.load(open(cp))['mul'] if os.path.exists(cp) else [1.0, 1.0, 1.0]
    lin1 = lambda c: (c / 255.0) ** 2.2
    mul = [float(np.clip(old[i] * (lin1(FIELD[i]) / max(lin1(med[i]), 1e-5)) ** (1 / 2.2), 0.2, 3.0)) for i in range(3)]
    json.dump(dict(mul=[round(v, 4) for v in mul], field_render=[round(float(v), 1) for v in med], field_target=list(FIELD)), open(cp, 'w'), indent=1)
    print('field renders', med, 'target', FIELD, 'mul', [round(v, 3) for v in mul])


def cut():
    im = Image.open(os.path.join(OUT, 'render', 'carpet.png')).convert('RGB')
    im.save(os.path.join(SHIP, 'casino_carpet_0.webp'), 'WEBP', quality=66, method=6)
    p = os.path.join(SHIP, 'casino_floor.json'); raw = open(p).read()
    old = '"carpet": ["block_casino_0.webp", "block_casino_1.webp", "block_casino_2.webp"]'
    if old in raw:                                              # the floor's own data file: the carpet's picture list, nothing else
        raw = raw.replace(old, '"carpet": ["casino/casino_carpet_0.webp"]'); open(p, 'w').write(raw)
    json.loads(open(p).read())
    print('carpet', os.path.getsize(os.path.join(SHIP, 'casino_carpet_0.webp')), 'bytes')


def sheet(before_dir, now_dir):
    """records/target/COOK5_THE_CASINO_FLOOR_FINISHED_11_10.webp: what the VOTE card shows (the page's own screenshots:
    casino_before_upright_<dark|power>.png from the build before, casino_now_<upright|sideways>_<dark|power>.png now)"""
    from PIL import ImageDraw, ImageFont
    font = lambda sz: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), sz)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    FGD = os.path.join(R, 'slices', 'fight_ground')
    old = Image.open(os.path.join(FGD, 'block_casino_0.webp')).convert('RGB').crop((515, 364, 515 + 575, 364 + 364))
    new = Image.open(os.path.join(SHIP, 'casino_carpet_0.webp')).convert('RGB').crop((515 * 3, 364 * 2, 515 * 3 + 575, 364 * 3))
    title('THE CARPET: HIS 10/9 PICTURE, AND THE SAME CARPET AS A SURFACE', 'one art pixel to one screen pixel. left: the flat picture the floor wore. right: now, through the rig.')
    r = Image.new('RGB', (WID, 364), BG); r.paste(old, (0, 0)); r.paste(new, (595, 0)); rows.append(r)
    # the stage: the old pieces out of git's last commit of them are not kept here; the new ones on the carpet
    st = Image.open(os.path.join(SHIP, 'casino_stage.webp')).convert('RGBA'); sp = Image.open(os.path.join(SHIP, 'casino_stage_steps.webp')).convert('RGBA')
    title('THE LOUNGE STAGE: BLACK STAGE BOARDS, ITS FRONT UNDER THE BRASS NOSING', 'a tile of the riser and the riser\'s front, as the floor lays them (it was a bare beige slab)')
    r = Image.new('RGBA', (WID, 420), FIELD + (255,)); r.alpha_composite(st, (20, 6)); r.alpha_composite(sp, (600, 130)); rows.append(r.convert('RGB'))
    title('ON HIS PHONE, UPRIGHT: BEFORE AND NOW', 'the fight\'s own camera, 390 x 844: dark (no power), then with the power paid')
    cw = (WID - 30) // 4; r = Image.new('RGB', (WID, int(660 * cw / 390) + 30), BG); d = ImageDraw.Draw(r); x = 0; first = None
    for lab, fn in (('DARK, BEFORE', os.path.join(before_dir, 'casino_before_upright_dark.png')), ('DARK, NOW', os.path.join(now_dir, 'casino_now_upright_dark.png')),
                    ('POWER, BEFORE', os.path.join(before_dir, 'casino_before_upright_power.png')), ('POWER, NOW', os.path.join(now_dir, 'casino_now_upright_power.png'))):
        n = Image.open(fn).convert('RGB'); n = n.crop((0, 0, n.width, int(n.width * 660 / 390))).resize((cw, int(660 * cw / 390)), Image.LANCZOS)
        d.text((x + 4, 4), lab, font=font(14), fill=INK if 'NOW' in lab else DIM); r.paste(n, (x, 26))
        if lab == 'POWER, NOW': first = (x, 26, cw, n.height)
        x += cw + 10
    rows.append(r)
    title('ON HIS PHONE, SIDEWAYS: NOW', '844 x 390: dark, and with the power paid')
    sw = (WID - 10) // 2; r = Image.new('RGB', (WID, int(390 * sw / 844)), BG)
    for i, k in enumerate(('dark', 'power')):
        r.paste(Image.open(os.path.join(now_dir, 'casino_now_sideways_%s.png' % k)).convert('RGB').resize((sw, int(390 * sw / 844)), Image.LANCZOS), (i * (sw + 10), 0))
    rows.append(r)
    out = Image.new('RGB', (WID, sum(q.height + 8 for q in rows)), BG); y = 0; fy = 0
    for i, q in enumerate(rows):
        out.paste(q, (0, y))
        if i == 5: fy = y
        y += q.height + 8
    dst = os.path.join(R, 'records/target/COOK5_THE_CASINO_FLOOR_FINISHED_11_10.webp'); out.save(dst, 'WEBP', quality=78, method=6)
    n = Image.open(os.path.join(now_dir, 'casino_now_upright_power.png')).convert('RGB'); n = n.crop((0, 0, n.width, int(n.width * 660 / 390)))
    n.resize((n.width // 2, n.height // 2), Image.LANCZOS).save(os.path.join(R, 'records/target/vote_first/cook5-the-casino-floor-finished-11-10.webp'), 'WEBP', quality=82, method=6)
    print('sheet', out.size, os.path.getsize(dst), 'first at', (first[0], fy + first[1], first[2], first[3]))


if __name__ == '__main__':
    a = sys.argv[1:]
    os.makedirs(os.path.join(OUT, 'render'), exist_ok=True)
    if a and a[0] == 'render' and 'stage' in a: scene_stage('--quick' in a)
    elif a and a[0] == 'render': scene_carpet('--quick' in a)
    elif a and a[0] == 'cut' and 'stage' in a: cut_stage()
    elif a and a[0] == 'calibrate': calibrate()
    elif a and a[0] == 'sheet': sheet(a[1], a[2])
    elif a and a[0] == 'cut': cut()
    else: print(__doc__)
