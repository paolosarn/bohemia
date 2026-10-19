#!/usr/bin/env python3
"""BOHEMIA -- COOK [the buildings through the rig] 10/19/26: EVERY BUILDING HE HAS SEEN AS TILES, MODELLED AT THE SIZE COOK FOUR
MEASURED, WEATHERED, AND RENDERED THROUGH THE MASTER RIG'S OWN PIECES.
Rule 121(j) (Paolo 10/19: 'even the floor tiles and building tiles and all accessories have to get remade with this analog
horror Crashbox style. Everything. Everything.'); 121(k) ('Remodel everything 3D grimey Crashbox analog horror machine party
vibes'); his votes on COOK FOUR's Strip ('3d remodel otw', 'Were changing to the 3d models revamp for everything now').

THE BUILDINGS (sizes, openings and the one wrong thing each are COOK FOUR's, read from its records 10/17 to 10/19; the
front faces the camera, -Y, as every glTF here does):
  ranch_plain    10 m front, a chain-link yard and a KEEP OUT sheet on it; a chimney with no smoke (all five ranches)
  ranch_garage   11.5 m and a 6 m two-car garage, its roll-up nailed shut with two planks
  ranch_carport  9.5 m and a 3.6 m carport on two posts, left empty; a boarded window
  ranch_wing     9 m and a 4.5 m wing set 3 m forward under its own lower roof (the L)
  ranch_porch    11 m and a 5 m porch on three posts; the door in its shade nailed shut, a window boarded
  casino         a 26 m hall 4.5 m tall, no windows, a marquee 8.6 m long out 2.4 m at 3.6 m, six half-glass doors, a
                 blank 6 x 3 m sign on legs over the ridge; the middle pair of doors open on a black room
  tower_casino   31 m wide, 14 deep, a 5 m ground floor and eight floors of 3 m; the top floor shuttered and clean, the
                 two under it boarded, five panes broken lower down; a 10 x 2.4 m sign over the ridge
  church         an 18 m nave 5 m tall, a 4.2 m tower 12 m to its eave with a capped roof, a 7 m hall; five arched
                 windows, the middle one boarded; the six pews out on the forecourt, facing the road
  motel          26.6 m: a 5 m office and six 3.6 m rooms under a walkway roof on seven posts; room 4's door marked and
                 its window boarded; two coolers on the roof
  motel_sign     a 10.1 m sign tower on two legs, a 2 x 5 m blade, a 5.5 m arrow on top, a VACANCY box; nothing lit, and
                 the arrow points away from the motel, out at the desert
  pawn_shop      14 m front 3.8 m tall, four barred windows, a steel door, a 7 x 0.9 m fascia sign, three rows of queue
                 rails; the queue empty and the door shut
  chapel         9 m front 3.6 m tall, a 1.6 m bell cote, two arched windows, a canopy on two posts, a pole sign; two
                 flower boxes with the flowers alive, red and gold
  gas_station    an 8 x 6 m canopy at 4.3 m over two pumps, a 6 m office, two 4 m bays; bay two's roll-up stopped 0.7 m
                 off the floor, dark under it
  warehouse      an 18 m shed 6 m tall on a 1.2 m dock, three dock doors, six high windows (one boarded), a 5 m office;
                 the office's barred window lit warm amber
  school         three 9 m classrooms 3.3 m tall and an 11 m hall 5.2 m tall under a walkway roof; two of three doors
                 boarded; room three's wire glass lit the cold grey-blue of a television left on

Built like the props (tools/bohemia_cook_model_props.py, its helpers imported): puppet shapes from boxes and pulled
profiles, every base colour a step of a role of records/target/BOHEMIA_STYLE_PALETTE.json, roughness 1, specular 0; the
roofs in the valley's tans (his 10/17: 'more tan... never bright medieval orange'), ridges along the front (COOK FOUR's
measured straight roof: the ridge the length of the building, no gable end at the camera).

THE RENDER (render()): the master rig's own pieces, imported from tools/bohemia_direction_master_rig.py: source_pass at the
guide's wear 0.6, dent_pass, light_and_film, population('settlement') + post (the snap toward his settlement family's own
colours at the guide's pull, the ring), card and guide_card; the rig's camera (orthographic, tilted 45, facing north, never
turned, 57 px a metre, heights x 1.414); the facings the map and the settlement draw, S, SE and SW; a shadow catcher under
the building so its own cast shadow and its contact darkness ship as the shadow layer (the rig's convention: black at
alpha, beside the body, on the same box). The occlusion and bevel nodes at one ray a camera sample (tools/bohemia_cook_rig_one_ray.py).

  <venv>/bin/python tools/bohemia_cook_model_buildings.py <name> [...]       (build, export glb, render; about 1 to 6 min)
  -> reference/models/bohemia/bld_<name>.glb, records/target/master_rig/cook_bld_<name>/

REFERENCE CHECK (the 9/4 standing duty): COOK FOUR's sheets (records/target/COOK4_*.png/.webp) are the twins at 1:1 on the
sheet, the sizes are theirs; real Las Vegas: a 1960s ranch at 2.7 m to the eave and a 4:12 roof, Clark County motel rooms
3.6 m on centre, a gas canopy 4.3 m clear. No reference game.
REUSE CHECK (REUSE-FIRST): the props modeller's mat/box/cyl/rod/prism, the master rig's pieces; no bank opened (nothing in
banks/ is a 3D model).
TASTE CHECK: the rig is the look (rule 115); his tans on the roofs; one wrong thing a building, COOK FOUR's, kept.
"""
import os, sys, json, math, time
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_model_props as P
import bohemia_direction_master_rig as RIG

PPM = float(RIG.G['ppm'])
FACINGS = ['S', 'SE', 'SW']
TURNS = ('ranch_plain', 'ranch_garage', 'ranch_carport', 'ranch_wing', 'ranch_porch')   # the map turns a house; the Strip faces its street (S only)
M = {}
TINT = {}   # a house's own shade of its stucco and its roof, set by whoever places it (the fight's suburb blocks)


