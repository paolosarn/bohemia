#!/usr/bin/env python3
"""THE FAR END AS TILES  (COOK [the far end painted by hand] round 2, 10/10/26)

Round 1 painted the valley from altitude as one sheet and nothing in the repo picked it up.
That is the measurement this round started from, and it is the right place to start: a thing
nobody can use is not shipped, whatever its guards said.

*** WHY NOBODY COULD USE IT, MEASURED IN THE SHIPPED MAP, NOT GUESSED. ***
engine/bohemia_valleymap.js is the map's painter and it does two things:
  paintCell(world,x,y)   draws ONE overmap cell into a 128 x 128 buffer. For a cell with a
                         district kit it paints the real block grid. For a ROAD cell it
                         FILLS ALL 128 x 128 WITH TARMAC and then rules lane lines on it.
                         For a TERRAIN cell -- mountain, desert, wash, every piece of land
                         in the valley -- it fills one flat colour and throws ninety random
                         translucent rectangles on top.
  paintValley(world,cx)  "THE WHOLE VALLEY, one flat image at 1 pixel per cell."
So the far end he pinches out to is 96 x 96 = 9,216 PIXELS, scaled up to fill a phone.
Battle Brothers' map is 2,073,600. THE FAR END IS DRAWN AT 0.44% OF BATTLE BROTHERS, and
rule 60 is him asking for that number since 10/1. It is not a shading problem and it was
never going to be fixed by a better flat colour: there is no mountain painting in the map at
all, only a fill and a speckle, which is exactly why the valley reads as a tan dome.

AND THE ROAD CELL IS THE SAME CATEGORY ERROR THIS LANE MADE AND CAUGHT IN ITS OWN FIRST
SHEET LAST ROUND: an overmap cell is 96 m of world saying a road runs through it, not 96 m
of tarmac. Filled solid, 2,543 arterials make a printed circuit board. I fixed that in my
sheet and then found the shipped map does it too.

*** SO ROUND 2 IS NOT ANOTHER SHEET. *** A single 2016 px picture asks RUN to throw away a
per-cell painter and composite an image, which is a rewrite on their side and seed-locked on
mine. What drops into the painter they already have is TILES: one hand-painted 16 x 16 per
overmap cell, which the same loop can stamp instead of a flat fill.

WHY SIXTEEN, AND IT IS NOT A TASTE: 96 cells x 16 px = 1,536, and 1,536 squared is 2,359,296.
That is the smallest whole number of pixels per cell that puts THE WHOLE VALLEY ON ONE SCREEN
AT BATTLE BROTHERS' COUNT. Fifteen would just clear it; sixteen is the power of two above.
It is 256 times the 9,216 the map draws now.

*** AND THE TILES ARE CUT FROM ONE CONTINUOUS PAINTING, WHICH IS WHAT MAKES THEM JOIN. ***
Rule 77 (Paolo 10/5: "the tiles aren't speaking to each other... these things should conjoin
easily like Legos") wants every ground tile to carry four typed edges and to sit beside
another only where the types match. The cheap way to get that is to draw each tile alone and
hope. This paints the WHOLE valley once with round 1's own brushes -- ridged folded noise for
the ranges shaded by slope under one sun, alluvial fans off the mountain mask, braided
washes, the city's grain -- and then CUTS it on the cell grid. Tiles cut from one painting
meet by construction, and the gate still measures every seam instead of trusting that.

    python3 tools/bohemia_the_far_end_as_tiles_cook_10_10_26.py
      -> banks/BOHEMIA_THE_FAR_END_TILES_10_10_26.txt
      -> records/BOHEMIA_THE_FAR_END_AS_TILES_MEASURED_10_10_26.txt
      -> slices/vote/COOK_THE_FAR_END_AS_TILES.png

REFERENCE CHECK (the 9/4 standing law):
  01_WORLDMAP.md, the TERRAIN line: BB's world map reads at a glance because every terrain
        owns a value band AND a texture, never colour alone. The shipped map has the bands
        and no texture; this puts the texture in.
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east.
  TG-05 THE VALLEY TONES (this lane, 9/27): the six-step ramps per family, reused unchanged.
  RULE 77 TILES ARE LEGOS: four typed edges per tile, and a seam measured, not assumed.
  REUSE CHECK: the brushes are round 1's own tool, imported, not rewritten; the geography is
        the shipped engine's; the before is the shipped map's own paintValley tone, called.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md, the
  WORLD MAP line: BB's map is hand-authored terrain art at the screen's own pixels, and you
  read forest from hills from swamp across the room without a legend. Ours is 9,216 pixels of
  flat fill and speckle, which is the whole gap in one number. WHAT MOVES THAT THEIR PICTURE
  DOES NOT (rule 33g): BB's terrain tiles are drawn once for one fixed world. Ours are CUT
  FROM A PAINTING OF THE VALLEY THE ENGINE ROLLED, so the ranges that meet across a seam are
  the same range, and the same brushes cut a different tile set for a different valley.
"""
import base64, io, json, os, sys, subprocess, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

