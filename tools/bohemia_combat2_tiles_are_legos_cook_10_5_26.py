#!/usr/bin/env python3
"""TILES ARE LEGOS: EVERY GROUND BLOCK HAS FOUR TYPED EDGES, AND JOINS ONLY WHERE THEY MATCH  (COMBAT 2, rule 77)

PAOLO 10/5: 'the tiles aren't speaking to each other, the street tiles and the freeway tiles look like dog
shit... what's facing north, east, west... these things should conjoin easily like Legos'.

THE COMPASS (one convention, written on every sheet): NORTH IS UP THE SCREEN, the far side of the 45 degree
view; SOUTH is the near side, toward the player; EAST is right, WEST is left. A block's N edge is its top
row of pixels, S its bottom row, W its left column, E its right column. Edges are read from the outside in.

THE EDGE TYPES (what runs out of a side, read at every pixel along it, from the picture itself):
  road   asphalt (dark, grey)            walk   a sidewalk, a shoulder, a deck's concrete (light, grey)
  lot    a yard, a slab, a lot (tan)     soil   the desert's own dirt (orange)
  water  the lake                        other  a wall, a roof, a face: matches lot or soil, never road/walk/water
A side is written as RUNS: [type, from_m, to_m] in metres along the side (west to east, north to south), and
the LINES that cross it (lane lines, centre lines, curb lines) as positions in metres.

THE JOIN RULE (a seam is the two facing sides of neighbouring blocks):
  every road, curb-walk and water run on one side has the same run on the other within 3 px (7 cm);
  a side that is mostly yard meets a side that is mostly yard, mostly desert meets mostly desert ('other' meets either); every line that crosses one side crosses the other
  within 3 px. A seam that breaks any of it is a FAULT and is named: board, block, block, side, what broke.

THE ANALOG HORROR LINE (rule 20): a street that runs on is a street somebody laid; the dread is in the
same road continuing past every seam with nobody on it, never in a road that stops for no reason.

REFERENCE CHECK (the 9/4 standing law):
  CGRD-01 INTO THE BREACH: a tile set where every edge agrees reads as one place from the far zoom.
  TG-04 THE STREET TILE: his street tile's profile (walk, gutter, road, the faded dash) is the cross street
        everywhere, the overpass and the desert road included.
  AH-01 THE BIBLE: one register; the studs are cut from his own ramps and tiles, nothing new is drawn.
  REUSE CHECK: the canonical street is R4.yards + MX._street, the cross street F.street_small; reused.

[bb the tile map] Battle Brothers' battle maps are built from edge-matched tiles (roads, rivers and cliffs
  continue across every tile edge by construction). OURS: a block joins only where its typed edges match.

    python3 tools/bohemia_combat2_tiles_are_legos_cook_10_5_26.py
      -> records/target/bb/BOHEMIA_GROUND_EDGES.json   (every shipped block's four typed edges, the compass)
      -> prints every board's faults, its own and its apron's
"""
import json, os, sys
import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(REPO, 'slices/fight_ground')
MAN = os.path.join(DIR, 'fight_ground.json')
OUT = os.path.join(REPO, 'records/target/bb/BOHEMIA_GROUND_EDGES.json')
COMPASS = 'NORTH is up the screen (the far side of the 45 degree view), SOUTH the near side, EAST right, WEST left; runs read west to east and north to south'
HARD = ('road', 'walk', 'water')
DEPTH = 6               # px read inward for a side's type (a median, so one stray pixel never types an edge)
LINE_REACH = 3          # house tiles read inward for the lines: a dash is 3 m in every 12 m and one in five has worn away, so three tiles hold one
LINE_PAINT = [(170, 149, 118), (227, 130, 71), (255, 255, 250)]   # his line paints (C[5] the white-grey, T[5] the faded yellow, T[6])


