#!/usr/bin/env python3
"""THE STYLE CARD RATCHET (9/5/26, DIRECTION lane — the card keeper's tool).

The card's baseline holds two different things and they age differently:
- THE NAMES are frozen forever: they define which garments predate the card
  and are judged as a population. They NEVER regenerate — regenerating them
  would grandfather every new cook out of the full card.
- THE FLOOR (register_count / nonhair_count) is a RATCHET: when the measured
  register share of the live canon rises above the stored floor, the floor
  CLICKS UP to the measurement, and style_card_gate then fails any future
  slide back below it. It never moves down. COOK's remake earned 32% -> 42%;
  without the click, the gate would have let the whole gain rot.

A GATE MEASURES AND A TOOL WRITES (the self-attestation rule): the gate
never edits its own floor; DIRECTION runs this after a batch lands.

  python3 tools/bohemia_style_card_ratchet.py
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

card = json.loads(re.search(r'```json\n(.*?)```',
                            open(CARD, encoding='utf8').read(), re.S).group(1))
base = json.load(open(BASELINE, encoding='utf8'))


def hsv(hexs):
    r, g, b = (int(hexs[i:i + 2], 16) / 255 for i in (1, 3, 5))
    return colorsys.rgb_to_hsv(r, g, b)


rows = []
for ln in open(BANK, encoding='utf8'):
    ln = ln.strip()
    if not ln or ln.startswith('=') or ln.startswith('#'):
        continue
    p = ln.split('|')
    if len(p) >= 3 and p[2].startswith('#'):
        rows.append((p[0], p[1], p[2]))
nonhair = [(n, l, h) for n, l, h in rows if l != 'hair']
reg = sum(1 for _, _, h in nonhair if hsv(h)[1] < card['cloth_sat_max'])

old = base['register_count'] / base['nonhair_count']
new = reg / len(nonhair) if nonhair else 0.0
if new > old + 1e-9:
    base['register_count'] = reg
    base['nonhair_count'] = len(nonhair)
    base.setdefault('clicks', []).append(
        {'stamp': '9/5/26', 'floor': '%d/%d' % (reg, len(nonhair)),
         'share': round(new, 4)})
    json.dump(base, open(BASELINE, 'w', encoding='utf8'), indent=0)
    print('RATCHET CLICKED: %.0f%% -> %.0f%% (%d/%d). The gate now holds the new floor.'
          % (old * 100, new * 100, reg, len(nonhair)))
elif new < old - 1e-9:
    sys.exit('RATCHET REFUSES: measured %.0f%% is BELOW the stored floor %.0f%%. '
             'A ratchet never moves down — fix the wardrobe, not the floor.'
             % (new * 100, old * 100))
else:
    print('RATCHET HOLDS: measured %.0f%% equals the stored floor. Nothing written.'
          % (new * 100))