def mats(bpy):
    """the building set: eight kinds, each a palette step (the props modeller's mat())"""
    if M: return M
    spec = dict(stucco=('clay_bone', 3), stone=('tape_grey', 2), roof=('tape_masking', 2), flat=('clay_bone', 2), trim=('tape_grey', 1),
                glass=('glass_eye', 0), wood=('clay_mustard', 1), ply=('tape_masking', 2), steel=('metal_painted', 2), dark=('rubber', 1),
                rust=('clay_rust', 1), teal=('clay_teal', 2), red=('clay_rust', 2), gold=('clay_mustard', 2), pale=('clay_bone', 3))
    for k, (role, step) in spec.items():
        M[k] = P.mat(bpy, 'bld_' + k, role, step)
        if k in TINT:                                         # one house's own paint and roof (a street is never one colour)
            b = M[k].node_tree.nodes['Principled BSDF']; c = b.inputs['Base Color'].default_value
            b.inputs['Base Color'].default_value = (min(1, c[0] * TINT[k][0]), min(1, c[1] * TINT[k][1]), min(1, c[2] * TINT[k][2]), 1)
    # THE ROOF IN COURSES: 3-tab shingle strips 0.9 m long in 0.2 m courses up the slope (Brick, object x and the slope's
    # rise scaled to its run), each strip its own shade; the flat deck's gravel
    for key, w_, h_, mul in (('roof', 0.9, 0.2, 3.1), ('flat', 0.25, 0.25, 1.0)):
        nt = M[key].node_tree; b = nt.nodes['Principled BSDF']; c = tuple(b.inputs['Base Color'].default_value)
        tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
        mz = nt.nodes.new('ShaderNodeMath'); mz.operation = 'MULTIPLY'; mz.inputs[1].default_value = mul; nt.links.new(sep.outputs['Z' if key == 'roof' else 'Y'], mz.inputs[0])
        cmb = nt.nodes.new('ShaderNodeCombineXYZ'); nt.links.new(sep.outputs['X'], cmb.inputs['X']); nt.links.new(mz.outputs[0], cmb.inputs['Y'])
        br = nt.nodes.new('ShaderNodeTexBrick'); br.offset = 0.5; br.inputs['Scale'].default_value = 1.0
        br.inputs['Brick Width'].default_value = w_; br.inputs['Row Height'].default_value = h_; br.inputs['Mortar Size'].default_value = 0.012 if key == 'roof' else 0.03
        br.inputs['Color1'].default_value = c; br.inputs['Color2'].default_value = tuple(x * 0.84 for x in c[:3]) + (1,)
        br.inputs['Mortar'].default_value = tuple(x * 0.55 for x in c[:3]) + (1,); br.inputs['Bias'].default_value = 0.0
        nt.links.new(cmb.outputs[0], br.inputs['Vector'])
        # every strip its own weathering: a 4 cm mottle and a 1 cm pock over the strip's shade (the card read the flat strips
        # as 2.45 px runs on the plain ranch, round one)
        mul = nt.nodes.new('ShaderNodeMixRGB'); mul.blend_type = 'MULTIPLY'; mul.inputs['Fac'].default_value = 1.0
        prod = None
        for sc_, lo_, hi_ in ((25.0, 0.8, 1.16), (90.0, 0.86, 1.1)):
            nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = sc_; nz.inputs['Detail'].default_value = 2.0
            nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
            mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 0.32; mr.inputs['From Max'].default_value = 0.68
            mr.inputs['To Min'].default_value = lo_; mr.inputs['To Max'].default_value = hi_; nt.links.new(nz.outputs['Fac'], mr.inputs['Value'])
            if prod is None: prod = mr.outputs['Result']
            else:
                mm = nt.nodes.new('ShaderNodeMath'); mm.operation = 'MULTIPLY'; nt.links.new(prod, mm.inputs[0]); nt.links.new(mr.outputs['Result'], mm.inputs[1]); prod = mm.outputs[0]
        vv = nt.nodes.new('ShaderNodeCombineColor'); [nt.links.new(prod, vv.inputs[i]) for i in range(3)]
        nt.links.new(br.outputs['Color'], mul.inputs['Color1']); nt.links.new(vv.outputs['Color'], mul.inputs['Color2'])
        nt.links.new(mul.outputs['Color'], b.inputs['Base Color'])
        bump = nt.nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.6; bump.inputs['Distance'].default_value = 0.02
        nt.links.new(br.outputs['Fac'], bump.inputs['Height']); nt.links.new(bump.outputs['Normal'], b.inputs['Normal'])
    # THE GRIME ON THE WALLS: forty years of desert rain splashed up the foot of every wall (dark to 0.45 m, broken), and
    # water streaks run down from every sill and eave (a noise stretched ten to one in height), in the wall's own colour
    for key in ('stucco', 'pale', 'stone'):
        nt = M[key].node_tree; b = nt.nodes['Principled BSDF']; c = tuple(b.inputs['Base Color'].default_value)
        tc = nt.nodes.new('ShaderNodeTexCoord'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(tc.outputs['Object'], sep.inputs[0])
        foot = nt.nodes.new('ShaderNodeMapRange'); foot.inputs['From Min'].default_value = 0.45; foot.inputs['From Max'].default_value = 0.0
        nt.links.new(sep.outputs['Z'], foot.inputs['Value'])
        nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 6.0; nz.inputs['Detail'].default_value = 4.0; nt.links.new(tc.outputs['Object'], nz.inputs['Vector'])
        fm = nt.nodes.new('ShaderNodeMath'); fm.operation = 'MULTIPLY'; fm.use_clamp = True; nt.links.new(foot.outputs['Result'], fm.inputs[0])
        f2 = nt.nodes.new('ShaderNodeMapRange'); f2.inputs['From Min'].default_value = 0.35; f2.inputs['From Max'].default_value = 0.6; nt.links.new(nz.outputs['Fac'], f2.inputs['Value'])
        nt.links.new(f2.outputs['Result'], fm.inputs[1])
        mp = nt.nodes.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (14.0, 14.0, 1.4); nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
        st = nt.nodes.new('ShaderNodeTexNoise'); st.inputs['Scale'].default_value = 1.0; st.inputs['Detail'].default_value = 3.0; nt.links.new(mp.outputs['Vector'], st.inputs['Vector'])
        sm = nt.nodes.new('ShaderNodeMapRange'); sm.inputs['From Min'].default_value = 0.56; sm.inputs['From Max'].default_value = 0.72; sm.inputs['To Max'].default_value = 0.45
        nt.links.new(st.outputs['Fac'], sm.inputs['Value'])
        tot = nt.nodes.new('ShaderNodeMath'); tot.operation = 'MAXIMUM'; nt.links.new(fm.outputs[0], tot.inputs[0]); nt.links.new(sm.outputs['Result'], tot.inputs[1])
        mx = nt.nodes.new('ShaderNodeMixRGB'); mx.blend_type = 'MIX'; mx.inputs['Color1'].default_value = c
        mx.inputs['Color2'].default_value = (c[0] * 0.48, c[1] * 0.43, c[2] * 0.38, 1)
        nt.links.new(tot.outputs[0], mx.inputs['Fac']); nt.links.new(mx.outputs['Color'], b.inputs['Base Color'])
    M['amber'] = P.mat(bpy, 'bld_amber', 'sodium', 2, glow=2.2)
    M['tv'] = P.mat(bpy, 'bld_tv', 'glass_eye', 2, glow=0.9)
    M['black'] = P.mat(bpy, 'bld_black', 'glass_eye', 0)
    return M


def B(bpy, name, m, x0, x1, y0, y1, z0, z1, bevel=0.0, rot=0.0):
    """a box by its extents in metres (x east, y north, z up)"""
    return P.box(bpy, name, m, (x1 - x0, y1 - y0, z1 - z0), ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), rot=(0, 0, rot), bevel=bevel)


def ridge_roof(bpy, name, x0, x1, y0, y1, h, pitch=18.4, oh=0.5, m=None, gable=None):
    """THE STRAIGHT ROOF: the ridge the length of the building (along x), two slopes at the pitch, the eave oh past the
    walls; the gable triangles in the wall's own material; a ridge cap; tiles in courses (the material's bands)"""
    mm = mats(bpy); m = m or mm['roof']; t = math.tan(math.radians(pitch))
    yc = (y0 + y1) / 2; half = (y1 - y0) / 2; rise = half * t; th = 0.14
    if gable is not None:
        P.prism(bpy, name + '_gable', gable, [(y0, h), (y1, h), (yc, h + rise)], x0, x1)
    for side, ya, yb in (('front', y0 - oh, yc), ('back', y1 + oh, yc)):
        za = h - oh * t; zb = h + rise
        prof = [(ya, za), (yb, zb), (yb, zb + th), (ya, za + th)]
        if side == 'back': prof = prof[::-1]
        P.prism(bpy, name + '_' + side, m, prof, x0 - oh, x1 + oh)
    P.prism(bpy, name + '_cap', mm['trim'], [(yc - 0.16, h + rise + 0.06), (yc + 0.16, h + rise + 0.06), (yc, h + rise + 0.26)], x0 - oh, x1 + oh)
    for x in (x0 - oh, x1 + oh):                                    # the fascia boards across each gable end's eave
        pass
    return h + rise + 0.26


