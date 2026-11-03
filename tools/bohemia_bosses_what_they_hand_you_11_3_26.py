#!/usr/bin/env python3
"""BOHEMIA -- BOSSES [what a kill does] (11/3/26, rule 338, ask line 346). Paolo 11/3: 'we still don't know what killing them does,
like wtf, and the map effects where their shit is... I don't like the map icons after I kill a boss too, like wtf.'

The moment a boss falls, the power he hands over flies into the phone AS A THING: THE POT's copper stock pot, THE TAP's pipe wrench,
THE FILTER's water filter. This tool makes the three things the way every icon in the game is made since 11/2: a small model in
real metres put through DIRECTION's master rig (one sun, one wear pass, one snap toward his prop family), cut down 3x with a real
filter and one dark pixel round the silhouette.

REUSE CHECK (REUSE-FIRST): DIRECTION's icon tool (tools/bohemia_direction_every_icon_through_the_rig_11_2_26.py) is imported and
never edited: its model(), rig() and cutimg() run here with this file's builder and this file's folders put in their place; the
props modeller's helpers (bohemia_cook_model_props: mat, box, cyl, rod, dims) and COOK's lathe (bohemia_cook_the_icons_through_the_rig).
REFERENCE CHECK (the 9/4 duty): real things at real sizes. A 20-quart restaurant stock pot is about 30 cm across and 28 cm tall with
two riveted loop handles and a flat lid with a knob; an 18-inch cast iron pipe wrench is 46 cm long with a hook jaw, a knurled nut
and a red-painted I-beam handle (the classic Ridgid colour); a whole-house water filter housing is a 12 cm canister about 32 cm tall
under a grey cap with an in and an out port. The twins are the rig's own props on the map (slices/boss_places/fire, main_after,
clean: the same sun) and the three places he took them from. No reference game.
TASTE CHECK: a thing is what its name says; each silhouette reads alone at 44 points.

  /tmp/v/bin/python tools/bohemia_bosses_what_they_hand_you_11_3_26.py [pot wrench filter]   model + rig + cut
  python3 tools/bohemia_bosses_what_they_hand_you_11_3_26.py cut [...]                       the cut only

SHIPS: slices/boss_places/hand_<verb>.png (96 x 96; the card shows it at 56 points, the flight at 44, the phone's button at 18).
"""
import os, sys, json, math, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_direction_every_icon_through_the_rig_11_2_26 as D

OUT = os.path.join(R, 'records/target/bosses_hand_rig')
THINGS = {'pot': 'cook', 'wrench': 'open', 'filter': 'purify',
          'fuel': 'burn', 'map': 'survey', 'hook': 'climb'}   # the thing -> the verb it is (BOSSES 4 11/3: THE BURN's, THE SURVEYOR's, THE CLIMB's)


def ship_of(n):
    return os.path.join(R, 'slices/boss_places', 'hand_' + THINGS[n] + '.png'), (96, 96)


