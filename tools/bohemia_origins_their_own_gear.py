#!/usr/bin/env python3
"""BOHEMIA -- ORIGINS [each origin its own] (11/7/26, VAMILY rule 427(c), asks 103 and 233). Paolo, through the coordinator: 'every
origin starts like itself and gets personal: its own look, things only it can buy, its own way... the Lone Wolf a gilded god with three
stars in the stats that matter, really felt in the fight.' Rule 337: no content without its assets, so every piece below is ITS OWN
MODEL, made of the valley, through the pipe COOK's every-armour-its-own pieces went through (tools/bohemia_cook_every_armour_its_own_
11_3_26.py and tools/bohemia_cook_the_armour_through_the_rig_10_26_26.py, imported, never edited): signed distances in CHARACTER's head
and trunk frame, meshed by surface nets, rendered by DIRECTION's master rig in Blender (its light, film and source pass, the 45-degree
camera, the eight facings, a helmet also dropped and at portrait size, his head and trunk as holdouts), packed into CHARACTER's own
sheets (slices/wear/) beside every piece already there, cell for cell.

THE THIRTY (records/target/bb/armory.json, the rows with 'origin'; each origin's crew walks in wearing its own, only its home town
sells them; engine/bohemia_origin_ways.js):
  THE LONE WOLF      a gilded full riot armour (riot plate under gold leaf, a sunburst on the chest, the gold rubbed through to black
                     where it was hit, one dent) and a gilded full riot helm (the dome gilded, a gold crest down the crown, the smoked
                     visor); Battle Brothers' own golden named pieces' numbers (Golden Scale Armor, Golden Feathered Helmet)
  THE CREW THAT IS LEFT  a black-band padded vest (rust canvas, a black band round the chest, the old crew's ring stencilled on the
                     back and scraped) and a names-taped hard hat (dirty white, black tape round the crown, the names in silver pen)
  A NEW CREW         a surplus padded vest (clean olive quilting, black webbing, the white tag still on) and a surplus hard hat (olive,
                     a stencilled block)
  UP FROM HENDERSON  a road-dust padded vest (sun-bleached tan, the dust red at the hem, the 95's shield patch on the back) and a
                     sun-wrap rag hood (a sand wrap, a dark band, its tail)
  THE WATER TRUCK    a hi-vis padded vest (yellow-green rubber, silver reflective bands front and back) and a hi-vis hard hat (white,
                     a silver band, a blue drop on the front)
  THE BLOCK WATCH    an armband work jacket (a faded denim work jacket, an orange band on the left arm, a house number on the back)
                     and an orange-bandana rag hood
  THE SCAVENGERS     a tool-belt padded vest (a hardware store's orange apron vest, the pockets full, a leather tool belt with handles
                     in it) and a headlamp rag hood (a grey hood, a headlamp on its band)
  THE PROMISE KEEPERS  a funeral-coat plate carrier (a black coat over the plates, the lapels, a white flower pinned on, a black
                     ribbon) and a black-ribbon riot helmet (the ribbon tied round it, its tails behind)
  THE DESERTERS      a torn-patch plate carrier (olive drab, clean squares where the patches were torn off, threads hanging) and a
                     steel-pot hard hat (an old army helmet, the band cut off, the chin strap hanging)
  THE RAIDERS        a trophy-hung plate carrier (dark leather, keys, dog tags and other crews' patches hung all over it) and a
                     hand-print riot helmet (a red hand on its side)
  THE LAB RATS       a lab-coat padded vest (a lab coat gone brown, padded, the lanyard and the badge, an orange tag) and a respirator
                     rag hood (a pale hood, a respirator over the mouth)
  THE FAITHFUL       an ash-robe work jacket (a long grey coat rubbed with ash, a rope belt, the screen's test circle on the back)
                     and a bone-cowl rag hood (bone-white, the circle on the brow)
  THE DEBT COLLECTORS  a black-suit padded vest (the collectors': a black suit cut, a white shirt at the collar, a thin dark tie) and a
                     numbered work jacket (the indebted's: safety orange, a big black number front and back)
  THE HUNTERS        a hide-patch padded vest (leather patched with the clones' hides, fur, a cord of teeth across the chest) and a
                     fur-ruff hard hat (a hard leather cap, a ruff of dire wolf fur)
  THE FIGHT PIT      a fight-robe plate carrier (an oxblood satin robe over the plates, gold trim, a sheen) and a sparring riot helmet
                     (red leather headgear, cheek guards, a gold band)

  /tmp/v/bin/python tools/bohemia_origins_their_own_gear.py render [--only id,id]   render through the rig (bpy)
  python3 tools/bohemia_origins_their_own_gear.py rows                              the thirty rows into armor.json, armour_names.json,
                                                                                    armour_looks.json (the armory's own sums), idempotent
  python3 tools/bohemia_origins_their_own_gear.py pack                              pack into slices/wear, every row its own piece
  python3 tools/bohemia_origins_their_own_gear.py proof                             records/target/origins/their_own_gear.png
  /tmp/v/bin/python tools/bohemia_origins_their_own_gear.py all                     render, rows, pack, proof

REFERENCE CHECK (the 9/4 standing duty): the real things (a riot suit and helmet, gold leaf over steel and how it rubs off at the edges;
a construction crew's hard hats with names on tape; military surplus quilted liners; a utility worker's ANSI class 2 hi-vis rubber vest
and hard hat; neighbourhood watch armbands; a hardware store's orange apron; a funeral coat and a lapel lily; an army plate carrier with
the unit patches torn off and a steel pot helmet; a lab coat, a lanyard badge and a half-face respirator; a test card's circle; a bail
collector's suit and a day-labour numbered vest; a hunter's hide patches and a tooth necklace; a boxer's satin robe and sparring
headgear). The twins are the placeholder each replaces (its class's cells) and the rig's man under it. No reference game.
"""
import os, sys, json, math, time, copy

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import numpy as np
from PIL import Image

BB = os.path.join(R, 'records/target/bb')
ARMORY = os.path.join(BB, 'armory.json')
PROOF = os.path.join(R, 'records/target/origins')
KEY = lambda rid: 'own_' + rid


def J(p): return json.load(open(p))


def pieces_spec():
    """the thirty, from the armory file's rows that carry 'origin' (the file a modder edits)"""
    a = J(ARMORY); out = []
    for slot in ('body', 'head'):
        for s in a[slot]:
            if s.get('origin'): out.append((slot, s))
    return out


