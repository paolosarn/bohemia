#!/usr/bin/env python3
"""BOHEMIA -- COOK [the armour's art] (rule 272(b)(d), Paolo 10/26: 'the good armour I have on me doesn't show, like a police
helmet... we're gonna have to cook up so much art'; CHARACTER's NOTE: 'Your real art drops in file for file: slices/wear/wear.json
pieces[<class or class+extra>] = {S..SW, drop, portrait: [x, y, w, h, dx, dy]} on wear.webp / wear_face.webp... Render each through
the master rig at ppm 57 with his head as a holdout... The police riot helmet and the police vest first (his words)').

MEASURED FIRST: every helmet and body armour draws on its wearer as one of CHARACTER's placeholder classes, made by a small numpy
ray marcher over signed distances (the rig's recipe without the rig: no bounce, no source pass in the surface, no family snap):
wear.webp, 27 pieces (11 head classes, 6 body classes, their extras), each 8 facings, the helmets also dropped and at portrait size.

THE SAME SHAPES THROUGH THE REAL RIG, AND THE POLICE PIECES THEIR OWN ART:
  * every piece is CHARACTER's own shape (tools/bohemia_character_the_armour_shows.py head_parts / body_parts, imported, never
    redrawn), turned into a mesh by surface nets (tools/bohemia_cook_surface_nets.py, half a pixel a cell) with its paint laid on
    its vertices (the bands, the stripes, the rust, the mail's links are CHARACTER's own patterns read at each vertex);
  * rendered in Blender with DIRECTION's master rig's own light and film and its SOURCE PASS (tools/bohemia_direction_master_rig.py
    light_and_film, source_pass: Cycles, the guide's one sun and sky, the grime, dust, drift and grain in the surface), the guide's
    camera (orthographic, 45 degrees, facing north, the model in the rig's stretched space, 57 px a metre), the eight facings the
    fight draws, the helmet also knocked off on the ground and at portrait size (tilt 80, three times the pixels);
  * his own head, neck and trunk are HOLDOUTS (CHARACTER's proxies): they hide the back of a piece and leave his own pixels to show;
  * a see-through piece (the riot shield's visor, the welder's lens is not) is rendered as its own mask and laid as smoked glass at
    partial alpha over his face, the way CHARACTER's sheet carries it;
  * then the rig's post on every picture: the hard alpha edge, the family snap (prop), the ring;
  * THE POLICE RIOT HELMET AND THE POLICE VEST GET THEIR OWN ART first (his words): the helmet's two vent ribs over the crown, the
    visor's pivot bosses and its lift tab, a chin strap; the vest's webbing rows (MOLLE) across the front, a radio pouch on the
    left chest with its stub aerial, the shoulder straps' buckles, the pale POLICE band kept front and back.
wear.webp, wear_face.webp and wear.json are written in CHARACTER's own format (its packer's code, the same anchors and keys), so the
game (engine/bohemia_wear.js) draws them with nothing changed.

  /tmp/v/bin/python tools/bohemia_cook_the_armour_through_the_rig_10_26_26.py            every piece in use
  /tmp/v/bin/python tools/bohemia_cook_the_armour_through_the_rig_10_26_26.py --only riot_helmet,police_vest --proof   a proof
REFERENCE CHECK: a real police riot helmet (the Paulson/Premier type: a black ABS shell, a clear polycarbonate visor on side pivots
with a lift tab, a leather or fabric neck curtain, vent ribs) and a patrol plate carrier (navy or black, PALS/MOLLE webbing rows, a
radio pouch high on the chest, a reflective POLICE panel front and back). The twins are CHARACTER's placeholder sheet (the same
shapes) and the rig's own man the pieces sit on. No reference game.
"""
import os, sys, json, math, time, fcntl

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import numpy as np
from PIL import Image
import bohemia_character_the_armour_shows as CH
import bohemia_cook_surface_nets as SN
import bohemia_cook_the_camp_through_the_rig_10_26_26 as CR

