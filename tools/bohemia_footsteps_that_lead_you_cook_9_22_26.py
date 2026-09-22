#!/usr/bin/env python3
"""
FOOTSTEPS THAT LEAD YOU  (COOK, 9/22/26, [footprints])

HIS WORDS, from the first votes: "make pixel art of footsteps that lead you to the
conclusion." It is the first open line of this lane and the coordinator posted it this
round.

RULE 12 FIRST, AND THE PREMISE IS REAL. There ARE tracks in this game already and they are
NOT this. __WHOSE_FOOTPRINTS_ARE_THESE__ (9/12) is a MAP-scale faction trail: a coloured
thread in the holder's own ink, fading along its length, drawn at whole-valley zoom so you
can see which way a party went. DIRECTION passed it on 9/13. It is a LINE, not a foot, and
nothing anywhere in this game draws a foot shape -- swept for it before drawing anything
(the 232 hits on "footprint" in the city are BUILDING footprints from the district kit,
which is the wrong-oracle trap this lane has now been caught by eleven times, so it was
checked rather than counted).

So the art he asked for is genuinely missing, and this is it: A BOOT PRINT AT THE SIZE THE
BODY IS, laid as a trail on the ground he walks on.

WHAT A PRINT IS, AND WHY IT COSTS NO NEW COLOUR. A print in dust is a shallow DEPRESSION,
not a stain. So it is drawn the way every other solid in this game is lit: the sun is in the
north-west (the approved roof set names roof_hipTL the lit corner and roof_hipTR the shaded
one, and the sign cook's shadow goes east), so the far wall of the depression catches light
and the near wall falls into shade. In pixels that is: the sole steps DOWN the family's own
ramp, and a one-pixel rim on the sun side steps UP. Every colour in a print is already in
the ground it is printed on, so ONE PALETTE PER FAMILY cannot break, and a print works on
asphalt, concrete, dust or deck without a second decision.

THE SIZE IS THE BODY'S, NOT THE TILE'S. Rule 21: a person is one pixel size on every surface
(112 box, about 100 px painted) and the camera moves the ground, never him. A boot is about
a sixth of a standing body, so 16 x 7 px, and it stays that on the street and in the fight.

IT FADES THE WAY THE TRAIL ALREADY APPROVED FADES. DIRECTION's 9/13 verdict on the map
trails: "every trail fades along its length with the brightest end as the head... a trail is
the only mark with a luminance gradient along a path". The same rule here, one scale down:
the newest print is deepest and the oldest is nearly gone. That is continuity with a judged
rule, not a new invention.

AND IT LEADS SOMEWHERE, which is the half his sentence is actually about. A print is a fact;
a TRAIL is a sentence. So the trail walks, turns, and ARRIVES -- the card shows it arriving,
because "leads you to the conclusion" is the job and a swatch of one boot would not show it.

  THE DOWN VOTE THAT TAUGHT ME TO BUILD THE CARD THIS WAY. He voted my fight-floor card
  DOWN with two words: "No difference." He was right about what he was shown. That card put
  two fields of dark asphalt side by side and asked him to find a change that was real in
  the numbers (9,635 colours to 57) and nearly invisible at the size I drew it. The art was
  fine -- DIRECTION passed the same tiles on the glass a round later and said the cold blue
  was gone. THE CARD WAS THE FAILURE. So this one shows the thing DOING ITS JOB at the size
  he sees it, not a swatch and not a before-and-after of something subtle.

REFERENCE CHECK (the 9/4 standing law):
  AH-01  THE ANALOG HORROR BIBLE. R1 THE ORDINARY FRAME, ONE WRONG THING: an empty street,
         and one set of prints crossing it that nobody is at the end of. R4 THE LIGHT WAS IN
         THE ROOM: a depression is lit by the same sun as everything else and that is the
         entire drawing rule here; no mark glows and nothing is tinted. R3 THE LONG HOLD:
         prints do not animate, they are a still fact left behind, which is the cheapest
         dread this game owns.
  TG-03  THE YARD TILE and TG-04 THE STREET TILE: the families and their ramps. Taken
         unchanged -- a print borrows the ground's own colours and adds none.
  CGRD-03 A VEGAS BLOCK FROM THE AIR: in real dust, a walked line is visible as a trodden
         path long after the individual prints have blurred, and individual prints survive
         only in soft ground. That is the structural rule behind the surfaces: deep and
         crisp in dust, shallow and short-lived on asphalt.
  REUSE CHECK: the ground tiles under the trail are the city's own shipped street and side
  and the bank's yard and dirt. No ground pixel is authored here; the prints are drawn from
  the ramp those tiles already use.

    python3 tools/bohemia_footsteps_that_lead_you_cook_9_22_26.py
"""
import base64, io, json, os, re, sys
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
CITY = os.path.join(REPO, 'slices/BOHEMIA_CITY_TILES_01.js')
OUT  = os.path.join(REPO, 'banks/BOHEMIA_THE_FOOTSTEPS_9_22_26.txt')

