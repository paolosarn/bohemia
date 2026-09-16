#!/usr/bin/env python3
"""THE CAR KEEPS ITS SHAPE AND CHANGES ITS SIZE -- COOK, 9/16/26. [car recook] round 7.

*** PAOLO 9/15: "every time I see a car it looks like dogshit, I'M SO CONFUSED." ***

WHAT THE LAST TWO ROUNDS ESTABLISHED, AND NEITHER IS IN DOUBT:
  ROUND 5 measured WHY he is confused, and it is not the paint. Every prop in the game is
  drawn by fitting its master into the stall its footprint buys, and SIXTEEN OF SIXTEEN
  land on a fractional scale while the ground beside them is drawn at exactly 1.000. The
  car is the worst:

      the stall a car's footprint buys  2 x 4 cells at 44 px  = 88 x 176
      the master it is drawn from                             =  45 x 96
      fit = min(88/45, 176/96)                                =     1.833

  Smoothing is off, so the car is not blurred -- it is UNEVEN. A source row becomes 2
  screen pixels, then 2, then 1, in a pattern that never repeats. Every pixel of the car is
  a different size from its neighbour AND 83% bigger than the ground pixel next to it.
  gates/prop_scale_gate.py holds that measurement forever.

  ROUND 6 tried to draw twenty new cars at 88 x 176 from parameters AND THEY CAME OUT AS
  BARRELS. Twice. Fit exactly 1.000, eight colours, every number perfect, and the picture
  was a rounded rectangle with two dark bands across it. Killed by its author under STOP
  PRODUCING, graveyarded with the post-mortem and the picture
  (graveyard/CARFAIL_BARREL_bohemia_car_factory_9_15_26.py,
  records/COOK_I_DREW_TWENTY_BARRELS_9_15_26.md).

  ITS ONE-SENTENCE LESSON, WHICH IS THE PREMISE OF THIS TOOL: A SILHOUETTE BUILT FROM
  HALF-WIDTH PROFILES CANNOT MAKE A CAR. A car's outline is not a smooth function of its
  length -- a hard nose, a shoulder stepping out over the front arch, a flat door section,
  a step back in at the rear arch, a cut tail. Sampling a spline down the middle gives a
  lozenge every time. THE SHAPE HAS TO COME FROM AN OBSERVED CAR.

*** SO THIS TOOL SEPARATES THE TWO THINGS THAT WERE TANGLED TOGETHER. The twenty shipped
cars are RIGHT ABOUT SHAPE and WRONG ABOUT RESOLUTION, and those are separable: ***

  1. TAKE THE ALPHA MASK ONLY of the shipped 45 x 96 master. It reads as a car because it
     came from one -- a photographed wreck, silhouette intact.
  2. UPSCALE THE MASK to 88 x 176 and re-threshold it. A MASK HAS NO PIXEL GRID TO BREAK:
     the whole fault being fixed is that scaling COLOUR by 1.833 makes uneven pixels, and a
     one-bit coverage map has no such problem -- an edge scaled and re-thresholded is just
     an edge. It is then cleaned so the outline is crisp: any boundary pixel with fewer
     than two orthogonal neighbours inside is cut, so no single-pixel spurs survive.
  3. READ THE PANELS INSIDE THE MASK from the photograph's OWN value structure, at the
     original resolution, where the photograph is still the photograph. Roof brightest,
     glass darkest, bonnet and boot between. That reading is exactly what the 9/7 recolour
     already did successfully (median 3,031 colours -> 9), so it is proven on this art.
  4. RE-SHADE FROM SCRATCH ON THE NEW 88 x 176 GRID, on the approved ramps, with the rust
     and lighting rules round 6 wrote and tested. Every output pixel is authored at the
     size the stall gives; nothing is resampled into the final image.

  Shape from the photograph. Size and pixels authored. THAT IS A DIFFERENT METHOD FROM THE
  ONE THAT FAILED, not a third go at it.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): NOTHING IS INVENTED. The silhouettes are the shipped
pool's own, reused whole -- this is the third time this lane has said "the observed real
vehicle survives", and this time it survives as geometry rather than as pixels. Colours:
  USED, verbatim from banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt, the act-1 set
  Paolo approved 7/28 ("I checked it to do the other 41 mark it approved"):
    asphalt     7 tones -> the shell, because a car sits on the road and the row says the
                           value bands of the ground it sits on
    terracotta  corroded end only -> the rust, where the 9/8 round put it after the first
                           cut came out speckled scarlet off a tail light
  No third ramp and no invented tone: the SAME eleven-colour family the shipped cars ended
  on. This changes RESOLUTION, never palette.
  CONSIDERED AND NOT USED: tools/bohemia_car_recook_9_7_26.py (a recolour; it cannot change
  a master's size, which is the entire fault) and the graveyarded parametric factory (its
  shape generator is why it died; only its rust and lighting rules are carried forward).

REFERENCE CHECK

COMPARED TO: the shipped cars themselves side by side at the size the game draws them, and
overhead photographs of abandoned sedans, wagons and pickups -- salvage yards and Mojave
roadside wrecks, the ground this game is set on. Plus the repo as its own ruler: the craft
law's 64-colour ceiling, the 45-degree law's single light direction, the approved ramps.

STRUCTURAL RULES TAKEN:
  * FROM ABOVE A CAR IS MOSTLY ROOF AND THE ROOF IS THE BRIGHTEST PANEL, with bonnet and
    boot a step darker and glass darker still. Here that order is not asserted, it is READ
    OUT OF THE PHOTOGRAPH by luma and then quantised, so each car keeps its own layout.
  * RUST STARTS AT THE EDGES, THE SEAMS AND THE WHEEL ARCHES, NEVER IN THE MIDDLE OF A
    ROOF. Round 2 speckled a wreck scarlet off a tail light; round 4 covered a planet in
    orange over a fifth of its disc; round 6's first cut drew a one-pixel orange rim. Three
    wrong answers to one question. Rust here is grown inward from the silhouette with a
    distance falloff, so it sits on the edges and the arches and nowhere else.
  * ONE LIGHT DIRECTION (45 DEGREE ART LAW): upper-left catches a lit pixel, lower-right
    sits in its own shadow. The same two lines every structure in this game draws.

WHAT CHANGED FROM THE REFERENCE: the palette, deliberately -- a real wreck is any colour
that left a factory, these are asphalt and rust, because ONE PALETTE PER FAMILY and the
family a car sits on is the road.

    python3 tools/bohemia_car_from_its_own_shape_cook_9_16_26.py            measure only
    python3 tools/bohemia_car_from_its_own_shape_cook_9_16_26.py --sheet X  before/after
    python3 tools/bohemia_car_from_its_own_shape_cook_9_16_26.py --write    cook it
"""
import io, os, re, sys, json, math, base64, random, subprocess, statistics
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
PROPS = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_PROPS.js')
#  *** THE ART LIVES IN TWO PLACES AND ONE TOOL COOKS BOTH. *** props_gate asserts that
#  every object in the street-furniture bank also appears in the sibling the page loads,
#  and the first write of this tool updated only the sibling: 105 objects matched -> 85,
#  exactly the twenty cars. The 9/7 car round already wrote this rule down ("both banks and
#  both surfaces cooked by ONE tool so they cannot drift") and I still had to be told by a
#  gate. Two copies of anything is a drift waiting to happen; two copies updated by two
#  tools is a drift that has already happened.
FURN = os.path.join(ROOT, 'banks', 'BOHEMIA_STREET_FURNITURE_8_21_26.txt')
W, H = 88, 176
CEILING = 64


