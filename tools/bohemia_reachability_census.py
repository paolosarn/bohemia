#!/usr/bin/env python3
"""
THE REACHABILITY CENSUS (8/6/26) — how much of what we have BUILT can Paolo
actually reach?

WHY THIS EXISTS. Six times in three days this fleet discovered the same thing
the hard way, one instance at a time:

    7/31  his 348-sprite traffic signal bank had reached NOTHING for two weeks
    8/2   the identity card, the ask, the name over their head - all on a page
          the RUN tab does not show. "I couldn't find them."
    8/4   nineteen gates hunting a constant that had moved
    8/4   touch_guard_gate answering a missing payload with `continue` - GREEN
          while checking nothing
    8/4   five approved hairstyles no person in the valley could wear
    8/4   my own walk fix, shipped and correct, landing on the invisible file

That is not six bugs. It is ONE DISEASE: WORK LANDS SOMEWHERE HE CANNOT REACH,
AND THE MACHINE SAYS GREEN. Every instance was found by a human noticing, and
every one took a turn to chase. Nothing in the repo could answer the general
question, so the general question never got asked:

    OF EVERYTHING WE HAVE BUILT, WHAT REACHES THE SURFACE HE TAPS?

This answers it for the whole corpus at once, by bytes rather than by belief.

HOW IT DECIDES, AND WHY IT IS HARD TO FOOL. It does not look for names, and
that is deliberate: on 8/4 I searched the walked city for the RUN SLICE'S
function names, "found" five missing systems, and four were false alarms - they
were all present under their own spellings. NAMES ARE A LANE'S DIALECT. BYTES
ARE NOT. So every source is sampled for its own distinctive content - a base64
tile, a long literal, a rare token - and a source REACHES a surface when its own
bytes are found in that surface verbatim.

WHAT A "NO TRACE" HONESTLY MEANS, stated because a census that overclaims is
worse than none: no sampled bytes of this source appear verbatim in any surface.
That is strong evidence it does not ship, but it is not proof - a bank whose art
is TRANSFORMED before shipping (re-encoded, recoloured, re-tiled) will read as
NO TRACE while genuinely reaching him. Those cases are the interesting ones and
the report names every single source rather than only a count, so they can be
argued with instead of taken on faith.

THE THREE SURFACES, and the distinction is the whole point:

    SHOWN    slices/BOHEMIA_CITY_WORLD.html   the walked world - the RUN tab
             slices/BOHEMIA_ALPHA_0_9.html    the shell and every other tab
    LOADED   slices/BOHEMIA_RUN_CURRENT.html  loaded by the alpha, NEVER DISPLAYED
                                              (records/BOHEMIA_A_CHECK_POINTED_AT_
                                               THE_WRONG_DOOR_8_4_26.md)

Something that reaches only LOADED is finished work that no player can see. That
bucket is not a failure list - it is a WORK-ALREADY-PAID-FOR list, which is the
most valuable thing to know at the start of an eleven-month run.

REUSE CHECK: cooks no graphic pixels and opens no bank for content. It READS
banks/ to sample their bytes and writes no art of its own. Pure measurement -
it decides nothing and owns nothing.

    python3 tools/bohemia_reachability_census.py

Writes records/BOHEMIA_REACHABILITY_CENSUS.md and .json.
Gate: gates/reachability_gate.js
"""
import json
import os
import random
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

SHOWN = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html']
LOADED = ['slices/BOHEMIA_RUN_CURRENT.html']
OUT_MD = 'records/BOHEMIA_REACHABILITY_CENSUS.md'
OUT_JSON = 'records/BOHEMIA_REACHABILITY_CENSUS.json'

"""SAMPLE SIZE, AND WHY IT IS NOT 8.

The first version of this tool sampled 8 payloads per source and printed a
BINARY verdict, and it was wrong in the most familiar way: the door-anim bank
came out SHOWN on one sampling and NO TRACE on another, off the same bytes. A
bank holds thousands of tiles and only some of them ship, so with 8 samples the
verdict turns on WHICH EIGHT — a coin flip wearing a claim's name, which is the
exact bug that had four of this lane's gates dead for a fortnight (see
records/BOHEMIA_NOBODY_STANDS_IN_THE_STREET_ALL_DAY_8_4_26.md).

TWO FIXES, and the second matters more than the first:
  1. 32 samples instead of 8.
  2. REPORT THE FRACTION, NOT A VERDICT. "2 of 32 sampled tiles ship" and "0 of
     32" and "32 of 32" are three different facts about the world, and only one
     of them is "this bank is dead". A binary threw that away.
"""
SAMPLES = 32
MAX_READ = 60 * 1024 * 1024          # a 40 MB bank is real; do not choke on it

