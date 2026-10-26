#!/usr/bin/env python3
"""BOHEMIA -- COOK [the camp grows], CAMP TWO's NOTE (10/26): 'The camp's pieces (three tents, the fire's six keys, the bedroll, the
supplies, the smart cart, the seats, all eighteen followers' pieces, the slain in three sizes) are modelled in plain metres in
tools/bohemia_camp2_cook_the_camp.py and rendered on the style guide's rig numbers in numpy (no Blender in that session); 12 of 30
come back BACK on the card (kit.json). When a session has the master rig, put the same shapes through it and drop them into
slices/camp_two/kit.png at the same rects and feet; the camp reads kit.json only. Also wanted: a camp-sized trailer for the last
carrier step (the rig's trailer is 12 m).' And the coordinator's rule 289(e): the camp tiers tall and wide with CAMP TWO.

THE SAME SHAPES, THE REAL RIG: every piece is CAMP TWO's own mesh (its builders imported, never redrawn: the same metres, the same
materials by name, its base colours read as the colours a painter picks, so linear in the render), written out as a glTF and put
through DIRECTION's master rig (tools/bohemia_direction_master_rig.py: Cycles, the guide's camera at 45 degrees, its one sun and sky,
the 3/4 cheat x 1.414, THE SOURCE PASS in the materials, the family snap, the ring, the contact shadow, the card), facing S (the
model unturned, its door to the camera, as the numpy tool drew it). The rig cuts each piece on the box round its ground centre;
this lays the piece's own ground point (0, 0, 0) back on a whole pixel, the shadow layer under the body, and packs the sheet.
kit.json keeps every key the camp reads (each piece's rect, foot, footprint_m, height_m) with the rects of the new sheet; the
fire's six keys share one box as before, so the flames never jitter.

THE CAMP TRAILER: a single-axle utility trailer (3.3 m with its tongue, a 2.1 x 1.4 m plywood bed on a rusted frame, a tarp roped
over the load, a jerrycan, tail lights, duct tape), modelled here in the same metres, put through the rig in all eight facings
like the truck (records/target/master_rig/cook_camp_trailer/); kit.json's camp_trailer_rig names it, its ground pixel and its
hitch, for CAMP TWO to draw behind the pickup.

  /tmp/v/bin/python tools/bohemia_cook_the_camp_through_the_rig_10_26_26.py            build the models, run the rig on each, pack
  /tmp/v/bin/python tools/bohemia_cook_the_camp_through_the_rig_10_26_26.py --pack     pack only (the rig runs already done)
  ... --only tent_olive,fire_0                                                           those pieces only

ONE BLENDER AT A TIME (the town scenes' lesson): the rig runs one after another under the cook's render lock.
REFERENCE CHECK: the twins are the master rig's own cart and pickup beside these pieces in the camp (one camera, one sun, one
ruler), and CAMP TWO's numpy pieces (the same shapes) on the side-by-side sheet. A real 4 x 7 ft utility trailer: a 1.2 x 2.1 m
bed, 0.3 m sides, 13 inch wheels, a 1.2 m A-frame tongue. No reference game.
REUSE: CAMP TWO's shapes (every piece) and its sheet's keys; the master rig as it is (no setting moved: a break would be a DON'T).
"""
import os, sys, json, math, time, subprocess, shutil, fcntl

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import numpy as np
from PIL import Image
import bohemia_camp2_cook_the_camp as CT

KIT = os.path.join(R, 'slices/camp_two')
WORK = os.environ.get('COOK_CAMP_WORK', '/tmp/bohemia_cook_camp_rig')
TRAILER_OUT = os.path.join(R, 'records/target/master_rig/cook_camp_trailer')
PROOF = os.path.join(R, 'records/target/cook_camp_rig')
RIG = os.path.join(R, 'tools/bohemia_direction_master_rig.py')
LOCK = '/tmp/bohemia_cook_render_v2.lock'
PPM = float(CT.GUIDE['ppm'])
ZS = 1.0 / math.cos(math.radians(CT.GUIDE['tilt_deg']))
SN = math.sin(math.radians(CT.GUIDE['tilt_deg']))