def flat_roof(bpy, name, x0, x1, y0, y1, h, parapet=0.5, m=None):
    mm = mats(bpy)
    B(bpy, name + '_deck', m or mm['flat'], x0, x1, y0, y1, h - 0.1, h + 0.02)
    for (a, b, c, d) in ((x0, x1, y0, y0 + 0.25), (x0, x1, y1 - 0.25, y1), (x0, x0 + 0.25, y0, y1), (x1 - 0.25, x1, y0, y1)):
        B(bpy, name + '_parapet', mm['stucco'] if m is None else m, a, b, c, d, h - 0.1, h + parapet, bevel=0.03)
    B(bpy, name + '_coping', mm['trim'], x0 - 0.05, x1 + 0.05, y0 - 0.05, y0 + 0.2, h + parapet, h + parapet + 0.08)
    return h + parapet


def opening(bpy, name, kind, x, w, z0, z1, y, mod=None, rnd=None):
    """a hole in the front wall (at y, facing -Y): a dark inset with its frame; mod is the one wrong thing or the wear:
    boarded, barred, nailed, open, lit, tv, broken, shutter"""
    mm = mats(bpy); f = 0.08; d = 0.06
    inner = {'window': mm['glass'], 'door': mm['wood'], 'steel': mm['steel'], 'garage': mm['pale'], 'rollup': mm['steel'],
             'glassdoor': mm['glass'], 'arched': mm['glass'], 'dock': mm['steel']}[kind]
    if mod == 'lit': inner = mm['amber']
    if mod == 'tv': inner = mm['tv']
    if mod in ('open', 'black', 'gap'): inner = mm['black']
    x0, x1 = x - w / 2, x + w / 2
    B(bpy, name, inner, x0, x1, y - 0.02, y + d, z0, z1)
    if kind == 'arched':
        P.cyl(bpy, name + '_arch', inner, w / 2, 0.08, (x, y + 0.01, z1), rot=(math.pi / 2, 0, 0), verts=16)
        P.cyl(bpy, name + '_archf', mm['trim'], w / 2 + f, 0.06, (x, y - 0.0, z1), rot=(math.pi / 2, 0, 0), verts=16)
    for (a, b, c, e) in ((x0 - f, x0, z0, z1), (x1, x1 + f, z0, z1), (x0 - f, x1 + f, z1, z1 + f)) + (((x0 - f, x1 + f, z0 - f, z0),) if kind in ('window', 'arched') else ()):
        B(bpy, name + '_frame', mm['trim'], a, b, y - 0.07, y + 0.02, c, e, bevel=0.01)
    if kind in ('window', 'arched') and mod not in ('boarded', 'shutter', 'lit', 'tv', 'gap'):
        B(bpy, name + '_mull', mm['trim'], x - 0.025, x + 0.025, y - 0.04, y, z0, z1)
    if kind == 'garage' or kind == 'rollup' or kind == 'dock':
        for i in range(1, int((z1 - z0) / 0.32)):
            B(bpy, name + '_rib', mm['trim'], x0, x1, y - 0.04, y, z0 + i * 0.32 - 0.02, z0 + i * 0.32 + 0.02)
    if kind == 'door':
        B(bpy, name + '_knob', mm['dark'], x1 - 0.18, x1 - 0.1, y - 0.07, y, z0 + 0.95, z0 + 1.03)
    if mod == 'boarded':
        n = max(2, int((z1 - z0) / 0.35))
        for i in range(n):
            zz = z0 + (i + 0.5) * (z1 - z0) / n
            B(bpy, name + '_board', mm['ply'], x0 - 0.1, x1 + 0.1, y - 0.11, y - 0.07, zz - 0.13, zz + 0.13, rot=0.0)
        P.box(bpy, name + '_brace', mm['ply'], (math.hypot(w, z1 - z0) * 0.9, 0.03, 0.2), (x, y - 0.13, (z0 + z1) / 2), rot=(0, math.atan2(z1 - z0, w), 0))
    if mod == 'nailed':
        for zz, a in ((z0 + (z1 - z0) * 0.35, 0.18), (z0 + (z1 - z0) * 0.7, -0.14)):
            P.box(bpy, name + '_plank', mm['ply'], (w * 1.15, 0.04, 0.22), (x, y - 0.12, zz), rot=(0, a, 0))
    if mod == 'barred':
        k = max(3, int(w / 0.13))
        for i in range(k + 1):
            P.rod(bpy, name + '_bar', mm['dark'], (x0 + i * w / k, y - 0.09, z0), (x0 + i * w / k, y - 0.09, z1), 0.012, verts=6)
    if mod == 'shutter':
        for i in range(int((z1 - z0) / 0.12)):
            B(bpy, name + '_slat', mm['steel'], x0, x1, y - 0.06, y - 0.02, z0 + i * 0.12, z0 + i * 0.12 + 0.09)
    if mod == 'broken':
        P.prism(bpy, name + '_shard', mm['glass'], [(y - 0.03, z0), (y - 0.03, z0 + (z1 - z0) * 0.45), (y - 0.03, z0 + 0.05)], x0, x0 + w * 0.5)
        B(bpy, name + '_hole', mm['black'], x0 + w * 0.2, x1, y - 0.035, y - 0.025, z0 + (z1 - z0) * 0.3, z1)


def chimney(bpy, name, x, y, z, h=1.3):
    mm = mats(bpy)
    B(bpy, name, mm['stone'], x - 0.35, x + 0.35, y - 0.3, y + 0.3, z - 0.6, z + h, bevel=0.03)
    B(bpy, name + '_cap', mm['trim'], x - 0.42, x + 0.42, y - 0.37, y + 0.37, z + h, z + h + 0.1)
    B(bpy, name + '_flue', mm['black'], x - 0.15, x + 0.15, y - 0.12, y + 0.12, z + h + 0.1, z + h + 0.13)


def chainlink(bpy, name, x0, x1, y, h=1.2, sign=None):
    """a chain-link run on posts: the fabric as a thin see-through grid of wires (the props modeller's fence, smaller)"""
    mm = mats(bpy); n = max(2, int((x1 - x0) / 2.4) + 1)
    for i in range(n):
        x = x0 + (x1 - x0) * i / (n - 1); P.cyl(bpy, name + '_post', mm['trim'], 0.03, h + 0.05, (x, y, (h + 0.05) / 2), verts=8)
    P.rod(bpy, name + '_rail', mm['trim'], (x0, y, h), (x1, y, h), 0.02, verts=6)
    k = int((x1 - x0) / 0.12)
    for i in range(k):
        xa = x0 + i * (x1 - x0) / k
        P.rod(bpy, name + '_w', mm['trim'], (xa, y, 0.02), (xa + 0.12, y, h), 0.004, verts=4)
        P.rod(bpy, name + '_w', mm['trim'], (xa + 0.12, y, 0.02), (xa, y, h), 0.004, verts=4)
    if sign:
        B(bpy, name + '_sign', mm['pale'], sign - 0.55, sign + 0.55, y - 0.04, y - 0.02, h * 0.45, h * 0.45 + 0.7)
        B(bpy, name + '_signred', mm['red'], sign - 0.48, sign + 0.48, y - 0.05, y - 0.04, h * 0.45 + 0.42, h * 0.45 + 0.6)


def cooler(bpy, name, x, y, z):
    mm = mats(bpy)
    B(bpy, name, mm['steel'], x - 0.55, x + 0.55, y - 0.5, y + 0.5, z, z + 0.85, bevel=0.04)
    for i in range(4): B(bpy, name + '_louvre', mm['trim'], x - 0.45, x + 0.45, y - 0.53, y - 0.5, z + 0.15 + i * 0.16, z + 0.22 + i * 0.16)


def posts(bpy, name, xs, y, h, r=0.09, m=None):
    mm = mats(bpy)
    for x in xs: B(bpy, name, m or mm['wood'], x - r, x + r, y - r, y + r, 0, h, bevel=0.02)


