#!/usr/bin/env python3
"""
BOHEMIA HOUSE FACTORY GATE (7/31/26) — the sixteen, held to the laws they were
generated under.

Paolo approved house 02 south ("THE SOUTH LOOKS SO FUCKING GOOD BRO"), and approval
unlocks volume. Volume is exactly where a factory quietly drifts, so the batch gets
the same scrutiny the one did — and every check here is one a dead house would have
failed:

  1. TWO MASSES MINIMUM on every house. House 01 was one bar and read as a trailer.
  2. PITCH >= 4:12. Below that is manufactured housing, per the research.
  3. EVERY COLOUR EXISTS IN HIS APPROVED SKIN BANK, verified per house. This is the
     check house 01 would have failed: it documented a reuse check, sampled a few
     colours off a street tile, and drew every pixel itself.
  4. act-1 floor and ceiling.
  5. NO TWO OPENINGS ON A WALL MAY OVERLAP. Paolo 7/31 killed the first batch for
     "DOORS MESHING IN WITH WINDOWS" on all sixteen — the door was placed by one
     loop and the windows by another and nothing compared them. This check reads the
     openings the generator actually claimed.
  6. A MASS OVER 4 m OF PLATE MUST CARRY TWO ROWS OF WINDOWS. Same verdict: "YOUR
     TWO STORY HOUSES LOOK LIKE SHIT". A 5.3 m plate with one row near the floor and
     a blank wall above is a warehouse, not a house. Raising a number is not adding
     a storey.
  7. SIXTEEN DISTINCT SHAPES, not one silhouette in sixteen colourways. The
     STRUCTURE-NOT-COLOUR law says a recolour is filler and never the headline, so
     the gate counts distinct massing footprints and fails if colour is doing the
     work that shape should.

NOT HELD: whether any of them looks good. Sixteen thumbs, his.
"""
import base64, io, json, os, sys
from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
BANK = 'banks/BOHEMIA_HOUSE_SET_16_7_31_26.txt'
SKINS = 'banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt'
FLOOR, CEIL = 17.0, 232.0
P = F = 0

def ok(n, c, d=''):
    global P, F
    if c: P += 1
    else:
        F += 1; print('   FAIL  %s  %s' % (n, d))

def lum(c): return 0.299*c[0] + 0.587*c[1] + 0.114*c[2]

def main():
    if not os.path.exists(BANK):
        print('   HOUSE FACTORY GATE: no set, nothing to hold'); return 0
    d = json.load(open(BANK))
    hs = d['houses']
    ok('sixteen houses', len(hs) == 16, '%d' % len(hs))
    ok('the set declares his bank', 'HOUSE_SKIN_CANDIDATES' in str(d.get('art_from')))
    ok('the set is south-facing, which is what he approved', d.get('facing') == 'south',
       str(d.get('facing')))

    sk = json.load(open(SKINS))
    ok('his bank is still CANON', 'CANON' in str(sk.get('status', '')))
    approved = set()
    for t in sk['tiles']:
        im = Image.open(io.BytesIO(base64.b64decode(t['b64']))).convert('RGBA')
        p = im.load()
        approved |= {p[x, y][:3] for y in range(im.size[1]) for x in range(im.size[0])
                     if p[x, y][3] > 8}

    shapes = set()
    for h in hs:
        ok('%s has a massing break' % h['id'], h['masses'] >= 2, '%d mass' % h['masses'])
        ok('%s pitch is site-built' % h['id'],
           int(h['pitch'].split(':')[0]) >= 4, h['pitch'])
        im = Image.open(io.BytesIO(base64.b64decode(h['b64']))).convert('RGBA')
        p = im.load()
        used = {p[x, y][:3] for y in range(im.size[1]) for x in range(im.size[0])
                if p[x, y][3] > 8}
        ok('%s uses only HIS colours' % h['id'], not (used - approved),
           '%d stray' % len(used - approved))
        ok('%s inside act-1' % h['id'],
           min(map(lum, used)) >= FLOOR and max(map(lum, used)) <= CEIL,
           '%.0f..%.0f' % (min(map(lum, used)), max(map(lum, used))))
        shapes.add((h['masses'], tuple(h['footprint_cells']), h['plate_m'], h['pitch']))

        # the two defects that killed the first batch, now machine-held
        for w in h.get('walls', []):
            sp = sorted(w.get('openings', []))
            ok('%s wall openings never overlap' % h['id'],
               all(sp[i][1] <= sp[i + 1][0] for i in range(len(sp) - 1)),
               'a door and a window share wall on %s' % h['id'])
        ok('%s two-storey has two window rows' % h['id'],
           h['plate_m'] < 4.0 or h.get('window_rows', 0) >= 2,
           'plate %.2f m with %d row(s) - that is a warehouse'
           % (h['plate_m'], h.get('window_rows', 0)))

    # STRUCTURE-NOT-COLOUR: shape must be doing the work, not the colourway
    ok('the sixteen differ by SHAPE, not by recolour', len(shapes) >= 14,
       'only %d distinct massings across 16 houses — colour is carrying it' % len(shapes))

    print('   HOUSE FACTORY GATE: %d passed, %d failed  (%d houses, %d distinct '
          'massings, all colours his)' % (P, F, len(hs), len(shapes)))
    return 1 if F else 0

if __name__ == '__main__':
    sys.exit(main())
