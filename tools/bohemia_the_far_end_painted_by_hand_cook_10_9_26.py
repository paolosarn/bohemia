#!/usr/bin/env python3
"""THE FAR END, PAINTED BY HAND  (COOK [the far end painted by hand] round 1, 10/9/26)

Rule 65 and rule 60 (the reel). RUN painted the far end PROCEDURALLY, from twelve texels a
block, and the coordinator's row says it in one line: "a hand-painted far end needs COOK".
Pinch all the way out on the demo today and the valley is a TAN DOME with a repeating ripple
in it. No ranges. No basin. No grid. No strip. No airport. No washes. No depots. The whole
Las Vegas valley, from altitude, reads as a dune.

*** THE FIRST THING THIS ROUND DID WAS REFUSE TO INVENT THE GEOGRAPHY. ***
The valley is not a mood, it is a map the game already builds: engine/bohemia_overmap.js
lays out 96 x 96 tiles with a district each. So this tool SHELLS OUT TO THE REAL ENGINE and
paints what the game actually says is there, rather than a painter's idea of Las Vegas:

    the ranges     852 mountain tiles, ringing the basin north, west and south
    the basin      567 desert tiles, the floor they ring
    the grid       2,530 suburb + 350 commercial + 122 apartment + 28 downtown
    the spine      81 strip tiles in one column, 118 resort tiles flanking it
    the airport    40 tiles, south-east of the spine's south end, where McCarran really is
    the washes     51 wash tiles, draining east and south-east to the lake
    the two depots the layout's own ind1 and ind2, the two industrial zones, by name
    and Lake Mead  84 water tiles in the south-east corner

Every one of those is READ, not typed. If the engine's layout changes, this sheet changes
with it, which is the whole difference between a painting and a decoration.

WHAT "PAINTED BY HAND" MEANS HERE, AND IT IS NOT A FIGURE OF SPEECH. RUN's far end is noise
at twelve texels a block: the ripples you see are the noise function, and no amount of it
becomes a mountain range. The difference is not resolution, it is STRUCTURE:
  * THE RANGES GET A REAL HEIGHT FIELD. Distance into the mass, plus ridgelines, then shaded
    by SLOPE against one sun. A ridge has a lit west face, a shadowed east face, and a crest
    where they meet. That is why a range reads as a range and a ripple never will.
  * THE BASIN GETS ALLUVIAL FANS. Real desert floor is not flat: it is the spread of what
    came down off the ranges, brightest at the mouth of each canyon, fading out into the
    middle. The fans are computed off the mountain mask, so they land where the mountains are.
  * THE WASHES BRAID. A wash is a channel with gravel bars in it, not a line.
  * THE CITY KEEPS ITS GRAIN. 38% of the valley's cells are road (this lane measured that on
    9/27), so the arterial grid is the city's texture and it is drawn one step off the
    fabric, never shouting.
  * THE SPINE IS THE ONE THING YOU SEE FIRST. From altitude Las Vegas is a bright line.

ONE LIGHT (rule 70a, Paolo 10/4: "the graphics of the outside valley and the city have to go
through the same lighting, not different lighting"). There is ONE sun in this file, north-
west, and the ranges, the fans, the city blocks and the lake all take their shading from it.
Nothing is lit on its own.

THE POWER AUTHORITY'S CAMERA GRADE (the row's words; analog horror, rule 20, every pixel).
The sheet is not a satellite photo, it is the last aerial survey the valley's power authority
ever flew, on a camera that was already old: the grade is a channel misregistration of one
pixel, a horizontal scan structure, grain, and a vignette. It goes on LAST, as one pass over
the whole sheet, because one camera photographed the land and the city together. That is also
why it is applied AFTER the palette check and not before: the paint is his, the camera is the
horror.

    python3 tools/bohemia_the_far_end_painted_by_hand_cook_10_9_26.py
      -> banks/BOHEMIA_THE_FAR_END_PAINTED_10_9_26.txt
      -> records/BOHEMIA_THE_FAR_END_PAINTED_MEASURED_10_9_26.txt
      -> slices/vote/COOK_THE_FAR_END_PAINTED.png

REFERENCE CHECK (the 9/4 standing law):
  01_WORLDMAP.md, the TERRAIN line: BB's world map reads at a glance because every terrain
        has its own value AND its own texture, never colour alone; mountains are the darkest
        thing on it and roads are the brightest. Both taken.
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east.
  TG-05 THE VALLEY TONES (this lane, 9/27, banks/BOHEMIA_THE_VALLEY_TONES_9_27_26.txt): the
        six-step ramps per family and the per-district city step are reused exactly.
  REUSE CHECK: every colour comes from this lane's own approved valley ramps at run time; the
        geography comes from the shipped engine; the before is RUN's own posted frame.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md, the
  WORLD MAP and TERRAIN lines: BB's map is hand-authored terrain art at the screen's own
  pixels, and its legibility comes from each terrain owning a value band and a texture, so
  you read forest-vs-hills-vs-swamp from across the room without a legend. WHAT MOVES THAT
  THEIR PICTURE DOES NOT (rule 33g): BB's world map is one fixed painting of one fixed world.
  Ours is painted from a layout the engine rolls, so the ranges, the spine and the depots
  land where THIS valley put them, and the same brushes paint a different valley next seed.
"""
import base64, io, json, math, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

TONES = 'banks/BOHEMIA_THE_VALLEY_TONES_9_27_26.txt'
BEFORE = 'slices/vote/RUN_THE_FAR_STOP_KEEPS_THE_LAND_10_4.jpg'
OUT_BANK = 'banks/BOHEMIA_THE_FAR_END_PAINTED_10_9_26.txt'
OUT_REC = 'records/BOHEMIA_THE_FAR_END_PAINTED_MEASURED_10_9_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_FAR_END_PAINTED.png'

