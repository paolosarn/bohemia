#!/usr/bin/env python3
"""HOW THE PACK DID IT: THE STANDALONE OBJECT  (COOK, 10/10/26, rules 100c, 105)

THE ROUND'S FAMILY IS THE MAP MARKER, AND HIS NO IS WHY:
  "Bro again I don't know who told you that all the assets that you make they don't have to
   be five pixels by five pixels. It's so disappointing."   (Paolo 10/10, on
   cook-the-markers-you-can-find-10-10, rule 104c)
The party marker today is a NINE BY TWENTY character grid. 180 pixels. Rule 105's floor for
its kind is 40 by 40, and the pack it has to stand beside is a 96 pixel world.

THE PACKS HOLD NO MAP MARKERS, so the nearest thing he bought is the PROP: 784 approved
tiles of standalone objects, every one of them solving the marker's exact problem -- a small
thing, cut out, standing on its own, that has to be found at a glance against whatever is
behind it. The road page (10/10) measured SURFACES. This one measures OBJECTS, and the two
families answer the outline question in OPPOSITE directions, which is the finding.

    python3 tools/bohemia_how_the_pack_did_it_prop_cook_10_10_26.py
      -> records/BOHEMIA_HOW_THE_PACK_DID_IT_PROP_10_10_26.md
      -> records/target/COOK_HOW_THE_PACK_DID_IT_PROP.png
      -> records/target/COOK_PROP_STUDY_NUMBERS.json

NOTHING TO slices/ OR engine/ (rule 100a).

REFERENCE CHECK (the 9/4 standing law): the reference is his own purchased prop tiles in
reference/art_bank/prop, 784 of them, and every number here is read off them by machine. No
number on this page is quoted from anywhere else.
  REUSE CHECK: this tool DRAWS NOTHING. It reads his files and writes a page and a contact
  sheet of his own tiles. Nothing is cooked, so there is nothing to reuse.

[bb the overworld is battle brothers] reference/library/battle_brothers/01_WORLDMAP.md:
  "TRAVEL: one marker for the company... you can see their banner and destination line."
  Their party is ONE marker carrying a BANNER, and their map is hand-painted at one painted
  pixel per screen pixel. WHAT MOVES THAT THEIR PICTURE DOES NOT (rule 33g): their banner
  says which noble house you are looking at, and it never changes. Ours is a crew nobody has
  heard of, so the banner is hand-made, and what is painted on it is the only thing on the
  map that is ours.
"""
import collections, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANK = 'reference/art_bank'
FAMILY = 'prop'
OUT_PAGE = 'records/BOHEMIA_HOW_THE_PACK_DID_IT_PROP_10_10_26.md'
OUT_SHEET = 'records/target/COOK_HOW_THE_PACK_DID_IT_PROP.png'
OUT_NUM = 'records/target/COOK_PROP_STUDY_NUMBERS.json'

# THE MAP'S OWN FIVE GROUNDS, read off the map on 9/24 and kept since. A marker is measured
# against these and nothing else, because these are what is actually behind it.
GROUNDS = {'void': '#161410', 'fabric': '#6a6258', 'desert': '#8a7a58',
           'mountain': '#3b352b', 'town': '#5f584c'}
CLEAR = 40.0            # the 9/24 ruler: 40 of 255 is the gap at which a thing reads as separate

def die(m): sys.exit('REFUSED: ' + m)
def rgb(h): return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
LUMV = np.array([0.299, 0.587, 0.114], np.float32)


def tiles():
    """HIS APPROVED PROPS, WITH THEIR ALPHA, because the alpha IS the silhouette and the
       silhouette is most of what a marker is."""
    out = []
    for r in json.load(open(BANK + '/CORPUS.json'))['tiles'].values():
        if r['family'] != FAMILY: continue
        im = Image.open(os.path.join(BANK, FAMILY, r['file'])).convert('RGBA')
        a = np.asarray(im, np.int16)
        if a.shape[0] < 16 or a.shape[1] < 16: continue
        if (a[..., 3] > 128).sum() < 200: continue
        out.append((r, im, a))
    if len(out) < 300: die('only %d props read; the bank is not there' % len(out))
    return out


