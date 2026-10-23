#!/usr/bin/env python3
"""BOHEMIA -- COOK [every 2D asset into 3D] + [the floor, not final] 10/22/26: THE FIGHT FLOOR'S TWO FUTURES IN 3D.
Rule 123 (Paolo 10/20: 'all that energy has to be spent towards just revamping all the 2-D assets into these 3-D
sprites... analog horror Crashbox vibes, go crazy'): no card. The futures (fight_ground.json futures[state].blocks) are
COMBAT TWO's 10/9 overlays painted on the present-day pictures (tools/bohemia_combat2_the_future_boards_cook_10_9_26.py):
flat solar rectangles on flat roofs, flat beds, flat scorch. Here each is the SAME 3D SCENE as the present day (the same
seed, the same plan, the same houses and junk, tools/bohemia_cook_the_floor_not_final_10_20_26.py and the town blocks'
buildings, tools/bohemia_cook_the_town_blocks_through_the_rig_10_22_26.py), grown or fallen, rendered through the rig:

  RECLAIMED  (his second votes: 'the game starts in the ruin and the future gets better: reclaimed, techy, modern')
             solar arrays on the roofs, each panel a tilted slab in its rack, found on the roof by casting down onto it;
             raised beds of planks in the yards with green growing in them; the bags, the couches and the paper hauled
             off; no fire has been lit. ANALOG HORROR: everything is clean and growing and nobody is out.
  RAIDED     ('the future goes both ways', raided falls): every third house's roof burnt through (a black hole under the
             tiles, its rafters charred), soot climbing out of four or five places a fire was, rubble across the yards
             and onto the walks, more of everything they left. The same street a week after something came through.

Same file name the board already reads (block_<id>_<state>.webp), same 2575 x 1820, same anchor; nothing within 0.6 m
of a block's side changes, so the seams join as the present day's do. The lights (lamps lit or dead) and the cover
(wrecks hauled off) are the board's own lists, untouched.

  <venv>/bin/python tools/bohemia_cook_the_futures_through_the_rig_10_22_26.py <reclaimed|raided> <block> ...   (about 5 min a block)
  python3 tools/bohemia_cook_the_futures_through_the_rig_10_22_26.py --swap <reclaimed|raided> <block> ...

REFERENCE CHECK (the 9/4 standing duty): the 10/9 overlays are the twins (what changes, where); real places: a reclaimed
Las Vegas tract with rooftop solar and backyard beds (the valley's own 2020s rooftop boom), a burnt block after a fire;
Machine Party's grime across every edge (records/BOHEMIA_REFERENCE_MACHINE_PARTY_8_3_26.md 3.1). No reference game.
REUSE CHECK (REUSE-FIRST): the not-final tool whole (render, grime, junk, swap's ledger shape), the town blocks' tool,
the props modeller's chunk; the floor tool's instancing.
TASTE CHECK: the future is the same place (THE THREE ACTS AT ONCE: the future is computed from the past).
"""
import os, sys, json, math, hashlib
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_the_town_blocks_through_the_rig_10_22_26 as T          # the town blocks' buildings come with it
NF = T.NF; F = NF.F
STATE = {'s': None}
BASE = os.path.join(R, 'records/target/cook_floor_futures')
JUNK_GONE = ('junk_bags', 'junk_paper', 'junk_card', 'junk_cloth', 'junk_mattress', 'junk_couch', 'junk_ash', 'junk_fire', 'junk_deadlawn')


def roof_hits(bpy, objs, x0, x1, y0, y1, step):
    """points on the roofs of these objects: a ray cast straight down every step metres; (x, y, z, normal)"""
    import mathutils
    bpy.context.view_layer.update(); dg = bpy.context.evaluated_depsgraph_get()
    names = {o.name for o in objs}; out = []
    for x in np.arange(x0, x1, step):
        for y in np.arange(y0, y1, step):
            ok, loc, nrm, _i, ob, _m = bpy.context.scene.ray_cast(dg, mathutils.Vector((x, y, 40.0)), mathutils.Vector((0, 0, -1)))
            if ok and ob is not None and ob.name in names and loc.z > 1.5 and not any(k in ob.name for k in ('chim', 'flue', 'cool')):
                out.append((x, y, loc.z, nrm))                         # 10/23: never on a chimney, a flue or a cooler
    return out


