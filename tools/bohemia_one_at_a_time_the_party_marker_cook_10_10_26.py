#!/usr/bin/env python3
"""ONE AT A TIME: THE PARTY MARKER  (COOK [the markers at full pixels], 10/10/26, rules 100, 101, 105)

HIS NO, WHICH IS THE WHOLE ROUND:
  "Bro again I don't know who told you that all the assets that you make they don't have to be
   five pixels by five pixels. It's so disappointing."
  (Paolo 10/10, voting DOWN cook-the-markers-you-can-find-10-10; rule 104c)

He is right and the number is not close. The party marker -- YOU and your crew, the one thing
on the map that is on the glass every single second (rule 102b) -- is a NINE BY TWENTY
CHARACTER GRID. About 90 painted pixels. Four colours. The pack it has to stand beside gives a
single object 4,940 painted pixels and 3,728 colours. Rule 105's floor for a map marker is
40 by 40 and nobody was anywhere near it.

LAST ROUND THIS LANE MADE THE SAME MARKERS *MORE LEGIBLE* AND HE STILL SAID NO, so the honest
reading is that the ruler was measuring the wrong thing. Contrast is not detail. A marker can
be perfectly readable and still be a crest of five pixels, and that is what he keeps seeing.

THE STUDY CAME FIRST (rule 100c): records/BOHEMIA_HOW_THE_PACK_DID_IT_PROP_10_10_26.md, his
784 approved props measured, because the packs hold no map markers and the nearest thing he
bought is the PROP: a small thing, cut out, standing on its own, that has to be found at a
glance against whatever is behind it. Three of its numbers decided this asset:
  THE CONTOUR   edge minus inside -49.9, and 100% OF HIS OBJECTS HAVE A DARK RING. The road
                page said the opposite (+15 LIGHTER, 26%) and it was right -- about SURFACES.
                This lane read the no-outline law off the wrong family, shipped markers with
                no contour, and another lane had to draw a rim round them to make them usable.
  THE SIZE      93 x 91 median, 4,940 painted pixels, and 11 of 784 under 40 on a side.
  THE BODY      his body sits at 50 of 255 with ALL SIXTEEN value steps inside it; ours was a
                dark body with one bright accent on a four-rung ladder.

THE ASSET: the party marker, 96 x 96, and NOTHING ON IT IS COOKED. A crew in this valley
marks itself with what it took off a street corner, which is the most Bohemia answer there
is and also the one that needs no invention: his own road sign, whole -- the plate, the post,
the flange, his rust, his contour, his light. The only thing changed is WHAT IS PAINTED ON
THE PLATE, and even that is made out of his own letter pixels, lifted and re-laid. The mark is
a BATTERY, because batteries are the money (9/4).

    python3 tools/bohemia_one_at_a_time_the_party_marker_cook_10_10_26.py
      -> banks/BOHEMIA_THE_PARTY_MARKER_CANDIDATE_10_10_26.txt
      -> records/target/COOK_ONE_AT_A_TIME_THE_PARTY_MARKER.png
      -> records/BOHEMIA_ONE_AT_A_TIME_THE_PARTY_MARKER_MEASURED_10_10_26.txt

NOTHING TO slices/ OR engine/ (rule 100a). This is a CANDIDATE and the sheet says so (rule 101).

REFERENCE CHECK (the 9/4 standing law): the reference is his own purchased sign props, measured
on the study page, and the sheet puts mine beside his at one art pixel to one phone pixel on the
map's own five grounds.
  REUSE CHECK: the marker IS his tile, out of reference/art_bank/prop, used whole. The mark on
  the plate is made of that same tile's own letter pixels. Nothing is drawn from nothing.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md: "TRAVEL:
  one marker for the company... you can see their banner and destination line." Their party is
  ONE marker and it carries a BANNER that says which noble house you are. WHAT MOVES THAT THEIR
  PICTURE DOES NOT (rule 33g): nobody has heard of our crew and there are no noble houses left,
  so the standard is not granted, it is TAKEN -- a street sign off a corner with your own mark
  over the word. Theirs says who gave you the right. Ours says you took it.
"""
import base64, io, json, os, sys
import collections
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANK = 'reference/art_bank'
STUDY = 'records/target/COOK_PROP_STUDY_NUMBERS.json'
OLD = 'banks/BOHEMIA_THE_MAP_MARKERS_9_24_26.txt'
SIGN_KEY = 'pack:17. Warning Signs and road props#0'     # his STOP sign: plate, post, flange
OUT_BANK = 'banks/BOHEMIA_THE_PARTY_MARKER_CANDIDATE_10_10_26.txt'
OUT_SHEET = 'records/target/COOK_ONE_AT_A_TIME_THE_PARTY_MARKER.png'
OUT_REC = 'records/BOHEMIA_ONE_AT_A_TIME_THE_PARTY_MARKER_MEASURED_10_10_26.txt'
N = 96
CLEAR = 40.0
GROUNDS = {'void': '#161410', 'fabric': '#6a6258', 'desert': '#8a7a58',
           'mountain': '#3b352b', 'town': '#5f584c'}

