#!/usr/bin/env python3
"""
THE EDGE THAT DRUMS  (COOK, 9/21/26, [fight floor] round 2)

THE FIGHT VERDICT round 2, item 5, the only item on that list that is art:
  "THE LEFT EDGE STRIP: one crack sprite tiles vertically the whole frame -- a repeat
   the eye catches in two beats (bible R3's stillness wants nothing that drums)."

RULE 12 FIRST, AND THE CAUSE IS EXACT, NOT A FEELING. The fight picks a variant with
`h % n` and spins only road, walk, lot, yard and slab. Counted off the shipped
COMBAT_B64, how many different pictures each column can EVER show:

    road 32   walk 32   lot 16   yard 16   slab 8   house 7   wall 4   median 3   lane 2
    *** kerbL 1   kerbR 1   gutterL 1   gutterR 1 ***

Four kinds have ONE picture and never rotate. The judged frame shows the west kerb
fourteen rows deep, so it is the same sprite fourteen times. That is the drum, and it is
not a distribution bug or a hash bug: THE POOL HAS ONE TILE IN IT.

WHAT THIS MAKES: variants for those four, and nothing else. The verdict lists the light
and the fighter to COMBAT and the chrome and the bar to UI; this lane draws what its own
line says and stops.

REUSE CHECK (REUSE-FIRST): NO NEW PIXEL IS DRAWN. Two constructions, both his:

  THE KERB IS A SIDEWALK WITH A LIP, AND THAT IS MEASURED, NOT ASSUMED. `walk_kerb` is
  byte-identical to `walk_0` on rows 0-37 and differs on rows 38-43 only -- 220 pixels of
  1,936, all in the bottom six rows. So the thing he approved IS "a sidewalk tile, plus
  this lip". Applying that same construction to his OTHER approved sidewalks is the
  identical operation on a sibling, not a redraw: the field comes from `walk_1`, `walk_2`
  and the city's own `side` pool (which sits on the bank's concrete ramp plus the weed
  accents the 7/28 method allows), and the lip rows come from `walk_kerb` untouched.

  THE GUTTER HAS NO SIBLING, SO ITS FIELD IS REARRANGED, NOT REPLACED. `road_gutter`
  differs from every road tile on every row -- it is its own drawing, and its field is
  darker than plain asphalt because it is in the kerb's shadow, which is the whole point
  of the tile. Replacing that field with a plain road would throw the shadow away. So the
  band rows keep his exact pixels and the FIELD is mirrored, which is a permutation and
  invents nothing. Gated on the field being isotropic (measured below): quadrant spread
  3.3 against plain road at 2.8 to 4.0, so there is no light in it to flip.

REFERENCE CHECK (the 9/4 standing law):
  AH-01  THE ANALOG HORROR BIBLE. R3 THE LONG HOLD is what the verdict cites: stillness is
         content, and nothing may drum. Taken: a repeat with a period short enough to read
         in two beats is motion the frame did not ask for. Changed: the period.
         R4 THE LIGHT WAS IN THE ROOM is why the gutter's field is mirrored rather than
         swapped -- the dark band IS the kerb's cast shadow and it stays exactly where he
         put it. R10 GRIME IS BAKED: every pixel here was baked on 7/28 or 9/13.
  TG-04  THE STREET TILE, and TG-03 THE YARD TILE: the references that put the kerb, the
         gutter and the sidewalk in the bank. Taken unchanged; this selects from them.
  CGRD-03 A VEGAS BLOCK FROM THE AIR. Held against the whole column rather than one tile:
         a real kerb run is one continuous casting with cracks at irregular intervals, not
         a stamped unit. That is the structural rule the variant count is serving.
  And rule 17's own comparison, the street frame beside the fight frame: the walked street
  draws its sidewalk from a pool of 36 and the fight drew its kerb from a pool of 1.

    python3 tools/bohemia_the_edge_that_drums_cook_9_21_26.py
"""
import base64, io, json, os, re, statistics, sys
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
CITY = os.path.join(REPO, 'slices/BOHEMIA_CITY_TILES_01.js')
FLOOR = os.path.join(REPO, 'banks/BOHEMIA_THE_FIGHT_FLOOR_9_21_26.txt')
TPX, CEILING = 44, 64
LIP_FROM = 38          # measured: walk_kerb == walk_0 on rows 0..37, differs on 38..43
BAND_TO  = 6           # measured: road_gutter's kerb shadow is rows 0..5
LUM = lambda p: 0.299*p[0] + 0.587*p[1] + 0.114*p[2]

def die(m): sys.exit('REFUSED: ' + m)

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

def img(b64):
    return Image.open(io.BytesIO(base64.b64decode(b64 + '=' * (-len(b64) % 4)))).convert('RGBA')

def b64_of(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True); return base64.b64encode(buf.getvalue()).decode()

def colours(im): return set(p[:3] for p in im.getdata() if p[3] > 8)

