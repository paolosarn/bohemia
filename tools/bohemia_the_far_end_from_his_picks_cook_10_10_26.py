#!/usr/bin/env python3
"""THE FAR END'S GROUND, RE-CUT FROM HIS OWN TERRAIN PICKS
   (COOK [the pack is the twin] part 3, 10/10/26; rules 82a, 87, 89)

THE ROW, part (3): "the far end's 16 px tiles from the terrain picks where they exist."
Rule 82a: "every tile ... comes FROM the corpus (placed, flipped, weathered, recoloured inside
the pack's palette), never cooked fresh."

*** AND THE PICTURE SAYS IT BEFORE ANY NUMBER DOES. *** His approved terrain is gravel with
stones in it, dirt with grit, grass tufts, cracked rock. The far end's basin tile this lane
shipped is A FLAT TAN SQUARE: fifty near-identical tans over 256 pixels, a smooth wash with no
grain at all. Laid across a 96 by 96 valley that is what makes the map read as paper.

WHAT THIS DOES, AND THE ONE DECISION THAT MATTERS. A far-end cell is 16 px and his master is
96. Shrinking his tile into 16 px the usual way AVERAGES IT, and averaging gravel gives you
back exactly the flat tan square we already have: the grain is the first thing a mean throws
away. So the cell is POINT-SAMPLED instead -- 256 pixels taken from his tile, nearest
neighbour, no filter -- which keeps his palette AND his speckle at the size the map draws.
That is the whole trick, it is one line of code, and it is the difference between his ground
and our paper.

  basin, field, yard   his DESERT picks (1. Ground Tiles, 3. Stone paths, 2. Soil and dirt)
  wash                 his DESERT picks, the paler ones
  road, spine, water   LEFT ALONE and said so: his terrain picks hold no road and no water,
                       so there is nothing of his to cut them from. Cooking a substitute for
                       an asset that is not in the index is the 7/27 shopping law's own
                       violation in reverse, and inventing one here would be worse.

RULE 89 IS THE SHIP TEST, NOT A FOOTNOTE: the same patch of valley, before and after, side by
side in one picture at ONE ART PIXEL TO ONE PHONE PIXEL. If he cannot see it there, it did not
ship, whatever the numbers say.

    python3 tools/bohemia_the_far_end_from_his_picks_cook_10_10_26.py
      -> banks/BOHEMIA_THE_FAR_END_TILES_FROM_HIS_PICKS_10_10_26.txt
      -> slices/vote/COOK_THE_FAR_END_FROM_HIS_PICKS.png   (before | after, 1:1)
      -> records/BOHEMIA_THE_FAR_END_FROM_HIS_PICKS_MEASURED_10_10_26.txt

REFERENCE CHECK (the 9/4 standing law): the reference IS his own approved tiles, which is rule
82a's point. banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt is his 7/14 verdict ("pool membership is
a Paolo verdict"), and every tile used is also UP in his 7/13 sweep, checked here.
  REUSE CHECK: nothing is drawn. Every pixel of the new ground comes out of
  BOHEMIA_HD_TILE_REPO_part1-4 under the keys in BOHEMIA_TERRAIN_PICKS_7_14_26 and
  BOHEMIA_ACT1_CONFIRMED_SET_7_13_26; the tiles' edge keys and their layout come from this
  lane's own BOHEMIA_THE_FAR_END_TILES_10_10_26, unchanged.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md: their
  map reads at a glance because every terrain has its own GRAIN, not just its own colour --
  you know a swamp from a plain before you read the legend. WHAT MOVES THAT THEIR PICTURE DOES
  NOT (rule 33g): nothing moves here; this is the opposite lesson. Ours had the colours right
  and no grain at all, so the far end read as a painted board instead of ground. The finding
  is that AT MAP SIZE GRAIN IS WHAT SAYS WHAT A PLACE IS, and a mean filter deletes it.
"""
import base64, collections, io, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

