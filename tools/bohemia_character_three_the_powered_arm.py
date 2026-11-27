#!/usr/bin/env python3
"""CHARACTER 3, 11/27/26: THE POWERED ARM (VAMILY rule 486: 'it definitely would be possible to get a cybernetic implant... pretty
expensive... fucked up black market shit'; (a) real tech only, (b) black market, (c) among the dearest things, (d) a man who lost a
limb to a debilitating injury comes back with a powered one, 'it changes what he can do and how he looks').

CHARACTER 2's three loops on the face (records/BOHEMIA_CHARACTER_TWO_IMPLANTS_HOW_THEY_LOOK_11_27_26.md) said: at the fight's size a
head is about ten pixels and only the ARM reads, as a shape and a colour that is not a sleeve. So this is the arm, first, on the body.

WHAT IT IS, REAL (the record's research; records/target/bb/implants.json 'powered_arm', 1,200 batteries, ECONOMY THREE): a myoelectric
hand (a bebionic-class hand: sensors on the stump read his muscles and drive the fingers' motors) in a carbon-fibre socket that sits
on the stump below the elbow, no surgery. In a valley at five percent capitalism it was pulled off a dead man and refitted in a back
room: the socket was made for another arm, so it is packed and taped where it meets his; the battery is not the one it came with, an
outside pack taped on, its lead run to the socket. Never chrome: matte carbon, a gunmetal hand worn at the knuckles, duct tape.

THE PIECES (his LEFT forearm, so his gun hand is his own; every piece weighted to his forearm by the body's own nearest weights):
  the SOCKET     a rigid shell from just under the elbow to the wrist, 16 mm off his skin (a socket is bigger than the arm it
                 replaced), matte carbon, a lighter trim line at its elbow end
  the TAPE       two wraps of silver duct tape where it was refitted, at the trim and round the middle
  the HAND       the man's own hand's shape (the body tool's hand_mesh) 5 mm out, gunmetal, the fingers' joints darker
  the BATTERY    an outside pack in faded safety orange on the socket's outer side near the elbow, black tape across it, a lead
                 from it into the socket's rim: the one warm spot of colour, so the arm reads at the fight's size

THE METHOD, REUSE FIRST: the nine enemies' pipe (tools/bohemia_character_the_nine_enemies.py: the barber's roll, the body build, its
garments, RUN TWO's render on DIRECTION's master rig), imported and never edited: a type added in memory, a roll of its own, and
this piece added beside its pieces.

    python3 tools/bohemia_character_three_the_powered_arm.py roll
    BOHEMIA_BPY=/tmp/v/bin/python python3 tools/bohemia_character_three_the_powered_arm.py look [pid ...]   (the model, then eight stills)
    BOHEMIA_BPY=/tmp/v/bin/python python3 tools/bohemia_character_three_the_powered_arm.py close [pid ...]  (the model up close, two sides)
    python3 tools/bohemia_character_three_the_powered_arm.py card
"""
import json, math, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_the_nine_enemies as NE   # noqa: E402

ROLL = os.path.join(ROOT, 'records/character/BOHEMIA_THE_POWERED_ARM_ROLL.json')
OUT = os.path.join(ROOT, 'records/target/character/the_powered_arm')
T_NAME = 'Powered Arm'

# ---- THE COLOURS AT THE SOURCE (the rig's source pass lays the grime and the light) -------------------------------------
CARBON, CARBON_LT = (34, 34, 37), (66, 66, 70)          # matte carbon fibre, its trim
TAPE, TAPE_DK = (156, 156, 148), (112, 112, 106)         # duct tape, its edge
GUNMETAL, JOINT = (84, 86, 88), (42, 42, 44)             # the hand's shell, its knuckles and finger joints
PACK, PACK_DK = (192, 106, 42), (120, 66, 30)            # an outside battery pack in faded safety orange (loop 4: a value up, it read brown at the fight's size)
LEAD = (24, 24, 24)
if os.environ.get('BOHEMIA_PARM_PLANT'): PACK = (0, 255, 0)   # a planted test colour: where the pack lands in each turn

