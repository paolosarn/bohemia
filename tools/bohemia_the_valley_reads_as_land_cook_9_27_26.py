#!/usr/bin/env python3
"""THE VALLEY READS AS LAND  (COOK [bb map art] round 2, 9/27/26)

RULE 33 (Paolo 9/24): THE OVERWORLD IS BATTLE BROTHERS. The row is "BB's map TILES, place
icons and the party marker". Round 1 did the markers. This is the tiles, and it is the bigger
half by a long way.

*** MEASURED FIRST, AND THE MEASUREMENT IS THE WHOLE ROUND: AT THE ZOOM YOU CROSS THE VALLEY
AT, THE MAP IS A GRID OF GREY SQUARES WITH BLACK LINES THROUGH IT. *** Below FAR_ZOOM the
MAP tab fills each cell with ONE FLAT COLOUR from a per-district table, and the valley is 96
cells across, so on a phone a cell is about four pixels. What that paints:

  ROADS ARE 38% OF EVERY CELL IN THE VALLEY (arterial 26.3, freeway 10.8, beltway, strip and
  interchange on top) AND ALL OF THEM ARE ONE NEAR-BLACK TONE. They form a dense regular
  grid and they read as the subject of the picture.
  EVERYTHING BUILT IS ONE GREY. suburb 28.3%, commercial 4.0%, apartment, resort, strip: all
  of them resolve to the same FABRIC tone, so the city is a uniform field.
  THE MOUNTAINS ARE 9.7% OF THE VALLEY AND YOU CANNOT SEE THEM. Flat fill, no form, no light.
  THE DESERT IS 5.9% AND IT BARELY SHOWS.

So you cannot tell city from desert from mountain on the surface you are meant to travel
across, and the one thing you CAN see is the street grid, which is the exact inversion of how
a travel map works.

WHAT THIS FIXES, AND IT IS THREE THINGS, NOT A REPAINT:
 1. THE LAND GETS ITS OWN VALUE RANGE so desert, city, mountain and water separate at a
    glance. The city stays quiet, because the city is the thing you are inside, not the thing
    you navigate by.
 2. THE ROADS STOP OWNING THE PICTURE. The arterial grid comes in to one step off the fabric
    and becomes the CITY'S GRAIN; the freeway and the beltway stay, and go LIGHTER than the
    land rather than darker, because on a travel map a route is a line you trace, not a gap
    you fall into.
 3. THE MOUNTAINS GET FORM. A ridge is lit on its north-west face and dark on its south-east,
    which is the same sun as every other pixel in this game, and it is what turns a dark patch
    into relief.

WHAT MOVES (rule 33g, Paolo 9/24: "Battle Brothers is just a bunch of pictures... we can do
more and put more life into it"): THE DUST. One band of lighter tone drifts across open desert
on the beat, one cell a beat, north-east to south-west, which is the way the wind runs here.
Nothing else on the land moves, and that is the point: the land is still, the dust crosses it,
and the markers on it are the things that are alive.

REFERENCE CHECK (the 9/4 standing law):
  THE LIBRARY, READ FIRST (rule 33j, Paolo 9/27, "download everything or remember
         everything"): reference/library/battle_brothers/01_WORLDMAP.md, the volume for this
         department. The line that decides this round is theirs, not mine:
         "Speed by terrain: roads fastest, plains, then forest and hills slower, swamp
         slowest, snow slow; MOUNTAINS IMPASSABLE." SO THE LAND READING FIRST IS NOT TASTE,
         IT IS THE MECHANIC -- what kind of ground a cell is IS how fast you cross it, so a
         map where you cannot tell ground apart is a map you cannot plan a route on. It also
         backs the ring: mountains are the one thing you cannot go through, so they have to
         read as a wall and not as a dark patch.
  BBM-03 ROADS ARE THE ONLY LINES ON THE MAP, and this round is that entry taken seriously:
         on their map the only long thin bright things are the routes, because a route is what
         a player traces with their eye. Ours had 38% of the valley as one black grid, which
         means every line was a route and therefore none of them was.
  BBM-02 A PLACE IS A KIT, NOT AN ICON -- carried over as the reason the CITY stays quiet
         here: the places are drawn by round 1's markers, so the fabric underneath must not
         compete with them.
  BBM-04 WHAT A STILL MAP COSTS: one moving part, on the beat. Here the whole land has one,
         and it is the dust.
  AH-01  THE BIBLE. R4 THE LIGHT WAS IN THE ROOM: the ridges are lit from the north-west, the
         same corner roof_hipTL is lit from and the same corner every shadow in this game
         falls away from. R1 THE ORDINARY FRAME: a valley of streets with the desert eating
         the edges of it.
  DIST-03 LAS VEGAS AERIAL: the real valley is a grid of pale streets on tan ground inside a
         ring of dark mountains, and the mountains are what the eye uses to place itself.
         That is the structure taken: the ring reads first, the ground second, the grid third.
  REUSE CHECK: the districts come from the game's own overmap and the base colours from the
  MAP tab's own declared tables. Nothing here invents a district or a colour family; what it
  adds is a value per cell and a ramp to snap it to.

    python3 tools/bohemia_the_valley_reads_as_land_cook_9_27_26.py
      -> banks/BOHEMIA_THE_VALLEY_TONES_9_27_26.txt
      -> slices/vote/COOK_THE_VALLEY_READS_AS_LAND.png
"""
import colorsys
import json
import math
import os
import re
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

