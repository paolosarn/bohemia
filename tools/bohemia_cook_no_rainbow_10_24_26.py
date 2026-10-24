#!/usr/bin/env python3
"""BOHEMIA -- COOK [no rainbow: the economic apocalypse palette] (10/24/26), FADED-DIRTY-RARE.
Rule 159 (Paolo 10/24: 'I said I don't want the world drowned in grey yellow desert sand, but now I'm seeing you make
buildings look rainbow coloured, adding grass and greens... do you have any idea what an economic apocalypse means?
Maybe on the Strip, maybe, but some of the houses are turquoise blue... maybe in act three things get better... but it's
an economic apocalypse, it just happened, there shouldn't be so much colour'). Amends 137(b): its colour list (green
lawns, blue pools, painted houses) was the coordinator's, and the 10/24 dials built exactly that.

WHAT THIS DOES. The map's colour lives in ONE file of dials (banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json): the 69
district pictures render through the rig with it (tools/bohemia_cook_the_map_in_colour_10_24_26.py) and the painting,
the map at every zoom since RUN's BUILD 10/24h, reads it by name (tools/bohemia_run_the_painting_wears_cook.py copies it
to records/target). So the regrade is a new set of dials, not a new painter:
  1. the bright 10/24 dials are KEPT as act three's (banks/BOHEMIA_MAP_COLOUR_DIALS_ACT3_THE_HEALED_10_24_26.json,
     rule 128 and 159(d): the same scenes re-rendered with more colour as the world heals);
  2. every old colour is regraded the same way (CIELAB: chroma x 0.3 and never past 9, value pulled toward the
     middle and a touch darker), so anything that still names an old colour gets the ruin's version of it;
  3. act one's MATERIALS are added (bleached shingle, tile gone brown-grey, tar, galvanised and rusted tin, a faded
     tarp, plywood, dirty and ash stucco, peeled paint with a ghost of its colour, dead lawn, dust, oil, ash, rubble)
     and every theme is rewritten in them: variety from material, value, wear and light, NOT from hue (159(a));
  4. the accents stay accents (159(c)): the Strip's neon on its signs only (the painting never paints neon on a
     roof or a wall), the faded tarp and a faded door; a faction's colour on the ground it claims is the territory
     code's, not these dials; no turquoise house, no green lawn, no blue pool (the pools are dry or black);
  5. the render tool's own two bright dials are dials now: a face that was not sand keeps its colour at x0.55
     saturation (act three's x1.25), and the dress (pools, trees) is dry and dead.

  python3 tools/bohemia_cook_no_rainbow_10_24_26.py write    # act one's dials into the bank (act three's kept first)
  python3 tools/bohemia_cook_no_rainbow_10_24_26.py check    # every colour's L, C, h and its family
  python3 tools/bohemia_cook_no_rainbow_10_24_26.py painter  # act one of the painter's own two tables (VB_COL, VB_CCOL in
      slices/BOHEMIA_CITY_WORLD.html, act three's as RUN pasted them): the block __ACT_ONE_IN_THE_PAINTER__ carries the
      result, with the lawns, the park and the trees set dead by hand after

REFERENCE CHECK (the 9/4 standing duty): Battle Brothers' map (9/24): value does the work and ONE saturated marker wins;
its ground is muted and its colour is the banner. The analog horror bible (9/20): the grime, the film and the hand,
never a beige wash and never candy. His 9/23 vote: 'the bright colours not so bright, vibrance turned down'. The real
thing: Detroit's and Flint's empty blocks, the 2008 foreclosure streets of North Las Vegas and Henderson (dead lawns,
drained pools gone black, plywood on the windows, a blue tarp on a roof, paint chalked and peeled to the primer).
REUSE CHECK: the 10/24 dials' structure and keys untouched (the painter and the render tool read them unchanged).
"""
import os, sys, json, copy

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(R, 'banks/BOHEMIA_MAP_COLOUR_DIALS_10_24_26.json')
ACT3 = os.path.join(R, 'banks/BOHEMIA_MAP_COLOUR_DIALS_ACT3_THE_HEALED_10_24_26.json')


# ------------------------------------------------------------------ CIELAB, both ways (D65, sRGB)
def _lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _gam(c):
    c = max(0.0, min(1.0, c))
    return 255.0 * (12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055)


