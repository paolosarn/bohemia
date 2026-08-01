#!/usr/bin/env python3
"""BOHEMIA -- PERSONLOOK ENGINE SYNC (7/31/26). Idempotent.

ENGINE SYNC LAW: one canonical body per module. BOH_PERSONLOOK lives in
engine/bohemia_personlook.js and is INLINED into the ONE alpha, and the two
must be the same bytes.

WHY THIS IS A TOOL AND NOT A HAND EDIT. The first inline was done by hand, and
personlook_gate checked the copies matched by comparing the FIRST 400
CHARACTERS -- which is the module's header comment. So when the hash function
at the bottom of the file was fixed (plain FNV-1a was handing back correlated
dials; two of twelve crowd citizens came out with byte-identical bodies), the
engine module changed, the alpha kept the old broken copy, and the sync check
stayed green the whole time. A prefix comparison is not a comparison. This tool
replaces the whole inlined block from the module, every time, and the gate now
compares every byte.

REUSE CHECK: cooks no graphic pixels. It moves one existing JS module.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): this tool reads no rig data and writes no
rig data. It moves a text block. Its only rig contact is POSITIONAL -- it anchors
the inlined module immediately above BOH_BODYVAR, because that is the module the
dials are handed to and reading them in that order is the story: who this person
is, then how the body is warped to match.
  built on: BOH_BODYVAR
  joints: none named
  parts: none
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
MOD = ROOT / 'engine' / 'bohemia_personlook.js'
ALPHA = ROOT / 'slices' / 'BOHEMIA_ALPHA_0_9.html'

mod = MOD.read_text().strip()
src = ALPHA.read_text()

HEAD = '/* ==========================================================================='
TITLE = 'BOHEMIA — EVERY PERSON IS A DIFFERENT PERSON  (BOH_PERSONLOOK, 7/31/26)'
TAIL = "})(typeof window !== 'undefined' ? window : globalThis);"

t = src.find(TITLE)
if t < 0:
    # FIRST INLINE. It goes immediately above BOH_BODYVAR, because that is the
    # module it hands dial values to and reading them in that order is the whole
    # story: who this person is, then how the body is warped to match.
    NEIGHBOUR = '   BOHEMIA — BODY VARIATION DIALS (BOH_BODYVAR)'
    n = src.find(NEIGHBOUR)
    if n < 0:
        sys.exit('PERSONLOOK SYNC: BOH_BODYVAR not in the alpha -- nowhere to anchor')
    at = src.rfind(HEAD, 0, n)
    if at < 0:
        sys.exit('PERSONLOOK SYNC: could not find the start of the BOH_BODYVAR block')
    ALPHA.write_text(src[:at] + mod + '\n' + src[at:])
    print('PERSONLOOK SYNC: first inline, %d bytes above BOH_BODYVAR' % len(mod))
    sys.exit(0)
start = src.rfind(HEAD, 0, t)
end = src.find(TAIL, t)
if start < 0 or end < 0:
    sys.exit('PERSONLOOK SYNC: could not bound the inlined block')
end += len(TAIL)

if src[start:end] == mod:
    print('PERSONLOOK SYNC: already byte-identical, nothing to do')
else:
    ALPHA.write_text(src[:start] + mod + src[end:])
    print('PERSONLOOK SYNC: re-inlined %d bytes from engine/bohemia_personlook.js' % len(mod))