PX = 14                     # painted pixels per overmap tile
MARGIN = 24                 # tiles of land painted PAST the engine's grid, out to the horizon
# *** THE FIRST CUT PAINTED THE 96x96 GRID AND NOTHING ELSE, AND THE CITY FILLED THE FRAME
# EDGE TO EDGE LIKE A CIRCUIT BOARD. *** Rule 70 is explicit that at the far stop the land is
# drawn to the horizon and the city "sits in the valley floor and never floats as a slab on a
# flat". So the engine's grid is the middle of the sheet, not the whole of it, and the ranges
# and the basin carry on outward past it.
BB_PIXELS = 2073600         # DIRECTION's floor: Battle Brothers at 1920 x 1080
FLOOR_RUN = 1.5             # DIRECTION's floor: mean flat-colour run, device px
SEED = int(os.environ.get('BOHEMIA_VALLEY_SEED', '1'))

def die(m): sys.exit('REFUSED: ' + m)

rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]

_T = json.load(open(TONES))
RAMP = {k: [rgb(h) for h in v] for k, v in _T['ramps'].items()}
CITY_STEP = _T['city_step']
ALL = {c for r in RAMP.values() for c in r}


class R:
    def __init__(self, s): self.s = s & 0x7fffffff
    def __call__(self):
        self.s = (1103515245 * self.s + 12345) & 0x7fffffff
        return self.s / float(0x7fffffff)
    def i(self, n): return int(self() * n) % n


def widen_to_the_horizon(data):
    """Rule 70 (Paolo 10/4, with a screenshot): at the far stop the land is drawn to the
       horizon and the city "sits in the valley floor and never floats as a slab on a flat".
       The engine lays out the CITY's 96 tiles and stops, so the sheet pads that grid with
       MARGIN tiles of land on every side.

       *** AND THE FIRST WAY I DID THIS CAME OUT AS STRIPES. *** I copied each edge row and
       column outward, which is a one-dimensional smear: the sheet grew a pale tan band left
       and right and a dark band top and bottom, a frame rather than land. A range does not
       continue by repeating a row. It continues by BEING FURTHER RANGE, so the padding is
       grown from the DISTANCE to the nearest mountain in the real grid, broken up with
       noise, and everything else is basin running out to the horizon."""
    g = data['g']; N = data['n']; M = MARGIN
    big = N + 2 * M
    import numpy as _np
    mt = _np.zeros((N, N), _np.float32)
    for y in range(N):
        for x in range(N):
            if g[y][x] in RANGE_D: mt[y, x] = 1.0
    # how much range is near each edge cell, so a rim that is mountain grows outward and a
    # rim that is open desert stays open
    near = smooth(mt, 6)
    rnd = _np.random.default_rng(90210)
    n1 = value_noise(big, big, 7, rnd)
    n2 = value_noise(big, big, 19, rnd)
    out = [['desert'] * big for _ in range(big)]
    for y in range(N):
        for x in range(N):
            out[y + M][x + M] = g[y][x]
    for Y in range(big):
        for X in range(big):
            if M <= Y < M + N and M <= X < M + N: continue
            sy = min(max(Y - M, 0), N - 1); sx = min(max(X - M, 0), N - 1)
            d = max(abs(Y - M - sy), abs(X - M - sx)) / float(M)     # 0 at the rim, 1 at the edge
            rim = float(near[sy, sx])
            # the rim's own character, pushed outward, loosened by noise as it goes
            v = rim * (1.0 - 0.45 * d) + 0.55 * d * float(n1[Y, X]) + 0.18 * float(n2[Y, X])
            out[Y][X] = 'mountain' if v > 0.46 else 'desert'
    data = dict(data)
    data['g'] = out; data['n'] = big; data['city_n'] = N; data['margin'] = M
    return data


def grid_from_the_engine(seed):
    """THE GEOGRAPHY IS READ, NOT TYPED. The game's own overmap module lays the valley out;
       this asks it, every run, so the paint can never drift from the map."""
    js = ("const O=require('./engine/bohemia_overmap.js');"
          "const m=O.buildOvermap(%d);const N=m.n;const g=[];"
          "for(let y=0;y<N;y++){const r=[];for(let x=0;x<N;x++){const t=m.at(x,y);"
          "r.push((t&&t.district)||'desert');}g.push(r);}"
          "process.stdout.write(JSON.stringify({n:N,g:g,layout:{"
          "stripX:m.layout&&m.layout.stripX,fwyX:m.layout&&m.layout.fwyX,"
          "ind1:m.layout&&m.layout.ind1,ind2:m.layout&&m.layout.ind2}}));" % seed)
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True, cwd=REPO)
    if out.returncode != 0:
        die('the engine would not lay the valley out: ' + out.stderr.strip()[:300])
    return json.loads(out.stdout)


import numpy as np

# ------------------------------------------------------------------ WHAT EACH TILE IS
RANGE_D   = {'mountain'}
BASIN_D   = {'desert'}
WASH_D    = {'wash', 'basin'}
WATER_D   = {'water', 'reservoir', 'dam', 'intake'}
ROAD_D    = {'freeway', 'arterial', 'beltway', 'interchange', 'rail', 'railyard'}
SPINE_D   = {'strip'}
FIELD_D   = {'solar', 'farm', 'golf', 'park', 'cemetery'}
STRIP_RUN = {'airport', 'airbase', 'speedway'}
DEPOT_D   = {'industrial', 'landfill', 'storage', 'warehouse', 'boneyard', 'quarry',
             'gypsum', 'fueldepot', 'truckstop', 'granary', 'substation'}


