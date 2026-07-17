#!/usr/bin/env python3
"""
BOHEMIA GRAVEYARD GATE (7/16/26)

GRAVEYARD IS FINAL: no remakes, dead songs stay dead, fresh cooks answer dead
slots. The law was enforced by everyone remembering what died. Nobody can.

The failure mode is not somebody lovingly resurrecting a killed asset. It is a
config file three docs deep still POINTING at one, months later, because the
kill happened somewhere else and nothing swept for the pointers.

This gate greps the tree for every token in bohemia_graveyard.txt and sorts the
hits:

  TOMBSTONE      the line records the kill (DEAD / KILLED / graveyard /
                 do not re-add / DOWN / retained as the record). LEGAL — the
                 record is how the law is remembered.
  LIVE REFERENCE the line uses the token as if it still works. VIOLATION.

  python3 bohemia_graveyard_gate.py [dir] [--strict]
"""
import sys, os, re

REG = os.path.join('gates', 'bohemia_graveyard.txt')
REG_NAME = 'bohemia_graveyard.txt'
# Files that ARE the record. A report about corpses has to name the corpses, and
# the gate's own addendum quoting the violations it found is not a resurrection.
# Kept narrow on purpose: this is an exemption, and exemptions are how gates rot.
RECORD_FILES = re.compile(r'GRAVEYARD|graveyard_gate|_gate\.js$|VERDICT_RECORD', re.I)
EXT = ('.js', '.md', '.txt', '.json', '.html', '.py')
SKIP_DIRS = {'.git', 'node_modules', '__pycache__'}
# a line that says the thing is dead IS the record. It stays.
TOMBSTONE = re.compile(
    r'DEAD|KILLED|graveyard|do not re-add|do not re-?use|DOWN|retired|'
    r'superseded|removed|the record|never re-|corpse|RIP\b', re.I)

def load(root):
    out = []
    p = os.path.join(root, REG)
    if not os.path.exists(p):
        print('no %s — nothing to enforce' % REG); sys.exit(2)
    for line in open(p, encoding='utf-8'):
        line = line.split('#')[0].strip()
        if not line or '|' not in line:
            continue
        parts = [x.strip() for x in line.split('|')]
        out.append((re.compile(parts[0]), parts[0], parts[1], parts[2] if len(parts) > 2 else ''))
    return out

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    strict = '--strict' in sys.argv
    root = args[0] if args else '.'
    dead = load(root)
    live, tombs = [], 0

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if not fn.endswith(EXT) or fn == REG_NAME or RECORD_FILES.search(fn):
                continue
            p = os.path.join(dirpath, fn)
            try:
                lines = open(p, encoding='utf-8', errors='replace').read().split('\n')
            except Exception:
                continue
            for i, line in enumerate(lines):
                for rx, token, when, replacement in dead:
                    if not rx.search(line):
                        continue
                    if TOMBSTONE.search(line):
                        tombs += 1
                    else:
                        live.append((p, i + 1, token, line.strip()[:88], replacement))

    print('=' * 78)
    print('BOHEMIA GRAVEYARD GATE — GRAVEYARD IS FINAL')
    print('=' * 78)
    print('  %d dead tokens tracked · %d tombstones (legal) · %d LIVE REFERENCES'
          % (len(dead), tombs, len(live)))
    if live:
        print('\n  Live references to dead things:\n')
        for p, ln, token, text, repl in live:
            print('    %s:%d' % (os.path.relpath(p), ln))
            print('      %s' % text)
            print('      %s is dead. %s\n' % (token, repl))
    else:
        print('\n  The dead stay dead. No live references.')
    return 1 if (live and strict) else 0

if __name__ == '__main__':
    sys.exit(main())