# --------------------------------------------------------------------------------------------- THE MODELS (bpy only for render)
def models():
    import bohemia_cook_every_armour_its_own_11_3_26 as COOK
    CH = COOK.CH
    V, sph, ell, rbox, capsule, cyl_x, cyl_y, torus_z = CH.V, CH.sph, CH.ell, CH.rbox, CH.capsule, CH.cyl_x, CH.cyl_y, CH.torus_z
    U, I, S, above, below, flat, where, hexc, noise3, length = CH.U, CH.I, CH.S, CH.above, CH.below, CH.flat, CH.where, CH.hexc, CH.noise3, CH.length
    paint, shade, shell_of = COOK.paint, COOK.shade, COOK.shell_of
    TT, ZC = CH.TORSO_TOP, COOK.ZC
    X = lambda p: p[..., 0]; Y = lambda p: p[..., 1]; Z = lambda p: p[..., 2]
    grime = lambda f=0.32, t=0.70: (lambda p: noise3(p, f) > t)
    front = lambda p: p[..., 1] < -6.0
    back = lambda p: p[..., 1] > 6.0

    # ---- the shapes every body piece is cut from (CHARACTER's proportions; his trunk the holdout under them)
    def vest_sd(quilt=0.0, zc=ZC, long=0.0):
        def f(p):
            d = S(rbox(V(0, 0.2, zc + 0.5 - long / 2), (10.9, 8.9, 16.0 + long / 2), 4.5), sph(V(0, 0, TT + 1.0), 7.8))(p)
            if quilt: d = d + quilt * np.abs(np.sin((p[..., 2] - zc) * math.pi / 4.6))
            return d
        return f

    def jacket_sd(long=0.0):
        return rbox(V(0, 0.2, ZC - 1.0 - long / 2), (10.0, 8.0, 17.5 + long / 2), 4.0)

    def carrier_sd():
        return S(rbox(V(0, 0.2, ZC), (10.4, 8.4, 16.0), 4.0), sph(V(0, 0, TT + 1), 7.5))

    def collar(col, r=7.6, w=2.2):
        return (I(torus_z(V(0, 0.4, TT - 0.5), r, w), above(TT - 3.0)), shade(flat(col), lambda p: 0.85 + 0.15 * np.abs(np.sin(np.arctan2(p[..., 0], p[..., 1]) * 12.0))))

    def sleeves(col, rules=()):
        out = []
        for sx in (-1, 1):
            out.append((ell(V(sx * 10.6, 0.2, TT - 10.0), (4.8, 6.2, 7.2)), paint(col, *rules)))
        return out

    def straps(col, x=6.0):
        return [(rbox(V(sx * x, 0.2, TT - 5.0), (2.2, 8.6, 1.6), 0.8), flat(col)) for sx in (-1, 1)]

    def ring_on(cx, cz, r0, r1, side):
        """a ring painted on the front (side -1) or the back (+1), on the x-z plane"""
        return lambda p: (np.sign(p[..., 1]) == side) & (np.abs(p[..., 1]) > 5.0) & (np.hypot(p[..., 0] - cx, p[..., 2] - cz) > r0) & (np.hypot(p[..., 0] - cx, p[..., 2] - cz) < r1)

    def box_on(cx, cz, hx, hz, side):
        return lambda p: (np.sign(p[..., 1]) == side) & (np.abs(p[..., 1]) > 5.0) & (np.abs(p[..., 0] - cx) < hx) & (np.abs(p[..., 2] - cz) < hz)

    def digits(cx, cz, side, h=3.2, w=1.9, gap=1.0, n=2):
        """two blocky stencilled digits (a seven-segment face, worn): enough strokes to read as a number at 112 px"""
        segs = []
        for k in range(n):
            x0 = cx + (k - (n - 1) / 2.0) * (w * 2 + gap)
            for (dx, dz, hx, hz) in ((0, h, w, 0.45), (0, 0, w, 0.45), (0, -h, w, 0.45), (-w, h / 2, 0.45, h / 2), (w, -h / 2, 0.45, h / 2), (w, h / 2, 0.45, h / 2) if k else (-w, -h / 2, 0.45, h / 2)):
                segs.append((x0 + dx, cz + dz, hx, hz))
        def t(p):
            m = np.zeros(p.shape[:-1], bool)
            on = (np.sign(p[..., 1]) == side) & (np.abs(p[..., 1]) > 5.0)
            for (x0, z0, hx, hz) in segs: m |= on & (np.abs(p[..., 0] - x0) < hx) & (np.abs(p[..., 2] - z0) < hz)
            return m
        return t

    # ---- the shapes every head piece is cut from
    def hard_hat_sd():
        dome = I(ell(V(0, 0.6, 2.4), (13.6, 14.6, 12.6)), above(-1.6))
        ridge = I(ell(V(0, 0.6, 2.4), (2.0, 14.9, 13.4)), above(-1.0))
        brim = U(ell(V(0, 0.6, -1.7), (15.0, 15.8, 1.4)), ell(V(0, -3.5, -1.5), (12.0, 17.2, 1.3)))
        return dome, ridge, brim

    def hood_sd():
        return U(S(sph(V(0, 1.3, 0.8), 14.9), rbox(V(0, -12.0, -3.4), (8.6, 8.0, 9.0), 3.2)), ell(V(0, 5.0, -14.5), (13.6, 10.0, 8.5)))

    def riot_shell():
        return I(sph(V(0, 0.6, 1.4), 14.2), lambda p: (-6.5 - 0.33 * p[..., 1]) - p[..., 2])

    def visor():
        v = I(lambda p: np.abs(length(p - V(0, 0.4, 0.6)) - 15.6) - 0.55, lambda p: p[..., 1] + 3.5,
              lambda p: p[..., 2] - 2.4, lambda p: -13.0 - p[..., 2], lambda p: np.abs(p[..., 0]) - 12.8)
        fr = I(lambda p: np.abs(length(p - V(0, 0.4, 0.6)) - 15.6) - 0.75, lambda p: p[..., 1] + 3.5,
               lambda p: np.maximum(p[..., 2] - 2.4, -13.0 - p[..., 2]), lambda p: np.abs(p[..., 0]) - 12.8,
               lambda p: np.minimum(np.minimum(np.abs(p[..., 2] - 2.4), np.abs(p[..., 2] + 13.0)), np.abs(np.abs(p[..., 0]) - 12.8)) - 1.0)
        return v, fr

    G = {}   # id -> (slot, fn)

    # ======================================================================= THE LONE WOLF: THE GILDED GOD
    GOLD, GOLD_HI, GOLD_LO, UNDER, ENGR = '#b37a10', '#efbe34', '#7c520c', '#1f1c18', '#5c3c0a'
    def gilt(base=GOLD, rub=0.66, engrave=None):
        """gold leaf over black plate: a deep leaf gold (the rig takes 15% of its colour and adds the road's dust), a few bright
        high spots, rubbed through to the black in small specks where it was hit; never mottled (round one read as tan camo)"""
        def m(p):
            c = np.broadcast_to(hexc(base), p.shape).copy()
            c[noise3(p, 0.40) > 0.78] = hexc(GOLD_HI)
            c[noise3(p + 31.0, 0.30) > 0.80] = hexc(GOLD_LO)
            if engrave is not None: c[engrave(p)] = hexc(ENGR)
            c[noise3(p + 7.0, 1.10) > rub + 0.22] = hexc(UNDER)        # the rub-through: specks, at the edges of the hits
            return c, np.ones(p.shape[:-1])
        return m

    def wolf_gilded_riot_armour():
        P = []
        sun = lambda p: (p[..., 1] < -6.0) & (np.hypot(p[..., 0], p[..., 2] - (ZC + 3.0)) < 5.6) & (
            (np.abs(np.sin(np.arctan2(p[..., 0], p[..., 2] - (ZC + 3.0)) * 8.0)) > 0.86) | (np.abs(np.hypot(p[..., 0], p[..., 2] - (ZC + 3.0)) - 2.2) < 0.45))
        laurel = lambda p: (np.abs(np.abs(p[..., 2] - (ZC - 6.0)) - 0.0) < 0.4) & (np.abs(p[..., 0]) < 8.5) & (p[..., 1] < -6.0)
        dent = lambda p: ((p[..., 0] - 4.5) ** 2 + (p[..., 2] - (ZC - 3.5)) ** 2 < 2.2) & (p[..., 1] < -6.0)
        def chest(p):
            d = rbox(V(0, 0.2, ZC + 1), (10.6, 8.8, 15.5), 4.5)(p)
            return d + 0.6 * dent(p)                                      # one dent, pushed in where a maul landed
        P.append((chest, gilt(engrave=lambda p: sun(p) | laurel(p))))
        for sx in (-1, 1):
            P.append((I(ell(V(sx * 11.8, 0.2, TT - 8.5), (6.4, 7.6, 6.0)), above(TT - 14.0)), gilt(GOLD, 0.62, lambda p: np.abs(np.abs(p[..., 2] - (TT - 10.0)) - 0.0) < 0.35)))
            P.append((I(ell(V(sx * 12.4, 0.2, TT - 13.0), (5.6, 7.0, 4.0)), above(TT - 18.0)), gilt(GOLD_LO, 0.60)))
            P.append((cyl_x(V(sx * 17.6, -0.8, TT - 9.0), 0.9, 0.5), flat('#2d2a24')))           # the rivet's black head on each
        P.append((I(torus_z(V(0, 0.4, TT - 1.5), 7.6, 2.4), above(TT - 4.0)), flat('#1c1a17')))   # the collar, black
        P.append((S(rbox(V(0, 0.2, ZC + 1.0), (10.9, 9.1, 15.8), 4.5), rbox(V(0, 0.2, ZC + 1.0), (12.0, 10.0, 13.6), 4.5)), flat('#1e1c19')))   # its black binding
        P.append((rbox(V(0, -9.6, ZC - 11.5), (5.8, 1.0, 4.4), 1.6), gilt(GOLD, 0.64, lambda p: np.abs(p[..., 2] - (ZC - 11.5)) < 0.35)))   # the belly plate
        return P
    G['wolf_gilded_riot_armour'] = ('body', wolf_gilded_riot_armour)

    def wolf_gilded_riot_helm():
        P = []
        band = lambda p: np.abs(p[..., 2] - 6.5) < 0.5
        P.append((riot_shell(), gilt(engrave=band)))
        P.append((I(torus_z(V(0, 0.6, -2.6), 13.6, 1.25), lambda p: p[..., 1] - 2.0), flat('#1d1b18')))     # the rim, black
        crest = I(ell(V(0, 2.0, 7.0), (1.6, 13.0, 9.8)), above(3.0), lambda p: length(p - V(0, 0.6, 1.4)) - 17.2)
        P.append((crest, gilt(GOLD_HI, 0.70)))                                                     # the crest down the crown
        v, fr = visor()
        P.append((v, CH.GLASS)); P.append((fr, gilt(GOLD_LO, 0.62)))
        for sx in (-1, 1): P.append((cyl_x(V(sx * 14.6, -1.5, 1.2), 2.0, 1.0), gilt(GOLD, 0.6)))
        guard = I(lambda p: np.abs(length(p - V(0, 0.6, 1.4)) - 14.4) - 0.9, lambda p: 3.5 - p[..., 1], lambda p: p[..., 2] - (-6.0), lambda p: -15.5 - p[..., 2])
        P.append((guard, flat('#24211d')))
        return P
    G['wolf_gilded_riot_helm'] = ('head', wolf_gilded_riot_helm)

    # ======================================================================= THE CREW THAT IS LEFT
    def rebuild_black_band_vest():
        band = lambda p: np.abs(p[..., 2] - (ZC + 8.0)) < 1.7
        stencil = ring_on(0, ZC + 1.0, 3.6, 5.4, 1)
        scrape = lambda p: noise3(p, 0.9) > 0.55
        cross = lambda p: (p[..., 1] > 5.0) & ((np.abs(p[..., 0]) < 0.6) | (np.abs(p[..., 2] - (ZC + 1.0)) < 0.6)) & (np.hypot(p[..., 0], p[..., 2] - (ZC + 1.0)) < 3.6)
        stitch = lambda p: np.abs(np.sin((p[..., 2] - ZC) * math.pi / 4.6)) > 0.95
        m = paint('#6b4a33', (band, '#151413'), (lambda p: (stencil(p) | cross(p)) & ~scrape(p), '#b5ab96'), (stitch, '#4d3524'), (grime(), '#5a3f2c'))
        return [(vest_sd(0.45), m)]
    G['rebuild_black_band_vest'] = ('body', rebuild_black_band_vest)

    def rebuild_names_hard_hat():
        dome, ridge, brim = hard_hat_sd()
        tape = lambda p: np.abs(p[..., 2] - 1.8) < 1.6
        names = lambda p: tape(p) & (np.abs(p[..., 2] - 1.8) < 0.5) & (np.sin(np.arctan2(p[..., 0], p[..., 1]) * 34.0) > 0.1) & (np.sin(np.arctan2(p[..., 0], p[..., 1]) * 5.0) > -0.4)
        return [(dome, paint('#bdb7a6', (names, '#c9c6bd'), (tape, '#151413'), (grime(0.4, 0.66), '#8f897a'))), (ridge, flat('#aaa493')), (brim, flat('#a49e8d'))]
    G['rebuild_names_hard_hat'] = ('head', rebuild_names_hard_hat)

    # ======================================================================= A NEW CREW
    def newcrew_surplus_vest():
        tag = lambda p: (p[..., 1] < -6.0) & (np.abs(p[..., 0] - 6.5) < 1.2) & (np.abs(p[..., 2] - (ZC - 12.5)) < 1.6)
        stitch = lambda p: np.abs(np.sin((p[..., 2] - ZC) * math.pi / 4.6)) > 0.94
        P = [(vest_sd(0.5), paint('#565a40', (tag, '#e0dccc'), (stitch, '#43462f')))]
        P += straps('#1d1e1a', 5.6)
        P.append((S(rbox(V(0, 0.2, ZC - 8.0), (11.4, 9.4, 1.1), 4.5), rbox(V(0, 0.2, ZC - 8.0), (10.4, 8.4, 3.0), 4.0)), flat('#1d1e1a')))   # the belt webbing
        return P
    G['newcrew_surplus_vest'] = ('body', newcrew_surplus_vest)

    def newcrew_surplus_hard_hat():
        dome, ridge, brim = hard_hat_sd()
        sten = lambda p: (p[..., 1] < -8.0) & (np.abs(p[..., 0]) < 4.0) & (np.abs(p[..., 2] - 5.0) < 1.6) & (np.sin(p[..., 0] * 2.6) > -0.2)
        return [(dome, paint('#50533a', (sten, '#c9c5b2'))), (ridge, flat('#474a33')), (brim, flat('#45482f'))]
    G['newcrew_surplus_hard_hat'] = ('head', newcrew_surplus_hard_hat)

    # ======================================================================= UP FROM HENDERSON
    def south_road_dust_vest():
        shield = lambda p: (p[..., 1] > 5.0) & (np.abs(p[..., 0]) < 4.6 - 0.25 * np.maximum(0, (ZC - 2.0) - p[..., 2])) & (p[..., 2] < ZC + 5.0) & (p[..., 2] > ZC - 6.0)
        shield_top = lambda p: shield(p) & (p[..., 2] > ZC + 2.4)
        nums = lambda p: shield(p) & ~shield_top(p) & (np.abs(p[..., 2] - (ZC - 1.0)) < 2.0) & (np.abs(np.abs(p[..., 0]) - 1.6) < 0.55)
        hem = lambda p: p[..., 2] < ZC - 9.0
        stitch = lambda p: np.abs(np.sin((p[..., 2] - ZC) * math.pi / 4.6)) > 0.95
        m = paint('#a28e68', (nums, '#d8d2c2'), (shield_top, '#8a3b30'), (shield, '#3b4e70'), (stitch, '#857250'), (hem, '#8c6c4c'), (grime(0.3, 0.68), '#b6a37d'))
        return [(vest_sd(0.45), m)]
    G['south_road_dust_vest'] = ('body', south_road_dust_vest)

    def south_sun_wrap_hood():
        band = lambda p: np.abs(p[..., 2] - 6.0) < 1.4
        wraps = lambda p: np.abs(np.sin((p[..., 2] + 0.4 * p[..., 0]) * 0.9)) > 0.93
        P = [(hood_sd(), paint('#b6a17a', (band, '#4b3e2e'), (wraps, '#9f8b66'), (grime(0.35, 0.7), '#a48f6a')))]
        P.append((capsule(V(3.0, 13.8, 2.0), V(6.5, 17.5, -10.0), 2.2, 1.2), flat('#a99470')))             # its tail, loose behind
        return P
    G['south_sun_wrap_hood'] = ('head', south_sun_wrap_hood)

    # ======================================================================= THE WATER TRUCK
    def truck_hi_vis_vest():
        bands = lambda p: (np.abs(p[..., 2] - (ZC + 6.0)) < 1.3) | (np.abs(p[..., 2] - (ZC - 3.0)) < 1.3)
        braces = lambda p: (p[..., 1] < -6.0) & (np.abs(np.abs(p[..., 0]) - 4.6) < 1.1) & (p[..., 2] > ZC + 6.0)
        xback = lambda p: (p[..., 1] > 6.0) & (p[..., 2] > ZC + 6.0) & (np.abs(np.abs(p[..., 0]) - (p[..., 2] - (ZC + 6.0)) * 0.6) < 1.1)
        shine = lambda p: np.sin(p[..., 0] * 1.4 + p[..., 2] * 0.8) > 0.75
        m = paint('#b4bc3b', (lambda p: (bands(p) | braces(p) | xback(p)) & shine(p), '#e1e2dc'), (lambda p: bands(p) | braces(p) | xback(p), '#b9bbb5'),
                  (grime(0.3, 0.72), '#979e35'))
        P = [(vest_sd(0.0), m)]
        P.append((rbox(V(0, -9.6, ZC - 9.0), (0.5, 0.6, 7.0), 0.3), flat('#2c2d2a')))                     # the zip
        return P
    G['truck_hi_vis_vest'] = ('body', truck_hi_vis_vest)

    def truck_hi_vis_hard_hat():
        dome, ridge, brim = hard_hat_sd()
        band = lambda p: np.abs(p[..., 2] - 2.4) < 1.2
        drop = lambda p: (p[..., 1] < -9.0) & (np.hypot(p[..., 0], p[..., 2] - 6.0) < 1.9 - 0.3 * np.maximum(0, p[..., 2] - 6.0) * 1.4)
        return [(dome, paint('#cfcbc0', (drop, '#3e6a8a'), (band, '#bfc0bb'), (grime(0.45, 0.72), '#aaa79b'))), (ridge, flat('#c4c0b4')), (brim, flat('#bdb9ad'))]
    G['truck_hi_vis_hard_hat'] = ('head', truck_hi_vis_hard_hat)

    # ======================================================================= THE BLOCK WATCH
    def watch_armband_jacket():
        num = digits(0, ZC + 2.0, 1)
        P = [(jacket_sd(), paint('#4f5b6b', (num, '#d9d3c2'), (lambda p: (np.abs(p[..., 0]) < 0.6) & front(p), '#2c3440'), (grime(0.35, 0.68), '#5f6a78')))]
        P.append(collar('#3a4350'))
        for sx in (-1, 1):
            arm = (lambda p: np.abs(p[..., 2] - (TT - 11.0)) < 1.6) if sx > 0 else (lambda p: np.zeros(p.shape[:-1], bool))
            P.append((ell(V(sx * 10.6, 0.2, TT - 10.0), (4.8, 6.2, 7.2)), paint('#4a5666', (arm, '#c0602a'))))   # the orange band on his left arm
        return P
    G['watch_armband_jacket'] = ('body', watch_armband_jacket)

    def watch_orange_bandana():
        P = []
        band = I(lambda p: np.abs(length(p - V(0, 0.3, 0.0)) - 13.0) - 0.9, lambda p: np.abs(p[..., 2] - 4.6) - 2.8)
        pat = lambda p: np.sin(p[..., 0] * 2.2) * np.sin(p[..., 2] * 2.2 + p[..., 1]) > 0.6
        P.append((band, paint('#b45a2a', (pat, '#d9c8ae'))))
        P.append((sph(V(0, 13.2, 4.4), 2.6), flat('#a35027')))
        for sx in (-1, 1): P.append((capsule(V(sx * 1.2, 13.6, 3.2), V(sx * 3.4, 15.8, -4.5), 1.6, 1.0), flat('#a35027')))
        return P
    G['watch_orange_bandana'] = ('head', watch_orange_bandana)

    # ======================================================================= THE SCAVENGERS
    def scav_tool_belt_vest():
        pockets = lambda p: front(p) & (np.abs(p[..., 2] - (ZC - 1.0)) < 3.0) & (np.abs(np.abs(p[..., 0]) - 5.0) < 3.0)
        pocket_top = lambda p: pockets(p) & (np.abs(p[..., 2] - (ZC + 1.8)) < 0.4)
        P = [(vest_sd(0.0), paint('#a5500f', (pocket_top, '#6e3a12'), (pockets, '#924711'), (grime(0.3, 0.70), '#86420f')))]
        P.append((S(rbox(V(0, 0.2, ZC - 11.0), (11.6, 9.6, 1.6), 4.5), rbox(V(0, 0.2, ZC - 11.0), (10.4, 8.4, 3.0), 4.0)), flat('#5a3f28')))   # the tool belt
        for x, col in ((-6.5, '#7d6a4f'), (-3.5, '#a9a8a0'), (6.0, '#3a3a38')):                          # a hammer's handle, a pry bar, a wrench
            P.append((capsule(V(x, -9.8, ZC - 9.5), V(x + 0.6, -10.4, ZC - 16.0), 0.75), flat(col)))
        P.append((rbox(V(8.6, -9.9, ZC - 11.0), (1.4, 0.9, 1.6), 0.4), flat('#2a2724')))                   # a tape measure on the belt
        return P
    G['scav_tool_belt_vest'] = ('body', scav_tool_belt_vest)

    def scav_headlamp_hood():
        P = [(hood_sd(), paint('#57544b', (grime(0.35, 0.7), '#48463e')))]
        P.append((I(torus_z(V(0, 0.6, 3.0), 15.0, 0.8), lambda p: p[..., 1] - 6.0), flat('#1c1b1a')))       # the lamp's band over the hood
        P.append((cyl_y(V(0, -15.8, 4.0), 2.6, 1.6), flat('#2c2b29')))
        P.append((cyl_y(V(0, -17.5, 4.0), 1.9, 0.3), flat('#e3d6a6')))
        return P
    G['scav_headlamp_hood'] = ('head', scav_headlamp_hood)

    # ======================================================================= THE PROMISE KEEPERS
    def promise_funeral_carrier():
        lapel = lambda p: front(p) & (np.abs(np.abs(p[..., 0]) - (p[..., 2] - (ZC - 4.0)) * 0.30) < 1.0) & (p[..., 2] > ZC - 4.0)
        ribbon = lambda p: front(p) & (np.abs(p[..., 0] + 5.0) < 0.8) & (p[..., 2] > ZC + 3.0) & (p[..., 2] < ZC + 9.0)
        P = [(carrier_sd(), paint('#1c1c1f', (ribbon, '#0c0c0d'), (lapel, '#2f2f34'), (grime(0.3, 0.74), '#26262a')))]
        P += straps('#151517')
        for dx, dz in ((0, 0), (1.1, 0.7), (-1.0, 0.8), (0.3, 1.5), (0.2, -0.9)):                         # the lily, petals at the pin
            P.append((sph(V(-5.0 + dx, -10.0, ZC + 10.0 + dz), 1.05), flat('#e4dfd0')))
        P.append((capsule(V(-5.0, -9.8, ZC + 9.0), V(-5.6, -9.6, ZC + 6.5), 0.35), flat('#4a5a3a')))        # its stem
        return P
    G['promise_funeral_carrier'] = ('body', promise_funeral_carrier)

    def promise_ribbon_riot_helmet():
        P = [(riot_shell(), paint('#2a2d33', (grime(0.3, 0.72), '#363a41')))]
        P.append((I(torus_z(V(0, 0.6, -2.6), 13.6, 1.25), lambda p: p[..., 1] - 2.0), flat('#1c1e22')))
        v, fr = visor(); P.append((v, CH.GLASS)); P.append((fr, flat('#4d525a')))
        P.append((I(lambda p: np.abs(length(p - V(0, 0.6, 1.4)) - 14.5) - 0.7, lambda p: np.abs(p[..., 2] - 4.4) - 1.6), flat('#0d0d0e')))   # the ribbon
        P.append((sph(V(0, 14.6, 4.4), 2.0), flat('#0f0f10')))
        for sx in (-1, 1): P.append((capsule(V(sx * 1.0, 15.0, 3.4), V(sx * 3.0, 17.4, -6.0), 1.2, 0.5), flat('#0f0f10')))   # its two tails
        tag = lambda p: (p[..., 1] < -10.0) & (np.abs(p[..., 2] - 9.0) < 1.0) & (np.abs(p[..., 0]) < 3.5)
        P[0] = (P[0][0], paint('#2a2d33', (tag, '#c9c5b6'), (grime(0.3, 0.72), '#363a41')))
        return P
    G['promise_ribbon_riot_helmet'] = ('head', promise_ribbon_riot_helmet)

    # ======================================================================= THE DESERTERS
    def desert_torn_patch_carrier():
        patches = [(-5.5, ZC + 9.0, 2.6, 1.8, -1), (5.0, ZC + 4.0, 2.2, 2.2, -1), (0, ZC + 6.0, 4.2, 2.4, 1)]
        def torn(p):
            m = np.zeros(p.shape[:-1], bool)
            for cx, cz, hx, hz, side in patches: m |= box_on(cx, cz, hx, hz, side)(p)
            return m
        threads = lambda p: torn(p) & (noise3(p, 1.6) > 0.70)
        shoulder = lambda p: (np.abs(p[..., 0]) > 8.5) & (np.abs(p[..., 2] - (TT - 9.0)) < 2.0) & (np.abs(p[..., 1]) < 4.0)
        P = [(carrier_sd(), paint('#4b4d39', (threads, '#2c2d22'), (torn, '#6c6e56'), (shoulder, '#66684f'), (grime(0.32, 0.70), '#5a5c45')))]
        P += straps('#34352a')
        for x in (-6.0, 0.0, 6.0): P.append((rbox(V(x, -8.8, ZC - 9.0), (2.4, 1.4, 3.0), 0.6), flat('#3e4031')))   # the mag pouches
        return P
    G['desert_torn_patch_carrier'] = ('body', desert_torn_patch_carrier)

    def desert_steel_pot_hard_hat():
        P = []
        cut = lambda p: (np.abs(p[..., 2] - 2.6) < 1.3) & ~(np.sin(np.arctan2(p[..., 0], p[..., 1]) * 3.0) > 0.4)
        P.append((I(sph(V(0, 0.5, 2.0), 14.0), above(-2.8)), paint('#4e513e', (cut, '#6a6c55'), (grime(0.35, 0.68), '#5c5f4a'))))
        def brim(p):
            q = p.copy(); q[..., 2] = q[..., 2] + 0.012 * (q[..., 0] ** 2 + q[..., 1] ** 2)
            return ell(V(0, 0.5, -2.4), (20.0, 20.0, 1.25))(q)
        P.append((brim, flat('#464934')))
        for sx in (-1, 1): P.append((capsule(V(sx * 12.5, -2.0, -3.0), V(sx * 9.0, -6.0, -16.0), 0.55), flat('#2a2a22')))   # the chin strap, hanging open
        return P
    G['desert_steel_pot_hard_hat'] = ('head', desert_steel_pot_hard_hat)

    # ======================================================================= THE RAIDERS
    def raid_trophy_carrier():
        P = [(carrier_sd(), paint('#3a2c22', (grime(0.3, 0.66), '#2b211a')))]
        P += straps('#241b15')
        P.append((capsule(V(-9.0, -9.6, ZC + 9.0), V(9.0, -9.6, ZC + 7.0), 0.35), flat('#1a1612')))         # the cord across the chest
        hang = [(-7.0, '#9c9a90'), (-4.6, '#b58b3e'), (-2.2, '#9c9a90'), (0.4, '#6e6a60'), (3.0, '#a6a49b'), (5.6, '#b58b3e'), (7.6, '#8d8b82')]
        for k, (x, col) in enumerate(hang):
            z = ZC + 8.6 - 0.11 * (x + 9.0) - 1.0
            if k % 2: P.append((rbox(V(x, -10.0, z - 1.6), (0.9, 0.25, 1.4), 0.25), flat(col)))          # a dog tag
            else: P.append((capsule(V(x, -10.0, z), V(x + 0.2, -10.1, z - 2.6), 0.45), flat(col)))        # a key
        for (x, z, col) in ((-5.0, ZC - 4.0, '#3e4f6e'), (4.5, ZC - 2.0, '#7d3330'), (0.0, ZC - 9.0, '#3d6b66'), (-6.0, ZC - 10.0, '#6e5a2e')):
            P.append((rbox(V(x, -9.2, z), (2.0, 0.4, 1.6), 0.4), paint(col, (lambda p: noise3(p, 1.2) > 0.6, '#2b2520'))))   # other crews' patches
        return P
    G['raid_trophy_carrier'] = ('body', raid_trophy_carrier)

    def raid_hand_print_riot_helmet():
        def hand(p):
            side = p[..., 0] > 9.0
            y, z = p[..., 1] + 1.0, p[..., 2] - 2.0
            palm = (y ** 2 / 9.0 + z ** 2 / 7.0) < 1.0
            fingers = np.zeros(p.shape[:-1], bool)
            for k, (fy, fz) in enumerate(((-3.0, 3.4), (-1.2, 4.4), (0.8, 4.6), (2.6, 4.0))):
                fingers |= (np.abs(y - fy) < 0.75) & (z > 1.5) & (z < fz + 2.6)
            thumb = (np.abs((y + 3.6) - (z + 1.0) * 0.6) < 0.8) & (z < 0.5) & (z > -2.5)
            return side & (palm | fingers | thumb)
        P = [(riot_shell(), paint('#2b2e34', (hand, '#8a2a22'), (grime(0.3, 0.72), '#373b42')))]
        P.append((I(torus_z(V(0, 0.6, -2.6), 13.6, 1.25), lambda p: p[..., 1] - 2.0), flat('#1c1e22')))
        v, fr = visor(); P.append((v, CH.GLASS)); P.append((fr, flat('#4d525a')))
        return P
    G['raid_hand_print_riot_helmet'] = ('head', raid_hand_print_riot_helmet)

    # ======================================================================= THE LAB RATS
    def lab_coat_vest():
        stain = lambda p: noise3(p, 0.22) > 0.62
        lap = lambda p: front(p) & (np.abs(np.abs(p[..., 0]) - (p[..., 2] - (ZC - 6.0)) * 0.28) < 0.8) & (p[..., 2] > ZC - 6.0)
        P = [(vest_sd(0.0, long=6.0), paint('#b1a78f', (lap, '#958b74'), (stain, '#7b6a4c'), (grime(0.5, 0.74), '#9c917a')))]
        P.append(collar('#a59b84', 7.6, 2.0))
        P.append((capsule(V(-3.0, -8.8, TT - 3.5), V(-2.0, -10.0, ZC + 6.0), 0.3), flat('#2e4a6a')))       # the lanyard
        P.append((rbox(V(-2.0, -10.2, ZC + 4.0), (1.5, 0.3, 2.0), 0.3), paint('#ddd8c8', (lambda p: p[..., 2] > ZC + 5.0, '#2e4a6a'))))   # the badge
        P.append((rbox(V(6.0, -10.0, ZC - 4.0), (1.4, 0.4, 0.9), 0.3), flat('#b5662c')))                   # the orange tag
        return P
    G['lab_coat_vest'] = ('body', lab_coat_vest)

    def lab_respirator_hood():
        P = [(hood_sd(), paint('#8a877d', (grime(0.35, 0.7), '#77746b')))]
        P.append((ell(V(0, -10.6, -5.6), (7.4, 4.8, 5.6)), flat('#3a3c38')))                              # the half mask
        for sx in (-1, 1): P.append((cyl_y(V(sx * 5.4, -13.2, -7.0), 2.5, 1.3), paint('#b4a046', (lambda p: np.abs(p[..., 1] + 14.4) < 0.4, '#3a3a32'))))   # its two cartridges
        P.append((I(torus_z(V(0, 0.8, -4.6), 12.6, 0.7), lambda p: p[..., 1] + 6.0), flat('#262624')))      # its strap
        return P
    G['lab_respirator_hood'] = ('head', lab_respirator_hood)

    # ======================================================================= THE FAITHFUL
    def faith_ash_robe():
        rings = lambda p: back(p) & (np.abs((np.hypot(p[..., 0], p[..., 2] - (ZC + 2.0)) % 2.2) - 1.1) < 0.35) & (np.hypot(p[..., 0], p[..., 2] - (ZC + 2.0)) < 7.0)
        bars = lambda p: back(p) & (np.hypot(p[..., 0], p[..., 2] - (ZC + 2.0)) < 4.6) & (np.abs(p[..., 2] - (ZC + 2.0)) < 1.6) & (np.sin(p[..., 0] * 1.6) > 0.0)
        ash = lambda p: noise3(p, 0.6) > 0.58
        P = [(jacket_sd(long=10.0), paint('#8b8780', (bars, '#5a5852'), (rings, '#cfcabd'), (ash, '#a7a39a'), (grime(0.3, 0.7), '#77736c')))]
        P.append(collar('#7b7871', 7.4, 2.0))
        P += sleeves('#868279')
        P.append((torus_z(V(0, 0.2, ZC - 8.0), 11.4, 0.8), flat('#6d5a3e')))   # the rope belt
        P.append((capsule(V(-2.0, -11.0, ZC - 8.0), V(-3.0, -11.6, ZC - 15.0), 0.6), flat('#6d5a3e')))       # its end
        return P
    G['faith_ash_robe'] = ('body', faith_ash_robe)

    def faith_bone_cowl():
        circle = lambda p: (p[..., 1] < -8.0) & (np.abs(np.hypot(p[..., 0], p[..., 2] - 8.0) - 2.4) < 0.5)
        return [(hood_sd(), paint('#c6bea8', (circle, '#3e3b35'), (grime(0.35, 0.72), '#aea692')))]
    G['faith_bone_cowl'] = ('head', faith_bone_cowl)

    # ======================================================================= THE DEBT COLLECTORS
    def debt_black_suit_vest():
        shirt = lambda p: front(p) & (np.abs(p[..., 0]) < (p[..., 2] - (ZC + 2.0)) * 0.42) & (p[..., 2] > ZC + 2.0)
        tie = lambda p: shirt(p) & (np.abs(p[..., 0]) < 0.75)
        lapel = lambda p: front(p) & (np.abs(np.abs(p[..., 0]) - (p[..., 2] - (ZC + 2.0)) * 0.42) < 0.9) & (p[..., 2] > ZC + 2.0)
        buttons = lambda p: front(p) & (np.abs(p[..., 0]) < 0.55) & (np.abs(((p[..., 2] - ZC) % 4.0) - 2.0) < 0.5) & (p[..., 2] < ZC + 1.0)
        P = [(vest_sd(0.0), paint('#1c1c20', (tie, '#5a1f1f'), (shirt, '#d6d2c8'), (lapel, '#2b2b31'), (buttons, '#47474d')))]
        return P
    G['debt_black_suit_vest'] = ('body', debt_black_suit_vest)

    def debt_numbered_jacket():
        numb = digits(0, ZC + 2.0, 1, 3.4, 2.0)
        numf = digits(-4.0, ZC + 5.0, -1, 1.6, 0.9)
        bar = lambda p: front(p) & (np.abs(p[..., 0] - 4.5) < 2.4) & (np.abs(p[..., 2] - (ZC + 6.0)) < 1.4) & (np.sin(p[..., 0] * 9.0 + np.sin(p[..., 0] * 3.1) * 2.0) > 0.0)
        P = [(jacket_sd(), paint('#a8520f', (numb, '#1b1a18'), (numf, '#1b1a18'), (bar, '#1b1a18'), (grime(0.32, 0.72), '#8e450e')))]
        P.append(collar('#7f3f0e'))
        P += sleeves('#a04d0f')
        return P
    G['debt_numbered_jacket'] = ('body', debt_numbered_jacket)

    # ======================================================================= THE HUNTERS
    def hunt_hide_patch_vest():
        fur = lambda p: noise3(p, 0.20) > 0.55
        streak = lambda p: fur(p) & (np.abs(np.sin(p[..., 2] * 3.2 + p[..., 0] * 0.6)) > 0.7)
        stitchx = lambda p: fur(p) & ~(noise3(p, 0.20) > 0.58)
        def sd(p):
            return vest_sd(0.0)(p) - 0.35 * fur(p)
        P = [(sd, paint('#5d4a35', (stitchx, '#2c2219'), (streak, '#4f4a43'), (fur, '#6e675c'), (grime(0.3, 0.68), '#4c3c2b')))]
        P.append((capsule(V(-7.5, -9.6, ZC + 10.5), V(7.5, -9.6, ZC + 10.5), 0.3), flat('#2a2018')))
        for k in range(7):
            x = -6.0 + 2.0 * k; sag = 0.06 * (36 - x * x)
            P.append((capsule(V(x, -9.9, ZC + 10.2 - sag * 0.2), V(x, -10.2, ZC + 8.2 - sag * 0.2), 0.55, 0.15), flat('#d6ccb3')))   # the teeth
        return P
    G['hunt_hide_patch_vest'] = ('body', hunt_hide_patch_vest)

    def hunt_fur_ruff_hard_hat():
        cap = I(ell(V(0, 0.8, 2.0), (13.6, 14.4, 12.8)), above(-1.0))
        ruff = torus_z(V(0, 0.8, -1.0), 13.6, 2.6)
        furm = shade(flat('#6a6156'), lambda p: 0.75 + 0.25 * np.abs(np.sin(np.arctan2(p[..., 0], p[..., 1]) * 30.0 + p[..., 2])))
        return [(cap, paint('#4a3a2a', (lambda p: np.abs(p[..., 0]) < 0.8, '#3a2e22'), (grime(0.4, 0.7), '#5a4836'))), (ruff, furm)]
    G['hunt_fur_ruff_hard_hat'] = ('head', hunt_fur_ruff_hard_hat)

    # ======================================================================= THE FIGHT PIT
    def pit_fight_robe_carrier():
        trim = lambda p: (np.abs(p[..., 2] - (ZC - 14.0)) < 1.0) | (front(p) & (np.abs(np.abs(p[..., 0]) - (p[..., 2] - (ZC - 14.0)) * 0.16) < 0.8))
        sheen = lambda p: np.sin(p[..., 0] * 0.9 + p[..., 2] * 0.5) > 0.7
        name = lambda p: back(p) & (np.abs(p[..., 2] - (ZC + 8.0)) < 1.3) & (np.abs(p[..., 0]) < 6.0) & (np.sin(p[..., 0] * 2.6) > -0.3)
        P = [(vest_sd(0.0, long=4.0), paint('#6a1f24', (name, '#b08d3e'), (trim, '#b08d3e'), (sheen, '#86383b'), (grime(0.32, 0.74), '#55191d')))]
        P.append(collar('#b08d3e', 7.8, 2.2))
        P += sleeves('#651d22', ((lambda p: np.abs(p[..., 2] - (TT - 15.5)) < 0.8, '#b08d3e'),))
        return P
    G['pit_fight_robe_carrier'] = ('body', pit_fight_robe_carrier)

    def pit_sparring_riot_helmet():
        P = []
        crown = S(I(sph(V(0, 1.0, 1.6), 14.2), above(-4.0)), rbox(V(0, -12.0, -1.0), (8.0, 8.0, 7.5), 3.0))   # the face left open
        band = lambda p: np.abs(p[..., 2] - 6.2) < 0.8
        P.append((crown, paint('#7d2722', (band, '#b08d3e'), (lambda p: np.abs(p[..., 0]) < 0.7, '#5f1c19'), (grime(0.4, 0.72), '#8e3530'))))
        for sx in (-1, 1): P.append((ell(V(sx * 9.6, -7.5, -5.0), (3.4, 5.2, 6.4)), flat('#74241f')))         # the cheek guards
        P.append((I(torus_z(V(0, -1.0, -11.5), 10.5, 0.9), lambda p: -p[..., 1] - 2.0), flat('#1d1b19')))   # the chin strap
        return P
    G['pit_sparring_riot_helmet'] = ('head', pit_sparring_riot_helmet)

    for rid, (slot, fn) in G.items():
        COOK.OWN[rid] = (slot, fn)   # COOK's own table: CHARACTER's head_parts and body_parts (as COOK patched them) find each by its key
    return COOK, G


