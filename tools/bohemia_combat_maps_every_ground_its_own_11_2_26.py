#!/usr/bin/env python3
"""BOHEMIA -- COMBAT MAPS 2 [every ground its own] 11/2/26 (rule 336, ask line 337).
Paolo 11/2, voting the six new fight maps NO: 'They all collectively need more love. It's still this yellow brown sand dirt as
the main ground, not enough unique shit going on. Definitely a work in progress for all of them.'

WHAT IT DOES. Every fight block's FLOOR becomes its place's own ground, through the rig, and nothing else on the block moves:
  1. THE GROUNDS (the rig side, Blender's python): twenty-five new ground materials written in the floor tool's own material
     language (tools/bohemia_cook_the_floor_through_the_rig_10_19_26.py MATS: a palette role and step, grit, speck, joints,
     cracks, mud, oil) with their own scatter (its STONES: cobbles in the wash, ballast at the works, varnished pebbles on the
     desert, limestone scree on the pass, trash in the landfill cover). Each is BUILT as a whole 66 m field by the floor tool's
     build() (its grid, heights, stones), passed through the master rig (source pass, dents, one sun, film) and shot by the
     block camera (orthographic, tilted 45, facing north, 42.92 px a metre), then crossfaded seamless: one PLATE per ground.
  2. THE PLAN (plain python): per block, a ground id per pixel, written from the block's own tiles, its houses, its roads and
     its water as the picture shows them: the suburb's yards dead lawn with a concrete driveway from every garage to the
     street; downtown's lots asphalt with painted stalls under the canopy's shadow; the works' slab oil-stained with a rail
     spur on its ties and ballast; the wash's bed cobbles and silt; the shore's cracked mud and its bathtub ring; the desert's
     varnished pavement and caliche crust (the sand kept only in the coppice mound under each creosote, where the real ground
     IS sand); the pass's limestone scree; Red Rock's red sand and slickrock; the trailer park's gravel; the golf course's dead
     fairway in its mowing stripes and a white bunker; the marina's lake bed cracked to the ring; the apron's slabs and
     tie-downs.
  3. THE LAY (plain python): the old sand is found by its colour family (the measure below) on the ground only (the houses,
     the shops and the rock masses are masked out by the rig's own ledgers: records/target/cook_floor_rig/blocks.json houses,
     slices/fight_ground/fight_stands.json outlines, and the block's '#'/'H' tiles where neither covers it); there the plate
     replaces the sand and the OLD PICTURE'S LIGHT stays (its shadows, its grime, its soot: the old pixel over the old ground's
     local light, smoothed past the sand's own grain), so the houses still throw their shadow on the new lawn and the grime
     still crosses every edge. Everything not sand is the old pixel, untouched: houses, roads, cars, junk, bags, rocks,
     shrubs, water, the futures' solar racks and scorch. The three futures (present, raided, reclaimed) take the same plate.

THE MEASURE: the old sand family in sRGB HSV: hue 22..52 deg, saturation 0.09..0.36, value 45..225 (darker sand to 0.06 sat);
the share of every block's picture and of the sheet's boards before and after.

ANALOG HORROR (rule 20), one per ground, nothing remarks on it: the suburb's one lawn still mown in fresh stripes; the canopy's
shadow lies on downtown with no canopy over it; the works' rails are polished bright; a line of bare footprints walks into the
wash and none walks out; the shore and the marina carry a second ring, far above the first, higher than the lake ever stood;
one perfect circle of bare caliche on the desert; a beast's prints walking out of the lab yard.

  python3 tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py --plans             (the plans, the masks, a debug sheet)
  <venv>/bin/python tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py --plates [name ...]   (the grounds through the rig)
  python3 tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py --lay [bid ...]     (into slices/fight_ground, lossy 76)
  python3 tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py --measure <before|after>
  venv: python3.11 -m venv v && v/bin/pip install bpy==4.2.0 numpy pillow scipy

REFERENCE CHECK (the 9/4 standing duty): the real grounds: Clark County tract yards after the 2008 foreclosures (dead bermuda,
the driveway to the curb), Fremont Street under the canopy, the Union Pacific spur and the yards off Industrial Rd, the Las
Vegas Wash's cobble bars, Lake Mead's bathtub ring and its cracked bed at Callville and Las Vegas Bay, the Mojave's desert
pavement and caliche with sand held in the creosote's coppice mound, the Spring Mountains' limestone, Calico Basin's Aztec
sandstone, the Boulder Hwy trailer parks' gravel pads, the Strip's pool decks and marble, Harry Reid's apron slabs and tie-downs.
No reference game.
REUSE CHECK (REUSE-FIRST): the floor tool's material language, build(), heights, stones, camera and blur; the master rig's
source pass, dents, light and film; the old pictures' own light; the old blocks are not re-modelled. No second renderer.
"""
import os, sys, json, math, time
import numpy as np
from PIL import Image, ImageDraw

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook_the_floor_through_the_rig_10_19_26 as F

SHIP = os.path.join(R, 'slices/fight_ground')
BASE = os.path.join(R, 'records/target/combat_maps_11_2c')
WORK = os.environ.get('CM2_WORK', '/tmp/claude-0/cm2')         # the plates and plans (big, regenerable, never committed)
W, H = 2575, 1820
PPM = F.PPM; VPM = H / 60.0                                       # px a metre across, px a metre up the picture
TW, TH = 515, 364
OV = 6.0                                                          # the plate's overrun, metres, crossfaded back over its start
PLATE_M = 30.0                                                    # a plate is a seamless 30 m field (two to a block, each block its own cut)
STATES = ('present', 'raided', 'reclaimed')

