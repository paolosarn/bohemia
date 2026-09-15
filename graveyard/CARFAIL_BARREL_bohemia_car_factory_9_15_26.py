#!/usr/bin/env python3
"""THE CAR FACTORY -- COOK, 9/15/26. [car recook] round 6. DRAWN, NOT RECOLOURED.

*** PAOLO 9/15: "every time I see a car it looks like dogshit, I'M SO CONFUSED." ***

Round 5 measured why he is confused and it is not the paint: EVERY PROP IN THE GAME IS
DRAWN AT A FRACTIONAL SCALE. The car is the worst of the sixteen at 1.833x, while the
ground beside it is drawn at exactly 1.000. Smoothing is off, so the car is not blurred --
it is UNEVEN: a source row becomes 2 screen pixels, then 2, then 1, in a pattern that never
repeats. Every pixel of the car is a different size from its neighbour AND 83% bigger than
the ground pixel next to it. gates/prop_scale_gate.py holds that measurement forever.

THIS ROUND FIXES THE ONE HE NAMED, AND THE FIX IS THE MASTER SIZE.

    the stall a car's footprint buys   2 x 4 cells at 44 px   = 88 x 176
    the master it has been drawn from                         =  45 x 96
    so the fit is min(88/45, 176/96)                          =     1.833

    the master this tool draws                                = 88 x 176
    the fit                                                   =     1.000

*** WHY THIS IS DRAWN AND NOT RESIZED, MEASURED BEFORE CHOOSING. *** Round 5 tried both
shortcuts and both are dead:
  * A 2x nearest upscale gives 90 x 192 against an 88 x 176 stall. Trimming to fit needs
    1 px of transparent margin each side and 8 px of height. MEASURED: the smallest
    transparent margin across all twenty shipped cars is ZERO ON EVERY EDGE -- they fill
    their masters. Any trim cuts the car.
  * Snapping the scale in the renderer puts the car at 1.0 (a toy in half its stall) or
    2.0 (16 px of overhang, breaking the invariant that a fit is only ever smaller than
    its stall).
And a non-uniform stretch to 88 x 176 is the 9/7 squash this row already killed.

So the masters are DRAWN at 88 x 176. That also ends the photograph lineage for good: the
twenty shipped cars are corpus PHOTOGRAPHS that were re-coloured on 9/7 (median 3,031
colours -> 9) and re-rusted on 9/8, and a recolour can never fix a resolution. These are
generated, which is the FACTORY LAW, and it is how every other pool in this repo is made.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): swept every bank in banks/ for a top-down vehicle at
any size -- there is none; the only car art in this repo is the photograph pool this
replaces, and it is the wrong size by construction. NOTHING new is invented in colour:
  USED, verbatim from the act-1 set Paolo approved 7/28 ("I checked it to do the other 41
  mark it approved"), banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt:
    asphalt     7 tones -> the shell, because a car sits on the road and the row says the
                           value bands of the ground it sits on
    terracotta  corroded end only -> the rust, which is where the 9/8 round already put it
                           after the first cut came out speckled scarlet off a tail light
  No third ramp, no invented tone, and the same eleven colours the shipped cars ended on --
  so this changes the RESOLUTION and the silhouette, never the palette.
  CONSIDERED AND NOT USED: tools/bohemia_car_recook_9_7_26.py (a recolour of the
  photographs; it cannot change a master's size, which is the whole fault) and
  tools/bohemia_car_not_squashed_9_7_26.py (the aspect fix, already shipped and still in).

REFERENCE CHECK

COMPARED TO: overhead photographs of abandoned sedans, wagons, pickups and vans -- salvage
yards, aerial street views, and the Mojave's own roadside wrecks, which is the ground this
game is set on. Plus the repo as its own ruler: the craft law's 64-colour ceiling, the
45-degree law's single light direction, and the approved act-1 ramps.

STRUCTURAL RULES TAKEN, EACH ONE FROM THE PHOTOGRAPHS AND NOT FROM TASTE:
  * FROM ABOVE A CAR IS MOSTLY ROOF, AND THE ROOF IS THE FLATTEST, BRIGHTEST PANEL. Bonnet
    and boot sit a step darker, the glass darker still. That value order is what makes a
    top-down car read as a car rather than a rounded rectangle, and it is the first thing
    the old photographs lost when they were flattened to nine colours.
  * A CAR IS NOT A RECTANGLE. The body waists in at the nose and tail and bulges over the
    wheel arches; the greenhouse (roof + glass) is narrower than the body by a clear step.
  * RUST STARTS AT THE EDGES, THE SEAMS AND THE WHEEL ARCHES, NEVER IN THE MIDDLE OF A
    ROOF. This is the round-4 planet mistake and the round-2 car mistake in one sentence:
    both times an accent was taken too wide and too loud and the picture caught it. Rust
    here is grown from the silhouette edge inward, weighted to the arches and the panel
    seams, and it is terracotta's corroded end only.
  * GLASS BREAKS, PANELS DO NOT VANISH. A wreck keeps its shape and loses its windows; the
    windscreen goes first, then the rear screen.
  * ONE LIGHT DIRECTION (45 DEGREE ART LAW): upper-left. Every panel catches a one-pixel
    lit edge on its upper-left and sits in its own shadow on the lower-right, which is the
    same two lines every structure in this game already draws.

WHAT CHANGED FROM THE REFERENCE: the palette, and deliberately. A real wreck is any colour
that ever left a factory; these are asphalt and rust, because ONE PALETTE PER FAMILY and
the family a car sits on is the road. That is the same trade every cook in this lane makes.

    python3 tools/bohemia_car_factory_cook_9_15_26.py              measure only
    python3 tools/bohemia_car_factory_cook_9_15_26.py --sheet X    before/after png
    python3 tools/bohemia_car_factory_cook_9_15_26.py --write      cook it
"""
import io, os, re, sys, json, math, base64, random, subprocess, statistics
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(ROOT, 'banks', 'BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
PROPS = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_PROPS.js')
W, H = 88, 176                      # the stall a car's footprint buys, at 1.000
CEILING = 64


def ramps():
    d = json.load(io.open(BANK, encoding='utf-8'))
    R = d['method']['one_palette_per_family']
    hx = lambda h: tuple(int(h.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
    return [hx(c) for c in R['asphalt']], [hx(c) for c in R['terracotta'][:4]]


# the five shapes a dead American street actually holds, as half-width profiles down the
# body: each row is how wide the body is at that fraction of its length
SHAPES = {
    'sedan':   [(0.00, .20), (0.04, .30), (0.10, .38), (0.19, .43), (0.30, .46), (0.50, .47),
                (0.70, .46), (0.84, .43), (0.93, .37), (0.98, .28), (1.00, .20)],
    'wagon':   [(0.00, .21), (0.04, .31), (0.10, .39), (0.19, .44), (0.30, .46), (0.62, .47),
                (0.82, .47), (0.92, .45), (0.98, .40), (1.00, .32)],
    'pickup':  [(0.00, .20), (0.04, .30), (0.10, .38), (0.19, .43), (0.30, .45), (0.48, .46),
                (0.52, .42), (0.56, .45), (0.92, .45), (0.98, .41), (1.00, .34)],
    'van':     [(0.00, .28), (0.04, .38), (0.09, .45), (0.16, .48), (0.30, .49), (0.78, .49),
                (0.90, .47), (0.97, .43), (1.00, .35)],
    'hatch':   [(0.00, .20), (0.04, .29), (0.10, .37), (0.19, .42), (0.30, .44), (0.52, .45),
                (0.70, .44), (0.85, .41), (0.95, .34), (1.00, .25)],
}
# the greenhouse: (windscreen from, to, rear screen from, to) as a fraction of the length
CABIN = {
    'sedan':  (0.30, 0.42, 0.60, 0.72), 'wagon': (0.30, 0.42, 0.66, 0.84),
    'pickup': (0.28, 0.40, 0.44, 0.50), 'van':   (0.16, 0.30, 0.70, 0.88),
    'hatch':  (0.30, 0.42, 0.62, 0.76),
}
AXLES = {'sedan': (0.22, 0.80), 'wagon': (0.22, 0.82), 'pickup': (0.22, 0.84),
         'van': (0.18, 0.84), 'hatch': (0.24, 0.78)}
# how far in from the flank the greenhouse sits: a roof is NARROWER THAN A BODY, and that
# step is most of what makes a shape read as a car from above rather than as a barrel.
GREENHOUSE_INSET = 0.26


def halfwidth(shape, t):
    p = SHAPES[shape]
    if t <= p[0][0]:
        return p[0][1] * W
    for i in range(len(p) - 1):
        a, b = p[i], p[i + 1]
        if a[0] <= t <= b[0]:
            k = 0 if b[0] == a[0] else (t - a[0]) / (b[0] - a[0])
            return (a[1] + (b[1] - a[1]) * k) * W
    return p[-1][1] * W


def draw_car(shape, seed, asph, terra):
    """*** THE FIRST VERSION OF THIS CAME OUT AS A BARREL AND I LOOKED AT IT BEFORE
    SHIPPING IT. *** A rounded rectangle with two dark bands across it: no taper, a
    greenhouse drawn full width instead of inset, no wheels, and rust that grew only on the
    outline as a one-pixel fringe. The colour count was 8 and the fit was exactly 1.000 --
    the numbers were perfect and the picture was a barrel, which is the fourth time in six
    rounds this lane has been told that by a contact sheet. What actually makes a top-down
    car read: A HARD TAPER AT BOTH ENDS, A GREENHOUSE NARROWER THAN THE BODY, WHEELS
    BREAKING THE FLANK, and rust in PATCHES at the arches rather than a rim."""
    rnd = random.Random(seed)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    px = im.load()
    cx = W / 2.0
    ws, we, rs, re_ = CABIN[shape]
    fa, ra = AXLES[shape]

    def put(x, y, i):
        if 0 <= x < W and 0 <= y < H:
            px[x, y] = asph[max(0, min(6, i))] + (255,)

    # ---- THE BODY. From above a car is mostly roof and the roof is the brightest panel;
    # bonnet and boot a step darker, glass darker still. That value order is what makes a
    # top-down car read as a car.
    for y in range(H):
        t = y / (H - 1.0)
        hw = halfwidth(shape, t)
        inner = hw * (1.0 - GREENHOUSE_INSET)
        for x in range(W):
            d = abs(x + 0.5 - cx)
            if d > hw:
                continue
            if d > inner:                      # the flank: the side of the car, in shadow
                put(x, y, 1 if d > hw - 1.5 else 2)
                continue
            if ws <= t < we or rs <= t < re_:  # windscreen / rear screen, INSET
                put(x, y, 2)
            elif we <= t < rs:                 # the roof, the brightest panel
                put(x, y, 5 if d < inner * 0.55 else 4)
            else:                              # bonnet and boot
                put(x, y, 4 if d < inner * 0.5 else 3)

    # ---- WHEELS, breaking the flank. A car from above shows tyre at the arches and that
    # interruption of the outline is half of what says "vehicle".
    for ax in (fa, ra):
        y0 = int(ax * (H - 1))
        for dy in range(-9, 10):
            y = y0 + dy
            if not (0 <= y < H):
                continue
            hw = halfwidth(shape, y / (H - 1.0))
            if abs(dy) > 8:
                continue
            for side in (-1, 1):
                for o in range(0, 4):
                    x = int(cx + side * (hw - 0.5 + o - 1))
                    put(x, y, 0 if abs(dy) < 7 else 1)

    # ---- the panel seams: doors, bonnet and boot shut lines. One dark pixel, because a
    # shut line is a gap and a gap is shadow. Drawn INSIDE the flank so they read as panel
    # edges rather than as stripes across the whole car.
    for s in (ws, we, rs, re_, 0.51 if shape != 'pickup' else 0.56):
        y = int(s * (H - 1))
        hw = halfwidth(shape, s) * (1.0 - GREENHOUSE_INSET)
        for x in range(int(cx - hw) + 1, int(cx + hw)):
            if 0 <= x < W and px[x, y][3]:
                px[x, y] = asph[1] + (255,)

    # ---- ONE LIGHT DIRECTION, upper-left (45 DEGREE ART LAW).
    for y in range(H):
        for x in range(W):
            if px[x, y][3] == 0:
                continue
            if (y == 0 or px[x, y - 1][3] == 0) or (x == 0 or px[x - 1, y][3] == 0):
                px[x, y] = asph[6] + (255,)
            elif (y == H - 1 or px[x, y + 1][3] == 0) or (x == W - 1 or px[x + 1, y][3] == 0):
                px[x, y] = asph[0] + (255,)

    # ---- BROKEN GLASS: a wreck keeps its shape and loses its windows, windscreen first.
    for (a, b), gone in (((ws, we), True), ((rs, re_), rnd.random() < 0.62)):
        if not gone:
            continue
        for y in range(int(a * (H - 1)) + 1, int(b * (H - 1))):
            hw = halfwidth(shape, y / (H - 1.0)) * (1.0 - GREENHOUSE_INSET)
            for x in range(int(cx - hw) + 1, int(cx + hw)):
                if px[x, y][3]:
                    px[x, y] = asph[0 if rnd.random() < 0.72 else 1] + (255,)

    # ---- *** RUST STARTS AT THE ARCHES AND THE SEAMS, IN PATCHES, NEVER AS A RIM AND
    # NEVER IN THE MIDDLE OF A ROOF. *** Round 2 speckled a wreck scarlet off a tail light,
    # round 4 covered a planet in orange over a fifth of its disc, and version one of this
    # tool drew a one-pixel orange fringe round the whole outline. Three different wrong
    # answers to the same question. Rust grows as BLOBS seeded on the wheel arches and the
    # lower body, which is where water sits on a real one.
    seeds = []
    for ax in (fa, ra):
        for side in (-1, 1):
            y0 = int(ax * (H - 1)) + rnd.randint(-6, 6)
            hw = halfwidth(shape, max(0.0, min(1.0, y0 / (H - 1.0))))
            seeds.append((int(cx + side * (hw - rnd.randint(1, 4))), y0, rnd.randint(4, 8)))
    for _ in range(rnd.randint(2, 4)):
        t = rnd.choice([ws, we, rs, re_, 0.51])
        y0 = int(t * (H - 1)) + rnd.randint(-4, 4)
        hw = halfwidth(shape, max(0.0, min(1.0, y0 / (H - 1.0))))
        seeds.append((int(cx + rnd.choice([-1, 1]) * rnd.uniform(0.3, 0.9) * hw), y0,
                      rnd.randint(3, 6)))
    for sx, sy, r in seeds:
        for y in range(sy - r, sy + r + 1):
            for x in range(sx - r, sx + r + 1):
                if not (0 <= x < W and 0 <= y < H) or not px[x, y][3]:
                    continue
                d = math.hypot(x - sx, y - sy) / max(r, 1)
                if d < 1.0 and rnd.random() < (1.0 - d) ** 1.4 * 0.9:
                    px[x, y] = terra[0 if d > 0.55 else 1] + (255,)
    return im


def png(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode('ascii')


def shipped():
    out = os.path.join(ROOT, 'tools', '__cars.json')
    subprocess.run(['node', '-e',
        'const fs=require("fs");global.window={};'
        'eval(fs.readFileSync(%r,"utf8")+"\\n;globalThis.__P=PROP_B64;");'
        'fs.writeFileSync(%r,JSON.stringify(globalThis.__P.car));' % (PROPS, out)],
        check=True, cwd=ROOT)
    v = json.load(io.open(out)); os.remove(out)
    return v


def build():
    asph, terra = ramps()
    old = shipped()
    plan = (['sedan'] * 7 + ['hatch'] * 4 + ['wagon'] * 4 + ['pickup'] * 3 + ['van'] * 2)
    return [draw_car(plan[i % len(plan)], 9150 + i * 37, asph, terra)
            for i in range(len(old))], old


def main():
    write = '--write' in sys.argv
    cars, old = build()
    cols = [len({c[:3] for c in im.getdata() if c[3] >= 128}) for im in cars]
    fits = {round(min(88 / im.size[0], 176 / im.size[1]), 3) for im in cars}

    print('THE CAR FACTORY -- drawn at the size the stall actually gives\n')
    print('  %-26s %-12s %s' % ('', 'was', 'now'))
    print('  %-26s %-12s %s' % ('master', '41-47 x 96', '%d x %d' % (W, H)))
    print('  %-26s %-12s %s' % ('fit into the 88x176 stall', '1.833', '/'.join('%.3f' % f for f in sorted(fits))))
    print('  %-26s %-12s %s' % ('colours (ceiling %d)' % CEILING, '10-11',
                                '%d median, %d worst' % (statistics.median(cols), max(cols))))
    print('  %-26s %-12s %s' % ('how it was made', 'photograph', 'drawn'))
    print('  %-26s %-12s %s' % ('sprites', len(old), len(cars)))

    bad = [c for c in cols if c > CEILING]
    if bad:
        sys.exit('\n  %d cars are over the craft ceiling -- refusing.' % len(bad))
    if fits != {1.0}:
        sys.exit('\n  the fit is not exactly 1.000 -- refusing, that is the whole point.')

    if '--sheet' in sys.argv:
        p = sys.argv[sys.argv.index('--sheet') + 1]
        S = 2
        sheet = Image.new('RGBA', (10 * (W + 6) * S, 2 * (H + 6) * S), (20, 20, 24, 255))
        for n, im in enumerate(cars[:10]):
            o = Image.open(io.BytesIO(base64.b64decode(old[n] + '=' * (-len(old[n]) % 4)))).convert('RGBA')
            o = o.resize((int(o.size[0] * 1.833), int(o.size[1] * 1.833)), Image.NEAREST)
            sheet.alpha_composite(o.resize((o.size[0] * S, o.size[1] * S), Image.NEAREST), (n * (W + 6) * S, 0))
            sheet.alpha_composite(im.resize((W * S, H * S), Image.NEAREST), (n * (W + 6) * S, (H + 6) * S))
        sheet.save(p)
        print('\n  row 1 = shipped, scaled 1.833x the way the game does it')
        print('  row 2 = drawn at 88x176, which the game draws at 1.000')
        return 0

    if write:
        t = io.open(PROPS, encoding='utf-8').read()
        m = re.search(r'("car"\s*:\s*\[)(.*?)(\])', t, re.S)
        if not m:
            sys.exit('the car pool is not where this tool expects it -- refusing.')
        body = ',\n'.join('"%s"' % png(im) for im in cars)
        io.open(PROPS, 'w', encoding='utf-8').write(t[:m.start(2)] + body + t[m.end(2):])
        back = shipped()
        if len(back) != len(cars):
            sys.exit('wrote the pool and read back a different count -- STOP')
        sz = {Image.open(io.BytesIO(base64.b64decode(b + '=' * (-len(b) % 4)))).size for b in back}
        if sz != {(W, H)}:
            sys.exit('read back %s, not %dx%d -- STOP' % (sz, W, H))
        print('\n  COOKED. Every car is 88x176 and the game draws it at 1.000, the same')
        print('  pixel size as the ground it is parked on.')
    else:
        print('\n  measure only. pass --write to cook it.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