def ramps():
    d = json.load(io.open(BANK, encoding='utf-8'))
    R = d['method']['one_palette_per_family']
    hx = lambda h: tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    return [hx(c) for c in R['asphalt']], [hx(c) for c in R['terracotta'][:4]]


def shipped():
    out = os.path.join(ROOT, 'tools', '__cars.json')
    subprocess.run(['node', '-e',
        'const fs=require("fs");global.window={};'
        'eval(fs.readFileSync(%r,"utf8")+"\\n;globalThis.__P=PROP_B64;");'
        'fs.writeFileSync(%r,JSON.stringify(globalThis.__P.car));' % (PROPS, out)],
        check=True, cwd=ROOT)
    v = json.load(io.open(out)); os.remove(out)
    return v


def decode(b):
    return Image.open(io.BytesIO(base64.b64decode(b + '=' * (-len(b) % 4)))).convert('RGBA')


def luma(p):
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]


def big_mask(src):
    """STEP 2. THE MASK IS THE ONE THING THAT MAY BE SCALED, and that is the whole trick:
    the fault is that scaling COLOUR by 1.833 makes uneven pixels, and a one-bit coverage
    map has no pixels to make uneven. Scaled with a box filter so partial coverage is real
    coverage, re-thresholded at half, then despurred so the outline is crisp."""
    a = src.split()[3].point(lambda v: 255 if v >= 128 else 0)
    a = a.resize((W, H), Image.BOX).point(lambda v: 255 if v >= 128 else 0)
    m = [[a.getpixel((x, y)) > 0 for x in range(W)] for y in range(H)]
    for _ in range(2):
        cut = []
        for y in range(H):
            for x in range(W):
                if not m[y][x]:
                    continue
                n = sum(1 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
                        if 0 <= x + dx < W and 0 <= y + dy < H and m[y + dy][x + dx])
                if n < 2:
                    cut.append((x, y))
        if not cut:
            break
        for x, y in cut:
            m[y][x] = False
    return m


