#!/usr/bin/env python3
"""THE CASINO FLOOR: THE FIRST BIG INTERIOR (COMBAT TWO 11/8/26; VAMILY rule 416, ask line 468; the coordinator's 19:17 order:
'a real Strip casino floor at house-tile size (about 7 by 7 tiles), the same camera with the roof cut away, slot banks as cover,
the cage as the strong room, the pit, the bar, the dead sportsbook wall, dark unless someone pays for power; the golden-piece
recipe (408(b)), its art reusing what exists first (rule 430)').

THE PIECES THE FLOOR HAD NONE OF, each a model in real metres through the master rig (tools/bohemia_direction_master_rig.py,
imported, never edited) with the grime pass of tools/bohemia_cook_the_floor_not_final_10_20_26.py, at the fight's own 42.9 px a
metre (515 px a 12 m tile), his palette roles only (records/target/BOHEMIA_STYLE_PALETTE.json); what exists is reused untouched
(the slot bank, the table, the pillar and the slot glow of tools/bohemia_cook_the_cover_through_the_rig_10_20_26.py; the carpet of
block_casino_*; a drum fire):
  cage      THE CASHIER'S CAGE: a 12 m counter (1.1 m) with four teller windows in a steel grille to 2.6 m, the CASHIER board dead
            over it, one window's bars sawn and bent out (somebody got in once); the strong room behind it is its own floor.
  bar       THE CENTRE BAR: a 12 m counter (1.1 m) on a brass foot rail, six stools (two knocked over), the back bar's bottle
            shelves empty but for three, a dead TV on a bracket.
  screens   THE SPORTSBOOK'S WALL: a 12 m wall 3.6 m tall, eight screens in two rows, all dead but one frozen on the last odds board
            (the analog horror line: it still shows the night the dollar died).
  seats     THE SPORTSBOOK'S SEATS: a row of six desk chairs at a long counter-desk facing the wall (a man crouched at it is in
            low cover).
  wall_ew   A WALL CUT AWAY, east to west: 12 m of steel stud and drywall, cut at 1.6 m so the camera sees over it (the roof and the
            upper floors cut away the way the map's houses show up close); the cut face shows the studs.
  wall_ns   the same wall north to south.
  door      A DOOR IN A CUT WALL: the frame and one leaf hanging open, the opening a man walks through.
  glass     THE FRONT DOORS: four glass leaves in a bronze frame under a dead marquee strip, two of them gone.
  stage     THE LOUNGE STAGE: a riser 1.0 m high, carpeted, a tile of it at a time with no edge of its own (a run of them is one
            stage); stage_steps its front: the brass nosing, two steps, the fallen mic, an amp: high ground one up.
  <venv>/bin/python tools/bohemia_combat_two_the_casino_floor_11_8_26.py all [piece ...]   (model, rig, cut)
[bb] Battle Brothers fights only outdoors; a fight inside is our own swag (rule 416), on the beat as Rogue Fable 4's rooms are.
[analog horror] the one sportsbook screen still lit, frozen on a board of odds for games nobody played.
"""
import os, sys, json, math, subprocess
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
SHIP = os.path.join(R, 'slices/fight_ground/casino')
OUT = os.path.join(R, 'records/target/cook_casino_floor')
MODELS = os.path.join(R, 'reference/models/bohemia')
PPM = 515 / 12.0
VENV = os.environ.get('BOHEMIA_BPY', '/home/user/v/bin/python')

# piece -> (seed, the facing the camera shows, real length m (its long side))
PIECES = {
    'cage': (101, 'S', 12.0), 'bar': (102, 'S', 12.0), 'screens': (103, 'S', 12.0), 'seats': (104, 'S', 10.0),
    'wall_ew': (105, 'S', 12.0), 'wall_ns': (106, 'S', 12.0), 'door': (107, 'S', 12.0), 'glass': (108, 'S', 12.0),
    'stage': (109, 'S', 12.0), 'stage_steps': (110, 'S', 12.0),
}
FLAT = {'wall_ew', 'wall_ns', 'door', 'glass', 'screens', 'stage', 'stage_steps'}   # built into the floor: no contact shadow of their own


