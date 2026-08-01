#!/usr/bin/env python3
"""
BOHEMIA: THE CITY TAB IS GONE, THE RUN TAB IS THE WORLD (8/2/26).

PAOLO, 8/2, LOCKED: "the city tab will now live in the run tab. There's no point
in having a city tab anymore. Make sure everything in the city tab is migrated
on the run."

HE IS RIGHT, AND THE MEASUREMENT SAYS SO HARDER THAN HE DID. Tapping RUN and
tapping CITY already opened THE SAME PANEL:

    var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;

That routing landed on 7/28 when he first asked ("Can you put the city in the
run tab?"). So since 7/28 the tab bar has carried TWO buttons that do exactly
the same thing, and nothing has been "migrated" today because everything the
CITY tab shows is already what the RUN tab shows. This deletes the duplicate
button. Nothing is moved, nothing reloads, no world is created twice.

WHAT THE SAME MEASUREMENT ALSO TURNED UP, and it is the bigger finding:
#p-run is display:none for the entire life of the app. The RUN TAB HAS NEVER
SHOWN slices/BOHEMIA_RUN_CURRENT.html. The frame is in the document - the alpha
posts to it and it holds the run's state - but the player has never looked at
it. The surface Paolo plays when he taps RUN is the CITY FRAME's walk mode.
That is recorded in the law file and the handoff, because a lane that does not
know it will keep fixing the surface he cannot see. This lane already has.

WHY THE ROUTING LINE STAYS: it is what makes RUN show the world at all. The tab
disappears; the route it depends on does not.

GATES: four gates reached the world by clicking .tab[data-p="city"]
(wallclass, wallheight, frontdoor, touch_guard). They are updated to click RUN
in the same commit - a gate that navigates by a button the user no longer has is
a gate testing a surface nobody can reach.

REUSE CHECK: cooks ZERO pixels and opens no bank. It removes one button from a
tab bar. Nothing is created.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.

Idempotent.

  python3 tools/bohemia_alpha_one_world_tab_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

TAB = '    <div class="tab" data-p="city">CITY</div>\n'

alpha = open(ALPHA, encoding='utf8').read()

if TAB not in alpha:
    print('the CITY tab is already gone. no-op.')
    sys.exit(0)
if alpha.count(TAB) != 1:
    sys.exit('ONE WORLD TAB: the CITY tab markup appears %d times (expected 1).'
             % alpha.count(TAB))

# the routing line MUST survive - it is what makes RUN show the world
ROUTE = "var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;"
if ROUTE not in alpha:
    sys.exit('ONE WORLD TAB: the RUN->city routing line is missing. Removing the '
             'CITY tab without it would leave the world unreachable. Refusing.')

alpha = alpha.replace(TAB, '', 1)
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('THE CITY TAB IS GONE. The RUN tab is the world.')
print('  the two buttons opened the same panel since 7/28; one of them is now removed')
print('  the RUN->city routing line is untouched, so RUN still shows the world')
