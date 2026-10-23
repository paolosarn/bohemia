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


def fall(bpy, meshes, roots, rects, kinds, seed):
    """RAIDED: roofs burnt through, rubble in the yards and on the walks"""
    rng = np.random.RandomState(seed + 9)
    black = NF.material(bpy, 'burnt_hole', 'cloth_black', 0, 0.5); soot = NF.material(bpy, 'rafter', 'rubber', 0, 0.6)
    conc = NF.material(bpy, 'rubble_conc', 'tape_grey', 2); brick = NF.material(bpy, 'rubble_brick', 'clay_rust', 1)
    holes, rafters, rub_c, rub_b = [], [], [], []
    for i, ((x0, y0, x1, y1), root) in enumerate(zip(rects, roots)):
        objs = [o for o in meshes if o.parent is root or (o.parent is not None and o.parent.parent is root)]
        xa, xb = x0 / F.PPM, x1 / F.PPM; yfront = F.SIDE * (1 - y1 / F.H)
        if i % 3 == (seed % 3) or rng.rand() < 0.2:                          # this one burnt through
            cx = rng.uniform(xa + 2.5, xb - 2.5); hw = min(2.6, (xb - xa) * 0.25)
            hits = roof_hits(bpy, objs, cx - hw, cx + hw, yfront + 0.8, yfront + 12.0, 0.5)
            for (x, y, z, n) in hits:
                if n.y > 0.05 or rng.rand() < 0.08: continue
                tilt = math.atan2(-n.y, n.z) if n.z < 0.995 else 0.0
                holes.append((x, y, z + 0.02, 0.55, 0.55, 0.03, 0.0, tilt))
            for k in range(3):
                rx = cx - hw * 0.7 + k * hw * 0.7
                col = [h_ for h_ in hits if abs(h_[0] - rx) < 0.3]
                if len(col) > 2:
                    ys = [h_[1] for h_ in col]; zs = [h_[2] for h_ in col]
                    ya, yb = min(ys), max(ys); za, zb = zs[int(np.argmin(ys))], zs[int(np.argmax(ys))]
                    L = math.hypot(yb - ya, zb - za)
                    rafters.append((rx, (ya + yb) / 2, (za + zb) / 2 + 0.06, 0.12, L, 0.14, 0.0, math.atan2(zb - za, yb - ya)))
        for _ in range(rng.randint(10, 22)):                                 # what fell out: across the yard and onto the walk
            x = rng.uniform(xa, xb); y = yfront - rng.uniform(0.3, 4.5); s_ = rng.uniform(0.15, 0.55)
            (rub_b if rng.rand() < 0.35 else rub_c).append((x, y, -0.04, s_, s_ * rng.uniform(0.6, 1.2), s_ * rng.uniform(0.35, 0.7), rng.uniform(0, 6.3), rng.uniform(-0.3, 0.3)))
    ico = F.ico(bpy); lump = (ico[0] * 0.5 + np.array([0, 0, 0.5], np.float32), ico[1]); box = (NF.CUBE_V, NF.CUBE_F)
    # a rafter box centred on its own middle (the cube template sits on z 0: lift it half its thickness)
    rafters = [(x, y, z - 0.07, sx, sy, sz, rz, t) for (x, y, z, sx, sy, sz, rz, t) in rafters]
    new = [NF.instances(bpy, 'fut_hole', box, holes, black), NF.instances(bpy, 'fut_rafter', box, rafters, soot),
           NF.instances(bpy, 'fut_rubble', lump, rub_c, conc, 0.5, rng), NF.instances(bpy, 'fut_brick', box, rub_b, brick, 0.2, rng)]
    return [o for o in new if o is not None], dict(holes=len(holes), rubble=len(rub_c) + len(rub_b))


_place = F.place_houses


def place_houses(bpy, houses, seed):
    meshes, roots, rects, kinds = _place(bpy, houses, seed)
    if STATE['s'] and rects:
        add, what = (grow if STATE['s'] == 'reclaimed' else fall)(bpy, meshes, roots, rects, kinds, seed)
        holder = bpy.data.objects.new('future', None); bpy.context.scene.collection.objects.link(holder)
        for o in add: o.parent = holder                                      # the root's height squash reaches them too
        meshes = meshes + [o for o in add if not o.name.startswith('fut_solar')]; roots = roots + [holder]   # 10/23: the glass keeps its own look
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


def render(state, bid):
    STATE['s'] = state
    out = os.path.join(BASE, state); os.makedirs(os.path.join(out, 'render'), exist_ok=True)
    F.OUT = NF.OUT = out; F.RENDER = os.path.join(out, 'render')
    NF.render(bid)
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
        for b in a[1:]: render(a[0], b)
    sys.stdout.flush(); os._exit(0)