# --------------------------------------------------------------------------------------------- the rows (no bpy)
def rows():
    """the thirty into the files the game reads, the armory's own sums (tools/bohemia_armory.py's mean, r5, r10), idempotent: a row
    with armory.origin is taken out first; every other row (TUNING 2's prices, COOK's own keys) untouched"""
    import bohemia_armory as AY
    A = J(os.path.join(BB, 'armor.json')); N = J(os.path.join(BB, 'armour_names.json')); L = J(os.path.join(BB, 'armour_looks.json'))
    W = J(os.path.join(R, 'slices/wear/wear.json'))['pieces']
    gone = set()
    for k in ('body', 'head'):
        gone |= set(r['id'] for r in A[k] if (r.get('armory') or {}).get('origin'))
        A[k] = [r for r in A[k] if not (r.get('armory') or {}).get('origin')]
    for k in ('body', 'head'):
        for rid in list(N[k].keys()):
            if rid in gone: del N[k][rid]
        for rid in list(L[k].keys()):
            if rid in gone: del L[k][rid]
    rec = 'records/BOHEMIA_ORIGINS_EACH_ORIGIN_ITS_OWN_11_7_26.md'
    made = []
    for slot, s in pieces_spec():
        aid = {r['id']: r for r in A[slot]}
        a, b = (aid.get(x) for x in s['between'])
        assert a and b, '%s: no %s row %s' % (s['id'], slot, s['between'])
        nm = s['name'][3:] if s['name'].startswith('an ') else s['name'][2:] if s['name'].startswith('a ') else s['name']
        r = {'id': s['id'], 'name': nm.title(),
             'durability': AY.mean(a['durability'], b['durability'], AY.r5), 'fatigue': AY.mean(a.get('fatigue'), b.get('fatigue'), AY.rint)}
        if slot == 'head': r['vision'] = AY.mean(a.get('vision'), b.get('vision'), AY.rint)
        r['value'] = AY.mean(a.get('value'), b.get('value'), AY.r10)
        r['source'] = rec + ' | ORIGINS 11/7 (the armory\'s sum): the mean of ' + a['id'] + ' and ' + b['id'] + ' | A: ' + a['source'] + ' | B: ' + b['source']
        t = s.get('tune') or {}
        for kk, v in (t.get('set') or {}).items(): r[kk] = v
        if t: r['source'] += ' | tune: ' + json.dumps(t.get('set')) + ' (' + t['why'] + ')'
        r['armory'] = {'name': s['name'], 'class': s['class'], 'line': s['line'], 'tier': s['tier'], 'kind': 'origin', 'between': s['between'],
                       'origin': s['origin'], 'own': s['own'], 'draft': True}
        A[slot].append(r); N[slot][r['id']] = s['name']
        L[slot][r['id']] = {'name': s['name'], 'class': s['class']}
        if s['own'] in W: L[slot][r['id']]['own'] = s['own']
        made.append((slot, r))
    A['_origins'] = {'count': len(made), 'by': 'tools/bohemia_origins_their_own_gear.py rows from armory.json (rows with origin)', 'record': rec}
    AY.dump(os.path.join(BB, 'armor.json'), A); AY.dump(os.path.join(BB, 'armour_names.json'), N)
    json.dump(L, open(os.path.join(BB, 'armour_looks.json'), 'w'), indent=1, ensure_ascii=False)
    for slot, r in made: print('  %-28s %-4s holds %3s  weight %4s  %4s batteries  %s' % (r['id'], slot, r['durability'], r['fatigue'], max(1, AY.rint(r['value'] / 10.0)), 'own' if r['armory']['own'] in W else 'no model yet'))
    return made