NE.TYPES[T_NAME] = dict(
    row='powered_arm', faction='none', stand_in='Remnants', cell='faction_remnants', count=2,
    what='a man who lost his left forearm, on a salvaged powered arm: a carbon socket, a gunmetal hand, tape, an outside battery',
    dials=[dict(height=0.25, belly=0.0, shoulders=0.45, hips=0.0), dict(height=0.05, belly=0.25, shoulders=0.55, hips=0.10)],
    tops=['BONE TANK', 'STORM GREY TEE'],
    coats=[None, 'TACTICAL VEST'],
    legs=['BLACK CARGOS', 'SOOT CARGOS'],
    feet=['TALL MOTO BOOTS', 'FIELD BOOTS'],
    kit=[['LEATHER BELT'], ['LEATHER BELT']],
    hats=[None, 'HAT CHARCOAL WATCH CAP'], eyewear=[None, None],
    pieces=[['powered_arm']] * 2, cuts=['TEMPLE TAPER', 'DRY TAPER', 'DEEP TAPER', 'RAZOR SKULL'],
    outfit=False)   # loop 1 (looking, powered_arm_0 x3): the outfit step gave the tank a long-sleeved jacket over the socket
if T_NAME not in NE.ORDER: NE.ORDER.append(T_NAME)
NE.POOL[T_NAME] = 'powered_arm'
NE.ROLL = ROLL


