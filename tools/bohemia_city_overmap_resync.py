#!/usr/bin/env python3
"""
BOHEMIA CITY OVERMAP RESYNC (7/20/26, LIFE+CITY-SURFACE session) - marry the
real city builder to the canon streets.

THE FINDING (recon 7/20): the alpha's embedded city builder (CITY_B64, the
previous build's streaming Las Vegas) carries its OWN copy of the overmap
generator - a STALE FORK from the 7/5 era. It has the freeway sweep but NONE
of the 7/18 street canon (per-strip collectors, STREET ISLAND PRUNE, GRID
RE-ASSERT), so the city Paolo walks still rerolls the fragmented streets he
killed. A second body of a module, hidden inside base64 where the sync gate
could not see it: exactly the rot the ENGINE SYNC LAW exists for.

THE MARRIAGE IS A MODULE RESYNC, verified drop-in safe before writing:
  - identical API line (11 exports, byte-equal)
  - identical DISTRICT enum (77 = 77, zero drift)
  - identical IIFE wrapper ((function(global){ ... })(...globalThis);)
  - every om.* field the page reads (layout/at/seed/n/under) exists in canon

This tool decodes CITY_B64, replaces the embedded overmap module region with
the CANON body VERBATIM (engine/bohemia_overmap.js, byte-for-byte, so the
gate can lock it), re-encodes, and patches the alpha in place. Idempotent:
run it again whenever the overworld session evolves the canon streets
(city_tab_gate goes red until you do).

SAVE NOTE: suspend saves carry a seed; same seed now lays CANON streets, so
a save made on fork streets may resume with the world truthfully re-laid
around the player. Bohemia's law is that the world never resets - but the
streets becoming canon is the world being REPAIRED, not reset. Flagged in
the handoff.

  python3 tools/bohemia_city_overmap_resync.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
CANON = 'engine/bohemia_overmap.js'

# ---- 8/15/26: THIS TOOL HAD BEEN DEAD SINCE 8/2 AND NOTHING SAID SO -------------------
# It hard-coded ALPHA and the CITY_B64 key. THE CITY MOVED OUT OF THE ALPHA on 8/2 (the
# payload-wall pass), so `alpha.index(key)` has raised ValueError on every run since --
# overmap's only keeper, crashing on line one, for two weeks.
# AND THE GENERIC SWEEP COULD NOT COVER FOR IT: the embedded overmap's banner reads
# "/* ============ overmap engine (inlined) ============ */", which is not the shape
# tools/bohemia_city_module_resync.py looks for, so overmap was invisible to that too.
# NO SYNC PROTECTION AT ALL. It happens to be byte-identical to canon today, and that is
# luck, not process -- this is the module whose whole reason for existing is that a STALE
# FORK of it was found hiding inside base64.
# A BROKEN KEEPER IS WORSE THAN NO KEEPER, because it reads as coverage. So: find the page
# the same way the working sweep finds it, and NORMALISE the banner on the way through so
# the generic sweep sees it too. Derive, never hard-code -- the same lesson as the payday
# block's markers the same day.
CITY_FILES = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html']
BANNER = '/* ==== engine/bohemia_overmap.js ==== */'
OLD_BANNERS = ['/* ============ overmap engine (inlined) ============ */']


def find_page():
    """The page the city actually lives in, chosen the way the generic resync chooses it."""
    for c in CITY_FILES:
        if not os.path.exists(c):
            continue
        t = open(c, encoding='utf8').read()
        if "const CITY_B64='" in t or 'function renderCity(){' in t:
            return c, t
    return None, None


WRAP_OPEN = '(function(global){'
WRAP_CLOSE = "})(typeof window!=='undefined'?window:globalThis);"

canon = open(CANON, encoding='utf8').read()
c0 = canon.index(WRAP_OPEN)
c1 = canon.index(WRAP_CLOSE) + len(WRAP_CLOSE)
canon_module = canon[c0:c1]
assert 'buildOvermap' in canon_module and 'global.BohemiaOvermap=API' in canon_module
assert 'ISLAND PRUNE' in canon_module, 'canon body missing the 7/18 street fixes?'

PAGE, raw = find_page()
if PAGE is None:
    sys.exit('OVERMAP RESYNC: no page carries the city. Refusing to guess which file to write.')

# The city may be plain text in its own page, or still base64 inside the alpha. Handle both
# rather than assuming, which is the assumption that killed this tool on 8/2.
KEY = "const CITY_B64='"
ENCODED = KEY in raw
if ENCODED:
    a0 = raw.index(KEY) + len(KEY)
    a1 = raw.index("'", a0)
    decoded = base64.b64decode(raw[a0:a1]).decode('utf8')
else:
    a0 = a1 = 0
    decoded = raw


def write_back(text):
    if ENCODED:
        re_enc = base64.b64encode(text.encode('utf8')).decode('ascii')
        open(PAGE, 'w', encoding='utf8').write(raw[:a0] + re_enc + raw[a1:])
    else:
        open(PAGE, 'w', encoding='utf8').write(text)


def normalise_banner(text):
    """Give the embedded overmap the banner shape the GENERIC sweep can see.

    Without this, overmap is invisible to tools/bohemia_city_module_resync.py, so the only
    thing standing between it and drift is this file -- and this file was dead for two
    weeks. Two keepers is not redundancy here, it is the difference between a module that
    is watched and one that merely looks watched."""
    for ob in OLD_BANNERS:
        if ob in text:
            return text.replace(ob, BANNER, 1), True
    if BANNER in text:
        return text, False
    d = text.find(WRAP_OPEN)
    if d < 0:
        return text, False
    return text[:d] + BANNER + '\n' + text[d:], True


married = False
if canon_module in decoded:
    print('already married: the embedded city carries the canon overmap.')
else:
    d0 = decoded.index(WRAP_OPEN)
    d1 = decoded.index(WRAP_CLOSE, d0) + len(WRAP_CLOSE)
    old_module = decoded[d0:d1]
    assert 'buildOvermap' in old_module and 'global.BohemiaOvermap=API' in old_module, \
        'the first IIFE in the city page is not the overmap module - refusing'
    decoded = decoded[:d0] + canon_module + decoded[d1:]
    married = True
    print('married: embedded overmap fork (%d KB) -> canon body (%d KB)' %
          (len(old_module) // 1024, len(canon_module) // 1024))

decoded, bannered = normalise_banner(decoded)
if married or bannered:
    write_back(decoded)

print('page: %s (%s), %d KB' % (PAGE, 'base64 payload' if ENCODED else 'plain', len(decoded) // 1024))
print('banner %s -- overmap is %s to the generic sync sweep'
      % ('NORMALISED' if bannered else 'already standard',
         'visible' if (bannered or BANNER in decoded) else 'STILL INVISIBLE'))
