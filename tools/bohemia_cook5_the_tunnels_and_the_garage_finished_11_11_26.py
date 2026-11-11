#!/usr/bin/env python3
"""BOHEMIA -- COOK FIVE [tunnels and garage art] 11/11/26: THE FLOOD TUNNELS' AND THE PARKING GARAGE'S PICTURES THROUGH THE RIG.
VAMILY rule 443(g) (finished art where a stand-in stands), rule 440(a) and rule 416 (the big interiors: a casino floor, the
flood tunnels, a parking garage), rule 441 (fully baked: no stand-in where finished art is owed), rule 430 (improve, never
throw away), rule 408(b) (the golden piece's recipe: the casino floor's carpet is the bar an inside's floor is held to).

WHAT IT IS. COMBAT's lane owns the two boards (the tunnels' rules and layouts: slices/bohemia_flood_tunnels.js, tunnels.json,
landed on main by COMBAT THREE in BUILD 11/11c while this was being made; the garage is not laid yet). This tool makes
PICTURES ONLY, so neither wears a stand-in:

THE FLOOD TUNNELS (slices/fight_ground/tunnels/). The board laid the wash block's own tiles for the culvert floor, the
landfill's for the earth round it, and eight small rig models it marked STAND-IN. Here:
  tunnel_floor_0    one 60 m sheet of 25 tiles: a box culvert's floor: poured slabs and their joints, silt in drifts with its
                    pebbles, damp, standing water, what people who live there leave, spray-paint arrows
  tunnel_channel_0  the main channel: wet concrete, the low flow's slick, silt bars the last flood laid, wrack lying downstream
  tunnel_fill_0     the earth the culverts are buried in, cut through: dark, stony, quiet
  the pieces        the culvert's wall cut away at 1.8 m (both ways), the trash rack whole and pried open, the camp on the
                    wall, the lean-to, the flood's jam, the rungs up to a street grate: each a model in metres
The floor picks any tile of a sheet for any place (the board's own pic()), so every tile of a sheet meets every other: the
slab joints fall on the tile's edge and everything bigger than a hand fades out before it (the casino carpet's lesson).

THE PARKING GARAGE (slices/fight_ground/garage/): see GARAGE below (its own section of this file).

  <venv>/bin/python tools/bohemia_cook5_the_tunnels_and_the_garage_finished_11_11_26.py render <scene> [--quick]
      scenes: cal | tun_floor | tun_channel | tun_fill | tun_pieces | gar_floor | gar_pieces   (7 to 10 min each; the pieces 3)
  python3 ... calibrate          (after render cal --quick: each new ground's multiplier, by measure)
  <venv>/bin/python ... models tunnels|garage   (each piece's model as a .glb, its foot at the origin: reference/models/bohemia/)
  python3 ... cut tunnels|garage  (the sheets, the pieces, sizes.json, the kit's own art file)

ANALOG HORROR (rule 20), at the source: on the culvert's wall somebody marked how high the water came, every time; the
newest mark is over a man's head. Every arrow painted on the floor points the same way, deeper in. In the silt, two lines
where something heavy was dragged, and they stop in the middle of the floor.
REFERENCE CHECK (the 9/4 standing duty): the real thing is the Las Vegas valley's flood control system (the Regional Flood
Control District's reinforced concrete boxes under the Strip and the washes: Flamingo Wash, Tropicana Wash; the
photographs in Matthew O'Brien's Beneath the Neon and the news film of 2019 to 2023): square barrels 3 to 6 m wide with a
troweled floor, silt and river cobble after every storm, a film of water with a green slick down the low flow, camps on
pallets off the wet, murals and tags along the walls, steel trash racks at the mouths. The twins in the game: the casino
floor's carpet sheet (an inside's floor through the rig, the bar for this), the wash block (the map's own concrete
channel) and the freeway's concrete. Battle Brothers never goes under the ground: no reference game here.
REUSE CHECK (REUSE-FIRST): the freeway tool's rig(), Parts, finish(), shoot(), catcher and debris and the casino tool's
tile-edge window (imported); the floor tool's grounds, grid, stones and camera; the master rig's source pass and dents;
the not-final tool's grime and instances. The parked board's piece names, canvases' meaning and feet are kept.
TASTE CHECK: nothing of his is changed; these places have no verdict yet (the casino floor's YES is the bar).
"""
import os, sys, json, math
import numpy as np
from PIL import Image

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import bohemia_cook5_the_freeway_finished_11_10_26 as FW

W, H, PPM, SIDE, TM, TW, TH = FW.W, FW.H, FW.PPM, FW.SIDE, FW.TM, FW.TW, FW.TH
PYM = TH / TM                                                   # 30.33 px a metre north to south on the glass
FG = os.path.join(R, 'slices', 'fight_ground')
OUT = os.path.join(R, 'records', 'target', 'cook5_inside')
REND = os.path.join(OUT, 'render')
CALF = os.path.join(OUT, 'calibration.json')

# ---- THE NEW GROUNDS (added to the floor tool's own table, the way the freeway added its yellow and its seal) -----------------
# target: what the ground should read on the shipped sheet (sRGB); the multiplier that gets it there is measured (calibrate)
GROUNDS = {
    'tun_floor': dict(role=('tape_grey', 2), target=(142, 137, 126), h=0.0, alt=('clay_bone', 2), alt_amt=0.22, grit=0.08, speck=(70, 0.12),
                      joints=dict(pitch=4.0, width=0.024), panel_var=0.045, cracks=dict(cell=1.7, width=0.012, region=0.3, cut=0.56, depth=0.5)),
    'tun_wet':   dict(role=('metal_painted', 2), target=(88, 90, 76), h=-0.01, alt=('tape_grey', 1), alt_amt=0.3, grit=0.09, speck=(60, 0.12),
                      joints=dict(pitch=4.0, width=0.024), panel_var=0.035),
    'tun_silt':  dict(role=('tape_masking', 2), target=(156, 137, 104), h=0.035, alt=('clay_bone', 2), alt_amt=0.3, grit=0.3, speck=(55, 0.36)),
    'tun_slick': dict(role=('metal_painted', 1), target=(66, 70, 54), h=-0.012, alt=('metal_painted', 0), alt_amt=0.3, grit=0.12, speck=(60, 0.2)),
    'tun_water': dict(role=('clay_teal', 1), target=(54, 68, 64), h=-0.02, alt=('clay_teal', 0), alt_amt=0.35, grit=0.03, speck=(30, 0.05)),
    'tun_fill':  dict(role=('clay_bone', 0), target=(58, 49, 41), h=0.0, alt=('rubber', 2), alt_amt=0.3, grit=0.5, speck=(40, 0.6)),
    'tun_spray': dict(role=('clay_rust', 2), target=(150, 82, 50), h=0.0, alt=('clay_rust', 1), alt_amt=0.2, grit=0.1, speck=(45, 0.14),
                      wornthrough=dict(scale=4.0, cut=0.36, to=('tape_grey', 2))),
    'gar_deck':  dict(role=('tape_grey', 2), target=(134, 131, 124), h=0.0, alt=('tape_grey', 1), alt_amt=0.14, grit=0.09, speck=(60, 0.14),
                      joints=dict(pitch=6.0, width=0.02), panel_var=0.04, cracks=dict(cell=1.3, width=0.011, region=0.3, cut=0.5, depth=0.5),
                      oil=dict(scale=1.6, cut=0.74, mul=0.72)),
    'gar_white': dict(role=('tape_grey', 4), target=(178, 174, 162), h=0.0, alt=('tape_grey', 3), alt_amt=0.2, grit=0.1, speck=(45, 0.14),
                      wornthrough=dict(scale=3.4, cut=0.42, to=('tape_grey', 2))),
    'gar_yellow': dict(role=('clay_mustard', 2), target=(160, 126, 56), h=0.0, alt=('clay_mustard', 1), alt_amt=0.25, grit=0.1, speck=(45, 0.14),
                       wornthrough=dict(scale=3.0, cut=0.38, to=('tape_grey', 2))),
    'tun_mud':   dict(role=('tape_masking', 1), target=(116, 102, 78), h=0.03, alt=('clay_bone', 1), alt_amt=0.3, grit=0.22, speck=(55, 0.28)),
}
CAL0 = dict(tun_floor=0.9, tun_wet=0.8, tun_silt=0.8, tun_slick=0.8, tun_water=0.8, tun_fill=0.8, tun_spray=0.6, gar_deck=0.85, gar_white=0.75, gar_yellow=0.55, tun_mud=0.8)
STONES = {
    'tun_silt': [(5.0, 0.03, 0.09, 'pebble'), (0.5, 0.08, 0.2, 'rock')],
    'tun_fill': [(1.2, 0.05, 0.13, 'fill_peb'), (0.5, 0.12, 0.4, 'fill_rock'), (0.25, 0.08, 0.3, 'rubble')],
    'tun_wet':  [(0.3, 0.03, 0.08, 'fill_peb')],
    'tun_mud':  [(3.0, 0.03, 0.08, 'pebble'), (0.3, 0.08, 0.18, 'fill_rock')],
}
# the share of the rig's dust a ground takes (the road's own mechanism): wet things are not dusty, the earth is its own dust
WEAR = dict(tun_wet=0.12, tun_slick=0.05, tun_water=0.0, tun_fill=0.3, tun_mud=0.15, tun_spray=0.08, gar_white=0.2, gar_yellow=0.08)


def rig():
    NF, F, RIG = FW.rig()
    if 'tun_floor' not in F.MATS:
        for n, spec in GROUNDS.items():
            F.MATS[n] = spec; F.IDS.append(n); F.ID[n] = len(F.IDS) - 1
        cal0 = F.cal_mul; mine = dict(CAL0)
        if os.path.exists(CALF): mine.update(json.load(open(CALF)).get('mul', {}))
        F.cal_mul = lambda: dict(cal0(), **mine)
        F.STONES.update(STONES)
        F.STONE_MATS.update(fill_peb=('clay_bone', 1), fill_rock=('clay_bone', 0))   # the stones of dark earth are dark (pale ones read as stars on his phone)
        F.ROAD_WEAR = dict(F.ROAD_WEAR, **WEAR)
    return NF, F, RIG


def ids():
    """the grounds' numbers without Blender (for the plans' own checks)"""
    import bohemia_cook_the_floor_through_the_rig_10_19_26 as F0
    names = list(F0.IDS) + [n for n in ('paint_y', 'seal') if n not in F0.IDS] + [n for n in GROUNDS if n not in F0.IDS]
    return {n: i for i, n in enumerate(names)}