def camp_trailer():
    """a 4 x 7 ft utility trailer behind the pickup: its tongue to the front (-y, the camera), as the rig's vehicles stand"""
    m = CT.Mesh(); box, cyl, blob, quad = CT.box, CT.cyl, CT.blob, CT.quad
    L, W, fz = 2.1, 1.40, 0.50                     # the bed, its floor's height
    y0, y1 = -0.75, 1.35
    # the frame: two rails and cross members, rusted steel; the floor plywood
    for x in (-W / 2 + 0.05, W / 2 - 0.05):
        box(m, 'rust', (x, (y0 + y1) / 2, fz - 0.06), (0.07, L, 0.08))
    for y in (y0 + 0.05, 0.3, y1 - 0.05):
        box(m, 'iron', (0, y, fz - 0.06), (W - 0.1, 0.06, 0.07))
    box(m, 'wood', (0, (y0 + y1) / 2, fz), (W, L, 0.04))
    # the sides and the front board, plywood, one patched with tape; the tailgate down a little
    sh = 0.34
    for sx in (-1, 1):
        box(m, 'wood_d' if sx < 0 else 'wood', (sx * (W / 2 - 0.015), (y0 + y1) / 2, fz + sh / 2 + 0.02), (0.03, L, sh))
        for yy in (y0 + 0.02, 0.3, y1 - 0.02):     # the stake pockets
            box(m, 'iron', (sx * (W / 2 + 0.01), yy, fz + sh / 2), (0.04, 0.05, sh + 0.04))
    box(m, 'wood', (0, y0 + 0.015, fz + sh / 2 + 0.02), (W, 0.03, sh))
    box(m, 'wood_d', (0, y1 + 0.08, fz + 0.12), (W - 0.08, 0.03, 0.26), tilt_x=math.radians(-25))
    box(m, 'tape', (-W / 2 - 0.003, 0.65, fz + 0.22), (0.006, 0.42, 0.07))
    box(m, 'tape', (-W / 2 - 0.003, 0.25, fz + 0.10), (0.006, 0.20, 0.06))
    box(m, 'tape', (0.30, y0 - 0.002, fz + 0.25), (0.36, 0.006, 0.06))
    # the axle, the wheels (13 inch, 0.29 m) and their fenders
    for sx in (-1, 1):
        cyl(m, 'tyre', (sx * (W / 2 + 0.03), 0.30, 0.29), (sx * (W / 2 + 0.22), 0.30, 0.29), 0.29, 14)
        cyl(m, 'metal', (sx * (W / 2 + 0.215), 0.30, 0.29), (sx * (W / 2 + 0.225), 0.30, 0.29), 0.13, 10)
        box(m, 'rust', (sx * (W / 2 + 0.125), 0.30, 0.62), (0.24, 0.72, 0.03))
        box(m, 'rust', (sx * (W / 2 + 0.125), 0.30 - 0.36, 0.49), (0.24, 0.03, 0.26))
        box(m, 'rust', (sx * (W / 2 + 0.125), 0.30 + 0.36, 0.49), (0.24, 0.03, 0.26))
    cyl(m, 'iron', (-W / 2, 0.30, 0.29), (W / 2, 0.30, 0.29), 0.035, 8)
    # the tongue: an A-frame to the coupler, a jack stand at its front
    hy, hz = y0 - 1.20, 0.43
    for sx in (-1, 1):
        cyl(m, 'rust', (sx * (W / 2 - 0.08), y0 + 0.02, fz - 0.06), (0, hy + 0.12, hz), 0.035, 6)
    box(m, 'iron', (0, hy + 0.04, hz), (0.10, 0.22, 0.09))
    cyl(m, 'iron', (0, hy - 0.06, hz - 0.02), (0, hy - 0.06, hz + 0.05), 0.05, 8)
    cyl(m, 'metal', (0.09, hy + 0.35, 0.0), (0.09, hy + 0.35, hz + 0.18), 0.03, 8)
    cyl(m, 'red', (0.09, hy + 0.35, hz + 0.18), (0.20, hy + 0.35, hz + 0.22), 0.012, 5)
    for sx in (-1, 1):                             # the safety chains
        cyl(m, 'iron', (sx * 0.12, hy + 0.25, hz - 0.02), (sx * 0.05, hy - 0.05, hz - 0.12), 0.012, 4, cap=False)
    # the tail lights on the back corners
    for sx in (-1, 1):
        box(m, 'red', (sx * (W / 2 - 0.08), y1 + 0.02, fz - 0.02), (0.12, 0.03, 0.06))
    # the load: crates and sacks under a blue tarp roped down, a jerrycan strapped to the front board
    for (x, y, s) in ((-0.32, -0.25, (0.52, 0.40, 0.38)), (0.30, -0.15, (0.50, 0.42, 0.40)), (-0.25, 0.60, (0.50, 0.46, 0.44)), (0.32, 0.75, (0.44, 0.40, 0.34))):
        CT.crate(m, (x, y, fz + 0.02 + s[2] / 2), s)
    blob(m, 'tarp', (0.0, 0.32, fz + 0.02), (0.66, 1.00, 0.48), n=12, lump=0.10, seed=41)
    blob(m, 'tarp_d', (0.10, 0.95, fz + 0.30), (0.40, 0.30, 0.22), n=8, lump=0.14, seed=42)
    for yy in (-0.35, 0.30, 0.95):                 # the ropes over the tarp, side to side
        cyl(m, 'rope', (-W / 2, yy, fz + 0.34), (0, yy, fz + 0.96), 0.014, 5, cap=False)
        cyl(m, 'rope', (0, yy, fz + 0.96), (W / 2, yy, fz + 0.34), 0.014, 5, cap=False)
    box(m, 'jug', (0.45, y0 - 0.12, fz + 0.18), (0.30, 0.16, 0.42))
    box(m, 'jug', (0.45, y0 - 0.12, fz + 0.42), (0.08, 0.05, 0.06))
    box(m, 'tape', (0.45, y0 - 0.205, fz + 0.18), (0.32, 0.006, 0.05))
    return m


