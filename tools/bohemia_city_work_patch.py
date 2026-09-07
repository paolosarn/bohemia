#!/usr/bin/env python3
"""BOHEMIA CITY WORK -- put the player's working day on the surface he walks.

[a days work] needs engine/bohemia_work.js on the walked surface. This splices it
in, and it is RE-RUNNABLE: edit the module and run this again and the page catches
up. (bohemia_city_module_resync.py takes over once the body is in git history --
it finds a module's old body by asking git what the file used to be, which a
brand-new module has no history for, so the FIRST insertion is this tool's job.)

*** THE ANCHOR IS A MODULE BANNER, NOT A LINE INSIDE A MODULE BODY. ***
Learned the expensive way by the towns patcher (9/5): it first anchored on a line
inside bohemia_cityedit.js's canonical body, and the next module resync found that
body as a substring, replaced it, and swallowed the spliced block whole -- leaving
an unbalanced brace and a dead script, with every global in the city reading
`undefined`. Anchoring on the BANNER of an existing module puts the new block
outside every module body, where nothing can eat it.

  python3 tools/bohemia_city_work_patch.py
Gate: gates/a_days_work_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MODULE = os.path.join(ROOT, 'engine', 'bohemia_work.js')

BEGIN = '/* ==== engine/bohemia_work.js ==== */'
END = '/* ==== /engine/bohemia_work.js ==== */'
# The economy's banner: bohemia_work.js reads YIELD off that module, so landing
# beside it keeps the two things a reader has to hold together in one place.
ANCHOR = '/* ==== engine/bohemia_economy.js ==== */'


def main():
    for p in (CITY, MODULE):
        if not os.path.exists(p):
            sys.exit('FAIL: %s not found' % p)

    s = open(CITY, encoding='utf8').read()
    before = s

    i = s.find(BEGIN)
    if i >= 0:
        j = s.find(END, i)
        if j < 0:
            sys.exit('REFUSING TO WRITE: the work module has an opening marker and no '
                     'closing one. Fix the page by hand rather than letting this guess.')
        k = j + len(END)
        if s[k:k + 1] == '\n':
            k += 1
        s = s[:i] + s[k:]

    if s.count(ANCHOR) != 1:
        sys.exit('REFUSING TO WRITE: the anchor resolves %d times, not 1.' % s.count(ANCHOR))

    mod = open(MODULE, encoding='utf8').read().rstrip('\n')
    if '</' in mod:
        sys.exit('REFUSING TO WRITE: the module contains a sequence that would close '
                 'the script tag.')

    block = BEGIN + '\n' + mod + '\n' + END + '\n\n'
    s = s.replace(ANCHOR, block + ANCHOR, 1)

    if s == before:
        print('  -> nothing to do')
        return
    open(CITY, 'w', encoding='utf8').write(s)
    print('CITY WORK: engine/bohemia_work.js inlined before the economy module')
    print('  city : %.1f MB' % (len(s) / 1e6))


if __name__ == '__main__':
    main()
