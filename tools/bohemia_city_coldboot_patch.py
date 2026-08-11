#!/usr/bin/env python3
"""
THE GAME HUNG FOR SIXTEEN SECONDS ON A BAD SIGNAL (8/11/26).

FOUND BY ACCIDENT, WHICH IS THE ONLY HONEST WAY TO SAY IT. Driving the alpha's
RUN tab for the day-loop gate, the city frame took ~15s to become playable. I
wrote that down as a streaming problem and moved on. Then I measured it properly
instead of believing it:

    city, network normal (this sandbox is offline)   16.0s to world-ready
    city, every http(s) request aborted instantly     3.1s to world-ready

The world was never slow. The page was WAITING ON A FONT.

    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk..."
          rel="stylesheet">

A stylesheet <link> is render-blocking AND blocks execution of the scripts after
it. When the host is unreachable the parser sits there until the connection times
out -- thirteen seconds of nothing, on a game that is otherwise up in three.

WHY THIS IS A DEMO DEFECT AND NOT A SANDBOX CURIOSITY. Paolo demos on an iPhone.
An iPhone on cellular, on a hotel network, in a basement, on a plane, or on a
captive-portal wifi is EXACTLY the "host unreachable" case, and it is the case
where a first impression is made. Sixteen seconds of white screen reads as
broken. And the fallback was always fine: the CSS already says
`'Space Grotesk', system-ui, sans-serif`, so with no network the game renders in
the system face and loses nothing but a typeface.

THE FIX, which is the standard one and costs nothing when the network IS good:

    <link rel="stylesheet" media="print" onload="this.media='all'" href=...>

`media="print"` makes the fetch non-render-blocking, and the onload swaps it to
`all` the moment it actually arrives. Good network: the font still shows up,
imperceptibly later. Dead network: the game starts in 3 seconds in the system
face instead of hanging for sixteen. A <noscript> copy keeps the plain behaviour
for a scripting-off browser.

WHAT THIS ALSO EXPLAINS, and it is the bigger half. FIVE browser gates were red
with `ReferenceError: om is not defined` -- three of them ALREADY red on
origin/main before this session touched anything. Every one samples the city
frame at a FIXED offset (waitForTimeout(3000)) and then reads its globals. They
were not testing the build, they were racing a sixteen-second boot and losing.
Those gates are being fixed to wait on the CONDITION separately; this removes the
sixteen seconds that made the race unwinnable.

REUSE CHECK: cooks no graphic pixels of any kind. It moves one <link> attribute;
it opens no bank because nothing is drawn.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__COLD_BOOT__'

OLD = ('<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700'
       '&display=swap" rel="stylesheet">')

NEW = ('<!-- ' + MARKER + ' -- THE FONT NO LONGER HOLDS THE GAME HOSTAGE (8/11/26).\n'
       '     Measured: with this link render-blocking and the host unreachable, the city\n'
       '     took 16.0s to become playable. With requests failing fast: 3.1s. The\n'
       '     thirteen seconds were a connection timeout, not the world. Paolo demos on a\n'
       '     phone, and a phone on cellular or a captive-portal wifi IS the unreachable\n'
       '     case. media="print" makes the fetch non-blocking; onload swaps it in the\n'
       '     moment it lands, so a good network still gets the typeface. A dead one gets\n'
       '     the game, in system-ui, which the CSS already falls back to anyway. -->\n'
       '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700'
       '&display=swap" rel="stylesheet" media="print" onload="this.media=\'all\'">\n'
       '<noscript><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:'
       'wght@400;500;700&display=swap" rel="stylesheet"></noscript>')


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: the blocking font link was not found in ' + CITY)
    open(CITY, 'w', encoding='utf-8').write(s.replace(OLD, NEW, 1))
    print('PATCHED ' + CITY)


if __name__ == '__main__':
    main()