# ======================================================================================================================
# THE GROUNDS: the floor tool's material language (MATS), one spec a ground; 'cal' is the value multiplier the calibration
# would hold (the floor's grounds sit at 0.65 to 0.99 of their palette step)
# ======================================================================================================================
NEW = {
    # the suburb: bermuda dead in a foreclosure summer, grey-olive straw, never the sand's tan; two for the mower's stripes
    # KILL THE GREEN (COMBAT MAPS 3, rule 341(4), Paolo 11/3: 'you gave a bunch of greenery to the suburb, bro this is an economic
    # apocalypse'): the dead lawns and fairways were olive drab (metal_painted) and read green on his phone; a Vegas lawn with the
    # pumps off is grey-brown thatch in weeks (and AB 356 bans decorative turf water from 2027): clay_bone's dark step and grey
    'deadlawn':   dict(role=('clay_bone', 1), target=(122, 110, 92), h=0.05, alt=('tape_grey', 2), alt_amt=0.38, grit=0.6, speck=(28, 0.6), cal=1.0),
    'deadlawn_b': dict(role=('clay_bone', 1), target=(104, 95, 80), h=0.05, alt=('rubber', 3), alt_amt=0.25, grit=0.6, speck=(28, 0.6), cal=0.92),
    # the Strip: cracked marble slabs and the pool deck's tile
    'marble':     dict(role=('tape_grey', 4), target=(214, 212, 204), h=0.02, alt=('tape_grey', 3), alt_amt=0.3, grit=0.06, speck=(60, 0.08),
                       joints=dict(pitch=1.2, width=0.012), panel_var=0.08, cracks=dict(cell=0.8, width=0.006, region=0.5, cut=0.52, depth=0.4),
                       long_cracks=dict(cell=2.6, width=0.012), cal=0.92),
    'pooltile':   dict(role=('clay_teal', 4), target=(160, 196, 184), h=0.02, alt=('tape_grey', 4), alt_amt=0.35, grit=0.05, speck=(80, 0.06),
                       joints=dict(pitch=0.3, width=0.008), panel_var=0.09, cracks=dict(cell=0.7, width=0.007, region=0.4, cut=0.55, depth=0.4), cal=0.9),
    # the works: the slab black with oil, a rail spur on its ties and ballast, gravel
    'oilcrete':   dict(role=('tape_grey', 2), target=(150, 148, 141), h=0.1, alt=('rubber', 4), alt_amt=0.25, grit=0.1, speck=(70, 0.14),
                       joints=dict(pitch=4.5, width=0.02), panel_var=0.08, oil=dict(scale=0.45, cut=0.56, mul=0.34),
                       cracks=dict(cell=1.1, width=0.01, region=0.35, cut=0.55, depth=0.5), cal=0.92),
    'ballast':    dict(role=('tape_grey', 1), target=(98, 96, 93), h=0.12, alt=('rubber', 3), alt_amt=0.3, grit=0.7, speck=(40, 0.7), cal=0.95),
    'tie':        dict(role=('rubber', 3), target=(62, 56, 50), h=0.2, alt=('clay_rust', 1), alt_amt=0.35, grit=0.3, speck=(60, 0.25), cal=0.95),
    'rail':       dict(role=('chrome', 1), target=(170, 172, 174), h=0.3, alt=('clay_rust', 2), alt_amt=0.15, grit=0.1, speck=(80, 0.1), cal=0.85),
    'gravel':     dict(role=('tape_grey', 2), target=(140, 139, 133), h=0.04, alt=('tape_grey', 1), alt_amt=0.45, grit=0.62, speck=(55, 0.62), cal=0.85),
    # the wash: the bed's cobbles and its silt
    'cobble':     dict(role=('tape_grey', 2), target=(138, 136, 128), h=-0.12, alt=('clay_teal', 2), alt_amt=0.2, grit=0.4, speck=(50, 0.45), cal=0.8),
    'silt':       dict(role=('tape_grey', 3), target=(184, 182, 172), h=-0.15, alt=('clay_bone', 3), alt_amt=0.15, grit=0.12, speck=(80, 0.14),
                       mud=dict(cell=0.26, width=0.016, depth=0.6), cal=0.88),
    # the shore and the marina: the cracked mud and the bathtub ring
    'mud':        dict(role=('metal_painted', 2), target=(104, 104, 90), h=-0.1, alt=('rubber', 3), alt_amt=0.3, grit=0.2, speck=(60, 0.2),
                       mud=dict(cell=0.5, width=0.05, depth=1.2), cal=0.95),
    'ring':       dict(role=('tape_grey', 4), target=(222, 221, 214), h=0.02, alt=('tape_grey', 3), alt_amt=0.3, grit=0.35, speck=(60, 0.3),
                       mud=dict(cell=0.7, width=0.02, depth=0.4), cal=0.93),
    # the desert: the varnished pavement and the caliche crust
    'pavement':   dict(role=('metal_painted', 2), target=(111, 106, 95), h=0.03, alt=('clay_rust', 2), alt_amt=0.25, grit=0.55, speck=(45, 0.6), cal=0.95),
    'calcrete':   dict(role=('tape_grey', 3), target=(196, 194, 184), h=0.06, alt=('clay_bone', 3), alt_amt=0.18, grit=0.3, speck=(50, 0.3),
                       cracks=dict(cell=0.9, width=0.012, region=0.5, cut=0.45, depth=0.5), cal=0.92),
    # the pass: limestone scree
    'scree':      dict(role=('tape_grey', 2), target=(146, 145, 139), h=0.05, alt=('tape_grey', 3), alt_amt=0.3, grit=0.6, speck=(36, 0.6), cal=0.85),
    # Red Rock: the red sand and the slickrock
    'redsand':    dict(role=('clay_rust', 3), target=(174, 118, 84), h=0.03, alt=('clay_rust', 4), alt_amt=0.3, grit=0.45, speck=(40, 0.5), cal=0.92),
    'slickrock':  dict(role=('clay_rust', 2), target=(150, 82, 52), h=0.25, alt=('clay_rust', 3), alt_amt=0.45, grit=0.12, speck=(40, 0.15),
                       long_cracks=dict(cell=1.6, width=0.03), cracks=dict(cell=2.2, width=0.02, region=0.4, cut=0.4, depth=0.8), cal=1.0),
    # the landfill: the grey cover soil with the trash in it
    'coversoil':  dict(role=('tape_grey', 1), target=(104, 100, 94), h=0.04, alt=('clay_bone', 1), alt_amt=0.4, grit=0.5, speck=(45, 0.5), cal=0.98),
    # the golf course: the bunker's white sand, the dead fairway in two stripes
    'bunker':     dict(role=('tape_grey', 4), target=(212, 208, 196), h=-0.25, alt=('clay_bone', 4), alt_amt=0.3, grit=0.22, speck=(70, 0.22), cal=0.9),
    'fairway':    dict(role=('clay_bone', 1), target=(126, 114, 96), h=0.04, alt=('tape_grey', 2), alt_amt=0.4, grit=0.55, speck=(30, 0.55), cal=1.02),
    'fairway_b':  dict(role=('clay_bone', 1), target=(116, 106, 90), h=0.04, alt=('tape_grey', 2), alt_amt=0.3, grit=0.55, speck=(30, 0.55), cal=0.97),
    # the airport: the apron's slabs and the tie-down rings
    'apronslab':  dict(role=('tape_grey', 3), target=(178, 176, 168), h=0.1, alt=('tape_grey', 2), alt_amt=0.2, grit=0.08, speck=(70, 0.1),
                       joints=dict(pitch=6.0, width=0.025), panel_var=0.1, oil=dict(scale=0.7, cut=0.66, mul=0.5),
                       cracks=dict(cell=1.4, width=0.01, region=0.4, cut=0.6, depth=0.5), cal=0.88),
    'tiedown':    dict(role=('rubber', 2), target=(40, 38, 36), h=0.08, alt=('chrome', 0), alt_amt=0.2, grit=0.2, speck=(60, 0.2), cal=1.0),
    # the lab yard: sealed epoxy slab, the hazard hatching's yellow (the beasts came out of yards like this one)
    'epoxy':      dict(role=('tape_grey', 3), target=(176, 180, 176), h=0.1, alt=('clay_teal', 3), alt_amt=0.12, grit=0.05, speck=(80, 0.07),
                       joints=dict(pitch=3.0, width=0.012), panel_var=0.05, cracks=dict(cell=1.2, width=0.007, region=0.4, cut=0.62, depth=0.4), cal=0.9),
    'hazard':     dict(role=('clay_mustard', 3), target=(196, 158, 62), h=0.1, alt=('clay_mustard', 2), alt_amt=0.25, grit=0.12, speck=(60, 0.14),
                       wornthrough=dict(scale=3.0, cut=0.4, to=('tape_grey', 2)), cal=0.92),
    # downtown's ruin: broken ground with brick dust
    'rubbleg':    dict(role=('tape_grey', 1), target=(110, 102, 96), h=0.04, alt=('clay_rust', 2), alt_amt=0.35, grit=0.6, speck=(40, 0.6), cal=0.95),
}
NEW_STONES = {
    'deadlawn':  [(16.0, 0.04, 0.12, 'tuft'), (5.0, 0.04, 0.1, 'straw')], 'deadlawn_b': [(16.0, 0.04, 0.12, 'tuft'), (5.0, 0.04, 0.1, 'straw')],
    'fairway':   [(9.0, 0.04, 0.1, 'tuft'), (3.0, 0.04, 0.09, 'straw')], 'fairway_b': [(9.0, 0.04, 0.1, 'tuft'), (3.0, 0.04, 0.09, 'straw')],
    'marble':    [(0.25, 0.04, 0.12, 'marblechip')], 'pooltile': [(0.2, 0.03, 0.08, 'tileshard')],
    'oilcrete':  [(0.3, 0.04, 0.14, 'rubble')], 'ballast': [(14.0, 0.03, 0.07, 'ballast')], 'gravel': [(10.0, 0.02, 0.05, 'gravel')],
    'cobble':    [(3.0, 0.08, 0.32, 'cobble'), (1.2, 0.08, 0.26, 'cobble_r'), (8.0, 0.03, 0.07, 'gravel')],
    'silt':      [(0.15, 0.06, 0.18, 'cobble')],
    'mud':       [(0.08, 0.05, 0.15, 'cobble')], 'ring': [(0.6, 0.02, 0.06, 'shell')],
    'pavement':  [(12.0, 0.02, 0.06, 'varnish'), (1.0, 0.06, 0.16, 'varnish')], 'calcrete': [(1.0, 0.03, 0.08, 'varnish')],
    'scree':     [(9.0, 0.03, 0.09, 'lime'), (1.2, 0.08, 0.3, 'lime')],
    'redsand':   [(1.2, 0.04, 0.12, 'redrock')], 'slickrock': [(0.3, 0.06, 0.2, 'redrock')],
    'coversoil': [(3.0, 0.04, 0.14, 'trash_w'), (2.0, 0.04, 0.12, 'trash_t'), (1.5, 0.04, 0.12, 'trash_r'), (2.0, 0.04, 0.16, 'rubble')],
    'epoxy':     [(0.08, 0.03, 0.07, 'gravel')],
    'bunker':    [(0.1, 0.03, 0.06, 'pebble')], 'apronslab': [(0.15, 0.03, 0.08, 'gravel')],
    'rubbleg':   [(3.0, 0.06, 0.3, 'rubble'), (1.4, 0.06, 0.2, 'brick')],
}
NEW_STONE_MATS = {'tuft': ('clay_bone', 0), 'straw': ('clay_mustard', 2), 'marblechip': ('tape_grey', 4), 'tileshard': ('clay_teal', 3), 'ballast': ('tape_grey', 1),
                  'cobble': ('tape_grey', 2), 'cobble_r': ('clay_rust', 2), 'shell': ('tape_grey', 4), 'varnish': ('rubber', 3),
                  'lime': ('tape_grey', 3), 'redrock': ('clay_rust', 2), 'trash_w': ('tape_grey', 4), 'trash_t': ('clay_teal', 3),
                  'trash_r': ('clay_rust', 3)}