def lab(rgb):
    r, g, b = [_lin(float(v)) for v in rgb]
    X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047
    Y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883
    f = lambda t: t ** (1 / 3) if t > 0.008856 else 7.787 * t + 16 / 116
    fx, fy, fz = f(X), f(Y), f(Z)
    return 116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)


def rgb(L, a, b):
    fy = (L + 16) / 116; fx = fy + a / 500; fz = fy - b / 200
    inv = lambda t: t ** 3 if t ** 3 > 0.008856 else (t - 16 / 116) / 7.787
    X, Y, Z = inv(fx) * 0.95047, inv(fy), inv(fz) * 1.08883
    r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z
    g = -0.9689 * X + 1.8758 * Y + 0.0415 * Z
    bb = 0.0557 * X - 0.2040 * Y + 1.0570 * Z
    return [int(round(_gam(v))) for v in (r, g, bb)]


def lch(c):
    import math
    L, a, b = lab(c)
    return L, math.hypot(a, b), math.degrees(math.atan2(b, a)) % 360


def family(c):
    L, C, h = lch(c)
    if L < 30: return 'dark'
    if C < 5: return 'neutral'
    if 45 <= h < 105 and C < 40 and L <= 86: return 'SAND'
    if h < 45 or h >= 330: return 'red'
    if h < 170: return 'green'
    if h < 265: return 'blue'
    return 'violet'


def ruin(c, kC=0.3, capC=9.0):
    """an old colour, ten years after the money died: the chroma most of the way gone, the value toward the middle and dirtier"""
    import math
    L, a, b = lab(c)
    C = math.hypot(a, b); h = math.atan2(b, a)
    C2 = min(C * kC, capC)
    L2 = L * 0.82 + 7.0
    return rgb(L2, C2 * math.cos(h), C2 * math.sin(h))


# ------------------------------------------------------------------ act one's materials (sRGB), each one written down
MATERIALS = {
    # roofs
    'shingle_bleached': [104, 102, 99],     # asphalt shingle, the sun took the black out of it
    'shingle_dark':     [66, 65, 66],
    'tile_bleached':    [128, 106, 98],     # terracotta ten summers on: brown-grey with a memory of red
    'tile_grimed':      [98, 86, 81],
    'tar_patch':        [46, 45, 45],       # the flat roof's tar, patched and patched
    'tin_galv':         [140, 140, 137],    # galvanised tin
    'tin_rust':         [108, 82, 66],      # the same tin, rusted through
    'tarp_faded':       [88, 101, 114],     # the one blue tarp on a roof, chalked by the sun (an accent, rare)
    'plywood':          [146, 130, 108],
    'roof_old_white':   [172, 171, 166],    # a cool roof gone grey
    'char':             [40, 37, 35],       # burned out
    # walls
    'stucco_dirty':     [164, 162, 156],    # white stucco, ten years of dust and rain streak
    'stucco_ash':       [136, 134, 131],
    'stucco_dun':       [146, 139, 128],    # the cream gone dun
    'stucco_ghost_peach': [154, 137, 127],  # peeled peach, the primer through it
    'stucco_ghost_blue':  [128, 134, 139],  # a blue house gone to a cool grey: never turquoise
    'stucco_ghost_sage':  [131, 135, 126],
    'stucco_stained':   [118, 111, 103],
    'soot_wall':        [78, 74, 72],
    'board_up':         [132, 118, 100],    # plywood over the windows
    'block_dirty':      [116, 115, 112],
    'concrete_stained': [126, 124, 119],
    'door_faded_red':   [126, 84, 76],      # one painted door, faded (an accent, rare)
    # ground
    'lawn_dead':        [101, 92, 78],      # a front lawn nobody watered for ten years
    'lawn_dead_dark':   [72, 68, 61],
    'dust_grey':        [136, 133, 127],
    'dirt_dark':        [78, 71, 63],
    'gravel_dirty':     [117, 116, 113],
    'concrete_cracked': [144, 143, 139],
    'oil_stain':        [52, 51, 51],
    'ash_ground':       [90, 88, 86],
    'weeds_dead':       [108, 103, 88],
    'weeds_dusty':      [92, 95, 82],       # what still grows, under the dust
    'rubble':           [124, 119, 112],
    'asphalt_old':      [70, 69, 70],
    # the dress
    'pool_black':       [44, 48, 42],       # a pool nobody drained: black water
    'pool_empty':       [140, 139, 134],    # drained, stained, leaves in it
    'palm_dead':        [98, 88, 74],
    'olive_dusty':      [86, 89, 74],
    'creosote_dusty':   [82, 84, 70],
    'coping_dirty':     [150, 148, 142],
    # water, the rock, the desert: what the ground is made of, the colour of a dry country
    'lake_murk':        [56, 66, 72],
    'lake_murk_deep':   [40, 47, 53],
    'shore_bathtub':    [168, 166, 160],    # Lake Mead's ring
    'basalt_dust':      [58, 57, 58],
    'varnish_dust':     [70, 62, 57],
    'redrock_dust':     [124, 92, 80],      # the Calico Hills, under ten years of dust
    'redrock_dust_dark': [96, 74, 66],
    'redrock_dust_light': [150, 122, 108],
    'limestone_dust':   [150, 147, 141],
    'desert_grey':      [146, 140, 130],
    'desert_pale':      [164, 161, 154],
    'caliche_dirty':    [176, 174, 168],
    'crop_dead':        [118, 108, 86],
    'crop_dusty':       [98, 100, 80],      # what a farm still grows (an accent, the rows only)
    'earth_dark':       [92, 76, 66],
    'gypsum_white':     [186, 185, 180],
    # the Strip: the glass and the gold gone dull; its neon stays its own, on the signs
    'glass_dull':       [96, 98, 101],
    'glass_gold_dull':  [128, 114, 92],
    'glass_bronze_dull': [92, 82, 74],
    'trash_faded_a':    [96, 106, 118],
    'trash_faded_b':    [132, 92, 86],
    'trash_faded_c':    [150, 140, 104],
    'trash_faded_d':    [98, 108, 92],
}