GRID = {}


def on_dirt(x, y):
    """10/23: is this point on open ground (the plan's grid, kept by build below)"""
    g = GRID.get('g')
    if g is None: return True
    c = int(round((x + 1.0) / F.STEP)); r = int(round(((F.SIDE + 1.0) - y) / F.STEP))
    if not (0 <= r < g.shape[0] and 0 <= c < g.shape[1]): return False
    return int(g[r, c]) in [F.ID[k] for k in ('caliche', 'desert', 'rough', 'lawn', 'track') if k in F.ID]


def grow(bpy, meshes, roots, rects, kinds, seed):
    """RECLAIMED: the solar on the roofs and the beds in the yards"""
    rng = np.random.RandomState(seed + 5)
    # 10/23: the panels are glass on a dark cell, not paint: on the first render they took the houses' 0.6 wear with the
    # roofs and came out pale grey squares. So they leave the houses' source pass (place_houses below keeps them out of
    # the meshes it hands back; the grime still crosses them), a blue-black cell with a little of the sky in its glass
    panel = NF.srgb_mat(bpy, 'solar', (24, 30, 40), 'cloth_black'); frame = NF.material(bpy, 'solar_frame', 'tape_grey', 3)
    pb = panel.node_tree.nodes['Principled BSDF']; pb.inputs['Roughness'].default_value = 0.55; pb.inputs['Specular IOR Level'].default_value = 0.3   # (0.32 put the sun as a white dot in every panel)
    plank = NF.material(bpy, 'bed', 'clay_mustard', 1); soil = NF.material(bpy, 'soil', 'clay_rust', 0, 0.7); leaf = NF.material(bpy, 'leaf', 'clay_teal', 1, 0.9)
    pv, fr, beds, earth, green = [], [], [], [], []
    for (x0, y0, x1, y1), root in zip(rects, roots):
        objs = [o for o in meshes if o.parent is root or (o.parent is not None and o.parent.parent is root)]
        xa, xb = x0 / F.PPM, x1 / F.PPM; yfront = F.SIDE * (1 - y1 / F.H)
        hits = roof_hits(bpy, objs, xa + 1.2, xb - 1.2, yfront + 0.6, yfront + 14.0, 1.05)
        for (x, y, z, n) in hits:                                        # a panel on every roof point facing south or up
            if n.z < 0.8 or n.y > 0.05: continue
            if rng.rand() < 0.12: continue                                  # a gap where one blew off
            tilt = math.atan2(-n.y, n.z) if n.z < 0.995 else math.radians(12)
            pv.append((x, y, z + 0.07, 0.98, 1.0, 0.035, 0.0, tilt)); fr.append((x, y, z + 0.03, 1.03, 1.05, 0.04, 0.0, tilt))
        for k in range(rng.randint(1, 3)):                                  # the beds out front, on the yard
            bx = rng.uniform(xa + 1.5, xb - 1.5); by = yfront - rng.uniform(1.8, 3.0)
            w, d = rng.uniform(1.8, 2.6), rng.uniform(0.9, 1.2)
            # 10/23: only on open ground (a shallow front yard put them in the gutter): else the back yard, else none
            if not all(on_dirt(bx + dx, by + dy) for dx in (-w / 2, w / 2) for dy in (-d / 2, d / 2)):
                by = yfront + rng.uniform(11.0, 12.5)
                if not all(on_dirt(bx + dx, by + dy) for dx in (-w / 2, w / 2) for dy in (-d / 2, d / 2)): continue
            for (dx, dy, sx, sy) in ((0, -d / 2, w, 0.06), (0, d / 2, w, 0.06), (-w / 2, 0, 0.06, d), (w / 2, 0, 0.06, d)):
                beds.append((bx + dx, by + dy, 0.0, sx, sy, 0.32, 0.0, 0.0))
            earth.append((bx, by, 0.0, w - 0.08, d - 0.08, 0.28, 0.0, 0.0))
            for _ in range(int(w * 5)):
                green.append((bx + rng.uniform(-w / 2 + 0.15, w / 2 - 0.15), by + rng.uniform(-d / 2 + 0.12, d / 2 - 0.12), 0.26, rng.uniform(0.18, 0.32), rng.uniform(0.18, 0.32), rng.uniform(0.2, 0.42), rng.uniform(0, 6.3), 0.0))
    ico = F.ico(bpy); lump = (ico[0] * 0.5 + np.array([0, 0, 0.5], np.float32), ico[1]); box = (NF.CUBE_V, NF.CUBE_F)
    new = [NF.instances(bpy, 'fut_solar', box, pv, panel), NF.instances(bpy, 'fut_solar_frame', box, fr, frame),
           NF.instances(bpy, 'fut_bed', box, beds, plank), NF.instances(bpy, 'fut_soil', box, earth, soil),
           NF.instances(bpy, 'fut_green', lump, green, leaf, 0.3, rng)]
    return [o for o in new if o is not None], dict(panels=len(pv), beds=len(earth))