def smooth(a, k):
    """A cheap separable box blur. Used to grow a height field out of a mask, which is how
       a mass of tiles becomes land with a slope instead of a cliff at every tile edge."""
    if k < 1: return a
    out = a.astype(np.float32)
    for _ in range(2):
        c = np.cumsum(np.pad(out, ((0, 0), (k, k)), mode='edge'), axis=1)
        out = (c[:, 2 * k:] - c[:, :-2 * k]) / (2.0 * k)
        c = np.cumsum(np.pad(out, ((k, k), (0, 0)), mode='edge'), axis=0)
        out = (c[2 * k:, :] - c[:-2 * k, :]) / (2.0 * k)
    return out


def value_noise(h, w, cells, rnd):
    """One octave of smooth value noise at `cells` across."""
    g = rnd.random((cells + 1, cells + 1)).astype(np.float32)
    yi = np.linspace(0, cells, h, endpoint=False, dtype=np.float32)
    xi = np.linspace(0, cells, w, endpoint=False, dtype=np.float32)
    y0 = yi.astype(np.int32); x0 = xi.astype(np.int32)
    fy = (yi - y0)[:, None]; fx = (xi - x0)[None, :]
    fy = fy * fy * (3 - 2 * fy); fx = fx * fx * (3 - 2 * fx)      # smoothstep
    a = g[np.ix_(y0, x0)]; b = g[np.ix_(y0, x0 + 1)]
    c = g[np.ix_(y0 + 1, x0)]; d = g[np.ix_(y0 + 1, x0 + 1)]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


def ridged(h, w, rnd, octaves=5, cells=6):
    """*** THIS IS THE WHOLE DIFFERENCE BETWEEN A RANGE AND A RIPPLE. ***
       Plain noise makes dunes: smooth humps, which is exactly what the far end looks like
       today. Folding it -- 1 minus the distance from the middle -- turns every zero crossing
       into a CREST, and stacking those crests at halving sizes gives ridgelines with spurs
       off them, which is what a mountain range actually is."""
    out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0.0
    for o in range(octaves):
        n = value_noise(h, w, cells * (2 ** o), rnd)
        out += amp * (1.0 - np.abs(n * 2.0 - 1.0)) ** 2
        tot += amp; amp *= 0.5
    return out / tot


def shade_by_slope(height, sun=(-0.7071, -0.7071), strength=1.0):
    """ONE LIGHT (rule 70a). The sun is north-west for every pixel in this game, so a west
       face is lit and an east face is in shadow. Taking the gradient of the height field and
       dotting it with the sun is what makes a ridge read as a ridge."""
    gy, gx = np.gradient(height.astype(np.float32))
    d = -(gx * sun[0] + gy * sun[1]) * strength
    return np.clip(0.5 + d, 0.0, 1.0)


def ramp_pick(ramp, t):
    """Snap a 0..1 field on to one of his six steps. Nothing between the steps is ever used,
       so every pixel of the land is a colour from the approved bank."""
    arr = np.array(ramp, np.uint8)
    idx = np.clip((t * len(ramp)).astype(np.int32), 0, len(ramp) - 1)
    return arr[idx]