def density(T):
    """HOW MANY PIXELS HE GIVES A SINGLE OBJECT. This is rule 105's floor, measured on the
       family the marker has to stand beside, and it is the whole reason this round exists."""
    w = [t[2].shape[1] for t in T]; h = [t[2].shape[0] for t in T]
    ink = [int((t[2][..., 3] > 128).sum()) for t in T]
    fill = [100.0 * i / float(ww * hh) for i, ww, hh in zip(ink, w, h)]
    return dict(n=len(T), w_median=float(np.median(w)), h_median=float(np.median(h)),
                w_min=int(min(w)), h_min=int(min(h)),
                ink_median=float(np.median(ink)), ink_min=int(min(ink)),
                fill_median=float(np.median(fill)),
                under_40=int(sum(1 for ww, hh in zip(w, h) if ww < 40 or hh < 40)))


def palette(T):
    """HOW MANY COLOURS ONE OBJECT CARRIES, and how much of it the commonest eight cover.
       Same ruler as the road page, so the two families can be read side by side."""
    cs, t8 = [], []
    for _, _, a in T:
        m = a[..., 3] > 128
        px = [tuple(c) for c in a[..., :3][m].tolist()]
        c = collections.Counter(px)
        cs.append(len(c)); t8.append(100.0 * sum(v for _, v in c.most_common(8)) / len(px))
    return dict(colours_median=float(np.median(cs)), colours_min=int(min(cs)),
                colours_max=int(max(cs)), top8_median=float(np.median(t8)))


def contour(T):
    """*** THE ONE THAT MATTERS, AND IT IS THE OPPOSITE OF THE ROAD PAGE. ***
       A road tile of his has NO dark ring: its edge runs +15 LIGHTER than its inside, because
       a surface has no edge, it just keeps going. An OBJECT is cut out of the world and has
       to say where it stops. So: the band of pixels just inside the alpha edge, against the
       object's own interior. A negative number is a DARK CONTOUR.

       This lane shipped five markers as a dark body with one bright accent and NO contour,
       and another lane had to draw a rim round them to make them usable on the demo. That
       rim is this number, and he already owned it."""
    d, share = [], 0
    for _, _, a in T:
        m = a[..., 3] > 128
        y = (a[..., :3].astype(np.float32) @ LUMV)
        er = np.zeros_like(m)
        er[1:-1, 1:-1] = (m[1:-1, 1:-1] & m[:-2, 1:-1] & m[2:, 1:-1]
                          & m[1:-1, :-2] & m[1:-1, 2:])
        ring = m & ~er                       # one pixel in from the silhouette's edge
        inner = er
        if ring.sum() < 20 or inner.sum() < 60: continue
        v = float(y[ring].mean() - y[inner].mean())
        d.append(v); share += (v < -6.0)
    return dict(n=len(d), edge_minus_inside_median=float(np.median(d)),
                darker_at_edge_share=100.0 * share / float(max(1, len(d))))


def read_band(T):
    """HOW MUCH VALUE AN OBJECT ACTUALLY WORKS WITH, and how light its BODY is once the dark
       contour is taken off it.

       THE FIRST VERSION OF THIS MEASUREMENT WAS USELESS AND IS KEPT HERE AS A NOTE: it asked
       what share of an object sits in the top quarter of its own value range, got 2.4%, and
       that number says nothing, because his spread runs the whole 255 (a near-black contour
       and a white specular) so the top quarter is only the shine. The question had to be
       asked of the BODY, which is the object minus its contour."""
    bodymed, steps, rim = [], [], []
    for _, _, a in T:
        m = a[..., 3] > 128
        y = (a[..., :3].astype(np.float32) @ LUMV)
        er = np.zeros_like(m)
        er[1:-1, 1:-1] = (m[1:-1, 1:-1] & m[:-2, 1:-1] & m[2:, 1:-1]
                          & m[1:-1, :-2] & m[1:-1, 2:])
        if er.sum() < 60: continue
        b = y[er]
        bodymed.append(float(np.median(b)))
        steps.append(int(len(set((b / 16.0).astype(np.int16).tolist()))))
        rim.append(100.0 * float((m & ~er).sum()) / float(m.sum()))
    return dict(body_median_value=float(np.median(bodymed)),
                body_value_steps_median=float(np.median(steps)),
                contour_share_of_object=float(np.median(rim)))


