#!/usr/bin/env python3
"""BOHEMIA -- HOME BASE 2, THE PIECES HIS OWN BUILDS STAND AS ON HIS CAMERAS (VAMILY rule 466(a), his NO 11/21 on the skewed board:
'Go back to when you originally showed me what the shit would look like from the different camera angles'; rules 354(k) to (o), 373,
445(b), 441). The 11/3 pipeline (tools/bohemia_home_settlement_pipeline_11_3_26.py) renders a piece once per fixed camera, shape and
lot of its row; it had the bosses' three prizes and three of lotbuild's eight (the garden, the tank, the panel) and four houses (a
roof). These are the seven it lacked, in the 11/3 pieces' own hand (tools/bohemia_home_pieces_11_3_26.py: realism first, one model,
'built' and 'working'), seated inside their row's height so every lot stays seen (rule 354(g)):

  WALL          front, 1.8 m   (lotbuild wall)    an 8-inch block wall in an L with pilasters and a cap, a gap with a pallet gate; working:
                                                  razor wire coiled along its top
  VENDOR STALL  front, 2.5 m   (lotbuild stall)   two-post frame, a faded striped tarp, a plank counter on crates, jugs and cans set out, a
                                                  hanging scale; working: a lamp under the tarp, the goods out
  TRAINING YARD front, 2.4 m   (HOME BASE yard)   a rope ring on four posts, a heavy bag on an A-frame, tires, a bench of block and plank;
                                                  working: the bag swinging (its beat)
  SHED          middle, 2.6 m  (lotbuild shed)    COOK's shack (the town tool's own), a bench at its door, a vice, coffee cans of parts
  PUMP HOUSE    middle, 2.6 m  (lotbuild pump)    a block box with a tin roof over the well head, a hand pump and a riser to a trough;
                                                  working: water running into the trough
  FORGE         middle, 3.6 m  (HOME BASE forge)  a block hearth under a tin lean-to, its chimney, an anvil on a stump, a quench barrel, a
                                                  rack of bar; working: the coals lit in the hearth's mouth, smoke from the chimney
  LOOKOUT       back, 7.4 m    (HOME BASE lookout) COOK's watch tower (the town tool's own) at 5 m, a lamp at the deck; working: lit

  make(bpy, P, IC, V, K, pl, HAND, rnd, beat=0) -> {piece: fn(x, y_front, state)}, the 11/3 pieces' own signature.
REUSE: the 11/3 pieces' materials and helpers (imported), COOK's shack and tower (the town tool), the model props. No reference game.
"""
import math


