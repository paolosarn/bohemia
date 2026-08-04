#!/usr/bin/env python3
"""
WHERE THE CITY APP IS — the one resolver, python twin, 8/4/26 (WORLD lane).

The JS side is gates/bohemia_city_app.js and the reasoning is written out in full
there. The short version:

    Twenty-one gates and tools each hand-wrote the same two facts that were never
    theirs to know -- WHERE the city renderer lives and WHAT SHAPE it is in. On
    8/2 the payload-wall pass legitimately moved it out of the alpha into
    slices/BOHEMIA_CITY_WORLD.html and stopped base64-ing it, and every one of
    those hand-written facts went stale in the same instant.

    A GATE THAT TESTS A LOCATION IS NOT A GATE. It fails when somebody
    legitimately moves a file, and its red says nothing about the thing it exists
    to protect. Worse, it can go GREEN-and-silent: a tool that "could not find the
    blob" and therefore did nothing.

USE IT LIKE THIS, and never write a city path or regex again:

    sys.path.insert(0, os.path.join(ROOT, 'gates'))
    import bohemia_city_app as CITY
    app = CITY.read()                 # (src, file, inline) or None
    check('the city app is findable', app is not None)

Adding a new home is one line in FILES. Adding a new shape is one clause in read().
"""
import base64
import os
import re
from collections import namedtuple

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'

# preference order: the standalone page first (where it lives today), the alpha
# second (where it lived until 8/2, and where a rollback would put it back).
FILES = [
    'slices/BOHEMIA_CITY_WORLD.html',
    'slices/BOHEMIA_ALPHA_0_9.html',
]

# the marker that says "this text IS the city renderer", whatever file it is in
# and however it got there. A body, not a location.
BODY = 'function renderCity('

CityApp = namedtuple('CityApp', 'src file inline')


def read():
    """Find the city renderer and hand back its SOURCE, or None."""
    for rel in FILES:
        abs_path = os.path.join(ROOT, rel)
        if not os.path.exists(abs_path):
            continue
        txt = open(abs_path, encoding='utf8').read()

        # SHAPE 1: base64'd into a string literal (the pre-8/2 arrangement)
        m = re.search(r"const CITY_B64\s*=\s*'([^']+)'", txt)
        if m:
            try:
                dec = base64.b64decode(m.group(1)).decode('utf8')
            except Exception:                                      # noqa: BLE001
                dec = ''
            if BODY in dec:
                return CityApp(dec, rel, False)

        # SHAPE 2: the page IS the renderer (the arrangement since 8/2)
        if BODY in txt:
            return CityApp(txt, rel, True)
    return None


def searched():
    """Every candidate home, for a failure message that names where it looked."""
    return list(FILES)
