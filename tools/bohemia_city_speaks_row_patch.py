#!/usr/bin/env python3
"""BOHEMIA CITY SPEAKS ROW (8/25/26, PEOPLE lane) -- what somebody speaks was on
the engine's card and NOT on the card he actually opens.

THEY SPEAK SPANGLISH (Paolo 8/25, LOCKED) shipped this morning with a SPEAKS row
on BohemiaPeople.cardFor(). The walked city does not call cardFor. It builds its
person card ROW BY ROW -- organ_reach_gate has said so in writing for days ("the
city builds its person card row by row rather than calling this") -- so the row
existed in a function nobody on that surface runs.

MEASURED, INSIDE THE ALPHA, THE WAY A FRIEND WILL PLAY IT: tap the splash,
decline the opening, get up, stand next to the neighbour, tap the one button.
The card that came back said:

    NAME / LIVES / RIGHT NOW / YOU HAVE MET / HOW YOU GET THE REST

No SPEAKS. His ruling reached the engine and stopped one frame short of him.

*** AND MY OWN GATE WAS DEFENDING IT. *** language_gate's section G claim, "the
card on the surface he taps says what they speak", called
BohemiaPeople.cardFor() from inside the city frame -- the ENGINE'S answer,
fetched through a side door, while the card on screen was built by other code
entirely. It was true, it was green, and it was about a different card. A
SIDE-DOOR PROBE IS A LIE (7/18). That claim now reads the real #ctcard text.

WHERE IT GOES AND WHY: straight after TRADE, before LIVES. What somebody speaks
is WHO THEY ARE, not what they do or where they sleep, so it belongs in the
identity block with the trade rather than down with the address.

WHAT IT DOES NOT DO: it never gates anything. The row is English on purpose
(LANGUAGE NEVER GATES REQUIRED INFORMATION) and language_gate sweeps it.

  python3 tools/bohemia_city_speaks_row_patch.py

Gate: gates/language_gate.js section G, reading the card that is on screen.
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_SPEAKS__'

ANCHOR = """  /* __CITY_MEMORY__ -- WHERE THEY LIVE, IN WORDS HE CAN ACT ON."""

ROW = """  /* __CITY_SPEAKS__ -- WHAT THEY SPEAK (8/25). THEY SPEAK SPANGLISH (Paolo
     8/25, LOCKED). This shipped on BohemiaPeople.cardFor() and this card does
     not call cardFor -- it builds itself row by row -- so his ruling reached
     the engine and stopped one frame short of the only surface he opens. Found
     by driving the talk loop inside the ALPHA rather than reading either file.
     IT SITS WITH THE TRADE, NOT WITH THE ADDRESS. What somebody speaks is who
     they are; where they sleep is not. And unlike NAME it needs no asking: you
     have been standing in front of them while they talk, which makes it the
     exact opposite of the row above it and the reason they belong together.
     ENGLISH, ALWAYS. The row is the game telling him a fact, so it is required
     information, so it is English whatever the person speaks. language_gate
     sweeps this string with the rest of them. */
  body+=ctRow('SPEAKS', BohemiaPeople.speaksLineOf(who));
"""


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        print('  already applied  ' + CITY)
        return
    if html.count(ANCHOR) != 1:
        sys.exit('FAILED: the LIVES row anchor resolves %d times in %s, expected 1.'
                 % (html.count(ANCHOR), CITY))
    html = html.replace(ANCHOR, ROW + ANCHOR, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (SPEAKS row, after TRADE)')


if __name__ == '__main__':
    main()