PLATES = ['asphalt', 'paint', 'concrete'] + list(NEW)


def ids():
    """the floor tool's ids, then the new grounds (the plate files are named by ground, never by number)"""
    names = list(F.IDS) + [n for n in NEW if n not in F.IDS]
    return {n: i for i, n in enumerate(names)}, names


ID, NAMES = ids()


# ======================================================================================================================
# THE RIG SIDE (Blender's python): one plate a ground
# ======================================================================================================================
def install():
    for n, spec in NEW.items():
        F.MATS[n] = {k: v for k, v in spec.items() if k != 'cal'}
    F.STONES.update(NEW_STONES); F.STONE_MATS.update(NEW_STONE_MATS)
    F.IDS[:] = NAMES; F.ID.clear(); F.ID.update(ID)
    cal0 = F.cal_mul
    def cal_mul():
        d = dict(cal0()); d.update({n: s['cal'] for n, s in NEW.items()}); return d
    F.cal_mul = cal_mul


def render_plate(name, samples=16):
    import bpy
    install()
    side = PLATE_M + OV / 2
    W2 = int(round(side * PPM)); H2 = int(round(W2 * H / W))
    WT, HT = int(round(PLATE_M * PPM)), int(round(PLATE_M * PPM * H / W))
    F.SIDE, F.W, F.H = side, W2, H2                                  # STEP is the same two pixels: 2 * side / W2
    t0 = time.time()
    bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
    gid = np.full((H2, W2), ID[name], np.uint8)
    objs, g = F.build(bpy, gid, 1102 + sum(map(ord, name)))
    F.scene(bpy, objs)
    F.RIG.light_and_film(sc, dict(sun_rot=list(F.RIG.G['sun_rot_deg']))); sc.render.film_transparent = False
    F.camera(bpy, sc)
    sc.cycles.samples = samples; sc.cycles.use_adaptive_sampling = True; sc.cycles.adaptive_threshold = 0.02
    sc.cycles.max_bounces = 2; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 0; sc.cycles.transmission_bounces = 0
    os.makedirs(os.path.join(WORK, 'plates'), exist_ok=True)
    fn = os.path.join(WORK, 'plates', 'raw_%s.png' % name); sc.render.filepath = fn
    bpy.ops.render.render(write_still=True)
    a = np.asarray(Image.open(fn).convert('RGB')).astype(np.float32)
    # seamless both ways (the kit's own crossfade): the overrun laid back over the start
    ox, oy = W2 - WT, H2 - HT
    wx = np.linspace(0, 1, ox, dtype=np.float32); wy = np.linspace(0, 1, oy, dtype=np.float32)
    b = a[:, :WT].copy(); b[:, :ox] = a[:, WT:WT + ox] * (1 - wx)[None, :, None] + a[:, :ox] * wx[None, :, None]
    c = b[:HT].copy(); c[:oy] = b[HT:HT + oy] * (1 - wy)[:, None, None] + b[:oy] * wy[:, None, None]
    Image.fromarray(c.round().clip(0, 255).astype(np.uint8)).save(os.path.join(WORK, 'plates', '%s.png' % name))
    led = os.path.join(BASE, 'plates.json'); L = json.load(open(led)) if os.path.exists(led) else {}
    L[name] = dict(seconds=round(time.time() - t0), samples=samples, metres=side, px=[W2, H2], mean=[round(float(v), 1) for v in c.reshape(-1, 3).mean(0)])
    os.makedirs(BASE, exist_ok=True); json.dump(L, open(led, 'w'), indent=1)
    print('  plate', name, round(time.time() - t0), 's', L[name]['mean'], flush=True)


# ======================================================================================================================
# THE BOARD SIDE (plain python)
# ======================================================================================================================
CODE = {'flat': '.', 'rough': 'r', 'debris': 'd', 'water': 'w', 'height': 'H', 'blocked': '#'}
UNCODE = {v: k for k, v in CODE.items()}


def manifest():
    return json.load(open(os.path.join(SHIP, 'fight_ground.json')))


def block_tiles(G=None):
    G = G or manifest(); T = {}
    for B in G['boards'].values():
        for by, row in enumerate(B['blocks']):
            for bx, bid in enumerate(row):
                if bid in T or '|' in bid: continue
                T[bid] = [''.join(CODE[B['terrain'][by * 5 + r][bx * 5 + c]] for c in range(5)) for r in range(5)]
    return T


def blocks():
    return sorted(set(manifest()['blocks']) | {'lab.0'})


def file_of(bid, state):
    return 'block_%s%s.webp' % (bid.replace('.', '_'), '' if state == 'present' else '_' + state)


def hsv(a):
    a = a.astype(np.float32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1); mn = a.min(-1); d = mx - mn + 1e-6
    hue = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return hue, (mx - mn) / np.maximum(mx, 1), mx


def sand_family(a):
    """THE MEASURE: the old yellow-brown sand ground (the floor's caliche, desert, rough, track and playa; his 'yellow brown
    sand dirt'), by colour: hue 22..52, saturation 0.09..0.36 (0.06 in the shade), value 45..225"""
    hu, s, v = hsv(a)
    lit = (v >= 130) & (s >= 0.09); dim = (v < 130) & (v >= 45) & (s >= 0.12); dark = (v < 45) & (v >= 28) & (s >= 0.18)
    return (hu >= 22) & (hu <= 52) & (v <= 225) & (s <= 0.38) & (lit | dim | dark)


def old_sand(a):
    """THE MEASURE ON HIS SCREEN: the old sand ground as he sees it lit (the shade of a house is not the ground's colour):
    hue 22..52, saturation 0.09..0.36, value 120..225"""
    hu, s, v = hsv(a)
    return (hu >= 22) & (hu <= 52) & (v >= 120) & (v <= 225) & (s >= 0.09) & (s <= 0.36)


def grey_family(a):
    hu, s, v = hsv(a)
    return (s < 0.09) & (v >= 60)


def blur(a, px):
    return F.blur(a.astype(np.float32), px) if px > 0 else a.astype(np.float32)


def nblur(v, m, px):
    """the mean of v over the mask m, px wide (normalised convolution)"""
    m = m.astype(np.float32)
    return blur(v * m, px) / np.maximum(blur(m, px), 1e-4)


def poly_mask(polys):
    im = Image.new('L', (W, H), 0); d = ImageDraw.Draw(im)
    for p in polys:
        if len(p) >= 3: d.polygon([tuple(map(float, q)) for q in p], fill=255)
    return np.asarray(im) > 0


HOUSE_LEDGER = json.load(open(os.path.join(R, 'records/target/cook_floor_rig/blocks.json')))
STANDS = json.load(open(os.path.join(SHIP, 'fight_stands.json')))['pictures']
SPILL = {'ruin': 3.0, 'apron': 2.0}                               # metres a mass rises over its tile (where nothing traced it)
ONLY = {'pass': [(1, 3, 0.36, 0.3, -30)], 'golf': [(4, 1, 0.5, 0.62, -40), (2, 3, 0.42, 0.55, -40)]}   # (col, row, half-width and half-height in tiles, lift px)                                         # the one tan mass a block has (the pass's box truck), its tile alone