MAP = 'slices/BOHEMIA_MAP_CURRENT.html'
OUT_BANK = 'banks/BOHEMIA_THE_VALLEY_TONES_9_27_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_VALLEY_READS_AS_LAND.png'
N = 96

def die(m): sys.exit('REFUSED: ' + m)

rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
hexs = lambda c: '#%02x%02x%02x' % tuple(max(0, min(255, int(round(v)))) for v in c)
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def read_map_tables():
    """THE BASE COLOURS ARE THE MAP'S OWN, read out of it rather than re-picked."""
    s = open(MAP, encoding='utf8', errors='replace').read()
    def block(name):
        i = s.find('var %s = {' % name)
        if i < 0: die('the MAP tab no longer declares %s' % name)
        return s[i:s.index('};', i)]
    fill = dict(re.findall(r"(\w+):\s*'(#[0-9a-fA-F]{6})'", block('FILL')))
    roadcol = dict(re.findall(r"(\w+):\s*'(#[0-9a-fA-F]{6})'", block('ROADCOL')))
    road = set(re.findall(r"(\w+):\s*(?:1|true)", block('ROAD')))
    terrain = set(re.findall(r"(\w+):\s*(?:1|true)", block('TERRAIN')))
    void = re.search(r"VOID\s*=\s*'(#[0-9a-fA-F]{6})'", s).group(1)
    fabric = re.search(r"FABRIC\s*=\s*'(#[0-9a-fA-F]{6})'", s).group(1)
    return fill, roadcol, road, terrain, void, fabric


FILL, ROADCOL, ROAD, TERRAIN, VOID, FABRIC = read_map_tables()


def districts():
    """The valley itself, from the game's own overmap."""
    out = subprocess.run(['node', '-e', '''
      const OM=require('./engine/bohemia_overmap.js');
      const m=OM.buildOvermap(12345); const N=%d; const rows=[];
      for(let y=0;y<N;y++){const r=[];for(let x=0;x<N;x++){const c=m.at(x,y);r.push(c?c.district:null);}rows.push(r);}
      process.stdout.write(JSON.stringify(rows));''' % N], capture_output=True, text=True)
    if out.returncode: die('the overmap would not build: ' + out.stderr[:200])
    return json.loads(out.stdout)


D = districts()

