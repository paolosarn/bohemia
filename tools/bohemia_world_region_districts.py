#!/usr/bin/env python3
"""
BOHEMIA -- THE REGION'S DISTRICTS, JOINED (10/18/26, WORLD lane).  Row [the districts as data, joined].

PAOLO 10/18, on the map: 'the districts are looking like shit, the streets looking like shit,
doesn't look like shit's connected that smart like it should.' RUN can only join the streets if
the data says where every district ends and which road crosses each edge.

WHAT A DISTRICT IS HERE. The real Las Vegas region is basin and range: flat valleys walled by
mountains, and the places people live sit in the valleys. So a district is a real named basin
(the Las Vegas Valley, the Eldorado Valley, the Ivanpah Valley, Pahrump...), a real range (the
Spring Mountains, the McCullough Range, the Sheep Range), the lake, or the land past a state line.
Every block of the 496 x 496 region belongs to exactly one.

HOW THE LINES ARE CUT. Each district starts from real points (its towns, its dry lake, its range's
spine) and grows outward by the cost of walking the GROUND (open 1, a wash or hills 1.8, a peak 6,
the water 1 from a lake's own seeds and 4 from anyone else's), never by the roads: a road would drag
a district down its length. The line between two districts falls where they meet, which is where
the ground is hardest to cross: on the ridges. That is where the real lines are (the hydrographic
basins of Nevada are cut on their divides), and it is why a road crossing a line is a PASS.

THE ROADS ACROSS THE LINES. Every road of the region (the generator's ROADS, its own polylines) is
walked block by block; where it leaves one district for the next, the data writes a CROSSING: the
road, the block, the district it leaves and the one it enters, and the road's REAL LOCAL NAME on each
side (NV-160 is Blue Diamond Road in Clark County and the Pahrump Valley Highway past the Nye line;
NV-159 is Charleston Boulevard in the valley and Red Rock Canyon Road past it; NV-147, Lake Mead
Boulevard, becomes Northshore Road, NV-167, inside the recreation area).

THE ENDS. Every road end is named for what it really stops at: the region's rim (the road goes on,
the BEYOND list says where), the valley's box (the roll's own streets take it; the loader stitches),
another road (a junction), a place, the water (a ramp), or a gate (the test site's). A road that
stops at a district line for no reason is the defect the gate refuses.

Nothing here draws. The districts are data; RUN paints them (rule 77b).
"""
import heapq