def pieces():
    """CAMP TWO's own list (its main()), the same builders and the same turns"""
    P = [('tent_olive', CT.tent('olive', 1)), ('tent_tarp', CT.tent('tarp', 2)), ('tent_stripe', CT.tent('stripe', 3)),
         ('fire_cold', CT.fire(cold=True)), ('bedroll', CT.turned(CT.bedroll(), 90)), ('supplies', CT.supplies()), ('smart_cart', CT.smart_cart()),
         ('f_cook', CT.cook_pot()), ('f_blacksmith', CT.anvil()), ('f_surgeon', CT.turned(CT.cot(), 90)), ('f_lookout', CT.lookout()),
         ('f_scout', CT.turned(CT.bike(), 75)), ('f_paymaster', CT.strongbox()), ('seats', CT.seats()), ('f_agent', CT.f_agent()),
         ('f_alchemist', CT.f_alchemist()), ('f_bounty_hunter', CT.f_bounty_hunter()), ('f_brigand', CT.f_brigand()),
         ('f_cartographer', CT.f_cartographer()), ('f_drill_sergeant', CT.f_drill_sergeant()), ('f_minstrel', CT.f_minstrel()),
         ('f_negotiator', CT.f_negotiator()), ('f_quartermaster', CT.f_quartermaster()), ('f_recruiter', CT.f_recruiter()),
         ('f_scavenger', CT.f_scavenger()), ('f_trader', CT.f_trader()), ('slain_few', CT.slain(2)), ('slain_some', CT.slain(4)),
         ('slain_many', CT.slain(7))]
    P += [('fire_%d' % i, CT.fire(key=i)) for i in range(6)]
    return P