OUT = os.path.join(R, 'slices/wear')
WORK = os.environ.get('COOK_ARMOUR_WORK', '/tmp/bohemia_cook_armour_rig')
PROOF = os.path.join(R, 'records/target/cook_armour_rig')
PPM = 57.0
CELL = 0.5                                    # the mesher's cell, in the rig's pixels
# THE WEAR ON WHAT HE WEARS: gear on a moving man is wiped, handled and slept in; a parked truck is not. The rig's own wear_by_material
# mechanism (the guide carries hair, skin and eye; COOK's floor added the road's two the same way, recorded): every armour material
# takes this share of the dust and the chips. At the full share a black riot helmet's dome, all of it facing the sky, came out the
# dust's grey (the proof, round one); the guide's caps were fixed the same way (CHARACTER and COOK THREE, round seven).
ARMOUR_WEAR = {'armour_': 0.15}   # a helmet is a cap: the guide's caps (hair) take 0.15; at 0.35 the oxblood moto shell still went pink
V_, rbox, capsule, cyl_x, cyl_y, torus_z, sph, I, S_ = CH.V, CH.rbox, CH.capsule, CH.cyl_x, CH.cyl_y, CH.torus_z, CH.sph, CH.I, CH.S
flat = CH.flat


# ----------------------------------------------------------------------------- the police pieces' own art (his words first)
def own_art(slot, cls, feats, parts):
    """the parts plus the piece's own art; and the names of what was added"""
    P = list(parts); n0 = len(P); names = []
    if slot == 'head' and cls == 'riot_helmet':
        P[0] = (P[0][0], flat('#1f2126'))                                          # the shell police black (the sun greys its crown)
        for sx in (-1, 1):                                                         # two vent ribs over the crown
            rib = I(rbox(V_(sx * 4.2, 1.5, 0), (1.1, 9.0, 30.0), 0.5), CH.sph(V_(0, 0.6, 1.4), 15.0), lambda p: 9.0 - p[..., 2])
            P.append((rib, flat('#26292f')))
            P.append((cyl_x(V_(sx * 15.4, -1.5, 1.2), 1.1, 0.7), flat('#6d717a')))   # the visor's pivot bolts, bright on the boss
        P.append((rbox(V_(0, -16.1, -12.6), (2.2, 0.9, 0.9), 0.4), flat('#4b5058')))   # the lift tab at the shield's foot
        strap = I(torus_z(V_(0, -1.0, -11.0), 11.6, 0.55), lambda p: -p[..., 1] - 2.0, lambda p: p[..., 1] - 6.0)
        P.append((strap, flat('#141518')))                                       # the chin strap's run under the jaw
        names = ['police black', 'vent ribs', 'pivot bolts', 'lift tab', 'chin strap']
    if slot == 'body' and cls == 'police_vest':
        zc = -42.0
        for k in range(3):                                                         # the webbing rows across the front (MOLLE)
            P.append((rbox(V_(0, -8.75, zc - 1.5 - k * 2.6), (9.4, 0.45, 0.55), 0.2), flat('#14161a')))
        P.append((rbox(V_(-4.6, -9.6, CH.TORSO_TOP - 9.5), (1.9, 1.3, 3.0), 0.6), flat('#1e2126')))   # the radio pouch
        P.append((capsule(V_(-5.4, -9.6, CH.TORSO_TOP - 6.6), V_(-5.4, -9.6, CH.TORSO_TOP - 3.0), 0.45, 0.3), flat('#0e0f11')))   # its stub aerial
        for sx in (-1, 1):
            P.append((rbox(V_(sx * 6.0, -8.9, CH.TORSO_TOP - 7.0), (1.6, 0.5, 0.9), 0.3), flat('#3a3e45')))   # the strap buckles
        names = ['webbing', 'radio pouch', 'aerial', 'buckles']
    return P, names


def combos():
    L = json.load(open(CH.LOOKS)); out = {}
    for slot in ('head', 'body'):
        for rid, r in L[slot].items():
            key = r['class'] + ''.join('+' + f for f in sorted(r.get('feats', [])))
            out.setdefault((slot, key), (r['class'], sorted(r.get('feats', []))))
    return out


