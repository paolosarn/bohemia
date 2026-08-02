#!/usr/bin/env python3
"""BOHEMIA — THE SQUINT GATE (7/29/26, WORLD lane)

THE LAW IT ENFORCES: EVERY DISTRICT IS ITS OWN LANDMARK (Paolo 7/28, LOCKED --
laws/BOHEMIA_ADDENDUM_EVERY_DISTRICT_IS_A_LANDMARK_7_28_26.md). "each grid each
district should feel like its own landmark." His test, in his words: could a
player describe this cell in five words and be understood. The law shipped with no
machine behind it, and a law without a machine gate is not enforced.

THE MEASURE, which is standard game-art practice and not invented here: black the
thing out and squint. ~70% of a design's impact is its silhouette, and the harshest
test is the smallest one. So this gate renders every district icon down to map
zoom, thresholds it to a pure black silhouette, and asks the only two questions
that matter at that size:

  1. IS THERE A SHAPE AT ALL? A silhouette that fills its box (or nearly nothing)
     is a blob, not a landmark.
  2. ARE ANY TWO DISTRICTS THE SAME SHAPE? Two districts whose black shapes match
     ARE the same district at map zoom, however different their colours or their
     details. That is the failure the law exists to prevent.

RATCHET, deliberately -- the same shape the icon gate uses and for the same reason.
Some existing icons are genuinely too alike, and a gate that goes red on day one is
a comment nobody can act on. So: the named debt may only SHRINK, a pair that is
secretly already distinct must be removed from the list, and NEW work cannot add
debt. It prints the closest pairs every run so the next session knows what to fix.

  python3 gates/squint_gate.py
"""
import base64
import io
import json
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
from PIL import Image

BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
N = 16                      # the silhouette grid -- roughly one map tile
# MEASURE THE TOP HALF, NOT THE WHOLE ICON. Every hero sits on the SAME isometric
# ground plate by design, so a full-icon silhouette is mostly PLATE and barely
# discriminates -- measured, it separated districts 38% worse (median 10.2% vs
# 14.1% different, 34 twin pairs vs 13). The top half is what STANDS UP off the
# plate, which is the thing a player actually recognises at map zoom.
MIN_INK = 0.10              # below this it is nearly nothing
MAX_INK = 0.92              # above this it is a filled box, not a shape
MIN_DIFF = 0.055            # fraction of cells that must differ between two districts

# KNOWN TWINS (the debt). These pairs already read alike and predate the law.
# This list may ONLY shrink. Do not add to it -- new work must pass.
KNOWN_TWINS = {
    frozenset(('storage', 'warehouse')),        # 0.8% -- rows of units vs rows of units
    frozenset(('ballpark', 'speedway')),        # 2.3%
    # RETIRED 8/2, all four, by rebuilding the icons on the real Las Vegas buildings rather
    # than on generic civic/transport boxes. Debt 13 -> 9.
    #   courthouse/library  -- the library became a Predock drum + tower + clerestory wing
    #   commercial/terminal -- the terminal became a curved head house under a solar deck
    #   industrial/terminal --   with sawtooth bays and buses in them
    #   courthouse/medical  -- the courthouse became an L round a plaza with a ringed dome
    frozenset(('commercial', 'mall')),          # 4.7%
    frozenset(('swapmeet', 'truckstop')),       # 4.7%
    frozenset(('commercial', 'industrial')),    # 5.5%
    frozenset(('farm', 'swapmeet')),            # 5.5%
    frozenset(('farm', 'truckstop')),           # 5.5%
    frozenset(('interchange', 'rail')),         # 5.5%
    frozenset(('park', 'warehouse')),           # 5.5%
}

CELLS = N * N // 2
passed = failed = 0
def ok(name, cond, detail=''):
    global passed, failed
    if cond: passed += 1
    else:
        failed += 1
        print('  FAIL: %s%s' % (name, ('  -- ' + detail) if detail else ''))

bank = json.load(open(BANK))
sil = {}
for h in bank['heroes']:
    im = Image.open(io.BytesIO(base64.b64decode(h['b64']))).convert('RGBA')
    # crop to the drawn content, then squash to the silhouette grid
    bbox = im.getbbox()
    if bbox: im = im.crop(bbox)
    px = list(im.resize((N, N), Image.BILINEAR).getchannel('A').getdata())
    sil[h['district']] = [1 if px[y * N + x] >= 128 else 0
                          for y in range(N // 2) for x in range(N)]

ok('every district icon produced a silhouette (%d)' % len(sil), len(sil) > 0)

# ---- 1. IS THERE A SHAPE AT ALL? -------------------------------------------
blobs = []
for d, s in sorted(sil.items()):
    ink = sum(s) / float(CELLS)
    if ink < MIN_INK or ink > MAX_INK:
        blobs.append('%s %.0f%%' % (d, ink * 100))
ok('every icon is a SHAPE at map zoom, not an empty box or a filled one', not blobs,
   ', '.join(blobs[:6]))

# ---- 2. ARE ANY TWO DISTRICTS THE SAME SHAPE? ------------------------------
names = sorted(sil)
pairs = []
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        a, b = sil[names[i]], sil[names[j]]
        diff = sum(1 for k in range(CELLS) if a[k] != b[k]) / float(CELLS)
        pairs.append((diff, names[i], names[j]))
pairs.sort()

twins = [(d, x, y) for (d, x, y) in pairs if d < MIN_DIFF]
undeclared = [(x, y) for (d, x, y) in twins if frozenset((x, y)) not in KNOWN_TWINS]
ok('no NEW district shares another district\'s silhouette at map zoom',
   not undeclared, ', '.join('%s=%s' % p for p in undeclared[:6]))

# the ratchet: a listed pair that is secretly fine must leave the list
stale = [tuple(sorted(p)) for p in KNOWN_TWINS
         if not any(frozenset((x, y)) == p for (d, x, y) in twins)]
ok('the known-twin list only shrinks (no pair listed that is already distinct)',
   not stale, ', '.join('%s=%s' % s for s in stale[:6]))

print('\n  CLOSEST SILHOUETTES (fix these first -- they are the least distinct):')
for (d, x, y) in pairs[:6]:
    print('    %5.1f%% different   %s / %s' % (d * 100, x, y))
print('  SILHOUETTE DEBT: %d twin pair(s) declared, %d below the bar'
      % (len(KNOWN_TWINS), len(twins)))

print('SQUINT GATE: %d passed, %d failed  (%d districts, %dx%d silhouettes)'
      % (passed, failed, len(sil), N, N))
sys.exit(1 if failed else 0)