def lin(c):
    c = np.asarray(c, float)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def to_glb(name, mesh, path):
    """the piece as one object, one material slot a material, flat or smooth face by face, written as a glTF binary"""
    import bpy
    bpy.ops.wm.read_factory_settings(use_empty=True)
    V, F, M, S = mesh.arrays()
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(v) for v in V], [], [tuple(int(i) for i in f) for f in F]); me.update()
    ob = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(ob)
    names = sorted(set(M))
    for nm in names:
        spec = CT.MAT[nm]; mat = bpy.data.materials.new(nm); mat.use_nodes = True
        b = next(n for n in mat.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        rgb = tuple(lin(spec['rgb'])) + (1.0,)
        b.inputs['Roughness'].default_value = 1.0
        if spec.get('emit'):       # a flame, an ember, the robot's eye, the lantern: light of its own colour, nothing lit on it
            b.inputs['Base Color'].default_value = (0, 0, 0, 1)
            b.inputs['Emission Color'].default_value = rgb; b.inputs['Emission Strength'].default_value = 1.15
        else:
            b.inputs['Base Color'].default_value = rgb
        ob.data.materials.append(mat)
    idx = {nm: i for i, nm in enumerate(names)}
    for i, p in enumerate(me.polygons):
        p.material_index = idx[M[i]]; p.use_smooth = bool(S[i])
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=False, export_apply=True)
    lo, hi = V.min(0), V.max(0)
    return {'lo': lo.tolist(), 'hi': hi.tolist()}


def busy():
    """another Blender holding memory (a town scene renders at 9.7 GB)"""
    for d in os.listdir('/proc'):
        if not d.isdigit(): continue
        try:
            cmd = open('/proc/%s/cmdline' % d, 'rb').read().split(b'\0')
            if not any(b'bpy' in c or b'blender' in c.lower() or b'master_rig' in c for c in cmd): continue
            if int(d) == os.getpid(): continue
            rss = int([l for l in open('/proc/%s/status' % d) if l.startswith('VmRSS')][0].split()[1])
            if rss > 1_500_000: return True
        except Exception: pass
    return False


def rig(name, glb, out, length, eight=False):
    a = [sys.executable, RIG, glb, out, '--real-length', '%.6f' % length, '--still', 'rest']
    if not eight: a += ['--no-id-pass', '--no-calibration']
    r = subprocess.run(a, capture_output=True, text=True)
    # this bpy build can fall over on its way out (a segfault after the last file is written): the run counts when its rig.json is there
    if not os.path.exists(os.path.join(out, 'rig.json')): raise SystemExit('the rig failed on %s (%d):\n%s' % (name, r.returncode, (r.stdout + r.stderr)[-3000:]))
    return json.load(open(os.path.join(out, 'rig.json')))