KEEP_ACCENT = ('neon_pink', 'neon_cyan', 'neon_gold', 'neon_red')   # the Strip's neon: on a sign only


def themes():
    """every theme in act one's materials: the same keys the painter and the render tool read"""
    house = {
        'ground': {'mosaic': [['lawn_dead', 0.24], ['dust_grey', 0.26], ['lawn_dead_dark', 0.16], ['gravel_dirty', 0.22], ['oil_stain', 0.12]], 'blob_m': 14},
        'ground_more': [{'mosaic': [['lawn_dead_dark', 0.34], ['weeds_dead', 0.26], ['dust_grey', 0.4]], 'blob_m': 10}],
        'roof': ['shingle_bleached', 'shingle_dark', 'tile_bleached', 'tile_grimed', 'shingle_bleached', 'tar_patch', 'tile_bleached', 'shingle_dark', 'tarp_faded', 'char'],
        'wall': ['stucco_dirty', 'stucco_ash', 'stucco_dun', 'stucco_ghost_peach', 'stucco_stained', 'stucco_ghost_blue', 'stucco_ash', 'stucco_ghost_sage', 'board_up', 'soot_wall'],
        'fence': ['block_dirty', 'concrete_stained', 'tin_rust'],
        'frame': 'stucco_dirty',
        'dress': {'pools': 3, 'trees': 3, 'pool': ['pool_empty', 'pool_black', 'pool_empty'], 'tree': ['palm_dead', 'olive_dusty', 'palm_dead']},
    }
    block = {
        'ground': {'mosaic': [['concrete_cracked', 0.34], ['asphalt_old', 0.26], ['oil_stain', 0.14], ['rubble', 0.16], ['weeds_dead', 0.1]], 'blob_m': 14},
        'ground_more': [{'mosaic': [['gravel_dirty', 0.5], ['dust_grey', 0.3], ['ash_ground', 0.2]], 'blob_m': 6}],
        'roof': ['roof_old_white', 'tin_galv', 'tar_patch', 'concrete_stained', 'tin_rust', 'shingle_dark', 'roof_old_white'],
        'wall': ['concrete_stained', 'block_dirty', 'stucco_dirty', 'soot_wall', 'stucco_ash', 'board_up', 'stucco_ghost_blue', 'door_faded_red', 'concrete_stained'],
        'fence': ['block_dirty', 'tin_rust'],
        'frame': 'concrete_stained',
        'dress': {'pools': 0, 'trees': 1, 'tree': ['palm_dead']},
    }
    glitz = {
        'ground': {'mosaic': [['concrete_cracked', 0.38], ['asphalt_old', 0.24], ['oil_stain', 0.14], ['lawn_dead', 0.12], ['rubble', 0.12]], 'blob_m': 12},
        'ground_more': [{'mosaic': [['concrete_stained', 0.5], ['lawn_dead_dark', 0.5]], 'blob_m': 5}],
        'roof': ['roof_old_white', 'glass_gold_dull', 'tin_galv', 'tar_patch', 'glass_dull'],
        'wall': ['glass_gold_dull', 'stucco_dirty', 'glass_bronze_dull', 'glass_dull', 'concrete_stained', 'soot_wall', 'stucco_ghost_peach'],
        'fence': ['neon_pink', 'neon_cyan', 'neon_gold', 'neon_red'],
        'frame': 'concrete_stained',
        'dress': {'pools': 2, 'trees': 3, 'pool': ['pool_black', 'pool_empty'], 'tree': ['palm_dead', 'palm_dead', 'olive_dusty']},
    }
    green = {   # the golf course, the cemetery, the ballpark, the campus: ten years without a sprinkler
        'ground': {'mosaic': [['lawn_dead', 0.34], ['weeds_dead', 0.22], ['lawn_dead_dark', 0.18], ['dust_grey', 0.2], ['weeds_dusty', 0.06]], 'blob_m': 14},
        'ground_more': [{'mosaic': [['lawn_dead_dark', 0.5], ['weeds_dead', 0.5]], 'blob_m': 6}, {'mosaic': [['caliche_dirty', 0.7], ['dust_grey', 0.3]], 'blob_m': 4}],
        'roof': ['tile_bleached', 'roof_old_white', 'shingle_dark'],
        'wall': ['stucco_dirty', 'stucco_dun', 'tin_rust', 'concrete_stained'],
        'fence': ['block_dirty', 'tin_rust'],
        'frame': 'stucco_dirty',
        'dress': {'pools': 0, 'trees': 4, 'tree': ['palm_dead', 'olive_dusty', 'olive_dusty']},
    }
    rock = {
        'rock': True,
        # the open ground at a range's foot is the fan's grey-brown wash, the basalt is the high bands (E13: a black foot
        # read 18 to 20 at every hour and split from the land beside it)
        'ground': {'mosaic': [['varnish_dust', 0.22], ['redrock_dust', 0.26], ['desert_grey', 0.3], ['limestone_dust', 0.22]], 'blob_m': 26},
        # act three's order of values kept (dark foot, red middle, pale crest), only the colour dusted: E13 reads the light on
        # a few texels of a rim range and a black band mid-height read 18 at every hour
        'bands': ['basalt_dust', 'varnish_dust', 'redrock_dust_dark', 'redrock_dust', 'redrock_dust', 'redrock_dust_light', 'limestone_dust', 'limestone_dust'],
        'roof': ['redrock_dust', 'limestone_dust', 'basalt_dust', 'varnish_dust'],
        'wall': ['redrock_dust_dark', 'basalt_dust', 'varnish_dust'],
        'fence': ['basalt_dust'],
        'frame': 'limestone_dust',
        'dress': {'pools': 0, 'trees': 0, 'bushes': 10, 'bush': ['creosote_dusty', 'basalt_dust']},
    }
    desert = {
        'ground': {'mosaic': [['creosote_dusty', 0.1], ['varnish_dust', 0.12], ['desert_grey', 0.3], ['desert_pale', 0.24], ['dirt_dark', 0.12], ['caliche_dirty', 0.12]], 'blob_m': 11},
        'ground_more': [{'mosaic': [['dirt_dark', 0.5], ['desert_grey', 0.5]], 'blob_m': 6}, {'mosaic': [['caliche_dirty', 0.6], ['desert_pale', 0.4]], 'blob_m': 5}],
        'roof': ['creosote_dusty', 'olive_dusty', 'tin_rust', 'basalt_dust'],
        'wall': ['creosote_dusty', 'tin_rust', 'varnish_dust', 'basalt_dust'],
        'fence': ['tin_rust', 'basalt_dust'],
        'frame': 'caliche_dirty',
        'dress': {'pools': 0, 'trees': 0, 'bushes': 14, 'bush': ['creosote_dusty', 'creosote_dusty', 'varnish_dust', 'palm_dead']},
    }
    road = {
        'ground': {'mosaic': [['weeds_dead', 0.18], ['gravel_dirty', 0.34], ['dust_grey', 0.26], ['oil_stain', 0.1], ['caliche_dirty', 0.12]], 'blob_m': 10},
        'ground_more': [{'mosaic': [['concrete_cracked', 0.6], ['weeds_dead', 0.4]], 'blob_m': 4}],
        'roof': ['concrete_stained', 'tin_galv', 'roof_old_white'],
        'wall': ['concrete_stained', 'stucco_dirty', 'block_dirty', 'soot_wall', 'tin_rust'],
        'fence': ['tin_rust', 'concrete_stained'],
        'frame': 'concrete_stained',
        'dress': {'pools': 0, 'trees': 2, 'tree': ['palm_dead', 'palm_dead']},
    }
    water = {
        'water': True,
        'ground': {'mosaic': [['shore_bathtub', 0.3], ['gravel_dirty', 0.4], ['dirt_dark', 0.3]], 'blob_m': 12},
        'roof': ['concrete_stained', 'tin_galv', 'tin_rust'],
        'wall': ['concrete_stained', 'block_dirty', 'stucco_ash', 'soot_wall'],
        'fence': ['tin_rust', 'concrete_stained'],
        'frame': 'concrete_stained',
        'dress': {'pools': 0, 'trees': 1, 'tree': ['palm_dead']},
    }
    industry = {
        'ground': {'mosaic': [['gravel_dirty', 0.36], ['asphalt_old', 0.24], ['oil_stain', 0.16], ['rubble', 0.14], ['weeds_dead', 0.1]], 'blob_m': 14},
        'ground_more': [{'mosaic': [['ash_ground', 0.6], ['tin_rust', 0.4]], 'blob_m': 3}],
        'roof': ['tin_rust', 'tin_galv', 'roof_old_white', 'tar_patch', 'tin_rust', 'char'],
        'wall': ['tin_rust', 'block_dirty', 'tin_galv', 'concrete_stained', 'soot_wall', 'stucco_ghost_blue', 'concrete_stained'],
        'fence': ['tin_rust', 'block_dirty'],
        'frame': 'concrete_stained',
        'dress': {'pools': 0, 'trees': 0, 'tree': ['olive_dusty']},
    }
    field = {   # a farm still works in act one: fallow dirt and dead stubble, a few dusty rows
        'fields': ['crop_dead', 'earth_dark', 'crop_dead', 'dirt_dark', 'crop_dusty', 'weeds_dead'],
        'ground': {'mosaic': [['crop_dead', 0.4], ['earth_dark', 0.36], ['crop_dusty', 0.24]], 'blob_m': 12},
        'roof': ['tin_rust', 'tin_galv', 'roof_old_white'],
        'wall': ['door_faded_red', 'stucco_dirty', 'tin_rust', 'concrete_stained'],
        'fence': ['tin_rust', 'block_dirty'],
        'frame': 'stucco_dirty',
        'dress': {'pools': 0, 'trees': 2, 'tree': ['olive_dusty', 'palm_dead']},
    }
    dump = {
        'ground': {'mosaic': [['dirt_dark', 0.3], ['tin_rust', 0.16], ['trash_faded_a', 0.12], ['trash_faded_c', 0.1], ['trash_faded_b', 0.1], ['ash_ground', 0.12], ['trash_faded_d', 0.1]], 'blob_m': 3},
        'roof': ['tin_rust', 'tin_galv'],
        'wall': ['tin_rust', 'block_dirty', 'trash_faded_a'],
        'fence': ['tin_rust'],
        'frame': 'concrete_stained',
        'dress': {'pools': 0, 'trees': 0, 'bushes': 8, 'bush': ['trash_faded_a', 'trash_faded_b', 'trash_faded_c', 'tin_rust']},
    }
    park = {
        'ground': {'mosaic': [['lawn_dead', 0.34], ['weeds_dead', 0.22], ['lawn_dead_dark', 0.2], ['dust_grey', 0.18], ['weeds_dusty', 0.06]], 'blob_m': 14},
        'ground_more': [{'mosaic': [['lawn_dead_dark', 0.5], ['weeds_dead', 0.5]], 'blob_m': 6}, {'mosaic': [['caliche_dirty', 0.7], ['dust_grey', 0.3]], 'blob_m': 4}],
        'roof': ['olive_dusty', 'palm_dead', 'creosote_dusty', 'weeds_dusty', 'palm_dead'],
        'wall': ['olive_dusty', 'palm_dead', 'creosote_dusty'],
        'fence': ['block_dirty', 'tin_rust'],
        'frame': 'stucco_dirty',
        'dress': {'pools': 0, 'trees': 4, 'tree': ['palm_dead', 'olive_dusty', 'palm_dead']},
        '_why': "the park's and the springs' own trees are tiered boxes in the factory: everything that stands here is a dusty or a dead tree",
    }
    gypsum = {
        'rock': True,
        'ground': {'mosaic': [['gravel_dirty', 0.3], ['caliche_dirty', 0.4], ['gypsum_white', 0.3]], 'blob_m': 18},
        'bands': ['basalt_dust', 'limestone_dust', 'gypsum_white', 'caliche_dirty', 'limestone_dust', 'gypsum_white', 'caliche_dirty', 'caliche_dirty'],
        'roof': ['caliche_dirty', 'gypsum_white', 'limestone_dust'],
        'wall': ['limestone_dust', 'basalt_dust', 'tin_rust'],
        'fence': ['basalt_dust'],
        'frame': 'limestone_dust',
        'dress': {'pools': 0, 'trees': 0, 'bushes': 8, 'bush': ['creosote_dusty', 'basalt_dust']},
        '_why': 'gypsum is white, the one white ground in the valley, dusted',
    }
    return dict(house=house, block=block, glitz=glitz, green=green, rock=rock, desert=desert, road=road, water=water,
                industry=industry, field=field, dump=dump, park=park, gypsum=gypsum)