"""NOT EVERYTHING IS MEANT TO SHIP, and a census that cannot tell the difference
between 'unreachable' and 'never intended for the player' is just noise. Test
harnesses and judge-page tooling are DECLARED here rather than discovered, so a
NO TRACE against them reads as correct instead of alarming."""
NOT_FOR_PLAYERS = (
    'tests', '_test', 'quest_placement',   # harnesses + the judge page's own tool
)


def sample_bytes(path, want=SAMPLES):
    """A source's own distinctive content. Adaptive, because the corpus is not
    uniform: an art bank is JSON full of base64, a wardrobe bank is short pipe
    rows, an engine module is code. Falls DOWN a ladder of specificity rather
    than giving up, because 'no samples' would silently become 'no trace'."""
    try:
        if os.path.getsize(path) > MAX_READ:
            with open(path, encoding='utf8', errors='replace') as f:
                raw = f.read(MAX_READ)
        else:
            raw = open(path, encoding='utf8', errors='replace').read()
    except Exception:
        return []
    pool = []
    try:
        d = json.loads(raw)

        def walk(o):
            if isinstance(o, str):
                if len(o) >= 96:
                    pool.append(o[:96])
            elif isinstance(o, dict):
                for v in o.values():
                    walk(v)
            elif isinstance(o, list):
                for v in o:
                    walk(v)
        walk(d)
    except Exception:
        pass
    if not pool:                      # long non-comment lines (code, csv, banks)
        for ln in raw.split('\n'):
            s = ln.strip()
            if len(s) >= 96 and not s.startswith(('#', '//', '/*', '*')):
                pool.append(s[:96])
    if not pool:                      # short-row banks: NAME|layer|#hex
        for ln in raw.split('\n'):
            s = ln.strip()
            if 24 <= len(s) < 96 and not s.startswith(('#', '//')):
                pool.append(s)
    if not pool:
        for ln in raw.split('\n'):
            s = ln.strip()
            if 12 <= len(s) < 24 and not s.startswith(('#', '//')):
                pool.append(s)
    if not pool:
        return []
    random.seed(20260806)             # DETERMINISTIC: the same census twice is
    pool = sorted(set(pool))          # the same census (no Math.random verdicts)
    return random.sample(pool, min(want, len(pool)))


def classify(path, samples, shown_src, loaded_src):
    """Returns a verdict AND the fraction it rests on. The fraction is the real
    output; the verdict is a label for sorting."""
    if any(t in os.path.basename(path) for t in NOT_FOR_PLAYERS):
        return 'NOT FOR PLAYERS', 0, 0
    if not samples:
        return 'UNSAMPLED', 0, 0
    ins = sum(1 for s in samples if any(s in t for t in shown_src))
    inl = sum(1 for s in samples if any(s in t for t in loaded_src))
    if ins == len(samples):
        return 'SHOWN (all)', ins, inl
    if ins:
        return 'SHOWN (part)', ins, inl
    if inl:
        return 'LOADED ONLY', ins, inl
    return 'NO TRACE', 0, 0


