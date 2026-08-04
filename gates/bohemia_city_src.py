#!/usr/bin/env python3
"""BOHEMIA — WHERE THE CITY LIVES, IN ONE PLACE (8/4/26). Python twin of
gates/bohemia_city_src.js; the full story is in that file's header.

The short version: until 8/4 the walked world was a 35.76 MB base64 constant
inside the alpha (CITY_B64). The CITY lane extracted it to
slices/BOHEMIA_CITY_WORLD.html so the alpha opens 29x faster, and nineteen
gates that hunted for that constant went red at once - for a reason that had
nothing to do with anybody's code. When a third of the suite is red like that,
red stops meaning anything, which is the real damage.

One answer to "where is the city", asked by every gate. Next time the world
moves, one edit here.

    from bohemia_city_src import city_src
    frame = city_src()                 # the city's HTML source, as a string
    frame = city_src(optional=True)    # None instead of raising

Reads only. Owns nothing. Decides nothing.
"""
import base64
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STANDALONE = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')


def _from_alpha(alpha):
    """the old inline form, kept so an older checkout still measures. BY INDEX,
    never a regex: the alpha was 42 MB and a big quantifier over it is a
    stack-blower (learned 7/31)."""
    key = "CITY_B64"
    ci = alpha.find(key)
    while ci >= 0:
        tail = alpha[ci + 8:ci + 20]
        eq = tail.find('=')
        if eq >= 0:
            rest = tail[eq:]
            qi = -1
            for i, ch in enumerate(rest):
                if ch in "'\"`":
                    qi = i
                    break
            if qi >= 0:
                start = ci + 8 + eq + qi + 1
                end = alpha.find(alpha[start - 1], start)
                if end - start >= 100000:
                    return base64.b64decode(alpha[start:end]).decode('utf8', 'replace')
        ci = alpha.find(key, ci + 1)
    return None


def city_src(alpha_text=None, optional=False):
    if os.path.exists(STANDALONE):
        with open(STANDALONE, encoding='utf8', errors='replace') as f:
            s = f.read()
        if len(s) > 100000:
            return s
    alpha = alpha_text
    if alpha is None and os.path.exists(ALPHA):
        with open(ALPHA, encoding='utf8', errors='replace') as f:
            alpha = f.read()
    inline = _from_alpha(alpha) if alpha else None
    if inline:
        return inline
    if optional:
        return None
    raise RuntimeError(
        'the walked city could not be found. Looked for '
        'slices/BOHEMIA_CITY_WORLD.html and for an inline CITY_B64 in the alpha. '
        'If the world moved again, gates/bohemia_city_src.py is the ONE place to '
        'teach it the new address.')


def where():
    return STANDALONE if os.path.exists(STANDALONE) else ALPHA + ' (inline CITY_B64)'
