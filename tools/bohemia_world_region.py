#!/usr/bin/env python3
"""
BOHEMIA -- THE REGION (10/17/26, WORLD lane).  Row [the region], rules 109, 110, 46, 33, 77.

PAOLO 10/16: "our map has to be as big as fucking Battle Brothers and that's still not
the case... I don't know if we need to break the grid and have more grids... you gotta
pick one and I'm choosing Battle Brothers... a larger grid or something."

THE JOB. RUN broke the grid in two (slices/bohemia_region.js): the valley keeps its 96 x 96
blocks and a REGION of the same blocks runs 200 past every rim, 496 x 496. RUN reads what
each region block is off the land PAINTER, which is a picture (basin-and-range noise, a
lake out past whichever corner the valley's own lake rectangle sits in, roads that keep
going straight). This file replaces the picture with THE LAND: the real Las Vegas region,
every block its terrain from rule 46's fifteen, the real roads faster than the dirt, the
real places as destinations hours apart. NOTHING HERE DRAWS. The land is data; RUN paints it.

THE SCALE, MEASURED, NOT FELT. engine/bohemia_overmap.js line 19, its own words: "The
valley is 96 cells across = 5.73 miles." The real Las Vegas valley, Summerlin's edge to
Henderson's, is about 32 km across (lon -115.35 to -114.99 at 36.1 N is 32.4 km). So the
valley generator already draws a compressed Las Vegas, and the ONE honest scale for the
whole map is the one its own bones set: 96 blocks stand for 32 km, a block is 333 m of real
ground. At that scale the 496-block region is 165 km across and holds everything rule 109
names: Henderson, Boulder City, Lake Mead's whole Boulder Basin, the dam, I-15 south to
Primm, US-95 north-west to Indian Springs and the test site's gate at Mercury, Pahrump,
Moapa, Searchlight. (A block in the FIGHT is still a 96-metre house block: the fight is a
piece of the city, not a map cell. TWO SCALES, ONE GAME; the overmap's own line says "a
cell is a NEIGHBOURHOOD, not a lot".)

ORIENTATION. The data is REAL: north is y = 0 (the land painter's own rule), east is +x.
The valley rolls its east-west mirror per seed (the compass in vbCore: east is x1 when the
15 runs west of the Strip, else x0). engine/bohemia_region_land.js mirrors x when the
compass says so; this file never knows the seed. Rule 40g: the bones never move.

WHAT IS MINE AND WHAT IS NOT. Mine: which kind each block is, which road class crosses it,
how many minutes a block costs on foot, where the places are and how far. Not mine: the
pixels (RUN, COOK), the step the party takes (RUN), the felt numbers (TUNING: the walking
speeds below ship tagged tuned:false with their source), who holds what (FACTIONS).

  python3 tools/bohemia_world_region.py            writes engine/BOHEMIA_REGION_LAND.json
  python3 tools/bohemia_world_region.py --thumb    also prints a 62-wide ascii thumbnail
"""
import json, math, os, sys, hashlib, heapq

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'engine', 'BOHEMIA_REGION_LAND.json')

N, K = 96, 200
D = N + 2 * K
METRES_PER_CELL = 333.0          # 32 km / 96 blocks; the overmap's "96 cells = 5.73 miles" re-read against the real valley
LAT0, LON0 = 36.135, -115.170    # the valley's middle block (47.5, 47.5): the Strip's north end, Sahara and the 15
KM_PER_DEG_LAT = 111.0
KM_PER_DEG_LON = 111.0 * math.cos(math.radians(LAT0))   # 89.7 at 36.1 N

def cell_of(lat, lon):
    """real -> grid, real orientation (north y0, east +x). Fractional."""
    x = (N - 1) / 2 + (lon - LON0) * KM_PER_DEG_LON * 1000 / METRES_PER_CELL
    y = (N - 1) / 2 - (lat - LAT0) * KM_PER_DEG_LAT * 1000 / METRES_PER_CELL
    return x, y

def km_of(lat, lon):
    dx = (lon - LON0) * KM_PER_DEG_LON; dy = (lat - LAT0) * KM_PER_DEG_LAT
    return math.hypot(dx, dy), (math.degrees(math.atan2(dx, dy)) + 360) % 360

def hash01(x, y, s):
    h = (s ^ (x * 374761393) ^ (y * 668265263)) & 0xffffffff
    h = (h ^ (h >> 13)) * 1274126177 & 0xffffffff
    return ((h ^ (h >> 16)) & 0xffffffff) / 4294967296.0

# ---- the kinds: rule 46's fifteen, the thirteen the map hands over, in the inventory's names ----
# one character a cell. 'V' is the valley's own 96 x 96, rolled per game; '~' is open water
# (a passability, its fight kind is the shore); '^' is a peak: hills you cannot cross.
CODE = {
    '.': 'open_desert', 'h': 'hills', '^': 'hills', '~': 'wash_and_shore', 's': 'wash_and_shore',
    'f': 'freeway', 'b': 'suburb_block', 'i': 'industrial', 'a': 'airport', 'p': 'solar_and_pumps',
    'l': 'landfill', 'g': 'golf_and_park', 't': 'trailer_park', 'x': 'lot_and_bigbox', 'V': 'valley',
}
ROADCODE = {0: '-', 1: 'F', 2: 'S', 3: 'D'}   # the road layer's own letters: none, freeway/US, state route, dirt
# RUN's own passability codes (slices/bohemia_region.js): 0 open ground, 1 a road, 2 rough, 3 cannot be crossed
PASS = {'.': 0, 'b': 0, 'i': 0, 'a': 0, 'p': 0, 'l': 0, 'g': 0, 'x': 0, 't': 0, 'f': 1,
        'h': 2, 's': 2, '~': 3, '^': 3, 'V': 0}