def rows_differing(a, b):
    A, B = a.load(), b.load()
    return [y for y in range(TPX) if any(A[x, y] != B[x, y] for x in range(TPX))]

def quad_spread(im, y0, y1):
    px = im.load(); n = (y1 - y0) // 2; q = []
    for oy in (y0, y0 + n):
        for ox in (0, TPX // 2):
            q.append(statistics.fmean(LUM(px[x, y]) for y in range(oy, oy+n)
                                      for x in range(ox, ox + TPX//2)))
    return max(q) - min(q)

def graft(field, feature, rows):
    """feature's pixels on `rows`, field's everywhere else. Nothing is drawn."""
    out = field.copy(); F = feature.load(); O = out.load()
    for y in rows:
        for x in range(TPX):
            O[x, y] = F[x, y]
    return out

def main():
    T, SA, RAMPS = load()
    kerb, plain = img(T['walk_kerb']['b64']), img(T['walk_0']['b64'])
    gut = img(T['road_gutter']['b64'])

    # ---- the measurement that makes the kerb graft legal
    diff = rows_differing(kerb, plain)
    if diff != list(range(LIP_FROM, TPX)):
        die('walk_kerb differs from walk_0 on rows %s, not %s -- it is NOT "a sidewalk '
            'plus a lip" and this construction is not his. Stop.'
            % (diff[:8], list(range(LIP_FROM, TPX))))
    lip_rows = list(range(LIP_FROM, TPX))
    print('walk_kerb IS walk_0 plus a lip on rows %d..%d (%d pixels of %d). The graft is '
          'his own construction.' % (lip_rows[0], lip_rows[-1],
          sum(1 for y in lip_rows for x in range(TPX)
              if kerb.load()[x, y] != plain.load()[x, y]), TPX*TPX))

    # ---- the measurement that makes the gutter mirror legal
    gq = quad_spread(gut, BAND_TO, TPX)
    ref = [quad_spread(img(T[k]['b64']), BAND_TO, TPX) for k in ('road_0', 'road_1', 'road_2')]
    if gq > max(ref) + 3.0:
        die('the gutter field carries a %.1f quadrant spread against plain road at %.1f-%.1f '
            '-- that is a light, and mirroring it would move it.' % (gq, min(ref), max(ref)))
    print('the gutter field is isotropic: quadrant spread %.1f against plain road %.1f-%.1f, '
          'so a mirror moves material and no light.' % (gq, min(ref), max(ref)))

    # ---- KERB: six fields, all his, each wearing his lip
    fields = [('bank walk_0',  plain),
              ('bank walk_1',  img(T['walk_1']['b64'])),
              ('bank walk_2',  img(T['walk_2']['b64']))]
    for n in (0, 7, 14, 21, 28):                 # spread across the city's 36
        if n < len(SA['side']):
            fields.append(('city side[%d]' % n, img(SA['side'][n])))
    kerbs = []
    for prov, f in fields:
        if f.size != (TPX, TPX): die('%s is %s, not %dx%d' % (prov, f.size, TPX, TPX))
        kerbs.append((prov, graft(f, kerb, lip_rows)))

    # ---- GUTTER: his band, his field, four arrangements of the field
    def rearrange(op):
        fld = gut.copy()
        body = gut.crop((0, BAND_TO, TPX, TPX))
        # `if op:` WAS A BUG AND THIS TOOL'S OWN GUARD CAUGHT IT. Image.FLIP_LEFT_RIGHT
        # is the integer 0, so a truthiness test silently skipped the mirror and handed
        # back the tile unchanged. The duplicate check below refused it, which is the
        # only reason it is not in the bank. Compare to None, never to truth.
        if op is not None: body = body.transpose(op)
        fld.paste(body, (0, BAND_TO))
        return graft(fld, gut, list(range(BAND_TO)))     # the band is always his, unmoved
    guts = [('as drawn', rearrange(None)),
            ('field mirrored left-right', rearrange(Image.FLIP_LEFT_RIGHT)),
            ('field mirrored top-bottom', rearrange(Image.FLIP_TOP_BOTTOM)),
            ('field turned half round',   rearrange(Image.ROTATE_180))]

    # ---- every tile must still be a ground tile
    made = {'kerb': kerbs, 'gutter': guts}
    for kind, rows in made.items():
        seen = set()
        for prov, im in rows:
            op = sum(1 for p in im.getdata() if p[3] > 250) / float(TPX*TPX)
            if op < 0.9999:
                die('%s %s is %.1f%% opaque -- a ground tile with a transparent pixel is a '
                    'HOLE IN THE FLOOR.' % (kind, prov, 100*op))
            c = len(colours(im))
            if c > CEILING:
                die('%s %s carries %d colours against the ceiling of %d' % (kind, prov, c, CEILING))
            h = im.tobytes()
            if h in seen:
                die('%s %s came out identical to another variant -- that adds no picture '
                    'and this whole cook exists to add pictures' % (kind, prov))
            seen.add(h)
        print('%-7s %d variants, all opaque, all under the ceiling, all different from '
              'each other' % (kind, len(rows)))

    # ---- turn them for a north-south street, the way round 1 established
    out = {}
    for name, op in (('kerbL', Image.ROTATE_90), ('kerbR', Image.ROTATE_270)):
        out[name] = [(p, im.transpose(op)) for p, im in kerbs]
    for name, op in (('gutterL', Image.ROTATE_90), ('gutterR', Image.ROTATE_270)):
        out[name] = [(p, im.transpose(op)) for p, im in guts]

    # ---- THE THING THE VERDICT ACTUALLY ASKED: does the column still drum?
    def imul(a, b):
        r = (a*b) & 0xFFFFFFFF
        return r - 0x100000000 if r >= 0x80000000 else r
    def longest_run(n, wx, rows=14):
        if n <= 0: return rows
        seq = [((imul(wx, 73856093) ^ imul(wy, 19349663)) & 0xFFFFFFFF) % n
               for wy in range(-rows//2, rows//2)]
        best = run = 1
        for i in range(1, len(seq)):
            run = run + 1 if seq[i] == seq[i-1] else 1
            best = max(best, run)
        return best, len(set(seq))
    print()
    print('THE COLUMN THE VERDICT POINTED AT, 14 rows deep:')
    print('%-9s %-22s %s' % ('kind', 'before', 'after'))
    for name, wx in (('kerbL', -4), ('gutterL', -3), ('gutterR', 7), ('kerbR', 8)):
        b_run, b_dist = longest_run(1, wx)
        a_run, a_dist = longest_run(len(out[name]), wx)
        print('%-9s %-22s %s' % (name,
              '1 picture, run of %d' % b_run,
              '%d pictures, longest run of %d, %d different in frame'
              % (len(out[name]), a_run, a_dist)))

    # ---- write it into the floor bank this lane already ships
    doc = json.load(open(FLOOR))
    for name, rows in out.items():
        doc['tiles']['44'][name] = [b64_of(im) for _, im in rows]
        doc['tiles']['88'][name] = [b64_of(im.resize((TPX*2, TPX*2), Image.NEAREST))
                                    for _, im in rows]
        doc['counts_held'][name] = len(rows)
        doc['provenance'][name] = [
            ('%s: %s, wearing walk_kerb\'s own lip rows %d-%d' % (name, p, LIP_FROM, TPX-1))
            if 'kerb' in name else
            ('%s: road_gutter, band rows 0-%d exactly as drawn, %s' % (name, BAND_TO-1, p))
            for p, _ in rows]
    doc['counts_note'] = ('round 1 held every count so the swap changed nothing. ROUND 2 '
                          'DELIBERATELY RAISES FOUR OF THEM: kerbL, kerbR, gutterL and '
                          'gutterR had ONE picture each and tiled identically down the '
                          'whole frame, which is THE FIGHT VERDICT round 2 item 5. Raising '
                          'n is the fix, not a side effect.')
    doc['round_2'] = {
        'why': 'THE FIGHT VERDICT round 2 item 5: "one crack sprite tiles vertically the '
               'whole frame -- a repeat the eye catches in two beats".',
        'cause': 'kerbL, kerbR, gutterL and gutterR each had exactly one tile in the pool '
                 'and none of them is in ST_SPIN, so a column could only ever show one '
                 'picture. Not a hash bug, not a distribution bug: an empty pool.',
        'kerb': 'walk_kerb is byte-identical to walk_0 on rows 0-37 and differs only on '
                'rows 38-43, so "a sidewalk plus this lip" is the construction he approved. '
                'Six fields (bank walk_0/1/2 and four of the city\'s 36 side tiles) each '
                'wear his lip rows unchanged.',
        'gutter': 'road_gutter is its own drawing and its field is darker because it sits '
                  'in the kerb\'s shadow, so the field is rearranged and never replaced: '
                  'his band rows 0-5 stay exactly where he put them and the field is '
                  'mirrored, gated on it being isotropic.',
        'longest_run_before': 14,
        'longest_run_after': {n: longest_run(len(out[n]), wx)[0]
                              for n, wx in (('kerbL', -4), ('gutterL', -3),
                                            ('gutterR', 7), ('kerbR', 8))},
    }
    with open(FLOOR, 'w') as f:
        json.dump(doc, f)
    back = json.load(open(FLOOR))
    for size in ('44', '88'):
        for name in out:
            if len(back['tiles'][size][name]) != len(out[name]):
                die('read-back: %s px %s holds %d, cooked %d'
                    % (size, name, len(back['tiles'][size][name]), len(out[name])))
    n = sum(len(v) for v in back['tiles']['44'].values())
    print()
    print('wrote %s  (%.0f KB, %d images at 44 and %d at 88)'
          % (os.path.relpath(FLOOR, REPO), os.path.getsize(FLOOR)/1024, n, n))

if __name__ == '__main__':
    main()