def meshes(parts):
    """each part a mesh in metres of the rig's stretched space, its paint at its vertices; glass apart"""
    out = []
    for i, (f, m) in enumerate(parts):
        V, F = SN.mesh(f, [-40, -40, -80], [40, 40, 40], CELL)
        if not len(F): continue
        if m == CH.GLASS: out.append(dict(kind='glass', V=V / PPM, F=F, col=None)); continue
        rgb, al = m(V)
        out.append(dict(kind='solid', V=V / PPM, F=F, col=np.clip(np.asarray(rgb, float), 0, 1), name='armour_%d' % i))
    return out


def holds(body):
    return [dict(kind='hold', V=V / PPM, F=F) for V, F in (SN.mesh(h, [-40, -40, -80], [40, 40, 40], 1.0) for h in CH.proxies(body)) if len(F)]


# ----------------------------------------------------------------------------- Blender
def build_scene(items):
    import bpy
    import bohemia_direction_master_rig as MR
    MR.bpy = bpy
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    root = bpy.data.objects.new('turn', None); sc.collection.objects.link(root)
    hold = bpy.data.materials.new('holdout'); hold.use_nodes = True; nt = hold.node_tree
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL': nt.nodes.remove(n)
    ho = nt.nodes.new('ShaderNodeHoldout'); nt.links.new(ho.outputs[0], nt.nodes['Material Output'].inputs['Surface'])
    glass = bpy.data.materials.new('glass_mask'); glass.use_nodes = True; nt = glass.node_tree
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL': nt.nodes.remove(n)
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Strength'].default_value = 1.0; nt.links.new(em.outputs[0], nt.nodes['Material Output'].inputs['Surface'])
    objs = {'solid': [], 'glass': [], 'hold': []}
    for it in items:
        me = bpy.data.meshes.new(it.get('name', it['kind'])); me.from_pydata([tuple(v) for v in it['V']], [], [tuple(int(i) for i in f) for f in it['F']]); me.update()
        for p in me.polygons: p.use_smooth = True
        ob = bpy.data.objects.new(it.get('name', it['kind']), me); sc.collection.objects.link(ob); ob.parent = root
        if it['kind'] == 'solid':
            lin = CR.lin(it['col'])
            at = me.color_attributes.new('paint', 'FLOAT_COLOR', 'POINT')
            at.data.foreach_set('color', np.concatenate([lin, np.ones((len(lin), 1))], 1).astype(np.float32).ravel())
            mat = bpy.data.materials.new(it['name']); mat.use_nodes = True; b = mat.node_tree.nodes['Principled BSDF']
            a = mat.node_tree.nodes.new('ShaderNodeAttribute'); a.attribute_name = 'paint'; mat.node_tree.links.new(a.outputs['Color'], b.inputs['Base Color'])
            b.inputs['Roughness'].default_value = 1.0
            ob.data.materials.append(mat)
        elif it['kind'] == 'glass':
            ob.data.materials.append(glass)
        else:
            ob.data.materials.append(hold)
        objs[it['kind']].append(ob)
    A = {'sun_rot': list(MR.G['sun_rot_deg'])}
    MR.light_and_film(sc, A)
    MR.G['wear_by_material'] = dict(MR.G['wear_by_material'], **ARMOUR_WEAR)
    if objs['solid']: MR.source_pass(objs['solid'], float(MR.G['wear']), 1.0)
    cam_d = bpy.data.cameras.new('cam'); cam_d.type = 'ORTHO'
    cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
    return sc, root, cam, objs, hold