# --------------------------------------------------------------------------------------------- render, pack, proof
def render(only=None):
    COOK, G = models()
    AR = COOK.AR
    for rid, (slot, fn) in G.items():
        if only and rid not in only: continue
        t = time.time(); AR.render_piece(slot, KEY(rid), KEY(rid), []); print('  %-30s %3.0f s' % (KEY(rid), time.time() - t), flush=True)


def pack():
    COOK, G = models()
    AR = COOK.AR
    keys = [KEY(rid) for rid in G]
    sprites = COOK.old_sprites(set(keys))
    have = []
    for rid, (slot, fn) in G.items():
        if os.path.exists(os.path.join(AR.WORK, KEY(rid), 'shots.json')): sprites += AR.sprites_of(KEY(rid), slot); have.append(rid)
    print('sheets', AR.pack_all(sprites))
    w = J(os.path.join(AR.OUT, 'wear.json'))
    w['what'] = ("COOK [the armour's art], rule 272(b): CHARACTER's pieces (the same shapes, its classes and extras) meshed and rendered "
                 "through DIRECTION's master rig in Blender (its light, film and source pass; the guide's camera at 45 degrees, the stretch, "
                 "57 px a metre; his head and trunk as holdouts; the family snap and the ring), the police riot helmet and the police vest "
                 "with their own art (tools/bohemia_cook_the_armour_through_the_rig_10_26_26.py); COOK [every armour its own] 11/3: the "
                 "armory's nine pieces of the valley's own each its own model, keys own_<row> (tools/bohemia_cook_every_armour_its_own_11_3_26.py); "
                 "ORIGINS [each origin its own] 11/7: every origin's own gear, thirty pieces, keys own_<row> (tools/bohemia_origins_their_own_gear.py). "
                 "The anchors and cells are CHARACTER's.")
    json.dump(w, open(os.path.join(AR.OUT, 'wear.json'), 'w'), separators=(',', ':'))
    pj = os.path.join(R, 'records/target/cook_armour_rig/pieces.json'); P = J(pj)
    for rid in have:
        m = os.path.join(AR.WORK, KEY(rid), 'meta.json')
        if os.path.exists(m): P[KEY(rid)] = dict(J(m), own_art=WHAT.get(rid, []), origin=rid.split('_')[0])
    json.dump(P, open(pj, 'w'), indent=1)
    L = J(os.path.join(BB, 'armour_looks.json'))
    for rid, (slot, fn) in G.items():
        if KEY(rid) in w['pieces'] and rid in L[slot]: L[slot][rid]['own'] = KEY(rid)
    json.dump(L, open(os.path.join(BB, 'armour_looks.json'), 'w'), indent=1, ensure_ascii=False)
    print('packed', len(have), 'of', len(G))