def classify(rgb):
    """rgb: (n, 3) medians along a side -> type per pixel."""
    r, g, b = rgb[:, 0], rgb[:, 1], rgb[:, 2]
    mx = rgb.max(1); warm = r - b
    t = np.full(len(rgb), 'other', dtype=object)
    t[(b > r + 8) & (b > 60)] = 'water'
    light = mx >= 112
    t[light & (warm < 56)] = 'walk'
    t[light & (warm >= 56) & (warm < 100)] = 'lot'
    t[(warm >= 100) & (r >= 120) & (g > 0.6 * r)] = 'soil'           # a clay roof is redder (g < 0.6 r): 'other'
    t[(mx < 112) & (warm < 45) & (b <= r + 8)] = 'road'
    return t


def smooth(t, k=16):
    """A run shorter than k px is noise (a crack, a pebble): it takes the type of the longer run beside it,
       shortest first, until no short run is left."""
    runs = []
    i = 0
    while i < len(t):
        j = i
        while j < len(t) and t[j] == t[i]: j += 1
        runs.append([t[i], i, j]); i = j
    while len(runs) > 1:
        short = [q for q in range(len(runs)) if runs[q][2] - runs[q][1] < k]
        if not short: break
        q = min(short, key=lambda z: runs[z][2] - runs[z][1])
        nb = [z for z in (q - 1, q + 1) if 0 <= z < len(runs)]
        z = max(nb, key=lambda w: runs[w][2] - runs[w][1])
        lo, hi = min(runs[q][1], runs[z][1]), max(runs[q][2], runs[z][2])
        runs[min(q, z)] = [runs[z][0], lo, hi]; del runs[max(q, z)]
        merged = []
        for ty_, a_, b_ in runs:
            if merged and merged[-1][0] == ty_: merged[-1][2] = b_
            else: merged.append([ty_, a_, b_])
        runs = merged
    return runs


def strips(a, tile):
    dx, dy = tile[0] * LINE_REACH, tile[1] * LINE_REACH
    return {'N': a[:dy, :].transpose(1, 0, 2), 'S': a[::-1][:dy, :].transpose(1, 0, 2),
            'W': a[:, :dx], 'E': a[:, ::-1][:, :dx]}


def lines_in(st, runs, stroke_px=50):
    """Lines cross the side inside road runs: pixels far brighter than the asphalt round them, anywhere in
       the inward reach (a dash or a solid line)."""
    out = []
    paint = np.zeros(st.shape[:2], bool)
    for col in LINE_PAINT: paint |= (np.abs(st - np.array(col)).max(2) <= 4)
    for k in (1, 2, 3):                                 # close the wear specks inside a dash (gaps up to 3 px)
        paint[:, k:] |= paint[:, :-k] & np.roll(paint, -k, 1)[:, k:]
    best = np.zeros(paint.shape[0], int); cur = np.zeros(paint.shape[0], int)
    near = paint.shape[1] // LINE_REACH                 # a line that crosses the side starts within one tile of it
    for j in range(paint.shape[1]):                     # the longest painted stroke running inward at each position
        cur = (cur + 1) * paint[:, j]
        ok = (j - cur + 1) < near
        np.maximum(best, np.where(ok, cur, 0), out=best)
    share = (best >= stroke_px).astype(float)           # a stroke 1.2 m long running in from the side is a line crossing it;
    for ty_, a, b in runs:                              # a texture pixel that happens to be paint-coloured is never 1.2 m long
        if ty_ != 'road' or b - a < 2 * stroke_px / 1.2: continue      # a lane line lives in a road at least 2 m wide
        a, b = max(0, a - 4), min(len(share), b + 4)    # the curb line sits on the road's own edge
        hit = share[a:b] > 0.5
        i = 0
        while i < len(hit):
            if hit[i]:
                j = i
                while j < len(hit) and hit[j]: j += 1
                if j - i <= 24: out.append(a + (i + j - 1) / 2.0)
                i = j
            else: i += 1
    return out


