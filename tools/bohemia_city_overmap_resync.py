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

WRAP_OPEN = '(function(global){'
WRAP_CLOSE = "})(typeof window!=='undefined'?window:globalThis);"

canon = open(CANON, encoding='utf8').read()
c0 = canon.index(WRAP_OPEN)
c1 = canon.index(WRAP_CLOSE) + len(WRAP_CLOSE)
canon_module = canon[c0:c1]
assert 'buildOvermap' in canon_module and 'global.BohemiaOvermap=API' in canon_module
assert 'ISLAND PRUNE' in canon_module, 'canon body missing the 7/18 street fixes?'

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
a0 = alpha.index(key) + len(key)
a1 = alpha.index("'", a0)
decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

if canon_module in decoded:
    print('already married: the embedded city carries the canon overmap. no-op.')
    sys.exit(0)

d0 = decoded.index(WRAP_OPEN)
d1 = decoded.index(WRAP_CLOSE, d0) + len(WRAP_CLOSE)
old_module = decoded[d0:d1]
assert 'buildOvermap' in old_module and 'global.BohemiaOvermap=API' in old_module, \
    'the first IIFE in the city page is not the overmap module - refusing'

merged = decoded[:d0] + canon_module + decoded[d1:]
reencoded = base64.b64encode(merged.encode('utf8')).decode('ascii')
open(ALPHA, 'w', encoding='utf8').write(alpha[:a0] + reencoded + alpha[a1:])

print('married: embedded overmap fork (%d KB) -> canon body (%d KB)' %
      (len(old_module) // 1024, len(canon_module) // 1024))
print('city page: %d KB decoded; alpha rewritten in place' % (len(merged) // 1024))