WHAT = {
    'wolf_gilded_riot_armour': ['gold leaf over black plate', 'sunburst on the chest', 'engraved band', 'rub-through to black', 'a dent', 'gilded shoulder plates', 'black collar and binding', 'belly plate'],
    'wolf_gilded_riot_helm': ['gilded dome', 'engraved band', 'gold crest down the crown', 'smoked visor', 'gilded pivots', 'black neck guard'],
    'rebuild_black_band_vest': ['rust canvas quilting', 'black band', 'the old crew ring stencilled', 'scraped', 'grime'],
    'rebuild_names_hard_hat': ['dirty white dome', 'black tape band', 'names in silver pen', 'ridge', 'brim'],
    'newcrew_surplus_vest': ['olive quilting', 'the white tag', 'black webbing straps', 'belt webbing'],
    'newcrew_surplus_hard_hat': ['olive dome', 'stencil', 'ridge', 'brim'],
    'south_road_dust_vest': ['sun-bleached tan', 'red dust at the hem', 'the interstate shield patch', 'its numbers'],
    'south_sun_wrap_hood': ['sand wrap', 'dark band', 'wrap folds', 'loose tail'],
    'truck_hi_vis_vest': ['hi-vis rubber', 'silver bands', 'front braces', 'back cross', 'zip'],
    'truck_hi_vis_hard_hat': ['white dome', 'silver band', 'blue water drop'],
    'watch_armband_jacket': ['faded denim jacket', 'orange armband', 'house number on the back', 'collar', 'placket'],
    'watch_orange_bandana': ['orange bandana', 'paisley dots', 'knot', 'tails'],
    'scav_tool_belt_vest': ['orange apron vest', 'pockets', 'tool belt', 'hammer handle', 'pry bar', 'wrench', 'tape measure'],
    'scav_headlamp_hood': ['grey hood', 'lamp band', 'headlamp', 'its glass'],
    'promise_funeral_carrier': ['black funeral coat', 'lapels', 'white lily', 'stem', 'black ribbon', 'straps'],
    'promise_ribbon_riot_helmet': ['riot shell', 'smoked visor', 'black ribbon', 'its knot and tails', 'name tag'],
    'desert_torn_patch_carrier': ['olive drab carrier', 'clean squares where patches were', 'hanging threads', 'mag pouches', 'straps'],
    'desert_steel_pot_hard_hat': ['steel pot', 'cut band', 'brim', 'open chin strap'],
    'raid_trophy_carrier': ['dark leather carrier', 'cord across the chest', 'keys', 'dog tags', 'other crews patches'],
    'raid_hand_print_riot_helmet': ['riot shell', 'red hand print', 'smoked visor', 'rim'],
    'lab_coat_vest': ['lab coat gone brown', 'stains', 'lapels', 'collar', 'lanyard', 'badge', 'orange tag'],
    'lab_respirator_hood': ['pale hood', 'half mask', 'two cartridges', 'strap'],
    'faith_ash_robe': ['long grey robe', 'ash', 'test circle rings on the back', 'colour bars', 'rope belt', 'collar', 'sleeves'],
    'faith_bone_cowl': ['bone-white cowl', 'the circle on the brow'],
    'debt_black_suit_vest': ['black suit', 'white shirt', 'thin dark tie', 'lapels', 'buttons'],
    'debt_numbered_jacket': ['safety orange jacket', 'big number on the back', 'number on the front', 'barcode', 'collar', 'sleeves'],
    'hunt_hide_patch_vest': ['leather vest', 'hide patches', 'fur streaks', 'stitching', 'cord', 'teeth'],
    'hunt_fur_ruff_hard_hat': ['hard leather cap', 'seam', 'dire wolf fur ruff'],
    'pit_fight_robe_carrier': ['oxblood satin robe', 'gold trim', 'sheen', 'gold name on the back', 'gold collar', 'sleeves'],
    'pit_sparring_riot_helmet': ['red leather headgear', 'gold band', 'centre seam', 'cheek guards', 'chin strap'],
}


