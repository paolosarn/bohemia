#!/usr/bin/env python3
"""EVERY PROP KEEPS ITS SHAPE AND CHANGES ITS SIZE -- COOK, 9/18/26. [car recook] round 8.

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
CELL = 44
CEILING = 64

#  *** WHY THIS ROUND COULD NOT HAVE BEEN "DRAW THE OTHER FIFTEEN". ***
#  Round 7 fixed the car by authoring its master at 88x176, the size its stall gives. I
#  came into round 8 to do the same for the rest and MEASURED FIRST (rule 12). A footprint
#  is in CELLS because that is a fact about the world -- a bin is 0.9 of a cell wide -- and
#  0.9 x 44 is 39.6 PIXELS. A master is always a whole number of pixels, so
#  min(39.6/w, 39.6/h) CAN NEVER BE 1.000 for any art anybody could ever draw.
#
#      OF SEVENTEEN PROP FAMILIES, EXACTLY TWO HAVE A WHOLE-PIXEL STALL: car and lamp.
#
#  The car is the one that was already fixable, and that is WHY it was fixable. The other
#  fifteen were unreachable by construction -- a debt that could not be paid by drawing,
#  no matter how good the drawing was. So the draw call now ROUNDS the stall to whole
#  pixels (__A_STALL_IS_A_WHOLE_NUMBER_OF_PIXELS__ in the city page), which is presentation
#  and nothing else: PROP_FP is read nowhere in engine/, so no occupancy, clamp or
#  walkable-land fact moves and the rectangle changes by at most half a pixel.
#  THEN the art can land on it. Both halves are needed; neither alone does anything.


def ramps():
    d = json.load(io.open(BANK, encoding='utf-8'))
    R = d['method']['one_palette_per_family']
    hx = lambda h: tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    out = {k: [hx(c) for c in v] for k, v in R.items()}
    out['terracotta'] = out['terracotta'][:6]      # never the white at the top
    return out, out['terracotta'][:4]


def shipped():
    """the whole pool plus the footprints, from the same eval the page uses"""
    out = os.path.join(ROOT, 'tools', '__props.json')
    subprocess.run(['node', '-e',
        'const fs=require("fs");global.window={};'
        'eval(fs.readFileSync(%r,"utf8")+"\\n;globalThis.__P=PROP_B64;globalThis.__F=PROP_FP;");'
        'fs.writeFileSync(%r,JSON.stringify({p:globalThis.__P,f:globalThis.__F}));'
        % (PROPS, out)], check=True, cwd=ROOT)
    v = json.load(io.open(out)); os.remove(out)
    return v['p'], v['f']


def target_of(fp):
    """the stall this family's own footprint buys, in WHOLE pixels -- read per family,
    never assumed. Round 7's 88x176 was the CAR's; nothing else shares it."""
    return round(CELL * fp[0]), round(CELL * fp[1])


def decode(b):
    return Image.open(io.BytesIO(base64.b64decode(b + '=' * (-len(b) % 4)))).convert('RGBA')


def luma(p):
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]


def big_mask(src, W, H):
    """THE MASK IS THE ONE THING THAT MAY BE SCALED, and that is the whole trick: the fault
    is that scaling COLOUR by a fractional factor makes uneven pixels, and a one-bit
    coverage map has no pixels to make uneven. Box-filtered so partial coverage is real
    coverage, re-thresholded at half, then despurred so the outline is crisp."""
    a = src.split()[3].point(lambda v: 255 if v >= 128 else 0)
    a = a.resize((W, H), Image.BOX).point(lambda v: 255 if v >= 128 else 0)
    m = [[a.getpixel((x, y)) > 0 for x in range(W)] for y in range(H)]
    for _ in range(2):
        cut = [(x, y) for y in range(H) for x in range(W) if m[y][x] and
               sum(1 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))
                   if 0 <= x + dx < W and 0 <= y + dy < H and m[y + dy][x + dx]) < 2]
        if not cut:
            break
        for x, y in cut:
            m[y][x] = False
    return m


def panel_field(src, m, W, H):
    """READ THE PANELS OUT OF THE PHOTOGRAPH, AT ITS OWN RESOLUTION, where it is still a
    photograph. Quantising this is what keeps each object's own light and shade WITHOUT
    this tool asserting where any of it is."""
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
    return out, lo, max(vals[int(len(vals) * 0.96)], lo + 1.0)


def build_one(b, seed, ramp, terra, W, H, rusty):
    src = decode(b)
    m = big_mask(src, W, H)
    field, lo, hi = panel_field(src, m, W, H)
    rnd = random.Random(seed)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    px = im.load()
    top = len(ramp) - 1

    for y in range(H):
        for x in range(W):
            if not m[y][x]:
                continue
            t2 = (field[y][x] - lo) / (hi - lo)
            px[x, y] = ramp[max(0, min(top, int(round(t2 * top))))] + (255,)

    # ONE LIGHT DIRECTION (45 DEGREE ART LAW): upper-left catches, lower-right sits in
    # its own shadow. The same two lines every structure in this game draws.
    for y in range(H):
        for x in range(W):
            if not m[y][x]:
                continue
            if (y == 0 or not m[y - 1][x]) or (x == 0 or not m[y][x - 1]):
                px[x, y] = ramp[top] + (255,)
            elif (y == H - 1 or not m[y + 1][x]) or (x == W - 1 or not m[y][x + 1]):
                px[x, y] = ramp[0] + (255,)

    if not rusty:
        return im

    # RUST, GROWN INWARD FROM THE SILHOUETTE. *** THE RIM IS NOT RUST *** -- distance 0 and
    # 1 are forbidden, because the rim is the lit and shadow edge the law above just drew
    # and painting over it destroys the only two lines giving the body form. Four wrong
    # answers to this one question are on the record; this is the one that held.
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
    reach = max(2, min(7, int(min(W, H) / 6)))
    patches = [(rnd.randrange(W), rnd.randrange(H)) for _ in range(rnd.randint(3, 6))]
    for y in range(H):
        for x in range(W):
            d = dist[y][x]
            if not m[y][x] or d < 2 or d > reach:
                continue
            near = min(math.hypot(x - a, y - b) for a, b in patches)
            blotch = max(0.0, 1.0 - near / max(12.0, min(W, H) * 0.45))
            if blotch <= 0:
                continue
            mid = (2 + reach) / 2.0
            band = 1.0 - abs(d - mid) / max(1.0, reach - mid + 0.5)
            if rnd.random() < 0.72 * blotch * max(0.0, band):
                px[x, y] = terra[0 if d > mid else 1] + (255,)
    return im


def png(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode('ascii')


#  WHICH RAMP EACH FAMILY IS MADE OF. The material, never a preference: anything that is
#  painted metal on a street is asphalt's greys; anything that is bare corroded steel or
#  fired clay leans on terracotta's corroded end for its rust. Every tone is from the 7/28
#  set Paolo approved; nothing new is invented.
#  *** AND THE FIRST CUT OF THIS ROUND PUT EVERY FAMILY ON ASPHALT AND THE SHEET SHOWED
#  ME A WORLD WITH NO COLOUR IN IT. *** The orange barrel, the red-and-white barricade,
#  the wooden bench, the green dumpster, the blue mailbox, the orange cone, the burning
#  fire barrel -- all grey. Asphalt is right for a CAR because a car sits on the road; it
#  is not right for a traffic cone, whose orange is the entire reason it reads as a cone.
#  ONE PALETTE PER FAMILY means the family is THE MATERIAL, not "the thing under it".
#
#  AND MEASURING THEM SETTLED WHAT THIS ROUND ACTUALLY IS. The shipped props look well
#  coloured because THEY ARE PHOTOGRAPHS:
#      bag 3,052   barrel 4,215   barricade 3,436   bench 2,849   bin 3,487
#      bollard 2,524  cone 2,751  dumpster 5,272  firebarrel 2,765  mailbox 3,043
#      pallet 2,863   rubble 3,477   tyre 3,125   (median colours per sprite)
#  EIGHTY-FIVE OF ONE HUNDRED AND FIVE PROP SPRITES ARE OVER THE 64-COLOUR CEILING. The
#  car is the only family anybody ever cooked. So these need BOTH fixes -- the resolution
#  this round is about AND the palette the cars got on 9/7 -- and doing one without the
#  other would leave a photograph at the right size.
RAMP_OF = {
    # painted or galvanised metal standing on a street: asphalt's greys, rust at the edges
    'bin': 'asphalt', 'dumpster': 'asphalt', 'mailbox': 'asphalt', 'bollard': 'asphalt',
    'barricade': 'asphalt', 'bag': 'asphalt', 'tyre': 'asphalt', 'pole': 'asphalt',
    'lighttower': 'asphalt', 'car': 'asphalt',
    # bare corroded steel and hazard orange: terracotta IS the approved orange, so the
    # cone stays a cone and the drum stays a rusted drum without inventing a tone
    'barrel': 'terracotta', 'firebarrel': 'terracotta', 'cone': 'terracotta',
    # wood
    'bench': 'deck', 'pallet': 'deck',
    # broken masonry
    'rubble': 'concrete',
}
RUSTY = {'car', 'bin', 'dumpster', 'bollard', 'barricade', 'mailbox', 'tyre', 'pole',
         'lighttower', 'bag'}


def main():
    write = '--write' in sys.argv
    RAMPS, terra = ramps()
    pool, FP = shipped()
    fams = sorted(f for f in pool if f in FP)

    rows, cooked = [], {}
    for fam in fams:
        W, H = target_of(FP[fam])
        old = pool[fam]
        sizes = {decode(b).size for b in old}
        was = sorted({round(min(W / w, H / h), 3) for (w, h) in sizes})
        if sizes == {(W, H)}:
            rows.append((fam, len(old), 'already 1.000', W, H, None, None))
            continue
        ramp = RAMPS[RAMP_OF.get(fam, 'asphalt')]
        cars = [build_one(b, hash((fam, i)) & 0xffff, ramp, terra, W, H, fam in RUSTY)
                for i, b in enumerate(old)]
        cols = [len({c[:3] for c in im.getdata() if c[3] >= 128}) for im in cars]
        oshare = [100.0 * sum(1 for c in decode(b).getdata() if c[3] >= 128)
                  / (decode(b).size[0] * decode(b).size[1]) for b in old]
        nshare = [100.0 * sum(1 for c in im.getdata() if c[3] >= 128) / (W * H) for im in cars]
        drift = max(abs(a - b) for a, b in zip(oshare, nshare))
        rows.append((fam, len(old), '/'.join('%.3f' % x for x in was)[:13], W, H,
                     max(cols), drift))
        cooked[fam] = cars

    print('EVERY PROP KEEPS ITS SHAPE AND CHANGES ITS SIZE\n')
    print('  %-12s %5s %-14s %-10s %7s %8s' % ('family', 'n', 'was', 'now', 'colours', 'drift'))
    bad = []
    for fam, n, was, W, H, col, drift in rows:
        if col is None:
            print('  %-12s %5d %-14s %-10s' % (fam, n, was, 'ok already'))
            continue
        flag = ''
        if col > CEILING:
            flag = ' OVER THE CEILING'; bad.append(fam)
        if drift > 8.0:
            flag += ' SILHOUETTE DRIFT'; bad.append(fam)
        print('  %-12s %5d %-14s %-10s %7d %7.1f%s'
              % (fam, n, was, '1.000 @ %dx%d' % (W, H), col, drift, flag))
    if bad:
        sys.exit('\n  %s -- refusing.' % ', '.join(sorted(set(bad))))

    if '--sheet' in sys.argv:
        p = sys.argv[sys.argv.index('--sheet') + 1]
        show = [f for f in fams if f in cooked]
        CW = 120
        sheet = Image.new('RGBA', (len(show) * CW, 2 * 210), (20, 20, 24, 255))
        for n, fam in enumerate(show):
            W, H = target_of(FP[fam])
            o = decode(pool[fam][0])
            s = min(1.0, 190.0 / max(o.size[1], 1))
            o2 = o.resize((max(1, int(o.size[0] * s)), max(1, int(o.size[1] * s))), Image.NEAREST)
            sheet.alpha_composite(o2, (n * CW + 4, 4))
            c = cooked[fam][0]
            s2 = min(1.0, 190.0 / max(H, 1))
            c2 = c.resize((max(1, int(W * s2)), max(1, int(H * s2))), Image.NEAREST)
            sheet.alpha_composite(c2, (n * CW + 4, 214))
        sheet.save(p)
        print('\n  row 1 = shipped   row 2 = re-shaded at its own stall size')
        print('  ' + '  '.join(show))
        return 0

    if write:
        t = io.open(PROPS, encoding='utf-8').read()
        anchor = t.index('const PROP_B64')
        for fam, cars in cooked.items():
            #  *** SEVENTH REGISTRY COLLISION: this file holds TWO tables and BOTH are
            #  keyed by family name -- PROP_FP (the FOOTPRINT) and PROP_B64 (the ART) --
            #  and PROP_FP comes first. Round 7's first write put twenty base64 images
            #  over the CAR'S FOOTPRINT. Anchor after PROP_B64, and prove the target
            #  holds a PNG before writing a single byte.
            m = re.compile(r'("%s"\s*:\s*\[)(.*?)(\])' % re.escape(fam), re.S).search(t, anchor)
            if not m:
                sys.exit('%s is not in the art table -- refusing.' % fam)
            if 'iVBOR' not in t[m.start(2):m.start(2) + 200]:
                sys.exit('%s: that is not the ART table -- refusing.' % fam)
            t = t[:m.start(2)] + ',\n'.join('"%s"' % png(im) for im in cars) + t[m.end(2):]
        io.open(PROPS, 'w', encoding='utf-8').write(t)

        #  AND THE BANK, IN THE SAME WRITE, so the two copies cannot drift -- props_gate
        #  caught round 7 updating only the sibling (105 objects matched became 85).
        fb = json.load(io.open(FURN, encoding='utf-8'))
        for fam, cars in cooked.items():
            rws = fb['families'].get(fam)
            if rws is None or len(rws) != len(cars):
                sys.exit('%s: the bank holds %s rows and the pool holds %d -- refusing.'
                         % (fam, 'no' if rws is None else len(rws), len(cars)))
            for r, im in zip(rws, cars):
                r['b64'] = png(im); r['w'], r['h'] = im.size
                r['opaque'] = sum(1 for c in im.getdata() if c[3] >= 128)
        json.dump(fb, io.open(FURN, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)

        back, _ = shipped()
        for fam in cooked:
            W, H = target_of(FP[fam])
            if {decode(b).size for b in back[fam]} != {(W, H)}:
                sys.exit('%s: wrote and read back something else -- STOP' % fam)
        print('\n  COOKED, IN BOTH PLACES. %d families now draw at 1.000.' % len(cooked))
    else:
        print('\n  measure only. pass --write to cook it.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
