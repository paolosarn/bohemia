#!/usr/bin/env python3
"""
BOHEMIA CITY NEW-DISTRICTS PATCH (7/23/26) - the follow-up to the DISTRICT ART
marriage. Paolo: "look at all the pocket city 2 buildings, we have to make them
as districts." Three new K-registered district modules landed this turn
(cityhall / battery / terminal). The generic marriage MECHANISM
(tools/bohemia_city_districtart_patch.py) already routes ANY registered district
through the shared house-skin art via BohemiaDistrictKit.get(d) - but that lookup
returns null in the browser unless the module's BODY is embedded in CITY_B64 so it
runs and registers itself. The main marriage patch is idempotent (already applied
with the original 32 modules), so it will NOT re-embed. This tool embeds ONLY the
missing module bodies, in place, before the same anchor - so the new districts
light up on the exact same generic path, zero new render code.

REUSE-FIRST (laws/BOHEMIA_ADDENDUM_REUSE_FIRST_LOCKED_7_22_26): no new graphic
pixels cooked. cityhall/battery/terminal structure cells ride the already-CANON
house-skin art the marriage set up, tinted by each district's own palette - the
same as every other district. This tool only wires the module bodies in.

Idempotent per-module (skips any already present). city_tab_gate locks it in.

  python3 tools/bohemia_city_newdistricts_patch.py
"""
import base64
import sys
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

NEW_MODULES = [
    'engine/bohemia_cityhall.js',
    'engine/bohemia_battery.js',
    'engine/bohemia_terminal.js',
]

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

assert 'DISTRICT ART' in decoded, \
    'the generic district marriage must be applied first (tools/bohemia_city_districtart_patch.py)'

MARK = '/* ============ dual traversal proof ============ */'
assert MARK in decoded

added = []
for m in NEW_MODULES:
    if os.path.basename(m) in decoded:
        continue
    src = open(m, encoding='utf8').read()
    block = '/* ==== %s (canon, married 7/23) ==== */\n%s' % (m, src)
    decoded = decoded.replace(MARK, block + '\n' + MARK, 1)
    added.append(m)

if not added:
    print('all new district modules already married in. no-op.')
    sys.exit(0)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('new districts married: %d module(s) embedded (%s) - they light up on the '
      'existing generic legend-driven routing, no new render code'
      % (len(added), ', '.join(os.path.basename(m) for m in added)))