def glb_of(piece): return os.path.join(MODELS, 'casino_%s.glb' % piece)


def build(piece, bpy, P):
    import random
    rnd = random.Random(PIECES[piece][0])
    steel, dark = P.mat(bpy, 'steel', 'tape_grey', 1), P.mat(bpy, 'dark_steel', 'cloth_black', 2)
    brass = P.mat(bpy, 'brass', 'clay_mustard', 2)
    wood = P.mat(bpy, 'wood', 'clay_rust', 2)
    carpet = P.mat(bpy, 'carpet', 'clay_rust', 1)
    glass = P.mat(bpy, 'dead_glass', 'glass_eye', 0)
    dry = P.mat(bpy, 'drywall', 'clay_bone', 3)
    stud = P.mat(bpy, 'stud', 'tape_grey', 2)
    if piece == 'cage':
        P.box(bpy, 'counter', wood, (12.0, 0.8, 1.1), (0, 0, 0.55), bevel=0.02)
        P.box(bpy, 'top', P.mat(bpy, 'marble', 'clay_bone', 2), (12.1, 0.95, 0.06), (0, -0.05, 1.13), bevel=0.01)
        P.box(bpy, 'kick', dark, (12.0, 0.04, 0.18), (0, -0.42, 0.09))
        for k in range(4):                                   # four teller windows in the grille
            x = -4.5 + k * 3.0
            P.box(bpy, 'frame_%d' % k, brass, (2.2, 0.06, 0.08), (x, -0.3, 2.55))
            for b in range(9):
                if k == 2 and 2 <= b <= 5: continue           # the sawn bars of window three
                bx = x - 1.0 + b * 0.25
                P.rod(bpy, 'bar_%d_%d' % (k, b), steel, (bx, -0.3, 1.16), (bx, -0.3, 2.55), 0.018, 6)
            P.box(bpy, 'slot_%d' % k, dark, (0.7, 0.3, 0.05), (x, -0.32, 1.17))
        for b in range(4):                                    # the sawn bars, bent out over the counter
            bx = 1.5 - 1.0 + (2 + b) * 0.25
            P.rod(bpy, 'bent_%d' % b, steel, (bx, -0.3, 2.55), (bx + 0.05, -0.75, 1.9 - b * 0.08), 0.018, 6)
        for x in (-6.0, -3.0, 0.0, 3.0, 6.0):
            P.box(bpy, 'post_%g' % x, brass, (0.14, 0.14, 1.5), (x, -0.3, 1.9))
        P.box(bpy, 'sign', dark, (5.0, 0.12, 0.7), (0, -0.25, 3.0), bevel=0.02)
        P.box(bpy, 'sign_face', P.mat(bpy, 'sign_dead', 'clay_bone', 1), (4.6, 0.02, 0.45), (0, -0.32, 3.0))
        return
    if piece == 'bar':
        P.box(bpy, 'counter', wood, (12.0, 0.9, 1.08), (0, 0, 0.54), bevel=0.03)
        P.box(bpy, 'top', dark, (12.2, 1.05, 0.07), (0, -0.05, 1.11), bevel=0.02)
        P.rod(bpy, 'rail', brass, (-6.0, -0.62, 0.22), (6.0, -0.62, 0.22), 0.03, 8)
        P.box(bpy, 'back_bar', wood, (11.0, 0.5, 2.2), (0, 1.25, 1.1), bevel=0.02)
        for s in range(3): P.box(bpy, 'shelf_%d' % s, steel, (10.6, 0.36, 0.04), (0, 1.05, 1.15 + s * 0.4))
        for k in range(3): P.cyl(bpy, 'bottle_%d' % k, P.mat(bpy, 'bottle_%d' % k, 'glass_eye', 1), 0.05, 0.3, (-3.2 + k * 3.9, 1.0, 1.32 + (k % 2) * 0.4))
        P.box(bpy, 'tv', dark, (1.2, 0.1, 0.7), (3.5, 1.0, 2.75), (math.radians(-10), 0, 0), bevel=0.01)
        P.box(bpy, 'tv_glass', glass, (1.05, 0.02, 0.58), (3.5, 0.93, 2.74), (math.radians(-10), 0, 0))
        stool = P.mat(bpy, 'stool', 'cloth_black', 3)
        for k in range(6):
            x = -5.0 + k * 2.0
            if k in (1, 4):                                    # knocked over
                P.cyl(bpy, 'seat_%d' % k, stool, 0.22, 0.1, (x + 0.3, -1.4, 0.22), (math.radians(90), 0, rnd.uniform(0, 3)))
                P.rod(bpy, 'leg_%d' % k, steel, (x + 0.2, -1.2, 0.2), (x - 0.4, -1.6, 0.06), 0.025, 6)
            else:
                P.rod(bpy, 'leg_%d' % k, steel, (x, -1.05, 0.0), (x, -1.05, 0.72), 0.03, 6)
                P.cyl(bpy, 'seat_%d' % k, stool, 0.22, 0.1, (x, -1.05, 0.77))
        return
    if piece == 'screens':
        P.box(bpy, 'wall', dry, (12.0, 0.35, 3.6), (0, 0.4, 1.8))
        P.box(bpy, 'base', dark, (12.0, 0.4, 0.2), (0, 0.22, 0.1))
        lit = P.mat(bpy, 'frozen', 'clay_teal', 3, glow=0.9)
        for r in range(2):
            for c in range(4):
                x, z = -4.5 + c * 3.0, 1.55 + r * 1.25
                P.box(bpy, 'bezel_%d_%d' % (r, c), dark, (2.6, 0.12, 1.1), (x, 0.18, z), bevel=0.02)
                P.box(bpy, 'glass_%d_%d' % (r, c), lit if (r, c) == (1, 2) else glass, (2.4, 0.02, 0.92), (x, 0.11, z))
        for c in range(4):                                      # the odds board's grid on the frozen screen (rows of dead digits)
            pass
        P.box(bpy, 'header', P.mat(bpy, 'header', 'clay_mustard', 1), (11.0, 0.08, 0.35), (0, 0.18, 3.35))
        return
    if piece == 'seats':
        P.box(bpy, 'desk', wood, (10.0, 0.7, 0.78), (0, 0.4, 0.39), bevel=0.02)
        P.box(bpy, 'desk_top', dark, (10.1, 0.8, 0.05), (0, 0.4, 0.8))
        chair = P.mat(bpy, 'chair', 'cloth_black', 2)
        for k in range(6):
            x = -4.2 + k * 1.7; tilt = math.radians(70) if k == 3 else 0
            P.box(bpy, 'cseat_%d' % k, chair, (0.6, 0.55, 0.12), (x, -0.45, 0.5 if not tilt else 0.3), (tilt, 0, 0))
            P.box(bpy, 'cback_%d' % k, chair, (0.6, 0.1, 0.6), (x, -0.75, 0.85 if not tilt else 0.2), (tilt, 0, 0))
            if not tilt: P.rod(bpy, 'cleg_%d' % k, steel, (x, -0.45, 0.0), (x, -0.45, 0.45), 0.03, 6)
        return
    if piece in ('wall_ew', 'wall_ns', 'door'):
        L = 12.0
        if piece == 'door':
            for side in (-1, 1):
                P.box(bpy, 'dry_%d' % side, dry, (4.6, 0.3, 1.6), (side * 3.7, 0, 0.8))
                P.box(bpy, 'cut_%d' % side, stud, (4.6, 0.32, 0.04), (side * 3.7, 0, 1.6))
            P.box(bpy, 'jamb_l', brass, (0.12, 0.34, 2.3), (-1.4, 0, 1.15)); P.box(bpy, 'jamb_r', brass, (0.12, 0.34, 2.3), (1.4, 0, 1.15))
            P.box(bpy, 'head', brass, (2.92, 0.34, 0.12), (0, 0, 2.3))
            P.box(bpy, 'leaf', P.mat(bpy, 'leaf', 'clay_bone', 2), (1.3, 0.06, 2.2), (-1.35, -0.65, 1.1), (0, 0, math.radians(-60)))
            return
        P.box(bpy, 'dry_face', dry, (L, 0.06, 1.6), (0, -0.14, 0.8))
        P.box(bpy, 'dry_back', dry, (L, 0.06, 1.6), (0, 0.14, 0.8))
        for k in range(int(L / 0.6) + 1):                       # the studs, seen in the cut
            P.box(bpy, 'stud_%d' % k, stud, (0.05, 0.22, 1.62), (-L / 2 + k * 0.6, 0, 0.81))
        P.box(bpy, 'cut', stud, (L, 0.3, 0.03), (0, 0, 1.62))
        P.box(bpy, 'base', dark, (L, 0.32, 0.12), (0, 0, 0.06))
        for k in range(3):                                      # the ragged top where it was cut: a few broken boards
            x = rnd.uniform(-5, 5); P.box(bpy, 'rag_%d' % k, dry, (rnd.uniform(0.4, 1.2), 0.06, rnd.uniform(0.15, 0.4)), (x, -0.14, 1.7))
        if piece == 'wall_ns':
            for o in list(bpy.context.scene.objects): o.rotation_euler[2] += math.pi / 2; o.location.x, o.location.y = -o.location.y, o.location.x
        return
    if piece == 'glass':
        P.box(bpy, 'sill', dark, (12.0, 0.5, 0.12), (0, 0, 0.06))
        P.box(bpy, 'marquee', P.mat(bpy, 'marquee', 'clay_mustard', 1), (12.0, 0.9, 0.35), (0, -0.2, 3.0), bevel=0.02)
        for k in range(4):
            x = -4.2 + k * 2.8
            P.box(bpy, 'mullion_%d' % k, brass, (0.1, 0.12, 2.8), (x - 1.35, 0, 1.4))
            if k in (1, 2): continue                            # two leaves gone: the way in
            P.box(bpy, 'leaf_%d' % k, glass, (2.5, 0.04, 2.6), (x, 0, 1.35))
            P.box(bpy, 'push_%d' % k, brass, (0.6, 0.06, 0.06), (x + 0.6, -0.05, 1.1))
        P.box(bpy, 'mullion_end', brass, (0.1, 0.12, 2.8), (5.75, 0, 1.4))
        for k in range(12): P.chunk(bpy, 'shard_%d' % k, glass, (0.2, 0.15, 0.01), (rnd.uniform(-2.5, 2.5), rnd.uniform(-1.2, -0.3), 0.02), (0, 0, rnd.uniform(0, 6)), rnd)
        return
    if piece == 'stage':                                     # one tile of the riser: no edge of its own, so a run of them is one stage
        P.box(bpy, 'riser', carpet, (12.0, 12.0, 1.0), (0, 0, 0.5))
        P.blotch(bpy, 'worn', P.mat(bpy, 'worn', 'clay_rust', 0), rnd.uniform(1.0, 2.0), (rnd.uniform(-3, 3), rnd.uniform(-3, 3), 1.004), (0, 0, 0), PIECES[piece][0]) if hasattr(P, 'blotch') else None
        return
    if piece == 'stage_steps':                               # the riser's front: the brass nosing, two steps, the fallen mic, an amp
        P.box(bpy, 'face', carpet, (12.0, 0.4, 1.0), (0, 0.2, 0.5))
        P.box(bpy, 'nosing', brass, (12.0, 0.1, 0.08), (0, 0.0, 1.0))
        for k in range(2): P.box(bpy, 'step_%d' % k, carpet, (3.0, 0.5, 0.33 * (k + 1)), (0, -0.75 + k * 0.5, 0.165 * (k + 1)))
        P.rod(bpy, 'mic', steel, (2.0, 1.2, 1.02), (3.3, 0.8, 1.08), 0.02, 6)
        P.box(bpy, 'amp', dark, (0.9, 0.5, 0.7), (-4.0, 1.4, 1.35))
        return
    raise KeyError(piece)


