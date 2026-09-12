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
# EVERY MODULE THAT RIDES THIS SPLICE, in the order it lands on the page. Each
# one reads only modules the city already carries, and each has to land OUTSIDE
# every module body for the same reason work does (see the banner note above).
# This was six copy-pasted pairs of constants and six copy-pasted read-and-check
# blocks; a seventh would have been the seventh place to make the same typo.
#   [a days work]     work        reads bohemia_economy.js
#   [parties move]    parties     reads bohemia_towns.js, bohemia_between.js
#   [batteries mined] powerbuild  reads bohemia_purse.js, bohemia_cityedit.js
#   [century stayed]  stayed      reads bohemia_century.js, bohemia_family.js
#   [own power]       ownpower    reads bohemia_powerbuild.js, bohemia_towns.js
#   [rice clock]      hunger      reads bohemia_purse.js
#   [debt carried]    owing       reads bohemia_fold.js -- AT CALL TIME, never at
#                                 load, which is why it may land above it
RIDERS = [
    ('bohemia_work.js', 'the work module'),
    ('bohemia_parties.js', 'the parties module'),
    ('bohemia_powerbuild.js', 'the power buildings module'),
    ('bohemia_stayed.js', 'the stayed module'),
    ('bohemia_ownpower.js', 'the own power module'),
    ('bohemia_hunger.js', 'the hunger module'),
    ('bohemia_owing.js', 'the owing module'),
]


def marks(fname):
    return ('/* ==== engine/%s ==== */' % fname,
            '/* ==== /engine/%s ==== */' % fname)


# The economy's banner: bohemia_work.js reads YIELD off that module, so landing
# beside it keeps the two things a reader has to hold together in one place.
ANCHOR = '/* ==== engine/bohemia_economy.js ==== */'


def main():
    paths = [os.path.join(ROOT, 'engine', f) for f, _ in RIDERS]
    for p in [CITY] + paths:
        if not os.path.exists(p):
            sys.exit('FAIL: %s not found' % p)

    s = open(CITY, encoding='utf8').read()
    before = s

    def cut(text, begin, end, label):
        i = text.find(begin)
        if i < 0:
            return text
        j = text.find(end, i)
        if j < 0:
            sys.exit('REFUSING TO WRITE: %s has an opening marker and no closing one. '
                     'Fix the page by hand rather than letting this guess.' % label)
        k = j + len(end)
        if text[k:k + 1] == '\n':
            k += 1
        return text[:i] + text[k:]

    for fname, label in RIDERS:
        begin, end = marks(fname)
        s = cut(s, begin, end, label)

    if s.count(ANCHOR) != 1:
        sys.exit('REFUSING TO WRITE: the anchor resolves %d times, not 1.' % s.count(ANCHOR))

    block = ''
    for (fname, label), path in zip(RIDERS, paths):
        begin, end = marks(fname)
        body = open(path, encoding='utf8').read().rstrip('\n')
        if '</' in body:
            sys.exit('REFUSING TO WRITE: %s contains a sequence that would close '
                     'the script tag.' % label)
        block += begin + '\n' + body + '\n' + end + '\n'
    block += '\n'
    s = s.replace(ANCHOR, block + ANCHOR, 1)

    if s == before:
        print('  -> nothing to do')
        return
    open(CITY, 'w', encoding='utf8').write(s)
    print('CITY WORK: %d modules inlined before the economy module'
          % len(RIDERS))
    print('  ' + ', '.join(f.replace('bohemia_', '').replace('.js', '')
                           for f, _ in RIDERS))
    print('  city : %.1f MB' % (len(s) / 1e6))


if __name__ == '__main__':
    main()
