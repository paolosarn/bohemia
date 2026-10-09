#!/usr/bin/env python3
"""THE SETTLEMENT PICTURES, FINISHED  (COOK [the settlement pictures finished] round 1, 10/10/26)

The row: COMBAT TWO cut the camp, the town and the fortress -- two variants a tier, each with
its night -- and RUN TWO's settlement screen draws them. "Paint over the cut: weather on the
walls, the ground worn where people walk, the signs, the trash, the light leaking from the
lit buildings at night; the hotspots unchanged; RUN TWO swaps the sheet."

*** SO THIS ROUND DOES NOT DRAW A SETTLEMENT. IT FINISHES THEIRS. *** Twelve sheets at
2060 x 1092 come in and twelve go out at the same size, with the same manifest and the same
hotspot boxes to the pixel, so RUN TWO swaps a file and changes nothing else.

WHAT WAS MISSING, LOOKING AT THEIR SHEET BESIDE THE REAL THING:
  THE WALLS ARE CLEAN. Nothing in this valley has been washed since the dollar died. A wall
  under a roof edge carries the dirt the rain brought down it, darkest at the top of the run
  and fading out, and it streaks from the corners and the sills, never evenly.
  NOBODY HAS WALKED ANYWHERE. The ground is one even surface between buildings people are
  supposed to be using all day. A worn path is not decoration, it is the record of where
  feet actually go, so the paths here are DERIVED FROM THE HOTSPOTS: the picture already
  says which buildings you can use, so the ground is worn between them and down to the
  bottom edge, which is where you arrive.
  NOTHING SAYS WHAT IT IS. A clinic, a barber, a stall and a notice board look alike from
  across the screen. Each usable building gets a hand-painted board above it, never over its
  hotspot, because a sign that covers the thing you tap is worse than no sign.
  NOBODY HAS DROPPED ANYTHING. Trash gathers where people stand and along the paths, not
  evenly over the floor.
  AND AT NIGHT THE LIT BUILDINGS ARE DARK. Their lamps throw clean pools, but the buildings
  that are open leak nothing: no light from the doorway on to the dirt in front of it. That
  is the one that makes a night picture read as a place rather than a map with lamps on it.

*** EVERY COLOUR THIS WRITES IS ALREADY IN THE PICTURE IT PAINTS OVER. *** Their sheets
carry thousands of colours (a lossless WebP of an antialiased render), so a palette ramp is
the wrong instrument. The rule that IS right, and that the gate measures: the finished
picture's colour set must be a SUBSET of the one that came in. Every stain, every path and
every sign is made by picking a colour the picture already had, which is why this reads as
their picture weathered rather than mine painted on top of theirs.

AND THE GROUND IS KNOWN EXACTLY, NOT GUESSED. Their own tool is imported and its ground()
layer is rendered at full size, so "is this pixel ground" is a comparison, not a colour
heuristic: a pixel is ground where the sheet still equals the ground layer, which means
nothing was drawn over it. Wear can only land where people could actually walk.

ONE LIGHT (rule 70a): the night leak is the same warm the sheet's own lamps are, sampled off
their brightest lamp pixels, so the doorway and the lamp cannot drift apart.

    python3 tools/bohemia_the_settlement_pictures_finished_cook_10_10_26.py
      -> slices/settlement_ground/*.webp              (in place, same names, same sizes)
      -> records/BOHEMIA_THE_SETTLEMENT_PICTURES_FINISHED_10_10_26.txt
      -> slices/vote/COOK_THE_SETTLEMENT_PICTURES_FINISHED.png

REFERENCE CHECK (the 9/4 standing law):
  AH-01 THE BIBLE: one register, the sun north-west, every shadow south-east; the grime is
        thought about at the source (rule 20) -- it is what the weather did, not a filter.
  CGRD-01 INTO THE BREACH: each usable building must say what it is from across the screen.
        The signs are that rule; they go above the hotspot, never over it.
  TG-04 THE STREET TILE, for the kerb-side wear where the path meets the road.
  REUSE CHECK: the sheets, the hotspots, the ground layer and the lamp colour all come from
        COMBAT TWO's own shipped tool and manifest at run time; nothing is re-cut.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md, the
  SETTLEMENT line: a BB town is a fixed illustration with clickable buildings, and it reads
  because each building is a silhouette you learn once and the ground under them is quiet.
  Taken. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g): a BB settlement looks the same
  on day one and day four hundred. Ours carries what has happened to it -- the paths are
  worn where the buildings you can actually use are, so a settlement with a clinic wears
  differently from one without, and at night the open doors are the only things still lit.
"""
import importlib, io, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
os.chdir(REPO)
sys.path.insert(0, HERE)

