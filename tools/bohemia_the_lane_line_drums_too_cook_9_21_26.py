#!/usr/bin/env python3
"""
THE LANE LINE DRUMS TOO  (COOK, 9/21/26, [fight floor] round 3)

THE FIGHT VERDICT round 3 still lists, unchanged: "THE LEFT-EDGE TILED SPRITE STRIP -- a
drum against R3's stillness." Round 2 took the kerbs from 1 picture to 8 and the gutters
from 1 to 4, and I wrote down in the same breath what I had NOT finished:

    "NOT DONE: lane (2 pictures) and median (3) carry a marking that must stay continuous
     down the column, so their variants are a different problem."

A column of 14 cells drawn from 2 pictures is still a drum. This finishes it, and it
finishes it on the same evidence: the verdict's item 5 is one defect with four columns in
it and I only fixed two.

RULE 12, AND THE FIRST CONSTRUCTION I TRIED WAS WRONG. The kerb worked because walk_kerb
is byte-identical to walk_0 outside its lip, so "a plain tile plus a feature" was provable.
I checked whether a marking tile is the same shape and IT IS NOT: lane_h, median_h and
cross_ew differ from the CLOSEST of the 18 street tiles on 74-85% of pixels. They are their
own drawings with their own asphalt underneath, so the row graft does not transfer.

AND THE SECOND CONSTRUCTION I TRIED WAS ALSO WRONG, AND THE PICTURE CAUGHT IT, NOT A
NUMBER. Measured against the seven colours the street family uses, a marking tile is 98%,
93% and 88% family colours plus ONE colour that is not -- so I lifted "every pixel that is
not a family colour" as the paint. It scored perfectly: 2 pictures to 8, paint never moved,
every guard green. Then I rendered the column and THE LANE LINE WAS GONE. The line is only
38 pixels of that off-family colour; the BODY of it is painted in the family's own light
tones, so "not in the family" caught the highlights and erased the stripe. A mask built
from a colour test cannot find a line drawn in the material's own colours.

WHAT IS SEPARABLE IS THE BAND, and that is geometry, which does not lie. Row brightness
across every marking tile, against a plain street tile at 53:

    lane_h[0]    rows 18-25 sit 8+ above the tile's own median        (the stripe)
    lane_h[1]    rows 17-24 the same
    median_h[0]  rows 17-20 and 26-28                                 (the dashes)
    median_h[1]  rows 18-21     median_h[2] rows 18-21 and 26-27

Every marking in every variant lives between rows 17 and 28. So the mask is that band, all
of it, exactly as the kerb's lip was rows 38-43: his twelve rows unchanged, a different
approved asphalt field above and below. The seam is asphalt meeting asphalt on the same
seven-colour ramp.

REUSE CHECK (REUSE-FIRST): NO NEW PIXEL IS DRAWN. The paint comes from his own marking
tiles unchanged; the field comes from the 18 street tiles the city already ships. A graft
is a copy, not a drawing.

REFERENCE CHECK (the 9/4 standing law):
  AH-01  THE ANALOG HORROR BIBLE. R3 THE LONG HOLD is the rule the verdict cites and the
         one this serves: a repeat short enough to read in two beats is motion the frame
         never asked for. R4 THE LIGHT WAS IN THE ROOM: the field tiles are day-neutral
         asphalt and the paint carries no light of its own, so nothing here lights anything.
         R10 GRIME IS BAKED: every pixel was baked on 9/13 and is only moved here.
  TG-04  THE STREET TILE: the family and its value band. Taken unchanged; the fields ARE
         that family, so a grafted tile cannot leave it.
  CGRD-03 A VEGAS BLOCK FROM THE AIR: a painted line on a real road runs continuously while
         the asphalt under it changes every few feet with patching and wear. That is the
         structural rule this serves, and it is why the PAINT is held constant per variant
         and only the ROAD varies.

AND THE PAINT MASK IS NOT ALLOWED TO MOVE. Each of his marking variants keeps its own mask
exactly; the fields rotate underneath. If a graft ever changed a paint pixel this refuses.

    python3 tools/bohemia_the_lane_line_drums_too_cook_9_21_26.py
"""
import base64, io, json, os, re, sys
import numpy as np
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(REPO, 'slices/BOHEMIA_CITY_TILES_01.js')
FLOOR = os.path.join(REPO, 'banks/BOHEMIA_THE_FIGHT_FLOOR_9_21_26.txt')
TPX, CEILING = 44, 64