# ---- the five ranches (COOK FOUR's straight-roof family) -------------------------------------------------------------
def ranch_body(bpy, n, x0, x1, d=8.0, h=2.7, wins=(), door=None, roof_m=None):
    mm = mats(bpy)
    B(bpy, n + '_walls', mm['stucco'], x0, x1, -d / 2, d / 2, 0, h, bevel=0.04)
    B(bpy, n + '_footing', mm['stone'], x0 - 0.04, x1 + 0.04, -d / 2 - 0.04, d / 2 + 0.04, 0, 0.22)
    top = ridge_roof(bpy, n + '_roof', x0, x1, -d / 2, d / 2, h, m=roof_m, gable=mm['stucco'])
    for i, (x, w, mod) in enumerate(wins): opening(bpy, '%s_win%d' % (n, i), 'window', x, w, 0.95, 2.15, -d / 2, mod)
    if door: opening(bpy, n + '_door', 'door', door[0], 0.95, 0.0, 2.1, -d / 2, door[1])
    return top


def ranch_plain(bpy, mu):
    top = ranch_body(bpy, 'rp', -5, 5, wins=((-3.3, 1.6, None), (-1.2, 1.2, None), (2.9, 1.8, 'boarded')), door=(0.6, None))
    chimney(bpy, 'rp_chim', 3.6, 0.9, 2.7 + 1.0)
    chainlink(bpy, 'rp_fence', -6.2, 6.2, -7.5, 1.2, sign=-2.0)


def ranch_garage(bpy, mu):
    mm = mats(bpy)
    ranch_body(bpy, 'rg', -6.0, 5.5, wins=((-4.2, 1.6, None), (-1.9, 1.6, None), (3.6, 1.2, None)), door=(1.1, None))
    B(bpy, 'rg_garage', mm['stucco'], 5.5, 11.5, -4.0, 3.0, 0, 2.6, bevel=0.04)
    ridge_roof(bpy, 'rg_groof', 5.5, 11.5, -4.0, 3.0, 2.6, pitch=16, oh=0.4, m=mm['flat'], gable=mm['stucco'])
    opening(bpy, 'rg_gdoor', 'garage', 8.5, 4.9, 0.0, 2.15, -4.0, 'nailed')
    chimney(bpy, 'rg_chim', -3.5, 1.0, 3.7)
    B(bpy, 'rg_drive', mm['stone'], 6.0, 11.0, -9.0, -4.0, 0, 0.04)


def ranch_carport(bpy, mu):
    mm = mats(bpy)
    ranch_body(bpy, 'rc', -4.75, 4.75, wins=((-2.9, 1.6, 'boarded'), (2.6, 1.8, None)), door=(-0.3, None))
    flat_roof(bpy, 'rc_port', 4.75, 8.35, -4.6, 3.4, 2.5, parapet=0.12, m=mm['flat'])
    posts(bpy, 'rc_post', (8.1,), -4.3, 2.4); posts(bpy, 'rc_post', (8.1,), 3.1, 2.4)
    chimney(bpy, 'rc_chim', -3.0, 1.2, 3.7)
    B(bpy, 'rc_slab', mm['stone'], 4.75, 8.35, -9.0, 3.4, 0, 0.04)
    B(bpy, 'rc_oil', mm['dark'], 5.6, 7.2, -2.4, 0.4, 0.04, 0.045)               # the oil where a car stood


def ranch_wing(bpy, mu):
    mm = mats(bpy)
    ranch_body(bpy, 'rw', -4.5, 4.5, wins=((-2.6, 1.6, None), (1.4, 1.2, None)), door=(-0.6, None))
    B(bpy, 'rw_wing', mm['stucco'], 4.5, 9.0, -7.0, 1.0, 0, 2.5, bevel=0.04)
    ridge_roof(bpy, 'rw_wroof', 4.5, 9.0, -7.0, 1.0, 2.5, pitch=18.4, oh=0.4, gable=mm['stucco'])
    opening(bpy, 'rw_wwin', 'window', 6.75, 1.8, 0.9, 2.0, -7.0)
    chimney(bpy, 'rw_chim', -2.5, 1.0, 3.7)


def ranch_porch(bpy, mu):
    mm = mats(bpy)
    ranch_body(bpy, 'ro', -5.5, 5.5, wins=((-3.8, 1.6, None), (3.6, 1.6, 'boarded')), door=(0.4, 'nailed'))
    flat_roof(bpy, 'ro_porch', -2.1, 2.9, -6.3, -4.0, 2.45, parapet=0.1, m=mm['flat'])
    posts(bpy, 'ro_post', (-1.9, 0.4, 2.7), -6.1, 2.4)
    B(bpy, 'ro_deck', mm['wood'], -2.1, 2.9, -6.3, -4.0, 0, 0.18)
    chimney(bpy, 'ro_chim', -3.4, 1.0, 3.7)


# ---- the Strip and the town (COOK FOUR's buildings) ------------------------------------------------------------------
def casino(bpy, mu):
    mm = mats(bpy); d = 18.0; h = 4.5
    B(bpy, 'cs_hall', mm['stucco'], -13, 13, -d / 2, d / 2, 0, h, bevel=0.05)
    B(bpy, 'cs_band', mm['steel'], -13.02, 13.02, -d / 2 - 0.02, d / 2 + 0.02, h - 1.1, h - 0.2)
    top = ridge_roof(bpy, 'cs_roof', -13, 13, -d / 2, d / 2, h, pitch=10, oh=0.6, gable=mm['stucco'])
    flat_roof(bpy, 'cs_marq', -4.3, 4.3, -d / 2 - 2.4, -d / 2, 3.6 + 0.35, parapet=0.55, m=mm['steel'])
    for i in range(6):
        x = -3.4 + i * 1.36; mod = 'open' if i in (2, 3) else None
        opening(bpy, 'cs_door%d' % i, 'glassdoor', x, 1.1, 0.0, 2.3, -d / 2, mod)
    for x in (-10.5, 10.5): opening(bpy, 'cs_exit', 'steel', x, 1.0, 0.0, 2.1, -d / 2)
    for i, x in enumerate((-8.0, -6.3, 7.0)): B(bpy, 'cs_cond%d' % i, mm['steel'], x - 0.75, x + 0.75, -d / 2 - 1.2, -d / 2 - 0.1, 0, 1.1, bevel=0.04)
    # the blank sign 6 x 3 m on 0.5 m legs, its top 4 m over the ridge
    B(bpy, 'cs_sign', mm['pale'], -3, 3, -0.15, 0.15, top + 1.0, top + 4.0, bevel=0.04)
    B(bpy, 'cs_signframe', mm['steel'], -3.1, 3.1, -0.2, 0.2, top + 0.92, top + 1.0)
    for x in (-2.2, 2.2): B(bpy, 'cs_leg', mm['steel'], x - 0.12, x + 0.12, -0.12, 0.12, top - 1.6, top + 1.0)


def tower_casino(bpy, mu):
    mm = mats(bpy); d = 14.0; w = 15.0
    B(bpy, 'tc_ground', mm['stucco'], -w, w, -d / 2, d / 2, 0, 5.0, bevel=0.05)
    B(bpy, 'tc_tower', mm['stone'], -w + 0.6, w - 0.6, -d / 2 + 0.6, d / 2 - 0.6, 5.0, 29.0, bevel=0.05)
    B(bpy, 'tc_core', mm['stucco'], -3.0, 3.0, -d / 2 - 0.0, d / 2, 5.0, 29.6, bevel=0.04)
    top = ridge_roof(bpy, 'tc_roof', -w + 0.6, w - 0.6, -d / 2 + 0.6, d / 2 - 0.6, 29.0, pitch=12, oh=0.5, gable=mm['stone'])
    flat_roof(bpy, 'tc_marq', -6, 6, -d / 2 - 2.4, -d / 2, 3.95, parapet=0.5, m=mm['steel'])
    for i in range(6): opening(bpy, 'tc_door%d' % i, 'glassdoor', -4.0 + i * 1.6, 1.2, 0.0, 2.5, -d / 2)
    import random; rnd = random.Random(1019)
    xs = [x for x in [-13.2 + i * 1.75 for i in range(16)] if abs(x) > 3.6]
    broken = set(rnd.sample(range(len(xs) * 6), 5))
    for fl in range(8):
        z0 = 5.0 + fl * 3.0 + 0.8
        for j, x in enumerate(xs):
            mod = 'shutter' if fl == 7 else ('boarded' if fl in (5, 6) else ('broken' if fl * len(xs) + j in broken else None))
            opening(bpy, 'tc_w%d_%d' % (fl, j), 'window', x, 1.2, z0, z0 + 1.7, -d / 2 + 0.6, mod)
        B(bpy, 'tc_sill%d' % fl, mm['trim'], -w + 0.6, w - 0.6, -d / 2 + 0.5, -d / 2 + 0.62, 5.0 + fl * 3.0, 5.0 + fl * 3.0 + 0.12)
    B(bpy, 'tc_sign', mm['pale'], -5, 5, -0.15, 0.15, top + 1.0, top + 3.4, bevel=0.04)
    for x in (-3.5, 3.5): B(bpy, 'tc_leg', mm['steel'], x - 0.14, x + 0.14, -0.14, 0.14, top - 2.0, top + 1.0)