# kind: city (the valley's own urban basin), basin (a valley with its towns), range (mountains),
# lake (the water and its shore), beyond (past a state line or the region's own reach)
# seeds are real points (lat, lon); the seat is a PLACES name that must land in its own district
DISTRICTS = [
    ('LAS VEGAS VALLEY', 'city', None, [
        (36.17, -115.35), (36.27, -115.28), (36.28, -115.15), (36.26, -115.04), (36.16, -115.03),
        (36.08, -115.02), (36.04, -114.98), (35.98, -115.08), (35.96, -115.03), (36.03, -115.26),
        (35.99, -115.20), (36.08, -115.35), (35.94, -115.21), (36.10, -114.93)]),
    ('RED ROCK', 'basin', 'RED ROCK', [(36.13, -115.43), (36.05, -115.40), (36.09, -115.42)]),
    ('THE SPRING MOUNTAINS', 'range', 'MT CHARLESTON LODGE', [
        (36.27, -115.69), (36.26, -115.64), (36.36, -115.69), (36.46, -115.76), (36.17, -115.55),
        (36.02, -115.52), (35.95, -115.49), (35.88, -115.47)]),
    ('PAHRUMP VALLEY', 'basin', 'PAHRUMP', [(36.21, -115.98), (36.10, -115.90), (36.30, -116.05), (36.00, -115.85)]),
    ('GOODSPRINGS VALLEY', 'basin', 'GOODSPRINGS', [(35.83, -115.43), (35.87, -115.40)]),
    ('SANDY VALLEY', 'basin', 'SANDY VALLEY', [(35.82, -115.62), (35.75, -115.60)]),
    ('THE IVANPAH VALLEY', 'basin', 'PRIMM', [(35.78, -115.33), (35.61, -115.39), (35.70, -115.32), (35.66, -115.33)]),
    ('THE MCCULLOUGH RANGE', 'range', None, [(35.85, -115.06), (35.75, -115.09), (35.92, -115.05), (35.65, -115.12)]),
    ('THE ELDORADO VALLEY', 'basin', 'BOULDER CITY', [(35.98, -114.84), (35.97, -114.92), (35.85, -114.95), (35.80, -114.98)]),
    ('ELDORADO CANYON', 'basin', 'NELSON', [(35.71, -114.83), (35.74, -114.80)]),
    ('SEARCHLIGHT', 'basin', 'SEARCHLIGHT', [(35.47, -114.92), (35.38, -114.90), (35.58, -114.93)]),
    ('LAKE MEAD', 'lake', 'HOOVER DAM', [
        (36.09, -114.77), (36.13, -114.84), (36.04, -114.79), (36.14, -114.68), (36.13, -114.50),
        (36.10, -114.40), (36.016, -114.737), (35.95, -114.72), (35.85, -114.68), (35.75, -114.66)]),
    ('THE OVERTON ARM', 'lake', 'ECHO BAY', [(36.30, -114.39), (36.20, -114.45), (36.40, -114.36), (36.31, -114.43)]),
    ('ARIZONA', 'beyond', None, [(35.90, -114.50), (36.05, -114.30), (35.60, -114.40), (35.40, -114.30)]),
    ('THE MUDDY MOUNTAINS', 'range', None, [(36.30, -114.70), (36.25, -114.78), (36.38, -114.62)]),
    ('VALLEY OF FIRE', 'basin', 'VALLEY OF FIRE', [(36.43, -114.52), (36.45, -114.47)]),
    ('THE MOAPA VALLEY', 'basin', 'MOAPA', [(36.68, -114.60), (36.72, -114.55), (36.54, -114.44), (36.62, -114.50)]),
    ('THE VIRGIN RIVER', 'beyond', None, [(36.80, -114.25), (36.90, -114.15), (36.70, -114.20)]),
    ('GARNET VALLEY', 'basin', 'APEX', [(36.37, -114.93), (36.39, -114.96), (36.43, -114.86), (36.50, -114.80)]),
    ('THE SHEEP RANGE', 'range', 'CORN CREEK', [(36.44, -115.36), (36.58, -115.21), (36.40, -115.18), (36.70, -115.24), (36.50, -115.10)]),
    ('COYOTE SPRING VALLEY', 'basin', None, [(36.80, -114.95), (36.90, -114.95), (36.70, -114.98)]),
    ('INDIAN SPRINGS VALLEY', 'basin', 'INDIAN SPRINGS', [(36.57, -115.67), (36.54, -115.60), (36.52, -115.50)]),
    ('THE DESERT RANGE', 'range', None, [(36.62, -115.46), (36.75, -115.52), (36.85, -115.40)]),
    ('THE PROVING GROUND', 'beyond', 'MERCURY', [(36.66, -115.99), (36.80, -116.10), (36.90, -115.90), (36.75, -115.80)]),
    ('THE AMARGOSA', 'beyond', None, [(36.40, -116.20), (36.55, -116.20), (36.20, -116.20)]),
    ('CALIFORNIA', 'beyond', None, [(35.40, -115.60), (35.30, -115.80), (35.50, -115.85), (35.60, -116.00), (35.35, -115.35)]),
]
# what a step on each ground costs a district of each kind as it grows: a basin spreads over the
# flats and stops at the foot of the hills, a range spreads over the hills and stops where the flats
# begin, a lake over its water and shore. Where two meet is where the ground changes: the line.
GROW = {
    'city':   {'.': 1.0, 's': 1.8, 'h': 3.0, '^': 8.0, '~': 4.0, 'land': 1.0},
    'basin':  {'.': 1.0, 's': 1.8, 'h': 3.0, '^': 8.0, '~': 4.0, 'land': 1.0},
    'beyond': {'.': 1.0, 's': 1.8, 'h': 3.0, '^': 8.0, '~': 4.0, 'land': 1.0},
    'range':  {'.': 2.5, 's': 2.5, 'h': 1.0, '^': 1.0, '~': 8.0, 'land': 2.5},
    'lake':   {'.': 3.0, 's': 1.5, 'h': 4.0, '^': 8.0, '~': 1.0, 'land': 3.0},
}
# THE ONE LINE THAT IS LAW, NOT GROUND: the California-Nevada line, a straight survey line from Lake
# Tahoe (39 N, 120 W) to the Colorado at 35.0019 N, 114.6333 W; it runs through Primm. Nothing in
# Nevada is California and nothing in California is Nevada, whatever the ground says.
CA_LINE = ((39.0, -120.0), (35.0019, -114.6333))
def in_california(lat, lon):
    (la0, lo0), (la1, lo1) = CA_LINE
    t = (la0 - lat) / (la0 - la1)
    return lon < lo0 + t * (lo1 - lo0)