def build(n, bpy, P, IC):
    M = lambda nm, role, step: P.mat(bpy, nm, role, step)
    if n == 'pot':                     # THE POT's copper stock pot, the lid on, soot round the foot
        copper, soot, steel, dark = M('copper', 'clay_rust', 3), M('soot', 'rubber', 1), M('steel', 'tape_grey', 2), M('dark', 'rubber', 2)
        r, h = 0.15, 0.27
        IC.lathe(bpy, 'pot', copper, [(0, 0.0), (r * 0.93, 0.0), (r, 0.012), (r, h - 0.01), (r * 1.03, h - 0.004), (r * 1.03, h), (r * 0.97, h), (0, h - 0.004)], n=28)
        IC.lathe(bpy, 'soot', soot, [(r * 1.003, 0.004), (r * 1.006, 0.004), (r * 1.006, 0.07), (r * 1.003, 0.07)], n=28)
        IC.lathe(bpy, 'band', copper, [(r * 1.004, 0.18), (r * 1.012, 0.18), (r * 1.012, 0.2), (r * 1.004, 0.2)], n=28)
        IC.lathe(bpy, 'lid', steel, [(0, h + 0.03), (0.03, h + 0.028), (0.11, h + 0.016), (r * 1.02, h + 0.002), (r * 1.0, h), (0, h)], n=28)
        IC.lathe(bpy, 'knob', dark, [(0, h + 0.028), (0.016, h + 0.028), (0.02, h + 0.04), (0.02, h + 0.052), (0, h + 0.056)], n=16)
        for s in (-1, 1):              # two riveted loop handles
            bpy.ops.mesh.primitive_torus_add(major_segments=20, minor_segments=8, major_radius=0.034, minor_radius=0.008,
                                             location=(s * (r + 0.026), 0, h - 0.05), rotation=(math.radians(90), 0, 0))
            o = bpy.context.active_object; o.name = 'handle'; o.data.materials.append(steel)
            for p in o.data.polygons: p.use_smooth = True
    elif n == 'wrench':                # THE TAP's 18-inch pipe wrench, standing on its jaw, leaning
        iron, red, steel = M('iron', 'tape_grey', 1), M('red', 'blood', 1), M('steel', 'tape_grey', 3)
        P.box(bpy, 'handle', red, (0.034, 0.022, 0.3), (0, 0, 0.17), bevel=0.006)          # the red I-beam
        P.box(bpy, 'end', iron, (0.04, 0.026, 0.022), (0, 0, 0.02), bevel=0.004)
        P.box(bpy, 'head', iron, (0.05, 0.03, 0.06), (0.004, 0, 0.345), bevel=0.005)        # the frame the heel jaw is cast on
        P.box(bpy, 'heel', steel, (0.06, 0.03, 0.022), (0.04, 0, 0.37), bevel=0.003)        # the lower jaw, teeth up
        P.box(bpy, 'shank', iron, (0.018, 0.024, 0.11), (-0.012, 0, 0.42), bevel=0.003)     # the hook jaw's shank, through the nut
        P.box(bpy, 'hook', steel, (0.07, 0.03, 0.026), (0.02, 0, 0.462), bevel=0.003)       # the upper jaw, teeth down
        P.cyl(bpy, 'nut', iron, 0.021, 0.03, (-0.012, 0, 0.405), verts=16)                  # the knurled nut on the shank
        for i in range(3):
            P.cyl(bpy, 'knurl', steel, 0.0225, 0.004, (-0.012, 0, 0.395 + i * 0.01), verts=16)
        for o in bpy.context.scene.objects: o.rotation_euler[1] += math.radians(-16)
    elif n == 'filter':                # THE FILTER's whole-house water filter: the clear-blue housing, the grey cap, in and out
        body, grey, white, dark = M('body', 'clay_teal', 4), M('grey', 'tape_grey', 2), M('white', 'clay_bone', 4), M('dark', 'rubber', 2)
        r, h = 0.06, 0.32
        IC.lathe(bpy, 'housing', body, [(0, 0.0), (r * 0.8, 0.0), (r * 0.97, 0.01), (r, 0.03), (r, h - 0.06), (r * 1.06, h - 0.05), (0, h - 0.05)], n=24)
        IC.lathe(bpy, 'cartridge', white, [(r * 1.002, 0.06), (r * 1.004, 0.06), (r * 1.004, h - 0.09), (r * 1.002, h - 0.09)], n=24)
        for i in range(4):
            IC.lathe(bpy, 'rib', grey, [(r * 1.004, 0.08 + i * 0.045), (r * 1.01, 0.08 + i * 0.045), (r * 1.01, 0.085 + i * 0.045), (r * 1.004, 0.085 + i * 0.045)], n=24)
        P.box(bpy, 'cap', grey, (0.17, 0.12, 0.05), (0, 0, h - 0.025), bevel=0.01)
        for s in (-1, 1):              # the in and the out
            P.cyl(bpy, 'port', grey, 0.017, 0.05, (s * 0.1, 0, h - 0.025), rot=(0, math.radians(90), 0), verts=14)
            P.cyl(bpy, 'hose', dark, 0.014, 0.05, (s * 0.14, 0, h - 0.025), rot=(0, math.radians(90), 0), verts=14)
        P.cyl(bpy, 'valve', dark, 0.012, 0.02, (0, 0, h + 0.008), verts=12)
    elif n == 'fuel':                  # BOSSES 4: THE BURN's 20-litre steel jerrycan, fuel red, its three handles and its spout cap
        red, dark, steel = M('red', 'blood', 1), M('dark', 'rubber', 2), M('steel', 'tape_grey', 2)
        P.box(bpy, 'can', red, (0.165, 0.34, 0.47), (0, 0, 0.235), bevel=0.012)
        for s in (-1, 1):              # the pressed X on each face
            for a in (-1, 1):
                P.box(bpy, 'x', dark, (0.006, 0.36, 0.035), (s * 0.085, 0, 0.23), rot=(math.radians(a * 34), 0, 0), bevel=0.002)
        for y in (-0.07, 0.0, 0.07):   # the three handles
            P.box(bpy, 'handle', red, (0.03, 0.022, 0.05), (0, y, 0.49), bevel=0.004)
        P.box(bpy, 'grip', red, (0.03, 0.18, 0.02), (0, 0, 0.515), bevel=0.004)
        P.cyl(bpy, 'spout', steel, 0.022, 0.05, (0, 0.13, 0.49), verts=14)
        P.cyl(bpy, 'cap', dark, 0.024, 0.02, (0, 0.13, 0.52), verts=14)
    elif n == 'map':                   # BOSSES 4: THE SURVEYOR's map, the county sheet folded in three, standing open, its roads and a red route
        paper, ink, red, tube = M('paper', 'clay_bone', 3), M('ink', 'rubber', 2), M('red', 'blood', 1), M('tube', 'rubber', 1)
        for i, (x, a) in enumerate(((-0.13, 18), (0.0, -18), (0.13, 18))):   # three panels, zig-zag, like a map opened in a hand
            P.box(bpy, 'panel', paper, (0.135, 0.004, 0.34), (x, 0.0, 0.2), rot=(0, 0, math.radians(a)), bevel=0.0)
            for z in (0.1, 0.19, 0.27):
                P.box(bpy, 'road', ink, (0.13, 0.006, 0.006), (x, -0.003, z), rot=(0, 0, math.radians(a)))
            P.box(bpy, 'street', ink, (0.005, 0.006, 0.3), (x + 0.03, -0.003, 0.2), rot=(0, 0, math.radians(a)))
        P.box(bpy, 'route', red, (0.2, 0.007, 0.012), (0.0, -0.006, 0.15), rot=(0, 0, math.radians(-18)))
        P.box(bpy, 'route2', red, (0.012, 0.007, 0.12), (0.07, -0.006, 0.21), rot=(0, 0, math.radians(-18)))
        P.cyl(bpy, 'tube', tube, 0.035, 0.36, (0.24, 0.07, 0.18), verts=16)
    elif n == 'hook':                  # BOSSES 4: THE CLIMB's crane hook, safety yellow, its eye, its latch, a short chain
        yel, dark, steel = M('yel', 'clay_mustard', 3), M('dark', 'rubber', 2), M('steel', 'tape_grey', 2)
        bpy.ops.mesh.primitive_torus_add(major_segments=24, minor_segments=10, major_radius=0.05, minor_radius=0.016, location=(0, 0, 0.36), rotation=(math.radians(90), 0, 0))
        o = bpy.context.active_object; o.name = 'eye'; o.data.materials.append(yel)
        P.box(bpy, 'shank', yel, (0.05, 0.035, 0.11), (0, 0, 0.27), bevel=0.01)
        pts = []
        for k in range(15):            # the J: round from the shank's foot and up to its point
            a = math.radians(-20 + 220 * k / 14); pts.append((0.075 - 0.075 * math.cos(a) - 0.075, 0, 0.13 - 0.075 * math.sin(a)))
        for a_, b_ in zip(pts, pts[1:]): P.rod(bpy, 'j', yel, a_, b_, 0.026, verts=12)
        P.rod(bpy, 'latch', steel, (-0.0, 0, 0.21), (pts[-1][0], 0, pts[-1][2] + 0.01), 0.006, verts=6)
        for i in range(3):             # the chain over it
            bpy.ops.mesh.primitive_torus_add(major_segments=16, minor_segments=8, major_radius=0.03, minor_radius=0.008, location=(0, 0, 0.44 + i * 0.05),
                                             rotation=(math.radians(90), 0, math.radians(90 * (i % 2))))
            o = bpy.context.active_object; o.name = 'link'; o.data.materials.append(dark); o.scale = (1, 1.6, 1)
    else:
        raise KeyError(n)


D.OUT = OUT
D.FACE['wrench'] = 'S'   # a flat tool reads side-on (DIRECTION's flat signs' way)
D.FACE['map'] = 'S'; D.FACE['hook'] = 'S'
D.VENV = os.environ.get('BOHEMIA_BPY') or D.VENV
D.ship_of = ship_of
D.build = build


def cut(n):
    dst, (W, H) = ship_of(n)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    D.cutimg(n, W, H).save(dst, optimize=True)
    print('  cut', n, dst, flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd = a[0] if a and a[0] in ('model', 'rig', 'cut') else 'all'
    want = [x for x in a if x not in ('model', 'rig', 'cut')] or list(THINGS)
    if cmd == 'model': D.model(want[0])
    elif cmd == 'rig': D.rig(want[0])
    elif cmd == 'cut': [cut(n) for n in want]
    else:
        for n in want:
            for step in ('model', 'rig'):
                r = subprocess.run([D.VENV, os.path.abspath(__file__), step, n], cwd=R, capture_output=True, text=True)
                print('\n'.join(l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l or 'Traceback' in l)[-900:], flush=True)
            try: cut(n)
            except Exception as e: print('  cut failed', n, e, flush=True)
    sys.stdout.flush(); os._exit(0)
