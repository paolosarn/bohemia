#!/usr/bin/env python3
"""
THE ALPHA OPENED ON THE CHARACTER WORKBENCH, SO THE GAME WAS NEVER THE FIRST
THING ANYBODY SAW (8/25/26, RUN lane. Backlog row P0-DOOR.)

THE COORDINATOR'S 8/25 ROLLUP, item B, and this row has been RUN's number one
open item on the demo board:

    THE FRONT DOOR (RUN P0-DOOR, still open). The alpha's markup still has
    `class="tab on" data-p="char"` -- it opens on the CHARACTER workbench. Even
    inside the workshop, the game is not the first thing you see.

*** AND THE ROW IS NARROWER THAN IT SOUNDS, WHICH ONLY MEASURING BOTH STATES
SHOWED. *** I nearly wrote this up as "the game is not what you land on", and that
is NOT TRUE. Measured, old markup, on the real surface:

    while the splash is up       tab CHARACTER, panel p-char
    after #front is tapped       tab RUN, panel p-city, the world alive at 06:00

Something in the boot already switches to RUN. So a player who taps through the
splash was always landing in the game. WHAT WAS ACTUALLY WRONG is the state
BEHIND the splash: the CHARACTER workbench is the panel that MOUNTS FIRST, it is
what shows behind the splash, and it is what a stranger lands on if the splash is
dismissed early or fails. The markup and the behaviour disagreed, and the markup
is the half that runs before any script does.

I found this because the first cut of the gate claims read the state AFTER the
splash, and PASSED WITH THE PATCH REVERTED. A claim that is green with the fix
removed is holding nothing, and I nearly shipped three of them next to a
confident sentence. The claims now read the state before #front is touched, which
is the only moment the two differ.

It still pairs with the P0-MORNING work shipped the same turn: that one made the
first morning point at the game, and this one makes the first thing that mounts
be the game rather than the dressing room.

=== WHAT IT ACTUALLY TAKES, WHICH IS TWO THINGS AND NOT ONE ==================

The obvious edit is to move `class="tab on"` to the RUN tab. On its own that
would be WRONG AND SILENT, because the RUN tab does not show #p-run:

    var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;

The RUN tab shows the CITY panel, and #p-run is display:none the entire time.
Something has already been bitten by this once -- the ambience code carries a
comment saying so ("two wrong guesses before this one ... #p-run is display:none
the whole time because the RUN tab actually shows the p-city panel"). So the
panel carrying `class="panel on"` has to move to #p-city, not #p-run.

BOTH HALVES OR NEITHER: the tab alone leaves a highlighted RUN tab over the
character workbench, and the panel alone leaves the city showing under a
highlighted CHARACTER tab. That is why this is a patch with a check rather than a
one-character edit.

NOTHING IS REMOVED. Every tab is still there, in the same order, one tap away.
CHARACTER is not hidden, moved or renamed -- it simply stops being what the door
opens onto. This is the workshop; the workshop keeps all its benches.

REUSE CHECK: no graphic pixels cooked -- one attribute and one class on existing
markup, so no banks/ lookup applies.

Idempotent (marker __THE_FRONT_DOOR_IS_THE_GAME__).
"""
import os
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_FRONT_DOOR_IS_THE_GAME__'

TAB_OLD = """<div class="tab" data-p="run">RUN</div>"""
TAB_NEW = ("""<div class="tab on" data-p="run">RUN</div><!-- """ + MARK + """ (8/25, """
           """P0-DOOR): THE DOOR OPENS ONTO THE GAME. It opened on the CHARACTER """
           """workbench, so a stranger's first screen was a dressing room with sixteen """
           """other tabs over it. Nothing was removed; CHARACTER is one tap away, in """
           """the same place. NOTE the second half in #p-city below -- the RUN tab """
           """shows the CITY panel, not #p-run, so marking this tab alone would """
           """highlight RUN over the character workbench. -->""")

CHAR_OLD = """    <div class="tab on" data-p="char">CHARACTER</div>"""
CHAR_NEW = """    <div class="tab" data-p="char">CHARACTER</div>"""

PANEL_OLD = """    <div class="panel" id="p-city"></div>"""
PANEL_NEW = ("""    <div class="panel on" id="p-city"></div><!-- """ + MARK + """: the """
             """other half. `var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p` """
             """-- the RUN tab shows THIS panel and #p-run is display:none the whole """
             """time, which the ambience code already learned the hard way. Both halves """
             """or neither: the tab alone highlights RUN over the workbench, the panel """
             """alone shows the city under a highlighted CHARACTER. -->""")

CHARPANEL_OLD = """    <div class="panel on" id="p-char">"""
CHARPANEL_NEW = """    <div class="panel" id="p-char">"""

EDITS = [
    (TAB_OLD, TAB_NEW, 'the RUN tab is the one that is open'),
    (CHAR_OLD, CHAR_NEW, 'and CHARACTER is a tab like the others'),
    (PANEL_OLD, PANEL_NEW, 'the CITY panel is the one showing (RUN maps to it)'),
    (CHARPANEL_OLD, CHARPANEL_NEW, 'and the character workbench waits its turn'),
]


def main():
    if not os.path.exists(ALPHA):
        sys.exit('FAIL: ' + ALPHA + ' not found')
    s = open(ALPHA, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the front door already opens onto the game')
        return
    if "(t.dataset.p==='run') ? 'city'" not in s:
        sys.exit('FAIL: the RUN->city panel mapping is gone; re-read the switcher '
                 'before assuming which panel the RUN tab shows')
    for old, new, what in EDITS:
        n = s.count(old)
        if n != 1:
            sys.exit('FAIL: anchor for "%s" matched %d times, expected 1' % (what, n))
        s = s.replace(old, new, 1)
    open(ALPHA, 'w', encoding='utf8').write(s)
    print('PATCHED %s' % ALPHA)
    for _o, _n, what in EDITS:
        print('  + ' + what)


if __name__ == '__main__':
    main()
