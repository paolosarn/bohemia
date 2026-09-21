#!/usr/bin/env python3
"""
THE FIGHT STANDS ON HIS STREET  (COOK, 9/21/26, [fight floor])

WHY THIS COOK EXISTS, IN ONE LINE FROM THE BOARD:
  THE FIGHT VERDICT round 1, item 1, 70% of the frame: "blurred cold-grey slabs at a
  soft non-integer scale - the warm brick-and-tan street he was standing on is gone...
  Fix: the street's own approved ground families at house scale, crisp, warm, drawn 1:1."
  Rule 22 (Paolo 9/21): a making lane COOKS EVERY ROUND and registers it in VOTE.
  Rule 18: the hold is on the play surface, not on the making, so this writes a BANK and
  a VOTE candidate and NOT ONE BYTE of the alpha or the demo.

WHAT WAS ALREADY MEASURED, so this cook is not a guess (COOK 60a52ac9, 9/20):
  the fight is a separate document with its own frozen bank, and its `road` and `walk`
  are the city's `street` and `side` AS THEY WERE BEFORE THE 9/13 RECOOK, byte for byte,
  734-1,478 colours against 7 today. Nothing about the city can reach it. So the fix is
  not to draw new tiles, it is to BUILD THE FIGHT'S BANK OUT OF ART HE HAS APPROVED.

REUSE CHECK (REUSE-FIRST): THIS COOK DRAWS NO NEW PIXEL BY HAND. Every tile is either
  the city's own recooked warm street (slices/BOHEMIA_CITY_TILES_01.js, SA_TILES, the
  9/13 recook 9e026864) or one of the 42 tiles Paolo approved on 7/28 verbatim -- "I
  checked it to do the other 41 mark it approved" -- in
  banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt. Forty of those forty-two are
  still drawn zero times anywhere in the game; six of them get drawn by this.

REFERENCE CHECK (the 9/4 standing law: compare every cook to real work of its kind before
  calling it done; document what it was compared to, which structural rules were taken, what
  changed). NO NEW ART IS DRAWN HERE, so there is no shot in the dark to defend -- but the
  ORIENTATION decisions are real craft decisions and these are the rulers they were held
  against:
    AH-01  THE ANALOG HORROR BIBLE, ours, the ten rules a pixel obeys. Taken: R4 THE LIGHT
           WAS IN THE ROOM (every lumen has a source you can point at; no mood gradient) and
           R10 GRIME IS BAKED, NEVER SHADED, whose reading fails the fight and names the
           cause as scale. Changed: the gutter's cast shadow is put back on the side the
           kerb casting it is actually on, and both legal draw sizes ship so nothing has to
           be resampled.
    TG-04  THE STREET TILE. Taken: the road's structure as the city already ships it; this
           cook moves that structure into the fight rather than authoring a second one.
    TG-01  THE LOT'S REAL PROPORTIONS, and TG-03 THE YARD TILE, which are the references
           that put yard, dirt, wall and concrete in the 7/28 bank in the first place. Taken
           unchanged: this cook selects from that bank, it does not re-derive it.
    TG-02  THE HOUSE TILE FROM 45 DEGREES -- the reason the roof is the house's ground read
           at combat range. Taken: the roof pieces stay the house band. Changed: the two
           corner pieces come OUT, because a corner drawn half as sky is a hole in a floor.
    CGRD-03 A VEGAS BLOCK FROM THE AIR. Held against the whole rendered board rather than a
           tile: sidewalk, kerb, gutter, lane, centre, and then lots, in that order out from
           the road, which is what the turn decisions were checked against.
  And the comparison rule 17 asks for by name: THE STREET FRAME BESIDE THE FIGHT FRAME.
  That is the only authority on whether the fight is in the same world as the walk, and it
  is what the VOTE candidate shows.

THE ONE REAL OPERATION, AND WHY IT IS ALLOWED. The fight's street runs NORTH-SOUTH and
  `walk_kerb` and `road_gutter` were drawn for an EAST-WEST one: the kerb lip sits on the
  bottom edge and the gutter's kerb shadow sits on the top edge. They have to turn a
  quarter. The bank's own method line forbids redrawing ("Paolo DREW these. His drawing
  is approved content and I do not get to redraw it"), so the question is whether a
  rotation breaks the 45-degree light law, and that is MEASURED here rather than assumed.

  THE FIRST TEST I WROTE WAS WRONG AND ITS OWN GUARD CAUGHT IT. Raw corner-to-corner
  brightness put walk_kerb at 48.1 and refused the turn. That 48.1 is not light, it is
  the big dark crack sitting in one quadrant: a CRACK, a PAINTED LINE and a KERB LIP all
  live in the darkest and brightest steps of the family ramp, and they are structure.
  Drop those two steps and what is left is the MATERIAL, which is where a 45-degree sun
  would have to be. Then compare each tile to its own PLAIN FAMILY SIBLING, because the
  sibling is the same material with no feature in it:

      walk_kerb   material 18.3  against plain walk_0 18.8  -> no light of its own
      road_gutter material  6.5  against plain road_0   5.7  -> no light of its own
      (the featureless members of every family sit at 2.8 to 4.3: nothing here is lit)

  What IS directional is one axis only: walk_kerb's rows spread 96 against 39 for its
  columns (the bright lip on the bottom row, 170 against 110), and road_gutter's rows
  spread 28 against 9 (the dark kerb shadow on the top rows, 43 against 68). So a quarter
  turn moves a BAND and touches no light, and it puts each band on the side the kerb
  actually is. Nothing is redrawn, nothing is re-lit, and no pixel changes colour: a
  rotation is a permutation.

AND THE MARKINGS HAD TO TURN TOO, which a contact sheet caught and no number would
  have. The city's lane and median tiles are drawn for an EAST-WEST road; stacked down
  the fight's north-south street they make ladder rungs ACROSS it instead of a line ALONG
  it. The city rotates them at draw time and the bank duplicated them instead. Turned,
  `lane_h` is one unbroken line down the middle (a lane divider) and `lane_v` is a double
  line (a centre marking), so the divider is lane_h and the centre is the orange median.
  That is the ninth time this lane has taken a clean reading off the wrong oracle, and
  the ninth time the fix was to render it and look.

COUNTS ARE HELD EXACTLY. Every kind ships the same number of variants the fight already
  has, so its own `h % n` picks the same index for the same cell and NOTHING MOVES. This
  is an art payload swap and only an art payload swap -- the same discipline as the yard
  swap on 9/13.

THE ANALOG HORROR BIBLE (rule 20, reference AH-01, records/BOHEMIA_ANALOG_HORROR_BIBLE...):
  R4 THE LIGHT WAS IN THE ROOM -- passes by construction: the measurement above shows no
    baked mood gradient anywhere in this material, and this cook adds none.
  R10 GRIME IS BAKED, NEVER SHADED -- the bible's own reading fails the fight on R10 and
    names the cause: "blurred floor is scale, not grime". This ships each kind at 44 px
    (native, 1:1) AND at 88 px (a clean 2x, nearest neighbour, every pixel a 2x2 block),
    so a whole-number draw is AVAILABLE. Which one the board uses is COMBAT's `ring`, not
    art: 44 -> 67 is scale 1.523 and doubles 23 of 44 rows, which is the blur.
  R1/R3/R5/R7 are placement, motion, type and occupancy: not a ground tile's to pass.

TWO THINGS THE PICTURE CAUGHT THAT NO NUMBER WOULD HAVE, and both are now guards in
  this file so the picture never has to catch them again:
    - the city's lane and median markings are drawn for an EAST-WEST road (above), and
    - roof_hipTL and roof_hipTR are half sky (48.9% and 51.1% opaque). On a roof they are
      corners; laid flat as ground they punch BLACK TRIANGLES through the floor. Every
      tile that goes on the ground is now checked for full opacity before it is written.

WHAT THIS DOES NOT DO, ON PURPOSE. It does not touch the fight's lot layout (COMBAT's
  lotSubKind, the wy%2 roof/yard alternation Paolo called a checkerboard -- my own code
  from 9/6, and THE FIGHT VERDICT has not listed it). It does not pick the cell size. It
  does not write to the alpha or the demo. STOP PRODUCING: draw what the verdict lists.

    python3 tools/bohemia_the_fight_stands_on_his_street_cook_9_21_26.py
"""
import base64, io, json, os, re, statistics, sys
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANK = os.path.join(REPO, 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt')
CITY = os.path.join(REPO, 'slices/BOHEMIA_CITY_TILES_01.js')
OUT  = os.path.join(REPO, 'banks/BOHEMIA_THE_FIGHT_FLOOR_9_21_26.txt')
CEILING = 64          # gates/pixel_craft_gate.py: colours in one tile
TPX = 44              # the bank's cell_px, and the city's

def die(m):
    sys.exit('REFUSED: ' + m)

# ---------------------------------------------------------------- the two sources
def load_bank():
    b = json.load(open(BANK))
    if b.get('cell_px') != TPX:
        die('the approved bank is %s px, not %d' % (b.get('cell_px'), TPX))
    return {e['id']: e for e in b['tiles']}, b['method']['one_palette_per_family']

def load_city():
    t = open(CITY, encoding='utf-8', errors='replace').read()
    m = re.search(r'SA_TILES\s*=\s*\{', t)
    if not m:
        die('SA_TILES is not in %s -- find where the city keeps its street before cooking'
            % os.path.basename(CITY))
    i = t.index('{', m.start()); d = 0
    for j in range(i, len(t)):
        if t[j] == '{': d += 1
        elif t[j] == '}':
            d -= 1
            if d == 0:
                sa = json.loads(t[i:j+1]); break
    else:
        die('unbalanced braces reading SA_TILES')
    for k in ('street', 'side', 'lane_v', 'median_v'):
        if k not in sa:
            die('the city has no "%s" -- THE WRONG TABLE, and this lane has been caught '
                'by that eight times. Look before cooking.' % k)
    return sa

def img(b64):
    return Image.open(io.BytesIO(base64.b64decode(b64 + '=' * (-len(b64) % 4)))).convert('RGBA')

def b64_of(im):
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode()

def colours(im):
    return set(p[:3] for p in im.getdata() if p[3] > 8)

# ------------------------------------------------- the measurement that allows a turn
LUM = lambda p: 0.299*p[0] + 0.587*p[1] + 0.114*p[2]

def material_spread(im, ramp):
    """Corner-to-corner brightness of the MATERIAL only.

    A crack, a painted line and a kerb lip all live in the darkest and brightest steps
    of the family ramp; they are structure, not light. Drop those two steps and what is
    left is the material, which is the only place a 45-degree sun could be hiding. The
    first version of this measured every pixel, read one crack as a 48-unit sun, and
    refused a turn that is fine -- so the number it returns now is the one that means
    something, and it is only read against a plain sibling (see the guard)."""
    lums = sorted(LUM(c) for c in ramp)
    lo, hi = lums[1], lums[-2]
    px = im.load(); n = im.size[0] // 2
    q = []
    for oy in (0, n):
        for ox in (0, n):
            v = [LUM(px[x, y]) for y in range(oy, oy+n) for x in range(ox, ox+n)
                 if px[x, y][3] > 8 and lo <= LUM(px[x, y]) <= hi]
            if not v:
                return None
            q.append(statistics.fmean(v))
    return max(q) - min(q)

def hexramp(cols):
    return [tuple(int(c.lstrip('#')[i:i+2], 16) for i in (0, 2, 4)) for c in cols]

def axis_spread(im):
    px = im.load(); w, h = im.size
    lum = lambda p: 0.299*p[0] + 0.587*p[1] + 0.114*p[2]
    rows = [statistics.fmean(lum(px[x, y]) for x in range(w)) for y in range(h)]
    cols = [statistics.fmean(lum(px[x, y]) for y in range(h)) for x in range(w)]
    return max(rows) - min(rows), max(cols) - min(cols)

def turn(im, where):
    """A quarter turn, named by where the tile's feature edge has to END UP.
       CCW sends bottom->right and top->left; CW sends bottom->left and top->right."""
    return im.transpose(Image.ROTATE_90 if where == 'ccw' else Image.ROTATE_270)

# --------------------------------------------------------------------------- the map
def build():
    B, RAMPS = load_bank()
    SA = load_city()

    plan = {
        # kind      n  where each variant comes from
        'road':    [('city', 'street', i) for i in range(8)],
        'walk':    [('city', 'side',   i) for i in range(8)],
        # THE NINTH WRONG-ORACLE CATCH, caught by rendering a strip and LOOKING before
        # shipping: the city's markings are drawn for an EAST-WEST road and the fight's
        # street runs NORTH-SOUTH, so `lane_v` stacked down a column gives ladder rungs
        # across the road instead of a line along it. The city rotates these at draw time
        # (BOHEMIA_CITY_WORLD.html: "the _h/_v pairs in SA_TILES ARE... rot90 for an EW
        # road, and whoever built SA_TILES duplicated them instead of rotating"). Turned,
        # `lane_h` gives ONE clean unbroken line down the middle -- a lane divider -- and
        # `lane_v` gives a double line, which is a centre marking, not a divider. So the
        # divider is lane_h turned and the centre is the orange median turned.
        'lane':    [('cityturn', 'lane_h',   i) for i in range(2)],
        'median':  [('cityturn', 'median_h', i) for i in range(3)],
        'kerbL':   [('turn', 'walk_kerb',  'ccw')],   # sidewalk left of the road: lip faces right
        'kerbR':   [('turn', 'walk_kerb',  'cw')],    # sidewalk right of it: lip faces left
        'gutterL': [('turn', 'road_gutter','ccw')],   # kerb is to its left, so is its shadow
        'gutterR': [('turn', 'road_gutter','cw')],    # kerb is to its right
        # THE TENTH CATCH, and the render found it, not a number: roof_hipTL and roof_hipTR
        # are CORNER pieces that are only half drawn (48.9% and 51.1% opaque -- the slope
        # cuts in and the rest is sky). On a roof they are corners. Laid flat as ground
        # with nothing behind them they are A HOLE IN THE FLOOR, and the board rendered
        # two rows of black triangles. The opaque roof pieces take their place.
        'house':   [('bank', k, 0) for k in ('roof_slope','roof_ridge','roof_eave',
                                             'roof_hipBL','roof_hipBR','roof_deck','roof_parapet')],
        'yard':    [('bank', k, 0) for k in ('yard_0','yard_1','yard_2','dirt')],
        'wall':    [('bank', k, 0) for k in ('wall_0','wall_1','wall_2','wall_base')],
        'lot':     [('bank', k, 0) for k in ('dirt','yard_0','yard_1','yard_2')],
        'slab':    [('bank', k, 0) for k in ('concrete_0','concrete_1')],
    }
    # every turned tile is judged against THE SAME MATERIAL WITH NO FEATURE IN IT
    SIBLING = {'walk_kerb': 'walk_0', 'road_gutter': 'road_0'}

    # the counts the fight has today, from COOK's 9/20 measurement of COMBAT_B64
    HELD = dict(road=8, walk=8, lane=2, median=3, kerbL=1, kerbR=1, gutterL=1, gutterR=1,
                house=7, yard=4, wall=4, lot=4, slab=2)

    out, rows = {}, []
    for kind, srcs in plan.items():
        if len(srcs) != HELD[kind]:
            die('%s ships %d variants and the fight picks from %d -- the counts must be '
                'identical or h%%n lands on a different tile and this stops being a swap'
                % (kind, len(srcs), HELD[kind]))
        out[kind] = []
        for how, name, arg in srcs:
            if how == 'city':
                im = img(SA[name][arg]); prov = 'city %s[%d]' % (name, arg)
            elif how == 'cityturn':
                base = img(SA[name][arg])
                ramp = hexramp(RAMPS['asphalt'])
                ss = material_spread(base, ramp)
                sibling = material_spread(img(SA['street'][0]), ramp)
                if ss is None or sibling is None:
                    die('%s[%d] or plain street[0] has no material left after dropping the '
                        'ramp ends -- this test cannot speak, so do not turn it' % (name, arg))
                if ss > sibling + 6.0:
                    die('city %s[%d] is %.1f against plain street[0] at %.1f -- that is a '
                        'light of its own and a quarter turn would move it' % (name, arg, ss, sibling))
                im = turn(base, 'ccw')
                prov = ('city %s[%d], a quarter turn (the markings are drawn for an east-west '
                        'road and this street runs north-south; material %.1f against plain '
                        'street at %.1f, so no light of its own)' % (name, arg, ss, sibling))
            elif how == 'bank':
                im = img(B[name]['b64']); prov = 'approved 7/28 %s' % name
            else:
                base = img(B[name]['b64'])
                fam = B[name]['family']
                ss = material_spread(base, hexramp(RAMPS[fam]))
                sib = SIBLING[name]
                sibling = material_spread(img(B[sib]['b64']), hexramp(RAMPS[B[sib]['family']]))
                if ss is None or sibling is None:
                    die('%s or its plain sibling %s has no material left after dropping the '
                        'ramp ends -- this test cannot speak, so do not turn it' % (name, sib))
                # THE SUN TEST IS RELATIVE, NOT ABSOLUTE: this tile against the same
                # material with no feature in it. A featureless sidewalk cannot be lit by
                # a sun the kerb tile does not also have.
                if ss > sibling + 6.0:
                    die('%s is %.1f against its own plain sibling %s at %.1f -- that is a '
                        'light of its own, a quarter turn WOULD move it, and the bank '
                        'forbids redrawing his art. Do not turn it.' % (name, ss, sib, sibling))
                rs, cs = axis_spread(base)
                if rs <= cs:
                    die('%s is not row-directional (rows %.1f, cols %.1f) -- the feature '
                        'this turn is supposed to move is not on the axis assumed'
                        % (name, rs, cs))
                im = turn(base, arg)
                prov = ('approved 7/28 %s, a quarter turn %s (material %.1f against plain %s '
                        'at %.1f, so no light of its own; rows %.1f against cols %.1f, so a '
                        'band moves and no light does)' % (name, arg, ss, sib, sibling, rs, cs))
            if im.size != (TPX, TPX):
                die('%s is %dx%d, not %dx%d' % (prov, im.size[0], im.size[1], TPX, TPX))
            # A GROUND TILE IS OPAQUE OR IT IS A HOLE. Found by rendering the board:
            # two of the approved roof corners are half sky, and laid flat they punch
            # black triangles through the floor. There is no number that says this; the
            # picture says it, and now this line says it before the picture has to.
            op = sum(1 for p in im.getdata() if p[3] > 250) / float(im.size[0] * im.size[1])
            if op < 0.9999:
                die('%s is %.1f%% opaque -- a ground tile with a transparent pixel is a '
                    'HOLE IN THE FLOOR and renders black. Not a ground tile.'
                    % (prov, 100 * op))
            c = len(colours(im))
            if c > CEILING:
                die('%s carries %d colours against the craft ceiling of %d' % (prov, c, CEILING))
            out[kind].append((im, prov, c))
            rows.append((kind, prov, c))
    return out, rows, RAMPS

def main():
    out, rows, RAMPS = build()

    print('THE FIGHT FLOOR, BUILT OUT OF ART HE HAS ALREADY APPROVED')
    print('%-9s %-3s %-6s %s' % ('kind', 'n', 'worst', 'where every variant came from'))
    for kind in out:
        v = out[kind]
        print('%-9s %-3d %-6d %s' % (kind, len(v), max(x[2] for x in v), v[0][1]))
        for extra in v[1:]:
            if extra[1].split('[')[0] != v[0][1].split('[')[0]:
                print('%-9s %-3s %-6s %s' % ('', '', '', extra[1]))

    worst = max(c for _, _, c in rows)
    n = sum(len(v) for v in out.values())
    print()
    print('%d images, every one %dx%d, worst tile %d colours against a ceiling of %d.'
          % (n, TPX, TPX, worst, CEILING))

    # ---- the two legal sizes. 88 is a clean 2x: every pixel becomes a 2x2 block.
    payload = {'44': {}, '88': {}}
    for kind, v in out.items():
        payload['44'][kind] = [b64_of(im) for im, _, _ in v]
        payload['88'][kind] = [b64_of(im.resize((TPX*2, TPX*2), Image.NEAREST)) for im, _, _ in v]
    for kind in out:
        for i, b in enumerate(payload['88'][kind]):
            big = img(b)
            if big.size != (TPX*2, TPX*2):
                die('the 2x of %s[%d] came out %s' % (kind, i, big.size))
            if len(colours(big)) != len(colours(out[kind][i][0])):
                die('the 2x of %s[%d] invented a colour -- that is not nearest neighbour'
                    % (kind, i))

    doc = {
        'version': 'BOHEMIA_THE_FIGHT_FLOOR_v1',
        'built': '2026-09-21',
        'lane': 'COOK [fight floor]',
        'why': "THE FIGHT VERDICT round 1 item 1 (about 70% of the frame): the street's own "
               "approved ground families at house scale, crisp, warm, drawn 1:1. Measured "
               "cause, COOK 60a52ac9: the fight is a separate document whose road and walk "
               "are the city's street and side from BEFORE the 9/13 recook, byte for byte.",
        'sources': {
            'city': 'slices/BOHEMIA_CITY_TILES_01.js SA_TILES (the 9/13 recook, 9e026864)',
            'approved': 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt '
                        '(Paolo 7/28: "I checked it to do the other 41 mark it approved")'},
        'cell_px': TPX,
        'sizes': {'44': 'native, 1:1', '88': 'a clean 2x, nearest neighbour, every pixel a 2x2 block'},
        'counts_held': {k: len(v) for k, v in out.items()},
        'counts_note': 'identical to what the fight picks from today, so its own h%n lands '
                       'on the same index for the same cell: an art payload swap, nothing else',
        'no_new_pixels': 'not one pixel is drawn by this tool. Every tile is his approved art; '
                         'the kerbs and gutters are quarter turns, which are permutations.',
        'one_palette_per_family': RAMPS,
        'provenance': {k: [p for _, p, _ in v] for k, v in out.items()},
        'worst_tile_colours': worst,
        'ceiling': CEILING,
        'not_done_on_purpose': [
            "the lot layout (COMBAT's lotSubKind, the wy%2 roof/yard alternation): not listed "
            "by THE FIGHT VERDICT, and it is COMBAT's code, not art",
            "the cell size the board draws at: COMBAT's ring. 44 -> 67 is scale 1.523 and "
            "doubles 23 of 44 rows, which is the blur the bible fails the fight on (R10). "
            "Both legal sizes are in here so a whole-number draw is available.",
            "nothing is written to the alpha or the demo (rule 18)"],
        'tiles': payload,
    }
    with open(OUT, 'w') as f:
        json.dump(doc, f)
    back = json.load(open(OUT))
    for size in ('44', '88'):
        got = sum(len(v) for v in back['tiles'][size].values())
        if got != n:
            die('read-back: %s px holds %d images, cooked %d' % (size, got, n))
    print('wrote %s  (%.0f KB, %d images at 44 and %d at 88)'
          % (os.path.relpath(OUT, REPO), os.path.getsize(OUT) / 1024, n, n))

if __name__ == '__main__':
    main()
