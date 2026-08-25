#!/usr/bin/env python3
"""BOHEMIA PEOPLE RESYNC -- put the CURRENT identity module into the frames that
inline it, and nothing else.

WHY THIS EXISTS, AND IT IS A HOLE I FELL IN RATHER THAN A TIDY-UP.
slices/BOHEMIA_CITY_WORLD.html carries engine/bohemia_people.js inlined between
two markers. That copy was 47,907 bytes while the engine's was 81,931: it had
the 8/12 bark table and the 8/13 ledger bits, and NOTHING newer. The city is the
surface Paolo walks up to somebody on -- the card, the talk button, the name he
has to ask for -- so an identity change that does not reach that block does not
reach him at all, however green the engine's own gate is.

AND THERE WAS NO WAY TO REFRESH IT. tools/bohemia_city_talk_patch.py inlines the
module, but it regenerates the whole CITY TALK surface from an 8/3 constant, and
that surface has grown 3,400 lines since. It correctly REFUSES to run rather
than delete another lane's work -- a good guard rail that left the module block
with no maintainer. ENGINE SYNC LAW says one canonical body per module; the sync
gate keys on `const BOH_*` declarations and this module is an IIFE, so it has
never been watched either.

WHAT THIS DOES: replaces ONLY the bytes between the two module markers, in every
frame that has them, with the current engine/bohemia_people.js. It touches
nothing else in the file, so the CITY TALK surface, the cardfits work, the
memory patch and everything else another lane has built on top is untouched.

  python3 tools/bohemia_people_resync.py

Gate: gates/language_gate.js asserts every inlined copy carries the current
module's machinery, so this drifting again is a red rather than a silence.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

MODULE = 'engine/bohemia_people.js'

# frame -> (start marker, end marker). Bounded blocks only: this tool refuses to
# guess where a module starts, because a wrong guess here eats somebody's work.
FRAMES = [
    ('slices/BOHEMIA_CITY_WORLD.html',
     '/* ==== engine/bohemia_people.js (CITY TALK, 8/3) ==== */',
     '/* ==== /engine/bohemia_people.js (CITY TALK) ==== */'),
]


def main():
    src = open(MODULE, encoding='utf-8').read().strip()
    touched = 0
    for path, start, end in FRAMES:
        if not os.path.exists(path):
            print('  skip (absent) ' + path)
            continue
        html = open(path, encoding='utf-8').read()
        if html.count(start) != 1 or html.count(end) != 1:
            sys.exit('FAILED: %s has %d start and %d end markers, expected 1 and 1.\n'
                     'Refusing to guess where the module is.'
                     % (path, html.count(start), html.count(end)))
        a = html.index(start) + len(start)
        b = html.index(end)
        if b < a:
            sys.exit('FAILED: %s has the end marker before the start marker.' % path)
        was = len(html[a:b].strip())
        if html[a:b].strip() == src:
            print('  already current  ' + path)
            continue
        html = html[:a] + '\n' + src + '\n' + html[b:]
        open(path, 'w', encoding='utf-8').write(html)
        touched += 1
        print('  resynced  %s  (%d -> %d bytes of module)' % (path, was, len(src)))
    print('PEOPLE RESYNC: %d frame(s) updated, module is %d bytes' % (touched, len(src)))


if __name__ == '__main__':
    main()
