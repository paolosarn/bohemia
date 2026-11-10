#!/usr/bin/env python3
"""WORLD THIRTEEN 11/10 (rule 429(g)): put engine/bohemia_overmap.js into the map page WHOLE, word for word.

11/7 the page carried the generator from before the pocket-track fix because a hand replace moved only part of it; the map joins
gate compared the first and last few thousand characters and passed it. This replaces everything between the page's
'/* ==== engine/bohemia_overmap.js ==== */' banner and the generator's own closing line with the engine file, and
gates/the_valley_has_its_zones_gate.js Z5 holds the whole of it.

  python3 tools/bohemia_world_thirteen_inline_generator.py [--check]
"""
import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
ENG = os.path.join(ROOT, 'engine', 'bohemia_overmap.js')
BANNER = '/* ==== engine/bohemia_overmap.js ==== */'
HEAD = '/* =====================================================================\n   BOHEMIA OVERMAP'
TAIL = "})(typeof window!=='undefined'?window:globalThis);"

def inlined(page, eng):
    i = page.index(BANNER)
    a = page.index(HEAD, i)
    b = page.index(TAIL, a) + len(TAIL)
    return page[:a] + eng.strip() + page[b:]

if __name__ == '__main__':
    page = open(PAGE).read(); eng = open(ENG).read()
    nxt = inlined(page, eng)
    if '--check' in sys.argv:
        print('in step' if nxt == page else 'OUT OF STEP'); sys.exit(0 if nxt == page else 1)
    if nxt != page: open(PAGE, 'w').write(nxt)
    print('already in step' if nxt == page else 'written', '(verbatim:', eng.strip() in nxt, ')')