def drape(bpy, name, quads, mat):
    """10/23: one mesh of quads lying on a surface (each a list of four points), shared corners welded"""
    if not quads: return None
    idx, verts, faces = {}, [], []
    for q in quads:
        f = []
        for p_ in q:
            k = (round(p_[0], 3), round(p_[1], 3))
            if k not in idx: idx[k] = len(verts); verts.append(p_)
            f.append(idx[k])
        faces.append(f)
    me = bpy.data.meshes.new(name); me.from_pydata(verts, [], faces); me.update(); me.materials.append(mat)
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    return o


def fall(bpy, meshes, roots, rects, kinds, seed):
    """RAIDED: roofs burnt through, rubble in the yards and on the walks"""
    rng = np.random.RandomState(seed + 9)
    black = NF.material(bpy, 'burnt_hole', 'cloth_black', 0, 0.5); soot = NF.material(bpy, 'rafter', 'rubber', 0, 0.6)
    conc = NF.material(bpy, 'rubble_conc', 'tape_grey', 2); brick = NF.material(bpy, 'rubble_brick', 'clay_rust', 1)
    holes, rafters, rub_c, rub_b, char, tiles, scorch, beams = [], [], [], [], [], [], [], []
    charm = NF.material(bpy, 'burnt_roof', 'rubber', 2); tilem = NF.material(bpy, 'fallen_tile', 'tape_masking', 1)
    scorchm = NF.material(bpy, 'scorched_roof', 'tape_masking', 0); beamm = NF.material(bpy, 'charred_beam', 'tape_masking', 0, 0.9)
    for i, ((x0, y0, x1, y1), root) in enumerate(zip(rects, roots)):
        objs = [o for o in meshes if o.parent is root or (o.parent is not None and o.parent.parent is root)]
        xa, xb = x0 / F.PPM, x1 / F.PPM; yfront = F.SIDE * (1 - y1 / F.H)
        if i % 3 == (seed % 3) or rng.rand() < 0.2:                          # this one burnt through
            # 10/23: the first hole was a clean grid of black squares (it read as black solar panels), the second and third
            # scatters of black chips: a hole is ONE surface draped on the roof (a mesh through the roof's own points, so it
            # follows the slope with no gaps), its edge a noisy ellipse, the rafters the roof's own strips left standing
            # across it, and a ring of charred roof round it (the same drape, a band further out)
            cx = rng.uniform(xa + 2.5, xb - 2.5); hw = min(2.8, (xb - xa) * 0.28); cy = yfront + rng.uniform(3.5, 7.0); hd = rng.uniform(2.0, 3.4)
            st = 0.1; gx0, gy0 = cx - hw - 1.2, yfront + 0.6          # 0.1 m: at 0.2 the edge read as stair steps
            hits = roof_hits(bpy, objs, gx0, cx + hw + 1.2, gy0, yfront + 12.5, st)
            ph = rng.uniform(0, 6.3, 3); rxs = [cx + (k - 2) * 0.62 + rng.uniform(-0.08, 0.08) for k in range(5)]
            grid = {(int(round((x - gx0) / st)), int(round((y - gy0) / st))): (x, y, z) for (x, y, z, n) in hits if n.y <= 0.05}
            def where(x, y):
                a_ = math.atan2(y - cy, x - cx); r_ = math.hypot((x - cx) / hw, (y - cy) / hd)
                edge = (1.0 + 0.22 * math.sin(3 * a_ + ph[0]) + 0.14 * math.sin(5 * a_ + ph[1]) + 0.1 * math.sin(11 * a_ + ph[2])
                        + 0.07 * math.sin(19 * a_ + ph[0] * 2) + 0.05 * math.sin(29 * a_ + ph[1] * 3))
                return r_ / edge
            for (i_, j_), (x, y, z) in grid.items():
                q = [grid.get(k_) for k_ in ((i_, j_), (i_ + 1, j_), (i_ + 1, j_ + 1), (i_, j_ + 1))]
                if None in q: continue
                mx, my = sum(p_[0] for p_ in q) / 4, sum(p_[1] for p_ in q) / 4; w_ = where(mx, my)
                if w_ < 1.0 and not (w_ > 0.9 and rng.rand() < 0.45):         # the edge breaks up cell by cell
                    if min(abs(mx - rx) for rx in rxs) < 0.09: beams.append([(p_[0], p_[1], p_[2] + 0.05) for p_ in q]); continue
                    holes.append([(p_[0], p_[1], p_[2] + 0.025) for p_ in q])
                elif w_ < 1.1:
                    char.append([(p_[0], p_[1], p_[2] + 0.02) for p_ in q])        # the burnt lip, black-brown
                elif w_ < 1.32 + 0.12 * math.sin(mx * 7.3 + my * 5.1) + 0.08 * math.sin(mx * 13.1 - my * 9.7):
                    scorch.append([(p_[0], p_[1], p_[2] + 0.018) for p_ in q])     # the scorched shingles round it
            for _ in range(rng.randint(8, 16)):                                 # the tiles that fell, along the front eave
                x = rng.uniform(cx - hw * 1.3, cx + hw * 1.3); y = yfront - rng.uniform(0.2, 1.4); s_ = rng.uniform(0.15, 0.3)
                tiles.append((x, y, -0.02, s_, s_ * 0.7, 0.04, rng.uniform(0, 6.3), rng.uniform(-0.3, 0.3)))
        for _ in range(rng.randint(10, 22)):                                 # what fell out: across the yard and onto the walk
            x = rng.uniform(xa, xb); y = yfront - rng.uniform(0.3, 4.5); s_ = rng.uniform(0.15, 0.55)
            (rub_b if rng.rand() < 0.35 else rub_c).append((x, y, -0.04, s_, s_ * rng.uniform(0.6, 1.2), s_ * rng.uniform(0.35, 0.7), rng.uniform(0, 6.3), rng.uniform(-0.3, 0.3)))
    ico = F.ico(bpy); lump = (ico[0] * 0.5 + np.array([0, 0, 0.5], np.float32), ico[1]); box = (NF.CUBE_V, NF.CUBE_F)
    # a rafter box centred on its own middle (the cube template sits on z 0: lift it half its thickness)
    rafters = [(x, y, z - 0.07, sx, sy, sz, rz, t) for (x, y, z, sx, sy, sz, rz, t) in rafters]
    new = [drape(bpy, 'fut_hole', holes, black), NF.instances(bpy, 'fut_rafter', box, rafters, soot),
           drape(bpy, 'fut_char', char, charm), drape(bpy, 'fut_scorch', scorch, scorchm), drape(bpy, 'fut_beam', beams, beamm), NF.instances(bpy, 'fut_tiles', box, tiles, tilem, 0.3, rng),
           NF.instances(bpy, 'fut_rubble', lump, rub_c, conc, 0.5, rng), NF.instances(bpy, 'fut_brick', box, rub_b, brick, 0.2, rng)]
    return [o for o in new if o is not None], dict(holes=len(holes), char=len(char), rafters=len(rafters), rubble=len(rub_c) + len(rub_b))