def die(m): sys.exit('REFUSED: ' + m)

def img(b64):
    return Image.open(io.BytesIO(base64.b64decode(b64 + '=' * (-len(b64) % 4)))).convert('RGBA')

def b64_of(im):
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True); return base64.b64encode(b.getvalue()).decode()

def load_city():
    t = open(CITY, encoding='utf-8', errors='replace').read()
    m = re.search(r'SA_TILES\s*=\s*\{', t)
    if not m: die('SA_TILES is not where this tool expects it')
    i = t.index('{', m.start()); d = 0
    for j in range(i, len(t)):
        if t[j] == '{': d += 1
        elif t[j] == '}':
            d -= 1
            if d == 0: return json.loads(t[i:j+1])
    die('unbalanced braces reading SA_TILES')

def family_colours(tiles):
    s = set()
    for b in tiles:
        s |= set(map(tuple, np.asarray(img(b).convert('RGB')).reshape(-1, 3)))
    return s

BAND = (17, 29)          # measured: every marking in every variant lives in these rows

def paint_mask(tile_b64, family):
    """THE BAND THE MARKING LIVES IN, not a colour test.

    The colour test was the first thing I tried and it is in the docstring above as a
    warning: a line painted in the material's own light tones is invisible to it. Row
    brightness finds the band in every variant and cannot be fooled by a colour that
    happens to also be asphalt."""
    a = np.asarray(img(tile_b64).convert('RGB'))
    h, w, _ = a.shape
    lum = 0.299*a[..., 0].astype(float) + 0.587*a[..., 1] + 0.114*a[..., 2]
    rows = lum.mean(axis=1)
    med = float(np.median(rows))
    hot = [y for y in range(h) if abs(rows[y] - med) > 8 and BAND[0] <= y < BAND[1]]
    if not hot:
        die('no row inside %s stands 8 units off this tile\'s median -- the marking is not '
            'where every other variant puts it, so do not graft it' % (BAND,))
    mask = np.zeros((h, w), dtype=bool)
    mask[BAND[0]:BAND[1], :] = True
    return mask, a

def graft(field_b64, paint_src, mask):
    f = np.asarray(img(field_b64).convert('RGBA')).copy()
    f[:, :, :3][mask] = paint_src[mask]
    return Image.fromarray(f, 'RGBA')