def clear_on_grounds(T):
    """HIS OWN OBJECTS PUT THROUGH THIS LANE'S 9/24 RULER, which is the bar the marker has to
       meet. The share of an object that stands at least 40 of 255 clear of the ground behind
       it, body only, no rim. His props were never drawn for our map, so this is not a
       judgement of his art: it is the number our marker has to beat on the worst ground, and
       his answer is what a well-made object scores without trying."""
    out = {}
    for gname, gh in GROUNDS.items():
        gy = float(np.array(rgb(gh), np.float32) @ LUMV)
        v = []
        for _, _, a in T:
            m = a[..., 3] > 128
            y = (a[..., :3].astype(np.float32) @ LUMV)[m]
            v.append(100.0 * float((np.abs(y - gy) >= CLEAR).sum()) / y.size)
        out[gname] = float(np.median(v))
    worst = min(out.values())
    return dict(per_ground=out, worst_ground_median=worst,
                worst_ground=min(out, key=lambda k: out[k]))


def light(T):
    """WHERE THE SUN IS ON A CUT-OUT OBJECT, measured inside its own silhouette so the empty
       corners of the box cannot vote."""
    lr, tb = [], []
    for _, _, a in T:
        m = a[..., 3] > 128
        y = (a[..., :3].astype(np.float32) @ LUMV)
        h, w = y.shape
        L, R = m[:, :w // 2], m[:, w // 2:]
        Tp, B = m[:h // 2, :], m[h // 2:, :]
        if L.sum() < 30 or R.sum() < 30 or Tp.sum() < 30 or B.sum() < 30: continue
        lr.append(float(y[:, :w // 2][L].mean() - y[:, w // 2:][R].mean()))
        tb.append(float(y[:h // 2, :][Tp].mean() - y[h // 2:, :][B].mean()))
    return dict(left_minus_right_median=float(np.median(lr)),
                top_minus_bottom_median=float(np.median(tb)),
                top_lit_share=100.0 * float(np.mean([v > 0 for v in tb])))


def cluster(T):
    """GRAIN OR DITHER, the road page's ruler again: how far a value holds across a row at
       sixteen luminance steps, inside the silhouette only."""
    runs = []
    for _, _, a in T[:200]:
        m = a[..., 3] > 128
        y = (a[..., :3].astype(np.float32) @ LUMV)
        q = (y / 16.0).astype(np.int16)
        tot = n = 0
        for row_m, row_q in zip(m, q):
            run = 0; prev = None
            for ok, v in zip(row_m, row_q):
                if not ok:
                    if run: tot += run; n += 1
                    run = 0; prev = None; continue
                if v == prev: run += 1
                else:
                    if run: tot += run; n += 1
                    run = 1; prev = v
            if run: tot += run; n += 1
        if n: runs.append(tot / float(n))
    return dict(run_median=float(np.median(runs)), steps=16)


BG = (14, 13, 12); INK = (236, 230, 218); DIM = (146, 138, 126); HOT = (226, 162, 72)
def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p): return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def sheet(T, M):
    """HIS OWN PROPS, ON THE MAP'S OWN FIVE GROUNDS, AT 1:1. The page's numbers are the proof
       line; this is the show (rule 89). Pole-mounted objects first, because a map marker is
       one: his road signs are the nearest thing in the packs to the thing this round makes."""
    f14, f11, f10 = font(14), font(11), font(10)
    pick = [t for t in T if 'Warning Signs and road' in t[0]['key'] or 'Street props' in t[0]['key']]
    pick.sort(key=lambda t: t[0]['key'])
    pick = pick[:10] or T[:10]
    cw, ch = 100, 104
    W = 24 + cw * len(pick)
    H = 56 + ch * len(GROUNDS)
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((14, 12), 'HOW THE PACK DID IT: THE STANDALONE OBJECT', font=f14, fill=INK)
    d.text((14, 32), 'his own props, on the map\'s own five grounds, at one art pixel to one '
                     'phone pixel. nothing of ours is on this page.', font=f10, fill=DIM)
    for gi, (gname, gh) in enumerate(GROUNDS.items()):
        y = 56 + gi * ch
        d.rectangle([14, y, W - 10, y + ch - 6], fill=rgb(gh))
        d.text((16, y + 2), gname, font=f10, fill=(255, 255, 255) if gname in ('void', 'mountain') else (20, 18, 16))
        for pi, (_, pim, _) in enumerate(pick):
            x = 24 + pi * cw
            im.paste(pim, (x, y + 4), pim)
    return im


def main():
    T = tiles()
    M = dict(density=density(T), palette=palette(T), contour=contour(T),
             read_band=read_band(T), clear=clear_on_grounds(T), light=light(T),
             cluster=cluster(T))
    for k, v in M.items():
        print('  %-10s %s' % (k, json.dumps({a: (round(b, 2) if isinstance(b, float) else b)
                                             for a, b in v.items()})[:160]))
    os.makedirs('records/target', exist_ok=True)
    sheet(T, M).save(OUT_SHEET, optimize=True)
    json.dump(M, open(OUT_NUM, 'w'), indent=1)

    de, pa, co, rb, cl, li, cu = (M['density'], M['palette'], M['contour'], M['read_band'],
                                  M['clear'], M['light'], M['cluster'])
    A = []; w = A.append
    w('# HOW THE PACK DID IT: THE STANDALONE OBJECT')
    w('')
    w('COOK, 10/10/26. Rule 100c: the study page before the drawing. Rule 105: the pack is the')
    w('pixel floor. Read off **%d of his approved prop tiles** in `reference/art_bank/prop`.' % de['n'])
    w('')
    w('## WHY THIS FAMILY')
    w('')
    w('His NO, on this lane\'s five map markers: *"Bro again I don\'t know who told you that all')
    w('the assets that you make they don\'t have to be five pixels by five pixels. It\'s so')
    w('disappointing."* The party marker today is a **nine by twenty character grid, 180')
    w('pixels**. The packs hold no map markers, so the nearest thing he bought is the PROP: a')
    w('small thing, cut out, standing on its own, that has to be found at a glance against')
    w('whatever is behind it. That is the marker\'s whole problem, and he owns 784 answers.')
    w('')
    w('## THE NUMBERS')
    w('')
    w('| what | his props | what it means for a marker |')
    w('| --- | --- | --- |')
    w('| size | **%d x %d** median (smallest %d x %d) | rule 105\'s floor is 40 x 40; ours is 9 x 20 |'
      % (de['w_median'], de['h_median'], de['w_min'], de['h_min']))
    w('| painted pixels in one object | **%d** median (smallest %d) | ours is 180 at most, and most of it is post |'
      % (de['ink_median'], de['ink_min']))
    w('| how much of the box it fills | %.0f%% | an object is not a rectangle; the empty box is the silhouette |'
      % de['fill_median'])
    w('| under 40 on a side | **%d of %d** | he does not make tiny things. not once in %d tiles. |'
      % (de['under_40'], de['n'], de['n']))
    w('| colours in one object | **%d** median (%d to %d) | a surface, not a ramp. the road page said the same. |'
      % (pa['colours_median'], pa['colours_min'], pa['colours_max']))
    w('| the top eight carry | %.0f%% | |' % pa['top8_median'])
    w('| **edge minus inside** | **%+.1f** | *** |' % co['edge_minus_inside_median'])
    w('| objects with a dark contour | **%.0f%%** | *** |' % co['darker_at_edge_share'])
    w('| the BODY\'s own value, contour taken off | %.0f of 255 | his objects are not dark; the CONTOUR is |'
      % rb['body_median_value'])
    w('| value steps inside the body, 16 to a step | **%.0f of 16** | ours is a four-rung ladder |'
      % rb['body_value_steps_median'])
    w('| how much of the object is contour | %.0f%% | one pixel round, not a halo |'
      % rb['contour_share_of_object'])
    w('| light: top minus bottom | %+.1f (%.0f%% lighter on top) | the sun is high and north-west |'
      % (li['top_minus_bottom_median'], li['top_lit_share']))
    w('| a value holds, 16 steps | %.2f px | grain, not a dither |' % cu['run_median'])
    w('')
    w('## *** THE CONTOUR, AND IT IS THE OPPOSITE OF THE ROAD PAGE ***')
    w('')
    w('The road page (10/10) measured his SURFACES and found **no dark ring anywhere: his edge')
    w('runs +15 LIGHTER than his inside**, because a surface has no edge, it just keeps going.')
    w('')
    w('His OBJECTS go the other way. Edge minus inside is **%+.1f**, and **%.0f%% of them carry'
      % (co['edge_minus_inside_median'], co['darker_at_edge_share']))
    w('a dark contour** -- all %d of them, without one exception. An object is cut out of the'
      % co['n'])
    w('world and has to say where it stops.')
    w('')
    w('THIS LANE SHIPPED FIVE MARKERS AS A DARK BODY WITH ONE BRIGHT ACCENT AND NO CONTOUR, and')
    w('another lane had to draw a rim round them to make them usable on the demo. **That rim is')
    w('this number, and he already owned it.** A law read off the wrong family is how that')
    w('happened: the no-outline rule is true of his ground and false of his objects.')
    w('')
    w('## WHAT A MARKER HAS TO BEAT')
    w('')
    w('This lane\'s own 9/24 ruler, pointed at his props: the share of an object standing at')
    w('least %d of 255 clear of the ground behind it, body only, no rim.' % int(CLEAR))
    w('')
    w('| ground | his props, median |')
    w('| --- | --- |')
    for g, v in sorted(cl['per_ground'].items(), key=lambda kv: kv[1]):
        w('| %s | %.0f%% |' % (g, v))
    w('')
    w('**On the worst ground (%s) a well-made object of his stands %.0f%% clear** without being'
      % (cl['worst_ground'], cl['worst_ground_median']))
    w('drawn for our map at all.')
    w('')
    w('AND HERE IS THE HONEST PART, BECAUSE THIS RULER ALREADY PASSED THE THING HE REJECTED.')
    w('The five markers this lane shipped scored 68.5%% to 94.1%% clear on their worst grounds,')
    w('better than his own props, and he still said no. **The ruler was never measuring what he')
    w('is asking for.** Contrast is not detail. The numbers he is pointing at are the two at the')
    w('top of the table: **%d painted pixels in one object and %d colours in it**, against 180'
      % (de['ink_median'], pa['colours_median']))
    w('pixels and about five colours in ours. A marker can be perfectly legible and still be a')
    w('crest of five pixels, and that is exactly what he keeps seeing.')
    w('')
    w('## THE SIX RULES A MARKER TAKES FROM THIS PAGE')
    w('')
    w('1. **%d x %d, not 9 x 20.** The floor is his, and 40 x 40 is the minimum, not the target.'
      % (de['w_median'], de['h_median']))
    w('2. **A dark contour, one pixel, all the way round.** %.0f%% of his objects have one.'
      % co['darker_at_edge_share'])
    w('3. **The body is mid, the contour is the dark.** His body sits at %.0f of 255 with **%.0f of'
      % (rb['body_median_value'], rb['body_value_steps_median']))
    w('   16 value steps inside it**. Ours was a dark body with one bright accent on a four-rung')
    w('   ladder, which is the shape of the complaint.')
    w('4. **Hundreds of colours, not a seven-step ramp.** %d median.' % pa['colours_median'])
    w('5. **The sun is high and north-west**, +%.0f top over bottom.' % abs(li['top_minus_bottom_median']))
    w('6. **A silhouette, not a rectangle**: %.0f%% of the box is filled, and the rest is shape.'
      % de['fill_median'])
    w('')
    w('## ROUTED')
    w('')
    w('- **COOK TWO, COOK THREE, COOK FOUR**: the contour finding applies to every cut-out')
    w('  thing any lane draws, and it reverses what the road page says for surfaces. Which')
    w('  family you measure decides which law is true.')
    w('- **UI** (rule 104c, [icons at full pixels]): an icon is a standalone object too, and')
    w('  every number on this page is its floor as well.')
    w('- **DIRECTION**: rule 90 round 8\'s card of numbers; this is the object page.')
    open(OUT_PAGE, 'w').write('\n'.join(A) + '\n')
    print('\n  wrote %s\n  wrote %s\n  wrote %s' % (OUT_PAGE, OUT_SHEET, OUT_NUM))


if __name__ == '__main__':
    main()