def curb_only(runs, ppm=30.0):
    """A walk is a hard edge only where it is a curb: touching a road run. Any other light grey (a slab, a
       roof, a deck's rail) is 'other'."""
    out = []
    for i, (ty_, a, b) in enumerate(runs):
        if ty_ == 'walk':
            nb = [runs[j][0] for j in (i - 1, i + 1) if 0 <= j < len(runs)]
            if 'road' not in nb or b - a > 2.5 * ppm: ty_ = 'other'      # a curb crosses the side; a walk along it is not a curb
        out.append([ty_, a, b])
    merged = []
    for ty_, a, b in out:
        if merged and merged[-1][0] == ty_: merged[-1][2] = b
        else: merged.append([ty_, a, b])
    return merged


def edges_of(path, tile=(515, 364)):
    return edges_of_img(Image.open(path), tile)


def edges_of_img(img, tile=(515, 364)):
    a = np.asarray(img.convert('RGB')).astype(int)
    res = {}
    for s, st in strips(a, tile).items():
        med = np.median(st[:, :DEPTH], 1)
        runs = curb_only(smooth(classify(med)), (tile[0] if s in 'NS' else tile[1]) / 12.0)
        res[s] = dict(n=len(med), runs=runs, lines=lines_in(st, runs, int(1.2 * (tile[1] if s in 'NS' else tile[0]) / 12.0)))
    return res


FACING = {'E': 'W', 'S': 'N'}


def seam_faults(ea, eb):
    """ea: the side of block a (its E or S), eb: the facing side of block b (W or N). Returns faults."""
    if ea['n'] != eb['n']: return ['the sides differ in length (%d vs %d px)' % (ea['n'], eb['n'])]
    n = ea['n']
    ta = np.empty(n, dtype=object); tb = np.empty(n, dtype=object)
    for ty_, a, b in ea['runs']: ta[a:b] = ty_
    for ty_, a, b in eb['runs']: tb[a:b] = ty_
    faults = []
    for hard in HARD:                                   # a road / walk / water run must be met, 1 px either way
        ma, mb = ta == hard, tb == hard
        diff = ma ^ mb
        if diff.any():
            grow = lambda m: m | np.roll(m, 1) | np.roll(m, -1) | np.roll(m, 2) | np.roll(m, -2) | np.roll(m, 3) | np.roll(m, -3)
            bad = diff & ~((ma & grow(mb)) | (mb & grow(ma)))
            if bad.sum() > 0:
                idx = np.where(bad)[0]
                faults.append('%s meets something else over %d px (from px %d)' % (hard, len(idx), idx[0]))
    na, nb = {k: (ta == k).sum() for k in ('lot', 'soil')}, {k: (tb == k).sum() for k in ('lot', 'soil')}
    ga = max(na, key=na.get) if sum(na.values()) > n * 0.2 else None
    gb = max(nb, key=nb.get) if sum(nb.values()) > n * 0.2 else None
    if ga and gb and ga != gb: faults.append('a %s side meets a %s side (town yard against desert dirt)' % (ga, gb))
    la, lb = ea['lines'], eb['lines']
    for x in la:
        if not any(abs(x - y) <= 3.0 for y in lb): faults.append('a line at px %d stops at the seam' % x)
    for y in lb:
        if not any(abs(x - y) <= 3.0 for x in la): faults.append('a line at px %d starts at the seam' % y)
    return faults


def board_faults(lay, edges):
    out = []
    R, C = len(lay), len(lay[0])
    for r in range(R):
        for c in range(C):
            a = lay[r][c]
            if c + 1 < C:
                for f in seam_faults(edges[a]['E'], edges[lay[r][c + 1]]['W']): out.append('%s|%s E-W: %s' % (a, lay[r][c + 1], f))
            if r + 1 < R:
                for f in seam_faults(edges[a]['S'], edges[lay[r + 1][c]]['N']): out.append('%s/%s N-S: %s' % (a, lay[r + 1][c], f))
    return out


def fits(edges, lay, r, c, bid):
    """The board generator's question: may bid sit at (r, c) given the neighbours already placed?"""
    if c and lay[r][c - 1] and seam_faults(edges[lay[r][c - 1]]['E'], edges[bid]['W']): return False
    if r and lay[r - 1][c] and seam_faults(edges[lay[r - 1][c]]['S'], edges[bid]['N']): return False
    return True


