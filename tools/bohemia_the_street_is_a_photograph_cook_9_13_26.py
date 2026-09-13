#!/usr/bin/env python3
"""THE STREET IS A PHOTOGRAPH -- COOK, 9/13/26. [streets fixed], round 1.

*** PAOLO 9/13, HAVING PLAYED THE DEMO ON HIS PHONE: "it looks like shit... THE STREETS
DON'T LOOK LIKE STREETS... glitchy, buggy, nothing's complete... I would like to see [the
tiny parts] come more together." *** THE FIVE MINUTES (rule 14, LOCKED) makes the demo's
first five minutes the only measure of the game, and the street is this lane's first line.

RULE 12 SAYS MEASURE FIRST. I rendered the walked city at phone size (390x844, device
scale 3), dismissed the opening modal the way he would, and read the canvas:

    427 distinct colours on one 378x787 screen

Then I asked the art, which is the measurement that counts. THE CRAFT LAW CEILING IS 64
COLOURS IN ONE TILE (gates/pixel_craft_gate.py). SA_TILES, chunk 1 of the bank, holds every
ground tile the walked city stands on:

    pool        tiles   size   median colours   worst   over the ceiling
    street         18  44x44            1,235   1,478      18   100%
    side           36  44x44            1,485   1,626      36   100%
    lane_h/v        4  44x44            1,031   1,077       4   100%
    median_h/v      6  44x44            1,131   1,171       6   100%
    cross_ns/ew     6  44x44            1,083   1,122       6   100%
    shoulder        4  16x16              248     255       4   100%
    ---------------------------------------------------------------------
    THE WHOLE STREET  74                                   74   100%

*** SEVENTY-FOUR TILES MAKE EVERY STREET IN THE GAME AND EVERY ONE OF THEM IS A
PHOTOGRAPH. The road he stands on is 19 TIMES over the ceiling and the sidewalk beside it
is 23 TIMES over, while the person standing on both is drawn in six tones. That is two
worlds in one frame, and it is the exact sentence this lane already wrote on 9/7 about the
CARS: median 3,031 colours down to 9. The same disease was in the ground the whole time,
over far more of his screen than the cars ever covered. ***

*** THE REGISTRY MISTAKE THAT NEARLY SHIPPED, WRITTEN DOWN SO IT CANNOT HAPPEN AGAIN.
The first version of this tool measured TP_TILES["street"] and found 97 tiles, 536 median
colours, 100% over the ceiling -- clean, consistent, and completely wrong. TP_TILES["street"]
is STREET FURNITURE: the STOP sign, KEEP OUT, the warning triangles, the traffic signal,
the cones. The road is SA_TILES["street"], a different container in the same bank with the
SAME KEY NAME. The cook was one flag away from turning every road sign in the game grey,
and the only thing that caught it was rendering a before/after sheet and LOOKING at it.
A clean measurement from the wrong registry looks exactly like a fact. So this tool parses
the SA_TILES object literal by brace-matching and JSON, never by "nearest key above", and
it names its container in every line it prints. ***

THE METHOD IS HIS AND IT IS UNCHANGED (Paolo 7/28, verbatim, in
banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt):

    "every pixel snapped to the family ramp by value, then orphans absorbed"
    "accents: up to two per tile, taken from that tile's OWN out-of-range pixels"

ONE PALETTE PER FAMILY, out of that same approved bank, so no tone here is a choice of
taste: asphalt 7, concrete 7, ground 7.

WHICH FAMILY EACH POOL TAKES IS THE MATERIAL, NOT A PREFERENCE:
    street, lane_*, cross_*, median_*  -> asphalt    a road is asphalt
    side                               -> concrete   a sidewalk is concrete
    shoulder                           -> ground     the shoulder is hardpan

*** TWO ACCENTS, AND THE SECOND ONE IS WHY THE STREET SURVIVES THIS.
"Up to two per tile, taken from that tile's OWN out-of-range pixels" -- OUT OF RANGE MEANS
OUTSIDE THE RAMP, and a pixel can leave the ramp in two directions:

  1. OUT OF RANGE IN COLOUR. The weeds in the sidewalk cracks and the rust on the median
     are far more saturated than any asphalt or concrete tone. Taken at the 90th percentile
     of the loud pixels, NEVER at the single loudest -- the car round paid for that lesson
     when one wreck came out speckled scarlet off a tail light.
  2. OUT OF RANGE IN VALUE. The asphalt ramp tops out at luminance 96 and LANE PAINT IS
     WHITE. Snapping by value alone would crush every lane line, every crosswalk stripe and
     every stop bar into the top asphalt tone, and a road with no markings on it is
     LITERALLY WHY HE SAYS THE STREETS DON'T LOOK LIKE STREETS. So a population sitting
     well above the ramp top, big enough to be a mark and not noise, keeps its own tone.

PIXELS TRAVEL IN GROUPS, so an accent cluster under four pixels goes back to the ramp.
Without that floor a tile scores clean and looks like static. (Paolo's DESERT DOMINANCE
ruling, 7/14: accents in coherent clusters, never a per-cell shuffle.)

REUSE CHECK (REUSE-FIRST, Paolo 7/22): swept every ground bank in banks/ and every ramp
already shipped before defining a single tone. USED, not re-invented:
banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt -- the act-1 recook Paolo approved on
7/28 ("I checked it to do the other 41 mark it approved"), read at method.one_palette_per_family
and opened by ramp_of() below. Its asphalt, concrete and ground ramps ARE the palette here;
this tool invents no colour of its own and could not, because every output pixel is either a
tone straight out of that bank or a pixel the tile already contained. The tile art itself is
reused whole -- shape, cracks, weeds, paint, stripes, pixel for pixel. Nothing new is drawn.
CONSIDERED AND NOT USED: banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt (wall skins, wrong
material), the interior floor pool cooked 8/26 (indoor floors, not street), and the tileform
ground pools in slices/BOHEMIA_CITY_TILEFORMS.js (already inside the ceiling, nothing to fix).

REFERENCE CHECK

COMPARED TO: TG-05 (the lot tile -- "a commercial lot tile is STRIPED ASPHALT with
seal-coat patches and stop bars, the most readable man-made ground"), TG-03 (the yard tile
-- "a Vegas yard is GRAVEL OR HARDPAN inside a block wall, no lawn in act 1"), CGRD-03 (a
Vegas block from the air -- "the ground alphabet is HOUSE / YARD / STREET / LOT and almost
nothing else"), and the approved act-1 starter tileset, which is the repo being its own
ruler.

STRUCTURAL RULES TAKEN:
  * TG-05 puts the MARKINGS at the centre of what makes man-made ground readable -- stripes
    and stop bars, named before texture. That is the whole argument for the value accent
    above, and it is why this cook protects paint instead of averaging it away.
  * TG-05 and TG-03 both describe ground as A FEW MATERIALS IN VALUE BANDS, not a
    continuous photographic surface. A 1,485-colour sidewalk is not a material, it is a
    photograph of one, and it cannot sit under a body drawn in six tones.
  * CGRD-03 -- the ground alphabet is short. Snapping six pools onto three approved family
    ramps IS that alphabet, enforced.

WHAT CHANGED FROM THE REFERENCE: nothing in structure. This is a RE-COLOUR, not a re-draw.
Every tile keeps its own cracks, its own weeds, its own lane paint, its own stripes, pixel
for pixel. Only the palette collapses onto the family ramp it should always have been on.
The observed real surface survives; the photograph does not.

    python3 tools/bohemia_the_street_is_a_photograph_cook_9_13_26.py            measure only
    python3 tools/bohemia_the_street_is_a_photograph_cook_9_13_26.py --write    cook it
    python3 tools/bohemia_the_street_is_a_photograph_cook_9_13_26.py --sheet X  before/after png
"""
import re, io, os, sys, json, base64, statistics
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
CHUNK = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_TILES_01.js')
DECL = 'const SA_TILES='
CEILING = 64