def act_one(bright):
    d = copy.deepcopy(bright)
    d['_what'] = ("COOK [no rainbow: the economic apocalypse palette] (rule 159, Paolo 10/24: 'it's an economic apocalypse, it just "
                  "happened, there shouldn't be so much colour'). ACT ONE'S DIALS of every map district picture and of the painting "
                  "(the map at every zoom reads these by name). Faded, dirty, rare: sun-bleached and peeled paint gone toward grey, dead "
                  "brown lawns and dust, grey and stained concrete, rust, char, tarp, plywood, oil; variety from material, value, wear and "
                  "light, not hue; colour only as an accent. Act three's (the bright 10/24 set, the world healed) are kept beside this in "
                  "banks/BOHEMIA_MAP_COLOUR_DIALS_ACT3_THE_HEALED_10_24_26.json (rule 128: the same scenes, re-rendered). Written by "
                  "tools/bohemia_cook_no_rainbow_10_24_26.py.")
    d['era'] = 'act1_the_ruin'
    d['dust'] = [0.42, 0.40, 0.37]
    d['_dust'] = ("the rig's sun-bleached dust (0.66, 0.60, 0.50 linear) is beige; act one's is a dirty concrete dust, a shade warmer "
                  "than grey and darker than 10/24's 0.5 grey: the grime stays, the beige wash goes (rule 137b), and it is never clean")
    pal = {}
    for k, v in bright['palette'].items():
        pal[k] = list(v) if k in KEEP_ACCENT else ruin(v)
    pal.update(MATERIALS)
    d['palette'] = pal
    d['themes'] = themes()
    d['keep_sat'] = 0.55
    d['_keep_sat'] = ("a face of the factory's scene that was not sand (the barn's red, a sign, the glass) keeps its colour at this "
                      "saturation: act one x0.55, act three x1.25 (10/24's, which pushed them brighter)")
    d['special'] = {'solar': {'win_wall': 'solar_blue', 'win_frame': 'solar_frame'}, 'golf': {'bright_flat': 'caliche_dirty'},
                    'boneyard': {'dress_neon': True}}
    d['_sand_in_the_palette'] = ("the sand family (the measure's own test: L 30-86, C 5-40, h 45-105) holds the dead lawn, the dun "
                                 "stucco, the plywood, the rust and the desert's grey-brown; each is one choice among greys, darks "
                                 "and stained concrete, never a whole theme, so the map stays under a third at every zoom")
    d['_accents'] = ("159(c): the Strip's neon (neon_*) is kept at full strength and appears only on the glitz fences and signs (the "
                     "painting refuses neon on a roof or a wall); the faded tarp (one roof in ten in the houses), the faded red door "
                     "(one wall in nine in the blocks and the farms' barns); a faction's colour on its ground is the territory code's")
    return d


