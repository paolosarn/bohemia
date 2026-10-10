#!/usr/bin/env python3
"""HOW THE PACK DID IT: THE ROAD  (COOK [how the pack did it], 10/10/26, rule 100c)

PAOLO 10/10: "not getting inspired from the assets I downloaded, UNDERSTANDING HOW THOSE ARE
COOKED UP so when we implement them they don't stick out like sore thumbs." Rule 100c: every
cook round opens with one page on the family being cooked -- pixel density, palette and its
count, light direction, outline rule, dither and cluster rules, how a tile meets its neighbour
-- read from his purchased tiles, with the tiles that prove each line. NO DRAWING BEFORE THE
PAGE.

THE FAMILY THIS ROUND IS THE ROAD, and this lane picked it rather than being handed it: the
pass (rule 98) has one plate and COOK is not a station on it, so the choice is mine and is
said out loud. The reasons: rule 77b names COOK on the map's roads; he named them himself on
10/10 ("BRO ON THE MAP NOT ON THE COMBAT, and even then it's looking like shit"); and the road
is the most looked-at structure on a map after the ground, which this lane re-cut last round.

WHAT THIS PAGE IS NOT: it is not an opinion about his tiles. Every line is a number measured
off the 290 road tiles he bought and judged UP, now sitting as files in reference/art_bank/
road, and every line names the tiles that prove it.

    python3 tools/bohemia_how_the_pack_did_it_road_cook_10_10_26.py
      -> records/BOHEMIA_HOW_THE_PACK_DID_IT_ROAD_10_10_26.md
      -> records/target/COOK_HOW_THE_PACK_DID_IT_ROAD.png

NOTHING GOES TO slices/ OR engine/ (rule 100a). The sheet lives in records/target, which the
site publishes, so the VOTE tab can show it without this lane touching the demo.

REFERENCE CHECK (the 9/4 standing law): the reference IS his own purchased tiles, which is
rules 82a and 100c's whole point; reference/art_bank/road is this lane's own 10/10 extraction
of them, keyed by the key he judged them under.
  REUSE CHECK: nothing is drawn in this file at all. It measures
  reference/art_bank/CORPUS.json and the PNGs beside it, which came out of
  banks/BOHEMIA_HD_TILE_REPO under the keys in banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md: their
  roads read at every zoom because a road tile is drawn to MEET, not to be pretty alone -- the
  edge is the contract. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g): nothing moves on a
  study page. The lesson taken is that the edge is measured here before anything is drawn,
  because every tile this lane has shipped that failed, failed at its edge.
"""
import collections, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANK = 'reference/art_bank'
CORPUS = BANK + '/CORPUS.json'
FAMILY = 'road'
OUT_PAGE = 'records/BOHEMIA_HOW_THE_PACK_DID_IT_ROAD_10_10_26.md'
OUT_SHEET = 'records/target/COOK_HOW_THE_PACK_DID_IT_ROAD.png'

def die(m): sys.exit('REFUSED: ' + m)
LUM = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]


def tiles():
    rows = [r for r in json.load(open(CORPUS))['tiles'].values() if r['family'] == FAMILY]
    if not rows: die('no %s tiles in the bank' % FAMILY)
    out = []
    for r in sorted(rows, key=lambda r: (r['pack'], r['idx'])):
        im = Image.open(os.path.join(BANK, FAMILY, r['file'])).convert('RGB')
        out.append((r, im, np.asarray(im, np.int16)))
    return out


def density(T):
    """HOW MANY PIXELS HE SPENDS ON A TILE, and how square it is. A pack tile is a master, so
       this is the ceiling the family was drawn at, not the size it is used at."""
    w = [t[1].size[0] for t in T]; h = [t[1].size[1] for t in T]
    return dict(n=len(T), w_median=float(np.median(w)), h_median=float(np.median(h)),
                w_min=min(w), w_max=max(w), h_min=min(h), h_max=max(h),
                px_median=float(np.median([a * b for a, b in zip(w, h)])))