_place = F.place_houses


def place_houses(bpy, houses, seed):
    meshes, roots, rects, kinds = _place(bpy, houses, seed)
    if STATE['s'] and rects:
        add, what = (grow if STATE['s'] == 'reclaimed' else fall)(bpy, meshes, roots, rects, kinds, seed)
        holder = bpy.data.objects.new('future', None); bpy.context.scene.collection.objects.link(holder)
        for o in add: o.parent = holder                                      # the root's height squash reaches them too
        # 10/23: the glass and the burnt holes keep their own look (in the houses' 0.6 wear the panels and the holes both
        # came out pale grey tiles): only the rubble, the beds and the rafters take the dust
        meshes = meshes + [o for o in add if not o.name.startswith(('fut_solar', 'fut_hole', 'fut_char', 'fut_beam'))]; roots = roots + [holder]
        NF.LEDGER['future'] = what
    return meshes, roots, rects, kinds


_nf_build = NF.build


def build(bpy, gid_full, seed, quick=False):
    objs, g = _nf_build(bpy, gid_full, seed, quick)
    GRID['g'] = g
    if quick or not STATE['s']: return objs, g
    rng = np.random.RandomState(seed + 31)
    if STATE['s'] == 'reclaimed':                                           # hauled off, and no fire has been lit
        gone = [o for o in objs if o.type == 'MESH' and o.name.startswith(JUNK_GONE)]
        for o in gone: objs.remove(o); bpy.data.objects.remove(o, do_unlink=True)
        cart = [o for o in bpy.context.scene.objects if o.name.startswith('junk_cart_stretch')]
        for c_ in cart:                                                     # the cart taken back to the store
            for o in [c_] + list(c_.children_recursive): bpy.data.objects.remove(o, do_unlink=True)
        NF.LEDGER['fires'] = []
    else:                                                                    # the fires people set: four or five more
        fires = list(NF.LEDGER.get('fires', []))
        for _ in range(rng.randint(4, 6)):
            fires.append((rng.uniform(4, F.SIDE - 4), rng.uniform(4, F.SIDE - 4), rng.uniform(2.2, 4.0)))
        NF.LEDGER['fires'] = fires
    return objs, g


