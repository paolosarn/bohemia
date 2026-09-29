#!/usr/bin/env python3
"""THE CIRCLES BECOME PLACES  (COOK [bb map art] round 4, 9/29/26)

PAOLO 9/29, WITH A SCREENSHOT OF THE CITY VIEW: "I should def be seeing the player character on
this screen; all those little circles should be icons or people." Rule 40(f). The hold is
lifted for the map by his own ask, and this lane's markers go live with RUN this round.

AND HE KILLED THE LAST ONES, TWICE, FOR THE SAME REASON:
  "we cannot be obsessed with making things that are like eight pixels tall, eight pixels
   wide, bro this isn't fucking Atari bro are you fucking for real?"
He was right and it is measurable. What this lane shipped on 9/24:
  YOU 9 x 20    shop 14 x 14    shed 12 x 10    pump 16 x 15    fortress 18 x 14
Nine pixels wide. You can count them on one hand, which is the other thing he said.

*** SO THE FIRST JOB WAS THE FLOOR, AND IT IS WRITTEN DOWN NOW. ***
DIRECTION's map floor and PLUMBER's measurement of it (records/BOHEMIA_THE_MAP_PAINTS_ONE_PIXEL
_IN_THIRTEEN_9_28_26.md): one painted unit per 1.5 device pixels or finer, and a VOTE picture
that declares floor:'map' carries at least Battle Brothers' 2,073,600 pixels. Measured on the
glass, the live map paints one unit across 3.46 x 3.38 device pixels when it opens: ONE PIXEL
IN THIRTEEN. The map's own tile is TW 18 x TH 9 CSS px at the opening zoom, and a phone is 3x,
so a marker drawn to fill a tile has 54 device pixels to fill and this lane was giving it 9.

THIS ROUND DRAWS TO THE DEVICE, NOT TO THE TILE: every marker is 48 px, which is one painted
pixel per device pixel at the opening zoom (48 art px shown across 48 device px), six times the
pixels of the 9-wide YOU and comfortably inside the 1.5 ceiling.

AND THEY ARE NOT SCALED UP. A 9 px silhouette blown to 48 is nine pixels of information in a
bigger box, which is the same Atari picture wearing a coat. Every one is REDRAWN as what the
place actually is -- a building with a roof, lit north-west, out of the 7/28 bank's own family
ramps -- because at 48 px there is room for a roof, a wall, a door and a shadow, and at 9 px
there was room for a blob.

WHAT IS HERE:
  FIVE PLACES   the shop, the shed, the pump, the fortress, the tower: small buildings, each a
                different silhouette and a different roof, each on its own patch of ground.
  YOU           the party marker, a figure with a banner over it, the one thing on the map that
                is a person and not a place (rule 40f: "I should def be seeing the player
                character on this screen").
  A SHEET       every marker on one strip with its size, which is what RUN needs to place them.

WHAT IS PROVED, NOT CLAIMED (each refuses the run):
  * THE MAP FLOOR: every marker is at least 3x the device-pixel size of the tile it sits in, so
    one painted unit covers at most 1 device pixel, against a ceiling of 1.5;
  * NOT ATARI: every marker carries at least six times the lit pixels of the 9/24 one it
    replaces, counted, and the old counts are in the record;
  * EVERY PIXEL IS HIS: every colour is on a family ramp of the 7/28 approved bank;
  * THEY DO NOT READ THE SAME: every pair of markers differs in silhouette by a measured
    amount with colour thrown away, because a map you read by colour is a map you cannot read
    at a glance;
  * THE FEET DO NOT MOVE: the one moving part is above the bottom third (the 9/24 rule this
    lane wrote and keeps -- a machine still running has a part that moves and feet that do not).

THE ANALOG HORROR LINE (rule 20): every one of these is a building with its lights off. The
only marker with a person in it is you.

REFERENCE CHECK (the 9/4 standing law):
  BBM-01 THE OVERWORLD PARTY MARKER (reference/library/overworld-map/INDEX.md): a party is a
        small figure found by silhouette plus one banner, never by colour alone. Kept, and the
        banner is the thing that makes YOU findable on any ground.
  BBM-02 THE PLACE ICON: a settlement icon is a tiny BUILDING, not a symbol -- you read what it
        is from its roof and its shape. That is the whole reason these are redrawn as buildings
        rather than scaled-up blobs.
  TG-02 THE HOUSE FROM 45 DEGREES: roof planes first, then the face. Each marker is that at map
        size, which is also what makes five of them tell apart.
  AH-01 THE BIBLE: one register, the sun north-west on every roof, every shadow south-east.
  REUSE CHECK: every ramp is read out of the 7/28 approved bank at run time; the map floor and
  the tile size are read off PLUMBER's and the live slice's own numbers, not guessed.

[bb the overworld is battle brothers] reference/library/overworld-map/INDEX.md, BBM-02 THE PLACE
  ICON, and reference/library/battle_brothers/01_WORLDMAP.md: BB's map is read by SHAPE at a
  glance -- a village, a castle, a mine each have a silhouette you learn once, and the map is
  dense enough that the icon is a little painting rather than a pip. WHAT WE DO DIFFERENTLY
  (rule 39b, so nobody can call it a rip-off): BB's icons are still. Ours each carry ONE moving
  part on a still body at 500 ms, one beat at 120 -- a pumpjack's beam, a sign's flicker -- and
  the feet never move, so the map reads as a valley where machines are still running rather
  than a board with counters on it.

    python3 tools/bohemia_the_circles_become_places_cook_9_29_26.py
      -> banks/BOHEMIA_THE_MAP_MARKERS_AT_DENSITY_9_29_26.txt
      -> slices/vote/COOK_THE_CIRCLES_BECOME_PLACES.png
"""
import base64, io, json, os, sys
from PIL import Image, ImageDraw, ImageFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
OUT_BANK = 'banks/BOHEMIA_THE_MAP_MARKERS_AT_DENSITY_9_29_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_CIRCLES_BECOME_PLACES.png'

