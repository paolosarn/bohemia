#!/usr/bin/env python3
"""BOHEMIA — A FENCE NO TOOL CAN UNDO (8/2/26, PEOPLE lane, FLEET-WIDE).

WHY THIS EXISTS, and it is not theoretical: it shipped.

Half a dozen lanes edit each other's surfaces through marker-fenced idempotent
patch tools, because under the parallel-sessions law that is the safe way to
touch a file you do not own. Every tool works the same way: a block is bounded
by a `/* LANE:NAME */ ... /* /LANE:NAME */` pair, a re-run RESTORES each fenced
region to what was there before and then re-patches, so running it twice is
byte-identical to running it once.

THE FAILURE THE WHOLE PATTERN HAS: *** A FENCE THE TOOL STOPS EMITTING IS NOT A
FENCE THAT GOES AWAY. *** Delete a block's row from the tool's BLOCKS list and
the tool no longer emits it -- but the text it already wrote is still sitting in
the shipped file, and now nothing in the world knows how to remove it. It is
applied forever, by a tool that has forgotten it exists.

On 8/2 the PEOPLE lane did exactly this. A worker concat moved earlier in
buildSim, so its old PEOPLE:JOIN fence was dropped from BLOCKS. The orphan stayed
applied, both copies of the concat ran, and every workplace in the valley carried
44 bodies for 22 identities -- everyone standing next to a copy of himself -- with
every gate in the suite green the whole time it was live.

THE RULE THIS HOLDS: A BLOCK IS ONLY REALLY DELETED WHEN THE TOOL STILL KNOWS HOW
TO UNDO IT. If you are retiring a block, keep its row as a strip-only entry whose
anchor and insert are the same text: the patch becomes a no-op and the only work
the row does is eat its own corpse. (bohemia_people_identity_patch.py's JOIN row
is the worked example.)

READS ONLY. Cooks nothing, writes nothing, owns no lane's content.

Run: python3 gates/fence_orphan_gate.py
Registered in gates/bohemia_gates.py as FENCE ORPHAN.
"""
import collections
import glob
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASS = [0]
FAIL = []


def ok(name, cond):
    if cond:
        PASS[0] += 1
    else:
        FAIL.append(name)
        print('  FAIL: ' + name)


# A fence marker: /* LANE:NAME */ or <!-- LANE:NAME --> and their /closers.
MARK = re.compile(r'(?:/\*|<!--)\s*(/?)([A-Z][A-Z0-9_]{2,14}):([A-Z0-9_]{2,20})\s*(?:\*/|-->)')

# The surfaces the fleet's patch tools write into.
TARGETS = sorted(glob.glob(os.path.join(ROOT, 'slices', '*.html')) +
                 glob.glob(os.path.join(ROOT, 'engine', '*.js')))
TOOLSRC = sorted(glob.glob(os.path.join(ROOT, 'tools', '*.py')) +
                 glob.glob(os.path.join(ROOT, 'tools', '*.js')))


def scan(text):
    """-> {(LANE, NAME): [n_open, n_close]}"""
    seen = collections.defaultdict(lambda: [0, 0])
    for close, lane, nm in MARK.findall(text):
        seen[(lane, nm)][1 if close else 0] += 1
    return seen


def main():
    print('FENCE ORPHAN GATE — a fence no tool can undo')

    tools_text = ''
    for f in TOOLSRC:
        try:
            tools_text += open(f, encoding='utf-8', errors='ignore').read()
        except OSError:
            pass
    ok('the fleet\'s patch tools are readable (%d)' % len(TOOLSRC), len(TOOLSRC) > 5)

    orphans, unbalanced, dupes = [], [], []
    fences = 0
    for t in TARGETS:
        try:
            s = open(t, encoding='utf-8', errors='ignore').read()
        except OSError:
            continue
        base = os.path.basename(t)
        for (lane, nm), (o, c) in sorted(scan(s).items()):
            fences += 1
            full = '%s:%s' % (lane, nm)
            # 1. SOMEBODY STILL KNOWS HOW TO UNDO IT. The tool that writes a
            #    fence necessarily contains its marker text, so a marker no tool
            #    source mentions is a marker nothing can remove.
            if full not in tools_text:
                orphans.append('%s in %s' % (full, base))
            # 2. IT IS A PAIR. restore() matches open..close non-greedily; a
            #    missing or doubled closer makes it eat to the wrong place, which
            #    is the 8/1 bug where a fence came to span 29 lines of another
            #    lane's code and a re-run deleted them silently.
            if o != 1 or c != 1:
                (dupes if (o > 1 or c > 1) else unbalanced).append(
                    '%s in %s (%d open, %d close)' % (full, base, o, c))

    ok('there are real fences to check (%d across %d files)' % (fences, len(TARGETS)),
       fences >= 10)
    ok('NO ORPHANED FENCE: every applied block is one some tool still knows how '
       'to undo' + (': ' + ', '.join(orphans[:6]) if orphans else ''),
       not orphans)
    ok('every fence is a PAIR, so a restore cannot eat past its own end' +
       (': ' + ', '.join(unbalanced[:6]) if unbalanced else ''), not unbalanced)
    ok('NO BLOCK IS APPLIED TWICE' + (': ' + ', '.join(dupes[:6]) if dupes else ''),
       not dupes)

    # ---- THE GATE CHECKS ITSELF ------------------------------------------
    # A gate green on its first run has not been tested. These are the three
    # exact shapes above, built in memory, proving the checker sees them rather
    # than that the repo happens to be clean today.
    probe_orphan = '/* GHOSTLANE:NOBODYOWNSME */ x(); /* /GHOSTLANE:NOBODYOWNSME */'
    ok('SELF-TEST: an orphan is detected', 'GHOSTLANE:NOBODYOWNSME' not in tools_text
       and ('GHOSTLANE', 'NOBODYOWNSME') in scan(probe_orphan))
    half = scan('/* LANE:AAA */ x();')
    ok('SELF-TEST: a fence with no closer is detected', half[('LANE', 'AAA')] == [1, 0])
    twice = scan('/* LANE:BBB */x();/* /LANE:BBB */ /* LANE:BBB */x();/* /LANE:BBB */')
    ok('SELF-TEST: a block applied twice is detected', twice[('LANE', 'BBB')] == [2, 2])

    # ---- AND THE WORKED EXAMPLE IS STILL IN THE TOOL ---------------------
    # The lesson only survives if the pattern for retiring a block survives.
    # Matched on collapsed whitespace, because the sentence is a wrapped comment
    # and a gate that breaks when somebody re-wraps a paragraph is noise.
    tool = os.path.join(ROOT, 'tools', 'bohemia_people_identity_patch.py')
    src = open(tool, encoding='utf-8').read() if os.path.exists(tool) else ''
    flat = re.sub(r'[\s#]+', ' ', src)
    ok('the strip-only pattern is written down where the next lane will meet it',
       'a fence the tool stops emitting is NOT a fence that goes away' in flat
       and 'A block is only really deleted when the tool still knows how to undo it'
       in flat and 'B_JOIN = A_JOIN' in src)

    print('%s: %d passed, %d failed' %
          ('OK' if not FAIL else 'FAILED', PASS[0], len(FAIL)))
    return 1 if FAIL else 0


if __name__ == '__main__':
    sys.exit(main())