BOOT_W, BOOT_H = 9, 20          # a boot is about a fifth of a 100 px body
LUM = lambda c: 0.299*c[0] + 0.587*c[1] + 0.114*c[2]

def die(m): sys.exit('REFUSED: ' + m)

def img(b64):
    return Image.open(io.BytesIO(base64.b64decode(b64 + '=' * (-len(b64) % 4)))).convert('RGBA')

def load():
    b = json.load(open(BANK))
    T = {e['id']: e for e in b['tiles']}
    t = open(CITY, encoding='utf-8', errors='replace').read()
    m = re.search(r'SA_TILES\s*=\s*\{', t)
    if not m: die('SA_TILES is not where this tool expects it')
    i = t.index('{', m.start()); d = 0
    for j in range(i, len(t)):
        if t[j] == '{': d += 1
        elif t[j] == '}':
            d -= 1
            if d == 0: return T, json.loads(t[i:j+1]), b['method']['one_palette_per_family']
    die('unbalanced braces reading SA_TILES')

def hexramp(cs):
    return sorted([tuple(int(c.lstrip('#')[i:i+2], 16) for i in (0, 2, 4)) for c in cs], key=LUM)

# ---------------------------------------------------------------- the boot
#  A BOOT SOLE FROM ABOVE: heel, waist, ball, toe. Depth, not colour:
#    2 = the sole, pressed in       3 = the edges of heel and ball, pressed hardest
#    1 = the rim of dust pushed up  0 = untouched ground
#  Drawn as a mask so it can be printed on any family without a second decision.
# THE FOURTH SHAPE, AND I AM NAMING IT AS THE TELL. STOP PRODUCING says a fourth version
# means you already failed, so here is what failed: THREE TIMES I TREATED "IT DOES NOT READ"
# AS A NUMBERS PROBLEM -- nudge harder, go darker, push the ramp ends -- WHEN IT WAS A
# DRAWING PROBLEM. The old mask was 7 px wide with a one-pixel rim on BOTH sides, so five
# of every seven pixels were edge and the sole it was supposed to have was three pixels of
# core. It was mostly outline, which is exactly how it rendered: a pale ghost of a boot
# instead of a boot. The fix is not another value; it is a sole that is actually a sole.
#
# So: the sole is drawn SOLID at 9 x 20, and the rim is DERIVED rather than drawn -- any
# sole pixel whose north or west neighbour is open ground is the lip the north-west sun
# catches. That is one rule instead of a hand-placed border, it cannot get out of step with
# the light, and it leaves the sole its whole width.
BOOT = [
    "...333...",
    "..33333..",
    ".3333333.",
    ".3333333.",
    ".3333333.",
    ".3333333.",
    ".3333333.",
    "..33333..",
    "..33333..",
    "...333...",
    "...333...",
    "...333...",
    "...333...",
    "..33333..",
    ".3333333.",
    ".3333333.",
    ".3333333.",
    ".3333333.",
    "..33333..",
    "...333...",
]

def boot_mask(right=False):
    rows = [list(r) for r in BOOT]
    if right: rows = [list(reversed(r)) for r in rows]
    return rows

