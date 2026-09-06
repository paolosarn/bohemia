#!/usr/bin/env python3
"""
THE DAY ENDS ON YOU (9/5/26, SOUNDS lane) - THE-OTHER-51, round 3.

MEASURED ON THE REAL SURFACE: driving the clock from 06:00 to nightfall and
recording every sound the game asked for --

    {}

Nothing. **The end of a day is completely silent**, and in a hundred-hour game
across three generations that is the single most repeated moment there is.

*** AND THE SOUND FOR IT ALREADY EXISTS AND IS ALREADY WIRED, TO THE OTHER DOOR
INTO THE SAME ROOM. *** `sleep_sink` ("YOU SLEEP") is 5 of 5, his cleanest
sweep, and on 8/22 this lane wired it to the SLEEP BUTTON: you decide to turn
in, and it lands on the tap. But the day loop's own header says there are two
doors, not one:

    "it wakes you at 06:00, spends your sixteen hours, and ENDS THE DAY AT
     NIGHTFALL 22:00 WHETHER YOU LIKE IT OR NOT"

The door you choose has a sound. The door that closes on you does not -- and
that is the more dramatic of the two, because it is what happens when you lose
track of the light.

THE WIRE GOES WHERE THE TWO PATHS ARE ALREADY SEPARATE, which is the whole
reason this is safe. `advance()` detects the clock-driven ending:

    if(was==='awake' && DAY.phase==='ended') onNightfall();

The sleep BUTTON does not go through advance() at all -- it calls DAY.sleep(),
daySync() and onNightfall() directly, after posting its own sleep_sink. So the
sound goes on the advance() branch and CANNOT double up on the button. Putting
it inside onNightfall() instead would have played two sounds on one tap, which
is exactly the complaint of 8/4 that the UI policy in this same file exists to
prevent.

*** AND ONE THING I ALMOST REPORTED AND DID NOT. *** The same measurement said
waking up makes no sound either. It does: `come_up` (4 of 5) fires when the
morning card is dismissed, wired 8/22. My probe called DAY.wake() directly and
skipped the card, so the silence was MY INSTRUMENT SKIPPING THE UI, not the
game. Checked before writing it down.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new event. It is
one approved sound, already in the bank and already wired to the other way into
the same state, reaching the door it never covered.

  python3 tools/bohemia_the_day_ends_on_you.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_DAY_ENDS_ON_YOU__'

ANCHOR = "  if(was==='awake'&&DAY.phase==='ended') onNightfall();"
REPLACE = """  if(was==='awake'&&DAY.phase==='ended'){
    /* __THE_DAY_ENDS_ON_YOU__ (9/5, SOUNDS lane) -- THE DOOR THAT CLOSES ON YOU.
       MEASURED: driving the clock from 06:00 to nightfall on the real surface
       produced NOT ONE SOUND, and in a hundred-hour game over three generations
       the end of a day is the most repeated moment there is.
       THE SOUND ALREADY EXISTS AND WAS ALREADY WIRED TO THE OTHER DOOR.
       sleep_sink is 5 of 5, his cleanest sweep, and on 8/22 it went on the SLEEP
       BUTTON -- you decide to turn in. But the day loop has two doors and says
       so in its own header: it "ends the day at NIGHTFALL 22:00 WHETHER YOU LIKE
       IT OR NOT". Choosing had a sound; running out of light did not.
       IT GOES HERE AND NOT IN onNightfall() BECAUSE THIS BRANCH IS THE CLOCK'S
       ALONE. The button calls DAY.sleep(), daySync() and onNightfall() directly
       and never touches advance(), so it cannot double -- and two sounds on one
       tap is the 8/4 complaint the UI policy in this same file exists to stop.
       BEFORE onNightfall(), so it lands with the light going rather than after
       the reckoning has been totted up. */
    try{ if(window.parent&&window.parent!==window)
      window.parent.postMessage({bohemiaCitySfx:{ev:'sleep_sink'}},'*'); }catch(_e){}
    onNightfall();
  }"""


def main():
    print('=== THE DAY ENDS ON YOU ===')
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0
    if src.count(ANCHOR) != 1:
        print('FAIL: the clock-driven nightfall branch is not unique (%d)'
              % src.count(ANCHOR))
        return 1
    # POSITIVE CONTROL ON THE PREMISE: the button path must already have its own
    # sleep_sink, or this is not "the other door", it is the only one.
    if "bohemiaCitySfx:{ev:'sleep_sink'}" not in src:
        print('FAIL: the sleep BUTTON does not post sleep_sink, so the premise '
              'of this wire -- that one door already has the sound -- is false')
        return 1
    src = src.replace(ANCHOR, REPLACE, 1)
    open(CITY, 'w', encoding='utf8').write(src)
    print('  WIRED  the day running out of light now sounds like the day ending')
    print('  and it cannot double with the sleep button: that path never calls '
          'advance()')
    return 0


if __name__ == '__main__':
    sys.exit(main())