def things_mask(bid, tiles):
    """what is NOT the floor: the houses (the rig's ledger: each roof's top edge down to its lot), the buildings' traced outlines
    (the fight's layers), and the masses of the blocks neither covers (their '#' and 'H' tiles and how far they rise)"""
    kind = bid.split('.')[0]; polys = []; bid = SRC.get(bid, bid)
    traced = STANDS.get(file_of(bid, 'present'), [])
    for h in ([] if traced else HOUSE_LEDGER.get(bid, {}).get('houses') or []):   # the lot box only where nothing is traced
        x0, y0, x1, y1 = h['old_px']; top = h.get('top') or [[x0, y0], [x1, y0]]
        polys.append([(x0 - 4, top[0][1] - 6)] + [(x, y - 6) for x, y in top] + [(x1 + 4, top[-1][1] - 6), (x1 + 4, y1 + 4), (x0 - 4, y1 + 4)])
    for e in traced:
        p = e['poly']; ln = e['line']
        polys.append([(p[0][0], p[0][1] - 4)] + [(x, y - 4) for x, y in p] + [(p[-1][0], p[-1][1] - 4), (p[-1][0], ln + 6), (p[0][0], ln + 6)])
    m = poly_mask(polys)
    if kind in SPILL:
        for r in range(5):
            for c in range(5):
                ch = tiles[r][c]
                if ch in '#H':
                    up = int(SPILL[kind] * VPM)
                    m[max(0, r * TH - up):(r + 1) * TH, c * TW:(c + 1) * TW] = True
    for (c, r, aw, ah, lift) in ONLY.get(kind, []):
        cx, cy = (c + 0.5) * TW, (r + 0.5) * TH + lift
        yy, xx = np.ogrid[0:H, 0:W]
        m |= (np.abs(xx - cx) < TW * aw) & (np.abs(yy - cy) < TH * ah)
    if kind == 'strip': m[:int(TH * 1.12), :] = True
    return m


def big(mask, px=14, share=0.55):
    """a mask's broad parts only (a road, a lot), never a lone dark shrub"""
    return blur(mask.astype(np.float32), px) > share


def families(a, bid, things):
    """what the plate replaces, one family at a time (each keeps its own light): the old sand everywhere but the casino; on the
    Strip its parking lots too (the drive stays asphalt); on the apron its old slabs. On the desert the sand stays in the
    coppice mound around each creosote (the real ground there IS sand: the shrub holds what the wind brings)"""
    kind = bid.split('.')[0]
    if kind == 'casino': return []
    sand = sand_family(a) & ~things
    fams = [sand]
    if kind == 'strip':                                               # the lots, whole: the asphalt, its stalls, its cracks
        from scipy import ndimage
        hu, s_, v = hsv(a)
        dark = (v < 125) & (s_ < 0.2) & ~things
        lots = ndimage.binary_fill_holes(big(dark, 10, 0.5)) & ((YM > 36.0) | (YM < 23.6)) & ~things
        fams.append(lots & ~sand)
    if kind == 'apron':
        fams.append(grey_family(a) & (hsv(a)[2] > 120) & ~things & ~sand)
    if kind in ('golf', 'subs', 'corner', 'culdesac', 'suburb_stem', 'lots'):   # KILL THE GREEN (COMBAT MAPS 3, rule 341(4)): the old green
        b = a.astype(np.int32); mx = b.max(-1); mn = b.min(-1)        # 'lawn' dies with the fairway (no water reaches it)
        green = (b[..., 1] >= b[..., 0] - 4) & (b[..., 1] > b[..., 2] + 18) & ((mx - mn) / np.maximum(mx, 1) > 0.15)
        fams.append((blur(green.astype(np.float32), 2.0) > 0.06) & ~things & ~sand)   # its edge too (a ring of it survived the first lay)
    return fams


MOUND_KINDS = ('scrub', 'scrubroad', 'wash', 'freeway', 'freewayo', 'golf', 'trailer')


def mound(a, things):
    """the coppice mound: the old sand held under each creosote, 1 at the shrub, gone 0.55 m out (soft, never a drawn ring)"""
    from scipy import ndimage
    hu, s_, v = hsv(a)
    shrub = blur(((v < 92) & ~grey_family(a) & ~things).astype(np.float32), 1.5) > 0.35
    d = ndimage.distance_transform_edt(~shrub) / PPM
    return np.clip(1.0 - d / 0.55, 0, 1) * (d > 0)


def replace_mask(a, bid, tiles, things):
    f = families(a, bid, things)
    return np.logical_or.reduce(f) if f else np.zeros(a.shape[:2], bool)


# ---- THE PLANS: a ground id per pixel, per block -----------------------------------------------------------------------
def grid():
    yy, xx = np.mgrid[0:H, 0:W]
    return (xx + 0.5) / PPM, 60.0 * (1 - (yy + 0.5) / H)           # x east, y north, metres


XM, YM = grid()


def vn(cell_m, rng):
    return F.vnoise((H, W), cell_m * PPM, rng) + 0.5                  # 0..1


def streak(rng, along_m, across_m):
    """noise drawn long along x (the flow, the wind), 0..1"""
    small = F.vnoise((H, max(8, int(W * across_m / along_m))), across_m * PPM, rng) + 0.5
    return np.asarray(Image.fromarray(small.astype(np.float32), mode='F').resize((W, H), Image.BICUBIC))