# the real local name of a road, district by district (the default is the road's own name)
LOCAL_NAMES = {
    'NV-160': {'LAS VEGAS VALLEY': 'BLUE DIAMOND RD (NV-160)', 'RED ROCK': 'BLUE DIAMOND RD (NV-160)',
               'THE SPRING MOUNTAINS': 'BLUE DIAMOND RD (NV-160)', 'PAHRUMP VALLEY': 'PAHRUMP VALLEY HWY (NV-160)',
               'THE AMARGOSA': 'NV-160'},
    'NV-159': {'LAS VEGAS VALLEY': 'W CHARLESTON BLVD (NV-159)', 'RED ROCK': 'RED ROCK CANYON RD (NV-159)'},
    'NV-157 KYLE': {'*': 'KYLE CANYON RD (NV-157)'},
    'NV-156 LEE': {'*': 'LEE CANYON RD (NV-156)'},
    'NV-158': {'*': 'DEER CREEK RD (NV-158)'},
    'NV-147 LAKE MEAD BLVD': {'LAS VEGAS VALLEY': 'LAKE MEAD BLVD (NV-147)', 'THE MOAPA VALLEY': 'MOAPA VALLEY BLVD (NV-169)',
                              '*': 'NORTHSHORE RD (NV-167)'},
    'NV-169 VALLEY OF FIRE': {'*': 'VALLEY OF FIRE HWY (NV-169)'},
    'NV-564 LAKE MEAD PKWY': {'LAS VEGAS VALLEY': 'LAKE MEAD PKWY (NV-564)', '*': 'LAKESHORE RD (NV-166)'},
    'LAKESHORE RD': {'*': 'LAKESHORE RD (NV-166)'},
    'NV-146 ST ROSE': {'*': 'ST ROSE PKWY (NV-146)'},
    'NV-161 GOODSPRINGS': {'THE IVANPAH VALLEY': 'GOODSPRINGS RD (NV-161)', 'GOODSPRINGS VALLEY': 'GOODSPRINGS RD (NV-161)',
                           '*': 'SANDY VALLEY RD'},
    'NV-165 NELSON': {'THE ELDORADO VALLEY': 'NELSON RD (NV-165)', '*': 'ELDORADO CANYON RD (NV-165)'},
    'NV-604 LV BLVD N': {'*': 'LAS VEGAS BLVD N (NV-604)'},
    'NV-168 MOAPA': {'*': 'GLENDALE BLVD (NV-168)'},
    'US-93 OLD': {'THE ELDORADO VALLEY': 'NEVADA WAY (US-93 BUSINESS)', '*': 'HOOVER DAM ACCESS RD (NV-172)'},
    'I-11 / US-93': {'ARIZONA': 'US-93', '*': 'I-11'},
    'I-515 / US-93': {'*': 'I-515 / US-93'},
    'I-15 S': {'*': 'I-15'}, 'I-15 N': {'*': 'I-15'},
    'US-95 NW': {'*': 'US-95'}, 'US-95 S': {'*': 'US-95'},
    'MERCURY HWY': {'*': 'MERCURY HWY'},
}
LOCAL_NAMES_WHY = ('the names on the ground: NV-160 is Blue Diamond Road in Clark County and the Pahrump Valley Highway '
                   'in Nye; NV-159 is Charleston Boulevard to the city\'s edge, then Red Rock Canyon Road; NV-147 Lake Mead '
                   'Boulevard becomes Northshore Road (NV-167) in the recreation area, which meets NV-169, Moapa Valley '
                   'Boulevard, at Overton; NV-564 Lake Mead Parkway becomes Lakeshore Road (NV-166) at the recreation area; '
                   'old US-93 is Nevada Way through Boulder City and the Hoover Dam Access Road (NV-172) to the crest; I-11 '
                   'becomes US-93 across the river; NV-161 leaves Goodsprings as the county\'s Sandy Valley Road. '
                   'draft:true, a name WORDS may restyle; the routes are real.')