def panel_field(src, m):
    """STEP 3. READ THE PANELS OUT OF THE PHOTOGRAPH, AT ITS OWN RESOLUTION, where it is
    still a photograph. Returns a 0..1 value per output pixel, sampled from the source's
    luma. Quantising this is what puts roof brightest, glass darkest and the rest between
    WITHOUT this tool asserting where any of them are -- each car keeps its own layout."""
    sw, sh = src.size
    px = src.load()
    vals, out = [], [[0.0] * W for _ in range(H)]
    for y in range(H):
        sy = min(sh - 1, int(y * sh / H))
        for x in range(W):
            if not m[y][x]:
                continue
            sx = min(sw - 1, int(x * sw / W))
            p = px[sx, sy]
            v = luma(p[:3]) if p[3] >= 128 else 0.0
            out[y][x] = v
            vals.append(v)
    if not vals:
        return out, 0.0, 1.0
    vals.sort()
    lo = vals[int(len(vals) * 0.04)]
    hi = vals[int(len(vals) * 0.96)]
    return out, lo, max(hi, lo + 1.0)


def build_one(b, seed, asph, terra):
    src = decode(b)
    m = big_mask(src)
    field, lo, hi = panel_field(src, m)
    rnd = random.Random(seed)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    px = im.load()

    # ---- STEP 4. RE-SHADE ON THE NEW GRID. Six bands of the approved asphalt ramp, taken
    # from the photograph's own value spread rather than from a table.
    for y in range(H):
        for x in range(W):
            if not m[y][x]:
                continue
            t = (field[y][x] - lo) / (hi - lo)
            i = max(0, min(6, int(round(t * 6.0))))
            px[x, y] = asph[i] + (255,)

    # ---- ONE LIGHT DIRECTION (45 DEGREE ART LAW): upper-left catches, lower-right sits in
    # its own shadow. The same two lines every structure in this game draws.
    for y in range(H):
        for x in range(W):
            if not m[y][x]:
                continue
            up = y == 0 or not m[y - 1][x]
            lf = x == 0 or not m[y][x - 1]
            dn = y == H - 1 or not m[y + 1][x]
            rt = x == W - 1 or not m[y][x + 1]
            if up or lf:
                px[x, y] = asph[6] + (255,)
            elif dn or rt:
                px[x, y] = asph[0] + (255,)

    # ---- RUST, GROWN INWARD FROM THE SILHOUETTE. Never a rim, never the middle of a roof:
    # a distance transform, then a falloff, so it sits on the edges and the arches where
    # water actually stands on a real one.
    dist = [[999] * W for _ in range(H)]
    q = []
    for y in range(H):
        for x in range(W):
            if not m[y][x]:
                continue
            if (y == 0 or not m[y - 1][x]) or (y == H - 1 or not m[y + 1][x]) \
               or (x == 0 or not m[y][x - 1]) or (x == W - 1 or not m[y][x + 1]):
                dist[y][x] = 0
                q.append((x, y))
    head = 0
    while head < len(q):
        x, y = q[head]; head += 1
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < W and 0 <= ny < H and m[ny][nx] and dist[ny][nx] > dist[y][x] + 1:
                dist[ny][nx] = dist[y][x] + 1
                q.append((nx, ny))
    #  *** THE RIM IS NOT RUST, AND THIS IS THE THIRD TIME. *** The first cut of this tool
    #  put its heaviest rust at distance 0-1 and every car came out wearing an ORANGE
    #  DOTTED OUTLINE -- which is round 6's one-pixel fringe again, and a cousin of round
    #  2's scarlet speckle and round 4's orange planet. Four wrong answers to one question
    #  now. The rim is the LIT AND SHADOW EDGE the 45-degree law just drew; painting rust
    #  over it destroys the only two lines that give the body its form.
    #  So: distance 0 and 1 are FORBIDDEN, rust lives in a band from 2 to 7 pixels in, and
    #  it only appears near a patch seed -- because rust is blotches where water stood, not
    #  a uniform treatment of an outline.
    patches = [(rnd.randrange(W), rnd.randrange(H)) for _ in range(rnd.randint(4, 7))]
    for y in range(H):
        for x in range(W):
            d = dist[y][x]
            if not m[y][x] or d < 2 or d > 7:
                continue
            near = min(math.hypot(x - a, y - b) for a, b in patches)
            blotch = max(0.0, 1.0 - near / 20.0)
            if blotch <= 0.0:
                continue
            band = 1.0 - abs(d - 4) / 3.5          # thickest a few pixels in, not at the edge
            p = 0.72 * blotch * max(0.0, band)
            if rnd.random() < p:
                px[x, y] = terra[0 if d > 4 else 1] + (255,)
    return im