def church(bpy, mu):
    mm = mats(bpy); d = 9.0
    B(bpy, 'ch_nave', mm['stucco'], -9, 9, -d / 2, d / 2, 0, 5.0, bevel=0.05)
    ridge_roof(bpy, 'ch_roof', -9, 9, -d / 2, d / 2, 5.0, pitch=30, oh=0.5, gable=mm['stucco'])
    B(bpy, 'ch_tower', mm['stone'], 9, 13.2, -d / 2 - 1.0, -d / 2 + 3.2, 0, 12.0, bevel=0.05)
    ridge_roof(bpy, 'ch_tcap', 9, 13.2, -d / 2 - 1.0, -d / 2 + 3.2, 12.0, pitch=40, oh=0.6, gable=mm['stone'])
    for z in (9.4,): opening(bpy, 'ch_louvre', 'arched', 11.1, 1.2, z, z + 1.4, -d / 2 - 1.0, 'shutter')
    B(bpy, 'ch_niche', mm['black'], 10.85, 11.35, -d / 2 - 1.06, -d / 2 - 0.98, 7.0, 7.7)
    B(bpy, 'ch_cross', mm['pale'], 11.05, 11.15, -d / 2 - 1.1, -d / 2 - 1.04, 7.05, 7.65); B(bpy, 'ch_crossbar', mm['pale'], 10.92, 11.28, -d / 2 - 1.1, -d / 2 - 1.04, 7.42, 7.5)
    B(bpy, 'ch_hall', mm['pale'], -16, -9, -d / 2 + 0.5, d / 2 - 0.5, 0, 3.0, bevel=0.04)
    ridge_roof(bpy, 'ch_hroof', -16, -9, -d / 2 + 0.5, d / 2 - 0.5, 3.0, pitch=18.4, oh=0.4, gable=mm['pale'])
    for i, x in enumerate((-7, -3.5, 0, 3.5, 7)): opening(bpy, 'ch_win%d' % i, 'arched', x, 0.9, 1.4, 3.1, -d / 2, 'boarded' if i == 2 else None)
    for i, x in enumerate((10.2, 12.0)): opening(bpy, 'ch_door%d' % i, 'door', x, 1.1, 0, 2.5, -d / 2 - 1.0)
    cooler(bpy, 'ch_cool', -13.5, 0.5, 3.0 + 1.2)
    # the pews out on the forecourt, facing the road (six benches, 1.7 m)
    for r in range(3):
        for c in range(2):
            x = -4.0 + c * 3.2; y = -d / 2 - 3.2 - r * 1.3
            B(bpy, 'ch_pew_seat', mm['wood'], x - 0.85, x + 0.85, y - 0.2, y + 0.2, 0.42, 0.48)
            B(bpy, 'ch_pew_back', mm['wood'], x - 0.85, x + 0.85, y + 0.17, y + 0.23, 0.48, 0.95)
            for xx in (x - 0.78, x + 0.78): B(bpy, 'ch_pew_end', mm['wood'], xx - 0.04, xx + 0.04, y - 0.22, y + 0.24, 0, 0.9)


def motel(bpy, mu):
    mm = mats(bpy); d = 8.0; h = 2.8
    B(bpy, 'mo_office', mm['pale'], -13.3, -8.3, -d / 2, d / 2, 0, h + 0.4, bevel=0.04)
    ridge_roof(bpy, 'mo_oroof', -13.3, -8.3, -d / 2, d / 2, h + 0.4, oh=0.45, gable=mm['pale'])
    opening(bpy, 'mo_odoor', 'glassdoor', -11.9, 1.0, 0, 2.2, -d / 2); opening(bpy, 'mo_owin', 'window', -9.6, 1.5, 0.9, 2.1, -d / 2, 'barred')
    B(bpy, 'mo_rooms', mm['stucco'], -8.3, 13.3, -d / 2, d / 2, 0, h, bevel=0.04)
    top = ridge_roof(bpy, 'mo_roof', -8.3, 13.3, -d / 2, d / 2, h, oh=0.45, gable=mm['stucco'])
    flat_roof(bpy, 'mo_walk', -8.3, 13.3, -d / 2 - 2.0, -d / 2, 2.45, parapet=0.1, m=mm['flat'])
    posts(bpy, 'mo_post', [-8.1 + i * 3.55 for i in range(7)], -d / 2 - 1.8, 2.4, r=0.08, m=mm['trim'])
    for i in range(6):
        x = -6.5 + i * 3.6; mark = i == 3
        opening(bpy, 'mo_door%d' % i, 'door', x - 0.7, 0.9, 0, 2.1, -d / 2)
        opening(bpy, 'mo_win%d' % i, 'window', x + 0.8, 1.3, 1.0, 2.0, -d / 2, 'boarded' if mark else None)
        B(bpy, 'mo_num%d' % i, mm['pale'], x - 0.8, x - 0.6, -d / 2 - 0.1, -d / 2 - 0.08, 2.15, 2.35)
        if mark:                                                     # room 4's door marked: a cross sprayed on it
            for a in (0.75, -0.75): P.box(bpy, 'mo_mark', mm['red'], (1.0, 0.012, 0.09), (x - 0.7, -d / 2 - 0.1, 1.1), rot=(0, a, 0))
    for x in (-2.0, 7.0): cooler(bpy, 'mo_cool', x, 1.2, top - 0.9)
    B(bpy, 'mo_bin', mm['teal'], 11.8, 13.0, -d / 2 - 1.6, -d / 2 - 0.6, 0, 1.2, bevel=0.04)