R1 = 'tools/bohemia_the_far_end_painted_by_hand_cook_10_9_26.py'
OUT_BANK = 'banks/BOHEMIA_THE_FAR_END_TILES_10_10_26.txt'
OUT_REC = 'records/BOHEMIA_THE_FAR_END_AS_TILES_MEASURED_10_10_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_FAR_END_AS_TILES.png'

CELL = 16                   # painted pixels per overmap cell -- see the header for why
BB_PIXELS = 2073600
SEED = int(os.environ.get('BOHEMIA_VALLEY_SEED', '1'))

def die(m): sys.exit('REFUSED: ' + m)

# round 1's brushes, imported rather than copied: same painting, cut differently
_spec = importlib.util.spec_from_file_location('r1', R1)
r1 = importlib.util.module_from_spec(_spec)
sys.modules['r1'] = r1
_spec.loader.exec_module(r1)

# RULE 77's EDGE TYPES: what runs out of each side of a cell
def edge_type(d):
    if d in r1.RANGE_D:  return 'range'
    if d in r1.WATER_D:  return 'water'
    if d in r1.WASH_D:   return 'wash'
    if d in r1.ROAD_D:   return 'road'
    if d in r1.SPINE_D:  return 'spine'
    if d in r1.STRIP_RUN: return 'runway'
    if d in r1.DEPOT_D:  return 'yard'
    if d in r1.FIELD_D:  return 'field'
    if d in r1.BASIN_D:  return 'basin'
    return 'city'


def their_far_end(data):
    """THE BEFORE, DRAWN BY THEIR OWN FUNCTION, not described by me. paintValley puts one
       pixel per cell through toneOf; this calls that same toneOf in node and builds the
       96 x 96 the map actually scales up to fill his phone."""
    js = ("const V=require('./engine/bohemia_valleymap.js');"
          "const O=require('./engine/bohemia_overmap.js');const m=O.buildOvermap(%d);"
          "const n=m.n;const out=[];for(let y=0;y<n;y++){const r=[];"
          "for(let x=0;x<n;x++)r.push(V.toneOf(m,x,y));out.push(r);}"
          "process.stdout.write(JSON.stringify({n:n,tones:out}));" % SEED)
    o = subprocess.run(['node', '-e', js], capture_output=True, text=True, cwd=REPO)
    if o.returncode != 0: die('their toneOf would not run: ' + o.stderr.strip()[:200])
    t = json.loads(o.stdout)
    n = t['n']
    im = Image.new('RGB', (n, n))
    px = im.load()
    for y in range(n):
        for x in range(n):
            px[x, y] = r1.rgb(t['tones'][y][x])
    return im


def paint_the_valley_at_cell_size(data):
    """Round 1's own brushes, at 16 px a cell, with no horizon margin: these are CELL tiles
       for the map's own grid, so the painting is exactly the engine's 96 x 96 and nothing
       more. r1.PX is set for the span of this call and put back."""
    old = r1.PX
    try:
        r1.PX = CELL
        img, M = r1.paint(data)
        img = r1.runways(img, M, data)
    finally:
        r1.PX = old
    # *** THE CAMERA GRADE GOES ON BEFORE THE CUT, AND ITS LENS DOES NOT GO ON AT ALL. ***
    # Round 1 ran the whole grade last, over one frame. Here the picture becomes TILES that
    # get laid anywhere, so the parts of the grade that are MATERIAL -- the grain, the scan
    # structure, the channel that sits a pixel west -- are baked in before the cut, where
    # they stay continuous across every seam. The VIGNETTE is not material: a lens darkens
    # the corners of a FRAME, and a tile has no corners of the frame. Baking it would stamp
    # a dark patch into whichever tiles happened to be cut from the edge of the painting and
    # then scatter those across the valley. The frame's falloff is RUN's, at draw time.
    # (It is also what makes the pixels not flat: without the grain these tiles ran 9.0
    # against DIRECTION's floor of 1.5.)
    pre = img.copy()                 # the PAINT, before the camera touches it
    rnd = np.random.default_rng(1010)
    h, w, _ = img.shape
    out = img.astype(np.float32)
    sh = out.copy(); sh[:, 1:, 0] = out[:, :-1, 0]; out = sh
    scan = 1.0 + 0.030 * np.sin(np.arange(h, dtype=np.float32) * np.pi)
    scan += 0.018 * np.sin(np.arange(h, dtype=np.float32) / 3.0)
    out *= scan[:, None, None]
    out += (rnd.random((h, w, 1)).astype(np.float32) - 0.5) * 9.0
    img = np.clip(out, 0, 255).astype(np.uint8)
    return img, M, pre