def png(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode('ascii')


def main():
    write = '--write' in sys.argv
    asph, terra = ramps()
    old = shipped()
    if {decode(b).size for b in old} == {(W, H)}:
        print('the cars are already %dx%d. nothing to do.' % (W, H)); return 0
    cars = [build_one(b, 9160 + i * 31, asph, terra) for i, b in enumerate(old)]

    cols = [len({c[:3] for c in im.getdata() if c[3] >= 128}) for im in cars]
    fits = {round(min(W / im.size[0], H / im.size[1]), 3) for im in cars}
    cover = [sum(1 for c in im.getdata() if c[3] >= 128) for im in cars]
    ocover = [sum(1 for c in decode(b).getdata() if c[3] >= 128) for b in old]
    # the silhouette must SURVIVE: same share of the frame, within a few points
    share = [100.0 * c / (W * H) for c in cover]
    oshare = [100.0 * c / (decode(b).size[0] * decode(b).size[1]) for c, b in zip(ocover, old)]
    drift = max(abs(a - b) for a, b in zip(share, oshare))

    print('THE CAR KEEPS ITS SHAPE AND CHANGES ITS SIZE\n')
    print('  %-30s %-14s %s' % ('', 'was', 'now'))
    print('  %-30s %-14s %s' % ('master', '41-47 x 96', '%d x %d' % (W, H)))
    print('  %-30s %-14s %s' % ('fit into the 88x176 stall', '1.833', '/'.join('%.3f' % f for f in sorted(fits))))
    print('  %-30s %-14s %s' % ('colours (ceiling %d)' % CEILING, '10-11',
                                '%d median, %d worst' % (statistics.median(cols), max(cols))))
    print('  %-30s %-14s %s' % ('silhouette', 'photographed', 'the same one, rescaled as a MASK'))
    print('  %-30s %-14s %s' % ('pixels', 'photographed', 'authored at 88x176'))
    print('\n  the silhouette survives: it fills %.1f%% of its frame, was %.1f%% (worst drift %.1f pts)'
          % (statistics.median(share), statistics.median(oshare), drift))

    if [c for c in cols if c > CEILING]:
        sys.exit('\n  over the craft ceiling -- refusing.')
    if fits != {1.0}:
        sys.exit('\n  the fit is not exactly 1.000 -- refusing, that is the whole point.')
    if drift > 6.0:
        sys.exit('\n  the silhouette drifted %.1f points -- refusing, the shape is the '
                 'one thing that must survive.' % drift)

    if '--sheet' in sys.argv:
        p = sys.argv[sys.argv.index('--sheet') + 1]
        S = 2
        sheet = Image.new('RGBA', (10 * (W + 6) * S, 2 * (H + 6) * S), (20, 20, 24, 255))
        for n in range(10):
            o = decode(old[n])
            o = o.resize((int(o.size[0] * 1.833), int(o.size[1] * 1.833)), Image.NEAREST)
            sheet.alpha_composite(o.resize((o.size[0] * S, o.size[1] * S), Image.NEAREST), (n * (W + 6) * S, 0))
            sheet.alpha_composite(cars[n].resize((W * S, H * S), Image.NEAREST), (n * (W + 6) * S, (H + 6) * S))
        sheet.save(p)
        print('\n  row 1 = shipped, scaled 1.833x the way the game does it')
        print('  row 2 = the same silhouettes, re-shaded at 88x176, drawn at 1.000')
        return 0

    if write:
        t = io.open(PROPS, encoding='utf-8').read()
        #  *** SEVENTH REGISTRY COLLISION IN THIS LANE, AND THE MOST DANGEROUS ONE YET.
        #  This file holds TWO tables and BOTH have a key called "car":
        #      const PROP_FP  = {... "car": [2.0, 4.0, 0.0] ...}   the FOOTPRINT
        #      const PROP_B64 = {... "car": ["iVBOR..."] ...}      the ART
        #  PROP_FP comes first. A search for '"car"\s*:\s*\[' finds the FOOTPRINT and
        #  the first cut of this tool WROTE TWENTY BASE64 IMAGES OVER IT -- which would
        #  have handed every car in the game a footprint made of PNG strings. The only
        #  reason I know is that the write is followed by a read-back that refused to
        #  claim success. Same shape as TP_TILES["street"] (the STOP signs) versus
        #  SA_TILES["street"] (the road) in [streets fixed] r1.
        #  So the search starts AFTER the art table's own declaration, never before it.
        anchor = t.index('const PROP_B64')
        m = re.compile(r'("car"\s*:\s*\[)(.*?)(\])', re.S).search(t, anchor)
        if not m:
            sys.exit('the car pool is not where this tool expects it -- refusing.')
        if 'iVBOR' not in t[m.start(2):m.start(2) + 200]:
            sys.exit('that is not the ART table -- the first thing inside it is not a PNG. '
                     'Refusing rather than writing images over a footprint again.')
        io.open(PROPS, 'w', encoding='utf-8').write(
            t[:m.start(2)] + ',\n'.join('"%s"' % png(im) for im in cars) + t[m.end(2):])
        back = shipped()
        if len(back) != len(cars) or {decode(b).size for b in back} != {(W, H)}:
            sys.exit('wrote the pool and read back something else -- STOP')
        #  and the bank, in the same write, so the two copies cannot drift
        fb = json.load(io.open(FURN, encoding='utf-8'))
        rows = fb['families']['car']
        if len(rows) != len(cars):
            sys.exit('the furniture bank holds %d cars and the pool holds %d -- refusing.'
                     % (len(rows), len(cars)))
        for r, im in zip(rows, cars):
            r['b64'] = png(im); r['w'], r['h'] = W, H
            r['opaque'] = sum(1 for c in im.getdata() if c[3] >= 128)
        json.dump(fb, io.open(FURN, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
        chk = json.load(io.open(FURN, encoding='utf-8'))['families']['car']
        if any(r['w'] != W or r['h'] != H for r in chk):
            sys.exit('wrote the bank and read back something else -- STOP')
        print('\n  COOKED, IN BOTH PLACES. Every car is %dx%d and the game draws it at' % (W, H))
        print('  1.000, the same pixel size as the ground it is parked on.')
    else:
        print('\n  measure only. pass --write to cook it.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