def model(piece):
    import bpy
    import bohemia_cook_model_props as P
    bpy.ops.wm.read_factory_settings(use_empty=True)
    build(piece, bpy, P)
    bpy.context.view_layer.update()
    d = P.dims(bpy)
    os.makedirs(MODELS, exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=glb_of(piece), export_format='GLB', use_selection=False)
    print('  model', piece, d, '->', os.path.relpath(glb_of(piece), R), flush=True)


def rig(piece):
    import bohemia_cook_the_floor_not_final_10_20_26 as NF
    RIG = NF.RIG
    out = os.path.join(OUT, piece); os.makedirs(out, exist_ok=True)
    sys.argv = ['rig', glb_of(piece), out, '--ppm', repr(PPM), '--no-calibration', '--no-id-pass', '--seed', str(PIECES[piece][0]), '--real-length', str(PIECES[piece][2])] + (['--no-shadow'] if piece in FLAT else [])
    A = RIG.args()
    NF.LEDGER.clear(); NF.LEDGER.update(fires=[], seed=PIECES[piece][0] % 97, bid=piece)
    meta, stills, clips, portrait = RIG.render(A)
    pop, bins, ntiles = RIG.population(A['fam'])
    outs, box = RIG.post(list(stills), out, A, pop, shadow=A['shadow'])
    meta.update(model=os.path.relpath(glb_of(piece), R), ppm=A['ppm'], files=[os.path.relpath(o, R) for o in outs], crop_box_px=box, grime=NF.LEDGER.get('grime'))
    json.dump(meta, open(os.path.join(out, 'rig.json'), 'w'), indent=1, default=str)
    print('  rig', piece, 'box', box, flush=True)