def shoot(sc, root, cam, fn, theta, tilt, box_units, scale, tip=False, samples=None):
    import bpy, mathutils
    bx = (box_units[0] + box_units[2]) / 2.0; by = (box_units[1] + box_units[3]) / 2.0
    Su = max(box_units[2] - box_units[0], box_units[3] - box_units[1])
    t = math.radians(tilt); cam.rotation_euler = (t, 0, 0)
    U = mathutils.Vector((0, math.cos(t), math.sin(t))); D = mathutils.Vector((0, math.sin(t), -math.cos(t)))
    look = mathutils.Vector((bx / PPM, 0, 0)) + U * (-by / PPM)
    cam.location = look - D * 30; cam.data.ortho_scale = Su / PPM
    res = int(round(Su * scale)); sc.render.resolution_x = sc.render.resolution_y = res
    root.rotation_euler = (0, math.radians(-100) if tip else 0, math.radians(theta))
    if samples: sc.cycles.samples = samples
    sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
    return (bx - Su / 2.0) * scale, (by - Su / 2.0) * scale      # the picture's top left from the anchor, in its own pixels


def render_piece(slot, key, cls, feats):
    """every picture of one piece: 8 facings (+ the drop and the portrait for a head), colour and glass mask"""
    import bpy
    parts = CH.head_parts(cls, feats) if slot == 'head' else CH.body_parts(cls, feats)
    parts, added = own_art(slot, cls, feats, parts)
    P = meshes(parts)
    has_glass = any(p['kind'] == 'glass' for p in P)
    d = os.path.join(WORK, key); os.makedirs(d, exist_ok=True)
    box = (-30, -36, 30, 30) if slot == 'head' else (-24, 6, 24, 54)
    jobs = [(f, 45 * i, 45.0, box, 1.0, False, True) for i, f in enumerate(CH.DIRS)]
    shots = {}
    for body_holds, sel in ((True, [j for j in jobs]), ):
        sc, root, cam, objs, hold = build_scene(P + holds(True))
        for (f, th, tl, bb, scl, tip, _) in sel:
            for o in objs['glass']: o.visible_camera = False
            shots[f] = shoot(sc, root, cam, os.path.join(d, 'raw_%s.png' % f), th, tl, bb, scl)
        if has_glass:
            mats = {o.name: o.data.materials[0] for o in objs['solid']}
            for o in objs['solid']: o.data.materials[0] = hold
            for o in objs['glass']: o.visible_camera = True
            for (f, th, tl, bb, scl, tip, _) in sel:
                shoot(sc, root, cam, os.path.join(d, 'mask_%s.png' % f), th, tl, bb, scl, samples=16)
    if slot == 'head':
        # the portrait: front-on, near eye level, three times the pixels, his head and neck the holdouts
        sc, root, cam, objs, hold = build_scene(P + holds(False))
        for o in objs['glass']: o.visible_camera = False
        shots['portrait'] = shoot(sc, root, cam, os.path.join(d, 'raw_portrait.png'), 0, 80.0, box, 3.0)
        if has_glass:
            for o in objs['solid']: o.data.materials[0] = hold
            for o in objs['glass']: o.visible_camera = True
            shoot(sc, root, cam, os.path.join(d, 'mask_portrait.png'), 0, 80.0, box, 3.0, samples=16)
        # dropped: knocked off and lying on its side, nobody under it (the glass reads as the piece's own, opaque smoke)
        sc, root, cam, objs, hold = build_scene(P)
        shots['drop'] = shoot(sc, root, cam, os.path.join(d, 'raw_drop.png'), 0, 45.0, box, 1.0, tip=True)
    json.dump({k: list(v) for k, v in shots.items()}, open(os.path.join(d, 'shots.json'), 'w'))
    import bohemia_direction_master_rig as MR
    json.dump({'rig': 'master rig light_and_film + source_pass', 'breaks': [], 'engine': MR.G['engine'], 'samples': MR.G['samples'],
               'wear': MR.G['wear'], 'wear_by_material': ARMOUR_WEAR, 'faces': int(sum(len(q['F']) for q in P)), 'parts': len(P), 'glass': has_glass, 'own_art': added,
               'cell_px': CELL}, open(os.path.join(d, 'meta.json'), 'w'))


# ----------------------------------------------------------------------------- the rig's post, and the glass
POP = None


