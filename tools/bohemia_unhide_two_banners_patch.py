#!/usr/bin/env python3
"""
TWO MODULES WERE INLINED WHERE THE SYNC SWEEP CANNOT SEE THEM (8/21/26, RUN lane).

BANNER went red with: "NO NEW MODULE was inlined behind a banner the scanner
cannot read -- NEW AND HIDDEN: engine/bohemia_clout.js, engine/bohemia_deeds.js".

WHY THAT MATTERS, and it is not cosmetic. ENGINE SYNC LAW says one canonical
body per module, and the thing that KEEPS it true is
tools/bohemia_city_module_resync.py, which finds embedded modules by their
banner. A module the sweep cannot see is a module that can silently drift a week
behind its engine file with every gate still green -- which is exactly what
happened to the floorplan, the overmap and two others before it. A banner is not
a comment here; IT IS THE INDEX.

WHAT WAS THERE:

    /* ==== bohemia_clout.js + bohemia_deeds.js (HOW LOUD, inlined verbatim) ==== */

Two modules named on ONE line, and no `engine/` prefix. The scanner's rule
(matched line for line against the resync tool's own) accepts exactly:

    /* ==== engine/<name> ... ==== */

so it read this as zero modules. The bodies are both present and both VERBATIM
-- measured: bohemia_clout.js is 3,874 bytes at 1,918,338 and bohemia_deeds.js
is 13,800 bytes immediately after it -- so nothing is stale today. It was one
edit away from being able to go stale invisibly.

THE FIX IS COMMENTS ONLY. One banner per module, in the scanner's format, at the
real boundary between the two bodies. NOT ONE BYTE OF EITHER MODULE MOVES, and
the tool asserts that: both canon bodies must still be present verbatim
afterwards, and the file must grow by exactly the length of the banner text it
added. A "fix" to a sync-law tool that quietly edited a module body would be
considerably worse than the hole it closed.

Idempotent.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MODS = ('engine/bohemia_clout.js', 'engine/bohemia_deeds.js')

OLD = '/* ==== bohemia_clout.js + bohemia_deeds.js (HOW LOUD, inlined verbatim) ==== */'
NEW = '/* ==== engine/bohemia_clout.js (HOW LOUD, inlined verbatim) ==== */'
MID = '\n/* ==== engine/bohemia_deeds.js (HOW LOUD, inlined verbatim) ==== */\n'


def main():
    for p in (CITY,) + MODS:
        if not os.path.exists(p):
            sys.exit('FAIL: ' + p + ' not found')
    city = open(CITY, encoding='utf8').read()
    bodies = {m: open(m, encoding='utf8').read() for m in MODS}

    if 'engine/bohemia_deeds.js (HOW LOUD' in city:
        print('NOOP: both banners are already visible to the sweep')
        return
    if OLD not in city:
        sys.exit('FAIL: the combined banner is not where it was:\n  ' + OLD)

    before = len(city)
    out = city.replace(OLD, NEW, 1)

    # the deeds banner goes at the REAL boundary: immediately before its body
    di = out.find(bodies['engine/bohemia_deeds.js'])
    if di < 0:
        sys.exit('FAIL: bohemia_deeds.js is not inlined verbatim; refusing to guess')
    out = out[:di] + MID.lstrip('\n') + out[di:]

    # NOT ONE BYTE OF EITHER MODULE MOVES, and this proves it rather than saying it
    for m, b in bodies.items():
        if b not in out:
            sys.exit('FAIL: %s stopped being verbatim -- refusing to write' % m)
    grew = len(out) - before
    want = (len(NEW) - len(OLD)) + len(MID.lstrip('\n'))
    if grew != want:
        sys.exit('FAIL: the file grew by %d bytes, expected %d -- something other '
                 'than the banners changed' % (grew, want))

    open(CITY, 'w', encoding='utf8').write(out)
    print('PATCHED %s -- both modules are visible to the sync sweep now (+%d bytes, '
          'comments only)' % (CITY, grew))


if __name__ == '__main__':
    main()