def proof():
    """every origin's two pieces as they come off the rig, four facings each, with its class's placeholder beside it (the twin)"""
    COOK, G = models()
    AR = COOK.AR; CH = COOK.CH
    w = J(os.path.join(AR.OUT, 'wear.json')); sh = Image.open(os.path.join(AR.OUT, w['sheet'])).convert('RGBA')
    L = J(os.path.join(BB, 'armour_looks.json'))
    order = ['wolf', 'rebuild', 'newcrew', 'south', 'truck', 'watch', 'scav', 'promise', 'desert', 'raid', 'lab', 'faith', 'debt', 'hunt', 'pit']
    rowsx = []
    for o in order:
        for slot, s in pieces_spec():
            if s['origin'] != o: continue
            cells = w['pieces'].get(KEY(s['id']))
            if not cells: continue
            tw = w['pieces'].get(L[slot][s['id']]['class'])
            row = Image.new('RGBA', (10 * 60, 64), (88, 80, 70, 255))
            for i, f in enumerate(['S', 'SE', 'E', 'N']):
                c = cells.get(f)
                if c: row.alpha_composite(sh.crop((c[0], c[1], c[0] + c[2], c[1] + c[3])), (30 + i * 60 + c[4], (40 if slot == 'head' else 2) + c[5]))
            if tw and tw.get('S'):
                c = tw['S']; row.alpha_composite(sh.crop((c[0], c[1], c[0] + c[2], c[1] + c[3])), (30 + 5 * 60 + c[4], (40 if slot == 'head' else 2) + c[5]))
            rowsx.append(row)
    out = Image.new('RGBA', (600, 64 * len(rowsx)))
    for i, r in enumerate(rowsx): out.paste(r, (0, i * 64))
    os.makedirs(PROOF, exist_ok=True)
    out.resize((out.width * 2, out.height * 2), Image.NEAREST).save(os.path.join(PROOF, 'their_own_gear.png'))
    print('proof', os.path.join(PROOF, 'their_own_gear.png'))


