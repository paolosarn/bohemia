#!/usr/bin/env python3
"""BOHEMIA -- HOME, THE SIX PIECES THAT STAND ON YOUR LOTS (rules 343, 347, 354, 337; 11/3/26). The models, once, for every camera.

  YOUR KITCHEN   (THE POT's prize)   a cinder-block rocket hearth with HIS pot on its grate, the flue up through a tin lean-to, a prep table,
                                     a woodpile; working: the fire in the mouth, steam off the pot, smoke out of the flue
  YOUR MAIN      (THE TAP's prize)   the curb-stop box over the city main, a riser out of a concrete pad, a gate valve with a red wheel, the
                                     spigot on a post, a wash trough; HIS wrench on the box; working: water running into the trough
  YOUR PURIFIER  (THE FILTER's)      a slow sand filter: the raw drum up on blocks, HIS filter housing as the pre-filter, a timber box of fine
                                     sand over gravel, the outlet low into a clean drum; working: water standing on the sand, the drum filling
  GARDEN BED     (a build, 10/1)     three timber raised beds, bean poles; working: the crop up, a drip line
  WATER TANK     (a build, 10/1)     a corrugated tank on a block stand with a sight tube and a tap, a tin catchment roof and its downpipe;
                                     working: full. STORAGE, not a source (records/BOHEMIA_HOME_YOUR_OWN_SETTLEMENT_11_3_26.md s5.1: Las Vegas
                                     rain gives a shed roof 1.5 L a day); in the data file it is filled by the main or the purifier
  SOLAR PANEL    (a build, 10/1)     three panels on a ground rack at 36 degrees (Las Vegas's latitude), a battery cabinet, a lamp on a pole;
                                     working: wired, the cells charging, the charge light on

Written for the stopped build round (rule 349 held it; kept on branch home-stopped-build-11-3) and brought back after his pick (rule 354):
the bodies are that round's, unchanged but for living in a module. The bosses' own things are the BOSSES lane's models (HAND.build,
tools/bohemia_bosses_what_they_hand_you_11_3_26.py, imported, never edited). Realism first: a kitchen is a fire and a flue, a main is a
pipe, a purifier is a filter bed.

  make(bpy, P, IC, V, K, pl, HAND, rnd, beat) -> {piece: fn(x, y_front, state)}   state in ('built', 'working'); 'bare' is the lot itself
"""
import math