def post(d, name, G):
    """the hard alpha, the family snap (prop, 0.6), the ring (the rig's post, per picture); the visor's smoke laid at partial
    alpha where the mask says glass and nothing solid stands in front"""
    global POP
    import bohemia_direction_master_rig as MR
    if POP is None: POP = MR.population('prop')[0]
    a = np.asarray(Image.open(os.path.join(d, 'raw_%s.png' % name)).convert('RGBA')).astype(float)
    op = a[..., 3] > G['alpha_threshold']; a[..., 3] = np.where(op, 255, 0)
    px = a[..., :3][op]; b = np.clip((px // 8).astype(int), 0, 31)
    a[..., :3][op] = px + (POP[b[:, 0], b[:, 1], b[:, 2]] - px) * 0.6
    p = np.pad(op, 1); inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    ring = op & ~inner
    a[..., :3] = np.round(a[..., :3])
    if ring.any() and inner.any():
        want = np.clip(a[..., :3][ring] - G['ring'], 0, 255); pal = np.unique(a[..., :3][inner].reshape(-1, 3), axis=0)
        best = np.empty_like(want)
        for i in range(0, len(want), 256):
            dd = ((want[i:i + 256, None, :] - pal[None, :, :]) ** 2).sum(2); best[i:i + 256] = pal[dd.argmin(1)]
        a[..., :3][ring] = best
    mp = os.path.join(d, 'mask_%s.png' % name)
    if os.path.exists(mp):
        m = np.asarray(Image.open(mp).convert('RGBA')).astype(float)
        g = (m[..., 3] > 127) & (m[..., :3].mean(-1) > 60)
        yy = np.mgrid[0:a.shape[0], 0:a.shape[1]][0] / max(1, a.shape[0])
        smoke = np.stack([52 + 30 * (1 - yy), 64 + 30 * (1 - yy), 74 + 34 * (1 - yy)], -1)    # smoked polycarbonate, the sky in its top
        free = g & ~op
        a[..., :3][free] = smoke[free]; a[..., 3][free] = 105                          # his face under it, through it
        over = g & op
        a[..., :3][over] = a[..., :3][over] * 0.7 + smoke[over] * 0.3
    return a


def crop(a):
    ys, xs = np.nonzero(a[..., 3] > 0)
    if not len(ys): return None, (0, 0)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    return a[y0:y1, x0:x1].astype(np.uint8), (int(x0), int(y0))


def sprites_of(key, slot):
    import bohemia_direction_master_rig as MR
    G = MR.G; d = os.path.join(WORK, key); shots = json.load(open(os.path.join(d, 'shots.json')))
    out = []
    for f in CH.DIRS:
        c, (cx, cy) = crop(post(d, f, G)); ox, oy = shots[f]
        out.append((key, f, c, ox + cx, oy + cy) if c is not None else (key, f, None, 0, 0))
    if slot == 'head':
        c, _ = crop(post(d, 'drop', G)); out.append((key, 'drop', c, -c.shape[1] // 2, -c.shape[0]))
        c, (cx, cy) = crop(post(d, 'portrait', G)); ox, oy = shots['portrait']; out.append((key, 'portrait', c, ox + cx, oy + cy))
    return out


def pack_all(sprites):
    """CHARACTER's packer, its own code's shape: two sheets 512 wide, shelf packed, [x, y, w, h, dx, dy] a cell"""
    cells = {}
    def pack(items, W, name):
        x = y = rowh = 0; place = []
        for key, d, c, dx, dy in items:
            if c is None: cells.setdefault(key, {})[d] = None; continue
            h, w = c.shape[:2]
            if x + w > W: x = 0; y += rowh + 1; rowh = 0
            place.append((c, x, y)); cells.setdefault(key, {})[d] = [x, y, w, h, int(dx), int(dy)]
            x += w + 1; rowh = max(rowh, h)
        H = y + rowh + 1
        sheet = np.zeros((H, W, 4), np.uint8)
        for c, px, py in place: sheet[py:py + c.shape[0], px:px + c.shape[1]] = c
        Image.fromarray(sheet, 'RGBA').save(os.path.join(OUT, name), lossless=True, quality=100, method=6)
        return [W, H]
    size = pack([q for q in sprites if q[1] != 'portrait'], 512, 'wear.webp')
    fsize = pack([q for q in sprites if q[1] == 'portrait'], 512, 'wear_face.webp')
    old = json.load(open(os.path.join(OUT, 'wear.json')))
    old.update(size=size, face_size=fsize, pieces=cells,
               what=("COOK [the armour's art], rule 272(b): CHARACTER's pieces (the same shapes, its classes and extras) meshed and rendered "
                     "through DIRECTION's master rig in Blender (its light, film and source pass; the guide's camera at 45 degrees, the "
                     "stretch, 57 px a metre; his head and trunk as holdouts; the family snap and the ring), the police riot helmet and "
                     "the police vest with their own art (tools/bohemia_cook_the_armour_through_the_rig_10_26_26.py). The anchors and "
                     "cells are CHARACTER's."),
               made='master rig', draft=True)
    json.dump(old, open(os.path.join(OUT, 'wear.json'), 'w'), separators=(',', ':'))
    return size, fsize


def main():
    a = sys.argv[1:]
    only = set(a[a.index('--only') + 1].split(',')) if '--only' in a else None
    C = combos()
    todo = [(slot, key, cls, feats) for (slot, key), (cls, feats) in sorted(C.items()) if not only or key in only]
    if '--pack' not in a:
        lk = open(CR.LOCK, 'w'); fcntl.flock(lk, fcntl.LOCK_EX)
        while CR.busy(): time.sleep(20)
        for slot, key, cls, feats in todo:
            t = time.time(); render_piece(slot, key, cls, feats); print('  %-26s %3.0f s' % (key, time.time() - t), flush=True)
        fcntl.flock(lk, fcntl.LOCK_UN)
    if only and '--proof' in a:
        proof(todo); return
    sprites = []
    for slot, key, cls, feats in [(s, k, c, f) for (s, k), (c, f) in sorted(C.items())]:
        sprites += sprites_of(key, slot)
    print('sheets', pack_all(sprites))
    os.makedirs(PROOF, exist_ok=True)
    json.dump({k: json.load(open(os.path.join(WORK, k, 'meta.json'))) for (s, k) in sorted(C)}, open(os.path.join(PROOF, 'pieces.json'), 'w'), indent=1)


def proof(todo):
    """the new pieces beside CHARACTER's on the sheet, eight facings, at 4x (a proof, not a card)"""
    old = json.load(open(os.path.join(OUT, 'wear.json'))); sh = Image.open(os.path.join(OUT, 'wear.webp')).convert('RGBA')
    rows = []
    for slot, key, cls, feats in todo:
        new = {s[1]: s for s in sprites_of(key, slot)}
        for src in ('old', 'new'):
            row = Image.new('RGBA', (8 * 70, 70), (88, 80, 70, 255))
            for i, f in enumerate(CH.DIRS):
                if src == 'old':
                    c = old['pieces'][key].get(f)
                    if not c: continue
                    im = sh.crop((c[0], c[1], c[0] + c[2], c[1] + c[3])); dx, dy = c[4], c[5]
                else:
                    _, _, arr, dx, dy = new[f]
                    if arr is None: continue
                    im = Image.fromarray(arr, 'RGBA')
                ox = 35 + (i * 70) + dx; oy = (40 if slot == 'head' else 6) + dy
                row.alpha_composite(im, (int(ox), int(oy)))
            rows.append(row)
    out = Image.new('RGBA', (8 * 70, 70 * len(rows)))
    for i, r in enumerate(rows): out.paste(r, (0, i * 70))
    os.makedirs(PROOF, exist_ok=True)
    out.resize((out.width * 3, out.height * 3), Image.NEAREST).save(os.path.join(PROOF, 'proof_old_above_new_below.png'))


if __name__ == '__main__':
    main()