# ---- the walking speeds (TUNING's, tuned:false): a company on foot, loaded, eight marching hours a day ----
# source: US Army FM 21-18 (foot marches) 4 km/h loaded on a road, Naismith's rule for the climb,
# desert pavement and creosote flat about 3.5 km/h, dry sand in a wash under 3, broken rock slopes 2 to 2.5.
SPEED_KMH = {'paved': 5.0, 'dirt': 4.3, 'streets': 4.5, 'open': 3.5, 'wash': 2.8, 'hills': 2.2}
HOURS_A_DAY = 8
def mins_per_cell(kmh): return (METRES_PER_CELL / 1000.0) / kmh * 60.0
def speed_class(code, road):
    if road in (1, 2): return 'paved'
    if road == 3: return 'dirt'
    if code in ('b', 'i', 'a', 'p', 'l', 'g', 'x', 't', 'V'): return 'streets'
    if code == '.': return 'open'
    if code == 's': return 'wash'
    if code == 'h': return 'hills'
    return None   # '~' and '^'

# =====================================================================================
# THE LAND, in real coordinates. Every number below is a place on a real map.
# =====================================================================================
# the ranges: a spine (lat, lon) polyline, a half width in km, how much of it is peak
RANGES = [
    ('SPRING MOUNTAINS',   [(35.95, -115.49), (36.02, -115.50), (36.10, -115.47), (36.17, -115.52), (36.27, -115.69), (36.36, -115.69), (36.46, -115.76)], 9.0, 0.45),
    ('MT POTOSI',          [(35.95, -115.49), (35.88, -115.45)], 5.0, 0.4),
    ('RED ROCK ESCARPMENT',[(36.08, -115.44), (36.16, -115.46)], 3.0, 0.35),
    ('BLUE DIAMOND HILL',  [(36.06, -115.40), (36.09, -115.37)], 2.2, 0.0),
    ('LAS VEGAS RANGE',    [(36.32, -115.08), (36.40, -115.18), (36.48, -115.24)], 4.5, 0.45),
    ('SHEEP RANGE',        [(36.45, -115.17), (36.58, -115.21), (36.70, -115.24)], 7.0, 0.45),
    ('DESERT RANGE',       [(36.52, -115.42), (36.70, -115.50)], 5.0, 0.4),
    ('PINTWATER RANGE',    [(36.60, -115.60), (36.78, -115.68)], 4.5, 0.4),
    ('SPOTTED RANGE',      [(36.62, -115.86), (36.76, -115.92)], 4.0, 0.4),
    ('FRENCHMAN MOUNTAIN', [(36.12, -114.99), (36.19, -114.97), (36.24, -114.96)], 2.6, 0.45),
    ('MUDDY MOUNTAINS',    [(36.22, -114.78), (36.32, -114.68), (36.42, -114.58)], 6.5, 0.45),
    ('DRY LAKE RANGE',     [(36.42, -114.90), (36.56, -114.86)], 3.0, 0.4),
    ('ARROW CANYON RANGE', [(36.55, -114.98), (36.75, -114.95)], 3.0, 0.4),
    ('RIVER MOUNTAINS',    [(36.02, -114.90), (36.09, -114.86)], 3.0, 0.4),
    ('BLACK MOUNTAINS AZ', [(36.00, -114.65), (35.80, -114.60), (35.60, -114.58)], 5.5, 0.45),
    ('ELDORADO MOUNTAINS', [(35.95, -114.80), (35.78, -114.78), (35.60, -114.76)], 4.5, 0.45),
    ('MCCULLOUGH RANGE',   [(35.98, -115.04), (35.85, -115.06), (35.70, -115.10), (35.55, -115.12)], 5.0, 0.4),
    ('BIRD SPRING RANGE',  [(35.92, -115.38), (35.80, -115.34), (35.68, -115.38)], 3.5, 0.4),
    ('LUCY GRAY MOUNTAINS',[(35.62, -115.22), (35.55, -115.26)], 3.0, 0.4),
    ('SPRING RANGE SOUTH', [(35.88, -115.60), (35.75, -115.70)], 4.0, 0.4),
    ('NEWBERRY MOUNTAINS', [(35.45, -114.80), (35.55, -114.75)], 4.0, 0.4),
    ('HIGHLAND RANGE',     [(35.52, -115.00), (35.68, -114.98)], 3.0, 0.4),
    ('MORMON MESA EDGE',   [(36.70, -114.45), (36.78, -114.35)], 3.0, 0.3),
]
# Lake Mead and the water: circles (lat, lon, radius km) and channels (polyline, half width km)
WATER_DISCS = [
    (36.09, -114.77, 6.5),   # Boulder Basin
    (36.13, -114.84, 2.6),   # Las Vegas Bay
    (36.04, -114.79, 2.6),   # Boulder Beach, Hemenway Harbor
    (36.14, -114.68, 3.0),   # toward Boulder Canyon
    (36.11, -114.93, 1.1),   # Lake Las Vegas (made, 1991)
    (36.20, -114.45, 3.0), (36.30, -114.39, 2.4), (36.40, -114.36, 2.4),   # the Overton Arm
    (36.13, -114.50, 3.6), (36.10, -114.40, 3.2),                           # the Virgin Basin
]
WATER_CHANNELS = [
    ([(36.06, -114.74), (36.016, -114.737)], 0.5),                      # Black Canyon to the dam
    ([(36.016, -114.737), (35.95, -114.72), (35.85, -114.68), (35.75, -114.66), (35.60, -114.67)], 0.35),   # the Colorado below the dam
    ([(36.14, -114.68), (36.15, -114.58)], 1.2),                        # Boulder Canyon
]
# the washes: dry channels, sand and tamarisk, slow going
WASHES = [
    ([(36.10, -115.00), (36.11, -114.95), (36.12, -114.88)], 0.5),      # Las Vegas Wash to the Bay
    ([(36.03, -115.06), (36.07, -115.00)], 0.35),                        # Duck Creek
    ([(36.00, -115.00), (36.05, -114.97)], 0.3),                         # Pittman Wash
    ([(36.33, -115.26), (36.27, -115.22)], 0.35),                        # Tule Springs wash
    ([(36.42, -114.96), (36.30, -114.88), (36.22, -114.82)], 0.4),       # California Wash
    ([(36.58, -114.80), (36.48, -114.68)], 0.5),                         # the Muddy River bottoms
    ([(35.85, -114.92), (35.86, -114.98)], 1.2),                         # Eldorado dry lake
    ([(35.78, -115.30), (35.74, -115.30)], 1.1),                         # Jean dry lake
    ([(35.68, -115.31), (35.65, -115.32)], 1.0),                         # Roach dry lake
    ([(36.52, -115.62), (36.56, -115.60)], 1.2),                         # Three Lakes playa
    ([(36.42, -114.84), (36.45, -114.86)], 0.9),                         # Dry Lake
]
# the roads: name, class (1 freeway or US highway, 2 state route, 3 dirt), polyline
ROADS = [
    ('I-15 S',       1, [(36.03, -115.18), (35.94, -115.21), (35.85, -115.29), (35.78, -115.33), (35.68, -115.36), (35.61, -115.39), (35.52, -115.42), (35.30, -115.55)]),
    ('I-15 N',       1, [(36.24, -115.07), (36.28, -115.02), (36.35, -114.94), (36.42, -114.86), (36.52, -114.76), (36.60, -114.68), (36.72, -114.55), (36.85, -114.40), (37.00, -114.20)]),
    ('US-95 NW',     1, [(36.24, -115.26), (36.30, -115.37), (36.38, -115.48), (36.46, -115.58), (36.57, -115.67), (36.66, -115.99), (36.72, -116.20)]),
    ('I-515 / US-93',1, [(36.08, -115.03), (36.04, -114.98), (35.97, -114.92)]),                 # Boulder Highway to Railroad Pass
    ('I-11 / US-93', 1, [(35.97, -114.92), (35.95, -114.86), (35.97, -114.80), (36.00, -114.76), (36.015, -114.74), (35.99, -114.70), (35.90, -114.62), (35.75, -114.55), (35.45, -114.20)]),   # the Boulder City bypass, the dam bridge, Arizona
    ('US-93 OLD',    2, [(35.97, -114.92), (35.98, -114.84), (36.00, -114.80), (36.016, -114.737)]),   # through Boulder City to the dam's crest
    ('US-95 S',      1, [(35.97, -114.92), (35.90, -114.95), (35.80, -114.95), (35.65, -114.93), (35.47, -114.92), (35.35, -114.90)]),
    ('NV-160',       2, [(36.03, -115.26), (36.05, -115.40), (36.02, -115.50), (36.08, -115.62), (36.15, -115.80), (36.21, -115.98), (36.25, -116.10)]),
    ('NV-159',       2, [(36.16, -115.33), (36.13, -115.43), (36.07, -115.45), (36.05, -115.40)]),
    ('NV-157 KYLE',  2, [(36.30, -115.37), (36.28, -115.50), (36.26, -115.64)]),
    ('NV-156 LEE',   2, [(36.46, -115.58), (36.40, -115.66), (36.33, -115.68)]),
    ('NV-158',       2, [(36.26, -115.64), (36.33, -115.68)]),
    ('NV-147 LAKE MEAD BLVD', 2, [(36.20, -115.08), (36.18, -114.95), (36.17, -114.85), (36.20, -114.75), (36.24, -114.62), (36.30, -114.52), (36.37, -114.45), (36.43, -114.43), (36.50, -114.42), (36.54, -114.44)]),
    ('NV-169 VALLEY OF FIRE', 2, [(36.43, -114.43), (36.43, -114.52)]),
    ('ECHO BAY RD',    2, [(36.30, -114.52), (36.31, -114.43)]),
    ('NV-168 MOAPA',   2, [(36.64, -114.63), (36.68, -114.60)]),
    ('NV-564 LAKE MEAD PKWY', 2, [(36.05, -115.00), (36.10, -114.93), (36.08, -114.86), (36.04, -114.80)]),
    ('LAKESHORE RD', 2, [(36.04, -114.80), (36.09, -114.84), (36.14, -114.88), (36.17, -114.85)]),
    ('NV-146 ST ROSE', 2, [(36.01, -115.03), (36.02, -115.18)]),
    ('NV-161 GOODSPRINGS', 2, [(35.78, -115.33), (35.83, -115.43), (35.82, -115.62)]),
    ('NV-165 NELSON', 2, [(35.95, -114.86), (35.85, -114.80), (35.71, -114.83)]),
    ('NV-604 LV BLVD N', 2, [(36.24, -115.07), (36.30, -115.00), (36.37, -114.93)]),
    ('CORN CREEK RD',  3, [(36.38, -115.48), (36.44, -115.36)]),
    ('COTTONWOOD TRAIL', 3, [(36.02, -115.50), (35.93, -115.45), (35.83, -115.43)]),
    ('POWERLINE RD',   3, [(36.14, -114.88), (36.20, -114.90), (36.20, -114.75)]),
    ('ELDORADO RANCH RD', 3, [(35.86, -114.95), (35.80, -114.98)]),
    ('GASS PEAK RD',   3, [(36.37, -114.93), (36.42, -115.10), (36.40, -115.18)]),
    ('MERCURY HWY',    2, [(36.66, -115.99), (36.72, -116.08), (36.78, -116.15)]),
    ('CREECH RD',      2, [(36.57, -115.67), (36.59, -115.68)]),
]
# patches of ground: (lat, lon, radius km, code)
PATCHES = [
    # the outer city past the valley's rim, where the real one keeps going
    (36.17, -115.35, 5.5, 'b'), (36.27, -115.28, 4.5, 'b'), (36.28, -115.15, 4.0, 'b'), (36.26, -115.04, 2.5, 'b'),
    (36.16, -115.03, 3.5, 'b'), (36.08, -115.02, 3.5, 'b'), (36.04, -114.98, 4.0, 'b'), (35.98, -115.08, 3.0, 'b'),
    (35.96, -115.03, 2.2, 'b'), (36.03, -115.26, 4.5, 'b'), (35.99, -115.20, 2.5, 'b'), (36.08, -115.35, 3.0, 'b'),
    (36.11, -114.93, 2.0, 'g'), (36.06, -115.07, 0.9, 'g'), (35.99, -115.19, 1.0, 'g'), (36.43, -115.33, 1.0, 'g'),
    (36.32, -115.27, 0.7, 'g'), (36.03, -115.03, 1.3, 'i'), (35.97, -115.13, 0.9, 'a'), 
    (36.37, -114.93, 2.0, 'i'), (36.39, -114.96, 1.6, 'l'), (35.94, -115.21, 0.9, 'i'), (36.07, -115.38, 0.8, 'i'),
    (36.05, -115.40, 0.35, 't'), (35.83, -115.43, 0.5, 't'), (35.82, -115.62, 0.7, 't'), (36.13, -115.43, 0.35, 'x'),
    (35.98, -114.83, 2.2, 'b'), (35.98, -114.84, 0.5, 'x'), (35.95, -114.86, 0.9, 'a'), (35.97, -114.85, 0.5, 'g'),
    (36.016, -114.737, 0.8, 'p'), (35.97, -114.92, 0.45, 'x'), (35.80, -114.98, 3.0, 'p'), (36.08, -114.84, 0.5, 'p'),
    (36.09, -114.87, 0.5, 'p'), (36.05, -114.80, 0.6, 'x'), (36.12, -114.86, 0.4, 'x'),
    (35.78, -115.33, 0.7, 'x'), (35.76, -115.32, 0.5, 'i'), (35.77, -115.34, 0.5, 'a'),
    (35.61, -115.39, 1.0, 'x'), (35.59, -115.40, 0.6, 'p'),
    (36.21, -115.98, 5.0, 'b'), (36.20, -115.97, 0.7, 'x'), (36.57, -115.67, 1.5, 't'), (36.59, -115.68, 1.6, 'a'),
    (36.66, -115.99, 1.2, 'i'), (36.68, -114.60, 1.2, 't'), (35.47, -114.92, 0.9, 't'), (36.44, -115.36, 0.4, 'g'),
    (36.26, -115.64, 0.5, 'g'), (35.71, -114.83, 0.4, 't'), (36.43, -114.52, 0.5, 'x'),
    (36.72, -114.55, 0.9, 't'), (36.20, -114.92, 0.3, 'x'), (36.31, -114.43, 0.5, 'x'), (36.54, -114.44, 0.8, 't'),
]
# the places: name, lat, lon, tier (camp / town / fortress), role, one line of what it is
PLACES = [
    ('HENDERSON',          36.040, -114.981, 'town',     'base',  'Water Street; the second city, its own grid and its own mind'),
    ('BOULDER CITY',       35.979, -114.832, 'town',     'base',  'the dam builders\' town; no casinos by law, water from the lake'),
    ('HOOVER DAM',         36.016, -114.737, 'fortress', 'fight', 'the powerhouse; 2,080 megawatts when the river gives; the one wall that never fell'),
    ('RAILROAD PASS',      35.970, -114.920, 'camp',     'base',  'the oldest casino licence in Nevada at the pass to the lake'),
    ('LAKE LAS VEGAS',     36.102, -114.930, 'camp',     'base',  'a made lake behind an earthen dam; the resorts round it'),
    ('BOULDER BEACH',      36.050, -114.800, 'camp',     'base',  'the marina, the beach, the boats the lake left on the mud'),
    ('LAS VEGAS BAY',      36.120, -114.860, 'camp',     'fight', 'the drowned marina; the ramp ends in air since the water fell'),
    ('THE INTAKE',         36.080, -114.840, 'fortress', 'fight', 'Intake No. 3, the straw at the bottom of the lake; the pumps that lift the city\'s water a thousand feet'),
    ('ELDORADO SOLAR',     35.800, -114.980, 'fortress', 'fight', 'two thousand acres of panels in the dry lake valley; the batteries\' mint'),
    ('NELSON',             35.710, -114.830, 'camp',     'base',  'Eldorado Canyon; the gold camp with the worst reputation on the river'),
    ('APEX',               36.370, -114.930, 'camp',     'base',  'the industrial park on the 15; where the trucks turned off'),
    ('APEX LANDFILL',      36.390, -114.960, 'camp',     'fight', 'the biggest landfill in the country, 2,200 acres; it still vents'),
    ('SLOAN',              35.940, -115.210, 'camp',     'base',  'the limestone quarry and the rail siding south of the valley'),
    ('JEAN',               35.780, -115.330, 'camp',     'base',  'two casinos at an off-ramp, the prison behind them, a dry lake'),
    ('GOODSPRINGS',        35.830, -115.430, 'camp',     'base',  'the Pioneer Saloon, 1913; a lead and zinc camp that never quite died'),
    ('SANDY VALLEY',       35.820, -115.620, 'camp',     'base',  'the valley over the pass; ranches and a strip for small planes'),
    ('BLUE DIAMOND',       36.050, -115.400, 'camp',     'base',  'a gypsum company town under the hill the mine ate'),
    ('RED ROCK',           36.130, -115.430, 'camp',     'fight', 'the visitor centre at the escarpment; the loop road'),
    ('MT CHARLESTON LODGE',36.260, -115.640, 'camp',     'base',  'the lodge at the top of Kyle Canyon; snow in the desert'),
    ('CORN CREEK',         36.440, -115.360, 'camp',     'base',  'the refuge headquarters; the springs; the road into the Sheep Range'),
    ('TULE SPRINGS',       36.320, -115.270, 'camp',     'fight', 'the fossil beds: mammoth, camel, dire wolf, the lab\'s own source'),
    ('GYPSUM CAVE',        36.200, -114.920, 'camp',     'fight', 'the cave under Frenchman where the ground sloth dung was found'),
    ('INDIAN SPRINGS',     36.570, -115.670, 'town',     'base',  'the town on the 95 at the foot of the range; the drones\' town'),
    ('CREECH',             36.590, -115.680, 'fortress', 'fight', 'the drone base; the hangars; the one place the war was flown from'),
    ('MERCURY',            36.660, -115.990, 'fortress', 'fight', 'the test site\'s gate town; the proving ground behind the fence'),
    ('PAHRUMP',            36.210, -115.980, 'town',     'base',  'the valley over the Spring Mountains; wells, lots, no law to speak of'),
    ('PRIMM',              35.610, -115.390, 'town',     'base',  'three casinos and an outlet mall at the state line; the lottery store'),
    ('IVANPAH SOLAR',      35.590, -115.400, 'fortress', 'fight', 'the three towers; the mirrors; the light you can see from the pass'),
    ('MOAPA',              36.680, -114.600, 'camp',     'base',  'the river town and the travel plaza on the 15'),
    ('SEARCHLIGHT',        35.470, -114.920, 'camp',     'base',  'a gold town on the 95 going south; the casino, the gas, the dust'),
    ('VALLEY OF FIRE',     36.430, -114.520, 'camp',     'fight', 'the red sandstone; the road through it to the Overton Arm'),
    ('ECHO BAY',           36.310, -114.430, 'camp',     'base',  'the marina on the Overton Arm; the hotel the water left behind'),
    ('GLENDALE',           36.720, -114.550, 'camp',     'base',  'the junction where the 93 leaves the 15 for the north'),
    ('OVERTON',            36.540, -114.440, 'camp',     'base',  'the town at the top of the arm; the Lost City museum; the farms the lake drowned'),
    ('GASS PEAK',          36.400, -115.180, 'camp',     'fight', 'the towers on the peak north of the city; the whole valley under you'),
]
# beyond the rim: real places the roads go on to, named at the edge with their distance
BEYOND = [
    ('MESQUITE',      36.805, -114.067, 'I-15 N',   'the last town before Utah'),
    ('ST GEORGE',     37.096, -113.568, 'I-15 N',   'Utah'),
    ('BEATTY',        36.908, -116.759, 'US-95 NW', 'Death Valley\'s door'),
    ('TONOPAH',       38.067, -117.230, 'US-95 NW', 'the silver town'),
    ('DEATH VALLEY JUNCTION', 36.302, -116.414, 'NV-160', 'past Pahrump'),
    ('BAKER',         35.272, -116.073, 'I-15 S',   'the thermometer'),
    ('BARSTOW',       34.896, -117.022, 'I-15 S',   'California'),
    ('LAUGHLIN',      35.168, -114.573, 'US-95 S',  'the river casinos'),
    ('KINGMAN',       35.189, -114.053, 'I-11 / US-93', 'Arizona'),
    ('ELY',           39.248, -114.889, 'I-15 N',   'the 93 north'),
]