def stripes(axis_m, width_m, phase=0.0):
    return ((axis_m + phase) // width_m).astype(int) % 2 == 1


def dist_to(mask, cap_px=600):
    """distance in picture pixels to the mask (a coarse chamfer pass on a quarter grid, enough for bands of metres)"""
    from scipy import ndimage
    return ndimage.distance_transform_edt(~mask)


def plan(bid, a, things, tiles):
    kind = bid.split('.')[0]
    rng = np.random.RandomState(1102 + sum(map(ord, bid)))
    n1 = vn(3.0, rng); n2 = vn(0.8, rng); n3 = vn(9.0, rng)
    g = np.full((H, W), ID['pavement'], np.uint8)
    S = lambda name, sel: g.__setitem__(sel, ID[name])
    roadish = grey_family(a) & ~things
    notes = []
    if kind in ('subs', 'corner', 'culdesac', 'suburb_stem', 'lots'):
        S('deadlawn', np.ones((H, W), bool))
        S('deadlawn_b', n3 > 0.72)                                         # where the sprinkler reached longest: a broad darker patch
        # (COMBAT MAPS 3: the small caliche blotches read as camouflage on the dead brown lawn, his 10/19 NO: gone; the lawn is one
        # dead thatch with broad patches)
        houses = HOUSE_LEDGER.get(SRC.get(bid, bid), {}).get('houses') or []
        mown = rng.randint(len(houses)) if houses else -1
        px_, py_ = XM * PPM, (60 - YM) * VPM
        rows_ = {}
        for h in houses: rows_.setdefault(h['old_px'][1] < H / 2, []).append(h)
        for north, hs in rows_.items():                                    # the lot lines: a gravel strip between two yards
            hs = sorted(hs, key=lambda h: h['old_px'][0])
            for h0, h1 in zip(hs, hs[1:]):
                xl = (h0['old_px'][2] + h1['old_px'][0]) / 2
                band = (np.abs(px_ - xl) < 0.3 * PPM) & ((py_ < h0['old_px'][1] + 40) if north else (py_ > h0['old_px'][3] - 40))
                S('gravel', band)
        for k, h in enumerate(houses):
            x0, y0, x1, y1 = h['old_px']; north = y0 < H / 2
            topy = min(t[1] for t in h['top']) if h.get('top') else y0
            if north:                                                      # the patio slab behind the house
                cx = (x0 + x1) / 2 + (rng.rand() - 0.5) * 80
                S('concrete', (np.abs(px_ - cx) < 2.4 * PPM) & (py_ < topy + 6) & (py_ > topy - 3.2 * VPM))
            if k == mown:                                                  # the one lawn still mown in fresh stripes (analog horror)
                yard = (px_ > x0 - 40) & (px_ < x1 + 40) & ((py_ > y1) & (py_ < y1 + 330) if not north else (py_ < topy - 3.4 * VPM) & (py_ > topy - 11 * VPM))
                S('deadlawn_b', yard & stripes(XM, 0.9)); S('deadlawn', yard & ~stripes(XM, 0.9))
            # the driveway: 5.5 m of concrete from the garage end to the street, whichever way reaches the road
            gx0 = x1 - int(6.2 * PPM) if k % 2 == 0 else x0 + int(0.7 * PPM); gx1 = gx0 + int(5.5 * PPM)
            col = big(roadish, 6)[:, max(0, (gx0 + gx1) // 2)]
            down = np.argmax(col[y1:]) if col[y1:].any() else 10 ** 6
            up = np.argmax(col[:topy][::-1]) if col[:topy].any() else 10 ** 6
            if down < TH * 1.6 and down <= up: S('concrete', (px_ >= gx0) & (px_ < gx1) & (py_ >= y1 - 30) & (py_ < y1 + down + 4))
            elif up < TH * 1.6: S('concrete', (px_ >= gx0) & (px_ < gx1) & (py_ < topy + 30) & (py_ >= topy - up - 4))
        if kind == 'lots':                                                 # the vacant lot: the slabs of the houses never built
            for (cx, cy) in [(8, 48), (22, 47), (38, 49), (52, 47), (9, 12), (24, 11), (40, 13), (53, 12)]:
                S('concrete', (np.abs(XM - cx) < 5.0) & (np.abs(YM - cy) < 4.0) & (n2 < 0.75))

        notes.append('dead lawn yard by yard, gravel lot lines, a patio slab, the yards\' dirt where it gave out, driveways to the street, one lawn mown')
    elif kind == 'strip':
        S('marble', np.ones((H, W), bool))                                # the plaza at the doors and the old north lot
        S('pooltile', YM < 23.6)                                          # the south lots: the pool deck
        S('concrete', (YM < 23.6) & (YM > 22.4))                          # the deck's coping along the drive
        S('pooltile', (YM >= 36.0) & (YM < 37.2) & ((XM % 2.4) < 1.2))     # the inlay band at the plaza's edge
        notes.append('the lots taken up: cracked marble at the doors, the pool deck\'s tile to the south')
    elif kind in ('main', 'ruin'):
        S('asphalt', np.ones((H, W), bool))
        lines = (np.abs(((XM + 1.5) % 3.0) - 1.5) < 0.06) & (((YM % 30) > 3) & ((YM % 30) < 8.5) | ((YM % 30) > 21) & ((YM % 30) < 26.5))
        S('paint', lines)                                                  # the stalls of the old lots
        S('concrete', (np.abs(YM - 41.2) < 0.9) | (np.abs(YM - 17.2) < 0.9) | (np.abs(YM - 36.0) < 0.75) | (np.abs(YM - 24.0) < 0.75))
        if kind == 'ruin':                                                 # the rubble where the tiles say debris, its edge broken
            wob = (n2 - 0.5) * 3.0
            for r in range(5):
                for c in range(5):
                    if tiles[r][c] == 'd':
                        S('rubbleg', (np.abs(XM - (c + 0.5) * 12) < 6.6 + wob) & (np.abs(YM - (60 - (r + 0.5) * 12)) < 6.4 + wob))
            notes.append('broken asphalt and brick dust, the old stalls under the rubble')
        else: notes.append('asphalt lots, the painted stalls, walks at the shopfronts, the canopy\'s shadow')
    elif kind == 'works':
        S('oilcrete', np.ones((H, W), bool))
        S('gravel', (YM < 10.5))
        spur = np.abs(YM - 5.5) < 1.6                                       # the spur along the south fence: ballast, ties, rails
        S('ballast', spur)
        S('tie', spur & (np.abs(YM - 5.5) < 1.3) & ((XM % 0.6) < 0.23))
        for rx in (5.5 - 0.7175, 5.5 + 0.7175): S('rail', np.abs(YM - rx) < 0.04)
        notes.append('the slab black with oil, gravel, a rail spur on ties and ballast (its rails polished)')
    elif kind == 'wash':
        # the bed IS the block: grey cobbles end to end, the silt left in long bars that lie along the flow (never blobs)
        S('cobble', np.ones((H, W), bool))
        wob = (n2 - 0.5) * 3.0                                             # the tiles stay true: a flat tile is the smooth silt,
        for r in range(5):                                                 # a rough one the cobbles (BB's flat 2 AP, rough 3 AP)
            for c in range(5):
                tx, ty = (c + 0.5) * 12, 60 - (r + 0.5) * 12
                if tiles[r][c] == '.': S('silt', ((XM - tx) / 6.4) ** 2 + ((YM - ty) / 5.4) ** 2 < 0.9 + wob * 0.25)
                elif tiles[r][c] == 'r': S('cobble', ((XM - tx) / 4.6) ** 2 + ((YM - ty) / 4.0) ** 2 < 1)
        notes.append('the dry bed: cobbles end to end, pale silt in long bars along the flow, footprints in the silt')
    elif kind in ('scrub', 'scrubroad', 'freeway', 'freewayo', 'pass'):
        base = 'scree' if kind == 'pass' else 'pavement'
        S(base, np.ones((H, W), bool))
        fleck = vn(0.9, rng)
        S('calcrete', (fleck > 0.84) & (n2 > 0.5))                         # the crust showing through in flecks, never a field
        if kind in ('freeway', 'freewayo', 'scrubroad', 'pass'):
            road = big(grey_family(a) & (hsv(a)[2] < 120), 14, 0.6)
            S('gravel', (dist_to(road) < 3.2 * PPM) & ~road)
        cx, cy = 10 + 40 * rng.rand(), 10 + 40 * rng.rand()
        if kind != 'pass': S('calcrete', np.hypot(XM - cx, (YM - cy)) < 1.6)   # the one bare circle
        notes.append('limestone scree, the road\'s gravel shoulders' if kind == 'pass' else 'varnished desert pavement, caliche showing through, the sand only in each creosote\'s mound')
    elif kind == 'shore':
        water = (hsv(a)[0] > 120) & (hsv(a)[0] < 220) & (hsv(a)[2] < 140)
        from scipy import ndimage
        water = ndimage.binary_opening(water, iterations=3)
        d = dist_to(water) / VPM
        S('pavement', np.ones((H, W), bool))
        S('mud', d < 18 + 2.5 * n1); S('silt', (d >= 9 + 2 * n2) & (d < 14 + 2 * n1) & (n2 > 0.45))
        S('ring', (np.abs(d - (19.5 + 1.2 * n3)) < 0.7)); S('ring', (np.abs(d - (31 + 1.0 * n3)) < 0.35))
        notes.append('cracked mud to the bathtub ring, a second ring higher than the lake ever stood')
    elif kind == 'landfill':
        S('coversoil', np.ones((H, W), bool)); S('gravel', (np.abs(YM - 6 - 2 * np.sin(XM / 7)) < 2.2))
        notes.append('the grey cover soil with the trash working up through it, a gravel haul road')
    elif kind == 'canyon':
        S('redsand', np.ones((H, W), bool)); sheets = streak(rng, 9.0, 2.0)
        for r in range(5):
            for c in range(5):
                if tiles[r][c] in 'rH':                                    # cross-bedded sheets, long and broken, never a square
                    near = ((XM - (c + 0.5) * 12) / 7.0) ** 2 + ((YM - (60 - (r + 0.5) * 12)) / 6.0) ** 2 < 1 + (n2 - 0.5)
                    S('slickrock', near & (sheets > 0.5))
        notes.append('red sand and red slickrock')
    elif kind == 'trailer':
        S('gravel', np.ones((H, W), bool))
        notes.append('gravel lots and pads')
    elif kind == 'golf':
        S('fairway', np.ones((H, W), bool)); S('fairway_b', stripes(XM, 4.0))
        bunk = ((XM - 18) / 5.2) ** 2 + ((YM - 42) / 4.3) ** 2 < 1.0 + 0.2 * n2
        S('bunker', bunk)
        notes.append('the dead fairway in its mowing stripes, a white bunker')
    elif kind == 'marina':
        S('mud', np.ones((H, W), bool))
        S('ring', np.abs(YM - (34.0 + 0.8 * n3)) < 0.9); S('ring', np.abs(YM - (45.5 + 0.6 * n3)) < 0.35)
        S('silt', (YM < 14) & (streak(rng, 6.0, 3.0) > 0.62))
        notes.append('the lake bed cracked, the bathtub ring and a second ring above it')
    elif kind == 'lab':
        S('epoxy', np.ones((H, W), bool))
        hatch = ((XM + YM) % 1.2) < 0.6
        for (y0, y1) in ((35.0, 36.4), (22.6, 24.0)):                       # the hazard bands along the loading fronts
            S('hazard', (YM >= y0) & (YM < y1) & hatch); S('tiedown', (YM >= y0) & (YM < y1) & ~hatch)
        pad = (np.abs(XM - 30.0) < 4.5) & (np.abs(YM - 29.8) < 3.0)         # the decontamination pad in the lane, its drains
        S('hazard', pad & ~((np.abs(XM - 30.0) < 4.1) & (np.abs(YM - 29.8) < 2.6)))
        for gx in np.arange(4.0, 60, 8.0):
            S('tiedown', (np.abs(XM - gx) < 0.3) & (np.abs(YM - 29.8) < 0.18) & ((((XM - gx) * 10) % 1.0) < 0.6))
        S('paint', (np.abs(YM - 12.0) < 0.06) | (np.abs(YM - 48.0) < 0.06))
        notes.append('sealed epoxy, hazard hatching at the docks, a decon pad and its drains, a beast\'s prints walking out')
    elif kind == 'apron':
        S('apronslab', np.ones((H, W), bool))
        tie = np.zeros((H, W), bool)
        for cx in np.arange(3.0, 60, 6.0):
            for cy in np.arange(3.0, 60, 6.0):
                rr = np.hypot(XM - cx, (YM - cy))
                tie |= (rr < 0.16) & (rr > 0.07)
        S('tiedown', tie)
        notes.append('the apron\'s slabs and a tie-down ring in each, oil where the aircraft stood')
    return g, notes


def canopy_shadow(rng):
    """Fremont's canopy throws its lattice on the street; here it falls with no canopy over it (analog horror)"""
    u = XM / 3.0; v = (YM + 0.4 * np.sin(XM / 9.0)) / 3.0                 # the vault's frame, 3 m bays, sagging with the arch
    line = (np.abs((u % 1.0) - 0.5) > 0.45) | (np.abs((v % 1.0) - 0.5) > 0.45)
    return blur(np.where(line, 0.8, 0.95).astype(np.float32), 1.2)


def footprints(rng, g):
    """bare feet into the wash, none coming out"""
    m = np.zeros((H, W), bool)
    silt = np.argwhere(g[::20, ::20] == ID['silt'])
    if not len(silt): return m
    y0, x0 = silt[rng.randint(len(silt))] * 20
    ang = rng.uniform(0, 2 * np.pi); sx, sy = x0 / PPM, 60 - y0 / VPM
    for k in range(14):
        px = sx + math.cos(ang) * 0.7 * k + (0.12 if k % 2 else -0.12) * math.sin(ang)
        py = sy + math.sin(ang) * 0.7 * k - (0.12 if k % 2 else -0.12) * math.cos(ang)
        m |= (((XM - px) / 0.13) ** 2 + ((YM - py) / 0.2) ** 2) < 1
    return m


def pawprints(rng):
    """something big walked out of the lab yard: a short-faced bear's stride (1.6 m), four toes and a pad, out through the gate"""
    m = np.zeros((H, W), bool)
    for k in range(9):
        px, py = 6.0 + 6.2 * k + (0.5 if k % 2 else -0.5), 52.0 - 4.8 * k + (0.35 if k % 2 else -0.35)
        m |= (((XM - px) / 0.2) ** 2 + ((YM - py) / 0.17) ** 2) < 1
        for t in range(4):
            a_ = -0.9 + 0.6 * t
            m |= (((XM - px - 0.27 * math.sin(a_)) / 0.06) ** 2 + ((YM - py - 0.24 * math.cos(a_)) / 0.07) ** 2) < 1
    return m


PLATE_CACHE = {}
KEEP_OF = {}


def plate(name):
    """the plate, brought to its ground's target colour (the floor tool's calibration, here a gain on the rendered field: the
    rig's dust and drift lift every ground toward the same pale tan, and a ground that drifts back into the sand's colour is
    the thing he voted NO)"""
    if name not in PLATE_CACHE:
        a = np.asarray(Image.open(os.path.join(WORK, 'plates', '%s.png' % name)).convert('RGB')).astype(np.float32)
        if a.shape[0] < H or a.shape[1] < W:
            a = np.tile(a, (H // a.shape[0] + 1, W // a.shape[1] + 1, 1))[:H, :W]
        tgt = np.array((NEW.get(name) or F.MATS[name])['target'], np.float32)
        gain = np.clip(tgt / np.maximum(a.reshape(-1, 3).mean(0), 1), 0.55, 1.6)
        PLATE_CACHE[name] = a * gain
    return PLATE_CACHE[name]


def compose_plate(bid, g):
    rng = np.random.RandomState(77 + sum(map(ord, bid)))
    dy, dx = rng.randint(0, H), rng.randint(0, W)                   # each block its own cut of the seamless plates
    out = np.zeros((H, W, 3), np.float32)
    KEEP_OF[bid] = np.zeros((H, W), bool)
    for k in np.unique(g):
        name = NAMES[k]; sel = g == k
        if name not in PLATES:                                    # the floor's own grounds (the yards' caliche): the old pixel stays
            KEEP_OF[bid] |= sel; continue
        p = np.roll(plate(name), (dy, dx), (0, 1))
        out[sel] = p[sel]
    # where two grounds meet the higher one's edge throws a hair of shadow to the south-east (the sun from the upper left)
    hgt = np.zeros((H, W), np.float32)
    for k in np.unique(g):
        n = NAMES[k]; hgt[g == k] = (NEW.get(n) or F.MATS.get(n, {})).get('h', 0.0)
    step = hgt - np.roll(np.roll(hgt, 2, 0), 2, 1)
    out *= np.clip(1.0 + np.clip(step, -0.3, 0) * 1.4, 0.6, 1.0)[..., None]
    return out


def lay(bid, a, things, g, extra_shade=None):
    """the plate where the sand was, under the old picture's own light (each family its own: an old lot's asphalt is darker
    than the old sand, and neither's colour comes along, only its light)"""
    fams = [f & ~KEEP_OF[bid] for f in families(a, bid, things)]
    m = np.logical_or.reduce(fams) if fams else np.zeros(a.shape[:2], bool)
    if not m.any(): return a, m
    L = a.astype(np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)
    shade = np.ones((H, W), np.float32)
    for i, fm in enumerate(fams):
        if fm.sum() < 500: continue
        old_lot = i > 0                                              # an old lot: its stalls and cracks must not print through
        fine = nblur(L, fm, 6.0 if old_lot else 2.6)                 # past the sand's grain (its specks are a pixel)
        broad = nblur(L, fm, 140)
        med = float(np.median(L[fm]))
        broad = np.where(blur(fm.astype(np.float32), 140) > 0.02, broad, med)
        sh = np.clip(fine / np.maximum(broad, 1), 0.12, 1.02 if old_lot else 1.3) * np.clip(broad / med, 0.75, 1.15)   # a grime field, a soot plume kept
        near = blur(fm.astype(np.float32), 1.5) > 0.05
        shade = np.where(near, sh, shade)
    q = PLATES_OF[bid] * shade[..., None]
    al = np.clip(blur(m.astype(np.float32), 0.8) * 1.25, 0, 1) * m.astype(np.float32)
    al = np.maximum(al, blur(m.astype(np.float32), 0.8) * 0.6)
    if bid.split('.')[0] in MOUND_KINDS: al = al * (1 - 0.85 * mound(a, things))
    out = a.astype(np.float32) * (1 - al[..., None]) + q * al[..., None]
    if extra_shade is not None:                                      # the canopy's shadow on all the street's ground, old road too
        ground = (m | grey_family(a)) & ~things
        out = np.where(blur(ground.astype(np.float32), 0.8)[..., None] > 0.5, out * extra_shade[..., None], out)
    return out.round().clip(0, 255).astype(np.uint8), m


TILES = block_tiles()
SRC = {'lab.0': 'works.0'}                       # THE LAB YARD: its own ground on the works' sheds (its own buildings are next)
TILES.setdefault('lab.0', TILES['works.0'])
PLATES_OF = {}


def orig_path(bid, state):
    """the pictures as they stood before this round (kept beside the work, so a re-lay never lays on its own output)"""
    bid = SRC.get(bid, bid)
    p = os.path.join(WORK, 'orig', file_of(bid, state))
    if not os.path.exists(p):
        os.makedirs(os.path.dirname(p), exist_ok=True)
        import shutil; shutil.copy(os.path.join(SHIP, file_of(bid, state)), p)
    return p


def do_block(bid, write=True, states=STATES):
    kind = bid.split('.')[0]
    a0 = np.asarray(Image.open(orig_path(bid, 'present')).convert('RGB'))
    things = things_mask(bid, TILES[bid])
    g, notes = plan(bid, a0, things, TILES[bid])
    rng = np.random.RandomState(5 + sum(map(ord, bid)))
    if kind == 'wash': g[footprints(rng, g)] = ID['mud']
    if kind == 'lab': g[pawprints(rng)] = ID['mud']
    PLATES_OF[bid] = compose_plate(bid, g)
    extra = canopy_shadow(rng) if kind == 'main' else None
    res = {}
    for st in states:
        a = np.asarray(Image.open(orig_path(bid, st)).convert('RGB'))
        out, m = lay(bid, a, things, g, extra)
        res[st] = dict(before=round(float(old_sand(a).mean()), 4), after=round(float(old_sand(out).mean()), 4), laid=round(float(m.mean()), 4))
        if write and m.any():                                         # a block with nothing laid (the casino) is never re-encoded
            Image.fromarray(out).save(os.path.join(SHIP, file_of(bid, st)), quality=76, method=6)
        else:
            os.makedirs(os.path.join(WORK, 'look'), exist_ok=True)
            Image.fromarray(out).save(os.path.join(WORK, 'look', file_of(bid, st).replace('.webp', '.png')))
    grounds = {NAMES[k]: round(float((g == k).mean()), 3) for k in np.unique(g)}
    PLATES_OF.pop(bid, None)
    return dict(states=res, grounds=grounds, notes=notes)


def data():
    """THE LAB YARD into the fight: block lab.0 (its own ground on the works' sheds: the same tiles, cover, lamps, roofs and
    layers as works.0, since the buildings are the same), its named board (the library is read off the named boards) and its
    futures; the pack manifest names every picture this round laid"""
    p = os.path.join(SHIP, 'fight_ground.json'); G = json.load(open(p))
    span = 60.0; src_board, sby, sbx = 'strip', 2, 1
    B = G['boards'][src_board]; assert B['blocks'][sby][sbx] == 'works.0'
    x0, y0 = sbx * span, sby * span
    def local(lst, key_block=False):
        out = []
        for c in lst:
            inb = (c.get('block') == [sby, sbx]) if key_block else (x0 <= c['x_m'] < x0 + span and y0 <= c['y_m'] < y0 + span)
            if inb: out.append(dict(c, x_m=round(c['x_m'] - x0, 2), y_m=round(c['y_m'] - y0, 2)))
        return out
    def tiled(cov, lit=None):
        cover, lights = [], []
        for by in range(3):
            for bx in range(4):
                cover += [dict(c, x_m=round(c['x_m'] + bx * span, 2), y_m=round(c['y_m'] + by * span, 2)) for c in cov]
                for l in (lit or []):
                    lights.append(dict(l, x_m=round(l['x_m'] + bx * span, 2), y_m=round(l['y_m'] + by * span, 2), block=[by, bx]))
        return cover, lights
    cov, lit = tiled(local(B['cover']), local(B['lights'], True))
    terr = [list(B['terrain'][sby * 5 + r][sbx * 5:(sbx + 1) * 5]) * 4 for _ in range(3) for r in range(5)]
    G['boards']['lab'] = dict(blocks=[['lab.0'] * 4 for _ in range(3)], terrain=terr, cover=cov, lights=lit)
    G['blocks']['lab.0'] = dict(G['blocks']['works.0'], src=file_of('lab.0', 'present'))
    for st in ('raided', 'reclaimed'):
        G['futures'][st]['blocks']['lab.0'] = file_of('lab.0', st)
        FB = G['futures'][st].get('boards', {}).get(src_board)
        fc, fl = tiled(local(FB['cover']) if FB and 'cover' in FB else local(B['cover']), local(FB['lights'], True) if FB and 'lights' in FB else local(B['lights'], True))
        G['futures'][st].setdefault('boards', {})['lab'] = dict(cover=fc, lights=fl)
    mk = G.setdefault('made_11_2', {})
    mk['every_ground'] = dict(tool='tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py', grounds=sorted(NEW), lab='lab.0: the lab yard, its own ground on works.0\'s sheds')
    mk.setdefault('combat_maps', {}).setdefault('kinds', [])
    if 'lab' not in mk['combat_maps']['kinds']: mk['combat_maps']['kinds'].append('lab')
    json.dump(G, open(p, 'w'), indent=1)
    # the layers: the same sheds stand in front of a man the same way
    sp = os.path.join(SHIP, 'fight_stands.json'); S_ = json.load(open(sp))
    for st in STATES:
        if file_of('works.0', st) in S_['pictures']: S_['pictures'][file_of('lab.0', st)] = S_['pictures'][file_of('works.0', st)]
    json.dump(S_, open(sp, 'w'), separators=(',', ':'))             # the layers tool's own compact form
    print('  fight_ground.json: boards', len(G['boards']), 'blocks', len(G['blocks']), '; stands', len(S_['pictures']))
    why = ('the floor laid by tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py: each ground rendered through the master '
           'rig (the floor tool\'s build, the rig\'s source pass, sun and film, the block camera) and laid on the old picture\'s '
           'sand under its own light; no pack tile is cut into it')
    man = dict(about='COMBAT MAPS 2 11/2: every fight block\'s floor its own place\'s ground, and the lab yard (tools/bohemia_combat_maps_every_ground_its_own_11_2_26.py)',
               pieces={'%s.%s' % (b, st): dict(src=file_of(b, st), exception=why) for b in blocks() for st in STATES if b.split('.')[0] != 'casino'})
    json.dump(man, open(os.path.join(SHIP, 'combat_maps_2_11_2.json'), 'w'), indent=1)


def debug_plans(bids):
    """each block's plan in false colour (a ground a colour), the old picture's things over it: the geometry before any plate"""
    rng = np.random.RandomState(3); pal = (rng.rand(len(NAMES), 3) * 200 + 40).astype(np.uint8)
    w, h = 322, 228; cols = 7; rows = (len(bids) + cols - 1) // cols
    S_ = Image.new('RGB', (cols * w, rows * (h + 14))); d = ImageDraw.Draw(S_)
    for i, bid in enumerate(bids):
        a = np.asarray(Image.open(orig_path(bid, 'present')).convert('RGB'))
        things = things_mask(bid, TILES[bid]); g, _ = plan(bid, a, things, TILES[bid])
        m = replace_mask(a, bid, TILES[bid], things)
        v = (a * 0.35).astype(np.uint8); v[m] = pal[g[m]]
        x, y = (i % cols) * w, (i // cols) * (h + 14)
        S_.paste(Image.fromarray(v).resize((w, h), Image.NEAREST), (x, y + 14)); d.text((x + 3, y + 1), bid, fill=(255, 255, 0))
    S_.save(os.path.join(WORK, 'plans.png'))


def sheet():
    """THE SHEET: every place's fight on his upright phone, before (the old floors) and after, the share of the screen that is
    the old sand family measured on each; one card a place for the VOTE tab, and the whole sheet"""
    from PIL import ImageFont
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
    except Exception: font = ImageFont.load_default()
    bf = json.load(open(os.path.join(BASE, 'before', 'shots.json'))); af = json.load(open(os.path.join(BASE, 'after', 'shots.json')))
    B_ = {x['district']: x for x in bf}; rows = []
    for x in af:
        b = B_.get(x['district']); pa = np.asarray(Image.open(os.path.join(R, x['file'])).convert('RGB'))
        pb = np.asarray(Image.open(os.path.join(R, b['file'])).convert('RGB'))
        sa, sb = float(old_sand(pa).mean()), float(old_sand(pb).mean())
        rows.append(dict(district=x['district'], name=x['name'], before=round(sb, 4), after=round(sa, 4), blocks_after=x['blocks'], blocks_before=b['blocks'],
                         bar=x['bar'], card='records/target/combat_maps_11_2c/ground_%s.webp' % x['district']))
        card = Image.new('RGB', (390 * 2 + 12, 844 + 46), (16, 15, 14)); d = ImageDraw.Draw(card)
        card.paste(Image.fromarray(pb), (0, 46)); card.paste(Image.fromarray(pa), (402, 46))
        d.text((8, 4), '%s  BEFORE' % x['name'], fill=(200, 196, 186), font=font); d.text((8, 24), 'old sand %d%% of the screen' % round(sb * 100), fill=(220, 170, 90), font=font)
        d.text((410, 4), 'AFTER', fill=(236, 232, 220), font=font); d.text((410, 24), 'old sand %d%% of the screen' % round(sa * 100), fill=(150, 210, 150), font=font)
        card.save(os.path.join(R, rows[-1]['card']), quality=80, method=6)
    cols = 5; n = len(af); rr = (n + cols - 1) // cols
    S_ = Image.new('RGB', (cols * 390 + (cols - 1) * 8, rr * (844 + 48)), (16, 15, 14)); d = ImageDraw.Draw(S_)
    for i, x in enumerate(af):
        cx, cy = (i % cols) * 398, (i // cols) * (844 + 48)
        S_.paste(Image.open(os.path.join(R, x['file'])).convert('RGB'), (cx, cy + 48))
        r_ = rows[i]; d.text((cx + 6, cy + 4), x['name'], fill=(236, 232, 220), font=font)
        d.text((cx + 6, cy + 25), 'old sand %d%% -> %d%%' % (round(r_['before'] * 100), round(r_['after'] * 100)), fill=(150, 210, 150), font=font)
    S_.save(os.path.join(BASE, 'COMBAT_MAPS_EVERY_GROUND_SHEET_11_2.webp'), quality=78, method=6)
    json.dump(dict(about='every place on his phone, the share of the screen in the old sand colour family, before and after', places=rows,
                   mean_before=round(float(np.mean([r_['before'] for r_ in rows])), 4), mean_after=round(float(np.mean([r_['after'] for r_ in rows])), 4)),
              open(os.path.join(BASE, 'sheet.json'), 'w'), indent=1)
    for r_ in rows: print('  %-18s %5.1f%% -> %5.1f%%' % (r_['name'], r_['before'] * 100, r_['after'] * 100))


GROUND_SAYS = {
    'strip': 'The Strip\'s lots are taken up for cracked marble at the doors and the pool deck\'s tile to the south, the drive still asphalt.',
    'downtown': 'Downtown is asphalt with its painted stalls and walks, and the canopy\'s lattice shadow lies over the street with no canopy above it.',
    'industrial': 'The works\' yard is a slab black with oil, gravel, and a rail spur on its ties and ballast, the rails polished like a train ran this week.',
    'suburb': 'The suburb is dead lawn yard by yard, gravel lot lines, patio slabs and driveways, the dirt only where a lawn gave out, and one lawn still mown in fresh stripes.',
    'wash': 'The wash is cobble bars and pale silt in the bed with varnished desert pavement on its banks, and a line of bare footprints walks in and none walks out.',
    'reservoir': 'The shore is cracked mud up to the white bathtub ring, and a second ring sits far above it, higher than the lake ever stood.',
    'mountain': 'The pass is grey limestone scree and caliche crust along the road\'s gravel shoulders.',
    'desert': 'The desert is dark varnished pavement and white caliche crust, the sand kept only in the mound under each creosote, and one perfect bare circle.',
    'springs': 'Red Rock is red sand and red slickrock between the sandstone fins.',
    'trailer': 'The trailer park sits on grey gravel lots and pads, the sand only around the weeds.',
    'golf': 'The golf course is a dead fairway in its mowing stripes with a white bunker, the green dead with it (11/3: no water reaches it).',
    'water': 'The marina\'s lake bed is cracked mud with the bathtub ring and a second ring above it.',
    'medical': 'The lab yard is new: sealed epoxy, hazard hatching at the docks, a decon pad and its drains, and big paw prints walking out of the yard.',
    'airport': 'The apron is its slabs with a tie-down ring in each and oil where the aircraft stood.',
    'landfill': 'The landfill is grey cover soil with the trash working up through it and a gravel haul road.',
}


def register(sha):
    """each place its own card in the VOTE tab, and the whole sheet as the redo of the six maps he voted NO"""
    rp = os.path.join(R, 'records/target/BOHEMIA_VOTE_REGISTRY.json'); reg = json.load(open(rp))
    sh = json.load(open(os.path.join(BASE, 'sheet.json')))
    said = ('They all collectively need more love. It\'s still this yellow brown sand dirt as the main ground, not enough unique '
            'shit going on. Definitely a work in progress for all of them.')
    new = [dict(id='combat-maps-every-ground-11-2', kind='redo', redoOf='combat-maps-every-district-11-2', lane='combat', sha=sha, made='11/2', draft=True,
                title='EVERY PLACE ITS OWN GROUND: THE FIGHT FLOORS, ALL FIFTEEN PLACES', said=said,
                why=('Every fight floor is now its own place\'s ground instead of the yellow-brown sand, and the share of his phone screen in that '
                     'sand colour fell from %d%% to %d%% across the fifteen places. You see it here on the phone and in every fight you start on the map.'
                     % (round(sh['mean_before'] * 100), round(sh['mean_after'] * 100))),
                options=['A, yes: more like this, a second block of each place next', 'B, the grounds are right but some places still look alike',
                         'C, push it further: louder colours, more junk on the ground'],
                show=dict(how='image', src='../records/target/combat_maps_11_2c/COMBAT_MAPS_EVERY_GROUND_SHEET_11_2.webp'),
                before_after=dict(before='%d%% of the screen the old sand on average' % round(sh['mean_before'] * 100),
                                  after='%d%%' % round(sh['mean_after'] * 100), scale='his phone, 390 x 844, the fight\'s opening view, by day'))]
    for r_ in sh['places']:
        new.append(dict(id='combat-ground-%s-11-2' % r_['district'], kind='tile', lane='combat', sha=sha, made='11/2', draft=True,
                        title='%s: ITS OWN GROUND' % r_['name'], said=said,
                        why=GROUND_SAYS.get(r_['district'], '') + ' You see it here before and after on the phone, and in every fight there on the map.',
                        options=['A, yes, that reads as the place', 'B, close, but push it further', 'C, no, wrong ground for this place'],
                        show=dict(how='image', src='../' + r_['card']),
                        before_after=dict(before='old sand %d%% of the screen' % round(r_['before'] * 100), after='%d%%' % round(r_['after'] * 100),
                                          scale='his phone, 390 x 844, by day')))
    # inserted as text at the end of the items (the file's other rows keep their own bytes, escapes and all); a re-run
    # replaces this round's own block, found by its first id
    txt = open(rp).read()
    block = ''.join(',\n' + '\n'.join('  ' + ln for ln in json.dumps(it, indent=1, ensure_ascii=False).split('\n')) for it in new)
    mark = ',\n  {\n   "id": "%s"' % new[0]['id']
    if mark in txt:
        i = txt.index(mark); j = txt.index('\n ],\n "verdicts"', i); txt = txt[:i] + block + txt[j:]
    else:
        j = txt.index('\n ],\n "verdicts"'); txt = txt[:j] + block + txt[j:]
    open(rp, 'w').write(txt); json.loads(txt)
    print('  registered', len(new))


def debug_masks(bids):
    w, h = 322, 228; cols = 7; rows = (len(bids) + cols - 1) // cols
    S = Image.new('RGB', (cols * w, rows * (h + 14))); d = ImageDraw.Draw(S)
    for i, bid in enumerate(bids):
        a = np.asarray(Image.open(orig_path(bid, 'present')).convert('RGB'))
        things = things_mask(bid, TILES[bid]); m = replace_mask(a, bid, TILES[bid], things)
        v = a.copy(); v[m] = (v[m] * 0.4 + np.array([255, 0, 255]) * 0.6).astype(np.uint8); v[things] = (v[things] * 0.5 + np.array([0, 255, 0]) * 0.5).astype(np.uint8)
        x, y = (i % cols) * w, (i // cols) * (h + 14)
        S.paste(Image.fromarray(v).resize((w, h), Image.BILINEAR), (x, y + 14)); d.text((x + 3, y + 1), bid, fill=(255, 255, 0))
    os.makedirs(WORK, exist_ok=True); S.save(os.path.join(WORK, 'masks.png'))


def _one(arg):
    bid, write = arg
    r = do_block(bid, write, STATES if write else ('present',)); PLATE_CACHE.clear(); KEEP_OF.pop(bid, None)
    return r


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[0] == '--plates':
        for n in (a[1:] or PLATES): render_plate(n, int(os.environ.get('CM_SAMPLES', 12)))
        sys.stdout.flush(); os._exit(0)
    elif a[0] == '--data':
        data()
    elif a[0] == '--register':
        register(a[1])
    elif a[0] == '--sheet':
        sheet()
    elif a[0] == '--plans':
        debug_plans(a[1:] or blocks())
    elif a[0] == '--masks':
        debug_masks(a[1:] or blocks())
    elif a[0] in ('--lay', '--look'):
        bids = a[1:] or blocks()
        led = os.path.join(BASE, 'grounds.json'); L = json.load(open(led)) if os.path.exists(led) else {}
        from multiprocessing import Pool
        with Pool(int(os.environ.get('CM2_PROCS', 4))) as pool:
            for bid, r in zip(bids, pool.imap(_one, [(b, a[0] == '--lay') for b in bids])):
                if a[0] == '--lay': L[bid] = r
                print(' ', bid, r['states'].get('present'), flush=True)
        if a[0] == '--lay': os.makedirs(BASE, exist_ok=True); json.dump(L, open(led, 'w'), indent=1)
