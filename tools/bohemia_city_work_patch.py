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
PARTIES = os.path.join(ROOT, 'engine', 'bohemia_parties.js')
POWERB = os.path.join(ROOT, 'engine', 'bohemia_powerbuild.js')
STAYED = os.path.join(ROOT, 'engine', 'bohemia_stayed.js')
OWNPOW = os.path.join(ROOT, 'engine', 'bohemia_ownpower.js')
HUNGER = os.path.join(ROOT, 'engine', 'bohemia_hunger.js')

BEGIN = '/* ==== engine/bohemia_work.js ==== */'
END = '/* ==== /engine/bohemia_work.js ==== */'
# [parties move] rides the same splice: it reads bohemia_towns.js and
# bohemia_between.js, both of which the city already carries, and it has to land
# outside every module body for the same reason work does.
P_BEGIN = '/* ==== engine/bohemia_parties.js ==== */'
P_END = '/* ==== /engine/bohemia_parties.js ==== */'
# [batteries mined] rides the same splice: it reads bohemia_purse.js and
# bohemia_cityedit.js, both already in the city, and must land outside every
# module body for the same reason the other two do.
B_BEGIN = '/* ==== engine/bohemia_powerbuild.js ==== */'
B_END = '/* ==== /engine/bohemia_powerbuild.js ==== */'
# [century stayed] rides the same splice: it reads bohemia_century.js and
# bohemia_family.js, both already in the city, and must land outside every
# module body for the same reason the others do.
S_BEGIN = '/* ==== engine/bohemia_stayed.js ==== */'
S_END = '/* ==== /engine/bohemia_stayed.js ==== */'
# [own power] rides the same splice: it reads bohemia_powerbuild.js and
# bohemia_towns.js, both already in the city, and must land outside every
# module body for the same reason the others do.
O_BEGIN = '/* ==== engine/bohemia_ownpower.js ==== */'
O_END = '/* ==== /engine/bohemia_ownpower.js ==== */'
# [rice clock] rides the same splice: it reads bohemia_purse.js, already in the
# city, and must land outside every module body for the same reason the rest do.
H_BEGIN = '/* ==== engine/bohemia_hunger.js ==== */'
H_END = '/* ==== /engine/bohemia_hunger.js ==== */'
# The economy's banner: bohemia_work.js reads YIELD off that module, so landing
# beside it keeps the two things a reader has to hold together in one place.
ANCHOR = '/* ==== engine/bohemia_economy.js ==== */'


def main():
    for p in (CITY, MODULE, PARTIES, POWERB, STAYED, OWNPOW, HUNGER):
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

    s = cut(s, BEGIN, END, 'the work module')
    s = cut(s, P_BEGIN, P_END, 'the parties module')
    s = cut(s, B_BEGIN, B_END, 'the power buildings module')
    s = cut(s, S_BEGIN, S_END, 'the stayed module')
    s = cut(s, O_BEGIN, O_END, 'the own power module')
    s = cut(s, H_BEGIN, H_END, 'the hunger module')

    if s.count(ANCHOR) != 1:
        sys.exit('REFUSING TO WRITE: the anchor resolves %d times, not 1.' % s.count(ANCHOR))

    mod = open(MODULE, encoding='utf8').read().rstrip('\n')
    if '</' in mod:
        sys.exit('REFUSING TO WRITE: the module contains a sequence that would close '
                 'the script tag.')

    par = open(PARTIES, encoding='utf8').read().rstrip('\n')
    if '</' in par:
        sys.exit('REFUSING TO WRITE: the parties module contains a sequence that would '
                 'close the script tag.')

    pwr = open(POWERB, encoding='utf8').read().rstrip('\n')
    if '</' in pwr:
        sys.exit('REFUSING TO WRITE: the power buildings module contains a sequence '
                 'that would close the script tag.')

    sty = open(STAYED, encoding='utf8').read().rstrip('\n')
    if '</' in sty:
        sys.exit('REFUSING TO WRITE: the stayed module contains a sequence that would '
                 'close the script tag.')

    own = open(OWNPOW, encoding='utf8').read().rstrip('\n')
    if '</' in own:
        sys.exit('REFUSING TO WRITE: the own power module contains a sequence that '
                 'would close the script tag.')

    hun = open(HUNGER, encoding='utf8').read().rstrip('\n')
    if '</' in hun:
        sys.exit('REFUSING TO WRITE: the hunger module contains a sequence that would '
                 'close the script tag.')

    block = (BEGIN + '\n' + mod + '\n' + END + '\n'
             + P_BEGIN + '\n' + par + '\n' + P_END + '\n'
             + B_BEGIN + '\n' + pwr + '\n' + B_END + '\n'
             + S_BEGIN + '\n' + sty + '\n' + S_END + '\n'
             + O_BEGIN + '\n' + own + '\n' + O_END + '\n'
             + H_BEGIN + '\n' + hun + '\n' + H_END + '\n\n')
    s = s.replace(ANCHOR, block + ANCHOR, 1)

    if s == before:
        print('  -> nothing to do')
        return
    open(CITY, 'w', encoding='utf8').write(s)
    print('CITY WORK: work + parties + powerbuild + stayed + ownpower + hunger inlined before the economy module')
    print('  city : %.1f MB' % (len(s) / 1e6))


if __name__ == '__main__':
    main()
