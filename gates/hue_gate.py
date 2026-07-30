#!/usr/bin/env python3
"""BOHEMIA — THE HUE GATE (7/29/26, WORLD lane)

THE MEASUREMENT THIS LOCKS IN (7/28, records/BOHEMIA_POCKET_CITY_STYLE_REFERENCE.md):
Paolo named Pocket City 2 as the bar -- "you gotta be able to rock with that" -- and
when the two were actually counted rather than argued about:

    Pocket City 2 (his own reference shots)   12 of 12 hue families   88% chromatic
    Bohemia district icons (27, median)        3 hue families         13% chromatic
    our worst (policestation)                  2                       0.9%

Thirteen of twenty-seven icons carried only TWO hue families. That is not a style,
it is mud, and it is the measurable answer to "each grid each district should feel
like its own landmark": they cannot, because they are all the same colour.

AND NO LAW EVER REQUIRED IT. The visual constitution constrains VALUE BANDS only
(ground 103.7 / top 110.2 / wall 96.0, +-26) and says nothing about saturation or
hue anywhere. The grey-brown world was self-inflicted, district by district, and
nothing in the machine could see it -- which is precisely why this gate exists.

WHAT IT DOES NOT DO: it does not chase 88%. A dead Vegas should not look like a
living sunny city, and copying that number would be wrong. The target is MUTED BUT
DISTINCT -- every district keeps a recognisable hue identity, dropped in saturation,
never merged into its neighbour's.

RATCHET, like the icon and squint gates: the floor is set from what is ALREADY
TRUE, so the gate is green today and can only be tightened. New work cannot drop
below the floor, and the recorded best cannot silently regress.

  python3 gates/hue_gate.py
"""
import base64
import colorsys
import io
import json
import os
import statistics
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
from PIL import Image

BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'
SAT_MIN = 0.18              # below this a pixel is grey, not a colour
BUCKETS = 12                # hue families, 30 degrees each

# THE FLOOR, set from what is already true on 7/29 (the ratchet's baseline).
FLOOR_FAMILIES = 2          # no icon may carry fewer than this
FLOOR_MEDIAN = 3            # the set's median may not drop below this
FLOOR_BEST = 9              # the best icon (school, rebuilt on his notes) may not regress

passed = failed = 0
def ok(name, cond, detail=''):
    global passed, failed
    if cond: passed += 1
    else:
        failed += 1
        print('  FAIL: %s%s' % (name, ('  -- ' + detail) if detail else ''))

def score(png):
    im = Image.open(io.BytesIO(png)).convert('RGBA')
    fams, chroma, total = set(), 0, 0
    for (R, G, B, A) in im.getdata():
        if A < 128: continue
        total += 1
        mx, mn = max(R, G, B), min(R, G, B)
        if mx < 40: continue
        if (mx - mn) / float(mx) < SAT_MIN: continue
        fams.add(int(colorsys.rgb_to_hsv(R / 255., G / 255., B / 255.)[0] * BUCKETS) % BUCKETS)
        chroma += 1
    return len(fams), (100.0 * chroma / total if total else 0.0)

bank = json.load(open(BANK))
rows = []
for h in bank['heroes']:
    f, c = score(base64.b64decode(h['b64']))
    rows.append((h['district'], f, c))
rows.sort(key=lambda r: r[1])

ok('every district icon was measurable (%d)' % len(rows), len(rows) > 0)

mono = ['%s(%d)' % (d, f) for (d, f, c) in rows if f < FLOOR_FAMILIES]
ok('no icon is monochrome -- every district carries at least %d hue families' % FLOOR_FAMILIES,
   not mono, ', '.join(mono[:8]))

med = statistics.median(f for (_, f, _) in rows)
ok('the set median holds at >= %d hue families (measured %.0f)' % (FLOOR_MEDIAN, med),
   med >= FLOOR_MEDIAN)

best = max(f for (_, f, _) in rows)
bestd = [d for (d, f, _) in rows if f == best][0]
ok('the best icon does not regress (>= %d families; %s has %d)' % (FLOOR_BEST, bestd, best),
   best >= FLOOR_BEST)

print('\n  THE COLOUR DEBT (fewest hue families first -- these are the mud):')
for (d, f, c) in rows[:8]:
    print('    %-14s %2d families  %5.1f%% chromatic' % (d, f, c))
print('  set median %.0f families / %.1f%% chromatic   |   best: %s at %d'
      % (med, statistics.median(c for (_, _, c) in rows), bestd, best))
print('  reference (Pocket City 2, his own shots): 12 families / 88%% chromatic')

print('HUE GATE: %d passed, %d failed  (%d district icons)' % (passed, failed, len(rows)))
sys.exit(1 if failed else 0)