def painter():
    """the painter's tables read out of the world page (the act three values RUN pasted), each key its own value with its
    chroma cut to a third and capped (rust, red rock, the Strip's gold a little more), the pools black and the lake murk"""
    import re, math
    s = open(os.path.join(R, 'slices/BOHEMIA_CITY_WORLD.html'), encoding='utf8').read()
    i = s.index('var VB_COL = {'); col = dict(re.findall(r"(\w+): vbHex\('(#[0-9a-f]{6})'\)", s[i:i + 800]))
    i = s.index('var VB_CCOL = {'); j = s.index('};', i); ccol = dict(re.findall(r"(\w+): '(#[0-9a-f]{6})'", s[i:j]))
    h2r = lambda h: [int(h[k:k + 2], 16) for k in (1, 3, 5)]
    r2h = lambda c: '#%02x%02x%02x' % tuple(max(0, min(255, v)) for v in c)
    CAP = {'rock': 11, 'rust': 11, 'gold': 12, 'shop': 10, 'tie': 9, 'fan': 7}
    KEEP = {'lit', 'lamp', 'neon', 'neonN', 'burn', 'ash', 'roofC', 'asphalt', 'conc', 'edge', 'road'}
    def act(k, h):
        if k in KEEP: return None
        if k == 'pool': return '#2f3431'
        L, a, b = lab(h2r(h)); C = math.hypot(a, b); hh = math.atan2(b, a)
        L2, C2 = (min(L, 30), min(C * 0.3, 7)) if k == 'water' else (L, min(C * 0.35, CAP.get(k, 7)))
        if C <= C2 + 0.3: return None
        return r2h(rgb(L2, C2 * math.cos(hh), C2 * math.sin(hh)))
    for name, t in (('col', col), ('ccol', ccol)):
        out = {k: act(k, v) for k, v in t.items()}
        print(name, json.dumps({k: v for k, v in out.items() if v}))