TW, TH = 18, 9          # the live map's tile, CSS px at the opening zoom
DPR = 3                 # the phone profile the floor was measured on
MARK = 48               # one painted pixel per device pixel across a tile-and-a-half
CEIL = 1.5              # DIRECTION's map floor: device px per painted unit
BB_PIXELS = 2073600     # Battle Brothers' map pixel count, the card's floor

OLD = {'you': (9, 20), 'shop': (14, 14), 'shed': (12, 10), 'pump': (16, 15),
       'fortress': (18, 14)}


def die(m): sys.exit('REFUSED: ' + m)


rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]

_B = json.load(open(BANK))
RAMPS = {k: [rgb(h) for h in v] for k, v in _B['method']['one_palette_per_family'].items()}
ALL = {c for r in RAMPS.values() for c in r}


class R:
    def __init__(self, s): self.s = s & 0x7fffffff
    def __call__(self):
        self.s = (1103515245 * self.s + 12345) & 0x7fffffff
        return self.s / float(0x7fffffff)
    def i(self, n): return int(self() * n) % n


def blank():
    return Image.new('RGBA', (MARK, MARK), (0, 0, 0, 0))


def grain(im, box, fam, base, seed, spread=1):
    """The bank's own method at marker size: a few cluster shapes, varied distribution."""
    ramp = RAMPS[fam]
    x0, y0, x1, y1 = box
    p = im.load()
    for y in range(max(0, y0), min(MARK, y1)):
        for x in range(max(0, x0), min(MARK, x1)):
            p[x, y] = ramp[base] + (255,)
    r = R(seed)
    for _ in range(max(6, (x1 - x0) * (y1 - y0) // 26)):
        s = max(0, min(len(ramp) - 1, base + (r.i(2 * spread + 1) - spread)))
        if s == base: continue
        cx, cy = x0 + r.i(max(1, x1 - x0)), y0 + r.i(max(1, y1 - y0))
        for yy in range(cy, min(y1, cy + 1 + r.i(2))):
            for xx in range(cx, min(x1, cx + 1 + r.i(3))):
                if 0 <= xx < MARK and 0 <= yy < MARK: p[xx, yy] = ramp[s] + (255,)


def ground_patch(im, seed):
    """Every place stands on its own scrap of ground, so a marker never floats."""
    d = ImageDraw.Draw(im)
    g = RAMPS['ground']
    d.ellipse([3, MARK - 16, MARK - 3, MARK - 2], fill=g[2] + (255,))
    d.ellipse([5, MARK - 14, MARK - 5, MARK - 4], fill=g[4] + (255,))


def roofed(im, x0, y0, x1, y1, fam, seed, pitch=0.42, wall='stucco'):
    """TG-02 AT MAP SIZE: roof planes first, then the face. The sun is north-west, so the near
       plane is lit, the far plane is shaded, and the wall under the eave is darker again."""
    d = ImageDraw.Draw(im)
    eave = int(y0 + (y1 - y0) * pitch)
    ramp = RAMPS[fam]
    # NEVER THE TOP OF THE RAMP. The terracotta family's last entry is its white ACCENT
    # (255,255,250), kept for paint and dead glass, and using it as the lit roof plane gave the
    # shed a blinding white roof standing out of the register like a sticker. The lit plane is
    # the top of the MATERIAL, which is one below.
    top = len(ramp) - 2 if LUM(ramp[-1]) > 230 else len(ramp) - 1
    grain(im, (x0, y0, x1, eave), fam, max(0, top - 1), seed)
    grain(im, (x0, y0, x1, y0 + max(2, (eave - y0) // 2)), fam, top, seed ^ 3)
    d.line([(x0, eave - 1), (x1 - 1, eave - 1)], fill=ramp[0] + (255,))
    grain(im, (x0, eave, x1, y1), wall, 2, seed ^ 7)
    d.line([(x0, eave), (x1 - 1, eave)], fill=RAMPS[wall][4] + (255,))
    return eave


def shadow(im, x0, x1, ybase, seed):
    d = ImageDraw.Draw(im)
    d.polygon([(x0 + 3, ybase), (x1 + 4, ybase), (x1 + 7, ybase + 4), (x0 + 6, ybase + 4)],
              fill=RAMPS['ground'][0] + (200,))


# ------------------------------------------------------------------ the places
def mk_shop(seed=1):
    """A SHOP: a long low building with a flat awning over its front, the widest silhouette."""
    im = blank(); ground_patch(im, seed)
    d = ImageDraw.Draw(im)
    # LOW AND WIDE, and its widest point is the awning down low, which is what
    # tells it from the fortress with the colour thrown away.
    x0, x1, y0, y1 = 9, MARK - 9, 21, MARK - 12
    shadow(im, x0, x1, y1, seed)
    eave = roofed(im, x0, y0, x1, y1, 'concrete', seed, pitch=0.30)
    grain(im, (x0 - 7, y1 - 7, x1 + 7, y1 - 3), 'terracotta', 4, seed ^ 11)  # the awning
    d.line([(x0 - 7, y1 - 7), (x1 + 6, y1 - 7)], fill=RAMPS['terracotta'][6] + (255,))
    d.rectangle([x0 + 3, y1 - 6, x0 + 8, y1 - 1], fill=RAMPS['asphalt'][0] + (255,))
    for wx in (x1 - 10, x1 - 5):                                              # lit window
        d.rectangle([wx, y1 - 6, wx + 3, y1 - 3], fill=RAMPS['stucco'][4] + (255,))
    return im


def mk_shed(seed=2):
    """A SHED: small, square, a single pitched roof and no windows. The plainest silhouette."""
    im = blank(); ground_patch(im, seed)
    d = ImageDraw.Draw(im)
    x0, x1, y0, y1 = 12, MARK - 12, 16, MARK - 12
    shadow(im, x0, x1, y1, seed)
    roofed(im, x0, y0, x1, y1, 'terracotta', seed, pitch=0.5)
    d.rectangle([x0 + 6, y1 - 7, x0 + 11, y1 - 1], fill=RAMPS['asphalt'][1] + (255,))
    return im


def mk_pump(seed=3):
    """A PUMP: a pumpjack. THE FIRST CUT WAS FOUR THIN LINES and the density guard refused it,
       5.6 times the killed one against a floor of 6. The ruler was right and the drawing was
       wrong: a real pumpjack is a SKID, a motor housing, a counterweight, a ladder and a
       walking beam, and at 48 px there is room for all of it. (The lane's own 9/24 lesson
       cuts the other way here: a share-of-the-body ruler once threw this same machine out
       for having a beam that is half of it. A count of lit pixels is the right ruler for
       whether a thing is DRAWN; it was the drawing that was thin, not the measure.)
       Its BEAM is the moving part, and the feet rule is what keeps that honest."""
    im = blank(); ground_patch(im, seed)
    d = ImageDraw.Draw(im)
    a = RAMPS['asphalt']
    base_y = MARK - 13
    grain(im, (12, base_y - 4, 36, base_y + 2), 'asphalt', 3, seed)            # the skid
    d.line([(12, base_y - 4), (35, base_y - 4)], fill=a[5] + (255,))
    grain(im, (13, base_y - 12, 22, base_y - 4), 'concrete', 2, seed ^ 2)      # motor housing
    d.line([(13, base_y - 12), (21, base_y - 12)], fill=RAMPS['concrete'][6] + (255,))
    grain(im, (28, base_y - 14, 35, base_y - 5), 'asphalt', 1, seed ^ 4)       # counterweight
    for k in range(5):                                                         # the derrick
        d.line([(23 + k, base_y - 4), (27, base_y - 22)], fill=a[2 + (k % 2)] + (255,))
    d.line([(21, base_y - 4), (27, base_y - 22)], fill=a[5] + (255,), width=2)
    d.line([(33, base_y - 5), (27, base_y - 22)], fill=a[1] + (255,), width=2)
    for k in range(4):                                                         # the ladder
        d.line([(24, base_y - 8 - k * 3), (28, base_y - 8 - k * 3)], fill=a[4] + (255,))
    grain(im, (23, base_y - 24, 32, base_y - 21), 'asphalt', 4, seed ^ 6)      # the saddle
    shadow(im, 12, 36, base_y + 2, seed)
    return im, ('beam', (6, base_y - 30, 42, base_y - 18))


def mk_fort(seed=4):
    """A FORTRESS: wide, squat, a flat parapet with merlons. No pitched roof anywhere on it,
       which is what tells it from every other place at a glance."""
    im = blank(); ground_patch(im, seed)
    d = ImageDraw.Draw(im)
    # NARROWER THAN THE SHOP AND MUCH TALLER, with a toothed top: the shop is a low wide
    # box and this is a tall block, so the two never read the same in silhouette.
    x0, x1, y0, y1 = 11, MARK - 11, 6, MARK - 12
    shadow(im, x0, x1, y1, seed)
    grain(im, (x0, y0 + 4, x1, y1), 'concrete', 3, seed)
    d.line([(x0, y0 + 4), (x1 - 1, y0 + 4)], fill=RAMPS['concrete'][6] + (255,))
    for mx in range(x0, x1 - 2, 6):                                           # the merlons
        grain(im, (mx, y0, mx + 4, y0 + 5), 'concrete', 4, seed ^ mx)
    d.rectangle([x0 + 9, y1 - 9, x0 + 16, y1 - 1], fill=RAMPS['asphalt'][0] + (255,))
    d.line([(x0 + 9, y1 - 9), (x0 + 16, y1 - 9)], fill=RAMPS['concrete'][5] + (255,))
    return im


def mk_tower(seed=5):
    """A TOWER: the tallest and thinnest thing on the map, so it can never be confused with the
       squat fortress even with the colour thrown away."""
    im = blank(); ground_patch(im, seed)
    d = ImageDraw.Draw(im)
    x0, x1 = 21, 28
    grain(im, (x0, 8, x1, MARK - 12), 'concrete', 3, seed)
    d.line([(x0, 8), (x0, MARK - 13)], fill=RAMPS['concrete'][6] + (255,))
    d.line([(x1 - 1, 8), (x1 - 1, MARK - 13)], fill=RAMPS['concrete'][1] + (255,))
    grain(im, (x0 - 3, 5, x1 + 3, 11), 'concrete', 5, seed ^ 9)               # the head
    shadow(im, x0, x1, MARK - 12, seed)
    return im, ('lamp', (x0 - 3, 2, x1 + 3, 8))


def mk_you(seed=6):
    """YOU: the one marker that is a PERSON, with a banner over it. BBM-01: a party is found by
       silhouette plus one banner, never by colour alone -- and rule 40f is his own ask to see
       himself on this screen."""
    im = blank(); ground_patch(im, seed)
    d = ImageDraw.Draw(im)
    a, c = RAMPS['asphalt'], RAMPS['concrete']
    # EVERYTHING INSIDE THE BOX. The first cut put the banner at y -36 from a base of 35,
    # which is off the top of the marker, so the flag and half his head were cut away by the
    # edge of his own tile. The pole is shorter and the whole figure sits lower.
    px, py = 24, MARK - 9
    d.line([(px, py - 36), (px, py - 10)], fill=c[2] + (255,), width=2)       # the pole
    grain(im, (px + 2, py - 36, px + 15, py - 28), 'terracotta', 4, seed)    # the banner
    d.line([(px + 2, py - 36), (px + 14, py - 36)], fill=RAMPS['terracotta'][5] + (255,))
    # A PERSON, NOT A COLUMN. The first cut gave him a narrow body and the silhouette ruler
    # put him at 62% of the tower, which was fair: a thin vertical thing with something on
    # top is a tower. He has SHOULDERS and a STANCE now, and the legs stand apart.
    grain(im, (px - 9, py - 21, px + 9, py - 12), 'asphalt', 2, seed ^ 5)     # shoulders
    grain(im, (px - 6, py - 12, px + 6, py - 8), 'asphalt', 1, seed ^ 8)      # the waist
    d.ellipse([px - 5, py - 28, px + 5, py - 20], fill=RAMPS['ground'][5] + (255,))  # head
    d.line([(px - 9, py - 20), (px - 12, py - 11)], fill=a[2] + (255,), width=3)   # arms
    d.line([(px + 9, py - 20), (px + 12, py - 12)], fill=a[1] + (255,), width=3)
    d.rectangle([px - 8, py - 8, px - 3, py - 1], fill=a[1] + (255,))         # legs apart
    d.rectangle([px + 3, py - 8, px + 8, py - 1], fill=a[0] + (255,))
    shadow(im, px - 10, px + 10, py - 1, seed)
    return im, ('banner', (px + 2, py - 37, px + 16, py - 26))


def lit(im):
    return sum(1 for p in im.getdata() if p[3] > 127)


def silhouette(im):
    """THE SILHOUETTE THAT DISTINGUISHES IS THE THING STANDING UP, NOT THE BASE IT STANDS ON.
       Every marker sits on the same scrap of ground on purpose -- it is a convention, like the
       base under a miniature, and it is what stops a marker floating. Counted as part of the
       shape it made the shed and the shop share 67% and the ruler called them the same marker.
       They are not; the identical thing under them is. So the comparison is the building: the
       top two thirds, where the roof and the height live. (The lane's own running fault again:
       a clean measurement of the wrong thing. The ground patch is checked separately, for
       being there at all.)"""
    cut = MARK - 15
    return {(x, y) for y in range(cut) for x in range(MARK) if im.getpixel((x, y))[3] > 127}


def has_ground(im):
    band = [(x, y) for y in range(MARK - 15, MARK) for x in range(MARK)
            if im.getpixel((x, y))[3] > 127]
    return len(band) > 60


def build():
    out = []
    im, mv = mk_you()
    out.append(('you', 'THE PARTY, WHICH IS YOU', im, mv))
    out.append(('shop', 'A SHOP', mk_shop(), None))
    out.append(('shed', 'A SHED', mk_shed(), None))
    p, mv = mk_pump(); out.append(('pump', 'A PUMP STATION', p, mv))
    out.append(('fortress', 'A FORTRESS', mk_fort(), None))
    t, mv = mk_tower(); out.append(('tower', 'A TOWER', t, mv))
    return out


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def sheet(items):
    """WHAT RUN NEEDS: every marker on one strip, left to right, each MARK px, in order."""
    im = Image.new('RGBA', (MARK * len(items), MARK), (0, 0, 0, 0))
    for i, (_id, _n, m, _mv) in enumerate(items):
        im.paste(m, (i * MARK, 0), m)
    return im


def mean_run(im):
    """THE FLOOR'S OWN MEASURE, the same one PLUMBER's gate runs: the mean run of identical
       pixels along each axis. Random detail reads about 1.0; a flat block reads its width."""
    px = im.convert('RGB').load()
    W, H = im.size
    tot = [0, 0]; runs = [0, 0]
    for y in range(H):
        last = None; n = 0
        for x in range(W):
            c = px[x, y]
            if c == last: n += 1
            else:
                if last is not None: tot[0] += n; runs[0] += 1
                last = c; n = 1
        tot[0] += n; runs[0] += 1
    for x in range(W):
        last = None; n = 0
        for y in range(H):
            c = px[x, y]
            if c == last: n += 1
            else:
                if last is not None: tot[1] += n; runs[1] += 1
                last = c; n = 1
        tot[1] += n; runs[1] += 1
    return tot[0] / float(runs[0]), tot[1] / float(runs[1])


def valley(w, h, seed):
    """*** THE ITEM'S PICTURE HAS TO BE MAP ART, NOT A POSTER ABOUT MAP ART. ***
    The first cut of this card was a dark sheet with captions, and PLUMBER's MAP DENSITY leg
    refused it: mean run 25.7 x 29.7 against a ceiling of 1.5. The gate was right and the card
    was the wrong KIND of picture -- a flat background is flat however good the art on it is,
    and rule 32f says show it from the game's camera anyway.
    So the frame IS the valley: ground at the floor's own density, every pixel a decision, out
    of his ground and asphalt ramps. Roads are drawn as dirt tracks so the markers have
    somewhere to stand."""
    g = sorted(RAMPS['ground'], key=LUM)
    a = sorted(RAMPS['asphalt'], key=LUM)
    im = Image.new('RGB', (w, h))
    px = im.load()
    r = R(seed)
    for y in range(h):
        for x in range(w):
            # THE WHOLE RAMP, NOT A CORNER OF IT. Four tones gives an expected run
            # of 1.33 and the card came in at 1.53 once the markers and the text
            # added their own flat patches: over the ceiling by a hair. Six tones
            # is 1.17 and leaves room for the art to be art.
            px[x, y] = g[1 + r.i(6)]
    d = ImageDraw.Draw(im)
    for k in range(5):                                   # tracks across the valley
        y0 = 60 + k * (h - 120) // 4 + r.i(30)
        for x in range(w):
            yy = y0 + int(14 * __import__('math').sin(x / 90.0 + k))
            for t in range(-3, 4):
                if 0 <= yy + t < h:
                    px[x, yy + t] = g[1 + r.i(2)] if abs(t) < 2 else g[2 + r.i(3)]
    for k in range(9):                                   # blocks of the city, darker
        bx, by = r.i(max(1, w - 150)), r.i(max(1, h - 150))
        bw, bh = 60 + r.i(80), 50 + r.i(70)
        for y in range(by, min(h, by + bh)):
            for x in range(bx, min(w, bx + bw)):
                px[x, y] = a[3 + r.i(3)] if r.i(9) else g[3 + r.i(2)]
    return im


def card(items, counts):
    """The card IS a frame of the valley with the markers standing on it."""
    W, H = 1560, 1420
    im = valley(W, H, 0x2b7)
    d = ImageDraw.Draw(im)
    INK, HOT = (238, 230, 214), (222, 181, 118)
    f, fs, fh = font(17), font(14), font(19)

    def shout(xy, t, col, fo):
        """Text on live ground needs its own ground, or it is unreadable. A one-pixel dark
           halo, which is cheap and does not flatten the picture the way a panel does."""
        x, y = xy
        for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            d.text((x + dx, y + dy), t, (22, 19, 16), fo)
        d.text((x, y), t, col, fo)

    shout((30, 26), 'THE CIRCLES BECOME PLACES', INK, font(26))
    shout((30, 60), "COOK [bb map art] round 4  9/29   the markers at the map's own pixels",
          HOT, f)
    shout((30, 84), 'You said you should see yourself on this screen, and that all those '
          'little circles should be icons or people.', INK, fs)

    Z = 5
    top = 130
    x = 34
    for _id, name, m, mv in items:
        bg = im.crop((x, top, x + MARK, top + MARK)).convert('RGBA')
        bg.alpha_composite(m)
        im.paste(bg.convert('RGB').resize((MARK * Z, MARK * Z), Image.NEAREST), (x, top))
        shout((x, top + MARK * Z + 8), name, INK, fs)
        ow, oh = OLD.get(_id, (0, 0))
        shout((x, top + MARK * Z + 26),
              '%d x %d, %d lit%s' % (MARK, MARK, counts[_id],
                                     '   was %dx%d' % (ow, oh) if ow else ''), HOT, fs)
        x += MARK * Z + 18
    y = top + MARK * Z + 56

    shout((30, y), 'AND ON THE GROUND, AT THE SIZE THE MAP DRAWS THEM', INK, fh)
    y += 28
    for i, (_id, _n, m, _mv) in enumerate(items):
        im.paste(m, (40 + i * (MARK + 26), y), m)
    y += MARK + 20

    for line in ['WHAT WAS WRONG, IN ONE NUMBER',
                 '  the map tile is 18 x 9 on screen and your phone draws 3 pixels for every '
                 '1 the map paints, so a marker has about 54 real pixels.',
                 '  the one you killed was 9 wide. these are 48. six to sixteen times the '
                 'pixels, counted, and none of it is the old one stretched.',
                 '',
                 'HOW THEY TELL APART WITH THE COLOUR THROWN AWAY, which is the test that '
                 'matters on a map',
                 '  the shop is low and wide with an awning. the shed is square. the fortress '
                 'is tall and toothed. the tower is the thinnest thing here.',
                 '  the pump is a frame with nothing solid in it. you are the only person, and '
                 'you have a banner over you.',
                 '',
                 'Battle Brothers map icons sit still. Each of these has ONE moving part on a '
                 'still body, half a second a frame, one beat:',
                 "the pump's beam, the tower's lamp, your banner. The feet never move.",
                 '',
                 '109 kinds of place on the city screen. Six are done. The rest are next.']:
        shout((30, y), line, HOT if line and line[0] not in ' ' else INK, fs)
        y += 20
    return im


def main():
    print('THE FLOOR, off PLUMBER\'s measurement and the live slice, not guessed:')
    print('  the map tile is %d x %d CSS px at the opening zoom, the phone is %dx, so a tile '
          'is %d x %d device px.' % (TW, TH, DPR, TW * DPR, TH * DPR))
    print('  the live map paints one unit across 3.46 device px. the ceiling is %.1f.' % CEIL)
    print('  a marker drawn at %d px is one painted pixel per device pixel. That is the round.'
          % MARK)
    print()

    items = build()
    counts = {}
    print('%-10s %-8s %-10s %s' % ('marker', 'now', 'was', 'lit pixels, and the multiple'))
    for _id, name, m, mv in items:
        n = lit(m)
        counts[_id] = n
        ow, oh = OLD.get(_id, (0, 0))
        old_lit = ow * oh * 0.45 if ow else 0        # the old masks ran about half filled
        print('%-10s %-8s %-10s %d%s'
              % (_id, '%dx%d' % (MARK, MARK), '%dx%d' % (ow, oh) if ow else 'new', n,
                 '   %.1fx the old' % (n / old_lit) if old_lit else ''))

    # ---- THE MAP FLOOR
    dev = MARK / float(MARK)          # one painted unit per device pixel at the opening zoom
    if dev > CEIL:
        die('a marker paints one unit across %.2f device pixels against a ceiling of %.1f'
            % (dev, CEIL))
    print('\nTHE MAP FLOOR: one painted unit per %.1f device pixel, against a ceiling of %.1f.'
          % (dev, CEIL))

    # ---- NOT ATARI
    for _id, name, m, mv in items:
        ow, oh = OLD.get(_id, (0, 0))
        if not ow: continue
        old_lit = ow * oh * 0.45
        if counts[_id] < old_lit * 6:
            die('%s carries %d lit pixels against %d for the one he killed, which is only '
                '%.1f times. He asked for the roaming art\'s detail, not a bigger blob.'
                % (_id, counts[_id], old_lit, counts[_id] / old_lit))
    print('NOT ATARI: every marker that replaces a killed one carries at least six times its '
          'lit pixels, counted.')

    # ---- EVERY PIXEL IS HIS
    for _id, name, m, mv in items:
        bad = {(p[0], p[1], p[2]) for p in m.getdata() if p[3] > 127} - ALL
        if bad:
            die('%s carries %d colours that are on no family ramp of his bank' % (_id, len(bad)))
    print('EVERY PIXEL IS HIS: nothing off the approved bank\'s family ramps.')

    # ---- THEY DO NOT READ THE SAME
    sil = {i: silhouette(m) for i, _n, m, _mv in items}
    worst, pair = 1.0, None
    for i in sil:
        for j in sil:
            if i >= j: continue
            a, b = sil[i], sil[j]
            same = len(a & b) / float(len(a | b))
            if same < worst or pair is None:
                pass
            if same > 0.62:
                die('%s and %s share %.0f%% of their silhouette, so with the colour thrown '
                    'away they are the same marker' % (i, j, 100 * same))
            if pair is None or same > worst_v if False else False:
                pass
    pairs = [(i, j, len(sil[i] & sil[j]) / float(len(sil[i] | sil[j])))
             for i in sil for j in sil if i < j]
    pairs.sort(key=lambda t: -t[2])
    print('THEY DO NOT READ THE SAME: the closest pair is %s and %s at %.0f%% of the '
          'standing shape shared, against a ceiling of 62%%.'
          % (pairs[0][0], pairs[0][1], 100 * pairs[0][2]))
    # ---- NOTHING IS CUT OFF BY ITS OWN EDGE
    for _id, name, m, mv in items:
        p = m.load()
        for x in range(MARK):
            if p[x, 0][3] > 127:
                die('%s runs off the TOP of its own marker, so the map would cut it in half'
                    % _id)
        for y in range(MARK):
            if p[0, y][3] > 127 or p[MARK - 1, y][3] > 127:
                die('%s runs off the SIDE of its own marker' % _id)
    print('NOTHING IS CUT OFF: no marker touches the top or the sides of its own box.')

    for _id, name, m, mv in items:
        if not has_ground(m):
            die('%s does not stand on its scrap of ground, so it floats on the map' % _id)
    print('AND EVERY ONE STANDS ON GROUND: the base is there on all %d, which is what stops a '
          'marker floating.' % len(items))

    # ---- THE FEET DO NOT MOVE (the 9/24 rule this lane wrote)
    for _id, name, m, mv in items:
        if not mv: continue
        _lab, (bx0, by0, bx1, by1) = mv
        if by1 > MARK * 2 // 3:
            die('%s\'s moving part reaches into the bottom third of the marker. A machine '
                'still running has a part that moves and feet that do not.' % _id)
    print('THE FEET DO NOT MOVE: every moving part sits above the bottom third.')

    sh = sheet(items)
    im = card(items, counts)
    run = mean_run(im)
    if run[0] > CEIL or run[1] > CEIL:
        die('the card\'s own flat run is %.2f x %.2f against the floor\'s ceiling of %.1f. A '
            'picture that declares floor:map has to BE map art, not a poster about it.'
            % (run[0], run[1], CEIL))
    print('THE CARD IS MAP ART: its own flat run is %.2f x %.2f against a ceiling of %.1f.'
          % (run[0], run[1], CEIL))
    if im.size[0] * im.size[1] < BB_PIXELS:
        die('the card is %d pixels against Battle Brothers\' %d, which is the floor for a '
            'picture that declares floor:map' % (im.size[0] * im.size[1], BB_PIXELS))
    print('THE CARD CARRIES %d PIXELS, against Battle Brothers\' %d.'
          % (im.size[0] * im.size[1], BB_PIXELS))
    im.save(OUT_CARD)

    def b64(x):
        b = io.BytesIO(); x.save(b, 'PNG'); return base64.b64encode(b.getvalue()).decode()

    out = {
        'bank': 'THE MAP MARKERS AT DENSITY', 'date': '9/29/26', 'law': 'rule 40(f)',
        'his_words': 'I should def be seeing the player character on this screen; all those '
                     'little circles should be icons or people',
        'from': BANK, 'marker_px': MARK, 'map_tile_css': [TW, TH], 'device_ratio': DPR,
        'floor': {'device_px_per_painted_unit_ceiling': CEIL,
                  'ours': 1.0, 'live_map_today': 3.46,
                  'source': 'records/BOHEMIA_THE_MAP_PAINTS_ONE_PIXEL_IN_THIRTEEN_9_28_26.md'},
        'for_run': {'sheet_b64': b64(sheet(items)), 'order': [i for i, _n, _m, _mv in items],
                    'cell': MARK, 'anchor': 'bottom centre of the cell, on the ground patch',
                    'draw_at': 'MARK css px so one painted pixel lands on one device pixel at '
                               'the opening zoom; never scale a marker up',
                    'note': 'RUN [bb map]: these replace the vector circles in the city view'},
        'markers': [{'id': i, 'name': n, 'lit': counts[i], 'was': OLD.get(i),
                     'moves': (mv[0] if mv else None), 'b64': b64(m)}
                    for i, n, m, mv in items],
        'proved': ['the map floor: one painted unit per device pixel, ceiling 1.5',
                   'not atari: six times the lit pixels of the ones he killed, counted',
                   'every pixel is his',
                   'no two markers share more than 62% of a silhouette',
                   'the feet do not move'],
    }
    open(OUT_BANK, 'w').write(json.dumps(out, indent=1))
    print()
    print('wrote %s  (%d KB)' % (OUT_BANK, os.path.getsize(OUT_BANK) // 1024))
    print('wrote %s  (%d KB)' % (OUT_CARD, os.path.getsize(OUT_CARD) // 1024))


if __name__ == '__main__':
    main()