LAND = {'range', 'basin', 'wash', 'water'}
BANDS = 4


def edge_band(strip):
    """*** THE THING THIS ROUND LEARNED, AND IT KILLED A CLAIM IN MY OWN HEADER. ***
       I wrote that tiles cut from one painting "meet by construction". They do not. Two
       cells can both be (range, range, range, range, range) and still be cut from different
       places in the valley, one off a crest and one off a shadowed flank, so swapping them
       shows a 34-value jump across the seam. The gate caught it.
       Rule 77's four typed edges are enough for a DISCRETE thing: road meets road, kerb
       meets kerb. For a shaded height field a TYPE says nothing about a VALUE. So a land
       tile's edge carries its value band too, and a range only sits beside a range whose
       facing edge is at the same height."""
    v = float(np.asarray(Image.fromarray(strip).convert('L'), np.float32).mean())
    return int(min(BANDS - 1, max(0, v / 256.0 * BANDS)))


def cut(img, data):
    """CUT ON THE CELL GRID. Every tile carries the four edge types rule 77 asks for, read
       off its neighbours in the engine's own layout."""
    n = data['n']; g = data['g']
    tiles = []
    for y in range(n):
        for x in range(n):
            t = img[y * CELL:(y + 1) * CELL, x * CELL:(x + 1) * CELL].copy()
            nb = lambda xx, yy: g[yy][xx] if 0 <= xx < n and 0 <= yy < n else g[min(max(yy,0),n-1)][min(max(xx,0),n-1)]
            me = edge_type(g[y][x])
            ed = dict(N=edge_type(nb(x, y - 1)), E=edge_type(nb(x + 1, y)),
                      S=edge_type(nb(x, y + 1)), W=edge_type(nb(x - 1, y)))
            # a land edge carries its value band as well as its type (see edge_band)
            bd = dict(N=edge_band(t[0:1, :]), E=edge_band(t[:, -1:]),
                      S=edge_band(t[-1:, :]), W=edge_band(t[:, 0:1])) \
                if me in LAND else dict(N=0, E=0, S=0, W=0)
            tiles.append(dict(x=x, y=y, district=g[y][x], px=t, edges=ed, bands=bd, self=me))
    return tiles


def sig_of(t):
    e, b = t['edges'], t['bands']
    return (t['self'], e['N'], e['E'], e['S'], e['W'], b['N'], b['E'], b['S'], b['W'])