def sprite(name, out, meta):
    """the rig's S still with its shadow layer under it, and the piece's own ground point (0, 0, 0) in it"""
    rj = json.load(open(os.path.join(out, 'rig.json')))
    body = np.asarray(Image.open(os.path.join(out, 'rig_S.png')).convert('RGBA')).astype(float)
    sp = os.path.join(out, 'shadow_S.png')
    sh = np.asarray(Image.open(sp).convert('RGBA')).astype(float) if os.path.exists(sp) else np.zeros_like(body)
    solid = body[..., 3] > 127
    im = np.zeros_like(body)
    im[..., :3] = (12, 9, 6); im[..., 3] = sh[..., 3]
    im[solid] = body[solid]; im[solid, 3] = 255
    lo, hi = np.array(meta['lo']), np.array(meta['hi'])
    cx, cy = (lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2
    gx, gy = rj['ground_screen'][0] - rj['crop_box_px'][0], rj['ground_screen'][1] - rj['crop_box_px'][1]
    # the rig's root stands at the box's ground centre (cx, cy, lo.z); the piece's own origin is (-cx, -cy, -lo.z) from it
    fx = gx - cx * PPM
    fy = gy + cy * SN * PPM - (-lo[2]) * ZS * math.cos(math.radians(CT.GUIDE['tilt_deg'])) * PPM
    # the rig cuts its eight facings with ONE box (a tent turned east is long sideways): the S picture trimmed to itself, the foot kept
    ys, xs = np.nonzero(im[..., 3] > 0)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1
    im = im[y0:y1, x0:x1]
    return Image.fromarray(np.clip(im + 0.5, 0, 255).astype(np.uint8), 'RGBA'), [int(round(fx)) - int(x0), int(round(fy)) - int(y0)], rj


def pad_to_foot(im, foot, W, H, F):
    c = Image.new('RGBA', (W, H), (0, 0, 0, 0)); c.paste(im, (F[0] - foot[0], F[1] - foot[1])); return c


def pack_all(P, metas):
    old = json.load(open(os.path.join(KIT, 'kit.json')))
    items, feet, rjs = [], {}, {}
    for name, mesh in P:
        im, foot, rj = sprite(name, os.path.join(WORK, 'rig', name), metas[name])
        items.append([name, im]); feet[name] = foot; rjs[name] = rj
    # the fire's keys share one box, the flames never jitter
    keys = [n for n, _ in items if n.startswith('fire_') and n != 'fire_cold']
    if keys:
        Fx = max(feet[n][0] for n in keys); Fy = max(feet[n][1] for n in keys)
        Wd = Fx + max(dict(items)[n].size[0] - feet[n][0] for n in keys); Hd = Fy + max(dict(items)[n].size[1] - feet[n][1] for n in keys)
        for it in items:
            if it[0] in keys: it[1] = pad_to_foot(it[1], feet[it[0]], Wd, Hd, (Fx, Fy)); feet[it[0]] = [Fx, Fy]
    sheet, rects = CT.pack([(n, im, None) for n, im in items])
    sheet.save(os.path.join(KIT, 'kit.png'), optimize=True)
    for n, _ in items:
        e = old['pieces'].setdefault(n, {})
        e['rect'] = list(rects[n]); e['foot'] = feet[n]
        e.setdefault('footprint_m', [round(v, 3) for v in (metas[n]['lo'][0], metas[n]['lo'][1], metas[n]['hi'][0], metas[n]['hi'][1])])
        e.setdefault('height_m', round(metas[n]['hi'][2], 3))
    # BACK as the rig counts it: 3 or more of the card's 8 rows out (the numpy sheet's card names the same pieces)
    old['card'] = {n: int((rjs[n].get('card') or {}).get('out', 0)) >= 3 for n in old.get('card', {}) if n in rjs}
    old['made'] = ('COOK 10/26 (tools/bohemia_cook_the_camp_through_the_rig_10_26_26.py): CAMP TWO\'s same shapes through DIRECTION\'s master rig '
                   '(Cycles, the guide\'s camera, sun, source pass, snap, ring and contact shadow), facing S; the numpy recipe stands as the source of the shapes')
    old['rig_runs'] = 'records/target/cook_camp_rig/rig_json.json (each piece\'s rig.json: its box, ground, colours, card, settings)'
    json.dump(old, open(os.path.join(KIT, 'kit.json'), 'w'), indent=1)
    os.makedirs(PROOF, exist_ok=True)
    json.dump({n: {k: rjs[n].get(k) for k in ('engine', 'res', 'real_dims_m', 'scale_from_model', 'ground_screen', 'crop_box_px', 'ground_px', 'colours',
                                             'card', 'card_guide', 'breaks', 'rig_settings', 'source_pass')} for n in rjs},
              open(os.path.join(PROOF, 'rig_json.json'), 'w'), indent=1)
    return sheet, rects, feet, rjs


def main():
    a = sys.argv[1:]
    only = set(a[a.index('--only') + 1].split(',')) if '--only' in a else None
    P = pieces()
    if only: P = [p for p in P if p[0] in only]
    os.makedirs(os.path.join(WORK, 'glb'), exist_ok=True); os.makedirs(os.path.join(WORK, 'rig'), exist_ok=True)
    mp = os.path.join(WORK, 'metas.json'); metas = json.load(open(mp)) if os.path.exists(mp) else {}
    if '--pack' not in a:
        lk = open(LOCK, 'w'); fcntl.flock(lk, fcntl.LOCK_EX)
        while busy(): time.sleep(20)
        todo = P + ([('camp_trailer', camp_trailer())] if (not only or 'camp_trailer' in only) else [])
        for name, mesh in todo:
            glb = os.path.join(WORK, 'glb', name + '.glb'); metas[name] = to_glb(name, mesh, glb)
            json.dump(metas, open(mp, 'w'), indent=1)
            lo, hi = np.array(metas[name]['lo']), np.array(metas[name]['hi'])
            out = os.path.join(WORK, 'rig', name)
            if os.path.isdir(out): shutil.rmtree(out)
            t = time.time(); rj = rig(name, glb, out, float(max(hi[0] - lo[0], hi[1] - lo[1])), eight=(name == 'camp_trailer'))
            print('  %-16s rig %4.0f s  %d colours  card %d of 8 out  breaks %s' % (name, time.time() - t, rj.get('colours', 0),
                  (rj.get('card') or {}).get('out', -1), rj.get('breaks')), flush=True)
        fcntl.flock(lk, fcntl.LOCK_UN)
    if only and len(P) < 35: return
    sheet, rects, feet, rjs = pack_all(pieces(), metas)
    print('sheet %d x %d' % sheet.size)
    if 'camp_trailer' in metas and os.path.isdir(os.path.join(WORK, 'rig', 'camp_trailer')):
        ship_trailer(metas['camp_trailer'])


def ship_trailer(meta):
    src = os.path.join(WORK, 'rig', 'camp_trailer')
    if os.path.isdir(TRAILER_OUT): shutil.rmtree(TRAILER_OUT)
    os.makedirs(TRAILER_OUT)
    for f in sorted(os.listdir(src)):
        if f.startswith(('rig_', 'shadow_', 'rigid_', 'rigobj_')) or f in ('rig.json', 'calibration.json', 'calibration_cube.png', 'calibration_sphere.png'):
            shutil.copy(os.path.join(src, f), TRAILER_OUT)
    shutil.copy(os.path.join(WORK, 'glb', 'camp_trailer.glb'), TRAILER_OUT)        # the model beside its pictures
    rj = json.load(open(os.path.join(TRAILER_OUT, 'rig.json')))
    here = os.path.relpath(TRAILER_OUT, R)
    fix = lambda v: os.path.join(here, os.path.basename(v)) if isinstance(v, str) else v
    rj['model'] = os.path.join(here, 'camp_trailer.glb')
    for k in ('files', 'shadow_files', 'id_files', 'obj_files'):
        if isinstance(rj.get(k), list): rj[k] = [fix(v) for v in rj[k]]
    json.dump(rj, open(os.path.join(TRAILER_OUT, 'rig.json'), 'w'), indent=1)
    kit = json.load(open(os.path.join(KIT, 'kit.json')))
    lo, hi = np.array(meta['lo']), np.array(meta['hi'])
    kit['camp_trailer_rig'] = {'dir': '../records/target/master_rig/cook_camp_trailer/', 'ground': rj['ground_px'], 'real_dims_m': rj['real_dims_m'],
                               'hitch_m': [round(0 - (lo[0] + hi[0]) / 2, 3), round(-1.95 - (lo[1] + hi[1]) / 2, 3), 0.43],
                               'why': 'the last carrier step (pickup_trailer): a 4 x 7 ft utility trailer, 3.3 m with its tongue; drawn behind the pickup '
                                      'in the same facing; hitch_m is the coupler from the ground centre in metres (x east, y north, tongue to -y)'}
    json.dump(kit, open(os.path.join(KIT, 'kit.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