# an end that is a real end for a reason no test can see: a fence, a crest, a road's own reach
REAL_ENDS = {
    ('MERCURY HWY', 1): 'the test site: the road runs on behind the fence at Mercury, and the fence is the end',
    ('US-93 OLD', 1): 'the dam\'s crest: the old highway ends on the dam since the bypass bridge opened in 2010',
    ('NV-156 LEE', 1): 'the Lee Canyon ski area at the top of the canyon; the road goes nowhere past it',
    ('NV-157 KYLE', 1): 'the top of Kyle Canyon, the lodge and the trailheads; the road ends in the mountains',
    ('NV-158', 0): 'Deer Creek Road joins Kyle Canyon Road under the lodge',
    ('CREECH RD', 1): 'the drone base\'s gate',
    ('ECHO BAY RD', 1): 'the marina; the road ends at the water',
    ('NV-168 MOAPA', 1): 'Moapa town; the road ends at the river',
}

CODE_OF = {}


def build_districts(G, grid, road, places, portals):
    """G is the generator module (its helpers and constants); grid/road are its rasters"""
    N, K, D, idx, in_grid, in_valley = G.N, G.K, G.D, G.idx, G.in_grid, G.in_valley
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    names = [d[0] for d in DISTRICTS]
    lake = set(i for i, d in enumerate(DISTRICTS) if d[1] == 'lake')
    VAL = names.index('LAS VEGAS VALLEY')
    INF = float('inf')
    dist = [INF] * (D * D)
    own = bytearray([255]) * (D * D)
    heap = []

    def push(k, i, d0=0.0):
        if d0 < dist[k] or (d0 == dist[k] and i < own[k]):
            dist[k] = d0; own[k] = i; heapq.heappush(heap, (d0, i, k))

    # the valley's box is the Las Vegas Valley, whole: it is the seed itself
    for y in range(N):
        for x in range(N): push(idx(x, y), VAL)
    for i, (name, kind, seat, seeds) in enumerate(DISTRICTS):
        for la, lo in seeds:
            fx, fy = G.cell_of(la, lo); x, y = int(fx // 1), int(fy // 1)
            if in_grid(x, y) and not in_valley(x, y): push(idx(x, y), i)

    kinds = [d[1] for d in DISTRICTS]
    CA = names.index('CALIFORNIA')
    ca = bytearray(D * D)
    for y in range(-K, N + K):
        for x in range(-K, N + K):
            la, lo = G.latlon_of(x + 0.5, y + 0.5)
            ca[idx(x, y)] = 1 if in_california(la, lo) else 0

    def step_cost(k, i):
        if (i == CA) != bool(ca[k]): return None          # the state line is a wall both ways
        c = chr(grid[k]); g = GROW[kinds[i]]
        return g.get(c, g['land'])

    while heap:
        d0, i, k = heapq.heappop(heap)
        if d0 > dist[k] or own[k] != i: continue
        x, y = (k % D) - K, (k // D) - K
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if not in_grid(nx, ny): continue
            nk = idx(nx, ny)
            if in_valley(nx, ny): continue
            sc = step_cost(nk, i)
            if sc is None: continue
            nd = d0 + sc
            if nd < dist[nk] or (nd == dist[nk] and i < own[nk]):
                dist[nk] = nd; own[nk] = i; heapq.heappush(heap, (nd, i, nk))
    settle(G, own, names)
    return own, names, letters


MIN_RUN = 10      # a road that dips into another district for fewer blocks than this is running ALONG the line


def settle(G, own, names):
    """two clean-ups that make a line a line: (1) a road running along a ridge must not zigzag across
    it: a dip of fewer than MIN_RUN blocks into another district, with the same district on both sides,
    is given (with the blocks two around it) to the district the road is in; (2) a district is ONE piece:
    any stray island joins the neighbour it shares the most edge with. Deterministic, in a fixed order."""
    N, K, D, idx, in_grid, in_valley = G.N, G.K, G.D, G.idx, G.in_grid, G.in_valley
    for _ in range(4):
        moved = 0
        for name, cls, pts in G.ROADS:
            cells = [c for c in G.road_cells(pts) if in_grid(*c)]
            runs = []
            for c in cells:
                d = own[idx(*c)]
                if runs and runs[-1][0] == d: runs[-1][1].append(c)
                else: runs.append([d, [c]])
            for r in range(1, len(runs) - 1):
                a, (d, seg), b = runs[r - 1][0], runs[r], runs[r + 1][0]
                if a != b or len(seg) >= MIN_RUN: continue
                for (x, y) in seg:
                    for dy in range(-2, 3):
                        for dx in range(-2, 3):
                            nx, ny = x + dx, y + dy
                            if in_grid(nx, ny) and not in_valley(nx, ny) and own[idx(nx, ny)] == d:
                                own[idx(nx, ny)] = a; moved += 1
        moved += islands(G, own, len(names))
        if not moved: break


def islands(G, own, n):
    N, K, D, idx, in_grid = G.N, G.K, G.D, G.idx, G.in_grid
    seen = bytearray(D * D); comps = [[] for _ in range(n)]
    for y in range(-K, N + K):
        for x in range(-K, N + K):
            k = idx(x, y)
            if seen[k]: continue
            d = own[k]; st = [(x, y)]; seen[k] = 1; cells = []
            while st:
                cx, cy = st.pop(); cells.append((cx, cy))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = cx + dx, cy + dy
                    if in_grid(nx, ny):
                        nk = idx(nx, ny)
                        if not seen[nk] and own[nk] == d: seen[nk] = 1; st.append((nx, ny))
            comps[d].append(cells)
    moved = 0
    for d in range(n):
        if len(comps[d]) < 2: continue
        comps[d].sort(key=lambda c: (-len(c), c[0]))
        for cells in comps[d][1:]:
            border = {}
            cs = set(cells)
            for (x, y) in cells:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if in_grid(nx, ny) and (nx, ny) not in cs:
                        j = own[idx(nx, ny)]; border[j] = border.get(j, 0) + 1
            to = sorted(border.items(), key=lambda t: (-t[1], t[0]))[0][0]
            for (x, y) in cells: own[idx(x, y)] = to; moved += 1
    return moved


def roads_across(G, grid, road, own, names, places, portals):
    """every road walked block by block: where it crosses a district line, and what each end really is"""
    N, K, D, idx, in_grid, in_valley = G.N, G.K, G.D, G.idx, G.in_grid, G.in_valley
    VAL = names.index('LAS VEGAS VALLEY')

    def local(rname, dname):
        t = LOCAL_NAMES.get(rname, {})
        return t.get(dname, t.get('*', rname))

    def live(c):
        """a block the road really holds: on the road layer, or inside the valley's box (the roll's streets)"""
        return in_grid(*c) and (in_valley(*c) or road[idx(*c)] != 0)

    paths = {}
    for name, cls, pts in G.ROADS:
        cells = [c for c in G.road_cells(pts) if in_grid(*c)]
        # the road's own reach: trim pruned nubs at both ends (the generator prunes a road that ends in sand)
        while cells and not live(cells[0]): cells.pop(0)
        while cells and not live(cells[-1]): cells.pop()
        paths[name] = (cls, cells)

    crossings = []
    for name, (cls, cells) in paths.items():
        for a, b in zip(cells, cells[1:]):
            da, db = own[idx(*a)], own[idx(*b)]
            if da == db: continue
            na, nb = names[da], names[db]
            crossings.append({'road': name, 'cls': cls, 'x': b[0], 'y': b[1], 'fromX': a[0], 'fromY': a[1],
                              'from': na, 'to': nb, 'nameFrom': local(name, na), 'nameTo': local(name, nb),
                              'live': bool(live(a) and live(b))})

    # what each end of each road stops at
    road_at = {}
    for name, (cls, cells) in paths.items():
        for c in cells: road_at.setdefault(c, set()).add(name)
    place_at = {(p['x'], p['y']): p['name'] for p in places}
    portal_at = {(p['x'], p['y']) for p in portals}
    ends = []
    for name, (cls, cells) in paths.items():
        if not cells: continue
        for e, c in ((0, cells[0]), (1, cells[-1])):
            x, y = c
            near = [(x + dx, y + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)]
            kind, what = None, None
            if (name, e) in REAL_ENDS: kind, what = 'gate', REAL_ENDS[(name, e)]
            elif x in (-K, N + K - 1) or y in (-K, N + K - 1): kind, what = 'rim', 'the region\'s edge: the road goes on (the beyond list)'
            elif in_valley(x, y) or any(in_valley(*n) for n in near) or c in portal_at: kind, what = 'valley', 'the valley\'s box: the roll\'s own streets take it (the loader stitches)'
            else:
                other = sorted(set().union(*[road_at.get(n, set()) for n in near]) - {name})
                pl = [place_at[n] for n in [(x + dx, y + dy) for dx in range(-2, 3) for dy in range(-2, 3)] if n in place_at]
                water = any(in_grid(*n) and grid[idx(*n)] == ord('~') for n in near)
                if other: kind, what = 'junction', 'meets ' + ', '.join(other)
                elif pl: kind, what = 'place', pl[0]
                elif water: kind, what = 'water', 'the water\'s edge'
            line = any(in_grid(*n) and own[idx(*n)] != own[idx(x, y)] for n in near)
            ends.append({'road': name, 'end': e, 'x': x, 'y': y, 'district': names[own[idx(x, y)]],
                         'kind': kind or 'break', 'what': what or 'nothing: the road stops for no reason',
                         'atLine': bool(line)})
    return crossings, ends, paths


def describe(G, grid, road, own, names, letters, places, crossings, paths):
    """one line of facts per district, and its rows, for RUN and the gate"""
    N, K, D, idx = G.N, G.K, G.D, G.idx
    km2 = (G.METRES_PER_CELL / 1000.0) ** 2
    out = []
    count = [0] * len(names); box = [[10 ** 9, 10 ** 9, -10 ** 9, -10 ** 9] for _ in names]
    edge = {}
    for y in range(-K, N + K):
        for x in range(-K, N + K):
            i = own[idx(x, y)]; count[i] += 1
            b = box[i]; b[0] = min(b[0], x); b[1] = min(b[1], y); b[2] = max(b[2], x); b[3] = max(b[3], y)
            for dx, dy in ((1, 0), (0, 1)):
                nx, ny = x + dx, y + dy
                if G.in_grid(nx, ny):
                    j = own[idx(nx, ny)]
                    if j != i: key = (min(i, j), max(i, j)); edge[key] = edge.get(key, 0) + 1
    seats = {}
    for p in places: seats.setdefault(names[own[idx(p['x'], p['y'])]], []).append(p['name'])
    for i, (name, kind, seat, seeds) in enumerate(DISTRICTS):
        nb = []
        for (a, b), n in sorted(edge.items()):
            if i not in (a, b): continue
            j = b if a == i else a
            rds = sorted(set(c['road'] for c in crossings if {c['from'], c['to']} == {name, names[j]}))
            nb.append({'id': letters[j], 'name': names[j], 'edge': n, 'roads': rds})
        rds_in = sorted(set(r for r, (cls, cells) in paths.items() if any(own[idx(*c)] == i for c in cells)))
        out.append({'id': letters[i], 'name': name, 'kind': kind, 'seat': seat, 'places': seats.get(name, []),
                    'blocks': count[i], 'km2': round(count[i] * km2), 'bbox': box[i], 'roads': rds_in,
                    'neighbours': nb, 'draft': True})
    return out