# ---------------------------------------------------------------- the families
# The valley has four things in it and they have to separate. The bands are VALUE bands, in
# the map's own colour families, and they are ordered the way the real place is ordered:
# mountains darkest, city in the middle and quiet, open ground brightest and warmest.
BAND = {
    'mountain': (30, 62),     # the ring, dark, and the only thing with relief
    'city':     (74, 104),    # what you are inside; it stays quiet on purpose
    'ground':   (118, 158),   # desert and wash, the brightest and warmest
    'water':    (54, 78),
    'route':    (108, 132),   # the freeway and the beltway: concrete, and GREY not sand
    'void':     (18, 24),
}
HUE = {'mountain': 0.09, 'city': 0.09, 'ground': 0.10, 'water': 0.54, 'route': 0.11,
       'void': 0.09}
SAT = {'mountain': 0.14, 'city': 0.09, 'ground': 0.22, 'water': 0.30, 'route': 0.04,
       'void': 0.10}
STEPS = 6                     # each family is a six-step ramp; nothing lands off it

def ramp(fam):
    lo, hi = BAND[fam]
    out = []
    for i in range(STEPS):
        v = lo + (hi - lo) * i / float(STEPS - 1)
        r, g, b = colorsys.hls_to_rgb(HUE[fam], v / 255.0, SAT[fam])
        out.append((r * 255, g * 255, b * 255))
    return out

RAMPS = {f: ramp(f) for f in BAND}

CITY_STEP = {                 # the city's own grain: quiet, but not one grey
    'suburb': 2, 'apartment': 3, 'commercial': 3, 'resort': 4, 'strip': 4, 'casino': 4,
    'mall': 3, 'stadium': 1, 'speedway': 1, 'airport': 1, 'airbase': 1, 'campus': 2,
    'town': 3, 'farm': 1, 'solar': 0, 'rail': 1, 'estate': 2, 'golf': 1, 'convention': 3,
    'waterpark': 2, 'minigp': 1, 'prison': 1, 'dam': 2, 'fort': 2, 'convention2': 3,
}
ARTERIAL = {'arterial', 'strip', 'interchange'}
ROUTE = {'freeway', 'beltway'}


def family(d):
    if d is None: return 'void'
    if d == 'mountain': return 'mountain'
    if d in ('desert', 'wash'): return 'ground'
    if d == 'water': return 'water'
    if d in ROUTE: return 'route'
    if d in ARTERIAL: return 'city'
    return 'city'


def relief():
    """HOW HIGH A MOUNTAIN CELL IS: its distance from the nearest thing that is not mountain.
       A ridge's interior is high, its skirt is low, and that is enough to light it."""
    INF = 999
    h = [[0 if D[y][x] != 'mountain' else INF for x in range(N)] for y in range(N)]
    for y in range(N):
        for x in range(N):
            if h[y][x]:
                a = h[y - 1][x] if y else 0
                b = h[y][x - 1] if x else 0
                h[y][x] = min(h[y][x], a + 1, b + 1)
    for y in range(N - 1, -1, -1):
        for x in range(N - 1, -1, -1):
            if h[y][x]:
                a = h[y + 1][x] if y < N - 1 else 0
                b = h[y][x + 1] if x < N - 1 else 0
                h[y][x] = min(h[y][x], a + 1, b + 1)
    return h


H = relief()


