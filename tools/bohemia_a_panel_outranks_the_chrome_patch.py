#!/usr/bin/env python3
"""
SLEEP WAS PRESSABLE THROUGH THE OPEN PHONE, AND THAT IS HOW THE DEMO DIES
(8/25/26, RUN lane. Backlog row P0-MORNING. My own regression, from 8/24.)

THE ROW SAID a tester can finish the demo without meeting the game. The cold-hand
probe found the mechanism, and it is worse than a soft signifier:

  MEASURED, phone open, day 1, 06:00 -- three world buttons are still the topmost
  element at their own centre, sitting ON the phone that is covering the screen:

      sleepbtn   bikebtn   rungbtn

  SLEEP is the demo-killer. He opens the phone, his thumb is already at the
  bottom of the screen, and the button under it ENDS DAY ONE. Job never taken,
  game never met, exactly the failure the row describes.

*** THIS IS MINE, FROM TWO DAYS AGO. *** __HUD_NEVER_OVERLAPS__ (8/24) joined the
day-loop chips into #blstack so they could not collide, and gave that column
z-index 39. #phonewrap has been z-index 30 since it was built. Before the column
SLEEP was z-index 7 and correctly UNDER the phone; the column lifted it over.
A LAYOUT FIX THAT CHANGES A STACKING CONTEXT IS A LAYERING CHANGE, and I did not
look for what the new column would now float above. Same shape as the popcard's
offsetTop and the see-through's playerBox: MOVING WHERE SOMETHING SITS IS NOT A
COSMETIC CHANGE, and everything that depended on where it used to sit has to be
found and moved with it. Third time this week.

=== THE FIX ==================================================================

The city has twenty-two z-indexes and NO RULE, which is why this was possible:
#ctcard 41, #cttalk 40, #cttell 39, #blstack 39, #phonewrap 30, #daycard 20,
#savepanel 9, #devtray 9, #pfpanel 8, #buildpanel 8, #tlstack 7, #sleepbtn 7 ...
A takeover panel sits BELOW the chip columns and BELOW the conversation cards.
That is not a bug in one number, it is the absence of an order.

So the order is written down, and the one panel that takes the whole screen is
moved above the chrome that was punching through it:

    world / canvas        under everything
    chrome                6 .. 45   buttons, chips, the two columns, cards
    TAKEOVER PANELS       50 ..     things that own the screen while they are up

NOT A SWEEP OF ALL TWENTY-TWO. Only #phonewrap actually covers the stage today
(measured: inset 0, box 378x763 of a 390x844 screen), and renumbering panels
nobody proved wrong would be changing things I have not looked at. THE GATE DOES
THE GENERAL CASE INSTEAD: it sweeps every panel it can open and fails if ANY
world button is the topmost element over it. If another panel has this bug
tomorrow, the machine says so rather than my guessing today.

NOT CHANGED: the phone, the buttons, what any of them do, or where anything is
drawn. One number, and a rule written next to it.

REUSE CHECK: no graphic pixels cooked -- a stacking order, so no banks/ lookup
applies.

Idempotent (marker __A_PANEL_OUTRANKS_THE_CHROME__).
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__A_PANEL_OUTRANKS_THE_CHROME__'

OLD = """#phonewrap{position:absolute;inset:0;z-index:30;display:none;flex-direction:column;
  background:#070605}"""

NEW = """/* """ + MARK + """ (8/25) -- A PANEL THAT OWNS THE SCREEN OUTRANKS THE CHROME.
   MEASURED with the phone open on day 1: sleepbtn, bikebtn and rungbtn were all
   still the TOPMOST element at their own centres, sitting on top of a panel
   covering 378x763 of a 390x844 screen. SLEEP ends the day -- so the thumb that
   opens the phone lands on the button that finishes the demo without playing it.
   MY REGRESSION, 8/24: __HUD_NEVER_OVERLAPS__ joined the day-loop chips into
   #blstack at z-index 39 so they could not collide with each other, and this
   panel has been 30 since it was built. SLEEP used to be 7 and correctly
   underneath; the column lifted it over. Moving where something sits IS a
   layering change, and everything that depended on the old position has to be
   found and moved with it -- the same lesson as the popcard's offsetTop and the
   see-through's playerBox, three times in one week.
   THE ORDER, WRITTEN DOWN, because the file had twenty-two z-indexes and no rule:
       world / canvas     under everything
       chrome             6 .. 45   buttons, chips, the two columns, cards
       TAKEOVER PANELS    50 ..     things that own the screen while up
   Only this one covers the stage today, so only this one moves. The gate sweeps
   the general case so the next one is caught by the machine, not by my guessing. */
#phonewrap{position:absolute;inset:0;z-index:50;display:none;flex-direction:column;
  background:#070605}"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf8').read()
    if MARK in s:
        print('NOOP: the panel already outranks the chrome')
        return
    if '#blstack{' not in s:
        sys.exit('FAIL: #blstack is missing (the column that caused this)')
    n = s.count(OLD)
    if n != 1:
        sys.exit('FAIL: the phonewrap rule matched %d times, expected 1' % n)
    open(CITY, 'w', encoding='utf8').write(s.replace(OLD, NEW, 1))
    print('PATCHED %s -- a takeover panel now sits above the chrome columns' % CITY)


if __name__ == '__main__':
    main()