# ---------------------------------------------------------------------------------------------------------
# THE STUD: every town block wears the same edge. The town street (walk 24 to 25.4 m, road 25.4 to 34.6 m, the
# centre dash at 30 m, walk 34.6 to 36 m) is painted on every town block's ground, but a driveway, a burn, a yard
# patch or a gutter shade that reached a block's side made its seam disagree with its neighbour's. So every
# town block's finished picture gets the same ring, cut from ONE canonical street block: STUD_W px at the west
# and east over the street band (22.5 to 37.5 m, where no building stands), STUD_N px at the north and south
# over the yard rows (rows 0 and 4, where no building stands), and in any tile column whose side is a cross
# street, the canonical cross street. A strip mall's sides get the ring the whole height (the property line
# between two malls). A building that stands on a side is left alone: the reader names that seam, and the
# board generator does not put that block there.
STUD_W, STUD_N = 12, 10
_CANON = {}
TOWN_KINDS = ('subs', 'corner', 'cornerw', 'lots', 'suburb_stem', 'main', 'works', 'ruin', 'strip', 'culdesac')
CROSS_KINDS = ('freeway', 'freewayo', 'scrubroad', 'scrub', 'landfill', 'shore')


def desert_bands(desert, tile):
    """The canonical desert strips: the cleanest column (west/east) and row (north/south) of one desert block,
       the ones with the most plain soil and no rock, read by the same classifier."""
    if 'desert' in _CANON: return _CANON['desert']
    from PIL import Image
    a = np.asarray(desert.convert('RGB')).astype(int)
    PX, PY = tile; H, W = a.shape[:2]
    def score(v): return (classify(v) == 'soil').mean()
    xs = range(int(PX * 0.1), int(PX * 0.9), 4); ys = range(int(PY * 0.1), int(PY * 0.9), 3)
    bx = max(xs, key=lambda x: score(np.median(a[:, x:x + STUD_W], 1)))
    by = max(ys, key=lambda y: score(np.median(a[y:y + STUD_N], 0)))
    _CANON['desert'] = (desert.crop((bx, 0, bx + STUD_W, H)), desert.crop((0, by, W, by + STUD_N)))
    return _CANON['desert']