C2 = importlib.import_module('bohemia_combat2_settlement_pictures_cook_10_4_26')

GROUND_DIR = 'slices/settlement_ground'
MAN = GROUND_DIR + '/settlement_ground.json'
OUT_REC = 'records/BOHEMIA_THE_SETTLEMENT_PICTURES_FINISHED_10_10_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_SETTLEMENT_PICTURES_FINISHED.png'

def die(m): sys.exit('REFUSED: ' + m)


class R:
    def __init__(self, s): self.s = s & 0x7fffffff
    def __call__(self):
        self.s = (1103515245 * self.s + 12345) & 0x7fffffff
        return self.s / float(0x7fffffff)
    def i(self, n): return int(self() * n) % n


class Palette:
    """EVERY COLOUR THIS WRITES IS ALREADY IN THE PICTURE. Their sheets carry thousands of
       colours, so this keeps the exact set that came in and snaps anything computed to the
       nearest member of it. A 5-bit bucket index keeps the lookup cheap."""
    def __init__(self, arr):
        cols = np.unique(arr.reshape(-1, 3), axis=0)
        self.cols = cols.astype(np.int16)
        self.set = {tuple(int(v) for v in c) for c in cols}
        self.buckets = {}
        for c in self.cols:
            k = (c[0] >> 3, c[1] >> 3, c[2] >> 3)
            self.buckets.setdefault(k, []).append(c)
        self.memo = {}

    def snap(self, c):
        c = (int(c[0]), int(c[1]), int(c[2]))
        if c in self.set: return c
        if c in self.memo: return self.memo[c]
        best, bd = None, 1 << 30
        for dr in (0, -1, 1, -2, 2, -3, 3):
            for dg in (0, -1, 1, -2, 2, -3, 3):
                for db in (0, -1, 1, -2, 2, -3, 3):
                    k = ((c[0] >> 3) + dr, (c[1] >> 3) + dg, (c[2] >> 3) + db)
                    for e in self.buckets.get(k, ()):
                        d = (e[0]-c[0])**2 + (e[1]-c[1])**2 + (e[2]-c[2])**2
                        if d < bd: bd, best = d, e
            if best is not None and bd <= 9: break
        if best is None:
            d = ((self.cols.astype(np.int32) - np.array(c)) ** 2).sum(axis=1)
            best = self.cols[int(d.argmin())]
        out = (int(best[0]), int(best[1]), int(best[2]))
        self.memo[c] = out
        return out


def ground_mask(arr, tier, variant):
    """IS THIS PIXEL GROUND? A COMPARISON, NOT A GUESS. Their own tool draws the ground
       first and then puts the place on top of it, so a pixel is ground exactly where the
       finished sheet still equals the ground layer."""
    g = np.asarray(C2.ground(variant + 1, street=(tier != 'camp')).convert('RGB'), np.int16)
    if g.shape != arr.shape:
        return np.zeros(arr.shape[:2], bool)
    return (np.abs(g - arr.astype(np.int16)).sum(axis=2) <= 6)


def darker(pal, c, mult):
    return pal.snap((c[0] * mult, c[1] * mult, c[2] * mult))