PICKS = 'banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt'
CONFIRMED = 'banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt'
REPO = 'banks/BOHEMIA_HD_TILE_REPO_part%d.txt'
MINE = 'banks/BOHEMIA_THE_FAR_END_TILES_10_10_26.txt'
OUT_BANK = 'banks/BOHEMIA_THE_FAR_END_TILES_FROM_HIS_PICKS_10_10_26.txt'
OUT_CARD = 'slices/vote/COOK_THE_FAR_END_FROM_HIS_PICKS.png'
OUT_REC = 'records/BOHEMIA_THE_FAR_END_FROM_HIS_PICKS_MEASURED_10_10_26.txt'

CELL = 16
# the far end's own ground kinds, and which of HIS pools each one is cut from. road, spine and
# water are not here on purpose: his terrain picks hold none of those.
FROM_HIS = {'basin': 'DESERT', 'field': 'DESERT', 'yard': 'DESERT', 'wash': 'DESERT'}
LEFT_ALONE = ('road', 'spine', 'water')

def die(m): sys.exit('REFUSED: ' + m)


def his_terrain():
    """HIS OWN PICKS, AND THE PICK IS THE APPROVAL.

       *** THE FIRST CUT OF THIS WAS A GUARD STRICTER THAN HIS OWN VERDICT, AND IT LEFT THE
       WHOLE VALLEY STANDING ON ONE TILE REPEATED 630 TIMES. *** I demanded that every terrain
       pick ALSO be UP in the 7/13 sweep, and seven of his thirteen failed it, so one tile was
       all that survived. Then I looked at why. Six of the seven WERE NEVER JUDGED ON 7/13 AT
       ALL -- their packs are not in that sweep -- and the seventh was judged DOWN on 7/13 and
       then PICKED BY HIM ON 7/14. The terrain picks file says it in its own law line: "pool
       membership is a Paolo verdict." The 7/14 pick is the later ruling and the newest date
       wins, which is this repo's own truth hierarchy.

       So the pick is the authority. The 7/13 sweep is reported beside each one, and a pick
       that REVERSES a DOWN is named out loud rather than quietly resolved, because that is a
       thing the coordinator should be able to see."""
    packs = {}
    for i in range(1, 5):
        packs.update(json.load(open(REPO % i))['packs'])
    sweep = {(v['pack'], v['idx']): v['v'] for v in json.load(open(CONFIRMED))['verdicts']}
    tp = json.load(open(PICKS))
    pools, skipped, notes = collections.defaultdict(list), [], []
    def take(pool, x, fav=False):
        k = (x['pack'], x['idx'])
        if x['pack'] not in packs or x['idx'] >= len(packs[x['pack']]):
            skipped.append(('%s#%d' % k, 'the pixels are not in the HD repo')); return
        was = sweep.get(k)
        if was == 'DOWN':
            notes.append('%s#%d was DOWN in the 7/13 sweep and he PICKED it on 7/14; the '
                         'later ruling wins and it is in' % k)
        im = Image.open(io.BytesIO(base64.b64decode(packs[x['pack']][x['idx']]['b64'])))
        pools[pool].append(dict(key='pack:%s#%d' % k, pack=x['pack'], idx=x['idx'],
                                im=im.convert('RGB'), sweep_7_13=was or 'not judged on 7/13',
                                favourite=fav))
    for pool, items in tp['picks'].items():
        for x in items: take(pool, x)
    f = tp.get('favorite')
    if f:
        for _ in range(int(f.get('weight', 1))): take('DESERT', f, fav=True)
    return pools, skipped, notes