# =====================================================================================
# THE RASTER
# =====================================================================================
def seg_dist_km(lat, lon, a, b):
    """distance in km from a point to a segment, in the flat km frame"""
    ax, ay = (a[1] - LON0) * KM_PER_DEG_LON, (a[0] - LAT0) * KM_PER_DEG_LAT
    bx, by = (b[1] - LON0) * KM_PER_DEG_LON, (b[0] - LAT0) * KM_PER_DEG_LAT
    px, py = (lon - LON0) * KM_PER_DEG_LON, (lat - LAT0) * KM_PER_DEG_LAT
    vx, vy = bx - ax, by - ay
    L2 = vx * vx + vy * vy
    t = 0.0 if L2 == 0 else max(0.0, min(1.0, ((px - ax) * vx + (py - ay) * vy) / L2))
    return math.hypot(px - ax - t * vx, py - ay - t * vy), t

def latlon_of(x, y):
    lon = LON0 + (x - (N - 1) / 2) * METRES_PER_CELL / 1000.0 / KM_PER_DEG_LON
    lat = LAT0 - (y - (N - 1) / 2) * METRES_PER_CELL / 1000.0 / KM_PER_DEG_LAT
    return lat, lon

def in_grid(x, y): return -K <= x < N + K and -K <= y < N + K
def in_valley(x, y): return 0 <= x < N and 0 <= y < N
def idx(x, y): return (y + K) * D + (x + K)