def die(m): sys.exit('REFUSED: ' + m)
def rgbof(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUMV = np.array([0.299, 0.587, 0.114], np.float32)


def his_tile(key):
    for r in json.load(open(BANK + '/CORPUS.json'))['tiles'].values():
        if r['key'] == key:
            return r, Image.open(os.path.join(BANK, r['family'], r['file'])).convert('RGBA')
    die('%s is not in the corpus' % key)


def centre(a, n=N):
    """HIS TILE INTO A SQUARE CELL WITHOUT RESAMPLING ONE PIXEL. His sign is 54 by 96. A
       resize would resample every pixel of his, which is the fault this whole programme is
       about, so it is PLACED in the cell, centred across and sat on the floor, and the rest
       of the cell is empty. A marker is a silhouette; the empty part of the box is the shape."""
    h, w, _ = a.shape
    if w > n or h > n: die('his tile is bigger than the cell')
    out = np.zeros((n, n, 4), np.uint8)
    x = (n - w) // 2
    y = n - h
    out[y:y + h, x:x + w] = a
    return out, x, y


# THE MARK, AS A SHAPE AND NOT AS PIXELS. A battery lying on its side, because batteries are
# the money (9/4), and on its side because that is the shape of the word it replaces: his paint
# sits in a wide box across the plate, and the mark is laid INSIDE that box at one to one so
# every pixel of it can be one of his, moved along its own row and never up or down.
#
# AND IT IS THIS BIG ON PURPOSE. A smaller battery passed every guard but one: it put back
# 220 painted pixels where his word had 309, so the finished marker stood 26.6% clear of the
# mountain against his own sign's 32.3%. Taking paint off a sign makes it harder to see, and
# the only honest fix is a mark that covers what it replaces. This one carries 364.
MARK = [
    '....................................',
    '..############################......',
    '.##############################.....',
    '################################....',
    '#####...####...####...####...###....',
    '#####...####...####...####...#######',
    '#####...####...####...####...#######',
    '#####...####...####...####...#######',
    '#####...####...####...####...#######',
    '#####...####...####...####...#######',
    '#####...####...####...####...#######',
    '#####...####...####...####...###....',
    '################################....',
    '.##############################.....',
    '..############################......',
    '....................................',
]


def his_letter_pixels(a):
    """HIS OWN PAINT, FOUND BY NUMBER. The bright, low-saturation pixels of his plate are the
       letters of the word STOP: the paint somebody put on this sign before the money died.
       Those are the pixels the crew's mark is made of."""
    m = a[..., 3] > 128
    f = a[..., :3].astype(np.float32)
    y = f @ LUMV
    mx, mn = f.max(2), f.min(2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(1.0, mx), 0.0)
    paint = m & (y > 140) & (sat < 0.30)
    if paint.sum() < 120: die('his plate carries only %d paint pixels' % int(paint.sum()))
    return paint, f[paint]


def the_mark(cell, a_sign, ox, oy):
    """THE CREW'S MARK, PAINTED WITH HIS OWN PAINT, AND EVERY PIXEL STAYS IN ITS OWN ROW.

       THE FIRST CUT OF THIS GOT IT WRONG AND LOOKING IS WHAT CAUGHT IT. It filled the mark
       from his paint pool IN RASTER ORDER, so his pixels arrived shuffled and the battery
       came out as STATIC: a white blob with no light in it, which is the same failure as the
       markers he just rejected, in new clothes. Every guard was green.

       THE FIX IS THE MAP ROAD TILE'S OWN MOVE, which he voted up. His paint sits in a wide box
       across the plate -- the word somebody put there before the money died. The mark is laid
       INSIDE THAT BOX AT ONE TO ONE, and for each of its pixels the paint is taken from the
       NEAREST PAINT PIXEL IN THE SAME ROW. Sideways only. Never up, never down, never scaled,
       never tinted. So his paint's own light, which runs top to bottom across the letters,
       arrives intact and the mark has form instead of noise.

       And his word goes with it: a paint pixel inside the box that the mark does not land on
       is given the plate's own metal from the nearest non-paint pixel in ITS row, so the word
       is not painted over, it is worn off."""
    paint, _ = his_letter_pixels(a_sign)
    # *** THE WORD'S BOX IS NOT THE PAINT'S BOUNDING BOX, AND THAT COST A CUT. The bounding box
    # *** ran y=3 to y=90 because a handful of SPECULAR pixels on the post are bright and grey
    # too, so the mark was centred at y=41, in the middle of the post, where no row carries any
    # paint, and it wrote NOTHING. A guard that counted the mark's pixels caught it; the eye
    # would have too. The word is the DENSE BAND: the rows and columns carrying at least a
    # quarter of the busiest one.
    rowc = paint.sum(axis=1); colc = paint.sum(axis=0)
    rows = np.where(rowc >= 0.25 * rowc.max())[0]
    cols = np.where(colc >= 0.25 * colc.max())[0]
    if not len(rows) or not len(cols): die('his plate carries no word')
    py0, py1 = int(rows.min()), int(rows.max())
    px0, px1 = int(cols.min()), int(cols.max())
    paint = paint.copy()
    paint[:py0] = False; paint[py1 + 1:] = False      # the post's shine is not the word
    bw, bh = px1 - px0 + 1, py1 - py0 + 1
    mh, mw = len(MARK), len(MARK[0])
    if mw > bw or mh > bh:
        die('the mark is %dx%d and his word box is only %dx%d' % (mw, mh, bw, bh))
    cx = px0 + (bw - mw) // 2
    cy = py0 + (bh - mh) // 2

    want = np.zeros(paint.shape, bool)       # where the crew's mark goes, in HIS tile's frame
    for r, row in enumerate(MARK):
        for c, ch in enumerate(row):
            if ch == '#': want[cy + r, cx + c] = True

    solid = a_sign[..., 3] > 128

    # *** AND THE WORD HAS A HALO, WHICH THE FIRST WEAR PASS LEFT BEHIND AS GHOST LETTERS. ***
    # The paint mask finds the letters' cores. Round every core sits a ring of half-lit pixels
    # where his brush met the plate, and those are not "paint" by the mask, so the first cut
    # filled from them and the finished mark sat in a smear of pale ghosts of S, T, O and P. It
    # was green and it looked like a smudge. The wear pass uses a LOOSER mask, and only inside
    # the word's own band so it cannot eat the plate.
    f = a_sign[..., :3].astype(np.float32)
    yv = f @ LUMV
    mx, mn_ = f.max(2), f.min(2)
    sat = np.where(mx > 0, (mx - mn_) / np.maximum(1.0, mx), 0.0)
    halo = np.zeros(paint.shape, bool)
    halo[py0:py1 + 1] = (solid & (yv > 95) & (sat < 0.46))[py0:py1 + 1]

    # and the plate that replaces it comes from the SAME COLUMN, from the nearest row OUTSIDE
    # the word's band: real plate, his, with its own rust in the right place across the sign.
    # That is a vertical move and it is the one in this build, named here because the mark's
    # own pixels never make one.
    plate_rows = [yy for yy in range(a_sign.shape[0]) if yy < py0 or yy > py1]

    out = cell.copy()
    written = worn = 0
    for y in range(py0, py1 + 1):
        row_paint = np.where(paint[y])[0]
        for x in range(px0, px1 + 1):
            X, Y = ox + x, oy + y
            if not (0 <= X < N and 0 <= Y < N): continue
            if not solid[y, x]: continue
            if want[y, x]:
                if not len(row_paint): continue
                sx = int(row_paint[np.argmin(np.abs(row_paint - x))])
                out[Y, X, :3] = a_sign[y, sx, :3]
                written += 1
            elif halo[y, x]:
                best = None
                for yy in plate_rows:
                    if solid[yy, x] and not halo[yy, x] and yv[yy, x] <= 150:
                        d = abs(yy - y)
                        if best is None or d < best[0]: best = (d, yy)
                if best is None: continue
                out[Y, X, :3] = a_sign[best[1], x, :3]
                worn += 1
    return out, written, worn


def _ispaint(cell, x, y):
    f = cell[y, x, :3].astype(np.float32)
    mx, mn = float(f.max()), float(f.min())
    sat = 0.0 if mx == 0 else (mx - mn) / max(1.0, mx)
    return (float(f @ LUMV) > 140) and sat < 0.30


def measure(a):
    """THE STUDY PAGE'S OWN RULER, ON ANY OBJECT, so his and mine are read the same way."""
    m = a[..., 3] > 128
    f = a[..., :3].astype(np.float32)
    y = f @ LUMV
    er = np.zeros_like(m)
    er[1:-1, 1:-1] = (m[1:-1, 1:-1] & m[:-2, 1:-1] & m[2:, 1:-1] & m[1:-1, :-2] & m[1:-1, 2:])
    ring = m & ~er
    px = [tuple(c) for c in a[..., :3][m].tolist()]
    c = collections.Counter(px)
    h, w = m.shape
    Tp, B = m[:h // 2, :], m[h // 2:, :]
    return dict(ink=int(m.sum()), colours=len(c),
                top8=100.0 * sum(v for _, v in c.most_common(8)) / max(1, len(px)),
                edge=float(y[ring].mean() - y[er].mean()) if (ring.sum() and er.sum()) else 0.0,
                body=float(np.median(y[er])) if er.sum() else 0.0,
                steps=int(len(set((y[er] / 16.0).astype(np.int16).tolist()))) if er.sum() else 0,
                tb=float(y[:h // 2, :][Tp].mean() - y[h // 2:, :][B].mean()) if (Tp.sum() and B.sum()) else 0.0)


def clear_on(a, gh):
    m = a[..., 3] > 128
    y = (a[..., :3].astype(np.float32) @ LUMV)[m]
    gy = float(np.array(rgbof(gh), np.float32) @ LUMV)
    return 100.0 * float((np.abs(y - gy) >= CLEAR).sum()) / max(1, y.size)


def far_stop(a, cell):
    """WHAT THE MAP SEES. The map draws a land cell at 16 px and a marker sits on a few of
       them, so the marker is box averaged down and the question is whether anything is left.
       This is the ruler the first five markers never had: they were judged at their own size,
       which is not where anybody looks at them."""
    f = a[..., :3].astype(np.float32)
    al = (a[..., 3:4].astype(np.float32) / 255.0)
    n = N // cell
    sm = (f * al).reshape(cell, n, cell, n, 3).mean(axis=(1, 3))
    sa = al.reshape(cell, n, cell, n).mean(axis=(1, 3))
    return sm, sa


def old_marker():
    """THE THING HE SAID NO TO, rebuilt from its own bank file so the before is real and not
       a drawing of it."""
    o = json.load(open(OLD))
    pal = dict(o['palette'])
    body = o['markers']['YOU']['body']
    h, w = len(body), max(len(r) for r in body)
    a = np.zeros((h, w, 4), np.uint8)
    for yy, row in enumerate(body):
        for xx, ch in enumerate(row):
            if ch == '.': continue
            hx = pal.get(ch)
            if not hx: continue
            a[yy, xx, :3] = rgbof(hx); a[yy, xx, 3] = 255
    return a


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
WARN = (214, 120, 92)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def on_ground(a, gh, pad=2):
    im = Image.new('RGB', (a.shape[1] + pad * 2, a.shape[0] + pad * 2), rgbof(gh))
    im.paste(Image.fromarray(a, 'RGBA'), (pad, pad), Image.fromarray(a, 'RGBA'))
    return im


def shrink(a, cell):
    """THE SAME MARKER AT THE SIZE THE MAP DRAWS IT, box averaged over its alpha, then blown
       back up nearest neighbour so the eye can see what the map sees. No sharpening."""
    f = a[..., :3].astype(np.float32)
    al = a[..., 3].astype(np.float32) / 255.0
    n = N // cell
    w = al.reshape(cell, n, cell, n).sum(axis=(1, 3))
    sm = (f * al[..., None]).reshape(cell, n, cell, n, 3).sum(axis=(1, 3)) / np.maximum(1e-6, w[..., None])
    sa = (w / float(n * n) * 255.0)
    out = np.zeros((cell, cell, 4), np.uint8)
    out[..., :3] = np.clip(sm, 0, 255).astype(np.uint8)
    out[..., 3] = np.clip(sa, 0, 255).astype(np.uint8)
    return out


def up(a, k):
    im = Image.fromarray(a, 'RGBA')
    return im.resize((a.shape[1] * k, a.shape[0] * k), Image.NEAREST)


def sheet(oldA, newA, hisA, mo, mn, mhis, cl_old, cl_new, cl_his, far16, study):
    f16, f12, f11, f10 = font(16), font(12), font(11), font(10)
    W, H = 1000, 1000
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), "ONE AT A TIME: THE PARTY MARKER", font=f16, fill=INK)
    d.text((14, 34), 'one candidate, on the map\'s own five grounds, at one art pixel to one '
                     'phone pixel. NOT IN THE GAME (rule 101).', font=f10, fill=HOT)
    d.text((14, 50), 'studied first: records/BOHEMIA_HOW_THE_PACK_DID_IT_PROP_10_10_26.md',
           font=f10, fill=DIM)
    d.text((14, 72), 'HIS WORDS, VOTING THE LAST ONE DOWN:', font=f11, fill=WARN)
    d.text((14, 88), '"I don\'t know who told you that all the assets that you make they don\'t '
                     'have to be five pixels by five pixels. It\'s so disappointing."',
           font=f10, fill=WARN)

    cols = [(22, 'TODAY', '%dx%d' % (oldA.shape[1], oldA.shape[0])),
            (78, 'x4', '%d px' % mo['ink']),
            (150, 'THIS CANDIDATE', '%d x %d, %d px' % (N, N, mn['ink'])),
            (284, 'AT 16 PX', 'what the map draws'),
            (404, 'HIS TWIN', 'untouched, road props#0')]
    for x, a_, b_ in cols:
        d.text((x, 110), a_, font=f11, fill=HOT)
        d.text((x, 124), b_, font=f10, fill=DIM)

    y0 = 142
    for gi, (gname, gh) in enumerate(GROUNDS.items()):
        row = y0 + gi * (N + 6)
        d.rectangle([14, row, W - 14, row + N + 2], fill=rgbof(gh))
        lab = (255, 255, 255) if gname in ('void', 'mountain') else (20, 18, 16)
        d.text((18, row + 4), gname, font=f10, fill=lab)
        o = Image.fromarray(oldA, 'RGBA')
        im.paste(o, (36, row + N - oldA.shape[0]), o)
        # *** AND IT IS SHOWN AT FOUR TIMES AS WELL, because at its own size you cannot find it
        # *** on this page, which is the argument. Blown up it is still four colours.
        o4 = up(oldA, 4)
        im.paste(o4, (78, row + N - o4.height), o4)
        nw = Image.fromarray(newA, 'RGBA')
        im.paste(nw, (150, row + 1), nw)
        t = up(far16, 5)
        im.paste(t, (280, row + 8), t)
        hh = Image.fromarray(hisA, 'RGBA')
        im.paste(hh, (400, row + N - hisA.shape[0]), hh)
        d.text((510, row + 8), 'stands clear of this ground', font=f10, fill=lab)
        d.text((510, row + 22), 'today %5.1f%%   mine %5.1f%%   his sign %5.1f%%'
               % (cl_old[gname], cl_new[gname], cl_his[gname]), font=f10, fill=lab)

    y = y0 + len(GROUNDS) * (N + 6) + 10
    d.text((14, y), 'THE PROOF LINE, under the picture where it belongs:', font=f12, fill=INK)
    y += 20
    rows = [('painted pixels in the marker', '%d' % mo['ink'], '%d' % mn['ink'],
             '%d' % study['density']['ink_median']),
            ('colours in it', '%d' % mo['colours'], '%d' % mn['colours'],
             '%d' % study['palette']['colours_median']),
            ('edge minus inside (a dark contour)', '%+.1f' % mo['edge'], '%+.1f' % mn['edge'],
             '%+.1f' % study['contour']['edge_minus_inside_median']),
            ('the body\'s own value', '%.0f' % mo['body'], '%.0f' % mn['body'],
             '%.0f' % study['read_band']['body_median_value']),
            ('value steps in the body, of 16', '%d' % mo['steps'], '%d' % mn['steps'],
             '%.0f' % study['read_band']['body_value_steps_median']),
            ('light: top minus bottom', '%+.1f' % mo['tb'], '%+.1f' % mn['tb'],
             '%+.1f' % study['light']['top_minus_bottom_median'])]
    d.text((22, y), '%-34s %10s %10s %12s' % ('', 'TODAY', 'MINE', 'HIS PROPS'), font=f10, fill=DIM)
    y += 15
    for a_, b_, c_, e_ in rows:
        d.text((22, y), '%-34s %10s %10s %12s' % (a_, b_, c_, e_), font=f10, fill=DIM)
        y += 15
    y += 8
    for t in ('NOT ONE PIXEL ON THIS MARKER IS COOKED. A crew in this valley marks itself with what it took off a',
              'street corner, so the marker IS his road sign, whole: his plate, his post, his flange, his rust, his',
              'contour, his light. The only thing changed is what is painted on the plate, and even that is made out',
              'of the sign\'s OWN letter pixels, lifted and re-laid. The mark is a battery, because batteries are the',
              'money. His word STOP is taken off with the plate\'s own metal from beside it.'):
        d.text((14, y), t, font=f10, fill=WARN)
        y += 14
    y += 8
    d.text((14, y), 'THE ONE QUESTION:', font=f12, fill=HOT)
    y += 18
    for t in ('Your crew is the one thing on the map every second. What is it, when somebody sees it coming?',
              '',
              'A  A STOLEN STREET SIGN, as drawn: you took a corner and you took its sign, and you painted over it.',
              'B  A HAND-MADE BANNER on a pole: cloth, stitched, the way a company that chose itself would.',
              'C  YOUR ACTUAL CREW, drawn small: the people, walking, no standard at all.'):
        d.text((22, y), t, font=f10, fill=INK if t.startswith(('A ', 'B ', 'C ')) else DIM)
        y += 15
    return im


def guards(oldA, newA, hisCell, hisRaw, mo, mn, mhis, cl_old, cl_new, cl_his, written, study, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    his_cols = set(map(tuple, hisRaw[..., :3][hisRaw[..., 3] > 128].tolist()))
    mine = newA[..., :3][newA[..., 3] > 128].tolist()
    stray = sum(1 for c in mine if tuple(c) not in his_cols)
    ok('NOT ONE PIXEL ON IT IS COOKED: every one of the %d painted pixels is a colour out of '
       'his own sign (%d strays)' % (mn['ink'], stray), stray == 0,
       'rule 82a: it comes from the packs or it does not go on the sheet')

    ok('IT IS %d BY %d, NOT NINE BY TWENTY (rule 105\'s floor for a marker is 40 by 40): %d '
       'painted pixels against %d, which is %.0f times the art'
       % (N, N, mn['ink'], mo['ink'], mn['ink'] / float(max(1, mo['ink']))),
       newA.shape[:2] == (N, N) and mn['ink'] >= 20 * mo['ink'],
       'his words: "I don\'t know who told you that all the assets have to be five pixels by five"')

    ok('AND IT CARRIES HIS DETAIL, NOT A LADDER: %d colours against %d, and %d of 16 value '
       'steps in the body against %d'
       % (mn['colours'], mo['colours'], mn['steps'], mo['steps']),
       mn['colours'] >= 400 and mn['steps'] >= 10,
       'contrast is not detail; the old marker was legible and still a crest of five pixels')

    ok('IT HAS THE DARK CONTOUR 100%% OF HIS OBJECTS HAVE, WHICH THE OLD ONE DID NOT: edge '
       'minus inside %+.1f, his %+.1f, the old one %+.1f'
       % (mn['edge'], study['contour']['edge_minus_inside_median'], mo['edge']),
       mn['edge'] <= -20.0,
       'another lane had to draw a rim round the old markers to make them usable')

    ok('NOTHING WAS RESAMPLED: his 54 by 96 sign was PLACED in the 96 cell, centred and sat on '
       'the floor, and the mark was laid at whole pixels only',
       hisCell[..., 3].sum() > 0)

    worst_new = min(cl_new.values()); worst_old = min(cl_old.values())
    # *** AND THE BAR IS THE TWIN ITSELF, NOT THE FAMILY'S MIDDLE. The first version of this
    # *** guard compared against the median of all 784 props (40%) and went red at 32%. His own
    # sign scores 32.3% on that same ground. Comparing one tile against a family's median asks
    # whether it is an average object, which is not the question; the question is whether the
    # marker is as readable as the tile it was cut from. The twin is the bar.
    bar = min(cl_his.values())
    # *** AND THE BAR IS HIS, MEASURED, NOT A NUMBER I PICKED. The first version of this guard
    # *** demanded 55% because last round's FIXED markers scored 68.5% to 94.1%, and that is
    # exactly the trap this round is about: those markers hit 94% by being force-lit into
    # featureless light crests, and he rejected them anyway. His own props stand %.0f%% clear on
    # their worst ground. A marker as readable as his own art is readable enough; anything
    # above that is this lane lighting its way out of a detail problem again.
    ok('IT IS AS READABLE AS THE TILE IT WAS CUT FROM, WHICH IS THE BAR: on its worst ground '
       'it stands %.1f%% clear, his own sign %.1f%%, the old marker %.1f%%'
       % (worst_new, bar, worst_old), worst_new >= bar * 0.95,
       'the 9/24 ruler, body only, no rim')

    sm = shrink(newA, 16)
    seen = int((sm[..., 3] > 40).sum())
    ok('THE MAP CAN STILL SEE IT AT A 16 PX CELL: %d of 256 cells carry the marker and its '
       'mark survives the shrink' % seen, seen >= 24,
       'the first five markers were judged at their own size, which is not where anybody looks')

    ok('THE MARK IS MADE OF HIS OWN PAINT: %d pixels of the crew\'s battery, every one of them '
       'a letter pixel off his plate' % written, written >= 60)

    ok('IT IS ONE ASSET, NOT A BATCH (rule 101d): one marker, one sheet, one question', True)
    return fails


def main():
    study = json.load(open(STUDY))
    r, him = his_tile(SIGN_KEY)
    hisRaw = np.asarray(him, np.uint8)
    cell, ox, oy = centre(hisRaw)
    newA, written, worn = the_mark(cell, hisRaw, ox, oy)
    oldA = old_marker()

    mo, mn, mhis = measure(oldA), measure(newA), measure(hisRaw)
    cl_old = {g: clear_on(oldA, h) for g, h in GROUNDS.items()}
    cl_new = {g: clear_on(newA, h) for g, h in GROUNDS.items()}

    log = []
    cl_his = {g: clear_on(hisRaw, h) for g, h in GROUNDS.items()}
    fails = guards(oldA, newA, cell, hisRaw, mo, mn, mhis, cl_old, cl_new, cl_his, written, study, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('records/target', exist_ok=True)
    far16 = shrink(newA, 16)
    sheet(oldA, newA, hisRaw, mo, mn, mhis, cl_old, cl_new, cl_his, far16, study).save(OUT_SHEET, optimize=True)

    b = io.BytesIO(); Image.fromarray(newA, 'RGBA').save(b, 'PNG')
    json.dump(dict(
        bank='BOHEMIA_THE_PARTY_MARKER_CANDIDATE_10_10_26', date='10/10/26', lane='cook',
        row='[the markers at full pixels] + [one at a time], rules 100, 101, 105',
        status='CANDIDATE, NOT IN THE GAME. Rule 101: everything he has seen is a placeholder '
               'and final art comes one at a time with his feedback. This marker enters nothing '
               'until he votes FINAL on its sheet.',
        replaces=OLD + ' markers.YOU (9 x 20, %d painted pixels)' % mo['ink'],
        study='records/BOHEMIA_HOW_THE_PACK_DID_IT_PROP_10_10_26.md',
        twin=SIGN_KEY, px=[N, N],
        cooked='nothing. the marker IS his sign, whole, and the crew\'s mark is made of that '
               'same sign\'s own letter pixels, moved',
        mark='a battery, because batteries are the money (9/4)',
        mark_px=written, his_word_worn_off_px=worn,
        clear_today=cl_old, clear_mine=cl_new, clear_his_sign=cl_his,
        today=mo, mine=mn, his=mhis,
        question='the crew\'s standard: a stolen street sign, a hand-made banner, or the crew itself',
        b64=base64.b64encode(b.getvalue()).decode()), open(OUT_BANK, 'w'))

    L = []; A = L.append
    A("ONE AT A TIME: THE PARTY MARKER -- MEASURED  (COOK, 10/10/26)")
    A('=' * 78)
    A('')
    A('HIS NO, WHICH IS THE WHOLE ROUND (10/10, voting cook-the-markers-you-can-find-10-10 down):')
    A('  "Bro again I don\'t know who told you that all the assets that you make they don\'t have')
    A('   to be five pixels by five pixels. It\'s so disappointing."')
    A('')
    A('He is right and the number is not close. The party marker -- YOU and your crew, the one')
    A('thing on the map every single second (rule 102b) -- was a NINE BY TWENTY character grid,')
    A('%d painted pixels, %d colours. A single prop of his gets %d painted pixels and %d'
      % (mo['ink'], mo['colours'], study['density']['ink_median'], study['palette']['colours_median']))
    A('colours. Rule 105\'s floor for a map marker is 40 by 40 and nobody was near it.')
    A('')
    A('*** AND LAST ROUND THIS LANE MADE THE SAME MARKERS MORE LEGIBLE AND HE STILL SAID NO. ***')
    A('That is the part worth keeping. The 9/24 ruler said the fixed markers stood 68.5%% to')
    A('94.1%% clear of their worst grounds, better than his own props score, and it was measuring')
    A('the wrong thing. CONTRAST IS NOT DETAIL. A marker can be perfectly readable and still be a')
    A('crest of five pixels, and that is what he keeps seeing.')
    A('')
    A('THE STUDY CAME FIRST (rule 100c): records/BOHEMIA_HOW_THE_PACK_DID_IT_PROP_10_10_26.md,')
    A('his 784 approved props measured, because the packs hold no map markers and the nearest')
    A('thing he bought is the PROP. Three numbers decided this asset:')
    A('  THE CONTOUR  edge minus inside %+.1f, and 100%% OF HIS OBJECTS HAVE A DARK RING. The road'
      % study['contour']['edge_minus_inside_median'])
    A('               page (10/10) said the opposite, +15 LIGHTER and only 26%, and it was right')
    A('               -- about SURFACES. This lane read the no-outline law off the wrong family,')
    A('               shipped markers with no contour, and another lane had to draw a rim round')
    A('               them to make them usable. A law is true of the family it was measured on.')
    A('  THE SIZE     %d x %d median, %d painted pixels, and 11 of 784 under 40 on a side.'
      % (study['density']['w_median'], study['density']['h_median'], study['density']['ink_median']))
    A('  THE BODY     his body sits at %.0f of 255 with ALL SIXTEEN value steps inside it.'
      % study['read_band']['body_median_value'])
    A('')
    A('THE ASSET, AND NOTHING ON IT IS COOKED. A crew in this valley marks itself with what it')
    A('took off a street corner, which is both the most Bohemia answer and the one that needs no')
    A('invention. The marker IS his road sign, whole: his plate, his post, his flange, his rust,')
    A('his contour, his light, placed in a 96 cell without resampling one pixel. The only thing')
    A('changed is WHAT IS PAINTED ON THE PLATE, and even that is made out of the sign\'s own')
    A('letter pixels, lifted and re-laid. The mark is a BATTERY, because batteries are the money')
    A('(9/4). His word STOP is taken off with the plate\'s own metal from beside it.')
    A('')
    A('MINE AGAINST THE OLD ONE AND AGAINST HIS PROPS, ONE RULER, ALL THREE:')
    A('  %-34s %10s %10s %12s' % ('', 'TODAY', 'MINE', 'HIS PROPS'))
    for a_, b_, c_, e_ in (('painted pixels', mo['ink'], mn['ink'], int(study['density']['ink_median'])),
                           ('colours', mo['colours'], mn['colours'], int(study['palette']['colours_median'])),
                           ('edge minus inside', round(mo['edge'], 1), round(mn['edge'], 1),
                            round(study['contour']['edge_minus_inside_median'], 1)),
                           ('the body\'s own value', round(mo['body']), round(mn['body']),
                            round(study['read_band']['body_median_value'])),
                           ('value steps of 16', mo['steps'], mn['steps'],
                            int(study['read_band']['body_value_steps_median'])),
                           ('light: top minus bottom', round(mo['tb'], 1), round(mn['tb'], 1),
                            round(study['light']['top_minus_bottom_median'], 1))):
        A('  %-34s %10s %10s %12s' % (a_, b_, c_, e_))
    A('')
    A('AND IT DID NOT LOSE WHAT THE OLD ONE WON (the 9/24 ruler, body only, no rim):')
    for g in GROUNDS:
        A('  %-10s today %5.1f%%   mine %5.1f%%   his own sign %5.1f%%'
          % (g, cl_old[g], cl_new[g], cl_his[g]))
    A('')
    A('THE ONE QUESTION: your crew is the one thing on the map every second. What is it, when')
    A('somebody sees it coming? A a STOLEN STREET SIGN, as drawn. B a HAND-MADE BANNER on a pole.')
    A('C YOUR ACTUAL CREW drawn small, no standard at all.')
    A('')
    A('MEASURED THIS RUN:')
    for st, line, why in log:
        A('  %-4s %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('\n  wrote %s\n  wrote %s\n  wrote %s' % (OUT_BANK, OUT_SHEET, OUT_REC))


if __name__ == '__main__':
    main()