# ---- THE PLANS (numpy, metres) ----------------------------------------------------------------------------------------------
def tgrid():
    xm, ym = FW.grids(); ty = SIDE - ym
    return xm, ty, xm % TM, ty % TM, np.clip((xm // TM).astype(int), 0, 4), np.clip((ty // TM).astype(int), 0, 4)


def win(lx, ly, m=0.15, f=1.6):
    """1 in a tile's middle, 0 within m of its edge: nothing bigger than a hand may cross a tile's edge (any tile meets any)"""
    return np.clip((np.minimum(lx, TM - lx) - m) / f, 0, 1) * np.clip((np.minimum(ly, TM - ly) - m) / f, 0, 1)


def stretch(rng, cell_m, kx=1.0):
    """value noise stretched east-west by kx: what water lays down lies along the water"""
    a = FW.vnoise((H, int(W / kx) + 2), cell_m * PPM, rng)
    im = Image.fromarray((a * 255).astype(np.uint8)).resize((int(a.shape[1] * kx), H), Image.BICUBIC)
    return np.asarray(im, np.float32)[:H, :W] / 255.0


def pnoise(rng, cell_m, kx=1.0):
    """value noise that repeats every 12 m tile exactly (its lattice wraps): the SAME picture along every tile's edge"""
    ny = max(2, int(round(TM / cell_m))); nx = max(2, int(round(TM / (cell_m * kx))))
    g = np.pad(rng.rand(ny, nx).astype(np.float32), 2, mode='wrap')
    im = Image.fromarray((g * 255).astype(np.uint8)).resize((int(round((nx + 4) * TW / nx)), int(round((ny + 4) * TH / ny))), Image.BICUBIC)
    a = np.asarray(im, np.float32) / 255.0
    oy, ox = int(round(2 * TH / ny)), int(round(2 * TW / nx)); t = a[oy:oy + TH, ox:ox + TW]
    return np.tile(t, (5, 5))[:H, :W]


def top(f, share):
    """the level of a field that this share of the floor lies above"""
    return float(np.quantile(f[::4, ::4], 1.0 - share))


def mixn(u, p, w):
    """a tile's own noise in its middle (u), the shared one along its edge (p): every tile of a sheet wears the same edge, so
    any tile meets any tile and what lies on the floor still runs across the join (an empty frame round every tile showed the
    grid; measured on the plan 11/11); the blend keeps the noise's spread"""
    return (w * u + (1 - w) * p - 0.5) / np.sqrt(w * w + (1 - w) * (1 - w)) + 0.5


def seg(xm, ty, p0, p1, w):
    """true within w/2 of the line p0-p1 (metres; ty runs south)"""
    (ax, ay), (bx, by) = p0, p1; dx, dy = bx - ax, by - ay; L2 = dx * dx + dy * dy or 1e-9
    t = np.clip(((xm - ax) * dx + (ty - ay) * dy) / L2, 0, 1)
    return (xm - ax - t * dx) ** 2 + (ty - ay - t * dy) ** 2 < (w / 2) ** 2


def arrow(xm, ty, c, ang, L=1.7, w=0.13):
    """a spray-paint arrow on the floor: a shaft and two strokes for its head"""
    ca, sa = math.cos(ang), math.sin(ang); tip = (c[0] + ca * L / 2, c[1] + sa * L / 2); tail = (c[0] - ca * L / 2, c[1] - sa * L / 2)
    m = seg(xm, ty, tail, tip, w)
    for s in (-1, 1):
        a2 = ang + math.pi - s * 0.6
        m |= seg(xm, ty, tip, (tip[0] + math.cos(a2) * L * 0.36, tip[1] + math.sin(a2) * L * 0.36), w)
    return m


def tile_c(col, row, fx=0.5, fy=0.5):
    return (col * TM + fx * TM, row * TM + fy * TM)


def plan_tun_floor(ID, seed=31):
    xm, ty, lx, ly, col, row = tgrid(); rng = np.random.RandomState(seed); w = win(lx, ly, 0.5, 1.5)
    gid = np.full((H, W), ID['tun_floor'], np.uint8)
    n2 = FW.vnoise((H, W), 0.7 * PPM, rng)
    drift = mixn(FW.vnoise((H, W), 2.0 * PPM, rng), pnoise(rng, 2.0), w) * 0.8 + n2 * 0.2
    damp = mixn(FW.vnoise((H, W), 3.0 * PPM, rng), pnoise(rng, 3.0), w)
    pond = mixn(FW.vnoise((H, W), 1.5 * PPM, rng), pnoise(rng, 1.5), w)
    # the silt: what every storm leaves, in drifts a few metres across, thickest in a drift's heart (with its pebbles)
    t = top(drift, 0.07); gid[drift > t] = ID['tun_silt']
    pale = np.clip((drift - (t - 0.2)) / 0.2, 0, 1) ** 1.5 * 0.7
    # the damp, and the water that stands where the floor dips
    td = top(damp, 0.13); dark = np.clip((damp - (td - 0.12)) / 0.16, 0, 1) * 0.24
    # (a pool as its own dark ground read as a hole in the floor, measured on the first full render: the water is wet concrete, darker toward its middle)
    tp = top(pond, 0.05); wet = (pond > tp) & (damp > td - 0.06) & (gid == ID['tun_floor']); gid[wet] = ID['tun_wet']
    dark = np.maximum(dark, np.clip((pond - (tp - 0.08)) / 0.1, 0, 1) * (damp > td - 0.08) * 0.42)
    # rust weeping out of the slab joints here and there
    dark = np.maximum(dark, np.clip(1 - np.minimum(lx % 4.0, 4.0 - lx % 4.0) / 0.5, 0, 1) * (n2 > 0.62) * 0.3)
    # where a fire was kept: soot in a ring, ash in its middle
    for (c, r, fx, fy) in ((1, 0, 0.62, 0.4), (3, 3, 0.35, 0.6), (0, 4, 0.5, 0.55)):
        cx, cy = tile_c(c, r, fx, fy); d = np.sqrt((xm - cx) ** 2 + (ty - cy) ** 2)
        dark = np.maximum(dark, np.clip(1.25 - d / 1.1, 0, 1) * (0.5 + 0.5 * n2) * 0.85)
        pale = np.where(d < 0.42, np.maximum(pale, 0.75 * (n2 > 0.35)), pale)
    # rule 20: every arrow painted on the floor points the same way (east, deeper in), whoever painted it
    spray = np.zeros((H, W), bool)
    for (c, r, fx, fy, da) in ((0, 0, 0.5, 0.6, 0.06), (2, 1, 0.42, 0.38, -0.1), (4, 2, 0.5, 0.62, 0.02), (1, 3, 0.6, 0.5, -0.04), (3, 4, 0.45, 0.42, 0.12), (2, 3, 0.52, 0.7, 0.0)):
        spray |= arrow(xm, ty, tile_c(c, r, fx, fy), da, rng.uniform(1.5, 2.2), 0.14)
    gid[spray & (n2 > 0.2)] = ID['tun_spray']
    # rule 20: in the silt, two lines where something heavy was dragged; they stop in the middle of the floor
    for (c, r) in ((2, 2), (4, 0)):
        x0, y0 = tile_c(c, r, 0.22, 0.68); ex, ey = x0 + 2.5, y0 - 1.3
        el = ((xm - ex) / 3.5) ** 2 + ((ty - ey) / 2.1) ** 2 + (n2 - 0.5) * 0.5
        gid[(el < 0.8) & np.isin(gid, [ID['tun_floor'], ID['tun_wet']])] = ID['tun_silt']
        pale = np.maximum(pale, np.clip(1.25 - el, 0, 1) * 0.6)
        for off in (0.0, 0.42):
            dark = np.maximum(dark, seg(xm, ty, (x0, y0 + off), (x0 + 4.7, y0 - 2.5 + off * 0.9), 0.1) * 0.9)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


def plan_tun_channel(ID, seed=37):
    xm, ty, lx, ly, col, row = tgrid(); rng = np.random.RandomState(seed); w = win(lx, ly, 0.5, 1.5)
    gid = np.full((H, W), ID['tun_wet'], np.uint8)
    n2 = FW.vnoise((H, W), 0.6 * PPM, rng)
    s1 = mixn(stretch(rng, 1.0, 6.0), pnoise(rng, 1.0, 6.0), w); s3 = mixn(stretch(rng, 1.5, 4.0), pnoise(rng, 1.5, 4.0), w)
    bar = mixn(stretch(rng, 1.5, 4.0), pnoise(rng, 1.5, 4.0), w); t1 = mixn(stretch(rng, 2.4, 2.5), pnoise(rng, 2.4, 2.5), w)
    # the low flow's slick: long green-black streaks lying with the water
    sl = s1 * 0.8 + n2 * 0.2; tsl = top(sl, 0.17); gid[sl > tsl] = ID['tun_slick']
    # the water that still stands in it
    tw_ = top(s3, 0.1); gid[(s3 > tw_) & (gid == ID['tun_wet'])] = ID['tun_water']
    # the bars the last flood laid: silt in long lenses, rippled across the flow
    tb = top(bar, 0.1); silt = bar > tb
    gid[silt] = ID['tun_mud']
    pale = np.clip((bar - (tb - 0.05)) / 0.05, 0, 1) ** 1.5 * 0.15
    ripple = (np.sin(xm * 2 * math.pi / 0.42 + n2 * 5.0) > 0.55)
    dark = np.where(silt, ripple * 0.32, 0.0).astype(np.float32)
    # the slick's and the water's edges are soft: the wet goes a hand further than the film
    dark = np.maximum(dark, np.clip((sl - (tsl - 0.05)) / 0.05, 0, 1) * (~silt) * 0.3)
    dark = np.maximum(dark, np.clip((s3 - (tw_ - 0.04)) / 0.04, 0, 1) * (~silt) * 0.32)
    # the tide lines the water left as it dropped: thin dark lines along the flow
    for lev in (0.4, 0.5, 0.6):
        dark = np.maximum(dark, (np.abs(t1 - lev) < 0.006) * 0.4)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


def plan_tun_fill(ID, seed=41):
    xm, ty, lx, ly, col, row = tgrid(); rng = np.random.RandomState(seed)
    gid = np.full((H, W), ID['tun_fill'], np.uint8)
    n1 = FW.vnoise((H, W), 1.2 * PPM, rng); n2 = FW.vnoise((H, W), 0.4 * PPM, rng)
    dark = np.clip((n1 - 0.45) / 0.3, 0, 1) * 0.35                  # the earth is not one tone, but it is all dark
    pale = np.zeros((H, W), np.float32)
    return gid, dark, pale


PLANS = {'tun_floor': plan_tun_floor, 'tun_channel': plan_tun_channel, 'tun_fill': plan_tun_fill}


# ---- THE SCENES -------------------------------------------------------------------------------------------------------------
def inst(bpy, NF, name, rows, mat, rng, jit=0.2):
    o = NF.instances(bpy, name, (NF.CUBE_V, NF.CUBE_F), rows, mat, jit, rng)
    return [o] if o is not None else []


def litter_mats(bpy, NF):
    M = FW.things_mats(bpy, NF)
    M.update(cloth=NF.material(bpy, 'in_cloth_rag', 'clay_teal', 1, 0.9), cloth_r=NF.material(bpy, 'in_cloth_red', 'clay_rust', 2, 0.85),
             can=NF.material(bpy, 'in_can', 'chrome', 1, 0.8), jug=NF.material(bpy, 'in_jug', 'tape_grey', 4, 0.85),
             wood=NF.material(bpy, 'in_wood', 'tape_masking', 1, 0.85), wood_d=NF.material(bpy, 'in_wood_dark', 'clay_bone', 0, 1.0),
             wax=NF.material(bpy, 'in_wax', 'clay_bone', 4, 0.9), blue=NF.material(bpy, 'in_tarp_blue', 'clay_teal', 2, 1.0),
             blue_d=NF.material(bpy, 'in_tarp_blue_fold', 'clay_teal', 2, 0.8), tape=NF.material(bpy, 'in_tape', 'tape_grey', 2, 1.0),
             mat_=NF.material(bpy, 'in_mattress', 'clay_bone', 3, 0.85), stain=NF.material(bpy, 'in_stain', 'tape_masking', 1, 0.9),
             black=NF.material(bpy, 'in_black', 'rubber', 0, 1.0), flame=NF.material(bpy, 'in_flame', 'sodium', 3, 1.0),
             teal=NF.material(bpy, 'in_paint_teal', 'clay_teal', 3, 1.0), rustp=NF.material(bpy, 'in_paint_rust', 'clay_rust', 2, 1.0),
             must=NF.material(bpy, 'in_paint_mustard', 'clay_mustard', 3, 0.95), white=NF.material(bpy, 'in_paint_white', 'tape_grey', 4, 0.9),
             chalk=NF.material(bpy, 'in_chalk', 'clay_bone', 4, 0.95), green=NF.material(bpy, 'in_slime', 'metal_painted', 1, 1.0),
             rug=NF.material(bpy, 'in_cloth_rug', 'clay_rust', 1, 1.0), rug_b=NF.material(bpy, 'in_cloth_rug_field', 'clay_rust', 2, 0.9),
             couch=NF.material(bpy, 'in_cloth_couch', 'clay_mustard', 1, 1.0), tan=NF.material(bpy, 'in_tarp_tan', 'tape_masking', 2, 0.9),
             tan_d=NF.material(bpy, 'in_tarp_tan_fold', 'tape_masking', 1, 1.0),
             stop=NF.material(bpy, 'in_wheel_stop', 'clay_bone', 2, 0.9), glassbit=NF.material(bpy, 'in_glass_bits', 'glass_eye', 2, 0.8),
             block=NF.material(bpy, 'in_block_wall', 'tape_grey', 2, 0.85))
    return M


def floor_litter(bpy, NF, M, rng, n, twigs=0, along=None):
    """what lies on a floor nobody sweeps: rags, cans, jugs, cardboard, paper; twigs (lying with the water where 'along')"""
    rows = dict(rag=[], rag2=[], can=[], jug=[], twig=[])
    def spot():
        while True:
            x, y = rng.uniform(0, 60), rng.uniform(0, 60)
            if min(x % TM, TM - x % TM) > 0.5 and min(y % TM, TM - y % TM) > 0.5: return x, y
    for _ in range(n):
        x, y = spot(); k = rng.rand(); rz = rng.uniform(0, 6.3)
        if k < 0.16: rows['rag'].append((x, y, 0.0, rng.uniform(0.25, 0.6), rng.uniform(0.12, 0.3), 0.03, rz, 0.0))
        elif k < 0.22: rows['rag2'].append((x, y, 0.0, rng.uniform(0.2, 0.45), rng.uniform(0.1, 0.22), 0.03, rz, 0.0))
        elif k < 0.75: rows['can'].append((x, y, 0.0, 0.12, 0.066, 0.066, rz, 0.0))
        else: rows['jug'].append((x, y, 0.0, 0.3, 0.16, 0.16, rz, 0.0))
    for _ in range(twigs):
        x, y = spot(); rz = (rng.normal(0, 0.3) if along else rng.uniform(0, 6.3)); L = rng.uniform(0.5, 1.8)
        rows['twig'].append((x, y, 0.0, L, 0.035, 0.03, rz, 0.0))
    out = inst(bpy, NF, 'lit_rag', rows['rag'], M['cloth'], rng) + inst(bpy, NF, 'lit_rag2', rows['rag2'], M['cloth_r'], rng) + \
        inst(bpy, NF, 'lit_can', rows['can'], M['can'], rng, 0.1) + inst(bpy, NF, 'lit_jug', rows['jug'], M['jug'], rng, 0.1) + \
        inst(bpy, NF, 'lit_twig', rows['twig'], M['wood_d'], rng, 0.1)
    return out


def scene_ground(name, quick=False):
    import bpy
    NF, F, RIG = rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    gid, dark, pale = PLANS[name](F.ID)
    objs, g = NF._build(bpy, gid, 5200 + len(name), quick)
    FW.set_attr(F, objs[0], 'dark', dark); FW.set_attr(F, objs[0], 'pale', pale)
    M = litter_mats(bpy, NF); rng = np.random.RandomState(900 + len(name)); things = []
    if name == 'tun_floor':
        things += floor_litter(bpy, NF, M, rng, 110, twigs=40)
        things += FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r: (r.uniform(0, 60), r.uniform(0, 60)), 26)
    elif name == 'tun_channel':
        things += floor_litter(bpy, NF, M, rng, 60, twigs=170, along=True)
    elif name.startswith('gar_'):
        things += GARAGE_THINGS[name](bpy, NF, M, rng)
    FW.finish(bpy, NF, F, RIG, objs, things, 21)
    FW.REND = REND
    return FW.shoot(bpy, F, RIG, name, quick)


def scene_cal(quick=True):
    """every new ground a 12 m tile of its own, flat, for the measure (calibrate)"""
    import bpy
    NF, F, RIG = rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    xm, ty, lx, ly, col, row = tgrid(); names = list(GROUNDS)
    gid = np.zeros((H, W), np.uint8)
    for i, n in enumerate(names): gid[(col == i % 5) & (row == i // 5)] = F.ID[n]
    gid[row >= (len(names) + 4) // 5] = F.ID['tun_floor']
    objs, g = NF._build(bpy, gid, 77, True)
    z = np.zeros((H, W), np.float32); FW.set_attr(F, objs[0], 'dark', z); FW.set_attr(F, objs[0], 'pale', z)
    FW.finish(bpy, NF, F, RIG, objs, [], 21)
    FW.REND = REND
    return FW.shoot(bpy, F, RIG, 'cal', True)


def calibrate():
    fn = os.path.join(REND, 'cal_quick.png'); a = np.asarray(Image.open(fn).convert('RGB'), np.float32)
    q = a.shape[1] / W; names = list(GROUNDS)
    old = dict(CAL0); rec = {}
    if os.path.exists(CALF): old.update(json.load(open(CALF)).get('mul', {}))
    lum = lambda c: 0.2126 * (c[0] / 255.0) ** 2.2 + 0.7152 * (c[1] / 255.0) ** 2.2 + 0.0722 * (c[2] / 255.0) ** 2.2
    mul = {}
    for i, n in enumerate(names):
        c, r = i % 5, i // 5
        box = a[int((r + 0.25) * TH * q):int((r + 0.75) * TH * q), int((c + 0.25) * TW * q):int((c + 0.75) * TW * q)].reshape(-1, 3)
        med = np.median(box, 0); tgt = GROUNDS[n]['target']
        mul[n] = round(float(np.clip(old[n] * (lum(tgt) / max(lum(med), 1e-5)), 0.15, 3.0)), 4)
        rec[n] = dict(render=[round(float(v), 1) for v in med], target=list(tgt), was=old[n], mul=mul[n])
        print('%-11s renders %-22s target %-16s mul %.3f -> %.3f' % (n, rec[n]['render'], tgt, old[n], mul[n]))
    os.makedirs(OUT, exist_ok=True); json.dump(dict(mul=mul, measured=rec), open(CALF, 'w'), indent=1)


# ---- THE TUNNELS' PIECES: each a model in metres, alone on a shadow-catching ground --------------------------------------------
# where each stands on the 60 m sheet (its foot: the point the board lays it by) and the box of the render cut for it
WALL_H, WALL_T = 1.8, 0.3
TUN_AT = dict(wall_ew=(12.0, 50.0), wall_ew_b=(12.0, 44.0), wall_ew_c=(12.0, 39.0), wall_ns=(30.0, 40.0), rack=(38.0, 40.0), mouth=(46.0, 40.0), camp_a=(9.0, 30.0), camp_b=(9.0, 19.0), jam=(9.0, 8.0),
              ladder=(22.0, 22.0))


def water_marks(P, x0, x1, y, rng, mats=('chalk',)):
    """rule 20: somebody marked how high the water came, every time: short chalk lines up the wall, the newest over a man's head"""
    x = x0
    for z in (0.42, 0.7, 0.95, 1.25, 1.62):
        L = rng.uniform(0.5, 0.9); P.box('chalk', x, x + L, y - 0.012, y, z, z + 0.035)
        P.box('chalk', x + L + 0.08, x + L + 0.14, y - 0.012, y, z - 0.05, z + 0.09)            # a tick beside each: a date nobody can read
        x += rng.uniform(0.25, 0.5)
        if x > x1 - 1.0: break


def tags(P, x0, x1, y, rng, n=3):
    """what gets painted on a culvert's wall: blocks of colour with a dark edge, a drip under them"""
    cols = ['teal', 'rustp', 'must', 'white']
    for _ in range(n):
        cx = rng.uniform(x0 + 0.8, x1 - 0.8); z0 = rng.uniform(0.35, 0.7); wdt = rng.uniform(0.9, 1.9); hgt = rng.uniform(0.5, 0.9)
        c = cols[rng.randint(len(cols))]
        P.box('black', cx - wdt / 2 - 0.05, cx + wdt / 2 + 0.05, y - 0.008, y, z0 - 0.05, z0 + hgt + 0.05)
        k = rng.randint(3, 6)
        for i in range(k):
            a = cx - wdt / 2 + wdt * i / k; b = a + wdt / k - 0.05; zz = z0 + rng.uniform(0, 0.12)
            P.box(c, a, b, y - 0.014, y, zz, z0 + hgt - rng.uniform(0, 0.14))
        for _ in range(2):
            dx = rng.uniform(cx - wdt / 2, cx + wdt / 2); P.box(c, dx, dx + 0.03, y - 0.012, y, max(0.05, z0 - rng.uniform(0.15, 0.4)), z0)


def tunnel_parts(P, rng):
    # THE WALL, east-west: 12 m of a culvert's wall cut away at 1.8 m; the foot is the middle of its south base line. The board
    # lays ONE picture on every tile (tunnel_wall_ew), so that one is the wall alone: its joints, its slime line, the water
    # down it. Two more the board may pick from (tunnel_wall_ew_b painted, tunnel_wall_ew_c with the water's marks): seen on
    # the page 11/11, three tags stamped every 12 m read as a pattern, not a wall
    for key in ('wall_ew', 'wall_ew_b', 'wall_ew_c'):
        ox, oy = TUN_AT[key]
        P.box('conc', ox - 6, ox + 6, oy, oy + WALL_T, 0.0, WALL_H)
        P.box('cut', ox - 6, ox + 6, oy + 0.02, oy + WALL_T - 0.02, WALL_H, WALL_H + 0.006)             # the cut: clean aggregate
        for i in range(24):                                                                              # its steel, cut with it
            x = ox - 5.75 + i * 0.5
            for yy in (oy + 0.07, oy + WALL_T - 0.07): P.box('rust', x - 0.012, x + 0.012, yy - 0.012, yy + 0.012, WALL_H, WALL_H + 0.012)
        for i in range(1, 5): P.box('conc_d', ox - 6 + i * 2.4 - 0.008, ox - 6 + i * 2.4 + 0.008, oy - 0.004, oy, 0.0, WALL_H)   # a joint every 2.4 m (an 8 ft section)
        P.box('green', ox - 6, ox + 6, oy - 0.006, oy, 0.0, 0.22)                                       # the slime line at the low flow
        P.box('conc_d', ox - 6, ox + 6, oy - 0.004, oy, 0.22, 0.5)                                      # the wet line over it
        for _ in range(9):                                                                               # water down the wall from the cut
            x = rng.uniform(ox - 5.8, ox + 5.8); P.box('conc_d', x, x + rng.uniform(0.04, 0.12), oy - 0.005, oy, rng.uniform(0.5, 1.2), WALL_H)
        if key == 'wall_ew_b': tags(P, ox - 5.5, ox + 5.5, oy, rng, 2)
        if key == 'wall_ew_c': water_marks(P, ox - 2.0, ox + 3.0, oy, rng)
    # THE WALL, north-south: the same wall seen along its length; the foot is the middle of its south end's base
    ox, oy = TUN_AT['wall_ns']
    P.box('conc', ox - WALL_T / 2, ox + WALL_T / 2, oy, oy + 12.0, 0.0, WALL_H)
    P.box('cut', ox - WALL_T / 2 + 0.02, ox + WALL_T / 2 - 0.02, oy + 0.02, oy + 11.98, WALL_H, WALL_H + 0.006)
    for i in range(24):
        y = oy + 0.25 + i * 0.5
        for xx in (ox - WALL_T / 2 + 0.07, ox + WALL_T / 2 - 0.07): P.box('rust', xx - 0.012, xx + 0.012, y - 0.012, y + 0.012, WALL_H, WALL_H + 0.012)
    P.box('green', ox - WALL_T / 2 - 0.006, ox + WALL_T / 2 + 0.006, oy - 0.006, oy + 12.0, 0.0, 0.22)
    # THE TRASH RACK across a culvert's end (north-south): posts every 2.4 m, two rails, bars a hand apart, what the water hung on it
    for key, gap in (('rack', None), ('mouth', (4.2, 7.4))):
        ox, oy = TUN_AT[key]
        for i in range(6): P.box('steel', ox - 0.06, ox + 0.06, oy + i * 2.4 - 0.06 if i else oy, oy + i * 2.4 + 0.06 if i < 5 else oy + 12.0, 0.0, WALL_H)
        for z in (0.25, 1.62):
            if gap:
                P.box('steel', ox - 0.03, ox + 0.03, oy, oy + gap[0], z, z + 0.06); P.box('steel', ox - 0.03, ox + 0.03, oy + gap[1], oy + 12.0, z, z + 0.06)
            else: P.box('steel', ox - 0.03, ox + 0.03, oy, oy + 12.0, z, z + 0.06)
        y = oy + 0.18
        while y < oy + 11.9:
            if not gap or not (gap[0] < y - oy < gap[1]): P.box('rustbar', ox - 0.014, ox + 0.014, y - 0.014, y + 0.014, 0.0, WALL_H - 0.05)
            y += 0.18
        if gap:                                                                                          # pried open: the bars bent out and down, east
            for k in range(14):
                yy = oy + gap[0] + 0.15 + k * 0.22; lean = 0.5 + 0.3 * math.sin(k * 1.3)
                P.bar('rustbar', (ox, yy, 0.0), (ox + lean * 0.9, yy + rng.uniform(-0.1, 0.1), 0.95 + 0.4 * rng.rand()), 0.016)
            P.bar('steel', (ox + 0.25, oy + gap[0] + 0.1, 0.05), (ox + 0.5, oy + gap[1] - 0.2, 0.08), 0.03)      # the top rail, on the floor
        for _ in range(26 if not gap else 16):                                                           # the wrack on its upstream face
            yy = oy + rng.uniform(0.2, 11.8)
            if gap and gap[0] - 0.2 < yy - oy < gap[1] + 0.2: continue
            z = rng.uniform(0.0, 1.1) ** 1.6; L = rng.uniform(0.4, 1.1)
            P.bar('wood_d', (ox - 0.06, yy - L / 2, z), (ox - 0.1 - rng.uniform(0, 0.25), yy + L / 2, z + rng.uniform(-0.1, 0.25)), 0.02)
        for _ in range(8):
            yy = oy + rng.uniform(0.3, 11.7)
            if gap and gap[0] - 0.3 < yy - oy < gap[1] + 0.3: continue
            z = rng.uniform(0.1, 1.3); P.box(rng.choice(['white', 'blue', 'cloth_r']), ox - 0.1, ox - 0.05, yy, yy + rng.uniform(0.2, 0.45), z, z + rng.uniform(0.15, 0.4))
    # ON HIS PHONE A TILE IS 60 TO 130 PX AND A MAN STANDS A TILE TALL (the person never zooms): a camp at a mattress and a
    # cart was a speck (measured on the page 11/11: 27 px). So each of these is what a house-sized tile of a tunnel holds:
    # an encampment, a shelter, a whole jam, still every thing in it in metres.
    def pallet_bed(x, y, cover, pillow='cloth', L=2.0, Wd=1.0):
        for k in range(3): P.box('wood', x, x + L, y + k * (Wd - 0.14) / 2, y + 0.14 + k * (Wd - 0.14) / 2, 0.0, 0.1)
        for k in range(int(L / 0.28)): P.box('wood', x + k * 0.28, x + k * 0.28 + 0.13, y, y + Wd, 0.1, 0.125)
        P.box('mat_', x + 0.05, x + L - 0.05, y + 0.05, y + Wd - 0.05, 0.125, 0.32)
        P.box(cover, x + 0.08, x + L * 0.68, y + 0.07, y + Wd - 0.07, 0.32, 0.38 + rng.uniform(0, 0.05)); P.box(pillow, x + L * 0.74, x + L - 0.1, y + 0.2, y + Wd - 0.2, 0.32, 0.43)

    def cart(cx, cy, load=('black', 'white', 'cloth_r')):
        for (a_, b_) in (((cx - 0.3, cy), (cx + 0.3, cy)), ((cx - 0.3, cy + 0.75), (cx + 0.3, cy + 0.75))):
            P.bar('steel', (a_[0], a_[1], 0.28), (b_[0], b_[1], 0.28), 0.014); P.bar('steel', (a_[0], a_[1], 0.9), (b_[0], b_[1], 0.9), 0.014)
        for xx in (cx - 0.3, cx + 0.3):
            P.bar('steel', (xx, cy, 0.28), (xx, cy + 0.75, 0.28), 0.014); P.bar('steel', (xx, cy, 0.9), (xx, cy + 0.75, 0.9), 0.014)
            for yy in (cy, cy + 0.75): P.bar('steel', (xx, yy, 0.05), (xx, yy, 0.9), 0.014)
            for k in range(1, 5): P.bar('steel', (xx, cy + k * 0.15, 0.28), (xx, cy + k * 0.15, 0.9), 0.007)
        for k in range(1, 4): P.bar('steel', (cx - 0.3 + k * 0.15, cy, 0.28), (cx - 0.3 + k * 0.15, cy, 0.9), 0.007)
        P.box(load[0], cx - 0.27, cx + 0.27, cy + 0.04, cy + 0.4, 0.3, 1.05); P.box(load[1], cx - 0.25, cx + 0.25, cy + 0.4, cy + 0.72, 0.3, 0.98)
        P.box(load[2], cx - 0.2, cx + 0.2, cy + 0.1, cy + 0.6, 1.0, 1.14)
        for (wx, wy) in ((cx - 0.28, cy + 0.04), (cx + 0.28, cy + 0.04), (cx - 0.28, cy + 0.7), (cx + 0.28, cy + 0.7)): P.wheel('rubber', wx, wy, 0.06, 0.06, 0.03, 10)

    def chair(chx, chy, col='rustp'):
        for (a_, b_) in ((-0.22, -0.2), (0.22, -0.2), (-0.22, 0.2), (0.22, 0.2)): P.bar('steel', (chx + a_, chy + b_, 0.0), (chx + a_, chy + b_, 0.44 if b_ < 0 else 0.9), 0.014)
        P.box(col, chx - 0.24, chx + 0.24, chy - 0.22, chy + 0.22, 0.42, 0.47); P.box(col, chx - 0.24, chx + 0.24, chy + 0.19, chy + 0.23, 0.55, 0.9)

    def tarp(x0, x1, yb, zb0, yf, zf0, mat='blue', fold='blue_d', n=10):
        """a tarp from a sagging cord at the back down to a lower edge in front, bellied; its poles and guy lines"""
        xs = [x0 + (x1 - x0) * i / n for i in range(n + 1)]; ym = (yb + yf) / 2
        zb = [zb0 - 0.1 * math.sin(math.pi * i / n) + rng.uniform(-0.015, 0.015) for i in range(n + 1)]
        zm = [(zb0 + zf0) / 2 - 0.2 * math.sin(math.pi * i / n) + rng.uniform(-0.05, 0.05) for i in range(n + 1)]
        zf = [zf0 - 0.07 * math.sin(math.pi * i / n) + rng.uniform(-0.02, 0.02) for i in range(n + 1)]
        for i in range(n):
            for (ya, za, yb_, zb_) in ((yb, zb, ym, zm), (ym, zm, yf, zf)):
                P._add(mat if (i + (ya > ym)) % 3 else fold, [(xs[i], ya, za[i]), (xs[i + 1], ya, za[i + 1]), (xs[i + 1], yb_, zb_[i + 1]), (xs[i], yb_, zb_[i])], [(0, 1, 2, 3), (3, 2, 1, 0)])
        for xx in (x0, x1):
            P.box('steel', xx - 0.025, xx + 0.025, yb - 0.025, yb + 0.025, 0.0, zb0 + 0.05); P.box('steel', xx - 0.025, xx + 0.025, yf - 0.025, yf + 0.025, 0.0, zf0)
            sgn = -1 if xx == x0 else 1
            P.bar('black', (xx, yf, zf0), (xx + sgn * 0.45, yf - 0.7, 0.0), 0.01); P.box('conc_d', xx + sgn * 0.45 - 0.13, xx + sgn * 0.45 + 0.13, yf - 0.83, yf - 0.57, 0.0, 0.15)
        P.bar('black', (x0, yb, zb0 + 0.02), (x1, yb, zb0 + 0.02), 0.012)

    # A CAMP ON THE WALL: three beds on pallets off the wet, a rug between them, two loaded carts, a table made of a door, the
    # line of washing, a couch somebody carried a mile underground; on the table a candle in a jar, still burning
    ox, oy = TUN_AT['camp_a']
    P.box('rug', ox - 2.6, ox + 1.0, oy + 0.9, oy + 3.3, 0.0, 0.012); P.box('rug_b', ox - 2.4, ox + 0.8, oy + 1.1, oy + 3.1, 0.012, 0.016)
    pallet_bed(ox - 4.9, oy + 3.2, 'blue'); pallet_bed(ox - 4.9, oy + 1.6, 'cloth_r', 'white'); pallet_bed(ox - 2.2, oy + 3.6, 'cloth', 'cloth_r')
    cart(ox + 3.9, oy + 3.3); cart(ox + 4.7, oy + 2.2, ('white', 'blue', 'black'))
    P.box('wood_d', ox + 1.3, ox + 3.3, oy + 3.4, oy + 4.3, 0.74, 0.79)                                    # the table: a door on two crates
    for cx_ in (ox + 1.45, ox + 2.85): P.box('wood', cx_, cx_ + 0.4, oy + 3.5, oy + 4.2, 0.0, 0.74)
    P.drum('flame', ox + 2.3, oy + 3.85, 0.79, 0.794, 0.34, 16)                                            # its light on the table
    P.drum('jug', ox + 2.3, oy + 3.85, 0.794, 1.04, 0.07, 10); P.drum('wax', ox + 2.3, oy + 3.85, 1.04, 1.046, 0.06, 8)
    P.drum('flame', ox + 2.3, oy + 3.85, 1.046, 1.2, 0.035, 6, 0.008)                                      # rule 20: still burning, and nobody is here
    P.box('jug', ox + 1.5, ox + 1.72, oy + 3.6, oy + 3.8, 0.79, 1.07); P.box('can', ox + 2.9, ox + 3.0, oy + 3.6, oy + 3.7, 0.79, 0.91)
    P.box('couch', ox + 1.2, ox + 3.3, oy + 0.9, oy + 1.8, 0.0, 0.42); P.box('couch', ox + 1.2, ox + 3.3, oy + 1.6, oy + 1.85, 0.42, 0.9)   # the couch, its back to the wall side
    for sx_ in (ox + 1.2, ox + 3.1): P.box('couch', sx_, sx_ + 0.2, oy + 0.9, oy + 1.8, 0.42, 0.62)
    P.box('stain', ox + 1.7, ox + 2.5, oy + 0.95, oy + 1.5, 0.42, 0.425)
    for xx in (ox - 2.9, ox + 0.9):                                                                        # the washing line
        P.box('steel', xx - 0.02, xx + 0.02, oy + 4.9, oy + 4.94, 0.0, 1.7)
    P.bar('black', (ox - 2.9, oy + 4.92, 1.68), (ox + 0.9, oy + 4.92, 1.68), 0.008)
    for i, c_ in enumerate(('white', 'cloth_r', 'blue', 'cloth', 'white', 'rustp')):
        x_ = ox - 2.7 + i * 0.6; P.box(c_, x_, x_ + rng.uniform(0.3, 0.5), oy + 4.9, oy + 4.93, 1.68 - rng.uniform(0.5, 0.95), 1.68)
    for i in range(6): P.box('jug', ox - 0.4 + i * 0.3, ox - 0.18 + i * 0.3, oy + 4.3 + (i % 2) * 0.25, oy + 4.5 + (i % 2) * 0.25, 0.0, 0.3)
    P.box('wood', ox - 4.6, ox - 3.9, oy + 0.3, oy + 0.9, 0.0, 0.4); chair(ox - 3.2, oy + 0.5, 'teal')
    # A LEAN-TO: a big tarp from a cord down to a lower edge, a second smaller one beside it, the beds half under them, chairs round
    # a drum out front, the water jugs in a row
    ox, oy = TUN_AT['camp_b']
    tarp(ox - 4.9, ox + 1.4, oy + 4.6, 1.95, oy + 2.4, 1.3)
    tarp(ox + 2.0, ox + 4.9, oy + 4.2, 1.7, oy + 2.6, 1.15, 'tan', 'tan_d', 6)
    P.box('tape', ox - 2.6, ox - 1.5, oy + 3.3, oy + 3.7, 1.66, 1.664)                                      # a patch taped over a tear
    pallet_bed(ox - 4.5, oy + 2.0, 'cloth', 'white', 2.0, 1.1); pallet_bed(ox - 1.9, oy + 2.1, 'cloth_r', 'cloth'); pallet_bed(ox + 2.4, oy + 2.2, 'blue', 'white', 2.0, 1.0)
    P.drum('rustbar', ox + 0.4, oy + 0.7, 0.0, 0.85, 0.3, 16); P.drum('black', ox + 0.4, oy + 0.7, 0.85, 0.855, 0.27, 14)   # the drum they sat round: cold
    chair(ox - 0.7, oy + 0.3); chair(ox + 1.5, oy + 0.4, 'teal'); chair(ox + 0.5, oy - 0.45, 'white')
    for i in range(7): P.box('jug', ox - 4.6 + i * 0.3, ox - 4.38 + i * 0.3, oy + 0.6 + (i % 2) * 0.26, oy + 0.8 + (i % 2) * 0.26, 0.0, 0.3)
    for i in range(7): P.box('teal', ox - 4.54 + i * 0.3, ox - 4.44 + i * 0.3, oy + 0.65 + (i % 2) * 0.26, oy + 0.75 + (i % 2) * 0.26, 0.3, 0.34)
    P.box('rustp', ox + 3.3, ox + 3.65, oy + 0.9, oy + 1.25, 0.0, 0.28); P.box('wood', ox + 3.8, ox + 4.6, oy + 0.8, oy + 1.5, 0.0, 0.45); cart(ox - 2.4, oy + 0.3, ('black', 'black', 'blue'))
    # THE FLOOD'S JAM: what the last one left across the channel, a tile wide: a trunk it carried in, two carts, a mattress
    # folded over them, a door, tyres, pallets, a fridge, branches, plastic, all lying downstream, the silt it stopped behind it
    ox, oy = TUN_AT['jam']
    for _ in range(46):                                                                                 # the silt it stopped: a bank with no straight edge
        sx_ = ox + rng.uniform(-5.0, 5.0); sy_ = oy + 1.15 + rng.normal(0, 0.75); rr = rng.uniform(0.5, 1.2) * (1.0 - 0.5 * abs(sx_ - ox) / 5.0)
        P.drum('silt', sx_, sy_, 0.0, rng.uniform(0.04, 0.13), rr, 14, rr * 0.7)
    P.bar('wood_d', (ox - 4.8, oy + 1.5, 0.3), (ox + 2.6, oy + 0.7, 0.42), 0.22)                             # the trunk
    for (bx_, by_, bz_) in ((ox + 2.6, oy + 0.7, 0.42), (ox + 1.0, oy + 0.9, 0.4)):
        for k in range(4): P.bar('wood_d', (bx_, by_, bz_), (bx_ + rng.uniform(0.6, 1.6), by_ + rng.uniform(-1.0, 1.0), bz_ + rng.uniform(0.2, 1.1)), 0.05)
    P.box('mat_', ox - 3.4, ox - 1.3, oy + 0.9, oy + 1.15, 0.0, 1.05); P.box('stain', ox - 3.0, ox - 2.0, oy + 0.88, oy + 0.9, 0.2, 0.8)
    P.poly('wood', [(ox + 0.2, oy + 0.2), (ox + 2.2, oy + 0.55), (ox + 2.1, oy + 0.67), (ox + 0.15, oy + 0.32)], 0.0, 0.9)             # a door, wedged
    P.box('white', ox + 3.0, ox + 3.75, oy + 0.6, oy + 2.3, 0.0, 0.7); P.box('black', ox + 3.1, ox + 3.65, oy + 0.58, oy + 0.6, 0.1, 0.6)   # a fridge on its back
    for cxx in (ox - 4.4, ox - 0.6):                                                                       # two carts, on their sides
        for k in range(6):
            P.bar('steel', (cxx + k * 0.16, oy + 0.15, 0.02), (cxx + k * 0.16, oy + 0.15, 0.62), 0.009); P.bar('steel', (cxx, oy + 0.15, 0.02 + k * 0.12), (cxx + 0.9, oy + 0.15, 0.02 + k * 0.12), 0.009)
        P.box('steel', cxx - 0.02, cxx + 0.92, oy + 0.13, oy + 0.75, 0.0, 0.03); P.wheel('rubber', cxx + 0.95, oy + 0.35, 0.3, 0.06, 0.03, 10); P.wheel('rubber', cxx + 0.95, oy + 0.35, 0.55, 0.06, 0.03, 10)
    for (tx_, ty_, tz_) in ((ox + 1.2, oy - 0.05, 0.34), (ox - 2.0, oy + 0.1, 0.34), (ox + 4.3, oy + 0.3, 0.34)):
        P.wheel('rubber', tx_, ty_, tz_, 0.34, 0.22, 16); P.wheel('black', tx_, ty_ - 0.115, tz_, 0.19, 0.02, 12)
    for k in range(3): P.box('wood', ox - 1.2 + k * 0.1, ox + 0.0 + k * 0.1, oy + 1.5 + k * 0.05, oy + 2.5 + k * 0.05, 0.14 + k * 0.13, 0.26 + k * 0.13)   # pallets, shoved up
    for _ in range(60):
        x = ox + rng.uniform(-5.0, 4.8); y = oy + rng.uniform(-0.2, 2.2); L = rng.uniform(0.8, 2.6); z = rng.uniform(0.0, 1.0) ** 1.5
        P.bar('wood_d', (x - L / 2, y, z), (x + L / 2, y + rng.uniform(-0.35, 0.35), z + rng.uniform(-0.05, 0.4)), rng.uniform(0.015, 0.045))
    for _ in range(16):
        x = ox + rng.uniform(-4.8, 4.5); z = rng.uniform(0.2, 0.95); y = oy + rng.uniform(0.0, 0.5)
        P.box(rng.choice(['white', 'blue', 'cloth_r', 'cloth']), x, x + rng.uniform(0.25, 0.6), y, y + 0.06, z, z + rng.uniform(0.15, 0.4))
    # THE RUNGS UP TO A STREET GRATE: steel staples in the wall, a hand apart, going up out of the cut; the light comes down them
    ox, oy = TUN_AT['ladder']
    P.box('conc', ox - 0.55, ox + 0.55, oy, oy + 0.22, 0.0, 2.75)
    P.box('cut', ox - 0.53, ox + 0.53, oy + 0.02, oy + 0.2, 2.75, 2.756)
    for k in range(8):
        z = 0.35 + k * 0.3
        P.bar('rustbar', (ox - 0.2, oy - 0.14, z), (ox + 0.2, oy - 0.14, z), 0.014)
        for sx in (-1, 1): P.bar('rustbar', (ox + sx * 0.2, oy - 0.14, z), (ox + sx * 0.2, oy, z), 0.014)
        P.box('conc_d', ox - 0.03 + (k % 2) * 0.3 - 0.15, ox + 0.0 + (k % 2) * 0.3 - 0.15, oy - 0.004, oy, max(0.0, z - 0.3), z)       # rust down the wall under each
    P.box('green', ox - 0.55, ox + 0.55, oy - 0.006, oy, 0.0, 0.22)


# each piece's own ground on the sheet (west, east, south, north of its foot, metres): what is inside it is that piece
TUN_FOOT = dict(wall_ew=(-6.1, 6.1, -0.1, 0.45), wall_ew_b=(-6.1, 6.1, -0.1, 0.45), wall_ew_c=(-6.1, 6.1, -0.1, 0.45), wall_ns=(-0.3, 0.3, -0.1, 12.1),
                rack=(-0.6, 1.3, -0.1, 12.1), mouth=(-0.6, 1.3, -0.1, 12.1), camp_a=(-5.6, 5.6, -0.5, 5.6), camp_b=(-5.6, 5.6, -1.3, 5.3), jam=(-5.7, 5.7, -0.7, 3.5),
                ladder=(-0.7, 0.7, -0.3, 0.4))


class OnePiece(FW.Parts):
    """the parts of one piece only (what stands on its own ground of the sheet), moved so its foot is the origin"""
    def __init__(s, at, box):
        super().__init__(); s.at = at; s.keep = box
    def _add(s, mat, verts, faces):
        cx = sum(v[0] for v in verts) / len(verts) - s.at[0]; cy = sum(v[1] for v in verts) / len(verts) - s.at[1]
        if s.keep[0] <= cx <= s.keep[1] and s.keep[2] <= cy <= s.keep[3]:
            super()._add(mat, [(v[0] - s.at[0], v[1] - s.at[1], v[2]) for v in verts], faces)


def models(which):
    """every piece's model as a file (reference/models/bohemia/<kit>_<piece>.glb), in metres, its foot at the origin: the same
    geometry the pictures are rendered from (COMBAT's THE FLOOD TUNNELS gate, T5: every piece has its picture and its model)"""
    import bpy
    NF, F, RIG = rig()
    AT, FOOT, parts, pre = (TUN_AT, TUN_FOOT, tunnel_parts, 'tunnel_') if which == 'tunnels' else (GAR_AT, GAR_FOOT, garage_parts, 'garage_')
    dst = os.path.join(R, 'reference', 'models', 'bohemia'); out = {}
    for key in FOOT:
        bpy.ops.wm.read_factory_settings(use_empty=True)
        M = piece_mats(bpy, NF, F, which)
        P = OnePiece(AT[key], FOOT[key]); parts(P, np.random.RandomState(1200 + len('tun_pieces' if which == 'tunnels' else 'gar_pieces')))
        obs = P.build(bpy, pre + key, M)
        fn = os.path.join(dst, pre + key + '.glb')
        bpy.ops.export_scene.gltf(filepath=fn, export_format='GLB', use_selection=False, export_apply=True)
        out[key] = (len(obs), os.path.getsize(fn))
    print('models', out)


def piece_mats(bpy, NF, F, which):
    M = litter_mats(bpy, NF)
    M.update(cut=NF.material(bpy, 'in_cut_concrete', 'tape_grey', 3, 0.95), rustbar=NF.material(bpy, 'in_rusted_bar', 'clay_rust', 1, 0.95),
             silt=NF.material(bpy, 'in_silt', 'tape_masking', 2, 0.8), paint_w=NF.material(bpy, 'in_stall_paint', 'tape_grey', 4, 0.8),
             paint_y=NF.material(bpy, 'in_yellow_paint', 'clay_mustard', 2, 0.9), red=NF.material(bpy, 'in_red_paint', 'clay_rust', 2, 1.0),
             glass=NF.material(bpy, 'in_glass', 'glass_eye', 1, 1.0), lit=NF.material(bpy, 'in_lit', 'sodium', 3, 1.0))
    if which in ('gar_pieces', 'garage'): M.update(deck=F.ground_material(bpy, 'gar_deck'), white=F.ground_material(bpy, 'gar_white'))
    return M


def scene_pieces(which, quick=False):
    import bpy
    NF, F, RIG = rig()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    M = piece_mats(bpy, NF, F, which); rng = np.random.RandomState(1200 + len(which))
    P = FW.Parts()
    (tunnel_parts if which == 'tun_pieces' else garage_parts)(P, rng)
    things = P.build(bpy, which, M)
    for o in things:                                              # a raised bay's floor wears the dust the sheet's floor wears (the plan's 'pale' field, 0.1 everywhere)
        if o.name.endswith('_deck'):
            at = o.data.attributes.new('pale', 'FLOAT', 'POINT'); at.data.foreach_set('value', np.full(len(o.data.vertices), 0.1, np.float32))
    FW.catcher(bpy)
    # cloth, paint on a wall and wet things take a share of the rig's dust (wear_by_material goes by the material's name)
    RIG.G['wear_by_material'] = dict(RIG.G['wear_by_material'], in_cloth=0.3, in_tarp=0.3, in_mattress=0.5, in_paint=0.35, in_chalk=0.2, in_slime=0.1,
                                     in_black=0.3, in_flame=0.0, in_lit=0.0, in_stall=0.4, in_yellow=0.4, in_red=0.4, in_glass=0.2,
                                     gar_deck=0.42, gar_white=0.1)   # a raised bay's floor takes the dose the sheet's floor takes (0.25 of the guide's 0.6)
    RIG.source_pass(things, float(RIG.G['wear']), 1.0, 9); RIG.dent_pass(things, 1.0)
    zs = 1.0 / math.cos(math.radians(float(RIG.G['tilt_deg'])))
    for o in things: o.scale = (1, 1, zs)
    NF.grime_pass(bpy, [], 9)
    for m in bpy.data.materials:
        if m.use_nodes:
            for n in m.node_tree.nodes:
                if n.type in ('AMBIENT_OCCLUSION', 'BEVEL'): n.samples = 1
    FW.REND = REND
    return FW.shoot(bpy, F, RIG, which, quick, samples=64, transparent=True)


# ---- THE CUT (no Blender) ------------------------------------------------------------------------------------------------------
QS = 72                                                           # a sheet's quality (the casino carpet ships at 66; concrete carries less detail than a lattice)


def px(xm): return xm * PPM
def py(ym): return (SIDE - ym) / SIDE * H


def cut_piece(im, foot_m, box_m, name, folder, shadow=0.75):
    """one piece out of the pieces render: box_m = (west, east, south, north) metres round it; the foot the board lays it by;
    the catcher's shadow kept at a share (under the ground nothing casts a hard one)"""
    x0, x1 = int(px(box_m[0])), int(px(box_m[1])); y0, y1 = int(py(box_m[3])), int(py(box_m[2]))
    a = np.asarray(im.crop((x0, y0, x1, y1)), np.float32) / 255.0
    solid = a[..., :3].max(-1) > 0.05                              # the catcher's shadow is black with alpha; a thing has colour
    a[..., 3] = np.where(solid, a[..., 3], a[..., 3] * shadow)
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), 'RGBA'); bb = out.getbbox(); out = out.crop(bb)
    fx = px(foot_m[0]) - x0 - bb[0]; fy = py(foot_m[1]) - y0 - bb[1]
    out.save(os.path.join(FG, folder, name + '.webp'), 'WEBP', quality=86, method=6)
    return dict(w=out.width, h=out.height, foot=[round(fx, 1), int(round(fy))])


def cut_tunnels():
    ship = os.path.join(FG, 'tunnels'); os.makedirs(ship, exist_ok=True)
    out = {}
    for n in ('floor', 'channel', 'fill'):
        im = Image.open(os.path.join(REND, 'tun_%s.png' % n)).convert('RGB')
        fn = os.path.join(ship, 'tunnel_%s_0.webp' % n); im.save(fn, 'WEBP', quality=QS if n != 'fill' else 60, method=6); out[n] = os.path.getsize(fn)
    im = Image.open(os.path.join(REND, 'tun_pieces.png')).convert('RGBA')
    A = TUN_AT; sz = {}
    for k in ('wall_ew', 'wall_ew_b', 'wall_ew_c'):
        sz[k] = cut_piece(im, A[k], (A[k][0] - 6.0, A[k][0] + 6.0 + 0.01, A[k][1] - 0.05, A[k][1] + 3.2), 'tunnel_' + k, 'tunnels', 0.0)
    sz['wall_ns'] = cut_piece(im, A['wall_ns'], (A['wall_ns'][0] - 0.6, A['wall_ns'][0] + 1.6, A['wall_ns'][1] - 0.05, A['wall_ns'][1] + 15.2), 'tunnel_wall_ns', 'tunnels', 0.6)
    sz['rack'] = cut_piece(im, A['rack'], (A['rack'][0] - 0.8, A['rack'][0] + 1.7, A['rack'][1] - 0.05, A['rack'][1] + 15.2), 'tunnel_rack', 'tunnels', 0.6)
    sz['mouth'] = cut_piece(im, A['mouth'], (A['mouth'][0] - 0.8, A['mouth'][0] + 2.2, A['mouth'][1] - 0.4, A['mouth'][1] + 15.2), 'tunnel_mouth', 'tunnels', 0.6)
    sz['camp_a'] = cut_piece(im, (A['camp_a'][0], A['camp_a'][1] + 2.0), (A['camp_a'][0] - 5.6, A['camp_a'][0] + 6.4, A['camp_a'][1] - 0.4, A['camp_a'][1] + 8.2), 'tunnel_camp_a', 'tunnels')
    sz['camp_b'] = cut_piece(im, (A['camp_b'][0], A['camp_b'][1] + 2.0), (A['camp_b'][0] - 5.8, A['camp_b'][0] + 6.6, A['camp_b'][1] - 1.2, A['camp_b'][1] + 8.2), 'tunnel_camp_b', 'tunnels')
    sz['jam'] = cut_piece(im, (A['jam'][0], A['jam'][1] + 1.0), (A['jam'][0] - 5.6, A['jam'][0] + 6.4, A['jam'][1] - 0.8, A['jam'][1] + 5.6), 'tunnel_jam', 'tunnels')
    sz['ladder'] = cut_piece(im, A['ladder'], (A['ladder'][0] - 0.8, A['ladder'][0] + 1.4, A['ladder'][1] - 0.4, A['ladder'][1] + 4.6), 'tunnel_ladder', 'tunnels', 0.5)
    for k, v in sz.items(): v.update(piece=k, src='tunnels/tunnel_%s.webp' % k, facing='S', model='reference/models/bohemia/tunnel_%s.glb' % k)
    json.dump(sz, open(os.path.join(ship, 'sizes.json'), 'w'), indent=1)
    cells = lambda sheet, pick: ['tunnels/%s#%d,%d' % (sheet, c, r) for (c, r) in pick]
    allc = [(c, r) for r in range(5) for c in range(5)]
    art = {
        'version': 'cook5-tunnels-art-11-11', 'lane': 'cook 5', 'stage': 'finished',
        'for': "COMBAT's flood tunnels board (slices/bohemia_flood_tunnels.js, tunnels.json; on main since BUILD 11/11c): its tunnels.json names these three lists as its \"floor\" (they replaced the wash block's and the landfill's tiles) and sizes.json here is the pieces' (the same names, each laid by the same foot)",
        'floor': {'floor': cells('tunnel_floor_0.webp', allc), 'channel': cells('tunnel_channel_0.webp', allc), 'fill': cells('tunnel_fill_0.webp', allc)},
        'pieces': {k: dict(src=v['src'], w=v['w'], h=v['h'], foot=v['foot']) for k, v in sz.items()},
        'wall_variants': "tunnel_wall_ew is the wall alone (the board lays it on every tile); tunnel_wall_ew_b (painted) and tunnel_wall_ew_c (the water's marks) are the same canvas and foot: lay one in five or so by the tile's own dice, never two alike side by side",
        'how_it_joins': 'the board picks any tile of a sheet for any place: the slab joints (4 m) fall on every tile edge and everything bigger than a hand fades out before it; a floor tile beside a channel tile is the drain\'s dry lip over the wet channel',
        'bytes': out,
    }
    json.dump(art, open(os.path.join(ship, 'tunnels_art.json'), 'w'), indent=1)
    # THE BOARD'S OWN DATA FILE (COMBAT's, on main since BUILD 11/11c): the three ground lists name these sheets, and the seven
    # pieces this tool remade say so. Nothing else in it is touched (its layouts, legend, tiles, flood, lights, dress are COMBAT's)
    tj = os.path.join(ship, 'tunnels.json')
    if os.path.exists(tj):
        raw = open(tj).read(); a = raw.index(' "floor": {"floor": ['); b = raw.index(' "lights": {', a)
        row = lambda key, sheet: '"%s": [%s]' % (key, ', '.join('"%s"' % c for c in cells(sheet, allc)))
        new = ' "floor": {' + row('floor', 'tunnel_floor_0.webp') + ',\n           ' + row('channel', 'tunnel_channel_0.webp') + ',\n           ' + row('fill', 'tunnel_fill_0.webp') + '},\n'
        raw = raw[:a] + new + raw[b:]
        k0 = raw.index(' "kit": {'); k1 = raw.index(' },', k0)
        raw = raw[:k0] + raw[k0:k1].replace('"stage": "stand_in"', '"stage": "finished"') + raw[k1:]
        json.loads(raw); open(tj, 'w').write(raw)
    print('tunnels: sheets', out, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


# ======================================================================================================================
# GARAGE: THE PARKING GARAGE (slices/fight_ground/garage/), on the casino floor's recipe (rule 440(a): 'levels as high
# ground, ramps, pillars, dead cars'). No board is laid yet, so this is a kit a board can be laid from, each piece named for
# what COMBAT's casino kit calls its like (a floor list by kind, HEIGHT pieces for a raised level and its ramps, WALL and
# COVER pieces laid by a foot): a split-level garage (the valley's casino garages are: half a storey between bays, 1.42 m,
# a short ramp between them, a guard rail on the upper bay's edge).
#   garage_floor_0   one 60 m sheet: rows 0 and 1 are STALLS (two rows of 2.4 m stalls nose to nose, a wheel stop each, the
#                    line between them), rows 2 to 4 the AISLE (two ways, tyre-black in the wheel paths, an arrow here and there)
#   the pieces       a raised bay (1.42 m, its top the stalls' floor or the aisle's), the ramp up to it (climbing east, and west),
#                    the guard rail (both ways), the outer wall's spandrel (both ways), a column, the stair and lift core,
#                    the pay booth and its arm
# ANALOG HORROR (rule 20): where a car stood for years the floor is clean in its shape, stall after stall, and the cars are
# gone; one oil trail runs down the middle of every aisle and never ends; the lift's doors are bent open a hand's width,
# outward.
# REFERENCE CHECK: the Strip's and downtown's parking structures (precast double tees on a 18 m module: a 7.3 m aisle between
# two 5.5 m stall rows, 2.6 m stalls, 3 m floor to floor; split levels with speed ramps; concrete wheel stops pinned by two
# bars; a 1.07 m spandrel at the edge; yellow column guards; a stair and lift core at a corner; a booth and a gate arm at
# the way out); the photographs of the abandoned garages of the 2008 crash (dust shapes where the last cars stood). Here the
# stall is 2.4 m (five to a 12 m tile, so any tile meets any tile) and the aisle one tile.
# ======================================================================================================================
LEVEL_H = 1.42
STALL_ROWS, AISLE_ROWS = (0, 1), (2, 3, 4)


def plan_gar_floor(ID, seed=53):
    xm, ty, lx, ly, col, row = tgrid(); rng = np.random.RandomState(seed); w = win(lx, ly, 0.5, 1.5)
    gid = np.full((H, W), ID['gar_deck'], np.uint8)
    st = np.isin(row, STALL_ROWS); ai = ~st
    n2 = FW.vnoise((H, W), 0.5 * PPM, rng); n3 = FW.vnoise((H, W), 0.18 * PPM, rng)
    dust = mixn(FW.vnoise((H, W), 2.5 * PPM, rng), pnoise(rng, 2.5), w)
    pale = 0.1 + np.clip((dust - 0.5) / 0.3, -0.5, 1) * 0.08                # forty years of dust, a little everywhere (more read as the sand he is tired of)
    dark = np.zeros((H, W), np.float32)
    # THE STALLS: a line every 2.4 m (five to a tile: a line on every tile's edge), 5.5 m deep from the aisle either side, one line between the two rows
    k = np.minimum(lx % 2.4, 2.4 - lx % 2.4)
    gid[st & (k < 0.05) & ((ly < 5.5) | (ly > 6.5))] = ID['gar_white']
    gid[st & (np.abs(ly - 6.0) < 0.05)] = ID['gar_white']
    sx = (lx // 2.4).astype(int)                                           # which stall of the tile
    cxs = sx * 2.4 + 1.2
    for half, (ya, yb, yn) in enumerate(((0.0, 5.5, 4.1), (6.5, 12.0, 7.9))):
        inrow = st & (ly >= ya) & (ly < yb)
        key = (col * 5 + sx) * 2 + half + row * 50                         # one number a stall
        rr = np.random.RandomState(seed + 1).rand(600)[key % 600]
        # the oil under where the engine sat
        d = np.sqrt((lx - cxs) ** 2 + ((ly - yn) * 0.8) ** 2)
        dark = np.maximum(dark, inrow * np.clip(1.0 - d / (0.35 + 0.5 * rr), 0, 1) * (0.35 + 0.6 * rr) * (0.6 + 0.4 * n2))
        # rule 20: where a car stood for years the floor is clean in its shape (the dust never fell there), stall after stall
        ghost = inrow & (rr > 0.42)
        yc = (ya + yb) / 2 + (0.25 if half == 0 else -0.25)
        inside = np.clip((0.92 - np.abs(lx - cxs)) / 0.1, 0, 1) * np.clip((2.15 - np.abs(ly - yc)) / 0.12, 0, 1)
        pale = np.where(ghost, pale * (1 - 0.85 * inside), pale)
        dark = np.maximum(dark, ghost * inside * 0.2)
        for wx in (-0.72, 0.72):                                           # and the four places its tyres sat
            for wy in (-1.35, 1.35):
                dd = np.maximum(np.abs(lx - cxs - wx) / 0.11, np.abs(ly - yc - wy) / 0.3)
                dark = np.maximum(dark, ghost * np.clip(1.3 - dd, 0, 1) * 0.5)
    # the tyre-black where they turned in off the aisle
    turn = mixn(FW.vnoise((H, W), 1.3 * PPM, rng), pnoise(rng, 1.3), w)
    edge_n = np.clip(1 - ly / 2.2, 0, 1) + np.clip(1 - (TM - ly) / 2.2, 0, 1)
    dark = np.maximum(dark, st * edge_n * np.clip((turn - 0.55) / 0.2, 0, 1) * 0.3 * (n3 > 0.35))
    # THE AISLE: two ways; the wheel paths black with rubber, darkest where they brake
    lane = pnoise(rng, 1.5, 4.0)
    for c0 in (2.3, 4.1, 7.9, 9.7):
        dark = np.maximum(dark, ai * np.clip(1 - np.abs(ly - c0) / 0.42, 0, 1) * (0.14 + 0.2 * lane) * (0.6 + 0.4 * n3))
    # an arrow here and there (keep right: east on the south side, west on the north)
    arrows = np.zeros((H, W), bool)
    for (c, r) in ((0, 2), (2, 2), (4, 2), (1, 3), (3, 3), (0, 4), (2, 4), (4, 4)):
        for (fy, ang) in ((0.265, math.pi), (0.735, 0.0)):
            if rng.rand() < 0.75: arrows |= arrow(xm, ty, tile_c(c, r, 0.5 + rng.uniform(-0.12, 0.12), fy), ang, 2.6, 0.2)
    gid[arrows] = ID['gar_white']
    # rule 20: one oil trail down the middle of every aisle, tile after tile, and it never ends (the same line on every tile's edge)
    wob = pnoise(rng, 2.0, 2.0)
    yl = 6.0 + 0.55 * np.sin(2 * math.pi * lx / TM) + (wob - 0.5) * 0.9
    dark = np.maximum(dark, ai * np.clip(1 - np.abs(ly - yl) / (0.05 + 0.07 * n2), 0, 1) * 0.92)
    dark = np.maximum(dark, ai * (np.abs(ly - yl) < 0.5) * (n3 > 0.8) * (n2 > 0.55) * 0.7)          # and its drips beside it
    # water through the slab above: a stain here and there, rust in it
    leak = FW.vnoise((H, W), 1.8 * PPM, rng) * win(lx, ly, 0.6, 1.2)                                  # (few and inside a tile: a shared edge would repeat them)
    tl = top(leak, 0.035); dark = np.maximum(dark, np.clip((leak - tl) / 0.05 + 0.4, 0, 1) * (leak > tl) * 0.3)
    return gid, np.clip(dark, 0, 1), np.clip(pale, 0, 1)


PLANS['gar_floor'] = plan_gar_floor


def gar_floor_things(bpy, NF, M, rng):
    """the wheel stops (one a stall, pinned by two bars, most still there, a few knocked askew), broken glass, what blew in"""
    P = FW.Parts(); stops, glass = [], []
    for r in STALL_ROWS:
        for c in range(5):
            for sxi in range(5):
                x = c * TM + sxi * 2.4 + 1.2
                for half, yn in enumerate((4.95, 7.05)):
                    if rng.rand() < 0.1: continue                                            # gone
                    y_s = r * TM + yn; y = SIDE - y_s
                    rz = rng.normal(0, 0.03) if rng.rand() > 0.12 else rng.uniform(-0.5, 0.5)
                    stops.append((x + rng.normal(0, 0.03), y, 0.0, 1.8, 0.16, 0.11, rz, 0.0))
    for _ in range(40):
        x, y = rng.uniform(0, 60), rng.uniform(0, 60)
        for _k in range(rng.randint(5, 14)): glass.append((x + rng.normal(0, 0.35), y + rng.normal(0, 0.35), 0.0, 0.04, 0.04, 0.02, rng.uniform(0, 6.3), 0.0))
    out = inst(bpy, NF, 'gar_stops', stops, M['stop'], rng, 0.04) + inst(bpy, NF, 'gar_glass', glass, M['glassbit'], rng, 0.3)
    out += FW.debris(bpy, NF, {'rubber': M['rubber'], 'card': M['card'], 'paper': M['paper']}, rng, lambda r_: (r_.uniform(0, 60), r_.uniform(0, 60)), 40)
    return out


GARAGE_THINGS = {'gar_floor': gar_floor_things}
GAR_AT = dict(level=(10.0, 44.0), level_aisle=(26.0, 44.0), ramp_e=(42.0, 44.0), ramp_w=(10.0, 26.0), rail_ew=(26.0, 38.0), rail_ns=(52.5, 4.0), wall_ew=(26.0, 34.0),
              wall_ns=(56.0, 4.0), column=(21.0, 28.0), core=(28.0, 16.0), booth=(40.0, 22.0), column_b=(21.0, 21.0))


def guard_rail_x(P, x0, x1, y, z):
    """a W-beam guard rail along x on a kerb, posts 2 m apart"""
    P.box('conc', x0, x1, y - 0.12, y + 0.12, z, z + 0.16)
    P.box('must', x0, x1, y - 0.125, y - 0.12, z, z + 0.16)
    x = x0 + 0.5
    while x < x1: P.box('rust', x - 0.05, x + 0.05, y - 0.04, y + 0.06, z + 0.16, z + 0.86); x += 2.0
    P.prism_x('steel', x0, x1, [(y - 0.06, z + 0.5), (y - 0.1, z + 0.58), (y - 0.06, z + 0.66), (y - 0.1, z + 0.74), (y - 0.06, z + 0.82), (y - 0.04, z + 0.82), (y - 0.04, z + 0.5)])


def guard_rail_y(P, y0, y1, x, z):
    P.box('conc', x - 0.12, x + 0.12, y0, y1, z, z + 0.16)
    y = y0 + 0.5
    while y < y1: P.box('rust', x - 0.05, x + 0.05, y - 0.05, y + 0.05, z + 0.16, z + 0.86); y += 2.0
    P.box('steel', x - 0.09, x - 0.05, y0, y1, z + 0.5, z + 0.82)


def deck_top(P, x0, x1, y0, y1, z, stalls):
    """a raised bay's own floor: the garage's deck, and its stall lines if it is a stall bay (the same 2.4 m, 5.5 m and middle line as the sheet)"""
    P.box('deck', x0, x1, y0, y1, z - 0.02, z)
    if stalls:
        for i in range(6):
            x = min(max(x0 + i * 2.4, x0 + 0.05), x1 - 0.05)
            P.box('white', x - 0.05, x + 0.05, y0, y0 + 5.5, z, z + 0.004); P.box('white', x - 0.05, x + 0.05, y1 - 5.5, y1, z, z + 0.004)
        P.box('white', x0, x1, (y0 + y1) / 2 - 0.05, (y0 + y1) / 2 + 0.05, z, z + 0.004)
        for i in range(5):
            for yy in (y0 + 4.95, y1 - 4.95): P.box('stop', x0 + i * 2.4 + 0.3, x0 + i * 2.4 + 2.1, yy - 0.08, yy + 0.08, z, z + 0.11)


def garage_parts(P, rng):
    A = GAR_AT
    # A RAISED BAY (half a storey, 1.42 m): the foot is the middle of its south base line; its south face the split's wall
    for key, stalls in (('level', True), ('level_aisle', False)):
        ox, oy = A[key]
        P.box('conc', ox - 6, ox + 6, oy, oy + 12, 0.0, LEVEL_H - 0.02)
        deck_top(P, ox - 6, ox + 6, oy, oy + 12, LEVEL_H, stalls)
        for i in range(1, 4): P.box('conc_d', ox - 6 + i * 3.0 - 0.01, ox - 6 + i * 3.0 + 0.01, oy - 0.004, oy, 0.0, LEVEL_H)          # the wall's pours
        P.box('conc_d', ox - 6, ox + 6, oy - 0.005, oy, 0.0, 0.3)                                                                    # splash and tyre-black along its foot
        P.box('must', ox - 6, ox + 6, oy - 0.006, oy, LEVEL_H - 0.2, LEVEL_H - 0.02)                                                 # the yellow band under the edge
        for i in range(8):
            if i % 2 == 0: P.box('black', ox - 6 + i * 1.5, ox - 6 + i * 1.5 + 0.75, oy - 0.008, oy, LEVEL_H - 0.2, LEVEL_H - 0.02)
        for _ in range(7):
            x = rng.uniform(ox - 5.8, ox + 5.8); P.box('conc_d', x, x + rng.uniform(0.05, 0.14), oy - 0.007, oy, rng.uniform(0.2, 0.7), LEVEL_H - 0.2)
    # THE RAMP between two bays, one tile long (an eighth: 1.42 m in 12): its foot the middle of its south base line
    for key, sgn in (('ramp_e', 1), ('ramp_w', -1)):
        ox, oy = A[key]; xl, xh = (ox - 6, ox + 6) if sgn > 0 else (ox + 6, ox - 6)
        prof = [(xl, 0.0), (xh, 0.0), (xh, LEVEL_H)] if sgn > 0 else [(xh, 0.0), (xl, 0.0), (xh, LEVEL_H)]
        P.prism_y('conc', oy, oy + 12, prof)
        n = 20
        for i in range(n):                                                                                                         # its top: the deck, cut across with grooves
            xa = xl + (xh - xl) * i / n; xb = xl + (xh - xl) * (i + 1) / n; za = LEVEL_H * i / n; zb = LEVEL_H * (i + 1) / n
            q = [(xa, oy + 0.3, za + 0.03), (xb, oy + 0.3, zb + 0.03), (xb, oy + 11.7, zb + 0.03), (xa, oy + 11.7, za + 0.03)]
            P._add('deck', q, [(0, 1, 2, 3) if sgn > 0 else (3, 2, 1, 0)])
            xg = xa + (xb - xa) * 0.5; zg = (za + zb) / 2 + 0.045
            P._add('conc_d', [(xg - 0.02, oy + 0.3, zg), (xg + 0.02, oy + 0.3, zg), (xg + 0.02, oy + 11.7, zg), (xg - 0.02, oy + 11.7, zg)], [(0, 1, 2, 3), (3, 2, 1, 0)])
        for yy in (oy, oy + 11.7):                                                                                                 # a kerb each side, yellow
            pr = [(xl, 0.0), (xh, LEVEL_H), (xh, LEVEL_H + 0.18), (xl, 0.18)]
            P.prism_y('must', yy, yy + 0.3, pr if sgn < 0 else pr[::-1])
    # THE GUARD RAIL on a raised bay's edge
    ox, oy = A['rail_ew']; guard_rail_x(P, ox - 6, ox + 6, oy + 0.12, 0.0)
    ox, oy = A['rail_ns']; guard_rail_y(P, oy, oy + 12, ox, 0.0)
    # THE OUTER WALL: a precast spandrel 1.07 m high, the cars' side painted, the roof and the floors above cut away
    ox, oy = A['wall_ew']
    P.box('conc', ox - 6, ox + 6, oy, oy + 0.2, 0.0, 1.07)
    P.box('rustp', ox - 6, ox + 6, oy - 0.006, oy, 0.55, 0.8)
    for i in range(1, 3): P.box('conc_d', ox - 6 + i * 4.0 - 0.012, ox - 6 + i * 4.0 + 0.012, oy - 0.008, oy + 0.2, 0.0, 1.075)
    for _ in range(8):
        x = rng.uniform(ox - 5.8, ox + 5.8); P.box('conc_d', x, x + rng.uniform(0.04, 0.12), oy - 0.007, oy, 0.0, rng.uniform(0.5, 1.07))
    for i in range(5): P.box('black', ox - 5.2 + i * 2.4, ox - 4.5 + i * 2.4, oy - 0.007, oy, 0.18, 0.4)                               # bumper-black, a stall apart
    ox, oy = A['wall_ns']
    P.box('conc', ox - 0.1, ox + 0.1, oy, oy + 12, 0.0, 1.07)
    for i in range(1, 3): P.box('conc_d', ox - 0.108, ox + 0.108, oy + i * 4.0 - 0.012, oy + i * 4.0 + 0.012, 0.0, 1.075)
    # A COLUMN: 0.9 m square, cut at 2.6 m with its steel; a yellow guard round its foot, the bay's band and its plate
    # (on his phone a 0.6 m column was five pixels: this is a big garage's column, and its guard is what a man sees)
    for key, band in (('column', 'teal'), ('column_b', 'rustp')):
        ox, oy = A[key]; hw = 0.45
        P.box('conc', ox - hw, ox + hw, oy - hw, oy + hw, 0.0, 2.6); P.box('cut', ox - hw + 0.03, ox + hw - 0.03, oy - hw + 0.03, oy + hw - 0.03, 2.6, 2.606)
        for dx in (-0.3, 0.0, 0.3):
            for dy in (-0.3, 0.3): P.box('rust', ox + dx - 0.018, ox + dx + 0.018, oy + dy - 0.018, oy + dy + 0.018, 2.6, 2.65)
        P.box('must', ox - hw - 0.12, ox + hw + 0.12, oy - hw - 0.12, oy + hw + 0.12, 0.0, 1.1)
        for i in range(3): P.box('black', ox - hw - 0.125, ox + hw + 0.125, oy - hw - 0.125, oy + hw + 0.125, 0.14 + i * 0.34, 0.3 + i * 0.34)
        P.box(band, ox - hw - 0.006, ox + hw + 0.006, oy - hw - 0.006, oy + hw + 0.006, 1.5, 2.15); P.box('white', ox - 0.24, ox + 0.24, oy - hw - 0.012, oy - hw, 1.6, 2.05)
        P.box('conc_d', ox - hw - 0.13, ox - 0.1, oy - hw - 0.13, oy - hw - 0.12, 0.5, 0.9)                                             # where a bumper found it
    # THE STAIR AND LIFT CORE: block walls cut at 2.6 m, the stair's steel door ajar, the lift's doors bent open a hand's width, outward
    ox, oy = A['core']; cw, cd, ch = 3.0, 4.8, 2.6
    P.box('block', ox - cw, ox + cw, oy, oy + cd, 0.0, ch); P.box('cut', ox - cw + 0.03, ox + cw - 0.03, oy + 0.03, oy + cd - 0.03, ch, ch + 0.006)
    P.box('black', ox - cw + 0.2, ox + cw - 0.2, oy + 0.2, oy + cd - 0.2, ch + 0.006, ch + 0.012)                                    # the shaft and the stair, dark from above
    for k in range(1, 13): P.box('conc_d', ox - cw, ox + cw, oy - 0.004, oy, k * 0.2 - 0.004, k * 0.2 + 0.004)                        # the block's courses
    P.box('rustp', ox - cw, ox + cw, oy - 0.006, oy, 2.1, 2.4)                                                                       # the level's band
    P.box('black', ox - 2.5, ox - 1.5, oy - 0.01, oy, 0.0, 2.05); P.poly('steel', [(ox - 2.5, oy - 0.01), (ox - 1.72, oy - 0.62), (ox - 1.68, oy - 0.58), (ox - 2.46, oy + 0.03)], 0.0, 2.03)   # the stair door, ajar
    P.box('teal', ox - 1.3, ox - 0.7, oy - 0.012, oy, 1.5, 1.85)                                                                     # the stairs' plate
    P.box('steel', ox + 0.25, ox + 2.35, oy - 0.03, oy, 0.0, 2.2)                                                                    # the lift's frame
    P.box('black', ox + 0.4, ox + 2.2, oy - 0.035, oy - 0.03, 0.0, 2.1)
    P.poly('chrome', [(ox + 0.4, oy - 0.04), (ox + 1.24, oy - 0.04), (ox + 1.2, oy - 0.3), (ox + 1.16, oy - 0.3)][::-1], 0.0, 2.08)     # rule 20: bent out, from inside
    P.box('chrome', ox + 1.36, ox + 2.2, oy - 0.05, oy - 0.035, 0.0, 2.08)
    P.box('lit', ox + 2.42, ox + 2.52, oy - 0.012, oy, 1.05, 1.2)                                                                    # the call button, still lit
    for bx in (ox - 0.3, ox + 2.9): P.drum('must', bx, oy - 0.9, 0.0, 0.95, 0.09, 12)                                                # two bollards
    # THE WAY OUT: two pay booths on their islands across a tile, a lane each side; one arm still down and whole, one snapped off its post
    cx0, oy = A['booth']
    for bi, ox in enumerate((cx0 - 3.0, cx0 + 3.0)):
        P.box('conc', ox - 1.2, ox + 1.2, oy - 0.2, oy + 4.2, 0.0, 0.18); P.box('must', ox - 1.21, ox + 1.21, oy - 0.21, oy - 0.2, 0.0, 0.18)
        bx0, bx1, by0, by1 = ox - 0.85, ox + 0.85, oy + 1.2, oy + 3.8
        P.box('steel', bx0, bx1, by0, by1, 0.18, 1.1); P.box('teal' if bi == 0 else 'rustp', bx0 - 0.004, bx1 + 0.004, by0 - 0.004, by1 + 0.004, 0.45, 0.8)
        for (px_, py_) in ((bx0, by0), (bx1 - 0.07, by0), (bx0, by1 - 0.07), (bx1 - 0.07, by1 - 0.07)): P.box('steel', px_, px_ + 0.07, py_, py_ + 0.07, 1.1, 2.3)
        P.box('glass', bx0 + 0.07, bx1 - 0.07, by0, by0 + 0.02, 1.1, 2.3 if bi == 0 else 1.5)                                         # the second booth's front pane broken out
        P.box('glass', bx1 - 0.02, bx1, by0 + 0.07, by1 - 0.07, 1.1, 1.7 if bi == 0 else 2.3)
        P.box('steel', bx0 - 0.12, bx1 + 0.12, by0 - 0.12, by1 + 0.12, 2.3, 2.42); P.box('must', bx0 - 0.12, bx1 + 0.12, by0 - 0.126, by0 - 0.12, 2.3, 2.42)
        P.box('must', ox - 0.22, ox + 0.22, oy + 0.15, oy + 0.55, 0.18, 1.4); P.box('black', ox - 0.13, ox + 0.13, oy + 0.146, oy + 0.15, 0.95, 1.25)   # the ticket machine
        P.box('must', ox + 0.85, ox + 1.12, oy + 0.15, oy + 0.5, 0.18, 1.2)                                                         # the arm's post
        if bi == 0:                                                                                                                # this arm is down, and whole: nobody raised it
            for i in range(9):
                xa = ox + 1.12 + i * 0.4; P.box('rustp' if i % 2 else 'white', xa, xa + 0.4, oy + 0.28, oy + 0.36, 0.98, 1.1)
        else:
            P.bar('white', (ox + 1.12, oy + 0.32, 1.05), (ox + 1.9, oy + 0.26, 0.95), 0.05)                                         # a stump of the other
            for i in range(7):
                xa = ox + 2.0 + i * 0.4; P.box('rustp' if i % 2 else 'white', xa, xa + 0.4, oy - 1.0 + i * 0.07, oy - 0.9 + i * 0.07, 0.0, 0.07)


def cut_garage():
    ship = os.path.join(FG, 'garage'); os.makedirs(ship, exist_ok=True)
    im = Image.open(os.path.join(REND, 'gar_floor.png')).convert('RGB')
    fn = os.path.join(ship, 'garage_floor_0.webp'); im.save(fn, 'WEBP', quality=QS, method=6); bytes_ = {'floor': os.path.getsize(fn)}
    im = Image.open(os.path.join(REND, 'gar_pieces.png')).convert('RGBA'); A = GAR_AT; sz = {}
    hh = LEVEL_H * PPM / PYM                                           # how far a raised bay's top rides up the glass, in ground metres (2.0)
    def one(key, box, shadow=0.75, foot=None):
        sz[key] = cut_piece(im, foot or A[key], box, 'garage_' + key, 'garage', shadow)
    for key in ('level', 'level_aisle', 'ramp_e', 'ramp_w'):
        x, y = A[key]; one(key, (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 12.0 + hh + 0.4), 0.0)
    x, y = A['rail_ew']; one('rail_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 1.9), 0.0)
    x, y = A['rail_ns']; one('rail_ns', (x - 0.5, x + 1.3, y - 0.05, y + 13.4), 0.6)
    x, y = A['wall_ew']; one('wall_ew', (x - 6.0, x + 6.0 + 0.01, y - 0.05, y + 2.0), 0.0)
    x, y = A['wall_ns']; one('wall_ns', (x - 0.5, x + 1.4, y - 0.05, y + 13.8), 0.6)
    for key in ('column', 'column_b'):
        x, y = A[key]; one(key, (x - 1.0, x + 3.0, y - 0.9, y + 4.6), 0.6)
    x, y = A['core']; one('core', (x - 3.6, x + 5.4, y - 1.4, y + 4.8 + 4.2), 0.6)
    x, y = A['booth']; one('booth', (x - 4.6, x + 9.2, y - 1.5, y + 4.2 + 4.0), 0.7)
    kinds = dict(level='HEIGHT', level_aisle='HEIGHT', ramp_e='HEIGHT', ramp_w='HEIGHT', rail_ew='LOW_COVER', rail_ns='LOW_COVER', wall_ew='LOW_COVER', wall_ns='LOW_COVER',
                 column='WALL', column_b='WALL', core='WALL', booth='COVER')
    hs = dict(level=LEVEL_H, level_aisle=LEVEL_H, ramp_e=LEVEL_H, ramp_w=LEVEL_H, rail_ew=0.86, rail_ns=0.86, wall_ew=1.07, wall_ns=1.07, column=2.6, column_b=2.6, core=2.6, booth=2.4)
    names = dict(level='A RAISED BAY', level_aisle='A RAISED BAY, THE AISLE', ramp_e='THE RAMP UP, EAST', ramp_w='THE RAMP UP, WEST', rail_ew='THE GUARD RAIL', rail_ns='THE GUARD RAIL',
                 wall_ew='THE OUTER WALL', wall_ns='THE OUTER WALL', column='A COLUMN', column_b='A COLUMN', core='THE STAIRS AND THE LIFT', booth='THE WAY OUT: THE PAY BOOTHS')
    for k, v in sz.items(): v.update(piece=k, src='garage/garage_%s.webp' % k, facing='S')
    json.dump(sz, open(os.path.join(ship, 'sizes.json'), 'w'), indent=1)
    cells = lambda rows: ['garage/garage_floor_0.webp#%d,%d' % (c, r) for r in rows for c in range(5)]
    art = {
        'version': 'cook5-garage-art-11-11', 'lane': 'cook 5', 'stage': 'finished',
        'for': "COMBAT's parking garage board (not laid yet; rule 440(a)): a kit on the casino floor's recipe. floor.stalls and floor.aisle are ground lists (any tile of a kind meets any tile of either kind: stalls north and south of an aisle); the pieces are laid by their foot like the casino's (sizes.json).",
        'floor': {'stalls': cells(STALL_ROWS), 'aisle': cells(AISLE_ROWS)},
        'kit': {'garage_' + k: dict(kind=kinds[k], h=hs[k], name=names[k], stage='finished', src=sz[k]['src'], w=sz[k]['w'], h_px=sz[k]['h'], foot=sz[k]['foot']) for k in sz},
        'how_it_lays': {
            'a raised bay': "garage_level (its top the stalls) or garage_level_aisle on every tile of the upper half-level, foot at the tile's south edge middle (fx 0.5, fy 1.0), the casino stage's way; it stands 1.42 m (61 px) up the glass",
            'a ramp': 'garage_ramp_e climbs to the east, garage_ramp_w to the west: one tile, between a low aisle tile and a raised aisle bay, same foot',
            'a rail': "garage_rail_ew along a raised bay's south or north edge, garage_rail_ns along its east or west edge (foot: the middle of the rail's south end)",
            'the outer wall': 'garage_wall_ew / garage_wall_ns, the tunnels\' and the casino\'s way (foot: south base middle / south end middle)',
            'a column': 'garage_column (teal band) or garage_column_b (rust band): one a tile corner or a stall line, foot its base middle',
            'the core and the booth': 'garage_core is 6 m by 4.8 m (half a tile wide): nobody walks through it; garage_booth is the way out, two booths on their islands across one tile, a lane each side of them',
            'dead cars': "the fight's own cover cars, parked in the stalls (2.4 m apart, nose to the middle line)",
        },
        'bytes': bytes_,
    }
    json.dump(art, open(os.path.join(ship, 'garage_art.json'), 'w'), indent=1)
    print('garage: sheet', bytes_, 'pieces', {k: (v['w'], v['h'], v['foot']) for k, v in sz.items()})


SCENES = {'cal': scene_cal, 'tun_floor': lambda q=False: scene_ground('tun_floor', q), 'tun_channel': lambda q=False: scene_ground('tun_channel', q),
          'tun_fill': lambda q=False: scene_ground('tun_fill', q), 'tun_pieces': lambda q=False: scene_pieces('tun_pieces', q),
          'gar_floor': lambda q=False: scene_ground('gar_floor', q), 'gar_pieces': lambda q=False: scene_pieces('gar_pieces', q)}


def sheet_tunnels(before_dir, now_dir):
    """records/target/COOK5_THE_FLOOD_TUNNELS_FINISHED_11_11.webp: what the VOTE card shows: the fight's own page on his phone
    (COMBAT's parked board laid on today's fight page), the stand-in pictures beside these, the same seed and camera"""
    from PIL import ImageDraw, ImageFont
    font = lambda z: ImageFont.truetype(os.path.join(R, 'slices/fonts/BohemiaROM-Regular.ttf'), z)
    WID = 1170; INK, DIM, BG = (232, 222, 196), (150, 140, 118), (16, 14, 12); rows = []
    def title(t, sub=None):
        im = Image.new('RGB', (WID, 64 if sub else 40), BG); d = ImageDraw.Draw(im); d.text((10, 6), t, font=font(24), fill=INK)
        if sub: d.text((10, 38), sub, font=font(14), fill=DIM)
        rows.append(im)
    def strip(items, hk=660):
        cw = (WID - 10 * (len(items) - 1)) // len(items); r = Image.new('RGB', (WID, int(hk * cw / 390) + 26), BG); d = ImageDraw.Draw(r); x = 0; at = {}
        for lab, fn in items:
            n = Image.open(fn).convert('RGB'); n = n.crop((0, 0, n.width, int(n.width * hk / 390))).resize((cw, int(hk * cw / 390)), Image.LANCZOS)
            d.text((x + 4, 4), lab, font=font(14), fill=DIM if 'STAND-IN' in lab else INK); r.paste(n, (x, 26)); at[lab] = (x, 26, cw, n.height); x += cw + 10
        rows.append(r); return at
    B = lambda n: os.path.join(before_dir, 'tun_b_%s.png' % n); N = lambda n: os.path.join(now_dir, 'tun_n_%s.png' % n)
    title('THE FLOOD TUNNELS ON HIS PHONE: THE STAND-IN, AND NOW', 'the fight\'s own page, 390 x 844, the same board and seed. the whole board far out, then where the fight starts')
    strip((('THE STAND-IN, FAR', B('far')), ('NOW, FAR', N('far')), ('THE STAND-IN', B('upright')), ('NOW', N('upright'))))
    first_row = len(rows) - 1
    title('UP CLOSE: THE STAND-IN OVER, NOW UNDER', 'the camp on the wall, the lean-to, the flood\'s jam in the main channel, the drain\'s mouth with its rack pried open')
    strip((('THE STAND-IN: THE CAMP', B('camp')), ('THE LEAN-TO', B('leanto')), ('THE JAM', B('jam')), ('THE MOUTH', B('mouth'))), 520)
    strip((('NOW: THE CAMP', N('camp')), ('THE LEAN-TO', N('leanto')), ('THE JAM', N('jam')), ('THE MOUTH', N('mouth'))), 520)
    title('SIDEWAYS, NOW', '844 x 390')
    n = Image.open(N('sideways')).convert('RGB'); rows.append(n.resize((WID, int(n.height * WID / n.width)), Image.LANCZOS))
    title('THE PICTURES THEMSELVES, ONE ART PIXEL TO ONE SCREEN PIXEL', 'a tile of the culvert floor and a tile of the main channel; then every piece (the wall three ways, the rack whole and pried open, the camp, the lean-to, the jam, the rungs)')
    ship = os.path.join(FG, 'tunnels'); r = Image.new('RGB', (WID, TH), BG)
    r.paste(Image.open(os.path.join(ship, 'tunnel_floor_0.webp')).convert('RGB').crop((0, 0, 580, TH)), (0, 0))
    r.paste(Image.open(os.path.join(ship, 'tunnel_channel_0.webp')).convert('RGB').crop((TW, TH, TW + 580, TH * 2)), (590, 0)); rows.append(r)
    sz = json.load(open(os.path.join(ship, 'sizes.json')))
    r = Image.open(os.path.join(ship, 'tunnel_floor_0.webp')).convert('RGB').crop((TW * 2, TH * 2, TW * 2 + WID, TH * 2 + 990)).convert('RGBA')
    pc = lambda k: Image.open(os.path.join(ship, 'tunnel_%s.webp' % k)).convert('RGBA')
    for k, (x, y) in dict(wall_ew=(10, 14), wall_ew_b=(600, 14), wall_ew_c=(10, 122), jam=(600, 122), camp_a=(10, 336), camp_b=(600, 326)).items(): r.alpha_composite(pc(k), (x, y))
    x = 60
    for k in ('ladder', 'wall_ns', 'rack', 'mouth'):
        im = pc(k); im = im.crop((0, max(0, im.height - 350), im.width, im.height)); r.alpha_composite(im, (x, 980 - im.height)); x += im.width + 150
    rows.append(r.convert('RGB'))
    out = Image.new('RGB', (WID, sum(q.height + 8 for q in rows)), BG); y = 0; fy = 0
    for i, q in enumerate(rows):
        out.paste(q, (0, y))
        if i == first_row: fy = y
        y += q.height + 8
    dst = os.path.join(R, 'records/target/COOK5_THE_FLOOD_TUNNELS_FINISHED_11_11.webp'); out.save(dst, 'WEBP', quality=78, method=6)
    cw = (WID - 30) // 4; fx = 3 * (cw + 10)
    n = Image.open(N('upright')).convert('RGB'); n = n.crop((0, 0, n.width, int(n.width * 660 / 390)))
    os.makedirs(os.path.join(R, 'records/target/vote_first'), exist_ok=True)
    n.resize((n.width // 2, n.height // 2), Image.LANCZOS).save(os.path.join(R, 'records/target/vote_first/cook5-the-flood-tunnels-finished-11-11.webp'), 'WEBP', quality=82, method=6)
    print('sheet', out.size, os.path.getsize(dst), 'first at', (fx, fy + 26, cw, int(660 * cw / 390)))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == 'render':
        for s in a[1:]:
            if s in SCENES: SCENES[s]('--quick' in a)
    elif a and a[0] == 'calibrate':
        calibrate()
    elif a and a[0] == 'models':
        models(a[1])
    elif a and a[0] == 'cut':
        (cut_tunnels if a[1] == 'tunnels' else cut_garage)()
    elif a and a[0] == 'sheet':
        (sheet_tunnels if a[1] == 'tunnels' else sheet_garage)(a[2], a[3])
    elif a and a[0] == 'plan':
        ID = ids(); pal = np.random.RandomState(5).randint(40, 220, (64, 3)).astype(np.uint8)
        gid, dark, pale = PLANS[a[1]](ID)
        im = pal[gid].astype(np.float32) * (1 - 0.6 * dark[..., None]) + pale[..., None] * 50
        os.makedirs(OUT, exist_ok=True); Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).resize((W // 2, H // 2)).save(os.path.join(OUT, 'plan_%s.png' % a[1]))
        print('plan written', {k: int((gid == v).sum()) for k, v in ID.items() if (gid == v).any()})
    else:
        print(__doc__)
