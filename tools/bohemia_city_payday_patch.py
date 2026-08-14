#!/usr/bin/env python3
"""
PUT THE MONEY IN THE WORLD HE WALKS (8/9/26, WORLD lane).

    "the quest payout hook so the day loop PAYS, one act-1 trading hub reachable
     and spendable"                                            -- Paolo, 8/9/26

THE MEASUREMENT THAT ORDERED THIS, taken on the real surface by
tools/bohemia_game_day_probe.js, which walks the tab RUN opens:

    [BLOCKED] 5 GET PAID       currency on the walked surface: NONE AT ALL
    [BLOCKED] 6 SPEND SOMETHING    nothing to spend: no currency exists here

Not for want of an economy. THREE FINISHED ORGANS WERE ALL ISLANDS:
  engine/bohemia_purse.js    three ruled currencies, one ledger, six verbs, an audit
                             -- imported by NOTHING in the entire repo
  engine/bohemia_economy.js  scarcity pricing anchored in real siege data
                             -- imported by NOTHING
  engine/bohemia_payday.js   the joint between them and the quest runtime (8/9)
A module nobody loads is a module that does not exist, and the game had a full
economy that no player could ever reach.

AND I ALMOST FIXED THE WRONG DOOR. The obvious move was the run slice. But tapping
RUN swaps in #cityFrame -- BOHEMIA_RUN_CURRENT.html is loaded and NEVER DISPLAYED
(records/BOHEMIA_A_CHECK_POINTED_AT_THE_WRONG_DOOR_8_4_26.md, and the PEOPLE lane
re-measured it 8/9 for the perimeter walls). The world he walks is the CITY page.
The run template gets the tags too -- it should carry its own economy -- but the
door that matters is this one. Following the probe instead of the filename is the
only reason this landed on the right page.

ONE EDIT, IDEMPOTENT: inline the three modules after the district kit, in
dependency order (economy, purse, then payday which needs both). Exactly the
mechanism bohemia_city_dead_patch.py used, so bohemia_city_module_resync.py keeps
all three fresh from the engine files afterwards like the other ~40 modules
(ENGINE SYNC LAW: one canonical body).

WHAT THIS DOES NOT DO, ON PURPOSE: it draws no UI and shows no number. Every
amount is still [PENDING Paolo] -- what a quest pays, what a thing costs, what a
building yields all ship EMPTY and answer NO_RULING by name (demo blockers 1-3 in
the VOTE tab). A balance readout showing three zeroes would read as a broken
economy rather than an unruled one, and inventing a placeholder to avoid that is
exactly the canon-nobody-ruled failure the mechanism/contents split exists to
stop. The pipe now reaches the surface. One letter from him opens the valve.

REUSE CHECK: cooks ZERO pixels and adds ZERO tables. Inlines three existing engine
modules verbatim. Opens no bank.

  python3 tools/bohemia_city_payday_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
# dependency order: payday requires the other two to be defined before it runs
# THE WORLD STATE A PLAYER CAN STAND IN, in dependency order. It started as the money and
# it is now everything this lane built that a body standing in the valley is subject to --
# because the lesson of the purse was that a module nobody loads is a module that does not
# exist, and shipping four more engines into engine/ without wiring them would be making
# that same mistake four more times.
#   economy/purse/payday   what you are owed and what things cost
#   daycycle/weather       what the light is doing (weather only ATTENUATES the daycycle,
#                          so the daycycle must be inlined FIRST or it has nothing to dim)
#   succession/fuse        the world reorganising around the holes you tore, on a fuse
MODULES = ['engine/bohemia_economy.js', 'engine/bohemia_purse.js', 'engine/bohemia_payday.js',
           'engine/bohemia_daycycle.js', 'engine/bohemia_weather.js',
           'engine/bohemia_succession.js', 'engine/bohemia_fuse.js']
MARK = '/* ==== THE WORLD YOU STAND IN (inlined verbatim) ==== */'
ENDMARK = '/* ==== end THE WORLD YOU STAND IN ==== */'

if not os.path.exists(WORLD):
    sys.exit('PAYDAY PATCH: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()

# RE-RUNNABLE, NOT ONE-SHOT. The city page's ~40 other inlined modules are kept fresh by
# bohemia_city_module_resync.py, which finds an old body by asking git what the file used
# to be -- it cannot do that for a module whose first revision is the one being embedded.
# So a no-op-forever patch would have frozen these three at whatever they were the minute
# they landed, and the app would drift from the engine silently, which is the exact defect
# the resync tool was written to end. Delimited block, replaced wholesale every run.
if MARK in src:
    a = src.find(MARK)
    b = src.find(ENDMARK)
    if b < 0:
        sys.exit('PAYDAY PATCH: the block has a start and no end. Refusing to guess where it stops.')
    src = src[:a] + src[b + len(ENDMARK):]
    refreshed = True
else:
    refreshed = False

for m in MODULES:
    if not os.path.exists(m):
        sys.exit('PAYDAY PATCH: %s is missing.' % m)

# Anchor on the district kit's own export line, never a line number -- the same
# anchor the dead patch uses, and the last thing these modules could need to exist.
ANCHOR = '  root.BohemiaDistrictKit=API;'
i = src.find(ANCHOR)
if i < 0:
    sys.exit('PAYDAY PATCH: could not find the district kit export to inline after.')
j = src.find('\n', i) + 1
j = src.find('\n', j) + 1           # past the kit IIFE's closing line

blob = [MARK]
for m in MODULES:
    blob.append('/* ---- %s (inlined verbatim) ---- */' % m)
    blob.append(open(m, encoding='utf-8').read())
blob.append(ENDMARK)
src = src[:j] + '\n' + '\n'.join(blob) + '\n' + src[j:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('PAYDAY PATCH: %d modules %s %s'
      % (len(MODULES), 'REFRESHED in' if refreshed else 'inlined into', WORLD))
for m in MODULES:
    print('   ', m)
print('   every amount still [PENDING Paolo] -- the pipe reaches the surface, the valve is his.')
