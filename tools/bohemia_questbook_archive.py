#!/usr/bin/env python3
"""BOHEMIA QUESTBOOK ARCHIVE FACTORY (7/17/26)

Closes the named failure carried since batch 8: the ARCHIVE regenerator died
with the chat. This tool machine-appends new dives into the archive's data
array (var D=[...]) without touching the shell, the runtime, or any entry the
dead generator wrote — the same never-rewrite-history philosophy as the
masters appender. The D array is parsed as JSON, verified, extended, verified
again, and re-emitted; if any step fails, the archive is left untouched.

Entry shape (the shipped runtime's contract):
  [num, "TITLE (Game)", flowFlag, [[n,NAME,body]...], [[flaw,body,law]...],
   [[port,body,extra]...], [[node,body]...]]

Run from repo root: python3 tools/bohemia_questbook_archive.py 139 140 ...
Idempotent: refuses numbers already present in D.
"""
import json
import os
import re
import sys

ARCHIVE = 'questbook/BOHEMIA_QUESTBOOK_ARCHIVE.html'
QB = 'questbook'


def fail(msg):
    print('ARCHIVE FACTORY REFUSES: ' + msg)
    sys.exit(1)


def extract_d(html):
    """Locate var D=[...] and return (start, end, parsed) with a string-aware
    bracket scan — the texts contain brackets like [READ], so counting must
    skip string literals."""
    m = re.search(r'var D=\[', html)
    if not m:
        fail('no var D=[ found')
    i = m.end() - 1
    depth = 0
    in_str = False
    esc = False
    for j in range(i, len(html)):
        c = html[j]
        if in_str:
            if esc: esc = False
            elif c == '\\': esc = True
            elif c == '"': in_str = False
            continue
        if c == '"': in_str = True
        elif c == '[': depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                raw = html[i:j + 1]
                try:
                    return i, j + 1, json.loads(raw)
                except Exception as e:
                    fail('D array did not parse as JSON: %s' % e)
    fail('D array never closed')


def load_dive(n):
    fn = [f for f in os.listdir(QB) if re.match(r'BOHEMIA_QUESTBOOK_%d_.*\.md$' % n, f)][0]
    text = open(os.path.join(QB, fn), encoding='utf-8').read()
    title = re.search(r'#\d+ — "(.*?)"', text).group(1)
    game = re.sub(r'\s*\(\d{4}\)\s*$', '', re.search(r'\*\*Game:\*\* (.*)', text).group(1).strip())
    crafts = [[int(m.group(1)), m.group(2).strip(), m.group(3).strip()]
              for m in re.finditer(r'^W(\d+)\. ([A-Z0-9][^.]*)\. (.*)$', text, re.M)]
    flaws = [[m.group(1).strip(), ' '.join(m.group(2).split()), ' '.join(m.group(3).split())]
             for m in re.finditer(
                 r'\*\*F\d+ — (.*?)\.\*\* (.*?)\n\*\*LAW FOR BOHEMIA:\*\* (.*?)(?:\n\n|\n\*\*F|\Z)',
                 text, re.S)]
    ports = [[m.group(1).strip(), ' '.join((m.group(2) + ' — ' + m.group(3).split('\n\n')[0]).split())[:500], '']
             for m in re.finditer(
                 r'^### (PORT \d+ — .*?)\n\*\*System:\*\* (.*?)\n(.*?)(?=\n### PORT|\n---|\Z)',
                 text, re.S | re.M)]
    nodes = [[m.group(1).strip(), ' '.join(m.group(2).split())[:300]]
             for m in re.finditer(r'^### (NODE [^\n—]*)(?:—|-)?([^\n]*)\n', text, re.M)]
    flow = 1 if 'FULL EVENT FLOW' in text else 0
    return [n, '%s (%s)' % (title, game), flow, crafts, flaws, ports, nodes]


def main():
    nums = [int(a) for a in sys.argv[1:]]
    if not nums:
        print('usage: bohemia_questbook_archive.py N [N...]')
        return 1
    html = open(ARCHIVE, encoding='utf-8').read()
    start, end, D = extract_d(html)
    have = {e[0] for e in D}
    added = 0
    for n in sorted(nums):
        if n in have:
            print('skip: #%d already in the archive' % n)
            continue
        entry = load_dive(n)
        if not (entry[3] and entry[4] and entry[5]):
            fail('#%d parsed to zero in a section (craft %d flaws %d ports %d)'
                 % (n, len(entry[3]), len(entry[4]), len(entry[5])))
        D.append(entry)
        added += 1
        print('#%d: %d craft, %d flaws, %d ports, %d nodes'
              % (n, len(entry[3]), len(entry[4]), len(entry[5]), len(entry[6])))
    if not added:
        print('nothing to add.')
        return 0
    D.sort(key=lambda e: e[0])
    new_raw = json.dumps(D, ensure_ascii=False, separators=(',', ':'))
    json.loads(new_raw)  # verify round-trip before touching the file
    out = html[:start] + new_raw + html[end:]
    open(ARCHIVE, 'w', encoding='utf-8').write(out)
    total = sum(len(e[3]) + len(e[4]) + len(e[5]) + len(e[6] if len(e) > 6 and e[6] else []) for e in D)
    print('archive rebuilt: %d files, %d findings, %d bytes' % (len(D), total, len(out)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
