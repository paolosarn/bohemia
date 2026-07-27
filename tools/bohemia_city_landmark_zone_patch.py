#!/usr/bin/env python3
"""BOHEMIA CITY — LANDMARK ZONE PATCH (7/27/26, WORLD lane)

The CITY tab's payload carries its own IN_ZONE table (district -> room grammar), and
gates/interiors_gate.js requires it to cover EXACTLY the districts DISTGEN does, with
the same zone for each. That is a good gate: a district the builder can place but has
no room grammar for is a building you can walk into and find nothing in.

So when the WORLD lane promoted `campus` and `speedway` from flat landmark cells to
real auto-factory districts, that table went stale the same instant, and the gate said
so. This adds exactly those two keys and touches nothing else.

WHY A PATCH TOOL AND NOT AN EDIT: CITY_B64 inside slices/BOHEMIA_ALPHA_0_9.html is a
base64-embedded payload with no source file in the repo, so every change to it goes
through a one-shot decode / replace / re-encode tool. There are already ~25 of these;
this is the same pattern, deliberately.

LANE NOTE: the CITY tab's RENDER internals stay CITY's. This is not a render change —
it is the district->zone contract following a change the world model made, which is
the WORLD lane's own table.

  python3 tools/bohemia_city_landmark_zone_patch.py
"""
import base64
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# the two the world model added, with the zone DISTGEN itself gives them
ADD = [('campus', 'institutional'), ('speedway', 'leisure')]

html = open(ALPHA, encoding='utf8').read()
m = re.search(r"const CITY_B64='([^']+)'", html)
if not m:
    print('CITY_B64 not found'); sys.exit(1)
dec = base64.b64decode(m.group(1)).decode('utf8')

zm = re.search(r'const IN_ZONE=\{([^}]*)\}', dec)
if not zm:
    print('IN_ZONE table not found in the payload'); sys.exit(1)
body = zm.group(1)

added = []
for name, zone in ADD:
    if re.search(r'\b' + name + r":'", body):
        continue
    body = body.rstrip().rstrip(',') + ",%s:'%s'" % (name, zone)
    added.append(name)

if not added:
    print('IN_ZONE already covers ' + ', '.join(n for n, _ in ADD) + ' — nothing to do')
    sys.exit(0)

dec = dec[:zm.start()] + 'const IN_ZONE={' + body + '}' + dec[zm.end():]
html = html[:m.start(1)] + base64.b64encode(dec.encode('utf8')).decode('ascii') + html[m.end(1):]
open(ALPHA, 'w', encoding='utf8').write(html)
print('IN_ZONE += ' + ', '.join(added) + '  (payload %d KB)' % (len(dec) // 1024))