def stud(board, kind, canon, cross, tile, desert=None):
    """board: a finished block picture (BP x 5*PY). canon: the canonical town block picture. cross: the
       canonical cross-street tile (PX x PY). desert: a desert block for the canonical desert strips. Returns
       the board with the ring painted. The east ring is the west ring mirrored and the south ring the north
       ring mirrored, so the pixels that touch across any seam are the same pixels."""
    from PIL import Image
    PX, PY = tile
    W, H = board.size
    ppm = PX / 12.0
    yard_y = int(ppm * 3.0 * PY / PX)
    a = np.asarray(board.convert('RGB')).astype(int)
    crossing = {}
    for top in (True, False):                                            # which tile columns are a cross street, read first
        row = a[:6] if top else a[-6:]
        crossing[top] = [c for c in range(5) if (classify(np.median(row[:, c * PX:(c + 1) * PX], 0)) == 'road').mean() > 0.45]
    flipx = lambda im: im.transpose(Image.FLIP_LEFT_RIGHT)
    flipy = lambda im: im.transpose(Image.FLIP_TOP_BOTTOM)
    if kind in ('scrub', 'scrubroad', 'landfill'):                       # the desert (and the landfill on it): one canonical strip each way
        col, row = desert_bands(desert, tile)
        board.paste(col, (0, 0)); board.paste(flipx(col), (W - STUD_W, 0))
        board.paste(row, (0, 0)); board.paste(flipy(row), (0, H - STUD_N))
    elif kind == 'shore' and 'shore_img' in _CANON:                      # the shore: every block draws one waterline; one band cut from it
        band = _CANON['shore_img'].crop((int(ppm * 4.0), 0, int(ppm * 4.0) + STUD_W, H))
        board.paste(band, (0, 0)); board.paste(flipx(band), (W - STUD_W, 0))
    elif kind in ('freeway', 'freewayo'):                                # the freeway runs on: its own lanes, one band;
        band = board.crop((int(ppm * 4.0), 0, int(ppm * 4.0) + STUD_W, H))   # its north verge is town yard, its south desert
        board.paste(band, (0, 0)); board.paste(flipx(band), (W - STUD_W, 0))
        board.paste(canon.crop((0, yard_y, W, yard_y + STUD_N)), (0, 0))
        board.paste(flipy(desert_bands(desert, tile)[1]), (0, H - STUD_N))
    elif kind in TOWN_KINDS and kind != 'culdesac':                      # a cul-de-sac is closed west and east: yard
        band = canon.crop((int(ppm * 4.0), 0, int(ppm * 4.0) + STUD_W, H))
        for r in range(5):                                               # row by row; a building standing on the side is left alone
            for x, flip in ((0, False), (W - STUD_W, True)):
                seg = np.median(a[r * PY:(r + 1) * PY, x:x + STUD_W], 1)
                if r != 2 and (classify(seg) == 'other').mean() > 0.4: continue
                piece = band.crop((0, r * PY, STUD_W, (r + 1) * PY))
                board.paste(flipx(piece) if flip else piece, (x, r * PY))
    if kind in TOWN_KINDS and kind != 'strip':                           # the town's yard rows north and south
        for top in (True, False):
            row = a[:6] if top else a[-6:]
            for c in range(5):
                if c in crossing[top]: continue
                if (classify(np.median(row[:, c * PX:(c + 1) * PX], 0)) == 'other').mean() >= 0.4: continue
                piece = canon.crop((c * PX, yard_y, (c + 1) * PX, yard_y + STUD_N))
                board.paste(piece if top else flipy(piece), (c * PX, 0 if top else H - STUD_N))
    for top in (True, False):                                            # the cross streets last, over every ring
        for c in crossing[top]:
            piece = cross.crop((0, PY // 2, PX, PY // 2 + STUD_N))
            board.paste(piece if top else flipy(piece), (c * PX, 0 if top else H - STUD_N))
    return board


def solve(palettes, edges, rng, fixed=None, twins=True, tries=4000, cols=4):
    """THE BOARD GENERATOR'S RULE: fill the grid row by row, west to east; a block may go in a cell only if
       its west edge meets the block to its west and its north edge meets the block above (and, when the cell
       has a fixed neighbour east or south, those too); no block beside or above its own twin. Depth-first
       with backtracking, seeded. palettes[r] = list of candidate ids for row r (or per-cell lists)."""
    R = len(palettes); C = cols
    lay = [[None] * C for _ in range(R)]
    fixed = fixed or {}
    for (r, c), b in fixed.items(): lay[r][c] = b
    cells = [(r, c) for r in range(R) for c in range(C) if (r, c) not in fixed]
    count = [0]
    memo = {}

    def bad(x, y, d):                                   # each pair is read once, however often the search asks
        k = (x, y, d)
        if k not in memo: memo[k] = bool(seam_faults(edges[x]['E' if d == 'EW' else 'S'], edges[y]['W' if d == 'EW' else 'N']))
        return memo[k]

    def ok(r, c, b):
        if c and lay[r][c - 1] and bad(lay[r][c - 1], b, 'EW'): return False
        if r and lay[r - 1][c] and bad(lay[r - 1][c], b, 'NS'): return False
        if c + 1 < C and (r, c + 1) in fixed and bad(b, lay[r][c + 1], 'EW'): return False
        if r + 1 < R and (r + 1, c) in fixed and bad(b, lay[r + 1][c], 'NS'): return False
        if twins and ((c and lay[r][c - 1] == b) or (r and lay[r - 1][c] == b)): return False
        return True

    def go(i):
        if i == len(cells): return True
        count[0] += 1
        if count[0] > tries: return False
        r, c = cells[i]
        pal = palettes[r][c] if palettes[r] and isinstance(palettes[r][0], list) else palettes[r]
        opts = list(pal); rng.shuffle(opts)
        for b in opts:
            if b in edges and ok(r, c, b):
                lay[r][c] = b
                if go(i + 1): return True
                lay[r][c] = None
        return False
    return lay if go(0) else None


KIT_JSON = os.path.join(DIR, 'kit_street', 'kit_street.json')


def kit_override(e, plan, tile=(515, 364)):
    """rule 82a: a tile laid from COOK TWO's kit carries the edges the kit declares (its own gate, COOK2 STREET KIT,
       proves the pixels agree), so the block's side over that tile reads the declared runs and lines."""
    if not plan or not os.path.exists(KIT_JSON): return e
    kit = json.load(open(KIT_JSON))['pieces']
    PX, PY = tile
    for key, piece in plan.items():
        r, c = map(int, key.split(','))
        k = kit[piece]
        for side, hit in (('W', c == 0), ('E', c == 4), ('N', r == 0), ('S', r == 4)):
            if not hit: continue
            span_px = PY if side in 'WE' else PX
            off = (r if side in 'WE' else c) * span_px
            lo, hi = off, off + span_px
            runs = [[t, a, b] for t, a, b in e[side]['runs'] if b <= lo or a >= hi]
            for t, a, b in e[side]['runs']:                             # keep the parts of runs outside the tile
                if a < lo < b: runs.append([t, a, lo])
                if a < hi < b: runs.append([t, hi, b])
            for t, a, b in k['edges'][side]:
                tt = t if t in ('road', 'water') else ('walk' if t == 'walk' else 'other')
                runs.append([tt, off + int(round(a * span_px / 12.0)), off + int(round(b * span_px / 12.0))])
            runs.sort(key=lambda q: q[1])
            merged = []
            for t, a, b in runs:
                if merged and merged[-1][0] == t and merged[-1][2] >= a: merged[-1][2] = max(merged[-1][2], b)
                else: merged.append([t, a, b])
            e[side]['runs'] = curb_only(merged, span_px / 12.0)
            lines = [x for x in e[side]['lines'] if not (lo <= x < hi)]
            for ln in k.get('lines', []):
                crosses = (ln['axis'] == 'ew') == (side in 'WE')
                if crosses: lines.append(off + ln['at_m'] * span_px / 12.0)
            e[side]['lines'] = sorted(lines)
    return e


def read_all(manifest, folder=DIR):
    return {bid: kit_override(edges_of(os.path.join(folder, b['src'])), b.get('kit_plan')) for bid, b in manifest['blocks'].items()}


def write(edges, ppm, faults):
    data = {'compass': COMPASS, 'types': {'road': 'asphalt', 'walk': 'sidewalk, shoulder, deck', 'lot': 'yard, slab, lot',
            'soil': 'desert dirt', 'water': 'the lake', 'other': 'a wall, a roof, a face'},
            'join_rule': 'road, curb-walk and water runs meet the same run within 3 px; lot meets lot, soil meets soil; every line crosses within 1 px',
            'px_per_metre': ppm, 'blocks': {}, 'faults': faults}
    for bid, e in sorted(edges.items()):
        data['blocks'][bid] = {s: dict(runs=[[t, round(a / ppm[s in 'NS'], 2), round(b / ppm[s in 'NS'], 2)] for t, a, b in v['runs']],
                                       lines_m=[round(x / ppm[s in 'NS'], 2) for x in v['lines']], px=v['n'])
                               for s, v in e.items()}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    json.dump(data, open(OUT, 'w'), indent=1)


def main():
    m = json.load(open(MAN))
    edges = read_all(m)
    ppm = [m['tile_px'][1] / m['tile_metres'], m['tile_px'][0] / m['tile_metres']]   # [W/E sides run down (tilted), N/S run across]
    faults = {}
    for name, b in m['boards'].items():
        own = board_faults(b['blocks'], edges)
        ap = board_faults(b['apron']['blocks'], edges) if 'apron' in b else []
        faults[name] = dict(board=own, with_apron=ap)
        print('%-9s board %3d faults, with apron %3d' % (name, len(own), len(ap)))
        for f in own[:40]: print('    ' + f)
    write(edges, ppm, faults)
    return faults


if __name__ == '__main__':
    main()
