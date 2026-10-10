#!/usr/bin/env python3
"""ONE AT A TIME: THE MAP'S ROAD  (COOK [one at a time], 10/10/26, rules 100, 101)

PAOLO 10/10: "the real way we get to a final graphic asset is doing a HIGH-QUALITY ONE AT A
TIME, a sheet, and asking for my feedback every time." Rule 101d: one asset per round, the
best it can be, studied from the pack first, on one sheet beside its pack twin at 1:1, with
its one question. NOTHING GOES IN THE GAME (rule 100a); this is a candidate and the sheet
says so.

THE ASSET: ONE MAP ROAD TILE, 96 x 96, the master the map samples at every stop.

THE STUDY CAME FIRST (rule 100c): records/BOHEMIA_HOW_THE_PACK_DID_IT_ROAD_10_10_26.md, the
290 road tiles he bought and judged UP, measured. Seven numbers, and three of them decided
this asset before a pixel was drawn:
  COLOURS       4,821 in one of his tiles, and the top eight carry only 8% of it. His ground
                is a SURFACE, not a ramp. Ours carry seven colours. No better shape fixes
                that, so the carriageway here IS his tile and not a painting of one.
  THE EDGE      only 22% of his road family tiles cleanly: they are slabs laid in a grid, not
                seamless fields. A map road must repeat, so the base is the one tile of his
                that MEETS -- measured, not chosen by eye.
  OUTLINE       no dark ring: his edge is +15 LIGHTER than his inside. Anything we draw with
                a line round it sticks out exactly the way he said.

*** AND THEN THE PICTURE CORRECTED THE NUMBERS, WHICH IS THIS LANE'S WHOLE LESSON. The
*** first cut of this tile read the marking FAMILY, found warning signs, blood and bones,
*** and concluded the packs hold no road paint, so the lane line was cooked: a white lifted
*** off his road grit, laid down the middle. Every guard went green and the picture was
*** wrong -- at one art pixel to one phone pixel the line read as a scuff, not as paint.
*** Looking is what found it. A contact sheet of his own road family turned up
*** 1. Cracked street tiles#23: HIS dark street, with WORN ORANGE ROAD PAINT ON IT, 11% of
*** the tile, 90 of its 96 rows. Six of his street tiles carry it. The packs hold road paint
*** and nobody had looked.

SO NOTHING ON THIS TILE IS COOKED. The carriageway is his #0, the tile of his street family
that MEETS. The paint is his #23's own paint pixels, lifted one at a time and moved sideways
only, never recoloured, never resampled: his colour, his wear, his broken edges, on his road.
Where his paint has worn through, my line has a gap, because that gap is his.

THE ONE QUESTION IS THEREFORE ABOUT THE WORLD AND NOT ABOUT THE ART, and it is on the sheet.

    python3 tools/bohemia_one_at_a_time_the_map_road_cook_10_10_26.py
      -> banks/BOHEMIA_THE_MAP_ROAD_CANDIDATE_10_10_26.txt
      -> records/target/COOK_ONE_AT_A_TIME_THE_MAP_ROAD.png
      -> records/BOHEMIA_ONE_AT_A_TIME_THE_MAP_ROAD_MEASURED_10_10_26.txt

NOTHING TO slices/ OR engine/ (rule 100a). The sheet lives in records/target, which the site
publishes, so the VOTE tab shows it without this lane touching the demo.

REFERENCE CHECK (the 9/4 standing law): the reference is his own purchased road tiles and the
study page measured off them; every number on the sheet is mine against his, side by side at
one art pixel to one phone pixel.
  REUSE CHECK: the carriageway is HIS tile, used whole and untouched, out of
  reference/art_bank/road, which came from banks/BOHEMIA_HD_TILE_REPO under the keys in
  banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26. Only the paint is drawn, and its white is sampled
  off his own tile.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md: a road
  on their map is read by its LINE, not its texture -- you follow it at a glance because it
  contrasts with everything round it. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g): a
  Battle Brothers road is a dirt track and it never changes. Ours is a crash-era arterial
  whose paint is the only thing on it that anybody ever maintained, so how much paint is left
  is a reading of how long ago the money stopped. That is the question on the sheet.
"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANK = 'reference/art_bank'
CORPUS = BANK + '/CORPUS.json'
STUDY = 'records/target/COOK_ROAD_STUDY_NUMBERS.json'
BASE_KEY  = 'pack:1. Cracked street tiles#0'     # measured: the street tile of his that MEETS
PAINT_KEY = 'pack:1. Cracked street tiles#23'    # measured: HIS worn road paint, 90 of 96 rows
WIDE = 6
OUT_BANK = 'banks/BOHEMIA_THE_MAP_ROAD_CANDIDATE_10_10_26.txt'
OUT_SHEET = 'records/target/COOK_ONE_AT_A_TIME_THE_MAP_ROAD.png'
OUT_REC = 'records/BOHEMIA_ONE_AT_A_TIME_THE_MAP_ROAD_MEASURED_10_10_26.txt'
N = 96

def die(m): sys.exit('REFUSED: ' + m)
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


class R:
    def __init__(s, v): s.s = v & 0x7fffffff
    def __call__(s):
        s.s = (1103515245 * s.s + 12345) & 0x7fffffff
        return s.s / float(0x7fffffff)


def his_tile(key):
    for r in json.load(open(CORPUS))['tiles'].values():
        if r['key'] == key:
            return r, Image.open(os.path.join(BANK, r['family'], r['file'])).convert('RGB')
    die('%s is not in the corpus' % key)


def to_square(im):
    """HIS TILE TO 96 x 96 WITHOUT RESAMPLING ONE PIXEL. His master is 96 x 94, and a resize
       would resample every pixel of his, which is the fault this whole programme is about.
       The two missing rows are taken FROM THE TILE'S OWN OTHER END, which is what makes a
       surface wrap, so every pixel on the finished tile is still his and in its own place."""
    a = np.asarray(im, np.uint8)
    h, w, _ = a.shape
    if w > N: a = a[:, :N]
    if h > N: a = a[:N, :]
    h, w, _ = a.shape
    if w < N: a = np.concatenate([a, a[:, :N - w]], axis=1)
    if h < N: a = np.concatenate([a, a[:N - h, :]], axis=0)
    return a


def paint_mask(a):
    """HIS PAINT, FOUND BY NUMBER AND NOT BY EYE: saturated, light, and blue well under green.
       It is the same ruler that swept all 290 of his road tiles and turned up six carrying
       paint, which is how a claim that had gone green got caught."""
    f = a.astype(np.float32)
    mx, mn = f.max(2), f.min(2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(1, mx), 0)
    return (sat > 0.42) & (mx > 100) & (f[..., 2] < f[..., 1] * 0.70)


def his_paint(base, paintA):
    """THE LANE LINE, MADE OUT OF HIS OWN PAINT PIXELS AND NOTHING ELSE.

       His painted tile carries the marking on a diagonal, which no map road can use: a map
       road has to run with the road. So for every row, the longest unbroken run of his paint
       IN THAT ROW is taken and moved SIDEWAYS ONLY, to the middle of the tile. Nothing is
       rotated, scaled, blended, tinted or recoloured. Every pixel written is one of his
       pixels, byte for byte, out of the row it was born in.

       WHAT THAT BUYS, AND IT IS THE WHOLE POINT:
         THE COLOUR IS HIS      his worn orange, not a white I invented off his grit.
         THE WEAR IS HIS        where his paint has worn through to the asphalt, the run is
                                short or missing, so the line thins and breaks the way his
                                does. Six of his ninety-six rows have no paint at all and
                                those six rows are gaps.
         THE EDGES ARE HIS      his paint has no outline and ragged ends, and so does this.
       Returns the tile, how many pixels of paint, and how many of them are verbatim his."""
    out = base.copy()
    m = paint_mask(paintA)
    h, w, _ = out.shape
    ph, pw = m.shape
    cx = w // 2
    painted = verbatim = gaps = 0
    for y in range(h):
        if y >= ph: break
        row = m[y]
        best = bl = cur = cs = 0
        for x in range(pw):
            if row[x]:
                if cur == 0: cs = x
                cur += 1
                if cur > best: best, bl = cur, cs
            else:
                cur = 0
        if best == 0:
            gaps += 1
            continue
        take = min(best, WIDE)
        src = bl + (best - take) // 2
        dst = cx - take // 2
        for i in range(take):
            sx, dx = src + i, dst + i
            if not (0 <= dx < w): continue
            px = paintA[y, sx]
            out[y, dx] = px
            painted += 1
            verbatim += 1
    return out, painted, verbatim, gaps


def seven(a):
    """THE STUDY'S OWN SEVEN NUMBERS, MEASURED THE SAME WAY ON ANY TILE, so mine and his are
       read by one ruler."""
    import collections
    h, w, _ = a.shape
    flat = [tuple(c) for c in a.reshape(-1, 3)]
    c = collections.Counter(flat)
    yv = a @ np.array([0.299, 0.587, 0.114])
    q = (yv / 16.0).astype(np.int16)
    tot = n = one = 0
    for row in q:
        run = 1
        for i in range(1, len(row)):
            if row[i] == row[i - 1]: run += 1
            else:
                tot += run; n += 1; one += (run == 1); run = 1
        tot += run; n += 1; one += (run == 1)
    ring0 = np.concatenate([yv[0, :], yv[-1, :], yv[:, 0], yv[:, -1]])
    ring1 = np.concatenate([yv[1, 1:-1], yv[-2, 1:-1], yv[1:-1, 1], yv[1:-1, -2]])
    ai = a.astype(np.int16)
    jx = float(np.abs(ai[:, 0, :] - ai[:, -1, :]).sum(axis=1).mean())
    ix = float(np.abs(ai[:, 1:, :] - ai[:, :-1, :]).sum(axis=2).mean())
    jy = float(np.abs(ai[0, :, :] - ai[-1, :, :]).sum(axis=1).mean())
    iy = float(np.abs(ai[1:, :, :] - ai[:-1, :, :]).sum(axis=2).mean())
    ys = np.asarray([LUM(k) for k in c], np.float32)
    return dict(px=w * h, colours=len(c),
                top8=100.0 * sum(v for _, v in c.most_common(8)) / len(flat),
                span=float(ys.max() - ys.min()),
                light_lr=float(yv[:, :w // 2].mean() - yv[:, w // 2:].mean()),
                light_tb=float(yv[:h // 2, :].mean() - yv[h // 2:, :].mean()),
                edge=float(ring0.mean() - ring1.mean()),
                run=tot / float(max(1, n)), lone=100.0 * one / float(max(1, n)),
                joint_x=jx / max(1.0, ix), joint_y=jy / max(1.0, iy))


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
WARN = (214, 120, 92)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def four(a):
    im = Image.fromarray(a, 'RGB')
    out = Image.new('RGB', (N * 2, N * 2))
    for x in (0, N):
        for y in (0, N): out.paste(im, (x, y))
    return out


def strip(a, cell=16):
    """THE SAME TILE AT MAP SIZE, BOX AVERAGED TO A 16 PX LAND CELL AND THEN BLOWN BACK UP SO
       THE EYE CAN SEE WHAT THE MAP SEES. No sharpening, no filter, nearest neighbour only."""
    f = a.astype(np.float32)
    n = a.shape[0] // cell
    sm = f.reshape(cell, n, cell, n, 3).mean(axis=(1, 3))
    im = Image.fromarray(np.clip(sm, 0, 255).astype(np.uint8), 'RGB')
    out = Image.new('RGB', (cell * 3, cell * 6))
    for x in range(3):
        for y in range(6): out.paste(im, (x * cell, y * cell))
    return out.resize((cell * 3 * 2, cell * 6 * 2), Image.NEAREST)


def sheet(hisA, paintA, mineA, mh, mm, mapn, gaps):
    """ONE SHEET: MINE BESIDE HIS TWIN, AT ONE ART PIXEL TO ONE PHONE PIXEL, EACH LAID 2x2 SO
       THE EDGE CAN BE LOOKED AT, AND BESIDE THEM THE SAME TILE AT MAP SIZE. The numbers go
       under the picture as the proof line and never as the show (rule 89)."""
    f16, f12, f11, f10 = font(16), font(12), font(11), font(10)
    W, H = 900, 712
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), 'ONE AT A TIME: THE MAP\'S ROAD', font=f16, fill=INK)
    d.text((14, 34), 'one candidate, laid 2x2 beside the two tiles of his it is made of, '
                     'nothing scaled. NOT IN THE GAME (rule 101).', font=f10, fill=HOT)
    d.text((14, 50), 'studied first: records/BOHEMIA_HOW_THE_PACK_DID_IT_ROAD_10_10_26.md',
           font=f10, fill=DIM)

    x0, x1, x2 = 14, 14 + N * 2 + 22, 14 + (N * 2 + 22) * 2
    d.text((x0, 64), 'HIS ROAD', font=f11, fill=HOT)
    d.text((x0, 78), 'Cracked street tiles#0', font=f10, fill=DIM)
    d.text((x1, 64), 'HIS PAINT', font=f11, fill=HOT)
    d.text((x1, 78), 'Cracked street tiles#23', font=f10, fill=DIM)
    d.text((x2, 64), 'MINE: both of them, nothing else', font=f11, fill=HOT)
    d.text((x2, 78), 'his road, his paint, nothing cooked', font=f10, fill=DIM)
    im.paste(four(hisA), (x0, 94))
    im.paste(four(to_square(Image.fromarray(paintA, 'RGB'))), (x1, 94))
    im.paste(four(mineA), (x2, 94))

    y = 94 + N * 2 + 14
    d.text((x2, y), 'and what the map sees, at a 16 px cell:', font=f10, fill=DIM)
    im.paste(strip(mineA), (x2, y + 14))

    d.text((x0, y), 'THE PROOF LINE, under the picture where it belongs:', font=f12, fill=INK)
    yy = y + 20
    rows = [('colours in the tile', '%d' % mh['colours'], '%d' % mm['colours']),
            ('the top eight carry', '%.0f%%' % mh['top8'], '%.0f%%' % mm['top8']),
            ('value span of 255', '%.0f' % mh['span'], '%.0f' % mm['span']),
            ('light: top minus bottom', '%+.1f' % mh['light_tb'], '%+.1f' % mm['light_tb']),
            ('edge minus inside', '%+.1f' % mh['edge'], '%+.1f' % mm['edge']),
            ('a value holds (16 steps)', '%.2f px' % mh['run'], '%.2f px' % mm['run']),
            ('joint over inside, across', '%.2f' % mh['joint_x'], '%.2f' % mm['joint_x']),
            ('joint over inside, down', '%.2f' % mh['joint_y'], '%.2f' % mm['joint_y'])]
    d.text((x0 + 8, yy), '%-27s %9s %9s' % ('', 'HIS', 'MINE'), font=f10, fill=DIM)
    yy += 15
    for aa, bb, cc in rows:
        d.text((x0 + 8, yy), '%-27s %9s %9s' % (aa, bb, cc), font=f10, fill=DIM)
        yy += 15
    yy += 4
    d.text((x0 + 8, yy), 'at a 16 px map cell the line reads', font=f10, fill=DIM); yy += 15
    d.text((x0 + 8, yy), '%.2f times the road beside it' % mapn[2], font=f10, fill=HOT)

    y = 94 + N * 2 + 14 + 16 * 6 * 2 + 20
    for t in ('THE FIRST CUT OF THIS TILE WENT GREEN ON EIGHT MEASUREMENTS AND THE PICTURE WAS WRONG.',
              'It said the packs hold no road paint, so it cooked a white line. Looking at it at 1:1 found a',
              'scuff, not paint. Then a sheet of his own road family turned up #23: HIS street, with HIS worn',
              'orange paint on it, 90 of its 96 rows. Six of his street tiles carry paint. Nobody had looked.',
              'So nothing here is cooked. His paint moved sideways onto his road. ' +
              '%d rows are bare because %d of his are.' % (gaps, gaps)):
        d.text((14, y), t, font=f10, fill=WARN)
        y += 15
    y += 10
    d.text((14, y), 'THE ONE QUESTION:', font=f12, fill=HOT)
    y += 18
    for t in ('Nobody has repainted a line in this valley since the dollar died. How much paint is left on a',
              'road is a reading of how long ago that was.',
              '',
              'A  WORN, as drawn here: his paint, broken where his wore through.',
              'B  GONE: no paint at all, the road read by its shape and its colour only.',
              'C  FRESH: somebody is still painting them, and that says somebody is still in charge.'):
        d.text((22, y), t, font=f10, fill=INK if t.startswith(('A ', 'B ', 'C ')) else DIM)
        y += 15
    return im


def map_reads(a, cell=16):
    """CAN THE MAP STILL SEE IT? The map draws a land cell at 16 px, so the tile gets box
       averaged down to 16 and the line is looked for there. A road you cannot follow at a
       glance is not a map road, and no amount of grain at 96 px fixes that.
       [bb] their road is read by its LINE, not its texture."""
    f = a.astype(np.float32)
    n = a.shape[0] // cell
    small = f.reshape(cell, n, cell, n, 3).mean(axis=(1, 3))
    mx, mn = small.max(2), small.min(2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(1.0, mx), 0.0)
    score = (sat * mx).mean(axis=0)                     # one number per column of the small tile
    c = cell // 2
    mid = float(max(score[c - 1], score[c]))
    rest = float(np.median(np.concatenate([score[:c - 1], score[c + 1:]])))
    return mid, rest, mid / max(0.001, rest)


def guards(hisA, paintA, mineA, mh, mm, painted, verbatim, gaps, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    same = int((np.abs(hisA.astype(np.int16) - mineA.astype(np.int16)).sum(axis=2) == 0).sum())
    tot = N * N
    ok('NOT ONE PIXEL ON THIS TILE IS COOKED: %d of %d are his carriageway untouched and the '
       'other %d are his own paint, lifted whole' % (same, tot, painted),
       same + painted >= tot and verbatim == painted,
       'rule 82a: it comes from the packs or it does not go on the sheet')

    hp = set(map(tuple, paintA.reshape(-1, 3).tolist()))
    mine_only = [tuple(c) for c in mineA.reshape(-1, 3).tolist()]
    his_all = set(map(tuple, hisA.reshape(-1, 3).tolist())) | hp
    stray = sum(1 for c in mine_only if c not in his_all)
    ok('AND EVERY COLOUR ON IT IS ONE OF HIS: 0 colours that are not in his two tiles '
       '(%d strays)' % stray, stray == 0,
       'the first cut invented a white by lifting his grit 45%% toward paper')

    ok('NOTHING WAS RESAMPLED: his 96x94 master became 96x96 by taking two rows from its own '
       'other end, never by a resize, and the paint moved sideways only',
       mineA.shape[:2] == (N, N))

    mid, rest, ratio = map_reads(mineA)
    ok('THE MAP CAN SEE IT: drawn down to a 16 px land cell the painted column still reads '
       '%.2f times the carriageway (%.1f against %.1f)' % (ratio, mid, rest), ratio >= 1.25,
       'the first cut measured eight ways and never once asked whether it reads at map size')

    ok('THE WEAR IS HIS AND NOT A PATTERN I MADE UP: %d of 96 rows are bare because %d of his '
       'are, and the line is as wide as his paint survived, never wider' % (gaps, gaps),
       gaps > 0 and painted < tot * 0.12,
       'the first cut broke its line with arithmetic and the breaks landed as noise')

    ok('IT MEETS ITSELF, WHICH HIS FAMILY MOSTLY DOES NOT (22%% of it tiles cleanly): joint '
       'over inside %.2f across and %.2f down, his own %.2f and %.2f'
       % (mm['joint_x'], mm['joint_y'], mh['joint_x'], mh['joint_y']),
       mm['joint_x'] <= 2.0 and mm['joint_y'] <= 2.0,
       'a map road that does not repeat is not a map road')

    ok('AND THE PAINT DID NOT BREAK THE JOIN: mine against his, %.2f vs %.2f across, %.2f vs '
       '%.2f down' % (mm['joint_x'], mh['joint_x'], mm['joint_y'], mh['joint_y']),
       mm['joint_x'] <= mh['joint_x'] + 0.45 and mm['joint_y'] <= mh['joint_y'] + 0.45)

    ok('IT IS STILL A SURFACE AND NOT A RAMP: %d colours and the top eight carry %.0f%%, '
       'against his %d and %.0f%%' % (mm['colours'], mm['top8'], mh['colours'], mh['top8']),
       mm['colours'] >= mh['colours'] * 0.85 and mm['top8'] <= mh['top8'] + 3.0,
       'the study\'s own headline: his ground is a surface, ours were seven-colour ramps')

    ok('NO DARK RING, because his family has none (his edge runs +%.0f LIGHTER than his '
       'inside): mine %+.1f' % (mh['edge'], mm['edge']), mm['edge'] >= -4.0,
       'anything with a line round it sticks out exactly the way he said')

    ok('THE GRAIN SURVIVED THE PAINT: a value holds %.2f px at sixteen steps, his %.2f'
       % (mm['run'], mh['run']), mm['run'] <= mh['run'] * 1.35,
       'paint laid as a flat fill would smooth his grit away and that is the sore thumb')

    ok('IT IS ONE ASSET, NOT A BATCH (rule 101d): one tile, one sheet, one question', True)
    return fails, (mid, rest, ratio)


def main():
    r0, him = his_tile(BASE_KEY)
    rp, hip = his_tile(PAINT_KEY)
    hisA = to_square(him)
    paintA = np.asarray(hip, np.uint8)
    mineA, painted, verbatim, gaps = his_paint(hisA, paintA)
    mh, mm = seven(hisA), seven(mineA)
    log = []
    fails, mapn = guards(hisA, paintA, mineA, mh, mm, painted, verbatim, gaps, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('records/target', exist_ok=True)
    sheet(hisA, paintA, mineA, mh, mm, mapn, gaps).save(OUT_SHEET, optimize=True)
    b_ = io.BytesIO(); Image.fromarray(mineA, 'RGB').save(b_, 'PNG')
    json.dump(dict(
        bank='BOHEMIA_THE_MAP_ROAD_CANDIDATE_10_10_26', date='10/10/26', lane='cook',
        row='[one at a time], rules 100 and 101',
        status='CANDIDATE, NOT IN THE GAME. Rule 101: everything he has seen is a placeholder '
               'and final art comes one at a time with his feedback. This tile enters nothing '
               'until he votes FINAL on its sheet.',
        study='records/BOHEMIA_HOW_THE_PACK_DID_IT_ROAD_10_10_26.md',
        twin=BASE_KEY, paint_twin=PAINT_KEY, px=[N, N],
        cooked='nothing. the carriageway is his #0 untouched and the line is his #23 own paint '
               'pixels moved sideways, never recoloured and never resampled',
        paint_px=painted, verbatim_px=verbatim, bare_rows=gaps,
        map_cell_contrast=round(mapn[2], 2),
        his=mh, mine=mm,
        question='the paint: WORN as drawn, GONE, or FRESH',
        b64=base64.b64encode(b_.getvalue()).decode()), open(OUT_BANK, 'w'))

    L = []
    A = L.append
    A("ONE AT A TIME: THE MAP'S ROAD -- MEASURED  (COOK [one at a time], 10/10/26)")
    A('=' * 78)
    A('')
    A('PAOLO 10/10: "the real way we get to a final graphic asset is doing a HIGH-QUALITY ONE')
    A('AT A TIME, a sheet, and asking for my feedback every time."')
    A('')
    A('ONE ASSET: a 96 x 96 map road tile, the master the map samples at every stop. A')
    A('CANDIDATE. It is in nothing and goes into nothing until he votes FINAL on its sheet.')
    A('')
    A('THE STUDY CAME FIRST (rule 100c) and three of its seven numbers decided this asset')
    A('before a pixel was drawn:')
    A('  COLOURS   4,821 in one of his tiles, top eight carry 8%. His ground is a SURFACE, not')
    A('            a ramp, and ours carry seven colours. So the carriageway IS his tile.')
    A('  THE EDGE  only 22% of his road family tiles cleanly; they are slabs laid in a grid. A')
    A('            map road must repeat, so the base is the one of his that MEETS, measured.')
    A('  OUTLINE   no dark ring anywhere: his edge runs +15 LIGHTER than his inside.')
    A('')
    A('*** AND THEN THE PICTURE CORRECTED THE NUMBERS. THIS IS THE PART WORTH KEEPING.')
    A('')
    A('The first cut of this tile read his MARKING family, found warning signs, blood and')
    A('bones, and wrote the headline THE PACKS HOLD NO ROAD PAINT. On that headline it cooked')
    A('a lane line: a white lifted off his road grit and mixed down the middle. Eight')
    A('measurements went green. Then it was looked at, at one art pixel to one phone pixel,')
    A('and the line read as a SCUFF. Not as paint. A player would see a smear.')
    A('')
    A('So his own road family went on a contact sheet, and there it was:')
    A('  1. Cracked street tiles#23   HIS dark street, with WORN ORANGE ROAD PAINT on it.')
    A('                               11% of the tile. 90 of its 96 rows carry paint.')
    A('  and five more of his street tiles carry it: #18, #19, #20, #21, #22.')
    A('THE PACKS HOLD ROAD PAINT. Nobody had looked. The measurement was asking the marking')
    A('family, and his road paint lives in the ROAD family, on the road.')
    A('')
    A('SO NOTHING ON THIS TILE IS COOKED, which is the strongest version of it there is:')
    A('  THE CARRIAGEWAY  his #0, whole and untouched, the street tile of his that MEETS.')
    A('  THE LINE         his #23 own paint pixels. For every row, the longest unbroken run')
    A('                   of his paint in that row is moved SIDEWAYS to the middle. Nothing')
    A('                   is rotated, scaled, blended or recoloured.')
    A('  THE COLOUR       his worn orange, because it is literally his pixels.')
    A('  THE WEAR         his. Where his paint wore through, the line thins or stops. %d rows' % gaps)
    A('                   are bare because %d of his are.' % gaps)
    A('')
    A('AND THE RULER THE FIRST CUT NEVER HAD: the tile is box averaged down to a 16 px land')
    A('cell, the size the map actually draws it, and the painted column is measured against')
    A('the carriageway beside it. It reads %.2f times as strong. A road you cannot follow at a' % mapn[2])
    A('glance is not a map road, and no amount of grain at 96 px fixes that.')
    A('')
    A('MINE AGAINST HIS, ONE RULER, BOTH WAYS:')
    A('  %-28s %10s %10s' % ('', 'HIS', 'MINE'))
    for aa, bb, cc in (('colours in the tile', mh['colours'], mm['colours']),
                       ('the top eight carry %', round(mh['top8'], 1), round(mm['top8'], 1)),
                       ('value span of 255', round(mh['span']), round(mm['span'])),
                       ('light: top minus bottom', round(mh['light_tb'], 1), round(mm['light_tb'], 1)),
                       ('edge minus inside', round(mh['edge'], 1), round(mm['edge'], 1)),
                       ('a value holds, 16 steps', round(mh['run'], 2), round(mm['run'], 2)),
                       ('joint over inside across', round(mh['joint_x'], 2), round(mm['joint_x'], 2)),
                       ('joint over inside down', round(mh['joint_y'], 2), round(mm['joint_y'], 2))):
        A('  %-28s %10s %10s' % (aa, bb, cc))
    A('')
    A('THE ONE QUESTION, AND IT IS ABOUT THE WORLD AND NOT THE ART: nobody has repainted a line')
    A('in this valley since the dollar died, so how much paint is left on a road is a reading')
    A('of how long ago that was. A WORN, as drawn. B GONE, bare carriageway. C FRESH, which')
    A('would say somebody is still in charge.')
    A('')
    A('THE LESSON, AND IT IS THIS LANE\'S OLDEST ONE: MEASURE AND LOOK. Green guards over a')
    A('worse picture is the most dangerous state there is, because it reads as finished. The')
    A('fault was not in any of the eight numbers. It was in the question they were asked.')
    A('')
    A('MEASURED THIS RUN:')
    for st, line, why in log:
        A('  %-4s %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('\n  wrote %s\n  wrote %s\n  wrote %s' % (OUT_BANK, OUT_SHEET, OUT_REC))


if __name__ == '__main__':
    main()
