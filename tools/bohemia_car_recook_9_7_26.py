#!/usr/bin/env python3
"""THE CAR IS ASS -- COOK, VAMILY [car recook], 9/7/26.

PAOLO 9/7, off his own screenshot (records/target/PAOLO_THE_CAR_IS_ASS_9_7_26.jpg):
    "this is ass, is that the car model, c'mon bro."

He is right, and our own craft law says so by a factor of 47. Measured on all twenty
shipped city wrecks before touching one of them:

    median 3,031 DISTINCT COLOURS      the craft law's ceiling is 64      47x over
    median 71% of pixels are a colour used exactly ONCE   ceiling 35%      2x over
    all twenty fail, none is close

That is a photograph, not a prop. Standing beside a body drawn from a six-tone ramp it
is two worlds in one frame, which is what he saw.

THE OPERATION IS NOT MINE, IT IS HIS OWN APPROVED ONE. The act-1 starter tileset he
approved on 7/28 ("I checked it to do the other 41 mark it approved") records the exact
method it was made by, and this applies it unchanged:

    "every pixel snapped to the family ramp by value, then orphans absorbed"
    "accents: up to two per tile, taken from that tile's OWN out-of-range pixels,
     so white paint and dead dark glass survive the ramp"

So nothing here invents a car. The silhouette, the panel breaks, the wheel wells and the
dead glass are the real wrecked vehicle that was photographed; what changes is that its
colour becomes a ramp the ground already uses.

WHICH RAMP, AND WHY IT IS NOT A CHOICE OF TASTE. The row says "the value bands of the
ground it sits on". The approved bank carries ONE PALETTE PER FAMILY and the family a car
sits on is the road: asphalt, seven tones, #101216 to #6a5e50. A wreck in the Mojave is
oxidised steel, which is that family, and taking it means the car cannot argue with the
street under it.

THE REFERENCE CHECK (9/4 standing duty), against this lane's own sheet
reference/library/prop/INDEX.md:
  PROP-01 a prop is SILHOUETTE FIRST and its contact shadow is what anchors it.
          TAKEN: alpha is preserved pixel for pixel, so the observed silhouette is
          untouched -- this is a re-colour, not a re-draw.
  PROP-02 a real object is ONE material and two or three readable parts; a fourth part
          is decorating rather than observing.
          TAKEN: one ramp for the shell, and at most two accents, which is exactly the
          two parts a wreck really has beyond its body -- dead glass and rust.
  PROP-03 the 45-degree law: ellipse cross-sections, sky-lit tops.
          TAKEN by leaving the source geometry alone; these masters are already the
          world's three-quarter view, and nothing here rotates or reprojects them.

    python3 tools/bohemia_car_recook_9_7_26.py            measure only, changes nothing
    python3 tools/bohemia_car_recook_9_7_26.py --write    cook and write both banks
"""
import base64, io, json, os, re, sys
from collections import Counter

try:
    from PIL import Image
except Exception:
    print('PIL is required'); sys.exit(1)

CITY = 'slices/BOHEMIA_CITY_PROPS.js'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
DEMO = 'slices/BOHEMIA_DEMO.html'
BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'

CRAFT_COLOUR_CEILING = 64      # gates/pixel_craft_gate.py CRAFT.max_colours_in_one_tile
CRAFT_SINGLE_USE = 0.35        # CRAFT.worst_single_use_colour_share


def hexrgb(h):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def luma(p):
    return 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]


def ramp_of(family):
    d = json.load(io.open(BANK, encoding='utf-8'))
    return [hexrgb(h) for h in d['method']['one_palette_per_family'][family]]


def measure(im):
    px = [p for p in list(im.getdata()) if p[3] > 0]
    if not px:
        return {'px': 0, 'colours': 0, 'single': 0.0, 'orphan': 0.0}
    c = Counter((p[0], p[1], p[2]) for p in px)
    single = sum(1 for k, v in c.items() if v == 1)
    # ORPHANS, the craft law's first: a pixel with no 4-neighbour of its own colour.
    w, h = im.size
    g = im.load()
    orph = 0
    for y in range(h):
        for x in range(w):
            if g[x, y][3] == 0:
                continue
            me = g[x, y][:3]
            same = False
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < w and 0 <= ny < h and g[nx, ny][3] > 0 and g[nx, ny][:3] == me:
                    same = True
                    break
            if not same:
                orph += 1
    return {'px': len(px), 'colours': len(c),
            'single': single / len(px), 'orphan': orph / len(px)}