def tone(x, y, beat=0):
    d = D[y][x]
    fam = family(d)
    r = RAMPS[fam]
    if fam == 'void': return r[0]
    if fam == 'water': return r[2]
    if fam == 'route':
        # THE ONLY REAL LINES ON THE MAP (BBM-03) -- AND MY FIRST CUT MADE THEM A GLARE.
        # I put them at the top of the whole map's value range and swapped one shouting grid
        # for another, brighter one: the freeway alone is 995 cells, 10.8% of the valley, and
        # at maximum brightness that is not a route, it is a lattice. A freeway reads as a
        # line because it is CONTINUOUS and made of a different material, not because it is
        # the brightest thing in the frame. So it is CONCRETE: grey where the desert is
        # warm, a little darker than open ground, plainly not the city.
        return r[3] if d == 'freeway' else r[2]
    if fam == 'mountain':
        # LIT FROM THE NORTH-WEST: if the ground falls away to the north-west, this face
        # catches the sun; if it rises, this face is the shaded side.
        nw = H[max(0, y - 1)][max(0, x - 1)]
        se = H[min(N - 1, y + 1)][min(N - 1, x + 1)]
        slope = se - nw                                   # >0 means the NW side is lower
        i = 2 + (1 if slope > 0 else (-1 if slope < 0 else 0))
        i += 1 if H[y][x] >= 4 else 0                     # the high interior reads paler
        return r[max(0, min(STEPS - 1, i))]
    if fam == 'ground':
        # DUNE BANDING runs north-east to south-west, the way the wind runs here, and THE
        # DUST is one band of it stepping one cell a beat.
        band = math.sin((x * 0.62 + y * 0.38) - beat * 0.62)
        i = 2 + (1 if band > 0.45 else (-1 if band < -0.55 else 0))
        i += 1 if d == 'wash' else 0
        return r[max(0, min(STEPS - 1, i))]
    # the city: quiet, but its blocks are not one grey, and the arterial grid is GRAIN
    if d in ARTERIAL:
        return r[1]
    return r[max(0, min(STEPS - 1, CITY_STEP.get(d, 2)))]


def old_tone(d):
    if d is None: return rgb(VOID)
    if d in ROAD: return rgb(ROADCOL.get(d, ROADCOL.get('freeway', '#33333c')))
    if d in TERRAIN: return rgb(FILL.get(d, FILL.get('default', '#6a6258')))
    if d in FILL: return rgb(FILL[d])
    return rgb(FABRIC)


def field(fn):
    im = Image.new('RGB', (N, N))
    px = im.load()
    for y in range(N):
        for x in range(N):
            px[x, y] = tuple(int(round(v)) for v in fn(x, y))
    return im