def bbox_cells(pts, pad_km):
    xs, ys = [], []
    for la, lo in pts:
        cx, cy = cell_of(la, lo); xs.append(cx); ys.append(cy)
    pad = pad_km * 1000 / METRES_PER_CELL + 1
    return (max(-K, int(min(xs) - pad)), min(N + K - 1, int(max(xs) + pad)),
            max(-K, int(min(ys) - pad)), min(N + K - 1, int(max(ys) + pad)))

def paint_corridor(grid, pts, hw_km, code, core_frac=0.0, core_code=None, noise=0.35, salt=1):
    x0, x1, y0, y1 = bbox_cells(pts, hw_km * (1 + noise))
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            la, lo = latlon_of(x + 0.5, y + 0.5)
            d = 1e9
            for i in range(len(pts) - 1):
                dd, _ = seg_dist_km(la, lo, pts[i], pts[i + 1]); d = min(d, dd)
            w = hw_km * (1 - noise + 2 * noise * hash01(x // 3, y // 3, salt))
            if d < w:
                grid[idx(x, y)] = ord(code)
                if core_code and d < w * core_frac: grid[idx(x, y)] = ord(core_code)

def paint_disc(grid, lat, lon, r_km, code, noise=0.25, salt=5):
    x0, x1, y0, y1 = bbox_cells([(lat, lon)], r_km * (1 + noise))
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            la, lo = latlon_of(x + 0.5, y + 0.5)
            d = math.hypot((lo - lon) * KM_PER_DEG_LON, (la - lat) * KM_PER_DEG_LAT)
            if d < r_km * (1 - noise + 2 * noise * hash01(x // 2, y // 2, salt)):
                grid[idx(x, y)] = ord(code)

def supercover_line(x0, y0, x1, y1):
    """every cell a segment passes through, 4-connected (Lego: a road never jumps a corner)"""
    cells = []
    dx, dy = x1 - x0, y1 - y0
    steps = int(max(abs(dx), abs(dy)) * 2) + 1
    px, py = int(math.floor(x0)), int(math.floor(y0))
    cells.append((px, py))
    for s in range(1, steps + 1):
        t = s / steps
        nx, ny = int(math.floor(x0 + dx * t)), int(math.floor(y0 + dy * t))
        while (nx, ny) != (px, py):
            if nx != px and ny != py:
                # a diagonal: step the axis that the line crosses first, so the road stays 4-connected
                px += 1 if nx > px else -1
            elif nx != px: px += 1 if nx > px else -1
            else: py += 1 if ny > py else -1
            cells.append((px, py))
    return cells

def road_cells(pts):
    out, seen = [], set()
    for i in range(len(pts) - 1):
        ax, ay = cell_of(*pts[i]); bx, by = cell_of(*pts[i + 1])
        for c in supercover_line(ax + 0.0, ay + 0.0, bx + 0.0, by + 0.0):
            if c not in seen: seen.add(c); out.append(c)
    return out

def build():
    grid = bytearray(b'.' * (D * D))
    road = bytearray(D * D)            # 0 none, 1 freeway/US, 2 state route, 3 dirt
    roadname = {}
    # 1. the city past the rim: where the real one keeps going
    for la, lo, r, code in PATCHES:
        if code == 'b': paint_disc(grid, la, lo, r, 'b', noise=0.3, salt=11)
    # 2. the ranges: hills, and a peak core nobody crosses
    for name, spine, hw, core in RANGES:
        paint_corridor(grid, spine, hw, 'h', core_frac=core, core_code='^', noise=0.35, salt=sum(map(ord, name)))
    # 3. the washes and the dry lakes
    for pts, hw in WASHES: paint_corridor(grid, pts, hw, 's', noise=0.2, salt=23)
    # 4. the water
    for la, lo, r in WATER_DISCS: paint_disc(grid, la, lo, r, '~', noise=0.22, salt=31)
    for pts, hw in WATER_CHANNELS: paint_corridor(grid, pts, hw, '~', noise=0.1, salt=37)
    # the shore: one block of wash_and_shore round every water block
    shore = []
    for y in range(-K, N + K):
        for x in range(-K, N + K):
            if grid[idx(x, y)] == ord('~'): continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
                nx, ny = x + dx, y + dy
                if in_grid(nx, ny) and grid[idx(nx, ny)] == ord('~'): shore.append((x, y)); break
    for x, y in shore:
        if grid[idx(x, y)] != ord('^'): grid[idx(x, y)] = ord('s')
    # 5. the places' own ground
    for la, lo, r, code in PATCHES:
        if code != 'b': paint_disc(grid, la, lo, r, code, noise=0.2, salt=41)
    # 6. the roads, last, so the kit sits on the ground it crosses
    base = bytes(grid)
    portals, endpoints = [], set()
    for name, cls, pts in ROADS:
        cells = road_cells(pts)
        ingrid = [c for c in cells if in_grid(*c)]
        if ingrid: endpoints.add(ingrid[0]); endpoints.add(ingrid[-1])
        prev_in = None
        for (x, y) in cells:
            if not in_grid(x, y): prev_in = None; continue
            inside = in_valley(x, y)
            if prev_in is not None and prev_in and not inside:
                portals.append({'road': name, 'cls': cls, 'x': x, 'y': y, 'edge': edge_of(x, y)})
            if prev_in is not None and (not prev_in) and inside:
                px, py = last
                portals.append({'road': name, 'cls': cls, 'x': px, 'y': py, 'edge': edge_of(px, py)})
            prev_in = inside; last = (x, y)
            if inside: continue
            k = idx(x, y)
            if road[k] == 0 or cls < road[k]: road[k] = cls; roadname[k] = name
            if cls == 1: grid[k] = ord('f')
            elif grid[k] in (ord('~'),): grid[k] = ord('s')      # a bridge or a causeway reads as shore ground with a road on it
            elif grid[k] == ord('^'): grid[k] = ord('h')          # a road cut through a range: a pass
    # 6b. a waypoint can leave a one-block nub where the walk touches it and turns back; a nub is a
    #     road that ends in sand (rule 77), so it is pruned until every road block has two neighbours
    #     or is a real end (a polyline's own end, the valley box, the rim)
    changed = True
    while changed:
        changed = False
        for y in range(-K, N + K):
            for x in range(-K, N + K):
                k = idx(x, y)
                if not road[k] or (x, y) in endpoints or in_valley(x, y): continue
                if x in (-K, N + K - 1) or y in (-K, N + K - 1) or x in (-1, N) or y in (-1, N): continue
                nb = sum(1 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)) if in_grid(x + dx, y + dy) and road[idx(x + dx, y + dy)])
                if nb <= 1:
                    road[k] = 0; grid[k] = base[k]; changed = True
    # 7. the valley: the generator's, rolled per game
    for y in range(N):
        for x in range(N): grid[idx(x, y)] = ord('V'); road[idx(x, y)] = 0
    return grid, road, roadname, portals

def edge_of(x, y):
    """which side of the valley box a cell just outside it sits on: y0 north, y1 south, x0 west, x1 east"""
    if y < 0: return 'y0'
    if y >= N: return 'y1'
    if x < 0: return 'x0'
    return 'x1'

def rle_rows(buf, width, height, as_chr):
    rows = []
    for j in range(height):
        row, run, cur = [], 0, None
        for i in range(width):
            v = as_chr(buf[j * width + i])
            if v == cur: run += 1
            else:
                if cur is not None: row.append(('%d' % run if run > 1 else '') + cur)
                cur, run = v, 1
        row.append(('%d' % run if run > 1 else '') + cur)
        rows.append(''.join(row))
    return rows

def cost_of(code, rd):
    sc = speed_class(code, rd)
    return None if sc is None else mins_per_cell(SPEED_KMH[sc])

def dijkstra(grid, road, sources):
    INF = float('inf'); dist = [INF] * (D * D); heap = []
    for s in sources: dist[s] = 0.0; heapq.heappush(heap, (0.0, s))
    while heap:
        d, k = heapq.heappop(heap)
        if d > dist[k]: continue
        x, y = (k % D) - K, (k // D) - K
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if not in_grid(nx, ny): continue
            nk = idx(nx, ny); c = cost_of(chr(grid[nk]), road[nk])
            if c is None: continue
            nd = d + c
            if nd < dist[nk]: dist[nk] = nd; heapq.heappush(heap, (nd, nk))
    return dist

def main():
    grid, road, roadname, portals = build()
    # the places onto the grid, each pulled to the nearest standable block (never into the valley)
    places = []
    for name, la, lo, tier, role, what in PLACES:
        fx, fy = cell_of(la, lo); x, y = int(math.floor(fx)), int(math.floor(fy))
        best, bd = None, 1e9
        for r in range(0, 6):
            for dy in range(-r, r + 1):
                for dx in range(-r, r + 1):
                    if max(abs(dx), abs(dy)) != r: continue
                    px, py = x + dx, y + dy
                    if not in_grid(px, py) or in_valley(px, py): continue
                    c = chr(grid[idx(px, py)])
                    if c in ('~', '^'): continue
                    score = r + (0 if road[idx(px, py)] else 2.5)
                    if score < bd: bd = score; best = (px, py)
            if best and r >= 2: break
        if not best: continue
        px, py = best; km, bearing = km_of(la, lo)
        places.append({'name': name, 'lat': la, 'lon': lo, 'x': px, 'y': py, 'tier': tier, 'role': role,
                       'kind': CODE[chr(grid[idx(px, py)])], 'road': int(road[idx(px, py)]),
                       'km': round(km, 1), 'bearing': round(bearing), 'what': what, 'draft': True})
    # how far on foot: from the valley's middle, the valley itself costed as streets
    dist = dijkstra(grid, road, [idx(N // 2, N // 2)])
    for p in places:
        m = dist[idx(p['x'], p['y'])]
        p['hours'] = None if m == float('inf') else round(m / 60.0, 1)
        p['days'] = None if m == float('inf') else round(m / 60.0 / HOURS_A_DAY, 2)
    # beyond the rim: the road's last grid cell
    beyond = []
    for name, la, lo, via, what in BEYOND:
        rd = next((r for r in ROADS if r[0] == via), None)
        rim = None
        if rd:
            cells = [c for c in road_cells(rd[2]) if in_grid(*c)]
            if cells: rim = cells[-1]
        km, bearing = km_of(la, lo)
        m = dist[idx(*rim)] if rim else float('inf')
        rimkm = km_of(*latlon_of(rim[0] + 0.5, rim[1] + 0.5))[0] if rim else None
        extra_h = ((km - rimkm) / SPEED_KMH['paved']) if rim else None
        beyond.append({'name': name, 'lat': la, 'lon': lo, 'km': round(km), 'bearing': round(bearing), 'via': via,
                       'rimX': rim[0] if rim else None, 'rimY': rim[1] if rim else None, 'what': what, 'draft': True,
                       'days': None if m == float('inf') else round((m / 60.0 + extra_h) / HOURS_A_DAY, 1)})
    # the crossings: rim to rim, by the cheapest route, on the real roads and across the open
    def cross(a, b):
        d2 = dijkstra(grid, road, [idx(*a)]); m = d2[idx(*b)]
        return None if m == float('inf') else round(m / 60.0 / HOURS_A_DAY, 2)
    west_rim = next(((x, y) for (x, y) in [(-K, y) for y in range(-K, N + K)] if cost_of(chr(grid[idx(x, y)]), road[idx(x, y)]) is not None and road[idx(x, y)]), (-K, 0))
    i15s = [c for c in road_cells(ROADS[0][2]) if in_grid(*c)][-1]
    i15n = [c for c in road_cells(ROADS[1][2]) if in_grid(*c)][-1]
    us95 = [c for c in road_cells(ROADS[2][2]) if in_grid(*c)][-1]
    us93 = [c for c in road_cells(ROADS[4][2]) if in_grid(*c)][-1]
    crossings = {'I-15 south rim to I-15 north rim': cross(i15s, i15n), 'US-95 north-west rim to US-93 Arizona rim': cross(us95, us93)}
    km_across = round(D * METRES_PER_CELL / 1000.0, 1)
    counts = {}
    for j in range(D):
        for i in range(D):
            c = chr(grid[j * D + i]); counts[CODE[c] if c != 'V' else 'valley'] = counts.get(CODE[c] if c != 'V' else 'valley', 0) + 1
    counts['water (open)'] = sum(1 for j in range(D) for i in range(D) if grid[j * D + i] == ord('~'))
    counts['peak (cannot cross)'] = sum(1 for j in range(D) for i in range(D) if grid[j * D + i] == ord('^'))
    road_counts = {'freeway/US': 0, 'state route': 0, 'dirt': 0}
    for v in road:
        if v == 1: road_counts['freeway/US'] += 1
        elif v == 2: road_counts['state route'] += 1
        elif v == 3: road_counts['dirt'] += 1
    speeds = {k: {'kmh': v, 'minutesPerCell': round(mins_per_cell(v), 2), 'kmPerDay': round(v * HOURS_A_DAY, 1)} for k, v in SPEED_KMH.items()}
    out = {
        'version': 1, 'lane': 'WORLD', 'row': '[the region]', 'rules': [109, 110, 46, 33, 77, '40g'],
        'source': 'tools/bohemia_world_region.py (deterministic; re-run it, the file is the same bytes)',
        'orientation': 'REAL: north is y = 0 (the land painter\'s rule), east is +x. The valley rolls its east-west mirror per seed; engine/bohemia_region_land.js mirrors x when the valley\'s compass says east is x0. y never mirrors.',
        'N': N, 'K': K, 'D': D, 'metresPerCell': METRES_PER_CELL,
        'metresPerCellWhy': 'engine/bohemia_overmap.js line 19: "The valley is 96 cells across = 5.73 miles", and the real Las Vegas valley, Summerlin\'s edge to Henderson\'s, is 32 km across; the one scale the valley\'s own bones set is 32 km over 96 blocks. The fight\'s house block (96 m) is the other scale: TWO SCALES, ONE GAME.',
        'origin': {'lat': LAT0, 'lon': LON0, 'cell': [(N - 1) / 2, (N - 1) / 2], 'what': 'the valley\'s middle block; the Strip\'s north end at Sahara and the 15'},
        'kmAcross': km_across,
        'legend': {k: v for k, v in CODE.items()},
        'legendNotes': {'~': 'open water: cannot be crossed; its fight kind is the shore', '^': 'a peak: hills nobody crosses', 'V': 'the valley\'s own 96 x 96, rolled per new game (rule 40g); the generator\'s, never this file\'s'},
        'pass': PASS, 'passWhy': 'slices/bohemia_region.js (RUN): 0 open ground, 1 a road, 2 rough, 3 cannot be crossed. A block with a road of any class is 1 whatever its ground (a bridge over the water, a cut through a range).',
        'roadCodes': {'-': 'no road', 'F': 'class 1, freeway or US highway', 'S': 'class 2, state route', 'D': 'class 3, dirt track'},
        'roadClasses': {'1': 'freeway or US highway (I-15, I-11, I-515, US-93, US-95, CC-215)', '2': 'state route (NV-160, 159, 157, 156, 147, 564, 146, 161, 165, 604, 167)', '3': 'dirt track'},
        'speeds': speeds, 'speedsTuned': False, 'hoursADay': HOURS_A_DAY,
        'speedsSource': 'TUNING\'s numbers, tuned:false. US Army FM 21-18 foot marches (4 to 5 km/h loaded on a road); Naismith\'s rule for the climb; desert pavement and creosote flat about 3.5 km/h; dry sand in a wash under 3; broken rock slopes 2 to 2.5. A day is eight marching hours (Battle Brothers: a day passes as you travel; the company camps).',
        'speedClassOf': 'road class 1 or 2 -> paved; 3 -> dirt; suburb, lot, industrial, airport, solar, landfill, golf, trailer and the valley -> streets; open_desert -> open; wash_and_shore -> wash; hills -> hills; water and peak -> none',
        'rows': rle_rows(grid, D, D, chr),
        'roadRows': rle_rows(road, D, D, lambda v: ROADCODE[v]),
        'rowsWhy': 'one string a row, y = -K first; run-length: a count then the code, no count means one. D cells a row.',
        'portals': portals,
        'portalsWhy': 'where each real highway meets the valley box (the first block outside it, on which side). The valley rolls its own exits per seed; the loader stitches each rolled exit to the nearest portal on the same side (Lego, rule 77: a road never ends in sand).',
        'places': places, 'beyond': beyond, 'crossingsDays': crossings,
        'counts': counts, 'roadCounts': road_counts,
        'numbers': {
            'tilesAcross': D, 'tiles': D * D, 'kmAcross': km_across,
            'valleyTiles': N * N, 'regionTiles': D * D - N * N,
            'places': len(places), 'beyond': len(beyond), 'valleySeats': 14,
            'settlementsInAll': len(places) + 14,
            'daysAcross': crossings,
            'daysAcrossRoadStraight': round(km_across / (SPEED_KMH['paved'] * HOURS_A_DAY), 1),
            'daysAcrossOpenStraight': round(km_across / (SPEED_KMH['open'] * HOURS_A_DAY), 1),
            'battleBrothers': {'tilesAcross': 140, 'tiles': 19600, 'settlements': 17, 'daysAcross': None,
                               'source': 'reference/library/battle_brothers/01_WORLDMAP.md and records/BOHEMIA_THE_REGION_RUN_10_16_26.md (community-measured; the crossing days are owed, EYES [the map\'s four numbers], Grok ask 26)'},
        },
    }
    s = json.dumps(out, separators=(',', ':'), ensure_ascii=False)
    with open(OUT, 'w', encoding='utf-8') as f: f.write(s)
    print('wrote', os.path.relpath(OUT, ROOT), len(s), 'bytes', 'sha256', hashlib.sha256(s.encode('utf-8')).hexdigest()[:12])
    print('counts', json.dumps(counts)); print('roads', road_counts); print('crossings', crossings)
    for p in places: print('  %-20s x%4d y%4d %-9s %-15s %5.1f km  %s  %s h  %s d' % (p['name'], p['x'], p['y'], p['tier'], p['kind'], p['km'], 'road' if p['road'] else 'off ', p['hours'], p['days']))
    for b in beyond: print('  beyond %-22s %4d km via %-14s rim (%s,%s) %s d' % (b['name'], b['km'], b['via'], b['rimX'], b['rimY'], b['days']))
    print('portals', [(p['road'], p['edge'], p['x'], p['y']) for p in portals])
    if '--thumb' in sys.argv:
        step = 8
        for j in range(-K, N + K, step):
            print(''.join(chr(grid[idx(i, j)]) for i in range(-K, N + K, step)))
    return 0

if __name__ == '__main__':
    sys.exit(main())