def palette(T):
    """HOW MANY COLOURS A TILE HOLDS, AND HOW FEW IT LEANS ON. Two numbers, because they say
       different things: the count is how deep the surface is, and the share carried by the
       top eight is whether it is a painting or a ramp."""
    counts, top8, spans = [], [], []
    for r, im, a in T:
        flat = [tuple(c) for c in a.reshape(-1, 3)]
        c = collections.Counter(flat)
        counts.append(len(c))
        top8.append(100.0 * sum(n for _, n in c.most_common(8)) / len(flat))
        y = np.asarray([LUM(k) for k in c], np.float32)
        spans.append(float(y.max() - y.min()))
    return dict(colours_median=float(np.median(counts)),
                colours_min=int(min(counts)), colours_max=int(max(counts)),
                top8_share_median=float(np.median(top8)),
                value_span_median=float(np.median(spans)))


def light(T):
    """WHICH WAY HIS LIGHT FALLS, measured and not assumed: the brighter half of the tile
       against the darker, along both axes. A family lit from one corner has a consistent
       sign; a family lit from above has none."""
    dx, dy = [], []
    for r, im, a in T:
        y = a @ np.array([0.299, 0.587, 0.114])
        h, w = y.shape
        dx.append(float(y[:, :w // 2].mean() - y[:, w // 2:].mean()))
        dy.append(float(y[:h // 2, :].mean() - y[h // 2:, :].mean()))
    return dict(left_minus_right=float(np.median(dx)), top_minus_bottom=float(np.median(dy)),
                left_lit_share=100.0 * float(np.mean([v > 0 for v in dx])),
                top_lit_share=100.0 * float(np.mean([v > 0 for v in dy])))


def outline(T):
    """IS THERE A LINE ROUND IT? The outermost ring against the ring inside it. A family drawn
       with a dark outline has a big negative step at the edge every time; a family drawn as a
       surface that simply ends has none."""
    steps = []
    for r, im, a in T:
        y = a @ np.array([0.299, 0.587, 0.114])
        if min(y.shape) < 6: continue
        ring0 = np.concatenate([y[0, :], y[-1, :], y[:, 0], y[:, -1]])
        ring1 = np.concatenate([y[1, 1:-1], y[-2, 1:-1], y[1:-1, 1], y[1:-1, -2]])
        steps.append(float(ring0.mean() - ring1.mean()))
    return dict(edge_minus_inside_median=float(np.median(steps)),
                darker_at_edge_share=100.0 * float(np.mean([v < -4 for v in steps])))


def cluster(T):
    """DITHER OR GRAIN? How far a surface holds the same VALUE before it steps.

       *** THE FIRST VERSION OF THIS MEASURED RUNS OF THE EXACT SAME COLOUR AND TOLD ME
       NOTHING. *** It came back "98.5% of runs are a lone pixel", which is true of any
       photograph -- in a tile holding 4,800 colours almost no two neighbours are byte
       identical -- and I had the page about to conclude from it that his tiles are close to a
       per-pixel DITHER. They are the opposite of a dither. A number that cannot tell a
       photograph from a checkerboard is not evidence, and this lane has shipped that mistake
       before.

       So the luminance is quantised to sixteen steps first and the runs are counted on THAT.
       A dither alternates every pixel or two at sixteen steps as well; a painted or
       photographed surface holds a step for a stretch and then moves."""
    runs, singles = [], []
    for r, im, a in T:
        y = (a @ np.array([0.299, 0.587, 0.114])) / 16.0
        q = y.astype(np.int16)
        tot = n = one = 0
        for row in q:
            run = 1
            for i in range(1, len(row)):
                if row[i] == row[i - 1]: run += 1
                else:
                    tot += run; n += 1; one += (run == 1); run = 1
            tot += run; n += 1; one += (run == 1)
        runs.append(tot / float(max(1, n)))
        singles.append(100.0 * one / float(max(1, n)))
    return dict(run_median=float(np.median(runs)), lone_pixel_share=float(np.median(singles)),
                steps=16)


def meets(T):
    """HOW A TILE MEETS ITS NEIGHBOUR, which is the only question that has ever failed one of
       this lane's tiles. Two of the same tile laid side by side: the joint against the inside.
       A family built to tile has a joint no worse than its own inside; a family of standalone
       slabs has a joint several times it."""
    out = []
    for r, im, a in T:
        jx = float(np.abs(a[:, 0, :] - a[:, -1, :]).sum(axis=1).mean())
        ix = float(np.abs(a[:, 1:, :] - a[:, :-1, :]).sum(axis=2).mean())
        jy = float(np.abs(a[0, :, :] - a[-1, :, :]).sum(axis=1).mean())
        iy = float(np.abs(a[1:, :, :] - a[:-1, :, :]).sum(axis=2).mean())
        out.append((jx / max(1.0, ix), jy / max(1.0, iy), r))
    rx = [v[0] for v in out]; ry = [v[1] for v in out]
    best = sorted(out, key=lambda v: v[0] + v[1])[:3]
    worst = sorted(out, key=lambda v: -(v[0] + v[1]))[:3]
    return dict(joint_over_inside_x_median=float(np.median(rx)),
                joint_over_inside_y_median=float(np.median(ry)),
                tiles_that_meet_share=100.0 * float(np.mean([a <= 2.0 and b <= 2.0
                                                             for a, b, _ in out])),
                best=[v[2]['key'] for v in best], worst=[v[2]['key'] for v in worst])


def painted(T):
    """THE EIGHTH MEASUREMENT, AND IT WAS ADDED BECAUSE THE FIRST SEVEN LET A FALSE HEADLINE
       THROUGH. The first cut of the map road tile asked the MARKING family whether the packs
       hold road paint, found warning signs, blood and bones, and answered no. It cooked a
       lane line on that answer and every one of its guards went green. Looking at the picture
       at one art pixel to one phone pixel is what caught it.

       His road paint lives in the ROAD family, painted on the road, which is where road paint
       actually is. So this sweeps all of them for it by number: saturated, light, and blue
       well under green. Nobody has to look again."""
    out = []
    for r, im, a in T:
        f = a.astype(np.float32)
        mx, mn = f.max(2), f.min(2)
        sat = np.where(mx > 0, (mx - mn) / np.maximum(1, mx), 0)
        m = (sat > 0.50) & (mx > 120) & (f[..., 2] < f[..., 1] * 0.65) & (f[..., 0] > f[..., 1] * 1.05)
        share = 100.0 * float(m.sum()) / float(m.size)
        # A MARK IS A MINORITY ON A GREY SURFACE. Without that second half this sweep calls
        # every sandy dirt tile 94% paint, which is true and useless: the tile IS the colour.
        if not (3.0 <= share <= 40.0): continue
        if m.sum() == m.size: continue
        if float(sat[~m].mean()) > 0.33: continue
        rows = int((m.sum(axis=1) > 0).sum())
        out.append((share, rows, m.shape[0], r['key'],
                    tuple(int(v) for v in f[m].mean(0))))
    out.sort(reverse=True)
    return dict(n=len(out), tiles=out)


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def sheet(T, M):
    """THE TILES THAT PROVE EACH LINE, at their own pixels. The three that meet best and the
       three that meet worst are shown LAID TWICE, because that is the only way an edge can be
       looked at."""
    f15, f11 = font(15), font(11)
    pick = {r['key']: (r, im) for r, im, a in T}
    rows = [('THESE MEET: laid twice, the joint is no worse than the inside', M['meets']['best']),
            ('THESE DO NOT: the same tile laid twice, and you can see where', M['meets']['worst'])]
    cellh = max(im.size[1] for _, im, _ in T) + 8
    W = 980
    H = 120 + len(rows) * (cellh + 42) + 150
    im0 = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im0)
    d.text((14, 12), 'HOW THE PACK DID IT: THE ROAD', font=f15, fill=INK)
    d.text((14, 34), '%d tiles he bought and judged UP, measured. Every number below is off '
                     'these files, at their own pixels.' % M['density']['n'], font=f11, fill=DIM)
    d.text((14, 50), 'This is a STUDY PAGE (rule 100c). Nothing here is ours and nothing here '
                     'is a candidate.', font=f11, fill=HOT)
    y = 78
    for title, keys in rows:
        d.text((14, y), title, font=f11, fill=HOT)
        x = 14
        for k in keys:
            if k not in pick: continue
            r, t = pick[k]
            two = Image.new('RGB', (t.size[0] * 2, t.size[1]), BG)
            two.paste(t, (0, 0)); two.paste(t, (t.size[0], 0))
            im0.paste(two, (x, y + 16))
            d.text((x, y + 18 + t.size[1]), k.replace('pack:', '')[:26], font=font(9), fill=DIM)
            x += two.size[0] + 14
        y += cellh + 42
    L = [
        'PIXELS            %d x %d median (%d..%d wide), %d px a tile'
        % (M['density']['w_median'], M['density']['h_median'], M['density']['w_min'],
           M['density']['w_max'], M['density']['px_median']),
        'COLOURS           %d in a tile (%d..%d), and the top eight carry only %.0f%% of it'
        % (M['palette']['colours_median'], M['palette']['colours_min'],
           M['palette']['colours_max'], M['palette']['top8_share_median']),
        'VALUE SPAN        %.0f of 255 inside one tile' % M['palette']['value_span_median'],
        'LIGHT             left minus right %+.1f, top minus bottom %+.1f; %.0f%% are lighter '
        'at the top' % (M['light']['left_minus_right'], M['light']['top_minus_bottom'],
                        M['light']['top_lit_share']),
        'OUTLINE           edge minus inside %+.1f; %.0f%% have a darker ring at the edge'
        % (M['outline']['edge_minus_inside_median'], M['outline']['darker_at_edge_share']),
        'CLUSTER           a value holds %.2f px across a row at 16 steps; %.0f%% of runs are '
        'a lone pixel' % (M['cluster']['run_median'], M['cluster']['lone_pixel_share']),
        'THE EDGE          joint over inside %.2f across, %.2f down; %.0f%% of the family '
        'tiles cleanly' % (M['meets']['joint_over_inside_x_median'],
                           M['meets']['joint_over_inside_y_median'],
                           M['meets']['tiles_that_meet_share'])]
    for t in L:
        d.text((14, y), t, font=f11, fill=DIM if t[0] == ' ' else INK)
        y += 19
    return im0


def main():
    T = tiles()
    M = dict(density=density(T), palette=palette(T), light=light(T),
             outline=outline(T), cluster=cluster(T), meets=meets(T), painted=painted(T))
    for k, v in M.items():
        print('  %-9s %s' % (k, json.dumps({a: (round(b, 2) if isinstance(b, float) else b)
                                            for a, b in v.items()})[:150]))
    os.makedirs('records/target', exist_ok=True)
    sheet(T, M).save(OUT_SHEET, optimize=True)

    d, p, l, o, c, m = M['density'], M['palette'], M['light'], M['outline'], M['cluster'], M['meets']
    pa = M['painted']
    A = []
    w = A.append
    w('# HOW THE PACK DID IT: THE ROAD')
    w('COOK [how the pack did it], 10/10/26, rule 100c. %d of his purchased road tiles, judged'
      % d['n'])
    w('UP in his 7/13 sweep, measured as files in `reference/art_bank/road`.')
    w('')
    w('Paolo 10/10: *"not getting inspired from the assets I downloaded, UNDERSTANDING HOW')
    w('THOSE ARE COOKED UP so when we implement them they don\'t stick out like sore thumbs."*')
    w('')
    w('**This lane picked the family and says so.** The pass (rule 98) has one plate and COOK')
    w('is not a station on it, so nobody named my next asset. I took the road because rule 77b')
    w('names COOK on the map\'s roads, because he named them himself on 10/10 ("BRO ON THE MAP')
    w('NOT ON THE COMBAT, and even then it\'s looking like shit"), and because after the ground')
    w('the road is the most looked-at thing on a map.')
    w('')
    w('## THE SEVEN NUMBERS')
    w('')
    w('| | his road tiles | what it means for anything we draw |')
    w('|---|---|---|')
    w('| PIXELS | %d x %d median, %d to %d wide, %d px a tile | this is the CEILING the family '
      'was drawn at, not the size it is used at |' % (d['w_median'], d['h_median'], d['w_min'],
                                                      d['w_max'], d['px_median']))
    w('| COLOURS | %d in one tile (%d to %d) | ours ship with seven; this is the gap he is '
      'pointing at |' % (p['colours_median'], p['colours_min'], p['colours_max']))
    w('| HOW FEW IT LEANS ON | the top eight colours carry %.0f%% | a ramp leans on its top '
      'eight almost entirely; his does not, so it is a SURFACE and not a ramp |'
      % p['top8_share_median'])
    w('| VALUE SPAN | %.0f of 255 inside one tile | a tile that spans this much carries its own'
      ' light and does not need the scene to light it |' % p['value_span_median'])
    w('| LIGHT | left minus right %+.1f, top minus bottom %+.1f, %.0f%% lighter at the top | '
      '%s |' % (l['left_minus_right'], l['top_minus_bottom'], l['top_lit_share'],
                'his ground tiles are lit from ABOVE, near enough flat across, so a tile '
                'carries no corner shadow of its own and the SCENE does the lighting'
                if abs(l['left_minus_right']) < 4 else
                'his ground tiles carry their own side light, so a tile must be laid the way '
                'it was drawn'))
    w('| OUTLINE | edge minus inside %+.1f, %.0f%% have a darker ring | %s |'
      % (o['edge_minus_inside_median'], o['darker_at_edge_share'],
         ('NO DARK OUTLINE: the edge is %+.0f, which is LIGHTER than the inside, so the '
          'surface simply ends and often catches a little light as it does. Anything we draw '
          'with a dark line round it will stick out exactly the way he said'
          % o['edge_minus_inside_median'])
         if o['darker_at_edge_share'] < 40 else
         'his tiles DO carry a darker edge, and ours must too or they will float'))
    w('| CLUSTER | a value holds %.2f px across a row at 16 steps, %.0f%% of runs are a lone '
      'pixel | %s |' % (c['run_median'], c['lone_pixel_share'],
         'this is GRAIN: a value holds for a stretch and then steps, so a checkerboard dither '
         'of ours would read as noise beside it' if c['run_median'] > 1.4 else
         'the surface steps nearly every pixel even at sixteen levels, so a smooth painted '
         'patch of ours would read as mush beside it'))
    w('| THE EDGE | joint over inside %.2f across, %.2f down; %.0f%% tile cleanly | %s |'
      % (m['joint_over_inside_x_median'], m['joint_over_inside_y_median'],
         m['tiles_that_meet_share'],
         'most of the family is NOT built to repeat: these are slabs meant to be laid in a '
         'grid with their own edges showing, not seamless fields'
         if m['tiles_that_meet_share'] < 50 else
         'the family is built to repeat and a tile of ours that does not meet is wrong'))
    w('')
    w('## WHAT THIS CHANGES ABOUT WHAT I WAS ABOUT TO DRAW')
    w('')
    w('1. **The colour count is the whole complaint.** %d colours in one of his tiles against '
      'the seven' % p['colours_median'])
    w('   a tile of ours carries. No amount of better shape fixes that; it is a different kind')
    w('   of object. A ramp cannot be made into a surface by adding steps to it.')
    w('2. **The top eight carry only %.0f%%.** That is the number that says SURFACE rather than'
      % p['top8_share_median'])
    w('   palette. Our tiles put nearly everything on their top eight, which is what banding is.')
    w('3. **%s**' % ('No outline.' if o['darker_at_edge_share'] < 40 else 'An outline.'))
    w('4. **%s** (%.2f px a run at sixteen value steps). %s'
      % ('The grain is CLUSTERED, not dithered' if c['run_median'] > 1.4
         else 'The surface steps nearly every pixel', c['run_median'],
         'A dither we add on top will read as noise beside his grain, which is the "sore '
         'thumb" he described.' if c['run_median'] > 1.4
         else 'A smooth painted patch of ours will read as mush beside it.'))
    w('5. **%.0f%% of his road family does not tile.** They are slabs, laid in a grid. So the'
      % m['tiles_that_meet_share'])
    w('   edge rule for anything we cut from them is not "make it seamless", it is "make the')
    w('   seam part of the drawing", which is how a real road is built anyway.')
    w('')
    w('## THE TILES THAT PROVE IT')
    w('')
    w('Laid twice each in `records/target/COOK_HOW_THE_PACK_DID_IT_ROAD.png`.')
    w('')
    w('MEET BEST: ' + ', '.join(m['best']))
    w('')
    w('MEET WORST: ' + ', '.join(m['worst']))
    w('')
    w('## THE EIGHTH NUMBER: HIS ROAD PAINT, AND HOW IT WAS NEARLY MISSED')
    w('')
    w('The first cut of the map road tile asked his MARKING family whether the packs hold road')
    w('paint. That family is warning signs, blood and bones, so the answer came back NO, and on')
    w('that answer a lane line was cooked and eight guards went green. Then the picture was')
    w('looked at, at one art pixel to one phone pixel, and the line read as a scuff.')
    w('')
    w('**His road paint is in the ROAD family, painted on the road, which is where road paint')
    w('actually is.** %d of these %d tiles carry it:' % (pa['n'], len(T)))
    w('')
    w('| tile | paint | rows with paint | its colour |')
    w('| --- | --- | --- | --- |')
    for sh, rows, h, k, rgb in pa['tiles'][:10]:
        w('| `%s` | %.1f%% | %d of %d | rgb%s |' % (k.replace('pack:', ''), sh, rows, h, rgb))
    w('')
    w('AND THE SWEEP IS A CANDIDATE LIST, CHECKED BY EYE, WHICH IS THE WHOLE POINT OF THIS')
    w('SECTION. `2. Rusted metal floor tiles#19` is rust, not paint: warm, saturated and a')
    w('minority on grey metal, so the number cannot tell them apart and looking can. The ones')
    w('confirmed by looking are the cracked street set (#18 to #23, worn orange lane paint on')
    w('dark asphalt) and the cracked concrete set (#8, #17, #36, #37, yellow hazard stripes).')
    w('')
    w('THE LESSON FOR EVERY LANE THAT READS THIS PAGE: a measurement can be green and still be')
    w('answering the wrong question. MEASURE AND LOOK. The sweep above exists so nobody has to')
    w('find this twice.')
    w('')
    w('## ROUTED')
    w('')
    w('- **COOK TWO** (the ground, rule 87): these seven numbers are the bar for every fight')
    w('  tile, street, sidewalk and kerb cut from the packs. The colour count and the top-eight')
    w('  share are the two that decide whether a tile sticks out.')
    w('- **COOK FOUR** (the places): the no-outline line and the cluster line apply to house')
    w('  skins as much as to ground.')
    w('- **DIRECTION**: rule 90 round 8 asks for a card of numbers built from these pages; this')
    w('  is the road page and its numbers are in a table above, ready to go on it.')
    w('- **EVERY ART LANE**: his road paint exists and is listed above. Nobody cooks road paint.')
    open(OUT_PAGE, 'w').write('\n'.join(A) + '\n')
    print('\n  wrote %s\n  wrote %s' % (OUT_PAGE, OUT_SHEET))
    json.dump(M, open('records/target/COOK_ROAD_STUDY_NUMBERS.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