def main():
    counts = {}
    for row in D:
        for d in row: counts[d] = counts.get(d, 0) + 1
    road_share = 100.0 * sum(counts.get(k, 0) for k in ROAD) / (N * N)
    pad = lambda s, n: (s + ' ' * n)[:n]
    print('THE VALLEY IS %d CELLS ACROSS AND BELOW FAR_ZOOM EVERY ONE OF THEM IS ONE FLAT '
          'COLOUR. What that paints, measured:' % N)
    for k in ('arterial', 'freeway', 'suburb', 'mountain', 'desert', 'commercial'):
        print('   ' + pad(k, 12) + '%5d cells  %5.1f%%' % (counts.get(k, 0),
                                                           100.0 * counts.get(k, 0) / (N * N)))
    print('   ' + pad('ALL ROADS', 12) + '%5d cells  %5.1f%%  in ONE near-black tone'
          % (sum(counts.get(k, 0) for k in ROAD), road_share))
    print()

    before = field(lambda x, y: old_tone(D[y][x]))
    after = field(lambda x, y: tone(x, y, 0))

    # ---- GUARD 1: THE FOUR THINGS MUST TELL APART, which today they do not.
    def means(im):
        px = im.load()
        g = {}
        for y in range(N):
            for x in range(N):
                f = family(D[y][x])
                g.setdefault(f, []).append(LUM(px[x, y]))
        return {k: sum(v) / len(v) for k, v in g.items()}
    mb, ma = means(before), means(after)
    print(pad('what it is', 12) + pad('before', 10) + pad('after', 10) + 'value out of 255')
    for f in ('mountain', 'city', 'ground', 'water', 'route'):
        if f in ma:
            print(pad(f, 12) + pad('%.0f' % mb.get(f, 0), 10) + '%.0f' % ma[f])
    for a, b in (('mountain', 'city'), ('city', 'ground'), ('ground', 'route')):
        gap_b, gap_a = abs(mb[a] - mb[b]), abs(ma[a] - ma[b])
        print('   %s against %s: %.0f before, %.0f after' % (pad(a, 9), pad(b, 8), gap_b, gap_a))
        if gap_a < 18:
            die('%s and %s are only %.0f apart. They still do not tell apart on the map.'
                % (a, b, gap_a))

    # ---- GUARD 2: THE ROADS MUST STOP OWNING THE PICTURE.
    #  How loud a thing is on a map is how far it sits from the land around it. Measured as
    #  the mean value distance between a road cell and its non-road neighbours.
    def road_shout(im):
        px = im.load()
        tot, n = 0.0, 0
        for y in range(1, N - 1):
            for x in range(1, N - 1):
                if D[y][x] not in ARTERIAL: continue
                near = [LUM(px[x + dx, y + dy]) for dx in (-1, 0, 1) for dy in (-1, 0, 1)
                        if (dx or dy) and D[y + dy][x + dx] not in ROAD]
                if not near: continue
                tot += abs(LUM(px[x, y]) - sum(near) / len(near)); n += 1
        return tot / max(1, n)
    sb, sa = road_shout(before), road_shout(after)

    def route_shout(im):
        px = im.load()
        tot, n = 0.0, 0
        for y in range(1, N - 1):
            for x in range(1, N - 1):
                if D[y][x] not in ROUTE: continue
                near = [LUM(px[x + dx, y + dy]) for dx in (-1, 0, 1) for dy in (-1, 0, 1)
                        if (dx or dy) and D[y + dy][x + dx] not in ROAD]
                if not near: continue
                tot += abs(LUM(px[x, y]) - sum(near) / len(near)); n += 1
        return tot / max(1, n)
    rb, ra = route_shout(before), route_shout(after)
    print()
    print('THE ARTERIAL GRID SHOUTS %.0f OF 255 ABOVE THE GROUND IT CROSSES, AND AFTER IT IS '
          '%.0f.' % (sb, sa))
    if sa >= sb * 0.6:
        die('the grid still shouts %.0f. It is 38%% of the valley; at that share it has to be '
            'grain, not the subject.' % sa)
    # *** AND THE GUARD ABOVE MEASURED THE GRID I FIXED AND NOT THE ONE I MADE. *** The first
    # cut of this dropped the arterial from 49 to 14 and passed, while putting the FREEWAY at
    # the top of the whole map's value range -- 995 cells, 10.8% of the valley, a bright
    # lattice owning the picture exactly as the black one had. A clean number on the wrong
    # surface, in my own guard, for the fifteenth time in this lane. The route is measured too
    # now, and it is held to reading as a line rather than a glare.
    print('THE FREEWAY SHOUTS %.0f OF 255 ABOVE THE LAND IT CROSSES (it was %.0f). It is '
          '10.8%% of the valley, so it has to read as a line, not a glare.' % (ra, rb))
    if ra > 34:
        die('the freeway shouts %.0f. I swapped a black lattice for a bright one.' % ra)
    if ra < 8:
        die('the freeway only shouts %.0f, so it is not a line any more.' % ra)

    # ---- GUARD 3: THE MOUNTAINS MUST HAVE FORM, AND IT MUST BE THE GAME'S OWN SUN.
    def spread(im, want):
        px = im.load()
        v = [LUM(px[x, y]) for y in range(N) for x in range(N) if family(D[y][x]) == want]
        m = sum(v) / len(v)
        return (sum((q - m) ** 2 for q in v) / len(v)) ** 0.5
    vb, va = spread(before, 'mountain'), spread(after, 'mountain')
    px = after.load()
    lit = dark = 0
    for y in range(1, N - 1):
        for x in range(1, N - 1):
            if D[y][x] != 'mountain': continue
            if H[y - 1][x - 1] < H[y + 1][x + 1]: lit += LUM(px[x, y])
            elif H[y - 1][x - 1] > H[y + 1][x + 1]: dark += LUM(px[x, y])
    print('THE MOUNTAINS HAD NO FORM AT ALL (spread %.1f of 255) AND NOW THEY HAVE %.1f, '
          'AND THE LIT FACES ARE THE NORTH-WEST ONES.' % (vb, va))
    if va < 4:
        die('the mountains are still flat (%.1f). A ring you cannot see is not a ring.' % va)
    if lit <= dark:
        die('the mountains are lit from the wrong corner. The sun in this game is north-west.')

    # ---- GUARD 4: NOTHING OFF THE RAMPS. Every tone must be a step of a declared family.
    allowed = set(tuple(int(round(v)) for v in c) for r in RAMPS.values() for c in r)
    px = after.load()
    bad = set(px[x, y] for y in range(N) for x in range(N)) - allowed
    if bad: die('%d tones are off every ramp: %s' % (len(bad), sorted(bad)[:4]))
    print('EVERY TONE ON THE NEW MAP IS A STEP OF ONE OF %d SIX-STEP FAMILY RAMPS: %d colours '
          'in the whole valley, against %d before.'
          % (len(RAMPS), len(set(px[x, y] for y in range(N) for x in range(N))),
             len(set(before.load()[x, y] for y in range(N) for x in range(N)))))

    # ---- WHAT MOVES, MEASURED. "The dust drifts" is a claim until it is a number.
    moved = []
    for b in range(1, 4):
        a0 = field(lambda x, y: tone(x, y, b - 1)).load()
        a1 = field(lambda x, y: tone(x, y, b)).load()
        moved.append(sum(1 for y in range(N) for x in range(N) if a0[x, y] != a1[x, y]))
    ground_cells = sum(1 for row in D for d in row if family(d) == 'ground')
    print('THE DUST MOVES %s CELLS A BEAT, out of %d cells of open ground.'
          % ('/'.join(str(m) for m in moved), ground_cells))
    if min(moved) < ground_cells * 0.08:
        die('the dust moves %d cells a beat out of %d. That is not a drift, it is nothing.'
            % (min(moved), ground_cells))

    # ---- the card: the map's own camera, before and after, at the size he travels at
    def fnt(sz, bold=False):
        p = '/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf' % ('-Bold' if bold else '')
        try: return ImageFont.truetype(p, sz)
        except Exception: return ImageFont.load_default()
    F_T, F_S, F_B = fnt(31, True), fnt(16), fnt(16)
    MAG, PAD, GAP = 4, 24, 16
    big = lambda im: im.resize((N * MAG, N * MAG), Image.NEAREST)
    dust = [big(field(lambda x, y, b=b: tone(x, y, b))) for b in range(4)]
    foot = ['On the map you cross the valley on, every cell is one flat colour. Roads are 38% '
            'of them and all one black, so the only thing you can see is the street grid.',
            'Now the mountains ring it and catch the sun on their north-west faces, the open '
            'ground is warm and the city is quiet inside its own grain,',
            'and the freeway is concrete where the desert is sand, so it reads as the one '
            'line you would travel by instead of a gap you fall into. The dust drifts on the beat.']
    d0 = ImageDraw.Draw(Image.new('RGB', (8, 8)))
    wide = lambda s, f: d0.textbbox((0, 0), s, font=f)[2]
    CW = max([N * MAG * 2 + GAP, wide('THE VALLEY READS AS LAND', F_T)]
             + [wide(s, F_B) for s in foot]) + PAD * 2
    card = Image.new('RGB', (CW, 4000), (17, 16, 15))
    d = ImageDraw.Draw(card)
    y = PAD
    d.text((PAD, y), 'THE VALLEY READS AS LAND', fill=(236, 231, 222), font=F_T); y += 40
    d.text((PAD, y), 'the whole valley, at the zoom you travel across it at', fill=(150, 142, 130),
           font=F_S); y += 26
    d.text((PAD, y), 'NOW', fill=(150, 142, 130), font=F_B)
    d.text((PAD + N * MAG + GAP, y), 'THIS', fill=(150, 142, 130), font=F_B); y += 20
    card.paste(big(before), (PAD, y))
    card.paste(dust[0], (PAD + N * MAG + GAP, y)); y += N * MAG + GAP
    d.text((PAD, y), 'AND THE DUST CROSSES IT, ONE CELL A BEAT', fill=(150, 142, 130),
           font=F_B); y += 20
    strip = Image.new('RGB', (N * 2 * 4 + GAP * 3, N * 2), (17, 16, 15))
    for i, im in enumerate(dust):
        strip.paste(im.resize((N * 2, N * 2), Image.NEAREST), (i * (N * 2 + GAP), 0))
    card.paste(strip, (PAD, y)); y += strip.size[1] + GAP + 6
    for line in foot:
        d.text((PAD, y), line, fill=(176, 154, 114), font=F_B); y += 22
    card = card.crop((0, 0, CW, y + PAD))
    os.makedirs(os.path.dirname(OUT_CARD), exist_ok=True)
    card.save(OUT_CARD)

    doc = {
        'version': 'BOHEMIA_THE_VALLEY_TONES_v1', 'built': '2026-09-27',
        'lane': 'COOK [bb map art] round 2',
        'measured_before_drawing': {
            'cells': N * N, 'road_share_pct': round(road_share, 1),
            'what_it_paints': 'below FAR_ZOOM every cell is one flat colour from a '
                              'per-district table, so the valley is a grid of grey squares '
                              'with black lines through it and you cannot tell city from '
                              'desert from mountain',
            'colours_before': len(set(before.load()[x, y] for y in range(N) for x in range(N))),
        },
        'bands': BAND, 'hue': HUE, 'sat': SAT, 'steps': STEPS,
        'ramps': {f: [hexs(c) for c in r] for f, r in RAMPS.items()},
        'city_step': CITY_STEP,
        'rules': [
            'the land gets its own value range: mountains darkest, city quiet in the middle, '
            'open ground brightest and warmest',
            'the arterial grid is the CITY GRAIN, one step off the fabric, because it is 38% '
            'of the valley and at that share it cannot be the subject',
            'the freeway and the beltway are the only real lines and they go LIGHTER than the '
            'land, because a route is traced, not fallen into (BBM-03)',
            'a ridge is lit on its north-west face and dark on its south-east, from its own '
            'distance-to-not-mountain, which is the same sun as every other pixel in the game',
        ],
        'what_moves': 'the dust: one band of the desert banding steps one cell a beat, '
                      'north-east to south-west. Nothing else on the land moves.',
        'measurements': {
            'mountain_vs_city': [round(abs(mb['mountain'] - mb['city'])),
                                 round(abs(ma['mountain'] - ma['city']))],
            'city_vs_ground': [round(abs(mb['city'] - mb['ground'])),
                               round(abs(ma['city'] - ma['ground']))],
            'arterial_shout': [round(sb), round(sa)],
            'mountain_spread': [round(vb, 1), round(va, 1)],
        },
        'library_cited': 'reference/library/battle_brothers/01_WORLDMAP.md (rule 33j): '
                         '"Speed by terrain: roads fastest, plains, then forest and hills '
                         'slower, swamp slowest, snow slow; mountains impassable" -- so the '
                         'land reading first is the mechanic, not taste.',
        'not_shipped': 'rule 18: a bank and a VOTE candidate. It replaces the MAP tab\'s '
                       'toneOf the round the hold allows.',
    }
    with open(OUT_BANK, 'w') as f: json.dump(doc, f, indent=1)
    if not json.load(open(OUT_BANK)).get('ramps'): die('read-back failed')
    print()
    print('wrote %s  (%.0f KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) / 1024))
    print('wrote %s  (%.0f KB)' % (OUT_CARD, os.path.getsize(OUT_CARD) / 1024))


if __name__ == '__main__':
    main()
