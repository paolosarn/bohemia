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

# AMENDED 9/13, with the gate: two accent-immune ratchets. Register count
# clicks UP, muddy count clicks DOWN; a legal accent moves neither.
muddy = sum(1 for _, _, h in nonhair
            if card['cloth_sat_max'] <= hsv(h)[1] < card['accent_sat_min'])
old_reg = base['register_count']
old_muddy = base.get('muddy_count', base['nonhair_count'] - base['register_count'])
wrote = False
if reg > old_reg:
    base['register_count'] = reg
    wrote = True
if muddy < old_muddy:
    base['muddy_count'] = muddy
    wrote = True
elif 'muddy_count' not in base:
    base['muddy_count'] = old_muddy
    wrote = True
if reg < old_reg:
    sys.exit('RATCHET REFUSES: register %d is BELOW the stored %d. '
             'A ratchet never moves down — fix the wardrobe, not the floor.'
             % (reg, old_reg))
if muddy > old_muddy:
    sys.exit('RATCHET REFUSES: muddy middle %d is ABOVE the stored %d. '
             'Fix the wardrobe, not the floor.' % (muddy, old_muddy))
if wrote:
    base.setdefault('clicks', []).append(
        {'stamp': '9/13/26', 'register': reg, 'muddy': min(muddy, old_muddy)})
    json.dump(base, open(BASELINE, 'w', encoding='utf8'), indent=0)
    print('RATCHET CLICKED: register %d -> %d, muddy %d -> %d. The gate holds the new floors.'
          % (old_reg, base['register_count'], old_muddy, base['muddy_count']))
else:
    print('RATCHET HOLDS: register %d, muddy %d. Nothing written.' % (reg, muddy))