def main():
    a = sys.argv[1:] or ['check']
    if a[0] == 'painter':
        painter(); return
    if a[0] == 'write':
        bank = json.load(open(BANK))
        if not os.path.exists(ACT3):
            if 'keep_sat' in bank:   # this tool's own act one (the 10/24 bright set also called itself act1_the_ruin)
                sys.exit('the bank is already act one and act three was never kept: restore it from git first')
            act3 = copy.deepcopy(bank)
            act3['era'] = 'act3_the_healed'
            act3['_era'] = ("rule 159(d) and 128 (Paolo 10/24: 'maybe in act three things get better, part of that transformation over "
                            "time'): the 10/24 bright dials (lawns gone wild, pools, painted stucco, tile) are ACT THREE's, the world "
                            "healed; render them with BOHEMIA_COLOUR_DIALS=" + os.path.relpath(ACT3, R) + " when act three starts (rule 128(d): "
                            "not before he is happy with act one)")
            act3.setdefault('keep_sat', 1.25)
            json.dump(act3, open(ACT3, 'w'), indent=1)
            print('kept act three:', os.path.relpath(ACT3, R))
        bright = json.load(open(ACT3))
        one = act_one(bright)
        json.dump(one, open(BANK, 'w'), indent=1)
        print('wrote act one:', os.path.relpath(BANK, R))
        a = ['check']
    if a[0] == 'check':
        d = json.load(open(BANK))
        used = set()
        for t in d['themes'].values():
            for k in ('roof', 'wall', 'fence', 'bands', 'fields'):
                used.update(t.get(k, []) if isinstance(t.get(k), list) else [])
            for g in [t.get('ground')] + list(t.get('ground_more', [])):
                if g: used.update(c for c, _w in g['mosaic'])
            used.update(t.get('dress', {}).get('pool', [])); used.update(t.get('dress', {}).get('tree', [])); used.update(t.get('dress', {}).get('bush', []))
        fam = {}
        for k in sorted(used):
            c = d['palette'][k]; L, C, h = lch(c); f = family(c); fam[f] = fam.get(f, 0) + 1
            flag = '  <-- over 20' if C > 20 and k not in KEEP_ACCENT else ''
            print('  %-20s %-15s L %5.1f  C %5.1f  h %5.1f  %s%s' % (k, c, L, C, h, f, flag))
        print('families of the colours the themes use:', fam)


if __name__ == '__main__':
    main()