def recook(im, ramp, rust=None):
    """His method, unchanged: snap to the family ramp by value, keep up to two accents
    off this image's own out-of-range pixels, then absorb orphans."""
    w, h = im.size
    src = im.load()
    px = [(x, y) for y in range(h) for x in range(w) if src[x, y][3] > 0]
    if not px:
        return im
    L = sorted(luma(src[x, y]) for x, y in px)
    lo, hi = L[len(L) // 50], L[-max(1, len(L) // 50)]
    if hi - lo < 1:
        lo, hi = min(L), max(L) + 1

    # THE TWO ACCENTS, off this image's OWN extremes, exactly as the method says:
    # the dead dark glass at the bottom of its range, and the rust at the top of its
    # saturation. Nothing is picked by eye.
    def sat(p):
        return max(p[:3]) - min(p[:3])
    # AN ACCENT COMES OFF A DISTRIBUTION, NOT OFF ONE PIXEL. The first cut took the
    # single most saturated pixel and then flooded everything within 72% of it, and on
    # one wreck that pixel was a vivid tail-light red: the result was scarlet speckle
    # scattered over a grey car. Looked at, not computed -- the numbers were perfect
    # while the picture was wrong, which is this whole row's lesson.
    sats = sorted(sat(src[x, y]) for x, y in px)
    ACC_RUST_SAT = max(48, sats[int(len(sats) * 0.90)])
    # DEAD GLASS IS THE RAMP'S OWN BOTTOM, not a colour lifted off the photograph.
    # Sampling it left one unapproved colour on an otherwise approved car for the sake of
    # a near-black that asphalt's darkest tone already is. Every pixel on the finished
    # wreck now comes from an approved ramp and nothing is carried over from the photo
    # except the shape.
    acc_glass = ramp[0]
    ACC_GLASS_BELOW = lo + (hi - lo) * 0.06     # only the genuinely dead darks

    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    dst = out.load()
    n = len(ramp)
    for x, y in px:
        p = src[x, y]
        l = luma(p)
        if l <= ACC_GLASS_BELOW:
            dst[x, y] = (acc_glass[0], acc_glass[1], acc_glass[2], p[3])
            continue
        if rust and sat(p) >= ACC_RUST_SAT and p[0] > p[2]:
            # RUST IS A FAMILY, NOT A FLECK OF PAINT. The first cut took ONE warm colour
            # off the photograph and stamped it flat, and beside the body in his own
            # frame it read as loud paint: the body's loudest pixel is saturation 54 and
            # that stamp was 169. The bank already HAS a rust family -- terracotta, seven
            # approved tones -- so the rust is RAMPED by value exactly as the shell is,
            # which gives it real shading and keeps every colour on the car approved.
            tr = (l - lo) / (hi - lo)
            c = rust[int(round(min(1.0, max(0.0, tr)) * (len(rust) - 1)))]
            dst[x, y] = (c[0], c[1], c[2], p[3])
            continue
        t = (l - lo) / (hi - lo)
        i = int(round(min(1.0, max(0.0, t)) * (n - 1)))
        c = ramp[i]
        dst[x, y] = (c[0], c[1], c[2], p[3])

    # AND PIXELS TRAVEL IN GROUPS (craft LAW 1), WHICH APPLIES TO AN ACCENT TOO. A rust
    # fleck four pixels wide is rust; three scattered ones are noise wearing an accent's
    # name. Any accent cluster under four pixels goes back to the ramp at its own value.
    if rust:
        rset = set(rust)
        seen = set()
        for x, y in px:
            if (x, y) in seen or dst[x, y][:3] not in rset:
                continue
            stack, blob = [(x, y)], []
            seen.add((x, y))
            while stack:
                cx, cy = stack.pop()
                blob.append((cx, cy))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ax, ay = cx + dx, cy + dy
                    if (0 <= ax < w and 0 <= ay < h and (ax, ay) not in seen
                            and dst[ax, ay][3] > 0 and dst[ax, ay][:3] in rset):
                        seen.add((ax, ay))
                        stack.append((ax, ay))
            if len(blob) < 4:
                for bx, by in blob:
                    l2 = luma(src[bx, by])
                    t2 = (l2 - lo) / (hi - lo)
                    c2 = ramp[int(round(min(1.0, max(0.0, t2)) * (n - 1)))]
                    dst[bx, by] = (c2[0], c2[1], c2[2], src[bx, by][3])

    # ABSORB ORPHANS: a pixel with no 4-neighbour of its own colour takes the commonest
    # colour among its neighbours. Repeated until it settles, which is what stops the
    # noise a photograph leaves behind.
    for _ in range(4):
        moved = 0
        cur = out.load()
        nxt = out.copy()
        nd = nxt.load()
        for x, y in px:
            me = cur[x, y][:3]
            neigh = []
            same = False
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ax, ay = x + dx, y + dy
                if 0 <= ax < w and 0 <= ay < h and cur[ax, ay][3] > 0:
                    neigh.append(cur[ax, ay][:3])
                    if cur[ax, ay][:3] == me:
                        same = True
            if same or not neigh:
                continue
            c = Counter(neigh).most_common(1)[0][0]
            nd[x, y] = (c[0], c[1], c[2], cur[x, y][3])
            moved += 1
        out = nxt
        if not moved:
            break
    return out


def png_b64(im):
    b = io.BytesIO()
    im.save(b, format='PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode('ascii')


def load_b64(s):
    return Image.open(io.BytesIO(base64.b64decode(s))).convert('RGBA')


def fight_cars(path):
    """THE FIGHT CARRIES ITS OWN COPY, and a wreck that is pixel art on the street and a
    photograph in the fight is the same two-worlds problem one room along. The combat
    module is base64 inside COMBAT_B64, which is why no grep ever finds it."""
    src = io.open(path, encoding='utf-8').read()
    m = re.search(r"(const COMBAT_B64\s*=\s*')([A-Za-z0-9+/=]+)(')", src)
    if not m:
        return None
    js = base64.b64decode(m.group(2)).decode('utf-8')
    k = js.find('CAR_B64')
    if k < 0:
        return None
    a = js.find('[', k)
    d = 0
    for i in range(a, len(js)):
        if js[i] == '[':
            d += 1
        elif js[i] == ']':
            d -= 1
            if d == 0:
                break
    return src, m, js, a, i, re.findall(r'"(iVBOR[A-Za-z0-9+/=]+)"', js[a:i])


def city_cars(src):
    i = src.find('const PROP_B64')
    k = src.find('"car": [', i)
    j = src.find('],', k)
    return k, j, re.findall(r'"(iVBOR[A-Za-z0-9+/=]+)"', src[k:j])


def main():
    write = '--write' in sys.argv
    ramp = ramp_of('asphalt')
    # THE DARK HALF OF TERRACOTTA, and that is observation rather than taste. Oxidised
    # iron on a car left in the Mojave is dark red-brown; the bright end of that ramp is
    # FRESH CLAY TILE, which is what it was sampled from. Ramped across the whole family
    # the rust read as bright decals stuck on a grey car -- looked at beside the body in
    # his own frame, not computed. #78402a to #c6683b is the corroded end.
    rust = ramp_of('terracotta')[:4]
    print('THE CAR IS ASS -- measuring before anything is touched')
    print('  the ramp: asphalt, %d tones, %s' %
          (len(ramp), ' '.join('#%02x%02x%02x' % c for c in ramp)))

    src = io.open(CITY, encoding='utf-8').read()
    k, j, cars = city_cars(src)
    print('  %d city wrecks found\n' % len(cars))

    before, after, new = [], [], []
    for n, b in enumerate(cars):
        im = load_b64(b)
        mb = measure(im)
        out = recook(im, ramp, rust)
        ma = measure(out)
        before.append(mb); after.append(ma); new.append(png_b64(out))
        print('  car %2d  %4d -> %3d colours   single-use %.2f -> %.2f   orphan %.2f -> %.2f'
              % (n, mb['colours'], ma['colours'], mb['single'], ma['single'],
                 mb['orphan'], ma['orphan']))

    def med(rows, key):
        v = sorted(r[key] for r in rows)
        return v[len(v) // 2]

    print('\n  MEDIAN COLOURS      %5d -> %3d      (craft law ceiling %d)'
          % (med(before, 'colours'), med(after, 'colours'), CRAFT_COLOUR_CEILING))
    print('  MEDIAN SINGLE-USE    %.2f -> %.2f      (ceiling %.2f)'
          % (med(before, 'single'), med(after, 'single'), CRAFT_SINGLE_USE))
    print('  MEDIAN ORPHAN SHARE  %.2f -> %.2f'
          % (med(before, 'orphan'), med(after, 'orphan')))
    okc = sum(1 for r in after if r['colours'] <= CRAFT_COLOUR_CEILING)
    oks = sum(1 for r in after if r['single'] <= CRAFT_SINGLE_USE)
    print('  under the colour ceiling: %d of %d      under single-use: %d of %d'
          % (okc, len(after), oks, len(after)))

    if not write:
        print('\n  measure only. pass --write to cook.')
        return 0
    if okc != len(after) or oks != len(after):
        print('\n  REFUSING TO WRITE: the cook did not bring every car inside the craft law.')
        return 1

    body = '[' + ', '.join('"%s"' % s for s in new) + ']'
    out = src[:k] + '"car": ' + body + src[j + 1:]
    io.open(CITY, 'w', encoding='utf-8').write(out)
    print('\n  wrote %s (%d cars)' % (CITY, len(new)))

    # AND THE BANK IS THE SOURCE OF TRUTH, so it is recooked with the sibling or the
    # props gate is right to go red. It binds the two byte for byte -- "every banked
    # object actually reached the sibling" -- which is exactly the drift check that
    # caught this cook halfway through, and it earned its keep.
    FURN = 'banks/BOHEMIA_STREET_FURNITURE_8_21_26.txt'
    bank = json.load(io.open(FURN, encoding='utf-8'))
    bcars = bank['families']['car']
    if len(bcars) != len(new):
        print('  REFUSING to touch the bank: it has %d cars, the sibling %d'
              % (len(bcars), len(new)))
    else:
        for e, b64 in zip(bcars, new):
            im = load_b64(b64)
            e['b64'] = b64
            e['w'], e['h'] = im.width, im.height
            e['opaque'] = sum(1 for q in list(im.getdata()) if q[3] > 0)
        io.open(FURN, 'w', encoding='utf-8').write(
            json.dumps(bank, indent=1, ensure_ascii=False))
        print('  wrote %s (the bank\'s 20 cars, kept in step with the sibling)' % FURN)

    for path in (ALPHA, DEMO):
        got = fight_cars(path)
        if not got:
            print('  %s: no CAR_B64 -- skipped' % path)
            continue
        fsrc, m, js, a, z, fcars = got
        fnew, fb, fa = [], [], []
        for b in fcars:
            im = load_b64(b)
            fb.append(measure(im))
            o = recook(im, ramp, rust)
            fa.append(measure(o))
            fnew.append(png_b64(o))
        if any(r['colours'] > CRAFT_COLOUR_CEILING for r in fa):
            print('  %s: REFUSING -- a fight car stayed over the ceiling' % path)
            continue
        fbody = '[' + ','.join('"%s"' % s for s in fnew) + ']'
        js2 = js[:a] + fbody + js[z + 1:]
        enc = base64.b64encode(js2.encode('utf-8')).decode('ascii')
        fsrc = fsrc[:m.start(2)] + enc + fsrc[m.end(2):]
        io.open(path, 'w', encoding='utf-8').write(fsrc)
        print('  wrote %s (%d fight cars, median %d -> %d colours)'
              % (path, len(fnew), med(fb, 'colours'), med(fa, 'colours')))
    return 0


if __name__ == '__main__':
    sys.exit(main())