def make(bpy, P, IC, V, K, pl, HAND, rnd, beat=0):
    import bohemia_home_pieces_11_3_26 as PCS
    base = PCS.make(bpy, P, IC, V, K, pl, HAND, rnd, beat)          # the 11/3 hand: its materials are made once, by name
    Bx = lambda n, m, *a, **k: V.Bx(K, n, m, *a, **k)
    hm = lambda n, rgb, glow=0.0, rough=1.0: V.hexmat(bpy, n, rgb, glow, rough)
    MX = dict(block=K.concrete_dk, pad=K.concrete, steel=K.steel, tin=K.tin, tin_rust=K.tin_rust, wood=K.wood, ply=K.ply,
              dark=K.dark, black=K.black, char=K.char, bone=K.bone, plastic=K.plastic, soil=K.soil,
              galv=P.mat(bpy, 'galv', 'tape_grey', 3), red=P.mat(bpy, 'wheel_red', 'blood', 1),
              tarp_a=hm('tarp_faded_a', V.faded('#2f6f8a', 0.45)), tarp_b=hm('tarp_faded_b', (196, 186, 160)),
              rope=hm('rope', (150, 128, 92)), bag=hm('heavy_bag', (74, 58, 44)), tire=hm('tire', (30, 30, 30)),
              water=hm('still_water', (82, 116, 132), 0.0, 0.25), running=hm('running_water', (178, 200, 206), 0.35, 0.2),
              drum_blue=hm('drum_blue', V.faded('#2f5f9a', 0.42)), jug=hm('jug', (206, 200, 178)),
              coal_on=hm('coal_lit', (226, 104, 44), 4.0), coal_off=hm('coal_dead', (40, 36, 34)),
              lamp_on=hm('lamp_on', (232, 178, 104), 3.5), lamp_off=hm('lamp_off', (60, 58, 54)),
              smoke=hm('smoke', (118, 114, 110)), wire=hm('razor', (150, 150, 146), 0.0, 0.35))
    stakes = lambda x, yf: base['garden_bed'](x, yf, 'bare')

    def block_course(n, x0, x1, y0, y1, h):
        Bx(n, MX['block'], x0, x1, y0, y1, 0, h)
        Bx(n + '_cap', MX['pad'], x0 - 0.03, x1 + 0.03, y0 - 0.03, y1 + 0.03, h, h + 0.08)

    # ---- THE WALL: an L of 8-inch block, pilasters every 2.4 m, a cap, a gap closed by a pallet ---------------------------------
    def wall(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        h = 1.8; t = 0.2
        block_course('wall_front_a', x - 3.6, x - 0.6, yf + 0.6, yf + 0.6 + t, h)
        block_course('wall_front_b', x + 0.6, x + 3.6, yf + 0.6, yf + 0.6 + t, h)
        block_course('wall_side', x - 3.6, x - 3.6 + t, yf + 0.6, yf + 6.2, h)
        for px in (x - 3.6, x - 1.2, x - 0.6, x + 0.6, x + 1.2, x + 3.6 - 0.32):
            Bx('pilaster', MX['block'], px - 0.06, px + 0.32, yf + 0.52, yf + 0.88, 0, h + 0.12)
        for k in range(5):                                            # the pallet in the gap, its slats
            Bx('pallet', MX['wood'], x - 0.58, x + 0.58, yf + 0.7 + k * 0.005, yf + 0.74, 0.12 + k * 0.3, 0.24 + k * 0.3)
        for k in range(3):
            P.chunk(bpy, 'rubble', MX['block'], (0.3, 0.2, 0.16), (x + rnd.uniform(-3, 3), yf + rnd.uniform(0.0, 0.4), 0.05), (0, 0, rnd.uniform(0, 3)), rnd)
        if st == 'working':                                            # razor wire coiled along the top
            for seg in ((x - 3.6, x - 0.6), (x + 0.6, x + 3.6)):
                n = int((seg[1] - seg[0]) / 0.35)
                for k in range(n):
                    P.cyl(bpy, 'razor', MX['wire'], 0.16, 0.012, (seg[0] + 0.18 + k * 0.35, yf + 0.7, h + 0.26), rot=(0, math.radians(90), 0), verts=10)

    # ---- THE VENDOR STALL: a frame, a tarp, a counter, his goods set out ---------------------------------------------------------
    def stall(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        out = st == 'working'
        for (px, py) in ((x - 1.8, yf + 1.0), (x + 1.8, yf + 1.0), (x - 1.8, yf + 3.2), (x + 1.8, yf + 3.2)):
            Bx('post', MX['wood'], px - 0.05, px + 0.05, py - 0.05, py + 0.05, 0, 2.4 if py < yf + 2 else 2.1)
        for k in range(6):                                            # the tarp, stripes, sagging to the back
            P.box(bpy, 'tarp', MX['tarp_a'] if k % 2 else MX['tarp_b'], (0.62, 2.5, 0.02), (x - 1.55 + k * 0.62, yf + 2.1, 2.27), rot=(math.radians(-7), 0, 0))
        for (cx0, cx1) in ((x - 1.6, x - 0.9), (x + 0.9, x + 1.6)):  # the counter: planks on crates
            Bx('crate', MX['ply'], cx0, cx1, yf + 1.1, yf + 1.7, 0, 0.75)
        Bx('counter', MX['wood'], x - 1.75, x + 1.75, yf + 1.05, yf + 1.75, 0.75, 0.82)
        P.rod(bpy, 'scale_rod', MX['galv'], (x + 1.2, yf + 1.4, 2.2), (x + 1.2, yf + 1.4, 1.5), 0.01, 6)
        P.cyl(bpy, 'scale_pan', MX['galv'], 0.16, 0.03, (x + 1.2, yf + 1.4, 1.48), verts=12)
        if out:
            for k in range(6):
                P.cyl(bpy, 'jug', MX['jug'], 0.09, 0.28, (x - 1.4 + k * 0.32, yf + 1.4, 0.96), verts=10)
            for k in range(4):
                P.cyl(bpy, 'can', MX['tin'], 0.05, 0.12, (x + 0.3 + k * 0.14, yf + 1.25, 0.88), verts=8)
            P.box(bpy, 'lamp', MX['lamp_on'], (0.18, 0.18, 0.12), (x, yf + 1.6, 2.05))
            pl.lamps.append((x, yf + 1.6, 2.0))
        else:
            P.box(bpy, 'cover', MX['tarp_b'], (3.4, 0.7, 0.05), (x, yf + 1.4, 0.86))

    # ---- THE TRAINING YARD: a rope ring, a heavy bag on an A-frame, tires, a bench ----------------------------------------------
    def yard(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        r0, r1, ry0, ry1 = x - 3.2, x + 0.6, yf + 0.8, yf + 4.6
        for (px, py) in ((r0, ry0), (r1, ry0), (r0, ry1), (r1, ry1)):
            Bx('ring_post', MX['wood'], px - 0.07, px + 0.07, py - 0.07, py + 0.07, 0, 1.3)
        for z in (0.6, 1.1):
            for a, b in (((r0, ry0), (r1, ry0)), ((r1, ry0), (r1, ry1)), ((r1, ry1), (r0, ry1)), ((r0, ry1), (r0, ry0))):
                P.rod(bpy, 'rope', MX['rope'], (a[0], a[1], z), (b[0], b[1], z), 0.02, 6)
        Bx('ring_floor', MX['soil'], r0, r1, ry0, ry1, 0, 0.03)
        fx, fy = x + 2.4, yf + 2.6                                     # the A-frame and the bag
        for s in (-1, 1):
            P.rod(bpy, 'aframe', MX['wood'], (fx - 0.9, fy + s * 0.6, 0), (fx, fy + s * 0.1, 2.35), 0.06, 6)
            P.rod(bpy, 'aframe', MX['wood'], (fx + 0.9, fy + s * 0.6, 0), (fx, fy + s * 0.1, 2.35), 0.06, 6)
        P.rod(bpy, 'beam', MX['wood'], (fx, fy - 0.2, 2.35), (fx, fy + 0.2, 2.35), 0.07, 6)
        sw = math.radians(8 if (st == 'working' and beat) else 0)
        P.rod(bpy, 'chain', MX['steel'], (fx, fy, 2.3), (fx + math.sin(sw) * 0.4, fy, 1.95), 0.012, 4)
        P.cyl(bpy, 'bag', MX['bag'], 0.2, 0.95, (fx + math.sin(sw) * 0.55, fy, 1.45), rot=(0, sw, 0), verts=12)
        for k in range(3):
            P.cyl(bpy, 'tire', MX['tire'], 0.36, 0.2, (x - 2.6 + k * 0.85, yf + 5.6, 0.1), verts=16)
        for k in (-0.7, 0.7):
            Bx('bench_block', MX['block'], x + 1.6 + k - 0.2, x + 1.6 + k + 0.2, yf + 5.0, yf + 5.4, 0, 0.42)
        Bx('bench', MX['wood'], x + 0.7, x + 2.5, yf + 4.95, yf + 5.45, 0.42, 0.48)

    # ---- THE SHED: COOK's shack, a bench at its door ----------------------------------------------------------------------------
    def shed(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        V.shack(K, 'shed', x - 1.8, x + 1.8, yf + 1.4, D=3.0, h=2.4, tarp=None)
        Bx('bench', MX['wood'], x + 2.0, x + 3.4, yf + 0.8, yf + 1.4, 0.8, 0.86)
        for (a, b) in ((x + 2.05, yf + 0.85), (x + 3.35, yf + 0.85), (x + 2.05, yf + 1.35), (x + 3.35, yf + 1.35)):
            Bx('leg', MX['wood'], a - 0.03, a + 0.03, b - 0.03, b + 0.03, 0, 0.8)
        Bx('vice', MX['steel'], x + 3.1, x + 3.3, yf + 0.9, yf + 1.1, 0.86, 1.0)
        for k in range(3):
            P.cyl(bpy, 'parts_can', MX['tin_rust'], 0.08, 0.16, (x + 2.3 + k * 0.25, yf + 1.1, 0.94), verts=10)

    # ---- THE PUMP HOUSE: a block box over the well head, a hand pump, a riser to a trough ----------------------------------------
    def pump(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        run = st == 'working'
        Bx('pumphouse', MX['block'], x - 1.6, x + 0.8, yf + 1.8, yf + 4.2, 0, 2.2)
        P.box(bpy, 'pump_roof', MX['tin_rust'], (2.8, 2.8, 0.04), (x - 0.4, yf + 3.0, 2.38), rot=(math.radians(-8), 0, 0))
        Bx('pump_door', MX['ply'], x - 0.8, x - 0.1, yf + 1.78, yf + 1.8, 0, 1.8)
        P.rod(bpy, 'riser', MX['galv'], (x + 0.8, yf + 2.4, 0.6), (x + 1.8, yf + 2.4, 0.6), 0.05, 8)
        P.cyl(bpy, 'hand_pump', MX['steel'], 0.09, 1.0, (x + 1.8, yf + 2.4, 0.5), verts=10)
        P.rod(bpy, 'pump_handle', MX['steel'], (x + 1.8, yf + 2.4, 1.0), (x + 2.4, yf + 2.4, 1.2 if beat else 0.9), 0.025, 6)
        Bx('trough', MX['pad'], x + 1.3, x + 3.0, yf + 1.0, yf + 1.7, 0, 0.5)
        if run:
            Bx('trough_water', MX['water'], x + 1.38, x + 2.92, yf + 1.08, yf + 1.62, 0.3, 0.46)
            P.cyl(bpy, 'spout_run', MX['running'], 0.02, 0.4, (x + 1.8, yf + 1.9, 0.7), verts=6)

    # ---- THE FORGE: a block hearth under a lean-to, its chimney, an anvil, a quench barrel --------------------------------------
    def forge(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        lit = st == 'working'
        for (px, py) in ((x - 2.6, yf + 1.2), (x + 1.4, yf + 1.2)):
            Bx('lean_post', MX['wood'], px - 0.06, px + 0.06, py - 0.06, py + 0.06, 0, 2.7)
        Bx('back_wall', MX['block'], x - 2.7, x + 1.5, yf + 4.0, yf + 4.2, 0, 3.0)
        P.box(bpy, 'lean_roof', MX['tin_rust'], (4.4, 3.2, 0.04), (x - 0.6, yf + 2.6, 2.85), rot=(math.radians(-6), 0, 0))
        Bx('hearth', MX['block'], x - 2.2, x - 0.6, yf + 2.8, yf + 3.9, 0, 0.9)
        Bx('hearth_mouth', MX['coal_on'] if lit else MX['coal_off'], x - 1.9, x - 0.9, yf + 2.78, yf + 2.82, 0.55, 0.85)
        Bx('chimney', MX['block'], x - 1.7, x - 1.1, yf + 3.4, yf + 3.9, 0.9, 3.55)
        P.box(bpy, 'hood', MX['steel'], (1.4, 1.0, 0.5), (x - 1.4, yf + 3.35, 1.25))
        P.cyl(bpy, 'stump', MX['wood'], 0.28, 0.6, (x + 0.4, yf + 2.0, 0.3), verts=12)
        Bx('anvil', MX['black'], x + 0.15, x + 0.65, yf + 1.9, yf + 2.1, 0.6, 0.82)
        Bx('anvil_horn', MX['black'], x + 0.65, x + 0.9, yf + 1.95, yf + 2.05, 0.72, 0.8)
        P.cyl(bpy, 'quench', MX['drum_blue'], 0.3, 0.85, (x + 1.1, yf + 3.2, 0.43), verts=14)
        for k in range(4):
            P.rod(bpy, 'bar_stock', MX['steel'], (x + 1.5, yf + 3.6 + k * 0.08, 0.05), (x + 1.5, yf + 3.6 + k * 0.08, 1.6), 0.015, 4)
        if lit:
            pl.fires.append((x - 1.4, yf + 2.9, 0.7))
            for k in range(3):
                P.chunk(bpy, 'smoke', MX['smoke'], (0.2 + k * 0.06,) * 3, (x - 1.4 + k * 0.12, yf + 3.65, 3.3 + k * 0.08), (0, 0, k), rnd)   # under the middle row's 3.8 m (measured: 4.06 at first)

    # ---- THE LOOKOUT: COOK's watch tower at 5 m, a lamp at the deck --------------------------------------------------------------
    def lookout(x, yf, st):
        if st == 'bare': return stakes(x, yf)
        V.tower(K, 'lookout', x, yf + 1.6, h=5.0, w=2.6)
        lit = st == 'working'
        P.box(bpy, 'deck_lamp', MX['lamp_on'] if lit else MX['lamp_off'], (0.18, 0.12, 0.12), (x + 1.2, yf + 1.5, 5.4))
        if lit: pl.lamps.append((x + 1.2, yf + 1.5, 5.4))

    return dict(wall=wall, stall=stall, yard=yard, shed=shed, pump=pump, forge=forge, lookout=lookout)