def stamp(px, W, H, x0, y0, mask, ramp, age):
    """Press a print into the ground at x0,y0.

    A PRINT IS A SHAPE, NOT A NUDGE, AND THE FIRST VERSION OF THIS PROVED IT THE HARD WAY.
    That one moved every covered pixel ONE step along the ramp from ITS OWN value. It
    reported 779 pixels pressed per patch, every guard passed, and the render came back with
    NOTHING VISIBLE ON ANY OF THE FOUR SURFACES. On a cracked seven-value ground a one-step
    nudge is smaller than the noise already there, and a print laid across a crack came out
    half light and half dark, which is not a boot, it is more noise. THE NUMBER LIED AND THE
    PICTURE TOLD THE TRUTH, for the twelfth time in this lane.

    So the sole is laid as ONE SOLID TONE measured off the ground's own median value, two
    steps down, and the sun-side rim as one solid tone two steps up. Solid, because an
    object reads by its shape and its edge; measured off the median, because that is what
    makes it sit ON the ground instead of fighting the crack underneath it. Every tone is
    still a step of the family's own ramp, so no colour is invented."""
    n = len(ramp)
    # the ground's own level here, taken over the print's whole box rather than per pixel
    vals = []
    for ry in range(len(mask)):
        for rx in range(len(mask[0])):
            x, y = x0 + rx, y0 + ry
            if 0 <= x < W and 0 <= y < H: vals.append(LUM(px[x, y][:3]))
    if not vals: return 0
    vals.sort()
    base = min(range(n), key=lambda i: abs(LUM(ramp[i]) - vals[len(vals) // 2]))
    # A HOLE IS A HOLE WHATEVER IT IS IN, and the second version of this was still too
    # polite: two steps off the local median is about the same size as the crack noise
    # already in the ground, so the prints came back as faint ovals instead of boots. The
    # sole goes to the family's OWN dark end and the rim to its light end, and `age` walks
    # them back toward the ground. That is both more readable and more true: the depth of a
    # footprint does not depend on how bright the patch of dirt under it happens to be.
    deep = int(round(base - (base - 1) * age))
    rim  = int(round(base + (n - 2 - base) * age))
    deep = max(0, min(n - 1, deep)); rim = max(0, min(n - 1, rim))
    laid = 0
    H2, W2 = len(mask), len(mask[0])
    solid = lambda ry, rx: 0 <= ry < H2 and 0 <= rx < W2 and mask[ry][rx] != '.'
    for ry, row in enumerate(mask):
        for rx, ch in enumerate(row):
            if ch == '.': continue
            x, y = x0 + rx, y0 + ry
            if x < 0 or y < 0 or x >= W or y >= H: continue
            # THE RIM IS DERIVED, NOT DRAWN: a sole pixel with open ground to its north or
            # west is the lip of the hollow, and the north-west sun lands on exactly that.
            lip = (not solid(ry - 1, rx)) or (not solid(ry, rx - 1))
            px[x, y] = (ramp[rim] if lip else ramp[deep]) + (255,)
            laid += 1
    return laid

def main():
    T, SA, RAMPS = load()

    # the four grounds a print can land on, each with its own family ramp
    SURFACES = [
        ('the road',     'asphalt',  [img(b) for b in SA['street'][:4]]),
        ('the sidewalk', 'concrete', [img(b) for b in SA['side'][:4]]),
        ('a dust yard',  'ground',   [img(T[k]['b64']) for k in ('yard_0', 'yard_1', 'yard_2', 'dirt')]),
        ('a flat roof',  'deck',     [img(T['roof_deck']['b64'])] * 4),
    ]
    ramps = {f: hexramp(RAMPS[f]) for _, f, _ in SURFACES}

    # ---- THE TRAIL: a walk that turns and arrives. Left, right, left, right.
    #      Stride is a real one: about 0.75 m, and a valley tile is 0.75 m.
    def walk(W, H):
        """the path, in pixels, as (x, y, heading, foot)"""
        import math
        pts = []
        # IT HAS TO CROSS THE PATCH AND ARRIVE, because "lead you to the conclusion" is the
        # job. The first walk used a stride tuned to nothing and ran off the corner after
        # eight prints, which bunched the whole trail in one corner of the card.
        x, y, ang = W * 0.04, H * 0.88, -0.42
        side = 0
        STRIDE = 52          # about two and a half boot lengths, which is a human stride
        for i in range(40):
            if i > 4: ang += 0.115                    # it turns, because a path turns
            x += math.cos(ang) * STRIDE
            y += math.sin(ang) * STRIDE
            if x < 2 or y < 2 or x > W - 2 or y > H - 2: break
            pts.append((x, y, ang, side))
            side ^= 1
        return pts

    made = {}
    report = []
    for label, fam, tiles in SURFACES:
        ramp = ramps[fam]
        TW = tiles[0].size[0]
        # A REAL STRIDE NEEDS ROOM. A boot is 20 px and a human stride is about two and a
        # half boots, so consecutive prints must sit ~50 px apart or they overlap into a
        # smear -- which is what the first walks did at the bottom of the patch. The patch
        # is sized to the walk rather than the walk squeezed into the patch.
        CW, CH = TW * 12, TW * 5
        patch = Image.new('RGBA', (CW, CH))
        for ty in range(0, CH, TW):
            for tx in range(0, CW, TW):
                patch.paste(tiles[((tx // TW) + (ty // TW) * 3) % len(tiles)], (tx, ty))
        px = patch.load()
        pts = walk(CW, CH)
        if len(pts) < 6: die('%s: the walk laid only %d prints' % (label, len(pts)))
        laid = 0
        for n, (x, y, ang, side) in enumerate(pts):
            # THE FADE HAS A FLOOR. At 0.35 the oldest third of the trail fell below the
            # ground's own noise and the render came back looking like the prints only
            # existed near the end -- a trail you cannot follow backwards is not a trail.
            # 0.62 to 1.0 keeps the whole run readable while the head is still plainly the
            # freshest, which is the gradient DIRECTION passed for the map trails.
            age = 0.62 + 0.38 * (n / float(len(pts) - 1))
            off = 4 if side else -4
            import math
            ox = x + math.cos(ang + math.pi / 2) * off
            oy = y + math.sin(ang + math.pi / 2) * off
            laid += stamp(px, CW, CH, int(ox) - BOOT_W // 2, int(oy) - BOOT_H // 2,
                          boot_mask(right=bool(side)), ramp, age)
        cols = len(set(p[:3] for p in patch.getdata() if p[3] > 8))
        onramp = all(c in set(ramp) for c in
                     set(p[:3] for p in patch.getdata() if p[3] > 8)) if fam != 'concrete' else None
        report.append((label, fam, len(pts), laid, cols, CW, CH))
        made[label] = patch

    # ---- the guards
    pad = lambda s, n: (s + ' ' * n)[:n]
    print('A BOOT IS %d x %d PX, which is about a sixth of the 100 px body rule 21 fixes.'
          % (BOOT_W, BOOT_H))
    print()
    print(pad('surface', 14) + pad('family', 11) + pad('prints', 8) + pad('pixels pressed', 16) + 'colours in the patch')
    for label, fam, n, laid, cols, CW, CH in report:
        print(pad(label, 14) + pad(fam, 11) + pad(str(n), 8) + pad(str(laid), 16) + str(cols))
        if laid < n * 60:
            die('%s pressed only %d pixels for %d prints -- the print is not landing on this '
                'ground, which means its ramp match is wrong' % (label, laid, n))

    # EVERY COLOUR IN A PRINT IS ALREADY IN THE GROUND IT IS PRINTED ON. If this ever fails,
    # the print has invented a colour and ONE PALETTE PER FAMILY is broken.
    for label, fam, tiles in SURFACES:
        before = set()
        for t in tiles: before |= set(p[:3] for p in t.getdata() if p[3] > 8)
        after = set(p[:3] for p in made[label].getdata() if p[3] > 8)
        new = after - before - set(ramps[fam])
        if new:
            die('%s: the prints invented %d colours that are neither in the ground nor on its '
                'ramp: %s' % (label, len(new), sorted(new)[:4]))
    print()
    print('NO PRINT INVENTED A COLOUR: every pixel of every print is already in the ground it '
          'is pressed into, or on that family\'s own ramp.')

    doc = {
        'version': 'BOHEMIA_THE_FOOTSTEPS_v1', 'built': '2026-09-22', 'lane': 'COOK [footprints]',
        'his_words': 'make pixel art of footsteps that lead you to the conclusion',
        'boot_px': [BOOT_W, BOOT_H],
        'boot_mask': BOOT,
        'rule': 'a print is a DEPRESSION, not a stain: the sole steps DOWN the family ramp and '
                'a one-pixel rim on the sun side steps UP. The sun is north-west, the same '
                'corner every other tile in this game is lit from. A print therefore borrows '
                'the ground\'s own colours and adds none, and works on any family.',
        'fade': 'the newest print is deepest and the oldest nearly gone -- the rule DIRECTION '
                'passed on 9/13 for the map trails, one scale down.',
        'size': 'rule 21: the body is one pixel size everywhere, so a boot is %d x %d px on the '
                'street and in the fight alike.' % (BOOT_W, BOOT_H),
        'not_the_map_trail': '__WHOSE_FOOTPRINTS_ARE_THESE__ (9/12) is a coloured thread at '
                'whole-valley zoom and stays exactly as it is. This is the walk-scale art that '
                'never existed.',
        'surfaces': {l: {'family': f, 'prints': n, 'pixels_pressed': p}
                     for l, f, n, p, c, w, h in report},
        'not_shipped': 'rule 18: this is a bank and a VOTE candidate. It goes on the ground the '
                       'round the hold allows.'
    }
    with open(OUT, 'w') as f: json.dump(doc, f, indent=1)
    if not json.load(open(OUT)).get('boot_mask'): die('read-back failed')
    print('wrote %s  (%.0f KB)' % (os.path.relpath(OUT, REPO), os.path.getsize(OUT) / 1024))

    for label in made:
        made[label].save('/tmp/foot_%s.png' % label.replace(' ', '_'))
    json.dump([r[0] for r in report], open('/tmp/foot_order.json', 'w'))

if __name__ == '__main__':
    main()
