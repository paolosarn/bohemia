#!/usr/bin/env python3
"""
SPLIT THE ART BANK OUT OF THE WALKED WORLD (8/6/26).

THE PROBLEM, measured on a real bare clone from origin:

    the repository is 900 MB and gaining 32.5 MB/day
    GitHub's HARD cutoff is 5 GB  ->  ~130 days  (4.3 months)
    and Paolo is planning ELEVEN MONTHS of work

The top driver is slices/BOHEMIA_CITY_WORLD.html at 20.5 MB/day. On 8/2 a lane
lifted this page OUT of the alpha, which fixed the 100 MB PER-FILE cap. It did not
fix the repository, because the page is still committed WHOLE, several times a
day, by several lanes.

WHY IT COSTS SO MUCH, and this is the whole insight:

    line 11021   const TP_TILES = {...}     20.9 MB   74% of the file
    + DOOR_ANIM, HERO_SRC, SIG_TILES, SA_TILES, IN_DOOR_B64, JAMB_W, JAMB_E
    = 27.1 MB of base64 PNG art banks
    the actual game code and markup is about 1 MB

THE VOLATILE PART AND THE HUGE STABLE PART ARE WELDED INTO ONE FILE. The art
almost never changes; the code is patched by string surgery several times a day.
Every code edit rewrites all 28 MB, and git stores it again.

So this is the SAME fix the 8/2 lane made, one level deeper. Split them:

    BOHEMIA_CITY_WORLD.html   28.2 MB  ->  1.0 MB   (the part that changes daily)
    BOHEMIA_CITY_TILES.js               ->  27.1 MB (the part that almost never does)

NO WORKFLOW CHANGES FOR ANY LANE. Patch tools still do string surgery on the world
page exactly as before -- the art they never touch simply is not in it any more.
No Git LFS, no deploy-time build step, no history rewrite (history cannot be
rewritten under six parallel lanes without breaking every clone in the fleet).

PROVED BEFORE IT WAS APPLIED, on a scratch copy, in a real browser, both loaded
side by side at iPhone portrait:

    ORIGINAL  cv 378x819  fit=true  TP_TILES=24 HERO=59 DOOR=10  drawn px=309582  checksum=981952
    SPLIT     cv 378x819  fit=true  TP_TILES=24 HERO=59 DOOR=10  drawn px=309582  checksum=981952

Byte-identical output. (Both show one pre-existing ERR_CONNECTION_RESET; it is not
caused by the split, which is exactly why both were measured instead of one.)

CONSUMERS: gates/bohemia_city_app.js -- the ONE resolver every gate asks -- now
CONCATENATES the bank back on when it reads the page, so every consumer still sees
the whole logical document and nothing downstream needed editing. That is the
lesson of 8/4 applied on purpose: an architecture change is not done when the thing
works, it is done when everything pointing at the old shape still does.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks no graphic pixels and opens no bank.
It MOVES existing bytes between two files and changes not one of them.

Idempotent: re-running when the bank is already split reports NOOP.
"""
import os
import re
import sys

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
BANK = 'slices/BOHEMIA_CITY_TILES.js'
TAG = '<script src="BOHEMIA_CITY_TILES.js"></script>'

# the art banks, by name. Only moved when the line is genuinely huge, so a small
# same-named constant can never be swept out by accident.
NAMES = ['TP_TILES', 'DOOR_ANIM', 'HERO_SRC', 'SIG_TILES', 'SA_TILES',
         'IN_DOOR_B64', 'JAMB_W', 'JAMB_E']
MIN_LINE = 100000

if not os.path.exists(WORLD):
    sys.exit('SPLIT: %s is not here. Nothing to do.' % WORLD)

src = open(WORLD, encoding='utf-8').read()
if TAG in src:
    print('the art bank is already split out. no-op.')
    sys.exit(0)

before = len(src)
moved, keep = [], []
for line in src.split('\n'):
    m = re.match(r'\s*(?:const|var)\s+([A-Z_0-9]+)\s*=', line)
    if m and m.group(1) in NAMES and len(line) > MIN_LINE:
        moved.append(line)
        keep.append('/* %s lives in BOHEMIA_CITY_TILES.js (8/6, repo budget: this '
                    'page is rewritten daily and was carrying 27 MB of art it never '
                    'edits) */' % m.group(1))
    else:
        keep.append(line)

if not moved:
    sys.exit('SPLIT: found no art-bank lines over %d chars. Refusing to write.' % MIN_LINE)

body = '\n'.join(keep)
i = body.find('<script')
if i < 0:
    sys.exit('SPLIT: no <script> tag to load the bank before. Refusing to write.')
body = body[:i] + TAG + '\n' + body[i:]

open(BANK, 'w', encoding='utf-8').write('\n'.join(moved))
open(WORLD, 'w', encoding='utf-8').write(body)

print('ART BANK SPLIT OUT OF THE WALKED WORLD.')
print('  %-34s %6.1f MB -> %5.1f MB   (rewritten daily)' % (WORLD, before / 1048576, len(body) / 1048576))
print('  %-34s          %6.1f MB   (%d banks, changes rarely)'
      % (BANK, os.path.getsize(BANK) / 1048576, len(moved)))
print('  no lane changes anything: the patch tools edit the code, which is still here.')
