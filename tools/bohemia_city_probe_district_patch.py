#!/usr/bin/env python3
"""
BOHEMIA CITY PROBE: district() + wallArtReady() (7/21/26) - extends
window.__CITY with two read-only checks, so verification (and any future
gate) can interrogate the real surface instead of guessing:
  - district(x,y): find a district type at an overmap cell, instead of
    trial-teleporting until you land somewhere useful
  - wallArtReady(): true once the perimeter wall pool (bohemia_city_
    perimeterwall_patch) has decoded and can serve a real tile - proves the
    art is actually wired without needing to walk to a specific wall pixel
    in a 96x96-cell procedural valley
Same probe philosophy as 7/20 (isoAt/power/night): the real surface must be
interrogable forever.

Idempotent (marker 'district:function'). Run AFTER the perimeter wall patch
(wallArtReady calls saTex('perimeter',...), which must already exist).
Mirrors the same additions made in tools/bohemia_city_lights_patch.py and
tools/bohemia_city_perimeterwall_patch.py for future fresh rebuilds of
CITY_B64.

  python3 tools/bohemia_city_probe_district_patch.py
"""
import base64
import sys
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'district:function' in decoded:
    print('district() probe already present. no-op.')
    sys.exit(0)

OLD = "oy=cv.height/2-(city.x+city.y)*TH/2+panY;return iso(x,y,ox,oy);}};"
assert OLD in decoded
has_wall = 'saTex' in decoded and "'perimeter'" in decoded
wallpart = ("wallArtReady:function(){var t=saTex('perimeter',0);return !!(t&&t.width);}"
            if has_wall else "wallArtReady:function(){return false;}")
NEW = ("oy=cv.height/2-(city.x+city.y)*TH/2+panY;return iso(x,y,ox,oy);},"
       "district:function(x,y){var c=om.at(x,y);return c&&c.district;},%s};") % wallpart
decoded = decoded.replace(OLD, NEW, 1)

reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])
print('district() probe added to window.__CITY')