# the material each pool is made of. SA_TILES, not TP_TILES -- read the docstring.
FAMILY_OF = {'street': 'asphalt', 'lane_h': 'asphalt', 'lane_v': 'asphalt',
             'cross_ns': 'asphalt', 'cross_ew': 'asphalt',
             'median_h': 'asphalt', 'median_v': 'asphalt',
             'side': 'concrete', 'shoulder': 'ground'}


def hexrgb(h):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


_RAMPS = None
def ramp_of(family):
    global _RAMPS
    if _RAMPS is None:
        d = json.load(io.open(BANK, encoding='utf-8'))
        _RAMPS = d['method']['one_palette_per_family']
    return [hexrgb(h) for h in _RAMPS[family]]


def lum(c):
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def sat(c):
    return (max(c) - min(c)) / 255.0


def by_value(c, ramp):
    L = lum(c)
    return min(ramp, key=lambda r: abs(lum(r) - L))


def off_ramp(c, ramp):
    """HOW FAR OUT OF RANGE A PIXEL IS -- THE DISTANCE FROM ITS OWN RAMP TONE WITH
    BRIGHTNESS TAKEN OUT. The ramp is a run of ONE colour at seven brightnesses, so the
    only thing it cannot represent is a DIFFERENT COLOUR; being darker or lighter is
    exactly what it is for. Scaling the pixel to its ramp tone's brightness before
    measuring asks that and nothing else, and it is the only test that separates all four
    things in a street tile at once:

        a black crack      grey, dark          -> near the ramp     stays a crack
        grey aggregate     grey, mid           -> near the ramp     stays asphalt
        white lane paint   grey, bright        -> NEAR the ramp     handled by value, below
        a yellow weed      yellow-green        -> FAR from the ramp accent
        median rust        orange, loud        -> FAR from the ramp accent

    TWO EARLIER RULES GOT THIS WRONG AND THE PICTURE CAUGHT BOTH. Plain saturation put the
    bar at 0.35 on the already-warm concrete ramp, found two to nine weed pixels a tile,
    failed the four-pixel floor, and turned every weed BLACK. Plain RGB distance then went
    the other way and let dark cracks qualify, so the sidewalk came out speckled WHITE.
    Neither was visible in the colour count; both were obvious on a contact sheet."""
    if sat(c) < 0.06:
        return 0.0     # A GREY PIXEL HAS NO COLOUR TO BE OUT OF RANGE IN. Without this
                       # guard pure black scores 77 -- scaling (0,0,0) up to the ramp's
                       # darkest tone can only ever land on (0,0,0) -- so every crack in
                       # the sidewalk qualified, the 90th percentile came back BLACK, and
                       # the weeds went with it. The count never moved; the sheet did.
    r = by_value(c, ramp)
    k = lum(r) / max(lum(c), 1.0)
    return (abs(c[0] * k - r[0]) + abs(c[1] * k - r[1]) + abs(c[2] * k - r[2]))


