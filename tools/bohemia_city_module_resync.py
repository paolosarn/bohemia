#!/usr/bin/env python3
"""
BOHEMIA CITY MODULE RESYNC (7/26/26, CITY lane) - the freshness fix the
byte-lock always needed.

The alpha's CITY app carries ~39 engine modules INLINED VERBATIM (the district
kit, every district generator, the overmap, powergrid, cityedit). ENGINE SYNC
LAW says one canonical body per module, and city_tab_gate byte-locks a few of
them - but the tools that embedded them (bohemia_city_districtart_patch.py and
friends) are all one-shot: they check a marker and no-op forever after. So the
moment anyone fixes a bug in engine/bohemia_commercial.js, the engine is right
and the app is silently a week behind, with nothing to re-run.

This is the missing re-run. For every embedded module it swaps the OLD body for
the CURRENT canon body, byte for byte, and says exactly which ones moved. It
finds the old body by asking git what the file used to be (walking back through
history until it finds the revision the app actually carries), so it never has
to guess at delimiters - the module sources themselves contain comment banners
that would fool any boundary scan.

  python3 tools/bohemia_city_module_resync.py            # resync, report
  python3 tools/bohemia_city_module_resync.py --check    # report only, exit 1 if stale
"""
import base64
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
# THE CITY MOVED OUT OF THE ALPHA (8/2 payload-wall pass, another lane) and its source is
# inline now rather than base64. Follow the artefact, do not assume where it lives: a
# resync that silently no-ops is worse than one that fails, because the engine and the app
# drift apart without a word.
CITY_FILES = ['slices/BOHEMIA_CITY_WORLD.html', 'slices/BOHEMIA_ALPHA_0_9.html']
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
for _c in CITY_FILES:
    if os.path.exists(_c):
        _t = open(_c, encoding='utf8').read()
        if "const CITY_B64='" in _t or 'function renderCity(){' in _t:
            ALPHA = _c
            break
CHECK = '--check' in sys.argv
DEPTH = 40          # revisions back to search for the body the app carries

alpha = open(ALPHA, encoding='utf8').read()
key = "const CITY_B64='"
INLINE = key not in alpha
if INLINE:
    a0 = a1 = 0
    decoded = alpha
else:
    a0 = alpha.index(key) + len(key)
    a1 = alpha.index("'", a0)
    decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')

# every engine module the app announces it has inlined
mods = []
for line in decoded.split('\n'):
    s = line.strip()
    if s.startswith('/* ==== engine/') and s.endswith('==== */'):
        mod = s.split('engine/', 1)[1].split(' ', 1)[0].rstrip('*=/ ')
        p = 'engine/' + mod
        if os.path.exists(p) and p not in mods:
            mods.append(p)

fresh, moved, lost = [], [], []
for p in mods:
    canon = open(p, encoding='utf8').read()
    if canon in decoded:
        fresh.append(p)
        continue
    # find which past revision of this file the app is carrying
    revs = subprocess.run(['git', 'log', '--format=%H', '-n', str(DEPTH), '--', p],
                          capture_output=True, text=True).stdout.split()
    hit = None
    for r in revs:
        old = subprocess.run(['git', 'show', '%s:%s' % (r, p)], capture_output=True, text=True)
        if old.returncode == 0 and old.stdout and old.stdout in decoded:
            hit = old.stdout
            break
    if hit is None:
        # FALLBACK: the repo was slim-genesised 7/26, so a module the app has
        # been carrying since before that has no history left to match against.
        # Cut it out by its announced banner instead - but only accept the cut
        # if it actually looks like that module's whole body (its own export
        # tail, exactly once), so a banner inside a module can never fool us.
        hdr = '/* ==== engine/' + os.path.basename(p)
        i = decoded.find(hdr)
        if i >= 0:
            i = decoded.index('\n', i) + 1
            j = decoded.find('\n/* ==== engine/', i)
            if j < 0:
                j = len(decoded)
            cand = decoded[i:j + 1]
            tail = 'root.Bohemia'
            # A CUT THAT IS TWICE THE MODULE IS NOT THE MODULE. (8/20/26.)
            # This fallback is the only path that GUESSES where a body ends -- the
            # other two match a known string. If the closing banner is missing or
            # renamed, `j` runs on past this module and `cand` swallows whatever
            # follows, and the tail-count guard alone can wave that through when
            # the swallowed modules happen not to use `root.Bohemia`.
            # WHY IT WAS ADDED, STATED HONESTLY BECAUSE THE CAUSE IS NOT PROVEN:
            # on 8/20 a mutation cycle left BOHEMIA_CITY_WORLD.html -- the file the
            # whole game is played in -- 1,159 LINES SHORTER, with the working tree
            # showing 1159 deletions and 0 insertions, and the only tool that had
            # written to it was this one. `git checkout` restored it.
            # I COULD NOT REPRODUCE IT. Re-running the same one-line edit through
            # this tool resyncs cleanly, delta 0. So this guard is NOT presented as
            # the fix for that incident -- it is the guard for the only path here
            # that GUESSES where a body ends, which is the only place a write can
            # be catastrophically larger than intended. Calling it the cure for
            # something I never reproduced would be shipping a false finding.
            oversize = len(cand) > len(canon) * 2 + 2000
            if oversize:
                print('  REFUSING: the banner cut for %s is %d bytes against a '
                      '%d byte module -- that is not one module, it is this one '
                      'plus whatever follows it. Its closing banner is missing '
                      'or renamed. NOTHING WAS WRITTEN.' % (p, len(cand), len(canon)))
                sys.exit(3)
            if canon.count(tail) > 0 and cand.count(tail) == canon.count(tail):
                hit = cand
    if hit is None:
        lost.append(p)
        continue
    if not CHECK:
        assert decoded.count(hit) == 1, 'ambiguous embedded body for ' + p
        decoded = decoded.replace(hit, canon if hit.endswith('\n') == canon.endswith('\n') else canon + '\n', 1)
    moved.append(p)

print('CITY MODULE RESYNC: %d embedded, %d already fresh' % (len(mods), len(fresh)))
for p in moved:
    print(('  STALE: ' if CHECK else '  RESYNCED: ') + p)
for p in lost:
    print('  UNRECOGNISED (neither canon nor any of the last %d revisions): %s' % (DEPTH, p))

if CHECK:
    sys.exit(1 if (moved or lost) else 0)
if moved:
    reencoded = base64.b64encode(decoded.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(decoded if INLINE else alpha[:a0] + reencoded + alpha[a1:])
    print('  -> CITY_B64 rewritten')
else:
    print('  -> nothing to do')
sys.exit(2 if lost else 0)