def cut(piece):
    """the body over its contact shadow, trimmed to what it shows; its foot (the middle of its bottom edge) recorded"""
    from PIL import Image
    f = PIECES[piece][1]
    body = Image.open(os.path.join(OUT, piece, 'rig_%s.png' % f)).convert('RGBA')
    shp = os.path.join(OUT, piece, 'shadow_%s.png' % f)
    layer = Image.open(shp).convert('RGBA') if os.path.exists(shp) and piece not in FLAT else Image.new('RGBA', body.size)
    layer.alpha_composite(body)
    bb = layer.getbbox(); pic = layer.crop(bb)
    bbb = body.getbbox()
    os.makedirs(SHIP, exist_ok=True)
    dst = os.path.join(SHIP, 'casino_%s.webp' % piece)
    pic.save(dst, quality=88, method=6)
    rec = dict(piece=piece, src='casino/casino_%s.webp' % piece, w=pic.width, h=pic.height, facing=f,
               foot=[round((bbb[0] + bbb[2]) / 2 - bb[0], 1), round(bbb[3] - bb[1], 1)], model=os.path.relpath(glb_of(piece), R))
    led = os.path.join(SHIP, 'sizes.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    L[piece] = rec; json.dump(L, open(led, 'w'), indent=1)
    print('  cut', piece, rec, flush=True)


def sub(cmd, piece):
    r = subprocess.run([VENV, os.path.abspath(__file__), cmd, piece], cwd=R, capture_output=True, text=True)
    lines = [l for l in (r.stdout + r.stderr).splitlines() if l.startswith('  ') or 'Error' in l or 'Traceback' in l]
    print('\n'.join(lines[-8:]), flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    cmd, names = a[0], a[1:]
    if cmd == 'model': model(names[0])
    elif cmd == 'rig': rig(names[0])
    elif cmd == 'cut':
        for p in names or list(PIECES): cut(p)
    elif cmd == 'all':
        for p in names or list(PIECES):
            sub('model', p); sub('rig', p)
            try: cut(p)
            except Exception as e: print('  cut failed', p, e, flush=True)
    sys.stdout.flush(); os._exit(0)
