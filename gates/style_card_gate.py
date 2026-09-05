#!/usr/bin/env python3
"""THE STYLE CARD GATE (9/5/26, DIRECTION lane — VAMILY [style checker]).

The 9/4 runway law gave DIRECTION a card; A LAW WITHOUT A MACHINE GATE IS
NOT ENFORCED, so this holds it. Same shape as target_match_gate: read the
declared truth, measure the shipped surface, fail on the gap.

WHAT IT HOLDS (and what it deliberately does not):
- THE CARD ITSELF: records/BOHEMIA_STYLE_CARD_9_5_26.md must exist and its
  JSON machine block must parse. A card the machine cannot read is a mood
  board, not a card.
- THE BANK IS FRESH: the canon garment names in the shipped alpha must
  equal the wardrobe bank's names, because this gate measures the bank's
  hexes and a stale bank lies (the face-thumb gate's 9/5 lesson). The fix
  it names: python3 tools/bohemia_wardrobe_extract.py.
- NEW COOKS TAKE THE FULL CARD: any canon garment NOT in the 9/5 baseline
  (records/BOHEMIA_STYLE_CARD_BASELINE_9_5_26.json — the pre-card
  wardrobe, frozen the day the card shipped) must sit in the register
  (cloth saturation <= cloth_sat_max) OR be a clear faction accent
  (saturation >= accent_sat_min). The muddy middle is exactly what the
  card exists to end. Its mid value stays inside [val_floor, val_ceil],
  and a new OUTER layer's mid value sits in outer_val_mid (runway black).
- THE RATCHET: the register share of the whole non-hair canon never drops
  below the baseline's 82 of 256. The pre-card wardrobe is judged as a
  population, not garment by garment — the pixel-craft precedent (7/27):
  a frozen set ratchets against its own baseline, full thresholds bind
  what comes after.
- THE PURPLE RESERVATION: no canon garment, old or new, wears purple
  (hue 0.70-0.86 at saturation > 0.2). Measured clean at birth.
GOODHART GUARD (SHARED -7): never change the game to make this pass; if
the card is wrong, DIRECTION changes the card and says so.
"""
import colorsys
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

CARD = 'records/BOHEMIA_STYLE_CARD_9_5_26.md'
BASELINE = 'records/BOHEMIA_STYLE_CARD_BASELINE_9_5_26.json'
BANK = 'banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

fails, passes = [], 0


def ok(name, cond, detail=''):
    global passes
    if cond:
        passes += 1
    else:
        fails.append('  FAIL %s%s' % (name, (' — ' + detail) if detail else ''))


def hsv(hexs):
    r, g, b = (int(hexs[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return colorsys.rgb_to_hsv(r, g, b)


# 1. the card parses
card = None
if os.path.exists(CARD):
    m = re.search(r'```json\n(.*?)```', open(CARD, encoding='utf8').read(), re.S)
    if m:
        try:
            card = json.loads(m.group(1))
        except ValueError:
            card = None
ok('the style card exists and its machine block parses', card is not None, CARD)
if card is None:
    print('\n'.join(fails))
    print('STYLE CARD GATE: %d passed, %d failed' % (passes, len(fails)))
    sys.exit(1)

# 2. the bank is fresh against the shipped alpha
alpha_names = set()
s = open(ALPHA, encoding='utf8').read()
for m in re.finditer(r'\{n:(?:\'([^\']+)\'|"([^"]+)"),st:\'canon\'', s):
    alpha_names.add(m.group(1) or m.group(2))
bank_rows = []
for ln in open(BANK, encoding='utf8'):
    ln = ln.strip()
    if not ln or ln.startswith('=') or ln.startswith('#'):
        continue
    p = ln.split('|')
    if len(p) >= 3 and p[2].startswith('#'):
        bank_rows.append((p[0], p[1], p[2]))
bank_names = {n for n, _, _ in bank_rows}
drift = alpha_names.symmetric_difference(bank_names)
ok('the wardrobe bank matches the shipped alpha (stale banks lie)', not drift,
   '%d names drift (%s...) — regenerate: python3 tools/bohemia_wardrobe_extract.py'
   % (len(drift), ', '.join(sorted(drift)[:4])))

# 3. new cooks take the full card
base = json.load(open(BASELINE, encoding='utf8'))
base_names = set(base['names'])
new = [(n, l, h) for n, l, h in bank_rows if n not in base_names and l != 'hair']
for n, l, h in new:
    hh, ss, vv = hsv(h)
    ok('new cook %s sits in the register or is a clear accent' % n,
       ss <= card['cloth_sat_max'] or ss >= card['accent_sat_min'],
       'sat %.2f is the muddy middle the card ends' % ss)
    ok('new cook %s keeps its value inside the card' % n,
       card['val_floor'] <= vv <= card['val_ceil'], 'val %.2f' % vv)
    if l == 'outer' and ss <= card['cloth_sat_max']:
        lo, hi = card['outer_val_mid']
        ok('new outer %s wears runway black' % n, lo <= vv <= hi,
           'outer mid val %.2f outside %.2f-%.2f' % (vv, lo, hi))

# 4. the ratchet
nonhair = [(n, l, h) for n, l, h in bank_rows if l != 'hair']
reg = sum(1 for _, _, h in nonhair if hsv(h)[1] < card['cloth_sat_max'])
floor_share = base['register_count'] / base['nonhair_count']
ok('the register share never drops below the 9/5 baseline',
   len(nonhair) == 0 or reg / len(nonhair) >= floor_share - 1e-9,
   '%d/%d now vs %d/%d frozen' % (reg, len(nonhair), base['register_count'], base['nonhair_count']))

# 5. the purple reservation
purple = [n for n, l, h in bank_rows
          if 0.70 <= hsv(h)[0] <= 0.86 and hsv(h)[1] > 0.2]
ok('no garment wears purple (PURPLE RESERVATION)', not purple, ', '.join(purple[:5]))

print('\n'.join(fails))
print('STYLE CARD GATE: %d passed, %d failed  (%d canon garments, %d new since the card)'
      % (passes, len(fails), len(bank_rows), len(new)))
sys.exit(1 if fails else 0)