def weather_the_walls(im, arr, gm, pal, seed):
    """WEATHER ON THE WALLS. Rain brings the roof's dirt down the face below it: darkest at
       the top of the run, fading out, heavier off the corners and the sills, never even.
       The run starts at a STRONG HORIZONTAL EDGE that has non-ground under it, which is
       what a roof line or a sill is, and it never starts on the ground."""
    d = ImageDraw.Draw(im)
    h, w, _ = arr.shape
    lum = arr.astype(np.int16).sum(axis=2)
    vstep = np.abs(lum[1:, :] - lum[:-1, :])
    r = R(seed * 31 + 7)
    px = im.load()
    runs = 0
    # *** AND THE FIRST CUT STREAKED THE ROOFS, WHICH IS THE WRONG SURFACE. *** Every strong
    # horizontal edge got a run down it, and a terracotta roof is full of them -- its own tile
    # lines -- so fifteen thousand runs went down the roof PLANES and turned them into a
    # smear. Seen from above a roof does not carry rain streaks running down the picture; the
    # WALL does, and in this forty-five degree view a wall is the thin band between the roof's
    # bottom edge and the dirt. So a run only starts where the ground is REACHED within a wall
    # height below it, which is what a wall is and what a roof plane never is.
    WALL = 54
    reaches_ground = np.zeros_like(gm)
    for yy in range(h - 1, -1, -1):
        below = gm[yy + 1: yy + 1 + WALL, :]
        reaches_ground[yy, :] = below.any(axis=0) if below.size else False
    for x in range(1, w - 1):
        y = 2
        while y < h - 40:
            if vstep[y, x] > 70 and not gm[y + 1, x] and not gm[y + 2, x] \
               and reaches_ground[y, x]:
                if r() < 0.42:
                    length = 8 + r.i(WALL)
                    strength = 0.70 + 0.22 * r()
                    for k in range(length):
                        yy = y + 2 + k
                        if yy >= h or gm[yy, x]: break
                        t = 1.0 - k / float(length)
                        m = 1.0 - (1.0 - strength) * (t ** 0.7)
                        px[x, yy] = darker(pal, px[x, yy], m)
                    runs += 1
                y += 40
            y += 1
    return runs