def arm_pieces(X, spec, side=1):
    """the powered arm on his left forearm (side 1: the body's left arm sits at +x, garments_base arm_s and arm_ring)"""
    import bohemia_character_garments_base as BASE
    K_ = BASE.kit(X)
    V, M, cloth, band, arm_ring, arm_s, new_obj, finish = (K_[n] for n in ('V', 'M', 'cloth', 'band', 'arm_ring', 'arm_s', 'new_obj', 'finish'))
    EL, WR = K_['EL'], K_['WR']
    bmesh, mat, bpy = X['bmesh'], X['mat'], K_['bpy']
    ring_i = 0 if side == 1 else 1
    made = []

    def paint(o, rules):
        idx = []
        for k, (col, _) in enumerate(rules):
            o.data.materials.append(mat('%s_m%d' % (o.name, k), col)); idx.append(len(o.data.materials) - 1)
        for f in o.data.polygons:
            c = M @ f.center
            for k, (_, test) in enumerate(rules):
                if test(c, f): f.material_index = idx[k]; break
        return o

    def at(s):   # the left arm's axis point at arm parameter s (1 the elbow, 2 the wrist), mirrored to this side
        a, b = EL, WR; p = a.lerp(b, max(0.0, min(1.5, s - 1.0)))
        return V((p.x * side, p.y, p.z))

    # the SOCKET: a rigid shell on the forearm, under the elbow to the wrist
    keep = lambda fm, c: fm == 'fore' and c.x * side > 0 and 1.07 < arm_s(fm, c) < 1.97
    sock = cloth('parm_socket', keep, lambda p: 0.016, CARBON, rim=0.007, fams=('fore',))
    if sock is not None:
        paint(sock, [(CARBON_LT, lambda c, f: arm_s('fore', c) < 1.12)])
        made.append(sock)
    # the TAPE where it was refitted: at the trim and round the middle
    for i, (s_, w) in enumerate(((1.13, 0.034), (1.55, 0.026))):
        made.append(band('parm_tape_%d' % i, [arm_ring(s_, 0.020)[ring_i]], w, 0.007, TAPE if i == 0 else TAPE_DK))
    # the HAND: his own hand's shape 5 mm out, gunmetal, the joints darker
    ax = (at(2.0) - at(1.0)).normalized()
    for h in X['hands']:
        g = X['hand_mesh'](*h)
        xs = [(M @ v.co).x for v in g.data.vertices]
        if not xs or (sum(xs) / len(xs)) * side <= 0:
            bpy.data.objects.remove(g, do_unlink=True); continue
        g.name = 'parm_hand'
        for v in g.data.vertices: v.co = v.co + v.normal * 0.008   # loop 3: at 5 mm his own knuckles came through the shell
        finish(g, GUNMETAL, 'parm_hand', 0, 0)
        wr = at(2.0)
        def joint(c, f, wr=wr):
            d = (c - wr).dot(ax)                                    # along the hand from the wrist: the knuckles and two finger joints
            return any(abs(d - k) < 0.007 for k in (0.088, 0.118, 0.142))
        paint(g, [(JOINT, joint)])
        made.append(g)
    # the BATTERY: an outside pack on the socket's outer side near the elbow, black tape across it, its lead into the rim
    # loop 1 (looking, powered_arm_0 x8): 2.4 x 5.6 x 6.6 cm sat inside the socket's own surface and drew nothing; the render is
    # 57 px a metre (1.75 cm a pixel), so the pack is 9 cm long, 5.5 cm wide and 3.4 cm proud, on the front of his forearm's
    # outer side, where the front three turns see it
    # loop 3 (a flat render of the posed arm): placed off the ring's widest point it sat inside the socket; now off the forearm's
    # own surface under a point 12 cm out to the front and side, along that surface's normal, past the socket and the tape
    c0 = at(1.36); want = V((side * 0.72, -0.70, 0.0)).normalized()
    loc, nrm = K_['surf'](c0 + want * 0.12)
    out = (nrm - ax * nrm.dot(ax)).normalized()
    pc = loc + out * (0.016 + 0.008 + 0.017)
    r_out = (loc - c0).dot(out)
    up = ax; across = up.cross(out).normalized()
    bm = bmesh.new(); r = bmesh.ops.create_cube(bm, size=2.0)
    for v in r['verts']:
        x, y, z = v.co; v.co = pc + out * (x * 0.017) + across * (y * 0.0275) + up * (z * 0.045)
    # loop 2 (a planted green, 0 pixels in eight turns): its four sides' centres sat on the tape's line, so the whole box took the
    # tape's black; cut finer, the tape is a stripe
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=5, use_grid_fill=True)
    pack = finish(new_obj(bm, 'parm_pack'), PACK, 'parm_pack', 1, 0)
    paint(pack, [(LEAD, lambda c, f: abs((c - pc).dot(up)) < 0.008), (PACK_DK, lambda c, f: (c - pc).dot(out) < -0.012)])
    made.append(pack)
    p0 = pc + up * 0.045; p1 = at(1.10) + out * (r_out + 0.022); mid = (p0 + p1) * 0.5 + out * 0.018
    bm = bmesh.new()
    for a, b in ((p0, mid), (mid, p1)):
        d = b - a; q = d.normalized().to_track_quat('Z', 'Y')
        res = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=8, radius1=0.0045, radius2=0.0045, depth=d.length)
        for v in res['verts']: v.co = (a + b) * 0.5 + q @ v.co
    made.append(finish(new_obj(bm, 'parm_lead'), LEAD, 'parm_lead', 0, 0))
    return [m for m in made if m is not None]


_ORIG = NE.body_pieces


def body_pieces(names, X, spec):
    names = list(names or [])
    mine = [n for n in names if n == 'powered_arm']
    rest = [n for n in names if n != 'powered_arm']
    return (_ORIG(rest, X, spec) if rest else []) + (arm_pieces(X, spec) if mine else [])


NE.body_pieces = body_pieces


def roll():
    if not os.path.exists(ROLL):
        os.makedirs(os.path.dirname(ROLL), exist_ok=True); json.dump([], open(ROLL, 'w'))
    if [p for p in json.load(open(ROLL)) if p['gang'] == T_NAME]:
        print('rolled already'); return
    NE.roll_more(T_NAME)