def main():
    SA = load_city()
    fam = family_colours(SA['street'])
    print('the street family uses %d colours; a marking tile is that family plus paint.' % len(fam))

    # the fight's street runs north-south, so the _h pieces turned are the ones round 1 chose
    PLAN = {'lane':   ('lane_h',   4),      # 2 of his masks x 4 fields = 8
            'median': ('median_h', 3)}      # 3 of his masks x 3 fields = 9
    FIELDS = list(range(0, len(SA['street']), 2))

    out, report = {}, []
    for kind, (src, per) in PLAN.items():
        made, provs = [], []
        for mi, mb in enumerate(SA[src]):
            mask, painted = paint_mask(mb, fam)
            n = int(mask.sum())
            if n != (BAND[1] - BAND[0]) * TPX:
                die('%s[%d] band came out %d px, expected %d' % (src, mi, n,
                    (BAND[1]-BAND[0]) * TPX))
            for k in range(per):
                fi = FIELDS[(mi * per + k) % len(FIELDS)]
                g = graft(SA['street'][fi], painted, mask)
                # THE PAINT MAY NOT MOVE
                ga = np.asarray(g.convert('RGB'))
                if not (ga[mask] == painted[mask]).all():
                    die('%s[%d] on street[%d]: a paint pixel changed in the graft' % (src, mi, fi))
                made.append(g)
                provs.append('city %s[%d] marking band rows %d-%d (%.0f%% of the tile) on '
                             'city street[%d]' % (src, mi, BAND[0], BAND[1]-1,
                                                  100.0*n/(TPX*TPX), fi))
        # every variant must be a different picture, opaque, and under the ceiling
        seen = set()
        for p, im in zip(provs, made):
            if im.size != (TPX, TPX): die('%s is %s' % (p, im.size))
            op = sum(1 for q in im.getdata() if q[3] > 250) / float(TPX*TPX)
            if op < 0.9999: die('%s is %.1f%% opaque -- a hole in the floor' % (p, 100*op))
            c = len(set(map(tuple, np.asarray(im.convert('RGB')).reshape(-1, 3))))
            if c > CEILING: die('%s carries %d colours against the ceiling of %d' % (p, c, CEILING))
            h = im.tobytes()
            if h in seen:
                die('%s came out identical to another variant -- that adds no picture and '
                    'this cook exists to add pictures' % p)
            seen.add(h)
        out[kind] = (made, provs)
        report.append((kind, src, len(SA[src]), len(made)))

    # the fight's street runs north-south: turn them, the way round 1 established
    turned = {k: [im.transpose(Image.ROTATE_90) for im in v[0]] for k, v in out.items()}

    def imul(a, b):
        r = (a*b) & 0xFFFFFFFF
        return r - 0x100000000 if r >= 0x80000000 else r
    def run(n, wx, rows=14):
        seq = [((imul(wx, 73856093) ^ imul(wy, 19349663)) & 0xFFFFFFFF) % max(n, 1)
               for wy in range(-rows//2, rows//2)]
        best = cur = 1
        for i in range(1, len(seq)):
            cur = cur + 1 if seq[i] == seq[i-1] else 1
            best = max(best, cur)
        return best, len(set(seq))

    doc = json.load(open(FLOOR))
    print()
    print('%-8s %-26s %s' % ('kind', 'his masks x fields', 'the column, 14 rows deep'))
    for kind, src, masks, n in report:
        wx = -2 if kind == 'lane' else 2
        b_run, b_dist = run(len(doc['tiles']['44'][kind]), wx)
        a_run, a_dist = run(n, wx)
        print('%-8s %d of his %-6s x %d fields = %-3d  before: %d pictures, run %d   '
              'after: %d pictures, run %d, %d in frame'
              % (kind, masks, src, n // masks, n,
                 len(doc['tiles']['44'][kind]), b_run, n, a_run, a_dist))

    for kind in turned:
        doc['tiles']['44'][kind] = [b64_of(im) for im in turned[kind]]
        doc['tiles']['88'][kind] = [b64_of(im.resize((TPX*2, TPX*2), Image.NEAREST))
                                    for im in turned[kind]]
        doc['counts_held'][kind] = len(turned[kind])
        doc['provenance'][kind] = [p + ', a quarter turn for the north-south street'
                                   for p in out[kind][1]]
    doc['round_3'] = {
        'why': "THE FIGHT VERDICT round 3 still lists the edge drum. Round 2 fixed the kerbs "
               "and gutters and left lane (2 pictures) and median (3), which is still a drum.",
        'construction': "the marking lives in rows 17-28 of every variant (row brightness, "
                        "8+ off the tile's own median). That band is lifted unchanged and laid "
                        "on a different approved asphalt field, exactly as the kerb's lip was.",
        'the_colour_mask_was_wrong': "the first mask was 'every pixel not in the street "
                        "family'. It scored perfectly and ERASED THE LANE LINE: only 38 px of "
                        "the stripe are off-family and the body of it is painted in the "
                        "material's own light tones. The picture caught it, not a number.",
        'not_the_kerb_trick': "a marking tile is NOT a street tile plus a band -- it differs "
                              "from the closest of the 18 street tiles on 74-85% of pixels. "
                              "The row graft that worked for the kerb does not transfer.",
        'paint_never_moves': True,
    }
    with open(FLOOR, 'w') as f: json.dump(doc, f)
    back = json.load(open(FLOOR))
    for size in ('44', '88'):
        for kind in turned:
            if len(back['tiles'][size][kind]) != len(turned[kind]):
                die('read-back: %s px %s holds %d, cooked %d'
                    % (size, kind, len(back['tiles'][size][kind]), len(turned[kind])))
    n = sum(len(v) for v in back['tiles']['44'].values())
    print()
    print('wrote %s  (%.0f KB, %d images at 44 and %d at 88)'
          % (os.path.relpath(FLOOR, REPO), os.path.getsize(FLOOR)/1024, n, n))

if __name__ == '__main__':
    main()