def colour_accent(px, ramp):
    """OUT OF RANGE IN COLOUR: the weeds in the sidewalk cracks, the rust on the median.
    The 90th percentile of the out-of-range pixels, never the single farthest one -- the car
    round paid for that when one wreck came out speckled scarlet off a tail light."""
    loud = sorted((c for c in px if off_ramp(c, ramp) > 45), key=lambda c: off_ramp(c, ramp))
    if len(loud) < 6:
        return None
    return loud[int(len(loud) * 0.90)]


def value_accent(px, ramp):
    """OUT OF RANGE IN VALUE: LANE PAINT. The asphalt ramp stops at luminance 96 and a lane
    line is white, so without this every marking in the game is crushed into the top
    asphalt tone and the road stops reading as a road."""
    cap = max(lum(r) for r in ramp)
    hi = [c for c in px if lum(c) > cap + 20]
    if len(hi) < max(8, int(0.015 * len(px))):     # a mark, not noise
        return None
    hi.sort(key=lum)
    return hi[len(hi) // 2]


def snap(c, ramp, colour_acc, value_acc):
    """HIS METHOD: snapped to the family ramp BY VALUE, with up to two accents kept. An
    accent only claims a pixel that is genuinely out of range in the accent's own
    direction, so paint never eats asphalt and a weed never eats a crack."""
    if colour_acc is not None and off_ramp(c, ramp) > 45:
        return colour_acc
    if value_acc is not None and lum(c) > max(lum(r) for r in ramp) + 14:
        return value_acc
    return by_value(c, ramp)


def declutter(w, h, idx, keep, ramp):
    """PIXELS TRAVEL IN GROUPS. An accent cluster under four pixels is confetti, so it goes
    back to the ramp. Without this a tile scores clean and looks like static."""
    seen = [False] * (w * h)
    for i in range(w * h):
        if seen[i] or idx[i] not in keep:
            continue
        stack, comp, col = [i], [], idx[i]
        seen[i] = True
        while stack:
            j = stack.pop(); comp.append(j)
            x, y = j % w, j // w
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h:
                    k = ny * w + nx
                    if not seen[k] and idx[k] == col:
                        seen[k] = True; stack.append(k)
        if len(comp) < 4:
            back = by_value(col, ramp)
            for j in comp:
                idx[j] = back
    return idx


def recook(im, family):
    ramp = ramp_of(family)
    w, h = im.size
    src = list(im.getdata())
    px = [c[:3] for c in src if c[3] >= 128]
    if not px:
        return im
    ca, va = colour_accent(px, ramp), value_accent(px, ramp)
    keep = set(a for a in (ca, va) if a is not None)
    idx = [None] * (w * h)
    for i, c in enumerate(src):
        if c[3] >= 128:
            idx[i] = snap(c[:3], ramp, ca, va)
    idx = declutter(w, h, idx, keep, ramp)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    o = out.load()
    for i, c in enumerate(src):
        if c[3] >= 128:
            v = idx[i]
            o[i % w, i // w] = (v[0], v[1], v[2], c[3])
    return out


def decode(b):
    return Image.open(io.BytesIO(base64.b64decode(b + '=' * (-len(b) % 4)))).convert('RGBA')


def encode(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode('ascii')


def load_bank():
    """PARSE, NEVER GUESS. Brace-match the SA_TILES literal and JSON it, so a key can never
    be attributed to the wrong container again."""
    t = io.open(CHUNK, encoding='utf-8').read()
    i = t.index(DECL); j = i + len(DECL)
    d = 0
    for k in range(j, len(t)):
        if t[k] == '{':
            d += 1
        elif t[k] == '}':
            d -= 1
            if d == 0:
                end = k + 1
                break
    return t, j, end, json.loads(t[j:end])


def sheet(obj, path):
    order = [k for k in ('street', 'side', 'lane_h', 'lane_v', 'cross_ns', 'cross_ew',
                         'median_h', 'median_v', 'shoulder') if k in obj]
    S, CELL, N = 3, 48, 8
    img = Image.new('RGBA', (N * CELL * S, len(order) * 2 * CELL * S), (20, 20, 24, 255))
    for r, k in enumerate(order):
        for n, b in enumerate(obj[k][:N]):
            a = decode(b); c = recook(a, FAMILY_OF[k])
            for m, q in ((0, a), (1, c)):
                big = q.resize((q.size[0] * S, q.size[1] * S), Image.NEAREST)
                img.alpha_composite(big, (n * CELL * S, (r * 2 + m) * CELL * S))
    img.save(path)
    return order


def main():
    write = '--write' in sys.argv
    t, j, end, obj = load_bank()
    if '--sheet' in sys.argv:
        p = sys.argv[sys.argv.index('--sheet') + 1]
        print('rows, each a before/after pair:', sheet(obj, p)); return 0

    print('THE STREET IS A PHOTOGRAPH -- SA_TILES (the walked ground), not TP_TILES')
    print('  the craft law ceiling is %d colours in one tile\n' % CEILING)
    print('  %-10s %6s %6s %11s %11s %10s' % ('pool', 'tiles', 'size', 'was median', 'now median', 'now worst'))
    tb = ta = n = 0
    for k in sorted(FAMILY_OF):
        if k not in obj:
            continue
        was, now = [], []
        for i, b in enumerate(obj[k]):
            a = decode(b); c = recook(a, FAMILY_OF[k])
            was.append(len({q[:3] for q in a.getdata() if q[3] >= 128}))
            now.append(len({q[:3] for q in c.getdata() if q[3] >= 128}))
            if write:
                obj[k][i] = encode(c)
            n += 1
        tb += sum(1 for x in was if x > CEILING); ta += sum(1 for x in now if x > CEILING)
        print('  %-10s %6d %6s %11d %11d %10d'
              % (k, len(was), '%dx%d' % decode(obj[k][0]).size if not write else
                 '%dx%d' % decode(obj[k][0]).size,
                 statistics.median(was), statistics.median(now), max(now)))
    print('\n  over the ceiling: %d -> %d   of %d tiles' % (tb, ta, n))
    if write:
        io.open(CHUNK, 'w', encoding='utf-8').write(t[:j] + json.dumps(obj, separators=(',', ':')) + t[end:])
        print('\n  WROTE the street. Every tile keeps its cracks, its weeds and its paint;')
        print('  only the palette moved onto the family ramp it should have been on.')
    else:
        print('\n  measure only. pass --write to cook it.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