F.place_houses = place_houses
NF.build = build; F.build = build


def render(state, bid, region=None):
    STATE['s'] = state
    out = os.path.join(BASE, state); os.makedirs(os.path.join(out, 'render'), exist_ok=True)
    F.OUT = NF.OUT = out; F.RENDER = os.path.join(out, 'render')
    NF.render(bid, region)
    if region: return
    led = os.path.join(out, 'not_final.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    if bid in L: L[bid]['future'] = NF.LEDGER.get('future'); json.dump(L, open(led, 'w'), indent=1)


def swap(state, bid):
    man = json.load(open(os.path.join(NF.SHIP, 'fight_ground.json')))
    src = os.path.join(BASE, state, 'block_%s.webp' % bid.replace('.', '_'))
    dst = os.path.join(NF.SHIP, man['futures'][state]['blocks'][bid])
    a = Image.open(src).convert('RGB'); b = Image.open(dst)
    assert a.size == b.size == (F.W, F.H), (a.size, b.size)
    a.save(dst, quality=76, method=6)
    led = os.path.join(BASE, 'swapped.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    L['%s.%s' % (bid, state)] = dict(file=os.path.relpath(dst, R), sha1=hashlib.sha1(open(dst, 'rb').read()).hexdigest(), master=os.path.relpath(src, R))
    json.dump(L, open(led, 'w'), indent=1)
    print('  swapped', bid, state, '->', os.path.relpath(dst, R), os.path.getsize(dst) // 1024, 'KB', flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not os.path.exists(os.path.join(NF.ORIG, 'fight_ground.json')): NF.orig()
    if a[0] == '--swap':
        for b in a[2:]: swap(a[1], b)
    else:
        region = [int(v) for v in a[a.index('--region') + 1].split(',')] if '--region' in a else None   # 10/23: a test window
        for b in [x for i, x in enumerate(a[1:], 1) if not x.startswith('--') and a[i - 1] != '--region']: render(a[0], b, region)
    sys.stdout.flush(); os._exit(0)
