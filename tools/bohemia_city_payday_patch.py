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
#   mandate                how much of the city backs you, and therefore where you may build
#                          (it hands succession a ROLE for the strongman seat, so succession
#                          must be defined first)
MODULES = ['engine/bohemia_economy.js', 'engine/bohemia_purse.js', 'engine/bohemia_payday.js',
           'engine/bohemia_daycycle.js', 'engine/bohemia_weather.js',
           'engine/bohemia_succession.js', 'engine/bohemia_fuse.js',
           'engine/bohemia_mandate.js']
MARK = '/* ==== THE WORLD YOU STAND IN (inlined verbatim) ==== */'
ENDMARK = '/* ==== end THE WORLD YOU STAND IN ==== */'

# EVERY NAME THIS BLOCK HAS EVER HAD. When the block grew past money it was renamed from
# "THE PLAYER CAN BE PAID" to "THE WORLD YOU STAND IN", and the rename ORPHANED the old
# one: the patch looked for the new marker, did not find the old block, and inlined a
# SECOND copy of economy/purse/payday above it. The orphan sat LATER in the file, so the
# browser ran the stale copy and the fresh one was dead code -- ONE CANONICAL BODY PER
# MODULE (ENGINE SYNC LAW) broken on the surface Paolo actually walks, with every gate
# green, because nothing compared the page against itself. Found 8/15 only because a
# freshly added good was missing from window.BohemiaEconomy on the real page.
# THE FIX BELONGS HERE AND NOT IN THE FILE: a hand-deleted orphan comes back the next time
# somebody renames the marker. Rename it again and add the old name to this list.
LEGACY_MARKS = [
    ('/* ==== THE PLAYER CAN BE PAID (inlined verbatim) ==== */',
     '/* ==== end THE PLAYER CAN BE PAID ==== */'),
]

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

# AND SWEEP EVERY ORPHAN THIS BLOCK LEFT BEHIND UNDER AN OLD NAME. Same refusal as above:
# a start with no end is not something to guess at.
orphans = 0
for _m, _e in LEGACY_MARKS:
    while _m in src:
        a = src.find(_m)
        b = src.find(_e, a)
        if b < 0:
            sys.exit('PAYDAY PATCH: legacy block %r has a start and no end. Refusing to guess.' % _m)
        src = src[:a] + src[b + len(_e):]
        orphans += 1

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
    # THE BANNER IS THE SYNC SWEEP'S ONLY DOOR, so it is written in the scanner's exact
    # shape: '/* ==== engine/x.js ==== */' on ONE line. It used to be '---- ... ----' and
    # that is not a style choice, it is an OPT-OUT -- tools/bohemia_city_module_resync.py
    # only sees a banner that starts AND ends with the '====' marker, so all eight of these
    # modules sat outside the ENGINE SYNC LAW while every gate stayed green. Two other
    # modules on this same page had already drifted a week that way (8/15).
    blob.append('/* ==== %s ==== */' % m)
    blob.append('/* inlined verbatim by tools/bohemia_city_payday_patch.py. The banner above '
                'is one line on purpose: see the note in that tool. */')
    blob.append(open(m, encoding='utf-8').read())
blob.append(ENDMARK)
src = src[:j] + '\n' + '\n'.join(blob) + '\n' + src[j:]

open(WORLD, 'w', encoding='utf-8').write(src)
print('PAYDAY PATCH: %d modules %s %s'
      % (len(MODULES), 'REFRESHED in' if refreshed else 'inlined into', WORLD))
if orphans:
    print('    SWEPT %d ORPHANED BLOCK(S) left behind by an old marker name -- they sat '
          'LATER in the file and their stale copies were WINNING at runtime.' % orphans)
for m in MODULES:
    print('   ', m)
print('   every amount still [PENDING Paolo] -- the pipe reaches the surface, the valve is his.')