def wear_the_ground(im, arr, gm, pal, spots, seed):
    """THE GROUND WORN WHERE PEOPLE WALK, AND THE PATHS ARE DERIVED, NOT DECORATED. The
       picture already says which buildings you can use, so feet go between those and down
       to the bottom edge, which is where you arrive. A settlement with a clinic wears
       differently from one without."""
    h, w, _ = arr.shape
    px = im.load()
    pts = []
    for k, v in spots.items():
        x0, y0, x1, y1 = v['box']
        pts.append(((x0 + x1) // 2, min(h - 3, y1 + 16)))     # the ground at its door
    door = (w // 2, h - 6)
    legs = [(door, p) for p in pts]
    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            legs.append((pts[i], pts[j]))
    r = R(seed * 17 + 3)
    worn = 0
    for (ax, ay), (bx, by) in legs:
        n = max(2, int(math.hypot(bx - ax, by - ay) / 3))
        wob = 14 + r.i(16)
        for s in range(n + 1):
            t = s / float(n)
            cx = ax + (bx - ax) * t + math.sin(t * 3.1 + r.i(6)) * wob * (1 - abs(0.5 - t) * 2)
            cy = ay + (by - ay) * t
            # A PATH IS A NARROW WORN LINE, NOT A WIDE SOFT BLOB. The first cut used a big
            # radius with a smooth falloff and the overlapping blobs made one pale dune
            # across the dirt. Narrow, nearly flat across its width, with the edge doing the
            # reading: that is what a trodden path looks like from above.
            rad = 4 + int(2 * math.sin(t * math.pi))
            for dy in range(-rad, rad + 1):
                for dx in range(-rad, rad + 1):
                    xx, yy = int(cx + dx), int(cy + dy)
                    if not (0 <= xx < w and 0 <= yy < h) or not gm[yy, xx]: continue
                    dist = math.hypot(dx, dy * 1.6) / float(rad)
                    if dist > 1.0: continue
                    e = 1.0 if dist < 0.72 else (1.0 - dist) / 0.28
                    px[xx, yy] = darker(pal, px[xx, yy], 1.0 - 0.13 * e - 0.04 * r())
                    worn += 1
    return worn, pts


def the_trash(im, gm, pal, pts, seed):
    """TRASH GATHERS WHERE PEOPLE STAND, not evenly over the floor."""
    w, h = im.size
    px = im.load(); r = R(seed * 13 + 11); n = 0
    for (cx, cy) in pts:
        for _ in range(900):
            a = r() * 6.283; rad = 8 + r.i(130)
            xx, yy = int(cx + math.cos(a) * rad), int(cy + math.sin(a) * rad * 0.45)
            if not (0 <= xx < w - 2 and 0 <= yy < h - 2) or not gm[yy, xx]: continue
            c = px[xx, yy]
            sz = 1 + r.i(2)
            tone = darker(pal, c, 0.78) if r() < 0.55 else pal.snap((min(255, int(c[0]*1.18)),
                                                                    min(255, int(c[1]*1.16)),
                                                                    min(255, int(c[2]*1.10))))
            for dy in range(sz):
                for dx in range(sz + r.i(2)):
                    if 0 <= xx+dx < w and 0 <= yy+dy < h and gm[yy+dy, xx+dx]:
                        px[xx+dx, yy+dy] = tone; n += 1
    return n


SIGN_FOR = {'clinic': 'CLINIC', 'barber': 'CUTS', 'stall': 'TRADE',
            'posts': 'ROOMS', 'board': 'NOTICES'}


def the_signs(im, pal, spots, seed):
    """EACH USABLE BUILDING SAYS WHAT IT IS (CGRD-01). A hand-painted board on a bracket,
       ABOVE the hotspot and never over it: a sign that covers the thing you tap is worse
       than no sign, and the row says the hotspots are unchanged."""
    d = ImageDraw.Draw(im); r = R(seed * 7 + 5); made = 0
    try:
        f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf', 15)
    except Exception:
        f = ImageFont.load_default()
    for k, v in sorted(spots.items()):
        x0, y0, x1, y1 = v['box']
        word = SIGN_FOR.get(k, k.upper())
        tw = int(d.textlength(word, font=f))
        bw, bh = tw + 16, 24
        bx = max(2, min(im.size[0] - bw - 2, (x0 + x1) // 2 - bw // 2))
        by = y0 - bh - 10
        if by < 4:                                  # no room above: hang it beside, still clear
            by = max(4, y0 + 4); bx = max(2, x0 - bw - 10)
            if bx < 2: bx = min(im.size[0] - bw - 2, x1 + 10)
        board = pal.snap((176, 160, 128)); edge = pal.snap((92, 80, 60))
        ink = pal.snap((40, 34, 26))
        d.rectangle([bx + 2, by + 3, bx + bw + 2, by + bh + 3], fill=pal.snap((48, 42, 34)))
        d.rectangle([bx, by, bx + bw, by + bh], fill=board, outline=edge)
        d.line([(bx + bw // 2, by + bh), (bx + bw // 2, by + bh + 8)], fill=edge, width=2)
        # *** THE SIGN'S LETTERS ARE HARD PIXELS, NOT ANTIALIASED. *** Drawing text straight
        # on blends ink into board and invents about a hundred and forty colours a sheet that
        # were never in their picture -- the palette guard caught exactly that. The glyphs go
        # through a thresholded mask, so every letter pixel is the ink colour and nothing in
        # between exists.
        mk = Image.new('L', (bw, bh), 0)
        ImageDraw.Draw(mk).text((8, 4), word, font=f, fill=255)
        mk = mk.point(lambda a: 255 if a > 110 else 0)
        im.paste(Image.new('RGB', (bw, bh), ink), (bx, by), mk)
        for _ in range(10 + r.i(10)):               # nothing here is new, and it shows
            sx, sy = bx + r.i(bw), by + r.i(bh)
            im.putpixel((sx, sy), pal.snap(tuple(int(c * 0.82) for c in im.getpixel((sx, sy)))))
        made += 1
    return made


def light_from_the_doors(im, arr, gm, pal, spots, seed):
    """THE LIGHT LEAKING FROM THE LIT BUILDINGS. Their lamps throw clean pools and the
       buildings that are open leak nothing, which is what makes the night read as a map
       with lamps on it instead of a place. ONE LIGHT (rule 70a): the warm is sampled off
       the sheet's OWN brightest lamp pixels, so the doorway and the lamp cannot drift."""
    h, w, _ = arr.shape
    lum = arr.astype(np.int32).sum(axis=2)
    hot = arr.reshape(-1, 3)[np.argsort(lum.reshape(-1))[-400:]]
    warm = hot.mean(axis=0)
    px = im.load(); r = R(seed * 23 + 9); lit = 0
    # *** AND THE LEAK IS MEASURED ON ITS OWN. *** The first guard took the net change in the
    # night ground's luminance and the night sheets came back DARKER: the wear and the trash
    # darken the same ground the doorways light, and the net hid both. So the leak records
    # exactly which pixels it touched and how much it moved them, and nothing else is in that
    # number.
    touched = np.zeros(arr.shape[:2], bool)
    gain = [0.0, 0]
    for k, v in sorted(spots.items()):
        x0, y0, x1, y1 = v['box']
        cx = (x0 + x1) // 2
        top = y1
        rad = max(46, (x1 - x0))
        for dy in range(0, int(rad * 0.8)):
            for dx in range(-rad, rad + 1):
                xx, yy = cx + dx, top + dy
                if not (0 <= xx < w and 0 <= yy < h) or not gm[yy, xx]: continue
                e = 1.0 - math.hypot(dx / float(rad), dy / float(rad * 0.8))
                if e <= 0: continue
                e = e ** 1.6 * (0.80 + 0.2 * r())
                c = px[xx, yy]
                nc = pal.snap(tuple(c[i] + (warm[i] - c[i]) * 0.52 * e for i in range(3)))
                px[xx, yy] = nc
                touched[yy, xx] = True
                gain[0] += sum(nc) - sum(c); gain[1] += 1
                lit += 1
        for yy in range(max(0, y1 - 14), y1):        # the opening itself, catching it
            for xx in range(max(0, cx - 14), min(w, cx + 14)):
                c = px[xx, yy]
                px[xx, yy] = pal.snap(tuple(c[i] + (warm[i] - c[i]) * 0.30 for i in range(3)))
    return lit, (gain[0] / gain[1] if gain[1] else 0.0)


def finish(tier, variant, night, spots, log, gm_day=None):
    src = '%s/%s_%d%s.webp' % (GROUND_DIR, tier, variant, '_night' if night else '')
    if not os.path.exists(src): die('missing sheet ' + src)
    im = Image.open(src).convert('RGB')
    before = im.copy()
    arr = np.asarray(im, np.uint8)
    pal = Palette(arr)
    # *** THE NIGHT SHEET IS GRADED, SO THE RAW GROUND LAYER NO LONGER MATCHES IT, AND THE
    # FIRST RUN REFUSED ON EXACTLY THAT -- correctly. The geometry of a night variant is its
    # day variant's, pixel for pixel; only the light differs. So the mask is taken ONCE off
    # the day sheet, where the comparison is exact, and reused for its night. Loosening the
    # comparison until the night passed would have been the cheat: it would have let wear
    # land on walls.
    gm = gm_day if night else ground_mask(arr, tier, variant)
    if gm is None or gm.sum() < arr.shape[0] * arr.shape[1] * 0.02:
        die('%s: the ground layer did not line up with the sheet (%d px), so wear would land '
            'anywhere' % (src, int(gm.sum()) if gm is not None else 0))
    seed = (hash(tier) % 97) * 10 + variant + (5 if night else 0)
    runs = weather_the_walls(im, arr, gm, pal, seed)
    worn, pts = wear_the_ground(im, arr, gm, pal, spots, seed)
    trash = the_trash(im, gm, pal, pts, seed)
    signs = the_signs(im, pal, spots, seed)
    leak, leak_gain = light_from_the_doors(im, arr, gm, pal, spots, seed) if night else (0, 0.0)
    return dict(src=src, im=im, before=before, pal=pal, gm=gm,
                runs=runs, worn=worn, trash=trash, signs=signs, leak=leak,
                leak_gain=leak_gain)


def guards(done, man, man_before, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    ok('THE HOTSPOTS ARE UNCHANGED, which is the row\'s own condition: the manifest\'s boxes '
       'are identical to the pixel', json.dumps(man, sort_keys=True) == json.dumps(man_before, sort_keys=True),
       'RUN TWO swaps the sheet and changes nothing else; a moved box breaks every tap')

    for d in done:
        a, b = d['im'], d['before']
        ok('SAME PICTURE, SAME SIZE: %s is %dx%d in and out' % (os.path.basename(d['src']),
                                                                a.size[0], a.size[1]),
           a.size == b.size)

    for d in done:
        after = {tuple(int(v) for v in c) for c in
                 np.unique(np.asarray(d['im'], np.uint8).reshape(-1, 3), axis=0)}
        new = after - d['pal'].set
        ok('EVERY COLOUR IS ALREADY IN THEIR PICTURE: %s wrote %d colours that were not'
           % (os.path.basename(d['src']), len(new)), not new,
           'their sheets carry thousands of colours, so the rule is a SUBSET, not a ramp')

    for d in done:
        ch = (np.asarray(d['im'], np.int16) != np.asarray(d['before'], np.int16)).any(axis=2)
        share = 100.0 * ch.sum() / ch.size
        on_ground = 100.0 * (ch & d['gm']).sum() / max(1, ch.sum())
        ok('%s: %.1f%% of the picture is painted, and %.0f%% of the wear lands on ground'
           % (os.path.basename(d['src']), share, on_ground),
           share > 0.8 and share < 45.0)

    for d in done:
        ok('%s got all five signs, the weather and the trash: %d sign(s), %d wall runs, '
           '%d trash marks' % (os.path.basename(d['src']), d['signs'], d['runs'], d['trash']),
           d['signs'] >= 5 and d['runs'] > 40 and d['trash'] > 100)

    for d in done:
        if '_night' not in d['src']: continue
        ok('AND AT NIGHT THE OPEN DOORS LEAK ON TO THE DIRT: %s lit %d px of ground from its '
           'doorways and lifted each of them %.1f' % (os.path.basename(d['src']), d['leak'],
                                                      d['leak_gain']),
           d['leak_gain'] > 3.0 and d['leak'] > 2000,
           'a night picture with dark doorways is a map with lamps on it')
    return fails


BG=(16,15,14); INK=(238,232,220); DIM=(150,142,130); HOT=(226,162,72)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def card(done):
    pick = [d for d in done if d['src'].endswith('town_0.webp')] or [done[0]]
    night = [d for d in done if d['src'].endswith('town_0_night.webp')] or [done[-1]]
    pw = 700
    rows = [('THE TOWN, DAY', pick[0]), ('THE TOWN, NIGHT', night[0])]
    ph = int(pw * pick[0]['im'].size[1] / pick[0]['im'].size[0])
    pad, top = 26, 96
    W = pad * 3 + pw * 2
    H = top + (ph + 86) * len(rows) + 150
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    f28, f18, f15, f13 = font(28), font(18), font(15), font(13)
    d.text((pad, 24), 'THE SETTLEMENT PICTURES, FINISHED', font=f28, fill=INK)
    d.text((pad, 60), 'the same sheet, painted over: weather on the walls, the ground worn '
                      'where people walk, the signs, the trash, the doors leaking at night '
                      '  ***   COOK 10/10', font=f15, fill=DIM)
    y = top
    for title, dd in rows:
        im.paste(dd['before'].resize((pw, ph), Image.LANCZOS), (pad, y))
        im.paste(dd['im'].resize((pw, ph), Image.LANCZOS), (pad * 2 + pw, y))
        d.rectangle([pad, y, pad + pw, y + ph], outline=(70, 66, 60))
        d.rectangle([pad * 2 + pw, y, pad * 2 + pw * 2, y + ph], outline=(70, 66, 60))
        d.text((pad, y + ph + 8), 'BEFORE  ' + title, font=f18, fill=HOT)
        d.text((pad * 2 + pw, y + ph + 8), 'AFTER  ' + title, font=f18, fill=HOT)
        d.text((pad * 2 + pw, y + ph + 30),
               '%d wall runs, %d worn ground px, %d trash marks, %d signs%s'
               % (dd['runs'], dd['worn'], dd['trash'], dd['signs'],
                  (', %d px lit from the doorways' % dd['leak']) if dd['leak'] else ''),
               font=f13, fill=(150, 200, 140))
        y += ph + 86
    d.text((pad, H - 108), 'TWELVE SHEETS IN, TWELVE OUT, SAME SIZE AND SAME HOTSPOT BOXES '
                           'TO THE PIXEL: run two swaps a file and changes nothing else.',
           font=f15, fill=INK)
    d.text((pad, H - 80), 'the paths are DERIVED, not decorated: the picture already says '
                          'which buildings you can use, so the ground is worn between those '
                          'and down to where you arrive', font=f13, fill=DIM)
    d.text((pad, H - 58), 'every colour written was already in their picture; the ground is '
                          'known by comparing against their own ground layer, not guessed '
                          'from colour', font=f13, fill=DIM)
    d.text((pad, H - 36), 'the night warm is sampled off their own brightest lamp pixels, so '
                          'the doorway and the lamp cannot drift apart (rule 70a)',
           font=f13, fill=DIM)
    return im


def main():
    man_before = json.load(open(MAN))
    man = json.load(open(MAN))
    done = []
    for tier, tv in man['tiers'].items():
        spots = tv['hotspots']
        for variant in range(len(tv['variants'])):
            gm_day = None
            for night in (False, True):
                d = finish(tier, variant, night, spots, None, gm_day)
                if not night: gm_day = d['gm']
                done.append(d)
                print('  painted %s' % os.path.basename(d['src']))

    log = []
    fails = guards(done, man, man_before, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    for d in done:
        d['im'].save(d['src'], 'WEBP', lossless=True)
    os.makedirs('slices/vote', exist_ok=True)
    card(done).save(OUT_CARD)

    L = []
    L.append('THE SETTLEMENT PICTURES, FINISHED -- MEASURED  (COOK, 10/10/26, rule 71a)')
    L.append('=' * 78)
    L.append('')
    L.append('THE ROW: COMBAT TWO cut the camp, the town and the fortress, two variants a')
    L.append('tier with their nights, and RUN TWO\'s settlement screen draws them. "Paint over')
    L.append('the cut: weather on the walls, the ground worn where people walk, the signs, the')
    L.append('trash, the light leaking from the lit buildings at night; the hotspots')
    L.append('unchanged; RUN TWO swaps the sheet."')
    L.append('')
    L.append('SO THIS ROUND DOES NOT DRAW A SETTLEMENT, IT FINISHES THEIRS. Twelve sheets at')
    L.append('2060 x 1092 in, twelve out, same size and the same hotspot boxes to the pixel.')
    L.append('')
    L.append('WHAT WAS MISSING, LOOKING AT THEIR SHEET BESIDE THE REAL THING:')
    L.append('  THE WALLS ARE CLEAN. Nothing here has been washed since the dollar died. A')
    L.append('  wall under a roof edge carries what the rain brought down it: darkest at the')
    L.append('  top of the run, fading out, heavier off the corners, never even.')
    L.append('  NOBODY HAS WALKED ANYWHERE. The ground is one even surface between buildings')
    L.append('  people use all day. A worn path is the record of where feet go, so THE PATHS')
    L.append('  HERE ARE DERIVED FROM THE HOTSPOTS: the picture already says which buildings')
    L.append('  you can use, so the ground is worn between those and down to the bottom edge,')
    L.append('  which is where you arrive. A settlement with a clinic wears differently from')
    L.append('  one without.')
    L.append('  NOTHING SAYS WHAT IT IS. A clinic, a barber, a stall and a notice board look')
    L.append('  alike from across the screen (CGRD-01). Each gets a hand-painted board ABOVE')
    L.append('  its hotspot, never over it: a sign that covers the thing you tap is worse than')
    L.append('  no sign.')
    L.append('  NOBODY HAS DROPPED ANYTHING. Trash gathers where people stand, not evenly.')
    L.append('  AND AT NIGHT THE LIT BUILDINGS ARE DARK. Their lamps throw clean pools and the')
    L.append('  open buildings leak nothing. That is what makes a night picture read as a map')
    L.append('  with lamps on it instead of a place.')
    L.append('')
    L.append('*** EVERY COLOUR THIS WRITES WAS ALREADY IN THE PICTURE IT PAINTS OVER. ***')
    L.append('Their sheets carry thousands of colours (a lossless WebP of an antialiased')
    L.append('render), so a palette ramp is the wrong instrument. The rule that IS right, and')
    L.append('that the gate measures: the finished picture\'s colour set is a SUBSET of the one')
    L.append('that came in. Every stain, path and sign is made by picking a colour the picture')
    L.append('already had, which is why it reads as their picture weathered rather than mine')
    L.append('painted on top of theirs.')
    L.append('')
    L.append('AND THE GROUND IS KNOWN EXACTLY, NOT GUESSED. Their own tool is imported and its')
    L.append('ground() layer rendered at full size, so "is this pixel ground" is a comparison:')
    L.append('a pixel is ground where the sheet still equals the ground layer, meaning nothing')
    L.append('was drawn over it. Wear can only land where people could actually walk, and the')
    L.append('build refuses if the ground layer does not line up with the sheet.')
    L.append('')
    L.append('ONE LIGHT (rule 70a): the night leak is the same warm the sheet\'s own lamps are,')
    L.append('sampled off their brightest pixels, so the doorway and the lamp cannot drift.')
    L.append('')
    L.append('WHAT EACH SHEET GOT:')
    for d in done:
        L.append('  %-26s %4d wall runs  %7d worn px  %5d trash  %d signs%s'
                 % (os.path.basename(d['src']), d['runs'], d['worn'], d['trash'], d['signs'],
                    ('  %6d px lit from doorways' % d['leak']) if d['leak'] else ''))
    L.append('')
    L.append('THE GUARDS, EVERY ONE RUN, EVERY ONE ABLE TO REFUSE THE BUILD:')
    for st, line, why in log:
        L.append('  %-4s %s' % (st.upper(), line))
    L.append('')
    L.append('[bb the overworld is battle brothers] reference/library/battle_brothers/')
    L.append('  01_WORLDMAP.md, the SETTLEMENT line: a BB town is a fixed illustration with')
    L.append('  clickable buildings, and it reads because each building is a silhouette you')
    L.append('  learn once and the ground under them is quiet. Taken. WHAT MOVES THAT THEIR')
    L.append('  PICTURE DOES NOT: a BB settlement looks the same on day one and day four')
    L.append('  hundred. Ours carries what has happened to it, and the paths are worn where')
    L.append('  the buildings you can actually use are.')
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('')
    for p in (OUT_CARD, OUT_REC):
        print('  wrote %s  (%d KB)' % (p, os.path.getsize(p) // 1024))


if __name__ == '__main__':
    main()