def vote(shots=()):
    """the VOTE card's picture: each origin's two pieces off the wear sheet (south and south-east, three times the pixels), its name and
    its rule's name; then the demo's own shots (the gate's BOHEMIA_SHOT_DIR), side by side under it"""
    from PIL import ImageDraw, ImageFont
    w = J(os.path.join(R, 'slices/wear/wear.json')); sh = Image.open(os.path.join(R, 'slices/wear', w['sheet'])).convert('RGBA')
    O = J(os.path.join(BB, 'origins.json'))['origins']
    order = ['wolf', 'truck', 'watch', 'scav', 'desert', 'raid', 'lab', 'faith', 'promise', 'debt', 'hunt', 'pit', 'rebuild', 'newcrew', 'south']
    F = lambda s: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', s)
    W_, RH = 1170, 150
    card = Image.new('RGBA', (W_, 90 + RH * ((len(order) + 1) // 2)), (24, 22, 20, 255)); d = ImageDraw.Draw(card)
    d.text((24, 22), 'EACH ORIGIN ITS OWN: THE GEAR IT WALKS IN WEARING, SOLD ONLY IN ITS HOME TOWN', font=F(22), fill=(226, 214, 186))
    for n, oid in enumerate(order):
        o = [x for x in O if x['id'] == oid][0]; P = o['personal']; col, row = n % 2, n // 2
        x0, y0 = 20 + col * 580, 80 + row * RH
        d.rectangle([x0, y0, x0 + 560, y0 + RH - 10], fill=(40, 37, 33, 255))
        x = x0 + 10
        for slot in ('body', 'head'):
            rid = P['look']['wears'].get(slot)
            if not rid: continue
            cells = w['pieces'].get('own_' + rid, {})
            for f in ('S', 'SE'):
                c = cells.get(f)
                if not c: continue
                im = sh.crop((c[0], c[1], c[0] + c[2], c[1] + c[3])); im = im.resize((int(c[2] * 2.4), int(c[3] * 2.4)), Image.NEAREST)
                card.alpha_composite(im, (x, y0 + 12 + max(0, (110 - im.height) // 2))); x += im.width + 6
        if oid == 'debt':
            cells = w['pieces'].get('own_debt_numbered_jacket', {}); c = cells.get('N')
            if c: im = sh.crop((c[0], c[1], c[0] + c[2], c[1] + c[3])); im = im.resize((int(c[2] * 2.4), int(c[3] * 2.4)), Image.NEAREST); card.alpha_composite(im, (x, y0 + 20)); x += im.width + 6
        tx = x0 + 330
        d.text((tx, y0 + 18), o['name'], font=F(15), fill=(226, 214, 186))
        d.text((tx, y0 + 46), P['rule']['name'], font=F(15), fill=(199, 154, 60))
        words = P['look']['words']; lines, cur = [], ''
        for wd in words.split():
            if len(cur) + len(wd) > 27: lines.append(cur); cur = wd
            else: cur = (cur + ' ' + wd).strip()
        lines.append(cur)
        for k, ln in enumerate(lines[:4]): d.text((tx, y0 + 70 + k * 16), ln, font=F(11), fill=(170, 160, 140))
    out = [card]
    for s in shots:
        if os.path.exists(s): out.append(Image.open(s).convert('RGBA'))
    if len(out) > 1:
        H = 900; strip = [im.resize((int(im.width * H / im.height), H)) for im in out[1:]]
        sw = sum(im.width for im in strip) + 20 * (len(strip) + 1)
        row = Image.new('RGBA', (max(sw, W_), H + 40), (24, 22, 20, 255)); x = 20
        for im in strip: row.alpha_composite(im, (x, 20)); x += im.width + 20
        if row.width > W_: row = row.resize((W_, int(row.height * W_ / row.width)))
        full = Image.new('RGBA', (W_, card.height + row.height), (24, 22, 20, 255)); full.alpha_composite(card, (0, 0)); full.alpha_composite(row, (0, card.height)); card = full
    os.makedirs(PROOF, exist_ok=True)
    dst = os.path.join(PROOF, 'each_origin_its_own_11_7.webp'); card.convert('RGB').save(dst, 'WEBP', quality=88, method=6)
    print('vote', dst, card.size)


if __name__ == '__main__':
    a = sys.argv[1:]
    only = set(a[a.index('--only') + 1].split(',')) if '--only' in a else None
    cmd = a[0] if a else ''
    if cmd == 'render': render(only)
    elif cmd == 'rows': rows()
    elif cmd == 'pack': pack()
    elif cmd == 'proof': proof()
    elif cmd == 'vote': vote(a[1:])
    elif cmd == 'all': render(only); rows(); pack(); rows(); proof()
    else: print(__doc__)