def motel_sign(bpy, mu):
    mm = mats(bpy)
    for x in (-1.1, 1.1): B(bpy, 'ms_leg', mm['steel'], x - 0.17, x + 0.17, -0.17, 0.17, 0, 9.0, bevel=0.03)
    B(bpy, 'ms_blade', mm['teal'], -1.0, 1.0, -0.2, 0.2, 4.0, 9.0, bevel=0.05)
    B(bpy, 'ms_bladeface', mm['pale'], -0.85, 0.85, -0.23, -0.2, 4.3, 8.7)
    for i in range(6): B(bpy, 'ms_letter%d' % i, mm['red'], -0.35, 0.35, -0.25, -0.23, 4.6 + i * 0.7, 5.1 + i * 0.7)
    for i in range(12): P.cyl(bpy, 'ms_bulb', mm['trim'], 0.06, 0.06, (-0.9 + (i % 2) * 1.8, -0.25, 4.3 + (i // 2) * 0.8), rot=(math.pi / 2, 0, 0), verts=8)
    # the arrow on top points AWAY from the motel (the motel is to the east on every lot), out at the desert: west
    P.prism(bpy, 'ms_arrow', mm['red'], [(-0.15, 9.2), (0.15, 9.2), (0.15, 10.1), (-0.15, 10.1)], -2.2, 2.4)
    P.prism(bpy, 'ms_arrowhead', mm['red'], [(-0.15, 8.9), (0.15, 8.9), (0.15, 10.4), (-0.15, 10.4)], -3.1, -2.2)
    B(bpy, 'ms_vac', mm['pale'], -1.2, 1.2, -0.3, -0.1, 3.0, 3.8, bevel=0.03)
    B(bpy, 'ms_vactext', mm['dark'], -1.0, 1.0, -0.32, -0.3, 3.25, 3.55)


def pawn_shop(bpy, mu):
    mm = mats(bpy); d = 10.0; h = 3.8
    B(bpy, 'pw_body', mm['stucco'], -7, 7, -d / 2, d / 2, 0, h, bevel=0.05)
    top = ridge_roof(bpy, 'pw_roof', -7, 7, -d / 2, d / 2, h, pitch=14, oh=0.5, gable=mm['stucco'])
    for i, x in enumerate((-5.2, -3.0, 3.0, 5.2)): opening(bpy, 'pw_win%d' % i, 'window', x, 1.6, 0.6, 2.4, -d / 2, 'barred')
    opening(bpy, 'pw_door', 'steel', 0, 1.1, 0, 2.1, -d / 2)
    B(bpy, 'pw_fascia', mm['gold'], -3.5, 3.5, -d / 2 - 0.12, -d / 2 - 0.02, 2.65, 3.55, bevel=0.03)
    B(bpy, 'pw_fasciatext', mm['dark'], -3.0, 3.0, -d / 2 - 0.14, -d / 2 - 0.12, 2.9, 3.3)
    B(bpy, 'pw_unit', mm['steel'], 2.0, 3.6, -0.6, 0.8, top - 1.1, top - 0.1, bevel=0.04)
    for r in range(3):                                          # the queue rails, empty
        y = -d / 2 - 1.6 - r * 2.2
        for x in (-4.5, -1.5, 1.5, 4.5): P.cyl(bpy, 'pw_stanchion', mm['trim'], 0.04, 1.0, (x, y, 0.5), verts=8)
        P.rod(bpy, 'pw_rail', mm['trim'], (-4.5, y, 0.95), (4.5, y, 0.95), 0.025, verts=8)


def chapel(bpy, mu):
    mm = mats(bpy); d = 8.0; h = 3.6
    B(bpy, 'cp_body', mm['pale'], -4.5, 4.5, -d / 2, d / 2, 0, h, bevel=0.05)
    top = ridge_roof(bpy, 'cp_roof', -4.5, 4.5, -d / 2, d / 2, h, pitch=30, oh=0.45, gable=mm['pale'])
    B(bpy, 'cp_cote', mm['stone'], -0.6, 0.6, -d / 2 + 0.2, -d / 2 + 1.2, top - 1.0, top + 1.6, bevel=0.03)
    ridge_roof(bpy, 'cp_cotecap', -0.6, 0.6, -d / 2 + 0.2, -d / 2 + 1.2, top + 1.6, pitch=40, oh=0.15, gable=mm['stone'])
    B(bpy, 'cp_bell', mm['gold'], -0.25, 0.25, -d / 2 + 0.45, -d / 2 + 0.95, top + 0.6, top + 1.2, bevel=0.08)
    for i, x in enumerate((-2.7, 2.7)): opening(bpy, 'cp_win%d' % i, 'arched', x, 0.9, 1.1, 2.6, -d / 2)
    opening(bpy, 'cp_door', 'door', 0, 1.5, 0, 2.3, -d / 2)
    flat_roof(bpy, 'cp_canopy', -1.6, 1.6, -d / 2 - 1.6, -d / 2, 2.55, parapet=0.12, m=mm['pale'])
    posts(bpy, 'cp_post', (-1.45, 1.45), -d / 2 - 1.45, 2.5, r=0.07, m=mm['pale'])
    B(bpy, 'cp_cross', mm['gold'], -0.06, 0.06, -d / 2 - 1.62, -d / 2 - 1.55, 2.75, 3.55); B(bpy, 'cp_crossbar', mm['gold'], -0.28, 0.28, -d / 2 - 1.62, -d / 2 - 1.55, 3.2, 3.3)
    P.cyl(bpy, 'cp_pole', mm['steel'], 0.1, 6.2, (6.2, -d / 2 - 1.0, 3.1), verts=10)
    B(bpy, 'cp_sign', mm['pale'], 4.5, 7.9, -d / 2 - 1.15, -d / 2 - 0.85, 4.6, 6.2, bevel=0.04)
    B(bpy, 'cp_heart', mm['red'], 5.6, 6.8, -d / 2 - 1.17, -d / 2 - 1.15, 5.1, 5.8)
    for x in (-2.7, 2.7):                                         # the flower boxes, the flowers alive: red and gold
        B(bpy, 'cp_box', mm['wood'], x - 0.85, x + 0.85, -d / 2 - 0.45, -d / 2 - 0.05, 0, 0.45)
        for k in range(9):
            fx = x - 0.7 + k * 0.175; m = mm['red'] if k % 2 else mm['gold']
            P.cyl(bpy, 'cp_stem', mm['teal'], 0.012, 0.3, (fx, -d / 2 - 0.25, 0.6), verts=5)
            P.cyl(bpy, 'cp_flower', m, 0.07, 0.06, (fx, -d / 2 - 0.25, 0.78), verts=8)


def gas_station(bpy, mu):
    mm = mats(bpy); d = 7.0
    B(bpy, 'gs_office', mm['pale'], 2.0, 8.0, -d / 2, d / 2, 0, 3.2, bevel=0.04)
    ridge_roof(bpy, 'gs_oroof', 2.0, 8.0, -d / 2, d / 2, 3.2, oh=0.4, gable=mm['pale'])
    opening(bpy, 'gs_odoor', 'glassdoor', 3.5, 1.0, 0, 2.2, -d / 2); opening(bpy, 'gs_till', 'window', 6.2, 1.8, 0.9, 2.2, -d / 2, 'barred')
    B(bpy, 'gs_bays', mm['stucco'], 8.0, 16.0, -d / 2, d / 2, 0, 4.0, bevel=0.04)
    ridge_roof(bpy, 'gs_broof', 8.0, 16.0, -d / 2, d / 2, 4.0, oh=0.4, gable=mm['stucco'])
    opening(bpy, 'gs_bay1', 'rollup', 10.0, 3.0, 0, 3.2, -d / 2)
    opening(bpy, 'gs_bay2', 'rollup', 14.0, 3.0, 0.7, 3.2, -d / 2)
    B(bpy, 'gs_bay2dark', mm['black'], 12.5, 15.5, -d / 2 - 0.0, -d / 2 + 0.06, 0, 0.7)      # dark under the stopped door
    # the canopy 8 x 6 m at 4.3 m clear over the island, west of the office
    flat_roof(bpy, 'gs_canopy', -9.0, -1.0, -d / 2 - 3.5, -d / 2 + 2.5, 4.3 + 0.7, parapet=0.05, m=mm['pale'])
    B(bpy, 'gs_fascia', mm['teal'], -9.05, -0.95, -d / 2 - 3.55, -d / 2 + 2.55, 4.3, 5.0)
    for x, y in ((-8.6, -d / 2 - 3.1), (-1.4, -d / 2 - 3.1), (-8.6, -d / 2 + 2.1), (-1.4, -d / 2 + 2.1), (-5.0, -d / 2 - 0.5)):
        B(bpy, 'gs_post', mm['trim'], x - 0.15, x + 0.15, y - 0.15, y + 0.15, 0, 4.3)
    B(bpy, 'gs_island', mm['stone'], -7.5, -2.5, -d / 2 - 1.0, -d / 2, 0, 0.18, bevel=0.03)
    for x in (-6.3, -3.7):
        B(bpy, 'gs_pump', mm['teal'], x - 0.35, x + 0.35, -d / 2 - 0.8, -d / 2 - 0.2, 0.18, 1.7, bevel=0.05)
        B(bpy, 'gs_pumpface', mm['pale'], x - 0.25, x + 0.25, -d / 2 - 0.83, -d / 2 - 0.8, 1.0, 1.5)
        P.rod(bpy, 'gs_hose', mm['dark'], (x + 0.3, -d / 2 - 0.82, 1.2), (x + 0.45, -d / 2 - 0.9, 0.3), 0.025, verts=6)
    chainlink(bpy, 'gs_fence', 16.5, 19.0, 0.0, 1.8, sign=17.7)
    B(bpy, 'gs_bin', mm['teal'], 8.6, 9.6, -d / 2 - 0.9, -d / 2 - 0.1, 0, 1.0, bevel=0.03)


def warehouse(bpy, mu):
    mm = mats(bpy); d = 14.0
    B(bpy, 'wh_dock', mm['stone'], -9, 9, -d / 2 - 2.0, d / 2, 0, 1.2, bevel=0.04)
    B(bpy, 'wh_shed', mm['stone'], -9, 9, -d / 2, d / 2, 1.2, 6.0, bevel=0.05)
    ridge_roof(bpy, 'wh_roof', -9, 9, -d / 2, d / 2, 6.0, pitch=10, oh=0.5, gable=mm['stone'])
    for i, x in enumerate((-5.5, 0.0, 5.5)): opening(bpy, 'wh_dock%d' % i, 'dock', x, 3.0, 1.2, 4.8, -d / 2)
    for i, x in enumerate((-7.2, -2.75, 2.75, 7.2, -4.6, 4.6)[:6]):
        opening(bpy, 'wh_high%d' % i, 'window', [-7.6, -4.6, -1.5, 1.5, 4.6, 7.6][i], 1.3, 5.0, 5.6, -d / 2, 'boarded' if i == 4 else None)
    for x in (-7.7, 7.7): B(bpy, 'wh_bumper', mm['dark'], x - 0.2, x + 0.2, -d / 2 - 2.08, -d / 2 - 2.0, 0.5, 1.0)
    B(bpy, 'wh_office', mm['stucco'], 9, 14, -d / 2 + 1.0, d / 2 - 2.0, 0, 3.2, bevel=0.04)
    ridge_roof(bpy, 'wh_oroof', 9, 14, -d / 2 + 1.0, d / 2 - 2.0, 3.2, oh=0.4, gable=mm['stucco'])
    opening(bpy, 'wh_odoor', 'steel', 10.4, 1.0, 0, 2.1, -d / 2 + 1.0)
    opening(bpy, 'wh_owin', 'window', 12.6, 1.4, 1.0, 2.1, -d / 2 + 1.0, 'lit')
    opening(bpy, 'wh_owinbars', 'window', 12.6, 1.4, 1.0, 2.1, -d / 2 + 0.98, 'barred')
    chainlink(bpy, 'wh_fence', -14.5, -9.5, -d / 2 - 1.0, 2.0, sign=-12.0)
    B(bpy, 'wh_bin', mm['teal'], 14.5, 16.3, -d / 2 + 1.5, -d / 2 + 2.6, 0, 1.3, bevel=0.04)


def school(bpy, mu):
    mm = mats(bpy); d = 8.0
    B(bpy, 'sc_rooms', mm['pale'], -16, 11, -d / 2, d / 2, 0, 3.3, bevel=0.04)
    ridge_roof(bpy, 'sc_roof', -16, 11, -d / 2, d / 2, 3.3, oh=0.45, gable=mm['pale'])
    flat_roof(bpy, 'sc_walk', -16, 11, -d / 2 - 2.4, -d / 2, 2.55, parapet=0.1, m=mm['flat'])
    posts(bpy, 'sc_post', [-15.7 + i * 4.4 for i in range(7)], -d / 2 - 2.2, 2.5, r=0.08, m=mm['trim'])
    for r in range(3):
        x0 = -16 + r * 9
        opening(bpy, 'sc_door%d' % r, 'door', x0 + 1.2, 1.0, 0, 2.1, -d / 2, 'boarded' if r < 2 else None)
        for k in range(4):
            opening(bpy, 'sc_win%d_%d' % (r, k), 'window', x0 + 3.0 + k * 1.5, 1.3, 1.0, 2.3, -d / 2, 'tv' if (r == 2 and k == 1) else None)
    B(bpy, 'sc_hall', mm['stone'], 11, 22, -d / 2 - 0.5, d / 2 + 0.5, 0, 5.2, bevel=0.05)
    ridge_roof(bpy, 'sc_hroof', 11, 22, -d / 2 - 0.5, d / 2 + 0.5, 5.2, pitch=12, oh=0.45, gable=mm['stone'])
    for x in (13.0, 15.0): opening(bpy, 'sc_hdoor', 'steel', x, 1.0, 0, 2.1, -d / 2 - 0.5)
    for k in range(4): opening(bpy, 'sc_hwin%d' % k, 'window', 13.2 + k * 2.2, 1.4, 3.8, 4.7, -d / 2 - 0.5)
    chainlink(bpy, 'sc_fence', -16, -6, -d / 2 - 4.0, 1.8, sign=-11.0)


BUILDERS = {k: v for k, v in dict(ranch_plain=ranch_plain, ranch_garage=ranch_garage, ranch_carport=ranch_carport, ranch_wing=ranch_wing,
            ranch_porch=ranch_porch, casino=casino, tower_casino=tower_casino, church=church, motel=motel, motel_sign=motel_sign,
            pawn_shop=pawn_shop, chapel=chapel, gas_station=gas_station, warehouse=warehouse, school=school).items()}
# COOK FOUR's twin for each (the picture he said YES or 'otw' to)
TWINS = dict(ranch_plain='records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png', ranch_garage='records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png',
             ranch_carport='records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png', ranch_wing='records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png',
             ranch_porch='records/target/COOK4_THE_FAMILY_IN_THE_VALLEY_TANS.png', casino='records/target/COOK4_THE_CASINO.png',
             tower_casino='records/target/COOK4_THE_TOWER_CASINO.webp', church='records/target/COOK4_THE_CHURCH.png',
             motel='records/target/COOK4_THE_MOTEL_STRAIGHT_ROOF.png', motel_sign='records/target/COOK4_THE_MOTEL_SIGN_TOWER.webp',
             pawn_shop='records/target/COOK4_THE_PAWN_SHOP.webp', chapel='records/target/COOK4_THE_WEDDING_CHAPEL.webp',
             gas_station='records/target/COOK4_THE_GAS_STATION.png', warehouse='records/target/COOK4_THE_WAREHOUSE.png', school='records/target/COOK4_THE_SCHOOL.png')


def build(name):
    import bpy, mathutils
    bpy.ops.wm.read_factory_settings(use_empty=True); M.clear()
    BUILDERS[name](bpy, mathutils)
    bpy.context.view_layer.update()
    return [o for o in bpy.context.scene.objects if o.type == 'MESH']


def render(name, samples=None):
    """the rig's pieces on a building: the source pass, the dents, one sun and the fill, the 45 camera at 57 px a metre,
    S, SE and SW; the cast shadow from a catcher as its own layer; the snap toward his settlement family and the ring"""
    import bpy, mathutils
    import numpy as np
    from PIL import Image
    t0 = time.time()
    out = os.path.join(R, 'records/target/master_rig/cook_bld_%s' % name); os.makedirs(out, exist_ok=True)
    calib = RIG.calibrate(dict(ppm=PPM, tilt=float(RIG.G['tilt_deg']), out=out, sun_rot=list(RIG.G['sun_rot_deg'])))   # the rig proves itself first
    facings = FACINGS if name in TURNS else ['S']
    objs = build(name)
    dims = P.dims(bpy)
    glb = os.path.join(R, 'reference/models/bohemia/bld_%s.glb' % name)
    for o in bpy.context.scene.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=glb, export_format='GLB', use_selection=False)
    sc = bpy.context.scene
    src = RIG.source_pass(objs, float(RIG.G['wear']), 1.0, 0)
    dent = RIG.dent_pass(objs, 1.0)
    for m in {s.material for o in objs for s in o.material_slots if s.material}:
        for n in m.node_tree.nodes:
            if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    root = bpy.data.objects.new('turntable', None); sc.collection.objects.link(root)
    dg = bpy.context.evaluated_depsgraph_get(); lo = np.full(3, 1e9); hi = -lo
    for o in objs:                                             # the real vertices' bounds: the turntable turns about the middle
        e = o.evaluated_get(dg); me = e.to_mesh(); co = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', co)
        w = (np.array(e.matrix_world) @ np.c_[co.reshape(-1, 3), np.ones(len(me.vertices))].T).T[:, :3]
        lo = np.minimum(lo, w.min(0)); hi = np.maximum(hi, w.max(0)); e.to_mesh_clear()
    centre = mathutils.Vector(((lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, 0))
    for o in list(sc.objects):
        if o.parent is None and o is not root and o.type in ('MESH', 'EMPTY'): o.parent = root; o.location -= centre
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg']))); root.scale = (1, 1, zs)
    bpy.ops.mesh.primitive_plane_add(size=400, location=(0, 0, 0)); catcher = bpy.context.active_object; catcher.is_shadow_catcher = True
    L, D, Hh = dims
    # THE CANVAS: the union of the three facings' own screen boxes (the rig's square span would give the tower casino a
    # 4,860 px square of empty sky a facing); every facing on the same canvas, so the rig's one crop box holds
    t = math.radians(float(RIG.G['tilt_deg']))
    pts = np.c_[lo[0] - centre.x, lo[1] - centre.y, lo[2]], np.c_[hi[0] - centre.x, hi[1] - centre.y, hi[2]]
    corners = np.array([[x, y, z] for x in (pts[0][0, 0], pts[1][0, 0]) for y in (pts[0][0, 1], pts[1][0, 1]) for z in (pts[0][0, 2], pts[1][0, 2])])
    us, vs = [], []
    for f in facings:
        a_ = math.radians(180 - 45 * RIG.FACINGS.index(f)); c_, s_ = math.cos(a_), math.sin(a_)
        x = corners[:, 0] * c_ - corners[:, 1] * s_; y = corners[:, 0] * s_ + corners[:, 1] * c_; z = corners[:, 2] * zs
        us += list(x); vs += list(y * math.cos(t) + z * math.sin(t))
    m_ = 1.2
    u0, u1, v0, v1 = min(us) - m_, max(us) + m_ + 0.5 * Hh, min(vs) - m_, max(vs) + m_   # the sun is south-west and 40 deg off the top: the cast shadow runs out 0.48 H to the right
    rx, ry = int(math.ceil((u1 - u0) * PPM / 2)) * 2, int(math.ceil((v1 - v0) * PPM / 2)) * 2
    res = [rx, ry]
    cd = bpy.data.cameras.new('cam'); cd.type = 'ORTHO'; cd.sensor_fit = 'AUTO'; cd.ortho_scale = max(rx, ry) / PPM
    cam = bpy.data.objects.new('cam', cd); sc.collection.objects.link(cam); sc.camera = cam
    cam.rotation_euler = (t, 0, 0)
    up = mathutils.Vector((0, math.cos(t), math.sin(t))); dvec = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    look = mathutils.Vector(((u0 + u1) / 2, 0, 0)) + up * ((v0 + v1) / 2)
    cam.location = look - dvec * 150; cd.clip_end = 700
    sc.render.resolution_x, sc.render.resolution_y = rx, ry
    A = dict(sun_rot=list(RIG.G['sun_rot_deg']), snap=0.6, ring=float(RIG.G['ring']))
    RIG.light_and_film(sc, A)
    if samples: sc.cycles.samples = samples
    sc.cycles.use_adaptive_sampling = True
    raws, shads = [], []
    for f in facings:
        root.rotation_euler = (0, 0, math.radians(180 - 45 * RIG.FACINGS.index(f)))
        fn = os.path.join(out, 'full_%s.png' % f); sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
        a = np.asarray(Image.open(fn).convert('RGBA')).copy()
        body = a[..., 3] >= 250
        sh = np.zeros_like(a); sh[..., 3] = np.where(body, 0, np.clip(a[..., 3].astype(int), 0, 255)).astype(np.uint8)
        b = a.copy(); b[..., 3] = np.where(body, 255, 0)
        rf = os.path.join(out, 'raw_%s.png' % f); Image.fromarray(b).save(rf); raws.append(rf)
        Image.fromarray(sh).save(os.path.join(out, 'castraw_%s.png' % f)); shads.append(os.path.join(out, 'castraw_%s.png' % f))
        print('  facing', f, round(time.time() - t0), 's', flush=True)
    pop, bins, ntiles = RIG.population('settlement')
    outs, box = RIG.post(raws, out, A, pop, shadow=False)
    for f, s in zip(facings, shads):
        Image.open(s).crop(tuple(box)).save(os.path.join(out, 'shadow_%s.png' % f))
    rel = lambda p: os.path.relpath(p, R)
    card = RIG.card(outs[0], 'prop'); gcard = RIG.guide_card(card, outs[0], 'prop')
    used = dict(RIG.G); used.update(samples=int(sc.cycles.samples))
    used = {k: v for k, v in used.items() if not k.startswith('_') and k != 'calibration'}
    meta = dict(model=rel(glb), lane='cook', row='[the buildings through the rig]', made='10/19', real_dims_m=dims, ppm=PPM,
                camera=dict(tilt_deg=float(RIG.G['tilt_deg']), turn_deg=0, ortho=True), z_stretch=round(zs, 4), facings=facings,
                rig_round=RIG.RIG_ROUND, calibration=calib,
                res=res, crop_box_px=box, files=[rel(o) for o in outs], shadow_files=[rel(os.path.join(out, 'shadow_%s.png' % f)) for f in facings],
                shadow='a catcher under the building: its own cast shadow and contact darkness, black at alpha, its own layer',
                snap=dict(family='settlement', pull=0.6, bins=bins, tiles=ntiles), ring=A['ring'], source_pass=src, dents=dent,
                occlusion_rays='one a camera sample (tools/bohemia_cook_rig_one_ray.py)', card=card, card_guide=gcard,
                rig_settings=used, breaks=sorted(k for k in used if k not in RIG.GUIDE['rig'] or not RIG.same(used[k], RIG.GUIDE['rig'][k])),
                guide_class_note='the guide\'s building class says rig:false until DIRECTION rules (115b); rule 121(j), Paolo 10/19, newer, moves it to the rig',
                twin=TWINS[name], seconds=round(time.time() - t0), colours=RIG.colours(outs))
    json.dump(meta, open(os.path.join(out, 'rig.json'), 'w'), indent=1)
    print(name, 'dims', dims, 'res', res, 'box', box, 'card', json.dumps(gcard)[:300], round(time.time() - t0), 's', flush=True)
    return meta


if __name__ == '__main__':
    a = sys.argv[1:]
    smp = int(a[a.index('--samples') + 1]) if '--samples' in a else None
    for n in [x for x in a if x in BUILDERS] or list(BUILDERS):
        if '--build-only' in a:
            import bpy; build(n); print(n, 'DIMS', P.dims(bpy), 'materials', len([m for m in bpy.data.materials if m.users]), 'objects', len(bpy.context.scene.objects), flush=True)
        else: render(n, smp)
    sys.stdout.flush(); os._exit(0)