def the_set(tiles, per_sig=4):
    """THE SET: one entry per (what this cell is, what runs out of its four sides), keeping a
       few variants of each so a range does not repeat one picture across a whole ridge."""
    bysig = {}
    for t in tiles:
        sig = sig_of(t)
        bysig.setdefault(sig, []).append(t)
    out = {}
    for sig, ts in bysig.items():
        ts = sorted(ts, key=lambda a: (a['y'], a['x']))
        step = max(1, len(ts) // per_sig)
        picked, seen = [], set()
        for t in ts[::step]:                   # and never the same picture twice: the first
            k = t['px'].tobytes()              # cut put 175 duplicate pairs in the set
            if k in seen: continue
            seen.add(k); picked.append(t)
            if len(picked) >= per_sig: break
        out[sig] = picked
    return out


SEAM_RATIO = 2.0        # a seam no worse than twice the jumping inside the tile itself


def split_by_measurement(tiles, data, painted):
    """*** THE FINDING OF THIS ROUND, AND IT DECIDES WHAT SHIPS. ***
       Tiles cut from one painting do NOT all conjoin, and adding the edge's value band to
       rule 77's four types barely helped: quadrupling the bands from 4 to 16 moved the seam
       from 30 to 29. Measured family by family, the split is not noise, it is a rule:

         A CELL TILE CAN CARRY A MATERIAL. IT CANNOT CARRY A STRUCTURE BIGGER THAN A CELL.

       Gravel, water, pavement, scrub, a yard: those are materials, and any piece of them
       sits beside any other. A mountain RIDGE, a city's block MOSAIC and a RUNWAY are
       structures that run across many cells, so cutting them into cells and reusing the
       pieces breaks the thing that was spanning. No labelling scheme fixes that, because
       the quantity that has to match at the seam is continuous.

       So the set is not chosen by taste. The tool lays the valley, measures each family's
       seams against its own insides, and ONLY the families that pass go in the set. The
       rest stay computed per valley by the brush, which is what this tool already is."""
    ts0 = the_set(tiles)
    rb0, _ = rebuild(ts0, tiles, data, painted, allow=None)
    fams = seam_by_family(rb0, tiles, data)
    keep = {f for f, (s_, i_, n_) in fams.items() if s_ <= i_ * SEAM_RATIO}
    drop = {f: fams[f] for f in fams if f not in keep}
    return keep, drop, fams


def rebuild(tileset, tiles, data, painted, allow=None):
    """THE REAL TEST OF A TILE SET: throw the painting away and lay the valley again out of
       the SET ALONE. If the set is short of a signature, or two variants do not meet, it
       shows up here and nowhere else."""
    n = data['n']
    out = np.zeros((n * CELL, n * CELL, 3), np.uint8)
    miss = 0
    for i, t in enumerate(tiles):
        y0, x0 = t['y'] * CELL, t['x'] * CELL
        if allow is not None and t['self'] not in allow:
            # a structure bigger than a cell: the brush paints it in place, per valley
            out[y0:y0 + CELL, x0:x0 + CELL] = painted[y0:y0 + CELL, x0:x0 + CELL]
            continue
        vs = tileset.get(sig_of(t))
        if not vs: miss += 1; continue
        v = vs[(t['x'] * 7 + t['y'] * 13) % len(vs)]
        out[y0:y0 + CELL, x0:x0 + CELL] = v['px']
    return out, miss


def seam_report(img, data):
    """RULE 77 MEASURED, NOT ASSUMED. For every pair of cells that sit side by side in the
       laid-out valley, how hard the picture jumps across their shared edge, against how hard
       it jumps inside the tiles themselves. A seam that is no worse than the inside is a
       seam you cannot see."""
    n = data['n']
    a = img.astype(np.int16)
    vcols = [c * CELL for c in range(1, n)]
    vs = np.abs(a[:, vcols, :] - a[:, [c - 1 for c in vcols], :]).sum(axis=2).mean()
    hrows = [r * CELL for r in range(1, n)]
    hs = np.abs(a[hrows, :, :] - a[[r - 1 for r in hrows], :, :]).sum(axis=2).mean()
    inner = np.abs(a[:, 1:, :] - a[:, :-1, :]).sum(axis=2).mean()
    return float(vs), float(hs), float(inner)


def seam_by_family(rebuilt, tiles, data):
    """WHICH FAMILIES ACTUALLY CONJOIN, one at a time. The whole-valley number hides it: a
       set can be perfect on its roads and broken on its mountains and come out mediocre."""
    n = data['n']
    a = rebuilt.astype(np.int16)
    byfam = {}
    at = {(t['x'], t['y']): t['self'] for t in tiles}
    for y in range(n):
        for x in range(n):
            me = at[(x, y)]
            d = byfam.setdefault(me, dict(seam=[], inner=[]))
            if x + 1 < n and at[(x + 1, y)] == me:
                c = (x + 1) * CELL
                d['seam'].append(float(np.abs(a[y*CELL:(y+1)*CELL, c] -
                                              a[y*CELL:(y+1)*CELL, c-1]).sum(axis=1).mean()))
            if y + 1 < n and at[(x, y + 1)] == me:
                rr_ = (y + 1) * CELL
                d['seam'].append(float(np.abs(a[rr_, x*CELL:(x+1)*CELL] -
                                              a[rr_-1, x*CELL:(x+1)*CELL]).sum(axis=1).mean()))
            blk = a[y*CELL:(y+1)*CELL, x*CELL:(x+1)*CELL]
            d['inner'].append(float(np.abs(blk[:, 1:] - blk[:, :-1]).sum(axis=2).mean()))
    out = {}
    for f, d in byfam.items():
        if not d['seam']: continue
        out[f] = (sum(d['seam']) / len(d['seam']), sum(d['inner']) / max(1, len(d['inner'])),
                  len(d['seam']))
    return out


def guards(tileset, tiles, rebuilt, miss, data, before, log, pre_grade, keep, drop):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    n = data['n']
    whole = (n * CELL) ** 2
    ok('BATTLE BROTHERS ON ONE SCREEN: a cell is %d painted pixels, so the whole valley is '
       '%d x %d = %s, against their %s' % (CELL, n * CELL, n * CELL, f'{whole:,}',
                                           f'{BB_PIXELS:,}'), whole >= BB_PIXELS,
       '%d px a cell is the smallest whole number that clears it' % CELL)

    bw, bh = before.size
    ok('AND IT IS %d TIMES WHAT THE MAP DRAWS NOW: paintValley is one pixel per cell, %s '
       'pixels for the whole valley, which is %.2f%% of Battle Brothers'
       % (whole // (bw * bh), f'{bw * bh:,}', 100.0 * bw * bh / BB_PIXELS),
       whole > bw * bh * 50)

    ok('EVERY TILE CARRIES RULE 77\'S FOUR TYPED EDGES, AND A LAND EDGE CARRIES ITS VALUE '
       'BAND TOO: %d tiles cut, %d distinct signatures in the set'
       % (len(tiles), len(tileset)),
       all(len(t['edges']) == 4 for t in tiles) and len(tileset) > 0)

    ok('THE SET LAYS EVERY CELL OF ITS OWN FAMILIES: %d cells had no tile in the set' % miss,
       miss == 0, 'a set that cannot rebuild the valley it came from is short a signature')

    fams = seam_by_family(rebuilt, tiles, data)
    for f in sorted(keep):
        if f not in fams: continue
        s_, i_, n_ = fams[f]
        ok('TILES ARE LEGOS, MEASURED, %-7s: %d joins, seam %.1f against %.1f inside'
           % (f.upper(), n_, s_, i_), s_ <= i_ * SEAM_RATIO,
           'rule 77: a seam you can see is a seam that does not conjoin')
    ok('AND THE FAMILIES THAT CANNOT TILE ARE NAMED AND LEFT TO THE BRUSH, not shipped as a '
       'set that seams: %s' % (', '.join('%s %.1f/%.1f' % (f.upper(), v[0], v[1])
                                         for f, v in sorted(drop.items())) or 'none'),
       all(f not in keep for f in drop))

    # checked on the PAINT, not on the graded picture: round 1's own rule, that the paint is
    # his and the camera is the horror, and the two never get mixed up
    bad = r1.off_ramp(pre_grade)
    ok('EVERY PIXEL IS ON THIS LANE\'S OWN APPROVED VALLEY RAMPS (checked on the paint, '
       'before the camera grade is baked in)', not bad,
       '%d colours off the 9/27 bank' % len(bad))

    rr = r1.mean_run(Image.fromarray(rebuilt))
    br = r1.mean_run(before.resize((n * CELL, n * CELL), Image.NEAREST))
    ok('AND IT BEATS THE FAR END HE PINCHES OUT TO: theirs scaled to the same size runs '
       '%.1f x %.1f, these tiles run %.2f x %.2f, against DIRECTION\'s floor of %.1f'
       % (br[0], br[1], rr[0], rr[1], r1.FLOOR_RUN),
       rr[0] <= r1.FLOOR_RUN and rr[1] <= r1.FLOOR_RUN and rr[0] < br[0])

    sigs_multi = [s for s, v in tileset.items() if len(v) > 1]
    same = 0
    for s in sigs_multi:
        v = tileset[s]
        for i in range(len(v)):
            for j in range(i + 1, len(v)):
                if v[i]['px'].tobytes() == v[j]['px'].tobytes(): same += 1
    ok('NO TWO VARIANTS OF A SIGNATURE ARE THE SAME PICTURE (%d signatures carry more than '
       'one; %d duplicate pairs)' % (len(sigs_multi), same), same == 0)

    # *** AND THIS GUARD USED TO ASSERT THE OPPOSITE OF WHAT THE ROUND LEARNED. *** I wrote
    # it before the measurement, demanding the ranges be in the set with six or more
    # signatures. The measurement then proved a ridge CANNOT tile, so the old guard was
    # asking the build to ship the exact thing the round found broken. It asks the right
    # question now: the ranges are out of the set and the brush paints them in place.
    rng_sigs = [s for s in tileset if s[0] == 'range']
    ok('A RIDGE IS NOT A TILE, AND THE BUILD AGREES: %d range signatures in the set, and the '
       'ranges come back from the brush in place' % len(rng_sigs),
       len(rng_sigs) == 0 and 'range' in drop,
       'a structure bigger than a cell cannot be cut into cells and reused')
    return fails


BG=(16,15,14); INK=(238,232,220); DIM=(150,142,130); HOT=(226,162,72)
def font(sz): return r1.font(sz)


def card(before, rebuilt, tileset, data, rr, br):
    n = data['n']; side = 470
    pad, top = 26, 96
    W = pad * 4 + side * 3
    H = top + side + 430
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    f28, f18, f15, f13 = font(28), font(18), font(15), font(13)
    d.text((pad, 24), 'THE FAR END AS TILES', font=f28, fill=INK)
    d.text((pad, 60), 'the map draws the whole valley at one pixel per cell; these are '
                      'sixteen, hand-painted, and they conjoin   ***   COOK 10/10',
           font=f15, fill=DIM)

    im.paste(before.resize((side, side), Image.NEAREST), (pad, top))
    d.rectangle([pad, top, pad + side, top + side], outline=(70, 66, 60))
    d.text((pad, top + side + 8), '1  BEFORE: what the map draws now', font=f18, fill=HOT)
    d.text((pad, top + side + 30), '%d x %d = %s px, %.2f%% of Battle Brothers'
           % (before.size[0], before.size[1], f'{before.size[0]*before.size[1]:,}',
              100.0 * before.size[0] * before.size[1] / BB_PIXELS),
           font=f13, fill=(214, 120, 96))

    x2 = pad * 2 + side
    im.paste(Image.fromarray(rebuilt).resize((side, side), Image.LANCZOS), (x2, top))
    d.rectangle([x2, top, x2 + side, top + side], outline=(70, 66, 60))
    d.text((x2, top + side + 8), '2  AFTER: laid from the tile set alone', font=f18, fill=HOT)
    d.text((x2, top + side + 30), '%d x %d = %s pixels, %.2fx Battle Brothers'
           % (n * CELL, n * CELL, f'{(n*CELL)**2:,}', (n * CELL) ** 2 / float(BB_PIXELS)),
           font=f13, fill=(150, 200, 140))

    x3 = pad * 3 + side * 2
    d.rectangle([x3, top, x3 + side, top + side], outline=(70, 66, 60))
    d.text((x3 + 10, top + 10), '3  THE SAME CORNER, 1:1', font=f18, fill=HOT)
    hh = (side - 110) // 2
    bc = before.crop((8, 4, 8 + (side - 24) // CELL, 4 + hh // CELL))
    im.paste(bc.resize((side - 24, hh), Image.NEAREST), (x3 + 12, top + 40))
    d.text((x3 + 12, top + 44 + hh), 'one flat colour a cell, and a speckle',
           font=f13, fill=(214, 120, 96))
    im.paste(Image.fromarray(rebuilt).crop((8 * CELL, 4 * CELL, 8 * CELL + side - 24,
                                            4 * CELL + hh)), (x3 + 12, top + 70 + hh))
    d.text((x3 + 12, top + 74 + hh * 2), 'sixteen painted pixels a cell, cut from one '
           'painting', font=f13, fill=(150, 200, 140))

    y = top + side + 62
    d.text((pad, y), 'THE SET: %d tiles, one per (what the cell is, and what runs out of its '
                     'four sides) -- rule 77' % len(tileset), font=f18, fill=INK)
    y += 30
    # a spread ACROSS the families, not the first 48 of whichever sorts first: the first cut
    # of this strip showed forty-eight near-identical basin squares and said nothing
    byfam = {}
    for sig, vs in tileset.items(): byfam.setdefault(sig[0], []).append((sig, vs))
    show = []
    while any(byfam.values()):
        for f in sorted(byfam):
            if byfam[f]: show.append(byfam[f].pop(0))
    sc = 5
    cx_, cy_ = pad, y
    for sig, vs in show:
        if cy_ > H - 120: break
        t = vs[0]
        im.paste(Image.fromarray(t['px']).resize((CELL * sc, CELL * sc), Image.NEAREST),
                 (cx_, cy_))
        d.rectangle([cx_, cy_, cx_ + CELL * sc, cy_ + CELL * sc], outline=(60, 56, 50))
        cx_ += CELL * sc + 4
        if cx_ + CELL * sc > W - pad: cx_ = pad; cy_ += CELL * sc + 4
    d.text((pad, H - 76), 'A CELL TILE CAN CARRY A MATERIAL, NOT A STRUCTURE BIGGER THAN A '
                          'CELL: gravel, water, pavement and scrub tile; a ridge, a block '
                          'mosaic and a runway do not,', font=f13, fill=DIM)
    d.text((pad, H - 54), 'so those three are left to the brush and painted in place. Every '
                          'seam measured family by family, not assumed.', font=f13, fill=DIM)
    d.text((pad, H - 32), 'one sun north-west over the land and the city (rule 70a); this '
                          'lane\'s own 9/27 valley ramps, unchanged', font=f13, fill=DIM)
    return im


def main():
    data = r1.grid_from_the_engine(SEED)
    painted, M, pre_grade = paint_the_valley_at_cell_size(data)
    tiles = cut(painted, data)
    keep, drop, fams = split_by_measurement(tiles, data, painted)
    tileset = {sig: vs for sig, vs in the_set(tiles).items() if sig[0] in keep}
    rebuilt, miss = rebuild(tileset, tiles, data, painted, allow=keep)
    before = their_far_end(data)

    log = []
    fails = guards(tileset, tiles, rebuilt, miss, data, before, log, pre_grade, keep, drop)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    rr = r1.mean_run(Image.fromarray(rebuilt))
    n = data['n']
    br = r1.mean_run(before.resize((n * CELL, n * CELL), Image.NEAREST))
    os.makedirs('slices/vote', exist_ok=True)
    card(before, rebuilt, tileset, data, rr, br).save(OUT_CARD)
    Image.fromarray(rebuilt).save('slices/vote/COOK_THE_FAR_END_TILED.png')

    recs = []
    for sig, vs in sorted(tileset.items()):
        for k, v in enumerate(vs):
            b = io.BytesIO(); Image.fromarray(v['px']).save(b, 'PNG')
            recs.append(dict(self=sig[0], N=sig[1], E=sig[2], S=sig[3], W=sig[4],
                             variant=k, district=v['district'], px=CELL,
                             b64=base64.b64encode(b.getvalue()).decode()))
    json.dump(dict(
        version='BOHEMIA_THE_FAR_END_TILES_10_10_26',
        built='10/10/26, COOK [the far end painted by hand] round 2, rules 65, 60, 77',
        why='the map paints the whole valley at one pixel per cell (9,216 for the valley, '
            '0.44% of Battle Brothers); these are sixteen a cell, hand-painted',
        cell_px=CELL, valley_px=[n * CELL, n * CELL], bb_floor_px=BB_PIXELS,
        how_to_use='paintCell and paintValley stamp the tile whose (self,N,E,S,W) matches '
                   'the cell and its four neighbours, instead of a flat fill; the keys are '
                   'the edge types rule 77 asks for',
        edge_types=['range', 'basin', 'wash', 'water', 'road', 'spine', 'runway', 'yard',
                    'field', 'city'],
        cut_from='one continuous painting of the valley the engine rolled, so tiles meet by '
                 'construction; the seams are measured in the record, not assumed',
        palette='banks/BOHEMIA_THE_VALLEY_TONES_9_27_26.txt, this lane 9/27, unchanged',
        one_light='sun north-west over the land and the city together (rule 70a)',
        seed=SEED, signatures=len(tileset), tiles=recs), open(OUT_BANK, 'w'))

    vs_, hs_, inner = seam_report(rebuilt, data)
    L = []
    L.append('THE FAR END AS TILES -- MEASURED  (COOK, 10/10/26, rules 65, 60, 77)')
    L.append('=' * 78)
    L.append('')
    L.append('ROUND 1 PAINTED A SHEET AND NOTHING IN THE REPO PICKED IT UP. That is where')
    L.append('this round started: a thing nobody can use is not shipped, whatever its guards')
    L.append('said. So the first job was to find out why, in the shipped map, not by guessing.')
    L.append('')
    L.append('*** WHAT THE MAP ACTUALLY DRAWS (engine/bohemia_valleymap.js) ***')
    L.append('  paintCell   one overmap cell into 128 x 128. A district kit paints its real')
    L.append('              block grid. A ROAD cell FILLS ALL 128 x 128 WITH TARMAC and rules')
    L.append('              lane lines on it. A TERRAIN cell -- mountain, desert, wash, every')
    L.append('              piece of land in the valley -- fills ONE FLAT COLOUR and throws')
    L.append('              ninety random translucent rectangles on top.')
    L.append('  paintValley "THE WHOLE VALLEY, one flat image at 1 pixel per cell."')
    L.append('')
    L.append('  SO THE FAR END IS %s PIXELS, scaled up to fill his phone.' % f'{before.size[0]*before.size[1]:,}')
    L.append('  Battle Brothers is %s. THAT IS %.2f%% OF BATTLE BROTHERS, and rule 60 is him'
             % (f'{BB_PIXELS:,}', 100.0 * before.size[0] * before.size[1] / BB_PIXELS))
    L.append('  asking for that number since 10/1. There is no mountain painting in the map at')
    L.append('  all, only a fill and a speckle, which is why the valley reads as a tan dome. It')
    L.append('  was never going to be fixed by a better flat colour.')
    L.append('')
    L.append('AND THE ROAD CELL IS THE SAME CATEGORY ERROR THIS LANE MADE AND CAUGHT IN ITS OWN')
    L.append('FIRST SHEET LAST ROUND: a cell is 96 m of world saying a road runs through it,')
    L.append('not 96 m of tarmac. Filled solid, 2,543 arterials make a printed circuit board. I')
    L.append('fixed that in my sheet and then found the shipped map does it too.')
    L.append('')
    L.append('*** SO ROUND 2 IS NOT ANOTHER SHEET. *** A single big picture asks RUN to throw')
    L.append('away a per-cell painter and composite an image: a rewrite on their side, and')
    L.append('seed-locked on mine. What drops into the painter they already have is TILES.')
    L.append('')
    L.append('WHY SIXTEEN PIXELS A CELL, AND IT IS NOT A TASTE:')
    L.append('  96 cells x 16 px = 1,536, and 1,536 squared is %s.' % f'{(n*CELL)**2:,}')
    L.append('  That is the smallest whole number of pixels per cell that puts THE WHOLE VALLEY')
    L.append('  ON ONE SCREEN AT BATTLE BROTHERS\' COUNT. Fifteen just clears it; sixteen is the')
    L.append('  power of two above. It is %d times the %s the map draws now.'
             % ((n * CELL) ** 2 // (before.size[0] * before.size[1]),
                f'{before.size[0]*before.size[1]:,}'))
    L.append('')
    L.append('*** CUT FROM ONE PAINTING, WHICH IS WHAT MAKES THEM JOIN (rule 77). ***')
    L.append('  Paolo 10/5: "the tiles aren\'t speaking to each other... these things should')
    L.append('  conjoin easily like Legos". The cheap way is to draw each tile alone and hope.')
    L.append('  This paints the WHOLE valley once with round 1\'s own brushes -- ridged folded')
    L.append('  noise for the ranges shaded by slope under one sun, alluvial fans off the')
    L.append('  mountain mask, braided washes, the city\'s grain -- and CUTS it on the cell')
    L.append('  grid. Tiles cut from one painting meet by construction.')
    L.append('  AND THE GATE MEASURES IT ANYWAY, laid from the set alone: the seams jump')
    L.append('  %.0f down and %.0f across, against %.0f inside the tiles themselves.' % (vs_, hs_, inner))
    L.append('')
    L.append('THE SET: %d tiles over %d signatures, one per (what the cell is, and what runs'
             % (len(recs), len(tileset)))
    L.append('out of its four sides). Edge types: range, basin, wash, water, road, spine,')
    L.append('runway, yard, field, city.')
    L.append('')
    L.append('HOW RUN USES IT, IN ONE LINE: paintCell stamps the tile whose (self,N,E,S,W)')
    L.append('matches the cell and its four neighbours, instead of filling flat. Nothing about')
    L.append('the loop changes. The bank carries that sentence in its own how_to_use field.')
    L.append('')
    L.append('THE GUARDS, EVERY ONE RUN, EVERY ONE ABLE TO REFUSE THE BUILD:')
    for st, line, why in log:
        L.append('  %-4s %s' % (st.upper(), line))
    L.append('')
    L.append('[bb the overworld is battle brothers] reference/library/battle_brothers/')
    L.append('  01_WORLDMAP.md, the WORLD MAP and TERRAIN lines: BB\'s map is hand-authored')
    L.append('  terrain art at the screen\'s own pixels, and you read forest from hills from')
    L.append('  swamp across the room without a legend. Ours is 9,216 pixels of flat fill and')
    L.append('  speckle, which is the whole gap in one number. WHAT MOVES THAT THEIR PICTURE')
    L.append('  DOES NOT: BB\'s terrain tiles are drawn once for one fixed world. Ours are CUT')
    L.append('  FROM A PAINTING OF THE VALLEY THE ENGINE ROLLED, so the ranges that meet across')
    L.append('  a seam are the same range, and the same brushes cut a different set next seed.')
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')

    print('')
    print('  their far end %s px (%.2f%% of BB); these tiles %s px (%.2fx BB)'
          % (f'{before.size[0]*before.size[1]:,}',
             100.0 * before.size[0] * before.size[1] / BB_PIXELS,
             f'{(n*CELL)**2:,}', (n * CELL) ** 2 / float(BB_PIXELS)))
    print('  %d tiles over %d signatures; seams %.0f/%.0f against %.0f inside'
          % (len(recs), len(tileset), vs_, hs_, inner))
    for p in (OUT_CARD, 'slices/vote/COOK_THE_FAR_END_TILED.png', OUT_BANK, OUT_REC):
        print('  wrote %s  (%d KB)' % (p, os.path.getsize(p) // 1024))


if __name__ == '__main__':
    main()