def make(bpy, P, IC, V, K, pl, HAND, rnd, beat=0):
    sc = bpy.context.scene
    Bx = lambda n, m, *a, **k: V.Bx(K, n, m, *a, **k)
    hm = lambda n, rgb, glow=0.0, rough=1.0: V.hexmat(bpy, n, rgb, glow, rough)
    MX = dict(
        block=K.concrete_dk, pad=K.concrete, wet=hm('wet_pad', (88, 84, 78)), steel=K.steel, tin=K.tin, tin_rust=K.tin_rust,
        wood=K.wood, ply=K.ply, dark=K.dark, black=K.black, char=K.char, bone=K.bone, plastic=K.plastic, soil=K.soil,
        leaf=K.leaf, leaf_dead=K.leaf_dead,
        red=P.mat(bpy, 'wheel_red', 'blood', 1), galv=P.mat(bpy, 'galv', 'tape_grey', 3),
        water=hm('still_water', (82, 116, 132), 0.0, 0.25), running=hm('running_water', (178, 200, 206), 0.35, 0.2),
        sand=hm('filter_sand', (182, 164, 128)), gravel=hm('filter_gravel', (118, 112, 102)),
        drum_blue=hm('drum_blue', V.faded('#2f5f9a', 0.42)), panel=hm('pv_cell', (42, 56, 86), 0.0, 0.4),
        alu=hm('pv_frame', (168, 168, 160)), cab=P.mat(bpy, 'cabinet', 'metal_painted', 2),
        led_on=hm('led_on', (96, 208, 116), 4.0), led_off=hm('led_off', (40, 52, 44)),
        cell=hm('cell_case', (52, 50, 48)), cell_lit=hm('cell_charge', (226, 176, 82), 2.6),
        lamp_on=hm('lamp_on', (232, 178, 104), 3.5), lamp_off=hm('lamp_off', (60, 58, 54)),
        flame=P.mat(bpy, 'flame', 'sodium', 3, glow=5.0), ember=hm('ember', (210, 92, 40), 3.0),
        steam=hm('steam', (204, 202, 196)), smoke=hm('smoke', (118, 114, 110)), string=hm('flagging', V.faded('#e0743a', 0.3)),
    )

    def ico(n, m, r, loc, sq=1.0):
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r, location=loc)
        o = bpy.context.active_object; o.scale = (1, 1, sq); P.put(bpy, o, n, m, smooth=False); return o

    def boss_thing(n, loc, scale=1.0, rotz=0.0, roty=0.0):
        """the BOSSES lane's own model of his thing (HAND.build, untouched), seated here; its build may turn every object in the
        scene (the wrench leans itself that way), so everything that stood before is put back exactly"""
        before = list(bpy.context.scene.objects); keep = {o.name: tuple(o.rotation_euler) for o in before}
        HAND.build(n, bpy, P, IC)
        for o in before: o.rotation_euler = keep[o.name]
        new = [o for o in bpy.context.scene.objects if o not in before]
        root = bpy.data.objects.new('boss_' + n, None); sc.collection.objects.link(root)
        for o in new:
            if o.parent is None: o.parent = root
        root.location = loc; root.scale = (scale, scale, scale); root.rotation_euler = (0, roty, rotz)
        return root

    def stakes(x, yf):
        """THE BARE LOT: four stakes and a string round 6 x 5.6 m of turned dirt, a few stones pulled out of it"""
        c = [(x - 3.0, yf), (x + 3.0, yf), (x + 3.0, yf + 5.6), (x - 3.0, yf + 5.6)]
        for k, (a, b) in enumerate(c):
            Bx('stake', MX['wood'], a - 0.05, a + 0.05, b - 0.05, b + 0.05, 0, 0.7)
            Bx('flag', MX['string'], a - 0.06, a + 0.06, b - 0.06, b + 0.06, 0.52, 0.66)
            a2, b2 = c[(k + 1) % 4]
            P.rod(bpy, 'string', MX['string'], (a, b, 0.5), (a2, b2, 0.5), 0.018, 4)
        for _ in range(5):
            P.chunk(bpy, 'stone', MX['gravel'], (rnd.uniform(0.18, 0.34),) * 2 + (0.16,), (x + rnd.uniform(-2.6, 2.6), yf + rnd.uniform(0.4, 5.2), 0.06), (0, 0, rnd.uniform(0, 3)), rnd)

    # ---- THE KITCHEN: THE POT's prize ----------------------------------------------------------------------------------------
    def kitchen(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        hx, hy = x - 0.7, yf + 1.5                                   # the hearth at the lean-to's open front, under its eave
        Bx('slab', MX['pad'], x - 2.4, x + 2.4, yf + 0.8, yf + 4.6, 0, 0.1)
        for k in range(3):                                           # a cinder-block rocket hearth: three courses, the mouth at the front
            z = 0.1 + k * 0.2
            Bx('block_l', MX['block'], hx - 0.62, hx - 0.42, hy - 0.4, hy + 0.4, z, z + 0.19)
            Bx('block_r', MX['block'], hx + 0.42, hx + 0.62, hy - 0.4, hy + 0.4, z, z + 0.19)
            Bx('block_b', MX['block'], hx - 0.62, hx + 0.62, hy + 0.22, hy + 0.42, z, z + 0.19)
            if k: Bx('block_f', MX['block'], hx - 0.62, hx + 0.62, hy - 0.42, hy - 0.22, z, z + 0.19)
        Bx('grate', MX['steel'], hx - 0.64, hx + 0.64, hy - 0.44, hy + 0.44, 0.7, 0.73)
        Bx('mouth', MX['char'], hx - 0.4, hx + 0.4, hy - 0.4, hy + 0.2, 0.1, 0.3)
        boss_thing('pot', (hx, hy - 0.04, 0.73), 1.5)                # HIS pot on the grate
        P.cyl(bpy, 'flue', MX['tin_rust'], 0.09, 2.9, (hx, hy + 0.36, 0.7 + 1.45), verts=12)   # the flue, up through the roof
        for (px, py) in ((x - 2.3, yf + 2.3), (x + 2.3, yf + 2.3), (x - 2.3, yf + 4.4), (x + 2.3, yf + 4.4)):
            Bx('post', MX['wood'], px - 0.05, px + 0.05, py - 0.05, py + 0.05, 0.1, 2.55 if py < yf + 3 else 2.25)
        P.box(bpy, 'lean_to', MX['tin'], (4.9, 2.5, 0.04), (x, yf + 3.35, 2.42), rot=(math.radians(-6.5), 0, 0))
        for k in range(9):                                           # the sheet's corrugations
            P.box(bpy, 'rib', MX['tin_rust'] if k % 4 == 0 else MX['tin'], (0.03, 2.5, 0.05), (x - 2.3 + k * 0.575, yf + 3.35, 2.45), rot=(math.radians(-6.5), 0, 0))
        Bx('table', MX['ply'], x + 0.6, x + 2.0, yf + 1.2, yf + 1.9, 0.86, 0.92)
        for (tx, ty) in ((x + 0.66, yf + 1.26), (x + 1.94, yf + 1.26), (x + 0.66, yf + 1.84), (x + 1.94, yf + 1.84)):
            Bx('leg', MX['wood'], tx - 0.03, tx + 0.03, ty - 0.03, ty + 0.03, 0.1, 0.86)
        Bx('board', MX['bone'], x + 0.8, x + 1.3, yf + 1.35, yf + 1.65, 0.92, 0.95)
        P.cyl(bpy, 'jug', MX['plastic'], 0.13, 0.42, (x + 1.7, yf + 1.55, 1.13), verts=10)
        for k in range(12):                                          # the woodpile against the back post
            P.cyl(bpy, 'log', MX['wood'] if k % 3 else MX['char'], 0.07, 0.9, (x - 1.9 + (k % 4) * 0.15, yf + 4.0, 0.2 + (k // 4) * 0.13), rot=(math.radians(90), 0, 0), verts=8)
        if st == 'working':
            for k in range(4):                                       # the fire in the mouth, two beats of flame
                h = (0.32, 0.22, 0.4, 0.26)[(k + beat) % 4]
                bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=0.12, depth=h, location=(hx - 0.24 + k * 0.16, hy - 0.2, 0.12 + h / 2))
                P.put(bpy, bpy.context.active_object, 'flame', MX['flame'], smooth=False)
            for k in range(5): ico('ember', MX['ember'], 0.05, (hx - 0.25 + k * 0.12, hy - 0.3, 0.13))
            for k in range(3):                                       # steam off the pot, rising a step each beat
                z = 1.25 + k * 0.32 + beat * 0.16
                ico('steam', MX['steam'], 0.13 + k * 0.05, (hx + (k - 1) * 0.06 + beat * 0.05, hy - 0.04, z), 0.8)
            for k in range(3):                                       # smoke out of the flue's top
                z = 3.75 + k * 0.4 + beat * 0.2
                ico('smoke', MX['smoke'], 0.16 + k * 0.07, (hx + k * 0.12 + beat * 0.08, hy + 0.4, z), 0.8)
            pl.fires.append((hx, hy - 0.2, 0.6))

    # ---- THE MAIN: THE TAP's wrench opened it --------------------------------------------------------------------------------
    def main(x, yf, st):
        vx, vy = x - 1.4, yf + 2.2                                    # the curb-stop box over the buried main
        P.cyl(bpy, 'valve_box', MX['pad'], 0.24, 0.06, (vx, vy, 0.03), verts=16)
        P.cyl(bpy, 'valve_lid', MX['tin_rust'], 0.17, 0.02, (vx, vy, 0.07), verts=16)
        if st == 'bare': return stakes(x, yf)
        Bx('trench', MX['soil'], vx - 0.25, vx + 0.25, vy, yf + 5.6, 0, 0.03)          # the line dug in from the main
        Bx('pad', MX['wet'] if st == 'working' else MX['pad'], x - 0.9, x + 1.5, yf + 1.4, yf + 3.4, 0, 0.12)
        rx, ry = x, yf + 2.9
        P.cyl(bpy, 'riser', MX['galv'], 0.035, 1.05, (rx, ry, 0.6), verts=10)
        P.cyl(bpy, 'valve', MX['galv'], 0.06, 0.12, (rx, ry, 0.55), verts=10)
        P.cyl(bpy, 'wheel', MX['red'], 0.12, 0.03, (rx, ry - 0.09, 0.62), rot=(math.radians(90), 0, 0), verts=14)
        P.rod(bpy, 'spout', MX['galv'], (rx, ry, 1.1), (rx, ry - 0.32, 1.1), 0.03, 8)
        P.rod(bpy, 'spout_down', MX['galv'], (rx, ry - 0.32, 1.1), (rx, ry - 0.32, 0.98), 0.03, 8)
        Bx('post', MX['wood'], rx - 0.05, rx + 0.05, ry + 0.06, ry + 0.16, 0.12, 1.3)
        Bx('trough', MX['pad'], rx - 0.6, rx + 0.6, ry - 0.62, ry - 0.12, 0.12, 0.55)          # the wash trough under the spout
        Bx('trough_in', MX['water'] if st == 'working' else MX['dark'], rx - 0.52, rx + 0.52, ry - 0.55, ry - 0.19, 0.5 if st == 'working' else 0.3, 0.56 if st == 'working' else 0.555)
        P.cyl(bpy, 'bucket', MX['tin'], 0.15, 0.3, (x + 1.15, yf + 1.75, 0.27), verts=12)
        boss_thing('wrench', (vx + 0.32, vy + 0.05, 0.02), 1.0, rotz=math.radians(20), roty=math.radians(-74))   # HIS wrench, laid on the box
        if st == 'working':
            P.cyl(bpy, 'stream', MX['running'], 0.022, 0.44, (rx, ry - 0.32, 0.76), verts=8)
            for k in range(3):                                       # the splash rings in the trough, two beats
                rr = 0.08 + ((k + beat) % 3) * 0.07
                P.cyl(bpy, 'ring', MX['running'], rr, 0.01, (rx, ry - 0.37, 0.565), verts=16)
            Bx('spill', MX['water'], x + 0.6, x + 1.6, yf + 1.2, yf + 1.9, 0.12, 0.125)
            P.cyl(bpy, 'bucket_water', MX['water'], 0.13, 0.02, (x + 1.15, yf + 1.75, 0.38), verts=12)

    # ---- THE PURIFIER: THE FILTER's filter on a slow sand bed ------------------------------------------------------------------
    def purifier(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        wet = st == 'working'
        Bx('slab', MX['pad'], x - 2.6, x + 2.6, yf + 1.2, yf + 4.6, 0, 0.1)
        for (bx_, by_) in ((x - 2.3, yf + 3.4), (x - 1.6, yf + 3.4)):   # the raw drum's block stand
            Bx('stand', MX['block'], bx_ - 0.2, bx_ + 0.2, by_ - 0.4, by_ + 0.4, 0.1, 1.0)
        P.cyl(bpy, 'raw_drum', MX['drum_blue'], 0.29, 0.88, (x - 1.95, yf + 3.4, 1.44), verts=16)
        P.cyl(bpy, 'raw_lid', MX['dark'], 0.3, 0.03, (x - 1.95, yf + 3.4, 1.9), verts=16)
        Bx('filter_post', MX['wood'], x - 1.15, x - 1.05, yf + 3.0, yf + 3.1, 0.1, 1.6)
        boss_thing('filter', (x - 1.1, yf + 2.9, 0.86), 1.0)          # HIS filter, the pre-filter on the post
        P.rod(bpy, 'hose_in', MX['dark'], (x - 1.66, yf + 3.4, 1.1), (x - 1.24, yf + 2.95, 1.12), 0.018, 6)
        P.rod(bpy, 'hose_bed', MX['dark'], (x - 0.96, yf + 2.95, 1.12), (x - 0.3, yf + 2.9, 1.02), 0.018, 6)
        # the sand bed: a timber box 1.8 x 1.2 x 0.95, gravel under fine sand, the water kept standing on it when it runs
        bx0, bx1, by0, by1 = x - 0.5, x + 1.3, yf + 2.2, yf + 3.4
        Bx('bed_front', MX['wood'], bx0, bx1, by0, by0 + 0.06, 0.1, 1.05)
        Bx('bed_back', MX['wood'], bx0, bx1, by1 - 0.06, by1, 0.1, 1.05)
        Bx('bed_left', MX['wood'], bx0, bx0 + 0.06, by0, by1, 0.1, 1.05)
        Bx('bed_right', MX['wood'], bx1 - 0.06, bx1, by0, by1, 0.1, 1.05)
        for k in range(3): Bx('bed_board', MX['ply'], bx0 - 0.01, bx1 + 0.01, by0 - 0.01, by0, 0.18 + k * 0.3, 0.2 + k * 0.3)
        Bx('bed_sand', MX['sand'], bx0 + 0.06, bx1 - 0.06, by0 + 0.06, by1 - 0.06, 0.7, 0.88)
        if wet:
            Bx('bed_water', MX['water'], bx0 + 0.06, bx1 - 0.06, by0 + 0.06, by1 - 0.06, 0.88, 0.96)
            P.cyl(bpy, 'inflow', MX['running'], 0.02, 0.1, (x - 0.32, yf + 2.9, 0.98), verts=8)
        P.rod(bpy, 'outlet', MX['galv'], (bx1, yf + 2.4, 0.24), (x + 1.8, yf + 2.4, 0.24), 0.025, 8)
        P.rod(bpy, 'outlet_up', MX['galv'], (x + 1.8, yf + 2.4, 0.24), (x + 1.8, yf + 2.4, 0.9), 0.025, 8)
        P.cyl(bpy, 'clean_drum', MX['plastic'], 0.27, 0.8, (x + 2.05, yf + 2.95, 0.5), verts=16)
        P.cyl(bpy, 'clean_lid', MX['drum_blue'], 0.28, 0.03, (x + 2.05, yf + 2.95, 0.915), verts=16)
        P.rod(bpy, 'clean_tap', MX['galv'], (x + 2.05, yf + 2.68, 0.24), (x + 2.05, yf + 2.56, 0.24), 0.02, 6)
        for k in range(3):                                           # the jugs it fills
            P.cyl(bpy, 'jug', MX['water'] if (wet and k <= beat + 1) else MX['plastic'], 0.11, 0.32, (x + 0.2 + k * 0.3, yf + 1.6, 0.26), verts=10)
        if wet:
            P.cyl(bpy, 'trickle', MX['running'], 0.012, 0.12, (x + 1.86, yf + 2.4, 0.95 - beat * 0.04), verts=6)
            P.cyl(bpy, 'drip', MX['running'], 0.01, 0.05, (x + 2.05, yf + 2.54, 0.16 - beat * 0.06), verts=6)

    # ---- GARDEN BED -------------------------------------------------------------------------------------------------------
    def garden_bed(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        for k in range(3):
            ya, yb = yf + 1.0 + k * 1.55, yf + 2.2 + k * 1.55
            Bx('frame', MX['wood'], x - 2.4, x + 2.4, ya, yb, 0, 0.36)
            Bx('soil', MX['soil'], x - 2.34, x + 2.34, ya + 0.06, yb - 0.06, 0.3, 0.38)
            for f in (0.3, 0.6, 0.9): Bx('furrow', MX['char'], x - 2.3, x + 2.3, ya + f * (yb - ya) - 0.02, ya + f * (yb - ya) + 0.02, 0.38, 0.385)
            if st == 'working':
                for j in range(9):
                    jx = x - 2.1 + j * 0.52 + rnd.uniform(-0.06, 0.06)
                    for f in (0.32, 0.68):
                        o = ico('crop', MX['leaf'] if rnd.random() < 0.78 else MX['leaf_dead'], rnd.uniform(0.17, 0.26), (jx, ya + f * (yb - ya), 0.55), 0.75)
                        o.rotation_euler = (0, 0, beat * 0.25 + j)
                P.rod(bpy, 'drip_line', MX['dark'], (x - 2.4, (ya + yb) / 2, 0.4), (x + 2.4, (ya + yb) / 2, 0.4), 0.012, 6)
        for k in range(4):                                           # the bean poles at the back bed
            px = x - 1.8 + k * 1.2
            P.rod(bpy, 'pole', MX['wood'], (px, yf + 4.4, 0.36), (px + 0.1, yf + 4.4, 1.7), 0.02, 5)
            if st == 'working':
                for z in (0.8, 1.15, 1.45): ico('vine', MX['leaf'], 0.14, (px + 0.05, yf + 4.4, z), 0.9)
        P.cyl(bpy, 'can', MX['tin'], 0.12, 0.3, (x + 2.75, yf + 0.9, 0.15), verts=10)
        P.rod(bpy, 'can_spout', MX['tin'], (x + 2.75, yf + 0.9, 0.2), (x + 2.75, yf + 0.55, 0.36), 0.02, 6)

    # ---- WATER TANK: a rain catch -------------------------------------------------------------------------------------------
    def water_tank(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        full = st == 'working'
        for (px, py) in ((x - 0.1, yf + 1.3), (x + 2.6, yf + 1.3), (x - 0.1, yf + 4.4), (x + 2.6, yf + 4.4)):   # the catchment roof's posts
            Bx('post', MX['wood'], px - 0.05, px + 0.05, py - 0.05, py + 0.05, 0, 2.3 if py < yf + 2 else 2.0)
        P.box(bpy, 'catch_roof', MX['tin'], (2.9, 3.4, 0.04), (x + 1.25, yf + 2.85, 2.14), rot=(math.radians(-5), 0, 0))
        P.rod(bpy, 'gutter', MX['galv'], (x - 0.2, yf + 1.15, 2.26), (x + 2.7, yf + 1.15, 2.26), 0.05, 8)
        tx, ty, tr = x - 1.5, yf + 2.4, 0.8
        for k in range(2):
            for j in range(2):
                Bx('stand', MX['block'], tx - 0.7 + k * 1.0, tx - 0.3 + k * 1.0, ty - 0.6 + j * 0.8, ty - 0.2 + j * 0.8 + 0.4, 0, 0.6)
        Bx('stand_top', MX['wood'], tx - 0.85, tx + 0.85, ty - 0.85, ty + 0.85, 0.6, 0.68)
        IC.lathe(bpy, 'tank', MX['tin'], [(0, 0.68), (tr, 0.68)] + [(tr * (1.0 if k % 2 else 1.025), 0.68 + k * 0.08) for k in range(21)] + [(tr, 2.3), (0.02, 2.45)], n=24)
        P.rod(bpy, 'downpipe', MX['galv'], (x - 0.2, yf + 1.15, 2.26), (tx + 0.3, ty - 0.2, 2.4), 0.045, 8)
        P.cyl(bpy, 'hatch', MX['dark'], 0.18, 0.04, (tx, ty, 2.44), verts=12)
        P.cyl(bpy, 'sight', MX['plastic'], 0.025, 1.5, (tx, ty - tr - 0.04, 1.45), verts=8)   # the clear sight tube up the front
        if full: P.cyl(bpy, 'sight_water', MX['water'], 0.027, 1.3, (tx, ty - tr - 0.045, 1.35), verts=8)
        P.rod(bpy, 'tap', MX['galv'], (tx + 0.3, ty - tr + 0.08, 0.78), (tx + 0.3, ty - tr - 0.22, 0.78), 0.025, 8)
        P.box(bpy, 'jerrycan', MX['drum_blue'], (0.3, 0.17, 0.4), (tx + 0.3, ty - tr - 0.3, 0.2), bevel=0.02)
        if full:
            P.cyl(bpy, 'tap_run', MX['running'], 0.012, 0.26 - beat * 0.08, (tx + 0.3, ty - tr - 0.22, 0.63 + beat * 0.04), verts=6)
            P.rod(bpy, 'overflow', MX['galv'], (tx - tr, ty, 2.2), (tx - tr - 0.3, ty, 2.0), 0.03, 6)

    # ---- SOLAR PANEL: a ground rack, the cabinet, the lamp --------------------------------------------------------------------
    def solar_panel(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        wired = st == 'working'; tilt = math.radians(36)
        for k in range(4):                                           # the steel rack: legs short at the front (south), tall at the back
            lx = x - 2.6 + k * 1.73
            P.rod(bpy, 'leg_f', MX['galv'], (lx, yf + 2.0, 0), (lx, yf + 2.0, 0.45), 0.03, 6)
            P.rod(bpy, 'leg_b', MX['galv'], (lx, yf + 2.0 + 1.6 * math.cos(tilt), 0), (lx, yf + 2.0 + 1.6 * math.cos(tilt), 0.45 + 1.6 * math.sin(tilt)), 0.03, 6)
        for k in range(3):                                           # three 1.7 x 1.0 panels, landscape, cells in a grid
            cx = x - 1.73 + k * 1.73; cy = yf + 2.0 + 0.8 * math.cos(tilt); cz = 0.45 + 0.8 * math.sin(tilt) + 0.03
            P.box(bpy, 'pv', MX['panel'], (1.66, 1.6, 0.04), (cx, cy, cz), rot=(tilt, 0, 0))
            for j in (-0.83, 0.83): P.box(bpy, 'pv_edge', MX['alu'], (0.03, 1.62, 0.05), (cx + j, cy, cz + 0.005), rot=(tilt, 0, 0))
            for j in (-0.4, 0.0, 0.4):
                P.box(bpy, 'pv_line', MX['alu'], (1.62, 0.012, 0.045), (cx, cy + j * math.cos(tilt), cz + j * math.sin(tilt) + 0.004), rot=(tilt, 0, 0))
        cbx, cby = x + 2.6, yf + 0.9
        Bx('cab', MX['cab'], cbx - 0.4, cbx + 0.4, cby, cby + 0.5, 0, 1.1, bevel=0.02)
        Bx('cab_vent', MX['dark'], cbx - 0.25, cbx + 0.25, cby - 0.005, cby, 0.85, 0.95)
        Bx('cab_led', MX['led_on'] if (wired and not beat) else MX['led_off'], cbx + 0.2, cbx + 0.28, cby - 0.008, cby, 0.7, 0.76)
        if wired:
            P.rod(bpy, 'conduit', MX['dark'], (cbx, cby + 0.3, 0.9), (x + 1.7, yf + 2.4, 0.6), 0.025, 6)
            for k in range(4):                                       # the cells it charges: the money (batteries are the money, 9/4)
                P.box(bpy, 'cell', MX['cell'], (0.22, 0.16, 0.26), (cbx - 0.3 + k * 0.24, cby - 0.35, 0.13))
                Bx('cell_charge', MX['cell_lit'] if k <= 1 + beat else MX['led_off'], cbx - 0.36 + k * 0.24, cbx - 0.24 + k * 0.24, cby - 0.436, cby - 0.43, 0.08, 0.2)
        else:
            for k in range(5):                                       # the cable not yet run, coiled on the ground
                P.cyl(bpy, 'coil', MX['dark'], 0.3 - k * 0.012, 0.02, (cbx - 0.9, cby - 0.1, 0.02 + k * 0.022), verts=14)
            Bx('cab_door', MX['cab'], cbx - 0.42, cbx - 0.4, cby - 0.5, cby, 0, 1.1)
        lpx, lpy = x - 2.9, yf + 1.0                                 # the lamp it feeds, on a pole
        P.cyl(bpy, 'lamp_pole', MX['galv'], 0.04, 3.2, (lpx, lpy, 1.6), verts=8)
        P.rod(bpy, 'lamp_arm', MX['galv'], (lpx, lpy, 3.15), (lpx + 0.45, lpy, 3.15), 0.03, 6)
        P.box(bpy, 'lamp_head', MX['dark'], (0.34, 0.2, 0.08), (lpx + 0.55, lpy, 3.1))
        P.box(bpy, 'lamp_glass', MX['lamp_on'] if wired else MX['lamp_off'], (0.28, 0.15, 0.02), (lpx + 0.55, lpy, 3.05))
        if wired: pl.lamps.append((lpx + 0.55, lpy, 3.0))

    return dict(kitchen=kitchen, main=main, purifier=purifier, garden_bed=garden_bed, water_tank=water_tank, solar_panel=solar_panel)
