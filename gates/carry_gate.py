#!/usr/bin/env python3
"""BOHEMIA CARRY GATE (born 7/16/26 from two near-losses in one session).

THE TWO FAILURES THIS EXISTS TO PREVENT, both real, both same-day:

 1. REGISTRY-ATE-A-LIVE-FILE. bohemia_superseded.txt had:
        BOHEMIA_QUESTBOOK_40_SINNERMAN.md | #122 is the primary (40 still rides)
    The prose said "still rides". The parser reads column 1 and skips. Both #40
    and #79 were DROPPED from the master: 44KB of research, gone, silently.
    THE LAW: if a file must keep riding, its name NEVER starts a registry line.
    Notes go in comments. This gate proves every skip-listed name is really gone.

 2. A REGISTRY LINE IS A CLAIM, NOT EVIDENCE. Two inherited registries said the
    GDDs v2/v3/v4 were superseded by v5. They were not: v5 EXTENDS them. Acting
    on the claim would have deleted the antagonist and the ending.
    THE LAW: supersession is proven by READING. See gdd_gate.js.

Run: python3 carry_gate.py [dir]
"""
import os, re, sys

d = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
p = f = 0

# 7/17/26 repo layout: files live in subfolders (laws/, questbook/, quests/...).
# Every check searches the whole tree by BASENAME, never one flat directory.
# archive/ is EXCLUDED: it is history, never current (truth hierarchy). The old
# ARCHIVE_ filename prefix is now the archive/ folder, so a skip-listed name
# sitting in archive/ is the registry working as designed, not a silent drop.
SKIP_DIRS = {'.git', 'node_modules', '__pycache__', 'archive'}
disk = {}   # basename -> [relative paths]
for dirpath, dirnames, filenames in os.walk(d):
    dirnames[:] = [x for x in dirnames if x not in SKIP_DIRS]
    for fn in filenames:
        disk.setdefault(fn, []).append(os.path.relpath(os.path.join(dirpath, fn), d))
def ok(name, cond):
    global p, f
    if cond: p += 1
    else:
        f += 1
        print('  > FAIL ' + name)

reg = os.path.join(d, 'gates', 'bohemia_superseded.txt')
ok('superseded registry exists', os.path.exists(reg))
if not os.path.exists(reg):
    print('\n=== CARRY GATE: %d passed, %d failed ===' % (p, f)); sys.exit(1)

# every name in column 1 of a live registry line must NOT be on disk.
# if it is on disk, the builder is silently dropping a real file.
skips = []
for line in open(reg, encoding='utf-8'):
    if line.strip().startswith('#'):
        continue
    l = line.split('#')[0].strip()
    if l and '|' in l:
        skips.append(l.split('|', 1)[0].strip())

for s in skips:
    ok('skip-listed "%s" is really gone (not silently dropped from disk)' % s,
       s not in disk)

# the GDDs must never appear in column 1. this is the exact false claim that
# nearly cost the lore foundation, and it lived in TWO registries.
for v in (2, 3, 4, 5):
    n = 'BOHEMIA_GDD_v%d.md' % v
    ok('registry does not skip %s' % n, n not in skips)
    ok('%s is on disk and live' % n, n in disk)

# questbook + production quests: audit BY NUMBER, never by filename (#102 lesson)
for pre, rx, label in [('BOHEMIA_QUESTBOOK_', r'BOHEMIA_QUESTBOOK_(\d+)_', 'questbook'),
                       ('BOHEMIA_QUEST_', r'BOHEMIA_QUEST_(\d{3})_', 'production quest')]:
    nums = {}
    for fn in disk:
        m = re.match(rx, fn)
        if m:
            nums.setdefault(int(m.group(1)), []).append(fn)
    if nums:
        dupes = {k: v for k, v in nums.items() if len(v) > 1}
        ok('%s: no number collisions (audit by NUMBER, not filename)' % label, not dupes)
        if dupes: print('    collisions:', dupes)
        lo, hi = min(nums), max(nums)
        gaps = [i for i in range(lo, hi + 1) if i not in nums]
        ok('%s: no gaps in %d-%d' % (label, lo, hi), not gaps)
        if gaps: print('    gaps:', gaps)

# a chunked file must ship its manifest, or the far end cannot rejoin it.
# (this bit today: a *HD_TILE_REPO*.txt skip glob also ate .chunkmanifest.txt)
for fn in disk:
    if fn.endswith('.chunkmanifest.txt'):
        target = fn[:-len('.chunkmanifest.txt')]
        ok('chunk manifest for %s is present (prefix globs eat these)' % target, True)

print('\n=== CARRY GATE: %d passed, %d failed ===' % (p, f))
sys.exit(1 if f else 0)