def paint(data):
    """THE SHEET. Every family painted from this lane's own approved valley ramps, under one
       sun, on the geography the engine handed over."""
    N = data['n']; g = data['g']
    H = W = N * PX
    rnd = np.random.default_rng(20261009)

    # ---- the tile masks, grown to painted pixels
    def mask(ds):
        m = np.zeros((N, N), np.float32)
        for y in range(N):
            row = g[y]
            for x in range(N):
                if row[x] in ds: m[y, x] = 1.0
        return np.kron(m, np.ones((PX, PX), np.float32))

    m_range = mask(RANGE_D)
    m_water = mask(WATER_D)
    m_wash  = mask(WASH_D)
    m_road  = mask(ROAD_D)
    m_spine = mask(SPINE_D)
    m_field = mask(FIELD_D)
    m_runw  = mask(STRIP_RUN)
    m_depot = mask(DEPOT_D)
    city_names = set(CITY_STEP.keys()) | {'suburb', 'commercial', 'downtown', 'apartment',
                                          'resort', 'estate', 'gated', 'school', 'medical',
                                          'casino', 'town', 'trailer', 'campus'}
    m_city = mask(city_names - STRIP_RUN - FIELD_D - DEPOT_D - SPINE_D)

    # ---- THE RANGES: a real height field, not a ripple
    # *** AND THE FIRST CUT MULTIPLIED THE CREST BY THE BULK, WHICH FLATTENED IT. *** Deep
    # inside a big mass the bulk saturates, so crest x bulk washed every ridge out and the
    # ranges came back as dark crusts. The bulk is only there to stop a cliff at the mask's
    # edge, so it is clipped to a skirt and the crest keeps its own full range everywhere.
    bulk = np.clip(smooth(m_range, PX) * 3.0, 0.0, 1.0)      # a skirt at the rim, 1 inside
    crest = ridged(H, W, rnd, octaves=6, cells=4)
    height = bulk * (0.18 + 0.82 * crest)
    height = smooth(height, 2)
    lit = shade_by_slope(height, strength=120.0)

    # ---- THE BASIN: the floor, and the alluvial fans that come off the ranges
    skirt = smooth(m_range, PX * 5)                  # the spread of what came down
    fan = np.clip((skirt - bulk) * 2.4, 0.0, 1.0) * (1.0 - m_range)
    floor_grain = (value_noise(H, W, 90, rnd) * 0.55 + value_noise(H, W, 300, rnd) * 0.45)
    basin_t = np.clip(0.30 + 0.42 * fan + 0.26 * floor_grain, 0.0, 1.0)

    img = np.zeros((H, W, 3), np.uint8)
    img[:] = ramp_pick(RAMP['ground'], basin_t)      # the floor is the default everywhere

    # ---- the ranges on top, shaded by their own slope under the one sun
    rng_t = np.clip(0.12 + 0.76 * lit + 0.22 * height, 0.0, 1.0)
    sel = m_range > 0.5
    img[sel] = ramp_pick(RAMP['mountain'], rng_t)[sel]

    # ---- THE WASHES: a channel with gravel bars in it, braided, not a line
    braid = value_noise(H, W, 220, rnd)
    wash_t = np.clip(0.55 + 0.45 * braid, 0.0, 1.0)
    sel = m_wash > 0.5
    img[sel] = ramp_pick(RAMP['ground'], wash_t)[sel]

    # ---- THE CITY FABRIC: per-district step, with the grid grain the valley really has
    step = np.zeros((N, N), np.float32)
    for y in range(N):
        for x in range(N):
            step[y, x] = CITY_STEP.get(g[y][x], 2)
    step = np.kron(step, np.ones((PX, PX), np.float32))
    # one value per BLOCK, not a fine fuzz: from altitude a city is a mosaic of blocks that
    # differ, which is the difference between a city and a grey slab (rule 70's own words)
    blockgrain = np.kron(rnd.random((N, N)).astype(np.float32), np.ones((PX, PX), np.float32))
    blockgrain = smooth(blockgrain, 2)
    city_t = np.clip((step + 0.5) / 6.0 + (blockgrain - 0.5) * 0.42, 0.0, 0.999)
    sel = m_city > 0.5
    img[sel] = ramp_pick(RAMP['city'], city_t)[sel]
    sel = m_field > 0.5
    img[sel] = ramp_pick(RAMP['city'], np.clip(city_t * 0.45, 0, 0.999))[sel]
    sel = m_depot > 0.5
    img[sel] = ramp_pick(RAMP['city'], np.clip(city_t * 0.62 + 0.10, 0, 0.999))[sel]

    # ---- THE WATER: Lake Mead, deepest away from its shore
    deep = smooth(m_water, PX * 2)
    sel = m_water > 0.5
    img[sel] = ramp_pick(RAMP['water'], np.clip(0.95 - 0.8 * deep, 0, 0.999))[sel]

    # ---- THE ROADS. *** AND HERE IS THE FAULT THAT MADE THE FIRST SHEET A CIRCUIT BOARD. ***
    # The engine's grid is a TOPOLOGY, not a footprint: a tile is 96 m of world and it says
    # "a road runs through here", not "this whole 96 m is tarmac". The first cut filled every
    # road tile solid, so at this scale every arterial came out as wide as a city block, 2,543
    # of them, and the valley read as a printed circuit. A real arterial is about 30 m against
    # a 400 m block. So the fabric is painted THROUGH the road tiles first, and the road is
    # then drawn as a thin line down the middle of its own tile: wide for a freeway, hairline
    # for an arterial, which is also what this lane's own 9/27 rule meant by "one step off the
    # fabric, never shouting".
    fabric_t = np.clip(2.5 / 6.0 + (blockgrain - 0.5) * 0.30, 0.0, 0.999)
    sel = m_road > 0.5
    img[sel] = ramp_pick(RAMP['city'], fabric_t)[sel]
    road_im = Image.fromarray(img); rd = ImageDraw.Draw(road_im)
    WIDE = {'freeway': max(2, PX // 3), 'beltway': max(2, PX // 3),
            'interchange': max(2, PX // 3), 'rail': 1, 'railyard': max(2, PX // 4)}
    for y in range(N):
        row = g[y]
        for x in range(N):
            d_ = row[x]
            if d_ not in ROAD_D: continue
            w_ = WIDE.get(d_, 1)
            col = RAMP['route'][4] if d_ in ('freeway', 'beltway', 'interchange') \
                else RAMP['route'][1]
            cx_, cy_ = x * PX + PX // 2, y * PX + PX // 2
            runs_x = (x + 1 < N and row[x + 1] in ROAD_D) or (x and row[x - 1] in ROAD_D)
            runs_y = (y + 1 < N and g[y + 1][x] in ROAD_D) or (y and g[y - 1][x] in ROAD_D)
            if runs_x: rd.line([(x * PX, cy_), (x * PX + PX, cy_)], fill=col, width=w_)
            if runs_y: rd.line([(cx_, y * PX), (cx_, y * PX + PX)], fill=col, width=w_)
            if not runs_x and not runs_y:
                rd.line([(x * PX, cy_), (x * PX + PX, cy_)], fill=col, width=w_)
    img = np.array(road_im)

    # ---- THE SPINE: from altitude Las Vegas is one bright line, and this is it
    sel = m_spine > 0.5
    img[sel] = np.array(RAMP['city'][5], np.uint8)
    d = ImageDraw.Draw(Image.fromarray(img))         # (kept for the runway pass below)
    return img, dict(H=H, W=W, N=N, m_range=m_range, m_water=m_water, m_wash=m_wash,
                     m_road=m_road, m_spine=m_spine, m_runw=m_runw, m_depot=m_depot,
                     m_city=m_city, height=height, lit=lit, fan=fan)


def runways(img, M, data):
    """AN AIRPORT FROM ALTITUDE IS ITS RUNWAYS. A block of 'airport' tiles painted flat is a
       car park; what you actually see from a plane is two pairs of long pale strips on two
       alignments. Drawn inside the real airport mass, so they land where the engine put it."""
    N = data['n']; g = data['g']
    im = Image.fromarray(img); d = ImageDraw.Draw(im)
    pale = RAMP['route'][5]
    for want in ('airport', 'airbase'):
        cells = [(x, y) for y in range(N) for x in range(N) if g[y][x] == want]
        if not cells: continue
        xs = [c[0] for c in cells]; ys = [c[1] for c in cells]
        x0, x1, y0, y1 = min(xs) * PX, (max(xs) + 1) * PX, min(ys) * PX, (max(ys) + 1) * PX
        w, h = x1 - x0, y1 - y0
        long_axis_x = w >= h
        for k, off in enumerate((0.30, 0.46)):       # a parallel pair, the real arrangement
            if long_axis_x:
                yy = int(y0 + h * off)
                d.line([(x0 + w * 0.05, yy), (x1 - w * 0.05, yy)], fill=pale,
                       width=max(2, PX // 5))
            else:
                xx = int(x0 + w * off)
                d.line([(xx, y0 + h * 0.05), (xx, y1 - h * 0.05)], fill=pale,
                       width=max(2, PX // 5))
        # the cross strip, at the other alignment
        d.line([(x0 + w * 0.12, y1 - h * 0.18), (x1 - w * 0.12, y0 + h * 0.70)],
               fill=RAMP['route'][3], width=max(2, PX // 6))
    return np.array(im)


def the_camera(img, rnd):
    """THE POWER AUTHORITY'S CAMERA GRADE (the row's words; rule 20, analog horror on every
       pixel). This is the last aerial survey the valley's power authority ever flew, and the
       camera was already old. ONE pass over the whole sheet, land and city together, because
       one camera took one photograph: a channel that sits a pixel off, a scan structure in
       the horizontal, grain, and the falloff a cheap lens gives at its corners.
       It runs AFTER the palette check on purpose. The paint is his; the camera is the
       horror, and the two are not allowed to get mixed up."""
    h, w, _ = img.shape
    out = img.astype(np.float32)
    shifted = np.empty_like(out)                     # the red channel sits one pixel west
    shifted[:] = out
    shifted[:, 1:, 0] = out[:, :-1, 0]
    shifted[:, 0, 0] = out[:, 0, 0]
    out = shifted
    scan = 1.0 + 0.030 * np.sin(np.arange(h, dtype=np.float32) * math.pi)      # every other line
    scan += 0.018 * np.sin(np.arange(h, dtype=np.float32) / 3.0)
    out *= scan[:, None, None]
    yy = (np.arange(h, dtype=np.float32) - h / 2) / (h / 2)
    xx = (np.arange(w, dtype=np.float32) - w / 2) / (w / 2)
    r2 = yy[:, None] ** 2 + xx[None, :] ** 2
    out *= (1.0 - 0.15 * np.clip(r2, 0, 1.6))[:, :, None]                     # the lens
    out += (rnd.random((h, w, 1)).astype(np.float32) - 0.5) * 9.0             # the grain
    return np.clip(out, 0, 255).astype(np.uint8)


# ------------------------------------------------------------------------- THE INSTRUMENT

def mean_run(im):
    """DIRECTION's own floor test, the same algorithm the map gate uses: how far a flat
       colour runs before it changes. A painting has a short run; a dome has a long one."""
    a = np.asarray(im.convert('RGB'), np.int16)
    out = []
    for arr in (a, a.transpose(1, 0, 2)):
        same = np.all(arr[:, 1:] == arr[:, :-1], axis=2)
        changes = (~same).sum()
        out.append(float(arr.shape[0] * arr.shape[1]) / max(1, changes + arr.shape[0]))
    return out[0], out[1]


def off_ramp(img):
    cols = {tuple(c) for c in np.unique(img.reshape(-1, 3), axis=0)}
    return cols - ALL


def guards(painted, graded, M, data, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    H, W = M['H'], M['W']
    px = H * W
    ok('BATTLE BROTHERS\' PIXEL COUNT: the sheet is %d x %d = %s painted pixels, against '
       'their %s' % (W, H, f'{px:,}', f'{BB_PIXELS:,}'), px >= BB_PIXELS,
       'the row asks for their density as the floor, not as a target')

    r = mean_run(Image.fromarray(graded))
    ok('NOT A DOME: a flat colour runs %.2f px across and %.2f down, against DIRECTION\'s '
       'floor of %.1f' % (r[0], r[1], FLOOR_RUN), r[0] <= FLOOR_RUN and r[1] <= FLOOR_RUN,
       'a long run is exactly what a smooth tan dome measures as')

    bad = off_ramp(painted)
    ok('EVERY PIXEL IS ON THIS LANE\'S OWN APPROVED VALLEY RAMPS (checked on the paint, '
       'before the camera)', not bad,
       '%d colours off the 9/27 bank' % len(bad))

    # THE SEVEN THINGS THE ROW NAMES, each one found in the picture, not asserted
    N = data['n']; g = data['g']
    count = {}
    for row in g:
        for d in row: count[d] = count.get(d, 0) + 1
    for name, keys in (('the ranges', RANGE_D), ('the basin', BASIN_D), ('the grid', {'suburb'}),
                       ("the strip's spine", SPINE_D), ('the dead airport', {'airport'}),
                       ('the washes', WASH_D), ('the two depots', DEPOT_D)):
        n = sum(count.get(k, 0) for k in keys)
        ok('%s is on the sheet, from the engine\'s own layout: %d tiles' % (name.upper(), n),
           n > 0, 'the engine laid out no tile of this kind for seed %d' % SEED)

    lay = data.get('layout') or {}
    ok('AND THE TWO DEPOTS ARE THE LAYOUT\'S OWN ind1 AND ind2, by name, not two industrial '
       'blobs I picked: %s and %s' % (lay.get('ind1'), lay.get('ind2')),
       bool(lay.get('ind1')) and bool(lay.get('ind2')))

    # THE RANGES ARE SHADED, NOT FLAT: the whole point of the round
    sel = M['m_range'] > 0.5
    if sel.sum() > 0:
        v = np.asarray(Image.fromarray(painted).convert('L'), np.float32)[sel]
        spread = float(v.max() - v.min())
        ok('THE RANGES ARE LIT, NOT RIPPLED: the mountains carry %.0f steps of value between '
           'their lit faces and their shadowed ones' % spread, spread >= 18.0,
           'a noise ripple shaded flat comes out under 10')
        lit = M['lit'][sel]
        ok('AND THE LIGHT IS ONE LIGHT (rule 70a): every lit face is the north-west one '
           '(mean %.2f, spread %.2f)' % (float(lit.mean()), float(lit.std())),
           float(lit.std()) > 0.08)

    # THE BASIN IS NOT THE MOUNTAINS, AND THE CITY IS NOT EITHER: his own 9/27 bands
    L = np.asarray(Image.fromarray(painted).convert('L'), np.float32)
    def band(m):
        s = m > 0.5
        return float(L[s].mean()) if s.sum() else -1.0
    mt, ct, gt = band(M['m_range']), band(M['m_city']), band(1.0 - M['m_range'] - M['m_city'])
    ok('THE THREE BANDS HOLD, the ones this lane measured on 9/27: mountains darkest %.0f, '
       'city in the middle %.0f, open ground brightest %.0f' % (mt, ct, gt),
       mt < ct < gt, 'if these cross you cannot read land from city from altitude')

    # *** THE TWO GUARDS THIS ROUND HAD TO BE TAUGHT BY LOOKING, BECAUSE EVERY OTHER GUARD
    # WAS GREEN OVER A BAD PICTURE. *** The first sheet passed fifteen checks and read as a
    # printed circuit board; the second passed them again and the city sat on the land as a
    # grey slab. Numbers caught neither. These two would have caught both.
    route_cols = {tuple(c) for c in RAMP['route']}
    flat = painted.reshape(-1, 3)
    is_route = np.zeros(flat.shape[0], bool)
    for c in route_cols:
        is_route |= np.all(flat == np.array(c, np.uint8), axis=1)
    share = 100.0 * is_route.sum() / flat.shape[0]
    Lf = L.reshape(-1)
    rl = float(Lf[is_route].mean()) if is_route.sum() else 0.0
    cl = float(L[M['m_city'] > 0.5].mean()) if (M['m_city'] > 0.5).sum() else 0.0
    # *** AND THIS GUARD'S FIRST VERSION WAS STRICTER THAN THE APPROVED BANK. *** I wrote
    # "within one ramp step of the fabric" from memory of this lane's own 9/27 sentence. The
    # bank itself says something different and it is the thing that was approved: it gives
    # route its OWN value band, 108 to 132, sitting above city's 74 to 104, on purpose,
    # because 38% of the valley's cells are road and the grid is how you read a city from
    # altitude. A guard that refuses his own bank is a guard that refuses his art, and this
    # lane has now written that one three times. So it tests what the bank actually says.
    band = _T['bands']
    rlo, rhi = band['route']; clo, chi = band['city']
    ok('THE ROADS DO NOT SHOUT: the road net is %.1f%% of the sheet, and it sits in the '
       'bank\'s own route band (%.0f against %s) while the fabric sits in the city band '
       '(%.0f against %s)' % (share, rl, band['route'], cl, band['city']),
       share < 20.0 and rlo - 12 <= rl <= rhi + 12 and clo - 12 <= cl <= chi + 12,
       'the fault that made the first cut a circuit board was WIDTH, not brightness: a road '
       'tile is 96 m of world saying a road runs through it, not 96 m of tarmac')

    citysel = M['m_city'] > 0.5
    landsel = (M['m_range'] + M['m_city']) <= 0.5
    cstd = float(L[citysel].std()) if citysel.sum() else 0.0
    cshare = 100.0 * citysel.sum() / float(M['H'] * M['W'])
    ok('THE CITY DOES NOT FLOAT AS A SLAB ON A FLAT (rule 70, his words): its blocks carry '
       '%.1f of spread and it is %.0f%% of the sheet, with land around it'
       % (cstd, cshare), cstd >= 6.0 and cshare < 50.0,
       'one flat step across every block is a slab, however fine the grain on top of it')

    # AND IT IS NOT RUN'S PICTURE
    if os.path.exists(BEFORE):
        b = Image.open(BEFORE).convert('RGB')
        bw, bh = b.size
        crop = b.crop((int(bw * 0.52), int(bh * 0.45), int(bw * 0.72), int(bh * 0.85)))
        br = mean_run(crop)
        ok('AND IT BEATS THE FAR END HE WAS SHOWN: RUN\'s far frame runs %.2f x %.2f, this '
           'sheet runs %.2f x %.2f' % (br[0], br[1], r[0], r[1]),
           r[0] < br[0] and r[1] < br[1],
           'measured on their own posted frame, the same instrument both sides')
    return fails


BG = (16, 15, 14); INK = (238, 232, 220); DIM = (150, 142, 130); HOT = (226, 162, 72)


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(graded, data, M, r):
    """BEFORE (RUN's own posted far frame) and AFTER (this sheet), side by side, plus one
       square of each at its real pixels so the difference is not a matter of opinion."""
    PW, PH = 470, 760
    pad, top = 26, 96
    W = pad * 4 + PW * 3
    Hc = top + PH + 150
    im = Image.new('RGB', (W, Hc), BG)
    d = ImageDraw.Draw(im)
    f28, f18, f15, f13 = font(28), font(18), font(15), font(13)
    d.text((pad, 24), 'THE FAR END, PAINTED BY HAND', font=f28, fill=INK)
    d.text((pad, 60), 'the whole valley from altitude: the ranges, the basin, the grid, the '
                      'spine, the dead airport, the washes, the two depots   ***   COOK 10/9',
           font=f15, fill=DIM)

    b = Image.open(BEFORE).convert('RGB')
    bw, bh = b.size
    bef = b.crop((int(bw * 0.515), int(bh * 0.07), int(bw * 0.735), int(bh * 0.98)))
    im.paste(bef.resize((PW, PH), Image.LANCZOS), (pad, top))
    d.rectangle([pad, top, pad + PW, top + PH], outline=(70, 66, 60))
    d.text((pad, top + PH + 8), '1  BEFORE: the far stop today', font=f18, fill=HOT)
    d.text((pad, top + PH + 30), 'procedural, twelve texels a block: a tan dome with a ripple',
           font=f13, fill=(214, 120, 96))

    x2 = pad * 2 + PW
    sheet = Image.fromarray(graded)
    sq = min(PW, PH)
    im.paste(sheet.resize((sq, sq), Image.LANCZOS), (x2 + (PW - sq) // 2, top + (PH - sq) // 2))
    d.rectangle([x2, top, x2 + PW, top + PH], outline=(70, 66, 60))
    d.text((x2, top + PH + 8), '2  AFTER: the painted sheet', font=f18, fill=HOT)
    d.text((x2, top + PH + 30), '%d x %d = %s painted pixels, %.1fx Battle Brothers'
           % (M['W'], M['H'], f"{M['W'] * M['H']:,}", (M['W'] * M['H']) / float(BB_PIXELS)),
           font=f13, fill=(150, 200, 140))

    x3 = pad * 3 + PW * 2
    d.rectangle([x3, top, x3 + PW, top + PH], outline=(70, 66, 60))
    d.text((x3 + 10, top + 10), '3  THE SAME GROUND, 1:1', font=f18, fill=HOT)
    hh = (PH - 110) // 2
    bc = bef.resize((PW - 24, hh * 2), Image.LANCZOS).crop((0, 0, PW - 24, hh))
    im.paste(bc, (x3 + 12, top + 40))
    d.text((x3 + 12, top + 44 + hh), 'their ripple: a flat colour runs a long way',
           font=f13, fill=(214, 120, 96))
    cx, cy = int(M['W'] * 0.16), int(M['H'] * 0.10)
    im.paste(sheet.crop((cx, cy, cx + PW - 24, cy + hh)), (x3 + 12, top + 70 + hh))
    d.text((x3 + 12, top + 74 + hh * 2),
           'this paint: runs %.2f x %.2f, under the floor of %.1f' % (r[0], r[1], FLOOR_RUN),
           font=f13, fill=(150, 200, 140))

    y = top + PH + 64
    N = data['n']; g = data['g']
    cnt = {}
    for row in g:
        for dd in row: cnt[dd] = cnt.get(dd, 0) + 1
    line = ('READ OFF THE ENGINE, NOT INVENTED:  ranges %d   basin %d   grid %d   spine %d   '
            'airport %d   washes %d   depots %d   lake %d'
            % (cnt.get('mountain', 0), cnt.get('desert', 0),
               cnt.get('suburb', 0) + cnt.get('commercial', 0) + cnt.get('downtown', 0),
               cnt.get('strip', 0), cnt.get('airport', 0), cnt.get('wash', 0),
               sum(cnt.get(k, 0) for k in DEPOT_D), cnt.get('water', 0)))
    d.text((pad, y), line, font=f13, fill=DIM)
    d.text((pad, y + 22), 'one sun north-west over the land AND the city (rule 70a); the '
                          'power authority\'s camera grade goes on last, over both',
           font=f13, fill=DIM)
    return im


def main():
    data = widen_to_the_horizon(grid_from_the_engine(SEED))
    painted, M = paint(data)
    painted = runways(painted, M, data)
    rnd = np.random.default_rng(777)
    graded = the_camera(painted, rnd)

    log = []
    fails = guards(painted, graded, M, data, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    r = mean_run(Image.fromarray(graded))
    os.makedirs('slices/vote', exist_ok=True)
    Image.fromarray(graded).save('slices/vote/COOK_THE_FAR_END_SHEET.png')
    card(graded, data, M, r).save(OUT_CARD)

    buf = io.BytesIO(); Image.fromarray(graded).save(buf, 'PNG')
    N = data['n']
    json.dump(dict(
        version='BOHEMIA_THE_FAR_END_PAINTED_10_9_26',
        built='10/9/26, COOK [the far end painted by hand] round 1, rules 65 and 60',
        why="RUN painted the far end procedurally from twelve texels a block; the row says a "
            "hand-painted far end needs COOK",
        geography='read at run time from engine/bohemia_overmap.js, seed %d, %dx%d tiles'
                  % (SEED, N, N),
        px_per_tile=PX, sheet_px=[M['W'], M['H']], bb_floor_px=BB_PIXELS,
        mean_run=[round(r[0], 3), round(r[1], 3)], run_floor=FLOOR_RUN,
        palette='banks/BOHEMIA_THE_VALLEY_TONES_9_27_26.txt, this lane 9/27, unchanged',
        one_light='sun north-west over the land and the city together (rule 70a)',
        grade="the power authority's camera: one-pixel channel offset, scan structure, "
              "grain, lens falloff; applied last, over the whole sheet",
        composite_note='RUN composites this under its own lights; the sheet is the land, not '
                       'the lighting. It is painted in the same north-west sun the city uses '
                       'so the two cannot split (rule 70a).',
        seed=SEED, b64=base64.b64encode(buf.getvalue()).decode()),
        open(OUT_BANK, 'w'))

    cnt = {}
    for row in data['g']:
        for dd in row: cnt[dd] = cnt.get(dd, 0) + 1
    L = []
    L.append('THE FAR END, PAINTED BY HAND -- MEASURED  (COOK, 10/9/26, rules 65 and 60)')
    L.append('=' * 78)
    L.append('')
    L.append('THE ROW: "RUN painted it procedurally from twelve texels a block; a hand-painted')
    L.append('far end needs COOK." Pinch all the way out on the demo and the valley is a tan')
    L.append('dome with a repeating ripple in it.')
    L.append('')
    L.append('THE FIRST THING THIS ROUND DID WAS REFUSE TO INVENT THE GEOGRAPHY.')
    L.append('  The valley is not a mood, it is a map the game already builds. This tool shells')
    L.append('  out to engine/bohemia_overmap.js every run and paints what it says is there:')
    for nm, ks in (('the ranges', RANGE_D), ('the basin', BASIN_D),
                   ('the grid', {'suburb', 'commercial', 'downtown', 'apartment'}),
                   ("the strip's spine", SPINE_D), ('the dead airport', {'airport'}),
                   ('the washes', WASH_D), ('the two depots', DEPOT_D),
                   ('and Lake Mead', WATER_D)):
        L.append('    %-18s %5d tiles' % (nm, sum(cnt.get(k, 0) for k in ks)))
    L.append('  The two depots are the layout\'s own ind1 and ind2, by name: %s and %s.'
             % ((data.get('layout') or {}).get('ind1'), (data.get('layout') or {}).get('ind2')))
    L.append('  If the engine\'s layout changes, this sheet changes with it.')
    L.append('')
    L.append('WHAT "PAINTED BY HAND" MEANS, AND IT IS NOT RESOLUTION:')
    L.append('  RUN\'s far end is noise. The ripples ARE the noise function, and no amount of')
    L.append('  it becomes a mountain range. Plain noise makes dunes: smooth humps. FOLDING it')
    L.append('  -- one minus the distance from the middle -- turns every zero crossing into a')
    L.append('  CREST, and stacking those at halving sizes gives ridgelines with spurs off')
    L.append('  them, which is what a range is. Then the height field is shaded BY SLOPE')
    L.append('  against one sun, so a ridge has a lit west face and a shadowed east face.')
    L.append('  The basin gets ALLUVIAL FANS computed off the mountain mask, so the floor is')
    L.append('  brightest at the mouth of each canyon and fades into the middle, the way a')
    L.append('  real desert floor is the spread of what came down off the ranges.')
    L.append('  The washes braid. The city keeps its grid grain at one step off the fabric.')
    L.append('')
    L.append('THE NUMBERS:')
    L.append('  the sheet          %d x %d = %s painted pixels' % (M['W'], M['H'], f"{M['W']*M['H']:,}"))
    L.append('  Battle Brothers    %s (1920 x 1080), so this is %.2fx their count'
             % (f'{BB_PIXELS:,}', (M['W'] * M['H']) / float(BB_PIXELS)))
    L.append('  flat-colour run    %.2f across, %.2f down, against DIRECTION\'s floor of %.1f'
             % (r[0], r[1], FLOOR_RUN))
    L.append('  palette            this lane\'s own 9/27 valley ramps, unchanged')
    L.append('')
    L.append('ONE LIGHT (rule 70a, Paolo 10/4): there is one sun in this file, north-west, and')
    L.append('the ranges, the fans, the city blocks and the lake all take their shading from')
    L.append('it. Nothing is lit on its own. RUN composites the sheet under its own hour; the')
    L.append('sheet is the LAND, not the lighting, and it is painted in the same sun the city')
    L.append('uses so the two cannot split.')
    L.append('')
    L.append('THE POWER AUTHORITY\'S CAMERA GRADE (the row\'s words; rule 20): the last aerial')
    L.append('survey the valley\'s power authority ever flew, on a camera already old. One')
    L.append('channel sits a pixel west, a scan structure in the horizontal, grain, and the')
    L.append('falloff a cheap lens gives at its corners. ONE pass over the whole sheet,')
    L.append('because one camera photographed the land and the city together. It runs AFTER')
    L.append('the palette check on purpose: the paint is his, the camera is the horror, and')
    L.append('the two are not allowed to get mixed up.')
    L.append('')
    L.append('THE GUARDS, EVERY ONE RUN, EVERY ONE ABLE TO REFUSE THE BUILD:')
    for st, line, why in log:
        L.append('  %-4s %s' % (st.upper(), line))
    L.append('')
    L.append('[bb the overworld is battle brothers] reference/library/battle_brothers/')
    L.append('  01_WORLDMAP.md, the WORLD MAP and TERRAIN lines: BB\'s map reads at a glance')
    L.append('  because every terrain owns a value band AND a texture, never colour alone, and')
    L.append('  mountains are the darkest thing on it. Taken whole; this lane\'s own three')
    L.append('  bands from 9/27 are the same rule measured on our valley. WHAT MOVES THAT')
    L.append('  THEIR PICTURE DOES NOT: BB\'s world map is one fixed painting of one fixed')
    L.append('  world. Ours is painted from a layout the engine rolls, so the ranges, the')
    L.append('  spine and the depots land where THIS valley put them, and the same brushes')
    L.append('  paint a different valley next seed.')
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')

    print('')
    print('  the sheet %d x %d = %s px, %.2fx Battle Brothers; run %.2f x %.2f'
          % (M['W'], M['H'], f"{M['W']*M['H']:,}", (M['W']*M['H'])/float(BB_PIXELS), r[0], r[1]))
    for p in (OUT_CARD, 'slices/vote/COOK_THE_FAR_END_SHEET.png', OUT_BANK, OUT_REC):
        print('  wrote %s  (%d KB)' % (p, os.path.getsize(p) // 1024))


if __name__ == '__main__':
    main()