def pids():
    return [p['id'] for p in json.load(open(ROLL)) if p['gang'] == T_NAME]


def look(pid):
    R = NE.R2()
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % NE.tag_of(pid))
    if not os.path.exists(glb) or os.environ.get('BOHEMIA_REBUILD'):
        if os.path.exists(glb): os.remove(glb)
        if not R.run([NE.bpy_py(), os.path.abspath(__file__), 'build-one', pid], glb): print('BUILD FAILED', pid); return
    h = json.load(open(glb.replace('.glb', '.json')))['real_height_for_rig']
    out = os.path.join(OUT, 'look', NE.look_of(pid))
    import shutil, subprocess
    if os.path.exists(out): shutil.rmtree(out)
    log = os.path.join(OUT, 'look', NE.look_of(pid) + '.log'); os.makedirs(os.path.dirname(log), exist_ok=True)
    with open(log, 'w') as lf:   # run in the open: RUN TWO's run() hides a failed post step behind the manifest it wrote first
        subprocess.call([NE.bpy_py(), '-c', R.render_code(glb, out, h, clips=[('Stand', 1)])], cwd=ROOT, stdout=lf, stderr=subprocess.STDOUT)
    ok = all(os.path.exists(os.path.join(out, 'rig_%s.png' % f)) for f in ('S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'))
    if ok: os.remove(log)
    print('LOOK', pid, os.path.relpath(out, ROOT), 'eight stills' if ok else 'STILLS MISSING, see ' + os.path.relpath(log, ROOT), flush=True)


CLOSE = r"""
import bpy, sys, math
glb, out = sys.argv[-2], sys.argv[-1]
bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=glb)
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
arm.animation_data_create(); arm.animation_data.action = next(a for a in bpy.data.actions if a.name.startswith('Stand'))
sc = bpy.context.scene; sc.frame_set(1)
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam
cam.data.type = 'ORTHO'; cam.data.ortho_scale = 0.5
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.data.energy = 4; sun.rotation_euler = (0.6, 0.3, 0.2); sc.collection.objects.link(sun)
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[1].default_value = 1.0
sc.render.engine = 'CYCLES'; sc.cycles.samples = 48; sc.cycles.device = 'CPU'; sc.render.resolution_x = sc.render.resolution_y = 420
for i, (loc, rot) in enumerate((((0.17, -2.0, 0.65), (math.radians(90), 0, 0)), ((1.6, -1.6, 0.65), (math.radians(90), 0, math.radians(45))))):
    cam.location = loc; cam.rotation_euler = rot; sc.render.filepath = out + '_%d.png' % i; bpy.ops.render.render(write_still=True)
"""


def close(pid):
    """the model up close for the card: his posed arm, flat light, from the front and the front's left (a plain Cycles render of the
    same model, not the game's look: the card says so)"""
    import subprocess
    from PIL import Image
    glb = os.path.join(ROOT, 'records/character/rig/barber_%s.glb' % NE.tag_of(pid)); k = pid.rsplit('_', 1)[-1]
    base = os.path.join(OUT, 'close_%s' % k)
    subprocess.call([NE.bpy_py(), '-c', CLOSE, '--', glb, base], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for i in (0, 1):
        f = '%s_%d.png' % (base, i)
        if os.path.exists(f): Image.open(f).convert('RGB').save(f[:-4] + '.webp', 'WEBP', quality=86); os.remove(f)


if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'roll': roll()
    elif cmd == 'build-one': NE.build_one(sys.argv[2])
    elif cmd == 'look':
        for p in (sys.argv[2:] or pids()): look(p)
    elif cmd == 'close':
        for p in (sys.argv[2:] or pids()): close(p)
    elif cmd == 'card':
        import bohemia_character_three_the_powered_arm_card as C; C.card()