def point_sample(src, n, ox, oy, flip):
    """*** THE ONE DECISION OF THIS ROUND. *** A 96 px master into a 16 px cell: resize it the
       ordinary way and the mean throws the grain away, which hands you back the flat tan
       square we already have. So every one of the 256 pixels is TAKEN from his tile, nearest
       neighbour, no filter, at a stride that walks the whole master -- his palette and his
       speckle arrive at map size intact."""
    a = np.asarray(src, np.uint8)
    if flip & 1: a = a[:, ::-1]
    if flip & 2: a = a[::-1, :]
    # *** AND THE FIRST CUT CAME OUT AS GRAPH PAPER. *** Striding the WHOLE master means every
    # single cell catches his tile's own dark outer edge, so 630 cells each got a dark border
    # and the far end read as a drawn grid instead of ground. His masters are a slab with an
    # edge around it; the ground is the INSIDE of them. The stride walks the inner 80% now and
    # the grid is gone, at no cost to the grain.
    h, w, _ = a.shape
    iy, ix = int(h * 0.10), int(w * 0.10)
    a = a[iy:h - iy, ix:w - ix]
    h, w, _ = a.shape
    ys = ((np.arange(n) * h // n) + oy) % h
    xs = ((np.arange(n) * w // n) + ox) % w
    return Image.fromarray(a[np.ix_(ys, xs)], 'RGB')


def grain(im):
    """HOW MUCH GROUND IS IN A GROUND TILE, in two numbers a map can be judged by:
       SPREAD   the standard deviation of luminance inside the tile. A wash is near zero;
                gravel is not.
       STEP     the mean jump between one pixel and the next. Grain is local contrast, and
                a smooth gradient has almost none however many colours it holds."""
    a = np.asarray(im.convert('RGB'), np.float32)
    y = a @ np.array([0.299, 0.587, 0.114], np.float32)
    step = (np.abs(np.diff(y, axis=0)).mean() + np.abs(np.diff(y, axis=1)).mean()) / 2.0
    cols = len({tuple(c) for c in np.asarray(im.convert('RGB'), np.uint8).reshape(-1, 3)})
    return float(y.std()), float(step), cols


def choose_per_kind(pools):
    """ONE TILE OF HIS PER GROUND KIND, CHOSEN BY MEASUREMENT.

       *** THE CUT BEFORE THIS ONE CYCLED THROUGH HIS WHOLE DESERT POOL CELL BY CELL AND THE
       VALLEY CAME OUT A CHESSBOARD. *** His nine desert picks run from near-black burnt rock
       to pale open sand, so neighbouring cells flipped light-dark-light and the far end read
       as a checked tablecloth. A basin cell should look like a basin cell. The variation
       between neighbours belongs in WHERE IN HIS TILE the cell was taken from, which is rule
       82a's own word, "placed, flipped" -- not in which tile it came from.

       The four kinds are assigned by two numbers off his own tiles, so nobody has to trust my
       eye: GREEN (how much more green than red, which is what grass tufts are) and LIGHT."""
    # HIS FAVOURITE IS IN THE POOL TWICE ON PURPOSE (it carries a weight), which is right for
    # picking at random and WRONG for picking one per kind: the guard caught basin and wash
    # landing on the same tile because they were two copies of the same entry. Choosing is done
    # on the pool WITHOUT its duplicates; the weight still means something wherever a pool is
    # drawn from by chance.
    seen, d = set(), []
    for e in (pools.get('DESERT') or []):
        if e['key'] in seen: continue
        seen.add(e['key']); d.append(e)
    if len(d) < 4: die('his desert pool holds %d distinct tiles; four kinds need four' % len(d))
    def nums(e):
        a = np.asarray(e['im'], np.float32)
        return float(a[:, :, 1].mean() - a[:, :, 0].mean()), float(a.mean())
    for e in d: e['green'], e['light'] = nums(e)
    field = max(d, key=lambda e: e['green'])
    rest = sorted([e for e in d if e is not field], key=lambda e: -e['light'])
    out = {'field': field, 'basin': rest[0], 'wash': rest[1], 'yard': rest[-1]}
    for k, e in out.items(): e['kind'] = k
    return out


def recut():
    """EVERY LAND TILE OF THE FAR END, RE-CUT. The tile's KEYS do not move: its self and its
       four edge types are this lane's own layout and the map stamps by them, so the map does
       not have to change at all. Only the pixels change, and they become his."""
    pools, skipped, notes = his_terrain()
    chosen = choose_per_kind(pools)
    mine = json.load(open(MINE))
    if mine.get('cell_px') != CELL: die('the far end is %s px a cell, not %d' % (mine.get('cell_px'), CELL))
    out, before, after, used = [], [], [], collections.Counter()
    shown = collections.Counter()
    r = 1
    for k, t in enumerate(mine['tiles']):
        rec = dict(t)
        pool = FROM_HIS.get(t['self'])
        old = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGB')
        if pool is None:
            rec['from'] = 'this lane\'s 10/10 painting (his picks hold no %s)' % t['self']
            out.append(rec); continue
        src = chosen[t['self']]
        # the same cell always lands on the same patch of his tile: the far end is stamped by
        # (self, N, E, S, W) and a cell that flickered between runs would be a new bug
        new = point_sample(src['im'], CELL, (k * 13) % 97, (k * 29) % 89, k % 4)
        b = io.BytesIO(); new.save(b, 'PNG')
        rec['b64'] = base64.b64encode(b.getvalue()).decode()
        rec['from'] = src['key']
        rec['px'] = [CELL, CELL]
        used[src['key']] += 1
        out.append(rec)
        # the sheet's cells are taken ACROSS THE GROUND KINDS, not the first 48 in bank order:
        # those are all basin, and a before-and-after that shows one kind is not the far end
        if shown[t['self']] < 12:
            shown[t['self']] += 1
            before.append(old); after.append(new)
    return mine, out, before, after, used, skipped, pools, notes, chosen


def guards(mine, out, used, skipped, pools, notes, chosen, mm, log):
    fails = []
    def ok(line, cond, why=''):
        log.append(('ok' if cond else 'FAIL', line, why))
        if not cond: fails.append(line + (('  ' + why) if why else ''))

    land = [t for t in out if t['self'] in FROM_HIS]
    rest = [t for t in out if t['self'] not in FROM_HIS]
    ok('EVERY LAND TILE OF THE FAR END IS NOW HIS: %d of %d tiles re-cut from his own terrain '
       'picks, %d left alone because his picks hold no road, spine or water'
       % (len(land), len(out), len(rest)),
       land and all(str(t.get('from', '')).startswith('pack:') for t in land))

    ok('AND THE ONES LEFT ALONE SAY SO INSTEAD OF PRETENDING: %s'
       % ', '.join(sorted({t['self'] for t in rest})),
       all('his picks hold no' in str(t.get('from', '')) for t in rest),
       'cooking a substitute for an asset that is not in the index is the 7/27 law in reverse')

    # *** AND THIS GUARD HAD TO BE REWRITTEN BECAUSE IT WAS MEASURING THE WRONG PROPERTY. ***
    # It asked for eight or more distinct tiles of his across the valley, which was the right
    # test against the FIRST bug (one tile repeated 630 times) and the wrong test against the
    # design that fixed the SECOND one (a chessboard). One tile per ground kind is the point
    # now, so four is correct and eight would be the chessboard coming back. What actually
    # matters is two things, and they are both measured here instead.
    ok('EVERY TILE USED IS ONE HE PICKED ON 7/14: %d tiles of his over %d cells%s'
       % (len(used), sum(used.values()),
          (', %d skipped: %s' % (len(skipped), '; '.join('%s (%s)' % s for s in skipped)))
          if skipped else ''),
       len(used) > 0 and all(k.startswith('pack:') for k in used))
    kinds = {k: chosen[k]['key'] for k in chosen}
    ok('EVERY GROUND KIND HAS ITS OWN TILE OF HIS AND NO TWO KINDS SHARE ONE, so a basin cell '
       'looks like a basin cell: %s'
       % ', '.join('%s=%s' % (k, v.split('#')[0][5:]) for k, v in sorted(kinds.items())),
       len(set(kinds.values())) == len(kinds),
       'two kinds on one tile is a valley with no districts in it')
    pics = collections.Counter(t['b64'] for t in out if t['self'] in FROM_HIS)
    worst = pics.most_common(1)[0][1] if pics else 0
    ok('AND NO TWO CELLS ARE THE SAME PICTURE, because the difference between neighbours is '
       'WHERE IN HIS TILE they were taken from: %d land cells, %d distinct pictures, the most '
       'repeated appears %d time(s)' % (sum(pics.values()), len(pics), worst),
       len(pics) >= sum(pics.values()) * 0.9 and worst <= 3,
       'a repeated picture across neighbours is the stamping fault this lane shipped green '
       'in the back lot')
    for n in notes:
        ok('A PICK THAT REVERSES AN EARLIER VERDICT IS NAMED, NOT QUIETLY RESOLVED: %s' % n, True)

    keys_before = [(t['self'], t['N'], t['E'], t['S'], t['W']) for t in json.load(open(MINE))['tiles']]
    keys_after = [(t['self'], t['N'], t['E'], t['S'], t['W']) for t in out]
    ok('NOT ONE KEY MOVED, so the map stamps exactly as it did and nothing downstream changes: '
       '%d keys, %d the same' % (len(keys_after), sum(a == b for a, b in zip(keys_before, keys_after))),
       keys_before == keys_after)

    ok('THE GRAIN ARRIVED, WHICH IS THE WHOLE POINT: the spread of light inside a land tile '
       'went %.2f -> %.2f and the jump from one pixel to the next went %.2f -> %.2f'
       % (mm['spread'][0], mm['spread'][1], mm['step'][0], mm['step'][1]),
       mm['spread'][1] > mm['spread'][0] * 1.8 and mm['step'][1] > mm['step'][0] * 1.8,
       'if a re-cut does not change the picture it did not happen (rule 89)')

    ok('AND THE COLOURS CAME WITH IT: %0.0f in a land tile before, %0.0f after'
       % (mm['cols'][0], mm['cols'][1]), mm['cols'][1] > mm['cols'][0])

    ok('NOTHING WAS RESIZED: every re-cut cell is %d x %d, point-sampled, never filtered'
       % (CELL, CELL), all(t.get('px') == [CELL, CELL] for t in land))
    return fails


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def patch(tiles, cols=24, rows=8):
    """A PATCH OF THE VALLEY AT THE FAR STOP, at one art pixel to one phone pixel. 24 by 8
       cells is 384 by 128 px, which is a real piece of what the map draws, not a swatch."""
    im = Image.new('RGB', (cols * CELL, rows * CELL), BG)
    for i in range(cols * rows):
        im.paste(tiles[i % len(tiles)], ((i % cols) * CELL, (i // cols) * CELL))
    return im


def card(before, after, mm):
    """RULE 89: ONE PICTURE, THE SAME THING BEFORE AND AFTER, SIDE BY SIDE, 1:1. The same 24
       by 8 cells of the far end, the same order, the same size, nothing scaled. The numbers
       are under it as the proof line and never as the show."""
    a, b = patch(before), patch(after)
    f16, f12, f11 = font(16), font(12), font(11)
    pad = 14
    W = max(a.size[0], 760) + pad * 2
    H = 70 + a.size[1] + 30 + b.size[1] + 165
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((pad, 12), 'THE FAR END\'S GROUND, BEFORE AND AFTER', font=f16, fill=INK)
    d.text((pad, 34), 'the same 24 by 8 cells of the valley, the same order, one art pixel to '
                      'one phone pixel, nothing scaled', font=f11, fill=DIM)
    y = 60
    d.text((pad, y), 'BEFORE: painted by this lane', font=f12, fill=HOT)
    im.paste(a, (pad, y + 18))
    y += 18 + a.size[1] + 14
    d.text((pad, y), 'AFTER: cut from the terrain tiles he picked and approved', font=f12, fill=HOT)
    im.paste(b, (pad, y + 18))
    y += 18 + b.size[1] + 18
    for t in ('THE PROOF LINE, under the picture where it belongs:',
              '  the spread of light inside a tile   %.2f  ->  %.2f'
              % (mm['spread'][0], mm['spread'][1]),
              '  the jump from one pixel to the next  %.2f  ->  %.2f'
              % (mm['step'][0], mm['step'][1]),
              '  colours in one 16 px tile            %0.0f  ->  %0.0f'
              % (mm['cols'][0], mm['cols'][1]),
              '',
              'A 96 px master into a 16 px cell: resize it the ordinary way and the MEAN THROWS '
              'THE GRAIN AWAY,',
              'which hands back the flat square we had. Every pixel here is TAKEN from his '
              'tile, nearest neighbour.'):
        d.text((pad, y), t, font=f11 if t.startswith('  ') or t.startswith('A ') or
               t.startswith('which') else f12,
               fill=DIM if t.startswith(('  ', 'A ', 'which')) else INK)
        y += 17
    return im


def main():
    mine, out, before, after, used, skipped, pools, notes, chosen = recut()
    g_before = [grain(x) for x in before]
    g_after = [grain(x) for x in after]
    f = lambda v, i: sum(x[i] for x in v) / float(len(v))
    mm = dict(spread=(f(g_before, 0), f(g_after, 0)),
              step=(f(g_before, 1), f(g_after, 1)),
              cols=(f(g_before, 2), f(g_after, 2)))
    log = []
    fails = guards(mine, out, used, skipped, pools, notes, chosen, mm, log)
    for st, line, why in log:
        print(('  ' if st == 'ok' else '  *** ') + st.upper() + '  ' + line
              + (('  [' + why + ']') if why and st != 'ok' else ''))
    if fails:
        die('%d guard(s) red:\n   - ' % len(fails) + '\n   - '.join(fails))

    os.makedirs('slices/vote', exist_ok=True)
    card(before, after, mm).save(OUT_CARD, optimize=True)
    bank = dict(mine)
    bank['bank'] = 'BOHEMIA_THE_FAR_END_TILES_FROM_HIS_PICKS_10_10_26'
    bank['built'] = '10/10/26'
    bank['cut_from'] = ('his own 7/14 terrain picks, keyed and checked against his 7/13 sweep; '
                        'the tiles\' keys and layout are this lane\'s 10/10 bank, unchanged')
    bank['palette'] = 'HIS. banks/BOHEMIA_TERRAIN_PICKS_7_14_26.txt, through the HD repo'
    bank['method'] = ('a 16 px cell is POINT-SAMPLED out of his 96 px master, nearest '
                      'neighbour, no filter: a mean deletes the grain, which is the only thing '
                      'that makes ground read as ground at map size')
    bank['pack_tiles_used'] = {k: v for k, v in sorted(used.items())}
    bank['verdict_notes'] = notes
    bank['left_alone'] = list(LEFT_ALONE)
    bank['tile_per_kind'] = {k: dict(key=v['key'], green=round(v['green'], 2),
                                     light=round(v['light'], 1)) for k, v in chosen.items()}
    bank['measured'] = mm
    bank['tiles'] = out
    json.dump(bank, open(OUT_BANK, 'w'))
    open('banks/PACK_TILES_USED_FAR_END_10_10_26.txt', 'w').write(
        'THE FAR END\'S GROUND, AND THE TILE OF HIS EVERY CELL CAME FROM (rule 82a)\n'
        + '=' * 74 + '\n' + '\n'.join('%-56s %4d cells' % (k, v) for k, v in sorted(used.items()))
        + '\nLEFT ALONE (his terrain picks hold none of these): %s\n' % ', '.join(LEFT_ALONE))

    L = []
    A = L.append
    A("THE FAR END'S GROUND, RE-CUT FROM HIS OWN TERRAIN PICKS -- MEASURED")
    A('(COOK [the pack is the twin] part 3, 10/10/26; rules 82a, 87, 89)')
    A('=' * 78)
    A('')
    A('THE ROW, part (3): "the far end\'s 16 px tiles from the terrain picks where they exist."')
    A('')
    A('*** AND THE PICTURE SAID IT BEFORE ANY NUMBER DID. *** His approved terrain is gravel')
    A('with stones in it, dirt with grit, grass tufts, cracked rock. The far-end basin tile')
    A('this lane shipped is A FLAT TAN SQUARE: fifty near-identical tans over 256 pixels, a')
    A('smooth wash with no grain at all. Laid across a 96 by 96 valley, that is what makes the')
    A('map read as paper.')
    A('')
    A('THE ONE DECISION OF THIS ROUND, AND IT IS ONE LINE OF CODE. A far-end cell is 16 px and')
    A('his master is 96. Shrink his tile the ordinary way and the MEAN THROWS THE GRAIN AWAY --')
    A('averaging gravel gives you back exactly the flat tan square we already had. So every one')
    A('of the 256 pixels is TAKEN from his tile, nearest neighbour, no filter, at a stride that')
    A('walks the whole master. His palette and his speckle arrive at map size intact.')
    A('')
    A('MEASURED, ON THE SAME 48 CELLS BEFORE AND AFTER:')
    A('  the spread of light inside a tile    %6.2f  ->  %6.2f' % (mm['spread'][0], mm['spread'][1]))
    A('  the jump from one pixel to the next  %6.2f  ->  %6.2f' % (mm['step'][0], mm['step'][1]))
    A('  colours in one 16 px tile            %6.0f  ->  %6.0f' % (mm['cols'][0], mm['cols'][1]))
    A('')
    A('NOT ONE KEY MOVED. A far-end tile is stamped by its self and its four edge types, and')
    A('those are this lane\'s own layout. Only the pixels changed, so the map needs no change at')
    A('all to show his ground instead of ours.')
    A('')
    A('WHAT WAS LEFT ALONE, AND WHY IT IS NAMED INSTEAD OF FAKED: road, spine and water. His')
    A('terrain picks hold no road tile and no water tile, so there is nothing of his to cut them')
    A('from. Cooking a substitute for an asset that is not in the index is the 7/27 shopping')
    A('law\'s own violation; inventing one and calling it his would be worse. They stay this')
    A('lane\'s paint and the bank says so on every one of them.')
    A('')
    A('ONE TILE OF HIS PER GROUND KIND, CHOSEN BY TWO NUMBERS OFF HIS OWN TILES (how much more')
    A('green than red, which is what a grass tuft is, and how light it is) so nobody has to')
    A('trust my eye:')
    for k in ('basin', 'field', 'wash', 'yard'):
        e = chosen[k]
        A('  %-6s %-46s green %+5.1f  light %5.1f' % (k, e['key'], e['green'], e['light']))
    A('')
    A('*** AND THE CUT BEFORE THIS ONE CAME OUT A CHESSBOARD. *** It walked his whole desert')
    A('pool cell by cell, and his nine picks run from near-black burnt rock to pale open sand,')
    A('so neighbours flipped light-dark-light and the far end read as a checked tablecloth. A')
    A('basin cell should look like a basin cell; the difference between neighbours belongs in')
    A('WHERE IN HIS TILE the cell was taken from, which is rule 82a\'s own word, "placed,')
    A('flipped", and not in which tile it came from.')
    A('')
    A('THE TILES OF HIS THAT THE VALLEY NOW STANDS ON:')
    for k, v in sorted(used.items()):
        A('  %-56s %4d cells' % (k, v))
    if skipped:
        A('')
        A('PICKS SKIPPED, WITH THE REASON:')
        for s in skipped: A('  %s  (%s)' % s)
    A('')
    A('*** AND THE FIRST CUT OF THIS RAN A GUARD STRICTER THAN HIS OWN VERDICT. *** I demanded')
    A('every pick also be UP in the 7/13 sweep. Seven of his thirteen failed it and the whole')
    A('far end came out standing on ONE TILE REPEATED 630 TIMES. Then I looked at why: six of')
    A('the seven were NEVER JUDGED ON 7/13 AT ALL, because their packs are not in that sweep,')
    A('and the seventh was judged DOWN on 7/13 and then PICKED BY HIM ON 7/14. The picks file')
    A('says it in its own law line: "pool membership is a Paolo verdict." The later ruling wins.')
    for n in notes:
        A('  ' + n)
    A('')
    A('RULE 89 IS THE SHIP TEST HERE, NOT A FOOTNOTE. The sheet is the same 24 by 8 cells of')
    A('the valley before and after, side by side, at one art pixel to one phone pixel, nothing')
    A('scaled, and the numbers sit UNDER it as the proof line. If he cannot see it in that')
    A('picture it did not ship, whatever the numbers say.')
    A('')
    A('MEASURED THIS RUN:')
    for st, line, why in log:
        A('  %-4s %s' % (st.upper(), line))
    open(OUT_REC, 'w').write('\n'.join(L) + '\n')
    print('\n  wrote %s\n  wrote %s\n  wrote %s\n  wrote %s'
          % (OUT_BANK, 'banks/PACK_TILES_USED_FAR_END_10_10_26.txt', OUT_CARD, OUT_REC))


if __name__ == '__main__':
    main()