def main():
    shown_src, loaded_src = [], []
    for p in SHOWN:
        if os.path.exists(p):
            shown_src.append(open(p, encoding='utf8', errors='replace').read())
    for p in LOADED:
        if os.path.exists(p):
            loaded_src.append(open(p, encoding='utf8', errors='replace').read())
    if not shown_src:
        sys.exit('FAIL: no shown surface on disk. The census has nothing to measure against.')

    sources = []
    for d, kind in (('banks', 'bank'), ('engine', 'engine')):
        if not os.path.isdir(d):
            continue
        for fn in sorted(os.listdir(d)):
            if kind == 'engine' and not fn.endswith('.js'):
                continue
            if kind == 'bank' and not fn.endswith(('.txt', '.json')):
                continue
            sources.append((os.path.join(d, fn), kind))

    rows = []
    for path, kind in sources:
        smp = sample_bytes(path)
        verdict, ns, nl = classify(path, smp, shown_src, loaded_src)
        rows.append({'path': path, 'kind': kind, 'verdict': verdict,
                     'samples': len(smp), 'hits_shown': ns, 'hits_loaded': nl,
                     'bytes': os.path.getsize(path) if os.path.exists(path) else 0})

    def tally(kind, verdict):
        return [r for r in rows if r['kind'] == kind and r['verdict'] == verdict]

    total_mb = sum(r['bytes'] for r in rows) / 1e6
    unreached_mb = sum(r['bytes'] for r in rows if r['verdict'] in ('NO TRACE', 'LOADED ONLY')) / 1e6

    out = {'sources': len(rows), 'total_mb': round(total_mb, 1),
           'unreached_mb': round(unreached_mb, 1), 'rows': rows}
    json.dump(out, open(OUT_JSON, 'w'), indent=1)

    L = []
    L.append('# THE REACHABILITY CENSUS')
    L.append('')
    L.append('*Generated by `tools/bohemia_reachability_census.py`. Do not hand-edit;')
    L.append('re-run it. Gate: `gates/reachability_gate.js`.*')
    L.append('')
    L.append('**The question nothing in this repo could answer until now: of everything')
    L.append('we have built, what reaches the surface Paolo actually taps?**')
    L.append('')
    L.append('Decided by BYTES, never by names — on 8/4 a name-based search of the same')
    L.append('kind produced four false alarms out of five, because names are a lane\'s')
    L.append('dialect and bytes are not. Each source is sampled for its own distinctive')
    L.append('content and counted as reaching a surface when those bytes appear in it')
    L.append('verbatim.')
    L.append('')
    L.append('| surface | file | what it is |')
    L.append('|---|---|---|')
    L.append('| **SHOWN** | `slices/BOHEMIA_CITY_WORLD.html` | the walked world — what the RUN tab displays |')
    L.append('| **SHOWN** | `slices/BOHEMIA_ALPHA_0_9.html` | the shell and every other tab |')
    L.append('| **LOADED** | `slices/BOHEMIA_RUN_CURRENT.html` | loaded by the alpha and **never displayed** |')
    L.append('')
    L.append('## THE COUNT')
    L.append('')
    L.append('| | banks | engine modules |')
    L.append('|---|---|---|')
    for v in ('SHOWN (all)', 'SHOWN (part)', 'LOADED ONLY', 'NO TRACE', 'NOT FOR PLAYERS', 'UNSAMPLED'):
        L.append('| %s | %d | %d |' % (v, len(tally('bank', v)), len(tally('engine', v))))
    L.append('| **total** | **%d** | **%d** |' %
             (len([r for r in rows if r['kind'] == 'bank']),
              len([r for r in rows if r['kind'] == 'engine'])))
    L.append('')
    L.append('**%.1f MB of %.1f MB** sampled does not reach the shown surface.' %
             (unreached_mb, total_mb))
    L.append('')
    L.append('> **What `NO TRACE` honestly means:** no sampled bytes of this source appear')
    L.append('> verbatim in any surface. Strong evidence it does not ship — but not proof.')
    L.append('> A bank whose art is TRANSFORMED before shipping (re-encoded, recoloured,')
    L.append('> re-tiled) reads as NO TRACE while genuinely reaching him. Those are the')
    L.append('> interesting rows, which is why every source is named below instead of')
    L.append('> only counted. Argue with the list; do not take it on faith.')
    L.append('')
    L.append('## LOADED ONLY — finished work no player can see')
    L.append('')
    L.append('*This is not a failure list. It is a **work-already-paid-for** list.*')
    L.append('')
    lo = [r for r in rows if r['verdict'] == 'LOADED ONLY']
    if lo:
        L.append('| source | kind | MB |')
        L.append('|---|---|---|')
        for r in sorted(lo, key=lambda r: -r['bytes']):
            L.append('| `%s` | %s | %.2f |' % (r['path'], r['kind'], r['bytes'] / 1e6))
    else:
        L.append('*(none)*')
    L.append('')
    L.append('## NO TRACE — biggest first')
    L.append('')
    nt = [r for r in rows if r['verdict'] == 'NO TRACE']
    L.append('| source | kind | MB |')
    L.append('|---|---|---|')
    for r in sorted(nt, key=lambda r: -r['bytes'])[:60]:
        L.append('| `%s` | %s | %.2f |' % (r['path'], r['kind'], r['bytes'] / 1e6))
    if len(nt) > 60:
        L.append('')
        L.append('*(%d more, see the .json)*' % (len(nt) - 60))
    L.append('')
    L.append('## REACHES HIM')
    L.append('')
    sh = [r for r in rows if r['verdict'].startswith('SHOWN')]
    L.append('| source | kind | samples found |')
    L.append('|---|---|---|')
    for r in sorted(sh, key=lambda r: -r['hits_shown'])[:60]:
        L.append('| `%s` | %s | %d/%d |' % (r['path'], r['kind'], r['hits_shown'], r['samples']))
    open(OUT_MD, 'w', encoding='utf8').write('\n'.join(L) + '\n')

    print('REACHABILITY CENSUS — %d sources, %.1f MB sampled' % (len(rows), total_mb))
    for k in ('bank', 'engine'):
        print('  %-7s REACHES HIM %3d | LOADED ONLY %3d | NO TRACE %3d | not-for-players %3d' % (
            k,
            len(tally(k, 'SHOWN (all)')) + len(tally(k, 'SHOWN (part)')),
            len(tally(k, 'LOADED ONLY')),
            len(tally(k, 'NO TRACE')),
            len(tally(k, 'NOT FOR PLAYERS'))))
    print('  %.1f MB of %.1f MB does not reach the shown surface' % (unreached_mb, total_mb))
    print('  -> %s' % OUT_MD)
    return 0


if __name__ == '__main__':
    sys.exit(main())
